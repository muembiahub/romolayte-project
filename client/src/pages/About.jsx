export default function About() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-8 py-16 text-white shadow-soft sm:px-12">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-transparent" />

        <div className="relative max-w-4xl">
          <span className="inline-flex rounded-full bg-indigo-500/20 px-4 py-1 text-sm font-semibold text-indigo-200">
            À propos de Romolayte
          </span>

          <h1 className="mt-6 text-5xl font-bold tracking-tight">
            Connecter les talents aux opportunités.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Romolayte est une marketplace moderne qui facilite la mise en
            relation entre clients et prestataires de services. Notre
            plateforme simplifie la recherche, la gestion et la commande
            de services professionnels en toute sécurité.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <div className="rounded-2xl bg-white/10 px-5 py-3 backdrop-blur">
              <p className="text-2xl font-bold">100+</p>
              <p className="text-sm text-slate-300">
                Services disponibles
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 px-5 py-3 backdrop-blur">
              <p className="text-2xl font-bold">24/7</p>
              <p className="text-sm text-slate-300">
                Disponibilité
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 px-5 py-3 backdrop-blur">
              <p className="text-2xl font-bold">100%</p>
              <p className="text-sm text-slate-300">
                Digital
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="rounded-[2rem] bg-white p-10 shadow-soft">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Notre mission
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Nous croyons que trouver un prestataire qualifié ou proposer
              ses services devrait être simple, rapide et transparent.
              Romolayte met la technologie au service des professionnels
              et des particuliers afin de créer un écosystème fiable et
              performant.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900">
                🚀 Innovation
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Une plateforme moderne construite avec React et des
                technologies performantes.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900">
                🔒 Sécurité
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Protection des données et gestion sécurisée des comptes.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900">
                🤝 Confiance
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Mise en relation transparente entre clients et
                prestataires.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900">
                ⚡ Rapidité
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Trouvez ou proposez un service en quelques clics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pourquoi nous choisir */}
      <section className="rounded-[2rem] bg-slate-950 p-10 text-white shadow-soft">
        <div className="max-w-4xl">
          <h2 className="text-4xl font-bold">
            Pourquoi choisir Romolayte ?
          </h2>

          <p className="mt-4 text-lg text-slate-300">
            Une plateforme pensée pour simplifier les échanges entre
            professionnels et clients.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl bg-slate-900 p-6 ring-1 ring-white/10">
              <h3 className="font-semibold text-indigo-400">
                Services variés
              </h3>
              <p className="mt-3 text-sm text-slate-400">
                Informatique, design, maintenance, conseil et bien plus.
              </p>
            </div>

            <div className="rounded-3xl bg-slate-900 p-6 ring-1 ring-white/10">
              <h3 className="font-semibold text-indigo-400">
                Interface intuitive
              </h3>
              <p className="mt-3 text-sm text-slate-400">
                Une expérience utilisateur fluide sur ordinateur et mobile.
              </p>
            </div>

            <div className="rounded-3xl bg-slate-900 p-6 ring-1 ring-white/10">
              <h3 className="font-semibold text-indigo-400">
                Gestion centralisée
              </h3>
              <p className="mt-3 text-sm text-slate-400">
                Gérez vos commandes, demandes et prestations depuis un
                seul espace.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="rounded-[2rem] bg-gradient-to-r from-indigo-600 to-indigo-500 p-10 text-white shadow-soft">
        <h2 className="text-4xl font-bold">
          Notre vision
        </h2>

        <p className="mt-4 max-w-3xl text-lg text-indigo-100">
          Devenir la référence des marketplaces de services en Afrique en
          offrant une plateforme innovante, accessible et sécurisée qui
          favorise la croissance des professionnels et simplifie la vie
          des clients.
        </p>
      </section>
    </div>
  );
}
