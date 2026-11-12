"""Unit projects end to end (Playwright): a student does the whole Pop-Up Shop through the page (with a few mistakes
on the way), hands it in; the teacher opens the Projects tab, grades it and releases it; the student's badge and card
show it. Screenshots (Chromebook 1280x800 and iPad) go to $SHOTS (default /tmp/proj_shots).
Needs: python3 -m http.server 8841 (repo root) and a fresh mock: tests/restart_mock.sh (node backend/mock_server.js 8845)."""
import asyncio, os, json, urllib.request
from playwright.async_api import async_playwright
OUT = os.environ.get('SHOTS', '/tmp/proj_shots'); os.makedirs(OUT, exist_ok=True)
BASE = 'http://localhost:8841/'; MOCK = 'http://localhost:8845/'
CONFIG = "var HW_CONFIG = { siteName: 'Math 10-3 Practice', backend: '%s' };" % MOCK
def stats(): return json.loads(urllib.request.urlopen(MOCK + '__stats').read())
errs = []; fails = []
def ok(c, m):
    print(('  ok   ' if c else '  FAIL ') + m)
    if not c: fails.append(m)

async def setup(page):
    page.on('pageerror', lambda e: errs.append('pageerror: ' + str(e)))
    page.on('console', lambda m: errs.append('console: ' + m.text) if m.type == 'error' and 'jsdelivr' not in m.text and 'ERR_FAILED' not in m.text and 'fonts.g' not in m.text and 'teaching/js' not in m.text and '404' not in m.text else None)
    await page.route('**/cdn.jsdelivr.net/**', lambda r: r.abort())
    await page.route('**/fonts.googleapis.com/**', lambda r: r.abort())
    await page.route('**/cdnjs.cloudflare.com/**', lambda r: r.abort())
    await page.route('**/script.google.com/**', lambda r: r.abort())
    await page.route(BASE + 'js/config.js', lambda r: r.fulfill(status=200, content_type='application/javascript', body=CONFIG))

SOLVE = """(i) => { const def = HW.PROJECTS.u1, P = HW.Projects.state('u1'), copy = JSON.parse(JSON.stringify(P));
  const c = new HW.Projects.Ctx(def, copy, { seed: copy.seed }); def.checkpoints[i].solve(c); return copy.v; }"""
CUR = "() => JSON.parse(JSON.stringify(HW.Projects.state('u1').v))"

