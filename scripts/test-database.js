/**
 * Simple database test script
 */

const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

async function testDatabase() {
  try {
    console.log('🧪 Testing StoryForge Database...\n');
    
    // Ensure data directory exists
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Create test database
    const dbPath = path.join(dataDir, 'test.db');
    const db = new Database(dbPath);
    
    // Configure database
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    
    console.log('✅ Database connection established');
    
    // Read and execute schema
    const schemaPath = path.join(__dirname, '../src/lib/database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    db.exec(schema);
    
    console.log('✅ Database schema initialized');
    
    // Test basic operations
    const insertUser = db.prepare(`
      INSERT INTO users (username, age_group, parent_email) 
      VALUES (?, ?, ?)
    `);
    
    const result = insertUser.run('testuser', '7-10', 'parent@example.com');
    console.log('✅ Test user created with ID:', result.lastInsertRowid);
    
    // Test query
    const getUser = db.prepare('SELECT * FROM users WHERE id = ?');
    const user = getUser.get(result.lastInsertRowid);
    console.log('✅ User retrieved:', user);
    
    // Test story creation
    const insertStory = db.prepare(`
      INSERT INTO stories (title, author_id, age_group, template_type) 
      VALUES (?, ?, ?, ?)
    `);
    
    const storyResult = insertStory.run('Test Adventure', result.lastInsertRowid, '7-10', 'adventure');
    console.log('✅ Test story created with ID:', storyResult.lastInsertRowid);
    
    // Get table counts
    const tables = ['users', 'stories', 'story_segments', 'characters'];
    console.log('\n📊 Table Statistics:');
    
    tables.forEach(table => {
      try {
        const count = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get();
        console.log(`   ${table}: ${count.count} records`);
      } catch (error) {
        console.log(`   ${table}: Error - ${error.message}`);
      }
    });
    
    // Clean up
    db.close();
    fs.unlinkSync(dbPath);
    
    console.log('\n🎉 Database test completed successfully!');
    console.log('✅ All core database operations working correctly');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
  }
}

testDatabase();