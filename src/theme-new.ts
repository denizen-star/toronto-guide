import { createTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

// Extend the Material-UI theme interface
declare module '@mui/material/styles' {
  interface Palette {
    tertiary: Palette['primary'];
  }
  interface PaletteOptions {
    tertiary?: PaletteOptions['primary'];
  }
  interface TypeBackground {
    secondary: string;
  }
}

// Design System Theme - Sophisticated Lifestyle Concierge
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#E85A4F',      // Elegant Coral - Primary CTAs
      light: '#ED7A71',
      dark: '#C4483E',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#A8B5A0',      // Sophisticated Sage
      light: '#BBC7B4',
      dark: '#8A9682',
      contrastText: '#1A1A1A',
    },
    tertiary: {
      main: '#7FB3D3',      // Cool Mint - Links and accents
      light: '#9CC4DC',
      dark: '#6591B0',
    },
    warning: {
      main: '#D4AC0D',      // Refined Gold
      light: '#DDB834',
      dark: '#B3910B',
    },
    background: {
      default: '#F5F3F0',   // Warm Taupe - Primary background
      paper: '#FFFFFF',     // Pure white for cards and surfaces
      secondary: '#E8E6E3', // Soft Gray - Subtle backgrounds
    },
    text: {
      primary: '#1A1A1A',   // Sophisticated Charcoal
      secondary: '#4A4A4A', // Deep Slate
      disabled: alpha('#4A4A4A', 0.5),
    },
    grey: {
      50: '#FAFAFA',
      100: '#F5F3F0',
      200: '#E8E6E3',
      300: '#D1CCC7',
      400: '#A09A93',
      500: '#6F675E',
      600: '#4A4A4A',
      700: '#3A3A3A',
      800: '#2A2A3A',
      900: '#1A1A1A',
    },
    divider: alpha('#E8E6E3', 0.8),
    action: {
      hover: alpha('#E85A4F', 0.04),
      selected: alpha('#E85A4F', 0.08),
      disabled: alpha('#4A4A4A', 0.26),
      disabledBackground: alpha('#4A4A4A', 0.12),
    },
  },
  typography: {
    fontFamily: '"Inter", "Manrope", system-ui, -apple-system, sans-serif',
    
    // Hero Typography - Homepage only
    h1: {
      fontSize: '3rem',        // 48px
      fontWeight: 700,
      lineHeight: 1.08,        // 52px
      letterSpacing: '-0.02em',
      color: '#1A1A1A',
      fontFamily: '"Manrope", "Inter", sans-serif',
    },
    
    // Section Headers
    h2: {
      fontSize: '2rem',        // 32px
      fontWeight: 600,
      lineHeight: 1.125,       // 36px
      letterSpacing: '-0.01em',
      color: '#1A1A1A',
      fontFamily: '"Manrope", "Inter", sans-serif',
    },
    
    // Subsection Titles
    h3: {
      fontSize: '1.5rem',      // 24px
      fontWeight: 600,
      lineHeight: 1.167,       // 28px
      letterSpacing: '-0.01em',
      color: '#1A1A1A',
    },
    
    // Card Titles
    h4: {
      fontSize: '1.125rem',    // 18px
      fontWeight: 600,
      lineHeight: 1.333,       // 24px
      color: '#1A1A1A',
    },
    
    h5: {
      fontSize: '1rem',        // 16px
      fontWeight: 600,
      lineHeight: 1.25,        // 20px
      color: '#1A1A1A',
    },
    
    h6: {
      fontSize: '0.875rem',    // 14px
      fontWeight: 600,
      lineHeight: 1.286,       // 18px
      color: '#1A1A1A',
    },
    
    // Body Typography
    body1: {
      fontSize: '1rem',        // 16px
      fontWeight: 400,
      lineHeight: 1.5,         // 24px
      color: '#1A1A1A',
    },
    
    body2: {
      fontSize: '0.875rem',    // 14px
      fontWeight: 400,
      lineHeight: 1.429,       // 20px
      color: '#4A4A4A',
    },
    
    // Small Text
    caption: {
      fontSize: '0.75rem',     // 12px
      fontWeight: 400,
      lineHeight: 1.333,       // 16px
      color: '#4A4A4A',
    },
    
    // Button Text
    button: {
      fontSize: '0.875rem',    // 14px
      fontWeight: 500,
      lineHeight: 1.143,       // 16px
      textTransform: 'none',
      letterSpacing: '0.01em',
    },
    
    // Overline for labels
    overline: {
      fontSize: '0.75rem',     // 12px
      fontWeight: 600,
      lineHeight: 1.333,       // 16px
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      color: '#4A4A4A',
    },
  },
  
  shape: {
    borderRadius: 8,
  },
  
  spacing: 8, // Base 8px spacing unit
  
  components: {
    // Global baseline styles
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollBehavior: 'auto',
          WebkitOverflowScrolling: 'touch',
        },
        body: {
          scrollBehavior: 'auto',
          WebkitOverflowScrolling: 'touch',
          margin: 0,
          padding: 0,
          minHeight: '100vh',
          overflowY: 'scroll',
          overflowX: 'hidden',
        },
        '#root': {
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        },
        '*': {
          boxSizing: 'border-box',
          margin: 0,
          padding: 0,
        }
      },
    },
    
    // Button Components
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: '12px 24px',
          fontSize: '0.875rem',
          fontWeight: 500,
          textTransform: 'none',
          transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
        contained: {
          backgroundColor: '#E85A4F',
          color: '#FFFFFF',
          boxShadow: '0 2px 8px rgba(232, 90, 79, 0.24)',
          '&:hover': {
            backgroundColor: '#D64A3F',
            boxShadow: '0 4px 16px rgba(232, 90, 79, 0.32)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderColor: '#4A4A4A',
          color: '#4A4A4A',
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: '#F5F3F0',
            borderColor: '#4A4A4A',
          },
        },
        text: {
          color: '#E85A4F',
          padding: '8px 16px',
          '&:hover': {
            backgroundColor: alpha('#E85A4F', 0.04),
            textDecoration: 'underline',
          },
        },
      },
    },
    
    // Card Components
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: '#FFFFFF',
          border: '1px solid #E8E6E3',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '24px',
          '&:last-child': {
            paddingBottom: '24px',
          },
        },
      },
    },
    
    // Input Components
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 4,
            '& fieldset': {
              borderColor: '#E8E6E3',
            },
            '&:hover fieldset': {
              borderColor: '#4A4A4A',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#E85A4F',
              borderWidth: '2px',
            },
          },
          '& .MuiInputBase-input': {
            padding: '12px 16px',
            fontSize: '0.875rem',
          },
        },
      },
    },
    
    // Navigation Components
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#F5F3F0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          color: '#1A1A1A',
          height: '72px',
          justifyContent: 'center',
        },
      },
    },
    
    // Container Components
    MuiContainer: {
      styleOverrides: {
        root: {
          maxWidth: '1200px !important',
          '@media (min-width: 1200px)': {
            paddingLeft: '80px',
            paddingRight: '80px',
          },
          '@media (min-width: 768px) and (max-width: 1199px)': {
            paddingLeft: '40px',
            paddingRight: '40px',
          },
          '@media (max-width: 767px)': {
            paddingLeft: '20px',
            paddingRight: '20px',
          },
        },
      },
    },
    
    // Grid Components for Bauhaus layouts
    MuiGrid: {
      styleOverrides: {
        container: {
          '@media (min-width: 1200px)': {
            margin: '0 -12px',
            '& > .MuiGrid-item': {
              padding: '0 12px',
            },
          },
          '@media (min-width: 768px) and (max-width: 1199px)': {
            margin: '0 -10px',
            '& > .MuiGrid-item': {
              padding: '0 10px',
            },
          },
          '@media (max-width: 767px)': {
            margin: '0 -8px',
            '& > .MuiGrid-item': {
              padding: '0 8px',
            },
          },
        },
      },
    },
    
    // Chip components for tags/categories
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontSize: '0.75rem',
          fontWeight: 500,
          height: 28,
        },
        filled: {
          backgroundColor: '#A8B5A0',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#8A9682',
          },
        },
        outlined: {
          borderColor: '#E8E6E3',
          color: '#4A4A4A',
          '&:hover': {
            backgroundColor: alpha('#A8B5A0', 0.04),
          },
        },
      },
    },
    
    // Breadcrumb navigation
    MuiBreadcrumbs: {
      styleOverrides: {
        separator: {
          color: '#4A4A4A',
          margin: '0 8px',
        },
        li: {
          fontSize: '0.75rem',
          '& a': {
            color: '#4A4A4A',
            textDecoration: 'none',
            '&:hover': {
              color: '#E85A4F',
              textDecoration: 'underline',
            },
          },
          '&:last-child': {
            color: '#E85A4F',
            fontWeight: 500,
          },
        },
      },
    },
  },
});

export default theme; 