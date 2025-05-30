import React, { useState, useEffect } from 'react';
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CelebrationIcon from '@mui/icons-material/Celebration';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PaletteIcon from '@mui/icons-material/Palette';
import FestivalIcon from '@mui/icons-material/Festival';
import PublicIcon from '@mui/icons-material/Public';
import { Link as RouterLink } from 'react-router-dom';
import { SpecialEvent, loadSpecialEvents } from '../utils/dataLoader';
import StarIcon from '@mui/icons-material/Star';

const getEventIcon = (type: string, title: string) => {
  const eventType = type.toLowerCase();
  const titleLower = title.toLowerCase();
  
  if (eventType.includes('music') || titleLower.includes('concert') || titleLower.includes('music')) {
    return <MusicNoteIcon sx={{ fontSize: 60 }} />;
  }
  if (eventType.includes('food') || titleLower.includes('food') || titleLower.includes('taste')) {
    return <RestaurantIcon sx={{ fontSize: 60 }} />;
  }
  if (eventType.includes('theater') || eventType.includes('comedy') || titleLower.includes('theater')) {
    return <TheaterComedyIcon sx={{ fontSize: 60 }} />;
  }
  if (eventType.includes('art') || titleLower.includes('art') || titleLower.includes('gallery')) {
    return <PaletteIcon sx={{ fontSize: 60 }} />;
  }
  if (eventType.includes('film') || eventType.includes('movie') || titleLower.includes('film')) {
    return <LocalMoviesIcon sx={{ fontSize: 60 }} />;
  }
  if (eventType.includes('festival')) {
    return <FestivalIcon sx={{ fontSize: 60 }} />;
  }
  return <CelebrationIcon sx={{ fontSize: 60 }} />;
};

// Helper function to get location area from full location string
const getEventLocationArea = (location: string): string => {
  if (!location) return 'Various';
  const locationLower = location.toLowerCase();
  
  if (locationLower.includes('downtown') || locationLower.includes('financial district')) return 'Downtown';
  if (locationLower.includes('king west') || locationLower.includes('liberty village')) return 'King West';
  if (locationLower.includes('ossington') || locationLower.includes('trinity bellwoods')) return 'West End';
  if (locationLower.includes('beaches') || locationLower.includes('leslieville')) return 'East End';
  if (locationLower.includes('high park') || locationLower.includes('roncesvalles')) return 'High Park Area';
  if (locationLower.includes('harbourfront') || locationLower.includes('waterfront')) return 'Waterfront';
  if (locationLower.includes('distillery') || locationLower.includes('st. lawrence')) return 'Distillery District';
  if (locationLower.includes('cne') || locationLower.includes('exhibition')) return 'Exhibition Place';
  if (locationLower.includes('yorkville') || locationLower.includes('midtown')) return 'Midtown';
  if (locationLower.includes('multiple') || locationLower.includes('various')) return 'Multiple Venues';
  if (locationLower.includes('outdoor') || locationLower.includes('park')) return 'Outdoor/Parks';
  
  return 'Other Areas';
};

// Helper function to get event category based on type and content
const getEventCategory = (event: SpecialEvent): string => {
  const type = event.type.toLowerCase();
  const title = event.title.toLowerCase();
  const description = event.description.toLowerCase();
  
  if (type.includes('music') || title.includes('concert') || title.includes('music')) return 'Music & Concerts';
  if (type.includes('food') || title.includes('food') || title.includes('taste')) return 'Food & Drink';
  if (type.includes('art') || title.includes('art') || title.includes('gallery')) return 'Arts & Culture';
  if (type.includes('festival')) return 'Festivals';
  if (type.includes('theater') || type.includes('comedy')) return 'Theater & Comedy';
  if (type.includes('film') || type.includes('movie')) return 'Film & Media';
  if (type.includes('seasonal') || title.includes('holiday') || title.includes('christmas')) return 'Seasonal Events';
  if (type.includes('community') || description.includes('community')) return 'Community Events';
  if (type.includes('sports') || title.includes('marathon') || title.includes('race')) return 'Sports Events';
  
  return 'Other Events';
};

