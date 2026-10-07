import type { APIRoute } from "astro";
import { withBase } from "../data/site";

export const GET: APIRoute = ({ site }) => {
  const lines = ["User-agent: *", "Allow: /"];
  // The sitemap only exists once the production URL (SITE_URL) is configured.
  if (site)
    lines.push(
      "",
      `Sitemap: ${new URL(withBase("/sitemap-index.xml"), site).href}`,
    );
  return new Response(`${lines.join("\n")}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
