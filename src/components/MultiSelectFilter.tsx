import React, { useCallback, useMemo } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Checkbox,
  ListItemText,
  OutlinedInput,
  useTheme,
  alpha
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

interface FilterOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface MultiSelectFilterProps {
  label: string;
  options: FilterOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

const ITEM_HEIGHT = 40;
const ITEM_PADDING_TOP = 4;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 6 + ITEM_PADDING_TOP,
      width: 260,
      borderRadius: '6px',
      border: '1px solid var(--color-soft-gray)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      marginTop: '4px'
    },
  },
  anchorOrigin: {
    vertical: 'bottom' as const,
    horizontal: 'left' as const,
  },
  transformOrigin: {
    vertical: 'top' as const,
    horizontal: 'left' as const,
  },
};

const MultiSelectFilter: React.FC<MultiSelectFilterProps> = React.memo(({
  label,
  options,
  selectedValues,
  onChange,
  placeholder = 'All'
}) => {
  const theme = useTheme();
  
  // Memoized selected options for display
  const selectedOptions = useMemo(() => {
    return options.filter(option => selectedValues.includes(option.value));
  }, [options, selectedValues]);

  // Optimized change handler
  const handleChange = useCallback((event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    onChange(typeof value === 'string' ? value.split(',') : value);
  }, [onChange]);

  // Memoized render function for menu items
  const renderMenuItems = useMemo(() => {
    return options.map((option) => (
      <MenuItem
        key={option.value}
        value={option.value}
        disabled={option.disabled}
        sx={{
          fontSize: '13px',
          fontFamily: 'var(--font-primary)',
          py: 0.75,
          px: 1.5,
          minHeight: '36px',
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.04)
          },
          '&.Mui-selected': {
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.12)
            }
          }
        }}
      >
        <Checkbox
          checked={selectedValues.includes(option.value)}
          size="small"
          sx={{
            color: 'var(--color-soft-gray)',
            '&.Mui-checked': {
              color: 'var(--color-charcoal)'
            },
            '& .MuiSvgIcon-root': {
              fontSize: '16px'
            }
          }}
        />
        <ListItemText
          primary={option.label}
          sx={{
            ml: 0.5,
            '& .MuiListItemText-primary': {
              fontSize: '13px',
              fontFamily: 'var(--font-primary)',
              fontWeight: selectedValues.includes(option.value) ? 'var(--weight-medium)' : 'var(--weight-normal)',
              color: option.disabled ? 'var(--color-soft-gray)' : 'var(--color-charcoal)'
            }
          }}
        />
      </MenuItem>
    ));
  }, [options, selectedValues, theme.palette.primary.main]);

  // Memoized render function for selected chips
  const renderValue = useCallback((selected: string[]) => {
    if (selected.length === 0) {
      return (
        <span style={{
          color: 'var(--color-deep-slate)',
          fontSize: '13px',
          fontFamily: 'var(--font-primary)'
        }}>
          {placeholder}
        </span>
      );
    }

    if (selected.length === 1) {
      const option = options.find(opt => opt.value === selected[0]);
      return (
        <span style={{
          color: 'var(--color-charcoal)',
          fontSize: '13px',
          fontFamily: 'var(--font-primary)',
          fontWeight: 'var(--weight-medium)'
        }}>
          {option?.label || selected[0]}
        </span>
      );
    }

    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        <Chip
          label={`${selected.length} selected`}
          size="small"
          sx={{
            height: '20px',
            fontSize: '11px',
            fontFamily: 'var(--font-primary)',
            fontWeight: 'var(--weight-medium)',
            backgroundColor: 'var(--color-accent-sage)',
            color: 'white',
            '& .MuiChip-label': {
              px: 1
            }
          }}
        />
      </Box>
    );
  }, [options, placeholder]);

  return (
    <FormControl 
      fullWidth 
      size="small"
      sx={{
        '& .MuiFormLabel-root': {
          fontSize: '12px',
          fontFamily: 'var(--font-primary)',
          fontWeight: 'var(--weight-medium)',
          color: 'var(--color-deep-slate)',
          transform: 'translate(12px, 9px) scale(1)',
          '&.MuiInputLabel-shrink': {
            transform: 'translate(12px, -6px) scale(0.85)',
            fontSize: '11px',
            fontWeight: 'var(--weight-semibold)',
            letterSpacing: '0.025em',
            textTransform: 'uppercase'
          },
          '&.Mui-focused': {
            color: 'var(--color-charcoal)'
          }
        }
      }}
    >
      <InputLabel id={`${label}-label`}>{label}</InputLabel>
      <Select
        labelId={`${label}-label`}
        multiple
        value={selectedValues}
        onChange={handleChange}
        input={
          <OutlinedInput 
            label={label}
            sx={{
              fontSize: '13px',
              fontFamily: 'var(--font-primary)',
              backgroundColor: 'white',
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
            }}
          />
        }
        renderValue={renderValue}
        MenuProps={MenuProps}
        sx={{
          minHeight: '36px',
          '& .MuiSelect-select': {
            py: 1,
            display: 'flex',
            alignItems: 'center'
          },
          '& .MuiSelect-icon': {
            color: 'var(--color-deep-slate)',
            fontSize: '18px'
          }
        }}
      >
        {renderMenuItems}
      </Select>
    </FormControl>
  );
});

MultiSelectFilter.displayName = 'MultiSelectFilter';

export default MultiSelectFilter; 