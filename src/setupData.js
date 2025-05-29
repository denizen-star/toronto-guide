const fs = require('fs');
const path = require('path');

// Create the public/data directory if it doesn't exist
const publicDataDir = path.join(__dirname, '../public/data');
if (!fs.existsSync(publicDataDir)) {
  fs.mkdirSync(publicDataDir, { recursive: true });
}

// Copy data files from public/data to public/data
const dataDir = path.join(__dirname, '../public/data');
const files = ['locations.csv', 'happy_hours.csv', 'schedules.csv', 'activities.csv'];

files.forEach(file => {
  const sourcePath = path.join(dataDir, file);
  const destPath = path.join(publicDataDir, file);
  
  try {
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`Copied ${file} to public/data directory`);
    } else {
      console.log(`Warning: ${file} not found in source directory`);
    }
  } catch (error) {
    console.error(`Error copying ${file}:`, error);
  }
}); 