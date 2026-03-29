import express from "express";
import { supabase } from "../../config/database.js";

// Pages controllers
import { showCategories } from "./categories.js";
import {
  servicesPages,
  servicesPagesDetails,
  servicesPagesByCategory
} from "./services.js";
import { showAboutUsPage } from "./aboutUs.js";
import {
  showForm,
  submitForm
} from "./demandeServiceControllers.js";

// Auth controller (MVC propre ✅)
import {
  signup,
  login,
  logout
} 
from "./authController.js";

import { showTermsPage, showPrivacyPage } from "./termsConttrollers.js";
import { sendContact, showContactform } from "./contactControllers.js";

const router = express.Router();

// ✅ Async error wrapper
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* =========================
   Pages publiques
========================= */
router.get("/categories", asyncHandler(showCategories));

router.get("/services", asyncHandler(servicesPages));
router.get("/services-details/:id", asyncHandler(servicesPagesDetails));
router.get("/servicecategory/:id", asyncHandler(servicesPagesByCategory));

router.get("/about", asyncHandler(showAboutUsPage));
router.get("/terms", asyncHandler(showTermsPage));
router.get("/privacy", asyncHandler(showPrivacyPage));
router.get("/contact", asyncHandler(showContactform));
router.post("/send-contact", asyncHandler(sendContact));

router.get("/demande-service", asyncHandler(showForm));
router.post("/demande-service", asyncHandler(submitForm));

/* =========================
   Authentification
========================= */
router.get("/auth", asyncHandler(async (req, res) => {
  // ✅ Si déjà connecté → redirection sécurisée
  if (req.session.user) {
    return res.redirect("/dashboard");
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("category_id, name")
    .order("category_id", { ascending: true });

  res.render("auth", {
    layout: false,
    title: "Authentification",
    categories: categories || [],
    error: null,
    registered: req.query.registered === "true"
  });
}));

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
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  })
);

export default router;