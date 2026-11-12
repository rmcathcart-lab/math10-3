"""Unit 7 project (Ramp It Up) end to end (Playwright): a student designs the accessible entrance through the page (with a
typical mistake in most checkpoints: a + b instead of the squares, no square root, the run divided by 12, a leg as the
hypotenuse, a RAD-mode angle, multiplying when the unknown is on the bottom, no eye height, a fine line called wrong) and
hands it in; the teacher opens the Projects tab, grades it and releases it; the student's card and badges show it. Until
the project is in index.html, teacher/index.html and js/catalog.js, this test adds the script (served together with
js/projects/u1.js) and the catalog line through Playwright routing (nothing on disk changes). Screenshots (Chromebook
1280x800 and iPad 820x1180) go to $SHOTS (default /tmp/proj_u7_shots).
Needs: python3 -m http.server 8841 (repo root). Starts its own fresh mock ledger on 8852 (node backend/mock_server.js).
  BLD=lib python3 tests/projects_u7_e2e.py   (curl | lib | hall; default curl)"""
import asyncio, os, json, re, subprocess, time, urllib.request
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.environ.get('SHOTS', '/tmp/proj_u7_shots'); os.makedirs(OUT, exist_ok=True)
BASE = 'http://localhost:8841/'; PORT = 8852; MOCK = 'http://localhost:%d/' % PORT
CONFIG = "var HW_CONFIG = { siteName: 'Math 10-3 Practice', backend: '%s' };" % MOCK
BLD = os.environ.get('BLD', 'curl')
def stats(): return json.loads(urllib.request.urlopen(MOCK + '__stats').read())
errs = []; fails = []
def ok(c, m):
    print(('  ok   ' if c else '  FAIL ') + m)
    if not c: fails.append(m)

def fresh_mock():
    subprocess.run("for p in $(pgrep -x node); do if tr '\\0' ' ' < /proc/$p/cmdline | grep -q 'mock_server.js %d'; then kill $p; fi; done" % PORT, shell=True)
    time.sleep(0.5)
    subprocess.Popen(['node', 'backend/mock_server.js', str(PORT), '30'], cwd=ROOT, stdout=open('/tmp/mock%d.log' % PORT, 'w'), stderr=subprocess.STDOUT, start_new_session=True)
    for _ in range(30):
        try: urllib.request.urlopen(MOCK + '__stats'); break
        except Exception: time.sleep(0.2)
    urllib.request.urlopen(MOCK + '?action=setroster&key=testkey&class=10c-b&label=Math%2010-3%20%C2%B7%20Block%20B&names=Ava%20Brown%0ABen%20Lee%0ARyan%20Cathcart&mode=add').read()

def read(p): return open(os.path.join(ROOT, p), encoding='utf-8').read()
async def add_project(route):
    """u1.js + u7.js in one response (fulfilling the HTML page itself would make Chromium treat it as a public page and
    block the loopback mock); once index.html has its own u7 script tag this just serves u1.js"""
    body = read('js/projects/u1.js')
    if 'projects/u7.js' not in read('index.html'): body += '\n;\n' + read('js/projects/u7.js')
    await route.fulfill(status=200, content_type='application/javascript', body=body)
async def catalog(route):
    body = read('js/catalog.js')
    if "project: { id: 'u7'" not in body:
        body = re.sub(r"(\{ unit: 7, title: '[^']*', outcomes: '[^']*',)", r"\1 project: { id: 'u7', title: 'Ramp It Up' },", body, count=1)
    await route.fulfill(status=200, content_type='application/javascript', body=body)

async def setup(page):
    page.on('pageerror', lambda e: errs.append('pageerror: ' + str(e)))
    page.on('console', lambda m: errs.append('console: ' + m.text) if m.type == 'error' and 'jsdelivr' not in m.text and 'ERR_FAILED' not in m.text and 'fonts.g' not in m.text and 'teaching/js' not in m.text and '404' not in m.text else None)
    for pat in ['**/cdn.jsdelivr.net/**', '**/fonts.googleapis.com/**', '**/cdnjs.cloudflare.com/**', '**/script.google.com/**']: await page.route(pat, lambda r: r.abort())
    await page.route(BASE + 'js/config.js', lambda r: r.fulfill(status=200, content_type='application/javascript', body=CONFIG))
    await page.route(BASE + 'js/catalog.js*', catalog)
    await page.route(BASE + 'js/projects/u1.js*', add_project)

