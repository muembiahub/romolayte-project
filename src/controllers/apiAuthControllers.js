import { supabase } from "../config/database.js";
import { signUpWithProfile, signInWithProfile, signOut } from "../models/auth.js";

/**
 * Controller pour inscription
 */
export const register = async (
  req,
  res
) => {
  try {
    const {
      email,
      password,
      firstname,
      lastname,
      phone,
      birthday,
      category_id,
      service_id
    } = req.body;

    // Find default role dynamically
    const { data: role, error } =
      await supabase
        .from("roles")
        .select("id")
        .eq("name", "client")
        .single();

    if (error || !role) {
      throw new Error(
        "Role client introuvable"
      );
    }

    const full_name =
      `${firstname} ${lastname}`;

    const profileData = {
      full_name,
      phone,
      birthday,
      role_id: role.id,
      category_id,
      service_id
    };

    const result =
      await signUpWithProfile(
        email,
        password,
        profileData
      );

    res.status(201).json({
      success: true,
      message:
        "Utilisateur inscrit avec succès",
      user: result.user,
      profile: result.profile
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Controller pour connexion
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validation simple
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email et mot de passe requis",
      });
    }

    // 2. Auth service
    const result = await signInWithProfile(email, password);

    return res.status(200).json({
      success: true,
      message: "Connexion réussie",
      user: result.user,
      profile: result.profile,
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    // 3. Gestion erreurs propres
    if (error.message.includes("Invalid login credentials")) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect",
      });
    }

    if (error.message.includes("Profil utilisateur introuvable")) {
      return res.status(404).json({
        success: false,
        message: "Profil utilisateur introuvable",
      });
    }

    // 4. fallback serveur
    return res.status(500).json({
      success: false,
      message: "Erreur serveur, veuillez réessayer plus tard",
    });
  }
};

/**
 * Controller pour déconnexion
 */
export const logout = async (req, res) => {
  try {
    await signOut();
    res.status(200).json({ success: true, message: "Déconnexion réussie" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
