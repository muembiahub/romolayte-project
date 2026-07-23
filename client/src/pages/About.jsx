import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function About() {
  const [data, setData] = useState({
    aboutPages: [],
    teamMembers: [],
    companyValues: [],
    milestones: [],
    partners: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      const res = await fetch("/api/about");
      const json = await res.json();
      setData(json.data);
      setLoading(false);
    };

    fetchAbout();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-950 text-white space-y-4">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-12 h-12 rounded-full border-4 border-blue-500/20 animate-pulse" />
          <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
        </div>
        <p className="text-sm font-medium tracking-wider text-slate-400 uppercase animate-pulse">
          Chargement...
        </p>
      </div>
    );
  }

  const hero = data.aboutPages?.[0];

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="text-white min-h-screen bg-slate-950 relative overflow-hidden">
      
      {/* FUTURISTIC BLUE GRID & AMBIENT GLOWS */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="absolute bottom-1/3 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 space-y-32">

        {/* HERO SECTION - BENTO STYLE */}
        <motion.section
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[3rem] bg-gradient-to-r from-slate-900 via-blue-950/50 to-slate-900 p-10 sm:p-16 border border-blue-500/20 shadow-[0_0_50px_rgba(30,58,138,0.2)]"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative max-w-3xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/30 px-4 py-2 text-xs sm:text-sm font-bold tracking-wide text-blue-300 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-ping" />
              {hero?.badge || "À propos de Romolayte"}
            </span>

            <h1 className="text-3xl sm:text-6xl font-black tracking-tight leading-tight text-white">
              {hero?.title}
            </h1>

            <p className="text-slate-300 text-base sm:text-lg font-light leading-relaxed max-w-2xl">
              {hero?.content}
            </p>
          </div>
        </motion.section>

        {/* VALUES - MODERN GLASS CARDS */}
        <section>
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">Principes</span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
                Nos valeurs
              </h2>
            </div>
            <p className="text-slate-400 text-sm max-w-md font-light">
              Les piliers fondamentaux qui structurent notre vision et garantissent l'excellence de nos services.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {(data.companyValues || []).map((v, i) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative overflow-hidden rounded-3xl bg-slate-900/40 border border-blue-500/10 p-8 backdrop-blur-xl hover:bg-slate-900/80 hover:border-blue-500/40 transition-all duration-300 group shadow-lg"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all" />
                <div className="relative z-10">
                  <span className="text-xs font-mono text-blue-400 font-bold">0{i + 1}.</span>
                  <h3 className="text-xl font-bold text-white mt-2 group-hover:text-blue-300 transition-colors">
                    {v.title}
                  </h3>
                  <p className="mt-3 text-slate-400 text-sm font-light leading-relaxed">
                    {v.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* TIMELINE - MODERN HORIZONTAL/VERTICAL HYBRID */}
        <section>
          <div className="mb-12">
            <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">Parcours</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
              Notre évolution
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(data.milestones || []).map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-3xl bg-slate-900/50 border border-blue-500/10 p-6 backdrop-blur-md relative overflow-hidden group hover:border-blue-500/30 transition-all"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold tracking-wider mb-4 border border-blue-500/20">
                  {m.year}
                </span>
                <p className="text-slate-200 text-base font-semibold leading-snug">
                  {m.title}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* TEAM - SLEEK MINIMAL CARDS */}
        <section>
          <div className="mb-14 text-center">
            <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">Humain & Expertise</span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mt-2">
              Notre équipe
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base font-light max-w-xl mx-auto">
              Les talents passionnés qui unissent leurs forces pour concevoir le futur de Romolayte.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {(data.teamMembers || []).map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-[2.5rem] border border-blue-500/10 bg-slate-900/40 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-blue-500/40 hover:shadow-[0_20px_40px_rgba(30,58,138,0.2)] flex flex-col"
              >
                {/* Photo container with modern framing */}
                <div className="h-80 overflow-hidden bg-slate-950 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 opacity-60" />
                  <img
                    src={t.photo_url || "https://ofhmwjzxakhgbafywxwp.supabase.co/storage/v1/object/public/defauts/equipe.webp"}
                    alt={t.name}
                    onError={(e) => {
                      e.currentTarget.src = "https://ofhmwjzxakhgbafywxwp.supabase.co/storage/v1/object/public/defauts/equipe.webp";
                    }}
                    className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-4 left-6 z-20">
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-[11px] font-semibold text-blue-300 backdrop-blur-md">
                      {t.role}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {t.name}
                    </h3>

                    {t.description && (
                      <p className="mt-3 text-sm leading-relaxed text-slate-400 font-light">
                        {t.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-8 pt-4 border-t border-blue-950 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs text-slate-400 font-medium">Actif</span>
                    </div>
                    <span className="text-xs text-blue-400/80 font-mono">Romolayte Team</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* PARTNERS - LOGO CLOUD */}
        <section className="text-center pt-10">
          <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">Écosystème</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1 mb-10">
            Nos partenaires
          </h2>

          <div className="flex flex-wrap justify-center items-center gap-10 sm:gap-16 opacity-60">
            {(data.partners || []).map((p) => (
              <img
                key={p.id}
                src={p.logo}
                alt="Partner Logo"
                className="h-9 sm:h-11 grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110"
              />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}