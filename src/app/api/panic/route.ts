import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET() {
  try {
    const { data, error } = await supabase.from('panic_alerts').select('*');
    if (error) {
      throw error;
    }
    return NextResponse.json(data);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { data, error } = await supabase.from('panic_alerts').insert([payload]).select();
    if (error) {
      throw error;
    }
    return NextResponse.json(data?.[0] ?? payload, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}