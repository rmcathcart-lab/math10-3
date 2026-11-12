# Math 10-3

Everything for Mr. Cathcart's Math 10-3, in one site: https://rmcathcart-lab.github.io/math10-3/

It is the Math 10C site's engine (https://github.com/rmcathcart-lab/math10c) with the Math 10-3 course: its own catalog
(`js/catalog.js`, 8 units), navy accent colour, trade-certification outcome cards (`js/certs.js` + `assets/certs.css`; the Math 15 badges in `js/badges.js` are kept but not loaded) instead of the 10C medals,
and its own Apps Script backends. Math 10-3 uses the Math 10-3 outcome codes (AN1–AN5, RF1–RF9) at introductory expectations.

| Part | Where | Repo folder |
|---|---|---|
| **Practice** (students: homework with generated questions, sign-in, progress) | `/math15/` | root (`index.html`, `js/`, `assets/`) |
| **Lessons** (projected from the iPad with Apple Pencil ink; students view the class notes with `?class=B`) | `/math15/lessons/` | `lessons/` (see `lessons/README.md`, `lessons/LESSON_BRIEF.md`) |
| **Teacher dashboard** (Teacher Ledger) | `/math15/teacher/` | `teacher/` |

Each part with a server has its own Apps Script backend (`backend/Code.gs` = Teacher Ledger, `lessons/backend/Code.gs` =
Teaching Ink); their web-app URLs go in `js/config.js` and `lessons/js/config.js`.

**Publishing:** GitHub Pages builds from the `gh-pages` branch, so push `main` to both: `git push origin main main:gh-pages`.

**Built so far:** Unit 4 (Factoring Polynomial Expressions): 10 lesson pages, 10 practice assignments with extra practice,
an exit slip per lesson and the unit test. The other units show as "coming soon".

# Practice

Homework practice for every Math 10-3 lesson, built from the course booklets. Every question is a generator: it keeps the idea and difficulty of the booklet question and changes the numbers, so each student gets their own version (the same on every device) and a fresh one whenever they need it.

- **Students:** `index.html`. Sign in with the class code (or the class link/QR code), pick your name, make a 4-digit PIN.
- **Teacher:** `teacher/` (the Teacher Ledger). Needs the teacher key from the Apps Script project.

## How a question works

- Answers are checked as soon as the student presses **Check**.
- A recognised mistake (a missing factor pair, calling 161 prime, dividing by a non-prime on a ladder, …) gets a hint aimed at that mistake. A formatting slip (commas instead of ×, a repeated prime, a blank box) gets a nudge that doesn't use a try.
- After 3 wrong tries (2 for multiple choice) the answer and worked solution are shown, and the student finishes the question with a new version.
- Leaving the tab or window while a question is open gives that question new numbers and is logged for the teacher.
- Division ladders and factor trees are built step by step, and every step is checked.
- The on-screen calculator follows the TI-30XIIS layout and order of operations.

## Files

| Path | What it is |
|---|---|
| `js/ns.js` | **First script on every page.** Keeps this site's browser storage under an `m103/` prefix, because the Math 10C site shares the same web address (otherwise the two Teacher Ledgers sign each other out and lesson ink leaks between courses) |
| `js/courses.js` | Fallback course list for the switcher. The real list is `teaching/js/courses.js` (see Teaching Hub below) |
| `js/core.js` | Seeded random numbers, number theory, answer parsing, KaTeX helpers |
| `js/kit.js` | Shared checkers with error diagnoses, and the lesson registry |
| `js/lessons/u1l*.js`, `u2l*.js` | Units 1 and 2: every assignment question plus the extra practice |
| `js/expr.js` | Reads typed answers (LaTeX or plain text): roots of any index, fractions, repeating decimals, π, variables |
| `js/kitx.js` | Checkers for radicals (mixed/entire), fractions, repeating decimals, rounding, ordering, tables; part builders `K.P.*` |
| `js/poly.js` | Unit 3: exact polynomial algebra (`HW.poly`), the polynomial answer checker `K.poly` / `K.P.poly` (exact equality + expanded/simplified nudges + classic-error diagnoses), the `poly` keypad, algebra tiles (`HW.tiles`) and area models (`HW.areaModel`). Tests: `tests/poly_test.js` |
| `js/widgets.js`, `js/widgets2.js`, `js/steps.js` | Answer inputs: number, list (chips), math (MathLive, with keypads for radicals, fractions, repeating decimals, variables), multiple choice, select, prime/composite with a proof, pairs, ordering, tables, labelled boxes, division ladder, factor tree |
| `js/calc.js` | The TI-30XIIS-style calculator |
| `js/app.js`, `js/ledger.js` | The student app, and syncing to the teacher's ledger |
| `js/catalog.js` | Units and lessons (a lesson is open once its lesson file exists) |
| `teacher/` | The teacher dashboard |
| `backend/Code.gs` | Google Apps Script backend (paste into the Apps Script project) |
| `tests/` | `node tests/gen_test.js [runs] [lessonId]` (every generator), `node tests/kitx_test.js` (the shared checkers), `node tests/mathlive_form_test.js` (answer keys typed the way the MathLive keyboard writes them), `node tests/calc_test.js`, `tests/e2e.py` (Playwright, against `backend/mock_server.js`) |

