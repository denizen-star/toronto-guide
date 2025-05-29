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

const DAYS_OF_WEEK = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

const validateVenue = (venue: Partial<Venue>): venue is Venue => {
  return (
    typeof venue.id === 'number' &&
    typeof venue.name === 'string' &&
    venue.name.trim() !== '' &&
    typeof venue.address === 'string' &&
    venue.address.trim() !== '' &&
    typeof venue.neighborhood === 'string' &&
    venue.neighborhood.trim() !== '' &&
    typeof venue.area === 'string' &&
    venue.area.trim() !== ''
  );
};

const validateHappyHour = (happyHour: Partial<HappyHour>): happyHour is HappyHour => {
  return (
    typeof happyHour.id === 'string' &&
    typeof happyHour.location_id === 'number' &&
    typeof happyHour.day_of_week === 'string' &&
    DAYS_OF_WEEK.includes(happyHour.day_of_week) &&
    typeof happyHour.start_time === 'string' &&
    /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(happyHour.start_time) &&
    typeof happyHour.end_time === 'string' &&
    /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(happyHour.end_time) &&
    typeof happyHour.offerings === 'string' &&
    happyHour.offerings.trim() !== '' &&
    typeof happyHour.description === 'string'
  );
};

const parseCSVLine = (line: string): string[] => {
  const values: string[] = [];
  let currentValue = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === ',' && !insideQuotes) {
      values.push(currentValue.trim());
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  values.push(currentValue.trim());
  return values;
};

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