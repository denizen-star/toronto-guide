export type MapMode = 'SPECIAL_EVENTS' | 'SPORTING_EVENTS' | 'AMATEUR_SPORTS' | 'DAY_TRIPS' | 'ACTIVITIES' | 'HAPPY_HOURS';

export interface MapItem {
  id: string | number;
  name: string;
  address: string;
  neighborhood?: string;
  lat?: number;
  lng?: number;
  type: MapMode;
} 