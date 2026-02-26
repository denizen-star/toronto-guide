/**
 * Adds thermal baths, Russian banya, hammam, sauna day trips to daytrips_data.json
 * and day_trips_standardized.csv. Run from project root, then: node scripts/merge-csv-to-json.js
 */

const fs = require('fs');
const path = require('path');

const THERMAL_SPA_ACTIVITIES = [
  { id: 'dt_spa_thermea', name: 'Thermea Spa Village Whitby', description: 'Nordic-style thermal spa with hot and cold baths, saunas, Aufguss ceremonies, and relaxation areas. Closest major thermal spa to Toronto.', location: 'Whitby, ON', type: 'Spa & Wellness', website: 'https://thermea.com/whitby', travelTime: '~45 min driving', cost: 'Day pass ~$70+', activityDetails: 'Thermal baths, saunas, cold plunge, steam, rest areas', tags: 'Spa,Thermal Baths,Sauna,Wellness,Year-round,LGBTQ Friendly' },
  { id: 'dt_spa_southwestern', name: 'South-Western Bathhouse', description: 'Russian banya, Turkish hammam, and Finnish sauna under one roof. Cold plunge, tea room, full bar, venik massage. Gender-specific and co-ed sessions. Sister location in Richmond Hill.', location: 'Mississauga / Richmond Hill, ON', type: 'Spa & Wellness', website: 'https://banya.ca', travelTime: '~30-45 min driving', cost: 'Adults ~$65, children ~$30', activityDetails: 'Russian banya, hammam, Finnish sauna, cold plunge, tea room', tags: 'Spa,Russian Bath,Hammam,Sauna,Wellness,Year-round,LGBTQ Friendly' },
  { id: 'dt_spa_vladimirskie', name: 'Vladimirskie Bani', description: 'Russian banya and Turkish steam rooms, infrared saunas, hot tubs. Women\'s, men\'s, and family days. Vaughan location.', location: 'Vaughan, ON', type: 'Spa & Wellness', website: 'https://vladimirskiebani.com', travelTime: '~45 min driving', cost: '~$40, 4-hour limit', activityDetails: 'Russian banya, Turkish steam, infrared sauna, hot tubs', tags: 'Spa,Russian Bath,Hammam,Sauna,Wellness,Year-round' },
  { id: 'dt_spa_hammam_cela', name: 'Hammam Spa by Céla', description: 'Turkish hammam experience in Toronto: steam, exfoliation, and traditional treatments in a serene setting.', location: 'Toronto, ON', type: 'Spa & Wellness', website: 'https://www.celaspa.com', travelTime: 'Local', cost: 'Treatments vary', activityDetails: 'Hammam, steam, body treatments, relaxation', tags: 'Spa,Hammam,Wellness,Toronto,Year-round,LGBTQ Friendly' },
  { id: 'dt_spa_miraj', name: 'Miraj Hammam Spa', description: 'Traditional hammam and spa in Toronto. Steam, black soap, and ritual treatments.', location: 'Toronto, ON', type: 'Spa & Wellness', website: 'https://www.mirajhammam.com', travelTime: 'Local', cost: 'Treatments vary', activityDetails: 'Hammam, steam, body rituals, relaxation', tags: 'Spa,Hammam,Wellness,Toronto,Year-round' },
  { id: 'dt_spa_elmwood', name: 'Elmwood Spa', description: 'Downtown Toronto spa with sauna, steam, pool, and full treatment menu. Rooftop terrace and quiet lounges.', location: 'Toronto, ON', type: 'Spa & Wellness', website: 'https://www.elmwoodspa.com', travelTime: 'Local', cost: 'Day pass and treatments vary', activityDetails: 'Sauna, steam, pool, treatments, rooftop', tags: 'Spa,Sauna,Wellness,Toronto,Year-round,LGBTQ Friendly' },
  { id: 'dt_spa_bodyblitz', name: 'Body Blitz Spa', description: 'Women-only water circuit: hot pool, cold plunge, eucalyptus steam, and sauna. West-end Toronto.', location: 'Toronto, ON', type: 'Spa & Wellness', website: 'https://www.bodyblitzspa.com', travelTime: 'Local', cost: 'Day pass varies', activityDetails: 'Water circuit, steam, sauna, cold plunge', tags: 'Spa,Thermal,Wellness,Toronto,Year-round,Women' },
  { id: 'dt_spa_vetta', name: 'Vetta Nordic Spa', description: 'Nordic spa with thermal pools, saunas, and cold plunges. Outdoor relaxation near Muskoka.', location: 'Haliburton area, ON', type: 'Spa & Wellness', website: 'https://www.vettanordicspa.com', travelTime: '~2+ hours driving', cost: 'Day pass and treatments vary', activityDetails: 'Thermal pools, saunas, cold plunge, outdoor relaxation', tags: 'Spa,Thermal,Sauna,Wellness,Year-round,Winter' },
  { id: 'dt_spa_stannes', name: "St. Anne's Spa", description: 'Full-service spa and inn with thermal pools, outdoor hot tubs, and treatments. Country setting near Grafton.', location: 'Grafton, ON', type: 'Spa & Wellness', website: 'https://www.stannes.ca', travelTime: '~1.5 hours driving', cost: 'Day visit and packages vary', activityDetails: 'Thermal pools, hot tubs, treatments, dining', tags: 'Spa,Thermal,Wellness,Year-round,LGBTQ Friendly' },
];

