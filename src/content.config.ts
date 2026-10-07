import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";

/**
 * Public content only. Everything in src/content is published, so it must
 * contain approved text and nothing else (see README: Content rules).
 */

const projects = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        /** One-line description shown in the work index. */
        summary: z.string(),
        /** "case-study" gets its own page; "compact" is an index entry only. */
        kind: z.enum(["case-study", "compact"]),
        area: z.enum(["research", "professional", "personal"]),
        order: z.number().int(),
        /** Short label for the work index, e.g. "MSc research". */
        label: z.string(),
        period: z.string(),
        /** General type of system or study. */
        system: z.string(),
        /** Your role, in approved wording. */
        role: z.string(),
        /** Short focus tag for compact entries, in approved wording (e.g. "Led delivery"). */
        focus: z.string().optional(),
        /** Inline fact line for the featured case study in the work index. */
        indexFacts: z.array(z.string()).optional(),
        stack: z.array(z.string()).default([]),
        responsibilities: z.array(z.string()).default([]),
        /** Key figures (case studies only). */
        facts: z
          .array(z.object({ label: z.string(), value: z.string() }))
          .optional(),
        /** Extra header details for case studies. */
        details: z
          .array(z.object({ label: z.string(), value: z.string() }))
          .optional(),
        images: z
          .array(
            z.object({
              src: image(),
              alt: z.string().min(1),
              caption: z.string().optional(),
            }),
          )
          .optional(),
        links: z
          .object({ report: z.url().optional(), code: z.url().optional() })
          .optional(),
        /** Disclosure level 0–4 (see the private plan). */
        disclosure: z.number().int().min(0).max(4),
        /** Anonymised client work: text only, no images, links or figures. */
        anonymised: z.boolean(),
        draft: z.boolean().default(false),
      })
      .refine(
        (p) =>
          !p.anonymised || (!p.images?.length && !p.links && !p.facts?.length),
        { message: "Anonymised entries must not have images, links or facts." },
      )
      .refine((p) => p.kind === "case-study" || !p.facts?.length, {
        message: "Only case studies can have facts.",
      }),
});

const experience = defineCollection({
  loader: file("src/content/experience.yaml"),
  schema: z.object({
    role: z.string(),
    /** Omit to hide; the employer for the developer role is controlled in src/data/site.ts. */
    organisation: z.string().optional(),
    usesEmployerSetting: z.boolean().default(false),
    period: z.string(),
    area: z.enum(["technology", "creative", "business"]),
    summary: z.string(),
    highlights: z.array(z.string()).default([]),
    order: z.number().int(),
  }),
});

const education = defineCollection({
  loader: file("src/content/education.yaml"),
  schema: z.object({
    qualification: z.string(),
    institution: z.string(),
    period: z.string(),
    detail: z.string().optional(),
    /** Internal link, e.g. to the dissertation case study. */
    link: z
      .object({ href: z.string().startsWith("/"), label: z.string() })
      .optional(),
    order: z.number().int(),
  }),
});

const certifications = defineCollection({
  loader: file("src/content/certifications.yaml"),
  schema: z.object({
    name: z.string(),
    issuer: z.string(),
    date: z.string(),
    order: z.number().int(),
  }),
});

const creative = defineCollection({
  loader: file("src/content/creative.yaml"),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      platform: z.enum(["youtube", "instagram", "other"]),
      kind: z.enum(["vlog", "reel", "short"]),
      url: z.url(),
      thumbnail: image(),
      alt: z.string().min(1),
      year: z.string(),
      order: z.number().int(),
    }),
});

export const collections = {
  projects,
  experience,
  education,
  certifications,
  creative,
};
