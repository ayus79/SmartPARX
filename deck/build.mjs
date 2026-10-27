// SmartPARX company profile — builds SmartPARX-Company-Profile.pptx (and the PDF via export-pdf.sh).
// Facts and figures: docs/brochure-content.md. Photos: ../src/assets/images (imported from ../assets).
import pptxgen from 'pptxgenjs';
import sharp from 'sharp';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const IMG = join(here, '../src/assets/images');
const require = createRequire(import.meta.url);
const siteRequire = createRequire(join(here, '../package.json'));
const lucide = siteRequire('lucide-static');
const { applyTheme } = require(
  '/Users/ayushcontractor/.claude/skills/synced/b8ec313b-99d2-466c-9207-5559f91df06c_12131b4b-8c9d-43e6-8155-d471705722ac/pptx/scripts/apply_theme.js',
);

const OUT = join(here, 'SmartPARX-Company-Profile.pptx');

// ---------- Theme (matches the website) ----------
const HEX = {
  ink: '121A15', inkDeep: '0B110D', white: 'FFFFFF', paper: 'F4F3EE',
  green: '00A456', amber: 'F2C200', slate: '45524A', greenLight: '1FC06F', muted: '8A958E', line: 'D8D5CA',
};
const THEME = {
  name: 'SmartPARX',
  headFontFace: 'Arial',
  bodyFontFace: 'Arial',
  colors: {
    dk1: HEX.ink, lt1: HEX.white, dk2: HEX.inkDeep, lt2: HEX.paper,
    accent1: HEX.green, accent2: HEX.amber, accent3: HEX.slate, accent4: HEX.greenLight, accent5: HEX.muted, accent6: HEX.line,
    hlink: '008044', folHlink: HEX.slate,
  },
};
const MONO = 'Courier New';

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE'; // 13.333 x 7.5 in
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
pres.title = 'SmartPARX — Company Profile';
pres.author = 'SmartPARX Parking Solutions LLP';
pres.company = 'SmartPARX Parking Solutions LLP';
pres.subject = 'Automated car parking systems, designed and built in-house';
const C = pres.SchemeColor;
const COL = {
  ink: C.text1, inkDeep: C.text2, white: C.background1, paper: C.background2,
  green: C.accent1, amber: C.accent2, slate: C.accent3, greenLight: C.accent4, muted: C.accent5, line: C.accent6,
};

const W = 13.333, H = 7.5, M = 0.6;

// ---------- Layouts ----------
pres.defineSlideMaster({
  title: 'DARK',
  background: { color: COL.inkDeep },
  objects: [
    { placeholder: { options: { name: 'title', type: 'title', x: M, y: 2.6, w: 6.3, h: 2.2, fontSize: 44, bold: true, color: COL.white, align: 'left', valign: 'top', margin: 0 }, text: '' } },
  ],
});
pres.defineSlideMaster({
  title: 'CONTENT',
  background: { color: COL.white },
  objects: [
    { placeholder: { options: { name: 'title', type: 'title', x: M, y: 0.72, w: W - 2 * M, h: 0.8, fontSize: 30, bold: true, color: COL.ink, align: 'left', valign: 'top', margin: 0 }, text: '' } },
    { text: { text: 'SmartPARX Parking Solutions LLP  ·  Company Profile', options: { x: M, y: 7.02, w: 6, h: 0.3, fontSize: 9, color: COL.slate, margin: 0 } } },
  ],
  slideNumber: { x: W - M - 0.5, y: 7.02, w: 0.5, h: 0.3, fontSize: 9, color: COL.slate, align: 'right' },
});

// ---------- Helpers ----------
const DPI = 200;
/** Photo cropped to fill w×h inches, with rounded corners baked in against the slide background. */
async function photo(file, w, h, bg = HEX.white, radius = 0.2, position = 'centre') {
  const pw = Math.round(w * DPI), ph = Math.round(h * DPI), r = Math.round(radius * DPI);
  let img = sharp(join(IMG, file)).rotate().resize(pw, ph, { fit: 'cover', position });
  if (r > 0) {
    const mask = Buffer.from(`<svg width="${pw}" height="${ph}"><rect width="${pw}" height="${ph}" rx="${r}" ry="${r}" fill="#fff"/></svg>`);
    img = sharp(await img.png().toBuffer()).composite([{ input: mask, blend: 'dest-in' }]).flatten({ background: `#${bg}` });
  }
  const buf = await img.jpeg({ quality: 84, mozjpeg: true }).toBuffer();
  return 'image/jpeg;base64,' + buf.toString('base64');
}
const png = (file) => 'image/png;base64,' + readFileSync(join(IMG, file)).toString('base64');
async function icon(name, color = HEX.white, size = 256) {
  const svg = lucide[name]
    .replace(/stroke="currentColor"/, `stroke="#${color}"`)
    .replace(/width="24"/, `width="${size}"`)
    .replace(/height="24"/, `height="${size}"`)
    .replace(/stroke-width="2"/, 'stroke-width="1.75"');
  return 'image/png;base64,' + (await sharp(Buffer.from(svg)).png().toBuffer()).toString('base64');
}

function kicker(slide, text, { x = M, y = 0.42, w = 8, dark = false } = {}) {
  slide.addText(text.toUpperCase(), {
    x, y, w, h: 0.26, fontFace: MONO, fontSize: 11, charSpacing: 2, color: dark ? COL.muted : COL.slate, margin: 0, isTextBox: true,
  });
}
function wordmark(slide, { x = M, y = 0.5, size = 26, dark = true } = {}) {
  slide.addText(
    [
      { text: 'Smart', options: { color: dark ? COL.white : COL.ink, bold: true } },
      { text: 'PARX', options: { color: COL.green, bold: true } },
    ],
    { x, y, w: 4, h: 0.5, fontSize: size, margin: 0, isTextBox: true },
  );
  slide.addText('Do it the smart way', { x, y: y + 0.48, w: 4, h: 0.26, fontSize: 11, italic: true, color: dark ? COL.muted : COL.slate, margin: 0, isTextBox: true });
}
const sh = () => ({ type: 'outer', color: '0B110D', opacity: 0.12, blur: 10, offset: 3, angle: 90 });

