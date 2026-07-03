import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/UseAuth";
import toast from "react-hot-toast";
import { useEffect } from "react";

export default function ProtectedRoute({ adminOnly = false }) {
  const { user, loading } = useAuth();

  const roleName = user?.roles?.name?.toLowerCase() || "";
  const isPrivileged = ["admin", "superadmin"].includes(roleName);

  useEffect(() => {
    // Si le chargement est fini et qu'il n'y a pas d'utilisateur, on prévient l'utilisateur
    if (!loading && !user) {
      toast.error("Veuillez vous connecter pour accéder à cette page 🔒");
    } 
    // Si la route est réservée aux admins et que l'utilisateur n'a pas les droits
    else if (!loading && adminOnly && !isPrivileged) {
      toast.error("Accès refusé. Droits d'administration requis ⛔");
    }
  }, [loading, user, adminOnly, isPrivileged]);

  // Pendant que l'application vérifie le token au démarrage, on n'affiche rien ou un spinner
  if (loading) {
    return null; 
  }

  // Si pas connecté -> Redirection vers la page de connexion
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si connecté mais pas admin sur une route admin -> Redirection vers l'accueil ou un espace de base
  if (adminOnly && !isPrivileged) {
    return <Navigate to="/" replace />;
  }

  // Si tout est OK, on affiche les composants enfants (le Dashboard, le profil, etc.)
  return <Outlet />;
}
