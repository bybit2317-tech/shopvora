import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://swkxrpzpuuifcxqlntvf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3a3hycHpwdXVpZmN4cWxudHZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxNTQ2NTEsImV4cCI6MjEwMDczMDY1MX0.rOpxIPs3jgIXo_DgIvLsUEEmkDFh_B-cy5cfmpgOEpc";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
