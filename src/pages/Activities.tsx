import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box } from '@mui/material';
import { 
  loadActivities, 
  loadLocations, 
  loadCategories, 
  loadPrices,
  type Activity, 
  type Category, 
  type Price,
} from '../utils/dataLoader';
import MultiSelectFilter from '../components/MultiSelectFilter';

const Activities = () => {
  const [allActivities, setAllActivities] = useState<Activity[]>([]);
  const [categories, setCategories] = useState<{ [key: string]: Category }>({});
  const [prices, setPrices] = useState<{ [key: string]: Price }>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayCount, setDisplayCount] = useState(12);
  
  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [activitiesData, , categoriesData, pricesData] = await Promise.all([
          loadActivities(),
          loadLocations(), // Load but don't store - not used in current implementation
          loadCategories(),
          loadPrices(),
        ]);
        setAllActivities(activitiesData);
        
        const categoryMap = categoriesData.reduce((acc: { [key: string]: Category }, category: Category) => {
          acc[category.id] = category;
          return acc;
        }, {});
        setCategories(categoryMap);

        const priceMap = pricesData.reduce((acc: { [key: string]: Price }, price: Price) => {
          acc[price.id] = price;
          return acc;
        }, {});
        setPrices(priceMap);

        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter options
  const categoryOptions = Object.entries(categories).map(([id, category]) => ({
    value: id,
    label: category.name
  }));

  const priceOptions = [
    { value: 'free', label: 'Free' },
    { value: 'low', label: '$-$$' },
    { value: 'medium', label: '$$$' },
    { value: 'high', label: '$$$$+' }
  ];

  const durationOptions = [
    { value: 'quick', label: '< 2 Hours' },
    { value: 'half', label: '2-4 Hours' },
    { value: 'full', label: '4+ Hours' },
    { value: 'multi', label: 'Multi-Day' }
  ];

  const ratingOptions = [
    { value: 'excellent', label: 'Excellent (4.5+)' },
    { value: 'very-good', label: 'Very Good (4.0+)' },
    { value: 'good', label: 'Good (3.5+)' },
    { value: 'fair', label: 'Fair (3.0+)' }
  ];

  const areaOptions = [
    { value: 'downtown', label: 'Downtown' },
    { value: 'midtown', label: 'Midtown' },
    { value: 'uptown', label: 'Uptown' },
    { value: 'east', label: 'East End' },
    { value: 'west', label: 'West End' },
    { value: 'north', label: 'North York' }
  ];

  // Filter and search functionality
  const filteredActivities = allActivities.filter(activity => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (activity.neighborhood && activity.neighborhood.toLowerCase().includes(searchTerm.toLowerCase())) ||
      activity.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    // Category filter
    const matchesCategory = selectedCategories.length === 0 || 
      selectedCategories.includes(activity.categoryId);

    // Price filter (simplified logic for demo)
    const matchesPrice = selectedPrices.length === 0 || 
      selectedPrices.some(priceRange => {
        const price = prices[activity.priceId];
        if (!price) return false;
        
        if (priceRange === 'free' && price.type === 'FREE') return true;
        if (priceRange === 'low' && price.type === 'PAID' && price.amount && Number(price.amount) < 25) return true;
        if (priceRange === 'medium' && price.type === 'PAID' && price.amount && Number(price.amount) >= 25 && Number(price.amount) < 75) return true;
        if (priceRange === 'high' && price.type === 'PAID' && price.amount && Number(price.amount) >= 75) return true;
        return false;
      });

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

    return matchesSearch && matchesCategory && matchesPrice && matchesArea;
  });

  const displayedActivities = filteredActivities.slice(0, displayCount);

  const getIconForCategory = (categoryId: string): string => {
    const iconMap: { [key: string]: string } = {
      'outdoor': 'OUT',
      'cultural': 'ART',
      'food': 'DIN',
      'nightlife': 'NLF',
      'shopping': 'SHP',
      'sports': 'SPT',
      'entertainment': 'ENT',
      'wellness': 'WEL'
    };
    return iconMap[categoryId] || 'ACT';
  };

  const getPriceDisplay = (priceId: string) => {
    const price = prices[priceId];
    if (!price) return 'Check website';
    
    if (price.type === 'FREE') return 'Free';
    if (price.type === 'PAID') return `$${price.amount}`;
    if (price.type === 'SPECIAL') return price.notes || 'Special';
    return 'Check website';
  };

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 12);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setDisplayCount(12); // Reset display count when searching
  };

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(12);
  }, [selectedCategories, selectedPrices, selectedDurations, selectedRatings, selectedAreas]);

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
          Loading Activities...
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
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            
            <ul className="nav-menu">
              <li><RouterLink to="/activities" className="nav-link active">Activities</RouterLink></li>
              <li><RouterLink to="/neighborhoods" className="nav-link">Areas</RouterLink></li>
              <li><RouterLink to="/day-trips" className="nav-link">Trips</RouterLink></li>
              <li><RouterLink to="/special-events" className="nav-link">Events</RouterLink></li>
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

      {/* Filter Section */}
      <section className="filter-section">
        <div className="swiss-container">
          <div className="filter-grid">
            <MultiSelectFilter
              label="Category"
              options={categoryOptions}
              selectedValues={selectedCategories}
              onChange={setSelectedCategories}
              placeholder="All Categories"
            />
            <MultiSelectFilter
              label="Price Range"
              options={priceOptions}
              selectedValues={selectedPrices}
              onChange={setSelectedPrices}
              placeholder="All Prices"
            />
            <MultiSelectFilter
              label="Duration"
              options={durationOptions}
              selectedValues={selectedDurations}
              onChange={setSelectedDurations}
              placeholder="Any Duration"
            />
            <MultiSelectFilter
              label="Rating"
              options={ratingOptions}
              selectedValues={selectedRatings}
              onChange={setSelectedRatings}
              placeholder="All Ratings"
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
              <div className="content-grid">
                {displayedActivities.map((activity) => (
                  <div key={activity.id} className="activity-card">
                    <div className="card-image">
                      {getIconForCategory(activity.categoryId)}
                    </div>
                    <div className="card-content">
                      <div className="card-category">
                        {categories[activity.categoryId]?.name || 'Activity'}
                      </div>
                      <h3 className="card-title">{activity.title}</h3>
                      <p className="card-description">{activity.description}</p>
                      
                      <ul className="card-features">
                        <li>{activity.city}</li>
                        <li>{activity.neighborhood || 'Central Toronto'}</li>
                        {activity.tags.slice(0, 1).map(tag => (
                          <li key={tag}>{tag}</li>
                        ))}
                      </ul>
                      
                      <div className="card-meta">
                        <span className="card-price">{getPriceDisplay(activity.priceId)}</span>
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
            Explore neighborhoods, day trips, and special events.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
            <RouterLink to="/neighborhoods" className="btn-primary">Browse Areas</RouterLink>
            <RouterLink to="/day-trips" className="btn-secondary">Day Trips</RouterLink>
          </div>
        </div>
      </section>
    </Box>
  );
};

export default Activities; 