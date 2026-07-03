import { BrevoClient } from "@getbrevo/brevo";
import { buildConfirmationEmail } from "./emailTemplate.js";

/* =========================================================
   INIT BREVO CLIENT (Syntaxe moderne v3/v4+)
========================================================= */
const brevo = new BrevoClient({ 
  apiKey: process.env.BREVO_API_KEY 
});

/* =========================================================
   SEND MAIL SAFE
========================================================= */
export async function sendMail(mailOptions) {
  try {
    // Utilisation de la méthode unifiée par API HTTP
    const data = await brevo.transactionalEmails.sendTransacEmail({
      sender: { name: "Romolayte", email: process.env.BREVO_SENDER_EMAIL },
      to: [{ email: mailOptions.to }],
      subject: mailOptions.subject,
      htmlContent: mailOptions.html,
      ...(mailOptions.text && { textContent: mailOptions.text }) // Optionnel
    });

    return { success: true, info: data };
  } catch (err) {
    // Récupération de l'erreur propre renvoyée par l'API
    const errorMessage = err.response?.body?.message || err.message;
    return { success: false, error: errorMessage };
  }
}

/* =========================================================
   CONFIRMATION EMAIL
========================================================= */
export async function sendConfirmationEmail(data) {
  console.log("📨 Sending email via Brevo API:", data.email);

  try {
    const email = buildConfirmationEmail(data);

    const result = await sendMail({
      to: data.email,
      subject: email.subject,
      text: email.text,
      html: email.html,
    });

    if (!result.success) {
      console.warn("⚠ Email not sent:", result.error);
      return result;
    }

    // Le résultat contient directement la réponse de l'API
    console.log("✅ Email sent via Brevo API. Response:", result.info);
    return result;
  } catch (err) {
    console.error("❌ Email crash:", err.message);
    return { success: false, error: err.message };
  }
}
