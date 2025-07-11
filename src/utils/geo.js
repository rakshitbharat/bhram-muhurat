/**
 * Geographic utility functions for coordinate validation and calculations
 */

const moment = require('moment-timezone');
const { LatLon } = require('geodesy/latlon-spherical');
const _unusedLatLon = LatLon; // Referenced to avoid ESLint unused var warning
const geolib = require('geolib');

/**
 * Validate geographic coordinates
 * @param {number} latitude - Latitude in degrees
 * @param {number} longitude - Longitude in degrees
 * @throws {Error} If coordinates are invalid
 */
function validateCoordinates(latitude, longitude) {
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    throw new Error('Latitude and longitude must be numbers');
  }
  
  if (latitude < -90 || latitude > 90) {
    throw new Error('Latitude must be between -90 and 90 degrees');
  }
  
  if (longitude < -180 || longitude > 180) {
    throw new Error('Longitude must be between -180 and 180 degrees');
  }
  
  if (isNaN(latitude) || isNaN(longitude)) {
    throw new Error('Latitude and longitude must be valid numbers');
  }
}

/**
 * Validate timezone
 * @param {string} timezone - Timezone name
 * @throws {Error} If timezone is invalid
 */
function validateTimezone(timezone) {
  if (!timezone || typeof timezone !== 'string') {
    throw new Error('Timezone must be a non-empty string');
  }
  
  if (!moment.tz.zone(timezone)) {
    throw new Error(`Invalid timezone: ${timezone}`);
  }
}

/**
 * Validate elevation
 * @param {number} elevation - Elevation in meters
 * @throws {Error} If elevation is invalid
 */
function validateElevation(elevation) {
  if (typeof elevation !== 'number') {
    throw new Error('Elevation must be a number');
  }
  
  if (elevation < -500 || elevation > 9000) {
    throw new Error('Elevation must be between -500 and 9000 meters');
  }
  
  if (isNaN(elevation)) {
    throw new Error('Elevation must be a valid number');
  }
}

/**
 * Convert coordinates to different formats
 * @param {number} latitude - Latitude in decimal degrees
 * @param {number} longitude - Longitude in decimal degrees
 * @returns {Object} Coordinates in various formats
 */
function convertCoordinateFormats(latitude, longitude) {
  validateCoordinates(latitude, longitude);
  
  // Convert to degrees, minutes, seconds
  const latDMS = decimalToDMS(latitude, 'latitude');
  const lonDMS = decimalToDMS(longitude, 'longitude');
  
  // Convert to degrees and decimal minutes
  const latDM = decimalToDM(latitude, 'latitude');
  const lonDM = decimalToDM(longitude, 'longitude');
  
  return {
    decimal: {
      latitude: latitude,
      longitude: longitude
    },
    dms: {
      latitude: latDMS,
      longitude: lonDMS
    },
    dm: {
      latitude: latDM,
      longitude: lonDM
    },
    formatted: {
      decimal: `${latitude.toFixed(6)}°, ${longitude.toFixed(6)}°`,
      dms: `${latDMS}, ${lonDMS}`,
      dm: `${latDM}, ${lonDM}`
    }
  };
}

/**
 * Convert decimal degrees to degrees, minutes, seconds
 * @param {number} decimal - Decimal degrees
 * @param {string} type - 'latitude' or 'longitude'
 * @returns {string} DMS format string
 */
