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
import MapIcon from '@mui/icons-material/Map';
import ExploreIcon from '@mui/icons-material/Explore';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import HomeIcon from '@mui/icons-material/Home';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Happy Hours', icon: <LocalBarIcon />, path: '/neighborhoods' },
    { text: 'Activities', icon: <LocalActivityIcon />, path: '/activities' },
    { text: 'Map View', icon: <MapIcon />, path: '/map' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  const drawer = (
    <List sx={{ pt: 1 }}>
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
              borderRadius: '0 24px 24px 0',
              marginRight: 2,
              position: 'relative',
              ...(active && {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 4,
                  bgcolor: 'primary.main',
                  borderRadius: '0 2px 2px 0',
                },
                '& .MuiListItemIcon-root': {
                  color: 'primary.main',
                },
                '& .MuiListItemText-primary': {
                  color: 'primary.main',
                  fontWeight: 600,
                },
              }),
            }}
          >
            <ListItemIcon 
              sx={{ 
                minWidth: 40,
                color: active ? 'primary.main' : 'inherit',
                transition: 'color 0.2s',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              sx={{
                '& .MuiListItemText-primary': {
                  fontSize: '0.95rem',
                  fontWeight: active ? 600 : 400,
                  transition: 'color 0.2s, font-weight 0.2s',
                },
              }}
            />
          </ListItem>
        );
      })}
    </List>
  );

  return (
    <AppBar 
      position="sticky" 
      color="primary"
      elevation={1}
      sx={{
        bgcolor: alpha(theme.palette.background.default, 0.9),
        backdropFilter: 'blur(8px)',
        color: 'text.primary',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ py: { xs: 1, md: 0 } }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              flexGrow: 1,
              '&:hover': {
                '& .MuiTypography-root': {
                  color: 'primary.main',
                },
                '& .MuiSvgIcon-root': {
                  color: 'primary.main',
                },
              },
            }}
            component={RouterLink}
            to="/"
          >
            <ExploreIcon 
              sx={{ 
                mr: 1.5,
                fontSize: { xs: '1.75rem', md: '2rem' },
                color: 'inherit',
                transition: 'color 0.2s',
              }} 
            />
            <Typography
              variant="h6"
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                fontWeight: 700,
                fontSize: { xs: '1.15rem', md: '1.25rem' },
                transition: 'color 0.2s',
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
                edge="start"
                onClick={handleDrawerToggle}
                sx={{
                  width: 40,
                  height: 40,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
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
                    width: 280,
                    bgcolor: theme.palette.background.default,
                    borderLeft: 'none',
                    boxShadow: theme.shadows[8],
                  },
                }}
                PaperProps={{
                  sx: {
                    mt: '56px',
                    height: 'calc(100% - 56px)',
                    borderTopLeftRadius: '16px',
                  },
                }}
              >
                {drawer}
              </Drawer>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {menuItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Button
                    key={item.text}
                    component={RouterLink}
                    to={item.path}
                    startIcon={item.icon}
                    sx={{
                      px: 2,
                      py: 1,
                      color: active ? 'primary.main' : 'text.primary',
                      bgcolor: active ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                      borderRadius: '8px',
                      '&:hover': {
                        bgcolor: active 
                          ? alpha(theme.palette.primary.main, 0.15)
                          : alpha(theme.palette.primary.main, 0.08),
                      },
                      '& .MuiButton-startIcon': {
                        transition: 'transform 0.2s',
                      },
                      '&:hover .MuiButton-startIcon': {
                        transform: 'scale(1.1)',
                      },
                      fontWeight: active ? 600 : 400,
                      transition: 'all 0.2s',
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