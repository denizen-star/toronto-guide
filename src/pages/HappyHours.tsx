import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Grid, Typography, CircularProgress } from '@mui/material';
import { loadVenues, loadHappyHours, type Venue, type HappyHour } from '../utils/dataLoader';
import EnhancedMinimalistCard, { EnhancedCardData } from '../components/MinimalistCard';
import EnhancedFilterSystem, { FilterConfig } from '../components/EnhancedFilterSystem';
import { useSearch } from '../components/Layout';
import { LocalBar, Restaurant, SportsBar, NightlifeOutlined, LocalDrink } from '@mui/icons-material';

interface VenueWithHappyHours extends Venue {
  happyHours: HappyHour[];
  tags: string[];
}

// Memoized icon map
const iconMap: { [key: string]: React.ReactNode } = {
  'bar': <LocalBar />,
  'restaurant': <Restaurant />,
  'pub': <SportsBar />,
  'club': <NightlifeOutlined />,
  'brewery': <LocalDrink />,
  'rooftop': <LocalBar />
};

const HappyHours = () => {
  const { searchTerm, setSearchPlaceholder } = useSearch();
  const [allVenues, setAllVenues] = useState<VenueWithHappyHours[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [displayCount, setDisplayCount] = useState(12);

  // Enhanced filter states
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string[] }>({
    venueType: [],
    neighborhood: [],
    eventType: [],
    season: [],
    tags: [],
    duration: [],
    priceRange: []
  });

  useEffect(() => {
    setSearchPlaceholder('Search happy hours...');
  }, [setSearchPlaceholder]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [venues, happyHours] = await Promise.all([
          loadVenues(),
          loadHappyHours()
        ]);

        // Combine venues with their happy hours
        const venuesWithHappyHours: VenueWithHappyHours[] = venues
          .map(venue => {
            const venueHappyHours = happyHours.filter(hh => hh.location_id === venue.id);
            if (venueHappyHours.length === 0) return null;
            
            return {
              ...venue,
              happyHours: venueHappyHours,
              tags: ['Happy Hour', 'Drinks', 'Social']
            };
          })
          .filter((venue): venue is VenueWithHappyHours => venue !== null);

        setAllVenues(venuesWithHappyHours);
        setLoading(false);
      } catch (err) {
        console.error('Error loading happy hours data:', err);
        setError('Failed to load happy hours');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helper functions for categorization
  const getVenueType = useCallback((venue: VenueWithHappyHours): string => {
    const name = venue.name.toLowerCase();
    
    if (name.includes('bar') || name.includes('lounge')) return 'bar';
    if (name.includes('restaurant') || name.includes('bistro')) return 'restaurant';
    if (name.includes('pub') || name.includes('gastropub')) return 'pub';
    if (name.includes('club') || name.includes('nightclub')) return 'club';
    if (name.includes('brewery') || name.includes('taproom')) return 'brewery';
    if (name.includes('rooftop')) return 'rooftop';
    return 'bar';
  }, []);

  const getNeighborhoodCategory = useCallback((neighborhood: string): string => {
    const n = neighborhood.toLowerCase();
    
    if (n.includes('downtown') || n.includes('financial')) return 'downtown';
    if (n.includes('king west') || n.includes('liberty')) return 'king-west';
    if (n.includes('yorkville') || n.includes('midtown')) return 'yorkville';
    if (n.includes('entertainment') || n.includes('theatre')) return 'entertainment';
    if (n.includes('ossington') || n.includes('trinity')) return 'ossington';
    if (n.includes('waterfront') || n.includes('harbourfront')) return 'waterfront';
    return 'downtown';
  }, []);

  const getEventType = useCallback((venue: VenueWithHappyHours): string => {
    const offerings = venue.happyHours[0]?.offerings.toLowerCase() || '';
    
    if (offerings.includes('wine') || offerings.includes('vino')) return 'wine-special';
    if (offerings.includes('cocktail') || offerings.includes('mixed')) return 'cocktail-special';
    if (offerings.includes('beer') || offerings.includes('draft')) return 'beer-special';
    if (offerings.includes('food') || offerings.includes('appetizer')) return 'food-drink';
    if (offerings.includes('live') || offerings.includes('music')) return 'entertainment';
    return 'drink-special';
  }, []);

  const getDuration = useCallback((venue: VenueWithHappyHours): string => {
    if (venue.happyHours.length === 0) return 'varies';
    
    const hh = venue.happyHours[0];
    const startHour = parseInt(hh.start_time.split(':')[0]);
    const endHour = parseInt(hh.end_time.split(':')[0]);
    const duration = endHour - startHour;
    
    if (duration <= 2) return 'short';
    if (duration <= 4) return 'medium';
    return 'extended';
  }, []);

  const getPriceRange = useCallback((venue: VenueWithHappyHours): string => {
    const offerings = venue.happyHours[0]?.offerings.toLowerCase() || '';
    
    if (offerings.includes('$3') || offerings.includes('$4')) return 'budget';
    if (offerings.includes('$5') || offerings.includes('$6') || offerings.includes('$7')) return 'moderate';
    if (offerings.includes('$8') || offerings.includes('$9') || offerings.includes('$10')) return 'premium';
    return 'varies';
  }, []);

  const getIconForVenue = useCallback((venue: VenueWithHappyHours): React.ReactNode => {
    const venueType = getVenueType(venue);
    return iconMap[venueType] || iconMap['bar'];
  }, [getVenueType]);

  // Create filter configurations
  const filterConfigs: FilterConfig[] = useMemo(() => {
    const venueTypeOptions = [
      { value: 'bar', label: 'Bars & Lounges' },
      { value: 'restaurant', label: 'Restaurants' },
      { value: 'pub', label: 'Pubs & Gastropubs' },
      { value: 'club', label: 'Clubs & Nightlife' },
      { value: 'brewery', label: 'Breweries' },
      { value: 'rooftop', label: 'Rooftop Venues' }
    ];

    const neighborhoodOptions = [
      { value: 'downtown', label: 'Downtown' },
      { value: 'king-west', label: 'King West' },
      { value: 'yorkville', label: 'Yorkville' },
      { value: 'entertainment', label: 'Entertainment District' },
      { value: 'ossington', label: 'Ossington' },
      { value: 'waterfront', label: 'Waterfront' }
    ];

    const eventTypeOptions = [
      { value: 'wine-special', label: 'Wine Specials' },
      { value: 'cocktail-special', label: 'Cocktail Specials' },
      { value: 'beer-special', label: 'Beer Specials' },
      { value: 'food-drink', label: 'Food & Drink Combos' },
      { value: 'entertainment', label: 'Entertainment' },
      { value: 'drink-special', label: 'General Drink Specials' }
    ];

    const durationOptions = [
      { value: 'short', label: 'Short (2 hours)' },
      { value: 'medium', label: 'Medium (3-4 hours)' },
      { value: 'extended', label: 'Extended (5+ hours)' },
      { value: 'varies', label: 'Varies' }
    ];

    const priceRangeOptions = [
      { value: 'budget', label: 'Budget ($3-5)' },
      { value: 'moderate', label: 'Moderate ($5-8)' },
      { value: 'premium', label: 'Premium ($8-12)' },
      { value: 'varies', label: 'Varies' }
    ];

    const tagOptions = [
      { value: 'happy-hour', label: 'Happy Hour' },
      { value: 'drinks', label: 'Drinks' },
      { value: 'social', label: 'Social' },
      { value: 'after-work', label: 'After Work' },
      { value: 'date-night', label: 'Date Night' },
      { value: 'group-friendly', label: 'Group Friendly' }
    ];

    return [
      { key: 'venueType', label: 'Venue Type', options: venueTypeOptions, placeholder: 'All Venue Types' },
      { key: 'neighborhood', label: 'Neighborhood', options: neighborhoodOptions, placeholder: 'All Neighborhoods' },
      { key: 'eventType', label: 'Special Type', options: eventTypeOptions, placeholder: 'All Specials' },
      { key: 'duration', label: 'Duration', options: durationOptions, placeholder: 'Any Duration' },
      { key: 'priceRange', label: 'Price Range', options: priceRangeOptions, placeholder: 'Any Price' },
      { key: 'tags', label: 'Tags', options: tagOptions, placeholder: 'Select Tags' }
    ];
  }, []);

  // Memoized filtering logic
  const filteredVenues = useMemo(() => {
    return allVenues.filter(venue => {
      // Search filter
      const matchesSearch = !searchTerm || 
        venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.neighborhood.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.happyHours.some(hh => hh.offerings.toLowerCase().includes(searchTerm.toLowerCase()));

      // Venue type filter
      const matchesVenueType = selectedFilters.venueType.length === 0 || 
        selectedFilters.venueType.includes(getVenueType(venue));

      // Neighborhood filter
      const matchesNeighborhood = selectedFilters.neighborhood.length === 0 || 
        selectedFilters.neighborhood.includes(getNeighborhoodCategory(venue.neighborhood));

      // Event Type filter
      const matchesEventType = selectedFilters.eventType.length === 0 || 
        selectedFilters.eventType.includes(getEventType(venue));

      // Duration filter
      const matchesDuration = selectedFilters.duration.length === 0 || 
        selectedFilters.duration.includes(getDuration(venue));

      // Price Range filter
      const matchesPriceRange = selectedFilters.priceRange.length === 0 || 
        selectedFilters.priceRange.includes(getPriceRange(venue));

      // Tags filter
      const matchesTags = selectedFilters.tags.length === 0 || 
        selectedFilters.tags.some(selectedTag => 
          venue.tags.some(venueTag => 
            venueTag.toLowerCase().replace(/\s+/g, '-') === selectedTag
          )
        );

      return matchesSearch && matchesVenueType && matchesNeighborhood && 
             matchesEventType && matchesDuration && matchesPriceRange && matchesTags;
    });
  }, [allVenues, searchTerm, selectedFilters, getVenueType, getNeighborhoodCategory, getEventType, getDuration, getPriceRange]);

  // Memoized displayed venues
  const displayedVenues = useMemo(() => 
    filteredVenues.slice(0, displayCount), 
    [filteredVenues, displayCount]
  );

  // Memoized card data conversion
  const cardDataArray = useMemo(() => {
    return displayedVenues.map((venue): EnhancedCardData => {
      const formatHappyHourTime = venue.happyHours.length > 0 
        ? `${venue.happyHours[0].start_time} - ${venue.happyHours[0].end_time}`
        : 'Check venue';
      
      const offerings = venue.happyHours.length > 0 
        ? venue.happyHours[0].offerings 
        : 'Special offers available';

      return {
        id: venue.id.toString(),
        title: venue.name,
        description: offerings,
        website: venue.website,
        tags: venue.tags.slice(0, 3),
        priceRange: formatHappyHourTime,
        location: venue.neighborhood,
        address: venue.address,
        coordinates: {
          lat: venue.lat,
          lng: venue.lng,
        },
        neighborhood: venue.neighborhood,
        detailPath: `/happy-hours/${venue.id}`,
      };
    });
  }, [displayedVenues]);

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
      venueType: [],
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
            <li>Happy Hours</li>
          </ul>
        </div>
      </section>

      {/* Page Header */}
      <section className="page-header">
        <div className="swiss-container">
          <div className="header-content">
            <div>
              <h1 className="page-title">Happy Hours</h1>
              <p className="page-subtitle">
                Discover Toronto's best happy hour deals and after-work destinations. 
                Carefully selected venues offering exceptional value and atmosphere.
              </p>
            </div>
            <div className="stats-box">
              <div className="stat">
                <div className="stat-number">{filteredVenues.length}</div>
                <div className="stat-label">Venues</div>
              </div>
              <div className="stat">
                <div className="stat-number">6</div>
                <div className="stat-label">Venue Types</div>
              </div>
              <div className="stat">
                <div className="stat-number">6</div>
                <div className="stat-label">Neighborhoods</div>
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

      {/* Happy Hours Grid */}
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
              {filteredVenues.length} Results
            </div>
            <h2 className="section-title">Available Happy Hours</h2>
          </div>
          
          {filteredVenues.length === 0 ? (
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
                No happy hours found
              </div>
              <p>Try adjusting your search terms or filters</p>
            </div>
          ) : (
            <>
              <Grid container spacing={3}>
                {cardDataArray.map((cardData, index) => {
                  const venue = displayedVenues[index];
                  return (
                    <Grid item xs={12} sm={6} md={4} key={venue.id}>
                      <EnhancedMinimalistCard
                        data={cardData}
                        icon={getIconForVenue(venue)}
                        color="secondary"
                      />
                    </Grid>
                  );
                })}
              </Grid>

              {displayedVenues.length < filteredVenues.length && (
                <div style={{ textAlign: 'center', marginTop: 'var(--space-6)' }}>
                  <button 
                    className="btn-secondary"
                    onClick={handleLoadMore}
                  >
                    Load More Venues ({filteredVenues.length - displayedVenues.length} remaining)
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

export default React.memo(HappyHours); 