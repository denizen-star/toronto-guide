export interface Activity {
  title: string;
  category: string;
  address: string;
  website?: string;
}

export interface HappyHour {
  name: string;
  details: string;
  address: string;
  website?: string;
}

export interface BoulderLocation {
  id: string;
  title: string;
  description: string;
  category: 'downtown' | 'hill' | 'nobo' | 'south' | 'east' | 'gunbarrel';
  tags: string[];
  activities: Activity[];
  happyHours?: HappyHour[];
} 