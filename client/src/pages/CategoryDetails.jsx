import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function CategoryDetails() {
  const { id } = useParams(); // ID de la catégorie extrait de l'URL actuelle
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchCategoryAndServices = async () => {
      try {
        setLoading(true);

        // 1. Récupération de la catégorie sélectionnée
        const categoryResponse = await fetch("/api/categories");
        const categoryData = await categoryResponse.json();

        if (categoryData.success && isMounted) {
          const selectedCategory = categoryData.categories.find(
            (cat) => String(cat.category_id) === String(id)
          );
          setCategory(selectedCategory);
        }

        // 2. Récupération des services associés
        const servicesResponse = await fetch(
          `/api/categories/${id}/services`
        );
        const servicesData = await servicesResponse.json();

        if (servicesData.success && isMounted) {
          setServices(servicesData.services || []);
        }
      } catch (error) {
        console.error("Erreur de chargement des données :", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCategoryAndServices();
    return () => { isMounted = false; };
  }, [id]);

  // Squelette de chargement natif Tailwind CSS
  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10 animate-pulse">
        <div className="mb-6 h-10 w-44 rounded-lg bg-gray-200" />
        <div className="mb-10 rounded-3xl bg-white p-8 shadow-sm border border-gray-100">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="h-32 w-32 rounded-xl bg-gray-200 shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-8 w-1/3 rounded bg-gray-200" />
              <div className="h-4 w-2/3 rounded bg-gray-200" />
            </div>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((num) => (
            <div key={num} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="mb-4 h-48 w-full rounded-lg bg-gray-200" />
                <div className="h-6 w-3/4 rounded bg-gray-200 mb-2" />
                <div className="space-y-2 mb-4">
                  <div className="h-4 w-full rounded bg-gray-200" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-6 w-20 rounded-full bg-gray-200" />
                <div className="h-10 w-full rounded-lg bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <button
        onClick={() => navigate("/")}
        className="mb-6 inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition cursor-pointer"
      >
        ← Retour aux catégories
      </button>

      {category && (
        <article className="mb-10 rounded-3xl bg-white p-8 shadow-sm border border-gray-100">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <img
              src={category.logo || "https://placehold.co"}
              alt={category.name}
              className="h-32 w-32 rounded-xl border border-gray-200 object-contain p-2 bg-slate-50"
            />
            <div>
              <h1 className="text-4xl font-bold text-slate-900">
                {category.name}
              </h1>
              <p className="mt-3 text-slate-600 leading-relaxed">
                {category.description}
              </p>
            </div>
          </div>
        </article>
      )}

      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-900">
          Services disponibles
        </h2>
        <p className="text-slate-500 mt-1 font-medium">
          {services.length} service(s) trouvé(s)
        </p>
      </div>

      {services.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.service_id}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition flex flex-col justify-between hover:shadow-md hover:border-gray-300"
            >
              <div>
                {service.logo ? (
                  <img
                    src={service.logo}
                    alt={service.name}
                    className="mb-4 h-48 w-full rounded-lg object-cover"
                  />
                ) : (
                  <div className="mb-4 h-48 w-full rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 font-medium text-sm border border-gray-100">
                    Image non disponible
                  </div>
                )}

                <h3 className="text-xl font-bold text-slate-900">
                  {service.name}
                </h3>

                <p className="mt-2 text-sm text-slate-600 line-clamp-3 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div>
                <div className="mt-5 mb-4">
                  <span className="rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1.5 text-xs font-semibold text-indigo-700">
                    {service.price != null && service.price !== "Sur devis" 
                      ? `${Number(service.price).toFixed(2)} $` 
                      : "Prix sur devis"}
                  </span>
                </div>

                {/* CORRECTION DE LA ROUTE : Prend désormais en compte le paramètre de catégorie :id */}
                <Link
                  to={`/services/${service.service_id}/order`}
                  className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 block text-center shadow-sm"
                >
                  Commander
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-slate-50/50 p-12 text-center max-w-xl mx-auto mt-10">
          <h3 className="text-xl font-bold text-slate-800">
            Aucun service trouvé
          </h3>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            Cette catégorie ne contient actuellement aucun service actif.
          </p>
        </div>
      )}
    </div>
  );
}
