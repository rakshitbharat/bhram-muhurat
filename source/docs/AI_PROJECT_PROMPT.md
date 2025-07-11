# AI Project Prompt: Brahma Muhurat Calculator Library

## Project Overview
Create a high-precision JavaScript library for calculating Brahma Muhurat timings. Brahma Muhurat is a sacred period in Hindu tradition occurring 96 minutes (1 hour 36 minutes) before sunrise, considered the most auspicious time for spiritual practices.

## Technical Requirements

### Core Functionality
- Calculate precise sunrise times using astronomical algorithms
- Apply atmospheric refraction and elevation corrections
- Support multiple precision levels (basic, high, maximum)
- Handle timezone conversions accurately
- Validate geographical coordinates and inputs

### Required JavaScript Libraries (Dynamic Versioning)

**IMPORTANT: Use latest compatible versions when implementing**

Run these commands to get current latest versions:
```bash
# Check latest versions of all dependencies
npm view astronomia version
npm view swiss-ephemeris version  
npm view astronomy-engine version
npm view suncalc version
npm view moment-timezone version
npm view luxon version
npm view @js-temporal/polyfill version
npm view big.js version
npm view decimal.js version
npm view geodesy version
npm view proj4 version
npm view geolib version

# Or use our automated script
npm run update-deps
npm run check-latest
```

**Template package.json with dynamic versioning:**
```json
{
  "dependencies": {
    "astronomia": "^[LATEST_MAJOR].0.0",
    "swiss-ephemeris": "^[LATEST_MAJOR].0.0", 
    "astronomy-engine": "^[LATEST_MAJOR].0.0",
    "suncalc": "^[LATEST_MAJOR].0.0",
    "moment-timezone": "^[LATEST_MAJOR].0.0",
    "luxon": "^[LATEST_MAJOR].0.0",
    "@js-temporal/polyfill": "^[LATEST_MAJOR].0.0",
    "big.js": "^[LATEST_MAJOR].0.0",
    "decimal.js": "^[LATEST_MAJOR].0.0",
    "geodesy": "^[LATEST_MAJOR].0.0",
    "proj4": "^[LATEST_MAJOR].0.0",
    "geolib": "^[LATEST_MAJOR].0.0"
  }
}
```

### Dynamic Version Resolution Strategy

1. **At Implementation Time**: Always check for latest versions
2. **Version Range Policy**: Use caret ranges (^) for automatic minor/patch updates
3. **Major Version Updates**: Manual review required for breaking changes
4. **Compatibility Testing**: Test with multiple Node.js LTS versions

### Automated Version Management Commands

```bash
# Update to latest compatible versions
npm run update-deps

# Check for outdated packages
npm run check-latest

# Auto-update with npm-check-updates
npm run auto-update

# Validate compatibility across Node versions
npm run validate-deps
```

### Runtime Version Detection

```javascript
// Dynamic library loading with version checking
class BrahmaMuhuratCalculator {
  constructor(options = {}) {
    this._loadCompatibleLibraries();
    // ...existing code...
  }
  
  _loadCompatibleLibraries() {
    // Load libraries and check versions at runtime
    try {
      this.astronomia = require('astronomia');
      console.log(`Loaded astronomia v${this.astronomia.version || 'unknown'}`);
    } catch (error) {
      console.warn('Astronomia not available, using fallback');
    }
    
    try {
      this.swissEphemeris = require('swiss-ephemeris');
    } catch (error) {
      console.warn('Swiss Ephemeris not available, using SunCalc');
      this.swissEphemeris = null;
    }
  }
  
  // ...existing code...
}
```

## Error Handling
- Validate latitude/longitude ranges
- Check timezone validity using moment-timezone
- Validate date format
- Handle edge cases (polar regions, extreme dates)
- Provide meaningful error messages

## Testing Requirements
- Unit tests for all calculation methods
- Integration tests with known values
- Edge case testing (polar regions, equinoxes, solstices)
- Performance benchmarks
- Cross-validation with traditional Panchang data

