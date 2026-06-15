import express from "express";
import {
  getPublicCategories,
  getPublicServicesByCategoryId,
  getPublicServices,
  getPublicServiceDetail,
  createService,
  submitContactApi,
  getDashboardStats,
  PostOrderService,
  getCityFromCoordinates,
  getaboutpages
} from "../controllers/apiControllers.js";
import {
  signup,
  login,
  logout,
  getAuthStatus
} from "../controllers/authController.js";
import requireApiAuth from "../middlewares/apiRequireAuth.js";

import { createDemandeService } from "../controllers/apiControllers.js";

const router = express.Router();

// Gestionnaire automatique des promesses asynchrones (évite les try/catch répétitifs)
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* =====================================================
   PUBLIC ROUTES (Accessible par tous les visiteurs)
===================================================== */
router.get("/categories", asyncHandler(getPublicCategories));
router.get("/categories/:id/services", asyncHandler(getPublicServicesByCategoryId));
router.get("/services", asyncHandler(getPublicServices));
router.get("/services/:id", asyncHandler(getPublicServiceDetail));
router.post("/services/create", asyncHandler(createService));
router.post("/services/:id/order", asyncHandler(PostOrderService));

router.get("/get-city", asyncHandler(getCityFromCoordinates)); 
router.post("/contact", asyncHandler(submitContactApi));
router.get("/about", getaboutpages);

router.post("/demandes-services", createDemandeService);


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
router.get("/dashboard/stats", requireApiAuth, asyncHandler(getDashboardStats));

export default router;
