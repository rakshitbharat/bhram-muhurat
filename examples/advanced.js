/**
 * Advanced example demonstrating sophisticated features of Brahma Muhurat Calculator
 */

const BrahmaMuhuratCalculator = require('../src/index');
const moment = require('moment-timezone');

console.log('🕉️  Brahma Muhurat Calculator - Advanced Example\n');

// Example 1: Batch Calculations for Multiple Dates
console.log('📅 Batch Calculations - 7 Day Forecast\n');

const calculator = new BrahmaMuhuratCalculator({
  precision: 'maximum',
  traditionType: 'standard'
});

const location = {
  latitude: 25.317644,
  longitude: 83.005495,
  timezone: 'Asia/Kolkata'
};

// Generate dates for next 7 days
const dates = [];
for (let i = 0; i < 7; i++) {
  const date = moment().add(i, 'days').format('YYYY-MM-DD');
  dates.push(date);
}

try {
  const batchResults = calculator.calculateBatch(location, dates);
  
  console.log('📊 7-Day Brahma Muhurat Schedule:\n');
  batchResults.forEach((result, index) => {
    if (result.error) {
      console.log(`Day ${index + 1}: Error - ${result.error}`);
      return;
    }

    const dayName = moment(result.date).format('dddd');
    const dateStr = moment(result.date).format('MMM DD, YYYY');
    
    console.log(`${dayName}, ${dateStr}:`);
    console.log(`   Brahma Muhurat: ${result.brahmaMuhurat.start.localTime} - ${result.brahmaMuhurat.end.localTime}`);
    console.log(`   Sunrise: ${result.sunrise.localTime}`);
    console.log(`   Day Length: ${result.astronomicalData.dayLength.dayFormatted}`);
    console.log(`   Moon Phase: ${result.spiritualMetrics.moonPhase.phase}`);
    console.log();
  });

} catch (error) {
  console.error('❌ Batch calculation error:', error.message);
}

// Example 2: Precision Comparison
console.log('='.repeat(70));
console.log('🎯 Precision Level Comparison\n');

const precisionLevels = ['basic', 'high', 'maximum'];
const testDate = moment().format('YYYY-MM-DD');

console.log(`Comparing precision levels for ${testDate}:\n`);

precisionLevels.forEach(precision => {
  const calc = new BrahmaMuhuratCalculator({ precision });
  
  try {
    const startTime = Date.now();
    const result = calc.calculate({
      ...location,
      date: testDate
    });
    const endTime = Date.now();
    
    const precisionInfo = calc.getPrecisionInfo();
    
    console.log(`${precision.toUpperCase()} Precision:`);
    console.log(`   Accuracy: ${precisionInfo.accuracy}`);
    console.log(`   Brahma Muhurat Start: ${result.brahmaMuhurat.start.localTime}`);
    console.log(`   Sunrise: ${result.sunrise.localTime}`);
    console.log(`   Calculation Time: ${endTime - startTime}ms`);
    console.log(`   Description: ${precisionInfo.description}\n`);

  } catch (error) {
    console.log(`❌ ${precision}: ${error.message}\n`);
  }
});

// Example 3: Refraction Model Comparison
console.log('='.repeat(70));
console.log('🌈 Atmospheric Refraction Model Comparison\n');

const refractionModels = ['bennett', 'saemundsson', 'rigorous'];
const atmosphericConditions = {
  pressure: 1013.25,
  temperature: 15,
  humidity: 0.5
};

console.log('Refraction at horizon (0° altitude):\n');

refractionModels.forEach(model => {
  const calc = new BrahmaMuhuratCalculator({ refractionModel: model });
  
  try {
    const refractionResult = calc.calculateRefraction({
      altitude: 0,
      ...atmosphericConditions
    });
    
    const modelInfo = calc.getRefractionInfo();
    
    console.log(`${model.toUpperCase()} Model:`);
    console.log(`   Refraction: ${refractionResult.refraction.arcminutes.toFixed(2)} arcminutes`);
    console.log(`   Accuracy: ${modelInfo.accuracy}`);
    console.log(`   Description: ${modelInfo.description}\n`);

  } catch (error) {
    console.log(`❌ ${model}: ${error.message}\n`);
  }
});

// Example 4: Seasonal Analysis
console.log('='.repeat(70));
console.log('🌸 Seasonal Variation Analysis\n');

const seasonalDates = [
  { name: 'Winter Solstice', date: '2024-12-21' },
  { name: 'Spring Equinox', date: '2024-03-20' },
  { name: 'Summer Solstice', date: '2024-06-21' },
  { name: 'Autumn Equinox', date: '2024-09-22' }
];

console.log('Seasonal variations in Brahma Muhurat:\n');

seasonalDates.forEach(season => {
  try {
    const result = calculator.calculate({
      ...location,
      date: season.date
    });

    console.log(`${season.name} (${season.date}):`);
    console.log(`   Brahma Muhurat: ${result.brahmaMuhurat.start.localTime} - ${result.brahmaMuhurat.end.localTime}`);
    console.log(`   Sunrise: ${result.sunrise.localTime}`);
    console.log(`   Day Length: ${result.astronomicalData.dayLength.dayFormatted}`);
    console.log(`   Night Length: ${result.astronomicalData.dayLength.nightFormatted}`);
    console.log(`   Seasonal Factor: ${result.spiritualMetrics.seasonalFactor.factor}`);
    console.log(`   ${result.spiritualMetrics.seasonalFactor.description}\n`);

  } catch (error) {
    console.log(`❌ ${season.name}: ${error.message}\n`);
  }
});

// Example 5: Global Locations at Same Time
console.log('='.repeat(70));
console.log('🌍 Global Brahma Muhurat Times (Same Date)\n');