CTX = "const def = HW.PROJECTS.u7, P = HW.Projects.state('u7'), c = new HW.Projects.Ctx(def, P, { seed: P.seed }), RP = HW.Projects.ramp, S = RP.site(c);"
SOLVE = """(i) => { const def = HW.PROJECTS.u7, P = HW.Projects.state('u7'), copy = JSON.parse(JSON.stringify(P));
  const c = new HW.Projects.Ctx(def, copy, { seed: copy.seed }); def.checkpoints[i].solve(c); return copy.v; }"""
CUR = "() => JSON.parse(JSON.stringify(HW.Projects.state('u7').v))"

async def fill_all(page, i, skip=()):
    """fill the checkpoint's right answers through the page, the way a student would"""
    for _ in range(120):
        want = await page.evaluate(SOLVE, i); have = await page.evaluate(CUR); changed = False
        for k, v in want.items():
            if k in skip or json.dumps(have.get(k)) == json.dumps(v): continue
            sel = '[data-f="%s"]' % k
            if await page.locator(sel).count() == 0: continue
            box = page.locator(sel).first; cls = await box.get_attribute('class') or ''
            if 'pj-choice' in cls: await page.locator(sel + ' .pj-opt[data-v="%s"]' % v).first.click()
            elif 'pj-sel' in cls: await box.locator('select').select_option(str(v))
            else: await box.locator('input, textarea').first.fill(str(v)); changed = True; continue
            changed = True; break   # the page may redraw: look again
        if not changed: return

async def check(page):
    await page.click('.pj-check'); await page.wait_for_timeout(350)
    return await page.evaluate("(document.querySelector('.pj-fb')||{}).className + ' | ' + ((document.querySelector('.pj-fb')||{}).innerText||'')")
async def shot(page, name, sel=None, block='start'):
    if sel: await page.evaluate("([s, b]) => { const e = document.querySelector(s); if (e) e.scrollIntoView({block: b}); }", [sel, block]); await page.wait_for_timeout(250)
    await page.screenshot(path=OUT + '/' + name + '.png')
async def next_cp(page):
    await page.click('.pj-foot .btn-primary'); await page.wait_for_timeout(500)
async def site(page, expr):
    return await page.evaluate("() => { " + CTX + " return " + expr + "; }")

