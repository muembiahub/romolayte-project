import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardSkeleton from "../components/DashboardSkeleton";

export default function OrderService() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [isCityReadOnly, setIsCityReadOnly] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    phone: "",
    email: "",
    city: "",
    location: "",
  });

  useEffect(() => {
    let isMounted = true;
    const fetchService = async () => {
      try {
        const response = await fetch(`/api/services/${id}`);
        const data = await response.json();

        if (data.success && isMounted) {
          setService(data.service);
          console.log("🔍 Loaded Service Schema:", data.service);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchService();
    return () => { isMounted = false; };
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (errorMessage) setErrorMessage("");
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }

    setGeoLoading(true);
    setErrorMessage("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const coordinatesString = `${latitude.toFixed(6)},${longitude.toFixed(6)}`;
        
        setFormData((prev) => ({
          ...prev,
          location: coordinatesString,
        }));

        try {
          const backendGeoResponse = await fetch(`/api/get-city?lat=${latitude}&lon=${longitude}`);
          const geoData = await backendGeoResponse.json();
          
          if (geoData.success && geoData.city) {
            setFormData((prev) => ({
              ...prev,
              city: geoData.city,
            }));
            setIsCityReadOnly(true);
          } else {
            setErrorMessage("Position GPS acquise ! Ville non détectée, veuillez l'écrire manuellement.");
            setIsCityReadOnly(false); 
          }
        } catch (geoError) {
          console.error(geoError);
          setErrorMessage("Erreur serveur de communication GPS. Veuillez écrire votre ville.");
          setIsCityReadOnly(false);
        } finally {
          setGeoLoading(false);
        }
      },
      (error) => {
        console.error(error);
        alert("Accès position refusé. Veuillez vérifier vos autorisations.");
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!service) {
      setErrorMessage("Les détails du service n'ont pas encore fini de charger.");
      return;
    }

    // FIXED: Maps database schema 'service_name' alongside frontend standard fallback 'name'
    const targetCategory = service.category_name || service.categoryName || "";
    const targetServiceName = service.service_name || service.name || service.serviceName || "";
    const targetPrice = service.price !== undefined && service.price !== null ? service.price : "Sur devis";

    if (!targetCategory || !targetServiceName) {
      setErrorMessage(`Erreur structurelle API: Catégorie (${targetCategory ? "OK" : "VIDE"}), Service (${targetServiceName ? "OK" : "VIDE"}).`);
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage("");

      const cleanLocation = formData.location.replace(/[\[\]]/g, "").trim();

      const response = await fetch("/api/demande-service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category_name: targetCategory,
          service_name: targetServiceName,
          price: targetPrice,
          name: formData.name,
          gender: formData.gender,
          phone: formData.phone,
          email: formData.email,
          city: formData.city,
          location: cleanLocation, 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Une erreur est survenue.");
        if (data.redirectUrl) {
          setTimeout(() => navigate(data.redirectUrl), 2500);
        }
        return;
      }

      alert("Demande envoyée avec succès !");
      if (data.redirectUrl) navigate(data.redirectUrl);
      
    } catch (error) {
      console.error(error);
      setErrorMessage("Erreur de connexion réseau lors de la soumission.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-10">
      <DashboardSkeleton />
      
    </div>;
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-block text-indigo-600 hover:underline bg-transparent border-0 cursor-pointer p-0 font-normal"
      >
        ← Retour
      </button>

      {service && (
        <div className="mb-8 rounded-2xl bg-white p-6 shadow">
          <h1 className="text-3xl font-bold">
            Commander : {service.service_name}
          </h1>
          <p className="mt-3 text-gray-600">{service.description}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
              {service.price ? `${service.price} $` : "Prix sur devis"}
            </span>
            {(service.category_name ) && (
              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                {service.category_name}
              </span>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-8 shadow">
        <h2 className="mb-6 text-2xl font-semibold">Informations du client</h2>

        {errorMessage && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-700 border border-red-200">
            ⚠️ {errorMessage}
          </div>
        )}

        <div className="grid gap-4">
          <input
            type="text"
            name="name"
            placeholder="Nom complet"
            value={formData.name}
            onChange={handleChange}
            required
            className="rounded-lg border p-3 border-gray-300 outline-none focus:border-indigo-500"
          />

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="rounded-lg border p-3 border-gray-300 outline-none focus:border-indigo-500 bg-white"
          >
            <option value="">Sélectionner le genre</option>
            <option value="Homme">Masculin</option>
            <option value="Femme">Féminin</option>
          </select>

          <input
            type="email"
            name="email"
            placeholder="Adresse email"
            value={formData.email}
            onChange={handleChange}
            required
            className="rounded-lg border p-3 border-gray-300 outline-none focus:border-indigo-500"
          />

          <input
            type="tel"
            name="phone"
            placeholder="+243 XXX XXX XXX"
            value={formData.phone}
            onChange={handleChange}
            required
            className="rounded-lg border p-3 border-gray-300 outline-none focus:border-indigo-500"
          />

          <input
            type="text"
            name="city"
            placeholder="Ville"
            value={formData.city}
            onChange={handleChange}
            readOnly={isCityReadOnly}
            className={`rounded-lg border p-3 outline-none transition focus:border-indigo-500 ${
              isCityReadOnly 
                ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200" 
                : "border-gray-300"
            }`}
          />

          <div className="flex gap-2">
            <input
              type="text"
              name="location"
              placeholder="Coordonnées GPS (ex: -11.6647,27.4794)"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full rounded-lg border p-3 border-gray-300 outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={geoLoading}
              className="rounded-lg bg-slate-800 px-4 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-50 shrink-0"
            >
              {geoLoading ? "Calcul..." : "📍 Position"}
            </button>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Envoi en cours..." : "Envoyer la demande"}
          </button>
        </div>
      </form>
    </div>
  );
}
