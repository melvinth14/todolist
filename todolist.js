(function () {
  const storageKey = "focuslist-tasks-v1";
  const taskForm = document.getElementById("taskForm");
  const taskInput = document.getElementById("taskInput");
  const newPriority = document.getElementById("newPriority");
  const taskList = document.getElementById("taskList");
  const emptyState = document.getElementById("emptyState");
  const emptyTitle = document.getElementById("emptyTitle");
  const emptyMessage = document.getElementById("emptyMessage");
  const searchInput = document.getElementById("searchInput");
  const statusFilter = document.getElementById("statusFilter");
  const priorityFilter = document.getElementById("priorityFilter");
  const validPriorities = new Set(["high", "medium", "low"]);
  let tasks = loadTasks();

  document.getElementById("todayLabel").textContent = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "short", day: "numeric" }).format(new Date());

  function loadTasks() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      return Array.isArray(saved) ? saved.map(normalizeTask).filter(Boolean) : [];
    } catch (error) { return []; }
  }

  function normalizeTask(task) {
    if (!task || typeof task !== "object") return null;
    const title = typeof task.title === "string" ? task.title.trim().slice(0, 140) : "";
    const priority = validPriorities.has(task.priority) ? task.priority : "medium";
    const id = typeof task.id === "string" && task.id.length <= 80 ? task.id : crypto.randomUUID();
    return title ? { id, title, priority, completed: task.completed === true } : null;
  }

  function saveTasks() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(tasks));
    } catch (error) {
      const note = document.getElementById("statusNote");
      note.textContent = "Saved for this session";
      return;
    }
    const note = document.getElementById("statusNote");
    note.textContent = "Saved just now";
    window.clearTimeout(saveTasks.timeout);
    saveTasks.timeout = window.setTimeout(() => { note.textContent = "All changes saved"; }, 1800);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
  }

  function visibleTasks() {
    const search = searchInput.value.trim().toLowerCase();
    return tasks.filter((task) => {
      const matchesSearch = !search || task.title.toLowerCase().includes(search);
      const matchesStatus = statusFilter.value === "all" || (statusFilter.value === "completed" ? task.completed : !task.completed);
      const matchesPriority = priorityFilter.value === "all" || task.priority === priorityFilter.value;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }

  function render() {
    const shownTasks = visibleTasks();
    taskList.innerHTML = shownTasks.map((task) => `<li class="task-item ${task.completed ? "completed" : ""}" data-id="${escapeHtml(task.id)}">
      <button class="check-button" type="button" data-action="toggle" aria-label="${task.completed ? "Mark task active" : "Mark task completed"}" aria-pressed="${task.completed}">${task.completed ? "✓" : ""}</button>
      <div class="task-content"><div class="task-title">${escapeHtml(task.title)}</div><div class="task-meta"><span class="priority priority-${task.priority}">${task.priority}</span><span class="task-state">${task.completed ? "Completed" : "In progress"}</span></div></div>
      <div class="task-actions"><button class="action-button" type="button" data-action="edit">Edit</button><button class="action-button delete" type="button" data-action="delete">Delete</button></div>
    </li>`).join("");
    const completedTasks = tasks.filter((task) => task.completed).length;
    document.getElementById("totalCount").textContent = tasks.length;
    document.getElementById("completedCount").textContent = completedTasks;
    document.getElementById("pendingCount").textContent = tasks.length - completedTasks;
    const isFiltered = searchInput.value || statusFilter.value !== "all" || priorityFilter.value !== "all";
    emptyState.hidden = shownTasks.length > 0;
    emptyTitle.textContent = isFiltered ? "No matching tasks" : "Your list is clear";
    emptyMessage.textContent = isFiltered ? "Try adjusting your search or filters." : "Add a task above and make today count.";
  }

  taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = taskInput.value.trim();
    if (!title) return;
    tasks.unshift({ id: crypto.randomUUID(), title: title.slice(0, 140), priority: validPriorities.has(newPriority.value) ? newPriority.value : "medium", completed: false });
    taskInput.value = "";
    newPriority.value = "medium";
    saveTasks(); render(); taskInput.focus();
  });

  taskList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const item = button.closest(".task-item");
    const task = tasks.find((entry) => entry.id === item.dataset.id);
    if (!task) return;
    if (button.dataset.action === "toggle") task.completed = !task.completed;
    if (button.dataset.action === "delete") tasks = tasks.filter((entry) => entry.id !== task.id);
    if (button.dataset.action === "edit") {
      const title = item.querySelector(".task-title");
      title.innerHTML = `<input class="edit-input" value="${escapeHtml(task.title)}" aria-label="Edit task title" maxlength="140">`;
      const input = title.querySelector("input"); input.focus(); input.select();
      let editFinished = false;
      const finishEdit = (shouldSave) => {
        if (editFinished) return;
        editFinished = true;
        const nextTitle = input.value.trim();
        if (shouldSave && nextTitle) task.title = nextTitle;
        if (shouldSave) saveTasks();
        render();
      };
      input.addEventListener("keydown", (keyEvent) => {
        if (keyEvent.key === "Enter") { keyEvent.preventDefault(); finishEdit(true); }
        if (keyEvent.key === "Escape") { keyEvent.preventDefault(); finishEdit(false); }
      });
      input.addEventListener("blur", finishEdit, { once: true });
      return;
    }
    saveTasks(); render();
  });

  searchInput.addEventListener("input", render);
  statusFilter.addEventListener("change", render);
  priorityFilter.addEventListener("change", render);
  render();
}());
