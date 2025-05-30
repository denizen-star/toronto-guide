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
import MultiSelectFilter from '../components/MultiSelectFilter';
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
  
  // Essential filter states - keeping only the most important ones for performance
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

  useEffect(() => {
    setSearchPlaceholder('Search activities...');
  }, [setSearchPlaceholder]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Load only essential data for better performance
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

  // Memoized filter options
  const categoryOptions = useMemo(() => 
    Object.entries(categories).map(([id, category]) => ({
      value: id,
      label: category.name
    })), [categories]
  );

  const areaOptions = useMemo(() => [
    { value: 'downtown', label: 'Downtown' },
    { value: 'midtown', label: 'Midtown' },
    { value: 'uptown', label: 'Uptown' },
    { value: 'east', label: 'East End' },
    { value: 'west', label: 'West End' },
    { value: 'north', label: 'North York' }
  ], []);

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
      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.includes(activity.categoryId);

      // Area filter (simplified - using city/neighborhood)
      const matchesArea = selectedAreas.length === 0 || 
        selectedAreas.some(area => {
          const cityLower = activity.city.toLowerCase();
          const neighborhoodLower = activity.neighborhood?.toLowerCase() || '';
          
          switch(area) {
            case 'downtown': return cityLower.includes('toronto') && (neighborhoodLower.includes('downtown') || neighborhoodLower.includes('financial') || neighborhoodLower.includes('entertainment'));
            case 'midtown': return neighborhoodLower.includes('midtown') || neighborhoodLower.includes('yorkville') || neighborhoodLower.includes('rosedale');
            case 'uptown': return neighborhoodLower.includes('uptown') || neighborhoodLower.includes('north');
            case 'east': return neighborhoodLower.includes('east') || neighborhoodLower.includes('beaches') || neighborhoodLower.includes('leslieville');
            case 'west': return neighborhoodLower.includes('west') || neighborhoodLower.includes('junction') || neighborhoodLower.includes('liberty');
            case 'north': return neighborhoodLower.includes('north') || cityLower.includes('north york');
            default: return true;
          }
        });

      return matchesSearch && matchesCategory && matchesArea;
    });
  }, [activities, searchTerm, selectedCategories, selectedAreas]);

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
        tags: activity.tags.slice(0, 3), // Limit tags for performance
        priceRange: 'See website', // Simplified for performance
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
    return iconMap[categoryId] || iconMap['2']; // Default to LocalActivity
  }, []);

  const handleLoadMore = useCallback(() => {
    setDisplayCount(prev => prev + 12);
  }, []);

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(12);
  }, [selectedCategories, selectedAreas, searchTerm]);

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
                <div className="stat-number">15</div>
                <div className="stat-label">Districts</div>
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
              options={areaOptions}
              selectedValues={selectedAreas}
              onChange={setSelectedAreas}
              placeholder="All Areas"
            />
          </div>
        </div>
      </section>

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