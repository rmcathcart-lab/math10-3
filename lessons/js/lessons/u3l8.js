/* Math 10-3 · Unit 3 · Lesson 8 — Area of 2-D Shapes
 * Explainers: counting squares (Example 1; also area vs perimeter on the same rectangle); a parallelogram whose end
 * triangle slides across to make a rectangle (Example 2); same units first (Full notes); a triangle and its turned
 * copy making a parallelogram, also with the height outside (Example 4); Nadia's trapezoid doubled into a
 * parallelogram, then soil bags (Example 5); a circle and its r-by-r squares, about 3.14 of them (Example 6); pizza
 * slices laid top-to-tail (why πr², Full notes); the pizza verdict (Example 7); 1 ft² splitting into 144 in² (and
 * 9 ft², 10 000 cm²; Example 8); Owen's floor, boxes rounded up (Example 9). Then the Stand Up Break and the
 * Math History animation (Ahmes's round field). */
import { h, add, box, tex, svgEl, tween, stamp, stampIn, mountExplainers } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const rnd = (v, d = 2) => Math.round((v + (v >= 0 ? 1e-9 : -1e-9)) * 10 ** d) / 10 ** d;
const tr = (v, d = 2) => (Math.floor(v * 10 ** d + 1e-9) / 10 ** d).toFixed(d);   // calculator digits, cut before the …
const cbox = (cls, html) => h('div', cls + ' u3l8-cc', `<div>${html}</div>`);
const lerp = (a, b, t) => a + (b - a) * t;
const pts = (P) => P.map(([x, y]) => `${x},${y}`).join(' ');
const stxt = (parent, x, y, s, o = {}) => { const t = svgEl('text', { x, y, 'font-size': o.size || 20, 'font-weight': o.weight || 800, fill: o.fill || '#2b2b2b', 'text-anchor': o.anchor || 'middle', 'font-family': o.serif ? 'Georgia, serif' : null, 'font-style': o.italic ? 'italic' : null }, parent); if (o.halo) { t.setAttribute('stroke', '#fff'); t.setAttribute('stroke-width', 5); t.setAttribute('paint-order', 'stroke'); t.setAttribute('stroke-linejoin', 'round'); } t.textContent = s; return t; };
const eqBox = (stage, x, y, w, html, cls = '', hh = 44) => hide(add(stage, box(cbox('u3l8-eq ' + cls, html), w, hh), x, y));
const fadeOut = (c, el, ms = 300) => c.anim(el, [{ opacity: 1 }, { opacity: 0 }], ms);

/* =====================================================================================
 * 1. Count the squares (Example 1), and area vs perimeter
 * ===================================================================================== */
const count = {
  title: 'Count the square units',
  height: 330,
  minW: 960,
  choices: [{ sep: 'Example 1 check:' }, { v: 'a', label: '(a) the rectangle' }, { v: 'b', label: '(b) the triangle' }, { sep: 'Compare:' }, { v: 'per', label: 'Area vs perimeter' }],
  ask: (k) => ({ a: 'Example 1(a): each small square is <b>1 cm²</b>. Find the area of the rectangle.', b: 'Example 1(b): each small square is <b>1 cm²</b>. Find the area of the triangle.',
    per: 'The rectangle from Example 1: find its <b>perimeter</b> and its <b>area</b>.' })[k],
  make(stage, key, ex) {
    const W = ex.W, cs = 46, X0 = 20, Y0 = 34, P = (x, y) => [X0 + x * cs, Y0 + (6 - y) * cs];
    const svg = add(stage, svgEl('svg', { width: 680, height: 330, class: 'u3l8-svg' }), 0, 0);
    const gl = svgEl('g', { stroke: '#cfc6b4', 'stroke-width': 1 }, svg);
    for (let i = 0; i <= 14; i++) svgEl('line', { x1: X0 + i * cs, y1: Y0, x2: X0 + i * cs, y2: Y0 + 6 * cs }, gl);
    for (let j = 0; j <= 6; j++) svgEl('line', { x1: X0, y1: Y0 + j * cs, x2: X0 + 14 * cs, y2: Y0 + j * cs }, gl);
    const fills = svgEl('g', {}, svg);
    const cell = (x, y, fill, label) => { const g = hide(svgEl('g', {}, fills)); const [px, py] = P(x, y + 1); svgEl('rect', { x: px + 1, y: py + 1, width: cs - 2, height: cs - 2, fill }, g); if (label) stxt(g, px + cs / 2, py + cs / 2 + 7, label, { size: 18, fill: '#0e5e41' }); return g; };
    const rect = svgEl('polygon', { points: pts([P(1, 1), P(7, 1), P(7, 5), P(1, 5)]), fill: 'none', stroke: '#3a4254', 'stroke-width': 3 }, svg);
    const tri = svgEl('polygon', { points: pts([P(9, 1), P(13, 1), P(9, 5)]), fill: 'none', stroke: '#3a4254', 'stroke-width': 3, 'stroke-linejoin': 'round' }, svg);
    stxt(svg, P(4, 6)[0], Y0 - 10, '(a)', { size: 18, fill: '#4a2c14' }); stxt(svg, P(11, 6)[0], Y0 - 10, '(b)', { size: 18, fill: '#4a2c14' });
    const X = X0 + 14 * cs + 22, EW = W - X - 14;
    const st = (txt, y) => hide(stamp(stage, txt, { ok: true, x: X + EW / 2, y, rotate: -5 }));
    if (key === 'a') {
      const one = cell(1, 4, '#9bd3b1', '1'), rows = [];
      for (let j = 4; j >= 1; j--) { const r = []; for (let i = 1; i <= 6; i++) r.push(j === 4 && i === 1 ? one : cell(i, j, '#c9ecd9', String((4 - j) * 6 + i))); rows.push(r); }
      const u = eqBox(stage, X, 30, EW, '<b>1 square = 1 cm²</b>');
      const e1 = eqBox(stage, X, 84, EW, 'One row: <b>6</b> squares');
      const e2 = eqBox(stage, X, 138, EW, `4 rows: ${T('4\\times6=24')}`, 'res');
      const e3 = eqBox(stage, X, 192, EW, '<b>24 cm²</b>', 'good');
      const s = st('24 cm² ✓', 276);
      return [
        { cap: `Each small square is <b>1 cm²</b>.`, run: async (c) => { await c.pop(one); await c.fadeIn(u); } },
        { cap: `Count one row: <b>6</b> squares.`, run: async (c) => { for (const g of rows[0].slice(1)) await c.pop(g, 180); await c.fadeIn(e1); } },
        { cap: `There are <b>4 rows</b> of 6. You don’t have to count every square: 4 × 6 = <b>24</b>.`, run: async (c) => { for (const r of rows.slice(1)) await Promise.all(r.map((g) => c.anim(g, [{ opacity: 0 }, { opacity: 1 }], 300))); await c.fadeIn(e2); } },
        { cap: `The rectangle is <b>24 cm²</b>.`, run: async (c) => { await c.pop(e3); await stampIn(c, s); } }
      ];
    }
    if (key === 'b') {
      const fullC = [[9, 1], [10, 1], [11, 1], [9, 2], [10, 2], [9, 3]].map(([x, y], i) => cell(x, y, '#c9ecd9', String(i + 1)));
      const halves = [[12, 1], [11, 2], [10, 3], [9, 4]].map(([x, y]) => { const g = hide(svgEl('g', {}, fills)); const a = P(x, y), b = P(x + 1, y), d = P(x, y + 1); svgEl('polygon', { points: pts([a, b, d]), fill: '#f6d7a8', stroke: '#c27a0e', 'stroke-width': 1.5 }, g); stxt(g, a[0] + cs * 0.32, a[1] - cs * 0.22, '½', { size: 17, fill: '#8a560a' }); return g; });
      const sq = hide(svgEl('polygon', { points: pts([P(9, 1), P(13, 1), P(13, 5), P(9, 5)]), fill: 'none', stroke: '#1f5bd6', 'stroke-width': 3, 'stroke-dasharray': '9 6' }, svg));
      const e1 = eqBox(stage, X, 30, EW, 'Full squares: <b>6</b>');
      const e2 = eqBox(stage, X, 84, EW, 'Half squares: <b>4</b> = 2 full');
      const e3 = eqBox(stage, X, 138, EW, `${T('6+2=8')} cm²`, 'res');
      const e4 = eqBox(stage, X, 192, EW, `Check: ${T('4\\times4\\div2=8')} ✓`, 'good');
      const s = st('8 cm² ✓', 276);
      return [
        { cap: `Count the <b>full</b> squares inside the triangle: <b>6</b>.`, run: async (c) => { for (const g of fullC) await c.pop(g, 200); await c.fadeIn(e1); } },
        { cap: `Along the slanted side there are <b>4 half</b> squares.`, run: async (c) => { for (const g of halves) await c.pop(g, 220); } },
        { cap: `Two halves make one full square, so 4 halves = <b>2</b> squares. 6 + 2 = <b>8 cm²</b>.`, run: async (c) => { await c.fadeIn(e2); await c.pop(e3); } },
        { cap: `Check: the triangle is <b>half</b> of a 4 by 4 square: 16 ÷ 2 = 8 ✓`, run: async (c) => { await c.fadeIn(sq); await c.fadeIn(e4); await stampIn(c, s); } }
      ];
    }
    // area vs perimeter, on the rectangle (a)
    const walk = hide(svgEl('polygon', { points: pts([P(1, 5), P(7, 5), P(7, 1), P(1, 1)]), fill: 'none', stroke: '#c27a0e', 'stroke-width': 7, 'stroke-linejoin': 'round' }, svg));
    const L = 20 * cs; walk.setAttribute('stroke-dasharray', `${L} ${L}`); walk.setAttribute('stroke-dashoffset', L);
    const dot = hide(svgEl('circle', { cx: P(1, 5)[0], cy: P(1, 5)[1], r: 9, fill: '#c27a0e', stroke: '#fff', 'stroke-width': 3 }, svg));
    const all = []; for (let j = 1; j <= 4; j++) for (let i = 1; i <= 6; i++) all.push(cell(i, j, '#c9ecd9'));
    const ctr = eqBox(stage, X, 30, EW, 'Around: <b>0</b> cm');
    const e1 = eqBox(stage, X, 84, EW, `${T('6+4+6+4=20')} cm`, 'res');
    const e2 = eqBox(stage, X, 150, EW, `Inside: ${T('4\\times6=24')} cm²`, 'good');
    const e3 = eqBox(stage, X, 216, EW, '<small>fence → perimeter<br>carpet → area</small>', '', 64);
    const along = (t) => { const d = t * 20; const seg = [[0, 6, [1, 5], [1, 0]], [6, 10, [7, 5], [0, -1]], [10, 16, [7, 1], [-1, 0]], [16, 20, [1, 1], [0, 1]]].find(([a, b]) => d <= b + 1e-9) || [16, 20, [1, 1], [0, 1]]; const [a, , [sx, sy], [dx, dy]] = seg; return P(sx + dx * (d - a), sy + dy * (d - a)); };
    return [
      { cap: `<b>Perimeter</b>: walk all the way around the edge and add up the lengths.`, run: async (c) => { await c.fadeIn(walk, 100); await c.fadeIn(dot, 100); await c.fadeIn(ctr); await tween(c, 2600, (t) => { walk.setAttribute('stroke-dashoffset', L * (1 - t)); const [x, y] = along(t); dot.setAttribute('cx', x); dot.setAttribute('cy', y); ctr.firstChild.innerHTML = `Around: <b>${Math.round(t * 20)}</b> cm`; }, (t) => t); } },
      { cap: `Perimeter = 6 + 4 + 6 + 4 = <b>20 cm</b>. It is a <b>length</b>.`, run: (c) => c.pop(e1) },
      { cap: `<b>Area</b>: fill the inside with squares: 4 × 6 = <b>24 cm²</b>, in <b>square</b> units.`, run: async (c) => { await Promise.all(all.map((g, i) => c.anim(g, [{ opacity: 0 }, { opacity: 1 }], 300, { delay: i * 25 }))); await c.pop(e2); } },
      { cap: `Same rectangle, two questions. A fence goes <b>around</b> (perimeter). A carpet covers the <b>inside</b> (area).`, run: (c) => c.fadeIn(e3) }
    ];
  }
};

