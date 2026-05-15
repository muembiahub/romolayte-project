import ejs from "ejs";
import path from "path";
import { supabase } from "../config/database.js";
import { findUserProfile, findDemandeRecus, GetAllUserProfile } from "../models/userModel.js";

const ROLE_MAP = {
  1: "user",
  2: "prestataire",
  3: "admin",
  4: "super-admin"
};

// Injection dynamique du chemin des vues
const getViewPath = (viewName) => path.join(process.cwd(), "src/views", viewName);

/* ==========================================================================
   PAGE D'ACCUEIL DU DASHBOARD (STATISTIQUES RAPIDES)
   ========================================================================== */
const showDashboard = async (req, res, next) => {
  try {
    if (!req.session?.user) {
      return res.redirect("/auth");
    }

    const userUid = req.session.user.uid;

    // Exécution des requêtes de comptage et de profil en parallèle (Gain de performance majeur)
    const [usersRes, totalDemandesRes, userProfileRes] = await Promise.all([
      supabase.from("user_profiles").select("*", { count: "exact", head: true }),
      supabase.from("demande_service").select("*", { count: "exact", head: true }),
      supabase.from("user_profiles").select("*").eq("uid", userUid).maybeSingle()
    ]);

    if (usersRes.error) throw usersRes.error;
    if (totalDemandesRes.error) throw totalDemandesRes.error;
    if (userProfileRes.error) throw userProfileRes.error;

    // Rendu du composant interne de la page d'accueil
    const body = await ejs.renderFile(
      getViewPath("dashboard/dashboard-home.ejs"),
      {
        user: req.session.user,
        user_profiles: userProfileRes.data,
        stats: {
          usersCount: usersRes.count || 0,
          missionsCount: totalDemandesRes.count || 0, // Ajustez le filtre selon votre logique métier mission
          demandesCount: totalDemandesRes.count || 0
        }
      }
    );

    return res.render("dashboard/dashboard-layout", {
      title: "Tableau de bord",
      user: req.session.user,
      body
    });

  } catch (err) {
    console.error("[Dashboard Home Error]:", err);
    return next(err);
  }
};

/* ==========================================================================
   PROFIL UTILISATEUR CONNECTÉ
   ========================================================================== */
const showProfilePage = async (req, res, next) => {
  try {
    if (!req.session?.user) return res.redirect("/auth");

    const profile = await findUserProfile(req.session.user.uid);
    if (!profile) {
      const err = new Error("Votre profil est introuvable en base de données.");
      err.status = 404;
      return next(err);
    }

    const body = await ejs.renderFile(
      getViewPath("dashboard/profile.ejs"),
      { user: { ...profile, role: ROLE_MAP[profile.role_id] || "user" } }
    );

    return res.render("dashboard/dashboard-layout", {
      title: "Mon Profil",
      user: req.session.user,
      body
    });

  } catch (err) {
    return next(err);
  }
};

/* ==========================================================================
   LISTE DES UTILISATEURS (ADMINISTRATION ET FILTRES)
   ========================================================================== */
async function showAllUserProfile(req, res, next) {
  try {
    const { page = 1, limit = 10, search = "", role = "", category = "", service = "" } = req.query;
    
    const profiles = await GetAllUserProfile();
    if (!profiles) {
      const err = new Error("Impossible de charger le registre des utilisateurs.");
      err.status = 500;
      return next(err);
    }

    // Filtrage sécurisé contre les valeurs nulles/undefined en BDD
    const filtered = profiles.filter(user => {
      const matchSearch = !search || 
        user.firstname?.toLowerCase().includes(search.toLowerCase()) || 
        user.lastname?.toLowerCase().includes(search.toLowerCase()) || 
        user.email?.toLowerCase().includes(search.toLowerCase());

      const matchRole = !role || user.roles?.name?.toLowerCase() === role.toLowerCase();
      const matchCategory = !category || user.categories?.name?.toLowerCase() === category.toLowerCase();
      const matchService = !service || user.services?.name?.toLowerCase() === service.toLowerCase();

      return matchSearch && matchRole && matchCategory && matchService;
    });

    // Pagination JavaScript de la liste filtrée
    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginatedProfiles = filtered.slice(startIndex, startIndex + parseInt(limit));

    const body = await ejs.renderFile(
      getViewPath("dashboard/userprofiles.ejs"),
      {
        userProfiles: paginatedProfiles,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit) || 1,
        search, role, category, service
      }
    );

    return res.render("dashboard/dashboard-layout", {
      title: "Liste des Utilisateurs",
      user: req.session.user,
      body
    });

  } catch (error) {
    return next(error);
  }
}

/* ==========================================================================
   DEMANDES REÇUES
   ========================================================================== */
const showDemandeRecusPage = async (req, res, next) => {
  try {
    const demandes = await findDemandeRecus();
    if (!demandes) {
      const err = new Error("Erreur système lors du chargement des demandes clients.");
      err.status = 500;
      return next(err);
    }

    const body = await ejs.renderFile(
      getViewPath("dashboard/demande_recus.ejs"),
      { demandes, user: req.session.user }
    );

    return res.render("dashboard/dashboard-layout", {
      title: "Liste des demandes",
      user: req.session.user,
      body
    });

  } catch (error) {
    return next(error);
  }
};

/* ==========================================================================
   MISSIONS (PRESTATAIRES & ADMINS)
   ========================================================================== */
async function showMissions(req, res, next) {
  try {
    const userUid = req.session?.user?.uid;
    if (!userUid) {
      const err = new Error("Session expirée ou utilisateur non connecté.");
      err.status = 401;
      return next(err);
    }

    // Récupération des données d'accréditations du membre connecté
    const { data: user, error: userError } = await supabase
      .from("user_profiles")
      .select("id, uid, role_id, service_id, category_id")
      .eq("uid", userUid)
      .maybeSingle();

    if (userError) throw userError;
    if (!user) {
      const err = new Error("Profil utilisateur requis introuvable.");
      err.status = 404;
      return next(err);
    }

    let query = supabase.from("demande_service").select(`
      demande_id, category_id, service_id, category_name, service_name, 
      price, name, email, coordinates, location, phone, status, 
      gender, other_info, created_at
    `);

    // Application du cloisonnement strict selon le rôle
    if (user.role_id === 2) {
      // Prestataire : Ne voit que les missions affectées à sa catégorie et à sa spécialité de service
      query = query.eq("service_id", user.service_id).eq("category_id", user.category_id);
    } else if (user.role_id < 3) {
      // Utilisateurs classiques non autorisés
      const err = new Error("Accès refusé. Espace réservé uniquement aux prestataires certifiés.");
      err.status = 403;
      return next(err);
    }
    // Note : Si l'utilisateur est admin (role_id >= 3), aucune restriction 'eq' n'est appliquée (accès global)

    const { data: missions, error: missionsError } = await query.order("created_at", { ascending: false });
    if (missionsError) throw missionsError;

    const body = await ejs.renderFile(
      getViewPath("dashboard/missions.ejs"),
      { missions, user: req.session.user }
    );

    return res.render("dashboard/dashboard-layout", {
      title: "Mes Missions",
      user: req.session.user,
      body
    });

  } catch (error) {
    return next(error);
  }
}

export { 
  showDashboard, 
  showProfilePage, 
  showAllUserProfile, 
  showDemandeRecusPage, 
  showMissions 
};
