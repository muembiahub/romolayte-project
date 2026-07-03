
import { supabase } from "../config/database.js";

import { getCategories } from "../models/categories.js";
import {
  getAllServices,
  getServiceById,
  getServicesByCategory,
} from "../models/services.js";
import { insertDemandeService } from "../models/demandeServiceModel.js";
import { getAllAboutPages } from "../models/about.js";

import {
  insertContactmessage,
} from "../models/contactModel.js";

import { sendConfirmationEmail } from "../authomationServices/sendConfirmationEmail.js";

/* =====================================================
   CATEGORIES & SERVICES
===================================================== */
export const getPublicCategories = async (req, res, next) => {
  try {
    const categories = await getCategories();
    res.json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};

export const getPublicServicesByCategoryId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const services = await getServicesByCategory(id);
    res.json({ success: true, services });
  } catch (error) {
    next(error);
  }
};

export const getPublicServices = async (req, res, next) => {
  try {
    const services = await getAllServices();
    res.json({ success: true, services });
  } catch (error) {
    next(error);
  }
};

export const getPublicServiceDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const service = await getServiceById(id);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service introuvable." });
    }
    res.json({ success: true, service });
  } catch (error) {
    next(error);
  }
};


/* =====================================================
   CONTACT
===================================================== */
export const submitContactMessage = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "Tous les champs sont obligatoires." });
    }

    const contact = await insertContact(name, email, message);
    res.status(201).json({ success: true, contact });
  } catch (error) {
    next(error);
  }
};




/* =====================================================
   CONTROLLER : DEMANDE DE SERVICE
===================================================== */
export const submitDemandeService = async (req, res) => {
  try {
    const {
      service_id,
      name,
      email,
      phone,
      coordinates,
      location,
      gender,
      other_info
    } = req.body;

    if (
      !service_id ||
      !name ||
      !email ||
      !phone ||
      !coordinates ||
      !location ||
      !gender
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Tous les champs obligatoires doivent être remplis."
      });
    }

    const service =
      await getServiceById(service_id);

    if (!service) {
      return res.status(404).json({
        success:false,
        message:"Service introuvable"
      });
    }

    const payload = {
      category_id:
        service.category_id,

      service_id:
        service.service_id ?? service.id,

      category_name:
        service.categories?.name ??
        service.category_name ??
        null,

      service_name:
        service.name,

      price:
        service.price,

      name,
      email,
      phone,
      coordinates,
      location,
      gender,
      other_info,

      status:"pending"
    };

    const demande =
      await insertDemandeService(
        payload
      );

    // Réponse immédiate au client
    res.status(201).json({
  success: true,
  message: "Demande envoyée avec succès",
  demande
});

// Exécute après la réponse sans bloquer
setImmediate(async () => {
  try {

    console.log(
      "📨 Envoi email:",
      payload.email
    );

    await sendConfirmationEmail({
      email: payload.email,
      name: payload.name,
      service_name: payload.service_name,
      location: payload.location,
      status: payload.status
    });

    console.log(
      "✅ Email envoyé"
    );

  } catch (error) {

    console.error(
      "❌ Erreur email:",
      error
    );

  }
});
  } catch(error){

    console.error(
      "❌ Erreur insertion :",
      error
    );

    if (
      error.code==="23505" &&
      error.message.includes(
        "unique_service_per_user"
      )
    ){
      return res.status(409).json({
        success:false,
        message:
        "Vous avez déjà envoyé une demande pour ce service avec cet email."
      });
    }

    return res.status(500).json({
      success:false,
      message:
      "Erreur serveur. Impossible de traiter la demande."
    });
  }
};



/* =====================================================
   ABOUT PAGES
===================================================== */
export const getaboutpages = async (req, res) => {
  try {
    const about = await getAllAboutPages();
    res.status(200).json({ success: true, data: about });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};






export const createContact = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    const contact = await insertContactmessage(name, email, message);
    res.status(201).json({ success: true, contact });
  } catch (error) {
    next(error);
  }
};
