import React, { useEffect, useState } from "react";

const initialForm = {
  category_id: "",
  name: "",
  description: "",
  price: "",
  logo: "",
};

const ServiceForm = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Charger les catégories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error();

        const data = await res.json();
        setCategories(Array.isArray(data?.categories) ? data.categories : []);
      } catch (err) {
        console.error(err);
        setMessage("❌ Erreur lors du chargement des catégories");
      }
    };

    loadCategories();
  }, []);

  // Gestion des inputs
  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validation simple
  const isValid = () =>
    formData.category_id &&
    formData.name.trim() &&
    formData.description.trim();

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!isValid()) {
      setMessage("⚠️ Veuillez remplir tous les champs obligatoires");
      return;
    }

    setLoading(true);

    try {
  const response = await fetch(
    "/api/services/create",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        category_id: Number(
          formData.category_id
        ),

        name: formData.name.trim(),

        description:
          formData.description.trim(),

        price: formData.price
          ? Number(formData.price)
          : null,

        logo: formData.logo || null,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
      result.error ||
      "Erreur serveur"
    );
  }

  console.log(
    "Service créé:",
    result
  );

  setMessage(
    "✅ Service ajouté avec succès"
  );

  setFormData({
    category_id: "",
    name: "",
    description: "",
    price: "",
    logo: "",
  });

} catch (error) {
  console.error(
    "Erreur complète:",
    error
  );

  setMessage(
    `❌ ${error.message}`
  );

} finally {
  setLoading(false);
}
  };

  return (
    <div className="w-full px-4 py-6">
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-8 space-y-5"
      >
        <h2 className="text-2xl font-bold text-gray-800">
          Ajouter un Service
        </h2>

        {message && (
          <div
            className={`p-3 rounded-lg text-sm ${
              message.includes("✅")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* Catégorie */}
        <div>
          <label className="block mb-2 text-sm font-medium">
            Catégorie *
          </label>

          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="">Choisir une catégorie</option>
            {categories.map((cat) => (
              <option key={cat.category_id} value={cat.category_id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Nom */}
        <div>
          <label className="block mb-2 text-sm font-medium">
            Nom du service *
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ex : Développement Web"
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2 text-sm font-medium">
            Description *
          </label>

          <textarea
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Décris ton service..."
            className="w-full px-4 py-3 border rounded-xl resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Prix */}
        <div>
          <label className="block mb-2 text-sm font-medium">Prix</label>

          <input
            type="number"
            min="0"
            step="0.01"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Ex : 50"
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Logo */}
        <div>
          <label className="block mb-2 text-sm font-medium">
            URL Logo
          </label>

          <input
            type="text"
            name="logo"
            value={formData.logo}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "Ajout..." : "Ajouter le service"}
        </button>
      </form>
    </div>
  );
};

export default ServiceForm;