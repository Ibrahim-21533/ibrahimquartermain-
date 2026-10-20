
(() => {
  "use strict";

  const year = document.getElementById("ch-year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Keep in-page navigation usable for reduced-motion preferences.
  const reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) {
    document.documentElement.style.scrollBehavior = "auto";
  }
})();
