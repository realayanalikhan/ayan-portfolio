import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/**
 * Projects / case studies.
 *
 * One Markdown file per project in `src/content/projects/`. The frontmatter is
 * validated against the schema below at build time; the Markdown body is the
 * write-up. Files starting with an underscore are ignored.
 */
const projects = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** One or two sentences, used on project cards and as the meta description. */
      summary: z.string(),
      /** Completion or publication date; used for ordering. */
      date: z.coerce.date(),
      /** Your role on the project, e.g. "Lead developer". */
      role: z.string().optional(),
      /** Technologies / skills involved. */
      tags: z.array(z.string()).default([]),
      /** Cover image stored in `src/assets/`, path relative to the Markdown file. */
      cover: z
        .object({
          src: image(),
          alt: z.string(),
        })
        .optional(),
      links: z
        .object({
          live: z.url().optional(),
          repo: z.url().optional(),
        })
        .optional(),
      /** Highlight on the homepage. */
      featured: z.boolean().default(false),
      /** Drafts are excluded from the built site. */
      draft: z.boolean().default(false),
    }),
});

export const collections = { projects };