/* =====================================================================================
 * 2. The parallelogram: cut the end triangle off and slide it across (Example 2)
 * ===================================================================================== */
const SL = {
  demo: { b: 6, h: 3, off: 2, k: 50, unit: 'cm', grid: true, bl: '6 cm', hl: '3 cm' },
  b2: { b: 9.5, h: 5.2, off: 2.99, k: 40, unit: 'cm', slant: '6 cm', bl: '9.5 cm', hl: '5.2 cm' }
};
const slide = {
  title: 'A parallelogram is a pushed-over rectangle',
  height: 340,
  minW: 960,
  choices: [{ v: 'demo', label: 'On a grid' }, { sep: 'Example 2 check:' }, { v: 'b2', label: '(b) the parallelogram' }],
  ask: (k) => ({ demo: 'A parallelogram has a base of <b>6 cm</b> and a height of <b>3 cm</b>. Find its area.',
    b2: 'Example 2(b): base <b>9.5 cm</b>, height <b>5.2 cm</b>, slanted side <b>6 cm</b>. Find the area. Which length is not used?' })[k],
  make(stage, key, ex) {
    const d = SL[key], W = ex.W, k = d.k, X0 = 34, BY = 300, P = (x, y) => [X0 + x * k, BY - y * k];
    const svg = add(stage, svgEl('svg', { width: 620, height: 340, class: 'u3l8-svg' }), 0, 0);
    if (d.grid) { const g = svgEl('g', { stroke: '#e3dccd', 'stroke-width': 1 }, svg); for (let i = 0; i <= d.b + d.off; i++) svgEl('line', { x1: P(i, 0)[0], y1: P(0, 0)[1], x2: P(i, 0)[0], y2: P(0, d.h)[1] }, g); for (let j = 0; j <= d.h; j++) svgEl('line', { x1: P(0, j)[0], y1: P(0, j)[1], x2: P(d.b + d.off, j)[0], y2: P(0, j)[1] }, g); }
    const body = svgEl('polygon', { points: pts([P(d.off, 0), P(d.b, 0), P(d.b + d.off, d.h), P(d.off, d.h)]), fill: '#c9ecd9', stroke: '#3a4254', 'stroke-width': 3, 'stroke-linejoin': 'round' }, svg);
    const tg = svgEl('g', {}, svg);
    const triP = svgEl('polygon', { points: pts([P(0, 0), P(d.off, 0), P(d.off, d.h)]), fill: '#c9ecd9', stroke: '#3a4254', 'stroke-width': 3, 'stroke-linejoin': 'round' }, tg);
    const hgt = hide(svgEl('g', {}, svg));
    svgEl('line', { x1: P(d.off, 0)[0], y1: P(d.off, 0)[1], x2: P(d.off, d.h)[0], y2: P(d.off, d.h)[1], stroke: '#c27a0e', 'stroke-width': 3, 'stroke-dasharray': '8 6' }, hgt);
    svgEl('path', { d: `M${P(d.off, 0)[0]} ${BY - 14} h14 v14`, fill: 'none', stroke: '#c27a0e', 'stroke-width': 2.5 }, hgt);
    stxt(hgt, P(d.off, d.h / 2)[0] + 12, P(0, d.h / 2)[1] + 7, `h = ${d.hl}`, { size: 18, fill: '#8a560a', anchor: 'start' });
    const bLab = stxt(svg, P(d.b / 2, 0)[0], BY + 26, `b = ${d.bl}`, { size: 18 });
    const sl = d.slant ? stxt(svg, P(d.b + d.off / 2, d.h / 2)[0] + 14, P(0, d.h / 2)[1], d.slant, { size: 18, anchor: 'start' }) : null;
    const X = 640, EW = W - X - 14;
    const f = eqBox(stage, X, 30, EW, `Rectangle: ${T('A=b\\times h')}`);
    const e1 = eqBox(stage, X, 90, EW, `${T(`A=${d.b}\\times${d.h}=${rnd(d.b * d.h, 2)}`)}`, 'res');
    const e2 = eqBox(stage, X, 150, EW, `<b>${rnd(d.b * d.h, 2)} ${d.unit}²</b>`, 'good');
    const no = d.slant ? eqBox(stage, X, 210, EW, `${d.slant} side: <b>not used</b>`, 'bad') : null;
    const s = hide(stamp(stage, 'Same area ✓', { ok: true, x: X + EW / 2, y: 300, rotate: -5 }));
    const steps = [
      { cap: `A parallelogram: the base <b>b</b> is along the bottom. The height <b>h</b> goes straight up, at a right angle to the base.`, run: (c) => c.fadeIn(hgt) },
      { cap: `Cut along the height…`, run: async (c) => { triP.setAttribute('fill', '#f6d7a8'); await c.anim(tg, [{ opacity: 1 }, { opacity: 0.4 }, { opacity: 1 }], 500); } },
      { cap: `…and slide the triangle to the other end.`, run: (c) => tween(c, 1300, (t) => tg.setAttribute('transform', `translate(${d.b * k * t} 0)`)) },
      { cap: `Now it is a <b>rectangle</b>, with the same base and the same height. Nothing was added or lost.`, run: async (c) => { await c.fadeIn(f); await stampIn(c, s); } },
      { cap: d.slant ? `A = b × h = ${d.b} × ${d.h} = <b>${rnd(d.b * d.h, 2)} cm²</b>. The slanted ${d.slant} side is <b>not</b> used.` : `A = b × h = ${d.b} × ${d.h} = <b>${d.b * d.h} cm²</b>. Count the squares: ${d.b * d.h} ✓`,
        run: async (c) => { await c.pop(e1); await c.fadeIn(e2); if (no) { await c.fadeIn(no); sl.setAttribute('fill', '#c93a33'); sl.setAttribute('text-decoration', 'line-through'); } } }
    ];
    void body; void bLab;
    return steps;
  }
};

