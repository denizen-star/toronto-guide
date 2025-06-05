import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Grid, Typography, CircularProgress, Container } from '@mui/material';
import EnhancedMinimalistCard from '../components/MinimalistCard';
import EnhancedFilterSystem, { FilterConfig } from '../components/EnhancedFilterSystem';
import { useSearch } from '../components/Layout';
import {
  LocationCity,
  School,
  Terrain,
  LocalActivity,
  Landscape,
  Business,
  LocalDrink,
  LocalBar,
  Restaurant,
  Store,
  Museum,
  Park,
  DirectionsWalk,
  SportsBasketball,
  LocalCafe,
  Science,
  ShoppingBag,
  TheaterComedy,
  Hiking,
  AgricultureOutlined,
  LocalFlorist,
  SportsGolf,
  Celebration,
  Attractions,
  NightlifeOutlined
} from '@mui/icons-material';

// Define the data structure for Boulder locations
interface BoulderLocation {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  activities: Array<{
    title: string;
    category: string;
    address: string;
    website?: string;
  }>;
  happyHours?: Array<{
    name: string;
    details: string;
    address: string;
    website?: string;
  }>;
}

// Icon map for different areas and activities
const areaIconMap: { [key: string]: React.ReactNode } = {
  'downtown': <LocationCity />,
  'hill': <School />,
  'nobo': <Terrain />,
  'south': <Landscape />,
  'east': <Business />,
  'gunbarrel': <LocalDrink />
};

const activityIconMap: { [key: string]: React.ReactNode } = {
  // Shopping & Entertainment
  'Shopping & Entertainment': <Store />,
  'Shopping': <ShoppingBag />,
  'Entertainment': <TheaterComedy />,
  'Shopping & Craft': <ShoppingBag />,
  'Outdoor Gear & Museum': <Hiking />,
  
  // Dining & Drinks
  'Restaurant': <Restaurant />,
  'Dining': <Restaurant />,
  'Bar': <LocalBar />,
  'Brewery': <LocalDrink />,
  'Brewery & Taproom': <LocalDrink />,
  'Brewery Tours': <LocalDrink />,
  'Cafe & Bakery': <LocalCafe />,
  'Winery': <LocalBar />,
  'happy-hour': <NightlifeOutlined />,
  'Food Hall': <Restaurant />,
  
  // Culture & Arts
  'Arts & Culture': <Museum />,
  'Historic Dining': <Celebration />,
  'Art Gallery': <Museum />,
  'Factory Tour': <Business />,
  'Theater': <TheaterComedy />,
  'Museum': <Museum />,
  
  // Outdoor & Recreation
  'Outdoor Recreation': <DirectionsWalk />,
  'Parks & Recreation': <Park />,
  'Hiking': <Hiking />,
  'Hiking & Biking': <DirectionsWalk />,
  'Golf & Recreation': <SportsGolf />,
  'Bike Park': <SportsBasketball />,
  'Trail': <Hiking />,
  
  // Education & Science
  'Science & Education': <Science />,
  'Education & Sightseeing': <School />,
  'Research Center': <Science />,
  
  // Local Experience
  'Local Experience': <LocalActivity />,
  'Local Exploration': <DirectionsWalk />,
  'Local Produce': <AgricultureOutlined />,
  'Agriculture & Education': <LocalFlorist />,
  'Farm Stand': <AgricultureOutlined />,
  
  // Default
  'default': <Attractions />
};

// Function to get the appropriate icon for an activity
const getActivityIcon = (category: string): React.ReactNode => {
  return activityIconMap[category] || activityIconMap['default'];
};

