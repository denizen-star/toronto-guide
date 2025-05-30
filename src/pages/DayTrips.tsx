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
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import NatureIcon from '@mui/icons-material/Nature';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import HikingIcon from '@mui/icons-material/Hiking';
import WineBarIcon from '@mui/icons-material/WineBar';
import PublicIcon from '@mui/icons-material/Public';
import { Link as RouterLink } from 'react-router-dom';
import { DayTrip, loadDayTrips } from '../utils/dataLoader';
import StarIcon from '@mui/icons-material/Star';

const getTripIcon = (title: string, tags: string[]) => {
  const titleLower = title.toLowerCase();
  const allTags = tags.join(' ').toLowerCase();
  
  if (titleLower.includes('beach') || titleLower.includes('wasaga') || allTags.includes('beach')) {
    return <BeachAccessIcon sx={{ fontSize: 60 }} />;
  }
  if (titleLower.includes('wine') || titleLower.includes('county') || allTags.includes('wine')) {
    return <WineBarIcon sx={{ fontSize: 60 }} />;
  }
  if (titleLower.includes('mountain') || titleLower.includes('hiking') || allTags.includes('hiking')) {
    return <HikingIcon sx={{ fontSize: 60 }} />;
  }
  return <NatureIcon sx={{ fontSize: 60 }} />;
};

// Helper functions for filters
const extractTravelTimeValue = (travelTime: string): number => {
  if (!travelTime) return 0;
  const match = travelTime.match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
};

const getTripType = (trip: DayTrip): string => {
  const description = trip.description.toLowerCase();
  const tags = trip.tags.join(' ').toLowerCase();
  
  if (tags.includes('beach') || description.includes('beach')) return 'Beach & Water';
  if (tags.includes('wine') || description.includes('wine')) return 'Wine & Food';
  if (tags.includes('hiking') || tags.includes('nature') || description.includes('hiking')) return 'Nature & Outdoor';
  if (tags.includes('culture') || tags.includes('theatre') || tags.includes('history')) return 'Culture & Arts';
  if (tags.includes('city') || tags.includes('urban')) return 'Urban Exploration';
  if (tags.includes('adventure') || tags.includes('caves')) return 'Adventure Sports';
  return 'Other';
};

const getDistanceLabel = (distance: string): string => {
  switch (distance) {
    case 'short':
      return '≤ 2 hrs';
    case 'medium':
      return '2-3.5 hrs';
    case 'long':
      return '> 3.5 hrs';
    default:
      return '';
  }
};

