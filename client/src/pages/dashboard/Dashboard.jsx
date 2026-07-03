import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Users,
  ClipboardList,
  FolderKanban,
  Briefcase,
  Plus,
  ListTodo
} from "lucide-react";

import OrderCard from "../../components/OrderCard";
import DashboardSkeleton from "../../components/DashboardSkeleton";
import { useAuth } from "../../hooks/UseAuth";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout, loading: authLoading } = useAuth();

  const [stats, setStats] = useState({
    usersCount: 0,
    demandesCount: 0,
    categoriesCount: 0,
    servicesCount: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Extraction sécurisée des rôles calculés depuis l'état global utilisateur
  const roleName = user?.roles?.name?.toLowerCase() || "";
  const isAdmin = roleName === "admin";
  const isSuperAdmin = roleName === "superadmin";
  const isPrivileged = ["admin", "superadmin"].includes(roleName);

  useEffect(() => {
    // 🛑 CORRECTIF : Bloquer les requêtes tant que l'auth charge ou si l'utilisateur n'est pas encore présent
    if (authLoading || !user) return;

    // AbortController pour annuler la requête HTTP si le composant est démonté rapidement
    const controller = new AbortController();

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          toast.error("Session expirée");
          navigate("/login");
          return;
        }

        const response = await fetch("/dashboard/stats", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        const data = await response.json();

        // Jeton invalide ou expiré côté serveur Express
        if (response.status === 401) {
          logout();
          toast.error(data?.message || "Session expirée");
          navigate("/login");
          return;
        }

        if (!response.ok || !data?.success) {
          throw new Error(data?.message || "Impossible de charger les données");
        }

        setStats(
          data.stats || {
            usersCount: 0,
            demandesCount: 0,
            categoriesCount: 0,
            servicesCount: 0,
          }
        );

        setRecentOrders(data.recentOrders || []);
      } catch (err) {
        if (err.name === "AbortError") return;
        
        console.error("Dashboard error:", err);
        const message = err.message || "Erreur lors du chargement";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Fonction de nettoyage (cleanup)
    return () => controller.abort();
  }, [navigate, logout, authLoading, user]); // 🔥 'user' ajouté ici pour s'exécuter dès que le profil est écrit après la connexion

  // Modèle des widgets de données
  const widgets = [
    {
      title: isPrivileged ? "Utilisateurs actifs" : "Accès limité",
      value: isPrivileged ? stats.usersCount : "🔒",
      description: isPrivileged ? null : "Réservé aux administrateurs",
      icon: Users,
      gradient: isPrivileged ? "from-blue-600 to-blue-800" : "from-gray-500 to-gray-700",
      link: isPrivileged ? "/dashboard/users" : null,
    },
    {
      title: isPrivileged ? "Demandes reçues" : "Accès limité",
      value: isPrivileged ? stats.demandesCount : "🔒",
      description: isPrivileged ? null : "Réservé aux administrateurs",
      icon: ClipboardList,
      gradient: isPrivileged ? "from-green-600 to-green-800" : "from-gray-500 to-gray-700",
      link: isPrivileged ? "/dashboard/demandes" : null,
    },
    {
      title: "Catégories",
      value: stats.categoriesCount,
      icon: FolderKanban,
      gradient: "from-violet-600 to-violet-800",
    },
    {
      title: "Services",
      value: stats.servicesCount,
      icon: Briefcase,
      gradient: "from-orange-500 to-orange-700",
    },
  ];

  // 🛑 CORRECTIF VISUEL : Afficher le squelette d'attente tant que le profil de l'utilisateur n'est pas chargé
  if (authLoading || !user) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* En-tête du Dashboard */}
      <section className="rounded-3xl bg-white p-8 shadow-lg border border-slate-100">
        <div className="flex flex-col gap-5 lg:flex-row lg:justify-between lg:items-center">
          <div>
            <span className="text-sm font-bold uppercase tracking-[0.25em] text-indigo-600">
              Tableau de bord
            </span>
            <h1 className="mt-3 text-4xl font-bold text-slate-900">Vue d'ensemble</h1>
            <p className="mt-4 max-w-2xl text-slate-600">
              Consultez rapidement vos statistiques d'activité.
            </p>
          </div>

<button
  onClick={() => navigate(isPrivileged ? "/dashboard/add-service" : "/dashboard/orders")}
  className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition"
>
  {isPrivileged ? <Plus size={18} /> : <ListTodo size={18} />}
  {isPrivileged ? "Ajouter service" : "Voir Mes Taches"}
</button>

        </div>
      </section>

      {/* Affichage d'erreur globale */}
      {error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-red-600 font-medium text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <DashboardSkeleton />
      ) : (
        <>
          {/* Grille de widgets */}
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {widgets.map((widget) => {
              const Icon = widget.icon;
              return (
                <div
                  key={widget.title}
                  className={`bg-gradient-to-br ${widget.gradient} rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between transition transform hover:-translate-y-1 duration-200`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium opacity-90">{widget.title}</span>
                    <Icon size={24} className="opacity-80" />
                  </div>
                  <div className="mt-6">
                    <div className="text-4xl font-bold tracking-tight">{widget.value}</div>
                    {widget.description && (
                      <p className="mt-2 text-xs text-white/70 font-medium">{widget.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section d'administration pour lister les demandes d'ordres récentes */}
          {(isAdmin || isSuperAdmin) && (
            <section className="rounded-3xl bg-white p-8 shadow-lg border border-slate-100">
              <h2 className="mb-6 text-2xl font-bold text-slate-900">Dernières demandes</h2>
              {recentOrders.length === 0 ? (
                <div className="text-center py-8 text-slate-500 font-medium">
                  Aucune demande récente à afficher
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <OrderCard
                      key={order.demande_id || order.id}
                      order={order}
                      onView={(o) => console.log("Affichage détails demande :", o)}
                    />
                  ))}
                </div>
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
}
