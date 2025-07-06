const fs = require('fs');
const Papa = require('papaparse');

// Read the LGBT events CSV
const lgbtEventsPath = 'public/data/lgbt_events_standardized.csv';
const lgbtEventsData = fs.readFileSync(lgbtEventsPath, 'utf8');

// Parse the CSV
const { data } = Papa.parse(lgbtEventsData, {
  header: true,
  delimiter: '|',
  skipEmptyLines: true
});

// Add skillLevel column to each row
const updatedData = data.map(row => {
  // Determine skillLevel based on eventType and other fields
  let skillLevel = 'All levels';
  
  if (row.eventType === 'sports') {
    // For sports events, try to determine skill level from description or tags
    const description = (row.description || '').toLowerCase();
    const tags = (row.tags || '').toLowerCase();
    
    if (description.includes('beginner') || tags.includes('beginner') || description.includes('learn-to')) {
      skillLevel = 'Beginner';
    } else if (description.includes('advanced') || tags.includes('advanced') || description.includes('competitive')) {
      skillLevel = 'Advanced';
    } else if (description.includes('intermediate') || tags.includes('intermediate')) {
      skillLevel = 'Intermediate';
    } else {
      skillLevel = 'All levels';
    }
  } else {
    // For non-sports events, default to "All levels"
    skillLevel = 'All levels';
  }
  
  return {
    ...row,
    skillLevel
  };
});

// Create new header with skillLevel column
const headers = [
  'id', 'title', 'description', 'image', 'location', 'eventType', 'skillLevel',
  'startDate', 'endDate', 'registrationDeadline', 'duration', 'activityDetails',
  'cost', 'website', 'travelTime', 'googleMapLink', 'lgbtqFriendly', 'tags',
  'lastUpdated', 'subcategory', 'socialMedia', 'recurring', 'venueAccessibility',
  'pronouns', 'ageRestriction'
];

// Convert back to CSV
const csvContent = Papa.unparse(updatedData, {
  header: true,
  delimiter: '|'
});

// Write the updated CSV
fs.writeFileSync(lgbtEventsPath, csvContent);
console.log('Successfully added skillLevel column to LGBT events CSV'); 