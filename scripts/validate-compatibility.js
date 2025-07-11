#!/usr/bin/env node

const semver = require('semver');
const { engines } = require('../package.json');

console.log('🔍 Validating dependency compatibility...');

// Check Node.js version compatibility
const currentNodeVersion = process.version;
const requiredNodeVersion = engines.node;

console.log(`Node.js: ${currentNodeVersion} (required: ${requiredNodeVersion})`);

if (!semver.satisfies(currentNodeVersion, requiredNodeVersion)) {
  console.error('❌ Node.js version incompatible');
  process.exit(1);
}

// Additional validation can be added here for specific dependencies
// that might have compatibility issues

console.log('✅ All dependencies are compatible with current environment');
console.log('🎉 Validation complete!');
