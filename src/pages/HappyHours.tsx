import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Grid, Typography, CircularProgress } from '@mui/material';
import { loadVenues, loadHappyHours, type Venue, type HappyHour } from '../utils/dataLoader';
import EnhancedMinimalistCard, { EnhancedCardData } from '../components/MinimalistCard';
import MultiSelectFilter from '../components/MultiSelectFilter';
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

  // Essential filter states
  const [selectedVenueTypes, setSelectedVenueTypes] = useState<string[]>([]);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);

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

  // Memoized filter options
  const venueTypeOptions = useMemo(() => [
    { value: 'bar', label: 'Bars & Lounges' },
    { value: 'restaurant', label: 'Restaurants' },
    { value: 'pub', label: 'Pubs & Gastropubs' },
    { value: 'club', label: 'Clubs & Nightlife' },
    { value: 'brewery', label: 'Breweries' },
    { value: 'rooftop', label: 'Rooftop Venues' }
  ], []);

  const neighborhoodOptions = useMemo(() => [
    { value: 'downtown', label: 'Downtown' },
    { value: 'king-west', label: 'King West' },
    { value: 'yorkville', label: 'Yorkville' },
    { value: 'entertainment', label: 'Entertainment District' },
    { value: 'ossington', label: 'Ossington' },
    { value: 'waterfront', label: 'Waterfront' }
  ], []);

  // Memoized helper functions
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

  const getIconForVenue = useCallback((venue: VenueWithHappyHours): React.ReactNode => {
    const venueType = getVenueType(venue);
    return iconMap[venueType] || iconMap['bar'];
  }, [getVenueType]);

  // Memoized filtering logic
  const filteredVenues = useMemo(() => {
    return allVenues.filter(venue => {
      // Search filter
      const matchesSearch = !searchTerm || 
        venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.neighborhood.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.happyHours.some(hh => hh.offerings.toLowerCase().includes(searchTerm.toLowerCase()));

      // Venue type filter
      const matchesVenueType = selectedVenueTypes.length === 0 || 
        selectedVenueTypes.includes(getVenueType(venue));

      // Neighborhood filter
      const matchesNeighborhood = selectedNeighborhoods.length === 0 || 
        selectedNeighborhoods.includes(getNeighborhoodCategory(venue.neighborhood));

      return matchesSearch && matchesVenueType && matchesNeighborhood;
    });
  }, [allVenues, searchTerm, selectedVenueTypes, selectedNeighborhoods, getVenueType, getNeighborhoodCategory]);

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

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(12);
  }, [selectedVenueTypes, selectedNeighborhoods, searchTerm]);

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

      {/* Essential Filter Section */}
      <section className="filter-section">
        <div className="swiss-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-3)' }}>
            <MultiSelectFilter
              label="Venue Type"
              options={venueTypeOptions}
              selectedValues={selectedVenueTypes}
              onChange={setSelectedVenueTypes}
              placeholder="All Venue Types"
            />
            <MultiSelectFilter
              label="Neighborhood"
              options={neighborhoodOptions}
              selectedValues={selectedNeighborhoods}
              onChange={setSelectedNeighborhoods}
              placeholder="All Neighborhoods"
            />
          </div>
        </div>
      </section>

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