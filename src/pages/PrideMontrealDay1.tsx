import React from 'react';
import { Box, Grid, Typography, Button, Chip, Card, CardContent } from '@mui/material';
import {
  Flag,
  Restaurant,
  DirectionsWalk,
  Business,
  AccessTime,
  LocationCity,
  ArrowBack,
  ArrowForward
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

// Pride Montreal Day 1 data structure with real venues and insights
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
  peopleEnjoy?: string; // What people love about this place/event
}

// Day 1 Data - Wednesday, August 6, 2025 - Enhanced with real details
const day1Data: PrideActivity[] = [
  {
    id: "transport_setup",
    title: "Local Insider Tip: Transportation Setup",
    description: "Get an OPUS card at Metro stations, convenience stores, or pharmacies. Load with weekly pass for efficient Metro travel. Optional: BIXI bike rentals ($1.50/ride + per minute, or daily passes)",
    category: "logistics",
    day: "Wednesday",
    time: "Upon Arrival",
    location: "Any Metro Station",
    address: "Throughout Montreal Metro System",
    priceRange: "$",
    tags: ["transportation", "opus-card", "bixi-bikes", "metro"],
    isPrideEvent: false,
    isLGBTFriendly: true,
    peopleEnjoy: "The Metro system being super efficient for getting around during Pride week, BIXI bike stations everywhere for adventurous exploring, and having unlimited Metro access with the weekly pass for all Pride events"
  },
  {
    id: "arr1",
    title: "Arrive & Check-in - Gay Village Hotels",
    description: "Arrive in Montreal and check into LGBTQ+-friendly accommodations in the heart of the Village",
    category: "logistics",
    day: "Wednesday",
    time: "2:00 PM - 4:00 PM",
    location: "Hotel Quartier des Spectacles or Days Inn Montreal Centre-Ville",
    address: "1225 Rue Saint-Laurent or 215 Rue René-Lévesque E, Montreal",
    priceRange: "varies",
    tags: ["arrival", "accommodation", "village-location"],
    isPrideEvent: false,
    isLGBTFriendly: true,
    peopleEnjoy: "Strategic location steps from Pride events, welcoming staff, and Pride-friendly atmosphere during festival week"
  },
  {
    id: "wel1",
    title: "Le Saloon Bistro Bar - Village Icon Since 1986",
    description: "Legendary Gay Village institution famous for its drag shows, cocktails, and authentic French-Canadian bistro cuisine",
    category: "dining",
    day: "Wednesday", 
    time: "6:00 PM - 8:00 PM",
    location: "Le Saloon Bistro Bar",
    address: "1333 Rue Sainte-Catherine E, Montreal, QC H2L 2H4",
    website: "http://lesaloon.ca",
    priceRange: "$$",
    tags: ["dinner", "cocktails", "village-icon", "drag-shows"],
    isPrideEvent: false,
    isLGBTFriendly: true,
    peopleEnjoy: "Authentic Village atmosphere, legendary drag performers, excellent tartares and beef dishes, plus the historic charm of Montreal's oldest gay bistro"
  },
  {
    id: "wel1_alt1",
    title: "Alternative: Universel Déjeuners et Grillades",
    description: "Popular Village brunch spot known for generous portions and LGBTQ+-friendly atmosphere",
    category: "dining",
    day: "Wednesday",
    time: "6:00 PM - 8:00 PM", 
    location: "Universel Déjeuners et Grillades",
    address: "1265 Rue Sainte-Catherine E, Montreal, QC H2L 2G9",
    website: "https://www.restouniversel.com/",
    priceRange: "$$",
    tags: ["dinner", "comfort-food", "generous-portions"],
    isPrideEvent: false,
    isLGBTFriendly: true,
    isAlternative: true,
    alternativeFor: "wel1",
    peopleEnjoy: "Massive portions, all-day breakfast menu, cozy Village atmosphere, and staff who know regulars by name"
  },
  {
    id: "wel1_alt2",
    title: "Alternative: Olive + Gourmando",
    description: "Upscale Old Montreal café known for artisanal sandwiches, pastries, and coffee",
    category: "dining",
    day: "Wednesday",
    time: "6:00 PM - 8:00 PM",
    location: "Olive + Gourmando",
    address: "351 Rue Saint-Paul O, Montreal, QC H2Y 2A7",
    website: "https://oliveetgourmando.com/",
    priceRange: "$",
    tags: ["artisanal", "old-montreal", "coffee"],
    isPrideEvent: false,
    isLGBTFriendly: true,
    isAlternative: true,
    alternativeFor: "wel1",
    peopleEnjoy: "Instagram-worthy presentation, artisanal breads baked in-house, unique sandwich combinations, and cozy Old Montreal ambiance"
  },
  {
    id: "exp1",
    title: "Village Walk & Historic Bars Tour",
    description: "Guided exploration of iconic Gay Village landmarks: Beaudry Metro rainbow pillars, historic bars, and Pride installations",
    category: "exploration",
    day: "Wednesday",
    time: "8:00 PM - 11:00 PM",
    location: "Gay Village Circuit",
    address: "Rue Sainte-Catherine E (Berri to Papineau), Montreal",
    priceRange: "$$",
    tags: ["village", "bars", "history", "rainbow-pillars"],
    isPrideEvent: true,
    isLGBTFriendly: true,
    peopleEnjoy: "The rainbow pillars at Beaudry Metro (Instagram-perfect!), discovering 40+ years of LGBTQ+ history, meeting locals, and seeing Pride decorations throughout the Village"
  },
  {
    id: "jardins_gamelin",
    title: "Jardins Gamelin Pride Warm-Up Shows",
    description: "Free outdoor performances and community gatherings in Montreal's vibrant urban plaza with food trucks and live music",
    category: "pride-event",
    day: "Wednesday",
    time: "4:00 PM - 10:00 PM",
    location: "Jardins Gamelin",
    address: "1680 Rue Sainte-Catherine E, Montreal, QC H2L 4Y5",
    website: "https://www.jardingamelin.com/",
    priceRange: "free",
    tags: ["jardins-gamelin", "pride-shows", "outdoor", "food-trucks"],
    isPrideEvent: true,
    isLGBTFriendly: true,
    isSpecialEvent: true,
    peopleEnjoy: "Free performances, diverse food truck options, relaxed outdoor atmosphere, and a great way to meet other Pride-goers before the main events begin"
  },
  {
    id: "unity_visit",
    title: "Club Unity Preview - Montreal's Biggest Inclusive Club",
    description: "Evening visit to the legendary 3-floor inclusive nightclub that's been a Village cornerstone since 2002",
    category: "nightlife",
    day: "Wednesday",
    time: "9:00 PM - 11:00 PM",
    location: "Club Unity",
    address: "1171 Rue Sainte-Catherine E, Montreal, QC H2L 2G8",
    website: "https://www.clubunity.com/",
    priceRange: "$$",
    tags: ["unity", "3-floors", "rooftop-terrace", "inclusive"],
    isPrideEvent: false,
    isLGBTFriendly: true,
    peopleEnjoy: "Massive 3-floor layout with different vibes on each level, rooftop terrace with Village views, VIP lounges, and the most inclusive crowd in Montreal"
  },
  {
    id: "local_gem_1",
    title: "Local Gem: Les P'tits Enfants de Felice - Mile End Coffee Culture",
    description: "Beloved neighborhood coffee shop in Mile End where locals have been gathering since the early days, known for authentic community bonds",
    category: "dining",
    day: "Wednesday",
    time: "10:00 AM - 12:00 PM",
    location: "Les P'tits Enfants de Felice",
    address: "5563 av. du Parc, Montreal, QC H2V 4H2",
    website: "https://www.cafefelice.ca/",
    priceRange: "$",
    tags: ["local-gem", "mile-end", "coffee", "community"],
    isPrideEvent: false,
    isLGBTFriendly: true,
    peopleEnjoy: "The proud Mile End roots and authentic neighborhood bonds forged over years, the welcoming and lively atmosphere that creates community connections, locally roasted house blend with unique taste, and baristas who open at 5 AM to serve the community"
  },
  {
    id: "local_gem_2", 
    title: "Local Gem: Gokudo - Montreal's Best Kept Secret",
    description: "Hidden Japanese cocktail bar behind a 6-seat fish shack called Ryoshi - 'when you walk through the door, you are no longer in Montreal'",
    category: "nightlife",
    day: "Wednesday",
    time: "11:00 PM - Late",
    location: "Gokudo (Hidden behind Ryoshi)",
    address: "630 Rue Cathcart, Montreal, QC H3B 1L9",
    website: "https://gokudo.ca/",
    priceRange: "$$$",
    tags: ["hidden-bar", "japanese", "secret", "sake"],
    isPrideEvent: false,
    isLGBTFriendly: true,
    peopleEnjoy: "The thrill of finding Montreal's best-kept secret hidden behind a tiny fish shack, transportation to authentic Japanese culture through sake and handcrafted cocktails, the intimate atmosphere where you truly feel you're no longer in Montreal, and being part of an exclusive experience"
  },
  {
    id: "friend_rec_palme",
    title: "Friend's Rec: Palme - Tropical Village Vibes",
    description: "Cool, relaxed tropical vibe restaurant in the Village - a local's go-to for a chill but delicious meal, perfect for your first night",
    category: "dining", 
    day: "Wednesday",
    time: "7:00 PM - 9:00 PM",
    location: "Palme",
    address: "Rue Sainte-Catherine E, Montreal (Village)",
    priceRange: "$$",
    tags: ["friend-rec", "tropical", "village", "relaxed"],
    isPrideEvent: false,
    isLGBTFriendly: true,
    peopleEnjoy: "The cool, relaxed tropical atmosphere that locals love for unwinding, being right in the heart of the Village during Pride week, the perfect chill-but-delicious meal balance, and starting your Pride week the way locals do"
  },
  {
    id: "friend_rec_bar_renard",
    title: "Friend's Rec: Bar Renard - Perfect Village Nightcap",
    description: "Great mix of locals and visitors with cool cocktails - the perfect spot to chat and unwind after travel without going too hard on night one",
    category: "nightlife",
    day: "Wednesday", 
    time: "9:30 PM - 11:30 PM",
    location: "Bar Renard",
    address: "Rue Sainte-Catherine E, Montreal (Village)",
    priceRange: "$$",
    tags: ["friend-rec", "cocktails", "village", "locals-and-visitors"],
    isPrideEvent: false,
    isLGBTFriendly: true,
    peopleEnjoy: "The perfect mix of locals and Pride visitors creating great conversation, cool cocktails that aren't too strong for your first night, the ideal spot to unwind after travel, and being right where all the Pride action happens"
  }
];

