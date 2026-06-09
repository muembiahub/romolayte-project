import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/services")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setServices(data.services);
        } else {
          setError(data.message || "Erreur lors du chargement des services.");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <header className="rounded-[2rem] bg-white p-8 shadow-soft">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Nos services</span>
        <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">Des services construits pour vos besoins.</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
          Parcourez les offres disponibles et choisissez la prestation qui correspond à votre projet.
        </p>
      </header>

      {error && (
        <div className="rounded-3xl bg-rose-50 p-6 text-rose-700 shadow-soft">{error}</div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {loading ? (
          <div className="col-span-full rounded-3xl bg-white p-8 text-center shadow-soft">Chargement des services…</div>
        ) : services.length === 0 ? (
          <div className="col-span-full rounded-3xl bg-white p-8 text-center shadow-soft">Aucun service trouvé.</div>
        ) : (
          services.map((service) => (
            <article
              key={service.service_id}
              className="group overflow-hidden rounded-3xl bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              {/* Image */}
  <div className="relative">
    <img
      src={service.logo}
      alt={service.name}
      className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
    />

    <span className="absolute left-4 top-4 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
      {service.categories?.name || "Service"}
    </span>

    <span className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 text-sm font-bold text-slate-900 shadow">
      {service.price ? `${service.price} $` : "Sur devis"}
    </span>
  </div>

  {/* Content */}
  <div className="p-6">
    <h2 className="text-xl font-bold text-slate-900 line-clamp-1">
      {service.name}
    </h2>

    <p className="mt-3 text-sm leading-6 text-slate-600 line-clamp-3">
      {service.description || "Description non disponible."}
    </p>

    {/* Footer */}
    <div className="mt-6 flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-wider text-slate-400">
          Tarif
        </p>
        <p className="text-lg font-bold text-indigo-600">
          {service.price ? `${service.price} $` : "Sur devis"}
        </p>
      </div>

      <Link
        to={`/services/${service.service_id}/order`}
        className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
      >
        Commander
      </Link>
    </div>
  </div>
</article>
            
          ))
        )}
      </div>
    </div>
  );
}
