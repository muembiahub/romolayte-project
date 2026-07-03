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


// ===================================================== */
//  Service table 
//  ===================================================== */


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
export const updateServiceById = async (
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
export const deleteServiceById = async (
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

export const ProfileByUserId = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("uid", userId)
      .maybeSingle();

    if (error) throw error;

    return data;

  } catch (err) {
    throw new Error(
      `getProfileByUserId failed: ${err.message}`
    );
  }
};

export const allProfiles = async () => {
  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*");

    if (error) throw error;

    return data;

  } catch (err) {
    throw new Error(
      `allProfiles failed: ${err.message}`
    );
  }
};
export const updateProfileById = async (
  id,
  updates
) => {
  try {
    const { data, error } =
      await supabase
        .from("user_profiles")
        .update(updates)
        .eq(
          "profile_id",
          id
        )
        .select()
        .maybeSingle();

    if (error) throw error;

    return data;

  } catch (err) {
    throw new Error(
      `updateProfile failed: ${err.message}`
    );
  }
};
export const deleteProfileById = async (
  id
) => {
  try {
    const { error } =
      await supabase
        .from("user_profiles")
        .delete()
        .eq(
          "profile_id",
          id
        );

    if (error) throw error;

    return {
      success: true,
      message:


        "Profil utilisateur supprimé avec succès.",
    };

  } catch (err) {
    throw new Error(
      `deleteProfile failed: ${err.message}`
    );
  }
};


// ==================================================== */
//  Message de contact table
// ==================================================== */

export const getAllMessageContact = async () => {
  try {
    const { data, error } = await supabase
      .from("message_contact")
      .select("*");

    if (error) throw error;

    return data;

  } catch (err) {
    throw new Error(
      `getAllMessageContact failed: ${err.message}`
    );
  }
};

export const updateStatusMessageContactById = async (
  id,
  updates
) => {
  try {
    const { data, error } =
      await supabase
        .from("message_contact")
        .update(updates)
        .eq(
          "message_id",
          id
        )
        .select()
        .maybeSingle();

    if (error) throw error;

    return data;

  } catch (err) {
    throw new Error(
      `updateStatusMessageContactById failed: ${err.message}`
    );
  }
};

export const deleteMessageContactById = async (
  id
) => {
  try {
    const { error } = await supabase
      .from("message_contact")
      .delete()
      .eq("message_id", id);

    if (error) throw error;

    return {
      success: true,
      message: "Message de contact supprimé avec succès.",
    };

  } catch (err) {
    throw new Error(
      `deleteMessageContactById failed: ${err.message}`
    );
  }
};
// ==================================================== */