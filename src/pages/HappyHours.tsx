import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { Link as RouterLink } from 'react-router-dom';

// Mock data structure for happy hours (you'll replace this with actual data loading)
interface HappyHour {
  id: string;
  venueName: string;
  description: string;
  neighborhood: string;
  timeSlot: string;
  day: string;
  offerings: string;
  priceRange: string;
  venueType: string;
  tags: string[];
}

// Mock data - replace with actual data loader
const mockHappyHours: HappyHour[] = [
  {
    id: '1',
    venueName: 'The Rooftop Bar',
    description: 'Downtown rooftop bar with stunning city views and craft cocktails',
    neighborhood: 'Downtown',
    timeSlot: '4:00 PM - 7:00 PM',
    day: 'Monday-Friday',
    offerings: '$6 beer, $8 cocktails, half-price appetizers',
    priceRange: '$6-15',
    venueType: 'Bar',
    tags: ['Cocktails', 'Rooftop', 'Views', 'After Work']
  },
  {
    id: '2',
    venueName: 'Gastropub & Grill',
    description: 'Cozy gastropub with extensive beer selection and comfort food',
    neighborhood: 'King West',
    timeSlot: '3:00 PM - 6:00 PM',
    day: 'Daily',
    offerings: '$5 pints, $12 wine, discounted wings',
    priceRange: '$5-12',
    venueType: 'Restaurant',
    tags: ['Beer', 'Food', 'Casual', 'Sports']
  },
  // Add more mock data as needed
];

const getVenueIcon = (venueType: string) => {
  switch (venueType.toLowerCase()) {
    case 'bar':
    case 'cocktail bar':
      return <LocalBarIcon sx={{ fontSize: 60 }} />;
    case 'restaurant':
      return <AttachMoneyIcon sx={{ fontSize: 60 }} />;
    default:
      return <LocalBarIcon sx={{ fontSize: 60 }} />;
  }
};

const getTimeCategory = (timeSlot: string): string => {
  if (timeSlot.includes('3:00') || timeSlot.includes('4:00')) return 'Early (3-4 PM)';
  if (timeSlot.includes('5:00') || timeSlot.includes('6:00')) return 'Standard (5-6 PM)';
  if (timeSlot.includes('7:00') || timeSlot.includes('8:00')) return 'Late (7-8 PM)';
  return 'All Day';
};

