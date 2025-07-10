const fs = require('fs');
const path = require('path');

// Load the matching results to identify matched entries
const matchingResults = JSON.parse(fs.readFileSync(path.join(__dirname, '../daytrips_matching_results.json'), 'utf8'));

// Load the CSV data
const csvData = fs.readFileSync(path.join(__dirname, '../public/data/day_trips_standardized_with_matching_ids.csv'), 'utf8');

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

// Get all matched CSV IDs
const matchedCsvIds = new Set();
matchingResults.matches.forEach(match => {
  matchedCsvIds.add(match.csvTrip.id);
});

console.log('🔍 Cleaning unmatched entries from CSV...');
console.log(`📊 Total CSV entries: ${csvTrips.length}`);
console.log(`✅ Matched entries: ${matchedCsvIds.size}`);
console.log(`❌ Unmatched entries to remove: ${csvTrips.length - matchedCsvIds.size}`);

// Filter to keep only matched entries
const matchedCsvTrips = csvTrips.filter(trip => matchedCsvIds.has(trip.id));

console.log(`\n📋 Keeping ${matchedCsvTrips.length} matched entries:`);
matchedCsvTrips.forEach(trip => {
  console.log(`✅ ${trip.title} (ID: ${trip.id})`);
});

// Create cleaned CSV content
const cleanedCsvContent = [
  headers.join('|'),
  ...matchedCsvTrips.map(trip => 
    headers.map(header => trip[header] || '').join('|')
  )
].join('\n');

// Write cleaned CSV file
const cleanedCsvPath = path.join(__dirname, '../public/data/day_trips_standardized_cleaned.csv');
fs.writeFileSync(cleanedCsvPath, cleanedCsvContent);

console.log(`\n💾 Cleaned CSV saved to: ${cleanedCsvPath}`);
console.log(`📊 Final count: ${matchedCsvTrips.length} entries`);

// Create a summary report
const summary = {
  originalCount: csvTrips.length,
  matchedCount: matchedCsvTrips.length,
  removedCount: csvTrips.length - matchedCsvTrips.length,
  keptEntries: matchedCsvTrips.map(trip => ({
    id: trip.id,
    title: trip.title,
    matchingId: trip.matchingId
  }))
};

const summaryPath = path.join(__dirname, '../csv_cleaning_summary.json');
fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

console.log(`📋 Summary report saved to: ${summaryPath}`);

// Also update the original CSV file (backup first)
const originalCsvPath = path.join(__dirname, '../public/data/day_trips_standardized.csv');
const backupPath = path.join(__dirname, '../public/data/day_trips_standardized_backup.csv');

// Create backup
fs.copyFileSync(originalCsvPath, backupPath);
console.log(`💾 Backup created: ${backupPath}`);

// Update original CSV with cleaned data (without matchingId column)
const cleanedHeaders = headers.filter(header => header !== 'matchingId');
const cleanedCsvContentOriginal = [
  cleanedHeaders.join('|'),
  ...matchedCsvTrips.map(trip => 
    cleanedHeaders.map(header => trip[header] || '').join('|')
  )
].join('\n');

fs.writeFileSync(originalCsvPath, cleanedCsvContentOriginal);
console.log(`✅ Original CSV updated: ${originalCsvPath}`);

console.log('\n🎯 CLEANING COMPLETE');
console.log('==================');
console.log(`📊 Original entries: ${csvTrips.length}`);
console.log(`✅ Kept entries: ${matchedCsvTrips.length}`);
console.log(`❌ Removed entries: ${csvTrips.length - matchedCsvTrips.length}`);
console.log(`📈 Cleanup rate: ${((csvTrips.length - matchedCsvTrips.length) / csvTrips.length * 100).toFixed(1)}%`);

module.exports = { matchedCsvTrips, summary }; 