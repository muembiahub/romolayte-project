import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Briefcase, DollarSign, Image, Folder, Loader2 } from "lucide-react";

const initialForm = {
  category_id: "",
  name: "",
  description: "",
  price: "",
  logo: "",
};

export default function CreateService() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(true);
  const navigate = useNavigate();

  // 1. Charger les catégories disponibles au montage du composant
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setFetchingCategories(true);
        const res = await fetch("/api/categories"); // Ajustez l'URL selon vos routes d'API catégories
        if (!res.ok) throw new Error("Impossible de récupérer les catégories");

        const data = await res.json();
        setCategories(Array.isArray(data?.categories) ? data.categories : data || []);
      } catch (err) {
        console.error(err);
        toast.error("❌ Erreur lors du chargement des catégories");
      } finally {
        setFetchingCategories(false);
      }
    };

    loadCategories();
  }, []);

  // Gestion des changements dans les champs de saisie
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validation simple des champs obligatoires côté client
  const isValid = () => {
    return (
      formData.category_id &&
      formData.name.trim() &&
      formData.description.trim()
    );
  };

  // 2. Soumission du formulaire au serveur Express
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValid()) {
      toast.error("⚠️ Veuillez remplir tous les champs obligatoires (*)");
      return;
    }

    // Récupération du jeton d'authentification valide
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Session expirée. Veuillez vous reconnecter.");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/dashboard/addservice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Transmission sécurisée du token
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

      // Interception des erreurs de droits ou d'expiration de session
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        toast.error(result.message || "Accès refusé. Session invalide.");
        navigate("/login");
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Une erreur est survenue sur le serveur");
      }

      toast.success("Service créé avec succès ! 🎉");
      setFormData(initialForm);
      
      // Redirection immédiate vers le Dashboard pour voir le changement
      navigate("/services");

    } catch (error) {
      console.error("Erreur création service:", error);
      toast.error(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto py-4">
      {/* Bouton Retour */}
      <button
        onClick={() => navigate("/dashboard")}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition"
      >
        <ArrowLeft size={16} />
        Retour au tableau de bord
      </button>

      {/* Titre de la page */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
          <Briefcase size={26} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Nouveau Service</h1>
          <p className="text-sm text-slate-500 mt-1">
            Ajoutez une nouvelle prestation disponible à la commande pour vos clients.
          </p>
        </div>
      </div>

      {/* Formulaire Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-3xl p-8 space-y-6 border border-slate-100"
      >
        {/* Champ Sélection de Catégorie */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 after:content-['*'] after:ml-0.5 after:text-red-500">
            <Folder size={16} className="text-slate-400"  />
            Catégorie associée 
          </label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            disabled={fetchingCategories}
            className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none bg-slate-50 transition disabled:opacity-60"
          >
            <option value="">
              {fetchingCategories ? "Chargement des catégories..." : "-- Choisir une catégorie --"}
            </option>
            {categories.map((cat) => (
              <option key={cat.category_id || cat.id} value={cat.category_id || cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Champ Nom du Service */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700 after:content-['*'] after:ml-0.5 after:text-red-500">
            Nom du service 
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ex : Nettoyage Professionnel de Bureaux"
            className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none bg-slate-50 transition"
          />
        </div>

        {/* Champ Description Métier */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700 after:content-['*'] after:ml-0.5 after:text-red-500">
            Description détaillée 
          </label>
          <textarea
            rows={5}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Décrivez précisément en quoi consiste cette prestation, le matériel inclus, etc..."
            className="w-full px-4 py-3 border border-slate-200 rounded-2xl resize-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none bg-slate-50 transition"
          />
        </div>

        {/* Grille Tarification & Identité Visuelle */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <DollarSign size={16} className="text-slate-400" />
              Tarif indicatif (€)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Ex : 75.00"
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
              placeholder="https://unsplash.com..."
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none bg-slate-50 transition"
            />
          </div>
        </div>

        {/* Boutons d'Action */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
          <button
            type="button"
            disabled={loading}
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 rounded-full border border-slate-200 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition disabled:opacity-50"
          >
            Annuler
          </button>
          
          <button
            type="submit"
            disabled={loading || fetchingCategories}
            className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Création...
              </>
            ) : (
              "Publier le service"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
