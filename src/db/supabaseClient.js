// src/db/supabaseClient.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Charger les variables d'environnement depuis .env
dotenv.config();

// Initialiser le client Supabase avec la clé service_role côté serveur
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Exporter le client pour l'utiliser dans les routes
export default supabase;
