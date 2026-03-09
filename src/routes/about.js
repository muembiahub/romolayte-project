import express from 'express';
import supabase from '../db/supabaseClient.js';
import { withDefaultImage, formatDate } from './helpers.js'; 

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Récupérer les sections principales
    const { data: aboutSections, error: aboutError } = await supabase
      .from('about_pages')
      .select('*')
      .order('order_index', { ascending: true });
    if (aboutError) throw aboutError;

    // Récupérer l’équipe
    const { data: team, error: teamError } = await supabase
      .from('team_members')
      .select('*')
      .order('order_index', { ascending: true });
    if (teamError) throw teamError;

    // Récupérer les valeurs
    const { data: values, error: valuesError } = await supabase
      .from('company_values')
      .select('*')
      .order('order_index', { ascending: true });
    if (valuesError) throw valuesError;

    // Récupérer les milestones
    const { data: milestones, error: milestonesError } = await supabase
      .from('milestones')
      .select('*')
      .order('order_index', { ascending: true });
    if (milestonesError) throw milestonesError;

    // Récupérer les partenaires
    const { data: partners, error: partnersError } = await supabase
      .from('partners')
      .select('*')
      .order('order_index', { ascending: true });
    if (partnersError) throw partnersError;

    // Rendre la vue EJS avec toutes les données + helpers + defaults
    res.render('about', {
      title: 'À propos de Romolayte',
      aboutSections,
      team,
      values,
      milestones,
      partners,
      withDefaultImage,
      formatDate,
      defaults: {
        avatar: 'https://ofhmwjzxakhgbafywxwp.supabase.co/storage/v1/object/public/defauts/avatars.webp',
        logo: 'https://ofhmwjzxakhgbafywxwp.supabase.co/storage/v1/object/public/logos_category/romolayte-logo.webp',
        icon: '/images/default-icon.webp',
        milestone: '/images/default-milestone.webp'
      }
    });

  } catch (err) {
    console.error('Erreur Supabase:', err.message);
    res.status(500).send('Erreur lors du chargement de la page About');
  }
});

export default router;
