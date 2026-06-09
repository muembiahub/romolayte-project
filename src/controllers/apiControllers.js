import { getCategories } from "../models/categories.js";
import { getAllServices, getServiceById, getServicesByCategory } from "../models/services.js";
import { insertContact } from "../models/contactModel.js";
import { insertDemandeService } from "../models/demandeServiceModel.js";
import { supabase } from "../config/database.js";

const getPublicCategories = async (req, res) => {
  const categories = await getCategories();
  res.json({ success: true, categories });
};

const getPublicServices = async (req, res) => {
  const services = await getAllServices();
  res.json({ success: true, services });
};

const getPublicServiceDetail = async (req, res) => {
  const { id } = req.params;
  const service = await getServiceById(id);
  if (!service) {
    return res.status(404).json({ success: false, message: "Service introuvable." });
  }
  res.json({ success: true, service });
};

const getServicesByCategoryApi = async (req, res) => {
  const { categoryId } = req.params;
  const services = await getServicesByCategory(categoryId);
  res.json({ success: true, services });
};

const submitContactApi = async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "Tous les champs sont obligatoires." });
  }

  const contact = await insertContact(name, email, message);
  res.status(201).json({ success: true, contact });
};

const submitServiceRequestApi = async (req, res) => {
  const {
    category_name,
    service_name,
    price,
    name,
    gender,
    phone,
    email,
    city,
    location
  } = req.body;

  if (!name || !email || !location || !category_name || !service_name) {
    return res.status(400).json({ success: false, message: "Champs requis manquants." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: "Adresse email invalide." });
  }
  if (!String(location).includes(",")) {
    return res.status(400).json({ success: false, message: "Localisation invalide." });
  }

  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("category_id")
    .eq("name", category_name)
    .single();

  if (categoryError || !category) {
    return res.status(400).json({ success: false, message: "Catégorie invalide." });
  }

  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("service_id")
    .eq("name", service_name)
    .single();

  if (serviceError || !service) {
    return res.status(400).json({ success: false, message: "Service invalide." });
  }

  const { data: existing, error: duplicateError } = await supabase
    .from("demande_service")
    .select("demande_id")
    .eq("service_id", service.service_id)
    .eq("email", email)
    .maybeSingle();

  if (duplicateError) {
    console.error("Erreur vérification doublon :", duplicateError);
  }

  if (existing) {
    return res.status(409).json({ success: false, message: "Une demande existe déjà pour ce service et cet email." });
  }

  const parsedPrice = price && price !== "Sur devis"
    ? Number(String(price).replace(/[^\d.]/g, ""))
    : null;

  const demande = await insertDemandeService({
    category_id: category.category_id,
    service_id: service.service_id,
    category_name,
    service_name,
    price: parsedPrice,
    name,
    gender: gender || null,
    phone: phone || null,
    email,
    coordinates: String(location).trim(),
    location: city || null,
    status: "Reçus"
  });

  res.status(201).json({ success: true, demande });
};

const getDashboardStats = async (req, res) => {
  const [{ count: usersCount }, { count: demandesCount }] = await Promise.all([
    supabase.from("user_profiles").select("*", { count: "exact", head: true }),
    supabase.from("demande_service").select("*", { count: "exact", head: true })
  ]);

  res.json({
    success: true,
    stats: {
      usersCount: usersCount || 0,
      demandesCount: demandesCount || 0
    }
  });
};

export {
  getPublicCategories,
  getPublicServices,
  getPublicServiceDetail,
  getServicesByCategoryApi,
  submitContactApi,
  submitServiceRequestApi,
  getDashboardStats
};
