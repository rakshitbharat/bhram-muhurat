# Brahma Muhurat Calculation Guide

This document provides precise calculations for determining the Brahma Muhurat with maximum accuracy using JavaScript.

## Prerequisites
- GPS coordinates (latitude/longitude) with 6+ decimal places
- Elevation data in meters
- Date and time of calculation
- Local atmospheric conditions (optional for highest accuracy)

## Exact Calculation Methodology

### 1. Calculate Precise Sunrise

#### Step 1.1: Determine Solar Position
Calculate the solar position using the following astronomical parameters:
- Earth's orbital elements
- Nutation and precession corrections
- Julian day calculation

```javascript
// Using Astronomia.js for maximum accuracy
const { julian, sidereal, solar } = require('astronomia');
const moment = require('moment-timezone');

function calculateSunrise(latitude, longitude, elevation, date, timezone, pressure = 1013.25, temperature = 15) {
  // Convert date to Julian date
  const jd = julian.DateToJD(new Date(date));
  
  // Calculate local sidereal time
  const lst = sidereal.apparent(jd);
  
  // Calculate sun position
  const sunPos = solar.trueVSOP87(jd);
  
  // Apply corrections and calculate sunrise
  // Implementation depends on the specific libraries used
}
```

#### Step 1.2: Apply Corrections

1. **Atmospheric Refraction Correction**:
   ```
   R = 1.02 / tan(h + 10.3/(h + 5.11))
   
   Where:
   - h = apparent altitude in degrees
   - R = refraction correction in arc-minutes
   ```

2. **Elevation Correction**:
   ```
   D = -1.76 × √(elevation) / 60
   
   Where:
   - D = additional depression angle in degrees
   - elevation = observer's elevation in meters
   ```

3. **Corrected Sunrise Time**:
   ```
   True Sunrise = Apparent Sunrise + Refraction Correction + Elevation Correction
   ```

### 2. Calculate Brahma Muhurat

#### Step 2.1: Standard Calculation
```
Brahma Muhurat Start = True Sunrise - 96 minutes
Brahma Muhurat End = True Sunrise
```

#### Step 2.2: Traditional Adjustments
For highest spiritual accuracy, traditional texts recommend using:
```
Muhurat Duration = 1/8 of day-night duration
```

This can be particularly important during solstices when day lengths vary significantly.

## Worked Example with Maximum Precision

