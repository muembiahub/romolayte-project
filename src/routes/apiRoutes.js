import express from "express";
import {
  getPublicCategories,
  getPublicServices,
  getPublicServiceDetail,
  getServicesByCategoryApi,
  submitContactApi,
  submitServiceRequestApi,
  getDashboardStats
} from "../controllers/apiControllers.js";
import {
  signup,
  login,
  logout,
  getAuthStatus
} from "../controllers/authController.js";
import requireApiAuth from "../middlewares/apiRequireAuth.js";

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
//  Public API routes
router.get("/categories", asyncHandler(getPublicCategories));
router.get("/services", asyncHandler(getPublicServices));
router.get("/services/:id", asyncHandler(getPublicServiceDetail));
router.get("/categories/:categoryId/services", asyncHandler(getServicesByCategoryApi));
router.post("/contact", asyncHandler(submitContactApi));
router.post("/demande-service", asyncHandler(submitServiceRequestApi));
// about api 


// Auth API
router.post("/auth/signup", asyncHandler(signup));
router.post("/auth/login", asyncHandler(login));
router.post("/auth/logout", asyncHandler(logout));
router.get("/auth/me", asyncHandler(getAuthStatus));
router.get("/dashboard/stats", requireApiAuth, asyncHandler(getDashboardStats));

export default router;
