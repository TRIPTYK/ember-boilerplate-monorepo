import { webdriverio } from "@vitest/browser-webdriverio";
import { defineConfig } from "vitest/config";
import { extensions, ember, classicEmberSupport } from '@embroider/vite';
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
});
