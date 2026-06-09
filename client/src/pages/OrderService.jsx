
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function OrderService() {
  const { id } = useParams();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    customer_name: "",
    email: "",
    phone: "",
    description: "",
  });

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`/api/services/${id}`);
        const data = await response.json();

        if (data.success) {
          setService(data.service);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/submitServiceRequestApi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_id: id,
          ...formData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Commande envoyée avec succès !");
      } else {
        alert("Erreur lors de l'envoi.");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur serveur.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        Chargement...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Link
        to={-1}
        className="mb-6 inline-block text-indigo-600 hover:underline"
      >
        ← Retour
      </Link>

      {service && (
        <div className="mb-8 rounded-2xl bg-white p-6 shadow">
          <h1 className="text-3xl font-bold">
            Commander : {service.name}
          </h1>

          <p className="mt-2 text-gray-600">
            {service.description}
          </p>
          <div className="mt-4">
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">
                {service.price != null ? `${service.price} $` : "Pas de prix défini"}
            </span>
            </div>

        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-white p-8 shadow"
      >
        <h2 className="mb-6 text-2xl font-semibold">
          Informations du client
        </h2>

        <div className="grid gap-4">
          <input
            type="text"
            name="customer_name"
            placeholder="Nom complet"
            value={formData.customer_name}
            onChange={handleChange}
            required
            className="rounded-lg border p-3"
          />

          <input
            type="email"
            name="email"
            placeholder="Adresse email"
            value={formData.email}
            onChange={handleChange}
            required
            className="rounded-lg border p-3"
          />

          <input
            type="tel"
            name="phone"
            placeholder="Téléphone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="rounded-lg border p-3"
          />

          <textarea
            name="description"
            rows="5"
            placeholder="Décrivez votre besoin..."
            value={formData.description}
            onChange={handleChange}
            required
            className="rounded-lg border p-3"
          />

          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-500"
          >
            Envoyer la commande
          </button>
        </div>
      </form>
    </div>
  );
}