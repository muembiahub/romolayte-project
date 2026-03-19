// src/views/controllers/aboutController.js
import { getAllAboutPages } from '../../models/about.js';
import { withDefaultImage, formatDate } from '../../models/helpers.js';

const defaults = {
  avatar: 'https://ofhmwjzxakhgbafywxwp.supabase.co/storage/v1/object/public/defauts/avatars.webp',
  logo: 'https://ofhmwjzxakhgbafywxwp.supabase.co/storage/v1/object/public/logos_category/romolayte-logo.webp',
  icon: '/images/default-icon.webp',
  milestone: '/images/default-milestone.webp'
};

const showAboutUsPage = async (req, res) => {
  try {
    const { aboutPages, teamMembers, companyValues, milestones, partners } = await getAllAboutPages();

    res.render('about', {
      title: 'À propos de nous',
      aboutSections: aboutPages,
      values: companyValues,
      team: teamMembers,
      milestones,
      partners,
      withDefaultImage,
      formatDate,
      defaults
    });
  } catch (err) {
    console.error('Error loading About Us page:', err);
    res.status(500).render('error', { message: 'Impossible de charger la page À propos.' });
  }
};

export { showAboutUsPage };
