import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { Shift } from '@/context/shift-context';

export async function GET() {
  try {
    const { data: shifts, error } = await supabase.from('shifts').select('*');
    if (error) {
      throw error;
    }
    return NextResponse.json(shifts);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const shift: Omit<Shift, 'id'> = await request.json();
    const id = new Date().toISOString();
    const newShift = { ...shift, id };
    const { data, error } = await supabase.from('shifts').insert([newShift]).select();
    if (error) {
      throw error;
    }
    return NextResponse.json(data?.[0] ?? newShift, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}