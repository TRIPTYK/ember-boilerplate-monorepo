import { createApplicationContext } from "#src/app/application.context.js";
import type { AppConfiguration } from "#src/configuration.js";

export async function getTestContext() {
  const config = {
    DEBUG: true,
    PRODUCTION_ENV: false,
    PORT: 8001,
    DATABASE_URI: "sqlite://:memory:/:memory:",
    SERVER_URL: "http://localhost:8001",
    SEED: "test",
    SESSION_KEY: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
    JWT_SECRET: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
    JWT_REFRESH_SECRET: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
    APP_NAME: "TestApp",
    APP_URL: "http://localhost:8001",
    SMTP_HOST: "smtp.test.com",
    SMTP_PORT: "587",
    SMTP_USER: "test@example.com",
    SMTP_PASSWORD: "test_password",
    SMTP_SECURE: false,
    EMAIL_FROM_NAME: "Test App",
    EMAIL_FROM_ADDRESS: "noreply@test.com",
  } satisfies AppConfiguration;

  return {
    context: await createApplicationContext(config),
  };
}
