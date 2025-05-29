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
import Map from './pages/Map';
import Activities from './pages/Activities';
import HappyHours from './pages/HappyHours';
import Layout from './components/Layout';
import DayTrips from './pages/DayTrips';
import AmateurSports from './pages/AmateurSports';
import SportingEvents from './pages/SportingEvents';
import SpecialEvents from './pages/SpecialEvents';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
      <CssBaseline />
      <Router basename="/tovibes">
        <Navbar />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="activities" element={<Activities />} />
            <Route path="happy-hours" element={<HappyHours />} />
            <Route path="neighborhoods" element={<Neighborhoods />} />
            <Route path="venue/:id" element={<VenueDetails />} />
            <Route path="map" element={<Map />} />
            <Route path="day-trips" element={<DayTrips />} />
            <Route path="amateur-sports" element={<AmateurSports />} />
            <Route path="sporting-events" element={<SportingEvents />} />
            <Route path="special-events" element={<SpecialEvents />} />
          </Route>
        </Routes>
      </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
