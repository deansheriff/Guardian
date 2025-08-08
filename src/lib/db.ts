import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.storage_NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.storage_NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);