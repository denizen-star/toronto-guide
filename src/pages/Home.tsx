import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Typography,
  Box,
  Grid,
  Button,
  useTheme,
  Container,
  alpha,
} from '@mui/material';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PaletteIcon from '@mui/icons-material/Palette';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import BusinessIcon from '@mui/icons-material/Business';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import SportsIcon from '@mui/icons-material/Sports';
import CelebrationIcon from '@mui/icons-material/Celebration';
import ExploreIcon from '@mui/icons-material/Explore';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Section from '../components/Section';
import MinimalistCard from '../components/MinimalistCard';

const neighborhoods = [
  {
    name: 'Yorkville',
    description: 'Upscale dining and sophisticated lounges',
    icon: <BusinessIcon />,
    features: ['Luxury venues', 'Craft cocktails', 'Fine dining'],
  },
  {
    name: 'The Well',
    description: 'Modern entertainment and dining district',
    icon: <LocationCityIcon />,
    features: ['New venues', 'Diverse cuisine', 'Rooftop bars'],
  },
  {
    name: 'The Beaches',
    description: 'Relaxed beachside bars and patios',
    icon: <BeachAccessIcon />,
    features: ['Waterfront views', 'Casual atmosphere', 'Local favorites'],
  },
];

const activities = [
  {
    name: 'Outdoor Adventures',
    description: 'Explore parks, trails, and waterfront activities',
    features: ['High Park', 'Toronto Islands', 'Waterfront Trail'],
    icon: <DirectionsBikeIcon />,
  },
  {
    name: 'Arts & Culture',
    description: 'World-class museums and galleries',
    features: ['ROM', 'AGO', 'Live Performances'],
    icon: <PaletteIcon />,
  },
  {
    name: 'Food & Dining',
    description: 'Diverse culinary experiences',
    features: ['Global Cuisine', 'Food Tours', 'Markets'],
    icon: <RestaurantIcon />,
  },
];

const dayTrips = [
  {
    name: 'Niagara Falls',
    description: 'Natural wonder and scenic getaway',
    features: ['Waterfalls', 'Wine tours', 'Scenic views'],
    icon: <DirectionsCarIcon />,
  },
  {
    name: 'Muskoka Lakes',
    description: 'Cottage country and outdoor adventures',
    features: ['Lake activities', 'Hiking trails', 'Scenic drives'],
    icon: <DirectionsCarIcon />,
  },
  {
    name: 'Blue Mountain',
    description: 'Year-round outdoor recreation',
    features: ['Skiing', 'Village life', 'Adventure activities'],
    icon: <DirectionsCarIcon />,
  },
];

const amateurSports = [
  {
    name: 'Local Leagues',
    description: 'Join recreational sports communities',
    features: ['Hockey leagues', 'Soccer clubs', 'Basketball courts'],
    icon: <SportsSoccerIcon />,
  },
  {
    name: 'Drop-in Sports',
    description: 'Casual games and pickup sessions',
    features: ['Community centers', 'Public courts', 'Flexible timing'],
    icon: <SportsSoccerIcon />,
  },
  {
    name: 'Sports Facilities',
    description: 'Quality venues for all skill levels',
    features: ['Modern equipment', 'Professional courts', 'Group bookings'],
    icon: <SportsSoccerIcon />,
  },
];

const sportingEvents = [
  {
    name: 'Toronto Maple Leafs',
    description: 'Professional hockey at Scotiabank Arena',
    features: ['NHL games', 'Premium seating', 'Season tickets'],
    icon: <SportsIcon />,
  },
  {
    name: 'Toronto Raptors',
    description: 'NBA basketball excitement',
    features: ['Championship team', 'Electric atmosphere', 'Star players'],
    icon: <SportsIcon />,
  },
  {
    name: 'Toronto Blue Jays',
    description: 'Major League Baseball action',
    features: ['Rogers Centre', 'AL East division', 'Summer games'],
    icon: <SportsIcon />,
  },
];

const specialEvents = [
  {
    name: 'Cultural Festivals',
    description: 'Year-round celebrations and events',
    features: ['Music festivals', 'Food events', 'Art exhibitions'],
    icon: <CelebrationIcon />,
  },
  {
    name: 'Seasonal Events',
    description: 'Holiday and seasonal celebrations',
    features: ['Winter festivals', 'Summer concerts', 'Holiday markets'],
    icon: <CelebrationIcon />,
  },
  {
    name: 'Community Events',
    description: 'Local gatherings and activities',
    features: ['Neighborhood events', 'Charity functions', 'Local markets'],
    icon: <CelebrationIcon />,
  },
];

