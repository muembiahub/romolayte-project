import express from "express";
import { createClient } from "@supabase/supabase-js"; // ✅ import correct

const router = express.Router();

// Initialise Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// GET : afficher formulaire
router.get("/", (req, res) => {
  let { category_id, service_id, price } = req.query;
  if (!price || price === "null") price = "Sur devis";

  res.render("contact", {
    title: "Demande de service",
    category_id,
    service_id,
    price,
  });
});

// POST : traiter formulaire
router.post("/", async (req, res) => {
  try {
    const {
      category_id,
      service_id,
      price,
      name,
      email,
      coordinates,
      location,
      phone,
      gender,
      other_info,
    } = req.body;

    if (!category_id || !service_id) {
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

    const { error } = await supabase.from("demandes_services").insert([
      {
        category_id,
        service_id,
        price: finalPrice ?? "Sur devis",
        name,
        email,
        coordinates,
        location,
        phone,
        gender,
        other_info,
      },
    ]);

    if (error) {
      console.error("❌ Erreur insertion:", error.message);
      return res.status(500).send("Erreur serveur lors de l'insertion.");
    }

    res.render("contact-success", {
      title: "Demande envoyée",
      category_id,
      service_id,
      price: finalPrice ?? "Sur devis",
      name,
      email,
      coordinates,
      location,
      phone,
      gender,
      other_info,
    });
  } catch (err) {
    console.error("❌ Erreur route /contact:", err.message);
    res.status(500).send("Erreur serveur.");
  }
});

export default router;
