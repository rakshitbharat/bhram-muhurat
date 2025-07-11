/**
 * Main entry point for the Brahma Muhurat Calculator Library
 * Provides a unified interface to all calculation modules
 */

const MuhuratCalculator = require('./core/muhurat');
const AstronomicalCalculator = require('./core/astronomical');
const RefractionCalculator = require('./core/refraction');
const { formatDateTime, parseDateInput, getSupportedTimezones } = require('./utils/time');
const { validateCoordinates, formatCoordinates } = require('./utils/geo');

/**
 * Main Brahma Muhurat Calculator class
 * Provides high-level interface for all calculations
 */
class BrahmaMuhuratCalculator {
  constructor(options = {}) {
    this.precision = options.precision || 'high'; // 'basic', 'high', 'maximum'
    this.traditionType = options.traditionType || 'standard';
    this.refractionModel = options.refractionModel || 'bennett';
    
    // Initialize core calculator
    this.muhuratCalc = new MuhuratCalculator({
      precision: this.precision,
      traditionType: this.traditionType,
      refractionModel: this.refractionModel
    });
    
    // Initialize utility calculators
    this.astronomicalCalc = new AstronomicalCalculator({ precision: this.precision });
    this.refractionCalc = new RefractionCalculator({ 
      model: this.refractionModel,
      precision: this.precision 
    });
    
    this._logInitialization();
  }

  /**
   * Calculate Brahma Muhurat for given parameters
   * @param {Object} params - Calculation parameters
   * @returns {Object} Complete Brahma Muhurat calculation results
   */
  calculate(params) {
    try {
      // Validate required parameters
      this._validateCalculationParams(params);
      
      // Perform the calculation
      const result = this.muhuratCalc.calculate(params);
      
      // Add library metadata
      result.library = this._getLibraryInfo();
      
      return result;
    } catch (error) {
      throw new Error(`Brahma Muhurat calculation failed: ${error.message}`);
    }
  }

  /**
   * Calculate for multiple dates (batch processing)
   * @param {Object} baseParams - Base parameters (location, timezone, etc.)
   * @param {Array<string>} dates - Array of dates to calculate
   * @returns {Array<Object>} Array of calculation results
   */
  calculateBatch(baseParams, dates) {
    if (!Array.isArray(dates)) {
      throw new Error('Dates must be an array');
    }
    
    return this.muhuratCalc.calculateBatch(baseParams, dates);
  }

  /**
   * Calculate sunrise only (without Brahma Muhurat)
   * @param {Object} params - Calculation parameters
   * @returns {Object} Sunrise calculation result
   */
  calculateSunrise(params) {
    const { latitude, longitude, elevation = 0, date, timezone, pressure = 1013.25, temperature = 15 } = params;
    
    this._validateCalculationParams(params);
    
    const sunrise = this.astronomicalCalc.calculateSunrise(
      latitude, longitude, elevation, date, timezone, pressure, temperature
    );
    
    return {
      sunrise: {
        time: sunrise,
        formatted: formatDateTime(sunrise, timezone),
        localTime: formatDateTime(sunrise, timezone, 'HH:mm:ss')
      },
      location: { latitude, longitude, elevation, timezone },
      date: parseDateInput(date),
      precision: this.precision,
      calculatedAt: new Date().toISOString()
    };
  }

  /**
   * Get astronomical data for a location and date
   * @param {Object} params - Parameters for astronomical calculation
   * @returns {Object} Comprehensive astronomical data
   */
  getAstronomicalData(params) {
    const { latitude, longitude, date, timezone } = params;
    
    this._validateCalculationParams(params);
    
    const twilightTimes = this.astronomicalCalc.getTwilightTimes(latitude, longitude, date, timezone);
    const dayLength = this.astronomicalCalc.calculateDayLength(latitude, longitude, date, timezone);
    const solarPosition = this.astronomicalCalc.calculateSolarPosition(latitude, longitude, date, timezone);
    
    return {
      location: { latitude, longitude, timezone },
      date: parseDateInput(date),
      twilight: twilightTimes,
      dayLength: dayLength,
      solarPosition: solarPosition,
      calculatedAt: new Date().toISOString()
    };
  }

  /**
   * Calculate atmospheric refraction
   * @param {Object} params - Refraction calculation parameters
   * @returns {Object} Refraction calculation result
   */
  calculateRefraction(params) {
    const { 
      altitude, 
      pressure = 1013.25, 
      temperature = 15, 
      humidity = 0.5 
    } = params;
    
    if (typeof altitude !== 'number') {
      throw new Error('Altitude is required and must be a number');
    }
    
    const refraction = this.refractionCalc.calculateRefraction(altitude, pressure, temperature, humidity);
    const modelInfo = this.refractionCalc.getModelInfo();
    
    return {
      altitude: altitude,
      refraction: {
        arcminutes: refraction,
        arcseconds: refraction * 60,
        degrees: refraction / 60
      },
      atmosphericConditions: { pressure, temperature, humidity },
      model: modelInfo,
      calculatedAt: new Date().toISOString()
    };
  }

