# FocusList

FocusList is a responsive, frontend-only daily task planner built with semantic HTML, CSS, and vanilla JavaScript.

## Links

- Live application: https://melvinth14.github.io/todolist/
- Public source: https://github.com/melvinth14/todolist

## Features

- Add tasks with High, Medium, or Low priority.
- Mark tasks completed or active.
- Edit and delete tasks.
- Search by title.
- Filter by All, Active, Completed, or priority.
- Live Total Tasks, Completed Tasks, and Pending Tasks statistics.
- Persist tasks across refreshes with browser localStorage.
- Responsive desktop and mobile layout.
- Keyboard-accessible controls with semantic regions, labels, focus styles, and live status feedback.

## Architecture

The app has no backend, framework, build step, external database, or runtime dependency:

- `index.html` is the canonical GitHub Pages entry point.
- `todolist.html` is a compatible direct entry point.
- `todolist.css` contains responsive design tokens, layout, states, and media queries.
- `task-store.js` owns task normalization, ID creation, validation, and localStorage persistence.
- `task-view.js` owns safe HTML escaping, task-list rendering, statistics, and progress rendering.
- `todolist.js` is the controller that coordinates state changes, filters, forms, and delegated events.

The browser renders the current task state from one in-memory collection. Derived statistics, completion progress, and filtered rows are recalculated after every state change, keeping the UI synchronized with the underlying data.

## Security and Reliability

Task titles are trimmed and limited to 140 characters. Loaded localStorage records are validated before use, allowed priorities are whitelisted, and task titles and identifiers are HTML-escaped before insertion into generated markup. Storage exceptions fall back without crashing the app. No user data leaves the browser.

## Run Locally

Open `index.html` directly, or serve the folder with any static file server. GitHub Pages serves the same static files from the `master` branch root. No installation or environment variables are required.

## Manual Test Checklist

1. Add tasks with each priority and verify the visible priority label.
2. Toggle a task and verify completed and pending statistics.
3. Edit a task with Enter and cancel with Escape.
4. Delete a task and refresh the page to verify persistence.
5. Search by title and combine status and priority filters.
6. Tab through controls and use the keyboard without a mouse.
7. Check the layout at mobile and desktop widths.
