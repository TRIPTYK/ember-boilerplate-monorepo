import { defineConfig } from "vitest/config";
import path from "vite-tsconfig-paths";

export default defineConfig({
  test: {
    projects: [
      {
        plugins: [path()],
        test: {
          name: "Unit Tests",
          include: ["tests/unit/*.test.ts"],
          environment: "node",
          pool: "threads",
        }
      },
      {
          plugins: [path()],
          test: {
          name: "Integration Tests",
          globalSetup: "./tests/global-setup.ts",
          include: ["tests/**/*.test.ts", "src/**/*.test.ts"],
          environment: "node",
          pool: "forks",
        }
      }
    ],
  },
});
