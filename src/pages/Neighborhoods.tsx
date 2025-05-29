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
  IconButton,
  InputAdornment,
  Paper,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Filters Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Find Happy Hours
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search venues"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Neighborhood</InputLabel>
              <Select
                value={selectedNeighborhood}
                label="Neighborhood"
                onChange={(e) => {
                  setSelectedNeighborhood(e.target.value);
                  setSearchParams({ area: e.target.value });
                }}
              >
                {neighborhoods.map((neighborhood) => (
                  <MenuItem key={neighborhood} value={neighborhood}>
                    {neighborhood}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Day</InputLabel>
              <Select
                value={dayFilter}
                label="Day"
                onChange={(e) => setDayFilter(e.target.value)}
              >
                {days.map((day) => (
                  <MenuItem key={day} value={day}>
                    {day.charAt(0).toUpperCase() + day.slice(1).toLowerCase()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Price Range</InputLabel>
              <Select
                value={priceRange}
                label="Price Range"
                onChange={(e) => setPriceRange(e.target.value)}
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
      </Paper>

      {/* Results Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {filteredVenues.length} venues found
        </Typography>
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          {filteredVenues.map((venue) => {
            const venueHappyHours = getVenueHappyHours(venue.id);
            const tags = getVenueTags(venue, venueHappyHours);

            return (
              <Grid item xs={12} sm={6} md={4} key={venue.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: (theme) => theme.shadows[4],
                      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    <Typography variant="h6" component="h2" gutterBottom noWrap>
                      {venue.name}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {venue.address}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {venueHappyHours.length} Happy Hour{venueHappyHours.length !== 1 ? 's' : ''}
                      </Typography>
                    </Box>

                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: 0.5, 
                      mb: 2,
                      maxHeight: '100px',
                      overflow: 'auto'
                    }}>
                      {tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag.label}
                          color={tag.color}
                          size="small"
                          sx={{ 
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      component={RouterLink}
                      to={`/venue/${venue.id}`}
                      variant="contained"
                      fullWidth
                      size="small"
                      sx={{
                        borderRadius: '20px',
                        textTransform: 'none',
                      }}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {filteredVenues.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No venues found matching your criteria
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Try adjusting your filters or search terms
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Neighborhoods; 