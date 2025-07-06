const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '../public/data/lgbt_events_standardized.csv');
const outputPath = path.join(__dirname, '../public/data/lgbt_events_standardized_fixed.csv');
const csvContent = fs.readFileSync(csvPath, 'utf8');

const lines = csvContent.split('\n');
const headers = lines[0].split('|').map(h => h.trim());
const data = lines.slice(1).filter(line => line.trim());

// Map of line number (1-based, including header) to suggested eventType
const eventTypeFixes = {
  10: 'community', // Drag Queen Storytime
  12: 'community', // Queer Cooking Class
  17: 'community', // Queer Art Show
  19: 'performance', // Drag King Workshop
  20: 'community', // Queer Hiking Group
  21: 'community', // Trans Hockey League
  22: 'community', // Queer Meditation Circle
  26: 'community', // Pride Photography Workshop
  27: 'community', // Queer Writers Group
  28: 'community', // Trans Yoga Class
  29: 'community', // Queer Film Club
  31: 'community', // Queer Crafts Circle
  33: 'social', // Queer Salsa Dancing
  34: 'community', // Trans Health Workshop
  35: 'community', // Queer Zumba Class
  36: 'performance', // Drag Queen Makeup Workshop
  37: 'community', // Queer Tennis League
  39: 'community', // Queer Volleyball League
  42: 'community', // Trans Swimming Group
  43: 'community', // Queer Cooking Competition
  45: 'community', // Queer Basketball League
  46: 'community', // Trans Job Fair
  48: 'community', // Lesbian Hiking Group
  51: 'community', // Queer Badminton Club
  52: 'performance', // Drag Queen Singing Workshop
  53: 'community', // Queer Bowling League
  54: 'community', // Trans Art Therapy
  55: 'community', // Queer Cycling Group
  57: 'community', // Queer Entrepreneurs Network
  58: 'performance', // Trans Dance Workshop
  59: 'social', // Queer Trivia Championship
  60: 'community', // Lesbian Photography Club
};

// Helper: check if a string looks like a location (contains a street, avenue, etc.)
function looksLikeLocation(str) {
  if (!str) return false;
  return /(street|st\.|avenue|ave|road|rd\.|boulevard|blvd|drive|dr\.|lane|ln\.|court|ct\.|centre|center|park|beach|pub|bar|club|hotel|library|brewery|studio|theatre|theater|hall|arena|market|school|college|university|church|community|centre|center|restaurant|cafe|shop|gallery|museum|aquatic|pool|gym|lounge|bistro|bakery|brewery|stadium|field|court|room|house|society|society clubhouse|sonesta|sneaky dee|storm crow|granite brewery|hair of the dog|drom taberna|baby g|rivoli|left field|buddies|annex chess|snakes & lattes|glad day|woody's|crews|tiff|regent park|high park|moss park|metro toronto|carlton cinema|paradise grapevine|steadfast brewing|three dollar bill|the arch|see-scape|hanlan|eglinton|bathurst|dundas|queen|bloor|danforth|college|adelaide|victoria|baldwin|isabella|lansdowne|hanna|gould|alexander|augusta|baldwin|society clubhouse|sonesta|sneaky dee|storm crow|granite brewery|hair of the dog|drom taberna|baby g|rivoli|left field|buddies|annex chess|snakes & lattes|glad day|woody's|crews|tiff|regent park|high park|moss park|metro toronto|carlton cinema|paradise grapevine|steadfast brewing|three dollar bill|the arch|see-scape|hanlan|eglinton|bathurst|dundas|queen|bloor|danforth|college|adelaide|victoria|baldwin|isabella|lansdowne|hanna|gould|alexander|augusta|baldwin|society clubhouse|sonesta|sneaky dee|storm crow|granite brewery|hair of the dog|drom taberna|baby g|rivoli|left field|buddies|annex chess|snakes & lattes|glad day|woody's|crews|tiff|regent park|high park|moss park|metro toronto|carlton cinema|paradise grapevine|steadfast brewing|three dollar bill|the arch|see-scape|hanlan|eglinton|bathurst|dundas|queen|bloor|danforth|college|adelaide|victoria|baldwin|isabella|lansdowne|hanna|gould|alexander|augusta|baldwin)/i.test(str);
}

const fixedLines = [lines[0]]; // header

data.forEach((line, idx) => {
  const lineNum = idx + 2; // 1-based, including header
  let values = line.split('|');

  // Fix eventType if in our map
  if (eventTypeFixes[lineNum]) {
    values[headers.indexOf('eventType')] = eventTypeFixes[lineNum];
  }

  // Auto-fix misaligned rows: if eventType looks like a location and location is empty
  const eventTypeIdx = headers.indexOf('eventType');
  const locationIdx = headers.indexOf('location');
  if (looksLikeLocation(values[eventTypeIdx]) && (!values[locationIdx] || values[locationIdx] === 'MISSING')) {
    // Shift eventType to location, and set eventType to a default (prompt user if needed)
    values[locationIdx] = values[eventTypeIdx];
    // Try to infer eventType from tags, subcategory, or fallback to 'community'
    let inferredType = 'community';
    const tags = (values[headers.indexOf('tags')] || '').toLowerCase();
    const subcategory = (values[headers.indexOf('subcategory')] || '').toLowerCase();
    if (tags.includes('party') || tags.includes('nightlife') || subcategory.includes('nightlife')) inferredType = 'nightlife';
    else if (tags.includes('performance') || subcategory.includes('performance')) inferredType = 'performance';
    else if (tags.includes('social') || subcategory.includes('social')) inferredType = 'social';
    values[eventTypeIdx] = inferredType;
  }

  fixedLines.push(values.join('|'));
});

fs.writeFileSync(outputPath, fixedLines.join('\n'), 'utf8');
console.log(`✅ Fixed CSV written to: ${outputPath}`); 