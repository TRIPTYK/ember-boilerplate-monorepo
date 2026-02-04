import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT_DIR = path.resolve(import.meta.dirname, "../../..");
const BACKEND_DIR = path.resolve(ROOT_DIR, "@apps/backend");

function log(message: string) {
  console.log(`\x1b[36m[e2e-setup-db]\x1b[0m ${message}`);
}

function error(message: string) {
  console.error(`\x1b[31m[e2e-setup-db]\x1b[0m ${message}`);
}

function success(message: string) {
  console.log(`\x1b[32m[e2e-setup-db]\x1b[0m ${message}`);
}

async function checkDockerRunning(): Promise<boolean> {
  try {
    execSync("docker info", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

async function checkPostgresRunning(): Promise<boolean> {
  try {
    execSync(
      'docker exec $(docker ps -q --filter "ancestor=postgres:16" | head -1) pg_isready -U backend_user 2>/dev/null',
      { stdio: "ignore" }
    );
    return true;
  } catch {
    return false;
  }
}

async function startPostgres() {
  log("Starting PostgreSQL via dockercompose...");
  execSync("docker compose up -d database", {
    cwd: ROOT_DIR,
    stdio: "inherit",
  });

  // Wait for PostgreSQL to be ready
  log("Waiting for PostgreSQL to be ready...");
  let attempts = 0;
  const maxAttempts = 30;

  while (attempts < maxAttempts) {
    if (await checkPostgresRunning()) {
      success("PostgreSQL is ready!");
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    attempts++;
  }

  throw new Error("PostgreSQL failed to start within 30 seconds");
}

async function setupDatabase() {
  log("Setting up e2e database schema and seeding data...");

  // Check if .env.e2e exists
  const envPath = path.join(BACKEND_DIR, ".env.e2e");
  if (!existsSync(envPath)) {
    error(`.env.e2e not found at ${envPath}`);
    process.exit(1);
  }

  try {
    execSync("pnpm e2e:setup", {
      cwd: BACKEND_DIR,
      stdio: "inherit",
    });
    success("Database setup complete!");
  } catch (err) {
    error("Failed to setup database");
    throw err;
  }
}

async function main() {
  log("Starting e2e database setup...\n");

  // Check Docker
  if (!(await checkDockerRunning())) {
    error("Docker is not running. Please start Docker and try again.");
    process.exit(1);
  }

  // Start PostgreSQL if not running
  if (!(await checkPostgresRunning())) {
    await startPostgres();
  } else {
    log("PostgreSQL is already running");
  }

  // Setup database with e2e seeder
  await setupDatabase();

  success("\nE2E database setup complete!\n");
}

main().catch((err) => {
  error(`Database setup failed: ${err}`);
  process.exit(1);
});