## File Structure
```
brahma-muhurat/
├── src/
│   ├── core/
│   │   ├── astronomical.js
│   │   ├── refraction.js
│   │   └── muhurat.js
│   ├── utils/
│   │   ├── time.js
│   │   └── geo.js
│   └── index.js
├── test/
│   └── calculations.test.js
├── examples/
│   └── simple.js
├── package.json
├── README.md
└── BRAHMA_MUHURAT_CALCULATION.md
```

## Example Usage Code
```javascript
const BrahmaMuhurat = require('brahma-muhurat');

// Basic usage
const calculator = new BrahmaMuhurat({ precision: 'high' });
const result = calculator.calculate({
  latitude: 25.317644,
  longitude: 83.005495,
  elevation: 80.71,
  date: '2024-02-18',
  timezone: 'Asia/Kolkata'
});

console.log(`Brahma Muhurat: ${result.brahmaMuhuratStart} to ${result.brahmaMuhuratEnd}`);
```

## Validation Criteria
- Results must match traditional Panchang calculations within ±2 minutes
- Cross-verify with astronomical software (Stellarium, etc.)
- Handle edge cases gracefully
- Provide consistent results across different input formats
- Support major Indian cities and international locations

## Performance Requirements
- Calculate results within 100ms for basic precision
- Support batch calculations for multiple dates/locations
- Implement caching for repeated calculations
- Optimize for both Node.js and browser environments

## Documentation Requirements
- Comprehensive README with usage examples
- API documentation with parameter descriptions
- Mathematical formulas and accuracy specifications
- Comparison with other calculation methods
- Traditional context and cultural significance

## AI Implementation Instructions with Dynamic Versioning

1. **Before starting implementation:**
   ```bash
   # Check latest versions
   npm view <package-name> version
   # Or use automated script
   npm run update-deps
   ```

2. **Use flexible version ranges in package.json:**
   - Caret ranges (^) for automatic minor updates
   - Major version boundaries for compatibility

3. **Implement runtime version checking:**
   - Check library versions at startup
   - Provide fallbacks for missing libraries
   - Log version information for debugging

4. **Test with multiple Node.js versions:**
   - Use GitHub Actions matrix testing
   - Test LTS and current versions
   - Validate library compatibility

5. **Document version requirements:**
   - Minimum supported versions
   - Recommended versions
   - Known compatibility issues

### Version Update Workflow

```bash
# Developer workflow for version updates
npm run check-latest          # Check outdated packages
npm run update-deps          # Update to latest compatible
npm test                     # Run tests
npm run validate-deps        # Check compatibility
git commit -m "Update dependencies to latest versions"
```

This ensures the library always uses the most current, compatible versions available at implementation time.
// Conditional async/await vs Promise chains
const asyncSupport = parseFloat(process.version.slice(1)) >= 7.6;
```

### Testing Matrix
- Test on multiple Node.js versions in CI/CD
- Use GitHub Actions with matrix strategy
- Include LTS and current versions
- Test both production and development dependencies

### Package.json Versioning Best Practices
```json
{
  "engines": {
    "node": ">=12.0.0",
    "npm": ">=6.0.0"
  },
  "peerDependencies": {
    "node": ">=12.0.0"
  },
  "scripts": {
    "check-engines": "node scripts/check-node-version.js",
    "postinstall": "npm run check-engines"
  }
}
```

### Dynamic Library Loading
```javascript
// Load libraries dynamically based on availability
let swissEphemeris;
try {
  swissEphemeris = require('swiss-ephemeris');
} catch (error) {
  console.warn('Swiss Ephemeris not available, falling back to Astronomia');
  swissEphemeris = null;
}
```

## Expected Challenges
- **Version Compatibility**: Different Node.js versions may have varying API support
- **Dependency Conflicts**: Some astronomical libraries may not support all Node.js versions
- **Performance Variations**: Different Node.js versions have different performance characteristics
- **Feature Availability**: Newer JavaScript features may not be available in older Node.js versions
- **Memory Management**: Heap size limits vary across Node.js versions

### Recommended Solutions
- Use babel/typescript for transpilation if targeting older versions
- Implement feature flags for version-specific optimizations
- Create compatibility layers for API differences
- Use process.version for runtime version detection
- Implement comprehensive testing across version matrix

This approach ensures the library works across all supported Node.js versions while taking advantage of newer features when available.
