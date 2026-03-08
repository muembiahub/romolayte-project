// src/db/supabaseClient.js

import { createClient } from '@supabase/supabase-js';

// ⚡️ Utiliser uniquement les variables d'environnement injectées par Netlify
// 👉 Ne jamais mettre les valeurs en dur dans le code
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Vérification simple pour éviter les erreurs si les variables ne sont pas définies
if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Supabase URL ou clé manquante. Vérifie tes variables d'environnement Netlify.");
}

// Initialiser le client Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
