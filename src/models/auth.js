import { supabase } from "../config/database.js";

/**
 * Signup
 */
const signUpWithProfile = async (
  email,
  password,
  profileData
) => {

  const { data, error } =
    await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          "http://localhost:5173/auth/callback"
      }
    });

  if (error) {
    throw new Error(error.message);
  }

  // utilisateur créé mais email pas confirmé
  // on stocke seulement les infos nécessaires
  // le profil pourra être créé après confirmation

  return {
    user: data.user
  };
};


/**
 * Login + récupération profil
 */
const signInWithProfile = async (
  email,
  password
) => {

  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password
    });

  if (error) {
    throw new Error(error.message);
  }

  const uid = data.user.id;
  console.log("uid :" ,uid);

  const {
    data: profile,
    error: profileError
  } = await supabase
    .from("user_profiles")
    .select('*')
    .eq("uid", uid)
    .maybeSingle();
    console.log("PROFILE:", profile);
console.log("ERROR:", error);

  if (profileError) {
    throw new Error(profileError.message);
  }

  if (!profile) {
    throw new Error(
      "Profil utilisateur introuvable"
    );
  }

  return {
    user: data.user,
    profile
  };
};


/**
 * Logout
 */
const signOut = async () => {

  const { error } =
    await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  return true;
};

export {
  signUpWithProfile,
  signInWithProfile,
  signOut
};