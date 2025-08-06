import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const db = await getDb();
  await db.run('DELETE FROM locations WHERE id = ?', [params.id]);
  return new NextResponse(null, { status: 204 });
}