const PrideMontrealDay1 = () => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'pride-event': return <Flag />;
      case 'dining': return <Restaurant />;
      case 'exploration': return <DirectionsWalk />;
      case 'logistics': return <Business />;
      case 'nightlife': return <Flag />;
      default: return <Flag />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'pride-event': return '#FF6B6B';
      case 'dining': return '#4ECDC4';
      case 'nightlife': return '#9B59B6';
      case 'exploration': return '#F39C12';
      case 'logistics': return '#95A5A6';
      default: return '#2C3E50';
    }
  };

  return (
    <Box sx={{ padding: { xs: 2, md: 4 }, maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
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
          Day 1: Arrival & Village Welcome
        </Typography>
        
        <Typography variant="h4" sx={{ 
          fontSize: 'clamp(1.2rem, 3vw, 2rem)', 
          fontWeight: 'medium',
          color: 'text.secondary',
          mb: 1
        }}>
          Wednesday, August 6, 2025
        </Typography>
        
        <Typography variant="body1" sx={{ 
          fontSize: '1.1rem',
          color: 'text.secondary',
          maxWidth: '800px',
          margin: '0 auto',
          mb: 3
        }}>
          Settle into Montreal's vibrant Gay Village - North America's largest! Experience the warm welcome, iconic landmarks, and legendary venues that make this neighborhood special.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', mb: 3 }}>
          <Chip icon={<Flag />} label="Pride Warm-Up Events" color="primary" />
          <Chip icon={<Restaurant />} label="Village Dining Icons" color="secondary" />
          <Chip icon={<DirectionsWalk />} label="Historic Walking Tour" />
        </Box>
      </Box>

      {/* Activities Grid */}
      <Grid container spacing={3}>
        {day1Data.map((activity) => (
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

      {/* Navigation to Next Day */}
      <Box sx={{ mt: 6, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Button
          component={RouterLink}
          to="/pride-montreal-kp"
          variant="outlined"
          startIcon={<ArrowBack />}
        >
          Back to Overview
        </Button>
        <Button
          component={RouterLink}
          to="/pride-montreal-day2"
          variant="contained"
          endIcon={<ArrowForward />}
        >
          Next: Day 2 - Soirée 100% Drag
        </Button>
      </Box>
    </Box>
  );
};

export default PrideMontrealDay1; 