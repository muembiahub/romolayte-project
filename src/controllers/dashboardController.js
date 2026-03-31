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

// ===============================
// Page d’accueil du dashboard
// ===============================
const showDashboard = async (req, res, next) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    // Compter les utilisateurs
    const { count: usersCount, error: usersError } = await supabase
      .from("user_profiles")
      .select("*", { count: "exact", head: true });
    if (usersError) throw usersError;

    // Compter les missions
    const { count: missionsCount, error: missionsError } = await supabase
      .from("demande_service")
      .select("*", { count: "exact", head: true });
    if (missionsError) throw missionsError;

    // Compter les demandes
    const { count: demandesCount, error: demandesError } = await supabase
      .from("demande_service")
      .select("*", { count: "exact", head: true });
    if (demandesError) throw demandesError;

    // Rendu du body avec stats
    const body = await ejs.renderFile(
      path.join(process.cwd(), "src/views/dashboard/dashboard-home.ejs"),
      {
        user: req.session.user,
        stats: {
          usersCount,
          missionsCount,
          demandesCount
        }
      }
    );

    res.render("dashboard/dashboard-layout", {
      title: "Tableau de bord",
      user: req.session.user,
      body
    });
  } catch (err) {
    next(err);
  }
};


// ===============================
// Profil utilisateur
// ===============================
const showProfilePage = async (req, res, next) => {
  try {
    const profile = await findUserProfile(req.session.user.uid);

    if (!profile) {
      const err = new Error("Profil introuvable");
      err.status = 404;
      return next(err);
    }

    const body = await ejs.renderFile(
      path.join(process.cwd(), "src/views/dashboard/profile.ejs"),
      {
        user: {
          ...profile,
          role: ROLE_MAP[profile.role_id],
          role_level: profile.role_id
        }
      }
    );

    res.render("dashboard/dashboard-layout", {
      title: "Mon Profil",
      user: req.session.user,
      body
    });
  } catch (err) {
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

    const body = await ejs.renderFile(
      path.join(process.cwd(), "src/views/dashboard/userprofiles.ejs"),
      {
        userProfiles: paginated,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        search,
        role,
        category,
        service
      }
    );

    res.render("dashboard/dashboard-layout", {
      title: "Liste des Utilisateurs",
      user: req.session.user,
      body
    });
  } catch (error) {
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

    const body = await ejs.renderFile(
      path.join(process.cwd(), "src/views/dashboard/demande_recus.ejs"),
      { demandes, user: req.session.user }  
    );

    res.render("dashboard/dashboard-layout", {
      title: "Liste des demandes",
      user: req.session.user,
      body
    });
  } catch (error) {
    next(error);
  }
};

// ===============================
// Missions
// ===============================
async function showMissions(req, res, next) {
  const userUid = req.session?.user?.uid;

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
    return next(new Error(userError.message));
  }

  if (!user) {
    const err = new Error("Profil utilisateur introuvable pour cet UID.");
    err.status = 404;
    return next(err);
  }

  let missions;

  if (user.role_id === 2) {
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
        status,
        gender,
        other_info,
        created_at
      `)
      .eq("service_id", user.service_id)
      .eq("category_id", user.category_id)
      .order("created_at", { ascending: false });

    if (error) return next(new Error(error.message));
    missions = data;

  } else if (user.role_id > 3) {
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
        status,
        gender,
        other_info,
        created_at
      `)
      .order("created_at", { ascending: false });

    if (error) return next(new Error(error.message));
    missions = data;

  } else {
    const err = new Error("Accès réservé aux prestataires ou administrateurs.");
    err.status = 403;
    return next(err);
  }

  const body = await ejs.renderFile(
  path.join(process.cwd(), "src/views/dashboard/missions.ejs"),
  { missions, user: req.session.user }   // ✅ ajout de user
);


  res.render("dashboard/dashboard-layout", {
  title: "Mes Missions",
  user: req.session.user,
  body
});

}

export { showDashboard, showProfilePage, showAllUserProfile, showDemandeRecusPage, showMissions };
