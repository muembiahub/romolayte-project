
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
        categories (
          name
        )
      `)
      .order("service_id", {
        ascending: true,
      });

    if (error) throw error;

    return (
      data?.map((service) => ({
        ...service,
      })) || []
    );

  } catch (err) {
    throw new Error(
      `getAllServices failed: ${err.message}`
    );
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


// 🔹 Créer un service
export const addServiceByCategory = async (
  category_id,
  name,
  description,
  price,
  logo
) => {
  try {
    const { data, error } =
      await supabase
        .from("services")
        .insert([
          {
            category_id,
            name,
            description,
            price,
            logo,
          },
        ])
        .select()
        .maybeSingle();

    if (error) throw error;

    return data;

  } catch (err) {
    throw new Error(
      `addServiceByCategory failed: ${err.message}`
    );
  }
};


// 🔹 Modifier un service
export const updateService = async (
  id,
  updates
) => {
  try {
    const { data, error } =
      await supabase
        .from("services")
        .update(updates)
        .eq(
          "service_id",
          id
        )
        .select()
        .maybeSingle();

    if (error) throw error;

    return data;

  } catch (err) {
    throw new Error(
      `updateService failed: ${err.message}`
    );
  }
};


// 🔹 Supprimer un service
export const deleteService = async (
  id
) => {
  try {
    const { error } =
      await supabase
        .from("services")
        .delete()
        .eq(
          "service_id",
          id
        );

    if (error) throw error;

    return {
      success: true,
      message:
        "Service supprimé avec succès.",
    };

  } catch (err) {
    throw new Error(
      `deleteService failed: ${err.message}`
    );
  }
};