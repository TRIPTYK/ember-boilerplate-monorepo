import { defineConfig } from "vitest/config";
import path from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [path()],
  test: {
    include: ["tests/**/*.test.ts", "src/**/*.test.ts"],
    environment: "node",
    pool: "forks",
  },
});
