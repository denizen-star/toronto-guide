import React from 'react';
import { Box, Grid, Typography, Button, Chip, Card, CardContent } from '@mui/material';
import {
  Flag,
  Restaurant,
  MusicNote,
  NightlifeOutlined,
  Business,
  Festival,
  ArrowBack,
  ArrowForward,
  Groups,
  FitnessCenter,
  AccessTime,
  LocationCity
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

interface PrideActivity {
  id: string;
  title: string;  
  description: string;
  category: string;
  day: string;
  time: string;
  location: string;
  address: string;
  website?: string;
  priceRange: string;
  tags: string[];
  isPrideEvent: boolean;
  isLGBTFriendly: boolean;
  isAlternative?: boolean;
  alternativeFor?: string;
  isSpecialEvent?: boolean;
  peopleEnjoy?: string;
}

// Helper functions for category-specific styling and icons
const getCategoryColor = (category: string) => {
  switch (category) {
    case 'pride-event': return '#FF6B6B';
    case 'dining': return '#4ECDC4';
    case 'nightlife': return '#9B59B6';
    case 'logistics': return '#95A5A6';
    default: return '#2C3E50';
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'pride-event': return <Flag />;
    case 'dining': return <Restaurant />;
    case 'nightlife': return <NightlifeOutlined />;
    case 'logistics': return <Business />;
    default: return <Flag />;
  }
};

// Day 4 Data - Saturday, August 9, 2025 - Enhanced with detailed experiences
const day4Data: PrideActivity[] = [
  {
    id: "morning_prep",
    title: "Pride Parade Day Preparation",
    description: "Get ready for the biggest day! Pride gear shopping, early brunch, and meeting up with fellow Pride-goers",
    category: "logistics",
    day: "Saturday",
    time: "9:00 AM - 12:00 PM",
    location: "Village Area",
    address: "Rue Sainte-Catherine Est, Montreal",
    priceRange: "$$",
    tags: ["preparation", "pride-gear", "shopping", "brunch"],
    isPrideEvent: false,
    isLGBTFriendly: true,
    peopleEnjoy: "Last-minute Pride gear shopping at Village stores, hearty brunch to fuel the day ahead, meeting other Pride visitors from around the world, and the building excitement as the Village comes alive"
  },
  {
    id: "high_heels_race",
    title: "The High Heels Obstacle Race (La Course Capotée)",
    description: "One of the most outrageous and fun events of Fierté Montréal! Navigate an obstacle course in high heels, hosted by LaDrag On-Fly",
    category: "pride-event",
    day: "Saturday",
    time: "2:00 PM - 4:00 PM",  
    location: "Village or Esplanade Tranquille",
    address: "Check Fierté Montréal for exact location",
    website: "https://fiertemontreal.com/",
    priceRange: "free",
    tags: ["high-heels", "obstacle-race", "ladrag-on-fly", "outrageous", "fun"],
    isPrideEvent: true,
    isLGBTFriendly: true,
    isSpecialEvent: true,
    peopleEnjoy: "The hilarious spectacle of people attempting obstacle courses in stilettos, LaDrag On-Fly's entertaining commentary and MC skills, cheering on brave participants, and the infectious laughter and community spirit"
  },
  {
    id: "xcellence",
    title: "Xcellence - Celebrating Racialized 2SLGBTQIA+ Communities",
    description: "Official Fierté Montréal celebration of racialized LGBTQ+ communities with Iniko (5 PM), Bilal Hassani (7 PM), and Ivy Queen (9 PM)",
    category: "pride-event",
    day: "Saturday",
    time: "5:00 PM - 11:00 PM",
    location: "TD Stage, Olympic Park Esplanade",
    address: "Olympic Park Esplanade, Montreal",
    website: "https://fiertemontreal.com/",
    priceRange: "free",
    tags: ["xcellence", "iniko", "bilal-hassani", "ivy-queen", "racialized"],
    isPrideEvent: true,
    isLGBTFriendly: true,
    isSpecialEvent: true,
    peopleEnjoy: "Iniko's powerful non-binary representation and ethereal voice, Bilal Hassani's Eurovision fame and French pop energy, Ivy Queen - the undisputed Queen of Reggaeton, and the celebration of intersectional LGBTQ+ identities"
  },
  {
    id: "iles1",
    title: "íLESONIQ 2025 Festival - Day 1",
    description: "Major electronic music festival featuring John Summit, ILLENIUM and international EDM stars",
    category: "nightlife",
    day: "Saturday",
    time: "2:00 PM - 11:00 PM",
    location: "Parc Jean-Drapeau",
    address: "1 Circuit Gilles Villeneuve, Montreal",
    website: "https://ilesoniq.com/",
    priceRange: "$$$",
    tags: ["festival", "edm", "john-summit", "illenium", "electronic"],
    isPrideEvent: false,
    isLGBTFriendly: true,
    isSpecialEvent: true,
    peopleEnjoy: "John Summit's tech-house mastery and crowd control, ILLENIUM's emotional dubstep that makes everyone cry-dance, the stunning riverside festival location, massive production values, and the diverse international EDM crowd"
  },
  {
    id: "iles1_alt1",
    title: "Alternative: UNIKORN Pride Edition III at Club Soda",
    description: "Club Soda's third Pride edition UNIKORN party with special performances and Pride-themed decor",
    category: "pride-event",
    day: "Saturday",
    time: "9:00 PM - Late",
    location: "Club Soda",
    address: "1225 Boul. Saint-Laurent, Montreal",
    website: "https://clubsoda.ca/",
    priceRange: "$$",
    tags: ["pride", "unikorn", "clubsoda", "official", "party"],
    isPrideEvent: true,
    isLGBTFriendly: true,
    isAlternative: true,
    alternativeFor: "xcellence",
    isSpecialEvent: true,
    peopleEnjoy: "The legendary Club Soda sound system that's hosted everyone from Björk to Daft Punk, Pride-themed decorations and special performances, the intimate venue feel compared to outdoor stages, and connecting with Montreal's music scene insiders"
  },
  {
    id: "iles1_alt2",
    title: "Alternative: Village Pride Street Festival",
    description: "Pre-parade street celebrations throughout the Gay Village with pop-up performances and community booths",
    category: "pride-event",
    day: "Saturday",
    time: "2:00 PM - 8:00 PM",
    location: "Gay Village Streets", 
    address: "Rue Sainte-Catherine Est, Montreal",
    priceRange: "free",
    tags: ["street-festival", "village", "pre-parade", "free"],
    isPrideEvent: true,
    isLGBTFriendly: true,
    isAlternative: true,
    alternativeFor: "iles1",
    peopleEnjoy: "Spontaneous street performances and impromptu drag shows, meeting locals and getting insider tips for Sunday's parade, the authentic community vibe away from the main stages, and discovering hidden Village gems"
  },
  {
    id: "lpgiobbi1",
    title: "LP GIOBBI: YES YES YES PARTY - íLESONIQ After",
    description: "LP Giobbi's YES YES YES party continues the íLESONIQ energy at Newspeak with her signature piano house sound",
    category: "nightlife",
    day: "Saturday",
    time: "10:00 PM - 3:00 AM",
    location: "Newspeak Montreal",
    address: "1403 Rue Sainte Élisabeth, Montreal",
    website: "https://www.newspeakmtl.com/",
    priceRange: "$$$",
    tags: ["lp-giobbi", "afterparty", "ilesoniq", "yes-yes-yes", "electronic"],
    isPrideEvent: false,
    isLGBTFriendly: true,
    isSpecialEvent: true,
    peopleEnjoy: "LP Giobbi's live piano integration with electronic beats, the YES YES YES party's reputation as one of the world's best piano house events, Newspeak's warehouse atmosphere and professional sound, and the after-hours crowd of serious music lovers"
  },
  {
    id: "lpgiobbi1_alt1",
    title: "Alternative: Unity Club 3-Floor Experience",
    description: "Montreal's biggest inclusive club on 3 floors with multiple DJs, VIP lounges, and rooftop terrace views",
    category: "nightlife",
    day: "Saturday",
    time: "9:30 PM - 3:00 AM",
    location: "Club Unity",
    address: "1171 Rue Sainte-Catherine E, Montreal",
    website: "https://www.clubunity.com/",
    priceRange: "$$",
    tags: ["unity", "3-floors", "inclusive", "vip", "rooftop"],
    isPrideEvent: false,
    isLGBTFriendly: true,
    isAlternative: true,
    alternativeFor: "lpgiobbi1",
    peopleEnjoy: "The massive 3-floor layout where each floor has a different music vibe, the rooftop terrace with stunning Village views, VIP sections for a more intimate experience, and the most inclusive crowd in Montreal - everyone is welcome"
  },
  {
    id: "local_gem_day4_1",
    title: "Local Gem: Annette bar à vin - Molson District Wine Haven",
    description: "Sophisticated wine bar in emerging Molson district featuring wine spectator excellence, minimalist cocktails, and shared cuisine culture",
    category: "dining",
    day: "Saturday",
    time: "3:00 PM - 5:00 PM",
    location: "Annette bar à vin",
    address: "4051, rue Molson, local 120, Montreal, QC H1Y 3L1",
    website: "https://www.annettebaravin.com/",
    priceRange: "$$$",
    tags: ["local-gem", "wine-bar", "molson-district", "sophisticated"],
    isPrideEvent: false,
    isLGBTFriendly: true,
    peopleEnjoy: "Discovering this Wine Spectator Award of Excellence winner in the emerging Molson district, the unique vision of wine featuring vulgarized subtleties and sophisticated simplicity, minimalist cocktails created by passionate mixologist Olivier, and the sharing-focused cuisine that embodies Montreal's collaborative food culture"
  },
  {
    id: "local_gem_day4_2",
    title: "Local Gem: Bar Le Vestiaire - Rosemont Microbrasserie with Quiz Nights",
    description: "Authentic neighborhood microbrasserie with 16 taps of Quebec beer, 45+ Belgian bottles, and legendary Monday quiz nights beloved by locals",
    category: "nightlife",
    day: "Saturday",
    time: "1:00 PM - 3:00 PM",
    location: "Bar Le Vestiaire",
    address: "6634 rue Saint-Hubert, Montreal, QC H2S 2M3",
    website: "https://www.barlevestiaire.com/",
    priceRange: "$$",
    tags: ["local-gem", "microbrasserie", "rosemont", "quiz-nights"],
    isPrideEvent: false,
    isLGBTFriendly: true,
    peopleEnjoy: "The authentic microbrasserie atmosphere just steps from Beaubien Metro with 16 local taps showcasing Quebec's beer culture, over 45 Belgian bottles for the true beer connoisseur, legendary Monday quiz nights that bring the community together, and two terrasses perfect for pre-Pride festivities"
  },
  {
    id: "friend_rec_old_montreal",
    title: "Friend's Rec: Old Montreal Historic Stroll & Notre-Dame",
    description: "Take a slower start exploring cobblestone streets, Notre-Dame Basilica (worth going inside!), and Old Port. Optional: pedal boats or zipline for adventure",
    category: "culture", 
    day: "Saturday",
    time: "10:00 AM - 12:00 PM",
    location: "Old Montreal & Notre-Dame Basilica",
    address: "Old Montreal historic district",
    priceRange: "$",
    tags: ["friend-rec", "old-montreal", "notre-dame", "historic"],
    isPrideEvent: false,
    isLGBTFriendly: true,
    peopleEnjoy: "Walking the historic cobblestone streets that tell 400 years of history, the breathtaking Notre-Dame Basilica interior that's worth the admission, optional adventure activities at Old Port, and the slower pace before tonight's marathon party"
  },
  {
    id: "friend_rec_le_serpent",
    title: "Friend's Rec: Le Serpent - Industrial Italian Excellence", 
    description: "Amazing Italian restaurant in an old industrial building with super cool vibe - fuel up for the marathon party night ahead!",
    category: "dining",
    day: "Saturday",
    time: "7:00 PM - 9:00 PM",
    location: "Le Serpent",
    address: "Prince Arthur W, Montreal",
    priceRange: "$$$",
    tags: ["friend-rec", "italian", "industrial", "cool-vibe"],
    isPrideEvent: false,
    isLGBTFriendly: true,
    peopleEnjoy: "The super cool industrial building atmosphere, amazing Italian food that locals rave about, the unique setting that feels like a hidden gem, and fueling up properly for the biggest party night of Pride week"
  },
  {
    id: "friend_rec_marathon_party",
    title: "Friend's Rec: Epic Village Bar Crawl - Go All Out Night!",
    description: "The night to go all out! Start Complexe Sky (rooftop terrasse) → Stock Bar (infamous shows) → finish at Stereo (2 AM-late morning after-hours institution)",
    category: "nightlife",
    day: "Saturday", 
    time: "10:00 PM - Late Morning",
    location: "Village Bar Crawl Circuit",
    address: "Rue Sainte-Catherine E, Montreal",
    priceRange: "$$$",
    tags: ["friend-rec", "bar-crawl", "complexe-sky", "stock-bar", "stereo"],
    isPrideEvent: false,
    isLGBTFriendly: true,
    isSpecialEvent: true,
    peopleEnjoy: "Starting with Complexe Sky's rooftop terrasse views, experiencing Stock Bar's infamous drag shows, ending at Stereo - Montreal's legendary after-hours institution that opens at 2 AM, incredible DJs and the most serious party of Pride week - pace yourself!"
  }
];

const PrideMontrealDay4 = () => {
  return (
    <Box sx={{ padding: { xs: 2, md: 4 }, maxWidth: '1400px', margin: '0 auto' }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Button
          component={RouterLink}
          to="/pride-montreal-kp"
          startIcon={<ArrowBack />}
          sx={{ mb: 2, alignSelf: 'flex-start' }}
        >
          Back to Pride Montreal KP Overview
        </Button>
        
        <Typography variant="h2" sx={{ 
          fontSize: 'clamp(2rem, 5vw, 3.5rem)', 
          fontWeight: 'bold', 
          mb: 2,
          background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent'
        }}>
          Day 4: Xcellence
        </Typography>
        
        <Typography variant="h4" sx={{ 
          fontSize: 'clamp(1.2rem, 3vw, 2rem)', 
          fontWeight: 'medium',
          color: 'text.secondary',
          mb: 1
        }}>
          Saturday, August 9, 2025
        </Typography>
        
        <Typography variant="body1" sx={{ 
          fontSize: '1.1rem',
          color: 'text.secondary',
          maxWidth: '800px',
          margin: '0 auto',
          mb: 3
        }}>
          Celebrating racialized LGBTQ+ communities with Iniko, Bilal Hassani, and Ivy Queen. Plus the outrageous High Heels Race and íLESONIQ festival!
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', mb: 3 }}>
          <Chip icon={<Groups />} label="Xcellence" color="primary" />
          <Chip icon={<FitnessCenter />} label="High Heels Race" color="secondary" />
          <Chip icon={<Festival />} label="íLESONIQ" />
          <Chip icon={<MusicNote />} label="LP Giobbi" variant="outlined" />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {day4Data.map((activity) => (
          <Grid item xs={12} md={6} lg={4} key={activity.id}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              border: activity.isAlternative ? '2px dashed #ccc' : activity.isPrideEvent ? '2px solid #FF6B6B' : '1px solid #eee',
              borderRadius: 2,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              },
              transition: 'all 0.3s ease'
            }}>
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Box 
                    sx={{ 
                      backgroundColor: getCategoryColor(activity.category), 
                      color: 'white', 
                      borderRadius: '50%', 
                      p: 1, 
                      mr: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: 40,
                      height: 40
                    }}
                  >
                    {getCategoryIcon(activity.category)}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    {activity.isAlternative && (
                      <Chip label="Alternative" size="small" sx={{ mb: 1 }} />
                    )}
                    {activity.isPrideEvent && (
                      <Chip label="Pride Event" size="small" color="primary" sx={{ mb: 1, mr: 1 }} />
                    )}
                    {activity.isSpecialEvent && (
                      <Chip label="Special Event" size="small" color="secondary" sx={{ mb: 1 }} />
                    )}
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, lineHeight: 1.2 }}>
                      {activity.title}  
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary', lineHeight: 1.5 }}>
                  {activity.description}
                </Typography>

                {/* What People Enjoy Section */}
                {activity.peopleEnjoy && (
                  <Box sx={{ 
                    backgroundColor: '#f8f9fa', 
                    padding: 2, 
                    borderRadius: 2, 
                    mb: 2,
                    border: '1px solid #e9ecef'
                  }}>
                    <Typography variant="body2" sx={{ 
                      fontWeight: 'bold', 
                      color: getCategoryColor(activity.category),
                      mb: 1
                    }}>
                      ✨ What People Love:
                    </Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                      {activity.peopleEnjoy}
                    </Typography>
                  </Box>
                )}
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AccessTime sx={{ mr: 1, fontSize: 16 }} />
                    {activity.time}
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationCity sx={{ mr: 1, fontSize: 16 }} />
                    {activity.location}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    📍 {activity.address}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  <Chip label={activity.priceRange} size="small" variant="outlined" />
                  {activity.tags.slice(0, 2).map((tag) => (
                    <Chip key={tag} label={tag} size="small" variant="outlined" />
                  ))}
                </Box>
                
                {activity.website && (
                  <Button 
                    href={activity.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outlined"
                    size="small"
                    fullWidth
                  >
                    Visit Website
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 6, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Button
          component={RouterLink}
          to="/pride-montreal-day3"
          variant="outlined"
          startIcon={<ArrowBack />}
        >
          Previous: Day 3
        </Button>
        <Button
          component={RouterLink}
          to="/pride-montreal-day5"
          variant="contained"
          endIcon={<ArrowForward />}
        >
          Next: Day 5 - Pride Parade
        </Button>
      </Box>
    </Box>
  );
};

export default PrideMontrealDay4; 