import { existsSync } from "node:fs";
import { join } from "node:path";
import portrait from "../assets/profile/ayan-ali-khan.jpg";

/**
 * Site-wide settings. Values set to `null` are pending and are simply not
 * rendered until they are filled in; nothing here should be guessed.
 */

const CV_FILE = "ayan-ali-khan-cv.pdf";

/** The configured base path without a trailing slash ("" locally, "/ayan-portfolio" on Pages). */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

/** Prefix a root-relative path (e.g. "/work/x/" or "/#work") with the site's base path. */
export function withBase(path: string): string {
  return `${BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

/** True when a request path is the home page, with or without the base path. */
export function isHomePath(pathname: string): boolean {
  const trim = (value: string) => value.replace(/\/+$/, "");
  return trim(pathname) === trim(withBase("/"));
}

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

  /** Public contact links. Set a value to null to hide that link. */
  contact: {
    email: "alikhanayan05@gmail.com" as string | null,
    linkedin: "https://www.linkedin.com/in/ayan-ali-khan/" as string | null,
    github: "https://github.com/realayanalikhan" as string | null,
  },

  /** Portrait for the About section (the same image in both themes). */
  portrait: {
    src: portrait,
    alt: "Portrait of Ayan Ali Khan",
  },

  /** Own creative channels. */
  channels: {
    youtube: "https://www.youtube.com/@RealAyanAliKhan" as string | null,
    instagram: "https://www.instagram.com/realayanalikhan/" as string | null,
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
    href: withBase(`/${CV_FILE}`),
    available: existsSync(join(process.cwd(), "public", CV_FILE)),
  },
};

export type ContactLink = {
  label: string;
  /** The address or handle, shown beside the label. */
  detail: string;
  href: string;
  external: boolean;
};

/** "https://www.linkedin.com/in/x/" -> "linkedin.com/in/x" */
function displayUrl(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/+$/, "");
}

export function contactLinks(): ContactLink[] {
  const links: ContactLink[] = [];
  if (site.contact.email)
    links.push({
      label: "Email",
      detail: site.contact.email,
      href: `mailto:${site.contact.email}`,
      external: false,
    });
  if (site.contact.linkedin)
    links.push({
      label: "LinkedIn",
      detail: displayUrl(site.contact.linkedin),
      href: site.contact.linkedin,
      external: true,
    });
  if (site.contact.github)
    links.push({
      label: "GitHub",
      detail: displayUrl(site.contact.github),
      href: site.contact.github,
      external: true,
    });
  return links;
}
