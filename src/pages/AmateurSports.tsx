import React, { useEffect, useState } from 'react';
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
  ToggleButton,
  ToggleButtonGroup,
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
  const [searchQuery, setSearchQuery] = React.useState('');
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
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Paper
          sx={{
            p: 4,
            mb: 4,
            background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://source.unsplash.com/random/?sports,toronto)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white',
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" gutterBottom>
            Amateur Sports & Pick-Up Games
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 3 }}>
            Find local sports activities and join the community
          </Typography>
          
          {/* Search and Filter Section */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                flexGrow: 1,
                maxWidth: { xs: '100%', sm: 400 },
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
            
            <ToggleButtonGroup
              value={sportType}
              onChange={(event, newValue) => {
                if (newValue !== null) {
                  setSportType(newValue);
                }
              }}
              exclusive
              sx={{
                minWidth: 200,
                bgcolor: 'white',
                borderRadius: 1,
              }}
            >
              {sportTypes.map((type) => (
                <ToggleButton key={type} value={type}>
                  {type === 'all' ? 'All Sports' : type}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
        </Paper>

        {/* Results Count */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" color="text.secondary">
            {filteredActivities.length} activities available
          </Typography>
        </Box>

        {/* Activities Grid */}
        <Grid container spacing={3}>
          {filteredActivities.map((activity) => (
            <Grid item xs={12} md={4} key={activity.id}>
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
                  {getSportIcon(activity.type, activity.title)}
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {activity.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {activity.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {activity.location}
                    </Typography>
                    <SportsSoccerIcon sx={{ ml: 2, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {activity.skillLevel}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {activity.tags.map((tag, tagIndex) => (
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
                    to={`/amateur-sports/${activity.id}`}
                    sx={{ mt: 2 }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default AmateurSports; 