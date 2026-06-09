import express from "express";
import expressLayouts from "express-ejs-layouts";
import path from "path";
import dotenv from "dotenv";
import helmet from "helmet";
import session from "express-session";

// Routes
import apiRoutes from "./src/routes/apiRoutes.js";
import searchRouter from "./src/models/search.js";

import "dotenv/config";

console.log("RESEND KEY ?", process.env.RESEND_API_KEY);

dotenv.config();

const app = express();
const NODE_ENV = (process.env.NODE_ENV || "development").trim();
const PORT = Number(process.env.PORT) || 3000;
const SUPABASE_URL = (process.env.SUPABASE_URL || "").trim();

/* =========================
   View Engine
========================= */
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "src/views"));

/* =========================
   Static Files
========================= */
app.use(express.static(path.join(process.cwd(), "src/public")));
app.use(express.static(path.join(process.cwd(), "client/dist")));

// Activer express-ejs-layouts
app.use(expressLayouts);

// Définir le layout par défaut
app.set("layout", "dashboard/dashboard-layout");

/* =========================
   Body Parsers
========================= */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* =========================
   Sessions
========================= */
app.set("trust proxy", 1);

app.use(session({
  name: "mvc_auth_session",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 1000 * 60 * 30 // 30 minutes
  }
}));

/* =========================
   Middleware de renouvellement
========================= */
app.use((req, res, next) => {
  if (req.session && req.session.user) {
    req.session.cookie.maxAge = 1000 * 60 * 30;
  }
  next();
});

/* =========================
   Helmet - Content Security Policy (CSP)
========================= */
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      /* Valeur par défaut */
      defaultSrc: ["'self'"],

      /* JavaScript */
      scriptSrc: [
        "'self'",
        "https://cdn.jsdelivr.net",       // Bootstrap JS
        "'unsafe-inline'",               // scripts inline
      ],

      /* Attributs JS inline (onclick, onload…) */
      scriptSrcAttr: [
        "'unsafe-inline'",
      ],

      /* CSS */
      styleSrc: [
        "'self'",
        "https://cdn.jsdelivr.net",       // Bootstrap CSS
        "https://cdnjs.cloudflare.com",   // Font Awesome CSS
        "'unsafe-inline'",
      ],

      /* Images */
      imgSrc: [
        "'self'",
        "data:",
        SUPABASE_URL,
      ].filter(Boolean),

      /* Requêtes réseau / source maps */
      connectSrc: [
        "'self'",
        SUPABASE_URL,
        "https://nominatim.openstreetmap.org",
        "https://cdn.jsdelivr.net",       // Bootstrap .map
      ].filter(Boolean),

      /* Polices */
      fontSrc: [
        "'self'",
        "https://cdnjs.cloudflare.com",   // Font Awesome fonts
        "https://cdn.jsdelivr.net",
        "data:",
      ],

      /* Sécurité renforcée */
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      frameAncestors: ["'self'"],
    },
  })
);

/* =========================
   Logger (DEV only)
========================= */
if (NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`➡️ ${req.method} ${req.url}`);
    next();
  });
}

/* =========================
   Global Variables (Views)
========================= */
app.use((req, res, next) => {
  res.locals.NODE_ENV = NODE_ENV;
  res.locals.user = req.session.user || null;
  next();
});

/* =========================
   Middleware d'authentification
========================= */
function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    const err = new Error("Vous devez être connecté pour accéder à cette page.");
    err.status = 401;
    return next(err);
  }
  next();
}

/* =========================
   Routes
========================= */
app.use("/api", apiRoutes);
app.use("/search", searchRouter);

/* =========================
   SPA fallback for React frontend
========================= */
app.get("/*", (req, res, next) => {
  if (req.path.startsWith("/api") || req.path.startsWith("/search")) {
    return next();
  }

  return res.sendFile(path.join(process.cwd(), "client/dist", "index.html"));
});

/* =========================
   404 Handler
========================= */
app.use((req, res, next) => {
  const err = new Error("Page introuvable");
  err.status = 404;
  next(err);
});

/* =========================
   Global Error Handler
========================= */
app.use((err, req, res, next) => {
  const status = err.status || 500;

  let title;
  switch (status) {
    case 400: title = "Requête invalide"; break;
    case 401: title = "Non authentifié"; break;
    case 403: title = "Accès refusé"; break;
    case 404: title = "Page introuvable"; break;
    case 500: title = "Erreur interne"; break;
    default:  title = "Erreur inattendue";
  }

  // Log interne (stack trace en dev seulement)
  console.error("❌ Error:", err.message);
  if (req.app.get("env") !== "production") {
    console.error(err.stack);
  }

  // Réponse utilisateur (toujours propre)
  res.status(status).render("errors", {
    layout: "partials/layoute",
    status,
    title,
    message: err.message || "Une erreur inattendue s’est produite."
  });
});

/* =========================
   Fallback (catch-all)
========================= */
app.use((req, res) => {
  res.status(500).render("errors", {
    layout: "partials/layoute",
    status: 500,
    title: "Erreur serveur",
    message: "Une erreur inattendue s’est produite."
  });
});


/* =========================
   Start Server
========================= */
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`🌱 Environment: ${NODE_ENV}`);
});
