// src/controllers/termsController.js
import { getAllTerms } from "../models/termsModels.js";
// src/controllers/privacyController.js
import { getPrivacy } from "../models/termsModels.js";

const showTermsPage = async (req, res) => {
  try {
    const terms = await getAllTerms();

    // Récupération de la date brute
    const lastUpdatedRaw = terms.length > 0 ? terms[0].last_updated : null;

    // Formatage en français (ex: "28 mars 2026")
    const lastUpdated = lastUpdatedRaw
      ? new Date(lastUpdatedRaw).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric"
        })
      : "N/A";

    // Passage des données à la vue EJS
    res.render("terms", {
      layout: false,
      terms,
      lastUpdated
    });
  } catch (err) {
    res.status(500).send("Erreur lors du chargement des CGU : " + err.message);
  }
};



const showPrivacyPage = async (req, res) => {
  try {
    const policy = await getPrivacy();

    // Formatage de la date
    const lastUpdatedRaw = policy.length > 0 ? policy[0].last_updated : null;
    const lastUpdated = lastUpdatedRaw
      ? new Date(lastUpdatedRaw).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric"
        })
      : "N/A";

    res.render("privacy", { 
      layout: false,
      policy, lastUpdated });
  } catch (err) {
    res.status(500).send("Erreur lors du chargement de la politique : " + err.message);
  }
};




export { showTermsPage, showPrivacyPage};
