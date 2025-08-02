import React from 'react';
import { Box, Grid, Typography, Button, Chip } from '@mui/material';
import {
  TheaterComedy,
  Museum,
  ArrowBack,
  ArrowForward,
  Restaurant
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

// Day 2 Data - Thursday, August 7, 2025 - Enhanced with specific details
const day2Data: PrideActivity[] = [
  {
    id: "breakfast_olive",
    title: "Olive + Gourmando - Old Montreal Icon Since 1998",
    description: "Start your day at this legendary boulangerie-café-restaurant in the heart of Old Montreal, famous for transforming the ordinary into extraordinary",
    category: "dining",
    day: "Thursday",
    time: "7:30 AM - 9:00 AM",
    location: "Olive + Gourmando",
    address: "351 Rue Saint-Paul O, Montreal, QC H2Y 2A7",
    website: "https://oliveetgourmando.com/",
    priceRange: "$$",
    tags: ["breakfast", "artisanal", "old-montreal", "bakery"],
    isPrideEvent: false,
    isLGBTFriendly: true,
    peopleEnjoy: "The daily lineup that speaks to their reputation, artisanal breads and pastries baked fresh since 1998, unique sandwich combinations that transform ordinary ingredients into extraordinary creations, and the authentic Old Montreal atmosphere in their historic Saint-Paul location"
  },
  {
    id: "old1",
    title: "Notre-Dame Basilica & Old Montreal Walking Tour",
    description: "Explore Montreal's UNESCO World Heritage cobblestone streets and the stunning Neo-Gothic basilica",
    category: "culture",
    day: "Thursday",
    time: "9:00 AM - 11:30 AM",
    location: "Notre-Dame Basilica of Montreal",
    address: "110 Notre-Dame St W, Montreal, QC H2Y 1T2",
    website: "https://www.basiliquenotredame.ca/",
    priceRange: "$",
    tags: ["history", "architecture", "walking", "basilica"],
    isPrideEvent: false,
    isLGBTFriendly: true,
    peopleEnjoy: "The breathtaking blue ceiling with gold stars, world-class pipe organ concerts, and walking the same cobblestones as 400 years of history"
  },
  {
    id: "drag_show_enhanced",
    title: "Soirée 100% Drag - World's Largest Free Drag Show (Enhanced Lineup)",
    description: "Official Fierté Montréal with incredible lineup: Bimini (5:30 PM), Detox, Kennedy Davenport, Rita Baga, Makayla Couture (7:30 PM), and Nicky Doll (10 PM)",
    category: "pride-event",
    day: "Thursday",
    time: "5:30 PM - 11:00 PM",
    location: "TD Stage, Olympic Park Esplanade", 
    address: "Olympic Park Esplanade, Montreal, QC H1V 3N7",
    website: "https://fiertemontreal.com/",
    priceRange: "free",
    tags: ["drag", "bimini", "detox", "kennedy-davenport", "rita-baga", "nicky-doll"],
    isPrideEvent: true,
    isLGBTFriendly: true,
    isSpecialEvent: true,
    peopleEnjoy: "Seeing Bimini from UK's Drag Race live, witnessing Detox's legendary performances, cheering for Canada's Drag Race stars Rita Baga and others, and being part of the world's largest free drag show with international superstars"
  },
  {
    id: "eve1",
    title: "LOUCHE XXL - Official Pride Afterparty at Club Soda",
    description: "Legendary Club Soda hosts the afterparty with Nicky Doll (RuPaul's Drag Race) and Montreal's top drag performers",
    category: "pride-event",
    day: "Thursday",
    time: "10:00 PM - Late",
    location: "Club Soda",
    address: "1225 Boul. Saint-Laurent, Montreal, QC H2X 2Y8",
    website: "https://clubsoda.ca/",
    priceRange: "$$",
    tags: ["pride", "clubsoda", "louche", "nicky-doll", "afterparty"],
    isPrideEvent: true,
    isLGBTFriendly: true,
    isSpecialEvent: true,
    peopleEnjoy: "Meeting RuPaul's Drag Race alumni, Club Soda's legendary sound system, the intimate venue atmosphere after the huge outdoor show, and dancing until sunrise"
  },
  {
    id: "local_gem_day2_1",
    title: "Local Gem: Bar Suzanne - Plateau's Hidden Dumpling Den",
    description: "Tucked away on Duluth Street between neighborhoods, this quaint spot serves handmade dumplings with 12 beer lines and crafted cocktails",
    category: "dining",
    day: "Thursday",
    time: "4:00 PM - 7:00 PM",
    location: "Bar Suzanne",
    address: "20 Duluth St. East, Montreal, QC",
    website: "http://www.barsuzanne.ca/",
    priceRange: "$$",
    tags: ["local-gem", "dumplings", "plateau", "hidden"],
    isPrideEvent: false,
    isLGBTFriendly: true,
    peopleEnjoy: "Finding this hidden gem 'somewhere in the gap between McGill Ghetto, Mile End, Plateau, and the Main' on a quaint street with ex-skewers and second-hand shops, handmade dumplings paired with assorted cocktails and 12 beer lines, the intimate atmosphere perfect for staying out late 'but gently'"
  },
  {
    id: "local_gem_day2_2",
    title: "Local Gem: 31 Latitude - Chinese Tapas Revolution",
    description: "Innovative 'Chinese tapas' concept with small portions of fine cuisine, large wine selection by glass, and Asian beer pairings",
    category: "dining", 
    day: "Thursday",
    time: "12:00 PM - 2:00 PM",
    location: "31 Latitude",
    address: "3634 Rue Saint-Dominique, Montreal, QC H2X 2X7",
    website: "https://www.31latitude.com/",
    priceRange: "$$",
    tags: ["local-gem", "chinese-tapas", "wine-pairing", "innovative"],
    isPrideEvent: false,
    isLGBTFriendly: true,
    peopleEnjoy: "The revolutionary 'Chinese tapas' concept featured in Montreal Gazette, tasting delicious fine cuisine in small portions perfect for sharing, pairing with the large selection of wines by glass and Asian beers, tapas starting from just $4 and wines from $8"
  },
  {
    id: "friend_rec_jean_talon",
    title: "Friend's Rec: Jean-Talon Market - North America's Food Mecca",
    description: "One of the biggest public markets in North America - grab fresh fruit, local cheese, pastries, and soak in real Montreal life",
    category: "culture",
    day: "Thursday",
    time: "9:00 AM - 11:00 AM", 
    location: "Jean-Talon Market",
    address: "7070 Henri-Julien Ave, Montreal (Metro Jean-Talon)",
    priceRange: "$",
    tags: ["friend-rec", "market", "local-life", "fresh-food"],
    isPrideEvent: false,
    isLGBTFriendly: true,
    peopleEnjoy: "Being at one of North America's biggest public markets, fresh Quebec produce at its peak, people-watching and getting a real feel for Montreal life, sampling local cheeses and pastries that locals buy daily"
  },
  {
    id: "friend_rec_cabaret_mado", 
    title: "Friend's Rec: Cabaret Mado - Montreal Legend (Must Visit!)",
    description: "Montreal institution where Mado is a legend - get there early to grab a spot. Expect fierce performances and an amazing party after the big Olympic show",
    category: "entertainment",
    day: "Thursday",
    time: "11:30 PM - Late",
    location: "Cabaret Mado",
    address: "1115 Rue Sainte-Catherine E, Montreal", 
    website: "https://cabaretmado.ca/",
    priceRange: "$$",
    tags: ["friend-rec", "cabaret-mado", "legend", "after-drag-show"],
    isPrideEvent: false,
    isLGBTFriendly: true,
    isSpecialEvent: true,
    peopleEnjoy: "Experiencing Mado - Montreal's most beloved drag queen and comedian, the hilarious French and English comedy that locals quote for weeks, being at a true Montreal institution, and the legendary after-show atmosphere where everyone goes after the Olympic events"
  }
];

const PrideMontrealDay2 = () => {
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
          Day 2: Soirée 100% Drag
        </Typography>
        
        <Typography variant="h4" sx={{ 
          fontSize: 'clamp(1.2rem, 3vw, 2rem)', 
          fontWeight: 'medium',
          color: 'text.secondary',
          mb: 1
        }}>
          Thursday, August 7, 2025
        </Typography>
        
        <Typography variant="body1" sx={{ 
          fontSize: '1.1rem',
          color: 'text.secondary',
          maxWidth: '800px',
          margin: '0 auto',
          mb: 3
        }}>
          Start with breakfast at legendary Olive + Gourmando, explore Montreal's rich history in Old Montreal, then witness the world's largest free drag show featuring Canada's Drag Race superstars!
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', mb: 3 }}>
          <Chip icon={<TheaterComedy />} label="World's Largest Drag Show" color="primary" />
          <Chip icon={<Museum />} label="Old Montreal History" color="secondary" />
          <Chip icon={<Restaurant />} label="Olive + Gourmando Breakfast" variant="outlined" />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {day2Data.map((activity) => (
          <Grid item xs={12} md={6} lg={4} key={activity.id}>
            <Box sx={{ 
              p: 3, 
              border: activity.isPrideEvent ? '2px solid #FF6B6B' : '1px solid #eee',
              borderRadius: 2,
              height: '100%'
            }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                {activity.title}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                {activity.description}
              </Typography>
              
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
                    color: '#FF6B6B',
                    mb: 1
                  }}>
                    ✨ What People Love:
                  </Typography>
                  <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                    {activity.peopleEnjoy}
                  </Typography>
                </Box>
              )}
              
              <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
                �� {activity.address}
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mb: 2 }}>
                🕐 {activity.time} • 💰 {activity.priceRange}
              </Typography>
              
              {activity.website && (
                <Button 
                  href={activity.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  size="small"
                  fullWidth
                >
                  More Info
                </Button>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 6, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Button
          component={RouterLink}
          to="/pride-montreal-day1"
          variant="outlined"
          startIcon={<ArrowBack />}
        >
          Previous: Day 1
        </Button>
        <Button
          component={RouterLink}
          to="/pride-montreal-day3"
          variant="contained"
          endIcon={<ArrowForward />}
        >
          Next: Day 3 - DistinXion
        </Button>
      </Box>
    </Box>
  );
};

export default PrideMontrealDay2; 