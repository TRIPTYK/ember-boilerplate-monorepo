'use strict';

const { templateCompatSupport } = require('@embroider/compat/babel');
const { buildMacros } = require('@embroider/macros/babel');
const { setConfig } = require('@warp-drive/core/build-config');

const macros = buildMacros({
  setOwnConfig: {
    isTesting: true,
  },
  configure: (config) => {
    setConfig(config, {
      compatWith: '5.6',
    });
  },
});

module.exports = {
  plugins: [
    ['ember-concurrency/async-arrow-task-transform', {}],
    [
      '@babel/plugin-transform-typescript',
      {
        allExtensions: true,
        onlyRemoveTypeImports: true,
        allowDeclareFields: true,
      },
    ],
    [
      'babel-plugin-ember-template-compilation',
      {
        compilerPath: 'ember-source/dist/ember-template-compiler.js',
        enableLegacyModules: [
          'ember-cli-htmlbars',
          'ember-cli-htmlbars-inline-precompile',
          'htmlbars-inline-precompile',
        ],
        transforms: [...templateCompatSupport()],
      },
    ],
    [
      'module:decorator-transforms',
      {
        runtime: {
          import: require.resolve('decorator-transforms/runtime-esm'),
        },
      },
    ],
    [
      '@babel/plugin-transform-runtime',
      {
        absoluteRuntime: __dirname,
        useESModules: true,
        regenerator: false,
      },
    ],
    ...macros.babelMacros,
  ],

  generatorOpts: {
    compact: false,
  },
};
