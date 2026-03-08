// netlify/functions/server.js
import serverless from "serverless-http";
import app from "../../src/app.js";

// ⚡ Point d’entrée Netlify : pas besoin de PORT
export const handler = serverless(app);
