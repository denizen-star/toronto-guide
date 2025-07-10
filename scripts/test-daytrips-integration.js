const fs = require('fs');
const path = require('path');

// Test the generated day trips data
const testDayTripsIntegration = () => {
  try {
    // Load the generated data
    const dataPath = path.join(__dirname, '../public/daytrips_data.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    console.log('✅ Day trips data file loaded successfully');
    console.log(`📊 Found ${data.daytrips.length} detailed day trips`);
    
    // Test each trip's structure
    data.daytrips.forEach((trip, index) => {
      console.log(`\n🔍 Testing trip ${index + 1}: ${trip.name} (ID: ${trip.id})`);
      
      // Check required fields
      const requiredFields = [
        'id', 'name', 'coordinates', 'contact', 'whySpecial', 
        'reasonsToGo', 'events', 'booking', 'accessibility', 
        'reviewsSentiment', 'dayIn', 'nearby', 'gayFriendlyAccommodations', 'mustNotMiss'
      ];
      
      const missingFields = requiredFields.filter(field => !trip.hasOwnProperty(field));
      
      if (missingFields.length > 0) {
        console.log(`❌ Missing required fields: ${missingFields.join(', ')}`);
      } else {
        console.log('✅ All required fields present');
      }
      
      // Check data types
      if (!Array.isArray(trip.whySpecial)) {
        console.log('❌ whySpecial should be an array');
      }
      
      if (!Array.isArray(trip.reasonsToGo)) {
        console.log('❌ reasonsToGo should be an array');
      }
      
      if (!Array.isArray(trip.events)) {
        console.log('❌ events should be an array');
      }
      
      if (!Array.isArray(trip.nearby)) {
        console.log('❌ nearby should be an array');
      }
      
      if (!Array.isArray(trip.gayFriendlyAccommodations)) {
        console.log('❌ gayFriendlyAccommodations should be an array');
      }
      
      if (!Array.isArray(trip.mustNotMiss)) {
        console.log('❌ mustNotMiss should be an array');
      }
      
      // Check coordinates
      if (!trip.coordinates || typeof trip.coordinates.latitude !== 'number' || typeof trip.coordinates.longitude !== 'number') {
        console.log('❌ coordinates should have latitude and longitude as numbers');
      }
      
      // Check contact structure
      if (!trip.contact || typeof trip.contact.website !== 'string') {
        console.log('❌ contact should have website as string');
      }
      
      // Check reviews sentiment
      if (!trip.reviewsSentiment || typeof trip.reviewsSentiment.overall !== 'string') {
        console.log('❌ reviewsSentiment should have overall as string');
      }
      
      // Check day in plans
      if (!trip.dayIn || typeof trip.dayIn.general !== 'string') {
        console.log('❌ dayIn should have general as string');
      }
      
      console.log(`📈 Trip has ${trip.whySpecial.length} special features`);
      console.log(`📈 Trip has ${trip.reasonsToGo.length} reasons to go`);
      console.log(`📈 Trip has ${trip.events.length} events`);
      console.log(`📈 Trip has ${trip.nearby.length} nearby attractions`);
      console.log(`📈 Trip has ${trip.gayFriendlyAccommodations.length} LGBTQ+ friendly accommodations`);
      console.log(`📈 Trip has ${trip.mustNotMiss.length} must-not-miss highlights`);
    });
    
    console.log('\n🎉 All tests completed!');
    
  } catch (error) {
    console.error('❌ Error testing day trips integration:', error.message);
  }
};

// Run the test
testDayTripsIntegration(); 