import { supabase } from "../config/database.js";

/**
 * Inscription de l'utilisateur
 * Le profil est créé de manière atomique en BDD via le Trigger SQL
 */
const signUpWithProfile = async (email, password, profileData) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "http://localhost:5173/auth/callback",
        // Les métadonnées sont transmises à la base de données
        data: {
          full_name: profileData.full_name,
          phone: profileData.phone,
          birthday: profileData.birthday,
          role_id: profileData.role_id,
          category_id: profileData.category_id,
          service_id: profileData.service_id
        }
      }
    });

    if (error) {
      return { success: false, message: error.message, data: null };
    }

    return { 
      success: true, 
      message: "Inscription validée. Veuillez vérifier vos e-mails si la confirmation est activée.", 
      data: { user: data.user } 
    };
  } catch (err) {
    return { success: false, message: err.message, data: null };
  }
};

/**
 * Connexion de l'utilisateur
 */
/**
 * Connexion (Login) - Retourne l'utilisateur et sa session (contenant le token JWT)
 */
const signInWithProfile = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return { success: false, message: error.message, data: null };
    }

    // On retourne à la fois user et session pour fournir le token d'accès au contrôleur
    return { 
      success: true, 
      message: "Connexion réussie", 
      data: { 
        user: data.user, 
        session: data.session 
      } 
    };
  } catch (err) {
    return { success: false, message: err.message, data: null };
  }
};


/**
 * Récupération du profil complet
 */
const getCurrentUser = async (uid) => {
  try {
    const { data: profile, error } = await supabase
      .from("user_profiles")
      .select(`
        uid,
        full_name,
        email,
        phone,
        birthday,
        role_id,
        category_id,
        service_id,
        roles!user_profiles_role_id_fkey(
          id,
          name
        )
      `)
      .eq("uid", uid)
      .maybeSingle(); // Évite un crash si le profil n'est pas encore synchronisé

    if (error) {
      return { success: false, message: error.message, data: null };
    }

    if (!profile) {
      return { success: false, message: "Profil utilisateur introuvable", data: null };
    }

    return { success: true, message: "Profil récupéré", data: profile };
  } catch (err) {
    return { success: false, message: err.message, data: null };
  }
};

/**
 * Déconnexion de l'utilisateur
 */
const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { success: false, message: error.message, data: null };
    }

    return { success: true, message: "Déconnexion réussie", data: null };
  } catch (err) {
    return { success: false, message: err.message, data: null };
  }
};

export { signUpWithProfile, signInWithProfile, getCurrentUser, signOut };
