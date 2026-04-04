import { auth, supabase } from "../config/database.js";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth";
import { createUserProfile } from "../models/userModel.js";

const ROLE_MAP = {
  1: "user",
  2: "prestataire",
  3: "admin",
  4: "super-admin"
};

// Fonction utilitaire pour formater les erreurs Firebase
function formatFirebaseError(error) {
  switch (error.code) {
    case "auth/email-already-in-use":
      return {
        field: "email",
        message: "🚫 Cette adresse e‑mail est déjà utilisée. Veuillez en choisir une autre."
      };
    case "auth/invalid-email":
      return {
        field: "email",
        message: "⚠️ L'adresse e‑mail saisie est invalide."
      };
    case "auth/weak-password":
      return {
        field: "password",
        message: "🔒 Votre mot de passe est trop faible. Utilisez au moins 6 caractères."
      };
    case "auth/user-not-found":
      return {
        field: "usernameOrEmail",
        message: "❌ Aucun compte trouvé avec ces identifiants."
      };
    case "auth/wrong-password":
      return {
        field: "password",
        message: "🔑 Mot de passe incorrect. Veuillez réessayer."
      };
    default:
      return {
        field: null,
        message: "❌ Une erreur inattendue est survenue : " + error.message
      };
  }
}

/* =========================
   SIGNUP avec session + rôle
========================= */
const signup = async (req, res) => {
  const {
    firstname,
    lastname,
    birthday,
    category_id,
    service_id,
    username,
    whatsapp,
    email,
    password,
    confirm_password
  } = req.body;

  try {
    if (password !== confirm_password) {
      return res.status(400).json({
        success: false,
        field: "confirm_password",
        message: "⚠️ Les mots de passe ne correspondent pas."
      });
    }

    // Création compte Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Création profil Supabase avec rôle par défaut (ex: 1)
    const result = await createUserProfile({
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      firstname,
      lastname,
      birthday,
      whatsapp,
      category_id,
      service_id,
      username,
      role_id: 1, // rôle par défaut
      created_at: new Date()
    });

    if (result && result.error) {
      return res.status(400).json({
        success: false,
        message: "❌ Erreur lors de la création du profil Supabase : " + result.error.message
      });
    }

    // ✅ Stocker l’utilisateur en session avec rôle
    req.session.user = {
      uid: firebaseUser.uid,
      username,
      email: firebaseUser.email,
      role_id: 1,
      role: ROLE_MAP[1]
    };

    return res.redirect("/dashboard");

  } catch (error) {
    const formatted = formatFirebaseError(error);
    return res.status(400).json({
      success: false,
      field: formatted.field,
      message: formatted.message
    });
  }
};

/* =========================
   LOGIN avec session + rôle
========================= */
const login = async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  try {
    if (!usernameOrEmail || !password) {
      return res.status(400).json({
        success: false,
        field: !usernameOrEmail ? "usernameOrEmail" : "password",
        message: "⚠️ Identifiant et mot de passe requis."
      });
    }

    const userCredential = await signInWithEmailAndPassword(auth, usernameOrEmail, password);
    const firebaseUser = userCredential.user;

    // Récupérer le profil Supabase (incluant role_id)
    const { data: userProfile, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("uid", firebaseUser.uid)
      .single();

    if (error || !userProfile) {
      return res.status(404).json({
        success: false,
        message: "❌ Profil utilisateur introuvable."
      });
    }

    // ✅ Stocker l’utilisateur en session avec rôle
    req.session.user = {
      uid: firebaseUser.uid,
      username: userProfile.username,
      email: firebaseUser.email,
      role_id: userProfile.role_id,
      role: userProfile.role_id ? ROLE_MAP[userProfile.role_id] : "user",
      firstname: userProfile.firstname,
      lastname: userProfile.lastname,
    };

    return res.redirect("/dashboard");

  } catch (error) {
    const formatted = formatFirebaseError(error);
    return res.status(401).json({
      success: false,
      field: formatted.field,
      message: formatted.message
    });
  }
};

/* =========================
   LOGOUT
========================= */
const logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("mvc_auth_session");
    res.redirect("/auth");
  });
};

export { signup, login, logout };
