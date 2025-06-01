const fs = require('fs');
const Papa = require('papaparse');
const path = require('path');

// Function to read CSV file
const readCsvFile = (filePath) => {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return Papa.parse(fileContent, { header: true }).data;
};

// Function to write CSV file
const writeCsvFile = (filePath, data) => {
  const csv = Papa.unparse(data);
  fs.writeFileSync(filePath, csv);
};

// Main function to merge data
const mergeData = () => {
  const archivePath = path.join(__dirname, '../public/data/archive');
  const outputPath = path.join(__dirname, '../public/data');

  // Read activities data
  const activitiesData = readCsvFile(path.join(archivePath, 'activities.csv'));
  
  // Read special events data
  const specialEventsData = readCsvFile(path.join(archivePath, 'special_events_standardized.csv'));

  // Convert activities to standardized format
  const standardizedActivities = activitiesData.map(activity => ({
    id: activity.id,
    title: activity.title,
    description: activity.description,
    image: `https://source.unsplash.com/random/?${encodeURIComponent(activity.title)}`,
    location: activity.locationId,
    type: activity.categoryId,
    startDate: activity.start_date || '',
    endDate: activity.end_date || '',
    registrationDeadline: '',
    duration: 'varies',
    activityDetails: activity.description,
    cost: activity.priceId,
    website: activity.website,
    travelTime: '',
    googleMapLink: '',
    lgbtqFriendly: 'false',
    tags: activity.tags || '',
    lastUpdated: activity.lastUpdated,
    category: activity.categoryId,
    eventType: 'activity',
    neighborhood: activity.neighborhood || '',
    season: 'year-round',
    priceRange: 'varies',
    source: 'activity'
  }));

  // Convert special events to standardized format
  const standardizedEvents = specialEventsData.map(event => ({
    id: event.id,
    title: event.title,
    description: event.description,
    image: event.image || `https://source.unsplash.com/random/?${encodeURIComponent(event.type)},event`,
    location: event.location,
    type: event.type,
    startDate: event.startDate,
    endDate: event.endDate,
    registrationDeadline: event.registrationDeadline,
    duration: event.duration,
    activityDetails: event.activityDetails,
    cost: event.cost,
    website: event.website,
    travelTime: event.travelTime,
    googleMapLink: event.googleMapLink,
    lgbtqFriendly: event.lgbtqFriendly ? 'true' : 'false',
    tags: Array.isArray(event.tags) ? event.tags.join(',') : event.tags || '',
    lastUpdated: event.lastUpdated,
    category: event.type,
    eventType: 'special_event',
    neighborhood: event.location,
    season: event.season || 'year-round',
    priceRange: event.priceRange || 'varies',
    source: 'special_event'
  }));

  // Merge both datasets
  const mergedData = [...standardizedActivities, ...standardizedEvents];

  // Write to output file
  writeCsvFile(path.join(outputPath, 'scoop_standardized.csv'), mergedData);
  
  console.log(`Successfully merged ${standardizedActivities.length} activities and ${standardizedEvents.length} special events.`);
};

// Execute the merge
mergeData(); 