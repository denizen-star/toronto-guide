import React, { useMemo, useCallback, useState } from 'react';
import { 
  Box, 
  Chip, 
  Button, 
  Typography, 
  Collapse,
  IconButton,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import { 
  Clear, 
  FilterList, 
  ExpandMore, 
  ExpandLess,
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
    <section className={`filter-section ${className}`} style={{
      backgroundColor: 'var(--color-warm-taupe)',
      borderTop: '1px solid var(--color-soft-gray)',
      borderBottom: '1px solid var(--color-soft-gray)',
    }}>
      <div className="swiss-container">
        {/* Compact Filter Header */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 1.5,
          minHeight: '48px'
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

        {/* Compact Filter Bubbles - Always Visible When Active */}
        {filterBubbles.length > 0 && (
          <Box sx={{
            pb: isExpanded ? 1.5 : 2,
            transition: 'padding-bottom 0.2s ease'
          }}>
            <Box sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 0.75,
              p: 1.5,
              backgroundColor: 'white',
              borderRadius: '6px',
              border: '1px solid var(--color-soft-gray)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              {filterBubbles.map((bubble, index) => (
                <Chip
                  key={`${bubble.filterKey}-${bubble.value}`}
                  label={bubble.label}
                  onDelete={() => handleRemoveFilterItem(bubble.filterKey, bubble.value)}
                  deleteIcon={<Clear fontSize="small" />}
                  size="small"
                  sx={{
                    backgroundColor: 'var(--color-warm-taupe)',
                    border: '1px solid var(--color-soft-gray)',
                    fontSize: '11px',
                    fontFamily: 'var(--font-primary)',
                    fontWeight: 'var(--weight-medium)',
                    height: '24px',
                    '& .MuiChip-label': {
                      px: 1
                    },
                    '& .MuiChip-deleteIcon': {
                      color: 'var(--color-deep-slate)',
                      fontSize: '14px',
                      '&:hover': {
                        color: 'var(--color-elegant-coral)'
                      }
                    },
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08)
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Collapsible Filter Controls */}
        <Collapse in={isExpanded} timeout={200}>
          <Box sx={{ pb: 2 }}>
            {/* Compact Swiss Grid Layout */}
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)'
              },
              gap: 1.5,
              mt: 1
            }}>
              {filters.map((filter, index) => (
                <Box
                  key={filter.key}
                  sx={{
                    '& .MuiFormControl-root': {
                      '& .MuiInputLabel-root': {
                        fontSize: '12px',
                        fontWeight: 'var(--weight-medium)',
                        fontFamily: 'var(--font-primary)',
                        color: 'var(--color-deep-slate)',
                        '&.Mui-focused': {
                          color: 'var(--color-charcoal)'
                        }
                      },
                      '& .MuiOutlinedInput-root': {
                        fontSize: '13px',
                        fontFamily: 'var(--font-primary)',
                        backgroundColor: 'white',
                        minHeight: '36px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'var(--color-soft-gray)',
                          borderWidth: '1px'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'var(--color-accent-sage)'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'var(--color-charcoal)',
                          borderWidth: '1px'
                        }
                      },
                      '& .MuiChip-root': {
                        fontSize: '11px',
                        height: '20px',
                        fontFamily: 'var(--font-primary)'
                      }
                    }
                  }}
                >
                  <MultiSelectFilter
                    label={filter.label}
                    options={filter.options}
                    selectedValues={selectedFilters[filter.key] || []}
                    onChange={(values) => handleFilterChangeOptimized(filter.key, values)}
                    placeholder={filter.placeholder}
                  />
                </Box>
              ))}
            </Box>

            {/* Swiss Typography Divider */}
            <Divider sx={{
              mt: 2,
              borderColor: 'var(--color-soft-gray)',
              opacity: 0.6
            }} />

            {/* Compact Action Bar */}
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 1.5
            }}>
              <Typography
                variant="caption"
                sx={{
                  fontSize: '11px',
                  color: 'var(--color-deep-slate)',
                  fontFamily: 'var(--font-primary)',
                  fontWeight: 'var(--weight-medium)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                {totalSelectedItems > 0 ? `${totalSelectedItems} filter${totalSelectedItems === 1 ? '' : 's'} active` : 'No filters applied'}
              </Typography>

              <Button
                onClick={handleToggleExpanded}
                size="small"
                sx={{
                  color: 'var(--color-deep-slate)',
                  fontSize: '11px',
                  fontWeight: 'var(--weight-medium)',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-primary)',
                  letterSpacing: '0.025em',
                  minHeight: '24px',
                  px: 1,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.04)
                  }
                }}
              >
                Collapse
              </Button>
            </Box>
          </Box>
        </Collapse>
      </div>
    </section>
  );
};

export default React.memo(EnhancedFilterSystem); 