import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box } from '@mui/material';

const Home = () => {
  return (
    <Box>
      {/* Swiss Hero Section */}
      <section className="page-header" style={{ paddingTop: '96px', paddingBottom: '64px' }}>
        <div className="swiss-container">
          <div className="header-content">
            <div>
              <h1 className="page-title" style={{ fontSize: '4rem', lineHeight: '0.9' }}>
                Discover <span style={{ color: 'var(--color-accent-sage)' }}>Toronto</span><br />
                With Precision
              </h1>
              <p className="page-subtitle">
                A systematic approach to Toronto's finest experiences. Curated with Swiss precision for discerning adults who value quality and clarity.
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
                <RouterLink to="/activities" className="btn-primary">Explore Now</RouterLink>
                <RouterLink to="/neighborhoods" className="btn-secondary">Browse Guide</RouterLink>
              </div>
            </div>
            <div className="stats-box">
              <div className="stat">
                <div className="stat-number">200+</div>
                <div className="stat-label">Curated Venues</div>
              </div>
              <div className="stat">
                <div className="stat-number">15</div>
                <div className="stat-label">Districts</div>
              </div>
              <div className="stat">
                <div className="stat-number">50+</div>
                <div className="stat-label">Day Trips</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Categories Section */}
      <section className="section-large">
        <div className="swiss-container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
            <div style={{ 
              fontSize: 'var(--text-sm)', 
              fontWeight: 'var(--weight-bold)', 
              color: 'var(--color-accent-sage)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 'var(--space-1)'
            }}>01</div>
            <h2 className="section-title">Core Categories</h2>
            <p style={{ 
              fontSize: 'var(--text-md)', 
              color: 'var(--color-gray-70)',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.5'
            }}>
              Systematically organized experiences designed for sophisticated exploration of Toronto's cultural landscape.
            </p>
          </div>
          
          <div className="feature-grid">
            <div className="card-large">
              <div className="card-icon">ART</div>
              <div className="card-category">01</div>
              <h3 className="card-title">Arts & Culture</h3>
              <p className="card-description">World-class institutions and contemporary galleries.</p>
              <ul className="card-features">
                <li>Royal Ontario Museum</li>
                <li>Art Gallery of Ontario</li>
                <li>Contemporary Shows</li>
              </ul>
            </div>
            
            <div className="card-large">
              <div className="card-icon">DIN</div>
              <div className="card-category">02</div>
              <h3 className="card-title">Fine Dining</h3>
              <p className="card-description">Michelin-caliber establishments and innovative cuisine.</p>
              <ul className="card-features">
                <li>Tasting Menus</li>
                <li>Wine Pairings</li>
                <li>Chef's Tables</li>
              </ul>
            </div>
            
            <div className="card-large">
              <div className="card-icon">LOC</div>
              <div className="card-category">03</div>
              <h3 className="card-title">Premium Districts</h3>
              <p className="card-description">Toronto's most distinguished neighborhoods.</p>
              <ul className="card-features">
                <li>Yorkville Luxury</li>
                <li>The Well Modern</li>
                <li>Distillery Historic</li>
              </ul>
            </div>
            
            <div className="card-large">
              <div className="card-icon">TRP</div>
              <div className="card-category">04</div>
              <h3 className="card-title">Day Escapes</h3>
              <p className="card-description">Curated trips within driving distance.</p>
              <ul className="card-features">
                <li>Niagara Wine Country</li>
                <li>Stratford Theatre</li>
                <li>Blue Mountain</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Grid */}
      <section className="section-large">
        <div className="swiss-container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
            <div style={{ 
              fontSize: 'var(--text-sm)', 
              fontWeight: 'var(--weight-bold)', 
              color: 'var(--color-accent-sage)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 'var(--space-1)'
            }}>02</div>
            <h2 className="section-title">Quick Access</h2>
          </div>
          
          <div className="quick-grid">
            <RouterLink to="/day-trips" className="quick-card" style={{ textDecoration: 'none' }}>
              <div className="quick-icon">CAR</div>
              <div className="quick-title">Day Trips</div>
            </RouterLink>
            
            <RouterLink to="/sporting-events" className="quick-card" style={{ textDecoration: 'none' }}>
              <div className="quick-icon">SPT</div>
              <div className="quick-title">Sports</div>
            </RouterLink>
            
            <RouterLink to="/special-events" className="quick-card" style={{ textDecoration: 'none' }}>
              <div className="quick-icon">EVT</div>
              <div className="quick-title">Events</div>
            </RouterLink>
            
            <RouterLink to="/happy-hours" className="quick-card" style={{ textDecoration: 'none' }}>
              <div className="quick-icon">NLF</div>
              <div className="quick-title">Nightlife</div>
            </RouterLink>
            
            <div className="quick-card">
              <div className="quick-icon">WEL</div>
              <div className="quick-title">Wellness</div>
            </div>
            
            <div className="quick-card">
              <div className="quick-icon">SHP</div>
              <div className="quick-title">Shopping</div>
            </div>
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
            fontSize: 'var(--text-3xl)', 
            fontWeight: 'var(--weight-bold)',
            textTransform: 'uppercase',
            letterSpacing: '-0.01em',
            marginBottom: 'var(--space-3)'
          }}>Start Exploring</h2>
          <p style={{ 
            fontSize: 'var(--text-md)', 
            fontWeight: 'var(--weight-light)',
            marginBottom: 'var(--space-4)',
            color: 'var(--color-gray-90)',
            maxWidth: '500px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Join thousands of discerning Torontonians who trust our systematic recommendations.
          </p>
          <RouterLink to="/activities" className="btn-primary">Get Started</RouterLink>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        backgroundColor: 'var(--color-white)', 
        borderTop: '1px solid var(--color-gray-90)',
        padding: 'var(--space-3) 0',
        textAlign: 'center'
      }}>
        <div className="swiss-container">
          <p style={{ 
            fontSize: 'var(--text-sm)', 
            color: 'var(--color-gray-70)',
            fontWeight: 'var(--weight-medium)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            &copy; 2024 Toronto Guide — Systematic Lifestyle Curation
          </p>
        </div>
      </footer>
    </Box>
  );
};

export default Home; 