// Helper function to get season based on date or title
const getEventSeason = (event: SpecialEvent): string => {
  const title = event.title.toLowerCase();
  const description = event.description.toLowerCase();
  
  if (title.includes('winter') || title.includes('christmas') || title.includes('holiday') || 
      description.includes('winter') || description.includes('christmas') || description.includes('holiday')) return 'Winter';
  if (title.includes('spring') || title.includes('easter') || 
      description.includes('spring') || description.includes('easter')) return 'Spring';
  if (title.includes('summer') || title.includes('canada day') || 
      description.includes('summer') || description.includes('canada day')) return 'Summer';
  if (title.includes('fall') || title.includes('autumn') || title.includes('halloween') || 
      description.includes('fall') || description.includes('autumn') || description.includes('halloween')) return 'Fall';
  
  // Try to determine from date if available
  if (event.date) {
    try {
      const eventDate = new Date(event.date);
      const month = eventDate.getMonth() + 1; // getMonth() returns 0-11
      
      if (month >= 12 || month <= 2) return 'Winter';
      if (month >= 3 && month <= 5) return 'Spring';
      if (month >= 6 && month <= 8) return 'Summer';
      if (month >= 9 && month <= 11) return 'Fall';
    } catch (error) {
      // Date parsing failed, continue to default
    }
  }
  
  return 'Year-round';
};

