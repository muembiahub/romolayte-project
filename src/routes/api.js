import express from "express";

import {
  getPublicCategories,
  getPublicServicesByCategoryId,
  getPublicServices,
  getPublicServiceDetail,
  submitContactMessage,
  submitDemandeService,
  getaboutpages
} from "../controllers/apiPublicControllers.js";


/* ===================================================== */
const router = express.Router();


/* =====================================================
   PUBLIC ROUTES
===================================================== */
router.get("/categories", getPublicCategories);
router.get("/categories/:id/services", getPublicServicesByCategoryId);
router.get("/services", getPublicServices);
router.get("/services/:id", getPublicServiceDetail);

router.post("/demandes", submitDemandeService);

router.post("/contact", submitContactMessage);
router.get("/about", getaboutpages);


export default router;
