import { supabase } from "../config/database.js";

/* =====================================================
   DASHBOARD MODEL (DATA ACCESS ONLY)
===================================================== */

export const getDashboardStatsModel = async () => {
  const [
    { count: usersCount },
    { count: demandesCount },
    { count: categoriesCount },
    { count: servicesCount },
    { data: recentOrders }
  ] = await Promise.all([
    supabase
      .from("user_profiles")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("demande_service")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("categories")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("services")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("demande_service")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return {
    stats: {
      usersCount: usersCount || 0,
      demandesCount: demandesCount || 0,
      categoriesCount: categoriesCount || 0,
      servicesCount: servicesCount || 0,
    },
    recentOrders: recentOrders || [],
  };
};
export const getAllOrdersModel = async () => {
  const { data, error } = await supabase
    .from("demande_service")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data || [];
};