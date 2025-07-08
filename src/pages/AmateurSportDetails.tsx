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
import FitnessCenter from '@mui/icons-material/FitnessCenter';
import ShareIcon from '@mui/icons-material/Share';
import DirectionsIcon from '@mui/icons-material/Directions';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import EventIcon from '@mui/icons-material/Event';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { StandardizedAmateurSport, loadStandardizedAmateurSports } from '../utils/dataLoader';

const getSportIcon = (eventType: string, title: string, size = 80) => {
  const sportType = eventType.toLowerCase();
  const titleLower = title.toLowerCase();
  
  if (sportType.includes('basketball') || titleLower.includes('basketball')) {
    return <SportsBasketballIcon sx={{ fontSize: size }} />;
  }
  if (sportType.includes('soccer') || titleLower.includes('soccer') || titleLower.includes('football')) {
    return <SportsSoccerIcon sx={{ fontSize: size }} />;
  }
  if (sportType.includes('volleyball') || titleLower.includes('volleyball')) {
    return <SportsVolleyballIcon sx={{ fontSize: size }} />;
  }
  if (sportType.includes('tennis') || titleLower.includes('tennis')) {
    return <SportsTennisIcon sx={{ fontSize: size }} />;
  }
  return <FitnessCenter sx={{ fontSize: size }} />;
};

const getRecurrenceString = (sport: StandardizedAmateurSport): string => {
  if (!sport) return '';
  const { recurrenceType, recurrencePattern, daysOfWeek, weekOfMonth, time, specificDates } = sport;

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
    if (sport.startDate && time) return `One-time on ${sport.startDate} at ${time}`;
    if (sport.startDate) return `One-time on ${sport.startDate}`;
    return 'One-time event';
  }
  return '';
};

const AmateurSportDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sport, setSport] = useState<StandardizedAmateurSport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSportData = async () => {
      try {
        setLoading(true);
        const sportsData = await loadStandardizedAmateurSports();
        
        const currentSport = sportsData.find(s => s.id === id);
        if (!currentSport) {
          throw new Error('Amateur sport not found');
        }
        setSport(currentSport);
        setLoading(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load sport details');
        setLoading(false);
      }
    };

    loadSportData();
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${sport?.title} - Amateur Sport Details`,
        text: `Check out this amazing amateur sport: ${sport?.title}!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch(console.error);
    }
  };

  const handleDirections = () => {
    if (!sport) return;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(sport.location)}`;
    window.open(mapsUrl, '_blank');
  };

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading sport details...</Typography>
      </Container>
    );
  }

  if (error || !sport) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error || 'Amateur sport not found'}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/amateur-sports')}>
          Back to Amateur Sports
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Actions: Back Link */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/amateur-sports')}
        sx={{ mb: 3 }}
      >
        Back to Amateur Sports
      </Button>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 3, mb: 3 }}>
            {/* 1. Event Overview */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h4" gutterBottom sx={{ flex: 1 }}>
                {sport.title}
              </Typography>
              {getSportIcon(sport.eventType, sport.title, 40)}
            </Box>
            <Typography variant="body1" paragraph>
              {sport.description}
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
                        <EventIcon sx={{ fontSize: '1.2rem', mr: 1 }} />
                        <Typography variant="subtitle1">Date & Time</Typography>
                      </Box>
                      <Typography variant="body2">{getRecurrenceString(sport)}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                {sport.cost && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Card>
                      <CardContent sx={{ minHeight: 100, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <FitnessCenter sx={{ fontSize: '1.2rem', mr: 1 }} />
                          <Typography variant="subtitle1">Cost</Typography>
                        </Box>
                        <Typography variant="body2">{sport.cost}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
                {sport.recurrencePattern && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Card>
                      <CardContent sx={{ minHeight: 100, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <ScheduleIcon sx={{ fontSize: '1.2rem', mr: 1 }} />
                          <Typography variant="subtitle1">Schedule</Typography>
                        </Box>
                        <Typography variant="body2">{sport.recurrencePattern}</Typography>
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
                      Join fellow enthusiasts for {sport.eventType.toLowerCase()} activities. This is perfect for {sport.skillLevel?.toLowerCase() || 'all'} players looking to stay active and meet new people.
                    </Typography>
                    {/* Accessibility Features (if any) */}
                    {sport.venueAccessibility && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Accessibility Features
                        </Typography>
                        {sport.venueAccessibility.split(',').map((feature, idx) => (
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
                      • Skill level required: {sport.skillLevel}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      • Sport type: {sport.eventType}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      • Check the location details and bring appropriate gear
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
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
              {sport.website && (
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  href={sport.website}
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
                Share Sport
              </Button>
              {/* Tags moved here */}
              {sport.tags && sport.tags.length > 0 && (
                <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', textAlign: 'center' }}>
                  {sport.tags.map((tag, idx) => (
                    <Chip key={idx} label={tag} variant="outlined" />
                  ))}
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AmateurSportDetails; 