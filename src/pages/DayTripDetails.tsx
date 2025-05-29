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
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ShareIcon from '@mui/icons-material/Share';
import DirectionsIcon from '@mui/icons-material/Directions';
import NatureIcon from '@mui/icons-material/Nature';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import HikingIcon from '@mui/icons-material/Hiking';
import WineBarIcon from '@mui/icons-material/WineBar';
import { DayTrip, loadDayTrips } from '../utils/dataLoader';

const getTripIcon = (title: string, tags: string[]) => {
  const titleLower = title.toLowerCase();
  const allTags = tags.join(' ').toLowerCase();
  
  if (titleLower.includes('beach') || titleLower.includes('wasaga') || allTags.includes('beach')) {
    return <BeachAccessIcon sx={{ fontSize: 80 }} />;
  }
  if (titleLower.includes('wine') || titleLower.includes('county') || allTags.includes('wine')) {
    return <WineBarIcon sx={{ fontSize: 80 }} />;
  }
  if (titleLower.includes('mountain') || titleLower.includes('hiking') || allTags.includes('hiking')) {
    return <HikingIcon sx={{ fontSize: 80 }} />;
  }
  return <NatureIcon sx={{ fontSize: 80 }} />;
};

const DayTripDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<DayTrip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTripData = async () => {
      try {
        setLoading(true);
        const tripsData = await loadDayTrips();
        
        const currentTrip = tripsData.find(t => t.id === id);
        if (!currentTrip) {
          throw new Error('Day trip not found');
        }
        setTrip(currentTrip);
        setLoading(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load trip details');
        setLoading(false);
      }
    };

    loadTripData();
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${trip?.title} - Day Trip Details`,
        text: `Check out this amazing day trip: ${trip?.title}!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch(console.error);
    }
  };

  const handleDirections = () => {
    if (!trip) return;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trip.title)}`;
    window.open(mapsUrl, '_blank');
  };

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading trip details...</Typography>
      </Container>
    );
  }

  if (error || !trip) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error || 'Day trip not found'}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/day-trips')}>
          Back to Day Trips
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          onClick={() => navigate('/day-trips')}
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
          Back to Day Trips
        </Button>
      </Box>

      {/* Trip Header */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Typography variant="h3" gutterBottom>
              {trip.title}
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 3, fontSize: '1.1rem', lineHeight: 1.6 }}>
              {trip.description}
            </Typography>

            {/* Trip Info */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <DirectionsCarIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Distance from Toronto
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {trip.distance}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccessTimeIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Duration
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {trip.duration}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarTodayIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Best Season
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {trip.season}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {/* Tags */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Categories
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {trip.tags.map((tag, index) => (
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
          </Grid>
          
          <Grid item xs={12} md={4}>
            {/* Trip Icon */}
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
              {getTripIcon(trip.title, trip.tags)}
            </Box>
            
            {/* Action Buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<DirectionsIcon />}
                onClick={handleDirections}
                size="large"
              >
                Get Directions
              </Button>
              <Button
                variant="outlined"
                startIcon={<ShareIcon />}
                onClick={handleShare}
                size="large"
              >
                Share Trip
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Additional Information */}
      <Grid container spacing={4}>
        {/* What to Expect */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                What to Expect
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                This {trip.duration.toLowerCase()} trip to {trip.title} offers a perfect getaway from the city. 
                Located {trip.distance} from Toronto, it's an ideal destination for {trip.season.toLowerCase()} visits.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Last updated: {new Date(trip.lastUpdated).toLocaleDateString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Trip Highlights */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Trip Highlights
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {trip.tags.slice(0, 4).map((tag, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: 'primary.main',
                        mr: 2,
                      }}
                    />
                    <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                      {tag}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DayTripDetails; 