const fs = require('fs');
const Papa = require('papaparse');

// Read the amateur sports CSV
const csvPath = 'public/data/amateur_sports_standardized.csv';
const csvData = fs.readFileSync(csvPath, 'utf8');

console.log('=== FIXING CSV ISSUES ===\n');

// Parse the CSV with error handling
const { data, errors } = Papa.parse(csvData, {
  header: true,
  delimiter: '|',
  skipEmptyLines: true,
  transform: (value, field) => {
    // Remove the __parsed_extra field that's causing issues
    if (field === '__parsed_extra') {
      return undefined;
    }
    return value;
  }
});

console.log(`Parsed ${data.length} rows with ${errors.length} errors`);

// Define mappings outside the map function
const idMappings = {
  'as733291_outslopest': 'as038',
  'as733291_torontorai': 'as039',
  'as733291_downtownsw': 'as040',
  'as733291_muddyyorkr': 'as041',
  'as733291_frontrunne': 'as042',
  'as733291_rainbowhoo': 'as043',
  'as733291_torontotri': 'as044',
  'as733291_notsoamazo': 'as045',
  'as733291_triangleba': 'as046',
  'as733291_torontolgb': 'as047',
  'as733291_queersouth': 'as048',
  'as733291_lesbianout': 'as049',
  'as733291_torontodod': 'as050',
  'as733291_torontoque': 'as051',
  'as733291_outandoutt': 'as052',
  'as733291_the519comm': 'as053'
};

const dateMappings = {
  'September/October 2025': '2025-09-01',
  'Not required (Drop-in)': 'Not required',
  'Monthly registration': 'Check website',
  'Rolling admission': 'Check website',
  'Check website': 'Check website',
  'Not required': 'Not required'
};

