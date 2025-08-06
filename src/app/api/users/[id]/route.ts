import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { User } from '@/lib/mock-data';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const user: User = await request.json();
  const db = await getDb();
  await db.run(
    'UPDATE users SET name = ?, email = ?, password = ?, role = ?, locationId = ?, rank = ?, imageUrl = ? WHERE id = ?',
    [user.name, user.email, user.password, user.role, user.locationId, user.rank, user.imageUrl, params.id]
  );
  return NextResponse.json(user);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const db = await getDb();
  await db.run('DELETE FROM users WHERE id = ?', [params.id]);
  return new NextResponse(null, { status: 204 });
}