import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from "vitest/config";
import tailwindcss from '@tailwindcss/vite'

import { classicEmberSupport, ember, extensions } from "@embroider/vite";
import { babel } from "@rollup/plugin-babel";
import { loadTranslations } from '@ember-intl/vite';

export default defineConfig({
  test: {
    include: ["tests/**/*-test.{gjs,gts}"],
    maxConcurrency: 1,
    browser: {
      provider: playwright(),
      enabled: true,
      headless: process.env.CI === 'true',
      instances: [
        { browser: "chromium" },
      ],
    },
  },
  // Existing config:
  plugins: [
    tailwindcss(),
    classicEmberSupport(),
    ember(),
    babel({
      babelHelpers: "runtime",
      extensions,
    }),
    loadTranslations()
  ],
});
