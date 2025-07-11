#!/usr/bin/env ts-node

/**
 * 🕉️ Brahma Muhurat Calculator - TypeScript Simple Example
 * 
 * This example demonstrates basic usage of the Brahma Muhurat Calculator
 * with full TypeScript type safety and IntelliSense support.
 */

// Import type definitions for TypeScript support
import { 
  CalculationParams, 
  CalculationResult, 
  CalculatorOptions 
} from '../types/index';

// Import the actual calculator (CommonJS)
const BrahmaMuhuratCalculator = require('../src/index');

console.log('🕉️ Brahma Muhurat Calculator - TypeScript Simple Example');
console.log('====================================================\n');

// 🏗️ Create calculator with TypeScript type safety
const options: CalculatorOptions = {
  precision: 'high',
  traditionType: 'standard',
  refractionModel: 'bennett'
};

const calculator = new BrahmaMuhuratCalculator(options);

// 📍 Define calculation parameters with full type checking
const params: CalculationParams = {
  latitude: 25.317644,     // Varanasi, India
  longitude: 83.005495,
  date: '2024-02-18',
  timezone: 'Asia/Kolkata',
  elevation: 80,           // Optional: elevation in meters
  temperature: 15,         // Optional: temperature in Celsius
  pressure: 1013.25,       // Optional: atmospheric pressure
  humidity: 0.5            // Optional: relative humidity (0-1)
};

try {
  console.log('🔍 Calculating Brahma Muhurat...\n');
  
  // 🎯 Perform calculation with full type safety
  const result: CalculationResult = calculator.calculate(params);
  
  // 📊 Display results with proper TypeScript types
  console.log('📍 Location Information:');
  console.log(`   Latitude: ${result.location.latitude}°`);
  console.log(`   Longitude: ${result.location.longitude}°`);
  console.log(`   Elevation: ${result.location.elevation}m`);
  console.log(`   Timezone: ${result.location.timezone}`);
  console.log(`   Date: ${result.date}\n`);
  
  console.log('🌅 Sunrise Information:');
  console.log(`   Time: ${result.sunrise.localTime}`);
  console.log(`   Formatted: ${result.sunrise.formatted}\n`);
  
  console.log('🕉️ Brahma Muhurat:');
  console.log(`   Start: ${result.brahmaMuhurat.start.localTime}`);
  console.log(`   End: ${result.brahmaMuhurat.end.localTime}`);
  console.log(`   Duration: ${result.brahmaMuhurat.duration.formatted} (${result.brahmaMuhurat.duration.minutes} minutes)`);
  console.log(`   Tradition: ${result.brahmaMuhurat.traditionType}\n`);
  
  // 🔬 TypeScript ensures we can safely access nested properties
  if (result.astronomicalData) {
    console.log('🔬 Astronomical Data:');
    console.log(`   Solar Position: Available`);
    console.log(`   Atmospheric Corrections: Applied\n`);
  }
  
  console.log('✅ Calculation completed successfully!');
  
} catch (error: unknown) {
  // 🛡️ Type-safe error handling
  if (error instanceof Error) {
    console.error('❌ Calculation failed:', error.message);
  } else {
    console.error('❌ Unknown error occurred:', error);
  }
}

// 🧪 Additional TypeScript examples with type safety
console.log('\n🧪 Additional TypeScript Examples:');
console.log('=================================\n');

// 📋 Validate coordinates with type checking
const isValid: boolean = BrahmaMuhuratCalculator.validateCoordinates(
  params.latitude, 
  params.longitude
);
console.log(`📍 Coordinates valid: ${isValid ? '✅' : '❌'}`);

// 🌍 Get supported timezones (typed array)
const timezones: string[] = BrahmaMuhuratCalculator.getSupportedTimezones();
console.log(`🌍 Supported timezones: ${timezones.length} available`);

// 🎯 Format coordinates with type safety
const formatted: string = BrahmaMuhuratCalculator.formatCoordinates(
  params.latitude, 
  params.longitude
);
console.log(`📍 Formatted coordinates: ${formatted}`);

// 📚 Get library information
const libraryInfo = BrahmaMuhuratCalculator.getLibraryInfo();
console.log(`📚 Library version: ${libraryInfo.version || 'Unknown'}`);

console.log('\n🎉 TypeScript integration complete!');
console.log('📝 Note: Full IntelliSense support and compile-time type checking enabled');
