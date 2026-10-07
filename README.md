# ayan-portfolio

Personal portfolio website for Ayan Ali Khan.

Built with [Astro](https://astro.build), TypeScript and [Tailwind CSS](https://tailwindcss.com). The site is fully static: no backend, database or CMS.

## Requirements

- [Node.js](https://nodejs.org) 24 LTS (see `.nvmrc`; Astro requires at least 22.12)
- npm (bundled with Node)

## Run locally

```sh
npm install
npm run dev
```

Then open http://localhost:4321. In development, dashed "Pending asset" notes mark content that has not been supplied yet; they never appear in production builds.

## Commands

| Command                           | What it does                                                                |
| :-------------------------------- | :-------------------------------------------------------------------------- |
| `npm run dev`                     | Start the local dev server at `localhost:4321`                              |
| `npm run check`                   | Type-check, validate content schemas and run the public-content check       |
| `npm run build`                   | Public-content check → type-check → build to `dist/` → scan `dist/` as well |
| `npm run preview`                 | Serve the production build locally                                          |
| `npm run format` / `format:check` | Format with Prettier / check formatting                                     |
| `npm run check:public`            | Scan source, public files and config for confidential terms                 |
| `npm run check:public:dist`       | Same, including the built site in `dist/`                                   |
| `npm run check:public:self-test`  | Run the checker against synthetic terms                                     |
| `npm run hooks:install`           | Install an optional local pre-commit hook that runs the check               |

## Project structure

```text
public/                     Static files served as-is (favicon; CV PDF once supplied)
scripts/
  check-public-content.mjs  Confidentiality check (reads a local, gitignored list)
  install-hooks.mjs         Optional pre-commit hook installer
src/
  assets/                   Images processed by Astro (AVIF/WebP, responsive sizes)
  components/               UI components
  content/
    projects/               One Markdown file per project (case study or compact entry)
    experience.yaml         Experience timeline
    education.yaml          Education
    certifications.yaml     Certifications
    creative.yaml           Selected videos/Reels (thumbnails link out)
  content.config.ts         Content schemas (Zod)
  data/site.ts              Site settings: name, contact links, channels, CV, employer display
  layouts/                  Base and case-study layouts
  pages/                    Routes: /, /work/[slug]/, /404, /robots.txt
  styles/global.css         Design tokens, base styles, prose and motion rules
astro.config.mjs            Astro configuration (site URL from SITE_URL)
```

## Content rules

Everything under `src/` and `public/` is published. Only add approved, accurate content.

- Client work appears only as compact, anonymised, text-only entries (`kind: compact`, `anonymised: true`). The schema rejects images, links or figures on anonymised entries.
- Only `kind: case-study` projects get their own page.
- Never add employer or client material (code, screenshots, documents, data) to this repository.

## Configuring pending values

Values left as `null` in `src/data/site.ts` are simply not rendered.

- **Contact:** set `contact.email`, `contact.linkedin`, `contact.github`. The Contact section and nav item appear automatically.
- **Channels:** set `channels.youtube`, `channels.instagram`.
- **CV:** place the PDF at `public/ayan-ali-khan-cv.pdf`. Download links appear automatically on the next build.
- **Employer name:** `employer.show` controls whether the employer is shown for the developer role.
- **Selected videos:** add entries to `src/content/creative.yaml` with thumbnails in `src/assets/creative/`.
- **Social image:** add a 1200×630 image to `public/` and set `socialImage`.

## Public-content check

`scripts/check-public-content.mjs` scans source, public files, config and the built site for terms listed in `.confidential/banned-terms.txt`. That directory is gitignored and the list is never committed; the script itself contains no confidential terms. If the list is missing the check is skipped with a warning (as on hosting builds), unless `REQUIRE_CONFIDENTIAL_CHECK=1` is set.

## Deployment

Pushes to `main` build and deploy the site to GitHub Pages through `.github/workflows/deploy.yml` (Repository settings → Pages → Source: **GitHub Actions**). The workflow runs `npm ci` and `npm run build`, then publishes `dist/` with the official Pages actions.

The workflow sets two environment variables from the Pages configuration:

- `SITE_URL`: the site origin (e.g. `https://realayanalikhan.github.io`), which enables canonical URLs, absolute social metadata and `sitemap-index.xml`.
- `BASE_PATH`: the project sub-path (e.g. `/ayan-portfolio`). Internal links use `withBase()` from `src/data/site.ts`, so they work under the sub-path.

Neither is set locally, so development and local previews run at `/`.
