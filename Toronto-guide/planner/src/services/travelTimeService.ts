import { ScheduleItem } from '../types';

export interface TravelTime {
  duration: number; // minutes
  distance: number; // kilometers
  mode: 'driving' | 'walking' | 'transit' | 'cycling';
  route: string;
}

export interface LocationData {
  address: string;
  neighborhood: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  accessibilityInfo?: string;
  parkingInfo?: string;
  transitInfo?: string;
}

export class TravelTimeService {
  private static readonly GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'demo_key';
  
  // Toronto location database
  private static readonly TORONTO_LOCATIONS: Record<string, LocationData> = {
    'Home': {
      address: '4909 - 45 Charles St E, Toronto, ON',
      neighborhood: 'Rosedale',
      coordinates: { lat: 43.6756, lng: -79.3831 },
      accessibilityInfo: 'Elevator access',
      parkingInfo: 'Underground parking available',
      transitInfo: 'Bay Station (5 min walk)'
    },
    'Home Office': {
      address: '4909 - 45 Charles St E, Toronto, ON',
      neighborhood: 'Rosedale',
      coordinates: { lat: 43.6756, lng: -79.3831 },
      accessibilityInfo: 'Elevator access',
      parkingInfo: 'Underground parking available',
      transitInfo: 'Bay Station (5 min walk)'
    },
    'Toronto Harbourfront Trail': {
      address: 'Harbourfront Trail, Toronto, ON',
      neighborhood: 'Harbourfront',
      coordinates: { lat: 43.6426, lng: -79.3782 },
      accessibilityInfo: 'Paved trail, wheelchair accessible',
      parkingInfo: 'Street parking available',
      transitInfo: 'Union Station (10 min walk)'
    },
    'MaRS Discovery District': {
      address: '661 University Ave, Toronto, ON',
      neighborhood: 'Discovery District',
      coordinates: { lat: 43.6596, lng: -79.3909 },
      accessibilityInfo: 'Full accessibility',
      parkingInfo: 'Paid parking garage',
      transitInfo: 'St. Patrick Station (2 min walk)'
    },
    'St. Basil Catholic Church': {
      address: '50 St Joseph St, Toronto, ON',
      neighborhood: 'Annex',
      coordinates: { lat: 43.6677, lng: -79.3948 },
      accessibilityInfo: 'Wheelchair accessible entrance',
      parkingInfo: 'Limited street parking',
      transitInfo: 'Bay Station (8 min walk)'
    },
    'Financial District': {
      address: 'Bay St & King St, Toronto, ON',
      neighborhood: 'Financial District',
      coordinates: { lat: 43.6481, lng: -79.3809 },
      accessibilityInfo: 'Full accessibility',
      parkingInfo: 'Multiple paid parking options',
      transitInfo: 'King Station (2 min walk)'
    },
    'High Park': {
      address: '1873 Bloor St W, Toronto, ON',
      neighborhood: 'High Park',
      coordinates: { lat: 43.6465, lng: -79.4637 },
      accessibilityInfo: 'Paved paths available',
      parkingInfo: 'Free parking available',
      transitInfo: 'High Park Station (5 min walk)'
    }
  };

  static async calculateTravelTime(
    fromLocation: string, 
    toLocation: string, 
    mode: TravelTime['mode'] = 'driving'
  ): Promise<TravelTime> {
    try {
      // For demo purposes, return calculated travel times
      // In production, uncomment the Google Maps API call below
      
      /*
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?` +
        `origins=${encodeURIComponent(fromLocation)}&` +
        `destinations=${encodeURIComponent(toLocation)}&` +
        `mode=${mode}&` +
        `units=metric&` +
        `key=${this.GOOGLE_MAPS_API_KEY}`
      );
      
      const data = await response.json();
      const element = data.rows[0].elements[0];
      
      if (element.status === 'OK') {
        return {
          duration: Math.ceil(element.duration.value / 60), // Convert to minutes
          distance: element.distance.value / 1000, // Convert to kilometers
          mode,
          route: `${fromLocation} to ${toLocation}`
        };
      }
      */

      // Mock travel time calculation based on Toronto geography
      return this.calculateMockTravelTime(fromLocation, toLocation, mode);
    } catch (error) {
      console.error('Travel time calculation failed:', error);
      return this.calculateMockTravelTime(fromLocation, toLocation, mode);
    }
  }

  private static calculateMockTravelTime(
    fromLocation: string, 
    toLocation: string, 
    mode: TravelTime['mode']
  ): TravelTime {
    if (fromLocation === toLocation) {
      return { duration: 0, distance: 0, mode, route: 'Same location' };
    }

    // Mock calculation based on typical Toronto distances
    const baseDistance = this.getBaseDistance(fromLocation, toLocation);
    
    let duration: number;
    switch (mode) {
      case 'walking':
        duration = baseDistance * 12; // ~12 min/km walking
        break;
      case 'cycling':
        duration = baseDistance * 4; // ~4 min/km cycling
        break;
      case 'transit':
        duration = baseDistance * 6 + 10; // ~6 min/km + waiting time
        break;
      case 'driving':
      default:
        duration = baseDistance * 3 + 5; // ~3 min/km + parking time
        break;
    }

    return {
      duration: Math.ceil(duration),
      distance: baseDistance,
      mode,
      route: `${fromLocation} to ${toLocation}`
    };
  }

  private static getBaseDistance(fromLocation: string, toLocation: string): number {
    // Mock distances between common Toronto locations (in km)
    const distances: Record<string, Record<string, number>> = {
      'Home': {
        'Toronto Harbourfront Trail': 3.2,
        'MaRS Discovery District': 2.1,
        'St. Basil Catholic Church': 1.8,
        'Financial District': 2.5,
        'High Park': 8.5
      },
      'MaRS Discovery District': {
        'Home': 2.1,
        'Toronto Harbourfront Trail': 1.8,
        'Financial District': 1.2,
        'St. Basil Catholic Church': 0.8,
        'High Park': 7.2
      },
      'Financial District': {
        'Home': 2.5,
        'Toronto Harbourfront Trail': 1.0,
        'MaRS Discovery District': 1.2,
        'High Park': 9.1
      }
    };

    return distances[fromLocation]?.[toLocation] || 
           distances[toLocation]?.[fromLocation] || 
           5.0; // Default 5km if not found
  }

  static getLocationData(locationName: string): LocationData | null {
    return this.TORONTO_LOCATIONS[locationName] || null;
  }

  static getAllLocations(): Record<string, LocationData> {
    return this.TORONTO_LOCATIONS;
  }

  static optimizeScheduleForTravel(activities: ScheduleItem[]): ScheduleItem[] {
    // Simple optimization: group activities by location when possible
    const optimized = [...activities];
    
    // Sort by location to minimize travel
    optimized.sort((a, b) => {
      if (a.activity.location === b.activity.location) {
        return this.timeToMinutes(a.start_time) - this.timeToMinutes(b.start_time);
      }
      return a.activity.location.localeCompare(b.activity.location);
    });

    return optimized;
  }

  private static timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
}
