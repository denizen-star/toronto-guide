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
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import PublicIcon from '@mui/icons-material/Public';
import StarIcon from '@mui/icons-material/Star';

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
  website?: string;
}

// Expanded mock data - replace with actual data loader
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
    venueType: 'Cocktail Bar',
    tags: ['Cocktails', 'Rooftop', 'Views', 'After Work'],
    website: 'www.rooftopbar.com'
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
    venueType: 'Gastropub',
    tags: ['Beer', 'Food', 'Casual', 'Sports'],
    website: 'www.gastropub.ca'
  },
  {
    id: '3',
    venueName: 'Wine & Tapas',
    description: 'Elegant wine bar featuring Spanish tapas and extensive wine list',
    neighborhood: 'Yorkville',
    timeSlot: '5:00 PM - 8:00 PM',
    day: 'Tuesday-Saturday',
    offerings: '25% off wine by glass, $8 tapas',
    priceRange: '$8-20',
    venueType: 'Wine Bar',
    tags: ['Wine', 'Tapas', 'Upscale', 'Date Night'],
    website: 'www.winetapas.com'
  },
  {
    id: '4',
    venueName: 'Sports Central',
    description: 'Lively sports bar with multiple screens and game day specials',
    neighborhood: 'Entertainment District',
    timeSlot: '4:00 PM - 7:00 PM',
    day: 'Monday-Friday',
    offerings: '$4 beer, $10 wings, $6 shots',
    priceRange: '$4-10',
    venueType: 'Sports Bar',
    tags: ['Sports', 'Beer', 'Wings', 'Groups'],
    website: 'www.sportscentral.ca'
  },
  {
    id: '5',
    venueName: 'Craft Corner',
    description: 'Local craft brewery with rotating taps and artisanal snacks',
    neighborhood: 'Ossington',
    timeSlot: '3:00 PM - 6:00 PM',
    day: 'Wednesday-Sunday',
    offerings: '$7 craft beer, $5 house wine, $12 charcuterie',
    priceRange: '$5-15',
    venueType: 'Brewery',
    tags: ['Craft Beer', 'Local', 'Artisanal', 'Trendy'],
    website: 'www.craftcorner.com'
  },
  {
    id: '6',
    venueName: 'Waterfront Lounge',
    description: 'Harbourfront venue with lake views and fresh seafood',
    neighborhood: 'Harbourfront',
    timeSlot: '4:30 PM - 7:30 PM',
    day: 'Friday-Sunday',
    offerings: '$9 cocktails, $15 seafood platters, $7 wine',
    priceRange: '$7-18',
    venueType: 'Lounge',
    tags: ['Views', 'Seafood', 'Cocktails', 'Weekend'],
    website: 'www.waterfrontlounge.ca'
  }
];

const getVenueIcon = (venueType: string) => {
  const type = venueType.toLowerCase();
  
  if (type.includes('cocktail') || type.includes('lounge')) {
    return <LocalBarIcon sx={{ fontSize: 60 }} />;
  }
  if (type.includes('wine')) {
    return <SportsBarIcon sx={{ fontSize: 60 }} />;
  }
  if (type.includes('restaurant') || type.includes('gastropub')) {
    return <LocalDiningIcon sx={{ fontSize: 60 }} />;
  }
  if (type.includes('sports')) {
    return <SportsBarIcon sx={{ fontSize: 60 }} />;
  }
  if (type.includes('brewery')) {
    return <LocalBarIcon sx={{ fontSize: 60 }} />;
  }
  return <RestaurantIcon sx={{ fontSize: 60 }} />;
};

