import React from 'react';
import { Box, Grid, Typography, Button, Chip, Card, CardContent } from '@mui/material';
import {
  Flag,
  CalendarToday,
  AccessTime,
  Star,
  ArrowForward,
  TheaterComedy,
  MusicNote,
  Groups,
  EmojiEvents
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

// Pride Montreal KP Week Overview
const PrideMontrealKP = () => {
  const days = [
    {
      id: 1,
      route: '/pride-montreal-day1',
      date: 'August 6, 2025',
      dayName: 'Wednesday',
      theme: 'Arrival & Village Welcome',
      description: 'Settle into Montreal\'s vibrant Gay Village and explore the Pride atmosphere',
      highlight: 'First taste of Montreal\'s LGBTQ+ scene',
      color: '#FF6B6B',
      icon: <Flag />,
      activities: 'Village dinner, bar hopping, Jardins Gamelin Pride shows'
    },
    {
      id: 2,
      route: '/pride-montreal-day2',
      date: 'August 7, 2025',
      dayName: 'Thursday',
      theme: 'Soirée 100% Drag',
      description: 'World\'s largest free drag show and historic Montreal exploration',
      highlight: 'Barbada & Rita Baga at Olympic Park + LOUCHE XXL afterparty',
      color: '#4ECDC4',
      icon: <TheaterComedy />,
      activities: 'Old Montreal tour, Soirée 100% Drag, LOUCHE XXL at Club Soda'
    },
    {
      id: 3,
      route: '/pride-montreal-day3',
      date: 'August 8, 2025',
      dayName: 'Friday',
      theme: 'DistinXion',
      description: 'Celebrating queer women with major artists and Community Days begin',
      highlight: 'Fefe Dobson, Charlotte Day Wilson & G Flip + Community Days',
      color: '#45B7D1',
      icon: <Star />,
      activities: 'Mount Royal hike, DistinXion celebration, Community Days, Hedwig musical'
    },
    {
      id: 4,
      route: '/pride-montreal-day4',
      date: 'August 9, 2025',
      dayName: 'Saturday',
      theme: 'Xcellence',
      description: 'Celebrating racialized LGBTQ+ communities plus epic EDM festival',
      highlight: 'Iniko, Bilal Hassani & Ivy Queen + High Heels Race + íLESONIQ',
      color: '#9B59B6',
      icon: <Groups />,
      activities: 'High Heels Race, Xcellence show, íLESONIQ festival, LP Giobbi afterparty'
    },
    {
      id: 5,
      route: '/pride-montreal-day5',
      date: 'August 10, 2025',
      dayName: 'Sunday',
      theme: 'Pride Parade Day - "Blossom Here, Now!"',
      description: 'The grand finale with Pride Parade and epic celebrations',
      highlight: 'Pride Parade + Mega T-Dance + Pride Sundae finale',
      color: '#E74C3C',
      icon: <EmojiEvents />,
      activities: 'Pride Parade, Mega T-Dance, Pride Sundae, secret afterparties'
    }
  ];

  return (
    <Box sx={{ padding: { xs: 2, md: 4 }, maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h1" sx={{ 
          fontSize: 'clamp(2.5rem, 6vw, 4rem)', 
          fontWeight: 'bold', 
          mb: 2,
          background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #9B59B6, #E74C3C)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent'
        }}>
          Pride Montreal KP Week
        </Typography>
        
        <Typography variant="h3" sx={{ 
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', 
          fontWeight: 'medium',
          color: 'text.secondary',
          mb: 2
        }}>
          August 6-10, 2025
        </Typography>
        
        <Typography variant="h4" sx={{
          fontSize: 'clamp(1.2rem, 3vw, 2rem)',
          fontWeight: 'medium',
          color: 'primary.main',
          mb: 3
        }}>
          "Blossom Here, Now!"
        </Typography>
        
        <Typography variant="body1" sx={{ 
          fontSize: '1.2rem',
          color: 'text.secondary',
          maxWidth: '900px',
          margin: '0 auto',
          mb: 4,
          lineHeight: 1.6
        }}>
          Experience Montreal Pride like never before! 5 days of official Fierté Montréal events, 
          world-class drag shows, electronic music festivals, and the largest francophone Pride parade in the world.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', mb: 4 }}>
          <Chip icon={<Flag />} label="Official Fierté Montréal Events" color="primary" />
          <Chip icon={<TheaterComedy />} label="World's Largest Free Drag Show" color="secondary" />
          <Chip icon={<MusicNote />} label="íLESONIQ EDM Festival" />
          <Chip icon={<EmojiEvents />} label="Pride Parade" variant="outlined" />
        </Box>

        {/* Key Info */}
        <Grid container spacing={4} sx={{ mb: 6, maxWidth: '800px', margin: '0 auto' }}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <CalendarToday color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                5 Days
              </Typography>
              <Typography variant="body2" color="text.secondary">
                August 6-10, 2025
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <AccessTime color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                24/7 Events
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Morning to late night
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Star color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                100+ Events
              </Typography>
              <Typography variant="body2" color="text.secondary">
                With alternatives for every taste
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Days Grid */}
      <Typography variant="h2" sx={{ 
        textAlign: 'center', 
        mb: 4, 
        fontWeight: 'bold',
        fontSize: 'clamp(1.8rem, 4vw, 2.5rem)'
      }}>
        Your 5-Day Pride Journey
      </Typography>

      <Grid container spacing={4}>
        {days.map((day) => (
          <Grid item xs={12} md={6} lg={4} key={day.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                },
                border: `2px solid ${day.color}`,
                borderRadius: 3
              }}
              component={RouterLink}
              to={day.route}
              style={{ textDecoration: 'none' }}
            >
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box 
                    sx={{ 
                      backgroundColor: day.color, 
                      color: 'white', 
                      borderRadius: '50%', 
                      p: 1, 
                      mr: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {day.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: day.color }}>
                      Day {day.id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {day.dayName}, {day.date}
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="h5" sx={{ 
                  fontWeight: 'bold', 
                  mb: 2,
                  fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)',
                  lineHeight: 1.2
                }}>
                  {day.theme}
                </Typography>
                
                <Typography variant="body1" sx={{ 
                  mb: 2, 
                  color: 'text.secondary',
                  lineHeight: 1.5
                }}>
                  {day.description}
                </Typography>
                
                <Box sx={{ 
                  backgroundColor: `${day.color}15`, 
                  padding: 2, 
                  borderRadius: 2, 
                  mb: 2,
                  border: `1px solid ${day.color}30`
                }}>
                  <Typography variant="body2" sx={{ 
                    fontWeight: 'bold', 
                    color: day.color,
                    mb: 1
                  }}>
                    Highlights:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {day.highlight}
                  </Typography>
                </Box>
                
                <Typography variant="body2" sx={{ 
                  color: 'text.secondary',
                  mb: 3,
                  fontStyle: 'italic'
                }}>
                  {day.activities}
                </Typography>
                
                <Button 
                  variant="contained" 
                  endIcon={<ArrowForward />}
                  fullWidth
                  sx={{ 
                    backgroundColor: day.color,
                    '&:hover': {
                      backgroundColor: day.color,
                      filter: 'brightness(0.9)'
                    }
                  }}
                >
                  View Day {day.id} Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Footer */}
      <Box sx={{ mt: 8, textAlign: 'center', p: 4, backgroundColor: 'rgba(255,107,107,0.1)', borderRadius: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
          Ready for Pride Montreal KP Week?
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, maxWidth: '600px', margin: '0 auto' }}>
          From intimate Village welcome dinners to the world's largest free drag show, 
          from electronic music festivals to the grand Pride Parade finale - every moment is designed for you.
        </Typography>
        <Button 
          component={RouterLink}
          to="/pride-montreal-day1"
          variant="contained" 
          size="large"
          startIcon={<Flag />}
          sx={{ mr: 2, mb: { xs: 2, md: 0 } }}
        >
          Start with Day 1
        </Button>
        <Button 
          component={RouterLink}
          to="/pride-montreal-day5"
          variant="outlined" 
          size="large"
          endIcon={<EmojiEvents />}
        >
          Jump to Parade Day
        </Button>
      </Box>
    </Box>
  );
};

export default PrideMontrealKP; 