import { defineConfig } from 'tsdown';

export default defineConfig({
  dts: true,
  inlineOnly: false,
  clean: false,
  sourcemap: 'inline',
});