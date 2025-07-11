#!/usr/bin/env node

/**
 * 📊 Package Size Comparison
 * 
 * This script shows the before/after comparison of package size
 * after implementing the minimal build strategy.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📊 NPM Package Size Comparison');
console.log('==============================\n');

function calculateDirectorySize(dirPath) {
  let totalSize = 0;
  
  function traverse(currentPath) {
    const stats = fs.statSync(currentPath);
    
    if (stats.isDirectory()) {
      const files = fs.readdirSync(currentPath);
      files.forEach(file => {
        traverse(path.join(currentPath, file));
      });
    } else {
      totalSize += stats.size;
    }
  }
  
  if (fs.existsSync(dirPath)) {
    traverse(dirPath);
  }
  
  return totalSize;
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

console.log('🔍 Analyzing current project structure...\n');

// Calculate sizes of different parts
const projectRoot = path.join(__dirname, '..');
const sizes = {
  total: calculateDirectorySize(projectRoot),
  src: calculateDirectorySize(path.join(projectRoot, 'src')),
  types: calculateDirectorySize(path.join(projectRoot, 'types')),
  tests: calculateDirectorySize(path.join(projectRoot, 'test')),
  examples: calculateDirectorySize(path.join(projectRoot, 'examples')),
  docs: calculateDirectorySize(path.join(projectRoot, 'docs')),
  scripts: calculateDirectorySize(path.join(projectRoot, 'scripts')),
  github: calculateDirectorySize(path.join(projectRoot, '.github')),
  nodeModules: calculateDirectorySize(path.join(projectRoot, 'node_modules'))
};

// Add individual files
const individualFiles = ['README.md', 'package.json', 'LICENSE', 'index.js', 'eslint.config.js'];
individualFiles.forEach(file => {
  const filePath = path.join(projectRoot, file);
  if (fs.existsSync(filePath)) {
    sizes[file] = fs.statSync(filePath).size;
  }
});

console.log('📂 Current Project Structure Sizes:');
console.log('==================================');
console.log(`📁 Total project: ${formatSize(sizes.total)}`);
console.log(`📁 node_modules/: ${formatSize(sizes.nodeModules)}`);
console.log(`📁 src/: ${formatSize(sizes.src)}`);
console.log(`📁 types/: ${formatSize(sizes.types)}`);
console.log(`📁 test/: ${formatSize(sizes.tests)}`);
console.log(`📁 examples/: ${formatSize(sizes.examples)}`);
console.log(`📁 docs/: ${formatSize(sizes.docs)}`);
console.log(`📁 scripts/: ${formatSize(sizes.scripts)}`);
console.log(`📁 .github/: ${formatSize(sizes.github)}`);
console.log(`📄 README.md: ${formatSize(sizes['README.md'] || 0)}`);
console.log(`📄 package.json: ${formatSize(sizes['package.json'] || 0)}`);
console.log(`📄 LICENSE: ${formatSize(sizes['LICENSE'] || 0)}`);

// Calculate what would be included vs excluded
const includedSize = sizes.src + sizes.types + (sizes['README.md'] || 0) + (sizes['LICENSE'] || 0) + (sizes['package.json'] || 0);
const excludedSize = sizes.tests + sizes.examples + sizes.docs + sizes.scripts + sizes.github + (sizes['index.js'] || 0) + (sizes['eslint.config.js'] || 0);

console.log('\n📦 NPM Package Analysis:');
console.log('========================');
console.log(`✅ Included in package: ${formatSize(includedSize)}`);
console.log(`🚫 Excluded from package: ${formatSize(excludedSize)}`);
console.log(`📊 Size reduction: ${((excludedSize / (includedSize + excludedSize)) * 100).toFixed(1)}%`);

console.log('\n🎯 Minimal Package Contents:');
console.log('============================');
console.log('✅ INCLUDED:');
console.log(`   📁 src/ (${formatSize(sizes.src)}) - Core library code`);
console.log(`   📁 types/ (${formatSize(sizes.types)}) - TypeScript definitions`);
console.log(`   📄 README.md (${formatSize(sizes['README.md'] || 0)}) - Documentation`);
console.log(`   📄 LICENSE (${formatSize(sizes['LICENSE'] || 0)}) - MIT license`);
console.log(`   📄 package.json (~3KB) - Package metadata`);

console.log('\n🚫 EXCLUDED:');
console.log(`   📁 test/ (${formatSize(sizes.tests)}) - Test files`);
console.log(`   📁 examples/ (${formatSize(sizes.examples)}) - Example code`);
console.log(`   📁 docs/ (${formatSize(sizes.docs)}) - Development docs`);
console.log(`   📁 scripts/ (${formatSize(sizes.scripts)}) - Build scripts`);
console.log(`   📁 .github/ (${formatSize(sizes.github)}) - CI/CD workflows`);
console.log(`   📄 Development config files`);

// Try to get actual npm pack size
console.log('\n🔍 Actual NPM Package Size:');
console.log('===========================');

try {
  const packOutput = execSync('npm pack --dry-run --json', { encoding: 'utf8' });
  const packInfo = JSON.parse(packOutput);
  
  if (packInfo && packInfo[0]) {
    const info = packInfo[0];
    console.log(`📦 Packed size: ${formatSize(info.size)}`);
    console.log(`📁 Unpacked size: ${formatSize(info.unpackedSize)}`);
    console.log(`📄 File count: ${info.entryCount} files`);
    
    // Calculate compression ratio
    const compressionRatio = ((info.unpackedSize - info.size) / info.unpackedSize * 100).toFixed(1);
    console.log(`🗜️ Compression ratio: ${compressionRatio}%`);
  }
} catch (error) {
  console.log('⚠️ Could not determine exact NPM package size');
}

console.log('\n🎉 Benefits of Minimal Package:');
console.log('==============================');
console.log('✅ Faster installation for users');
console.log('✅ Reduced bandwidth usage');
console.log('✅ Cleaner node_modules');
console.log('✅ Better user experience');
console.log('✅ Only essential code included');
console.log('✅ Professional package structure');

console.log('\n📋 What Users Get:');
console.log('==================');
console.log('📦 A clean, minimal package with:');
console.log('   🔧 Core calculation engine');
console.log('   📝 Full TypeScript support');
console.log('   📚 Complete documentation');
console.log('   🛡️ Production-ready code');
console.log('   ⚡ Fast installation');

console.log('\n💡 Recommendation:');
console.log('==================');
if (includedSize < 100 * 1024) {
  console.log('🎯 Perfect! Package size is under 100KB - ideal for NPM distribution');
} else if (includedSize < 500 * 1024) {
  console.log('✅ Good! Package size is reasonable for NPM distribution');
} else {
  console.log('⚠️ Consider further optimization - package is quite large');
}

console.log('\n🚀 Ready for publication!');
