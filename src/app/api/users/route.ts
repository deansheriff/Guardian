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

import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { email, password, name, role } = await request.json();

    // Use the service role key to create a new admin client
    const supabaseAdmin = createClient(
      process.env.storage_NEXT_PUBLIC_SUPABASE_URL!,
      process.env.storage_SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Automatically confirm the email
    });

    if (authError) {
      throw authError;
    }

    if (!authData || !authData.user) {
      throw new Error('Failed to create user in auth.');
    }

    const newUser = {
      id: authData.user.id,
      name,
      email,
      role,
    };

    const { data, error } = await supabase.from('users').insert([newUser]).select();

    if (error) {
      // If inserting into the users table fails, delete the user from auth to keep data consistent
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      throw error;
    }

    return NextResponse.json(data?.[0] ?? newUser, { status: 201 });
  } catch (error: any) {
    console.error('Error creating admin user:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}