import { supabase } from "../config/database.js";

/* =====================================================
   AUTH MIDDLEWARE (USER AUTH)
===================================================== */
export const requireApiAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentification requise",
      });
    }

    const token = authHeader.split(" ")[1];

    // Vérification sécurisée du token JWT natif directement auprès de Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: "Token invalide ou expiré",
      });
    }

    // On attache l'utilisateur à la requête (compatible avec req.user.uid ou req.user.id)
    req.user = {
      id: user.id,
      uid: user.id,
      email: user.email,
    };

    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Erreur interne lors de la vérification de l'authentification",
    });
  }
};

/* =====================================================
   ADMIN MIDDLEWARE
===================================================== */
export const requireApiAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentification requise",
      });
    }

    const token = authHeader.split(" ")[1];

    // 1. Validation du token par Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({
        success: false,
        message: "Token invalide ou expiré",
      });
    }

    req.user = {
      id: user.id,
      uid: user.id,
      email: user.email,
    };

    // 2. Récupération du profil ET du rôle associé en UNE seule requête imbriquée (Jointure)
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select(`
        uid,
        roles!user_profiles_role_id_fkey (
          name
        )
      `)
      .eq("uid", user.id)
      .maybeSingle();

    if (profileError || !profile) {
      return res.status(404).json({
        success: false,
        message: "Profil ou privilèges utilisateur introuvables",
      });
    }

    // 3. Vérification stricte du rôle Administrateur
    const roleName = profile.roles?.name?.toLowerCase();

    if (roleName !== "admin" && roleName !== "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Accès refusé. Droits d'administration requis.",
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Erreur interne lors de la vérification des droits admin",
    });
  }
};
