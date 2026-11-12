# Building blocks — `js/blocks.js`

Reusable pieces for lesson pages: graphs, number lines, tables, mapping diagrams, flowcharts, triangles, stamps,
and auto-wired page widgets. Styles are in `css/blocks.css` (already loaded on every page through `site.css`).
Live demo + test bed: `lessons/dev/blocks.html` (source `js/dev/blocks-demo.js`) — copy from it.

```js
import { Graph, NumberLine, ValueTable, MappingDiagram, Flowchart, RightTriangle, stamp, stampIn, checkCard,
  mountExplainers, h, tex, add, box, pop, fadeIn, sleep, tween, pairTex, texNum } from '../blocks.js';
```

## Rules of the road
- **Constructors** take `(host, opts)`. In an explainer `host` is the `stage`; give `x`, `y` (px) to place the block
  (every stage child is absolutely positioned). On a card, omit `x`/`y` and the block sits in the flow
  (wrap figures in `<div class="bk-row">` or `<div class="bk-fig">`).
- **Creating returns the element now; animating takes `c` first and returns a Promise.**
  `const s = G.segment(a, b); await G.drawIn(s, 600, c);` Without `c` everything is instant, so the same calls draw static
  figures. `liveCtx()` gives a never-cancelling `c` for animating from a button outside an explainer.
- All animation goes through `c.anim` / `c.check`, so **Back, Start over and a Next click mid-animation just work**
  (the steps replay with `c.fast`, which skips straight to the final state). Don't use `setTimeout` in steps.
- **Captions are evaluated before their step runs.** A `cap: () => …` that prints a computed value must use values
  worked out in `make()` (e.g. `const r = G.intersect(f, g, 4)` in `make`), not in that step's `run`.
- Colours: `'teal' 'brand' 'amber' 'orange' 'red' 'blue' 'green' 'purple' 'ink' 'slate' 'gray'` or any CSS colour.
- Every block exposes `el` (root), `svg`, `html` (overlay for HTML/KaTeX labels), named layers and its transform.
- Interactive bits are `<button>`s or carry `data-tap`, so a Pencil stroke starting on them presses instead of inking.

## Graph
```js
const G = new Graph(stage, { x: 14, y: 14, width: 440, height: 440, xmin: -8, xmax: 8, ymin: -8, ymax: 8 });
```
Options (defaults): `width 440, height 440, xmin/xmax/ymin/ymax ±10, xstep 1, ystep 1` (grid; `xscl/yscl` aliases),
`xlabels/ylabels` (number step, auto), `xtitle 'x', ytitle 'y'` (TeX, `''` hides), `arrows true, grid true, axes true,
numbers true, ticks false, origin false` (label 0), `major 0` (darker line every n steps), `pad` (px or `[t,r,b,l]`; auto
leaves room for numbers when the window starts at 0), `fontSize 17, fnArrows true, color` (default curve colour),
`theme: 'calc'` (calculator screen: bezel, no grid/numbers, ticks, blue curves, readout); like a real TI-84 it draws no axis when 0 is outside the window, `interactive` (see below).

| Draw (graph coords; returns the element) | Notes |
|---|---|
| `point(x, y, {label, coords, pos, open, color, r, tex})` | `coords:true` labels it `(x, y)`; `pos` = `'ne' 'n' 'e' 'se' 's' 'sw' 'w' 'nw' 'c'`; `el.label` |
| `segment(a, b, {openA, openB, closedA, closedB, ends, color, width, dash})` | `a`,`b` are `[x, y]`; `ends: ['closed', 'open']` |
| `line(a, b, {arrows})` / `line({m, b})` / `line({x: 3})` | whole line clipped to the window, arrows at the edges |
| `ray(a, through, {start: 'closed'\|'open'\|null})` | |
| `fn(f, {from, to, ends, arrows, color, width, dash, samples, breaks})` | `f` is a function or `'x^2-4'`; breaks at asymptotes and leaves/re-enters the window cleanly; arrows where it leaves |
| `polyline(pts, {closed, fill, fillOpacity, ends})` | regions, step graphs, custom shapes |
| `label(x, y, html, {pos, tex, cls, color, dx, dy})` | HTML/KaTeX at a graph point (`cls: 'bk-ptlab'` = white halo, `'bk-pill'`) |
| `shadeX(a, b, {openA, openB, band, color, offset})` / `shadeY(…)` | domain/range "shadow" on the axis; `±Infinity` → arrow; `band` shades the strip |
| `vline(x)` / `hline(y)` (dashed; `.set(v)` moves it) · `guides(x, y)` | dashed drop lines to both axes |

