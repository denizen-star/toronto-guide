const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

// SVG content for the CN Tower icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <linearGradient id="towerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#60A5FA;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3B82F6;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background circle -->
  <circle cx="50" cy="50" r="45" fill="#1F2937" stroke="#374151" stroke-width="2"/>
  
  <!-- CN Tower silhouette -->
  <!-- Main tower shaft -->
  <rect x="48" y="25" width="4" height="45" fill="url(#towerGradient)"/>
  
  <!-- Tower base -->
  <rect x="46" y="65" width="8" height="8" fill="url(#towerGradient)"/>
  
  <!-- Observation decks -->
  <ellipse cx="50" cy="45" rx="6" ry="2" fill="url(#towerGradient)"/>
  <ellipse cx="50" cy="50" rx="8" ry="2.5" fill="url(#towerGradient)"/>
  
  <!-- Sky Pod -->
  <ellipse cx="50" cy="35" rx="4" ry="1.5" fill="url(#towerGradient)"/>
  
  <!-- Antenna -->
  <rect x="49.5" y="15" width="1" height="12" fill="#60A5FA"/>
  
  <!-- Antenna tip -->
  <circle cx="50" cy="15" r="1.5" fill="#60A5FA"/>
  
  <!-- Support legs (simplified) -->
  <polygon points="46,65 50,25 46,25" fill="url(#towerGradient)" opacity="0.3"/>
  <polygon points="54,65 50,25 54,25" fill="url(#towerGradient)" opacity="0.3"/>
</svg>`;

function generateIcon(size, filename) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Create a simple CN Tower icon directly on canvas since we can't easily load SVG
  // Background circle
  ctx.fillStyle = '#1F2937';
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/2.2, 0, 2 * Math.PI);
  ctx.fill();
  
  // Border
  ctx.strokeStyle = '#374151';
  ctx.lineWidth = size/50;
  ctx.stroke();
  
  // CN Tower elements
  const centerX = size/2;
  const scale = size/100;
  
  // Main tower shaft
  ctx.fillStyle = '#60A5FA';
  ctx.fillRect(centerX - 2*scale, 25*scale, 4*scale, 45*scale);
  
  // Tower base
  ctx.fillRect(centerX - 4*scale, 65*scale, 8*scale, 8*scale);
  
  // Observation decks (simplified as rectangles)
  ctx.fillRect(centerX - 6*scale, 44*scale, 12*scale, 4*scale);
  ctx.fillRect(centerX - 8*scale, 48*scale, 16*scale, 5*scale);
  
  // Sky Pod
  ctx.fillRect(centerX - 4*scale, 34*scale, 8*scale, 3*scale);
  
  // Antenna
  ctx.fillRect(centerX - 0.5*scale, 15*scale, 1*scale, 12*scale);
  
  // Antenna tip
  ctx.beginPath();
  ctx.arc(centerX, 15*scale, 1.5*scale, 0, 2 * Math.PI);
  ctx.fill();
  
  // Save as PNG
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`public/${filename}`, buffer);
  console.log(`Generated ${filename} (${size}x${size})`);
}

// Generate all required sizes
try {
  generateIcon(32, 'favicon-32.png');
  generateIcon(192, 'logo192.png');
  generateIcon(512, 'logo512.png');
  console.log('All icons generated successfully!');
} catch (error) {
  console.error('Error generating icons:', error);
  console.log('Note: This script requires the "canvas" package. Install with: npm install canvas');
}