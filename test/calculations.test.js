/**
 * Comprehensive test suite for Brahma Muhurat Calculator
 */

const { expect } = require('chai');
const moment = require('moment-timezone');
const BrahmaMuhuratCalculator = require('../src/index');

describe('Brahma Muhurat Calculator', function() {
  let calculator;

  beforeEach(function() {
    calculator = new BrahmaMuhuratCalculator({
      precision: 'high',
      traditionType: 'standard'
    });
  });

  describe('Initialization', function() {
    it('should initialize with default settings', function() {
      const calc = new BrahmaMuhuratCalculator();
      expect(calc.precision).to.equal('high');
      expect(calc.traditionType).to.equal('standard');
      expect(calc.refractionModel).to.equal('bennett');
    });

    it('should initialize with custom settings', function() {
      const calc = new BrahmaMuhuratCalculator({
        precision: 'maximum',
        traditionType: 'extended',
        refractionModel: 'rigorous'
      });
      expect(calc.precision).to.equal('maximum');
      expect(calc.traditionType).to.equal('extended');
      expect(calc.refractionModel).to.equal('rigorous');
    });
  });

  describe('Basic Calculations', function() {
    const testParams = {
      latitude: 25.317644,
      longitude: 83.005495,
      elevation: 80.71,
      date: '2024-02-18',
      timezone: 'Asia/Kolkata'
    };

    it('should calculate Brahma Muhurat for Varanasi', function() {
      const result = calculator.calculate(testParams);
      
      expect(result).to.have.property('brahmaMuhurat');
      expect(result.brahmaMuhurat).to.have.property('start');
      expect(result.brahmaMuhurat).to.have.property('end');
      expect(result.brahmaMuhurat).to.have.property('duration');
      
      // Verify duration is 96 minutes for standard tradition
      expect(result.brahmaMuhurat.duration.minutes).to.equal(96);
      
      // Verify start time is 96 minutes before end time
      const startTime = moment(result.brahmaMuhurat.start.time);
      const endTime = moment(result.brahmaMuhurat.end.time);
      const duration = endTime.diff(startTime, 'minutes');
      expect(duration).to.equal(96);
    });

    it('should calculate sunrise correctly', function() {
      const result = calculator.calculateSunrise(testParams);
      
      expect(result).to.have.property('sunrise');
      expect(result.sunrise).to.have.property('time');
      expect(result.sunrise).to.have.property('formatted');
      expect(result.sunrise).to.have.property('localTime');
      
      // Sunrise should be a valid date
      expect(result.sunrise.time).to.be.an.instanceof(Date);
    });

    it('should provide astronomical data', function() {
      const result = calculator.getAstronomicalData(testParams);
      
      expect(result).to.have.property('twilight');
      expect(result).to.have.property('dayLength');
      expect(result).to.have.property('solarPosition');
      
      expect(result.twilight).to.have.property('sunrise');
      expect(result.twilight).to.have.property('sunset');
      expect(result.dayLength).to.have.property('dayLength');
      expect(result.dayLength).to.have.property('nightLength');
    });
  });

  describe('Tradition Types', function() {
    const testParams = {
      latitude: 25.317644,
      longitude: 83.005495,
      date: '2024-02-18',
      timezone: 'Asia/Kolkata'
    };

    it('should calculate standard tradition (96 minutes)', function() {
      const calc = new BrahmaMuhuratCalculator({ traditionType: 'standard' });
      const result = calc.calculate(testParams);
      expect(result.brahmaMuhurat.duration.minutes).to.equal(96);
    });

    it('should calculate extended tradition (120 minutes)', function() {
      const calc = new BrahmaMuhuratCalculator({ traditionType: 'extended' });
      const result = calc.calculate(testParams);
      expect(result.brahmaMuhurat.duration.minutes).to.equal(120);
    });

    it('should calculate smarta tradition (96 minutes)', function() {
      const calc = new BrahmaMuhuratCalculator({ traditionType: 'smarta' });
      const result = calc.calculate(testParams);
      expect(result.brahmaMuhurat.duration.minutes).to.equal(96);
    });
  });

  describe('Precision Levels', function() {
    const testParams = {
      latitude: 25.317644,
      longitude: 83.005495,
      date: '2024-02-18',
      timezone: 'Asia/Kolkata'
    };

    it('should work with basic precision', function() {
      const calc = new BrahmaMuhuratCalculator({ precision: 'basic' });
      const result = calc.calculate(testParams);
      expect(result.calculationDetails.precision).to.equal('basic');
      expect(result).to.have.property('brahmaMuhurat');
    });

    it('should work with high precision', function() {
      const calc = new BrahmaMuhuratCalculator({ precision: 'high' });
      const result = calc.calculate(testParams);
      expect(result.calculationDetails.precision).to.equal('high');
      expect(result).to.have.property('brahmaMuhurat');
    });

    it('should work with maximum precision', function() {
      const calc = new BrahmaMuhuratCalculator({ precision: 'maximum' });
      const result = calc.calculate(testParams);
      expect(result.calculationDetails.precision).to.equal('maximum');
      expect(result).to.have.property('brahmaMuhurat');
    });
  });

  describe('Input Validation', function() {
    it('should reject invalid latitude', function() {
      expect(() => {
        calculator.calculate({
          latitude: 95, // Invalid: > 90
          longitude: 83.005495,
          date: '2024-02-18',
          timezone: 'Asia/Kolkata'
        });
      }).to.throw('Latitude must be between -90 and 90 degrees');
    });

    it('should reject invalid longitude', function() {
      expect(() => {
        calculator.calculate({
          latitude: 25.317644,
          longitude: 185, // Invalid: > 180
          date: '2024-02-18',
          timezone: 'Asia/Kolkata'
        });
      }).to.throw('Longitude must be between -180 and 180 degrees');
    });

    it('should reject invalid timezone', function() {
      expect(() => {
        calculator.calculate({
          latitude: 25.317644,
          longitude: 83.005495,
          date: '2024-02-18',
          timezone: 'Invalid/Timezone'
        });
      }).to.throw();
    });

    it('should reject invalid date', function() {
      expect(() => {
        calculator.calculate({
          latitude: 25.317644,
          longitude: 83.005495,
          date: 'invalid-date',
          timezone: 'Asia/Kolkata'
        });
      }).to.throw();
    });
  });

  describe('Batch Calculations', function() {
    const baseParams = {
      latitude: 25.317644,
      longitude: 83.005495,
      timezone: 'Asia/Kolkata'
    };

    const dates = ['2024-02-18', '2024-02-19', '2024-02-20'];

    it('should calculate multiple dates', function() {
      const results = calculator.calculateBatch(baseParams, dates);
      
      expect(results).to.be.an('array');
      expect(results).to.have.length(3);
      
      results.forEach((result, _index) => {
        expect(result).to.have.property('brahmaMuhurat');
        expect(result.date).to.be.an.instanceof(Date);
      });
    });

    it('should handle errors in batch processing', function() {
      const invalidDates = ['2024-02-18', 'invalid-date', '2024-02-20'];
      const results = calculator.calculateBatch(baseParams, invalidDates);
      
      expect(results).to.have.length(3);
      expect(results[0]).to.have.property('brahmaMuhurat');
      expect(results[1]).to.have.property('error');
      expect(results[2]).to.have.property('brahmaMuhurat');
    });
  });

  describe('Multiple Locations', function() {
    const locations = [
      {
        name: 'Varanasi, India',
        latitude: 25.317644,
        longitude: 83.005495,
        timezone: 'Asia/Kolkata'
      },
      {
        name: 'New York, USA',
        latitude: 40.7128,
        longitude: -74.0060,
        timezone: 'America/New_York'
      },
      {
        name: 'London, UK',
        latitude: 51.5074,
        longitude: -0.1278,
        timezone: 'Europe/London'
      },
      {
        name: 'Sydney, Australia',
        latitude: -33.8688,
        longitude: 151.2093,
        timezone: 'Australia/Sydney'
      }
    ];

    it('should calculate for multiple international locations', function() {
      const date = '2024-02-18';
      
      locations.forEach(location => {
        const params = {
          latitude: location.latitude,
          longitude: location.longitude,
          date: date,
          timezone: location.timezone
        };
        
        const result = calculator.calculate(params);
        
        expect(result).to.have.property('brahmaMuhurat');
        expect(result.location.latitude).to.equal(location.latitude);
        expect(result.location.longitude).to.equal(location.longitude);
        expect(result.location.timezone).to.equal(location.timezone);
      });
    });
  });

  describe('Seasonal Variations', function() {
    const location = {
      latitude: 25.317644,
      longitude: 83.005495,
      timezone: 'Asia/Kolkata'
    };

    const seasonalDates = [
      '2024-03-20', // Spring Equinox
      '2024-06-21', // Summer Solstice
      '2024-09-22', // Autumn Equinox
      '2024-12-21'  // Winter Solstice
    ];

    it('should calculate for different seasons', function() {
      seasonalDates.forEach(date => {
        const params = { ...location, date };
        const result = calculator.calculate(params);
        
        expect(result).to.have.property('brahmaMuhurat');
        expect(result).to.have.property('astronomicalData');
        expect(result).to.have.property('spiritualMetrics');
        
        // All calculations should be valid
        expect(result.brahmaMuhurat.start.time).to.be.an.instanceof(Date);
        expect(result.brahmaMuhurat.end.time).to.be.an.instanceof(Date);
      });
    });
  });

  describe('Edge Cases', function() {
    it('should handle polar regions gracefully', function() {
      // Arctic location
      const arcticParams = {
        latitude: 70.0,
        longitude: 25.0,
        date: '2024-06-21', // Summer solstice
        timezone: 'Europe/Oslo'
      };
      
      // Should not throw an error, but may have special handling
      expect(() => {
        calculator.calculate(arcticParams);
      }).to.not.throw();
    });

    it('should handle equatorial locations', function() {
      const equatorialParams = {
        latitude: 0.0,
        longitude: 0.0,
        date: '2024-02-18',
        timezone: 'UTC'
      };
      
      const result = calculator.calculate(equatorialParams);
      expect(result).to.have.property('brahmaMuhurat');
    });

    it('should handle high elevation locations', function() {
      const highElevationParams = {
        latitude: 27.9881, // Mount Everest base camp
        longitude: 86.9250,
        elevation: 5364,
        date: '2024-02-18',
        timezone: 'Asia/Kathmandu'
      };
      
      const result = calculator.calculate(highElevationParams);
      expect(result).to.have.property('brahmaMuhurat');
      expect(result.location.elevation).to.equal(5364);
    });
  });

  describe('Atmospheric Conditions', function() {
    const testParams = {
      latitude: 25.317644,
      longitude: 83.005495,
      date: '2024-02-18',
      timezone: 'Asia/Kolkata'
    };

    it('should handle different atmospheric pressures', function() {
      const lowPressureResult = calculator.calculate({
        ...testParams,
        pressure: 950 // Low pressure
      });
      
      const highPressureResult = calculator.calculate({
        ...testParams,
        pressure: 1050 // High pressure
      });
      
      expect(lowPressureResult).to.have.property('brahmaMuhurat');
      expect(highPressureResult).to.have.property('brahmaMuhurat');
      
      // Results should be different due to atmospheric effects
      expect(lowPressureResult.calculationDetails.atmosphericConditions.pressure).to.equal(950);
      expect(highPressureResult.calculationDetails.atmosphericConditions.pressure).to.equal(1050);
    });

    it('should handle different temperatures', function() {
      const coldResult = calculator.calculate({
        ...testParams,
        temperature: -10
      });
      
      const hotResult = calculator.calculate({
        ...testParams,
        temperature: 40
      });
      
      expect(coldResult).to.have.property('brahmaMuhurat');
      expect(hotResult).to.have.property('brahmaMuhurat');
    });
  });

  describe('Refraction Calculations', function() {
    it('should calculate atmospheric refraction', function() {
      const refractionResult = calculator.calculateRefraction({
        altitude: 0, // Horizon
        pressure: 1013.25,
        temperature: 15,
        humidity: 0.5
      });
      
      expect(refractionResult).to.have.property('refraction');
      expect(refractionResult.refraction).to.have.property('arcminutes');
      expect(refractionResult.refraction).to.have.property('degrees');
      expect(refractionResult).to.have.property('model');
    });
  });

  describe('Performance', function() {
    const testParams = {
      latitude: 25.317644,
      longitude: 83.005495,
      date: '2024-02-18',
      timezone: 'Asia/Kolkata'
    };

    it('should complete basic calculation within 100ms', function() {
      const calc = new BrahmaMuhuratCalculator({ precision: 'basic' });
      
      const startTime = Date.now();
      calc.calculate(testParams);
      const endTime = Date.now();
      
      const duration = endTime - startTime;
      expect(duration).to.be.below(100);
    });

    it('should complete high precision calculation within 500ms', function() {
      const calc = new BrahmaMuhuratCalculator({ precision: 'high' });
      
      const startTime = Date.now();
      calc.calculate(testParams);
      const endTime = Date.now();
      
      const duration = endTime - startTime;
      expect(duration).to.be.below(500);
    });
  });

  describe('Static Methods', function() {
    it('should provide supported timezones', function() {
      const timezones = BrahmaMuhuratCalculator.getSupportedTimezones();
      expect(timezones).to.be.an('array');
      expect(timezones).to.include('Asia/Kolkata');
      expect(timezones).to.include('America/New_York');
    });

    it('should format coordinates', function() {
      const decimal = BrahmaMuhuratCalculator.formatCoordinates(25.317644, 83.005495, 'decimal');
      const dms = BrahmaMuhuratCalculator.formatCoordinates(25.317644, 83.005495, 'dms');
      
      expect(decimal).to.be.a('string');
      expect(dms).to.be.a('string');
      expect(dms).to.include('°');
      expect(dms).to.include("'");
    });

    it('should validate coordinates', function() {
      expect(() => {
        BrahmaMuhuratCalculator.validateCoordinates(25.317644, 83.005495);
      }).to.not.throw();
      
      expect(() => {
        BrahmaMuhuratCalculator.validateCoordinates(95, 83.005495);
      }).to.throw();
    });

    it('should provide library information', function() {
      const info = BrahmaMuhuratCalculator.getLibraryInfo();
      expect(info).to.have.property('name');
      expect(info).to.have.property('version');
      expect(info).to.have.property('supportedPrecisionLevels');
      expect(info).to.have.property('supportedTraditions');
    });
  });

  describe('Cross-validation', function() {
    // Test against known Panchang values for validation
    const knownValues = [
      {
        location: 'Varanasi',
        date: '2024-02-18',
        expectedSunriseApprox: '06:40', // Approximate time from traditional Panchang
        latitude: 25.317644,
        longitude: 83.005495,
        timezone: 'Asia/Kolkata'
      }
    ];

    it('should match traditional Panchang calculations within tolerance', function() {
      knownValues.forEach(testCase => {
        const result = calculator.calculate({
          latitude: testCase.latitude,
          longitude: testCase.longitude,
          date: testCase.date,
          timezone: testCase.timezone
        });
        
        const calculatedSunrise = moment(result.sunrise.time).tz(testCase.timezone);
        const expectedTime = moment.tz(`${testCase.date} ${testCase.expectedSunriseApprox}`, 'YYYY-MM-DD HH:mm', testCase.timezone);
        
        // Allow 10 minutes tolerance for traditional Panchang comparison
        const diff = Math.abs(calculatedSunrise.diff(expectedTime, 'minutes'));
        expect(diff).to.be.below(10, `Sunrise calculation for ${testCase.location} should be within 10 minutes of traditional Panchang`);
      });
    });
  });
});
