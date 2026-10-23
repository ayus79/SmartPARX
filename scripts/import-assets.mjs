// Imports client-provided files from ./assets (the source of truth) into
// web-ready copies under ./src/assets/images. Re-run after the client adds or replaces files:
//   node scripts/import-assets.mjs
import sharp from 'sharp';
import { mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

const SRC = 'assets';
const OUT = 'src/assets/images';
const DRIVE = 'drive-download-20261023T154810Z-1-001';
const SEL = 'Website selected';

/** [source path relative to ./assets, output path relative to OUT] */
const MAP = [
  // Product renders
  [`${DRIVE}/ECONOMY.JPG`, 'products/economy.jpg'],
  [`${DRIVE}/PREMIUM.JPG`, 'products/premium.jpg'],
  [`${DRIVE}/1.PNG`, 'products/premium-alt.jpg'],
  [`${DRIVE}/PREMIUM+.JPG`, 'products/premium-plus.jpg'],
  [`${DRIVE}/PREMIUM(+) CAR PARKING STACKER LIFT.jpg`, 'products/premium-plus-alt-1.jpg'],
  [`${DRIVE}/PREMIUM(+) SINGLE CYLINDER PARKING LIFT.jpg`, 'products/premium-plus-alt-2.jpg'],
  [`${DRIVE}/LUXURY+.JPG`, 'products/luxury-plus.jpg'],
  [`${DRIVE}/luxury(+)CAR PARKING LIFT SYSTEM.jpg`, 'products/luxury-plus-alt-1.jpg'],
  [`${DRIVE}/luxury(+) HYDRAULIC CAR PARKING SYSTEM.jpg`, 'products/luxury-plus-alt-2.jpg'],
  [`${DRIVE}/luxury(+) STACK PARKING LIFT.jpg`, 'products/luxury-plus-alt-3.jpg'],
  [`${DRIVE}/2L3PS.JPG`, 'products/three-pole-2l3ps.jpg'],
  [`${DRIVE}/SmartPARX_Suspended_2 level.jpg`, 'products/four-pole-suspended.jpg'],
  [`${DRIVE}/PIT PUZZLE PARKING SYSTEM.jpeg`, 'products/pit-puzzle.jpg'],
  [`${DRIVE}/2 LEVEL MOTORISED PUZZLE PARKING_1.jpeg`, 'products/puzzle-2-level.jpg'],
  [`${DRIVE}/2 LEVEL MOTORISED PUZZLE PARKING.jpg`, 'products/puzzle-2-level-alt.jpg'],

  // Installations & projects
  [`${SEL}/Twolevel/20230719_175620.jpg`, 'projects/two-level-1.jpg'],
  [`${SEL}/Twolevel/20230719_175624.jpg`, 'projects/two-level-2.jpg'],
  [`${SEL}/Twolevel/20230719_175606.jpg`, 'projects/two-level-3.jpg'],
  [`${SEL}/Twolevel/20230719_175646.jpg`, 'projects/two-level-4.jpg'],
  [`${SEL}/Twolevel/20230719_175705.jpg`, 'projects/two-level-5.jpg'],
  [`${SEL}/Twolevel/20220615_132206.jpg`, 'projects/two-level-6.jpg'],
  [`${SEL}/Threelevel/20221126_145204.jpg`, 'projects/three-level-1.jpg'],
  ['Triple Parking Photos/1.png', 'projects/triple-1.jpg'],
  ['Triple Parking Photos/2.png', 'projects/triple-2.jpg'],
  ['Triple Parking Photos/4.png', 'projects/triple-3.jpg'],
  ['Triple Parking Photos/¦s1.jpg', 'projects/triple-4.jpg'],
  ['Triple Parking Photos/¦s2.png', 'projects/triple-5.jpg'],
  ['Triple Parking Photos/¦s3.png', 'projects/triple-6.jpg'],
  [`${SEL}/Puzzleparking/WhatsApp Image 2021-07-31 at 2.24.39 PM (1).jpeg`, 'projects/puzzle-multilevel-1.jpg'],
  [`${SEL}/Puzzleparking/WhatsApp Image 2021-07-31 at 2.24.39 PM (2).jpeg`, 'projects/puzzle-multilevel-2.jpg'],
  [`${SEL}/Customized/20230621_180332.jpg`, 'projects/customized-1.jpg'],
  [`${SEL}/Our work/sarvopari-chanakyapuri_ahmedabad-ahmedabad-shayona_group.webp`, 'projects/sarvopari-shayona.jpg'],
  [`${SEL}/Common/puzzle_parking_banner2 (1).jpg`, 'common/puzzle-banner.jpg'],
  [`${SEL}/Common/Автопарк.jpg`, 'common/tower-stack.jpg'],

  // Factory
  [`${SEL}/About us/20220415_112745.jpg`, 'factory/unit-1.jpg'],
  [`${SEL}/About us/20220415_110232.jpg`, 'factory/unit-2.jpg'],

  // Client logos (kept as PNG for transparency/sharp text)
  ['Clients Logo/Avirat-logo.png', 'clients/avirat.png'],
  ['Clients Logo/Corus Infrastructure.png', 'clients/corus.png'],
  ['Clients Logo/Moksha Enclave.png', 'clients/moksha.png'],
  ['Clients Logo/Nakshatra.png', 'clients/nakshatra.png'],
  ['Clients Logo/Sahajanand Group.png', 'clients/sahajanand.png'],
  ['Clients Logo/Samruddhi Ashruti.png', 'clients/samruddhi.png'],
  ['Clients Logo/Sanalite Group.png', 'clients/sanelite.png'],
  ['Clients Logo/Sayona Group.png', 'clients/shayona.png'],
  ['Clients Logo/Setu.png', 'clients/setu.png'],
  ['Clients Logo/Triveni Infra.png', 'clients/triveni.png'],
  ['Clients Logo/Utpal space LLP.png', 'clients/utpal.png'],
];

let done = 0;
for (const [from, to] of MAP) {
  const src = join(SRC, from);
  // File names from the client may differ only in case (e.g. avirat-logo.png).
  const resolved = existsSync(src) ? src : join(SRC, from.replace(/\/([^/]+)$/, (_, f) => `/${f.toLowerCase()}`));
  if (!existsSync(resolved)) {
    console.warn(`missing: ${from}`);
    continue;
  }
  const dest = join(OUT, to);
  mkdirSync(dirname(dest), { recursive: true });
  const img = sharp(resolved).rotate().resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true });
  if (to.endsWith('.png')) await img.png().toFile(dest);
  else await img.flatten({ background: '#ffffff' }).jpeg({ quality: 82, mozjpeg: true }).toFile(dest);
  done++;
}
console.log(`imported ${done}/${MAP.length} files into ${OUT}`);

