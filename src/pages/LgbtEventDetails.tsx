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
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ShareIcon from '@mui/icons-material/Share';
import DirectionsIcon from '@mui/icons-material/Directions';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import { LgbtEvent, loadLgbtEvents } from '../utils/dataLoader';

const LgbtEventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<LgbtEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const events = await loadLgbtEvents();
        const foundEvent = events.find(e => e.id === id);
        
        if (foundEvent) {
          setEvent(foundEvent);
        } else {
          setError('Event not found');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading event details:', err);
        setError('Failed to load event details');
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: event?.description,
        url: window.location.href,
      }).catch(console.error);
    }
  };

  const handleDirections = () => {
    if (event?.location) {
      window.open(`https://maps.google.com/maps?daddr=${encodeURIComponent(event.location)}`, '_blank');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !event) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Event not found'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/lgbtq-events')}
        sx={{ mb: 3 }}
      >
        Back to Events
      </Button>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom>
              {event.title}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip
                icon={<EventIcon />}
                label={event.recurring ? 'Recurring Event' : 'One-time Event'}
                color="primary"
              />
              {event.ageRestriction && (
                <Chip
                  label={event.ageRestriction}
                  color="secondary"
                />
              )}
            </Box>

            <Typography variant="body1" paragraph>
              {event.description}
            </Typography>

            {/* Event Details */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Event Details
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <LocationOnIcon sx={{ mr: 1 }} />
                        <Typography variant="subtitle1">Location</Typography>
                      </Box>
                      <Typography variant="body2">{event.location}</Typography>
                      {event.googleMapLink && (
                        <Button
                          variant="text"
                          size="small"
                          startIcon={<DirectionsIcon />}
                          onClick={handleDirections}
                          sx={{ mt: 1 }}
                        >
                          View on Map
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CalendarTodayIcon sx={{ mr: 1 }} />
                        <Typography variant="subtitle1">Date & Time</Typography>
                      </Box>
                      <Typography variant="body2">
                        {event.startDate} - {event.endDate}
                      </Typography>
                      {event.recurring && (
                        <Chip
                          size="small"
                          label="Recurring Event"
                          color="secondary"
                          sx={{ mt: 1 }}
                        />
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                {/* Enhanced Accessibility Information */}
                {event.venueAccessibility && (
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <AccessibilityNewIcon sx={{ mr: 1 }} />
                          <Typography variant="subtitle1">Accessibility Features</Typography>
                        </Box>
                        <Grid container spacing={1}>
                          {event.venueAccessibility.split(',').map((feature, index) => (
                            <Grid item key={index}>
                              <Chip
                                label={feature.trim()}
                                variant="outlined"
                                size="small"
                                color="primary"
                              />
                            </Grid>
                          ))}
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {/* Event Status and Requirements */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Event Information
                      </Typography>
                      <Grid container spacing={2}>
                        {event.ageRestriction && (
                          <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                Age Requirement:
                              </Typography>
                              <Chip
                                label={event.ageRestriction}
                                size="small"
                                color="primary"
                              />
                            </Box>
                          </Grid>
                        )}
                        {event.pronouns && (
                          <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                Pronouns:
                              </Typography>
                              <Typography variant="body2">
                                {event.pronouns}
                              </Typography>
                            </Box>
                          </Grid>
                        )}
                        {event.cost && (
                          <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                Cost:
                              </Typography>
                              <Typography variant="body2">
                                {event.cost}
                              </Typography>
                            </Box>
                          </Grid>
                        )}
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Event Type:
                            </Typography>
                            <Chip
                              label={event.eventType}
                              size="small"
                              color="primary"
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Tags
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {event.tags.map((tag, index) => (
                    <Chip key={index} label={tag} variant="outlined" />
                  ))}
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            {/* Action Buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {event.website && (
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  href={event.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Website
                </Button>
              )}
              
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                startIcon={<DirectionsIcon />}
                onClick={handleDirections}
              >
                Get Directions
              </Button>

              <Button
                variant="outlined"
                color="primary"
                fullWidth
                startIcon={<ShareIcon />}
                onClick={handleShare}
              >
                Share Event
              </Button>
            </Box>

            {/* Social Media Links */}
            {event.socialMedia && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Social Media
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {event.socialMedia.instagram && (
                    <IconButton
                      color="primary"
                      href={event.socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <InstagramIcon />
                    </IconButton>
                  )}
                  {event.socialMedia.facebook && (
                    <IconButton
                      color="primary"
                      href={event.socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FacebookIcon />
                    </IconButton>
                  )}
                  {event.socialMedia.twitter && (
                    <IconButton
                      color="primary"
                      href={event.socialMedia.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <TwitterIcon />
                    </IconButton>
                  )}
                </Box>
              </Box>
            )}

            {/* Additional Information */}
            {event.pronouns && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Preferred Pronouns
                </Typography>
                <Typography variant="body2">
                  {event.pronouns}
                </Typography>
              </Box>
            )}

            {event.cost && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Cost
                </Typography>
                <Typography variant="body2">
                  {event.cost}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LgbtEventDetails; 