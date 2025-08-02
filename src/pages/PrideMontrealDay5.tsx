import React from 'react';
import { Box, Grid, Typography, Button, Chip, Card, CardContent } from '@mui/material';
import {
  Flag,
  Restaurant,
  MusicNote,
  NightlifeOutlined,
  Festival,
  ArrowBack,
  EmojiEvents,
  CelebrationOutlined,
  AccessTime,
  LocationCity,
  Business
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
    case 'pride-event': return '#FF6B6B';
    case 'dining': return '#4ECDC4';
    case 'nightlife': return '#9B59B6';
    case 'logistics': return '#95A5A6';
    default: return '#2C3E50';
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'pride-event': return <Flag />;
    case 'dining': return <Restaurant />;
    case 'nightlife': return <NightlifeOutlined />;
    case 'logistics': return <Business />;
    default: return <Flag />;
  }
};

// Day 5 Data - Sunday, August 10, 2025 - Pride Parade Day Enhanced
const day5Data: PrideActivity[] = [
  {
    id: "pre1",
    title: "Pride Parade Preparation & Breakfast",
    description: "Get ready for the big day with Pride gear and energy-boosting breakfast",
    category: "logistics",
    day: "Sunday",
    time: "9:00 AM - 11:00 AM",
    location: "Village Area",
    address: "Near René-Lévesque Boulevard",
    priceRange: "$",
    tags: ["preparation", "pride-gear", "breakfast"],
    isPrideEvent: true,
    isLGBTFriendly: true,
    peopleEnjoy: "Final Pride outfit coordination and group photos, hearty breakfast to fuel the parade energy, meeting up with friends from around the world, and the electric anticipation as the Village buzzes with pre-parade excitement"
  },
  {
    id: "pre1_alt1",
    title: "Alternative: íLESONIQ Day 2 Early Entry",
    description: "Get to íLESONIQ early to secure good spots for the day's performances",
    category: "logistics",
    day: "Sunday",
    time: "11:00 AM - 1:00 PM",
    location: "Parc Jean-Drapeau",
    address: "1 Circuit Gilles Villeneuve, Montreal",
    priceRange: "$$$",
    tags: ["ilesoniq", "early-entry", "festival", "strategy"],
    isPrideEvent: false,
    isLGBTFriendly: true,
    isAlternative: true,
    alternativeFor: "pre1",
    peopleEnjoy: "Beating the crowds to get prime spots near the main stage, exploring the festival grounds before they get packed, discovering food vendors and art installations, and connecting with electronic music fans from around the world"
  },
  {
    id: "pre1_alt2",
    title: "Alternative: Village Pride Brunch",
    description: "Leisurely Pride brunch in the Village before parade activities",
    category: "dining",
    day: "Sunday",
    time: "10:00 AM - 12:00 PM",
    location: "Village Brunch Spot",
    address: "Rue Sainte-Catherine Est, Montreal",
    priceRange: "$$",
    tags: ["brunch", "village", "leisurely", "pride"],
    isPrideEvent: false,
    isLGBTFriendly: true,
    isAlternative: true,
    alternativeFor: "pre1",
    peopleEnjoy: "Relaxed bottomless mimosas and Pride-themed cocktails, people-watching as the Village transforms for parade day, sharing stories with other Pride visitors, and the perfect Instagram brunch shots with rainbow decorations"
  },
  {
    id: "par1",
    title: "Montreal Pride Parade - 'Blossom Here, Now!'", 
    description: "March in the largest francophone Pride parade in the world! Theme: Blossom Here, Now!",
    category: "pride-event",
    day: "Sunday",
    time: "1:00 PM - 4:00 PM",
    location: "Pride Parade Route",
    address: "René-Lévesque (Metcalfe to Atateken)",
    website: "https://fiertemontreal.com/",
    priceRange: "free",
    tags: ["parade", "march", "pride", "main-event", "blossom"],
    isPrideEvent: true,
    isLGBTFriendly: true,
    isSpecialEvent: true,
    peopleEnjoy: "Marching with thousands in the largest francophone Pride parade, the incredible energy and cheers from hundreds of thousands of spectators, seeing Montreal's skyline as backdrop, and the overwhelming feeling of community and acceptance"
  },
  {
    id: "par1_alt1",
    title: "Alternative: íLESONIQ 2025 Day 2 Finale",
    description: "Continue the electronic music festival with day 2 headliners and closing sets",
    category: "nightlife",
    day: "Sunday",
    time: "2:00 PM - 11:00 PM",
    location: "Parc Jean-Drapeau",
    address: "1 Circuit Gilles Villeneuve, Montreal",
    website: "https://ilesoniq.com/",
    priceRange: "$$$",
    tags: ["ilesoniq", "day2", "finale", "electronic", "festival"],
    isPrideEvent: false,
    isLGBTFriendly: true,
    isAlternative: true,
    alternativeFor: "par1",
    isSpecialEvent: true,
    peopleEnjoy: "The festival's climactic closing sets and surprise guests, sunset dancing by the St. Lawrence River, the final burst of electronic energy, and connecting with the international electronic music community one last time"
  },
  {
    id: "par1_alt2",
    title: "Alternative: Parade Viewing Party",
    description: "Watch the Pride parade from prime Village locations with friends and drinks",
    category: "pride-event",
    day: "Sunday", 
    time: "12:00 PM - 4:00 PM",
    location: "Village Viewing Spots",
    address: "Rue Sainte-Catherine E & René-Lévesque intersection",
    priceRange: "$",
    tags: ["viewing", "party", "village", "friends", "drinks"],
    isPrideEvent: true,
    isLGBTFriendly: true,
    isAlternative: true,
    alternativeFor: "par1",
    peopleEnjoy: "Prime viewing spots without the parade crowd crush, signature Pride cocktails and champagne toasts, cheering on friends marching in the parade, and the festive outdoor party atmosphere with perfect views"
  },
  {
    id: "mega_t_dance",
    title: "Mega T-Dance - Montreal's Biggest Dancefloor",
    description: "Official Fierté Montréal - Montreal's biggest dancefloor comes alive after the Pride Parade with DJs Black Flamingo and Marti Frieson",
    category: "pride-event",
    day: "Sunday",
    time: "3:00 PM - 10:00 PM",
    location: "Olympic Park Esplanade",
    address: "Olympic Park Esplanade, Montreal",
    website: "https://fiertemontreal.com/",
    priceRange: "free",
    tags: ["mega-t-dance", "black-flamingo", "marti-frieson", "olympic-park", "official"],
    isPrideEvent: true,
    isLGBTFriendly: true,
    isSpecialEvent: true,
    peopleEnjoy: "The massive outdoor dancefloor that holds over 15,000 people, Black Flamingo's infectious house music energy, Marti Frieson's seamless mixing and crowd control, and dancing under the Montreal sky with the Olympic Stadium as backdrop"
  },
  {
    id: "pride_sundae",
    title: "Pride Sundae at Club Soda",
    description: "Club Soda's official Pride finale party - the sweet ending to Pride week",
    category: "pride-event",
    day: "Sunday",
    time: "8:00 PM - Late",
    location: "Club Soda",
    address: "1225 Boul. Saint-Laurent, Montreal",
    website: "https://clubsoda.ca/",
    priceRange: "$$",
    tags: ["pride-sundae", "finale", "clubsoda", "official", "sweet"],
    isPrideEvent: true,
    isLGBTFriendly: true,
    isSpecialEvent: true,
    peopleEnjoy: "The perfect 'sweet' ending to Pride week with themed cocktails and desserts, Club Soda's legendary sound system for the final dance, emotional goodbyes and new friendships made, and the bittersweet feeling of an incredible week coming to an end"
  },
  {
    id: "secret_b2b",
    title: "Secret B2B - íLESONIQ Afterparty at Newspeak",
    description: "Mystery back-to-back DJ set - íLESONIQ's secret afterparty (artists TBA)",
    category: "nightlife",
    day: "Sunday",
    time: "10:00 PM - 3:00 AM",
    location: "Newspeak Montreal",
    address: "1403 Rue Sainte Élisabeth, Montreal",
    website: "https://www.newspeakmtl.com/",
    priceRange: "$$$",
    tags: ["secret", "b2b", "mystery", "ilesoniq", "afterparty"],
    isPrideEvent: false,
    isLGBTFriendly: true,
    isSpecialEvent: true,
    peopleEnjoy: "The thrill of not knowing which surprise DJ superstars will perform, intimate warehouse vibes after the massive outdoor festival, discovering new electronic music gems, and being part of Montreal's underground music scene"
  },
  {
    id: "final_celebration",
    title: "Final Village Celebration",
    description: "End your Pride week dancing at multiple Village venues - Unity, Le Stud, Aigle Noir",
    category: "nightlife",
    day: "Sunday",
    time: "9:00 PM - Late",
    location: "Multiple Village Venues",
    address: "Rue Sainte-Catherine E, Montreal",
    priceRange: "$$",
    tags: ["unity", "le-stud", "aigle-noir", "village", "finale"],
    isPrideEvent: false,
    isLGBTFriendly: true,
    peopleEnjoy: "Bar-hopping through the Village's legendary venues each with its own vibe, from Unity's 3 floors to Le Stud's intimate atmosphere, meeting locals and saying goodbye to new friends, and the magical feeling of the Village on Pride night"
  },
  {
    id: "local_gem_day5_1",
    title: "Local Gem: Pichai - Montreal's Trendiest Natural Wine & Small Plates",
    description: "Hottest reservation in town featuring natural wines, innovative small plates, and the cool factor that defines Montreal's current dining scene",
    category: "dining",
    day: "Sunday",
    time: "4:00 PM - 6:00 PM",
    location: "Pichai",
    address: "Montreal, QC (Reservation Required)",
    website: "https://pichai.biz/",
    priceRange: "$$$",
    tags: ["local-gem", "natural-wine", "trendy", "small-plates"],
    isPrideEvent: false,
    isLGBTFriendly: true,
    peopleEnjoy: "Scoring a reservation at Montreal's most in-demand restaurant known for its incredible natural wine selection, innovative small plates that showcase local ingredients, the stylish atmosphere that attracts Montreal's coolest crowd, and being part of the city's most talked-about dining experience during Pride weekend"
  },
  {
    id: "local_gem_day5_2",
    title: "Local Gem: Chez Baptiste Mont-Royal - Plateau's Beloved Neighborhood Bar",
    description: "Classic Plateau institution on Mont-Royal Avenue where locals have gathered for years, featuring Quebec microbreweries and authentic neighborhood charm",
    category: "nightlife",
    day: "Sunday",
    time: "7:00 PM - 10:00 PM",
    location: "Chez Baptiste Mont-Royal",
    address: "1045 Avenue du Mont-Royal E, Montreal, QC H2J 1X7",
    priceRange: "$$",
    tags: ["local-gem", "plateau", "neighborhood", "microbreweries"],
    isPrideEvent: false,
    isLGBTFriendly: true,
    peopleEnjoy: "The authentic Plateau neighborhood atmosphere on iconic Mont-Royal Avenue, celebrating with locals at this beloved institution known for Quebec microbreweries, the community feeling that embodies Montreal's neighborhood culture, and the perfect spot to toast the end of an incredible Pride week with new friends"
  },
  {
    id: "friend_rec_parade_strategy",
    title: "Friend's Rec: Pride Parade Positioning Strategy",
    description: "Get there early! René-Lévesque & Metcalfe area is great for photos, or closer to Village for maximum energy. It's an explosion of colour, music, and joy - cheer loud!",
    category: "pride-event",
    day: "Sunday",
    time: "12:00 PM - 1:00 PM (Early Positioning)",
    location: "Parade Route - Strategic Positioning",
    address: "René-Lévesque & Metcalfe or near Village entrance",
    priceRange: "free",
    tags: ["friend-rec", "parade-strategy", "positioning", "photos"],
    isPrideEvent: true,
    isLGBTFriendly: true,
    isSpecialEvent: true,
    peopleEnjoy: "Getting the perfect photo spots before crowds arrive, witnessing the explosion of colour and music from prime locations, being part of Montreal's biggest celebration, and feeling the incredible energy as thousands march for love and acceptance"
  },
  {
    id: "friend_rec_mega_t_dance_enhanced",
    title: "Friend's Rec: Mega T-Dance - Dance with Thousands of Your Closest Queer Friends!",
    description: "After parade, everyone funnels to Olympic Hub for the huge outdoor dance party with international DJs - you'll be dancing with thousands of your closest queer friends!",
    category: "pride-event",
    day: "Sunday",
    time: "3:00 PM - 10:00 PM",
    location: "Olympic Park Esplanade", 
    address: "Olympic Park Esplanade, Montreal",
    website: "https://fiertemontreal.com/",
    priceRange: "free",
    tags: ["friend-rec", "mega-t-dance", "international-djs", "thousands"],
    isPrideEvent: true,
    isLGBTFriendly: true,
    isSpecialEvent: true,
    peopleEnjoy: "Dancing with thousands of your closest queer friends from around the world, international DJs providing the soundtrack to Pride's climax, the massive outdoor dancefloor energy, and being part of Montreal's biggest Pride celebration finale"
  },
  {
    id: "friend_rec_la_banquise",
    title: "Friend's Rec: La Banquise - Perfect Pride Week Ending with Classic Poutine",
    description: "Classic Montreal poutine at this 24/7 institution - perfect after a day of celebrating. Close to home base and open all night!",
    category: "dining",
    day: "Sunday",
    time: "10:00 PM - 11:30 PM",
    location: "La Banquise",
    address: "994 Rue Rachel E, Montreal", 
    priceRange: "$",
    tags: ["friend-rec", "poutine", "24-7", "classic-montreal"],
    isPrideEvent: false,
    isLGBTFriendly: true,
    peopleEnjoy: "The classic Montreal poutine experience that locals swear by, perfect comfort food after an emotional day of Pride celebration, being open 24/7 for whenever you need that perfect ending, and the satisfying way to close an incredible week"
  },
  {
    id: "friend_rec_farewell_montreal_bagels",
    title: "Friend's Rec: Monday Farewell - Authentic Montreal Bagels",
    description: "Before leaving, you MUST have Montreal bagels from Fairmount or St-Viateur (Mile End). Made fresh in wood-fired ovens, open 24/7. Grab some for the road!",
    category: "dining",
    day: "Monday",
    time: "8:00 AM - 10:00 AM",
    location: "Fairmount Bagel or St-Viateur Bagel",
    address: "Mile End neighborhood, Montreal",
    priceRange: "$",
    tags: ["friend-rec", "montreal-bagels", "wood-fired", "farewell"],
    isPrideEvent: false,
    isLGBTFriendly: true,
    peopleEnjoy: "The authentic Montreal bagel experience made in wood-fired ovens, being open 24/7 so you can get them whenever you need, taking some home as the perfect Montreal souvenir, and ending your trip with this essential Montreal tradition"
  }
];

