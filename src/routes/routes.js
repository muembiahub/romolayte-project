import express from "express";
import { supabase } from "../config/database.js";

// Pages controllers
import { showCategories } from "../controllers/categories.js";
import {
  servicesPages,
  servicesPagesDetails,
  servicesPagesByCategory
} from "../controllers/services.js";
import { showAboutUsPage } from "../controllers/aboutUs.js";
import {
  submitServiceRequest,
  showMessageSuccessPage
} from "../controllers/demandeServiceControllers.js";

// Auth controller (MVC propre ✅)
import {
  signup,
  login,
  logout
} 
from "../controllers/authController.js";

import { showTermsPage, showPrivacyPage } from "../controllers/termsConttrollers.js";
import { sendContact, showContactform } from "../controllers/contactControllers.js";

const router = express.Router();

// ✅ Async error wrapper
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* =========================
   Pages publiques
========================= */
router.get("/", asyncHandler(showCategories));
router.get("/categories", asyncHandler(showCategories));

router.get("/services", asyncHandler(servicesPages));
router.get("/services-details/:id", asyncHandler(servicesPagesDetails));
router.get("/servicecategory/:id", asyncHandler(servicesPagesByCategory));

router.get("/about", asyncHandler(showAboutUsPage));
router.get("/terms", asyncHandler(showTermsPage));
router.get("/privacy", asyncHandler(showPrivacyPage));
router.get("/contact", asyncHandler(showContactform));
router.post("/send-contact", asyncHandler(sendContact));

router.post("/demande-service",submitServiceRequest);
router.get("/demande-success/:demandeId",showMessageSuccessPage);
/* =========================
   Authentification
========================= */
router.get(
  "/auth",
  asyncHandler(async (req, res, next) => {
    try {
      // ✅ Si déjà connecté → redirection sécurisée
      if (req.session.user) {
        return res.redirect("/dashboard");
      }

      // ✅ Charger les catégories pour le signup
      const { data: categories, error } = await supabase
        .from("categories")
        .select("category_id, name")
        .order("category_id", { ascending: true });

      if (error) {
        console.error("❌ Erreur chargement catégories:", error.message);

        // On délègue au middleware global d'erreurs
        error.status = 500;
        error.message = "Impossible de charger les catégories.";
        return next(error);
      }

      // ✅ Rendu avec le layout commun
      res.render("auth", {
        layout: "partials/layoute",   // ⚠️ Vérifie que ton layout existe bien
        title: "Authentification",
        categories: categories || []
      });

    } catch (err) {
      console.error("❌ Exception dans /auth:", err.message);

      // On passe l'erreur au middleware global
      err.status = 500;
      err.message = "Une erreur inattendue s’est produite lors du chargement de la page d’authentification.";
      next(err);
    }
  })
);

/* =========================
   Auth API (AJAX)
========================= */
router.post("/auth/signup", asyncHandler(signup));
router.post("/auth/login", asyncHandler(login));
router.get("/logout", logout);

/* =========================
   API – Services par catégorie (AJAX)
========================= */
router.get(
  "/services-by-category/:categoryId",
  asyncHandler(async (req, res) => {
    const { categoryId } = req.params;

    const { data, error } = await supabase
      .from("services")
      .select("service_id, name")
      .eq("category_id", categoryId)
      .order("name", { ascending: true });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.json({
      success: true,
      services: data
    });
  })
);

export default router;