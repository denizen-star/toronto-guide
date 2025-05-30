import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box } from '@mui/material';
import { SportingEvent, loadSportingEvents } from '../utils/dataLoader';
import MultiSelectFilter from '../components/MultiSelectFilter';
import { useSearch } from '../components/Layout';

const SportingEvents = () => {
  const { searchTerm, setSearchPlaceholder } = useSearch();
  const [allEvents, setAllEvents] = useState<SportingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(12);

  // Filter states
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);

  // Set search placeholder for this page
  useEffect(() => {
    setSearchPlaceholder('Search sporting events...');
  }, [setSearchPlaceholder]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await loadSportingEvents();
        setAllEvents(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading sporting events:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter options
  const sportsOptions = [
    { value: 'hockey', label: 'Hockey' },
    { value: 'basketball', label: 'Basketball' },
    { value: 'baseball', label: 'Baseball' },
    { value: 'soccer', label: 'Soccer' },
    { value: 'football', label: 'Football' },
    { value: 'tennis', label: 'Tennis' }
  ];

  const venueOptions = [
    { value: 'scotiabank', label: 'Scotiabank Arena' },
    { value: 'rogers-centre', label: 'Rogers Centre' },
    { value: 'bmo-field', label: 'BMO Field' },
    { value: 'ricoh-coliseum', label: 'Ricoh Coliseum' },
    { value: 'aviva-centre', label: 'Aviva Centre' },
    { value: 'other', label: 'Other Venues' }
  ];

  const seasonOptions = [
    { value: 'spring', label: 'Spring' },
    { value: 'summer', label: 'Summer' },
    { value: 'fall', label: 'Fall' },
    { value: 'winter', label: 'Winter' },
    { value: 'year-round', label: 'Year-round' }
  ];

  const priceOptions = [
    { value: 'budget', label: 'Budget ($0-50)' },
    { value: 'moderate', label: 'Moderate ($50-150)' },
    { value: 'premium', label: 'Premium ($150-300)' },
    { value: 'luxury', label: 'Luxury ($300+)' }
  ];

  const ratingOptions = [
    { value: 'excellent', label: 'Excellent (4.5+)' },
    { value: 'very-good', label: 'Very Good (4.0+)' },
    { value: 'good', label: 'Good (3.5+)' },
    { value: 'fair', label: 'Fair (3.0+)' }
  ];

  // Helper functions
  const getSportType = (event: SportingEvent): string => {
    const title = event.title.toLowerCase();
    const location = event.location.toLowerCase();
    
    if (title.includes('leafs') || title.includes('hockey') || location.includes('maple leafs')) return 'hockey';
    if (title.includes('raptors') || title.includes('basketball')) return 'basketball';
    if (title.includes('jays') || title.includes('baseball') || location.includes('rogers centre')) return 'baseball';
    if (title.includes('fc') || title.includes('soccer') || location.includes('bmo')) return 'soccer';
    if (title.includes('argos') || title.includes('football')) return 'football';
    if (title.includes('tennis') || location.includes('aviva')) return 'tennis';
    return 'other';
  };

  const getVenueCategory = (location: string): string => {
    const locationLower = location.toLowerCase();
    
    if (locationLower.includes('scotiabank')) return 'scotiabank';
    if (locationLower.includes('rogers centre')) return 'rogers-centre';
    if (locationLower.includes('bmo')) return 'bmo-field';
    if (locationLower.includes('ricoh')) return 'ricoh-coliseum';
    if (locationLower.includes('aviva')) return 'aviva-centre';
    return 'other';
  };

  const getEventSeason = (event: SportingEvent): string => {
    // Determine season based on sport type
    const sport = getSportType(event);
    switch(sport) {
      case 'hockey': return 'winter';
      case 'basketball': return 'winter';
      case 'baseball': return 'summer';
      case 'soccer': return 'spring';
      case 'football': return 'fall';
      case 'tennis': return 'summer';
      default: return 'year-round';
    }
  };

  const getIconForEvent = (event: SportingEvent): string => {
    const sport = getSportType(event);
    const iconMap: { [key: string]: string } = {
      'hockey': 'HCK',
      'basketball': 'BBL',
      'baseball': 'BSB',
      'soccer': 'SOC',
      'football': 'FBL',
      'tennis': 'TEN'
    };
    return iconMap[sport] || 'SPT';
  };

  const getTeamsFromTitle = (title: string): string => {
    // Extract team names from title - this is a simplified approach
    if (title.includes(' vs ') || title.includes(' v ')) {
      return title.includes(' vs ') ? title : title.replace(' v ', ' vs ');
    }
    // For single team events, just return the team name
    return title;
  };

  // Filter functionality
  const filteredEvents = allEvents.filter(event => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    // Sport filter
    const matchesSport = selectedSports.length === 0 || 
      selectedSports.includes(getSportType(event));

    // Venue filter
    const matchesVenue = selectedVenues.length === 0 || 
      selectedVenues.includes(getVenueCategory(event.location));

    // Season filter
    const matchesSeason = selectedSeasons.length === 0 || 
      selectedSeasons.includes(getEventSeason(event));

    return matchesSearch && matchesSport && matchesVenue && matchesSeason;
  });

  const displayedEvents = filteredEvents.slice(0, displayCount);

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 12);
  };

  // Reset display count when filters change
  React.useEffect(() => {
    setDisplayCount(12);
  }, [selectedSports, selectedVenues, selectedSeasons, selectedPrices, selectedRatings, searchTerm]);

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
          Loading Sporting Events...
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
                Toronto's professional sports calendar featuring world-class teams and venues. 
                From NHL championship pursuit to MLB excitement, experience the city's passionate sports culture.
              </p>
            </div>
            <div className="stats-box">
              <div className="stat">
                <div className="stat-number">{filteredEvents.length}</div>
                <div className="stat-label">Filtered Results</div>
              </div>
              <div className="stat">
                <div className="stat-number">6</div>
                <div className="stat-label">Sports</div>
              </div>
              <div className="stat">
                <div className="stat-number">5</div>
                <div className="stat-label">Major Venues</div>
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
              label="Sport"
              options={sportsOptions}
              selectedValues={selectedSports}
              onChange={setSelectedSports}
              placeholder="All Sports"
            />
            <MultiSelectFilter
              label="Venue"
              options={venueOptions}
              selectedValues={selectedVenues}
              onChange={setSelectedVenues}
              placeholder="All Venues"
            />
            <MultiSelectFilter
              label="Season"
              options={seasonOptions}
              selectedValues={selectedSeasons}
              onChange={setSelectedSeasons}
              placeholder="All Seasons"
            />
            <MultiSelectFilter
              label="Price Range"
              options={priceOptions}
              selectedValues={selectedPrices}
              onChange={setSelectedPrices}
              placeholder="All Prices"
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

      {/* Events Grid */}
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
            <h2 className="section-title">Upcoming Games</h2>
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
              <div className="content-grid">
                {displayedEvents.map((event) => (
                  <div key={event.id} className="activity-card">
                    <div className="card-image">
                      {getIconForEvent(event)}
                    </div>
                    <div className="card-content">
                      <div className="card-category">{getSportType(event).toUpperCase()}</div>
                      <h3 className="card-title">{event.title}</h3>
                      <p className="card-description">{event.description}</p>
                      
                      <ul className="card-features">
                        <li>{event.location}</li>
                        <li>{event.date || 'TBD'}</li>
                        <li>{getTeamsFromTitle(event.title)}</li>
                      </ul>
                      
                      <div className="card-meta">
                        <span className="card-price">$25 - $200</span>
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
          }}>Game On!</h2>
          <p style={{ 
            fontSize: 'var(--text-md)', 
            fontWeight: 'var(--weight-light)',
            marginBottom: 'var(--space-4)',
            color: 'var(--color-gray-90)',
            maxWidth: '400px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Explore special events and activities throughout Toronto.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
            <RouterLink to="/special-events" className="btn-primary">Special Events</RouterLink>
            <RouterLink to="/activities" className="btn-secondary">Browse Activities</RouterLink>
          </div>
        </div>
      </section>
    </Box>
  );
};

export default SportingEvents; 