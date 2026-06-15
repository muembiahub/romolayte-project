import React, { useState, useEffect } from "react";

const ServiceForm = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [servicePrice, setServicePrice] = useState("");

  // Charger les catégories depuis ton backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories"); // ton endpoint backend
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("❌ Erreur chargement catégories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Ajouter un service via ton backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCategory) {
      alert("⚠️ Choisis une catégorie avant d’ajouter un service.");
      return;
    }

    try {
      const response = await fetch("/api/services/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: serviceName,
          description: serviceDescription,
          price: servicePrice,
          category_id: selectedCategory,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l’ajout du service");
      }

      const result = await response.json();
      alert("✅ Service ajouté avec succès !");
      console.log("Service ajouté:", result);

      // Reset form
      setServiceName("");
      setServiceDescription("");
      setServicePrice("");
      setSelectedCategory("");
    } catch (error) {
      console.error("❌ Erreur ajout service:", error);
      alert("Erreur lors de l’ajout du service.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Ajouter un Service</h2>

      <label>Catégorie :</label>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        required
      >
        <option value="">-- Sélectionne une catégorie --</option>
        {categories.map((cat) => (
          <option key={cat.category_id} value={cat.category_id}>
            {cat.name}
          </option>
        ))}
      </select>

      <label>Nom du service :</label>
      <input
        type="text"
        value={serviceName}
        onChange={(e) => setServiceName(e.target.value)}
        required
      />

      <label>Description :</label>
      <textarea
        value={serviceDescription}
        onChange={(e) => setServiceDescription(e.target.value)}
        required
      />

      <label>Prix :</label>
      <input
        type="number"
        value={servicePrice}
        onChange={(e) => setServicePrice(e.target.value)}
        required
      />

      <button type="submit">Ajouter</button>
    </form>
  );
};

export default ServiceForm;
