import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import OrderCard from "../../components/OrderCard";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/dashboard/allorders", {
          credentials: "include",
        });

       if (!res.ok) {
  const data = await res.json();

  if (res.status === 401) {
    toast.error(data.message || "Non authentifié");
    navigate("/login");
    return;
  }

  throw new Error(data.message);
}

        const data = await res.json();

        if (!data.success) {
          throw new Error(data.message || "Erreur API");
        }

        setOrders(Array.isArray(data.orders) ? data.orders : []);

      } catch (err) {
        console.error(err);
        setError(err.message || "Erreur inconnue");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">
          Toutes les demandes
        </h1>

        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          ← Retour dashboard
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-3 text-slate-600">
            Chargement des demandes...
          </p>
        </div>
      ) : (
        <>
          {/* COUNT */}
          <div className="text-sm text-slate-600">
            {orders.length} demandes trouvées
          </div>

          {/* LIST */}
          {orders.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-10 text-center text-slate-500">
              Aucune demande disponible
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <OrderCard
                  key={order.demande_id}
                  order={order}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}