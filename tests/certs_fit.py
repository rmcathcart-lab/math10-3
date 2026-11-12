"""Certification cards: every outcome's card, at every level, must keep its text and icon inside their places — the text
inside the card (and clear of the foil stripe and the seal), the icon inside its tile. Prints the problems found (none is
the pass), and with --sheet draws contact sheets of all 13 outcomes × 7 levels to /tmp/certs/: sheet_full_1.png and
sheet_full_2.png (the full card), sheet_mini.png (the small card in the home row, at 1× and 2×).
Needs the static server on 8841 (cd math10-3 && python3 -m http.server 8841)."""
import asyncio, sys
from playwright.async_api import async_playwright
JS = r"""() => {
  const C = HW.Certs, W = 172, out = [], host = document.createElement('div'); document.body.appendChild(host);
  for (const o of Object.keys(C.DESIGNS)) for (let t = 0; t < 7; t++) {
    host.innerHTML = C.svg(o, t, 344, 'Alexandria Montgomery-Smith'); const s = host.firstChild, T = C.TIERS[t];
    const lim = T.foil ? 149 - 1 : W - 4;   // the stripe starts at x 149
    C.fit(host);
    s.querySelectorAll('text').forEach(tx => {
      const b = tx.getBBox(), rot = tx.getAttribute('transform'); if (rot || tx.closest('g[transform]')) return;   // the stripe's own lettering, the icons' own
      const left = b.x, right = b.x + b.width, inHeader = b.y + b.height < 22;
      if (left < 3 || right > (inHeader ? W - 3 : lim) || b.y < 0 || b.y + b.height > 108) out.push([o, t, 'text "' + tx.textContent + '" at ' + left.toFixed(1) + '…' + right.toFixed(1) + ' (limit ' + lim + ')']);
    });
    const g = [...s.querySelectorAll('g[transform^="translate(11 29)"]')][0];
    if (g) { const b = g.getBBox(); if (b.x < -0.5 || b.y < -0.5 || b.x + b.width > 40.5 || b.y + b.height > 40.5) out.push([o, t, 'icon outside its tile: ' + [b.x, b.y, b.width, b.height].map(v => v.toFixed(1)).join(' ')]); }
  }
  host.remove(); return out;
}"""
SHEET = r"""([outs, size, cols]) => {
  const C = HW.Certs; document.body.innerHTML = ''; document.body.style.background = '#f5f3ee';
  const g = document.createElement('div'); g.id = 'g'; g.style.cssText = 'display:grid;grid-template-columns:40px repeat(7,' + size + 'px);gap:10px 12px;padding:12px;font:12px system-ui;align-items:center;width:max-content';
  g.innerHTML = '<div></div>' + C.TIERS.map(t => '<div style="font-weight:700;text-align:center">' + t.name + '</div>').join('');
  outs.forEach(o => { g.innerHTML += '<div style="font-weight:800">' + o + '</div>' + C.TIERS.map((t, k) => '<div style="filter:drop-shadow(0 2px 3px rgba(40,28,10,.3))">' + C.svg(o, k, size, 'Ava Brown') + '</div>').join(''); });
  document.body.appendChild(g); C.fit(g);
}"""
FONTS = '/home/claude/rmcathcart-lab/math10c/assets/outline/fonts/'
async def serve_font(pg):
    css = ''.join("@font-face{font-family:'Barlow Condensed';font-weight:%d;src:url(https://fonts.gstatic.com/local/bc%d.woff2) format('woff2')}" % (w, w) for w in (700, 800))
    await pg.route('**/fonts.googleapis.com/**', lambda r: r.fulfill(status=200, content_type='text/css', body=css))
    await pg.route('**/fonts.gstatic.com/local/bc*.woff2', lambda r: r.fulfill(status=200, content_type='font/woff2', body=open(FONTS + 'barlow-condensed-latin-%s-normal.woff2' % __import__('re').search(r'bc(\d+)\.woff2', r.request.url).group(1), 'rb').read()))
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width': 1900, 'height': 1000}, device_scale_factor=1); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.route('**/script.google.com/**', lambda r: r.abort())
        if '--nofont' not in sys.argv: await serve_font(pg)
        await pg.goto('http://localhost:8841/?class=none'); await pg.wait_for_timeout(1200)
        await pg.evaluate("document.fonts.load('800 100px \"Barlow Condensed\"')"); await pg.wait_for_timeout(300)
        r = await pg.evaluate(JS)
        for x in r: print('%-3s %d  %s' % tuple(x))
        print('%d problems' % len(r))
        if '--sheet' in sys.argv:
            outs = await pg.evaluate("Object.keys(HW.Certs.DESIGNS)")
            for n, part in ((1, outs[:7]), (2, outs[7:])):
                await pg.evaluate(SHEET, [part, 250, 7]); await pg.wait_for_timeout(400)
                await pg.locator('#g').screenshot(path='/tmp/certs/sheet_full_%d%s.png' % (n, '_nofont' if '--nofont' in sys.argv else ''))
            await pg.evaluate(SHEET, [outs, 62, 7]); await pg.wait_for_timeout(300)
            await pg.locator('#g').screenshot(path='/tmp/certs/sheet_mini.png')
            pg2 = await b.new_page(viewport={'width': 1200, 'height': 900}, device_scale_factor=2)
            if '--nofont' not in sys.argv: await serve_font(pg2)
            await pg2.goto('http://localhost:8841/?class=none'); await pg2.wait_for_timeout(1000)
            await pg2.evaluate(SHEET, [outs, 62, 7]); await pg2.wait_for_timeout(300)
            await pg2.locator('#g').screenshot(path='/tmp/certs/sheet_mini_2x.png')
            print('sheets in /tmp/certs/')
        print('errors', errs); await b.close()
        assert not errs
asyncio.run(main())
