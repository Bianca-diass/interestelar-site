
   import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const supabaseUrl = "https://tiivoyeqlkngrlabaqhu.supabase.co";
const supabaseKey = "sb_publishable_5h4xdfLI2Tx8vXEx-KzA4A_IO1tnZrG";

export const supabase = createClient(supabaseUrl, supabaseKey);
