
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories", {
          signal: controller.signal,
        });

        const data = await response.json();

        if (data.success) {
          setCategories(data.categories);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();

    return () => controller.abort();
  }, []);

  return (
    <div className="space-y-12">

      {/* HERO */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-8 py-16 text-white shadow-xl sm:px-12">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.4),transparent_60%)]" />

        <div className="relative max-w-3xl space-y-6">
          <span className="inline-flex rounded-full bg-white/10 px-4 py-1 text-sm font-semibold text-indigo-200 ring-1 ring-white/20">
            🚀 Marketplace nouvelle génération
          </span>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Trouvez et proposez des services en quelques clics.
          </h1>

          <p className="text-slate-300 text-lg">
            Une plateforme moderne pour connecter clients et prestataires de manière simple, rapide et sécurisée.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/services"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100 transition"
            >
              Découvrir les services
            </Link>

            <Link
              to="/dashboard"
              className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="grid gap-6 sm:grid-cols-3">
        {[
          { title: "Services", value: "120+", desc: "Offres disponibles" },
          { title: "Réponse", value: "24h", desc: "Temps moyen" },
          { title: "Tech", value: "React", desc: "Stack moderne" },
        ].map((item, i) => (
          <div
            key={i}
            className="rounded-3xl bg-white p-6 shadow-sm hover:shadow-md transition"
          >
            <p className="text-sm uppercase tracking-widest text-indigo-600">
              {item.title}
            </p>
            <p className="mt-3 text-3xl font-bold text-slate-900">
              {item.value}
            </p>
            <p className="text-sm text-slate-500">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* FEATURES */}
      <section className="grid gap-6 lg:grid-cols-3">
        {[
          {
            title: "Interface moderne",
            desc: "Expérience utilisateur fluide et intuitive.",
          },
          {
            title: "Données en temps réel",
            desc: "API connectée et dynamique.",
          },
          {
            title: "Sécurité",
            desc: "Accès protégé et authentification.",
          },
        ].map((f, i) => (
          <div
            key={i}
            className="rounded-3xl bg-white p-6 shadow-sm hover:-translate-y-1 transition"
          >
            <h3 className="text-lg font-semibold text-slate-900">
              {f.title}
            </h3>
            <p className="mt-2 text-sm text-slate-600">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* CATEGORIES */}
      <section className="rounded-[2.5rem] bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Catégories
            </h2>
            <p className="text-sm text-slate-500">
              Explorez nos services disponibles
            </p>
          </div>

          <span className="text-sm text-slate-500">
            {loading ? "Chargement..." : `${categories.length} catégories`}
          </span>
        </div>

        {/* GRID */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <p className="text-slate-500">Chargement des catégories...</p>
          ) : categories.length === 0 ? (
            <p className="text-slate-500">Aucune catégorie trouvée.</p>
          ) : (
            categories.map((category) => (
              <div
                key={category.category_id}
                className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm hover:shadow-xl transition"
              >
                {/* IMAGE */}
                <div className="h-44 overflow-hidden bg-slate-100">
                  <img
                    src={category.logo}
                    alt={category.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition"
                  />
                </div>

                {/* CONTENT */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {category.name}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                    {category.description}
                  </p>

                  <Link
                    to={`/categories/${category.category_id}`}
                    className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition"
                  >
                    Voir plus
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

    </div>
  );
}
