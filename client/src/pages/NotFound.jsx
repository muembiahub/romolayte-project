import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="grid min-h-[65vh] place-items-center">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-12 text-center shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Page introuvable</p>
        <h1 className="mt-6 text-5xl font-bold text-slate-900">404</h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">
          La page que vous recherchez n'existe pas encore ou a été déplacée. Revenez à l'accueil pour continuer.
        </p>
        <Link to="/" className="mt-8 inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
