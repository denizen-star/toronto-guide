import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Grid, Typography, CircularProgress } from '@mui/material';
import { 
  loadStandardizedSportingEvents, 
  type StandardizedSportingEvent 
} from '../utils/dataLoader';
import EnhancedMinimalistCard, { EnhancedCardData } from '../components/MinimalistCard';
import MultiSelectFilter from '../components/MultiSelectFilter';
import { useSearch } from '../components/Layout';
import { 
  SportsHockey, 
  SportsBasketball, 
  SportsSoccer, 
  SportsBaseball,
  Stadium
} from '@mui/icons-material';

// Memoized icon map for sporting events
const iconMap: { [key: string]: React.ReactNode } = {
  'hockey': <SportsHockey />,
  'basketball': <SportsBasketball />,
  'soccer': <SportsSoccer />,
  'baseball': <SportsBaseball />,
  'general': <Stadium />
};

const SportingEvents = () => {
  const { searchTerm, setSearchPlaceholder } = useSearch();
  const [events, setEvents] = useState<StandardizedSportingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [displayCount, setDisplayCount] = useState(12);
  
  // Essential filter states
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);

  useEffect(() => {
    setSearchPlaceholder('Search sporting events...');
  }, [setSearchPlaceholder]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const eventsData = await loadStandardizedSportingEvents();
        setEvents(eventsData);
        setLoading(false);
      } catch (err) {
        console.error('Error loading sporting events:', err);
        setError('Failed to load sporting events');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Memoized filter options
  const sportOptions = useMemo(() => [
    { value: 'hockey', label: 'Hockey (Leafs)' },
    { value: 'basketball', label: 'Basketball (Raptors)' },
    { value: 'soccer', label: 'Soccer (TFC)' },
    { value: 'baseball', label: 'Baseball (Blue Jays)' }
  ], []);

  const venueOptions = useMemo(() => [
    { value: 'scotiabank', label: 'Scotiabank Arena' },
    { value: 'rogers', label: 'Rogers Centre' },
    { value: 'bmo', label: 'BMO Field' }
  ], []);

  // Memoized helper functions
  const getSportType = useCallback((event: StandardizedSportingEvent): string => {
    const title = event.title.toLowerCase();
    const tags = event.tags.join(' ').toLowerCase();
    
    if (title.includes('leafs') || title.includes('hockey') || tags.includes('hockey')) return 'hockey';
    if (title.includes('raptors') || title.includes('basketball') || tags.includes('basketball')) return 'basketball';
    if (title.includes('tfc') || title.includes('soccer') || tags.includes('soccer')) return 'soccer';
    if (title.includes('jays') || title.includes('baseball') || tags.includes('baseball')) return 'baseball';
    
    return 'general';
  }, []);

  const getVenueCategory = useCallback((venue: string): string => {
    const v = venue.toLowerCase();
    
    if (v.includes('scotiabank')) return 'scotiabank';
    if (v.includes('rogers')) return 'rogers';
    if (v.includes('bmo')) return 'bmo';
    
    return 'scotiabank'; // default
  }, []);

  const getIconForEvent = useCallback((event: StandardizedSportingEvent): React.ReactNode => {
    const sportType = getSportType(event);
    return iconMap[sportType] || iconMap['general'];
  }, [getSportType]);

  // Memoized filtering logic
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Search filter
      const matchesSearch = !searchTerm || 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      // Sport filter
      const matchesSport = selectedSports.length === 0 || 
        selectedSports.includes(getSportType(event));

      // Venue filter
      const matchesVenue = selectedVenues.length === 0 || 
        selectedVenues.includes(getVenueCategory(event.location));

      return matchesSearch && matchesSport && matchesVenue;
    });
  }, [events, searchTerm, selectedSports, selectedVenues, getSportType, getVenueCategory]);

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
      priceRange: 'Tickets available',
      location: event.location,
      address: event.location,
      lgbtqFriendly: event.lgbtqFriendly,
      neighborhood: event.location,
      detailPath: `/sporting-events/${event.id}`,
    }));
  }, [displayedEvents]);

  const handleLoadMore = useCallback(() => {
    setDisplayCount(prev => prev + 12);
  }, []);

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(12);
  }, [selectedSports, selectedVenues, searchTerm]);

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
            <li>Sporting Events</li>
          </ul>
        </div>
      </section>

      {/* Page Header */}
      <section className="page-header">
        <div className="swiss-container">
          <div className="header-content">
            <div>
              <h1 className="page-title">Sporting Events</h1>
              <p className="page-subtitle">
                Experience Toronto's professional sports scene. From Leafs hockey to Raptors basketball, 
                catch the excitement of live professional sports.
              </p>
            </div>
            <div className="stats-box">
              <div className="stat">
                <div className="stat-number">{filteredEvents.length}</div>
                <div className="stat-label">Events</div>
              </div>
              <div className="stat">
                <div className="stat-number">4</div>
                <div className="stat-label">Sports</div>
              </div>
              <div className="stat">
                <div className="stat-number">3</div>
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
              label="Sport"
              options={sportOptions}
              selectedValues={selectedSports}
              onChange={setSelectedSports}
              placeholder="All Sports"
            />
            <MultiSelectFilter
              label="Venue"
              options={venueOptions}
              selectedValues={selectedVenues}
              onChange={setSelectedVenues}
              placeholder="All Venues"
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
                No sporting events found
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
                        color="warning"
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
          }}>More to Explore</h2>
          <p style={{ 
            fontSize: 'var(--text-md)', 
            fontWeight: 'var(--weight-light)',
            marginBottom: 'var(--space-4)',
            color: 'var(--color-gray-90)',
            maxWidth: '400px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Discover activities, day trips, and amateur sports.
          </p>
          <div className="intro-actions">
            <RouterLink to="/activities" className="btn-primary">View Activities</RouterLink>
          </div>
        </div>
      </section>
    </Box>
  );
};

export default React.memo(SportingEvents); 