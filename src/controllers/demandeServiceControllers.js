// controllers/contactController.js
import { supabase } from "../config/database.js";
import { insertDemandeService } from "../models/demandeServiceModel.js";

const showForm = async (req, res) => {
  try {
    const category_name = decodeURIComponent(req.query.category_name || "");
    const service_name = decodeURIComponent(req.query.service_name || "");
    const price = req.query.price || "Sur devis";

    res.render("demandeService", {
      layout: false,
      title: "Demande de service",
      category_name,
      service_name,
      price
    });
  } catch (error) {
    console.error("❌ Error in showForm:", error.message);
    res.status(500).render("errors", {
      layout: false,
      title: "Erreur Serveur",
      message: "Impossible de charger le formulaire"
    });
  }
};


const submitForm = async (req, res) => {
  try {
    const {
      category_name,
      service_name,
      price,
      name,
      email,
      coordinates,
      location,
      phone,
      gender,
      other_info,
    } = req.body;

    // 🔹 Validations
    if (!category_name || !service_name) {
      return res.status(400).send("Catégorie et service obligatoires.");
    }
    if (!name || !email) {
      return res.status(400).send("Nom et email obligatoires.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send("Email invalide.");
    }

    let finalPrice = price === "Sur devis" ? null : parseFloat(price);
    if (finalPrice !== null && (isNaN(finalPrice) || finalPrice < 0)) {
      return res.status(400).send("Prix invalide.");
    }

    // 🔹 Chercher l'ID de la catégorie
    const { data: categoryData, error: catError } = await supabase
      .from("categories")
      .select("category_id")
      .eq("name", category_name)
      .single();

    if (catError || !categoryData) {
      return res.status(400).send("Catégorie invalide.");
    }
    const category_id = categoryData.category_id;

    // 🔹 Chercher l'ID du service
    const { data: serviceData, error: servError } = await supabase
      .from("services")
      .select("service_id")
      .eq("name", service_name)
      .single();

    if (servError || !serviceData) {
      return res.status(400).send("Service invalide.");
    }
    const service_id = serviceData.service_id;

    // 🔹 Vérifier si ce service a déjà été demandé par cet email
    const { data: existing, error: checkError } = await supabase
      .from("demande_service")
      .select("demande_id")
      .eq("service_id", service_id)
      .eq("email", email)
      .maybeSingle();

    if (checkError) {
      console.error("❌ Erreur vérification:", checkError.message);
      return res.status(500).send("Erreur serveur lors de la vérification.");
    }

    if (existing) {
      return res.status(409).send(`
        <html>
          <head>
            <title>Demande déjà effectuée</title>
            <style>
              body { font-family: Arial, sans-serif; background:#f9f9f9; text-align:center; padding:50px; }
              .error-box { background:#fff; border:1px solid #ccc; padding:20px; border-radius:8px; display:inline-block; }
              h1 { color:#d9534f; }
              .service-name { color:#007bff; font-weight:bold; text-transform:uppercase; }
              .email { color:#28a745; font-style:italic; }
              a { display:inline-block; margin-top:15px; text-decoration:none; color:#007bff; }
              a:hover { text-decoration:underline; }
            </style>
          </head>
          <body>
            <div class="error-box">
              <h1>Demande déjà effectuée</h1>
              <p>
                Vous avez déjà demandé ce service: 
                <span class="service-name">${service_name}</span>. 
                Il n'est pas possible de le demander à nouveau avec le même email: 
                <span class="email">${email}</span>.
              </p>
              <a href="/services-details/${service_id}">← Retour aux détails du service</a>
            </div>
          </body>
        </html>
      `);
    }

    // 🔹 Insertion
    const { error } = await insertDemandeService({
      category_id,
      category_name,
      service_id,
      service_name,
      price: finalPrice,
      name,
      email,
      coordinates,
      location,
      phone,
      gender,
      other_info,
    });

    if (error) {
      console.error("❌ Erreur insertion:", error.message);
      return res.status(500).send("Erreur serveur lors de l'insertion.");
    }

    // 🔹 Préparer les valeurs avec fallback + flags pour styling
    const defaults = {
      category_name: category_name || "Catégorie non spécifiée",
      service_name: service_name || "Service non spécifié",
      price: finalPrice !== null ? finalPrice : "Sur devis",
      name: name || "Nom non fourni",
      email: email || "Email non fourni",
      coordinates: coordinates || "Coordonnées non fournies",
      location: location || "Localisation non précisée",
      phone: phone || "Téléphone non fourni",
      gender: gender || "Genre non précisé",
      other_info: other_info || "Pas d'informations supplémentaires fournies",
      isDefault: {
        category_name: !category_name,
        service_name: !service_name,
        price: !price,
        name: !name,
        email: !email,
        coordinates: !coordinates,
        location: !location,
        phone: !phone,
        gender: !gender,
        other_info: !other_info,
      }
    };

    // 🔹 Page de succès
    res.render("demande-service-success", {
      layout: false,
      title: "Demande envoyée",
      ...defaults
    });
  } catch (err) {
    console.error("❌ Erreur route /demande-service:", err.message);
    res.status(500).send("Erreur serveur.");
  }
};

export { showForm, submitForm };
