
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tiivoyeqlkngrlabaqhu.supabase.co";
const supabaseKey = "sb_publishable_5h4xdfLI2Tx8vXEx-KzA4A_IO1tnZrG";

export const supabase = createClient(supabaseUrl, supabaseKey);