const SpecialEvents = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = React.useState(searchParams.get('search') || '');
  const [events, setEvents] = useState<SpecialEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states - updated to arrays for multi-select
  const [selectedEventType, setSelectedEventType] = React.useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = React.useState<string[]>([]);
  const [selectedEventCategory, setSelectedEventCategory] = React.useState<string[]>([]);
  const [selectedSeason, setSelectedSeason] = React.useState<string[]>([]);
  const [selectedTag, setSelectedTag] = React.useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadSpecialEvents();
        setEvents(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load special events data');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Get all unique values for filters
  const filterOptions = React.useMemo(() => {
    const eventTypes = new Set<string>();
    const locations = new Set<string>();
    const eventCategories = new Set<string>();
    const seasons = new Set<string>();
    const tags = new Set<string>();
    
    events.forEach(event => {
      eventTypes.add(event.type);
      locations.add(getEventLocationArea(event.location));
      eventCategories.add(getEventCategory(event));
      seasons.add(getEventSeason(event));
      event.tags.forEach(tag => tags.add(tag));
    });
    
    return {
      eventTypes: Array.from(eventTypes).sort(),
      locations: Array.from(locations).sort(),
      eventCategories: Array.from(eventCategories).sort(),
      seasons: Array.from(seasons).sort(),
      tags: Array.from(tags).sort(),
    };
  }, [events]);

  const filteredEvents = events.filter(event => {
    // Search filter
    const matchesSearch = 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Other filters
    const matchesEventType = selectedEventType.length === 0 || selectedEventType.includes(event.type);
    const matchesLocation = selectedLocation.length === 0 || selectedLocation.includes(getEventLocationArea(event.location));
    const matchesEventCategory = selectedEventCategory.length === 0 || selectedEventCategory.includes(getEventCategory(event));
    const matchesSeason = selectedSeason.length === 0 || selectedSeason.includes(getEventSeason(event));
    const matchesTag = selectedTag.length === 0 || event.tags.some(tag => selectedTag.includes(tag));
    
    return matchesSearch && matchesEventType && matchesLocation && matchesEventCategory && matchesSeason && matchesTag;
  });

  const handleTagClick = (tag: string) => {
    if (selectedTag.includes(tag)) {
      setSelectedTag(selectedTag.filter((t) => t !== tag));
    } else {
      setSelectedTag([...selectedTag, tag]);
    }
  };

  const clearAllFilters = () => {
    setSelectedEventType([]);
    setSelectedLocation([]);
    setSelectedEventCategory([]);
    setSelectedSeason([]);
    setSelectedTag([]);
    setSearchQuery('');
  };

  const activeFiltersCount = [
    selectedEventType.length > 0,
    selectedLocation.length > 0,
    selectedEventCategory.length > 0,
    selectedSeason.length > 0,
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
          border: '1px solid rgba(138, 43, 226, 0.4)',
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
                color: '#8A2BE2',
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
                color: '#DA70D6',
                position: 'absolute',
                animation: 'orbit2 3s linear infinite reverse',
                transformOrigin: '0 12px',
                '@keyframes orbit2': {
                  '0%': { transform: 'rotate(0deg) translateX(14px) rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg) translateX(14px) rotate(-360deg)' },
                },
              }} />
              <CelebrationIcon sx={{ 
                fontSize: 28,
                background: 'linear-gradient(45deg, #8A2BE2, #DA70D6, #DDA0DD)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 8px rgba(138, 43, 226, 0.6))',
                position: 'relative',
                zIndex: 2,
                mr: 1,
              }} />
              <FestivalIcon sx={{ 
                fontSize: 24,
                background: 'linear-gradient(45deg, #DA70D6, #DDA0DD, #E6E6FA)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 6px rgba(218, 112, 214, 0.5))',
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
                fontWeight: 600,
                fontSize: { xs: 1.6 * 16, md: 2 * 16 },
                letterSpacing: '0.02em',
                fontFamily: '"Playfair Display", serif',
                background: 'linear-gradient(135deg, #8A2BE2 0%, #DA70D6 50%, #DDA0DD 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 8px rgba(138, 43, 226, 0.5))',
                animation: 'hologram 2.5s ease-in-out infinite',
                '@keyframes hologram': {
                  '0%, 100%': { transform: 'translateY(0px)' },
                  '50%': { transform: 'translateY(-1px)' },
                },
              }}
            >
              Festivals & Cultural Events
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#E6D3FF',
                fontWeight: 300,
                lineHeight: 1.4,
                fontSize: 14,
              }}
            >
              Experience Toronto's vibrant cultural scene through year-round festivals, concerts, and special celebrations
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
              placeholder="Search events, festivals, or tags..."
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
                  <InputLabel>Event Type</InputLabel>
                  <Select
                    value={selectedEventType}
                    onChange={(e) => setSelectedEventType(e.target.value as string[])}
                    label="Event Type"
                    multiple
                    renderValue={(selected) => 
                      selected.length === 0 ? 'All Types' : 
                      selected.length === 1 ? selected[0] : `${selected.length} types`
                    }
                  >
                    {filterOptions.eventTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        <Checkbox checked={selectedEventType.includes(type)} />
                        <ListItemText primary={type} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2.4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={selectedEventCategory}
                    onChange={(e) => setSelectedEventCategory(e.target.value as string[])}
                    label="Category"
                    multiple
                    renderValue={(selected) => 
                      selected.length === 0 ? 'All Categories' : 
                      selected.length === 1 ? selected[0] : `${selected.length} categories`
                    }
                  >
                    {filterOptions.eventCategories.map((category) => (
                      <MenuItem key={category} value={category}>
                        <Checkbox checked={selectedEventCategory.includes(category)} />
                        <ListItemText primary={category} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={2.4}>
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

              <Grid item xs={12} sm={6} md={2.4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Season</InputLabel>
                  <Select
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(e.target.value as string[])}
                    label="Season"
                    multiple
                    renderValue={(selected) => 
                      selected.length === 0 ? 'All Seasons' : 
                      selected.length === 1 ? selected[0] : `${selected.length} seasons`
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
              {selectedEventType.length > 0 && (
                <Chip
                  label={`Type: ${selectedEventType.join(', ')}`}
                  size="small"
                  onDelete={() => setSelectedEventType([])}
                  color="primary"
                  variant="outlined"
                />
              )}
              {selectedEventCategory.length > 0 && (
                <Chip
                  label={`Category: ${selectedEventCategory.join(', ')}`}
                  size="small"
                  onDelete={() => setSelectedEventCategory([])}
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
              {selectedSeason.length > 0 && (
                <Chip
                  label={`Season: ${selectedSeason.join(', ')}`}
                  size="small"
                  onDelete={() => setSelectedSeason([])}
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
              {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
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
              {filteredEvents.length} events available
            </Typography>
          </Box>

          {/* Events Grid */}
          <Grid container spacing={3}>
            {filteredEvents.map((event) => (
              <Grid item xs={12} md={4} key={event.id}>
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
                      backgroundColor: 'secondary.main',
                      color: 'white',
                    }}
                  >
                    {getEventIcon(event.type, event.title)}
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {event.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {event.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <EventIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {event.date}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {event.location}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      <Chip
                        label={getEventCategory(event)}
                        size="small"
                        color="secondary"
                        sx={{ mb: 0.5 }}
                      />
                      {event.tags.slice(0, 3).map((tag, tagIndex) => (
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

                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      component={RouterLink}
                      to={`/special-events/${event.id}`}
                      sx={{ mt: 2 }}
                    >
                      View Details
                    </Button>
                    
                    {event.website && event.website !== 'N/A' && (
                      <Box 
                        component="a" 
                        href={event.website.startsWith('http') ? event.website : `https://${event.website}`}
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

          {filteredEvents.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No events found
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

export default SpecialEvents; 