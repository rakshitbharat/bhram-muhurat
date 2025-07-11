// Type definitions for atmospheric refraction calculations

import { RefractionModel } from './index';

export = RefractionCalculator;

/**
 * Calculator for atmospheric refraction corrections
 */
declare class RefractionCalculator {
  /**
   * Creates a new refraction calculator
   * @param options - Configuration options
   */
  constructor(options?: RefractionCalculator.Options);

  /**
   * Calculate atmospheric refraction correction
   * @param elevationAngle - Apparent elevation angle in degrees
   * @param pressure - Atmospheric pressure in hPa
   * @param temperature - Temperature in Celsius
   * @param humidity - Relative humidity percentage (optional)
   * @param wavelength - Light wavelength in nanometers (optional)
   * @returns Refraction correction in degrees
   */
  calculateRefraction(
    elevationAngle: number,
    pressure: number,
    temperature: number,
    humidity?: number,
    wavelength?: number
  ): number;

  /**
   * Calculate refraction using Bennett model
   * @param elevationAngle - Elevation angle in degrees
   * @param pressure - Atmospheric pressure in hPa
   * @param temperature - Temperature in Celsius
   * @returns Refraction in degrees
   */
  calculateBennettRefraction(
    elevationAngle: number,
    pressure: number,
    temperature: number
  ): number;

  /**
   * Calculate refraction using Sæmundsson model
   * @param elevationAngle - Elevation angle in degrees
   * @param pressure - Atmospheric pressure in hPa
   * @param temperature - Temperature in Celsius
   * @returns Refraction in degrees
   */
  calculateSaemundssonRefraction(
    elevationAngle: number,
    pressure: number,
    temperature: number
  ): number;

  /**
   * Calculate refraction using rigorous model
   * @param elevationAngle - Elevation angle in degrees
   * @param pressure - Atmospheric pressure in hPa
   * @param temperature - Temperature in Celsius
   * @param humidity - Relative humidity percentage
   * @param wavelength - Light wavelength in nanometers
   * @returns Refraction in degrees
   */
  calculateRigorousRefraction(
    elevationAngle: number,
    pressure: number,
    temperature: number,
    humidity: number,
    wavelength: number
  ): number;

  /**
   * Get atmospheric density for given conditions
   * @param pressure - Atmospheric pressure in hPa
   * @param temperature - Temperature in Celsius
   * @param humidity - Relative humidity percentage
   * @returns Air density in kg/m³
   */
  getAtmosphericDensity(
    pressure: number,
    temperature: number,
    humidity: number
  ): number;

  /**
   * Get refractive index for given conditions
   * @param pressure - Atmospheric pressure in hPa
   * @param temperature - Temperature in Celsius
   * @param humidity - Relative humidity percentage
   * @param wavelength - Light wavelength in nanometers
   * @returns Refractive index
   */
  getRefractiveIndex(
    pressure: number,
    temperature: number,
    humidity: number,
    wavelength: number
  ): number;
}

declare namespace RefractionCalculator {
  interface Options {
    /** Refraction model to use */
    model?: RefractionModel;
    
    /** Default atmospheric pressure in hPa */
    defaultPressure?: number;
    
    /** Default temperature in Celsius */
    defaultTemperature?: number;
    
    /** Default relative humidity percentage */
    defaultHumidity?: number;
    
    /** Default wavelength in nanometers */
    defaultWavelength?: number;
  }

  interface AtmosphericConditions {
    /** Atmospheric pressure in hPa */
    pressure: number;
    
    /** Temperature in Celsius */
    temperature: number;
    
    /** Relative humidity percentage (0-100) */
    humidity: number;
    
    /** Elevation above sea level in meters */
    elevation?: number;
  }

  interface RefractionResult {
    /** Refraction correction in degrees */
    correction: number;
    
    /** Model used for calculation */
    model: RefractionModel;
    
    /** Atmospheric conditions used */
    conditions: AtmosphericConditions;
    
    /** Wavelength used in nanometers */
    wavelength?: number;
    
    /** Additional model-specific data */
    metadata?: {
      /** Air density in kg/m³ */
      airDensity?: number;
      
      /** Refractive index */
      refractiveIndex?: number;
      
      /** Temperature coefficient */
      temperatureCoefficient?: number;
      
      /** Pressure coefficient */
      pressureCoefficient?: number;
    };
  }

  interface ModelComparison {
    /** Bennett model result */
    bennett: number;
    
    /** Sæmundsson model result */
    saemundsson: number;
    
    /** Rigorous model result */
    rigorous: number;
    
    /** Maximum difference between models */
    maxDifference: number;
    
    /** Recommended model for conditions */
    recommended: RefractionModel;
  }
}
