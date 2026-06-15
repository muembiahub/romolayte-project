import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLoading from "react-loading-skeleton";

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
    <div className="space-y-12 relative min-h-screen">

      {/* HERO */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-8 py-16 text-white shadow-xl sm:px-12">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.4),transparent_60%)]" />

        <div className="relative max-w-3xl space-y-6">
          <span className="inline-flex rounded-full bg-white/10 px-4 py-1 text-sm font-semibold text-indigo-200 ring-1 ring-white/20">
            🚀 Marketplace nouvelle génération
          </span>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Vos projets avancent plus vite avec l'équipe Romolayte.
          </h1>

          <p className="text-slate-300 text-lg">
            Accédez à un espace unique et sécurisé pour collaborer en direct avec notre équipe, en toute simplicité.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/services"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100 transition"
            >
              Découvrir les services
            </Link>

            <Link
              to="/contact"
              className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
            >
               Contacter l'équipe
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="grid gap-6 sm:grid-cols-3">
        {[
          { title: "Services", value: "120+", desc: "Offres disponibles" },
          { title: "Réponse", value: "24h", desc: "Temps moyen" },
          { title: "Satisfaction", value: "99%", desc: "Clients heureux" },
          { title: "Projets", value: "50+", desc: "Réalisés avec succès" },
          { title: "Entreprises", value: "100+", desc: "Projets en cours" },
          { title: "Équipe", value: "20+", desc: "Professionnels expérimentés" },

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
            <p className="text-slate-500">
                <DashboardLoading />
            </p>
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
                    to={`/categories/${category.category_id}/services`}
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

      {/* CONTENEUR DU BOUTON FLOTTANT (BF) WHATSAPP + INFOBULLE */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 group">
        
        {/* INFOBULLE TEXTUELLE */}
        <div className="hidden sm:block opacity-0 scale-95 translate-x-2 bg-slate-900 text-white text-xs font-medium px-4 py-2 rounded-2xl shadow-xl transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 whitespace-nowrap border border-slate-800">
          Besoin d'aide ? Échangeons sur WhatsApp !
          {/* Petite flèche pointant vers le bouton */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-44 h-2 w-2 bg-slate-900 border-t border-r border-slate-800" />
        </div>

        {/* LE BOUTON FLOTTANT */}
        <a
          href="https://wa.me/+243971211539"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-emerald-400 active:scale-95"
          title="Discuter sur WhatsApp"
        >
          <svg className="h-7 w-7 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.413 9.863-9.847.001-2.633-1.019-5.101-2.872-6.957C16.548 1.995 14.086.978 11.46.978c-5.443 0-9.866 4.414-9.869 9.851-.001 1.77.475 3.499 1.38 5.03l-.997 3.644 3.734-.979zm12.064-4.815c-.328-.164-1.94-.957-2.242-1.067-.302-.11-.522-.164-.742.164-.22.328-.85 1.067-1.041 1.286-.192.219-.384.246-.712.082-1.39-.699-2.399-1.222-3.344-2.845-.249-.427.249-.396.711-1.317.077-.154.038-.287-.019-.396-.058-.11-.522-1.258-.716-1.723-.188-.454-.38-.392-.523-.399-.135-.006-.29-.008-.445-.008-.154 0-.406.058-.619.288-.214.23-.814.795-.814 1.938 0 1.143.832 2.246.948 2.401.115.154 1.637 2.498 3.965 3.505.553.24 1.01.383 1.347.491.555.177 1.06.152 1.459.093.445-.066 1.94-.793 2.213-1.52.274-.726.274-1.35.192-1.48-.082-.13-.302-.213-.63-.377z" />
          </svg>
        </a>
      </div>

    </div>
  );
}
