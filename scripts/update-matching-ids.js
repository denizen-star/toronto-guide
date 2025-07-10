const fs = require('fs');
const path = require('path');

// Load the matching results
const matchingResults = JSON.parse(fs.readFileSync(path.join(__dirname, '../daytrips_matching_results.json'), 'utf8'));

// Load the original files
const jsonData = JSON.parse(fs.readFileSync(path.join(__dirname, '../daytrips_data.json'), 'utf8'));
const csvData = fs.readFileSync(path.join(__dirname, '../public/data/day_trips_standardized.csv'), 'utf8');

// Parse CSV data
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

// Create a mapping of JSON IDs to matching IDs
const jsonToMatchingId = {};
matchingResults.matches.forEach(match => {
  jsonToMatchingId[match.jsonTrip.id] = match.matchingId;
});

// Create a mapping of CSV IDs to matching IDs
const csvToMatchingId = {};
matchingResults.matches.forEach(match => {
  csvToMatchingId[match.csvTrip.id] = match.matchingId;
});

// Update JSON file with matching IDs
const updateJsonWithMatchingIds = () => {
  console.log('🔄 Updating JSON file with matching IDs...');
  
  jsonData.daytrips.forEach(trip => {
    if (jsonToMatchingId[trip.id]) {
      trip.matchingId = jsonToMatchingId[trip.id];
      console.log(`✅ Added matching ID to JSON: ${trip.name} → ${trip.matchingId}`);
    } else {
      trip.matchingId = `${trip.id}_unmatched_${Date.now().toString().slice(-6)}`;
      console.log(`⚠️  Added unmatched ID to JSON: ${trip.name} → ${trip.matchingId}`);
    }
  });
  
  // Write updated JSON file
  const updatedJsonPath = path.join(__dirname, '../daytrips_data_with_matching_ids.json');
  fs.writeFileSync(updatedJsonPath, JSON.stringify(jsonData, null, 2));
  console.log(`💾 Updated JSON saved to: ${updatedJsonPath}`);
};

// Update CSV file with matching IDs
const updateCsvWithMatchingIds = () => {
  console.log('\n🔄 Updating CSV file with matching IDs...');
  
  // Add matchingId to headers if not present
  if (!headers.includes('matchingId')) {
    headers.push('matchingId');
  }
  
  const updatedCsvTrips = csvTrips.map(trip => {
    const updatedTrip = { ...trip };
    if (csvToMatchingId[trip.id]) {
      updatedTrip.matchingId = csvToMatchingId[trip.id];
      console.log(`✅ Added matching ID to CSV: ${trip.title} → ${updatedTrip.matchingId}`);
    } else {
      updatedTrip.matchingId = `${trip.id}_unmatched_${Date.now().toString().slice(-6)}`;
      console.log(`⚠️  Added unmatched ID to CSV: ${trip.title} → ${updatedTrip.matchingId}`);
    }
    return updatedTrip;
  });
  
  // Create updated CSV content
  const updatedCsvContent = [
    headers.join('|'),
    ...updatedCsvTrips.map(trip => 
      headers.map(header => trip[header] || '').join('|')
    )
  ].join('\n');
  
  // Write updated CSV file
  const updatedCsvPath = path.join(__dirname, '../public/data/day_trips_standardized_with_matching_ids.csv');
  fs.writeFileSync(updatedCsvPath, updatedCsvContent);
  console.log(`💾 Updated CSV saved to: ${updatedCsvPath}`);
};

// Create a comprehensive mapping file
const createMappingFile = () => {
  console.log('\n📋 Creating comprehensive mapping file...');
  
  const mapping = {
    summary: {
      totalMatches: matchingResults.summary.totalMatches,
      totalJsonTrips: matchingResults.summary.totalJsonTrips,
      totalCsvTrips: matchingResults.summary.totalCsvTrips,
      matchRate: matchingResults.summary.matchRate
    },
    matches: matchingResults.matches.map(match => ({
      matchingId: match.matchingId,
      jsonTrip: {
        id: match.jsonTrip.id,
        name: match.jsonTrip.name
      },
      csvTrip: {
        id: match.csvTrip.id,
        title: match.csvTrip.title
      },
      score: match.score
    })),
    unmatchedJson: matchingResults.unmatchedJson.map(trip => ({
      id: trip.id,
      name: trip.name,
      matchingId: `${trip.id}_unmatched_${Date.now().toString().slice(-6)}`
    })),
    unmatchedCsv: matchingResults.unmatchedCsv.map(trip => ({
      id: trip.id,
      title: trip.title,
      matchingId: `${trip.id}_unmatched_${Date.now().toString().slice(-6)}`
    }))
  };
  
  const mappingPath = path.join(__dirname, '../daytrips_complete_mapping.json');
  fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));
  console.log(`💾 Complete mapping saved to: ${mappingPath}`);
  
  return mapping;
};

