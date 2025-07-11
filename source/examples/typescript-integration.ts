/**
 * 🕉️ Brahma Muhurat Calculator - TypeScript Integration Example
 * 
 * This example demonstrates how to integrate the Brahma Muhurat Calculator
 * into a TypeScript project with proper configuration and usage patterns.
 */

// Import type definitions for full TypeScript support
import { 
  CalculationParams, 
  CalculationResult, 
  CalculatorOptions 
} from '../types/index';

// Import the calculator
const BrahmaMuhuratCalculator = require('../src/index');

// 🏗️ Example: Creating a TypeScript service class
class BrahmaMuhuratService {
  private calculator: any;
  
  constructor(options?: CalculatorOptions) {
    this.calculator = new BrahmaMuhuratCalculator(options);
  }
  
  /**
   * Calculate Brahma Muhurat for a specific location and date
   */
  async calculateMuhurat(params: CalculationParams): Promise<CalculationResult> {
    try {
      // Validate parameters
      this.validateParams(params);
      
      // Perform calculation
      const result = this.calculator.calculate(params);
      
      // Log calculation details
      console.log(`✅ Calculated Brahma Muhurat for ${params.latitude}, ${params.longitude} on ${params.date}`);
      
      return result;
    } catch (error) {
      console.error('❌ Calculation failed:', error);
      throw new Error(`Brahma Muhurat calculation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * Calculate multiple dates for a location
   */
  async calculateMultipleDates(
    baseParams: Omit<CalculationParams, 'date'>, 
    dates: string[]
  ): Promise<CalculationResult[]> {
    const results: CalculationResult[] = [];
    
    for (const date of dates) {
      try {
        const result = await this.calculateMuhurat({ ...baseParams, date });
        results.push(result);
      } catch (error) {
        console.error(`❌ Failed to calculate for ${date}:`, error);
        // Continue with other dates
      }
    }
    
    return results;
  }
  
  /**
   * Validate calculation parameters
   */
  private validateParams(params: CalculationParams): void {
    if (!params.latitude || !params.longitude) {
      throw new Error('Latitude and longitude are required');
    }
    
    if (params.latitude < -90 || params.latitude > 90) {
      throw new Error('Latitude must be between -90 and 90 degrees');
    }
    
    if (params.longitude < -180 || params.longitude > 180) {
      throw new Error('Longitude must be between -180 and 180 degrees');
    }
    
    if (!params.timezone) {
      throw new Error('Timezone is required');
    }
  }
  
  /**
   * Get formatted result summary
   */
  getResultSummary(result: CalculationResult): string {
    return `
🕉️ Brahma Muhurat Summary:
  📍 Location: ${result.location.latitude}°, ${result.location.longitude}°
  📅 Date: ${result.date}
  🌅 Sunrise: ${result.sunrise.localTime}
  🕉️ Brahma Muhurat: ${result.brahmaMuhurat.start.localTime} - ${result.brahmaMuhurat.end.localTime}
  ⏰ Duration: ${result.brahmaMuhurat.duration.formatted}
  🎯 Tradition: ${result.brahmaMuhurat.traditionType}
    `;
  }
}

// 🎯 Example: Using the service in a TypeScript application
async function demonstrateTypeScriptIntegration(): Promise<void> {
  console.log('🕉️ TypeScript Integration Example');
  console.log('=================================\n');
  
  // 🏗️ Create service with high precision
  const service = new BrahmaMuhuratService({
    precision: 'high',
    traditionType: 'standard',
    refractionModel: 'saemundsson'
  });
  
  // 📍 Define calculation parameters
  const params: CalculationParams = {
    latitude: 25.317644,
    longitude: 83.005495,
    date: '2024-02-18',
    timezone: 'Asia/Kolkata',
    elevation: 80,
    temperature: 15,
    pressure: 1013.25,
    humidity: 0.5
  };
  
  try {
    // 🎯 Single calculation
    console.log('1. Single Date Calculation:');
    const singleResult = await service.calculateMuhurat(params);
    console.log(service.getResultSummary(singleResult));
    
    // 📅 Multiple dates calculation
    console.log('2. Multiple Dates Calculation:');
    const dates = ['2024-02-18', '2024-02-19', '2024-02-20'];
    const multipleResults = await service.calculateMultipleDates(
      {
        latitude: params.latitude,
        longitude: params.longitude,
        timezone: params.timezone,
        elevation: params.elevation
      },
      dates
    );
    
    console.log(`✅ Calculated ${multipleResults.length} dates successfully\n`);
    
    // 📊 Display results
    multipleResults.forEach((result, index) => {
      console.log(`Day ${index + 1}: ${result.brahmaMuhurat.start.localTime} - ${result.brahmaMuhurat.end.localTime}`);
    });
    
  } catch (error) {
    console.error('❌ Integration example failed:', error);
  }
}

// 🎨 Example: Creating a TypeScript utility class
class MuhuratUtils {
  /**
   * Format time range for display
   */
  static formatTimeRange(start: string, end: string): string {
    return `${start} → ${end}`;
  }
  
  /**
   * Calculate time until next Brahma Muhurat
   */
  static getTimeUntilNextMuhurat(result: CalculationResult): string {
    const now = new Date();
    const muhuratStart = new Date(result.brahmaMuhurat.start.time);
    
    if (now < muhuratStart) {
      const diffMs = muhuratStart.getTime() - now.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      return `${hours}h ${minutes}m`;
    } else {
      return 'Brahma Muhurat has passed for today';
    }
  }
  
  /**
   * Compare two calculation results
   */
  static compareMuhuratTimes(result1: CalculationResult, result2: CalculationResult): number {
    const time1 = new Date(result1.brahmaMuhurat.start.time);
    const time2 = new Date(result2.brahmaMuhurat.start.time);
    
    return time1.getTime() - time2.getTime();
  }
}

// 🌍 Example: Location-based calculator
interface LocationData {
  name: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  timezone: string;
  elevation?: number;
}

class LocationBasedCalculator {
  private service: BrahmaMuhuratService;
  
  constructor(options?: CalculatorOptions) {
    this.service = new BrahmaMuhuratService(options);
  }
  
  /**
   * Calculate for predefined locations
   */
  async calculateForLocation(
    location: LocationData, 
    date: string
  ): Promise<CalculationResult> {
    const params: CalculationParams = {
      latitude: location.coordinates.lat,
      longitude: location.coordinates.lon,
      date,
      timezone: location.timezone,
      elevation: location.elevation || 0
    };
    
    return this.service.calculateMuhurat(params);
  }
  
  /**
   * Compare multiple locations
   */
  async compareLocations(
    locations: LocationData[], 
    date: string
  ): Promise<Array<{ location: LocationData; result: CalculationResult }>> {
    const comparisons: Array<{ location: LocationData; result: CalculationResult }> = [];
    
    for (const location of locations) {
      try {
        const result = await this.calculateForLocation(location, date);
        comparisons.push({ location, result });
      } catch (error) {
        console.error(`❌ Failed to calculate for ${location.name}:`, error);
      }
    }
    
    return comparisons;
  }
}

// 🚀 Example usage
async function demonstrateLocationBasedCalculator(): Promise<void> {
  console.log('\n🌍 Location-Based Calculator Example:');
  console.log('====================================\n');
  
  const calculator = new LocationBasedCalculator({
    precision: 'high',
    traditionType: 'standard'
  });
  
  const locations: LocationData[] = [
    {
      name: 'Varanasi, India',
      coordinates: { lat: 25.317644, lon: 83.005495 },
      timezone: 'Asia/Kolkata',
      elevation: 80
    },
    {
      name: 'Haridwar, India',
      coordinates: { lat: 29.9457, lon: 78.1642 },
      timezone: 'Asia/Kolkata',
      elevation: 314
    },
    {
      name: 'Rishikesh, India',
      coordinates: { lat: 30.0869, lon: 78.2676 },
      timezone: 'Asia/Kolkata',
      elevation: 372
    }
  ];
  
  const comparisons = await calculator.compareLocations(locations, '2024-02-18');
  
  console.log('🏛️ Sacred Cities Comparison:');
  comparisons.forEach(({ location, result }) => {
    console.log(`${location.name}: ${result.brahmaMuhurat.start.localTime} - ${result.brahmaMuhurat.end.localTime}`);
  });
}

// 🎯 Main execution
async function main(): Promise<void> {
  try {
    await demonstrateTypeScriptIntegration();
    await demonstrateLocationBasedCalculator();
    
    console.log('\n🎉 TypeScript Integration Examples Completed Successfully!');
    console.log('\n📝 Key Benefits of TypeScript Integration:');
    console.log('  ✅ Full type safety and IntelliSense support');
    console.log('  ✅ Compile-time error detection');
    console.log('  ✅ Better code organization and maintainability');
    console.log('  ✅ Enhanced developer experience');
    console.log('  ✅ Seamless integration with modern TypeScript projects');
    
  } catch (error) {
    console.error('❌ TypeScript integration example failed:', error);
    process.exit(1);
  }
}

// Execute the examples
main();
