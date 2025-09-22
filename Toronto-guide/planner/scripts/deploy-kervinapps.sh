#!/bin/bash

# Optimizer Deployment Script for optimizer.kervinapps.com
# This script deploys the Optimizer application to production

set -e  # Exit on any error

echo "🚀 Deploying Optimizer to optimizer.kervinapps.com..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Create production environment file
echo "📝 Creating production environment configuration..."
cat > .env << 'EOF'
# Optimizer Production Environment for optimizer.kervinapps.com
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://optimizer.kervinapps.com

# Database Configuration
DATABASE_URL=postgresql://kervinleacock@localhost:5432/optimizer_prod
DB_HOST=localhost
DB_PORT=5432
DB_NAME=optimizer_prod
DB_USER=kervinleacock

# Session Configuration
SESSION_SECRET=optimizer-production-session-secret-32-characters-minimum
SESSION_NAME=optimizer_session

# SendGrid Email Configuration
SENDGRID_API_KEY=your-sendgrid-api-key-here
SENDGRID_FROM_EMAIL=noreply@kervinapps.com
SENDGRID_FROM_NAME=Optimizer

# Security Configuration
CORS_ORIGIN=https://optimizer.kervinapps.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Production Settings
DEBUG=false
ENABLE_DETAILED_ERRORS=false
EOF

echo "✅ Production environment configured"

# Install production dependencies
echo "📦 Installing production dependencies..."
npm ci --only=production

# Create production database if it doesn't exist
echo "🗄️ Setting up production database..."
createdb optimizer_prod 2>/dev/null || echo "Database optimizer_prod already exists"

# Copy the existing schema to production database
echo "📋 Setting up production database schema..."
/opt/homebrew/opt/postgresql@14/bin/psql optimizer_prod -f src/modules/login-member-management/database/schema.sql

# Create admin user for production
echo "👤 Creating production admin user..."
node -e "
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'kervinleacock',
  host: 'localhost',
  database: 'optimizer_prod',
  port: 5432,
  ssl: false
});

async function createAdmin() {
  try {
    // Check if admin already exists
    const checkResult = await pool.query('SELECT id FROM users WHERE email = \$1', ['admin@kervinapps.com']);
    
    if (checkResult.rows.length === 0) {
      // Hash the password
      const hashedPassword = await bcrypt.hash('OptimizerAdmin2025!', 10);
      
      // Create admin user
      await pool.query(\`
        INSERT INTO users (email, password_hash, first_name, last_name, role, is_active, email_verified, profile_completed)
        VALUES (\$1, \$2, \$3, \$4, \$5, \$6, \$7, \$8)
      \`, ['admin@kervinapps.com', hashedPassword, 'Admin', 'User', 'admin', true, true, true]);
      
      console.log('✅ Production admin user created');
      console.log('📧 Email: admin@kervinapps.com');
      console.log('🔑 Password: OptimizerAdmin2025!');
    } else {
      console.log('ℹ️ Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  } finally {
    await pool.end();
  }
}

createAdmin();
"

# Build React application
echo "🏗️ Building React application..."
npm run build

# Check if build was successful
if [ ! -d "build" ]; then
    echo "❌ Error: Build failed. No build directory found."
    exit 1
fi

echo "✅ Build completed successfully"

# Create production startup script
cat > start-production.sh << 'EOF'
#!/bin/bash
export NODE_ENV=production
export PORT=5000
node server/index.js
EOF

chmod +x start-production.sh

# Create PM2 ecosystem file for production
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'optimizer-kervinapps',
    script: 'server/index.js',
    instances: 2,
    exec_mode: 'cluster',
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G'
  }]
};
EOF

# Create logs directory
mkdir -p logs

# Create nginx configuration template
cat > nginx-optimizer.conf << 'EOF'
# Nginx configuration for optimizer.kervinapps.com
server {
    listen 80;
    server_name optimizer.kervinapps.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name optimizer.kervinapps.com;
    
    # SSL Configuration (update with your certificate paths)
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Serve React build files
    location / {
        root /path/to/optimizer/build;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Proxy API requests to Node.js server
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Health check endpoint
    location /health {
        proxy_pass http://localhost:5000;
        access_log off;
    }
}
EOF

echo "✅ Nginx configuration created: nginx-optimizer.conf"

# Final deployment summary
echo ""
echo "🎉 Optimizer deployment preparation complete!"
echo ""
echo "📋 Production Setup Summary:"
echo "🌐 Domain: optimizer.kervinapps.com"
echo "🔧 Server: Node.js on port 5000"
echo "🗄️ Database: optimizer_prod"
echo "👤 Admin: admin@kervinapps.com"
echo "🔑 Password: OptimizerAdmin2025!"
echo ""
echo "📋 Next Steps:"
echo "1. Copy the build/ directory to your web server"
echo "2. Configure nginx with nginx-optimizer.conf"
echo "3. Set up SSL certificates"
echo "4. Start the application: pm2 start ecosystem.config.js --env production"
echo "5. Test: https://optimizer.kervinapps.com"
echo ""
echo "🔧 Manual Commands:"
echo "   Start: pm2 start ecosystem.config.js --env production"
echo "   Monitor: pm2 monit"
echo "   Logs: pm2 logs optimizer-kervinapps"
echo "   Restart: pm2 restart optimizer-kervinapps"
echo ""
echo "🌐 URLs:"
echo "   Main App: https://optimizer.kervinapps.com"
echo "   Admin Panel: https://optimizer.kervinapps.com/admin-test.html"
echo "   Health Check: https://optimizer.kervinapps.com/health"
echo ""
echo "✅ Ready for production deployment!"
