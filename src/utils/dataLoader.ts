import Papa from 'papaparse';
import { MapMode } from '../types/mapTypes';
import { MapItem } from '../types/mapTypes';

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

export interface DayTrip {
  id: string;
  title: string;
  description: string;
  image: string;
  season: string;
  distance: string;
  duration: string;
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

const DAYS_OF_WEEK = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

export const loadVenues = async (): Promise<Venue[]> => {
  try {
    const response = await fetch('/tovibes/data/locations.csv');
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
    const response = await fetch('/tovibes/data/happy_hours.csv');
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
    const response = await fetch('/tovibes/data/locations.csv');
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
    const response = await fetch('/tovibes/data/activities.csv');
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
      const tags = row.tags.split(',').map((tag: string) => tag.trim());
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
    const response = await fetch('/tovibes/data/categories.csv');
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
    const response = await fetch('/tovibes/data/prices.csv');
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
    const response = await fetch('/tovibes/data/schedules.csv');
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
    const response = await fetch('/tovibes/data/day_trips.csv');
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
      image: row.image || `https://source.unsplash.com/random/?${encodeURIComponent(row.title)}`,
      season: row.season,
      distance: row.distance,
      duration: row.duration,
      tags: row.tags.split(',').map((tag: string) => tag.trim()),
      lastUpdated: row.lastUpdated || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error loading day trips:', error);
    throw error;
  }
};

export const loadAmateurSports = async (): Promise<AmateurSport[]> => {
  try {
    const response = await fetch('/tovibes/data/amateur_sports.csv');
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
      tags: row.tags.split(',').map((tag: string) => tag.trim()),
      lastUpdated: row.lastUpdated || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error loading amateur sports:', error);
    throw error;
  }
};

export const loadSportingEvents = async (): Promise<SportingEvent[]> => {
  try {
    const response = await fetch('/tovibes/data/sporting_events.csv');
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
      date: row.date,
      location: row.location,
      type: row.type,
      priceRange: row.priceRange,
      tags: row.tags.split(',').map((tag: string) => tag.trim()),
      lastUpdated: row.lastUpdated || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error loading sporting events:', error);
    throw error;
  }
};

export const loadSpecialEvents = async (): Promise<SpecialEvent[]> => {
  try {
    const response = await fetch('/tovibes/data/special_events.csv');
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
      date: row.date,
      location: row.location,
      type: row.type,
      tags: row.tags.split(',').map((tag: string) => tag.trim()),
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
    const response = await fetch('/tovibes/data/special_events_standardized.csv');
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
    const response = await fetch('/tovibes/data/sporting_events_standardized.csv');
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
    const response = await fetch('/tovibes/data/amateur_sports_standardized.csv');
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
    const response = await fetch('/tovibes/data/day_trips_standardized.csv');
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

// Helper function to convert standardized items to map items
export const standardizedToMapItem = (item: StandardizedItem, type: MapMode): MapItem => {
  // Extract latitude and longitude from Google Maps link if available
  let lat: number | undefined;
  let lng: number | undefined;
  
  if (item.googleMapLink && item.googleMapLink !== 'N/A') {
    const match = item.googleMapLink.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) {
      lat = parseFloat(match[1]);
      lng = parseFloat(match[2]);
    }
  }
  
  return {
    id: item.id,
    name: item.title,
    address: item.location,
    neighborhood: item.travelTime.split('(')[0].trim(),
    lat,
    lng,
    type
  };
}; 