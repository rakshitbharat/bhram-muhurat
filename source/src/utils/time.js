/**
 * Time utility functions for date/time handling and formatting
 */

const moment = require('moment-timezone');
const { DateTime } = require('luxon');
const _unusedDateTime = DateTime; // Referenced to avoid ESLint unused var warning

/**
 * Parse various date input formats
 * @param {string|Date|moment} input - Date input in various formats
 * @returns {Date} Parsed date object
 */
function parseDateInput(input) {
  if (input instanceof Date) {
    return input;
  }
  
  if (moment.isMoment(input)) {
    return input.toDate();
  }
  
  if (typeof input === 'string') {
    // Try various formats
    const formats = [
      'YYYY-MM-DD',
      'YYYY-MM-DD HH:mm:ss',
      'DD/MM/YYYY',
      'MM/DD/YYYY',
      'DD-MM-YYYY',
      'YYYY/MM/DD'
    ];
    
    for (const format of formats) {
      const parsed = moment(input, format, true);
      if (parsed.isValid()) {
        return parsed.toDate();
      }
    }
    
    // Try ISO format and natural language parsing
    const parsed = moment(input);
    if (parsed.isValid()) {
      return parsed.toDate();
    }
  }
  
  throw new Error(`Invalid date format: ${input}`);
}

/**
 * Format date/time for display
 * @param {Date} date - Date to format
 * @param {string} timezone - Target timezone
 * @param {string} format - Format string (optional)
 * @returns {string} Formatted date string
 */
function formatDateTime(date, timezone, format = 'YYYY-MM-DD HH:mm:ss z') {
  return moment(date).tz(timezone).format(format);
}

/**
 * Format time only (HH:mm:ss)
 * @param {Date} date - Date to format
 * @param {string} timezone - Target timezone
 * @returns {string} Formatted time string
 */
function formatTime(date, timezone) {
  return moment(date).tz(timezone).format('HH:mm:ss');
}

/**
 * Format date only (YYYY-MM-DD)
 * @param {Date} date - Date to format
 * @param {string} timezone - Target timezone
 * @returns {string} Formatted date string
 */
function formatDate(date, timezone) {
  return moment(date).tz(timezone).format('YYYY-MM-DD');
}

/**
 * Convert between timezones
 * @param {Date} date - Source date
 * @param {string} fromTimezone - Source timezone
 * @param {string} toTimezone - Target timezone
 * @returns {Date} Converted date
 */
function convertTimezone(date, fromTimezone, toTimezone) {
  return moment.tz(date, fromTimezone).tz(toTimezone).toDate();
}

/**
 * Get timezone offset in minutes
 * @param {string} timezone - Timezone name
 * @param {Date} date - Date for which to get offset (optional)
 * @returns {number} Offset in minutes
 */
function getTimezoneOffset(timezone, date = new Date()) {
  return moment.tz(date, timezone).utcOffset();
}

/**
 * Check if timezone is valid
 * @param {string} timezone - Timezone name to validate
 * @returns {boolean} True if valid timezone
 */
function isValidTimezone(timezone) {
  return !!moment.tz.zone(timezone);
}

/**
 * Get all available timezones
 * @returns {Array<string>} Array of timezone names
 */
function getSupportedTimezones() {
  return moment.tz.names();
}

/**
 * Get timezones for a specific country
 * @param {string} countryCode - ISO country code (e.g., 'IN', 'US')
 * @returns {Array<string>} Array of timezone names for the country
 */
function getCountryTimezones(countryCode) {
  return moment.tz.names().filter(tz => tz.includes(countryCode.toUpperCase()));
}

/**
 * Get Indian timezones
 * @returns {Array<string>} Array of Indian timezone names
 */
function getIndianTimezones() {
  return [
    'Asia/Kolkata',
    'Asia/Calcutta' // Legacy name
  ];
}

/**
 * Calculate duration between two dates
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {string} unit - Unit for duration ('minutes', 'hours', 'days')
 * @returns {number} Duration in specified unit
 */
function calculateDuration(startDate, endDate, unit = 'minutes') {
  return moment(endDate).diff(moment(startDate), unit);
}

/**
 * Add time to a date
 * @param {Date} date - Base date
 * @param {number} amount - Amount to add
 * @param {string} unit - Unit ('minutes', 'hours', 'days', etc.)
 * @returns {Date} New date with time added
 */
function addTime(date, amount, unit) {
  return moment(date).add(amount, unit).toDate();
}

/**
 * Subtract time from a date
 * @param {Date} date - Base date
 * @param {number} amount - Amount to subtract
 * @param {string} unit - Unit ('minutes', 'hours', 'days', etc.)
 * @returns {Date} New date with time subtracted
 */