  /**
   * Get supported timezones
   * @returns {Array<string>} Array of supported timezone names
   */
  static getSupportedTimezones() {
    return getSupportedTimezones();
  }

  /**
   * Format coordinates in various formats
   * @param {number} latitude - Latitude in decimal degrees
   * @param {number} longitude - Longitude in decimal degrees
   * @param {string} format - Format type ('decimal', 'dms', 'dm')
   * @returns {string} Formatted coordinates
   */
  static formatCoordinates(latitude, longitude, format = 'decimal') {
    return formatCoordinates(latitude, longitude, format);
  }

  /**
   * Validate coordinates
   * @param {number} latitude - Latitude in degrees
   * @param {number} longitude - Longitude in degrees
   * @throws {Error} If coordinates are invalid
   */
  static validateCoordinates(latitude, longitude) {
    validateCoordinates(latitude, longitude);
  }

  /**
   * Get library version and information
   * @returns {Object} Library information
   */
  static getLibraryInfo() {
    return {
      name: 'Brahma Muhurat Calculator',
      version: '1.0.0',
      description: 'High-precision Brahma Muhurat calculator for JavaScript',
      author: 'Hindu Calendar Library',
      license: 'MIT',
      website: 'https://github.com/rakshitbharat/bhram-muhurat',
      supportedPrecisionLevels: ['basic', 'high', 'maximum'],
      supportedTraditions: ['standard', 'extended', 'smarta', 'dynamic'],
      supportedRefractionModels: ['bennett', 'saemundsson', 'rigorous']
    };
  }

  /**
   * Get tradition information
   * @returns {Object} Current tradition information
   */
  getTraditionInfo() {
    return this.muhuratCalc.getTraditionInfo();
  }

  /**
   * Get precision information
   * @returns {Object} Current precision information
   */
  getPrecisionInfo() {
    const precisionLevels = {
      basic: {
        name: 'Basic Precision',
        accuracy: '±2-5 minutes',
        description: 'Uses SunCalc library for basic solar calculations',
        recommendedFor: 'General use, mobile applications'
      },
      high: {
        name: 'High Precision',
        accuracy: '±30 seconds to 2 minutes',
        description: 'SunCalc with elevation and basic atmospheric corrections',
        recommendedFor: 'Most applications, daily spiritual practice'
      },
      maximum: {
        name: 'Maximum Precision',
        accuracy: '±10-30 seconds',
        description: 'Astronomy Engine with full atmospheric corrections',
        recommendedFor: 'Scientific calculations, observatory use'
      }
    };
    
    return precisionLevels[this.precision] || precisionLevels.high;
  }

  /**
   * Get refraction model information
   * @returns {Object} Current refraction model information
   */
  getRefractionInfo() {
    return this.refractionCalc.getModelInfo();
  }

  /**
   * Log initialization information
   * @private
   */
  _logInitialization() {
    console.log(`🕉️  Brahma Muhurat Calculator initialized`);
    console.log(`   Precision: ${this.precision}`);
    console.log(`   Tradition: ${this.traditionType}`);
    console.log(`   Refraction Model: ${this.refractionModel}`);
  }

  /**
   * Get library information instance method
   * @returns {Object} Library information
   * @private
   */
  _getLibraryInfo() {
    return {
      ...BrahmaMuhuratCalculator.getLibraryInfo(),
      currentSettings: {
        precision: this.precision,
        traditionType: this.traditionType,
        refractionModel: this.refractionModel
      }
    };
  }

  /**
   * Validate calculation parameters
   * @param {Object} params - Parameters to validate
   * @throws {Error} If parameters are invalid
   * @private
   */
  _validateCalculationParams(params) {
    const { latitude, longitude, date, timezone } = params;
    
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      throw new Error('Latitude and longitude are required and must be numbers');
    }
    
    if (!date) {
      throw new Error('Date is required');
    }
    
    if (!timezone || typeof timezone !== 'string') {
      throw new Error('Timezone is required and must be a string');
    }
    
    // Use utility functions for detailed validation
    validateCoordinates(latitude, longitude);
    
    try {
      parseDateInput(date);
    } catch (error) {
      throw new Error(`Invalid date: ${error.message}`);
    }
    
    if (!getSupportedTimezones().includes(timezone)) {
      throw new Error(`Unsupported timezone: ${timezone}`);
    }
  }
}

// Export both the class and utility functions
module.exports = BrahmaMuhuratCalculator;

// Additional exports for direct access to utility functions
module.exports.utils = {
  time: require('./utils/time'),
  geo: require('./utils/geo')
};

module.exports.core = {
  MuhuratCalculator,
  AstronomicalCalculator,
  RefractionCalculator
};
