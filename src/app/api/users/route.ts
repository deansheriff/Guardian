import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { User } from '@/lib/mock-data';

export async function GET() {
  try {
    const { data: users, error } = await supabase.from('users').select('*');
    if (error) {
      throw error;
    }
    return NextResponse.json(users);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user: Omit<User, 'id'> = await request.json();
    const id = new Date().toISOString();
    const newUser = { ...user, id };
    const { data, error } = await supabase.from('users').insert([newUser]).select();
    if (error) {
      throw error;
    }
    return NextResponse.json(data?.[0] ?? newUser, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}