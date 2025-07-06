import React, { useState, useEffect, useMemo } from 'react';
import { Box, Grid, Typography, CircularProgress, Container } from '@mui/material';
import { useSearch } from '../components/Layout';
import { 
  loadStandardizedSpecialEvents, 
  loadStandardizedSportingEvents, 
  loadStandardizedAmateurSports,
  loadLgbtEvents
} from '../utils/dataLoader';
import EnhancedMinimalistCard, { EnhancedCardData } from '../components/MinimalistCard';
import { format, parseISO, addDays } from 'date-fns';
import { Event as EventIcon } from '@mui/icons-material';

const getDayOfWeek = (date: Date) => format(date, 'EEEE').toUpperCase();

const TomorrowInToronto: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [recurringEvents, setRecurringEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { searchTerm } = useSearch();
  const tomorrow = addDays(new Date(), 1);
  const tomorrowStr = format(tomorrow, 'yyyy-MM-dd');
  const tomorrowDay = getDayOfWeek(tomorrow);

  useEffect(() => {
    const loadAllEvents = async () => {
      setLoading(true);
      const [specialEvents, sportingEvents, amateurSports, lgbtEvents] = await Promise.all([
        loadStandardizedSpecialEvents(),
        loadStandardizedSportingEvents(),
        loadStandardizedAmateurSports(),
        loadLgbtEvents()
      ]);
      const all = [...specialEvents, ...sportingEvents, ...amateurSports, ...lgbtEvents];
      
      // Helper function to safely parse and format dates
      const safeFormatDate = (dateString: string | undefined): string => {
        if (!dateString) return '';
        try {
          const parsed = parseISO(dateString);
          if (isNaN(parsed.getTime())) return '';
          return format(parsed, 'yyyy-MM-dd');
        } catch (error) {
          console.warn('Invalid date string:', dateString);
          return '';
        }
      };

      // Main events: match tomorrow by date
      const mainEvents = all.filter(event => {
        const start = safeFormatDate(event.startDate);
        const end = safeFormatDate(event.endDate);
        return start === tomorrowStr || end === tomorrowStr;
      });
      
      // Recurring events: recurring true and matches tomorrow day of week
      const recurring = all.filter(event => {
        // Check if event has recurring property (LgbtEvent has it, others don't)
        if ('recurring' in event && !(event as any).recurring) return false;
        if ('daysOfWeek' in event && (event as any).daysOfWeek) {
          return (event as any).daysOfWeek.split('|').map((d: string) => d.trim().toUpperCase()).includes(tomorrowDay);
        }
        // fallback: if no daysOfWeek, try to match by event.startDate's day of week
        if (event.startDate) {
          try {
            const parsed = parseISO(event.startDate);
            if (!isNaN(parsed.getTime())) {
              return getDayOfWeek(parsed) === tomorrowDay;
            }
          } catch (error) {
            console.warn('Invalid startDate for recurring event:', event.startDate);
          }
        }
        return false;
      });
      setEvents(mainEvents);
      setRecurringEvents(recurring);
      setLoading(false);
    };
    loadAllEvents();
  }, [tomorrowStr, tomorrowDay]);

  // Card data conversion
  const toCardData = (event: any): EnhancedCardData => ({
    id: event.id,
    title: event.title,
    description: event.description,
    website: event.website,
    tags: event.tags?.slice(0, 3) || [],
    priceRange: event.cost || 'See details',
    location: event.location,
    address: event.location,
    lgbtqFriendly: !!event.lgbtqFriendly,
    neighborhood: event.neighborhood || '',
    detailPath: event.source === 'lgbtq' ? `/lgbtq-events/${event.id}` : `/events/${event.id}`
  });

  const filteredEvents = useMemo(() => events.filter(event => {
    if (!searchTerm) return true;
    return event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.tags && event.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase())));
  }), [events, searchTerm]);

  const filteredRecurring = useMemo(() => recurringEvents.filter(event => {
    if (!searchTerm) return true;
    return event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.tags && event.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase())));
  }), [recurringEvents, searchTerm]);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <section className="page-header">
        <div className="swiss-container">
          <div className="header-content">
            <div>
              <h1 className="page-title">Tomorrow in <span style={{ color: 'var(--color-accent-sage)' }}>Toronto</span></h1>
              <p className="page-subtitle">{format(tomorrow, 'EEEE, MMMM d, yyyy')} • {filteredEvents.length} events tomorrow</p>
            </div>
          </div>
        </div>
      </section>
      <Container maxWidth="lg" sx={{ flex: 1, pb: 4 }}>
        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>Events for Tomorrow</Typography>
        {filteredEvents.length === 0 ? (
          <Typography>No events scheduled for tomorrow.</Typography>
        ) : (
          <Grid container spacing={3}>
            {filteredEvents.map(event => (
              <Grid item key={event.id} xs={12} sm={6} md={4}>
                <EnhancedMinimalistCard data={toCardData(event)} icon={<EventIcon />} />
              </Grid>
            ))}
          </Grid>
        )}
        {filteredRecurring.length > 0 && <>
          <Typography variant="h5" sx={{ mt: 6, mb: 2 }}>Recurring Events ({tomorrowDay})</Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {filteredRecurring.map(event => (
              <Grid item key={event.id} xs={12} sm={6} md={4}>
                <EnhancedMinimalistCard data={toCardData(event)} icon={<EventIcon />} />
              </Grid>
            ))}
          </Grid>
        </>}
      </Container>
    </Box>
  );
};

export default TomorrowInToronto; 