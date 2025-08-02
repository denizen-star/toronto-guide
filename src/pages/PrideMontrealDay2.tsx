import React from 'react';
import { Box, Grid, Typography, Button, Chip } from '@mui/material';
import {
  TheaterComedy,
  Museum,
  ArrowBack,
  ArrowForward
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
    id: "drag_show",
    title: "Soirée 100% Drag - World's Largest Free Drag Show",
    description: "Official Fierté Montréal - World's largest free drag show featuring Barbada & Rita Baga plus international drag stars at Olympic Park",
    category: "pride-event",
    day: "Thursday",
    time: "7:30 PM - 10:00 PM",
    location: "TD Stage, Olympic Park Esplanade",
    address: "Olympic Park Esplanade, Montreal, QC H1V 3N7",
    website: "https://fiertemontreal.com/",
    priceRange: "free",
    tags: ["drag", "barbada", "rita-baga", "free", "olympic-park"],
    isPrideEvent: true,
    isLGBTFriendly: true,
    isSpecialEvent: true,
    peopleEnjoy: "Seeing Canada's Drag Race stars live for free, the massive outdoor stage setup, incredible costumes, and the electric energy of 20,000+ people celebrating together"
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
          Experience Montreal's rich history in the morning, then witness the world's largest free drag show featuring Canada's Drag Race superstars!
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', mb: 3 }}>
          <Chip icon={<TheaterComedy />} label="World's Largest Drag Show" color="primary" />
          <Chip icon={<Museum />} label="Old Montreal History" color="secondary" />
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
                📍 {activity.address}
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