import { Request, Response } from 'express';
import { db } from './db';

export async function healthCheck(req: Request, res: Response) {
  try {
    // Check database connection
    await db.run('SELECT 1');
    
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected',
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Service Unavailable',
      database: 'disconnected',
      environment: process.env.NODE_ENV || 'development'
    });
  }
}
