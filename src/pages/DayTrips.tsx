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
  Paper,
  Chip,
  TextField,
  InputAdornment,
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
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
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

  const filteredTrips = dayTrips.filter(trip => {
    const matchesSearch = 
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(selectedTag => 
        trip.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase())
      );
    
    return matchesSearch && matchesTags;
  });

  // Get popular tags (tags that appear in multiple trips)
  const popularTags = React.useMemo(() => {
    const tagCounts = new Map<string, number>();
    dayTrips.forEach(trip => {
      trip.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });
    return Array.from(tagCounts.entries())
      .filter(([, count]) => count > 1)
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag)
      .slice(0, 8); // Show top 8 popular tags
  }, [dayTrips]);

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearAllTags = () => {
    setSelectedTags([]);
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
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Paper
          sx={{
            p: 4,
            mb: 4,
            backgroundColor: 'primary.main',
            color: 'white',
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" gutterBottom>
            Toronto Day Trips & Getaways
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 3 }}>
            Explore exciting destinations within a few hours of Toronto
          </Typography>
          
          {/* Search Bar */}
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search day trips..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              maxWidth: 600,
              bgcolor: 'white',
              borderRadius: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'transparent',
                },
                '&:hover fieldset': {
                  borderColor: 'transparent',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'transparent',
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Paper>

        {/* Popular Tags Section */}
        {popularTags.length > 0 && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ mr: 2 }}>
                Popular Tags
              </Typography>
              {selectedTags.length > 0 && (
                <Button
                  size="small"
                  onClick={clearAllTags}
                  sx={{ ml: 'auto' }}
                >
                  Clear All ({selectedTags.length})
                </Button>
              )}
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {popularTags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onClick={() => handleTagClick(tag)}
                  color={selectedTags.includes(tag) ? 'primary' : 'default'}
                  variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: selectedTags.includes(tag) 
                        ? 'primary.dark' 
                        : 'action.hover',
                    },
                  }}
                />
              ))}
            </Box>
          </Paper>
        )}

        {/* Results Count */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" color="text.secondary">
            {filteredTrips.length} trips available
            {selectedTags.length > 0 && (
              <span> • Filtered by: {selectedTags.join(', ')}</span>
            )}
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
                        color={selectedTags.includes(tag) ? 'primary' : 'default'}
                        variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
                        onClick={() => handleTagClick(tag)}
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: selectedTags.includes(tag) 
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
  );
};

export default DayTrips; 