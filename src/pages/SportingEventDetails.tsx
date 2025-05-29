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
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShareIcon from '@mui/icons-material/Share';
import DirectionsIcon from '@mui/icons-material/Directions';
import SportsHockeyIcon from '@mui/icons-material/SportsHockey';
import SportsBaseballIcon from '@mui/icons-material/SportsBaseball';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsFootballIcon from '@mui/icons-material/SportsFootball';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import SportsIcon from '@mui/icons-material/Sports';
import { SportingEvent, loadSportingEvents } from '../utils/dataLoader';

const getEventIcon = (type: string, title: string) => {
  const eventType = type.toLowerCase();
  const titleLower = title.toLowerCase();
  
  if (eventType.includes('hockey') || titleLower.includes('hockey') || titleLower.includes('leafs')) {
    return <SportsHockeyIcon sx={{ fontSize: 80 }} />;
  }
  if (eventType.includes('baseball') || titleLower.includes('baseball') || titleLower.includes('jays')) {
    return <SportsBaseballIcon sx={{ fontSize: 80 }} />;
  }
  if (eventType.includes('basketball') || titleLower.includes('basketball') || titleLower.includes('raptors')) {
    return <SportsBasketballIcon sx={{ fontSize: 80 }} />;
  }
  if (eventType.includes('football') || titleLower.includes('football')) {
    return <SportsFootballIcon sx={{ fontSize: 80 }} />;
  }
  if (eventType.includes('soccer') || titleLower.includes('soccer') || titleLower.includes('fc')) {
    return <SportsSoccerIcon sx={{ fontSize: 80 }} />;
  }
  return <SportsIcon sx={{ fontSize: 80 }} />;
};

const SportingEventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<SportingEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEventData = async () => {
      try {
        setLoading(true);
        const eventsData = await loadSportingEvents();
        
        const currentEvent = eventsData.find(e => e.id === id);
        if (!currentEvent) {
          throw new Error('Sporting event not found');
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
        title: `${event?.title} - Sporting Event Details`,
        text: `Check out this exciting sporting event: ${event?.title}!`,
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
          {error || 'Sporting event not found'}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/sporting-events')}>
          Back to Sporting Events
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          onClick={() => navigate('/sporting-events')}
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
          Back to Sporting Events
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
                      {new Date(event.date).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Venue
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {event.location}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SportsIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Sport Type
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {event.type}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AttachMoneyIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Ticket Price Range
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {event.priceRange}
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
                Event Details
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Experience the excitement of {event.type.toLowerCase()} at {event.location}. This professional sporting event promises an unforgettable experience for sports fans.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Date: {new Date(event.date).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Venue: {event.location}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ticket Information
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Price range: {event.priceRange}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Event type: {event.type}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Check official team/venue websites for ticket availability
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Arrive early for best parking and concession options
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SportingEventDetails; 