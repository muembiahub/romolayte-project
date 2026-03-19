import express from 'express';
import supabase from '../db/supabaseClient.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const q = req.query.q || '';

  // Recherche dans services
  const { data: services } = await supabase
    .from('services')
    .select('service_id, name')
    .ilike('name', `%${q}%`)
    .limit(5);

  // Recherche dans catégories
  const { data: categories } = await supabase
    .from('categories')
    .select('category_id, name')
    .ilike('name', `%${q}%`)
    .limit(5);

  res.json({ services, categories });
});

export default router;
