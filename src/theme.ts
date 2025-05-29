import { createTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#60A5FA',      // Elegant blue - softer for dark mode
      light: '#93C5FD',
      dark: '#3B82F6',
      contrastText: '#0F172A',
    },
    secondary: {
      main: '#F472B6',      // Sophisticated pink accent
      light: '#F9A8D4',
      dark: '#EC4899',
      contrastText: '#0F172A',
    },
    success: {
      main: '#34D399',      // Elegant green
      light: '#6EE7B7',
      dark: '#10B981',
    },
    warning: {
      main: '#FBBF24',      // Warm amber
      light: '#FCD34D',
      dark: '#F59E0B',
    },
    info: {
      main: '#38BDF8',      // Sky blue
      light: '#7DD3FC',
      dark: '#0EA5E9',
    },
    background: {
      default: '#0F172A',   // Deep navy - sophisticated dark
      paper: '#1E293B',     // Slightly lighter for cards and surfaces
    },
    text: {
      primary: '#F8FAFC',   // Pure white for primary text
      secondary: '#CBD5E1', // Light gray for secondary text
    },
    grey: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    },
    divider: alpha('#CBD5E1', 0.12),
    action: {
      hover: alpha('#60A5FA', 0.08),
      selected: alpha('#60A5FA', 0.12),
      disabled: alpha('#CBD5E1', 0.3),
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.75rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
      color: '#F8FAFC',
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.025em',
      color: '#F8FAFC',
    },
    h3: {
      fontSize: '1.875rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.025em',
      color: '#F1F5F9',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '-0.025em',
      color: '#F1F5F9',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#F1F5F9',
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#F1F5F9',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#CBD5E1',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#94A3B8',
    },
    subtitle1: {
      fontSize: '1.125rem',
      lineHeight: 1.5,
      color: '#94A3B8',
      fontWeight: 400,
    },
    subtitle2: {
      fontSize: '1rem',
      lineHeight: 1.4,
      color: '#94A3B8',
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      letterSpacing: '0.025em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: '#475569 #1E293B',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#1E293B',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#475569',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#64748B',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontSize: '0.95rem',
          fontWeight: 500,
          textTransform: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(96, 165, 250, 0.3)',
          },
        },
        outlined: {
          borderColor: alpha('#CBD5E1', 0.3),
          color: '#CBD5E1',
          '&:hover': {
            borderColor: '#60A5FA',
            backgroundColor: alpha('#60A5FA', 0.08),
            color: '#60A5FA',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: '#334155',
          backgroundImage: 'linear-gradient(145deg, #334155 0%, #475569 100%)',
          border: `1px solid ${alpha('#60A5FA', 0.2)}`,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            backgroundColor: '#3f4f5f',
            backgroundImage: 'linear-gradient(145deg, #3f4f5f 0%, #4a5a6a 100%)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(96, 165, 250, 0.3)',
            borderColor: alpha('#60A5FA', 0.4),
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#1E293B',
          backgroundImage: 'linear-gradient(145deg, #1E293B 0%, #334155 100%)',
          border: `1px solid ${alpha('#475569', 0.2)}`,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: alpha('#334155', 0.5),
            '& fieldset': {
              borderColor: alpha('#475569', 0.3),
            },
            '&:hover fieldset': {
              borderColor: alpha('#60A5FA', 0.5),
            },
            '&.Mui-focused fieldset': {
              borderColor: '#60A5FA',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#94A3B8',
          },
          '& .MuiOutlinedInput-input': {
            color: '#F8FAFC',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha('#475569', 0.3),
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha('#60A5FA', 0.5),
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#60A5FA',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: alpha('#334155', 0.8),
          color: '#CBD5E1',
          '&:hover': {
            backgroundColor: alpha('#60A5FA', 0.2),
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '16px',
          paddingRight: '16px',
          '@media (min-width: 600px)': {
            paddingLeft: '24px',
            paddingRight: '24px',
          },
        },
      },
    },
  },
  transitions: {
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
});

export default theme; 