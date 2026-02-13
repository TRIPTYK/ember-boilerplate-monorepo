import { readFileSync } from "fs";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

const envFile = join(rootDir, ".env.e2e");
const envContent = readFileSync(envFile, "utf-8");

for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) {
    continue;
  }
  const [key, ...valueParts] = trimmed.split("=");
  if (key && valueParts.length > 0) {
    const value = valueParts.join("=").trim();
    const unquoted = value.replace(/^['"]|['"]$/g, "");
    process.env[key.trim()] = unquoted;
  }
}

const args = process.argv.slice(2);
const mikroOrmCli = join(rootDir, "node_modules/@mikro-orm/cli/esm.js");

const child = spawn("node", [mikroOrmCli, ...args], {
  stdio: "inherit",
  env: process.env,
  cwd: rootDir,
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
