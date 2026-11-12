"""Unit 3 project (Reno Crew) end to end (Playwright): a student does the whole project through the page (with a few
mistakes on the way) and hands it in; the teacher opens the Projects tab, grades it and releases it; the student's
card and badges show it. Until the project is in index.html, teacher/index.html and js/catalog.js, this test adds the
script (served together with js/projects/u1.js) and the catalog line through Playwright routing (nothing on disk changes).
Screenshots (Chromebook 1280x800 and iPad 820x1180) go to $SHOTS (default /tmp/proj_u3_shots).
Needs: python3 -m http.server 8841 (repo root). Starts its own fresh mock ledger on 8848 (node backend/mock_server.js)."""
import asyncio, os, json, re, subprocess, time, urllib.request
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.environ.get('SHOTS', '/tmp/proj_u3_shots'); os.makedirs(OUT, exist_ok=True)
BASE = 'http://localhost:8841/'; PORT = 8848; MOCK = 'http://localhost:%d/' % PORT
CONFIG = "var HW_CONFIG = { siteName: 'Math 10-3 Practice', backend: '%s' };" % MOCK
ROOM = os.environ.get('ROOM', 'suite')
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
    """u1.js + u3.js in one response (fulfilling the HTML page itself would make Chromium treat it as a public page and
    block the loopback mock); once index.html has its own u3 script tag this just serves u1.js"""
    body = read('js/projects/u1.js')
    if 'projects/u3.js' not in read('index.html'): body += '\n;\n' + read('js/projects/u3.js')
    await route.fulfill(status=200, content_type='application/javascript', body=body)
async def catalog(route):
    body = read('js/catalog.js')
    if "project: { id: 'u3'" not in body:
        body = re.sub(r"(\{ unit: 3, title: '[^']*', outcomes: '[^']*',)", r"\1 project: { id: 'u3', title: 'Reno Crew' },", body, count=1)
    await route.fulfill(status=200, content_type='application/javascript', body=body)

async def setup(page):
    page.on('pageerror', lambda e: errs.append('pageerror: ' + str(e)))
    page.on('console', lambda m: errs.append('console: ' + m.text) if m.type == 'error' and 'jsdelivr' not in m.text and 'ERR_FAILED' not in m.text and 'fonts.g' not in m.text and 'teaching/js' not in m.text and '404' not in m.text else None)
    for pat in ['**/cdn.jsdelivr.net/**', '**/fonts.googleapis.com/**', '**/cdnjs.cloudflare.com/**', '**/script.google.com/**']: await page.route(pat, lambda r: r.abort())
    await page.route(BASE + 'js/config.js', lambda r: r.fulfill(status=200, content_type='application/javascript', body=CONFIG))
    await page.route(BASE + 'js/catalog.js*', catalog)
    await page.route(BASE + 'js/projects/u1.js*', add_project)

SOLVE = """(i) => { const def = HW.PROJECTS.u3, P = HW.Projects.state('u3'), copy = JSON.parse(JSON.stringify(P));
  const c = new HW.Projects.Ctx(def, copy, { seed: copy.seed }); def.checkpoints[i].solve(c); return copy.v; }"""
CUR = "() => JSON.parse(JSON.stringify(HW.Projects.state('u3').v))"

async def fill_all(page, i, skip=()):
    """fill the checkpoint's right answers through the page, the way a student would"""
    for _ in range(90):
        want = await page.evaluate(SOLVE, i); have = await page.evaluate(CUR); changed = False
        for k, v in want.items():
            if k in skip or json.dumps(have.get(k)) == json.dumps(v): continue
            sel = '[data-f="%s"]' % k
            if await page.locator(sel).count() == 0: continue
            box = page.locator(sel).first; cls = await box.get_attribute('class') or ''
            if 'pj-choice' in cls: await page.locator(sel + ' .pj-opt[data-v="%s"]' % v).first.click()
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

