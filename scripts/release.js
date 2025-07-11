#!/usr/bin/env node

/**
 * 🚀 Release Helper Script
 * Simplifies the release process for Brahma Muhurat Calculator
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PACKAGE_PATH = path.join(__dirname, '..', 'package.json');

class ReleaseHelper {
  constructor() {
    this.packageJson = this.loadPackageJson();
  }

  loadPackageJson() {
    try {
      return JSON.parse(fs.readFileSync(PACKAGE_PATH, 'utf8'));
    } catch (error) {
      console.error('❌ Could not load package.json');
      process.exit(1);
    }
  }

  getCurrentVersion() {
    return this.packageJson.version;
  }

  getNextVersion(type) {
    const current = this.getCurrentVersion();
    const parts = current.split('.').map(Number);
    
    switch (type) {
      case 'patch':
        parts[2]++;
        break;
      case 'minor':
        parts[1]++;
        parts[2] = 0;
        break;
      case 'major':
        parts[0]++;
        parts[1] = 0;
        parts[2] = 0;
        break;
      default:
        throw new Error(`Invalid version type: ${type}`);
    }
    
    return parts.join('.');
  }

  async checkGitStatus() {
    try {
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      if (status.trim()) {
        console.log('⚠️ You have uncommitted changes:');
        console.log(status);
        return false;
      }
      return true;
    } catch (error) {
      console.error('❌ Error checking git status:', error.message);
      return false;
    }
  }

  async runTests() {
    console.log('🧪 Running tests...');
    try {
      execSync('npm test', { stdio: 'inherit' });
      console.log('✅ All tests passed');
      return true;
    } catch (error) {
      console.error('❌ Tests failed');
      return false;
    }
  }

  async runLinting() {
    console.log('🔍 Running linting...');
    try {
      execSync('npm run lint', { stdio: 'inherit' });
      console.log('✅ Linting passed');
      return true;
    } catch (error) {
      console.error('❌ Linting failed');
      return false;
    }
  }

  async checkSecurity() {
    console.log('🔒 Checking security...');
    try {
      execSync('npm audit --audit-level moderate', { stdio: 'inherit' });
      console.log('✅ No security issues found');
      return true;
    } catch (error) {
      console.error('⚠️ Security issues detected - please fix before release');
      return false;
    }
  }

  displayReleaseInfo(versionType) {
    const current = this.getCurrentVersion();
    const next = this.getNextVersion(versionType);
    
    console.log('📋 Release Information:');
    console.log(`   Current Version: ${current}`);
    console.log(`   Next Version: ${next}`);
    console.log(`   Release Type: ${versionType}`);
    console.log(`   Package: ${this.packageJson.name}`);
    console.log('');
  }

  async performRelease(versionType, skipChecks = false) {
    console.log('🚀 Starting release process...\n');
    
    this.displayReleaseInfo(versionType);

    if (!skipChecks) {
      // Check git status
      if (!await this.checkGitStatus()) {
        console.log('💡 Tip: Commit your changes first, then run the release');
        return false;
      }

      // Run quality checks
      if (!await this.runLinting()) return false;
      if (!await this.runTests()) return false;
      if (!await this.checkSecurity()) return false;
    }

    try {
      console.log('📦 Updating version...');
      execSync(`npm version ${versionType}`, { stdio: 'inherit' });
      
      console.log('🚀 Pushing to GitHub...');
      execSync('git push origin main', { stdio: 'inherit' });
      
      console.log('');
      console.log('✅ Release initiated successfully!');
      console.log('');
      console.log('🎯 Next steps:');
      console.log('   • Auto-tag workflow will create the git tag');
      console.log('   • Publish workflow will handle NPM publication');
      console.log('   • Monitor progress: https://github.com/rakshitbharat/bhram-muhurat/actions');
      console.log('');
      console.log('📦 Your package will be available at:');
      console.log(`   npm install ${this.packageJson.name}@${this.getNextVersion(versionType)}`);
      
      return true;
    } catch (error) {
      console.error('❌ Release failed:', error.message);
      return false;
    }
  }

  showHelp() {
    console.log('🚀 Brahma Muhurat Calculator - Release Helper');
    console.log('');
    console.log('Usage: node scripts/release.js [command] [options]');
    console.log('');
    console.log('Commands:');
    console.log('  patch    Create a patch release (1.0.0 → 1.0.1)');
    console.log('  minor    Create a minor release (1.0.0 → 1.1.0)');
    console.log('  major    Create a major release (1.0.0 → 2.0.0)');
    console.log('  check    Run pre-release checks only');
    console.log('  status   Show current release status');
    console.log('  help     Show this help message');
    console.log('');
    console.log('Options:');
    console.log('  --skip-checks    Skip quality checks (not recommended)');
    console.log('  --dry-run        Show what would happen without doing it');
    console.log('');
    console.log('Examples:');
    console.log('  node scripts/release.js patch');
    console.log('  node scripts/release.js minor --dry-run');
    console.log('  node scripts/release.js check');
  }

  async showStatus() {
    console.log('📊 Current Release Status:');
    console.log(`   Version: ${this.getCurrentVersion()}`);
    console.log(`   Package: ${this.packageJson.name}`);
    console.log('');
    
    // Check git status
    const gitClean = await this.checkGitStatus();
    console.log(`   Git Status: ${gitClean ? '✅ Clean' : '⚠️ Has changes'}`);
    
    // Check latest tag
    try {
      const latestTag = execSync('git describe --tags --abbrev=0', { encoding: 'utf8' }).trim();
      console.log(`   Latest Tag: ${latestTag}`);
    } catch (error) {
      console.log('   Latest Tag: No tags found');
    }
    
    console.log('');
    console.log('💡 Next possible versions:');
    console.log(`   Patch: ${this.getNextVersion('patch')}`);
    console.log(`   Minor: ${this.getNextVersion('minor')}`);
    console.log(`   Major: ${this.getNextVersion('major')}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const options = args.slice(1);
  
  const skipChecks = options.includes('--skip-checks');
  const dryRun = options.includes('--dry-run');
  
  const helper = new ReleaseHelper();

  switch (command) {
    case 'patch':
    case 'minor':
    case 'major':
      if (dryRun) {
        console.log('🧪 DRY RUN MODE - No changes will be made');
        helper.displayReleaseInfo(command);
        console.log('✅ Dry run completed');
      } else {
        await helper.performRelease(command, skipChecks);
      }
      break;
      
    case 'check':
      console.log('🔍 Running pre-release checks...');
      await helper.checkGitStatus();
      await helper.runLinting();
      await helper.runTests();
      await helper.checkSecurity();
      console.log('✅ All checks completed');
      break;
      
    case 'status':
      await helper.showStatus();
      break;
      
    case 'help':
    case '--help':
    case '-h':
      helper.showHelp();
      break;
      
    default:
      console.log('❌ Unknown command:', command);
      console.log('Run "node scripts/release.js help" for usage information');
      process.exit(1);
  }
}

main().catch(error => {
  console.error('❌ Unexpected error:', error.message);
  process.exit(1);
});
