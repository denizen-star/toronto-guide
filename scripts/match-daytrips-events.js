const fs = require('fs');
const path = require('path');

// Load the JSON data
const jsonData = JSON.parse(fs.readFileSync(path.join(__dirname, '../daytrips_data.json'), 'utf8'));

// Load the CSV data
const csvData = fs.readFileSync(path.join(__dirname, '../public/data/day_trips_standardized.csv'), 'utf8');

// Parse CSV data
const csvLines = csvData.split('\n');
const headers = csvLines[0].split('|');
const csvTrips = csvLines.slice(1).map(line => {
  const values = line.split('|');
  const trip = {};
  headers.forEach((header, index) => {
    trip[header] = values[index];
  });
  return trip;
}).filter(trip => trip.id && trip.title); // Filter out empty rows

// Helper function to normalize text for matching
const normalizeText = (text) => {
  return text.toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/\s+/g, '');
};

// Helper function to calculate similarity between two strings
const calculateSimilarity = (str1, str2) => {
  const normalized1 = normalizeText(str1);
  const normalized2 = normalizeText(str2);
  
  if (normalized1 === normalized2) return 1.0;
  
  const longer = normalized1.length > normalized2.length ? normalized1 : normalized2;
  const shorter = normalized1.length > normalized2.length ? normalized2 : normalized1;
  
  if (longer.length === 0) return 1.0;
  
  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
};

// Levenshtein distance calculation
const levenshteinDistance = (str1, str2) => {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
};

// Generate unique matching ID
const generateMatchingId = (baseId, suffix) => {
  const timestamp = Date.now().toString().slice(-6);
  return `${baseId}_match_${suffix}_${timestamp}`;
};

// Main matching function
const matchEvents = () => {
  console.log('🔍 Starting event matching between JSON and CSV files...\n');
  
  const matches = [];
  const unmatchedJson = [];
  const unmatchedCsv = [];
  
  // Track used CSV IDs to avoid duplicates
  const usedCsvIds = new Set();
  
  // Process each JSON day trip
  jsonData.daytrips.forEach((jsonTrip, jsonIndex) => {
    console.log(`\n📋 Processing JSON trip: "${jsonTrip.name}" (ID: ${jsonTrip.id})`);
    
    let bestMatch = null;
    let bestScore = 0;
    let bestCsvTrip = null;
    
    // Find best matching CSV trip
    csvTrips.forEach(csvTrip => {
      // Skip if already matched
      if (usedCsvIds.has(csvTrip.id)) return;
      
      // Calculate similarity scores
      const titleSimilarity = calculateSimilarity(jsonTrip.name, csvTrip.title);
      const descriptionSimilarity = calculateSimilarity(
        jsonTrip.whySpecial?.join(' ') || '', 
        csvTrip.description || ''
      );
      
      // Weighted score (title more important than description)
      const score = (titleSimilarity * 0.7) + (descriptionSimilarity * 0.3);
      
      if (score > bestScore && score > 0.4) { // Higher threshold for better matches
        bestScore = score;
        bestMatch = {
          jsonTrip,
          csvTrip,
          score,
          matchingId: generateMatchingId(jsonTrip.id, csvTrip.id)
        };
      }
    });
    
    if (bestMatch) {
      matches.push(bestMatch);
      usedCsvIds.add(bestMatch.csvTrip.id);
      console.log(`✅ Matched with: "${bestMatch.csvTrip.title}" (score: ${bestScore.toFixed(3)})`);
      console.log(`   Matching ID: ${bestMatch.matchingId}`);
    } else {
      unmatchedJson.push(jsonTrip);
      console.log(`❌ No match found`);
    }
  });
  
  // Find unmatched CSV trips
  csvTrips.forEach(csvTrip => {
    if (!usedCsvIds.has(csvTrip.id)) {
      unmatchedCsv.push(csvTrip);
    }
  });
  
  // Generate comprehensive report
  const report = {
    summary: {
      totalMatches: matches.length,
      totalJsonTrips: jsonData.daytrips.length,
      totalCsvTrips: csvTrips.length,
      unmatchedJson: unmatchedJson.length,
      unmatchedCsv: unmatchedCsv.length,
      matchRate: ((matches.length / jsonData.daytrips.length) * 100).toFixed(1)
    },
    matches: matches.map(match => ({
      matchingId: match.matchingId,
      jsonTrip: {
        id: match.jsonTrip.id,
        name: match.jsonTrip.name
      },
      csvTrip: {
        id: match.csvTrip.id,
        title: match.csvTrip.title
      },
      score: match.score
    })),
    unmatchedJson: unmatchedJson.map(trip => ({
      id: trip.id,
      name: trip.name
    })),
    unmatchedCsv: unmatchedCsv.map(trip => ({
      id: trip.id,
      title: trip.title
    }))
  };
  
  // Save matching results
  const outputPath = path.join(__dirname, '../daytrips_matching_results.json');
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
  
  // Print summary
  console.log('\n📊 MATCHING SUMMARY');
  console.log('==================');
  console.log(`✅ Successful matches: ${matches.length}`);
  console.log(`📋 JSON trips processed: ${jsonData.daytrips.length}`);
  console.log(`📄 CSV trips processed: ${csvTrips.length}`);
  console.log(`❌ Unmatched JSON trips: ${unmatchedJson.length}`);
  console.log(`❌ Unmatched CSV trips: ${unmatchedCsv.length}`);
  console.log(`📈 Match rate: ${report.summary.matchRate}%`);
  
  console.log('\n🎯 DETAILED MATCHES');
  console.log('==================');
  matches.forEach((match, index) => {
    console.log(`${index + 1}. "${match.jsonTrip.name}" ↔ "${match.csvTrip.title}"`);
    console.log(`   JSON ID: ${match.jsonTrip.id} | CSV ID: ${match.csvTrip.id}`);
    console.log(`   Matching ID: ${match.matchingId} | Score: ${match.score.toFixed(3)}`);
    console.log('');
  });
  
  if (unmatchedJson.length > 0) {
    console.log('\n❌ UNMATCHED JSON TRIPS');
    console.log('=======================');
    unmatchedJson.forEach(trip => {
      console.log(`- ${trip.name} (ID: ${trip.id})`);
    });
  }
  
  if (unmatchedCsv.length > 0) {
    console.log('\n❌ UNMATCHED CSV TRIPS');
    console.log('=======================');
    unmatchedCsv.forEach(trip => {
      console.log(`- ${trip.title} (ID: ${trip.id})`);
    });
  }
  
  console.log(`\n💾 Results saved to: ${outputPath}`);
  
  return report;
};

// Run the matching
const results = matchEvents();

module.exports = { matchEvents, calculateSimilarity, generateMatchingId }; 