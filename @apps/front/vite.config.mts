import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';
import tailwindcss from '@tailwindcss/vite';

import { classicEmberSupport, ember, extensions } from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';
import { loadTranslations } from '@ember-intl/vite';

// The app always talks to a real backend, proxied to avoid CORS in dev and e2e.
const apiProxy = {
  '/api': {
    target: process.env.VITE_API_URL || 'http://localhost:8000',
    changeOrigin: true,
  },
};

export default defineConfig({
  test: {
    include: ['tests/**/*-test.{gjs,gts}'],
    maxConcurrency: 1,
    browser: {
      provider: playwright(),
      enabled: true,
      headless: process.env.CI === 'true',
      instances: [{ browser: 'chromium' }],
    },
  },
  server: {
    proxy: apiProxy,
  },
  preview: {
    proxy: apiProxy,
  },
  plugins: [
    tailwindcss(),
    classicEmberSupport(),
    ember(),
    babel({
      babelHelpers: 'runtime',
      extensions,
    }),
    loadTranslations(),
  ],
});
