import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';
import tailwindcss from '@tailwindcss/vite';

import { ember, extensions } from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';
import { loadTranslations } from '@ember-intl/vite';

const PATCHED_ID = '\0patched-embroider-util';

const patchEmbroiderUtil = () => {
  let realPath: string | null = null;
  return {
    name: 'patch-embroider-util',
    enforce: 'pre' as const,
    async resolveId(id: string, importer: string | undefined) {
      if (id !== '@embroider/util') return null;
      if (!realPath) {
        const resolved = await this.resolve(id, importer, { skipSelf: true });
        if (!resolved) return null;
        realPath = resolved.id;
      }
      return PATCHED_ID;
    },
    load(id: string) {
      if (id !== PATCHED_ID || !realPath) return null;
      return `export * from ${JSON.stringify(realPath)};\nexport const ensureSafeComponent = (c) => c;\n`;
    },
  };
};

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
    patchEmbroiderUtil(),
    tailwindcss(),
    ember(),
    babel({
      babelHelpers: 'runtime',
      extensions,
    }),
    loadTranslations(),
  ],
});
