import express from "express";
import path from "path";
import dotenv from "dotenv";
import helmet from "helmet";
import session from "express-session";

// Routes
import router from "./src/views/controllers/routes.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js";

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
   Sessions (OBLIGATOIRE)
========================= */
const session = require("express-session");

app.set("trust proxy", 1); // ⚡ obligatoire si tu es derrière un proxy (Nginx, Vercel, Heroku...)

app.use(session({
  name: "mvc_auth_session",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
<<<<<<< HEAD
    httpOnly: true, // le cookie n’est pas accessible en JS côté client
    secure: process.env.NODE_ENV === "production", // true uniquement en prod HTTPS
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
    // "none" + secure:true = indispensable si tu utilises un domaine différent pour ton API
=======
    httpOnly: true,
    secure: false,
>>>>>>> c63773125b8da0d5ed32911b2e69bad564a43f17
    maxAge: 1000 * 60 * 30 // 30 minutes
  }
}));



// Middleware pour renouveler la session si l’utilisateur est actif
app.use((req, res, next) => {
  if (req.session) {
    req.session.cookie.maxAge = 1000 * 60 * 30; // reset à 30 min
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
      connectSrc: [
        "'self'",
        SUPABASE_URL,
        "https://nominatim.openstreetmap.org"
      ].filter(Boolean),
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
   Routes (MVC)
========================= */
app.use("/", router);                 // Pages publiques + auth
app.use("/dashboard", dashboardRoutes); // Pages protégées
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
  let title = "Erreur serveur";

  if (status === 400) title = "Requête invalide";
  if (status === 404) title = "Page introuvable";

  res.status(status).render("error", {
    status,
    title,
    message: err.message
  });
});

/* =========================
   Start Server
========================= */
app.listen(PORT, () => {
  console.log(`✅ Server running at http://127.0.0.1:${PORT}`);
  console.log(`🌱 Environment: ${NODE_ENV}`);
});
