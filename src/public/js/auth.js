document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const formTitle = document.getElementById("form-title");
  const toggleText = document.getElementById("toggle-text");
  const toggleBtn = document.getElementById("toggle-btn");

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
  document.querySelectorAll(".toggle-password").forEach(toggle => {
  toggle.addEventListener("click", function () {
    const input = this.previousElementSibling; // l'input juste avant
    if (input.type === "password") {
      input.type = "text";
      this.innerHTML = '<i class="fas fa-eye-slash"></i>'; // changer l’icône
    } else {
      input.type = "password";
      this.innerHTML = '<i class="fas fa-eye"></i>';
    }
  });
});
document.getElementById("login-form").addEventListener("submit", async (e) => {
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
        document.getElementById("login-identifier").classList.add("error-field");
      } else if (data.field === "password") {
        document.getElementById("passwordError").innerText = "⚠️ " + data.message;
        document.getElementById("login-password").classList.add("error-field");
      } else {
        alert(data.message);
      }
    } else {
      window.location.href = data.redirect;
    }
  } catch (err) {
    alert("Erreur réseau ou serveur. Réessayez plus tard.");
  }
});






//  =============================== ==============================
document.getElementById("signup-category").addEventListener("change", async function() {
  const categoryId = this.value;
  const serviceSelect = document.getElementById("signup-service");

  // Si aucune catégorie n'est choisie
  if (!categoryId || categoryId === "") {
    serviceSelect.innerHTML = "<option value=''>Please select a category first</option>";
    return;
  }

  // Sinon, on charge les services
  serviceSelect.innerHTML = "<option>Loading...</option>";

  try {
    const response = await fetch(`/services-by-category/${categoryId}`);
    const services = await response.json();

    serviceSelect.innerHTML = "";
    if (services.length > 0) {
      services.forEach(service => {
        const option = document.createElement("option");
        option.value = service.service_id;
        option.textContent = `${service.name}`;
        serviceSelect.appendChild(option);
      });
    } else {
      serviceSelect.innerHTML = "<option>No services available</option>";
    }
  } catch (err) {
    serviceSelect.innerHTML = "<option>Error loading services</option>";
  }
});
 const params = new URLSearchParams(window.location.search);
  if (params.get("registered") === "true") {
    alert("Votre compte a été créé avec succès. Veuillez vous connecter.");
  } else if (params.get("registered") === "false") {
    alert("Une erreur s'est produite lors de la création de votre compte.");
  }



});
