/**
 * Adds 30 new winter day trip / activity entries to daytrips_data.json
 * and day_trips_standardized.csv. Run from project root.
 * Then run: node scripts/merge-csv-to-json.js
 */

const fs = require('fs');
const path = require('path');

const WINTER_ACTIVITIES = [
  { id: 'dt_winter_gleneden', name: 'Glen Eden Ski & Snowboard', description: 'Local ski hill in Milton with skiing, snowboarding, and tubing. Family-friendly, under 1 hour from Toronto.', location: 'Milton, ON', type: 'Winter Sports', website: 'https://www.gleneden.com', travelTime: '~45 min driving', cost: 'Lift tickets, equipment rental', activityDetails: 'Skiing, snowboarding, snow tubing, lessons', tags: 'Winter,Skiing,Snowboarding,Family,Local' },
  { id: 'dt_winter_snowvalley', name: 'Snow Valley Ski Resort', description: 'Barrie-area ski resort with varied terrain, snow tubing park, and night skiing.', location: 'Barrie, ON', type: 'Winter Sports', website: 'https://www.snowvalley.ca', travelTime: '~1.5 hours driving', cost: 'Lift tickets, tubing pass, rental', activityDetails: 'Skiing, snowboarding, snow tubing, night skiing', tags: 'Winter,Skiing,Snowboarding,Tubing' },
  { id: 'dt_winter_dagmar', name: 'Dagmar Ski Resort', description: 'Uxbridge ski hill with runs for all levels and a friendly local vibe.', location: 'Uxbridge, ON', type: 'Winter Sports', website: 'https://www.skidagmar.com', travelTime: '~1 hour driving', cost: 'Lift tickets, rental', activityDetails: 'Skiing, snowboarding, lessons', tags: 'Winter,Skiing,Snowboarding' },
  { id: 'dt_winter_lakeridge', name: 'Lakeridge Ski Resort', description: 'Durham Region ski and snowboard resort with tubing and terrain parks.', location: 'Uxbridge, ON', type: 'Winter Sports', website: 'https://www.lakeridgeresort.com', travelTime: '~1 hour driving', cost: 'Lift tickets, tubing, rental', activityDetails: 'Skiing, snowboarding, snow tubing, terrain park', tags: 'Winter,Skiing,Snowboarding,Tubing' },
  { id: 'dt_winter_hockley', name: 'Hockley Valley Resort Winter', description: 'Ski resort and spa in the hills of Mono. Ski by day, spa and dining by evening.', location: 'Mono, ON', type: 'Winter Sports', website: 'https://www.hockley.com', travelTime: '~1.5 hours driving', cost: 'Lift tickets, spa, dining', activityDetails: 'Skiing, snowboarding, spa, fine dining', tags: 'Winter,Skiing,Spa,Resort' },
  { id: 'dt_winter_sirsams', name: "Sir Sam's Ski & Ride", description: 'Haliburton ski area with uncrowded runs and cottage-country atmosphere.', location: 'Haliburton, ON', type: 'Winter Sports', website: 'https://www.sirsams.com', travelTime: '~2.5 hours driving', cost: 'Lift tickets, rental, meals', activityDetails: 'Skiing, snowboarding, cross-country, snow tubing', tags: 'Winter,Skiing,Snowboarding,Haliburton' },
  { id: 'dt_winter_pakenham', name: 'Mount Pakenham Ski Resort', description: 'Family-oriented ski hill in the Ottawa Valley with tubing and night skiing.', location: 'Pakenham, ON', type: 'Winter Sports', website: 'https://www.mountpakenham.com', travelTime: '~4.5 hours driving', cost: 'Lift tickets, tubing, rental', activityDetails: 'Skiing, snowboarding, snow tubing, night skiing', tags: 'Winter,Skiing,Snowboarding,Tubing,Family' },
  { id: 'dt_winter_horseshoe', name: 'Horseshoe Resort Ski & Tubing', description: 'Barrie-area resort with skiing, snowboarding, and dedicated snow tubing park.', location: 'Barrie, ON', type: 'Winter Sports', website: 'https://www.horseshoeresort.com', travelTime: '~1.5 hours driving', cost: 'Lift tickets, tubing pass, rental', activityDetails: 'Skiing, snowboarding, snow tubing, trails', tags: 'Winter,Skiing,Snowboarding,Tubing' },
  { id: 'dt_winter_icewine', name: 'Niagara Icewine Festival', description: 'Winter festival celebrating Ontario icewine with tastings, events, and ice bars in Niagara-on-the-Lake.', location: 'Niagara-on-the-Lake, ON', type: 'Winter Cultural', website: 'https://www.niagarawinefestival.com', travelTime: '~1.5 hours driving', cost: 'Tastings, events, meals', activityDetails: 'Icewine tastings, ice bar, winter events', tags: 'Winter,Wine,Festival,Niagara' },
  { id: 'dt_winter_winterlude', name: 'Winterlude & Rideau Canal Skate', description: 'Ottawa winter festival. Skate the world-famous Rideau Canal and enjoy ice sculptures and events.', location: 'Ottawa, ON', type: 'Winter Cultural', website: 'https://www.ottawatourism.ca/winterlude', travelTime: '~4.5 hours driving', cost: 'Free skating, events vary', activityDetails: 'Canal skating, ice sculptures, winter festival', tags: 'Winter,Skating,Festival,Ottawa' },
  { id: 'dt_winter_harbourfront', name: 'Harbourfront Natrel Rink', description: 'Outdoor skating rink on the Toronto waterfront with lake views and winter programming.', location: 'Toronto, ON', type: 'Winter Sports', website: 'https://www.harbourfrontcentre.com', travelTime: 'Local', cost: 'Free skate rental available', activityDetails: 'Ice skating, winter events, waterfront', tags: 'Winter,Skating,Toronto,Free' },
  { id: 'dt_winter_nathanphillips', name: 'Nathan Phillips Square Skating', description: 'Iconic downtown Toronto rink at City Hall. Free skating with skyline views.', location: 'Toronto, ON', type: 'Winter Sports', website: 'https://www.toronto.ca', travelTime: 'Local', cost: 'Free', activityDetails: 'Ice skating, photo ops, downtown', tags: 'Winter,Skating,Toronto,Free' },
  { id: 'dt_winter_bentway', name: 'The Bentway Skate Trail', description: 'Unique skating trail under the Gardiner in Toronto. Winter programming and events.', location: 'Toronto, ON', type: 'Winter Sports', website: 'https://thebentway.ca', travelTime: 'Local', cost: 'Free', activityDetails: 'Skate trail, winter events, urban', tags: 'Winter,Skating,Toronto,Free' },
  { id: 'dt_winter_riverdale', name: 'Riverdale Park East Tobogganing', description: 'Popular Toronto hill for tobogganing with downtown views. Bring your own sled.', location: 'Toronto, ON', type: 'Winter Sports', website: 'https://www.toronto.ca', travelTime: 'Local', cost: 'Free', activityDetails: 'Tobogganing, sledding, park', tags: 'Winter,Tobogganing,Toronto,Free,Family' },
  { id: 'dt_winter_icesimcoe', name: 'Lake Simcoe Ice Fishing', description: 'Ice fishing on Lake Simcoe for perch, whitefish, and lake trout. Huts and guides available.', location: 'Lake Simcoe, ON', type: 'Winter Sports', website: 'https://www.tourismbarrie.com', travelTime: '~1–1.5 hours driving', cost: 'Licence, hut rental or guide, gear', activityDetails: 'Ice fishing, winter huts, guides', tags: 'Winter,Ice Fishing,Lake Simcoe' },
  { id: 'dt_winter_algonquin_snowshoe', name: 'Algonquin Park Winter Snowshoe', description: 'Snowshoe the trails of Algonquin in winter. Visitor centre, groomed trails, and backcountry options.', location: 'Algonquin Provincial Park, ON', type: 'Winter Nature', website: 'https://www.algonquinpark.on.ca', travelTime: '~3 hours driving', cost: 'Park permit, rental if needed', activityDetails: 'Snowshoeing, winter trails, wildlife', tags: 'Winter,Snowshoeing,Nature,Algonquin' },
  { id: 'dt_winter_scandinave', name: 'Scandinave Spa Blue Mountain Winter', description: 'Outdoor Nordic spa with hot baths, cold plunges, and saunas in the snow at Blue Mountain.', location: 'Blue Mountains, ON', type: 'Winter Wellness', website: 'https://www.scandinave.com/blue-mountain', travelTime: '~2 hours driving', cost: 'Spa pass, treatments optional', activityDetails: 'Hot baths, cold plunge, sauna, silence', tags: 'Winter,Spa,Wellness,Blue Mountain' },
  { id: 'dt_winter_dogsled', name: 'Haliburton Forest Dog Sledding', description: 'Dog sledding experiences through Haliburton Forest. Half-day and full-day tours.', location: 'Haliburton, ON', type: 'Winter Adventure', website: 'https://www.haliburtonforest.com', travelTime: '~2.5 hours driving', cost: 'Tour fees vary', activityDetails: 'Dog sledding, winter forest, tours', tags: 'Winter,Dog Sledding,Adventure,Haliburton' },
  { id: 'dt_winter_cranberry', name: 'Cranberry Marsh Winter Experience', description: 'Bala-area cranberry operation with winter tours, snowshoeing, and seasonal events.', location: 'Bala, ON', type: 'Winter Nature', website: 'https://www.cranberry.ca', travelTime: '~2 hours driving', cost: 'Tours, activities vary', activityDetails: 'Cranberry marsh, snowshoeing, winter tours', tags: 'Winter,Muskoka,Nature,Tours' },
  { id: 'dt_winter_niagara_wine', name: 'Niagara Winter Wine Tour', description: 'Winter winery tours and tastings in Niagara. Cozy cellars and icewine focus.', location: 'Niagara-on-the-Lake, ON', type: 'Winter Cultural', website: 'https://www.niagarawinecountry.com', travelTime: '~1.5 hours driving', cost: 'Tastings, lunch', activityDetails: 'Winery tours, icewine, tastings', tags: 'Winter,Wine,Niagara,Tastings' },
  { id: 'dt_winter_distillery', name: 'Distillery District Winter Village', description: 'Toronto Distillery District in winter: skating, lights, markets, and holiday atmosphere.', location: 'Toronto, ON', type: 'Winter Cultural', website: 'https://www.thedistillerydistrict.com', travelTime: 'Local', cost: 'Free to explore, skating and vendors vary', activityDetails: 'Skating, lights, shopping, dining', tags: 'Winter,Skating,Markets,Toronto' },
  { id: 'dt_winter_kortright', name: 'Kortright Centre Winter Trails', description: 'Vaughan conservation area with winter trails for snowshoeing and cross-country skiing.', location: 'Vaughan, ON', type: 'Winter Nature', website: 'https://www.kortright.org', travelTime: '~45 min driving', cost: 'Admission, rental if needed', activityDetails: 'Snowshoeing, cross-country skiing, trails', tags: 'Winter,Snowshoeing,Skiing,Trails' },
  { id: 'dt_winter_terracotta', name: 'Terra Cotta Conservation Winter', description: 'Halton conservation area with winter hiking and snowshoe trails near Georgetown.', location: 'Halton Hills, ON', type: 'Winter Nature', website: 'https://www.conservationhalton.ca', travelTime: '~1 hour driving', cost: 'Parking or permit', activityDetails: 'Winter hiking, snowshoeing, trails', tags: 'Winter,Hiking,Snowshoeing,Nature' },
  { id: 'dt_winter_forks', name: 'Forks of the Credit Winter', description: 'Scenic Caledon area with winter hiking and snow-covered landscapes along the Credit River.', location: 'Caledon, ON', type: 'Winter Nature', website: 'https://www.creditvalleyca.ca', travelTime: '~1 hour driving', cost: 'Parking', activityDetails: 'Winter hiking, scenery, photography', tags: 'Winter,Hiking,Nature,Caledon' },
  { id: 'dt_winter_elora', name: 'Elora Gorge Winter Hiking', description: 'Winter trails at Elora Gorge Conservation Area. Frozen scenery and quiet trails.', location: 'Elora, ON', type: 'Winter Nature', website: 'https://www.grandriver.ca', travelTime: '~1.5 hours driving', cost: 'Park admission', activityDetails: 'Winter hiking, gorge views, trails', tags: 'Winter,Hiking,Elora,Nature' },
  { id: 'dt_winter_crawford', name: 'Crawford Lake Winter', description: 'Winter programming and trails at Crawford Lake. Iroquoian village and meromictic lake in snow.', location: 'Milton, ON', type: 'Winter Nature', website: 'https://www.conservationhalton.ca', travelTime: '~1 hour driving', cost: 'Admission', activityDetails: 'Winter trails, Indigenous heritage, lake', tags: 'Winter,Hiking,History,Milton' },
  { id: 'dt_winter_sleigh', name: "Sleigh Ride at Chudleigh's", description: 'Horse-drawn sleigh rides at Chudleigh\'s farm in Milton. Winter farm experience and apple treats.', location: 'Milton, ON', type: 'Winter Cultural', website: 'https://www.chudleighs.com', travelTime: '~45 min driving', cost: 'Sleigh ride fee', activityDetails: 'Sleigh ride, farm, winter experience', tags: 'Winter,Sleigh Ride,Family,Milton' },
  { id: 'dt_winter_curling', name: 'Curling Experience in Toronto', description: 'Try curling at a Toronto-area club. Learn-to-curl sessions and bonspiels in winter.', location: 'Toronto, ON', type: 'Winter Sports', website: 'https://www.curling.ca', travelTime: 'Local', cost: 'Session fees vary', activityDetails: 'Curling, learn to curl, winter sport', tags: 'Winter,Curling,Sports,Toronto' },
  { id: 'dt_winter_pelee', name: 'Winter Birding at Point Pelee', description: 'Winter birding at Canada\'s southernmost point. Eagles, waterfowl, and quiet trails.', location: 'Leamington, ON', type: 'Winter Nature', website: 'https://www.pc.gc.ca/en/pn-np/on/pelee', travelTime: '~3.5 hours driving', cost: 'Park entry', activityDetails: 'Birding, winter wildlife, trails', tags: 'Winter,Birding,Nature,Point Pelee' },
  { id: 'dt_winter_earlbales', name: 'Tobogganing at Earl Bales Park', description: 'Popular North York toboggan hill at Earl Bales Park. Free and family-friendly.', location: 'Toronto, ON', type: 'Winter Sports', website: 'https://www.toronto.ca', travelTime: 'Local', cost: 'Free', activityDetails: 'Tobogganing, sledding, park', tags: 'Winter,Tobogganing,Toronto,Free,Family' },
  { id: 'dt_winter_rouge', name: 'Snowshoeing at Rouge Park', description: 'Canada\'s largest urban park in winter. Snowshoe and winter trails near Toronto.', location: 'Toronto, ON', type: 'Winter Nature', website: 'https://www.pc.gc.ca/en/pn-np/on/rouge', travelTime: 'Local to ~30 min', cost: 'Free', activityDetails: 'Snowshoeing, winter trails, urban park', tags: 'Winter,Snowshoeing,Toronto,Rouge Park,Free' },
  { id: 'dt_winter_niagarafalls', name: 'Niagara Falls Winter Experience', description: 'Niagara Falls in winter: frozen mist, winter lights, and fewer crowds. Clifton Hill and attractions open.', location: 'Niagara Falls, ON', type: 'Winter Cultural', website: 'https://www.niagarafallstourism.com', travelTime: '~1.5 hours driving', cost: 'Free to view falls, attractions vary', activityDetails: 'Winter falls viewing, lights, Clifton Hill', tags: 'Winter,Niagara Falls,Family,Viewing' },
  { id: 'dt_winter_mountsberg', name: 'Mountsberg Winter & Maple Syrup', description: 'Halton conservation area with winter programs, raptor centre, and early maple syrup season in late winter.', location: 'Campbellville, ON', type: 'Winter Nature', website: 'https://www.conservationhalton.ca', travelTime: '~1 hour driving', cost: 'Admission', activityDetails: 'Winter trails, raptors, maple syrup, family programs', tags: 'Winter,Maple Syrup,Family,Nature' },
];