function subtractTime(date, amount, unit) {
  return moment(date).subtract(amount, unit).toDate();
}

/**
 * Get start of day for given date and timezone
 * @param {Date} date - Date
 * @param {string} timezone - Timezone
 * @returns {Date} Start of day
 */
function getStartOfDay(date, timezone) {
  return moment.tz(date, timezone).startOf('day').toDate();
}

/**
 * Get end of day for given date and timezone
 * @param {Date} date - Date
 * @param {string} timezone - Timezone
 * @returns {Date} End of day
 */
function getEndOfDay(date, timezone) {
  return moment.tz(date, timezone).endOf('day').toDate();
}

/**
 * Check if date is today in given timezone
 * @param {Date} date - Date to check
 * @param {string} timezone - Timezone
 * @returns {boolean} True if date is today
 */
function isToday(date, timezone) {
  const today = moment.tz(timezone);
  const checkDate = moment.tz(date, timezone);
  return today.isSame(checkDate, 'day');
}

/**
 * Get day of year (1-366)
 * @param {Date} date - Date
 * @returns {number} Day of year
 */
function getDayOfYear(date) {
  return moment(date).dayOfYear();
}

/**
 * Get week of year
 * @param {Date} date - Date
 * @returns {number} Week of year
 */
function getWeekOfYear(date) {
  return moment(date).week();
}

/**
 * Check if year is leap year
 * @param {number} year - Year to check
 * @returns {boolean} True if leap year
 */
function isLeapYear(year) {
  return moment([year]).isLeapYear();
}

/**
 * Get number of days in month
 * @param {Date} date - Date in the month
 * @returns {number} Number of days in month
 */
function getDaysInMonth(date) {
  return moment(date).daysInMonth();
}

/**
 * Format duration in a human-readable way
 * @param {number} minutes - Duration in minutes
 * @returns {string} Human-readable duration
 */
function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  } else {
    return `${mins}m`;
  }
}

/**
 * Convert Julian Day Number to Date
 * @param {number} jdn - Julian Day Number
 * @returns {Date} Converted date
 */
function julianToDate(jdn) {
  // Julian Day Number conversion
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  
  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = 100 * b + d - 4800 + Math.floor(m / 10);
  
  return new Date(year, month - 1, day);
}

/**
 * Convert Date to Julian Day Number
 * @param {Date} date - Date to convert
 * @returns {number} Julian Day Number
 */
function dateToJulian(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

/**
 * Validate date range
 * @param {Date} date - Date to validate
 * @param {Date} minDate - Minimum allowed date (optional)
 * @param {Date} maxDate - Maximum allowed date (optional)
 * @returns {boolean} True if date is in valid range
 */
function validateDateRange(date, minDate, maxDate) {
  const momentDate = moment(date);
  
  if (minDate && momentDate.isBefore(minDate)) {
    return false;
  }
  
  if (maxDate && momentDate.isAfter(maxDate)) {
    return false;
  }
  
  return true;
}

/**
 * Get relative time description
 * @param {Date} date - Date to compare
 * @param {Date} baseDate - Base date for comparison (optional, defaults to now)
 * @returns {string} Relative time description
 */
function getRelativeTime(date, baseDate = new Date()) {
  return moment(date).from(moment(baseDate));
}

/**
 * Parse time string (HH:mm:ss or HH:mm)
 * @param {string} timeString - Time in string format
 * @returns {Object} Parsed time object {hours, minutes, seconds}
 */
function parseTime(timeString) {
  const parts = timeString.split(':');
  
  if (parts.length < 2 || parts.length > 3) {
    throw new Error('Invalid time format. Use HH:mm or HH:mm:ss');
  }
  
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const seconds = parts.length === 3 ? parseInt(parts[2], 10) : 0;
  
  if (hours < 0 || hours > 23) {
    throw new Error('Hours must be between 0 and 23');
  }
  
  if (minutes < 0 || minutes > 59) {
    throw new Error('Minutes must be between 0 and 59');
  }
  
  if (seconds < 0 || seconds > 59) {
    throw new Error('Seconds must be between 0 and 59');
  }
  
  return { hours, minutes, seconds };
}

module.exports = {
  parseDateInput,
  formatDateTime,
  formatTime,
  formatDate,
  convertTimezone,
  getTimezoneOffset,
  isValidTimezone,
  getSupportedTimezones,
  getCountryTimezones,
  getIndianTimezones,
  calculateDuration,
  addTime,
  subtractTime,
  getStartOfDay,
  getEndOfDay,
  isToday,
  getDayOfYear,
  getWeekOfYear,
  isLeapYear,
  getDaysInMonth,
  formatDuration,
  julianToDate,
  dateToJulian,
  validateDateRange,
  getRelativeTime,
  parseTime
};
