import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Supabase URL ou clé manquante. Vérifie tes variables d'environnement.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
