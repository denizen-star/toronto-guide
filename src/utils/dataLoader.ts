import Papa from 'papaparse';

export interface Venue {
  id: number;
  name: string;
  address: string;
  neighborhood: string;
  area: string;
  phone?: string;
  website?: string;
  description?: string;
  lat?: number;
  lng?: number;
}

export interface HappyHour {
  id: string;
  location_id: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
  offerings: string;
  description: string;
  lastUpdated: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  neighborhood: string;
  googleMapUrl?: string;
  latitude?: number;
  longitude?: number;
  lastUpdated: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  locationId: string;
  priceId: string;
  scheduleId: string;
  tags: string[];
  website: string;
  start_date?: string;
  end_date?: string;
  lastUpdated: string;
  city: 'toronto' | 'montreal';
  neighborhood?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  lastUpdated: string;
}

export interface Price {
  id: string;
  type: string;
  amount: string;
  currency: string;
  notes: string;
  lastUpdated: string;
}

export interface Schedule {
  id: string;
  type: 'RECURRING' | 'ONE_TIME';
  startDate: string;
  endDate?: string;
  pattern?: 'WEEKLY' | 'MONTHLY';
  daysOfWeek?: string;
  timeSlots?: string;
  lastUpdated: string;
}

export interface Tag {
  id: string;
  name: string;
  category: string;
  description: string;
  lastUpdated: string;
}

export interface DayTrip {
  id: string;
  title: string;
  description: string;
  image: string;
  season: string;
  distance: string;
  duration: string;
  website: string;
  tags: string[];
  lastUpdated: string;
}

export interface AmateurSport {
  id: string;
  title: string;
  description: string;
  image: string;
  location: string;
  type: string;
  skillLevel: string;
  website: string;
  tags: string[];
  lastUpdated: string;
}

export interface SportingEvent {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  location: string;
  type: string;
  priceRange: string;
  website: string;
  tags: string[];
  lastUpdated: string;
}

export interface SpecialEvent {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  location: string;
  type: string;
  website: string;
  tags: string[];
  lastUpdated: string;
}

// Base interface for all standardized events/activities
export interface StandardizedItem {
  id: string;
  title: string;
  description: string;
  image: string;
  location: string;
  type: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  duration: string;
  activityDetails: string;
  cost: string;
  website: string;
  travelTime: string;
  googleMapLink: string;
  lgbtqFriendly: boolean;
  tags: string[];
  lastUpdated: string;
}

// Specific interfaces extending the base
export interface StandardizedSpecialEvent extends StandardizedItem {
  skillLevel: string;
}

export interface StandardizedSportingEvent extends StandardizedItem {
  skillLevel: string;
  priceRange: string;
}

export interface StandardizedAmateurSport extends StandardizedItem {
  skillLevel: string;
  equipmentNeeded?: string;
  minPlayers?: number;
  maxPlayers?: number;
}

export interface StandardizedDayTrip extends StandardizedItem {
  season: string;
  distance: string;
  difficulty?: string;
  bestTimeToVisit?: string;
}

export interface LgbtEvent extends StandardizedItem {
  eventType: 'performance' | 'social' | 'community' | 'nightlife';
  subcategory: string;
  socialMedia: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  recurring: boolean;
  venueAccessibility?: string;
  pronouns?: string;
  ageRestriction?: string;
}

export interface ScoopItem extends StandardizedItem {
  category: string;
  eventType: string;
  neighborhood: string;
  season: string;
  priceRange: string;
  duration: string;
  source: 'activity' | 'special_event';
}

const DAYS_OF_WEEK = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

