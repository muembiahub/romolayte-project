// helpers.js

/**
 * Retourne l'URL fournie ou une image par défaut si elle est vide/null.
 * @param {string|null} url - L'URL de l'image
 * @param {string} fallback - L'image par défaut
 * @returns {string} - L'URL finale
 */
export function withDefaultImage(url, fallback) {
  return url && url.trim() !== '' ? url : fallback;
}

/**
 * Formate une date en style lisible (ex: "Mars 2026").
 * @param {string|Date} date - La date à formater
 * @returns {string} - Date formatée
 */
export function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
}
