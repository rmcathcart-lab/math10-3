# Math 10-3 website

The setup steps are in **INSTALL.md** in the package. This file is a map of the site.

| Part | Address | Folder |
|---|---|---|
| Practice site (students) | `/` | `index.html`, `js/`, `assets/` |
| Lesson pages (projected, Apple Pencil ink) | `/lessons/` | `lessons/` |
| Teacher Ledger | `/teacher/` | `teacher/` |
| Course outline | `/assets/outline/outline.html` | `assets/outline/` |

- **Settings**: `js/config.js` (Ledger URL, your name, email and school) and `lessons/js/config.js` (Ink URL, blocks).
- **Servers** (Google Apps Script): `backend/Code.gs` (Practice Ledger) and `lessons/backend/Code.gs` (Teaching Ink).
  After changing one, deploy a *new version of the same deployment* so its URL stays the same.
- **Units and lessons**: `js/catalog.js`. Practice questions: `js/lessons/uNlM.js`. Unit tests: `js/lessons/uNtest.js`.
  Exit slips: `js/exits/uN.js`. Projects: `js/projects/uN.js`. Lesson pages: `lessons/uN/lM/`.
- **Notes PDFs** behind the site's *Printable Notes* button: `assets/notes/`.
- Browser storage is kept under an `m103/` prefix (`js/ns.js`), so other sites at the same github.io address don't mix with it.
