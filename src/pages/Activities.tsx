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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Stack,
  InputAdornment,
  useTheme,
  IconButton,
  Tooltip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import SearchIcon from '@mui/icons-material/Search';
import CategoryIcon from '@mui/icons-material/Category';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PlaceIcon from '@mui/icons-material/Place';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DirectionsIcon from '@mui/icons-material/Directions';
import { 
  loadActivities, 
  loadLocations, 
  loadCategories, 
  loadPrices,
  loadSchedules,
  type Activity, 
  type Location, 
  type Category, 
  type Price,
  type Schedule,
} from '../utils/dataLoader';

const TORONTO_CENTER = {
  lat: 43.6532,
  lng: -79.3832,
};

const MONTREAL_CENTER = {
  lat: 45.5017,
  lng: -73.5673,
};

const Activities = () => {
  const theme = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [locations, setLocations] = useState<{ [key: string]: Location }>({});
  const [categories, setCategories] = useState<{ [key: string]: Category }>({});
  const [prices, setPrices] = useState<{ [key: string]: Price }>({});
  const [schedules, setSchedules] = useState<{ [key: string]: Schedule }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city')?.toLowerCase() || 'all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('all');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getDirectionsUrl = (location: Location) => {
    if (!location?.address) return null;
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.address)}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [activitiesData, locationsData, categoriesData, pricesData, schedulesData] = await Promise.all([
          loadActivities(),
          loadLocations(),
          loadCategories(),
          loadPrices(),
          loadSchedules(),
        ]);
        setActivities(activitiesData);
        
        // Create maps for efficient lookups
        const locationMap = locationsData.reduce((acc: { [key: string]: Location }, location: Location) => {
          acc[location.id] = location;
          return acc;
        }, {});
        setLocations(locationMap);

        const categoryMap = categoriesData.reduce((acc: { [key: string]: Category }, category: Category) => {
          acc[category.id] = category;
          return acc;
        }, {});
        setCategories(categoryMap);

        const priceMap = pricesData.reduce((acc: { [key: string]: Price }, price: Price) => {
          acc[price.id] = price;
          return acc;
        }, {});
        setPrices(priceMap);

        const scheduleMap = schedulesData.reduce((acc: { [key: string]: Schedule }, schedule: Schedule) => {
          acc[schedule.id] = schedule;
          return acc;
        }, {});
        setSchedules(scheduleMap);

        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load data');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categoryOptions = ['all', ...new Set(activities.map(activity => activity.categoryId))];
  const priceOptions = ['all', ...new Set(activities.map(activity => activity.priceId))];
  
  // Get unique neighborhoods from activities and their associated locations
  const neighborhoods = ['all', ...new Set(activities.map(activity => 
    activity.neighborhood || locations[activity.locationId]?.neighborhood
  ).filter(Boolean))].sort();

  const matchesSearchTerm = (activity: Activity, searchTerm: string): boolean => {
    if (!searchTerm.trim()) return true;

    const searchLower = searchTerm.toLowerCase().trim();
    const location = locations[activity.locationId];
    const category = categories[activity.categoryId];

    // Check each field that should be searchable
    const searchableFields = [
      activity.title.toLowerCase(),
      activity.description.toLowerCase(),
      activity.city.toLowerCase(),
      activity.neighborhood?.toLowerCase() || '',
      location?.neighborhood?.toLowerCase() || '',
      category?.name?.toLowerCase() || '',
      ...activity.tags.map(tag => tag.toLowerCase())
    ];

    // Return true if any field contains the search term
    return searchableFields.some(field => field.includes(searchLower));
  };

  const filteredActivities = activities.filter(activity => {
    const location = locations[activity.locationId];
    
    // Basic filters
    const matchesSearch = matchesSearchTerm(activity, searchTerm);
    const matchesCategory = selectedCategory === 'all' || activity.categoryId === selectedCategory;
    const matchesPrice = selectedPrice === 'all' || activity.priceId === selectedPrice;
    const matchesCity = selectedCity === 'all' || activity.city === selectedCity;
    const matchesNeighborhood = selectedNeighborhood === 'all' || 
      (location && location.neighborhood === selectedNeighborhood);

    // Date range filtering
    let matchesDateRange = true;
    if (startDate || endDate) {
      const activityStartDate = activity.start_date ? new Date(activity.start_date) : null;
      const activityEndDate = activity.end_date ? new Date(activity.end_date) : null;

      if (startDate && activityEndDate) {
        matchesDateRange = matchesDateRange && activityEndDate >= startDate;
      }
      if (endDate && activityStartDate) {
        matchesDateRange = matchesDateRange && activityStartDate <= endDate;
      }
    }

    return matchesSearch && 
           matchesCategory && 
           matchesPrice && 
           matchesCity && 
           matchesNeighborhood && 
           matchesDateRange;
  });

  const getPriceRangeColor = (priceId: string) => {
    const price = prices[priceId];
    if (!price) return 'default';
    
    if (price.type === 'FREE') return 'success';
    if (price.type === 'PAID') {
      const amount = parseFloat(price.amount);
      if (isNaN(amount)) return 'info';
      if (amount <= 20) return 'info';
      if (amount <= 50) return 'warning';
      return 'error';
    }
    if (price.type === 'SPECIAL') return 'secondary';
    return 'default';
  };

  const getPriceDisplay = (priceId: string) => {
    const price = prices[priceId];
    if (!price) return `Price ID ${priceId}`;
    
    if (price.type === 'FREE') return 'Free';
    if (price.type === 'SPECIAL') return 'Special Offer';
    if (price.amount) return `${price.currency} ${price.amount}${price.notes ? '+' : ''}`;
    return price.notes || 'Price varies';
  };

  const getCategoryName = (categoryId: string) => {
    return categories[categoryId]?.name || `Category ${categoryId}`;
  };

  const formatSchedule = (scheduleId: string) => {
    const schedule = schedules[scheduleId];
    if (!schedule) return null;

    const days = schedule.daysOfWeek?.split('|').join(', ') || '';
    const times = schedule.timeSlots || '';
    
    return { days, times };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDateDisplay = (activity: Activity) => {
    if (!activity.start_date || !activity.end_date) return null;
    
    const start = formatDate(activity.start_date);
    const end = formatDate(activity.end_date);
    
    if (start === end) return start;
    return `${start} - ${end}`;
  };

  const hasDetails = (activity: Activity) => {
    // Check if activity has enough details to warrant a details page
    return activity.description.length > 100 || // Has substantial description
           (activity.start_date && activity.end_date) || // Has date information
           activity.tags.length > 2 || // Has multiple tags
           locations[activity.locationId]?.address; // Has location details
  };

  const renderActivityCard = (activity: Activity) => {
    const location = locations[activity.locationId];
    const schedule = formatSchedule(activity.scheduleId);
    const dateDisplay = getDateDisplay(activity);
    const neighborhood = activity.neighborhood || location?.neighborhood;
    const detailsAvailable = hasDetails(activity);
    const directionsUrl = getDirectionsUrl(location);

    return (
      <Grid item xs={12} sm={6} md={4} key={activity.id}>
        <Card
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: theme.shadows[8],
            },
            borderRadius: 2,
          }}
        >
          <CardContent sx={{ flexGrow: 1, p: 3 }}>
            <Typography 
              variant="h6" 
              component="h2" 
              gutterBottom
              sx={{ 
                color: theme.palette.primary.main,
                fontWeight: 600,
                mb: 2,
                minHeight: '3em',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {activity.title}
            </Typography>

            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <CategoryIcon sx={{ color: theme.palette.secondary.main }} />
                <Typography variant="body2" color="text.secondary">
                  {getCategoryName(activity.categoryId)}
                </Typography>
              </Stack>

              {neighborhood && (
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1 }}>
                    <PlaceIcon sx={{ color: theme.palette.secondary.main }} />
                    <Typography variant="body2" color="text.secondary">
                      {neighborhood}, {activity.city.charAt(0).toUpperCase() + activity.city.slice(1)}
                    </Typography>
                  </Stack>
                  {directionsUrl && (
                    <Tooltip title="Get Directions">
                      <IconButton
                        size="small"
                        href={directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ color: theme.palette.primary.main }}
                      >
                        <DirectionsIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </Stack>
              )}

              {dateDisplay && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <CalendarTodayIcon sx={{ color: theme.palette.secondary.main }} />
                  <Typography variant="body2" color="text.secondary">
                    {dateDisplay}
                  </Typography>
                </Stack>
              )}

              {schedule?.days && !dateDisplay && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <CalendarTodayIcon sx={{ color: theme.palette.secondary.main }} />
                  <Typography variant="body2" color="text.secondary">
                    {schedule.days}
                  </Typography>
                </Stack>
              )}

              {schedule?.times && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <AccessTimeIcon sx={{ color: theme.palette.secondary.main }} />
                  <Typography variant="body2" color="text.secondary">
                    {schedule.times}
                  </Typography>
                </Stack>
              )}

              <Stack direction="row" spacing={1} alignItems="center">
                <AttachMoneyIcon sx={{ color: theme.palette.secondary.main }} />
                <Chip
                  label={getPriceDisplay(activity.priceId)}
                  size="small"
                  color={getPriceRangeColor(activity.priceId)}
                  sx={{ 
                    borderRadius: '16px',
                    fontWeight: 600,
                    '& .MuiChip-label': {
                      px: 2
                    },
                    boxShadow: 1
                  }}
                />
              </Stack>
            </Stack>

            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mt: 2,
                mb: 2,
                minHeight: '4.5em',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {activity.description}
            </Typography>

            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {activity.tags.map(tag => (
                <Chip
                  key={tag}
                  label={tag.trim()}
                  size="small"
                  sx={{ 
                    borderRadius: 1,
                    backgroundColor: theme.palette.grey[100],
                    color: theme.palette.text.secondary,
                    '& .MuiChip-label': {
                      px: 1
                    }
                  }}
                />
              ))}
            </Box>
          </CardContent>
          <CardActions sx={{ p: 2, pt: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              size="large"
              variant="outlined"
              fullWidth
              href={detailsAvailable ? `/activity/${activity.id}` : undefined}
              disabled={!detailsAvailable}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                opacity: detailsAvailable ? 1 : 0.6,
                '&.Mui-disabled': {
                  backgroundColor: theme.palette.grey[100],
                  color: theme.palette.text.secondary,
                }
              }}
            >
              {detailsAvailable ? 'View Details' : 'No Details Available'}
            </Button>
            <Box 
              component="a" 
              href={activity.website}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: theme.palette.primary.main,
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                mt: 1,
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Visit Website
            </Box>
          </CardActions>
        </Card>
      </Grid>
    );
  };

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>Loading Activities...</Typography>
        <Typography color="text.secondary">Please wait while we fetch the latest activities.</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h5" color="error" gutterBottom>Error Loading Activities</Typography>
          <Typography color="text.secondary" paragraph>{error}</Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 4, mb: 4, borderRadius: 2, backgroundColor: theme.palette.background.paper }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
            Discover Activities
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search activities"
              placeholder="Type to search..."
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              helperText="Search by title, description, location, or tags"
              sx={{ backgroundColor: 'white' }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Category"
                onChange={(e) => setSelectedCategory(e.target.value)}
                sx={{ backgroundColor: 'white' }}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categoryOptions.filter(id => id !== 'all').map(categoryId => (
                  <MenuItem key={categoryId} value={categoryId}>
                    {getCategoryName(categoryId)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>City</InputLabel>
              <Select
                value={selectedCity}
                label="City"
                onChange={(e) => setSelectedCity(e.target.value)}
                sx={{ backgroundColor: 'white' }}
              >
                <MenuItem value="all">All Cities</MenuItem>
                <MenuItem value="toronto">Toronto</MenuItem>
                <MenuItem value="montreal">Montreal</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Neighborhood</InputLabel>
              <Select
                value={selectedNeighborhood}
                label="Neighborhood"
                onChange={(e) => setSelectedNeighborhood(e.target.value)}
                sx={{ backgroundColor: 'white' }}
              >
                <MenuItem value="all">All Neighborhoods</MenuItem>
                {neighborhoods
                  .filter(n => n !== 'all')
                  .filter(neighborhood => {
                    if (selectedCity === 'all') return true;
                    return activities.some(activity => 
                      activity.city === selectedCity && 
                      (activity.neighborhood === neighborhood || 
                       locations[activity.locationId]?.neighborhood === neighborhood)
                    );
                  })
                  .map(neighborhood => (
                    <MenuItem key={neighborhood} value={neighborhood}>
                      {neighborhood}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Price Range</InputLabel>
              <Select
                value={selectedPrice}
                label="Price Range"
                onChange={(e) => setSelectedPrice(e.target.value)}
                sx={{ backgroundColor: 'white' }}
              >
                <MenuItem value="all">All Prices</MenuItem>
                {priceOptions.filter(id => id !== 'all').map(priceId => (
                  <MenuItem key={priceId} value={priceId}>
                    {getPriceDisplay(priceId)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Stack spacing={2}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: { backgroundColor: 'white' }
                    }
                  }}
                />
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  minDate={startDate || undefined}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: { backgroundColor: 'white' }
                    }
                  }}
                />
              </Stack>
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="outlined"
              onClick={() => {
                setStartDate(null);
                setEndDate(null);
                setSelectedCategory('all');
                setSelectedPrice('all');
                setSelectedNeighborhood('all');
                setSearchTerm('');
              }}
              sx={{ mt: 1 }}
            >
              Clear All Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}>
          {filteredActivities.length} activities found
          {selectedCity !== 'all' && ` in ${selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}`}
          {selectedNeighborhood !== 'all' && ` - ${selectedNeighborhood}`}
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {filteredActivities.map(renderActivityCard)}
      </Grid>

      {filteredActivities.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No activities found matching your criteria
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Try adjusting your filters or search terms
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Activities; 