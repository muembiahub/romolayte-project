import express from "express";
import path from "path";
import dotenv from "dotenv";
import helmet from "helmet";
import session from "express-session";
import cors from "cors";

import { supabase } from "./src/config/database.js";

import apiRoutes from "./src/routes/api.js";
import searchRouter from "./src/models/search.js";
import authRouter from "./src/routes/apiAuthRoutes.js";
import dashboardRouter from "./src/routes/apiDashboardRoutes.js";

/* =========================================================
   ENV
========================================================= */
dotenv.config();

/* =========================================================
   APP
========================================================= */
const app = express();

const NODE_ENV = (process.env.NODE_ENV || "development").trim();
const PORT = process.env.PORT || 3000;
const SUPABASE_URL = (process.env.SUPABASE_URL || "").trim();

/* =========================================================
   TEST CONNEXION SUPABASE
========================================================= */
async function testSupabaseConnection() {
  console.log("\n========== TEST SUPABASE ==========");

  try {
    const { data, error } = await supabase
      .from("roles")
      .select("*");

    if (error) {
      console.error("❌ SUPABASE ERROR");
      console.error(error);
    } else {
      console.log("✅ Connexion Supabase réussie");
      console.log("📋 Nombre de rôles :", data.length);
      console.table(data);
    }
  } catch (err) {
    console.error("❌ EXCEPTION SUPABASE");
    console.error(err);
  }

  console.log("==================================\n");
}

/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("trust proxy", 1);

/* =========================================================
   SECURITY
========================================================= */

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "https://cdn.jsdelivr.net",
          "'unsafe-inline'",
        ],
        styleSrc: [
          "'self'",
          "https://cdn.jsdelivr.net",
          "https://cdnjs.cloudflare.com",
          "'unsafe-inline'",
        ],
        imgSrc: [
          "'self'",
          "data:",
          SUPABASE_URL,
        ].filter(Boolean),

        connectSrc: [
          "'self'",
          SUPABASE_URL,
          "https://nominatim.openstreetmap.org",
          "https://cdn.jsdelivr.net",
        ].filter(Boolean),

        fontSrc: [
          "'self'",
          "https://cdnjs.cloudflare.com",
          "https://cdn.jsdelivr.net",
          "data:",
        ],

        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        frameAncestors: ["'self'"],
      },
    },
  })
);

/* =========================================================
   LOGGER
========================================================= */

if (NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`➡️ ${req.method} ${req.originalUrl}`);
    next();
  });
}

/* =========================================================
   ROUTES
========================================================= */

app.use("/api", apiRoutes);
app.use("/search", searchRouter);
app.use("/", authRouter);
app.use("/", dashboardRouter);

/* =========================================================
   STATIC FRONTEND
========================================================= */

const clientPath = path.join(process.cwd(), "client/dist");

app.use(express.static(clientPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

/* =========================================================
   ERROR HANDLER
========================================================= */

app.use((err, req, res, next) => {
  console.error("❌ Error :", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Erreur serveur",
  });
});

/* =========================================================
   START SERVER
========================================================= */

(async () => {
  await testSupabaseConnection();

  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🌱 Environment : ${NODE_ENV}`);
    console.log(`🚀 Ready`);
  });
})();