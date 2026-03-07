import express from "express";
import serverless from "serverless-http";
import dotenv from "dotenv";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import slugify from "slugify";
import categoriesRouter from "../../src/routes/categories.js";
import servicesRouter from "../../src/routes/services.js";
import contactRoutes from "../../src/routes/contact.js";
import supabase from "../../src/db/supabaseClient.js";

dotenv.config();

const app = express();
const router = express.Router();

// ⚡️ Monte tes routes Express
router.use("/categories", categoriesRouter);
router.use("/services", servicesRouter);
router.use("/", contactRoutes);

router.get("/", (req, res) => {
  res.send("Accueil Romolayte via Netlify Functions");
});

// ⚡️ Important : toutes les routes passent par /.netlify/functions/server
app.use("/.netlify/functions/server", router);

export const handler = serverless(app);