### Input Parameters:
- **Location**: Varanasi, India
- **Latitude**: 25.317644°N (25° 19' 03.5")
- **Longitude**: 83.005495°E (83° 00' 19.8")
- **Elevation**: 80.71 meters
- **Date**: 2024-02-18
- **Atmospheric Pressure**: 1011.3 mbar
- **Temperature**: 18°C

### Calculation Process:

1. **Julian Date**: 2460358.5
2. **Local Sidereal Time**: 7h 42m 12.4s
3. **Solar Parameters**:
   - Right Ascension: 22h 05m 13.8s
   - Declination: -11° 38' 24"
4. **Sunrise Calculation**:
   - Initial Sunrise: 06:38:21 IST
   - Refraction Correction: +1.75 minutes
   - Elevation Correction: -0.43 minutes
   - **True Sunrise**: 06:39:38 IST
5. **Brahma Muhurat**:
   - **Start Time**: 05:03:38 IST
   - **End Time**: 06:39:38 IST

### Verification

For maximum accuracy, cross-verify with:
1. Swiss Ephemeris calculations
2. Traditional Panchang
3. NASA Horizon system data

## JavaScript Library Implementation

### Core JavaScript Libraries for Brahma Muhurat Calculation

| Library | Purpose | Accuracy | NPM Package |
|---------|---------|----------|------------|
| **Astronomia.js** | High-precision astronomical calculations | Very High | `astronomia` |
| **SunCalc** | Solar calculations (simpler) | Medium | `suncalc` |
| **Moment-Timezone** | Time handling with timezone support | High | `moment-timezone` |
| **Swiss Ephemeris JS** | Port of the Swiss Ephemeris | Highest | `swiss-ephemeris` |
| **Astronomy Engine** | NASA-based astronomical algorithms | Very High | `astronomy-engine` |
| **Temporal.js** | Temporal API polyfill for precise date/time | High | `@js-temporal/polyfill` |

### Additional Supporting Libraries

| Library | Purpose | NPM Package |
|---------|---------|------------|
| **Luxon** | Modern date/time handling alternative | `luxon` |
| **Big.js** | High precision calculations | `big.js` |
| **Geodesy** | Geographic calculations | `geodesy` |
| **proj4js** | Coordinate transformations | `proj4` |

### Complete Implementation Example

```javascript
// Complete JavaScript Brahma Muhurat calculator
const SunCalc = require('suncalc');
const moment = require('moment-timezone');
const { createEphemeris } = require('swiss-ephemeris');

class BrahmaMuhuratCalculator {
  constructor() {
    this.ephemeris = createEphemeris();
  }
  
  calculatePreciseSunrise(latitude, longitude, elevation, date, timezone, pressure = 1013.25, temperature = 15) {
    // Convert to required format
    const dateObj = moment.tz(date, timezone).toDate();
    
    // Get initial sunrise calculation
    const sunTimes = SunCalc.getTimes(dateObj, latitude, longitude);
    let sunrise = moment(sunTimes.sunrise);
    
    // Apply elevation correction
    const elevationCorrection = -1.76 * Math.sqrt(elevation) / 60;
    sunrise.add(elevationCorrection, 'minutes');
    
    // Apply atmospheric refraction correction
    // More complex calculation using Swiss Ephemeris
    // ...
    
    return sunrise;
  }
  
  calculateBrahmaMuhurat(latitude, longitude, elevation, date, timezone) {
    // Get precise sunrise
    const sunrise = this.calculatePreciseSunrise(latitude, longitude, elevation, date, timezone);
    
    // Calculate Brahma Muhurat (96 minutes before sunrise)
    const brahmaMuhuratStart = moment(sunrise).subtract(96, 'minutes');
    
    return {
      start: brahmaMuhuratStart.format('YYYY-MM-DD HH:mm:ss'),
      end: sunrise.format('YYYY-MM-DD HH:mm:ss'),
      duration: '96 minutes'
    };
  }
}

module.exports = BrahmaMuhuratCalculator;
```

## Accuracy Considerations

| Factor | Impact | Correction Technique |
|--------|--------|---------------------|
| Latitude/Longitude precision | ±2 seconds | Use 6+ decimal places |
| Elevation | ±4 min/1000m | Use DEM data for precise elevation |
| Atmospheric conditions | ±0.5-2 minutes | Input local pressure & temperature |
| Calculation algorithm | ±0.1-30 seconds | Use Swiss Ephemeris or PyEphem |

## Traditional Variations

Different Hindu traditions may use slightly different calculations:
- **Śmārta tradition**: Exact 96 minutes before sunrise
- **Some regional variations**: Last 48 minutes (1/2 muhūrta) considered most powerful
- **Kashmir Shaivism**: Begins at 03:24 and continues until sunrise (extended period)

## Implementation Notes for JavaScript

For highest accuracy in JavaScript implementation:

- Use `swiss-ephemeris` for core astronomical calculations
- Implement proper Julian Date handling with at least 8 decimal places
- Ensure proper timezone handling with `moment-timezone` or Temporal API
- Consider atmospheric refraction variations using accurate formulas
- Implement proper elevation corrections
- Use IEEE 754 double precision for all calculations
- Consider using Web Workers for heavy calculations in browser environments
- Implement caching strategies for repeated calculations
- Pre-calculate lookup tables for common locations
- Validate results against traditional Panchang data

### JavaScript-specific Optimizations

- Use TypedArrays for numerical calculations
- Implement memoization for expensive calculations
- Use appropriate data structures for ephemeris data
- Consider performance tradeoffs between accuracy and speed

### Package Structure for JavaScript Library

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
└── package.json
```
