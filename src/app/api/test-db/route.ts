/**
 * Database test API endpoint
 * Tests database connection and basic operations
 */

import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase, checkDatabaseHealth, SchemaManager } from '@/lib/database';

export async function GET(): Promise<NextResponse> {
  try {
    console.log('Testing database connection...');
    
    // Initialize database
    await initializeDatabase();
    
    // Check health
    const isHealthy = await checkDatabaseHealth();
    
    if (!isHealthy) {
      return NextResponse.json(
        { success: false, message: 'Database health check failed' },
        { status: 500 }
      );
    }
    
    // Get database stats
    const schemaManager = SchemaManager.getInstance();
    const stats = await schemaManager.getDatabaseStats();
    
    return NextResponse.json({
      success: true,
      message: 'Database is working correctly',
      stats,
    });
    
  } catch (error) {
    console.error('Database test failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Database test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { action } = await req.json();
    
    switch (action) {
      case 'reinitialize':
        await initializeDatabase();
        return NextResponse.json({ success: true, message: 'Database reinitialized' });
        
      case 'health_check':
        const isHealthy = await checkDatabaseHealth();
        return NextResponse.json({ success: isHealthy, healthy: isHealthy });
        
      case 'stats':
        const schemaManager = SchemaManager.getInstance();
        const stats = await schemaManager.getDatabaseStats();
        return NextResponse.json({ success: true, stats });
        
      default:
        return NextResponse.json(
          { success: false, message: 'Invalid action' },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error('Database test POST failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Database operation failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}