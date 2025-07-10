const fs = require('fs');
const path = require('path');

// Read the current daytrips data
const daytripsPath = path.join(__dirname, '../public/daytrips_data.json');
const daytripsData = JSON.parse(fs.readFileSync(daytripsPath, 'utf8'));

// Enhanced day plans for more day trips
const enhancedDayPlans = {
  dt4: {
    // Prince Edward County
    general: {
      morning: {
        activity: "Breakfast at The Vic Café",
        venue: "The Vic Café",
        website: "https://www.theviccafe.com",
        address: "178 Main St, Picton, ON",
        phone: "+1-613-476-0471",
        cuisine: "Local café fare",
        price_range: "$8-15",
        lgbt_friendly: true
      },
      mid_morning: {
        activity: "Wine tasting at Norman Hardie Winery",
        venue: "Norman Hardie Winery",
        website: "https://www.normanhardie.com",
        address: "1152 Greer Rd, Wellington, ON",
        phone: "+1-613-399-5297",
        description: "Award-winning wines with beautiful vineyard views",
        lgbt_friendly: true
      },
      lunch: {
        activity: "Lunch at The County Canteen",
        venue: "The County Canteen",
        website: "https://www.countycanteen.ca",
        address: "279 Main St, Picton, ON",
        phone: "+1-613-476-1818",
        cuisine: "Farm-to-table Canadian cuisine",
        price_range: "$15-30",
        lgbt_friendly: true
      },
      afternoon: {
        activity: "Visit Sandbanks Provincial Park",
        venue: "Sandbanks Provincial Park",
        website: "https://www.ontarioparks.com/park/sandbanks",
        address: "3004 County Rd 12, Picton, ON",
        phone: "+1-613-393-3319",
        description: "Famous sand dunes and beautiful beaches",
        admission: "$12.25 per vehicle"
      },
      evening: {
        activity: "Dinner at Drake Devonshire",
        venue: "Drake Devonshire",
        website: "https://www.drakedevonshire.ca",
        address: "24 Wharf St, Wellington, ON",
        phone: "+1-613-399-6333",
        cuisine: "Fine dining with lake views",
        price_range: "$40-80",
        lgbt_friendly: true
      }
    },
    gayDayIn: {
      morning: {
        activity: "Breakfast at The Vic Café (LGBTQ+ friendly)",
        venue: "The Vic Café",
        website: "https://www.theviccafe.com",
        address: "178 Main St, Picton, ON",
        phone: "+1-613-476-0471",
        description: "Welcoming atmosphere for LGBTQ+ visitors",
        lgbt_friendly: true
      },
      mid_morning: {
        activity: "Visit LGBTQ+ friendly wineries",
        venue: "Various County Wineries",
        description: "Tour welcoming wineries in the region",
        lgbt_friendly: true
      },
      lunch: {
        activity: "Lunch at The County Canteen (LGBTQ+ friendly)",
        venue: "The County Canteen",
        website: "https://www.countycanteen.ca",
        address: "279 Main St, Picton, ON",
        phone: "+1-613-476-1818",
        description: "Inclusive dining experience",
        lgbt_friendly: true
      },
      afternoon: {
        activity: "Explore inclusive art galleries",
        venue: "County Art Galleries",
        description: "Visit welcoming art spaces in the county",
        lgbt_friendly: true
      },
      evening: {
        activity: "Dinner at Drake Devonshire (LGBTQ+ friendly)",
        venue: "Drake Devonshire",
        website: "https://www.drakedevonshire.ca",
        address: "24 Wharf St, Wellington, ON",
        phone: "+1-613-399-6333",
        description: "Stylish boutique hotel with inclusive atmosphere",
        lgbt_friendly: true
      }
    },
    outdoorsDay: {
      morning: {
        activity: "Morning hike at Sandbanks Provincial Park",
        venue: "Sandbanks Provincial Park",
        website: "https://www.ontarioparks.com/park/sandbanks",
        address: "3004 County Rd 12, Picton, ON",
        phone: "+1-613-393-3319",
        description: "Explore the famous sand dunes and trails",
        difficulty: "Easy to Moderate",
        duration: "2-3 hours"
      },
      mid_morning: {
        activity: "Cycling through wine country",
        venue: "County Wine Country",
        description: "Scenic cycling routes through vineyards",
        duration: "1-2 hours",
        difficulty: "Easy"
      },
      lunch: {
        activity: "Picnic at Sandbanks Beach",
        venue: "Sandbanks Beach",
        description: "Beachside picnic with lake views",
        facilities: "Picnic tables, washrooms, parking"
      },
      afternoon: {
        activity: "Kayaking on Lake Ontario",
        venue: "Lake Ontario",
        description: "Water activities on the lake",
        duration: "2-3 hours",
        difficulty: "Moderate"
      },
      evening: {
        activity: "Sunset at Wellington Beach",
        venue: "Wellington Beach",
        description: "Beautiful sunset views over Lake Ontario",
        best_time: "7:00-9:00 PM"
      }
    },
    barRestaurantDay: {
      morning: {
        activity: "Breakfast at The Vic Café",
        venue: "The Vic Café",
        website: "https://www.theviccafe.com",
        cuisine: "Local breakfast fare",
        price_range: "$8-15"
      },
      mid_morning: {
        activity: "Wine tasting at multiple wineries",
        venue: "County Wineries",
        description: "Tour and taste at various county wineries",
        price_range: "$10-25 per tasting"
      },
      lunch: {
        activity: "Lunch at farm-to-table restaurants",
        venue: "County Restaurants",
        description: "Fresh local cuisine at county establishments",
        price_range: "$15-35"
      },
      afternoon: {
        activity: "Brewery visits",
        venue: "County Breweries",
        description: "Tour local craft breweries",
        price_range: "$8-15 per tasting"
      },
      evening: {
        activity: "Dinner at fine dining establishments",
        venue: "County Fine Dining",
        description: "Upscale dining experiences in the county",
        price_range: "$40-80"
      }
    }
  },
  dt5: {
    // Blue Mountain Summer Visit
    general: {
      morning: {
        activity: "Breakfast at Blue Mountain Village",
        venue: "Blue Mountain Village",
        website: "https://www.bluemountainvillage.ca",
        address: "156 Jozo Weider Blvd, Blue Mountains, ON",
        phone: "+1-705-445-0231",
        description: "Start your day with village dining options",
        lgbt_friendly: true
      },
      mid_morning: {
        activity: "Gondola ride for mountain views",
        venue: "Blue Mountain Gondola",
        website: "https://www.bluemountain.ca/activities/gondola",
        address: "156 Jozo Weider Blvd, Blue Mountains, ON",
        phone: "+1-705-445-0231",
        description: "Scenic gondola ride with panoramic views",
        admission: "$25 per adult"
      },
      lunch: {
        activity: "Lunch at village restaurants",
        venue: "Blue Mountain Village Restaurants",
        website: "https://www.bluemountainvillage.ca/dining",
        description: "Diverse dining options in the village",
        price_range: "$15-35",
        lgbt_friendly: true
      },
      afternoon: {
        activity: "Spa treatment at Scandinave Spa",
        venue: "Scandinave Spa Blue Mountain",
        website: "https://www.scandinave.com/en/blue-mountain",
        address: "152 Grey Rd 21, Blue Mountains, ON",
        phone: "+1-705-444-2964",
        description: "Relaxing spa experience with mountain views",
        lgbt_friendly: true
      },
      evening: {
        activity: "Dinner and evening entertainment",
        venue: "Blue Mountain Village",
        website: "https://www.bluemountainvillage.ca",
        description: "Evening dining and entertainment options",
        lgbt_friendly: true
      }
    },
    gayDayIn: {
      morning: {
        activity: "LGBTQ+ friendly village exploration",
        venue: "Blue Mountain Village",
        website: "https://www.bluemountainvillage.ca",
        description: "Enjoy the inclusive village atmosphere",
        lgbt_friendly: true
      },
      mid_morning: {
        activity: "Inclusive outdoor activities",
        venue: "Blue Mountain Resort",
        website: "https://www.bluemountain.ca",
        description: "Participate in welcoming outdoor programming",
        lgbt_friendly: true
      },
      lunch: {
        activity: "Lunch at welcoming village restaurants",
        venue: "Blue Mountain Village Restaurants",
        website: "https://www.bluemountainvillage.ca/dining",
        description: "Dine at inclusive establishments",
        lgbt_friendly: true
      },
      afternoon: {
        activity: "Spa experience at Scandinave Spa",
        venue: "Scandinave Spa Blue Mountain",
        website: "https://www.scandinave.com/en/blue-mountain",
        description: "Relaxing spa treatment in inclusive environment",
        lgbt_friendly: true
      },
      evening: {
        activity: "Evening dining at inclusive establishments",
        venue: "Blue Mountain Village",
        website: "https://www.bluemountainvillage.ca",
        description: "Dinner at welcoming village restaurants",
        lgbt_friendly: true
      }
    },
    outdoorsDay: {
      morning: {
        activity: "Mountain biking or hiking",
        venue: "Blue Mountain Trails",
        website: "https://www.bluemountain.ca/activities",
        description: "Explore mountain trails and paths",
        difficulty: "Easy to Difficult",
        duration: "2-4 hours"
      },
      mid_morning: {
        activity: "Gondola ride for scenic views",
        venue: "Blue Mountain Gondola",
        website: "https://www.bluemountain.ca/activities/gondola",
        description: "Panoramic views of Georgian Bay",
        duration: "30 minutes"
      },
      lunch: {
        activity: "Outdoor dining at mountain restaurants",
        venue: "Blue Mountain Restaurants",
        description: "Al fresco dining with mountain views",
        price_range: "$15-35"
      },
      afternoon: {
        activity: "Water activities on Georgian Bay",
        venue: "Georgian Bay",
        description: "Swimming, kayaking, or beach activities",
        duration: "2-3 hours"
      },
      evening: {
        activity: "Cycling through the area",
        venue: "Blue Mountain Area",
        description: "Scenic cycling routes",
        duration: "1-2 hours",
        difficulty: "Easy to Moderate"
      }
    },
    barRestaurantDay: {
      morning: {
        activity: "Breakfast at village cafés",
        venue: "Blue Mountain Village Cafés",
        website: "https://www.bluemountainvillage.ca/dining",
        cuisine: "Mountain breakfast fare",
        price_range: "$10-20"
      },
      mid_morning: {
        activity: "Coffee at mountain coffee shops",
        venue: "Blue Mountain Coffee Shops",
        description: "Artisanal coffee in mountain setting",
        price_range: "$4-8"
      },
      lunch: {
        activity: "Lunch at mountain restaurants",
        venue: "Blue Mountain Restaurants",
        website: "https://www.bluemountainvillage.ca/dining",
        cuisine: "Mountain cuisine",
        price_range: "$15-35"
      },
      afternoon: {
        activity: "Afternoon coffee breaks",
        venue: "Blue Mountain Cafés",
        description: "Refreshments throughout the day",
        price_range: "$4-8"
      },
      evening: {
        activity: "Dinner at fine dining establishments",
        venue: "Blue Mountain Fine Dining",
        website: "https://www.bluemountainvillage.ca/dining",
        cuisine: "Upscale mountain dining",
        price_range: "$40-80"
      }
    }
  },
  dt6: {
    // Sandbanks Provincial Park
    general: {
      morning: {
        activity: "Early morning beach walk",
        venue: "Sandbanks Provincial Park",
        website: "https://www.ontarioparks.com/park/sandbanks",
        address: "3004 County Rd 12, Picton, ON",
        phone: "+1-613-393-3319",
        description: "Start your day with a peaceful beach walk",
        best_time: "6:00-8:00 AM"
      },
      mid_morning: {
        activity: "Explore the sand dunes",
        venue: "Sandbanks Dunes",
        website: "https://www.ontarioparks.com/park/sandbanks",
        description: "Hike through the famous sand dunes",
        difficulty: "Easy",
        duration: "1-2 hours"
      },
      lunch: {
        activity: "Beachside picnic",
        venue: "Sandbanks Beach",
        description: "Picnic with beautiful lake views",
        facilities: "Picnic tables, washrooms, parking"
      },
      afternoon: {
        activity: "Swimming and beach activities",
        venue: "Sandbanks Beach",
        description: "Enjoy the pristine beaches and clear water",
        duration: "2-3 hours"
      },
      evening: {
        activity: "Sunset at the beach",
        venue: "Sandbanks Beach",
        description: "Spectacular sunset views over Lake Ontario",
        best_time: "7:00-9:00 PM"
      }
    },
    gayDayIn: {
      morning: {
        activity: "LGBTQ+ friendly beach morning",
        venue: "Sandbanks Provincial Park",
        website: "https://www.ontarioparks.com/park/sandbanks",
        description: "Welcoming beach environment for all visitors",
        lgbt_friendly: true
      },
      mid_morning: {
        activity: "Inclusive hiking on dunes",
        venue: "Sandbanks Dunes",
        description: "Explore the dunes in an inclusive environment",
        lgbt_friendly: true
      },
      lunch: {
        activity: "Beach picnic in welcoming atmosphere",
        venue: "Sandbanks Beach",
        description: "Enjoy lunch in an inclusive setting",
        lgbt_friendly: true
      },
      afternoon: {
        activity: "Swimming and beach activities",
        venue: "Sandbanks Beach",
        description: "Beach activities in welcoming environment",
        lgbt_friendly: true
      },
      evening: {
        activity: "Romantic sunset at the beach",
        venue: "Sandbanks Beach",
        description: "Perfect sunset spot for couples",
        lgbt_friendly: true
      }
    },
    outdoorsDay: {
      morning: {
        activity: "Sunrise beach walk",
        venue: "Sandbanks Beach",
        description: "Early morning beach exploration",
        best_time: "5:00-7:00 AM"
      },
      mid_morning: {
        activity: "Hiking the dune trails",
        venue: "Sandbanks Dunes",
        website: "https://www.ontarioparks.com/park/sandbanks",
        description: "Explore the extensive dune system",
        difficulty: "Easy to Moderate",
        duration: "2-3 hours"
      },
      lunch: {
        activity: "Outdoor picnic in scenic location",
        venue: "Sandbanks Picnic Areas",
        description: "Picnic with panoramic lake views",
        facilities: "Picnic tables, washrooms"
      },
      afternoon: {
        activity: "Water activities on Lake Ontario",
        venue: "Lake Ontario",
        description: "Swimming, kayaking, or beach activities",
        duration: "2-3 hours"
      },
      evening: {
        activity: "Evening beach activities",
        venue: "Sandbanks Beach",
        description: "Sunset activities and beach relaxation",
        best_time: "6:00-8:00 PM"
      }
    },
    barRestaurantDay: {
      morning: {
        activity: "Breakfast at nearby cafés",
        venue: "Picton Cafés",
        description: "Local breakfast options near the park",
        price_range: "$8-15"
      },
      mid_morning: {
        activity: "Coffee at local spots",
        venue: "County Coffee Shops",
        description: "Refreshments before beach activities",
        price_range: "$4-8"
      },
      lunch: {
        activity: "Lunch at county restaurants",
        venue: "Prince Edward County Restaurants",
        description: "Local dining options near the park",
        price_range: "$12-25"
      },
      afternoon: {
        activity: "Afternoon refreshments",
        venue: "County Cafés",
        description: "Afternoon coffee and snacks",
        price_range: "$4-8"
      },
      evening: {
        activity: "Dinner at county establishments",
        venue: "Prince Edward County Dining",
        description: "Evening dining in the county",
        price_range: "$20-50"
      }
    }
  }
};

// Function to enhance a day trip with detailed day plans
function enhanceDayTrip(dayTrip, enhancedPlans) {
  if (enhancedPlans && enhancedPlans[dayTrip.id]) {
    dayTrip.dayIn = enhancedPlans[dayTrip.id];
  }
  return dayTrip;
}

// Enhance all day trips
daytripsData.daytrips = daytripsData.daytrips.map(dayTrip => 
  enhanceDayTrip(dayTrip, enhancedDayPlans)
);

// Write the enhanced data back to file
fs.writeFileSync(daytripsPath, JSON.stringify(daytripsData, null, 2));

console.log('Enhanced more day trips with detailed day plans!');
console.log(`Enhanced ${Object.keys(enhancedDayPlans).length} additional day trips with detailed recommendations.`); 