import React, { useState, useMemo } from 'react';
import { useSearch } from '../components/Layout';
import { StandardizedSpecialEvent } from '../utils/dataLoader';

interface FilterState {
  category: string[];
  tags: string[];
}

const getCategoryFromTags = (tags: string[]): string => {
  const categoryMap: { [key: string]: string } = {
    'art': 'art',
    'music': 'music',
    'theater': 'theater',
    'food': 'food',
    'festival': 'festival',
    'cultural': 'cultural'
  };

  return tags.find(tag => categoryMap[tag.toLowerCase()]) || 'other';
};

const SpecialEvents: React.FC = () => {
  const [events, setEvents] = useState<StandardizedSpecialEvent[]>([]);
  const { searchTerm } = useSearch();
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    category: [],
    tags: []
  });

  // Memoized filtering logic
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Search filter
      const matchesSearch = !searchTerm || 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      // Category filter
      const matchesCategory = selectedFilters.category.length === 0 || 
        selectedFilters.category.includes(getCategoryFromTags(event.tags));

      // Tags filter
      const matchesTags = selectedFilters.tags.length === 0 || 
        selectedFilters.tags.some(selectedTag => 
          event.tags.some(eventTag => 
            eventTag.toLowerCase().replace(/\s+/g, '-') === selectedTag
          )
        );

      return matchesSearch && matchesCategory && matchesTags;
    });
  }, [events, searchTerm, selectedFilters]);

  return (
    <div>
      {/* Component content */}
    </div>
  );
};

export default SpecialEvents;