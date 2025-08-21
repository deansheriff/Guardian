import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email, password, name, role, location_id, rank, image_url } = await request.json();
    
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_KEY!
    );

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role, location_id, rank, image_url },
      email_confirm: true,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const { error: profileError } = await supabase.from('users').insert({
        id: data.user.id,
        name,
        email,
        role,
        location_id,
        rank,
        image_url
    });

    if (profileError) {
        await supabaseAdmin.auth.admin.deleteUser(data.user.id);
        return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    return NextResponse.json({ user: data.user });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}