"""Unit 4 project (Recipe Rescue) end to end (Playwright): a student does the whole project through the page (with a
typical mistake in most checkpoints), hands it in; the teacher opens the Projects tab, grades and releases it; the
student's card and badges show it. The project script (appended to u1.js) and its catalog line are injected by routing (index.html,
teacher/index.html and js/catalog.js are not edited). Screenshots (Chromebook 1280x800 and iPad 820x1180) go to $SHOTS
(default /tmp/proj_u4_shots).
Needs: python3 -m http.server 8841 (repo root) and a fresh mock on 8849:
  node backend/mock_server.js 8849 30  (then setroster, see below — the script does it)"""
import asyncio, os, json, urllib.request
from urllib.parse import urlparse
from playwright.async_api import async_playwright
OUT = os.environ.get('SHOTS', '/tmp/proj_u4_shots'); os.makedirs(OUT, exist_ok=True)
BASE = 'http://localhost:8841/'; MOCK = 'http://localhost:8849/'
CONFIG = "var HW_CONFIG = { siteName: 'Math 10-3 Practice', backend: '%s' };" % MOCK
def stats(): return json.loads(urllib.request.urlopen(MOCK + '__stats').read())
errs = []; fails = []
def ok(c, m):
    print(('  ok   ' if c else '  FAIL ') + m)
    if not c: fails.append(m)

async def inject(route, request):
    """js/catalog.js gets Unit 4's project line; js/projects/u1.js gets js/projects/u4.js appended (the same order a
    <script> tag after u1.js would give). The HTML documents are left alone: Chrome blocks calls to the mock from a
    document that Playwright fulfils."""
    path = urlparse(request.url).path
    resp = await route.fetch(); body = await resp.text()
    if path.endswith('catalog.js'):
        body = body.replace("outcomes: 'M1 · M2', lessons", "outcomes: 'M1 · M2', project: { id: 'u4', title: 'Recipe Rescue' }, lessons")
        assert "id: 'u4', title: 'Recipe Rescue'" in body
    else:
        body += '\n;\n' + open(os.path.join(ROOT, 'js/projects/u4.js'), encoding='utf-8').read()
    await route.fulfill(status=200, content_type='application/javascript', body=body)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def is_page(url):
    u = urlparse(url)
    return u.port == 8841 and (u.path.endswith('/js/catalog.js') or u.path.endswith('/js/projects/u1.js'))

async def setup(page):
    page.on('pageerror', lambda e: errs.append('pageerror: ' + str(e)))
    page.on('console', lambda m: errs.append('console: ' + m.text) if m.type == 'error' and 'jsdelivr' not in m.text and 'ERR_FAILED' not in m.text and 'fonts.g' not in m.text and 'teaching/js' not in m.text and '404' not in m.text else None)
    await page.route('**/cdn.jsdelivr.net/**', lambda r: r.abort())
    await page.route('**/fonts.googleapis.com/**', lambda r: r.abort())
    await page.route('**/cdnjs.cloudflare.com/**', lambda r: r.abort())
    await page.route('**/script.google.com/**', lambda r: r.abort())
    await page.route(BASE + 'js/config.js', lambda r: r.fulfill(status=200, content_type='application/javascript', body=CONFIG))
    await page.route(is_page, inject)

SOLVE = """(i) => { const def = HW.PROJECTS.u4, P = HW.Projects.state('u4'), copy = JSON.parse(JSON.stringify(P));
  const c = new HW.Projects.Ctx(def, copy, { seed: copy.seed }); def.checkpoints[i].solve(c); return copy.v; }"""
CUR = "() => JSON.parse(JSON.stringify(HW.Projects.state('u4').v))"

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
    await page.click('.pj-check'); await page.wait_for_timeout(350)
    return await page.evaluate("(document.querySelector('.pj-fb')||{}).className + ' | ' + ((document.querySelector('.pj-fb')||{}).innerText||'')")

async def wrong_then_right(page, i, key, bad, needle, label, shot=None):
    """fill everything, put one typical mistake in, check (targeted hint), fix it"""
    await fill_all(page, i, skip=(key,))
    await page.fill('[data-f="%s"] input' % key, str(bad))
    fb = await check(page); ok('hint' in fb and needle in fb, '%s gets the targeted hint (%s): %s' % (label, needle, fb[:160].replace('\n', ' ')))
    if shot:
        await page.evaluate("(k) => document.querySelector('[data-f=\"' + k + '\"]').scrollIntoView({block: 'center'})", key); await page.wait_for_timeout(250)
        await page.screenshot(path=OUT + '/' + shot)
    await fill_all(page, i)
    fb = await check(page); ok('good' in fb, 'cp%d done: %s' % (i + 1, fb[:70].replace('\n', ' ')))
    return fb

