/**
 * This babel.config is only used for publishing.
 *
 * For local dev experience, see the babel.config
 */
const { buildMacros } = require('@embroider/macros/babel');
const { setConfig } = require('@warp-drive/core/build-config');

const Macros = buildMacros({
  configure: (config) => {
    setConfig(config, {
      compatWith: '5.6'
    });
  },
});

module.exports = {
  plugins: [
    [
      'ember-concurrency/async-arrow-task-transform',
      {}
    ],
    [
      '@babel/plugin-transform-typescript',
      {
        allExtensions: true,
        allowDeclareFields: true,
        onlyRemoveTypeImports: true,
      },
    ],
    [
      'babel-plugin-ember-template-compilation',
      {
        targetFormat: 'hbs',
        transforms: [],
      },
    ],
    [
      'module:decorator-transforms',
      {
        runtime: {
          import: 'decorator-transforms/runtime-esm',
        },
      },
    ],
    ...Macros.babelMacros,
  ],

  generatorOpts: {
    compact: false,
  },
};
