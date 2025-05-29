import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  CircularProgress,
  Button,
  OutlinedInput,
  Checkbox,
  ListItemButton,
  Collapse,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { 
  loadVenues, 
  loadHappyHours, 
  loadActivities,
  loadLocations,
  getVenueTags, 
  type Venue, 
  type HappyHour,
  type Activity,
  type Location,
} from '../utils/dataLoader';

const TORONTO_CENTER = {
  lat: 43.6532,
  lng: -79.3832,
};

const DAYS = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
];

const OFFERINGS = [
  'Beer Specials',
  'Wine Specials',
  'Cocktail Specials',
  'Food Specials',
  'All Day Happy Hour',
];

type MapMode = 'venues' | 'activities';

interface FilterState {
  neighborhoods: string[];
  days: string[];
  offerings: string[];
  search: string;
}

interface MapItem {
  id: string | number;
  name: string;
  address: string;
  neighborhood?: string;
  lat?: number;
  lng?: number;
  type: MapMode;
}

const Map = () => {
  const navigate = useNavigate();
  const [mapMode, setMapMode] = useState<MapMode>('venues');
  const [venues, setVenues] = useState<Venue[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [happyHours, setHappyHours] = useState<HappyHour[]>([]);
  const [selectedItem, setSelectedItem] = useState<MapItem | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    neighborhoods: [],
    days: [],
    offerings: [],
    search: '',
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedFilters, setExpandedFilters] = useState<Record<string, boolean>>({
    neighborhoods: true,
    days: false,
    offerings: false,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [venuesData, happyHoursData, activitiesData, locationsData] = await Promise.all([
          loadVenues(),
          loadHappyHours(),
          loadActivities(),
          loadLocations(),
        ]);
        
        const venuesWithCoords = venuesData.filter(venue => venue.lat && venue.lng);
        setVenues(venuesWithCoords);
        setHappyHours(happyHoursData);
        setActivities(activitiesData);
        setLocations(locationsData);
        setLoading(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load map data');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleModeChange = (event: React.MouseEvent<HTMLElement>, newMode: MapMode) => {
    if (newMode !== null) {
      setMapMode(newMode);
      setSelectedItem(null);
      setDrawerOpen(false);
    }
  };

  const neighborhoods = Array.from(new Set([
    ...venues.map(venue => venue.neighborhood),
    ...activities.filter(a => a.neighborhood).map(a => a.neighborhood as string),
  ])).sort();

  const getVenueHappyHours = (venueId: number) => {
    return happyHours.filter(hh => hh.location_id === venueId);
  };

  const handleFilterChange = (
    filterType: keyof FilterState,
    value: string,
    checked?: boolean
  ) => {
    setFilters(prev => {
      if (filterType === 'search') {
        return { ...prev, [filterType]: value };
      }

      const currentValues = prev[filterType] as string[];
      if (checked) {
        return { ...prev, [filterType]: [...currentValues, value] };
      } else {
        return { ...prev, [filterType]: currentValues.filter(v => v !== value) };
      }
    });
  };

  const clearFilters = () => {
    setFilters({
      neighborhoods: [],
      days: [],
      offerings: [],
      search: '',
    });
  };

  const toggleFilterSection = (section: string) => {
    setExpandedFilters(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getMapItems = (): MapItem[] => {
    if (mapMode === 'venues') {
      return venues.map(venue => ({
        id: venue.id,
        name: venue.name,
        address: venue.address,
        neighborhood: venue.neighborhood,
        lat: venue.lat,
        lng: venue.lng,
        type: 'venues' as const,
      }));
    } else {
      return activities.map(activity => {
        const location = locations.find(l => l.id === activity.locationId);
        return {
          id: activity.id,
          name: activity.title,
          address: location?.address || '',
          neighborhood: activity.neighborhood,
          lat: location?.latitude,
          lng: location?.longitude,
          type: 'activities' as const,
        };
      }).filter(item => item.lat && item.lng);
    }
  };

  const filteredItems = getMapItems().filter(item => {
    // Search filter
    if (filters.search && !item.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !item.address.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }

    // Neighborhood filter
    if (filters.neighborhoods.length > 0 && !filters.neighborhoods.includes(item.neighborhood || '')) {
      return false;
    }

    if (item.type === 'venues') {
      // Apply venue-specific filters
      const venue = venues.find(v => v.id === item.id);
      if (!venue) return false;

      // Day filter
      if (filters.days.length > 0) {
        const venueHappyHours = getVenueHappyHours(venue.id);
        if (!venueHappyHours.some(hh => filters.days.includes(hh.day_of_week))) {
          return false;
        }
      }

      // Offerings filter
      if (filters.offerings.length > 0) {
        const venueHappyHours = getVenueHappyHours(venue.id);
        if (!venueHappyHours.some(hh => 
          filters.offerings.some(offering => 
            hh.offerings.toLowerCase().includes(offering.toLowerCase())
          )
        )) {
          return false;
        }
      }
    }

    return true;
  });

  const handleMarkerClick = (item: MapItem) => {
    setSelectedItem(item);
    setDrawerOpen(true);
  };

  const mapContainerStyle = {
    width: '100%',
    height: 'calc(100vh - 64px)', // Adjust based on your navbar height
  };

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading map data...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Container>
    );
  }

  const renderFilterSection = (
    title: string,
    items: string[],
    filterType: keyof FilterState,
    expanded: boolean
  ) => (
    <>
      <ListItemButton onClick={() => toggleFilterSection(title.toLowerCase())}>
        <ListItemText primary={title} />
        {expanded ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {items.map((item) => (
            <ListItemButton
              key={item}
              sx={{ pl: 4 }}
              onClick={() => handleFilterChange(
                filterType,
                item,
                !(filters[filterType] as string[]).includes(item)
              )}
            >
              <Checkbox
                edge="start"
                checked={(filters[filterType] as string[]).includes(item)}
                tabIndex={-1}
                disableRipple
              />
              <ListItemText primary={item} />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </>
  );

  return (
    <Box sx={{ display: 'flex', height: '100%', position: 'relative' }}>
      {/* Watermark */}
      <Box
        sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(-45deg)',
          zIndex: 1000,
          pointerEvents: 'none',
          opacity: 0.15,
          userSelect: 'none',
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
            fontWeight: 'bold',
            color: 'text.primary',
            whiteSpace: 'nowrap',
            textTransform: 'uppercase',
          }}
        >
          Work in Progress
        </Typography>
      </Box>

      {/* Filters Panel */}
      <Paper
        sx={{
          width: 320,
          borderRadius: 0,
          boxShadow: 2,
          zIndex: 1,
          display: { xs: 'none', md: 'block' },
          overflow: 'auto',
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <ToggleButtonGroup
            value={mapMode}
            exclusive
            onChange={handleModeChange}
            aria-label="map mode"
            fullWidth
            size="small"
            sx={{ mb: 2 }}
          >
            <ToggleButton value="venues" aria-label="venues">
              <RestaurantIcon sx={{ mr: 1 }} />
              Venues
            </ToggleButton>
            <ToggleButton value="activities" aria-label="activities">
              <LocalActivityIcon sx={{ mr: 1 }} />
              Activities
            </ToggleButton>
          </ToggleButtonGroup>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FilterListIcon sx={{ mr: 1 }} />
            <Typography variant="h6">Filters</Typography>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton
              size="small"
              onClick={clearFilters}
              disabled={!Object.values(filters).some(v => 
                Array.isArray(v) ? v.length > 0 : Boolean(v)
              )}
            >
              <ClearIcon />
            </IconButton>
          </Box>

          <TextField
            fullWidth
            size="small"
            placeholder={`Search ${mapMode}...`}
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <List>
          {renderFilterSection('Neighborhoods', neighborhoods, 'neighborhoods', expandedFilters.neighborhoods)}
          {mapMode === 'venues' && (
            <>
              {renderFilterSection('Days', DAYS, 'days', expandedFilters.days)}
              {renderFilterSection('Offerings', OFFERINGS, 'offerings', expandedFilters.offerings)}
            </>
          )}
        </List>

        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle2" color="text.secondary">
            {filteredItems.length} {mapMode} found
          </Typography>
        </Box>
      </Paper>

      {/* Map Container */}
      <Box sx={{ flexGrow: 1, height: '100%' }}>
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={TORONTO_CENTER}
            zoom={13}
          >
            {filteredItems.map((item) => (
              <Marker
                key={item.id}
                position={{ lat: item.lat || 0, lng: item.lng || 0 }}
                onClick={() => handleMarkerClick(item)}
                icon={item.type === 'activities' ? {
                  url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                } : undefined}
              />
            ))}
          </GoogleMap>
        </LoadScript>
      </Box>

      {/* Details Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: 320,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 320,
          },
        }}
      >
        {selectedItem && (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {selectedItem.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOnIcon sx={{ mr: 1 }} />
              <Typography variant="body2">{selectedItem.address}</Typography>
            </Box>

            {selectedItem.type === 'venues' && (
              <>
                {getVenueHappyHours(selectedItem.id as number).map((hh) => (
                  <Paper key={hh.id} sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      {hh.day_of_week}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AccessTimeIcon sx={{ mr: 1, fontSize: 'small' }} />
                      <Typography variant="body2">
                        {hh.start_time} - {hh.end_time}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocalBarIcon sx={{ mr: 1, fontSize: 'small' }} />
                      <Typography variant="body2">{hh.offerings}</Typography>
                    </Box>
                    {hh.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {hh.description}
                      </Typography>
                    )}
                  </Paper>
                ))}
              </>
            )}

            {selectedItem.type === 'activities' && (
              <>
                {activities.find(a => a.id === selectedItem.id)?.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {activities.find(a => a.id === selectedItem.id)?.description}
                  </Typography>
                )}
              </>
            )}

            <Button
              variant="contained"
              fullWidth
              onClick={() => navigate(`/tovibes/${selectedItem.type}/${selectedItem.id}`)}
            >
              View Details
            </Button>
          </Box>
        )}
      </Drawer>
    </Box>
  );
};

export default Map; 