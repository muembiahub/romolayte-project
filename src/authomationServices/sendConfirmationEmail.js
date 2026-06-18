import nodemailer from "nodemailer";
import  {buildConfirmationEmail} from "./emailTemplate.js";

/* =========================
   TRANSPORT ZOHO
========================= */

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.ZOHO_EMAIL,
    pass: process.env.ZOHO_PASSWORD,
  },
});

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