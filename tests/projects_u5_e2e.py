"""Unit 5 project (Mini-Golf Designer) end to end (Playwright): a student designs a hole through the page (dragging and
turning the protractor, aiming and putting the bank shot, copying the windmill blade, tiling the pentomino pad — with a
typical mistake in most checkpoints) and hands it in; the teacher opens the Projects tab, grades it and releases it; the
student's card and badges show it. Until the project is in index.html, teacher/index.html and js/catalog.js, this test adds
the script (served together with js/projects/u1.js) and the catalog line through Playwright routing (nothing on disk
changes). Screenshots (Chromebook 1280x800 and iPad 820x1180) go to $SHOTS (default /tmp/proj_u5_shots).
Needs: python3 -m http.server 8841 (repo root). Starts its own fresh mock ledger on 8850 (node backend/mock_server.js).
  SHAPE=fish python3 tests/projects_u5_e2e.py   (dogleg | fish | boom; default dogleg)"""
import asyncio, os, json, re, subprocess, time, urllib.request
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.environ.get('SHOTS', '/tmp/proj_u5_shots'); os.makedirs(OUT, exist_ok=True)
BASE = 'http://localhost:8841/'; PORT = 8850; MOCK = 'http://localhost:%d/' % PORT
CONFIG = "var HW_CONFIG = { siteName: 'Math 10-3 Practice', backend: '%s' };" % MOCK
SHAPE = os.environ.get('SHAPE', 'dogleg')
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
    """u1.js + u5.js in one response (fulfilling the HTML page itself would make Chromium treat it as a public page and
    block the loopback mock); once index.html has its own u5 script tag this just serves u1.js"""
    body = read('js/projects/u1.js')
    if 'projects/u5.js' not in read('index.html'): body += '\n;\n' + read('js/projects/u5.js')
    await route.fulfill(status=200, content_type='application/javascript', body=body)
async def catalog(route):
    body = read('js/catalog.js')
    if "project: { id: 'u5'" not in body:
        body = re.sub(r"(\{ unit: 5, title: '[^']*', outcomes: '[^']*',)", r"\1 project: { id: 'u5', title: 'Mini-Golf Designer' },", body, count=1)
    await route.fulfill(status=200, content_type='application/javascript', body=body)

async def setup(page):
    page.on('pageerror', lambda e: errs.append('pageerror: ' + str(e)))
    page.on('console', lambda m: errs.append('console: ' + m.text) if m.type == 'error' and 'jsdelivr' not in m.text and 'ERR_FAILED' not in m.text and 'fonts.g' not in m.text and 'teaching/js' not in m.text and '404' not in m.text else None)
    for pat in ['**/cdn.jsdelivr.net/**', '**/fonts.googleapis.com/**', '**/cdnjs.cloudflare.com/**', '**/script.google.com/**']: await page.route(pat, lambda r: r.abort())
    await page.route(BASE + 'js/config.js', lambda r: r.fulfill(status=200, content_type='application/javascript', body=CONFIG))
    await page.route(BASE + 'js/catalog.js*', catalog)
    await page.route(BASE + 'js/projects/u1.js*', add_project)

CTX = "const def = HW.PROJECTS.u5, P = HW.Projects.state('u5'), c = new HW.Projects.Ctx(def, P, { seed: P.seed }), G5 = HW.Projects.golf;"
SOLVE = """(i) => { const def = HW.PROJECTS.u5, P = HW.Projects.state('u5'), copy = JSON.parse(JSON.stringify(P));
  const c = new HW.Projects.Ctx(def, copy, { seed: copy.seed }); def.checkpoints[i].solve(c); return copy.v; }"""
CUR = "() => JSON.parse(JSON.stringify(HW.Projects.state('u5').v))"

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
async def to_screen(page, sel, x, y):
    """a point in an svg's own units → page coordinates"""
    return await page.evaluate("""([s, x, y]) => { const svg = document.querySelector(s), m = svg.getScreenCTM(), p = svg.createSVGPoint(); p.x = x; p.y = y; const q = p.matrixTransform(m); return [q.x, q.y]; }""", [sel, x, y])
