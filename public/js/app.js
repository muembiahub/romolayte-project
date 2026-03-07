document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const navbar = document.getElementById("navbar");

  // Toggle menu
  hamburger.addEventListener("click", () => {
    navbar.classList.toggle("active");
    hamburger.classList.toggle("open");
  });

  // Navigation sans <a>
  const items = document.querySelectorAll(".menu-item");
  items.forEach(item => {
    item.addEventListener("click", () => {
      const link = item.getAttribute("data-link");
      window.location.href = link; // redirection
    });
  });

//    // Fermer le menu lors du clic sur un lien
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

            // Remplir les coordonnées brutes
            coordinatesInput.value = `${lat}, ${lon}`;

            try {
              // Appel API Nominatim pour convertir en adresse
              const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
              const data = await response.json();

              if (data && data.address) {
                // Construire une adresse lisible (ville + quartier si dispo)
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



  
}); // <-- ACCOLADE FERMANTE AJOUTÉE
