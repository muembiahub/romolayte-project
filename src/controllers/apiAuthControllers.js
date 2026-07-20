import { supabase } from "../config/database.js";
import {
  signUpWithProfile,
  signInWithProfile,
  getCurrentUser,
  signOut
} from "../models/auth.js";

/* =====================================================
   AUTH CONTROLLERS
===================================================== */

/**
 * Inscription (Register)
 */
export const register = async (req, res) => {
  try {
    const { email, password, firstname, lastname, phone, birthday, category_id, service_id } = req.body;

    if (!email || !password || !firstname || !lastname) {
      return res.status(400).json({ success: false, message: "Champs obligatoires manquants" });
    }

    // Récupérer le rôle par défaut 'client'
   // Récupérer le rôle par défaut 'client'
const { data: role, error } = await supabase
  .from("roles")
  .select("id")
  .eq("name", "client")
  .single();

console.log("ROLE =", role);
console.log("ERROR =", error);

// Vérifier si le rôle a été trouvé
if (error || !role) {
  return res.status(404).json({
    success: false,
    message: "Rôle client introuvable en base de données"
  });
}

const profileData = {
  full_name: `${firstname.trim()} ${lastname.trim()}`,
  phone,
  birthday,
  role_id: role.id,
  category_id,
  service_id
};

const result = await signUpWithProfile(email, password, profileData);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(201).json(result);
  } catch (error) {
  console.error("REGISTER ERROR ==================");
  console.error(error);
  console.error("==================================");

  return res.status(500).json({
    success: false,
    message: error.message,
    error
  });
}
};

/**
 * Connexion (Login)
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email et mot de passe requis" });
    }

    const result = await signInWithProfile(email, password);

    if (!result.success) {
      if (result.message.includes("Invalid login credentials")) {
        return res.status(401).json({ success: false, message: "Email ou mot de passe incorrect" });
      }
      return res.status(400).json(result);
    }

    const { session, user } = result.data;

    // 🔥 CORRECTIF : Récupérer le profil complet (avec le rôle) directement lors du login
    const profileResult = await getCurrentUser(user.id);
    
    if (!profileResult.success) {
      return res.status(400).json({ success: false, message: "Impossible de charger le profil lié" });
    }

    return res.status(200).json({
      success: true,
      message: "Connexion réussie",
      token: session?.access_token || null,
      user: profileResult.data // 🔥 On renvoie le profil complet avec les rôles !
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Erreur interne du serveur lors de la connexion" });
  }
};


/**
 * Déconnexion (Logout)
 */
export const logout = async (req, res) => {
  try {
    const result = await signOut();

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Erreur interne du serveur lors de la déconnexion" });
  }
};

/**
 * Utilisateur connecté (Current user)
 */
export const currentUser = async (req, res) => {
  try {
    // S'assure de récupérer l'identifiant unique injecté par votre middleware d'authentification
    const uid = req.user?.uid || req.user?.id;

    if (!uid) {
      return res.status(401).json({ success: false, message: "Non autorisé, jeton utilisateur manquant" });
    }

    const result = await getCurrentUser(uid);

    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Erreur interne lors de la récupération de l'utilisateur" });
  }
};

export const authCallback = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).send("Code de confirmation verifier.");
    }

    const response = await fetch(
      `${process.env.SUPABASE_URL}/auth/v1/token?grant_type=pkce`,
      {
        method: "POST",
        headers: {
          apikey: process.env.SUPABASE_ANON_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auth_code: code,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("SUPABASE CALLBACK ERROR:", data);

      return res.redirect(
        "https://romolayte.space/login?confirmed=false"
      );
    }

    // L'utilisateur est maintenant confirmé.

    return res.redirect(
      "https://romolayte.space/login?confirmed=true"
    );
  } catch (error) {
    console.error(error);

    return res.redirect(
      "https://romolayte.space/login?confirmed=false"
    );
  }
};