# 📝 TypeScript Integration Guide

## Overview
The Brahma Muhurat Calculator provides full TypeScript support with comprehensive type definitions, enabling type-safe development with IntelliSense support.

## Installation
```bash
npm install brahma-muhurat
npm install -D typescript ts-node @types/node
```

## Type Definitions
The library includes complete TypeScript definitions:

```typescript
// Core interfaces available
import { 
  CalculationParams, 
  CalculationResult, 
  CalculatorOptions 
} from 'brahma-muhurat';
```

## Basic TypeScript Usage

### Simple Calculation
```typescript
import { CalculationParams, CalculationResult } from 'brahma-muhurat';
const BrahmaMuhuratCalculator = require('brahma-muhurat');

const calculator = new BrahmaMuhuratCalculator({
  precision: 'high',
  traditionType: 'standard',
  refractionModel: 'bennett'
});

const params: CalculationParams = {
  latitude: 25.317644,
  longitude: 83.005495,
  date: '2024-02-18',
  timezone: 'Asia/Kolkata'
};

const result: CalculationResult = calculator.calculate(params);
```

### Service Class Pattern
```typescript
class BrahmaMuhuratService {
  private calculator: any;
  
  constructor(options?: CalculatorOptions) {
    this.calculator = new BrahmaMuhuratCalculator(options);
  }
  
  async calculateMuhurat(params: CalculationParams): Promise<CalculationResult> {
    return this.calculator.calculate(params);
  }
}
```

## Advanced TypeScript Features

### Batch Processing
```typescript
const service = new BrahmaMuhuratService();
const dates = ['2024-02-18', '2024-02-19', '2024-02-20'];

const results: CalculationResult[] = await service.calculateMultipleDates(
  { latitude: 25.317644, longitude: 83.005495, timezone: 'Asia/Kolkata' },
  dates
);
```

### Location-Based Calculator
```typescript
interface LocationData {
  name: string;
  coordinates: { lat: number; lon: number };
  timezone: string;
  elevation?: number;
}

class LocationBasedCalculator {
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
    
    return this.calculator.calculate(params);
  }
}
```

## Running TypeScript Examples

```bash
# Run all TypeScript examples
npm run example:typescript

# Run specific examples
npm run example:ts-simple        # Basic TypeScript usage
npm run example:ts-advanced      # Advanced features
npm run example:ts-integration   # Service patterns
```

## TypeScript Configuration

Example `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*", "types/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## Benefits of TypeScript Integration

✅ **Type Safety**: Compile-time error detection and type validation  
✅ **IntelliSense**: Full autocomplete and parameter hints  
✅ **Documentation**: Inline type documentation and examples  
✅ **Refactoring**: Safe code refactoring with confidence  
✅ **Maintainability**: Better code organization and structure  

## Type Definitions Reference

### CalculatorOptions
```typescript
interface CalculatorOptions {
  precision?: 'basic' | 'high' | 'maximum';
  traditionType?: 'standard' | 'extended' | 'smarta';
  refractionModel?: 'bennett' | 'saemundsson' | 'rigorous';
}
```

### CalculationParams
```typescript
interface CalculationParams {
  date: Date | string;
  latitude: number;
  longitude: number;
  timezone: string;
  elevation?: number;
  pressure?: number;
  temperature?: number;
  humidity?: number;
}
```

### CalculationResult
```typescript
interface CalculationResult {
  location: LocationInfo;
  date: string;
  sunrise: TimeInfo;
  brahmaMuhurat: MuhuratInfo;
  astronomicalData: any;
  spiritualMetrics: any;
}
```

## Error Handling
```typescript
try {
  const result = calculator.calculate(params);
  // Handle success
} catch (error: unknown) {
  if (error instanceof Error) {
    console.error('Calculation failed:', error.message);
  } else {
    console.error('Unknown error:', error);
  }
}
```

## Best Practices

1. **Always use type annotations** for parameters and return values
2. **Validate inputs** before calculations
3. **Handle errors gracefully** with proper TypeScript error types
4. **Use interfaces** for complex data structures
5. **Leverage IntelliSense** for API discovery and documentation
