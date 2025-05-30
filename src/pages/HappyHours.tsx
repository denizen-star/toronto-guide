import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box } from '@mui/material';
import { loadVenues, loadHappyHours, type Venue, type HappyHour } from '../utils/dataLoader';
import MultiSelectFilter from '../components/MultiSelectFilter';
import { useSearch } from '../components/Layout';

interface VenueWithHappyHours extends Venue {
  happyHours: HappyHour[];
  tags: string[];
}

const HappyHours = () => {
  const { searchTerm, setSearchPlaceholder } = useSearch();
  const [allVenues, setAllVenues] = useState<VenueWithHappyHours[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(12);

  // Filter states
  const [selectedVenueTypes, setSelectedVenueTypes] = useState<string[]>([]);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);

  // Set search placeholder for this page
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
              tags: ['Happy Hour', 'Drinks', 'Social'] // Simple string tags for now
            };
          })
          .filter((venue): venue is VenueWithHappyHours => venue !== null);

        setAllVenues(venuesWithHappyHours);
        setLoading(false);
      } catch (error) {
        console.error('Error loading happy hours data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter options
  const venueTypeOptions = [
    { value: 'bar', label: 'Bars & Lounges' },
    { value: 'restaurant', label: 'Restaurants' },
    { value: 'pub', label: 'Pubs & Gastropubs' },
    { value: 'club', label: 'Clubs & Nightlife' },
    { value: 'brewery', label: 'Breweries' },
    { value: 'rooftop', label: 'Rooftop Venues' }
  ];

  const neighborhoodOptions = [
    { value: 'downtown', label: 'Downtown' },
    { value: 'king-west', label: 'King West' },
    { value: 'yorkville', label: 'Yorkville' },
    { value: 'entertainment', label: 'Entertainment District' },
    { value: 'ossington', label: 'Ossington' },
    { value: 'waterfront', label: 'Waterfront' }
  ];

  const dayOptions = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];

  const timeOptions = [
    { value: 'early', label: 'Early (3-4 PM)' },
    { value: 'standard', label: 'Standard (4-6 PM)' },
    { value: 'evening', label: 'Evening (6-8 PM)' },
    { value: 'late', label: 'Late (8+ PM)' }
  ];

  const priceOptions = [
    { value: 'budget', label: 'Budget ($3-6)' },
    { value: 'moderate', label: 'Moderate ($6-10)' },
    { value: 'upscale', label: 'Upscale ($10-15)' },
    { value: 'premium', label: 'Premium ($15+)' }
  ];

  // Helper functions
  const getVenueType = (venue: VenueWithHappyHours): string => {
    const name = venue.name.toLowerCase();
    const neighborhood = venue.neighborhood.toLowerCase();
    
    if (name.includes('bar') || name.includes('lounge')) return 'bar';
    if (name.includes('restaurant') || name.includes('bistro')) return 'restaurant';
    if (name.includes('pub') || name.includes('gastropub')) return 'pub';
    if (name.includes('club') || name.includes('nightclub')) return 'club';
    if (name.includes('brewery') || name.includes('taproom')) return 'brewery';
    if (name.includes('rooftop') || neighborhood.includes('rooftop')) return 'rooftop';
    return 'bar';
  };

  const getNeighborhoodCategory = (neighborhood: string): string => {
    const n = neighborhood.toLowerCase();
    
    if (n.includes('downtown') || n.includes('financial')) return 'downtown';
    if (n.includes('king west') || n.includes('liberty')) return 'king-west';
    if (n.includes('yorkville') || n.includes('midtown')) return 'yorkville';
    if (n.includes('entertainment') || n.includes('theatre')) return 'entertainment';
    if (n.includes('ossington') || n.includes('trinity')) return 'ossington';
    if (n.includes('waterfront') || n.includes('harbourfront')) return 'waterfront';
    return 'downtown';
  };

  const getTimeCategory = (happyHour: HappyHour): string => {
    const startHour = parseInt(happyHour.start_time.split(':')[0]);
    
    if (startHour <= 15) return 'early';
    if (startHour <= 17) return 'standard';
    if (startHour <= 19) return 'evening';
    return 'late';
  };

  const getDayCategory = (happyHour: HappyHour): string => {
    return happyHour.day_of_week.toLowerCase();
  };

  const getIconForVenue = (venue: VenueWithHappyHours): string => {
    const venueType = getVenueType(venue);
    const iconMap: { [key: string]: string } = {
      'bar': 'BAR',
      'restaurant': 'RST',
      'pub': 'PUB',
      'club': 'CLB',
      'brewery': 'BRW',
      'rooftop': 'RTF'
    };
    return iconMap[venueType] || 'HH';
  };

  const formatHappyHourTime = (venue: VenueWithHappyHours): string => {
    if (venue.happyHours.length === 0) return 'Check venue';
    const hh = venue.happyHours[0];
    return `${hh.start_time} - ${hh.end_time}`;
  };

  const getHappyHourOfferings = (venue: VenueWithHappyHours): string => {
    if (venue.happyHours.length === 0) return 'Special offers available';
    return venue.happyHours[0].offerings;
  };

  // Filter functionality
  const filteredVenues = allVenues.filter(venue => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.neighborhood.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.happyHours.some(hh => hh.offerings.toLowerCase().includes(searchTerm.toLowerCase()));

    // Venue type filter
    const matchesVenueType = selectedVenueTypes.length === 0 || 
      selectedVenueTypes.includes(getVenueType(venue));

    // Neighborhood filter
    const matchesNeighborhood = selectedNeighborhoods.length === 0 || 
      selectedNeighborhoods.includes(getNeighborhoodCategory(venue.neighborhood));

    // Day filter
    const matchesDay = selectedDays.length === 0 || 
      venue.happyHours.some(hh => selectedDays.includes(getDayCategory(hh)));

    // Time filter
    const matchesTime = selectedTimes.length === 0 || 
      venue.happyHours.some(hh => selectedTimes.includes(getTimeCategory(hh)));

    return matchesSearch && matchesVenueType && matchesNeighborhood && matchesDay && matchesTime;
  });

  const displayedVenues = filteredVenues.slice(0, displayCount);

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 12);
  };

  // Reset display count when filters change
  React.useEffect(() => {
    setDisplayCount(12);
  }, [selectedVenueTypes, selectedNeighborhoods, selectedDays, selectedTimes, selectedPrices, searchTerm]);

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
          Loading Happy Hours...
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
                Toronto's finest after-work destinations with systematically curated drink specials and social venues. 
                From sophisticated cocktail lounges to casual gastropubs, discover the perfect spot for every occasion.
              </p>
            </div>
            <div className="stats-box">
              <div className="stat">
                <div className="stat-number">{filteredVenues.length}</div>
                <div className="stat-label">Filtered Results</div>
              </div>
              <div className="stat">
                <div className="stat-number">6</div>
                <div className="stat-label">Venue Types</div>
              </div>
              <div className="stat">
                <div className="stat-number">15</div>
                <div className="stat-label">Neighborhoods</div>
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
              label="Venue Type"
              options={venueTypeOptions}
              selectedValues={selectedVenueTypes}
              onChange={setSelectedVenueTypes}
              placeholder="All Types"
            />
            <MultiSelectFilter
              label="Neighborhood"
              options={neighborhoodOptions}
              selectedValues={selectedNeighborhoods}
              onChange={setSelectedNeighborhoods}
              placeholder="All Areas"
            />
            <MultiSelectFilter
              label="Day"
              options={dayOptions}
              selectedValues={selectedDays}
              onChange={setSelectedDays}
              placeholder="Any Day"
            />
            <MultiSelectFilter
              label="Time"
              options={timeOptions}
              selectedValues={selectedTimes}
              onChange={setSelectedTimes}
              placeholder="Any Time"
            />
            <MultiSelectFilter
              label="Price Range"
              options={priceOptions}
              selectedValues={selectedPrices}
              onChange={setSelectedPrices}
              placeholder="All Prices"
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
              <div className="content-grid">
                {displayedVenues.map((venue) => (
                  <div key={venue.id} className="activity-card">
                    <div className="card-image">
                      {getIconForVenue(venue)}
                    </div>
                    <div className="card-content">
                      <div className="card-category">{venue.neighborhood}</div>
                      <h3 className="card-title">{venue.name}</h3>
                      <p className="card-description">{getHappyHourOfferings(venue)}</p>
                      
                      <ul className="card-features">
                        <li>{formatHappyHourTime(venue)}</li>
                        <li>{venue.address}</li>
                        {venue.tags.slice(0, 1).map(tag => (
                          <li key={tag}>{tag}</li>
                        ))}
                      </ul>
                      
                      <div className="card-meta">
                        <span className="card-price">Happy Hour Special</span>
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
          }}>Cheers to That!</h2>
          <p style={{ 
            fontSize: 'var(--text-md)', 
            fontWeight: 'var(--weight-light)',
            marginBottom: 'var(--space-4)',
            color: 'var(--color-gray-90)',
            maxWidth: '400px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Explore activities, neighborhoods, and events throughout Toronto.
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

export default HappyHours; 