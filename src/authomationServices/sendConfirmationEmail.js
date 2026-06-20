import nodemailer from "nodemailer";
import { buildConfirmationEmail } from "./emailTemplate.js";

/* =========================================================
   TRANSPORT
========================================================= */

let transporter = null;

/* =========================================================
   CREATE TRANSPORTER
========================================================= */

async function createTransporter() {

  const baseConfig = {
    host: "smtppro.zoho.com",
    auth: {
      user: process.env.ZOHO_EMAIL,
      pass: process.env.ZOHO_PASSWORD,
    },
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 20000,
  };

  // =========================
  // PORT 465 (SSL)
  // =========================
  try {

    const smtp465 = nodemailer.createTransport({
      ...baseConfig,
      port: 465,
      secure: true,
    });

    await smtp465.verify();

    console.log("✅ SMTP OK (465)");

    return smtp465;

  } catch (err) {
    console.log("⚠ 465 failed → trying 587");
  }

  // =========================
  // PORT 587 (TLS)
  // =========================
  try {

    const smtp587 = nodemailer.createTransport({
      ...baseConfig,
      port: 587,
      secure: false,
      requireTLS: true,
      tls: {
        rejectUnauthorized: false,
      },
    });

    await smtp587.verify();

    console.log("✅ SMTP OK (587)");

    return smtp587;

  } catch (err) {

    console.error(
      "❌ SMTP unavailable:",
      err.message
    );

    return null;
  }
}

/* =========================================================
   INIT MAILER (NON-BLOQUANT)
========================================================= */

export async function initMailer() {

  createTransporter()
    .then((t) => {
      transporter = t;

      if (t) {
        console.log("📧 Mailer ready");
      } else {
        console.warn("⚠ Mailer disabled (no SMTP)");
      }
    })
    .catch((err) => {
      console.warn(
        "⚠ Mailer init failed:",
        err.message
      );
    });
}

/* =========================================================
   SEND MAIL SAFE
========================================================= */

export async function sendMail(mailOptions) {

  if (!transporter) {

    return {
      success: false,
      message: "SMTP not available"
    };
  }

  try {

    const info =
      await transporter.sendMail(mailOptions);

    return {
      success: true,
      info
    };

  } catch (err) {

    return {
      success: false,
      error: err.message
    };
  }
}

/* =========================================================
   CONFIRMATION EMAIL
========================================================= */

export async function sendConfirmationEmail(data) {

  console.log(
    "📨 Sending email:",
    data.email
  );

  try {

    const email =
      buildConfirmationEmail(data);

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
        "⚠ Email not sent:",
        result.message || result.error
      );

      return result;
    }

    console.log(
      "✅ Email sent:",
      result.info.messageId
    );

    return result;

  } catch (err) {

    console.error(
      "❌ Email crash:",
      err.message
    );

    return {
      success: false,
      error: err.message
    };
  }
}