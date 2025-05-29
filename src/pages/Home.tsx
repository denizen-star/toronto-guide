import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  useTheme,
  useMediaQuery,
  Alert,
} from '@mui/material';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
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
import InfoIcon from '@mui/icons-material/Info';

const neighborhoods = [
  {
    name: 'Yorkville',
    description: 'Upscale dining and sophisticated lounges',
    icon: <BusinessIcon fontSize="large" />,
    features: ['Luxury venues', 'Craft cocktails', 'Fine dining'],
  },
  {
    name: 'The Well',
    description: 'Modern entertainment and dining district',
    icon: <LocationCityIcon fontSize="large" />,
    features: ['New venues', 'Diverse cuisine', 'Rooftop bars'],
  },
  {
    name: 'The Beaches',
    description: 'Relaxed beachside bars and patios',
    icon: <BeachAccessIcon fontSize="large" />,
    features: ['Waterfront views', 'Casual atmosphere', 'Local favorites'],
  },
];

const activities = [
  {
    name: 'Outdoor Adventures',
    description: 'Explore parks, trails, and waterfront activities',
    features: ['High Park', 'Toronto Islands', 'Waterfront Trail'],
    icon: <DirectionsBikeIcon fontSize="large" />,
  },
  {
    name: 'Arts & Culture',
    description: 'World-class museums and galleries',
    features: ['ROM', 'AGO', 'Live Performances'],
    icon: <PaletteIcon fontSize="large" />,
  },
  {
    name: 'Food & Dining',
    description: 'Diverse culinary experiences',
    features: ['Global Cuisine', 'Food Tours', 'Markets'],
    icon: <RestaurantIcon fontSize="large" />,
  },
];

const dayTrips = [
  {
    name: 'Niagara Falls',
    description: 'Natural wonder and scenic getaway',
    features: ['Waterfalls', 'Wine tours', 'Scenic views'],
    icon: <DirectionsCarIcon fontSize="large" />,
  },
  {
    name: 'Muskoka Lakes',
    description: 'Cottage country and outdoor adventures',
    features: ['Lake activities', 'Hiking trails', 'Scenic drives'],
    icon: <DirectionsCarIcon fontSize="large" />,
  },
  {
    name: 'Blue Mountain',
    description: 'Year-round outdoor recreation',
    features: ['Skiing', 'Village life', 'Adventure activities'],
    icon: <DirectionsCarIcon fontSize="large" />,
  },
];

const amateurSports = [
  {
    name: 'Local Leagues',
    description: 'Join recreational sports communities',
    features: ['Hockey leagues', 'Soccer clubs', 'Basketball courts'],
    icon: <SportsSoccerIcon fontSize="large" />,
  },
  {
    name: 'Drop-in Sports',
    description: 'Casual games and pickup sessions',
    features: ['Community centers', 'Public courts', 'Flexible timing'],
    icon: <SportsSoccerIcon fontSize="large" />,
  },
  {
    name: 'Sports Facilities',
    description: 'Quality venues for all skill levels',
    features: ['Modern equipment', 'Professional courts', 'Group bookings'],
    icon: <SportsSoccerIcon fontSize="large" />,
  },
];

const sportingEvents = [
  {
    name: 'Toronto Maple Leafs',
    description: 'Professional hockey at Scotiabank Arena',
    features: ['NHL games', 'Premium seating', 'Season tickets'],
    icon: <SportsIcon fontSize="large" />,
  },
  {
    name: 'Toronto Raptors',
    description: 'NBA basketball excitement',
    features: ['Championship team', 'Electric atmosphere', 'Star players'],
    icon: <SportsIcon fontSize="large" />,
  },
  {
    name: 'Toronto Blue Jays',
    description: 'Major League Baseball action',
    features: ['Rogers Centre', 'AL East division', 'Summer games'],
    icon: <SportsIcon fontSize="large" />,
  },
];

