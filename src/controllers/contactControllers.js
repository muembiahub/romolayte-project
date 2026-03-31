// src/controllers/contactController.js
import { getAllContacts, insertContact } from "../models/contactModel.js";

const showContactform = (req, res) => {
  res.render("contact", {
    layout: false,
    successMessage: req.query.success 
      ? "Votre message a été envoyé avec succès 🎉" 
      : null,
    errorMessage: req.query.error 
      ? "Une erreur est survenue, veuillez réessayer." 
      : null
  });
};


const sendContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation des champs
    if (!name || !email || !message) {
      return res.render("contact", { 
        layout: false,
        errorMessage: "Tous les champs sont obligatoires.", 
        successMessage: null 
      });
    }

    // Insertion dans la base (Supabase)
    await insertContact(name, email, message);

    // Message de succès
    return res.render("contact", { 
      layout: false,
      successMessage: "Votre message a été envoyé avec succès 🎉", 
      errorMessage: null 
    });

  } catch (error) {
    console.error("Erreur lors de l’insertion du contact:", error);

    // Message d'erreur
    return res.render("contact", {
      layout: false, 
      errorMessage: "Une erreur est survenue, veuillez réessayer.", 
      successMessage: null 
    });
  }
};




const showMessageContact = async (req, res) => {
  try {
    const contacts = await getAllContacts();
    res.render("dashboard/messages", {
     title: "Messages reçus",
     contacts
});

  } catch (error) {
    console.error("Erreur lors de la récupération des contacts:", error);
    res.status(500).send("Impossible de charger les messages.");
  }
};

export {showContactform,sendContact, showMessageContact };