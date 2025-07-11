#!/usr/bin/env node

const semver = require('semver');
const { engines } = require('../package.json');

const currentNodeVersion = process.version;
const requiredNodeVersion = engines.node;

console.log(`Current Node.js version: ${currentNodeVersion}`);
console.log(`Required Node.js version: ${requiredNodeVersion}`);

if (!semver.satisfies(currentNodeVersion, requiredNodeVersion)) {
  console.error(`❌ Node.js version ${currentNodeVersion} does not satisfy required version ${requiredNodeVersion}`);
  console.error('Please update your Node.js version.');
  process.exit(1);
} else {
  console.log('✅ Node.js version check passed.');
}