const globalLocations = [
  { name: 'Varanasi, India', lat: 25.317644, lon: 83.005495, tz: 'Asia/Kolkata' },
  { name: 'Mecca, Saudi Arabia', lat: 21.4225, lon: 39.8262, tz: 'Asia/Riyadh' },
  { name: 'Kathmandu, Nepal', lat: 27.7172, lon: 85.3240, tz: 'Asia/Kathmandu' },
  { name: 'Rishikesh, India', lat: 30.0869, lon: 78.2676, tz: 'Asia/Kolkata' },
  { name: 'Bodh Gaya, India', lat: 24.6958, lon: 84.9916, tz: 'Asia/Kolkata' },
  { name: 'Dharamshala, India', lat: 32.2190, lon: 76.3234, tz: 'Asia/Kolkata' }
];

const globalDate = moment().format('YYYY-MM-DD');
console.log(`Sacred locations for ${globalDate}:\n`);

globalLocations.forEach(place => {
  try {
    const result = calculator.calculate({
      latitude: place.lat,
      longitude: place.lon,
      date: globalDate,
      timezone: place.tz
    });

    console.log(`${place.name}:`);
    console.log(`   Local Time: ${moment().tz(place.tz).format('HH:mm:ss z')}`);
    console.log(`   Brahma Muhurat: ${result.brahmaMuhurat.start.localTime} - ${result.brahmaMuhurat.end.localTime}`);
    console.log(`   Sunrise: ${result.sunrise.localTime}`);
    
    // Convert to UTC for comparison
    const utcStart = moment.tz(result.brahmaMuhurat.start.time, place.tz).utc().format('HH:mm:ss');
    console.log(`   Brahma Muhurat (UTC): ${utcStart}`);
    console.log();

  } catch (error) {
    console.log(`❌ ${place.name}: ${error.message}\n`);
  }
});

// Example 6: High Altitude Locations
console.log('='.repeat(70));
console.log('🏔️  High Altitude Location Analysis\n');

const mountainLocations = [
  { name: 'Mount Kailash, Tibet', lat: 31.0686, lon: 81.3111, elevation: 6638, tz: 'Asia/Shanghai' },
  { name: 'Everest Base Camp', lat: 27.9881, lon: 86.9250, elevation: 5364, tz: 'Asia/Kathmandu' },
  { name: 'Leh, Ladakh', lat: 34.1526, lon: 77.5770, elevation: 3524, tz: 'Asia/Kolkata' },
  { name: 'Manali, India', lat: 32.2432, lon: 77.1892, elevation: 2050, tz: 'Asia/Kolkata' }
];

console.log('High altitude corrections:\n');

mountainLocations.forEach(mountain => {
  try {
    const result = calculator.calculate({
      latitude: mountain.lat,
      longitude: mountain.lon,
      elevation: mountain.elevation,
      date: globalDate,
      timezone: mountain.tz,
      pressure: 1013.25 - (mountain.elevation * 0.012), // Estimate pressure
      temperature: 15 - (mountain.elevation * 0.006) // Estimate temperature
    });

    console.log(`${mountain.name} (${mountain.elevation}m):`);
    console.log(`   Estimated Pressure: ${(1013.25 - (mountain.elevation * 0.012)).toFixed(1)} mbar`);
    console.log(`   Estimated Temperature: ${(15 - (mountain.elevation * 0.006)).toFixed(1)}°C`);
    console.log(`   Brahma Muhurat: ${result.brahmaMuhurat.start.localTime} - ${result.brahmaMuhurat.end.localTime}`);
    console.log(`   Sunrise: ${result.sunrise.localTime}\n`);

  } catch (error) {
    console.log(`❌ ${mountain.name}: ${error.message}\n`);
  }
});

// Example 7: Astronomical Data Analysis
console.log('='.repeat(70));
console.log('🌌 Comprehensive Astronomical Analysis\n');

try {
  const astronomicalData = calculator.getAstronomicalData({
    ...location,
    date: globalDate
  });

  console.log('Twilight Times:');
  Object.entries(astronomicalData.twilight).forEach(([key, time]) => {
    if (time) {
      const localTime = moment(time).tz(location.timezone).format('HH:mm:ss');
      console.log(`   ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}: ${localTime}`);
    }
  });

  console.log('\nDay/Night Information:');
  console.log(`   Day Length: ${astronomicalData.dayLength.dayFormatted}`);
  console.log(`   Night Length: ${astronomicalData.dayLength.nightFormatted}`);

  console.log('\nSolar Position:');
  console.log(`   Azimuth: ${astronomicalData.solarPosition.azimuth?.toFixed(2)}°`);
  console.log(`   Elevation: ${astronomicalData.solarPosition.elevation?.toFixed(2)}°`);

} catch (error) {
  console.error('❌ Astronomical data error:', error.message);
}

// Example 8: Library Information
console.log('\n' + '='.repeat(70));
console.log('ℹ️  Library Information\n');

const libraryInfo = BrahmaMuhuratCalculator.getLibraryInfo();
console.log(`Library: ${libraryInfo.name} v${libraryInfo.version}`);
console.log(`Description: ${libraryInfo.description}`);
console.log(`License: ${libraryInfo.license}`);
console.log(`Supported Precision Levels: ${libraryInfo.supportedPrecisionLevels.join(', ')}`);
console.log(`Supported Traditions: ${libraryInfo.supportedTraditions.join(', ')}`);
console.log(`Supported Refraction Models: ${libraryInfo.supportedRefractionModels.join(', ')}`);

console.log('\n✅ Advanced example completed!');
console.log('🔮 This demonstrates the full power of the Brahma Muhurat Calculator');
console.log('🙏 May your spiritual practice be blessed with perfect timing!');
