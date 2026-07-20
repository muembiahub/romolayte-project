import { supabase } from "../config/database.js";

/* =====================================================
   INSCRIPTION
===================================================== */
const signUpWithProfile = async (email, password, profileData) => {
  try {
    console.log("\n========== SIGNUP ==========");
    console.log("📧 Email :", email);
    console.log("👤 Profile :", profileData);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "https://romolayte.space/auth/callback",
        data: {
          full_name: profileData.full_name,
          phone: profileData.phone,
          birthday: profileData.birthday,
          role_id: profileData.role_id,
          category_id: profileData.category_id,
          service_id: profileData.service_id,
        },
      },
    });


    if (error) {
      console.error("\n❌ SUPABASE AUTH SIGNUP ERROR");
      console.error(error);
      console.error("============================\n");

      return {
        success: false,
        message: error.message,
        data: error,
      };
    }

    console.log("\n✅ SUPABASE AUTH SIGNUP SUCCESS");
    console.log(data);
    console.log("===============================\n");

    return {
      success: true,
      message:
        "Inscription validée. Veuillez vérifier vos e-mails si la confirmation est activée.",
      data: {
        user: data.user,
      },
    };
  } catch (err) {
    console.error("\n❌ SIGNUP EXCEPTION");
    console.error(err);
    console.error("===================\n");

    return {
      success: false,
      message: err.message,
      data: err,
    };
  }
};

/* =====================================================
   CONNEXION
===================================================== */
const signInWithProfile = async (email, password) => {
  try {
    console.log("\n========== LOGIN ==========");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("❌ LOGIN ERROR");
      console.error(error);

      return {
        success: false,
        message: error.message,
        data: error,
      };
    }

    console.log("✅ LOGIN SUCCESS");
    console.log("===========================\n");

    return {
      success: true,
      message: "Connexion réussie",
      data: {
        user: data.user,
        session: data.session,
      },
    };
  } catch (err) {
    console.error("❌ LOGIN EXCEPTION");
    console.error(err);

    return {
      success: false,
      message: err.message,
      data: err,
    };
  }
};

/* =====================================================
   PROFIL UTILISATEUR
===================================================== */
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
      .maybeSingle();

    if (error) {
      console.error("❌ GET PROFILE ERROR");
      console.error(error);

      return {
        success: false,
        message: error.message,
        data: error,
      };
    }

    if (!profile) {
      return {
        success: false,
        message: "Profil utilisateur introuvable",
        data: null,
      };
    }

    return {
      success: true,
      message: "Profil récupéré",
      data: profile,
    };
  } catch (err) {
    console.error("❌ GET PROFILE EXCEPTION");
    console.error(err);

    return {
      success: false,
      message: err.message,
      data: err,
    };
  }
};




/* =====================================================
   DECONNEXION
===================================================== */
const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("❌ LOGOUT ERROR");
      console.error(error);

      return {
        success: false,
        message: error.message,
        data: error,
      };
    }

    return {
      success: true,
      message: "Déconnexion réussie",
      data: null,
    };
  } catch (err) {
    console.error("❌ LOGOUT EXCEPTION");
    console.error(err);

    return {
      success: false,
      message: err.message,
      data: err,
    };
  }
};

export {
  signUpWithProfile,
  signInWithProfile,
  getCurrentUser,
  signOut,
};