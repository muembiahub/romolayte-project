import { name } from "ejs";
import { getAllServices, getServiceById, getServicesByCategory } from "../../models/services.js";

/**
 * 1. Liste de tous les services
 */
const servicesPages = async (req, res) => {
  try {
    const services = await getAllServices();
    res.render("services", {
      title: "Nos Services Disponibles",
      services
    });
  } catch (error) {
    console.error("❌ Error in servicesPages:", error.message);
    res.status(500).render("errors/500", {
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
    // 🔹 Récupérer le service par ID
    const service = await getServiceById(req.params.id);

    if (!service) {
      return res.status(404).render("errors/404", {
        title: "Erreur 404",
        message: "Service introuvable"
      });
    }

    // 🔹 Récupérer les services liés par catégorie
    const relatedServices = await getServicesByCategory(service.category_id);
    const filteredRelated = relatedServices.filter(
      s => s.service_id !== service.service_id
    );

    // 🔹 Encoder les valeurs pour l’URL du bouton
    const safeCategory = encodeURIComponent(service.categories.name);
    const safeService = encodeURIComponent(service.name);
    const safePrice = service.price ? service.price : "Sur devis";

    // 🔹 Rendu de la page
    res.render("serviceDetails", {
      title: "Détails du Service",
      service,
      relatedServices: filteredRelated.slice(0, 8), // limite à 8
      safeCategory,
      safeService,
      safePrice
    });
  } catch (error) {
    console.error("❌ Error in servicesPagesDetails:", error.message);
    res.status(500).render("errors/500", {
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
      return res.status(404).render("errors/404", {
        title: "Erreur 404",
        message: "Aucun service trouvé pour cette catégorie"
      });
    }

    res.render("services", {
      title: `Services de la catégorie ${services[0].categories.name}`,
      services
    });
  } catch (error) {
    console.error("❌ Error in servicesPagesByCategory:", error.message);
    res.status(500).render("errors/500", {
      title: "Erreur Serveur",
      message: "Impossible de charger les services par catégorie"
    });
  }
};

export { servicesPages, servicesPagesDetails, servicesPagesByCategory };
