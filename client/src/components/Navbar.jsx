import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/UseAuth"

const navigation = [
  { label: "Accueil", path: "/" },
  { label: "Services", path: "/services" },
  { label: "À propos", path: "/about" },
];

export default function Navbar() {
  const { user, logout, role, isPrivileged, loading } = useAuth();
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Évite le flash visuel des boutons de connexion avant que l'état d'authentification soit résolu
  if (loading) {
    return (
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10">
            <div className="h-8 w-32 animate-pulse bg-slate-200 rounded-full" />
            <div className="hidden md:flex gap-6">
              <div className="h-4 w-16 animate-pulse bg-slate-200 rounded" />
              <div className="h-4 w-16 animate-pulse bg-slate-200 rounded" />
              <div className="h-4 w-16 animate-pulse bg-slate-200 rounded" />
            </div>
            <div className="h-8 w-24 animate-pulse bg-slate-200 rounded-full" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">

          {/* Logo de la marque Romolayte */}
          <Link to="/" className="flex items-center gap-3 transition hover:opacity-90">
            <img
              src="https://ofhmwjzxakhgbafywxwp.supabase.co/storage/v1/object/public/logos_category/romo_logo.jpg"
              alt="Romolayte"
              className="h-9 w-9 rounded-xl object-cover shadow-sm"
            />
            <span className="font-extrabold text-xl tracking-tight text-slate-900">Romolayte</span>
          </Link>

          {/* Navigation pour écrans ordinateurs */}
          <nav className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `text-sm font-semibold transition-colors duration-150 ${
                    isActive
                      ? "text-indigo-600"
                      : "text-slate-500 hover:text-slate-900"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Zone de Recherche globale */}
          <div className="hidden lg:flex flex-1 max-w-xs">
            <input
              type="text"
              placeholder="Rechercher un service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Menu d'authentification utilisateur */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <Link
                to="/login"
                className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Connexion
              </Link>
            ) : (
              <>
                <Link
                  to={isPrivileged ? "/dashboard" : "/dashboard"}
                  className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 shadow-sm"
                >
                  {isPrivileged ? "Dashboard" : "Mon espace"}
                </Link>

                 <Link 
      to="/profile"
      className="rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-rose-50 hover:text-rose-600 capitalize"
    >
      {/* 
        Si l'utilisateur est admin/superadmin, on affiche son rôle avec une majuscule (grâce à la classe Tailwind 'capitalize').
        Sinon, on affiche "Mon profil".
      */}
      {isPrivileged ? `Role: ${role}` : "Mon profil"}
    </Link>

                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-rose-50 hover:text-rose-600"
                >
                  Déconnexion
                </button>
              </>
            )}
          </div>

          {/* Bouton Menu Toggle (Mobile) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-700 hover:bg-slate-50 rounded-xl transition text-xl focus:outline-none"
            aria-label="Menu de navigation"
          >
            {isOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Menu déroulant responsive (Mobile) */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white p-4 space-y-4 animate-fadeIn">
          <nav className="flex flex-col gap-3">
            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block text-base font-medium py-2 px-3 rounded-xl transition ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-3">
            {!user ? (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white block"
              >
                Connexion
              </Link>
            ) : (
              <>
                <Link
                  to={isPrivileged ? "/dashboard" : "/dashboard"}
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white block"
                >
                  {isPrivileged ? "Dashboard" : "Mon espace"}
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                    navigate("/login");
                  }}
                  className="w-full text-center rounded-xl bg-slate-100 py-3 text-sm font-semibold text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition"
                >
                  Déconnexion
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
