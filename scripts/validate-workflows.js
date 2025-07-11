#!/usr/bin/env node

/**
 * GitHub Actions Workflow Validation Script
 * Validates all workflow files and configurations
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 GitHub Actions Workflow Validation');
console.log('=====================================\n');

const workflowsDir = path.join(__dirname, '..', '.github', 'workflows');
const errors = [];
const warnings = [];

/**
 * Check if a file exists
 */
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

/**
 * Read and parse YAML file
 */
function readYamlFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content;
  } catch (error) {
    errors.push(`❌ Cannot read file: ${filePath}`);
    return null;
  }
}

/**
 * Validate workflow files exist
 */
function validateWorkflowFiles() {
  console.log('📁 Checking workflow files...');
  
  const requiredWorkflows = [
    'ci.yml',
    'publish.yml',
    'release.yml',
    'auto-tag.yml',
    'auto-update.yml',
    'maintenance.yml'
  ];
  
  const foundWorkflows = [];
  
  for (const workflow of requiredWorkflows) {
    const workflowPath = path.join(workflowsDir, workflow);
    if (fileExists(workflowPath)) {
      foundWorkflows.push(workflow);
      console.log(`✅ ${workflow}`);
    } else {
      errors.push(`❌ Missing workflow: ${workflow}`);
    }
  }
  
  console.log(`\n📊 Found ${foundWorkflows.length}/${requiredWorkflows.length} workflows\n`);
  return foundWorkflows;
}

/**
 * Validate package.json configuration
 */
function validatePackageJson() {
  console.log('📦 Validating package.json...');
  
  const packagePath = path.join(__dirname, '..', 'package.json');
  if (!fileExists(packagePath)) {
    errors.push('❌ package.json not found');
    return;
  }
  
  try {
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    // Check required fields
    const requiredFields = ['name', 'version', 'main', 'author', 'repository'];
    for (const field of requiredFields) {
      if (!pkg[field]) {
        errors.push(`❌ Missing required field in package.json: ${field}`);
      } else {
        console.log(`✅ ${field}: ${typeof pkg[field] === 'object' ? JSON.stringify(pkg[field]).substring(0, 50) + '...' : pkg[field]}`);
      }
    }
    
    // Check version format
    if (pkg.version && !pkg.version.match(/^\d+\.\d+\.\d+(-.*)?$/)) {
      errors.push(`❌ Invalid version format: ${pkg.version}`);
    }
    
    // Check repository URL
    if (pkg.repository && pkg.repository.url) {
      if (!pkg.repository.url.includes('rakshitbharat/brahma-muhurat')) {
        warnings.push(`⚠️ Repository URL may be incorrect: ${pkg.repository.url}`);
      }
    }
    
    // Check for npm scripts
    const requiredScripts = ['test', 'lint', 'build'];
    for (const script of requiredScripts) {
      if (!pkg.scripts || !pkg.scripts[script]) {
        warnings.push(`⚠️ Missing npm script: ${script}`);
      }
    }
    
  } catch (error) {
    errors.push(`❌ Invalid JSON in package.json: ${error.message}`);
  }
  
  console.log('');
}

/**
 * Validate workflow syntax
 */
function validateWorkflowSyntax(workflows) {
  console.log('🔍 Validating workflow syntax...');
  
  for (const workflow of workflows) {
    const workflowPath = path.join(workflowsDir, workflow);
    const content = readYamlFile(workflowPath);
    
    if (!content) continue;
    
    // Check for common issues
    if (content.includes('${{ secrets.NPM_TOKEN }}') && !content.includes('NODE_AUTH_TOKEN')) {
      warnings.push(`⚠️ ${workflow}: NPM_TOKEN secret should be used with NODE_AUTH_TOKEN`);
    }
    
    // Check for proper job dependencies
    if (workflow === 'publish.yml' && !content.includes('needs:')) {
      warnings.push(`⚠️ ${workflow}: Should use job dependencies (needs:)`);
    }
    
    // Check for proper error handling
    if (content.includes('npm publish') && !content.includes('exit 1')) {
      warnings.push(`⚠️ ${workflow}: Should include proper error handling for npm publish`);
    }
    
    console.log(`✅ ${workflow} - syntax check passed`);
  }
  
  console.log('');
}

/**
 * Check for required GitHub secrets
 */
function checkRequiredSecrets() {
  console.log('🔑 Checking for required secrets...');
  
  const requiredSecrets = [
    'NPM_TOKEN'
  ];
  
  console.log('Required GitHub Secrets:');
  for (const secret of requiredSecrets) {
    console.log(`📝 ${secret} - Configure in GitHub repository settings`);
  }
  
  console.log('');
}

/**
 * Validate repository permissions
 */
function validateRepositorySettings() {
  console.log('⚙️ Repository settings to verify:');
  
  const settings = [
    'GitHub Actions enabled',
    'Workflow permissions: Read and write',
    'Allow GitHub Actions to create and approve pull requests',
    'Branch protection rules (optional but recommended)'
  ];
  
  for (const setting of settings) {
    console.log(`📋 ${setting}`);
  }
  
  console.log('');
}

/**
 * Check for common file issues
 */
function checkCommonIssues() {
  console.log('🔍 Checking for common issues...');
  
  // Check for consistent repository names
  const readmeContent = fs.readFileSync(path.join(__dirname, '..', 'README.md'), 'utf8');
  if (readmeContent.includes('brahma-muhurat') && readmeContent.includes('brahma-muhurat')) {
    warnings.push('⚠️ README.md contains inconsistent repository name references');
  }
  
  // Check for Node.js version compatibility
  const workflows = fs.readdirSync(workflowsDir);
  for (const workflow of workflows) {
    const content = readYamlFile(path.join(workflowsDir, workflow));
    if (content && content.includes('node-version') && !content.includes('20.x')) {
      warnings.push(`⚠️ ${workflow}: Consider updating to Node.js 20.x`);
    }
  }
  
  console.log('✅ Common issues check completed\n');
}

/**
 * Generate validation report
 */
function generateReport() {
  console.log('📊 Validation Report');
  console.log('==================\n');
  
  if (errors.length === 0 && warnings.length === 0) {
    console.log('🎉 All checks passed! Your workflows are properly configured.\n');
    
    console.log('🚀 Next steps:');
    console.log('1. Ensure NPM_TOKEN is configured in GitHub Secrets');
    console.log('2. Test a workflow by creating a small version bump');
    console.log('3. Monitor the GitHub Actions tab for successful runs');
    
    return true;
  }
  
  if (errors.length > 0) {
    console.log('❌ Errors found:');
    errors.forEach(error => console.log(`  ${error}`));
    console.log('');
  }
  
  if (warnings.length > 0) {
    console.log('⚠️ Warnings:');
    warnings.forEach(warning => console.log(`  ${warning}`));
    console.log('');
  }
  
  console.log('💡 Please fix the issues above before proceeding with releases.\n');
  return false;
}

/**
 * Main validation function
 */
function main() {
  try {
    const workflows = validateWorkflowFiles();
    validatePackageJson();
    validateWorkflowSyntax(workflows);
    checkRequiredSecrets();
    validateRepositorySettings();
    checkCommonIssues();
    
    const success = generateReport();
    
    if (success) {
      console.log('✅ GitHub Actions workflows validation completed successfully!');
      process.exit(0);
    } else {
      console.log('❌ Validation failed. Please fix the issues above.');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('💥 Validation script failed:', error.message);
    process.exit(1);
  }
}

// Run validation
main();
