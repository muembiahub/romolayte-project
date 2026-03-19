import { getCategories } from "../../models/categories.js";

const showCategories = async (req, res) => {
  try {
    const categories = await getCategories();
    const title = "Liste des catégories";

    res.render("categories", { title, categories });
  } catch (error) {
    console.error("Error in showCategories:", error.message);
    res.status(500).render("errors/500", { 
      title: 'Server Error ',
      error: "Impossible de charger les catégories.",
      stack: "Vue ",
      message: "Impossible de charger les catégories." 
    });
  }
};

export { showCategories };
