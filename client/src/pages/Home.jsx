import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLoading from "react-loading-skeleton";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <div className="space-y-8 md:space-y-12 relative min-h-screen bg-slate-50" style={{ fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', sans-serif" }}>

      {/* HERO SECTION WITH DEPTH EFFECT */}
      <section className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] min-h-[500px] overflow-hidden rounded-2xl sm:rounded-3xl md:rounded-[3rem] mx-3 sm:mx-4 md:mx-8 mt-4 sm:mt-6 shadow-xl md:shadow-2xl group">
        
        {/* BACKGROUND LAYER (Parallax) */}
        <div 
          className="absolute inset-0 z-0 transition-transform duration-300 ease-out scale-110"
          style={{
            backgroundImage: `url('https://ofhmwjzxakhgbafywxwp.supabase.co/storage/v1/object/public/profile/romolayte_hero_bg.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translateY(${scrollY * 0.2}px) scale(1.1)`,
          }}
        />

        {/* OVERLAY LAYERS FOR DEPTH */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-950/85 via-slate-950/50 to-slate-950/20" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
        
        {/* DECORATIVE ELEMENTS (Floating) */}
        <div 
          className="absolute top-1/4 right-1/4 w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 bg-indigo-500/20 rounded-full blur-[80px] sm:blur-[100px] z-10 animate-pulse"
          style={{ transform: `translateY(${scrollY * -0.1}px)` }}
        />
        <div 
          className="absolute bottom-1/4 left-1/3 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-blue-500/10 rounded-full blur-[100px] sm:blur-[120px] z-10"
          style={{ transform: `translateY(${scrollY * 0.15}px)` }}
        />

        {/* CONTENT LAYER */}
        <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 flex flex-col justify-center items-start text-white">
          <div 
            className="max-w-2xl sm:max-w-3xl space-y-4 sm:space-y-6 md:space-y-8 transition-all duration-700"
            style={{ transform: `translateY(${scrollY * -0.05}px)` }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-indigo-200 ring-1 ring-white/20 shadow-lg">
              <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
              🚀 Marketplace nouvelle génération
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Vos projets avancent <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-300">
                plus vite
              </span> avec Romolayte.
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-200 leading-relaxed max-w-xl font-light">
              Accédez à un espace unique et sécurisé pour collaborer en direct avec notre équipe d'experts, en toute simplicité.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-2 sm:pt-4">
              <Link
                to="/services"
                className="group/btn relative overflow-hidden rounded-xl sm:rounded-2xl bg-white px-5 sm:px-8 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base font-bold text-slate-900 shadow-lg md:shadow-xl transition-all hover:scale-105 active:scale-95 text-center"
              >
                <span className="relative z-10">Découvrir les services</span>
                <div className="absolute inset-0 bg-indigo-50 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-300" />
              </Link>

              <Link
                to="/contact"
                className="rounded-xl sm:rounded-2xl border border-white/30 bg-white/5 backdrop-blur-md px-5 sm:px-8 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base font-bold text-white shadow-lg transition-all hover:bg-white/10 hover:border-white/50 active:scale-95 text-center"
              >
                Contacter l'équipe
              </Link>
            </div>
          </div>
        </div>

        {/* SCROLL INDICATOR */}
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce opacity-50">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="px-3 sm:px-4 md:px-8">
        <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {[
            { title: "Services", value: "120+", desc: "Offres disponibles", color: "text-indigo-600" },
            { title: "Réponse", value: "24h", desc: "Temps moyen", color: "text-blue-600" },
            { title: "Satisfaction", value: "99%", desc: "Clients heureux", color: "text-emerald-600" },
            { title: "Projets", value: "50+", desc: "Réalisés avec succès", color: "text-violet-600" },
            { title: "Entreprises", value: "100+", desc: "Projets en cours", color: "text-sky-600" },
            { title: "Équipe", value: "20+", desc: "Professionnels", color: "text-rose-600" },
          ].map((item, i) => (
            <div
              key={i}
              className="group rounded-2xl md:rounded-[2rem] bg-white p-5 sm:p-6 md:p-8 shadow-sm border border-slate-100 hover:shadow-lg md:hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <p className={`text-xs uppercase tracking-[0.15em] font-bold ${item.color}`}>
                {item.title}
              </p>
              <p className="mt-3 sm:mt-4 text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 group-hover:scale-110 transition-transform origin-left">
                {item.value}
              </p>
              <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate-500 font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="mx-3 sm:mx-4 md:mx-8 rounded-2xl sm:rounded-3xl md:rounded-[3rem] bg-white p-6 sm:p-8 md:p-10 lg:p-16 shadow-sm border border-slate-50">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 sm:gap-6 mb-8 md:mb-12">
          <div className="space-y-1.5 sm:space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Catégories
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-slate-500 font-light">
              Explorez nos services disponibles pour vos projets
            </p>
          </div>

          <div className="px-4 sm:px-6 py-1.5 sm:py-2 rounded-full bg-slate-100 text-xs sm:text-sm font-bold text-slate-600 border border-slate-200 whitespace-nowrap">
            {loading ? "Chargement..." : `${categories.length} catégories`}
          </div>
        </div>

        {/* GRID */}
        <div className="grid gap-5 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full">
                <DashboardLoading count={3} height={300} />
            </div>
          ) : categories.length === 0 ? (
            <div className="col-span-full py-16 sm:py-20 text-center">
              <p className="text-slate-400 text-base sm:text-lg md:text-xl font-medium">Aucune catégorie trouvée.</p>
            </div>
          ) : (
            categories.map((category) => (
              <Link
                key={category.category_id}
                to={`/categories/${category.category_id}/services`}
                className="group relative overflow-hidden rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 bg-white shadow-sm hover:shadow-xl md:hover:shadow-2xl transition-all duration-500 flex flex-col h-full no-underline text-decoration-none"
              >
                {/* IMAGE */}
                <div className="h-40 sm:h-48 md:h-56 overflow-hidden bg-slate-100">
                  <img
                    src={category.logo}
                    alt={category.name}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                {/* CONTENT */}
                <div className="p-5 sm:p-6 md:p-8 flex flex-col flex-grow">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {category.name}
                  </h3>

                  <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base text-slate-500 leading-relaxed line-clamp-2 font-light flex-grow">
                    {category.description}
                  </p>

                  <div className="mt-6 sm:mt-8 w-full flex items-center justify-center rounded-xl sm:rounded-2xl bg-indigo-600 px-4 sm:px-6 py-2.5 sm:py-3 md:py-4 text-xs sm:text-sm md:text-base font-bold text-white hover:bg-indigo-500 shadow-md md:shadow-lg hover:shadow-indigo-200 transition-all duration-300">
                    Voir plus
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* WHATSAPP FLOATING BUTTON */}
      <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 flex items-center gap-3 sm:gap-4 group">
        
        <div className="hidden sm:block opacity-0 scale-95 translate-x-4 bg-slate-900 text-white text-xs sm:text-sm font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 whitespace-nowrap border border-slate-800">
          Besoin d'aide ? Échangeons sur WhatsApp !
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45 h-2.5 w-2.5 sm:h-3 sm:w-3 bg-slate-900 border-t border-r border-slate-800" />
        </div>

        <a
          href="https://wa.me/+243971211539"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg sm:shadow-[0_20px_50px_rgba(16,185,129,0.3)] transition-all duration-500 hover:scale-110 hover:rotate-12 hover:bg-emerald-400 active:scale-95 flex-shrink-0"
          title="Discuter sur WhatsApp"
        >
          <svg className="h-7 w-7 sm:h-8 sm:w-8 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.413 9.863-9.847.001-2.633-1.019-5.101-2.872-6.957C16.548 1.995 14.086.978 11.46.978c-5.443 0-9.866 4.414-9.869 9.851-.001 1.77.475 3.499 1.38 5.03l-.997 3.644 3.734-.979zm12.064-4.815c-.328-.164-1.94-.957-2.242-1.067-.302-.11-.522-.164-.742.164-.22.328-.85 1.067-1.041 1.286-.192.219-.384.246-.712.082-1.39-.699-2.399-1.222-3.344-2.845-.249-.427.249-.396.711-1.317.077-.154.038-.287-.019-.396-.058-.11-.522-1.258-.716-1.723-.188-.454-.38-.392-.523-.399-.135-.006-.29-.008-.445-.008-.154 0-.406.058-.619.288-.214.23-.814.795-.814 1.938 0 1.143.832 2.246.948 2.401.115.154 1.637 2.498 3.965 3.505.553.24 1.01.383 1.347.491.555.177 1.06.152 1.459.093.445-.066 1.94-.793 2.213-1.52.274-.726.274-1.35.192-1.48-.082-.13-.302-.213-.63-.377z" />
          </svg>
        </a>
      </div>

    </div>
  );
}