const DayTrips = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = React.useState(searchParams.get('search') || '');
  const [dayTrips, setDayTrips] = useState<DayTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [selectedTag, setSelectedTag] = React.useState<string[]>([]);
  const [selectedDistance, setSelectedDistance] = React.useState<string[]>([]);
  const [selectedSeason, setSelectedSeason] = React.useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = React.useState<string[]>([]);
  const [selectedTripType, setSelectedTripType] = React.useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadDayTrips();
        setDayTrips(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load day trips data');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Get all unique values for filters
  const filterOptions = React.useMemo(() => {
    const tags = new Set<string>();
    const seasons = new Set<string>();
    const durations = new Set<string>();
    const tripTypes = new Set<string>();
    
    dayTrips.forEach(trip => {
      trip.tags.forEach(tag => tags.add(tag));
      seasons.add(trip.season);
      durations.add(trip.duration);
      tripTypes.add(getTripType(trip));
    });
    
    return {
      tags: Array.from(tags).sort(),
      seasons: Array.from(seasons).sort(),
      durations: Array.from(durations).sort(),
      tripTypes: Array.from(tripTypes).sort(),
    };
  }, [dayTrips]);

  const filteredTrips = dayTrips.filter(trip => {
    // Search filter
    const matchesSearch = 
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Tag filter
    const matchesTag = selectedTag.length === 0 || trip.tags.some(tag => selectedTag.includes(tag));
    
    // Distance filter
    let matchesDistance = true;
    if (selectedDistance.length > 0) {
      const travelTime = extractTravelTimeValue(trip.distance);
      matchesDistance = selectedDistance.includes(travelTime <= 2 ? 'short' : travelTime > 2 && travelTime <= 3.5 ? 'medium' : 'long');
    }
    
    // Season filter
    const matchesSeason = selectedSeason.length === 0 || selectedSeason.some(season => 
      trip.season.toLowerCase().includes(season.toLowerCase())
    );
    
    // Duration filter
    const matchesDuration = selectedDuration.length === 0 || selectedDuration.includes(trip.duration);
    
    // Trip type filter
    const matchesTripType = selectedTripType.length === 0 || selectedTripType.includes(getTripType(trip));
    
    return matchesSearch && matchesTag && matchesDistance && matchesSeason && matchesDuration && matchesTripType;
  });

  const handleTagClick = (tag: string) => {
    if (selectedTag.includes(tag)) {
      setSelectedTag(selectedTag.filter((t) => t !== tag));
    } else {
      setSelectedTag([...selectedTag, tag]);
    }
  };

  const clearAllFilters = () => {
    setSelectedTag([]);
    setSelectedDistance([]);
    setSelectedSeason([]);
    setSelectedDuration([]);
    setSelectedTripType([]);
    setSearchQuery('');
  };

  const activeFiltersCount = [
    selectedTag.length > 0,
    selectedDistance.length > 0,
    selectedSeason.length > 0,
    selectedDuration.length > 0,
    selectedTripType.length > 0,
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
          border: '1px solid rgba(0, 188, 212, 0.4)',
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
                color: '#00BCD4',
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
                color: '#4DD0E1',
                position: 'absolute',
                animation: 'orbit2 3s linear infinite reverse',
                transformOrigin: '0 12px',
                '@keyframes orbit2': {
                  '0%': { transform: 'rotate(0deg) translateX(14px) rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg) translateX(14px) rotate(-360deg)' },
                },
              }} />
              <DirectionsCarIcon sx={{ 
                fontSize: 28,
                background: 'linear-gradient(45deg, #00BCD4, #4DD0E1, #80DEEA)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 8px rgba(0, 188, 212, 0.6))',
                position: 'relative',
                zIndex: 2,
                mr: 1,
              }} />
              <NatureIcon sx={{ 
                fontSize: 24,
                background: 'linear-gradient(45deg, #4DD0E1, #80DEEA, #B2EBF2)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 6px rgba(77, 208, 225, 0.5))',
                position: 'relative',
                zIndex: 2,
                transform: 'rotate(-5deg)',
              }} />
            </Box>
            
            <Typography 
              variant="h4"
              component="h1"
              sx={{ 
                mb: 0.5,
                fontWeight: 700,
                fontSize: { xs: 1.6 * 16, md: 2 * 16 },
                letterSpacing: '0.01em',
                fontFamily: '"Open Sans", sans-serif',
                background: 'linear-gradient(135deg, #00BCD4 0%, #4DD0E1 50%, #80DEEA 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 8px rgba(0, 188, 212, 0.5))',
                animation: 'hologram 2.5s ease-in-out infinite',
                '@keyframes hologram': {
                  '0%, 100%': { transform: 'translateY(0px)' },
                  '50%': { transform: 'translateY(-1px)' },
                },
              }}
            >
              Day Trips & Weekend Getaways
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#B2EBF2',
                fontWeight: 300,
                lineHeight: 1.4,
                fontSize: 14,
              }}
            >
              Discover scenic escapes, charming towns, and outdoor adventures just hours from Toronto
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
              placeholder="Search day trips, destinations, or tags..."
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

          {/* Quick Filters */}
          <Box sx={{ mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={2.4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Distance</InputLabel>
                  <Select
                    value={selectedDistance}
                    onChange={(e) => setSelectedDistance(e.target.value as string[])}
                    label="Distance"
                    multiple
                    renderValue={(selected) => 
                      selected.length === 0 ? 'Any Distance' : 
                      selected.map(getDistanceLabel).join(', ')
                    }
                  >
                    <MenuItem value="short">
                      <Checkbox checked={selectedDistance.includes('short')} />
                      <ListItemText primary="≤ 2 hours" />
                    </MenuItem>
                    <MenuItem value="medium">
                      <Checkbox checked={selectedDistance.includes('medium')} />
                      <ListItemText primary="2-3.5 hours" />
                    </MenuItem>
                    <MenuItem value="long">
                      <Checkbox checked={selectedDistance.includes('long')} />
                      <ListItemText primary="> 3.5 hours" />
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2.4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Trip Type</InputLabel>
                  <Select
                    value={selectedTripType}
                    onChange={(e) => setSelectedTripType(e.target.value as string[])}
                    label="Trip Type"
                    multiple
                    renderValue={(selected) => 
                      selected.length === 0 ? 'All Types' : 
                      selected.join(', ')
                    }
                  >
                    {filterOptions.tripTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        <Checkbox checked={selectedTripType.includes(type)} />
                        <ListItemText primary={type} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={2.4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Season</InputLabel>
                  <Select
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(e.target.value as string[])}
                    label="Season"
                    multiple
                    renderValue={(selected) => 
                      selected.length === 0 ? 'Any Season' : 
                      selected.join(', ')
                    }
                  >
                    {filterOptions.seasons.map((season) => (
                      <MenuItem key={season} value={season}>
                        <Checkbox checked={selectedSeason.includes(season)} />
                        <ListItemText primary={season} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={2.4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Duration</InputLabel>
                  <Select
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(e.target.value as string[])}
                    label="Duration"
                    multiple
                    renderValue={(selected) => 
                      selected.length === 0 ? 'Any Duration' : 
                      selected.join(', ')
                    }
                  >
                    {filterOptions.durations.map((duration) => (
                      <MenuItem key={duration} value={duration}>
                        <Checkbox checked={selectedDuration.includes(duration)} />
                        <ListItemText primary={duration} />
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
              {selectedDistance.length > 0 && (
                <Chip
                  label={`Distance: ${selectedDistance.map(getDistanceLabel).join(', ')}`}
                  size="small"
                  onDelete={() => setSelectedDistance([])}
                  color="primary"
                  variant="outlined"
                />
              )}
              {selectedTripType.length > 0 && (
                <Chip
                  label={`Type: ${selectedTripType.join(', ')}`}
                  size="small"
                  onDelete={() => setSelectedTripType([])}
                  color="primary"
                  variant="outlined"
                />
              )}
              {selectedSeason.length > 0 && (
                <Chip
                  label={`Season: ${selectedSeason.join(', ')}`}
                  size="small"
                  onDelete={() => setSelectedSeason([])}
                  color="primary"
                  variant="outlined"
                />
              )}
              {selectedDuration.length > 0 && (
                <Chip
                  label={`Duration: ${selectedDuration.join(', ')}`}
                  size="small"
                  onDelete={() => setSelectedDuration([])}
                  color="primary"
                  variant="outlined"
                />
              )}
              {selectedTag.length > 0 && (
                <Chip
                  label={`Tag: ${selectedTag.join(', ')}`}
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
              {filteredTrips.length} {filteredTrips.length === 1 ? 'trip' : 'trips'} found
              {activeFiltersCount > 0 && (
                <> • <Button variant="text" size="small" onClick={clearAllFilters} sx={{ minWidth: 'auto', p: 0.5 }}>
                  Clear all filters
                </Button></>
              )}
            </Typography>
          </Box>
        </Container>
      </Box>

      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          {/* Results Count */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" color="text.secondary">
              {filteredTrips.length} trips available
            </Typography>
          </Box>

          {/* Day Trips Grid */}
          <Grid container spacing={3}>
            {filteredTrips.map((trip) => (
              <Grid item xs={12} md={4} key={trip.id}>
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
                    {getTripIcon(trip.title, trip.tags)}
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {trip.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {trip.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <DirectionsCarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {trip.distance}
                      </Typography>
                      <CalendarTodayIcon sx={{ ml: 2, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {trip.season}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {trip.tags.map((tag, tagIndex) => (
                        <Chip
                          key={tagIndex}
                          label={tag}
                          size="small"
                          color={selectedTag.includes(tag) ? 'primary' : 'default'}
                          variant={selectedTag.includes(tag) ? 'filled' : 'outlined'}
                          onClick={() => handleTagClick(tag)}
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

                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      component={RouterLink}
                      to={`/day-trips/${trip.id}`}
                      sx={{ mt: 2 }}
                    >
                      View Details
                    </Button>
                    
                    {trip.website && trip.website !== 'N/A' && (
                      <Box 
                        component="a" 
                        href={trip.website.startsWith('http') ? trip.website : `https://${trip.website}`}
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
        </Container>
      </Box>
    </Box>
  );
};

export default DayTrips; 