// ---------- Content (source: docs/brochure-content.md) ----------
const MODELS = [
  { name: 'Economy', code: 'DPE01–06', img: 'products/economy.jpg', cap: 2000, rev: 1450, base: '1000 mm', weight: '700 kg', mech: 'Telescopic cylinder + balancing chain', finish: 'Enamel, red-oxide primer' },
  { name: 'Premium', code: 'DPP01–03', img: 'products/premium.jpg', cap: 2300, rev: 1800, base: '1800 mm', weight: '800 kg', mech: 'Larger telescopic cylinder, Italian DAS seals', finish: 'All-weather PU, zinc epoxy' },
  { name: 'Premium+', code: 'DPP+', img: 'products/premium-plus.jpg', cap: 2500, rev: 2000, base: '2500 mm', weight: '880 kg', mech: 'Single-stroke cylinder, 2:1 chain', finish: 'Powder coat; HDG on request' },
  { name: 'Luxury+', code: 'DPL+', img: 'products/luxury-plus.jpg', cap: 2700, rev: 2350, base: '3200 mm', weight: '1020 kg', mech: 'Dual cylinders + dual chains', finish: 'Powder coat; HDG on request' },
];

// =====================================================================
async function build() {
  // 1 — Cover
  pres.addSection({ title: 'Introduction' });
  let s = pres.addSlide({ masterName: 'DARK', sectionTitle: 'Introduction' });
  s.addImage({ data: await photo('projects/two-level-1.jpg', 6.0, H, HEX.inkDeep, 0, 'centre'), x: W - 6.0, y: 0, w: 6.0, h: H, altText: 'Row of SmartPARX two-post parking stackers in a basement' });
  wordmark(s, { y: 0.6 });
  kicker(s, 'Company profile', { y: 2.25, dark: true });
  s.addText(
    [
      { text: 'Automated car parking systems, ', options: { color: COL.white } },
      { text: 'designed and built in-house.', options: { color: COL.greenLight } },
    ],
    { placeholder: 'title', fontSize: 40 },
  );
  s.addText('Two-post stackers  ·  Heavy-duty  ·  Puzzle  ·  Pit  ·  Custom', { x: M, y: 5.05, w: 6.4, h: 0.35, fontSize: 15, color: COL.line, margin: 0, isTextBox: true });
  s.addText('Ahmedabad, India  ·  Since 2017  ·  ISO 9001:2015', { x: M, y: 6.55, w: 6.4, h: 0.3, fontFace: MONO, fontSize: 11, color: COL.muted, margin: 0, isTextBox: true });
  s.addNotes('SmartPARX Parking Solutions LLP designs, manufactures and installs car parking systems from Ahmedabad. This profile covers who we are, the product range, planning guidance, manufacturing, projects and how to start a project.');

  // 2 — At a glance
  s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Introduction' });
  kicker(s, 'At a glance');
  s.addText('2500+ parking systems installed since 2017', { placeholder: 'title' });
  const stats = [
    { v: '2500+', l: 'Parking systems installed', fill: COL.green, fg: COL.inkDeep, sub: COL.inkDeep },
    { v: '70+', l: 'Builder & enterprise clients', fill: COL.paper, fg: COL.ink, sub: COL.slate },
    { v: '10+', l: 'Two-level stacker models', fill: COL.paper, fg: COL.ink, sub: COL.slate },
    { v: '2+5', l: 'Years warranty with AMC', fill: COL.inkDeep, fg: COL.white, sub: COL.line },
  ];
  const cw = (W - 2 * M - 3 * 0.3) / 4;
  stats.forEach((st, i) => {
    const x = M + i * (cw + 0.3);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.85, w: cw, h: 2.25, fill: { color: st.fill }, rectRadius: 0.18, line: { type: 'none' }, objectName: `Stat ${st.v}` });
    s.addText(st.v, { x: x + 0.3, y: 2.15, w: cw - 0.6, h: 1.0, fontSize: 54, bold: true, color: st.fg, margin: 0, isTextBox: true });
    s.addText(st.l, { x: x + 0.3, y: 3.3, w: cw - 0.6, h: 0.5, fontSize: 14, color: st.sub, margin: 0, isTextBox: true });
  });
  const facts = [
    { ic: 'Award', t: 'ISO 9001:2015 certified', d: 'Technical training and quality control at the centre of every project.' },
    { ic: 'Factory', t: 'Two production units', d: 'In-house manufacturing at Vatva GIDC, Ahmedabad.' },
    { ic: 'Gauge', t: 'Indigenous hydraulics', d: 'Cylinders and power units built through our Shalin Hydraulics partnership.' },
    { ic: 'Zap', t: 'EV charging compatible', d: 'Every SmartPARX system supports EV charging provisions.' },
  ];
  for (const [i, f] of facts.entries()) {
    const x = M + i * (cw + 0.3);
    s.addShape(pres.shapes.OVAL, { x, y: 4.55, w: 0.6, h: 0.6, fill: { color: COL.ink }, line: { type: 'none' } });
    s.addImage({ data: await icon(f.ic, HEX.greenLight), x: x + 0.15, y: 4.7, w: 0.3, h: 0.3, altText: '' });
    s.addText(f.t, { x, y: 5.35, w: cw, h: 0.35, fontSize: 16, bold: true, color: COL.ink, margin: 0, isTextBox: true });
    s.addText(f.d, { x, y: 5.75, w: cw - 0.1, h: 0.9, fontSize: 13, color: COL.slate, margin: 0, valign: 'top', isTextBox: true });
  }
  s.addNotes('Headline numbers from the SmartPARX brochure: 2500+ systems installed, 70+ clients, 10+ two-level stacker models, and a 2-year zero-pay warranty plus 5 more years with an AMC.');

  // 3 — About
  s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Introduction' });
  kicker(s, 'About us');
  s.addText('Specialists in one thing: fitting more cars', { placeholder: 'title' });
  s.addText(
    [
      { text: 'SmartPARX is a specialty car parking manufacturing brand, established in 2017 and founded by Mr. Aakash Contractor. We design, manufacture and execute customised parking equipment.', options: { breakLine: true, paraSpaceAfter: 12 } },
      { text: 'Our partnership with Shalin Hydraulics makes us the only brand in the market with indigenous hydraulic solutions and an in-house manufacturing plant.', options: { breakLine: true, paraSpaceAfter: 12 } },
      { text: 'From stacker parking to tower, puzzle and pit systems, our engineers and technicians work to ISO 9001:2015, with quality control built into every step.' },
    ],
    { x: M, y: 1.85, w: 6.0, h: 4.8, fontSize: 16, color: COL.slate, valign: 'top', margin: 0, lineSpacingMultiple: 1.15, isTextBox: true },
  );
  s.addImage({ data: await photo('projects/triple-5.jpg', 5.6, 4.85, HEX.white, 0.22, 'centre'), x: W - M - 5.6, y: 1.85, w: 5.6, h: 4.85, altText: 'SmartPARX three-level stacker holding three cars' });
  s.addNotes('Founded 2017 by Aakash Contractor. Key differentiator: indigenous hydraulics through Shalin Hydraulics plus our own manufacturing plant, so cylinders, power units and structures are built and tested under one roof.');

  // 4 — Why SmartPARX
  s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Introduction' });
  kicker(s, 'Why SmartPARX');
  s.addText('Six reasons developers choose us', { placeholder: 'title' });
  const why = [
    { ic: 'DraftingCompass', t: 'Dynamic, robust design', d: 'In-house R&D team and state-of-the-art engineering practice. Zero tolerance on quality.' },
    { ic: 'Factory', t: 'Built in-house', d: 'Steel, cylinders and power units made in our two Ahmedabad units.' },
    { ic: 'Wrench', t: 'Quick, accurate installation', d: 'Installed right the first time, so service calls stay rare.' },
    { ic: 'Ruler', t: 'Customisation', d: 'Parking lifts from 1.8 m to 10 m, built around walls and D-walls.' },
    { ic: 'Layers', t: 'Widest range', d: 'The only company offering 10+ two-level stacker models.' },
    { ic: 'ShieldCheck', t: '2 + 5 year warranty', d: '2 years zero-pay warranty, plus 5 more years with an AMC.' },
  ];
  const gw = (W - 2 * M - 2 * 0.3) / 3, gh = 2.35;
  for (const [i, f] of why.entries()) {
    const x = M + (i % 3) * (gw + 0.3), y = 1.85 + Math.floor(i / 3) * (gh + 0.3);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: gw, h: gh, fill: { color: COL.paper }, rectRadius: 0.16, line: { type: 'none' }, objectName: `Reason ${i + 1}` });
    s.addShape(pres.shapes.OVAL, { x: x + 0.35, y: y + 0.35, w: 0.65, h: 0.65, fill: { color: COL.green }, line: { type: 'none' } });
    s.addImage({ data: await icon(f.ic, HEX.inkDeep), x: x + 0.51, y: y + 0.51, w: 0.33, h: 0.33, altText: '' });
    s.addText(f.t, { x: x + 0.35, y: y + 1.15, w: gw - 0.7, h: 0.4, fontSize: 17, bold: true, color: COL.ink, margin: 0, isTextBox: true });
    s.addText(f.d, { x: x + 0.35, y: y + 1.55, w: gw - 0.7, h: 0.7, fontSize: 13, color: COL.slate, margin: 0, valign: 'top', isTextBox: true });
  }
  s.addNotes('Brochure differentiators: robust in-house design, in-house manufacturing, quick installation, customisation from 1.8 m to 10 m, the widest range (10+ models) and the 2 + 5 year warranty.');

  // 5 — Divider: Product range
  pres.addSection({ title: 'Product range' });
  s = pres.addSlide({ masterName: 'DARK', sectionTitle: 'Product range' });
  s.addImage({ data: await photo('projects/triple-4.jpg', 5.6, H, HEX.inkDeep, 0, 'centre'), x: W - 5.6, y: 0, w: 5.6, h: H, altText: 'SmartPARX three-level stacker with three cars' });
  s.addText('01', { x: M, y: 1.2, w: 3, h: 1.2, fontSize: 80, bold: true, color: COL.green, margin: 0, isTextBox: true });
  s.addText('Product range', { placeholder: 'title', y: 2.75, h: 1.0 });
  s.addText('Twelve systems across four families: two-post stackers, heavy-duty, multi-level and puzzle, and specialised builds.', { x: M, y: 3.95, w: 6.4, h: 1.2, fontSize: 18, color: COL.line, valign: 'top', margin: 0, isTextBox: true });
  s.addNotes('The range covers two-post stackers (Economy, Premium, Premium+, Luxury+), heavy-duty systems (2L3PS+, four-pole suspended), multi-level and puzzle systems (puzzle, TPP+ three-level, pit) and specialised builds (single post, two-wheeler, customised).');

  // 6 — Two-post comparison
  s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Product range' });
  kicker(s, 'Two-post stackers');
  s.addText('Four models, one for every car and budget', { placeholder: 'title' });
  const firstCol = 2.3, mcw = (W - 2 * M - firstCol) / 4;
  for (const [i, m] of MODELS.entries()) {
    const x = M + firstCol + i * mcw;
    s.addImage({ data: await photo(m.img, mcw - 0.2, 1.75, HEX.white, 0.14, 'centre'), x: x + 0.1, y: 1.65, w: mcw - 0.2, h: 1.75, altText: `${m.name} two-post stacker render` });
  }
  const head = (t) => ({ text: t, options: { bold: true, color: COL.white, fill: { color: COL.ink }, fontSize: 14 } });
  const lab = (t) => ({ text: t, options: { bold: true, color: COL.slate, fontSize: 12 } });
  const cell = (t, o = {}) => ({ text: t, options: { color: COL.ink, fontSize: 12, ...o } });
  const rows = [
    [{ text: '', options: { fill: { color: COL.ink } } }, ...MODELS.map((m) => head(m.name))],
    [lab('Variants'), ...MODELS.map((m) => cell(m.code))],
    [lab('Lifting capacity'), ...MODELS.map((m) => cell(`${m.cap.toLocaleString('en-IN')} kg`, { bold: true, color: COL.ink }))],
    [lab('Reverse parking'), ...MODELS.map((m) => cell(`Up to ${m.rev.toLocaleString('en-IN')} kg`))],
    [lab('Base length'), ...MODELS.map((m) => cell(m.base))],
    [lab('System weight'), ...MODELS.map((m) => cell(m.weight))],
    [lab('Lift mechanism'), ...MODELS.map((m) => cell(m.mech))],
    [lab('Finish'), ...MODELS.map((m) => cell(m.finish))],
  ];
  s.addTable(rows, {
    x: M, y: 3.55, w: W - 2 * M, colW: [firstCol, mcw, mcw, mcw, mcw],
    rowH: [0.38, 0.34, 0.34, 0.34, 0.34, 0.34, 0.42, 0.42], margin: [0.04, 0.12, 0.04, 0.12],
    border: { type: 'solid', pt: 0.75, color: HEX.line }, valign: 'middle', fontFace: THEME.bodyFontFace,
  });
  s.addNotes('All four share platform widths of 2100–2400 mm (Luxury+ 2200–2400) and a 3 HP motor. Premium+ and Luxury+ use robotic-welded heavy-gauge columns with extra-long bases, so no upper supports or slab punctures are needed.');

  // 7 — Capacity chart
  s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Product range' });
  kicker(s, 'Choosing a model');
  s.addText('Choose by the heaviest car, and whether it parks in reverse', { placeholder: 'title' });
  // Drawn from shapes rather than addChart(): Keynote, which exports the PDF, renders pptxgenjs charts blank.
  {
    const cx = M, cy = 1.85, cwid = 7.9, chgt = 4.6, axisY = cy + chgt - 0.45, maxKg = 3000;
    const plotTop = cy + 0.55, plotH = axisY - plotTop;
    s.addText('Load limits by model (kg)', { x: cx, y: cy, w: cwid, h: 0.35, fontSize: 14, bold: true, color: COL.ink, margin: 0, isTextBox: true });
    for (let v = 0; v <= maxKg; v += 1000) {
      const y = axisY - (v / maxKg) * plotH;
      s.addShape(pres.shapes.LINE, { x: cx + 0.75, y, w: cwid - 0.75, h: 0, line: { color: v === 0 ? HEX.muted : 'E7E5DD', width: v === 0 ? 1 : 0.75 } });
      s.addText(v.toLocaleString('en-IN'), { x: cx, y: y - 0.14, w: 0.65, h: 0.28, fontSize: 10, color: COL.slate, align: 'right', margin: 0, isTextBox: true });
    }
    const group = (cwid - 0.75) / MODELS.length, bw = 0.62;
    MODELS.forEach((m, i) => {
      const gx = cx + 0.75 + i * group + (group - 2 * bw - 0.12) / 2;
      [[m.cap, COL.green], [m.rev, COL.amber]].forEach(([kg, color], j) => {
        const bh = (kg / maxKg) * plotH, bx = gx + j * (bw + 0.12);
        s.addShape(pres.shapes.RECTANGLE, { x: bx, y: axisY - bh, w: bw, h: bh, fill: { color }, line: { type: 'none' }, objectName: `${m.name} ${j ? 'reverse' : 'capacity'}` });
        s.addText(kg.toLocaleString('en-IN'), { x: bx - 0.15, y: axisY - bh - 0.3, w: bw + 0.3, h: 0.26, fontSize: 11, bold: true, color: COL.ink, align: 'center', margin: 0, isTextBox: true });
      });
      s.addText(m.name, { x: cx + 0.75 + i * group, y: axisY + 0.08, w: group, h: 0.3, fontSize: 13, bold: true, color: COL.ink, align: 'center', margin: 0, isTextBox: true });
    });
    [['Lifting capacity', COL.green], ['Reverse parking limit', COL.amber]].forEach(([label, color], i) => {
      const lx = cx + 0.75 + i * 2.6;
      s.addShape(pres.shapes.RECTANGLE, { x: lx, y: cy + chgt + 0.02, w: 0.22, h: 0.22, fill: { color }, line: { type: 'none' } });
      s.addText(label, { x: lx + 0.32, y: cy + chgt - 0.02, w: 2.2, h: 0.3, fontSize: 12, color: COL.slate, margin: 0, isTextBox: true });
    });
  }
  const guide = [
    { t: 'Everyday sedans', d: 'Economy lifts up to 2,000 kg for budget-friendly projects.' },
    { t: 'Reverse parking', d: 'Premium and Premium+ raise the reverse limit to 1,800 and 2,000 kg.' },
    { t: 'Luxury cars & SUVs', d: 'Luxury+ lifts 2,700 kg, load-tested to 3 tonnes for reverse parking.' },
  ];
  guide.forEach((g, i) => {
    const y = 1.95 + i * 1.6;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 8.9, y, w: W - M - 8.9, h: 1.35, fill: { color: COL.paper }, rectRadius: 0.14, line: { type: 'none' } });
    s.addText(g.t, { x: 9.15, y: y + 0.18, w: W - M - 9.4, h: 0.35, fontSize: 16, bold: true, color: COL.ink, margin: 0, isTextBox: true });
    s.addText(g.d, { x: 9.15, y: y + 0.55, w: W - M - 9.4, h: 0.7, fontSize: 13, color: COL.slate, margin: 0, valign: 'top', isTextBox: true });
  });
  s.addNotes('Reverse parking puts more load on the cantilever, so each model has a lower advised limit for reverse-parked cars. Figures from the brochure spec sheets.');

  // 8 — Heavy duty
  s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Product range' });
  kicker(s, 'Heavy-duty systems');
  s.addText('Structural-steel frames for wide platforms and long spans', { placeholder: 'title' });
  const heavy = [
    { img: 'products/three-pole-2l3ps.jpg', pos: 'centre', t: 'Three Pole System 2L3PS+', specs: [['Capacity', '2,500 kg'], ['Platform', '2,200 – 2,700 mm'], ['Weight', '1,080 kg'], ['Structure', 'ISMB 150 × 75 columns, ISMC channel'], ['Drive', 'Telescopic cylinder, double rope, 3 HP']] },
    { img: 'products/four-pole-suspended.jpg', pos: 'south', t: 'Four Pole Suspended (2×2 / 2×3)', specs: [['Capacity', '2,200 / 2,700 kg'], ['Platform', '2,100 – 2,700 mm'], ['Weight', '550 kg per car space'], ['Structure', 'I-section / H-beam frame'], ['Drive', 'Motor gearbox 3 / 5 HP, 4-way lifting']] },
  ];
  const hw = (W - 2 * M - 0.4) / 2;
  for (const [i, h] of heavy.entries()) {
    const x = M + i * (hw + 0.4);
    s.addImage({ data: await photo(h.img, hw, 2.35, HEX.white, 0.18, h.pos), x, y: 1.75, w: hw, h: 2.35, altText: h.t });
    s.addText(h.t, { x, y: 4.3, w: hw, h: 0.4, fontSize: 18, bold: true, color: COL.ink, margin: 0, isTextBox: true });
    const colW = (hw - 0.3) / 2;
    h.specs.forEach(([k, v], j) => {
      const cx2 = x + (j < 3 ? 0 : colW + 0.3), y = 4.85 + (j < 3 ? j : j - 3) * 0.62;
      s.addText(k.toUpperCase(), { x: cx2, y, w: colW, h: 0.22, fontFace: MONO, fontSize: 10, color: COL.slate, margin: 0, isTextBox: true });
      s.addText(v, { x: cx2, y: y + 0.22, w: colW, h: 0.38, fontSize: 13, bold: true, color: COL.ink, margin: 0, valign: 'top', isTextBox: true });
    });
  }
  s.addNotes('Both support add-ons: limit switch, car presence, height and length sensors, EV charging provision and wider platforms. All-weather powder coating with zinc epoxy primer; hot-dip galvanizing on request.');

  // 9 — Multi-level & specialised
  s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Product range' });
  kicker(s, 'Multi-level, puzzle & specialised');
  s.addText('More levels, tighter sites, unusual structures', { placeholder: 'title' });
  const tiles = [
    { img: 'products/puzzle-2-level.jpg', t: 'Puzzle Parking', d: 'Motorised pallets; any car on demand' },
    { img: 'projects/triple-4.jpg', t: 'Three Level TPP+', d: 'Three cars in one bay' },
    { img: 'products/pit-puzzle.jpg', t: 'Pit / Pit-Puzzle', d: '2,000 / 2,500 kg, below grade' },
    { img: 'projects/customized-1.jpg', t: 'Customized', d: 'Lifts from 1.8 m to 10 m' },
  ];
  const tw = 3.75, th = 1.95;
  for (const [i, t] of tiles.entries()) {
    const x = M + (i % 2) * (tw + 0.3), y = 1.75 + Math.floor(i / 2) * (th + 0.6);
    s.addImage({ data: await photo(t.img, tw, th, HEX.white, 0.16, 'centre'), x, y, w: tw, h: th, altText: t.t });
    s.addText([{ text: t.t, options: { bold: true, color: COL.ink, breakLine: true } }, { text: t.d, options: { color: COL.slate, fontSize: 12 } }], { x, y: y + th + 0.04, w: tw, h: 0.42, fontSize: 14, margin: 0, isTextBox: true, valign: 'top' });
  }
  const px = M + 2 * (tw + 0.3) + 0.1, pw = W - M - px;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: px, y: 1.75, w: pw, h: 4.95, fill: { color: COL.paper }, rectRadius: 0.16, line: { type: 'none' } });
  s.addText('ALSO FOR TIGHT SPACES', { x: px + 0.35, y: 2.05, w: pw - 0.7, h: 0.3, fontFace: MONO, fontSize: 11, color: COL.slate, margin: 0, isTextBox: true });
  const extra = [
    ['Single Post', '2,000 kg · 2,100 mm platform. One laser-cut column for bays against walls or D-walls.'],
    ['Two Wheeler', '300 kg · 800 – 1,400 mm platforms on shared hydraulic lines. Doubles bike parking.'],
    ['Before or after BU/OC', 'Specialised systems can be installed before or after permission, fitted around existing structure.'],
  ];
  extra.forEach(([t, d], i) => {
    const y = 2.55 + i * 1.35;
    s.addText(t, { x: px + 0.35, y, w: pw - 0.7, h: 0.35, fontSize: 16, bold: true, color: COL.ink, margin: 0, isTextBox: true });
    s.addText(d, { x: px + 0.35, y: y + 0.38, w: pw - 0.7, h: 0.85, fontSize: 13, color: COL.slate, margin: 0, valign: 'top', isTextBox: true });
  });
  s.addNotes('Puzzle and three-level specifications are configured per site after a survey. Pit systems suit sites where overhead clearance is limited.');

  // 10 — Divider: Planning & safety
  pres.addSection({ title: 'Planning & safety' });
  s = pres.addSlide({ masterName: 'DARK', sectionTitle: 'Planning & safety' });
  s.addImage({ data: await photo('projects/two-level-5.jpg', 5.6, H, HEX.inkDeep, 0, 'centre'), x: W - 5.6, y: 0, w: 5.6, h: H, altText: 'Row of SmartPARX stacker columns' });
  s.addText('02', { x: M, y: 1.2, w: 3, h: 1.2, fontSize: 80, bold: true, color: COL.green, margin: 0, isTextBox: true });
  s.addText('Planning & safety', { placeholder: 'title', y: 2.75, h: 1.0 });
  s.addText('The clear heights, column spacing and driveway widths our engineers plan for, and the protections built into every system.', { x: M, y: 3.95, w: 6.4, h: 1.3, fontSize: 18, color: COL.line, valign: 'top', margin: 0, isTextBox: true });
  s.addNotes('Planning guidance from the brochure stacker guidelines, followed by built-in safety features and house rules for residents.');

  // 11 — Planning guide
  s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Planning & safety' });
  kicker(s, 'Stacker planning guide');
  s.addText('Will it fit? Clear height, width and driveway', { placeholder: 'title' });
  const heights = [['Sedan + Sedan', '3,400', '1,700'], ['SUV + Sedan', '3,800', '2,100'], ['SUV + SUV', '4,300', '2,100']];
  const hcw = 2.5;
  heights.forEach(([c, t, l], i) => {
    const x = M + i * (hcw + 0.25);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.75, w: hcw, h: 2.2, fill: { color: i === 0 ? COL.inkDeep : COL.paper }, rectRadius: 0.16, line: { type: 'none' } });
    s.addText(c.toUpperCase(), { x: x + 0.25, y: 1.98, w: hcw - 0.5, h: 0.28, fontFace: MONO, fontSize: 10, color: i === 0 ? COL.muted : COL.slate, margin: 0, isTextBox: true });
    s.addText([{ text: t, options: { fontSize: 40, bold: true } }, { text: ' mm', options: { fontSize: 16 } }], { x: x + 0.25, y: 2.4, w: hcw - 0.5, h: 0.75, color: i === 0 ? COL.white : COL.ink, margin: 0, isTextBox: true });
    s.addText(`Clear height · lower level ${l} mm`, { x: x + 0.25, y: 3.3, w: hcw - 0.5, h: 0.45, fontSize: 12, color: i === 0 ? COL.line : COL.slate, margin: 0, valign: 'top', isTextBox: true });
  });
  s.addText('Width between columns (mm)', { x: M, y: 4.25, w: 7.75, h: 0.35, fontSize: 15, bold: true, color: COL.ink, margin: 0, isTextBox: true });
  const wrows = [
    ['Usable platform', '1 bay', '2 bays', '3 bays'].map((t) => ({ text: t, options: { bold: true, color: COL.white, fill: { color: COL.ink } } })),
    ...[[2100, 2480, 4960, 7440], [2200, 2580, 5160, 7740], [2300, 2680, 5360, 8040], [2400, 2780, 5560, 8340]].map((r) =>
      r.map((v, j) => ({
        text: j === 0 ? `${v.toLocaleString('en-IN')} mm${v === 2200 ? '  (recommended)' : ''}` : v.toLocaleString('en-IN'),
        options: { color: COL.ink, bold: j === 0, fill: { color: r[0] === 2200 ? 'E7F6EE' : HEX.white } },
      })),
    ),
  ];
  s.addTable(wrows, { x: M, y: 4.65, w: 7.75, colW: [2.95, 1.6, 1.6, 1.6], rowH: 0.36, fontSize: 12, margin: [0.03, 0.12, 0.03, 0.12], border: { type: 'solid', pt: 0.75, color: HEX.line }, valign: 'middle' });
  const dx = 8.85, dw = W - M - dx;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: dx, y: 1.75, w: dw, h: 4.95, fill: { color: COL.paper }, rectRadius: 0.16, line: { type: 'none' } });
  const drive = [['5,150 mm', 'Bay length for cars up to 5 m (4,000 + 700 front)'], ['5,500 mm', 'Minimum driveway'], ['6,000 mm', 'Driveway for cars longer than 4.7 m'], ['2,200 mm', 'Recommended minimum platform width']];
  drive.forEach(([v, d], i) => {
    const y = 2.05 + i * 1.12;
    s.addText(v, { x: dx + 0.35, y, w: dw - 0.7, h: 0.45, fontSize: 22, bold: true, color: COL.ink, margin: 0, isTextBox: true });
    s.addText(d, { x: dx + 0.35, y: y + 0.45, w: dw - 0.7, h: 0.5, fontSize: 12, color: COL.slate, margin: 0, valign: 'top', isTextBox: true });
  });
  s.addNotes('Heights exclude fire-suppression pipes, plumbing and other services. Column clearance varies ±100 mm between standard models. A free site survey confirms the final layout.');

  // 12 — Safety
  s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Planning & safety' });
  kicker(s, 'Safety');
  s.addText('Three protections built into every system', { placeholder: 'title' });
  const safety = [
    { ic: 'Lock', t: 'Auto-lock on both columns', d: 'Spring-return mechanical locks hold the platform if hydraulics ever fail or leak. Standard on every model.' },
    { ic: 'Gauge', t: 'Height-adjustable limit switch', d: 'Prevents motor overload and over-travel, and sets the top position to your slab or beam.' },
    { ic: 'Car', t: 'Presence + height sensors', d: 'Stops the platform lowering onto a parked car, and stops tall cars touching the slab or services.' },
  ];
  const sw = (W - 2 * M - 2 * 0.3) / 3;
  for (const [i, f] of safety.entries()) {
    const x = M + i * (sw + 0.3);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.75, w: sw, h: 2.6, fill: { color: COL.inkDeep }, rectRadius: 0.16, line: { type: 'none' } });
    s.addShape(pres.shapes.OVAL, { x: x + 0.35, y: 2.05, w: 0.65, h: 0.65, fill: { color: COL.green }, line: { type: 'none' } });
    s.addImage({ data: await icon(f.ic, HEX.inkDeep), x: x + 0.51, y: 2.21, w: 0.33, h: 0.33, altText: '' });
    s.addText(f.t, { x: x + 0.35, y: 2.85, w: sw - 0.7, h: 0.4, fontSize: 16, bold: true, color: COL.white, margin: 0, valign: 'top', fit: 'none', isTextBox: true });
    s.addText(f.d, { x: x + 0.35, y: 3.3, w: sw - 0.7, h: 0.95, fontSize: 13, color: COL.line, margin: 0, valign: 'top', isTextBox: true });
  }
  s.addText('House rules for drivers', { x: M, y: 4.7, w: 6, h: 0.35, fontSize: 16, bold: true, color: COL.ink, margin: 0, isTextBox: true });
  const rules = ['Drive onto the platform at 5–10 km/h', 'The car must touch the platform stop bar', 'Never wash cars on or below the platform', 'Keep approach slopes at 4% or less', 'Keep column anchors out of standing water'];
  s.addText(
    rules.map((r, i) => ({ text: r, options: { bullet: { code: '25A0' }, breakLine: i < rules.length - 1 } })),
    { x: M, y: 5.1, w: 6.1, h: 1.65, fontSize: 13, color: COL.slate, margin: 0, paraSpaceAfter: 4, valign: 'top', isTextBox: true },
  );
  s.addImage({ data: await photo('projects/two-level-3.jpg', 5.8, 2.05, HEX.white, 0.16, 'centre'), x: W - M - 5.8, y: 4.65, w: 5.8, h: 2.05, altText: 'SmartPARX stacker columns with yellow safety finish' });
  s.addNotes('The three built-in protections are standard. The house rules come from the brochure and should be shared with residents and drivers at handover.');

  // 13 — Divider: Made in Ahmedabad
  pres.addSection({ title: 'Made in Ahmedabad' });
  s = pres.addSlide({ masterName: 'DARK', sectionTitle: 'Made in Ahmedabad' });
  s.addImage({ data: await photo('factory/unit-2.jpg', 5.6, H, HEX.inkDeep, 0, 'centre'), x: W - 5.6, y: 0, w: 5.6, h: H, altText: 'SmartPARX manufacturing Unit 2' });
  s.addText('03', { x: M, y: 1.2, w: 3, h: 1.2, fontSize: 80, bold: true, color: COL.green, margin: 0, isTextBox: true });
  s.addText('Made in Ahmedabad', { placeholder: 'title', y: 2.75, h: 1.0 });
  s.addText('How we build, where we have installed, and who trusts us.', { x: M, y: 3.95, w: 6.4, h: 1.0, fontSize: 18, color: COL.line, valign: 'top', margin: 0, isTextBox: true });
  s.addNotes('Manufacturing process, installations and clients.');

  // 14 — Manufacturing
  s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Made in Ahmedabad' });
  kicker(s, 'Manufacturing');
  s.addText('We make the steel and the hydraulics', { placeholder: 'title' });
  s.addImage({ data: await photo('factory/unit-1.jpg', 4.05, 2.55, HEX.white, 0.16, 'centre'), x: M, y: 1.75, w: 4.05, h: 2.55, altText: 'SmartPARX manufacturing Unit 1, Vatva GIDC' });
  s.addImage({ data: await photo('projects/three-level-1.jpg', 4.05, 2.55, HEX.white, 0.16, 'centre'), x: M + 4.35, y: 1.75, w: 4.05, h: 2.55, altText: 'Three-level stacker frame in fabrication' });
  s.addText('Unit 1 · Vatva GIDC, Phase-IV', { x: M, y: 4.33, w: 4.05, h: 0.28, fontFace: MONO, fontSize: 10, color: COL.slate, margin: 0, isTextBox: true });
  s.addText('Frames fabricated in-house', { x: M + 4.35, y: 4.33, w: 4.05, h: 0.28, fontFace: MONO, fontSize: 10, color: COL.slate, margin: 0, isTextBox: true });
  s.addText('A fleet of Indian, American, Chinese, Swiss and German machinery, from laser cutting to honing. Every power unit is tested for its maximum rated capacity before it leaves the plant.', { x: 9.35, y: 1.75, w: W - M - 9.35, h: 2.55, fontSize: 15, color: COL.slate, margin: 0, valign: 'top', lineSpacingMultiple: 1.15, isTextBox: true });
  const steps = ['Laser / plasma cutting', 'Shearing & bending', 'Robotic / MIG welding', 'CNC turret / VMC', 'Honing', 'Fabrication', 'Assembly', 'Coating & paint', 'Testing', 'Packaging & delivery'];
  const stw = (W - 2 * M - 4 * 0.2) / 5;
  steps.forEach((st, i) => {
    const x = M + (i % 5) * (stw + 0.2), y = 4.85 + Math.floor(i / 5) * 0.95;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: stw, h: 0.75, fill: { color: COL.paper }, rectRadius: 0.12, line: { type: 'none' } });
    s.addText(String(i + 1).padStart(2, '0'), { x: x + 0.2, y, w: 0.5, h: 0.75, fontFace: MONO, fontSize: 12, bold: true, color: '008044', valign: 'middle', margin: 0, isTextBox: true });
    s.addText(st, { x: x + 0.7, y, w: stw - 0.85, h: 0.75, fontSize: 13, bold: true, color: COL.ink, valign: 'middle', margin: 0, isTextBox: true });
  });
  s.addNotes('Ten-step in-house process from the brochure: cutting, forming, welding, machining, honing, fabrication, assembly, coating, testing and delivery.');

  // 15 — Projects
  s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Made in Ahmedabad' });
  kicker(s, 'Projects');
  s.addText('Installed across residential and commercial sites', { placeholder: 'title' });
  s.addImage({ data: await photo('projects/two-level-2.jpg', 6.0, 4.95, HEX.white, 0.18, 'centre'), x: M, y: 1.75, w: 6.0, h: 4.95, altText: 'Row of SmartPARX two-post stackers' });
  const grid = [
    ['projects/sarvopari-shayona.jpg', 'Sarvopari, Chanakyapuri — Shayona Group'],
    ['projects/puzzle-multilevel-2.jpg', 'Multi-level puzzle structure'],
    ['projects/triple-1.jpg', 'Three-level TPP+ stacker'],
    ['projects/two-level-6.jpg', 'Two-post stacker'],
  ];
  const gx = M + 6.3, gwid = (W - M - gx - 0.3) / 2, ghgt = 2.05;
  for (const [i, [f, cap]] of grid.entries()) {
    const x = gx + (i % 2) * (gwid + 0.3), y = 1.75 + Math.floor(i / 2) * (ghgt + 0.45);
    s.addImage({ data: await photo(f, gwid, ghgt, HEX.white, 0.16, 'centre'), x, y, w: gwid, h: ghgt, altText: cap });
    s.addText(cap, { x, y: y + ghgt + 0.05, w: gwid, h: 0.3, fontSize: 11, color: COL.slate, margin: 0, isTextBox: true });
  }
  s.addNotes('A selection of installations. More photos at smartparx.com/projects.');

  // 16 — Clients & testimonials
  s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Made in Ahmedabad' });
  kicker(s, 'Clients');
  s.addText('Trusted by 70+ developers and enterprises', { placeholder: 'title' });
  const logos = ['avirat', 'corus', 'moksha', 'nakshatra', 'sahajanand', 'samruddhi', 'sanelite', 'shayona', 'setu', 'triveni', 'utpal'];
  const lw = 1.72, lh = 0.92, lg = 0.18;
  for (const [i, l] of logos.entries()) {
    const x = M + (i % 4) * (lw + lg), y = 1.75 + Math.floor(i / 4) * (lh + lg);
    const dark = l === 'avirat';
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: lw, h: lh, fill: { color: dark ? COL.inkDeep : COL.white }, line: { color: HEX.line, width: 0.75 }, rectRadius: 0.1 });
    const meta = await sharp(join(IMG, `clients/${l}.png`)).metadata();
    const maxW = lw - 0.35, maxH = lh - 0.3, ratio = Math.min(maxW / meta.width, maxH / meta.height);
    const iw = meta.width * ratio, ih = meta.height * ratio;
    s.addImage({ data: png(`clients/${l}.png`), x: x + (lw - iw) / 2, y: y + (lh - ih) / 2, w: iw, h: ih, altText: `${l} logo` });
  }
  const quotes = [
    ['“We chose SmartPARX again for our 1200 luxury apartments near Naranpura.”', 'Shri Mayur Gurjar, Partner, Gunatit Infrastructure'],
    ['“Over 550 parking spaces across multiple developments. We value their honest, transparent approach.”', 'Shri Kanu Patel, Chairman, Avirat Group'],
    ['“Used daily at The Obelisk for six years. They’ve consistently honoured the AMC.”', 'Shri Sunil Modi, Partner, Sanelite Group'],
  ];
  const qx = M + 4 * (lw + lg) + 0.15, qw = W - M - qx;
  quotes.forEach(([q, who], i) => {
    const y = 1.75 + i * 1.65;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: qx, y, w: qw, h: 1.45, fill: { color: i === 0 ? COL.inkDeep : COL.paper }, rectRadius: 0.14, line: { type: 'none' } });
    s.addText(q, { x: qx + 0.3, y: y + 0.15, w: qw - 0.6, h: 0.85, fontSize: 14, bold: true, color: i === 0 ? COL.white : COL.ink, margin: 0, valign: 'top', isTextBox: true });
    s.addText(who, { x: qx + 0.3, y: y + 1.02, w: qw - 0.6, h: 0.3, fontSize: 11, color: i === 0 ? COL.line : COL.slate, margin: 0, isTextBox: true });
  });
  s.addNotes('Testimonials are from the SmartPARX brochure. Confirm written permission from each client before external distribution.');

  // 17 — Warranty & services
  pres.addSection({ title: 'Working with us' });
  s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Working with us' });
  kicker(s, 'Warranty & services');
  s.addText('One team from site survey to service', { placeholder: 'title' });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y: 1.75, w: 4.2, h: 4.95, fill: { color: COL.green }, rectRadius: 0.18, line: { type: 'none' } });
  s.addText('2+5', { x: M + 0.4, y: 2.0, w: 3.5, h: 1.6, fontSize: 96, bold: true, color: COL.inkDeep, margin: 0, isTextBox: true });
  s.addText('years of cover', { x: M + 0.4, y: 3.6, w: 3.5, h: 0.45, fontSize: 22, bold: true, color: COL.inkDeep, margin: 0, isTextBox: true });
  s.addText('2 years zero-pay warranty as standard, plus an additional 5 years with an AMC contract.', { x: M + 0.4, y: 4.25, w: 3.45, h: 1.05, fontSize: 14, color: COL.inkDeep, margin: 0, valign: 'top', isTextBox: true });
  s.addText('Excludes damage from water logging, debris, theft, fire and natural events.', { x: M + 0.4, y: 5.85, w: 3.45, h: 0.6, fontSize: 10, color: COL.inkDeep, margin: 0, valign: 'top', isTextBox: true });
  const services = [
    ['Site survey & feasibility', 'Clear height, column spacing and driveway checked against our guidelines.'],
    ['Customised design', 'Lifts from 1.8 m to 10 m, built around walls and D-walls.'],
    ['In-house manufacturing', 'Two Ahmedabad units and indigenous hydraulics.'],
    ['Installation & commissioning', 'Our own crews anchor, align, load-test and train your team.'],
    ['Warranty & AMC', 'Scheduled maintenance that keeps systems running safely.'],
  ];
  const svx = M + 4.55, svw = W - M - svx;
  services.forEach(([t, d], i) => {
    const y = 1.75 + i * 1.0;
    s.addShape(pres.shapes.OVAL, { x: svx, y: y + 0.12, w: 0.6, h: 0.6, fill: { color: COL.inkDeep }, line: { type: 'none' } });
    s.addText(String(i + 1).padStart(2, '0'), { x: svx, y: y + 0.12, w: 0.6, h: 0.6, fontFace: MONO, fontSize: 12, bold: true, color: COL.greenLight, align: 'center', valign: 'middle', margin: 0, isTextBox: true });
    s.addText(t, { x: svx + 0.85, y: y + 0.05, w: svw - 0.85, h: 0.38, fontSize: 16, bold: true, color: COL.ink, margin: 0, isTextBox: true });
    s.addText(d, { x: svx + 0.85, y: y + 0.43, w: svw - 0.85, h: 0.42, fontSize: 13, color: COL.slate, margin: 0, valign: 'top', isTextBox: true });
  });
  s.addNotes('SmartPARX is the only company offering a 2-year zero-pay warranty plus 5 more years with an AMC.');

  // 18 — Contact
  s = pres.addSlide({ masterName: 'DARK', sectionTitle: 'Working with us' });
  s.addImage({ data: await photo('projects/two-level-4.jpg', 5.6, H, HEX.inkDeep, 0, 'centre'), x: W - 5.6, y: 0, w: 5.6, h: H, altText: 'SmartPARX stacker platforms' });
  wordmark(s, { y: 0.6 });
  // Own text box: Keynote applies the layout's 44pt to the title placeholder, which wraps here.
  s.addText("Let's plan your parking", { x: M, y: 2.5, w: 6.4, h: 0.7, fontSize: 36, bold: true, color: COL.white, margin: 0, isTextBox: true, objectName: 'Title' });
  s.addText('Book a free site survey and quotation with our engineering team.', { x: M, y: 3.35, w: 6.4, h: 0.45, fontSize: 18, color: COL.line, margin: 0, isTextBox: true });
  const contact = [
    ['Call / WhatsApp', '+91 99250 36201  ·  +91 97129 37203'],
    ['Email', 'info@smartparx.com'],
    ['Head office', '302, Atlantis One, Sagar Sangeet Cross Roads, Ahmedabad 380060'],
    ['Factory', 'C1/4524-2, Vatva GIDC, Phase-IV, Ahmedabad 382445'],
  ];
  contact.forEach(([k, v], i) => {
    const y = 4.1 + i * 0.64;
    s.addText(k.toUpperCase(), { x: M, y, w: 6.4, h: 0.25, fontFace: MONO, fontSize: 10, color: COL.muted, margin: 0, isTextBox: true });
    s.addText(v, { x: M, y: y + 0.25, w: 6.4, h: 0.36, fontSize: 14, bold: i < 2, color: COL.white, margin: 0, isTextBox: true });
  });
  s.addText('www.smartparx.com', { x: M, y: 6.75, w: 4, h: 0.3, fontSize: 13, bold: true, color: COL.greenLight, margin: 0, isTextBox: true });
  s.addNotes('Close with the free site survey offer and contact details. Leave this slide up during Q&A.');

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log('wrote', OUT);
}

build().catch((e) => {
  console.error(e);
  process.exit(1);
});
