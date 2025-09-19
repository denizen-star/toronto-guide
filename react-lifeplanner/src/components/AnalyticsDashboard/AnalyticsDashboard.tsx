import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Analytics,
  TrendingUp,
  TrendingDown,
  AttachMoney,
  People,
  FitnessCenter,
  Refresh,
  Download,
  Star,
  Schedule
} from '@mui/icons-material';
import { ActivityTrackingService, ActivityStats } from '../../services/activityTrackingService';
import { WeatherService, WeatherData } from '../../services/weatherService';
import { Activity, UserPersona } from '../../types';

interface AnalyticsDashboardProps {
  activities: Activity[];
  persona: UserPersona | null;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  activities,
  persona
}) => {
  const [stats, setStats] = useState<ActivityStats | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAnalytics();
    loadWeather();
  }, [activities]);

  const loadAnalytics = () => {
    setLoading(true);
    try {
      const activityStats = ActivityTrackingService.getActivityStats(activities);
      setStats(activityStats);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWeather = async () => {
    try {
      const weatherData = await WeatherService.getCurrentWeather('Toronto');
      setWeather(weatherData);
    } catch (error) {
      console.error('Failed to load weather:', error);
    }
  };

  const handleResetData = () => {
    ActivityTrackingService.resetUsageData();
    loadAnalytics();
  };

  if (!stats) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6">Loading analytics...</Typography>
        <LinearProgress sx={{ mt: 2 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Analytics /> Analytics Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Refresh Analytics">
            <IconButton onClick={loadAnalytics}>
              <Refresh />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset Usage Data">
            <IconButton onClick={handleResetData} color="warning">
              <Download />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Weather Widget */}
      {weather && (
        <Paper sx={{ p: 2, mb: 3, background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
            <Typography variant="h6" sx={{ mr: 2 }}>
              {WeatherService.getWeatherIcon(weather.condition)} Toronto Weather
            </Typography>
            <Typography variant="h4" sx={{ mr: 2 }}>
              {weather.temperature}°C
            </Typography>
            <Typography variant="body1">
              {weather.description} • Humidity: {weather.humidity}% • Wind: {weather.windSpeed} km/h
            </Typography>
          </Box>
        </Paper>
      )}

      <Grid container spacing={3}>
        {/* Overview Stats */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Activity Overview
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="primary">
                    {stats.totalActivities}
                  </Typography>
                  <Typography variant="body2">
                    Total Activities
                  </Typography>
                </Card>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" sx={{ color: '#4CAF50' }}>
                    ${stats.totalCost.toFixed(0)}
                  </Typography>
                  <Typography variant="body2">
                    Total Spent
                  </Typography>
                </Card>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" sx={{ color: '#FF9800' }}>
                    {stats.networkingScore.toFixed(1)}
                  </Typography>
                  <Typography variant="body2">
                    Avg Networking
                  </Typography>
                </Card>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" sx={{ color: '#9C27B0' }}>
                    ${stats.averageCost.toFixed(0)}
                  </Typography>
                  <Typography variant="body2">
                    Avg Cost
                  </Typography>
                </Card>
              </Grid>
            </Grid>

            {/* Category Breakdown */}
            <Typography variant="h6" gutterBottom>
              Activity Categories
            </Typography>
            <Box sx={{ mb: 3 }}>
              {Object.entries(stats.categoryBreakdown).map(([category, count]) => (
                <Box key={category} sx={{ mb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {category.replace('_', ' ')}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {count}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(count / stats.totalActivities) * 100}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              ))}
            </Box>

            {/* Weekly Trends */}
            <Typography variant="h6" gutterBottom>
              Weekly Activity Trends
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {Object.entries(stats.weeklyTrends).map(([day, count]) => (
                <Chip 
                  key={day}
                  label={`${day}: ${count}`}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Activity Rankings */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h6" gutterBottom>
              Activity Rankings
            </Typography>
            
            {/* Most Used */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp color="success" /> Most Used Activity
              </Typography>
              <Card sx={{ p: 2, border: '2px solid #4CAF50' }}>
                <Typography variant="body1" fontWeight="bold">
                  {activities.find(a => a.id === stats.mostUsedActivity.activityId)?.name || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Used {stats.mostUsedActivity.usageCount} times
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Star sx={{ color: '#FFD700', fontSize: 16 }} />
                  <Typography variant="body2">
                    {stats.mostUsedActivity.averageRating.toFixed(1)}/5
                  </Typography>
                </Box>
              </Card>
            </Box>

            {/* Least Used */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingDown color="warning" /> Least Used Activity
              </Typography>
              <Card sx={{ p: 2, border: '2px solid #FF9800' }}>
                <Typography variant="body1" fontWeight="bold">
                  {activities.find(a => a.id === stats.leastUsedActivity.activityId)?.name || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Used {stats.leastUsedActivity.usageCount} times
                </Typography>
                <Typography variant="body2" color="primary">
                  Try this more often!
                </Typography>
              </Card>
            </Box>

            {/* Goals Progress */}
            {persona && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Goal Alignment
                </Typography>
                <List dense>
                  {persona.goals.primary_goals.slice(0, 3).map((goal, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Box sx={{ 
                          width: 12, 
                          height: 12, 
                          backgroundColor: index === 0 ? '#4CAF50' : index === 1 ? '#FF9800' : '#2196F3',
                          borderRadius: '50%' 
                        }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={goal}
                        secondary={`${60 + index * 15}% aligned`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Recommendations */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Smart Recommendations
            </Typography>
            
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ p: 2, backgroundColor: '#E3F2FD' }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <People color="primary" /> Networking Opportunities
                  </Typography>
                  <Typography variant="body2">
                    You've been networking consistently! Consider attending the Toronto AI & Fintech meetup next week.
                  </Typography>
                  <Button size="small" sx={{ mt: 1 }}>
                    Add to Schedule
                  </Button>
                </Card>
              </Grid>
              
              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ p: 2, backgroundColor: '#E8F5E8' }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FitnessCenter color="success" /> Fitness Goals
                  </Typography>
                  <Typography variant="body2">
                    Great job maintaining your running schedule! Your half marathon training is on track.
                  </Typography>
                  <Button size="small" sx={{ mt: 1 }}>
                    View Progress
                  </Button>
                </Card>
              </Grid>
              
              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ p: 2, backgroundColor: '#FFF3E0' }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AttachMoney color="warning" /> Budget Optimization
                  </Typography>
                  <Typography variant="body2">
                    You're within budget! Consider trying some premium networking events this week.
                  </Typography>
                  <Button size="small" sx={{ mt: 1 }}>
                    Explore Options
                  </Button>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsDashboard;
