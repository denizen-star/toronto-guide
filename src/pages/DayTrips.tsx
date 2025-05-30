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

const DayTrips = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = React.useState(searchParams.get('search') || '');
  const [dayTrips, setDayTrips] = useState<DayTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Get all unique tags for the tags filter
  const allTags = React.useMemo(() => {
    const tagSet = new Set<string>();
    dayTrips.forEach(trip => {
      trip.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [dayTrips]);

  const [selectedTag, setSelectedTag] = React.useState('all');

  const filteredTrips = dayTrips.filter(trip => {
    const matchesSearch = 
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTag = selectedTag === 'all' || trip.tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
  };

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
            Toronto Day Trips & Getaways
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'text.secondary',
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Explore exciting destinations within a few hours of Toronto
          </Typography>
        </Container>
      </Box>

      {/* Search and Filters */}
      <Box sx={{ bgcolor: 'background.paper', py: 1.5 }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          {/* Search Bar */}
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
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

          {/* Filter Dropdowns */}
          <Box sx={{ mb: 2 }}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={6} md={4}>
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
              {filteredTrips.length} {filteredTrips.length === 1 ? 'trip' : 'trips'} found
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
                          color={selectedTag === tag ? 'primary' : 'default'}
                          variant={selectedTag === tag ? 'filled' : 'outlined'}
                          onClick={() => handleTagClick(tag)}
                          sx={{
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: selectedTag === tag 
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