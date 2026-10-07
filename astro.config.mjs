// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// The production URL is supplied by the environment (e.g. SITE_URL=https://example.com
// in the hosting settings). It enables canonical URLs, absolute social metadata and
// sitemap.xml. Until a domain is chosen it stays unset and those features are skipped.
const site = process.env.SITE_URL || undefined;

// Sub-path when hosted as a project site (e.g. "/ayan-portfolio" on GitHub Pages).
// Supplied by the deployment workflow; unset locally, so development stays at "/".
const base = process.env.BASE_PATH || undefined;

// https://astro.build/config
export default defineConfig({
  site,
  base,
  trailingSlash: "ignore",

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [sitemap()],
});
