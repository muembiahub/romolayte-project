// import express from "express";
// import serverless from "serverless-http";
// import path from "path";
// import { fileURLToPath } from "url";
// import dotenv from "dotenv";
// import helmet from "helmet";
// import categoriesRouter from "../../src/routes/categories.js";
// import servicesRouter from "../../src/routes/services.js";
// import contactRoutes from "../../src/routes/contact.js";
// import supabase from "../../src/db/supabaseClient.js";

// dotenv.config();

// const app = express();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Configurer EJS
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "../../src/views"));

// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'"],
//       scriptSrc: ["'self'"],
//       styleSrc: ["'self'", "https:", "'unsafe-inline'"],
//       imgSrc: ["'self'", "data:", process.env.SUPABASE_URL], // ✅ utilise la variable
//       connectSrc: [
//         "'self'",
//         process.env.SUPABASE_URL, // ✅ utilise la variable
//         "https://nominatim.openstreetmap.org"
//       ],
//       fontSrc: ["'self'", "https:", "data:"],
//     },
//   })
// );

// // Fichiers statiques
// app.use(express.static(path.join(__dirname, "../../public")));

// // Routes
// app.use("/categories", categoriesRouter);
// app.use("/services", servicesRouter);
// app.use("/", contactRoutes);

// app.get("/", (req, res) => {
//   res.render("home", { title: "Accueil" });
// });

// // ⚡️ Exporter pour Netlify
// export const handler = serverless(app);
