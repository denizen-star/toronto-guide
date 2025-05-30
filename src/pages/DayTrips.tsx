import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Grid, Typography, CircularProgress } from '@mui/material';
import { 
  loadStandardizedDayTrips, 
  type StandardizedDayTrip 
} from '../utils/dataLoader';
import EnhancedMinimalistCard, { EnhancedCardData } from '../components/MinimalistCard';
import MultiSelectFilter from '../components/MultiSelectFilter';
import { useSearch } from '../components/Layout';
import { 
  DriveEta, 
  Nature, 
  LocalDining, 
  Museum, 
  LocalBar, 
  Castle,
  Park
} from '@mui/icons-material';

// Memoized icon map for day trip categories
const iconMap: { [key: string]: React.ReactNode } = {
  'nature': <Nature />,
  'wine': <LocalBar />,
  'historic': <Castle />,
  'cultural': <Museum />,
  'food': <LocalDining />,
  'outdoor': <Park />,
  'scenic': <DriveEta />
};

const DayTrips = () => {
  const { searchTerm, setSearchPlaceholder } = useSearch();
  const [dayTrips, setDayTrips] = useState<StandardizedDayTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [displayCount, setDisplayCount] = useState(12);
  
  // Essential filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDistances, setSelectedDistances] = useState<string[]>([]);

  useEffect(() => {
    setSearchPlaceholder('Search day trips...');
  }, [setSearchPlaceholder]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const dayTripsData = await loadStandardizedDayTrips();
        setDayTrips(dayTripsData);
        setLoading(false);
      } catch (err) {
        console.error('Error loading day trips:', err);
        setError('Failed to load day trips');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Memoized filter options
  const categoryOptions = useMemo(() => [
    { value: 'nature', label: 'Nature & Outdoor' },
    { value: 'wine', label: 'Wine Country' },
    { value: 'historic', label: 'Historic Sites' },
    { value: 'cultural', label: 'Cultural Attractions' },
    { value: 'food', label: 'Food & Dining' },
    { value: 'scenic', label: 'Scenic Routes' }
  ], []);

  const distanceOptions = useMemo(() => [
    { value: 'close', label: 'Under 1 Hour' },
    { value: 'medium', label: '1-2 Hours' },
    { value: 'far', label: '2+ Hours' }
  ], []);

  // Memoized helper functions
  const getCategoryFromTags = useCallback((tags: string[]): string => {
    const tagString = tags.join(' ').toLowerCase();
    
    if (tagString.includes('wine') || tagString.includes('vineyard')) return 'wine';
    if (tagString.includes('nature') || tagString.includes('hiking') || tagString.includes('outdoor')) return 'nature';
    if (tagString.includes('historic') || tagString.includes('heritage')) return 'historic';
    if (tagString.includes('museum') || tagString.includes('cultural')) return 'cultural';
    if (tagString.includes('food') || tagString.includes('dining')) return 'food';
    if (tagString.includes('scenic') || tagString.includes('drive')) return 'scenic';
    
    return 'nature'; // default
  }, []);

  const getDistanceCategory = useCallback((distance: string): string => {
    const dist = distance.toLowerCase();
    
    if (dist.includes('30 min') || dist.includes('45 min')) return 'close';
    if (dist.includes('1 hour') || dist.includes('1.5 hour')) return 'medium';
    return 'far';
  }, []);

  const getIconForTrip = useCallback((trip: StandardizedDayTrip): React.ReactNode => {
    const category = getCategoryFromTags(trip.tags);
    return iconMap[category] || iconMap['nature'];
  }, [getCategoryFromTags]);

  // Memoized filtering logic
  const filteredDayTrips = useMemo(() => {
    return dayTrips.filter(trip => {
      // Search filter
      const matchesSearch = !searchTerm || 
        trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      // Category filter
      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.includes(getCategoryFromTags(trip.tags));

      // Distance filter
      const matchesDistance = selectedDistances.length === 0 || 
        selectedDistances.includes(getDistanceCategory(trip.distance));

      return matchesSearch && matchesCategory && matchesDistance;
    });
  }, [dayTrips, searchTerm, selectedCategories, selectedDistances, getCategoryFromTags, getDistanceCategory]);

  // Memoized displayed day trips
  const displayedDayTrips = useMemo(() => 
    filteredDayTrips.slice(0, displayCount), 
    [filteredDayTrips, displayCount]
  );

  // Memoized card data conversion
  const cardDataArray = useMemo(() => {
    return displayedDayTrips.map((trip): EnhancedCardData => ({
      id: trip.id,
      title: trip.title,
      description: trip.description,
      website: trip.website,
      tags: trip.tags.slice(0, 3),
      priceRange: 'See details',
      location: trip.location,
      address: trip.location,
      lgbtqFriendly: trip.lgbtqFriendly,
      neighborhood: trip.location,
      detailPath: `/day-trips/${trip.id}`,
    }));
  }, [displayedDayTrips]);

  const handleLoadMore = useCallback(() => {
    setDisplayCount(prev => prev + 12);
  }, []);

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(12);
  }, [selectedCategories, selectedDistances, searchTerm]);

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
            <li>Day Trips</li>
          </ul>
        </div>
      </section>

      {/* Page Header */}
      <section className="page-header">
        <div className="swiss-container">
          <div className="header-content">
            <div>
              <h1 className="page-title">Day Trips</h1>
              <p className="page-subtitle">
                Escape the city with carefully curated day trips across Ontario. 
                From wine country adventures to historic towns, discover the perfect getaway.
              </p>
            </div>
            <div className="stats-box">
              <div className="stat">
                <div className="stat-number">{filteredDayTrips.length}</div>
                <div className="stat-label">Destinations</div>
              </div>
              <div className="stat">
                <div className="stat-number">6</div>
                <div className="stat-label">Categories</div>
              </div>
              <div className="stat">
                <div className="stat-number">3</div>
                <div className="stat-label">Distance Ranges</div>
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
              label="Distance"
              options={distanceOptions}
              selectedValues={selectedDistances}
              onChange={setSelectedDistances}
              placeholder="Any Distance"
            />
          </div>
        </div>
      </section>

      {/* Day Trips Grid */}
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
              {filteredDayTrips.length} Results
            </div>
            <h2 className="section-title">Available Day Trips</h2>
          </div>
          
          {filteredDayTrips.length === 0 ? (
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
                No day trips found
              </div>
              <p>Try adjusting your search terms or filters</p>
            </div>
          ) : (
            <>
              <Grid container spacing={3}>
                {cardDataArray.map((cardData, index) => {
                  const trip = displayedDayTrips[index];
                  return (
                    <Grid item xs={12} sm={6} md={4} key={trip.id}>
                      <EnhancedMinimalistCard
                        data={cardData}
                        icon={getIconForTrip(trip)}
                        color="success"
                      />
                    </Grid>
                  );
                })}
              </Grid>

              {displayedDayTrips.length < filteredDayTrips.length && (
                <div style={{ textAlign: 'center', marginTop: 'var(--space-6)' }}>
                  <button 
                    className="btn-secondary"
                    onClick={handleLoadMore}
                  >
                    Load More Trips ({filteredDayTrips.length - displayedDayTrips.length} remaining)
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
          }}>Plan Your Adventure</h2>
          <p style={{ 
            fontSize: 'var(--text-md)', 
            fontWeight: 'var(--weight-light)',
            marginBottom: 'var(--space-4)',
            color: 'var(--color-gray-90)',
            maxWidth: '400px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Discover more activities and events in Toronto.
          </p>
          <div className="intro-actions">
            <RouterLink to="/activities" className="btn-primary">View Activities</RouterLink>
          </div>
        </div>
      </section>
    </Box>
  );
};

export default React.memo(DayTrips); 