/* =====================================================================================
 * 3. Same units first (Full notes)
 * ===================================================================================== */
const sameUnits = {
  title: 'Same units before you multiply',
  height: 330,
  minW: 900,
  choices: [{ v: 'shelf', label: 'A shelf: 2 m by 50 cm' }],
  ask: 'A shelf is <b>2 m</b> long and <b>50 cm</b> deep. What is its area?',
  make(stage, key, ex) {
    const W = ex.W, svg = add(stage, svgEl('svg', { width: W, height: 330, class: 'u3l8-svg' }), 0, 0);
    svgEl('rect', { x: (W - 400) / 2, y: 20, width: 400, height: 100, fill: '#e8d2a8', stroke: '#6e4a1c', 'stroke-width': 3 }, svg);
    stxt(svg, W / 2, 16, '2 m', { size: 19 }); stxt(svg, (W + 400) / 2 + 10, 76, '50 cm', { size: 19, anchor: 'start' });
    const CW = (W - 80) / 2;
    const bad = eqBox(stage, 30, 150, CW, `${T('2\\times50=100')} &nbsp;100 what? ✗`, 'bad', 50);
    const b2 = eqBox(stage, 30, 210, CW, '<small>metres × centimetres is not a square unit</small>', '', 40);
    const g1 = eqBox(stage, 50 + CW, 150, CW, `${T('50\\text{ cm}=0.5\\text{ m}')}; ${T('2\\times0.5=1')} m²`, 'good', 50);
    const g2 = eqBox(stage, 50 + CW, 210, CW, `or ${T('200\\times50=10\\,000')} cm², the same 1 m²`, 'good', 50);
    const s1 = hide(stamp(stage, '✗', { ok: false, x: 30 + CW / 2, y: 290, rotate: 6 })), s2 = hide(stamp(stage, 'Same unit ✓', { ok: true, x: 50 + CW * 1.5, y: 296, rotate: -5 }));
    return [
      { cap: `Multiply the numbers as they are: 2 × 50 = 100. But 100 <b>what</b>? m × cm is not a square unit ✗`, run: async (c) => { await c.fadeIn(bad); await c.fadeIn(b2); await stampIn(c, s1); } },
      { cap: `Change one length first: 50 cm = 0.5 m. Then 2 × 0.5 = <b>1 m²</b>.`, run: (c) => c.pop(g1) },
      { cap: `Or change both to cm: 200 × 50 = 10&#8239;000 cm². That is the same 1 m² ✓`, run: async (c) => { await c.fadeIn(g2); await stampIn(c, s2); } }
    ];
  }
};

/* =====================================================================================
 * 4. A triangle is half a parallelogram (Example 4)
 * ===================================================================================== */
const HT = {
  a: { b: 8, h: 5, cx: 2, k: 44, unit: 'cm', bT: '8', hT: '5', prod: 40, ans: 20 },
  b: { b: 8, h: 3.5, cx: 4, k: 40, unit: 'ft', bT: '8', hT: '3\\tfrac12', prod: 28, ans: 14 },
  c: { b: 6.4, h: 3.5, cx: 8.6, k: 36, unit: 'm', bT: '6.4', hT: '3.5', prod: 22.4, ans: 11.2, out: true }
};
const halfTri = {
  title: 'Two copies of a triangle make a parallelogram',
  height: 330,
  minW: 960,
  choices: [{ sep: 'Example 4 check:' }, { v: 'a', label: '(a) 8 cm by 5 cm' }, { v: 'b', label: '(b) the shed wall' }, { v: 'c', label: '(c) height outside' }],
  ask: (k) => ({ a: 'Example 4(a): a triangle has base <b>8 cm</b> and height <b>5 cm</b>. Find its area.', b: `Example 4(b): the top of a shed wall is a triangle with base <b>8 ft</b> and height <b>${T('3\\tfrac12')} ft</b>.`,
    c: 'Example 4(c): base <b>6.4 m</b>, height <b>3.5 m</b>. The height falls outside the triangle. Find the area.' })[k],
  make(stage, key, ex) {
    const d = HT[key], W = ex.W, k = d.k, X0 = 30, BY = 290, P = (x, y) => [X0 + x * k, BY - y * k];
    const svg = add(stage, svgEl('svg', { width: 640, height: 330, class: 'u3l8-svg' }), 0, 0);
    const A = P(0, 0), B = P(d.b, 0), C = P(d.cx, d.h), M = [(B[0] + C[0]) / 2, (B[1] + C[1]) / 2];
    const copy = hide(svgEl('polygon', { points: pts([A, B, C]), fill: '#cfe0fb', stroke: '#1f5bd6', 'stroke-width': 2.5, 'stroke-dasharray': '8 5', 'stroke-linejoin': 'round' }, svg));
    svgEl('polygon', { points: pts([A, B, C]), fill: '#c9ecd9', stroke: '#3a4254', 'stroke-width': 3, 'stroke-linejoin': 'round' }, svg);
    const hg = hide(svgEl('g', {}, svg));
    if (d.out) svgEl('line', { x1: B[0], y1: BY, x2: P(d.cx, 0)[0], y2: BY, stroke: '#3a4254', 'stroke-width': 3, 'stroke-dasharray': '2 6' }, hg);
    svgEl('line', { x1: C[0], y1: C[1], x2: C[0], y2: BY, stroke: '#c27a0e', 'stroke-width': 3, 'stroke-dasharray': '8 6' }, hg);
    svgEl('path', { d: `M${C[0] + (d.out ? -14 : 14)} ${BY} v-14 h${d.out ? 14 : -14}`, fill: 'none', stroke: '#c27a0e', 'stroke-width': 2.5 }, hg);
    stxt(hg, C[0] + 10, BY - d.h * k / 2 + 6, `h = ${d.h === 3.5 && key === 'b' ? '3½' : d.h} ${d.unit}`, { size: 18, fill: '#8a560a', anchor: 'start', halo: true });
    stxt(svg, (A[0] + B[0]) / 2, BY + 26, `b = ${d.b} ${d.unit}`, { size: 18 });
    const par = hide(svgEl('polygon', { points: pts([A, B, [B[0] + C[0] - A[0], C[1]], C]), fill: 'none', stroke: '#8b2f1c', 'stroke-width': 4, 'stroke-linejoin': 'round' }, svg));
    const X = 620, EW = W - X - 14;
    const e1 = eqBox(stage, X, 40, EW, `Both: ${T(`${d.bT}\\times${d.hT}=${d.prod}`)}`);
    const e2 = eqBox(stage, X, 104, EW, `Triangle: ${T(`${d.prod}\\div2=${d.ans}`)}`, 'res');
    const e3 = eqBox(stage, X, 168, EW, `<b>${d.ans} ${d.unit}²</b>`, 'good');
    const s = hide(stamp(stage, 'Half ✓', { ok: true, x: X + EW / 2, y: 262, rotate: -5 }));
    return [
      { cap: d.out ? `The height falls <b>outside</b> the triangle. Extend the base with a dotted line. The base is still <b>${d.b} ${d.unit}</b> (not the dotted part).` : `The base is <b>${d.b} ${d.unit}</b>. The height goes from the top corner straight down to the base, at a right angle.`, run: (c) => c.fadeIn(hg) },
      { cap: `Make a copy of the triangle and turn it around…`, run: async (c) => { await c.anim(copy, [{ opacity: 0 }, { opacity: 1 }], 300); await tween(c, 1500, (t) => copy.setAttribute('transform', `rotate(${180 * t} ${M[0]} ${M[1]})`)); } },
      { cap: `…the two copies make a <b>parallelogram</b>: base × height = ${d.bT === '8' && key === 'b' ? '8 × 3½' : `${d.b} × ${d.h}`} = ${d.prod}.`, run: async (c) => { await c.fadeIn(par); await c.fadeIn(e1); } },
      { cap: `The triangle is <b>half</b> of it: ${d.prod} ÷ 2 = <b>${d.ans} ${d.unit}²</b>.`, run: async (c) => { await c.anim(copy, [{ opacity: 1 }, { opacity: 0.25 }], 400); await c.pop(e2); await c.fadeIn(e3); await stampIn(c, s); } }
    ];
  }
};

/* =====================================================================================
 * 5. Nadia's trapezoid: two copies make a parallelogram; then the soil bags (Example 5)
 * ===================================================================================== */
