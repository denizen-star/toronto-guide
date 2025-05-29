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
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ShareIcon from '@mui/icons-material/Share';
import DirectionsIcon from '@mui/icons-material/Directions';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PaletteIcon from '@mui/icons-material/Palette';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import FestivalIcon from '@mui/icons-material/Festival';
import CelebrationIcon from '@mui/icons-material/Celebration';
import { SpecialEvent, loadSpecialEvents } from '../utils/dataLoader';

const getEventIcon = (type: string, title: string) => {
  const eventType = type.toLowerCase();
  const titleLower = title.toLowerCase();
  
  if (eventType.includes('film') || titleLower.includes('film') || titleLower.includes('movie') || titleLower.includes('cinema')) {
    return <LocalMoviesIcon sx={{ fontSize: 80 }} />;
  }
  if (eventType.includes('food') || titleLower.includes('food') || titleLower.includes('taste') || titleLower.includes('culinary')) {
    return <RestaurantIcon sx={{ fontSize: 80 }} />;
  }
  if (eventType.includes('music') || titleLower.includes('music') || titleLower.includes('concert')) {
    return <MusicNoteIcon sx={{ fontSize: 80 }} />;
  }
  if (eventType.includes('art') || titleLower.includes('art') || eventType.includes('gallery')) {
    return <PaletteIcon sx={{ fontSize: 80 }} />;
  }
  if (eventType.includes('comedy') || titleLower.includes('comedy') || titleLower.includes('theater')) {
    return <TheaterComedyIcon sx={{ fontSize: 80 }} />;
  }
  if (eventType.includes('festival')) {
    return <FestivalIcon sx={{ fontSize: 80 }} />;
  }
  return <CelebrationIcon sx={{ fontSize: 80 }} />;
};

const SpecialEventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<SpecialEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEventData = async () => {
      try {
        setLoading(true);
        const eventsData = await loadSpecialEvents();
        
        const currentEvent = eventsData.find(e => e.id === id);
        if (!currentEvent) {
          throw new Error('Special event not found');
        }
        setEvent(currentEvent);
        setLoading(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load event details');
        setLoading(false);
      }
    };

    loadEventData();
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${event?.title} - Special Event Details`,
        text: `Check out this amazing special event: ${event?.title}!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch(console.error);
    }
  };

  const handleDirections = () => {
    if (!event) return;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`;
    window.open(mapsUrl, '_blank');
  };

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading event details...</Typography>
      </Container>
    );
  }

  if (error || !event) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error || 'Special event not found'}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/special-events')}>
          Back to Special Events
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          onClick={() => navigate('/special-events')}
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
          Back to Special Events
        </Button>
      </Box>

      {/* Event Header */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Typography variant="h3" gutterBottom>
              {event.title}
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 3, fontSize: '1.1rem', lineHeight: 1.6 }}>
              {event.description}
            </Typography>

            {/* Event Info */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Event Date
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {event.date}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Location
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {event.location}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CelebrationIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Event Type
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {event.type}
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
                {event.tags.map((tag, index) => (
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
            {/* Event Icon */}
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
              {getEventIcon(event.type, event.title)}
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
                Share Event
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
                Event Highlights
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Join us for {event.title}, a spectacular {event.type.toLowerCase()} event in Toronto. Experience the vibrant culture and community spirit that makes this city special.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Date: {event.date}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Location: {event.location}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                What to Expect
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Type: {event.type}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Perfect for families and friends
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Check event website for specific timing and requirements
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Don't forget to bring your camera for memorable moments!
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SpecialEventDetails; 