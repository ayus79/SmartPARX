// Company facts. Source of truth: the client brochure (docs/brochure-content.md) and ./assets.
export const SITE = {
  name: 'SmartPARX',
  fullName: 'SmartPARX Parking Solutions LLP',
  tagline: 'Do it the smart way',
  description:
    'ISO 9001:2015 car parking system manufacturer in Ahmedabad. Stack parking, puzzle, pit and two-wheeler systems: 2500+ installed, with a 2 + 5 year warranty.',
  keywords:
    'car parking system manufacturer Ahmedabad, two post parking stacker, stack parking system, hydraulic car parking lift, puzzle parking system, pit parking system, two wheeler parking system, car parking stacker price India, multi level car parking Gujarat',
  url: 'https://www.smartparx.com',
  ogImage: '/images/og-cover.jpg',
  founded: '2017',
  founder: 'Aakash Contractor',
  phone: ['+91 99250 36201', '+91 97129 37203'],
  phoneLinks: ['+919925036201', '+919712937203'],
  whatsapp: '919925036201',
  email: 'info@smartparx.com',
  office: {
    label: 'Head Office',
    line1: '302, Atlantis One',
    line2: 'Sagar Sangeet Cross Roads',
    city: 'Ahmedabad, Gujarat 380060',
  },
  factory: {
    label: 'Factory',
    line1: 'C1/4524-2, Vatva GIDC',
    line2: 'Phase-IV',
    city: 'Ahmedabad, Gujarat 382445',
  },
  hours: 'Mon – Fri · 10:00 AM – 6:00 PM',
  mapEmbedUrl:
    'https://www.google.com/maps?q=302+Atlantis+One+Sagar+Sangeet+Cross+Roads+Ahmedabad+380060&output=embed',
  certifications: ['ISO 9001:2015', 'Make in India'],
  // Add real profile URLs here once created; empty entries are not rendered or added to schema.
  social: {
    facebook: '',
    instagram: '',
    linkedin: '',
    youtube: '',
  },
} as const;

export const STATS = [
  { value: '2500+', label: 'Parking systems installed' },
  { value: '70+', label: 'Builder & enterprise clients' },
  { value: '10+', label: 'Two-level stacker models' },
  { value: '2+5', label: 'Years warranty with AMC' },
] as const;

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Products', href: '/products' },
  { label: 'Services', href: '/services' },
  { label: 'Planning Guide', href: '/planning-guide' },
  { label: 'Projects', href: '/projects' },
  { label: 'Contact Us', href: '/contact' },
] as const;

export const MANUFACTURING_STEPS = [
  { title: 'Laser & plasma cutting', detail: 'Steel sections cut to drawing on CNC laser and plasma tables.' },
  { title: 'Shearing & bending', detail: 'Platforms and columns formed on press brakes and shears.' },
  { title: 'Robotic & MIG welding', detail: 'Heavy-gauge columns robot-welded for repeatable strength.' },
  { title: 'CNC turret, VMC & honing', detail: 'Hydraulic cylinders machined and honed in-house.' },
  { title: 'Coating & assembly', detail: 'Zinc epoxy primer, all-weather powder coat, then assembly.' },
  { title: 'Testing & delivery', detail: 'Load-tested power units, packed and shipped to site.' },
] as const;

export const SERVICES = [
  {
    title: 'Site survey & feasibility',
    description:
      'We measure clear height, column spacing and driveway width against our stacker guidelines and tell you exactly how many cars your basement can take.',
  },
  {
    title: 'Customized design',
    description:
      'Lift heights from 1.8 m to 10 m, systems built around walls, D-walls and retaining walls - before or after BU/OC permission.',
  },
  {
    title: 'In-house manufacturing',
    description:
      'Two production units in Ahmedabad and indigenous hydraulics through our partnership with Shalin Hydraulics. No imported lead times.',
  },
  {
    title: 'Installation & commissioning',
    description:
      'Our own installation crews anchor, align, plumb and load-test every system, then train your facility team.',
  },
  {
    title: 'Warranty & AMC',
    description:
      '2 years zero-pay warranty as standard, plus an additional 5 years of warranty with an Annual Maintenance Contract.',
  },
] as const;

export const SAFETY_FEATURES = [
  {
    title: 'Auto-lock on both columns',
    description:
      'Spring-return mechanical locks hold the platform if hydraulics ever fail or leak. Standard on every model.',
  },
  {
    title: 'Height-adjustable limit switch',
    description:
      'Prevents motor overload and platform over-travel, and lets us set the top position to your slab or beam bottom.',
  },
  {
    title: 'Car presence + height sensors',
    description:
      'Stops the upper platform lowering onto a parked car, and stops tall cars touching the slab, beams or services.',
  },
] as const;

export const TESTIMONIALS = [
  {
    quote:
      'After a successful initial project with SmartPARX we chose them again for our 1200 luxury apartments near Naranpura - and they have been delivering beyond expectations.',
    name: 'Shri Mayur Gurjar',
    role: 'Partner, Gunatit Infrastructure Pvt. Ltd.',
    since: '2025',
  },
  {
    quote:
      'SmartParx has successfully created over 550 parking spaces for us across multiple developments. What we truly value is their honest, transparent approach to business.',
    name: 'Shri Kanu Patel',
    role: 'Chairman, Avirat Group',
    since: '2021',
  },
  {
    quote:
      'We’ve been using SmartPARX at The Obelisk for over six years. The systems are used daily by our cinema visitors, café and hotel customers and co-working members. They’ve consistently honoured the AMC with no hidden charges.',
    name: 'Shri Sunil Modi',
    role: 'Partner, Sanelite Group',
    since: '2019',
  },
  {
    quote:
      'Our association began in 2018 and we’ve completed four projects together. Their execution is always excellent, and support when needed is prompt and professional.',
    name: 'Shri Suresh Patel',
    role: 'Chairman, Shayona Group',
    since: '2018',
  },
  {
    quote:
      'We’ve used both their 4-pole and 2-pole systems - all exceptionally sturdy and reliable. Service needs have been rare, and when required their team has responded swiftly.',
    name: 'Shri Prince Dharu',
    role: 'Partner, RV Group – Nakshatra',
    since: '2017',
  },
  {
    quote:
      'We began working with SmartParx in 2024 and have completed three projects since. Their team is always quick to respond, and their honest consultation is something we cherish.',
    name: 'Shri Dhruv Shah',
    role: 'Director, Solitaire Group',
    since: '2024',
  },
] as const;

// Stacker planning data from the brochure "Parking Stacker Guidelines" page.
export const HEIGHT_GUIDE = [
  { combo: 'Sedan + Sedan', total: 3400, lower: 1700 },
  { combo: 'SUV + Sedan', total: 3800, lower: 2100 },
  { combo: 'SUV + SUV', total: 4300, lower: 2100 },
] as const;

export const WIDTH_GUIDE = [
  { platform: 2100, bays: [2480, 4960, 7440] },
  { platform: 2200, bays: [2580, 5160, 7740] },
  { platform: 2300, bays: [2680, 5360, 8040] },
  { platform: 2400, bays: [2780, 5560, 8340] },
] as const;
