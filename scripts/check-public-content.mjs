#!/usr/bin/env node
/**
 * Public-content confidentiality check.
 *
 * Scans everything that can end up on the public website for terms listed in
 * a LOCAL, GITIGNORED file (`.confidential/banned-terms.txt`). The list itself
 * is never committed and this script contains no confidential terms.
 *
 * Usage:
 *   node scripts/check-public-content.mjs            # scan source, public files and config
 *   node scripts/check-public-content.mjs --dist     # also scan the built site in dist/
 *   node scripts/check-public-content.mjs --self-test
 *
 * List format: one term per line (matched case-insensitively as a whole word),
 * or a regular expression written as /pattern/flags. Blank lines and comments
 * (#) are ignored; a comment of the form "# category: name" sets the category
 * for the lines that follow.
 *
 * If the list is missing the check is skipped with a warning (e.g. on hosting
 * builds), unless REQUIRE_CONFIDENTIAL_CHECK=1 is set, in which case it fails.
 */

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = process.cwd();
const LIST_PATH = join(ROOT, ".confidential", "banned-terms.txt");

/** Locations that become public, plus repository config. */
const SOURCE_DIRS = ["src", "public", "scripts"];
const CONFIG_FILES = [
  "astro.config.mjs",
  "package.json",
  "tsconfig.json",
  ".prettierrc.json",
  "README.md",
];
const DIST_DIR = "dist";
const DIST_EXTENSIONS = new Set([
  ".html",
  ".xml",
  ".txt",
  ".json",
  ".js",
  ".css",
  ".svg",
  ".webmanifest",
]);
const SKIP_DIRS = new Set(["node_modules", ".git", ".astro", ".confidential"]);
const BINARY_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".avif",
  ".gif",
  ".ico",
  ".pdf",
  ".woff",
  ".woff2",
  ".mp4",
  ".mov",
]);

// ---------------------------------------------------------------- parsing --

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Whole-word, case-insensitive matcher that also works next to punctuation. */
function termToRegExp(term) {
  return new RegExp(
    `(?<![\\p{L}\\p{N}])${escapeRegExp(term.normalize("NFKC"))}(?![\\p{L}\\p{N}])`,
    "giu",
  );
}

export function parseList(text) {
  const rules = [];
  let category = "uncategorised";
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    const categoryMatch = /^#\s*category:\s*(.+)$/i.exec(line);
    if (categoryMatch) {
      category = categoryMatch[1].trim();
      continue;
    }
    if (line.startsWith("#")) continue;
    const regexMatch = /^\/(.+)\/([a-z]*)$/.exec(line);
    if (regexMatch) {
      const flags = new Set([...regexMatch[2], "g", "u"]);
      rules.push({
        category,
        pattern: new RegExp(regexMatch[1], [...flags].join("")),
      });
    } else {
      rules.push({ category, pattern: termToRegExp(line) });
    }
  }
  return rules;
}

// --------------------------------------------------------------- scanning --

function mask(match) {
  const chars = [...match];
  return chars[0] + "*".repeat(Math.max(chars.length - 1, 1));
}

export function scanText(text, rules) {
  const hits = [];
  const lines = text.normalize("NFKC").split(/\r?\n/);
  lines.forEach((line, index) => {
    for (const rule of rules) {
      rule.pattern.lastIndex = 0;
      for (const match of line.matchAll(rule.pattern)) {
        hits.push({
          line: index + 1,
          category: rule.category,
          masked: mask(match[0]),
        });
      }
    }
  });
  return hits;
}

function* walk(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) yield* walk(full);
    else yield full;
  }
}

function extension(path) {
  const dot = path.lastIndexOf(".");
  return dot === -1 ? "" : path.slice(dot).toLowerCase();
}

function isProbablyBinary(buffer) {
  return buffer.subarray(0, 8000).includes(0);
}

