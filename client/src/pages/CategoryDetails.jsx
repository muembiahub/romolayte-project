
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function CategoryDetails() {
  const { id } = useParams();

  const [category, setCategory] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryAndServices = async () => {
      try {
        setLoading(true);

        // Charger les catégories
        const categoryResponse = await fetch("/api/categories");
        const categoryData = await categoryResponse.json();

        if (categoryData.success) {
          const selectedCategory = categoryData.categories.find(
            (cat) => String(cat.category_id) === String(id)
          );

          setCategory(selectedCategory);
        }

        // Charger les services de la catégorie
        const servicesResponse = await fetch(
          `/api/services?category_id=${id}`
        );

        const servicesData = await servicesResponse.json();

        if (servicesData.success) {
          setServices(servicesData.services);
        }
      } catch (error) {
        console.error("Erreur :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndServices();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <Link
        to="/"
        className="mb-6 inline-flex items-center rounded-lg border px-4 py-2 hover:bg-gray-100"
      >
        ← Retour aux catégories
      </Link>

      {category && (
        <div className="mb-10 rounded-3xl bg-white p-8 shadow">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <img
              src={category.logo}
              alt={category.name}
              className="h-32 w-32 rounded-xl border object-contain p-2"
            />

            <div>
              <h1 className="text-4xl font-bold text-slate-900">
                {category.name}
              </h1>

              <p className="mt-3 text-slate-600">
                {category.description}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-3xl font-bold">
          Services disponibles
        </h2>

        <p className="text-slate-500">
          {services.length} service(s) trouvé(s)
        </p>
      </div>

      {services.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.service_id}
              className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              {service.logo && (
                <img
                  src={service.logo}
                  alt={service.name}
                  className="mb-4 h-48 w-full rounded-lg object-cover"
                />
              )}

              <h3 className="text-xl font-semibold">
                {service.name}
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                {service.description}
              </p>

           <div className="mt-4">
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">
                {service.price != null ? `${service.price} $` : "Pas de prix défini"}
            </span>
            </div>

              <Link
  to={`/services/${service.service_id}/order`}
  className="mt-4 block w-full rounded-lg bg-indigo-600 px-4 py-2 text-center font-medium text-white hover:bg-indigo-500"
>
  Commander
</Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed p-10 text-center">
          <h3 className="text-xl font-semibold">
            Aucun service trouvé
          </h3>

          <p className="mt-2 text-slate-500">
            Cette catégorie ne contient actuellement aucun service.
          </p>
        </div>
      )}
    </div>
  );
}