const Home = () => {
  const theme = useTheme();

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ 
        bgcolor: 'background.default',
        py: { xs: 10, md: 14 },
        position: 'relative',
        overflow: 'hidden',
      }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          <Box sx={{ 
            textAlign: 'center',
            maxWidth: '900px',
            mx: 'auto',
            position: 'relative',
            zIndex: 2,
          }}>
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 5,
            }}>
              <ExploreIcon sx={{ 
                fontSize: { xs: '3.5rem', md: '5rem' },
                color: 'primary.main',
                mr: 3,
                filter: 'drop-shadow(0 0 20px rgba(96, 165, 250, 0.3))',
              }} />
              <TrendingUpIcon sx={{ 
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                color: 'secondary.main',
                transform: 'rotate(45deg)',
                filter: 'drop-shadow(0 0 15px rgba(244, 114, 182, 0.3))',
              }} />
            </Box>
            
            <Typography 
              variant="h1" 
              sx={{ 
                mb: 4,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '3rem', md: '4.5rem' },
                fontWeight: 800,
                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
              }}
            >
              Discover Toronto
            </Typography>
            
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 6,
                color: 'text.secondary',
                fontWeight: 300,
                lineHeight: 1.6,
                maxWidth: '700px',
                mx: 'auto',
                fontSize: { xs: '1.25rem', md: '1.5rem' },
              }}
            >
              Your curated guide to the best experiences, hidden gems, and vibrant culture in Canada's largest city
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              gap: 3, 
              justifyContent: 'center',
              flexWrap: 'wrap',
              mt: 4,
            }}>
              <Button
                variant="contained"
                size="large"
                component={RouterLink}
                to="/activities"
                sx={{ 
                  px: 6, 
                  py: 2,
                  fontSize: '1.1rem',
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  boxShadow: '0 4px 20px rgba(96, 165, 250, 0.4)',
                  '&:hover': {
                    boxShadow: '0 8px 30px rgba(96, 165, 250, 0.6)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Explore Activities
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={RouterLink}
                to="/neighborhoods"
                sx={{ 
                  px: 6, 
                  py: 2,
                  fontSize: '1.1rem',
                  borderRadius: 3,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 30px rgba(96, 165, 250, 0.2)',
                  },
                }}
              >
                Find Happy Hours
              </Button>
            </Box>
          </Box>
        </Container>
        
        {/* Enhanced background decoration for dark theme */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.06,
          backgroundImage: `
            radial-gradient(circle at 20% 50%, ${theme.palette.primary.main} 0%, transparent 50%), 
            radial-gradient(circle at 80% 20%, ${theme.palette.secondary.main} 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, ${theme.palette.info.main} 0%, transparent 50%)
          `,
        }} />
        
        {/* Subtle grid pattern */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.02,
          backgroundImage: `
            linear-gradient(${alpha('#60A5FA', 0.1)} 1px, transparent 1px),
            linear-gradient(90deg, ${alpha('#60A5FA', 0.1)} 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }} />
      </Box>

      {/* Happy Hours Section */}
      <Section
        title="Happy Hours & Nightlife"
        subtitle="Discover Toronto's best bars, lounges, and nightlife spots across different neighborhoods"
        buttonText="Explore Happy Hours"
        buttonPath="/neighborhoods"
        buttonColor="primary"
        backgroundColor="background.paper"
      >
        <Grid container spacing={4}>
          {neighborhoods.map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <MinimalistCard
                title={item.name}
                description={item.description}
                features={item.features}
                icon={item.icon}
                to="/neighborhoods"
                color="primary"
              />
            </Grid>
          ))}
        </Grid>
      </Section>

      {/* Activities Section */}
      <Section
        title="Activities & Attractions"
        subtitle="From outdoor adventures to cultural experiences, discover what makes Toronto special"
        buttonText="Browse Activities"
        buttonPath="/activities"
        buttonColor="secondary"
        backgroundColor="background.default"
      >
        <Grid container spacing={4}>
          {activities.map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <MinimalistCard
                title={item.name}
                description={item.description}
                features={item.features}
                icon={item.icon}
                to="/activities"
                color="primary"
              />
            </Grid>
          ))}
        </Grid>
      </Section>

      {/* Day Trips Section */}
      <Section
        title="Day Trips & Getaways"
        subtitle="Escape the city and explore beautiful destinations within reach of Toronto"
        buttonText="Plan Day Trips"
        buttonPath="/day-trips"
        buttonColor="success"
        backgroundColor="background.paper"
      >
        <Grid container spacing={4}>
          {dayTrips.map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <MinimalistCard
                title={item.name}
                description={item.description}
                features={item.features}
                icon={item.icon}
                to="/day-trips"
                color="primary"
              />
            </Grid>
          ))}
        </Grid>
      </Section>

      {/* Amateur Sports Section */}
      <Section
        title="Amateur Sports & Recreation"
        subtitle="Join local leagues, find pickup games, and stay active in Toronto's sports community"
        buttonText="Find Sports"
        buttonPath="/amateur-sports"
        buttonColor="warning"
        backgroundColor="background.default"
      >
        <Grid container spacing={4}>
          {amateurSports.map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <MinimalistCard
                title={item.name}
                description={item.description}
                features={item.features}
                icon={item.icon}
                to="/amateur-sports"
                color="primary"
              />
            </Grid>
          ))}
        </Grid>
      </Section>

      {/* Sporting Events Section */}
      <Section
        title="Professional Sports"
        subtitle="Catch Toronto's professional teams in action and experience the city's passionate sports culture"
        buttonText="View Events"
        buttonPath="/sporting-events"
        buttonColor="info"
        backgroundColor="background.paper"
      >
        <Grid container spacing={4}>
          {sportingEvents.map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <MinimalistCard
                title={item.name}
                description={item.description}
                features={item.features}
                icon={item.icon}
                to="/sporting-events"
                color="primary"
              />
            </Grid>
          ))}
        </Grid>
      </Section>

      {/* Special Events Section */}
      <Section
        title="Special Events & Festivals"
        subtitle="Experience Toronto's vibrant festival scene and special celebrations throughout the year"
        buttonText="Discover Events"
        buttonPath="/special-events"
        buttonColor="secondary"
        backgroundColor="background.default"
        spacing="spacious"
      >
        <Grid container spacing={4}>
          {specialEvents.map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <MinimalistCard
                title={item.name}
                description={item.description}
                features={item.features}
                icon={item.icon}
                to="/special-events"
                color="primary"
              />
            </Grid>
          ))}
        </Grid>
      </Section>
    </Box>
  );
};

export default Home; 