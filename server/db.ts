import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '@shared/schema-sqlite';
import path from 'path';

const databasePath = path.resolve(process.cwd(), 'database.sqlite');
const sqlite = new Database(databasePath);

// Enable WAL mode for better performance
sqlite.pragma('journal_mode = WAL');

export const db = drizzle(sqlite, { schema });
export const pool = { query: () => Promise.resolve({ rows: [] }) }; // Legacy compatibility