async def drag(page, a, b):
    await page.mouse.move(a[0], a[1]); await page.mouse.down(); await page.mouse.move((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, steps=6); await page.mouse.move(b[0], b[1], steps=6); await page.mouse.up(); await page.wait_for_timeout(150)
async def prot_state(page, key_start):
    return await page.evaluate("(k) => { const P = HW.Projects.golf.PROT, key = Object.keys(P).filter(x => x.indexOf(k) === 0)[0]; return key ? P[key] : null; }", key_start)

async def main():
    fresh_mock()
    async with async_playwright() as p:
        b = await p.chromium.launch()
        ctx = await b.new_context(viewport={'width': 1280, 'height': 800}, service_workers='block')
        page = await ctx.new_page(); await setup(page)
        await page.goto(BASE + '?class=10c-b'); await page.wait_for_selector('.name-btn', timeout=10000)
        ok(await page.evaluate("() => !!(HW.PROJECTS && HW.PROJECTS.u5) && HW.CATALOG.filter(u => u.unit === 5)[0].project.id === 'u5'"), 'u5 project and catalog line injected')
        # a calendar where today is Unit 5, lesson 8 (lessons 1–7 taught)
        await page.evaluate("""() => { const C = HW.Cal; let n = C.sequence().indexOf('u5l8'), d = C.today(); while (n > 0) { d = C.addDays(d, -1); if (C.isWeekday(d)) n--; }
          return fetch('%s?action=setcal&key=testkey&class=10c-b&cal=' + encodeURIComponent(JSON.stringify(C.make(d)))); }""" % MOCK)
        await page.click('.name-btn:has-text("Ben Lee")')
        pins = page.locator('.field.pin'); await pins.nth(0).fill('4321'); await pins.nth(1).fill('4321')
        await page.click('.btn-primary'); await page.wait_for_selector('.unit-title'); await page.wait_for_timeout(1500)
        card = page.locator('a.pj-card[href="#/project/u5"]')
        ok(await card.count() == 1, 'Mini-Golf Designer card on the home page')
        if await card.count():
            ok('Due' in await card.inner_text(), 'card shows the due date')
            ok(await card.locator('.pj-card-svg svg').count() == 1, 'card shows the project’s own icon')
            await card.scroll_into_view_if_needed(); await page.wait_for_timeout(200)
        await shot(page, '01_home_card')

        # ---- checkpoint 1 ----
        await page.goto(BASE + '#/project/u5'); await page.wait_for_selector('.pj-wrap'); await page.wait_for_timeout(500)
        await shot(page, '02_cp1_top')
        fb = await check(page); ok('form' in fb, 'cp1 check with nothing picked asks for a theme: ' + fb[:70])
        await page.click('[data-f="theme"] .pj-opt[data-v="lake"]'); await page.wait_for_timeout(200)
        await page.click('.pj-idea >> nth=1'); await page.wait_for_timeout(150)
        await page.click('[data-f="shape"] .pj-opt[data-v="%s"]' % SHAPE); await page.wait_for_timeout(200)
        await page.click('[data-f="carpet"] .pj-opt >> nth=1'); await page.wait_for_timeout(200)
        fb = await check(page); ok('good' in fb, 'cp1 done: ' + fb[:60])
        await shot(page, '03_cp1_plan', '.pj-u5-plan', 'start')

        # ---- checkpoint 2: drag the protractor onto corner B and turn it onto an arm ----
        await next_cp(page); await page.wait_for_selector('.pj-u5-prot:not(.static)'); await page.wait_for_timeout(300)
        for _ in range(5): await page.click('.pj-ex-next'); await page.wait_for_timeout(150)
        await page.wait_for_timeout(700); await shot(page, '04_cp2_example', '.pj-ex')
        info = await page.evaluate("() => { " + CTX + " const G = G5.geo(c), H = G5.holeSvg(G, {}), B = G.corners[1]; return { bx: H.X(B.x), by: H.Y(B.y), dp: B.dp, dn: B.dn, A: B.A, L: B.L }; }")
        svgsel = '.pj-tool .pj-u5-draw svg'
        await page.evaluate("(s) => document.querySelector(s).scrollIntoView({block: 'center'})", svgsel); await page.wait_for_timeout(250)
        st = await prot_state(page, 'cp2|')
        grab = await to_screen(page, svgsel, st['x'], st['y'] - 60); dest = await to_screen(page, svgsel, info['bx'] + 3, info['by'] - 60 + 4)
        await drag(page, grab, dest)
        st = await prot_state(page, 'cp2|'); ok(abs(st['x'] - info['bx']) < 0.01 and abs(st['y'] - info['by']) < 0.01, 'dragging the protractor near corner B snaps its centre onto the vertex')
        import math
        # use whichever of the two turn handles (at the ends of the base line) is on the screen
        vw = page.viewport_size['width']; sgn = 1
        knob = await to_screen(page, svgsel, st['x'] + math.cos(math.radians(st['rot'])) * 178, st['y'] + math.sin(math.radians(st['rot'])) * 178)
        if not (330 < knob[0] < vw - 10 and 70 < knob[1] < 790):
            sgn = -1; knob = await to_screen(page, svgsel, st['x'] - math.cos(math.radians(st['rot'])) * 178, st['y'] - math.sin(math.radians(st['rot'])) * 178)
        aim = await to_screen(page, svgsel, info['bx'] + sgn * math.cos(math.radians(info['dp'] + 2)) * 178, info['by'] + sgn * math.sin(math.radians(info['dp'] + 2)) * 178)
        await drag(page, knob, aim)
        st = await prot_state(page, 'cp2|'); ok(abs(((st['rot'] - info['dp']) % 360 + 360) % 360) < 0.01, 'turning the handle near an arm snaps the 0 line onto it: rot %s vs arm %s' % (st['rot'], info['dp']))
        await shot(page, '05_cp2_protractor', '.pj-tool .pj-u5-draw', 'start')
        # wrong scale on corner B, the outside reading on the reflex corner
        await fill_all(page, 1)
        rf = await page.evaluate("() => { " + CTX + " const R = G5.geo(c).reflex; return [R.L, R.A]; }")
        await page.fill('[data-f="ang.%s"] input' % info['L'], str(180 - info['A']))
        await page.fill('[data-f="ang.%s"] input' % rf[0], str(360 - rf[1]))
        await page.fill('[data-f="rule"] input', str(await page.evaluate("() => { " + CTX + " return G5.geo(c).n * 180; }")))
        fb = await check(page); ok('hint' in fb and 'other scale' in fb and 'outside' in fb, 'cp2 wrong scale + reflex outside + n × 180 get their hints: ' + fb[:220].replace('\n', ' '))
        ih = await page.evaluate("() => { const w = document.querySelector('[data-f=\"rule\"]'), h = w && w.nextElementSibling; return h && h.classList.contains('pj-ihint') ? h.textContent : ''; }")
        ok('triangles' in ih, 'cp2 n × 180 gets the triangles hint under the box: ' + ih[:80])
        await shot(page, '06_cp2_hints', '.pj-checkbar', 'center')
        await fill_all(page, 1); fb = await check(page); ok('good' in fb, 'cp2 done: ' + fb[:60])
        await shot(page, '07_cp2_table', '.pj-u5-tbl', 'start')

        # ---- checkpoint 3: estimate, miss, then sink the bank shot ----
        await next_cp(page); await fill_all(page, 2, skip=('aim', 'sunk', 'in', 'pt.p', 'pt.q', 'pt.r', 'pt.s', 'off'))
        a = await page.evaluate("() => { " + CTX + " return G5.bank(c).a; }")
        fb = await check(page); ok('form' in fb and 'putt' in fb.lower(), 'cp3 asks for the putt first: ' + fb[:90])
        async def aim_to(target):
            for _ in range(40):
                cur = int((await page.evaluate(CUR)).get('aim') or 60)
                if cur == target: return
                d = target - cur; step = 5 if abs(d) >= 5 else 1
                await page.click('.pj-u5-aim[data-d="%d"]' % (step if d > 0 else -step))
        await aim_to(a + 6); await page.click('.pj-u5-putt'); await page.wait_for_selector('.pj-u5-status.miss', timeout=8000)
        ok('smaller' in await page.inner_text('.pj-u5-status'), 'a too-steep putt says to make the angle smaller: ' + (await page.inner_text('.pj-u5-status'))[:80])
        await shot(page, '08_cp3_miss', '.pj-u5-aimbox', 'start')
        await aim_to(a); await page.click('.pj-u5-putt'); await page.wait_for_selector('.pj-u5-status.good', timeout=8000)
        ok((await page.evaluate(CUR)).get('sunk') == str(a), 'sinking the putt is saved')
        await fill_all(page, 2, skip=('aim', 'sunk'))
        await page.fill('[data-f="pt.q"] input', str(180 - a))
        fb = await check(page); ok('hint' in fb and 'complementary' in fb, 'cp3 q as the supplement gets the complementary hint: ' + fb[:160].replace('\n', ' '))
        await fill_all(page, 2, skip=('aim', 'sunk')); fb = await check(page); ok('good' in fb, 'cp3 done: ' + fb[:60])
        await shot(page, '09_cp3_sunk', '.pj-u5-aimbox', 'start')
        await shot(page, '10_cp3_partners', '.pj-u5-zoomrow', 'center')

        # ---- checkpoint 4: a 2-digit bearing first ----
        await next_cp(page); await fill_all(page, 3)
        bb = await page.evaluate("() => { " + CTX + " return G5.mapGeo(c).b; }")
        if bb < 100: await page.fill('[data-f="brg"] input', str(bb)); want = '3 digits'
        else: await page.fill('[data-f="brg"] input', str(360 - bb)); want = 'clockwise'
        fb = await check(page); ok('hint' in fb and want in fb, 'cp4 bearing mistake gets the "%s" hint: ' % want + fb[:140].replace('\n', ' '))
        await fill_all(page, 3); fb = await check(page); ok('good' in fb, 'cp4 done: ' + fb[:60])
        await shot(page, '11_cp4_map', '.pj-tool .pj-u5-draw', 'start')

        # ---- checkpoint 5: a name mix-up and a same-side angle called equal ----
        await next_cp(page); await fill_all(page, 4)
        R = await page.evaluate("() => { " + CTX + " const R = G5.railGeo(c); return { g: R.g, m: R.ang(R.g), targets: R.targets, rels: R.targets.map(k => G5.rel(R.g, k)), pairs: R.pairs }; }")
        same = [k for k, r in zip(R['targets'], R['rels']) if r in ('sameI', 'sameE')][0]
        await page.fill('[data-f="fa.%d"] input' % same, str(R['m']))
        wrongname = 'vert' if R['pairs'][0]['cat'] != 'vert' else 'corr'
        await page.locator('[data-f="pair.1"] select').select_option(wrongname)
        fb = await check(page); ok('hint' in fb and '180' in fb, 'cp5 same-side angle called equal gets the 180° hint: ' + fb[:200].replace('\n', ' '))
        await shot(page, '12_cp5_hints', '.pj-u5-find', 'center')
        await fill_all(page, 4); fb = await check(page); ok('good' in fb, 'cp5 done: ' + fb[:60])
        await shot(page, '13_cp5_rails', '.pj-tool .pj-u5-draw', 'start')
        await shot(page, '14_cp5_crooked', '[data-f="par"]', 'end')

        # ---- checkpoint 6: a whole-corner mitre, copy the blade with the buttons ----
        await next_cp(page); await fill_all(page, 5, skip=('copy',))
        await page.fill('[data-f="mitre.tee"] input', '90')
        th = await page.evaluate("() => { " + CTX + " return G5.mill(c).th; }")
        for _ in range(40):
            cur = int((await page.evaluate(CUR)).get('copy') or 60)
            if cur == th: break
            d = th - cur; step = 5 if abs(d) >= 5 else 1
            await page.click('.pj-u5-cp[data-d="%d"]' % (step if d > 0 else -step))
        ok(int((await page.evaluate(CUR)).get('copy')) == th, 'blade 2 copied with the buttons')
        fb = await check(page); ok('hint' in fb and 'half' in fb, 'cp6 a 90° mitre gets the half hint: ' + fb[:140].replace('\n', ' '))
        await fill_all(page, 5, skip=('copy',)); fb = await check(page); ok('good' in fb, 'cp6 done: ' + fb[:60])
        await shot(page, '15_cp6_cuts', '.pj-u5-cuts', 'center')
        await shot(page, '16_cp6_mill', '.pj-u5-millbox', 'start')

        # ---- checkpoint 7: count the pieces, tile the pad through the page, hand it in ----
        await next_cp(page)
        pad = await page.evaluate("() => { " + CTX + " return G5.padOf(c); }")
        await page.fill('[data-f="pieces"] input', str(pad['rows'] * pad['cols']))
        moves = await page.evaluate("""() => { """ + CTX + """ const pad = G5.padOf(c), t = G5.tilePad(pad.rows, pad.cols, G5.seededOrder(c, 'e2e'));
          return t.map(pc => { let k = 0; for (; k < 8; k++) { const o = G5.orient(pc.p, k), n = pc.cells.map(q => q.slice()); const mr = Math.min(...n.map(q => q[0])), mc = Math.min(...n.map(q => q[1]));
            const key = a => a.map(q => q.join(',')).sort().join(';'); if (key(o) === key(n.map(q => [q[0] - mr, q[1] - mc]))) break; }
            const g = G5.grabCell(G5.orient(pc.p, k)), mr = Math.min(...pc.cells.map(q => q[0])), mc = Math.min(...pc.cells.map(q => q[1])); return { p: pc.p, k: k, r: mr + g[0], c: mc + g[1] }; }); }""")
        for mv in moves:
            await page.click('.pj-u5-pp[data-p="%s"]' % mv['p'])
            if mv['k'] >= 4: await page.click('.pj-u5-flip')
            for _ in range(mv['k'] % 4): await page.click('.pj-u5-turn')
            ok(int(await page.get_attribute('.pj-u5-selp', 'data-k')) == mv['k'], 'piece %s turned to orientation %d' % (mv['p'], mv['k']))
            await page.click('.pj-u5-board rect.pj-u5-cell[data-r="%d"][data-c="%d"]' % (mv['r'], mv['c']), force=True)
            await page.wait_for_timeout(120)
        ok('covered' in await page.inner_text('.pj-u5-tiler .pj-u5-status') and await page.locator('.pj-u5-tiler .pj-u5-status.good').count() == 1, 'the pad is covered through the page')
        await fill_all(page, 6, skip=('tile', 'pieces'))
        fb = await check(page); ok('hint' in fb and 'squares' in fb, 'cp7 squares instead of pieces gets the hint: ' + fb[:140].replace('\n', ' '))
        await shot(page, '17_cp7_tiler', '.pj-u5-tiler', 'start')
        await fill_all(page, 6, skip=('tile',))
        await shot(page, '18_cp7_card', '.pj-u5-cardwrap', 'start')
        ok(await page.locator('.pj-u5-card .pj-u5-cl.ang').count() >= 5 and 'Clubhouse' in await page.inner_text('.pj-u5-card'), 'the card shows every corner’s angle and the bearings')
        fb = await check(page); ok('good' in fb and 'Handed in' in fb, 'cp7 handed in')
        await page.wait_for_selector('.pj-sub-line.ok', timeout=15000); ok(True, 'the ledger confirms it has the project')
        rows = [r for r in stats()['sheets'].get('Projects', []) if len(r) > 3 and r[3] == 'u5']
        ok(len(rows) == 1 and rows[0][4] == 7 and rows[0][6], 'Projects sheet row: u5, done 7, handed in')
        await page.click('.pj-step >> nth=1'); await page.wait_for_selector('.pj-cph h1:has-text("Measure")'); ok(True, 'going back works')
        await page.goto(BASE + '#/project/u5/7'); await page.wait_for_selector('.pj-u5-card')
        await page.evaluate("() => { window.print = () => {}; }"); await page.click('.pj-printbtn'); await page.wait_for_timeout(900)
        ok(await page.evaluate("() => { const f = document.getElementById('pj-print'); return !!(f && f.contentDocument.querySelector('.pj-u5-card')); }"), 'print sheet has the design card')

        # ---- teacher ----
        tp = await ctx.new_page(); await setup(tp)
        await tp.add_init_script("localStorage.setItem('m103/hw:tkey', 'testkey'); localStorage.setItem('m103/hw:nodemo', '1')")
        await tp.goto(BASE + 'teacher/?class=10c-b&tab=projects'); await tp.wait_for_selector('.tpj-tbl', timeout=15000)
        await tp.click('.tpj-acts .seg button:has-text("Mini-Golf Designer")'); await tp.wait_for_selector('.tpj-tbl'); await tp.wait_for_timeout(300)
        ok('Mini-Golf Designer' in await tp.inner_text('.tpj-head') and 'Ben Lee' in await tp.inner_text('.tpj-tbl'), 'teacher sees Ben in the Mini-Golf Designer list')
        thd = await tp.inner_text('.tpj-tbl thead'); ok(all(o in thd for o in ['G1', 'G5', 'G6']), 'a column per outcome')
        await tp.screenshot(path=OUT + '/20_ledger_list.png')
        await tp.click('.tpj-tbl tr:has-text("Ben Lee") .btn'); await tp.wait_for_selector('.tpj-grade'); await tp.wait_for_timeout(500)
        await tp.screenshot(path=OUT + '/21_ledger_student.png')
        nok = await tp.locator('.tpj-review .pj-in.ok').count()
        ok(nok > 30, 'read-only review shows the answers marked right: %d' % nok)
        ok(await tp.locator('.tpj-review .was-wrong').count() >= 3, 'boxes wrong on the first check are flagged')
        ok(await tp.locator('.tpj-review .pj-u5-card').count() == 1 and await tp.locator('.tpj-review .pj-u5-prot:not(.static)').count() == 0, 'the design card is in the review (and no draggable protractor)')
        await tp.evaluate("() => document.querySelector('.tpj-review .pj-u5-card').scrollIntoView({block: 'center'})"); await tp.wait_for_timeout(200)
        await tp.screenshot(path=OUT + '/22_ledger_card.png')
        for k in range(await tp.locator('.tpj-sugline .btn').count()): await tp.locator('.tpj-sugline .btn').nth(k).click()
        await tp.fill('.tpj-cm', 'Great hole! Watch which protractor scale you read.')
        await tp.click('.tpj-gacts .btn-primary'); await tp.wait_for_timeout(1500)
        rows = [r for r in stats()['sheets'].get('Projects', []) if len(r) > 3 and r[3] == 'u5']
        ok(rows and rows[0][9] and rows[0][10], 'grade saved and released: ' + (str(rows[0][9])[:90] if rows else ''))

        # ---- student sees it ----
        await page.goto(BASE + '?class=10c-b#/'); await page.wait_for_selector('a.pj-card[href="#/project/u5"]'); await page.wait_for_timeout(2500)
        ok('Graded' in await page.inner_text('a.pj-card[href="#/project/u5"]'), 'card says graded')
        badges = await page.evaluate("() => [...document.querySelectorAll('.badge-btn')].map(b => b.getAttribute('aria-label') || b.title || b.textContent).join(' | ')")
        ok('G5' in badges and 'G6' in badges, 'G5 and G6 badges from the released project: ' + badges[:160])
        await shot(page, '19_home_graded', 'a.pj-card[href="#/project/u5"]', 'center')
        await page.goto(BASE + '#/project/u5/7'); await page.wait_for_selector('.pj-grade'); ok(True, 'feedback shown on the last checkpoint')

        # ---- iPad ----
        ip = await b.new_context(viewport={'width': 820, 'height': 1180}, device_scale_factor=2, has_touch=True, is_mobile=True, user_agent='Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1')
        ipage = await ip.new_page(); await setup(ipage)
        await ipage.goto(BASE + '?class=10c-b'); await ipage.wait_for_selector('.name-btn')
        await ipage.click('.name-btn:has-text("Ben Lee")'); await ipage.fill('.field.pin', '4321'); await ipage.click('.btn-primary'); await ipage.wait_for_selector('.unit-title'); await ipage.wait_for_timeout(2500)
        for n, sel, name in [(2, '.pj-tool .pj-u5-draw', '30_ipad_cp2'), (3, '.pj-u5-aimbox', '31_ipad_cp3'), (5, '.pj-u5-find', '32_ipad_cp5'), (7, '.pj-u5-tiler', '33_ipad_tiler'), (7, '.pj-u5-cardwrap', '34_ipad_card')]:
            await ipage.goto(BASE + '#/project/u5/%d' % n); await ipage.wait_for_selector('.pj-wrap'); await ipage.wait_for_timeout(700)
            await shot(ipage, name, sel, 'start')
        wide = await ipage.evaluate("() => document.documentElement.scrollWidth > window.innerWidth + 2")
        ok(not wide, 'no sideways scrolling on the iPad')
        await b.close()
    print('errors:', errs)
    print('FAILED: %d' % len(fails) if fails or errs else 'all ok')
asyncio.run(main())
