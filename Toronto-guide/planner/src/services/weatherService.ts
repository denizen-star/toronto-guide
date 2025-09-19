import axios from 'axios';

export interface WeatherData {
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy';
  humidity: number;
  windSpeed: number;
  description: string;
}

export class WeatherService {
  private static readonly API_KEY = process.env.REACT_APP_WEATHER_API_KEY || 'demo_key';
  private static readonly BASE_URL = 'https://api.openweathermap.org/data/2.5';

  static async getCurrentWeather(city: string = 'Toronto'): Promise<WeatherData> {
    try {
      // For demo purposes, return mock weather data
      // In production, uncomment the API call below
      
      /*
      const response = await axios.get(`${this.BASE_URL}/weather`, {
        params: {
          q: city,
          appid: this.API_KEY,
          units: 'metric'
        }
      });

      const data = response.data;
      return {
        temperature: Math.round(data.main.temp),
        condition: this.mapWeatherCondition(data.weather[0].main),
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        description: data.weather[0].description
      };
      */

      // Mock weather data for demo
      const mockConditions = ['sunny', 'cloudy', 'rainy', 'snowy', 'stormy'] as const;
      const randomCondition = mockConditions[Math.floor(Math.random() * mockConditions.length)];
      
      return {
        temperature: Math.floor(Math.random() * 30) - 5, // -5 to 25°C
        condition: randomCondition,
        humidity: Math.floor(Math.random() * 50) + 30, // 30-80%
        windSpeed: Math.floor(Math.random() * 20), // 0-20 km/h
        description: this.getWeatherDescription(randomCondition)
      };
    } catch (error) {
      console.error('Weather service error:', error);
      // Fallback to default weather
      return {
        temperature: 15,
        condition: 'cloudy',
        humidity: 60,
        windSpeed: 10,
        description: 'Partly cloudy'
      };
    }
  }

  private static mapWeatherCondition(condition: string): WeatherData['condition'] {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('sun') || conditionLower.includes('clear')) return 'sunny';
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) return 'rainy';
    if (conditionLower.includes('snow')) return 'snowy';
    if (conditionLower.includes('storm') || conditionLower.includes('thunder')) return 'stormy';
    return 'cloudy';
  }

  private static getWeatherDescription(condition: WeatherData['condition']): string {
    switch (condition) {
      case 'sunny': return 'Clear and sunny';
      case 'cloudy': return 'Partly cloudy';
      case 'rainy': return 'Light rain';
      case 'snowy': return 'Snow showers';
      case 'stormy': return 'Thunderstorms';
      default: return 'Variable conditions';
    }
  }

  static getWeatherAwareActivities(weather: WeatherData, allActivities: any[]): any[] {
    // Filter activities based on weather conditions
    return allActivities.filter(activity => {
      const isOutdoor = activity.tags.includes('outdoor') || activity.tags.includes('running');
      
      switch (weather.condition) {
        case 'rainy':
        case 'stormy':
          return !isOutdoor; // Prefer indoor activities
        case 'snowy':
          return !isOutdoor || activity.tags.includes('winter_sports');
        case 'sunny':
          return true; // All activities suitable
        case 'cloudy':
        default:
          return true; // All activities suitable
      }
    });
  }

  static getWeatherIcon(condition: WeatherData['condition']): string {
    switch (condition) {
      case 'sunny': return '☀️';
      case 'cloudy': return '☁️';
      case 'rainy': return '🌧️';
      case 'snowy': return '❄️';
      case 'stormy': return '⛈️';
      default: return '🌤️';
    }
  }
}
