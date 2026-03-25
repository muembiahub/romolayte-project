import { auth } from "../../config/database.js";
import { supabase } from "../../config/database.js";
import {  createUserWithEmailAndPassword,signInWithEmailAndPassword} from "firebase/auth";
import { createUserProfile } from "../../models/userModel.js";




/* =========================
   SIGNUP (JSON only, avec gestion des erreurs)
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
    // Vérification mots de passe
    if (password !== confirm_password) {
      return res.status(400).json({
        success: false,
        field: "confirm_password",
        message: "Les mots de passe ne correspondent pas"
      });
    }

    // Création compte Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Création profil Supabase
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
      role_id: 1,
      created_at: new Date()
    });

    // Vérifier si createUserProfile a renvoyé une erreur
    if (result && result.error) {
      return res.status(400).json({
        success: false,
        message: "Erreur lors de la création du profil Supabase : " + result.error.message
      });
    }

    // Succès → retour sur la page auth avec paramètre registered=true
    return res.json({
      success: true,
      redirect: "/auth?registered=true",
      message: "Compte créé avec succès. Veuillez vous connecter."
    });

  } catch (error) {
    // Gestion des erreurs Firebase courantes
    let field = null;
    let message = "Erreur lors de l'inscription";

    switch (error.code) {
      case "auth/email-already-in-use":
        field = "email";
        message = "Cette adresse email est déjà utilisée. Veuillez en choisir une autre.";
        break;
      case "auth/invalid-email":
        field = "email";
        message = "Adresse email invalide.";
        break;
      case "auth/weak-password":
        field = "password";
        message = "Mot de passe trop faible. Minimum 6 caractères.";
        break;
      default:
        message = error.message || message;
    }

    return res.status(400).json({
      success: false,
      field,
      message
    });
  }
};

/* =========================
   LOGIN
========================= */
const login = async (req, res, next) => {
  let { usernameOrEmail, password } = req.body;

  try {
    if (!usernameOrEmail || !password) {
      return res.status(400).json({
        success: false,
        field: !usernameOrEmail ? "usernameOrEmail" : "password",
        message: "Identifiant et mot de passe requis"
      });
    }

    usernameOrEmail = usernameOrEmail.trim().toLowerCase();
    let emailToUse = usernameOrEmail;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(usernameOrEmail)) {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("email")
        .ilike("username", usernameOrEmail)
        .single();

      if (error || !data) {
        return res.status(400).json({
          success: false,
          field: "usernameOrEmail",
          message: "Utilisateur introuvable"
        });
      }

      emailToUse = data.email;
    }

    // Firebase login
    let userCredential;
    try {
      userCredential = await signInWithEmailAndPassword(auth, emailToUse, password);
    } catch (err) {
      return res.status(400).json({
        success: false,
        field: "password",
        message: "Email ou Mot de passe incorrect"
      });
    }

    const firebaseUser = userCredential.user;

    // Supabase profile
    const { data: profile, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("uid", firebaseUser.uid)
      .single();

    if (error || !profile) {
      return res.status(400).json({
        success: false,
        field: "usernameOrEmail",
        message: "Profil utilisateur introuvable"
      });
    }

    /* ✅ SESSION */
    const ROLE_MAP = {
      1: "user",
      2: "prestataire",
      3: "admin",
      4: "super-admin"
    };

    const roleId = profile.role_id;
    const roleName = ROLE_MAP[roleId] || "user";

    req.session.user = {
      uid: profile.uid,
      username: profile.username,
      email: profile.email,
      firstname: profile.firstname,
      lastname: profile.lastname,
      logo: profile.logo,
      birthday: profile.birthday,
      created_at: profile.created_at,
      role_id: roleId,
      role: roleName,
      role_level: roleId,
      service_id: profile.service_id,
      category_id: profile.category_id
    };
//  
   req.session.save(err => {
  if (err) return next(err);
  res.json({ success: true, redirect: "/dashboard" });
});


  } catch (error) {
    return res.status(500).json({
      success: false,
      field: null,
      message: "Erreur interne du serveur"
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
