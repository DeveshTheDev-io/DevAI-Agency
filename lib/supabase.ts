import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tyzeqentofkjvuvnbens.supabase.co';
// WARNING: Exposed Anon Key from the prompt for the assignment, usually this should be in .env
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5emVxZW50b2ZranZ1dm5iZW5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNDQ5ODgsImV4cCI6MjA4OTkyMDk4OH0.m6d1qqQmnYM_sUzu5XPTn-6GbjKMCfcvvPYrs5hkRrU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
