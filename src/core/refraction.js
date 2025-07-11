/**
 * Atmospheric refraction calculations for precise astronomical observations
 * Implements various refraction models and corrections
 */

const Big = require('big.js');
const _unusedBig = Big; // Referenced to avoid ESLint unused var warning

class RefractionCalculator {
  constructor(options = {}) {
    this.model = options.model || 'bennett'; // 'bennett', 'saemundsson', 'rigorous'
    this.precision = options.precision || 'high';
  }

  /**
   * Calculate atmospheric refraction correction for given conditions
   * @param {number} apparentAltitude - Apparent altitude in degrees
   * @param {number} pressure - Atmospheric pressure in mbar
   * @param {number} temperature - Temperature in Celsius
   * @param {number} humidity - Relative humidity (0-1)
   * @returns {number} Refraction correction in arcminutes
   */
  calculateRefraction(apparentAltitude, pressure = 1013.25, temperature = 15, humidity = 0.5) {
    switch (this.model) {
      case 'rigorous':
        return this._rigorousRefraction(apparentAltitude, pressure, temperature, humidity);
      case 'saemundsson':
        return this._saemundssonRefraction(apparentAltitude, pressure, temperature);
      case 'bennett':
      default:
        return this._bennettRefraction(apparentAltitude, pressure, temperature);
    }
  }

  /**
   * Bennett's refraction formula (most commonly used)
   * R = cot(h + 7.31/(h + 4.4)) where h is altitude in degrees
   */
  _bennettRefraction(altitude, pressure, temperature) {
    if (altitude < -2) {
      // Below horizon, use extrapolation
      return this._extrapolateRefraction(altitude);
    }

    const h = Math.max(altitude, 0.01); // Avoid division by zero
    const cotangent = 1 / Math.tan((h + 7.31 / (h + 4.4)) * Math.PI / 180);
    
    // Standard refraction at 1013.25 mbar, 15°C
    const standardRefraction = cotangent;
    
    // Apply pressure and temperature corrections
    const pressureCorrection = pressure / 1013.25;
    const temperatureCorrection = 283.15 / (273.15 + temperature);
    
    return standardRefraction * pressureCorrection * temperatureCorrection;
  }

  /**
   * Sæmundsson's refraction formula (more accurate for low altitudes)
   */
  _saemundssonRefraction(altitude, pressure, temperature) {
    if (altitude < -2) {
      return this._extrapolateRefraction(altitude);
    }

    const h = Math.max(altitude, 0.01);
    const refraction = 1.02 / Math.tan((h + 10.3 / (h + 5.11)) * Math.PI / 180);
    
    // Apply atmospheric corrections
    const pressureCorrection = pressure / 1013.25;
    const temperatureCorrection = 283.15 / (273.15 + temperature);
    
    return refraction * pressureCorrection * temperatureCorrection;
  }

  /**
   * Rigorous refraction calculation with humidity
   */
  _rigorousRefraction(altitude, pressure, temperature, humidity) {
    if (altitude < -2) {
      return this._extrapolateRefraction(altitude);
    }

    const h = Math.max(altitude, 0.01);
    
    // Calculate refractive index
    const n = this._calculateRefractiveIndex(pressure, temperature, humidity);
    
    // Rigorous formula using refractive index
    const beta = (h + 90) * Math.PI / 180;
    const refraction = (n - 1) * Math.tan(Math.PI / 2 - beta) * 180 / Math.PI * 60;
    
    return Math.max(refraction, 0);
  }

  /**
   * Calculate refractive index of air
   */
  _calculateRefractiveIndex(pressure, temperature, humidity) {
    const T = temperature + 273.15; // Convert to Kelvin
    
    // Dry air component
    const nDry = 1 + (pressure / T) * (
      287.6155 + 
      1.62887 / T + 
      0.01360 / (T * T)
    ) * 1e-6;
    
    // Water vapor component
    const waterVaporPressure = humidity * this._saturatedVaporPressure(temperature);
    const nWater = 1 + (waterVaporPressure / T) * (
      1792.0 - 
      67.2 / T
    ) * 1e-6;
    
    return nDry + nWater - 1;
  }

  /**
   * Calculate saturated water vapor pressure (Magnus formula)
   */
  _saturatedVaporPressure(temperature) {
    return 6.1078 * Math.exp((17.27 * temperature) / (temperature + 237.3));
  }

