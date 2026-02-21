import { createClient } from '@supabase/supabase-js';

// Shared Brain — used for BOTH auth/Glass Box AND live agent data
// Primary Supabase (jpfjyyagdnveumasrgdz) is currently paused; migrated to Shared Brain
const sharedBrainUrl = process.env.NEXT_PUBLIC_SHARED_BRAIN_URL || '';
const sharedBrainKey = process.env.NEXT_PUBLIC_SHARED_BRAIN_ANON_KEY || '';

// supabase = auth client (used by login, middleware, dashboard)
export const supabase = createClient(sharedBrainUrl, sharedBrainKey);

// sharedBrain = same instance (kept for compatibility with agent roster queries)
export const sharedBrain = createClient(sharedBrainUrl, sharedBrainKey);
