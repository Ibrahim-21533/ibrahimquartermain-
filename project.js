
/* =========================================
   SKY ARCH LAB
   Project Builder — Local Prototype
   ========================================= */

(() => {
  "use strict";

  const STORAGE_KEY = "skyArchLabProjectsV1";

  const form = document.getElementById("project-form");
  const list = document.getElementById("project-list");
  const status = document.getElementById("form-status");
  const search = document.getElementById("project-search");
  const searchStatus = document.getElementById("search-status");
  const submitButton = form?.querySelector('[type="submit"]');

  if (!form || !list || !status) return;

  const fields = {
    name: document.getElementById("project-name"),
    category: document.getElementById("category"),
    stage: document.getElementById("stage"),
    description: document.getElementById("description"),
    goal: document.getElementById("goal"),
    deadline: document.getElementById("deadline"),
    visibility: document.getElementById("visibility")
  };

  let editingId = null;
  let storageAvailable = true;

  function readProjects() {
    try {
      const data = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );

      return Array.isArray(data) ? data : [];
    } catch (error) {
      storageAvailable = false;
      return [];
    }
  }

  function writeProjects(projects) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(projects)
      );

      storageAvailable = true;
      return true;
    } catch (error) {
      storageAvailable = false;
      return false;
    }
  }

  function safeText(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));
  }

  function makeId() {
    if (window.crypto?.randomUUID) {
      return window.crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  function getFormProject() {
    return {
      name: fields.name.value.trim(),
      category: fields.category.value,
      stage: fields.stage.value,
      description: fields.description.value.trim(),
      goal: fields.goal.value,
      deadline: fields.deadline.value,
      visibility: fields.visibility.value
    };
  }

  function setFormProject(project) {
    fields.name.value = project.name || "";
    fields.category.value = project.category || "Architecture & Design";
    fields.stage.value = project.stage || "Idea";
    fields.description.value = project.description || "";
    fields.goal.value = project.goal || "Plan and organise a project";
    fields.deadline.value = project.deadline || "";
    fields.visibility.value = project.visibility || "Private";
  }

  function resetEditing() {
    editingId = null;

    if (submitButton) {
      submitButton.innerHTML = 'Create project <span>↗</span>';
    }
  }

  function cancelEditing() {
    resetEditing();
    form.reset();
    status.textContent = "Editing cancelled. Your saved projects are unchanged.";
  }

  function getSearchTerm() {
    return (search?.value || "").trim().toLowerCase();
  }

  function matchesSearch(project, term) {
    if (!term) return true;

    return [
      project.name,
      project.category,
      project.stage,
      project.description,
      project.goal,
      project.visibility,
      project.deadline
    ].some(value =>
      String(value || "").toLowerCase().includes(term)
    );
  }

  function renderProjects() {
    const projects = readProjects();
    const term = getSearchTerm();

    const matchingProjects = projects
      .filter(project => matchesSearch(project, term))
      .slice()
      .reverse();

    if (searchStatus) {
      searchStatus.textContent = term
        ? `${matchingProjects.length} matching project${matchingProjects.length === 1 ? "" : "s"}`
        : `${projects.length} saved project${projects.length === 1 ? "" : "s"}`;
    }

    if (!matchingProjects.length) {
      list.innerHTML = term
        ? `<div class="empty-state">
             <span class="empty-icon">⌕</span>
             <strong>No matching projects</strong>
             <p>Try another name, category or keyword.</p>
           </div>`
        : `<div class="empty-state">
             <span class="empty-icon">＋</span>
             <strong>No projects yet</strong>
             <p>Your first project will appear here after you create it.</p>
           </div>`;

      return;
    }

    list.innerHTML = matchingProjects.map(project => `
      <article class="project-item">
        <h3>${safeText(project.name)}</h3>

        <div class="project-meta">
          ${safeText(project.category)} · ${safeText(project.stage)}
        </div>

        <p class="project-desc">
          ${safeText(project.description)}
        </p>

        <div class="project-meta">
          Objective: ${safeText(project.goal)}
        </div>

        <div class="project-meta">
          Visibility: ${safeText(project.visibility || "Private")}
        </div>

        ${project.deadline
          ? `<div class="project-meta" style="margin-top:6px">
               Target: ${safeText(project.deadline)}
             </div>`
          : ""}

        <div class="project-item-actions" style="margin-top:12px">
          <button
            type="button"
            data-action="edit"
            data-id="${safeText(project.id)}"
          >Edit</button>

          <button
            type="button"
            data-action="export"
            data-id="${safeText(project.id)}"
          >Export JSON</button>

          <button
            type="button"
            data-action="delete"
            data-id="${safeText(project.id)}"
          >Delete</button>
        </div>
      </article>
    `).join("");
  }

  form.addEventListener("submit", event => {
    event.preventDefault();

    const details = getFormProject();

    if (!details.name || !details.description) {
      status.textContent =
        "Please add a project name and description.";
      return;
    }

    const projects = readProjects();

    if (editingId) {
      const index = projects.findIndex(
        project => project.id === editingId
      );

      if (index === -1) {
        resetEditing();
        status.textContent =
          "This project could not be found. Please try again.";
        renderProjects();
        return;
      }

      const updatedProject = {
        ...projects[index],
        ...details,
        updatedAt: new Date().toISOString()
      };

      projects[index] = updatedProject;

      if (!writeProjects(projects)) {
        status.textContent =
          "Could not save changes. Browser storage may be full or unavailable.";
        return;
      }

      resetEditing();
      form.reset();
      renderProjects();

      status.textContent = "Project updated successfully on this device.";
      return;
    }

    const project = {
      id: makeId(),
      ...details,
      createdAt: new Date().toISOString()
    };

    projects.push(project);

    if (!writeProjects(projects)) {
      status.textContent =
        "Could not save this project. Check browser storage and try again.";
      return;
    }

    form.reset();
    renderProjects();

    status.textContent =
      "Project created and saved on this device.";
  });

  form.addEventListener("reset", () => {
    // Allow the browser's reset action to finish first.
    window.setTimeout(() => {
      if (editingId) resetEditing();
      status.textContent = "";
    }, 0);
  });

  search?.addEventListener("input", renderProjects);

  list.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const action = button.dataset.action;
    const id = button.dataset.id;
    const projects = readProjects();
    const project = projects.find(item => item.id === id);

    if (!project) {
      status.textContent = "Project not found. Refresh and try again.";
      return;
    }

    if (action === "edit") {
      editingId = project.id;
      setFormProject(project);

      if (submitButton) {
        submitButton.innerHTML = 'Save changes <span>↗</span>';
      }

      status.textContent =
        "Editing project. Make your changes and select Save changes.";

      form.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      fields.name.focus();
      return;
    }

    if (action === "delete") {
      if (!window.confirm(
        `Delete "${project.name}" from this device? This cannot be undone.`
      )) {
        return;
      }

      const updatedProjects = projects.filter(
        item => item.id !== project.id
      );

      if (!writeProjects(updatedProjects)) {
        status.textContent = "Could not delete the project. Try again.";
        return;
      }

      if (editingId === project.id) {
        resetEditing();
        form.reset();
      }

      renderProjects();
      status.textContent = "Project deleted from this device.";
      return;
    }

    if (action === "export") {
      try {
        const blob = new Blob(
          [JSON.stringify(project, null, 2)],
          { type: "application/json" }
        );

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        const filename =
          project.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "") || "sky-project";

        link.href = url;
        link.download = `${filename}.json`;

        document.body.appendChild(link);
        link.click();
        link.remove();

        window.setTimeout(() => URL.revokeObjectURL(url), 1000);

        status.textContent = "Project export prepared.";
      } catch (error) {
        status.textContent = "Export failed. Please try again.";
      }
    }
  });

  // Add a cancel-edit action only while editing.
  const actions = form.querySelector(".actions");
  let cancelButton = null;

  function updateCancelButton() {
    if (!actions) return;

    if (editingId && !cancelButton) {
      cancelButton = document.createElement("button");
      cancelButton.type = "button";
      cancelButton.className = "secondary";
      cancelButton.textContent = "Cancel editing";
      cancelButton.addEventListener("click", cancelEditing);
      actions.appendChild(cancelButton);
    }

    if (!editingId && cancelButton) {
      cancelButton.remove();
      cancelButton = null;
    }
  }

  const originalResetEditing = resetEditing;

  resetEditing = function () {
    originalResetEditing();
    updateCancelButton();
  };

  renderProjects();

  if (!storageAvailable) {
    status.textContent =
      "Browser storage could not be read. Saved projects may not be available.";
  }
})();
