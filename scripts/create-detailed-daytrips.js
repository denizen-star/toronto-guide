const fs = require('fs');
const path = require('path');

// Load the JSON data
const jsonData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/sampledaytripdetails_formatted.json'), 'utf8'));

// Load the CSV data
const csvData = fs.readFileSync(path.join(__dirname, '../public/data/day_trips_standardized.csv'), 'utf8');

// Parse CSV data
const csvLines = csvData.split('\n');
const headers = csvLines[0].split('|');
const csvTrips = csvLines.slice(1).map(line => {
  const values = line.split('|');
  const trip = {};
  headers.forEach((header, index) => {
    trip[header] = values[index];
  });
  return trip;
});

// Helper function to normalize text for matching
const normalizeText = (text) => {
  return text.toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/\s+/g, '');
};

// Helper function to calculate similarity between two strings
const calculateSimilarity = (str1, str2) => {
  const normalized1 = normalizeText(str1);
  const normalized2 = normalizeText(str2);
  
  if (normalized1 === normalized2) return 1.0;
  
  // Check if one contains the other
  if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
    return 0.8;
  }
  
  // Simple word matching
  const words1 = normalized1.split('');
  const words2 = normalized2.split('');
  const commonChars = words1.filter(char => words2.includes(char)).length;
  const totalChars = Math.max(words1.length, words2.length);
  
  return commonChars / totalChars;
};

// Helper function to extract reasons to go as strings
const extractReasonsToGo = (reasons) => {
  if (Array.isArray(reasons)) {
    return reasons.map(reason => {
      if (typeof reason === 'string') return reason;
      if (typeof reason === 'object' && reason.reason_text) return reason.reason_text;
      return '';
    }).filter(Boolean);
  }
  return [];
};

// Helper function to extract must not miss as strings
const extractMustNotMiss = (items) => {
  if (Array.isArray(items)) {
    return items.map(item => {
      if (typeof item === 'string') return item;
      if (typeof item === 'object' && item.item) return item.item;
      return '';
    }).filter(Boolean);
  }
  return [];
};

