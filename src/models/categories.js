import { supabase } from "../config/database.js";

const getCategories = async () => {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("category_id", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error.message);
    throw new Error("Failed to fetch categories");
  }

  return data || [];
};
//  
const getServicesByCategory = async (categoryId) => {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("category_id", categoryId)
    .order("service_id", { ascending: true });

  if (error) {
    console.error("Error fetching services:", error.message);
    throw new Error("Failed to fetch services");
  }
}
export { getCategories, getServicesByCategory };
