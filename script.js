/* =========================================
   SKY ARCH LAB
   Main Site Script
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    [...root.querySelectorAll(selector)];

  // PAGE LOAD
  document.body.classList.add("loaded");

  // CURRENT YEAR
  $$(".current-year").forEach(element => {
    element.textContent = new Date().getFullYear();
  });

  // MOBILE NAVIGATION
  const menuToggle = $(".menu-toggle");
  const primaryNav = $("#primary-nav");

  function closeMenu() {
    if (!menuToggle || !primaryNav) return;

    menuToggle.setAttribute("aria-expanded", "false");
    primaryNav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }

  if (menuToggle && primaryNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      primaryNav.classList.toggle("is-open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });

    $$("#primary-nav a").forEach(link => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", event => {
      if (
        menuToggle.getAttribute("aria-expanded") === "true" &&
        !primaryNav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });
  }

  // SMOOTH INTERNAL LINKS
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const href = link.getAttribute("href");

      if (!href || href === "#" || href.startsWith("#!")) {
        event.preventDefault();
        return;
      }

      let target;

      try {
        target = $(href);
      } catch {
        return;
      }

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start"
      });

      if (window.location.hash !== href) {
        history.replaceState(null, "", href);
      }
    });
  });

  // HEADER SCROLL EFFECT
  const header = $(".site-header") || $("header");

  function updateHeader() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 40);
  }

  updateHeader();

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });

  // SCROLL REVEAL
  const revealElements = $$(
    ".intro-content, .lab-card, .process-item, " +
    ".statement-content, .about-content, .feature-card, " +
    ".vision-content, .future-content, .cta-content"
  );

  if (
    "IntersectionObserver" in window &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach(element => {
      element.classList.add("reveal");
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach(element => {
      element.classList.add("visible");
    });
  }

  // PROJECT CATEGORY FILTERS
  const filterButtons = $$("[data-filter]");
  const projectCards = $$(".project-card");

  function applyProjectFilter(filter) {
    projectCards.forEach(card => {
      const category = card.dataset.category || "";
      const matches = filter === "all" || category === filter;

      card.hidden = !matches;
    });

    filterButtons.forEach(button => {
      const active = button.dataset.filter === filter;

      button.classList.toggle("active", active);

      if (active) {
        button.setAttribute("aria-pressed", "true");
      } else {
        button.setAttribute("aria-pressed", "false");
      }
    });
  }

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      applyProjectFilter(button.dataset.filter || "all");
    });
  });

  if (filterButtons.length) {
    applyProjectFilter(
      filterButtons.find(button =>
        button.classList.contains("active")
      )?.dataset.filter || "all"
    );
  }

  // SERVICE DETAIL DIALOGS
  const serviceDialog = $("#service-dialog");
  const serviceBackdrop = $("#service-dialog-backdrop");

  const serviceDetails = {
    architecture: {
      title: "Architecture & Design",
      description:
        "Develop thoughtful spaces through site analysis, spatial planning, concept development and design exploration."
    },
    interiors: {
      title: "Interior Environments",
      description:
        "Explore material choices, lighting, spatial flow and interior concepts that support the people using each space."
    },
    visualisation: {
      title: "Architectural Visualisation",
      description:
        "Communicate design ideas through visual studies, presentation graphics and architectural imagery."
    },
    research: {
      title: "Research & Innovation",
      description:
        "Investigate building systems, sustainable strategies, materials and new approaches to the built environment."
    }
  };

  function closeServiceDialog() {
    if (serviceDialog && serviceDialog.open && typeof serviceDialog.close === "function") {
      serviceDialog.close();
    }

    if (serviceBackdrop) {
      serviceBackdrop.hidden = true;
    }
  }

  $$(".service-arrow[data-service]").forEach(button => {
    button.addEventListener("click", () => {
      const service = serviceDetails[button.dataset.service];

      if (!service || !serviceDialog) return;

      const title = $("#service-dialog-title");
      const description = $("#service-dialog-description");

      if (title) title.textContent = service.title;
      if (description) description.textContent = service.description;

      if (typeof serviceDialog.showModal === "function") {
        serviceDialog.showModal();

        if (serviceBackdrop) {
          serviceBackdrop.hidden = false;
        }
      } else {
        serviceDialog.setAttribute("open", "open");
      }
    });
  });

  const closeDialogButton = $("#service-dialog-close");

  if (closeDialogButton) {
    closeDialogButton.addEventListener("click", closeServiceDialog);
  }

  if (serviceDialog) {
    serviceDialog.addEventListener("close", () => {
      if (serviceBackdrop) {
        serviceBackdrop.hidden = true;
      }
    });

    serviceDialog.addEventListener("click", event => {
      if (event.target === serviceDialog) {
        closeServiceDialog();
      }
    });
  }

  if (serviceBackdrop) {
    serviceBackdrop.addEventListener("click", closeServiceDialog);
  }

  // Single Escape handler for both menu and service dialog
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeMenu();
      closeServiceDialog();
    }
  });

  // CARD HOVER EFFECT
  $$(".lab-card, .feature-card").forEach(card => {
    card.addEventListener("mouseenter", () => {
      card.classList.add("hovered");
    });

    card.addEventListener("mouseleave", () => {
      card.classList.remove("hovered");
    });
  });

  // IMAGE ERROR HANDLING
  $$("img").forEach(image => {
    image.addEventListener("error", () => {
      image.classList.add("image-unavailable");
    });
  });

  // TOOL BUTTON FEEDBACK
  $$(".tool-form .btn").forEach(button => {
    button.addEventListener("click", () => {
      button.classList.add("clicked");

      setTimeout(() => {
        button.classList.remove("clicked");
      }, 250);
    });
  });

  // TOOL FORM VALIDATION
  $$(".tool-form input[type='number']").forEach(input => {
    input.addEventListener("input", () => {
      if (input.value !== "" && Number(input.value) < 0) {
        input.value = "0";
      }
    });
  });

  // ACTIVE PAGE NAVIGATION
  const currentPage =
    window.location.pathname.split("/").pop() || "index.html";

  $$("nav a").forEach(link => {
    const href = link.getAttribute("href");

    if (!href || href.startsWith("#")) return;

    const linkPage = href.split("/").pop().split("?")[0];

    if (linkPage === currentPage) {
      link.classList.add("active");
    }
  });

  // =========================================
  // PORTFOLIO PROJECT PREVIEWS
  // =========================================

  const projectPreview = document.getElementById("project-preview");
  const previewClose = document.getElementById("preview-close");
  const previewImage = document.getElementById("preview-image");
  const previewTitle = document.getElementById("preview-title");
  const previewDescription = document.getElementById("preview-description");
  const previewFocus = document.getElementById("preview-focus");
  const previewApproach = document.getElementById("preview-approach");
  const previewFullLink = document.getElementById("preview-full-link");

  const portfolioDetails = {
    "courtyard-house": {
      title: "Courtyard House",
      description:
        "A residential concept exploring privacy, daylight and natural ventilation through a sheltered central courtyard.",
      focus: "Residential space and daylight",
      approach: "Climate-responsive planning"
    },
    "civic-exchange": {
      title: "Civic Exchange",
      description:
        "A public-building concept focused on accessible circulation, flexible community use and a welcoming relationship with its surroundings.",
      focus: "Public space and accessibility",
      approach: "Connected civic spaces"
    },
    "culture-pavilion": {
      title: "Culture Pavilion",
      description:
        "A pavilion concept exploring gathering spaces, shade, natural light and a lightweight architectural expression.",
      focus: "Culture and shared experience",
      approach: "Climate-aware pavilion design"
    },
    "open-frame": {
      title: "Open Frame",
      description:
        "A flexible architectural concept investigating modular planning, adaptable space and the relationship between structure and use.",
      focus: "Modular and adaptable space",
      approach: "A clear structural framework"
    }
  };

  function getProjectKey(link) {
    try {
      return new URL(link.href, window.location.href)
        .searchParams.get("project");
    } catch {
      return null;
    }
  }

  function getProjectImage(link) {
    const image = link.querySelector("img");

    if (image && image.currentSrc) {
      return {
        src: image.currentSrc,
        alt: image.alt || ""
      };
    }

    if (image && image.src) {
      return {
        src: image.src,
        alt: image.alt || ""
      };
    }

    const background = window.getComputedStyle(link).backgroundImage;
    const match = background.match(/url\(["']?(.*?)["']?\)/);

    return {
      src: match ? match[1] : "",
      alt: ""
    };
  }

  function openProjectPreview(link) {
    const key = getProjectKey(link);
    const project = portfolioDetails[key];

    if (!project || !projectPreview) return;

    const image = getProjectImage(link);

    previewTitle.textContent = project.title;
    previewDescription.textContent = project.description;
    previewFocus.textContent = project.focus;
    previewApproach.textContent = project.approach;

    previewImage.src = image.src;
    previewImage.alt = image.alt || project.title + " concept image";
    previewImage.hidden = !image.src;

    previewFullLink.href = "case-study.html?project=" + encodeURIComponent(key);

    if (typeof projectPreview.showModal === "function") {
      projectPreview.showModal();
    } else {
      window.location.href = previewFullLink.href;
    }
  }

  document.querySelectorAll(".project-card .project-image").forEach(link => {
    link.addEventListener("click", event => {
      const key = getProjectKey(link);

      if (!portfolioDetails[key] || !projectPreview) return;

      event.preventDefault();
      openProjectPreview(link);
    });
  });

  if (previewClose && projectPreview) {
    previewClose.addEventListener("click", () => {
      projectPreview.close();
    });

    projectPreview.addEventListener("click", event => {
      if (event.target === projectPreview) {
        projectPreview.close();
      }
    });
  }
});