import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Grid, Typography, CircularProgress } from '@mui/material';
import { 
  loadStandardizedSpecialEvents, 
  type StandardizedSpecialEvent 
} from '../utils/dataLoader';
import EnhancedMinimalistCard, { EnhancedCardData } from '../components/MinimalistCard';
import EnhancedFilterSystem, { FilterConfig } from '../components/EnhancedFilterSystem';
import { useSearch } from '../components/Layout';
import { 
  Palette, 
  MusicNote, 
  TheaterComedy, 
  Restaurant,
  Festival,
  EventNote
} from '@mui/icons-material';

// Memoized icon map for special events
const iconMap: { [key: string]: React.ReactNode } = {
  'art': <Palette />,
  'music': <MusicNote />,
  'theater': <TheaterComedy />,
  'food': <Restaurant />,
  'festival': <Festival />,
  'cultural': <EventNote />
};

const SpecialEvents = () => {
  const { searchTerm, setSearchPlaceholder } = useSearch();
  const [events, setEvents] = useState<StandardizedSpecialEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [displayCount, setDisplayCount] = useState(12);
  
  // Enhanced filter states
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string[] }>({
    category: [],
    neighborhood: [],
    eventType: [],
    season: [],
    tags: [],
    duration: [],
    priceRange: []
  });

  useEffect(() => {
    setSearchPlaceholder('Search special events...');
  }, [setSearchPlaceholder]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const eventsData = await loadStandardizedSpecialEvents();
        setEvents(eventsData);
        setLoading(false);
      } catch (err) {
        console.error('Error loading special events:', err);
        setError('Failed to load special events');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helper functions for categorization
  const getCategoryFromTags = useCallback((tags: string[]): string => {
    const tagString = tags.join(' ').toLowerCase();
    
    if (tagString.includes('art') || tagString.includes('gallery') || tagString.includes('exhibition')) return 'art';
    if (tagString.includes('music') || tagString.includes('concert') || tagString.includes('band')) return 'music';
    if (tagString.includes('theater') || tagString.includes('theatre') || tagString.includes('performance')) return 'theater';
    if (tagString.includes('food') || tagString.includes('wine') || tagString.includes('culinary')) return 'food';
    if (tagString.includes('festival') || tagString.includes('celebration')) return 'festival';
    
    return 'cultural'; // default
  }, []);

  const getNeighborhood = useCallback((location: string): string => {
    const loc = location.toLowerCase();
    
    if (loc.includes('harbourfront') || loc.includes('waterfront')) return 'harbourfront';
    if (loc.includes('distillery')) return 'distillery';
    if (loc.includes('queen west') || loc.includes('ossington')) return 'queen-west';
    if (loc.includes('kensington')) return 'kensington';
    if (loc.includes('entertainment') || loc.includes('theatre')) return 'entertainment';
    
    return 'downtown'; // default
  }, []);

  const getEventType = useCallback((event: StandardizedSpecialEvent): string => {
    const title = event.title.toLowerCase();
    const description = event.description.toLowerCase();
    
    if (title.includes('exhibition') || description.includes('exhibition')) return 'exhibition';
    if (title.includes('concert') || description.includes('concert')) return 'concert';
    if (title.includes('workshop') || description.includes('workshop')) return 'workshop';
    if (title.includes('festival') || description.includes('festival')) return 'festival';
    if (title.includes('performance') || description.includes('performance')) return 'performance';
    if (title.includes('class') || description.includes('class')) return 'class';
    return 'event';
  }, []);

  const getSeason = useCallback((event: StandardizedSpecialEvent): string => {
    const tags = event.tags.join(' ').toLowerCase();
    const description = event.description.toLowerCase();
    
    if (tags.includes('winter') || description.includes('winter')) return 'winter';
    if (tags.includes('spring') || description.includes('spring')) return 'spring';
    if (tags.includes('summer') || description.includes('summer')) return 'summer';
    if (tags.includes('fall') || tags.includes('autumn') || description.includes('fall')) return 'fall';
    return 'year-round';
  }, []);

  const getDuration = useCallback((event: StandardizedSpecialEvent): string => {
    const description = event.description.toLowerCase();
    
    if (description.includes('1 hour') || description.includes('60 min')) return 'short';
    if (description.includes('2 hour') || description.includes('3 hour')) return 'medium';
    if (description.includes('half day') || description.includes('4 hour')) return 'half-day';
    if (description.includes('full day') || description.includes('all day')) return 'full-day';
    if (description.includes('weekend') || description.includes('multi-day')) return 'multi-day';
    return 'varies';
  }, []);

  const getPriceRange = useCallback((event: StandardizedSpecialEvent): string => {
    const description = event.description.toLowerCase();
    
    if (description.includes('free') || description.includes('no charge')) return 'free';
    if (description.includes('$') && (description.includes('10') || description.includes('15'))) return 'budget';
    if (description.includes('$') && (description.includes('25') || description.includes('30'))) return 'moderate';
    if (description.includes('$') && description.includes('50')) return 'premium';
    return 'varies';
  }, []);

  const getIconForEvent = useCallback((event: StandardizedSpecialEvent): React.ReactNode => {
    const category = getCategoryFromTags(event.tags);
    return iconMap[category] || iconMap['cultural'];
  }, [getCategoryFromTags]);

  // Create filter configurations
  const filterConfigs: FilterConfig[] = useMemo(() => {
    const categoryOptions = [
      { value: 'art', label: 'Art & Exhibitions' },
      { value: 'music', label: 'Music & Concerts' },
      { value: 'theater', label: 'Theater & Performance' },
      { value: 'food', label: 'Food & Wine' },
      { value: 'festival', label: 'Festivals' },
      { value: 'cultural', label: 'Cultural Events' }
    ];

    const neighborhoodOptions = [
      { value: 'downtown', label: 'Downtown' },
      { value: 'harbourfront', label: 'Harbourfront' },
      { value: 'distillery', label: 'Distillery District' },
      { value: 'queen-west', label: 'Queen West' },
      { value: 'kensington', label: 'Kensington Market' },
      { value: 'entertainment', label: 'Entertainment District' }
    ];

    const eventTypeOptions = [
      { value: 'exhibition', label: 'Exhibitions' },
      { value: 'concert', label: 'Concerts' },
      { value: 'workshop', label: 'Workshops' },
      { value: 'festival', label: 'Festivals' },
      { value: 'performance', label: 'Performances' },
      { value: 'class', label: 'Classes' },
      { value: 'event', label: 'General Events' }
    ];

    const seasonOptions = [
      { value: 'spring', label: 'Spring' },
      { value: 'summer', label: 'Summer' },
      { value: 'fall', label: 'Fall' },
      { value: 'winter', label: 'Winter' },
      { value: 'year-round', label: 'Year Round' }
    ];

    const durationOptions = [
      { value: 'short', label: 'Short (1-2 hours)' },
      { value: 'medium', label: 'Medium (2-4 hours)' },
      { value: 'half-day', label: 'Half Day (4-6 hours)' },
      { value: 'full-day', label: 'Full Day (6+ hours)' },
      { value: 'multi-day', label: 'Multi-Day' },
      { value: 'varies', label: 'Varies' }
    ];

    const priceRangeOptions = [
      { value: 'free', label: 'Free' },
      { value: 'budget', label: 'Budget ($0-20)' },
      { value: 'moderate', label: 'Moderate ($20-40)' },
      { value: 'premium', label: 'Premium ($40+)' },
      { value: 'varies', label: 'Varies' }
    ];

    // Get unique tags from events
    const allTags = events.reduce((tags: Set<string>, event) => {
      event.tags.forEach(tag => tags.add(tag));
      return tags;
    }, new Set<string>());

    const tagOptions = Array.from(allTags).map(tag => ({
      value: tag.toLowerCase().replace(/\s+/g, '-'),
      label: tag
    }));

    return [
      { key: 'category', label: 'Category', options: categoryOptions, placeholder: 'All Categories' },
      { key: 'neighborhood', label: 'Area', options: neighborhoodOptions, placeholder: 'All Areas' },
      { key: 'eventType', label: 'Event Type', options: eventTypeOptions, placeholder: 'All Event Types' },
      { key: 'season', label: 'Season', options: seasonOptions, placeholder: 'All Seasons' },
      { key: 'duration', label: 'Duration', options: durationOptions, placeholder: 'Any Duration' },
      { key: 'priceRange', label: 'Price Range', options: priceRangeOptions, placeholder: 'Any Price' },
      { key: 'tags', label: 'Tags', options: tagOptions.slice(0, 15), placeholder: 'Select Tags' }
    ];
  }, [events]);

  // Memoized filtering logic
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Search filter
      const matchesSearch = !searchTerm || 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      // Category filter
      const matchesCategory = selectedFilters.category.length === 0 || 
        selectedFilters.category.includes(getCategoryFromTags(event.tags));

      // Neighborhood filter
      const matchesNeighborhood = selectedFilters.neighborhood.length === 0 || 
        selectedFilters.neighborhood.includes(getNeighborhood(event.location));

      // Event Type filter
      const matchesEventType = selectedFilters.eventType.length === 0 || 
        selectedFilters.eventType.includes(getEventType(event));

      // Season filter
      const matchesSeason = selectedFilters.season.length === 0 || 
        selectedFilters.season.includes(getSeason(event));

      // Duration filter
      const matchesDuration = selectedFilters.duration.length === 0 || 
        selectedFilters.duration.includes(getDuration(event));

      // Price Range filter
      const matchesPriceRange = selectedFilters.priceRange.length === 0 || 
        selectedFilters.priceRange.includes(getPriceRange(event));

      // Tags filter
      const matchesTags = selectedFilters.tags.length === 0 || 
        selectedFilters.tags.some(selectedTag => 
          event.tags.some(eventTag => 
            eventTag.toLowerCase().replace(/\s+/g, '-') === selectedTag
          )
        );

      return matchesSearch && matchesCategory && matchesNeighborhood && 
             matchesEventType && matchesSeason && matchesDuration && 
             matchesPriceRange && matchesTags;
    });
  }, [events, searchTerm, selectedFilters, getCategoryFromTags, getNeighborhood, getEventType, getSeason, getDuration, getPriceRange]);

  // Memoized displayed events
  const displayedEvents = useMemo(() => 
    filteredEvents.slice(0, displayCount), 
    [filteredEvents, displayCount]
  );

  // Memoized card data conversion
  const cardDataArray = useMemo(() => {
    return displayedEvents.map((event): EnhancedCardData => ({
      id: event.id,
      title: event.title,
      description: event.description,
      website: event.website,
      tags: event.tags.slice(0, 3),
      priceRange: 'See details',
      location: event.location,
      address: event.location,
      lgbtqFriendly: event.lgbtqFriendly,
      neighborhood: event.location,
      detailPath: `/special-events/${event.id}`,
    }));
  }, [displayedEvents]);

  const handleLoadMore = useCallback(() => {
    setDisplayCount(prev => prev + 12);
  }, []);

  const handleFilterChange = useCallback((filterKey: string, values: string[]) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterKey]: values
    }));
    setDisplayCount(12);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSelectedFilters({
      category: [],
      neighborhood: [],
      eventType: [],
      season: [],
      tags: [],
      duration: [],
      priceRange: []
    });
    setDisplayCount(12);
  }, []);

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
            <li>Special Events</li>
          </ul>
        </div>
      </section>

      {/* Page Header */}
      <section className="page-header">
        <div className="swiss-container">
          <div className="header-content">
            <div>
              <h1 className="page-title">Special Events</h1>
              <p className="page-subtitle">
                Discover Toronto's vibrant cultural calendar. From art exhibitions to music festivals, 
                find unique events that showcase the city's creative spirit.
              </p>
            </div>
            <div className="stats-box">
              <div className="stat">
                <div className="stat-number">{filteredEvents.length}</div>
                <div className="stat-label">Events</div>
              </div>
              <div className="stat">
                <div className="stat-number">6</div>
                <div className="stat-label">Categories</div>
              </div>
              <div className="stat">
                <div className="stat-number">6</div>
                <div className="stat-label">Areas</div>
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

      {/* Events Grid */}
      <section className="section-large">
        <div className="swiss-container">
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <div style={{ 
              fontSize: 'var(--text-sm)', 
              fontWeight: 'var(--weight-bold)', 
              color: 'var(--color-accent-sage)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 'var(--space-1)'
            }}>
              {filteredEvents.length} Results
            </div>
            <h2 className="section-title">Upcoming Events</h2>
          </div>
          
          {filteredEvents.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: 'var(--space-8) 0',
              color: 'var(--color-gray-70)'
            }}>
              <div style={{ 
                fontSize: 'var(--text-xl)', 
                fontWeight: 'var(--weight-semibold)',
                marginBottom: 'var(--space-2)'
              }}>
                No special events found
              </div>
              <p>Try adjusting your search terms or filters</p>
            </div>
          ) : (
            <>
              <Grid container spacing={3}>
                {cardDataArray.map((cardData, index) => {
                  const event = displayedEvents[index];
                  return (
                    <Grid item xs={12} sm={6} md={4} key={event.id}>
                      <EnhancedMinimalistCard
                        data={cardData}
                        icon={getIconForEvent(event)}
                        color="info"
                      />
                    </Grid>
                  );
                })}
              </Grid>

              {displayedEvents.length < filteredEvents.length && (
                <div style={{ textAlign: 'center', marginTop: 'var(--space-6)' }}>
                  <button 
                    className="btn-secondary"
                    onClick={handleLoadMore}
                  >
                    Load More Events ({filteredEvents.length - displayedEvents.length} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section style={{ 
        backgroundColor: 'var(--color-black)', 
        color: 'var(--color-white)', 
        padding: 'var(--space-8) 0',
        textAlign: 'center'
      }}>
        <div className="swiss-container">
          <h2 style={{ 
            fontSize: 'var(--text-2xl)', 
            fontWeight: 'var(--weight-bold)',
            textTransform: 'uppercase',
            letterSpacing: '-0.01em',
            marginBottom: 'var(--space-2)'
          }}>Explore More</h2>
          <p style={{ 
            fontSize: 'var(--text-md)', 
            fontWeight: 'var(--weight-light)',
            marginBottom: 'var(--space-4)',
            color: 'var(--color-gray-90)',
            maxWidth: '400px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Discover activities, day trips, and sporting events.
          </p>
          <div className="intro-actions">
            <RouterLink to="/activities" className="btn-primary">View Activities</RouterLink>
          </div>
        </div>
      </section>
    </Box>
  );
};

export default React.memo(SpecialEvents); 