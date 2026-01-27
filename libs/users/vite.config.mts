import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from "vitest/config";
import { extensions, ember } from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';

export default defineConfig({
  plugins: [
    ember(),
    babel({
      babelHelpers: 'inline',
      extensions
    }),
  ],
  test: {
    setupFiles: ['./tests/test-helper.ts'],
    include: ["tests/**/*-test.{gjs,gts}"],
    maxConcurrency: 1,
    testTimeout: 120000,
    browser: {
      provider: playwright(),
      enabled: true,
      headless: false,
      // at least one instance is required
      instances: [
        { browser: "chromium" },
        // { browser: 'firefox' },
        // { browser: 'edge' },
        // { browser: 'safari' },
      ],
    },
  },
});
