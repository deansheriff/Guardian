import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Location } from '@/lib/mock-data';

export async function GET() {
  try {
    const db = await getDb();
    const locations = await db.all('SELECT * FROM locations');
    return NextResponse.json(locations);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const location: Omit<Location, 'id'> = await request.json();
    const db = await getDb();
    const id = new Date().toISOString();
    const newLocation = { ...location, id };
    await db.run(
      'INSERT INTO locations (id, name, latitude, longitude, radius) VALUES (?, ?, ?, ?, ?)',
      [newLocation.id, newLocation.name, newLocation.latitude, newLocation.longitude, newLocation.radius]
    );
    return NextResponse.json(newLocation, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}