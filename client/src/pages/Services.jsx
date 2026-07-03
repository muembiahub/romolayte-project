import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Edit, Trash2, ShoppingCart } from "lucide-react";
import DashboardSkeleton from "../components/DashboardSkeleton";
import { useAuth } from "../hooks/UseAuth";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  // 🔥 Écouter si l'utilisateur connecté possède des droits d'administration
  const { isPrivileged } = useAuth();

  useEffect(() => {
    fetch("/api/services")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setServices(data.services || data);
        } else {
          setError(data.message || "Erreur lors du chargement des services.");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Fonction pour supprimer une prestation en base de données
  const handleDelete = async (serviceId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer définitivement ce service ? ⚠️")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Votre session a expiré.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`/dashboard/deleteservice/${serviceId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Impossible de supprimer la prestation.");
      }

      toast.success("Service supprimé avec succès ! 🎉");
      // Suppression de la carte à l'écran en filtrant l'état local
      setServices((prev) => prev.filter((s) => s.service_id !== serviceId));

    } catch (err) {
      console.error(err);
      toast.error(`Erreur : ${err.message}`);
    }
  };

  return (
    <div className="space-y-8">
      <header className="rounded-[2rem] bg-white p-8 shadow-soft border border-slate-100">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
          Nos services
        </span>
        <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
          Des services construits pour vos besoins.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
          Parcourez les offres disponibles et choisissez la prestation qui correspond à votre projet.
        </p>
      </header>

      {error && (
        <div className="rounded-3xl bg-rose-50 p-6 text-rose-700 shadow-soft border border-rose-100 font-medium text-sm">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {loading ? (
          <div className="col-span-full rounded-3xl bg-white p-8 text-center shadow-soft">
            <DashboardSkeleton />
          </div>
        ) : services.length === 0 ? (
          <div className="col-span-full rounded-3xl bg-white p-8 text-center shadow-soft text-slate-500 font-medium">
            Aucun service trouvé.
          </div>
        ) : (
          services.map((service) => (
            <article
              key={service.service_id}
              className="group overflow-hidden rounded-3xl bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border border-slate-100 flex flex-col justify-between"
            >
              {/* Image Section */}
              <div className="relative">
                <img
                  src={service.logo || "https://unsplash.com"}
                  alt={service.name}
                  className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-sm">
                  {service.categories?.name || "Service"}
                </span>
                <span className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 text-sm font-bold text-slate-900 shadow-md">
                  {service.price ? `${service.price} $` : "Sur devis"}
                </span>
              </div>

              {/* Content Section */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 line-clamp-1">
                    {service.name}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600 line-clamp-3">
                    {service.description || "Description non disponible."}
                  </p>
                </div>

                {/* Footer / Actions Section */}
                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                      Tarif
                    </p>
                    <p className="text-lg font-bold text-indigo-600">
                      {service.price ? `${service.price} $` : "Sur devis"}
                    </p>
                  </div>

                  {/* 🔒 AFFICHAGE DYNAMIQUE SELON LES PRIVILÈGES */}
                  {isPrivileged ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/dashboard/edit-service/${service.service_id}`)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
                      >
                        <Edit size={14} />
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(service.service_id)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-transparent bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition"
                      >
                        <Trash2 size={14} />
                        Supprimer
                      </button>
                    </div>
                  ) : (
                    <Link
                      to={`/services/${service.service_id}/order`}
                      className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition"
                    >
                      <ShoppingCart size={15} />
                      Commander
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
