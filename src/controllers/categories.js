import { getCategories } from "../models/categories.js";

const showCategories = async (req, res) => {
  try {

    // Fetch all categories from DB
    const categories = await getCategories();

    // Set page title
    const title = "Liste de nos catégories";

    // Render page with layout
    res.render("categories", {
      layout: "partials/layoute",   // ❗ Ensure your layout file is named layout.ejs
      title,
      categories,
    });

  } catch (error) {
    console.error("❌ Error in showCategories:", error.message);

    res.status(500).render("errors", {
      layout: "layout",
      title: "Erreur Serveur",
      message: "Impossible de charger les catégories.",
      error: error.message,
      stack: error.stack,
    });
  }
};

export { showCategories };