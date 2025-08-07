/**
 * Database initialization utilities
 */

import { SchemaManager } from './schema';
import { DatabaseConnection } from './connection';

export async function initializeDatabase(): Promise<void> {
  try {
    console.log('Initializing StoryForge database...');
    
    // Get database connection
    const connection = DatabaseConnection.getInstance();
    await connection.connect();
    
    // Initialize schema
    const schemaManager = SchemaManager.getInstance();
    await schemaManager.initializeSchema();
    
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const schemaManager = SchemaManager.getInstance();
    const isHealthy = await schemaManager.checkSchema();
    
    if (isHealthy) {
      console.log('Database health check passed');
    } else {
      console.warn('Database health check failed');
    }
    
    return isHealthy;
  } catch (error) {
    console.error('Database health check error:', error);
    return false;
  }
}