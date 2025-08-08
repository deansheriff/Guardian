import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET() {
  try {
    const { data: alerts, error } = await supabase.from('panic_alerts').select('*').order('timestamp', { ascending: false });
    if (error) {
      throw error;
    }
    return NextResponse.json(alerts);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { guardName, location } = await request.json();
    const id = new Date().toISOString();
    const timestamp = new Date().toISOString();
    const { data, error } = await supabase.from('panic_alerts').insert([{ id, guardName, location, timestamp }]).select();
    if (error) {
      throw error;
    }
    return NextResponse.json({ message: 'Panic alert sent' }, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}