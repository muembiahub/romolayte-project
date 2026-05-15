import { Resend } from "resend";

/* =====================================================
   RESEND CLIENT
===================================================== */

const resend = new Resend(
  process.env.RESEND_API_KEY
);

/* =====================================================
   SEND CONFIRMATION EMAIL
===================================================== */

export async function sendConfirmationEmail(data) {

  try {

    /* ================= VALIDATION ================= */

    if (!data) {
      throw new Error("Missing email payload");
    }

    if (!data.email) {
      throw new Error("Missing recipient email");
    }

    if (!data.name) {
      data.name = "Client";
    }

    console.log(
      "📨 Préparation email pour :",
      data.email
    );

    /* ================= TEMPLATE ================= */

    const htmlTemplate = `
  <div style="background-color: #f8fafc; padding: 40px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; min-height: 100%;" >
    <div style="max-width: 540px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); border: 1px solid #e2e8f0;" >
      
      <!-- HEADER : LOGO -->
      <div style="text-align: center; margin-bottom: 32px;" >
        <img 
          src="https://ofhmwjzxakhgbafywxwp.supabase.co/storage/v1/object/public/logos_category/romo_logo.jpg" 
          alt="Logo" 
          width="100" 
          style="width: 100px; max-width: 100px; height: auto; border: 0; display: inline-block;" 
        />
      </div>

      <!-- TITRE PRINCIPAL -->
      <h1 style="color: #0f172a; font-size: 22px; font-weight: 700; text-align: center; margin: 0 0 16px 0; letter-spacing: -0.025em;" >
        Bonjour ${data.name},
      </h1>

      <!-- CORPS DU MESSAGE -->
      <div style="color: #334155; font-size: 15px; line-height: 1.6; text-align: center; margin-bottom: 32px;" >
        <p style="margin: 0 0 8px 0;" >Votre demande de service a bien été reçue.</p>
        <p style="margin: 0;" >Notre équipe analyse votre dossier et vous contactera très rapidement.</p>
      </div>

      <!-- ENCADRÉ RÉCAPITULATIF (Détails de la demande) -->
      <div style="background-color: #f1f5f9; border-radius: 12px; padding: 20px; margin-bottom: 32px; font-size: 14px; line-height: 1.5; color: #334155;" >
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" >
          <tr>
            <td style="padding-bottom: 12px; border-bottom: 1px solid #e2e8f0;" >
              <strong style="color: #0f172a;" >Service :</strong>
            </td>
            <td align="right" style="padding-bottom: 12px; border-bottom: 1px solid #e2e8f0; color: #475569;" >
              ${data.service_name || "Non spécifié"}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;" >
              <strong style="color: #0f172a;" >Ville :</strong>
            </td>
            <td align="right" style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #475569;" >
              ${data.location || "Non spécifiée"}
            </td>
          </tr>
          <tr>
            <td style="padding-top: 12px;" >
              <strong style="color: #0f172a;" >Statut :</strong>
            </td>
            <td align="right" style="padding-top: 12px;" >
              <span style="background-color: #e2e8f0; color: #0f172a; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 600; display: inline-block;" >
                ${data.status || "Reçue"}
              </span>
            </td>
          </tr>
        </table>
      </div>

      <!-- LIGNE DE SÉPARATION -->
      <hr style="margin: 0 0 24px 0; border: none; border-top: 1px solid #e2e8f0;" />

      <!-- FOOTER -->
      <div style="text-align: center;" >
        <p style="margin: 0; font-size: 13px; color: #64748b; font-weight: 500;" >
          Merci pour votre confiance.
        </p>
      </div>

    </div>
  </div>
`;


    /* ================= SEND EMAIL ================= */

    const response = await resend.emails.send({

      from: "onboarding@resend.dev",

      to: data.email,

      subject: "Confirmation de votre demande",

      html: htmlTemplate,
    });

    /* ================= SUCCESS ================= */

    console.log(
      "✅ Email envoyé avec succès :",
      response.id
    );

    return response;

  } catch (error) {

    /* ================= ERROR ================= */

    console.error(
      "❌ Erreur sendConfirmationEmail :",
      error.message
    );

    throw error;
  }
}