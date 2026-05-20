#!/usr/bin/env node
/**
 * Validateur de Sortie Bash - Hook PostToolUse
 *
 * Analyse la sortie des commandes pour détecter des secrets/identifiants exposés accidentellement.
 * Fournit des instructions de rotation lorsque des secrets sont détectés.
 *
 * Codes de sortie :
 *   0 = Toujours (les hooks PostToolUse observent, ne bloquent pas)
 *
 * Sortie : Message d'avertissement sur stderr lorsque des secrets sont détectés
 */

import { readFileSync } from "fs";

const SECRET_PATTERNS = [
  { pattern: /sk-ant-[A-Za-z0-9\-_]{20,}/, name: "Anthropic API Key", rotate_url: "console.anthropic.com/settings/keys" },
  { pattern: /sk-[A-Za-z0-9]{48,}/, name: "OpenAI API Key", rotate_url: "platform.openai.com/api-keys" },
  { pattern: /ghp_[A-Za-z0-9]{36}/, name: "GitHub Personal Access Token", rotate_url: "github.com/settings/tokens" },
  { pattern: /gho_[A-Za-z0-9]{36}/, name: "GitHub OAuth Token", rotate_url: "github.com/settings/tokens" },
  { pattern: /AKIA[A-Z0-9]{16}/, name: "AWS Access Key ID", rotate_url: "console.aws.amazon.com/iam" },
  { pattern: /-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/, name: "Clé Privée", rotate_url: "Générer une nouvelle paire de clés et mettre à jour tous les services" },
  { pattern: /Bearer\s+[A-Za-z0-9\-_.]{20,}/, name: "Jeton Bearer", rotate_url: "Effectuer la rotation auprès du service émetteur" },
  { pattern: /xox[baprs]-[A-Za-z0-9\-]{10,}/, name: "Slack Token", rotate_url: "api.slack.com/apps" },
  { pattern: /sq0[a-z]{3}-[A-Za-z0-9\-_]{22,}/, name: "Square Access Token", rotate_url: "developer.squareup.com/apps" },
  { pattern: /stripe[_-]?[a-z]*[_-]?key['"]?\s*[:=]\s*['"]?[a-zA-Z0-9_\-]{20,}/, name: "Stripe API Key", rotate_url: "dashboard.stripe.com/apikeys" },
];

const GENERIC_PATTERNS = [
  { pattern: /['"]?password['"]?\s*[:=]\s*['"][^'"]{8,}['"]/, name: "Mot de passe en dur", rotate_url: "Changez le mot de passe immédiatement" },
  { pattern: /['"]?api[_-]?key['"]?\s*[:=]\s*['"][A-Za-z0-9\-_]{20,}['"]/, name: "Clé API générique", rotate_url: "Identifiez le service et effectuez la rotation de la clé" },
];

function scanForSecrets(content) {
  const findings = [];

  for (const item of SECRET_PATTERNS) {
    if (item.pattern.test(content)) {
      findings.push({ name: item.name, rotate_url: item.rotate_url, confidence: "high" });
    }
  }

  if (findings.length === 0) {
    for (const item of GENERIC_PATTERNS) {
      if (item.pattern.test(content)) {
        findings.push({ name: item.name, rotate_url: item.rotate_url, confidence: "medium" });
      }
    }
  }

  return findings;
}

function formatWarning(findings) {
  const sep = "=".repeat(60);
  const lines = [
    "",
    sep,
    "  ALERTE SÉCURITÉ : Identifiants possiblement exposés dans la sortie !",
    sep,
    "",
    "Détecté :",
  ];

  for (const f of findings) {
    lines.push(`  - ${f.name} (confiance : ${f.confidence})`);
  }

  lines.push(
    "",
    "ACTIONS IMMÉDIATES :",
    "  1. Effectuez la rotation de cet identifiant immédiatement",
    "  2. Vérifiez si cela a été commité dans git (git log -p | grep <clé>)",
    "  3. Vérifiez qui a accès à ce terminal/ces logs",
    "",
    "LIENS DE ROTATION :",
  );

  for (const f of findings) {
    lines.push(`  - ${f.name}: ${f.rotate_url}`);
  }

  lines.push(
    "",
    "BONNES PRATIQUES :",
    "  - Stockez les secrets dans des fichiers .env (ajoutez .env au .gitignore)",
    "  - Utilisez des variables d'environnement, pas des valeurs en dur",
    "  - Ne committez jamais de secrets dans le contrôle de version",
    "  - Utilisez des gestionnaires de secrets en production (AWS Secrets Manager, etc.)",
    "",
    sep,
    "",
  );

  return lines.join("\n");
}

function main() {
  let inputData;
  try {
    const raw = readFileSync("/dev/stdin", "utf-8");
    inputData = JSON.parse(raw);
  } catch {
    process.exit(0);
  }

  const toolName = inputData.tool_name || "";
  if (toolName !== "Bash" && toolName !== "Read") process.exit(0);

  const toolOutput = inputData.tool_output || {};
  let content;

  if (toolName === "Bash") {
    const stdout = String(toolOutput.stdout || "");
    const stderr = String(toolOutput.stderr || "");
    content = stdout + "\n" + stderr;
  } else {
    content = String(toolOutput.output || "");
  }

  if (!content.trim()) process.exit(0);

  const findings = scanForSecrets(content);

  if (findings.length > 0) {
    process.stderr.write(formatWarning(findings));
  }

  process.exit(0);
}

main();
