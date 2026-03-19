// src/config/database.js
import { createClient } from "@supabase/supabase-js";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// ✅ Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Supabase URL ou clé manquante. Vérifie tes variables d'environnement.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ✅ Firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

// ✅ Exporter les deux
export { supabase, firebaseApp, auth };
