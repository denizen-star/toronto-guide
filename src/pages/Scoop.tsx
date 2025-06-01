import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Grid, Typography, CircularProgress, Container, Button } from '@mui/material';
import { 
  loadScoopItems,
  type ScoopItem
} from '../utils/dataLoader';
import EnhancedMinimalistCard from '../components/MinimalistCard';
import EnhancedFilterSystem, { FilterConfig } from '../components/EnhancedFilterSystem';
import { useSearch } from '../components/Layout';
import { 
  Palette, 
  MusicNote, 
  TheaterComedy, 
  Restaurant,
  Festival,
  EventNote,
  Museum,
  LocalActivity,
  Explore
} from '@mui/icons-material';

// Memoized icon map for all types
const iconMap: { [key: string]: React.ReactNode } = {
  'art': <Palette />,
  'music': <MusicNote />,
  'theater': <TheaterComedy />,
  'food': <Restaurant />,
  'festival': <Festival />,
  'cultural': <EventNote />,
  'museum': <Museum />,
  'activity': <LocalActivity />,
  'outdoor': <Explore />
};

const Scoop = () => {
  const { searchTerm, setSearchPlaceholder } = useSearch();
  const [scoopItems, setScoopItems] = useState<ScoopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(12);
  
  // Enhanced filter states
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    setSearchPlaceholder('Search activities and events...');
  }, [setSearchPlaceholder]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const items = await loadScoopItems();
        console.log('Loaded items:', items);
        setScoopItems(items);
        setLoading(false);
      } catch (err) {
        console.error('Error loading scoop items:', err);
        setError('Failed to load items. Please try again later.');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getIconForItem = useCallback((item: ScoopItem): React.ReactNode => {
    return iconMap[item.category.toLowerCase()] || iconMap['activity'];
  }, []);

  // Create filter configurations
  const filterConfigs: FilterConfig[] = useMemo(() => {
    const categoryOptions = [
      { value: 'art', label: 'Art & Exhibitions' },
      { value: 'music', label: 'Music & Concerts' },
      { value: 'theater', label: 'Theater & Performance' },
      { value: 'food', label: 'Food & Wine' },
      { value: 'festival', label: 'Festivals' },
      { value: 'cultural', label: 'Cultural Events' },
      { value: 'museum', label: 'Museums' },
      { value: 'outdoor', label: 'Outdoor Activities' }
    ];

    const neighborhoodOptions = [
      { value: 'downtown', label: 'Downtown' },
      { value: 'harbourfront', label: 'Harbourfront' },
      { value: 'distillery', label: 'Distillery District' },
      { value: 'queen-west', label: 'Queen West' },
      { value: 'yorkville', label: 'Yorkville' },
      { value: 'kensington', label: 'Kensington Market' },
      { value: 'beaches', label: 'The Beaches' }
    ];

    const eventTypeOptions = [
      { value: 'exhibition', label: 'Exhibitions' },
      { value: 'concert', label: 'Concerts' },
      { value: 'workshop', label: 'Workshops' },
      { value: 'festival', label: 'Festivals' },
      { value: 'performance', label: 'Performances' },
      { value: 'class', label: 'Classes' },
      { value: 'tour', label: 'Tours' },
      { value: 'activity', label: 'Activities' }
    ];

    const seasonOptions = [
      { value: 'spring', label: 'Spring' },
      { value: 'summer', label: 'Summer' },
      { value: 'fall', label: 'Fall' },
      { value: 'winter', label: 'Winter' },
      { value: 'year-round', label: 'Year Round' }
    ];

    const durationOptions = [
      { value: 'short', label: 'Short (1-2 hours)' },
      { value: 'medium', label: 'Medium (2-4 hours)' },
      { value: 'half-day', label: 'Half Day (4-6 hours)' },
      { value: 'full-day', label: 'Full Day (6+ hours)' },
      { value: 'multi-day', label: 'Multi-Day' },
      { value: 'varies', label: 'Varies' }
    ];

    const priceRangeOptions = [
      { value: 'free', label: 'Free' },
      { value: 'budget', label: 'Budget ($0-25)' },
      { value: 'moderate', label: 'Moderate ($25-75)' },
      { value: 'premium', label: 'Premium ($75-150)' },
      { value: 'luxury', label: 'Luxury ($150+)' },
      { value: 'varies', label: 'Varies' }
    ];

    const sourceOptions = [
      { value: 'activity', label: 'Regular Activities' },
      { value: 'special_event', label: 'Special Events' }
    ];

    // Get unique tags from items
    const allTags = scoopItems.reduce((tags: Set<string>, item) => {
      item.tags.forEach(tag => tags.add(tag));
      return tags;
    }, new Set<string>());

    const tagOptions = Array.from(allTags).map(tag => ({
      value: tag,
      label: tag.charAt(0).toUpperCase() + tag.slice(1)
    }));

    return [
      {
        id: 'category',
        key: 'category',
        label: 'Category',
        placeholder: 'Select categories',
        options: categoryOptions
      },
      {
        id: 'neighborhood',
        key: 'neighborhood',
        label: 'Neighborhood',
        placeholder: 'Select neighborhoods',
        options: neighborhoodOptions
      },
      { 
        id: 'eventType',
        key: 'eventType',
        label: 'Event Type',
        options: eventTypeOptions,
        placeholder: 'All Event Types'
      },
      { 
        id: 'season',
        key: 'season',
        label: 'Season',
        options: seasonOptions,
        placeholder: 'All Seasons'
      },
      { 
        id: 'duration',
        key: 'duration',
        label: 'Duration',
        options: durationOptions,
        placeholder: 'Any Duration'
      },
      { 
        id: 'priceRange',
        key: 'priceRange',
        label: 'Price Range',
        options: priceRangeOptions,
        placeholder: 'Any Price'
      },
      { 
        id: 'source',
        key: 'source',
        label: 'Source',
        options: sourceOptions,
        placeholder: 'All Sources'
      },
      { 
        id: 'tags',
        key: 'tags',
        label: 'Tags',
        options: tagOptions,
        placeholder: 'All Tags'
      }
    ];
  }, [scoopItems]);

  // Filter items based on selected filters and search term
  const filteredItems = useMemo(() => {
    if (!scoopItems) return [];

    return scoopItems.filter(item => {
      // Apply search term filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          item.title.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          item.tags.some(tag => tag.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      // Apply other filters
      for (const [filterId, selectedValues] of Object.entries(selectedFilters)) {
        if (selectedValues.length === 0) continue;

        const itemValue = item[filterId as keyof ScoopItem]?.toString().toLowerCase();
        if (!itemValue) return false;

        const matches = selectedValues.some(value =>
          itemValue.includes(value.toLowerCase())
        );
        if (!matches) return false;
      }
      return true;
    });
  }, [scoopItems, selectedFilters, searchTerm]);

  // Handle filter changes
  const handleFilterChange = useCallback((filterId: string, values: string[]) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterId]: values
    }));
  }, []);

  // Handle filter reset
  const handleResetFilters = useCallback(() => {
    setSelectedFilters({});
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Breadcrumb */}
      <section className="breadcrumb">
        <div className="swiss-container">
          <ul className="breadcrumb-list">
            <li><RouterLink to="/" className="breadcrumb-link">Home</RouterLink></li>
            <li>/</li>
            <li>The Scoop</li>
          </ul>
        </div>
      </section>

      {/* Page Header */}
      <section className="page-header">
        <div className="swiss-container">
          <div className="header-content">
            <div>
              <h1 className="page-title">The Scoop</h1>
              <p className="page-subtitle">
                Your comprehensive guide to Toronto's best activities and events. From art exhibitions 
                to food festivals, discover curated experiences that match your interests.
              </p>
            </div>
            <div className="stats-box">
              <div className="stat">
                <div className="stat-number">{filteredItems.length}</div>
                <div className="stat-label">Activity Options</div>
              </div>
              <div className="stat">
                <div className="stat-number">{Object.keys(iconMap).length}</div>
                <div className="stat-label">Categories</div>
              </div>
              <div className="stat">
                <div className="stat-number">7</div>
                <div className="stat-label">Districts</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <EnhancedFilterSystem
          filters={filterConfigs}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
        />

        <Grid container spacing={3} sx={{ mt: 3 }}>
          {filteredItems.slice(0, displayCount).map(item => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <EnhancedMinimalistCard
                data={{
                  id: item.id,
                  title: item.title,
                  description: item.description,
                  website: item.website || '',
                  tags: item.tags || [],
                  priceRange: item.priceRange || 'See details',
                  location: item.location || 'Toronto',
                  address: item.location,
                  neighborhood: item.neighborhood,
                  coordinates: undefined,
                  lgbtqFriendly: item.lgbtqFriendly || false,
                  detailPath: `/${item.source === 'activity' ? 'activity' : 'special-events'}/${item.id}`
                }}
                icon={getIconForItem(item)}
              />
            </Grid>
          ))}
        </Grid>

        {displayCount < filteredItems.length && (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="outlined"
              onClick={() => setDisplayCount(prev => prev + 12)}
            >
              Load More
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Scoop; 