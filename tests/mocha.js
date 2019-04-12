/* eslint-disable import/no-extraneous-dependencies */
process.env.NODE_ENV = 'test';

const nodeTarget = '4.2.0';

// Register babel so that it will transpile ES6 to ES5
// before our tests run.
require('@babel/polyfill');

require('@babel/register')({
  presets: [
    [ '@babel/preset-env', {
      targets: {
        node: nodeTarget
      },
      shippedProposals: true
    } ]
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-transform-runtime',
    '@babel/plugin-syntax-dynamic-import'
  ]
});
