import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Activity } from '@/lib/mock-data';

export async function GET() {
  try {
    const db = await getDb();
    const activities = await db.all('SELECT * FROM activities');
    return NextResponse.json(activities);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const activity: Activity = await request.json();
    const db = await getDb();
    await db.run(
      'INSERT INTO activities (id, guardId, guard, type, timestamp, status, location) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [activity.id, activity.guardId, activity.guard, activity.type, activity.timestamp, activity.status, activity.location]
    );
    return NextResponse.json(activity, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}