import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login?confirmed=true", {
        replace: true,
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-6">
      <div className="w-full max-w-lg rounded-3xl bg-white p-10 text-center shadow-2xl">

        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-14 w-14 text-emerald-600" />
        </div>

        <h1 className="mt-8 text-3xl font-bold text-slate-900">
          Adresse e-mail confirmée
        </h1>

        <p className="mt-4 leading-7 text-slate-600">
          Félicitations !
          <br />
          Votre adresse e-mail a été vérifiée avec succès.
        </p>

        <p className="mt-3 text-slate-500">
          Vous allez être redirigé automatiquement vers la page de connexion.
        </p>

        <div className="mt-8 flex justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
        </div>

        <p className="mt-4 text-sm text-slate-400">
          Redirection en cours...
        </p>
      </div>
    </div>
  );
}