function buildTripJson(act) {
  return {
    id: act.id,
    name: act.name,
    coordinates: { latitude: 43.65, longitude: -79.38 },
    contact: {
      phone: 'Contact via website',
      email: 'info@destination.com',
      website: act.website || 'https://example.com'
    },
    whySpecial: [
      act.description,
      'Winter activities within reach of Toronto',
      'Suitable for a day trip or short getaway'
    ],
    reasonsToGo: [
      'Experience winter fun in the GTA and beyond',
      'Try skiing, skating, tubing, or winter nature',
      'Family-friendly and couple-friendly options'
    ],
    events: [
      {
        name: 'Winter Season',
        description: act.activityDetails,
        location: act.location,
        frequency: 'December–March (weather dependent)'
      }
    ],
    booking: {
      advance_reservation_required: false,
      seasonal_availability: 'Winter',
      weather_dependent: true,
      peak_season: 'December-March',
      off_peak_season: 'April-November'
    },
    accessibility: {
      wheelchair_accessible: false,
      accessible_parking: true,
      accessible_washrooms: true,
      service_animals_welcome: true,
      accessibility_notes: 'Contact venue for accessibility information.'
    },
    reviewsSentiment: {
      overall: 'Good',
      positives: ['Winter fun close to Toronto', 'Variety of activities', 'Seasonal experience'],
      negatives: ['Weather dependent', 'Peak days can be busy']
    },
    dayIn: {
      general: `Plan a winter day: ${act.activityDetails}. Dress warmly and check conditions.`,
      gayDayIn: 'Welcoming winter destination; enjoy the activity and local atmosphere.',
      outdoorsDay: act.activityDetails,
      barRestaurantDay: 'Nearby towns and lodges for warming up and meals.'
    },
    nearby: [
      { name: 'Local towns', description: 'Dining and services nearby' }
    ],
    gayFriendlyAccommodations: [
      { name: 'Local accommodations', type: 'Various', location: 'Area', description: 'Contact local tourism for options.' }
    ],
    mustNotMiss: [
      'Dressing for cold weather',
      'Checking hours and conditions before you go',
      'Main activity: ' + (act.activityDetails || 'winter fun')
    ]
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
  const newTrips = WINTER_ACTIVITIES.map(buildTripJson);
  jsonData.daytrips.push(...newTrips);
  fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));
  console.log(`Added ${newTrips.length} winter activities to daytrips_data.json`);

  const csvHeader = 'id|title|description|image|location|type|skillLevel|startDate|endDate|registrationDeadline|duration|activityDetails|cost|website|travelTime|googleMapLink|lgbtqFriendly|tags|lastUpdated|matchingId';
  const now = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
  const csvRows = WINTER_ACTIVITIES.map(a => [
    a.id,
    a.name,
    a.description,
    'https://source.unsplash.com/random/?winter',
    a.location,
    a.type,
    'All levels',
    '2025-12-01',
    '2025-03-31',
    'Not required',
    'Full day',
    a.activityDetails,
    a.cost,
    a.website,
    a.travelTime,
    'N/A',
    'No (General event)',
    a.tags,
    now,
    ''
  ].map(escapeCsv).join('|'));
  const csvContent = fs.readFileSync(csvPath, 'utf8').trimEnd();
  const csvNew = csvContent + '\n' + csvRows.join('\n') + '\n';
  fs.writeFileSync(csvPath, csvNew);
  console.log(`Appended ${csvRows.length} rows to day_trips_standardized.csv`);
  console.log('Done. Run: node scripts/merge-csv-to-json.js');
}

run();
