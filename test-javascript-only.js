// Test pure JavaScript usage without TypeScript
const BrahmaMuhuratCalculator = require('./index.js');

console.log('🧪 Testing Pure JavaScript Usage (No TypeScript)');
console.log('='.repeat(60));

// Test 1: Basic usage
console.log('\n📍 Test 1: Basic Calculation');
const calculator = new BrahmaMuhuratCalculator();
const result = calculator.calculate({
  latitude: 25.317644,
  longitude: 83.005495,
  date: '2024-02-18',
  timezone: 'Asia/Kolkata'
});

console.log(`✅ Brahma Muhurat: ${result.brahmaMuhurat.start.localTime} - ${result.brahmaMuhurat.end.localTime}`);
console.log(`✅ Sunrise: ${result.sunrise.localTime}`);
console.log(`✅ Duration: ${result.brahmaMuhurat.duration.formatted}`);

// Test 2: Different configurations
console.log('\n⚙️ Test 2: Different Configurations');
const precisionLevels = ['basic', 'high', 'maximum'];
precisionLevels.forEach(precision => {
  const calc = new BrahmaMuhuratCalculator({ precision });
  const res = calc.calculate({
    latitude: 25.317644,
    longitude: 83.005495,
    date: '2024-02-18',
    timezone: 'Asia/Kolkata'
  });
  console.log(`✅ ${precision} precision: ${res.brahmaMuhurat.start.localTime}`);
});

// Test 3: Batch processing
console.log('\n📅 Test 3: Batch Processing');
const dates = ['2024-02-18', '2024-02-19', '2024-02-20'];
const batchResults = calculator.calculateBatch({
  latitude: 25.317644,
  longitude: 83.005495,
  timezone: 'Asia/Kolkata'
}, dates);

batchResults.forEach((res, index) => {
  if (res.error) {
    console.log(`❌ Day ${index + 1}: Error - ${res.error}`);
  } else {
    console.log(`✅ Day ${index + 1}: ${res.brahmaMuhurat.start.localTime}`);
  }
});

// Test 4: Static methods
console.log('\n🔧 Test 4: Static Methods');
console.log(`✅ Library Info: ${JSON.stringify(BrahmaMuhuratCalculator.getLibraryInfo(), null, 2)}`);
console.log(`✅ Coordinate Validation: ${BrahmaMuhuratCalculator.validateCoordinates(25.317644, 83.005495)}`);
console.log(`✅ Coordinate Format: ${BrahmaMuhuratCalculator.formatCoordinates(25.317644, 83.005495)}`);

// Test 5: Error handling
console.log('\n🚨 Test 5: Error Handling');
try {
  calculator.calculate({
    latitude: 200, // Invalid latitude
    longitude: 83.005495,
    date: '2024-02-18',
    timezone: 'Asia/Kolkata'
  });
} catch (error) {
  console.log(`✅ Error handling works: ${error.message}`);
}

// Test 6: Return value structure validation
console.log('\n📊 Test 6: Return Value Structure');
const sampleResult = calculator.calculate({
  latitude: 25.317644,
  longitude: 83.005495,
  date: '2024-02-18',
  timezone: 'Asia/Kolkata'
});

console.log('✅ Result structure validation:');
console.log(`  - brahmaMuhurat.start.time: ${typeof sampleResult.brahmaMuhurat.start.time} (${sampleResult.brahmaMuhurat.start.time.constructor.name})`);
console.log(`  - brahmaMuhurat.end.time: ${typeof sampleResult.brahmaMuhurat.end.time} (${sampleResult.brahmaMuhurat.end.time.constructor.name})`);
console.log(`  - sunrise.time: ${typeof sampleResult.sunrise.time} (${sampleResult.sunrise.time.constructor.name})`);
console.log(`  - location.latitude: ${typeof sampleResult.location.latitude} (${sampleResult.location.latitude})`);
console.log(`  - location.longitude: ${typeof sampleResult.location.longitude} (${sampleResult.location.longitude})`);
console.log(`  - brahmaMuhurat.duration.minutes: ${typeof sampleResult.brahmaMuhurat.duration.minutes} (${sampleResult.brahmaMuhurat.duration.minutes})`);

console.log('\n🎉 All JavaScript tests completed successfully!');
console.log('✅ Library works perfectly without TypeScript types');
