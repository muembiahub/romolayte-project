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
