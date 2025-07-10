const fs = require('fs');
const path = require('path');

// Read the current daytrips data
const daytripsPath = path.join(__dirname, '../public/daytrips_data.json');
const daytripsData = JSON.parse(fs.readFileSync(daytripsPath, 'utf8'));

// Enhanced day plans for final popular day trips
const enhancedDayPlans = {
  dt10: {
    // Thousand Islands
    general: {
      morning: {
        activity: "Breakfast at Gananoque Inn",
        venue: "Gananoque Inn",
        website: "https://www.gananoqueinn.com",
        address: "550 Stone St S, Gananoque, ON",
        phone: "+1-613-382-2165",
        cuisine: "Traditional Canadian breakfast",
        price_range: "$12-20",
        lgbt_friendly: true
      },
      mid_morning: {
        activity: "Thousand Islands cruise",
        venue: "Gananoque Boat Line",
        website: "https://www.gananoqueboatline.com",
        address: "6 King St E, Gananoque, ON",
        phone: "+1-613-382-2144",
        description: "Scenic boat tour through the Thousand Islands",
        admission: "$35 per adult",
        lgbt_friendly: true
      },
      lunch: {
        activity: "Lunch at waterfront restaurants",
        venue: "Gananoque Waterfront",
        website: "https://www.gananoque.ca",
        description: "Dine with beautiful island views",
        price_range: "$15-30",
        lgbt_friendly: true
      },
      afternoon: {
        activity: "Explore Boldt Castle",
        venue: "Boldt Castle",
        website: "https://www.boldtcastle.com",
        address: "Heart Island, Alexandria Bay, NY",
        description: "Historic castle on Heart Island",
        admission: "$12 USD per adult"
      },
      evening: {
        activity: "Dinner at Gananoque restaurants",
        venue: "Gananoque Dining",
        website: "https://www.gananoque.ca",
        description: "Evening dining in historic town",
        lgbt_friendly: true
      }
    },
    gayDayIn: {
      morning: {
        activity: "LGBTQ+ friendly breakfast",
        venue: "Gananoque Inn",
        website: "https://www.gananoqueinn.com",
        description: "Welcoming atmosphere for LGBTQ+ visitors",
        lgbt_friendly: true
      },
      mid_morning: {
        activity: "Inclusive boat tour experience",
        venue: "Gananoque Boat Line",
        website: "https://www.gananoqueboatline.com",
        description: "Enjoy the cruise in welcoming environment",
        lgbt_friendly: true
      },
      lunch: {
        activity: "Lunch at LGBTQ+ friendly restaurants",
        venue: "Gananoque Waterfront",
        description: "Dine at inclusive waterfront establishments",
        lgbt_friendly: true
      },
      afternoon: {
        activity: "Explore inclusive attractions",
        venue: "Thousand Islands Attractions",
        description: "Visit welcoming local sites",
        lgbt_friendly: true
      },
      evening: {
        activity: "Dinner at welcoming establishments",
        venue: "Gananoque Dining",
        description: "Evening dining at inclusive restaurants",
        lgbt_friendly: true
      }
    },
    outdoorsDay: {
      morning: {
        activity: "Morning kayaking on St. Lawrence",
        venue: "St. Lawrence River",
        website: "https://www.gananoque.ca/activities",
        description: "Paddle through the scenic Thousand Islands",
        duration: "2-3 hours",
        difficulty: "Moderate"
      },
      mid_morning: {
        activity: "Hiking at Thousand Islands National Park",
        venue: "Thousand Islands National Park",
        website: "https://www.pc.gc.ca/en/pn-np/on/1000",
        description: "Explore the park's scenic trails",
        difficulty: "Easy to Moderate",
        duration: "2-3 hours"
      },
      lunch: {
        activity: "Island picnic",
        venue: "Thousand Islands",
        description: "Picnic on one of the scenic islands",
        facilities: "Bring your own supplies"
      },
      afternoon: {
        activity: "Swimming and water activities",
        venue: "St. Lawrence River",
        description: "Enjoy the clear waters of the river",
        duration: "2-3 hours"
      },
      evening: {
        activity: "Sunset cruise",
        venue: "Gananoque Boat Line",
        website: "https://www.gananoqueboatline.com",
        description: "Evening cruise with sunset views",
        best_time: "7:00-9:00 PM"
      }
    },
    barRestaurantDay: {
      morning: {
        activity: "Breakfast at waterfront cafés",
        venue: "Gananoque Cafés",
        description: "Waterfront breakfast options",
        price_range: "$10-18"
      },
      mid_morning: {
        activity: "Coffee at local coffee shops",
        venue: "Gananoque Coffee Shops",
        description: "Refreshments with river views",
        price_range: "$4-8"
      },
      lunch: {
        activity: "Lunch at waterfront restaurants",
        venue: "Gananoque Waterfront",
        website: "https://www.gananoque.ca",
        cuisine: "Fresh local cuisine",
        price_range: "$15-30"
      },
      afternoon: {
        activity: "Afternoon refreshments",
        venue: "Gananoque Cafés",
        description: "Afternoon coffee and snacks",
        price_range: "$4-8"
      },
      evening: {
        activity: "Dinner at fine dining establishments",
        venue: "Gananoque Fine Dining",
        description: "Upscale dining with river views",
        price_range: "$30-60"
      }
    }
  },
  dt11: {
    // Elora Gorge
    general: {
      morning: {
        activity: "Breakfast at The Friendly Society",
        venue: "The Friendly Society",
        website: "https://www.thefriendlysociety.ca",
        address: "104 Geddes St, Elora, ON",
        phone: "+1-519-846-3333",
        cuisine: "Local café fare",
        price_range: "$8-15",
        lgbt_friendly: true
      },
      mid_morning: {
        activity: "Explore Elora Gorge Conservation Area",
        venue: "Elora Gorge Conservation Area",
        website: "https://www.grandriver.ca/en/outdoor-recreation/elora-gorge.aspx",
        address: "7400 Wellington County Rd 21, Elora, ON",
        phone: "+1-519-846-9742",
        description: "Hike along the scenic gorge",
        admission: "$7.50 per adult",
        lgbt_friendly: true
      },
      lunch: {
        activity: "Lunch at Elora Mill Hotel",
        venue: "Elora Mill Hotel",
        website: "https://www.eloramill.com",
        address: "77 Mill St W, Elora, ON",
        phone: "+1-519-846-5356",
        cuisine: "Fine dining with gorge views",
        price_range: "$25-50",
        lgbt_friendly: true
      },
      afternoon: {
        activity: "Visit Elora's historic downtown",
        venue: "Downtown Elora",
        website: "https://www.elora.info",
        description: "Explore boutique shops and galleries",
        lgbt_friendly: true
      },
      evening: {
        activity: "Dinner at local establishments",
        venue: "Elora Dining",
        website: "https://www.elora.info",
        description: "Evening dining in historic town",
        lgbt_friendly: true
      }
    },
    gayDayIn: {
      morning: {
        activity: "LGBTQ+ friendly breakfast",
        venue: "The Friendly Society",
        website: "https://www.thefriendlysociety.ca",
        description: "Welcoming atmosphere for LGBTQ+ visitors",
        lgbt_friendly: true
      },
      mid_morning: {
        activity: "Inclusive gorge exploration",
        venue: "Elora Gorge Conservation Area",
        description: "Explore the gorge in welcoming environment",
        lgbt_friendly: true
      },
      lunch: {
        activity: "Lunch at LGBTQ+ friendly restaurants",
        venue: "Elora Mill Hotel",
        website: "https://www.eloramill.com",
        description: "Dine at inclusive establishments",
        lgbt_friendly: true
      },
      afternoon: {
        activity: "Explore inclusive downtown area",
        venue: "Downtown Elora",
        description: "Visit welcoming shops and galleries",
        lgbt_friendly: true
      },
      evening: {
        activity: "Dinner at welcoming establishments",
        venue: "Elora Dining",
        description: "Evening dining at inclusive restaurants",
        lgbt_friendly: true
      }
    },
    outdoorsDay: {
      morning: {
        activity: "Early morning gorge hike",
        venue: "Elora Gorge Conservation Area",
        website: "https://www.grandriver.ca/en/outdoor-recreation/elora-gorge.aspx",
        description: "Hike the gorge trails in the cool morning",
        difficulty: "Moderate",
        duration: "2-3 hours"
      },
      mid_morning: {
        activity: "Rock climbing at the gorge",
        venue: "Elora Gorge",
        description: "Climbing opportunities in the gorge",
        difficulty: "Advanced",
        duration: "2-4 hours"
      },
      lunch: {
        activity: "Picnic at gorge lookout",
        venue: "Elora Gorge Lookout",
        description: "Picnic with spectacular gorge views",
        facilities: "Picnic tables available"
      },
      afternoon: {
        activity: "Tubing on the Grand River",
        venue: "Grand River",
        description: "Tubing adventure through the gorge",
        duration: "2-3 hours",
        difficulty: "Moderate"
      },
      evening: {
        activity: "Sunset at gorge viewpoint",
        venue: "Elora Gorge Viewpoint",
        description: "Spectacular sunset views of the gorge",
        best_time: "7:00-9:00 PM"
      }
    },
    barRestaurantDay: {
      morning: {
        activity: "Breakfast at local cafés",
        venue: "Elora Cafés",
        description: "Local breakfast options in historic town",
        price_range: "$8-15"
      },
      mid_morning: {
        activity: "Coffee at artisanal coffee shops",
        venue: "Elora Coffee Shops",
        description: "Quality coffee in historic setting",
        price_range: "$4-8"
      },
      lunch: {
        activity: "Lunch at Elora Mill Hotel",
        venue: "Elora Mill Hotel",
        website: "https://www.eloramill.com",
        cuisine: "Fine dining with gorge views",
        price_range: "$25-50"
      },
      afternoon: {
        activity: "Afternoon tea at local spots",
        venue: "Elora Tea Rooms",
        description: "Afternoon refreshments in historic setting",
        price_range: "$8-15"
      },
      evening: {
        activity: "Dinner at fine dining establishments",
        venue: "Elora Fine Dining",
        description: "Upscale dining in historic town",
        price_range: "$30-70"
      }
    }
  },
  dt12: {
    // Ottawa
    general: {
      morning: {
        activity: "Breakfast at ByWard Market",
        venue: "ByWard Market",
        website: "https://www.byward-market.com",
        address: "ByWard Market, Ottawa, ON",
        description: "Start your day at Ottawa's famous market",
        lgbt_friendly: true
      },
      mid_morning: {
        activity: "Visit Parliament Hill",
        venue: "Parliament Hill",
        website: "https://www.parl.ca",
        address: "Wellington St, Ottawa, ON",
        phone: "+1-613-992-4793",
        description: "Tour Canada's iconic Parliament buildings",
        admission: "Free",
        lgbt_friendly: true
      },
      lunch: {
        activity: "Lunch at ByWard Market restaurants",
        venue: "ByWard Market Restaurants",
        website: "https://www.byward-market.com",
        description: "Diverse dining options in the market",
        price_range: "$15-35",
        lgbt_friendly: true
      },
      afternoon: {
        activity: "Visit National Gallery of Canada",
        venue: "National Gallery of Canada",
        website: "https://www.gallery.ca",
        address: "380 Sussex Dr, Ottawa, ON",
        phone: "+1-613-990-1985",
        description: "Explore Canada's premier art gallery",
        admission: "$20 per adult",
        lgbt_friendly: true
      },
      evening: {
        activity: "Dinner at Rideau Canal area",
        venue: "Rideau Canal Restaurants",
        website: "https://www.ottawatourism.ca",
        description: "Evening dining along the historic canal",
        lgbt_friendly: true
      }
    },
    gayDayIn: {
      morning: {
        activity: "LGBTQ+ friendly market breakfast",
        venue: "ByWard Market",
        website: "https://www.byward-market.com",
        description: "Welcoming market atmosphere for LGBTQ+ visitors",
        lgbt_friendly: true
      },
      mid_morning: {
        activity: "Visit inclusive attractions",
        venue: "Ottawa Attractions",
        description: "Explore welcoming Ottawa sites",
        lgbt_friendly: true
      },
      lunch: {
        activity: "Lunch at LGBTQ+ friendly restaurants",
        venue: "ByWard Market Restaurants",
        description: "Dine at inclusive market establishments",
        lgbt_friendly: true
      },
      afternoon: {
        activity: "Visit inclusive cultural sites",
        venue: "Ottawa Cultural Sites",
        description: "Explore welcoming cultural attractions",
        lgbt_friendly: true
      },
      evening: {
        activity: "Dinner at LGBTQ+ friendly establishments",
        venue: "Ottawa Dining",
        description: "Evening dining at inclusive restaurants",
        lgbt_friendly: true
      }
    },
    outdoorsDay: {
      morning: {
        activity: "Morning walk along Rideau Canal",
        venue: "Rideau Canal",
        website: "https://www.pc.gc.ca/en/lhn-nhs/on/rideau",
        description: "Scenic walk along the historic canal",
        duration: "1-2 hours",
        difficulty: "Easy"
      },
      mid_morning: {
        activity: "Hike in Gatineau Park",
        venue: "Gatineau Park",
        website: "https://www.ncc-ccn.gc.ca/places/gatineau-park",
        description: "Explore the beautiful park trails",
        difficulty: "Easy to Moderate",
        duration: "2-3 hours"
      },
      lunch: {
        activity: "Picnic at Major's Hill Park",
        venue: "Major's Hill Park",
        address: "Mackenzie Ave, Ottawa, ON",
        description: "Picnic with Parliament Hill views",
        facilities: "Picnic tables, washrooms"
      },
      afternoon: {
        activity: "Cycling along Ottawa River",
        venue: "Ottawa River Pathway",
        description: "Scenic cycling along the river",
        duration: "1-2 hours",
        difficulty: "Easy"
      },
      evening: {
        activity: "Sunset at Nepean Point",
        venue: "Nepean Point",
        description: "Spectacular sunset views over the Ottawa River",
        best_time: "7:00-9:00 PM"
      }
    },
    barRestaurantDay: {
      morning: {
        activity: "Breakfast at ByWard Market cafés",
        venue: "ByWard Market Cafés",
        description: "Market breakfast options",
        price_range: "$8-15"
      },
      mid_morning: {
        activity: "Coffee at Ottawa coffee shops",
        venue: "Ottawa Coffee Shops",
        description: "Quality coffee in capital city",
        price_range: "$4-8"
      },
      lunch: {
        activity: "Lunch at ByWard Market restaurants",
        venue: "ByWard Market Restaurants",
        website: "https://www.byward-market.com",
        cuisine: "Diverse market cuisine",
        price_range: "$15-35"
      },
      afternoon: {
        activity: "Afternoon tea at Parliament Hill",
        venue: "Parliament Hill",
        description: "Afternoon refreshments with historic views",
        price_range: "$8-15"
      },
      evening: {
        activity: "Dinner at Rideau Canal restaurants",
        venue: "Rideau Canal Restaurants",
        description: "Evening dining along the historic canal",
        price_range: "$25-60"
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

console.log('Enhanced final popular day trips with detailed day plans!');
console.log(`Enhanced ${Object.keys(enhancedDayPlans).length} final day trips with detailed recommendations.`);
console.log('Total enhanced day trips: 12 out of 50 day trips now have detailed, timeline-aligned recommendations!'); 