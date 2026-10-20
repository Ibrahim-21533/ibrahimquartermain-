
"use strict";

/* =========================================
   SKY ARCH LAB — MAIN JAVASCRIPT
   ========================================= */


/* 1. MOBILE NAVIGATION */

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".primary-nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    const newState = !isOpen;

    menuToggle.setAttribute("aria-expanded", String(newState));
    menuToggle.setAttribute(
      "aria-label",
      newState ? "Close navigation" : "Open navigation"
    );

    nav.classList.toggle("open", newState);
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
    });
  });
}


/* 2. PROJECT FILTERS */

const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach(item => {
      item.classList.toggle("active", item === button);
    });

    projectCards.forEach(card => {
      const matches =
        filter === "all" || card.dataset.category === filter;

      card.classList.toggle("hidden", !matches);
    });
  });
});


/* 3. AUTOMATIC COPYRIGHT YEAR */

const year = document.querySelector("#year");

if (year) {
  year.textContent = new Date().getFullYear();
}


/* 4. ACTIVE NAVIGATION LINK */

const sections = [
  ...document.querySelectorAll("main section[id]")
];

const navLinks = [
  ...document.querySelectorAll(".primary-nav a")
];

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        navLinks.forEach(link => {
          const isActive =
            link.getAttribute("href") === `#${entry.target.id}`;

          link.classList.toggle("active", isActive);
        });
      });
    },
    {
      rootMargin: "-35% 0px -55% 0px"
    }
  );

  sections.forEach(section => {
    sectionObserver.observe(section);
  });
}


/* 5. PROJECT INFORMATION */

const portfolioDetails = {
  "courtyard-house": {
    title: "Courtyard House",
    description:
      "A residential concept exploring privacy, natural light, greenery and the relationship between indoor and outdoor living.",
    focus:
      "Residential planning, daylight, privacy and courtyard space.",
    approach:
      "Organise the home around a planted courtyard to encourage daylight, ventilation and a connection with nature.",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1100&q=85",
    page: "courtyard-house.html"
  },

  "civic-exchange": {
    title: "Civic Exchange",
    description:
      "A commercial and public-space study exploring contemporary urban architecture, circulation and the relationship between buildings and city life.",
    focus:
      "Urban connections, circulation and shared public space.",
    approach:
      "Explore clear movement routes and a strong architectural identity within an urban setting.",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1100&q=85",
    page: "case-study.html?project=civic-exchange"
  },

  "culture-pavilion": {
    title: "Culture Pavilion",
    description:
      "A cultural architecture concept exploring gathering spaces, expressive forms and the role of architecture in community life.",
    focus:
      "Community, cultural identity and gathering spaces.",
    approach:
      "Investigate how spatial openness, shade and a distinctive roof form can support social interaction.",
    image:
      "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1100&q=85",
    page: "case-study.html?project=culture-pavilion"
  },

  "open-frame": {
    title: "Open Frame",
    description:
      "A spatial concept study focused on natural materials, flexible spaces and the visual relationship between structure and interior.",
    focus:
      "Material expression, flexibility and spatial continuity.",
    approach:
      "Use a clear spatial framework and a restrained material palette to explore adaptable interiors.",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1100&q=85",
    page: "case-study.html?project=open-frame"
  }
};


/* 6. PROJECT PREVIEW ELEMENTS */

const projectPreview = document.querySelector("#project-preview");
const previewClose = document.querySelector("#preview-close");
const previewImage = document.querySelector("#preview-image");
const previewTitle = document.querySelector("#preview-title");
const previewDescription = document.querySelector("#preview-description");
const previewFocus = document.querySelector("#preview-focus");
const previewApproach = document.querySelector("#preview-approach");
const previewFullLink = document.querySelector("#preview-full-link");


/* 7. FIND THE PROJECT KEY */

function getProjectKey(link) {
  try {
    const url = new URL(link.href, window.location.href);
    return url.searchParams.get("project");
  } catch (error) {
    return null;
  }
}


/* 8. OPEN PROJECT PREVIEW */

function openProjectPreview(link) {
  const key = getProjectKey(link);
  const project = portfolioDetails[key];

  if (!project) {
    window.location.href = link.href;
    return;
  }

  /*
   * If the preview window is missing, open
   * the project's full page instead.
   */
  if (!projectPreview || typeof projectPreview.showModal !== "function") {
    window.location.href = new URL(
      project.page,
      window.location.href
    ).href;
    return;
  }

  if (previewImage) {
    previewImage.src = project.image;
    previewImage.alt = project.title;
  }

  if (previewTitle) {
    previewTitle.textContent = project.title;
  }

  if (previewDescription) {
    previewDescription.textContent = project.description;
  }

  if (previewFocus) {
    previewFocus.textContent = project.focus;
  }

  if (previewApproach) {
    previewApproach.textContent = project.approach;
  }

  if (previewFullLink) {
    previewFullLink.href = project.page;
  }

  projectPreview.showModal();
}


/* 9. MAKE PROJECT IMAGES CLICKABLE */

document.querySelectorAll(".project-card .project-image").forEach(link => {
  link.addEventListener("click", event => {
    const key = getProjectKey(link);

    /*
     * Only intercept links belonging to
     * projects in our portfolio information.
     */
    if (!key || !portfolioDetails[key]) {
      return;
    }

    event.preventDefault();
    openProjectPreview(link);
  });
});


/* 10. CLOSE PREVIEW BUTTON */

if (previewClose && projectPreview) {
  previewClose.addEventListener("click", () => {
    projectPreview.close();
  });
}


/* 11. CLOSE PREVIEW BY TAPPING OUTSIDE */

if (projectPreview) {
  projectPreview.addEventListener("click", event => {
    if (event.target === projectPreview) {
      projectPreview.close();
    }
  });
}


/* 12. ESCAPE KEY SUPPORT */

if (projectPreview) {
  projectPreview.addEventListener("close", () => {
    /*
     * The browser closes a dialog when
     * the Escape key is pressed.
     */
  });
}


/* 13. SMOOTH INTERNAL NAVIGATION */

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", event => {
    const targetId = link.getAttribute("href");

    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);

    if (!target) return;

    event.preventDefault();

    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    /*
     * Keep the URL in sync with the section
     * without triggering a sudden jump.
     */
    if (history.replaceState) {
      history.replaceState(null, "", targetId);
    }
  });
});


/* 14. IMAGE FALLBACK */

document.querySelectorAll("img").forEach(img => {
  img.addEventListener("error", () => {
    img.classList.add("image-unavailable");
  });
});


/* 15. OPTIONAL SCROLL REVEAL */

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12
    }
  );

  document.querySelectorAll(
    ".intro, .services, .projects, .process, .quote-band, .contact"
  ).forEach(section => {
    revealObserver.observe(section);
  });
     }
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
