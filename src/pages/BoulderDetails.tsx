import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Chip,
  Link,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  CircularProgress
} from '@mui/material';
import {
  LocationOn,
  Language,
  LocalActivity,
  LocalBar,
  Info,
  ArrowBack
} from '@mui/icons-material';
import ErrorBoundary from '../components/ErrorBoundary';
import { getBoulderLocationById } from '../services/boulderService';
import type { BoulderLocation } from '../types/boulder';

const BoulderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [location, setLocation] = useState<BoulderLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadLocation = async () => {
      try {
        setIsLoading(true);
        setError(null);
        if (!id) throw new Error('Location ID is required');
        const data = getBoulderLocationById(id);
        if (!data) throw new Error('Location not found');
        setLocation(data);
      } catch (error) {
        console.error('Error loading location:', error);
        setError(error instanceof Error ? error : new Error('Failed to load location'));
      } finally {
        setIsLoading(false);
      }
    };

    loadLocation();
  }, [id]);

  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="body1" color="text.secondary">
          Loading location details...
        </Typography>
      </Box>
    );
  }

  if (error || !location) {
    return (
      <Container>
        <Box sx={{ mb: 3 }}>
          <Button
            component={RouterLink}
            to="/boulder"
            startIcon={<ArrowBack />}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                color: 'primary.main',
              },
            }}
          >
            Back to Boulder Guide
          </Button>
        </Box>
        <Typography variant="h4" color="error" align="center" gutterBottom>
          {error ? error.message : 'Location not found'}
        </Typography>
      </Container>
    );
  }

  return (
    <ErrorBoundary>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Button
            component={RouterLink}
            to="/boulder"
            startIcon={<ArrowBack />}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                color: 'primary.main',
              },
            }}
          >
            Back to Boulder Guide
          </Button>
        </Box>

        <Paper elevation={0} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h3" gutterBottom>
            {location.title}
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            {location.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                sx={{ mr: 1, mb: 1 }}
                variant="outlined"
              />
            ))}
          </Box>

          <Typography variant="body1" paragraph>
            {location.description}
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" gutterBottom>
            Things to Do
          </Typography>
          <List>
            {location.activities.map((activity, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <LocalActivity />
                </ListItemIcon>
                <ListItemText
                  primary={activity.title}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        <LocationOn sx={{ fontSize: 'small', mr: 0.5, verticalAlign: 'middle' }} />
                        {activity.address}
                      </Typography>
                      {activity.website && (
                        <Link href={activity.website} target="_blank" rel="noopener noreferrer">
                          <Language sx={{ fontSize: 'small', mr: 0.5, verticalAlign: 'middle' }} />
                          Visit Website
                        </Link>
                      )}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>

          {location.happyHours && location.happyHours.length > 0 && (
            <>
              <Divider sx={{ my: 4 }} />
              <Typography variant="h5" gutterBottom>
                Happy Hours
              </Typography>
              <List>
                {location.happyHours.map((happyHour, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <LocalBar />
                    </ListItemIcon>
                    <ListItemText
                      primary={happyHour.name}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            <Info sx={{ fontSize: 'small', mr: 0.5, verticalAlign: 'middle' }} />
                            {happyHour.details}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <LocationOn sx={{ fontSize: 'small', mr: 0.5, verticalAlign: 'middle' }} />
                            {happyHour.address}
                          </Typography>
                          {happyHour.website && (
                            <Link href={happyHour.website} target="_blank" rel="noopener noreferrer">
                              <Language sx={{ fontSize: 'small', mr: 0.5, verticalAlign: 'middle' }} />
                              Visit Website
                            </Link>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </Paper>
      </Container>
    </ErrorBoundary>
  );
};

export default BoulderDetails; 