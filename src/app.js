import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import helmet from "helmet";
import slugify from "slugify";

import categoriesRouter from "./routes/categories.js";
import servicesRouter from "./routes/services.js";
import contactRoutes from "./routes/contact.js";
import supabase from "./db/supabaseClient.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurer EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

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

app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/categories", categoriesRouter);
app.use("/services", servicesRouter);
app.use("/", contactRoutes);

app.get("/", (req, res) => {
  res.render("home", { title: "Accueil" });
});

export default app;
