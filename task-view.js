(function () {
  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
  }

  function renderTasks(container, tasks) {
    container.innerHTML = tasks.map((task) => `<li class="task-item ${task.completed ? "completed" : ""}" data-id="${escapeHtml(task.id)}">
      <button class="check-button" type="button" data-action="toggle" aria-label="${task.completed ? "Mark task active" : "Mark task completed"}" aria-pressed="${task.completed}">${task.completed ? "✓" : ""}</button>
      <div class="task-content"><div class="task-title">${escapeHtml(task.title)}</div><div class="task-meta"><span class="priority priority-${task.priority}">${task.priority}</span><span class="task-state">${task.completed ? "Completed" : "In progress"}</span></div></div>
      <div class="task-actions"><button class="action-button" type="button" data-action="edit">Edit</button><button class="action-button delete" type="button" data-action="delete">Delete</button></div>
    </li>`).join("");
  }

  function renderStats(tasks) {
    const completed = tasks.filter((task) => task.completed).length;
    document.getElementById("totalCount").textContent = tasks.length;
    document.getElementById("completedCount").textContent = completed;
    document.getElementById("pendingCount").textContent = tasks.length - completed;
    document.getElementById("progressFill").style.width = tasks.length ? `${Math.round((completed / tasks.length) * 100)}%` : "0%";
    document.getElementById("progressLabel").textContent = tasks.length ? `${Math.round((completed / tasks.length) * 100)}% complete` : "Ready to focus";
  }

  function renderEmptyState(emptyState, title, message, isEmpty) {
    emptyState.hidden = !isEmpty;
    document.getElementById("emptyTitle").textContent = title;
    document.getElementById("emptyMessage").textContent = message;
  }

  window.FocusListView = Object.freeze({ renderEmptyState, renderStats, renderTasks });
}());