Animate: `drawIn(el, ms, c)` (strokes draw along their length — dashes stay dashed — then end dots/arrows pop),
`reveal(el, c)` (draws a curve / pops a point + label / fades anything else), `move(c, pt, x, y, ms)`, `moveTo(pt, x, y)`,
`remove(...els)`, `clear()`, `redraw()`.
`await G.vlineTest(c, {hits: x => [y…] | points: [[x,y]…], from, to, ms, minGap, snap})` sweeps a vertical line, stops
at the first clear double crossing (at a tidy x when one is close) → `{ line, dots, fail: {x, ys} | null }`.

Calculator: `setWindow({xmin, xmax, ymin, ymax, xscl, yscl}, c, ms)` (animated zoom), `zero(f, a, b)` → x | null,
`intersect(f, g, guess)` → `{x, y}` | null, `extremum(f, a, b, {max})` → `{x, y}`, `readout('Intersection', {x, y}, {pos:'bl'})`
(`readout(null)` hides), `traceMarker(f, x, {title})` → `{x, y, set(x), move(c, x, ms), remove()}`.
The solvers are also plain exports (`zero, intersect, extremum, compile`).

Transforms & layers: `toPx(x, y)`, `fromPx(px, py)`, `fromEvent(e)`, `ux`/`uy` (px per unit), `inside(x, y)`, `win`,
`layers.bg | grid | axes | data` (clipped to the window) `| top`, `svg`, `html`, `el`.

Tap to plot: `interactive: { snap: 1, max, coords: true, color, onChange(pts) }` — tap the grid to add, drag to move, tap a
point to remove (finger and Pencil; the rest of the card still inks). `G.points()` → `[[x, y]…]`.

```js
// static: on a card
const G = new Graph(document.getElementById('fig1'), { width: 360, height: 360, xmin: -6, xmax: 6, ymin: -6, ymax: 6 });
G.segment([-4, -2], [3, 4], { closedA: true, openB: true }); G.shadeX(-4, 3, { openB: true }); G.shadeY(-2, 4, { openB: true });
// explainer step
{ cap: `<b>Domain:</b> squash the graph onto the x-axis.`, run: (c) => G.drawIn(G.shadeX(-6, 4, { openB: true, band: true }), 800, c) },
{ cap: `Slide a vertical line across…`, run: async (c) => { res = await G.vlineTest(c, { hits: (x) => [x * x / 2 - 3] }); } },
```

## NumberLine
`new NumberLine(host, {x, y, width 640, height 100, min -5, max 5, step 1, labelStep, minor, arrows, axisY, labels, numbers})`
— `labels`: `v => html` or `[{v, html}]` (KaTeX welcome). Methods: `toPx(v)`, `point(v, {open, color, label, lift})`,
`interval(a, b, {openA, openB, color, lift})` (±Infinity → arrow), `mark(v, html, {pos: 'n'|'s'})`,
`await hop(c, a, b, {label, below, height, color})` (static when `c` is null), `drawIn(el, ms, c)`, `clear()`.
```js
const N = new NumberLine(stage, { x: 20, y: 10, width: ex.W - 40, height: 150, min: -8, max: 8 });
{ cap: 'Add 5: hop right.', run: (c) => N.hop(c, -3, 2, { label: '+5' }) },
{ cap: `${tex('x<-4')}`, run: (c) => N.drawIn(N.interval(-Infinity, -4, { openB: true, color: 'purple' }), 700, c) },
```

