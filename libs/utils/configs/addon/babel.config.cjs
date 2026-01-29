/**
 * This babel.config is not used for publishing.
 * It's only for the local editing experience
 * (and linting)
 */
const { buildMacros } = require('@embroider/macros/babel');

const {
  babelCompatSupport,
  templateCompatSupport,
} = require('@embroider/compat/babel');

// For scenario testing
const isCompat = Boolean(process.env.ENABLE_COMPAT_BUILD);

const { setConfig } = require('@warp-drive/core/build-config');

const macros = buildMacros({
  setOwnConfig: {
    isTesting: true
  },
  configure: (config) => {
    setConfig(config, {
      compatWith: '5.6'
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
        allowDeclareFields: true,
        onlyRemoveTypeImports: true,
      },
    ],
    [
      'babel-plugin-ember-template-compilation',
      {
        transforms: [
          ...(isCompat ? templateCompatSupport() : macros.templateMacros),
        ],
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
    ...(isCompat ? babelCompatSupport() : macros.babelMacros),
  ],

  generatorOpts: {
    compact: false,
  },
};