async def main():
    urllib.request.urlopen(MOCK + '?action=setroster&key=testkey&class=10c-b&label=Math%2010C%20%C2%B7%20Block%20B&names=Ava%20Brown%0ABen%20Lee%0ARyan%20Cathcart&mode=add').read()
    async with async_playwright() as p:
        b = await p.chromium.launch()
        ctx = await b.new_context(viewport={'width': 1280, 'height': 800}, service_workers='block')
        page = await ctx.new_page(); await setup(page)
        await page.goto(BASE + '?class=10c-b'); await page.wait_for_selector('.name-btn', timeout=15000)
        ok(await page.evaluate("() => !!(HW.PROJECTS.u4 && HW.CATALOG.filter(u => u.unit === 4)[0].project)"), 'u4 script and catalog line injected')
        # a calendar where Unit 4 is under way: lessons 4.1–4.4 taught, 4.5 and 4.6 coming up
        await page.evaluate("""() => { const C = HW.Cal, seq = C.sequence(), n = seq.indexOf('u4l4'); let d = C.today(), k = 0;
          while (k < n) { d = C.addDays(d, -1); if (C.isWeekday(d)) k++; }
          const cal = C.make(d); return fetch('%s?action=setcal&key=testkey&class=10c-b&cal=' + encodeURIComponent(JSON.stringify(cal))); }""" % MOCK)
        await page.click('.name-btn:has-text("Ben Lee")')
        pins = page.locator('.field.pin'); await pins.nth(0).fill('4321'); await pins.nth(1).fill('4321')
        await page.click('.btn-primary'); await page.wait_for_selector('.unit-title'); await page.wait_for_timeout(1500)
        card = page.locator('a.pj-card[href="#/project/u4"]')
        ok(await card.count() == 1, 'Recipe Rescue card on the home page')
        if await card.count():
            ok('Recipe Rescue' in await card.inner_text() and 'Due' in await card.inner_text(), 'card shows the title and due date')
            await card.scroll_into_view_if_needed(); await page.wait_for_timeout(200)
        await page.screenshot(path=OUT + '/01_home.png')

        await card.click(); await page.wait_for_selector('.pj-wrap')
        await page.screenshot(path=OUT + '/02_cp1.png')
        fb = await check(page); ok('form' in fb, 'cp1 check with nothing picked asks for a recipe: ' + fb[:80])
        await page.click('.pj-u4-recipes .pj-opt[data-v="chili"]'); await page.wait_for_timeout(200)
        await page.click('.pj-u4-people .pj-opt[data-v="30"]'); await page.click('.pj-idea >> nth=0')
        await page.evaluate("() => document.querySelector('.pj-u4-cardwrap').scrollIntoView({block: 'center'})"); await page.wait_for_timeout(200)
        await page.screenshot(path=OUT + '/03_cp1_card.png')
        fb = await check(page); ok('good' in fb, 'cp1 done: ' + fb[:60])

        # checkpoint 2: flipped scale factor
        await page.click('.pj-foot .btn-primary'); await page.wait_for_selector('.pj-cph h1:has-text("Scale")')
        for _ in range(3): await page.click('.pj-ex-next'); await page.wait_for_timeout(250)
        await page.wait_for_timeout(900); await page.screenshot(path=OUT + '/04_cp2_example.png')
        await wrong_then_right(page, 1, 'f', '0.2', 'Flip it', 'cp2 flipped scale factor', '05_cp2_hint.png')
        # checkpoint 3: the diameter as the radius
        await page.click('.pj-foot .btn-primary'); await page.wait_for_selector('.pj-cph h1:has-text("fit")')
        await page.click('.pj-u4-conts .pj-opt[data-v="stock"]'); await page.wait_for_timeout(200)
        await wrong_then_right(page, 2, 'rad', '24', 'diameter', 'cp3 diameter for radius', '06_cp3_hint.png')
        await page.evaluate("() => document.querySelector('.pj-u4-fit').scrollIntoView({block: 'start'})"); await page.wait_for_timeout(200)
        await page.screenshot(path=OUT + '/07_cp3_done.png')
        # checkpoint 4: the quick estimate
        await page.click('.pj-foot .btn-primary'); await page.wait_for_selector('.pj-cph h1:has-text("Oven")')
        await wrong_then_right(page, 3, 'hotC', '65', 'quick estimate', 'cp4 quick estimate', '08_cp4_hint.png')
        # checkpoint 5: a 250 mL cup for the broth
        await page.click('.pj-foot .btn-primary'); await page.wait_for_selector('.pj-cph h1:has-text("metric")')
        ok(await page.locator('.pj-later').count() == 1, 'cp5 says it uses a lesson that is coming up')
        cups = await page.evaluate("() => { const c = new HW.Projects.Ctx(HW.PROJECTS.u4, HW.Projects.state('u4'), {}); return HW.Projects.recipe.scaled(c, HW.Projects.recipe.RECIPES.chili.ings[3]); }")
        await wrong_then_right(page, 4, 'm.broth', str(round(cups * 250)), 'Canadian metric cup', 'cp5 metric cup', '09_cp5_hint.png')
        await page.evaluate("() => document.querySelector('.pj-u4-conv').scrollIntoView({block: 'start'})"); await page.wait_for_timeout(200)
        await page.screenshot(path=OUT + '/10_cp5_done.png')
        # checkpoint 6: price per kg the wrong way
        await page.click('.pj-foot .btn-primary'); await page.wait_for_selector('.pj-cph h1:has-text("shopping")')
        pa = await page.evaluate("() => { const c = new HW.Projects.Ctx(HW.PROJECTS.u4, HW.Projects.state('u4'), {seed: HW.Projects.state('u4').seed}); return HW.Projects.recipe.prices(c, HW.Projects.recipe.RECIPES.chili.ings[0]).A; }")
        await wrong_then_right(page, 5, 'g.beef.pk', '%.2f' % (pa / 2.2), 'more</b> than a pound'.replace('</b>', ''), 'cp6 per kg divided', '11_cp6_hint.png')
        await page.evaluate("() => document.querySelector('.pj-u4-stores').scrollIntoView({block: 'start'})"); await page.wait_for_timeout(200)
        await page.screenshot(path=OUT + '/12_cp6_done.png')
        # checkpoint 7: a wrong cost per person, then hand in
        await page.click('.pj-foot .btn-primary'); await page.wait_for_selector('.pj-cph h1:has-text("recipe card")')
        await fill_all(page, 6, skip=('perServ',))
        await page.fill('[data-f="perServ"] input', '0.50')
        fb = await check(page); ok('hint' in fb, 'cp7 wrong cost per person gets a hint')
        await fill_all(page, 6)
        await page.evaluate("() => document.querySelector('.pj-u4-rcwrap').scrollIntoView({block: 'start'})"); await page.wait_for_timeout(200)
        await page.screenshot(path=OUT + '/13_cp7_card.png')
        fb = await check(page); ok('good' in fb and 'Handed in' in fb, 'cp7 handed in')
        await page.wait_for_selector('.pj-sub-line.ok', timeout=15000); ok(True, 'the ledger confirms it has the project')
        await page.screenshot(path=OUT + '/14_submitted.png')
        rows = [r for r in stats()['sheets'].get('Projects', []) if len(r) > 3 and r[3] == 'u4']
        ok(len(rows) == 1 and rows[0][4] == 7 and rows[0][6], 'Projects sheet row: u4, done 7, handed in')
        # the print sheet has the card
        html = await page.evaluate("""() => { let got = ''; const o = HW.Projects.print; HW.Projects.print = (h) => { got = h; }; document.querySelector('.pj-printbtn').click(); HW.Projects.print = o; return got; }""")
        ok('pj-u4-rcard' in html and 'projects-u4.css' in html and 'Shopping list' in html, 'print sheet: card, shopping list and its stylesheet')

        # ---- teacher ----
        tp = await ctx.new_page(); await setup(tp)
        await tp.add_init_script("localStorage.setItem('m103/hw:tkey', 'testkey'); localStorage.setItem('m103/hw:nodemo', '1')")
        await tp.goto(BASE + 'teacher/?class=10c-b&tab=projects'); await tp.wait_for_selector('.tpj-tbl', timeout=20000)
        pick = tp.locator('.seg button:has-text("Recipe Rescue")')
        ok(await pick.count() == 1, 'the ledger has a Recipe Rescue button beside the Pop-Up Shop')
        if await pick.count(): await pick.click(); await tp.wait_for_selector('.tpj-tbl'); await tp.wait_for_timeout(600)
        ok('Ben Lee' in await tp.inner_text('.tpj-tbl'), 'teacher sees Ben in the Projects tab')
        await tp.screenshot(path=OUT + '/20_ledger_projects.png')
        await tp.click('.tpj-tbl tr:has-text("Ben Lee") .btn'); await tp.wait_for_selector('.tpj-grade')
        await tp.wait_for_timeout(600)
        await tp.screenshot(path=OUT + '/21_ledger_student.png')
        ok(await tp.locator('.tpj-review .pj-in.ok').count() > 40, 'read-only review shows the answers marked right')
        ok(await tp.locator('.tpj-review .was-wrong').count() >= 4, 'boxes wrong on the first check are flagged')
        ok(await tp.locator('.tpj-review .pj-u4-rcard').count() == 1, 'the recipe card is in the review')
        ok(await tp.evaluate("() => getComputedStyle(document.querySelector('.tpj-review .pj-u4-rcard')).borderRadius") == '18px', 'the project stylesheet loads in the ledger')
        await tp.evaluate("() => document.querySelector('.tpj-review .pj-u4-fit').scrollIntoView({block: 'center'})"); await tp.wait_for_timeout(200)
        await tp.screenshot(path=OUT + '/22_ledger_review_fit.png')
        ok(await tp.locator('.tpj-orow').count() == 2, 'an indicator for each outcome (M1, M2)')
        for k in range(await tp.locator('.tpj-sugline .btn').count()): await tp.locator('.tpj-sugline .btn').nth(k).click()
        await tp.fill('.tpj-cm', 'Great rescue! Watch the radius: it is half the diameter.')
        await tp.click('.tpj-gacts .btn-primary'); await tp.wait_for_timeout(1500)
        rows = [r for r in stats()['sheets'].get('Projects', []) if len(r) > 3 and r[3] == 'u4']
        ok(rows and rows[0][9] and rows[0][10], 'grade saved and released: ' + str(rows[0][9] if rows else '')[:80])

        # ---- student sees it ----
        await page.goto(BASE + '#/'); await page.wait_for_selector('a.pj-card[href="#/project/u4"]'); await page.wait_for_timeout(2500)
        ok('Graded' in await page.inner_text('a.pj-card[href="#/project/u4"]'), 'card says graded')
        badges = await page.evaluate("() => [...document.querySelectorAll('.badge-btn')].map(b => b.getAttribute('aria-label') || b.title || b.textContent).join(' | ')")
        ok('M1' in badges and 'M2' in badges, 'M1 and M2 badges from the released project: ' + badges[:160])
        await page.goto(BASE + '#/project/u4/7'); await page.wait_for_selector('.pj-grade'); ok(True, 'feedback shown on the last checkpoint')

        # ---- iPad ----
        ip = await b.new_context(viewport={'width': 820, 'height': 1180}, device_scale_factor=2, has_touch=True, is_mobile=True, user_agent='Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1')
        ipage = await ip.new_page(); await setup(ipage)
        await ipage.goto(BASE + '?class=10c-b'); await ipage.wait_for_selector('.name-btn')
        await ipage.click('.name-btn:has-text("Ben Lee")'); await ipage.fill('.field.pin', '4321'); await ipage.click('.btn-primary'); await ipage.wait_for_selector('.unit-title'); await ipage.wait_for_timeout(2500)
        for n, sel, name in [(1, '.pj-u4-cardwrap', '30_ipad_cp1'), (3, '.pj-u4-fit', '31_ipad_cp3'), (5, '.pj-u4-conv', '32_ipad_cp5'), (6, '.pj-u4-stores', '33_ipad_cp6'), (7, '.pj-u4-rcwrap', '34_ipad_cp7')]:
            await ipage.goto(BASE + '#/project/u4/%d' % n); await ipage.wait_for_selector(sel, timeout=10000); await ipage.wait_for_timeout(500)
            await ipage.evaluate("(s) => document.querySelector(s).scrollIntoView({block: 'start'})", sel); await ipage.wait_for_timeout(200)
            await ipage.screenshot(path=OUT + '/' + name + '.png')
        ok(await ipage.evaluate("() => document.documentElement.scrollWidth <= innerWidth + 1"), 'iPad: nothing wider than the screen')
        await b.close()
    print('errors:', errs)
    print('FAILED: %d' % len(fails) if fails or errs else 'all ok')
asyncio.run(main())
