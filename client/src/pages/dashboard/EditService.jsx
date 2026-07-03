import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Briefcase, DollarSign, Image, Folder, Loader2, Save,Check} from "lucide-react";

const initialForm = {
  category_id: "",
  name: "",
  description: "",
  price: "",
  logo: "",
};

export default function EditService() {
  const { id } = useParams(); // Récupère l'ID du service depuis l'URL de navigation
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);

  // 1. Charger les catégories et les données du service actuel au montage
  useEffect(() => {
    const initializeData = async () => {
      try {
        setFetchingData(true);

        // Charger toutes les catégories pour le menu déroulant
        const catRes = await fetch("/api/categories");
        if (!catRes.ok) throw new Error("Erreur catégories");
        const catData = await catRes.json();
        setCategories(Array.isArray(catData?.categories) ? catData.categories : catData || []);

        // Charger les informations spécifiques du service à modifier
        // Remplacez par votre route d'API fetch single service si nécessaire (ex: /api/services/${id})
        const serviceRes = await fetch(`/api/services/${id}`); 
        if (!serviceRes.ok) throw new Error("Impossible de charger les détails de ce service");
        const serviceData = await serviceRes.json();

        // Extraction des données du service (s'adapte si votre API renvoie { success: true, service: {...} })
        const service = serviceData?.service || serviceData;

        setFormData({
          category_id: service?.category_id || "",
          name: service?.name || "",
          description: service?.description || "",
          price: service?.price || "",
          logo: service?.logo || "",
        });

      } catch (err) {
        console.error(err);
        toast.error(err.message || "❌ Erreur lors de la récupération des données");
        navigate("/dashboard"); // Retour automatique si le service n'existe pas
      } finally {
        setFetchingData(false);
      }
    };

    initializeData();
  }, [id, navigate]);

  // Gestion des changements de saisie
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validation des champs requis
  const isValid = () => {
    return (
      formData.category_id &&
      formData.name.trim() &&
      formData.description.trim()
    );
  };

  // 2. Soumission des modifications au serveur Express
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValid()) {
      toast.error("⚠️ Veuillez remplir tous les champs obligatoires (*)");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Session expirée. Veuillez vous reconnecter.");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      // Appel vers votre route POST Express sécurisée par requireApiAdmin
      const response = await fetch(`/dashboard/updateservice/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          category_id: Number(formData.category_id),
          name: formData.name.trim(),
          description: formData.description.trim(),
          price: formData.price ? Number(formData.price) : null,
          logo: formData.logo.trim() || null
        })
      });

      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        toast.error(result.message || "Accès refusé. Session non autorisée.");
        navigate("/login");
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Erreur serveur lors de la mise à jour");
      }

      toast.success("Service mis à jour avec succès ! 🎉");
      navigate("/services"); // Redirection vers le catalogue mis à jour

    } catch (error) {
      console.error("Erreur mise à jour service:", error);
      toast.error(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

 if (fetchingData) {
  return (
    <div className="flex flex-col h-96 items-center justify-center gap-4">
      {/* Loader2 est déjà importé depuis 'lucide-react' */}
      <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      <p className="text-sm font-medium text-slate-500">Chargement de la prestation...</p>
    </div>
  );
}
  return (
    <div className="space-y-6 max-w-3xl mx-auto py-4">
      {/* Bouton de retour vers la liste */}
      <button
        onClick={() => navigate("/services")}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition"
      >
        <ArrowLeft size={16} />
        Retour aux services
      </button>

      {/* Titre dynamique */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
          <Briefcase size={26} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Modifier le Service</h1>
          <p className="text-sm text-slate-500 mt-1">
            Modifiez les informations, tarifs ou visuels de cette offre en temps réel.
          </p>
        </div>
      </div>

      {/* Formulaire de modification */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-3xl p-8 space-y-6 border border-slate-100"
      >
        {/* Catégorie associée */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 after:content-['*'] after:ml-0.5 after:text-red-500">
            <Folder size={16} className="text-slate-400" />
            Catégorie associée 
          </label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none bg-slate-50 transition"
          >
            <option value="">-- Choisir une catégorie --</option>
            {categories.map((cat) => (
              <option key={cat.category_id || cat.id} value={cat.category_id || cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Nom de la prestation */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700 after:content-['*'] after:ml-0.5 after:text-red-500">
            Nom du service 
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ex : Création Graphique"
            className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none bg-slate-50 transition"
          />
        </div>

        {/* Description détaillée */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700 after:content-['*'] after:ml-0.5 after:text-red-500">
            Description détaillée 
          </label>
          <textarea
            rows={5}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Décrivez précisément les détails techniques ou métiers de l'offre..."
            className="w-full px-4 py-3 border border-slate-200 rounded-2xl resize-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none bg-slate-50 transition"
          />
        </div>

        {/* Grille Tarif & Logo */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <DollarSign size={16} className="text-slate-400" />
              Tarif indicatif ($)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Ex : 120.00"
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none bg-slate-50 transition"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Image size={16} className="text-slate-400" />
              Lien URL de l'illustration (Logo)
            </label>
            <input
              type="text"
              name="logo"
              value={formData.logo}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none bg-slate-50 transition"
            />
          </div>
        </div>

        {/* Actions du bas de formulaire */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
          <button
            type="button"
            disabled={loading}
            onClick={() => navigate("/services")}
            className="px-6 py-3 rounded-full border border-slate-200 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition disabled:opacity-50"
          >
            Annuler
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Check size={16} />
            )}
            Enregistrer les modifications
          </button>
        </div>
      </form>
    </div>
  );
}