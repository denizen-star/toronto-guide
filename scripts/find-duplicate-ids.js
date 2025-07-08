const fs = require('fs');
const Papa = require('papaparse');

const csvPath = 'public/data/amateur_sports_standardized.csv';
const csvData = fs.readFileSync(csvPath, 'utf8');

const { data } = Papa.parse(csvData, {
  header: true,
  delimiter: '|',
  skipEmptyLines: true
});

const idCounts = {};
data.forEach(row => {
  if (!row.id) return;
  idCounts[row.id] = (idCounts[row.id] || 0) + 1;
});

const duplicates = Object.entries(idCounts).filter(([id, count]) => count > 1);

if (duplicates.length === 0) {
  console.log('✅ No duplicate IDs found.');
} else {
  console.log('❗ Duplicate IDs found:');
  duplicates.forEach(([id, count]) => {
    console.log(`- ${id}: ${count} times`);
  });
} 