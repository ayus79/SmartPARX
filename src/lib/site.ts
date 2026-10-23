export const SITE = {
  name: 'SmartPARX',
  fullName: 'SmartPARX Parking Solution',
  tagline: 'Automated & Mechanical Parking Solutions',
  description:
    'SmartPARX designs, manufactures, and installs automated and mechanical car parking systems across India - stackers, puzzle systems, pit parking, and vertical circulation solutions engineered for hotels, malls, apartments, and commercial towers.',
  keywords:
    'automated car parking system, mechanical parking system manufacturer, car parking stacker India, puzzle parking system, pit parking system, vertical circulation parking, two level car parking, three level car parking, parking lift manufacturer Ahmedabad, smart parking solutions Gujarat',
  url: 'https://www.smartparx.com',
  logo: '/images/og-cover.jpg',
  founded: '1989',
  geo: { latitude: 22.9767, longitude: 72.6339 },
  phone: ['+91 99250 36201', '+91 97129 37343'],
  phoneLinks: ['+919925036201', '+919712937343'],
  whatsapp: '919925036201',
  email: 'info.smartparx@gmail.com',
  address: {
    line1: '4524/2, Phase IV, GIDC Estate',
    line2: 'Memdabad Road, Vatva, Daskroi',
    city: 'Ahmedabad, Gujarat 382445, India',
  },
  hours: 'Mon – Fri: 10:00 AM – 6:00 PM (Sat & Sun Closed)',
  mapEmbedUrl:
    'https://www.google.com/maps?q=GIDC+Estate+Vatva+Ahmedabad+Gujarat+382445&output=embed',
  social: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    youtube: 'https://youtube.com',
  },
} as const;

export const STATS = [
  { value: '35+', label: 'Years of Industrial Experience' },
  { value: '1000+', label: 'Parking Systems Delivered' },
  { value: '55+', label: 'Product Variants' },
  { value: '40+', label: 'Satisfied Enterprise Clients' },
] as const;

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Products', href: '/products' },
  { label: 'Services', href: '/services' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
] as const;

export const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Client Consultation',
    description:
      'We assess site layout, vehicle volume, and space constraints to understand your exact parking requirement.',
  },
  {
    step: '02',
    title: 'Custom Design & Quotation',
    description:
      'Our engineers propose the right system configuration and provide a transparent, itemized quotation.',
  },
  {
    step: '03',
    title: 'Precision Manufacturing',
    description:
      'Every component is fabricated in-house at our 10,000+ sq. ft. facility to exacting tolerances.',
  },
  {
    step: '04',
    title: 'Powder Coating & Finishing',
    description:
      'Structural steel is treated and powder-coated for long-term corrosion resistance and finish quality.',
  },
  {
    step: '05',
    title: 'Professional Installation',
    description:
      'A dedicated site team handles structural anchoring, hydraulics, and electrical integration on schedule.',
  },
  {
    step: '06',
    title: 'Commissioning & Testing',
    description:
      'Full load testing, safety verification, and operator training before final handover.',
  },
] as const;

export const SECTORS = [
  { title: 'Hotels', description: 'Guest and staff parking that maximizes valet throughput.' },
  { title: 'Malls & Retail', description: 'High-turnover public parking with fast cycle times.' },
  {
    title: 'Residential Apartments',
    description: 'Space-efficient stacking for tight residential footprints.',
  },
  {
    title: 'Commercial Towers',
    description: 'Scalable multi-level systems for corporate and mixed-use developments.',
  },
  {
    title: 'Smart Buildings',
    description: 'PLC-controlled, app-ready systems for next-generation developments.',
  },
] as const;

export const SERVICES = [
  {
    title: 'Layout Planning & Feasibility Studies',
    description:
      'Site surveys and space-utilization studies to determine the optimal parking system and capacity for your plot.',
  },
  {
    title: 'Architectural Integration',
    description:
      'Structural and MEP coordination with architects and consultants for seamless integration into new or existing builds.',
  },
  {
    title: 'Custom Manufacturing',
    description:
      'In-house fabrication of stackers, puzzle systems, and pit structures tailored to project specifications.',
  },
  {
    title: 'On-Site Installation & Commissioning',
    description:
      'End-to-end installation by trained crews, followed by full load testing and safety commissioning.',
  },
  {
    title: 'AMC & Annual Maintenance',
    description:
      'Scheduled preventive maintenance contracts to keep hydraulic, electrical, and structural systems running reliably.',
  },
] as const;
