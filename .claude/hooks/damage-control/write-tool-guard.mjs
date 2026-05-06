#!/usr/bin/env node
/**
 * Garde Écriture - Hook PreToolUse
 *
 * Bloque les écritures sur les fichiers protégés (chemins zeroAccess et readOnly).
 *
 * Codes de sortie :
 *   0 = Autoriser
 *   2 = Bloquer
 */

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { homedir } from "os";
import { parseYaml } from "./yaml-parser.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadPatterns() {
  const patternsFile = join(__dirname, "patterns.yaml");
  try {
    const content = readFileSync(patternsFile, "utf-8");
    return parseYaml(content);
  } catch {
    return {};
  }
}

function expandPath(p) {
  return p.replace(/^~/, homedir()).replace(/\$(\w+)/g, (_, name) => process.env[name] || "");
}

function matchesProtectedPath(filePath, patterns) {
  filePath = expandPath(filePath);
  for (const pattern of patterns || []) {
    const expanded = expandPath(pattern);
    if (pattern.includes("*")) {
      const regexStr = pattern.replace(/\./g, "\\.").replace(/\*/g, ".*");
      if (new RegExp(regexStr, "i").test(filePath)) return [true, pattern];
    } else {
      if (filePath.includes(expanded) || filePath.includes(pattern)) return [true, pattern];
      if (filePath.endsWith(pattern) || filePath.endsWith(pattern.replace(/\/$/, ""))) return [true, pattern];
    }
  }
  return [false, null];
}

function main() {
  let inputData;
  try {
    const raw = readFileSync("/dev/stdin", "utf-8");
    inputData = JSON.parse(raw);
  } catch {
    process.exit(0);
  }

  if (inputData.tool_name !== "Write") process.exit(0);

  const filePath = (inputData.tool_input || {}).file_path || "";
  if (!filePath) process.exit(0);

  const config = loadPatterns();

  const [zeroMatched, zeroPattern] = matchesProtectedPath(filePath, config.zeroAccessPaths);
  if (zeroMatched) {
    process.stderr.write(`BLOCKED: Cannot write to protected file matching: ${zeroPattern}\n`);
    process.exit(2);
  }

  const [roMatched, roPattern] = matchesProtectedPath(filePath, config.readOnlyPaths);
  if (roMatched) {
    process.stderr.write(`BLOCKED: Cannot write to read-only file matching: ${roPattern}\n`);
    process.exit(2);
  }

  process.exit(0);
}

main();
