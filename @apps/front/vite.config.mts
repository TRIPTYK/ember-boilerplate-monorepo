import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';
import tailwindcss from '@tailwindcss/vite';

import { classicEmberSupport, ember, extensions } from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';
import { loadTranslations } from '@ember-intl/vite';

// Proxy configuration for e2e tests (when VITE_MOCK_API=false)
const apiProxy =
  process.env.VITE_MOCK_API === 'false'
    ? {
        '/api': {
          target: process.env.VITE_API_URL || 'http://localhost:8000',
          changeOrigin: true,
        },
      }
    : undefined;

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
