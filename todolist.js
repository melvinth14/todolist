(function () {
  const store = window.FocusListStore;
  const view = window.FocusListView;
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
  let tasks = store.load();

  document.getElementById("todayLabel").textContent = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "short", day: "numeric" }).format(new Date());

  function saveAndNotify() {
    const note = document.getElementById("statusNote");
    const saved = store.save(tasks);
    note.textContent = saved ? "Saved just now" : "Saved for this session";
    window.clearTimeout(saveAndNotify.timeout);
    saveAndNotify.timeout = window.setTimeout(() => { note.textContent = "All changes saved"; }, 1800);
  }

  function getVisibleTasks() {
    const search = searchInput.value.trim().toLowerCase();
    return tasks.filter((task) => {
      const matchesSearch = !search || task.title.toLowerCase().includes(search);
      const matchesStatus = statusFilter.value === "all" || (statusFilter.value === "completed" ? task.completed : !task.completed);
      const matchesPriority = priorityFilter.value === "all" || task.priority === priorityFilter.value;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }

  function render() {
    const shownTasks = getVisibleTasks();
    view.renderTasks(taskList, shownTasks);
    view.renderStats(tasks);
    const filtered = Boolean(searchInput.value) || statusFilter.value !== "all" || priorityFilter.value !== "all";
    view.renderEmptyState(emptyState, filtered ? "No matching tasks" : "Your list is clear", filtered ? "Try adjusting your search or filters." : "Add a task above and make today count.", shownTasks.length === 0);
  }

  taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = taskInput.value.trim();
    const priority = store.isPriority(newPriority.value) ? newPriority.value : "medium";
    if (!title) return;
    tasks.unshift({ id: store.createId(), title: title.slice(0, 140), priority, completed: false });
    taskInput.value = "";
    newPriority.value = "medium";
    saveAndNotify(); render(); taskInput.focus();
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
      title.innerHTML = `<input class="edit-input" value="${task.title.replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]))}" aria-label="Edit task title" maxlength="140">`;
      const input = title.querySelector("input"); input.focus(); input.select();
      let editFinished = false;
      const finishEdit = (shouldSave) => {
        if (editFinished) return;
        editFinished = true;
        const nextTitle = input.value.trim();
        if (shouldSave && nextTitle) task.title = nextTitle.slice(0, 140);
        if (shouldSave) saveAndNotify();
        render();
      };
      input.addEventListener("keydown", (keyEvent) => {
        if (keyEvent.key === "Enter") { keyEvent.preventDefault(); finishEdit(true); }
        if (keyEvent.key === "Escape") { keyEvent.preventDefault(); finishEdit(false); }
      });
      input.addEventListener("blur", () => finishEdit(true), { once: true });
      return;
    }
    saveAndNotify(); render();
  });

  searchInput.addEventListener("input", render);
  statusFilter.addEventListener("change", render);
  priorityFilter.addEventListener("change", render);
  render();
}());
