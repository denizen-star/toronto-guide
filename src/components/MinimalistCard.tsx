import React from 'react';
import { Card, CardContent, Box, Typography, Chip, useTheme, alpha } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface MinimalistCardProps {
  title: string;
  description: string;
  features?: string[];
  icon: React.ReactNode;
  to?: string;
  onClick?: () => void;
  variant?: 'default' | 'featured' | 'compact';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'info';
}

const MinimalistCard: React.FC<MinimalistCardProps> = ({
  title,
  description,
  features = [],
  icon,
  to,
  onClick,
  variant = 'default',
  color = 'primary',
}) => {
  const theme = useTheme();

  const cardProps = {
    sx: {
      height: '100%',
      cursor: to || onClick ? 'pointer' : 'default',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(145deg, #ffffff 0%, #fafafa 100%)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: to || onClick ? 'translateY(-4px)' : 'none',
        boxShadow: to || onClick ? 
          '0 12px 40px rgba(46, 59, 78, 0.15)' : 
          '0 1px 3px rgba(46, 59, 78, 0.1)',
        '& .card-icon': {
          transform: 'scale(1.1) rotate(5deg)',
          color: `${color}.main`,
        },
        '& .card-arrow': {
          transform: 'translateX(4px)',
          opacity: 1,
        },
        '& .card-features': {
          '& .MuiChip-root': {
            transform: 'scale(1.02)',
          },
        },
      },
    },
    ...(to && {
      component: RouterLink,
      to,
    }),
    ...(onClick && {
      onClick,
    }),
  };

  const iconSize = variant === 'compact' ? '2.5rem' : '3rem';
  const titleVariant = variant === 'compact' ? 'h6' : 'h5';

  return (
    <Card {...cardProps}>
      <CardContent sx={{ 
        p: { xs: 3, md: 4 }, 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
      }}>
        {/* Icon Section */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 3,
        }}>
          <Box
            className="card-icon"
            sx={{
              p: 2,
              borderRadius: 3,
              bgcolor: alpha(theme.palette[color].main, 0.15),
              border: `1px solid ${alpha(theme.palette[color].main, 0.3)}`,
              color: `${color}.main`,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '& .MuiSvgIcon-root': {
                fontSize: iconSize,
              },
            }}
          >
            {icon}
          </Box>
          
          {(to || onClick) && (
            <ArrowForwardIcon
              className="card-arrow"
              sx={{
                color: 'text.secondary',
                opacity: 0.6,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                fontSize: '1.25rem',
              }}
            />
          )}
        </Box>

        {/* Content Section */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography 
            variant={titleVariant} 
            sx={{ 
              mb: 2, 
              fontWeight: 600,
              color: 'text.primary',
              lineHeight: 1.3,
            }}
          >
            {title}
          </Typography>
          
          <Typography 
            variant="body2" 
            sx={{ 
              mb: features.length > 0 ? 3 : 0,
              color: 'text.secondary',
              lineHeight: 1.6,
            }}
          >
            {description}
          </Typography>

          {/* Features Section */}
          {features.length > 0 && (
            <Box 
              className="card-features"
              sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 1,
                mt: 'auto',
              }}
            >
              {features.map((feature, index) => (
                <Chip
                  key={index}
                  label={feature}
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.grey[100], 0.8),
                    color: 'text.secondary',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    height: 24,
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      bgcolor: alpha(theme.palette[color].main, 0.1),
                      color: `${color}.main`,
                    },
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default MinimalistCard; 