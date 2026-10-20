(() => {
  const STORAGE_KEY = "skyArchLabProjectsV1";
  const form = document.getElementById("project-form");
  const list = document.getElementById("project-list");
  const status = document.getElementById("form-status");
  const fields = {
    name: document.getElementById("project-name"),
    category: document.getElementById("category"),
    stage: document.getElementById("stage"),
    description: document.getElementById("description"),
    goal: document.getElementById("goal"),
    deadline: document.getElementById("deadline"),
    visibility: document.getElementById("visibility")
  };

  function readProjects() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return [];
    }
  }

  function writeProjects(projects) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }

  function safeText(value) {
    return String(value || "").replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[char]));
  }

  function renderProjects() {
    const projects = readProjects();
    if (!projects.length) {
      list.innerHTML = '<div class="empty-state"><span class="empty-icon">＋</span><strong>No projects yet</strong><p>Your first project will appear here after you create it.</p></div>';
      return;
    }

    list.innerHTML = projects.slice().reverse().map(project => `
      <article class="project-item">
        <h3>${safeText(project.name)}</h3>
        <div class="project-meta">${safeText(project.category)} · ${safeText(project.stage)}</div>
        <p class="project-desc">${safeText(project.description)}</p>
        <div class="project-meta">Objective: ${safeText(project.goal)}</div>
        ${project.deadline ? `<div class="project-meta" style="margin-top:6px">Target: ${safeText(project.deadline)}</div>` : ""}
        <div class="project-item-actions" style="margin-top:12px">
          <button type="button" data-action="export" data-id="${safeText(project.id)}">Export JSON</button>
          <button type="button" data-action="delete" data-id="${safeText(project.id)}">Delete</button>
        </div>
      </article>
    `).join("");
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    const project = {
      id: (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()),
      name: fields.name.value.trim(),
      category: fields.category.value,
      stage: fields.stage.value,
      description: fields.description.value.trim(),
      goal: fields.goal.value,
      deadline: fields.deadline.value,
      visibility: fields.visibility.value,
      createdAt: new Date().toISOString()
    };

    if (!project.name || !project.description) {
      status.textContent = "Please add a project name and description.";
      return;
    }

    try {
      const projects = readProjects();
      projects.push(project);
      writeProjects(projects);
      renderProjects();
      form.reset();
      status.textContent = "Project created on this device. Cloud saving is not connected yet.";
    } catch (error) {
      status.textContent = "This browser could not save the project. Check device storage settings and try again.";
    }
  });

  form.addEventListener("reset", () => {
    status.textContent = "";
  });

  list.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const projects = readProjects();
    const project = projects.find(item => item.id === button.dataset.id);
    if (!project) return;

    if (button.dataset.action === "delete") {
      if (!confirm(`Delete "${project.name}" from this device?`)) return;
      writeProjects(projects.filter(item => item.id !== project.id));
      renderProjects();
      status.textContent = "Project deleted from this device.";
    }

    if (button.dataset.action === "export") {
      const blob = new Blob([JSON.stringify(project, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "sky-project"}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    }
  });

  renderProjects();
})();
