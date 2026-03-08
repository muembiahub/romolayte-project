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

    // Récupérer le service demandé
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('service_id, name, description, price, category_id, logo')
      .eq('service_id', serviceId)
      .single();

    if (serviceError || !service) {
      return res.status(404).send('Service non trouvé');
    }

    // Récupérer les services liés (même catégorie, max 10, exclure le service courant)
    const { data: relatedServices, error: relatedError } = await supabase
      .from('services')
      .select('service_id, name, price, logo')
      .eq('category_id', service.category_id)
      .neq('service_id', serviceId)
      .limit(10);

    if (relatedError) {
      console.error("❌ Erreur récupération services liés:", relatedError.message);
    }

    // Rendu de la vue avec le service + services liés
    res.render('services-details', { 
      title: service.name, 
      service, 
      relatedServices
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});



export default router;
