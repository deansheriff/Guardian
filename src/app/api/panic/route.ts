import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDb();
    const alerts = await db.all('SELECT * FROM panic_alerts ORDER BY timestamp DESC');
    return NextResponse.json(alerts);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { guardName, location } = await request.json();
    const db = await getDb();
    const id = new Date().toISOString();
    const timestamp = new Date().toISOString();
    await db.run(
      'INSERT INTO panic_alerts (id, guardName, location, timestamp) VALUES (?, ?, ?, ?)',
      [id, guardName, location, timestamp]
    );
    return NextResponse.json({ message: 'Panic alert sent' }, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}