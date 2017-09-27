//  enable runtime transpilation to use ES6/7 in node
/* eslint-disable no-console */

"use strict";
const fs = require('fs');

const babelrc = fs.readFileSync('./.babelrc');
let config;

try {
  config = JSON.parse(babelrc);
} catch (err) {
  console.error('==>     ERROR: Error parsing your .babelrc.');
  console.error(err);
}


require('babel-register')(config);
