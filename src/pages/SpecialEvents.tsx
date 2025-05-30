import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Grid, Typography, CircularProgress } from '@mui/material';
import { 
  loadStandardizedSpecialEvents, 
  type StandardizedSpecialEvent 
} from '../utils/dataLoader';
import EnhancedMinimalistCard, { EnhancedCardData } from '../components/MinimalistCard';
import MultiSelectFilter from '../components/MultiSelectFilter';
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
  
  // Essential filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);

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

  // Memoized filter options
  const categoryOptions = useMemo(() => [
    { value: 'art', label: 'Art & Exhibitions' },
    { value: 'music', label: 'Music & Concerts' },
    { value: 'theater', label: 'Theater & Performance' },
    { value: 'food', label: 'Food & Wine' },
    { value: 'festival', label: 'Festivals' },
    { value: 'cultural', label: 'Cultural Events' }
  ], []);

  const venueOptions = useMemo(() => [
    { value: 'downtown', label: 'Downtown' },
    { value: 'harbourfront', label: 'Harbourfront' },
    { value: 'distillery', label: 'Distillery District' },
    { value: 'queen-west', label: 'Queen West' },
    { value: 'kensington', label: 'Kensington Market' }
  ], []);

  // Memoized helper functions
  const getCategoryFromTags = useCallback((tags: string[]): string => {
    const tagString = tags.join(' ').toLowerCase();
    
    if (tagString.includes('art') || tagString.includes('gallery') || tagString.includes('exhibition')) return 'art';
    if (tagString.includes('music') || tagString.includes('concert') || tagString.includes('band')) return 'music';
    if (tagString.includes('theater') || tagString.includes('theatre') || tagString.includes('performance')) return 'theater';
    if (tagString.includes('food') || tagString.includes('wine') || tagString.includes('culinary')) return 'food';
    if (tagString.includes('festival') || tagString.includes('celebration')) return 'festival';
    
    return 'cultural'; // default
  }, []);

  const getVenueCategory = useCallback((location: string): string => {
    const loc = location.toLowerCase();
    
    if (loc.includes('harbourfront') || loc.includes('waterfront')) return 'harbourfront';
    if (loc.includes('distillery')) return 'distillery';
    if (loc.includes('queen west') || loc.includes('ossington')) return 'queen-west';
    if (loc.includes('kensington')) return 'kensington';
    
    return 'downtown'; // default
  }, []);

  const getIconForEvent = useCallback((event: StandardizedSpecialEvent): React.ReactNode => {
    const category = getCategoryFromTags(event.tags);
    return iconMap[category] || iconMap['cultural'];
  }, [getCategoryFromTags]);

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
      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.includes(getCategoryFromTags(event.tags));

      // Venue filter
      const matchesVenue = selectedVenues.length === 0 || 
        selectedVenues.includes(getVenueCategory(event.location));

      return matchesSearch && matchesCategory && matchesVenue;
    });
  }, [events, searchTerm, selectedCategories, selectedVenues, getCategoryFromTags, getVenueCategory]);

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

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(12);
  }, [selectedCategories, selectedVenues, searchTerm]);

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
                <div className="stat-number">5</div>
                <div className="stat-label">Venues</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Essential Filter Section */}
      <section className="filter-section">
        <div className="swiss-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-3)' }}>
            <MultiSelectFilter
              label="Category"
              options={categoryOptions}
              selectedValues={selectedCategories}
              onChange={setSelectedCategories}
              placeholder="All Categories"
            />
            <MultiSelectFilter
              label="Area"
              options={venueOptions}
              selectedValues={selectedVenues}
              onChange={setSelectedVenues}
              placeholder="All Areas"
            />
          </div>
        </div>
      </section>

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