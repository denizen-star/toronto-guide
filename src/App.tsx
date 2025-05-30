import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Neighborhoods from './pages/Neighborhoods';
import VenueDetails from './pages/VenueDetails';
import Activities from './pages/Activities';
import ActivityDetails from './pages/ActivityDetails';
import HappyHours from './pages/HappyHours';
import Layout from './components/Layout';
import DayTrips from './pages/DayTrips';
import DayTripDetails from './pages/DayTripDetails';
import AmateurSports from './pages/AmateurSports';
import AmateurSportDetails from './pages/AmateurSportDetails';
import SportingEvents from './pages/SportingEvents';
import SportingEventDetails from './pages/SportingEventDetails';
import SpecialEvents from './pages/SpecialEvents';
import SpecialEventDetails from './pages/SpecialEventDetails';
import TitleVariations from './pages/TitleVariations';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="activities" element={<Activities />} />
            <Route path="activity/:id" element={<ActivityDetails />} />
            <Route path="happy-hours" element={<HappyHours />} />
            <Route path="neighborhoods" element={<Neighborhoods />} />
            <Route path="venue/:id" element={<VenueDetails />} />
            <Route path="day-trips" element={<DayTrips />} />
            <Route path="day-trips/:id" element={<DayTripDetails />} />
            <Route path="amateur-sports" element={<AmateurSports />} />
            <Route path="amateur-sports/:id" element={<AmateurSportDetails />} />
            <Route path="sporting-events" element={<SportingEvents />} />
            <Route path="sporting-events/:id" element={<SportingEventDetails />} />
            <Route path="special-events" element={<SpecialEvents />} />
            <Route path="special-events/:id" element={<SpecialEventDetails />} />
            <Route path="title-variations" element={<TitleVariations />} />
          </Route>
        </Routes>
      </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
