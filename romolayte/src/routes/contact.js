import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

// ⚠️ Initialise ton client Supabase avec tes variables d'environnement
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Route GET pour afficher le formulaire
router.get('/contact', (req, res) => {
  let { category_id, service_id, price } = req.query;

  if (!price || price === 'null') {
    price = 'Sur devis';
  }

  res.render('contact', { 
    title: 'Demande de service',
    category_id,
    service_id,
    price
  });
});

// Route POST pour traiter le formulaire
router.post('/contact', async (req, res) => {
  try {
    console.log("📩 Données reçues:", req.body);

    // ✅ Récupération des données du formulaire
    let { category_id, service_id, price, name, email, coordinates, location, phone, gender, other_info } = req.body;

    // ✅ Validation basique
    if (!category_id || !service_id) {
      return res.status(400).send("Catégorie et service sont obligatoires.");
    }

    if (!name || !email) {
      return res.status(400).send("Nom et email sont obligatoires.");
    }

    // Vérifier email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send("Email invalide.");
    }

    // Vérifier prix
    if (price && price !== "Sur devis") {
      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        return res.status(400).send("Prix invalide.");
      }
      price = parsedPrice;
    }

    // ✅ Insertion dans Supabase
    const { error } = await supabase
      .from('demandes_services')
      .insert([{ category_id, service_id, price, name, email, coordinates, location, phone, gender, other_info }]);

    if (error) {
      console.error("❌ Erreur insertion demande:", error.message);
      return res.status(500).send("Erreur serveur lors de l'insertion.");
    }

    // ✅ Page de confirmation
    res.render('contact-success', { 
      title: 'Demande envoyée',
      category_id,
      service_id,
      price,
      name,
      email,
      coordinates,
      location,
      phone,
      gender,
      other_info
    });

  } catch (err) {
    console.error("❌ Erreur route /contact:", err.message);
    res.status(500).send("Erreur serveur.");
  }
});

export default router;
