
//  * Dashboard Controller * ====================/**
 import { findUserProfile } from "../../models/userModel.js";
 import { findDemandeRecus } from "../../models/userModel.js";

//  * ✅ Affiche la page dashboard
//  * ✅ Utilise les données stockées en session
//  * ❌ Ne gère PAS l'authentification
//  * ❌ Ne vérifie PAS l'accès (le middleware s'en charge)
//  */

const showDashboard = (req, res) => {
  res.render("dashboard", {
    title: "Dashboard",
    user: req.session.user
  });
};
//  pour afficher profile dans dashboard.===========
// =================================================

const ROLE_MAP = {
  1: "user",
  2: "prestataire",
  3: "admin",
  4: "super-admin"
};

const showProfilePage = async (req, res, next) => {
  try {
    const profile = await findUserProfile(req.session.user.uid);

    res.render("profile", {
      title: "Mon Profil",
      user: {
        ...profile,
        role: ROLE_MAP[profile.role_id],
        role_level: profile.role_id
      }
    });
  } catch (err) {
    next(err);
  }
};

const showDemandeRecusPage = async (req, res) => {
  try {
    // Récupération des demandes
    const demandes = await findDemandeRecus();

    // Définition du titre de la page
    const title = "Liste des demandes";

    // Rendu de la vue avec les données
    res.render("demande_recus", { 
      title, 
      demandes 
    });
  } catch (error) {
    console.error("Erreur dans showDemandeRecusPage:", error);

    // Rendu d'une page d'erreur 500 avec détails
    res.status(500).render("errors/500", { 
      title: "Erreur Serveur",
      error: "Impossible de charger les demandes.",
      stack: error.stack || "Vue",
      message: error.message || "Une erreur est survenue lors du chargement des demandes."
    });
  }
};



export { showDashboard, showProfilePage, showDemandeRecusPage };