// Helper function to get location area from neighborhood
const getHappyHourLocationArea = (neighborhood: string): string => {
  if (!neighborhood) return 'Various';
  const locationLower = neighborhood.toLowerCase();
  
  if (locationLower.includes('downtown') || locationLower.includes('financial district')) return 'Downtown';
  if (locationLower.includes('king west') || locationLower.includes('liberty village')) return 'King West';
  if (locationLower.includes('ossington') || locationLower.includes('trinity bellwoods')) return 'West End';
  if (locationLower.includes('beaches') || locationLower.includes('leslieville')) return 'East End';
  if (locationLower.includes('high park') || locationLower.includes('roncesvalles')) return 'High Park Area';
  if (locationLower.includes('harbourfront') || locationLower.includes('waterfront')) return 'Waterfront';
  if (locationLower.includes('distillery') || locationLower.includes('st. lawrence')) return 'Distillery District';
  if (locationLower.includes('entertainment') || locationLower.includes('theatre')) return 'Entertainment District';
  if (locationLower.includes('yorkville') || locationLower.includes('midtown')) return 'Midtown';
  if (locationLower.includes('church') || locationLower.includes('wellesley')) return 'Church-Wellesley';
  if (locationLower.includes('kensington') || locationLower.includes('chinatown')) return 'Kensington/Chinatown';
  
  return 'Other Areas';
};

// Helper function to get venue category based on type and offerings
const getVenueCategory = (hh: HappyHour): string => {
  const type = hh.venueType.toLowerCase();
  const offerings = hh.offerings.toLowerCase();
  const tags = hh.tags.join(' ').toLowerCase();
  
  if (type.includes('cocktail') || type.includes('lounge')) return 'Cocktail Bars';
  if (type.includes('wine')) return 'Wine Bars';
  if (type.includes('sports') || tags.includes('sports')) return 'Sports Bars';
  if (type.includes('brewery') || tags.includes('craft beer')) return 'Breweries';
  if (type.includes('gastropub') || type.includes('restaurant')) return 'Restaurants & Pubs';
  if (offerings.includes('food') || tags.includes('food')) return 'Food Focused';
  
  return 'Other Venues';
};

// Helper function to get time category
const getTimeCategory = (timeSlot: string): string => {
  if (timeSlot.includes('3:00') || timeSlot.includes('3:30')) return 'Early (3-4 PM)';
  if (timeSlot.includes('4:00') || timeSlot.includes('4:30')) return 'Standard (4-5 PM)';
  if (timeSlot.includes('5:00') || timeSlot.includes('5:30')) return 'Evening (5-6 PM)';
  if (timeSlot.includes('6:00') || timeSlot.includes('7:00') || timeSlot.includes('8:00')) return 'Late (6-8 PM)';
  return 'All Day';
};

// Helper function to get price category
const getPriceCategory = (priceRange: string): string => {
  if (!priceRange) return 'Ask Venue';
  
  // Extract lowest price from range
  const match = priceRange.match(/\$(\d+)/);
  if (match) {
    const lowPrice = parseInt(match[1]);
    if (lowPrice <= 5) return 'Budget ($5 and under)';
    if (lowPrice <= 10) return 'Moderate ($6-10)';
    if (lowPrice <= 15) return 'Higher ($11-15)';
    return 'Premium ($15+)';
  }
  
  return 'Ask Venue';
};

