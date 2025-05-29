import React, { useState, useEffect } from 'react';
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SportsHockeyIcon from '@mui/icons-material/SportsHockey';
import SportsBaseballIcon from '@mui/icons-material/SportsBaseball';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsFootballIcon from '@mui/icons-material/SportsFootball';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import SportsIcon from '@mui/icons-material/Sports';
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

const SportingEvents = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [eventType, setEventType] = React.useState('all');
  const [events, setEvents] = useState<SportingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = eventType === 'all' || event.type === eventType;
    
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

  const eventTypes = ['all', ...new Set(events.map(event => event.type))];

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
            Professional Sporting Events
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 3 }}>
            Get tickets to Toronto's biggest sporting events
          </Typography>
          
          {/* Search and Filter Section */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search events..."
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
            
            <FormControl
              sx={{
                minWidth: 200,
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
            >
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
          </Box>
        </Paper>

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
                    to={`/sporting-events/${event.id}`}
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

export default SportingEvents; 