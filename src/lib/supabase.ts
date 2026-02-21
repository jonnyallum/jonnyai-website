import { createClient } from '@supabase/supabase-js';

// Primary Supabase — client auth, Glass Box project data, leads
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Shared Brain — live agent data, chatroom intake, orchestra status
const sharedBrainUrl = process.env.NEXT_PUBLIC_SHARED_BRAIN_URL || '';
const sharedBrainKey = process.env.NEXT_PUBLIC_SHARED_BRAIN_ANON_KEY || '';
export const sharedBrain = createClient(sharedBrainUrl, sharedBrainKey);
