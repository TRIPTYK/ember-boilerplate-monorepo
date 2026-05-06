#!/usr/bin/env node
/**
 * Garde Bash - Hook PreToolUse
 *
 * Bloque les commandes bash dangereuses avant leur exécution.
 * Vérifie : bashToolPatterns, zeroAccessPaths, readOnlyPaths, noDeletePaths
 *
 * Codes de sortie :
 *   0 = Autoriser
 *   0 + JSON {"decision": "ask"} = Demander confirmation
 *   2 = Bloquer (stderr envoyé à Claude)
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

function matchesPathPattern(command, patterns) {
  for (const pattern of patterns || []) {
    const expanded = expandPath(pattern);
    if (pattern.includes("*")) {
      const regexStr = pattern.replace(/\./g, "\\.").replace(/\*/g, ".*");
      if (new RegExp(regexStr, "i").test(command)) return [true, pattern];
    } else {
      if (command.includes(expanded) || command.includes(pattern)) return [true, pattern];
    }
  }
  return [false, null];
}

function checkCommand(command, config) {
  for (const item of config.bashToolPatterns || []) {
    const pattern = item.pattern || "";
    const reason = item.reason || "Matched blocked pattern";
    const ask = item.ask || false;
    try {
      if (new RegExp(pattern, "i").test(command)) {
        return { allow: false, ask, reason };
      }
    } catch {
      continue;
    }
  }

  const [zeroMatched, zeroPattern] = matchesPathPattern(command, config.zeroAccessPaths);
  if (zeroMatched) {
    return { allow: false, ask: false, reason: `Access to protected path blocked: ${zeroPattern}` };
  }

  const modificationIndicators = ["rm ", "mv ", ">", ">>", "tee ", "sed -i", "chmod ", "chown "];
  for (const indicator of modificationIndicators) {
    if (command.includes(indicator)) {
      const [matched, pattern] = matchesPathPattern(command, config.readOnlyPaths);
      if (matched) {
        return { allow: false, ask: false, reason: `Modification of read-only path blocked: ${pattern}` };
      }
    }
  }

  const deletionIndicators = ["rm ", "rmdir ", "unlink ", "del "];
  for (const indicator of deletionIndicators) {
    if (command.includes(indicator)) {
      const [matched, pattern] = matchesPathPattern(command, config.noDeletePaths);
      if (matched) {
        return { allow: false, ask: false, reason: `Deletion of protected path blocked: ${pattern}` };
      }
    }
  }

  return { allow: true, ask: false, reason: "" };
}

function main() {
  let inputData;
  try {
    const raw = readFileSync("/dev/stdin", "utf-8");
    inputData = JSON.parse(raw);
  } catch {
    process.exit(0);
  }

  if (inputData.tool_name !== "Bash") process.exit(0);

  const command = (inputData.tool_input || {}).command || "";
  if (!command) process.exit(0);

  const config = loadPatterns();
  const result = checkCommand(command, config);

  if (result.allow) {
    process.exit(0);
  } else if (result.ask) {
    console.log(JSON.stringify({ decision: "ask", reason: result.reason }));
    process.exit(0);
  } else {
    process.stderr.write(`BLOCKED: ${result.reason}\n`);
    process.exit(2);
  }
}

main();
