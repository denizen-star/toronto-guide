import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Box, Grid, Typography, Container, useTheme, useMediaQuery, CircularProgress, Button } from '@mui/material';
import EnhancedMinimalistCard from '../components/MinimalistCard';
import EnhancedFilterSystem, { FilterConfig } from '../components/EnhancedFilterSystem';
import { useSearch } from '../components/Layout';
import ErrorBoundary from '../components/ErrorBoundary';
import { loadBoulderData } from '../services/boulderService';
import type { BoulderLocation, Activity } from '../types/boulder';
import {
  LocationCity,
  School,
  Terrain,
  LocalActivity,
  Landscape,
  Business,
  LocalDrink,
  LocalBar,
  Restaurant,
  Store,
  Museum,
  Park,
  DirectionsWalk,
  SportsBasketball,
  LocalCafe,
  Science,
  ShoppingBag,
  TheaterComedy,
  Hiking,
  AgricultureOutlined,
  LocalFlorist,
  SportsGolf,
  Celebration,
  Attractions,
  NightlifeOutlined
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

// Memoize the filter config to prevent recreation on each render
const filterConfigs: FilterConfig[] = [
  {
    key: 'category',
    label: 'Category',
    placeholder: 'Select categories',
    options: [
      { value: 'dining', label: 'Dining' },
      { value: 'entertainment', label: 'Entertainment' },
      { value: 'shopping', label: 'Shopping' },
      { value: 'outdoor', label: 'Outdoor' },
      { value: 'art', label: 'Art & Culture' },
      { value: 'education', label: 'Education' },
      { value: 'brewery', label: 'Breweries & Bars' }
    ]
  },
  {
    key: 'area',
    label: 'Area',
    placeholder: 'Select areas',
    options: [
      { value: 'downtown', label: 'Downtown' },
      { value: 'hill', label: 'The Hill' },
      { value: 'nobo', label: 'North Boulder' },
      { value: 'south', label: 'South Boulder' },
      { value: 'east', label: 'East Boulder' },
      { value: 'gunbarrel', label: 'Gunbarrel' }
    ]
  }
];

// Memoize icon maps
const areaIconMap = {
  'downtown': <LocationCity />,
  'hill': <School />,
  'nobo': <Terrain />,
  'south': <Landscape />,
  'east': <Business />,
  'gunbarrel': <LocalDrink />
};

const activityIconMap = {
  // Shopping & Entertainment
  'Shopping & Entertainment': <Store />,
  'Shopping': <ShoppingBag />,
  'Entertainment': <TheaterComedy />,
  'Shopping & Craft': <ShoppingBag />,
  'Outdoor Gear & Museum': <Hiking />,
  
  // Dining & Drinks
  'Restaurant': <Restaurant />,
  'Dining': <Restaurant />,
  'Bar': <LocalBar />,
  'Brewery': <LocalDrink />,
  'Brewery & Taproom': <LocalDrink />,
  'Brewery Tours': <LocalDrink />,
  'Cafe & Bakery': <LocalCafe />,
  'Winery': <LocalBar />,
  'happy-hour': <NightlifeOutlined />,
  'Food Hall': <Restaurant />,
  
  // Culture & Arts
  'Arts & Culture': <Museum />,
  'Historic Dining': <Celebration />,
  'Art Gallery': <Museum />,
  'Factory Tour': <Business />,
  'Theater': <TheaterComedy />,
  'Museum': <Museum />,
  
  // Outdoor & Recreation
  'Outdoor Recreation': <DirectionsWalk />,
  'Parks & Recreation': <Park />,
  'Hiking': <Hiking />,
  'Hiking & Biking': <DirectionsWalk />,
  'Golf & Recreation': <SportsGolf />,
  'Bike Park': <SportsBasketball />,
  'Trail': <Hiking />,
  
  // Education & Science
  'Science & Education': <Science />,
  'Education & Sightseeing': <School />,
  'Research Center': <Science />,
  
  // Local Experience
  'Local Experience': <LocalActivity />,
  'Local Exploration': <DirectionsWalk />,
  'Local Produce': <AgricultureOutlined />,
  'Agriculture & Education': <LocalFlorist />,
  'Farm Stand': <AgricultureOutlined />,
  
  // Default
  'default': <Attractions />
};

// Memoized card component
const LocationCard = memo(({ location, icon }: { location: BoulderLocation; icon: React.ReactNode }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Box sx={{ height: '100%' }}>
      <EnhancedMinimalistCard
        data={{
          id: location.id,
          title: location.title,
          description: location.description,
          tags: location.tags,
          detailPath: `/boulder/${location.id}`
        }}
        icon={icon}
      />
    </Box>
  </Grid>
));

// Memoized activity card component
const ActivityCard = memo(({ activity, locationId }: { activity: Activity; locationId: string }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Box sx={{ height: '100%' }}>
      <EnhancedMinimalistCard
        data={{
          id: `${locationId}-${activity.title.toLowerCase().replace(/\s+/g, '-')}`,
          title: activity.title,
          description: activity.category,
          tags: [activity.category],
          detailPath: activity.website || '#',
          address: activity.address,
          website: activity.website
        }}
        icon={activityIconMap[activity.category as keyof typeof activityIconMap] || activityIconMap['default']}
      />
    </Box>
  </Grid>
));

const Boulder: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { searchTerm, setSearchPlaceholder } = useSearch();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [boulderData, setBoulderData] = useState<BoulderLocation[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string[] }>({
    category: [],
    activityType: [],
    area: [],
    tags: [],
    priceRange: []
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await loadBoulderData();
        setBoulderData(data);
        setSearchPlaceholder('Search Boulder locations...');
      } catch (error) {
        console.error('Error loading data:', error);
        setError(error instanceof Error ? error : new Error('Failed to load data'));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [setSearchPlaceholder]);

  // Handle filter changes with useCallback
  const handleFilterChange = useCallback((filterId: string, values: string[]) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterId]: values
    }));
  }, []);

  // Handle filter reset with useCallback
  const handleResetFilters = useCallback(() => {
    setSelectedFilters({
      category: [],
      activityType: [],
      area: [],
      tags: [],
      priceRange: []
    });
  }, []);

  // Memoize the filtered data
  const filteredData = useMemo(() => {
    return boulderData.filter(location => {
      // Search term filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          location.title.toLowerCase().includes(searchLower) ||
          location.description.toLowerCase().includes(searchLower) ||
          location.activities.some(activity => 
            activity.title.toLowerCase().includes(searchLower) ||
            activity.category.toLowerCase().includes(searchLower)
          )
        );
      }

      return true;
    });
  }, [boulderData, searchTerm]);

  // Filter activities based on category and area filters
  const filteredActivities = useMemo(() => {
    const activities: { activity: Activity; locationId: string }[] = [];
    
    filteredData.forEach(location => {
      // Apply category filter
      if (selectedFilters.category.length > 0 &&
          !selectedFilters.category.some(cat => location.tags.includes(cat))) {
        return;
      }

      // Apply area filter
      if (selectedFilters.area.length > 0 &&
          !selectedFilters.area.includes(location.category)) {
        return;
      }

      location.activities.forEach(activity => {
        activities.push({ activity, locationId: location.id });
      });
    });

    return activities;
  }, [filteredData, selectedFilters]);

  // Calculate stats
  const stats = useMemo(() => ({
    totalLocations: filteredData.length,
    totalActivities: filteredData.reduce((acc, location) => acc + location.activities.length, 0),
    totalHappyHours: filteredData.reduce((acc, location) => acc + (location.happyHours?.length || 0), 0)
  }), [filteredData]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="error" gutterBottom>
          {error.message}
        </Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Breadcrumb */}
      <section className="breadcrumb">
        <div className="swiss-container">
          <ul className="breadcrumb-list">
            <li><RouterLink to="/" className="breadcrumb-link">Home</RouterLink></li>
            <li>/</li>
            <li>Boulder</li>
          </ul>
        </div>
      </section>

      {/* Page Header */}
      <section className="page-header">
        <div className="swiss-container">
          <div className="header-content">
            <div>
              <h1 className="page-title">Boulder Guide</h1>
              <p className="page-subtitle">
                Discover Boulder's vibrant culture, outdoor activities, and local hotspots. 
                From Pearl Street's charm to the Flatirons' majesty, explore the best of Boulder.
              </p>
            </div>
            <div className="stats-box">
              <div className="stat">
                <div className="stat-number">{stats.totalLocations}</div>
                <div className="stat-label">Locations</div>
              </div>
              <div className="stat">
                <div className="stat-number">{stats.totalActivities}</div>
                <div className="stat-label">Activities</div>
              </div>
              <div className="stat">
                <div className="stat-number">{stats.totalHappyHours}</div>
                <div className="stat-label">Happy Hours</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Filter Section */}
      <EnhancedFilterSystem
        filters={filterConfigs}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* Locations Grid */}
      <section className="section-large">
        <div className="swiss-container">
          <Typography variant="h5" sx={{ mb: 3 }}>
            Neighborhoods
          </Typography>
          <Grid container spacing={3}>
            {filteredData.map((location) => (
              <LocationCard
                key={location.id}
                location={location}
                icon={areaIconMap[location.category as keyof typeof areaIconMap] || <LocationCity />}
              />
            ))}
          </Grid>
        </div>
      </section>

      {/* Activities Grid */}
      <section className="section-large">
        <div className="swiss-container">
          <Typography variant="h5" sx={{ mb: 3 }}>
            Activities & Attractions ({filteredActivities.length})
          </Typography>
          <Grid container spacing={3}>
            {filteredActivities.map(({ activity, locationId }) => (
              <ActivityCard
                key={`${locationId}-${activity.title}`}
                activity={activity}
                locationId={locationId}
              />
            ))}
          </Grid>
          {filteredActivities.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No activities found matching your criteria
              </Typography>
            </Box>
          )}
        </div>
      </section>
    </Box>
  );
};

export default memo(Boulder); 