export const loadVenues = async (): Promise<Venue[]> => {
  try {
    const response = await fetch('/data/locations.csv');
    if (!response.ok) {
      throw new Error('Failed to load venues data');
    }

    const data = await response.text();
    const { data: parsedData } = Papa.parse(data, {
      header: true,
      skipEmptyLines: true,
      transform: (value, field) => {
        if (field === 'id') {
          return parseInt(value);
        }
        if (field === 'latitude' || field === 'longitude') {
          return value ? parseFloat(value) : undefined;
        }
        return value;
      }
    });

    const venues = parsedData
      .filter((row: any): row is Venue => {
        // Only include venues with IDs >= 1000 (these are actual venues)
        const id = parseInt(row.id);
        return (
          !isNaN(id) &&
          id >= 1000 &&
          typeof row.name === 'string' &&
          row.name.trim() !== '' &&
          typeof row.address === 'string' &&
          row.address.trim() !== '' &&
          typeof row.neighborhood === 'string' &&
          row.neighborhood.trim() !== ''
        );
      })
      .map((row: any) => ({
        ...row,
        area: row.neighborhood, // Use neighborhood as area if not specified
      }));

    return venues;
  } catch (error) {
    console.error('Error loading venues:', error);
    throw error;
  }
};

export const loadHappyHours = async (): Promise<HappyHour[]> => {
  try {
    const response = await fetch('/data/happy_hours.csv');
    if (!response.ok) {
      throw new Error('Failed to load happy hours data');
    }
    
    const csvText = await response.text();
    const { data: parsedData } = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      transform: (value, field) => {
        if (field === 'location_id') {
          return parseInt(value);
        }
        return value;
      }
    });
    
    // Filter out any invalid entries
    const happyHours = parsedData.filter((row: any): row is HappyHour => {
      const locationId = parseInt(row.location_id);
      return (
        !isNaN(locationId) &&
        locationId >= 1000 &&
        typeof row.day_of_week === 'string' &&
        DAYS_OF_WEEK.includes(row.day_of_week) &&
        typeof row.start_time === 'string' &&
        typeof row.end_time === 'string' &&
        typeof row.offerings === 'string' &&
        row.offerings.trim() !== ''
      );
    });

    return happyHours;
  } catch (error) {
    console.error('Error loading happy hours:', error);
    throw error;
  }
};