const specialEvents = [
  {
    name: 'Cultural Festivals',
    description: 'Year-round celebrations and events',
    features: ['Music festivals', 'Food events', 'Art exhibitions'],
    icon: <CelebrationIcon fontSize="large" />,
  },
  {
    name: 'Seasonal Events',
    description: 'Holiday and seasonal celebrations',
    features: ['Winter festivals', 'Summer concerts', 'Holiday markets'],
    icon: <CelebrationIcon fontSize="large" />,
  },
  {
    name: 'Community Events',
    description: 'Local gatherings and activities',
    features: ['Neighborhood events', 'Charity functions', 'Local markets'],
    icon: <CelebrationIcon fontSize="large" />,
  },
];

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const renderSection = (
    title: string,
    subtitle: string,
    items: any[],
    backgroundColor: string,
    buttonText: string,
    buttonPath: string,
    buttonColor: "primary" | "secondary" | "success" | "warning"
  ) => (
    <Box sx={{ bgcolor: backgroundColor, py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <Box sx={{ mb: { xs: 3, md: 4 }, textAlign: 'center' }}>
          <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
            {title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
            {subtitle}
          </Typography>
          <Button
            variant="contained"
            color={buttonColor}
            size="large"
            component={RouterLink}
            to={buttonPath}
            sx={{ mb: 2, px: 4, py: 1.5 }}
          >
            {buttonText}
          </Button>
        </Box>
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {items.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                component={RouterLink}
                to={getCardLink(buttonPath, item)}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  textDecoration: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: (theme) => theme.shadows[4],
                  },
                  borderRadius: 2,
                }}
              >
                <Box
                  sx={{
                    height: isMobile ? 80 : 100, // Half the original height
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: buttonColor === 'primary' ? 'primary.main' : 
                                   buttonColor === 'secondary' ? 'secondary.main' :
                                   buttonColor === 'success' ? 'success.main' : 'warning.main',
                    color: 'white',
                  }}
                >
                  {item.icon}
                </Box>
                <CardContent sx={{ flexGrow: 1, p: { xs: 1.5, md: 2 } }}>
                  <Typography gutterBottom variant="h6" component="h3" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
                    {item.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    paragraph
                    sx={{ mb: 1.5, fontSize: { xs: '0.875rem', md: '0.875rem' } }}
                  >
                    {item.description}
                  </Typography>
                  <List dense sx={{ mb: 1 }}>
                    {item.features.map((feature: string, featureIndex: number) => (
                      <ListItem key={featureIndex} sx={{ px: 0.5, py: 0.25 }}>
                        <ListItemIcon sx={{ minWidth: 28 }}>
                          <LocalActivityIcon fontSize="small" color={buttonColor} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={feature}
                          primaryTypographyProps={{
                            variant: 'body2',
                            fontSize: '0.8rem',
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );

  // Helper function to generate card links with filters
  const getCardLink = (basePath: string, item: any) => {
    switch (basePath) {
      case '/neighborhoods':
        return `/neighborhoods?area=${encodeURIComponent(item.name)}`;
      
      case '/activities':
        // Map activity types to relevant search terms or categories
        if (item.name === 'Outdoor Adventures') {
          return '/activities?search=outdoor';
        }
        if (item.name === 'Arts & Culture') {
          return '/activities?search=museum';
        }
        if (item.name === 'Food & Dining') {
          return '/activities?search=food';
        }
        return basePath;
      
      case '/day-trips':
        // Map to popular tags for filtering
        if (item.name === 'Niagara Falls') {
          return '/day-trips?search=niagara';
        }
        if (item.name === 'Muskoka Lakes') {
          return '/day-trips?search=muskoka';
        }
        if (item.name === 'Blue Mountain') {
          return '/day-trips?search=blue%20mountain';
        }
        return basePath;
      
      case '/amateur-sports':
        // Map to sport types for search filtering
        if (item.name === 'Local Leagues') {
          return '/amateur-sports?search=league';
        }
        if (item.name === 'Drop-in Sports') {
          return '/amateur-sports?search=drop-in';
        }
        if (item.name === 'Sports Facilities') {
          return '/amateur-sports?search=facility';
        }
        return basePath;
      
      case '/sporting-events':
        // Map to team/sport types
        if (item.name === 'Toronto Maple Leafs') {
          return '/sporting-events?search=leafs';
        }
        if (item.name === 'Toronto Raptors') {
          return '/sporting-events?search=raptors';
        }
        if (item.name === 'Toronto Blue Jays') {
          return '/sporting-events?search=jays';
        }
        return basePath;
      
      case '/special-events':
        // Map to event categories
        if (item.name === 'Cultural Festivals') {
          return '/special-events?search=festival';
        }
        if (item.name === 'Seasonal Events') {
          return '/special-events?search=seasonal';
        }
        if (item.name === 'Community Events') {
          return '/special-events?search=community';
        }
        return basePath;
      
      default:
        return basePath;
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'primary.main',
          color: '#fff',
          mb: 4,
          height: { xs: '60vh', sm: '70vh', md: '80vh' }, // Increased height to accommodate more buttons
          display: 'flex',
          alignItems: 'center',
          borderRadius: 2,
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              p: { xs: 2, sm: 3, md: 6 },
              pr: { md: 0 },
              textAlign: { xs: 'center', md: 'left' }, // Center on mobile
            }}
          >
            <Typography 
              component="h1" 
              variant={isMobile ? "h4" : "h2"} 
              color="inherit" 
              gutterBottom
              sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3.75rem' }
              }}
            >
              Discover Toronto
            </Typography>
            <Typography 
              variant={isMobile ? "body1" : "h5"} 
              color="inherit" 
              paragraph
              sx={{ 
                mb: { xs: 3, md: 4 },
                fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }
              }}
            >
              Your ultimate guide to the city's best experiences, activities, and events
            </Typography>
            
            {/* Main Action Buttons */}
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              sx={{ 
                mb: { xs: 3, md: 4 },
                alignItems: 'center',
                justifyContent: { xs: 'center', md: 'flex-start' },
                '& .MuiButton-root': {
                  py: { xs: 1.5, md: 2 },
                  width: { xs: '100%', sm: 'auto' },
                  maxWidth: { xs: '300px', sm: 'none' }
                }
              }}
            >
              <Button
                variant="contained"
                color="secondary"
                size="large"
                component={RouterLink}
                to="/neighborhoods"
                startIcon={<LocalBarIcon />}
                sx={{ px: 4 }}
              >
                Happy Hours
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                size="large"
                component={RouterLink}
                to="/activities"
                startIcon={<LocalActivityIcon />}
                sx={{ px: 4, borderColor: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
              >
                Activities
              </Button>
            </Stack>

            {/* Additional Navigation Buttons */}
            <Typography 
              variant="subtitle1" 
              color="inherit" 
              sx={{ 
                mb: 2,
                opacity: 0.9,
                fontSize: { xs: '0.9rem', md: '1.1rem' }
              }}
            >
              Explore more of Toronto:
            </Typography>
            <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ maxWidth: { xs: '100%', md: '800px' } }}>
              <Grid item xs={6} sm={3}>
                <Button
                  variant="outlined"
                  color="inherit"
                  size={isMobile ? "medium" : "large"}
                  component={RouterLink}
                  to="/day-trips"
                  startIcon={<DirectionsCarIcon />}
                  fullWidth
                  sx={{ 
                    borderColor: 'rgba(255,255,255,0.7)', 
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    py: { xs: 1, sm: 1.5 },
                    '&:hover': { 
                      borderColor: 'white', 
                      bgcolor: 'rgba(255,255,255,0.1)',
                      color: 'white'
                    } 
                  }}
                >
                  Day Trips
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button
                  variant="outlined"
                  color="inherit"
                  size={isMobile ? "medium" : "large"}
                  component={RouterLink}
                  to="/amateur-sports"
                  startIcon={<SportsSoccerIcon />}
                  fullWidth
                  sx={{ 
                    borderColor: 'rgba(255,255,255,0.7)', 
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    py: { xs: 1, sm: 1.5 },
                    '&:hover': { 
                      borderColor: 'white', 
                      bgcolor: 'rgba(255,255,255,0.1)',
                      color: 'white'
                    } 
                  }}
                >
                  Sports
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button
                  variant="outlined"
                  color="inherit"
                  size={isMobile ? "medium" : "large"}
                  component={RouterLink}
                  to="/sporting-events"
                  startIcon={<SportsIcon />}
                  fullWidth
                  sx={{ 
                    borderColor: 'rgba(255,255,255,0.7)', 
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    py: { xs: 1, sm: 1.5 },
                    '&:hover': { 
                      borderColor: 'white', 
                      bgcolor: 'rgba(255,255,255,0.1)',
                      color: 'white'
                    } 
                  }}
                >
                  Pro Events
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button
                  variant="outlined"
                  color="inherit"
                  size={isMobile ? "medium" : "large"}
                  component={RouterLink}
                  to="/special-events"
                  startIcon={<CelebrationIcon />}
                  fullWidth
                  sx={{ 
                    borderColor: 'rgba(255,255,255,0.7)', 
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    py: { xs: 1, sm: 1.5 },
                    '&:hover': { 
                      borderColor: 'white', 
                      bgcolor: 'rgba(255,255,255,0.1)',
                      color: 'white'
                    } 
                  }}
                >
                  Festivals
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Paper>

      {/* Happy Hours Section */}
      {renderSection(
        "Happy Hour Spots",
        "Find the best drink specials and food deals across Toronto's vibrant neighborhoods",
        neighborhoods,
        'background.default',
        "View All Happy Hours",
        "/neighborhoods",
        "primary"
      )}

      {/* Activities Section */}
      {renderSection(
        "Toronto Activities",
        "Discover exciting experiences and attractions throughout the city",
        activities,
        'grey.50',
        "Explore All Activities",
        "/activities",
        "secondary"
      )}

      {/* Day Trips Section */}
      {renderSection(
        "Day Trips from Toronto",
        "Escape the city and explore beautiful destinations within driving distance",
        dayTrips,
        'background.default',
        "Plan Your Day Trip",
        "/day-trips",
        "success"
      )}

      {/* Amateur Sports Section */}
      {renderSection(
        "Amateur Sports & Recreation",
        "Join local sports communities and stay active in Toronto",
        amateurSports,
        'grey.50',
        "Find Sports Activities",
        "/amateur-sports",
        "warning"
      )}

      {/* Professional Sporting Events Section */}
      {renderSection(
        "Professional Sporting Events",
        "Get tickets to Toronto's biggest professional sports teams and events",
        sportingEvents,
        'background.default',
        "Browse Sporting Events",
        "/sporting-events",
        "primary"
      )}

      {/* Special Events Section */}
      {renderSection(
        "Special Events & Festivals",
        "Stay updated with the latest cultural events, festivals, and celebrations",
        specialEvents,
        'grey.50',
        "Discover Special Events",
        "/special-events",
        "secondary"
      )}

      {/* Disclaimer Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 }, px: { xs: 2, sm: 3 } }}>
        <Alert 
          severity="info" 
          icon={<InfoIcon />}
          sx={{ 
            p: { xs: 2, md: 3 },
            borderRadius: 2,
            '& .MuiAlert-message': {
              fontSize: { xs: '0.875rem', md: '1rem' }
            }
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ color: 'info.main', fontWeight: 600 }}>
            Important Disclaimer
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            This Toronto Guide has been created as a leisure project and is shared with the community as-is. 
            While we strive to provide accurate and up-to-date information, we cannot guarantee the completeness, 
            accuracy, or reliability of the content.
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            All venue information, pricing, hours, and availability are subject to change without notice. 
            We recommend verifying details directly with venues before visiting. This guide is provided for 
            informational purposes only, and users participate in activities at their own discretion and risk.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            By using this guide, you acknowledge that the creators are not responsible for any issues, 
            inconveniences, or dissatisfaction that may arise from the use of this information.
          </Typography>
        </Alert>
      </Container>
    </Box>
  );
};

export default Home; 