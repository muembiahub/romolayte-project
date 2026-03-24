import express from "express";
import requireAuth from "../middlewares/requireAuth.js";
import { showDashboard } from "../views/controllers/dashboardController.js";
import { showProfilePage } from "../views/controllers/dashboardController.js";
import {showAllUserProfile} from "../views/controllers/dashboardController.js"
import { showDemandeRecusPage } from "../views/controllers/dashboardController.js";
import{showMissions} from "../views/controllers/dashboardController.js"

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Dashboard – route protégée
|--------------------------------------------------------------------------
| ❌ Accès par URL directe bloqué
| ✅ Accès uniquement après login (session requise)
| ✅ Refresh autorisé
*/
router.get("/", requireAuth, showDashboard);
router.get("/demande_recus", requireAuth, showDemandeRecusPage)
router.get("/profile", requireAuth,showProfilePage)
router.get("/userprofiles", requireAuth,showAllUserProfile)
router.get("/missions", requireAuth, showMissions)


export default router;