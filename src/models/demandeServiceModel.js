// models/demandeServiceModel.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const insertDemandeService = async (data) => {
  return await supabase.from("demande_service").insert([data]);
};

export { insertDemandeService };
