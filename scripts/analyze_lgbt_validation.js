const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvPath = path.join(__dirname, '../public/data/lgbt_events_standardized.csv');
const csvContent = fs.readFileSync(csvPath, 'utf8');

// Parse CSV with pipe delimiter
const lines = csvContent.split('\n');
const headers = lines[0].split('|').map(h => h.trim());
const data = lines.slice(1).filter(line => line.trim());

console.log(`📊 Analyzing LGBTQ+ Events Validation\n`);
console.log(`Total lines in CSV: ${lines.length}`);
console.log(`Header line: 1`);
console.log(`Data lines: ${data.length}\n`);

const validEvents = [];
const invalidEvents = [];

// Process each data line
data.forEach((line, index) => {
  const values = line.split('|').map(v => v.trim());
  const event = {};
  
  // Create event object from CSV values
  headers.forEach((header, i) => {
    event[header] = values[i] || '';
  });

  // Apply the same validation logic as in dataLoader.ts
  const validationChecks = {
    hasId: !!event.id,
    hasTitle: !!event.title,
    hasDescription: !!event.description,
    hasLocation: !!event.location,
    hasEventType: !!event.eventType,
    validEventType: ['performance', 'social', 'community', 'nightlife'].includes(event.eventType?.toLowerCase())
  };

  const isValid = Object.values(validationChecks).every(check => check);

  if (isValid) {
    validEvents.push(event);
  } else {
    invalidEvents.push({
      event,
      lineNumber: index + 2, // +2 because we start from line 2 (after header)
      failedChecks: Object.entries(validationChecks)
        .filter(([key, value]) => !value)
        .map(([key]) => key)
    });
  }
});

console.log(`✅ Valid Events: ${validEvents.length}`);
console.log(`❌ Invalid Events: ${invalidEvents.length}\n`);

if (invalidEvents.length > 0) {
  console.log(`🔍 INVALID EVENTS DETAILS:\n`);
  
  invalidEvents.forEach(({ event, lineNumber, failedChecks }) => {
    console.log(`📄 Line ${lineNumber}:`);
    console.log(`   Title: "${event.title || 'MISSING'}"`);
    console.log(`   ID: "${event.id || 'MISSING'}"`);
    console.log(`   Event Type: "${event.eventType || 'MISSING'}"`);
    console.log(`   Location: "${event.location || 'MISSING'}"`);
    console.log(`   Description: "${(event.description || 'MISSING').substring(0, 50)}${(event.description || '').length > 50 ? '...' : ''}"`);
    console.log(`   ❌ Failed Checks: ${failedChecks.join(', ')}`);
    console.log('');
  });
}

// Summary statistics
console.log(`📈 VALIDATION SUMMARY:`);
console.log(`   Total Events: ${data.length}`);
console.log(`   Valid Events: ${validEvents.length} (${((validEvents.length / data.length) * 100).toFixed(1)}%)`);
console.log(`   Invalid Events: ${invalidEvents.length} (${((invalidEvents.length / data.length) * 100).toFixed(1)}%)`);

// Show event type distribution for valid events
const eventTypeCounts = {};
validEvents.forEach(event => {
  const type = event.eventType?.toLowerCase() || 'unknown';
  eventTypeCounts[type] = (eventTypeCounts[type] || 0) + 1;
});

console.log(`\n🎭 VALID EVENT TYPES:`);
Object.entries(eventTypeCounts).forEach(([type, count]) => {
  console.log(`   ${type}: ${count} events`);
});

// Show common failure reasons
const failureReasons = {};
invalidEvents.forEach(({ failedChecks }) => {
  failedChecks.forEach(check => {
    failureReasons[check] = (failureReasons[check] || 0) + 1;
  });
});

if (Object.keys(failureReasons).length > 0) {
  console.log(`\n🚫 COMMON FAILURE REASONS:`);
  Object.entries(failureReasons).forEach(([reason, count]) => {
    console.log(`   ${reason}: ${count} events`);
  });
} 