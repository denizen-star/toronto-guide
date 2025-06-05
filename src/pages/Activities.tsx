import React, { useState, useMemo } from 'react';
import { useSearch } from '../components/Layout';
import { Activity } from '../utils/dataLoader';

interface FilterState {
  category: string[];
  tags: string[];
}

const Activities: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const { searchTerm } = useSearch();
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    category: [],
    tags: []
  });

  // Memoized filtering logic
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      // Search filter
      const matchesSearch = !searchTerm || 
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (activity.neighborhood && activity.neighborhood.toLowerCase().includes(searchTerm.toLowerCase()));

      // Category filter
      const matchesCategory = selectedFilters.category.length === 0 || 
        selectedFilters.category.includes(activity.categoryId);

      // Tags filter
      const matchesTags = selectedFilters.tags.length === 0 || 
        selectedFilters.tags.some(selectedTag => 
          activity.tags.some(activityTag => 
            activityTag.toLowerCase().replace(/\s+/g, '-') === selectedTag
          )
        );

      return matchesSearch && matchesCategory && matchesTags;
    });
  }, [activities, searchTerm, selectedFilters]);

  return (
    <div>
      {/* Component content */}
    </div>
  );
};

export default Activities;