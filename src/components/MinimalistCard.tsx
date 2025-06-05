import React, { memo } from 'react';
import { Card, CardContent, Box, Typography, Chip, useTheme, alpha, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LaunchIcon from '@mui/icons-material/Launch';
import DirectionsIcon from '@mui/icons-material/Directions';
import RainbowFlagIcon from './RainbowFlagIcon';

export interface EnhancedCardData {
  id: string;
  title: string;
  description: string;
  website?: string;
  tags: string[];
  priceRange?: string;
  price?: string;
  location?: string;
  address?: string;
  coordinates?: {
    lat?: number;
    lng?: number;
  };
  lgbtqFriendly?: boolean;
  neighborhood?: string;
  detailPath: string;
}

interface EnhancedMinimalistCardProps {
  data: EnhancedCardData;
  icon: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'error';
}

const EnhancedMinimalistCard: React.FC<EnhancedMinimalistCardProps> = ({
  data,
  icon,
  color = 'primary',
}) => {
  const theme = useTheme();

  // Generate Google Maps directions URL
  const getDirectionsUrl = () => {
    if (data.coordinates?.lat && data.coordinates?.lng) {
      return `https://maps.google.com/maps?daddr=${data.coordinates.lat},${data.coordinates.lng}`;
    } else if (data.address) {
      return `https://maps.google.com/maps?daddr=${encodeURIComponent(data.address)}`;
    } else if (data.location) {
      return `https://maps.google.com/maps?daddr=${encodeURIComponent(data.location)}`;
    }
    return '';
  };

  // Format price range
  const formatPriceRange = (priceRange?: string, price?: string) => {
    if (priceRange) {
      return priceRange;
    }
    
    if (price) {
      const numPrice = parseFloat(price);
      if (!isNaN(numPrice)) {
        if (numPrice === 0) return 'Free';
        if (numPrice <= 20) return '$';
        if (numPrice <= 50) return '$$';
        return '$$$';
      }
    }
    
    return 'See website';
  };

  const directionsUrl = getDirectionsUrl();
  const formattedPrice = formatPriceRange(data.priceRange, data.price);

  // Ensure data has required fields
  const safeData = {
    ...data,
    title: data.title || 'Untitled',
    description: data.description || 'No description available',
    tags: Array.isArray(data.tags) ? data.tags.filter(tag => tag && typeof tag === 'string') : [],
    website: data.website || '#',
    detailPath: data.detailPath || '#'
  };

  return (
    <Card
      component={RouterLink}
      to={safeData.detailPath}
      sx={{
        height: '100%',
        cursor: 'pointer',
        textDecoration: 'none',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        WebkitFontSmoothing: 'antialiased',
        border: `1px solid ${alpha(theme.palette[color].main, 0.3)}`,
        boxShadow: `0 2px 8px ${alpha(theme.palette[color].main, 0.15)},
                    inset 0 1px 2px ${alpha(theme.palette[color].main, 0.1)}`,
        '&:hover': {
          transform: 'translate3d(0, -4px, 0)',
          boxShadow: `0 4px 12px ${alpha(theme.palette[color].main, 0.2)},
                      inset 0 1px 2px ${alpha(theme.palette[color].main, 0.1)}`,
          border: `1px solid ${alpha(theme.palette[color].main, 0.4)}`,
        },
      }}
    >
      <CardContent 
        sx={{ 
          p: 3, 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
        }}
      >
        {/* Header with Icon */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            mb: 2,
            transform: 'translateZ(0)',
          }}
        >
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette[color].main, 0.1),
              color: theme.palette[color].main,
              transform: 'translateZ(0)',
            }}
          >
            {icon}
          </Box>
          
          {/* Action buttons */}
          <Box sx={{ 
            display: 'flex', 
            gap: 1,
            transform: 'translateZ(0)',
          }}>
            {safeData.lgbtqFriendly && (
              <RainbowFlagIcon sx={{ fontSize: '1.2rem' }} />
            )}
            
            {directionsUrl && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(directionsUrl, '_blank');
                }}
                sx={{ 
                  color: 'text.secondary',
                  transform: 'translateZ(0)',
                }}
              >
                <DirectionsIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ 
          flexGrow: 1,
          transform: 'translateZ(0)',
        }}>
          <Typography variant="h6" gutterBottom>
            {safeData.title}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {safeData.description}
          </Typography>

          {/* Address */}
          {safeData.address && (
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                fontStyle: 'italic'
              }}
            >
              <DirectionsIcon fontSize="small" />
              {safeData.address}
            </Typography>
          )}

          {/* Price */}
          <Typography variant="body2" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
            {formattedPrice}
          </Typography>

          {/* Tags */}
          {safeData.tags && safeData.tags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
              {safeData.tags.slice(0, 3).map((tag, index) => (
                <Chip 
                  key={index} 
                  label={tag} 
                  size="small" 
                  variant="outlined"
                />
              ))}
            </Box>
          )}
        </Box>

        {/* Footer */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mt: 'auto',
          transform: 'translateZ(0)',
        }}>
          {safeData.website && safeData.website !== '#' && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(safeData.website, '_blank');
              }}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5,
                color: theme.palette.primary.main,
                padding: '4px 8px',
                '&:hover': {
                  backgroundColor: 'transparent',
                  textDecoration: 'underline'
                }
              }}
            >
              <LaunchIcon fontSize="small" />
              <Typography variant="caption">Website</Typography>
            </IconButton>
          )}
          
          <ArrowForwardIcon color="primary" />
        </Box>
      </CardContent>
    </Card>
  );
};

export default memo(EnhancedMinimalistCard); 