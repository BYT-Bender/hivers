import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://aistoydnablwvquxdian.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpc3RveWRuYWJsd3ZxdXhkaWFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNTg3MDQsImV4cCI6MjA2MzczNDcwNH0.RK73iCgZLt0ZMV3zmJlg-9CV0PWBG5g7_nja0VfJ8PI";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
