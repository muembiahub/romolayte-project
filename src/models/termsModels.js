// src/models/cguModel.js
import { supabase } from "../config/database.js";

/**
 * Récupère toutes les sections des CGU
 */
const getAllTerms = async () => {
  const { data, error } = await supabase
    .from("cgu_romolayte")
    .select("*")
    .order("section_num", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * Récupère toutes les sections de la politique de confidentialité
 */
const getPrivacy = async () => {
  const { data, error } = await supabase
    .from("privacy_policy_romolayte")
    .select("*")
    .order("section_num", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};


export { getAllTerms, getPrivacy};
