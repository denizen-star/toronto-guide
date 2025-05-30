import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Grid, Typography, CircularProgress } from '@mui/material';
import { 
  loadStandardizedDayTrips, 
  type StandardizedDayTrip 
} from '../utils/dataLoader';
import EnhancedMinimalistCard, { EnhancedCardData } from '../components/MinimalistCard';
import EnhancedFilterSystem, { FilterConfig } from '../components/EnhancedFilterSystem';
import { useSearch } from '../components/Layout';
import { 
  Nature, 
  LocationOn, 
  DirectionsCar,
  Castle,
  SportsBar,
  Museum,
  Water
} from '@mui/icons-material';

// Memoized icon map for day trips
const iconMap: { [key: string]: React.ReactNode } = {
  'nature': <Nature />,
  'wine': <SportsBar />,
  'historic': <Castle />,
  'beach': <Water />,
  'cultural': <Museum />,
  'adventure': <DirectionsCar />,
  'scenic': <LocationOn />
};

const DayTrips = () => {
  const { searchTerm, setSearchPlaceholder } = useSearch();
  const [trips, setTrips] = useState<StandardizedDayTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [displayCount, setDisplayCount] = useState(12);
  
  // Enhanced filter states
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string[] }>({
    category: [],
    distance: [],
    highlights: [],
    season: [],
    tags: [],
    duration: [],
    priceRange: []
  });

  useEffect(() => {
    setSearchPlaceholder('Search day trips...');
  }, [setSearchPlaceholder]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const tripsData = await loadStandardizedDayTrips();
        setTrips(tripsData);
        setLoading(false);
      } catch (err) {
        console.error('Error loading day trips:', err);
        setError('Failed to load day trips');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helper functions for categorization
  const getTripCategory = useCallback((trip: StandardizedDayTrip): string => {
    const title = trip.title.toLowerCase();
    const description = trip.description.toLowerCase();
    const tags = trip.tags.join(' ').toLowerCase();
    
    if (tags.includes('wine') || title.includes('wine') || description.includes('wine')) return 'wine';
    if (tags.includes('nature') || title.includes('nature') || description.includes('park')) return 'nature';
    if (tags.includes('historic') || title.includes('historic') || description.includes('heritage')) return 'historic';
    if (tags.includes('beach') || title.includes('beach') || description.includes('waterfront')) return 'beach';
    if (tags.includes('cultural') || title.includes('cultural') || description.includes('museum')) return 'cultural';
    if (tags.includes('adventure') || title.includes('adventure') || description.includes('outdoor')) return 'adventure';
    return 'scenic';
  }, []);

  const getDistance = useCallback((trip: StandardizedDayTrip): string => {
    const location = trip.location?.toLowerCase() || '';
    
    if (location.includes('toronto') || location.includes('gta')) return 'local';
    if (location.includes('niagara') || location.includes('muskoka')) return 'medium';
    if (location.includes('ottawa') || location.includes('kingston')) return 'far';
    return 'medium'; // default
  }, []);

  const getHighlights = useCallback((trip: StandardizedDayTrip): string[] => {
    const tags = trip.tags.join(' ').toLowerCase();
    const description = trip.description.toLowerCase();
    const highlights: string[] = [];
    
    if (tags.includes('family') || description.includes('family')) highlights.push('family-friendly');
    if (tags.includes('romantic') || description.includes('romantic')) highlights.push('romantic');
    if (tags.includes('photography') || description.includes('photo')) highlights.push('photography');
    if (tags.includes('food') || description.includes('dining')) highlights.push('culinary');
    if (tags.includes('shopping') || description.includes('shop')) highlights.push('shopping');
    if (tags.includes('historic') || description.includes('historic')) highlights.push('historic-sites');
    
    return highlights.length > 0 ? highlights : ['scenic-views'];
  }, []);

  const getSeason = useCallback((trip: StandardizedDayTrip): string => {
    const tags = trip.tags.join(' ').toLowerCase();
    const description = trip.description.toLowerCase();
    
    if (tags.includes('winter') || description.includes('winter') || description.includes('ski')) return 'winter';
    if (tags.includes('spring') || description.includes('spring') || description.includes('bloom')) return 'spring';
    if (tags.includes('summer') || description.includes('summer') || description.includes('beach')) return 'summer';
    if (tags.includes('fall') || tags.includes('autumn') || description.includes('foliage')) return 'fall';
    return 'year-round';
  }, []);

  const getDuration = useCallback((trip: StandardizedDayTrip): string => {
    const description = trip.description.toLowerCase();
    
    if (description.includes('half day') || description.includes('4 hour')) return 'half-day';
    if (description.includes('full day') || description.includes('8 hour')) return 'full-day';
    if (description.includes('weekend') || description.includes('overnight')) return 'weekend';
    return 'full-day'; // default
  }, []);

  const getPriceRange = useCallback((trip: StandardizedDayTrip): string => {
    const description = trip.description.toLowerCase();
    
    if (description.includes('free') || description.includes('$0')) return 'free';
    if (description.includes('$') && (description.includes('25') || description.includes('30'))) return 'budget';
    if (description.includes('$') && (description.includes('50') || description.includes('75'))) return 'moderate';
    if (description.includes('$') && description.includes('100')) return 'premium';
    return 'varies';
  }, []);

  const getIconForTrip = useCallback((trip: StandardizedDayTrip): React.ReactNode => {
    const category = getTripCategory(trip);
    return iconMap[category] || iconMap['scenic'];
  }, [getTripCategory]);

  // Create filter configurations
  const filterConfigs: FilterConfig[] = useMemo(() => {
    const categoryOptions = [
      { value: 'wine', label: 'Wine Country' },
      { value: 'nature', label: 'Nature & Parks' },
      { value: 'historic', label: 'Historic Sites' },
      { value: 'beach', label: 'Beaches & Waterfront' },
      { value: 'cultural', label: 'Cultural Attractions' },
      { value: 'adventure', label: 'Adventure & Outdoor' },
      { value: 'scenic', label: 'Scenic Drives' }
    ];

    const distanceOptions = [
      { value: 'local', label: 'Local (0-50km)' },
      { value: 'medium', label: 'Medium (50-150km)' },
      { value: 'far', label: 'Far (150km+)' }
    ];

    const highlightOptions = [
      { value: 'family-friendly', label: 'Family Friendly' },
      { value: 'romantic', label: 'Romantic' },
      { value: 'photography', label: 'Photography' },
      { value: 'culinary', label: 'Culinary Experiences' },
      { value: 'shopping', label: 'Shopping' },
      { value: 'historic-sites', label: 'Historic Sites' },
      { value: 'scenic-views', label: 'Scenic Views' }
    ];

    const seasonOptions = [
      { value: 'spring', label: 'Spring' },
      { value: 'summer', label: 'Summer' },
      { value: 'fall', label: 'Fall' },
      { value: 'winter', label: 'Winter' },
      { value: 'year-round', label: 'Year Round' }
    ];

    const durationOptions = [
      { value: 'half-day', label: 'Half Day (4-6 hours)' },
      { value: 'full-day', label: 'Full Day (6-10 hours)' },
      { value: 'weekend', label: 'Weekend (2+ days)' }
    ];

    const priceRangeOptions = [
      { value: 'free', label: 'Free' },
      { value: 'budget', label: 'Budget ($0-50)' },
      { value: 'moderate', label: 'Moderate ($50-100)' },
      { value: 'premium', label: 'Premium ($100+)' },
      { value: 'varies', label: 'Varies' }
    ];

    // Get unique tags from trips
    const allTags = trips.reduce((tags: Set<string>, trip) => {
      trip.tags.forEach(tag => tags.add(tag));
      return tags;
    }, new Set<string>());

    const tagOptions = Array.from(allTags).map(tag => ({
      value: tag.toLowerCase().replace(/\s+/g, '-'),
      label: tag
    }));

    return [
      { key: 'category', label: 'Trip Category', options: categoryOptions, placeholder: 'All Categories' },
      { key: 'distance', label: 'Distance', options: distanceOptions, placeholder: 'Any Distance' },
      { key: 'highlights', label: 'Highlights', options: highlightOptions, placeholder: 'Select Highlights' },
      { key: 'season', label: 'Season', options: seasonOptions, placeholder: 'All Seasons' },
      { key: 'duration', label: 'Duration', options: durationOptions, placeholder: 'Any Duration' },
      { key: 'priceRange', label: 'Price Range', options: priceRangeOptions, placeholder: 'Any Price' },
      { key: 'tags', label: 'Tags', options: tagOptions.slice(0, 15), placeholder: 'Select Tags' }
    ];
  }, [trips]);

  // Memoized filtering logic
  const filteredTrips = useMemo(() => {
    return trips.filter(trip => {
      // Search filter
      const matchesSearch = !searchTerm || 
        trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      // Category filter
      const matchesCategory = selectedFilters.category.length === 0 || 
        selectedFilters.category.includes(getTripCategory(trip));

      // Distance filter
      const matchesDistance = selectedFilters.distance.length === 0 || 
        selectedFilters.distance.includes(getDistance(trip));

      // Highlights filter
      const matchesHighlights = selectedFilters.highlights.length === 0 || 
        selectedFilters.highlights.some(selectedHighlight => 
          getHighlights(trip).includes(selectedHighlight)
        );

      // Season filter
      const matchesSeason = selectedFilters.season.length === 0 || 
        selectedFilters.season.includes(getSeason(trip));

      // Duration filter
      const matchesDuration = selectedFilters.duration.length === 0 || 
        selectedFilters.duration.includes(getDuration(trip));

      // Price Range filter
      const matchesPriceRange = selectedFilters.priceRange.length === 0 || 
        selectedFilters.priceRange.includes(getPriceRange(trip));

      // Tags filter
      const matchesTags = selectedFilters.tags.length === 0 || 
        selectedFilters.tags.some(selectedTag => 
          trip.tags.some(tripTag => 
            tripTag.toLowerCase().replace(/\s+/g, '-') === selectedTag
          )
        );

      return matchesSearch && matchesCategory && matchesDistance && 
             matchesHighlights && matchesSeason && matchesDuration && 
             matchesPriceRange && matchesTags;
    });
  }, [trips, searchTerm, selectedFilters, getTripCategory, getDistance, getHighlights, getSeason, getDuration, getPriceRange]);

  // Memoized displayed trips
  const displayedTrips = useMemo(() => 
    filteredTrips.slice(0, displayCount), 
    [filteredTrips, displayCount]
  );

  // Memoized card data conversion
  const cardDataArray = useMemo(() => {
    return displayedTrips.map((trip): EnhancedCardData => ({
      id: trip.id,
      title: trip.title,
      description: trip.description,
      website: trip.website,
      tags: trip.tags.slice(0, 3),
      priceRange: 'See details',
      location: trip.location || 'Greater Toronto Area',
      address: trip.location,
      neighborhood: trip.location,
      detailPath: `/day-trips/${trip.id}`,
    }));
  }, [displayedTrips]);

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
      distance: [],
      highlights: [],
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
                Escape the city with carefully curated day trip destinations. 
                From wine country to historic towns, discover Ontario's finest attractions within reach of Toronto.
              </p>
            </div>
            <div className="stats-box">
              <div className="stat">
                <div className="stat-number">{filteredTrips.length}</div>
                <div className="stat-label">Trip Options</div>
              </div>
              <div className="stat">
                <div className="stat-number">7</div>
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

      {/* Enhanced Filter Section */}
      <EnhancedFilterSystem
        filters={filterConfigs}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

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
              {filteredTrips.length} Results
            </div>
            <h2 className="section-title">Available Day Trips</h2>
          </div>
          
          {filteredTrips.length === 0 ? (
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
                  const trip = displayedTrips[index];
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

              {displayedTrips.length < filteredTrips.length && (
                <div style={{ textAlign: 'center', marginTop: 'var(--space-6)' }}>
                  <button 
                    className="btn-secondary"
                    onClick={handleLoadMore}
                  >
                    Load More Trips ({filteredTrips.length - displayedTrips.length} remaining)
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
            Discover more activities and experiences in Toronto.
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