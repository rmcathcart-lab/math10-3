#!/usr/bin/env python3
"""Make a clean copy of the Math 10-3 course to give to another teacher.

    python3 tools/package/make_package.py [booklet source dir] [output dir]
    (defaults: /home/claude/m103book  /tmp/m103pkg)

What it does (the live site is never changed):
  * website/  every published file of this repo, minus the build/test tools and the internal notes, with
      - js/config.js and lessons/js/config.js reset: no backend URLs, blank teacher details, hub: false (runs without
        the Teaching Hub: bell times, blocks and days off are set in the Teacher Ledger)
      - the Day One lesson and the course outline made generic (no name, photo, crest, school or division policies)
      - every other mention of the original teacher, school or GitHub account taken out (checked at the end)
  * booklets/ the LaTeX sources (common/ + unitN/) and the printable PDFs (booklets/PDFs/Unit N - <title>/)
  * INSTALL.md, README.md  (from tools/package/INSTALL.md and README.md)
  * Math 10-3 Course Package.zip  everything above in one file
"""
import os, re, shutil, subprocess, sys, zipfile

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
BOOK = sys.argv[1] if len(sys.argv) > 1 else '/home/claude/m103book'
OUT = sys.argv[2] if len(sys.argv) > 2 else '/tmp/m103pkg'
PKG = os.path.join(OUT, 'Math 10-3 Course Package')
WEB = os.path.join(PKG, 'website')
HERE = os.path.dirname(os.path.abspath(__file__))

UNITS = {1: 'Unit Pricing and Currency Exchange', 2: 'Earning an Income', 3: 'Length, Area and Surface Area',
         4: 'Volume, Capacity, Mass and Temperature', 5: 'Angles, Parallel Lines and Spatial Puzzles',
         6: 'Similarity and Scale', 7: 'Right Triangles and Trigonometry'}

# files and folders that stay behind (build tools, tests, internal notes, the hub bridge, personal pictures)
DROP = [r'^tests/', r'^tools/', r'^lessons/dev/', r'^lessons/js/dev/', r'\.md$', r'(^|/)backend/mock_server\.js$',
        r'^teacher/bridge\.(html|js)$', r'^lessons/assets/intro/', r'^\.github/', r'^\.gitignore$', r'^\.nojekyll$']
KEEP_ANYWAY = []

# anything matching this must be gone from the package (checked over every text file at the end)
BANNED = re.compile(r'ryan|cathcart|rmcathcart|croxford|cavalier|cavs\b|rocky ?view|rvschools|2997|5b7d499e55db|KHHJC8|AKfycb|'
                    r'learning commons|whcroxford', re.I)


def run(cmd, **kw):
    return subprocess.run(cmd, check=True, capture_output=True, text=True, **kw).stdout


def edit(path, pairs, count=1):
    """exact replacements; each old text must be found (count times, or at least once when count is None)"""
    p = os.path.join(WEB, path)
    s = open(p, encoding='utf-8').read()
    for a, b in pairs:
        n = s.count(a)
        if (count is None and n < 1) or (count is not None and n != count):
            sys.exit('make_package: %s: expected %s of %r, found %d' % (path, count or '1+', a[:70], n))
        s = s.replace(a, b)
    open(p, 'w', encoding='utf-8').write(s)


def resub(path, pattern, repl, flags=0, need=True):
    p = os.path.join(WEB, path)
    s = open(p, encoding='utf-8').read()
    s2, n = re.subn(pattern, repl, s, flags=flags)
    if need and not n:
        sys.exit('make_package: %s: no match for %r' % (path, pattern))
    open(p, 'w', encoding='utf-8').write(s2)


