import { supabase } from "../config/database.js";

// ✅ Listen for new submissions
supabase
  .channel("kenyan_submission")
  .on(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "demande_service" },
    (payload) => {
      console.log("🆕 Nouvelle demande reçue :", payload.new);
      // 👉 Ici, tu peux envoyer un email, SMS ou notification push
    }
  )
  // ✅ Listen for status updates
  .on(
    "postgres_changes",
    { event: "UPDATE", schema: "public", table: "demande_service" },
    (payload) => {
      console.log("🔄 Statut mis à jour :", payload.new);
      // 👉 Ici, tu peux notifier le client ou l’équipe
    }
  )
  .subscribe();
