import React, { useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, useTheme, useMediaQuery } from '@mui/material';

// Memoize the card components to prevent unnecessary re-renders
const FeatureCard = React.memo(({ icon, category, title, description, features }: {
  icon: string;
  category: string;
  title: string;
  description: string;
  features: string[];
}) => (
  <div className="card-large">
    <div className="card-icon">{icon}</div>
    <div className="card-category">{category}</div>
    <h3 className="card-title">{title}</h3>
    <p className="card-description">{description}</p>
    <ul className="card-features">
      {features.map((feature, index) => (
        <li key={index}>{feature}</li>
      ))}
    </ul>
  </div>
));

// Memoize the quick access card
const QuickCard = React.memo(({ icon, title, to }: {
  icon: string;
  title: string;
  to?: string;
}) => {
  const Content = (
    <>
      <div className="quick-icon">{icon}</div>
      <div className="quick-title">{title}</div>
    </>
  );

  if (to) {
    return (
      <RouterLink to={to} className="quick-card" style={{ textDecoration: 'none' }}>
        {Content}
      </RouterLink>
    );
  }

  return <div className="quick-card">{Content}</div>;
});

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Memoize the feature cards data
  const featureCards = useMemo(() => [
    {
      icon: 'ART',
      category: '01',
      title: 'Arts & Culture',
      description: 'World-class institutions and contemporary galleries.',
      features: ['Royal Ontario Museum', 'Art Gallery of Ontario', 'Contemporary Shows']
    },
    {
      icon: 'DIN',
      category: '02',
      title: 'Fine Dining',
      description: 'Michelin-caliber establishments and innovative cuisine.',
      features: ['Tasting Menus', 'Wine Pairings', "Chef's Tables"]
    },
    {
      icon: 'LOC',
      category: '03',
      title: 'Premium Districts',
      description: "Toronto's most distinguished neighborhoods.",
      features: ['Yorkville Luxury', 'The Well Modern', 'Distillery Historic']
    },
    {
      icon: 'TRP',
      category: '04',
      title: 'Day Escapes',
      description: 'Curated trips within driving distance.',
      features: ['Niagara Wine Country', 'Stratford Theatre', 'Blue Mountain']
    }
  ], []);

  // Memoize the quick access cards data
  const quickCards = useMemo(() => [
    { icon: 'CAR', title: 'Day Trips', to: '/day-trips' },
    { icon: 'SPT', title: 'Sports', to: '/sporting-events' },
    { icon: 'EVT', title: 'Events', to: '/special-events' },
    { icon: 'NLF', title: 'Nightlife', to: '/happy-hours' },
    { icon: 'WEL', title: 'Wellness' },
    { icon: 'SHP', title: 'Shopping' }
  ], []);

  return (
    <Box>
      {/* Swiss Hero Section */}
      <section className="page-header" style={{ 
        paddingTop: isMobile ? '64px' : '96px', 
        paddingBottom: isMobile ? '40px' : '64px' 
      }}>
        <div className="swiss-container">
          <div className="header-content" style={{ 
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '2rem' : 'inherit'
          }}>
            <div>
              <h1 className="page-title" style={{ 
                fontSize: isMobile ? '2.5rem' : '4rem', 
                lineHeight: '0.9',
                marginBottom: isMobile ? '1rem' : 'inherit'
              }}>
                Discover <span style={{ color: 'var(--color-accent-sage)' }}>Toronto</span><br />
                With Precision
              </h1>
              <p className="page-subtitle" style={{
                fontSize: isMobile ? '1rem' : 'inherit',
                marginBottom: isMobile ? '1.5rem' : 'inherit'
              }}>
                A systematic approach to Toronto&apos;s finest experiences. Curated with Swiss precision for discerning adults who value quality and clarity.
              </p>
              <div style={{ 
                display: 'flex', 
                gap: 'var(--space-3)', 
                marginTop: 'var(--space-4)',
                flexDirection: isMobile ? 'column' : 'row',
                width: isMobile ? '100%' : 'auto'
              }}>
                <RouterLink to="/activities" className="btn-primary" style={{
                  width: isMobile ? '100%' : 'auto',
                  textAlign: 'center'
                }}>Explore Now</RouterLink>
                <RouterLink to="/day-trips" className="btn-secondary" style={{
                  width: isMobile ? '100%' : 'auto',
                  textAlign: 'center'
                }}>View Day Trips</RouterLink>
              </div>
            </div>
            <div className="stats-box" style={{
              gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr',
              gap: isMobile ? '1rem' : 'inherit'
            }}>
              {[
                { number: '200+', label: 'Curated Venues' },
                { number: '15', label: 'Districts' },
                { number: '50+', label: 'Day Trips' }
              ].map((stat, index) => (
                <div key={index} className="stat">
                  <div className="stat-number" style={{
                    fontSize: isMobile ? '2rem' : 'inherit'
                  }}>{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Categories Section */}
      <section className="section-large">
        <div className="swiss-container">
          <div style={{ textAlign: 'center', marginBottom: isMobile ? 'var(--space-4)' : 'var(--space-6)' }}>
            <div style={{ 
              fontSize: 'var(--text-sm)', 
              fontWeight: 'var(--weight-bold)', 
              color: 'var(--color-accent-sage)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 'var(--space-1)'
            }}>01</div>
            <h2 className="section-title" style={{
              fontSize: isMobile ? '1.75rem' : 'inherit'
            }}>Core Categories</h2>
            <p style={{ 
              fontSize: isMobile ? '0.875rem' : 'var(--text-md)', 
              color: 'var(--color-gray-70)',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.5',
              padding: isMobile ? '0 1rem' : '0'
            }}>
              Systematically organized experiences designed for sophisticated exploration of Toronto&apos;s cultural landscape.
            </p>
          </div>
          
          <div className="feature-grid" style={{
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: isMobile ? '1rem' : '2rem'
          }}>
            {featureCards.map((card, index) => (
              <FeatureCard key={index} {...card} />
            ))}
          </div>
        </div>
      </section>

      {/* Quick Access Grid */}
      <section className="section-large">
        <div className="swiss-container">
          <div style={{ textAlign: 'center', marginBottom: isMobile ? 'var(--space-4)' : 'var(--space-6)' }}>
            <div style={{ 
              fontSize: 'var(--text-sm)', 
              fontWeight: 'var(--weight-bold)', 
              color: 'var(--color-accent-sage)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 'var(--space-1)'
            }}>02</div>
            <h2 className="section-title" style={{
              fontSize: isMobile ? '1.75rem' : 'inherit'
            }}>Quick Access</h2>
          </div>
          
          <div className="quick-grid" style={{
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: isMobile ? '1rem' : '2rem'
          }}>
            {quickCards.map((card, index) => (
              <QuickCard key={index} {...card} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section style={{ 
        backgroundColor: 'var(--color-black)', 
        color: 'var(--color-white)', 
        padding: isMobile ? 'var(--space-6) var(--space-4)' : 'var(--space-8) 0',
        textAlign: 'center'
      }}>
        <div className="swiss-container">
          <h2 style={{ 
            fontSize: isMobile ? '1.75rem' : 'var(--text-3xl)', 
            fontWeight: 'var(--weight-bold)',
            textTransform: 'uppercase',
            letterSpacing: '-0.01em',
            marginBottom: 'var(--space-3)'
          }}>Start Exploring New Cities</h2>
          <p style={{ 
            fontSize: isMobile ? '0.875rem' : 'var(--text-md)', 
            fontWeight: 'var(--weight-light)',
            marginBottom: 'var(--space-4)',
            color: 'var(--color-gray-90)',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: isMobile ? '0 1rem' : '0'
          }}>
            Discover curated experiences in North America's most vibrant cities. Each guide is crafted with precision for sophisticated travelers and locals alike.
          </p>
          <Box sx={{ 
            display: 'flex', 
            gap: isMobile ? 2 : 3,
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: 4,
            flexDirection: isMobile ? 'column' : 'row',
            padding: isMobile ? '0 1rem' : '0'
          }}>
            <RouterLink to="/boulder" className="btn-primary" style={{
              width: isMobile ? '100%' : 'auto',
              textAlign: 'center'
            }}>Explore Boulder</RouterLink>
            <RouterLink to="/activities" className="btn-primary" style={{
              width: isMobile ? '100%' : 'auto',
              textAlign: 'center'
            }}>Explore Toronto</RouterLink>
          </Box>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        backgroundColor: 'var(--color-white)', 
        borderTop: '1px solid var(--color-gray-90)',
        padding: isMobile ? 'var(--space-2) var(--space-4)' : 'var(--space-3) 0',
        textAlign: 'center'
      }}>
        <div className="swiss-container">
          <p style={{ 
            fontSize: isMobile ? '0.75rem' : 'var(--text-sm)', 
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

export default React.memo(Home); 