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
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PublicIcon from '@mui/icons-material/Public';
import SportsHockeyIcon from '@mui/icons-material/SportsHockey';
import SportsBaseballIcon from '@mui/icons-material/SportsBaseball';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsFootballIcon from '@mui/icons-material/SportsFootball';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import SportsIcon from '@mui/icons-material/Sports';
import StarIcon from '@mui/icons-material/Star';
import { Link as RouterLink } from 'react-router-dom';
import { SportingEvent, loadSportingEvents } from '../utils/dataLoader';

const getEventIcon = (type: string, title: string) => {
  const eventType = type.toLowerCase();
  const titleLower = title.toLowerCase();
  
  if (eventType.includes('hockey') || titleLower.includes('hockey') || titleLower.includes('leafs')) {
    return <SportsHockeyIcon sx={{ fontSize: 60 }} />;
  }
  if (eventType.includes('baseball') || titleLower.includes('baseball') || titleLower.includes('jays')) {
    return <SportsBaseballIcon sx={{ fontSize: 60 }} />;
  }
  if (eventType.includes('basketball') || titleLower.includes('basketball') || titleLower.includes('raptors')) {
    return <SportsBasketballIcon sx={{ fontSize: 60 }} />;
  }
  if (eventType.includes('football') || titleLower.includes('football')) {
    return <SportsFootballIcon sx={{ fontSize: 60 }} />;
  }
  if (eventType.includes('soccer') || titleLower.includes('soccer') || titleLower.includes('fc')) {
    return <SportsSoccerIcon sx={{ fontSize: 60 }} />;
  }
  return <SportsIcon sx={{ fontSize: 60 }} />;
};

// Helper functions for filters
const extractPriceValue = (priceRange: string): number => {
  if (!priceRange) return 0;
  const match = priceRange.match(/\$(\d+)/);
  return match ? parseInt(match[1]) : 0;
};

const getPriceCategory = (priceRange: string): string => {
  const price = extractPriceValue(priceRange);
  if (price === 0) return 'Free';
  if (price <= 50) return 'Budget ($50 or less)';
  if (price <= 150) return 'Moderate ($51-$150)';
  return 'Premium ($150+)';
};

const getEventCategory = (event: SportingEvent): string => {
  const type = event.type.toLowerCase();
  if (type.includes('hockey') || type.includes('basketball') || type.includes('baseball') || type.includes('football') || type.includes('soccer')) {
    return 'Major League Sports';
  }
  if (type.includes('running') || type.includes('race')) {
    return 'Running & Racing';
  }
  if (type.includes('tennis') || type.includes('motorsports')) {
    return 'Individual Sports';
  }
  if (type.includes('multi-sport') || type.includes('water sports')) {
    return 'Multi-Sport Events';
  }
  return 'Other Sports';
};

