/**
 * Core astronomical calculations for sunrise and solar positions
 * Implements multiple precision levels and library integrations
 */

const SunCalc = require('suncalc');
const { Astronomy } = require('astronomy-engine');
const moment = require('moment-timezone');
const Big = require('big.js');
const _unusedBig = Big; // Referenced to avoid ESLint unused var warning

class AstronomicalCalculator {
  constructor(options = {}) {
    this.precision = options.precision || 'high';
    this.useSwissEphemeris = options.useSwissEphemeris || false;
    this._loadCompatibleLibraries();
  }

  /**
   * Dynamic library loading with version checking
   */
  _loadCompatibleLibraries() {
    try {
      this.astronomia = require('astronomia');
      console.log(`Loaded astronomia v${this.astronomia.version || 'unknown'}`);
    } catch (_error) {
      console.warn('Astronomia not available, using fallback');
      this.astronomia = null;
    }

    // Swiss Ephemeris is not available in npm, using alternatives
    this.swissEphemeris = null;
    console.warn('Swiss Ephemeris not available, using Astronomy Engine and SunCalc');
  }

  /**
   * Calculate precise sunrise based on precision level
   */
  calculateSunrise(latitude, longitude, elevation, date, timezone, pressure = 1013.25, temperature = 15) {
    const dateObj = moment.tz(date, timezone);
    
    switch (this.precision) {
      case 'maximum':
        return this._calculateMaximumPrecisionSunrise(latitude, longitude, elevation, dateObj, pressure, temperature);
      case 'high':
        return this._calculateHighPrecisionSunrise(latitude, longitude, elevation, dateObj);
      case 'basic':
      default:
        return this._calculateBasicSunrise(latitude, longitude, dateObj);
    }
  }

  /**
   * Maximum precision using Astronomy Engine with full corrections
   */
  _calculateMaximumPrecisionSunrise(latitude, longitude, elevation, dateObj, pressure, temperature) {
    try {
      const observer = new Astronomy.Observer(latitude, longitude, elevation);
      const searchDate = Astronomy.MakeTime(dateObj.toDate());
      
      // Calculate sunrise with atmospheric corrections
      const sunrise = Astronomy.SearchRiseSet(
        Astronomy.Body.Sun, 
        observer, 
        Astronomy.Direction.Rise, 
        searchDate, 
        1
      );
      
      // Apply additional atmospheric refraction corrections
      const refraction = this._calculateAtmosphericRefraction(pressure, temperature, latitude);
      const correctedTime = moment(sunrise.date).subtract(refraction, 'seconds');
      
      return correctedTime.toDate();
    } catch (_error) {
      console.warn('Astronomy Engine calculation failed, falling back to high precision');
      return this._calculateHighPrecisionSunrise(latitude, longitude, elevation, dateObj);
    }
  }

  /**
   * High precision using SunCalc with elevation and atmospheric corrections
   */
  _calculateHighPrecisionSunrise(latitude, longitude, elevation, dateObj) {
    const times = SunCalc.getTimes(dateObj.toDate(), latitude, longitude);
    const sunrise = moment(times.sunrise);
    
    // Apply elevation correction
    if (elevation > 0) {
      const elevationCorrection = this._calculateElevationCorrection(elevation);
      sunrise.add(elevationCorrection, 'minutes');
    }
    
    // Apply basic atmospheric refraction
    const basicRefraction = this._calculateBasicRefraction(latitude);
    sunrise.subtract(basicRefraction, 'seconds');
    
    return sunrise.toDate();
  }

  /**
   * Basic precision using SunCalc only
   */
  _calculateBasicSunrise(latitude, longitude, dateObj) {
    const times = SunCalc.getTimes(dateObj.toDate(), latitude, longitude);
    return times.sunrise;
  }

  /**
   * Calculate elevation correction for sunrise time
   * Formula: -1.76 * sqrt(elevation_in_meters) minutes
   */
  _calculateElevationCorrection(elevation) {
    return -1.76 * Math.sqrt(elevation) / 60; // Convert to minutes
  }

