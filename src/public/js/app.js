document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const navbar = document.getElementById("navbar");

  // =================== Menu hamburger ===================
  hamburger.addEventListener("click", () => {
    navbar.classList.toggle("active");
    hamburger.classList.toggle("open");
  });

  // Navigation sans <a>
  const items = document.querySelectorAll(".menu-item");
  items.forEach(item => {
    item.addEventListener("click", () => {
      const link = item.getAttribute("data-link");
      window.location.href = link;
    });
  });

  // =================== Barre de recherche ===================
  const searchToggle = document.getElementById("search-toggle");
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");

  searchToggle.addEventListener("click", () => {
    searchInput.classList.toggle("active");
    if (searchInput.classList.contains("active")) {
      searchInput.focus();
    } else {
      searchResults.classList.remove("show");
    }
  });

  let debounceTimer;
  let currentIndex = -1;

  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      const query = searchInput.value.trim();
      if (query.length > 2) {
        searchResults.innerHTML = "<p>Recherche en cours...</p>";
        searchResults.classList.add("show");

        try {
          const response = await fetch(`/search?q=${encodeURIComponent(query)}`);
          const data = await response.json();
          renderResults(data, query);
        } catch (err) {
          console.error("Erreur recherche:", err);
          searchResults.innerHTML = "<p>Erreur serveur</p>";
          searchResults.classList.add("show");
        }
      } else {
        searchResults.classList.remove("show");
      }
    }, 300);
  });

  // Fonction pour afficher les résultats avec highlight
  // Fonction pour afficher les résultats avec highlight et <a>
function renderResults(data, query) {
  searchResults.innerHTML = "";
  currentIndex = -1;

  const highlight = (text, q) => {
    const regex = new RegExp(`(${q})`, "gi");
    return text.replace(regex, "<strong>$1</strong>");
  };

  if ((data.services && data.services.length) || (data.categories && data.categories.length)) {
    if (data.services.length > 0) {
      const title = document.createElement("h4");
      title.textContent = "Services";
      searchResults.appendChild(title);

      data.services.forEach(s => {
        const a = document.createElement("a");
        a.innerHTML = highlight(s.name, query);
        a.href = `/services-details/${s.service_id}`;
        a.style.display = "block"; // chaque résultat sur une ligne
        searchResults.appendChild(a);
      });
    }

    if (data.categories.length > 0) {
      const title = document.createElement("h4");
      title.textContent = "Catégories";
      searchResults.appendChild(title);

      data.categories.forEach(c => {
        const a = document.createElement("a");
        a.innerHTML = highlight(c.name, query);
        a.href = `/servicecategory/${c.category_id}`;
        a.style.display = "block";
        searchResults.appendChild(a);
      });
    }

    searchResults.classList.add("show");
  } else {
    searchResults.innerHTML = "<p>Aucun résultat</p>";
    searchResults.classList.add("show");
  }
}

  // Navigation clavier
  searchInput.addEventListener("keydown", (e) => {
    const items = searchResults.querySelectorAll("p[data-link]");
    if (!items.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      currentIndex = (currentIndex + 1) % items.length;
      updateActive(items);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      updateActive(items);
    } else if (e.key === "Enter" && currentIndex >= 0) {
      e.preventDefault();
      window.location.href = items[currentIndex].getAttribute("data-link");
    }
  });

  function updateActive(items) {
    items.forEach((item, i) => {
      item.style.background = i === currentIndex ? "#f0f0f0" : "";
    });
  }

  // Fermer les résultats si clic en dehors
  document.addEventListener("click", (e) => {
    if (!searchResults.contains(e.target) && e.target !== searchInput && e.target !== searchToggle) {
      searchResults.classList.remove("show");
    }
  });

  // =================== Géolocalisation ===================
  const positionBtn = document.querySelector(".position");
  const coordinatesInput = document.getElementById("coordinates");
  const locationInput = document.getElementById("location");

  if (positionBtn) {
    positionBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;

            coordinatesInput.value = `${lat}, ${lon}`;

            try {
              const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
              const data = await response.json();

              if (data && data.address) {
                const city = data.address.city || data.address.town || data.address.village || "";
                const suburb = data.address.suburb || data.address.neighbourhood || "";
                locationInput.value = `${city} ${suburb}`.trim();
              } else {
                locationInput.value = "Adresse non trouvée";
              }
            } catch (error) {
              locationInput.value = "Erreur lors de la récupération";
            }
          },
          (err) => {
            alert("Impossible de récupérer votre position : " + err.message);
          }
        );
      } else {
        alert("La géolocalisation n'est pas supportée par votre navigateur.");
      }
    });
  }
});
