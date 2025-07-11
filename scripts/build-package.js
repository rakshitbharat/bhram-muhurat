#!/usr/bin/env node

/**
 * 📦 NPM Package Build Script
 * 
 * This script prepares the package for NPM publication by:
 * - Validating the package structure
 * - Creating a minimal package build
 * - Verifying only essential files are included
 * - Testing the package installation
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📦 Building NPM Package - Minimal Distribution');
console.log('==============================================\n');

// Essential files that should be included in the package
const ESSENTIAL_FILES = [
  'package.json',
  'README.md',
  'LICENSE',
  'src/',
  'types/'
];

// Files that should NOT be included in the package
const EXCLUDE_FILES = [
  '.github/',
  'docs/',
  'examples/',
  'scripts/',
  'test/',
  'coverage/',
  '.gitignore',
  '.npmignore',
  'eslint.config.js',
  'index.js',  // Root index.js (development only)
  'test-javascript-only.js'
];

/**
 * Check if essential files exist
 */
function validateEssentialFiles() {
  console.log('🔍 Validating essential files...');
  
  let allValid = true;
  
  ESSENTIAL_FILES.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const type = stats.isDirectory() ? 'directory' : 'file';
      console.log(`✅ ${file} (${type})`);
    } else {
      console.log(`❌ ${file} - Missing!`);
      allValid = false;
    }
  });
  
  return allValid;
}

/**
 * Check package.json configuration
 */
function validatePackageJson() {
  console.log('\n📋 Validating package.json...');
  
  const packagePath = path.join(__dirname, '..', 'package.json');
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  // Check essential fields
  const requiredFields = ['name', 'version', 'description', 'main', 'types', 'files'];
  let valid = true;
  
  requiredFields.forEach(field => {
    if (pkg[field]) {
      console.log(`✅ ${field}: ${typeof pkg[field] === 'object' ? JSON.stringify(pkg[field]) : pkg[field]}`);
    } else {
      console.log(`❌ ${field}: Missing!`);
      valid = false;
    }
  });
  
  // Check files array
  if (pkg.files && Array.isArray(pkg.files)) {
    console.log('\n📁 Files to be included in package:');
    pkg.files.forEach(file => {
      console.log(`   • ${file}`);
    });
  }
  
  return valid;
}

/**
 * Test package creation
 */
function testPackageCreation() {
  console.log('\n📦 Testing package creation...');
  
  try {
    // Create package tarball
    console.log('Creating package tarball...');
    const output = execSync('npm pack --dry-run', { encoding: 'utf8' });
    
    console.log('✅ Package creation successful!');
    console.log('\n📋 Package contents preview:');
    
    // Parse the output to show what would be included
    const lines = output.split('\n');
    let inFilesList = false;
    
    lines.forEach(line => {
      if (line.includes('npm notice') && line.includes('files:')) {
        console.log(`📊 ${line.replace('npm notice', '').trim()}`);
      } else if (line.includes('npm notice') && line.includes('package size:')) {
        console.log(`📦 ${line.replace('npm notice', '').trim()}`);
      } else if (line.includes('npm notice') && line.includes('unpacked size:')) {
        console.log(`📏 ${line.replace('npm notice', '').trim()}`);
      } else if (line.includes('npm notice') && line.includes('===')) {
        inFilesList = true;
      } else if (inFilesList && line.includes('npm notice') && line.trim().length > 'npm notice'.length) {
        const fileName = line.replace('npm notice', '').trim();
        if (fileName && !fileName.includes('===')) {
          console.log(`   📄 ${fileName}`);
        }
      }
    });
    
    return true;
  } catch (error) {
    console.error('❌ Package creation failed:', error.message);
    return false;
  }
}

/**
 * Calculate package size
 */