## Adding a lesson

1. Write `js/lessons/u1l2.js` with `HW.defineLesson({ id: 'u1l2', … questions: […], extra: […] })` (see `u1l1.js`). Each part has an `id`, a `level` (LIM BEG EMG PRG ADV MAS) and a `make(rng, shared)` that returns `{ prompt, input, check, key, answer, solution, hints }`.
2. Add a `<script>` tag for it in `index.html` and `teacher/index.html`.
3. Run `node tests/gen_test.js 300 u1l2` (one lesson at a time is quicker).

## Unit projects

Each unit can have one guided project (like the robotics missions), opened at `#/project/<id>`: 5–7 checkpoints, each
with a goal, the lessons it uses, an animated worked example (on a different shop, Maple Leaf Treats) and a tool the
student builds with. **Check my work** marks every box against the student's own choices; the next checkpoint opens
when a checkpoint is all right (going back is always allowed). Work saves to the device and the ledger as they go.

- Engine: `js/projects.js` (+ `assets/projects.css`). A project: `HW.defineProject({ id, unit, title, tagline, outcomes,
  lessonNames, checkpoints: [{ id, title, needs, goal, example, render(box, c), check(c), solve(c) }] })` in
  `js/projects/u<N>.js`. `render` builds the tool with `c.input / c.choice / c.select / c.text`; `check` returns results
  from `c.money / c.pct / c.number / c.equals / c.need / c.msg` (with `wrong: [{ v, hint }]` for targeted hints);
  `solve` fills right answers (tests). Unit 1: `js/projects/u1.js` (Pop-Up Shop).
- To add a unit's project: write `js/projects/u<N>.js`, add a `<script>` tag in `index.html` and `teacher/index.html`,
  and add `project: { id, title }` to the unit in `js/catalog.js` (the class calendar then plans a project work day,
  `p<N>`, right before the unit's review lesson; saved calendars pick it up there).
- Due on the unit test day. Graded in the Teacher Ledger's **Projects** tab (`teacher/projects.js`): indicator per
  outcome (with a suggestion from first-try accuracy), comment, release. Released indicators count toward the student's
  outcome badges like a released test.
- Backend: "Projects" sheet; `POST kind:'project'` (lock-free), `myprojects`, `projects`, `setproject`.
- Tests: `node tests/projects_test.js`, `python3 tests/projects_e2e.py` (8841 + mock on 8845).


`backend/Code.gs` runs as an Apps Script web app (Execute as: me · Who has access: Anyone) and writes to the "Math 10-3 Practice Ledger" spreadsheet: Roster, Attempts, Events, Progress, Days. Run `setup()` once; the teacher key is in Project Settings → Script properties. Put the web-app URL in `js/config.js`. After changing `Code.gs`, deploy a **new version of the same deployment** so the URL stays the same.

## Link to the teaching site

The home page shows a small **Lesson** card to the left of each assignment, and the lesson sidebar starts with a
**Go to the lesson** button. Both open the same lesson on the Math 10-3 Teaching site in a new tab (`HW.TEACHING` in
`js/catalog.js` lists the lessons it has), with `?class=<block>` so the student sees that class's notes. The block is the one set for the class in the dashboard's Settings; without one, a final letter
A–D in the class code (e.g. `10c-b`) is used, otherwise the link has no class.

## Teaching Hub (universal settings)

Bell times, days off, the semester schedule (which class is in which block), the universal calendar and sub plans live
in the Teaching Hub: https://rmcathcart-lab.github.io/teaching/ (repo `teaching`). It sends bell times and days off to
this ledger's backend, gives the current semester's classes their block, and reads and changes the class calendars
through `teacher/bridge.html` (keep `teacher/bridge.js` the same in math10c and math15). The course switcher (the badge in
the ledger's corner) comes from `teaching/js/courses.js`; `js/courses.js` here is only a fallback. The ledger opens a
class with `?class=<code>` and a tab with `?tab=<tab>` (the hub's universal bookmark uses these).
