import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const { error } = await supabase.from('locations').delete().eq('id', id);
  if (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new NextResponse(null, { status: 204 });
}