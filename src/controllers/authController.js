import { auth, supabase } from "../config/database.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { createUserProfile } from "../models/userModel.js";

const ROLE_MAP = {
  1: "user",
  2: "prestataire",
  3: "admin",
  4: "super-admin"
};

/**
 * Formate proprement les codes d'erreur natifs de Firebase Authentication.
 */
function formatFirebaseError(error) {
  switch (error.code) {
    case "auth/email-already-in-use":
      return { field: "email", message: "🚫 Cette adresse e-mail est déjà utilisée." };
    case "auth/invalid-email":
      return { field: "email", message: "⚠️ L'adresse e-mail saisie est invalide." };
    case "auth/weak-password":
      return { field: "password", message: "🔒 Votre mot de passe doit contenir au moins 6 caractères." };
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return { field: "usernameOrEmail", message: "❌ Identifiants ou mot de passe incorrects." };
    default:
      return { field: null, message: `❌ Erreur d'authentification : ${error.message}` };
  }
}

/* ==========================================================================
   SIGNUP
   ========================================================================== */
const signup = async (req, res) => {
  const { 
    firstname, lastname, birthday, category_id, service_id, 
    username, whatsapp, email, password, confirm_password 
  } = req.body;

  try {
    // 1. Validations initiales
    if (!email || !password || !username) {
      return res.status(400).json({ success: false, message: "⚠️ Les champs obligatoires sont manquants." });
    }
    if (password !== confirm_password) {
      return res.status(400).json({ success: false, field: "confirm_password", message: "⚠️ Les mots de passe ne correspondent pas." });
    }

    // 2. Création du compte dans Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const firebaseUser = userCredential.user;

    // 3. Persistance du profil étendu dans Supabase
    const defaultRoleId = 1;
    const result = await createUserProfile({
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      firstname: firstname?.trim(),
      lastname: lastname?.trim(),
      birthday,
      whatsapp,
      category_id,
      service_id,
      username: username.trim(),
      role_id: defaultRoleId,
      created_at: new Date()
    });

    if (result?.error) {
      throw new Error(`[Supabase Error] ${result.error.message}`);
    }

    // 4. Initialisation de la session utilisateur
    req.session.user = {
      uid: firebaseUser.uid,
      username: username.trim(),
      email: firebaseUser.email,
      role_id: defaultRoleId,
      role: ROLE_MAP[defaultRoleId]
    };

    // 5. Réponse JSON (Pratique moderne pour les requêtes Fetch/Axios sur le front-end)
    return res.status(201).json({ success: true, redirect: "/dashboard" });

  } catch (error) {
    console.error("[Signup Exception]:", error);
    const formatted = formatFirebaseError(error);
    return res.status(400).json({ success: false, field: formatted.field, message: formatted.message });
  }
};

/* ==========================================================================
   LOGIN
   ========================================================================== */
const login = async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  try {
    // 1. Validation de présence
    if (!usernameOrEmail || !password) {
      return res.status(400).json({ 
        success: false, 
        field: !usernameOrEmail ? "usernameOrEmail" : "password", 
        message: "⚠️ Identifiant et mot de passe requis." 
      });
    }

    // 2. Détermine l'email à utiliser pour Firebase
    let emailForAuth = usernameOrEmail.trim();
    if (!emailForAuth.includes("@")) {
      const { data: userProfileByUsername, error: usernameError } = await supabase
        .from("user_profiles")
        .select("email")
        .ilike("username", usernameOrEmail.trim())
        .maybeSingle();

      if (usernameError || !userProfileByUsername) {
        return res.status(404).json({ success: false, message: "❌ Identifiants ou mot de passe incorrects." });
      }

      emailForAuth = userProfileByUsername.email;
    }

    const userCredential = await signInWithEmailAndPassword(auth, emailForAuth, password);
    const firebaseUser = userCredential.user;

    // 3. Récupération des rôles et métadonnées dans Supabase
    const { data: userProfile, error: supabaseError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("uid", firebaseUser.uid)
      .maybeSingle(); // Préféré à .single() pour éviter de lever une exception si vide

    if (supabaseError || !userProfile) {
      return res.status(404).json({ success: false, message: "❌ Profil applicatif introuvable." });
    }

    // 4. Stockage des données critiques en session
    req.session.user = {
      uid: firebaseUser.uid,
      username: userProfile.username,
      email: firebaseUser.email,
      role_id: userProfile.role_id,
      role: ROLE_MAP[userProfile.role_id] || "user",
      firstname: userProfile.firstname,
      lastname: userProfile.lastname,
    };

    return res.status(200).json({ success: true, redirect: "/dashboard" });

  } catch (error) {
    console.error("[Login Exception]:", error);
    const formatted = formatFirebaseError(error);
    return res.status(401).json({ success: false, field: formatted.field, message: formatted.message });
  }
};

/* ==========================================================================
   LOGOUT
   ========================================================================== */
const logout = (req, res) => {
  if (!req.session) {
    return res.redirect("/auth");
  }

  req.session.destroy((err) => {
    if (err) {
      console.error("[Logout Error]: Échec de la destruction de la session", err);
      return res.status(500).json({ success: false, message: "Impossible de fermer la session." });
    }
    
    res.clearCookie("mvc_auth_session");
    return res.redirect("/auth");
  });
};

const getAuthStatus = (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ success: false, message: "Authentification requise." });
  }

  return res.json({ success: true, user: req.session.user });
};

export { signup, login, logout, getAuthStatus };
