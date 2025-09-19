import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Slider,
  Button,
  Chip,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import {
  Person,
  NetworkCheck,
  Favorite,
  TrendingUp,
  BarChart,
  Download,
  Refresh
} from '@mui/icons-material';
import { TimeAllocation } from '../../types';

interface TimeAllocationTunerProps {
  timeAllocation: TimeAllocation;
  onAllocationChange: (allocation: Partial<TimeAllocation>) => void;
  onExportSchedule: () => void;
  onResetDefaults: () => void;
  loading?: boolean;
}

const TimeAllocationTuner: React.FC<TimeAllocationTunerProps> = ({
  timeAllocation,
  onAllocationChange,
  onExportSchedule,
  onResetDefaults,
  loading = false
}) => {
  const totalPercentage = 
    timeAllocation.individual_activities_percent +
    timeAllocation.networking_social_percent +
    timeAllocation.couple_activities_percent;

  const totalHours = 115.5; // Total weekly hours
  const availableHours = 40.8; // Available for tuning

  const calculateHours = (percentage: number) => {
    return ((percentage / 100) * availableHours).toFixed(1);
  };

  const handleMainCategoryChange = (category: keyof TimeAllocation, value: number) => {
    onAllocationChange({ [category]: value });
  };

  const handleSubcategoryChange = (
    mainCategory: 'individual_breakdown' | 'networking_breakdown' | 'couple_breakdown',
    subcategory: string,
    value: number
  ) => {
    onAllocationChange({
      [mainCategory]: {
        ...timeAllocation[mainCategory],
        [subcategory]: value
      }
    });
  };

  const presets = {
    work_focus: {
      individual_activities_percent: 20.0,
      networking_social_percent: 15.0,
      couple_activities_percent: 15.0
    },
    social_focus: {
      individual_activities_percent: 10.0,
      networking_social_percent: 35.0,
      couple_activities_percent: 15.0
    },
    couple_focus: {
      individual_activities_percent: 12.0,
      networking_social_percent: 18.0,
      couple_activities_percent: 30.0
    },
    balanced: {
      individual_activities_percent: 16.0,
      networking_social_percent: 21.6,
      couple_activities_percent: 23.8
    }
  };

  const applyPreset = (presetName: keyof typeof presets) => {
    onAllocationChange(presets[presetName]);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        🎛️ Time Allocation Tuner
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom>
        Adjust time percentages and automatically refactor your entire schedule
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Left Panel - Controls */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper sx={{ p: 3 }}>
            {/* Preset Buttons */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp /> Quick Presets
              </Typography>
              <Grid container spacing={1}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Person />}
                    onClick={() => applyPreset('work_focus')}
                    disabled={loading}
                  >
                    Work Focus
                  </Button>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<NetworkCheck />}
                    onClick={() => applyPreset('social_focus')}
                    disabled={loading}
                  >
                    Social Focus
                  </Button>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Favorite />}
                    onClick={() => applyPreset('couple_focus')}
                    disabled={loading}
                  >
                    Couple Focus
                  </Button>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<BarChart />}
                    onClick={() => applyPreset('balanced')}
                    disabled={loading}
                  >
                    Balanced
                  </Button>
                </Grid>
              </Grid>
            </Box>

            {/* Total Percentage Display */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Chip
                label={`Total: ${totalPercentage.toFixed(1)}%`}
                color={totalPercentage > 100 ? 'error' : totalPercentage < 50 ? 'warning' : 'success'}
                size="medium"
                sx={{ fontSize: '1.1rem', fontWeight: 'bold', px: 2, py: 1 }}
              />
            </Box>

            {/* Individual Activities */}
            <Card sx={{ mb: 3, borderLeft: '4px solid #4CAF50' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person /> Individual Activities
                  </Typography>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" color="primary">
                      {timeAllocation.individual_activities_percent.toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {calculateHours(timeAllocation.individual_activities_percent)}h
                    </Typography>
                  </Box>
                </Box>
                
                <Slider
                  value={timeAllocation.individual_activities_percent}
                  onChange={(_, value) => handleMainCategoryChange('individual_activities_percent', value as number)}
                  min={5}
                  max={35}
                  step={0.1}
                  disabled={loading}
                  sx={{ mb: 2 }}
                />

                <Divider sx={{ my: 2 }} />

                {/* Individual Subcategories */}
                {Object.entries(timeAllocation.individual_breakdown).map(([key, value]) => (
                  <Box key={key} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2">
                        {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()).replace(' Percent', '')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {value.toFixed(1)}%
                      </Typography>
                    </Box>
                    <Slider
                      value={value}
                      onChange={(_, newValue) => handleSubcategoryChange('individual_breakdown', key, newValue as number)}
                      min={0}
                      max={100}
                      step={0.1}
                      size="small"
                      disabled={loading}
                    />
                  </Box>
                ))}
              </CardContent>
            </Card>

            {/* Networking & Social */}
            <Card sx={{ mb: 3, borderLeft: '4px solid #2196F3' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <NetworkCheck /> Networking & Social
                  </Typography>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" color="primary">
                      {timeAllocation.networking_social_percent.toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {calculateHours(timeAllocation.networking_social_percent)}h
                    </Typography>
                  </Box>
                </Box>
                
                <Slider
                  value={timeAllocation.networking_social_percent}
                  onChange={(_, value) => handleMainCategoryChange('networking_social_percent', value as number)}
                  min={10}
                  max={40}
                  step={0.1}
                  disabled={loading}
                  sx={{ mb: 2 }}
                />

                <Divider sx={{ my: 2 }} />

                {/* Networking Subcategories */}
                {Object.entries(timeAllocation.networking_breakdown).map(([key, value]) => (
                  <Box key={key} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2">
                        {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()).replace(' Percent', '')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {value.toFixed(1)}%
                      </Typography>
                    </Box>
                    <Slider
                      value={value}
                      onChange={(_, newValue) => handleSubcategoryChange('networking_breakdown', key, newValue as number)}
                      min={0}
                      max={100}
                      step={0.1}
                      size="small"
                      disabled={loading}
                    />
                  </Box>
                ))}
              </CardContent>
            </Card>

            {/* Couple Activities */}
            <Card sx={{ mb: 3, borderLeft: '4px solid #E91E63' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Favorite /> Couple Activities
                  </Typography>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" color="primary">
                      {timeAllocation.couple_activities_percent.toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {calculateHours(timeAllocation.couple_activities_percent)}h
                    </Typography>
                  </Box>
                </Box>
                
                <Slider
                  value={timeAllocation.couple_activities_percent}
                  onChange={(_, value) => handleMainCategoryChange('couple_activities_percent', value as number)}
                  min={15}
                  max={45}
                  step={0.1}
                  disabled={loading}
                  sx={{ mb: 2 }}
                />

                <Divider sx={{ my: 2 }} />

                {/* Couple Subcategories */}
                {Object.entries(timeAllocation.couple_breakdown).map(([key, value]) => (
                  <Box key={key} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2">
                        {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()).replace(' Percent', '')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {value.toFixed(1)}%
                      </Typography>
                    </Box>
                    <Slider
                      value={value}
                      onChange={(_, newValue) => handleSubcategoryChange('couple_breakdown', key, newValue as number)}
                      min={0}
                      max={100}
                      step={0.1}
                      size="small"
                      disabled={loading}
                    />
                  </Box>
                ))}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Download />}
                  onClick={onExportSchedule}
                  disabled={loading}
                  size="large"
                >
                  Export Schedule
                </Button>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Refresh />}
                  onClick={onResetDefaults}
                  disabled={loading}
                  size="large"
                >
                  Reset Defaults
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Right Panel - Visualization */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BarChart /> Time Summary
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Total Weekly Hours:</Typography>
                <Typography variant="body2" fontWeight="bold">{totalHours}h</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Fixed Time:</Typography>
                <Typography variant="body2" fontWeight="bold">74.7h (64.7%)</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Available for Tuning:</Typography>
                <Typography variant="body2" fontWeight="bold">{availableHours}h (35.3%)</Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Current Allocation
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, backgroundColor: '#4CAF50', borderRadius: '50%' }} />
                  <Typography variant="body2">Individual Activities</Typography>
                </Box>
                <Typography variant="body2" fontWeight="bold">
                  {calculateHours(timeAllocation.individual_activities_percent)}h
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, backgroundColor: '#2196F3', borderRadius: '50%' }} />
                  <Typography variant="body2">Networking & Social</Typography>
                </Box>
                <Typography variant="body2" fontWeight="bold">
                  {calculateHours(timeAllocation.networking_social_percent)}h
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, backgroundColor: '#E91E63', borderRadius: '50%' }} />
                  <Typography variant="body2">Couple Activities</Typography>
                </Box>
                <Typography variant="body2" fontWeight="bold">
                  {calculateHours(timeAllocation.couple_activities_percent)}h
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TimeAllocationTuner;
