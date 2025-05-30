import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
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
import Section from '../components/Section';
import MinimalistCard from '../components/MinimalistCard';

const Activities = () => {
  const [searchParams] = useSearchParams();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [locations, setLocations] = useState<{ [key: string]: Location }>({});
  const [categories, setCategories] = useState<{ [key: string]: Category }>({});
  const [prices, setPrices] = useState<{ [key: string]: Price }>({});
  const [schedules, setSchedules] = useState<{ [key: string]: Schedule }>({});
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city')?.toLowerCase() || 'all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('all');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

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

  const getPriceDisplay = (priceId: string) => {
    const price = prices[priceId];
    if (!price) return `Price ID ${priceId}`;
    
    if (price.type === 'FREE') return 'Free';
    if (price.type === 'PAID') return `$${price.amount}`;
    if (price.type === 'SPECIAL') return price.notes || 'Special';
    return 'Check website';
  };

  const getCategoryName = (categoryId: string) => {
    return categories[categoryId]?.name || `Category ${categoryId}`;
  };

  const formatSchedule = (scheduleId: string) => {
    const schedule = schedules[scheduleId];
    if (!schedule) return '';
    
    const days = schedule.daysOfWeek?.split('|').join(', ') || '';
    const time = schedule.timeSlots || '';
    return `${days}: ${time}`;
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
    if (activity.start_date && activity.end_date) {
      return `${formatDate(activity.start_date)} - ${formatDate(activity.end_date)}`;
    } else if (activity.start_date) {
      return `From ${formatDate(activity.start_date)}`;
    }
    return '';
  };

  const hasDetails = (activity: Activity) => {
    return activity.description.trim().length > 50 || 
           activity.tags.length > 0 || 
           activity.scheduleId;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedCity('all');
    setSelectedPrice('all');
    setSelectedNeighborhood('all');
    setStartDate(null);
    setEndDate(null);
  };

  const hasActiveFilters = searchTerm || 
    selectedCategory !== 'all' || 
    selectedCity !== 'all' || 
    selectedPrice !== 'all' || 
    selectedNeighborhood !== 'all' || 
    startDate || 
    endDate;

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh' 
      }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error">
          <Typography variant="h6" gutterBottom>
            Error Loading Activities
          </Typography>
          <Typography>{error}</Typography>
        </Alert>
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
            Activities & Attractions
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'text.secondary',
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Discover the best experiences Toronto has to offer
          </Typography>
        </Container>
      </Box>

      {/* Search and Filters */}
      <Box sx={{ bgcolor: 'background.paper', py: 1.5 }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          {/* Search Bar */}
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              placeholder="Search activities, neighborhoods, or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setSearchTerm('')} size="small">
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'background.paper',
                  borderRadius: 3,
                },
              }}
            />
          </Box>

          {/* Filter Toggle */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Button
              startIcon={<FilterListIcon />}
              onClick={() => setShowFilters(!showFilters)}
              variant={showFilters ? 'contained' : 'outlined'}
              size="small"
              sx={{ borderRadius: 2 }}
            >
              Filters {hasActiveFilters && `(${Object.values({
                searchTerm: !!searchTerm,
                category: selectedCategory !== 'all',
                city: selectedCity !== 'all',
                price: selectedPrice !== 'all',
                neighborhood: selectedNeighborhood !== 'all',
                dates: !!(startDate || endDate)
              }).filter(Boolean).length})`}
            </Button>
            
            {hasActiveFilters && (
              <Button
                startIcon={<ClearIcon />}
                onClick={clearFilters}
                variant="text"
                color="secondary"
                size="small"
              >
                Clear Filters
              </Button>
            )}
          </Box>

          {/* Filters Panel */}
          {showFilters && (
            <Paper sx={{ p: 2, borderRadius: 3, mb: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      label="Category"
                    >
                      <MenuItem value="all">All Categories</MenuItem>
                      {categoryOptions.slice(1).map(categoryId => (
                        <MenuItem key={categoryId} value={categoryId}>
                          {getCategoryName(categoryId)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Neighborhood</InputLabel>
                    <Select
                      value={selectedNeighborhood}
                      onChange={(e) => setSelectedNeighborhood(e.target.value)}
                      label="Neighborhood"
                    >
                      <MenuItem value="all">All Neighborhoods</MenuItem>
                      {neighborhoods.slice(1).map(neighborhood => (
                        <MenuItem key={neighborhood} value={neighborhood}>
                          {neighborhood}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Price Range</InputLabel>
                    <Select
                      value={selectedPrice}
                      onChange={(e) => setSelectedPrice(e.target.value)}
                      label="Price Range"
                    >
                      <MenuItem value="all">All Prices</MenuItem>
                      {priceOptions.slice(1).map(priceId => (
                        <MenuItem key={priceId} value={priceId}>
                          {getPriceDisplay(priceId)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>City</InputLabel>
                    <Select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      label="City"
                    >
                      <MenuItem value="all">All Cities</MenuItem>
                      {[...new Set(activities.map(a => a.city))].map(city => (
                        <MenuItem key={city} value={city.toLowerCase()}>
                          {city}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Start Date"
                      value={startDate}
                      onChange={setStartDate}
                      slotProps={{ textField: { size: 'small', fullWidth: true } }}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="End Date"
                      value={endDate}
                      onChange={setEndDate}
                      slotProps={{ textField: { size: 'small', fullWidth: true } }}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </Paper>
          )}

          {/* Results Summary */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {filteredActivities.length} {filteredActivities.length === 1 ? 'activity' : 'activities'} found
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Activities Grid */}
      <Section
        title=""
        backgroundColor="background.default"
        spacing="compact"
      >
        {filteredActivities.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <LocalActivityIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No activities found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search terms or filters
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {filteredActivities.map((activity) => {
              const location = locations[activity.locationId];
              const priceDisplay = getPriceDisplay(activity.priceId);
              const categoryName = getCategoryName(activity.categoryId);
              const schedule = activity.scheduleId ? formatSchedule(activity.scheduleId) : '';
              const dateDisplay = getDateDisplay(activity);
              
              const features = [
                priceDisplay,
                categoryName,
                activity.neighborhood || location?.neighborhood,
                schedule,
                dateDisplay,
                ...activity.tags
              ].filter(Boolean).slice(0, 4);

              return (
                <Grid item xs={12} sm={6} lg={4} key={activity.id}>
                  <MinimalistCard
                    title={activity.title}
                    description={activity.description}
                    features={features}
                    icon={<LocalActivityIcon />}
                    to={hasDetails(activity) ? `/activity/${activity.id}` : undefined}
                    color="secondary"
                    variant="default"
                  />
                </Grid>
              );
            })}
          </Grid>
        )}
      </Section>
    </Box>
  );
};

export default Activities; 