function buildTripJson(act) {
  return {
    id: act.id,
    name: act.name,
    coordinates: { latitude: 43.65, longitude: -79.38 },
    contact: { phone: 'Contact via website', email: 'info@destination.com', website: act.website || 'https://example.com' },
    whySpecial: [act.description, 'Thermal baths, saunas, or hammam within reach of Toronto.', 'Year-round wellness and relaxation.'],
    reasonsToGo: ['Relax in thermal waters, sauna, or hammam.', 'Unwind close to the city or on a day trip.', 'Many venues are LGBTQ+ friendly.'],
    events: [{ name: 'Spa & thermal experience', description: act.activityDetails, location: act.location, frequency: 'Year-round' }],
    booking: { advance_reservation_required: true, seasonal_availability: 'Year-round', weather_dependent: false, peak_season: 'Year-round', off_peak_season: '' },
    accessibility: { wheelchair_accessible: false, accessible_parking: true, accessible_washrooms: true, service_animals_welcome: false, accessibility_notes: 'Contact venue.' },
    reviewsSentiment: { overall: 'Good', positives: ['Relaxing', 'Unique experience', 'Friendly staff'], negatives: ['Book ahead', 'Peak times busy'] },
    dayIn: {
      general: `Plan a spa day: ${act.activityDetails}. Book in advance.`,
      gayDayIn: 'Many spas are LGBTQ+ friendly; call to confirm atmosphere.',
      outdoorsDay: act.activityDetails,
      barRestaurantDay: 'Some venues have tea room, bar, or dining.'
    },
    nearby: [{ name: 'Local area', description: 'Dining and services nearby' }],
    gayFriendlyAccommodations: [{ name: 'Local accommodations', type: 'Various', location: 'Area', description: 'Contact venue or local tourism.' }],
    mustNotMiss: ['Booking in advance', 'Hydration', 'Main experience: ' + (act.activityDetails || 'thermal and relaxation')]
  };
}

function escapeCsv(value) {
  if (value == null) return '';
  const s = String(value);
  return s.includes('|') ? `"${s.replace(/"/g, '""')}"` : s;
}

function run() {
  const projectRoot = path.join(__dirname, '..');
  const jsonPath = path.join(projectRoot, 'public', 'daytrips_data.json');
  const csvPath = path.join(projectRoot, 'public', 'data', 'day_trips_standardized.csv');

  const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const newTrips = THERMAL_SPA_ACTIVITIES.map(buildTripJson);
  jsonData.daytrips.push(...newTrips);
  fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));
  console.log(`Added ${newTrips.length} thermal/spa day trips to daytrips_data.json`);

  const now = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
  const csvRows = THERMAL_SPA_ACTIVITIES.map(a =>
    [a.id, a.name, a.description, 'https://source.unsplash.com/random/?spa', a.location, a.type, 'All levels', '2025-01-01', '2025-12-31', 'Book in advance', 'Full day', a.activityDetails, a.cost, a.website, a.travelTime, 'N/A', 'Yes', a.tags, now, ''].map(escapeCsv).join('|')
  );
  const csvContent = fs.readFileSync(csvPath, 'utf8').trimEnd();
  fs.writeFileSync(csvPath, csvContent + '\n' + csvRows.join('\n') + '\n');
  console.log(`Appended ${csvRows.length} rows to day_trips_standardized.csv`);
  console.log('Run: node scripts/merge-csv-to-json.js');
}

run();
