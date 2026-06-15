import { supabase } from "../config/database.js";

const getOrder = async () => {
  // We specify the joined table and its columns inside the select string
  const { data, error } = await supabase
    .from("categories")
    .select(`
      category_id, 
      name,
      services (
        service_id,
        name
      )
    `);

  if (error) {
    console.error("Error fetching categories with services:", error.message);
    throw new Error("Failed to fetch categories");
  }

  return data || [];
};

export { getOrder };
