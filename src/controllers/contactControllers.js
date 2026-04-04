// src/controllers/contactController.js
import { getAllContacts, insertContact } from "../models/contactModel.js";

/* ================= SHOW CONTACT FORM ================= */
const showContactform = (req, res) => {
  res.render("contact", {
    layout: "partials/layoute",
    title: "Contact – Romolayte",
    successMessage: req.query.success
      ? "Votre message a été envoyé avec succès 🎉"
      : null,
    errorMessage: req.query.error
      ? "Une erreur est survenue, veuillez réessayer."
      : null
  });
};

/* ================= SEND CONTACT ================= */
const sendContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.render("contact", {
        layout: "partials/layoute",
        title: "Contact – Romolayte",
        errorMessage: "Tous les champs sont obligatoires.",
        successMessage: null
      });
    }

    // Insertion dans la base
    await insertContact(name, email, message);

    // Redirection (bonne pratique)
    return res.redirect("/contact?success=true");

  } catch (error) {
    console.error("Erreur lors de l’insertion du contact:", error);

    return res.render("contact", {
      layout: "partials/layoute",
      title: "Contact – Romolayte",
      errorMessage: "Une erreur est survenue, veuillez réessayer.",
      successMessage: null
    });
  }
};

/* ================= DASHBOARD MESSAGES ================= */
const showMessageContact = async (req, res) => {
  try {
    const contacts = await getAllContacts();

    res.render("dashboard/messages", {
      layout: "dashboard-layout",
      title: "Messages reçus",
      contacts
    });

  } catch (error) {
    console.error("Erreur lors de la récupération des contacts:", error);
    res.status(500).send("Impossible de charger les messages.");
  }
};

export { showContactform, sendContact, showMessageContact };