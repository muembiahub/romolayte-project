import { getCategories } from "../models/categories.js";
import { getAllServices, getServiceById, getServicesByCategory } from "../models/services.js";
import { insertContact } from "../models/contactModel.js";
import { insertDemandeService } from "../models/demandeServiceModel.js";
import { supabase } from "../config/database.js";
import { sendConfirmationEmail } from "../services/email.js";

// Les fonctions simples profitent du try/catch pour le transfert sécurisé au asyncHandler de la route
const getPublicCategories = async (req, res, next) => {
  try {
    const categories = await getCategories();
    res.json({ success: true, categories });
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

const getServicesByCategoryApi = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const services = await getServicesByCategory(categoryId);
    res.json({ success: true, services });
  } catch (error) { next(error); }
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
const submitServiceRequestApi = async (req, res) => {
  try {
    console.log("📥 RECEIVED BODY PAYLOAD:", req.body);

    const {
      category_name,
      service_name,
      price,
      name,
      gender,
      phone,
      email,
      city,
      location
    } = req.body;

    const hasName = name && name.trim() !== "";
    const hasEmail = email && email.trim() !== "";
    const hasLocation = location && location.trim() !== "";
    const hasCategory = category_name && category_name.trim() !== "";
    const hasService = service_name && service_name.trim() !== "";

    if (!hasName || !hasEmail || !hasLocation || !hasCategory || !hasService) {
      return res.status(400).json({ 
        success: false, 
        error: "missing_fields", 
        message: `Champs requis manquants ou vides. Validations -> Nom: ${!!hasName}, Email: ${!!hasEmail}, Localisation (GPS): ${!!hasLocation}, Catégorie: ${!!hasCategory}, Service: ${!!hasService}` 
      });
    }

    const safeCoordinates = String(location).replace(/[\[\]]/g, "").trim();

    if (!safeCoordinates.includes(",")) {
      return res.status(400).json({ success: false, message: "Le format des coordonnées GPS doit être: latitude,longitude" });
    }

    /* ================= CATEGORY LOOKUP ================= */
    const { data: category, error: categoryError } = await supabase
      .from("categories")
      .select("category_id")
      .eq("name", category_name.trim())
      .single();

    if (categoryError || !category) {
      console.error("❌ Catégorie introuvable dans Supabase:", category_name);
      return res.status(400).json({ success: false, message: `La catégorie '${category_name}' n'existe pas dans le système.` });
    }

    /* ================= SERVICE LOOKUP ================= */
    const { data: service, error: serviceError } = await supabase
      .from("services")
      .select("service_id")
      .eq("name", service_name.trim())
      .single();

    if (serviceError || !service) {
      console.error("❌ Service introuvable dans Supabase:", service_name);
      return res.status(400).json({ success: false, message: `Le service '${service_name}' n'existe pas dans le système.` });
    }

    /* ================= DUPLICATE CHECK ================= */
    const { data: existing } = await supabase
      .from("demande_service")
      .select("demande_id")
      .eq("service_id", service.service_id)
      .eq("email", email.trim())
      .maybeSingle();

    if (existing) {
      return res.status(409).json({ 
        success: false, 
        error: "already_requested",
        message: "Vous avez déjà envoyé une demande active pour ce service.",
        redirectUrl: `/services-details/${service.service_id}`
      });
    }

    /* ================= PRICE PROCESSING ================= */
    const parsedPrice = price && price !== "Sur devis"
      ? Number(String(price).replace(/[^\d.]/g, ""))
      : null;

    /* ================= MODEL EXECUTION ================= */
    const demande = await insertDemandeService({
      category_id: category.category_id,
      service_id: service.service_id,
      category_name: category_name.trim(),
      service_name: service_name.trim(),
      price: parsedPrice,
      name: name.trim(),
      gender: gender || null,
      phone: phone ? phone.trim() : null,
      email: email.trim(),
      coordinates: safeCoordinates,
      location: city ? city.trim() : null,
      status: "Reçus"
    });

    try {
      await sendConfirmationEmail(demande);
    } catch (emailError) {
      console.error("❌ Notification email échec:", emailError.message);
    }

    return res.status(201).json({ 
      success: true, 
      demande,
      redirectUrl: `/demande-success/${demande.demande_id}`
    });

  } catch (error) {
    console.error("❌ Crashing failure inside submitServiceRequestApi:", error);
    return res.status(500).json({ success: false, message: `Erreur critique serveur: ${error.message || error}` });
  }
};

const getDashboardStats = async (req, res, next) => {
  try {
    const [{ count: usersCount }, { count: demandesCount }] = await Promise.all([
      supabase.from("user_profiles").select("*", { count: "exact", head: true }),
      supabase.from("demande_service").select("*", { count: "exact", head: true })
    ]);

    res.json({
      success: true,
      stats: {
        usersCount: usersCount || 0,
        demandesCount: demandesCount || 0
      }
    });
  } catch (error) { next(error); }
};

export {
  getPublicCategories,
  getPublicServices,
  getPublicServiceDetail,
  getServicesByCategoryApi,
  submitContactApi,
  submitServiceRequestApi,
  getCityFromCoordinates,
  getDashboardStats
};
