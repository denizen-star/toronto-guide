import { BoulderLocation } from '../types/boulder';

export const boulderData: BoulderLocation[] = [
  {
    id: 'downtown',
    title: 'Downtown Boulder / Pearl Street Mall',
    description: 'The vibrant heart of the city with unique boutiques, art galleries, diverse restaurants, and lively street performers. The architecture is charming, blending historic buildings with modern touches, and it offers stunning views of the Flatirons.',
    category: 'downtown',
    tags: ['shopping', 'dining', 'entertainment', 'art', 'culture', 'outdoor', 'historic', 'local'],
    activities: [
      {
        title: 'Pearl Street Mall',
        category: 'Shopping & Entertainment',
        address: 'Pearl Street Mall, Boulder, CO',
        website: 'https://boulderdowntown.com/pearl-street-mall'
      },
      {
        title: 'Flatirons Hiking & Biking',
        category: 'Outdoor Recreation',
        address: 'Various trailheads (e.g., Chautauqua Park)',
      },
      {
        title: 'Boulder Museum of Contemporary Art',
        category: 'Arts & Culture',
        address: '1750 13th St, Boulder, CO 80302',
        website: 'https://bmoca.org'
      },
      {
        title: 'Boulder Farmers Market',
        category: 'Local Experience',
        address: '13th St between Canyon & Arapahoe, Boulder, CO',
        website: 'https://boulderfarmers.org'
      },
      {
        title: 'Boulder Theater',
        category: 'Entertainment',
        address: '2032 14th St, Boulder, CO 80302',
        website: 'https://bouldertheater.com'
      },
      {
        title: 'Boulder Creek Path',
        category: 'Outdoor Recreation',
        address: 'Runs through downtown Boulder'
      },
      {
        title: 'Dushanbe Teahouse',
        category: 'Dining & Culture',
        address: '1770 13th St, Boulder, CO 80302',
        website: 'https://www.boulderteahouse.com'
      },
      {
        title: 'Art Source International',
        category: 'Art Gallery',
        address: '1237 Pearl St, Boulder, CO 80302'
      },
      {
        title: 'Boulder Book Store',
        category: 'Shopping & Culture',
        address: '1107 Pearl St, Boulder, CO 80302',
        website: 'https://www.boulderbookstore.net'
      },
      {
        title: 'Piece, Love & Chocolate',
        category: 'Shopping & Dining',
        address: '805 Pearl St, Boulder, CO 80302'
      }
    ],
    happyHours: [
      {
        name: 'The Kitchen',
        details: 'Daily: 3-6 PM. Half off select wines, beers, cocktails, and appetizers',
        address: '1039 Pearl St, Boulder, CO 80302',
        website: 'https://thekitchenbistros.com'
      },
      {
        name: 'Salt',
        details: 'Tue-Sun: 3-5 PM. $7 cocktails, $6 wines, $4 beers, discounted small plates',
        address: '1047 Pearl St, Boulder, CO 80302',
        website: 'https://www.saltthebistro.com'
      },
      {
        name: 'Japango',
        details: 'Mon-Fri: 4-6 PM. Discounted sushi rolls and sake',
        address: '1136 Pearl St, Boulder, CO 80302'
      },
      {
        name: 'Mountain Sun Pub',
        details: 'Mon-Fri: 4-6 PM. $1 off pints',
        address: '1535 Pearl St, Boulder, CO 80302'
      }
    ]
  },
  {
    id: 'hill',
    title: 'The Hill',
    description: 'A lively neighborhood adjacent to the University of Colorado Boulder, featuring casual eateries, coffee shops, and entertainment venues popular with students and locals alike.',
    category: 'hill',
    tags: ['dining', 'entertainment', 'shopping', 'education', 'nightlife'],
    activities: [
      {
        title: 'Fox Theatre',
        category: 'Entertainment',
        address: '1135 13th St, Boulder, CO 80302',
        website: 'https://www.foxtheatre.com'
      },
      {
        title: 'The Sink',
        category: 'Restaurant',
        address: '1165 13th St, Boulder, CO 80302',
        website: 'https://thesink.com'
      },
      {
        title: 'University Hill Commercial District',
        category: 'Shopping & Entertainment',
        address: '13th Street & Pennsylvania Avenue'
      },
      {
        title: 'CU Boulder Campus Tours',
        category: 'Education & Sightseeing',
        address: 'University of Colorado Boulder'
      },
      {
        title: 'Innisfree Poetry Bookstore & Café',
        category: 'Cafe & Culture',
        address: '1301 Pennsylvania Ave, Boulder, CO 80302'
      },
      {
        title: 'CU Art Museum',
        category: 'Arts & Culture',
        address: '1085 18th St, Boulder, CO 80309'
      },
      {
        title: 'Fiske Planetarium',
        category: 'Science & Education',
        address: '2414 Regent Dr, Boulder, CO 80309',
        website: 'https://www.colorado.edu/fiske'
      }
    ],
    happyHours: [
      {
        name: 'The Sink',
        details: 'Mon-Fri: 3-6 PM. $3 drafts, $5 wells, $6 appetizers',
        address: '1165 13th St, Boulder, CO 80302',
        website: 'https://thesink.com'
      },
      {
        name: 'Half Fast Subs',
        details: 'Daily: 4-8 PM. Drink specials and discounted subs',
        address: '1215 13th St, Boulder, CO 80302'
      }
    ]
  },
  {
    id: 'chautauqua',
    title: 'Chautauqua Park',
    description: 'Historic landmark and cultural center at the base of the Flatirons, offering hiking trails, a dining hall, and summer concerts. A perfect blend of outdoor recreation and cultural activities.',
    category: 'south',
    tags: ['outdoor', 'culture', 'dining', 'historic', 'hiking', 'music'],
    activities: [
      {
        title: 'Chautauqua Trail',
        category: 'Hiking',
        address: '900 Baseline Rd, Boulder, CO 80302'
      },
      {
        title: 'Chautauqua Dining Hall',
        category: 'Historic Dining',
        address: '900 Baseline Rd, Boulder, CO 80302',
        website: 'https://www.chautauqua.com/dining'
      },
      {
        title: 'Colorado Chautauqua',
        category: 'Arts & Culture',
        address: '900 Baseline Rd, Boulder, CO 80302',
        website: 'https://www.chautauqua.com'
      },
      {
        title: 'Summer Concert Series',
        category: 'Entertainment',
        address: 'Chautauqua Auditorium'
      },
      {
        title: 'Ranger Cottage',
        category: 'Education & Information',
        address: '900 Baseline Rd, Boulder, CO 80302'
      },
      {
        title: 'Royal Arch Trail',
        category: 'Hiking',
        address: 'Chautauqua Park'
      },
      {
        title: 'Flatirons Vista',
        category: 'Outdoor Recreation',
        address: 'Chautauqua Park'
      }
    ]
  },
  {
    id: 'nobo',
    title: 'North Boulder',
    description: 'A trendy area known for its art district, craft breweries, and restaurants. Features a mix of modern developments and established neighborhoods with easy access to hiking trails.',
    category: 'nobo',
    tags: ['art', 'dining', 'brewery', 'outdoor', 'shopping'],
    activities: [
      {
        title: 'NoBo Art District',
        category: 'Art Gallery',
        address: 'North Boulder Art District',
        website: 'https://noboartdistrict.org'
      },
      {
        title: 'Upslope Brewing Company',
        category: 'Brewery',
        address: '1898 S Flatiron Ct, Boulder, CO 80301',
        website: 'https://upslopebrewing.com'
      },
      {
        title: 'Wonderland Lake',
        category: 'Parks & Recreation',
        address: '4201 N Broadway, Boulder, CO 80304'
      },
      {
        title: 'First Friday Art Walk',
        category: 'Arts & Culture',
        address: 'North Boulder Art District'
      },
      {
        title: 'Lucky\'s Market',
        category: 'Shopping',
        address: '3960 Broadway, Boulder, CO 80304'
      },
      {
        title: 'Foothills Community Park',
        category: 'Parks & Recreation',
        address: '800 Cherry Ave, Boulder, CO 80304'
      },
      {
        title: 'Proto\'s Pizzeria',
        category: 'Dining',
        address: '4670 Broadway St, Boulder, CO 80304'
      }
    ],
    happyHours: [
      {
        name: 'Upslope Brewing Company',
        details: 'Wed-Sun: 4-6 PM. $1 off pints, special food truck deals',
        address: '1898 S Flatiron Ct, Boulder, CO 80301',
        website: 'https://upslopebrewing.com'
      },
      {
        name: 'Proto\'s Pizzeria',
        details: 'Tue-Sun: 3-6 PM. $2 off pizzas, drink specials',
        address: '4670 Broadway St, Boulder, CO 80304'
      }
    ]
  },
  {
    id: 'gunbarrel',
    title: 'Gunbarrel',
    description: 'A growing community northeast of Boulder proper, known for its concentration of craft breweries, tech companies, and access to open space trails.',
    category: 'gunbarrel',
    tags: ['brewery', 'outdoor', 'dining', 'tech'],
    activities: [
      {
        title: 'Avery Brewing Company',
        category: 'Brewery & Taproom',
        address: '4910 Nautilus Ct N, Boulder, CO 80301',
        website: 'https://www.averybrewing.com'
      },
      {
        title: 'Twin Lakes',
        category: 'Parks & Recreation',
        address: '5565 Twin Lakes Rd, Boulder, CO 80301'
      },
      {
        title: 'Gunbarrel Commons Park',
        category: 'Parks & Recreation',
        address: '6175 Twin Lakes Rd, Boulder, CO 80301'
      },
      {
        title: 'Beyond The Mountain Brewing',
        category: 'Brewery',
        address: '6035 Longbow Dr, Boulder, CO 80301'
      },
      {
        title: 'Finkel & Garf Brewing Co.',
        category: 'Brewery',
        address: '5455 Spine Rd, Boulder, CO 80301'
      },
      {
        title: 'Gunbarrel Brewing Company',
        category: 'Brewery',
        address: '7088 Winchester Cir, Boulder, CO 80301'
      }
    ],
    happyHours: [
      {
        name: 'Avery Brewing Company',
        details: 'Mon-Thu: 3-6 PM. $4 core beers, $6 specialty beers, discounted appetizers',
        address: '4910 Nautilus Ct N, Boulder, CO 80301',
        website: 'https://www.averybrewing.com'
      },
      {
        name: 'Beyond The Mountain Brewing',
        details: 'Tue-Thu: 4-6 PM. $1 off pints',
        address: '6035 Longbow Dr, Boulder, CO 80301'
      }
    ]
  },
  {
    id: 'east-boulder',
    title: 'East Boulder',
    description: 'A diverse area featuring a mix of residential neighborhoods, shopping centers, and business parks, with excellent access to trails and open spaces.',
    category: 'east',
    tags: ['shopping', 'dining', 'outdoor', 'business'],
    activities: [
      {
        title: 'Valmont Bike Park',
        category: 'Outdoor Recreation',
        address: '3160 Airport Rd, Boulder, CO 80301'
      },
      {
        title: 'Boulder Indoor Soccer',
        category: 'Sports & Recreation',
        address: '2845 29th St, Boulder, CO 80301'
      },
      {
        title: 'Twenty Ninth Street Mall',
        category: 'Shopping',
        address: '1710 29th St, Boulder, CO 80301'
      },
      {
        title: 'Valmont Dog Park',
        category: 'Parks & Recreation',
        address: '5275 Valmont Rd, Boulder, CO 80301'
      },
      {
        title: 'Boulder Creek Path East',
        category: 'Trail',
        address: 'East Boulder'
      },
      {
        title: 'East Boulder Community Center',
        category: 'Recreation',
        address: '5660 Sioux Dr, Boulder, CO 80303'
      }
    ],
    happyHours: [
      {
        name: 'Roadhouse Boulder Depot',
        details: 'Daily: 3-6 PM. $4 drafts, $5 wells, half-price appetizers',
        address: '2366 Junction Pl, Boulder, CO 80301'
      }
    ]
  }
];

export const loadBoulderData = async (): Promise<BoulderLocation[]> => {
  try {
    // In a real application, this would be an API call
    // For now, we'll simulate a network request
    await new Promise(resolve => setTimeout(resolve, 1000));
    return boulderData;
  } catch (error) {
    console.error('Error loading Boulder data:', error);
    throw error;
  }
};

export const getBoulderLocationById = (id: string): BoulderLocation | undefined => {
  return boulderData.find(location => location.id === id);
}; 