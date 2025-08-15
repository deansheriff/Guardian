import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { Activity } from '@/lib/mock-data';

export async function GET() {
  try {
    const { data: activities, error } = await supabase.from('activities').select('*');
    if (error) {
      throw error;
    }
    return NextResponse.json(activities);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const activity: Activity = await request.json();
    const { data, error } = await supabase.from('activities').insert([activity]).select();
    if (error) {
      throw error;
    }
    return NextResponse.json(data?.[0] ?? activity, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}