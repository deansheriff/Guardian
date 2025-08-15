import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { Location } from '@/lib/mock-data';

export async function GET() {
  try {
    const { data: locations, error } = await supabase.from('locations').select('*');
    if (error) {
      throw error;
    }
    return NextResponse.json(locations);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const location: Omit<Location, 'id'> = await request.json();
    const id = new Date().toISOString();
    const newLocation = { ...location, id };
    const { data, error } = await supabase.from('locations').insert([newLocation]).select();
    if (error) {
      throw error;
    }
    return NextResponse.json(data?.[0] ?? newLocation, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}