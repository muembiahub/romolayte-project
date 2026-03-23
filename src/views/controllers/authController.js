import { auth } from "../../config/database.js";
import { supabase } from "../../config/database.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { createUserProfile } from "../../models/userModel.js";

/* =========================
   SIGNUP
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
      const { data: categories } = await supabase
        .from("categories")
        .select("category_id, name");

      return res.status(400).render("auth", {
        title: "Authentification",
        error: "Les mots de passe ne correspondent pas",
        categories
      });
    }

    // Firebase signup
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const firebaseUser = userCredential.user;

    // Supabase profile
    await createUserProfile({
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

     return res.json({ success: true, redirect: "/dashboard" });
  } catch (error) {
    const { data: categories } = await supabase
      .from("categories")
      .select("category_id, name");

    res.status(400).render("auth", {
      title: "Authentification",
      error: error.message,
      categories
    });
  }
};
/* =========================
   LOGIN
========================= */
const login = async (req, res) => {
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

    // Vérifier si c'est un email ou un username
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

    return res.redirect("/dashboard");

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
