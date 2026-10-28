(() => {
  "use strict";
  const STORAGE_KEY = "sky-arch-lab-projects-v1";
  const $ = (id) => document.getElementById(id);
  const grid = $("projectGrid"), empty = $("emptyState"), dialog = $("projectDialog"), form = $("projectForm");
  let projects = loadProjects();
  let deferredInstallPrompt = null;

  function loadProjects() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch { return []; }
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
      return true;
    } catch {
      toast("Couldn't save on this device. Check available storage or browser settings.");
      return false;
    }
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, ch => ({
      "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
    }[ch]));
  }

  function render() {
    const query = $("searchInput").value.trim().toLowerCase();
    const filter = $("filterSelect").value;
    const filtered = projects.filter(p =>
      (filter === "all" || p.type === filter) &&
      [p.name, p.location, p.notes, p.type, p.status].some(v =>
        String(v || "").toLowerCase().includes(query)
      )
    );

    $("projectCount").textContent = `${projects.length} ${projects.length === 1 ? "project" : "projects"}`;
    grid.innerHTML = filtered.map(p => `
      <article class="project-card">
        <div class="card-art" aria-hidden="true"></div>
        <div class="card-content">
          <div class="card-top"><span class="tag">${escapeHTML(p.type)}</span><span class="status">${escapeHTML(p.status)}</span></div>
          <h3>${escapeHTML(p.name)}</h3>
          ${p.location ? `<p class="project-meta">⌖ ${escapeHTML(p.location)}</p>` : ""}
          ${p.notes ? `<p class="project-notes">${escapeHTML(p.notes)}</p>` : `<p class="project-notes">No notes added yet. Edit this project to record your design thinking.</p>`}
          <div class="card-footer"><small>UPDATED ${escapeHTML(p.updated || "TODAY")}</small><button class="text-button" data-edit="${escapeHTML(p.id)}">Open project ↗</button></div>
        </div>
      </article>`).join("");

    empty.classList.toggle("show", filtered.length === 0);
    if (projects.length && filtered.length === 0) {
      empty.querySelector("h3").textContent = "No matching projects.";
      empty.querySelector("p").textContent = "Try another search or filter.";
      $("newProjectEmpty").textContent = "Create a project";
    } else {
      empty.querySelector("h3").textContent = "Your first project starts here.";
      empty.querySelector("p").textContent = "Create a concept or add a real project. Your entries are saved on this device.";
    }
  }

  function resetForm() {
    form.reset();
    $("projectId").value = "";
    $("dialogTitle").textContent = "New project";
    $("deleteProject").hidden = true;
  }

  function openNew() {
    resetForm();
    dialog.showModal();
    $("projectName").focus();
  }

  function openEdit(id) {
    const p = projects.find(item => item.id === id);
    if (!p) return;
    $("projectId").value = p.id;
    $("projectName").value = p.name;
    $("projectType").value = p.type;
    $("projectStatus").value = p.status;
    $("projectLocation").value = p.location || "";
    $("projectNotes").value = p.notes || "";
    $("dialogTitle").textContent = "Edit project";
    $("deleteProject").hidden = false;
    dialog.showModal();
  }

  function toast(message) {
    const node = $("toast");
    if (!node) return;
    node.textContent = message;
    node.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => node.classList.remove("show"), 2600);
  }

  $("newProjectTop").addEventListener("click", openNew);
  $("newProjectEmpty").addEventListener("click", openNew);
  $("closeDialog").addEventListener("click", () => dialog.close());
  $("cancelDialog").addEventListener("click", () => dialog.close());
  $("searchInput").addEventListener("input", render);
  $("filterSelect").addEventListener("change", render);

  grid.addEventListener("click", event => {
    const button = event.target.closest("[data-edit]");
    if (button) openEdit(button.dataset.edit);
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    const name = $("projectName").value.trim();
    if (!name) { $("projectName").focus(); return; }

    const id = $("projectId").value;
    const old = projects.find(p => p.id === id);
    const today = new Date().toISOString().slice(0, 10);
    const record = {
      id: id || (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
      name,
      type: $("projectType").value,
      status: $("projectStatus").value,
      location: $("projectLocation").value.trim(),
      notes: $("projectNotes").value.trim(),
      updated: today
    };

    if (old) projects = projects.map(p => p.id === id ? record : p);
    else projects.unshift(record);
    persist();
    render();
    dialog.close();
    toast(old ? "Project updated on this device." : "Project saved on this device.");
  });

  $("deleteProject").addEventListener("click", () => {
    const id = $("projectId").value;
    if (!id || !confirm("Delete this project from this device? This cannot be undone.")) return;
    projects = projects.filter(p => p.id !== id);
    persist();
    render();
    dialog.close();
    toast("Project deleted.");
  });

  function updateNetwork() {
    const online = navigator.onLine;
    $("networkDot").className = online ? "online" : "offline";
    $("networkText").textContent = online ? "Online · local save active" : "Offline · local save active";
  }
  addEventListener("online", updateNetwork);
  addEventListener("offline", updateNetwork);
  updateNetwork();

  addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    $("installBtn").hidden = false;
  });

  $("installBtn").addEventListener("click", async () => {
    if (!deferredInstallPrompt) {
      toast("Open your browser menu and choose Install app or Add to Home screen.");
      return;
    }
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    $("installBtn").hidden = true;
  });

  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() =>
        toast("Offline caching could not start. The app can still run online.")
      );
    });
  }
  render();
})();