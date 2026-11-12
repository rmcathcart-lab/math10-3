"""Unit 6 project (Scale It) end to end (Playwright): a student takes a job through the page (checking the logo versions,
finding k, placing corners on the drawing grid, choosing a plan scale and dragging pieces onto the plan, measuring the
site — with a typical mistake in most checkpoints) and hands it in; the teacher opens the Projects tab, grades it and
releases it; the student's card and badges show it. Until the project is in index.html, teacher/index.html and
js/catalog.js, this test adds the script (served together with js/projects/u1.js) and the catalog line through
Playwright routing (nothing on disk changes). Screenshots (Chromebook 1280x800 and iPad 820x1180) go to $SHOTS
(default /tmp/proj_u6_shots).
Needs: python3 -m http.server 8841 (repo root). Starts its own fresh mock ledger on 8851 (node backend/mock_server.js).
  BUILD=skate python3 tests/projects_u6_e2e.py   (tiny | skate | truck; default tiny)"""
import asyncio, os, json, re, subprocess, time, urllib.request
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.environ.get('SHOTS', '/tmp/proj_u6_shots'); os.makedirs(OUT, exist_ok=True)
BASE = 'http://localhost:8841/'; PORT = 8851; MOCK = 'http://localhost:%d/' % PORT
CONFIG = "var HW_CONFIG = { siteName: 'Math 10-3 Practice', backend: '%s' };" % MOCK
BUILD = os.environ.get('BUILD', 'tiny')
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
    """u1.js + u6.js in one response (fulfilling the HTML page itself would make Chromium treat it as a public page and
    block the loopback mock); once index.html has its own u6 script tag this just serves u1.js"""
    body = read('js/projects/u1.js')
    if 'projects/u6.js' not in read('index.html'): body += '\n;\n' + read('js/projects/u6.js')
    await route.fulfill(status=200, content_type='application/javascript', body=body)
async def catalog(route):
    body = read('js/catalog.js')
    if "project: { id: 'u6'" not in body:
        body = re.sub(r"(\{ unit: 6, title: '[^']*', outcomes: '[^']*',)", r"\1 project: { id: 'u6', title: 'Scale It' },", body, count=1)
    await route.fulfill(status=200, content_type='application/javascript', body=body)

async def setup(page):
    page.on('pageerror', lambda e: errs.append('pageerror: ' + str(e)))
    page.on('console', lambda m: errs.append('console: ' + m.text) if m.type == 'error' and 'jsdelivr' not in m.text and 'ERR_FAILED' not in m.text and 'fonts.g' not in m.text and 'teaching/js' not in m.text and '404' not in m.text else None)
    for pat in ['**/cdn.jsdelivr.net/**', '**/fonts.googleapis.com/**', '**/cdnjs.cloudflare.com/**', '**/script.google.com/**']: await page.route(pat, lambda r: r.abort())
    await page.route(BASE + 'js/config.js', lambda r: r.fulfill(status=200, content_type='application/javascript', body=CONFIG))
    await page.route(BASE + 'js/catalog.js*', catalog)
    await page.route(BASE + 'js/projects/u1.js*', add_project)

CTX = "const def = HW.PROJECTS.u6, P = HW.Projects.state('u6'), c = new HW.Projects.Ctx(def, P, { seed: P.seed }), G6 = HW.Projects.scale;"
SOLVE = """(i) => { const def = HW.PROJECTS.u6, P = HW.Projects.state('u6'), copy = JSON.parse(JSON.stringify(P));
  const c = new HW.Projects.Ctx(def, copy, { seed: copy.seed }); def.checkpoints[i].solve(c); return copy.v; }"""
CUR = "() => JSON.parse(JSON.stringify(HW.Projects.state('u6').v))"

async def fill_all(page, i, skip=()):
    """fill the checkpoint's right answers through the page, the way a student would (the grid and the plan are done by hand)"""
    skip = tuple(skip) + ('draw', 'place')
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
async def to_screen(page, sel, x, y):
    return await page.evaluate("""([s, x, y]) => { const svg = document.querySelector(s), m = svg.getScreenCTM(), p = svg.createSVGPoint(); p.x = x; p.y = y; const q = p.matrixTransform(m); return [q.x, q.y]; }""", [sel, x, y])