const HappyHours = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = React.useState(searchParams.get('search') || '');
  const [happyHours, setHappyHours] = useState<HappyHour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [selectedNeighborhood, setSelectedNeighborhood] = React.useState<string[]>([]);
  const [selectedTimeCategory, setSelectedTimeCategory] = React.useState<string[]>([]);
  const [selectedDay, setSelectedDay] = React.useState<string[]>([]);
  const [selectedVenueType, setSelectedVenueType] = React.useState<string[]>([]);
  const [selectedTag, setSelectedTag] = React.useState<string[]>([]);

  useEffect(() => {
    // Simulate loading data - replace with actual data loading
    const fetchData = async () => {
      try {
        setHappyHours(mockHappyHours);
        setLoading(false);
      } catch (err) {
        setError('Failed to load happy hours data');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Get all unique values for filters
  const filterOptions = React.useMemo(() => {
    const neighborhoods = new Set<string>();
    const days = new Set<string>();
    const venueTypes = new Set<string>();
    const timeCategories = new Set<string>();
    const tags = new Set<string>();
    
    happyHours.forEach(hh => {
      neighborhoods.add(hh.neighborhood);
      days.add(hh.day);
      venueTypes.add(hh.venueType);
      timeCategories.add(getTimeCategory(hh.timeSlot));
      hh.tags.forEach(tag => tags.add(tag));
    });
    
    return {
      neighborhoods: Array.from(neighborhoods).sort(),
      days: Array.from(days).sort(),
      venueTypes: Array.from(venueTypes).sort(),
      timeCategories: Array.from(timeCategories).sort(),
      tags: Array.from(tags).sort(),
    };
  }, [happyHours]);

  const filteredHappyHours = happyHours.filter(hh => {
    // Search filter
    const matchesSearch = 
      hh.venueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hh.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hh.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Other filters
    const matchesNeighborhood = selectedNeighborhood.length === 0 || selectedNeighborhood.includes(hh.neighborhood);
    const matchesTimeCategory = selectedTimeCategory.length === 0 || selectedTimeCategory.includes(getTimeCategory(hh.timeSlot));
    const matchesDay = selectedDay.length === 0 || selectedDay.some(day => hh.day.includes(day));
    const matchesVenueType = selectedVenueType.length === 0 || selectedVenueType.includes(hh.venueType);
    const matchesTag = selectedTag.length === 0 || hh.tags.some(tag => selectedTag.includes(tag));
    
    return matchesSearch && matchesNeighborhood && matchesTimeCategory && matchesDay && matchesVenueType && matchesTag;
  });

  const clearAllFilters = () => {
    setSelectedNeighborhood([]);
    setSelectedTimeCategory([]);
    setSelectedDay([]);
    setSelectedVenueType([]);
    setSelectedTag([]);
    setSearchQuery('');
  };

  const activeFiltersCount = [
    selectedNeighborhood.length > 0,
    selectedTimeCategory.length > 0,
    selectedDay.length > 0,
    selectedVenueType.length > 0,
    selectedTag.length > 0,
    searchQuery !== ''
  ].filter(Boolean).length;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Typography color="error">{error}</Typography>
      </Box>
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
            Toronto Happy Hours
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'text.secondary',
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Discover the best happy hour deals and after-work spots in the city
          </Typography>
        </Container>
      </Box>

      {/* Search and Filters */}
      <Box sx={{ bgcolor: 'background.paper', py: 2 }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          {/* Search Bar */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
            <TextField
              placeholder="Search venues, neighborhoods, or offerings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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

          {/* Filter Controls */}
          <Box sx={{ mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={2.4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Neighborhood</InputLabel>
                  <Select
                    value={selectedNeighborhood}
                    onChange={(e) => setSelectedNeighborhood(e.target.value as string[])}
                    label="Neighborhood"
                    multiple
                    renderValue={(selected) => 
                      selected.length === 0 ? 'All Areas' : 
                      selected.length === 1 ? selected[0] : `${selected.length} areas`
                    }
                  >
                    {filterOptions.neighborhoods.map((neighborhood) => (
                      <MenuItem key={neighborhood} value={neighborhood}>
                        <Checkbox checked={selectedNeighborhood.includes(neighborhood)} />
                        <ListItemText primary={neighborhood} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2.4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Time</InputLabel>
                  <Select
                    value={selectedTimeCategory}
                    onChange={(e) => setSelectedTimeCategory(e.target.value as string[])}
                    label="Time"
                    multiple
                    renderValue={(selected) => 
                      selected.length === 0 ? 'Any Time' : 
                      selected.length === 1 ? selected[0] : `${selected.length} times`
                    }
                  >
                    {filterOptions.timeCategories.map((category) => (
                      <MenuItem key={category} value={category}>
                        <Checkbox checked={selectedTimeCategory.includes(category)} />
                        <ListItemText primary={category} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={2.4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Days</InputLabel>
                  <Select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value as string[])}
                    label="Days"
                    multiple
                    renderValue={(selected) => 
                      selected.length === 0 ? 'All Days' : 
                      selected.length === 1 ? selected[0] : `${selected.length} options`
                    }
                  >
                    {filterOptions.days.map((day) => (
                      <MenuItem key={day} value={day}>
                        <Checkbox checked={selectedDay.includes(day)} />
                        <ListItemText primary={day} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={2.4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Venue Type</InputLabel>
                  <Select
                    value={selectedVenueType}
                    onChange={(e) => setSelectedVenueType(e.target.value as string[])}
                    label="Venue Type"
                    multiple
                    renderValue={(selected) => 
                      selected.length === 0 ? 'All Types' : 
                      selected.length === 1 ? selected[0] : `${selected.length} types`
                    }
                  >
                    {filterOptions.venueTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        <Checkbox checked={selectedVenueType.includes(type)} />
                        <ListItemText primary={type} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={2.4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Tags</InputLabel>
                  <Select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value as string[])}
                    label="Tags"
                    multiple
                    renderValue={(selected) => 
                      selected.length === 0 ? 'All Tags' : 
                      `${selected.length} tag${selected.length !== 1 ? 's' : ''}`
                    }
                  >
                    {filterOptions.tags.map((tag) => (
                      <MenuItem key={tag} value={tag}>
                        <Checkbox checked={selectedTag.includes(tag)} />
                        <ListItemText primary={tag} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                Active filters:
              </Typography>
              {searchQuery && (
                <Chip
                  label={`Search: "${searchQuery}"`}
                  size="small"
                  onDelete={() => setSearchQuery('')}
                  color="primary"
                  variant="outlined"
                />
              )}
              {selectedNeighborhood.length > 0 && (
                <Chip
                  label={`Area: ${selectedNeighborhood.join(', ')}`}
                  size="small"
                  onDelete={() => setSelectedNeighborhood([])}
                  color="primary"
                  variant="outlined"
                />
              )}
              {selectedTimeCategory.length > 0 && (
                <Chip
                  label={`Time: ${selectedTimeCategory.join(', ')}`}
                  size="small"
                  onDelete={() => setSelectedTimeCategory([])}
                  color="primary"
                  variant="outlined"
                />
              )}
              {selectedDay.length > 0 && (
                <Chip
                  label={`Days: ${selectedDay.join(', ')}`}
                  size="small"
                  onDelete={() => setSelectedDay([])}
                  color="primary"
                  variant="outlined"
                />
              )}
              {selectedVenueType.length > 0 && (
                <Chip
                  label={`Type: ${selectedVenueType.join(', ')}`}
                  size="small"
                  onDelete={() => setSelectedVenueType([])}
                  color="primary"
                  variant="outlined"
                />
              )}
              {selectedTag.length > 0 && (
                <Chip
                  label={`Tags: ${selectedTag.join(', ')}`}
                  size="small"
                  onDelete={() => setSelectedTag([])}
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>
          )}

          {/* Results Summary */}
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {filteredHappyHours.length} {filteredHappyHours.length === 1 ? 'venue' : 'venues'} found
              {activeFiltersCount > 0 && (
                <> • <Button variant="text" size="small" onClick={clearAllFilters} sx={{ minWidth: 'auto', p: 0.5 }}>
                  Clear all filters
                </Button></>
              )}
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Happy Hours Grid */}
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {filteredHappyHours.map((hh) => (
              <Grid item xs={12} md={4} key={hh.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <Box
                    sx={{
                      height: 200,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'primary.main',
                      color: 'white',
                    }}
                  >
                    {getVenueIcon(hh.venueType)}
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {hh.venueName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {hh.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOnIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
                      <Typography variant="body2" color="text.secondary">
                        {hh.neighborhood}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AccessTimeIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
                      <Typography variant="body2" color="text.secondary">
                        {hh.timeSlot}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocalBarIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
                      <Typography variant="body2" color="text.secondary">
                        {hh.offerings}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {hh.tags.map((tag, tagIndex) => (
                        <Chip
                          key={tagIndex}
                          label={tag}
                          size="small"
                          color={selectedTag.includes(tag) ? 'primary' : 'default'}
                          variant={selectedTag.includes(tag) ? 'filled' : 'outlined'}
                          onClick={() => {
                            if (selectedTag.includes(tag)) {
                              setSelectedTag(selectedTag.filter(t => t !== tag));
                            } else {
                              setSelectedTag([...selectedTag, tag]);
                            }
                          }}
                          sx={{
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: selectedTag.includes(tag) 
                                ? 'primary.dark' 
                                : 'action.hover',
                            },
                          }}
                        />
                      ))}
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      <strong>Days:</strong> {hh.day}
                    </Typography>

                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ mt: 'auto' }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {filteredHappyHours.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No happy hours found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your filters to see more results.
              </Typography>
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default HappyHours; 