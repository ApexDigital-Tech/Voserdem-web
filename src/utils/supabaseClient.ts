import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://jnovhyyqypvwydpvtubh.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseAnonKey) {
  console.warn('Warning: SUPABASE_ANON_KEY is missing from environment.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