export const getVenueTags = (venue: Venue, venueHappyHours: HappyHour[]) => {
  const tags: { label: string; color: 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'error' }[] = [];
  
  // Location tags
  tags.push({ label: venue.neighborhood, color: 'primary' });
  tags.push({ label: venue.area, color: 'secondary' });

  // Time-based tags
  const hasLateNightHours = venueHappyHours.some(hh => {
    const endHour = parseInt(hh.end_time.split(':')[0]);
    return endHour >= 22 || endHour < 4; // 10 PM or later
  });
  if (hasLateNightHours) {
    tags.push({ label: 'Late Night', color: 'error' });
  }

  const hasAfternoonHours = venueHappyHours.some(hh => {
    const startHour = parseInt(hh.start_time.split(':')[0]);
    return startHour >= 12 && startHour < 17; // 12 PM to 5 PM
  });
  if (hasAfternoonHours) {
    tags.push({ label: 'Afternoon Specials', color: 'info' });
  }

  // Deal types
  const hasBudgetDeals = venueHappyHours.some(hh => {
    const offerings = hh.offerings.toLowerCase();
    return (
      offerings.includes('$5') ||
      offerings.includes('half price') ||
      offerings.includes('half off') ||
      offerings.includes('50% off') ||
      offerings.includes('2 for 1') ||
      offerings.includes('two for one') ||
      offerings.includes('bogo')
    );
  });
  if (hasBudgetDeals) {
    tags.push({ label: 'Budget Friendly', color: 'success' });
  }

  // Drink categories
  const drinkTypes = new Set<string>();
  venueHappyHours.forEach(hh => {
    const offerings = hh.offerings.toLowerCase();
    if (offerings.includes('cocktail') || offerings.includes('martini')) {
      drinkTypes.add('Cocktails');
    }
    if (offerings.includes('beer') || offerings.includes('draft') || offerings.includes('brew')) {
      drinkTypes.add('Beer');
    }
    if (offerings.includes('wine') || offerings.includes('vino')) {
      drinkTypes.add('Wine');
    }
    if (offerings.includes('sake') || offerings.includes('soju')) {
      drinkTypes.add('Asian Spirits');
    }
    if (offerings.includes('sangria')) {
      drinkTypes.add('Sangria');
    }
  });
  drinkTypes.forEach(type => {
    tags.push({ label: type, color: 'info' });
  });

  // Food categories
  const foodTypes = new Set<string>();
  venueHappyHours.forEach(hh => {
    const offerings = hh.offerings.toLowerCase();
    if (offerings.includes('wings') || offerings.includes('chicken')) {
      foodTypes.add('Wings & Chicken');
    }
    if (offerings.includes('pizza') || offerings.includes('flatbread')) {
      foodTypes.add('Pizza');
    }
    if (offerings.includes('sushi') || offerings.includes('rolls')) {
      foodTypes.add('Sushi');
    }
    if (offerings.includes('taco') || offerings.includes('mexican')) {
      foodTypes.add('Mexican');
    }
    if (offerings.includes('burger') || offerings.includes('sliders')) {
      foodTypes.add('Burgers');
    }
    if (offerings.includes('oyster') || offerings.includes('seafood')) {
      foodTypes.add('Seafood');
    }
    if (offerings.includes('appetizer') || offerings.includes('apps')) {
      foodTypes.add('Appetizers');
    }
  });
  foodTypes.forEach(type => {
    tags.push({ label: type, color: 'warning' });
  });

  // Special features
  const hasLiveMusic = venueHappyHours.some(hh => 
    hh.description.toLowerCase().includes('live music') ||
    hh.description.toLowerCase().includes('dj')
  );
  if (hasLiveMusic) {
    tags.push({ label: 'Live Music', color: 'error' });
  }

  const hasPatioSpecials = venueHappyHours.some(hh => 
    hh.description.toLowerCase().includes('patio') ||
    hh.description.toLowerCase().includes('outdoor') ||
    hh.description.toLowerCase().includes('rooftop')
  );
  if (hasPatioSpecials) {
    tags.push({ label: 'Patio Specials', color: 'success' });
  }

  // Weekend specials
  const hasWeekendHours = venueHappyHours.some(hh =>
    hh.day_of_week === 'SATURDAY' || hh.day_of_week === 'SUNDAY'
  );
  if (hasWeekendHours) {
    tags.push({ label: 'Weekend Happy Hours', color: 'secondary' });
  }

  return tags;
};

export const loadLocations = async (): Promise<Location[]> => {
  try {
    const response = await fetch('/data/locations.csv');
    const csvText = await response.text();
    
    const { data } = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      transform: (value, field) => {
        if (field === 'latitude' || field === 'longitude') {
          // Convert empty strings to undefined, otherwise parse as float
          return value && value.trim() !== '' ? parseFloat(value) : undefined;
        }
        return value;
      }
    });

    // Add default coordinates for locations without them
    return (data as Location[]).map(location => {
      if (!location.latitude || !location.longitude) {
        // Use default coordinates based on neighborhood or address
        if (location.address.toLowerCase().includes('toronto')) {
          location.latitude = 43.6532;
          location.longitude = -79.3832;
        } else if (location.address.toLowerCase().includes('montreal')) {
          location.latitude = 45.5017;
          location.longitude = -73.5673;
        }
      }
      return location;
    });
  } catch (error) {
    console.error('Error loading locations:', error);
    throw error;
  }
};

export const loadActivities = async (): Promise<Activity[]> => {
  try {
    const response = await fetch('/data/activities.csv');
    if (!response.ok) {
      throw new Error('Failed to load activities data');
    }

    const data = await response.text();
    const { data: parsedData } = Papa.parse(data, {
      header: true,
      skipEmptyLines: true,
      delimiter: '|', // Use pipe as delimiter
    });

    return parsedData.map((row: any) => {
      const tags = row.tags ? row.tags.split(',').map((tag: string) => tag.trim()) : [];
      const city = row.city || (parseInt(row.locationId) >= 200 ? 'montreal' : 'toronto');

      return {
        id: row.id,
        title: row.title,
        description: row.description,
        categoryId: row.categoryId,
        locationId: row.locationId,
        priceId: row.priceId,
        scheduleId: row.scheduleId,
        tags,
        website: row.website,
        start_date: row.start_date,
        end_date: row.end_date,
        lastUpdated: row.lastUpdated,
        city,
        neighborhood: row.neighborhood
      };
    });
  } catch (error) {
    console.error('Error loading activities:', error);
    throw error;
  }
};

