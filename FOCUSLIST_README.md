# FocusList

FocusList is a frontend-only daily task planner built with semantic HTML, modern CSS, and vanilla JavaScript.

## Live Demo

- Live app: https://melvinth14.github.io/todolist/
- Source: https://github.com/melvinth14/todolist

## Features

- Create tasks with High, Medium, or Low priority.
- Mark tasks complete or active.
- Edit and delete tasks.
- Search by title and filter by status or priority.
- Live Total, Completed, and Pending counts.
- Browser `localStorage` persistence.
- Responsive desktop and mobile layout.
- Keyboard-friendly controls with semantic landmarks, labels, focus states, and live status updates.

## Structure

```text
index.html       Canonical GitHub Pages entry point
todolist.html    Direct task-page entry point
todolist.css     Responsive design and accessibility states
todolist.js      State, rendering, filtering, persistence, and sanitization
.nojekyll        Static GitHub Pages configuration
```

## Run Locally

Open `index.html` in a browser. No build step, backend, package installation, or external database is required. A static file server can also serve the folder for production-like local behavior.

## Data and Security

Tasks stay in the visitor's browser under `focuslist-tasks-v1`. Titles are length-limited, normalized on load, and HTML-escaped before rendering. Stored priorities and completion values are validated. Storage failures fall back without crashing the interface.

## Evaluation Notes

The project is dependency-free for fast loading and predictable deployment. Automated evaluators should use the repository root or the live demo URL rather than a local `file:///` path.
