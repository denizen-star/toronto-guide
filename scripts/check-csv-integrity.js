const fs = require('fs');
const Papa = require('papaparse');

// Read the amateur sports CSV
const csvPath = 'public/data/amateur_sports_standardized.csv';
const csvData = fs.readFileSync(csvPath, 'utf8');

console.log('=== CSV INTEGRITY CHECK ===\n');

// Check file basics
console.log('1. FILE BASICS:');
console.log(`   File size: ${(csvData.length / 1024).toFixed(2)} KB`);
console.log(`   Total lines: ${csvData.split('\n').length}`);
console.log(`   Empty lines: ${csvData.split('\n').filter(line => line.trim() === '').length}`);
console.log('');

// Parse the CSV
const { data, meta, errors } = Papa.parse(csvData, {
  header: true,
  delimiter: '|',
  skipEmptyLines: true
});

console.log('2. PARSING RESULTS:');
console.log(`   Successfully parsed rows: ${data.length}`);
console.log(`   Parsing errors: ${errors.length}`);
if (errors.length > 0) {
  console.log('   Error details:');
  errors.forEach((error, index) => {
    console.log(`     Error ${index + 1}: Row ${error.row}, Message: ${error.message}`);
  });
}
console.log('');

// Check column structure
console.log('3. COLUMN STRUCTURE:');
const expectedColumns = [
  'id', 'title', 'description', 'image', 'location', 'eventType', 'skillLevel',
  'startDate', 'endDate', 'registrationDeadline', 'duration', 'activityDetails',
  'cost', 'website', 'travelTime', 'googleMapLink', 'lgbtqFriendly', 'tags',
  'lastUpdated', 'subcategory', 'socialMedia', 'recurring', 'venueAccessibility',
  'pronouns', 'ageRestriction'
];

const actualColumns = Object.keys(data[0] || {});
console.log(`   Expected columns: ${expectedColumns.length}`);
console.log(`   Actual columns: ${actualColumns.length}`);

// Check for missing columns
const missingColumns = expectedColumns.filter(col => !actualColumns.includes(col));
const extraColumns = actualColumns.filter(col => !expectedColumns.includes(col));

if (missingColumns.length > 0) {
  console.log(`   Missing columns: ${missingColumns.join(', ')}`);
}
if (extraColumns.length > 0) {
  console.log(`   Extra columns: ${extraColumns.join(', ')}`);
}
console.log('');

// Check data quality
console.log('4. DATA QUALITY CHECKS:');

// Check for duplicate IDs
const ids = data.map(row => row.id).filter(id => id);
const uniqueIds = [...new Set(ids)];
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
console.log(`   Total IDs: ${ids.length}`);
console.log(`   Unique IDs: ${uniqueIds.length}`);
if (duplicateIds.length > 0) {
  console.log(`   Duplicate IDs: ${duplicateIds.join(', ')}`);
}

// Check ID format consistency
const idPattern = /^as\d+$/;
const invalidIds = ids.filter(id => !idPattern.test(id));
if (invalidIds.length > 0) {
  console.log(`   Invalid ID format: ${invalidIds.join(', ')}`);
}

// Check for empty required fields
const requiredFields = ['id', 'title', 'description', 'location', 'eventType', 'skillLevel'];
const emptyRequiredFields = data.filter(row => {
  return requiredFields.some(field => !row[field] || String(row[field]).trim() === '');
});

console.log(`   Rows with empty required fields: ${emptyRequiredFields.length}`);
if (emptyRequiredFields.length > 0) {
  console.log('   Rows with issues:');
  emptyRequiredFields.slice(0, 5).forEach((row, index) => {
    console.log(`     Row ${index + 1} (ID: ${row.id}):`);
    requiredFields.forEach(field => {
      const value = row[field];
      const status = value && String(value).trim() !== '' ? '✓' : '✗';
      console.log(`       ${field}: ${status} ${value || 'MISSING'}`);
    });
  });
  if (emptyRequiredFields.length > 5) {
    console.log(`     ... and ${emptyRequiredFields.length - 5} more rows`);
  }
}

