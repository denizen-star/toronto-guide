const fs = require('fs');
const Papa = require('papaparse');

// Read the amateur sports CSV
const csvPath = 'public/data/amateur_sports_standardized.csv';
const csvData = fs.readFileSync(csvPath, 'utf8');

// Parse the CSV
const { data } = Papa.parse(csvData, {
  header: true,
  delimiter: '|',
  skipEmptyLines: true
});

console.log('=== AMATEUR SPORTS DATA ANALYSIS ===\n');

// Get all column names
const columns = Object.keys(data[0] || {});
console.log(`Total columns: ${columns.length}`);
console.log(`Total records: ${data.length}\n`);

// Analyze each column
const columnAnalysis = {};

columns.forEach(column => {
  const values = data.map(row => row[column]);
  const nonEmptyValues = values.filter(val => val && String(val).trim() !== '');
  const emptyCount = values.length - nonEmptyValues.length;
  const completionRate = ((nonEmptyValues.length / values.length) * 100).toFixed(1);
  
  columnAnalysis[column] = {
    total: values.length,
    filled: nonEmptyValues.length,
    empty: emptyCount,
    completionRate: parseFloat(completionRate),
    uniqueValues: [...new Set(nonEmptyValues)].length,
    sampleValues: nonEmptyValues.slice(0, 3)
  };
});

// Sort columns by completion rate (lowest first)
const sortedColumns = Object.entries(columnAnalysis)
  .sort(([,a], [,b]) => a.completionRate - b.completionRate);

console.log('COLUMN ANALYSIS (sorted by completion rate):\n');

sortedColumns.forEach(([column, stats]) => {
  console.log(`${column}:`);
  console.log(`  Completion: ${stats.completionRate}% (${stats.filled}/${stats.total})`);
  console.log(`  Empty: ${stats.empty}`);
  console.log(`  Unique values: ${stats.uniqueValues}`);
  if (stats.sampleValues.length > 0) {
    console.log(`  Sample values: ${stats.sampleValues.join(', ')}`);
  }
  console.log('');
});

// Find completely filled records
const requiredFields = ['id', 'title', 'description', 'location', 'eventType', 'skillLevel'];
const completeRecords = data.filter(row => {
  return requiredFields.every(field => row[field] && String(row[field]).trim() !== '');
});

console.log('=== COMPLETENESS ANALYSIS ===\n');
console.log(`Records with all required fields: ${completeRecords.length}/${data.length} (${((completeRecords.length/data.length)*100).toFixed(1)}%)`);

// Find records missing specific important fields
const importantFields = ['image', 'website', 'googleMapLink', 'socialMedia', 'venueAccessibility'];
const missingImportantFields = data.filter(row => {
  return importantFields.some(field => !row[field] || String(row[field]).trim() === '');
});

console.log(`Records missing any important field: ${missingImportantFields.length}/${data.length} (${((missingImportantFields.length/data.length)*100).toFixed(1)}%)`);

// Show examples of incomplete records
console.log('\n=== EXAMPLES OF INCOMPLETE RECORDS ===\n');
const incompleteRecords = data.filter(row => {
  return requiredFields.some(field => !row[field] || String(row[field]).trim() === '');
}).slice(0, 3);

incompleteRecords.forEach((record, index) => {
  console.log(`Record ${index + 1} (ID: ${record.id}):`);
  requiredFields.forEach(field => {
    const value = record[field];
    const status = value && String(value).trim() !== '' ? '✓' : '✗';
    console.log(`  ${field}: ${status} ${value || 'MISSING'}`);
  });
  console.log('');
});

// Summary of most problematic fields
const problematicFields = sortedColumns
  .filter(([,stats]) => stats.completionRate < 50)
  .map(([column]) => column);

console.log('=== MOST PROBLEMATIC FIELDS (completion < 50%) ===\n');
problematicFields.forEach(field => {
  const stats = columnAnalysis[field];
  console.log(`${field}: ${stats.completionRate}% complete`);
});

console.log('\n=== RECOMMENDATIONS ===\n');
console.log('1. Focus on fields with lowest completion rates first');
console.log('2. Consider auto-generating values for missing fields');
console.log('3. Prioritize required fields (id, title, description, location, eventType, skillLevel)');
console.log('4. Use default values for optional fields like venueAccessibility, pronouns, ageRestriction'); 