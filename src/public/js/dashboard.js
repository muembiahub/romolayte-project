  document.addEventListener("DOMContentLoaded", () => {
    // Sélection des éléments
const hamburgerBtn = document.getElementById("hamburgerBtn");
const sidebar = document.getElementById("sidebar");

// Toggle sidebar au clic sur le hamburger
hamburgerBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

// Optionnel : fermer la sidebar si on clique en dehors (mobile)
document.addEventListener("click", (e) => {
  if (!sidebar.contains(e.target) && !hamburgerBtn.contains(e.target)) {
    sidebar.classList.remove("open");
  }
});


    const userMenu = document.querySelector(".user-menu");
    const userInfoBtn = document.querySelector(".user-info");
    const themeSwitch = document.getElementById("theme-switch");

    // --- Menu utilisateur ---
    userInfoBtn.addEventListener("click", () => {
      userMenu.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
      if (!userMenu.contains(e.target)) {
        userMenu.classList.remove("active");
      }
    });

    // --- Dark/Light mode avec sauvegarde ---
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
      themeSwitch.checked = true;
    }

    themeSwitch.addEventListener("change", () => {
      if (themeSwitch.checked) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("theme", "dark");
      } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("theme", "light");
      }
    });
  });
