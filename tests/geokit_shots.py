"""Screenshot check for js/geokit.js: a scratch page (built in memory, nothing written to the repo) with the Unit 5–7 practice
figures at iPad size, as the practice site shows them (assets/app.css, .fig-svg). Prints console/page errors and any
figure wider than its column; writes PNGs to the out folder. LOOK at them: labels clear of lines, both protractor scales
legible; opp/adj/hyp tags clear of the lengths; ? in red on the unknown; no label on a dimension arrow.
  python3 tests/geokit_shots.py [--out /tmp/geokit_shots]
Needs the static server for the repo root on 8841 (python3 -m http.server 8841)."""
import asyncio, os, sys
from playwright.async_api import async_playwright
BASE = 'http://localhost:8841/'
OUT = sys.argv[sys.argv.index('--out') + 1] if '--out' in sys.argv else '/tmp/geokit_shots'
os.makedirs(OUT, exist_ok=True)
FIGS = [
    ('Protractor, inner scale, turned 25°', "HW.geo.protractorSVG({ angle: 65, rot: 25, scale: 'inner', names: ['A', 'B', 'C'] })"),
    ('Protractor, outer scale, turned 200° (upside down)', "HW.geo.protractorSVG({ angle: 128, rot: 200, scale: 'outer' })"),
    ('Protractor, neither arm on 0 (subtract)', "HW.geo.protractorSVG({ angle: 47, rot: 0, scale: 'none', offset: 30 })"),
    ('Protractor solution: outer scale highlighted', "HW.geo.protractorSVG({ angle: 142, rot: -15, scale: 'outer', highlight: 'outer', names: ['P', 'Q', 'R'] })"),
    ('Angles: reflex with names; rays on a line', "HW.geo.angleSVG({ a1: 30, a2: 140, reflex: true, label: true, names: ['A', 'B', 'C'] }) + HW.geo.angleSVG({ rays: [{ dir: 0, name: 'A' }, { dir: 180, name: 'C' }, { dir: 63, name: 'D' }], arcs: [{ a: 0, b: 63, label: '63°' }, { a: 63, b: 180, label: 'x' }], vertexName: 'B' })"),
    ('Transversal: parallel, numbered; values; not parallel with a pair', "HW.geo.transversalSVG({}) + HW.geo.transversalSVG({ angles: { 1: 118, 6: 'x', 7: '(2x + 10)°' }, numbers: false }) + HW.geo.transversalSVG({ parallel: false, tilt: 70, highlight: [4, 6] })"),
    ('Bearings on a map; polygon angle sum', "HW.geo.compassSVG({ origin: 'A', points: [{ name: 'B', bearing: 65, dist: 120 }, { name: 'C', bearing: 200, dist: 90, from: 'B' }], arcs: [{ from: 0, to: 65, label: true }], northAt: ['B'] }) + HW.geo.polygonSVG({ n: 6, angles: [120, 120, 'x', 120, 120, 120], diagonals: true, shade: true, names: 'ABCDEF'.split('') })"),
    # Units 6–7
    ('Similar: trapezoid k = 1.5 with names and lengths; image turned 90° (match the order)', "HW.geo.similarSVG({ shape: 'trap', k: 1.5, names: ['ABCD', 'PQRS'], labels: true, units: 'cm' }) + HW.geo.similarSVG({ shape: 'tri', k: 2, names: ['ABC', 'DEF'], labels: [['4 m', '3.6 m', '?'], ['8 m', 'x', '6.4 m']], rot: 90, angles: [[ '72°', '', '' ], ['', '', '']] })"),
    ('Similar: matching colours and angles (solution look); a reduction', "HW.geo.similarSVG({ shape: 'pent', k: 0.5, labels: true, matchColors: true, angles: true, names: ['ABCDE', 'VWXYZ'] }) + HW.geo.similarSVG({ shape: 'L', k: 2, labels: true, units: 'cm', matchColors: true })"),
    ('Right triangles: θ at A with opp/adj/hyp; turned 30°, unknown side; long tags, θ at B', "HW.geo.rightTriSVG({ a: 7, b: 10, theta: 'A', thetaLabel: '35°', roles: true, sides: { b: '10 cm', a: 'x' } }) + HW.geo.rightTriSVG({ a: 5, b: 12, rot: 30, sides: { a: '5 m', b: '12 m' }, unknown: 'c' }) + HW.geo.rightTriSVG({ a: 4, b: 9, right: 'bl', theta: 'B', roles: true, long: true, sides: { c: '15 ft' }, unknown: 'A' })"),
    ('Right triangles: flipped + upside down, angle unknown; Pythagoras squares', "HW.geo.rightTriSVG({ a: 8, b: 6, right: 'tl', flip: true, sides: { a: '8.2 m', c: '11.5 m' }, unknown: 'B', names: ['P', 'Q', 'R'] }) + HW.geo.rightTriSVG({ a: 3, b: 4, squares: true, sides: true, names: false })"),
    ('Elevation (tree, eye height) and depression (cliff, equal angle at the boat)', "HW.geo.elevationSVG({ angle: 38, dist: 25, eye: 1.6, labels: { height: 'h' } }) + HW.geo.elevationSVG({ kind: 'depression', angle: 14, dist: 120, labels: { dist: 'd', height: '30 m' }, alt: true })"),
    ('Elevation: building, ground level; depression from a lighthouse', "HW.geo.elevationSVG({ angle: 52, dist: 40, eye: 0, observer: 'none', target: 'building', labels: { height: '?' } }) + HW.geo.elevationSVG({ kind: 'depression', observer: 'lighthouse', angle: 9, dist: 250, labels: { angle: 'θ', dist: '250 m' } })"),
    ('Shadows (person and tower); mirror method', "HW.geo.shadowSVG({ small: { h: 1.8, shadow: 2.4 }, big: { shadow: 18, kind: 'tower', label: { h: '?' } }, sunLabel: 'θ' }) + HW.geo.mirrorSVG({ eye: 1.6, d1: 2.1, d2: 12.5, labels: { h: 'h' } })"),
    ('Grid with a shape and its image (k = 2); a map with a bar scale', "HW.geo.gridSVG({ shape: 'L', k: 2, cols: 18, rows: 9, names: ['ABCDEF', 'PQRSTU'] }) + HW.geo.scaleMapSVG({ scale: '1 cm : 5 km', places: [{ name: 'Calgary', at: [2, 2] }, { name: 'Airdrie', at: [4.5, 4.5] }, { name: 'Cochrane', at: [7.5, 4] }], routes: [{ from: 'Calgary', to: 'Airdrie', label: '4.2 cm' }, { from: 'Airdrie', to: 'Cochrane', label: 'x', dash: '5 4' }] })"),
]
PAGE = """<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="%(b)sassets/katex/katex.min.css"><link rel="stylesheet" href="%(b)sassets/app.css">
<style>body{background:#f4f1ea;margin:0;padding:16px} .q{background:#fff;border-radius:14px;padding:12px 16px;margin:0 0 14px;max-width:760px}
.q h3{font:600 15px system-ui;margin:0 0 6px;color:#555} .row{display:flex;gap:12px;align-items:center;flex-wrap:wrap} .row .fig-svg{flex:1 1 0;min-width:0}</style>
<script charset="utf-8" src="%(b)sjs/ns.js"></script><script charset="utf-8" src="%(b)sassets/katex/katex.min.js"></script>
%(scripts)s
</head><body><div id="app"></div></body></html>""" % {'b': BASE, 'scripts': ''.join('<script charset="utf-8" src="%sjs/%s"></script>' % (BASE, f) for f in ['core.js', 'expr.js', 'kit.js', 'kitx.js', 'geom.js', 'geokit.js'])}

