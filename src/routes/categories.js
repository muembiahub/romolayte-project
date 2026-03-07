import express from 'express';
import supabase from '../db/supabaseClient.js';

const router = express.Router();

router.get('/', async (req, res) => {
  // Requête Supabase correcte
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    return res.status(500).send(error.message);
  }

  res.render('categories', { 
    title: 'Liste des catégories',
    categories: data 
  });
});

export default router;
