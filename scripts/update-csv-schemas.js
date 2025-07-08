const fs = require('fs');
const Papa = require('papaparse');

// Function to determine recurrence type and pattern based on existing data
function determineRecurrenceInfo(row) {
  const title = (row.title || '').toLowerCase();
  const description = (row.description || '').toLowerCase();
  const duration = (row.duration || '').toLowerCase();
  const recurring = row.recurring === 'true';
  
  // Check for specific patterns in the data
  if (title.includes('weekly') || description.includes('weekly') || duration.includes('weekly')) {
    return {
      recurrenceType: 'recurring',
      recurrencePattern: 'Weekly',
      specificDates: ''
    };
  }
  
  if (title.includes('monthly') || description.includes('monthly') || duration.includes('monthly')) {
    return {
      recurrenceType: 'recurring',
      recurrencePattern: 'Monthly',
      specificDates: ''
    };
  }
  
  if (title.includes('daily') || description.includes('daily') || duration.includes('daily')) {
    return {
      recurrenceType: 'recurring',
      recurrencePattern: 'Daily',
      specificDates: ''
    };
  }
  
  if (title.includes('annual') || description.includes('annual') || title.includes('annual')) {
    return {
      recurrenceType: 'recurring',
      recurrencePattern: 'Annual',
      specificDates: ''
    };
  }
  
  if (title.includes('seasonal') || description.includes('seasonal') || duration.includes('seasonal')) {
    return {
      recurrenceType: 'recurring',
      recurrencePattern: 'Seasonal',
      specificDates: ''
    };
  }
  
  // Check if it's a one-time event
  if (row.startDate && row.endDate && row.startDate === row.endDate) {
    return {
      recurrenceType: 'one-time',
      recurrencePattern: '',
      specificDates: ''
    };
  }
  
  // Default based on recurring flag
  if (recurring) {
    return {
      recurrenceType: 'recurring',
      recurrencePattern: 'Varies - check details',
      specificDates: ''
    };
  }
  
  return {
    recurrenceType: 'one-time',
    recurrencePattern: '',
    specificDates: ''
  };
}

// Add new fields to each row if not present
function addNewRecurrenceFields(row) {
  // Try to infer daysOfWeek and time from description or recurrencePattern
  let daysOfWeek = row.daysOfWeek || '';
  let time = row.time || '';
  let weekOfMonth = row.weekOfMonth || '';
  let specificDates = row.specificDates || '';
  
  // Try to extract days and time from recurrencePattern or description
  const pattern = row.recurrencePattern || row.description || '';
  const dayRegex = /(sunday|monday|tuesday|wednesday|thursday|friday|saturday)s?/i;
  const daysRegex = /((?:sundays?|mondays?|tuesdays?|wednesdays?|thursdays?|fridays?|saturdays?)(?:,? ?(?:and)? ?)+)/i;
  const timeRegex = /(\d{1,2}:\d{2}\s?(?:AM|PM|am|pm)?)/;
  const weekOfMonthRegex = /(first|second|third|fourth|last)/i;

  // Days of week
  let daysMatch = pattern.match(daysRegex);
  if (daysMatch) {
    daysOfWeek = daysMatch[0].replace(/and/gi, ',').replace(/s/g, '').replace(/\s+/g, '').split(',').map(d => d.charAt(0).toUpperCase() + d.slice(1).toLowerCase()).join(', ');
  } else {
    let dayMatch = pattern.match(dayRegex);
    if (dayMatch) daysOfWeek = dayMatch[0].charAt(0).toUpperCase() + dayMatch[0].slice(1).toLowerCase();
  }
  // Time
  let timeMatch = pattern.match(timeRegex);
  if (timeMatch) time = timeMatch[0].toUpperCase();
  // Week of month
  let weekMatch = pattern.match(weekOfMonthRegex);
  if (weekMatch) weekOfMonth = weekMatch[0].toLowerCase();

  // Compose specificDates if not present
  if (!specificDates && row.recurrenceType === 'specific-dates' && row.startDate) {
    specificDates = row.startDate;
    if (row.endDate && row.endDate !== row.startDate) specificDates += ', ' + row.endDate;
  }

  return {
    ...row,
    daysOfWeek,
    time,
    weekOfMonth,
    specificDates
  };
}

// Update amateur sports CSV
console.log('=== Updating Amateur Sports CSV Schema ===');
const amateurSportsPath = 'public/data/amateur_sports_standardized.csv';
const amateurSportsData = fs.readFileSync(amateurSportsPath, 'utf8');

const { data: amateurSports } = Papa.parse(amateurSportsData, {
  header: true,
  delimiter: '|',
  skipEmptyLines: true
});

const updatedAmateurSports = amateurSports.map(row => {
  const recurrenceInfo = determineRecurrenceInfo(row);
  return addNewRecurrenceFields({
    ...row,
    recurrenceType: recurrenceInfo.recurrenceType,
    recurrencePattern: recurrenceInfo.recurrencePattern,
    specificDates: recurrenceInfo.specificDates
  });
});

// Write updated amateur sports CSV
const amateurSportsHeader = Object.keys(updatedAmateurSports[0]).join('|');
const amateurSportsRows = updatedAmateurSports.map(row => {
  return Object.values(row).map(value => String(value || '').replace(/\|/g, '\\|')).join('|');
});
const updatedAmateurSportsContent = amateurSportsHeader + '\n' + amateurSportsRows.join('\n');

fs.writeFileSync(amateurSportsPath, updatedAmateurSportsContent);
console.log(`✅ Updated ${updatedAmateurSports.length} amateur sports records with new recurrence fields`);

// Update LGBT events CSV
console.log('\n=== Updating LGBT Events CSV Schema ===');
const lgbtEventsPath = 'public/data/lgbt_events_standardized.csv';
const lgbtEventsData = fs.readFileSync(lgbtEventsPath, 'utf8');

const { data: lgbtEvents } = Papa.parse(lgbtEventsData, {
  header: true,
  delimiter: '|',
  skipEmptyLines: true
});

const updatedLgbtEvents = lgbtEvents.map(row => {
  const recurrenceInfo = determineRecurrenceInfo(row);
  return addNewRecurrenceFields({
    ...row,
    recurrenceType: recurrenceInfo.recurrenceType,
    recurrencePattern: recurrenceInfo.recurrencePattern,
    specificDates: recurrenceInfo.specificDates
  });
});

// Write updated LGBT events CSV
const lgbtEventsHeader = Object.keys(updatedLgbtEvents[0]).join('|');
const lgbtEventsRows = updatedLgbtEvents.map(row => {
  return Object.values(row).map(value => String(value || '').replace(/\|/g, '\\|')).join('|');
});
const updatedLgbtEventsContent = lgbtEventsHeader + '\n' + lgbtEventsRows.join('\n');

fs.writeFileSync(lgbtEventsPath, updatedLgbtEventsContent);
console.log(`✅ Updated ${updatedLgbtEvents.length} LGBT events records with new recurrence fields`);

console.log('\n=== Summary ===');
console.log('✅ Added fields: recurrenceType, recurrencePattern, specificDates');
console.log('✅ recurrenceType values: one-time, recurring, specific-dates');
console.log('✅ recurrencePattern: Human-readable description of when events occur');
console.log('✅ specificDates: Comma-separated list for irregular schedules');
console.log('✅ Both CSV files updated successfully'); 