import { createClient } from '@supabase/supabase-js';

// Access environment variables using Vite's import.meta.env
// We cast to 'any' to avoid TypeScript errors if types aren't generated
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

// Check if keys are actually present and user has replaced the default placeholder
// We simply check if the key is long enough to be a valid Supabase key
const isValidConfiguration = supabaseUrl && 
                             supabaseAnonKey && 
                             supabaseAnonKey.length > 20 &&
                             !supabaseAnonKey.includes('sb_publishable_nKnfDmti-bI6BStdE_8rDQ_dkxwXBm8');

if (!isValidConfiguration) {
  console.log("Supabase is not configured yet. Falling back to local storage.");
}

export const supabase = isValidConfiguration 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export const isCloudEnabled = !!supabase;