import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { User } from '@/lib/types';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const user: User = await request.json();
  const { data, error } = await supabase.from('users').update(user).eq('id', id).select();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data?.[0] ?? user);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const { error } = await supabase.from('users').delete().eq('id', id);
  if (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new NextResponse(null, { status: 204 });
}