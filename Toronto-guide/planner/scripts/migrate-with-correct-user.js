const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Use correct database configuration for macOS PostgreSQL
const dbConfig = {
  host: 'localhost',
  port: 5432,
  database: 'optimizer_db',
  user: 'kervinleacock', // Your macOS username
  // No password needed for local development
};

const pool = new Pool(dbConfig);

async function runMigrations() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Starting database migrations for Optimizer...');
    console.log(`📊 Connecting to: ${dbConfig.user}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);
    
    // Read and execute the schema file
    const schemaPath = path.join(__dirname, '../src/modules/login-member-management/database/schema.sql');
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
    
    // Test UUID generation
    const uuidTest = await client.query("SELECT uuid_generate_v4() as test_uuid");
    console.log('🧪 UUID generation test:', uuidTest.rows[0].test_uuid);
    
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
    console.log('');
    console.log('🚀 Next steps:');
    console.log('1. Update .env file with: DATABASE_URL=postgresql://kervinleacock@localhost:5432/optimizer_db');
    console.log('2. Test full authentication flow');
    console.log('3. Start implementing Persona Module');
  } catch (error) {
    console.error('💥 Migration process failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run migrations
main();
