// vite.config.js
import { webdriverio } from "@vitest/browser-webdriverio";
import { defineConfig } from "vite";

import { classicEmberSupport, ember, extensions } from "@embroider/vite";
import { babel } from "@rollup/plugin-babel";

export default defineConfig({
  // Add this config
  test: {
    include: ["tests/**/*-test.{gjs,gts}"],
    maxConcurrency: 1,
    browser: {
      provider: webdriverio(),
      enabled: true,
      headless: false,
      // at least one instance is required
      instances: [
        { browser: "chrome" },
        // { browser: 'firefox' },
        // { browser: 'edge' },
        // { browser: 'safari' },
      ],
    },
  },
  // Existing config:
  plugins: [
    classicEmberSupport(),
    ember(),
    babel({
      babelHelpers: "runtime",
      extensions,
    }),
  ],
});
