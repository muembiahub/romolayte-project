document.addEventListener("DOMContentLoaded", () => {
  if (typeof bootstrap === "undefined") return;

  initGlobalToast();
  // 👉 Appel de la fonction
  initLiveSearch('searchInput', 'searchResults');
  initServiceModal();
  initGpsOnlyLocation();
  initServiceRequestBootstrapValidation();
  initAuthToggle();
  initDarkMode();
  initSmartNavbar();
  initCategoryServiceSelect();
});