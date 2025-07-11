// Type definitions for core astronomical calculations

import { PrecisionLevel, RefractionModel } from './index';

export = AstronomicalCalculator;

/**
 * Core astronomical calculator for sunrise and solar positions
 */
declare class AstronomicalCalculator {
  /**
   * Creates a new astronomical calculator
   * @param options - Configuration options
   */
  constructor(options?: AstronomicalCalculator.Options);

  /**
   * Calculate sunrise time for given coordinates and date
   * @param latitude - Latitude in decimal degrees
   * @param longitude - Longitude in decimal degrees  
   * @param elevation - Elevation above sea level in meters
   * @param date - Date for calculation
   * @param options - Additional calculation options
   * @returns Sunrise time
   */
  calculateSunrise(
    latitude: number,
    longitude: number,
    elevation: number,
    date: Date,
    options?: AstronomicalCalculator.CalculationOptions
  ): Date;

  /**
   * Calculate solar position for given coordinates and time
   * @param latitude - Latitude in decimal degrees
   * @param longitude - Longitude in decimal degrees
   * @param date - Date and time for calculation
   * @param options - Additional calculation options
   * @returns Solar position (azimuth and elevation)
   */
  calculateSolarPosition(
    latitude: number,
    longitude: number,
    date: Date,
    options?: AstronomicalCalculator.CalculationOptions
  ): AstronomicalCalculator.SolarPosition;

  /**
   * Calculate twilight times (civil, nautical, astronomical)
   * @param latitude - Latitude in decimal degrees
   * @param longitude - Longitude in decimal degrees
   * @param date - Date for calculation
   * @returns Twilight times
   */
  calculateTwilightTimes(
    latitude: number,
    longitude: number,
    date: Date
  ): AstronomicalCalculator.TwilightTimes;

  /**
   * Get library compatibility status
   * @returns Status of loaded libraries
   */
  getLibraryStatus(): AstronomicalCalculator.LibraryStatus;
}

declare namespace AstronomicalCalculator {
  interface Options {
    /** Calculation precision level */
    precision?: PrecisionLevel;
    
    /** Use Swiss Ephemeris if available */
    useSwissEphemeris?: boolean;
  }

  interface CalculationOptions {
    /** Atmospheric pressure in hPa */
    pressure?: number;
    
    /** Temperature in Celsius */
    temperature?: number;
    
    /** Relative humidity percentage */
    humidity?: number;
  }

  interface SolarPosition {
    /** Azimuth angle in degrees (0-360) */
    azimuth: number;
    
    /** Elevation angle in degrees (-90 to 90) */
    elevation: number;
    
    /** Solar distance in AU */
    distance?: number;
    
    /** Right ascension in degrees */
    rightAscension?: number;
    
    /** Declination in degrees */
    declination?: number;
  }

  interface TwilightTimes {
    /** Civil twilight times */
    civil: {
      dawn: Date;
      dusk: Date;
    };
    
    /** Nautical twilight times */
    nautical: {
      dawn: Date;
      dusk: Date;
    };
    
    /** Astronomical twilight times */
    astronomical: {
      dawn: Date;
      dusk: Date;
    };
  }

  interface LibraryStatus {
    /** Astronomia library loaded */
    astronomia: boolean;
    
    /** Swiss Ephemeris loaded */
    swissEphemeris: boolean;
    
    /** SunCalc library loaded */
    suncalc: boolean;
    
    /** Astronomy Engine loaded */
    astronomyEngine: boolean;
  }
}