export const loadCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch('/data/categories.csv');
    const csvText = await response.text();
    
    const { data } = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });
    
    return data as Category[];
  } catch (error) {
    console.error('Error loading categories:', error);
    throw error;
  }
};

export const loadPrices = async (): Promise<Price[]> => {
  try {
    const response = await fetch('/data/prices.csv');
    const csvText = await response.text();
    
    const { data } = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });
    
    return data as Price[];
  } catch (error) {
    console.error('Error loading prices:', error);
    throw error;
  }
};

export const loadSchedules = async (): Promise<Schedule[]> => {
  try {
    const response = await fetch('/data/schedules.csv');
    const csvText = await response.text();
    
    const { data } = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });
    
    return data as Schedule[];
  } catch (error) {
    console.error('Error loading schedules:', error);
    throw error;
  }
};

export const isRecurringEvent = (activity: Activity, schedules: { [key: string]: Schedule }): boolean => {
  const schedule = schedules[activity.scheduleId];
  return schedule?.type === 'RECURRING';
};

export const getEventDate = (activity: Activity, schedules: { [key: string]: Schedule }): Date | null => {
  const schedule = schedules[activity.scheduleId];
  if (!schedule) return null;
  
  if (schedule.type === 'ONE_TIME') {
    return new Date(schedule.startDate);
  }
  return null;
};

export const getEventTimeSlot = (activity: Activity, schedules: { [key: string]: Schedule }): string | null => {
  const schedule = schedules[activity.scheduleId];
  return schedule?.timeSlots || null;
};

export const getDaysOfWeek = (activity: Activity, schedules: { [key: string]: Schedule }): string[] => {
  const schedule = schedules[activity.scheduleId];
  if (!schedule?.daysOfWeek) return [];
  return schedule.daysOfWeek.split('|');
};

export const loadDayTrips = async (): Promise<DayTrip[]> => {
  try {
    const response = await fetch('/data/day_trips_standardized.csv');
    if (!response.ok) {
      throw new Error('Failed to load day trips data');
    }

    const data = await response.text();
    const { data: parsedData } = Papa.parse(data, {
      header: true,
      skipEmptyLines: true,
      delimiter: '|',
    });

    return parsedData.map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      image: row.image || `https://source.unsplash.com/random/?nature,${encodeURIComponent(row.title)}`,
      season: row.bestTimeToVisit || row.season || 'Year-round', // Use bestTimeToVisit if available, fallback to season
      distance: row.travelTime || row.distance || 'N/A', // Use travelTime as distance
      duration: row.duration || 'Full day',
      website: row.website || '',
      tags: row.tags ? row.tags.split(',').map((tag: string) => tag.trim()) : [],
      lastUpdated: row.lastUpdated || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error loading day trips:', error);
    throw error;
  }
};

export const loadAmateurSports = async (): Promise<AmateurSport[]> => {
  try {
    const response = await fetch('/data/amateur_sports_standardized.csv');
    if (!response.ok) {
      throw new Error('Failed to load amateur sports data');
    }

    const data = await response.text();
    const { data: parsedData } = Papa.parse(data, {
      header: true,
      skipEmptyLines: true,
      delimiter: '|',
    });

    return parsedData.map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      image: row.image || `https://source.unsplash.com/random/?${encodeURIComponent(row.type)},sports`,
      location: row.location,
      type: row.type,
      skillLevel: row.skillLevel,
      website: row.website || '',
      tags: row.tags ? row.tags.split(',').map((tag: string) => tag.trim()) : [],
      lastUpdated: row.lastUpdated || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error loading amateur sports:', error);
    throw error;
  }
};

