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

Then open http://localhost:4321. The page reloads automatically as you edit files.

## Commands

| Command                | What it does                                          |
| :--------------------- | :---------------------------------------------------- |
| `npm run dev`          | Start the local dev server at `localhost:4321`        |
| `npm run check`        | Type-check `.astro`, `.ts` files and content schemas  |
| `npm run build`        | Type-check, then build the production site to `dist/` |
| `npm run preview`      | Serve the production build locally                    |
| `npm run format`       | Format all files with Prettier                        |
| `npm run format:check` | Check formatting without changing files               |

## Project structure

```text
public/                 Static files served as-is (favicon, CV PDF, robots.txt)
src/
  assets/               Images processed and optimised by Astro
  components/           Reusable Astro components
  content/
    projects/           One Markdown file per project
  layouts/              Page layouts (shared <head>, global styles)
  pages/                Routes - each file becomes a URL
  styles/global.css     Tailwind entry point and global styles
  content.config.ts     Content collection schemas
astro.config.mjs        Astro configuration (integrations, site URL)
```

## Adding a project

Create a Markdown file in `src/content/projects/`, e.g. `my-project.md`. Its frontmatter is validated against the schema in `src/content.config.ts`, so the build fails with a clear message if a required field is missing:

```md
---
title: Project name
summary: One or two sentences describing the project.
date: 2026-01-31
role: Your role # optional
tags: [Astro, TypeScript] # optional
cover: # optional
  src: ../../assets/projects/my-project.png
  alt: Description of the image
links: # optional
  live: https://…
  repo: https://…
featured: false # optional
draft: false # optional - drafts are excluded from the site
---

The write-up goes here, in Markdown.
```

Files whose names start with `_` are ignored.

## Deployment

Not deployed yet. The build output in `dist/` is plain static files and can be hosted on any static host. Before deploying, set `site` in `astro.config.mjs` to the production URL so the sitemap and absolute URLs are generated.
