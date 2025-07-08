const fs = require('fs');
const Papa = require('papaparse');

// Read the current CSV
const csvPath = 'public/data/amateur_sports_standardized.csv';
const csvData = fs.readFileSync(csvPath, 'utf8');

const { data } = Papa.parse(csvData, {
  header: true,
  delimiter: '|',
  skipEmptyLines: true
});

// Create the new Spartan Race entry
const spartanRaceEntry = {
  id: 'as054',
  title: '2026 Toronto Spartan Event Weekend',
  description: 'This 5K and 10K Toronto course—located at Toronto\'s not-for-profit adventure center, Brimacombe—will leave your head spinning and heart pumping. Climb after climb will shoot you up 92 meters of vertical before slingshotting you down and around switchback after switchback. Conquering these trails is no small feat, but the work is worth it once you bring home your 2026 Finisher\'s medal.',
  image: 'https://source.unsplash.com/random/?obstacle,race,spartan',
  location: 'Brimacombe, 4098 Regional Road 9, Orono, ON, CA',
  eventType: 'sports',
  skillLevel: 'All levels',
  startDate: '2026-05-23',
  endDate: '2026-05-24',
  registrationDeadline: '2026-05-20',
  duration: '1-2 days',
  activityDetails: 'Sprint 5K (20 obstacles), Super 10K (25 obstacles), Kids Race 1-3km, Hurricane Heat 4HR. Picturesque course blending natural beauty with demanding obstacles.',
  cost: 'C$64-94 (varies by race type)',
  website: 'https://ca.spartan.com/en/races/toronto',
  travelTime: '~1 hour from Toronto',
  googleMapLink: 'https://www.google.com/maps/search/?api=1&query=Brimacombe+4098+Regional+Road+9+Orono+ON',
  lgbtqFriendly: 'No',
  tags: 'obstacle course,spartan race,endurance,trail running,competitive,team event',
  lastUpdated: '2025-01-27T00:00:00Z',
  subcategory: 'obstacle course racing',
  socialMedia: '{}',
  recurring: 'false',
  venueAccessibility: 'varies by terrain',
  pronouns: 'all',
  ageRestriction: 'varies by race type'
};

// Add the new entry to the data
data.push(spartanRaceEntry);

// Create the updated CSV content
const header = [
  'id', 'title', 'description', 'image', 'location', 'eventType', 'skillLevel',
  'startDate', 'endDate', 'registrationDeadline', 'duration', 'activityDetails',
  'cost', 'website', 'travelTime', 'googleMapLink', 'lgbtqFriendly', 'tags',
  'lastUpdated', 'subcategory', 'socialMedia', 'recurring', 'venueAccessibility',
  'pronouns', 'ageRestriction'
].join('|');

const rows = data.map(row => {
  return header.split('|').map(field => {
    const value = row[field] || '';
    // Escape pipe characters in values
    return String(value).replace(/\|/g, '\\|');
  }).join('|');
});

const updatedCsvContent = header + '\n' + rows.join('\n');

// Write the updated CSV
fs.writeFileSync(csvPath, updatedCsvContent);

console.log('✅ Added Spartan Race event to amateur sports CSV:');
console.log(`   - ID: ${spartanRaceEntry.id}`);
console.log(`   - Title: ${spartanRaceEntry.title}`);
console.log(`   - Location: ${spartanRaceEntry.location}`);
console.log(`   - Date: ${spartanRaceEntry.startDate} to ${spartanRaceEntry.endDate}`);
console.log(`   - Website: ${spartanRaceEntry.website}`);
console.log(`\n📊 Total records: ${data.length}`);
console.log('📁 Updated file: public/data/amateur_sports_standardized.csv'); 