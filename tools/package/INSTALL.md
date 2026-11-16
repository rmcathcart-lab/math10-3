# Math 10-3 Course Package: Setup Guide

This guide gets the whole Math 10-3 course running for a new teacher: the class website (practice, lessons, projects,
tests and exit slips), the Teacher Ledger, live lesson notes, and the printable booklets. Plan on about an hour.
You don't need to know how to code. Every change is made with copy and paste.

## What's in the package

| Folder | What it is |
|---|---|
| `website/` | The whole class website. It goes on GitHub Pages (free). |
| `website/backend/Code.gs` | The **Practice Ledger** server: class lists, student work, tests, exit slips, projects and the calendar. It runs in your Google account as an Apps Script and saves to a Google Sheet. |
| `website/lessons/backend/Code.gs` | The **Teaching Ink** server: your Apple Pencil notes on the lesson pages, shared live to students. A second Apps Script. |
| `booklets/PDFs/` | Every unit's booklet, ready to print: Booklet, Lessons Only, Solutions, Extra Practice, Extra Practice Solutions. |
| `booklets/unit1` … `unit7`, `booklets/common` | The LaTeX sources, if you ever want to change a booklet. Optional. |

## What you need

- A computer with **Chrome**.
- A **GitHub** account (free): github.com. It hosts the website.
- **GitHub Desktop** (free): desktop.github.com. It uploads the website's 400+ files in one go.
- A **Google account** for the two Apps Scripts and their Google Sheets. Use your school Google account if you can,
  because the Sheet holds student names and work. Your school must allow web apps that "Anyone" can reach. If the
  "Anyone" choice is missing in step 2.6, see Troubleshooting.
- Optional: an **iPad and Apple Pencil** for writing on the lesson pages while you project them.

Keep a note open as you go. You will collect **two web addresses** (the Ledger URL and the Ink URL) and **two teacher keys**.

---

## Part 1: Put the website on GitHub Pages

1. Sign in at **github.com**. Click **+** (top right) → **New repository**.
   - Repository name: `math10-3` (any name works; it becomes part of the address).
   - Choose **Public**. GitHub Pages is free for public repositories. The site holds no student data: that stays in
     your Google Sheet.
   - Click **Create repository**.
2. Open **GitHub Desktop** and sign in with the same account. Choose **File → Clone repository**, pick `math10-3`, and
   choose a folder on your computer (for example Documents). Click **Clone**.
3. Open the package's `website` folder. Select **everything inside it**, including the hidden file `.nojekyll` (on a Mac,
   press Cmd+Shift+. in Finder to show hidden files). Copy it all into the cloned `math10-3` folder.
4. In GitHub Desktop, type a summary such as `Add the Math 10-3 site`. Click **Commit to main**, then **Push origin**.
5. On github.com, open the repository → **Settings** → **Pages**. Under *Build and deployment*, set Source to
   **Deploy from a branch**, Branch to **main** and the folder to **/ (root)**. Click **Save**.
6. Wait a few minutes. Your site is at **`https://YOUR-USERNAME.github.io/math10-3/`** (the Pages screen shows the
   link). Open it: the practice site loads in *practice mode* until Part 4 is done.

## Part 2: The Practice Ledger (student work and the Teacher Ledger)

1. Go to **script.google.com** and click **New project**. Name it `Math 10-3 Practice Ledger` (click "Untitled project").
2. Delete the few lines already in `Code.gs`. Open `website/backend/Code.gs` from the package in a text editor (TextEdit
   or Notepad), select all, copy, and paste it into the editor. Click **Save** (the disk icon).
3. Click the **⚙ Project Settings** gear. Check that *Time zone* is yours (the code is set for Alberta, America/Edmonton;
   if you are somewhere else, also change the line `var TZ = 'America/Edmonton';` near the top of Code.gs).
4. Back in the **Editor**, choose **setup** in the function menu at the top and click **Run**. Google asks you to
   authorize: **Review permissions** → choose your account → if it says *Google hasn't verified this app*, click
   **Advanced → Go to Math 10-3 Practice Ledger (unsafe)** → **Allow**. (It is "unverified" only because you wrote it.)
5. When it finishes, the **Execution log** shows a link to the new Google Sheet and your **teacher key** (12 letters and
   numbers). Write the key down. You can find it again later under Project Settings → Script properties → `TEACHER_KEY`.
6. Click **Deploy → New deployment**. Click the gear next to *Select type* → **Web app**. Set:
   - Description: `v1`
   - Execute as: **Me**
   - Who has access: **Anyone**

   Click **Deploy** and copy the **Web app URL** (it ends in `/exec`). This is your **Ledger URL**.

## Part 3: Teaching Ink (live lesson notes)

Skip this part if you won't write on the lesson pages. Without it, the lesson pages still work and ink stays on the device you write on.

1. On **script.google.com**, click **New project**. Name it `Math 10-3 Teaching Ink`.
2. Paste in `website/lessons/backend/Code.gs` the same way as before, and click **Save**.
3. Run **setup** and authorize it like in Part 2. The Execution log shows your **ink teacher key** (6 letters). Write it down.
4. Click **Deploy → New deployment → Web app**, with Execute as **Me** and Who has access **Anyone**. Copy the **Web app URL**. This is your **Ink URL**.

## Part 4: Fill in the settings

In the cloned `math10-3` folder on your computer, open these two files in a text editor and fill in the blanks
between the quote marks. Keep the quotes and commas.

**`js/config.js`**

```js
var HW_CONFIG = {
  siteName: 'Math 10-3 Practice',
  teacher: { name: 'Ms. Lee', fullName: 'Jordan Lee', email: 'jlee@yourschool.ca', school: 'Prairie High School' },
  hub: false,
  backend: 'https://script.google.com/macros/s/…/exec'      ← your Ledger URL
};
```

