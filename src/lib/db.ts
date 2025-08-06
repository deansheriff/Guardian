import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

let db: Database | null = null;

export async function getDb() {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'guardian.db');
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
  }
  return db;
}

export async function initDb() {
  const db = await getDb();

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT,
      role TEXT NOT NULL,
      locationId TEXT,
      rank TEXT,
      imageUrl TEXT
    );

    CREATE TABLE IF NOT EXISTS locations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      radius REAL
    );

    CREATE TABLE IF NOT EXISTS activities (
      id TEXT PRIMARY KEY,
      guardId TEXT NOT NULL,
      guard TEXT NOT NULL,
      type TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      status TEXT NOT NULL,
      location TEXT
    );

    CREATE TABLE IF NOT EXISTS incident_reports (
      id TEXT PRIMARY KEY,
      guard TEXT NOT NULL,
      location TEXT NOT NULL,
      description TEXT NOT NULL,
      timestamp TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS shifts (
      id TEXT PRIMARY KEY,
      guardId TEXT NOT NULL,
      day TEXT NOT NULL,
      startTime TEXT NOT NULL,
      endTime TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS panic_alerts (
      id TEXT PRIMARY KEY,
      guardName TEXT NOT NULL,
      location TEXT NOT NULL,
      timestamp TEXT NOT NULL
    );
  `);
}