const trap = {
  title: 'Two copies of a trapezoid make a parallelogram',
  height: 380,
  minW: 960,
  choices: [{ sep: 'Example 5 check:' }, { v: 'n', label: 'Nadia’s flower bed' }],
  ask: 'Example 5: the fence side is <b>3.8 m</b>, the front is <b>2.4 m</b>, and they are <b>1.5 m</b> apart. Find the area. Then: one bag covers <b>0.5 m²</b>.',
  make(stage, key, ex) {
    const W = ex.W, k = 80, X0 = 30, TY = 50, P = (x, y) => [X0 + x * k, TY + (1.5 - y) * k];
    const svg = add(stage, svgEl('svg', { width: 640, height: 380, class: 'u3l8-svg' }), 0, 0);
    svgEl('line', { x1: X0 - 10, y1: TY - 5, x2: X0 + 4.1 * k, y2: TY - 5, stroke: '#7a4a26', 'stroke-width': 7 }, svg);
    stxt(svg, X0 + 4.1 * k + 6, TY, 'fence', { size: 14, fill: '#7a4a26', anchor: 'start' });
    const T1 = [P(0, 1.5), P(3.8, 1.5), P(3.1, 0), P(0.7, 0)], Mx = (P(3.8, 1.5)[0] + P(3.1, 0)[0]) / 2, My = (P(3.8, 1.5)[1] + P(3.1, 0)[1]) / 2;
    const copy = hide(svgEl('polygon', { points: pts(T1), fill: '#cfe0fb', stroke: '#1f5bd6', 'stroke-width': 2.5, 'stroke-dasharray': '8 5', 'stroke-linejoin': 'round' }, svg));
    svgEl('polygon', { points: pts(T1), fill: '#c9ecd9', stroke: '#3a4254', 'stroke-width': 3, 'stroke-linejoin': 'round' }, svg);
    svgEl('line', { x1: P(0.7, 0)[0], y1: P(0.7, 0)[1], x2: P(0.7, 1.5)[0], y2: P(0.7, 1.5)[1], stroke: '#c27a0e', 'stroke-width': 3, 'stroke-dasharray': '7 5' }, svg);
    stxt(svg, P(1.9, 1.5)[0], TY + 22, '3.8 m', { size: 17 }); stxt(svg, P(1.9, 0)[0], P(0, 0)[1] + 22, '2.4 m', { size: 17 });
    stxt(svg, P(0.7, 0)[0] + 8, TY + 66, '1.5 m', { size: 17, fill: '#8a560a', anchor: 'start', halo: true });
    const cl = hide(svgEl('g', {}, svg));
    stxt(cl, P(5, 1.5)[0], TY + 22, '2.4 m', { size: 17, fill: '#1f5bd6' }); stxt(cl, P(5, 0)[0], P(0, 0)[1] + 22, '3.8 m', { size: 17, fill: '#1f5bd6' });
    const par = hide(svgEl('polygon', { points: pts([P(0, 1.5), P(6.2, 1.5), P(6.9, 0), P(0.7, 0)]), fill: 'none', stroke: '#8b2f1c', 'stroke-width': 4, 'stroke-linejoin': 'round' }, svg));
    const baseLab = hide(add(stage, box(cbox('u3l8-tag', 'base: 2.4 + 3.8 = 6.2 m'), 300, 26), P(3.8, 0)[0] - 150, P(0, 0)[1] + 32));
    baseLab.style.color = '#8b2f1c';
    // soil bags
    const bags = [];
    for (let i = 0; i < 10; i++) bags.push(hide(add(stage, box(cbox('u3l8-bag', `<b>${i + 1}</b><br>0.5 m²`), 52, 58), X0 + i * 60, 290)));
    const bagLab = hide(add(stage, box(cbox('u3l8-eq', ''), 420, 34), X0 + 620 - 420, 250));
    const X = 660, EW = W - X - 14;
    const e1 = eqBox(stage, X, 26, EW, `${T('6.2\\times1.5=9.3')} m²`);
    const e2 = eqBox(stage, X, 80, EW, `${T('9.3\\div2=4.65')} m²`, 'res');
    const e3 = eqBox(stage, X, 150, EW, `Bags: ${T('4.65\\div0.5=9.3')}`);
    const e4 = eqBox(stage, X, 204, EW, '<b>10 bags</b> (round up)', 'good');
    const s = hide(stamp(stage, '10 bags ✓', { ok: true, x: X + EW / 2, y: 330, rotate: -5 }));
    return [
      { cap: `A trapezoid: the parallel sides are 3.8 m and 2.4 m, and the height is 1.5 m.`, run: (c) => c.anim(svg, [{ opacity: 0.5 }, { opacity: 1 }], 300) },
      { cap: `Make a copy and turn it around…`, run: async (c) => { await c.anim(copy, [{ opacity: 0 }, { opacity: 1 }], 300); await tween(c, 1500, (t) => copy.setAttribute('transform', `rotate(${180 * t} ${Mx} ${My})`)); await c.fadeIn(cl); } },
      { cap: `…a <b>parallelogram</b> with base 2.4 + 3.8 = <b>6.2 m</b> and height 1.5 m: 6.2 × 1.5 = 9.3 m².`, run: async (c) => { await c.fadeIn(par); await c.fadeIn(baseLab); await c.fadeIn(e1); } },
      { cap: `The flower bed is <b>half</b> of it: 9.3 ÷ 2 = <b>4.65 m²</b>.`, run: async (c) => { await c.anim(copy, [{ opacity: 1 }, { opacity: 0.25 }], 400); await c.pop(e2); } },
      { cap: `(b) Each bag covers 0.5 m²: 4.65 ÷ 0.5 = 9.3 bags. But 9 bags cover only <b>4.5 m²</b> ✗`, run: async (c) => { await c.fadeIn(e3); bagLab.firstChild.innerHTML = '9 bags: 4.5 m², not enough ✗'; await c.fadeIn(bagLab); for (const b of bags.slice(0, 9)) { b.classList.add('on'); await c.pop(b, 160); } } },
      { cap: `She can’t buy part of a bag, so round <b>up</b>: <b>10 bags</b> cover 5.0 m² ✓`, run: async (c) => { bagLab.firstChild.innerHTML = '10 bags: 5.0 m², enough ✓'; bags[9].classList.add('on'); await c.pop(bags[9]); await c.fadeIn(e4); await stampIn(c, s); } }
    ];
  }
};

/* =====================================================================================
 * 6. A circle is about 3.14 r-by-r squares (Example 6)
 * ===================================================================================== */
