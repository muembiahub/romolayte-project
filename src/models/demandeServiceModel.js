// src/models/demandeServiceModel.js
import { supabase } from "../config/database.js";

/**
 * Insertion d'une demande de service
 */
const insertDemandeService = async (demande) => {
  const { data, error } = await supabase
    .from("demande_service")
    .insert([demande])
    .select(); // renvoie la ligne insérée

  if (error) {
    throw error; // on laisse le contrôleur gérer l'erreur
  }

  // retourne directement l'objet inséré (première ligne)
  return data[0];
};

export { insertDemandeService };
