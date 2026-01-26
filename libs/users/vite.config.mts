import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from "vitest/config";
import { extensions, ember } from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';

// For scenario testing
const isCompat = Boolean(process.env.ENABLE_COMPAT_BUILD);

export default defineConfig({
  plugins: [
    ember(),
    babel({
      babelHelpers: 'runtime',
      extensions,
    }),
  ],
  test: {
    setupFiles: ['./tests/test-helper.ts'],
    include: ["tests/**/*-test.{gjs,gts}"],
    maxConcurrency: 1,
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