- `name` is what students call you. It appears on the home page's **Email** button, the certification cards and the
  project hand-in messages.
- `fullName`, `email` and `school` sign the Teacher Ledger's *Email home* messages and fill the course outline.

**`lessons/js/config.js`**

```js
  inkApi: 'https://script.google.com/macros/s/…/exec',       ← your Ink URL (or leave '' if you skipped Part 3)
  classes: ['A', 'B', 'C', 'D'],                               ← the blocks you might teach this course in
```

Save both files. In GitHub Desktop, commit (`Settings`) and **Push origin**. Give it a minute or two, then reload the site.

## Part 5: Set up your classes (Teacher Ledger)

1. Open **`https://YOUR-USERNAME.github.io/math10-3/teacher/`** and enter your **teacher key** from Part 2.
2. The ledger opens on **Settings**, with a made-up **demo class** so you can look around. When you're ready, hide it
   in Settings.
3. Under **New class**:
   - Type a short **class code** (students type it, e.g. `103-b`) and a name (e.g. `Math 10-3 · Block B`).
   - Paste the class list, one name per line. Or click **Fill from a PowerSchool scores template…**.
   - Click **Create class**.
4. Still in **Settings**, for each class:
   - **Class time → This class meets in**: pick its block. Practice done during that block counts as *in class*.
   - **Class times** (bell schedule, once for all classes): the times shown are samples. Type your school's start and
     end times for each block and click **Save class times**.
   - **Class link**: copy the link or show the QR code. Students open it, pick their name and make a 4-digit PIN.
5. **Calendar** tab: pick the first class day and click **Make the calendar**. Then click **Days off…** and tap every
   holiday and PD day. The lessons move along by themselves. Drag lessons to adjust the pace at any time.

## Part 6: Teaching from the lesson pages

1. On your iPad (or computer), open **`https://YOUR-USERNAME.github.io/math10-3/lessons/`**. Add it to the Home Screen
   if you like (Share → Add to Home Screen).
2. Open any lesson. Tap **•••** (top right) → *Teacher* → type your **ink teacher key** → **Sign in**.
3. In the same **•••** menu, pick the **class you're teaching**. What you write goes live to that class.
4. Students see your notes from the lesson links on their practice home page. They are view only, and each class
   sees its own notes.

## Part 7: Make it yours

- **Day One lesson** (`lessons/u1/l0/index.html`): the *A Little About Me* tiles show prompts in grey. Replace them
  with your own lines, and change `your.email@school.ca`. For a photo, save a landscape picture as
  `lessons/assets/intro/teacher.jpg`. Also skim the page for anything that works differently at your school (make-up
  tests, devices, phones, emergency routines).
- **Course outline**: open **`https://YOUR-USERNAME.github.io/math10-3/assets/outline/outline.html`** in Chrome. Your
  name, email, school, the school year and a QR code for your site fill in by themselves. To change the text (the room
  number, make-up tests, policies), edit `assets/outline/outline.html`. To update the PDF the Day One lesson links to:
  **Print → Save as PDF** (paper Letter, margins Default, *Background graphics* on). Save it over
  `assets/outline/math10-3-course-outline.pdf`, then commit and push.

After any change: commit and push in GitHub Desktop. The site updates in a minute or two (reload with Shift held down if
it doesn't).

## Part 8: Booklets

`booklets/PDFs/` has every unit's PDFs ready to print. *Lessons Only* is the notes booklet students follow in class
(the site's **Printable Notes** button links to the same PDFs). *Booklet* has the lessons with the assignments.

To change a booklet, edit the `.tex` files in `booklets/unitN/` and rebuild with a LaTeX installation (TeX Live or
MacTeX). See `booklets/README.md`.

---

## Changing a server later

If you ever change a `Code.gs`, paste the new code into its Apps Script project and **Save**. Then go to **Deploy →
Manage deployments → ✏ (edit) → Version: New version → Deploy**. This keeps the same URL, so nothing else changes.
(*New deployment* would make a new URL, and you would have to put it back in the config file.)

## Troubleshooting

| What you see | What to do |
|---|---|
| The site shows a 404 page | Pages takes a few minutes the first time. Check Settings → Pages (branch **main**, folder **/ (root)**) and that the files are at the top of the repository, not inside a `website` folder. |
| "Can't reach the ledger" | Check the Ledger URL in `js/config.js` (it ends in `/exec`). Check the deployment's access is **Anyone**. Open the URL itself in a browser: it should show a short line starting `{"ok":true`, not a Google sign-in page. |
| "Anyone" isn't offered in step 2.6 | Your school's Google admin blocks public web apps. Ask them to allow it, or use a personal Google account. If you use a personal account, the student names and work live in that account's Sheet. |
| Teacher key not accepted | The Ledger key (12 characters) and the Ink key (6 characters) are different. Each is in its own project under Project Settings → Script properties. |
| A change doesn't show up | Wait a minute after pushing, then reload with Shift held down. On the iPad, close the tab and open it again. |
| Times are off by an hour or more | Set the Apps Script project's time zone (Project Settings) and the `TZ` line in `backend/Code.gs` to your time zone, then deploy a new version. |
| Students' work isn't counting as "in class" | Give the class its block (Settings → Class time) and check the bell times (Settings → Class times). |

## Where the data lives

- Student names, PINs (stored scrambled, never in plain text) and all student work: the **Math 10-3 Practice Ledger**
  Google Sheet in your account.
- Your lesson notes: the **Math 10-3 Teaching Ink** Sheet in your account.
- The website on GitHub holds only the course itself. No student data is ever stored there.
