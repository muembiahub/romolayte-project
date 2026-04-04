// src/controllers/serviceRequestController.js
import { supabase } from "../config/database.js";
import { insertDemandeService } from "../models/demandeServiceModel.js";
import { sendConfirmationEmail } from "../utils/emailService.js";

/* =====================================================
   SUBMIT SERVICE REQUEST
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
      location // ✅ GPS obligatoire (lat, lon)
    } = req.body;

    /* ================= VALIDATION ================= */

    if (!name || !email) {
      return res.redirect("/services?error=missing_identity");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.redirect("/services?error=invalid_email");
    }

    // ✅ GPS obligatoire (lat, lon)
    if (!location || !String(location).includes(",")) {
      return res.redirect("/services?error=missing_location");
    }
    const safeCoordinates = String(location).trim();

    /* ================= CATÉGORIE ================= */
    const { data: category, error: catError } = await supabase
      .from("categories")
      .select("category_id")
      .eq("name", category_name)
      .single();

    if (catError || !category) {
      return res.redirect("/services?error=invalid_category");
    }

    /* ================= SERVICE ================= */
    const { data: service, error: serviceError } = await supabase
      .from("services")
      .select("service_id")
      .eq("name", service_name)
      .single();

    if (serviceError || !service) {
      return res.redirect("/services?error=invalid_service");
    }

    /* ================= DOUBLON ================= */
    const { data: existing } = await supabase
      .from("demande_service")
      .select("demande_id")
      .eq("service_id", service.service_id)
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      return res.redirect(
        `/services-details/${service.service_id}?error=already_requested`
      );
    }

    /* ================= PRIX ================= */
    let finalPrice = null;
    if (price && price !== "Sur devis") {
      const cleanedPrice = String(price).replace(/[^\d.]/g, "");
      finalPrice = cleanedPrice ? Number(cleanedPrice) : null;
    }

  const demande = await insertDemandeService({
  category_id: category.category_id,
  service_id: service.service_id,
  category_name,
  service_name,
  price: finalPrice,
  name,
  gender,
  phone,
  email,
  coordinates: safeCoordinates,   // ✅ GPS vérité terrain
  location: city || null,         // ✅ dérivé du GPS
  status: "Reçus"
});

/* ✅ ENVOI EMAIL CONFIRMATION CLIENT (NON BLOQUANT) */
sendConfirmationEmail(demande).catch(err => {
  console.error("❌ Erreur envoi email confirmation :", err.message);
});

/* ================= REDIRECTION ================= */
return res.redirect(`/demande-success/${demande.demande_id}`);


  } catch (error) {
    console.error("❌ Demande service:", error);
    return res.redirect("/services?error=server_error");
  }
};

/* =====================================================
   SUCCESS PAGE (RÉCAPITULATIF)
===================================================== */
const showMessageSuccessPage = async (req, res) => {
  const { demandeId } = req.params;

  const { data: demande, error } = await supabase
    .from("demande_service")
    .select("*")
    .eq("demande_id", demandeId)
    .single();

  if (error || !demande) {
    return res.redirect("/services?error=not_found");
  }

  res.render("demande-success", {
    layout: "partials/layoute",
    title: "Demande envoyée",
    demande
  });
};

export {
  submitServiceRequest,
  showMessageSuccessPage
};
