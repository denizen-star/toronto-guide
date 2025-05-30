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
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SportsIcon from '@mui/icons-material/Sports';
import { Link as RouterLink } from 'react-router-dom';
import { AmateurSport, loadAmateurSports } from '../utils/dataLoader';
import StarIcon from '@mui/icons-material/Star';

const getSportIcon = (type: string, title: string) => {
  const sportType = type.toLowerCase();
  const titleLower = title.toLowerCase();
  
  if (sportType.includes('basketball') || titleLower.includes('basketball')) {
    return <SportsBasketballIcon sx={{ fontSize: 60 }} />;
  }
  if (sportType.includes('soccer') || titleLower.includes('soccer') || titleLower.includes('football')) {
    return <SportsSoccerIcon sx={{ fontSize: 60 }} />;
  }
  if (sportType.includes('volleyball') || titleLower.includes('volleyball')) {
    return <SportsVolleyballIcon sx={{ fontSize: 60 }} />;
  }
  if (sportType.includes('tennis') || titleLower.includes('tennis')) {
    return <SportsTennisIcon sx={{ fontSize: 60 }} />;
  }
  if (sportType.includes('ultimate') || titleLower.includes('frisbee')) {
    return <SportsIcon sx={{ fontSize: 60 }} />;
  }
  return <FitnessCenterIcon sx={{ fontSize: 60 }} />;
};

// Helper function to get location area from full location string
const getLocationArea = (location: string): string => {
  if (!location) return 'Various';
  const locationLower = location.toLowerCase();
  
  if (locationLower.includes('downtown') || locationLower.includes('financial district')) return 'Downtown';
  if (locationLower.includes('king west') || locationLower.includes('liberty village')) return 'King West';
  if (locationLower.includes('ossington') || locationLower.includes('trinity bellwoods')) return 'West End';
  if (locationLower.includes('beaches') || locationLower.includes('leslieville')) return 'East End';
  if (locationLower.includes('high park') || locationLower.includes('roncesvalles')) return 'High Park Area';
  if (locationLower.includes('harbourfront') || locationLower.includes('waterfront')) return 'Waterfront';
  if (locationLower.includes('north york') || locationLower.includes('sheppard')) return 'North York';
  if (locationLower.includes('scarborough')) return 'Scarborough';
  if (locationLower.includes('etobicoke')) return 'Etobicoke';
  if (locationLower.includes('yorkville') || locationLower.includes('midtown')) return 'Midtown';
  if (locationLower.includes('multiple') || locationLower.includes('various')) return 'Multiple Locations';
  
  return 'Other Areas';
};

// Helper function to get skill category
const getSkillCategory = (skillLevel: string): string => {
  if (!skillLevel) return 'All Levels';
  const level = skillLevel.toLowerCase();
  
  if (level.includes('beginner') || level.includes('novice')) return 'Beginner';
  if (level.includes('intermediate')) return 'Intermediate';
  if (level.includes('advanced') || level.includes('competitive')) return 'Advanced';
  if (level.includes('all') || level.includes('any')) return 'All Levels';
  
  return 'Mixed';
};

