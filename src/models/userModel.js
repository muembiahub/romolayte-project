import { supabase } from "../config/database.js";

/**
 * Créer un profil utilisateur
 */
const createUserProfile = async (profileData) => {
  const { data, error } = await supabase
    .from("user_profiles")
    .insert([profileData]);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * Trouver un profil utilisateur par UID
 */
const findUserProfile = async (uid) => {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("uid", uid)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};


 const findDemandeRecus = async () => {
  const { data, error } = await supabase
    .from("demande_service")
    .select(`
      demande_id,
      category_name,
      service_name,
      name,
      price,
      email,
      phone,
      location,
      coordinates,
      gender,
      created_at,
      services:services (
        service_id,
        name,
        description,
        price,
        category:categories (
          category_id,
          name
        ),
        user_profile:user_profiles (
          id,
          firstname,
          lastname,
          email,
          whatsapp,
          role_id
        )
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data;
};




export {
  createUserProfile,
  findUserProfile,
  findDemandeRecus
};