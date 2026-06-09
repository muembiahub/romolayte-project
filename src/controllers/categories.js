import { getCategories } from "../models/categories.js";

const showCategories = async (req, res, next) => {
  try {
    // Récupérer toutes les catégories depuis la DB
    const categories = await getCategories();

    // Définir le titre de la page
    const title = "Liste de nos catégories";

    // Rendu avec layout
    res.render("categories", {
      layout: "partials/layoute",   
      title,
      categories,
    });

  } catch (error) {
    console.error("❌ Error in showCategories:", error.message);

    // On passe l'erreur au middleware global pour uniformiser le rendu
    error.status = 500;
    error.message = "Impossible de charger les catégories.";
    next(error);
  }
};

export { showCategories };
