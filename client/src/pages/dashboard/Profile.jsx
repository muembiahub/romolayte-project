import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/UseAuth";

export default function Profile() {
  const { user, logout, loading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    const loadProfile = async () => {
      try {
        setFetching(true);
        setError("");

        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(`/dashboard/profile/${user.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        // PROTECTION : Vérifie si la réponse est bien du JSON et non du HTML (erreur 500/404)
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error(`Le serveur a renvoyé du HTML au lieu de JSON (Statut: ${response.status}). Vérifiez vos routes Express.`);
        }

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Impossible de charger le profil");
        }

        setProfile(data.data);
      } catch (err) {
        if (err.name === "AbortError") return;
        setError(err.message || "Erreur de chargement du profil");
        console.error("Profile fetch error:", err);
      } finally {
        setFetching(false);
      }
    };

    loadProfile();

    return () => controller.abort();
  }, [navigate]);

  // Fusion sécurisée des états utilisateur
  const currentUser = profile || user || null;
  const currentLoading = loading || fetching;

  // Sécurisation du calcul du rôle (Évite l'erreur #310)
  const roleName = useMemo(() => {
    if (!currentUser?.roles?.name) return "utilisateur";
    return currentUser.roles.name.toLowerCase();
  }, [currentUser]);

  // Sécurisation du nom d'affichage
  const displayName = useMemo(() => {
    if (!currentUser) return "Utilisateur";
    if (currentUser.firstname || currentUser.lastname) {
      return `${currentUser.firstname || ""} ${currentUser.lastname || ""}`.trim();
    }
    if (currentUser.full_name) {
      return currentUser.full_name;
    }
    return currentUser.username || currentUser.email || "Utilisateur";
  }, [currentUser]);

  if (currentLoading) {
    return (
      <div className="flex h-[calc(100vh-120px)] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="space-y-4 max-w-2xl mx-auto mt-10">
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-rose-700">
          <h1 className="text-2xl font-semibold">Profil introuvable</h1>
          <p className="mt-2 text-sm text-rose-700/80">
            {error || "Vous devez vous reconnecter pour afficher vos informations."}
          </p>
        </div>
        <button
          onClick={() => navigate("/login")}
          className="w-full rounded-2xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700"
        >
          Aller à la page de connexion
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* En-tête Profil */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
              Mon profil
            </p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900">{displayName}</h1>
            <p className="mt-2 text-sm text-slate-500">
              Rôle : {roleName === "superadmin" ? "Super administrateur" : roleName === "admin" ? "Administrateur" : {roleName}}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
            >
              Retour au dashboard
            </button>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Affichage alerte si le fetch a échoué mais qu'on a le user du contexte */}
      {error && (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
          <p className="font-semibold">⚠️ Attention : Mode dégradé</p>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      )}

      {/* Grille d'informations */}
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Informations personnelles</h2>
          <div className="mt-6 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <ProfileField label="Nom complet" value={displayName} />
              <ProfileField label="Nom d'utilisateur" value={currentUser.username || "-"} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <ProfileField label="Email" value={currentUser.email || "-"} required />
              <ProfileField label="Téléphone" value={currentUser.phone || "-"} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <ProfileField label="Date de naissance" value={currentUser.birthday || "-"} />
              <ProfileField label="Statut" value={currentUser.is_active ? "Actif" : "Inactif"} />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Détails du compte</h2>
          <ul className="mt-6 space-y-4">
            <AccountDetail label="ID utilisateur" value={currentUser.user_id || currentUser.uid || currentUser.id || "-"} />
            <AccountDetail label="Rôle" value={roleName} />
            <AccountDetail label="Date de création" value={currentUser.created_at ? new Date(currentUser.created_at).toLocaleDateString("fr-FR") : "-"} />
            <AccountDetail label="Dernière connexion" value={currentUser.updated_at ? new Date(currentUser.updated_at).toLocaleDateString("fr-FR") : "-"} />
          </ul>
        </section>
      </div>
    </div>
  );
}

function ProfileField({ label, value, required }) {
  return (
    <div className="rounded-3xl bg-slate-50 p-5">
      <p className={`text-sm font-medium text-slate-500 ${required ? "after:content-['_*'] after:text-red-500" : ""}`}>
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function AccountDetail({ label, value }) {
  return (
    <li className="flex items-center justify-between rounded-3xl bg-slate-50 px-5 py-4 text-sm text-slate-700">
      <span>{label}</span>
      <span className="font-semibold text-slate-900">{value}</span>
    </li>
  );
}
