import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {useAuth} from "../hooks/UseAuth"

const initialLoginForm = {
  usernameOrEmail: "",
  password: ""
};

const initialSignupForm = {
  firstname: "",
  lastname: "",
  username: "",
  email: "",
  phone: "",
  birthday: "",
  password: "",
  confirmPassword: "",
  role_id: "",       // UUID d’un rôle existant
  category_id: "",   // INTEGER d’une catégorie existante
  service_id: ""     // INTEGER d’un service existant
};

export default function Auth() {
  const [mode, setMode] = useState("login");
  const { login } = useAuth();
 const [selectedCategory, setSelectedCategory] =
    useState("");

  const [selectedService, setSelectedService] =
    useState("");

  const [categories, setCategories] =
    useState([]);

  const [services, setServices] =
    useState([]);

  const [form, setForm] = useState(initialLoginForm);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  // charger category au montage

 useEffect(() => {
  const loadCategories = async () => {
    try {
      const res = await fetch("/api/categories");

      if (!res.ok) {
        throw new Error(
          `HTTP error: ${res.status}`
        );
      }

      const data = await res.json();

      setCategories(
        Array.isArray(data?.categories)
          ? data.categories
          : Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {
      console.error(
        "Erreur catégories:",
        err
      );

      setError(
        "❌ Erreur lors du chargement des catégories"
      );
    }
  };

  loadCategories();

}, []);



useEffect(() => {
  if (!selectedCategory) {
    setServices([]);
    return;
  }

  fetch(
    `/api/categories/${selectedCategory}/services`
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error(
          `HTTP ${res.status}`
        );
      }

      return res.json();
    })
    .then((data) => {
      setServices(
        Array.isArray(
          data?.services
        )
          ? data.services
          : data
      );
    })
    .catch((err) => {
      console.error(
        "Erreur services:",
        err
      );

      setError(
        "❌ Impossible de charger les services"
      );
    });

}, [selectedCategory]);

const handleSubmit = async (event) => {
  event.preventDefault();

  if (isSubmitting) return;

  setError(null);

  // Validation de sécurité initiale pour l'inscription
  if (mode === "signup" && form.password !== form.confirmPassword) {
    const errorMsg = "Les mots de passe ne rencontrent pas la validation de correspondance.";
    setError(errorMsg);
    toast.error(errorMsg);
    return;
  }

  setIsSubmitting(true);

  // Alignement sur vos routes de contrôleur Express (/auth/login et /auth/register)
  const endpoint = mode === "login"
    ? "/login"
    : "/signup";

  // Préparation des données d'envoi
  let payload;
  if (mode === "login") {
    payload = {
      email: form.usernameOrEmail,
      password: form.password,
    };
  } else {
    // On extrait confirmPassword pour ne pas l'envoyer inutilement à l'API
    const { confirmPassword, ...restOfForm } = form;
    payload = restOfForm;
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      const message =
        data.message ||
        (mode === "login"
          ? "Erreur de connexion."
          : "Erreur d'inscription.");

      setError(message);
      toast.error(message);
      return;
    }

    toast.success(
      mode === "login"
        ? "Connexion réussie 🎉"
        : "Compte créé avec succès 🎉"
    );

    if (mode === "login") {
      // data.token correspond à session.access_token et data.user à l'objet utilisateur
      login(data.token, data.user);
      navigate("/dashboard");
    } else {
      // Après une inscription réussie, on bascule l'utilisateur sur l'écran de connexion
      setMode("login");
      setForm(initialLoginForm);
    }

  } catch (err) {
    const message = "Impossible de contacter le serveur de service.";
    setError(message);
    toast.error(message);
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
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
              {mode === "login" ? "Connexion" : "Inscription"}
            </p>
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

             <label className="space-y-2 text-sm text-slate-700 flex flex-col">
  <span>Catégorie</span>

  <select
    value={selectedCategory}
    onChange={(e) => {
  const value = e.target.value;

  setSelectedCategory(value);

  setForm((current) => ({
    ...current,
    category_id: value,
    service_id: "" // réinitialise service
  }));
}}
    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
  ><option value="">
            -- Choisir une catégorie --
          </option>

          {categories.map((cat) => (
            <option
              key={cat.category_id}
              value={cat.category_id}
            >
              {cat.name}
            </option>
    ))}
  </select>
</label>
{/* service */}
<label className="space-y-2 text-sm text-slate-700 flex flex-col">
  <span>Service</span>

  <select
    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          value={selectedService}
         onChange={(e) => {
  const value = e.target.value;

  setSelectedService(value);

  setForm((current) => ({
    ...current,
    service_id: value
  }));
}}
          disabled={!selectedCategory}
        >
          <option value="">
            -- Choisir un service --
          </option>

          {services.map((service) => (
            <option
              key={service.service_id}
              value={service.service_id}
            >
              {service.name}
            </option>
          ))}
        </select>
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

          {mode === "signup" && (
            <>
              <label className="space-y-2 text-sm text-slate-700">
                Téléphone
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  placeholder="+243..."
                />
              </label>

              <label className="space-y-2 text-sm text-slate-700">
                Date de naissance
                <input
                  name="birthday"
                  type="date"
                  value={form.birthday}
                  onChange={handleChange}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </label>
            </>
          )}

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
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
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
            <p className="mt-3 text-sm text-slate-300">
              Connexion sécurisée avec Supabase Authentication et sessions serveur.
            </p>
          </div>
          <div className="rounded-3xl bg-white/5 p-5 text-slate-100 ring-1 ring-white/10">
            <p className="text-sm uppercase tracking-[0.2em] text-indigo-300">Dashboard protégé</p>
            <p className="mt-3 text-sm text-slate-300">
              Accès réservé aux utilisateurs connectés uniquement.
            </p>
          </div>
          <div className="rounded-3xl bg-white/5 p-5 text-slate-100 ring-1 ring-white/10">
            <p className="text-sm uppercase tracking-[0.2em] text-indigo-300">Rapide</p>
            <p className="mt-3 text-sm text-slate-300">
              Une interface React légère et réactive pour gérer vos services.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
