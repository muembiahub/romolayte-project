// src/models/contactModel.js
import { supabase } from "../config/database.js";

/**
 * Récupère tous les messages de contact
 */
const getAllContacts = async () => {
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * Insère un nouveau message de contact
 */
const insertContact = async (name, email, message) => {
  const { data, error } = await supabase
    .from("contact_messages")
    .insert([
      {
        name,
        email,
        message,
        status: "non_lu",
      },
    ])
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data[0];
};



/**
 * Met à jour le statut d’un message
 */
const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const { error } = await supabase
      .from("contact_messages")
      .update({ status })
      .eq("id", id);

    if (error) throw new Error(error.message);

    res.redirect("/dashboard/messages");
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error);
    res.redirect("/admin/contacts?error=1");
  }
};

/**
 * Supprime un message
 */
const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);

    res.redirect("/dashboard/messages");
  } catch (error) {
    console.error("Erreur lors de la suppression du message:", error);
    res.redirect("/dashboard/messages?error=1");
  }
};



export { getAllContacts, insertContact,updateContactStatus, deleteContact  };
