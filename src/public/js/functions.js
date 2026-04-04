/* =======================================================
   GLOBAL TOAST
======================================================= */
function initGlobalToast() {
  const toastEl = document.getElementById("appToast");
  const toastBody = document.getElementById("toastMessage");
  if (!toastEl || !toastBody) return;

  const toast = new bootstrap.Toast(toastEl, { delay: 4000 });

  window.showToast = (message, type = "success") => {
    toastEl.className = `toast align-items-center text-bg-${type} border-0`;
    toastBody.textContent = message;
    toast.show();
  };

  const params = new URLSearchParams(window.location.search);
  if (params.has("success")) showToast("Action effectuée avec succès ✅");
  if (params.has("error")) showToast("Une erreur est survenue ❌", "danger");
}
// =======================================================
//  Research function for search bar (live search dropdown)
// =======================================================

function initLiveSearch(inputId, resultsId, apiUrl = '/search') {
  const searchInput = document.getElementById(inputId);
  const resultsDiv = document.getElementById(resultsId);
  let timer;

  // Style dropdown compact
  resultsDiv.classList.add('dropdown-menu', 'w-100');

  searchInput.addEventListener('input', () => {
    clearTimeout(timer);
    const query = searchInput.value.trim();

    if (!query) {
      resultsDiv.innerHTML = '';
      resultsDiv.classList.remove('show');
      return;
    }

    // délai pour éviter trop d’appels (debounce)
    timer = setTimeout(async () => {
      try {
        const res = await fetch(`${apiUrl}?q=${encodeURIComponent(query)}`);
        const data = await res.json();

        let html = '';

        // Services
        if (data.services.length > 0) {
          data.services.forEach(s => {
            html += `<a href="/services-details/${s.service_id}" class="dropdown-item">
                       ${highlightMatch(s.name, query)}
                     </a>`;
          });
        }

        // Catégories
        if (data.categories.length > 0) {
          data.categories.forEach(c => {
            html += `<a href="/servicecategory/${c.category_id}" class="dropdown-item">
                       ${highlightMatch(c.name, query)}
                     </a>`;
          });
        }

        if (html === '') {
          html = '<span class="dropdown-item text-muted">Aucun résultat trouvé</span>';
        }

        resultsDiv.innerHTML = html;
        resultsDiv.classList.add('show');
      } catch (err) {
        console.error(err);
        resultsDiv.innerHTML = '<span class="dropdown-item text-danger">Erreur lors de la recherche</span>';
        resultsDiv.classList.add('show');
      }
    }, 300);
  });
}

// Fonction utilitaire pour mettre en surbrillance le texte recherché
function highlightMatch(text, query) {
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<span class="text-danger fw-bold">$1</span>');
}




















/* =======================================================
   SERVICE MODAL
======================================================= */
function initServiceModal() {
  const modalEl = document.getElementById("serviceRequestModal");
  const openBtn = document.getElementById("openServiceModalBtn");
  if (!modalEl || !openBtn) return;

  const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
  openBtn.addEventListener("click", () => {
    document.getElementById("modal-category").value = openBtn.dataset.category || "";
    document.getElementById("modal-service").value = openBtn.dataset.service || "";
    document.getElementById("modal-price").value = openBtn.dataset.price || "";
    modal.show();
  });
}


// =======================================================
//    GPS-ONLY LOCATION (Request form)
// =======================================================

function initGpsOnlyLocation() {
  const cityInput = document.getElementById("cityInput");
  const locationInput = document.getElementById("locationInput");
  const getLocationBtn = document.getElementById("getLocationBtn");

  if (!cityInput || !locationInput || !getLocationBtn) return;

  /* 🔒 Sécurité : ville toujours non modifiable */
  cityInput.value = "";
  cityInput.readOnly = true;

  /* ================= CLICK GPS ================= */
  getLocationBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
      alert("La géolocalisation n’est pas supportée sur cet appareil.");
      return;
    }

    getLocationBtn.disabled = true;
    getLocationBtn.innerHTML =
      '<span class="spinner-border spinner-border-sm me-1"></span> Localisation en cours...';

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lon = position.coords.longitude.toFixed(6);

        /* ✅ GPS */
        locationInput.value = `${lat}, ${lon}`;

        /* ✅ Reverse geocoding (OpenStreetMap) */
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
          );

          if (response.ok) {
            const data = await response.json();
            const city =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              data.address.suburb ||
              "";
            console.log("Valeur city détectée:", cityInput.value);


            cityInput.value = city || "Localisation détectée";
          } else {
            cityInput.value = "Localisation détectée";
          }
        } catch (e) {
          console.warn("Reverse geocoding impossible.");
          cityInput.value = "Localisation détectée";
        }

        /* ✅ UX success */
        getLocationBtn.textContent = "Position détectée ✅";
        getLocationBtn.classList.remove("btn-outline-primary");
        getLocationBtn.classList.add("btn-outline-success");
      },

      () => {
        /* ❌ GPS refusé */
        alert(
          "La géolocalisation GPS est obligatoire pour envoyer la demande."
        );

        locationInput.value = "";
        cityInput.value = "";

        getLocationBtn.disabled = false;
        getLocationBtn.textContent = "Utiliser ma position";
      }
    );
  });
}





// =======================================================
//    SERVICE REQUEST FORM – BOOTSTRAP VALIDATION + GPS
// =======================================================


