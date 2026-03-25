document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const formTitle = document.getElementById("form-title");
  const toggleText = document.getElementById("toggle-text");
  const toggleBtn = document.getElementById("toggle-btn");

  // === Toast utilitaire ===
  function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 100);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // === Effet shake sur champ en erreur ===
  function shakeField(fieldEl) {
    if (!fieldEl) return;
    fieldEl.classList.add("shake");
    setTimeout(() => fieldEl.classList.remove("shake"), 500);
  }

  // === Toggle Connexion / Inscription ===
  toggleBtn.addEventListener("click", () => {
    if (loginForm.classList.contains("active")) {
      loginForm.classList.remove("active");
      signupForm.classList.add("active");
      formTitle.textContent = "Inscription";
      toggleText.textContent = "Déjà inscrit ?";
      toggleBtn.textContent = "Se connecter";
    } else {
      signupForm.classList.remove("active");
      loginForm.classList.add("active");
      formTitle.textContent = "Connexion";
      toggleText.textContent = "Pas de compte ?";
      toggleBtn.textContent = "Créer un compte";
    }
  });

  // === Affichage/Masquage mot de passe ===
  document.querySelectorAll(".toggle-password").forEach(toggle => {
    toggle.addEventListener("click", function () {
      const input = this.previousElementSibling;
      if (input.type === "password") {
        input.type = "text";
        this.innerHTML = '<i class="fas fa-eye-slash"></i>';
      } else {
        input.type = "password";
        this.innerHTML = '<i class="fas fa-eye"></i>';
      }
    });
  });

  // === Soumission du formulaire de connexion ===
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const usernameOrEmail = document.getElementById("login-identifier").value;
    const password = document.getElementById("login-password").value;

    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameOrEmail, password })
      });

      const data = await response.json();

      // Nettoyer les erreurs existantes
      document.getElementById("usernameError").innerText = "";
      document.getElementById("passwordError").innerText = "";
      document.getElementById("login-identifier").classList.remove("error-field");
      document.getElementById("login-password").classList.remove("error-field");

      if (!data.success) {
        if (data.field === "usernameOrEmail") {
          document.getElementById("usernameError").innerText = "⚠️ " + data.message;
          const fieldEl = document.getElementById("login-identifier");
          fieldEl.classList.add("error-field");
          shakeField(fieldEl);
        } else if (data.field === "password") {
          document.getElementById("passwordError").innerText = "⚠️ " + data.message;
          const fieldEl = document.getElementById("login-password");
          fieldEl.classList.add("error-field");
          shakeField(fieldEl);
        } else {
          showToast(data.message, "error");
        }
      } else {
        showToast("✅ Connexion réussie, redirection...", "success");
        setTimeout(() => window.location.href = data.redirect, 1500);
      }
    } catch (err) {
      showToast("❌ Erreur réseau ou serveur. Réessayez plus tard.", "error");
    }
  });

  // === Soumission du formulaire d'inscription ===
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      firstname: document.getElementById("signup-firstname").value,
      lastname: document.getElementById("signup-lastname").value,
      birthday: document.getElementById("signup-birthday").value,
      category_id: document.getElementById("signup-category").value,
      service_id: document.getElementById("signup-service").value,
      username: document.getElementById("signup-username").value,
      whatsapp: document.getElementById("signup-phone").value,
      email: document.getElementById("signup-email").value,
      password: document.getElementById("signup-password").value,
      confirm_password: document.getElementById("signup-confirm").value
    };

    try {
      const response = await fetch("/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      // Nettoyer les erreurs visuelles
      document.querySelectorAll("#signup-form .error-field").forEach(el => el.classList.remove("error-field"));

      if (!data.success) {
        if (data.field) {
          const fieldEl = document.getElementById(`signup-${data.field}`);
          if (fieldEl) {
            fieldEl.classList.add("error-field");
            shakeField(fieldEl);
          }
        }
        showToast("❌ " + data.message, "error");
      } else {
        showToast("✅ Compte créé avec succès. Veuillez vous connecter.", "success");
        setTimeout(() => window.location.href = data.redirect, 3000);
      }
    } catch (err) {
      showToast("❌ Erreur réseau ou serveur. Réessayez plus tard.", "error");
    }
  });

  // === Chargement dynamique des services ===
  document.getElementById("signup-category").addEventListener("change", async function() {
    const categoryId = this.value;
    const serviceSelect = document.getElementById("signup-service");

    if (!categoryId || categoryId === "") {
      serviceSelect.innerHTML = "<option value=''>Please select a category first</option>";
      return;
    }

    serviceSelect.innerHTML = "<option>Loading...</option>";

    try {
      const response = await fetch(`/services-by-category/${categoryId}`);
      const services = await response.json();

      serviceSelect.innerHTML = "";
      if (services.length > 0) {
        services.forEach(service => {
          const option = document.createElement("option");
          option.value = service.service_id;
          option.textContent = service.name;
          serviceSelect.appendChild(option);
        });
      } else {
        serviceSelect.innerHTML = "<option>No services available</option>";
      }
    } catch (err) {
      serviceSelect.innerHTML = "<option>Error loading services</option>";
      showToast("❌ Impossible de charger les services.", "error");
    }
  });

  // === Feedback après inscription (URL params) ===
  const params = new URLSearchParams(window.location.search);
  if (params.get("registered") === "true") {
    showToast("✅ Votre compte a été créé avec succès. Veuillez vous connecter.", "success");
  } else if (params.get("registered") === "false") {
    showToast("❌ Une erreur s'est produite lors de la création de votre compte.", "error");
  }
});
