import {
  getAllServices,
  getServiceById,
  getServicesByCategory
} from "../models/services.js";

/**
 * 1. Liste de tous les services
 */
const servicesPages = async (req, res) => {
  try {
    const services = await getAllServices();

    res.render("services", {
      layout: "partials/layoute",  
      title: "Nos Services Disponibles",
      services
    });
  } catch (error) {
    console.error("❌ Error in servicesPages:", error.message);
    res.status(500).render("errors", {
      layout: "partials/layoute",
      title: "Erreur Serveur",
      message: "Impossible de charger les services"
    });
  }
};

/**
 * 2. Détail d’un service + services liés
 */
const servicesPagesDetails = async (req, res) => {
  try {
    const service = await getServiceById(req.params.id);

    // ✅ Always check first
    if (!service) {
      return res.status(404).render("errors", {
        layout: "partials/layoute",
        title: "Erreur 404",
        message: "Service introuvable"
      });
    }

    // 🔹 Services liés (même catégorie)
    const relatedServices = await getServicesByCategory(service.category_id);
    const filteredRelated = relatedServices.filter(
      s => s.service_id !== service.service_id
    );

    // 🔹 Encode values for URL usage
    const safeCategory = encodeURIComponent(
      service.categories?.name || "Non définie"
    );
    const safeService = encodeURIComponent(service.name);
    const safePrice = encodeURIComponent(
      service.price ? service.price : "Sur devis"
    );

    res.render("serviceDetails", {
      layout: "partials/layoute",
      title: "Détails du Service",
      service,
      relatedServices: filteredRelated.slice(0, 8),
      safeCategory,
      safeService,
      safePrice
    });
  } catch (error) {
    console.error("❌ Error in servicesPagesDetails:", error.message);
    res.status(500).render("errors", {
      layout: false,
      title: "Erreur Serveur",
      message: "Impossible de charger les détails du service"
    });
  }
};

/**
 * 3. Liste des services par catégorie
 */
const servicesPagesByCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const services = await getServicesByCategory(categoryId);

    if (!services || services.length === 0) {
      return res.status(404).render("errors", {
        layout: "partials/layoute",
        title: "Erreur 404",
        message: "Aucun service trouvé pour cette catégorie"
      });
    }

    res.render("services", {
      layout: "partials/layoute",
      title: `Services de la catégorie ${services[0].categories?.name || ""}`,
      services
    });
  } catch (error) {
    console.error("❌ Error in servicesPagesByCategory:", error.message);
    res.status(500).render("errors", {
      layout: "partials/layoute",
      title: "Erreur Serveur",
      message: "Impossible de charger les services par catégorie"
    });
  }
};

export {
  servicesPages,
  servicesPagesDetails,
  servicesPagesByCategory
};
