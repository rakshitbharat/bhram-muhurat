const fs = require('fs');
const https = require('https');
const semver = require('semver');

class DependencyUpdater {
  constructor() {
    this.packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  }

  async getLatestVersion(packageName) {
    return new Promise((resolve, reject) => {
      const url = `https://registry.npmjs.org/${packageName}/latest`;
      
      https.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const pkg = JSON.parse(data);
            resolve(pkg.version);
          } catch (error) {
            reject(error);
          }
        });
      }).on('error', reject);
    });
  }

  async updateDependencies() {
    const dependencies = this.packageJson.dependencies || {};
    const devDependencies = this.packageJson.devDependencies || {};
    
    console.log('🔍 Checking for latest versions...\n');
    
    // Update production dependencies
    for (const [name, currentVersion] of Object.entries(dependencies)) {
      try {
        const latestVersion = await this.getLatestVersion(name);
        const currentMajor = semver.major(currentVersion.replace('^', ''));
        const latestMajor = semver.major(latestVersion);
        
        // Only update if major version is compatible
        if (currentMajor === latestMajor) {
          dependencies[name] = `^${latestVersion}`;
          console.log(`✅ ${name}: ${currentVersion} → ^${latestVersion}`);
        } else {
          console.log(`⚠️  ${name}: ${currentVersion} (major version change available: ${latestVersion})`);
        }
      } catch (error) {
        console.log(`❌ ${name}: Failed to check latest version`);
      }
    }

    // Update dev dependencies
    for (const [name, currentVersion] of Object.entries(devDependencies)) {
      try {
        const latestVersion = await this.getLatestVersion(name);
        const currentMajor = semver.major(currentVersion.replace('^', ''));
        const latestMajor = semver.major(latestVersion);
        
        if (currentMajor === latestMajor) {
          devDependencies[name] = `^${latestVersion}`;
          console.log(`✅ ${name} (dev): ${currentVersion} → ^${latestVersion}`);
        } else {
          console.log(`⚠️  ${name} (dev): ${currentVersion} (major version change available: ${latestVersion})`);
        }
      } catch (error) {
        console.log(`❌ ${name} (dev): Failed to check latest version`);
      }
    }

    // Write updated package.json
    this.packageJson.dependencies = dependencies;
    this.packageJson.devDependencies = devDependencies;
    
    fs.writeFileSync('./package.json', JSON.stringify(this.packageJson, null, 2));
    console.log('\n📦 package.json updated with latest compatible versions');
    console.log('Run "npm install" to install updated dependencies');
  }

  generateDynamicVersions() {
    const dependencies = this.packageJson.dependencies || {};
    const dynamicVersions = {};
    
    Object.keys(dependencies).forEach(name => {
      // Generate flexible version ranges
      dynamicVersions[name] = `^${semver.major(dependencies[name].replace('^', ''))}.0.0`;
    });
    
    return dynamicVersions;
  }
}

// Run the updater
if (require.main === module) {
  const updater = new DependencyUpdater();
  updater.updateDependencies().catch(console.error);
}

module.exports = DependencyUpdater;
