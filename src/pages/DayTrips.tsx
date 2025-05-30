import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box } from '@mui/material';
import { DayTrip, loadDayTrips } from '../utils/dataLoader';
import MultiSelectFilter from '../components/MultiSelectFilter';
import { useSearch } from '../components/Layout';

const DayTrips = () => {
  const { searchTerm, setSearchPlaceholder } = useSearch();
  const [allDayTrips, setAllDayTrips] = useState<DayTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(12);

  // Filter states
  const [selectedTripTypes, setSelectedTripTypes] = useState<string[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [selectedCosts, setSelectedCosts] = useState<string[]>([]);
  const [selectedDistances, setSelectedDistances] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);

  // Set search placeholder for this page
  useEffect(() => {
    setSearchPlaceholder('Search day trips...');
  }, [setSearchPlaceholder]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await loadDayTrips();
        setAllDayTrips(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading day trips:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter options
  const tripTypeOptions = [
    { value: 'nature', label: 'Nature & Outdoor' },
    { value: 'wine', label: 'Wine & Food' },
    { value: 'beach', label: 'Beach & Water' },
    { value: 'culture', label: 'Culture & Arts' },
    { value: 'adventure', label: 'Adventure Sports' },
    { value: 'urban', label: 'Urban Exploration' }
  ];

  const durationOptions = [
    { value: 'half-day', label: 'Half Day (4-6 hrs)' },
    { value: 'full-day', label: 'Full Day (6-8 hrs)' },
    { value: 'weekend', label: 'Weekend (2 days)' },
    { value: 'extended', label: 'Extended (3+ days)' }
  ];

  const costOptions = [
    { value: 'budget', label: 'Budget ($0-50)' },
    { value: 'moderate', label: 'Moderate ($50-150)' },
    { value: 'premium', label: 'Premium ($150-300)' },
    { value: 'luxury', label: 'Luxury ($300+)' }
  ];

  const distanceOptions = [
    { value: 'close', label: 'Close (< 1 hour)' },
    { value: 'nearby', label: 'Nearby (1-2 hours)' },
    { value: 'moderate', label: 'Moderate (2-3 hours)' },
    { value: 'far', label: 'Far (3+ hours)' }
  ];

  const ratingOptions = [
    { value: 'excellent', label: 'Excellent (4.5+)' },
    { value: 'very-good', label: 'Very Good (4.0+)' },
    { value: 'good', label: 'Good (3.5+)' },
    { value: 'fair', label: 'Fair (3.0+)' }
  ];

  // Helper functions
  const getTripType = (trip: DayTrip): string => {
    const description = trip.description.toLowerCase();
    const tags = trip.tags.join(' ').toLowerCase();
    
    if (tags.includes('beach') || description.includes('beach')) return 'beach';
    if (tags.includes('wine') || description.includes('wine')) return 'wine';
    if (tags.includes('hiking') || tags.includes('nature') || description.includes('hiking')) return 'nature';
    if (tags.includes('culture') || tags.includes('theatre') || tags.includes('history')) return 'culture';
    if (tags.includes('city') || tags.includes('urban')) return 'urban';
    if (tags.includes('adventure') || tags.includes('caves')) return 'adventure';
    return 'nature';
  };

  const getIconForTrip = (trip: DayTrip): string => {
    const tripType = getTripType(trip);
    const iconMap: { [key: string]: string } = {
      'nature': 'NAT',
      'wine': 'WIN',
      'beach': 'BCH',
      'culture': 'CUL',
      'adventure': 'ADV',
      'urban': 'URB'
    };
    return iconMap[tripType] || 'TRP';
  };

  const extractTravelTime = (distance: string): number => {
    if (!distance) return 0;
    const match = distance.match(/(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
  };

  const getDistanceCategory = (trip: DayTrip): string => {
    const time = extractTravelTime(trip.distance);
    if (time < 1) return 'close';
    if (time < 2) return 'nearby';
    if (time < 3) return 'moderate';
    return 'far';
  };

  // Filter functionality
  const filteredTrips = allDayTrips.filter(trip => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    // Trip type filter
    const matchesTripType = selectedTripTypes.length === 0 || 
      selectedTripTypes.includes(getTripType(trip));

    // Duration filter (simplified mapping)
    const matchesDuration = selectedDurations.length === 0 || 
      selectedDurations.some(duration => {
        if (duration === 'half-day' && trip.duration.includes('Half')) return true;
        if (duration === 'full-day' && trip.duration.includes('Full')) return true;
        if (duration === 'weekend' && trip.duration.includes('2')) return true;
        if (duration === 'extended' && trip.duration.includes('3')) return true;
        return false;
      });

    // Distance filter
    const matchesDistance = selectedDistances.length === 0 || 
      selectedDistances.includes(getDistanceCategory(trip));

    return matchesSearch && matchesTripType && matchesDuration && matchesDistance;
  });

  const displayedTrips = filteredTrips.slice(0, displayCount);

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 12);
  };

  // Reset display count when filters change
  React.useEffect(() => {
    setDisplayCount(12);
  }, [selectedTripTypes, selectedDurations, selectedCosts, selectedDistances, selectedRatings, searchTerm]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <div style={{ 
          padding: 'var(--space-4)', 
          color: 'var(--color-gray-70)',
          fontFamily: 'var(--font-primary)',
          fontSize: 'var(--text-md)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          Loading Day Trips...
        </div>
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
                Systematically curated escapes from Toronto's urban landscape. 
                From wine country to pristine beaches, each trip is selected for memorable experiences within driving distance.
              </p>
            </div>
            <div className="stats-box">
              <div className="stat">
                <div className="stat-number">{filteredTrips.length}</div>
                <div className="stat-label">Filtered Results</div>
              </div>
              <div className="stat">
                <div className="stat-number">6</div>
                <div className="stat-label">Trip Types</div>
              </div>
              <div className="stat">
                <div className="stat-number">4</div>
                <div className="stat-label">Distance Ranges</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="filter-section">
        <div className="swiss-container">
          <div className="filter-grid">
            <MultiSelectFilter
              label="Trip Type"
              options={tripTypeOptions}
              selectedValues={selectedTripTypes}
              onChange={setSelectedTripTypes}
              placeholder="All Types"
            />
            <MultiSelectFilter
              label="Duration"
              options={durationOptions}
              selectedValues={selectedDurations}
              onChange={setSelectedDurations}
              placeholder="Any Duration"
            />
            <MultiSelectFilter
              label="Cost"
              options={costOptions}
              selectedValues={selectedCosts}
              onChange={setSelectedCosts}
              placeholder="All Costs"
            />
            <MultiSelectFilter
              label="Distance"
              options={distanceOptions}
              selectedValues={selectedDistances}
              onChange={setSelectedDistances}
              placeholder="Any Distance"
            />
            <MultiSelectFilter
              label="Rating"
              options={ratingOptions}
              selectedValues={selectedRatings}
              onChange={setSelectedRatings}
              placeholder="All Ratings"
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
              <div className="content-grid">
                {displayedTrips.map((trip) => (
                  <div key={trip.id} className="activity-card">
                    <div className="card-image">
                      {getIconForTrip(trip)}
                    </div>
                    <div className="card-content">
                      <div className="card-category">{trip.season}</div>
                      <h3 className="card-title">{trip.title}</h3>
                      <p className="card-description">{trip.description}</p>
                      
                      <ul className="card-features">
                        <li>{trip.duration}</li>
                        <li>{trip.distance}</li>
                        {trip.tags.slice(0, 1).map(tag => (
                          <li key={tag}>{tag}</li>
                        ))}
                      </ul>
                      
                      <div className="card-meta">
                        <span className="card-price">From $50</span>
                        <span style={{ 
                          fontSize: 'var(--text-sm)', 
                          color: 'var(--color-gray-50)',
                          fontFamily: 'var(--font-mono)'
                        }}>
                          ★ 4.{Math.floor(Math.random() * 9) + 1}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

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
            Discover activities and neighborhoods to complete your Toronto experience.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
            <RouterLink to="/activities" className="btn-primary">Browse Activities</RouterLink>
            <RouterLink to="/neighborhoods" className="btn-secondary">Explore Areas</RouterLink>
          </div>
        </div>
      </section>
    </Box>
  );
};

export default DayTrips; 