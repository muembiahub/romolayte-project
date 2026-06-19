import nodemailer from "nodemailer";
import  {buildConfirmationEmail} from "./emailTemplate.js";

/* =========================
   TRANSPORT ZOHO
========================= */



let transporter = null;

export async function createTransporter() {
  const baseConfig = {
    host: "smtppro.zoho.com",
    auth: {
      user: process.env.ZOHO_EMAIL,
      pass: process.env.ZOHO_PASSWORD,
    },
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000,
  };

  // -------------------------
  // TRY PORT 465 (SSL)
  // -------------------------
  try {
    const transporter465 = nodemailer.createTransport({
      ...baseConfig,
      port: 465,
      secure: true,
    });

    await transporter465.verify();

    console.log("✅ SMTP connecté via port 465");

    return transporter465;
  } catch (err) {
    console.log("⚠ Port 465 échoué, fallback vers 587...");
  }

  // -------------------------
  // TRY PORT 587 (TLS)
  // -------------------------
  try {
    const transporter587 = nodemailer.createTransport({
      ...baseConfig,
      port: 587,
      secure: false,
      requireTLS: true,
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter587.verify();

    console.log("✅ SMTP connecté via port 587");

    return transporter587;
  } catch (err) {
    console.error("❌ SMTP totalement inaccessible:", err.message);

    return null; // IMPORTANT: ne pas crash l’app
  }
}

// Initialisation SAFE (non bloquante)
export async function initMailer() {
  transporter = await createTransporter();
}

// Envoi email SAFE
export async function sendMail(mailOptions) {
  if (!transporter) {
    console.warn("⚠ Email ignoré: SMTP non disponible");
    return;
  }

  try {
    return await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("❌ Échec envoi email:", err.message);
  }
}



/* =========================
   SEND EMAIL
========================= */

export async function sendConfirmationEmail(data) {
  try {
    const email = buildConfirmationEmail(data);

    const info = await transporter.sendMail({
      from: `Romolayte <${process.env.ZOHO_EMAIL}>`,
      to: data.email,
      subject: email.subject,
      text: email.text,
      html: email.html,
    });

    console.log("✅ Email envoyé:", info.messageId);

    return info;
  } catch (error) {
    console.error("❌ Email error:", error);
    throw error;
  }
}

export { transporter };