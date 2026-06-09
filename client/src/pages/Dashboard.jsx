import { useEffect, useState } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/dashboard/stats", { credentials: "include" })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setStats(data.stats);
        } else {
          setError(data.message || "Impossible de charger les statistiques.");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-10">
      <section className="rounded-[2rem] bg-white p-8 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Tableau de bord</p>
            <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">Vue d'ensemble</h1>
          </div>
          <button className="inline-flex items-center rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/10 hover:bg-indigo-500">
            Créer une nouvelle mission
          </button>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
          Contrôlez rapidement l'état de la plateforme, les missions et les demandes clients.
        </p>
      </section>

      {error && (
        <div className="rounded-3xl bg-rose-50 p-6 text-rose-700 shadow-soft">{error}</div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full rounded-[2rem] bg-white p-8 shadow-soft text-center">Chargement des statistiques…</div>
        ) : (
          [
            { title: "Utilisateurs actifs", value: stats.usersCount },
            { title: "Demandes reçues", value: stats.demandesCount },
            { title: "Missions en cours", value: "8" }
          ].map((widget) => (
            <div key={widget.title} className="rounded-[2rem] bg-slate-900 p-8 text-white shadow-soft">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-300">{widget.title}</p>
              <p className="mt-6 text-4xl font-semibold">{widget.value}</p>
            </div>
          ))
        )}
      </div>

      <section className="rounded-[2rem] bg-white p-8 shadow-soft">
        <h2 className="text-2xl font-semibold text-slate-900">Dernières demandes</h2>
        <div className="mt-6 space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="rounded-3xl border border-slate-200 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Demande #{120 + item}</p>
                  <p className="text-sm text-slate-500">Service web — Paris</p>
                </div>
                <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                  En cours
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