async def fill_all(page, i, skip=()):
    """fill the checkpoint's right answers through the page, the way a student would"""
    for _ in range(80):
        want = await page.evaluate(SOLVE, i); have = await page.evaluate(CUR); changed = False
        for k, v in want.items():
            if k in skip or json.dumps(have.get(k)) == json.dumps(v): continue
            sel = '[data-f="%s"]' % k
            if await page.locator(sel).count() == 0: continue
            box = page.locator(sel).first; cls = await box.get_attribute('class') or ''
            if k == 'picks':
                for pid in v: await page.click('.pj-pick:nth-child(%d)' % (1 + await page.evaluate("(id) => HW.PROJECTS.u1 && HW.Projects.popup.SHOPS[HW.Projects.state('u1').v.shop].products.findIndex(p => p.id === id)", pid)))
            elif 'pj-mk' in cls:
                await page.evaluate("([k, v]) => { const s = document.querySelector('[data-f=\"' + k + '\"] input[type=range]'); s.value = v; s.dispatchEvent(new Event('input')); }", [k, v])
            elif 'pj-choice' in cls:
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

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        ctx = await b.new_context(viewport={'width': 1280, 'height': 800}, service_workers='block')
        page = await ctx.new_page(); await setup(page)
        await page.goto(BASE + '?class=10c-b'); await page.wait_for_selector('.name-btn', timeout=10000)
        # a calendar where Unit 1 started two weeks ago (lessons 1–8 taught, 9 and 10 coming up)
        await page.evaluate("""() => { const C = HW.Cal; let d = C.today(), n = 0; while (n < 9) { d = C.addDays(d, -1); if (C.isWeekday(d)) n++; }
          const cal = C.make(d); return fetch('%s?action=setcal&key=testkey&class=10c-b&cal=' + encodeURIComponent(JSON.stringify(cal))); }""" % MOCK)
        await page.click('.name-btn:has-text("Ben Lee")')
        pins = page.locator('.field.pin'); await pins.nth(0).fill('4321'); await pins.nth(1).fill('4321')
        await page.click('.btn-primary'); await page.wait_for_selector('.unit-title'); await page.wait_for_timeout(1500)
        ok(await page.locator('.pj-card').count() == 1, 'project card on the home page')
        ok('Due' in await page.inner_text('.pj-card'), 'card shows the due date: ' + (await page.inner_text('.pj-card-due')))
        ok(await page.locator('.pj-due').count() == 1, 'due notice beside the next test')
        await page.screenshot(path=OUT + '/01_home.png')
        await page.click('#home-cal .hh-calbtn'); await page.wait_for_timeout(500)
        ok(await page.locator('.cal-pop .calm-chip.proj').count() == 1, 'project day on the class calendar')
        ok(await page.locator('.cal-pop .pj-cal-due').count() == 1, 'due note on the unit test day')
        await page.evaluate("() => { const c = document.querySelector('.cal-pop .calm-chip.proj'); c.scrollIntoView({block: 'center'}); }"); await page.wait_for_timeout(300)
        await page.screenshot(path=OUT + '/02_calendar.png')
        await page.keyboard.press('Escape')

        await page.click('.pj-card'); await page.wait_for_selector('.pj-wrap')
        await page.screenshot(path=OUT + '/03_cp1.png')
        # checkpoint 1: check too early, then the shop
        fb = await check(page); ok('form' in fb, 'cp1 check with nothing picked asks for a shop: ' + fb[:80])
        await page.click('.pj-types .pj-opt[data-v="snack"]'); await page.wait_for_timeout(200)
        await page.click('.pj-idea >> nth=0')
        for n in [1, 2, 3, 5, 6]: await page.click('.pj-pick:nth-child(%d)' % n)
        await page.screenshot(path=OUT + '/04_cp1_filled.png', full_page=True)
        fb = await check(page); ok('good' in fb, 'cp1 done: ' + fb[:60])
        await page.click('.pj-foot .btn-primary'); await page.wait_for_selector('.pj-cph h1:has-text("supplier")')
        # the example steps through
        for _ in range(3): await page.click('.pj-ex-next'); await page.wait_for_timeout(250)
        await page.wait_for_timeout(900)
        await page.screenshot(path=OUT + '/05_cp2_example.png')
        # checkpoint 2: a flipped unit price first
        await fill_all(page, 1)
        wrong = await page.evaluate("() => { const p = HW.Projects.popup.products(new HW.Projects.Ctx(HW.PROJECTS.u1, HW.Projects.state('u1'), {seed: HW.Projects.state('u1').seed}))[0], k = p.packs[0]; return ['unit.' + p.id + '.' + k.id, (k.n / k.price).toFixed(2), (k.price / k.n).toFixed(2)]; }")
        await page.fill('[data-f="%s"] input' % wrong[0], wrong[1])
        fb = await check(page); ok('hint' in fb and 'divided the number of items' in fb, 'cp2 flipped division gets the targeted hint')
        await page.evaluate("() => document.querySelector('.pj-in.bad').scrollIntoView({block: 'center'})"); await page.wait_for_timeout(200)
        await page.screenshot(path=OUT + '/06_cp2_hint.png')
        await page.fill('[data-f="%s"] input' % wrong[0], wrong[2])
        fb = await check(page); ok('good' in fb, 'cp2 done: ' + fb[:60])
        await page.screenshot(path=OUT + '/07_cp2_done.png')
        # checkpoints 3–6
        for i in range(2, 6):
            await page.click('.pj-foot .btn-primary'); await page.wait_for_timeout(500)
            await fill_all(page, i)
            if i == 2: await page.screenshot(path=OUT + '/08_cp3.png')
            if i == 3:
                await page.evaluate("() => document.querySelector('.pj-tags').scrollIntoView({block: 'start'})"); await page.wait_for_timeout(200)
                await page.screenshot(path=OUT + '/09_cp4_tags.png')
            fb = await check(page); ok('good' in fb, 'cp%d done: %s' % (i + 1, fb[:70]))
            if i == 4: await page.evaluate("() => document.querySelector('.pj-cmp').scrollIntoView({block: 'center'})"); await page.wait_for_timeout(200); await page.screenshot(path=OUT + '/10_cp5_sale.png')
            if i == 5: await page.evaluate("() => document.querySelector('.pj-invoice').scrollIntoView({block: 'center'})"); await page.wait_for_timeout(200); await page.screenshot(path=OUT + '/11_cp6_us.png')
        # checkpoint 7: wrong profit, then hand in
        await page.click('.pj-foot .btn-primary'); await page.wait_for_timeout(500)
        await fill_all(page, 6, skip=('profitAmt',))
        await page.fill('[data-f="profitAmt"] input', '0.01')
        fb = await check(page); ok('hint' in fb, 'cp7 wrong profit gets a hint')
        await fill_all(page, 6)
        await page.evaluate("() => document.querySelector('.pj-flyerwrap').scrollIntoView({block: 'start'})"); await page.wait_for_timeout(200)
        await page.screenshot(path=OUT + '/12_cp7_flyer.png')
        fb = await check(page); ok('good' in fb and 'Handed in' in fb, 'cp7 handed in')
        await page.wait_for_selector('.pj-sub-line.ok', timeout=12000)
        ok(True, 'the ledger confirms it has the project')
        await page.screenshot(path=OUT + '/13_submitted.png')
        rows = stats()['sheets'].get('Projects', [])
        ok(len(rows) == 2 and rows[1][3] == 'u1' and rows[1][4] == 7 and rows[1][6], 'Projects sheet row: done 7, handed in')
        # locked checkpoint links: go back works
        await page.click('.pj-step >> nth=1'); await page.wait_for_selector('.pj-cph h1:has-text("supplier")'); ok(True, 'going back works')

        # ---- teacher ----
        tp = await ctx.new_page(); await setup(tp)
        await tp.add_init_script("localStorage.setItem('m103/hw:tkey', 'testkey'); localStorage.setItem('m103/hw:nodemo', '1')")
        await tp.goto(BASE + 'teacher/?class=10c-b&tab=projects'); await tp.wait_for_selector('.tpj-tbl', timeout=15000)
        ok('Ben Lee' in await tp.inner_text('.tpj-tbl'), 'teacher sees Ben in the Projects tab')
        await tp.screenshot(path=OUT + '/20_ledger_projects.png')
        await tp.click('.tpj-tbl tr:has-text("Ben Lee") .btn'); await tp.wait_for_selector('.tpj-grade')
        await tp.screenshot(path=OUT + '/21_ledger_student.png')
        ok(await tp.locator('.tpj-review .pj-in.ok').count() > 20, 'read-only review shows the answers marked right')
        ok(await tp.locator('.tpj-review .was-wrong').count() >= 2, 'boxes wrong on the first check are flagged')
        ok(await tp.locator('.tpj-review .pj-flyer').count() == 1, 'the flyer is in the review')
        await tp.click('.tpj-sugline .btn'); await tp.fill('.tpj-cm', 'Great shop! Next time, check which way you divide for unit price.')
        await tp.click('.tpj-gacts .btn-primary'); await tp.wait_for_timeout(1200)
        rows = stats()['sheets'].get('Projects', [])
        ok(rows[1][9] and rows[1][10], 'grade saved and released: ' + str(rows[1][9])[:80])
        await tp.click('text=← All students'); await tp.wait_for_selector('.tpj-tbl'); await tp.wait_for_timeout(300)
        await tp.screenshot(path=OUT + '/22_ledger_graded.png')

        # ---- student sees it ----
        await page.goto(BASE + '#/'); await page.wait_for_selector('.pj-card'); await page.wait_for_timeout(2500)
        ok('Graded' in await page.inner_text('.pj-card'), 'card says graded')
        badges = await page.evaluate("() => [...document.querySelectorAll('.badge-btn')].map(b => b.getAttribute('aria-label') || b.title || b.textContent).join(' | ')")
        ok('N1' in badges, 'N1 badge from the released project: ' + badges[:120])
        await page.evaluate("() => { const p = document.querySelector('.badge-pop'); if (p) p.remove(); }")
        await page.screenshot(path=OUT + '/14_home_graded.png')
        await page.goto(BASE + '#/project/u1/7'); await page.wait_for_selector('.pj-grade'); ok(True, 'feedback shown on the last checkpoint')
        await page.evaluate("() => document.querySelector('.pj-grade').scrollIntoView({block: 'center'})"); await page.wait_for_timeout(200)
        await page.screenshot(path=OUT + '/15_feedback.png')

        # ---- iPad ----
        ip = await b.new_context(viewport={'width': 820, 'height': 1180}, device_scale_factor=2, has_touch=True, is_mobile=True, user_agent='Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1')
        ipage = await ip.new_page(); await setup(ipage)
        await ipage.goto(BASE + '?class=10c-b'); await ipage.wait_for_selector('.name-btn')
        await ipage.click('.name-btn:has-text("Ben Lee")'); await ipage.fill('.field.pin', '4321'); await ipage.click('.btn-primary'); await ipage.wait_for_selector('.unit-title'); await ipage.wait_for_timeout(2500)
        await ipage.screenshot(path=OUT + '/30_ipad_home.png')
        await ipage.goto(BASE + '#/project/u1/3'); await ipage.wait_for_selector('.pj-wrap'); await ipage.wait_for_timeout(800)
        await ipage.screenshot(path=OUT + '/31_ipad_cp3.png')
        await ipage.goto(BASE + '#/project/u1/4'); await ipage.wait_for_selector('.pj-tags'); await ipage.wait_for_timeout(500)
        await ipage.evaluate("() => document.querySelector('.pj-tags').scrollIntoView({block: 'start'})"); await ipage.wait_for_timeout(200)
        await ipage.screenshot(path=OUT + '/32_ipad_tags.png')
        await b.close()
    print('errors:', errs)
    print('FAILED: %d' % len(fails) if fails or errs else 'all ok')
asyncio.run(main())
