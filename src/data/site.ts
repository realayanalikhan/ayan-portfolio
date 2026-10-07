import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Site-wide settings. Values set to `null` are pending and are simply not
 * rendered until they are filled in; nothing here should be guessed.
 */

const CV_FILE = "ayan-ali-khan-cv.pdf";

export const site = {
  name: "Ayan Ali Khan",
  title: "Full-Stack Software Developer",
  statement:
    "I turn real-world problems into tested, secure full-stack software, from first requirement to shipped product.",
  meta: [
    "MSc Advanced Computer Science",
    "LLM research",
    "Content creator & video editor",
  ],
  description:
    "Ayan Ali Khan is a full-stack software developer working across web applications, secure data-integrity-first backends, testing and delivery, with MSc research on large language models.",
  locale: "en-GB",

  /** Contact links. Pending: fill in once approved. */
  contact: {
    email: null as string | null,
    linkedin: null as string | null,
    /** Current GitHub identity: realayanalikhan (set the full URL once approved). */
    github: null as string | null,
  },

  /** Own creative channels. Pending: fill in once approved. */
  channels: {
    youtube: null as string | null,
    instagram: null as string | null,
  },

  /**
   * Employer display for the Software Developer role. Only show the name if the
   * corrected public CV also names the employer.
   */
  employer: {
    name: "Dizzy Otter Ltd",
    show: false,
  },

  /** Social preview image in /public (1200x630). Pending. */
  socialImage: null as string | null,

  /** The CV link appears automatically once public/ayan-ali-khan-cv.pdf exists. */
  cv: {
    href: `/${CV_FILE}`,
    available: existsSync(join(process.cwd(), "public", CV_FILE)),
  },
};

export type ContactLink = { label: string; href: string; external: boolean };

export function contactLinks(): ContactLink[] {
  const links: ContactLink[] = [];
  if (site.contact.email)
    links.push({
      label: "Email",
      href: `mailto:${site.contact.email}`,
      external: false,
    });
  if (site.contact.linkedin)
    links.push({
      label: "LinkedIn",
      href: site.contact.linkedin,
      external: true,
    });
  if (site.contact.github)
    links.push({ label: "GitHub", href: site.contact.github, external: true });
  return links;
}
