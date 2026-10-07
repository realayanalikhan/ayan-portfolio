#!/usr/bin/env node
/**
 * Installs an optional local pre-commit hook that runs the public-content
 * confidentiality check. Git hooks are not versioned, so run this once per clone:
 *   npm run hooks:install
 */

import { chmodSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const hooksDir = join(process.cwd(), ".git", "hooks");
if (!existsSync(hooksDir)) {
  console.error(
    "No .git/hooks directory found. Run this from the repository root.",
  );
  process.exit(1);
}

const hook = `#!/bin/sh
# Installed by scripts/install-hooks.mjs: blocks commits that would publish banned terms.
REQUIRE_CONFIDENTIAL_CHECK=1 node scripts/check-public-content.mjs || {
  echo "Commit blocked by the public-content check." >&2
  exit 1
}
`;

const target = join(hooksDir, "pre-commit");
writeFileSync(target, hook);
chmodSync(target, 0o755);
console.log("Installed pre-commit hook: .git/hooks/pre-commit");