// Create mapping between JSON events and CSV trips
const createDetailedDayTrips = () => {
  const detailedTrips = [];
  
  // Process each JSON event
  jsonData.day_trip_events.forEach((eventObj, index) => {
    const eventKey = Object.keys(eventObj)[0];
    const event = eventObj[eventKey];
    
    // Find best matching CSV trip
    let bestMatch = null;
    let bestScore = 0;
    
    csvTrips.forEach(csvTrip => {
      const titleSimilarity = calculateSimilarity(event.name || '', csvTrip.title || '');
      const descriptionSimilarity = calculateSimilarity(event.short_description || '', csvTrip.description || '');
      
      const score = Math.max(titleSimilarity, descriptionSimilarity);
      
      if (score > bestScore && score > 0.3) {
        bestScore = score;
        bestMatch = csvTrip;
      }
    });
    
    if (bestMatch) {
      console.log(`✅ Matched: "${event.name}" with "${bestMatch.title}" (score: ${bestScore.toFixed(2)})`);
      
      // Create detailed trip object
      const detailedTrip = {
        id: bestMatch.id,
        name: event.name || bestMatch.title,
        coordinates: event.location?.coordinates || {
          latitude: parseFloat(bestMatch.latitude) || 0,
          longitude: parseFloat(bestMatch.longitude) || 0
        },
        contact: {
          phone: event.contact?.phone || "Contact via website",
          email: event.contact?.email || "info@destination.com",
          website: event.official_website_url || bestMatch.website || "https://example.com"
        },
        whySpecial: event.why_special || [event.whySpecial] || [
          "Unique natural beauty and outdoor experiences",
          "Rich cultural and historical significance",
          "Diverse recreational opportunities"
        ],
        reasonsToGo: extractReasonsToGo(event.reasons_to_go) || [
          "Experience stunning natural landscapes",
          "Enjoy outdoor activities and adventure",
          "Discover local culture and history"
        ],
        events: event.events || [
          {
            name: "Seasonal Activities",
            description: "Various activities available throughout the year",
            date: "2025-06-01 to 2025-09-30",
            website: bestMatch.website || "https://example.com",
            price: "Varies by activity"
          }
        ],
        booking: {
          required: event.booking?.required || false,
          website: event.booking?.website || bestMatch.website || "https://example.com",
          phone: event.booking?.phone || "Contact via website",
          notes: event.booking?.notes || "Check website for current availability"
        },
        accessibility: {
          wheelchairAccessible: event.accessibility?.wheelchairAccessible || false,
          accessibleParking: event.accessibility?.accessibleParking || false,
          accessibleTrails: event.accessibility?.accessibleTrails || false,
          notes: event.accessibility?.notes || "Contact venue for specific accessibility information"
        },
        reviewsSentiment: event.reviews_sentiment || {
          overall: "Highly rated destination with positive visitor experiences",
          positives: ["Beautiful scenery", "Well-maintained facilities", "Friendly staff"],
          negatives: ["Can be crowded during peak season", "Weather dependent"]
        },
        dayIn: event.day_in_plans || {
          general: "Plan for a full day of activities and exploration",
          gayDayIn: "Welcoming environment for all visitors",
          outdoorsDay: "Perfect for outdoor enthusiasts and nature lovers",
          barRestaurantDay: "Local dining options available"
        },
        nearby: event.nearby_attractions || [
          {
            name: "Local Attractions",
            description: "Various points of interest in the surrounding area"
          }
        ],
        gayFriendlyAccommodations: event.gay_friendly_accommodations || [
          {
            name: "Local Accommodations",
            type: "Various",
            location: "Nearby",
            description: "Contact local tourism office for accommodation recommendations"
          }
        ],
        mustNotMiss: extractMustNotMiss(event.must_not_miss) || [
          "Main attraction and highlights",
          "Local dining and cultural experiences",
          "Outdoor activities and natural beauty"
        ]
      };
      
      detailedTrips.push(detailedTrip);
    } else {
      console.log(`❌ No match found for: "${event.name}"`);
    }
  });
  
  // Add additional trips from CSV that weren't matched
  const matchedIds = detailedTrips.map(trip => trip.id);
  const unmatchedTrips = csvTrips.filter(trip => !matchedIds.includes(trip.id));
  
  console.log(`\n📊 Adding ${unmatchedTrips.length} additional trips from CSV...`);
  
  unmatchedTrips.slice(0, 10).forEach(trip => {
    const detailedTrip = {
      id: trip.id,
      name: trip.title,
      coordinates: {
        latitude: parseFloat(trip.latitude) || 0,
        longitude: parseFloat(trip.longitude) || 0
      },
      contact: {
        phone: "Contact via website",
        email: "info@destination.com",
        website: trip.website || "https://example.com"
      },
      whySpecial: [
        trip.description || "Unique destination with diverse activities",
        "Rich cultural and natural experiences",
        "Accessible for all skill levels"
      ],
      reasonsToGo: [
        "Experience local culture and history",
        "Enjoy outdoor activities and adventure",
        "Discover natural beauty and scenic views"
      ],
      events: [
        {
          name: "Seasonal Activities",
          description: "Various activities available throughout the year",
          date: `${trip.startDate || '2025-06-01'} to ${trip.endDate || '2025-09-30'}`,
          website: trip.website || "https://example.com",
          price: trip.cost || "Varies by activity"
        }
      ],
      booking: {
        required: trip.registrationDeadline === "Not required" ? false : true,
        website: trip.website || "https://example.com",
        phone: "Contact via website",
        notes: "Check website for current availability and booking requirements"
      },
      accessibility: {
        wheelchairAccessible: false,
        accessibleParking: false,
        accessibleTrails: false,
        notes: "Contact venue for specific accessibility information"
      },
      reviewsSentiment: {
        overall: "Popular destination with positive visitor experiences",
        positives: ["Beautiful location", "Good facilities", "Friendly atmosphere"],
        negatives: ["Can be busy during peak season", "Weather dependent"]
      },
      dayIn: {
        general: "Plan for a full day of activities and exploration",
        gayDayIn: "Welcoming environment for all visitors",
        outdoorsDay: "Perfect for outdoor enthusiasts and nature lovers",
        barRestaurantDay: "Local dining options available"
      },
      nearby: [
        {
          name: "Local Attractions",
          description: "Various points of interest in the surrounding area"
        }
      ],
      gayFriendlyAccommodations: [
        {
          name: "Local Accommodations",
          type: "Various",
          location: "Nearby",
          description: "Contact local tourism office for accommodation recommendations"
        }
      ],
      mustNotMiss: [
        "Main attraction and highlights",
        "Local dining and cultural experiences",
        "Outdoor activities and natural beauty"
      ]
    };
    
    detailedTrips.push(detailedTrip);
    console.log(`✅ Added: "${trip.title}"`);
  });
  
  return detailedTrips;
};

// Generate the detailed day trips
const detailedTrips = createDetailedDayTrips();

// Create the final data structure
const dayTripsData = {
  daytrips: detailedTrips
};

// Write to file
const outputPath = path.join(__dirname, '../public/daytrips_data.json');
fs.writeFileSync(outputPath, JSON.stringify(dayTripsData, null, 2));

console.log(`\n🎉 Successfully generated ${detailedTrips.length} detailed day trips!`);
console.log(`📁 Output saved to: ${outputPath}`);
console.log(`\n📊 Summary:`);
console.log(`- Total day trips: ${detailedTrips.length}`);
console.log(`- Matched from JSON: ${detailedTrips.filter(trip => trip.id.startsWith('dt')).length}`);
console.log(`- Added from CSV: ${detailedTrips.filter(trip => !trip.id.startsWith('dt')).length}`); 