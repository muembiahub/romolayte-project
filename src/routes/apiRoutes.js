import express from "express";
import {
  getPublicCategories,
  getPublicServices,
  getPublicServiceDetail,
  getServicesByCategoryApi,
  submitContactApi,
  getDashboardStats,
  submitServiceRequestApi,
  getCityFromCoordinates
} from "../controllers/apiControllers.js";
import {
  signup,
  login,
  logout,
  getAuthStatus
} from "../controllers/authController.js";
import requireApiAuth from "../middlewares/apiRequireAuth.js";

const router = express.Router();

// Gestionnaire automatique des promesses asynchrones (évite les try/catch répétitifs)
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* =====================================================
   PUBLIC ROUTES (Accessible par tous les visiteurs)
===================================================== */
router.get("/categories", asyncHandler(getPublicCategories));
router.get("/categories/:categoryId/services", asyncHandler(getServicesByCategoryApi));
router.get("/services", asyncHandler(getPublicServices));
router.get("/services/:id", asyncHandler(getPublicServiceDetail)); // Route REST simplifiée

router.get("/get-city", asyncHandler(getCityFromCoordinates)); // Route publique (non protégée)
router.post("/contact", asyncHandler(submitContactApi));

/* =====================================================
   AUTHENTICATION ROUTES
===================================================== */
router.post("/auth/signup", asyncHandler(signup));
router.post("/auth/login", asyncHandler(login));
router.post("/auth/logout", asyncHandler(logout));
router.get("/auth/me", asyncHandler(getAuthStatus));

/* =====================================================
   PROTECTED ROUTES (Connexion obligatoire avec token)
===================================================== */
router.post("/demande-service", requireApiAuth, asyncHandler(submitServiceRequestApi));
router.get("/dashboard/stats", requireApiAuth, asyncHandler(getDashboardStats));

export default router;
