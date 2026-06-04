import { createClient } from '@supabase/supabase-js';

// In Vercel Serverless, environment variables are injected automatically.
// dotenv is NOT needed here — using it was causing the module to fail silently.
// Fallback values are provided for local development without a .env file.
const supabaseUrl = process.env.SUPABASE_URL || 'https://jnovhyyqypvwydpvtubh.supabase.co';
const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impub3ZoeXlxeXB2d3lkcHZ0dWJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1OTY1MzYsImV4cCI6MjA5NjE3MjUzNn0.fhujiFlgnXyFw3aUGdv8a_uyjNsMixBAgjcsIwJKScE';

if (!supabaseAnonKey) {
  console.error('CRITICAL: SUPABASE_ANON_KEY is not set. All database operations will fail.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
