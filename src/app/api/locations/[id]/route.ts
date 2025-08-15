import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function DELETE(request: Request, context: { params: { id: string } }) {
  const { error } = await supabase.from('locations').delete().eq('id', context.params.id);
  if (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new NextResponse(null, { status: 204 });
}