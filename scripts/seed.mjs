import { getDb, initDb } from '../src/lib/db.js';
import { mockUsers, mockLocations, mockActivities } from '../src/lib/mock-data.js';

async function seed() {
  console.log('Initializing database...');
  await initDb();
  console.log('Database initialized.');

  const db = await getDb();

  console.log('Seeding users...');
  for (const user of mockUsers) {
    await db.run(
      'INSERT OR IGNORE INTO users (id, name, email, password, role, locationId, rank, imageUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [user.id, user.name, user.email, user.password, user.role, user.locationId, user.rank, user.imageUrl]
    );
  }
  console.log('Users seeded.');

  console.log('Seeding locations...');
  for (const location of mockLocations) {
    await db.run(
      'INSERT OR IGNORE INTO locations (id, name, latitude, longitude, radius) VALUES (?, ?, ?, ?, ?)',
      [location.id, location.name, location.latitude, location.longitude, location.radius]
    );
  }
  console.log('Locations seeded.');

  console.log('Seeding activities...');
  for (const activity of mockActivities) {
    await db.run(
      'INSERT OR IGNORE INTO activities (id, guardId, guard, type, timestamp, status, location) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [activity.id, activity.guardId, activity.guard, activity.type, activity.timestamp, activity.status, activity.location]
    );
  }
  console.log('Activities seeded.');

  console.log('Database seeded successfully.');
}

seed().catch((error) => {
  console.error('Error seeding database:', error);
  process.exit(1);
});