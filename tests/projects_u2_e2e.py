"""Unit 2 project end to end (Playwright): a student does the whole Pick Your Job project through the page (with a few
mistakes on the way) and hands it in; the teacher opens the Projects tab, grades it and releases it; the student's
card and badges show it. Screenshots (Chromebook 1280x800 and iPad) go to $SHOTS (default /tmp/proj_u2_shots).
The project isn't wired into the site yet, so this run injects it through Playwright routing: js/projects/u2.js is
served right after js/projects/u1.js (like its own <script> tag would be), and js/catalog.js gets
project: { id: 'u2', title: 'Pick Your Job' } on Unit 2.
Needs: python3 -m http.server 8841 (repo root) and a fresh mock on 8847:
  node backend/mock_server.js 8847 30  (then setroster for 10c-b with Ben Lee, as tests/restart_mock.sh does)."""
import asyncio, os, json, re, urllib.request
from playwright.async_api import async_playwright
OUT = os.environ.get('SHOTS', '/tmp/proj_u2_shots'); os.makedirs(OUT, exist_ok=True)
BASE = 'http://localhost:8841/'; MOCK = 'http://localhost:8847/'
CONFIG = "var HW_CONFIG = { siteName: 'Math 10-3 Practice', backend: '%s' };" % MOCK
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
def stats(): return json.loads(urllib.request.urlopen(MOCK + '__stats').read())
errs = []; fails = []
def ok(c, m):
    print(('  ok   ' if c else '  FAIL ') + m)
    if not c: fails.append(m)

def read(p): return open(os.path.join(ROOT, p), encoding='utf-8').read()
def with_u2():
    """js/projects/u1.js followed by js/projects/u2.js: the same as a <script src="js/projects/u2.js"> right after u1's
    tag (index.html and teacher/index.html both load ../js/projects/u1.js from the same URL). The HTML pages themselves
    aren't rewritten: Chrome treats a fulfilled page as non-local and would block its calls to the local mock."""
    return read('js/projects/u1.js') + '\n;\n' + read('js/projects/u2.js')
def patched_catalog():
    s = read('js/catalog.js')
    s2 = re.sub(r"(\{ unit: 2, title: 'Earning an Income', outcomes: '[^']*',)", r"\1 project: { id: 'u2', title: 'Pick Your Job' },", s, count=1)
    assert s2 != s
    return s2

async def setup(page):
    page.on('pageerror', lambda e: errs.append('pageerror: ' + str(e)))
    page.on('console', lambda m: errs.append('console: ' + m.text) if m.type == 'error' and 'jsdelivr' not in m.text and 'ERR_FAILED' not in m.text and 'fonts.g' not in m.text and 'teaching/js' not in m.text and '404' not in m.text else None)
    await page.route('**/cdn.jsdelivr.net/**', lambda r: r.abort())
    await page.route('**/fonts.googleapis.com/**', lambda r: r.abort())
    await page.route('**/cdnjs.cloudflare.com/**', lambda r: r.abort())
    await page.route('**/script.google.com/**', lambda r: r.abort())
    await page.route(BASE + 'js/config.js', lambda r: r.fulfill(status=200, content_type='application/javascript', body=CONFIG))
    await page.route(BASE + 'js/catalog.js', lambda r: r.fulfill(status=200, content_type='application/javascript', body=patched_catalog()))
    await page.route(BASE + 'js/projects/u1.js', lambda r: r.fulfill(status=200, content_type='application/javascript', body=with_u2()))

SOLVE = """(i) => { const def = HW.PROJECTS.u2, P = HW.Projects.state('u2'), copy = JSON.parse(JSON.stringify(P));
  const c = new HW.Projects.Ctx(def, copy, { seed: copy.seed }); def.checkpoints[i].solve(c); return copy.v; }"""
CUR = "() => JSON.parse(JSON.stringify(HW.Projects.state('u2').v))"

async def fill_all(page, i, skip=()):
    """fill the checkpoint's right answers through the page, the way a student would"""
    for _ in range(120):
        want = await page.evaluate(SOLVE, i); have = await page.evaluate(CUR); changed = False
        for k, v in want.items():
            if k in skip or json.dumps(have.get(k)) == json.dumps(v): continue
            sel = '[data-f="%s"]' % k
            if await page.locator(sel).count() == 0: continue
            box = page.locator(sel).first; cls = await box.get_attribute('class') or ''
            if 'pj-choice' in cls:
                await page.locator(sel + ' .pj-opt[data-v="%s"]' % v).first.click()
            elif 'pj-sel' in cls:
                await box.locator('select').select_option(str(v))
            else:
                await box.locator('input, textarea').first.fill(str(v)); changed = True; continue
            changed = True; break   # the page may redraw: look again
        if not changed: return

