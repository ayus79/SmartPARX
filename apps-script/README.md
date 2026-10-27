# Enquiry form backend (free)

The site is static, so enquiries go to a small **Google Apps Script** web app that you own. It runs on
Google's servers, so its checks can't be bypassed, and it sends the emails from your Gmail:

| Email | Template | To | When |
| --- | --- | --- | --- |
| New enquiry | `notification.html` | `INQUIRY_TO` (fixed, set below) | Every valid enquiry |
| Confirmation | `autoreply.html` | The customer | Only if they entered an email |

**Security, all free:** Cloudflare **Turnstile** proves a real person submitted the form *on an allowed site*
(the backend checks the hostname, which is the "allowed domains" lock), plus server-side validation,
sanitising, per-contact and site-wide rate limits, and a recipient that never comes from the browser.

Free limits: Gmail sends ~100 emails/day from a personal account; Turnstile and Apps Script are free.

## 1. Cloudflare Turnstile (5 min)

1. Sign up free at dash.cloudflare.com → **Turnstile → Add widget**.
2. Name: `SmartPARX enquiries`. **Hostnames:** `ayus79.github.io` and `localhost`. Mode: **Managed**.
3. Copy the **Site key** (public) and the **Secret key** (private).

## 2. Apps Script backend (10 min)

1. Sign in to the Google account that should send the emails, go to script.google.com → **New project**,
   rename it `SmartPARX enquiries`.
2. Replace the contents of `Code.gs` with `apps-script/Code.gs` from this repo.
3. **+ (Add file) → HTML**, name it `notification` (no extension) and paste `notification.html`.
   Do the same for `autoreply`.
4. **Project Settings (gear) → Script properties → Add property**:

   | Property | Value |
   | --- | --- |
   | `TURNSTILE_SECRET` | the Turnstile **Secret key** |
   | `INQUIRY_TO` | `ayushcon2000@gmail.com` (testing; `info@smartparx.com` at launch) |
   | `ALLOWED_HOSTNAMES` | `ayus79.github.io,localhost` |
   | `SHEET_ID` | *(optional)* ID of a Google Sheet to log every lead — the part of its URL between `/d/` and `/edit` |

5. **Deploy → New deployment → type: Web app**. Execute as: **Me**. Who has access: **Anyone**. Deploy,
   approve the permissions (Gmail, external requests, and Sheets if used) and copy the **Web app URL**
   (ends in `/exec`). "Anyone" only means the URL can receive posts; every post still has to pass Turnstile.
6. Check it: opening the URL in a browser should show `{"ok":true,"service":"SmartPARX enquiries"}`.

After editing `Code.gs` later, use **Deploy → Manage deployments → Edit → Version: New version** so the
same URL serves the new code.

## 3. Connect the website (2 values)

| GitHub variable | `.env` (local) | Value |
| --- | --- | --- |
| `FORM_ENDPOINT` | `PUBLIC_FORM_ENDPOINT` | the Apps Script **Web app URL** (…/exec) |
| `TURNSTILE_SITE_KEY` | `PUBLIC_TURNSTILE_SITE_KEY` | the Turnstile **Site key** |

- **Local:** create a file named `.env` in the project root (it is gitignored, never committed):

  ```
  PUBLIC_FORM_ENDPOINT=https://script.google.com/macros/s/XXXX/exec
  PUBLIC_TURNSTILE_SITE_KEY=0x4AAAA...
  ```

  then run `npm run dev` and open `http://localhost:4321/contact`.
- **GitHub Pages:** repo **Settings → Secrets and variables → Actions → Variables → New repository variable**
  for each, then **Actions → Deploy to GitHub Pages → Run workflow** (or push). Use *Variables*, not
  *Secrets*: both values are public by design.

Until both are set, the form falls back to opening the visitor's mail app with the details pre-filled.

## Going live on a real domain later

Add the domain to the Turnstile widget's hostnames and to `ALLOWED_HOSTNAMES`, and set `INQUIRY_TO` to the
business inbox. No website code changes needed.
