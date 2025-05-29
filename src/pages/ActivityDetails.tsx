import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Chip,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DirectionsIcon from '@mui/icons-material/Directions';
import ShareIcon from '@mui/icons-material/Share';
import PublicIcon from '@mui/icons-material/Public';
import CategoryIcon from '@mui/icons-material/Category';
import SportsIcon from '@mui/icons-material/Sports';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import PaletteIcon from '@mui/icons-material/Palette';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import NaturePeopleIcon from '@mui/icons-material/NaturePeople';
import BusinessIcon from '@mui/icons-material/Business';
import { 
  loadActivities, 
  loadLocations,
  loadCategories,
  loadPrices,
  loadSchedules,
  type Activity,
  type Location,
  type Category,
  type Price,
  type Schedule,
} from '../utils/dataLoader';

const getActivityIcon = (category: string, title: string, tags: string[]) => {
  const categoryLower = category.toLowerCase();
  const titleLower = title.toLowerCase();
  const allTags = tags.join(' ').toLowerCase();
  
  if (categoryLower.includes('sport') || titleLower.includes('sport') || allTags.includes('sport')) {
    return <SportsIcon sx={{ fontSize: 80 }} />;
  }
  if (categoryLower.includes('music') || titleLower.includes('music') || allTags.includes('music')) {
    return <MusicNoteIcon sx={{ fontSize: 80 }} />;
  }
  if (categoryLower.includes('theater') || categoryLower.includes('comedy') || titleLower.includes('comedy')) {
    return <TheaterComedyIcon sx={{ fontSize: 80 }} />;
  }
  if (categoryLower.includes('art') || titleLower.includes('art') || allTags.includes('art')) {
    return <PaletteIcon sx={{ fontSize: 80 }} />;
  }
  if (categoryLower.includes('food') || titleLower.includes('food') || allTags.includes('food')) {
    return <RestaurantIcon sx={{ fontSize: 80 }} />;
  }
  if (categoryLower.includes('fitness') || titleLower.includes('fitness') || allTags.includes('fitness')) {
    return <FitnessCenterIcon sx={{ fontSize: 80 }} />;
  }
  if (categoryLower.includes('education') || titleLower.includes('education') || allTags.includes('education')) {
    return <LocalLibraryIcon sx={{ fontSize: 80 }} />;
  }
  if (categoryLower.includes('outdoor') || titleLower.includes('outdoor') || allTags.includes('outdoor')) {
    return <NaturePeopleIcon sx={{ fontSize: 80 }} />;
  }
  return <BusinessIcon sx={{ fontSize: 80 }} />;
};

const ActivityDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [price, setPrice] = useState<Price | null>(null);
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadActivityData = async () => {
      try {
        setLoading(true);
        const [
          activitiesData,
          locationsData,
          categoriesData,
          pricesData,
          schedulesData,
        ] = await Promise.all([
          loadActivities(),
          loadLocations(),
          loadCategories(),
          loadPrices(),
          loadSchedules(),
        ]);
        
        const currentActivity = activitiesData.find(a => a.id === id);
        if (!currentActivity) {
          throw new Error('Activity not found');
        }
        setActivity(currentActivity);

        // Load related data
        const activityLocation = locationsData.find(l => l.id === currentActivity.locationId);
        const activityCategory = categoriesData.find(c => c.id === currentActivity.categoryId);
        const activityPrice = pricesData.find(p => p.id === currentActivity.priceId);
        const activitySchedule = schedulesData.find(s => s.id === currentActivity.scheduleId);

        setLocation(activityLocation || null);
        setCategory(activityCategory || null);
        setPrice(activityPrice || null);
        setSchedule(activitySchedule || null);
        
        setLoading(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load activity details');
        setLoading(false);
      }
    };

    loadActivityData();
  }, [id]);

  const handleShare = () => {
    if (!activity) return;
    if (navigator.share) {
      navigator.share({
        title: `${activity.title} - Activity Details`,
        text: `Check out ${activity.title} in Toronto!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch(console.error);
    }
  };

  const handleDirections = () => {
    if (!location) return;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${activity?.title} ${location.address}`
    )}`;
    window.open(mapsUrl, '_blank');
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading activity details...</Typography>
      </Container>
    );
  }

  if (error || !activity) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error || 'Activity not found'}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/activities')}>
          Back to Activities
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          onClick={() => navigate('/activities')}
          startIcon={<ArrowBackIcon />}
          sx={{
            color: 'text.secondary',
            '&:hover': {
              bgcolor: 'action.hover',
            },
            borderRadius: '8px',
            py: 1,
          }}
        >
          Back to Activities
        </Button>
      </Box>

      {/* Activity Header */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Typography variant="h3" gutterBottom>
              {activity.title}
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 3, fontSize: '1.1rem', lineHeight: 1.6 }}>
              {activity.description}
            </Typography>

            {/* Activity Info */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              {location && (
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Location
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {location.address}
                        {location.neighborhood && `, ${location.neighborhood}`}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}
              
              {category && (
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CategoryIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Category
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {category.name}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}
              
              {price && (
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AttachMoneyIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Price
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {price.type === 'FREE' ? 'Free' : `${price.currency} ${price.amount}`}
                        {price.notes && ` - ${price.notes}`}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}

              {(activity.start_date || activity.end_date) && (
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Date(s)
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {activity.start_date === activity.end_date ? 
                          formatDate(activity.start_date) : 
                          `${formatDate(activity.start_date)} - ${formatDate(activity.end_date)}`
                        }
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}

              {schedule && schedule.type === 'RECURRING' && (
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccessTimeIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Schedule
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {schedule.daysOfWeek?.split('|').join(', ')}
                        {schedule.timeSlots && ` - ${schedule.timeSlots}`}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}
            </Grid>

            {/* Tags */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Tags
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {activity.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="medium"
                    color="primary"
                    variant="outlined"
                    sx={{ borderRadius: 2 }}
                  />
                ))}
              </Box>
            </Box>

            {/* Website Link */}
            {activity.website && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <PublicIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body1">
                  <a 
                    href={activity.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      color: 'inherit',
                      textDecoration: 'none',
                    }}
                  >
                    Visit Official Website
                  </a>
                </Typography>
              </Box>
            )}
          </Grid>
          
          <Grid item xs={12} md={4}>
            {/* Activity Icon */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 200,
                backgroundColor: 'primary.main',
                color: 'white',
                borderRadius: 2,
                mb: 3,
              }}
            >
              {getActivityIcon(category?.name || '', activity.title, activity.tags)}
            </Box>
            
            {/* Action Buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {location && (
                <Button
                  variant="contained"
                  startIcon={<DirectionsIcon />}
                  onClick={handleDirections}
                  size="large"
                >
                  Get Directions
                </Button>
              )}
              <Button
                variant="outlined"
                startIcon={<ShareIcon />}
                onClick={handleShare}
                size="large"
              >
                Share Activity
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Additional Information */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Activity Details
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {activity.description}
              </Typography>
              {location && (
                <Typography variant="body2" color="text.secondary">
                  Location: {location.address}
                  {location.neighborhood && `, ${location.neighborhood}`}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Getting There
              </Typography>
              {category && (
                <Typography variant="body2" color="text.secondary" paragraph>
                  • Category: {category.name}
                </Typography>
              )}
              {price && (
                <Typography variant="body2" color="text.secondary" paragraph>
                  • Price: {price.type === 'FREE' ? 'Free' : `${price.currency} ${price.amount}`}
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary" paragraph>
                • Check the official website for current schedules and availability
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Contact the venue directly for specific requirements or accessibility needs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ActivityDetails; 