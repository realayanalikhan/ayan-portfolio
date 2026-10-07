// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  // TODO: set to the production URL (e.g. "https://example.com") once a domain
  // is chosen. Required for sitemap.xml generation and absolute/canonical URLs;
  // until then the sitemap integration skips generation with a warning.
  // site: "",

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [sitemap()],
});
