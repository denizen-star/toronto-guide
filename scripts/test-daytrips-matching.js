const fs = require('fs');
const path = require('path');

// Test the matching system
async function testMatchingSystem() {
  try {
    console.log('🧪 Testing Day Trips Matching System...\n');

    // Load the matching results
    const matchingResults = JSON.parse(fs.readFileSync(path.join(__dirname, '../daytrips_matching_results.json'), 'utf8'));
    
    // Load the JSON data with matching IDs
    const jsonData = JSON.parse(fs.readFileSync(path.join(__dirname, '../daytrips_data_with_matching_ids.json'), 'utf8'));
    
    // Load the cleaned CSV data
    const csvData = fs.readFileSync(path.join(__dirname, '../public/data/day_trips_standardized.csv'), 'utf8');
    const csvLines = csvData.split('\n');
    const headers = csvLines[0].split('|');
    const csvTrips = csvLines.slice(1).map(line => {
      const values = line.split('|');
      const trip = {};
      headers.forEach((header, index) => {
        trip[header] = values[index];
      });
      return trip;
    }).filter(trip => trip.id && trip.title);

    console.log('📊 System Statistics:');
    console.log(`- JSON trips with matching IDs: ${jsonData.daytrips.length}`);
    console.log(`- CSV trips after cleaning: ${csvTrips.length}`);
    console.log(`- Successful matches: ${matchingResults.matches.length}`);
    console.log(`- Match rate: ${((matchingResults.matches.length / jsonData.daytrips.length) * 100).toFixed(1)}%\n`);

    // Test a few specific matches
    console.log('🔍 Testing Specific Matches:');
    
    const testMatches = matchingResults.matches.slice(0, 3);
    testMatches.forEach((match, index) => {
      console.log(`\n${index + 1}. Match ID: ${match.matchingId}`);
      console.log(`   JSON: ${match.jsonTrip.name}`);
      console.log(`   CSV: ${match.csvTrip.title}`);
      console.log(`   Confidence: ${match.confidence}%`);
    });

    // Test the lookup functionality
    console.log('\n🔍 Testing Lookup Functionality:');
    const lookup = require('../daytrips_matching_lookup.js');
    const stats = lookup.getStats();
    console.log(`- Total mappings: ${stats.totalMappings}`);
    console.log(`- JSON trips: ${stats.jsonTrips}`);
    console.log(`- CSV trips: ${stats.csvTrips}`);

    // Test a specific lookup
    if (testMatches.length > 0) {
      const testMatch = testMatches[0];
      const lookupResult = lookup.getIdsByMatchingId(testMatch.matchingId);
      console.log(`\n📋 Sample Lookup for "${testMatch.matchingId}":`);
      console.log(`   JSON ID: ${lookupResult.jsonId}`);
      console.log(`   CSV ID: ${lookupResult.csvId}`);
    }

    console.log('\n✅ Matching system test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing matching system:', error);
  }
}

testMatchingSystem(); 