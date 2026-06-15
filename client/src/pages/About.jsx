import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DashboardSkeleton from "../components/DashboardSkeleton";

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
      <div className="h-screen flex items-center justify-center bg-slate-950 text-white">
        <DashboardSkeleton/>
      </div>
    );
  }

  const hero = data.aboutPages?.[0];

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen">

      <div className="max-w-6xl mx-auto px-6 py-16 space-y-28">

        {/* HERO STRIPE STYLE */}
        <motion.section
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 p-14 shadow-2xl"
        >
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_white,_transparent_60%)]" />

          <div className="relative max-w-3xl">
            <span className="inline-flex rounded-full bg-white/10 px-4 py-1 text-sm backdrop-blur">
              {hero?.badge || "About Romolayte"}
            </span>

            <h1 className="mt-6 text-5xl font-bold tracking-tight leading-tight">
              {hero?.title}
            </h1>

            <p className="mt-4 text-white/80 text-lg">
              {hero?.content}
            </p>
          </div>
        </motion.section>

        {/* VALUES STRIPE CARDS */}
        <section>
          <h2 className="text-2xl font-semibold mb-10">
            Nos valeurs
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {(data.companyValues || []).map((v, i) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur hover:bg-white/10 transition"
              >
                <h3 className="text-lg font-semibold text-indigo-300">
                  {v.title}
                </h3>
                <p className="mt-2 text-white/70">
                  {v.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* TIMELINE STRIPE */}
        <section>
          <h2 className="text-2xl font-semibold mb-10">
            Notre évolution
          </h2>

          <div className="relative border-l border-white/10 pl-6 space-y-10">
            {(data.milestones || []).map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="absolute -left-[10px] top-1 h-3 w-3 rounded-full bg-indigo-500 shadow-lg" />

                <p className="text-indigo-400 font-semibold">
                  {m.year}
                </p>

                <p className="text-white/70 mt-1">
                  {m.title}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

       {/* TEAM STRIPE CARDS */}
<section>
  <div className="mb-10 text-center">
    <h2 className="text-3xl font-bold text-white">
      Notre équipe
    </h2>

    <p className="mt-3 text-white/60">
      Les personnes qui construisent et développent Romolayte.
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
        className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-indigo-500/30 hover:bg-white/10 hover:shadow-2xl"
      >
        {/* Photo */}
        <div className="h-72 overflow-hidden">
         <img
  src={t.photo_url || "https://ofhmwjzxakhgbafywxwp.supabase.co/storage/v1/object/public/defauts/equipe.webp"}
  alt={t.name}
  onError={(e) => {
    e.currentTarget.src = "https://ofhmwjzxakhgbafywxwp.supabase.co/storage/v1/object/public/defauts/equipe.webp";
  }}
  className="h-full w-full object-cover object-top transition-transform duration-500 hover:scale-105"
/>
          {/*  defaut image ? */}
        
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-white">
            {t.name}
          </h3>

          <p className="mt-1 text-sm font-medium text-indigo-300">
            {t.role}
          </p>

          {t.description && (
            <p className="mt-4 text-sm leading-6 text-white/60">
              {t.description}
            </p>
          )}

          <div className="mt-6 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
            <span className="text-xs text-white/50">
              Membre de l'équipe Romolayte
            </span>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
</section>

        {/* PARTNERS */}
        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-10">
            Nos partenaires
          </h2>

          <div className="flex flex-wrap justify-center gap-10 opacity-70">
            {(data.partners || []).map((p) => (
              <img
                key={p.id}
                src={p.logo}
                className="h-10 grayscale hover:grayscale-0 transition hover:scale-105"
              />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}