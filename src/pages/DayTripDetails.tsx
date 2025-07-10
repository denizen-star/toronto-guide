import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ShareIcon from '@mui/icons-material/Share';
import DirectionsIcon from '@mui/icons-material/Directions';
import LanguageIcon from '@mui/icons-material/Language';
import StarIcon from '@mui/icons-material/Star';
import { 
  type StandardizedDayTrip,
  loadDetailedDayTrip,
  type DetailedDayTrip,
  hasDetailedData
} from '../utils/dataLoader';

const DayTripDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<StandardizedDayTrip | null>(null);
  const [detailedTrip, setDetailedTrip] = useState<DetailedDayTrip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [_hasDetailed, setHasDetailed] = useState(false);
  const [expandedPlans, setExpandedPlans] = useState<number[]>([]);

  useEffect(() => {
    const loadTripData = async () => {
      try {
        setLoading(true);
        
        // Load JSON data using the same method as main page
        const response = await fetch('/daytrips_data.json');
        if (!response.ok) throw new Error('Failed to fetch day trips data');
        
        const json = await response.json();
        const tripsData = (json.daytrips || []).map((item: any) => {
          // Extract price from events if available
          const eventPrices = item.events?.map((event: any) => event.price).filter(Boolean) || [];
          const firstEventPrice = eventPrices[0] || 'Varies';
          
          // Extract season from booking info if available
          const season = item.booking?.peak_season || item.booking?.seasonal_availability || 'Year-round';
          
          // Calculate approximate travel time based on location
          const getTravelTime = (location: string) => {
            if (location?.toLowerCase().includes('niagara')) return '~1.5 hours';
            if (location?.toLowerCase().includes('algonquin')) return '~3 hours';
            if (location?.toLowerCase().includes('bruce')) return '~3.5 hours';
            if (location?.toLowerCase().includes('muskoka')) return '~2 hours';
            return '~2-3 hours';
          };
          
          return {
            id: item.id,
            title: item.name || item.title || '',
            description: typeof item.description === 'string'
              ? item.description
              : Array.isArray(item.whySpecial)
                ? item.whySpecial.join(' ')
                : typeof item.whySpecial === 'string'
                  ? item.whySpecial
                  : '',
            website: item.contact?.website || '',
            location: item.location || '',
            travelTime: getTravelTime(item.location),
            duration: 'Full day',
            cost: firstEventPrice,
            season: season,
            tags: item.tags || '',
            image: item.image || '',
            type: item.type || '',
            skillLevel: item.skillLevel || '',
            startDate: item.startDate || '',
            endDate: item.endDate || '',
            registrationDeadline: item.registrationDeadline || '',
            activityDetails: item.activityDetails || '',
            googleMapLink: item.googleMapLink || '',
            lgbtqFriendly: item.lgbtqFriendly || '',
            lastUpdated: item.lastUpdated || '',
            matchingId: item.matchingId || ''
          };
        });
        
        const currentTrip = tripsData.find(t => t.id === id);
        
        if (!currentTrip) {
          throw new Error('Day trip not found');
        }
        
        setTrip(currentTrip);
        
        // Check if detailed data is available
        if (id) {
          const hasDetailedDataAvailable = await hasDetailedData(id);
          setHasDetailed(hasDetailedDataAvailable);
          
          if (hasDetailedDataAvailable) {
            const detailedData = await loadDetailedDayTrip(id);
            setDetailedTrip(detailedData);
          }
        }
        
        setLoading(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load trip details');
        setLoading(false);
      }
    };

    loadTripData();
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${trip?.title} - Day Trip Details`,
        text: `Check out this amazing day trip: ${trip?.title}!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch(console.error);
    }
  };

  const handleDirections = () => {
    if (!trip) return;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trip.title)}`;
    window.open(mapsUrl, '_blank');
  };

  const togglePlan = (index: number) => {
    setExpandedPlans(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading trip details...</Typography>
      </Container>
    );
  }

  if (error || !trip) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error || 'Day trip not found'}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/day-trips')}>
          Back to Day Trips
        </Button>
      </Container>
    );
  }

  // Helper function to render day plan as JSX with clickable links
  const renderDayPlan = (dayPlan: any): JSX.Element => {
    if (typeof dayPlan === 'string') {
      return <span>{dayPlan}</span>;
    }
    
    if (typeof dayPlan === 'object') {
      const parts: JSX.Element[] = [];
      
      if (dayPlan.morning) {
        const morning = typeof dayPlan.morning === 'string' 
          ? <span>{dayPlan.morning}</span>
          : (
              <span>
                {dayPlan.morning.activity}
                {dayPlan.morning.venue && ` at ${dayPlan.morning.venue}`}
                {dayPlan.morning.website && (
                  <a 
                    href={dayPlan.morning.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#007bff', textDecoration: 'underline' }}
                  >
                    {dayPlan.morning.venue || 'Visit website'}
                  </a>
                )}
              </span>
            );
        parts.push(<span key="morning">Morning: {morning}</span>);
      }
      
      if (dayPlan.mid_morning) {
        const midMorning = typeof dayPlan.mid_morning === 'string' 
          ? <span>{dayPlan.mid_morning}</span>
          : (
              <span>
                {dayPlan.mid_morning.activity}
                {dayPlan.mid_morning.venue && ` at ${dayPlan.mid_morning.venue}`}
                {dayPlan.mid_morning.website && (
                  <a 
                    href={dayPlan.mid_morning.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#007bff', textDecoration: 'underline' }}
                  >
                    {dayPlan.mid_morning.venue || 'Visit website'}
                  </a>
                )}
              </span>
            );
        parts.push(<span key="mid_morning">Mid-morning: {midMorning}</span>);
      }
      
      if (dayPlan.lunch) {
        const lunch = typeof dayPlan.lunch === 'string' 
          ? <span>{dayPlan.lunch}</span>
          : (
              <span>
                {dayPlan.lunch.activity}
                {dayPlan.lunch.venue && ` at ${dayPlan.lunch.venue}`}
                {dayPlan.lunch.website && (
                  <a 
                    href={dayPlan.lunch.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#007bff', textDecoration: 'underline' }}
                  >
                    {dayPlan.lunch.venue || 'Visit website'}
                  </a>
                )}
              </span>
            );
        parts.push(<span key="lunch">Lunch: {lunch}</span>);
      }
      
      if (dayPlan.afternoon) {
        const afternoon = typeof dayPlan.afternoon === 'string' 
          ? <span>{dayPlan.afternoon}</span>
          : (
              <span>
                {dayPlan.afternoon.activity}
                {dayPlan.afternoon.venue && ` at ${dayPlan.afternoon.venue}`}
                {dayPlan.afternoon.website && (
                  <a 
                    href={dayPlan.afternoon.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#007bff', textDecoration: 'underline' }}
                  >
                    {dayPlan.afternoon.venue || 'Visit website'}
                  </a>
                )}
              </span>
            );
        parts.push(<span key="afternoon">Afternoon: {afternoon}</span>);
      }
      
      if (dayPlan.evening) {
        const evening = typeof dayPlan.evening === 'string' 
          ? <span>{dayPlan.evening}</span>
          : (
              <span>
                {dayPlan.evening.activity}
                {dayPlan.evening.venue && ` at ${dayPlan.evening.venue}`}
                {dayPlan.evening.website && (
                  <a 
                    href={dayPlan.evening.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#007bff', textDecoration: 'underline' }}
                  >
                    {dayPlan.evening.venue || 'Visit website'}
                  </a>
                )}
              </span>
            );
        parts.push(<span key="evening">Evening: {evening}</span>);
      }
      
      if (dayPlan.breakfast) {
        const breakfast = typeof dayPlan.breakfast === 'string' 
          ? <span>{dayPlan.breakfast}</span>
          : (
              <span>
                {dayPlan.breakfast.activity}
                {dayPlan.breakfast.venue && ` at ${dayPlan.breakfast.venue}`}
                {dayPlan.breakfast.website && (
                  <a 
                    href={dayPlan.breakfast.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#007bff', textDecoration: 'underline' }}
                  >
                    {dayPlan.breakfast.venue || 'Visit website'}
                  </a>
                )}
              </span>
            );
        parts.push(<span key="breakfast">Breakfast: {breakfast}</span>);
      }
      
      if (dayPlan.dinner) {
        const dinner = typeof dayPlan.dinner === 'string' 
          ? <span>{dayPlan.dinner}</span>
          : (
              <span>
                {dayPlan.dinner.activity}
                {dayPlan.dinner.venue && ` at ${dayPlan.dinner.venue}`}
                {dayPlan.dinner.website && (
                  <a 
                    href={dayPlan.dinner.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#007bff', textDecoration: 'underline' }}
                  >
                    {dayPlan.dinner.venue || 'Visit website'}
                  </a>
                )}
              </span>
            );
        parts.push(<span key="dinner">Dinner: {dinner}</span>);
      }
      
      return <div>{parts.map((part, index) => <span key={index}>{part}{index < parts.length - 1 ? '. ' : ''}</span>)}</div>;
    }
    
    return <span>Day plan details available</span>;
  };

  // Helper function to create timeline-aligned recommendations
  const createTimelineAlignedRecommendations = (planType: string, baseData: any) => {
    const recommendations: any = {};
    
    switch (planType) {
      case 'general':
        recommendations.morning = baseData.morning || { activity: "Depart from Toronto and arrive at destination", venue: "Travel Route" };
        recommendations.mid_morning = baseData.mid_morning || { activity: "Begin exploration of main attractions", venue: "Local Attractions" };
        recommendations.lunch = baseData.lunch || { activity: "Enjoy local cuisine", venue: "Local Restaurants" };
        recommendations.afternoon = baseData.afternoon || { activity: "Continue exploring main attractions", venue: "Scenic Spots" };
        recommendations.evening = baseData.evening || { activity: "Capture sunset views", venue: "Sunset Viewpoints" };
        break;
        
      case 'lgbtq':
        recommendations.morning = baseData.morning || { activity: "Start with LGBTQ+ friendly activities", venue: "Inclusive Venues" };
        recommendations.mid_morning = baseData.mid_morning || { activity: "Visit LGBTQ+ friendly cultural venues", venue: "Cultural Spaces" };
        recommendations.lunch = baseData.lunch || { activity: "Dine at welcoming establishments", venue: "LGBTQ+ Friendly Restaurants" };
        recommendations.afternoon = baseData.afternoon || { activity: "Connect with local LGBTQ+ community", venue: "Community Spaces" };
        recommendations.evening = baseData.evening || { activity: "Enjoy inclusive evening activities", venue: "LGBTQ+ Friendly Venues" };
        break;
        
      case 'outdoor':
        recommendations.morning = baseData.morning || { activity: "Begin with sunrise activities", venue: "Trailheads" };
        recommendations.mid_morning = baseData.mid_morning || { activity: "Explore natural trails and landscapes", venue: "Hiking Trails" };
        recommendations.lunch = baseData.lunch || { activity: "Picnic in scenic locations", venue: "Scenic Picnic Spots" };
        recommendations.afternoon = baseData.afternoon || { activity: "Continue outdoor exploration", venue: "Adventure Sites" };
        recommendations.evening = baseData.evening || { activity: "Capture outdoor sunset views", venue: "Sunset Viewpoints" };
        break;
        
      case 'culinary':
        recommendations.morning = baseData.morning || { activity: "Start with leisurely brunch", venue: "Local Cafes" };
        recommendations.mid_morning = baseData.mid_morning || { activity: "Visit local wineries and tasting rooms", venue: "Wineries" };
        recommendations.lunch = baseData.lunch || { activity: "Enjoy local cuisine", venue: "Local Restaurants" };
        recommendations.afternoon = baseData.afternoon || { activity: "Explore local breweries", venue: "Craft Breweries" };
        recommendations.evening = baseData.evening || { activity: "Experience fine dining", venue: "Fine Dining Restaurants" };
        break;
    }
    
    return recommendations;
  };

  // Create day plans from detailed data with timeline-aligned recommendations
  const dayPlans = detailedTrip ? [
    {
      title: "General Day Plan",
      activities: [
        { time: "9:00 AM", name: "Departure", description: "Start your journey from Toronto" },
        { time: "10:30 AM", name: "Arrival", description: "Arrive at destination and begin exploration" },
        { time: "12:00 PM", name: "Lunch Break", description: "Enjoy local cuisine" },
        { time: "2:00 PM", name: "Main Activities", description: "Explore the main attractions" },
        { time: "5:00 PM", name: "Sunset Viewing", description: "Capture beautiful sunset views" },
        { time: "7:00 PM", name: "Return Journey", description: "Head back to Toronto" }
      ],
      summaryTitle: "Perfect for Everyone",
      summaryContent: renderDayPlan(createTimelineAlignedRecommendations('general', detailedTrip.dayIn.general))
    },
    {
      title: "LGBTQ+ Friendly Day Plan",
      activities: [
        { time: "9:00 AM", name: "LGBTQ+ Friendly Start", description: "Begin with inclusive activities" },
        { time: "11:00 AM", name: "Cultural Experience", description: "Visit LGBTQ+ friendly venues" },
        { time: "1:00 PM", name: "Community Lunch", description: "Dine at welcoming establishments" },
        { time: "3:00 PM", name: "Social Activities", description: "Connect with local LGBTQ+ community" },
        { time: "6:00 PM", name: "Evening Social", description: "Enjoy inclusive evening activities" }
      ],
      summaryTitle: "LGBTQ+ Inclusive Experience",
      summaryContent: renderDayPlan(createTimelineAlignedRecommendations('lgbtq', detailedTrip.dayIn.gayDayIn))
    },
    {
      title: "Outdoor Adventure Day Plan",
      activities: [
        { time: "7:00 AM", name: "Early Start", description: "Begin with sunrise activities" },
        { time: "9:00 AM", name: "Hiking/Outdoor Activities", description: "Explore natural trails and landscapes" },
        { time: "12:00 PM", name: "Outdoor Lunch", description: "Picnic in scenic locations" },
        { time: "2:00 PM", name: "Adventure Activities", description: "Continue outdoor exploration" },
        { time: "5:00 PM", name: "Sunset Adventure", description: "Capture outdoor sunset views" }
      ],
      summaryTitle: "Outdoor Adventure Experience",
      summaryContent: renderDayPlan(createTimelineAlignedRecommendations('outdoor', detailedTrip.dayIn.outdoorsDay))
    },
    {
      title: "Bar & Restaurant Day Plan",
      activities: [
        { time: "10:00 AM", name: "Brunch", description: "Start with a leisurely brunch" },
        { time: "12:00 PM", name: "Wine Tasting", description: "Visit local wineries and tasting rooms" },
        { time: "2:00 PM", name: "Craft Beer Tour", description: "Explore local breweries" },
        { time: "5:00 PM", name: "Cocktail Hour", description: "Enjoy craft cocktails" },
        { time: "7:00 PM", name: "Fine Dining", description: "Experience local culinary scene" }
      ],
      summaryTitle: "Culinary & Beverage Experience",
      summaryContent: renderDayPlan(createTimelineAlignedRecommendations('culinary', detailedTrip.dayIn.barRestaurantDay))
    }
  ] : [];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Home
          </Link>
          <Typography>/</Typography>
          <Link to="/day-trips" style={{ textDecoration: 'none', color: 'inherit' }}>
            Day Trips
          </Link>
          <Typography>/</Typography>
          <Typography>{trip.title}</Typography>
        </Box>
      </Box>

      {/* Hero Section */}
      <Paper 
        sx={{ 
          p: 4, 
          mb: 4, 
          background: 'linear-gradient(135deg, #F5F3F0 0%, #FFFFFF 100%)',
          borderRadius: 2,
          border: '1px solid #E8EAED'
        }}
      >
        <Typography 
          variant="h2" 
          sx={{ 
            mb: 2, 
            fontWeight: 700, 
            textTransform: 'uppercase',
            letterSpacing: '-0.01em',
            color: '#6D6D6D', // lighter, less prominent
            fontSize: { xs: '1.2rem', md: '1.75rem' }, // reduced by 2 more points
            textAlign: 'center'
          }}
        >
          {trip.title}
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 4, 
            fontSize: { xs: '0.8rem', md: '0.9rem' }, // reduced by 2 more points
            lineHeight: 1.6,
            color: '#4A4A4A',
            textAlign: 'center'
          }}
        >
          {trip.description}
        </Typography>

        {/* Quick Info Grid */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Distance
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="#A8B5A0">
                {trip.travelTime}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Duration
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="#A8B5A0">
                {trip.duration}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Best Season
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="#A8B5A0">
                {trip.season}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Cost
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="#A8B5A0">
                {trip.cost}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', mt: '12px' }}>
          <IconButton
            onClick={handleDirections}
            sx={{ 
              border: '1px solid #A8B5A0',
              color: '#A8B5A0',
              width: 48,
              height: 48,
              p: 0,
              justifyContent: 'center',
              '&:hover': { borderColor: '#8B9A85', color: '#8B9A85', background: 'rgba(168,181,160,0.08)' }
            }}
            aria-label="Get Directions"
          >
            <DirectionsIcon />
          </IconButton>
          <IconButton
            onClick={handleShare}
            sx={{ 
              border: '1px solid #A8B5A0',
              color: '#A8B5A0',
              width: 48,
              height: 48,
              p: 0,
              justifyContent: 'center',
              '&:hover': { borderColor: '#8B9A85', color: '#8B9A85', background: 'rgba(168,181,160,0.08)' }
            }}
            aria-label="Share"
          >
            <ShareIcon />
          </IconButton>
          <IconButton
            component="a"
            href={trip.website}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ 
              border: '1px solid #A8B5A0',
              color: '#A8B5A0',
              width: 48,
              height: 48,
              p: 0,
              justifyContent: 'center',
              '&:hover': { borderColor: '#8B9A85', color: '#8B9A85', background: 'rgba(168,181,160,0.08)' }
            }}
            aria-label="Visit Website"
          >
            <LanguageIcon />
          </IconButton>
        </Box>
      </Paper>

      {/* Detailed Content (if available) */}
      {detailedTrip && (
        <>
          {/* Why This Trip is Special */}
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" sx={{ mb: 3, color: '#202124', fontWeight: 600 }}>
              Why This Trip is Special
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 1,
                alignItems: 'start',
              }}
            >
              {detailedTrip.whySpecial.map((feature, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                  <StarIcon sx={{ color: '#A8B5A0', fontSize: 20, mt: '2px', flexShrink: 0 }} />
                  <Typography variant="body1" sx={{ color: '#4A4A4A', ml: 1, fontSize: '1rem', lineHeight: 1.4 }}>
                    {feature}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Day Plans */}
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" sx={{ mb: 3, color: '#202124', fontWeight: 600 }}>
              Your Perfect Day Plans
            </Typography>
            
            {dayPlans.map((plan, index) => (
              <Accordion 
                key={index}
                expanded={expandedPlans.includes(index)}
                onChange={() => togglePlan(index)}
                sx={{ 
                  mb: 2,
                  '&:before': { display: 'none' },
                  border: '1px solid #E8EAED',
                  borderRadius: 2,
                  overflow: 'hidden'
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ 
                    bgcolor: 'rgba(168, 181, 160, 0.1)',
                    '&:hover': { bgcolor: 'rgba(168, 181, 160, 0.15)' }
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#202124' }}>
                    {plan.title}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 3 }}>
                  <Box sx={{ borderLeft: '3px solid #A8B5A0', pl: 3, mb: 3 }}>
                    {plan.activities.map((activity, actIndex) => (
                      <Box key={actIndex} sx={{ mb: 2, position: 'relative' }}>
                        <Box sx={{ 
                          position: 'absolute', 
                          left: '-36px', 
                          top: '8px',
                          width: '12px',
                          height: '12px',
                          bgcolor: '#A8B5A0',
                          borderRadius: '50%',
                          boxShadow: '0 0 0 4px rgba(168, 181, 160, 0.2)'
                        }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#A8B5A0' }}>
                          {activity.time}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#202124' }}>
                          {activity.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#4A4A4A' }}>
                          {activity.description}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  
                  <Box sx={{ 
                    p: 3, 
                    bgcolor: 'rgba(168, 181, 160, 0.05)', 
                    borderRadius: 2,
                    border: '1px solid rgba(168, 181, 160, 0.1)'
                  }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#202124', mb: 1 }}>
                      {plan.summaryTitle}
                    </Typography>
                    <Box sx={{ color: '#4A4A4A', lineHeight: 1.6 }}>
                      {typeof plan.summaryContent === 'string' ? (
                        <Typography variant="body1">{plan.summaryContent}</Typography>
                      ) : (
                        plan.summaryContent
                      )}
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Paper>

          {/* Nearby Attractions */}
          {detailedTrip.nearby && detailedTrip.nearby.length > 0 && (
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h4" sx={{ mb: 2, color: '#202124', fontWeight: 600 }}>
                Nearby Attractions
              </Typography>
              <Grid container spacing={2}>
                {detailedTrip.nearby.map((attraction, index) => {
                  let linkId: string | null = null;
                  if (attraction.name === 'Collingwood') linkId = 'dt7';
                  if (attraction.name === 'Wasaga Beach') linkId = 'dt32';
                  if (attraction.name === 'Scenic Caves Nature Adventures') linkId = 'dt6';
                  const CardWrapper = linkId ? Link : 'div';
                  const cardProps = linkId ? { to: `/day-trips/${linkId}`, style: { textDecoration: 'none' } } : {};
                  return (
                    <Grid item xs={12} md={6} key={index}>
                      <Card
                        component={CardWrapper as any}
                        {...cardProps}
                        sx={{
                          height: '100%',
                          border: '1px solid #E8EAED',
                          boxShadow: 'none',
                          p: 2,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          minHeight: 120,
                          cursor: linkId ? 'pointer' : 'default',
                          transition: 'box-shadow 0.2s',
                          '&:hover': linkId ? { boxShadow: '0 4px 12px rgba(0,0,0,0.08)' } : {},
                        }}
                      >
                        <CardContent sx={{ p: '12px !important', pb: '8px !important' }}>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 600, color: linkId ? '#2A5D8A' : '#202124', mb: 1, textDecoration: linkId ? 'underline' : 'none' }}
                          >
                            {attraction.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#4A4A4A', fontSize: '1rem' }}>
                            {attraction.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Paper>
          )}

          {/* Must Not Miss */}
          {detailedTrip.mustNotMiss && detailedTrip.mustNotMiss.length > 0 && (
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h4" sx={{ mb: 2, color: '#202124', fontWeight: 600 }}>
                Must Not Miss
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                  gap: 1,
                  alignItems: 'start',
                }}
              >
                {detailedTrip.mustNotMiss.map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                    <StarIcon sx={{ color: '#A8B5A0', fontSize: 20, mt: '2px', flexShrink: 0 }} />
                    <Typography variant="body1" sx={{ color: '#4A4A4A', ml: 1, fontSize: '1rem', lineHeight: 1.4 }}>
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          )}

          {/* Reviews & Sentiment */}
          {detailedTrip.reviewsSentiment && (
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h4" sx={{ mb: 2, color: '#202124', fontWeight: 600 }}>
                What Visitors Say
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ mb: 1, color: '#202124', fontWeight: 600 }}>
                  Overall Experience
                </Typography>
                <Typography variant="body1" sx={{ color: '#4A4A4A', lineHeight: 1.6 }}>
                  {detailedTrip.reviewsSentiment.overall}
                </Typography>
              </Box>
              {detailedTrip.reviewsSentiment.positives && detailedTrip.reviewsSentiment.positives.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ mb: 1, color: '#202124', fontWeight: 600 }}>
                    What Visitors Love
                  </Typography>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                      gap: 1,
                      alignItems: 'start',
                    }}
                  >
                    {detailedTrip.reviewsSentiment.positives.map((positive, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                        <StarIcon sx={{ color: '#A8B5A0', fontSize: 20, mt: '2px', flexShrink: 0 }} />
                        <Typography variant="body2" sx={{ color: '#4A4A4A', ml: 1, fontSize: '1rem', lineHeight: 1.4 }}>
                          {positive}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
              {detailedTrip.reviewsSentiment.negatives && detailedTrip.reviewsSentiment.negatives.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ mb: 1, color: '#202124', fontWeight: 600 }}>
                    Things to Consider
                  </Typography>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                      gap: 1,
                      alignItems: 'start',
                    }}
                  >
                    {detailedTrip.reviewsSentiment.negatives.map((negative, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                        <StarIcon sx={{ color: '#FFD600', fontSize: 20, mt: '2px', flexShrink: 0 }} />
                        <Typography variant="body2" sx={{ color: '#4A4A4A', ml: 1, fontSize: '1rem', lineHeight: 1.4 }}>
                          {negative}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Paper>
          )}
        </>
      )}

      {/* Back Button */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/day-trips')}
          sx={{ 
            borderColor: '#A8B5A0', 
            color: '#A8B5A0',
            '&:hover': { borderColor: '#8B9A85', color: '#8B9A85' }
          }}
        >
          Back to Day Trips
        </Button>
      </Box>
    </Container>
  );
};

export default DayTripDetails; 