import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  ClipboardList,
  FolderKanban,
  Briefcase,
  Plus,
} from "lucide-react";
 import OrderCard from "../components/OrderCard";

export default function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    usersCount: 0,
    demandesCount: 0,
    categoriesCount: 0,
    servicesCount: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/dashboard/stats", {
          credentials: "include",
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(
            data.message || "Impossible de charger les données."
          );
        }

        setStats(data.stats);

        if (data.recentOrders) {
          setRecentOrders(data.recentOrders);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  // fetch user


  const widgets = [
    {
      title: "Utilisateurs actifs",
      value: stats.usersCount,
      icon: Users,
      gradient: "from-blue-600 to-blue-800",
    },
    {
      title: "Demandes reçues",
      value: stats.demandesCount,
      icon: ClipboardList,
      gradient: "from-emerald-600 to-emerald-800",
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="rounded-3xl bg-white p-8 shadow-lg">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="text-sm font-bold uppercase tracking-[0.25em] text-indigo-600">
              Tableau de bord
            </span>

            <h1 className="mt-3 text-4xl font-bold text-slate-900">
              Vue d'ensemble
            </h1>

            <p className="mt-4 max-w-2xl text-slate-600">
              Consultez rapidement les statistiques de votre plateforme,
              gérez vos catégories et suivez les dernières demandes.
              Role:{user?.role}
            </p>
            
          </div>

          <button
            onClick={() => navigate("/service/create")}
            className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-700"
          >
            <Plus size={18} />
            Ajouter service
          </button>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-red-600">
          {error}
        </div>
      )}

      {/* Stats */}
      {loading ? (
        <div className="rounded-3xl bg-white p-10 text-center shadow-lg">
          <div className="flex justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          </div>

          <p className="mt-4 text-slate-600">
            Chargement des statistiques...
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {widgets.map((widget) => {
            const Icon = widget.icon;

            return (
              <div
                key={widget.title}
                className={`bg-gradient-to-br ${widget.gradient} rounded-3xl p-6 text-white shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm uppercase tracking-wider text-white/80">
                    {widget.title}
                  </span>

                  <Icon size={26} />
                </div>

                <div className="mt-8 text-4xl font-bold">
                  {widget.value}
                </div>
              </div>
            );
          })}
        </div>
      )}

    

{/* Dernières demandes */}
<section className="rounded-3xl bg-white p-8 shadow-lg">
  <div className="mb-6 flex items-center justify-between">
    <h2 className="text-2xl font-bold text-slate-900">
      Dernières demandes
    </h2>

    <button
      onClick={() => navigate("/orders")}
      className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
    >
      Voir tout →
    </button>
  </div>

  {recentOrders.length === 0 ? (
    <div className="rounded-2xl border border-dashed border-slate-300 py-10 text-center text-slate-500">
      Aucune demande récente.
    </div>
  ) : (
    <div className="space-y-4">
      {recentOrders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onView={(o) => console.log("view order", o)}
        />
      ))}
    </div>
  )}
</section>
    </div>
  );
}