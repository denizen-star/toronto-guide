import React, { useState, useRef, useEffect } from 'react';

interface FilterOption {
  value: string;
  label: string;
}

interface MultiSelectFilterProps {
  label: string;
  options: FilterOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

const MultiSelectFilter: React.FC<MultiSelectFilterProps> = ({
  label,
  options,
  selectedValues,
  onChange,
  placeholder = 'All'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionChange = (value: string, checked: boolean) => {
    let newValues: string[];
    if (checked) {
      newValues = [...selectedValues, value];
    } else {
      newValues = selectedValues.filter(v => v !== value);
    }
    onChange(newValues);
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) {
      return placeholder;
    }
    return `${selectedValues.length} selected`;
  };

  return (
    <div className="filter-group" ref={containerRef}>
      <label className="filter-label">{label}</label>
      <div className="filter-multi-select">
        <div 
          className={`filter-display ${isOpen ? 'active' : ''}`}
          onClick={handleToggle}
        >
          <span className="filter-placeholder">{getDisplayText()}</span>
          {selectedValues.length > 0 && (
            <span className="filter-count">{selectedValues.length}</span>
          )}
          <span className="filter-arrow">{isOpen ? '▲' : '▼'}</span>
        </div>
        
        <div className={`filter-dropdown ${isOpen ? 'active' : ''}`}>
          {options.map((option) => (
            <div key={option.value} className="filter-option">
              <input
                type="checkbox"
                id={`${label}-${option.value}`}
                value={option.value}
                checked={selectedValues.includes(option.value)}
                onChange={(e) => handleOptionChange(option.value, e.target.checked)}
              />
              <label htmlFor={`${label}-${option.value}`}>{option.label}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MultiSelectFilter; 