import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { User } from '@/lib/mock-data';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const user: User = await request.json();
  const { data, error } = await supabase.from('users').update(user).eq('id', params.id).select();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data?.[0] ?? user);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { error } = await supabase.from('users').delete().eq('id', params.id);
  if (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new NextResponse(null, { status: 204 });
}