import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST() {
  try {
    const db = await getDb();
    await db.run('DELETE FROM panic_alerts');
    return NextResponse.json({ message: 'Panic alerts reset' });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}