/**
 * Brahma Muhurat calculation core logic
 * Combines astronomical calculations with traditional Hindu timing principles
 */

const moment = require('moment-timezone');
const AstronomicalCalculator = require('./astronomical');
const RefractionCalculator = require('./refraction');
const { validateCoordinates, validateTimezone } = require('../utils/geo');
const { formatDateTime, parseDateInput } = require('../utils/time');

class MuhuratCalculator {
  constructor(options = {}) {
    this.precision = options.precision || 'high';
    this.traditionType = options.traditionType || 'standard'; // 'standard', 'extended', 'smarta'
    this.astronomicalCalc = new AstronomicalCalculator({ precision: this.precision });
    this.refractionCalc = new RefractionCalculator({ 
      model: options.refractionModel || 'bennett',
      precision: this.precision 
    });
  }

  /**
   * Calculate Brahma Muhurat for given location and date
   * @param {Object} params - Calculation parameters
   * @returns {Object} Brahma Muhurat timing details
   */
  calculate(params) {
    const {
      latitude,
      longitude,
      elevation = 0,
      date,
      timezone,
      pressure = 1013.25,
      temperature = 15,
      humidity = 0.5
    } = params;

    // Validate all inputs
    this._validateInputs(params);

    // Calculate precise sunrise
    const sunrise = this._calculatePreciseSunrise(
      latitude, longitude, elevation, date, timezone, pressure, temperature, humidity
    );

    // Calculate Brahma Muhurat based on tradition type
    const muhuratTimes = this._calculateMuhuratTimes(sunrise, latitude, longitude, date, timezone);

    // Get additional astronomical data
    const astronomicalData = this._getAstronomicalData(latitude, longitude, date, timezone);

    // Calculate spiritual significance metrics
    const spiritualMetrics = this._calculateSpiritualMetrics(muhuratTimes, astronomicalData);

    return {
      location: {
        latitude,
        longitude,
        elevation,
        timezone
      },
      date: parseDateInput(date),
      sunrise: {
        time: sunrise,
        formatted: formatDateTime(sunrise, timezone),
        localTime: moment(sunrise).tz(timezone).format('HH:mm:ss')
      },
      brahmaMuhurat: {
        start: {
          time: muhuratTimes.start,
          formatted: formatDateTime(muhuratTimes.start, timezone),
          localTime: moment(muhuratTimes.start).tz(timezone).format('HH:mm:ss')
        },
        end: {
          time: muhuratTimes.end,
          formatted: formatDateTime(muhuratTimes.end, timezone),
          localTime: moment(muhuratTimes.end).tz(timezone).format('HH:mm:ss')
        },
        duration: {
          minutes: muhuratTimes.durationMinutes,
          formatted: this._formatDuration(muhuratTimes.durationMinutes)
        },
        traditionType: this.traditionType
      },
      astronomicalData,
      spiritualMetrics,
      calculationDetails: {
        precision: this.precision,
        refractionModel: this.refractionCalc.model,
        atmosphericConditions: { pressure, temperature, humidity },
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Calculate precise sunrise with all corrections
   */
  _calculatePreciseSunrise(latitude, longitude, elevation, date, timezone, pressure, temperature, humidity) {
    // Get base sunrise calculation
    const baseSunrise = this.astronomicalCalc.calculateSunrise(
      latitude, longitude, elevation, date, timezone, pressure, temperature
    );

    // Apply additional refraction corrections for maximum precision
    if (this.precision === 'maximum') {
      const correctedSunrise = this.refractionCalc.applySunriseCorrection(
        baseSunrise, latitude, longitude, pressure, temperature, humidity
      );
      return correctedSunrise;
    }

    return baseSunrise;
  }

  /**
   * Calculate Brahma Muhurat times based on tradition type
   */
  _calculateMuhuratTimes(sunrise, latitude, longitude, date, timezone) {
    const sunriseMoment = moment(sunrise);

    switch (this.traditionType) {
      case 'extended':
        // Extended Brahma Muhurat: 2 hours before sunrise
        return {
          start: sunriseMoment.clone().subtract(120, 'minutes').toDate(),
          end: sunrise,
          durationMinutes: 120
        };

      case 'smarta':
        // Smārta tradition: Exact 96 minutes (traditional calculation)
        return {
          start: sunriseMoment.clone().subtract(96, 'minutes').toDate(),
          end: sunrise,
          durationMinutes: 96
        };

      case 'dynamic':
        // Dynamic calculation based on day length
        const dayLength = this._calculateDayLength(latitude, longitude, date, timezone);
        const muhuratDuration = Math.round(dayLength.totalMinutes / 15); // 1/15th of day length
        return {
          start: sunriseMoment.clone().subtract(muhuratDuration, 'minutes').toDate(),
          end: sunrise,
          durationMinutes: muhuratDuration
        };

      case 'standard':
      default:
        // Standard Brahma Muhurat: 96 minutes (1 hour 36 minutes) before sunrise
        return {
          start: sunriseMoment.clone().subtract(96, 'minutes').toDate(),
          end: sunrise,
          durationMinutes: 96
        };
    }
  }

  /**
   * Get comprehensive astronomical data for the calculation
   */
  _getAstronomicalData(latitude, longitude, date, timezone) {
    const twilightTimes = this.astronomicalCalc.getTwilightTimes(latitude, longitude, date, timezone);
    const dayLength = this.astronomicalCalc.calculateDayLength(latitude, longitude, date, timezone);
    const solarPosition = this.astronomicalCalc.calculateSolarPosition(latitude, longitude, date, timezone);

    return {
      twilight: {
        astronomicalDawn: twilightTimes.astronomicalDawn,
        nauticalDawn: twilightTimes.nauticalDawn,
        civilDawn: twilightTimes.civilDawn,
        sunrise: twilightTimes.sunrise,
        sunset: twilightTimes.sunset,
        civilDusk: twilightTimes.civilDusk,
        nauticalDusk: twilightTimes.nauticalDusk,
        astronomicalDusk: twilightTimes.astronomicalDusk
      },
      dayLength: {
        dayMinutes: dayLength.dayLength,
        nightMinutes: dayLength.nightLength,
        dayFormatted: dayLength.dayLengthFormatted,
        nightFormatted: dayLength.nightLengthFormatted
      },
      solarPosition: {
        azimuth: solarPosition.azimuth,
        elevation: solarPosition.elevation,
        rightAscension: solarPosition.rightAscension,
        declination: solarPosition.declination
      }
    };
  }

  /**
   * Calculate spiritual significance metrics
   */
  _calculateSpiritualMetrics(muhuratTimes, astronomicalData) {
    const muhuratDuration = muhuratTimes.durationMinutes;
    const totalNightDuration = astronomicalData.dayLength.nightMinutes;
    
    // Calculate what portion of night is Brahma Muhurat
    const nightPortion = (muhuratDuration / totalNightDuration) * 100;
    
    // Determine moon phase influence (simplified)
    const moonPhase = this._calculateMoonPhase(muhuratTimes.start);
    
    // Calculate seasonal significance
    const seasonalFactor = this._calculateSeasonalFactor(muhuratTimes.start);
    
    return {
      nightPortion: {
        percentage: Math.round(nightPortion * 100) / 100,
        description: this._getNightPortionDescription(nightPortion)
      },
      moonPhase: {
        phase: moonPhase.phase,
        illumination: moonPhase.illumination,
        spiritualSignificance: moonPhase.spiritualSignificance
      },
      seasonalFactor: {
        factor: seasonalFactor,
        description: this._getSeasonalDescription(seasonalFactor)
      },
      optimalActivities: this._getOptimalActivities(muhuratTimes, astronomicalData)
    };
  }

  /**
   * Calculate day length for location and date
   */
  _calculateDayLength(latitude, longitude, date, timezone) {
    return this.astronomicalCalc.calculateDayLength(latitude, longitude, date, timezone);
  }

  /**
   * Calculate moon phase (simplified calculation)
   */
  _calculateMoonPhase(date) {
    const dateMoment = moment(date);
    
    // Simplified lunar cycle calculation (29.53 days average)
    const knownNewMoon = moment('2024-01-11'); // Known new moon date
    const daysSinceNewMoon = dateMoment.diff(knownNewMoon, 'days') % 29.53;
    const illumination = Math.abs(Math.cos((daysSinceNewMoon / 29.53) * 2 * Math.PI));
    
    let phase;
    let spiritualSignificance;
    
    if (daysSinceNewMoon < 1 || daysSinceNewMoon > 28) {
      phase = 'New Moon';
      spiritualSignificance = 'Highly auspicious for new beginnings and meditation';
    } else if (daysSinceNewMoon < 7) {
      phase = 'Waxing Crescent';
      spiritualSignificance = 'Good for setting intentions and spiritual growth';
    } else if (daysSinceNewMoon < 9) {
      phase = 'First Quarter';
      spiritualSignificance = 'Balanced energy, good for all spiritual practices';
    } else if (daysSinceNewMoon < 14) {
      phase = 'Waxing Gibbous';
      spiritualSignificance = 'Building energy, excellent for intensive practices';
    } else if (daysSinceNewMoon < 16) {
      phase = 'Full Moon';
      spiritualSignificance = 'Peak spiritual energy, ideal for advanced practices';
    } else if (daysSinceNewMoon < 22) {
      phase = 'Waning Gibbous';
      spiritualSignificance = 'Good for reflection and inner work';
    } else if (daysSinceNewMoon < 24) {
      phase = 'Last Quarter';
      spiritualSignificance = 'Time for release and letting go';
    } else {
      phase = 'Waning Crescent';
      spiritualSignificance = 'Preparation for renewal, deep meditation';
    }
    
    return { phase, illumination, spiritualSignificance };
  }

  /**
   * Calculate seasonal spiritual factor
   */
  _calculateSeasonalFactor(date) {
    const dayOfYear = moment(date).dayOfYear();
    
    // Winter solstice around day 355, summer solstice around day 172
    // Spring equinox around day 80, autumn equinox around day 266
    
    if (dayOfYear >= 355 || dayOfYear <= 45) {
      return 1.2; // Winter - highest spiritual potency
    } else if (dayOfYear >= 46 && dayOfYear <= 135) {
      return 1.1; // Spring - growing spiritual energy
    } else if (dayOfYear >= 136 && dayOfYear <= 225) {
      return 0.9; // Summer - moderate spiritual energy
    } else {
      return 1.0; // Autumn - balanced spiritual energy
    }
  }

  /**
   * Get night portion description
   */
  _getNightPortionDescription(percentage) {
    if (percentage > 15) {
      return 'Extended period - excellent for deep spiritual practices';
    } else if (percentage > 10) {
      return 'Optimal duration - ideal for meditation and prayer';
    } else if (percentage > 7) {
      return 'Standard period - suitable for daily spiritual routine';
    } else {
      return 'Brief period - focus on essential practices';
    }
  }

  /**
   * Get seasonal description
   */
  _getSeasonalDescription(factor) {
    if (factor > 1.15) {
      return 'Peak spiritual season - maximum benefits from practices';
    } else if (factor > 1.05) {
      return 'Favorable spiritual period - enhanced meditation effects';
    } else if (factor > 0.95) {
      return 'Balanced spiritual energy - consistent practice recommended';
    } else {
      return 'Moderate spiritual influence - maintain regular practice';
    }
  }

  /**
   * Get optimal activities for the muhurat period
   */
  _getOptimalActivities(muhuratTimes, _astronomicalData) {
    const duration = muhuratTimes.durationMinutes;
    const activities = [];
    
    // Always recommended
    activities.push('Meditation', 'Prayer and mantras', 'Scripture reading');
    
    if (duration >= 60) {
      activities.push('Yoga practice', 'Pranayama (breathing exercises)');
    }
    
    if (duration >= 90) {
      activities.push('Extended meditation', 'Spiritual study', 'Ritual worship');
    }
    
    if (duration >= 120) {
      activities.push('Intensive sadhana', 'Group spiritual practices', 'Sacred chanting');
    }
    
    return activities;
  }

  /**
   * Format duration in minutes to human readable format
   */
  _formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ${mins} minute${mins !== 1 ? 's' : ''}`;
    } else {
      return `${mins} minute${mins !== 1 ? 's' : ''}`;
    }
  }

  /**
   * Validate all input parameters
   */
  _validateInputs(params) {
    const { latitude, longitude, date, timezone } = params;
    
    validateCoordinates(latitude, longitude);
    validateTimezone(timezone);
    
    if (!moment(date).isValid()) {
      throw new Error('Invalid date format. Use YYYY-MM-DD or valid date string');
    }
  }

  /**
   * Get tradition type information
   */
  getTraditionInfo() {
    const traditions = {
      standard: {
        name: 'Standard Brahma Muhurat',
        duration: '96 minutes (1 hour 36 minutes)',
        description: 'Traditional calculation used in most Hindu calendars'
      },
      extended: {
        name: 'Extended Brahma Muhurat',
        duration: '120 minutes (2 hours)',
        description: 'Extended period for intensive spiritual practices'
      },
      smarta: {
        name: 'Smārta Tradition',
        duration: '96 minutes (exact)',
        description: 'Orthodox calculation following classical texts'
      },
      dynamic: {
        name: 'Dynamic Calculation',
        duration: 'Variable (1/15th of day length)',
        description: 'Seasonal adjustment based on day-night duration'
      }
    };
    
    return traditions[this.traditionType] || traditions.standard;
  }

  /**
   * Calculate batch results for multiple dates
   */
  calculateBatch(params, dates) {
    return dates.map(date => {
      try {
        return this.calculate({ ...params, date });
      } catch (error) {
        return {
          date,
          error: error.message
        };
      }
    });
  }
}

module.exports = MuhuratCalculator;
