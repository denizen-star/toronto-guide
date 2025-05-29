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
import PeopleIcon from '@mui/icons-material/People';
import FitnessCenter from '@mui/icons-material/FitnessCenter';
import ShareIcon from '@mui/icons-material/Share';
import DirectionsIcon from '@mui/icons-material/Directions';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import { AmateurSport, loadAmateurSports } from '../utils/dataLoader';

const getSportIcon = (type: string, title: string) => {
  const sportType = type.toLowerCase();
  const titleLower = title.toLowerCase();
  
  if (sportType.includes('basketball') || titleLower.includes('basketball')) {
    return <SportsBasketballIcon sx={{ fontSize: 80 }} />;
  }
  if (sportType.includes('soccer') || titleLower.includes('soccer') || titleLower.includes('football')) {
    return <SportsSoccerIcon sx={{ fontSize: 80 }} />;
  }
  if (sportType.includes('volleyball') || titleLower.includes('volleyball')) {
    return <SportsVolleyballIcon sx={{ fontSize: 80 }} />;
  }
  if (sportType.includes('tennis') || titleLower.includes('tennis')) {
    return <SportsTennisIcon sx={{ fontSize: 80 }} />;
  }
  return <FitnessCenter sx={{ fontSize: 80 }} />;
};

const AmateurSportDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sport, setSport] = useState<AmateurSport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSportData = async () => {
      try {
        setLoading(true);
        const sportsData = await loadAmateurSports();
        
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
      {/* Back Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          onClick={() => navigate('/amateur-sports')}
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
          Back to Amateur Sports
        </Button>
      </Box>

      {/* Sport Header */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Typography variant="h3" gutterBottom>
              {sport.title}
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 3, fontSize: '1.1rem', lineHeight: 1.6 }}>
              {sport.description}
            </Typography>

            {/* Sport Info */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Location
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {sport.location}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <FitnessCenter sx={{ mr: 1, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Sport Type
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {sport.type}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PeopleIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Skill Level
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {sport.skillLevel}
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
                {sport.tags.map((tag, index) => (
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
            {/* Sport Icon */}
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
              {getSportIcon(sport.type, sport.title)}
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
                Share Sport
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
                What to Expect
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Join fellow enthusiasts for {sport.type.toLowerCase()} activities. This is perfect for {sport.skillLevel.toLowerCase()} players looking to stay active and meet new people.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Location: {sport.location}
              </Typography>
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
                • Sport type: {sport.type}
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
    </Container>
  );
};

export default AmateurSportDetails; 