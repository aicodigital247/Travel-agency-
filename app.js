/**
 * Grand Voyage Travel - Core Vanilla JS Interactive Layer
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Theme Switcher System (Dark / Light Mode)
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeUI(savedTheme);

  // Setup theme change listeners (will hook up with buttons)
  document.body.addEventListener("click", (e) => {
    const themeBtn = e.target.closest(".theme-toggle-btn");
    if (themeBtn) {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const nextTheme = currentTheme === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", nextTheme);
      localStorage.setItem("theme", nextTheme);
      updateThemeUI(nextTheme);
      showToastNotification(`Switched to ${nextTheme} theme mode!`, "info");
    }
  });

  // 2. Active Page highlighting in Menu
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link, .mobile-bottom-nav .mobile-bottom-item");
  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPath) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // 3. Lazy Loading Image Placeholder Generator
  const lazyImages = document.querySelectorAll("img[loading='lazy']");
  lazyImages.forEach(img => {
    img.addEventListener("load", () => {
      img.classList.add("fade-loaded");
    });
  });

  // 4. Global Currency Converter
  const currencySelector = document.getElementById("global-currency-selector");
  if (currencySelector) {
    currencySelector.addEventListener("change", (e) => {
      const selectedCurrency = e.target.value;
      convertCurrenciesOnScreen(selectedCurrency);
    });
  }

  // 5. Scroll Reveal Activator
  const revealElements = document.querySelectorAll(".reveal-fade-in");
  const revealOnScroll = () => {
    const triggerBottom = (window.innerHeight / 10) * 9.5;
    revealElements.forEach(el => {
      const elTop = el.getBoundingClientRect().top;
      if (elTop < triggerBottom) {
        el.classList.add("active");
      }
    });
  };
  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll(); // Instant call for initial screen elements
});

/**
 * Update UI Icons / Themes
 */
function updateThemeUI(theme) {
  const themeIcons = document.querySelectorAll(".theme-toggle-icon");
  themeIcons.forEach(icon => {
    if (theme === "dark") {
      icon.className = "bi bi-sun-fill theme-toggle-icon";
    } else {
      icon.className = "bi bi-moon-stars-fill theme-toggle-icon";
    }
  });
}

/**
 * Currency Conversion rates matrix simulator
 */
function convertCurrenciesOnScreen(currency) {
  const prices = document.querySelectorAll("[data-usd-val]");
  const symbolMap = { USD: "$", EUR: "€", GBP: "£", CAD: "C$" };
  const rateMap = { USD: 1.0, EUR: 0.92, GBP: 0.79, CAD: 1.37 };
  
  prices.forEach(element => {
    const usdVal = parseFloat(element.getAttribute("data-usd-val"));
    const rate = rateMap[currency] || 1.0;
    const symbol = symbolMap[currency] || "$";
    const converted = Math.round(usdVal * rate);
    
    // Smooth change layout
    element.style.opacity = 0.2;
    setTimeout(() => {
      element.innerHTML = `${symbol}${converted.toLocaleString()}`;
      element.style.opacity = 1;
    }, 200);
  });
  showToastNotification(`Currency converted to ${currency}`, "info");
}

/**
 * Dynamic toast alerts layer
 */
function showToastNotification(message, type = "success") {
  let toastContainer = document.getElementById("brand-toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "brand-toast-container";
    toastContainer.className = "position-fixed bottom-0 start-0 p-3";
    toastContainer.style.zIndex = "1090";
    document.body.appendChild(toastContainer);
  }

  const toastId = "toast-" + Date.now();
  const bgClass = type === "success" ? "bg-success" : (type === "error" ? "bg-danger" : "bg-dark");
  const iconClass = type === "success" ? "bi-check-circle-fill" : (type === "error" ? "bi-exclamation-triangle-fill" : "bi-info-circle-fill");

  const toastHtml = `
    <div id="${toastId}" class="toast align-items-center text-white ${bgClass} border-0 shadow-lg" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body d-flex align-items-center gap-2">
          <i class="bi ${iconClass}"></i>
          <span>${message}</span>
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  `;

  toastContainer.insertAdjacentHTML("beforeend", toastHtml);
  
  // Use Bootstrap's client side JS API
  const toastElement = document.getElementById(toastId);
  const bsToast = new bootstrap.Toast(toastElement, { delay: 4000 });
  bsToast.show();

  toastElement.addEventListener("hidden.bs.toast", () => {
    toastElement.remove();
  });
}

// Global expose
window.showToastNotification = showToastNotification;