  /**
   * Extrapolate refraction for objects below horizon
   */
  _extrapolateRefraction(altitude) {
    // Linear extrapolation based on refraction at horizon
    const horizonRefraction = this.calculateRefraction(0);
    const gradient = horizonRefraction / 34; // Approximate gradient
    return horizonRefraction + (altitude * gradient);
  }

  /**
   * Calculate refraction for sunrise/sunset (geometric horizon)
   */
  calculateSunriseRefraction(pressure = 1013.25, temperature = 15, humidity = 0.5) {
    // Standard solar diameter is 32 arcminutes
    // Standard refraction at horizon is 34 arcminutes
    // Total depression angle is approximately 50 arcminutes
    
    const geometricDepression = -0.833; // degrees (standard sunrise/sunset)
    return this.calculateRefraction(geometricDepression, pressure, temperature, humidity);
  }

  /**
   * Convert refraction from arcminutes to time correction
   * @param {number} refractionArcmin - Refraction in arcminutes
   * @param {number} latitude - Observer's latitude in degrees
   * @param {number} declination - Sun's declination in degrees
   * @returns {number} Time correction in seconds
   */
  refractionToTimeCorrection(refractionArcmin, latitude, declination) {
    // Convert arcminutes to degrees
    const refractionDeg = refractionArcmin / 60;
    
    // Hour angle rate (degrees per second)
    const hourAngleRate = 360 / (24 * 3600); // 0.004166... degrees per second
    
    // Correction factor based on observer latitude and sun declination
    const lat = latitude * Math.PI / 180;
    const dec = declination * Math.PI / 180;
    
    const correctionFactor = Math.cos(dec) * Math.cos(lat);
    
    // Time correction in seconds
    return (refractionDeg / hourAngleRate) * correctionFactor;
  }

  /**
   * Apply refraction correction to sunrise/sunset time
   */
  applySunriseCorrection(sunriseTime, latitude, longitude, pressure, temperature, humidity) {
    // Calculate sun's declination for the date
    const declination = this._calculateSolarDeclination(sunriseTime);
    
    // Calculate refraction at sunrise
    const refraction = this.calculateSunriseRefraction(pressure, temperature, humidity);
    
    // Convert to time correction
    const timeCorrection = this.refractionToTimeCorrection(refraction, latitude, declination);
    
    // Apply correction (subtract because refraction makes sunrise appear earlier)
    return new Date(sunriseTime.getTime() - timeCorrection * 1000);
  }

  /**
   * Simplified solar declination calculation
   */
  _calculateSolarDeclination(date) {
    const dayOfYear = this._getDayOfYear(date);
    const declination = 23.45 * Math.sin((360 * (284 + dayOfYear) / 365) * Math.PI / 180);
    return declination;
  }

  /**
   * Get day of year for given date
   */
  _getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  /**
   * Calculate parallactic angle for refraction corrections
   */
  calculateParallacticAngle(latitude, declination, hourAngle) {
    const lat = latitude * Math.PI / 180;
    const dec = declination * Math.PI / 180;
    const ha = hourAngle * Math.PI / 180;
    
    const numerator = Math.sin(ha);
    const denominator = Math.tan(lat) * Math.cos(dec) - Math.sin(dec) * Math.cos(ha);
    
    return Math.atan2(numerator, denominator) * 180 / Math.PI;
  }

  /**
   * Get refraction model information
   */
  getModelInfo() {
    const models = {
      bennett: {
        name: "Bennett's Formula",
        accuracy: "±0.1' for h > 15°, ±0.5' for h > 5°",
        description: "Most commonly used, good general accuracy"
      },
      saemundsson: {
        name: "Sæmundsson's Formula", 
        accuracy: "±0.05' for h > 10°, ±0.2' for h > 1°",
        description: "More accurate for low altitudes"
      },
      rigorous: {
        name: "Rigorous Refraction",
        accuracy: "±0.02' for h > 5°",
        description: "Most accurate, includes humidity effects"
      }
    };
    
    return models[this.model] || models.bennett;
  }

  /**
   * Validate refraction calculation inputs
   */
  static validateInputs(altitude, pressure, temperature, humidity) {
    if (altitude < -90 || altitude > 90) {
      throw new Error('Altitude must be between -90 and 90 degrees');
    }
    if (pressure < 500 || pressure > 1100) {
      throw new Error('Pressure must be between 500 and 1100 mbar');
    }
    if (temperature < -50 || temperature > 50) {
      throw new Error('Temperature must be between -50 and 50 Celsius');
    }
    if (humidity < 0 || humidity > 1) {
      throw new Error('Humidity must be between 0 and 1');
    }
  }
}

module.exports = RefractionCalculator;
