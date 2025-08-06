import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { User } from '@/lib/mock-data';

export async function GET() {
  try {
    const db = await getDb();
    const users = await db.all('SELECT * FROM users');
    return NextResponse.json(users);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user: Omit<User, 'id'> = await request.json();
    const db = await getDb();
    const id = new Date().toISOString();
    const newUser = { ...user, id };
    await db.run(
      'INSERT INTO users (id, name, email, password, role, locationId, rank, imageUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [newUser.id, newUser.name, newUser.email, newUser.password, newUser.role, newUser.locationId, newUser.rank, newUser.imageUrl]
    );
    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}