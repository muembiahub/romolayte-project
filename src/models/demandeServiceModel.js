// src/models/demandeServiceModel.js

import { supabase } from "../config/database.js";

/**
 * Créer une nouvelle demande de service
 */
export const insertDemandeService = async ({
  service_id,
  customer_name,
  email,
  phone,
  description,
}) => {
  const { data, error } = await supabase
    .from("demande_service")
    .insert([
      {
        service_id,
        customer_name,
        email,
        phone,
        description,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Erreur insertion demande_service :", error);
    throw new Error(error.message);
  }

  return data;
};