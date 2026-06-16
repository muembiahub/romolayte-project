import { supabase } from "../config/database.js";

/**
 * Récupère tous les services, avec le nom de la catégorie.
 */
const getAllServices = async () => {
  const { data, error } = await supabase
    .from("services")
    .select("*, categories(name)") // 🔹 jointure sur la table categories
    .order("name", { ascending: true });

  if (error) {
    console.error("❌ Erreur Supabase (getAllServices):", error.message);
    throw error;
  }

  return data || [];
};

/**
 * Récupère un service par son ID (détail), avec le nom de la catégorie.
 */
const getServiceById = async (serviceId) => {
  const { data, error } = await supabase
    .from("services")
    .select("*, categories(name)") // 🔹 inclut le nom de la catégorie
    .eq("service_id", serviceId)
    .limit(1);

  if (error) {
    console.error("❌ Erreur Supabase (getServiceById):", error.message);
    throw error;
  }

  return data && data.length > 0 ? data[0] : null;
};

/**
 * Récupère tous les services liés à une catégorie donnée, avec le nom de la catégorie.
 */
const getServicesByCategory = async (categoryId) => {
  const { data, error } = await supabase
    .from("services")
    .select("*, categories(name)") // 🔹 inclut le nom de la catégorie
    .eq("category_id", categoryId)
    .order("name", { ascending: true });

  if (error) {
    console.error("❌ Erreur Supabase (getServicesByCategory):", error.message);
    throw error;
  }

  return data || [];
};

const getServicesByCategoryDetails = async (serviceId) => {
  const { data, error } = await supabase
    .from("services")
    .select("*, categories(category_id, name)") 
    .eq("category_id", serviceId);

  if (error) {
    console.error("❌ Erreur Supabase (getServicesByCategoryDetails):", error.message);
    throw error;
  }

  return data || [];
};

//  ajouter service par category selectionner 
const addServiceByCategory = async (
  category_id,
  name,
  description,
  price,
  logo
) => {
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
      .single();

  if (error) {
    console.error(
      "Supabase error:",
      error
    );

    throw new Error(
      error.message
    );
  }

  return data;
};


export { getAllServices, getServiceById, getServicesByCategory, getServicesByCategoryDetails, addServiceByCategory };
