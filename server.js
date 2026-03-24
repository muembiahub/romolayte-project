import express from "express";
import path from "path";
import dotenv from "dotenv";
import helmet from "helmet";
import session from "express-session";

// Routes
import router from "./src/views/controllers/routes.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js";
import searchRouter from "./src/models/search.js";

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
   Helmet CSP
========================= */
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "https:", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", SUPABASE_URL].filter(Boolean),
      connectSrc: ["'self'", SUPABASE_URL, "https://nominatim.openstreetmap.org"].filter(Boolean),
      fontSrc: ["'self'", "https:", "data:"],
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
   Routes (MVC)
========================= */
app.use("/", router);                 
app.use("/dashboard", requireAuth, dashboardRoutes); // ⚠️ protégé
app.use("/search", searchRouter);

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
  console.error("❌ Error:", err.message);

  const status = err.status || 500;

  let title;
  switch (status) {
    case 400: title = "Requête invalide"; break;
    case 401: title = "Non authentifié"; break;
    case 403: title = "Accès refusé"; break;
    case 404: title = "Page introuvable"; break;
    default:  title = "Erreur serveur";
  }

  res.status(status).render("errors", {
    status: status || 500,
    title: title || "Erreur serveur",
    message: err.message || "Une erreur inattendue est survenue."
  });
});

/* =========================
   Start Server
========================= */
app.listen(PORT, () => {
  console.log(`✅ Server running at http://127.0.0.1:${PORT}`);
  console.log(`🌱 Environment: ${NODE_ENV}`);
});