export const loadSportingEvents = async (): Promise<SportingEvent[]> => {
  try {
    const response = await fetch('/data/sporting_events_standardized.csv');
    if (!response.ok) {
      throw new Error('Failed to load sporting events data');
    }

    const data = await response.text();
    const { data: parsedData } = Papa.parse(data, {
      header: true,
      skipEmptyLines: true,
      delimiter: '|',
    });

    return parsedData.map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      image: row.image || `https://source.unsplash.com/random/?${encodeURIComponent(row.type)},stadium`,
      date: row.startDate || row.date || new Date().toISOString(), // Use startDate if available, fallback to date
      location: row.location,
      type: row.type,
      priceRange: row.cost || 'Contact venue for pricing', // Use cost field as priceRange
      website: row.website || '',
      tags: row.tags ? row.tags.split(',').map((tag: string) => tag.trim()) : [],
      lastUpdated: row.lastUpdated || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error loading sporting events:', error);
    throw error;
  }
};

export const loadSpecialEvents = async (): Promise<SpecialEvent[]> => {
  try {
    const response = await fetch('/data/special_events_standardized.csv');
    if (!response.ok) {
      throw new Error('Failed to load special events data');
    }

    const data = await response.text();
    const { data: parsedData } = Papa.parse(data, {
      header: true,
      skipEmptyLines: true,
      delimiter: '|',
    });

    return parsedData.map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      image: row.image || `https://source.unsplash.com/random/?${encodeURIComponent(row.type)},festival`,
      date: row.startDate || row.date || new Date().toISOString(), // Use startDate if available, fallback to date
      location: row.location,
      type: row.type,
      website: row.website || '',
      tags: row.tags ? row.tags.split(',').map((tag: string) => tag.trim()) : [],
      lastUpdated: row.lastUpdated || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error loading special events:', error);
    throw error;
  }
};

// Load standardized special events
export const loadStandardizedSpecialEvents = async (): Promise<StandardizedSpecialEvent[]> => {
  try {
    const response = await fetch('/data/special_events_standardized.csv');
    const csvText = await response.text();
    
    const { data } = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      transform: (value, field) => {
        if (field === 'tags') {
          return value.split(',').map((tag: string) => tag.trim());
        }
        if (field === 'lgbtqFriendly') {
          return value.toLowerCase() === 'yes';
        }
        return value;
      }
    });
    
    return data as StandardizedSpecialEvent[];
  } catch (error) {
    console.error('Error loading standardized special events:', error);
    throw error;
  }
};

// Load standardized sporting events
export const loadStandardizedSportingEvents = async (): Promise<StandardizedSportingEvent[]> => {
  try {
    const response = await fetch('/data/sporting_events_standardized.csv');
    const csvText = await response.text();
    
    const { data } = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      transform: (value, field) => {
        if (field === 'tags') {
          return value.split(',').map((tag: string) => tag.trim());
        }
        if (field === 'lgbtqFriendly') {
          return value.toLowerCase() === 'yes';
        }
        return value;
      }
    });
    
    return data as StandardizedSportingEvent[];
  } catch (error) {
    console.error('Error loading standardized sporting events:', error);
    throw error;
  }
};

// Load standardized amateur sports
export const loadStandardizedAmateurSports = async (): Promise<StandardizedAmateurSport[]> => {
  try {
    const response = await fetch('/data/amateur_sports_standardized.csv');
    const csvText = await response.text();
    
    const { data } = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      transform: (value, field) => {
        if (field === 'tags') {
          return value.split(',').map((tag: string) => tag.trim());
        }
        if (field === 'lgbtqFriendly') {
          return value.toLowerCase() === 'yes';
        }
        if (field === 'minPlayers' || field === 'maxPlayers') {
          return value ? parseInt(value) : undefined;
        }
        return value;
      }
    });
    
    return data as StandardizedAmateurSport[];
  } catch (error) {
    console.error('Error loading standardized amateur sports:', error);
    throw error;
  }
};

