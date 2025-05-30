import React from 'react';
import { Box, Chip, Typography, useTheme, alpha } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface FilterBubblesProps {
  selectedCategories: string[];
  selectedPrices: string[];
  selectedDurations: string[];
  selectedRatings: string[];
  selectedAreas: string[];
  selectedTags: string[];
  categoryOptions: { value: string; label: string }[];
  priceOptions: { value: string; label: string }[];
  durationOptions: { value: string; label: string }[];
  ratingOptions: { value: string; label: string }[];
  areaOptions: { value: string; label: string }[];
  tagOptions: { value: string; label: string }[];
  onRemoveCategory: (value: string) => void;
  onRemovePrice: (value: string) => void;
  onRemoveDuration: (value: string) => void;
  onRemoveRating: (value: string) => void;
  onRemoveArea: (value: string) => void;
  onRemoveTag: (value: string) => void;
  onClearAll: () => void;
}

const FilterBubbles: React.FC<FilterBubblesProps> = ({
  selectedCategories,
  selectedPrices,
  selectedDurations,
  selectedRatings,
  selectedAreas,
  selectedTags,
  categoryOptions,
  priceOptions,
  durationOptions,
  ratingOptions,
  areaOptions,
  tagOptions,
  onRemoveCategory,
  onRemovePrice,
  onRemoveDuration,
  onRemoveRating,
  onRemoveArea,
  onRemoveTag,
  onClearAll,
}) => {
  const theme = useTheme();

  // Get label for a value from options array
  const getLabel = (value: string, options: { value: string; label: string }[]) => {
    const option = options.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  // Count total active filters
  const totalFilters = 
    selectedCategories.length + 
    selectedPrices.length + 
    selectedDurations.length + 
    selectedRatings.length + 
    selectedAreas.length + 
    selectedTags.length;

  if (totalFilters === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
        py: 2,
      }}
    >
      <div className="swiss-container">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: 'text.secondary',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontSize: '0.75rem',
            }}
          >
            Active Filters ({totalFilters}):
          </Typography>

          {/* Category Filters */}
          {selectedCategories.map((category) => (
            <Chip
              key={`category-${category}`}
              label={getLabel(category, categoryOptions)}
              onDelete={() => onRemoveCategory(category)}
              deleteIcon={<CloseIcon />}
              size="small"
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                '& .MuiChip-deleteIcon': {
                  color: theme.palette.primary.main,
                  '&:hover': {
                    color: theme.palette.primary.dark,
                  },
                },
              }}
            />
          ))}

          {/* Price Filters */}
          {selectedPrices.map((price) => (
            <Chip
              key={`price-${price}`}
              label={`Price: ${getLabel(price, priceOptions)}`}
              onDelete={() => onRemovePrice(price)}
              deleteIcon={<CloseIcon />}
              size="small"
              sx={{
                backgroundColor: alpha(theme.palette.success.main, 0.1),
                color: theme.palette.success.main,
                border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                '& .MuiChip-deleteIcon': {
                  color: theme.palette.success.main,
                  '&:hover': {
                    color: theme.palette.success.dark,
                  },
                },
              }}
            />
          ))}

          {/* Duration Filters */}
          {selectedDurations.map((duration) => (
            <Chip
              key={`duration-${duration}`}
              label={`Duration: ${getLabel(duration, durationOptions)}`}
              onDelete={() => onRemoveDuration(duration)}
              deleteIcon={<CloseIcon />}
              size="small"
              sx={{
                backgroundColor: alpha(theme.palette.info.main, 0.1),
                color: theme.palette.info.main,
                border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
                '& .MuiChip-deleteIcon': {
                  color: theme.palette.info.main,
                  '&:hover': {
                    color: theme.palette.info.dark,
                  },
                },
              }}
            />
          ))}

          {/* Rating Filters */}
          {selectedRatings.map((rating) => (
            <Chip
              key={`rating-${rating}`}
              label={`Rating: ${getLabel(rating, ratingOptions)}`}
              onDelete={() => onRemoveRating(rating)}
              deleteIcon={<CloseIcon />}
              size="small"
              sx={{
                backgroundColor: alpha(theme.palette.warning.main, 0.1),
                color: theme.palette.warning.main,
                border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
                '& .MuiChip-deleteIcon': {
                  color: theme.palette.warning.main,
                  '&:hover': {
                    color: theme.palette.warning.dark,
                  },
                },
              }}
            />
          ))}

          {/* Area Filters */}
          {selectedAreas.map((area) => (
            <Chip
              key={`area-${area}`}
              label={`Area: ${getLabel(area, areaOptions)}`}
              onDelete={() => onRemoveArea(area)}
              deleteIcon={<CloseIcon />}
              size="small"
              sx={{
                backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                color: theme.palette.secondary.main,
                border: `1px solid ${alpha(theme.palette.secondary.main, 0.3)}`,
                '& .MuiChip-deleteIcon': {
                  color: theme.palette.secondary.main,
                  '&:hover': {
                    color: theme.palette.secondary.dark,
                  },
                },
              }}
            />
          ))}

          {/* Tag Filters */}
          {selectedTags.map((tag) => (
            <Chip
              key={`tag-${tag}`}
              label={`Tag: ${getLabel(tag, tagOptions)}`}
              onDelete={() => onRemoveTag(tag)}
              deleteIcon={<CloseIcon />}
              size="small"
              sx={{
                backgroundColor: alpha('#9c27b0', 0.1),
                color: '#9c27b0',
                border: `1px solid ${alpha('#9c27b0', 0.3)}`,
                '& .MuiChip-deleteIcon': {
                  color: '#9c27b0',
                  '&:hover': {
                    color: '#7b1fa2',
                  },
                },
              }}
            />
          ))}

          {/* Clear All Button */}
          {totalFilters > 1 && (
            <Chip
              label="Clear All"
              onClick={onClearAll}
              size="small"
              sx={{
                backgroundColor: alpha(theme.palette.error.main, 0.1),
                color: theme.palette.error.main,
                border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.error.main, 0.2),
                },
              }}
            />
          )}
        </Box>
      </div>
    </Box>
  );
};

export default FilterBubbles; 