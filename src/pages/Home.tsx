import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceIcon from '@mui/icons-material/Place';
import StarIcon from '@mui/icons-material/Star';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PaletteIcon from '@mui/icons-material/Palette';

const neighborhoods = [
  {
    name: 'Yorkville',
    description: 'Upscale dining and sophisticated lounges',
    image: 'https://source.unsplash.com/random/?toronto,yorkville',
    features: ['Luxury venues', 'Craft cocktails', 'Fine dining'],
  },
  {
    name: 'The Well',
    description: 'Modern entertainment and dining district',
    image: 'https://source.unsplash.com/random/?toronto,restaurant',
    features: ['New venues', 'Diverse cuisine', 'Rooftop bars'],
  },
  {
    name: 'The Beaches',
    description: 'Relaxed beachside bars and patios',
    image: 'https://source.unsplash.com/random/?toronto,beach',
    features: ['Waterfront views', 'Casual atmosphere', 'Local favorites'],
  },
];

const activities = [
  {
    name: 'Outdoor Adventures',
    description: 'Explore parks, trails, and waterfront activities',
    image: 'https://source.unsplash.com/random/?toronto,park',
    features: ['High Park', 'Toronto Islands', 'Waterfront Trail'],
    icon: <DirectionsBikeIcon fontSize="large" />,
  },
  {
    name: 'Arts & Culture',
    description: 'World-class museums and galleries',
    image: 'https://source.unsplash.com/random/?toronto,museum',
    features: ['ROM', 'AGO', 'Live Performances'],
    icon: <PaletteIcon fontSize="large" />,
  },
  {
    name: 'Food & Dining',
    description: 'Diverse culinary experiences',
    image: 'https://source.unsplash.com/random/?toronto,food',
    features: ['Global Cuisine', 'Food Tours', 'Markets'],
    icon: <RestaurantIcon fontSize="large" />,
  },
];

