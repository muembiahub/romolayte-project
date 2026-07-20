import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/auth/me", {
      credentials: "include",
      signal: controller.signal
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("unauthorized");
        }
        const data = await response.json();
        if (data.success) {
          setStatus("authorized");
        } else {
          setStatus("unauthorized");
        }
      })
      .catch(() => setStatus("unauthorized"));

    return () => controller.abort();
  }, []);

  if (status === "pending") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-3xl bg-white p-8 text-center shadow-soft">
          <p className="text-base font-medium text-slate-900">Vérification de la session...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthorized") {
    return <Navigate to="/auth" replace />;
  }

  return children;
}
