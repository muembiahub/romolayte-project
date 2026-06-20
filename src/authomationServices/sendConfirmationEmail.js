import nodemailer from "nodemailer";
import { buildConfirmationEmail } from "./emailTemplate.js";

/* =========================
   TRANSPORT ZOHO
========================= */

let transporter = null;

async function createTransporter() {
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

  // ===== Essai SSL (465) =====

  try {
    const smtp465 = nodemailer.createTransport({
      ...baseConfig,
      port: 465,
      secure: true,
    });

    await smtp465.verify();

    console.log(
      "✅ SMTP connecté via port 465"
    );

    return smtp465;

  } catch (err) {

    console.log(
      "⚠ Port 465 échoué → tentative 587"
    );
  }

  // ===== Essai TLS (587) =====

  try {

    const smtp587 =
      nodemailer.createTransport({

        ...baseConfig,

        port: 587,
        secure: false,
        requireTLS: true,

        tls: {
          rejectUnauthorized: false,
        }
      });

    await smtp587.verify();

    console.log(
      "✅ SMTP connecté via port 587"
    );

    return smtp587;

  } catch (err) {

    console.error(
      "❌ SMTP inaccessible:",
      err.message
    );

    return null;
  }
}

/* =========================
   INITIALISATION
========================= */

export async function initMailer() {
  transporter =
    await createTransporter();
}

/* =========================
   ENVOI SAFE
========================= */

export async function sendMail(mailOptions) {

  if (!transporter) {

    console.warn(
      "⚠ Email ignoré : SMTP indisponible"
    );

    return {
      success: false,
      message: "SMTP indisponible"
    };
  }

  try {

    const info =
      await transporter.sendMail(
        mailOptions
      );

    return {
      success: true,
      info
    };

  } catch (error) {

    console.error(
      "❌ Erreur envoi email:",
      error.message
    );

    return {
      success: false,
      error: error.message
    };
  }
}

/* =========================
   EMAIL CONFIRMATION
========================= */

export async function sendConfirmationEmail(data) {

  try {

    const email =
      buildConfirmationEmail(
        data
      );

    const result =
      await sendMail({

        from:
          `Romolayte <${process.env.ZOHO_EMAIL}>`,

        to: data.email,

        subject: email.subject,

        text: email.text,

        html: email.html,
      });

    if (!result.success) {

      console.warn(
        "⚠ Confirmation non envoyée"
      );

      return result;
    }

    console.log(
      "✅ Email envoyé:",
      result.info.messageId
    );

    return result;

  } catch(error){

    console.error(
      "❌ Email error:",
      error
    );

    return {
      success:false,
      error:error.message
    };
  }
}