// Check date format consistency
const dateFields = ['startDate', 'endDate', 'registrationDeadline', 'lastUpdated'];
const invalidDates = [];
data.forEach((row, index) => {
  dateFields.forEach(field => {
    if (row[field] && row[field] !== 'Not required' && row[field] !== 'Check website') {
      const dateValue = String(row[field]);
      // Check if it's a valid date format (YYYY-MM-DD or similar)
      const datePattern = /^\d{4}-\d{2}-\d{2}/;
      if (!datePattern.test(dateValue) && !dateValue.includes('T')) {
        invalidDates.push({ row: index + 1, field, value: dateValue });
      }
    }
  });
});

if (invalidDates.length > 0) {
  console.log(`   Invalid date formats: ${invalidDates.length} found`);
  invalidDates.slice(0, 5).forEach(({ row, field, value }) => {
    console.log(`     Row ${row}, ${field}: "${value}"`);
  });
}

// Check URL format consistency
const urlFields = ['website', 'googleMapLink'];
const invalidUrls = [];
data.forEach((row, index) => {
  urlFields.forEach(field => {
    if (row[field] && row[field] !== 'N/A' && row[field] !== 'Not provided') {
      const urlValue = String(row[field]);
      if (!urlValue.startsWith('http') && !urlValue.startsWith('https')) {
        invalidUrls.push({ row: index + 1, field, value: urlValue });
      }
    }
  });
});

if (invalidUrls.length > 0) {
  console.log(`   Invalid URL formats: ${invalidUrls.length} found`);
  invalidUrls.slice(0, 5).forEach(({ row, field, value }) => {
    console.log(`     Row ${row}, ${field}: "${value}"`);
  });
}

// Check for inconsistent delimiters
const delimiterIssues = [];
data.forEach((row, index) => {
  Object.entries(row).forEach(([field, value]) => {
    if (value && String(value).includes('|')) {
      delimiterIssues.push({ row: index + 1, field, value: String(value) });
    }
  });
});

if (delimiterIssues.length > 0) {
  console.log(`   Values containing pipe delimiter: ${delimiterIssues.length} found`);
  delimiterIssues.slice(0, 3).forEach(({ row, field, value }) => {
    console.log(`     Row ${row}, ${field}: "${value}"`);
  });
}

console.log('');

// Check data consistency
console.log('5. DATA CONSISTENCY:');

// Check eventType values
const eventTypes = [...new Set(data.map(row => row.eventType).filter(Boolean))];
console.log(`   Event types found: ${eventTypes.join(', ')}`);

// Check skillLevel values
const skillLevels = [...new Set(data.map(row => row.skillLevel).filter(Boolean))];
console.log(`   Skill levels found: ${skillLevels.join(', ')}`);

// Check lgbtqFriendly values
const lgbtqValues = [...new Set(data.map(row => row.lgbtqFriendly).filter(Boolean))];
console.log(`   LGBTQ+ friendly values: ${lgbtqValues.join(', ')}`);

// Check for inconsistent boolean values
const booleanFields = ['lgbtqFriendly', 'recurring'];
booleanFields.forEach(field => {
  const values = [...new Set(data.map(row => row[field]).filter(Boolean))];
  console.log(`   ${field} values: ${values.join(', ')}`);
});

console.log('');

// Summary
console.log('6. INTEGRITY SUMMARY:');
const totalIssues = errors.length + missingColumns.length + extraColumns.length + 
                   duplicateIds.length + invalidIds.length + emptyRequiredFields.length +
                   invalidDates.length + invalidUrls.length + delimiterIssues.length;

if (totalIssues === 0) {
  console.log('   ✅ CSV file appears to be clean and well-formatted!');
} else {
  console.log(`   ⚠️  Found ${totalIssues} potential issues that should be reviewed.`);
}

console.log(`   📊 Total records: ${data.length}`);
console.log(`   📊 Data completeness: ${((data.length - emptyRequiredFields.length) / data.length * 100).toFixed(1)}%`); 