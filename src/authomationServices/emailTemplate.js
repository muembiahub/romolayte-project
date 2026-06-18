/**
 * Sécurise les chaînes de caractères contre les injections HTML/XSS.
 * @param {string} str 
 * @returns {string}
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function buildConfirmationEmail(data) {
  // Définition et assainissement des variables avec valeurs par défaut
  const rawName = data?.name?.trim() || "";
  const nameText = rawName || "Client";
  const nameHtml = escapeHtml(rawName) || "Client";

  const rawService = data?.service_name?.trim() || "";
  const serviceText = rawService || "Non spécifié";
  const serviceHtml = escapeHtml(rawService) || "Non spécifié";

  const rawLocation = data?.location?.trim() || "";
  const locationText = rawLocation || "Non spécifiée";
  const locationHtml = escapeHtml(rawLocation) || "Non spécifiée";

  const rawCoordinates = data?.coordinates?.trim() || "";
  const coordinatesText = rawCoordinates || "Non spécifiées";
  const coordinatesHtml = escapeHtml(rawCoordinates) || "Non spécifiées";

  const rawStatus = data?.status?.trim() || "";
  const statusHtml = escapeHtml(rawStatus) || "En attente";

  return {
    subject: "✨ Confirmation de votre demande",
    text: `Bonjour ${nameText},

Votre demande a été reçue.

Service: ${serviceText}
Ville: ${locationText}

Merci,
Romolayte`.trim(),
    html: `
<div style="min-height:100vh;background:#f3f4f6;padding:40px 16px;font-family:ui-sans-serif,system-ui">

  <!-- CENTER CONTAINER -->
  <div style="max-width:600px;margin:auto">

    <!-- CARD -->
    <div style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.08)">

      <!-- HEADER -->
      <div style="background:#111827;padding:24px;text-align:center">
        <h1 style="color:white;font-size:18px;margin:0;letter-spacing:1px">
          Romolayte
        </h1>
        <p style="color:#9ca3af;margin:6px 0 0;font-size:13px">
          Confirmation de votre demande
        </p>
      </div>

      <!-- BODY -->
      <div style="padding:28px">

        <h2 style="font-size:20px;margin:0 0 10px;color:#111827">
          Bonjour ${nameHtml},
        </h2>

        <p style="color:#6b7280;font-size:14px;line-height:1.6">
          Votre demande a été <b style="color:#111827">enregistrée avec succès</b>.
          Nous allons la traiter rapidement.
        </p>

        <!-- INFO GRID -->
        <div style="margin-top:20px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:16px">

          <div style="margin-bottom:10px">
            <p style="margin:0;color:#374151;font-size:13px">
              📦 <b>Service</b>
            </p>
            <p style="margin:2px 0 0;color:#111827;font-size:14px">
              ${serviceHtml}
            </p>
          </div>

          <div style="margin-bottom:10px">
            <p style="margin:0;color:#374151;font-size:13px">
              📍 <b>Localisation</b>
            </p>
            <p style="margin:2px 0 0;color:#111827;font-size:14px">
              ${locationHtml}
            </p>
          </div>
          <div style="margin-bottom:10px">
            <p style="margin:0;color:#374151;font-size:13px">
              📍 <b>Coordonnées</b>
            </p>
            <p style="margin:2px 0 0;color:#111827;font-size:14px">
              ${coordinatesHtml}
            </p>
          </div>
          

          <div>
            <p style="margin:0;color:#374151;font-size:13px">
              📊 <b>Statut</b>
            </p>
            <span style="display:inline-block;margin-top:4px;background:#dbeafe;color:#1e40af;padding:4px 10px;border-radius:999px;font-size:12px">
              ${statusHtml}
            </span>
          </div>

        </div>

        <!-- BUTTON -->
        <div style="text-align:center;margin-top:25px">
          <a href="https://romolayte.space"
             style="display:inline-block;background:#2563eb;color:white;padding:12px 18px;border-radius:10px;text-decoration:none;font-size:14px;font-weight:500">
            Voir plus de services
          </a>
        </div>

        <p style="margin-top:25px;color:#9ca3af;font-size:12px;text-align:center">
          © ${new Date().getFullYear()} Romolayte • Tous droits réservés
        </p>

      </div>
    </div>

  </div>
</div>
    `,
  };
}