const AmateurSports = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = React.useState(searchParams.get('search') || '');
  const [sports, setSports] = useState<AmateurSport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states - updated to arrays for multi-select
  const [selectedSportType, setSelectedSportType] = React.useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = React.useState<string[]>([]);
  const [selectedSkillLevel, setSelectedSkillLevel] = React.useState<string[]>([]);
  const [selectedTag, setSelectedTag] = React.useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadAmateurSports();
        setSports(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load amateur sports data');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Get all unique values for filters
  const filterOptions = React.useMemo(() => {
    const sportTypes = new Set<string>();
    const locations = new Set<string>();
    const skillLevels = new Set<string>();
    const tags = new Set<string>();
    
    sports.forEach(sport => {
      sportTypes.add(sport.type);
      locations.add(getLocationArea(sport.location));
      skillLevels.add(getSkillCategory(sport.skillLevel));
      sport.tags.forEach(tag => tags.add(tag));
    });
    
    return {
      sportTypes: Array.from(sportTypes).sort(),
      locations: Array.from(locations).sort(),
      skillLevels: Array.from(skillLevels).sort(),
      tags: Array.from(tags).sort(),
    };
  }, [sports]);

  const filteredActivities = sports.filter(activity => {
    // Search filter
    const matchesSearch = 
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Other filters
    const matchesSportType = selectedSportType.length === 0 || selectedSportType.includes(activity.type);
    const matchesLocation = selectedLocation.length === 0 || selectedLocation.includes(getLocationArea(activity.location));
    const matchesSkillLevel = selectedSkillLevel.length === 0 || selectedSkillLevel.includes(getSkillCategory(activity.skillLevel));
    const matchesTag = selectedTag.length === 0 || activity.tags.some(tag => selectedTag.includes(tag));
    
    return matchesSearch && matchesSportType && matchesLocation && matchesSkillLevel && matchesTag;
  });

  const handleTagClick = (tag: string) => {
    if (selectedTag.includes(tag)) {
      setSelectedTag(selectedTag.filter((t) => t !== tag));
    } else {
      setSelectedTag([...selectedTag, tag]);
    }
  };

  const clearAllFilters = () => {
    setSelectedSportType([]);
    setSelectedLocation([]);
    setSelectedSkillLevel([]);
    setSelectedTag([]);
    setSearchQuery('');
  };

  const activeFiltersCount = [
    selectedSportType.length > 0,
    selectedLocation.length > 0,
    selectedSkillLevel.length > 0,
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
          border: '1px solid rgba(0, 150, 255, 0.4)',
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
                color: '#0096FF',
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
                color: '#00BFFF',
                position: 'absolute',
                animation: 'orbit2 3s linear infinite reverse',
                transformOrigin: '0 12px',
                '@keyframes orbit2': {
                  '0%': { transform: 'rotate(0deg) translateX(14px) rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg) translateX(14px) rotate(-360deg)' },
                },
              }} />
              <SportsSoccerIcon sx={{ 
                fontSize: 28,
                background: 'linear-gradient(45deg, #0096FF, #00BFFF, #87CEEB)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 8px rgba(0, 150, 255, 0.6))',
                position: 'relative',
                zIndex: 2,
                mr: 1,
              }} />
              <SportsBasketballIcon sx={{ 
                fontSize: 24,
                background: 'linear-gradient(45deg, #00BFFF, #87CEEB, #B0E0E6)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 6px rgba(0, 191, 255, 0.5))',
                position: 'relative',
                zIndex: 2,
                transform: 'rotate(20deg)',
              }} />
            </Box>
            
            <Typography 
              variant="h4"
              component="h1"
              sx={{ 
                mb: 0.5,
                fontWeight: 700,
                fontSize: { xs: 1.6 * 16, md: 2 * 16 },
                letterSpacing: '0.005em',
                fontFamily: '"Source Sans Pro", sans-serif',
                background: 'linear-gradient(135deg, #0096FF 0%, #00BFFF 50%, #87CEEB 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 8px rgba(0, 150, 255, 0.5))',
                animation: 'hologram 2.5s ease-in-out infinite',
                '@keyframes hologram': {
                  '0%, 100%': { transform: 'translateY(0px)' },
                  '50%': { transform: 'translateY(-1px)' },
                },
              }}
            >
              Recreational Sports & Leagues
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#B3D9FF',
                fontWeight: 300,
                lineHeight: 1.4,
                fontSize: 14,
              }}
            >
              Join local sports communities, pickup games, and recreational leagues across Toronto
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
              placeholder="Search activities, sports types, or tags..."
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
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Sport Type</InputLabel>
                  <Select
                    value={selectedSportType}
                    onChange={(e) => setSelectedSportType(e.target.value as string[])}
                    label="Sport Type"
                    multiple
                    renderValue={(selected) => 
                      selected.length === 0 ? 'All Sports' : 
                      selected.length === 1 ? selected[0] : `${selected.length} sports`
                    }
                  >
                    {filterOptions.sportTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        <Checkbox checked={selectedSportType.includes(type)} />
                        <ListItemText primary={type} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Area</InputLabel>
                  <Select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value as string[])}
                    label="Area"
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

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Skill Level</InputLabel>
                  <Select
                    value={selectedSkillLevel}
                    onChange={(e) => setSelectedSkillLevel(e.target.value as string[])}
                    label="Skill Level"
                    multiple
                    renderValue={(selected) => 
                      selected.length === 0 ? 'All Levels' : 
                      selected.length === 1 ? selected[0] : `${selected.length} levels`
                    }
                  >
                    {filterOptions.skillLevels.map((level) => (
                      <MenuItem key={level} value={level}>
                        <Checkbox checked={selectedSkillLevel.includes(level)} />
                        <ListItemText primary={level} />
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
              {selectedSportType.length > 0 && (
                <Chip
                  label={`Sport: ${selectedSportType.join(', ')}`}
                  size="small"
                  onDelete={() => setSelectedSportType([])}
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
              {selectedSkillLevel.length > 0 && (
                <Chip
                  label={`Level: ${selectedSkillLevel.join(', ')}`}
                  size="small"
                  onDelete={() => setSelectedSkillLevel([])}
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
              {filteredActivities.length} {filteredActivities.length === 1 ? 'activity' : 'activities'} found
              {activeFiltersCount > 0 && (
                <> • <Button variant="text" size="small" onClick={clearAllFilters} sx={{ minWidth: 'auto', p: 0.5 }}>
                  Clear all filters
                </Button></>
              )}
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Activities Grid */}
      <Box sx={{ bgcolor: 'background.default', py: 4 }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          <Grid container spacing={4}>
            {filteredActivities.map((activity) => (
              <Grid item xs={12} sm={6} lg={4} key={activity.id}>
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
                    {getSportIcon(activity.type, activity.title)}
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      {activity.title}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {activity.description}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOnIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {activity.location || 'Various Locations'}
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      <strong>Skill Level:</strong> {activity.skillLevel || 'All levels'}
                    </Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                      <Chip 
                        label={activity.type} 
                        size="small" 
                        color="primary" 
                        sx={{ mb: 0.5 }}
                      />
                      {activity.tags.slice(0, 3).map((tag, index) => (
                        <Chip 
                          key={index} 
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
                  </CardContent>

                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                      component={RouterLink}
                      to={`/amateur-sports/${activity.id}`}
                      variant="contained"
                      fullWidth
                      size="small"
                    >
                      View Details
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          {filteredActivities.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No activities found
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

export default AmateurSports; 