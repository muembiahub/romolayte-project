import { supabase } from "../config/database.js";

/* =====================================================
   CATEGORIES
===================================================== */
export const getCategories = async () => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("category_id", { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  } catch (err) {
    throw new Error(`getCategories failed: ${err.message}`);
  }
};

