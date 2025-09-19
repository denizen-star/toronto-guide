import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Home, Person, Tune, Schedule, Analytics } from '@mui/icons-material';
import PersonaSelector from './components/PersonaSelector/PersonaSelector';
import TimeAllocationTuner from './components/TimeAllocationTuner/TimeAllocationTuner';
import ScheduleViewer from './components/ScheduleViewer/ScheduleViewer';
import AnalyticsDashboard from './components/AnalyticsDashboard/AnalyticsDashboard';
import { useStore } from './store/useStore';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2c3e50',
    },
    secondary: {
      main: '#3498db',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
});

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const {
    selectedPersona,
    personas,
    timeAllocation,
    currentSchedule,
    activities,
    isLoading,
    setSelectedPersona,
    setTimeAllocation,
    loadPersonas,
    generateSchedule,
    exportSchedule,
  } = useStore();

  useEffect(() => {
    loadPersonas();
  }, [loadPersonas]);

  const handlePersonaSelect = (persona: any) => {
    setSelectedPersona(persona);
  };

  const handleAllocationChange = (allocation: any) => {
    setTimeAllocation(allocation);
  };

  const handleExportSchedule = async () => {
    try {
      await generateSchedule();
      const filename = await exportSchedule();
      console.log('Schedule exported:', filename);
    } catch (error) {
      console.error('Failed to export schedule:', error);
    }
  };

  const handleResetDefaults = () => {
    const defaultAllocation = {
      individual_activities_percent: 16.0,
      networking_social_percent: 21.6,
      couple_activities_percent: 23.8,
      individual_breakdown: {
        running_percent: 27.0,
        personal_development_percent: 19.0,
        fitness_grooming_percent: 35.0,
        reflection_planning_percent: 19.0,
      },
      networking_breakdown: {
        professional_networking_percent: 24.0,
        social_activities_percent: 50.0,
        professional_dev_networking_percent: 18.0,
        other_social_percent: 8.0,
      },
      couple_breakdown: {
        daily_meals_percent: 29.0,
        evening_together_percent: 25.0,
        weekend_activities_percent: 25.0,
        breakfast_together_percent: 13.0,
        household_together_percent: 8.0,
      },
    };
    setTimeAllocation(defaultAllocation);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Home sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            LifePlanner
          </Typography>
          {selectedPersona && (
            <>
              <Button
                color="inherit"
                startIcon={<Person />}
                onClick={() => navigate('/')}
                sx={{ mr: 2 }}
              >
                {selectedPersona.persona_name}
              </Button>
              <Button
                color="inherit"
                startIcon={<Tune />}
                onClick={() => navigate('/tuner')}
                sx={{ 
                  mr: 1,
                  backgroundColor: location.pathname === '/tuner' ? 'rgba(255,255,255,0.1)' : 'transparent'
                }}
              >
                Tuner
              </Button>
                  <Button
                    color="inherit"
                    startIcon={<Schedule />}
                    onClick={() => navigate('/schedule')}
                    sx={{ 
                      mr: 1,
                      backgroundColor: location.pathname === '/schedule' ? 'rgba(255,255,255,0.1)' : 'transparent'
                    }}
                  >
                    Schedule
                  </Button>
                  <Button
                    color="inherit"
                    startIcon={<Analytics />}
                    onClick={() => navigate('/analytics')}
                    sx={{ 
                      mr: 2,
                      backgroundColor: location.pathname === '/analytics' ? 'rgba(255,255,255,0.1)' : 'transparent'
                    }}
                  >
                    Analytics
                  </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 0
      }}>
        <Routes>
              <Route 
                path="/" 
                element={
                  <PersonaSelector
                    personas={personas}
                    selectedPersona={selectedPersona}
                    onPersonaSelect={handlePersonaSelect}
                    loading={isLoading}
                  />
                } 
              />
          <Route 
            path="/tuner" 
            element={
              selectedPersona ? (
                <TimeAllocationTuner
                  timeAllocation={timeAllocation}
                  onAllocationChange={handleAllocationChange}
                  onExportSchedule={handleExportSchedule}
                  onResetDefaults={handleResetDefaults}
                  loading={isLoading}
                />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
              <Route 
                path="/schedule" 
                element={
                  selectedPersona ? (
                    <ScheduleViewer
                      schedule={currentSchedule}
                      persona={selectedPersona}
                      loading={isLoading}
                    />
                  ) : (
                    <Navigate to="/" replace />
                  )
                } 
              />
              <Route 
                path="/analytics" 
                element={
                  selectedPersona ? (
                    <AnalyticsDashboard
                      activities={activities}
                      persona={selectedPersona}
                    />
                  ) : (
                    <Navigate to="/" replace />
                  )
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
