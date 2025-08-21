import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fetch from 'cross-fetch';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL or service key is missing from .env.local file");
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  global: { fetch },
});

async function main() {
  try {
    console.log('Creating admin user...');

    const { data, error } = await supabase.auth.signUp({
      email: 'deansheriff2@gmail.com',
      password: 'password123',
      options: {
        data: {
            name: 'Admin User',
            role: 'admin',
        }
      }
    });

    if (error) {
      throw error;
    }

    console.log('Admin user created successfully:', data.user);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

main();