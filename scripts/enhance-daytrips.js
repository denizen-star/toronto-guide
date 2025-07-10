const fs = require('fs');
const path = require('path');

// Read the current daytrips data
const daytripsPath = path.join(__dirname, '../public/daytrips_data.json');
const daytripsData = JSON.parse(fs.readFileSync(daytripsPath, 'utf8'));

// Enhanced day plans for each day trip
const enhancedDayPlans = {
  dt1: {
    // Algonquin Park - already enhanced
    general: {
      morning: {
        activity: "Sunrise paddle on Canoe Lake",
        venue: "Canoe Lake, Algonquin Park",
        website: "https://www.algonquinpark.on.ca/visit/activities/canoeing",
        description: "Start your day with a peaceful paddle on the iconic Canoe Lake, watching the sunrise over the pristine waters",
        booking_required: true,
        best_time: "6:00-8:00 AM"
      },
      mid_morning: {
        activity: "Hike the Lookout Trail",
        venue: "Highway 60, Algonquin Park",
        website: "https://www.algonquinpark.on.ca/visit/activities/hiking",
        description: "2.1km trail with panoramic views of the park's iconic landscape",
        difficulty: "Moderate",
        duration: "1-2 hours"
      },
      lunch: {
        activity: "Lunch at Visitor Centre",
        venue: "Algonquin Visitor Centre",
        website: "https://www.algonquinpark.on.ca/visit/visitor-centre",
        phone: "+1-705-633-5572",
        cuisine: "Canadian café fare",
        price_range: "$10-20"
      },
      afternoon: {
        activity: "Explore Logging Museum",
        venue: "Algonquin Logging Museum",
        website: "https://www.algonquinpark.on.ca/visit/activities/logging-museum",
        description: "Learn about the park's rich logging history and Indigenous heritage",
        admission: "Free with park entry"
      },
      evening: {
        activity: "Sunset wildlife viewing",
        venue: "Highway 60 corridor",
        description: "Watch for moose, deer, and other wildlife during golden hour",
        best_time: "6:00-8:00 PM",
        tips: "Bring binoculars and stay in your vehicle"
      }
    },
    gayDayIn: {
      morning: {
        activity: "Peaceful paddle on Smoke Lake",
        venue: "Smoke Lake, Algonquin Park",
        website: "https://www.algonquinpark.on.ca/visit/activities/canoeing",
        description: "Begin with a serene morning paddle on the quieter Smoke Lake, perfect for couples",
        lgbt_friendly: "Inclusive outdoor experience",
        best_time: "6:00-8:00 AM"
      },
      mid_morning: {
        activity: "Visit Algonquin Art Centre",
        venue: "Algonquin Art Centre",
        website: "https://www.algonquinartcentre.com",
        phone: "+1-705-633-5555",
        description: "Cultural experiences with rotating exhibitions inspired by the park",
        lgbt_programming: "Inclusive cultural programming"
      },
      lunch: {
        activity: "Picnic lunch at Lake of Two Rivers",
        venue: "Lake of Two Rivers Beach",
        description: "Romantic picnic spot with beautiful lake views",
        facilities: "Picnic tables, washrooms, parking",
        lgbt_friendly: "Welcoming atmosphere"
      },
      afternoon: {
        activity: "Hike Centennial Ridges Trail",
        venue: "Centennial Ridges Trail",
        website: "https://www.algonquinpark.on.ca/visit/activities/hiking",
        description: "Spectacular 10.4km trail with breathtaking views",
        difficulty: "Challenging",
        duration: "4-5 hours",
        lgbt_friendly: "Inclusive outdoor experience"
      },
      evening: {
        activity: "Romantic sunset at Opeongo Lake",
        venue: "Opeongo Lake",
        description: "End your day with a romantic sunset at the largest lake in the park",
        best_time: "7:00-9:00 PM",
        lgbt_friendly: "Perfect for couples"
      }
    },
    outdoorsDay: {
      morning: {
        activity: "Early morning wildlife photography",
        venue: "Highway 60 corridor",
        description: "Capture wildlife in the golden morning light",
        best_time: "5:00-7:00 AM",
        tips: "Bring telephoto lens and tripod"
      },
      mid_morning: {
        activity: "Hike the Centennial Ridges Trail",
        venue: "Centennial Ridges Trail",
        website: "https://www.algonquinpark.on.ca/visit/activities/hiking",
        description: "Challenging 10.4km trail with spectacular views",
        difficulty: "Difficult",
        duration: "4-5 hours"
      },
      lunch: {
        activity: "Backcountry picnic",
        venue: "Scenic viewpoint along trail",
        description: "Enjoy lunch with panoramic views of the park",
        tips: "Pack light, leave no trace"
      },
      afternoon: {
        activity: "Canoe on Opeongo Lake",
        venue: "Opeongo Lake",
        website: "https://www.algonquinpark.on.ca/visit/activities/canoeing",
        description: "Paddle on the largest lake in the park",
        duration: "2-3 hours",
        difficulty: "Moderate"
      },
      evening: {
        activity: "Sunset at Lookout Trail",
        venue: "Lookout Trail",
        description: "End the day with spectacular sunset views",
        best_time: "7:00-9:00 PM"
      }
    },
    barRestaurantDay: {
      morning: {
        activity: "Breakfast at Visitor Centre Café",
        venue: "Algonquin Visitor Centre",
        website: "https://www.algonquinpark.on.ca/visit/visitor-centre",
        cuisine: "Canadian breakfast fare",
        price_range: "$8-15"
      },
      mid_morning: {
        activity: "Coffee and snacks at Logging Museum",
        venue: "Algonquin Logging Museum",
        description: "Light refreshments while learning about park history",
        admission: "Free with park entry"
      },
      lunch: {
        activity: "Lunch at Visitor Centre Restaurant",
        venue: "Algonquin Visitor Centre",
        website: "https://www.algonquinpark.on.ca/visit/visitor-centre",
        cuisine: "Canadian comfort food",
        price_range: "$12-25"
      },
      afternoon: {
        activity: "Afternoon tea at Art Centre",
        venue: "Algonquin Art Centre",
        website: "https://www.algonquinartcentre.com",
        description: "Cultural refreshments with art viewing",
        price_range: "$5-12"
      },
      evening: {
        activity: "Dinner at nearby town restaurants",
        venue: "Huntsville or Dwight",
        description: "Local dining options near the park",
        price_range: "$20-40"
      }
    }
  },
  dt2: {
    // Niagara Wine Country - already enhanced
    general: {
      morning: {
        activity: "Icewine tasting at Inniskillin Winery",
        venue: "Inniskillin Winery",
        website: "https://www.inniskillin.com",
        address: "1499 Line 3, Niagara-on-the-Lake, ON",
        phone: "+1-905-468-2187",
        description: "Start your day with a world-renowned icewine tasting experience",
        lgbt_friendly: true
      },
      mid_morning: {
        activity: "Vineyard tour at Peller Estates",
        venue: "Peller Estates Winery",
        website: "https://www.peller.com",
        address: "290 John St E, Niagara-on-the-Lake, ON",
        phone: "+1-888-673-5537",
        description: "Guided tour of the vineyards and cellars",
        lgbt_friendly: true
      },
      lunch: {
        activity: "Lunch at Trius Winery Restaurant",
        venue: "Trius Winery Restaurant",
        website: "https://www.triuswines.com/restaurant",
        address: "1249 Niagara Stone Rd, Niagara-on-the-Lake, ON",
        phone: "+1-905-468-7123",
        cuisine: "Farm-to-table Canadian cuisine",
        price_range: "$25-50",
        lgbt_friendly: true
      },
      afternoon: {
        activity: "Explore Niagara-on-the-Lake historic district",
        venue: "Queen Street, Niagara-on-the-Lake",
        website: "https://www.niagaraonthelake.com",
        description: "Stroll through boutique shops and heritage buildings",
        lgbt_friendly: true
      },
      evening: {
        activity: "Dinner at Treadwell Cuisine",
        venue: "Treadwell Cuisine",
        website: "https://www.treadwellcuisine.com",
        address: "114 Queen St, Niagara-on-the-Lake, ON",
        phone: "+1-905-934-9797",
        cuisine: "Local seasonal cuisine",
        price_range: "$40-80",
        lgbt_friendly: true
      }
    },
    gayDayIn: {
      morning: {
        activity: "Tour and tasting at Two Sisters Vineyards",
        venue: "Two Sisters Vineyards",
        website: "https://www.twosistersvineyards.com",
        address: "240 John St E, Niagara-on-the-Lake, ON",
        phone: "+1-905-468-0592",
        description: "LGBTQ+ owned, award-winning winery",
        lgbtq_owned: true
      },
      mid_morning: {
        activity: "Coffee at Balzac's Niagara-on-the-Lake",
        venue: "Balzac's Coffee Roasters",
        website: "https://www.balzacs.com/locations/niagara-on-the-lake",
        address: "223 King St, Niagara-on-the-Lake, ON",
        lgbt_friendly: true
      },
      lunch: {
        activity: "Lunch at The Olde Angel Inn",
        venue: "The Olde Angel Inn",
        website: "https://www.angel-inn.com",
        address: "224 Regent St, Niagara-on-the-Lake, ON",
        phone: "+1-905-468-3411",
        cuisine: "British pub fare",
        lgbt_friendly: true
      },
      afternoon: {
        activity: "Wine tasting at Stratus Vineyards",
        venue: "Stratus Vineyards",
        website: "https://www.stratuswines.com",
        address: "2059 Niagara Stone Rd, Niagara-on-the-Lake, ON",
        phone: "+1-905-468-1806",
        lgbt_friendly: true
      },
      evening: {
        activity: "Dinner at Ruffino's Pasta Bar & Grill",
        venue: "Ruffino's Pasta Bar & Grill",
        website: "https://www.ruffinos.ca",
        address: "4680 Queen St, Niagara Falls, ON",
        phone: "+1-905-356-5555",
        cuisine: "Italian cuisine",
        lgbt_friendly: true
      }
    },
    outdoorsDay: {
      morning: {
        activity: "Morning hike at Niagara Glen",
        venue: "Niagara Glen Nature Reserve",
        website: "https://www.niagaraparks.com/visit/niagara-glen",
        description: "Scenic hiking trails along the Niagara River",
        difficulty: "Moderate",
        duration: "2-3 hours"
      },
      mid_morning: {
        activity: "Cycling the Niagara Parkway",
        venue: "Niagara Parkway",
        description: "Scenic cycling route with vineyard views",
        duration: "1-2 hours",
        difficulty: "Easy"
      },
      lunch: {
        activity: "Picnic at Queenston Heights Park",
        venue: "Queenston Heights Park",
        description: "Scenic picnic spot with river views",
        facilities: "Picnic tables, washrooms"
      },
      afternoon: {
        activity: "Explore Niagara-on-the-Lake waterfront",
        venue: "Niagara-on-the-Lake waterfront",
        description: "Scenic walking along Lake Ontario",
        duration: "1-2 hours"
      },
      evening: {
        activity: "Sunset at Fort George",
        venue: "Fort George National Historic Site",
        website: "https://www.pc.gc.ca/en/lhn-nhs/on/fortgeorge",
        description: "Historic site with sunset views",
        admission: "$7.90 per adult"
      }
    },
    barRestaurantDay: {
      morning: {
        activity: "Breakfast at The Olde Angel Inn",
        venue: "The Olde Angel Inn",
        website: "https://www.angel-inn.com",
        cuisine: "Traditional English breakfast",
        price_range: "$15-25"
      },
      mid_morning: {
        activity: "Wine tasting at Jackson-Triggs",
        venue: "Jackson-Triggs Niagara Estate",
        website: "https://www.jacksontriggswinery.com",
        address: "2145 Niagara Stone Rd, Niagara-on-the-Lake, ON",
        phone: "+1-905-468-4637"
      },
      lunch: {
        activity: "Lunch at Peller Estates Restaurant",
        venue: "Peller Estates Restaurant",
        website: "https://www.peller.com/dining",
        cuisine: "Fine dining with wine pairings",
        price_range: "$30-60"
      },
      afternoon: {
        activity: "Afternoon tea at Prince of Wales Hotel",
        venue: "Prince of Wales Hotel",
        website: "https://www.vintage-hotels.com/princeofwales",
        address: "6 Picton St, Niagara-on-the-Lake, ON",
        phone: "+1-905-468-3246"
      },
      evening: {
        activity: "Dinner at Trius Restaurant",
        venue: "Trius Restaurant",
        website: "https://www.triuswines.com/restaurant",
        cuisine: "Farm-to-table with wine pairings",
        price_range: "$40-80"
      }
    }
  },
  dt3: {
    // The Bentway - needs enhancement
    general: {
      morning: {
        activity: "Morning coffee at Balzac's Coffee",
        venue: "Balzac's Coffee Roasters",
        website: "https://www.balzacs.com",
        address: "55 Fort York Blvd, Toronto, ON",
        phone: "+1-416-214-2864",
        description: "Start your day with artisanal coffee near The Bentway",
        lgbt_friendly: true
      },
      mid_morning: {
        activity: "Explore art installations",
        venue: "The Bentway Art Gallery",
        website: "https://www.thebentway.ca/art",
        description: "View rotating contemporary art installations",
        admission: "Free",
        lgbt_friendly: true
      },
      lunch: {
        activity: "Lunch at Liberty Village restaurants",
        venue: "Liberty Village",
        website: "https://www.libertyvillage.ca",
        description: "Diverse dining options in the trendy neighborhood",
        lgbt_friendly: true
      },
      afternoon: {
        activity: "Participate in community fitness class",
        venue: "The Bentway Fitness Area",
        website: "https://www.thebentway.ca/events",
        description: "Join free community fitness programming",
        lgbt_friendly: true
      },
      evening: {
        activity: "Attend summer music series",
        venue: "The Bentway Skate Trail",
        website: "https://www.thebentway.ca/events/summer-music",
        description: "Free outdoor concerts featuring local artists",
        lgbt_friendly: true
      }
    },
    gayDayIn: {
      morning: {
        activity: "LGBTQ+ community coffee meetup",
        venue: "The Bentway Community Space",
        website: "https://www.thebentway.ca/events",
        description: "Start your day with inclusive community programming",
        lgbt_friendly: true
      },
      mid_morning: {
        activity: "Visit LGBTQ+ art exhibitions",
        venue: "The Bentway Art Gallery",
        website: "https://www.thebentway.ca/art",
        description: "View LGBTQ+ themed art installations",
        lgbt_friendly: true
      },
      lunch: {
        activity: "Lunch at LGBTQ+ friendly Liberty Village",
        venue: "Liberty Village restaurants",
        website: "https://www.libertyvillage.ca",
        description: "Dine at welcoming establishments in the neighborhood",
        lgbt_friendly: true
      },
      afternoon: {
        activity: "Participate in Pride programming",
        venue: "The Bentway",
        website: "https://www.thebentway.ca/events/pride",
        description: "Join LGBTQ+ community events and activities",
        lgbt_friendly: true
      },
      evening: {
        activity: "Attend LGBTQ+ cultural events",
        venue: "The Bentway Performance Space",
        website: "https://www.thebentway.ca/events",
        description: "Evening cultural programming and performances",
        lgbt_friendly: true
      }
    },
    outdoorsDay: {
      morning: {
        activity: "Morning fitness class",
        venue: "The Bentway Fitness Area",
        website: "https://www.thebentway.ca/events",
        description: "Start with community fitness programming",
        lgbt_friendly: true
      },
      mid_morning: {
        activity: "Skate trail session (winter)",
        venue: "The Bentway Skate Trail",
        website: "https://www.thebentway.ca/skate",
        description: "Unique skating experience under the expressway",
        lgbt_friendly: true
      },
      lunch: {
        activity: "Outdoor picnic at The Bentway",
        venue: "The Bentway Park",
        description: "Enjoy lunch in the urban park setting",
        facilities: "Picnic areas available"
      },
      afternoon: {
        activity: "Cycling through connected trails",
        venue: "The Bentway Trail Network",
        website: "https://www.thebentway.ca/trails",
        description: "Explore the connected trail system",
        lgbt_friendly: true
      },
      evening: {
        activity: "Evening outdoor activities",
        venue: "The Bentway",
        website: "https://www.thebentway.ca/events",
        description: "Participate in evening outdoor programming",
        lgbt_friendly: true
      }
    },
    barRestaurantDay: {
      morning: {
        activity: "Breakfast at nearby cafés",
        venue: "Liberty Village cafés",
        website: "https://www.libertyvillage.ca",
        description: "Start with breakfast at local establishments",
        lgbt_friendly: true
      },
      mid_morning: {
        activity: "Coffee break at The Bentway",
        venue: "The Bentway Café",
        description: "Refreshments while exploring the space",
        lgbt_friendly: true
      },
      lunch: {
        activity: "Lunch at Liberty Village restaurants",
        venue: "Liberty Village",
        website: "https://www.libertyvillage.ca",
        description: "Diverse dining options in the neighborhood",
        lgbt_friendly: true
      },
      afternoon: {
        activity: "Afternoon coffee at local spots",
        venue: "Downtown Toronto cafés",
        description: "Explore coffee shops in the area",
        lgbt_friendly: true
      },
      evening: {
        activity: "Dinner at downtown restaurants",
        venue: "Downtown Toronto",
        description: "Fine dining with easy access to The Bentway",
        lgbt_friendly: true
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

console.log('Enhanced day trips with detailed day plans!');
console.log(`Enhanced ${Object.keys(enhancedDayPlans).length} day trips with detailed recommendations.`); 