import express from "express";
import { supabase  } from "../config/database.js";
import requireAuth from "../middlewares/requireAuth.js";
import {
  showDashboard,
  showProfilePage,
  showAllUserProfile,
  showDemandeRecusPage,
  showMissions
} from "../views/controllers/dashboardController.js";


const router = express.Router();

/*
|--------------------------------------------------------------------------
| Dashboard – routes protégées
|--------------------------------------------------------------------------
*/
router.get("/", requireAuth, showDashboard);
router.get("/demande_recus", requireAuth, showDemandeRecusPage);
router.get("/profile", requireAuth, showProfilePage);
router.get("/userprofiles", requireAuth, showAllUserProfile);
router.get("/missions", requireAuth, showMissions);

/*
|--------------------------------------------------------------------------
| Mise à jour du statut d'une demande
|--------------------------------------------------------------------------
*/
router.put("/demande_recus/:id/status", requireAuth, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  console.log("Route atteinte ✅", { id, status });

  try {
    const { error } = await supabase
      .from("demande_service")
      .update({ status })
      .eq("demande_id", id);

    if (error) {
      console.error("Erreur Supabase ❌", error);
      return res.status(500).json({ success: false, message: "Erreur DB" });
    }

    return res.status(200).json({ success: true, message: "Statut mis à jour", id, status });
  } catch (err) {
    console.error("Erreur serveur ⚠️", err);
    return res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

export default router;
