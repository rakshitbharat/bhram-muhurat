/**
 * Simple example demonstrating basic usage of Brahma Muhurat Calculator
 */

const BrahmaMuhuratCalculator = require('../src/index');

// Example 1: Basic Calculation for Varanasi
console.log('🕉️  Brahma Muhurat Calculator - Simple Example\n');

// Initialize the calculator
const calculator = new BrahmaMuhuratCalculator({
  precision: 'high',
  traditionType: 'standard'
});

// Calculate Brahma Muhurat for Varanasi, India
const varanasi = {
  latitude: 25.317644,
  longitude: 83.005495,
  elevation: 80.71,
  date: '2024-02-18',
  timezone: 'Asia/Kolkata'
};

try {
  console.log('📍 Location: Varanasi, India');
  console.log(`   Coordinates: ${BrahmaMuhuratCalculator.formatCoordinates(varanasi.latitude, varanasi.longitude)}`);
  console.log(`   Date: ${varanasi.date}`);
  console.log(`   Timezone: ${varanasi.timezone}\n`);

  const result = calculator.calculate(varanasi);

  console.log('🌅 Calculation Results:');
  console.log(`   Sunrise: ${result.sunrise.localTime}`);
  console.log(`   Brahma Muhurat: ${result.brahmaMuhurat.start.localTime} to ${result.brahmaMuhurat.end.localTime}`);
  console.log(`   Duration: ${result.brahmaMuhurat.duration.formatted}`);
  console.log(`   Precision: ${result.calculationDetails.precision}\n`);

  // Show spiritual significance
  if (result.spiritualMetrics) {
    console.log('🙏 Spiritual Significance:');
    console.log(`   Moon Phase: ${result.spiritualMetrics.moonPhase.phase}`);
    console.log(`   Night Portion: ${result.spiritualMetrics.nightPortion.percentage}%`);
    console.log(`   ${result.spiritualMetrics.nightPortion.description}\n`);

    console.log('✨ Recommended Activities:');
    result.spiritualMetrics.optimalActivities.forEach(activity => {
      console.log(`   • ${activity}`);
    });
  }

} catch (error) {
  console.error('❌ Error:', error.message);
}

// Example 2: Multiple Locations
console.log('\n' + '='.repeat(60));
console.log('🌍 Multiple Locations Example\n');

const locations = [
  {
    name: 'New York, USA',
    latitude: 40.7128,
    longitude: -74.0060,
    timezone: 'America/New_York'
  },
  {
    name: 'London, UK',
    latitude: 51.5074,
    longitude: -0.1278,
    timezone: 'Europe/London'
  },
  {
    name: 'Tokyo, Japan',
    latitude: 35.6762,
    longitude: 139.6503,
    timezone: 'Asia/Tokyo'
  }
];

const date = new Date().toISOString().split('T')[0]; // Today's date

locations.forEach(location => {
  try {
    const params = {
      latitude: location.latitude,
      longitude: location.longitude,
      date: date,
      timezone: location.timezone
    };

    const result = calculator.calculate(params);

    console.log(`📍 ${location.name}:`);
    console.log(`   Brahma Muhurat: ${result.brahmaMuhurat.start.localTime} to ${result.brahmaMuhurat.end.localTime}`);
    console.log(`   Sunrise: ${result.sunrise.localTime}`);
    console.log();

  } catch (error) {
    console.log(`❌ ${location.name}: ${error.message}\n`);
  }
});

// Example 3: Different Tradition Types
console.log('='.repeat(60));
console.log('📿 Different Tradition Types\n');

const traditions = ['standard', 'extended', 'smarta'];
const testLocation = varanasi;

traditions.forEach(tradition => {
  const calc = new BrahmaMuhuratCalculator({
    precision: 'high',
    traditionType: tradition
  });

  try {
    const result = calc.calculate(testLocation);
    const traditionInfo = calc.getTraditionInfo();

    console.log(`${tradition.toUpperCase()} Tradition:`);
    console.log(`   Duration: ${traditionInfo.duration}`);
    console.log(`   Brahma Muhurat: ${result.brahmaMuhurat.start.localTime} to ${result.brahmaMuhurat.end.localTime}`);
    console.log(`   Description: ${traditionInfo.description}\n`);

  } catch (error) {
    console.log(`❌ ${tradition}: ${error.message}\n`);
  }
});

// Example 4: Atmospheric Conditions
console.log('='.repeat(60));
console.log('🌤️  Atmospheric Conditions Example\n');

const conditions = [
  { name: 'Sea Level, Normal', pressure: 1013.25, temperature: 15, elevation: 0 },
  { name: 'High Altitude', pressure: 850, temperature: 5, elevation: 2000 },
  { name: 'Hot Climate', pressure: 1010, temperature: 35, elevation: 100 },
  { name: 'Cold Climate', pressure: 1020, temperature: -5, elevation: 500 }
];

conditions.forEach(condition => {
  try {
    const params = {
      ...varanasi,
      pressure: condition.pressure,
      temperature: condition.temperature,
      elevation: condition.elevation
    };

    const result = calculator.calculate(params);

    console.log(`${condition.name}:`);
    console.log(`   Conditions: ${condition.pressure} mbar, ${condition.temperature}°C, ${condition.elevation}m`);
    console.log(`   Sunrise: ${result.sunrise.localTime}`);
    console.log(`   Brahma Muhurat: ${result.brahmaMuhurat.start.localTime} to ${result.brahmaMuhurat.end.localTime}\n`);

  } catch (error) {
    console.log(`❌ ${condition.name}: ${error.message}\n`);
  }
});

console.log('✅ Simple example completed!');
console.log('\n📖 For more examples, check the examples/ directory');
console.log('🔗 Documentation: https://github.com/rakshitbharat/brahma-muhurat');
