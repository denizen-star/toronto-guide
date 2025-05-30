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

const getEventIcon = (type: string, title: string) => {
  const eventType = type.toLowerCase();
  const titleLower = title.toLowerCase();
  
  if (eventType.includes('film') || titleLower.includes('film') || titleLower.includes('movie') || titleLower.includes('cinema')) {
    return <LocalMoviesIcon sx={{ fontSize: 60 }} />;
  }
  if (eventType.includes('food') || titleLower.includes('food') || titleLower.includes('taste') || titleLower.includes('culinary')) {
    return <RestaurantIcon sx={{ fontSize: 60 }} />;
  }
  if (eventType.includes('music') || titleLower.includes('music') || titleLower.includes('concert')) {
    return <MusicNoteIcon sx={{ fontSize: 60 }} />;
  }
  if (eventType.includes('art') || titleLower.includes('art') || eventType.includes('gallery')) {
    return <PaletteIcon sx={{ fontSize: 60 }} />;
  }
  if (eventType.includes('comedy') || titleLower.includes('comedy') || titleLower.includes('theater')) {
    return <TheaterComedyIcon sx={{ fontSize: 60 }} />;
  }
  if (eventType.includes('festival')) {
    return <FestivalIcon sx={{ fontSize: 60 }} />;
  }
  return <CelebrationIcon sx={{ fontSize: 60 }} />;
};

const SpecialEvents = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = React.useState(searchParams.get('search') || '');
  const [eventType, setEventType] = React.useState('all');
  const [events, setEvents] = useState<SpecialEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Get all unique tags for the tags filter
  const allTags = React.useMemo(() => {
    const tagSet = new Set<string>();
    events.forEach(event => {
      event.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [events]);

  const [selectedTag, setSelectedTag] = React.useState('all');

  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = eventType === 'all' || event.type === eventType;
    const matchesTag = selectedTag === 'all' || event.tags.includes(selectedTag);
    
    return matchesSearch && matchesType && matchesTag;
  });

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

  const eventTypes = ['all', ...new Set(events.map(event => event.type))];

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
            Special Events & Festivals
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'text.secondary',
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Discover Toronto's most exciting festivals and cultural celebrations
          </Typography>
        </Container>
      </Box>

      {/* Search and Filters */}
      <Box sx={{ bgcolor: 'background.paper', py: 1.5 }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          {/* Search Bar */}
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
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

          {/* Filter Dropdowns */}
          <Box sx={{ mb: 2 }}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Event Type</InputLabel>
                  <Select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    label="Event Type"
                  >
                    {eventTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type === 'all' ? 'All Events' : type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Tag Filter</InputLabel>
                  <Select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    label="Tag Filter"
                  >
                    <MenuItem value="all">All Tags</MenuItem>
                    {allTags.map((tag) => (
                      <MenuItem key={tag} value={tag}>
                        {tag}
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
              {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
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
                      {event.tags.map((tag, tagIndex) => (
                        <Chip
                          key={tagIndex}
                          label={tag}
                          size="small"
                          color="primary"
                          variant="outlined"
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
        </Container>
      </Box>
    </Box>
  );
};

export default SpecialEvents; 