// src/controllers/serviceRequestController.js

import { supabase } from "../config/database.js";
import { insertDemandeService } from "../models/demandeServiceModel.js";
import { sendConfirmationEmail }
from "../services/email.js";

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
      location
    } = req.body;

    /* ================= VALIDATION ================= */

    // identité obligatoire
    if (!name || !email) {
      return res.redirect("/services?error=missing_identity");
    }

    // validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.redirect("/services?error=invalid_email");
    }

    // GPS obligatoire
    if (!location || !String(location).includes(",")) {
      return res.redirect("/services?error=missing_location");
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

      return res.redirect("/services?error=invalid_category");
    }

    /* ================= SERVICE ================= */

    const { data: service, error: serviceError } = await supabase
      .from("services")
      .select("service_id")
      .eq("name", service_name)
      .single();

    if (serviceError || !service) {

      console.error("❌ Service invalide :", serviceError);

      return res.redirect("/services?error=invalid_service");
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

      return res.redirect(
        `/services-details/${service.service_id}?error=already_requested`
      );
    }

    /* ================= PRICE ================= */

    let finalPrice = null;

    if (price && price !== "Sur devis") {

      const cleanedPrice = String(price)
        .replace(/[^\d.]/g, "");

      finalPrice = cleanedPrice
        ? Number(cleanedPrice)
        : null;
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

  console.log(
    "✅ Fonction email appelée"
  );

} catch (emailError) {

  console.error(
    "❌ Erreur email :",
    emailError.message
  );
}

/* ================= SUCCESS ================= */

return res.redirect(
  `/demande-success/${demande.demande_id}`
);

} catch (error) {

  console.error(
    "❌ Erreur submitServiceRequest :",
    error
  );

  return res.redirect(
    "/services?error=server_error"
  );
}
};

/* =====================================================
   SUCCESS PAGE
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

      return res.redirect("/services?error=not_found");
    }

    return res.render("demande-success", {

      layout: "partials/layoute",

      title: "Demande envoyée",

      demande
    });

  } catch (error) {

    console.error("❌ Erreur success page :", error);

    return res.redirect("/services?error=server_error");
  }
};

export {
  submitServiceRequest,
  showMessageSuccessPage
};