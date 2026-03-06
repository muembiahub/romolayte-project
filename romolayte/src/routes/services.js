import express from 'express';
import supabase from '../db/supabaseClient.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const categoryId = req.query.category; // récupère ?category=...
    
    // Sélection explicite des colonnes, y compris logo
    let query = supabase
      .from('services')
      .select('service_id, name, description, price, category_id, logo')
      .order('name', { ascending: true });

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data: services, error } = await query;

    if (error) {
      console.error("❌ Erreur récupération services:", error.message);
      return res.status(500).send('Erreur serveur');
    }

    // Rendu de la vue avec les services
    res.render('services', { title: 'Nos Services', services });
  } catch (err) {
    console.error("⚠️ Erreur route /services:", err.message);
    res.status(500).send('Erreur serveur');
  }
});




router.get('/details/:id', async (req, res) => {
  try {
    const serviceId = req.params.id;

    const { data: service, error } = await supabase
      .from('services')
      .select('service_id, name, description, price, category_id, logo')
      .eq('service_id', serviceId)
      .single();

    if (error || !service) {
      return res.status(404).send('Service non trouvé');
    }

    res.render('services-details', { title: service.name, service });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});



export default router;