## ValueTable
`new ValueTable(host, {x, y, headers: ['x','y'], rows: [[-2,-3], …], layout: 'v'|'h', cellW 96, cellH 52, tex true,
hide, tap true, q '?', diffs, diffSpace 96})` — `hide`: a column index or header (`1`, `'y'`), `[[r, c]…]` or `(r, c) => bool`;
hidden cells show `?` and reveal on tap. Numbers/strings are typeset with KaTeX (`{html: '…'}` for raw HTML).
Note: a function `hide` also applies to rows added later with `addRow`.
Methods: `cell(r, c)`, `reveal(r, c, cx)`, `hide(r, c)`, `set(r, c, v, cx)`, `fill(cx, {col, stagger})` (reveal a column
top to bottom), `highlight(r, on)`, `highlightCol(c, on)`, `addRow(vals, cx)`, `await diffs(cx, {col, labels, color})`
(curved arrows with +3, +3 … between rows; returns the differences), `clearDiffs()`. `el`, `grid`, `svg`, `html`.
```js
const tb = new ValueTable(stage, { x: 30, y: 60, rows: xs.map((x) => [x, 2 * x + 1]), hide: 1, tap: false, diffs: true });
{ cap: 'Fill the y column.', run: (c) => tb.fill(c) }, { cap: 'Always +2.', run: (c) => tb.diffs(c) },
```

## MappingDiagram
`new MappingDiagram(host, {x, y, width 440, height 300, domain: [1,2,3], range: [4,5], pairs: [[1,4],[2,5],[3,5]],
titles: ['Domain','Range'], arrows: true, tex: true, color})` — `arrows: false` starts without arrows.
Methods: `item('d'|'r', v)`, `arrow(i)`, `await drawArrow(c, i)`, `await drawArrows(c, {stagger})`,
`highlight(side, v, on, cls)`, `await oneToMany(c)` (reds and shakes inputs with 2+ arrows; returns them), `ovals`, `svg`.

## Flowchart
```js
const F = new Flowchart(stage, { x: 140, y: 4, width: 680, height: 330,
  nodes: { start: { x: 340, y: 40, w: 320, h: 54, html: '<b>Is it a function?</b>', cls: 'bk-round' },
           graph: { x: 115, y: 150, w: 190, h: 62, html: '<b>Graph</b>vertical line test', color: 'blue' }, … },
  edges: [{ from: 'start', to: 'graph', label: 'graph' }, { from: 'graph', to: 'g2', label: 'twice', route: 'vhv' }, …] });
{ cap: '…', run: (c) => F.light(c, ['start', 'graph', 'g2']) }   // or step by step: F.go(c, a, b); F.visit(c, b)
```
Nodes: centre `x, y`, size `w, h`, `html` (first `<b>` is a heading line), `color`, `cls` (`bk-round`, `bk-diamond`,
`bk-dashed`). Edges: `route: 'straight'` (default) `| 'vh' | 'hv' | 'vhv'`, or explicit `pts: [[x,y]…]`; `label`, `labelAt`,
`dash`, `id`. Methods: `node(id)`, `edge(from, to)`, `visit(c, id)`, `go(c, from, to)`, `light(c, path)`, `fade()` (current
path → "earlier" teal, for a second pass), `reset()`.

## RightTriangle & shapes
`new RightTriangle(host, {x, y, width 420, height 300, base 4, rise 3, right: 'bl'|'br'|'tl'|'tr', names: {right:'C',
base:'A', top:'B'}, sides: {a:'3', b:'4', c:'5'}, angles: {A:'\\theta'}, pad 46})` (side `a` is opposite `A`).
Methods: `vertex('A')` → px, `side('a')`, `angle('B', '\\alpha', {color})`, `await highlight(c, 'A', {long})` (opp red, adj
blue, hyp teal, with tags), `clearHighlight()`. Helpers for any SVG: `angleArc(svg, V, P, Q, r)`, `rightMark(svg, V, P, Q)`,
`arrowHead(svg, x, y, dx, dy, {color, width})`, `svgEl(tag, attrs, parent)`.

