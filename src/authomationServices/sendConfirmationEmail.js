import { Resend } from "resend";
import { buildConfirmationEmail } from "./emailTemplate.js";

/* =========================================================
   INIT RESEND
========================================================= */

const resend = new Resend(process.env.RESEND_API_KEY);

/* =========================================================
   SEND MAIL SAFE
========================================================= */

export async function sendMail(mailOptions) {
  try {
    const info = await resend.emails.send(mailOptions);
    return { success: true, info };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/* =========================================================
   CONFIRMATION EMAIL
========================================================= */

export async function sendConfirmationEmail(data) {
  console.log("📨 Sending email:", data.email);

  try {
    const email = buildConfirmationEmail(data);

    const result = await sendMail({
      from: `Romolayte <${process.env.ZOHO_EMAIL}>`, // tu gardes ton domaine
      to: data.email,
      subject: email.subject,
      text: email.text,
      html: email.html,
    });

    if (!result.success) {
      console.warn("⚠ Email not sent:", result.error);
      return result;
    }

    console.log("✅ Email sent:", result.info.id);
    return result;
  } catch (err) {
    console.error("❌ Email crash:", err.message);
    return { success: false, error: err.message };
  }
}