# ---------------------------------------------------------------- 1. copy the website
def copy_site():
    if os.path.exists(OUT):
        shutil.rmtree(OUT)
    os.makedirs(WEB)
    files = run(['git', 'ls-files'], cwd=ROOT).splitlines()
    n = 0
    for f in files:
        if any(re.search(d, f) for d in DROP) and f not in KEEP_ANYWAY:
            continue
        dst = os.path.join(WEB, f)
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copy2(os.path.join(ROOT, f), dst)
        n += 1
    open(os.path.join(WEB, '.nojekyll'), 'w').close()   # GitHub Pages: serve every file as it is
    print('website: %d files' % n)


# ---------------------------------------------------------------- 2. settings
def settings():
    p = os.path.join(WEB, 'js/config.js')
    open(p, 'w', encoding='utf-8').write('''/* Site settings: fill these in when you set the site up (see INSTALL.md).
 *   backend  the /exec URL of YOUR "Math 10-3 Practice Ledger" Apps Script web app (backend/Code.gs). Leave it empty
 *            and the site runs in practice mode: no sign-in, and work is saved on the student's device only.
 *   teacher  how students and families see you: the home page's "Email ___" button, the certification cards, the
 *            project hand-in messages and the Teacher Ledger's "Email home" sign-off. Empty = "your teacher".
 *            name: what students call you ("Ms. Lee"), fullName: for emails home ("Jordan Lee"), email, school.
 *   hub      keep false: bell times, each class's block and the days off are set in the Teacher Ledger. */
var HW_CONFIG = {
  siteName: 'Math 10-3 Practice',
  teacher: { name: '', fullName: '', email: '', school: '' },
  hub: false,
  backend: ''
};
''')
    p = os.path.join(WEB, 'lessons/js/config.js')
    open(p, 'w', encoding='utf-8').write('''/* Lesson-page settings (see INSTALL.md).
 * inkApi: the /exec URL of YOUR "Math 10-3 Teaching Ink" Apps Script web app (lessons/backend/Code.gs). Empty = live
 * sharing is off and every device can write (ink is only saved on that device). Once it's set, only a device signed in
 * with the ink teacher key can write; everyone else sees the teacher's notes for their class link (?class=B), view only.
 * classes: the blocks you teach this course in (the buttons on the lessons home). */
export const CONFIG = {
  inkApi: '',
  hub: false, // no Teaching Hub: pick the class on the lessons home (or open a ?class=B link)
  course: 'math10-3',
  classes: ['A', 'B', 'C', 'D'],
  classLabel: (c) => (/^[A-D]$/.test(c) ? 'Block ' + c : c)
};
''')
    open(os.path.join(WEB, 'js/courses.js'), 'w', encoding='utf-8').write(
        '/* Other courses for the switcher in the Teacher Ledger\'s corner (optional): { mark, name, colour, ledger: URL }. */\n'
        'var HW_COURSES = [];\n')
    edit('teacher/index.html', [('<script src="../../teaching/js/courses.js"></script>\n', '')])