// Fix the data issues
const fixedData = data.map((row, index) => {
  const fixedRow = { ...row };
  
  // Remove __parsed_extra field if it exists
  delete fixedRow.__parsed_extra;
  
  // Fix duplicate IDs - give unique IDs to duplicates
  if (fixedRow.id === 'as733291_torontogay') {
    if (index === 37) { // First occurrence
      fixedRow.id = 'as733291_torontogay';
    } else { // Second occurrence
      fixedRow.id = 'as733291_torontogay2';
    }
  }
  
  // Fix ID format for non-standard IDs
  
  if (idMappings[fixedRow.id]) {
    fixedRow.id = idMappings[fixedRow.id];
  }
  

  
  if (dateMappings[fixedRow.registrationDeadline]) {
    fixedRow.registrationDeadline = dateMappings[fixedRow.registrationDeadline];
  }
  
  // Fix URL formats - convert location names to proper Google Maps URLs
  if (fixedRow.googleMapLink && !fixedRow.googleMapLink.startsWith('http')) {
    if (fixedRow.googleMapLink === 'N/A' || fixedRow.googleMapLink === 'Not provided') {
      fixedRow.googleMapLink = '';
    } else {
      fixedRow.googleMapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fixedRow.googleMapLink)}`;
    }
  }
  
  // Fix lgbtqFriendly values to be consistent
  if (fixedRow.lgbtqFriendly) {
    const lgbtqValue = String(fixedRow.lgbtqFriendly).toLowerCase();
    if (lgbtqValue.includes('yes') || lgbtqValue.includes('explicitly')) {
      fixedRow.lgbtqFriendly = 'Yes';
    } else if (lgbtqValue.includes('no') || lgbtqValue.includes('general')) {
      fixedRow.lgbtqFriendly = 'No';
    } else if (lgbtqValue.includes('likely')) {
      fixedRow.lgbtqFriendly = 'Likely';
    } else {
      fixedRow.lgbtqFriendly = 'No';
    }
  }
  
  // Fix recurring field - set based on event type
  if (!fixedRow.recurring || fixedRow.recurring.trim() === '') {
    if (fixedRow.eventType === 'sports') {
      fixedRow.recurring = 'true';
    } else {
      fixedRow.recurring = 'false';
    }
  }
  
  // Fix socialMedia field - set to empty object if missing
  if (!fixedRow.socialMedia || fixedRow.socialMedia.trim() === '') {
    fixedRow.socialMedia = '{}';
  }
  
  // Fix venueAccessibility - set default if missing
  if (!fixedRow.venueAccessibility || fixedRow.venueAccessibility.trim() === '') {
    fixedRow.venueAccessibility = 'varies by location';
  }
  
  // Fix pronouns - set default if missing
  if (!fixedRow.pronouns || fixedRow.pronouns.trim() === '') {
    fixedRow.pronouns = 'all';
  }
  
  // Fix ageRestriction - set default if missing
  if (!fixedRow.ageRestriction || fixedRow.ageRestriction.trim() === '') {
    fixedRow.ageRestriction = '18+';
  }
  
  return fixedRow;
});

// Create the fixed CSV content
const header = [
  'id', 'title', 'description', 'image', 'location', 'eventType', 'skillLevel',
  'startDate', 'endDate', 'registrationDeadline', 'duration', 'activityDetails',
  'cost', 'website', 'travelTime', 'googleMapLink', 'lgbtqFriendly', 'tags',
  'lastUpdated', 'subcategory', 'socialMedia', 'recurring', 'venueAccessibility',
  'pronouns', 'ageRestriction'
].join('|');

const rows = fixedData.map(row => {
  return header.split('|').map(field => {
    const value = row[field] || '';
    // Escape pipe characters in values
    return String(value).replace(/\|/g, '\\|');
  }).join('|');
});

const fixedCsvContent = header + '\n' + rows.join('\n');

// Write the fixed CSV
const outputPath = 'public/data/amateur_sports_standardized_fixed.csv';
fs.writeFileSync(outputPath, fixedCsvContent);

console.log('✅ Fixed CSV issues:');
console.log(`   - Removed __parsed_extra column`);
console.log(`   - Fixed ${Object.keys(idMappings).length} invalid ID formats`);
console.log(`   - Fixed ${Object.keys(dateMappings).length} date format issues`);
console.log(`   - Standardized lgbtqFriendly values`);
console.log(`   - Added recurring values`);
console.log(`   - Fixed URL formats`);
console.log(`   - Added missing default values`);
console.log(`\n📁 Fixed file saved to: ${outputPath}`);

// Run integrity check on the fixed file
console.log('\n=== VERIFYING FIXES ===');
const fixedCsvData = fs.readFileSync(outputPath, 'utf8');
const { data: fixedParsedData, errors: fixedErrors } = Papa.parse(fixedCsvData, {
  header: true,
  delimiter: '|',
  skipEmptyLines: true
});

console.log(`✅ Fixed file parsing: ${fixedParsedData.length} rows, ${fixedErrors.length} errors`);

if (fixedErrors.length === 0) {
  console.log('🎉 All parsing issues resolved!');
} else {
  console.log('⚠️  Some parsing issues remain:');
  fixedErrors.forEach(error => {
    console.log(`   - Row ${error.row}: ${error.message}`);
  });
}

// Check for remaining issues
const duplicateIds = fixedParsedData.map(row => row.id).filter((id, index, arr) => arr.indexOf(id) !== index);
const invalidIds = fixedParsedData.map(row => row.id).filter(id => !/^as\d+$/.test(id));

console.log(`\n📊 Final check:`);
console.log(`   - Duplicate IDs: ${duplicateIds.length}`);
console.log(`   - Invalid ID formats: ${invalidIds.length}`);
console.log(`   - Total records: ${fixedParsedData.length}`);

if (duplicateIds.length === 0 && invalidIds.length === 0) {
  console.log('✅ All ID issues resolved!');
} else {
  console.log('⚠️  Some ID issues remain');
} 