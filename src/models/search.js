import express from 'express';
import {supabase }from '../config/database.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();

    if (!q) {
      return res.json({ success: true, services: [], categories: [] });
    }

    // Exécuter les deux recherches en parallèle
    const [servicesResult, categoriesResult] = await Promise.all([
      supabase
        .from('services')
        .select('service_id, name')
        .ilike('name', `%${q}%`)
        .limit(5),

      supabase
        .from('categories')
        .select('category_id, name')
        .ilike('name', `%${q}%`)
        .limit(5),
    ]);

    // Vérifier erreurs
    if (servicesResult.error || categoriesResult.error) {
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la recherche',
        errors: {
          services: servicesResult.error?.message,
          categories: categoriesResult.error?.message,
        },
      });
    }

    res.json({
      success: true,
      services: servicesResult.data || [],
      categories: categoriesResult.data || [],
    });
  } catch (err) {
    console.error('Erreur API recherche:', err);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur',
    });
  }
});

export default router;