const circleSq = {
  title: 'How many r-by-r squares fit in a circle?',
  height: 340,
  minW: 960,
  choices: [{ v: 'why', label: 'About 3 squares' }, { sep: 'Example 6 check:' }, { v: 'a', label: '(a) table, r = 45 cm' }, { v: 'b', label: '(b) rug, d = 8 ft' }],
  ask: (k) => ({ why: 'Why is the area of a circle <b>π × r × r</b>?', a: 'Example 6(a): a round table top has a radius of <b>45 cm</b>. Find its area to the nearest tenth.',
    b: 'Example 6(b): a round rug has a diameter of <b>8 ft</b>. Estimate its area, then find it to the nearest tenth.' })[k],
  make(stage, key, ex) {
    const W = ex.W, R = 132, cx = 40 + R, cy = 22 + R;
    const svg = add(stage, svgEl('svg', { width: 2 * R + 80, height: 340, class: 'u3l8-svg' }), 0, 0);
    const quad = (sx, sy) => svgEl('rect', { x: Math.min(cx, cx + sx * R), y: Math.min(cy, cy + sy * R), width: R, height: R }, null);
    const sqs = [[1, -1], [-1, -1], [-1, 1], [1, 1]].map(([sx, sy], i) => { const r = quad(sx, sy); r.setAttribute('fill', i === 0 ? '#e9dfcf' : '#f3ede2'); r.setAttribute('stroke', '#b9ad97'); r.setAttribute('stroke-width', 2); svg.appendChild(r); if (i) hide(r); return r; });
    const nums = [[1, -1], [-1, -1], [-1, 1], [1, 1]].map(([sx, sy], i) => { const t = stxt(svg, cx + sx * R * 0.78, cy + sy * R * 0.78 + 8, String(i + 1), { size: 22, fill: '#9a6a24' }); hide(t); return t; });
    const corners = hide(svgEl('g', {}, svg));
    [[1, -1], [-1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => {
      const kx = cx + sx * R, ky = cy + sy * R, ax = cx, ay = cy + sy * R, bx = cx + sx * R, by = cy;
      const sweep = sx * sy < 0 ? 0 : 1;
      svgEl('path', { d: `M${ax} ${ay} L${kx} ${ky} L${bx} ${by} A${R} ${R} 0 0 ${sweep} ${ax} ${ay} Z`, fill: '#f7c2bc', stroke: '#c93a33', 'stroke-width': 1.5 }, corners);
    });
    const circ = svgEl('circle', { cx, cy, r: R, fill: 'rgba(63,174,106,.18)', stroke: '#3a4254', 'stroke-width': 3.5 }, svg);
    svgEl('line', { x1: cx, y1: cy, x2: cx + R, y2: cy, stroke: '#3a4254', 'stroke-width': 3 }, svg);
    svgEl('line', { x1: cx, y1: cy, x2: cx, y2: cy - R, stroke: '#3a4254', 'stroke-width': 3 }, svg);
    svgEl('circle', { cx, cy, r: 4.5, fill: '#3a4254' }, svg);
    const rl = key === 'a' ? '45 cm' : key === 'b' ? '4 ft' : 'r';
    stxt(svg, cx + R / 2, cy + 24, rl, { size: 20, serif: key === 'why', italic: key === 'why' }); stxt(svg, cx - 10, cy - R / 2, rl, { size: 20, anchor: 'end', serif: key === 'why', italic: key === 'why' });
    const dia = key === 'b' ? hide(svgEl('g', {}, svg)) : null;
    if (dia) { svgEl('line', { x1: cx - R, y1: cy + 1, x2: cx + R, y2: cy + 1, stroke: '#1f5bd6', 'stroke-width': 4, 'stroke-dasharray': '9 6' }, dia); stxt(dia, cx - R / 2, cy - 10, 'd = 8 ft', { size: 18, fill: '#1f5bd6' }); }
    const X = 2 * R + 110, EW = W - X - 14;
    if (key === 'why') {
      // a bar of 4 squares: 3.14 filled
      const BX = X + 10, BW = Math.min(EW - 20, 440), u = BW / 4, BY = 150;
      const bar = hide(svgEl('svg', { width: BW + 4, height: 70, class: 'u3l8-svg' }, null)); add(stage, bar, BX, BY);
      for (let i = 0; i < 4; i++) svgEl('rect', { x: 2 + i * u, y: 2, width: u, height: 60, fill: '#f3ede2', stroke: '#b9ad97', 'stroke-width': 2 }, bar);
      const fillR = svgEl('rect', { x: 2, y: 2, width: 0, height: 60, fill: 'rgba(63,174,106,.45)' }, bar);
      const redR = svgEl('rect', { x: 2 + Math.PI * u, y: 2, width: (4 - Math.PI) * u, height: 60, fill: '#f7c2bc', opacity: 0 }, bar);
      const e0 = eqBox(stage, X, 30, EW, `One square: ${T('r\\times r=r^2')}`);
      const e1 = eqBox(stage, X, 86, EW, `Four squares: ${T('4r^2')}, more than the circle`);
      const e2 = eqBox(stage, X, 230, EW, `Circle: about <b>3.14</b> squares`, 'res');
      const e3 = eqBox(stage, X, 284, EW, `${T('A=\\pi\\times r\\times r=\\pi r^2')}`, 'good');
      return [
        { cap: `The radius is <b>r</b>. The shaded square is r by r, so its area is <b>r²</b>.`, run: (c) => c.fadeIn(e0) },
        { cap: `Four of these squares cover the whole circle, and more: <b>4r²</b>.`, run: async (c) => { for (let i = 1; i < 4; i++) await c.fadeIn(sqs[i], 250); for (const t of nums) await c.pop(t, 200); await c.fadeIn(e1); await c.fadeIn(bar); } },
        { cap: `The 4 <b>corners</b> stick out past the circle. Take them away…`, run: async (c) => { await c.fadeIn(corners); await c.anim(redR, [{ opacity: 0 }, { opacity: 1 }], 400); } },
        { cap: `…and the circle is about <b>3.14</b> squares. That number is <b>π</b>. So A = π × r × r = <b>πr²</b>.`, run: async (c) => { await tween(c, 1200, (t) => fillR.setAttribute('width', Math.PI * u * t)); await c.pop(e2); await c.fadeIn(e3); } },
        { cap: `To estimate, use 3: A ≈ 3 × r × r, a little less than the real area.`, run: (c) => c.anim(circ, [{ opacity: 1 }, { opacity: 0.5 }, { opacity: 1 }], 600) }
      ];
    }
    if (key === 'a') {
      const e1 = eqBox(stage, X, 30, EW, `One square: ${T('45\\times45=2025')} cm²`);
      const e2 = eqBox(stage, X, 90, EW, `Estimate: ${T('3\\times2025=6075')} cm²`, '', 44); e2.classList.add('u3l8-estb');
      const e3 = eqBox(stage, X, 150, EW, `${T('A=\\pi\\times45^2=\\pi\\times2025')}`);
      const e4 = eqBox(stage, X, 206, EW, `${T('=6361.72\\ldots\\approx6361.7')} cm²`, 'res');
      const s = hide(stamp(stage, 'Close to 6075 ✓', { ok: true, x: X + EW / 2, y: 296, rotate: -5 }));
      return [
        { cap: `The radius is 45 cm. One r-by-r square: 45 × 45 = 45² = <b>2025 cm²</b>.`, run: (c) => c.fadeIn(e1) },
        { cap: `Estimate: about 3 of these squares: 3 × 2025 = 6075 cm².`, run: (c) => c.fadeIn(e2) },
        { cap: `A = π × 45² = π × 2025.`, run: (c) => c.fadeIn(e3) },
        { cap: `= 6361.72… ≈ <b>6361.7 cm²</b>. A bit more than the estimate, as it should be ✓`, run: async (c) => { await c.pop(e4); await stampIn(c, s); } }
      ];
    }
    const e1 = eqBox(stage, X, 30, EW, `${T('r=8\\div2=4')} ft`);
    const e2 = eqBox(stage, X, 90, EW, `Estimate: ${T('3\\times4\\times4=48')} ft²`, '', 44); e2.classList.add('u3l8-estb');
    const e3 = eqBox(stage, X, 150, EW, `${T('A=\\pi\\times4^2=\\pi\\times16')}`);
    const e4 = eqBox(stage, X, 206, EW, `${T('=50.265\\ldots\\approx50.3')} ft²`, 'res');
    const s = hide(stamp(stage, 'Close to 48 ✓', { ok: true, x: X + EW / 2, y: 296, rotate: -5 }));
    return [
      { cap: `The <b>diameter</b> is 8 ft. Halve it first: r = 8 ÷ 2 = <b>4 ft</b>.`, run: async (c) => { await c.fadeIn(dia); await c.fadeIn(e1); } },
      { cap: `Estimate: 3 × 4 × 4 = <b>48 ft²</b>.`, run: (c) => c.fadeIn(e2) },
      { cap: `A = π × 4² = π × 16 (4² means 4 × 4, not 4 × 2).`, run: (c) => c.fadeIn(e3) },
      { cap: `= 50.265… ≈ <b>50.3 ft²</b>. Close to the estimate ✓`, run: async (c) => { await c.pop(e4); await stampIn(c, s); } }
    ];
  }
};

/* =====================================================================================
 * 7. Why πr²: pizza slices laid top-to-tail (Full notes)
 * ===================================================================================== */
const slices = {
  title: 'Cut the circle into slices and lay them out',
  height: 330,
  minW: 960,
  choices: [{ v: '16', label: '16 slices' }],
  ask: 'Why is the area of a circle <b>πr²</b>?',
  make(stage, key, ex) {
    const W = ex.W, N = 16, R = 110, cx = 150, cy = 165, D = 2 * Math.PI / N, s = R * D, x0 = 340, yT = 70, yB = yT + R;
    const svg = add(stage, svgEl('svg', { width: W, height: 330, class: 'u3l8-svg' }), 0, 0);
    const wedge = `M0 0 L${R * Math.cos(-D / 2)} ${R * Math.sin(-D / 2)} A${R} ${R} 0 0 1 ${R * Math.cos(D / 2)} ${R * Math.sin(D / 2)} Z`;
    const deg = (a) => a * 180 / Math.PI;
    const W8 = Array.from({ length: N }, (_, i) => {
      const from = { x: cx, y: cy, a: deg((i + 0.5) * D) };
      const even = i % 2 === 0, to = even ? { x: x0 + (i / 2) * s + s / 2, y: yB, a: -90 } : { x: x0 + ((i + 1) / 2) * s, y: yT, a: 90 };
      to.a += 360 * Math.round((from.a - to.a) / 360);
      const g = svgEl('path', { d: wedge, fill: even ? '#f6d58a' : '#e9a85a', stroke: '#9a6a24', 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, svg);
      const set = (p) => g.setAttribute('transform', `translate(${p.x} ${p.y}) rotate(${p.a})`);
      set(from); return { g, from, to, set };
    });
    const lab = hide(svgEl('g', {}, svg));
    svgEl('path', { d: `M${x0} ${yB + 18} v8 H${x0 + 8 * s} v-8`, fill: 'none', stroke: '#8b2f1c', 'stroke-width': 2.5 }, lab);
    stxt(lab, x0 + 4 * s, yB + 50, 'base: half the way around = πr', { size: 19, fill: '#8b2f1c' });
    svgEl('path', { d: `M${x0 - 14} ${yT} h-8 V${yB} h8`, fill: 'none', stroke: '#1f5bd6', 'stroke-width': 2.5 }, lab);
    stxt(lab, x0 - 30, (yT + yB) / 2 + 7, 'r', { size: 24, fill: '#1f5bd6', anchor: 'end', serif: true, italic: true });
    const e1 = eqBox(stage, x0 - 20, 260, 520, `Area ≈ base × height ${T('=\\pi r\\times r=\\pi r^2')}`, 'good', 50);
    return [
      { cap: `Cut the circle into <b>16</b> thin slices, like a pizza.`, run: (c) => tween(c, 700, (t) => W8.forEach((w) => { const a = w.from.a * Math.PI / 180, p = 8 * Math.sin(Math.PI * t); w.set({ x: cx + p * Math.cos(a), y: cy + p * Math.sin(a), a: w.from.a }); })) },
      { cap: `Lay them out top-to-tail: one slice points up, the next points down.`, run: (c) => tween(c, 2200, (t) => W8.forEach((w) => w.set({ x: lerp(w.from.x, w.to.x, t), y: lerp(w.from.y, w.to.y, t), a: lerp(w.from.a, w.to.a, t) }))) },
      { cap: `It is almost a parallelogram. Its height is the radius <b>r</b>. Its base is half the circumference: half of 2πr = <b>πr</b>.`, run: (c) => c.fadeIn(lab) },
      { cap: `Area ≈ base × height = πr × r = <b>πr²</b>. Thinner slices make it closer and closer to exact.`, run: (c) => c.pop(e1) }
    ];
  }
};

/* =====================================================================================
 * 8. Pizza Palace: more pizza for less money (Example 7)
 * ===================================================================================== */
const pizza = {
  title: 'Which is the better buy?',
  height: 360,
  minW: 960,
  choices: [{ sep: 'Example 7 check:' }, { v: 'p', label: 'One 16 in or two 10 in' }],
  ask: 'Example 7: one <b>16 in</b> pizza for <b>$21.99</b>, or two <b>10 in</b> pizzas for <b>$11.99</b> each?',
  make(stage, key, ex) {
    const W = ex.W, k = 9, svg = add(stage, svgEl('svg', { width: 620, height: 360, class: 'u3l8-svg' }), 0, 0);
    const pz = (x, y, d) => {
      const g = hide(svgEl('g', {}, svg)), r = d * k / 2;
      svgEl('circle', { cx: x, cy: y, r, fill: '#e0a050', stroke: '#9a6a24', 'stroke-width': 2 }, g);
      svgEl('circle', { cx: x, cy: y, r: r - 7, fill: '#f6d58a' }, g);
      [[0.4, 0.2], [-0.35, 0.35], [0.1, -0.45], [-0.45, -0.25], [0.5, -0.35], [-0.05, 0.55], [0.05, 0.05]].forEach(([a, b]) => svgEl('circle', { cx: x + a * r, cy: y + b * r, r: r * 0.12, fill: '#c0392b' }, g));
      svgEl('line', { x1: x - r, y1: y, x2: x + r, y2: y, stroke: '#4a2c14', 'stroke-width': 2, 'stroke-dasharray': '5 4', opacity: 0.7 }, g);
      return g;
    };
    const P16 = pz(140, 110, 16), P10a = pz(390, 110, 10), P10b = pz(505, 110, 10);
    const tag = (x, html) => hide(add(stage, box(cbox('u3l8-tag', html), 240, 28), x - 120, 196));
    const t16 = tag(140, '16 in: $21.99'), t10 = tag(447, '2 × 10 in: $23.98');
    // area bars (2 px per in²)
    const bar = (y, a, col) => { const g = hide(svgEl('g', {}, svg)); svgEl('rect', { x: 20, y, width: 0, height: 30, rx: 6, fill: col, stroke: '#3a4254', 'stroke-width': 1.5 }, g); return g; };
    const b16 = bar(244, 201.06, '#f6d58a'), b10 = bar(290, 157.08, '#f6d58a');
    const bl16 = hide(add(stage, box(cbox('u3l8-tag', '201.06 in²'), 120, 30), 20 + 2 * 201.06 + 8, 244));
    const bl10 = hide(add(stage, box(cbox('u3l8-tag', '157.08 in²'), 120, 30), 20 + 2 * 157.08 + 8, 290));
    const grow = (c, g, a) => tween(c, 700, (t) => g.firstChild.setAttribute('width', 2 * a * t));
    const X = 640, EW = W - X - 14;
    const e1 = eqBox(stage, X, 20, EW, `${T('\\pi\\times8^2\\approx201.06')} in²`);
    const e2 = eqBox(stage, X, 72, EW, `${T('2\\times\\pi\\times5^2\\approx157.08')} in²`);
    const e3 = eqBox(stage, X, 140, EW, `${T('\\$21.99\\div201.06\\approx\\$0.109')}`, 'good');
    const e4 = eqBox(stage, X, 192, EW, `${T('\\$23.98\\div157.08\\approx\\$0.153')}`, 'bad');
    const per = eqBox(stage, X, 244, EW, '<small>price per square inch</small>', 'mid', 30);
    const s = hide(stamp(stage, 'Better buy ✓', { ok: true, x: 140, y: 40, rotate: -6 }));
    return [
      { cap: `One 16 in pizza: r = 16 ÷ 2 = 8 in. A = π × 8² ≈ <b>201.06 in²</b>.`, run: async (c) => { await c.pop(P16); await c.fadeIn(t16); await c.fadeIn(e1); } },
      { cap: `Two 10 in pizzas: r = 5 in. A = π × 5² ≈ 78.54 in² each, so 2 × 78.54 = <b>157.08 in²</b>.`, run: async (c) => { await c.pop(P10a); await c.pop(P10b); await c.fadeIn(t10); await c.fadeIn(e2); } },
      { cap: `(a) Compare the areas: the one 16 in pizza is <b>more pizza</b>.`, run: async (c) => { await c.fadeIn(b16, 100); await grow(c, b16, 201.06); await c.fadeIn(bl16); await c.fadeIn(b10, 100); await grow(c, b10, 157.08); await c.fadeIn(bl10); } },
      { cap: `(b) Price per in²: $21.99 ÷ 201.06 ≈ <b>$0.109</b>, and $23.98 ÷ 157.08 ≈ <b>$0.153</b>.`, run: async (c) => { await c.fadeIn(e3); await c.fadeIn(e4); await c.fadeIn(per); } },
      { cap: `The 16 in pizza is the better buy: <b>more pizza for less money</b>.`, run: (c) => stampIn(c, s) }
    ];
  }
};

/* =====================================================================================
 * 9. 1 ft² = 144 in² (and 1 yd² = 9 ft², 1 m² = 10 000 cm²) (Example 8)
 * ===================================================================================== */
const US = {
  ft: { n: 12, big: 'ft', small: 'in', bigU: '1 ft', smallU: '1 in', res: '144', T: '12\\times12=144' },
  yd: { n: 3, big: 'yd', small: 'ft', bigU: '1 yd', smallU: '1 ft', res: '9', T: '3\\times3=9' },
  m: { n: 100, big: 'm', small: 'cm', bigU: '1 m', smallU: '1 cm', res: '10&#8239;000', T: '100\\times100=10\\,000' }
};
const ROWS8 = [
  { q: '(a) 5 ft² → in²', w: '5\\times144=720', a: '720 in²', dir: 'big → small: multiply' },
  { q: '(b) 2880 in² → ft²', w: '2880\\div144=20', a: '20 ft²', dir: 'small → big: divide' },
  { q: '(c) 27 ft² → yd²', w: '27\\div9=3', a: '3 yd²', dir: 'small → big: divide' },
  { q: '(d) 3.5 m² → cm²', w: '3.5\\times10\\,000=35\\,000', a: '35&#8239;000 cm²', dir: 'big → small: multiply' },
  { q: '(e) 12 m² → ft²', w: '12\\times10.76=129.12', a: 'about 129.1 ft²', dir: 'big → small: multiply' }
];
const unitSq = {
  title: 'Square units: the number is used twice',
  height: 350,
  minW: 960,
  choices: [{ v: 'ft', label: '1 ft² = ? in²' }, { v: 'yd', label: '1 yd² = ? ft²' }, { v: 'm', label: '1 m² = ? cm²' }, { sep: 'Example 8 check:' }, { v: 'ex8', label: '(a)–(e)' }],
  ask: (k) => (k === 'ex8' ? 'Example 8: change each area. Big unit → small unit: <b>multiply</b>. Small → big: <b>divide</b>.' : `How many square ${US[k].small === 'in' ? 'inches' : US[k].small === 'ft' ? 'feet' : 'centimetres'} are in 1 ${US[k].big}²?`),
  make(stage, key, ex) {
    const W = ex.W;
    if (key === 'ex8') {
      const X = 30, rows = ROWS8.map((r, i) => {
        const y = 14 + i * 64;
        const q = hide(add(stage, box(cbox('u3l8-eq', `<b>${r.q}</b>`), 260, 52), X, y));
        const dd = hide(add(stage, box(cbox('u3l8-eq', `<small>${r.dir}</small>`), 220, 52), X + 270, y));
        const w = hide(add(stage, box(cbox('u3l8-eq', T(r.w)), W - 750, 52), X + 500, y));
        const a = hide(add(stage, box(cbox('u3l8-eq good mid', `<b>${r.a}</b>`), 190, 52), W - 210, y));
        return [q, dd, w, a];
      });
      return ROWS8.map((r, i) => ({ cap: `${r.q}: ${r.dir}. ${r.w.replace(/\\times/g, ' × ').replace(/\\div/g, ' ÷ ').replace(/\\,/g, '\u202f').replace(/=/g, ' = ')} → <b>${r.a}</b>`, run: async (c) => { const [q, dd, w, a] = rows[i]; await c.fadeIn(q); await c.fadeIn(dd); await c.fadeIn(w); await c.pop(a); } }));
    }
    const d = US[key], S = 280, X0 = 84, Y0 = 18, n = d.n, cs = S / n;
    const svg = add(stage, svgEl('svg', { width: 420, height: 350, class: 'u3l8-svg' }), 0, 0);
    svgEl('rect', { x: X0, y: Y0, width: S, height: S, fill: '#f5ecdf', stroke: '#6e4a1c', 'stroke-width': 4 }, svg);
    const bigLab = stxt(svg, X0 + S / 2, Y0 + S / 2 + 10, `1 ${d.big}²`, { size: 30, fill: '#6e4a1c' });
    const sides = hide(svgEl('g', {}, svg));
    stxt(sides, X0 + S / 2, Y0 + S + 24, `${d.bigU} = ${n} ${d.small}`, { size: 18 }); const sl = stxt(sides, X0 - 12, Y0 + S / 2, `${n} ${d.small}`, { size: 18, anchor: 'end' }); void sl;
    const vl = hide(svgEl('g', { stroke: '#9a6a24', 'stroke-width': n > 20 ? 0.6 : 2 }, svg)), hl = hide(svgEl('g', { stroke: '#9a6a24', 'stroke-width': n > 20 ? 0.6 : 2 }, svg));
    for (let i = 1; i < n; i++) { svgEl('line', { x1: X0 + i * cs, y1: Y0, x2: X0 + i * cs, y2: Y0 + S }, vl); svgEl('line', { x1: X0, y1: Y0 + i * cs, x2: X0 + S, y2: Y0 + i * cs }, hl); }
    const strip = hide(svgEl('rect', { x: X0, y: Y0, width: cs, height: S, fill: 'rgba(201,58,51,.25)', stroke: '#c93a33', 'stroke-width': 2 }, svg));
    const one = hide(svgEl('rect', { x: X0, y: Y0, width: cs, height: cs, fill: '#3fae6a', stroke: '#0e5e41', 'stroke-width': 1 }, svg));
    const X = 440, EW = W - X - 14;
    const e1 = eqBox(stage, X, 30, EW, `Each side: ${d.bigU} = <b>${n} ${d.small}</b>`);
    const e2 = eqBox(stage, X, 90, EW, `${n} strips, each with ${n} squares`);
    const e3 = eqBox(stage, X, 150, EW, `${T(d.T)}: &nbsp;<b>1 ${d.big}² = ${d.res} ${d.small}²</b>`, 'res');
    const e4 = eqBox(stage, X, 220, EW, `Not ${n}! ${n} ${d.small}² is only <b>one strip</b>.`, 'bad');
    const s = hide(stamp(stage, `${d.res} ${d.small}² ✓`, { ok: true, x: X + EW / 2, y: 310, rotate: -5 }));
    return [
      { cap: `A square ${d.bigU} by ${d.bigU}: its area is <b>1 ${d.big}²</b>. Each side is <b>${n} ${d.small}</b>.`, run: async (c) => { await c.fadeIn(sides); await c.fadeIn(e1); } },
      { cap: `Cut it into ${n} strips…`, run: async (c) => { await fadeOut(c, bigLab, 200); await c.fadeIn(vl, 600); } },
      { cap: `…and cut every strip into ${n} small squares, each <b>1 ${d.small}²</b>.`, run: async (c) => { await c.fadeIn(hl, 600); await c.pop(one); await c.fadeIn(e2); } },
      { cap: `${n} rows of ${n}: ${n} × ${n} = <b>${d.res} ${d.small}²</b>. The ${n} is used <b>twice</b>, once for each side.`, run: async (c) => { await c.pop(e3); await stampIn(c, s); } },
      { cap: `Watch out: ${n} ${d.small}² is just <b>one strip</b>, not the whole square.`, run: async (c) => { await c.fadeIn(strip); await c.fadeIn(e4); } }
    ];
  }
};

/* =====================================================================================
 * 10. Owen's floor: area, 10% extra, boxes rounded up, cost (Example 9)
 * ===================================================================================== */
const flooring = {
  title: 'The cost of a job: round the boxes up',
  height: 392,
  minW: 960,
  choices: [{ sep: 'Example 9 check:' }, { v: 'o', label: 'Owen’s floor' }],
  ask: 'Example 9: a room <b>12 ft 6 in</b> by <b>10 ft</b>. One box covers <b>23.4 ft²</b> and costs <b>$54.99</b>. Add 10% for waste.',
  make(stage, key, ex) {
    const W = ex.W, k = 20, RX = 40, RY = 34, RW = 12.5 * k, RH = 10 * k;
    const svg = add(stage, svgEl('svg', { width: 340, height: 270, class: 'u3l8-svg' }), 0, 0);
    svgEl('rect', { x: RX, y: RY, width: RW, height: RH, fill: '#fbf8f2', stroke: '#3a4254', 'stroke-width': 4 }, svg);
    const planks = svgEl('g', {}, svg), pl = [];
    for (let j = 0; j < 10; j++) { const r = svgEl('rect', { x: RX + 2, y: RY + 2 + j * (RH - 4) / 10, width: 0, height: (RH - 4) / 10 - 2, rx: 2, fill: j % 2 ? '#c99a62' : '#d9ae78' }, planks); pl.push(r); }
    const lenL = stxt(svg, RX + RW / 2, RY - 10, '12 ft 6 in', { size: 18 }); stxt(svg, RX + RW + 8, RY + RH / 2 + 6, '10 ft', { size: 18, anchor: 'start' });
    const boxes = [];
    for (let i = 0; i < 6; i++) boxes.push(hide(add(stage, box(cbox('u3l8-box', `<b>Box ${i + 1}</b><br>23.4 ft²`), 80, 52), 30 + i * 90, 300)));
    const blab = hide(add(stage, box(cbox('u3l8-eq', ''), 560, 30), 30, 360));
    blab.style.fontSize = '18px';
    const X = 580, EW = W - X - 14;
    const e1 = eqBox(stage, X, 10, EW, `6 in ${T('=6\\div12=0.5')} ft → <b>12.5 ft</b>`);
    const e2 = eqBox(stage, X, 60, EW, `${T('A=12.5\\times10=125')} ft²`);
    const e3 = eqBox(stage, X, 110, EW, `${T('125\\times1.10=137.5')} ft²`);
    const e4 = eqBox(stage, X, 160, EW, `${T('137.5\\div23.4=5.87\\ldots')} → <b>6 boxes</b>`, 'res');
    const e5 = eqBox(stage, X, 210, EW, `${T('6\\times\\$54.99=\\$329.94')}`);
    const e6 = eqBox(stage, X, 260, EW, `${T('\\$329.94\\times1.05\\approx\\$346.44')}`, 'good');
    const s = hide(stamp(stage, '$346.44 ✓', { ok: true, x: X + EW / 2, y: 340, rotate: -5 }));
    return [
      { cap: `(a) Change 12 ft 6 in to feet: 6 in = 6 ÷ 12 = 0.5 ft, so the room is <b>12.5 ft</b> long.`, run: async (c) => { await c.fadeIn(e1); lenL.textContent = '12.5 ft'; } },
      { cap: `Area: 12.5 × 10 = <b>125 ft²</b>.`, run: async (c) => { await tween(c, 1400, (t) => pl.forEach((r, j) => r.setAttribute('width', Math.max(0, Math.min(1, t * 1.6 - j * 0.06)) * (RW - 4)))); await c.fadeIn(e2); } },
      { cap: `(b) Add 10% for cutting and mistakes: 125 × 1.10 = <b>137.5 ft²</b>.`, run: (c) => c.fadeIn(e3) },
      { cap: `(c) Each box covers 23.4 ft²: 137.5 ÷ 23.4 = 5.87… boxes. 5 boxes cover only 117 ft² ✗`, run: async (c) => { blab.firstChild.innerHTML = '5 boxes: 5 × 23.4 = 117 ft², less than 137.5 ✗'; await c.fadeIn(blab); for (const b of boxes.slice(0, 5)) await c.pop(b, 200); } },
      { cap: `Round <b>up</b>: Owen must buy <b>6 boxes</b> (140.4 ft² ✓).`, run: async (c) => { blab.firstChild.innerHTML = '6 boxes: 6 × 23.4 = 140.4 ft², enough ✓'; boxes.forEach((b) => b.classList.add('on')); await c.pop(boxes[5]); await c.pop(e4); } },
      { cap: `(d) 6 × $54.99 = $329.94. With 5% GST: $329.94 × 1.05 = $346.437 ≈ <b>$346.44</b>.`, run: async (c) => { await c.fadeIn(e5); await c.fadeIn(e6); await stampIn(c, s); } }
    ];
  }
};

mountExplainers({ count, slide, sameUnits, halfTri, trap, circleSq, slices, pizza, unitSq, flooring });

/* ============ Math History: Ahmes's round field (Rhind papyrus, problem 50) ============ */
function histAnim() {
  const svg = document.getElementById('u3l8-hist'); if (!svg) return;
  const NS = 'http://www.w3.org/2000/svg', mk = (t, a, p = svg) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); p.appendChild(e); return e; };
  mk('rect', { x: 0, y: 0, width: 600, height: 300, rx: 14, fill: '#fffaf1' });
  const cap = mk('text', { x: 300, y: 30, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 20, fill: '#4a2c14' });
  const c = 26, X0 = 40, Y0 = 50, S = 9 * c, cx = X0 + S / 2, cy = Y0 + S / 2;
  const grid = mk('g', { stroke: '#e4d6bd', 'stroke-width': 1 });
  for (let i = 0; i <= 9; i++) { mk('line', { x1: X0 + i * c, y1: Y0, x2: X0 + i * c, y2: Y0 + S }, grid); mk('line', { x1: X0, y1: Y0 + i * c, x2: X0 + S, y2: Y0 + i * c }, grid); }
  const field = mk('circle', { cx, cy, r: S / 2, fill: 'rgba(122,74,38,.16)', stroke: '#7a4a26', 'stroke-width': 3 });
  const L = Math.PI * S; field.setAttribute('stroke-dasharray', `${L} ${L}`);
  const dia = mk('g', {});
  mk('line', { x1: X0, y1: cy, x2: X0 + S, y2: cy, stroke: '#4a2c14', 'stroke-width': 2, 'stroke-dasharray': '6 4' }, dia);
  const dl = mk('text', { x: cx, y: cy - 8, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 16, fill: '#4a2c14' }, dia); dl.textContent = '9 khet';
  const sq = mk('rect', { x: X0, y: Y0, width: S, height: S, fill: 'none', stroke: '#b07a12', 'stroke-width': 4 });
  const sqFill = mk('rect', { x: X0 + c / 2, y: Y0 + c / 2, width: 8 * c, height: 8 * c, fill: 'rgba(176,122,18,.18)' });
  const t1 = mk('text', { x: 430, y: 110, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 26, fill: '#b07a12' }); t1.textContent = '8 × 8 = 64';
  const t2 = mk('text', { x: 430, y: 170, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 22, fill: '#7a4a26' }); t2.textContent = 'π × 4.5² ≈ 63.6';
  const t3 = mk('text', { x: 430, y: 220, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 18, fill: '#4a2c14' }); t3.textContent = 'almost the same!';
  const CAPS = [[0, 'A round field, 9 khet across'], [3, 'Take away 1/9: 9 − 1 = 8'], [6, 'Make a square: 8 by 8'], [8.2, 'Square and circle: nearly equal']];
  const cl = (t) => Math.max(0, Math.min(1, t));
  const draw = (s) => {
    let txt = CAPS[0][1]; for (const [t0, x] of CAPS) if (s >= t0) txt = x; cap.textContent = txt;
    field.setAttribute('stroke-dashoffset', L * (1 - cl(s / 1.6)));
    dia.setAttribute('opacity', cl((s - 1.4) / 0.5));
    const sh = cl((s - 3.4) / 2) * c / 2;   // the square shrinks by half a cell on every side
    sq.setAttribute('opacity', cl((s - 2.6) / 0.5)); sq.setAttribute('x', X0 + sh); sq.setAttribute('y', Y0 + sh); sq.setAttribute('width', S - 2 * sh); sq.setAttribute('height', S - 2 * sh);
    sqFill.setAttribute('opacity', cl((s - 6) / 0.6));
    t1.setAttribute('opacity', cl((s - 6.2) / 0.6)); t2.setAttribute('opacity', cl((s - 8.2) / 0.6)); t3.setAttribute('opacity', cl((s - 9.4) / 0.6));
  };
  let raf = 0;
  const play = () => {
    cancelAnimationFrame(raf);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { draw(12); return; }
    const t0 = performance.now(); const tick = (now) => { const s = (now - t0) / 1000; draw(s); if (s < 11) raf = requestAnimationFrame(tick); }; raf = requestAnimationFrame(tick);
  };
  draw(12);
  svg.addEventListener('click', play);
  const btn = svg.closest('.hist-anim') && svg.closest('.hist-anim').querySelector('.hist-play'); if (btn) btn.addEventListener('click', play);
  let seen = false;
  new IntersectionObserver((es) => { es.forEach((e) => { if (e.isIntersecting && !seen) { seen = true; play(); } }); }, { threshold: 0.5 }).observe(svg);
}
histAnim();

