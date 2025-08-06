import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Shift } from '@/context/shift-context';

export async function GET() {
  try {
    const db = await getDb();
    const shifts = await db.all('SELECT * FROM shifts');
    return NextResponse.json(shifts);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const shift: Omit<Shift, 'id'> = await request.json();
    const db = await getDb();
    const id = new Date().toISOString();
    const newShift = { ...shift, id };
    await db.run(
      'INSERT INTO shifts (id, guardId, day, startTime, endTime) VALUES (?, ?, ?, ?, ?)',
      [newShift.id, newShift.guardId, newShift.day, newShift.startTime, newShift.endTime]
    );
    return NextResponse.json(newShift, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}