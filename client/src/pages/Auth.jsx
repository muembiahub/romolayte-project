import { useState } from "react";
import { useNavigate } from "react-router-dom";

const initialLoginForm = {
  usernameOrEmail: "",
  password: ""
};

const initialSignupForm = {
  firstname: "",
  lastname: "",
  username: "",
  email: "",
  password: "",
  confirm_password: ""
};

export default function Auth() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(initialLoginForm);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
    const payload = mode === "login" ? form : form;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!data.success) {
        setError(data.message || "Erreur d'authentification.");
        return;
      }

      navigate(data.redirect || "/dashboard");
    } catch (err) {
      setError("Impossible de contacter le serveur. Réessaie plus tard.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="rounded-[2rem] bg-white p-8 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">{mode === "login" ? "Connexion" : "Inscription"}</p>
            <h1 className="mt-4 text-3xl font-bold text-slate-900">
              {mode === "login" ? "Accédez à votre compte" : "Créez votre compte"}
            </h1>
          </div>
          <button
            type="button"
            onClick={() => {
              const nextMode = mode === "login" ? "signup" : "login";
              setMode(nextMode);
              setError(null);
              setForm(nextMode === "login" ? initialLoginForm : initialSignupForm);
            }}
            className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            {mode === "login" ? "Créer un compte" : "J'ai déjà un compte"}
          </button>
        </div>

        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
          {mode === "login"
            ? "Connectez-vous pour gérer les demandes de services et voir vos missions."
            : "Inscrivez-vous pour commencer à gérer les demandes et accéder au dashboard."}
        </p>

        {error && (
          <div className="mt-6 rounded-3xl bg-rose-50 p-4 text-rose-700 shadow-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {mode === "signup" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-700">
                Prénom
                <input
                  name="firstname"
                  value={form.firstname}
                  onChange={handleChange}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  placeholder="Prénom"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                Nom
                <input
                  name="lastname"
                  value={form.lastname}
                  onChange={handleChange}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  placeholder="Nom"
                />
              </label>
            </div>
          )}

          {mode === "signup" && (
            <label className="space-y-2 text-sm text-slate-700">
              Nom d'utilisateur
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                placeholder="Votre pseudo"
              />
            </label>
          )}

          <label className="space-y-2 text-sm text-slate-700">
            {mode === "login" ? "Email ou pseudo" : "Adresse email"}
            <input
              name={mode === "login" ? "usernameOrEmail" : "email"}
              type={mode === "login" ? "text" : "email"}
              value={mode === "login" ? form.usernameOrEmail : form.email}
              onChange={handleChange}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder={mode === "login" ? "Email ou pseudo" : "email@exemple.com"}
            />
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            Mot de passe
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="••••••••"
            />
          </label>

          {mode === "signup" && (
            <label className="space-y-2 text-sm text-slate-700">
              Confirmer le mot de passe
              <input
                name="confirm_password"
                type="password"
                value={form.confirm_password}
                onChange={handleChange}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                placeholder="Confirmez le mot de passe"
              />
            </label>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/10 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? mode === "login"
                ? "Connexion..."
                : "Inscription..."
              : mode === "login"
              ? "Se connecter"
              : "Créer mon compte"}
          </button>
        </form>
      </section>

      <section className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-soft">
        <h2 className="text-3xl font-semibold">Pourquoi Romolayte ?</h2>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          Gagnez en visibilité, connectez vos demandes aux meilleurs prestataires et gérez toutes vos missions depuis un dashboard simple et moderne.
        </p>

        <div className="mt-10 space-y-4">
          <div className="rounded-3xl bg-white/5 p-5 text-slate-100 ring-1 ring-white/10">
            <p className="text-sm uppercase tracking-[0.2em] text-indigo-300">Sécurité</p>
            <p className="mt-3 text-sm text-slate-300">Connexion sécurisée avec Firebase Authentication et sessions serveur.</p>
          </div>
          <div className="rounded-3xl bg-white/5 p-5 text-slate-100 ring-1 ring-white/10">
            <p className="text-sm uppercase tracking-[0.2em] text-indigo-300">Dashboard protégé</p>
            <p className="mt-3 text-sm text-slate-300">Accès réservé aux utilisateurs connectés uniquement.</p>
          </div>
          <div className="rounded-3xl bg-white/5 p-5 text-slate-100 ring-1 ring-white/10">
            <p className="text-sm uppercase tracking-[0.2em] text-indigo-300">Rapide</p>
            <p className="mt-3 text-sm text-slate-300">Une interface React légère et réactive pour gérer vos services.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