const SportingEvents = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = React.useState(searchParams.get('search') || '');
  const [events, setEvents] = useState<SportingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states - updated to arrays for multi-select
  const [selectedEventType, setSelectedEventType] = React.useState<string[]>([]);
  const [selectedTag, setSelectedTag] = React.useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = React.useState<string[]>([]);
  const [selectedEventCategory, setSelectedEventCategory] = React.useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadSportingEvents();
        setEvents(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load sporting events data');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Get all unique values for filters
  const filterOptions = React.useMemo(() => {
    const tags = new Set<string>();
    const eventTypes = new Set<string>();
    const priceCategories = new Set<string>();
    const eventCategories = new Set<string>();
    
    events.forEach(event => {
      event.tags.forEach(tag => tags.add(tag));
      eventTypes.add(event.type);
      priceCategories.add(getPriceCategory(event.priceRange));
      eventCategories.add(getEventCategory(event));
    });
    
    return {
      tags: Array.from(tags).sort(),
      eventTypes: Array.from(eventTypes).sort(),
      priceCategories: Array.from(priceCategories).sort(),
      eventCategories: Array.from(eventCategories).sort(),
    };
  }, [events]);

  const filteredEvents = events.filter(event => {
    // Search filter
    const matchesSearch = 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Event type filter
    const matchesType = selectedEventType.length === 0 || selectedEventType.includes(event.type);
    
    // Tag filter
    const matchesTag = selectedTag.length === 0 || event.tags.some(tag => selectedTag.includes(tag));
    
    // Price range filter
    const matchesPriceRange = selectedPriceRange.length === 0 || selectedPriceRange.includes(getPriceCategory(event.priceRange));
    
    // Event category filter
    const matchesEventCategory = selectedEventCategory.length === 0 || selectedEventCategory.includes(getEventCategory(event));
    
    return matchesSearch && matchesType && matchesTag && matchesPriceRange && matchesEventCategory;
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
    setSelectedTag([]);
    setSelectedPriceRange([]);
    setSelectedEventCategory([]);
    setSearchQuery('');
  };

  const activeFiltersCount = [
    selectedEventType.length > 0,
    selectedTag.length > 0,
    selectedPriceRange.length > 0,
    selectedEventCategory.length > 0,
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
          border: '1px solid rgba(220, 53, 69, 0.4)',
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
                color: '#DC3545',
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
                color: '#F8D7DA',
                position: 'absolute',
                animation: 'orbit2 3s linear infinite reverse',
                transformOrigin: '0 12px',
                '@keyframes orbit2': {
                  '0%': { transform: 'rotate(0deg) translateX(14px) rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg) translateX(14px) rotate(-360deg)' },
                },
              }} />
              <SportsIcon sx={{ 
                fontSize: 28,
                background: 'linear-gradient(45deg, #DC3545, #F8D7DA, #FFB3BA)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 8px rgba(220, 53, 69, 0.6))',
                position: 'relative',
                zIndex: 2,
                mr: 1,
              }} />
              <SportsHockeyIcon sx={{ 
                fontSize: 24,
                background: 'linear-gradient(45deg, #F8D7DA, #FFB3BA, #FFC0CB)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 6px rgba(248, 215, 218, 0.5))',
                position: 'relative',
                zIndex: 2,
                transform: 'rotate(15deg)',
              }} />
            </Box>
            
            <Typography 
              variant="h4"
              component="h1"
              sx={{ 
                mb: 0.5,
                fontWeight: 700,
                fontSize: { xs: 1.6 * 16, md: 2 * 16 },
                letterSpacing: '-0.01em',
                fontFamily: '"Roboto Condensed", sans-serif',
                background: 'linear-gradient(135deg, #DC3545 0%, #F8D7DA 50%, #FFB3BA 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 8px rgba(220, 53, 69, 0.5))',
                animation: 'hologram 2.5s ease-in-out infinite',
                '@keyframes hologram': {
                  '0%, 100%': { transform: 'translateY(0px)' },
                  '50%': { transform: 'translateY(-1px)' },
                },
              }}
            >
              Professional Sports & Games
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#FFD6D6',
                fontWeight: 300,
                lineHeight: 1.4,
                fontSize: 14,
              }}
            >
              Catch Toronto's top professional teams in action - from Leafs hockey to Raptors basketball and Blue Jays baseball
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
              placeholder="Search events, teams, or tags..."
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

          {/* Filter Dropdowns */}
          <Box sx={{ mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Event Type</InputLabel>
                  <Select
                    value={selectedEventType}
                    onChange={(e) => setSelectedEventType(e.target.value as string[])}
                    label="Event Type"
                    multiple
                    renderValue={(selected) => 
                      selected.length === 0 ? 'All Events' : 
                      `${selected.length} type${selected.length !== 1 ? 's' : ''}`
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

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={selectedEventCategory}
                    onChange={(e) => setSelectedEventCategory(e.target.value as string[])}
                    label="Category"
                    multiple
                    renderValue={(selected) => 
                      selected.length === 0 ? 'All Categories' : 
                      `${selected.length} category${selected.length !== 1 ? 'ies' : 'y'}`
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

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Price Range</InputLabel>
                  <Select
                    value={selectedPriceRange}
                    onChange={(e) => setSelectedPriceRange(e.target.value as string[])}
                    label="Price Range"
                    multiple
                    renderValue={(selected) => 
                      selected.length === 0 ? 'Any Price' : 
                      `${selected.length} range${selected.length !== 1 ? 's' : ''}`
                    }
                  >
                    {filterOptions.priceCategories.map((priceCategory) => (
                      <MenuItem key={priceCategory} value={priceCategory}>
                        <Checkbox checked={selectedPriceRange.includes(priceCategory)} />
                        <ListItemText primary={priceCategory} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
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
                  label={`Event Type: ${selectedEventType.join(', ')}`}
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
              {selectedPriceRange.length > 0 && (
                <Chip
                  label={`Price: ${selectedPriceRange.join(', ')}`}
                  size="small"
                  onDelete={() => setSelectedPriceRange([])}
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
                        {new Date(event.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {event.location}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AttachMoneyIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {event.priceRange}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {event.tags.map((tag, tagIndex) => (
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
                      to={`/sporting-events/${event.id}`}
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
        </Container>
      </Box>
    </Box>
  );
};

export default SportingEvents; 