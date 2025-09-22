#!/usr/bin/env node

// Environment Verification Script for Optimizer
require('dotenv').config();
const fs = require('fs');
const path = require('path');

console.log('🔧 Optimizer Environment Verification\n');

const checks = [];

// Check 1: .env file exists and has required variables
function checkEnvironmentFile() {
  const envPath = path.join(__dirname, '..', '.env');
  const exists = fs.existsSync(envPath);
  
  if (!exists) {
    checks.push({ name: '.env file', status: '❌', message: 'Missing .env file' });
    return;
  }
  
  const requiredVars = [
    'SENDGRID_API_KEY',
    'SENDGRID_FROM_NAME',
    'DATABASE_URL',
    'SESSION_SECRET',
    'NODE_ENV'
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    checks.push({ 
      name: '.env variables', 
      status: '⚠️', 
      message: `Missing: ${missingVars.join(', ')}` 
    });
  } else {
    checks.push({ name: '.env file', status: '✅', message: 'All required variables present' });
  }
}

// Check 2: SendGrid configuration
function checkSendGridConfig() {
  const apiKey = process.env.SENDGRID_API_KEY;
  const fromName = process.env.SENDGRID_FROM_NAME;
  
  if (!apiKey || apiKey.includes('your_actual_api_key')) {
    checks.push({ name: 'SendGrid API Key', status: '❌', message: 'API key not configured' });
  } else if (!apiKey.startsWith('SG.')) {
    checks.push({ name: 'SendGrid API Key', status: '❌', message: 'Invalid API key format' });
  } else {
    checks.push({ name: 'SendGrid API Key', status: '✅', message: 'Valid API key configured' });
  }
  
  if (fromName === 'Optimizer') {
    checks.push({ name: 'SendGrid From Name', status: '✅', message: 'Correctly set to Optimizer' });
  } else {
    checks.push({ name: 'SendGrid From Name', status: '⚠️', message: `Set to: ${fromName}` });
  }
}

// Check 3: Database configuration
function checkDatabaseConfig() {
  const dbUrl = process.env.DATABASE_URL;
  const dbName = process.env.DB_NAME;
  
  if (!dbUrl) {
    checks.push({ name: 'Database URL', status: '❌', message: 'DATABASE_URL not configured' });
    return;
  }
  
  if (dbUrl.includes('optimizer_db')) {
    checks.push({ name: 'Database URL', status: '✅', message: 'Optimizer database configured' });
  } else if (dbUrl.includes('optimizer')) {
    checks.push({ name: 'Database URL', status: '⚠️', message: 'Still using old LifePlanner database name' });
  } else {
    checks.push({ name: 'Database URL', status: '✅', message: 'Database URL configured' });
  }
}

// Check 4: Session security
function checkSessionConfig() {
  const sessionSecret = process.env.SESSION_SECRET;
  const sessionName = process.env.SESSION_NAME;
  
  if (!sessionSecret || sessionSecret.includes('change_this')) {
    checks.push({ name: 'Session Secret', status: '❌', message: 'Session secret not configured' });
  } else if (sessionSecret.length < 32) {
    checks.push({ name: 'Session Secret', status: '⚠️', message: 'Session secret should be 32+ characters' });
  } else {
    checks.push({ name: 'Session Secret', status: '✅', message: 'Secure session secret configured' });
  }
  
  if (sessionName === 'optimizer_session') {
    checks.push({ name: 'Session Name', status: '✅', message: 'Correctly set to optimizer_session' });
  } else {
    checks.push({ name: 'Session Name', status: '⚠️', message: `Set to: ${sessionName}` });
  }
}

// Check 5: Required files exist
function checkRequiredFiles() {
  const requiredFiles = [
    'package.json',
    'src/modules/login-member-management/services/emailService.ts',
    'src/modules/login-member-management/database/schema.sql',
    'server/index.js',
    'test/emailTest.js'
  ];
  
  requiredFiles.forEach(filePath => {
    const fullPath = path.join(__dirname, '..', filePath);
    const exists = fs.existsSync(fullPath);
    const fileName = path.basename(filePath);
    
    if (exists) {
      checks.push({ name: fileName, status: '✅', message: 'File exists' });
    } else {
      checks.push({ name: fileName, status: '❌', message: 'File missing' });
    }
  });
}

// Check 6: Node modules installed
function checkNodeModules() {
  const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  
  if (!fs.existsSync(nodeModulesPath)) {
    checks.push({ name: 'Node Modules', status: '❌', message: 'Run npm install' });
    return;
  }
  
  // Check for key dependencies
  const keyDeps = ['@sendgrid/mail', 'express', 'pg', 'bcrypt'];
  const missingDeps = keyDeps.filter(dep => {
    const depPath = path.join(nodeModulesPath, dep);
    return !fs.existsSync(depPath);
  });
  
  if (missingDeps.length > 0) {
    checks.push({ name: 'Dependencies', status: '⚠️', message: `Missing: ${missingDeps.join(', ')}` });
  } else {
    checks.push({ name: 'Dependencies', status: '✅', message: 'All key dependencies installed' });
  }
}

// Run all checks
function runChecks() {
  console.log('Running environment checks...\n');
  
  checkEnvironmentFile();
  checkSendGridConfig();
  checkDatabaseConfig();
  checkSessionConfig();
  checkRequiredFiles();
  checkNodeModules();
  
  // Display results
  console.log('📋 Environment Check Results:\n');
  checks.forEach(check => {
    console.log(`${check.status} ${check.name}: ${check.message}`);
  });
  
  // Summary
  const passed = checks.filter(c => c.status === '✅').length;
  const warnings = checks.filter(c => c.status === '⚠️').length;
  const failed = checks.filter(c => c.status === '❌').length;
  
  console.log('\n📊 Summary:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`⚠️ Warnings: ${warnings}`);
  console.log(`❌ Failed: ${failed}`);
  
  if (failed === 0 && warnings === 0) {
    console.log('\n🎉 Environment is ready for development!');
    console.log('\nNext steps:');
    console.log('1. Complete SendGrid sender verification');
    console.log('2. Set up PostgreSQL database: createdb optimizer_db');
    console.log('3. Run database migrations: npm run db:migrate');
    console.log('4. Test email functionality: node test/emailTest.js');
    console.log('5. Start development servers: npm run start:dev');
  } else if (failed === 0) {
    console.log('\n✅ Environment is mostly ready - address warnings when possible');
  } else {
    console.log('\n❌ Environment needs attention - fix failed checks before proceeding');
  }
}

// Run the checks
runChecks();
