import { Link, NavLink } from "react-router-dom";

const navigation = [
  { label: "Accueil", path: "/" },
  { label: "Services", path: "/services" },
  { label: "À propos", path: "/about" },
  { label: "Contact", path: "/contact" },
];

export default function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
  to="/"
  className="flex items-center gap-2 text-xl font-semibold tracking-tight text-slate-900"
>
  <img
    src="https://ofhmwjzxakhgbafywxwp.supabase.co/storage/v1/object/public/logos_category/romo_logo.jpg"
    alt="Romolayte"
    className="h-9 w-9 rounded-lg object-cover shadow-sm"
  />

  <span className="font-bold text-slate-900">
    Romolayte
  </span>
</Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `text-sm font-medium ${isActive ? "text-slate-900" : "text-slate-500 hover:text-slate-900"}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <Link
          to="/auth"
          className="inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-700"
        >
          Connexion
        </Link>
      </div>
    </header>
  );
}
