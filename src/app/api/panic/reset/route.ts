import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function POST() {
  try {
    const { error } = await supabase.from('panic_alerts').delete().neq('id', '0'); // Deletes all rows
    if (error) {
      throw error;
    }
    return NextResponse.json({ message: 'Panic alerts reset' });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}