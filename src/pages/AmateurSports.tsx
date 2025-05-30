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
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SportsIcon from '@mui/icons-material/Sports';
import { Link as RouterLink } from 'react-router-dom';
import { AmateurSport, loadAmateurSports } from '../utils/dataLoader';

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

const AmateurSports = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = React.useState(searchParams.get('search') || '');
  const [sportType, setSportType] = React.useState('all');
  const [sports, setSports] = useState<AmateurSport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const filteredActivities = sports.filter(activity => {
    const matchesSearch = 
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = sportType === 'all' || activity.type === sportType;
    
    return matchesSearch && matchesType;
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

  const sportTypes = ['all', ...new Set(sports.map(sport => sport.type))];

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
            Amateur Sports & Pick-Up Games
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'text.secondary',
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Find local sports activities and join the community
          </Typography>
        </Container>
      </Box>

      {/* Search and Filters */}
      <Box sx={{ bgcolor: 'background.paper', py: 1.5 }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          {/* Search Bar */}
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
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

          {/* Filter Dropdowns */}
          <Box sx={{ mb: 2 }}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Sport Type</InputLabel>
                  <Select
                    value={sportType}
                    onChange={(e) => setSportType(e.target.value)}
                    label="Sport Type"
                  >
                    {sportTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type === 'all' ? 'All Sports' : type}
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
              {filteredActivities.length} {filteredActivities.length === 1 ? 'activity' : 'activities'} found
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
                  <CardContent sx={{ flexGrow: 1, p: 3, textAlign: 'center' }}>
                    <Box sx={{ mb: 2 }}>
                      {getSportIcon(activity.type, activity.title)}
                    </Box>
                    
                    <Typography variant="h6" gutterBottom>
                      {activity.title}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {activity.description}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                      <LocationOnIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {activity.location || 'Various Locations'}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
                      <Chip label={activity.type} size="small" color="primary" />
                      {activity.tags.slice(0, 2).map((tag, index) => (
                        <Chip key={index} label={tag} size="small" />
                      ))}
                    </Box>
                  </CardContent>

                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                      component={RouterLink}
                      to={`/amateur-sport/${activity.id}`}
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
        </Container>
      </Box>
    </Box>
  );
};

export default AmateurSports; 