import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Box, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText,
  useTheme,
  useMediaQuery,
  InputBase,
  styled
} from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon, Search as SearchIcon } from '@mui/icons-material';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'var(--color-white, #ffffff)',
  color: 'var(--color-charcoal, #1A1A1A)',
  boxShadow: 'none',
  borderBottom: '1px solid var(--color-soft-gray, #E8E6E3)',
  position: 'sticky',
  top: 0,
  zIndex: 100,
}));

const StyledToolbar = styled(Toolbar)({
  padding: '0 var(--space-4, 32px)',
  minHeight: 'var(--space-8, 64px)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const Logo = styled(RouterLink)({
  fontSize: '1.5rem',
  fontWeight: 700,
  color: 'var(--color-charcoal, #1A1A1A)',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  textDecoration: 'none',
  fontFamily: 'var(--font-primary, Inter)',
});

const SearchContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: 'var(--color-warm-taupe, #F5F3F0)',
  borderRadius: '20px',
  padding: '6px 12px',
  minWidth: '240px',
  height: '36px',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const SearchInput = styled(InputBase)({
  marginLeft: '6px',
  flex: 1,
  fontSize: '0.8rem',
  color: 'var(--color-charcoal, #1A1A1A)',
  '&::placeholder': {
    color: 'var(--color-deep-slate, #4A4A4A)',
  },
});

const NavMenu = styled('ul')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: 'var(--space-4, 32px)',
  listStyle: 'none',
  margin: 0,
  padding: 0,
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const NavLink = styled(RouterLink)<{ active?: boolean }>(({ active }) => ({
  fontSize: '0.875rem',
  fontWeight: 500,
  color: active ? 'var(--color-accent-sage, #A8B5A0)' : 'var(--color-deep-slate, #4A4A4A)',
  textDecoration: 'none',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  transition: 'color 150ms ease',
  borderBottom: active ? '2px solid var(--color-accent-sage, #A8B5A0)' : '2px solid transparent',
  paddingBottom: '2px',
  '&:hover': {
    color: 'var(--color-accent-sage, #A8B5A0)',
    borderBottomColor: 'var(--color-accent-sage, #A8B5A0)',
  },
}));

const MobileDrawer = styled(Drawer)({
  '& .MuiDrawer-paper': {
    width: '100%',
    backgroundColor: 'var(--color-white, #ffffff)',
    padding: 'var(--space-4, 32px)',
  },
});

const MobileNavList = styled(List)({
  padding: 0,
});

const MobileNavItem = styled(ListItem)({
  padding: 'var(--space-3, 24px) 0',
  borderBottom: '1px solid var(--color-soft-gray, #E8E6E3)',
});

const MobileNavLink = styled(RouterLink)<{ active?: boolean }>(({ active }) => ({
  fontSize: '1.125rem',
  fontWeight: active ? 600 : 500,
  color: active ? 'var(--color-accent-sage, #A8B5A0)' : 'var(--color-charcoal, #1A1A1A)',
  textDecoration: 'none',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  width: '100%',
  display: 'block',
}));

const MobileSearchContainer = styled(Box)({
  padding: 'var(--space-4, 32px) 0',
  borderBottom: '1px solid var(--color-soft-gray, #E8E6E3)',
  marginBottom: 'var(--space-2, 16px)',
});

const MobileSearchInput = styled(InputBase)({
  width: '100%',
  backgroundColor: 'var(--color-warm-taupe, #F5F3F0)',
  padding: '8px 12px',
  borderRadius: '20px',
  fontSize: '0.9rem',
  color: 'var(--color-charcoal, #1A1A1A)',
  '&::placeholder': {
    color: 'var(--color-deep-slate, #4A4A4A)',
  },
});

interface NavigationProps {
  searchTerm?: string;
  onSearchChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchPlaceholder?: string;
}

const Navigation: React.FC<NavigationProps> = ({ 
  searchTerm = '', 
  onSearchChange, 
  searchPlaceholder = 'Search...'
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  // Hide search bar on home page
  const isHomePage = location.pathname === '/';

  const navigationItems = [
    { path: '/amateur-sports', label: 'Play' },
    { path: '/activities', label: 'Activities' },
    { path: '/happy-hours', label: 'Happy Hours' },
    { path: '/day-trips', label: 'Trips' },
    { path: '/special-events', label: 'Culture' },
    { path: '/sporting-events', label: 'Sports' },
  ];

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <StyledAppBar position="sticky">
        <StyledToolbar>
          {/* Logo */}
          <Logo to="/">Toronto</Logo>

          {/* Desktop Search - Hidden on home page */}
          {!isHomePage && (
            <SearchContainer>
              <SearchIcon sx={{ color: 'var(--color-deep-slate, #4A4A4A)' }} />
              <SearchInput
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={onSearchChange}
              />
            </SearchContainer>
          )}

          {/* Desktop Navigation */}
          <NavMenu>
            {navigationItems.map((item) => (
              <ListItem key={item.path} component="li" sx={{ padding: 0, width: 'auto' }}>
                <NavLink 
                  to={item.path} 
                  active={location.pathname === item.path}
                >
                  {item.label}
                </NavLink>
              </ListItem>
            ))}
          </NavMenu>

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMobileMenuToggle}
              sx={{ color: 'var(--color-charcoal, #1A1A1A)' }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </StyledToolbar>
      </StyledAppBar>

      {/* Mobile Drawer */}
      <MobileDrawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMobileMenuClose}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Logo to="/" onClick={handleMobileMenuClose}>Toronto</Logo>
          <IconButton onClick={handleMobileMenuClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Mobile Search - Hidden on home page */}
        {!isHomePage && (
          <MobileSearchContainer>
            <MobileSearchInput
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={onSearchChange}
            />
          </MobileSearchContainer>
        )}

        {/* Mobile Navigation Links */}
        <MobileNavList>
          {navigationItems.map((item) => (
            <MobileNavItem key={item.path}>
              <MobileNavLink 
                to={item.path} 
                active={location.pathname === item.path}
                onClick={handleMobileMenuClose}
              >
                <ListItemText 
                  primary={item.label}
                  sx={{ 
                    '& .MuiListItemText-primary': {
                      fontSize: 'inherit',
                      fontWeight: 'inherit',
                      color: 'inherit',
                      textTransform: 'inherit',
                      letterSpacing: 'inherit',
                    }
                  }}
                />
              </MobileNavLink>
            </MobileNavItem>
          ))}
        </MobileNavList>
      </MobileDrawer>
    </>
  );
};

export default Navigation; 