// Create a lookup utility
const createLookupUtility = () => {
  console.log('\n🔧 Creating lookup utility...');
  
  const lookupCode = `// Day Trips Matching ID Lookup Utility
// Generated on ${new Date().toISOString()}

const dayTripsMatchingLookup = {
  // Match rate: ${matchingResults.summary.matchRate}%
  // Total matches: ${matchingResults.summary.totalMatches}
  
  // JSON ID to Matching ID mapping
  jsonToMatchingId: ${JSON.stringify(jsonToMatchingId, null, 2)},
  
  // CSV ID to Matching ID mapping  
  csvToMatchingId: ${JSON.stringify(csvToMatchingId, null, 2)},
  
  // Matching ID to both IDs mapping
  matchingIdToIds: ${JSON.stringify(
    matchingResults.matches.reduce((acc, match) => {
      acc[match.matchingId] = {
        jsonId: match.jsonTrip.id,
        csvId: match.csvTrip.id,
        jsonName: match.jsonTrip.name,
        csvTitle: match.csvTrip.title,
        score: match.score
      };
      return acc;
    }, {}),
    null,
    2
  )},
  
  // Utility functions
  getMatchingIdByJsonId: (jsonId) => dayTripsMatchingLookup.jsonToMatchingId[jsonId],
  getMatchingIdByCsvId: (csvId) => dayTripsMatchingLookup.csvToMatchingId[csvId],
  getIdsByMatchingId: (matchingId) => dayTripsMatchingLookup.matchingIdToIds[matchingId],
  
  // Check if IDs are matched
  isMatched: (jsonId, csvId) => {
    const matchingId = dayTripsMatchingLookup.jsonToMatchingId[jsonId];
    return matchingId && dayTripsMatchingLookup.matchingIdToIds[matchingId]?.csvId === csvId;
  },
  
  // Get all matching IDs
  getAllMatchingIds: () => Object.keys(dayTripsMatchingLookup.matchingIdToIds),
  
  // Get match statistics
  getStats: () => ({
    totalMatches: ${matchingResults.summary.totalMatches},
    totalJsonTrips: ${matchingResults.summary.totalJsonTrips},
    totalCsvTrips: ${matchingResults.summary.totalCsvTrips},
    matchRate: "${matchingResults.summary.matchRate}%"
  })
};

module.exports = dayTripsMatchingLookup;
`;

  const lookupPath = path.join(__dirname, '../daytrips_matching_lookup.js');
  fs.writeFileSync(lookupPath, lookupCode);
  console.log(`💾 Lookup utility saved to: ${lookupPath}`);
};

// Main execution
const main = () => {
  console.log('🚀 Starting matching ID update process...\n');
  
  try {
    updateJsonWithMatchingIds();
    updateCsvWithMatchingIds();
    const mapping = createMappingFile();
    createLookupUtility();
    
    console.log('\n✅ MATCHING ID UPDATE COMPLETE');
    console.log('================================');
    console.log(`📊 Match Rate: ${mapping.summary.matchRate}`);
    console.log(`✅ Successful Matches: ${mapping.summary.totalMatches}`);
    console.log(`📋 JSON Trips: ${mapping.summary.totalJsonTrips}`);
    console.log(`📄 CSV Trips: ${mapping.summary.totalCsvTrips}`);
    console.log(`❌ Unmatched JSON: ${mapping.unmatchedJson.length}`);
    console.log(`❌ Unmatched CSV: ${mapping.unmatchedCsv.length}`);
    
    console.log('\n📁 Generated Files:');
    console.log('- daytrips_data_with_matching_ids.json (Updated JSON with matching IDs)');
    console.log('- public/data/day_trips_standardized_with_matching_ids.csv (Updated CSV with matching IDs)');
    console.log('- daytrips_complete_mapping.json (Complete mapping data)');
    console.log('- daytrips_matching_lookup.js (JavaScript lookup utility)');
    
  } catch (error) {
    console.error('❌ Error during matching ID update:', error);
  }
};

// Run the main function
main();

module.exports = { 
  updateJsonWithMatchingIds, 
  updateCsvWithMatchingIds, 
  createMappingFile, 
  createLookupUtility 
}; 