# ---------------------------------------------------------------- 3. the Day One lesson
def day_one():
    f = 'lessons/u1/l0/index.html'
    resub(f, r'<!-- Day one \(no assignment\)\..*?-->', '<!-- Day one (no assignment): how the course works. Make it yours: the "A Little About Me" tiles, '
          'a photo (lessons/assets/intro/teacher.jpg) and anything about your school (make-up tests, devices, emergency routines). -->', re.S)
    edit(f, [
        ('<h1>Welcome to Math 10-3<br>with Mr. Cathcart</h1>', '<h1>Welcome to<br>Math 10-3</h1>'),
        ('<img src="../../assets/intro/croxford-cavaliers.png" alt="Croxford Cavaliers crest" width="210" height="210">\n      <div class="u1l0-cavs">Compassionate Cavs</div>',
         '<img src="../../assets/icon.svg" alt="Math 10-3" width="210" height="210">'),
        ('<figure class="u1l0-photo"><img src="../../assets/intro/cathcart-family.jpg" alt="Mr. Cathcart with his family at a park" width="720" height="540"></figure>',
         '<figure class="u1l0-photo"><img src="../../assets/intro/teacher.jpg" alt="Your teacher" width="720" height="540" '
         'onerror="var g=this.closest(\'.u1l0-me-grid\'); if (g) g.classList.add(\'u1l0-nophoto\'); this.parentNode.remove();"></figure>'),
        ('I grew up in Calgary, so I’ve been around here all my life. Airdrie is better though.', '<i class="muted">A line or two about where you’re from.</i>'),
        ('I love watching movies and TV, playing board games and video games, backpacking, and eating good food. Basic stuff.', '<i class="muted">What you like to do when you’re not teaching.</i>'),
        ('I used to be an engineer, but there wasn’t enough math involved.', '<i class="muted">How you got here, in a sentence.</i>'),
        ('Email <b>rcathcart@rvschools.ab.ca</b>, or just come find me in this room. I’m here most of the time.', 'Email <b>your.email@school.ca</b>, or just come find me in this room.'),
        ('Croxford is a bring-your-own-device school. Ask the office about borrowing a school Chromebook for the year.', 'Ask the office about borrowing a school Chromebook for the year.'),
        ('<section class="card u1l0-culture" data-ink="culture" data-section="Compassionate Cavs">', '<section class="card u1l0-culture" data-ink="culture" data-section="Our Classroom Culture">'),
        ('<img src="../../assets/intro/croxford-cavaliers.png" alt="" width="84" height="84"><div><div class="kicker">Our classroom culture</div><h2>Compassionate Cavs</h2>',
         '<img src="../../assets/icon.svg" alt="" width="84" height="84"><div><div class="kicker">Our classroom culture</div><h2>Look Out for Each Other</h2>'),
        ('Mr. Cathcart’s four numbers — the class guesses first', 'My four numbers — the class guesses first'),
        ('download="Math 10-3 Course Outline 2026-27.pdf"', 'download="Math 10-3 Course Outline.pdf"'),
    ], count=None)
    resub(f, r'<p class="u1l0-cul-foot">.*?</p>', '<p class="u1l0-cul-foot">We look out for each other. In here, that starts with how we treat someone who’s stuck.</p>', re.S)
    resub(f, r'<b>Missed a test\?</b> Make it up in the <b>Test Centre</b>.*?</div>',
          '<b>Missed a test?</b> Talk to me as soon as you’re back: we’ll set a time to write it, following the school’s missed-assessment process.</div>', re.S)
    resub(f, r'across to the <b>back field</b>', 'to <b>our meeting spot</b> outside')
    resub(f, r'to the back field\?', 'to our meeting spot?')
    css = os.path.join(WEB, 'lessons/css/lessons/u1l0.css')
    s = open(css, encoding='utf-8').read()
    s = re.sub(r'^/\*.*?\*/', '/* Math 10-3 · Day One — Welcome to Math 10-3 (u1l0). */', s, count=1, flags=re.S)
    s = re.sub(r'\n\.u1l0-cavs \{[^}]*\}', '', s)
    s += '\n.u1l0-me-grid.u1l0-nophoto { grid-template-columns: 1fr; }\n.u1l0-crest img { border-radius: 24px; }\n'
    open(css, 'w', encoding='utf-8').write(s)
    edit('lessons/js/lessons/u1l0.js', [('Only Mr. Cathcart can unlock it.', 'Only your teacher can unlock it.'),
                                         ('Mr. Cathcart releases them.', 'your teacher releases them.')])
    os.makedirs(os.path.join(WEB, 'lessons/assets/intro'), exist_ok=True)
    open(os.path.join(WEB, 'lessons/assets/intro/PUT teacher.jpg HERE.txt'), 'w').write(
        'Optional: a photo for the Day One lesson ("A Little About Me"), saved here as teacher.jpg (landscape, about 720 × 540).\n'
        'Without it, the section shows the tiles only.\n')


