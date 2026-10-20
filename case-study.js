
(() => {
  "use strict";

  const projects = {
    "courtyard-house": {
      title: "Courtyard House",
      category: "Residential Architecture / Concept Study",
      type: "Residential concept",
      approach: "Climate-responsive planning",
      summary:
        "A residential concept exploring privacy, daylight and natural ventilation around a sheltered central courtyard.",
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85",
      imageAlt:
        "Contemporary residential architecture used as an illustrative visual reference.",
      idea:
        "The concept places a protected courtyard at the centre of daily life. The courtyard acts as an outdoor room, bringing daylight and a visual connection to nature into the surrounding spaces.",
      spatial:
        "Living spaces are organised around the courtyard, with quieter private areas separated from shared activities. Openings, circulation paths and thresholds would be refined after studying the site, orientation and the needs of the intended occupants.",
      priorities: [
        "Privacy between public and private spaces",
        "Daylight reaching the interior",
        "Cross-ventilation where climate and site allow",
        "Clear circulation and useful outdoor space"
      ],
      materials:
        "The material study could explore masonry, timber screens and durable finishes. Structural sizing, foundation design and material specifications would require site information and qualified engineering input.",
      environment:
        "The design could investigate solar orientation, external shading, natural ventilation and rainwater management. Their suitability would depend on local climate data, site conditions and a detailed environmental assessment.",
      technical:
        "Next steps would include site analysis, sun-path studies, ventilation assessment, a measured spatial plan and preliminary structural coordination. No performance claim should be made until the relevant studies are completed."
    },

    "civic-exchange": {
      title: "Civic Exchange",
      category: "Public Architecture / Concept Study",
      type: "Civic building concept",
      approach: "Connected public spaces",
      summary:
        "A public-building concept focused on accessible circulation, flexible community use and a welcoming relationship with its surroundings.",
      image:
        "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1400&q=85",
      imageAlt:
        "Contemporary institutional architecture used as an illustrative visual reference.",
      idea:
        "Civic Exchange explores how a public building can support meetings, learning and community activities. The central idea is to make the building legible, welcoming and connected to the public realm.",
      spatial:
        "A clear entrance sequence would lead visitors toward shared spaces, with quieter rooms and service areas arranged to reduce conflicting circulation. The final arrangement would respond to the intended users, site boundaries and access requirements.",
      priorities: [
        "Legible entrances and wayfinding",
        "Accessible routes and facilities",
        "Flexible rooms for different activities",
        "A considered relationship with outdoor public space"
      ],
      materials:
        "The concept could compare durable masonry, concrete, shaded glazing and locally suitable finishes. Structural spans, fire safety and construction systems would need coordinated professional design.",
      environment:
        "Daylight, solar shading, natural ventilation and landscape design would be evaluated alongside the building's occupancy and operating needs. The strategy would be tested rather than assumed to work in every location.",
      technical:
        "Further development would include circulation diagrams, occupancy planning, accessibility review, environmental studies and preliminary structural coordination. Applicable building regulations would need to be confirmed for the actual site."
    },

    "culture-pavilion": {
      title: "Culture Pavilion",
      category: "Cultural Architecture / Concept Study",
      type: "Cultural pavilion concept",
      approach: "Climate-aware gathering space",
      summary:
        "A pavilion concept exploring shared cultural activities, shade, natural light and a lightweight architectural expression.",
      image:
        "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1400&q=85",
      imageAlt:
        "Architectural structure and material composition used as an illustrative visual reference.",
      idea:
        "Culture Pavilion imagines a place for gathering, exchange and informal cultural activities. Its architectural character would emerge from the relationship between the gathering space, its setting and the people who use it.",
      spatial:
        "A flexible central space could accommodate different activities, supported by circulation around its edges and optional sheltered transition areas. The design would need to account for event sizes, accessibility, storage and weather protection.",
      priorities: [
        "Flexible space for gathering and events",
        "Shade and weather protection",
        "Clear movement through the pavilion",
        "A strong connection to landscape and place"
      ],
      materials:
        "A design study could compare timber, steel or other locally appropriate structural systems. Final material selection would consider durability, maintenance, available skills, environmental impact and structural requirements.",
      environment:
        "Roof geometry, shade, daylight, airflow and landscape could be explored to improve comfort. Wind, rainfall, solar exposure and local environmental conditions would guide later refinement.",
      technical:
        "Development would include structural concept options, roof drainage studies, circulation planning, material comparisons and an assessment of how the pavilion performs under expected weather and use conditions."
    },

    "open-frame": {
      title: "Open Frame",
      category: "Experimental Architecture / Concept Study",
      type: "Adaptable-space concept",
      approach: "Modular design exploration",
      summary:
        "A flexible architectural concept investigating modular planning, adaptable spaces and the relationship between structure and use.",
      image:
        "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1400&q=85",
      imageAlt:
        "Architectural structural composition used as an illustrative visual reference.",
      idea:
        "Open Frame investigates how a clear structural order can support spaces that change with users' needs. Rather than fixing every activity in place, the concept explores adaptability within a coherent architectural system.",
      spatial:
        "A regular planning grid could help organise circulation, services and flexible internal zones. The arrangement would need to balance openness with acoustic privacy, accessibility, safety and the requirements of the intended activities.",
      priorities: [
        "A legible structural and planning grid",
        "Adaptable space planning",
        "Efficient circulation and servicing",
        "Maintainability and long-term flexibility"
      ],
      materials:
        "Possible systems could be compared using span, weight, availability, assembly sequence, maintenance and reuse potential. Actual member sizes and connections would require structural calculations and professional review.",
      environment:
        "The study could assess daylight access, ventilation, embodied impacts, material reuse and the energy implications of different enclosure strategies. Conclusions would depend on the chosen location and building use.",
      technical:
        "Further work would test alternative grids, service routes, structural options and future layout changes. Fire strategy, accessibility, stability and construction feasibility would need to be assessed before the concept could be treated as a buildable design."
    }
  };

  const params = new URLSearchParams(window.location.search);
  const key = params.get("project");
  const project = projects[key];

  const setText = (id, value) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  };

  function showNotFound() {
    document.title = "Project Not Found — SKY ARCH LAB";
    setText("case-title", "Project not found.");
    setText(
      "case-summary",
      "This project link may be incomplete. Return to the portfolio to select another concept."
    );

    [
      "case-category",
      "case-type",
      "case-approach",
      "case-idea",
      "case-spatial",
      "case-materials-text",
      "case-environment",
      "case-technical"
    ].forEach(id => setText(id, ""));

    const priorities = document.getElementById("case-priorities");
    if (priorities) priorities.replaceChildren();

    const image = document.getElementById("case-image");
    if (image) image.hidden = true;
  }

  if (!project) {
    showNotFound();
  } else {
    document.title = `${project.title} — SKY ARCH LAB`;

    setText("case-category", project.category);
    setText("case-title", project.title);
    setText("case-summary", project.summary);
    setText("case-type", project.type);
    setText("case-approach", project.approach);
    setText("case-idea", project.idea);
    setText("case-spatial", project.spatial);
    setText("case-materials-text", project.materials);
    setText("case-environment", project.environment);
    setText("case-technical", project.technical);

    const image = document.getElementById("case-image");

    if (image) {
      image.src = project.image;
      image.alt = project.imageAlt;

      image.addEventListener("error", () => {
        image.hidden = true;
      }, { once: true });
    }

    const caption = document.getElementById("case-image-caption");
    if (caption) {
      caption.textContent =
        `${project.title} — illustrative visual reference, not a verified photograph of a completed SKY ARCH LAB project.`;
    }

    const priorities = document.getElementById("case-priorities");

    if (priorities) {
      priorities.replaceChildren();

      project.priorities.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        priorities.appendChild(li);
      });
    }
  }

  setText("case-year", new Date().getFullYear());
})();
