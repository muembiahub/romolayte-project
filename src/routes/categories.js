import express from 'express';
import supabase from '../db/supabaseClient.js';

const router = express.Router();

// ✅ Liste des catégories (id + nom)
router.get('/', async (req, res) => {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('category_id, name')
      .order('name', { ascending: true });

    if (error) {
      console.error("❌ Erreur récupération catégories:", error.message);
      return res.status(500).send('Erreur serveur');
    }

    res.render('categories', { 
      title: 'Liste des catégories',
      categories
    });
  } catch (err) {
    console.error("⚠️ Erreur route /categories:", err.message);
    res.status(500).send('Erreur serveur');
  }
});

// ✅ Redirection vers services filtrés par catégorie
router.get('/:id', (req, res) => {
  const categoryId = req.params.id;
  // 👉 au lieu de rendre une vue "category-details",
  // on redirige directement vers la page services avec un filtre
  res.redirect(`/services?category=${categoryId}`);
});

export default router;
