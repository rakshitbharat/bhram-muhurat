// Type definitions for Brahma Muhurat Calculator
// Definitions by: Rakshit Patel <https://github.com/rakshitbharat>

/**
 * Configuration options for the calculator
 */
export interface CalculatorOptions {
    precision?: 'basic' | 'high' | 'maximum';
    traditionType?: 'standard' | 'extended' | 'smarta';
    refractionModel?: 'bennett' | 'saemundsson' | 'rigorous';
}

/**
 * Calculation parameters
 */
export interface CalculationParams {
    date: Date | string;
    latitude: number;
    longitude: number;
    timezone: string;
    elevation?: number;
    pressure?: number;
    temperature?: number;
    humidity?: number;
}

/**
 * Calculation result
 */
export interface CalculationResult {
    location: {
        latitude: number;
        longitude: number;
        elevation: number;
        timezone: string;
    };
    date: string;
    sunrise: {
        time: Date;
        formatted: string;
        localTime: string;
    };
    brahmaMuhurat: {
        start: {
            time: Date;
            formatted: string;
            localTime: string;
        };
        end: {
            time: Date;
            formatted: string;
            localTime: string;
        };
        duration: {
            minutes: number;
            formatted: string;
        };
        traditionType: string;
    };
    astronomicalData: any;
    spiritualMetrics: any;
    calculationDetails: any;
    library: any;
}

/**
 * Main Brahma Muhurat Calculator class
 */
declare class BrahmaMuhuratCalculator {
    precision: string;
    traditionType: string;
    refractionModel: string;

    constructor(options?: CalculatorOptions);
    
    calculate(params: CalculationParams): CalculationResult;
    calculateBatch(baseParams: Omit<CalculationParams, 'date'>, dates: Array<Date | string>): Array<CalculationResult | { error: string }>;
    calculateSunrise(params: CalculationParams): any;
    
    static getSupportedTimezones(): string[];
    static formatCoordinates(latitude: number, longitude: number): string;
    static validateCoordinates(latitude: number, longitude: number): boolean;
    static getLibraryInfo(): any;
}

export default BrahmaMuhuratCalculator;
