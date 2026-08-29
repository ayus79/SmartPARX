# SmartPARX

Marketing website for SmartPARX, an automated & mechanical car parking systems manufacturer. Built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com), deployed as a static site.

## Project structure

```text
/
├── public/               # static assets (favicon, robots.txt)
├── src/
│   ├── components/       # shared UI components
│   ├── content/products/ # product data (Markdown + frontmatter)
│   ├── content.config.ts # content collection schema
│   ├── layouts/          # page shell (Layout.astro)
│   ├── lib/site.ts       # site-wide constants (contact info, nav, copy)
│   ├── pages/            # route files
│   └── styles/           # global Tailwind stylesheet
└── astro.config.mjs
```

## Requirements

- Node.js `>= 22.12.0` (see `.node-version`)

## Commands

| Command           | Action                                      |
| :----------------- | :------------------------------------------ |
| `npm install`       | Install dependencies                        |
| `npm run dev`       | Start local dev server at `localhost:4321`  |
| `npm run build`     | Build the static site to `./dist/`          |
| `npm run preview`   | Preview the production build locally        |
| `npm run check`     | Type-check the project (`astro check`)      |

## Deploying to Cloudflare Pages

This is a fully static site — no server runtime required.

### Option A: Git integration (recommended)

1. Push this repository to GitHub.
2. In the Cloudflare dashboard, go to **Workers & Pages → Create → Pages → Connect to Git** and select this repo.
3. Use these build settings:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node version:** picked up automatically from `.node-version` (22.12.0)
4. Deploy. Every push to `main` will trigger a new production deployment; pull requests get preview deployments automatically.

### Option B: Direct upload via Wrangler CLI

```sh
npm run build
npx wrangler pages deploy dist --project-name=smartparx
```

## Environment / content notes

- Contact form (`src/components/ContactForm.astro`) posts to [Web3Forms](https://web3forms.com) — replace the placeholder `access_key` with a real one before going live.
- Site-wide contact details, nav links, and copy live in `src/lib/site.ts`.
- Products are managed as Markdown files in `src/content/products/` — add a new file there to add a new product page.
- Gallery and product images are currently placeholder icons; replace with real photography under `public/images/` and update the relevant components.

## CI

`.github/workflows/ci.yml` runs a type-check and production build on every push and pull request to `main`.
