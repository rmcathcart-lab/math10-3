"""Certification cards on the student home page (mock ledger). There are no Math 10-3 lessons online yet, so the page gets a
few fake lessons (one question per outcome and level, no generators: they are only counted, never opened).
Unit 1 has started: N1 shows "Not yet issued" (no pop-up). Practice earns N1 Journeyperson → "New card!" opens big; Esc
closes. A device that has never shown cards just remembers them (no pop-up). Practice in later units gives a card for every
outcome → "New cards!". Tapping a card opens the viewer: the seven levels (the ones reached can be tapped), the flip to the
back (the outcome's wording), tap-to-flip on the card, Next. Nothing new → no pop-up. Then a phone-sized look.
Needs the static server on 8841 (repo root) and a mock ledger: node backend/mock_server.js 8856 20, then
curl 'http://localhost:8856/?action=setroster&key=testkey&class=103-b&label=Block%20B&names=Ava%20Brown%0ABen%20Lee&mode=add'.
Screenshots in /tmp/certs/home_*.png."""
import asyncio, re, sys
from playwright.async_api import async_playwright
BASE = 'http://localhost:8841/'; MOCK = 'http://localhost:8856/'
CONFIG = "var HW_CONFIG = { siteName: 'Math 10-3 Practice', backend: '%s' };" % MOCK
FONTS = '/home/claude/rmcathcart-lab/math10c/assets/outline/fonts/'
SHOTS = '/tmp/certs/'
# fake lessons: one question per outcome, one part per level
FAKE = r"""(function () {
  var LV = ['LIM', 'BEG', 'EMG', 'PRG', 'ADV', 'MAS'];
  function L(id, unit, outs) { HW.defineLesson({ id: id, unit: unit, num: id.split('l')[1], title: 'Fake ' + id,
    questions: outs.map(function (o, k) { return { num: String(k + 1), outcome: o, parts: LV.map(function (lv, j) { return { id: (k + 1) + 'abcdef'[j], level: lv }; }) }; }) }); }
  L('u1l1', 1, ['N1']); L('u2l1', 2, ['N2', 'A1']); L('u3l2', 3, ['M1', 'M2', 'M3', 'M4']); L('u5l1', 5, ['G1', 'G5', 'G6']); L('u6l1', 6, ['G3']); L('u7l2', 7, ['G2', 'G4']);
})();
"""
# done (right the first time) on question q of a lesson, up to level index n (1 = LIM … 6 = MAS)
FILL = """([lid, q, n]) => { const S = HW.App.state(), L = HW.lessons[lid]; S.lessons[lid] = S.lessons[lid] || { items: {}, qv: {}, cur: null, secs: 0, updated: 0 };
  L.items.filter(it => it.q.num === String(q)).slice(0, n).forEach(it => { S.lessons[lid].items[it.id] = { s: 'done', v: 0, tv: 0, wrong: 0, steps: 0, forms: 0, reveals: 0, credit: 'first', secs: 30, at: Date.now(), prac: 0, done: Date.now() }; });
  S.lessons[lid].updated = Date.now(); HW.App.save(); return L.items.filter(it => it.q.num === String(q)).slice(0, n).map(it => it.outcome + ':' + it.level).join(' '); }"""

async def serve_font(ctx):
    css = ''.join("@font-face{font-family:'Barlow Condensed';font-weight:%d;src:url(https://fonts.gstatic.com/local/bc%d.woff2) format('woff2')}" % (w, w) for w in (700, 800))
    await ctx.route('**/fonts.googleapis.com/**', lambda r: r.fulfill(status=200, content_type='text/css', body=css))
    await ctx.route('**/fonts.gstatic.com/local/bc*.woff2', lambda r: r.fulfill(status=200, content_type='font/woff2', body=open(FONTS + 'barlow-condensed-latin-%s-normal.woff2' % re.search(r'bc(\d+)\.woff2', r.request.url).group(1), 'rb').read()))

