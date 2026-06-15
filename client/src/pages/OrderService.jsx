import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ServiceOrder() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    customer_name: "",
    email: "",
    phone: "",
    description: "",
  });

  useEffect(() => {
    let isMounted = true;

    const fetchService = async () => {
      try {
        setLoading(true);

        const response = await fetch(`/api/services/${id}`);
        const data = await response.json();

        if (data.success && isMounted) {
          setService(data.service);
        }
      } catch (error) {
        console.error("Erreur lors du chargement du service :", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchService();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const response = await fetch("/api/demandes-services", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    service_id: service.service_id,
    customer_name: formData.customer_name,
    email: formData.email,
    phone: formData.phone,
    description: formData.description,
  }),
});

      const data = await response.json();

      if (data.success) {
        alert("Commande envoyée avec succès !");

        setFormData({
          customer_name: "",
          email: "",
          phone: "",
          description: "",
        });

        navigate("/");
      } else {
        alert(data.message || "Erreur lors de l'envoi.");
      }
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10 animate-pulse">
        <div className="h-10 w-48 rounded bg-gray-200 mb-6"></div>

        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <div className="h-64 rounded-xl bg-gray-200 mb-6"></div>
          <div className="h-8 w-1/2 rounded bg-gray-200 mb-4"></div>
          <div className="h-4 w-full rounded bg-gray-200 mb-2"></div>
          <div className="h-4 w-3/4 rounded bg-gray-200"></div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10 text-center">
        <h2 className="text-2xl font-bold text-slate-900">
          Service introuvable
        </h2>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
      >
        ← Retour
      </button>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Détails du service */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <img
            src={service.logo || "https://placehold.co/600x400"}
            alt={service.name}
            className="mb-5 h-64 w-full rounded-xl object-cover"
          />

          <h1 className="text-3xl font-bold text-slate-900">
            {service.name}
          </h1>

          <p className="mt-4 text-slate-600 leading-relaxed">
            {service.description}
          </p>

          <div className="mt-6">
            <span className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
              {service.price
                ? `${Number(service.price).toFixed(2)} $`
                : "Prix sur devis"}
            </span>
          </div>
        </div>

        {/* Formulaire */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            Commander ce service
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Nom complet
              </label>
              <input
                type="text"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Adresse email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Téléphone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Description du besoin
              </label>
              <textarea
                name="description"
                rows="5"
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
            >
              {submitting
                ? "Envoi de la commande..."
                : "Commander maintenant"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}