/**
 * SmartPARX enquiry backend — Google Apps Script web app (free, runs in your Google account).
 *
 * The static website POSTs the form here. Everything below runs on Google's servers, so a visitor or
 * bot cannot skip it. On success it emails SmartPARX (notification.html), emails the customer a
 * confirmation if they gave an address (autoreply.html), and optionally logs the lead to a Google Sheet.
 *
 * Setup: see apps-script/README.md. Configuration lives in Project Settings → Script properties:
 *   TURNSTILE_SECRET   Cloudflare Turnstile secret key (required)
 *   INQUIRY_TO         inbox that receives enquiries, e.g. ayushcon2000@gmail.com (required)
 *   ALLOWED_HOSTNAMES  comma-separated sites allowed to submit, e.g. ayus79.github.io,localhost (required)
 *   SHEET_ID           optional Google Sheet ID to log every enquiry
 */

const LIMITS = { name: 60, phone: 16, email: 120, city: 60, system: 60, spaces: 5, message: 2000 };
const PER_CONTACT_COOLDOWN_S = 60; // same phone/email: one enquiry per minute
const GLOBAL_MAX_PER_HOUR = 30; // whole site: protects the Gmail daily quota
const NAME_RE = /^[\p{L}][\p{L} .'-]{1,59}$/u;
const EMAIL_RE = /^[^\s@<>()[\],;:"]{1,64}@[a-z0-9.-]{1,253}\.[a-z]{2,24}$/i;

function doPost(e) {
  try {
    const props = PropertiesService.getScriptProperties().getProperties();
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    // 1. Honeypot: bots fill hidden fields. Answer "ok" so they don't adapt.
    if (body.company_website) return json({ ok: true, reference: reference() });

    // 2. Turnstile: proves a human solved the challenge on one of OUR sites (the free "allowed domains").
    const check = verifyTurnstile(body.turnstileToken, props);
    if (!check.ok) return json({ ok: false, error: check.error });

    // 3. Validate and sanitise every field server-side (never trust the browser).
    const data = clean(body);
    const invalid = validate(data);
    if (invalid) return json({ ok: false, error: invalid });

    // 4. Rate limits.
    const limited = rateLimit(data);
    if (limited) return json({ ok: false, error: limited });

    const params = Object.assign({}, data, {
      reference: reference(),
      submitted_at: Utilities.formatDate(new Date(), 'Asia/Kolkata', 'd MMM yyyy, h:mm a') + ' IST',
      phone_link: '+' + whatsappNumber(data.phone),
      whatsapp: whatsappNumber(data.phone),
      email: data.email || 'Not provided',
    });

    // 5. Notification to SmartPARX. The recipient is fixed here, never taken from the request.
    MailApp.sendEmail({
      to: props.INQUIRY_TO,
      subject: 'New enquiry ' + params.reference + ' · ' + params.system + ' · ' + params.city,
      htmlBody: render('notification', params),
      name: 'SmartPARX Website',
      replyTo: data.email || props.INQUIRY_TO,
    });

    // 6. Confirmation to the customer (only possible after the human + domain check above).
    if (data.email) {
      try {
        MailApp.sendEmail({
          to: data.email,
          subject: "We've received your enquiry · " + params.reference,
          htmlBody: render('autoreply', params),
          name: 'SmartPARX Parking Solutions',
          replyTo: props.INQUIRY_TO,
        });
      } catch (err) {
        console.warn('Auto-reply failed: ' + err);
      }
    }

    // 7. Optional lead log.
    if (props.SHEET_ID) logToSheet(props.SHEET_ID, params);

    return json({ ok: true, reference: params.reference, emailed: Boolean(data.email) });
  } catch (err) {
    console.error(err);
    return json({ ok: false, error: 'server' });
  }
}

/** Lets you open the web app URL in a browser to confirm it is deployed. */
function doGet() {
  return json({ ok: true, service: 'SmartPARX enquiries' });
}

function verifyTurnstile(token, props) {
  if (!token) return { ok: false, error: 'captcha' };
  const res = UrlFetchApp.fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'post',
    payload: { secret: props.TURNSTILE_SECRET, response: String(token).slice(0, 2048) },
    muteHttpExceptions: true,
  });
  const out = JSON.parse(res.getContentText() || '{}');
  if (!out.success) return { ok: false, error: 'captcha' };
  const allowed = String(props.ALLOWED_HOSTNAMES || '').split(',').map((h) => h.trim().toLowerCase()).filter(Boolean);
  if (!allowed.includes(String(out.hostname || '').toLowerCase())) return { ok: false, error: 'origin' };
  return { ok: true };
}