function initServiceRequestBootstrapValidation() {
  const modal = document.getElementById("serviceRequestModal");
  if (!modal) return;

  const form = modal.querySelector("form.needs-validation");
  const locationInput = document.getElementById("locationInput");
  const cityInput = document.getElementById("cityInput");
  const gpsBtn = document.getElementById("getLocationBtn");

  if (!form || !locationInput || !gpsBtn) return;

  /* 🔒 Ville toujours non modifiable */
  cityInput.readOnly = true;


  /* ================= SUBMIT ================= */
  form.addEventListener(
    "submit",
    (event) => {
      let valid = true;

      // Validation HTML5 standard
      if (!form.checkValidity()) {
        valid = false;
      }

      // Validation GPS obligatoire
      if (!locationInput.value) {
        locationInput.classList.add("is-invalid");
        valid = false;
      } else {
        locationInput.classList.remove("is-invalid");
        locationInput.classList.add("is-valid");
      }

      if (!valid) {
        event.preventDefault();
        event.stopPropagation();
      }

      form.classList.add("was-validated");
    },
    false
  );

  /* ================= GPS CLICK ================= */
  gpsBtn.addEventListener("click", () => {
    locationInput.classList.remove("is-invalid");
    locationInput.classList.remove("is-valid");

    if (!navigator.geolocation) {
      locationInput.classList.add("is-invalid");
      return;
    }

    gpsBtn.disabled = true;
    gpsBtn.innerHTML =
      '<span class="spinner-border spinner-border-sm me-1"></span> Localisation...';

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lon = position.coords.longitude.toFixed(6);

        // ✅ GPS OK
        locationInput.value = `${lat}, ${lon}`;
        locationInput.classList.add("is-valid");

        // 🌍 Reverse geocoding
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
          );
          if (res.ok) {
            const data = await res.json();
            cityInput.value =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              data.address.suburb ||
              "Localisation détectée";
          } else {
            cityInput.value = "Localisation détectée";
          }
        } catch {
          cityInput.value = "Localisation détectée";
        }

        // UX
        gpsBtn.classList.remove("btn-outline-primary");
        gpsBtn.classList.add("btn-outline-success");
        gpsBtn.textContent = "Position détectée ✅";
      },
      () => {
        // ❌ GPS refusé
        locationInput.value = "";
        locationInput.classList.add("is-invalid");

        gpsBtn.disabled = false;
        gpsBtn.textContent = "Utiliser ma position";
      }
    );
  });
}

/* =======================================================
   AUTH TOGGLE
======================================================= */
function initAuthToggle() {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const toggleBtn = document.getElementById("toggle-btn");
  const toggleText = document.getElementById("toggle-text");
  const formTitle = document.getElementById("form-title");
  if (!loginForm || !signupForm || !toggleBtn || !toggleText || !formTitle) return;

  if (toggleBtn.dataset.bound === "true") return;
  toggleBtn.dataset.bound = "true";

  toggleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const isLogin = loginForm.classList.contains("active");

    if (isLogin) {
      loginForm.classList.remove("active");
      signupForm.classList.add("active");
      formTitle.textContent = "Créer un compte";
      toggleText.textContent = "Déjà un compte ?";
      toggleBtn.textContent = "Se connecter";
    } else {
      signupForm.classList.remove("active");
      loginForm.classList.add("active");
      formTitle.textContent = "Connexion";
      toggleText.textContent = "Pas encore de compte ?";
      toggleBtn.textContent = "Créer un compte";
    }
  });
}

/* =======================================================
   DARK MODE
======================================================= */
function initDarkMode() {
  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;
  const icon = toggle.querySelector("i");

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    icon.classList.replace("fa-moon", "fa-sun");
  }

  toggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    icon.classList.toggle("fa-moon", !isDark);
    icon.classList.toggle("fa-sun", isDark);
  });
}

/* =======================================================
   SMART NAVBAR
======================================================= */
function initSmartNavbar() {
  const navbar = document.querySelector(".navbar.fixed-top");
  if (!navbar) return;

  let lastY = window.scrollY;
  window.addEventListener("scroll", () => {
    const currentY = window.scrollY;
    if (currentY > lastY && currentY > 80) {
      navbar.classList.add("nav-hidden");
    } else {
      navbar.classList.remove("nav-hidden");
    }
    lastY = currentY;
  });
}



/* =======================================================
    CATEGORY-SERVICE SELECT (Signup)
======================================================= */

function initCategoryServiceSelect() {
  const categorySelect = document.getElementById("signup-category");
  const serviceSelect = document.getElementById("signup-service");

  if (!categorySelect || !serviceSelect) return;

  // État initial
  serviceSelect.disabled = true;
  serviceSelect.innerHTML =
    '<option value="">-- Choisissez d’abord une catégorie --</option>';

  categorySelect.addEventListener("change", async () => {
    const categoryId = categorySelect.value;

    // Reset service select
    serviceSelect.disabled = true;
    serviceSelect.innerHTML =
      '<option value="">Chargement des services...</option>';

    if (!categoryId) {
      serviceSelect.innerHTML =
        '<option value="">-- Choisissez d’abord une catégorie --</option>';
      return;
    }

    try {
      const response = await fetch(`/services-by-category/${categoryId}`);
      const result = await response.json();

      serviceSelect.innerHTML = "";

      if (!result.success || result.services.length === 0) {
        serviceSelect.innerHTML =
          '<option value="">Aucun service disponible</option>';
        return;
      }

      // Activer le select service
      serviceSelect.disabled = false;

      // Option par défaut
      serviceSelect.innerHTML =
        '<option value="">-- Sélectionner un service --</option>';

      result.services.forEach(service => {
        const option = document.createElement("option");
        option.value = service.service_id;
        option.textContent = service.name;
        serviceSelect.appendChild(option);
      });

    } catch (error) {
      console.error("Erreur chargement services:", error);
      serviceSelect.innerHTML =
        '<option value="">Erreur de chargement</option>';
    }
  });
}

