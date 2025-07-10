const fs = require('fs');
const path = require('path');

// Read the current daytrips data
const daytripsPath = path.join(__dirname, '../public/daytrips_data.json');
const daytripsData = JSON.parse(fs.readFileSync(daytripsPath, 'utf8'));

// Enhanced day plans for popular day trips
const enhancedDayPlans = {
  dt7: {
    // Collingwood
    general: {
      morning: {
        activity: "Breakfast at The Mad Dog Café",
        venue: "The Mad Dog Café",
        website: "https://www.maddogcafe.ca",
        address: "24 Hurontario St, Collingwood, ON",
        phone: "+1-705-444-2233",
        cuisine: "Local café fare",
        price_range: "$8-15",
        lgbt_friendly: true
      },
      mid_morning: {
        activity: "Visit Collingwood Museum",
        venue: "Collingwood Museum",
        website: "https://www.collingwood.ca/museum",
        address: "45 St Paul St, Collingwood, ON",
        phone: "+1-705-445-4811",
        description: "Learn about the town's rich history",
        admission: "Free"
      },
      lunch: {
        activity: "Lunch at The Huron Club",
        venue: "The Huron Club",
        website: "https://www.huronclub.ca",
        address: "94 Hurontario St, Collingwood, ON",
        phone: "+1-705-444-2233",
        cuisine: "Canadian pub fare",
        price_range: "$15-30",
        lgbt_friendly: true
      },
      afternoon: {
        activity: "Explore downtown Collingwood",
        venue: "Downtown Collingwood",
        website: "https://www.collingwood.ca",
        description: "Stroll through boutique shops and galleries",
        lgbt_friendly: true
      },
      evening: {
        activity: "Dinner at The Georgian Bay Hotel",
        venue: "The Georgian Bay Hotel",
        website: "https://www.georgianbayhotel.com",
        address: "30 Pine St, Collingwood, ON",
        phone: "+1-705-445-5401",
        cuisine: "Fine dining with lake views",
        price_range: "$30-60",
        lgbt_friendly: true
      }
    },
    gayDayIn: {
      morning: {
        activity: "LGBTQ+ friendly café breakfast",
        venue: "The Mad Dog Café",
        website: "https://www.maddogcafe.ca",
        description: "Welcoming atmosphere for LGBTQ+ visitors",
        lgbt_friendly: true
      },
      mid_morning: {
        activity: "Visit inclusive local attractions",
        venue: "Collingwood Attractions",
        description: "Explore welcoming local sites",
        lgbt_friendly: true
      },
      lunch: {
        activity: "Lunch at LGBTQ+ friendly establishments",
        venue: "Collingwood Restaurants",
        description: "Dine at inclusive local restaurants",
        lgbt_friendly: true
      },
      afternoon: {
        activity: "Explore inclusive downtown area",
        venue: "Downtown Collingwood",
        description: "Visit welcoming shops and galleries",
        lgbt_friendly: true
      },
      evening: {
        activity: "Dinner at inclusive establishments",
        venue: "Collingwood Fine Dining",
        description: "Evening dining at welcoming restaurants",
        lgbt_friendly: true
      }
    },
    outdoorsDay: {
      morning: {
        activity: "Morning hike at Pretty River Valley",
        venue: "Pretty River Valley Provincial Park",
        website: "https://www.ontarioparks.com/park/prettyriver",
        address: "Pretty River Valley Rd, Collingwood, ON",
        description: "Scenic hiking trails with valley views",
        difficulty: "Easy to Moderate",
        duration: "2-3 hours"
      },
      mid_morning: {
        activity: "Cycling the Georgian Trail",
        venue: "Georgian Trail",
        website: "https://www.georgiantrail.ca",
        description: "Scenic cycling route along Georgian Bay",
        duration: "1-2 hours",
        difficulty: "Easy"
      },
      lunch: {
        activity: "Picnic at Sunset Point Park",
        venue: "Sunset Point Park",
        address: "1 St Lawrence St, Collingwood, ON",
        description: "Scenic picnic spot with lake views",
        facilities: "Picnic tables, washrooms, parking"
      },
      afternoon: {
        activity: "Water activities on Georgian Bay",
        venue: "Georgian Bay",
        description: "Swimming, kayaking, or beach activities",
        duration: "2-3 hours"
      },
      evening: {
        activity: "Sunset at Sunset Point",
        venue: "Sunset Point",
        description: "Beautiful sunset views over Georgian Bay",
        best_time: "7:00-9:00 PM"
      }
    },
    barRestaurantDay: {
      morning: {
        activity: "Breakfast at local cafés",
        venue: "Collingwood Cafés",
        description: "Local breakfast options in town",
        price_range: "$8-15"
      },
      mid_morning: {
        activity: "Coffee at artisanal coffee shops",
        venue: "Collingwood Coffee Shops",
        description: "Quality coffee in mountain town setting",
        price_range: "$4-8"
      },
      lunch: {
        activity: "Lunch at local restaurants",
        venue: "Collingwood Restaurants",
        website: "https://www.collingwood.ca",
        cuisine: "Local cuisine",
        price_range: "$12-25"
      },
      afternoon: {
        activity: "Afternoon coffee and snacks",
        venue: "Collingwood Cafés",
        description: "Refreshments throughout the day",
        price_range: "$4-8"
      },
      evening: {
        activity: "Dinner at fine dining establishments",
        venue: "Collingwood Fine Dining",
        description: "Upscale dining in mountain town",
        price_range: "$25-60"
      }
    }
  },
  dt8: {
    // Wasaga Beach
    general: {
      morning: {
        activity: "Breakfast at Beach House Restaurant",
        venue: "Beach House Restaurant",
        website: "https://www.beachhouserestaurant.ca",
        address: "11 Main St, Wasaga Beach, ON",
        phone: "+1-705-429-2244",
        cuisine: "Beach breakfast fare",
        price_range: "$10-20",
        lgbt_friendly: true
      },
      mid_morning: {
        activity: "Morning beach walk",
        venue: "Wasaga Beach",
        website: "https://www.wasagabeach.com",
        address: "Wasaga Beach Provincial Park",
        description: "Stroll along the world's longest freshwater beach",
        lgbt_friendly: true
      },
      lunch: {
        activity: "Lunch at beachside restaurants",
        venue: "Wasaga Beach Restaurants",
        website: "https://www.wasagabeach.com/dining",
        description: "Dine with beach views",
        price_range: "$12-25",
        lgbt_friendly: true
      },
      afternoon: {
        activity: "Beach activities and swimming",
        venue: "Wasaga Beach",
        description: "Enjoy the pristine beaches and clear water",
        duration: "2-3 hours"
      },
      evening: {
        activity: "Dinner at local establishments",
        venue: "Wasaga Beach Dining",
        website: "https://www.wasagabeach.com",
        description: "Evening dining options in beach town",
        lgbt_friendly: true
      }
    },
    gayDayIn: {
      morning: {
        activity: "LGBTQ+ friendly beach morning",
        venue: "Wasaga Beach",
        website: "https://www.wasagabeach.com",
        description: "Welcoming beach environment for all visitors",
        lgbt_friendly: true
      },
      mid_morning: {
        activity: "Inclusive beach activities",
        venue: "Wasaga Beach",
        description: "Beach activities in welcoming atmosphere",
        lgbt_friendly: true
      },
      lunch: {
        activity: "Lunch at LGBTQ+ friendly restaurants",
        venue: "Wasaga Beach Restaurants",
        description: "Dine at inclusive beach establishments",
        lgbt_friendly: true
      },
      afternoon: {
        activity: "Beach activities in inclusive setting",
        venue: "Wasaga Beach",
        description: "Swimming and beach fun in welcoming environment",
        lgbt_friendly: true
      },
      evening: {
        activity: "Evening dining at welcoming establishments",
        venue: "Wasaga Beach Dining",
        description: "Dinner at inclusive beach restaurants",
        lgbt_friendly: true
      }
    },
    outdoorsDay: {
      morning: {
        activity: "Sunrise beach walk",
        venue: "Wasaga Beach",
        description: "Early morning beach exploration",
        best_time: "5:00-7:00 AM"
      },
      mid_morning: {
        activity: "Hiking at Wasaga Beach Provincial Park",
        venue: "Wasaga Beach Provincial Park",
        website: "https://www.ontarioparks.com/park/wasagabeach",
        description: "Explore the park's trails and natural areas",
        difficulty: "Easy",
        duration: "1-2 hours"
      },
      lunch: {
        activity: "Beachside picnic",
        venue: "Wasaga Beach",
        description: "Picnic with beautiful beach views",
        facilities: "Picnic tables, washrooms, parking"
      },
      afternoon: {
        activity: "Water activities on Georgian Bay",
        venue: "Georgian Bay",
        description: "Swimming, kayaking, or beach activities",
        duration: "2-3 hours"
      },
      evening: {
        activity: "Sunset at the beach",
        venue: "Wasaga Beach",
        description: "Spectacular sunset views over Georgian Bay",
        best_time: "7:00-9:00 PM"
      }
    },
    barRestaurantDay: {
      morning: {
        activity: "Breakfast at beach cafés",
        venue: "Wasaga Beach Cafés",
        description: "Beach breakfast options",
        price_range: "$8-15"
      },
      mid_morning: {
        activity: "Coffee at beach coffee shops",
        venue: "Wasaga Beach Coffee Shops",
        description: "Refreshments with beach views",
        price_range: "$4-8"
      },
      lunch: {
        activity: "Lunch at beachside restaurants",
        venue: "Wasaga Beach Restaurants",
        website: "https://www.wasagabeach.com/dining",
        cuisine: "Beach cuisine",
        price_range: "$12-25"
      },
      afternoon: {
        activity: "Afternoon beach refreshments",
        venue: "Wasaga Beach Cafés",
        description: "Afternoon coffee and snacks",
        price_range: "$4-8"
      },
      evening: {
        activity: "Dinner at beach establishments",
        venue: "Wasaga Beach Dining",
        description: "Evening dining in beach town",
        price_range: "$15-40"
      }
    }
  },
  dt9: {
    // Scenic Caves Nature Adventures
    general: {
      morning: {
        activity: "Breakfast at nearby cafés",
        venue: "Collingwood Area Cafés",
        description: "Local breakfast options near the caves",
        price_range: "$8-15",
        lgbt_friendly: true
      },
      mid_morning: {
        activity: "Explore the scenic caves",
        venue: "Scenic Caves Nature Adventures",
        website: "https://www.sceniccaves.com",
        address: "260 Scenic Caves Rd, The Blue Mountains, ON",
        phone: "+1-705-446-0256",
        description: "Guided tours through natural caves",
        admission: "$25 per adult",
        lgbt_friendly: true
      },
      lunch: {
        activity: "Lunch at Scenic Caves Café",
        venue: "Scenic Caves Café",
        website: "https://www.sceniccaves.com/dining",
        description: "Dine with mountain views",
        price_range: "$12-25",
        lgbt_friendly: true
      },
      afternoon: {
        activity: "Walk the suspension bridge",
        venue: "Scenic Caves Suspension Bridge",
        website: "https://www.sceniccaves.com/activities",
        description: "Cross the longest suspension bridge in Southern Ontario",
        lgbt_friendly: true
      },
      evening: {
        activity: "Dinner at nearby restaurants",
        venue: "Blue Mountains Area Restaurants",
        description: "Evening dining in the mountain area",
        lgbt_friendly: true
      }
    },
    gayDayIn: {
      morning: {
        activity: "LGBTQ+ friendly morning activities",
        venue: "Scenic Caves Nature Adventures",
        website: "https://www.sceniccaves.com",
        description: "Welcoming outdoor adventure experience",
        lgbt_friendly: true
      },
      mid_morning: {
        activity: "Inclusive cave exploration",
        venue: "Scenic Caves",
        description: "Explore caves in welcoming environment",
        lgbt_friendly: true
      },
      lunch: {
        activity: "Lunch at inclusive café",
        venue: "Scenic Caves Café",
        description: "Dine in welcoming atmosphere",
        lgbt_friendly: true
      },
      afternoon: {
        activity: "Suspension bridge walk",
        venue: "Scenic Caves Suspension Bridge",
        description: "Cross bridge in inclusive setting",
        lgbt_friendly: true
      },
      evening: {
        activity: "Dinner at LGBTQ+ friendly restaurants",
        venue: "Blue Mountains Area Restaurants",
        description: "Evening dining at welcoming establishments",
        lgbt_friendly: true
      }
    },
    outdoorsDay: {
      morning: {
        activity: "Early morning cave exploration",
        venue: "Scenic Caves",
        website: "https://www.sceniccaves.com",
        description: "Explore caves in the cool morning air",
        difficulty: "Moderate",
        duration: "1-2 hours"
      },
      mid_morning: {
        activity: "Hiking the nature trails",
        venue: "Scenic Caves Trails",
        website: "https://www.sceniccaves.com/activities",
        description: "Hike through beautiful natural landscapes",
        difficulty: "Easy to Moderate",
        duration: "2-3 hours"
      },
      lunch: {
        activity: "Outdoor picnic with mountain views",
        venue: "Scenic Caves Picnic Area",
        description: "Picnic with panoramic mountain views",
        facilities: "Picnic tables, washrooms"
      },
      afternoon: {
        activity: "Suspension bridge adventure",
        venue: "Scenic Caves Suspension Bridge",
        description: "Cross the longest suspension bridge in Southern Ontario",
        duration: "30-45 minutes"
      },
      evening: {
        activity: "Sunset views from lookout points",
        venue: "Scenic Caves Lookout",
        description: "Spectacular sunset views over Georgian Bay",
        best_time: "7:00-9:00 PM"
      }
    },
    barRestaurantDay: {
      morning: {
        activity: "Breakfast at nearby cafés",
        venue: "Blue Mountains Area Cafés",
        description: "Local breakfast options near the caves",
        price_range: "$8-15"
      },
      mid_morning: {
        activity: "Coffee at mountain coffee shops",
        venue: "Blue Mountains Coffee Shops",
        description: "Refreshments before cave exploration",
        price_range: "$4-8"
      },
      lunch: {
        activity: "Lunch at Scenic Caves Café",
        venue: "Scenic Caves Café",
        website: "https://www.sceniccaves.com/dining",
        cuisine: "Mountain cuisine",
        price_range: "$12-25"
      },
      afternoon: {
        activity: "Afternoon refreshments",
        venue: "Scenic Caves Café",
        description: "Afternoon coffee and snacks",
        price_range: "$4-8"
      },
      evening: {
        activity: "Dinner at mountain restaurants",
        venue: "Blue Mountains Area Restaurants",
        description: "Evening dining in mountain setting",
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

console.log('Enhanced popular day trips with detailed day plans!');
console.log(`Enhanced ${Object.keys(enhancedDayPlans).length} popular day trips with detailed recommendations.`); 