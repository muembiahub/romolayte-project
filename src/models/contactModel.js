import { supabase } from "../config/database.js";

/* =====================================================
   CONTACT MESSAGES CRUD
===================================================== */

// 🔹 Récupérer tous les messages
export const getAllContacts = async () => {
  try {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  } catch (err) {
    throw new Error(`getAllContacts failed: ${err.message}`);
  }
};

// 🔹 Insérer un nouveau message
export const insertContactmessage = async (name, email, message) => {
  try {
    const { data, error } = await supabase
      .from("contact_messages")
      .insert([{ name, email, message, status: "non_lu" }])
      .select()
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  } catch (err) {
    throw new Error(`insertContact failed: ${err.message}`);
  }
};

// 🔹 Mettre à jour le statut d’un message
export const updateContactStatus = async (id, status) => {
  try {
    const { data, error } = await supabase
      .from("contact_messages")
      .update({ status })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  } catch (err) {
    throw new Error(`updateContactStatus failed: ${err.message}`);
  }
};

// 🔹 Supprimer un message
export const deleteContact = async (id) => {
  try {
    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
    return { success: true, message: "Message supprimé avec succès." };
  } catch (err) {
    throw new Error(`deleteContact failed: ${err.message}`);
  }
};
