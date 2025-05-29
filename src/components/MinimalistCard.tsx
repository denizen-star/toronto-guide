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
      background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.grey[700], 0.8)} 100%)`,
      border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: to || onClick ? 'translateY(-6px)' : 'none',
        background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 1.1)} 0%, ${alpha(theme.palette.grey[600], 0.9)} 100%)`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.6)}`,
        boxShadow: to || onClick ? 
          '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(96, 165, 250, 0.4)' : 
          '0 4px 20px rgba(0, 0, 0, 0.4)',
        '& .card-icon': {
          transform: 'scale(1.15) rotate(8deg)',
          background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.2)} 0%, ${alpha(theme.palette[color].light, 0.1)} 100%)`,
          boxShadow: `0 2px 8px ${alpha(theme.palette[color].main, 0.2)}`,
        },
        '& .card-arrow': {
          transform: 'translateX(6px)',
          opacity: 1,
          color: theme.palette.primary.main,
        },
        '& .card-features': {
          '& .MuiChip-root': {
            transform: 'scale(1.05)',
            backgroundColor: alpha(theme.palette[color].main, 0.15),
            color: theme.palette[color].light,
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
              background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.2)} 0%, ${alpha(theme.palette[color].light, 0.1)} 100%)`,
              border: `1px solid ${alpha(theme.palette[color].main, 0.4)}`,
              color: theme.palette[color].light,
              boxShadow: `0 2px 8px ${alpha(theme.palette[color].main, 0.2)}`,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '& .MuiSvgIcon-root': {
                fontSize: iconSize,
                filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))',
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
                    bgcolor: alpha(theme.palette.grey[800], 0.8),
                    color: theme.palette.text.secondary,
                    border: `1px solid ${alpha(theme.palette.grey[600], 0.3)}`,
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    height: 26,
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      bgcolor: alpha(theme.palette[color].main, 0.15),
                      color: theme.palette[color].light,
                      borderColor: alpha(theme.palette[color].main, 0.4),
                      transform: 'translateY(-1px)',
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