"""
Weather API integration for outdoor activity planning
"""

import json
import requests
from typing import Dict, List, Optional, Tuple
from datetime import datetime, timedelta
from pathlib import Path

from ...shared.logging import get_logger


class WeatherService:
    """Weather service for outdoor activity planning"""
    
    def __init__(self, api_key: Optional[str] = None, city: str = "Toronto"):
        self.api_key = api_key or self._load_api_key()
        self.city = city
        self.base_url = "http://api.openweathermap.org/data/2.5"
        self.logger = get_logger(__name__)
        
        # Weather cache
        self.weather_cache = {}
        self.cache_duration = 3600  # 1 hour in seconds
    
    def _load_api_key(self) -> Optional[str]:
        """Load API key from environment or config file"""
        import os
        
        # Try environment variable first
        api_key = os.getenv("OPENWEATHER_API_KEY")
        if api_key:
            return api_key
        
        # Try config file
        config_file = Path("data/weather_config.json")
        if config_file.exists():
            with open(config_file, 'r') as f:
                config = json.load(f)
                return config.get("api_key")
        
        return None
    
    def get_current_weather(self) -> Optional[Dict]:
        """Get current weather conditions"""
        if not self.api_key:
            self.logger.warning("Weather API key not configured")
            return self._get_mock_weather()
        
        cache_key = f"current_{self.city}"
        
        # Check cache
        if self._is_cache_valid(cache_key):
            return self.weather_cache[cache_key]["data"]
        
        try:
            url = f"{self.base_url}/weather"
            params = {
                "q": self.city,
                "appid": self.api_key,
                "units": "metric"
            }
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            weather_data = response.json()
            processed_data = self._process_current_weather(weather_data)
            
            # Cache the result
            self.weather_cache[cache_key] = {
                "data": processed_data,
                "timestamp": datetime.now().timestamp()
            }
            
            self.logger.info(f"Retrieved current weather for {self.city}")
            return processed_data
            
        except Exception as e:
            self.logger.error(f"Failed to get current weather: {e}")
            return self._get_mock_weather()
    
    def get_forecast(self, days: int = 7) -> List[Dict]:
        """Get weather forecast for the next few days"""
        if not self.api_key:
            self.logger.warning("Weather API key not configured")
            return self._get_mock_forecast(days)
        
        cache_key = f"forecast_{self.city}_{days}"
        
        # Check cache
        if self._is_cache_valid(cache_key):
            return self.weather_cache[cache_key]["data"]
        
        try:
            url = f"{self.base_url}/forecast"
            params = {
                "q": self.city,
                "appid": self.api_key,
                "units": "metric",
                "cnt": days * 8  # 8 forecasts per day (every 3 hours)
            }
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            forecast_data = response.json()
            processed_data = self._process_forecast(forecast_data, days)
            
            # Cache the result
            self.weather_cache[cache_key] = {
                "data": processed_data,
                "timestamp": datetime.now().timestamp()
            }
            
            self.logger.info(f"Retrieved {days}-day forecast for {self.city}")
            return processed_data
            
        except Exception as e:
            self.logger.error(f"Failed to get weather forecast: {e}")
            return self._get_mock_forecast(days)
    
    def _process_current_weather(self, data: Dict) -> Dict:
        """Process current weather data"""
        return {
            "temperature": data["main"]["temp"],
            "feels_like": data["main"]["feels_like"],
            "humidity": data["main"]["humidity"],
            "pressure": data["main"]["pressure"],
            "description": data["weather"][0]["description"],
            "main": data["weather"][0]["main"],
            "icon": data["weather"][0]["icon"],
            "wind_speed": data["wind"]["speed"],
            "wind_direction": data["wind"].get("deg", 0),
            "cloudiness": data["clouds"]["all"],
            "visibility": data.get("visibility", 10000) / 1000,  # Convert to km
            "sunrise": datetime.fromtimestamp(data["sys"]["sunrise"]),
            "sunset": datetime.fromtimestamp(data["sys"]["sunset"]),
            "timestamp": datetime.now(),
            "is_outdoor_friendly": self._is_outdoor_friendly(data)
        }
    
    def _process_forecast(self, data: Dict, days: int) -> List[Dict]:
        """Process forecast data"""
        forecasts = []
        daily_data = {}
        
        # Group by date
        for item in data["list"]:
            date = datetime.fromtimestamp(item["dt"]).date()
            if date not in daily_data:
                daily_data[date] = []
            daily_data[date].append(item)
        
        # Process each day
        for date in sorted(daily_data.keys())[:days]:
            day_forecasts = daily_data[date]
            
            # Calculate daily aggregates
            temps = [f["main"]["temp"] for f in day_forecasts]
            conditions = [f["weather"][0]["main"] for f in day_forecasts]
            descriptions = [f["weather"][0]["description"] for f in day_forecasts]
            
            # Find most common condition
            condition_counts = {}
            for condition in conditions:
                condition_counts[condition] = condition_counts.get(condition, 0) + 1
            main_condition = max(condition_counts, key=condition_counts.get)
            
            # Calculate precipitation probability
            precipitation_prob = 0
            if any("rain" in desc.lower() or "snow" in desc.lower() for desc in descriptions):
                precipitation_prob = len([d for d in descriptions if "rain" in d.lower() or "snow" in d.lower()]) / len(descriptions)
            
            daily_forecast = {
                "date": date,
                "temperature_min": min(temps),
                "temperature_max": max(temps),
                "temperature_avg": sum(temps) / len(temps),
                "main_condition": main_condition,
                "description": max(set(descriptions), key=descriptions.count),
                "precipitation_probability": precipitation_prob,
                "wind_speed": sum(f["wind"]["speed"] for f in day_forecasts) / len(day_forecasts),
                "humidity": sum(f["main"]["humidity"] for f in day_forecasts) / len(day_forecasts),
                "is_outdoor_friendly": self._is_day_outdoor_friendly(day_forecasts)
            }
            
            forecasts.append(daily_forecast)
        
        return forecasts
    
    def _is_outdoor_friendly(self, weather_data: Dict) -> bool:
        """Determine if current weather is suitable for outdoor activities"""
        temp = weather_data["main"]["temp"]
        condition = weather_data["weather"][0]["main"].lower()
        wind_speed = weather_data["wind"]["speed"]
        
        # Temperature check (comfortable range: 5-30°C)
        if temp < 5 or temp > 30:
            return False
        
        # Weather condition check
        if condition in ["thunderstorm", "snow", "extreme"]:
            return False
        
        # Heavy rain check
        if condition == "rain" and "heavy" in weather_data["weather"][0]["description"].lower():
            return False
        
        # Wind speed check (comfortable: < 10 m/s)
        if wind_speed > 10:
            return False
        
        return True
    
    def _is_day_outdoor_friendly(self, day_forecasts: List[Dict]) -> bool:
        """Determine if a day is suitable for outdoor activities"""
        outdoor_friendly_hours = 0
        
        for forecast in day_forecasts:
            temp = forecast["main"]["temp"]
            condition = forecast["weather"][0]["main"].lower()
            wind_speed = forecast["wind"]["speed"]
            
            # Check if this 3-hour period is outdoor friendly
            if (5 <= temp <= 30 and 
                condition not in ["thunderstorm", "snow", "extreme"] and
                wind_speed <= 10):
                outdoor_friendly_hours += 1
        
        # Consider day outdoor friendly if at least 50% of the day is suitable
        return outdoor_friendly_hours >= len(day_forecasts) * 0.5
    
    def _is_cache_valid(self, cache_key: str) -> bool:
        """Check if cached data is still valid"""
        if cache_key not in self.weather_cache:
            return False
        
        cache_time = self.weather_cache[cache_key]["timestamp"]
        return (datetime.now().timestamp() - cache_time) < self.cache_duration
    
    def _get_mock_weather(self) -> Dict:
        """Get mock weather data when API is not available"""
        return {
            "temperature": 20.0,
            "feels_like": 22.0,
            "humidity": 60,
            "pressure": 1013,
            "description": "partly cloudy",
            "main": "Clouds",
            "icon": "02d",
            "wind_speed": 3.5,
            "wind_direction": 180,
            "cloudiness": 40,
            "visibility": 10.0,
            "sunrise": datetime.now().replace(hour=6, minute=30),
            "sunset": datetime.now().replace(hour=19, minute=30),
            "timestamp": datetime.now(),
            "is_outdoor_friendly": True,
            "is_mock": True
        }
    
    def _get_mock_forecast(self, days: int) -> List[Dict]:
        """Get mock forecast data when API is not available"""
        forecasts = []
        base_date = datetime.now().date()
        
        for i in range(days):
            date = base_date + timedelta(days=i)
            forecast = {
                "date": date,
                "temperature_min": 15.0 + i,
                "temperature_max": 25.0 + i,
                "temperature_avg": 20.0 + i,
                "main_condition": "Clear" if i % 2 == 0 else "Clouds",
                "description": "clear sky" if i % 2 == 0 else "few clouds",
                "precipitation_probability": 0.1 if i % 3 == 0 else 0.0,
                "wind_speed": 3.0 + i * 0.5,
                "humidity": 50 + i * 2,
                "is_outdoor_friendly": True,
                "is_mock": True
            }
            forecasts.append(forecast)
        
        return forecasts
    
    def get_outdoor_activity_recommendations(self, forecast_days: int = 3) -> List[Dict]:
        """Get recommendations for outdoor activities based on weather"""
        forecast = self.get_forecast(forecast_days)
        recommendations = []
        
        for day_forecast in forecast:
            date = day_forecast["date"]
            
            # Determine activity recommendations based on weather
            activities = []
            
            if day_forecast["is_outdoor_friendly"]:
                temp = day_forecast["temperature_avg"]
                condition = day_forecast["main_condition"].lower()
                
                # Temperature-based recommendations
                if temp >= 20:
                    activities.extend([
                        {"activity": "Outdoor dining", "reason": "Perfect temperature for patio dining"},
                        {"activity": "Park picnic", "reason": "Great weather for outdoor meals"},
                        {"activity": "Beach volleyball", "reason": "Warm weather ideal for beach activities"}
                    ])
                elif temp >= 15:
                    activities.extend([
                        {"activity": "Nature walk", "reason": "Comfortable temperature for walking"},
                        {"activity": "Outdoor market", "reason": "Pleasant weather for browsing markets"},
                        {"activity": "Cycling", "reason": "Good temperature for bike rides"}
                    ])
                elif temp >= 10:
                    activities.extend([
                        {"activity": "Hiking", "reason": "Cool but comfortable for hiking"},
                        {"activity": "Photography walk", "reason": "Good light and comfortable temperature"}
                    ])
                
                # Condition-based recommendations
                if condition == "clear":
                    activities.extend([
                        {"activity": "Stargazing", "reason": "Clear skies perfect for astronomy"},
                        {"activity": "Outdoor sports", "reason": "Clear weather ideal for sports"}
                    ])
                elif condition == "clouds":
                    activities.extend([
                        {"activity": "Photography", "reason": "Cloudy skies create interesting lighting"},
                        {"activity": "Outdoor art", "reason": "Diffused light good for outdoor painting"}
                    ])
            else:
                # Indoor alternatives
                activities.extend([
                    {"activity": "Museum visit", "reason": f"Weather not suitable for outdoor activities ({day_forecast['description']})"},
                    {"activity": "Indoor climbing", "reason": "Active indoor alternative"},
                    {"activity": "Art gallery", "reason": "Cultural indoor activity"}
                ])
            
            recommendation = {
                "date": date.isoformat(),
                "weather_summary": {
                    "temperature": f"{day_forecast['temperature_min']:.0f}-{day_forecast['temperature_max']:.0f}°C",
                    "condition": day_forecast["description"],
                    "outdoor_friendly": day_forecast["is_outdoor_friendly"]
                },
                "recommended_activities": activities[:5]  # Limit to top 5
            }
            
            recommendations.append(recommendation)
        
        self.logger.info(f"Generated weather-based recommendations for {len(recommendations)} days")
        return recommendations
    
    def should_reschedule_outdoor_activity(self, activity_date: datetime, 
                                         activity_name: str) -> Tuple[bool, str]:
        """Check if an outdoor activity should be rescheduled due to weather"""
        # Get forecast for the activity date
        days_ahead = (activity_date.date() - datetime.now().date()).days
        
        if days_ahead < 0:
            return False, "Activity is in the past"
        
        if days_ahead > 7:
            return False, "Weather forecast not available for dates beyond 7 days"
        
        forecast = self.get_forecast(days_ahead + 1)
        
        if days_ahead < len(forecast):
            day_forecast = forecast[days_ahead]
            
            if not day_forecast["is_outdoor_friendly"]:
                reason = f"Weather not suitable: {day_forecast['description']}"
                if day_forecast["temperature_avg"] < 5:
                    reason += " (too cold)"
                elif day_forecast["temperature_avg"] > 30:
                    reason += " (too hot)"
                elif day_forecast["precipitation_probability"] > 0.5:
                    reason += " (high chance of precipitation)"
                
                return True, reason
        
        return False, "Weather looks good for outdoor activities"
    
    def get_weather_alerts(self) -> List[Dict]:
        """Get weather alerts that might affect outdoor activities"""
        alerts = []
        
        # Get current weather and forecast
        current = self.get_current_weather()
        forecast = self.get_forecast(3)
        
        if not current or not forecast:
            return alerts
        
        # Current weather alerts
        if current["temperature"] < 0:
            alerts.append({
                "type": "temperature",
                "severity": "high",
                "message": "Freezing temperatures - avoid outdoor activities",
                "timestamp": datetime.now()
            })
        elif current["temperature"] > 35:
            alerts.append({
                "type": "temperature", 
                "severity": "high",
                "message": "Extreme heat - limit outdoor exposure",
                "timestamp": datetime.now()
            })
        
        if current["wind_speed"] > 15:
            alerts.append({
                "type": "wind",
                "severity": "medium",
                "message": f"High winds ({current['wind_speed']:.1f} m/s) - be cautious outdoors",
                "timestamp": datetime.now()
            })
        
        # Forecast alerts
        for i, day in enumerate(forecast):
            if day["precipitation_probability"] > 0.7:
                alerts.append({
                    "type": "precipitation",
                    "severity": "medium", 
                    "message": f"High chance of precipitation on {day['date']} - plan indoor alternatives",
                    "timestamp": datetime.now()
                })
        
        return alerts

