import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Grid, Typography, CircularProgress } from '@mui/material';
import { 
  loadActivities, 
  loadLocations, 
  loadCategories, 
  type Activity, 
  type Category,
  type Location,
} from '../utils/dataLoader';
import EnhancedMinimalistCard, { EnhancedCardData } from '../components/MinimalistCard';
import EnhancedFilterSystem, { FilterConfig } from '../components/EnhancedFilterSystem';
import { useSearch } from '../components/Layout';
import { Museum, Palette, LocalActivity, Explore, LocationOn, EventNote } from '@mui/icons-material';

// Memoized icon map to prevent recreation on each render
const iconMap: { [key: string]: React.ReactNode } = {
  '1': <Museum />,
  '2': <LocalActivity />,
  '3': <Explore />,
  '4': <Palette />,
  'outdoor': <Explore />,
  'cultural': <Palette />,
  'food': <LocalActivity />,
  'nightlife': <EventNote />,
  'shopping': <LocalActivity />,
  'sports': <LocalActivity />,
  'entertainment': <Palette />,
  'wellness': <LocationOn />
};

const Activities = () => {
  const { searchTerm, setSearchPlaceholder } = useSearch();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [locations, setLocations] = useState<{ [key: string]: Location }>({});
  const [categories, setCategories] = useState<{ [key: string]: Category }>({});
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
    setSearchPlaceholder('Search activities...');
  }, [setSearchPlaceholder]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [activitiesData, locationsData, categoriesData] = await Promise.all([
          loadActivities(),
          loadLocations(),
          loadCategories(),
        ]);
        
        setActivities(activitiesData);
        
        // Create lookup maps for faster access
        const locationMap = locationsData.reduce((acc: { [key: string]: Location }, location: Location) => {
          acc[location.id] = location;
          return acc;
        }, {});
        setLocations(locationMap);
        
        const categoryMap = categoriesData.reduce((acc: { [key: string]: Category }, category: Category) => {
          acc[category.id] = category;
          return acc;
        }, {});
        setCategories(categoryMap);

        setLoading(false);
      } catch (err) {
        console.error('Error loading activities:', err);
        setError('Failed to load activities');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helper functions for categorization
  const getEventType = useCallback((activity: Activity): string => {
    const title = activity.title.toLowerCase();
    const description = activity.description.toLowerCase();
    
    if (title.includes('tour') || description.includes('tour')) return 'tour';
    if (title.includes('workshop') || description.includes('workshop')) return 'workshop';
    if (title.includes('exhibition') || description.includes('exhibition')) return 'exhibition';
    if (title.includes('performance') || description.includes('performance')) return 'performance';
    if (title.includes('class') || description.includes('class')) return 'class';
    return 'experience';
  }, []);

  const getSeason = useCallback((activity: Activity): string => {
    const tags = activity.tags.join(' ').toLowerCase();
    const description = activity.description.toLowerCase();
    
    if (tags.includes('winter') || description.includes('winter')) return 'winter';
    if (tags.includes('spring') || description.includes('spring')) return 'spring';
    if (tags.includes('summer') || description.includes('summer')) return 'summer';
    if (tags.includes('fall') || tags.includes('autumn') || description.includes('fall')) return 'fall';
    return 'year-round';
  }, []);

  const getDuration = useCallback((activity: Activity): string => {
    const description = activity.description.toLowerCase();
    
    if (description.includes('1 hour') || description.includes('60 min')) return 'short';
    if (description.includes('2 hour') || description.includes('3 hour')) return 'medium';
    if (description.includes('half day') || description.includes('4 hour')) return 'half-day';
    if (description.includes('full day') || description.includes('8 hour')) return 'full-day';
    return 'varies';
  }, []);

  const getPriceRange = useCallback((activity: Activity): string => {
    // Simple price categorization based on typical Toronto activity prices
    return 'varies'; // Could be enhanced with actual price data
  }, []);

  const getNeighborhood = useCallback((activity: Activity): string => {
    const neighborhood = activity.neighborhood?.toLowerCase() || '';
    const city = activity.city.toLowerCase();
    
    if (neighborhood.includes('downtown') || city.includes('downtown')) return 'downtown';
    if (neighborhood.includes('midtown') || neighborhood.includes('yorkville')) return 'midtown';
    if (neighborhood.includes('uptown') || neighborhood.includes('north')) return 'uptown';
    if (neighborhood.includes('east') || neighborhood.includes('beaches')) return 'east-end';
    if (neighborhood.includes('west') || neighborhood.includes('junction')) return 'west-end';
    if (neighborhood.includes('harbourfront') || neighborhood.includes('waterfront')) return 'waterfront';
    return 'other';
  }, []);

  // Create filter configurations
  const filterConfigs: FilterConfig[] = useMemo(() => {
    const categoryOptions = Object.entries(categories).map(([id, category]) => ({
      value: id,
      label: category.name
    }));

    const neighborhoodOptions = [
      { value: 'downtown', label: 'Downtown' },
      { value: 'midtown', label: 'Midtown' },
      { value: 'uptown', label: 'Uptown' },
      { value: 'east-end', label: 'East End' },
      { value: 'west-end', label: 'West End' },
      { value: 'waterfront', label: 'Waterfront' },
      { value: 'other', label: 'Other Areas' }
    ];

    const eventTypeOptions = [
      { value: 'tour', label: 'Tours & Sightseeing' },
      { value: 'workshop', label: 'Workshops' },
      { value: 'exhibition', label: 'Exhibitions' },
      { value: 'performance', label: 'Performances' },
      { value: 'class', label: 'Classes' },
      { value: 'experience', label: 'Experiences' }
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
      { value: 'varies', label: 'Varies' }
    ];

    const priceRangeOptions = [
      { value: 'free', label: 'Free' },
      { value: 'budget', label: 'Budget ($0-25)' },
      { value: 'moderate', label: 'Moderate ($25-75)' },
      { value: 'premium', label: 'Premium ($75-150)' },
      { value: 'luxury', label: 'Luxury ($150+)' },
      { value: 'varies', label: 'Varies' }
    ];

    // Get unique tags from activities
    const allTags = activities.reduce((tags: Set<string>, activity) => {
      activity.tags.forEach(tag => tags.add(tag));
      return tags;
    }, new Set<string>());

    const tagOptions = Array.from(allTags).map(tag => ({
      value: tag.toLowerCase().replace(/\s+/g, '-'),
      label: tag
    }));

    return [
      { key: 'category', label: 'Category', options: categoryOptions, placeholder: 'All Categories' },
      { key: 'neighborhood', label: 'Neighborhood', options: neighborhoodOptions, placeholder: 'All Neighborhoods' },
      { key: 'eventType', label: 'Event Type', options: eventTypeOptions, placeholder: 'All Event Types' },
      { key: 'season', label: 'Season', options: seasonOptions, placeholder: 'All Seasons' },
      { key: 'duration', label: 'Duration', options: durationOptions, placeholder: 'Any Duration' },
      { key: 'priceRange', label: 'Price Range', options: priceRangeOptions, placeholder: 'Any Price' },
      { key: 'tags', label: 'Tags', options: tagOptions.slice(0, 20), placeholder: 'Select Tags' } // Limit tags for performance
    ];
  }, [categories, activities]);

  // Memoized filtering logic
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      // Search filter
      const matchesSearch = !searchTerm || 
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (activity.neighborhood && activity.neighborhood.toLowerCase().includes(searchTerm.toLowerCase()));

      // Category filter
      const matchesCategory = selectedFilters.category.length === 0 || 
        selectedFilters.category.includes(activity.categoryId);

      // Neighborhood filter
      const matchesNeighborhood = selectedFilters.neighborhood.length === 0 || 
        selectedFilters.neighborhood.includes(getNeighborhood(activity));

      // Event Type filter
      const matchesEventType = selectedFilters.eventType.length === 0 || 
        selectedFilters.eventType.includes(getEventType(activity));

      // Season filter
      const matchesSeason = selectedFilters.season.length === 0 || 
        selectedFilters.season.includes(getSeason(activity));

      // Duration filter
      const matchesDuration = selectedFilters.duration.length === 0 || 
        selectedFilters.duration.includes(getDuration(activity));

      // Price Range filter
      const matchesPriceRange = selectedFilters.priceRange.length === 0 || 
        selectedFilters.priceRange.includes(getPriceRange(activity));

      // Tags filter
      const matchesTags = selectedFilters.tags.length === 0 || 
        selectedFilters.tags.some(selectedTag => 
          activity.tags.some(activityTag => 
            activityTag.toLowerCase().replace(/\s+/g, '-') === selectedTag
          )
        );

      return matchesSearch && matchesCategory && matchesNeighborhood && 
             matchesEventType && matchesSeason && matchesDuration && 
             matchesPriceRange && matchesTags;
    });
  }, [activities, searchTerm, selectedFilters, getNeighborhood, getEventType, getSeason, getDuration, getPriceRange]);

  // Memoized displayed activities
  const displayedActivities = useMemo(() => 
    filteredActivities.slice(0, displayCount), 
    [filteredActivities, displayCount]
  );

  // Memoized card data conversion
  const cardDataArray = useMemo(() => {
    return displayedActivities.map((activity): EnhancedCardData => {
      const location = locations[activity.locationId];
      return {
        id: activity.id,
        title: activity.title,
        description: activity.description,
        website: activity.website,
        tags: activity.tags.slice(0, 3),
        priceRange: 'See website',
        location: location?.name,
        address: location?.address,
        coordinates: {
          lat: location?.latitude,
          lng: location?.longitude,
        },
        neighborhood: activity.neighborhood,
        detailPath: `/activity/${activity.id}`,
      };
    });
  }, [displayedActivities, locations]);

  // Memoized icon getter function
  const getIconForCategory = useCallback((categoryId: string): React.ReactNode => {
    return iconMap[categoryId] || iconMap['2'];
  }, []);

  const handleLoadMore = useCallback(() => {
    setDisplayCount(prev => prev + 12);
  }, []);

  const handleFilterChange = useCallback((filterKey: string, values: string[]) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterKey]: values
    }));
    setDisplayCount(12); // Reset display count when filters change
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
            <li>Activities</li>
          </ul>
        </div>
      </section>

      {/* Page Header */}
      <section className="page-header">
        <div className="swiss-container">
          <div className="header-content">
            <div>
              <h1 className="page-title">Activities</h1>
              <p className="page-subtitle">
                Systematically curated experiences across Toronto's cultural districts. 
                From intimate galleries to grand performances, each activity is selected for quality and authenticity.
              </p>
            </div>
            <div className="stats-box">
              <div className="stat">
                <div className="stat-number">{filteredActivities.length}</div>
                <div className="stat-label">Filtered Results</div>
              </div>
              <div className="stat">
                <div className="stat-number">{Object.keys(categories).length}</div>
                <div className="stat-label">Categories</div>
              </div>
              <div className="stat">
                <div className="stat-number">7</div>
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

      {/* Activities Grid */}
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
              {filteredActivities.length} Results
            </div>
            <h2 className="section-title">Available Activities</h2>
          </div>
          
          {filteredActivities.length === 0 ? (
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
                No activities found
              </div>
              <p>Try adjusting your search terms or filters</p>
            </div>
          ) : (
            <>
              <Grid container spacing={3}>
                {cardDataArray.map((cardData, index) => {
                  const activity = displayedActivities[index];
                  return (
                    <Grid item xs={12} sm={6} md={4} key={activity.id}>
                      <EnhancedMinimalistCard
                        data={cardData}
                        icon={getIconForCategory(activity.categoryId)}
                        color="primary"
                      />
                    </Grid>
                  );
                })}
              </Grid>

              {displayedActivities.length < filteredActivities.length && (
                <div style={{ textAlign: 'center', marginTop: 'var(--space-6)' }}>
                  <button 
                    className="btn-secondary"
                    onClick={handleLoadMore}
                  >
                    Load More Activities ({filteredActivities.length - displayedActivities.length} remaining)
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
          }}>Looking for More?</h2>
          <p style={{ 
            fontSize: 'var(--text-md)', 
            fontWeight: 'var(--weight-light)',
            marginBottom: 'var(--space-4)',
            color: 'var(--color-gray-90)',
            maxWidth: '400px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Explore day trips, special events, and exciting activities.
          </p>
          <div className="intro-actions">
            <RouterLink to="/day-trips" className="btn-primary">View Day Trips</RouterLink>
          </div>
        </div>
      </section>
    </Box>
  );
};

export default React.memo(Activities); 