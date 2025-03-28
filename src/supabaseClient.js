import { createClient } from '@supabase/supabase-js';

// Validate environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(`
    Missing Supabase credentials! 
    Please check:
    1. Your .env file has VITE_SUPABASE_URL and VITE_SUPABASE_KEY
    2. Variables are prefixed with VITE_
    3. You've restarted the development server
    4. The values match your Supabase project settings
    
    Current values:
    VITE_SUPABASE_URL: ${supabaseUrl ? 'set' : 'missing'}
    VITE_SUPABASE_KEY: ${supabaseKey ? 'set' : 'missing'}
  `);
}

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    storageKey: 'supabase.auth.token'
  }
});

// Add debug logging
console.log('Supabase initialized with URL:', supabaseUrl);

// Test connection
export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('test_connection')
      .select('*')
      .limit(1);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return false;
  }
};