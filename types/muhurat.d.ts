// Type definitions for muhurat calculations

import { TraditionType, BaseParams, CalculationResult } from './index';

export = MuhuratCalculator;

/**
 * Calculator for Brahma Muhurat timings using various traditions
 */
declare class MuhuratCalculator {
  /**
   * Creates a new muhurat calculator
   * @param options - Configuration options
   */
  constructor(options?: MuhuratCalculator.Options);

  /**
   * Calculate Brahma Muhurat for given parameters
   * @param params - Calculation parameters
   * @param date - Date for calculation
   * @returns Calculation result
   */
  calculate(params: BaseParams, date: Date): CalculationResult;

  /**
   * Calculate Brahma Muhurat for multiple dates
   * @param baseParams - Base parameters
   * @param dates - Array of dates
   * @returns Array of results
   */
  calculateBatch(baseParams: BaseParams, dates: (Date | string)[]): CalculationResult[];

  /**
   * Get moon phase information for given date
   * @param date - Date for calculation
   * @returns Moon phase data
   */
  getMoonPhase(date: Date): MuhuratCalculator.MoonPhase;

  /**
   * Get spiritual significance for muhurat timing
   * @param muhuratTimes - Muhurat timing information
   * @param date - Date of calculation
   * @returns Spiritual significance details
   */
  getSpiritualSignificance(
    muhuratTimes: MuhuratCalculator.MuhuratTiming,
    date: Date
  ): MuhuratCalculator.SpiritualSignificance;
}

declare namespace MuhuratCalculator {
  interface Options {
    /** Traditional calculation method */
    tradition?: TraditionType;
    
    /** Custom duration in minutes (for dynamic tradition) */
    customDuration?: number;
  }

  interface MuhuratTiming {
    /** Start time */
    start: Date;
    
    /** End time */
    end: Date;
    
    /** Duration in minutes */
    durationMinutes: number;
    
    /** Quality rating */
    quality?: 'excellent' | 'good' | 'moderate' | 'basic';
  }

  interface MoonPhase {
    /** Phase name */
    phase: string;
    
    /** Illumination percentage */
    illumination: number;
    
    /** Age in days */
    age: number;
    
    /** Distance from Earth in km */
    distance: number;
    
    /** Angular diameter in degrees */
    angularDiameter: number;
    
    /** Next new moon */
    nextNewMoon?: Date;
    
    /** Next full moon */
    nextFullMoon?: Date;
  }

  interface SpiritualSignificance {
    /** Overall quality */
    quality: 'excellent' | 'good' | 'moderate' | 'basic';
    
    /** Spiritual benefits */
    benefits: string[];
    
    /** Recommended practices */
    practices: string[];
    
    /** Detailed description */
    description: string;
    
    /** Astrological considerations */
    astrological?: {
      /** Planetary influences */
      planetaryInfluences: string[];
      
      /** Nakshatra information */
      nakshatra?: string;
      
      /** Tithi information */
      tithi?: string;
    };
  }

  interface TraditionDetails {
    /** Tradition name */
    name: TraditionType;
    
    /** Traditional duration */
    duration: number;
    
    /** Description */
    description: string;
    
    /** Historical background */
    background?: string;
    
    /** Regional variations */
    variations?: string[];
  }
}