const Boulder: React.FC = () => {
  const { searchTerm, setSearchPlaceholder } = useSearch();
  const [loading, setLoading] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string[] }>({
    category: [],
    activityType: [],
    area: [],
    tags: [],
    priceRange: []
  });

  useEffect(() => {
    setSearchPlaceholder('Search Boulder locations...');
  }, [setSearchPlaceholder]);

  // Boulder data structured for cards
  const boulderData: BoulderLocation[] = [
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
        }
      ],
      happyHours: [
        {
          name: 'The West End Tavern',
          details: 'Mon-Fri: 3-6 PM, Thu-Sat: 9 PM-12 AM (late night). Mon: All Day Wings',
          address: '926 Pearl St, Boulder, CO 80302',
          website: 'https://thewestendtavern.com'
        },
        {
          name: 'Centro Mexican Kitchen',
          details: 'Mon: All day, Daily: 2-5 PM. Food/drink specials',
          address: '950 Pearl St, Boulder, CO 80302',
          website: 'https://www.centromexican.com'
        },
        {
          name: 'Hapa Sushi Grill & Sake Bar',
          details: 'Daily: 2:30-5:30 PM (Online: 2:30-4:30 PM). 2 for $12 rolls, half off apps, drink specials',
          address: '1110 Pearl St, Boulder, CO 80302',
          website: 'https://hapasushi.com'
        },
        {
          name: 'Pearl Street Pub & Cellar',
          details: 'Mon-Sun: 4-7 PM. General happy hour pricing',
          address: '1108 Pearl St, Boulder, CO 80302',
          website: 'https://boulderdowntown.com/go/pearl-street-pub'
        },
        {
          name: 'The Bitter Bar',
          details: 'Daily: 5-7 PM. $7 small bites, $9 cocktails, $1 off wine',
          address: '835 Walnut St, Boulder, CO 80302',
          website: 'https://www.thebitterbar.com'
        },
        {
          name: 'Postino WineCafe',
          details: 'Daily: Open - 5 PM. $6 wine/pitchers. Mon-Tue after 8 PM: $25 Board + Bottle',
          address: '1468 Pearl St, Boulder, CO 80302',
          website: 'https://www.postinowinecafe.com/locations/postino-boulder'
        },
        {
          name: 'Sforno Trattoria Romana',
          details: 'Daily: 3-6 PM. Food specials. Drink specials: $1 off beers, $8 wine, $10 cocktails',
          address: '1308 Pearl St, Boulder, CO 80302',
          website: 'https://sfornoboulder.com'
        },
        {
          name: 'The Spotted James',
          details: 'Daily Specials: From open until close. Craft drinks available',
          address: '1911 11th St, Boulder, CO 80302',
          website: 'https://thespottedjames.com'
        }
      ]
    },
    {
      id: 'hill',
      title: 'The Hill',
      description: 'A vibrant district adjacent to the University of Colorado Boulder campus, known for its youthful energy, casual eateries, coffee shops, and lively music scene. It\'s a popular hangout spot for students and locals alike.',
      category: 'hill',
      tags: ['music', 'dining', 'student-life', 'entertainment', 'shopping', 'education', 'coffee', 'local'],
      activities: [
        {
          title: 'Fox Theatre',
          category: 'Entertainment',
          address: '1135 13th St, Boulder, CO 80302',
          website: 'https://www.foxtheatre.com'
        },
        {
          title: '13th Street Shopping & Cafes',
          category: 'Local Exploration',
          address: '13th Street, Boulder, CO'
        },
        {
          title: 'Nick Ryan Gallery',
          category: 'Arts & Culture',
          address: '1163 13th St, Boulder, CO 80302',
          website: 'https://www.nickryangallery.com'
        },
        {
          title: 'Emi\'s Charm Bar',
          category: 'Shopping & Craft',
          address: '1144 13th St, Boulder, CO 80302',
          website: 'https://emischarmbar.com'
        },
        {
          title: 'SLCT Stock & Meow Meow',
          category: 'Shopping',
          address: 'SLCT Stock (1107 13th St), Meow Meow (1118 13th St), Boulder, CO 80302'
        },
        {
          title: 'University of Colorado Boulder Campus',
          category: 'Education & Sightseeing',
          address: '1669 Euclid Ave, Boulder, CO 80309',
          website: 'https://www.colorado.edu'
        },
        {
          title: 'Kitchen on the Hill Food Hall',
          category: 'Dining',
          address: '1100 13th St, Boulder, CO 80302'
        },
        {
          title: 'The Sink',
          category: 'Historic Dining',
          address: '1165 13th St, Boulder, CO 80302',
          website: 'https://www.thesink.com'
        }
      ],
      happyHours: [
        {
          name: 'Illegal Pete\'s (The Hill)',
          details: 'Daily: 3-8 PM. $1 off Margs/Draft Beer, $4 off Party Margs, $1 off Chips & Queso/Guac',
          address: '1124 13th Street, Boulder, CO 80302',
          website: 'https://www.illegalpetes.com/locations/the-hill'
        },
        {
          name: 'The Corner',
          details: 'Daily: 3-6 PM. $1 off adult beverages',
          address: '1100 13th Street, Boulder, CO 80302',
          website: 'https://www.thecornerboulder.com'
        },
        {
          name: 'The Sink',
          details: 'Sun-Fri: 3-5 PM. Half off select bar drinks, $2 off appetizers',
          address: '1165 13th St, Boulder, CO 80302',
          website: 'https://www.thesink.com'
        }
      ]
    },
    {
      id: 'nobo',
      title: 'North Boulder (NoBo)',
      description: 'North Boulder, often referred to as NoBo, is a more residential and artsy part of the city. It features a growing art district, local coffee shops, bakeries, and peaceful parks. It\'s a great area for a more relaxed pace.',
      category: 'nobo',
      tags: ['art', 'parks', 'coffee', 'relaxed', 'wine', 'outdoor', 'local', 'craft'],
      activities: [
        {
          title: 'NoBo Art District',
          category: 'Arts & Culture',
          address: 'Along Broadway between Iris & Highway 36, Boulder, CO',
          website: 'https://noboartdistrict.org'
        },
        {
          title: 'North Boulder Park',
          category: 'Outdoor Recreation',
          address: '2844 Broadway, Boulder, CO 80304'
        },
        {
          title: 'Growing Gardens',
          category: 'Agriculture & Education',
          address: '1630 Hawthorn Ave, Boulder, CO',
          website: 'https://www.growinggardens.org'
        },
        {
          title: 'BookCliff Vineyards',
          category: 'Winery',
          address: '1501 Lee Hill Rd #17, Boulder, CO 80304',
          website: 'https://bookcliffvineyards.com'
        },
        {
          title: 'Wonderland Lake',
          category: 'Outdoor Recreation',
          address: '4201 Broadway, Boulder, CO 80304'
        },
        {
          title: 'Boulder Sports Recycler',
          category: 'Shopping',
          address: '2707 Spruce St, Boulder, CO 80302',
          website: 'https://bouldersportsrecycler.com'
        },
        {
          title: 'Lucky\'s Bakehouse & Moxie Bread Co',
          category: 'Cafe & Bakery',
          address: 'Lucky\'s Bakehouse (3980 Broadway), Moxie Bread Co (6425 Gunpark Dr, Gunbarrel)'
        }
      ],
      happyHours: [
        {
          name: 'The Boulder Cork',
          details: 'Daily: 4:30-6:00 PM. Drink/food specials',
          address: '3295 30th St, Boulder, CO 80301',
          website: 'https://bouldercork.com'
        },
        {
          name: 'Dagabi Tapas Bar',
          details: 'Daily: 5-6:30 PM; All day Tuesday. Tapas, sangria, margaritas, wine, beer',
          address: '1200 Yarmouth Ave, Boulder, CO 80304',
          website: 'http://www.dagabicucina.com'
        },
        {
          name: 'Fringe Pizza',
          details: 'Tue-Sat: 3-5 PM. 50% off wine/beer, food specials',
          address: '2020 Ionosphere St, Boulder, CO 80301',
          website: 'https://fringeboulder.com'
        },
        {
          name: 'The Greenbriar Inn',
          details: 'Check directly; fine dining focus',
          address: '8735 N Foothills Hwy, Boulder, CO 80302',
          website: 'https://www.greenbriarinn.com'
        }
      ]
    },
    {
      id: 'south',
      title: 'South Boulder',
      description: 'South Boulder is primarily a residential area nestled against the foothills, offering a laid-back lifestyle and easy access to numerous hiking trails. It has a strong community feel with local hangouts and brewpubs.',
      category: 'south',
      tags: ['hiking', 'nature', 'community', 'science', 'outdoor', 'education', 'research', 'relaxed'],
      activities: [
        {
          title: 'Shanahan Ridge Trail',
          category: 'Hiking',
          address: 'Trailhead at Lehigh St, Boulder, CO 80303'
        },
        {
          title: 'Viele Lake & Harlow Platts Community Park',
          category: 'Parks & Recreation',
          address: '1360 Gillaspie Dr, Boulder, CO 80305'
        },
        {
          title: 'National Center for Atmospheric Research (NCAR)',
          category: 'Science & Education',
          address: '3090 Center Green Dr, Boulder, CO 80301',
          website: 'https://ncar.ucar.edu/visit'
        },
        {
          title: 'NOAA',
          category: 'Science & Education',
          address: '325 Broadway, Boulder, CO 80305',
          website: 'https://www.noaa.gov'
        },
        {
          title: 'Neptune Mountaineering',
          category: 'Outdoor Gear & Museum',
          address: '633 S Broadway, Boulder, CO 80305',
          website: 'https://www.neptunemountaineering.com'
        },
        {
          title: 'South Boulder Creek Path',
          category: 'Outdoor Recreation',
          address: 'Trail access points along South Boulder Creek'
        }
      ],
      happyHours: [
        {
          name: 'Southern Sun Pub & Brewery',
          details: 'Mon-Fri: 3-6 PM; Late night: 9-11 PM (half off alcohol). Discounts on beers/pub grub',
          address: '627 S Broadway, Boulder, CO 80305',
          website: 'https://www.mountainsunpub.com/location/southern-sun-pub-brewery'
        },
        {
          name: 'The Post Chicken & Beer',
          details: 'Mon-Fri: 2-6 PM. $6-14 apps. Drink specials: $5 wine/cocktails/flights; 2 for 1 pints',
          address: '2027 13th St, Boulder, CO 80302',
          website: 'https://www.postchickenandbeer.com'
        },
        {
          name: 'Boulder Social',
          details: 'Mon-Fri: 2-5 PM; Sun-Thu: 9 PM-close (late night). Raw bar, small bites, drink specials',
          address: '1600 38th St, Boulder, CO 80301',
          website: 'https://www.besocialcolorado.com/bouldersocial'
        }
      ]
    },
    {
      id: 'east',
      title: 'East Boulder',
      description: 'East Boulder is known for its mix of residential areas, tech and bioscience industries, and a growing artsy vibe. It offers a more laid-back atmosphere compared to downtown, with a variety of local eateries and parks.',
      category: 'east',
      tags: ['science', 'parks', 'dining', 'biking', 'art', 'brewery', 'recreation', 'local'],
      activities: [
        {
          title: 'East End Shopping & Dining',
          category: 'Shopping & Dining',
          address: 'East Pearl Street, Boulder, CO',
          website: 'https://boulderdowntown.com/visit/the-east-end'
        },
        {
          title: 'Mary Williams Fine Arts',
          category: 'Art Gallery',
          address: '2460 Canyon Blvd #C5, Boulder, CO 80302',
          website: 'https://www.marywilliamsfinearts.com'
        },
        {
          title: 'Valmont Bike Park',
          category: 'Outdoor Recreation',
          address: '3160 Airport Rd, Boulder, CO 80301',
          website: 'https://bouldercolorado.gov/locations/valmont-bike-park'
        },
        {
          title: 'Bobolink Trailhead',
          category: 'Hiking & Biking',
          address: '69th St & Baseline Rd, Boulder, CO 80303'
        },
        {
          title: 'Local Brewery Tours',
          category: 'Brewery Tours',
          address: 'Various locations (e.g., Sanitas Brewing, Avery Brewing)'
        }
      ],
      happyHours: [
        {
          name: 'Jax Fish House & Oyster Bar',
          details: 'Daily: 4-6 PM. $1.50 oysters, half-priced shrimp, food/drink specials',
          address: '928 Pearl St, Boulder, CO 80302',
          website: 'https://www.jaxfishhouse.com'
        },
        {
          name: 'Fate Brewing Company',
          details: 'Mon-Fri: 3-6 PM. $1 off house beers, discounts on select appetizers',
          address: '1600 38th St, Boulder, CO 80301',
          website: 'https://fatebrewing.com'
        },
        {
          name: 'Dry Storage',
          details: 'Tue-Sat: 5-6 PM. $9 cocktails, $7 wines, beer specials',
          address: '3600 Pearl St, Unit A, Boulder, CO 80301',
          website: 'https://drystorageco.com'
        }
      ]
    },
    {
      id: 'gunbarrel',
      title: 'Gunbarrel',
      description: 'Technically just outside Boulder\'s city limits, Gunbarrel offers a more suburban feel with open spaces, breweries, and a growing tech presence. It\'s a quieter area but still provides great dining and recreational options.',
      category: 'gunbarrel',
      tags: ['brewery', 'suburban', 'science', 'recreation', 'outdoor', 'relaxed', 'community', 'local'],
      activities: [
        {
          title: 'Left Hand Brewing Company',
          category: 'Brewery',
          address: '1265 Boston Ave, Longmont, CO 80501',
          website: 'https://www.lefthandbrewing.com'
        },
        {
          title: 'Avery Brewing Company',
          category: 'Brewery & Taproom',
          address: '4910 Nautilus Ct N, Boulder, CO 80301',
          website: 'https://www.averybrewing.com'
        },
        {
          title: 'Boulder Country Club',
          category: 'Golf & Recreation',
          address: '7350 Clubhouse Rd, Boulder, CO 80301',
          website: 'https://www.bouldercountryclub.com'
        },
        {
          title: 'Gunbarrel Farm Stand',
          category: 'Local Produce',
          address: '6565 Gunpark Dr, Boulder, CO 80301'
        },
        {
          title: 'LoBo Trail',
          category: 'Outdoor Recreation',
          address: 'Various access points (e.g., near 63rd St & Spine Rd)'
        },
        {
          title: 'Celestial Seasonings Tea Factory',
          category: 'Factory Tour',
          address: '4600 Sleepytime Dr, Boulder, CO 80301',
          website: 'https://www.celestialseasonings.com/visit-us'
        }
      ],
      happyHours: [
        {
          name: 'The Rib House',
          details: 'Mon-Fri: 3-6 PM. Discounts on draft beers, well drinks, select appetizers',
          address: '1776 N 63rd St, Boulder, CO 80301',
          website: 'https://theribhouse.com'
        },
        {
          name: 'Avery Brewing Company',
          details: 'Check website for specials. Craft beer flights, discounted pints, food specials',
          address: '4910 Nautilus Ct N, Boulder, CO 80301',
          website: 'https://www.averybrewing.com'
        },
        {
          name: 'Bootstrap Brewing Company',
          details: 'Check directly; specials vary. Discounts on pints, growler fills',
          address: '6778 N 79th St, Niwot, CO 80504',
          website: 'https://bootstrapbrewing.com'
        }
      ]
    }
  ];

  // Create filter configurations
  const filterConfigs: FilterConfig[] = useMemo(() => [
    {
      key: 'category',
      label: 'Category',
      placeholder: 'Select categories',
      options: [
        { value: 'dining', label: 'Dining & Drinks' },
        { value: 'entertainment', label: 'Entertainment' },
        { value: 'shopping', label: 'Shopping' },
        { value: 'outdoor', label: 'Outdoor Activities' },
        { value: 'art', label: 'Arts & Culture' },
        { value: 'education', label: 'Education & Science' },
        { value: 'brewery', label: 'Breweries & Bars' }
      ]
    },
    {
      key: 'activityType',
      label: 'Activity Type',
      placeholder: 'Select activity types',
      options: [
        { value: 'Restaurant', label: 'Restaurants' },
        { value: 'Bar', label: 'Bars' },
        { value: 'Brewery', label: 'Breweries' },
        { value: 'Hiking', label: 'Hiking & Trails' },
        { value: 'Shopping', label: 'Shopping' },
        { value: 'Arts & Culture', label: 'Arts & Culture' },
        { value: 'Museum', label: 'Museums' },
        { value: 'Park', label: 'Parks & Recreation' },
        { value: 'Science & Education', label: 'Science & Education' },
        { value: 'Local Experience', label: 'Local Experiences' }
      ]
    },
    {
      key: 'tags',
      label: 'Tags',
      placeholder: 'Select tags',
      options: [
        // Dining & Drinks
        { value: 'dining', label: 'Dining' },
        { value: 'happy-hour', label: 'Happy Hour' },
        { value: 'brewery', label: 'Brewery' },
        { value: 'coffee', label: 'Coffee & Cafes' },
        { value: 'wine', label: 'Wine' },
        
        // Culture & Entertainment
        { value: 'art', label: 'Art' },
        { value: 'music', label: 'Music' },
        { value: 'culture', label: 'Culture' },
        { value: 'entertainment', label: 'Entertainment' },
        { value: 'theater', label: 'Theater' },
        
        // Outdoor & Recreation
        { value: 'hiking', label: 'Hiking' },
        { value: 'biking', label: 'Biking' },
        { value: 'outdoor', label: 'Outdoor' },
        { value: 'parks', label: 'Parks' },
        { value: 'nature', label: 'Nature' },
        { value: 'recreation', label: 'Recreation' },
        
        // Shopping & Local
        { value: 'shopping', label: 'Shopping' },
        { value: 'local', label: 'Local Experience' },
        { value: 'craft', label: 'Craft & Artisan' },
        
        // Education & Science
        { value: 'education', label: 'Education' },
        { value: 'science', label: 'Science' },
        { value: 'research', label: 'Research' },
        
        // Atmosphere & Setting
        { value: 'relaxed', label: 'Relaxed' },
        { value: 'community', label: 'Community' },
        { value: 'student-life', label: 'Student Life' },
        { value: 'suburban', label: 'Suburban' },
        { value: 'historic', label: 'Historic' }
      ]
    },
    {
      key: 'area',
      label: 'Area',
      placeholder: 'Select areas',
      options: [
        { value: 'downtown', label: 'Downtown' },
        { value: 'hill', label: 'The Hill' },
        { value: 'nobo', label: 'North Boulder' },
        { value: 'south', label: 'South Boulder' },
        { value: 'east', label: 'East Boulder' },
        { value: 'gunbarrel', label: 'Gunbarrel' }
      ]
    }
  ], []);

  // Handle filter changes
  const handleFilterChange = useCallback((filterId: string, values: string[]) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterId]: values
    }));
  }, []);

  // Handle filter reset
  const handleResetFilters = useCallback(() => {
    setSelectedFilters({
      category: [],
      activityType: [],
      area: [],
      tags: [],
      priceRange: []
    });
  }, []);

  // Filter data based on search term and filters
  const filteredData = useMemo(() => {
    return boulderData.filter(location => {
      // Search term filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          location.title.toLowerCase().includes(searchLower) ||
          location.description.toLowerCase().includes(searchLower) ||
          location.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
          location.activities.some(activity => 
            activity.title.toLowerCase().includes(searchLower) ||
            activity.category.toLowerCase().includes(searchLower)
          );
        
        if (!matchesSearch) return false;
      }

      // Category filter
      if (selectedFilters.category.length > 0) {
        const matchesCategory = selectedFilters.category.some(category => {
          switch (category) {
            case 'dining':
              return location.activities.some(activity => 
                ['Restaurant', 'Dining', 'Cafe & Bakery'].some(type => 
                  activity.category.includes(type)
                )
              );
            case 'entertainment':
              return location.activities.some(activity => 
                ['Entertainment', 'Theater', 'Music'].some(type => 
                  activity.category.includes(type)
                )
              );
            case 'shopping':
              return location.activities.some(activity => 
                activity.category.includes('Shopping')
              );
            case 'outdoor':
              return location.activities.some(activity => 
                ['Hiking', 'Outdoor Recreation', 'Park', 'Trail'].some(type => 
                  activity.category.includes(type)
                )
              );
            case 'art':
              return location.activities.some(activity => 
                ['Arts & Culture', 'Art Gallery', 'Museum'].some(type => 
                  activity.category.includes(type)
                )
              );
            case 'education':
              return location.activities.some(activity => 
                ['Science & Education', 'Education'].some(type => 
                  activity.category.includes(type)
                )
              );
            case 'brewery':
              return location.activities.some(activity => 
                ['Brewery', 'Bar', 'Winery'].some(type => 
                  activity.category.includes(type)
                )
              );
            default:
              return false;
          }
        });
        if (!matchesCategory) return false;
      }

      // Activity Type filter
      if (selectedFilters.activityType.length > 0) {
        const matchesActivityType = selectedFilters.activityType.some(type =>
          location.activities.some(activity => 
            activity.category.includes(type)
          )
        );
        if (!matchesActivityType) return false;
      }

      // Tags filter
      if (selectedFilters.tags.length > 0) {
        const matchesTags = selectedFilters.tags.every(tag =>
          location.tags.some(locationTag => 
            locationTag.toLowerCase() === tag.toLowerCase()
          )
        );
        if (!matchesTags) return false;
      }

      // Area filter
      if (selectedFilters.area.length > 0) {
        const matchesArea = selectedFilters.area.includes(location.category);
        if (!matchesArea) return false;
      }

      return true;
    });
  }, [boulderData, searchTerm, selectedFilters]);

  // Create a flattened array of all activities with their area information
  const allActivities = useMemo(() => {
    return filteredData.flatMap(area => {
      // Create cards for each activity
      const activityCards = area.activities.map(activity => ({
        id: `${area.id}-${activity.title.toLowerCase().replace(/\s+/g, '-')}`,
        title: activity.title,
        description: activity.category,
        category: area.category,
        tags: [...area.tags, activity.category],
        website: activity.website,
        location: activity.address,
        detailPath: `/boulder/${area.id}`
      }));

      // Create cards for each happy hour venue if they exist
      const happyHourCards = area.happyHours?.map(venue => ({
        id: `${area.id}-${venue.name.toLowerCase().replace(/\s+/g, '-')}`,
        title: venue.name,
        description: venue.details,
        category: area.category,
        tags: [...area.tags, 'happy-hour'],
        website: venue.website,
        location: venue.address,
        detailPath: `/boulder/${area.id}`
      })) || [];

      // Combine activity and happy hour cards
      return [...activityCards, ...happyHourCards];
    });
  }, [filteredData]);

  return (
    <Box>
      {/* Breadcrumb */}
      <section className="breadcrumb">
        <div className="swiss-container">
          <ul className="breadcrumb-list">
            <li><RouterLink to="/" className="breadcrumb-link">Home</RouterLink></li>
            <li>/</li>
            <li>Boulder Guide</li>
          </ul>
        </div>
      </section>

      {/* Page Header with Stats */}
      <section className="page-header" style={{ 
        background: 'linear-gradient(135deg, var(--color-warm-taupe) 0%, var(--color-soft-gray) 100%)',
        borderBottom: '1px solid var(--color-soft-gray)',
        padding: 'var(--space-8) 0 var(--space-6) 0'
      }}>
        <div className="swiss-container">
          <div className="header-content" style={{ 
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: 'var(--space-8)',
            alignItems: 'center'
          }}>
            <div>
              <Typography 
                variant="h1" 
                className="page-title" 
                sx={{ 
                  fontSize: '3.5rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '-0.02em',
                  marginBottom: 'var(--space-2)',
                  lineHeight: 1.1
                }}
              >
                Boulder Guide
              </Typography>
              <Typography 
                variant="h5" 
                className="page-subtitle"
                sx={{ 
                  fontSize: '1.25rem',
                  fontWeight: 300,
                  color: 'var(--color-deep-slate)',
                  maxWidth: '600px'
                }}
              >
                Your comprehensive guide to Boulder, CO - From downtown delights to mountain adventures. 
                Discover the best activities, dining spots, and local favorites in each unique neighborhood.
              </Typography>
            </div>
            <div className="stats-box" style={{
              backgroundColor: 'var(--color-white)',
              padding: 'var(--space-4)',
              borderLeft: '4px solid var(--color-accent-sage)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
            }}>
              <div className="stat" style={{ marginBottom: 'var(--space-2)' }}>
                <div className="stat-number" style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: 'var(--color-accent-sage)'
                }}>{boulderData.length}</div>
                <div className="stat-label" style={{
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--color-deep-slate)'
                }}>Areas</div>
              </div>
              <div className="stat" style={{ marginBottom: 'var(--space-2)' }}>
                <div className="stat-number" style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: 'var(--color-accent-sage)'
                }}>{allActivities.length}</div>
                <div className="stat-label" style={{
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--color-deep-slate)'
                }}>Activities & Venues</div>
              </div>
              <div className="stat">
                <div className="stat-number" style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: 'var(--color-accent-sage)'
                }}>{Array.from(new Set(allActivities.flatMap(item => item.tags))).length}</div>
                <div className="stat-label" style={{
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--color-deep-slate)'
                }}>Categories</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Filter Section */}
      <EnhancedFilterSystem
        filters={filterConfigs}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* Content Grid */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {/* Render area cards first */}
            {filteredData.map((area) => (
              <Grid item xs={12} sm={6} md={4} key={area.id}>
                <EnhancedMinimalistCard
                  data={{
                    id: area.id,
                    title: area.title,
                    description: area.description,
                    tags: area.tags,
                    detailPath: `/boulder/${area.id}`
                  }}
                  icon={areaIconMap[area.category]}
                  color="primary"
                />
              </Grid>
            ))}
            
            {/* Render activity and happy hour cards */}
            {allActivities.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <EnhancedMinimalistCard
                  data={item}
                  icon={getActivityIcon(item.description)}
                  color="primary"
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Boulder; 