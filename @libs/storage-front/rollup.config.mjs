import { babel } from "@rollup/plugin-babel";
import { Addon } from "@embroider/addon-dev/rollup";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";
import alias from "@rollup/plugin-alias";
import {
  moveRouteTemplatesPlugin,
  fileNameMapper,
} from "@libs/repo-utils/configs/addon/mapper-plugin.mjs";

const addon = new Addon({
  srcDir: "src",
  destDir: "dist",
});

const rootDirectory = dirname(fileURLToPath(import.meta.url));
const babelConfig = resolve(rootDirectory, "./babel.publish.config.cjs");
const tsConfig = resolve(rootDirectory, "./tsconfig.publish.json");

export default {
  output: addon.output(),
  plugins: [
    alias({
      entries: [{ find: "#src", replacement: resolve(rootDirectory, "src") }],
    }),
    moveRouteTemplatesPlugin(),
    addon.publicEntrypoints([
      "**/*.js",
      "index.js",
      "template-registry.js",
      "**/*.yaml",
    ]),
    addon.appReexports(
      [
        "components/**/*-form.js",
        "helpers/**/*.js",
        "routes/**/*.js",
        "modifiers/**/*.js",
        "services/**/*.js",
        "handlers/**/*.js",
        "templates/**/*.js",
        "schemas/**/*.js",
      ],
      {
        mapFilename: fileNameMapper,
      },
    ),
    addon.dependencies(),
    babel({
      extensions: [".js", ".gjs", ".ts", ".gts"],
      babelHelpers: "bundled",
      configFile: babelConfig,
    }),
    addon.hbs(),
    addon.gjs(),
    addon.declarations(
      "declarations",
      `pnpm ember-tsc --declaration --project ${tsConfig}`,
    ),
    addon.keepAssets(["**/*.css"]),
    addon.clean(),
  ],
};
