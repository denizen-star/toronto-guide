# 🗄️ PostgreSQL Database Setup for Optimizer

## 📋 **Current Status**
- ✅ **Homebrew**: Installed and ready
- ⏳ **PostgreSQL**: Needs to be installed
- ⏳ **Database**: Needs to be created
- ⏳ **Schema**: Needs to be migrated

## 🚀 **Step 1: Install PostgreSQL**

```bash
# Install PostgreSQL using Homebrew
brew install postgresql@14

# Add PostgreSQL to your PATH
echo 'export PATH="/opt/homebrew/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Start PostgreSQL service
brew services start postgresql@14
```

## 🔧 **Step 2: Verify Installation**

```bash
# Check PostgreSQL is running
brew services list | grep postgresql

# Test connection
psql --version

# Connect to default database
psql postgres
```

## 🗄️ **Step 3: Create Optimizer Database**

```bash
# Create the database
createdb optimizer_db

# Verify database exists
psql -l | grep optimizer_db
```

## 📊 **Step 4: Run Database Migrations**

```bash
cd /Users/kervinleacock/Documents/Development/LifePlanner/Toronto-guide/planner

# Run migrations to create schema
npm run db:migrate
```

## 🧪 **Step 5: Test Database Setup**

```bash
# Connect to the database
psql optimizer_db

# Check tables were created
\dt

# Check UUID extension
SELECT * FROM pg_extension WHERE extname = 'uuid-ossp';

# Exit psql
\q
```

## 🚨 **Troubleshooting**

### **"createdb: command not found"**
- PostgreSQL not installed or not in PATH
- Run the installation commands above

### **"Connection refused"**
- PostgreSQL service not started
- Run: `brew services start postgresql@14`

### **"Database already exists"**
- Database already created (this is fine)
- Proceed to migrations

### **"Permission denied"**
- PostgreSQL user permissions issue
- Try: `createuser -s $(whoami)`

## 📝 **Default PostgreSQL Settings**

After installation:
- **Host**: localhost
- **Port**: 5432
- **User**: Your macOS username
- **Password**: None (for development)
- **Database**: optimizer_db

## 🔐 **Update .env File**

After successful installation, your `.env` should have:
```bash
DATABASE_URL=postgresql://$(whoami)@localhost:5432/optimizer_db
DB_HOST=localhost
DB_PORT=5432
DB_NAME=optimizer_db
DB_USER=$(whoami)
DB_PASSWORD=
```

---

**Next**: After database setup, we'll test the complete authentication flow!