function oneLine(v, max) {
  return String(v || '').replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
}

function clean(b) {
  return {
    name: oneLine(b.name, LIMITS.name),
    phone: oneLine(b.phone, LIMITS.phone),
    email: oneLine(b.email, LIMITS.email).toLowerCase(),
    city: oneLine(b.city, LIMITS.city) || 'Not specified',
    system: oneLine(b.system, LIMITS.system) || 'Not specified',
    spaces: oneLine(b.spaces, LIMITS.spaces).replace(/\D/g, '') || 'Not specified',
    message:
      String(b.message || '')
        .replace(/\r\n?/g, '\n')
        .replace(/[\u0000-\u0009\u000b-\u001f\u007f]+/g, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim()
        .slice(0, LIMITS.message) || 'No additional details provided.',
    page_url: safeUrl(b.page_url),
    site_url: safeUrl(b.site_url),
  };
}

function safeUrl(v) {
  const s = oneLine(v, 300);
  return /^https?:\/\/[^\s"<>]+$/.test(s) ? s : '';
}

function validate(d) {
  const digits = d.phone.replace(/\D/g, '');
  const hasLink = (v) => /(https?:\/\/|www\.|<|>)/i.test(v);
  if (!NAME_RE.test(d.name)) return 'name';
  if (digits.length < 10 || digits.length > 13) return 'phone';
  if (d.email && !EMAIL_RE.test(d.email)) return 'email';
  if (hasLink(d.city) || hasLink(d.system)) return 'links';
  if ((d.message.match(/https?:\/\//gi) || []).length > 1) return 'links';
  return '';
}

function rateLimit(d) {
  const cache = CacheService.getScriptCache();
  const lock = LockService.getScriptLock();
  lock.waitLock(5000);
  try {
    const keys = ['c:' + d.phone.replace(/\D/g, '')].concat(d.email ? ['c:' + d.email] : []);
    if (keys.some((k) => cache.get(k))) return 'cooldown';
    const hourKey = 'g:' + Utilities.formatDate(new Date(), 'UTC', 'yyyyMMddHH');
    const count = Number(cache.get(hourKey) || 0);
    if (count >= GLOBAL_MAX_PER_HOUR) return 'busy';
    cache.put(hourKey, String(count + 1), 3600);
    keys.forEach((k) => cache.put(k, '1', PER_CONTACT_COOLDOWN_S));
    return '';
  } finally {
    lock.releaseLock();
  }
}

function whatsappNumber(phone) {
  const d = phone.replace(/\D/g, '');
  return d.length === 10 ? '91' + d : d;
}

/** Short human-readable reference, e.g. SPX-261027-4821. */
function reference() {
  return 'SPX-' + Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyMMdd') + '-' + Math.floor(1000 + Math.random() * 9000);
}

function render(file, params) {
  const t = HtmlService.createTemplateFromFile(file);
  Object.keys(params).forEach((k) => (t[k] = params[k]));
  return t.evaluate().getContent();
}

function logToSheet(id, p) {
  try {
    const sheet = SpreadsheetApp.openById(id).getSheets()[0];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Reference', 'Submitted (IST)', 'Name', 'Phone', 'Email', 'City', 'System', 'Car spaces', 'Site details', 'Page']);
    }
    // Leading apostrophe stops spreadsheet formula injection (values starting with =, +, -, @).
    const safe = (v) => (/^[=+\-@]/.test(String(v)) ? "'" + v : v);
    sheet.appendRow([p.reference, p.submitted_at, p.name, p.phone, p.email, p.city, p.system, p.spaces, p.message, p.page_url].map(safe));
  } catch (err) {
    console.warn('Sheet log failed: ' + err);
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
