
import { supabase } from "../config/database.js";

/* =====================================================
   SERVICES CRUD
===================================================== */

// 🔹 Lire tous les services
export const getAllServices = async () => {
  try {
    const { data, error } = await supabase
      .from("services")
      .select(`
        *,
        category:categories (
          name
        )
      `)
      // Tri croissant (A-Z ou ID de 1 à X)
      .order("service_id", { ascending: false });

    if (error) throw error;

    // Retourne directement le tableau nettoyé
    return data || [];

  } catch (err) {
    throw new Error(`getAllServices failed: ${err.message}`);
  }
};



// 🔹 Lire un service par ID
export const getServiceById = async (service_id) => {
  try {
    const { data, error } = await supabase
      .from("services")
      .select(`
        *,
        categories (
          category_id,
          name
        )
      `)
      .eq("service_id", service_id)
      .maybeSingle();
    if (error) throw error;

    return data;

  } catch (err) {
    throw new Error(
      `getServiceById failed: ${err.message}`
    );
  }
};


// 🔹 Lire les services par catégorie
export const getServicesByCategory = async (
  categoryId
) => {
  try {
    const { data, error } =
      await supabase
        .from("services")
        .select(`
          *,
          categories (
            name
          )
        `)
        .eq(
          "category_id",
          categoryId
        )
        .order(
          "service_id",
          {
            ascending: true,
          }
        );

    if (error) throw error;

    return (
      data?.map((service) => ({
        ...service,
      })) || []
    );

  } catch (err) {
    throw new Error(
      `getServicesByCategory failed: ${err.message}`
    );
  }
};

