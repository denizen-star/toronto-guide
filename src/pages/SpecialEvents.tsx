import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box } from '@mui/material';
import { SpecialEvent, loadSpecialEvents } from '../utils/dataLoader';
import MultiSelectFilter from '../components/MultiSelectFilter';

const SpecialEvents = () => {
  const [allEvents, setAllEvents] = useState<SpecialEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayCount, setDisplayCount] = useState(12);

  // Filter states
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await loadSpecialEvents();
        setAllEvents(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading special events:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter options
  const eventTypeOptions = [
    { value: 'festival', label: 'Festivals' },
    { value: 'concert', label: 'Concerts' },
    { value: 'theater', label: 'Theater' },
    { value: 'art', label: 'Art Shows' },
    { value: 'food', label: 'Food Events' },
    { value: 'community', label: 'Community' }
  ];

  const locationOptions = [
    { value: 'downtown', label: 'Downtown' },
    { value: 'waterfront', label: 'Waterfront' },
    { value: 'distillery', label: 'Distillery District' },
    { value: 'west-end', label: 'West End' },
    { value: 'east-end', label: 'East End' },
    { value: 'multiple', label: 'Multiple Venues' }
  ];

  const categoryOptions = [
    { value: 'music', label: 'Music & Concerts' },
    { value: 'food-drink', label: 'Food & Drink' },
    { value: 'arts-culture', label: 'Arts & Culture' },
    { value: 'festivals', label: 'Festivals' },
    { value: 'theater-comedy', label: 'Theater & Comedy' },
    { value: 'seasonal', label: 'Seasonal Events' }
  ];

  const seasonOptions = [
    { value: 'spring', label: 'Spring' },
    { value: 'summer', label: 'Summer' },
    { value: 'fall', label: 'Fall' },
    { value: 'winter', label: 'Winter' },
    { value: 'year-round', label: 'Year-round' }
  ];

  const ratingOptions = [
    { value: 'excellent', label: 'Excellent (4.5+)' },
    { value: 'very-good', label: 'Very Good (4.0+)' },
    { value: 'good', label: 'Good (3.5+)' },
    { value: 'fair', label: 'Fair (3.0+)' }
  ];

  // Helper functions
  const getEventCategory = (event: SpecialEvent): string => {
    const type = event.type.toLowerCase();
    const title = event.title.toLowerCase();
    
    if (type.includes('music') || title.includes('concert') || title.includes('music')) return 'music';
    if (type.includes('food') || title.includes('food') || title.includes('taste')) return 'food-drink';
    if (type.includes('art') || title.includes('art') || title.includes('gallery')) return 'arts-culture';
    if (type.includes('festival')) return 'festivals';
    if (type.includes('theater') || type.includes('comedy')) return 'theater-comedy';
    if (type.includes('seasonal') || title.includes('holiday') || title.includes('christmas')) return 'seasonal';
    return 'arts-culture';
  };

  const getLocationArea = (location: string): string => {
    if (!location) return 'multiple';
    const locationLower = location.toLowerCase();
    
    if (locationLower.includes('downtown') || locationLower.includes('financial')) return 'downtown';
    if (locationLower.includes('harbourfront') || locationLower.includes('waterfront')) return 'waterfront';
    if (locationLower.includes('distillery')) return 'distillery';
    if (locationLower.includes('west') || locationLower.includes('ossington')) return 'west-end';
    if (locationLower.includes('east') || locationLower.includes('beaches')) return 'east-end';
    if (locationLower.includes('multiple') || locationLower.includes('various')) return 'multiple';
    return 'downtown';
  };

  const getEventSeason = (event: SpecialEvent): string => {
    const title = event.title.toLowerCase();
    
    if (title.includes('winter') || title.includes('christmas') || title.includes('holiday')) return 'winter';
    if (title.includes('spring') || title.includes('easter')) return 'spring';
    if (title.includes('summer') || title.includes('canada day')) return 'summer';
    if (title.includes('fall') || title.includes('autumn') || title.includes('halloween')) return 'fall';
    return 'year-round';
  };

  const getIconForEvent = (event: SpecialEvent): string => {
    const category = getEventCategory(event);
    const iconMap: { [key: string]: string } = {
      'music': 'MUS',
      'food-drink': 'FUD',
      'arts-culture': 'ART',
      'festivals': 'FES',
      'theater-comedy': 'THR',
      'seasonal': 'SEA'
    };
    return iconMap[category] || 'EVT';
  };

  // Filter functionality
  const filteredEvents = allEvents.filter(event => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    // Event type filter (map from type to simplified values)
    const matchesEventType = selectedEventTypes.length === 0 || 
      selectedEventTypes.some(type => {
        const eventType = event.type.toLowerCase();
        switch(type) {
          case 'festival': return eventType.includes('festival');
          case 'concert': return eventType.includes('music') || eventType.includes('concert');
          case 'theater': return eventType.includes('theater') || eventType.includes('comedy');
          case 'art': return eventType.includes('art') || eventType.includes('gallery');
          case 'food': return eventType.includes('food') || eventType.includes('taste');
          case 'community': return eventType.includes('community');
          default: return true;
        }
      });

    // Location filter
    const matchesLocation = selectedLocations.length === 0 || 
      selectedLocations.includes(getLocationArea(event.location));

    // Category filter
    const matchesCategory = selectedCategories.length === 0 || 
      selectedCategories.includes(getEventCategory(event));

    // Season filter
    const matchesSeason = selectedSeasons.length === 0 || 
      selectedSeasons.includes(getEventSeason(event));

    return matchesSearch && matchesEventType && matchesLocation && matchesCategory && matchesSeason;
  });

  const displayedEvents = filteredEvents.slice(0, displayCount);

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 12);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setDisplayCount(12);
  };

  // Reset display count when filters change
  React.useEffect(() => {
    setDisplayCount(12);
  }, [selectedEventTypes, selectedLocations, selectedCategories, selectedSeasons, selectedRatings]);

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
          Loading Special Events...
        </div>
      </Box>
    );
  }

  return (
    <Box>
      {/* Swiss Navigation */}
      <nav className="swiss-nav">
        <div className="swiss-container">
          <div className="nav-grid">
            <RouterLink to="/" className="swiss-logo">Toronto</RouterLink>
            
            <div className="search-container">
              <div className="search-wrapper">
                <span className="search-icon">🔍</span>
                <input 
                  type="text" 
                  className="search-input" 
                  placeholder="Search special events..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            
            <ul className="nav-menu">
              <li><RouterLink to="/activities" className="nav-link">Activities</RouterLink></li>
              <li><RouterLink to="/neighborhoods" className="nav-link">Areas</RouterLink></li>
              <li><RouterLink to="/day-trips" className="nav-link">Trips</RouterLink></li>
              <li><RouterLink to="/special-events" className="nav-link active">Events</RouterLink></li>
              <li><RouterLink to="/sporting-events" className="nav-link">Sports</RouterLink></li>
              <li><RouterLink to="/happy-hours" className="nav-link">Happy Hours</RouterLink></li>
              <li><RouterLink to="/amateur-sports" className="nav-link">Play</RouterLink></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <section className="breadcrumb">
        <div className="swiss-container">
          <ul className="breadcrumb-list">
            <li><RouterLink to="/" className="breadcrumb-link">Home</RouterLink></li>
            <li>/</li>
            <li>Special Events</li>
          </ul>
        </div>
      </section>

      {/* Page Header */}
      <section className="page-header">
        <div className="swiss-container">
          <div className="header-content">
            <div>
              <h1 className="page-title">Special Events</h1>
              <p className="page-subtitle">
                Toronto's cultural calendar featuring systematic curation of festivals, performances, and seasonal celebrations. 
                From intimate gallery openings to city-wide festivals, each event represents the finest of Toronto's cultural offerings.
              </p>
            </div>
            <div className="stats-box">
              <div className="stat">
                <div className="stat-number">{filteredEvents.length}</div>
                <div className="stat-label">Filtered Results</div>
              </div>
              <div className="stat">
                <div className="stat-number">6</div>
                <div className="stat-label">Event Types</div>
              </div>
              <div className="stat">
                <div className="stat-number">12</div>
                <div className="stat-label">Venues</div>
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
              label="Event Type"
              options={eventTypeOptions}
              selectedValues={selectedEventTypes}
              onChange={setSelectedEventTypes}
              placeholder="All Types"
            />
            <MultiSelectFilter
              label="Location"
              options={locationOptions}
              selectedValues={selectedLocations}
              onChange={setSelectedLocations}
              placeholder="All Locations"
            />
            <MultiSelectFilter
              label="Category"
              options={categoryOptions}
              selectedValues={selectedCategories}
              onChange={setSelectedCategories}
              placeholder="All Categories"
            />
            <MultiSelectFilter
              label="Season"
              options={seasonOptions}
              selectedValues={selectedSeasons}
              onChange={setSelectedSeasons}
              placeholder="All Seasons"
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
            <h2 className="section-title">Upcoming Events</h2>
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
                No events found
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
                      <div className="card-category">{event.type}</div>
                      <h3 className="card-title">{event.title}</h3>
                      <p className="card-description">{event.description}</p>
                      
                      <ul className="card-features">
                        <li>{event.location}</li>
                        <li>{event.date || 'TBD'}</li>
                        {event.tags.slice(0, 1).map(tag => (
                          <li key={tag}>{tag}</li>
                        ))}
                      </ul>
                      
                      <div className="card-meta">
                        <span className="card-price">Free - $75</span>
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
          }}>Discover More</h2>
          <p style={{ 
            fontSize: 'var(--text-md)', 
            fontWeight: 'var(--weight-light)',
            marginBottom: 'var(--space-4)',
            color: 'var(--color-gray-90)',
            maxWidth: '400px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Explore sporting events, activities, and neighborhoods throughout Toronto.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
            <RouterLink to="/sporting-events" className="btn-primary">Sports Events</RouterLink>
            <RouterLink to="/activities" className="btn-secondary">Browse Activities</RouterLink>
          </div>
        </div>
      </section>
    </Box>
  );
};

export default SpecialEvents; 