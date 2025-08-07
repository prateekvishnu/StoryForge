/**
 * Database connection management for StoryForge
 * Provides singleton database connection with retry logic
 */

import Database from 'better-sqlite3';
import { getDatabaseConfig } from './config';
import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private db: Database.Database | null = null;
  private retryCount = 0;
  private maxRetries = 3;

  private constructor() {}

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public async connect(): Promise<Database.Database> {
    if (this.db && this.db.open) {
      return this.db;
    }

    try {
      const config = getDatabaseConfig();
      
      // Ensure data directory exists
      const dataDir = dirname(config.filename);
      if (!existsSync(dataDir)) {
        mkdirSync(dataDir, { recursive: true });
      }

      this.db = new Database(config.filename, config.options);
      
      // Configure database
      this.db.pragma('journal_mode = WAL');
      this.db.pragma('foreign_keys = ON');
      this.db.pragma('synchronous = NORMAL');
      this.db.pragma('cache_size = 1000');
      this.db.pragma('temp_store = MEMORY');

      this.retryCount = 0;
      console.log('Database connected successfully');
      
      return this.db;
    } catch (error) {
      console.error('Database connection error:', error);
      
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        console.log(`Retrying database connection (${this.retryCount}/${this.maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * this.retryCount));
        return this.connect();
      }
      
      throw new Error(`Failed to connect to database after ${this.maxRetries} attempts`);
    }
  }

  public async disconnect(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
      console.log('Database disconnected');
    }
  }

  public async transaction<T>(callback: (db: Database.Database) => T): Promise<T> {
    const db = await this.connect();
    const transaction = db.transaction(callback);
    return transaction(db);
  }

  public isConnected(): boolean {
    return this.db !== null && this.db.open;
  }
}

export const getDatabase = async (): Promise<Database.Database> => {
  const connection = DatabaseConnection.getInstance();
  return connection.connect();
};