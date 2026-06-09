import express from "express";
import path from "path";
import dotenv from "dotenv";
import helmet from "helmet";
import session from "express-session";

// Routes
import apiRoutes from "./src/routes/apiRoutes.js";
import searchRouter from "./src/models/search.js";

import "dotenv/config";

dotenv.config();

const app = express();
const NODE_ENV = (process.env.NODE_ENV || "development").trim();
const PORT = Number(process.env.PORT) || 3000;
const SUPABASE_URL = (process.env.SUPABASE_URL || "").trim();

/* =========================
   Static Files (React build)
========================= */
app.use(express.static(path.join(process.cwd(), "client/dist")));

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
    secure: NODE_ENV === "production",
    sameSite: NODE_ENV === "production" ? "none" : "lax",
    maxAge: 1000 * 60 * 30 // 30 minutes
  }
}));

/* =========================
   Helmet - CSP
========================= */
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net", "'unsafe-inline'"],
      styleSrc: ["'self'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", SUPABASE_URL].filter(Boolean),
      connectSrc: ["'self'", SUPABASE_URL, "https://nominatim.openstreetmap.org", "https://cdn.jsdelivr.net"].filter(Boolean),
      fontSrc: ["'self'", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net", "data:"],
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
   Routes REST
========================= */
app.use("/api", apiRoutes);
app.use("/search", searchRouter);

/* =========================
   SPA fallback (React)
========================= */
app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "client/dist", "index.html"));
});

/* =========================
   Error Handling
========================= */
app.use((err, req, res, next) => {
  const status = err.status || 500;
  console.error("❌ Error:", err.message);
  if (NODE_ENV !== "production") {
    console.error(err.stack);
  }
  res.status(status).json({ error: err.message || "Une erreur inattendue s’est produite." });
});

/* =========================
   Start Server
========================= */
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`🌱 Environment: ${NODE_ENV}`);
});
//  