// Load standardized day trips
export const loadStandardizedDayTrips = async (): Promise<StandardizedDayTrip[]> => {
  try {
    const response = await fetch('/data/day_trips_standardized.csv');
    const csvText = await response.text();
    
    const { data } = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      transform: (value, field) => {
        if (field === 'tags') {
          return value.split(',').map((tag: string) => tag.trim());
        }
        if (field === 'lgbtqFriendly') {
          return value.toLowerCase() === 'yes';
        }
        return value;
      }
    });
    
    return data as StandardizedDayTrip[];
  } catch (error) {
    console.error('Error loading standardized day trips:', error);
    throw error;
  }
};

export const loadLgbtEvents = async (): Promise<LgbtEvent[]> => {
  try {
    const response = await fetch('/data/lgbt_events_standardized.csv');
    if (!response.ok) {
      throw new Error(`Failed to load LGBTQ+ events data: ${response.statusText}`);
    }

    const csvText = await response.text();
    const { data, errors } = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      delimiter: '|',
      transform: (value, field) => {
        if (field === 'tags') {
          return value ? value.split(',').map((tag: string) => tag.trim()) : [];
        }
        if (field === 'lgbtqFriendly') {
          return true; // All events in this category are LGBTQ+ friendly
        }
        if (field === 'socialMedia') {
          try {
            return value ? JSON.parse(value) : { instagram: '', facebook: '', twitter: '' };
          } catch {
            console.warn('Invalid social media JSON format, defaulting to empty object');
            return { instagram: '', facebook: '', twitter: '' };
          }
        }
        if (field === 'recurring') {
          return value ? value.toLowerCase() === 'yes' || value.toLowerCase() === 'true' : false;
        }
        if (field === 'eventType') {
          const type = (value || '').toLowerCase();
          if (!['performance', 'social', 'community', 'nightlife'].includes(type)) {
            console.warn(`Invalid event type: ${value}, defaulting to 'social'`);
            return 'social';
          }
          return type;
        }
        return value || ''; // Convert null/undefined to empty string
      }
    });

    // Log parsing errors if any
    if (errors.length > 0) {
      console.warn('CSV parsing errors:', errors);
    }

    // Validate and clean data
    const validatedData = (data as LgbtEvent[]).filter(event => {
      const isValid = 
        event.id &&
        event.title &&
        event.description &&
        event.location &&
        event.eventType &&
        ['performance', 'social', 'community', 'nightlife'].includes(event.eventType);

      if (!isValid) {
        console.warn('Invalid event data:', event);
      }

      return isValid;
    }).map(event => ({
      ...event,
      // Ensure all required fields have default values
      image: event.image || `https://source.unsplash.com/random/?${encodeURIComponent(event.eventType)},lgbtq`,
      tags: event.tags || [],
      lastUpdated: event.lastUpdated || new Date().toISOString(),
      socialMedia: event.socialMedia || { instagram: '', facebook: '', twitter: '' },
      recurring: !!event.recurring,
      lgbtqFriendly: true,
      startDate: event.startDate || new Date().toISOString(),
      endDate: event.endDate || '',
      registrationDeadline: event.registrationDeadline || '',
      duration: event.duration || '',
      activityDetails: event.activityDetails || '',
      cost: event.cost || '',
      website: event.website || '',
      travelTime: event.travelTime || '',
      googleMapLink: event.googleMapLink || ''
    }));

    return validatedData;
  } catch (error) {
    console.error('Error loading LGBTQ+ events:', error);
    throw new Error(`Failed to load LGBTQ+ events: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const loadTags = async (): Promise<Tag[]> => {
  try {
    const response = await fetch('/data/tags.csv');
    if (!response.ok) {
      throw new Error('Failed to load tags data');
    }

    const csvText = await response.text();
    const { data } = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });
    
    return data as Tag[];
  } catch (error) {
    console.error('Error loading tags:', error);
    throw error;
  }
};

export const loadScoopItems = async (): Promise<ScoopItem[]> => {
  try {
    console.log('Starting to load scoop items...');
    const response = await fetch('/data/scoop_standardized.csv');
    
    if (!response.ok) {
      console.error('Failed to fetch scoop items:', response.statusText);
      throw new Error('Failed to load scoop items data');
    }

    const data = await response.text();
    const { data: parsedData, errors } = Papa.parse(data, {
      header: true,
      skipEmptyLines: true,
      delimiter: ',',
      transformHeader: (header) => header.trim(),
      transform: (value) => value.trim()
    });

    if (errors.length > 0) {
      console.warn('CSV parsing warnings:', errors);
    }

    if (!Array.isArray(parsedData)) {
      console.error('Parsed data is not an array');
      throw new Error('Invalid data format');
    }

    // Transform and validate the data
    const transformedData = parsedData
      .filter(item => item && typeof item === 'object')
      .map((item: any) => {
        // Clean and validate each field
        const cleanedItem = {
          id: item.id?.toString() || generateUniqueId(),
          title: item.title?.trim() || 'Untitled Event',
          description: item.description?.trim() || 'No description available',
          image: item.image || 'https://source.unsplash.com/random/?event',
          location: item.location?.trim() || 'Toronto',
          type: item.type || 'general',
          startDate: item.startDate || null,
          endDate: item.endDate || null,
          registrationDeadline: item.registrationDeadline || null,
          duration: item.duration?.trim() || 'varies',
          activityDetails: item.activityDetails?.trim() || item.description?.trim() || 'No details available',
          cost: item.cost || 'Contact for pricing',
          website: item.website?.trim() || '#',
          travelTime: item.travelTime || null,
          googleMapLink: item.googleMapLink || null,
          lgbtqFriendly: item.lgbtqFriendly === 'true' || false,
          tags: processTags(item.tags),
          lastUpdated: item.lastUpdated || new Date().toISOString(),
          category: item.category || 'general',
          eventType: item.eventType || 'activity',
          neighborhood: item.neighborhood?.trim() || '',
          season: item.season || 'year-round',
          priceRange: item.priceRange || 'varies',
          source: item.source || 'activity'
        };

        return cleanedItem;
      });

    console.log(`Successfully transformed ${transformedData.length} items`);
    return transformedData;
  } catch (error) {
    console.error('Error in loadScoopItems:', error);
    throw error;
  }
};

// Helper function to process tags
const processTags = (tags: any): string[] => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.filter(tag => tag && typeof tag === 'string');
  if (typeof tags === 'string') {
    return tags.split(',').map(tag => tag.trim()).filter(Boolean);
  }
  return [];
};

// Helper function to generate a unique ID
const generateUniqueId = (): string => {
  return 'sc' + Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Helper functions for standardization
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getSeason = (event: StandardizedSpecialEvent): string => {
  const description = event.description.toLowerCase();
  const startDate = new Date(event.startDate);
  const month = startDate.getMonth();

  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  if (month >= 11 || month <= 1) return 'winter';

  if (description.includes('winter')) return 'winter';
  if (description.includes('spring')) return 'spring';
  if (description.includes('summer')) return 'summer';
  if (description.includes('fall') || description.includes('autumn')) return 'fall';
  
  return 'year-round';
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getPriceRange = (event: StandardizedSpecialEvent): string => {
  const cost = event.cost.toLowerCase();
  const priceMatch = cost.match(/\$(\d+)/);
  
  if (cost.includes('free')) return 'free';
  if (priceMatch && parseInt(priceMatch[1]) <= 25) return 'budget';
  if (priceMatch && parseInt(priceMatch[1]) <= 75) return 'moderate';
  if (priceMatch && parseInt(priceMatch[1]) <= 150) return 'premium';
  if (priceMatch && parseInt(priceMatch[1]) > 150) return 'luxury';
  
  return 'varies';
}; 