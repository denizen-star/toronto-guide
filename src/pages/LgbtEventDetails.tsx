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
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ScheduleIcon from '@mui/icons-material/Schedule';
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

  const getRecurrenceString = (event: LgbtEvent): string => {
    if (!event) return '';
    const { recurrenceType, recurrencePattern, daysOfWeek, weekOfMonth, time, specificDates } = event;

    if (recurrenceType === 'recurring') {
      if (recurrencePattern?.toLowerCase().includes('weekly')) {
        if (daysOfWeek && time) return `Weekly on ${daysOfWeek} at ${time}`;
        if (daysOfWeek) return `Weekly on ${daysOfWeek}`;
        if (time) return `Weekly at ${time}`;
        return 'Weekly';
      }
      if (recurrencePattern?.toLowerCase().includes('monthly')) {
        if (weekOfMonth && daysOfWeek && time) return `Monthly on the ${weekOfMonth} ${daysOfWeek} at ${time}`;
        if (weekOfMonth && daysOfWeek) return `Monthly on the ${weekOfMonth} ${daysOfWeek}`;
        if (daysOfWeek && time) return `Monthly on ${daysOfWeek} at ${time}`;
        if (daysOfWeek) return `Monthly on ${daysOfWeek}`;
        if (time) return `Monthly at ${time}`;
        return 'Monthly';
      }
      if (daysOfWeek && time) return `Every ${daysOfWeek} at ${time}`;
      if (daysOfWeek) return `Every ${daysOfWeek}`;
      if (time) return `Recurring at ${time}`;
      return 'Recurring';
    }
    if (recurrenceType === 'specific-dates' && specificDates) {
      return `Specific Dates: ${specificDates}${time ? ' at ' + time : ''}`;
    }
    if (recurrenceType === 'one-time') {
      if (event.startDate && time) return `One-time on ${event.startDate} at ${time}`;
      if (event.startDate) return `One-time on ${event.startDate}`;
      return 'One-time event';
    }
    return '';
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
      {/* Actions: Back Link */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/lgbtq-events')}
        sx={{ mb: 3 }}
      >
        Back to LGBTQ+ Events
      </Button>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 3, mb: 3 }}>
            {/* 1. Event Overview */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h4" gutterBottom sx={{ flex: 1 }}>
                {event.title}
              </Typography>
              <EventIcon sx={{ fontSize: 40 }} />
            </Box>
            <Typography variant="body1" paragraph>
              {event.description}
            </Typography>

            {/* 2. Event Details */}
            <Box sx={{ mt: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Event Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Card>
                    <CardContent sx={{ minHeight: 100, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CalendarTodayIcon sx={{ fontSize: '1.2rem', mr: 1 }} />
                        <Typography variant="subtitle1">Date & Time</Typography>
                      </Box>
                      <Typography variant="body2">
                        {event.startDate} {event.endDate && `- ${event.endDate}`}
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
                {(event.recurrenceType || event.recurrencePattern || event.specificDates) && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Card>
                      <CardContent sx={{ minHeight: 100, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <ScheduleIcon sx={{ fontSize: '1.2rem', mr: 1 }} />
                          <Typography variant="subtitle1">Schedule</Typography>
                        </Box>
                        <Typography variant="body2">
                          {getRecurrenceString(event)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
                {event.cost && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Card>
                      <CardContent sx={{ minHeight: 100, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Typography variant="subtitle1">Cost</Typography>
                        </Box>
                        <Typography variant="body2">{event.cost}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </Box>

            {/* 3 & 4. What to Expect & Getting Started side by side */}
            <Grid container spacing={2} sx={{ mt: 3 }}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      What to Expect
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {event.eventType ? `This is a ${event.eventType} event.` : ''} {event.ageRestriction ? `Age requirement: ${event.ageRestriction}.` : ''}
                    </Typography>
                    {/* Accessibility Features (if any) */}
                    {event.venueAccessibility && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Accessibility Features
                        </Typography>
                        {event.venueAccessibility.split(',').map((feature, idx) => (
                          <Chip key={idx} label={feature.trim()} variant="outlined" size="small" color="primary" sx={{ mr: 1, mb: 1 }} />
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Getting Started
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      • Check the location details and bring appropriate gear
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      • Contact organizers for specific schedules and requirements
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Sidebar: Actions & Icon, now half the width (md=3) */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, mb: 3 }}>
            {/* 5. Actions */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {event.website && (
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  href={event.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ fontSize: '0.7rem', justifyContent: 'flex-start', pl: 2 }}
                  startIcon={<LocationOnIcon sx={{ fontSize: '1.2rem' }} />}
                >
                  Visit Website
                </Button>
              )}
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                startIcon={<DirectionsIcon sx={{ fontSize: '1.2rem' }} />}
                onClick={handleDirections}
                sx={{ fontSize: '0.7rem', justifyContent: 'flex-start', pl: 2 }}
              >
                Get Directions
              </Button>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                startIcon={<ShareIcon sx={{ fontSize: '1.2rem' }} />}
                onClick={handleShare}
                sx={{ fontSize: '0.7rem', justifyContent: 'flex-start', pl: 2 }}
              >
                Share Event
              </Button>
              {/* Tags moved here */}
              {event.tags && event.tags.length > 0 && (
                <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {event.tags.map((tag, idx) => (
                    <Chip key={idx} label={tag} variant="outlined" />
                  ))}
                </Box>
              )}
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
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LgbtEventDetails; 