# ---------------------------------------------------------------- 4. the course outline
def outline():
    f = 'assets/outline/outline.html'
    resub(f, r'<!-- The official Math 10-3 course outline.*?-->', '<!-- The Math 10-3 course outline. Your name, email and school come from js/config.js and the year from today\'s date.\n'
          '     To make the PDF: open this page from your site in Chrome, Print → Save as PDF (Letter, Margins: Default, Background graphics on), and save it over\n'
          '     assets/outline/math10-3-course-outline.pdf. Edit the text below to match your school (make-up tests, devices, policies). -->', re.S)
    edit(f, [
        ('<title>Math 10-3 Course Outline 2026–27</title>', '<title>Math 10-3 Course Outline</title>'),
        ('  <img src="../../lessons/assets/intro/croxford-cavaliers.png" alt="Croxford Cavaliers crest">\n', '  <img src="../../lessons/assets/icon.svg" alt="Math 10-3">\n'),
        ('<div class="kick">W.H. Croxford High School · Mathematics Department</div>', '<div class="kick" id="ol-school">Mathematics Department</div>'),
        ('<div class="yr">2026–27<small>5 credits</small></div>', '<div class="yr"><span id="ol-year"></span><small>5 credits</small></div>'),
        ('<div class="val">Mr. Ryan Cathcart<small>Room 2997</small></div>', '<div class="val" id="ol-teacher">&nbsp;<small>Room ______</small></div>'),
        ('<div class="val"><a href="mailto:rcathcart@rvschools.ab.ca">rcathcart@rvschools.ab.ca</a><small>Students and parents welcome</small></div>',
         '<div class="val" id="ol-email">&nbsp;<small>Students and parents welcome</small></div>'),
        ('<div class="val" style="font-size:8.6pt">rmcathcart-lab<br>.github.io/math10-3<small>', '<div class="val" style="font-size:8.6pt" id="ol-site">&nbsp;<small>'),
        ("q.addData('https://rmcathcart-lab.github.io/math10-3/');", 'q.addData(OL_SITE);'),
        ('Croxford is a bring-your-own-device school; ask the office about borrowing a Chromebook for the year.', 'Ask the office about borrowing a Chromebook for the year.'),
    ])
    resub(f, r'Make it up at the <b>Test Centre</b>.*?</p>', 'Talk to your teacher as soon as you’re back to set a time to write it, following the school’s missed-assessment process.</p>', re.S)
    resub(f, r'<p class="policy">This course follows Rocky View Schools.*?(Questions about this outline)',
          r'<p class="policy">This course follows the school division’s assessment and reassessment policies and the school’s student handbook. \1', re.S)
    resub(f, r'Questions about this outline\? Email <a href="mailto:[^"]*">[^<]*</a>\.', 'Questions about this outline? Email your teacher<span id="ol-email2"></span>.')
    edit(f, [('<li><b>Compassionate Cavs:</b> be kind,', '<li><b>Look out for each other:</b> be kind,')])
    # fill the teacher, email, school, year and site address from js/config.js
    edit(f, [('</head>', '''<script src="../../js/config.js"></script>
<script>
  (function () {
    var T = (window.HW_CONFIG && HW_CONFIG.teacher) || {}, d = new Date(), y = d.getFullYear() - (d.getMonth() < 7 ? 1 : 0);
    window.OL_SITE = location.protocol === 'file:' ? '' : location.href.replace(/assets\\/outline\\/.*$/, '');
    document.addEventListener('DOMContentLoaded', function () {
      function set(id, html) { var e = document.getElementById(id); if (e) e.innerHTML = html + (e.querySelector('small') ? e.querySelector('small').outerHTML : ''); }
      function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
      set('ol-teacher', T.fullName || T.name ? esc(T.name && T.fullName && T.name !== T.fullName ? T.name : (T.fullName || T.name)) : '______________________');
      set('ol-email', T.email ? '<a href="mailto:' + esc(T.email) + '">' + esc(T.email) + '</a>' : '______________________');
      set('ol-site', OL_SITE ? esc(OL_SITE.replace(/^https?:\\/\\//, '')).replace(/\\.io\\//, '.io/<br>') : '______________________');
      var e2 = document.getElementById('ol-email2'); if (e2 && T.email) e2.innerHTML = ' at <a href="mailto:' + esc(T.email) + '">' + esc(T.email) + '</a>';
      var sc = document.getElementById('ol-school'); if (sc && T.school) sc.textContent = T.school + ' · Mathematics Department';
      var yr = document.getElementById('ol-year'); if (yr) yr.textContent = y + '–' + String(y + 1).slice(2);
    });
  })();
</script>
</head>''')])
    # the QR code waits for the address: no address (opened as a file) = no code
    resub(f, r"try \{ var q = window\.qrcode", "if (OL_SITE) try { var q = window.qrcode")


