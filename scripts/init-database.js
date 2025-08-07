#!/usr/bin/env node

/**
 * StoryForge Database Initialization Script
 * 
 * This script initializes the database schema and verifies all tables are created correctly.
 * Run this script whenever you need to set up or reset the database.
 * 
 * Usage:
 *   node scripts/init-database.js
 *   npm run db:init (if added to package.json scripts)
 */

const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
  try {
    console.log('🚀 Initializing StoryForge Database...\n');
    
    // Ensure data directory exists
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      console.log('📁 Created data directory');
    }
    
    // Create database connection
    const dbPath = path.join(dataDir, 'storyforge-dev.db');
    const db = new Database(dbPath);
    
    // Configure database for optimal performance
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    db.pragma('synchronous = NORMAL');
    db.pragma('cache_size = 1000');
    db.pragma('temp_store = MEMORY');
    
    console.log('✅ Database connection established');
    console.log('📍 Database location:', dbPath);
    
    // Read and execute schema
    const schemaPath = path.join(__dirname, '../src/lib/database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    
    console.log('📋 Executing database schema...');
    db.exec(schema);
    
    console.log('✅ Database schema initialized successfully');
    
    // Verify all tables were created
    const tables = [
      'users',
      'stories', 
      'story_segments',
      'story_choices',
      'characters',
      'parental_approvals',
      'reading_progress',
      'story_ratings',
      'safety_audit_log'
    ];
    
    console.log('\n🔍 Verifying table creation:');
    let allTablesExist = true;
    
    for (const table of tables) {
      const result = db.prepare(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name=?
      `).get(table);
      
      if (result) {
        console.log(`   ✅ ${table}`);
      } else {
        console.log(`   ❌ ${table} - MISSING!`);
        allTablesExist = false;
      }
    }
    
    if (!allTablesExist) {
      throw new Error('Some tables were not created successfully');
    }
    
    // Verify indexes were created
    console.log('\n🔍 Verifying indexes:');
    const indexes = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='index' AND name LIKE 'idx_%'
    `).all();
    
    indexes.forEach(index => {
      console.log(`   ✅ ${index.name}`);
    });
    
    // Verify triggers were created
    console.log('\n🔍 Verifying triggers:');
    const triggers = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='trigger'
    `).all();
    
    triggers.forEach(trigger => {
      console.log(`   ✅ ${trigger.name}`);
    });
    
    // Get database statistics
    const stats = db.prepare(`
      SELECT page_count * page_size as size 
      FROM pragma_page_count(), pragma_page_size()
    `).get();
    
    console.log('\n📊 Database Statistics:');
    console.log(`   📦 Database size: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log(`   📋 Tables: ${tables.length}`);
    console.log(`   🗂️  Indexes: ${indexes.length}`);
    console.log(`   ⚡ Triggers: ${triggers.length}`);
    
    // Test basic operations
    console.log('\n🧪 Testing basic operations...');
    
    // Test user insertion
    const insertUser = db.prepare(`
      INSERT INTO users (username, age_group, parent_email) 
      VALUES (?, ?, ?)
    `);
    
    const userResult = insertUser.run('test_user', '7-10', 'test@example.com');
    console.log('   ✅ User creation test passed');
    
    // Test story insertion
    const insertStory = db.prepare(`
      INSERT INTO stories (title, author_id, age_group, template_type) 
      VALUES (?, ?, ?, ?)
    `);
    
    const storyResult = insertStory.run('Test Story', userResult.lastInsertRowid, '7-10', 'adventure');
    console.log('   ✅ Story creation test passed');
    
    // Clean up test data
    db.prepare('DELETE FROM stories WHERE id = ?').run(storyResult.lastInsertRowid);
    db.prepare('DELETE FROM users WHERE id = ?').run(userResult.lastInsertRowid);
    console.log('   ✅ Test data cleanup completed');
    
    // Close database
    db.close();
    
    console.log('\n🎉 Database initialization completed successfully!');
    console.log('💡 Your StoryForge database is ready for development.');
    console.log(`📍 Database location: ${dbPath}`);
    
  } catch (error) {
    console.error('\n❌ Database initialization failed:');
    console.error(error.message);
    console.error('\n🔧 Troubleshooting tips:');
    console.error('   • Make sure you have write permissions in the data directory');
    console.error('   • Check that the schema.sql file exists and is readable');
    console.error('   • Verify that better-sqlite3 is installed: npm install better-sqlite3');
    process.exit(1);
  }
}

// Handle script execution
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase }; 