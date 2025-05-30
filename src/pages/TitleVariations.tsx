import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
} from '@mui/material';
import CelebrationIcon from '@mui/icons-material/Celebration';
import StarIcon from '@mui/icons-material/Star';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DiamondIcon from '@mui/icons-material/Diamond';
import FlareIcon from '@mui/icons-material/Flare';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import BlurOnIcon from '@mui/icons-material/BlurOn';

const TitleVariations = () => {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h1" sx={{ textAlign: 'center', mb: 6, fontWeight: 600 }}>
          Title Design Variations
        </Typography>
        <Typography variant="body1" sx={{ textAlign: 'center', mb: 8, color: 'text.secondary' }}>
          Choose your preferred title design style - 3 variations each of Options 2, 3, and 5
        </Typography>

        {/* OPTION 2 VARIATIONS - Clean Minimalist White */}
        <Typography variant="h4" sx={{ textAlign: 'center', mb: 4, fontWeight: 600, color: 'secondary.main' }}>
          Option 2: Clean Minimalist Variations
        </Typography>

        {/* Variation 2A: Original Clean Minimalist */}
        <Paper elevation={3} sx={{ mb: 4, overflow: 'hidden' }}>
          <Typography variant="h6" sx={{ p: 2, bgcolor: 'secondary.main', color: 'white', fontWeight: 600 }}>
            2A: Classic Minimalist
          </Typography>
          <Box sx={{ 
            bgcolor: '#FAFAFA',
            py: { xs: 6, md: 8 },
            position: 'relative',
            borderBottom: '1px solid #E0E0E0',
          }}>
            <Container maxWidth="lg">
              <Box sx={{ 
                textAlign: 'center',
                maxWidth: '700px',
                mx: 'auto',
              }}>
                <Box sx={{ 
                  mb: 4,
                  '&:hover .icon': {
                    transform: 'scale(1.1)',
                  }
                }}>
                  <CelebrationIcon className="icon" sx={{ 
                    fontSize: 60,
                    color: '#FF6B35',
                    transition: 'transform 0.3s ease',
                    mb: 2,
                  }} />
                </Box>
                
                <Typography 
                  variant="h2"
                  component="h1"
                  sx={{ 
                    mb: 3,
                    fontWeight: 300,
                    color: '#2C2C2C',
                    fontSize: { xs: 2.5 * 16, md: 3.2 * 16 },
                    letterSpacing: '0.02em',
                  }}
                >
                  Festivals & Cultural Events
                </Typography>
                
                <Box sx={{ 
                  width: 80,
                  height: 2,
                  bgcolor: '#FF6B35',
                  mx: 'auto',
                  mb: 3,
                  borderRadius: 1,
                }} />
                
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#666666',
                    fontWeight: 400,
                    lineHeight: 1.7,
                    maxWidth: '500px',
                    mx: 'auto',
                    fontSize: 18,
                  }}
                >
                  Experience Toronto's vibrant cultural scene through year-round festivals, concerts, and special celebrations
                </Typography>
              </Box>
            </Container>
          </Box>
        </Paper>

        {/* Variation 2B: Clean with Soft Shadows */}
        <Paper elevation={3} sx={{ mb: 4, overflow: 'hidden' }}>
          <Typography variant="h6" sx={{ p: 2, bgcolor: 'secondary.main', color: 'white', fontWeight: 600 }}>
            2B: Soft Shadow Minimalist
          </Typography>
          <Box sx={{ 
            bgcolor: '#FFFFFF',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)',
            py: { xs: 6, md: 8 },
            position: 'relative',
          }}>
            <Container maxWidth="lg">
              <Box sx={{ 
                textAlign: 'center',
                maxWidth: '700px',
                mx: 'auto',
              }}>
                <Box sx={{ 
                  mb: 4,
                  p: 2,
                  borderRadius: 3,
                  bgcolor: 'white',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  display: 'inline-block',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                  }
                }}>
                  <CelebrationIcon sx={{ 
                    fontSize: 50,
                    color: '#6366F1',
                  }} />
                </Box>
                
                <Typography 
                  variant="h2"
                  component="h1"
                  sx={{ 
                    mb: 3,
                    fontWeight: 400,
                    color: '#1F2937',
                    fontSize: { xs: 2.5 * 16, md: 3.2 * 16 },
                    letterSpacing: '-0.01em',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  Festivals & Cultural Events
                </Typography>
                
                <Box sx={{ 
                  width: 120,
                  height: 3,
                  background: 'linear-gradient(90deg, #6366F1, #8B5CF6)',
                  mx: 'auto',
                  mb: 3,
                  borderRadius: 2,
                  boxShadow: '0 2px 10px rgba(99, 102, 241, 0.3)',
                }} />
                
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#4B5563',
                    fontWeight: 400,
                    lineHeight: 1.7,
                    maxWidth: '500px',
                    mx: 'auto',
                    fontSize: 18,
                  }}
                >
                  Experience Toronto's vibrant cultural scene through year-round festivals, concerts, and special celebrations
                </Typography>
              </Box>
            </Container>
          </Box>
        </Paper>

        {/* Variation 2C: Clean with Teal Accent */}
        <Paper elevation={3} sx={{ mb: 6, overflow: 'hidden' }}>
          <Typography variant="h6" sx={{ p: 2, bgcolor: 'secondary.main', color: 'white', fontWeight: 600 }}>
            2C: Modern Teal Minimalist
          </Typography>
          <Box sx={{ 
            bgcolor: '#F9FAFB',
            py: { xs: 6, md: 8 },
            position: 'relative',
            borderTop: '3px solid #14B8A6',
          }}>
            <Container maxWidth="lg">
              <Box sx={{ 
                textAlign: 'center',
                maxWidth: '700px',
                mx: 'auto',
              }}>
                <Box sx={{ 
                  mb: 4,
                  position: 'relative',
                  display: 'inline-block',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -10,
                    left: -10,
                    right: -10,
                    bottom: -10,
                    borderRadius: '50%',
                    border: '2px solid #14B8A6',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                  },
                  '&:hover::before': {
                    opacity: 0.3,
                  }
                }}>
                  <CelebrationIcon sx={{ 
                    fontSize: 55,
                    color: '#14B8A6',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'rotate(15deg)',
                    }
                  }} />
                </Box>
                
                <Typography 
                  variant="h2"
                  component="h1"
                  sx={{ 
                    mb: 2,
                    fontWeight: 500,
                    color: '#0F172A',
                    fontSize: { xs: 2.5 * 16, md: 3.2 * 16 },
                    letterSpacing: '-0.015em',
                  }}
                >
                  Festivals & Cultural Events
                </Typography>

                <Box sx={{ 
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  bgcolor: '#14B8A6',
                  mx: 'auto',
                  mb: 3,
                  opacity: 0.1,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 100,
                    height: 2,
                    bgcolor: '#14B8A6',
                  }
                }} />
                
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#475569',
                    fontWeight: 400,
                    lineHeight: 1.7,
                    maxWidth: '500px',
                    mx: 'auto',
                    fontSize: 18,
                  }}
                >
                  Experience Toronto's vibrant cultural scene through year-round festivals, concerts, and special celebrations
                </Typography>
              </Box>
            </Container>
          </Box>
        </Paper>

        {/* OPTION 3 VARIATIONS - Bold Neon Accent */}
        <Typography variant="h4" sx={{ textAlign: 'center', mb: 4, fontWeight: 600, color: 'success.main' }}>
          Option 3: Bold Neon Variations
        </Typography>

        {/* Variation 3A: Original Cyan Neon */}
        <Paper elevation={3} sx={{ mb: 4, overflow: 'hidden' }}>
          <Typography variant="h6" sx={{ p: 2, bgcolor: 'success.main', color: 'white', fontWeight: 600 }}>
            3A: Cyan Neon
          </Typography>
          <Box sx={{ 
            bgcolor: '#1A1A1A',
            py: { xs: 6, md: 8 },
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 30% 70%, rgba(0, 255, 255, 0.1) 0%, transparent 50%)',
              zIndex: 1,
            }
          }}>
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
              <Box sx={{ 
                textAlign: 'center',
                maxWidth: '800px',
                mx: 'auto',
              }}>
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 4,
                  gap: 2,
                }}>
                  <Box sx={{
                    p: 2,
                    borderRadius: '50%',
                    bgcolor: 'rgba(0, 255, 255, 0.1)',
                    border: '2px solid #00FFFF',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'rotate(360deg)',
                      boxShadow: '0 0 20px #00FFFF',
                    }
                  }}>
                    <CelebrationIcon sx={{ 
                      fontSize: 40,
                      color: '#00FFFF',
                    }} />
                  </Box>
                </Box>
                
                <Typography 
                  variant="h2"
                  component="h1"
                  sx={{ 
                    mb: 2,
                    fontWeight: 900,
                    fontSize: { xs: 2.8 * 16, md: 4 * 16 },
                    letterSpacing: '-0.03em',
                    textTransform: 'uppercase',
                    background: 'linear-gradient(45deg, #FFFFFF 30%, #00FFFF 70%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.5))',
                  }}
                >
                  Festivals & Cultural Events
                </Typography>
                
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#CCCCCC',
                    fontWeight: 300,
                    lineHeight: 1.6,
                    maxWidth: '600px',
                    mx: 'auto',
                    fontSize: { xs: 1.1 * 16, md: 1.2 * 16 },
                  }}
                >
                  Experience Toronto's vibrant cultural scene through year-round festivals, concerts, and special celebrations
                </Typography>
              </Box>
            </Container>
          </Box>
        </Paper>

        {/* Variation 3B: Purple/Magenta Neon */}
        <Paper elevation={3} sx={{ mb: 4, overflow: 'hidden' }}>
          <Typography variant="h6" sx={{ p: 2, bgcolor: 'success.main', color: 'white', fontWeight: 600 }}>
            3B: Magenta Neon
          </Typography>
          <Box sx={{ 
            bgcolor: '#0D1117',
            py: { xs: 6, md: 8 },
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 70% 30%, rgba(255, 0, 255, 0.15) 0%, transparent 60%)',
              zIndex: 1,
            }
          }}>
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
              <Box sx={{ 
                textAlign: 'center',
                maxWidth: '800px',
                mx: 'auto',
              }}>
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 4,
                  gap: 2,
                }}>
                  <Box sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: 'rgba(255, 0, 255, 0.1)',
                    border: '2px solid #FF00FF',
                    transition: 'all 0.4s ease',
                    transform: 'skewX(-5deg)',
                    '&:hover': {
                      transform: 'skewX(5deg) scale(1.1)',
                      boxShadow: '0 0 30px #FF00FF, 0 0 60px rgba(255, 0, 255, 0.3)',
                    }
                  }}>
                    <CelebrationIcon sx={{ 
                      fontSize: 45,
                      color: '#FF00FF',
                    }} />
                  </Box>
                </Box>
                
                <Typography 
                  variant="h2"
                  component="h1"
                  sx={{ 
                    mb: 2,
                    fontWeight: 800,
                    fontSize: { xs: 2.8 * 16, md: 4 * 16 },
                    letterSpacing: '-0.02em',
                    background: 'linear-gradient(135deg, #FFFFFF 0%, #FF00FF 50%, #8A2BE2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 15px rgba(255, 0, 255, 0.6))',
                    animation: 'glow 3s ease-in-out infinite alternate',
                    '@keyframes glow': {
                      '0%': { filter: 'drop-shadow(0 0 15px rgba(255, 0, 255, 0.6))' },
                      '100%': { filter: 'drop-shadow(0 0 25px rgba(255, 0, 255, 0.8))' },
                    },
                  }}
                >
                  Festivals & Cultural Events
                </Typography>
                
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#E0E0E0',
                    fontWeight: 300,
                    lineHeight: 1.6,
                    maxWidth: '600px',
                    mx: 'auto',
                    fontSize: { xs: 1.1 * 16, md: 1.2 * 16 },
                  }}
                >
                  Experience Toronto's vibrant cultural scene through year-round festivals, concerts, and special celebrations
                </Typography>
              </Box>
            </Container>
          </Box>
        </Paper>

        {/* Variation 3C: Green/Lime Neon */}
        <Paper elevation={3} sx={{ mb: 6, overflow: 'hidden' }}>
          <Typography variant="h6" sx={{ p: 2, bgcolor: 'success.main', color: 'white', fontWeight: 600 }}>
            3C: Lime Neon
          </Typography>
          <Box sx={{ 
            bgcolor: '#0A0A0A',
            py: { xs: 6, md: 8 },
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(ellipse at 50% 30%, rgba(50, 205, 50, 0.2) 0%, transparent 70%)',
              zIndex: 1,
            }
          }}>
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
              <Box sx={{ 
                textAlign: 'center',
                maxWidth: '800px',
                mx: 'auto',
              }}>
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 4,
                  gap: 2,
                }}>
                  <Box sx={{
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: -5,
                      left: -5,
                      right: -5,
                      bottom: -5,
                      border: '1px solid #32CD32',
                      transform: 'rotate(45deg)',
                      borderRadius: 1,
                    }
                  }}>
                    <Box sx={{
                      p: 2.5,
                      bgcolor: 'rgba(50, 205, 50, 0.1)',
                      border: '2px solid #32CD32',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 0 25px #32CD32, inset 0 0 25px rgba(50, 205, 50, 0.1)',
                        transform: 'scale(1.05)',
                      }
                    }}>
                      <CelebrationIcon sx={{ 
                        fontSize: 42,
                        color: '#32CD32',
                      }} />
                    </Box>
                  </Box>
                </Box>
                
                <Typography 
                  variant="h2"
                  component="h1"
                  sx={{ 
                    mb: 2,
                    fontWeight: 700,
                    fontSize: { xs: 2.8 * 16, md: 4 * 16 },
                    letterSpacing: '-0.025em',
                    background: 'linear-gradient(90deg, #FFFFFF 0%, #32CD32 30%, #00FF00 70%, #ADFF2F 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 12px rgba(50, 205, 50, 0.7))',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -10,
                      left: '10%',
                      transform: 'translateX(-50%)',
                      width: '80%',
                      height: '2px',
                      background: 'linear-gradient(90deg, transparent, #32CD32, transparent)',
                      boxShadow: '0 0 10px #32CD32',
                    },
                  }}
                >
                  Festivals & Cultural Events
                </Typography>
                
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#D0D0D0',
                    fontWeight: 300,
                    lineHeight: 1.6,
                    maxWidth: '600px',
                    mx: 'auto',
                    fontSize: { xs: 1.1 * 16, md: 1.2 * 16 },
                  }}
                >
                  Experience Toronto's vibrant cultural scene through year-round festivals, concerts, and special celebrations
                </Typography>
              </Box>
            </Container>
          </Box>
        </Paper>

        {/* OPTION 5 VARIATIONS - Playful Geometric */}
        <Typography variant="h4" sx={{ textAlign: 'center', mb: 4, fontWeight: 600, color: 'warning.main' }}>
          Option 5: Playful Geometric Variations
        </Typography>

        {/* Variation 5A: Original Geometric */}
        <Paper elevation={3} sx={{ mb: 4, overflow: 'hidden' }}>
          <Typography variant="h6" sx={{ p: 2, bgcolor: 'warning.main', color: 'white', fontWeight: 600 }}>
            5A: Classic Geometric
          </Typography>
          <Box sx={{ 
            bgcolor: '#FEFEFE',
            py: { xs: 6, md: 8 },
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              bgcolor: 'rgba(255, 193, 7, 0.1)',
              zIndex: 1,
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -30,
              left: -30,
              width: 150,
              height: 150,
              transform: 'rotate(45deg)',
              bgcolor: 'rgba(233, 30, 99, 0.1)',
              zIndex: 1,
            }
          }}>
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
              <Box sx={{ 
                textAlign: 'center',
                maxWidth: '800px',
                mx: 'auto',
              }}>
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 4,
                  gap: 2,
                }}>
                  <Box sx={{
                    position: 'relative',
                    '&:hover .geometric-icon': {
                      transform: 'rotate(180deg) scale(1.1)',
                    }
                  }}>
                    <Box sx={{
                      width: 0,
                      height: 0,
                      borderLeft: '25px solid transparent',
                      borderRight: '25px solid transparent',
                      borderBottom: '43px solid #FF6B35',
                      position: 'absolute',
                      top: -10,
                      left: -10,
                      opacity: 0.3,
                    }} />
                    <CelebrationIcon className="geometric-icon" sx={{ 
                      fontSize: 50,
                      color: '#E91E63',
                      transition: 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                      position: 'relative',
                      zIndex: 2,
                    }} />
                    <StarIcon sx={{ 
                      fontSize: 20,
                      color: '#FFC107',
                      position: 'absolute',
                      top: -5,
                      right: -5,
                      animation: 'twinkle 1.5s infinite',
                      '@keyframes twinkle': {
                        '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                        '50%': { opacity: 0.5, transform: 'scale(0.8)' },
                      },
                    }} />
                  </Box>
                </Box>
                
                <Typography 
                  variant="h2"
                  component="h1"
                  sx={{ 
                    mb: 3,
                    fontWeight: 800,
                    color: '#2C2C2C',
                    fontSize: { xs: 2.5 * 16, md: 3.2 * 16 },
                    letterSpacing: '-0.02em',
                    background: 'linear-gradient(45deg, #E91E63 30%, #FF6B35 70%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    transform: 'perspective(500px) rotateX(15deg)',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  Festivals & Cultural Events
                </Typography>
                
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#555555',
                    fontWeight: 400,
                    lineHeight: 1.6,
                    maxWidth: '600px',
                    mx: 'auto',
                    fontSize: { xs: 1.1 * 16, md: 1.2 * 16 },
                  }}
                >
                  Experience Toronto's vibrant cultural scene through year-round festivals, concerts, and special celebrations
                </Typography>
              </Box>
            </Container>
          </Box>
        </Paper>

        {/* Variation 5B: Abstract Shapes */}
        <Paper elevation={3} sx={{ mb: 4, overflow: 'hidden' }}>
          <Typography variant="h6" sx={{ p: 2, bgcolor: 'warning.main', color: 'white', fontWeight: 600 }}>
            5B: Abstract Shapes
          </Typography>
          <Box sx={{ 
            bgcolor: '#FDFDFD',
            py: { xs: 6, md: 8 },
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 20,
              left: 100,
              width: 120,
              height: 120,
              borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
              bgcolor: 'rgba(139, 69, 19, 0.1)',
              animation: 'float 6s ease-in-out infinite',
              '@keyframes float': {
                '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                '50%': { transform: 'translateY(-20px) rotate(180deg)' },
              },
              zIndex: 1,
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 50,
              right: 80,
              width: 80,
              height: 80,
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              bgcolor: 'rgba(75, 0, 130, 0.15)',
              animation: 'bounce 4s ease-in-out infinite',
              '@keyframes bounce': {
                '0%, 100%': { transform: 'translateY(0px)' },
                '50%': { transform: 'translateY(-15px)' },
              },
              zIndex: 1,
            }
          }}>
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
              <Box sx={{ 
                textAlign: 'center',
                maxWidth: '800px',
                mx: 'auto',
              }}>
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 4,
                  gap: 2,
                }}>
                  <Box sx={{
                    position: 'relative',
                    '&:hover': {
                      '& .shape1': { transform: 'rotate(120deg) scale(1.2)' },
                      '& .shape2': { transform: 'rotate(-120deg) scale(1.1)' },
                      '& .main-icon': { transform: 'scale(1.15)' },
                    }
                  }}>
                    <Box className="shape1" sx={{
                      position: 'absolute',
                      top: -15,
                      left: -15,
                      width: 30,
                      height: 30,
                      bgcolor: '#FF4081',
                      clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                      opacity: 0.6,
                      transition: 'all 0.4s ease',
                    }} />
                    <Box className="shape2" sx={{
                      position: 'absolute',
                      bottom: -20,
                      right: -20,
                      width: 25,
                      height: 25,
                      bgcolor: '#4CAF50',
                      borderRadius: '50%',
                      opacity: 0.7,
                      transition: 'all 0.4s ease',
                    }} />
                    <CelebrationIcon className="main-icon" sx={{ 
                      fontSize: 55,
                      color: '#8E24AA',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      zIndex: 3,
                    }} />
                  </Box>
                </Box>
                
                <Typography 
                  variant="h2"
                  component="h1"
                  sx={{ 
                    mb: 3,
                    fontWeight: 700,
                    fontSize: { xs: 2.5 * 16, md: 3.2 * 16 },
                    letterSpacing: '-0.02em',
                    background: 'linear-gradient(45deg, #FF5722 0%, #9C27B0 50%, #FFC107 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    position: 'relative',
                    filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      bottom: -15,
                      left: '10%',
                      right: '10%',
                      height: '3px',
                      background: 'linear-gradient(90deg, #FF5722, #9C27B0, #FFC107)',
                      borderRadius: '3px',
                      opacity: 0.6,
                    },
                  }}
                >
                  Festivals & Cultural Events
                </Typography>
                
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#37474F',
                    fontWeight: 400,
                    lineHeight: 1.6,
                    maxWidth: '600px',
                    mx: 'auto',
                    fontSize: { xs: 1.1 * 16, md: 1.2 * 16 },
                  }}
                >
                  Experience Toronto's vibrant cultural scene through year-round festivals, concerts, and special celebrations
                </Typography>
              </Box>
            </Container>
          </Box>
        </Paper>

        {/* Variation 5C: Artistic Geometric */}
        <Paper elevation={3} sx={{ mb: 6, overflow: 'hidden' }}>
          <Typography variant="h6" sx={{ p: 2, bgcolor: 'warning.main', color: 'white', fontWeight: 600 }}>
            5C: Artistic Geometric
          </Typography>
          <Box sx={{ 
            bgcolor: '#FFFEF7',
            py: { xs: 6, md: 8 },
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
                radial-gradient(circle at 20% 80%, rgba(255, 87, 34, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(156, 39, 176, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(255, 193, 7, 0.1) 0%, transparent 50%)
              `,
              zIndex: 1,
            }
          }}>
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
              <Box sx={{ 
                textAlign: 'center',
                maxWidth: '800px',
                mx: 'auto',
              }}>
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 4,
                  gap: 3,
                }}>
                  <Box sx={{
                    position: 'relative',
                    '&:hover .art-element': {
                      transform: 'scale(1.2) rotate(45deg)',
                    }
                  }}>
                    <AutoAwesomeIcon className="art-element" sx={{ 
                      fontSize: 30,
                      color: '#FF5722',
                      position: 'absolute',
                      top: -25,
                      left: -25,
                      transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    }} />
                    <DiamondIcon className="art-element" sx={{ 
                      fontSize: 25,
                      color: '#9C27B0',
                      position: 'absolute',
                      top: -20,
                      right: -30,
                      transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      transitionDelay: '0.1s',
                    }} />
                    <FlareIcon className="art-element" sx={{ 
                      fontSize: 20,
                      color: '#FFC107',
                      position: 'absolute',
                      bottom: -25,
                      left: -20,
                      transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      transitionDelay: '0.2s',
                    }} />
                    <CelebrationIcon sx={{ 
                      fontSize: 60,
                      background: 'linear-gradient(135deg, #FF5722, #9C27B0, #FFC107)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      zIndex: 2,
                      '&:hover': {
                        transform: 'scale(1.1) rotate(-5deg)',
                      }
                    }} />
                  </Box>
                </Box>
                
                <Typography 
                  variant="h2"
                  component="h1"
                  sx={{ 
                    mb: 3,
                    fontWeight: 600,
                    fontSize: { xs: 2.5 * 16, md: 3.2 * 16 },
                    letterSpacing: '-0.015em',
                    background: 'linear-gradient(45deg, #FF5722 0%, #9C27B0 50%, #FFC107 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    position: 'relative',
                    filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      bottom: -15,
                      left: '10%',
                      right: '10%',
                      height: '3px',
                      background: 'linear-gradient(90deg, #FF5722, #9C27B0, #FFC107)',
                      borderRadius: '3px',
                      opacity: 0.6,
                    },
                  }}
                >
                  Festivals & Cultural Events
                </Typography>
                
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#37474F',
                    fontWeight: 400,
                    lineHeight: 1.6,
                    maxWidth: '600px',
                    mx: 'auto',
                    fontSize: { xs: 1.1 * 16, md: 1.2 * 16 },
                  }}
                >
                  Experience Toronto's vibrant cultural scene through year-round festivals, concerts, and special celebrations
                </Typography>
              </Box>
            </Container>
          </Box>
        </Paper>

        {/* ADDITIONAL COMPACT NEON VARIATIONS WITH MOVEMENT */}
        <Typography variant="h4" sx={{ textAlign: 'center', mb: 4, mt: 8, fontWeight: 600, color: 'error.main' }}>
          Bonus: Compact Neon with Dynamic Movement
        </Typography>

        {/* Compact Variation 1: Cyan Pulse with Floating Elements */}
        <Paper elevation={3} sx={{ mb: 4, overflow: 'hidden' }}>
          <Typography variant="h6" sx={{ p: 2, bgcolor: 'error.main', color: 'white', fontWeight: 600 }}>
            C1: Cyan Pulse Compact
          </Typography>
          <Box sx={{ 
            bgcolor: '#0F0F0F',
            py: { xs: 4, md: 5 },
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 20,
              right: 50,
              width: 60,
              height: 60,
              borderRadius: '50%',
              bgcolor: 'rgba(0, 255, 255, 0.1)',
              animation: 'float 4s ease-in-out infinite',
              '@keyframes float': {
                '0%, 100%': { transform: 'translateY(0px) scale(1)' },
                '50%': { transform: 'translateY(-15px) scale(1.1)' },
              },
              zIndex: 1,
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 30,
              left: 80,
              width: 40,
              height: 40,
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              bgcolor: 'rgba(0, 255, 255, 0.15)',
              animation: 'spin 6s linear infinite',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              },
              zIndex: 1,
            }
          }}>
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
              <Box sx={{ 
                textAlign: 'center',
                maxWidth: '600px',
                mx: 'auto',
              }}>
                <Box sx={{ 
                  display: 'inline-block',
                  mb: 2,
                  position: 'relative',
                  '&:hover .pulse-ring': {
                    animation: 'pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
                  },
                  '@keyframes pulse-ring': {
                    '0%': { transform: 'scale(0.33)', opacity: 1 },
                    '80%, 100%': { transform: 'scale(2.4)', opacity: 0 },
                  }
                }}>
                  <Box className="pulse-ring" sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 80,
                    height: 80,
                    border: '3px solid #00FFFF',
                    borderRadius: '50%',
                    opacity: 0,
                  }} />
                  <CelebrationIcon sx={{ 
                    fontSize: 35,
                    color: '#00FFFF',
                    filter: 'drop-shadow(0 0 8px rgba(0, 255, 255, 0.6))',
                  }} />
                </Box>
                
                <Typography 
                  variant="h3"
                  component="h1"
                  sx={{ 
                    mb: 1,
                    fontWeight: 700,
                    fontSize: { xs: 2 * 16, md: 2.5 * 16 },
                    letterSpacing: '-0.02em',
                    background: 'linear-gradient(90deg, #FFFFFF 0%, #00FFFF 50%, #FFFFFF 100%)',
                    backgroundSize: '200% 100%',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: 'shimmer 3s ease-in-out infinite',
                    '@keyframes shimmer': {
                      '0%': { backgroundPosition: '-200% 0' },
                      '100%': { backgroundPosition: '200% 0' },
                    },
                  }}
                >
                  Festivals & Cultural Events
                </Typography>
                
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#B0B0B0',
                    fontWeight: 300,
                    lineHeight: 1.5,
                    fontSize: 16,
                  }}
                >
                  Experience Toronto's vibrant cultural scene
                </Typography>
              </Box>
            </Container>
          </Box>
        </Paper>

        {/* Compact Variation 2: Magenta Storm with Electric Elements */}
        <Paper elevation={3} sx={{ mb: 4, overflow: 'hidden' }}>
          <Typography variant="h6" sx={{ p: 2, bgcolor: 'error.main', color: 'white', fontWeight: 600 }}>
            C2: Magenta Storm Compact
          </Typography>
          <Box sx={{ 
            bgcolor: '#0A0A0A',
            py: { xs: 4, md: 5 },
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 10,
              left: 30,
              width: 80,
              height: 80,
              borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
              bgcolor: 'rgba(255, 0, 255, 0.1)',
              animation: 'morph 5s ease-in-out infinite',
              '@keyframes morph': {
                '0%, 100%': { borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' },
                '25%': { borderRadius: '58% 42% 75% 25% / 76% 46% 54% 24%' },
                '50%': { borderRadius: '50% 50% 33% 67% / 55% 27% 73% 45%' },
                '75%': { borderRadius: '33% 67% 58% 42% / 63% 68% 32% 37%' },
              },
              zIndex: 1,
            }
          }}>
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
              <Box sx={{ 
                textAlign: 'center',
                maxWidth: '600px',
                mx: 'auto',
              }}>
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  gap: 1,
                }}>
                  <ElectricBoltIcon sx={{ 
                    fontSize: 20,
                    color: '#FF00FF',
                    animation: 'electric 2s ease-in-out infinite',
                    '@keyframes electric': {
                      '0%, 100%': { opacity: 0.6, transform: 'translateX(0)' },
                      '50%': { opacity: 1, transform: 'translateX(3px)' },
                    },
                  }} />
                  <Box sx={{
                    p: 1.5,
                    border: '2px solid #FF00FF',
                    borderRadius: 1,
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: -2,
                      left: -2,
                      right: -2,
                      bottom: -2,
                      border: '1px solid #FF00FF',
                      borderRadius: 1,
                      opacity: 0.3,
                    }
                  }}>
                    <CelebrationIcon sx={{ 
                      fontSize: 30,
                      color: '#FF00FF',
                      filter: 'drop-shadow(0 0 10px rgba(255, 0, 255, 0.7))',
                    }} />
                  </Box>
                  <ElectricBoltIcon sx={{ 
                    fontSize: 20,
                    color: '#FF00FF',
                    animation: 'electric 2s ease-in-out infinite reverse',
                  }} />
                </Box>
                
                <Typography 
                  variant="h3"
                  component="h1"
                  sx={{ 
                    mb: 1,
                    fontWeight: 800,
                    fontSize: { xs: 2 * 16, md: 2.5 * 16 },
                    letterSpacing: '-0.015em',
                    color: '#FF00FF',
                    textShadow: '0 0 20px rgba(255, 0, 255, 0.8), 0 0 40px rgba(255, 0, 255, 0.4)',
                    animation: 'glow-pulse 2.5s ease-in-out infinite alternate',
                    '@keyframes glow-pulse': {
                      '0%': { filter: 'brightness(1)' },
                      '100%': { filter: 'brightness(1.3)' },
                    },
                  }}
                >
                  Festivals & Cultural Events
                </Typography>
                
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#CC99FF',
                    fontWeight: 300,
                    lineHeight: 1.5,
                    fontSize: 16,
                  }}
                >
                  Experience Toronto's vibrant cultural scene
                </Typography>
              </Box>
            </Container>
          </Box>
        </Paper>

        {/* Compact Variation 3: Lime Matrix with Flowing Particles */}
        <Paper elevation={3} sx={{ mb: 4, overflow: 'hidden' }}>
          <Typography variant="h6" sx={{ p: 2, bgcolor: 'error.main', color: 'white', fontWeight: 600 }}>
            C3: Lime Matrix Compact
          </Typography>
          <Box sx={{ 
            bgcolor: '#050505',
            py: { xs: 4, md: 5 },
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
                linear-gradient(90deg, transparent 98%, rgba(50, 205, 50, 0.3) 100%),
                linear-gradient(0deg, transparent 98%, rgba(50, 205, 50, 0.2) 100%)
              `,
              backgroundSize: '20px 20px',
              animation: 'matrix 10s linear infinite',
              '@keyframes matrix': {
                '0%': { transform: 'translateY(-20px)' },
                '100%': { transform: 'translateY(0px)' },
              },
              zIndex: 1,
            }
          }}>
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
              <Box sx={{ 
                textAlign: 'center',
                maxWidth: '600px',
                mx: 'auto',
              }}>
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  gap: 2,
                }}>
                  <BlurOnIcon sx={{ 
                    fontSize: 15,
                    color: '#32CD32',
                    animation: 'particle1 3s ease-in-out infinite',
                    '@keyframes particle1': {
                      '0%, 100%': { opacity: 0.3, transform: 'translateY(0px)' },
                      '50%': { opacity: 1, transform: 'translateY(-8px)' },
                    },
                  }} />
                  <Box sx={{
                    position: 'relative',
                    display: 'inline-block',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: -3,
                      left: -3,
                      right: -3,
                      bottom: -3,
                      border: '1px solid #32CD32',
                      animation: 'scan 2s ease-in-out infinite',
                      '@keyframes scan': {
                        '0%': { borderColor: 'transparent' },
                        '50%': { borderColor: '#32CD32' },
                        '100%': { borderColor: 'transparent' },
                      },
                    }
                  }}>
                    <CelebrationIcon sx={{ 
                      fontSize: 32,
                      color: '#32CD32',
                      filter: 'drop-shadow(0 0 8px rgba(50, 205, 50, 0.8))',
                    }} />
                  </Box>
                  <BlurOnIcon sx={{ 
                    fontSize: 15,
                    color: '#32CD32',
                    animation: 'particle2 3s ease-in-out infinite',
                    '@keyframes particle2': {
                      '0%, 100%': { opacity: 0.3, transform: 'translateY(0px)' },
                      '33%': { opacity: 1, transform: 'translateY(-8px)' },
                    },
                  }} />
                </Box>
                
                <Typography 
                  variant="h3"
                  component="h1"
                  sx={{ 
                    mb: 1,
                    fontWeight: 600,
                    fontSize: { xs: 2 * 16, md: 2.5 * 16 },
                    letterSpacing: '-0.01em',
                    color: '#32CD32',
                    textShadow: '0 0 15px rgba(50, 205, 50, 0.8)',
                    fontFamily: 'monospace',
                    animation: 'flicker 4s ease-in-out infinite',
                    '@keyframes flicker': {
                      '0%, 100%': { opacity: 1 },
                      '2%': { opacity: 0.8 },
                      '4%': { opacity: 1 },
                      '8%': { opacity: 0.9 },
                      '10%': { opacity: 1 },
                    },
                  }}
                >
                  Festivals & Cultural Events
                </Typography>
                
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#90EE90',
                    fontWeight: 300,
                    lineHeight: 1.5,
                    fontSize: 16,
                    fontFamily: 'monospace',
                  }}
                >
                  Experience Toronto's vibrant cultural scene
                </Typography>
              </Box>
            </Container>
          </Box>
        </Paper>

        {/* Compact Variation 4: Holographic Blue with Orbiting Elements */}
        <Paper elevation={3} sx={{ mb: 4, overflow: 'hidden' }}>
          <Typography variant="h6" sx={{ p: 2, bgcolor: 'error.main', color: 'white', fontWeight: 600 }}>
            C4: Holographic Blue Compact
          </Typography>
          <Box sx={{ 
            bgcolor: '#0A0F1C',
            py: { xs: 4, md: 5 },
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 150,
              height: 150,
              border: '1px solid rgba(0, 150, 255, 0.3)',
              borderRadius: '50%',
              animation: 'orbit-ring 8s linear infinite',
              '@keyframes orbit-ring': {
                '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
                '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' },
              },
              zIndex: 1,
            }
          }}>
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
              <Box sx={{ 
                textAlign: 'center',
                maxWidth: '600px',
                mx: 'auto',
              }}>
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  position: 'relative',
                }}>
                  <StarIcon sx={{ 
                    fontSize: 12,
                    color: '#0096FF',
                    position: 'absolute',
                    animation: 'orbit1 6s linear infinite',
                    transformOrigin: '0 20px',
                    '@keyframes orbit1': {
                      '0%': { transform: 'rotate(0deg) translateX(25px) rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg) translateX(25px) rotate(-360deg)' },
                    },
                  }} />
                  <StarIcon sx={{ 
                    fontSize: 8,
                    color: '#00BFFF',
                    position: 'absolute',
                    animation: 'orbit2 4s linear infinite reverse',
                    transformOrigin: '0 15px',
                    '@keyframes orbit2': {
                      '0%': { transform: 'rotate(0deg) translateX(18px) rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg) translateX(18px) rotate(-360deg)' },
                    },
                  }} />
                  <CelebrationIcon sx={{ 
                    fontSize: 34,
                    background: 'linear-gradient(45deg, #0096FF, #00BFFF, #87CEEB)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 10px rgba(0, 150, 255, 0.6))',
                    position: 'relative',
                    zIndex: 2,
                  }} />
                </Box>
                
                <Typography 
                  variant="h3"
                  component="h1"
                  sx={{ 
                    mb: 1,
                    fontWeight: 500,
                    fontSize: { xs: 2 * 16, md: 2.5 * 16 },
                    letterSpacing: '0.01em',
                    background: 'linear-gradient(135deg, #0096FF 0%, #00BFFF 50%, #87CEEB 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 8px rgba(0, 150, 255, 0.5))',
                    animation: 'hologram 3s ease-in-out infinite',
                    '@keyframes hologram': {
                      '0%, 100%': { transform: 'translateY(0px)' },
                      '50%': { transform: 'translateY(-2px)' },
                    },
                  }}
                >
                  Festivals & Cultural Events
                </Typography>
                
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#B3D9FF',
                    fontWeight: 300,
                    lineHeight: 1.5,
                    fontSize: 16,
                  }}
                >
                  Experience Toronto's vibrant cultural scene
                </Typography>
              </Box>
            </Container>
          </Box>
        </Paper>

        {/* Compact Variation 5: Golden Plasma with Energy Waves */}
        <Paper elevation={3} sx={{ mb: 6, overflow: 'hidden' }}>
          <Typography variant="h6" sx={{ p: 2, bgcolor: 'error.main', color: 'white', fontWeight: 600 }}>
            C5: Golden Plasma Compact
          </Typography>
          <Box sx={{ 
            bgcolor: '#1A1A00',
            py: { xs: 4, md: 5 },
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(ellipse at 30% 70%, rgba(255, 215, 0, 0.1) 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, rgba(255, 165, 0, 0.1) 0%, transparent 50%)',
              animation: 'plasma 6s ease-in-out infinite',
              '@keyframes plasma': {
                '0%, 100%': { opacity: 0.8 },
                '50%': { opacity: 1.2 },
              },
              zIndex: 1,
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #FFD700, transparent)',
              animation: 'energy-wave 4s ease-in-out infinite',
              '@keyframes energy-wave': {
                '0%': { transform: 'translateY(-50%) scaleX(0)' },
                '50%': { transform: 'translateY(-50%) scaleX(1)' },
                '100%': { transform: 'translateY(-50%) scaleX(0)' },
              },
              zIndex: 1,
            }
          }}>
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
              <Box sx={{ 
                textAlign: 'center',
                maxWidth: '600px',
                mx: 'auto',
              }}>
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  gap: 2,
                }}>
                  <FlareIcon sx={{ 
                    fontSize: 16,
                    color: '#FFD700',
                    animation: 'flare1 2.5s ease-in-out infinite',
                    '@keyframes flare1': {
                      '0%, 100%': { opacity: 0.5, transform: 'scale(1)' },
                      '50%': { opacity: 1, transform: 'scale(1.3)' },
                    },
                  }} />
                  <Box sx={{
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: -8,
                      left: -8,
                      right: -8,
                      bottom: -8,
                      border: '2px solid #FFD700',
                      borderRadius: '50%',
                      animation: 'energy-ring 3s ease-in-out infinite',
                      '@keyframes energy-ring': {
                        '0%': { transform: 'scale(0.8)', opacity: 1 },
                        '100%': { transform: 'scale(1.5)', opacity: 0 },
                      },
                    }
                  }}>
                    <CelebrationIcon sx={{ 
                      fontSize: 36,
                      background: 'linear-gradient(45deg, #FFD700, #FFA500, #FF8C00)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      filter: 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.8))',
                    }} />
                  </Box>
                  <FlareIcon sx={{ 
                    fontSize: 16,
                    color: '#FFA500',
                    animation: 'flare2 2.5s ease-in-out infinite',
                    '@keyframes flare2': {
                      '0%, 100%': { opacity: 0.5, transform: 'scale(1) rotate(0deg)' },
                      '50%': { opacity: 1, transform: 'scale(1.3) rotate(180deg)' },
                    },
                  }} />
                </Box>
                
                <Typography 
                  variant="h3"
                  component="h1"
                  sx={{ 
                    mb: 1,
                    fontWeight: 700,
                    fontSize: { xs: 2 * 16, md: 2.5 * 16 },
                    letterSpacing: '-0.01em',
                    background: 'linear-gradient(45deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.7))',
                    animation: 'golden-glow 3.5s ease-in-out infinite',
                    '@keyframes golden-glow': {
                      '0%, 100%': { filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.7))' },
                      '50%': { filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 1))' },
                    },
                  }}
                >
                  Festivals & Cultural Events
                </Typography>
                
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#FFEB99',
                    fontWeight: 300,
                    lineHeight: 1.5,
                    fontSize: 16,
                  }}
                >
                  Experience Toronto's vibrant cultural scene
                </Typography>
              </Box>
            </Container>
          </Box>
        </Paper>

        {/* ULTRA-COMPACT COLOR VARIATIONS */}
        <Typography variant="h4" sx={{ textAlign: 'center', mb: 4, mt: 6, fontWeight: 600, color: 'info.main' }}>
          Ultra-Compact Color Variations
        </Typography>

        {/* Ultra-Compact C4 Variations - Holographic Style */}
        <Typography variant="h6" sx={{ textAlign: 'center', mb: 3, fontWeight: 500, color: 'text.secondary' }}>
          C4 Holographic Variants
        </Typography>

        {/* C4-Purple: Violet Holographic */}
        <Paper elevation={3} sx={{ mb: 3, overflow: 'hidden' }}>
          <Typography variant="subtitle1" sx={{ p: 1.5, bgcolor: 'info.main', color: 'white', fontWeight: 600, fontSize: 14 }}>
            C4-P: Violet Holographic Ultra-Compact
          </Typography>
          <Box sx={{ 
            bgcolor: '#1A0F1C',
            py: { xs: 2.5, md: 3 },
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 120,
              height: 120,
              border: '1px solid rgba(138, 43, 226, 0.4)',
              borderRadius: '50%',
              animation: 'orbit-ring 6s linear infinite',
              '@keyframes orbit-ring': {
                '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
                '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' },
              },
              zIndex: 1,
            }
          }}>
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
              <Box sx={{ 
                textAlign: 'center',
                maxWidth: '500px',
                mx: 'auto',
              }}>
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1.5,
                  position: 'relative',
                }}>
                  <StarIcon sx={{ 
                    fontSize: 10,
                    color: '#8A2BE2',
                    position: 'absolute',
                    animation: 'orbit1 5s linear infinite',
                    transformOrigin: '0 18px',
                    '@keyframes orbit1': {
                      '0%': { transform: 'rotate(0deg) translateX(20px) rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg) translateX(20px) rotate(-360deg)' },
                    },
                  }} />
                  <StarIcon sx={{ 
                    fontSize: 7,
                    color: '#DA70D6',
                    position: 'absolute',
                    animation: 'orbit2 3s linear infinite reverse',
                    transformOrigin: '0 12px',
                    '@keyframes orbit2': {
                      '0%': { transform: 'rotate(0deg) translateX(14px) rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg) translateX(14px) rotate(-360deg)' },
                    },
                  }} />
                  <CelebrationIcon sx={{ 
                    fontSize: 28,
                    background: 'linear-gradient(45deg, #8A2BE2, #DA70D6, #DDA0DD)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 8px rgba(138, 43, 226, 0.6))',
                    position: 'relative',
                    zIndex: 2,
                  }} />
                </Box>
                
                <Typography 
                  variant="h4"
                  component="h1"
                  sx={{ 
                    mb: 0.5,
                    fontWeight: 500,
                    fontSize: { xs: 1.6 * 16, md: 2 * 16 },
                    letterSpacing: '0.01em',
                    background: 'linear-gradient(135deg, #8A2BE2 0%, #DA70D6 50%, #DDA0DD 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 8px rgba(138, 43, 226, 0.5))',
                    animation: 'hologram 3s ease-in-out infinite',
                    '@keyframes hologram': {
                      '0%, 100%': { transform: 'translateY(0px)' },
                      '50%': { transform: 'translateY(-2px)' },
                    },
                  }}
                >
                  Festivals & Cultural Events
                </Typography>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#E6D3FF',
                    fontWeight: 300,
                    lineHeight: 1.4,
                    fontSize: 14,
                  }}
                >
                  Experience Toronto's vibrant cultural scene
                </Typography>
              </Box>
            </Container>
          </Box>
        </Paper>

        {/* C4-Green: Emerald Holographic */}
        <Paper elevation={3} sx={{ mb: 3, overflow: 'hidden' }}>
          <Typography variant="subtitle1" sx={{ p: 1.5, bgcolor: 'info.main', color: 'white', fontWeight: 600, fontSize: 14 }}>
            C4-G: Emerald Holographic Ultra-Compact
          </Typography>
          <Box sx={{ 
            bgcolor: '#0F1A0F',
            py: { xs: 2.5, md: 3 },
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 120,
              height: 120,
              border: '1px solid rgba(46, 204, 113, 0.4)',
              borderRadius: '50%',
              animation: 'orbit-ring 6s linear infinite',
              zIndex: 1,
            }
          }}>
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
              <Box sx={{ 
                textAlign: 'center',
                maxWidth: '500px',
                mx: 'auto',
              }}>
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1.5,
                  position: 'relative',
                }}>
                  <StarIcon sx={{ 
                    fontSize: 10,
                    color: '#2ECC71',
                    position: 'absolute',
                    animation: 'orbit1 5s linear infinite',
                    transformOrigin: '0 18px',
                  }} />
                  <StarIcon sx={{ 
                    fontSize: 7,
                    color: '#58D68D',
                    position: 'absolute',
                    animation: 'orbit2 3s linear infinite reverse',
                    transformOrigin: '0 12px',
                  }} />
                  <CelebrationIcon sx={{ 
                    fontSize: 28,
                    background: 'linear-gradient(45deg, #2ECC71, #58D68D, #85E085)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 8px rgba(46, 204, 113, 0.6))',
                    position: 'relative',
                    zIndex: 2,
                  }} />
                </Box>
                
                <Typography 
                  variant="h4"
                  component="h1"
                  sx={{ 
                    mb: 0.5,
                    fontWeight: 500,
                    fontSize: { xs: 1.6 * 16, md: 2 * 16 },
                    letterSpacing: '0.01em',
                    background: 'linear-gradient(135deg, #2ECC71 0%, #58D68D 50%, #85E085 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 8px rgba(46, 204, 113, 0.5))',
                    animation: 'hologram 3s ease-in-out infinite',
                  }}
                >
                  Festivals & Cultural Events
                </Typography>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#B8E6B8',
                    fontWeight: 300,
                    lineHeight: 1.4,
                    fontSize: 14,
                  }}
                >
                  Experience Toronto's vibrant cultural scene
                </Typography>
              </Box>
            </Container>
          </Box>
        </Paper>

        {/* C4-Red: Crimson Holographic */}
        <Paper elevation={3} sx={{ mb: 4, overflow: 'hidden' }}>
          <Typography variant="subtitle1" sx={{ p: 1.5, bgcolor: 'info.main', color: 'white', fontWeight: 600, fontSize: 14 }}>
            C4-R: Crimson Holographic Ultra-Compact
          </Typography>
          <Box sx={{ 
            bgcolor: '#1A0A0A',
            py: { xs: 2.5, md: 3 },
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 120,
              height: 120,
              border: '1px solid rgba(220, 53, 69, 0.4)',
              borderRadius: '50%',
              animation: 'orbit-ring 6s linear infinite',
              zIndex: 1,
            }
          }}>
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
              <Box sx={{ 
                textAlign: 'center',
                maxWidth: '500px',
                mx: 'auto',
              }}>
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1.5,
                  position: 'relative',
                }}>
                  <StarIcon sx={{ 
                    fontSize: 10,
                    color: '#DC3545',
                    position: 'absolute',
                    animation: 'orbit1 5s linear infinite',
                    transformOrigin: '0 18px',
                  }} />
                  <StarIcon sx={{ 
                    fontSize: 7,
                    color: '#F8D7DA',
                    position: 'absolute',
                    animation: 'orbit2 3s linear infinite reverse',
                    transformOrigin: '0 12px',
                  }} />
                  <CelebrationIcon sx={{ 
                    fontSize: 28,
                    background: 'linear-gradient(45deg, #DC3545, #F8D7DA, #FFB3BA)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 8px rgba(220, 53, 69, 0.6))',
                    position: 'relative',
                    zIndex: 2,
                  }} />
                </Box>
                
                <Typography 
                  variant="h4"
                  component="h1"
                  sx={{ 
                    mb: 0.5,
                    fontWeight: 500,
                    fontSize: { xs: 1.6 * 16, md: 2 * 16 },
                    letterSpacing: '0.01em',
                    background: 'linear-gradient(135deg, #DC3545 0%, #F8D7DA 50%, #FFB3BA 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 8px rgba(220, 53, 69, 0.5))',
                    animation: 'hologram 3s ease-in-out infinite',
                  }}
                >
                  Festivals & Cultural Events
                </Typography>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#FFD6D6',
                    fontWeight: 300,
                    lineHeight: 1.4,
                    fontSize: 14,
                  }}
                >
                  Experience Toronto's vibrant cultural scene
                </Typography>
              </Box>
            </Container>
          </Box>
        </Paper>

        {/* Ultra-Compact C5 Variations - Plasma Style */}
        <Typography variant="h6" sx={{ textAlign: 'center', mb: 3, fontWeight: 500, color: 'text.secondary' }}>
          C5 Plasma Variants
        </Typography>

        {/* C5-Silver: Silver Plasma */}
        <Paper elevation={3} sx={{ mb: 3, overflow: 'hidden' }}>
          <Typography variant="subtitle1" sx={{ p: 1.5, bgcolor: 'info.main', color: 'white', fontWeight: 600, fontSize: 14 }}>
            C5-S: Silver Plasma Ultra-Compact
          </Typography>
          <Box sx={{ 
            bgcolor: '#1A1A1A',
            py: { xs: 2.5, md: 3 },
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(ellipse at 30% 70%, rgba(192, 192, 192, 0.1) 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, rgba(211, 211, 211, 0.1) 0%, transparent 50%)',
              animation: 'plasma 5s ease-in-out infinite',
              '@keyframes plasma': {
                '0%, 100%': { opacity: 0.7 },
                '50%': { opacity: 1.1 },
              },
              zIndex: 1,
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #C0C0C0, transparent)',
              animation: 'energy-wave 4s ease-in-out infinite',
              '@keyframes energy-wave': {
                '0%': { transform: 'translateY(-50%) scaleX(0)' },
                '50%': { transform: 'translateY(-50%) scaleX(1)' },
                '100%': { transform: 'translateY(-50%) scaleX(0)' },
              },
              zIndex: 1,
            }
          }}>
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
              <Box sx={{ 
                textAlign: 'center',
                maxWidth: '500px',
                mx: 'auto',
              }}>
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1.5,
                  gap: 1.5,
                }}>
                  <FlareIcon sx={{ 
                    fontSize: 16,
                    color: '#C0C0C0',
                    animation: 'flare1 2.5s ease-in-out infinite',
                    '@keyframes flare1': {
                      '0%, 100%': { opacity: 0.5, transform: 'scale(1)' },
                      '50%': { opacity: 1, transform: 'scale(1.2)' },
                    },
                  }} />
                  <Box sx={{
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: -8,
                      left: -8,
                      right: -8,
                      bottom: -8,
                      border: '2px solid #C0C0C0',
                      borderRadius: '50%',
                      animation: 'energy-ring 3s ease-in-out infinite',
                      '@keyframes energy-ring': {
                        '0%': { transform: 'scale(0.8)', opacity: 1 },
                        '100%': { transform: 'scale(1.5)', opacity: 0 },
                      },
                    }
                  }}>
                    <CelebrationIcon sx={{ 
                      fontSize: 36,
                      background: 'linear-gradient(45deg, #C0C0C0, #D3D3D3, #E5E5E5)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      filter: 'drop-shadow(0 0 12px rgba(192, 192, 192, 0.8))',
                    }} />
                  </Box>
                  <FlareIcon sx={{ 
                    fontSize: 16,
                    color: '#D3D3D3',
                    animation: 'flare2 2.5s ease-in-out infinite',
                    '@keyframes flare2': {
                      '0%, 100%': { opacity: 0.5, transform: 'scale(1) rotate(0deg)' },
                      '50%': { opacity: 1, transform: 'scale(1.3) rotate(180deg)' },
                    },
                  }} />
                </Box>
                
                <Typography 
                  variant="h3"
                  component="h1"
                  sx={{ 
                    mb: 1,
                    fontWeight: 700,
                    fontSize: { xs: 2 * 16, md: 2.5 * 16 },
                    letterSpacing: '-0.01em',
                    background: 'linear-gradient(45deg, #C0C0C0 0%, #D3D3D3 50%, #E5E5E5 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 10px rgba(192, 192, 192, 0.7))',
                    animation: 'silver-glow 3.5s ease-in-out infinite',
                    '@keyframes silver-glow': {
                      '0%, 100%': { filter: 'drop-shadow(0 0 10px rgba(192, 192, 192, 0.7))' },
                      '50%': { filter: 'drop-shadow(0 0 20px rgba(192, 192, 192, 1))' },
                    },
                  }}
                >
                  Festivals & Cultural Events
                </Typography>
                
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#F0F0F0',
                    fontWeight: 300,
                    lineHeight: 1.5,
                    fontSize: 14,
                  }}
                >
                  Experience Toronto's vibrant cultural scene
                </Typography>
              </Box>
            </Container>
          </Box>
        </Paper>

        {/* C5-Purple: Purple Plasma */}
        <Paper elevation={3} sx={{ mb: 3, overflow: 'hidden' }}>
          <Typography variant="subtitle1" sx={{ p: 1.5, bgcolor: 'info.main', color: 'white', fontWeight: 600, fontSize: 14 }}>
            C5-P: Purple Plasma Ultra-Compact
          </Typography>
          <Box sx={{ 
            bgcolor: '#1A001A',
            py: { xs: 2.5, md: 3 },
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(ellipse at 30% 70%, rgba(147, 112, 219, 0.1) 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, rgba(138, 43, 226, 0.1) 0%, transparent 50%)',
              animation: 'plasma 5s ease-in-out infinite',
              zIndex: 1,
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #9370DB, transparent)',
              animation: 'energy-wave 4s ease-in-out infinite',
              zIndex: 1,
            }
          }}>
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
              <Box sx={{ 
                textAlign: 'center',
                maxWidth: '500px',
                mx: 'auto',
              }}>
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1.5,
                  gap: 1.5,
                }}>
                  <FlareIcon sx={{ 
                    fontSize: 16,
                    color: '#9370DB',
                    animation: 'flare1 2.5s ease-in-out infinite',
                  }} />
                  <Box sx={{
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: -8,
                      left: -8,
                      right: -8,
                      bottom: -8,
                      border: '2px solid #9370DB',
                      borderRadius: '50%',
                      animation: 'energy-ring 3s ease-in-out infinite',
                    }
                  }}>
                    <CelebrationIcon sx={{ 
                      fontSize: 36,
                      background: 'linear-gradient(45deg, #9370DB, #8A2BE2, #DDA0DD)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      filter: 'drop-shadow(0 0 12px rgba(147, 112, 219, 0.8))',
                    }} />
                  </Box>
                  <FlareIcon sx={{ 
                    fontSize: 16,
                    color: '#8A2BE2',
                    animation: 'flare2 2.5s ease-in-out infinite',
                  }} />
                </Box>
                
                <Typography 
                  variant="h3"
                  component="h1"
                  sx={{ 
                    mb: 1,
                    fontWeight: 700,
                    fontSize: { xs: 2 * 16, md: 2.5 * 16 },
                    letterSpacing: '-0.01em',
                    background: 'linear-gradient(45deg, #9370DB 0%, #8A2BE2 50%, #DDA0DD 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 10px rgba(147, 112, 219, 0.7))',
                    animation: 'purple-glow 3.5s ease-in-out infinite',
                    '@keyframes purple-glow': {
                      '0%, 100%': { filter: 'drop-shadow(0 0 10px rgba(147, 112, 219, 0.7))' },
                      '50%': { filter: 'drop-shadow(0 0 20px rgba(147, 112, 219, 1))' },
                    },
                  }}
                >
                  Festivals & Cultural Events
                </Typography>
                
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#E6D3FF',
                    fontWeight: 300,
                    lineHeight: 1.4,
                    fontSize: 14,
                  }}
                >
                  Experience Toronto's vibrant cultural scene
                </Typography>
              </Box>
            </Container>
          </Box>
        </Paper>

        {/* C5-Emerald: Emerald Plasma */}
        <Paper elevation={3} sx={{ mb: 6, overflow: 'hidden' }}>
          <Typography variant="subtitle1" sx={{ p: 1.5, bgcolor: 'info.main', color: 'white', fontWeight: 600, fontSize: 14 }}>
            C5-E: Emerald Plasma Ultra-Compact
          </Typography>
          <Box sx={{ 
            bgcolor: '#001A00',
            py: { xs: 2.5, md: 3 },
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(ellipse at 30% 70%, rgba(46, 204, 113, 0.1) 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, rgba(22, 160, 133, 0.1) 0%, transparent 50%)',
              animation: 'plasma 5s ease-in-out infinite',
              '@keyframes plasma': {
                '0%, 100%': { opacity: 0.7 },
                '50%': { opacity: 1.1 },
              },
              zIndex: 1,
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #2ECC71, transparent)',
              animation: 'energy-wave 4s ease-in-out infinite',
              '@keyframes energy-wave': {
                '0%': { transform: 'translateY(-50%) scaleX(0)' },
                '50%': { transform: 'translateY(-50%) scaleX(1)' },
                '100%': { transform: 'translateY(-50%) scaleX(0)' },
              },
              zIndex: 1,
            }
          }}>
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
              <Box sx={{ 
                textAlign: 'center',
                maxWidth: '500px',
                mx: 'auto',
              }}>
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1.5,
                  gap: 1.5,
                }}>
                  <FlareIcon sx={{ 
                    fontSize: 16,
                    color: '#2ECC71',
                    animation: 'flare1 2.5s ease-in-out infinite',
                  }} />
                  <Box sx={{
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: -8,
                      left: -8,
                      right: -8,
                      bottom: -8,
                      border: '2px solid #2ECC71',
                      borderRadius: '50%',
                      animation: 'energy-ring 3s ease-in-out infinite',
                    }
                  }}>
                    <CelebrationIcon sx={{ 
                      fontSize: 36,
                      background: 'linear-gradient(45deg, #2ECC71, #58D68D, #85E085)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      filter: 'drop-shadow(0 0 12px rgba(46, 204, 113, 0.8))',
                    }} />
                  </Box>
                  <FlareIcon sx={{ 
                    fontSize: 16,
                    color: '#58D68D',
                    animation: 'flare2 2.5s ease-in-out infinite',
                    '@keyframes flare2': {
                      '0%, 100%': { opacity: 0.5, transform: 'scale(1) rotate(0deg)' },
                      '50%': { opacity: 1, transform: 'scale(1.3) rotate(180deg)' },
                    },
                  }} />
                </Box>
                
                <Typography 
                  variant="h3"
                  component="h1"
                  sx={{ 
                    mb: 1,
                    fontWeight: 700,
                    fontSize: { xs: 2 * 16, md: 2.5 * 16 },
                    letterSpacing: '-0.01em',
                    background: 'linear-gradient(45deg, #2ECC71 0%, #58D68D 50%, #85E085 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 10px rgba(46, 204, 113, 0.7))',
                    animation: 'emerald-glow 3.5s ease-in-out infinite',
                    '@keyframes emerald-glow': {
                      '0%, 100%': { filter: 'drop-shadow(0 0 10px rgba(46, 204, 113, 0.7))' },
                      '50%': { filter: 'drop-shadow(0 0 20px rgba(46, 204, 113, 1))' },
                    },
                  }}
                >
                  Festivals & Cultural Events
                </Typography>
                
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#B8E6B8',
                    fontWeight: 300,
                    lineHeight: 1.4,
                    fontSize: 14,
                  }}
                >
                  Experience Toronto's vibrant cultural scene
                </Typography>
              </Box>
            </Container>
          </Box>
        </Paper>

        {/* Selection Buttons */}
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>
            Which variation do you prefer?
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 3 }}>
            <Button variant="outlined" size="large" sx={{ minWidth: 80 }}>2A</Button>
            <Button variant="outlined" size="large" sx={{ minWidth: 80 }}>2B</Button>
            <Button variant="outlined" size="large" sx={{ minWidth: 80 }}>2C</Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 3 }}>
            <Button variant="outlined" size="large" sx={{ minWidth: 80 }}>3A</Button>
            <Button variant="outlined" size="large" sx={{ minWidth: 80 }}>3B</Button>
            <Button variant="outlined" size="large" sx={{ minWidth: 80 }}>3C</Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 3 }}>
            <Button variant="outlined" size="large" sx={{ minWidth: 80 }}>5A</Button>
            <Button variant="outlined" size="large" sx={{ minWidth: 80 }}>5B</Button>
            <Button variant="outlined" size="large" sx={{ minWidth: 80 }}>5C</Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 3 }}>
            <Button variant="contained" size="large" sx={{ minWidth: 80 }}>C1</Button>
            <Button variant="contained" size="large" sx={{ minWidth: 80 }}>C2</Button>
            <Button variant="contained" size="large" sx={{ minWidth: 80 }}>C3</Button>
            <Button variant="contained" size="large" sx={{ minWidth: 80 }}>C4</Button>
            <Button variant="contained" size="large" sx={{ minWidth: 80 }}>C5</Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', mb: 2 }}>
            <Button variant="contained" color="info" size="medium" sx={{ minWidth: 70, fontSize: 12 }}>C4-P</Button>
            <Button variant="contained" color="info" size="medium" sx={{ minWidth: 70, fontSize: 12 }}>C4-G</Button>
            <Button variant="contained" color="info" size="medium" sx={{ minWidth: 70, fontSize: 12 }}>C4-R</Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="contained" color="info" size="medium" sx={{ minWidth: 70, fontSize: 12 }}>C5-S</Button>
            <Button variant="contained" color="info" size="medium" sx={{ minWidth: 70, fontSize: 12 }}>C5-P</Button>
            <Button variant="contained" color="info" size="medium" sx={{ minWidth: 70, fontSize: 12 }}>C5-E</Button>
          </Box>
          <Typography variant="body2" sx={{ mt: 3, color: 'text.secondary', fontStyle: 'italic' }}>
            Click on your preferred variation to see it applied across all pages
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default TitleVariations; 