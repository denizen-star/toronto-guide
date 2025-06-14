import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme-new';
import Home from './pages/Home';
import Scoop from './pages/Scoop';
import ScoopDetails from './pages/ScoopDetails';
import ActivityDetails from './pages/ActivityDetails';
import HappyHours from './pages/HappyHours';
import HappyHourDetails from './pages/HappyHourDetails';
import Layout from './components/Layout';
import DayTrips from './pages/DayTrips';
import DayTripDetails from './pages/DayTripDetails';
import AmateurSports from './pages/AmateurSports';
import AmateurSportDetails from './pages/AmateurSportDetails';
import SportingEvents from './pages/SportingEvents';
import SportingEventDetails from './pages/SportingEventDetails';
import SpecialEventDetails from './pages/SpecialEventDetails';
import TitleVariations from './pages/TitleVariations';
import ContentReviewAdmin from './components/ContentReviewAdmin';
import AdminLogin from './components/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';
import LgbtEvents from './pages/LgbtEvents';
import LgbtEventDetails from './pages/LgbtEventDetails';
import Boulder from './pages/Boulder';
import BoulderDetails from './pages/BoulderDetails';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CssBaseline />
          <Router>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="boulder" element={<Boulder />} />
                <Route path="boulder/:id" element={<BoulderDetails />} />
                <Route path="scoop" element={<Scoop />} />
                <Route path="scoop/:id" element={<ScoopDetails />} />
                <Route path="activity/:id" element={<ActivityDetails />} />
                <Route path="special-events/:id" element={<SpecialEventDetails />} />
                <Route path="happy-hours" element={<HappyHours />} />
                <Route path="happy-hours/:id" element={<HappyHourDetails />} />
                <Route path="day-trips" element={<DayTrips />} />
                <Route path="day-trips/:id" element={<DayTripDetails />} />
                <Route path="amateur-sports" element={<AmateurSports />} />
                <Route path="amateur-sports/:id" element={<AmateurSportDetails />} />
                <Route path="sporting-events" element={<SportingEvents />} />
                <Route path="sporting-events/:id" element={<SportingEventDetails />} />
                <Route path="title-variations" element={<TitleVariations />} />
                <Route path="lgbtq-events" element={<LgbtEvents />} />
                <Route path="lgbtq-events/:id" element={<LgbtEventDetails />} />
                <Route path="admin/login" element={<AdminLogin />} />
                <Route 
                  path="admin/*" 
                  element={
                    <ProtectedRoute>
                      <ContentReviewAdmin />
                    </ProtectedRoute>
                  } 
                />
              </Route>
            </Routes>
          </Router>
        </LocalizationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