## Stamps & checks
`stamp(host, text, {ok: true|false|null, x, y, rotate, size: 'sm'|'lg'})` → element (✓/✗ by default); `await stampIn(c, el)`.
`checkCard(host, {at: 'x=2', left: {tex, sub, f}, right: {tex, sub, f}, values: {x: 2}, x, y, width, hidden})` — or `left/right`
as arrays of TeX lines and `ok` yourself. Static shows everything; with `hidden: true`, `await card.play(c)` reveals it row by row.
```js
const k = checkCard(stage, { at: 'x=2', left: { tex: '(2x+3)(x-1)', sub: '(7)(1)', f: ({ x }) => (2*x+3)*(x-1) },
  right: { tex: '2x^2+x-3', sub: '8+2-3', f: ({ x }) => 2*x*x+x-3 }, values: { x: 2 }, x: 30, y: 16, width: 520, hidden: true });
{ cap: 'Both sides with x = 2.', run: (c) => k.play(c) }
```

## Helpers
`mountExplainers({ name: def, … })` mounts every `[data-explainer]`. `h(tag, cls, html)`, `add(host, el, x, y)`, `at`, `box(el, w, h)`,
`fit(el, maxW)`, `tex`, `texNum(v)`, `pairTex(x, y)`, `num(v)` (real minus), `calcNum(v)`; animation: `anim(c, el, keyframes, ms)`,
`tween(c, ms, t => …)` (frame-by-frame; return `false` to stop), `pop`, `fadeIn`, `appear`, `pulse`, `shake`, `sleep(c, ms)`, `liveCtx()`.

## Auto-wired page widgets (markup only — `boot()` calls `wireBlocks()`)
Call `wireBlocks(el)` yourself after injecting markup later; it skips anything already wired.
```html
<!-- multiple choice: letters added for you; columns fit the content (or data-cols="2"); data-pick = tap to mark the class's pick -->
<div class="part"><div class="pl">(a) Which is a function?</div>
  <div class="bk-mc" data-answer="C"><div><span class="tex">x=y^2</span></div><div>…</div><div>…</div><div>…</div></div>
  <div class="work" style="--h:110px"></div>
  <div class="ansrow"><button class="reveal">Answer</button><div class="ans"><b>C</b> — the reason.</div></div></div>
<!-- numerical response: 4 boxes, digits appear left to right with the part's answer (inner text = prompt, optional) -->
<div class="bk-nr" data-value="3.5"></div>      <div class="bk-nr" data-value="1440">Record the minutes in a day.</div>
<!-- guess-first poll (existing .poll look): tap an .opt to mark the guess; the button reveals .right and .poll-ans -->
<div class="poll"> … <div class="poll-opts"><div class="opt"><b>A</b> …</div><div class="opt right"><b>B</b> …</div></div>
  <button class="pill" data-poll-reveal>Reveal</button><div class="poll-ans">…</div></div>
<!-- tap to reveal: shows "?" (or the attribute's text) until tapped or the .part is shown -->
gives <span data-reveal><span class="tex">7</span></span>
<!-- flip cards (a grid of them: .bk-flips with --bk-cols) -->
<div class="bk-flips" style="--bk-cols:3"><div class="bk-flip"><div class="bk-front">Domain</div><div class="bk-back">all inputs</div></div></div>
<!-- warm-up question with its own Answer toggle -->
<div class="bk-wq"><div class="q-line">…</div><button class="pill small" data-bk-toggle>Answer</button><div class="bk-ans">…</div></div>
<!-- figures with no JS: each item is { method: [args…] } (functions as strings: "x^2-4", "sqrt(x+4)") -->
<div data-bk-graph='{"width":300,"height":300,"xmin":-5,"xmax":5,"ymin":-5,"ymax":5,"items":[{"fn":["-x^2+4"]},{"point":[0,4,{"label":"vertex"}]}]}'></div>
<div data-bk-numberline='{"min":-4,"max":6,"items":[{"interval":[-2,3,{"openB":true}]}]}'></div>
<div data-bk-table='{"rows":[[0,1],[1,4],[2,7]],"layout":"h","diffs":true}'></div>
```
••• Show all answers also opens `.bk-wq` answers, wired polls and `[data-reveal]`s. (Older pages keep their own
`.mc/.mo`, `.nr-b`, `data-poll`, `data-wq` code; the new widgets use different names so nothing double-wires.)

