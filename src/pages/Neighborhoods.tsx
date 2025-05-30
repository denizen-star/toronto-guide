import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import { loadVenues, loadHappyHours, getVenueTags, type Venue, type HappyHour } from '../utils/dataLoader';
import { Link as RouterLink } from 'react-router-dom';

const Neighborhoods = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [happyHours, setHappyHours] = useState<HappyHour[]>([]);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>(
    searchParams.get('area') || 'All'
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [dayFilter, setDayFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [venuesData, happyHoursData] = await Promise.all([
          loadVenues(),
          loadHappyHours(),
        ]);
        setVenues(venuesData);
        setHappyHours(happyHoursData);
        setLoading(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load data');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const neighborhoods = ['All', ...Array.from(new Set(venues.map(venue => venue.neighborhood)))];
  const days = ['all', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: 'low', label: '$ (Under $10)' },
    { value: 'medium', label: '$$ ($10-$20)' },
    { value: 'high', label: '$$$ ($20+)' },
  ];

  const getVenueHappyHours = (venueId: number) => {
    return happyHours.filter(hh => hh.location_id === venueId);
  };

  const filteredVenues = venues
    .filter(venue => 
      (selectedNeighborhood === 'All' || venue.neighborhood === selectedNeighborhood) &&
      (searchTerm === '' || 
        venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.address.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(venue => {
      if (dayFilter === 'all') return true;
      return getVenueHappyHours(venue.id).some(hh => hh.day_of_week === dayFilter);
    })
    .filter(venue => {
      if (priceRange === 'all') return true;
      const venueHappyHours = getVenueHappyHours(venue.id);
      const hasMatchingPrice = venueHappyHours.some(hh => {
        const priceMatch = hh.offerings.match(/\$(\d+)/);
        if (!priceMatch) return false;
        const price = parseInt(priceMatch[1]);
        switch (priceRange) {
          case 'low': return price < 10;
          case 'medium': return price >= 10 && price <= 20;
          case 'high': return price > 20;
          default: return true;
        }
      });
      return hasMatchingPrice;
    });

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading venues...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ 
        bgcolor: 'background.default',
        py: { xs: 2, md: 3 },
        textAlign: 'center'
      }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          <Typography 
            variant="h4"
            component="h1"
            sx={{ 
              mb: 1,
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            Find Happy Hours
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'text.secondary',
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Discover the best happy hour deals across Toronto neighborhoods
          </Typography>
        </Container>
      </Box>

      {/* Search and Filters */}
      <Box sx={{ bgcolor: 'background.paper', py: 1.5 }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          {/* Search Bar */}
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
            <TextField
              placeholder="Search venues, neighborhoods, or offerings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{
                width: '100%',
                maxWidth: 600,
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'background.paper',
                  borderRadius: 3,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Filter Dropdowns */}
          <Box sx={{ mb: 2 }}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Neighborhood</InputLabel>
                  <Select
                    value={selectedNeighborhood}
                    onChange={(e) => {
                      setSelectedNeighborhood(e.target.value);
                      setSearchParams({ area: e.target.value });
                    }}
                    label="Neighborhood"
                  >
                    {neighborhoods.map((neighborhood) => (
                      <MenuItem key={neighborhood} value={neighborhood}>
                        {neighborhood}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Day</InputLabel>
                  <Select
                    value={dayFilter}
                    onChange={(e) => setDayFilter(e.target.value)}
                    label="Day"
                  >
                    {days.map((day) => (
                      <MenuItem key={day} value={day}>
                        {day === 'all' ? 'All Days' : day.charAt(0).toUpperCase() + day.slice(1).toLowerCase()}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Price Range</InputLabel>
                  <Select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    label="Price Range"
                  >
                    {priceRanges.map((range) => (
                      <MenuItem key={range.value} value={range.value}>
                        {range.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          {/* Results Summary */}
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {filteredVenues.length} {filteredVenues.length === 1 ? 'venue' : 'venues'} found
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Venues Grid */}
      <Box sx={{ bgcolor: 'background.default', py: 4 }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          <Grid container spacing={4}>
            {filteredVenues.map((venue) => {
              const venueHappyHours = getVenueHappyHours(venue.id);
              const tags = getVenueTags(venue, venueHappyHours);
              
              return (
                <Grid item xs={12} sm={6} lg={4} key={venue.id}>
                  <Card sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 4,
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {venue.name}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOnIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {venue.neighborhood}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        {venueHappyHours.length > 0 && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <AccessTimeIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {venueHappyHours[0].day_of_week}: {venueHappyHours[0].start_time} - {venueHappyHours[0].end_time}
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                        {tags.slice(0, 3).map((tag, index) => (
                          <Chip 
                            key={index} 
                            label={tag.label} 
                            size="small" 
                            color={tag.color}
                          />
                        ))}
                      </Box>
                    </CardContent>

                    <CardActions>
                      <Button
                        component={RouterLink}
                        to={`/venue/${venue.id}`}
                        size="small"
                        variant="contained"
                        fullWidth
                      >
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Neighborhoods; 