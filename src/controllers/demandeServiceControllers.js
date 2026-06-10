import { supabase } from "../config/database.js";
import { insertDemandeService } from "../models/demandeServiceModel.js";
import { sendConfirmationEmail } from "../services/email.js";

/* =====================================================
   1. REVERSE GEOCODING (Détecter la ville via le serveur)
===================================================== */
const getCityFromCoordinates = async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ 
        success: false, 
        message: "Latitude et longitude requises." 
      });
    }

    // Appel sécurisé côté serveur pour éviter les blocages CORS du navigateur
    const response = await fetch(
      `https://openstreetmap.org{lat}&lon=${lon}&zoom=10&addressdetails=1`,
      {
        headers: {
          "Accept-Language": "fr",
          "User-Agent": "ServiceDeliveryApp/1.0 (contact@yourdomain.com)"
        }
      }
    );

    const data = await response.json();

    // Extraction de la ville selon la nomenclature OpenStreetMap
    const detectedCity =
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      data.address?.municipality ||
      "";

    return res.status(200).json({ 
      success: true, 
      city: detectedCity 
    });

  } catch (error) {
    console.error("❌ Erreur reverse geocoding backend :", error);
    return res.status(500).json({ 
      success: false, 
      message: "Erreur lors de la détection de la ville." 
    });
  }
};

/* =====================================================
   2. SUBMIT SERVICE REQUEST (API Rest)
===================================================== */
const submitServiceRequest = async (req, res) => {
  try {
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

    /* ================= VALIDATION ================= */

    if (!name || !email) {
      return res.status(400).json({ 
        success: false, 
        error: "missing_identity", 
        message: "Nom complet et adresse email obligatoires." 
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        error: "invalid_email", 
        message: "Format de l'adresse email invalide." 
      });
    }

    // Validation du numéro de téléphone pour la RDC (+243 ou 0)
    const phoneRegex = /^(\+243|0)[0-9]{9}$/;
    if (phone && !phoneRegex.test(phone.trim().replace(/\s+/g, ''))) {
      return res.status(400).json({ 
        success: false, 
        error: "invalid_phone", 
        message: "Numéro de téléphone congolais invalide (ex: +243XXXXXXXXX)." 
      });
    }

    if (!location || !String(location).includes(",")) {
      return res.status(400).json({ 
        success: false, 
        error: "missing_location", 
        message: "Coordonnées GPS obligatoires." 
      });
    }

    const safeCoordinates = String(location).trim();

    /* ================= CATEGORY ================= */

    const { data: category, error: catError } = await supabase
      .from("categories")
      .select("category_id")
      .eq("name", category_name)
      .single();

    if (catError || !category) {
      console.error("❌ Catégorie invalide :", catError);
      return res.status(422).json({ 
        success: false, 
        error: "invalid_category", 
        message: "La catégorie spécifiée n'existe pas." 
      });
    }

    /* ================= SERVICE ================= */

    const { data: service, error: serviceError } = await supabase
      .from("services")
      .select("service_id")
      .eq("name", service_name)
      .single();

    if (serviceError || !service) {
      console.error("❌ Service invalide :", serviceError);
      return res.status(422).json({ 
        success: false, 
        error: "invalid_service", 
        message: "Le service spécifié n'existe pas." 
      });
    }

    /* ================= DUPLICATE CHECK ================= */

    const { data: existing, error: duplicateError } = await supabase
      .from("demande_service")
      .select("demande_id")
      .eq("service_id", service.service_id)
      .eq("email", email)
      .maybeSingle();

    if (duplicateError) {
      console.error("❌ Erreur vérification doublon :", duplicateError);
    }

    if (existing) {
      return res.status(409).json({
        success: false,
        error: "already_requested",
        message: "Vous avez déjà soumis une demande pour ce service.",
        redirectUrl: `/services-details/${service.service_id}`
      });
    }

    /* ================= PRICE ================= */

    let finalPrice = null;
    if (price && price !== "Sur devis") {
      const cleanedPrice = String(price).replace(/[^\d.]/g, "");
      finalPrice = cleanedPrice ? Number(cleanedPrice) : null;
    }

    /* ================= INSERT DEMANDE ================= */

    const demande = await insertDemandeService({
      category_id: category.category_id,
      service_id: service.service_id,
      category_name,
      service_name,
      price: finalPrice,
      name,
      gender: gender || null,
      phone: phone || null,
      email,
      coordinates: safeCoordinates,
      location: city || null,
      status: "Reçus"
    });

    console.log("✅ Nouvelle demande :", demande.demande_id);

    /* ================= EMAIL CONFIRMATION ================= */

    try {
      await sendConfirmationEmail(demande);
      console.log("✅ Fonction email appelée");
    } catch (emailError) {
      console.error("❌ Erreur email :", emailError.message);
    }

    /* ================= SUCCESS ================= */

    return res.status(201).json({
      success: true,
      message: "Demande créée avec succès !",
      redirectUrl: `/demande-success/${demande.demande_id}`
    });

  } catch (error) {
    console.error("❌ Erreur submitServiceRequest :", error);
    return res.status(500).json({ 
      success: false, 
      error: "server_error", 
      message: "Une erreur interne du serveur est survenue." 
    });
  }
};

/* =====================================================
   3. GET SERVICE REQUEST DETAILS (Pour la page React Success)
===================================================== */
const showMessageSuccessPage = async (req, res) => {
  try {
    const { demandeId } = req.params;

    const { data: demande, error } = await supabase
      .from("demande_service")
      .select("*")
      .eq("demande_id", demandeId)
      .single();

    if (error || !demande) {
      console.error("❌ Demande introuvable :", error);
      return res.status(404).json({ 
        success: false, 
        error: "not_found", 
        message: "Demande introuvable." 
      });
    }

    return res.status(200).json({ 
      success: true, 
      demande 
    });

  } catch (error) {
    console.error("❌ Erreur success page :", error);
    return res.status(500).json({ 
      success: false, 
      error: "server_error" 
    });
  }
};

export {
  submitServiceRequest,
  showMessageSuccessPage,
  getCityFromCoordinates // Pensez à l'ajouter à vos routes : router.get("/api/get-city", getCityFromCoordinates);
};