async def main():
    fresh_mock()
    async with async_playwright() as p:
        b = await p.chromium.launch()
        ctx = await b.new_context(viewport={'width': 1280, 'height': 800}, service_workers='block')
        page = await ctx.new_page(); await setup(page)
        await page.goto(BASE + '?class=10c-b'); await page.wait_for_selector('.name-btn', timeout=10000)
        ok(await page.evaluate("() => !!(HW.PROJECTS && HW.PROJECTS.u7) && HW.CATALOG.filter(u => u.unit === 7)[0].project.id === 'u7'"), 'u7 project and catalog line injected')
        # a calendar where today is Unit 7, lesson 9 (lessons 1–8 taught)
        await page.evaluate("""() => { const C = HW.Cal; let n = C.sequence().indexOf('u7l9'), d = C.today(); while (n > 0) { d = C.addDays(d, -1); if (C.isWeekday(d)) n--; }
          return fetch('%s?action=setcal&key=testkey&class=10c-b&cal=' + encodeURIComponent(JSON.stringify(C.make(d)))); }""" % MOCK)
        await page.click('.name-btn:has-text("Ben Lee")')
        pins = page.locator('.field.pin'); await pins.nth(0).fill('4321'); await pins.nth(1).fill('4321')
        await page.click('.btn-primary'); await page.wait_for_selector('.unit-title'); await page.wait_for_timeout(1500)
        card = page.locator('a.pj-card[href="#/project/u7"]')
        ok(await card.count() == 1, 'Ramp It Up card on the home page')
        if await card.count():
            ok('Due' in await card.inner_text(), 'card shows the due date')
            ok(await card.locator('.pj-card-svg svg').count() == 1, 'card shows the project’s own icon')
            await card.scroll_into_view_if_needed(); await page.wait_for_timeout(200)
        await shot(page, '01_home_card')

        # ---- checkpoint 1 ----
        await page.goto(BASE + '#/project/u7'); await page.wait_for_selector('.pj-wrap'); await page.wait_for_timeout(500)
        await shot(page, '02_cp1_top')
        fb = await check(page); ok('form' in fb, 'cp1 check with nothing picked asks for a building: ' + fb[:70])
        await page.click('[data-f="bld"] .pj-opt[data-v="%s"]' % BLD); await page.wait_for_timeout(200)
        await page.click('.pj-idea >> nth=2'); await page.wait_for_timeout(150)
        fb = await check(page); ok('good' in fb, 'cp1 done: ' + fb[:60])
        ok('The Right Angles' in await page.inner_text('.pj-u7-plan-h'), 'the plan shows the crew name')
        await shot(page, '03_cp1_plan', '.pj-u7-plan', 'start')

        # ---- checkpoint 2: a + b instead of the squares; the slab diagonal without the square root ----
        await next_cp(page)
        for _ in range(4): await page.click('.pj-ex-next'); await page.wait_for_timeout(150)
        await page.wait_for_timeout(700); await shot(page, '04_cp2_example', '.pj-ex')
        await page.click('[data-f="k"] .pj-opt[data-v="0.4"]'); await page.wait_for_timeout(250)
        await fill_all(page, 1)
        await page.fill('[data-f="sumsq"] input', '2.8')
        W, D = await site(page, '[S.W, S.D]')
        await page.fill('[data-f="diag"] input', '%.2f' % (W * W + D * D))
        lbl = await page.inner_text('.pj-tool .pj-u7-draw')
        fb = await check(page); ok('hint' in fb and 'Square each leg' in fb and 'square root' in fb, 'cp2 a + b and no square root get their hints: ' + fb[:220].replace('\n', ' '))
        ih = await page.evaluate("() => { const w = document.querySelector('[data-f=\"diag\"]'), h = w && w.nextElementSibling; return h && h.classList.contains('pj-ihint') ? h.textContent : ''; }")
        ok('square root' in ih, 'the hint shows under the box: ' + ih[:80])
        await shot(page, '05_cp2_hints', '.pj-checkbar', 'center')
        await fill_all(page, 1); fb = await check(page); ok('good' in fb, 'cp2 done: ' + fb[:60])
        draw = await page.inner_text('.pj-tool .pj-u7-draw')
        ok('1.60 m' in draw and '2.00 m' in draw, 'the slab drawing shows the student’s own 3-4-5 numbers')
        await shot(page, '06_cp2_slab', '.pj-tool .pj-u7-draw', 'start')
        await shot(page, '07_cp2_test', '[data-f="sumsq"]', 'start')

        # ---- checkpoint 3: run ÷ 12; the run used as the ramp length ----
        await next_cp(page); await fill_all(page, 2)
        h = await site(page, 'S.h')
        await page.fill('[data-f="run"] input', '%.2f' % (h / 12))
        fb = await check(page); ok('hint' in fb and 'Multiply' in fb, 'cp3 run ÷ 12 gets the multiply hint: ' + fb[:140].replace('\n', ' '))
        await fill_all(page, 2)
        run = await site(page, 'S.run'); await page.fill('[data-f="len"] input', '%.2f' % run)
        fb = await check(page); ok('hint' in fb and 'leg' in fb, 'cp3 the run as the ramp length gets the leg hint: ' + fb[:140].replace('\n', ' '))
        await fill_all(page, 2); fb = await check(page); ok('good' in fb, 'cp3 done: ' + fb[:60])
        ok(('%.2f' % run) in await page.inner_text('.pj-tool .pj-u7-draw'), 'the ramp drawing shows the student’s run')
        await shot(page, '08_cp3_ramp', '.pj-tool .pj-u7-draw', 'start')
        await shot(page, '09_cp3_old', '[data-f="oldrun"]', 'end')

        # ---- checkpoint 4: a RAD-mode angle ----
        await next_cp(page); await fill_all(page, 3)
        await page.fill('[data-f="ang"] input', '0.08')
        fb = await check(page); ok('hint' in fb and 'RAD' in fb, 'cp4 a RAD-mode angle gets the RAD hint: ' + fb[:160].replace('\n', ' '))
        await shot(page, '10_cp4_rad', '.pj-checkbar', 'center')
        await fill_all(page, 3); fb = await check(page); ok('good' in fb, 'cp4 done: ' + fb[:60])
        ok('opp' in await page.inner_text('.pj-tool .pj-u7-draw'), 'the angle drawing shows the opp/adj/hyp labels')
        await shot(page, '11_cp4_angle', '.pj-tool .pj-u7-draw', 'start')

        # ---- checkpoint 5: multiplying when the unknown is on the bottom ----
        await next_cp(page); await fill_all(page, 4)
        R, t, th = await site(page, '[S.R, S.t, Math.round(S.sang)]')
        import math
        await page.fill('[data-f="need"] input', '%.2f' % ((R + t) * math.cos(math.radians(th))))
        fb = await check(page); ok('hint' in fb and 'divide' in fb, 'cp5 multiplying instead of dividing gets the divide hint: ' + fb[:160].replace('\n', ' '))
        await fill_all(page, 4); fb = await check(page); ok('good' in fb, 'cp5 done: ' + fb[:60])
        await shot(page, '12_cp5_stairs', '.pj-tool .pj-u7-draw', 'start')
        await shot(page, '13_cp5_rail', '[data-f="ratio.rise"]', 'start')

        # ---- checkpoint 6: no eye height ----
        await next_cp(page); await fill_all(page, 5)
        d, te = await site(page, '[S.d, S.te]')
        await page.fill('[data-f="pole"] input', '%.1f' % (d * math.tan(math.radians(te))))
        fb = await check(page); ok('hint' in fb and 'eye height' in fb, 'cp6 no eye height gets its hint: ' + fb[:160].replace('\n', ' '))
        await fill_all(page, 5); fb = await check(page); ok('good' in fb, 'cp6 done: ' + fb[:60])
        await shot(page, '14_cp6_pole', '.pj-tool .pj-u7-draw', 'start')
        await shot(page, '15_cp6_cam', '[data-f="dep"]', 'end')

        # ---- checkpoint 7: a fine line called wrong, then the card and hand-in ----
        await next_cp(page)
        right = await site(page, 'RP.SLIPS[S.slip].L'); other = [x for x in 'ABCD' if x != right][0]
        await fill_all(page, 6, skip=('slip',))
        await page.click('[data-f="slip"] .pj-opt[data-v="%s"]' % other)
        fb = await check(page); ok('hint' in fb and 'fine' in fb, 'cp7 a fine line called wrong gets a hint: ' + fb[:160].replace('\n', ' '))
        await shot(page, '16_cp7_slip', '.pj-u7-slip', 'start')
        await fill_all(page, 6)
        await shot(page, '17_cp7_card', '.pj-u7-cardwrap', 'start')
        ctext = (await page.inner_text('.pj-u7-card')).lower()
        ok('the right angles' in ctext and 'light pole' in ctext and '1 : 12' in ctext, 'the card shows the crew, the pole and the slope')
        fb = await check(page); ok('good' in fb and 'Handed in' in fb, 'cp7 handed in')
        await page.wait_for_selector('.pj-sub-line.ok', timeout=15000); ok(True, 'the ledger confirms it has the project')
        rows = [r for r in stats()['sheets'].get('Projects', []) if len(r) > 3 and r[3] == 'u7']
        ok(len(rows) == 1 and rows[0][4] == 7 and rows[0][6], 'Projects sheet row: u7, done 7, handed in')
        await page.click('.pj-step >> nth=1'); await page.wait_for_selector('.pj-cph h1:has-text("Square")'); ok(True, 'going back works')
        await page.goto(BASE + '#/project/u7/7'); await page.wait_for_selector('.pj-u7-card')
        await page.evaluate("() => { window.print = () => {}; }"); await page.click('.pj-printbtn'); await page.wait_for_timeout(900)
        ok(await page.evaluate("() => { const f = document.getElementById('pj-print'); return !!(f && f.contentDocument.querySelector('.pj-u7-card')); }"), 'print sheet has the build card')

        # ---- teacher ----
        tp = await ctx.new_page(); await setup(tp)
        await tp.add_init_script("localStorage.setItem('m103/hw:tkey', 'testkey'); localStorage.setItem('m103/hw:nodemo', '1')")
        await tp.goto(BASE + 'teacher/?class=10c-b&tab=projects'); await tp.wait_for_selector('.tpj-tbl', timeout=15000)
        await tp.click('.tpj-acts .seg button:has-text("Ramp It Up")'); await tp.wait_for_selector('.tpj-tbl'); await tp.wait_for_timeout(300)
        ok('Ramp It Up' in await tp.inner_text('.tpj-head') and 'Ben Lee' in await tp.inner_text('.tpj-tbl'), 'teacher sees Ben in the Ramp It Up list')
        thd = await tp.inner_text('.tpj-tbl thead'); ok(all(o in thd for o in ['G2', 'G4', 'A1']), 'a column per outcome')
        await tp.screenshot(path=OUT + '/20_ledger_list.png')
        await tp.click('.tpj-tbl tr:has-text("Ben Lee") .btn'); await tp.wait_for_selector('.tpj-grade'); await tp.wait_for_timeout(500)
        await tp.screenshot(path=OUT + '/21_ledger_student.png')
        nok = await tp.locator('.tpj-review .pj-in.ok').count()
        ok(nok >= 24, 'read-only review shows the answers marked right: %d' % nok)
        ok(await tp.locator('.tpj-review .was-wrong').count() >= 5, 'boxes wrong on the first check are flagged')
        ok(await tp.locator('.tpj-review .pj-u7-card').count() == 1, 'the build card is in the review')
        await tp.evaluate("() => document.querySelector('.tpj-review .pj-u7-card').scrollIntoView({block: 'center'})"); await tp.wait_for_timeout(200)
        await tp.screenshot(path=OUT + '/22_ledger_card.png')
        for k in range(await tp.locator('.tpj-sugline .btn').count()): await tp.locator('.tpj-sugline .btn').nth(k).click()
        await tp.fill('.tpj-cm', 'Great ramp! Remember DEG mode before you use tan⁻¹.')
        await tp.click('.tpj-gacts .btn-primary'); await tp.wait_for_timeout(1500)
        rows = [r for r in stats()['sheets'].get('Projects', []) if len(r) > 3 and r[3] == 'u7']
        ok(rows and rows[0][9] and rows[0][10], 'grade saved and released: ' + (str(rows[0][9])[:90] if rows else ''))

        # ---- student sees it ----
        await page.goto(BASE + '?class=10c-b#/'); await page.wait_for_selector('a.pj-card[href="#/project/u7"]'); await page.wait_for_timeout(2500)
        ok('Graded' in await page.inner_text('a.pj-card[href="#/project/u7"]'), 'card says graded')
        badges = await page.evaluate("() => [...document.querySelectorAll('.badge-btn')].map(b => b.getAttribute('aria-label') || b.title || b.textContent).join(' | ')")
        ok('G2' in badges and 'G4' in badges, 'G2 and G4 badges from the released project: ' + badges[:160])
        await shot(page, '19_home_graded', 'a.pj-card[href="#/project/u7"]', 'center')
        await page.goto(BASE + '#/project/u7/7'); await page.wait_for_selector('.pj-grade'); ok(True, 'feedback shown on the last checkpoint')

        # ---- iPad ----
        ip = await b.new_context(viewport={'width': 820, 'height': 1180}, device_scale_factor=2, has_touch=True, is_mobile=True, user_agent='Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1')
        ipage = await ip.new_page(); await setup(ipage)
        await ipage.goto(BASE + '?class=10c-b'); await ipage.wait_for_selector('.name-btn')
        await ipage.click('.name-btn:has-text("Ben Lee")'); await ipage.fill('.field.pin', '4321'); await ipage.click('.btn-primary'); await ipage.wait_for_selector('.unit-title'); await ipage.wait_for_timeout(2500)
        for n, sel, name in [(1, '.pj-u7-plan', '30_ipad_cp1'), (2, '.pj-tool .pj-u7-draw', '31_ipad_cp2'), (4, '.pj-tool .pj-u7-draw', '32_ipad_cp4'), (5, '.pj-tool .pj-u7-draw', '33_ipad_cp5'), (6, '.pj-tool .pj-u7-draw', '34_ipad_cp6'), (7, '.pj-u7-cardwrap', '35_ipad_card')]:
            await ipage.goto(BASE + '#/project/u7/%d' % n); await ipage.wait_for_selector('.pj-wrap'); await ipage.wait_for_timeout(700)
            await shot(ipage, name, sel, 'start')
        wide = await ipage.evaluate("() => document.documentElement.scrollWidth > window.innerWidth + 2")
        ok(not wide, 'no sideways scrolling on the iPad')
        await b.close()
    print('errors:', errs)
    print('FAILED: %d' % len(fails) if fails or errs else 'all ok')
asyncio.run(main())
