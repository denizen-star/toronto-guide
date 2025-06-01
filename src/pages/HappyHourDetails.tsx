import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Chip,
  Button,
  Link,
} from '@mui/material';
import {
  LocalBar,
  AccessTime,
  LocationOn,
  Language,
} from '@mui/icons-material';
import { loadVenues, loadHappyHours, type Venue, type HappyHour } from '../utils/dataLoader';

interface VenueWithHappyHours extends Venue {
  happyHours: HappyHour[];
}

const HappyHourDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [venue, setVenue] = useState<VenueWithHappyHours | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data for venue ID:', id);
        setLoading(true);
        const [venues, happyHours] = await Promise.all([
          loadVenues(),
          loadHappyHours()
        ]);

        console.log('Loaded venues:', venues.length);
        console.log('Loaded happy hours:', happyHours.length);

        const targetVenue = venues.find(v => v.id.toString() === id);
        console.log('Found target venue:', targetVenue);

        if (!targetVenue) {
          throw new Error('Venue not found');
        }

        const venueHappyHours = happyHours.filter(hh => hh.location_id.toString() === id);
        console.log('Found happy hours for venue:', venueHappyHours.length);
        
        setVenue({
          ...targetVenue,
          happyHours: venueHappyHours
        });
        setLoading(false);
      } catch (err) {
        console.error('Error loading venue details:', err);
        setError(err instanceof Error ? err.message : 'Failed to load venue details');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !venue) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error">{error || 'Venue not found'}</Typography>
        <Button
          component={RouterLink}
          to="/happy-hours"
          variant="contained"
          sx={{ mt: 2 }}
        >
          Back to Happy Hours
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumb */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="body2" color="text.secondary">
          <RouterLink to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            Home
          </RouterLink>
          {' / '}
          <RouterLink to="/happy-hours" style={{ color: 'inherit', textDecoration: 'none' }}>
            Happy Hours
          </RouterLink>
          {' / '}
          {venue.name}
        </Typography>
      </Box>

      {/* Venue Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {venue.name}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Chip
            icon={<LocationOn />}
            label={venue.neighborhood}
            variant="outlined"
          />
          {venue.website && (
            <Chip
              icon={<Language />}
              label="Website"
              component="a"
              href={venue.website}
              target="_blank"
              rel="noopener noreferrer"
              clickable
            />
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Happy Hour Details */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalBar /> Happy Hour Specials
              </Typography>
              {venue.happyHours.map((hh, index) => (
                <Box key={index} sx={{ mb: 3, '&:last-child': { mb: 0 } }}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {hh.day_of_week}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <AccessTime fontSize="small" />
                    <Typography>
                      {hh.start_time} - {hh.end_time}
                    </Typography>
                  </Box>
                  <Typography variant="body1" paragraph>
                    {hh.offerings}
                  </Typography>
                  {hh.description && (
                    <Typography variant="body2" color="text.secondary">
                      {hh.description}
                    </Typography>
                  )}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Venue Information */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Venue Information
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  <LocationOn sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Location
                </Typography>
                <Typography variant="body2" paragraph>
                  {venue.address}
                </Typography>
                <Link
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${venue.name} ${venue.address} Toronto`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
                >
                  View on Google Maps
                </Link>
              </Box>
              {venue.website && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    <Language sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Website
                  </Typography>
                  <Link
                    href={venue.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit Website
                  </Link>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HappyHourDetails; 