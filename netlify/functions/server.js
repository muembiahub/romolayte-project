import express from "express";
import serverless from "serverless-http";
import dotenv from "dotenv";
import categoriesRouter from "../../src/routes/categories.js";
import servicesRouter from "../../src/routes/services.js";
import contactRoutes from "../../src/routes/contact.js";

dotenv.config();

const app = express();
const router = express.Router();

router.use("/categories", categoriesRouter);
router.use("/services", servicesRouter);
router.use("/", contactRoutes);

router.get("/", (req, res) => {
  res.send("Accueil Romolayte via Netlify Functions");
});

// ⚡️ Important : pas de app.listen()
app.use("/.netlify/functions/server", router);

export const handler = serverless(app);
