import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Grid, Typography, CircularProgress } from '@mui/material';
import { 
  loadStandardizedAmateurSports, 
  type StandardizedAmateurSport 
} from '../utils/dataLoader';
import EnhancedMinimalistCard, { EnhancedCardData } from '../components/MinimalistCard';
import EnhancedFilterSystem, { FilterConfig } from '../components/EnhancedFilterSystem';
import { useSearch } from '../components/Layout';
import { 
  SportsGolf, 
  SportsTennis, 
  FitnessCenter, 
  Pool, 
  Sports,
  SportsBaseball,
  SportsBasketball,
  SportsFootball
} from '@mui/icons-material';

// Memoized icon map for sports
const iconMap: { [key: string]: React.ReactNode } = {
  'golf': <SportsGolf />,
  'tennis': <SportsTennis />,
  'fitness': <FitnessCenter />,
  'swimming': <Pool />,
  'baseball': <SportsBaseball />,
  'basketball': <SportsBasketball />,
  'football': <SportsFootball />,
  'general': <Sports />
};

const AmateurSports = () => {
  const { searchTerm, setSearchPlaceholder } = useSearch();
  const [sports, setSports] = useState<StandardizedAmateurSport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [displayCount, setDisplayCount] = useState(12);
  
  // Enhanced filter states
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string[] }>({
    sportType: [],
    skillLevel: [],
    neighborhood: [],
    season: [],
    tags: [],
    duration: [],
    priceRange: []
  });

  useEffect(() => {
    setSearchPlaceholder('Search amateur sports...');
  }, [setSearchPlaceholder]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const sportsData = await loadStandardizedAmateurSports();
        setSports(sportsData);
        setLoading(false);
      } catch (err) {
        console.error('Error loading amateur sports:', err);
        setError('Failed to load amateur sports');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helper functions for categorization
  const getSportType = useCallback((sport: StandardizedAmateurSport): string => {
    const title = sport.title.toLowerCase();
    const description = sport.description.toLowerCase();
    
    if (title.includes('golf') || description.includes('golf')) return 'golf';
    if (title.includes('tennis') || description.includes('tennis')) return 'tennis';
    if (title.includes('fitness') || description.includes('gym') || title.includes('workout')) return 'fitness';
    if (title.includes('swimming') || description.includes('pool') || title.includes('swim')) return 'swimming';
    if (title.includes('baseball') || description.includes('baseball')) return 'baseball';
    if (title.includes('basketball') || description.includes('basketball')) return 'basketball';
    if (title.includes('football') || description.includes('football')) return 'football';
    return 'general';
  }, []);

  const getSkillLevel = useCallback((sport: StandardizedAmateurSport): string => {
    const description = sport.description.toLowerCase();
    const tags = sport.tags.join(' ').toLowerCase();
    
    if (description.includes('beginner') || tags.includes('beginner') || description.includes('novice')) return 'beginner';
    if (description.includes('intermediate') || tags.includes('intermediate')) return 'intermediate';
    if (description.includes('advanced') || tags.includes('advanced') || description.includes('expert')) return 'advanced';
    if (description.includes('all levels') || tags.includes('all-levels')) return 'all-levels';
    return 'all-levels'; // default
  }, []);

  const getNeighborhood = useCallback((sport: StandardizedAmateurSport): string => {
    const location = sport.location?.toLowerCase() || '';
    
    if (location.includes('downtown')) return 'downtown';
    if (location.includes('north')) return 'north';
    if (location.includes('east')) return 'east';
    if (location.includes('west')) return 'west';
    if (location.includes('central')) return 'central';
    return 'central'; // default
  }, []);

  const getSeason = useCallback((sport: StandardizedAmateurSport): string => {
    const description = sport.description.toLowerCase();
    const tags = sport.tags.join(' ').toLowerCase();
    
    if (description.includes('winter') || tags.includes('winter') || description.includes('indoor')) return 'winter';
    if (description.includes('spring') || tags.includes('spring')) return 'spring';
    if (description.includes('summer') || tags.includes('summer') || description.includes('outdoor')) return 'summer';
    if (description.includes('fall') || tags.includes('fall') || tags.includes('autumn')) return 'fall';
    return 'year-round';
  }, []);

  const getDuration = useCallback((sport: StandardizedAmateurSport): string => {
    const description = sport.description.toLowerCase();
    
    if (description.includes('1 hour') || description.includes('60 min')) return 'short';
    if (description.includes('2 hour') || description.includes('3 hour')) return 'medium';
    if (description.includes('half day') || description.includes('4 hour')) return 'half-day';
    if (description.includes('full day') || description.includes('tournament')) return 'full-day';
    return 'varies';
  }, []);

  const getPriceRange = useCallback((sport: StandardizedAmateurSport): string => {
    const description = sport.description.toLowerCase();
    
    if (description.includes('free') || description.includes('$0')) return 'free';
    if (description.includes('$') && (description.includes('10') || description.includes('15'))) return 'budget';
    if (description.includes('$') && (description.includes('25') || description.includes('30'))) return 'moderate';
    if (description.includes('$') && (description.includes('50') || description.includes('75'))) return 'premium';
    return 'varies';
  }, []);

  const getIconForSport = useCallback((sport: StandardizedAmateurSport): React.ReactNode => {
    const sportType = getSportType(sport);
    return iconMap[sportType] || iconMap['general'];
  }, [getSportType]);

  // Create filter configurations
  const filterConfigs: FilterConfig[] = useMemo(() => {
    const sportTypeOptions = [
      { value: 'golf', label: 'Golf' },
      { value: 'tennis', label: 'Tennis' },
      { value: 'fitness', label: 'Fitness & Gym' },
      { value: 'swimming', label: 'Swimming' },
      { value: 'baseball', label: 'Baseball' },
      { value: 'basketball', label: 'Basketball' },
      { value: 'football', label: 'Football' },
      { value: 'general', label: 'Other Sports' }
    ];

    const skillLevelOptions = [
      { value: 'beginner', label: 'Beginner' },
      { value: 'intermediate', label: 'Intermediate' },
      { value: 'advanced', label: 'Advanced' },
      { value: 'all-levels', label: 'All Levels' }
    ];

    const neighborhoodOptions = [
      { value: 'downtown', label: 'Downtown' },
      { value: 'north', label: 'North Toronto' },
      { value: 'east', label: 'East Toronto' },
      { value: 'west', label: 'West Toronto' },
      { value: 'central', label: 'Central Toronto' }
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
      { value: 'budget', label: 'Budget ($0-20)' },
      { value: 'moderate', label: 'Moderate ($20-40)' },
      { value: 'premium', label: 'Premium ($40+)' },
      { value: 'varies', label: 'Varies' }
    ];

    // Get unique tags from sports
    const allTags = sports.reduce((tags: Set<string>, sport) => {
      sport.tags.forEach(tag => tags.add(tag));
      return tags;
    }, new Set<string>());

    const tagOptions = Array.from(allTags).map(tag => ({
      value: tag.toLowerCase().replace(/\s+/g, '-'),
      label: tag
    }));

    return [
      { key: 'sportType', label: 'Sport Type', options: sportTypeOptions, placeholder: 'All Sports' },
      { key: 'skillLevel', label: 'Skill Level', options: skillLevelOptions, placeholder: 'All Skill Levels' },
      { key: 'neighborhood', label: 'Area', options: neighborhoodOptions, placeholder: 'All Areas' },
      { key: 'season', label: 'Season', options: seasonOptions, placeholder: 'All Seasons' },
      { key: 'duration', label: 'Duration', options: durationOptions, placeholder: 'Any Duration' },
      { key: 'priceRange', label: 'Price Range', options: priceRangeOptions, placeholder: 'Any Price' },
      { key: 'tags', label: 'Tags', options: tagOptions.slice(0, 15), placeholder: 'Select Tags' }
    ];
  }, [sports]);

  // Memoized filtering logic
  const filteredSports = useMemo(() => {
    return sports.filter(sport => {
      // Search filter
      const matchesSearch = !searchTerm || 
        sport.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sport.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sport.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sport.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      // Sport Type filter
      const matchesSportType = selectedFilters.sportType.length === 0 || 
        selectedFilters.sportType.includes(getSportType(sport));

      // Skill Level filter
      const matchesSkillLevel = selectedFilters.skillLevel.length === 0 || 
        selectedFilters.skillLevel.includes(getSkillLevel(sport));

      // Neighborhood filter
      const matchesNeighborhood = selectedFilters.neighborhood.length === 0 || 
        selectedFilters.neighborhood.includes(getNeighborhood(sport));

      // Season filter
      const matchesSeason = selectedFilters.season.length === 0 || 
        selectedFilters.season.includes(getSeason(sport));

      // Duration filter
      const matchesDuration = selectedFilters.duration.length === 0 || 
        selectedFilters.duration.includes(getDuration(sport));

      // Price Range filter
      const matchesPriceRange = selectedFilters.priceRange.length === 0 || 
        selectedFilters.priceRange.includes(getPriceRange(sport));

      // Tags filter
      const matchesTags = selectedFilters.tags.length === 0 || 
        selectedFilters.tags.some(selectedTag => 
          sport.tags.some(sportTag => 
            sportTag.toLowerCase().replace(/\s+/g, '-') === selectedTag
          )
        );

      return matchesSearch && matchesSportType && matchesSkillLevel && 
             matchesNeighborhood && matchesSeason && matchesDuration && 
             matchesPriceRange && matchesTags;
    });
  }, [sports, searchTerm, selectedFilters, getSportType, getSkillLevel, getNeighborhood, getSeason, getDuration, getPriceRange]);

  // Memoized displayed sports
  const displayedSports = useMemo(() => 
    filteredSports.slice(0, displayCount), 
    [filteredSports, displayCount]
  );

  // Memoized card data conversion
  const cardDataArray = useMemo(() => {
    return displayedSports.map((sport): EnhancedCardData => ({
      id: sport.id,
      title: sport.title,
      description: sport.description,
      website: sport.website,
      tags: sport.tags.slice(0, 3),
      priceRange: 'See details',
      location: sport.location || 'Toronto',
      address: sport.location,
      neighborhood: sport.location,
      detailPath: `/amateur-sports/${sport.id}`,
    }));
  }, [displayedSports]);

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
      sportType: [],
      skillLevel: [],
      neighborhood: [],
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
            <li>Amateur Sports</li>
          </ul>
        </div>
      </section>

      {/* Page Header */}
      <section className="page-header">
        <div className="swiss-container">
          <div className="header-content">
            <div>
              <h1 className="page-title">Amateur Sports</h1>
              <p className="page-subtitle">
                Stay active with Toronto's best recreational sports facilities and programs. 
                From golf courses to fitness centers, find your perfect way to play and compete.
              </p>
            </div>
            <div className="stats-box">
              <div className="stat">
                <div className="stat-number">{filteredSports.length}</div>
                <div className="stat-label">Sports Options</div>
              </div>
              <div className="stat">
                <div className="stat-number">8</div>
                <div className="stat-label">Sport Types</div>
              </div>
              <div className="stat">
                <div className="stat-number">5</div>
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

      {/* Sports Grid */}
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
              {filteredSports.length} Results
            </div>
            <h2 className="section-title">Available Sports Activities</h2>
          </div>
          
          {filteredSports.length === 0 ? (
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
                No sports activities found
              </div>
              <p>Try adjusting your search terms or filters</p>
            </div>
          ) : (
            <>
              <Grid container spacing={3}>
                {cardDataArray.map((cardData, index) => {
                  const sport = displayedSports[index];
                  return (
                    <Grid item xs={12} sm={6} md={4} key={sport.id}>
                      <EnhancedMinimalistCard
                        data={cardData}
                        icon={getIconForSport(sport)}
                        color="info"
                      />
                    </Grid>
                  );
                })}
              </Grid>

              {displayedSports.length < filteredSports.length && (
                <div style={{ textAlign: 'center', marginTop: 'var(--space-6)' }}>
                  <button 
                    className="btn-secondary"
                    onClick={handleLoadMore}
                  >
                    Load More Activities ({filteredSports.length - displayedSports.length} remaining)
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
          }}>Stay Active</h2>
          <p style={{ 
            fontSize: 'var(--text-md)', 
            fontWeight: 'var(--weight-light)',
            marginBottom: 'var(--space-4)',
            color: 'var(--color-gray-90)',
            maxWidth: '400px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Explore professional sporting events and other activities.
          </p>
          <div className="intro-actions">
            <RouterLink to="/sporting-events" className="btn-primary">View Sporting Events</RouterLink>
          </div>
        </div>
      </section>
    </Box>
  );
};

export default React.memo(AmateurSports); 