const PrideMontrealDay5 = () => {
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
          Day 5: Pride Parade Day
        </Typography>
        
        <Typography variant="h4" sx={{ 
          fontSize: 'clamp(1.2rem, 3vw, 2rem)', 
          fontWeight: 'medium',
          color: 'text.secondary',
          mb: 1
        }}>
          Sunday, August 10, 2025
        </Typography>
        
        <Typography variant="h5" sx={{ 
          fontSize: 'clamp(1rem, 2.5vw, 1.5rem)', 
          fontWeight: 'medium',
          color: 'primary.main',
          mb: 2
        }}>
          "Blossom Here, Now!"
        </Typography>
        
        <Typography variant="body1" sx={{ 
          fontSize: '1.1rem',
          color: 'text.secondary',
          maxWidth: '800px',
          margin: '0 auto',
          mb: 3
        }}>
          The grand finale! March in the largest francophone Pride parade in the world, dance at the Mega T-Dance, and celebrate the sweet ending at Pride Sundae.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', mb: 3 }}>
          <Chip icon={<EmojiEvents />} label="Pride Parade" color="primary" />
          <Chip icon={<MusicNote />} label="Mega T-Dance" color="secondary" />
          <Chip icon={<CelebrationOutlined />} label="Pride Sundae" />
          <Chip icon={<Festival />} label="íLESONIQ Finale" variant="outlined" />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {day5Data.map((activity) => (
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
          to="/pride-montreal-day4"
          variant="outlined"
          startIcon={<ArrowBack />}
        >
          Previous: Day 4
        </Button>
        <Button
          component={RouterLink}
          to="/pride-montreal-kp"
          variant="contained"
        >
          Back to Overview
        </Button>
      </Box>
    </Box>
  );
};

export default PrideMontrealDay5; 