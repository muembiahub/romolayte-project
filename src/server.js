import express from "express";
import path from "path";
import dotenv from "dotenv";
import helmet from "helmet";

import categoriesRouter from "./routes/categories.js";
import servicesRouter from "./routes/services.js";
import contactRoutes from "./routes/contact.js";
import searchRoutes from './routes/search.js';




dotenv.config();

const app = express();

// ✅ Définir le dossier racine des vues
app.set("view engine", "ejs","js");
app.set("views", path.join(process.cwd(), "src", "views"));

// ✅ Fichiers statiques
app.use(express.static(path.join(process.cwd(), "src", "public")));

// ✅ Sécurité avec Helmet
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "https:", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", process.env.SUPABASE_URL],
      connectSrc: ["'self'", process.env.SUPABASE_URL, "https://nominatim.openstreetmap.org"],
      fontSrc: ["'self'", "https:", "data:"],
    },
  })
);

// ✅ Routes
app.use("/categories", categoriesRouter);
app.use("/services", servicesRouter);
app.use("/", contactRoutes);

// ✅ Page d’accueil
app.get("/", (req, res) => {
  res.render("home", { title: "Accueil" });
});
//  seach bar
app.use('/search', searchRoutes);

// ⚡ Lancer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Romolayte backend lancé sur http://localhost:${PORT}`);
});