# ---------------------------------------------------------------- 5. comments and small mentions elsewhere
def scrub():
    edit('js/certs.js', [('"Issued by Mr. Cathcart"', '"Issued by" + the teacher\'s name from js/config.js')])
    edit('js/ns.js', [('(rmcathcart-lab.github.io)', '(<you>.github.io)')])
    edit('teacher/powerschool.js', [('Teacher Name:,Ryan Cathcart,', 'Teacher Name:,Jordan Lee,')])
    edit('js/lessons/u2l7.js', [("'Jordan', 'Kai', 'Nate', 'Ryan'", "'Jordan', 'Kai', 'Nate', 'Owen'")])
    edit('lessons/js/views.js', [(' * Ryan: the lessons', ' * The lessons'), ('(Ryan: not on the title card', '(not on the title card'),
                                  ('Ryan wants them moving', 'they stay moving')])
    edit('lessons/js/ink.js', [('(Ryan preferred it)', '(preferred)')])
    edit('teacher/pace.js', [('default mail app (Ryan\n *     uses Outlook)', 'default mail app')])
    edit('teacher/calendar.js', [("Ryan's edited copy", "the teacher's edited copy")])
    for f in ['lessons/js/blockpick.js', 'lessons/js/share.js']:
        edit(f, [("Ryan's schedule", "the teacher's schedule")])
    for f in ['js/partial.js', 'js/testcore.js']:
        edit(f, [("Ryan's rule", "the rule")])
    # dated notes in comments: "(Ryan, 2026-11-13)" → "(2026-11-13)"
    for dirpath, _, names in os.walk(WEB):
        for n in names:
            if not n.endswith(('.js', '.html', '.css', '.gs', '.py', '.txt', '.webmanifest')):
                continue
            p = os.path.join(dirpath, n)
            s = open(p, encoding='utf-8').read()
            s2 = re.sub(r'Ryan, (20\d\d-\d\d-\d\d)', r'\1', s)
            if s2 != s:
                open(p, 'w', encoding='utf-8').write(s2)


# ---------------------------------------------------------------- 6. the outline PDF and its thumbnail
def outline_pdf():
    """Print the generic outline (blank teacher lines) to PDF with Chromium, like tests/build_outline.py."""
    import asyncio
    from playwright.async_api import async_playwright
    src = os.path.join(WEB, 'assets/outline/outline.html')
    out = os.path.join(WEB, 'assets/outline/math10-3-course-outline.pdf')
    foot = ('<div style="width:100%;font:7.5pt Inter,sans-serif;color:#6a7182;padding:0 0.6in;display:flex;justify-content:space-between">'
            '<span>Mathematics 10-3 Course Outline</span><span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>')

    async def go():
        async with async_playwright() as p:
            b = await p.chromium.launch()
            pg = await b.new_page()
            errs = []
            pg.on('pageerror', lambda e: errs.append(str(e)))
            await pg.goto('file://' + src)
            await pg.wait_for_selector('body[data-ready="1"]')
            await pg.evaluate('document.fonts.ready')
            await pg.pdf(path=out, format='Letter', print_background=True, prefer_css_page_size=True, display_header_footer=True,
                         header_template='<div></div>', footer_template=foot,
                         margin={'top': '0.55in', 'bottom': '0.6in', 'left': '0.6in', 'right': '0.6in'})
            await b.close()
            if errs:
                sys.exit('outline page errors: %s' % errs)
    asyncio.run(go())
    run(['pdftoppm', '-r', '70', '-png', '-f', '1', '-l', '1', '-singlefile', out, out[:-4] + '-p1'])


