import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Grid, Typography, CircularProgress, Button, Container, Alert } from '@mui/material';
import { 
  loadLgbtEvents, 
  type LgbtEvent 
} from '../utils/dataLoader';
import EnhancedMinimalistCard, { EnhancedCardData } from '../components/MinimalistCard';
import EnhancedFilterSystem, { FilterConfig } from '../components/EnhancedFilterSystem';
import { useSearch } from '../components/Layout';
import { 
  Celebration,
  TheaterComedy,
  LocalBar,
  Diversity3,
  ExpandMore
} from '@mui/icons-material';

// Memoized icon map for LGBTQ+ events
const iconMap: { [key: string]: React.ReactNode } = {
  'performance': <TheaterComedy />,
  'social': <Celebration />,
  'community': <Diversity3 />,
  'nightlife': <LocalBar />
};

const LgbtEvents = () => {
  const { searchTerm, setSearchPlaceholder } = useSearch();
  const [events, setEvents] = useState<LgbtEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [displayCount, setDisplayCount] = useState(12);
  
  // Enhanced filter states
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string[] }>({
    eventType: [],
    subcategory: [],
    neighborhood: [],
    accessibility: [],
    ageGroup: [],
    recurring: [],
    dateRange: []
  });

  // Add sorting state
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'location'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    setSearchPlaceholder('Search LGBTQ+ events...');
  }, [setSearchPlaceholder]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const eventsData = await loadLgbtEvents();
        setEvents(eventsData);
        setLoading(false);
      } catch (err) {
        console.error('Error loading LGBTQ+ events:', err);
        setError('Failed to load LGBTQ+ events');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helper functions for categorization
  const getEventType = useCallback((event: LgbtEvent): string => {
    return event.eventType || 'other';
  }, []);

  const getNeighborhood = useCallback((location: string): string => {
    const loc = location.toLowerCase();
    
    if (loc.includes('church-wellesley') || loc.includes('village')) return 'church-wellesley';
    if (loc.includes('west queen west')) return 'west-queen-west';
    if (loc.includes('kensington')) return 'kensington';
    if (loc.includes('danforth')) return 'danforth';
    if (loc.includes('riverside')) return 'riverside';
    
    return 'other';
  }, []);

  const getAgeGroup = useCallback((event: LgbtEvent): string => {
    const restriction = event.ageRestriction?.toLowerCase() || '';
    
    if (restriction.includes('all ages')) return 'all-ages';
    if (restriction.includes('18+')) return '18-plus';
    if (restriction.includes('19+')) return '19-plus';
    if (restriction.includes('youth')) return 'youth';
    
    return 'not-specified';
  }, []);

  const getIconForEvent = useCallback((event: LgbtEvent): React.ReactNode => {
    return iconMap[event.eventType] || iconMap['community'];
  }, []);

  // Enhanced filter configurations
  const filterConfigs = useMemo((): FilterConfig[] => {
    const eventTypeOptions = [
      { value: 'performance', label: 'Performance' },
      { value: 'social', label: 'Social' },
      { value: 'community', label: 'Community' },
      { value: 'nightlife', label: 'Nightlife' }
    ];

    const subcategoryOptions = [
      { value: 'festival', label: 'Festival' },
      { value: 'drag', label: 'Drag' },
      { value: 'party', label: 'Party' },
      { value: 'arts', label: 'Arts & Culture' },
      { value: 'sports', label: 'Sports' }
    ];

    const neighborhoodOptions = [
      { value: 'church-wellesley', label: 'Church-Wellesley Village' },
      { value: 'west-queen-west', label: 'West Queen West' },
      { value: 'kensington', label: 'Kensington Market' },
      { value: 'danforth', label: 'The Danforth' },
      { value: 'riverside', label: 'Riverside' },
      { value: 'other', label: 'Other Areas' }
    ];

    const accessibilityOptions = [
      { value: 'wheelchair', label: 'Wheelchair Accessible' },
      { value: 'asl', label: 'ASL Interpretation' },
      { value: 'quiet-space', label: 'Quiet Space Available' },
      { value: 'gender-neutral', label: 'Gender-Neutral Facilities' },
      { value: 'not-specified', label: 'Not Specified' }
    ];

    const ageGroupOptions = [
      { value: 'all-ages', label: 'All Ages Welcome' },
      { value: 'youth', label: 'Youth (Under 18)' },
      { value: '18-plus', label: '18+' },
      { value: '19-plus', label: '19+' },
      { value: 'not-specified', label: 'Not Specified' }
    ];

    const recurringOptions = [
      { value: 'true', label: 'Recurring Events' },
      { value: 'false', label: 'One-Time Events' }
    ];

    const dateRangeOptions = [
      { value: 'today', label: 'Today' },
      { value: 'this-week', label: 'This Week' },
      { value: 'this-month', label: 'This Month' },
      { value: 'upcoming', label: 'All Upcoming' }
    ];

    return [
      {
        key: 'eventType',
        label: 'Event Type',
        placeholder: 'Select event types...',
        options: eventTypeOptions
      },
      {
        key: 'subcategory',
        label: 'Subcategory',
        placeholder: 'Select subcategory...',
        options: subcategoryOptions
      },
      {
        key: 'neighborhood',
        label: 'Neighborhood',
        placeholder: 'Select neighborhoods...',
        options: neighborhoodOptions
      },
      {
        key: 'accessibility',
        label: 'Accessibility',
        placeholder: 'Select accessibility features...',
        options: accessibilityOptions
      },
      {
        key: 'ageGroup',
        label: 'Age Group',
        placeholder: 'Select age groups...',
        options: ageGroupOptions
      },
      {
        key: 'recurring',
        label: 'Event Frequency',
        placeholder: 'Select frequency...',
        options: recurringOptions
      },
      {
        key: 'dateRange',
        label: 'Date Range',
        placeholder: 'Select date range...',
        options: dateRangeOptions
      }
    ];
  }, []);

  // Enhanced sorting and filtering logic
  const sortedAndFilteredEvents = useMemo(() => {
    // Helper function to check if event is in date range
    const isEventInDateRange = (event: LgbtEvent, range: string): boolean => {
      const eventDate = new Date(event.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const thisWeek = new Date(today);
      thisWeek.setDate(today.getDate() + 7);

      const thisMonth = new Date(today);
      thisMonth.setMonth(today.getMonth() + 1);

      switch (range) {
        case 'today':
          return eventDate >= today && eventDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
        case 'this-week':
          return eventDate >= today && eventDate < thisWeek;
        case 'this-month':
          return eventDate >= today && eventDate < thisMonth;
        case 'upcoming':
          return eventDate >= today;
        default:
          return true;
      }
    };

    const filtered = events.filter(event => {
      // Search filter
      const matchesSearch = !searchTerm || 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      // Event Type filter
      const matchesEventType = selectedFilters.eventType.length === 0 || 
        selectedFilters.eventType.includes(getEventType(event));

      // Subcategory filter
      const matchesSubcategory = selectedFilters.subcategory.length === 0 || 
        selectedFilters.subcategory.includes(event.subcategory);

      // Neighborhood filter
      const matchesNeighborhood = selectedFilters.neighborhood.length === 0 || 
        selectedFilters.neighborhood.includes(getNeighborhood(event.location));

      // Accessibility filter
      const matchesAccessibility = selectedFilters.accessibility.length === 0 || 
        selectedFilters.accessibility.some(access => 
          event.venueAccessibility?.toLowerCase().includes(access.toLowerCase())
        );

      // Age Group filter
      const matchesAgeGroup = selectedFilters.ageGroup.length === 0 || 
        selectedFilters.ageGroup.includes(getAgeGroup(event));

      // Recurring filter
      const matchesRecurring = !selectedFilters.recurring.length || 
        selectedFilters.recurring.includes(event.recurring.toString());

      // Date Range filter
      const matchesDateRange = !selectedFilters.dateRange.length || 
        selectedFilters.dateRange.some(range => isEventInDateRange(event, range));

      return matchesSearch && matchesEventType && matchesSubcategory && matchesNeighborhood && 
             matchesAccessibility && matchesAgeGroup && matchesRecurring &&
             matchesDateRange;
    });

    // Sort events
    return [...filtered].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'location':
          comparison = a.location.localeCompare(b.location);
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [events, searchTerm, selectedFilters, sortBy, sortDirection, getEventType, getNeighborhood, getAgeGroup]);

  // Memoized displayed events
  const displayedEvents = useMemo(() => 
    sortedAndFilteredEvents.slice(0, displayCount), 
    [sortedAndFilteredEvents, displayCount]
  );

  // Memoized card data conversion
  const cardDataArray = useMemo(() => {
    return displayedEvents.map((event): EnhancedCardData => ({
      id: event.id,
      title: event.title,
      description: event.description,
      website: event.website,
      tags: event.tags.slice(0, 3),
      priceRange: event.cost || 'See details',
      location: event.location,
      address: event.location,
      lgbtqFriendly: true,
      neighborhood: getNeighborhood(event.location),
      detailPath: `/lgbtq-events/${event.id}`
    }));
  }, [displayedEvents, getNeighborhood]);

  const handleLoadMore = useCallback(() => {
    setDisplayCount(prev => prev + 12);
  }, []);

  const handleFilterChange = useCallback((filterKey: string, values: string[]) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterKey]: values
    }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setSelectedFilters({
      eventType: [],
      subcategory: [],
      neighborhood: [],
      accessibility: [],
      ageGroup: [],
      recurring: [],
      dateRange: []
    });
    setDisplayCount(12);
  }, []);

  // Add sorting controls to the UI
  const renderSortControls = () => (
    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
      <Typography variant="body1">Sort by:</Typography>
      <Button
        size="small"
        variant={sortBy === 'date' ? 'contained' : 'outlined'}
        onClick={() => {
          if (sortBy === 'date') {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
          } else {
            setSortBy('date');
            setSortDirection('asc');
          }
        }}
      >
        Date {sortBy === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
      </Button>
      <Button
        size="small"
        variant={sortBy === 'title' ? 'contained' : 'outlined'}
        onClick={() => {
          if (sortBy === 'title') {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
          } else {
            setSortBy('title');
            setSortDirection('asc');
          }
        }}
      >
        Title {sortBy === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
      </Button>
      <Button
        size="small"
        variant={sortBy === 'location' ? 'contained' : 'outlined'}
        onClick={() => {
          if (sortBy === 'location') {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
          } else {
            setSortBy('location');
            setSortDirection('asc');
          }
        }}
      >
        Location {sortBy === 'location' && (sortDirection === 'asc' ? '↑' : '↓')}
      </Button>
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
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
            <li>LGBTQ+ Events</li>
          </ul>
        </div>
      </section>

      {/* Page Header */}
      <section className="page-header">
        <div className="swiss-container">
          <div className="header-content">
            <div>
              <h1 className="page-title">LGBTQ+ Events</h1>
              <p className="page-subtitle">
                Discover and celebrate Toronto's vibrant LGBTQ+ community through diverse events, 
                performances, and gatherings. From drag shows to community meetups, find inclusive 
                spaces and experiences.
              </p>
            </div>
            <div className="stats-box">
              <div className="stat">
                <div className="stat-number">{sortedAndFilteredEvents.length}</div>
                <div className="stat-label">Event Options</div>
              </div>
              <div className="stat">
                <div className="stat-number">{Object.keys(iconMap).length}</div>
                <div className="stat-label">Event Types</div>
              </div>
              <div className="stat">
                <div className="stat-number">5</div>
                <div className="stat-label">Areas</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <Container maxWidth="lg">
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        <EnhancedFilterSystem
          filters={filterConfigs}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
        />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {renderSortControls()}

            <Grid container spacing={3}>
              {displayedEvents.map(event => (
                <Grid item key={event.id} xs={12} sm={6} md={4}>
                  <EnhancedMinimalistCard
                    data={cardDataArray.find(card => card.id === event.id) || {
                      id: event.id,
                      title: event.title,
                      description: event.description,
                      website: event.website,
                      tags: event.tags.slice(0, 3),
                      priceRange: event.cost || 'See details',
                      location: event.location,
                      address: event.location,
                      lgbtqFriendly: true,
                      neighborhood: getNeighborhood(event.location),
                      detailPath: `/lgbtq-events/${event.id}`
                    }}
                    icon={getIconForEvent(event)}
                  />
                </Grid>
              ))}
            </Grid>

            {sortedAndFilteredEvents.length > displayCount && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={handleLoadMore}
                  startIcon={<ExpandMore />}
                >
                  Load More Events
                </Button>
              </Box>
            )}

            {sortedAndFilteredEvents.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  No events found matching your criteria
                </Typography>
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default LgbtEvents; 