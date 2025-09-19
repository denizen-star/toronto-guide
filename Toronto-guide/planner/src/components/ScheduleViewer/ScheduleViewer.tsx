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
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  CalendarToday,
  ChevronLeft,
  ChevronRight,
  AccessTime,
  LocationOn,
  AttachMoney,
  People,
  ExpandMore,
  Today,
  ViewWeek,
  CalendarViewMonth,
  DateRange,
  Download,
  EventAvailable,
  FileDownload,
  PictureAsPdf,
  CloudDownload,
  Warning,
  CheckCircle,
} from '@mui/icons-material';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { WeeklySchedule, ScheduleItem, UserPersona } from '../../types';
import { ExportService } from '../../services/exportService';
import { CalendarService } from '../../services/calendarService';
import { ConflictResolutionService } from '../../services/conflictResolutionService';
import { CreativeSuggestionsService } from '../../services/creativeSuggestionsService';

interface ScheduleViewerProps {
  schedule: WeeklySchedule | null;
  persona: UserPersona | null;
  loading?: boolean;
}

const ScheduleViewer: React.FC<ScheduleViewerProps> = ({
  schedule,
  persona,
  loading = false
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month' | 'year'>('week');
  const [conflicts, setConflicts] = useState<any>(null);
  const [creativeSuggestion, setCreativeSuggestion] = useState<any>(null);

  // Generate mock schedule data if none provided
  const mockScheduleData = React.useMemo(() => {
    if (schedule) return schedule;
    
    const weekStart = startOfWeek(currentDate);
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = addDays(weekStart, i);
      const dayName = format(date, 'EEEE').toLowerCase();
      
      // Full day schedule based on requirements
      const mockActivities: ScheduleItem[] = [];
      const isWeekend = dayName === 'saturday' || dayName === 'sunday';
      
      if (persona?.persona_id === 'kevin_job_search') {
        // 6:00 AM - Wake up & Hydration (weekdays only, Kevin not a morning person)
        if (!isWeekend) {
          mockActivities.push({
            start_time: '06:00',
            end_time: '06:30',
            date: format(date, 'yyyy-MM-dd'),
            type: 'individual',
            activity: {
              id: '1',
              name: 'Wake Up & Hydration',
              category: 'wellness',
              subcategory: 'routine',
              description: 'Start day with water and light stretching (Kevin not a morning person)',
              cost_cad: 0,
              duration_minutes: 30,
              networking_potential: 0,
              location: 'Home',
              tags: ['morning', 'wellness', 'routine'],
              requirements: [],
              best_time: ['morning'],
              frequency: 'daily'
            }
          });
        } else {
          // Weekend late start
          mockActivities.push({
            start_time: '08:00',
            end_time: '08:30',
            date: format(date, 'yyyy-MM-dd'),
            type: 'individual',
            activity: {
              id: '1',
              name: 'Weekend Wake Up',
              category: 'wellness',
              subcategory: 'routine',
              description: 'Relaxed weekend morning start',
              cost_cad: 0,
              duration_minutes: 30,
              networking_potential: 0,
              location: 'Home',
              tags: ['morning', 'weekend', 'relaxed'],
              requirements: [],
              best_time: ['morning'],
              frequency: 'weekend'
            }
          });
        }

        // Job Search Activities (9:00-12:00 PM weekdays)
        if (!isWeekend) {
          mockActivities.push({
            start_time: '09:00',
            end_time: '10:30',
            date: format(date, 'yyyy-MM-dd'),
            type: 'individual',
            activity: {
              id: '2',
              name: 'Job Applications & Company Research',
              category: 'career',
              subcategory: 'job_search',
              description: 'Apply to Head of Data positions, research companies, update LinkedIn profile',
              cost_cad: 0,
              duration_minutes: 90,
              networking_potential: 7,
              location: 'Home Office',
              tags: ['job_search', 'career', 'applications', 'linkedin'],
              requirements: ['laptop', 'resume', 'cover_letter'],
              best_time: ['morning'],
              frequency: 'daily'
            }
          });

          mockActivities.push({
            start_time: '10:45',
            end_time: '12:00',
            date: format(date, 'yyyy-MM-dd'),
            type: 'individual',
            activity: {
              id: '3',
              name: 'Data Science Skill Development',
              category: 'professional',
              subcategory: 'learning',
              description: 'Online courses, certifications, technical skill building for data roles',
              cost_cad: 0,
              duration_minutes: 75,
              networking_potential: 3,
              location: 'Home Office',
              tags: ['learning', 'data_science', 'skills', 'certification'],
              requirements: ['laptop', 'online_course_access'],
              best_time: ['morning'],
              frequency: 'daily'
            }
          });
        }

        // Lunch with Peter
        mockActivities.push({
          start_time: isWeekend ? '12:00' : '12:30',
          end_time: isWeekend ? '13:00' : '13:30',
          date: format(date, 'yyyy-MM-dd'),
          type: 'couple',
          activity: {
            id: '4',
            name: 'Lunch with Peter',
            category: 'couple',
            subcategory: 'meals',
            description: 'Quality time over shared meal, discuss job search progress',
            cost_cad: 25,
            duration_minutes: 60,
            networking_potential: 0,
            location: 'Home / Local Restaurant',
            tags: ['couple', 'meal', 'connection', 'support'],
            requirements: [],
            best_time: ['afternoon'],
            frequency: 'daily'
          }
        });

        // Afternoon Activities (weekdays: interview prep, weekends: networking)
        if (!isWeekend) {
          mockActivities.push({
            start_time: '14:00',
            end_time: '15:30',
            date: format(date, 'yyyy-MM-dd'),
            type: 'individual',
            activity: {
              id: '5',
              name: 'Interview Preparation',
              category: 'career',
              subcategory: 'interview_prep',
              description: 'Practice data science questions, prepare case studies, mock interviews',
              cost_cad: 0,
              duration_minutes: 90,
              networking_potential: 5,
              location: 'Home Office',
              tags: ['interview_prep', 'practice', 'case_studies'],
              requirements: ['laptop', 'whiteboard'],
              best_time: ['afternoon'],
              frequency: 'daily'
            }
          });

          mockActivities.push({
            start_time: '16:00',
            end_time: '17:00',
            date: format(date, 'yyyy-MM-dd'),
            type: 'networking',
            activity: {
              id: '6',
              name: 'Professional Networking Follow-up',
              category: 'networking',
              subcategory: 'professional',
              description: 'LinkedIn outreach, follow up with contacts, schedule coffee chats',
              cost_cad: 0,
              duration_minutes: 60,
              networking_potential: 8,
              location: 'Home Office / Coffee Shop',
              tags: ['networking', 'linkedin', 'follow_up', 'coffee_chats'],
              requirements: ['laptop', 'phone'],
              best_time: ['afternoon'],
              frequency: 'daily'
            }
          });
        }

        // Running Schedule (Tue/Thu/Fri/Sun)
        if (dayName === 'tuesday' || dayName === 'thursday' || dayName === 'friday' || dayName === 'sunday') {
          mockActivities.push({
            start_time: isWeekend ? '16:00' : '17:30',
            end_time: isWeekend ? '17:00' : '18:30',
            date: format(date, 'yyyy-MM-dd'),
            type: 'individual',
            activity: {
              id: '7',
              name: 'Half Marathon Training Run',
              category: 'fitness',
              subcategory: 'running',
              description: 'Solo training run for half marathon preparation - building endurance',
              cost_cad: 0,
              duration_minutes: 60,
              networking_potential: 0,
              location: 'Toronto Harbourfront Trail / High Park',
              tags: ['running', 'fitness', 'training', 'solo', 'half_marathon'],
              requirements: ['running_gear', 'water', 'fitness_tracker'],
              best_time: ['evening'],
              frequency: 'scheduled'
            }
          });
        }

        // Dinner with Peter
        mockActivities.push({
          start_time: isWeekend ? '18:00' : '19:00',
          end_time: isWeekend ? '19:00' : '20:00',
          date: format(date, 'yyyy-MM-dd'),
          type: 'couple',
          activity: {
            id: '8',
            name: 'Dinner with Peter',
            category: 'couple',
            subcategory: 'meals',
            description: 'Evening meal together, discuss day and plans',
            cost_cad: 40,
            duration_minutes: 60,
            networking_potential: 0,
            location: 'Home / Restaurant',
            tags: ['couple', 'dinner', 'connection', 'debrief'],
            requirements: [],
            best_time: ['evening'],
            frequency: 'daily'
          }
        });

        // Evening Activities
        if (!isWeekend) {
          mockActivities.push({
            start_time: '20:30',
            end_time: '21:30',
            date: format(date, 'yyyy-MM-dd'),
            type: 'individual',
            activity: {
              id: '9',
              name: 'Reflection & Planning',
              category: 'personal_development',
              subcategory: 'planning',
              description: 'Review job search progress, plan next day activities, journal',
              cost_cad: 0,
              duration_minutes: 60,
              networking_potential: 0,
              location: 'Home',
              tags: ['reflection', 'planning', 'journal', 'review'],
              requirements: ['journal', 'laptop'],
              best_time: ['evening'],
              frequency: 'daily'
            }
          });

          mockActivities.push({
            start_time: '21:30',
            end_time: '22:30',
            date: format(date, 'yyyy-MM-dd'),
            type: 'couple',
            activity: {
              id: '10',
              name: 'Evening Together Time',
              category: 'couple',
              subcategory: 'quality_time',
              description: 'Relaxing together, watching shows, intimate conversation',
              cost_cad: 0,
              duration_minutes: 60,
              networking_potential: 0,
              location: 'Home',
              tags: ['couple', 'relaxation', 'intimacy', 'wind_down'],
              requirements: [],
              best_time: ['evening'],
              frequency: 'daily'
            }
          });
        } else {
          // Weekend evening activities (until midnight)
          mockActivities.push({
            start_time: '20:00',
            end_time: '22:00',
            date: format(date, 'yyyy-MM-dd'),
            type: 'couple',
            activity: {
              id: '9',
              name: 'Weekend Date Night',
              category: 'couple',
              subcategory: 'date',
              description: 'Special weekend time together - dinner, activities, or exploring Toronto',
              cost_cad: 80,
              duration_minutes: 120,
              networking_potential: 2,
              location: 'Restaurant / Entertainment District',
              tags: ['couple', 'date_night', 'weekend', 'toronto_exploration'],
              requirements: [],
              best_time: ['evening'],
              frequency: 'weekend'
            }
          });

          mockActivities.push({
            start_time: '22:30',
            end_time: '24:00',
            date: format(date, 'yyyy-MM-dd'),
            type: 'couple',
            activity: {
              id: '10',
              name: 'Late Night Together',
              category: 'couple',
              subcategory: 'intimacy',
              description: 'Private couple time, deep conversations, intimacy',
              cost_cad: 0,
              duration_minutes: 90,
              networking_potential: 0,
              location: 'Home',
              tags: ['couple', 'intimacy', 'late_night', 'private'],
              requirements: [],
              best_time: ['night'],
              frequency: 'weekend'
            }
          });
        }
      } else {
        // Simplified schedule for other personas
        mockActivities.push({
          start_time: '07:00',
          end_time: '08:00',
          date: format(date, 'yyyy-MM-dd'),
          type: 'individual',
          activity: {
            id: '1',
            name: 'Morning Exercise',
            category: 'fitness',
            subcategory: 'cardio',
            description: 'Running or gym workout to start the day energized',
            cost_cad: 0,
            duration_minutes: 60,
            networking_potential: 2,
            location: 'Local Park / Gym',
            tags: ['fitness', 'running', 'energy'],
            requirements: ['workout clothes'],
            best_time: ['morning'],
            frequency: 'daily'
          }
        });

        mockActivities.push({
          start_time: '12:30',
          end_time: '13:30',
          date: format(date, 'yyyy-MM-dd'),
          type: 'couple',
          activity: {
            id: '2',
            name: 'Lunch with Peter',
            category: 'couple',
            subcategory: 'meals',
            description: 'Quality time over a shared meal',
            cost_cad: 25,
            duration_minutes: 60,
            networking_potential: 0,
            location: 'Home / Restaurant',
            tags: ['couple', 'meal', 'connection'],
            requirements: [],
            best_time: ['afternoon'],
            frequency: 'daily'
          }
        });
      }

      // Add weekend-specific activities
      if (dayName === 'saturday' || dayName === 'sunday') {
        mockActivities.push({
          start_time: '14:00',
          end_time: '16:00',
          date: format(date, 'yyyy-MM-dd'),
          type: 'networking',
          activity: {
            id: '4',
            name: persona?.persona_id === 'kevin_job_search' ? 
                  (dayName === 'sunday' ? 'Mass at St. Basil Catholic Church' : 'Toronto Data Science Meetup') :
                  persona?.persona_id === 'kevin_working' ? 'Professional Networking Event' : 'Community Workshop',
            category: 'networking',
            subcategory: 'social',
            description: 'Networking event aligned with personal interests',
            cost_cad: persona?.constraints.max_daily_budget || 50,
            duration_minutes: 120,
            networking_potential: 8,
            location: persona?.preferences.preferred_locations[0] || 'Downtown Toronto',
            tags: ['networking', 'social', 'weekend'],
            requirements: [],
            best_time: ['afternoon'],
            frequency: 'weekly'
          }
        });
      }

      return {
        date: format(date, 'yyyy-MM-dd'),
        time_slots: mockActivities,
        daily_summary: {
          total_cost: mockActivities.reduce((sum, item) => sum + item.activity.cost_cad, 0),
          total_networking_potential: mockActivities.reduce((sum, item) => sum + item.activity.networking_potential, 0),
          activity_count: mockActivities.length,
          categories_covered: Array.from(new Set(mockActivities.map(item => item.activity.category)))
        }
      };
    });

    return {
      week_start: format(weekStart, 'yyyy-MM-dd'),
      week_end: format(addDays(weekStart, 6), 'yyyy-MM-dd'),
      days,
      weekly_summary: {
        total_cost: days.reduce((sum, day) => sum + day.daily_summary.total_cost, 0),
        total_activities: days.reduce((sum, day) => sum + day.daily_summary.activity_count, 0),
        networking_activities: days.reduce((sum, day) => sum + day.time_slots.filter(slot => slot.type === 'networking').length, 0),
        couple_activities: days.reduce((sum, day) => sum + day.time_slots.filter(slot => slot.type === 'couple').length, 0),
        individual_activities: days.reduce((sum, day) => sum + day.time_slots.filter(slot => slot.type === 'individual').length, 0),
      }
    };
  }, [schedule, currentDate, persona]);

  const selectedDay = viewMode === 'day' ? 
    mockScheduleData.days.find(day => isSameDay(new Date(day.date), currentDate)) :
    null;

  // Check for conflicts and get creative suggestions
  useEffect(() => {
    if (mockScheduleData && persona) {
      // Check for conflicts in current day or week
      const activitiesToCheck = viewMode === 'day' && selectedDay 
        ? selectedDay.time_slots 
        : mockScheduleData.days.flatMap(day => day.time_slots);
      
      const conflictAnalysis = ConflictResolutionService.resolveScheduleConflicts(activitiesToCheck);
      setConflicts(conflictAnalysis);

      // Get creative suggestion
      const suggestion = CreativeSuggestionsService.getWeeklySuggestion(persona);
      setCreativeSuggestion(suggestion);
    }
  }, [mockScheduleData, persona, viewMode, selectedDay]);

  const handleExportMarkdown = () => {
    if (mockScheduleData) {
      ExportService.exportToMarkdown(mockScheduleData);
    }
  };

  const handleExportPDF = async () => {
    if (mockScheduleData) {
      try {
        await ExportService.exportToPDF(mockScheduleData, 'schedule-content');
      } catch (error) {
        console.error('PDF export failed:', error);
      }
    }
  };

  const handleExportCSV = () => {
    if (mockScheduleData) {
      ExportService.exportToCSV(mockScheduleData);
    }
  };

  const handleAddToGoogleCalendar = (activity: ScheduleItem) => {
    const url = CalendarService.generateGoogleCalendarUrl(activity);
    window.open(url, '_blank');
  };

  const handleDownloadICS = (activity: ScheduleItem) => {
    CalendarService.generateICSFile(activity);
  };

  const handleDownloadWeeklyICS = () => {
    if (mockScheduleData) {
      const allActivities = mockScheduleData.days.flatMap(day => day.time_slots);
      CalendarService.generateWeeklyICS(allActivities);
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'individual': return '#4CAF50';
      case 'networking': return '#2196F3';
      case 'couple': return '#E91E63';
      default: return '#9E9E9E';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'individual': return '🏃';
      case 'networking': return '🤝';
      case 'couple': return '💕';
      default: return '📅';
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = addDays(currentDate, direction === 'next' ? 7 : -7);
    setCurrentDate(newDate);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6">Generating your personalized schedule...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarToday /> Your Personalized Schedule
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* View Mode Buttons */}
          <Button
            variant={viewMode === 'day' ? 'contained' : 'outlined'}
            startIcon={<Today />}
            onClick={() => setViewMode('day')}
            size="small"
          >
            Daily
          </Button>
          <Button
            variant={viewMode === 'week' ? 'contained' : 'outlined'}
            startIcon={<ViewWeek />}
            onClick={() => setViewMode('week')}
            size="small"
          >
            Weekly
          </Button>
          <Button
            variant={viewMode === 'month' ? 'contained' : 'outlined'}
            startIcon={<CalendarViewMonth />}
            onClick={() => setViewMode('month')}
            size="small"
          >
            Monthly
          </Button>
          <Button
            variant={viewMode === 'year' ? 'contained' : 'outlined'}
            startIcon={<DateRange />}
            onClick={() => setViewMode('year')}
            size="small"
          >
            Yearly
          </Button>
          
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          
          {/* Export Buttons */}
          <Button
            startIcon={<FileDownload />}
            onClick={handleExportMarkdown}
            size="small"
            variant="outlined"
          >
            Markdown
          </Button>
          <Button
            startIcon={<PictureAsPdf />}
            onClick={handleExportPDF}
            size="small"
            variant="outlined"
          >
            PDF
          </Button>
          <Button
            startIcon={<CloudDownload />}
            onClick={handleDownloadWeeklyICS}
            size="small"
            variant="outlined"
          >
            Calendar
          </Button>
        </Box>
      </Box>

      {/* Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigateWeek('prev')}>
          <ChevronLeft />
        </IconButton>
        
        <Typography variant="h6">
          {viewMode === 'week' ? 
            `Week of ${format(new Date(mockScheduleData.week_start), 'MMM dd, yyyy')}` :
            format(currentDate, 'EEEE, MMM dd, yyyy')
          }
        </Typography>
        
        <IconButton onClick={() => navigateWeek('next')}>
          <ChevronRight />
        </IconButton>
      </Box>

      {/* Conflict Alerts */}
      {conflicts && conflicts.hasConflicts && (
        <Paper sx={{ p: 2, mb: 3, backgroundColor: '#FFF3E0', border: '1px solid #FF9800' }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#F57C00' }}>
            <Warning /> Schedule Conflicts Detected
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {conflicts.conflicts.length} conflict(s) found and automatically resolved:
          </Typography>
          {conflicts.resolutionLog.slice(0, 3).map((log: string, index: number) => (
            <Typography key={index} variant="body2" sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>
              • {log}
            </Typography>
          ))}
        </Paper>
      )}

      {/* Creative Suggestion */}
      {creativeSuggestion && (
        <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(45deg, #9C27B0 30%, #E91E63 90%)', color: 'white' }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            ✨ Weekly Creative Suggestion
          </Typography>
          <Typography variant="h5" gutterBottom>
            {creativeSuggestion.title}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {creativeSuggestion.description}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            <Chip label={`$${creativeSuggestion.estimatedCost}`} size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} />
            <Chip label={`${creativeSuggestion.duration} min`} size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} />
            <Chip label={`Networking: ${creativeSuggestion.networkingPotential}/10`} size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} />
            <Chip label={`Alignment: ${creativeSuggestion.alignmentScore}/10`} size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} />
          </Box>
          
          {/* Website and Contact Information */}
          {creativeSuggestion.website && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                📍 {creativeSuggestion.location}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                🌐 Website: <a href={creativeSuggestion.website} target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'underline' }}>
                  {creativeSuggestion.website}
                </a>
              </Typography>
              {creativeSuggestion.registrationLink && (
                <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                  📝 Register: <a href={creativeSuggestion.registrationLink} target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'underline' }}>
                    {creativeSuggestion.registrationLink}
                  </a>
                </Typography>
              )}
              {creativeSuggestion.contactInfo && (
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  📞 Contact: {creativeSuggestion.contactInfo}
                </Typography>
              )}
            </Box>
          )}
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              variant="contained" 
              sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' } }}
              size="small"
            >
              Add to Schedule
            </Button>
            {creativeSuggestion.website && (
              <Button 
                variant="outlined" 
                sx={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
                size="small"
                onClick={() => window.open(creativeSuggestion.website, '_blank')}
              >
                Visit Website
              </Button>
            )}
          </Box>
        </Paper>
      )}

      {/* Weekly Summary */}
      {viewMode === 'week' && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Weekly Summary</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">{mockScheduleData.weekly_summary.total_activities}</Typography>
                <Typography variant="body2">Total Activities</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: '#4CAF50' }}>{mockScheduleData.weekly_summary.individual_activities}</Typography>
                <Typography variant="body2">Individual</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: '#2196F3' }}>{mockScheduleData.weekly_summary.networking_activities}</Typography>
                <Typography variant="body2">Networking</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: '#E91E63' }}>{mockScheduleData.weekly_summary.couple_activities}</Typography>
                <Typography variant="body2">Couple</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Schedule Content */}
      <div id="schedule-content">
      {viewMode === 'year' ? (
        /* Yearly View */
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            2025 Yearly Plan - Job Search Kevin
          </Typography>
          <Grid container spacing={2}>
            {Array.from({ length: 12 }, (_, monthIndex) => (
              <Grid key={monthIndex} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {format(new Date(2025, monthIndex, 1), 'MMMM yyyy')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {monthIndex < 3 ? 'Intensive Job Search Phase' :
                     monthIndex < 6 ? 'Skill Development & Networking' :
                     monthIndex < 9 ? 'Interview Season' : 'New Role Integration'}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Chip label={`${20 + monthIndex} activities`} size="small" color="primary" />
                    <Chip label={`$${800 + monthIndex * 100}`} size="small" sx={{ ml: 1 }} />
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      ) : viewMode === 'month' ? (
        /* Monthly View */
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {format(currentDate, 'MMMM yyyy')} - Monthly Overview
          </Typography>
          <Grid container spacing={1}>
            {Array.from({ length: 30 }, (_, dayIndex) => (
              <Grid key={dayIndex} size={{ xs: 12/7, sm: 12/7 }}>
                <Card sx={{ p: 1, minHeight: 80, textAlign: 'center' }}>
                  <Typography variant="body2" fontWeight="bold">
                    {dayIndex + 1}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Box sx={{ width: 8, height: 8, backgroundColor: '#4CAF50', borderRadius: '50%', mx: 'auto', mb: 0.5 }} />
                    <Box sx={{ width: 8, height: 8, backgroundColor: '#2196F3', borderRadius: '50%', mx: 'auto', mb: 0.5 }} />
                    <Box sx={{ width: 8, height: 8, backgroundColor: '#E91E63', borderRadius: '50%', mx: 'auto' }} />
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      ) : viewMode === 'week' ? (
        <Grid container spacing={2}>
          {mockScheduleData.days.map((day) => (
            <Grid key={day.date} size={{ xs: 12, md: 6, lg: 4 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {format(new Date(day.date), 'EEEE')}
                    <Chip 
                      label={`${day.daily_summary.activity_count} activities`} 
                      size="small" 
                      color="primary" 
                    />
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {format(new Date(day.date), 'MMM dd, yyyy')}
                  </Typography>

                  <List dense>
                    {day.time_slots.map((slot, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <Typography variant="body2">
                            {getActivityIcon(slot.type)}
                          </Typography>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" fontWeight="bold">
                                {slot.start_time}
                              </Typography>
                              <Typography variant="body2">
                                {slot.activity.name}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                              {slot.activity.cost_cad > 0 && (
                                <Chip 
                                  label={`$${slot.activity.cost_cad}`} 
                                  size="small" 
                                  variant="outlined"
                                  sx={{ fontSize: '0.7rem', height: 20 }}
                                />
                              )}
                              <Chip 
                                label={slot.type} 
                                size="small" 
                                sx={{ 
                                  backgroundColor: getActivityColor(slot.type),
                                  color: 'white',
                                  fontSize: '0.7rem',
                                  height: 20
                                }}
                              />
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Divider sx={{ my: 1 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Total: ${day.daily_summary.total_cost}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Networking: {day.daily_summary.total_networking_potential}/10
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        /* Day View */
        selectedDay && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Daily Schedule - {format(new Date(selectedDay.date), 'EEEE, MMM dd, yyyy')}
            </Typography>
            
            {selectedDay.time_slots.map((slot, index) => (
              <Accordion key={index} sx={{ mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    <Typography variant="h6" sx={{ minWidth: 80 }}>
                      {slot.start_time}
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" sx={{ flex: 1 }}>
                      {slot.activity.name}
                    </Typography>
                    <Chip 
                      label={slot.type} 
                      size="small" 
                      sx={{ 
                        backgroundColor: getActivityColor(slot.type),
                        color: 'white'
                      }}
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 8 }}>
                      <Typography variant="body1" paragraph>
                        {slot.activity.description}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        {slot.activity.tags.map((tag, tagIndex) => (
                          <Chip key={tagIndex} label={tag} size="small" variant="outlined" />
                        ))}
                      </Box>
                    </Grid>
                    
                    <Grid size={{ xs: 12, md: 4 }}>
                      <List dense>
                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon><AccessTime fontSize="small" /></ListItemIcon>
                          <ListItemText 
                            primary={`${slot.start_time} - ${slot.end_time}`}
                            secondary={`${slot.activity.duration_minutes} minutes`}
                          />
                        </ListItem>
                        
                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon><LocationOn fontSize="small" /></ListItemIcon>
                          <ListItemText primary={slot.activity.location} />
                        </ListItem>
                        
                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon><AttachMoney fontSize="small" /></ListItemIcon>
                          <ListItemText primary={slot.activity.cost_cad === 0 ? 'Free' : `$${slot.activity.cost_cad} CAD`} />
                        </ListItem>
                        
                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon><People fontSize="small" /></ListItemIcon>
                          <ListItemText 
                            primary={`Networking: ${slot.activity.networking_potential}/10`}
                            secondary={slot.activity.networking_potential >= 7 ? 'High potential' : 
                                     slot.activity.networking_potential >= 4 ? 'Medium potential' : 'Low potential'}
                          />
                        </ListItem>
                      </List>
                      
                      {/* Calendar Integration Buttons */}
                      <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Button
                          startIcon={<EventAvailable />}
                          onClick={() => handleAddToGoogleCalendar(slot)}
                          size="small"
                          variant="outlined"
                          color="primary"
                        >
                          Add to Google Calendar
                        </Button>
                        <Button
                          startIcon={<Download />}
                          onClick={() => handleDownloadICS(slot)}
                          size="small"
                          variant="outlined"
                        >
                          Download .ics
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}
          </Paper>
        )
      )}
      </div>
    </Box>
  );
};

export default ScheduleViewer;