# ---------------------------------------------------------------- 7. booklets
def booklets():
    B = os.path.join(PKG, 'booklets')
    os.makedirs(os.path.join(B, 'common'))
    for f in ['preamble.tex', 'make_masters.py']:
        shutil.copy2(os.path.join(BOOK, 'common', f), os.path.join(B, 'common', f))
    for n, title in UNITS.items():
        src, dst = os.path.join(BOOK, 'unit%d' % n), os.path.join(B, 'unit%d' % n)
        os.makedirs(dst)
        for f in sorted(os.listdir(src)):
            if re.match(r'u%d_(l\d\d|ep\d\d|book|lessons_only|solutions|extra|extra_solutions)\.tex$' % n, f):
                shutil.copy2(os.path.join(src, f), dst)
        pdfdir = os.path.join(B, 'PDFs', 'Unit %d - %s' % (n, title))
        os.makedirs(pdfdir)
        for key, name in [('book', 'Unit %d Booklet' % n), ('lessons_only', 'Unit %d Booklet - Lessons Only' % n),
                          ('solutions', 'Unit %d Booklet - Solutions' % n), ('extra', 'Unit %d Extra Practice' % n),
                          ('extra_solutions', 'Unit %d Extra Practice - Solutions' % n)]:
            shutil.copy2(os.path.join(src, 'u%d_%s.pdf' % (n, key)), os.path.join(pdfdir, name + '.pdf'))
    shutil.copy2(os.path.join(HERE, 'BOOKLETS.md'), os.path.join(B, 'README.md'))


# ---------------------------------------------------------------- 8. check and zip
def check():
    bad = []
    for dirpath, _, names in os.walk(PKG):
        for n in names:
            p = os.path.join(dirpath, n)
            if BANNED.search(n):
                bad.append(p + ' (file name)')
            if n.endswith(('.pdf', '.png', '.jpg', '.svg', '.woff2', '.woff', '.ttf', '.ico', '.zip')):
                if n.endswith('.pdf'):
                    t = subprocess.run(['pdftotext', p, '-'], capture_output=True, text=True).stdout
                    for m in BANNED.finditer(t):
                        bad.append('%s: %s' % (p, m.group(0)))
                continue
            try:
                s = open(p, encoding='utf-8').read()
            except UnicodeDecodeError:
                continue
            for m in BANNED.finditer(s):
                line = s[:m.start()].count('\n') + 1
                bad.append('%s:%d: %s' % (os.path.relpath(p, PKG), line, s[max(0, m.start() - 40):m.end() + 40].replace('\n', ' ')))
    if bad:
        print('\n'.join(bad[:60]))
        sys.exit('make_package: %d personal mentions left' % len(bad))
    print('check: no personal mentions')


def finish():
    shutil.copy2(os.path.join(HERE, 'INSTALL.md'), os.path.join(PKG, 'INSTALL.md'))
    shutil.copy2(os.path.join(HERE, 'README.md'), os.path.join(PKG, 'README.md'))
    shutil.copy2(os.path.join(HERE, 'WEBSITE_README.md'), os.path.join(WEB, 'README.md'))
    check()
    z = os.path.join(OUT, 'Math 10-3 Course Package.zip')
    with zipfile.ZipFile(z, 'w', zipfile.ZIP_DEFLATED) as zf:
        for dirpath, _, names in os.walk(PKG):
            for n in sorted(names):
                p = os.path.join(dirpath, n)
                zf.write(p, os.path.relpath(p, OUT))
    print('wrote', z, '%.1f MB' % (os.path.getsize(z) / 1e6))


if __name__ == '__main__':
    copy_site(); settings(); day_one(); outline(); scrub(); outline_pdf(); booklets(); finish()
