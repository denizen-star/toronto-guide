import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Grid, Typography, CircularProgress } from '@mui/material';
import { 
  loadStandardizedSportingEvents, 
  type StandardizedSportingEvent 
} from '../utils/dataLoader';
import EnhancedMinimalistCard, { EnhancedCardData } from '../components/MinimalistCard';
import EnhancedFilterSystem, { FilterConfig } from '../components/EnhancedFilterSystem';
import { useSearch } from '../components/Layout';
import { 
  SportsHockey, 
  SportsBasketball, 
  SportsSoccer, 
  SportsBaseball,
  Stadium,
  EventSeat,
  SportsTennis
} from '@mui/icons-material';

// Memoized icon map for sporting events
const iconMap: { [key: string]: React.ReactNode } = {
  'hockey': <SportsHockey />,
  'basketball': <SportsBasketball />,
  'soccer': <SportsSoccer />,
  'baseball': <SportsBaseball />,
  'tennis': <SportsTennis />,
  'stadium': <Stadium />,
  'general': <EventSeat />
};

const SportingEvents = () => {
  const { searchTerm, setSearchPlaceholder } = useSearch();
  const [events, setEvents] = useState<StandardizedSportingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [displayCount, setDisplayCount] = useState(12);
  
  // Enhanced filter states
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string[] }>({
    team: [],
    sportType: [],
    venue: [],
    season: [],
    eventType: [],
    duration: [],
    priceRange: []
  });

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

  // Helper functions for categorization
  const getTeam = useCallback((event: StandardizedSportingEvent): string => {
    const title = event.title.toLowerCase();
    
    if (title.includes('leafs') || title.includes('maple leafs')) return 'leafs';
    if (title.includes('raptors')) return 'raptors';
    if (title.includes('tfc') || title.includes('toronto fc')) return 'tfc';
    if (title.includes('blue jays') || title.includes('jays')) return 'blue-jays';
    if (title.includes('marlies')) return 'marlies';
    return 'other';
  }, []);

  const getSportType = useCallback((event: StandardizedSportingEvent): string => {
    const title = event.title.toLowerCase();
    const description = event.description.toLowerCase();
    
    if (title.includes('hockey') || description.includes('hockey')) return 'hockey';
    if (title.includes('basketball') || description.includes('basketball')) return 'basketball';
    if (title.includes('soccer') || title.includes('football') || description.includes('soccer')) return 'soccer';
    if (title.includes('baseball') || description.includes('baseball')) return 'baseball';
    if (title.includes('tennis') || description.includes('tennis')) return 'tennis';
    return 'general';
  }, []);

  const getVenue = useCallback((event: StandardizedSportingEvent): string => {
    const location = event.location?.toLowerCase() || '';
    
    if (location.includes('scotiabank') || location.includes('arena')) return 'scotiabank-arena';
    if (location.includes('rogers centre') || location.includes('skydome')) return 'rogers-centre';
    if (location.includes('bmo field') || location.includes('bmo')) return 'bmo-field';
    if (location.includes('coca-cola') || location.includes('coliseum')) return 'coca-cola-coliseum';
    return 'other-venue';
  }, []);

  const getSeason = useCallback((event: StandardizedSportingEvent): string => {
    const title = event.title.toLowerCase();
    const description = event.description.toLowerCase();
    
    if (title.includes('winter') || description.includes('winter')) return 'winter';
    if (title.includes('spring') || description.includes('spring')) return 'spring';
    if (title.includes('summer') || description.includes('summer')) return 'summer';
    if (title.includes('fall') || description.includes('fall')) return 'fall';
    
    // Default based on sport type
    const sportType = getSportType(event);
    if (sportType === 'hockey' || sportType === 'basketball') return 'winter';
    if (sportType === 'baseball') return 'summer';
    if (sportType === 'soccer') return 'fall';
    
    return 'year-round';
  }, [getSportType]);

  const getEventType = useCallback((event: StandardizedSportingEvent): string => {
    const title = event.title.toLowerCase();
    
    if (title.includes('playoff') || title.includes('playoffs')) return 'playoff';
    if (title.includes('season opener') || title.includes('opener')) return 'season-opener';
    if (title.includes('vs') || title.includes('v.')) return 'regular-season';
    if (title.includes('championship') || title.includes('final')) return 'championship';
    if (title.includes('tournament')) return 'tournament';
    return 'regular-season';
  }, []);

  const getDuration = useCallback((event: StandardizedSportingEvent): string => {
    const sportType = getSportType(event);
    
    switch (sportType) {
      case 'hockey': return 'medium'; // ~2.5 hours
      case 'basketball': return 'medium'; // ~2.5 hours
      case 'baseball': return 'long'; // ~3+ hours
      case 'soccer': return 'short'; // ~2 hours
      case 'tennis': return 'varies'; // varies greatly
      default: return 'medium';
    }
  }, [getSportType]);

  const getPriceRange = useCallback((event: StandardizedSportingEvent): string => {
    const team = getTeam(event);
    const eventType = getEventType(event);
    
    // Premium pricing for playoffs and popular teams
    if (eventType === 'playoff' || eventType === 'championship') return 'premium';
    if (team === 'leafs' || team === 'raptors') return 'expensive';
    if (team === 'blue-jays' || team === 'tfc') return 'moderate';
    return 'affordable';
  }, [getTeam, getEventType]);

  const getIconForEvent = useCallback((event: StandardizedSportingEvent): React.ReactNode => {
    const sportType = getSportType(event);
    return iconMap[sportType] || iconMap['general'];
  }, [getSportType]);

  // Create filter configurations
  const filterConfigs: FilterConfig[] = useMemo(() => {
    const teamOptions = [
      { value: 'leafs', label: 'Toronto Maple Leafs' },
      { value: 'raptors', label: 'Toronto Raptors' },
      { value: 'tfc', label: 'Toronto FC' },
      { value: 'blue-jays', label: 'Toronto Blue Jays' },
      { value: 'marlies', label: 'Toronto Marlies' },
      { value: 'other', label: 'Other Teams' }
    ];

    const sportTypeOptions = [
      { value: 'hockey', label: 'Hockey' },
      { value: 'basketball', label: 'Basketball' },
      { value: 'soccer', label: 'Soccer' },
      { value: 'baseball', label: 'Baseball' },
      { value: 'tennis', label: 'Tennis' },
      { value: 'general', label: 'Other Sports' }
    ];

    const venueOptions = [
      { value: 'scotiabank-arena', label: 'Scotiabank Arena' },
      { value: 'rogers-centre', label: 'Rogers Centre' },
      { value: 'bmo-field', label: 'BMO Field' },
      { value: 'coca-cola-coliseum', label: 'Coca-Cola Coliseum' },
      { value: 'other-venue', label: 'Other Venues' }
    ];

    const seasonOptions = [
      { value: 'spring', label: 'Spring' },
      { value: 'summer', label: 'Summer' },
      { value: 'fall', label: 'Fall' },
      { value: 'winter', label: 'Winter' }
    ];

    const eventTypeOptions = [
      { value: 'regular-season', label: 'Regular Season' },
      { value: 'playoff', label: 'Playoffs' },
      { value: 'season-opener', label: 'Season Opener' },
      { value: 'championship', label: 'Championship' },
      { value: 'tournament', label: 'Tournament' }
    ];

    const durationOptions = [
      { value: 'short', label: 'Short (~2 hours)' },
      { value: 'medium', label: 'Medium (2-3 hours)' },
      { value: 'long', label: 'Long (3+ hours)' },
      { value: 'varies', label: 'Varies' }
    ];

    const priceRangeOptions = [
      { value: 'affordable', label: 'Affordable ($20-50)' },
      { value: 'moderate', label: 'Moderate ($50-100)' },
      { value: 'expensive', label: 'Expensive ($100-200)' },
      { value: 'premium', label: 'Premium ($200+)' }
    ];

    return [
      { key: 'team', label: 'Team', options: teamOptions, placeholder: 'All Teams' },
      { key: 'sportType', label: 'Sport', options: sportTypeOptions, placeholder: 'All Sports' },
      { key: 'venue', label: 'Venue', options: venueOptions, placeholder: 'All Venues' },
      { key: 'season', label: 'Season', options: seasonOptions, placeholder: 'All Seasons' },
      { key: 'eventType', label: 'Event Type', options: eventTypeOptions, placeholder: 'All Event Types' },
      { key: 'duration', label: 'Duration', options: durationOptions, placeholder: 'Any Duration' },
      { key: 'priceRange', label: 'Price Range', options: priceRangeOptions, placeholder: 'Any Price' }
    ];
  }, []);

  // Memoized filtering logic
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Search filter
      const matchesSearch = !searchTerm || 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      // Team filter
      const matchesTeam = selectedFilters.team.length === 0 || 
        selectedFilters.team.includes(getTeam(event));

      // Sport Type filter
      const matchesSportType = selectedFilters.sportType.length === 0 || 
        selectedFilters.sportType.includes(getSportType(event));

      // Venue filter
      const matchesVenue = selectedFilters.venue.length === 0 || 
        selectedFilters.venue.includes(getVenue(event));

      // Season filter
      const matchesSeason = selectedFilters.season.length === 0 || 
        selectedFilters.season.includes(getSeason(event));

      // Event Type filter
      const matchesEventType = selectedFilters.eventType.length === 0 || 
        selectedFilters.eventType.includes(getEventType(event));

      // Duration filter
      const matchesDuration = selectedFilters.duration.length === 0 || 
        selectedFilters.duration.includes(getDuration(event));

      // Price Range filter
      const matchesPriceRange = selectedFilters.priceRange.length === 0 || 
        selectedFilters.priceRange.includes(getPriceRange(event));

      return matchesSearch && matchesTeam && matchesSportType && 
             matchesVenue && matchesSeason && matchesEventType && 
             matchesDuration && matchesPriceRange;
    });
  }, [events, searchTerm, selectedFilters, getTeam, getSportType, getVenue, getSeason, getEventType, getDuration, getPriceRange]);

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
      priceRange: 'See ticketing',
      location: event.location || 'Toronto',
      address: event.location,
      neighborhood: event.location,
      detailPath: `/sporting-events/${event.id}`,
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
      team: [],
      sportType: [],
      venue: [],
      season: [],
      eventType: [],
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
                find tickets to the city's most exciting sporting events.
              </p>
            </div>
            <div className="stats-box">
              <div className="stat">
                <div className="stat-number">{filteredEvents.length}</div>
                <div className="stat-label">Events</div>
              </div>
              <div className="stat">
                <div className="stat-number">6</div>
                <div className="stat-label">Sports</div>
              </div>
              <div className="stat">
                <div className="stat-number">5</div>
                <div className="stat-label">Venues</div>
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

      {/* Sporting Events Grid */}
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
            <h2 className="section-title">Upcoming Sporting Events</h2>
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
          }}>Get Active</h2>
          <p style={{ 
            fontSize: 'var(--text-md)', 
            fontWeight: 'var(--weight-light)',
            marginBottom: 'var(--space-4)',
            color: 'var(--color-gray-90)',
            maxWidth: '400px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Try amateur sports activities and recreational leagues.
          </p>
          <div className="intro-actions">
            <RouterLink to="/amateur-sports" className="btn-primary">View Amateur Sports</RouterLink>
          </div>
        </div>
      </section>
    </Box>
  );
};

export default React.memo(SportingEvents); 