import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import ExploreIcon from '@mui/icons-material/Explore';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import HomeIcon from '@mui/icons-material/Home';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import CelebrationIcon from '@mui/icons-material/Celebration';
import SportsIcon from '@mui/icons-material/Sports';
import CloseIcon from '@mui/icons-material/Close';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Happy Hours', icon: <LocalBarIcon />, path: '/happy-hours' },
    { text: 'Activities', icon: <LocalActivityIcon />, path: '/activities' },
    { text: 'Day Trips', icon: <DirectionsCarIcon />, path: '/day-trips' },
    { text: 'Amateur Sports', icon: <SportsSoccerIcon />, path: '/amateur-sports' },
    { text: 'Sporting Events', icon: <SportsIcon />, path: '/sporting-events' },
    { text: 'Special Events', icon: <CelebrationIcon />, path: '/special-events' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: 3,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ExploreIcon sx={{ mr: 1.5, color: 'primary.main', fontSize: '1.75rem' }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Toronto Guide
          </Typography>
        </Box>
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            width: 40,
            height: 40,
            color: 'text.secondary',
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              color: 'primary.main',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      
      <List sx={{ flex: 1, px: 2, py: 3 }}>
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <ListItem
              button
              key={item.text}
              component={RouterLink}
              to={item.path}
              onClick={handleDrawerToggle}
              sx={{
                py: 2,
                px: 3,
                my: 0.5,
                borderRadius: 2,
                position: 'relative',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                ...(active && {
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  '& .MuiListItemIcon-root': {
                    color: 'primary.main',
                  },
                  '& .MuiListItemText-primary': {
                    color: 'primary.main',
                    fontWeight: 600,
                  },
                }),
                ...(!active && {
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                    '& .MuiListItemIcon-root': {
                      color: 'primary.main',
                      transform: 'scale(1.1)',
                    },
                    '& .MuiListItemText-primary': {
                      color: 'primary.main',
                    },
                  },
                }),
              }}
            >
              <ListItemIcon 
                sx={{ 
                  minWidth: 44,
                  color: active ? 'primary.main' : 'text.secondary',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontSize: '1rem',
                    fontWeight: active ? 600 : 400,
                    color: active ? 'primary.main' : 'text.primary',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  },
                }}
              />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <AppBar 
      position="sticky" 
      color="default"
      elevation={0}
      sx={{
        bgcolor: alpha(theme.palette.background.paper, 0.95),
        backdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        color: 'text.primary',
      }}
    >
      <Container maxWidth="lg" disableGutters>
        <Toolbar sx={{ py: { xs: 1, md: 1.5 }, px: { xs: 2, sm: 3 } }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              flexGrow: 1,
              textDecoration: 'none',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                '& .logo-icon': {
                  color: 'primary.main',
                  transform: 'rotate(15deg) scale(1.05)',
                },
                '& .logo-text': {
                  color: 'primary.main',
                },
              },
            }}
            component={RouterLink}
            to="/"
          >
            <ExploreIcon 
              className="logo-icon"
              sx={{ 
                mr: { xs: 1, md: 1.5 },
                fontSize: { xs: '1.75rem', md: '2rem' },
                color: 'text.primary',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }} 
            />
            <Typography
              className="logo-text"
              variant="h6"
              sx={{
                textDecoration: 'none',
                color: 'text.primary',
                fontWeight: 700,
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                letterSpacing: '-0.025em',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              Toronto Guide
            </Typography>
          </Box>
          
          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerToggle}
                sx={{
                  width: 44,
                  height: 44,
                  color: 'text.secondary',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    color: 'primary.main',
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                variant="temporary"
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                  keepMounted: true,
                }}
                sx={{
                  '& .MuiDrawer-paper': { 
                    boxSizing: 'border-box', 
                    width: 320,
                    bgcolor: 'background.paper',
                    border: 'none',
                    boxShadow: theme.shadows[24],
                  },
                }}
              >
                {drawer}
              </Drawer>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {menuItems.slice(1).map((item) => {
                const active = isActive(item.path);
                return (
                  <Button
                    key={item.text}
                    component={RouterLink}
                    to={item.path}
                    startIcon={item.icon}
                    sx={{
                      px: 3,
                      py: 1.5,
                      color: active ? 'primary.main' : 'text.primary',
                      bgcolor: 'transparent',
                      borderRadius: 2,
                      fontSize: '0.95rem',
                      fontWeight: active ? 600 : 500,
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        color: 'primary.main',
                        transform: 'translateY(-1px)',
                        '& .MuiButton-startIcon': {
                          transform: 'scale(1.1)',
                        },
                      },
                      '& .MuiButton-startIcon': {
                        transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        marginRight: 1,
                      },
                      ...(active && {
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '60%',
                          height: 2,
                          bgcolor: 'primary.main',
                          borderRadius: 1,
                        },
                      }),
                    }}
                  >
                    {item.text}
                  </Button>
                );
              })}
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 