## Customizing
- **Draw your own things on any block.** Use its layers and transform:
  ```js
  const [x0, y0] = G.toPx(-1, 0), [x1, y1] = G.toPx(4, 5);
  svgEl('rect', { x: x0, y: y1, width: x1 - x0, height: y0 - y1, fill: '#1f5bd6', 'fill-opacity': .08 }, G.layers.bg);
  add(G.html, h('div', 'my-callout', 'look here'), ...G.toPx(2, 3));   // HTML/KaTeX on top, in graph position
  ```
  `G.curve(compute, opts, cls, G.layers.data)` makes your own stroke that redraws on `setWindow`: `compute()` returns
  `{ subs: [[[px,py]…]], ends: [{p, d, s: 'arrow'|'open'|'closed', k}] }`. `G.track(el, draw)` keeps any element in sync.
- **Compose or subclass**: blocks are plain classes (`class SlopeGraph extends Graph { rise(c, …) { … } }`), and several
  can share a stage (a `ValueTable` beside a `Graph`, a `NumberLine` under it). Restyle per lesson with `cls` and your
  lesson CSS (`.u5l2 .bk-fc-node { … }`); colours and sizes are options.
- **Fully custom visuals are welcome.** The blocks are a head start, not a template: when a concept needs its own
  picture (tiles, a factor tree, a sieve, a story animation), write it by hand with `h`, `svgEl`, `c.anim` as before —
  mixing in a block wherever it saves time. Variety and the number of animations per lesson should not drop.

Explainer tip: the stage height is `ex.def.height` (there is no `ex.H`); width is `ex.W`.
MC options: everything after the letter is wrapped in `.bk-otxt` automatically, so words and math flow on one line.
Rotating/sliding SVG groups: blocks.css gives `g` `transform-box: fill-box; transform-origin: center`; to rotate about a
point with `rotate(θ cx cy)` set `style.transformBox = 'view-box'; style.transformOrigin = '0 0'` on that group.

## Geometry toolkit (Unit 5) — `js/geo.js`
`import { Geo } from '../geo.js';` (it imports blocks.js and injects its own `geo-` styles). Demo + test bed:
`dev/geo.html` (source `js/dev/geo-demo.js`). Same rules as above: `(host, opts)`; host = an `<svg>`/`<g>` (drawn into)
or an HTML element/stage (a sized box is made; `x`, `y` place it); animating methods take `c` first; no `c` = static.
**Directions and angles are math degrees** (0 = right, counterclockwise; 90 = up); positions are SVG px (y down).
Bearings are true bearings. Everything draggable carries `data-tap` (no ink, no tap-to-Next) and works with finger,
Pencil and mouse under lesson scaling and pinch zoom (screen-matrix coordinates, drags measured from their start).

