document.addEventListener("DOMContentLoaded", () => {
  const hamburgerBtn = document.getElementById("rom-hamburgerBtn");
  const sidebar = document.getElementById("rom-sidebar");
  const userMenu = document.getElementById("rom-userMenu");
  const userInfoBtn = document.getElementById("rom-userInfoBtn");
  const themeSwitch = document.getElementById("rom-theme-switch");

  // --- Toggle sidebar (mobile) ---
  hamburgerBtn.addEventListener("click", () => {
    sidebar.classList.toggle("active");
  });

  // Fermer la sidebar si clic en dehors
  document.addEventListener("click", (e) => {
    if (!sidebar.contains(e.target) && !hamburgerBtn.contains(e.target)) {
      sidebar.classList.remove("active");
    }
  });

  // --- Menu utilisateur ---
  userInfoBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    userMenu.classList.toggle("active");
  });

  document.addEventListener("click", (e) => {
    if (!userMenu.contains(e.target)) {
      userMenu.classList.remove("active");
    }
  });

// --- Gestion du Thème (Dark/Light) avec Préférence Système ---

const themeSwitch = document.querySelector("#themeSwitch"); // Assurez-vous que l'ID correspond
const storageKey = "theme";
const darkClass = "dark-mode";

// 1. Déterminer le thème initial (Stocké -> Système -> Clair)
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem(storageKey);
  if (savedTheme) return savedTheme;

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
};

// 2. Appliquer le thème au DOM
const applyTheme = (theme) => {
  if (theme === "dark") {
    document.documentElement.classList.add(darkClass); // Utilise documentElement (html) pour impacter tout le CSS
    if (themeSwitch) themeSwitch.checked = true;
  } else {
    document.documentElement.classList.remove(darkClass);
    if (themeSwitch) themeSwitch.checked = false;
  }
};

// 3. Initialisation au chargement
const currentTheme = getInitialTheme();
applyTheme(currentTheme);

// 4. Écouteur de changement sur le switch
if (themeSwitch) {
  themeSwitch.addEventListener("change", (e) => {
    const newTheme = e.target.checked ? "dark" : "light";
    applyTheme(newTheme);
    localStorage.setItem(storageKey, newTheme);
  });
}




// Sélectionner tous les <select> de statut
document.querySelectorAll("select[id^='status-']").forEach(select => {
  // Fonction pour appliquer la couleur selon le statut
  const applyStatusColor = (el, status) => {
    el.style.backgroundColor = ""; // reset
    switch (status) {
      case "Validé":
        el.style.backgroundColor = "#28a745"; // vert
        el.style.color = "white";
        break;
      case "En cours":
        el.style.backgroundColor = "#ff9800"; // orange
        el.style.color = "white";
        break;
      case "Recus":
        el.style.backgroundColor = "#007bff"; // bleu
        el.style.color = "white";
        break;
      case "Rejeté":
        el.style.backgroundColor = "#dc3545"; // rouge
        el.style.color = "white";
        break;
      case "Supprimé":
        el.style.backgroundColor = "#6c757d"; // gris
        el.style.color = "white";
        break;
      default:
        el.style.backgroundColor = "#f0f0f0";
        el.style.color = "black";
    }
  };

  // Appliquer la couleur initiale
  applyStatusColor(select, select.value);

  // Listener sur changement
  select.addEventListener("change", async (e) => {
    const demandeId = e.target.dataset.id;
    const newStatus = e.target.value;
    const msgEl = document.getElementById(`status-msg-${demandeId}`);

    // Appliquer couleur dynamique
    applyStatusColor(e.target, newStatus);

    try {
      // Requête vers ton backend (adapter l’URL selon ton route Express)
      const res = await fetch(`/dashboard/demande_recus/${demandeId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        msgEl.textContent = "✅ Statut mis à jour avec succès";
        msgEl.style.color = "green";
      } else {
        msgEl.textContent = "❌ Erreur lors de la mise à jour";
        msgEl.style.color = "red";
      }
    } catch (err) {
      msgEl.textContent = "⚠️ Problème de connexion";
      msgEl.style.color = "orange";
    }
  });
});

  

});
