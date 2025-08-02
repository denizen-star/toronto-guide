const fs = require('fs');
const Papa = require('papaparse');

// Load CSV data
const csvData = fs.readFileSync('public/data/day_trips_standardized.csv', 'utf8');
const { data: csvRows } = Papa.parse(csvData, {
  header: true,
  delimiter: '|',
  skipEmptyLines: true
});

// Load JSON data
const jsonData = JSON.parse(fs.readFileSync('public/daytrips_data.json', 'utf8'));

// Create a map of CSV data by trip name for easy lookup
const csvMap = new Map();
csvRows.forEach(row => {
  if (row.title) {
    csvMap.set(row.title.toLowerCase().trim(), row);
  }
});

// Merge CSV fields into JSON
jsonData.daytrips.forEach(trip => {
  const tripName = trip.name.toLowerCase().trim();
  const csvRow = csvMap.get(tripName);
  
  if (csvRow) {
    console.log(`Merging data for: ${trip.name}`);
    
    // Add CSV fields to appropriate locations in JSON
    
    // Top-level trip information
    trip.description = csvRow.description || trip.description;
    trip.type = csvRow.type || '';
    trip.duration = csvRow.duration || '';
    trip.activityDetails = csvRow.activityDetails || '';
    trip.cost = csvRow.cost || '';
    trip.travelTime = csvRow.travelTime || '';
    trip.lgbtqFriendly = csvRow.lgbtqFriendly === 'Yes' || csvRow.lgbtqFriendly === 'true' || false;
    trip.lastUpdated = csvRow.lastUpdated || '';
    
    // Parse and add tags
    if (csvRow.tags) {
      trip.tags = csvRow.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }
    
    // Add to contact object if it exists, otherwise create it
    if (!trip.contact) {
      trip.contact = {};
    }
    
    // Add website to contact if not already there
    if (csvRow.website && !trip.contact.website) {
      trip.contact.website = csvRow.website;
    }
    
    // Add Google Maps link to contact
    if (csvRow.googleMapLink && csvRow.googleMapLink !== 'N/A') {
      trip.contact.googleMapLink = csvRow.googleMapLink;
    }
    
  } else {
    console.log(`No CSV match found for: ${trip.name}`);
  }
});

// Write the enhanced JSON back to file
fs.writeFileSync('public/daytrips_data_enhanced.json', JSON.stringify(jsonData, null, 2));
console.log('Enhanced JSON saved to daytrips_data_enhanced.json');

// Summary
const totalTrips = jsonData.daytrips.length;
const matchedTrips = jsonData.daytrips.filter(trip => trip.type).length;
console.log(`\nSummary:`);
console.log(`Total trips in JSON: ${totalTrips}`);
console.log(`Trips enhanced with CSV data: ${matchedTrips}`);
console.log(`Trips without CSV match: ${totalTrips - matchedTrips}`); 