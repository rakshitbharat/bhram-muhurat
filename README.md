<div align="center">
  
# 🕉️ Brahma Muhurat Calculator

### *The most auspicious time for your spiritual practice*

[![npm version](https://img.shields.io/npm/v/bhram-muhurat.svg?style=for-the-badge&color=orange)](https://www.npmjs.com/package/bhram-muhurat)
[![downloads](https://img.shields.io/npm/dm/bhram-muhurat.svg?style=for-the-badge&color=brightgreen)](https://www.npmjs.com/package/bhram-muhurat)
[![license](https://img.shields.io/npm/l/bhram-muhurat.svg?style=for-the-badge&color=blue)](https://github.com/rakshitbharat/bhram-muhurat/blob/main/LICENSE)
[![tests](https://img.shields.io/badge/tests-83%20passing-success?style=for-the-badge)](https://github.com/rakshitbharat/bhram-muhurat)

**A high-precision JavaScript library for calculating Brahma Muhurat with NASA-grade astronomical accuracy**

*Calculate the sacred time period occurring approximately 96 minutes before sunrise - the most auspicious time in Hindu tradition for meditation, yoga, and spiritual practices.*

</div>

---

## ✨ Why Choose Brahma Muhurat Calculator?

🎯 **Precision** • NASA-grade astronomical accuracy with multiple precision levels  
🌍 **Global** • Works anywhere on Earth with proper timezone handling  
⚡ **Fast** • Sub-100ms calculations optimized for performance  
🧪 **Tested** • 83 comprehensive test cases with 60%+ coverage  
📱 **Universal** • Works in Node.js and modern browsers  
🔮 **Spiritual** • Respects Hindu traditions while embracing modern science

## 🚀 Quick Start

```bash
npm install bhram-muhurat
```

### JavaScript Usage
```javascript
const BrahmaMuhuratCalculator = require('bhram-muhurat');

// 🎯 Simple calculation
const calculator = new BrahmaMuhuratCalculator();

const result = calculator.calculate({
  latitude: 25.317644,    // 📍 Varanasi, India
  longitude: 83.005495,
  date: '2024-02-18',
  timezone: 'Asia/Kolkata'
});

console.log(`🌅 Brahma Muhurat: ${result.brahmaMuhurat.start.localTime} - ${result.brahmaMuhurat.end.localTime}`);
console.log(`☀️ Sunrise: ${result.sunrise.localTime}`);
console.log(`⏰ Duration: ${result.brahmaMuhurat.duration.formatted}`);
```

### TypeScript Usage
```typescript
import { CalculationParams, CalculationResult } from 'bhram-muhurat';
const BrahmaMuhuratCalculator = require('bhram-muhurat');

// 🎯 Type-safe calculation
const calculator = new BrahmaMuhuratCalculator({
  precision: 'high',
  traditionType: 'standard',
  refractionModel: 'bennett'
});

const params: CalculationParams = {
  latitude: 25.317644,
  longitude: 83.005495,
  date: '2024-02-18',
  timezone: 'Asia/Kolkata'
};

const result: CalculationResult = calculator.calculate(params);
console.log(`🕉️ Brahma Muhurat: ${result.brahmaMuhurat.start.localTime} - ${result.brahmaMuhurat.end.localTime}`);
```

## 🌟 Key Features

### 🎯 **Precision Levels**
| Level | Accuracy | Best For |
|-------|----------|----------|
| `basic` | ±2-5 minutes | Quick calculations |
| `high` | ±30 seconds | Daily practice (recommended) |
| `maximum` | ±10-30 seconds | Precise ceremonies |

### 🏛️ **Tradition Types**
| Type | Duration | Description |
|------|----------|-------------|
| `standard` | 96 minutes | Traditional calculation |
| `extended` | 120 minutes | Intensive spiritual practice |
| `smarta` | 96 minutes exact | Orthodox Vedic calculation |
| `dynamic` | Variable | Seasonal day-length based |

### 🌍 **Global Capabilities**
- ✅ **International locations** with timezone intelligence
- ✅ **Polar regions** handling for extreme latitudes  
- ✅ **High altitude** corrections up to mountain peaks
- ✅ **Batch processing** for multiple dates/locations
- ✅ **Seasonal variations** with spiritual significance

### 🔬 **Scientific Accuracy**
- 🛰️ **NASA-grade algorithms** from astronomy-engine
- 🌡️ **Atmospheric corrections** for pressure, temperature, humidity
- 📐 **3 refraction models**: Bennett, Sæmundsson, Rigorous
- 🔄 **Cross-validation** against traditional Panchang (±10min accuracy)
- 🌙 **Moon phase calculations** with spiritual significance

## 📁 Project Architecture

<details>
<summary><b>🏗️ View Project Structure</b></summary>

```
🕉️ bhram-muhurat/
├── 📁 src/                          # Source code
│   ├── 📁 core/                     # Core astronomical calculations
│   │   ├── 🧮 astronomical.js       # NASA-grade solar calculations
│   │   ├── 🌫️ refraction.js         # Atmospheric refraction models
│   │   └── 🕉️ muhurat.js            # Brahma Muhurat calculation logic
│   ├── 📁 utils/                    # Utility functions
│   │   ├── ⏰ time.js               # Time utilities and formatting
│   │   └── 🌍 geo.js               # Geographic utilities and validation
│   └── 🎯 index.js                 # Main library entry point
├── 📁 test/                        # Comprehensive test suite
│   ├── 🧪 calculations.test.js     # Core functionality tests
│   ├── 📊 coverage-enhancement.test.js # Coverage improvement tests
│   └── 🔧 utilities-coverage.test.js   # Utility function tests
├── 📁 examples/                    # Working examples
│   ├── 🌱 simple.js               # Basic usage demonstration
│   └── 🚀 advanced.js             # Advanced features showcase
├── 📁 scripts/                    # Automation scripts
│   ├── 🔄 update-dependencies.js  # Automated dependency management
│   ├── 🔧 build.js               # Build verification
│   ├── ✅ check-node-version.js   # Node.js compatibility check
│   └── 🔍 validate-compatibility.js # Environment validation
├── 📁 types/                      # TypeScript definitions
│   └── 📝 index.d.ts             # Complete type definitions
├── 📁 docs/                       # Documentation
│   ├── 📋 AI_PROJECT_PROMPT.md    # Original development specifications
│   ├── 🧮 BRAHMA_MUHURAT_CALCULATION.md # Mathematical documentation
│   ├── 📊 DEVELOPMENT_SUMMARY.md  # Project overview
│   ├── 🧪 TEST_COVERAGE_TYPESCRIPT_SUMMARY.md # Testing details
│   └── 📝 FINAL_DEVELOPMENT_NOTES.md # Complete development notes
├── 📄 package.json               # Package configuration
├── 📖 README.md                  # This beautiful documentation
└── 🔒 .gitignore                # Git ignore patterns
```
</details>

### Precision Levels
- **`basic`**: ±2-5 minutes accuracy, fastest performance
- **`high`**: ±30 seconds to 2 minutes, recommended for most uses
- **`maximum`**: ±10-30 seconds, highest accuracy with atmospheric corrections

### Tradition Types
- **`standard`**: 96 minutes before sunrise (traditional)
- **`extended`**: 120 minutes before sunrise (intensive practice)
- **`smarta`**: 96 minutes exact (orthodox calculation)
- **`dynamic`**: Variable duration based on seasonal day length

### Refraction Models
- **`bennett`**: Most commonly used, good general accuracy
- **`saemundsson`**: More accurate for low altitudes
- **`rigorous`**: Highest accuracy with humidity effects

## 💻 Advanced Usage

<details>
<summary><b>🌐 Multiple Locations</b></summary>

```javascript
const locations = [
  { name: '🇮🇳 Varanasi', lat: 25.317644, lon: 83.005495, tz: 'Asia/Kolkata' },
  { name: '🇺🇸 New York', lat: 40.7128, lon: -74.0060, tz: 'America/New_York' },
  { name: '🇬🇧 London', lat: 51.5074, lon: -0.1278, tz: 'Europe/London' }
];

locations.forEach(loc => {
  const result = calculator.calculate({
    latitude: loc.lat,
    longitude: loc.lon,
    date: '2024-02-18',
    timezone: loc.tz
  });
  console.log(`${loc.name}: ${result.brahmaMuhurat.start.localTime}`);
});
```
</details>

<details>
<summary><b>📅 Batch Processing</b></summary>

```javascript
const dates = ['2024-02-18', '2024-02-19', '2024-02-20'];
const batchResults = calculator.calculateBatch({
  latitude: 25.317644,
  longitude: 83.005495,
  timezone: 'Asia/Kolkata'
}, dates);

batchResults.forEach((result, index) => {
  console.log(`Day ${index + 1}: ${result.brahmaMuhurat.start.localTime}`);
});
```
</details>

<details>
<summary><b>🏔️ High Altitude & Atmospheric Conditions</b></summary>

```javascript
// Calculate for Mount Kailash (high altitude)
const result = calculator.calculate({
  latitude: 31.0688,      // Mount Kailash
  longitude: 81.3108,
  elevation: 6638,        // High altitude in meters
  pressure: 360,          // Reduced atmospheric pressure
  temperature: -10,       // Cold temperature
  humidity: 0.1,          // Low humidity
  date: '2024-02-18',
  timezone: 'Asia/Kolkata'
});
```
</details>

<details>
<summary><b>🎯 Precision Comparison</b></summary>

```javascript
const precisions = ['basic', 'high', 'maximum'];
const location = { lat: 25.317644, lon: 83.005495, tz: 'Asia/Kolkata' };

precisions.forEach(precision => {
  const calc = new BrahmaMuhuratCalculator({ precision });
  const result = calc.calculate({
    ...location,
    date: '2024-02-18',
    timezone: location.tz
  });
  console.log(`${precision}: ${result.brahmaMuhurat.start.localTime}`);
});
```
</details>

## 📚 API Reference

<details>
<summary><b>🏗️ Constructor Options</b></summary>

```javascript
const calculator = new BrahmaMuhuratCalculator({
  precision: 'high',           // 'basic' | 'high' | 'maximum'
  traditionType: 'standard',   // 'standard' | 'extended' | 'smarta' | 'dynamic'
  refractionModel: 'bennett'   // 'bennett' | 'saemundsson' | 'rigorous'
});
```
</details>

<details>
<summary><b>📝 TypeScript Support</b></summary>

Full TypeScript integration with comprehensive type definitions:

```typescript
import { CalculationParams, CalculationResult, CalculatorOptions } from 'bhram-muhurat';
const BrahmaMuhuratCalculator = require('bhram-muhurat');

// Type-safe calculator creation
const calculator = new BrahmaMuhuratCalculator({
  precision: 'high',
  traditionType: 'standard',
  refractionModel: 'bennett'
});

// Type-safe parameters
const params: CalculationParams = {
  latitude: 25.317644,
  longitude: 83.005495,
  date: '2024-02-18',
  timezone: 'Asia/Kolkata'
};

// Type-safe result
const result: CalculationResult = calculator.calculate(params);
```

**TypeScript Examples:**
```bash
npm run example:typescript        # All TypeScript examples
npm run example:ts-simple        # Basic usage
npm run example:ts-advanced      # Advanced features
npm run example:ts-integration   # Service patterns
```

**📖 Full TypeScript Guide:** [docs/TYPESCRIPT_GUIDE.md](docs/TYPESCRIPT_GUIDE.md)
</details>

<details>
<summary><b>🎯 Main Methods</b></summary>

### `calculate(params)` - Main calculation method
```javascript
const result = calculator.calculate({
  latitude: 25.317644,         // Decimal degrees (-90 to 90)
  longitude: 83.005495,        // Decimal degrees (-180 to 180)
  elevation: 80,               // Meters above sea level (optional)
  date: '2024-02-18',         // YYYY-MM-DD format
  timezone: 'Asia/Kolkata',    // IANA timezone name
  pressure: 1013.25,          // Atmospheric pressure in mbar (optional)
  temperature: 15,            // Temperature in Celsius (optional)
  humidity: 0.5               // Relative humidity 0-1 (optional)
});
```

### `calculateBatch(baseParams, dates)` - Multiple dates
```javascript
const results = calculator.calculateBatch(baseParams, ['2024-02-18', '2024-02-19']);
```

### `calculateSunrise(params)` - Sunrise only
```javascript
const sunrise = calculator.calculateSunrise(params);
```
</details>

<details>
<summary><b>🔧 Static Utility Methods</b></summary>

```javascript
// Get supported timezones
const timezones = BrahmaMuhuratCalculator.getSupportedTimezones();

// Format coordinates
const formatted = BrahmaMuhuratCalculator.formatCoordinates(25.317644, 83.005495);

// Validate coordinates
const isValid = BrahmaMuhuratCalculator.validateCoordinates(25.317644, 83.005495);

// Get library information
const info = BrahmaMuhuratCalculator.getLibraryInfo();
```
</details>

## 🧪 Testing & Quality

```bash
# 🧪 Run comprehensive test suite (83 tests)
npm test

# 📊 Run with coverage report
npm run test:coverage

# 🔍 Code linting
npm run lint

# 🚀 Try examples
npm run example          # Simple usage
npm run example:advanced # Advanced features

# 📝 TypeScript examples
npm run example:typescript        # All TypeScript examples
npm run example:ts-simple        # Simple TypeScript example
npm run example:ts-advanced      # Advanced TypeScript features
npm run example:ts-integration   # TypeScript integration patterns
```

**Quality Metrics:**
- ✅ **83 tests passing** with comprehensive edge cases  
- ✅ **60.52% test coverage** across all modules
- ✅ **Zero ESLint issues** - clean, maintainable code
- ✅ **Cross-validated** against traditional Panchang calculations
- ✅ **Performance tested** - all calculations under 100ms

## 🌍 Spiritual Context & Cultural Significance

<div align="center">

*"Brahma Muhurat is the time of Brahma - the creator. It is the most auspicious time for spiritual practices, when the mind is naturally calm and conducive to meditation."*

</div>

### 🙏 **Perfect for:**
- 🧘 **Meditation and Pranayama** - Enhanced focus and awareness
- 📿 **Mantra Recitation** - Amplified spiritual vibrations  
- 📖 **Scripture Study** - Improved comprehension and retention
- 🕉️ **Yoga Practice** - Optimal mind-body harmony
- 🪔 **Religious Ceremonies** - Maximum spiritual benefit

### 🌅 **Traditional Significance:**
- **Sattvic Period**: Time when Sattva (purity) dominates
- **Divine Connection**: Easier access to higher consciousness  
- **Mental Clarity**: Natural state of alertness and focus
- **Spiritual Progress**: Accelerated spiritual development
- **Energy Alignment**: Optimal cosmic energy for transformation

## 🛠️ Development Scripts

```bash
# 🔄 Check for dependency updates
npm run check-latest

# ⬆️ Update dependencies automatically  
npm run update-deps

# ✅ Validate environment compatibility
npm run validate-deps

# 🔧 Build verification
npm run build
```

## 🤝 Human-AI Partnership

<div align="center">

**This library is a product of collaborative innovation between human wisdom and AI assistance.**

*Developed through the synergy of traditional spiritual knowledge, modern astronomical science, and cutting-edge AI technology.*

</div>

### 👥 **The Collaboration:**
- 🧠 **Human Vision**: Spiritual understanding, cultural authenticity, and practical requirements
- 🤖 **AI Assistance**: Code optimization, testing strategies, and technical implementation  
- 🔬 **Scientific Accuracy**: NASA-grade algorithms with traditional validation
- 🙏 **Cultural Respect**: Honoring Hindu traditions while embracing modern technology

This partnership demonstrates how AI can augment human creativity and domain expertise to create tools that serve both technical excellence and spiritual practice.

---

## 🌐 Compatibility & Requirements

| Environment | Version | Status |
|-------------|---------|--------|
| Node.js | 12.0.0+ | ✅ Fully Supported |
| Browser | ES6+ | ✅ Fully Supported |
| TypeScript | 4.0+ | ✅ Full Type Definitions |
| React/Vue/Angular | Any | ✅ Framework Agnostic |

---

## 📄 License & Contributing

### 📜 **License**
MIT License - Free for personal and commercial use

### 🤝 **Contributing**
We welcome contributions! Please:
1. 🍴 Fork the repository
2. 🌿 Create a feature branch
3. ✅ Ensure all tests pass
4. 📝 Add documentation for new features
5. 🚀 Submit a pull request

### 💬 **Support & Community**
- 🐛 **Issues**: [GitHub Issues](https://github.com/rakshitbharat/bhram-muhurat/issues)
- 📖 **Documentation**: Comprehensive guides and examples
- 💡 **Feature Requests**: We'd love to hear your ideas!

---

## 🙏 Acknowledgments

### 🌟 **Special Thanks:**
- **Vedic Astronomers** for the foundational mathematical principles
- **Modern Astronomers** for precise celestial mechanics
- **Open Source Community** for the astronomical libraries
- **Spiritual Practitioners** for validation and feedback
- **AI Technology** for enhancing development capabilities

### 📚 **Based on:**
- Traditional Hindu astronomical calculations (Jyotisha)
- Modern astronomical algorithms and NASA data
- Atmospheric science research
- Cross-cultural spiritual practices

---

<div align="center">

## 🕉️ **May your spiritual journey be blessed with perfect timing!**

*"Time is the most precious gift - use it wisely for spiritual growth"*

[![npm](https://img.shields.io/npm/v/bhram-muhurat.svg?style=for-the-badge&logo=npm&color=red)](https://www.npmjs.com/package/bhram-muhurat)
[![GitHub](https://img.shields.io/github/stars/rakshitbharat/bhram-muhurat.svg?style=for-the-badge&logo=github&color=black)](https://github.com/rakshitbharat/bhram-muhurat)

**Made with 🧠 Human Wisdom + 🤖 AI Innovation + 🙏 Spiritual Devotion**

</div>
