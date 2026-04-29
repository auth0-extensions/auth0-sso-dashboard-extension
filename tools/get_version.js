/* eslint-disable no-console, import/no-dynamic-require */

const path = process.argv[3] || '../package.json';
const attributes = require(path);
const value = attributes['version'];

if (value !== undefined) {
  console.log(value);
}