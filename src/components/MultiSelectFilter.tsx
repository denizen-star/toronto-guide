import React, { useCallback, useMemo } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  useTheme,
  alpha
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectFilterProps {
  label: string;
  options: Option[];
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
  placeholder = 'Select options...'
}) => {
  const theme = useTheme();
  
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
              color: 'var(--color-charcoal)'
            }
          }}
        />
      </MenuItem>
    ));
  }, [options, selectedValues, theme.palette.primary.main]);

  // Memoized render function for selected chips
  const renderValue = useCallback((selected: string[]) => {
    if (selected.length === 0) {
      return placeholder;
    }
    return selected
      .map(value => options.find(option => option.value === value)?.label || value)
      .join(', ');
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