// Social share image (1200 × 630) built from the hero installation photo.
const og = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0.25" stop-color="#0b110d" stop-opacity="0"/><stop offset="1" stop-color="#0b110d" stop-opacity="0.92"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <text x="64" y="400" font-family="Helvetica Neue, Arial, sans-serif" font-size="68" font-weight="700" letter-spacing="-2.5" fill="#fff">Automated car parking systems,</text><text x="64" y="476" font-family="Helvetica Neue, Arial, sans-serif" font-size="68" font-weight="700" letter-spacing="-2.5" fill="#1fc06f">designed and built in-house.</text>
  <text x="64" y="540" font-family="Helvetica Neue, Arial, sans-serif" font-size="30" fill="#d8d5ca">SmartPARX · Car parking systems · 2500+ installed · Ahmedabad</text>
  <text x="64" y="96" font-family="Helvetica Neue, Arial, sans-serif" font-size="44" font-weight="700" letter-spacing="-1.5" fill="#fff">Smart<tspan fill="#1fc06f">PARX</tspan></text>
</svg>`);
mkdirSync('public/images', { recursive: true });
await sharp(join(OUT, 'projects/two-level-1.jpg'))
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .composite([{ input: og }])
  .jpeg({ quality: 85, mozjpeg: true })
  .toFile('public/images/og-cover.jpg');
console.log('wrote public/images/og-cover.jpg');
