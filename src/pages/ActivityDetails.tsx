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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  CircularProgress,
  Stack,
  useTheme,
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

const ActivityDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
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
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          onClick={() => navigate(-1)}
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
          Back
        </Button>
      </Box>

      {/* Activity Header */}
      <Paper sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>
              {activity.title}
            </Typography>
            
            {location && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="subtitle1" color="text.secondary">
                  {location.address}
                  {location.neighborhood && ` • ${location.neighborhood}`}
                </Typography>
              </Box>
            )}

            {category && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CategoryIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="subtitle1" color="text.secondary">
                  {category.name}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {activity.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ borderRadius: 1 }}
                />
              ))}
            </Box>

            {activity.website && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PublicIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="subtitle1">
                  <a 
                    href={activity.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      color: theme.palette.primary.main,
                      textDecoration: 'none',
                    }}
                  >
                    Visit Website
                  </a>
                </Typography>
              </Box>
            )}

            <Typography variant="body1" sx={{ mt: 3 }}>
              {activity.description}
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={2}>
              {location && (
                <Button
                  variant="contained"
                  startIcon={<DirectionsIcon />}
                  onClick={handleDirections}
                  fullWidth
                  sx={{ borderRadius: 2 }}
                >
                  Get Directions
                </Button>
              )}
              <Button
                variant="outlined"
                startIcon={<ShareIcon />}
                onClick={handleShare}
                fullWidth
                sx={{ borderRadius: 2 }}
              >
                Share
              </Button>
            </Stack>

            <Card sx={{ mt: 3, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Activity Details
                </Typography>
                <List dense>
                  {schedule && (
                    <ListItem>
                      <ListItemIcon>
                        <AccessTimeIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Schedule"
                        secondary={
                          schedule.type === 'RECURRING' ? (
                            <>
                              {schedule.daysOfWeek?.split('|').join(', ')}
                              {schedule.timeSlots && <Box component="div">{schedule.timeSlots}</Box>}
                            </>
                          ) : 'One-time event'
                        }
                      />
                    </ListItem>
                  )}
                  
                  {(activity.start_date || activity.end_date) && (
                    <ListItem>
                      <ListItemIcon>
                        <EventIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Dates"
                        secondary={
                          activity.start_date === activity.end_date ? (
                            formatDate(activity.start_date)
                          ) : (
                            `${activity.start_date ? formatDate(activity.start_date) : ''} - ${
                              activity.end_date ? formatDate(activity.end_date) : ''
                            }`
                          )
                        }
                      />
                    </ListItem>
                  )}

                  {price && (
                    <ListItem>
                      <ListItemIcon>
                        <AttachMoneyIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Price"
                        secondary={
                          price.type === 'FREE' ? 'Free' : (
                            <>
                              {price.amount && `${price.currency} ${price.amount}`}
                              {price.notes && <Box component="div">{price.notes}</Box>}
                            </>
                          )
                        }
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Additional Information */}
      {category?.description && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Additional Information
          </Typography>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="body1">
              {category.description}
            </Typography>
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default ActivityDetails; 