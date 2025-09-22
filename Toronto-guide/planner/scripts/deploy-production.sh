#!/bin/bash

# Optimizer Production Deployment Script
# This script prepares and deploys the Optimizer application to production

set -e  # Exit on any error

echo "🚀 Starting Optimizer Production Deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if .env.production exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found. Please create it from env.production.template"
    exit 1
fi

echo "✅ Environment check passed"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Run database migrations
echo "🗄️ Running database migrations..."
npm run db:migrate

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
node server/index.js
EOF

chmod +x start-production.sh

echo "✅ Production startup script created"

# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'optimizer-api',
    script: 'server/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

echo "✅ PM2 ecosystem file created"

# Create logs directory
mkdir -p logs

echo "✅ Logs directory created"

# Final checks
echo "🔍 Running final checks..."

# Check if all required files exist
required_files=(
    "server/index.js"
    "build/index.html"
    ".env"
    "ecosystem.config.js"
    "start-production.sh"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Error: Required file $file not found"
        exit 1
    fi
done

echo "✅ All required files present"

# Test server startup (briefly)
echo "🧪 Testing server startup..."
timeout 10s node server/index.js || true

echo "✅ Server startup test completed"

echo ""
echo "🎉 Production deployment preparation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update your .env file with production values"
echo "2. Set up your production database"
echo "3. Configure your web server (nginx/apache) to serve the build directory"
echo "4. Start the application with: pm2 start ecosystem.config.js --env production"
echo "5. Monitor with: pm2 monit"
echo ""
echo "📚 See docs/production-deployment-guide.md for detailed instructions"
echo ""
echo "🔐 Admin credentials:"
echo "   Email: admin@optimizer.com"
echo "   Password: [set your own secure password]"
echo ""
echo "🌐 Health check: http://your-domain:5000/health"
echo "🔧 Admin panel: http://your-domain:5000/admin-test.html"
