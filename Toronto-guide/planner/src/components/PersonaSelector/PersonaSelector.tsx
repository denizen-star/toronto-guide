import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Grid,
  Avatar,
  Badge
} from '@mui/material';
import {
  Person,
  Work,
  TrendingUp,
  Star
} from '@mui/icons-material';
import { UserPersona } from '../../types';

interface PersonaSelectorProps {
  personas: UserPersona[];
  selectedPersona: UserPersona | null;
  onPersonaSelect: (persona: UserPersona) => void;
  loading?: boolean;
}

const PersonaSelector: React.FC<PersonaSelectorProps> = ({
  personas,
  selectedPersona,
  onPersonaSelect,
  loading = false
}) => {
  const getPersonaIcon = (persona: UserPersona) => {
    if (persona.persona_id === 'kevin_job_search') return <TrendingUp />;
    if (persona.persona_id === 'kevin_working') return <Work />;
    return <Person />;
  };

  const getPersonaColor = (persona: UserPersona) => {
    if (persona.persona_id === 'kevin_job_search') return '#ff5722';
    if (persona.persona_id === 'kevin_working') return '#2196f3';
    return '#9c27b0';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        🎯 Kevin's LifePlanner
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom>
        Choose your current life situation - Job Search Kevin is recommended and pre-selected
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {personas.map((persona) => (
          <Grid key={persona.persona_id} size={{ xs: 12, md: 6, lg: 4 }}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: selectedPersona?.persona_id === persona.persona_id ? 
                  `2px solid ${getPersonaColor(persona)}` : '2px solid transparent',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3,
                },
              }}
              onClick={() => onPersonaSelect(persona)}
            >
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {persona.persona_id === 'kevin_job_search' ? (
                    <Badge
                      badgeContent={<Star sx={{ fontSize: 16, color: '#fff' }} />}
                      color="warning"
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: getPersonaColor(persona),
                          width: 56,
                          height: 56,
                          mr: 2,
                        }}
                      >
                        {getPersonaIcon(persona)}
                      </Avatar>
                    </Badge>
                  ) : (
                    <Avatar
                      sx={{
                        bgcolor: getPersonaColor(persona),
                        width: 56,
                        height: 56,
                        mr: 2,
                      }}
                    >
                      {getPersonaIcon(persona)}
                    </Avatar>
                  )}
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6" component="h2">
                        {persona.persona_name}
                      </Typography>
                      {persona.persona_id === 'kevin_job_search' && (
                        <Chip 
                          label="Recommended" 
                          size="small" 
                          color="warning" 
                          sx={{ fontSize: '0.7rem' }}
                        />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {persona.demographics.occupation}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {persona.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Primary Goals:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {persona.goals.primary_goals.slice(0, 2).map((goal, index) => (
                      <Chip
                        key={index}
                        label={goal}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    ))}
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Personality:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      label={persona.personality.personality_type}
                      size="small"
                      color="primary"
                      variant="filled"
                      sx={{ textTransform: 'capitalize' }}
                    />
                    <Chip
                      label={persona.personality.social_style}
                      size="small"
                      color="secondary"
                      variant="filled"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Budget Range:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${persona.constraints.max_daily_budget}/day • 
                    ${persona.constraints.max_weekly_budget}/week
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUp fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Networking Priority: {persona.networking.networking_priority}/10
                  </Typography>
                </Box>
              </CardContent>

              <Box sx={{ p: 2, pt: 0 }}>
                <Button
                  variant={selectedPersona?.persona_id === persona.persona_id ? 'contained' : 'outlined'}
                  fullWidth
                  disabled={loading}
                  sx={{
                    backgroundColor: selectedPersona?.persona_id === persona.persona_id ? 
                      getPersonaColor(persona) : 'transparent',
                    borderColor: getPersonaColor(persona),
                    color: selectedPersona?.persona_id === persona.persona_id ? 
                      'white' : getPersonaColor(persona),
                    '&:hover': {
                      backgroundColor: selectedPersona?.persona_id === persona.persona_id ? 
                        getPersonaColor(persona) : `${getPersonaColor(persona)}10`,
                    }
                  }}
                >
                  {selectedPersona?.persona_id === persona.persona_id ? 'Selected' : 'Select Persona'}
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PersonaSelector;