| Call | What you get |
|---|---|
| `Geo.protractor(host, {width 640, height 430, r 200, cx, cy, rot, angle: {vertex, a1, a2, names}, snap, readout, buttons, whichScale, hidden})` | draggable protractor (drag the body; turn with the round handles under the base), outer scale 0 on the LEFT, inner grey 0 on the RIGHT. Live 3-step readout; buttons Show me / Which scale? / Hide the reading / New angle / Snap (`buttons: false` or a list). API: `moveTo(c, {cx, cy, rot})`, `alignTo(arm, 'inner'\|'outer'\|'auto')` → pose, `place(c)`, `reading()` → `{centred, zero, value}`, `showScale('outer'\|'inner'\|'auto'\|null)`, `hide(on)`, `setAngle({...})`, `newAngle()` |
| `Geo.angle(host, {vertex, a1, a2, len, label, arc, reflex, r, right, fill, names: ['A','B','C'], color})` | arms + arc (square when 90°) + label (`true` = measure); reflex arc in red. `→ {measure, start, span, mid, arms, arc, label, drawIn(c)}` |
| `Geo.transversal(host, {w 560, h 340, parallel, tilt (= angle 2), skew, angles: {1: 70, 6: 'x'}, numbers, marks, names, highlight: [1, 5]})` | the booklet diagram: 1–4 at the top crossing, 5–8 at the bottom, each clockwise from upper-left; `>` marks when parallel. `highlight(c, [a, b], {shape, name})` (wedges + F/Z/C/X shape + name tag), `clearHighlight()`, `slide(c, k)` (copy of angle k slides to the other crossing), `measure(k)`, `setLabel(k, s)`, `corner(k)` |
| `Geo.compassRose(host, {width 360, r, points 4\|8\|16, degrees, bearing})` | rose with N arrow; `turn(c, b)` sweeps the bearing ray clockwise from north (label counts up, 3 digits), `back(c)` dashed back bearing, `add(b, {color})`, `set(b)` |
| `Geo.construct(host, steps, {width, height})` | compass-and-straightedge animation (compass tool sweeps light arcs; a ruler slides in for lines). `.steps` = explainer steps (`return K.steps`). Presets: `Geo.construct.bisect({vertex, a1, a2})`, `.copy({from: {vertex, a1, a2}, to: {vertex, dir}})`, `.perpBisector({a, b})`, `.perpAt({a, b, p})`, `.perpFrom({a, b, p})`. Ops for your own: `arc, line, point, angle, right, ticks, text, fn`; `given: true` steps are the starting picture |
| `Geo.tangram(host, {unit 50, labels: 'area'\|'name', layout: 'scatter'\|'square'\|{…}, target: [[x,y]…], onChange})` | 7 pieces (`L1 L2 M S1 S2 SQ PA`): drag, **tap = turn 45°, double-tap = flip**, corners snap to other pieces and the grid. `solve(c)`, `scatter(c)`, `arrange(c, layout)`, `reset()`, `state()` |
| `Geo.pentomino(host, {cell 36, letters 'FILNPTUVWXYZ' (repeats ok), board: {cols, rows, at}, onChange})` | pentominoes on a grid: drag, tap = 90°, double-tap = flip, snap to cells; `state().extra = {covered, cells, filled}`; `cellsOf(id)` |
Also `Geo.PAIRS`, `PAIR_NAMES`, `pairName(a, b)`, `bearingText(45)` → `"045"`, `at(V, deg, r)`, `dirTo(V, Q)`, `arcD`, `text`, `ray`.
Give an explainer whose picture is a protractor or puzzle `tap: false`. Practice-site figures and checkers with the same
numbering and look are in `../js/geokit.js` (`HW.geo`).

## Geometry toolkit (Units 6–7) — `js/geo.js`
Same import, same rules as Unit 5 (`(host, opts)`, `c` first, no `c` = static, math degrees, draggables carry `data-tap`).
Demo: `dev/geo.html` sections 9–16. **Shapes for `similar` / `gridDraw` are in grid units, math coordinates (y up)**; world
pictures (`elevation`, `shadow`, `mirror`) are in metres (y up), scaled to fit. Conventions from the book brief: similar figures
named in matching order (`names: ['ABCD', 'PQRS']`), **k = new ÷ original**; right triangle ABC with the **right angle at C**,
side a opposite A, b opposite B, c = hypotenuse; opp/adj/hyp relative to θ (opp red, adj blue, hyp brown — `Geo.ROLE_COLORS`).
HTML hosts get a wrapper: the figure box plus a `.geo-panel` under it (ratio chips, readouts, tables, buttons).

