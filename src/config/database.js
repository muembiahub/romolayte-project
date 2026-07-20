// src/config/database.js
import dotenv from "dotenv";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: `${__dirname}/../../.env` });

import { createClient } from "@supabase/supabase-js";

// ✅ Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Supabase URL ou clé manquante. Vérifie tes variables d'environnement.");
}

const supabase = createClient(supabaseUrl, supabaseKey);
console.log("SUPABASE_URL =", process.env.SUPABASE_URL);
console.log(
  "SERVICE KEY =",
  process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 25) + "..."
);


// ✅ Exporter les deux
export { supabase};