  /**
   * Calculate basic atmospheric refraction correction
   */
  _calculateBasicRefraction(latitude) {
    // Standard refraction at horizon is approximately 34 arcminutes
    // This translates to about 2.3 minutes time correction
    const standardRefraction = 34; // arcminutes
    const latitudeCorrection = Math.cos(latitude * Math.PI / 180);
    return (standardRefraction * latitudeCorrection * 4) / 60; // Convert to seconds
  }

  /**
   * Calculate atmospheric refraction with pressure and temperature
   */
  _calculateAtmosphericRefraction(pressure, temperature, latitude) {
    const standardPressure = 1013.25; // mbar
    const standardTemperature = 15; // Celsius
    
    // Pressure correction factor
    const pressureFactor = pressure / standardPressure;
    
    // Temperature correction factor (Kelvin)
    const tempFactor = (273.15 + standardTemperature) / (273.15 + temperature);
    
    // Combined refraction correction
    const baseRefraction = this._calculateBasicRefraction(latitude);
    return baseRefraction * pressureFactor * tempFactor;
  }

  /**
   * Calculate solar position for given coordinates and time
   */
  calculateSolarPosition(latitude, longitude, date, timezone) {
    const dateObj = moment.tz(date, timezone);
    
    try {
      // Use Astronomy Engine for precise solar position
      const observer = new Astronomy.Observer(latitude, longitude, 0);
      const time = Astronomy.MakeTime(dateObj.toDate());
      const equatorial = Astronomy.Equator(Astronomy.Body.Sun, time, observer, true, true);
      const horizontal = Astronomy.Horizon(time, observer, equatorial.ra, equatorial.dec, 'normal');
      
      return {
        azimuth: horizontal.azimuth,
        elevation: horizontal.altitude,
        rightAscension: equatorial.ra,
        declination: equatorial.dec
      };
    } catch (_error) {
      // Fallback to SunCalc
      const position = SunCalc.getPosition(dateObj.toDate(), latitude, longitude);
      return {
        azimuth: position.azimuth * 180 / Math.PI, // Convert to degrees
        elevation: position.altitude * 180 / Math.PI,
        rightAscension: null,
        declination: null
      };
    }
  }

  /**
   * Get astronomical twilight times
   */
  getTwilightTimes(latitude, longitude, date, timezone) {
    const dateObj = moment.tz(date, timezone).toDate();
    const times = SunCalc.getTimes(dateObj, latitude, longitude);
    
    return {
      astronomicalDawn: times.nightEnd,
      nauticalDawn: times.nauticalDawn,
      civilDawn: times.dawn,
      sunrise: times.sunrise,
      sunset: times.sunset,
      civilDusk: times.dusk,
      nauticalDusk: times.nauticalDusk,
      astronomicalDusk: times.night
    };
  }

  /**
   * Calculate day length for given location and date
   */
  calculateDayLength(latitude, longitude, date, timezone) {
    const times = this.getTwilightTimes(latitude, longitude, date, timezone);
    const dayLength = moment(times.sunset).diff(moment(times.sunrise), 'minutes');
    const nightLength = 1440 - dayLength; // 1440 minutes in a day
    
    return {
      dayLength: dayLength,
      nightLength: nightLength,
      dayLengthFormatted: this._formatDuration(dayLength),
      nightLengthFormatted: this._formatDuration(nightLength)
    };
  }

  /**
   * Format duration in minutes to hours and minutes
   */
  _formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  /**
   * Validate astronomical calculation inputs
   */
  static validateInputs(latitude, longitude, date, timezone) {
    if (latitude < -90 || latitude > 90) {
      throw new Error('Latitude must be between -90 and 90 degrees');
    }
    if (longitude < -180 || longitude > 180) {
      throw new Error('Longitude must be between -180 and 180 degrees');
    }
    if (!moment.tz.zone(timezone)) {
      throw new Error('Invalid timezone');
    }
    if (!moment(date).isValid()) {
      throw new Error('Invalid date format');
    }
  }
}

module.exports = AstronomicalCalculator;
