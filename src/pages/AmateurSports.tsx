import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box } from '@mui/material';
import { AmateurSport, loadAmateurSports } from '../utils/dataLoader';
import MultiSelectFilter from '../components/MultiSelectFilter';

const AmateurSports = () => {
  const [allSports, setAllSports] = useState<AmateurSport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayCount, setDisplayCount] = useState(12);

  // Filter states
  const [selectedSportTypes, setSelectedSportTypes] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedSkillLevels, setSelectedSkillLevels] = useState<string[]>([]);
  const [selectedFrequencies, setSelectedFrequencies] = useState<string[]>([]);
  const [selectedCosts, setSelectedCosts] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await loadAmateurSports();
        setAllSports(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading amateur sports data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter options
  const sportTypeOptions = [
    { value: 'basketball', label: 'Basketball' },
    { value: 'soccer', label: 'Soccer/Football' },
    { value: 'volleyball', label: 'Volleyball' },
    { value: 'tennis', label: 'Tennis' },
    { value: 'ultimate', label: 'Ultimate Frisbee' },
    { value: 'fitness', label: 'Fitness Groups' }
  ];

  const locationOptions = [
    { value: 'downtown', label: 'Downtown' },
    { value: 'west-end', label: 'West End' },
    { value: 'east-end', label: 'East End' },
    { value: 'north-york', label: 'North York' },
    { value: 'etobicoke', label: 'Etobicoke' },
    { value: 'scarborough', label: 'Scarborough' }
  ];

  const skillLevelOptions = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'all-levels', label: 'All Levels' }
  ];

  const frequencyOptions = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'bi-weekly', label: 'Bi-weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'drop-in', label: 'Drop-in' }
  ];

  const costOptions = [
    { value: 'free', label: 'Free' },
    { value: 'low', label: 'Low Cost ($0-20)' },
    { value: 'moderate', label: 'Moderate ($20-50)' },
    { value: 'premium', label: 'Premium ($50+)' }
  ];

  // Helper functions
  const getSportType = (sport: AmateurSport): string => {
    const title = sport.title.toLowerCase();
    const type = sport.type.toLowerCase();
    
    if (title.includes('basketball') || type.includes('basketball')) return 'basketball';
    if (title.includes('soccer') || title.includes('football') || type.includes('soccer')) return 'soccer';
    if (title.includes('volleyball') || type.includes('volleyball')) return 'volleyball';
    if (title.includes('tennis') || type.includes('tennis')) return 'tennis';
    if (title.includes('ultimate') || title.includes('frisbee') || type.includes('ultimate')) return 'ultimate';
    if (title.includes('fitness') || title.includes('bootcamp') || type.includes('fitness')) return 'fitness';
    return 'fitness';
  };

  const getLocationCategory = (location: string): string => {
    const loc = location.toLowerCase();
    
    if (loc.includes('downtown') || loc.includes('financial')) return 'downtown';
    if (loc.includes('west') || loc.includes('ossington') || loc.includes('trinity')) return 'west-end';
    if (loc.includes('east') || loc.includes('beaches') || loc.includes('leslieville')) return 'east-end';
    if (loc.includes('north york') || loc.includes('sheppard')) return 'north-york';
    if (loc.includes('etobicoke')) return 'etobicoke';
    if (loc.includes('scarborough')) return 'scarborough';
    return 'downtown';
  };

  const getSkillLevel = (skill: string): string => {
    const s = skill.toLowerCase();
    
    if (s.includes('beginner') || s.includes('novice')) return 'beginner';
    if (s.includes('intermediate')) return 'intermediate';
    if (s.includes('advanced') || s.includes('competitive')) return 'advanced';
    return 'all-levels';
  };

  const getIconForSport = (sport: AmateurSport): string => {
    const sportType = getSportType(sport);
    const iconMap: { [key: string]: string } = {
      'basketball': 'BBL',
      'soccer': 'SOC',
      'volleyball': 'VBL',
      'tennis': 'TEN',
      'ultimate': 'ULT',
      'fitness': 'FIT'
    };
    return iconMap[sportType] || 'SPT';
  };

  // Filter functionality
  const filteredSports = allSports.filter(sport => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      sport.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sport.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sport.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sport.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    // Sport type filter
    const matchesSportType = selectedSportTypes.length === 0 || 
      selectedSportTypes.includes(getSportType(sport));

    // Location filter
    const matchesLocation = selectedLocations.length === 0 || 
      selectedLocations.includes(getLocationCategory(sport.location));

    // Skill level filter
    const matchesSkillLevel = selectedSkillLevels.length === 0 || 
      selectedSkillLevels.includes(getSkillLevel(sport.skillLevel));

    return matchesSearch && matchesSportType && matchesLocation && matchesSkillLevel;
  });

  const displayedSports = filteredSports.slice(0, displayCount);

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
  }, [selectedSportTypes, selectedLocations, selectedSkillLevels, selectedFrequencies, selectedCosts]);

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
          Loading Play Activities...
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
                  placeholder="Search play activities..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            
            <ul className="nav-menu">
              <li><RouterLink to="/activities" className="nav-link">Activities</RouterLink></li>
              <li><RouterLink to="/neighborhoods" className="nav-link">Areas</RouterLink></li>
              <li><RouterLink to="/day-trips" className="nav-link">Trips</RouterLink></li>
              <li><RouterLink to="/special-events" className="nav-link">Events</RouterLink></li>
              <li><RouterLink to="/sporting-events" className="nav-link">Sports</RouterLink></li>
              <li><RouterLink to="/happy-hours" className="nav-link">Happy Hours</RouterLink></li>
              <li><RouterLink to="/amateur-sports" className="nav-link active">Play</RouterLink></li>
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
            <li>Play</li>
          </ul>
        </div>
      </section>

      {/* Page Header */}
      <section className="page-header">
        <div className="swiss-container">
          <div className="header-content">
            <div>
              <h1 className="page-title">Play</h1>
              <p className="page-subtitle">
                Toronto's vibrant amateur sports and recreational activities. 
                From pick-up basketball to organized leagues, discover opportunities to stay active and connect with like-minded players.
              </p>
            </div>
            <div className="stats-box">
              <div className="stat">
                <div className="stat-number">{filteredSports.length}</div>
                <div className="stat-label">Filtered Results</div>
              </div>
              <div className="stat">
                <div className="stat-number">6</div>
                <div className="stat-label">Sport Types</div>
              </div>
              <div className="stat">
                <div className="stat-number">50+</div>
                <div className="stat-label">Locations</div>
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
              label="Sport Type"
              options={sportTypeOptions}
              selectedValues={selectedSportTypes}
              onChange={setSelectedSportTypes}
              placeholder="All Sports"
            />
            <MultiSelectFilter
              label="Location"
              options={locationOptions}
              selectedValues={selectedLocations}
              onChange={setSelectedLocations}
              placeholder="All Areas"
            />
            <MultiSelectFilter
              label="Skill Level"
              options={skillLevelOptions}
              selectedValues={selectedSkillLevels}
              onChange={setSelectedSkillLevels}
              placeholder="All Levels"
            />
            <MultiSelectFilter
              label="Frequency"
              options={frequencyOptions}
              selectedValues={selectedFrequencies}
              onChange={setSelectedFrequencies}
              placeholder="Any Frequency"
            />
            <MultiSelectFilter
              label="Cost"
              options={costOptions}
              selectedValues={selectedCosts}
              onChange={setSelectedCosts}
              placeholder="Any Cost"
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
            <h2 className="section-title">Available Activities</h2>
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
                No activities found
              </div>
              <p>Try adjusting your search terms or filters</p>
            </div>
          ) : (
            <>
              <div className="content-grid">
                {displayedSports.map((sport) => (
                  <div key={sport.id} className="activity-card">
                    <div className="card-image">
                      {getIconForSport(sport)}
                    </div>
                    <div className="card-content">
                      <div className="card-category">{sport.type}</div>
                      <h3 className="card-title">{sport.title}</h3>
                      <p className="card-description">{sport.description}</p>
                      
                      <ul className="card-features">
                        <li>{sport.location}</li>
                        <li>Skill: {sport.skillLevel}</li>
                        {sport.tags.slice(0, 1).map(tag => (
                          <li key={tag}>{tag}</li>
                        ))}
                      </ul>
                      
                      <div className="card-meta">
                        <span className="card-price">Drop-in Welcome</span>
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
          }}>Get Moving!</h2>
          <p style={{ 
            fontSize: 'var(--text-md)', 
            fontWeight: 'var(--weight-light)',
            marginBottom: 'var(--space-4)',
            color: 'var(--color-gray-90)',
            maxWidth: '400px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Explore activities, events, and neighborhoods throughout Toronto.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
            <RouterLink to="/activities" className="btn-primary">Browse Activities</RouterLink>
            <RouterLink to="/sporting-events" className="btn-secondary">Pro Sports</RouterLink>
          </div>
        </div>
      </section>
    </Box>
  );
};

export default AmateurSports; 