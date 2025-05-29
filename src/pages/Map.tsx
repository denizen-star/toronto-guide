import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { MapMode, MapItem } from '../types/mapTypes';
import { 
  loadStandardizedSpecialEvents, 
  loadStandardizedSportingEvents,
  loadStandardizedAmateurSports,
  loadStandardizedDayTrips,
  standardizedToMapItem
} from '../utils/dataLoader';

const TORONTO_CENTER = {
  lat: 43.6532,
  lng: -79.3832,
};

const INITIAL_ZOOM = 12;

const FILTER_OPTIONS = {
  neighborhoods: [
    'Downtown',
    'North York',
    'Scarborough',
    'Etobicoke',
    'East York',
    'York',
  ],
  days: [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ],
  offerings: [
    'Special Events',
    'Sporting Events',
    'Amateur Sports',
    'Day Trips',
    'Activities',
    'Happy Hours',
  ],
};

type FilterState = {
  neighborhoods: string[];
  days: string[];
  offerings: string[];
  search: string;
};

export default function Map() {
  const [mapItems, setMapItems] = useState<MapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<MapMode>('SPECIAL_EVENTS');
  const [filterState, setFilterState] = useState<FilterState>({
    neighborhoods: [],
    days: [],
    offerings: [],
    search: '',
  });
  const [filtersOpen, setFiltersOpen] = useState({
    neighborhoods: false,
    days: false,
    offerings: false,
  });

  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true);
        
        // Load all standardized data
        const [specialEvents, sportingEvents, amateurSports, dayTrips] = await Promise.all([
          loadStandardizedSpecialEvents(),
          loadStandardizedSportingEvents(),
          loadStandardizedAmateurSports(),
          loadStandardizedDayTrips()
        ]);

        // Convert to map items
        const items: MapItem[] = [
          ...specialEvents.map(event => standardizedToMapItem(event, 'SPECIAL_EVENTS')),
          ...sportingEvents.map(event => standardizedToMapItem(event, 'SPORTING_EVENTS')),
          ...amateurSports.map(sport => standardizedToMapItem(sport, 'AMATEUR_SPORTS')),
          ...dayTrips.map(trip => standardizedToMapItem(trip, 'DAY_TRIPS'))
        ];

        setMapItems(items);
        setLoading(false);
      } catch (err) {
        console.error('Error loading map data:', err);
        setError('Failed to load map data. Please try again later.');
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  const filteredMapItems = React.useMemo(() => {
    return mapItems.filter(item => {
      // Filter by mode
      if (selectedMode && item.type !== selectedMode) {
        return false;
      }

      // Filter by neighborhood
      if (filterState.neighborhoods.length > 0 && item.neighborhood) {
        if (!filterState.neighborhoods.some(n => 
          item.neighborhood?.toLowerCase().includes(n.toLowerCase())
        )) {
          return false;
        }
      }

      // Filter by search
      if (filterState.search) {
        const searchLower = filterState.search.toLowerCase();
        return (
          item.name.toLowerCase().includes(searchLower) ||
          item.address.toLowerCase().includes(searchLower) ||
          item.neighborhood?.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [mapItems, selectedMode, filterState]);

  const handleModeChange = (event: React.MouseEvent<HTMLElement>, newMode: MapMode | null) => {
    if (newMode) {
      setSelectedMode(newMode);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <ToggleButtonGroup
          value={selectedMode}
          exclusive
          onChange={handleModeChange}
          aria-label="map mode"
        >
          <ToggleButton value="SPECIAL_EVENTS" aria-label="special events">
            Special Events
          </ToggleButton>
          <ToggleButton value="SPORTING_EVENTS" aria-label="sporting events">
            Sporting Events
          </ToggleButton>
          <ToggleButton value="AMATEUR_SPORTS" aria-label="amateur sports">
            Amateur Sports
          </ToggleButton>
          <ToggleButton value="DAY_TRIPS" aria-label="day trips">
            Day Trips
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Showing {filteredMapItems.length} locations
      </Typography>

      {/* Add your map component here */}
      <Box sx={{ height: 500, width: '100%', bgcolor: 'grey.200' }}>
        {/* Replace this with your actual map implementation */}
        <Typography variant="body2" color="text.secondary" align="center" sx={{ pt: 2 }}>
          Map Component Goes Here
        </Typography>
      </Box>
    </Box>
  );
} 