import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box } from '@mui/material';
import { 
  loadLocations
} from '../utils/dataLoader';
import MultiSelectFilter from '../components/MultiSelectFilter';

const Neighborhoods = () => {
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [selectedDistrictTypes, setSelectedDistrictTypes] = useState<string[]>([]);
  const [selectedPriceLevels, setSelectedPriceLevels] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedAccess, setSelectedAccess] = useState<string[]>([]);
  const [selectedDistances, setSelectedDistances] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await loadLocations(); // Load but don't store - using static data for now
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter options for neighborhoods
  const districtTypeOptions = [
    { value: 'historic', label: 'Historic District' },
    { value: 'modern', label: 'Modern Development' },
    { value: 'cultural', label: 'Cultural Quarter' },
    { value: 'financial', label: 'Financial District' },
    { value: 'entertainment', label: 'Entertainment Zone' },
    { value: 'residential', label: 'Residential Area' }
  ];

  const priceLevelOptions = [
    { value: 'budget', label: 'Budget-Friendly' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'upscale', label: 'Upscale' },
    { value: 'luxury', label: 'Luxury' }
  ];

  const amenitiesOptions = [
    { value: 'dining', label: 'Fine Dining' },
    { value: 'shopping', label: 'Premium Shopping' },
    { value: 'nightlife', label: 'Nightlife' },
    { value: 'culture', label: 'Cultural Sites' },
    { value: 'parks', label: 'Parks & Green Space' },
    { value: 'waterfront', label: 'Waterfront Access' }
  ];

  const accessOptions = [
    { value: 'subway', label: 'Subway Access' },
    { value: 'streetcar', label: 'Streetcar Lines' },
    { value: 'bus', label: 'Bus Routes' },
    { value: 'bike', label: 'Bike Friendly' },
    { value: 'walk', label: 'Walkable' }
  ];

  const distanceOptions = [
    { value: 'downtown', label: 'Downtown Core' },
    { value: 'near', label: '< 5km from Core' },
    { value: 'mid', label: '5-15km from Core' },
    { value: 'far', label: '15km+ from Core' }
  ];

  const getIconForNeighborhood = (neighborhood: string): string => {
    const iconMap: { [key: string]: string } = {
      'yorkville': 'YRK',
      'distillery': 'DST',
      'king west': 'KNG',
      'entertainment': 'ENT',
      'financial': 'FIN',
      'chinatown': 'CTN',
      'kensington': 'KEN',
      'leslieville': 'LES',
      'the beaches': 'BCH',
      'junction': 'JCT',
      'corktown': 'CRK',
      'liberty village': 'LIB',
      'riverdale': 'RVR',
      'the well': 'WEL',
      'harbourfront': 'HBR'
    };
    
    const key = neighborhood.toLowerCase();
    return iconMap[key] || neighborhood.substring(0, 3).toUpperCase();
  };

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
          Loading Neighborhoods...
        </div>
      </Box>
    );
  }

  // Sample neighborhood data with the loaded locations
  const neighborhoods = [
    {
      id: 'yorkville',
      name: 'Yorkville',
      description: 'Toronto\'s premier luxury district with high-end shopping, fine dining, and sophisticated nightlife.',
      features: ['Luxury Shopping', 'Fine Dining', 'Art Galleries', 'Premium Hotels'],
      priceLevel: 'Luxury',
      type: 'Upscale District'
    },
    {
      id: 'distillery',
      name: 'Distillery District',
      description: 'Historic cobblestone streets house contemporary galleries, boutiques, and artisanal restaurants.',
      features: ['Historic Architecture', 'Art Galleries', 'Craft Distilleries', 'Boutique Shopping'],
      priceLevel: 'Upscale',
      type: 'Historic District'
    },
    {
      id: 'the-well',
      name: 'The Well',
      description: 'Modern mixed-use development featuring international dining, entertainment, and urban living.',
      features: ['Modern Architecture', 'International Cuisine', 'Rooftop Dining', 'Urban Living'],
      priceLevel: 'Moderate',
      type: 'Modern Development'
    },
    {
      id: 'entertainment',
      name: 'Entertainment District',
      description: 'Toronto\'s theater and nightlife hub with world-class venues and after-hours destinations.',
      features: ['Theater District', 'Sports Venues', 'Nightlife', 'Convention Centers'],
      priceLevel: 'Moderate',
      type: 'Entertainment Zone'
    },
    {
      id: 'kensington',
      name: 'Kensington Market',
      description: 'Bohemian enclave known for vintage shopping, diverse eateries, and artistic community.',
      features: ['Vintage Shopping', 'Diverse Dining', 'Street Art', 'Bohemian Culture'],
      priceLevel: 'Budget-Friendly',
      type: 'Cultural Quarter'
    },
    {
      id: 'beaches',
      name: 'The Beaches',
      description: 'Waterfront community with sandy beaches, lakeside dining, and relaxed coastal atmosphere.',
      features: ['Sandy Beaches', 'Waterfront Dining', 'Boardwalk', 'Beach Volleyball'],
      priceLevel: 'Moderate',
      type: 'Waterfront District'
    }
  ];

  return (
    <Box>
      {/* Breadcrumb */}
      <section className="breadcrumb">
        <div className="swiss-container">
          <ul className="breadcrumb-list">
            <li><RouterLink to="/" className="breadcrumb-link">Home</RouterLink></li>
            <li>/</li>
            <li>Neighborhoods</li>
          </ul>
        </div>
      </section>

      {/* Page Header */}
      <section className="page-header">
        <div className="swiss-container">
          <div className="header-content">
            <div>
              <h1 className="page-title">Neighborhoods</h1>
              <p className="page-subtitle">
                Toronto's distinctive districts, each with unique character and carefully curated experiences. 
                From historic cobblestone streets to modern architectural marvels.
              </p>
            </div>
            <div className="stats-box">
              <div className="stat">
                <div className="stat-number">{neighborhoods.length}</div>
                <div className="stat-label">Featured Areas</div>
              </div>
              <div className="stat">
                <div className="stat-number">200+</div>
                <div className="stat-label">Total Venues</div>
              </div>
              <div className="stat">
                <div className="stat-number">8</div>
                <div className="stat-label">District Types</div>
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
              label="District Type"
              options={districtTypeOptions}
              selectedValues={selectedDistrictTypes}
              onChange={setSelectedDistrictTypes}
              placeholder="All Types"
            />
            <MultiSelectFilter
              label="Price Level"
              options={priceLevelOptions}
              selectedValues={selectedPriceLevels}
              onChange={setSelectedPriceLevels}
              placeholder="All Prices"
            />
            <MultiSelectFilter
              label="Amenities"
              options={amenitiesOptions}
              selectedValues={selectedAmenities}
              onChange={setSelectedAmenities}
              placeholder="All Amenities"
            />
            <MultiSelectFilter
              label="Access"
              options={accessOptions}
              selectedValues={selectedAccess}
              onChange={setSelectedAccess}
              placeholder="All Access"
            />
            <MultiSelectFilter
              label="Distance"
              options={distanceOptions}
              selectedValues={selectedDistances}
              onChange={setSelectedDistances}
              placeholder="Any Distance"
            />
          </div>
        </div>
      </section>

      {/* Neighborhoods Grid */}
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
              {neighborhoods.length} Districts
            </div>
            <h2 className="section-title">Featured Neighborhoods</h2>
          </div>
          
          <div className="content-grid">
            {neighborhoods.map((neighborhood) => (
              <div key={neighborhood.id} className="activity-card">
                <div className="card-image">
                  {getIconForNeighborhood(neighborhood.name)}
                </div>
                <div className="card-content">
                  <div className="card-category">{neighborhood.type}</div>
                  <h3 className="card-title">{neighborhood.name}</h3>
                  <p className="card-description">{neighborhood.description}</p>
                  
                  <ul className="card-features">
                    {neighborhood.features.slice(0, 3).map(feature => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                  
                  <div className="card-meta">
                    <span className="card-price">{neighborhood.priceLevel}</span>
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
          }}>Explore More</h2>
          <p style={{ 
            fontSize: 'var(--text-md)', 
            fontWeight: 'var(--weight-light)',
            marginBottom: 'var(--space-4)',
            color: 'var(--color-gray-90)',
            maxWidth: '400px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Discover activities, day trips, and special events in these neighborhoods.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
            <RouterLink to="/activities" className="btn-primary">Browse Activities</RouterLink>
            <RouterLink to="/day-trips" className="btn-secondary">Day Trips</RouterLink>
          </div>
        </div>
      </section>
    </Box>
  );
};

export default Neighborhoods; 