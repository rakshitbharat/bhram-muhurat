/**
 * Brahma Muhurat Calculator - Main Entry Point
 * High-precision JavaScript library for calculating Brahma Muhurat timings
 * 
 * @author Rakshit Patel
 * @version 1.0.0
 * @license MIT
 */

// Use the modular src structure
const BrahmaMuhuratCalculator = require('./src/index');

// Dynamic library loading with version checking
class CompatibilityLayer {
  constructor() {
    this._loadCompatibleLibraries();
  }
  
  _loadCompatibleLibraries() {
    // Load libraries and check versions at runtime
    try {
      this.astronomia = require('astronomia');
      console.log(`✅ Loaded astronomia v${this._getPackageVersion('astronomia')}`);
    } catch (error) {
      console.warn('⚠️  Astronomia not available, using astronomy-engine fallback');
      this.astronomia = null;
    }
    
    try {
      this.swissEphemeris = require('swiss-ephemeris');
      console.log(`✅ Loaded swiss-ephemeris v${this._getPackageVersion('swiss-ephemeris')}`);
    } catch (error) {
      console.warn('⚠️  Swiss Ephemeris not available, using SunCalc fallback');
      this.swissEphemeris = null;
    }
    
    // Load other essential libraries with version info
    try {
      this.suncalc = require('suncalc');
      this.astronomyEngine = require('astronomy-engine');
      this.momentTz = require('moment-timezone');
      this.luxon = require('luxon');
      this.bigJs = require('big.js');
      this.decimalJs = require('decimal.js');
      
      console.log(`✅ Core libraries loaded successfully`);
      console.log(`   📊 SunCalc: v${this._getPackageVersion('suncalc')}`);
      console.log(`   🌌 Astronomy Engine: v${this._getPackageVersion('astronomy-engine')}`);
      console.log(`   ⏰ Moment Timezone: v${this._getPackageVersion('moment-timezone')}`);
      console.log(`   📈 Big.js: v${this._getPackageVersion('big.js')}`);
    } catch (error) {
      console.error('❌ Failed to load essential libraries:', error.message);
      throw new Error('Critical libraries missing. Please run: npm install');
    }
  }
  
  _getPackageVersion(packageName) {
    try {
      return require(`${packageName}/package.json`).version;
    } catch (error) {
      return 'unknown';
    }
  }
  
  getLibraryStatus() {
    return {
      astronomia: !!this.astronomia,
      swissEphemeris: !!this.swissEphemeris,
      suncalc: !!this.suncalc,
      astronomyEngine: !!this.astronomyEngine,
      momentTz: !!this.momentTz,
      luxon: !!this.luxon,
      bigJs: !!this.bigJs,
      decimalJs: !!this.decimalJs
    };
  }
}

// Enhanced BrahmaMuhuratCalculator with dynamic library support
class EnhancedBrahmaMuhuratCalculator extends BrahmaMuhuratCalculator {
  constructor(options = {}) {
    // Initialize compatibility layer
    const compatibility = new CompatibilityLayer();
    
    // Pass compatibility info to parent
    super({
      ...options,
      libraryStatus: compatibility.getLibraryStatus()
    });
    
    this.compatibility = compatibility;
    
    // Runtime version checking
    this._performRuntimeChecks();
  }
  
  _performRuntimeChecks() {
    const nodeVersion = process.version;
    const asyncSupport = parseFloat(nodeVersion.slice(1)) >= 7.6;
    
    console.log(`🔍 Runtime Environment Check:`);
    console.log(`   Node.js: ${nodeVersion}`);
    console.log(`   Async/Await Support: ${asyncSupport ? '✅' : '❌'}`);
    console.log(`   Precision Mode: ${this.precision}`);
    console.log(`   Tradition Type: ${this.traditionType}`);
    
    // Warn about version compatibility
    if (!asyncSupport) {
      console.warn('⚠️  Node.js version < 7.6 detected. Some features may use Promise chains instead of async/await');
    }
  }
  
  /**
   * Get comprehensive library information including versions
   */
  static getLibraryInfo() {
    const compatibility = new CompatibilityLayer();
    const baseInfo = BrahmaMuhuratCalculator.getLibraryInfo();
    
    return {
      ...baseInfo,
      runtimeEnvironment: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch
      },
      libraryVersions: {
        suncalc: compatibility._getPackageVersion('suncalc'),
        astronomyEngine: compatibility._getPackageVersion('astronomy-engine'),
        momentTimezone: compatibility._getPackageVersion('moment-timezone'),
        luxon: compatibility._getPackageVersion('luxon'),
        bigJs: compatibility._getPackageVersion('big.js'),
        decimalJs: compatibility._getPackageVersion('decimal.js'),
        astronomia: compatibility._getPackageVersion('astronomia'),
        swissEphemeris: compatibility._getPackageVersion('swiss-ephemeris')
      },
      availableLibraries: compatibility.getLibraryStatus()
    };
  }
}

// Export the enhanced calculator as the main module
module.exports = EnhancedBrahmaMuhuratCalculator;
