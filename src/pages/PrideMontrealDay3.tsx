import React, { useState, useCallback, useMemo } from 'react';
import { Box, Grid, Typography, Button, Chip, Card, CardContent } from '@mui/material';
import EnhancedMinimalistCard from '../components/MinimalistCard';
import EnhancedFilterSystem, { FilterConfig } from '../components/EnhancedFilterSystem';
import { useSearch } from '../components/Layout';
import {
  Flag,
  Restaurant,
  TheaterComedy,
  LocationCity,
  Celebration,
  MusicNote,
  NightlifeOutlined,
  Museum,
  Park,
  Business,
  Festival,
  DirectionsWalk,
  ShoppingBag,
  ArrowBack,
  ArrowForward,
  Star,
  Groups,
  AccessTime
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

interface PrideActivity {
  id: string;
  title: string;
  description: string;
  category: string;
  day: string;
  time: string;
  location: string;
  address: string;
  website?: string;
  priceRange: string;
  tags: string[];
  isPrideEvent: boolean;
  isLGBTFriendly: boolean;
  isAlternative?: boolean;
  alternativeFor?: string;
  isSpecialEvent?: boolean;
  peopleEnjoy?: string;
}

// Helper functions for category-specific styling and icons
const getCategoryColor = (category: string) => {
  switch (category) {
    case 'pride-event': return '#FF6B6B'; // Red for Pride Events
    case 'dining': return '#4ECDC4'; // Teal for Dining
    case 'nightlife': return '#45B7D1'; // Blue for Nightlife
    case 'culture': return '#FFD700'; // Gold for Culture
    case 'outdoor': return '#8BC34A'; // Green for Outdoor
    case 'entertainment': return '#FF9800'; // Orange for Entertainment
    default: return '#9E9E9E'; // Grey for others
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'pride-event': return <Celebration />;
    case 'dining': return <Restaurant />;
    case 'nightlife': return <NightlifeOutlined />;
    case 'culture': return <TheaterComedy />;
    case 'outdoor': return <Park />;
    case 'entertainment': return <TheaterComedy />; // Or a different entertainment icon
    default: return <Business />; // Default icon
  }
};

// Day 3 Data - Friday, August 8, 2025
const day3Data: PrideActivity[] = [
  {
    id: "mtn1",
    title: "Mount Royal Morning Hike",
    description: "Start with stunning city views from Montreal's iconic mountain park",
    category: "outdoor",
    day: "Friday",
    time: "8:00 AM - 10:00 AM",
    location: "Mount Royal Park",
    address: "Parc du Mont-Royal, Montreal",
    website: "https://www.lemontroyal.qc.ca/",
    priceRange: "free",
    tags: ["hiking", "views", "nature", "morning"],
    isPrideEvent: false,
    isLGBTFriendly: true,
    peopleEnjoy: "The breathtaking 360-degree views of Montreal and the St. Lawrence River, spotting the Olympic Stadium from above, peaceful forest trails, and the perfect Instagram shots from the Kondiaronk Belvedere"
  },
  {
    id: "mtn1_alt1",
    title: "Alternative: Old Port Ferris Wheel",
    description: "Panoramic Montreal views from La Grande Roue de Montréal",
    category: "outdoor",
    day: "Friday",
    time: "8:00 AM - 10:00 AM",
    location: "La Grande Roue",
    address: "362 Rue de la Commune E, Montreal",
    website: "https://www.lagranderouedemontreal.com/",
    priceRange: "$",
    tags: ["ferris-wheel", "views", "old-port", "romantic"],
    isPrideEvent: false,
    isLGBTFriendly: true,
    isAlternative: true,
    alternativeFor: "mtn1",
    peopleEnjoy: "The romantic climate-controlled gondolas, seeing the entire city from 60 meters high, perfect for couples photos, and the stunning views of Old Montreal's historic architecture below"
  },
  {
    id: "mtn1_alt2",
    title: "Alternative: Jean-Talon Market Morning",
    description: "Explore Montreal's famous public market for local produce and specialties",
    category: "culture",
    day: "Friday",
    time: "8:00 AM - 10:00 AM",
    location: "Jean-Talon Market",
    address: "7070 Henri-Julien Ave, Montreal",
    website: "https://www.marchespublics-mtl.com/marches/jean-talon/",
    priceRange: "$",
    tags: ["market", "local", "food", "culture"],
    isPrideEvent: false,
    isLGBTFriendly: true,
    isAlternative: true,
    alternativeFor: "mtn1",
    peopleEnjoy: "Fresh Quebec produce at its peak, sampling local cheeses and maple products, the bustling multicultural atmosphere, and discovering unique ingredients you can't find anywhere else"
  },
  {
    id: "bru1", 
    title: "Village Pride Brunch",
    description: "Hearty brunch at this popular Village spot known for welcoming atmosphere",
    category: "dining",
    day: "Friday", 
    time: "10:30 AM - 12:00 PM",
    location: "Universel Déjeuners et Grillades",
    address: "1265 Rue Sainte-Catherine E, Montreal",
    website: "https://www.restouniversel.com/",
    priceRange: "$$",
    tags: ["brunch", "village", "lgbtq-friendly"],
    isPrideEvent: false,
    isLGBTFriendly: true,
    peopleEnjoy: "The massive portions that easily serve two people, all-day breakfast menu with creative Benedict variations, cozy Village atmosphere where staff remember regulars, and the perfect fuel-up before Pride events"
  },
  {
    id: "bru1_alt1",
    title: "Alternative: Plateau Brunch Experience",
    description: "Trendy brunch in Montreal's hipster Plateau neighborhood",
    category: "dining",
    day: "Friday",
    time: "10:30 AM - 12:00 PM",
    location: "L'Express",
    address: "3927 Rue Saint-Denis, Montreal",
    website: "https://restaurantlexpress.com/",
    priceRange: "$$",
    tags: ["brunch", "plateau", "hipster", "trendy"],
    isPrideEvent: false,
    isLGBTFriendly: true,
    isAlternative: true,
    alternativeFor: "bru1",
    peopleEnjoy: "The authentic French bistro atmosphere that feels transported from Paris, classic dishes like croque-monsieur and French onion soup, people-watching on bustling Saint-Denis Street, and the vintage tile floors and zinc bar"
  },
  {
    id: "bru1_alt2",
    title: "Alternative: Mile End Café Culture",
    description: "Coffee and pastries in Montreal's creative Mile End district",
    category: "dining",
    day: "Friday",
    time: "10:30 AM - 12:00 PM",
    location: "Café Olimpico",
    address: "124 Rue Saint-Viateur O, Montreal",
    priceRange: "$",
    tags: ["coffee", "mile-end", "creative", "budget"],
    isPrideEvent: false,
    isLGBTFriendly: true,
    isAlternative: true,
    alternativeFor: "bru1",
    peopleEnjoy: "The legendary Italian coffee served in small cups just like in Italy, hanging out with local artists and writers, the no-nonsense atmosphere that's been unchanged for decades, and pairing your café with fresh bagels from nearby St-Viateur"
  },
  {
    id: "community_days_start",
    title: "Community Days Begin - Over 100 Organizations",
    description: "Kiosks for LGBTQ+ organizations, community groups, sports teams line Sainte-Catherine Street pedestrian mall",
    category: "pride-event",
    day: "Friday",
    time: "11:00 AM - 6:00 PM",
    location: "Gay Village Pedestrian Mall",
    address: "Rue Sainte-Catherine Est, Montreal",
    website: "https://fiertemontreal.com/",
    priceRange: "free",
    tags: ["community-days", "organizations", "sports", "village"],
    isPrideEvent: true,
    isLGBTFriendly: true,
    isSpecialEvent: true,
    peopleEnjoy: "Meeting people from across Quebec's LGBTQ+ community, discovering new organizations and support groups, free Pride swag and information, the buzzing energy as the Village transforms into a colorful outdoor festival"
  },
  {
    id: "dis1",
    title: "DistinXion - Celebrating Queer Fxmmes",
    description: "Official Fierté Montréal event celebrating queer women with Fefe Dobson (5 PM), Charlotte Day Wilson (7 PM), and G Flip (9 PM)",
    category: "pride-event",
    day: "Friday",
    time: "5:00 PM - 11:00 PM", 
    location: "TD Stage, Olympic Park Esplanade",
    address: "Olympic Park Esplanade, Montreal",
    website: "https://fiertemontreal.com/",
    priceRange: "free",
    tags: ["pride", "distinxion", "fefe-dobson", "charlotte-day-wilson", "g-flip"],
    isPrideEvent: true,
    isLGBTFriendly: true,
    isSpecialEvent: true,
    peopleEnjoy: "Seeing Canadian music icon Fefe Dobson perform 'Bye Bye Boyfriend' live, Charlotte Day Wilson's soulful voice under the Montreal sky, G Flip's infectious energy and drumming skills, and the massive free celebration of queer women"
  },
  {
    id: "hedwig_show",
    title: "Hedwig and the Angry Inch",
    description: "Four performances of the rock musical at Café Cleopatra (also showing Aug 9-10)",
    category: "culture",
    day: "Friday",
    time: "8:00 PM - 10:00 PM",
    location: "Café Cleopatra",
    address: "1230 Rue Saint-Laurent, Montreal",
    priceRange: "$$",
    tags: ["hedwig", "rock-musical", "cafe-cleopatra", "theatre"],
    isPrideEvent: false,
    isLGBTFriendly: true,
    isSpecialEvent: true,
    peopleEnjoy: "The intimate venue where you're practically on stage with the performers, the powerful rock music and drag performance, the raw emotional storytelling about identity and love, and Café Cleopatra's legendary atmosphere"
  },
  {
    id: "dis1_alt1",
    title: "Alternative: Locker Room at Club Soda",
    description: "Club Soda's Pride edition of their popular Locker Room party",
    category: "pride-event",
    day: "Friday",
    time: "10:00 PM - Late",
    location: "Club Soda",
    address: "1225 Boul. Saint-Laurent, Montreal",
    website: "https://clubsoda.ca/",
    priceRange: "$$",
    tags: ["pride", "clubsoda", "locker-room", "party"],
    isPrideEvent: true,
    isLGBTFriendly: true,
    isAlternative: true,
    alternativeFor: "dis1",
    isSpecialEvent: true,
    peopleEnjoy: "Club Soda's world-class sound system that makes you feel every beat, the inclusive crowd from across Montreal, themed décor and special Pride performances, and dancing until the sun comes up"
  },
  {
    id: "dis1_alt2",
    title: "Alternative: Cabaret Mado Drag Extravaganza",
    description: "Montreal's most famous drag venue with special Pride performances",
    category: "entertainment",
    day: "Friday",
    time: "9:00 PM - Late",
    location: "Cabaret Mado",
    address: "1115 Rue Sainte-Catherine E, Montreal",
    website: "https://cabaretmado.ca/",
    priceRange: "$$",
    tags: ["drag", "cabaret", "mado", "entertainment", "pride"],
    isPrideEvent: false,
    isLGBTFriendly: true,
    isAlternative: true,
    alternativeFor: "dis1",
    peopleEnjoy: "Mado herself - Montreal's most beloved drag queen and comedian, the hilarious French and English comedy that locals quote for weeks, intimate venue where performers interact directly with the audience, and the legendary after-show mingling"
  },
  {
    id: "weska1",
    title: "WESKA at Newspeak - íLESONIQ EN VILLE",
    description: "Electronic music night featuring WESKA as part of íLESONIQ EN VILLE series",
    category: "nightlife",
    day: "Friday",
    time: "10:00 PM - 3:00 AM",
    location: "Newspeak Montreal",
    address: "1403 Rue Sainte Élisabeth, Montreal",
    website: "https://www.newspeakmtl.com/",
    priceRange: "$$$",
    tags: ["electronic", "weska", "newspeak", "ilesoniq", "edm"],
    isPrideEvent: false,
    isLGBTFriendly: true,
    isSpecialEvent: true,
    peopleEnjoy: "WESKA's signature melodic techno and progressive house, Newspeak's state-of-the-art sound system and lighting, the underground warehouse vibe, and connecting with Montreal's serious electronic music community"
  }
];

// Filter configurations
const filterConfigs: FilterConfig[] = [
  {
    key: 'category',
    label: 'Category', 
    placeholder: 'Select categories',
    options: [
      { value: 'pride-event', label: 'Pride Events' },
      { value: 'dining', label: 'Dining' },
      { value: 'nightlife', label: 'Nightlife' },
      { value: 'culture', label: 'Culture' },
      { value: 'outdoor', label: 'Outdoor' },
      { value: 'entertainment', label: 'Entertainment' }
    ]
  },
  {
    key: 'priceRange',
    label: 'Price Range',
    placeholder: 'Select price ranges',
    options: [
      { value: 'free', label: 'Free' },
      { value: '$', label: '$' },
      { value: '$$', label: '$$' },
      { value: '$$$', label: '$$$' }
    ]
  },
  {
    key: 'time',
    label: 'Time of Day',
    placeholder: 'Select times',
    options: [
      { value: 'morning', label: 'Morning' },
      { value: 'afternoon', label: 'Afternoon' },
      { value: 'evening', label: 'Evening' },
      { value: 'night', label: 'Night' }
    ]
  }
];

const PrideMontrealDay3 = () => {
  const { searchTerm } = useSearch();
  const [filteredData, setFilteredData] = useState<PrideActivity[]>(day3Data);

  const applyFilters = useCallback((filters: Record<string, string[]>) => {
    let filtered = day3Data;

    if (searchTerm && searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(activity =>
        activity.title.toLowerCase().includes(searchLower) ||
        activity.description.toLowerCase().includes(searchLower) ||
        activity.location.toLowerCase().includes(searchLower) ||
        activity.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    if (filters.category && filters.category.length > 0) {
      filtered = filtered.filter(activity => filters.category.includes(activity.category));
    }

    if (filters.priceRange && filters.priceRange.length > 0) {
      filtered = filtered.filter(activity => filters.priceRange.includes(activity.priceRange));
    }

    if (filters.time && filters.time.length > 0) {
      filtered = filtered.filter(activity => {
        const timeStr = activity.time.toLowerCase();
        return filters.time.some(timeFilter => {
          switch (timeFilter) {
            case 'morning': return timeStr.includes('am') && (timeStr.includes('8:') || timeStr.includes('9:') || timeStr.includes('10:') || timeStr.includes('11:'));
            case 'afternoon': return timeStr.includes('pm') && (timeStr.includes('12:') || timeStr.includes('1:') || timeStr.includes('2:') || timeStr.includes('3:') || timeStr.includes('4:') || timeStr.includes('5:'));
            case 'evening': return timeStr.includes('pm') && (timeStr.includes('6:') || timeStr.includes('7:') || timeStr.includes('8:'));
            case 'night': return timeStr.includes('pm') && (timeStr.includes('9:') || timeStr.includes('10:') || timeStr.includes('11:')) || timeStr.includes('late');
            default: return false;
          }
        });
      });
    }

    setFilteredData(filtered);
  }, [searchTerm]);

  const groupedActivities = useMemo(() => {
    const mainActivities = filteredData.filter(activity => !activity.isAlternative);
    const alternatives = filteredData.filter(activity => activity.isAlternative);
    
    return mainActivities.map(main => ({
      main,
      alternatives: alternatives.filter(alt => alt.alternativeFor === main.id)
    }));
  }, [filteredData]);

  return (
    <Box sx={{ padding: { xs: 2, md: 4 }, maxWidth: '1400px', margin: '0 auto' }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Button
          component={RouterLink}
          to="/pride-montreal-kp"
          startIcon={<ArrowBack />}
          sx={{ mb: 2, alignSelf: 'flex-start' }}
        >
          Back to Pride Montreal KP Overview
        </Button>
        
        <Typography variant="h2" sx={{ 
          fontSize: 'clamp(2rem, 5vw, 3.5rem)', 
          fontWeight: 'bold', 
          mb: 2,
          background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent'
        }}>
          Day 3: DistinXion
        </Typography>
        
        <Typography variant="h4" sx={{ 
          fontSize: 'clamp(1.2rem, 3vw, 2rem)', 
          fontWeight: 'medium',
          color: 'text.secondary',
          mb: 1
        }}>
          Friday, August 8, 2025
        </Typography>
        
        <Typography variant="body1" sx={{ 
          fontSize: '1.1rem',
          color: 'text.secondary',
          maxWidth: '800px',
          margin: '0 auto',
          mb: 3
        }}>
          Experience Montreal Pride's signature party celebrating queer women with Fefe Dobson, Charlotte Day Wilson, and G Flip. Community Days also begin!
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', mb: 3 }}>
          <Chip icon={<Star />} label="DistinXion" color="primary" />
          <Chip icon={<MusicNote />} label="Fefe Dobson" color="secondary" />
          <Chip icon={<Groups />} label="Community Days" />
          <Chip icon={<Park />} label="Mount Royal" variant="outlined" />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {day3Data.map((activity) => (
          <Grid item xs={12} md={6} lg={4} key={activity.id}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              border: activity.isAlternative ? '2px dashed #ccc' : activity.isPrideEvent ? '2px solid #FF6B6B' : '1px solid #eee',
              borderRadius: 2,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              },
              transition: 'all 0.3s ease'
            }}>
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Box 
                    sx={{ 
                      backgroundColor: getCategoryColor(activity.category), 
                      color: 'white', 
                      borderRadius: '50%', 
                      p: 1, 
                      mr: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: 40,
                      height: 40
                    }}
                  >
                    {getCategoryIcon(activity.category)}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    {activity.isAlternative && (
                      <Chip label="Alternative" size="small" sx={{ mb: 1 }} />
                    )}
                    {activity.isPrideEvent && (
                      <Chip label="Pride Event" size="small" color="primary" sx={{ mb: 1, mr: 1 }} />
                    )}
                    {activity.isSpecialEvent && (
                      <Chip label="Special Event" size="small" color="secondary" sx={{ mb: 1 }} />
                    )}
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, lineHeight: 1.2 }}>
                      {activity.title}
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary', lineHeight: 1.5 }}>
                  {activity.description}
                </Typography>

                {/* What People Enjoy Section */}
                {activity.peopleEnjoy && (
                  <Box sx={{ 
                    backgroundColor: '#f8f9fa', 
                    padding: 2, 
                    borderRadius: 2, 
                    mb: 2,
                    border: '1px solid #e9ecef'
                  }}>
                    <Typography variant="body2" sx={{ 
                      fontWeight: 'bold', 
                      color: getCategoryColor(activity.category),
                      mb: 1
                    }}>
                      ✨ What People Love:
                    </Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                      {activity.peopleEnjoy}
                    </Typography>
                  </Box>
                )}
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AccessTime sx={{ mr: 1, fontSize: 16 }} />
                    {activity.time}
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationCity sx={{ mr: 1, fontSize: 16 }} />
                    {activity.location}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    📍 {activity.address}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  <Chip label={activity.priceRange} size="small" variant="outlined" />
                  {activity.tags.slice(0, 2).map((tag) => (
                    <Chip key={tag} label={tag} size="small" variant="outlined" />
                  ))}
                </Box>
                
                {activity.website && (
                  <Button 
                    href={activity.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outlined"
                    size="small"
                    fullWidth
                  >
                    Visit Website
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 6, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Button
          component={RouterLink}
          to="/pride-montreal-day2"
          variant="outlined"
          startIcon={<ArrowBack />}
        >
          Previous: Day 2
        </Button>
        <Button
          component={RouterLink}
          to="/pride-montreal-day4"
          variant="contained"
          endIcon={<ArrowForward />}
        >
          Next: Day 4 - Xcellence
        </Button>
      </Box>
    </Box>
  );
};

export default PrideMontrealDay3; 