async def student(b, name, pin, errs, viewport=None, reduced=False):
    ctx = await b.new_context(viewport=viewport or {'width': 1280, 'height': 860}, reduced_motion='reduce' if reduced else 'no-preference')
    await serve_font(ctx)
    await ctx.route('**/script.google.com/**', lambda r: r.abort())
    await ctx.route('**/cdn.jsdelivr.net/**', lambda r: r.abort())
    async def certs(r):   # the fake lessons go in just before js/certs.js (after js/kit.js, before js/app.js)
        resp = await r.fetch(); await r.fulfill(response=resp, body=FAKE + await resp.text())
    await ctx.route(BASE + 'js/certs.js', certs)
    await ctx.route(BASE + 'js/config.js', lambda r: r.fulfill(status=200, content_type='application/javascript', body=CONFIG))
    page = await ctx.new_page()
    page.on('pageerror', lambda e: errs.append(name + ': ' + str(e)))
    page.on('dialog', lambda d: errs.append(name + ': unexpected dialog ' + d.message))
    await page.goto(BASE + '?class=103-b'); await page.wait_for_selector('.name-btn', timeout=10000)
    await page.click('.name-btn:has-text("%s")' % name)
    await page.wait_for_selector('.field.pin'); await page.wait_for_timeout(200)
    pins = page.locator('.field.pin')
    for k in range(await pins.count()): await pins.nth(k).fill(pin)   # a new PIN asks twice
    await page.click('.btn-primary'); await page.wait_for_selector('.lesson-row')
    return page

async def cards(page): return await page.evaluate("[...document.querySelectorAll('.hh-medals .cert-btn')].map(b => b.title + (b.classList.contains('is-new') ? ' (new)' : ''))")
async def home(page, wait=2500): await page.evaluate("location.hash = '#/x'; location.hash = '#/'"); await page.wait_for_timeout(wait)