async def main():
    fresh_mock()
    async with async_playwright() as p:
        b = await p.chromium.launch()
        ctx = await b.new_context(viewport={'width': 1280, 'height': 800}, service_workers='block')
        page = await ctx.new_page(); await setup(page)
        await page.goto(BASE + '?class=10c-b'); await page.wait_for_selector('.name-btn', timeout=10000)
        ok(await page.evaluate("() => !!(HW.PROJECTS && HW.PROJECTS.u3) && HW.CATALOG.filter(u => u.unit === 3)[0].project.id === 'u3'"), 'u3 project and catalog line injected')
        # a calendar where today is Unit 3, lesson 8 (lessons 1–7 taught; 8, 9, 10 today or coming up)
        await page.evaluate("""() => { const C = HW.Cal; let n = C.sequence().indexOf('u3l8'), d = C.today(); while (n > 0) { d = C.addDays(d, -1); if (C.isWeekday(d)) n--; }
          return fetch('%s?action=setcal&key=testkey&class=10c-b&cal=' + encodeURIComponent(JSON.stringify(C.make(d)))); }""" % MOCK)
        await page.click('.name-btn:has-text("Ben Lee")')
        pins = page.locator('.field.pin'); await pins.nth(0).fill('4321'); await pins.nth(1).fill('4321')
        await page.click('.btn-primary'); await page.wait_for_selector('.unit-title'); await page.wait_for_timeout(1500)
        card = page.locator('a.pj-card[href="#/project/u3"]')
        ok(await card.count() == 1, 'Reno Crew card on the home page')
        if await card.count():
            ok('Due' in await card.inner_text(), 'card shows the due date')
            await card.scroll_into_view_if_needed(); await page.wait_for_timeout(200)
        await shot(page, '01_home_card')

        await page.goto(BASE + '#/project/u3'); await page.wait_for_selector('.pj-wrap'); await page.wait_for_timeout(500)
        await shot(page, '02_cp1_top')
        fb = await check(page); ok('form' in fb, 'cp1 check with nothing picked asks for a room: ' + fb[:70])
        await page.click('.pj-idea >> nth=1'); await page.wait_for_timeout(150)
        await page.click('[data-f="crewColor"] .pj-opt[data-v="#0f766e"]')
        await page.click('.pj-u3-rooms .pj-opt[data-v="%s"]' % ROOM); await page.wait_for_timeout(300)
        ok(await page.locator('.pj-tool .pj-u3-tape').count() == 1 and await page.locator('.pj-tool .pj-u3-job .pj-u3-svg').count() == 1, 'tape and plan on the page')
        for _ in range(5): await page.click('.pj-ex-next'); await page.wait_for_timeout(200)
        await page.wait_for_timeout(800)
        await shot(page, '03_cp1_example', '.pj-ex')
        await fill_all(page, 0)
        # an unsimplified fraction first (if the reading simplifies), then a reading one tick off
        T = await page.evaluate("() => { const c = new HW.Projects.Ctx(HW.PROJECTS.u3, HW.Projects.state('u3'), { seed: HW.Projects.state('u3').seed }); return HW.Projects.reno.geo(c).tape; }")
        await page.fill('[data-f="tape.n"] input', str(T['k'] + 1)); await page.fill('[data-f="tape.d"] input', '16')
        fb = await check(page); ok('hint' in fb and ('tick' in fb or 'Count' in fb), 'cp1 one tick off gets the tick hint: ' + fb[:120])
        await shot(page, '04_cp1_hint', '.pj-u3-tapebox')
        if T['k'] % 2 == 0:
            await page.fill('[data-f="tape.n"] input', str(T['k']))
            fb = await check(page); ok('lowest terms' in fb, 'cp1 unsimplified fraction gets a nudge: ' + fb[:100])
        await fill_all(page, 0)
        fb = await check(page); ok('good' in fb, 'cp1 done: ' + fb[:60])
        await shot(page, '05_cp1_done', '.pj-u3-tapebox')
        # checkpoint 2: boards rounded down first
        await next_cp(page); await fill_all(page, 1)
        e2 = await page.evaluate("() => { const c = new HW.Projects.Ctx(HW.PROJECTS.u3, HW.Projects.state('u3'), { seed: HW.Projects.state('u3').seed }); const e = HW.Projects.reno.e2(c); return [e.need1, e.len]; }")
        import math
        if math.floor(e2[0] / e2[1]) != math.ceil(e2[0] / e2[1]):
            await page.fill('[data-f="boards"] input', str(math.floor(e2[0] / e2[1])))
            fb = await check(page); ok('Round up' in fb.replace('\n', ' ') or 'round up' in fb.lower(), 'cp2 rounded-down boards get the round-up hint: ' + fb[:120])
            await shot(page, '06_cp2_hint', '.pj-u3-job', 'center')
            await fill_all(page, 1)
        fb = await check(page); ok('good' in fb, 'cp2 done: ' + fb[:60])
        await shot(page, '07_cp2_plan', '.pj-u3-job', 'start')
        # checkpoint 3: a formula mix-up first
        await next_cp(page); await fill_all(page, 2, skip=('f2',))
        await page.click('[data-f="f2"] .pj-opt[data-v="a"]')
        fb = await check(page); ok('hint' in fb and 'Divide by 2' in fb, 'cp3 forgot ÷ 2 gets the hint: ' + fb[:120])
        await fill_all(page, 2); fb = await check(page); ok('good' in fb, 'cp3 done: ' + fb[:60])
        await shot(page, '08_cp3_smudged', '.pj-tool')
        # checkpoint 4: no waste first
        await next_cp(page); await fill_all(page, 3)
        area = await page.evaluate("() => HW.Projects.state('u3').v.area")
        await page.fill('[data-f="buy"] input', area)
        fb = await check(page); ok('hint' in fb and '10%' in fb, 'cp4 no waste gets the hint: ' + fb[:120])
        await fill_all(page, 3); fb = await check(page); ok('good' in fb, 'cp4 done: ' + fb[:60])
        await shot(page, '09_cp4_floor', '.pj-u3-job', 'start')
        await shot(page, '10_cp4_boxes', '[data-f="buy"]', 'center')
        # checkpoints 5, 6
        await next_cp(page); await fill_all(page, 4); fb = await check(page); ok('good' in fb, 'cp5 done: ' + fb[:60])
        await shot(page, '11_cp5_paint', '.pj-u3-job', 'start')
        await next_cp(page); await fill_all(page, 5)
        await shot(page, '12_cp6_feature', '.pj-u3-feats', 'start')
        fb = await check(page); ok('good' in fb, 'cp6 done: ' + fb[:60])
        # checkpoint 7: wrong GST, then hand in
        await next_cp(page); await fill_all(page, 6, skip=('gst', 'total'))
        sub = float(await page.evaluate("() => HW.Projects.state('u3').v.sub"))
        await page.fill('[data-f="gst"] input', '%.2f' % (sub * 1.05)); await page.fill('[data-f="total"] input', '1')
        fb = await check(page); ok('hint' in fb and 'total' in fb, 'cp7 GST as the total gets the hint: ' + fb[:120])
        await fill_all(page, 6)
        q = await page.inner_text('.pj-u3-quote'); ok('GST' in q and 'Total' in q and await page.locator('.pj-u3-q-tbl tbody tr').count() == 6, 'the quote lists 6 materials, GST and the total')
        await shot(page, '13_cp7_quote', '.pj-u3-qwrap', 'start')
        fb = await check(page); ok('good' in fb and 'Handed in' in fb, 'cp7 handed in')
        await page.wait_for_selector('.pj-sub-line.ok', timeout=15000); ok(True, 'the ledger confirms it has the project')
        await shot(page, '14_submitted', '.pj-checkbar', 'center')
        rows = [r for r in stats()['sheets'].get('Projects', []) if len(r) > 3 and r[3] == 'u3']
        ok(len(rows) == 1 and rows[0][4] == 7 and rows[0][6], 'Projects sheet row: u3, done 7, handed in')
        await page.click('.pj-step >> nth=1'); await page.wait_for_selector('.pj-cph h1:has-text("Baseboard")'); ok(True, 'going back works')
        # the print sheet builds (iframe) without errors
        await page.goto(BASE + '#/project/u3/7'); await page.wait_for_selector('.pj-u3-quote')
        await page.evaluate("() => { window.print = () => {}; }"); await page.click('.pj-printbtn'); await page.wait_for_timeout(900)
        ok(await page.evaluate("() => { const f = document.getElementById('pj-print'); return !!(f && f.contentDocument.querySelector('.pj-u3-quote')); }"), 'print sheet has the quote')

        # ---- teacher ----
        tp = await ctx.new_page(); await setup(tp)
        await tp.add_init_script("localStorage.setItem('m103/hw:tkey', 'testkey'); localStorage.setItem('m103/hw:nodemo', '1')")
        await tp.goto(BASE + 'teacher/?class=10c-b&tab=projects'); await tp.wait_for_selector('.tpj-tbl', timeout=15000)
        await tp.click('.tpj-acts .seg button:has-text("Reno Crew")'); await tp.wait_for_selector('.tpj-tbl'); await tp.wait_for_timeout(300)
        ok('Reno Crew' in await tp.inner_text('.tpj-head') and 'Ben Lee' in await tp.inner_text('.tpj-tbl'), 'teacher sees Ben in the Reno Crew list')
        th = await tp.inner_text('.tpj-tbl thead'); ok(all(o in th for o in ['M1', 'M2', 'M3', 'M4', 'A1']), 'a column per outcome')
        await tp.screenshot(path=OUT + '/20_ledger_list.png')
        await tp.click('.tpj-tbl tr:has-text("Ben Lee") .btn'); await tp.wait_for_selector('.tpj-grade'); await tp.wait_for_timeout(400)
        await tp.screenshot(path=OUT + '/21_ledger_student.png')
        ok(await tp.locator('.tpj-review .pj-in.ok').count() > 40, 'read-only review shows the answers marked right: %d' % await tp.locator('.tpj-review .pj-in.ok').count())
        ok(await tp.locator('.tpj-review .was-wrong').count() >= 3, 'boxes wrong on the first check are flagged')
        ok(await tp.locator('.tpj-review .pj-u3-quote').count() == 1 and await tp.locator('.tpj-review .pj-u3-svg').count() >= 4, 'the plans and the quote are in the review')
        await tp.evaluate("() => document.querySelector('.tpj-review .pj-u3-quote').scrollIntoView({block: 'center'})"); await tp.wait_for_timeout(200)
        await tp.screenshot(path=OUT + '/22_ledger_quote.png')
        for k in range(await tp.locator('.tpj-sugline .btn').count()): await tp.locator('.tpj-sugline .btn').nth(k).click()
        await tp.fill('.tpj-cm', 'Great quote! Check how you round boards next time.')
        await tp.click('.tpj-gacts .btn-primary'); await tp.wait_for_timeout(1500)
        rows = [r for r in stats()['sheets'].get('Projects', []) if len(r) > 3 and r[3] == 'u3']
        ok(rows and rows[0][9] and rows[0][10], 'grade saved and released: ' + (str(rows[0][9])[:90] if rows else ''))

        # ---- student sees it ----
        await page.goto(BASE + '?class=10c-b#/'); await page.wait_for_selector('a.pj-card[href="#/project/u3"]'); await page.wait_for_timeout(2500)  # a fresh load asks the ledger for released grades
        ok('Graded' in await page.inner_text('a.pj-card[href="#/project/u3"]'), 'card says graded')
        badges = await page.evaluate("() => [...document.querySelectorAll('.badge-btn')].map(b => b.getAttribute('aria-label') || b.title || b.textContent).join(' | ')")
        ok('M4' in badges and 'A1' in badges, 'M4 and A1 badges from the released project: ' + badges[:160])
        await shot(page, '15_home_graded', 'a.pj-card[href="#/project/u3"]', 'center')
        await page.goto(BASE + '#/project/u3/7'); await page.wait_for_selector('.pj-grade'); ok(True, 'feedback shown on the last checkpoint')

        # ---- iPad ----
        ip = await b.new_context(viewport={'width': 820, 'height': 1180}, device_scale_factor=2, has_touch=True, is_mobile=True, user_agent='Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1')
        ipage = await ip.new_page(); await setup(ipage)
        await ipage.goto(BASE + '?class=10c-b'); await ipage.wait_for_selector('.name-btn')
        await ipage.click('.name-btn:has-text("Ben Lee")'); await ipage.fill('.field.pin', '4321'); await ipage.click('.btn-primary'); await ipage.wait_for_selector('.unit-title'); await ipage.wait_for_timeout(2500)
        for n, sel, name in [(1, '.pj-u3-tapebox', '30_ipad_cp1_tape'), (2, '.pj-u3-job', '31_ipad_cp2'), (4, '.pj-u3-job', '32_ipad_cp4'), (7, '.pj-u3-qwrap', '33_ipad_quote')]:
            await ipage.goto(BASE + '#/project/u3/%d' % n); await ipage.wait_for_selector('.pj-wrap'); await ipage.wait_for_timeout(700)
            await shot(ipage, name, sel, 'start')
        wide = await ipage.evaluate("() => document.documentElement.scrollWidth > window.innerWidth + 2")
        ok(not wide, 'no sideways scrolling on the iPad')
        await b.close()
    print('errors:', errs)
    print('FAILED: %d' % len(fails) if fails or errs else 'all ok')
asyncio.run(main())