function scanFile(path, rules, findings) {
  const rel = relative(ROOT, path).split(sep).join("/");
  // File and folder names are public too.
  for (const hit of scanText(rel, rules)) {
    findings.push({
      file: rel,
      line: 0,
      category: hit.category,
      masked: hit.masked,
      where: "path",
    });
  }
  if (BINARY_EXTENSIONS.has(extension(path))) return;
  const buffer = readFileSync(path);
  if (isProbablyBinary(buffer)) return;
  for (const hit of scanText(buffer.toString("utf8"), rules)) {
    findings.push({ file: rel, ...hit, where: "content" });
  }
}

function collectTargets(includeDist) {
  const targets = [];
  for (const dir of SOURCE_DIRS) targets.push(...walk(join(ROOT, dir)));
  for (const file of CONFIG_FILES) {
    const full = join(ROOT, file);
    if (existsSync(full)) targets.push(full);
  }
  if (includeDist) {
    for (const file of walk(join(ROOT, DIST_DIR))) {
      if (DIST_EXTENSIONS.has(extension(file))) targets.push(file);
    }
  }
  return targets;
}

// -------------------------------------------------------------- self-test --

function selfTest() {
  const rules = parseList(
    [
      "# category: synthetic-project",
      "Zephyr Ledger",
      "# category: synthetic-regex",
      "/\\bquux[0-9]+\\b/i",
    ].join("\n"),
  );
  const cases = [
    { text: "Worked on the zephyr ledger rebuild.", expected: 1 },
    { text: "Zephyr Ledger, Zephyr Ledger.", expected: 2 },
    { text: "ZephyrLedgerish is a different word.", expected: 0 },
    { text: "Identifier QUUX42 leaked.", expected: 1 },
    { text: "quux alone is fine.", expected: 0 },
    { text: "Nothing to see here.", expected: 0 },
  ];
  let failed = 0;
  for (const { text, expected } of cases) {
    const hits = scanText(text, rules);
    const ok = hits.length === expected;
    if (!ok) failed++;
    console.log(
      `${ok ? "PASS" : "FAIL"}  expected ${expected}, got ${hits.length}: ${JSON.stringify(text)}`,
    );
  }
  const masked = scanText("Zephyr Ledger", rules)[0]?.masked;
  const maskOk = masked === "Z************";
  if (!maskOk) failed++;
  console.log(
    `${maskOk ? "PASS" : "FAIL"}  masking hides the term (${masked})`,
  );
  console.log(
    failed ? `\nSelf-test failed (${failed}).` : "\nSelf-test passed.",
  );
  process.exit(failed ? 1 : 0);
}

// ------------------------------------------------------------------- main --

const args = new Set(process.argv.slice(2));
if (args.has("--self-test")) selfTest();

if (!existsSync(LIST_PATH)) {
  const message =
    "Public-content check: no .confidential/banned-terms.txt found, so the check was skipped.";
  if (process.env.REQUIRE_CONFIDENTIAL_CHECK === "1") {
    console.error(
      `${message}\nREQUIRE_CONFIDENTIAL_CHECK=1 is set, so this is an error.`,
    );
    process.exit(1);
  }
  console.warn(`Warning: ${message}`);
  process.exit(0);
}

const rules = parseList(readFileSync(LIST_PATH, "utf8"));
const includeDist = args.has("--dist");
if (includeDist && !existsSync(join(ROOT, DIST_DIR))) {
  console.error(
    "Public-content check: --dist was given but dist/ does not exist. Build first.",
  );
  process.exit(1);
}

const targets = collectTargets(includeDist);
const findings = [];
for (const file of targets) scanFile(file, rules, findings);

const scope = includeDist
  ? "source, public files, config and dist/"
  : "source, public files and config";
if (findings.length === 0) {
  console.log(
    `Public-content check passed: ${targets.length} files scanned (${scope}), ${rules.length} rules.`,
  );
  process.exit(0);
}

console.error(
  `Public-content check FAILED: ${findings.length} match(es) in ${scope}.\n`,
);
for (const f of findings) {
  const location =
    f.where === "path" ? `${f.file} (file name)` : `${f.file}:${f.line}`;
  console.error(`  ${location}  [${f.category}]  ${f.masked}`);
}
console.error("\nRemove or generalise these before publishing.");
process.exit(1);
