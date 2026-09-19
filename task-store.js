(function () {
  const storageKey = "focuslist-tasks-v1";
  const validPriorities = new Set(["high", "medium", "low"]);

  function createId() {
    return typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function normalize(task) {
    if (!task || typeof task !== "object") return null;
    const title = typeof task.title === "string" ? task.title.trim().slice(0, 140) : "";
    if (!title) return null;
    return {
      id: typeof task.id === "string" && task.id.length <= 80 ? task.id : createId(),
      title,
      priority: validPriorities.has(task.priority) ? task.priority : "medium",
      completed: task.completed === true
    };
  }

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      return Array.isArray(saved) ? saved.map(normalize).filter(Boolean) : [];
    } catch (error) {
      return [];
    }
  }

  function save(tasks) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(tasks));
      return true;
    } catch (error) {
      return false;
    }
  }

  window.FocusListStore = Object.freeze({
    createId,
    isPriority: (priority) => validPriorities.has(priority),
    load,
    normalize,
    save
  });
}());
