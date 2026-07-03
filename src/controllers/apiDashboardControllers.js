import { getDashboardStatsModel, getAllOrdersModel,
  addServiceByCategory, updateServiceById, deleteServiceById,
  ProfileByUserId, allProfiles, updateProfileById, deleteProfileById,
  getAllMessageContact, updateStatusMessageContactById, deleteMessageContactById
} from "../models/dashboardModels.js";

/* =====================================================
   DASHBOARD CONTROLLER
===================================================== */

export const getDashboardStats = async (req, res, next) => {
  try {
    const data = await getDashboardStatsModel();

    return res.json({
      success: true,
      ...data,
    });

  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await getAllOrdersModel();
    console.log(orders);

    return res.json({
      success: true,
      orders,
    });

  } catch (error) {
    next(error);
  }
};



/* ===================================================== */
/* ===================================================== */

export const createService = async (req, res) => {
  try {
    const { category_id, name, description, price, logo } = req.body;
    if (!category_id || !name || !description || !price) {
      return res.status(400).json({ success: false, message: "Champs obligatoires manquants." });
    }

    const service = await addServiceByCategory(category_id, name, description, price, logo);
    res.status(201).json({ success: true, service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, name, description, price, logo } = req.body;

    // 1. 🔥 CORRECTIF : Ne pas mettre !price ici car le prix peut être modifié à 0 ou géré autrement
    if (!id || !category_id || !name || !description) {
      return res.status(400).json({ success: false, message: "Champs obligatoires manquants." });
    }

    // 2. 🔥 Traitement sécurisé pour s'assurer que le prix est un nombre valide
    let parsedPrice = null;
    if (price !== undefined && price !== null && price !== "") {
      parsedPrice = Number(price);
    }

    // 3. 🔥 Rassembler les modifications dans un objet propre
    const updates = {
      category_id: Number(category_id),
      name: name.trim(),
      description: description.trim(),
      price: parsedPrice, // Accepte maintenant le 0 et les nouveaux tarifs
      logo: logo ? logo.trim() : null
    };

    // 4. 🔥 Passer l'objet au modèle comme il l'attend : updateServiceById(id, updates)
    const service = await updateServiceById(id, updates);

    if (!service) {
      return res.status(404).json({ success: false, message: "Service introuvable." });
    }

    res.status(200).json({ success: true, service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: "ID manquant." });
    }

    const service = await deleteServiceById(id);
    res.status(200).json({ success: true, service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


/* ===================================================== */
/*    contact Message  */
/* ===================================================== */

export const showMessageContact = async (req, res, next) => {
  try {
    const message = await getAllMessageContact();
    res.status(200).json({ success: true, message });
  } catch (error) {
    next(error);
  }
  };
  
export const updateStatusMessageContact = async (req, res, next) => {
  try {
    const { id, status } = req.body;
    if (!id || !status) {
      return res.status(400).json({ success: false, message: "Champs obligatoires manquants." });
    }

    const message = await updateStatusMessageContactById(id, status);
    res.status(200).json({ success: true, message });
  } catch (error) {
    next(error);
  }
};

export const deleteMessageContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: "ID manquant." });
    }

    const message = await deleteMessageContactById(id);
    res.status(200).json({ success: true, message });
  } catch (error) {
    next(error);
  }
}


//  Profile controllers 


export const getProfileByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const profile = await ProfileByUserId(userId);
    res.status(200).json({ success: true, profile });
  } catch (error) {
    next(error);
  }
};

export const getAllProfiles = async (req, res, next) => {
  try {
    const profiles = await allProfiles();
    res.status(200).json({ success: true, profiles });
  } catch (error) {
    next(error);
  }
}
export const getupdateProfileById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const profile = await updateProfileById(id, updates);
    res.status(200).json({ success: true, profile });
  } catch (error) {
    next(error);
  }
};

export const getdeleteProfileById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: "ID manquant." });
    }

    const profile = await deleteProfileById(id);
    res.status(200).json({ success: true, profile });
  } catch (error) {
    next(error);
  }
}
