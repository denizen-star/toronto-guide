import React from 'react';
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
  Button
} from '@mui/material';
import {
  LocationOn,
  Language,
  LocalActivity,
  LocalBar,
  Info,
  ArrowBack
} from '@mui/icons-material';

interface Activity {
  title: string;
  category: string;
  address: string;
  website?: string;
}

interface HappyHour {
  name: string;
  details: string;
  address: string;
  website?: string;
}

interface LocationData {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  activities: Activity[];
  happyHours?: HappyHour[];
}

const boulderData: { [key: string]: LocationData } = {
  'downtown': {
    id: 'downtown',
    title: 'Downtown Boulder / Pearl Street Mall',
    description: 'The vibrant heart of the city with unique boutiques, art galleries, diverse restaurants, and lively street performers.',
    category: 'downtown',
    tags: ['shopping', 'dining', 'entertainment', 'art'],
    activities: [
      {
        title: 'Pearl Street Mall',
        category: 'Shopping & Entertainment',
        address: 'Pearl Street Mall, Boulder, CO',
        website: 'https://boulderdowntown.com/pearl-street-mall'
      },
      {
        title: 'Boulder Museum of Contemporary Art',
        category: 'Arts & Culture',
        address: '1750 13th St, Boulder, CO 80302',
        website: 'https://bmoca.org'
      }
    ],
    happyHours: [
      {
        name: 'The West End Tavern',
        details: 'Mon-Fri: 3-6 PM, Thu-Sat: 9 PM-12 AM (late night). Mon: All Day Wings',
        address: '926 Pearl St, Boulder, CO 80302',
        website: 'https://thewestendtavern.com'
      }
    ]
  },
  'hill': {
    id: 'hill',
    title: 'The Hill',
    description: 'A vibrant district adjacent to the University of Colorado Boulder campus, known for its youthful energy and lively music scene.',
    category: 'hill',
    tags: ['music', 'dining', 'student life', 'entertainment'],
    activities: [
      {
        title: 'Fox Theatre',
        category: 'Entertainment',
        address: '1135 13th St, Boulder, CO 80302',
        website: 'https://www.foxtheatre.com'
      }
    ]
  },
  'nobo': {
    id: 'nobo',
    title: 'North Boulder (NoBo)',
    description: 'An artsy part of the city featuring a growing art district, local coffee shops, bakeries, and peaceful parks.',
    category: 'nobo',
    tags: ['art', 'parks', 'coffee', 'relaxed'],
    activities: [
      {
        title: 'NoBo Art District',
        category: 'Arts & Culture',
        address: 'Broadway between Iris & Highway 36, Boulder, CO',
        website: 'https://noboartdistrict.org'
      }
    ]
  },
  'south': {
    id: 'south',
    title: 'South Boulder',
    description: 'A residential area nestled against the foothills, offering laid-back lifestyle and easy access to hiking trails.',
    category: 'south',
    tags: ['hiking', 'nature', 'community', 'science'],
    activities: [
      {
        title: 'Shanahan Ridge Trail',
        category: 'Hiking',
        address: 'Trailhead at Lehigh St, Boulder, CO 80303'
      }
    ]
  },
  'east': {
    id: 'east',
    title: 'East Boulder',
    description: 'Known for its mix of residential areas, tech industries, and growing artsy vibe with local eateries and parks.',
    category: 'east',
    tags: ['tech', 'parks', 'dining', 'biking'],
    activities: [
      {
        title: 'Valmont Bike Park',
        category: 'Outdoor Recreation',
        address: '3160 Airport Rd, Boulder, CO 80301',
        website: 'https://bouldercolorado.gov/locations/valmont-bike-park'
      }
    ]
  },
  'gunbarrel': {
    id: 'gunbarrel',
    title: 'Gunbarrel',
    description: 'A suburban area with open spaces, breweries, and a growing tech presence, offering great dining and recreational options.',
    category: 'gunbarrel',
    tags: ['breweries', 'suburban', 'tech', 'recreation'],
    activities: [
      {
        title: 'Avery Brewing Company',
        category: 'Brewery & Taproom',
        address: '4910 Nautilus Ct N, Boulder, CO 80301',
        website: 'https://www.averybrewing.com'
      }
    ]
  }
};

const BoulderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = id ? boulderData[id] : null;

  if (!location) {
    return (
      <Container>
        <Typography variant="h4">Location not found</Typography>
      </Container>
    );
  }

  return (
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
  );
};

export default BoulderDetails; 