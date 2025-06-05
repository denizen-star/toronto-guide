import React, { useMemo, useCallback, useState, memo } from 'react';
import { 
  Box, 
  Chip, 
  Button, 
  Typography, 
  Collapse,
  IconButton,
  useTheme,
  alpha
} from '@mui/material';
import { 
  Clear, 
  ExpandMore, 
  Tune
} from '@mui/icons-material';
import MultiSelectFilter from './MultiSelectFilter';

export interface FilterOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
  placeholder: string;
}

export interface EnhancedFilterSystemProps {
  filters: FilterConfig[];
  selectedFilters: { [key: string]: string[] };
  onFilterChange: (filterKey: string, values: string[]) => void;
  onResetFilters: () => void;
  className?: string;
}

// Memoized filter bubble component
const FilterBubble = memo(({ 
  filterKey, 
  value, 
  label, 
  onRemove 
}: { 
  filterKey: string; 
  value: string; 
  label: string;
  onRemove: (filterKey: string, value: string) => void;
}) => (
  <Chip
    key={`${filterKey}-${value}`}
    label={label}
    onDelete={() => onRemove(filterKey, value)}
    size="small"
    sx={{
      m: 0.5,
      backgroundColor: 'var(--color-warm-taupe)',
      borderColor: 'var(--color-soft-gray)',
      transform: 'translateZ(0)', // Hardware acceleration
      '&:hover': {
        backgroundColor: 'var(--color-warm-taupe)',
        transform: 'translateZ(0) translateY(-1px)',
      }
    }}
  />
));

// Memoized multi-select filter component
const FilterGroup = memo(({ 
  filter, 
  selectedValues, 
  onChange 
}: { 
  filter: FilterConfig; 
  selectedValues: string[]; 
  onChange: (filterKey: string, values: string[]) => void;
}) => (
  <MultiSelectFilter
    key={filter.key}
    label={filter.label}
    options={filter.options}
    selectedValues={selectedValues}
    onChange={(values) => onChange(filter.key, values)}
    placeholder={filter.placeholder}
  />
));

const EnhancedFilterSystem: React.FC<EnhancedFilterSystemProps> = ({
  filters,
  selectedFilters,
  onFilterChange,
  onResetFilters,
  className = ''
}) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate total selected items across all filters (memoized)
  const totalSelectedItems = useMemo(() => {
    return Object.values(selectedFilters).reduce((total, items) => total + items.length, 0);
  }, [selectedFilters]);

  // Create filter bubbles for all selected items (memoized)
  const filterBubbles = useMemo(() => {
    const bubbles: Array<{ filterKey: string; filterLabel: string; value: string; label: string }> = [];
    
    filters.forEach(filter => {
      const selectedValues = selectedFilters[filter.key] || [];
      selectedValues.forEach(value => {
        const option = filter.options.find(opt => opt.value === value);
        if (option) {
          bubbles.push({
            filterKey: filter.key,
            filterLabel: filter.label,
            value,
            label: option.label
          });
        }
      });
    });
    
    return bubbles;
  }, [filters, selectedFilters]);

  // Handle removing individual filter item (memoized callback)
  const handleRemoveFilterItem = useCallback((filterKey: string, value: string) => {
    const currentValues = selectedFilters[filterKey] || [];
    const newValues = currentValues.filter(v => v !== value);
    onFilterChange(filterKey, newValues);
  }, [selectedFilters, onFilterChange]);

  // Handle toggle accordion
  const handleToggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  // Memoized filter change handler with debouncing logic
  const handleFilterChangeOptimized = useCallback((filterKey: string, values: string[]) => {
    // Use requestAnimationFrame for smooth UI updates
    requestAnimationFrame(() => {
      onFilterChange(filterKey, values);
    });
  }, [onFilterChange]);

  return (
    <section 
      className={`filter-section ${className}`} 
      style={{
        backgroundColor: 'var(--color-warm-taupe)',
        borderTop: '1px solid var(--color-soft-gray)',
        borderBottom: '1px solid var(--color-soft-gray)',
        transform: 'translateZ(0)', // Hardware acceleration
        backfaceVisibility: 'hidden',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <div 
        className="swiss-container"
        style={{
          transform: 'translateZ(0)', // Hardware acceleration
        }}
      >
        {/* Compact Filter Header */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 1.5,
          minHeight: '48px',
          transform: 'translateZ(0)', // Hardware acceleration
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={handleToggleExpanded}
              size="small"
              sx={{
                color: 'var(--color-charcoal)',
                p: 0.5,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.04)
                }
              }}
            >
              <Tune fontSize="small" />
            </IconButton>
            
            <Typography
              variant="subtitle2"
              sx={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--weight-semibold)',
                color: 'var(--color-charcoal)',
                fontFamily: 'var(--font-primary)',
                letterSpacing: '0.025em',
                textTransform: 'uppercase'
              }}
            >
              Filters
            </Typography>

            {totalSelectedItems > 0 && (
              <Chip
                label={totalSelectedItems}
                size="small"
                sx={{
                  backgroundColor: 'var(--color-elegant-coral)',
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: 'var(--weight-bold)',
                  height: '18px',
                  minWidth: '18px',
                  '& .MuiChip-label': {
                    px: 0.75
                  }
                }}
              />
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {totalSelectedItems > 0 && (
              <Button
                onClick={onResetFilters}
                size="small"
                startIcon={<Clear fontSize="small" />}
                sx={{
                  color: 'var(--color-deep-slate)',
                  fontSize: '12px',
                  fontWeight: 'var(--weight-medium)',
                  textTransform: 'none',
                  fontFamily: 'var(--font-primary)',
                  minHeight: '28px',
                  px: 1.5,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.error.main, 0.04),
                    color: 'var(--color-elegant-coral)'
                  }
                }}
              >
                Reset
              </Button>
            )}
            
            <IconButton
              onClick={handleToggleExpanded}
              size="small"
              sx={{
                color: 'var(--color-charcoal)',
                transition: 'transform 0.2s ease',
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                p: 0.5
              }}
            >
              <ExpandMore fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Filter Bubbles */}
        {filterBubbles.length > 0 && (
          <Box 
            sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 0.5, 
              py: 1,
              transform: 'translateZ(0)', // Hardware acceleration
            }}
          >
            {filterBubbles.map(bubble => (
              <FilterBubble
                key={`${bubble.filterKey}-${bubble.value}`}
                {...bubble}
                onRemove={handleRemoveFilterItem}
              />
            ))}
          </Box>
        )}

        {/* Filter Groups */}
        <Collapse 
          in={isExpanded} 
          timeout={200}
          sx={{
            transform: 'translateZ(0)', // Hardware acceleration
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 2, 
              py: 2,
              transform: 'translateZ(0)', // Hardware acceleration
            }}
          >
            {filters.map(filter => (
              <FilterGroup
                key={filter.key}
                filter={filter}
                selectedValues={selectedFilters[filter.key] || []}
                onChange={handleFilterChangeOptimized}
              />
            ))}
          </Box>
        </Collapse>
      </div>
    </section>
  );
};

export default memo(EnhancedFilterSystem); 