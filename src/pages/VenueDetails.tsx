import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Divider,
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
  IconButton,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PhoneIcon from '@mui/icons-material/Phone';
import PublicIcon from '@mui/icons-material/Public';
import DirectionsIcon from '@mui/icons-material/Directions';
import ShareIcon from '@mui/icons-material/Share';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { loadVenues, loadHappyHours, getVenueTags, type Venue, type HappyHour } from '../utils/dataLoader';

const VenueDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [happyHours, setHappyHours] = useState<HappyHour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVenueData = async () => {
      try {
        setLoading(true);
        const [venuesData, happyHoursData] = await Promise.all([
          loadVenues(),
          loadHappyHours(),
        ]);
        
        const currentVenue = venuesData.find(v => v.id === parseInt(id || '0'));
        if (!currentVenue) {
          throw new Error('Venue not found');
        }
        setVenue(currentVenue);
        
        const venueHappyHours = happyHoursData.filter(hh => hh.location_id === parseInt(id || '0'));
        setHappyHours(venueHappyHours);
        setLoading(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load venue details');
        setLoading(false);
      }
    };

    loadVenueData();
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${venue?.name} - Happy Hour Details`,
        text: `Check out the happy hour deals at ${venue?.name}!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch(console.error);
    }
  };

  const handleDirections = () => {
    if (!venue) return;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${venue.name} ${venue.address}`
    )}`;
    window.open(mapsUrl, '_blank');
  };

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading venue details...</Typography>
      </Container>
    );
  }

  if (error || !venue) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error || 'Venue not found'}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Container>
    );
  }

  const groupedHappyHours = happyHours.reduce((acc, hh) => {
    if (!acc[hh.day_of_week]) {
      acc[hh.day_of_week] = [];
    }
    acc[hh.day_of_week].push(hh);
    return acc;
  }, {} as Record<string, HappyHour[]>);

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

      {/* Venue Header */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>
              {venue.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOnIcon sx={{ mr: 1 }} />
              <Typography variant="subtitle1">{venue.address}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {getVenueTags(venue, happyHours).map((tag, index) => (
                <Chip
                  key={index}
                  label={tag.label}
                  size="small"
                  color={tag.color}
                  sx={{ borderRadius: 1 }}
                />
              ))}
            </Box>
            {venue.phone && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PhoneIcon sx={{ mr: 1 }} />
                <Typography variant="subtitle1">
                  <a href={`tel:${venue.phone}`}>{venue.phone}</a>
                </Typography>
              </Box>
            )}
            {venue.website && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PublicIcon sx={{ mr: 1 }} />
                <Typography variant="subtitle1">
                  <a href={venue.website} target="_blank" rel="noopener noreferrer">
                    Visit Website
                  </a>
                </Typography>
              </Box>
            )}
            {venue.description && (
              <Typography variant="body1" sx={{ mt: 2 }}>
                {venue.description}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<DirectionsIcon />}
                onClick={handleDirections}
                fullWidth
              >
                Get Directions
              </Button>
              <Button
                variant="outlined"
                startIcon={<ShareIcon />}
                onClick={handleShare}
                fullWidth
              >
                Share
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Happy Hours Section */}
      <Typography variant="h5" gutterBottom>
        Happy Hour Schedule
      </Typography>
      <Grid container spacing={3}>
        {Object.entries(groupedHappyHours).map(([day, dayHappyHours]) => (
          <Grid item xs={12} md={6} key={day}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {day}
                </Typography>
                <List>
                  {dayHappyHours.map((hh) => (
                    <React.Fragment key={hh.id}>
                      <ListItem>
                        <ListItemIcon>
                          <AccessTimeIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={`${hh.start_time} - ${hh.end_time}`}
                          secondary={
                            <Box sx={{ mt: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <LocalBarIcon sx={{ mr: 1, fontSize: 'small' }} />
                                <Typography variant="body2">{hh.offerings}</Typography>
                              </Box>
                              {hh.description && (
                                <Typography variant="body2" color="text.secondary">
                                  {hh.description}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {happyHours.length === 0 && (
        <Paper sx={{ p: 3, mt: 2, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No happy hour information available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please check back later or contact the venue directly.
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default VenueDetails; 