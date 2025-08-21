import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fetch from 'cross-fetch';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL or service key is missing from .env.local file");
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  global: { fetch },
});

async function main() {
  try {
    console.log('Initializing database...');

    const tableCreationQueries = [
      `CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password TEXT,
          role TEXT NOT NULL,
          location_id TEXT,
          rank TEXT,
          image_url TEXT
      );`,
      `CREATE TABLE IF NOT EXISTS locations (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          latitude REAL NOT NULL,
          longitude REAL NOT NULL,
          radius REAL
      );`,
      `CREATE TABLE IF NOT EXISTS activities (
          id TEXT PRIMARY KEY,
          guardid TEXT NOT NULL,
          guard TEXT NOT NULL,
          type TEXT NOT NULL,
          timestamp TIMESTAMPTZ NOT NULL,
          status TEXT NOT NULL,
          location TEXT
      );`,
      `CREATE TABLE IF NOT EXISTS incident_reports (
          id TEXT PRIMARY KEY,
          timestamp TIMESTAMPTZ NOT NULL,
          guardName TEXT,
          location TEXT,
          description TEXT NOT NULL,
          status TEXT NOT NULL,
          severity TEXT
      );`,
      `CREATE TABLE IF NOT EXISTS shifts (
          id TEXT PRIMARY KEY,
          guardid TEXT NOT NULL,
          day TEXT NOT NULL,
          startTime TIMESTAMPTZ NOT NULL,
          endTime TIMESTAMPTZ NOT NULL,
          location_id TEXT
      );`,
      `DROP TABLE IF EXISTS panic_alerts;`,
      `CREATE TABLE panic_alerts (
          id TEXT PRIMARY KEY,
          "timestamp" TIMESTAMPTZ NOT NULL,
          "guardName" TEXT,
          location TEXT
      );`
    ];

    for (const query of tableCreationQueries) {
        // Reverting to use the original 'sql_query' parameter name
        const { error } = await supabase.rpc('execute_sql', { sql_query: query });
        if (error) {
            throw error;
        }
    }

    console.log('Database initialized successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

main();