async def check(page):
    await page.click('.pj-check'); await page.wait_for_timeout(400)
    return await page.evaluate("(document.querySelector('.pj-fb')||{}).className + ' | ' + ((document.querySelector('.pj-fb')||{}).innerText||'')")
async def to(page, sel):
    await page.evaluate("(s) => { const e = document.querySelector(s); if (e) e.scrollIntoView({block: 'start'}); window.scrollBy(0, -70); }", sel); await page.wait_for_timeout(250)

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        ctx = await b.new_context(viewport={'width': 1280, 'height': 800}, service_workers='block')
        page = await ctx.new_page(); await setup(page)
        await page.goto(BASE + '?class=10c-b'); await page.wait_for_selector('.name-btn', timeout=15000)
        # a calendar where Unit 2 is under way: lessons up to 2.6 taught, 2.7 and 2.8 still coming
        await page.evaluate("""() => { const C = HW.Cal, seq = C.sequence(), k = seq.indexOf('u2l6'); let d = C.today(), n = 0;
          while (!C.isWeekday(d)) d = C.addDays(d, -1);
          while (n < k) { d = C.addDays(d, -1); if (C.isWeekday(d)) n++; }
          const cal = C.make(d); return fetch('%s?action=setcal&key=testkey&class=10c-b&cal=' + encodeURIComponent(JSON.stringify(cal))); }""" % MOCK)
        await page.click('.name-btn:has-text("Ben Lee")')
        pins = page.locator('.field.pin'); await pins.nth(0).fill('4321'); await pins.nth(1).fill('4321')
        await page.click('.btn-primary'); await page.wait_for_selector('.unit-title'); await page.wait_for_timeout(1500)
        card = page.locator('a.pj-card[href="#/project/u2"]')
        ok(await card.count() == 1, 'Pick Your Job card on the home page')
        await card.scroll_into_view_if_needed(); await page.evaluate("window.scrollBy(0, -200)"); await page.wait_for_timeout(200)
        ok('Pick Your Job' in await card.inner_text(), 'card title')
        await page.screenshot(path=OUT + '/01_home_card.png')

        await card.click(); await page.wait_for_selector('.pj-wrap')
        await page.wait_for_timeout(500)
        ok(await page.locator('link[href*="projects-u2.css"]').count() == 1, 'the project links its stylesheet')
        await page.screenshot(path=OUT + '/02_cp1.png')
        fb = await check(page); ok('form' in fb, 'cp1 check with nothing picked asks for a job: ' + fb[:80])
        await page.click('[data-f="shift"] .pj-opt[data-v="eve"]'); await page.wait_for_timeout(200)
        await page.click('[data-f="first"] .pj-opt[data-v="p"]'); await page.wait_for_timeout(200)
        await fill_all(page, 0)
        await to(page, '.pj-u2-board')
        await page.screenshot(path=OUT + '/03_cp1_board.png')
        fb = await check(page); ok('good' in fb, 'cp1 done: ' + fb[:60])

        # checkpoint 2: forget the unpaid break on one shift first
        await page.click('.pj-foot .btn-primary'); await page.wait_for_selector('.pj-cph h1:has-text("Timesheets")')
        for _ in range(5): await page.click('.pj-ex-next'); await page.wait_for_timeout(250)
        await page.wait_for_timeout(900)
        await page.screenshot(path=OUT + '/04_cp2_example.png')
        shift = await page.evaluate("() => { const c = new HW.Projects.Ctx(HW.PROJECTS.u2, HW.Projects.state('u2'), {seed: HW.Projects.state('u2').seed}), S = HW.Projects.u2.scen(c), r = S.shifts.find(x => x.brk === 45) || S.shifts[0]; return [r.k, String((r.end - r.start) / 60), String(r.h)]; }")
        await fill_all(page, 1, skip=(shift[0],))
        await page.fill('[data-f="%s"] input' % shift[0], shift[1])
        fb = await check(page); ok('hint' in fb and 'unpaid break' in fb, 'cp2 forgot the break gets the targeted hint')
        await page.evaluate("() => document.querySelector('.pj-in.bad').scrollIntoView({block: 'center'})"); await page.wait_for_timeout(200)
        await page.screenshot(path=OUT + '/05_cp2_hint.png')
        await page.fill('[data-f="%s"] input' % shift[0], shift[2])
        await fill_all(page, 1)
        fb = await check(page); ok('good' in fb, 'cp2 done: ' + fb[:60])
        await to(page, '.pj-u2-tsbox:nth-of-type(2)')
        await page.screenshot(path=OUT + '/06_cp2_week2.png')

        # checkpoint 3
        await page.click('.pj-foot .btn-primary'); await page.wait_for_selector('.pj-cph h1:has-text("Gross")')
        await fill_all(page, 2, skip=('w.otr',))
        wage = await page.evaluate("() => HW.Projects.u2.scen(new HW.Projects.Ctx(HW.PROJECTS.u2, HW.Projects.state('u2'), {seed: HW.Projects.state('u2').seed})).wage")
        await page.fill('[data-f="w.otr"] input', '%.2f' % (wage + 1.5))
        fb = await check(page); ok('hint' in fb and '1.5 × the wage' in fb, 'cp3 overtime rate + $1.50 gets the targeted hint')
        await fill_all(page, 2)
        fb = await check(page); ok('good' in fb, 'cp3 done: ' + fb[:60])
        await to(page, '.pj-u2-job:nth-of-type(2)')
        await page.screenshot(path=OUT + '/07_cp3_jobs.png')
        await to(page, '.pj-u2-tally')
        await page.screenshot(path=OUT + '/08_cp3_trees.png')

        # checkpoint 4: CPP with 0.595
        await page.click('.pj-foot .btn-primary'); await page.wait_for_selector('.pj-u2-stub')
        await fill_all(page, 3, skip=('cpp.p',))
        g = await page.evaluate("() => Number(HW.Projects.state('u2').v['p.gross'])")
        await page.fill('[data-f="cpp.p"] input', '%.2f' % (g * 0.595))
        fb = await check(page); ok('hint' in fb and '0.0595' in fb, 'cp4 CPP as 0.595 gets the targeted hint')
        await fill_all(page, 3)
        fb = await check(page); ok('good' in fb, 'cp4 done: ' + fb[:60])
        await to(page, '.pj-u2-stub')
        await page.screenshot(path=OUT + '/09_cp4_stub.png')

        # checkpoint 5: a used car
        await page.click('.pj-foot .btn-primary'); await page.wait_for_selector('.pj-u2-goals')
        await page.click('[data-f="goal"] .pj-opt[data-v="car"]'); await page.wait_for_timeout(300)
        await fill_all(page, 4, skip=('bk.w',))
        hx = await page.evaluate("() => { const v = HW.Projects.state('u2').v, S = HW.Projects.u2.scen(new HW.Projects.Ctx(HW.PROJECTS.u2, HW.Projects.state('u2'), {seed: HW.Projects.state('u2').seed})); return Number(v.gNeed) / S.wage; }")
        await page.fill('[data-f="bk.w"] input', str(int(hx)))
        fb = await check(page); ok('hint' in fb and 'up' in fb, 'cp5 rounding hours down gets the hint: ' + fb[:120])
        await fill_all(page, 4)
        fb = await check(page); ok('good' in fb, 'cp5 done: ' + fb[:60])
        await to(page, '.pj-u2-back')
        await page.screenshot(path=OUT + '/10_cp5_back.png')

        # checkpoint 6
        await page.click('.pj-foot .btn-primary'); await page.wait_for_selector('.pj-u2-cmp')
        await fill_all(page, 5)
        fb = await check(page); ok('good' in fb, 'cp6 done: ' + fb[:60])
        ok(await page.locator('.pj-u2-guess.right, .pj-u2-guess.wrong').count() == 1, 'the guess from checkpoint 1 is revealed')
        await to(page, '.pj-u2-cmp')
        await page.screenshot(path=OUT + '/11_cp6_compare.png')

        # checkpoint 7: wrong summer total, then hand in
        await page.click('.pj-foot .btn-primary'); await page.wait_for_selector('.pj-u2-offer')
        await fill_all(page, 6, skip=('summer',))
        await page.fill('[data-f="summer"] input', '10.00')
        fb = await check(page); ok('hint' in fb, 'cp7 wrong summer total gets a hint')
        await fill_all(page, 6)
        await to(page, '.pj-u2-offerwrap')
        await page.screenshot(path=OUT + '/12_cp7_offer.png')
        fb = await check(page); ok('good' in fb and 'Handed in' in fb, 'cp7 handed in')
        await page.wait_for_selector('.pj-sub-line.ok', timeout=12000)
        ok(True, 'the ledger confirms it has the project')
        rows = stats()['sheets'].get('Projects', [])
        r2 = [r for r in rows[1:] if r[3] == 'u2']
        ok(len(r2) == 1 and r2[0][4] == 7 and r2[0][6], 'Projects sheet row: u2, done 7, handed in')
        await page.click('.pj-step >> nth=1'); await page.wait_for_selector('.pj-cph h1:has-text("Timesheets")'); ok(True, 'going back works')

        # ---- teacher ----
        tp = await ctx.new_page(); await setup(tp)
        await tp.add_init_script("localStorage.setItem('m103/hw:tkey', 'testkey'); localStorage.setItem('m103/hw:nodemo', '1')")
        await tp.goto(BASE + 'teacher/?class=10c-b&tab=projects'); await tp.wait_for_selector('.tpj-tbl', timeout=15000)
        seg = tp.locator('.tpj-acts .seg button:has-text("Pick Your Job")')
        ok(await seg.count() == 1, 'the Projects tab has a U2 · Pick Your Job button')
        await seg.click(); await tp.wait_for_timeout(600)
        ok('Pick Your Job' in await tp.inner_text('.tpj-head') and 'Ben Lee' in await tp.inner_text('.tpj-tbl'), 'teacher sees Ben in Pick Your Job')
        await tp.screenshot(path=OUT + '/20_ledger_projects.png')
        btn = tp.locator('.tpj-tbl tr:has-text("Ben Lee") .btn')
        if await btn.count():
            await btn.first.click(); await tp.wait_for_selector('.tpj-grade')
            await tp.wait_for_timeout(500)
            ok(await tp.locator('.tpj-review .pj-u2-offer').count() == 1, 'the job offer is in the review')
            ok(await tp.locator('.tpj-review .pj-in.ok').count() > 40, 'read-only review shows the answers marked right')
            ok(await tp.locator('.tpj-review .was-wrong').count() >= 3, 'boxes wrong on the first check are flagged')
            await tp.screenshot(path=OUT + '/21_ledger_student.png')
            await tp.evaluate("() => { const e = document.querySelector('.tpj-review .pj-u2-stub'); if (e) e.scrollIntoView({block: 'center'}); }"); await tp.wait_for_timeout(200)
            await tp.screenshot(path=OUT + '/22_ledger_stub.png')
            for k in range(await tp.locator('.tpj-sugline .btn').count()): await tp.locator('.tpj-sugline .btn').nth(k).click()
            await tp.fill('.tpj-cm', 'Great work on the overtime! Check your percents as decimals.')
            await tp.click('.tpj-gacts .btn-primary'); await tp.wait_for_timeout(1500)
            rows = stats()['sheets'].get('Projects', []); r2 = [r for r in rows[1:] if r[3] == 'u2']
            ok(r2 and r2[0][9] and r2[0][10] and '"A1"' in str(r2[0][9]) and '"N2"' in str(r2[0][9]), 'grade (N2 and A1) saved and released: ' + str(r2[0][9] if r2 else '')[:80])
        else: ok(False, 'Ben Lee row in the Projects tab')

        # ---- student sees it ----
        await page.goto(BASE + '#/'); await page.wait_for_selector('a.pj-card[href="#/project/u2"]'); await page.wait_for_timeout(2500)
        ok('Graded' in await page.inner_text('a.pj-card[href="#/project/u2"]'), 'card says graded')
        badges = await page.evaluate("() => [...document.querySelectorAll('.badge-btn')].map(b => b.getAttribute('aria-label') || b.title || b.textContent).join(' | ')")
        ok('N2' in badges and 'A1' in badges, 'N2 and A1 badges from the released project: ' + badges[:160])

        # ---- iPad ----
        ip = await b.new_context(viewport={'width': 820, 'height': 1180}, device_scale_factor=2, has_touch=True, is_mobile=True, user_agent='Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1')
        ipage = await ip.new_page(); await setup(ipage)
        await ipage.goto(BASE + '?class=10c-b'); await ipage.wait_for_selector('.name-btn')
        await ipage.click('.name-btn:has-text("Ben Lee")'); await ipage.fill('.field.pin', '4321'); await ipage.click('.btn-primary'); await ipage.wait_for_selector('.unit-title'); await ipage.wait_for_timeout(2500)
        for n, s, name in [(1, '.pj-u2-board', '30_ipad_cp1'), (2, '.pj-u2-tsbox', '31_ipad_cp2'), (3, '.pj-u2-job', '32_ipad_cp3'), (4, '.pj-u2-stub', '33_ipad_cp4'), (6, '.pj-u2-cmp', '34_ipad_cp6'), (7, '.pj-u2-offerwrap', '35_ipad_cp7')]:
            await ipage.goto(BASE + '#/project/u2/%d' % n); await ipage.wait_for_selector(s, timeout=10000); await ipage.wait_for_timeout(500)
            await to(ipage, s)
            await ipage.screenshot(path=OUT + '/%s.png' % name)
        wide = await ipage.evaluate("() => { const out = []; document.querySelectorAll('.pj-main *').forEach(e => { const r = e.getBoundingClientRect(); if (r.right > innerWidth + 2 && r.width > 0) out.push(e.className); }); return out.slice(0, 5); }")
        ok(not wide, 'nothing sticks out past the iPad screen: ' + str(wide))
        await b.close()
    print('errors:', errs)
    print('FAILED: %d' % len(fails) if fails or errs else 'all ok')
asyncio.run(main())
