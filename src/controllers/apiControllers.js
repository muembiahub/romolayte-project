import { getCategories ,} from "../models/categories.js";
import { getAllServices, getServiceById, getServicesByCategory, addServiceByCategory} from "../models/services.js";
import { insertContact } from "../models/contactModel.js";
import { insertDemandeService } from "../models/demandeServiceModel.js";

import { supabase } from "../config/database.js";
import { sendConfirmationEmail } from "../services/email.js";

import { getAllAboutPages } from "../models/about.js";



// Les fonctions simples profitent du try/catch pour le transfert sécurisé au asyncHandler de la route
const getPublicCategories = async (req, res, next) => {
  try {
    const categories = await getCategories();
    res.json({ success: true, categories });
  } catch (error) { next(error); }
};

const getPublicServicesByCategoryId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const services = await getServicesByCategory(id);
    res.json({ success: true, services });
  } catch (error) { next(error); }
};

const getPublicServices = async (req, res, next) => {
  try {
    const services = await getAllServices();
    res.json({ success: true, services });
  } catch (error) { next(error); }
};



const getPublicServiceDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const service = await getServiceById(id);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service introuvable." });
    }
    res.json({ success: true, service });
  } catch (error) { next(error); }
};


// 
const createService = async (req, res) => {
  try {
    const {
      category_id,
      name,
      description,
      price,
      logo,
    } = req.body;

    const service =
      await addServiceByCategory(
        category_id,
        name,
        description,
        price,
        logo
      );

    res.status(201).json({
      success: true,
      service,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const submitContactApi = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "Tous les champs sont obligatoires." });
    }

    const contact = await insertContact(name, email, message);
    res.status(201).json({ success: true, contact });
  } catch (error) { next(error); }
};

/* =====================================================
   REVERSE GEOCODING (CORRIGÉ & VALIDE)
===================================================== */
const getCityFromCoordinates = async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ success: false, message: "Latitude et longitude requises." });
    }

    // CORRECTION : URL officielle Nominatim avec formats & variables configurés
    const response = await fetch(
      `https://openstreetmap.org{lat}&lon=${lon}&format=json&zoom=12&addressdetails=1`,
      {
        headers: {
          "Accept-Language": "fr",
          "User-Agent": "RomolayteProject/2.0 (contact@yourdomain.com)"
        }
      }
    );

    if (!response.ok) {
      throw new Error(`API OpenStreetMap a répondu avec le statut ${response.status}`);
    }

    const data = await response.json();

    const detectedCity =
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      data.address?.municipality ||
      data.address?.county ||
      data.address?.state_district ||
      data.address?.suburb ||
      "";

    return res.status(200).json({ success: true, city: detectedCity.trim() });

  } catch (error) {
    console.error("❌ Erreur reverse geocoding backend :", error);
    return res.status(500).json({ success: false, message: "Erreur lors de la détection de la ville." });
  }
};

/* =====================================================
   SUBMIT SERVICE REQUEST API
===================================================== */

export const createDemandeService = async (req, res) => {
  try {
    const {
      service_id,
      customer_name,
      email,
      phone,
      description,
    } = req.body;

    if (
      !service_id ||
      !customer_name ||
      !email ||
      !phone ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs sont obligatoires.",
      });
    }

    const demande = await insertDemandeService({
      service_id,
      customer_name,
      email,
      phone,
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Demande envoyée avec succès.",
      demande,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Erreur serveur.",
    });
  }
};

const getDashboardStats = async (req, res, next) => {
  try {
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
        .limit(5)
    ]);

    res.json({
      success: true,
      stats: {
        usersCount: usersCount || 0,
        demandesCount: demandesCount || 0,
        categoriesCount: categoriesCount || 0,
        servicesCount: servicesCount || 0,
      },
      recentOrders: recentOrders || [],
    });
  } catch (error) {
    next(error);
  }
};




const PostOrderService = {
  getorder: async (req, res) => {
    try {
      const order = await insertDemandeService();
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
}

 const getaboutpages = async (req, res) => {
  try {
    const about = await getAllAboutPages();

    res.status(200).json({
      success: true,
      data: about,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export {
  getPublicCategories,
  getPublicServicesByCategoryId,
  getPublicServices,
  getPublicServiceDetail,
  createService,
  submitContactApi,
  getCityFromCoordinates,
  getDashboardStats,
  PostOrderService,
  getaboutpages
};
