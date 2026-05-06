#!/usr/bin/env node
/**
 * Subagent Logger - Hook SubagentStop
 *
 * Enregistre l'activité des sous-agents dans logs/subagent-activity.json (JSONL).
 * Jamais bloquant — exit 0 dans tous les cas.
 *
 * Format JSONL : { timestamp, session_id, agent_type, success, duration_ms }
 */

import { readFileSync, appendFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOG_DIR = join(__dirname, "../../../../logs");
const LOG_FILE = join(LOG_DIR, "subagent-activity.json");

function main() {
  let inputData;
  try {
    const raw = readFileSync("/dev/stdin", "utf-8");
    inputData = JSON.parse(raw);
  } catch {
    process.exit(0);
  }

  const entry = {
    timestamp: new Date().toISOString(),
    session_id: inputData.session_id || "unknown",
    agent_type: inputData.agent_type || inputData.subagent_type || "unknown",
    success: inputData.success !== false,
    duration_ms: inputData.duration_ms || null,
  };

  try {
    mkdirSync(LOG_DIR, { recursive: true });
    appendFileSync(LOG_FILE, JSON.stringify(entry) + "\n");
  } catch (err) {
    process.stderr.write(`subagent-logger: failed to write log: ${err.message}\n`);
  }

  process.exit(0);
}

main();