function decimalToDMS(decimal, type) {
  const direction = getDirection(decimal, type);
  const abs = Math.abs(decimal);
  const degrees = Math.floor(abs);
  const minutesFloat = (abs - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = (minutesFloat - minutes) * 60;
  
  return `${degrees}° ${minutes}' ${seconds.toFixed(2)}" ${direction}`;
}

/**
 * Convert decimal degrees to degrees and decimal minutes
 * @param {number} decimal - Decimal degrees
 * @param {string} type - 'latitude' or 'longitude'
 * @returns {string} DM format string
 */
function decimalToDM(decimal, type) {
  const direction = getDirection(decimal, type);
  const abs = Math.abs(decimal);
  const degrees = Math.floor(abs);
  const minutes = (abs - degrees) * 60;
  
  return `${degrees}° ${minutes.toFixed(4)}' ${direction}`;
}

/**
 * Get direction letter for coordinate
 * @param {number} decimal - Decimal degrees
 * @param {string} type - 'latitude' or 'longitude'
 * @returns {string} Direction letter (N, S, E, W)
 */
function getDirection(decimal, type) {
  if (type === 'latitude') {
    return decimal >= 0 ? 'N' : 'S';
  } else {
    return decimal >= 0 ? 'E' : 'W';
  }
}

/**
 * Calculate distance between two coordinates
 * @param {number} lat1 - First latitude
 * @param {number} lon1 - First longitude
 * @param {number} lat2 - Second latitude
 * @param {number} lon2 - Second longitude
 * @returns {Object} Distance in various units
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  validateCoordinates(lat1, lon1);
  validateCoordinates(lat2, lon2);
  
  const distanceMeters = geolib.getDistance(
    { latitude: lat1, longitude: lon1 },
    { latitude: lat2, longitude: lon2 }
  );
  
  return {
    meters: distanceMeters,
    kilometers: distanceMeters / 1000,
    miles: distanceMeters / 1609.344,
    nauticalMiles: distanceMeters / 1852,
    formatted: {
      km: `${(distanceMeters / 1000).toFixed(2)} km`,
      miles: `${(distanceMeters / 1609.344).toFixed(2)} miles`
    }
  };
}

/**
 * Calculate bearing between two coordinates
 * @param {number} lat1 - First latitude
 * @param {number} lon1 - First longitude
 * @param {number} lat2 - Second latitude
 * @param {number} lon2 - Second longitude
 * @returns {Object} Bearing information
 */
function calculateBearing(lat1, lon1, lat2, lon2) {
  validateCoordinates(lat1, lon1);
  validateCoordinates(lat2, lon2);
  
  const bearing = geolib.getBearing(
    { latitude: lat1, longitude: lon1 },
    { latitude: lat2, longitude: lon2 }
  );
  
  const compassDirection = getCompassDirection(bearing);
  
  return {
    degrees: bearing,
    compass: compassDirection,
    formatted: `${bearing}° (${compassDirection})`
  };
}

/**
 * Get compass direction from bearing degrees
 * @param {number} bearing - Bearing in degrees
 * @returns {string} Compass direction
 */
function getCompassDirection(bearing) {
  const directions = [
    'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'
  ];
  
  const index = Math.round(bearing / 22.5) % 16;
  return directions[index];
}

/**
 * Check if coordinates are in polar regions
 * @param {number} latitude - Latitude in degrees
 * @returns {Object} Polar region information
 */
function checkPolarRegion(latitude) {
  validateCoordinates(latitude, 0); // Longitude doesn't matter for polar check
  
  const absLat = Math.abs(latitude);
  
  if (absLat >= 66.5) {
    return {
      isPolar: true,
      region: latitude > 0 ? 'Arctic' : 'Antarctic',
      circle: latitude > 0 ? 'Arctic Circle' : 'Antarctic Circle',
      warning: 'Sunrise/sunset calculations may be unreliable in polar regions during certain seasons'
    };
  }
  
  return {
    isPolar: false,
    region: null,
    circle: null,
    warning: null
  };
}

/**
 * Get timezone suggestions for coordinates
 * @param {number} latitude - Latitude in degrees
 * @param {number} longitude - Longitude in degrees
 * @returns {Array<string>} Suggested timezones
 */
function getTimezoneSuggestions(latitude, longitude) {
  validateCoordinates(latitude, longitude);
  
  // Simple timezone estimation based on longitude
  const offsetHours = Math.round(longitude / 15);
  const offsetMinutes = offsetHours * 60;
  
  // Get all timezones and filter by approximate offset
  const allTimezones = moment.tz.names();
  const suggestions = [];
  
  // Current time for offset calculation
  const now = moment();
  
  for (const tz of allTimezones) {
    const tzOffset = moment.tz(now, tz).utcOffset();
    
    // Allow 30-minute difference for timezone matching
    if (Math.abs(tzOffset - offsetMinutes) <= 30) {
      suggestions.push(tz);
    }
  }
  
  // Prioritize common timezones
  const priorityTimezones = [
    'Asia/Kolkata', 'Asia/Dubai', 'Europe/London', 'America/New_York',
    'America/Los_Angeles', 'Australia/Sydney', 'Asia/Tokyo'
  ];
  
  const prioritySuggestions = suggestions.filter(tz => 
    priorityTimezones.includes(tz)
  );
  
  const otherSuggestions = suggestions.filter(tz => 
    !priorityTimezones.includes(tz)
  );
  
  return [...prioritySuggestions, ...otherSuggestions.slice(0, 5)];
}

/**
 * Get country information from coordinates (simplified)
 * @param {number} latitude - Latitude in degrees
 * @param {number} longitude - Longitude in degrees
 * @returns {Object} Country information
 */
function getCountryInfo(latitude, longitude) {
  validateCoordinates(latitude, longitude);
  
  // Simplified country detection for major countries
  // In a real implementation, you would use a reverse geocoding service
  
  if (latitude >= 6 && latitude <= 37 && longitude >= 68 && longitude <= 97) {
    return {
      country: 'India',
      code: 'IN',
      suggestedTimezone: 'Asia/Kolkata',
      currency: 'INR'
    };
  }
  
  if (latitude >= 25 && latitude <= 49 && longitude >= -125 && longitude <= -66) {
    return {
      country: 'United States',
      code: 'US',
      suggestedTimezone: 'America/New_York',
      currency: 'USD'
    };
  }
  
  if (latitude >= 49 && latitude <= 61 && longitude >= -141 && longitude <= -52) {
    return {
      country: 'Canada',
      code: 'CA',
      suggestedTimezone: 'America/Toronto',
      currency: 'CAD'
    };
  }
  
  return {
    country: 'Unknown',
    code: null,
    suggestedTimezone: null,
    currency: null
  };
}

/**
 * Calculate magnetic declination (simplified)
 * @param {number} latitude - Latitude in degrees
 * @param {number} longitude - Longitude in degrees
 * @param {Date} date - Date for calculation
 * @returns {number} Magnetic declination in degrees
 */
function calculateMagneticDeclination(latitude, longitude, date) {
  validateCoordinates(latitude, longitude);
  
  // Simplified magnetic declination calculation
  // In a real implementation, you would use the World Magnetic Model (WMM)
  
  const year = date.getFullYear();
  const yearFraction = (date.getTime() - new Date(year, 0, 1).getTime()) / 
                      (new Date(year + 1, 0, 1).getTime() - new Date(year, 0, 1).getTime());
  
  const decimalYear = year + yearFraction;
  
  // Very simplified model - real declination varies significantly
  const declination = Math.sin(latitude * Math.PI / 180) * 
                     Math.cos(longitude * Math.PI / 180) * 
                     (decimalYear - 2020) * 0.1;
  
  return declination;
}

/**
 * Get elevation zone information
 * @param {number} elevation - Elevation in meters
 * @returns {Object} Elevation zone information
 */
function getElevationZone(elevation) {
  if (elevation !== undefined) {
    validateElevation(elevation);
  }
  
  if (elevation === undefined || elevation === null) {
    return {
      zone: 'Unknown',
      description: 'Elevation not specified',
      pressureEstimate: 1013.25
    };
  }
  
  let zone, description, pressureEstimate;
  
  if (elevation < 0) {
    zone = 'Below Sea Level';
    description = 'Below sea level - may affect atmospheric calculations';
    pressureEstimate = 1013.25 + Math.abs(elevation) * 0.012;
  } else if (elevation < 500) {
    zone = 'Low Elevation';
    description = 'Near sea level - minimal atmospheric effects';
    pressureEstimate = 1013.25 - elevation * 0.012;
  } else if (elevation < 1500) {
    zone = 'Moderate Elevation';
    description = 'Moderate elevation - some atmospheric effects';
    pressureEstimate = 1013.25 - elevation * 0.012;
  } else if (elevation < 3000) {
    zone = 'High Elevation';
    description = 'High elevation - significant atmospheric effects';
    pressureEstimate = 1013.25 - elevation * 0.012;
  } else {
    zone = 'Very High Elevation';
    description = 'Very high elevation - major atmospheric corrections needed';
    pressureEstimate = 1013.25 - elevation * 0.012;
  }
  
  return {
    zone,
    description,
    pressureEstimate: Math.max(pressureEstimate, 300), // Minimum realistic pressure
    elevationFeet: elevation * 3.28084
  };
}

/**
 * Format coordinates for display
 * @param {number} latitude - Latitude in degrees
 * @param {number} longitude - Longitude in degrees
 * @param {string} format - Format type ('decimal', 'dms', 'dm')
 * @returns {string} Formatted coordinates
 */
function formatCoordinates(latitude, longitude, format = 'decimal') {
  validateCoordinates(latitude, longitude);
  
  const formats = convertCoordinateFormats(latitude, longitude);
  
  switch (format) {
    case 'dms':
      return formats.formatted.dms;
    case 'dm':
      return formats.formatted.dm;
    case 'decimal':
    default:
      return formats.formatted.decimal;
  }
}

module.exports = {
  validateCoordinates,
  validateTimezone,
  validateElevation,
  convertCoordinateFormats,
  calculateDistance,
  calculateBearing,
  checkPolarRegion,
  getTimezoneSuggestions,
  getCountryInfo,
  calculateMagneticDeclination,
  getElevationZone,
  formatCoordinates,
  decimalToDMS,
  decimalToDM,
  getDirection,
  getCompassDirection
};
