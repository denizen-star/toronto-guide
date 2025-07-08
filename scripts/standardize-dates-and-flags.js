const fs = require('fs');
const Papa = require('papaparse');

// Function to standardize dates
function standardizeDate(dateString) {
  if (!dateString || dateString === 'Not required' || dateString === 'Check website' || dateString === 'N/A') {
    return dateString;
  }
  
  // Handle various date formats
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return dateString; // Return original if can't parse
  }
  
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
}

// Function to standardize timestamps
function standardizeTimestamp(timestampString) {
  if (!timestampString) {
    return timestampString;
  }
  
  const date = new Date(timestampString);
  if (isNaN(date.getTime())) {
    return timestampString; // Return original if can't parse
  }
  
  // Format as YYYY-MM-DDTHH:mm:ss-04:00 (Eastern Time)
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}-04:00`;
}

// Function to standardize boolean flags
function standardizeBoolean(value) {
  if (!value) return 'false';
  
  const str = String(value).toLowerCase();
  if (str === 'true' || str === 'yes' || str === '1') {
    return 'true';
  }
  return 'false';
}

// Process amateur sports CSV
console.log('=== Standardizing Amateur Sports CSV ===');
const amateurSportsPath = 'public/data/amateur_sports_standardized.csv';
const amateurSportsData = fs.readFileSync(amateurSportsPath, 'utf8');

const { data: amateurSports } = Papa.parse(amateurSportsData, {
  header: true,
  delimiter: '|',
  skipEmptyLines: true
});

const standardizedAmateurSports = amateurSports.map(row => {
  const standardized = { ...row };
  
  // Standardize dates
  standardized.startDate = standardizeDate(row.startDate);
  standardized.endDate = standardizeDate(row.endDate);
  standardized.registrationDeadline = standardizeDate(row.registrationDeadline);
  standardized.lastUpdated = standardizeTimestamp(row.lastUpdated);
  
  // Standardize boolean flags
  standardized.lgbtqFriendly = standardizeBoolean(row.lgbtqFriendly);
  standardized.recurring = standardizeBoolean(row.recurring);
  
  return standardized;
});

// Write standardized amateur sports CSV
const amateurSportsHeader = Object.keys(standardizedAmateurSports[0]).join('|');
const amateurSportsRows = standardizedAmateurSports.map(row => {
  return Object.values(row).map(value => String(value || '').replace(/\|/g, '\\|')).join('|');
});
const standardizedAmateurSportsContent = amateurSportsHeader + '\n' + amateurSportsRows.join('\n');

fs.writeFileSync(amateurSportsPath, standardizedAmateurSportsContent);
console.log(`✅ Standardized ${standardizedAmateurSports.length} amateur sports records`);

// Process LGBT events CSV
console.log('\n=== Standardizing LGBT Events CSV ===');
const lgbtEventsPath = 'public/data/lgbt_events_standardized.csv';
const lgbtEventsData = fs.readFileSync(lgbtEventsPath, 'utf8');

const { data: lgbtEvents } = Papa.parse(lgbtEventsData, {
  header: true,
  delimiter: '|',
  skipEmptyLines: true
});

const standardizedLgbtEvents = lgbtEvents.map(row => {
  const standardized = { ...row };
  
  // Standardize dates
  standardized.startDate = standardizeDate(row.startDate);
  standardized.endDate = standardizeDate(row.endDate);
  standardized.registrationDeadline = standardizeDate(row.registrationDeadline);
  standardized.lastUpdated = standardizeTimestamp(row.lastUpdated);
  
  // Standardize boolean flags
  standardized.lgbtqFriendly = standardizeBoolean(row.lgbtqFriendly);
  standardized.recurring = standardizeBoolean(row.recurring);
  
  return standardized;
});

// Write standardized LGBT events CSV
const lgbtEventsHeader = Object.keys(standardizedLgbtEvents[0]).join('|');
const lgbtEventsRows = standardizedLgbtEvents.map(row => {
  return Object.values(row).map(value => String(value || '').replace(/\|/g, '\\|')).join('|');
});
const standardizedLgbtEventsContent = lgbtEventsHeader + '\n' + lgbtEventsRows.join('\n');

fs.writeFileSync(lgbtEventsPath, standardizedLgbtEventsContent);
console.log(`✅ Standardized ${standardizedLgbtEvents.length} LGBT events records`);

console.log('\n=== Summary ===');
console.log('✅ Date format: YYYY-MM-DD (e.g., 2025-07-06)');
console.log('✅ Timestamp format: YYYY-MM-DDTHH:mm:ss-04:00 (e.g., 2025-07-06T09:55:00-04:00)');
console.log('✅ Boolean flags: true/false');
console.log('✅ Both CSV files updated successfully'); 