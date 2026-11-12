"""Every lesson page under lessons/ (and the lessons home, lessons/index.html) loads from the combined repo: no page errors or missing files, KaTeX renders,
the shared calculator opens, explainers mount, and the assignment link points at the practice site in this repo.
Needs a static server for the repo root on 8841. Optional: COMPARE=http://localhost:8812/ (the old teaching repo)
prints the same numbers for the old site."""
import asyncio, os, re
from playwright.async_api import async_playwright
BASE = 'http://localhost:8841/'
IDS = ['u1/l%d' % n for n in range(0, 12)] + ['u2/l%d' % n for n in range(1, 10)] + ['u3/l%d' % n for n in range(1, 13)] + ['u4/l%d' % n for n in range(1, 8)] + ['u5/l%d' % n for n in range(1, 10)] + ['u6/l%d' % n for n in range(1, 8)] + ['u7/l%d' % n for n in range(1, 11)]
async def probe(ctx, url):
    page = await ctx.new_page(); errs, bad = [], []
    page.on('pageerror', lambda e: errs.append(str(e)))
    page.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'script.google.com' not in m.text and 'Failed to load resource' not in m.text else None)
    page.on('response', lambda r: bad.append(str(r.status) + ' ' + r.url) if r.status >= 400 else None)
    await page.goto(url); await page.wait_for_timeout(1200)
    info = await page.evaluate("""() => ({ katex: document.querySelectorAll('.katex').length, texLeft: document.querySelectorAll('.tex:not(:has(.katex))').length,
      calc: !!(window.HW && HW.Calc), explainers: document.querySelectorAll('[data-explainer]').length,
      assign: (document.querySelector('a.assign') || {}).href || null, ink: document.querySelectorAll('[data-ink]').length })""")
    # open the calculator from the toolbar if there is a Calc button
    btn = await page.query_selector('button:has-text("Calc")')
    if btn: await btn.click(); await page.wait_for_timeout(300); info['calcOpen'] = await page.evaluate("!!document.querySelector('.calc') && getComputedStyle(document.querySelector('.calc')).display !== 'none'")
    await page.close()
    return info, errs, bad
async def home_check(ctx, url):
    """the lessons home (lessons/index.html) lists every switched-on lesson (HW.TEACHING.lessons) exactly once, loads
    nothing heavy, and every link, icon and manifest icon on it resolves (no 404s)"""
    page = await ctx.new_page(); scripts = []
    page.on('request', lambda q: scripts.append(q.url) if q.resource_type == 'script' else None)
    await page.goto(url); await page.wait_for_selector('#units a.row')
    r = await page.evaluate("""() => ({
      want: HW.TEACHING.lessons.map((id) => { const m = /^u(\\d+)l(\\w+)$/.exec(id); return 'u' + m[1] + '/l' + m[2] + '/'; }),
      got: [...document.querySelectorAll('#units a.row')].map((a) => a.getAttribute('href').split('?')[0]),
      links: [...new Set([...document.querySelectorAll('a[href]')].map((a) => a.href.split('#')[0]))],
      heads: [...document.querySelectorAll('link[rel~=icon], link[rel=apple-touch-icon], link[rel=manifest]')].map((l) => l.href),
      manifest: (document.querySelector('link[rel=manifest]') || {}).href })""")
    urls = r['links'] + r['heads']
    man = await (await ctx.request.get(r['manifest'])).json()
    urls += [r['manifest'].rsplit('/', 1)[0] + '/' + i['src'] for i in man.get('icons', [])]
    bad = []
    for u in urls:
        if u.startswith(BASE):
            st = (await ctx.request.get(u)).status
            if st >= 400: bad.append('%d %s' % (st, u))
    heavy = [u for u in scripts if not re.search(r'/js/(catalog|ns)\.js$', u)]
    await page.close()
    return dict(lessons=len(r['got']), missing=sorted(set(r['want']) - set(r['got'])), extra=sorted(set(r['got']) - set(r['want'])),
                dup=len(r['got']) - len(set(r['got'])), checked=len(urls), bad=bad, heavy=heavy,
                app=[man.get('short_name'), man.get('start_url'), man.get('scope'), man.get('display')])
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); ctx = await b.new_context(viewport={'width': 1180, 'height': 820})
        await ctx.route('**/script.google.com/**', lambda r: r.abort())
        ok = True
        for site in [BASE + 'lessons/'] + ([os.environ['COMPARE']] if os.environ.get('COMPARE') else []):
            print('==', site)
            for l in IDS + ['']:
                url = site + (l + '/?class=B' if l else '')
                info, errs, bad = await probe(ctx, url)
                print(f"{l or 'home':7} {info} errors={errs[:2]} missing={bad[:3]}")
                if not l and site.startswith(BASE):
                    hc = await home_check(ctx, url); print('        lessons home:', hc)
                    if hc['missing'] or hc['extra'] or hc['dup'] or hc['bad'] or hc['heavy'] or hc['app'] != [hc['app'][0], './', './', 'standalone']: ok = False
                if site.startswith(BASE):
                    if errs or bad: ok = False
                    if l and (not info['calc'] or info['texLeft'] or (l != 'u1/l0' and (not info['assign'] or not info['assign'].startswith(BASE + '#/lesson/' + l.replace('/', ''))))): ok = False
        print('PASS' if ok else 'FAIL'); await b.close()
asyncio.run(main())