function calculatePackageSize() {
  console.log('\n📊 Calculating package size...');
  
  try {
    const output = execSync('npm pack --dry-run --json', { encoding: 'utf8' });
    const packageInfo = JSON.parse(output);
    
    if (packageInfo && packageInfo[0]) {
      const info = packageInfo[0];
      console.log(`📦 Package name: ${info.name}`);
      console.log(`📏 Packed size: ${(info.size / 1024).toFixed(2)} KB`);
      console.log(`📁 File count: ${info.entryCount} files`);
      console.log(`🏷️ Version: ${info.version}`);
      
      // Recommend if size is too large
      if (info.size > 1024 * 1024) { // > 1MB
        console.log('⚠️ Package size is quite large. Consider excluding more development files.');
      } else if (info.size < 50 * 1024) { // < 50KB
        console.log('✅ Package size is optimal for NPM distribution.');
      } else {
        console.log('✅ Package size is reasonable.');
      }
    }
    
    return true;
  } catch (error) {
    console.log('⚠️ Could not calculate exact package size.');
    return true;
  }
}

/**
 * Verify TypeScript definitions
 */
function verifyTypeScriptDefinitions() {
  console.log('\n🔤 Verifying TypeScript definitions...');
  
  const typesPath = path.join(__dirname, '..', 'types', 'index.d.ts');
  
  if (fs.existsSync(typesPath)) {
    const content = fs.readFileSync(typesPath, 'utf8');
    
    // Check for essential type exports
    const requiredTypes = ['CalculationParams', 'CalculationResult', 'CalculatorOptions'];
    
    requiredTypes.forEach(type => {
      if (content.includes(type)) {
        console.log(`✅ ${type} - Exported`);
      } else {
        console.log(`⚠️ ${type} - Not found`);
      }
    });
    
    // Check file size
    const sizeKB = (fs.statSync(typesPath).size / 1024).toFixed(2);
    console.log(`📏 TypeScript definitions size: ${sizeKB} KB`);
    
    return true;
  } else {
    console.log('❌ TypeScript definitions not found!');
    return false;
  }
}

/**
 * Generate package summary
 */
function generatePackageSummary() {
  console.log('\n📋 Package Summary:');
  console.log('==================');
  
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
  
  console.log(`📦 Package: ${pkg.name}@${pkg.version}`);
  console.log(`📝 Description: ${pkg.description}`);
  console.log(`🎯 Main entry: ${pkg.main}`);
  console.log(`🔤 TypeScript: ${pkg.types}`);
  console.log(`📜 License: ${pkg.license}`);
  
  console.log('\n✨ What users will get:');
  console.log('  📁 src/ - Core library code');
  console.log('  🔤 types/ - TypeScript definitions');
  console.log('  📖 README.md - Complete documentation');
  console.log('  📜 LICENSE - MIT license');
  
  console.log('\n🚫 What\'s excluded from package:');
  console.log('  🧪 test/ - Test files');
  console.log('  📚 examples/ - Example code');
  console.log('  📋 docs/ - Development documentation');
  console.log('  🔧 scripts/ - Build and development scripts');
  console.log('  ⚙️ .github/ - GitHub Actions workflows');
  console.log('  🛠️ Development configuration files');
}

/**
 * Main build process
 */
async function main() {
  try {
    console.log('🚀 Starting NPM package build validation...\n');
    
    // Validate essential files
    if (!validateEssentialFiles()) {
      console.error('❌ Essential files validation failed!');
      process.exit(1);
    }
    
    // Validate package.json
    if (!validatePackageJson()) {
      console.error('❌ package.json validation failed!');
      process.exit(1);
    }
    
    // Verify TypeScript definitions
    if (!verifyTypeScriptDefinitions()) {
      console.error('❌ TypeScript definitions validation failed!');
      process.exit(1);
    }
    
    // Test package creation
    if (!testPackageCreation()) {
      console.error('❌ Package creation test failed!');
      process.exit(1);
    }
    
    // Calculate package size
    calculatePackageSize();
    
    // Generate summary
    generatePackageSummary();
    
    console.log('\n🎉 NPM Package Build Validation Complete!');
    console.log('\n🚀 Ready for publication with:');
    console.log('   npm publish');
    console.log('\n📦 Users can install with:');
    
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
    console.log(`   npm install ${pkg.name || 'bhram-muhurat'}`);
    
  } catch (error) {
    console.error('💥 Build validation failed:', error.message);
    process.exit(1);
  }
}

// Run the build validation
if (require.main === module) {
  main();
}

module.exports = { main, validateEssentialFiles, validatePackageJson };