async def main():
    errs = []
    async with async_playwright() as p:
        b = await p.chromium.launch()
        ctx = await b.new_context(viewport={'width': 820, 'height': 1180}, device_scale_factor=2)   # iPad portrait
        pg = await ctx.new_page()
        pg.on('pageerror', lambda e: errs.append('PAGEERR ' + str(e)))
        pg.on('console', lambda m: errs.append('CONSOLE ' + m.text) if m.type == 'error' else None)
        await pg.goto(BASE + 'README.md')   # any same-origin page, then replace it
        await pg.set_content(PAGE, wait_until='load')
        await pg.wait_for_function('window.HW && HW.geo && HW.geo.protractorSVG')
        for i, (title, code) in enumerate(FIGS):
            await pg.evaluate("""([i, title, code]) => { const d = document.createElement('div'); d.className = 'q'; d.id = 'q' + i;
                d.innerHTML = '<h3>' + title + '</h3><div class="row">' + eval(code) + '</div>'; document.getElementById('app').appendChild(d); }""", [i, title, code])
        wide = await pg.evaluate("""() => [...document.querySelectorAll('.fig-svg')].filter((s) => s.getBoundingClientRect().width > s.closest('.q').clientWidth).length""")
        if wide: errs.append(f'{wide} figure(s) wider than the column')
        for i in range(len(FIGS)):
            await pg.locator('#q%d' % i).screenshot(path=os.path.join(OUT, 'geokit_%d.png' % i))
        await b.close()
    print('\n'.join(errs) if errs else 'no problems', '·', len(FIGS), 'shots in', OUT)

asyncio.run(main())
