// * Dashboard Controller * ====================

import { supabase } from "../../config/database.js";
import { findUserProfile, findDemandeRecus, GetAllUserProfile } from "../../models/userModel.js";

// ✅ Affiche la page dashboard
const showDashboard = (req, res) => {
  res.render("dashboard", {
    title: "Dashboard",
    user: req.session.user
  });
};

// ===============================
// Profil utilisateur
// ===============================
const ROLE_MAP = {
  1: "user",
  2: "prestataire",
  3: "admin",
  4: "super-admin"
};

const showProfilePage = async (req, res, next) => {
  try {
    const profile = await findUserProfile(req.session.user.uid);

    if (!profile) {
      const err = new Error("Profil introuvable");
      err.status = 404;
      return next(err);
    }

    res.render("profile", {
      title: "Mon Profil",
      user: {
        ...profile,
        role: ROLE_MAP[profile.role_id],
        role_level: profile.role_id
      }
    });
  } catch (err) {
    err.status = err.status || 500;
    next(err);
  }
};

// ===============================
// Liste des utilisateurs
// ===============================
async function showAllUserProfile(req, res, next) {
  try {
    const { page = 1, limit = 10, search = "", role = "", category = "", service = "" } = req.query;
    const profiles = await GetAllUserProfile();

    if (!profiles) {
      const err = new Error("Impossible de charger les utilisateurs.");
      err.status = 500;
      return next(err);
    }

    // Filtrage
    let filtered = profiles.filter(user => {
      const matchSearch =
        user.firstname.toLowerCase().includes(search.toLowerCase()) ||
        user.lastname.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

      const matchRole = role ? user.roles?.name?.toLowerCase() === role.toLowerCase() : true;
      const matchCategory = category ? user.categories?.name?.toLowerCase() === category.toLowerCase() : true;
      const matchService = service ? user.services?.name?.toLowerCase() === service.toLowerCase() : true;

      return matchSearch && matchRole && matchCategory && matchService;
    });

    // Pagination
    const total = filtered.length;
    const start = (page - 1) * limit;
    const end = start + parseInt(limit);
    const paginated = filtered.slice(start, end);

    res.render("userprofiles", {
      userProfiles: paginated,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      search,
      role,
      category,
      service
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
}

// ===============================
// Demandes reçues
// ===============================
const showDemandeRecusPage = async (req, res, next) => {
  try {
    const demandes = await findDemandeRecus();

    if (!demandes) {
      const err = new Error("Impossible de charger les demandes.");
      err.status = 500;
      return next(err);
    }

    res.render("demande_recus", { 
      title: "Liste des demandes", 
      demandes 
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
};

// ===============================
// Missions
// ===============================
async function showMissions(req, res, next) {
  const userUid = req.session?.user?.uid; // ⚠️ bien uid

  if (!userUid) {
    const err = new Error("Utilisateur non authentifié ou UID manquant.");
    err.status = 401;
    return next(err);
  }

  const { data: user, error: userError } = await supabase
    .from("user_profiles")
    .select("id, uid, role_id, service_id, category_id")
    .eq("uid", userUid)
    .maybeSingle();

  if (userError) {
    const err = new Error(userError.message);
    err.status = 500;
    return next(err);
  }

  if (!user) {
    const err = new Error("Profil utilisateur introuvable pour cet UID.");
    err.status = 404;
    return next(err);
  }

  let missions;

  if (user.role_id === 2) {
    // Prestataire → missions filtrées
    const { data, error } = await supabase
      .from("demande_service")
      .select(`
        demande_id,
        category_id,
        service_id,
        category_name,
        service_name,
        price,
        name,
        email,
        coordinates,
        location,
        phone,
        gender,
        other_info,
        created_at
      `)
      .eq("service_id", user.service_id)
      .eq("category_id", user.category_id)
      .order("created_at", { ascending: false });

    if (error) {
      const err = new Error(error.message);
      err.status = 500;
      return next(err);
    }
    missions = data;

  } else if (user.role_id >= 3) {
    // Admin / SuperAdmin → toutes les missions
    const { data, error } = await supabase
      .from("demande_service")
      .select(`
        demande_id,
        category_id,
        service_id,
        category_name,
        service_name,
        price,
        name,
        email,
        coordinates,
        location,
        phone,
        gender,
        other_info,
        created_at
      `)
      .order("created_at", { ascending: false });

    if (error) {
      const err = new Error(error.message);
      err.status = 500;
      return next(err);
    }
    missions = data;

  } else {
    const err = new Error("Accès réservé aux prestataires ou administrateurs.");
    err.status = 403;
    return next(err);
  }

  res.render("missions", { user, missions });
}

export { showDashboard, showProfilePage, showAllUserProfile, showDemandeRecusPage, showMissions };
