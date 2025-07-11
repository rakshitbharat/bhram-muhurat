#!/usr/bin/env node

/**
 * 🕉️ TypeScript Examples Runner
 * 
 * This script demonstrates how to run TypeScript examples
 * with proper compilation and execution.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🕉️ Brahma Muhurat Calculator - TypeScript Examples');
console.log('=================================================\n');

// Check if TypeScript is available
try {
  execSync('npx tsc --version', { stdio: 'pipe' });
  console.log('✅ TypeScript compiler available');
} catch (error) {
  console.log('⚠️  TypeScript compiler not found. Installing...');
  try {
    execSync('npm install -g typescript ts-node', { stdio: 'inherit' });
    console.log('✅ TypeScript installed successfully');
  } catch (installError) {
    console.error('❌ Failed to install TypeScript');
    process.exit(1);
  }
}

// List of TypeScript examples
const examples = [
  {
    name: 'Simple TypeScript Example',
    file: 'typescript-simple.ts',
    description: 'Basic usage with TypeScript type safety'
  },
  {
    name: 'Advanced TypeScript Example',
    file: 'typescript-advanced.ts',
    description: 'Batch processing, multiple locations, and precision comparison'
  },
  {
    name: 'TypeScript Integration Example',
    file: 'typescript-integration.ts',
    description: 'Service classes and real-world integration patterns'
  }
];

// Function to run a TypeScript example
function runExample(example) {
  console.log(`\n🚀 Running: ${example.name}`);
  console.log(`📝 Description: ${example.description}`);
  console.log('─'.repeat(50));
  
  try {
    // Try to run with ts-node first
    try {
      execSync(`npx ts-node ${example.file}`, { 
        stdio: 'inherit',
        cwd: __dirname 
      });
      console.log(`✅ ${example.name} completed successfully`);
    } catch (tsNodeError) {
      console.log('⚠️  ts-node not available, compiling manually...');
      
      // Compile TypeScript to JavaScript
      const jsFile = example.file.replace('.ts', '.js');
      execSync(`npx tsc ${example.file} --target es2020 --module commonjs --lib es2020 --outDir .`, {
        stdio: 'inherit',
        cwd: __dirname
      });
      
      // Run the compiled JavaScript
      execSync(`node ${jsFile}`, { 
        stdio: 'inherit',
        cwd: __dirname 
      });
      
      // Clean up compiled file
      const jsPath = path.join(__dirname, jsFile);
      if (fs.existsSync(jsPath)) {
        fs.unlinkSync(jsPath);
      }
      
      console.log(`✅ ${example.name} completed successfully`);
    }
  } catch (error) {
    console.error(`❌ ${example.name} failed:`, error.message);
    return false;
  }
  
  return true;
}

// Main execution
async function main() {
  console.log('🎯 Running TypeScript Examples...\n');
  
  let successCount = 0;
  let totalCount = examples.length;
  
  for (const example of examples) {
    const success = runExample(example);
    if (success) {
      successCount++;
    }
    
    // Add separator between examples
    if (example !== examples[examples.length - 1]) {
      console.log('\n' + '='.repeat(60));
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TypeScript Examples Summary:');
  console.log(`✅ Successful: ${successCount}/${totalCount}`);
  console.log(`❌ Failed: ${totalCount - successCount}/${totalCount}`);
  
  if (successCount === totalCount) {
    console.log('\n🎉 All TypeScript examples completed successfully!');
    console.log('\n📝 Key Features Demonstrated:');
    console.log('  • Full TypeScript type safety');
    console.log('  • IntelliSense support');
    console.log('  • Compile-time error detection');
    console.log('  • Advanced integration patterns');
    console.log('  • Service-oriented architecture');
    console.log('  • Batch processing with types');
    console.log('  • Error handling with TypeScript');
  } else {
    console.log('\n⚠️  Some examples failed. Please check the logs above.');
    process.exit(1);
  }
}

// Handle command line arguments
if (process.argv.length > 2) {
  const exampleName = process.argv[2];
  const example = examples.find(ex => ex.file.includes(exampleName));
  
  if (example) {
    console.log(`🎯 Running specific example: ${example.name}\n`);
    const success = runExample(example);
    process.exit(success ? 0 : 1);
  } else {
    console.log(`❌ Example not found: ${exampleName}`);
    console.log('Available examples:');
    examples.forEach(ex => console.log(`  • ${ex.file}`));
    process.exit(1);
  }
} else {
  // Run all examples
  main().catch(error => {
    console.error('❌ Runner failed:', error);
    process.exit(1);
  });
}
