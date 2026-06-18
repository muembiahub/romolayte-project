import express from "express";
import requireAuth from "../middlewares/requireAuth.js";
import requireApiAuth from "../middlewares/apiRequireAuth.js";

import {
  getPublicCategories,
  getPublicServicesByCategoryId,
  getPublicServices,
  getPublicServiceDetail,
  createService,
  submitContactMessage,
  getCityFromCoordinates,
  getDashboardStats,
  submitDemandeService,
  getaboutpages
} from "../controllers/apiControllers.js";

// import {
//   signup,
//   login,
//   logout,
//   getAuthStatus
// } from "../controllers/apiControllers.js";

// import {
//   showDashboard,
//   showProfilePage,
//   showDemandeRecusPage,
//   showMissions,
//   showStatisticPage,
//   showChangeRolesPage,
//   showChangeSystemPage
// } from "../controllers/apiControllers.js";

import { showMessageContact } from "../controllers/apiControllers.js";
import { deleteContact, updateContactStatus } from "../models/contactModel.js";

const router = express.Router();

/* =====================================================
   PUBLIC ROUTES
===================================================== */
router.get("/categories", getPublicCategories);
router.get("/categories/:id/services", getPublicServicesByCategoryId);
router.get("/services", getPublicServices);
router.get("/services/:id", getPublicServiceDetail);
router.post("/services", createService);

router.post("/demandes", submitDemandeService);

router.get("/city", getCityFromCoordinates);
router.post("/contact", submitContactMessage);
router.get("/about", getaboutpages);

/* =====================================================
   AUTH ROUTES
===================================================== */
// router.post("/auth/signup", signup);
// router.post("/auth/login", login);
// router.post("/auth/logout", logout);
// router.get("/auth/me", getAuthStatus);

// /* =====================================================
//    PROTECTED ROUTES (Dashboard)
// ===================================================== */
// router.get("/dashboard", requireAuth, showDashboard);
// router.get("/dashboard/profile", requireAuth, showProfilePage);
// router.get("/dashboard/user-profiles", requireAuth, showAllUserProfile);

// router.get("/dashboard/demandes", requireAuth, showDemandeRecusPage);
// router.put("/dashboard/demandes/:id/status", requireAuth, async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;

//   try {
//     const { error } = await supabase
//       .from("demande_service")
//       .update({ status })
//       .eq("demande_id", id);

//     if (error) return res.status(500).json({ success: false, message: error.message });

//     return res.status(200).json({ success: true, message: "Statut mis à jour", id, status });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: "Erreur serveur" });
//   }
// });

// router.get("/dashboard/missions", requireAuth, showMissions);

// router.get("/dashboard/messages", requireAuth, showMessageContact);
// router.put("/dashboard/messages/:id/status", requireAuth, updateContactStatus);
// router.delete("/dashboard/messages/:id", requireAuth, deleteContact);

// router.get("/dashboard/statistiques", requireAuth, showStatisticPage);
// router.get("/dashboard/roles", requireAuth, showChangeRolesPage);
// router.get("/dashboard/system", requireAuth, showChangeSystemPage);

// Stats API protégée (utilisée par React Dashboard)
// router.get("/dashboard/stats", requireApiAuth, getDashboardStats);

export default router;
