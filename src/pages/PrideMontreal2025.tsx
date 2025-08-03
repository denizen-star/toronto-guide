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

// Pride Montreal 2025 Week Overview
const PrideMontreal2025 = () => {
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
      icon: <MusicNote />,
      activities: 'Community Days booths, DistinXion concert, Club Unity'
    },
    {
      id: 4,
      route: '/pride-montreal-day4',
      date: 'August 9, 2025',
      dayName: 'Saturday',
      theme: 'Xcellence',
      description: 'Celebrating racialized LGBTQ+ communities with incredible performances',
      highlight: 'Iniko, Bilal Hassani & Ivy Queen + High Heels Race',
      color: '#9B59B6',
      icon: <Groups />,
      activities: 'Xcellence concert, High Heels Race, íLESONIQ festival'
    },
    {
      id: 5,
      route: '/pride-montreal-day5',
      date: 'August 10, 2025',
      dayName: 'Sunday',
      theme: 'Pride Parade & Mega T-Dance',
      description: 'The main event! Pride Parade followed by the ultimate celebration',
      highlight: 'Montreal Pride Parade + Mega T-Dance finale',
      color: '#E74C3C',
      icon: <EmojiEvents />,
      activities: 'Pride Parade, Mega T-Dance, closing celebration'
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
          Pride Montreal 2025 Week
        </Typography>
        
        <Typography variant="h4" sx={{ 
          fontSize: 'clamp(1.2rem, 3vw, 2rem)', 
          fontWeight: 'medium',
          color: 'text.secondary',
          mb: 2
        }}>
          August 5-11, 2025 • Complete Guide
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', mb: 4 }}>
          <Chip icon={<CalendarToday />} label="7 Days" color="primary" />
          <Chip icon={<Star />} label="5 Major Events" color="secondary" />
          <Chip icon={<AccessTime />} label="Complete Itinerary" variant="outlined" />
        </Box>

        <Typography variant="body1" sx={{ 
          fontSize: '1.2rem',
          color: 'text.secondary',
          maxWidth: '800px',
          margin: '0 auto',
          lineHeight: 1.7
        }}>
          Experience Montreal's incredible Fierté Montréal Pride week with our complete day-by-day guide. 
          From intimate Village experiences to massive outdoor celebrations, this is your roadmap to an unforgettable week.
        </Typography>
      </Box>

      {/* Days Grid */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {days.map((day) => (
          <Grid item xs={12} md={6} lg={4} key={day.id}>
            <Card 
              component={RouterLink}
              to={day.route}
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                textDecoration: 'none',
                color: 'inherit',
                border: `2px solid ${day.color}`,
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: `0 12px 30px ${day.color}30`,
                  '& .day-icon': {
                    transform: 'scale(1.1)',
                  }
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 2,
                  gap: 2
                }}>
                  <Box 
                    className="day-icon"
                    sx={{ 
                      backgroundColor: day.color, 
                      color: 'white',
                      borderRadius: '50%',
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'transform 0.3s ease'
                    }}
                  >
                    {day.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: day.color }}>
                      Day {day.id}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {day.dayName}, {day.date}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="h5" sx={{ 
                  fontWeight: 'bold', 
                  mb: 1,
                  color: 'text.primary'
                }}>
                  {day.theme}
                </Typography>

                <Typography variant="body2" sx={{ 
                  mb: 2, 
                  color: 'text.secondary',
                  lineHeight: 1.6
                }}>
                  {day.description}
                </Typography>

                <Box sx={{ 
                  backgroundColor: `${day.color}10`, 
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
                    ✨ Highlight:
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    fontStyle: 'italic',
                    color: 'text.secondary'
                  }}>
                    {day.highlight}
                  </Typography>
                </Box>

                <Typography variant="caption" sx={{ 
                  color: 'text.secondary',
                  fontStyle: 'italic'
                }}>
                  {day.activities}
                </Typography>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    endIcon={<ArrowForward />}
                    sx={{ 
                      backgroundColor: day.color,
                      '&:hover': {
                        backgroundColor: day.color,
                        filter: 'brightness(0.9)'
                      }
                    }}
                  >
                    View Day {day.id}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Call to Action */}
      <Box sx={{ 
        textAlign: 'center', 
        mt: 8,
        p: 4,
        backgroundColor: '#f8f9fa',
        borderRadius: 3,
        border: '2px solid #e9ecef'
      }}>
        <Typography variant="h3" sx={{ 
          fontWeight: 'bold', 
          mb: 2,
          background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent'
        }}>
          Ready for Pride Montreal 2025 Week?
        </Typography>
        
        <Typography variant="body1" sx={{ 
          fontSize: '1.1rem',
          color: 'text.secondary',
          mb: 3,
          maxWidth: '600px',
          margin: '0 auto 24px auto'
        }}>
          From intimate Village moments to massive outdoor celebrations, each day offers unique experiences. 
          Click any day above to dive into the detailed itinerary and local insider tips.
        </Typography>

        <Button
          component={RouterLink}
          to="/pride-montreal-day1"
          variant="contained"
          size="large"
          endIcon={<ArrowForward />}
          sx={{ 
            fontSize: '1.1rem',
            px: 4,
            py: 1.5,
            background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
            '&:hover': {
              background: 'linear-gradient(45deg, #FF5252, #26A69A)',
            }
          }}
        >
          Start Your Pride Journey
        </Button>
      </Box>
    </Box>
  );
};

export default PrideMontreal2025; 