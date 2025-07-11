#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔨 Building Brahma Muhurat Calculator...');

// Simple build process - just verify main files exist
const mainFile = path.join(__dirname, '..', 'index.js');
const packageFile = path.join(__dirname, '..', 'package.json');

if (!fs.existsSync(mainFile)) {
  console.error('❌ Main file index.js not found');
  process.exit(1);
}

if (!fs.existsSync(packageFile)) {
  console.error('❌ Package.json not found');
  process.exit(1);
}

// Check if src directory structure exists (will be created later)
const srcDir = path.join(__dirname, '..', 'src');
if (fs.existsSync(srcDir)) {
  console.log('📁 Source directory structure found');
} else {
  console.log('📁 Source directory will be created during development');
}

console.log('✅ Build verification complete');
console.log('🎉 Ready for development!');
