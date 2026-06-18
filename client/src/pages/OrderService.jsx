
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function ServiceOrder() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const initialForm = {
    customer_name: "",
    email: "",
    phone: "",
    coordinates: "",
    location: "",
    gender: "",
    other_info: "",
  };

  const [formData, setFormData] = useState(initialForm);

  // Charger le service
  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `/api/services/${id}`
        );

        const data =
          await response.json();

        if (data.success) {
          setService(data.service);
        }
      } catch (error) {
        console.error(
          "Erreur chargement service:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  // GPS automatique
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          coordinates: `${position.coords.latitude}, ${position.coords.longitude}`,
        }));
      },
      (error) => {
        console.log(
          "GPS erreur:",
          error
        );
      }
    );
  }, []);

  // Modifier formulaire
  const handleChange = (e) => {
    const { name, value } =
      e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Soumettre
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!service) return;

  try {
    setSubmitting(true);

    const payload = {
      service_id: service.service_id,

      name: formData.customer_name,
      email: formData.email,
      phone: formData.phone,
      coordinates: formData.coordinates,
      location: formData.location,
      gender: formData.gender,
      other_info: formData.other_info,
    };

    const response = await fetch("/api/demandes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.success) {
      toast.success(data.message || "Commande envoyée avec succès !");

      setFormData({
        customer_name: "",
        email: "",
        phone: "",
        coordinates: "",
        location: "",
        gender: "",
        other_info: "",
      });

      navigate("/");
    } else {
      toast.error(data.message || "Erreur d'envoi");
    }
  } catch (error) {
    console.error(error);
    toast.error("Une erreur est survenue");
  } finally {
    setSubmitting(false);
  }
};

  if (loading) {
    return (
      <div className="py-10 text-center">
        Chargement...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">

      <button
        onClick={() => navigate(-1)}
        className="mb-6 rounded border px-4 py-2"
      >
        ← Retour
      </button>

      <div className="grid gap-8 lg:grid-cols-2">

        {/* Service */}

        <div className="rounded-3xl border p-6 shadow">

           <h1 className="text-3xl font-bold">
            {service.category_name}
          </h1>

          <img
            src={
              service.logo ||
              "https://placehold.co/600x400"
            }
            alt={service.name}
            className="mb-4 h-64 w-full rounded-xl object-cover"
          />

         

          <p className="mt-4 text-gray-600">
            {service.description}
          </p>

          <div className="mt-6">

            <span className="rounded-full bg-indigo-100 px-4 py-2">

              {service.price
                ? `${Number(
                    service.price
                  ).toFixed(
                    2
                  )} $`
                : "Prix sur devis"}

            </span>

          </div>

        </div>

        {/* Formulaire */}

        <div className="rounded-3xl border p-6 shadow">

          <h2 className="mb-6 text-2xl font-bold text-gray-800">
  Commande du service : <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{service.name}</span>
</h2>


          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            <input
              type="text"
              name="customer_name"
              placeholder="Nom complet"
              value={formData.customer_name}
              onChange={handleChange}
              required
              className="w-full rounded-xl border p-3"
            />

            <input
              type="email"
              name="email"
              placeholder="Adresse email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-xl border p-3"
            />

            <input
              type="tel"
              name="phone"
              placeholder="Téléphone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full rounded-xl border p-3"
            />

            <input
              type="text"
              value={formData.coordinates}
              readOnly
              placeholder="Coordonnées GPS"
              className="w-full rounded-xl border bg-gray-100 p-3"
            />

            <input
              type="text"
              name="location"
              placeholder="Localisation"
              value={formData.location}
              onChange={handleChange}
              className="w-full rounded-xl border p-3"
            />

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full rounded-xl border p-3"
            >
              <option value="">
                Genre
              </option>

              <option value="Homme">
                Homme
              </option>

              <option value="Femme">
                Femme
              </option>

            </select>

            <textarea
              name="other_info"
              rows="4"
              placeholder="Décrivez votre besoin"
              value={formData.other_info}
              onChange={handleChange}
              className="w-full rounded-xl border p-3"
            />

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-indigo-600 py-3 text-white"
            >
              {submitting
                ? "Envoi..."
                : "Commander maintenant"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}
