import express from "express";

import {
  getPublicCategories,
  getPublicServicesByCategoryId,
  getPublicServices,
  getPublicServiceDetail,
  createService,
  submitContactMessage,
  submitDemandeService,
  getaboutpages
} from "../controllers/apiPublicControllers.js";


/* ===================================================== */
import { showMessageContact } from "../controllers/apiPublicControllers.js";
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

router.post("/contact", submitContactMessage);
router.get("/about", getaboutpages);


export default router;
