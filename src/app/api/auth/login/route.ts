import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    const { user } = data;
    const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

    if (profileError) {
        return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    return NextResponse.json({ user: userProfile });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}