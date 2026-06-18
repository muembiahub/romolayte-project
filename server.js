import express from "express";
import path from "path";
import dotenv from "dotenv";
import helmet from "helmet";
import session from "express-session";
import cors from "cors";

import apiRoutes from "./src/routes/api.js";
import searchRouter from "./src/models/search.js";

import "dotenv/config";

dotenv.config();

const app = express();

const NODE_ENV = (process.env.NODE_ENV || "development").trim();
const PORT = Number(process.env.PORT) || 3000;
const SUPABASE_URL = (process.env.SUPABASE_URL || "").trim();

/* =========================================================
   CORS (VITE FIX - MUST FOR SESSION AUTH)
========================================================= */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

/* =========================================================
   BODY PARSERS
========================================================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================================================
   TRUST PROXY (important for cookies + sessions)
========================================================= */
app.set("trust proxy", 1);

/* =========================================================
   SESSION CONFIG (FIXED FOR LOCALHOST + VITE)
========================================================= */
app.use(
  session({
    name: "mvc_auth_session",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: NODE_ENV === "production", // false in dev
      sameSite: NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 30, // 30 min
    },
  })
);

/* =========================================================
   HELMET SECURITY
========================================================= */
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://cdn.jsdelivr.net", "'unsafe-inline'"],
        styleSrc: [
          "'self'",
          "https://cdn.jsdelivr.net",
          "https://cdnjs.cloudflare.com",
          "'unsafe-inline'",
        ],
        imgSrc: ["'self'", "data:", SUPABASE_URL].filter(Boolean),
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
   LOGGER (DEV ONLY)
========================================================= */
if (NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`➡️ ${req.method} ${req.url}`);
    next();
  });
}

/* =========================================================
   API ROUTES
========================================================= */
app.use("/api", apiRoutes);
app.use("/search", searchRouter);

/* =========================================================
   REACT BUILD STATIC FILES
========================================================= */
const clientPath = path.join(process.cwd(), "client/dist");

app.use(express.static(clientPath));

/* =========================================================
   SPA FALLBACK (React Router support)
========================================================= */
app.get("*", (req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

/* =========================================================
   ERROR HANDLER
========================================================= */
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);

  if (NODE_ENV !== "production") {
    console.error(err.stack);
  }

  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Une erreur inattendue s’est produite.",
  });
});

/* =========================================================
   START SERVER
========================================================= */
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`🌱 Environment: ${NODE_ENV}`);
});