const HappyHours = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = React.useState(searchParams.get('search') || '');
  const [happyHours, setHappyHours] = useState<HappyHour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states - updated to arrays for multi-select following SpecialEvents pattern
  const [selectedVenueType, setSelectedVenueType] = React.useState<string[]>([]);
  const [selectedVenueCategory, setSelectedVenueCategory] = React.useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = React.useState<string[]>([]);
  const [selectedTimeCategory, setSelectedTimeCategory] = React.useState<string[]>([]);
  const [selectedPriceCategory, setSelectedPriceCategory] = React.useState<string[]>([]);
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
    const venueTypes = new Set<string>();
    const venueCategories = new Set<string>();
    const locations = new Set<string>();
    const timeCategories = new Set<string>();
    const priceCategories = new Set<string>();
    const tags = new Set<string>();
    
    happyHours.forEach(hh => {
      venueTypes.add(hh.venueType);
      venueCategories.add(getVenueCategory(hh));
      locations.add(getHappyHourLocationArea(hh.neighborhood));
      timeCategories.add(getTimeCategory(hh.timeSlot));
      priceCategories.add(getPriceCategory(hh.priceRange));
      hh.tags.forEach(tag => tags.add(tag));
    });
    
    return {
      venueTypes: Array.from(venueTypes).sort(),
      venueCategories: Array.from(venueCategories).sort(),
      locations: Array.from(locations).sort(),
      timeCategories: Array.from(timeCategories).sort(),
      priceCategories: Array.from(priceCategories).sort(),
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
    const matchesVenueType = selectedVenueType.length === 0 || selectedVenueType.includes(hh.venueType);
    const matchesVenueCategory = selectedVenueCategory.length === 0 || selectedVenueCategory.includes(getVenueCategory(hh));
    const matchesLocation = selectedLocation.length === 0 || selectedLocation.includes(getHappyHourLocationArea(hh.neighborhood));
    const matchesTimeCategory = selectedTimeCategory.length === 0 || selectedTimeCategory.includes(getTimeCategory(hh.timeSlot));
    const matchesPriceCategory = selectedPriceCategory.length === 0 || selectedPriceCategory.includes(getPriceCategory(hh.priceRange));
    const matchesTag = selectedTag.length === 0 || hh.tags.some(tag => selectedTag.includes(tag));
    
    return matchesSearch && matchesVenueType && matchesVenueCategory && matchesLocation && matchesTimeCategory && matchesPriceCategory && matchesTag;
  });

  const handleTagClick = (tag: string) => {
    if (selectedTag.includes(tag)) {
      setSelectedTag(selectedTag.filter((t) => t !== tag));
    } else {
      setSelectedTag([...selectedTag, tag]);
    }
  };

  const clearAllFilters = () => {
    setSelectedVenueType([]);
    setSelectedVenueCategory([]);
    setSelectedLocation([]);
    setSelectedTimeCategory([]);
    setSelectedPriceCategory([]);
    setSelectedTag([]);
    setSearchQuery('');
  };

  const activeFiltersCount = [
    selectedVenueType.length > 0,
    selectedVenueCategory.length > 0,
    selectedLocation.length > 0,
    selectedTimeCategory.length > 0,
    selectedPriceCategory.length > 0,
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
      {/* Header Section */}
      <Box sx={{ 
        bgcolor: '#0A0F1C',
        py: { xs: 2.5, md: 3 },
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 120,
          height: 120,
          border: '1px solid rgba(255, 152, 0, 0.4)',
          borderRadius: '50%',
          animation: 'orbit-ring 6s linear infinite',
          '@keyframes orbit-ring': {
            '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
            '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' },
          },
          zIndex: 1,
        }
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ 
            textAlign: 'center',
            maxWidth: '500px',
            mx: 'auto',
          }}>
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1.5,
              position: 'relative',
            }}>
              <StarIcon sx={{ 
                fontSize: 10,
                color: '#FF9800',
                position: 'absolute',
                animation: 'orbit1 5s linear infinite',
                transformOrigin: '0 18px',
                '@keyframes orbit1': {
                  '0%': { transform: 'rotate(0deg) translateX(20px) rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg) translateX(20px) rotate(-360deg)' },
                },
              }} />
              <StarIcon sx={{ 
                fontSize: 7,
                color: '#FFB74D',
                position: 'absolute',
                animation: 'orbit2 3s linear infinite reverse',
                transformOrigin: '0 12px',
                '@keyframes orbit2': {
                  '0%': { transform: 'rotate(0deg) translateX(14px) rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg) translateX(14px) rotate(-360deg)' },
                },
              }} />
              <LocalBarIcon sx={{ 
                fontSize: 28,
                background: 'linear-gradient(45deg, #FF9800, #FFB74D, #FFCC80)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 8px rgba(255, 152, 0, 0.6))',
                position: 'relative',
                zIndex: 2,
                mr: 1,
              }} />
              <SportsBarIcon sx={{ 
                fontSize: 24,
                background: 'linear-gradient(45deg, #FFB74D, #FFCC80, #FFE0B2)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 6px rgba(255, 183, 77, 0.5))',
                position: 'relative',
                zIndex: 2,
                transform: 'rotate(-10deg)',
              }} />
            </Box>
            
            <Typography 
              variant="h4"
              component="h1"
              sx={{ 
                mb: 0.5,
                fontWeight: 700,
                fontSize: { xs: 1.6 * 16, md: 2 * 16 },
                letterSpacing: '0.03em',
                fontFamily: '"Quicksand", sans-serif',
                background: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 50%, #FFCC80 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 8px rgba(255, 152, 0, 0.5))',
                animation: 'hologram 2.5s ease-in-out infinite',
                '@keyframes hologram': {
                  '0%, 100%': { transform: 'translateY(0px)' },
                  '50%': { transform: 'translateY(-1px)' },
                },
              }}
            >
              Happy Hours & After-Work Spots
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#FFE0B2',
                fontWeight: 300,
                lineHeight: 1.4,
                fontSize: 14,
              }}
            >
              Unwind with Toronto's best happy hour deals, rooftop patios, and after-work destinations
            </Typography>
          </Box>
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
              <Grid item xs={12} sm={6} md={2}>
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
              
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={selectedVenueCategory}
                    onChange={(e) => setSelectedVenueCategory(e.target.value as string[])}
                    label="Category"
                    multiple
                    renderValue={(selected) => 
                      selected.length === 0 ? 'All Categories' : 
                      selected.length === 1 ? selected[0] : `${selected.length} categories`
                    }
                  >
                    {filterOptions.venueCategories.map((category) => (
                      <MenuItem key={category} value={category}>
                        <Checkbox checked={selectedVenueCategory.includes(category)} />
                        <ListItemText primary={category} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Location</InputLabel>
                  <Select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value as string[])}
                    label="Location"
                    multiple
                    renderValue={(selected) => 
                      selected.length === 0 ? 'All Areas' : 
                      selected.length === 1 ? selected[0] : `${selected.length} areas`
                    }
                  >
                    {filterOptions.locations.map((location) => (
                      <MenuItem key={location} value={location}>
                        <Checkbox checked={selectedLocation.includes(location)} />
                        <ListItemText primary={location} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
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

              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Price Range</InputLabel>
                  <Select
                    value={selectedPriceCategory}
                    onChange={(e) => setSelectedPriceCategory(e.target.value as string[])}
                    label="Price Range"
                    multiple
                    renderValue={(selected) => 
                      selected.length === 0 ? 'All Prices' : 
                      selected.length === 1 ? selected[0] : `${selected.length} ranges`
                    }
                  >
                    {filterOptions.priceCategories.map((category) => (
                      <MenuItem key={category} value={category}>
                        <Checkbox checked={selectedPriceCategory.includes(category)} />
                        <ListItemText primary={category} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
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
              {selectedVenueType.length > 0 && (
                <Chip
                  label={`Type: ${selectedVenueType.join(', ')}`}
                  size="small"
                  onDelete={() => setSelectedVenueType([])}
                  color="primary"
                  variant="outlined"
                />
              )}
              {selectedVenueCategory.length > 0 && (
                <Chip
                  label={`Category: ${selectedVenueCategory.join(', ')}`}
                  size="small"
                  onDelete={() => setSelectedVenueCategory([])}
                  color="primary"
                  variant="outlined"
                />
              )}
              {selectedLocation.length > 0 && (
                <Chip
                  label={`Area: ${selectedLocation.join(', ')}`}
                  size="small"
                  onDelete={() => setSelectedLocation([])}
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
              {selectedPriceCategory.length > 0 && (
                <Chip
                  label={`Price: ${selectedPriceCategory.join(', ')}`}
                  size="small"
                  onDelete={() => setSelectedPriceCategory([])}
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
          {/* Results Count */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" color="text.secondary">
              {filteredHappyHours.length} venues available
            </Typography>
          </Box>

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
                      <Chip
                        label={getVenueCategory(hh)}
                        size="small"
                        color="secondary"
                        sx={{ mb: 0.5 }}
                      />
                      {hh.tags.slice(0, 3).map((tag, tagIndex) => (
                        <Chip
                          key={tagIndex}
                          label={tag}
                          size="small"
                          color={selectedTag.includes(tag) ? 'primary' : 'default'}
                          variant={selectedTag.includes(tag) ? 'filled' : 'outlined'}
                          onClick={() => handleTagClick(tag)}
                          sx={{
                            cursor: 'pointer',
                            mb: 0.5,
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
                    
                    {hh.website && (
                      <Box 
                        component="a" 
                        href={hh.website.startsWith('http') ? hh.website : `https://${hh.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          color: 'primary.main',
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
                        <PublicIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
                        Visit Website
                      </Box>
                    )}
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