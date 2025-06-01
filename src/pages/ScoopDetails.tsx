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
import LaunchIcon from '@mui/icons-material/Launch';
import { ScoopItem, loadScoopItems } from '../utils/dataLoader';

const ScoopDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<ScoopItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadItemData = async () => {
      try {
        setLoading(true);
        const items = await loadScoopItems();
        
        const currentItem = items.find(i => i.id === id);
        if (!currentItem) {
          throw new Error('Item not found');
        }
        setItem(currentItem);
        setLoading(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load item details');
        setLoading(false);
      }
    };

    loadItemData();
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${item?.title} - The Scoop`,
        text: `Check out this amazing activity: ${item?.title}!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch(console.error);
    }
  };

  const handleDirections = () => {
    if (!item) return;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}`;
    window.open(mapsUrl, '_blank');
  };

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading details...</Typography>
      </Container>
    );
  }

  if (error || !item) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error || 'Item not found'}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/scoop')}>
          Back to The Scoop
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          onClick={() => navigate('/scoop')}
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
          Back to The Scoop
        </Button>
      </Box>

      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {/* Title and Description */}
            <Typography variant="h4" component="h1" gutterBottom>
              {item.title}
            </Typography>

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {item.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            )}

            {/* Main Description */}
            <Typography variant="body1" paragraph>
              {item.description}
            </Typography>

            {/* Activity Details */}
            {item.activityDetails && item.activityDetails !== item.description && (
              <Typography variant="body1" paragraph>
                {item.activityDetails}
              </Typography>
            )}

            {/* Key Information Cards */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {/* Location */}
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOnIcon sx={{ mr: 1 }} />
                      <Typography variant="h6">Location</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {item.location}
                      {item.neighborhood && ` - ${item.neighborhood}`}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Price Range */}
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AttachMoneyIcon sx={{ mr: 1 }} />
                      <Typography variant="h6">Price Range</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {item.priceRange}
                      {item.cost && item.cost !== item.priceRange && ` (${item.cost})`}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Duration */}
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <EventIcon sx={{ mr: 1 }} />
                      <Typography variant="h6">Duration</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {item.duration}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Season */}
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <EventIcon sx={{ mr: 1 }} />
                      <Typography variant="h6">Best Time</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {item.season}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={4}>
            {/* Action Buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {item.website && item.website !== '#' && (
                <Button
                  variant="contained"
                  startIcon={<LaunchIcon />}
                  href={item.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="large"
                >
                  Visit Website
                </Button>
              )}
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
                Share
              </Button>
            </Box>

            {/* Additional Information */}
            {item.travelTime && (
              <Card sx={{ mt: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Travel Time
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.travelTime}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ScoopDetails; 