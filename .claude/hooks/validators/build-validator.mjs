#!/usr/bin/env node
/**
 * Build Validator - Hook Stop
 *
 * Lance `npm run build` (ou `bun run build`) a la fin de la session.
 * Bloquant : exit 2 si le build echoue.
 * Non bloquant : exit 0 si pas de script build.
 *
 * Convention : memes exit codes que damage-control (0 = ok, 2 = bloque).
 */

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { execFileSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, "../../../../");

function detectPackageManager() {
  if (existsSync(join(PROJECT_ROOT, "bun.lockb"))) return "bun";
  return "npm";
}

function hasBuildScript() {
  const pkgPath = join(PROJECT_ROOT, "package.json");
  if (!existsSync(pkgPath)) return false;

  try {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    return !!(pkg.scripts && pkg.scripts.build);
  } catch {
    return false;
  }
}

function main() {
  // Read stdin (Stop hook may or may not provide input)
  try {
    readFileSync("/dev/stdin", "utf-8");
  } catch {
    // stdin not available, continue
  }

  if (!hasBuildScript()) process.exit(0);

  const pm = detectPackageManager();

  try {
    execFileSync(pm, ["run", "build"], {
      cwd: PROJECT_ROOT,
      timeout: 120000,
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    process.exit(0);
  } catch (err) {
    const output = err.stdout || err.stderr || err.message;
    process.stderr.write("build-validator: build failed\n");
    process.stderr.write(output.slice(-500) + "\n");
    process.exit(2);
  }
}

main();
