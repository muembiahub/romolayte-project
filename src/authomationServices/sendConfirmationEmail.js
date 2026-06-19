import nodemailer from "nodemailer";
import  {buildConfirmationEmail} from "./emailTemplate.js";

/* =========================
   TRANSPORT ZOHO
========================= */

async function createTransporter() {

  // Essai SSL (465)
  try {

    const transporter465 =
      nodemailer.createTransport({

        host: "smtppro.zoho.com",
        port: 465,
        secure: true,

        auth: {
          user: process.env.ZOHO_EMAIL,
          pass: process.env.ZOHO_PASSWORD
        },

        connectionTimeout: 15000
      });

    await transporter465.verify();

    console.log(
      "✅ Connecté via port 465"
    );

    return transporter465;

  } catch(error){

    console.log(
      "⚠ 465 échoué → tentative 587"
    );

  }

  // Fallback TLS (587)
  try {

    const transporter587 =
      nodemailer.createTransport({

        host: "smtppro.zoho.com",
        port: 587,
        secure: false,
        requireTLS: true,

        auth: {
          user: process.env.ZOHO_EMAIL,
          pass: process.env.ZOHO_PASSWORD
        },

        connectionTimeout: 15000
      });

    await transporter587.verify();

    console.log(
      "✅ Connecté via port 587"
    );

    return transporter587;

  } catch(error){

    console.error(
      "❌ SMTP totalement inaccessible:",
      error
    );

    throw error;
  }
}

export const transporter =
  await createTransporter();

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