async def main():
    errs = []
    async with async_playwright() as p:
        b = await p.chromium.launch()
        a = await student(b, 'Ava Brown', '1111', errs); a.set_default_timeout(30000)
        await a.wait_for_timeout(1500); m = await cards(a); print('start:', m)
        assert m == ['N1 · Not yet issued · Not meeting'], m                 # Unit 1 has started, no practice yet
        assert await a.locator('.cert-pop').count() == 0, 'Not yet issued should not pop up'
        print('done:', await a.evaluate(FILL, ['u1l1', 1, 4]))
        await home(a); m = await cards(a); print('after practice:', m); assert m[0].startswith('N1 · Journeyperson · Progressing'), m
        t = await a.inner_text('.cert-pop'); assert 'new card!' in t.lower(), t   # her first card
        assert await a.locator('.cert-pop.badge-pop').count() == 1             # app.js looks for .badge-pop
        await a.wait_for_timeout(900); await a.screenshot(path=SHOTS + 'home_newcard.png')
        await a.keyboard.press('Escape'); assert await a.locator('.cert-pop').count() == 0
        # a device that has never shown cards just remembers what there is: no pop-up
        await a.evaluate("Object.keys(localStorage).filter(k => k.startsWith('hw:medals:')).forEach(k => localStorage.removeItem(k))")
        await home(a); assert await a.locator('.cert-pop').count() == 0, 'the first time on a device should be quiet'
        # practice across the course: every outcome gets a card, at every level
        plan = [['u2l1', 1, 1], ['u2l1', 2, 2], ['u3l2', 1, 3], ['u3l2', 2, 4], ['u3l2', 3, 5], ['u3l2', 4, 6], ['u5l1', 1, 2], ['u5l1', 2, 3], ['u5l1', 3, 5],
                ['u6l1', 1, 6], ['u7l2', 1, 4], ['u7l2', 2, 1]]
        for x in plan: await a.evaluate(FILL, x)
        await home(a, 500); await a.wait_for_selector('.cert-pop', timeout=10000)
        m = await cards(a); print('now:', len(m), m)
        assert len(m) == 13, m
        t = await a.inner_text('.cert-pop'); print('pop-up:', ' | '.join(t.split('\n')[:5])); assert 'new cards!' in t.lower(), t
        await a.keyboard.press('Escape'); assert await a.locator('.cert-pop').count() == 0
        await a.mouse.move(5, 5); await a.wait_for_timeout(400)
        await a.locator('.home-head').screenshot(path=SHOTS + 'home_row.png')
        # the viewer: M4 is at Master Certified, so all seven levels can be tapped
        await a.click('.hh-medals .cert-btn >> nth=6'); await a.wait_for_selector('.cert-pop .cert-ladder')
        got = await a.evaluate("[...document.querySelectorAll('.cert-rung')].map(r => r.className.includes('got') ? 1 : 0).join('')"); print('M4 ladder:', got); assert got == '1111111', got
        print('name:', await a.inner_text('.cert-name')); assert (await a.inner_text('.cert-name')).lower() == 'master certified'
        # point at the card: it tilts
        bb = await a.locator('.cert-tilt').bounding_box(); await a.mouse.move(bb['x'] + bb['width'] * .85, bb['y'] + bb['height'] * .2); await a.wait_for_timeout(500)
        rx = await a.evaluate("getComputedStyle(document.querySelector('.cert-tilt')).getPropertyValue('--ry')"); print('tilt --ry:', rx); assert rx.strip() not in ('', '0deg'), rx
        await a.wait_for_timeout(700); await a.locator('.cert-box').screenshot(path=SHOTS + 'home_viewer_mas.png')
        # tap a level passed: it becomes the big one
        await a.click('.cert-rung.got >> nth=2'); await a.wait_for_timeout(300)
        print('picked:', await a.inner_text('.cert-name'), '|', await a.inner_text('.cert-level')); assert (await a.inner_text('.cert-name')).lower() == 'apprentice i'
        assert await a.evaluate("[...document.querySelectorAll('.cert-rung')].findIndex(r => r.classList.contains('here'))") == 2
        await a.click('.cert-rung.got >> nth=6'); await a.wait_for_timeout(300)
        # flip it: the back has the outcome's official wording
        await a.click('.cert-flipbtn'); await a.wait_for_timeout(900)
        assert await a.locator('.cert-flip.is-flipped').count() == 1
        back = await a.inner_text('.cert-back'); print('back:', back.replace('\n', ' | ')[:160]); assert 'regular, composite and irregular' in back
        ov = await a.evaluate("(() => { const b = document.querySelector('.cert-back .cb-body'); return [b.scrollHeight, b.clientHeight]; })()"); print('back body scroll/client:', ov)
        await a.mouse.move(5, 5); await a.wait_for_timeout(500); await a.locator('.cert-box').screenshot(path=SHOTS + 'home_viewer_back.png')
        # a tap on the card flips it back
        await a.click('.cert-tilt'); await a.wait_for_timeout(800); assert await a.locator('.cert-flip.is-flipped').count() == 0
        xb = await a.evaluate("(() => { const b = document.querySelector('.cert-x').getBoundingClientRect(), s = document.querySelector('.cert-x svg').getBoundingClientRect(); return [Math.round((s.left + s.width / 2) - (b.left + b.width / 2)), Math.round((s.top + s.height / 2) - (b.top + b.height / 2))]; })()")
        print('X off centre by', xb); assert xb == [0, 0]
        await a.click('.cert-next'); await a.wait_for_timeout(500); print('next:', await a.inner_text('.cert-name'), '|', await a.inner_text('.cert-out'))
        assert 'G1' in await a.inner_text('.cert-out')
        await a.wait_for_timeout(600); await a.locator('.cert-box').screenshot(path=SHOTS + 'home_viewer_next.png')
        await a.click('.cert-x'); assert await a.locator('.cert-pop').count() == 0
        # back again: nothing new, no pop-up
        await home(a, 2500); assert await a.locator('.cert-pop').count() == 0
        # a phone, with reduced motion: no tilt, but the card is there and still flips
        ph = await student(b, 'Ben Lee', '2222', errs, viewport={'width': 390, 'height': 800}, reduced=True)
        for x in [['u1l1', 1, 6]] + plan: await ph.evaluate(FILL, x)
        await home(ph, 500); await ph.wait_for_selector('.cert-pop', timeout=10000); await ph.wait_for_timeout(900)
        await ph.screenshot(path=SHOTS + 'home_phone_pop.png')
        bb = await ph.locator('.cert-front').bounding_box(); print('phone card:', bb); assert bb['width'] > 300 and bb['height'] > 180
        assert await ph.locator('.cert-tilt.is-in').count() == 0
        await ph.mouse.move(bb['x'] + 300, bb['y'] + 20); await ph.wait_for_timeout(300)
        assert (await ph.evaluate("getComputedStyle(document.querySelector('.cert-tilt')).transform")) == 'none'
        await ph.click('.cert-tilt'); await ph.wait_for_timeout(300); assert await ph.locator('.cert-flip.is-flipped').count() == 1
        await ph.click('.cert-tilt'); await ph.wait_for_timeout(300)
        await ph.keyboard.press('Escape'); await ph.mouse.move(1, 1); await ph.wait_for_timeout(300)
        await ph.locator('.home-head').screenshot(path=SHOTS + 'home_phone_row.png')
        await b.close()
    errs = [e for e in errs if 'favicon' not in e]
    print('errors:', errs); assert not errs; print('PASS')
asyncio.run(main())
