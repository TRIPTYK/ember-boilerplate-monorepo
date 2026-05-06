#!/usr/bin/env node
/**
 * Test Validator - Hook PostToolUse (matcher: Edit|Write)
 *
 * Lance automatiquement les tests associes au fichier modifie.
 * Bloquant : exit 2 si les tests echouent.
 * Non bloquant : exit 0 si aucun test associe ou si timeout.
 *
 * Convention : memes exit codes que damage-control (0 = ok, 2 = bloque).
 */

import { readFileSync, existsSync } from "fs";
import { dirname, basename, join } from "path";
import { execFileSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, "../../../../");
const TIMEOUT_MS = 30000;

function detectFramework() {
  const pkgPath = join(PROJECT_ROOT, "package.json");
  if (!existsSync(pkgPath)) return null;

  try {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };

    if (deps.vitest || existsSync(join(PROJECT_ROOT, "vitest.config.ts")) || existsSync(join(PROJECT_ROOT, "vitest.config.js"))) {
      return "vitest";
    }
    if (deps.jest || existsSync(join(PROJECT_ROOT, "jest.config.ts")) || existsSync(join(PROJECT_ROOT, "jest.config.js"))) {
      return "jest";
    }
    if (existsSync(join(PROJECT_ROOT, "bun.lockb"))) {
      return "bun";
    }
    if (pkg.scripts && pkg.scripts.test) {
      return "npm";
    }
  } catch {
    // ignore parse errors
  }
  return null;
}

function findRelatedTests(filePath) {
  const dir = dirname(filePath);
  const base = basename(filePath).replace(/\.[^.]+$/, "");
  const ext = basename(filePath).includes(".ts") ? ".ts" : ".js";

  const candidates = [
    join(dir, `${base}.spec${ext}`),
    join(dir, `${base}.test${ext}`),
    join(dir, "__tests__", `${base}.test${ext}`),
    join(dir, "__tests__", `${base}.spec${ext}`),
    join(PROJECT_ROOT, "tests", `${base}.test${ext}`),
    join(PROJECT_ROOT, "test", `${base}.test${ext}`),
  ];

  return candidates.filter((p) => existsSync(p));
}

function runTests(framework, testFiles) {
  try {
    let cmd, args;
    switch (framework) {
      case "vitest":
        cmd = "npx";
        args = ["vitest", "run", "--reporter=verbose", ...testFiles];
        break;
      case "jest":
        cmd = "npx";
        args = ["jest", "--no-coverage", ...testFiles];
        break;
      case "bun":
        cmd = "bun";
        args = ["test", ...testFiles];
        break;
      default:
        cmd = "npm";
        args = ["test", "--", ...testFiles];
        break;
    }

    const output = execFileSync(cmd, args, {
      cwd: PROJECT_ROOT,
      timeout: TIMEOUT_MS,
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    });

    return { success: true, output };
  } catch (err) {
    if (err.killed) {
      return { success: true, output: "Test run timed out — not blocking." };
    }
    return { success: false, output: err.stdout || err.stderr || err.message };
  }
}

function main() {
  let inputData;
  try {
    const raw = readFileSync("/dev/stdin", "utf-8");
    inputData = JSON.parse(raw);
  } catch {
    process.exit(0);
  }

  const filePath = (inputData.tool_input || {}).file_path || "";
  if (!filePath) process.exit(0);

  // Only validate source files
  const normalizedPath = filePath.replace(/\\/g, "/");
  if (!normalizedPath.includes("src/")) process.exit(0);

  // Skip test files themselves
  if (normalizedPath.includes(".spec.") || normalizedPath.includes(".test.")) process.exit(0);

  const framework = detectFramework();
  if (!framework) process.exit(0);

  const testFiles = findRelatedTests(normalizedPath);
  if (testFiles.length === 0) process.exit(0);

  const result = runTests(framework, testFiles);
  if (result.success) process.exit(0);

  process.stderr.write(`test-validator: related tests failed for ${basename(normalizedPath)}\n`);
  process.stderr.write(result.output.slice(-500) + "\n");
  process.exit(2);
}

main();
