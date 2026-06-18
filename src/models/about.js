import { supabase } from "../config/database.js";

/* =====================================================
   ABOUT PAGES (Présentation entreprise)
===================================================== */
export const getAllAboutPages = async () => {
  try {
    const [
      aboutPages,
      teamMembers,
      companyValues,
      milestones,
      partners,
    ] = await Promise.all([
      supabase
        .from("about_pages")
        .select("*")
        .order("order_index", { ascending: true }),

      supabase
        .from("team_members")
        .select("*")
        .order("order_index", { ascending: true }),

      supabase
        .from("company_values")
        .select("*")
        .order("order_index", { ascending: true }),

      supabase
        .from("milestones")
        .select("*")
        .order("order_index", { ascending: true }),

      supabase
        .from("partners")
        .select("*")
        .order("order_index", { ascending: true }),
    ]);

    return {
      aboutPages: aboutPages?.data || [],
      teamMembers: teamMembers?.data || [],
      companyValues: companyValues?.data || [],
      milestones: milestones?.data || [],
      partners: partners?.data || [],
    };
  } catch (error) {
    console.error("❌ Error fetching about pages:", error.message);
    throw new Error("Failed to fetch about pages data");
  }
};