| Call | What you get |
|---|---|
| `Geo.similar(host, {shape, pts, k 2, mode: 'side'\|'centre', centre, names, labels true\|[[orig…],[image…]], units, angles, matchColors true, ratios, image true, grid})` | original + image (side by side, or projected from a point O with dashed rays); matching sides/angles in the same colour. `grow(c)` (the image grows out of a copy; start with `image: false`), `showRatios(c)` (chips "PQ ÷ AB = 7.5 ÷ 5 = 1.5"), `hideRatios()`, `highlight(c, i)` (side pair i), `setK(k)`, `showImage(on)`, `ratios`, `lens`. Shapes: `tri right iso rect square L trap para kite house pent arrow` (`Geo.SHAPES`) |
| `Geo.gridDraw(host, {cols 20, rows 12, cell 32, shape\|pts, at: [col,row], k 2 (null = any k), imageAt, names, buttons, onCheck})` | students tap grid points to draw the image (tap the first corner to close, the last to undo); **Check** compares with k (same orientation; reports a wrong k, a flipped k, "added instead of multiplied", count of right sides, wrong sides in red); Show me, Undo, Clear. API `check()` → `{ok, code, msg, k, bad}`, `set(pts, closed)`, `points()`, `show(c)`, `clear()`. Pure checker: `Geo.similarOnGrid(drawn, pts, k)` |
| `Geo.scaleBar(host, {scale: '1 cm : 2 m'\|'1:50 000'\|{draw, real, units}, segments 4, cmPx 40})` | alternating bar scale with its "1 cm represents 2 m" title. `Geo.parseScale(s)` → `{draw, drawUnit, real, realUnit, ratio, perCm, text, toReal(cm), toDraw(real)}` |
| `Geo.mapTape(host, {width, height, scale, cmPx 40, a, b, places: [{name, at}], map: (g, W, H) => …, grid, bar, dp 1})` | a map (your own drawing, 1-cm grid, places) with a measuring tape: drag the two round ends (they snap to places); the readout gives "Drawing: 4.9 cm → real: 4.9 × 5 km = 24.5 km". `reading()`, `set(a, b)`, `moveTo(c, a, b)` |
| `Geo.rightTri(host, {a, b, c (any two), right 'br'\|'bl'\|'tr'\|'tl', rot, flip, names, sides: {a: '3', c: '?'}\|true, theta 'A'\|'B', thetaLabel 'θ', angles: {A: '35°'}, show ['opp','adj','hyp'], long, labels: {opp, adj, hyp}, squares false\|true\|'grid', roomForSquares})` | right triangle, true proportions, right-angle square at C; with θ the sides take role colours and **opp/adj/hyp tags sit beyond the length labels** (inside when squares are on). `setTheta(c, 'B')` (tags glide to their new sides, θ arc moves), `highlight(c, 'opp'\|'a')`, `showSquares(c, 'grid')` (squares outward, unit grid when the side is whole; the length moves into the square: "3² = 9"), `roles()`, `V`, `sides` |
| `Geo.pythagProof(host, {a 3, b 4})` | two (a + b) squares with four copies of the triangle: c² left; `play(c)` slides three triangles in the right copy to leave a² and b². `reset()` |
| `Geo.similarRights(host, {theta 35, sizes [3,5,7], by 'adj'\|'hyp', ratios ['opp/adj','opp/hyp','adj/hyp'], slider true, calc true, reveal: [], dp 1, rdp 2})` | nested right triangles sharing θ + a live table (opp, adj, hyp, each ratio; a "calculator (DEG)" row). Slider changes θ. `grow(c)` (triangles and rows one by one), `highlightCol(c, 'opp/adj')`, `name(c, 'opp/adj')` (heading becomes "= tan θ"), `set(θ)`, `values()` |
| `Geo.elevation(host, {kind 'elevation'\|'depression', angle, dist, height, eye 1.6, observer, target, labels: {angle, dist, height, eye, sight, alt}, alt, units 'm'})` | horizontal (dashed, labelled) from the eye, line of sight, angle arc, right angle, eye height and the part above eye level as dimension lines. Targets: tree building tower flag pole elevator plane; depression: observer cliff/lighthouse/building/plane, target boat/person/car, `alt: true` marks the equal angle of elevation at the target. `drawIn(c)`, `setAngle(c, deg)`, `showAlt(c)`, `parts` |
| `Geo.clinometer(host, {angle 30, scale 'protractor'\|'direct', interactive, sight, readout})` | protractor + straw + weighted string: drag to tilt, the string stays vertical; readout "string crosses 60° → angle of elevation = 90° − 60° = 30°" (`'direct'` scale reads the angle itself). `set(deg)`, `tiltTo(c, deg)`, `reading()` |
| `Geo.shadow(host, {small: {h, shadow, kind, label: {h, s}}, big: {h, shadow, kind, label}, sunLabel, split})` | parallel sun rays, two objects and shadows, the two right triangles shaded; two panels when the heights differ a lot. `play(c)` (rays, shadows, triangles), `highlight(c)` |
| `Geo.mirror(host, {eye 1.6, d1, d2, h, kind, labels: {eye, d1, d2, h}, angleLabel})` | eye – mirror – top of the object, equal angles at the mirror, two similar triangles. `play(c)` |
Also `Geo.rightSides({a, c})` → `{a, b, c, A, B}`, `Geo.rolesFor('A')` → `{opp: 'a', adj: 'b', hyp: 'c'}`, `Geo.fmtLen(v, dp)`, `Geo.MATCH_COLORS`.