const features = [
  {
    title: 'Daily Updates',
    description: 'Our listings are updated daily to ensure accuracy',
    icon: <AccessTimeIcon fontSize="large" />,
  },
  {
    title: 'Local Expertise',
    description: 'Curated recommendations from Toronto locals',
    icon: <PlaceIcon fontSize="large" />,
  },
  {
    title: 'Special Offers',
    description: 'Exclusive deals and promotions at select venues',
    icon: <StarIcon fontSize="large" />,
  },
  {
    title: 'Verified Venues',
    description: 'All listings are verified for quality and service',
    icon: <LocalBarIcon fontSize="large" />,
  },
];

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: '#fff',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: 'url(https://source.unsplash.com/random/?toronto,skyline)',
          height: { xs: '60vh', md: '80vh' },
          display: 'flex',
          alignItems: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              p: { xs: 2, sm: 3, md: 6 },
              pr: { md: 0 },
            }}
          >
            <Typography 
              component="h1" 
              variant={isMobile ? "h3" : "h2"} 
              color="inherit" 
              gutterBottom
              sx={{ 
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              Discover Toronto
            </Typography>
            <Typography 
              variant={isMobile ? "h6" : "h5"} 
              color="inherit" 
              paragraph
              sx={{ 
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                mb: { xs: 3, md: 4 }
              }}
            >
              Your ultimate guide to the city's best happy hours, activities, and experiences
            </Typography>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              sx={{ 
                mt: { xs: 2, md: 4 },
                '& .MuiButton-root': {
                  py: { xs: 1.5, md: 2 },
                  width: { xs: '100%', sm: 'auto' },
                }
              }}
            >
              <Button
                variant="contained"
                color="primary"
                size="large"
                component={RouterLink}
                to="/neighborhoods"
                startIcon={<LocalBarIcon />}
                sx={{ px: 4 }}
              >
                Happy Hours
              </Button>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                component={RouterLink}
                to="/activities"
                startIcon={<LocalActivityIcon />}
                sx={{ px: 4 }}
              >
                Activities
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                size="large"
                component={RouterLink}
                to="/map"
                sx={{ 
                  px: 4,
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  }
                }}
              >
                View Map
              </Button>
            </Stack>
          </Box>
        </Container>
      </Paper>

      {/* Happy Hours Section */}
      <Container maxWidth="lg" sx={{ mb: { xs: 6, md: 8 }, px: { xs: 2, sm: 3 } }}>
        <Box sx={{ mb: { xs: 3, md: 4 } }}>
          <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
            Popular Happy Hour Spots
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Find the best drink specials and food deals across Toronto's vibrant neighborhoods
          </Typography>
        </Box>
        <Grid container spacing={{ xs: 2, md: 4 }}>
          {neighborhoods.map((neighborhood) => (
            <Grid item xs={12} sm={6} md={4} key={neighborhood.name}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: (theme) => theme.shadows[4],
                  },
                  borderRadius: 2,
                }}
              >
                <CardMedia
                  component="img"
                  height={isMobile ? "160" : "200"}
                  image={neighborhood.image}
                  alt={neighborhood.name}
                  sx={{
                    objectFit: 'cover',
                  }}
                />
                <CardContent sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
                  <Typography gutterBottom variant="h6" component="h2">
                    {neighborhood.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    paragraph
                    sx={{ mb: 2 }}
                  >
                    {neighborhood.description}
                  </Typography>
                  <List dense sx={{ mb: 2 }}>
                    {neighborhood.features.map((feature) => (
                      <ListItem key={feature} sx={{ px: 1 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <LocalBarIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={feature}
                          primaryTypographyProps={{
                            variant: 'body2',
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Button
                    component={RouterLink}
                    to={`/neighborhoods?area=${encodeURIComponent(neighborhood.name)}`}
                    color="primary"
                    variant="contained"
                    fullWidth
                    sx={{
                      mt: 'auto',
                      borderRadius: '20px',
                      textTransform: 'none',
                    }}
                  >
                    View Deals
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Activities Section */}
      <Box sx={{ bgcolor: 'grey.100', py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          <Box sx={{ mb: { xs: 3, md: 4 } }}>
            <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
              Explore Toronto Activities
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Discover exciting experiences and attractions throughout the city
            </Typography>
          </Box>
          <Grid container spacing={{ xs: 2, md: 4 }}>
            {activities.map((activity) => (
              <Grid item xs={12} sm={6} md={4} key={activity.name}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: (theme) => theme.shadows[4],
                    },
                    borderRadius: 2,
                  }}
                >
                  <CardMedia
                    component="img"
                    height={isMobile ? "160" : "200"}
                    image={activity.image}
                    alt={activity.name}
                    sx={{
                      objectFit: 'cover',
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ color: 'secondary.main' }}>
                      {activity.icon}
                      </Box>
                      <Typography gutterBottom variant="h6" component="h2" sx={{ ml: 1 }}>
                        {activity.name}
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      paragraph
                      sx={{ mb: 2 }}
                    >
                      {activity.description}
                    </Typography>
                    <List dense sx={{ mb: 2 }}>
                      {activity.features.map((feature) => (
                        <ListItem key={feature} sx={{ px: 1 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <LocalActivityIcon fontSize="small" color="secondary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={feature}
                            primaryTypographyProps={{
                              variant: 'body2',
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                    <Button
                      component={RouterLink}
                      to="/activities"
                      color="secondary"
                      variant="contained"
                      fullWidth
                      sx={{
                        mt: 'auto',
                        borderRadius: '20px',
                        textTransform: 'none',
                      }}
                    >
                      Explore More
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 }, px: { xs: 2, sm: 3 } }}>
        <Typography variant={isMobile ? "h5" : "h4"} gutterBottom sx={{ mb: { xs: 3, md: 4 } }}>
          Why Choose Toronto Guide
        </Typography>
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {features.map((feature) => (
            <Grid item xs={12} sm={6} md={3} key={feature.title}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'row', md: 'column' },
                  alignItems: { xs: 'flex-start', md: 'center' },
                  textAlign: { xs: 'left', md: 'center' },
                }}
              >
                <Box
                  sx={{
                    mb: { xs: 0, md: 2 },
                    mr: { xs: 2, md: 0 },
                    width: { xs: 48, md: 60 },
                    height: { xs: 48, md: 60 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    backgroundColor: 'primary.main',
                    color: 'white',
                    flexShrink: 0,
                  }}
                >
                  {feature.icon}
                </Box>
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ mb: 1 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home; 