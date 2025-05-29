import React from 'react';
import { Box, Container, Typography, Button, useTheme, alpha } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface SectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  backgroundColor?: string;
  buttonText?: string;
  buttonPath?: string;
  buttonColor?: 'primary' | 'secondary' | 'success' | 'warning' | 'info';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  spacing?: 'compact' | 'normal' | 'spacious';
  textAlign?: 'left' | 'center' | 'right';
}

const Section: React.FC<SectionProps> = ({
  title,
  subtitle,
  children,
  backgroundColor = 'background.default',
  buttonText,
  buttonPath,
  buttonColor = 'primary',
  maxWidth = 'lg',
  spacing = 'normal',
  textAlign = 'center',
}) => {
  const theme = useTheme();

  const getPadding = () => {
    switch (spacing) {
      case 'compact':
        return { xs: 4, md: 6 };
      case 'spacious':
        return { xs: 6, md: 10 };
      default:
        return { xs: 5, md: 8 };
    }
  };

  const getHeaderMargin = () => {
    switch (spacing) {
      case 'compact':
        return { xs: 3, md: 4 };
      case 'spacious':
        return { xs: 5, md: 6 };
      default:
        return { xs: 4, md: 5 };
    }
  };

  return (
    <Box sx={{ 
      bgcolor: backgroundColor,
      py: getPadding(),
      position: 'relative',
      borderBottom: backgroundColor === 'background.paper' ? 
        `1px solid ${alpha(theme.palette.divider, 0.1)}` : 
        'none',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: backgroundColor === 'background.paper' ?
          `linear-gradient(90deg, transparent 0%, ${alpha(theme.palette.primary.main, 0.2)} 50%, transparent 100%)` :
          `linear-gradient(90deg, transparent 0%, ${alpha(theme.palette.divider, 0.3)} 50%, transparent 100%)`,
      },
    }}>
      <Container maxWidth={maxWidth} sx={{ px: { xs: 2, sm: 3 } }}>
        {/* Header Section */}
        <Box sx={{ 
          mb: getHeaderMargin(), 
          textAlign,
          maxWidth: textAlign === 'center' ? '800px' : 'none',
          mx: textAlign === 'center' ? 'auto' : 0,
        }}>
          <Typography 
            variant="h3"
            component="h2"
            sx={{ 
              mb: 2,
              position: 'relative',
              display: 'inline-block',
            }}
          >
            {title}
          </Typography>
          
          {subtitle && (
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: buttonText ? 4 : 0,
                maxWidth: '600px',
                mx: textAlign === 'center' ? 'auto' : 0,
              }}
            >
              {subtitle}
            </Typography>
          )}

          {/* Call to Action Button */}
          {buttonText && buttonPath && (
            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color={buttonColor}
                size="large"
                component={RouterLink}
                to={buttonPath}
                sx={{ 
                  px: 5, 
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: `0 4px 14px ${alpha(theme.palette[buttonColor].main, 0.3)}`,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 25px ${alpha(theme.palette[buttonColor].main, 0.4)}`,
                  },
                }}
              >
                {buttonText}
              </Button>
            </Box>
          )}
        </Box>

        {/* Content Section */}
        <Box>
          {children}
        </Box>
      </Container>
    </Box>
  );
};

export default Section; 