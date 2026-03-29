import { getCategories } from "../../models/categories.js";

const showCategories = async (req, res) => {
  try {
    const categories = await getCategories();
    const  home = "Bienvenue chez  Romolayte. Nous vous présentons nos différentes catégories de services"
    const title = "Liste des nos catégories";

    res.render("categories", {
      layout: false,
      home, title, categories });
  } catch (error) {
    console.error("Error in showCategories:", error.message);
    res.status(500).render("errors", { 
      title: 'Server Error ',
      error: "Impossible de charger les catégories.",
      stack: "Vue ",
      message: "Impossible de charger les catégories." 
    });
  }
};

export { showCategories };