**Practice site (`js/geokit.js`, `HW.geo`), same conventions, static SVG strings:** `similarSVG({shape|pts, k, drawK, names, labels,
units, angles, matchColors, rot, flip})`, `rightTriSVG({a, b, c | A + a side, right, rot (any), flip, names, sides, angles, theta,
roles, long, unknown: 'a'|'b'|'c'|'A'|'B' (red ?), squares})`, `elevationSVG`, `shadowSVG`, `mirrorSVG`, `gridSVG({shape, k, image})`,
`scaleMapSVG({scale, w, h, places, routes})`, `parseScale`. Checkers: `lenChk(v, {dp 1, trig: {fn, deg, side, op: 'mul'|'div'},
pyth: {legs: [a, b]} | {hyp, leg}, scale: {len, k, op}, prop: {given, num, den}, alts, radTrap})` — **describe the set-up and the
traps come for free**: RAD mode ("Press DRG until DEG shows"), × vs ÷, the wrong ratio, ratio ÷ side, rounding the ratio early
(a nudge), Pythagoras with no √ / a² − b² for c / the hypotenuse used as a leg / adding the sides / 2a for a², adding k, a flipped
proportion. `angleRatioChk(deg, {ratio: {fn, num, den}})` — the other acute angle 90° − θ (checked first: it is also what a flipped
tan or the co-function gives), RAD mode, no inverse key, the wrong inverse. `kChk(k, {from: {new, orig}})` — fraction or decimal
(≥ 2 places when k doesn't end), upside-down k, new − original, "3 : 2", "150%". Parts: `P.len`, `P.trigAngle`, `P.k(prompt, [p, q])`,
`P.ratioMC(r, prompt, 'sin'|'cos'|'tan'|'pyth')`. Tests: `node tests/geokit_test.js`; look: `python3 tests/geokit_shots.py`.