async def drag(page, a, b):
    await page.mouse.move(a[0], a[1]); await page.mouse.down(); await page.mouse.move((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, steps=6); await page.mouse.move(b[0], b[1], steps=6); await page.mouse.up(); await page.wait_for_timeout(200)
async def tap_corners(page, pts):
    for p in pts:
        await page.click('.pj-u6-drawtool .pj-u6-hit[data-x="%d"][data-y="%d"]' % (p[0], p[1]), force=True); await page.wait_for_timeout(60)

async def main():
    fresh_mock()
    async with async_playwright() as p:
        b = await p.chromium.launch()
        ctx = await b.new_context(viewport={'width': 1280, 'height': 800}, service_workers='block')
        page = await ctx.new_page(); await setup(page)
        await page.goto(BASE + '?class=10c-b'); await page.wait_for_selector('.name-btn', timeout=10000)
        ok(await page.evaluate("() => !!(HW.PROJECTS && HW.PROJECTS.u6) && HW.CATALOG.filter(u => u.unit === 6)[0].project.id === 'u6'"), 'u6 project and catalog line injected')
        # a calendar where today is Unit 6, lesson 7 (lessons 1–6 taught)
        await page.evaluate("""() => { const C = HW.Cal; let n = C.sequence().indexOf('u6l7'), d = C.today(); while (n > 0) { d = C.addDays(d, -1); if (C.isWeekday(d)) n--; }
          return fetch('%s?action=setcal&key=testkey&class=10c-b&cal=' + encodeURIComponent(JSON.stringify(C.make(d)))); }""" % MOCK)
        await page.click('.name-btn:has-text("Ben Lee")')
        pins = page.locator('.field.pin'); await pins.nth(0).fill('4321'); await pins.nth(1).fill('4321')
        await page.click('.btn-primary'); await page.wait_for_selector('.unit-title'); await page.wait_for_timeout(1500)
        card = page.locator('a.pj-card[href="#/project/u6"]')
        ok(await card.count() == 1, 'Scale It card on the home page')
        if await card.count():
            ok('Due' in await card.inner_text(), 'card shows the due date')
            ok(await card.locator('.pj-card-svg svg').count() == 1, 'card shows the project’s own icon')
            await card.scroll_into_view_if_needed(); await page.wait_for_timeout(200)
        await shot(page, '01_home_card')

        # ---- checkpoint 1 ----
        await page.goto(BASE + '#/project/u6'); await page.wait_for_selector('.pj-wrap'); await page.wait_for_timeout(500)
        await shot(page, '02_cp1_top')
        fb = await check(page); ok('form' in fb, 'cp1 check with nothing picked asks for a build: ' + fb[:70])
        await page.click('[data-f="build"] .pj-opt[data-v="%s"]' % BUILD); await page.wait_for_timeout(200)
        await page.click('.pj-idea >> nth=1'); await page.wait_for_timeout(150)
        await page.click('[data-f="color"] .pj-opt >> nth=2'); await page.wait_for_timeout(200)
        fb = await check(page); ok('good' in fb, 'cp1 done: ' + fb[:60])
        await shot(page, '03_cp1_sheet', '.pj-u6-sheet', 'start')

        # ---- checkpoint 2: the logo ----
        await next_cp(page)
        for _ in range(5): await page.click('.pj-ex-next'); await page.wait_for_timeout(150)
        await page.wait_for_timeout(700); await shot(page, '04_cp2_example', '.pj-ex')
        info = await page.evaluate("() => { " + CTX + " const L = G6.logos(c), t = L.LG.types[0], S = L.vers[L.simL]; return { sim: L.simL, str: 'ABC'[L.order.indexOf('stretch')], t: t, up: (L.orig.by[t] / S.by[t]).toFixed(2) }; }")
        await fill_all(page, 1)
        await page.fill('[data-f="rat.%s.%s"] input' % (info['sim'], info['t']), info['up'])
        await page.click('[data-f="ver.%s"] .pj-opt[data-v="sim"]' % info['str'])
        fb = await check(page); ok('hint' in fb and 'upside down' in fb and 'every' in fb, 'cp2 ratio upside down + "similar" on the stretched one get their hints: ' + fb[:240].replace('\n', ' '))
        await shot(page, '05_cp2_hints', '.pj-u6-rt', 'start')
        await fill_all(page, 1); fb = await check(page); ok('good' in fb, 'cp2 done: ' + fb[:60])
        await shot(page, '06_cp2_logos', '.pj-u6-logos', 'start')

        # ---- checkpoint 3: the scale factor ----
        await next_cp(page); await fill_all(page, 2)
        J = await page.evaluate("() => { " + CTX + " const J = G6.job(c); return { L: J.L, mL: J.mL, k: J.k }; }")
        await page.fill('[data-f="k"] input', str(round(J['L'] * 100 / J['mL'], 3)))
        fb = await check(page); ok('hint' in fb and 'upside down' in fb, 'cp3 k upside down gets its hint: ' + fb[:160].replace('\n', ' '))
        await page.fill('[data-f="k"] input', '1/%d' % round(1 / J['k']))
        fb = await check(page); ok('good' in fb, 'cp3 done with k as a fraction: ' + fb[:60])
        await shot(page, '07_cp3', '.pj-u6-two', 'start')

        # ---- checkpoint 4: draw it on the grid ----
        await next_cp(page)
        await page.click('[data-f="dk"] .pj-opt[data-v="1.5"]'); await page.wait_for_selector('.pj-u6-drawtool')
        sh = await page.evaluate("() => { " + CTX + " const S = G6.shapeOf(c); return S.P; }")
        mnx = min(q[0] for q in sh); mny = min(q[1] for q in sh)
        right = [[2 + (q[0] - mnx) * 1.5, 1 + (q[1] - mny) * 1.5] for q in sh]
        wrong = [list(q) for q in right]; wrong[2] = [wrong[2][0] + 1, wrong[2][1]]
        await tap_corners(page, wrong)
        ok(await page.locator('.pj-u6-drawtool .pj-u6-status.good').count() == 1, 'all corners placed through the page')
        await fill_all(page, 3)
        fb = await check(page); ok('hint' in fb and 'Check side' in fb, 'cp4 a corner off names the side to fix: ' + fb[:200].replace('\n', ' '))
        await shot(page, '08_cp4_wrong', '.pj-u6-drawtool', 'start')
        for _ in range(len(right) - 2): await page.click('.pj-u6-undo')
        await tap_corners(page, right[2:])
        fb = await check(page); ok('good' in fb, 'cp4 done after Undo and placing the corners again: ' + fb[:60])
        await shot(page, '09_cp4_right', '.pj-u6-drawtool', 'start')

        # ---- checkpoint 5: the plan ----
        await next_cp(page)
        bad = await page.evaluate("() => { " + CTX + " const J = G6.job(c); return J.b.scales.filter(q => !G6.fits(J, q)).map(String); }")
        good = await page.evaluate("() => { " + CTX + " const J = G6.job(c); return J.b.scales.filter(q => G6.fits(J, q)).map(String); }")
        await page.click('[data-f="pscale"] .pj-opt[data-v="%s"]' % bad[-1]); await page.wait_for_timeout(200)
        fb = await check(page); ok('Fill in every box' in fb or 'form' in fb, 'cp5 with empty boxes asks to fill them: ' + fb[:60])
        await page.click('[data-f="pscale"] .pj-opt[data-v="%s"]' % good[0]); await page.wait_for_timeout(200)
        await fill_all(page, 4, skip=('pscale', 'pd', 'rd'))
        sN = await page.evaluate("() => { " + CTX + " return G6.scaleOf(c); }")
        await page.fill('[data-f="pN"] input', str(sN))
        ok(await page.locator('.pj-u6-piece').count() == 2, 'both pieces are cut out in the tray')
        # drag each piece onto the plan
        plan = await page.evaluate("() => { " + CTX + " const J = G6.job(c), s = G6.scaleOf(c); return G6.autoPlace(J, s, c); }")
        svgsel = '.pj-u6-plantool svg'
        await page.evaluate("(s) => document.querySelector(s).scrollIntoView({block: 'center'})", svgsel); await page.wait_for_timeout(250)
        for pid in ['a', 'b']:
            r = await page.evaluate("(id) => { const r = document.querySelector('.pj-u6-piece[data-id=\"' + id + '\"] rect'); return [+r.getAttribute('x') + +r.getAttribute('width') / 2, +r.getAttribute('y') + +r.getAttribute('height') / 2]; }", pid)
            a0 = await to_screen(page, svgsel, r[0], r[1]); b0 = await to_screen(page, svgsel, 22 + 30 + plan[pid][0] * 30, 22 + 30 + plan[pid][1] * 30)
            await drag(page, a0, b0)
        placed = (await page.evaluate(CUR)).get('place')
        ok(placed and json.loads(placed) == plan, 'dragging puts both pieces where they were dropped: %s vs %s' % (placed, plan))
        ok(await page.locator('.pj-u6-plantool .pj-u6-status.good').count() == 1, 'the plan says both pieces are on it')
        d = await page.evaluate("() => { " + CTX + " return G6.placeState(c, G6.job(c), G6.scaleOf(c)).d; }")
        await page.fill('[data-f="pd"] input', str(d)); await page.fill('[data-f="rd"] input', str(round(d * float(good[0]) * 100, 2)))
        fb = await check(page); ok('hint' in fb and 'same units' in fb and 'cm' in fb, 'cp5 ratio 1 : 0.4 and a real distance in cm get their hints: ' + fb[:220].replace('\n', ' '))
        await shot(page, '10_cp5_plan', '.pj-u6-plantool', 'start')
        await page.click('[data-f="pscale"] .pj-opt[data-v="%s"]' % bad[-1]); await page.wait_for_timeout(200)
        fb = await check(page); ok('doesn’t fit' in fb, 'cp5 a scale that doesn’t fit says so: ' + fb[:160].replace('\n', ' '))
        await page.click('[data-f="pscale"] .pj-opt[data-v="%s"]' % good[0]); await page.wait_for_timeout(200)
        await fill_all(page, 4); fb = await check(page); ok('good' in fb, 'cp5 done: ' + fb[:60])
        await shot(page, '11_cp5_done', '.pj-u6-pt', 'start')

        # ---- checkpoint 6: shadows and the mirror ----
        await next_cp(page)
        M = await page.evaluate("() => { " + CTX + " return G6.site(c).M; }")
        await fill_all(page, 5)
        await page.fill('[data-f="pole"] input', str(round(M['F'] * M['d2'] / M['d1'], 2)))
        fb = await check(page); ok('hint' in fb and 'eye height' in fb, 'cp6 full height in the mirror method gets the eye-height hint: ' + fb[:160].replace('\n', ' '))
        await shot(page, '12_cp6_shadow', '.pj-tool .pj-u6-scene', 'start')
        await fill_all(page, 5); fb = await check(page); ok('good' in fb, 'cp6 done: ' + fb[:60])
        await shot(page, '13_cp6_mirror', '[data-f="mWhy"]', 'end')

        # ---- checkpoint 7: the plan sheet, hand it in ----
        await next_cp(page)
        await fill_all(page, 6)
        await page.fill('[data-f="note"] input', 'Every size is the real size times k.')
        await shot(page, '14_cp7_card', '.pj-u6-cardwrap', 'start')
        ok(await page.locator('.pj-u6-card .pj-u6-floor').count() == 1 and 'mirror' in await page.inner_text('.pj-u6-card'), 'the sheet shows the plan and the heights')
        fb = await check(page); ok('good' in fb and 'Handed in' in fb, 'cp7 handed in')
        await page.wait_for_selector('.pj-sub-line.ok', timeout=15000); ok(True, 'the ledger confirms it has the project')
        rows = [r for r in stats()['sheets'].get('Projects', []) if len(r) > 3 and r[3] == 'u6']
        ok(len(rows) == 1 and rows[0][4] == 7 and rows[0][6], 'Projects sheet row: u6, done 7, handed in')
        await page.click('.pj-step >> nth=1'); await page.wait_for_selector('.pj-cph h1:has-text("logo")'); ok(True, 'going back works')
        await page.goto(BASE + '#/project/u6/7'); await page.wait_for_selector('.pj-u6-card')
        await page.evaluate("() => { window.print = () => {}; }"); await page.click('.pj-printbtn'); await page.wait_for_timeout(900)
        ok(await page.evaluate("() => { const f = document.getElementById('pj-print'); return !!(f && f.contentDocument.querySelector('.pj-u6-card')); }"), 'print sheet has the plan sheet')

        # ---- teacher ----
        tp = await ctx.new_page(); await setup(tp)
        await tp.add_init_script("localStorage.setItem('m103/hw:tkey', 'testkey'); localStorage.setItem('m103/hw:nodemo', '1')")
        await tp.goto(BASE + 'teacher/?class=10c-b&tab=projects'); await tp.wait_for_selector('.tpj-tbl', timeout=15000)
        await tp.click('.tpj-acts .seg button:has-text("Scale It")'); await tp.wait_for_selector('.tpj-tbl'); await tp.wait_for_timeout(300)
        ok('Scale It' in await tp.inner_text('.tpj-head') and 'Ben Lee' in await tp.inner_text('.tpj-tbl'), 'teacher sees Ben in the Scale It list')
        thd = await tp.inner_text('.tpj-tbl thead'); ok('G3' in thd, 'a G3 column')
        await tp.screenshot(path=OUT + '/20_ledger_list.png')
        await tp.click('.tpj-tbl tr:has-text("Ben Lee") .btn'); await tp.wait_for_selector('.tpj-grade'); await tp.wait_for_timeout(500)
        await tp.screenshot(path=OUT + '/21_ledger_student.png')
        nok = await tp.locator('.tpj-review .pj-in.ok').count()
        ok(nok >= 25, 'read-only review shows the answers marked right: %d' % nok)
        ok(await tp.locator('.tpj-review .was-wrong').count() >= 3, 'boxes wrong on the first check are flagged')
        ok(await tp.locator('.tpj-review .pj-u6-card').count() == 1 and await tp.locator('.tpj-review .pj-u6-hit').count() == 0 and await tp.locator('.tpj-review .pj-u6-undo').count() == 0, 'the plan sheet is in the review (and the grid can’t be tapped)')
        await tp.evaluate("() => document.querySelector('.tpj-review .pj-u6-drawtool').scrollIntoView({block: 'center'})"); await tp.wait_for_timeout(200)
        await tp.screenshot(path=OUT + '/22_ledger_draw.png')
        for k in range(await tp.locator('.tpj-sugline .btn').count()): await tp.locator('.tpj-sugline .btn').nth(k).click()
        await tp.fill('.tpj-cm', 'Great model! Remember: k = new ÷ original.')
        await tp.click('.tpj-gacts .btn-primary'); await tp.wait_for_timeout(1500)
        rows = [r for r in stats()['sheets'].get('Projects', []) if len(r) > 3 and r[3] == 'u6']
        ok(rows and rows[0][9] and rows[0][10], 'grade saved and released: ' + (str(rows[0][9])[:90] if rows else ''))

        # ---- student sees it ----
        await page.goto(BASE + '?class=10c-b#/'); await page.wait_for_selector('a.pj-card[href="#/project/u6"]'); await page.wait_for_timeout(2500)
        ok('Graded' in await page.inner_text('a.pj-card[href="#/project/u6"]'), 'card says graded')
        badges = await page.evaluate("() => [...document.querySelectorAll('.badge-btn')].map(b => b.getAttribute('aria-label') || b.title || b.textContent).join(' | ')")
        ok('G3' in badges, 'G3 badge from the released project: ' + badges[:160])
        await shot(page, '19_home_graded', 'a.pj-card[href="#/project/u6"]', 'center')
        await page.goto(BASE + '#/project/u6/7'); await page.wait_for_selector('.pj-grade'); ok(True, 'feedback shown on the last checkpoint')

        # ---- iPad ----
        ip = await b.new_context(viewport={'width': 820, 'height': 1180}, device_scale_factor=2, has_touch=True, is_mobile=True, user_agent='Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1')
        ipage = await ip.new_page(); await setup(ipage)
        await ipage.goto(BASE + '?class=10c-b'); await ipage.wait_for_selector('.name-btn')
        await ipage.click('.name-btn:has-text("Ben Lee")'); await ipage.fill('.field.pin', '4321'); await ipage.click('.btn-primary'); await ipage.wait_for_selector('.unit-title'); await ipage.wait_for_timeout(2500)
        for n, sel, name in [(1, '.pj-u6-sheet', '30_ipad_cp1'), (2, '.pj-u6-logos', '31_ipad_logos'), (2, '.pj-u6-rt', '32_ipad_ratios'), (4, '.pj-u6-drawtool', '33_ipad_grid'), (5, '.pj-u6-plantool', '34_ipad_plan'), (6, '.pj-tool .pj-u6-scene', '35_ipad_site'), (7, '.pj-u6-cardwrap', '36_ipad_card')]:
            await ipage.goto(BASE + '#/project/u6/%d' % n); await ipage.wait_for_selector('.pj-wrap'); await ipage.wait_for_timeout(700)
            await shot(ipage, name, sel, 'start')
        wide = await ipage.evaluate("() => document.documentElement.scrollWidth > window.innerWidth + 2")
        ok(not wide, 'no sideways scrolling on the iPad')
        await b.close()
    print('errors:', errs)
    print('FAILED: %d' % len(fails) if fails or errs else 'all ok')
asyncio.run(main())
