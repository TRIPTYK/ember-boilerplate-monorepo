import { defineConfig } from "vite";
import { VitePluginNode } from "vite-plugin-node";
import path from "vite-tsconfig-paths";

export default defineConfig(({ command }) => ({
  plugins: [
    path(),
    ...(command === 'build' ? VitePluginNode({
      appPath: "src/app.bootstrap.ts",
      adapter: "fastify",
      outputFormat: "esm",
    }) : []),
  ],
  build: {
    target: "esnext",
    minify: true,
    sourcemap: 'inline',
  },
}));
