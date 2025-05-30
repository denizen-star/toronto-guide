import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Grid, Typography, CircularProgress } from '@mui/material';
import { 
  loadStandardizedAmateurSports, 
  type StandardizedAmateurSport 
} from '../utils/dataLoader';
import EnhancedMinimalistCard, { EnhancedCardData } from '../components/MinimalistCard';
import MultiSelectFilter from '../components/MultiSelectFilter';
import { useSearch } from '../components/Layout';
import { 
  SportsBaseball, 
  SportsTennis, 
  SportsGolf, 
  Pool, 
  FitnessCenter,
  DirectionsRun
} from '@mui/icons-material';

// Memoized icon map
const iconMap: { [key: string]: React.ReactNode } = {
  'golf': <SportsGolf />,
  'tennis': <SportsTennis />,
  'baseball': <SportsBaseball />,
  'swimming': <Pool />,
  'fitness': <FitnessCenter />,
  'running': <DirectionsRun />
};

const AmateurSports = () => {
  const { searchTerm, setSearchPlaceholder } = useSearch();
  const [sports, setSports] = useState<StandardizedAmateurSport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [displayCount, setDisplayCount] = useState(12);
  
  // Essential filter states
  const [selectedSportTypes, setSelectedSportTypes] = useState<string[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

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

  // Memoized filter options
  const sportTypeOptions = useMemo(() => [
    { value: 'golf', label: 'Golf' },
    { value: 'tennis', label: 'Tennis' },
    { value: 'baseball', label: 'Baseball & Softball' },
    { value: 'swimming', label: 'Swimming' },
    { value: 'fitness', label: 'Fitness & Gym' },
    { value: 'running', label: 'Running & Track' }
  ], []);

  const areaOptions = useMemo(() => [
    { value: 'downtown', label: 'Downtown' },
    { value: 'north', label: 'North York' },
    { value: 'east', label: 'East End' },
    { value: 'west', label: 'West End' },
    { value: 'scarborough', label: 'Scarborough' },
    { value: 'etobicoke', label: 'Etobicoke' }
  ], []);

  // Memoized helper functions
  const getSportType = useCallback((sport: StandardizedAmateurSport): string => {
    const title = sport.title.toLowerCase();
    const tags = sport.tags.join(' ').toLowerCase();
    
    if (title.includes('golf') || tags.includes('golf')) return 'golf';
    if (title.includes('tennis') || tags.includes('tennis')) return 'tennis';
    if (title.includes('baseball') || title.includes('softball') || tags.includes('baseball')) return 'baseball';
    if (title.includes('swim') || tags.includes('swim')) return 'swimming';
    if (title.includes('gym') || title.includes('fitness') || tags.includes('fitness')) return 'fitness';
    if (title.includes('run') || tags.includes('running')) return 'running';
    
    return 'fitness'; // default
  }, []);

  const getAreaCategory = useCallback((location: string): string => {
    const loc = location.toLowerCase();
    
    if (loc.includes('downtown') || loc.includes('financial')) return 'downtown';
    if (loc.includes('north york') || loc.includes('north')) return 'north';
    if (loc.includes('east') || loc.includes('beaches')) return 'east';
    if (loc.includes('west') || loc.includes('junction')) return 'west';
    if (loc.includes('scarborough')) return 'scarborough';
    if (loc.includes('etobicoke')) return 'etobicoke';
    
    return 'downtown'; // default
  }, []);

  const getIconForSport = useCallback((sport: StandardizedAmateurSport): React.ReactNode => {
    const sportType = getSportType(sport);
    return iconMap[sportType] || iconMap['fitness'];
  }, [getSportType]);

  // Memoized filtering logic
  const filteredSports = useMemo(() => {
    return sports.filter(sport => {
      // Search filter
      const matchesSearch = !searchTerm || 
        sport.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sport.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sport.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sport.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      // Sport type filter
      const matchesSportType = selectedSportTypes.length === 0 || 
        selectedSportTypes.includes(getSportType(sport));

      // Area filter
      const matchesArea = selectedAreas.length === 0 || 
        selectedAreas.includes(getAreaCategory(sport.location));

      return matchesSearch && matchesSportType && matchesArea;
    });
  }, [sports, searchTerm, selectedSportTypes, selectedAreas, getSportType, getAreaCategory]);

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
      location: sport.location,
      address: sport.location,
      lgbtqFriendly: sport.lgbtqFriendly,
      neighborhood: sport.location,
      detailPath: `/amateur-sports/${sport.id}`,
    }));
  }, [displayedSports]);

  const handleLoadMore = useCallback(() => {
    setDisplayCount(prev => prev + 12);
  }, []);

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(12);
  }, [selectedSportTypes, selectedAreas, searchTerm]);

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
                From golf courses to tennis courts, find your perfect sporting venue.
              </p>
            </div>
            <div className="stats-box">
              <div className="stat">
                <div className="stat-number">{filteredSports.length}</div>
                <div className="stat-label">Facilities</div>
              </div>
              <div className="stat">
                <div className="stat-number">6</div>
                <div className="stat-label">Sport Types</div>
              </div>
              <div className="stat">
                <div className="stat-number">6</div>
                <div className="stat-label">Areas</div>
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
              label="Sport Type"
              options={sportTypeOptions}
              selectedValues={selectedSportTypes}
              onChange={setSelectedSportTypes}
              placeholder="All Sports"
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
            <h2 className="section-title">Available Sports</h2>
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
                    Load More Sports ({filteredSports.length - displayedSports.length} remaining)
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
            Explore more activities and events in Toronto.
          </p>
          <div className="intro-actions">
            <RouterLink to="/activities" className="btn-primary">View Activities</RouterLink>
          </div>
        </div>
      </section>
    </Box>
  );
};

export default React.memo(AmateurSports); 