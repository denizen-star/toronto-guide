const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function runMigrations() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Starting database migrations...');
    
    // Read and execute the schema file
    const schemaPath = path.join(__dirname, '../../src/modules/login-member-management/database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📊 Creating database schema...');
    await client.query(schema);
    
    console.log('✅ Database migrations completed successfully!');
    
    // Test the setup by checking if tables exist
    const tableCheckQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'user_sessions', 'user_profiles', 'user_audit_logs', 'password_reset_tokens', 'email_verification_tokens')
      ORDER BY table_name;
    `;
    
    const result = await client.query(tableCheckQuery);
    console.log('📋 Created tables:');
    result.rows.forEach(row => {
      console.log(`  ✓ ${row.table_name}`);
    });
    
    // Check if UUID extension is installed
    const uuidCheck = await client.query("SELECT * FROM pg_extension WHERE extname = 'uuid-ossp'");
    if (uuidCheck.rows.length > 0) {
      console.log('🆔 UUID extension installed and ready');
    } else {
      console.log('⚠️  UUID extension not found - make sure PostgreSQL has uuid-ossp extension available');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

async function main() {
  try {
    await runMigrations();
    console.log('🎉 All migrations completed successfully!');
  } catch (error) {
    console.error('💥 Migration process failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  main();
}

module.exports = { runMigrations };