/* ============ Stand Up Break! — area at the whiteboards ============ */
{
  const n = (v) => String(rnd(v, 2));
  standup('u3l8', {
    intro: 'Pick the formula, use the height at a right angle, write square units, and estimate to check.',
    levels: {
      BEG: (r) => r.pick([
        () => { const l = r.int(4, 15) + r.pick([0, 0.5]), w = r.int(2, 9) + r.pick([0, 0.5]); return { text: `A rectangular ${r.pick(['garden', 'bulletin board', 'patio', 'rug'])} is <b>${n(l)} m</b> long and <b>${n(w)} m</b> wide. Find its area.`, q: '', a: [`A=lw=${n(l)}\\times${n(w)}=${n(l * w)}\\text{ m}^2`] }; },
        () => { const b = r.int(4, 16), hh = r.int(3, 12); return { text: `A triangle has a base of <b>${b} cm</b> and a height of <b>${hh} cm</b>. Find its area.`, q: '', a: [`A=${b}\\times${hh}\\div2=${n(b * hh / 2)}\\text{ cm}^2`] }; },
        () => { const b = r.int(5, 14), hh = r.int(3, 9), sl = hh + r.int(1, 3); return { text: `A parallelogram has a base of <b>${b} in</b>, a height of <b>${hh} in</b> and a slanted side of <b>${sl} in</b>. Find its area.`, q: '', a: [`A=bh=${b}\\times${hh}=${b * hh}\\text{ in}^2`, `\\text{(the ${sl} in side is not used)}`] }; }
      ])(),
      PRG: (r) => r.pick([
        () => { const a = r.int(3, 9), b = a + r.int(2, 8), hh = r.int(2, 8); return { text: `A trapezoid has parallel sides <b>${a} m</b> and <b>${b} m</b>, <b>${hh} m</b> apart. Find its area.`, q: '', a: [`A=(${a}+${b})\\times${hh}\\div2`, `=${a + b}\\times${hh}\\div2=${n((a + b) * hh / 2)}\\text{ m}^2`] }; },
        () => { const useD = r.chance(0.5), rr = r.int(2, 30), what = r.pick(['clock', 'mirror', 'tabletop', 'trampoline', 'hot tub cover']); return { text: `A round ${what} has a ${useD ? 'diameter' : 'radius'} of <b>${useD ? 2 * rr : rr} in</b>. Estimate its area, then find it to the nearest tenth.`, q: '', a: [...(useD ? [`r=${2 * rr}\\div2=${rr}`] : []), `\\text{estimate: }3\\times${rr}\\times${rr}=${3 * rr * rr}`, `A=\\pi\\times${rr}^2=${(Math.PI * rr * rr).toFixed(1)}\\text{ in}^2`] }; }
      ])(),
      MAS: (r) => r.pick([
        () => { const l = r.pick([12, 15, 18, 21, 24]), w = r.pick([9, 12, 13.5, 15, 16.5]), price = r.pick([24.95, 28.5, 31.99, 35.75]), ft = l * w, yd = ft / 9; return { text: `Carpet costs <b>$${price.toFixed(2)} per yd²</b>. A room is <b>${l} ft</b> by <b>${n(w)} ft</b>. Find the area in ft², then in yd², then the cost before tax.`, q: '', a: [`${l}\\times${n(w)}=${n(ft)}\\text{ ft}^2`, `${n(ft)}\\div9=${n(yd)}\\text{ yd}^2`, `${n(yd)}\\times${price.toFixed(2)}=\\$${rnd(yd * price, 2).toFixed(2)}`] }; },
        () => { const l = r.int(8, 16), w = r.int(6, 12), cov = r.pick([18.5, 20.0, 22.5, 24.0]), price = r.pick([39.99, 49.99, 59.99]), need = rnd(l * w * 1.1, 2), bx = Math.ceil(need / cov - 1e-9); return { text: `Flooring for a room <b>${l} ft</b> by <b>${w} ft</b>. Add 10% for waste. One box covers <b>${cov} ft²</b> and costs <b>$${price}</b>. How many boxes, and what do they cost before tax?`, q: '', a: [`${l}\\times${w}=${l * w};\\ ${l * w}\\times1.10=${n(need)}\\text{ ft}^2`, `${n(need)}\\div${cov}=${(need / cov).toFixed(2)}\\ldots\\to${bx}\\text{ boxes}`, `${bx}\\times${price}=\\$${rnd(bx * price, 2).toFixed(2)}`] }; }
      ])()
    }
  });
}
