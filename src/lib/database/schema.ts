/**
 * Database schema management for StoryForge
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { getDatabase } from './connection';

export class SchemaManager {
  private static instance: SchemaManager;

  private constructor() {}

  public static getInstance(): SchemaManager {
    if (!SchemaManager.instance) {
      SchemaManager.instance = new SchemaManager();
    }
    return SchemaManager.instance;
  }

  public async initializeSchema(): Promise<void> {
    try {
      const db = await getDatabase();
      const schemaPath = join(process.cwd(), 'src/lib/database/schema.sql');
      const schema = readFileSync(schemaPath, 'utf-8');
      
      // Execute schema creation
      db.exec(schema);
      
      console.log('Database schema initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database schema:', error);
      throw error;
    }
  }

  public async checkSchema(): Promise<boolean> {
    try {
      const db = await getDatabase();
      
      // Check if main tables exist
      const tables = ['users', 'stories', 'story_segments', 'characters'];
      
      for (const table of tables) {
        const result = db.prepare(`
          SELECT name FROM sqlite_master 
          WHERE type='table' AND name=?
        `).get(table);
        
        if (!result) {
          console.warn(`Table ${table} does not exist`);
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Schema check failed:', error);
      return false;
    }
  }

  public async getTableInfo(tableName: string): Promise<Array<Record<string, unknown>>> {
    const db = await getDatabase();
    return db.prepare(`PRAGMA table_info(${tableName})`).all() as Array<Record<string, unknown>>;
  }

  public async getDatabaseStats(): Promise<Record<string, unknown>> {
    const db = await getDatabase();
    
    const stats: Record<string, unknown> = {};
    
    // Get table counts
    const tables = ['users', 'stories', 'story_segments', 'characters', 'parental_approvals'];
    
    for (const table of tables) {
      try {
        const result = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get() as { count: number };
        stats[table] = result.count;
      } catch {
        stats[table] = 0;
      }
    }
    
    // Get database size
    try {
      const sizeResult = db.prepare(`
        SELECT page_count * page_size as size 
        FROM pragma_page_count(), pragma_page_size()
      `).get() as { size: number };
      stats.database_size = sizeResult.size;
    } catch {
      stats.database_size = 0;
    }
    
    return stats;
  }
}