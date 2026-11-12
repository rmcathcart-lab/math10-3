/* Math 10-3 · Unit 6 · Lesson 3 — Drawing Enlargements and Reductions.
 * Explainers (Class view unless marked Full): every length × k (a copy that grows and shrinks; Example 1 and Example 2
 * checks), add vs multiply (a verdict comparison with the diagonal test), the grid method with the image appearing vertex
 * by vertex beside a move table (Example 3 and 4 checks), slanted sides and half squares (Full), the ruler and protractor
 * method with a ruler and a protractor that copy the angles (Example 5 and 6 checks), the projection method with rays and
 * a measuring tape from O (Example 7 and 8 checks, the "measure from O" trap), why projecting gives a similar shape
 * (Full: k slides the corners along the rays), fitting a photo on a print or poster (Example 9 checks) and checking a
 * drawing with copy ÷ original stamps (Example 10 check). Also the hands-on grid drawing (Geo.gridDraw), the static
 * figures, the pantograph in the Math History box and the Stand Up Break. */
import { h, add, tex, svgEl, tween, anim, drawIn, stamp, stampIn, pulse, mountExplainers } from '../blocks.js';
import { Geo } from '../geo.js';
import { standup } from '../standup.js';

const A = Geo.at, arcD = Geo.arcD;
const INK = '#1c2230', BLUE = '#1f5bd6', GREEN = '#12805a', RED = '#c93a33', AMBER = '#c27a0e', BROWN = '#9a6a24', GREY = '#9aa0ab', SLATE = '#5b6475';
const T = (s) => tex(String(s));
const RAD = Math.PI / 180;
/** a number as the booklet writes it: up to 2 decimals, no trailing zeros */
const nf = (v) => String(Math.round(v * 100 + (v >= 0 ? 1e-9 : -1e-9)) / 100);
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const op = (c, el, to, ms = 350) => anim(c, el, [{ opacity: to }], ms);
const pp = (el) => { el.style.transformBox = 'fill-box'; el.style.transformOrigin = 'center'; return el; };
const stageSvg = (stage, W, H) => add(stage, svgEl('svg', { class: 'u6l3-svg', width: W, height: H, viewBox: `0 0 ${W} ${H}` }), 0, 0);
/** an HTML label centred on (x, y): a 0×0 holder (so c.pop's scale doesn't undo the centring) */
function lab(host, html, x, y, cls = '') {
  const hold = h('div', 'u6l3-hold'); hold.appendChild(h('div', 'u6l3-lab ' + cls, html)); add(host, hold, x, y); hold.inner = hold.firstChild; return hold;
}
function line(parent, P, Q, o = {}) {
  return svgEl('line', { x1: P[0].toFixed(2), y1: P[1].toFixed(2), x2: Q[0].toFixed(2), y2: Q[1].toFixed(2), stroke: o.color || INK, 'stroke-width': o.width || 3.2, 'stroke-linecap': o.cap || 'round', 'stroke-dasharray': o.dash || null, class: o.cls === undefined ? 'bk-stroke' : o.cls, opacity: o.opacity ?? null }, parent);
}
function path(parent, d, o = {}) {
  return svgEl('path', { d, fill: o.fill || 'none', 'fill-opacity': o.fo ?? null, stroke: o.stroke === undefined ? INK : o.stroke, 'stroke-width': o.width || 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-dasharray': o.dash || null, class: o.cls === undefined ? 'bk-stroke' : o.cls, opacity: o.opacity ?? null }, parent);
}
const polyD = (P, closed = true) => 'M' + P.map((p) => p[0].toFixed(2) + ' ' + p[1].toFixed(2)).join('L') + (closed ? 'Z' : '');
const txt = (parent, x, y, s, o = {}) => pp(Geo.text(parent, x, y, s, Object.assign({ size: 21 }, o)));
const dot = (parent, p, o = {}) => Geo.dot(parent, p, o);
const cen = (P) => [P.reduce((s, p) => s + p[0], 0) / P.length, P.reduce((s, p) => s + p[1], 0) / P.length];
/** a point beyond p, away from c */
const away = (p, c, d) => { const dx = p[0] - c[0], dy = p[1] - c[1], L = Math.hypot(dx, dy) || 1; return [p[0] + dx / L * d, p[1] + dy / L * d]; };
/** a small right-angle square at V between directions d and d + 90 (math degrees) */
function square(parent, V, d, s = 16, o = {}) {
  const u = A([0, 0], d, 1), v = A([0, 0], d + 90, 1);
  return path(parent, polyD([[V[0] + u[0] * s, V[1] + u[1] * s], [V[0] + (u[0] + v[0]) * s, V[1] + (u[1] + v[1]) * s], [V[0] + v[0] * s, V[1] + v[1] * s]], false), { width: o.width || 2.2, stroke: o.color || INK, cls: '' });
}
/** an angle arc at V from direction a1 sweeping counterclockwise by span, with a label */
function arcLab(parent, V, a1, span, s, o = {}) {
  const r = o.r || 30, g = svgEl('g', {}, parent);
  path(g, arcD(V, r, a1, span), { stroke: o.color || INK, width: 2.4, cls: '' });
  if (s) { const q = A(V, a1 + span / 2, r + (o.gap || 20)); txt(g, q[0], q[1], s, { size: o.size || 18, color: o.color || INK }); }
  return pp(g);
}
const dirTo = Geo.dirTo;
/** HTML lines (KaTeX welcome) stacked in a column at (x, y); each starts hidden */
function lines(stage, x, y, w, arr, cls = '') {
  const box = h('div', 'u6l3-lines ' + cls); box.style.width = w + 'px'; add(stage, box, x, y);
  return arr.map((s) => { const e = h('div', 'u6l3-ln', s); box.appendChild(e); e.style.opacity = 0; return e; });
}
const figSvg = (host, W, H) => { host.style.width = W + 'px'; host.style.height = H + 'px'; return svgEl('svg', { class: 'geo-svg u6l3-svg', width: W, height: H, viewBox: `0 0 ${W} ${H}` }, host); };
/** a light grid of cols × rows squares (cell px) with its corner at (x, y) */
function grid(parent, x, y, cols, rows, cell, o = {}) {
  let d = ''; for (let i = 0; i <= cols; i++) d += `M${x + i * cell} ${y}V${y + rows * cell}`; for (let j = 0; j <= rows; j++) d += `M${x} ${y + j * cell}H${x + cols * cell}`;
  path(parent, d, { stroke: o.color || '#d3d8e1', width: 1.2, cls: '' });
  const G = (gx, gy) => [x + gx * cell, y + (rows - gy) * cell];
  return G;
}
/** "4 right, 2 up" for a move (dx, dy) */
function moveText(dx, dy) {
  const s = [];
  if (Math.abs(dx) > 1e-9) s.push(`${nf(Math.abs(dx))} ${dx > 0 ? 'right' : 'left'}`);
  if (Math.abs(dy) > 1e-9) s.push(`${nf(Math.abs(dy))} ${dy > 0 ? 'up' : 'down'}`);
  return s.join(', ');
}
/** an L-shaped move (across, then up/down) from P to Q in screen px, with the counts written beside the legs */
function moveLegs(parent, P, Q, dx, dy, C, color) {
  const g = svgEl('g', {}, parent), M = [Q[0], P[1]];
  const legs = [];
  if (Math.abs(dx) > 1e-9) legs.push(path(g, polyD([P, M], false), { stroke: color, width: 3, dash: '7 5' }));
  if (Math.abs(dy) > 1e-9) legs.push(path(g, polyD([M, Q], false), { stroke: color, width: 3, dash: '7 5' }));
  const labs = [];
  if (Math.abs(dx) > 1e-9) labs.push(txt(g, (P[0] + M[0]) / 2, P[1] + (P[1] < C[1] ? -15 : 16), nf(Math.abs(dx)), { size: 18, color, weight: 800 }));
  if (Math.abs(dy) > 1e-9) labs.push(txt(g, M[0] + (M[0] < C[0] ? -15 : 15), (M[1] + Q[1]) / 2, nf(Math.abs(dy)), { size: 18, color, weight: 800 }));
  labs.forEach((l) => hide(l));
  g.style.opacity = 0;
  g.play = async (c) => { g.style.opacity = 1; for (const l of legs) await drawIn(l, 420, c); for (const l of labs) await c.pop(l, 260); };
  return g;
}
/** a ruler (cm marks every u px) that can slide under a segment */
function ruler(parent, x, y, cm, u) {
  const g = svgEl('g', { class: 'u6l3-ruler' }, parent); g.style.transformBox = 'view-box'; g.style.transformOrigin = '0 0';
  const w = cm * u + 30;
  svgEl('rect', { x: x - 15, y, width: w, height: 32, rx: 4, fill: '#fbe9b7', stroke: '#b38a2e', 'stroke-width': 2 }, g);
  for (let i = 0; i <= cm * 10; i++) { const X = x + i * u / 10, L = i % 10 === 0 ? 12 : i % 5 === 0 ? 8 : 5; svgEl('line', { x1: X, x2: X, y1: y, y2: y + L, stroke: '#6b4f12', 'stroke-width': i % 10 === 0 ? 1.8 : 1 }, g); }
  for (let i = 0; i <= cm; i++) { const t = svgEl('text', { x: x + i * u, y: y + 25, 'font-size': 12, 'text-anchor': 'middle', fill: '#6b4f12', 'font-weight': 700 }, g); t.textContent = i; }
  return g;
}
/** a protractor that is only a picture: no dragging, no handles, Pencil ink passes over it */
function staticProt(P) {
  P.g.style.pointerEvents = 'none'; P.g.classList.remove('geo-drag'); P.g.removeAttribute('data-tap');
  P.g.querySelectorAll('[data-tap]').forEach((e) => e.removeAttribute('data-tap'));
  P.g.querySelectorAll('.geo-knob').forEach((k) => { k.style.display = 'none'; k.classList.remove('geo-drag'); });
  return P;
}
/** circle intersection (the one to the left of P → Q) */
function circX(P, r1, Q, r2, left = true) {
  const dx = Q[0] - P[0], dy = Q[1] - P[1], L = Math.hypot(dx, dy), a = (r1 * r1 - r2 * r2 + L * L) / (2 * L), hh = Math.sqrt(Math.max(0, r1 * r1 - a * a));
  const mx = P[0] + a * dx / L, my = P[1] + a * dy / L, s = left ? 1 : -1;
  return [mx - s * hh * dy / L, my + s * hh * dx / L];
}

/* ======================================================================================
 * 1. Multiply every length (Example 1 and Example 2 checks)
 * ====================================================================================== */
// quadrilateral ABCD (cm, y up): AB 6, BC 10, CD 8, DA 4, ∠A 75°
const QD = (() => { const D = [4 * Math.cos(75 * RAD), 4 * Math.sin(75 * RAD)], B = [6, 0]; const C1 = circX(B, 10, D, 8, true), C2 = circX(B, 10, D, 8, false); return [[0, 0], B, C1[1] > C2[1] ? C1 : C2, D]; })();
const BIRD = [[0, 0], [15, 0], [15, 12], [7.5, 19.35], [0, 12]];
const scale = {
  title: 'Multiply every length by k',
  height: 420,
  choices: [{ v: 'demo', label: 'grow and shrink' }, { sep: 'Example 1 check:' }, { v: 3, label: T('k=3') }, { v: 0.5, label: T('k=0.5') }, { v: 1.25, label: T('k=1.25') }, { v: 'b', label: '(b) back to the original' }, { sep: 'Example 2 check:' }, { v: 'bird', label: 'the birdhouse' }],
  ask: (v) => (v === 'demo' ? `Copy ${T('ABCD')} with ${T('k=2')}, then with ${T('k=0.5')}. What changes, and what stays the same?`
    : v === 'b' ? `Example 1(b): a copy made with ${T('k=2.5')} has a side of 20 cm. How long was that side on the original?`
      : v === 'bird' ? 'Example 2: the old birdhouse front has a 15 cm base. The new one has a 24 cm base. Find k and the new lengths.'
        : `Example 1: copy ${T('ABCD')} with ${T('k=' + v)}. Find every side and ${T('\\angle A')}.`),
  make(stage, v, ex) {
    const W = ex.W, H = 420, ox = Math.max(0, (W - 980) / 2);
    if (v === 'b') return scaleBack(stage, W, H, ox);
    if (v === 'bird') return scaleBird(stage, W, H, ox);
    const k0 = v === 'demo' ? 2 : v, unit = { demo: 13.5, 3: null, 0.5: 26, 1.25: 22 }[v];
    const mk = (k) => Geo.similar(stage, { x: ox, y: 0, width: 620, height: H, pts: QD, k, unit, names: ['ABCD', "A'B'C'D'"], labels: true, units: 'cm', angles: [['75°', '', '', ''], ['75°', '', '', '']], image: false, size: 18, pad: 40 });
    let S = mk(k0);
    const L = (k) => [`${T("A'B'=6\\times" + k + '=' + nf(6 * k))} cm`, `${T("B'C'=10\\times" + k + '=' + nf(10 * k))} cm`, `${T("C'D'=8\\times" + k + '=' + nf(8 * k))} cm`, `${T("D'A'=4\\times" + k + '=' + nf(4 * k))} cm`, `${T("\\angle A'=75^\\circ")} (no change)`];
    const kind = (k) => (k > 1 ? 'enlargement' : 'reduction');
    if (v === 'demo') {
      const tag = hide(lab(stage, '', ox + 800, 70, 'u6l3-tag'));
      const ln = lines(stage, ox + 650, 130, 320, ['Every side <b>× 2</b>: twice as long', 'Every side <b>× 0.5</b>: half as long', 'Every angle: <b>the same</b>']);
      return [
        { cap: `${T('ABCD')}: sides 6, 10, 8 and 4 cm, and ${T('\\angle A=75^\\circ')}. Matching parts get the same colour.`, run: (c) => pulse(c, S.el, 1.02, 500) },
        { cap: `${T('k=2')}: multiply <b>every</b> side by 2. A bigger copy: an <b>enlargement</b>.`, run: async (c) => { tag.inner.innerHTML = `${T('k=2>1')}`; await c.pop(tag); await S.grow(c, 1400); await c.pop(ln[0]); } },
        { cap: `${T('k=0.5')}: multiply every side by 0.5. A smaller copy: a <b>reduction</b>.`, run: async (c) => { tag.inner.innerHTML = `${T('k=0.5<1')}`; S.setK(0.5); await S.grow(c, 1200); await c.pop(ln[1]); } },
        { cap: 'The angles <b>never</b> change. The copy has the same shape, so it is <b>similar</b>.', run: async (c) => { await c.pop(ln[2]); await Promise.all(S.imageEls.marks.map((m) => pulse(c, pp(m.mark), 1.4, 600))); } }
      ];
    }
    const ln = lines(stage, ox + 640, 70, 330, L(v));
    const tag = hide(lab(stage, `${T('k=' + v + (v > 1 ? '>1' : '<1'))}: ${kind(v)}`, ox + 805, 36, 'u6l3-tag'));
    const st = hide(stamp(stage, 'similar ✓', { ok: true, x: ox + 805, y: 360, size: 'sm' }));
    return [
      { cap: `${T('k=' + v)} is ${v > 1 ? '<b>more</b>' : '<b>less</b>'} than 1, so the copy is ${v > 1 ? 'bigger: an <b>enlargement</b>' : 'smaller: a <b>reduction</b>'}.`, run: (c) => c.pop(tag) },
      { cap: `Multiply each side by ${v}.`, run: async (c) => { await S.grow(c, 1300); for (let i = 0; i < 4; i++) await c.pop(ln[i], 260); } },
      { cap: `The angle does not change: ${T("\\angle A'=75^\\circ")}, the same as ${T('\\angle A')}.`, run: async (c) => { await c.pop(ln[4]); await pulse(c, pp(S.imageEls.marks[0].mark), 1.5, 600); } },
      { cap: `Every side ${T('\\times' + v)}, every angle the same: the copy is similar.`, run: (c) => stampIn(c, st) }
    ];
  }
};
function scaleBack(stage, W, H, ox) {
  const svg = stageSvg(stage, W, H), u = 22, x0 = ox + 60;
  const nb = svgEl('rect', { x: x0, y: 120, width: 20 * u, height: 34, rx: 6, fill: '#dbe7fb', stroke: BLUE, 'stroke-width': 3 }, svg);
  const nl = txt(svg, x0 + 10 * u, 100, 'copy: 20 cm', { color: BLUE, weight: 800 });
  const ob = hide(svgEl('rect', { x: x0, y: 270, width: 20 * u, height: 34, rx: 6, fill: '#efe4d2', stroke: BROWN, 'stroke-width': 3 }, svg));
  const ol = hide(txt(svg, x0 + 4 * u, 250, 'original: 8 cm', { color: BROWN, weight: 800 }));
  const arr = hide(lab(stage, `${T('\\div2.5')}`, x0 + 10 * u + 70, 212, 'u6l3-op'));
  const ar2 = hide(path(svg, `M${x0 + 10 * u} 165 L${x0 + 10 * u} 255`, { stroke: RED, width: 3.5, cls: '' }));
  const ln = lines(stage, ox + 640, 110, 330, [`Original ${T('=')} new ${T('\\div k')}`, `${T('=20\\div2.5=8')} cm`, `Check: ${T('8\\times2.5=20')} ✓`]);
  const st = hide(stamp(stage, '8 cm ✓', { ok: true, x: ox + 805, y: 330, size: 'sm' }));
  return [
    { cap: 'The copy is 20 cm. It was made by multiplying by 2.5.', run: (c) => pulse(c, pp(nb), 1.04, 500) },
    { cap: `To go back to the original, <b>undo</b> the multiplying: <b>divide</b> by ${T('k')}.`, run: async (c) => { ar2.style.opacity = 1; await c.pop(ar2); await c.pop(arr); await c.pop(ln[0]); } },
    { cap: `${T('20\\div2.5=8')}. The original side was <b>8 cm</b>.`, run: async (c) => { ob.style.opacity = 1; await tween(c, 900, (t) => ob.setAttribute('width', (20 - 12 * t) * u)); await c.pop(ol); await c.pop(ln[1]); } },
    { cap: `Check: ${T('8\\times2.5=20')} ✓`, run: async (c) => { await c.pop(ln[2]); await stampIn(c, st); void nl; } }
  ];
}
function scaleBird(stage, W, H, ox) {
  const S = Geo.similar(stage, { x: ox, y: 0, width: 620, height: H, pts: BIRD, k: 1.6, labels: [['15 cm', '12 cm', '10.5 cm', '10.5 cm', '12 cm'], ['24 cm', '19.2 cm', '16.8 cm', '16.8 cm', '19.2 cm']], angles: [['', '', '', '91°', ''], ['', '', '', '91°', '']], image: false, size: 17, pad: 40 });
  const ln = lines(stage, ox + 640, 40, 330, [`(a) ${T('k=24\\div15=1.6')}`, `(b) walls: ${T('12\\times1.6=19.2')} cm`, `roof edges: ${T('10.5\\times1.6=16.8')} cm`, '(c) the peak is still <b>91°</b>', `(d) depth: ${T('14\\times1.6=22.4')} cm`]);
  const deep = hide(lab(stage, `<span>old depth 14 cm</span><span>→ new depth 22.4 cm</span>`, ox + 805, 360, 'u6l3-chip u6l3-col'));
  return [
    { cap: 'The old front has a <b>15 cm</b> base. The new front will have a <b>24 cm</b> base.', run: (c) => pulse(c, S.el, 1.02, 500) },
    { cap: `(a) ${T('k=\\text{new}\\div\\text{original}=24\\div15=1.6')}. More than 1: an enlargement.`, run: (c) => c.pop(ln[0]) },
    { cap: `(b) Multiply every length by 1.6: walls ${T('12\\times1.6=19.2')} cm, roof edges ${T('10.5\\times1.6=16.8')} cm.`, run: async (c) => { await S.grow(c, 1300); await c.pop(ln[1]); await c.pop(ln[2]); } },
    { cap: '(c) Angles don’t change: the peak of the new roof is still <b>91°</b>.', run: async (c) => { await c.pop(ln[3]); await pulse(c, pp(S.imageEls.marks[3].mark), 1.5, 600); } },
    { cap: `(d) Every length is multiplied, even the depth: ${T('14\\times1.6=22.4')} cm.`, run: async (c) => { await c.pop(ln[4]); await c.pop(deep); } }
  ];
}

/* ======================================================================================
 * 1b. Add or multiply? (a verdict comparison, then the diagonal test)
 * ====================================================================================== */
const addmult = {
  title: 'Add or multiply?',
  height: 420,
  ask: `A rectangle is 2 cm by 4 cm. Which copy is similar: add 2 cm to each side, or multiply each side by 2?`,
  make(stage, v, ex) {
    const W = ex.W, H = 420, ox = Math.max(0, (W - 980) / 2), svg = stageSvg(stage, W, H), u = 36;
    const panels = [{ x: ox + 10, w: 4 + 2, hgt: 2 + 2, title: 'Add 2 cm', col: RED, ok: false }, { x: ox + 500, w: 8, hgt: 4, title: 'Multiply by 2', col: GREEN, ok: true }];
    const out = panels.map((p) => {
      svgEl('rect', { x: p.x, y: 6, width: 470, height: H - 12, rx: 14, fill: '#fbfaf7', stroke: '#e4ddd0', 'stroke-width': 2 }, svg);
      txt(svg, p.x + 235, 30, p.title, { size: 23, color: p.col, weight: 800 });
      const base = [p.x + 40, 392];
      const copy = svgEl('g', {}, svg); copy.style.opacity = 0;
      svgEl('rect', { x: base[0], y: base[1] - p.hgt * u, width: p.w * u, height: p.hgt * u, fill: p.ok ? '#e2f3ea' : '#f9e1df', stroke: p.col, 'stroke-width': 3 }, copy);
      txt(copy, base[0] + p.w * u / 2, base[1] + 16, p.w + ' cm', { size: 18, color: p.col, weight: 700 });
      txt(copy, base[0] - 20, base[1] - p.hgt * u / 2, p.hgt + ' cm', { size: 18, color: p.col, weight: 700 });
      // the original, at the top left; it can slide down into the copy's corner
      const og = svgEl('g', {}, svg); og.style.transformBox = 'view-box'; og.style.transformOrigin = '0 0';
      const o0 = [p.x + 40, 130];
      svgEl('rect', { x: o0[0], y: o0[1] - 2 * u, width: 4 * u, height: 2 * u, fill: '#e9edf4', stroke: INK, 'stroke-width': 3 }, og);
      const ol = svgEl('g', {}, og);
      txt(ol, o0[0] + 2 * u, o0[1] + 15, '4 cm', { size: 17 }); txt(ol, o0[0] - 20, o0[1] - u, '2 cm', { size: 17 });
      const r = lines(stage, p.x + 240, 66, 220, p.ok ? [`${T('8\\div4=2')}`, `${T('4\\div2=2')}`] : [`${T('4\\div2=2')}`, `${T('6\\div4=1.5')}`], 'u6l3-sm');
      const st = hide(stamp(stage, p.ok ? 'similar ✓' : 'not similar ✗', { ok: p.ok, x: p.x + 350, y: 186, size: 'sm' }));
      // the diagonal test: from the shared corner through the original's far corner
      const far = [base[0] + 4 * u, base[1] - 2 * u], dirv = [far[0] - base[0], far[1] - base[1]], L = Math.hypot(...dirv), ext = 8.6 * u;
      const diag = hide(path(svg, polyD([base, [base[0] + dirv[0] / L * ext, base[1] + dirv[1] / L * ext]], false), { stroke: BROWN, width: 3, dash: '9 6' }));
      const cnr = [base[0] + p.w * u, base[1] - p.hgt * u];
      const cdot = hide(dot(svg, cnr, { r: 8, color: p.col }));
      return { p, copy, og, ol, r, st, diag, cdot, dy: base[1] - o0[1] };
    });
    const slide = (c, o) => tween(c, 1000, (t) => o.og.setAttribute('transform', `translate(0 ${o.dy * t})`));
    return [
      { cap: 'The original: a 2 cm by 4 cm rectangle.', run: (c) => Promise.all(out.map((o) => pulse(c, pp(o.og), 1.05, 500))) },
      { cap: '<b>Add</b> 2 cm to each side: it becomes 4 cm by 6 cm.', run: (c) => op(c, out[0].copy, 1, 600) },
      { cap: `Divide new by old: ${T('4\\div2=2')}, but ${T('6\\div4=1.5')}. Two different numbers: <b>not similar</b>.`, run: async (c) => { await c.pop(out[0].r[0]); await c.pop(out[0].r[1]); await stampIn(c, out[0].st); } },
      { cap: '<b>Multiply</b> each side by 2: it becomes 4 cm by 8 cm.', run: (c) => op(c, out[1].copy, 1, 600) },
      { cap: `${T('8\\div4=2')} and ${T('4\\div2=2')}. The same ${T('k')} for every side: <b>similar</b>.`, run: async (c) => { await c.pop(out[1].r[0]); await c.pop(out[1].r[1]); await stampIn(c, out[1].st); } },
      { cap: 'Slide each original into the corner of its copy. Its diagonal goes straight through the corner of the <b>similar</b> copy only.',
        run: async (c) => { await Promise.all(out.map((o) => op(c, o.ol, 0, 200))); await Promise.all(out.map((o) => slide(c, o))); for (const o of out) { o.diag.style.opacity = 1; await drawIn(o.diag, 700, c); await c.pop(o.cdot); } } }
    ];
  }
};

/* ======================================================================================
 * 2. The grid method: the image appears vertex by vertex (Example 3 and 4 checks)
 * ====================================================================================== */
const GRIDS = {
  tri: { pts: [[0, 0], [3, 0], [0, 2]], at: [1, 1], k: 2, imageAt: [7, 1], cols: 14, rows: 6, cell: 38, names: 'ABC' },
  house: { pts: [[0, 0], [4, 0], [4, 3], [2, 5], [0, 3]], at: [1, 1], k: 2, imageAt: [7, 1], cols: 16, rows: 12, cell: 30, names: 'ABCDE' },
  arrow: { pts: [[0, 2], [6, 2], [6, 0], [10, 4], [6, 8], [6, 6], [0, 6]], at: [1, 1], k: 0.5, imageAt: [13, 3], cols: 19, rows: 10, cell: 28, names: null }
};
const grid2 = {
  title: 'The grid method: count, multiply, move',
  height: 420,
  choices: [{ v: 'tri', label: `a triangle, ${T('k=2')}` }, { sep: 'Example 3 check:' }, { v: 'house', label: `house ${T('\\times2')}` }, { sep: 'Example 4 check:' }, { v: 'arrow', label: `arrow ${T('\\times\\tfrac12')}` }],
  ask: (v) => (v === 'tri' ? `Enlarge triangle ${T('ABC')} with ${T('k=2')}. Start at the dot ${T("A'")}.` : v === 'house' ? `Example 3: enlarge the house ${T('ABCDE')} with a scale factor of 2. Start at the dot ${T("A'")}.` : `Example 4: draw a reduction of the detour arrow with ${T('k=\\tfrac12')}. Start at the dot.`),
  make(stage, v, ex) {
    const W = ex.W, H = 420, ox = Math.max(0, (W - 980) / 2), cfg = GRIDS[v], k = cfg.k;
    const svg = stageSvg(stage, W, H), gW = cfg.cols * cfg.cell + 28, gH = cfg.rows * cfg.cell + 28, gy = Math.round((H - gH) / 2);
    const gd = Geo.gridDraw(svgEl('g', {}, svg), { x: ox, y: gy, cols: cfg.cols, rows: cfg.rows, cell: cfg.cell, pts: cfg.pts, at: cfg.at, k, imageAt: cfg.imageAt, names: cfg.names ? [cfg.names] : null, buttons: false });
    gd.layers.top.style.pointerEvents = 'none';
    const L = svgEl('g', {}, gd.g), S = gd.toScreen, n = cfg.pts.length;
    const O = gd.orig, I = gd.target, Os = O.map(S), Is = I.map(S), cO = cen(Os), cI = cen(Is);
    const nm = (i, pr) => (cfg.names ? cfg.names[i % n] + (pr ? '′' : '') : pr ? (i % n === 0 ? 'start' : '') : String(i + 1));
    // the move table
    const tx = ox + gW + 18, tw = W - tx - 6;
    const tb = h('div', 'u6l3-mt'); tb.style.width = tw + 'px'; add(stage, tb, tx, 14);
    const head = h('div', 'u6l3-mr u6l3-mh'); head.innerHTML = `<div>Side</div><div>Original move</div><div><span class="u6l3-nw">New move (${T('\\times' + (k === 0.5 ? '\\tfrac12' : k))})</span></div>`; if (n > 5) tb.classList.add('u6l3-tight'); tb.appendChild(head);
    const rows = [];
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n, dx = O[j][0] - O[i][0], dy = O[j][1] - O[i][1];
      const r = h('div', 'u6l3-mr'); r.innerHTML = `<div>${cfg.names ? T(cfg.names[i] + '\\to ' + cfg.names[j]) : 'move ' + (i + 1)}</div><div class="u6l3-mo">${moveText(dx, dy)}</div><div class="u6l3-mn">${moveText(dx * k, dy * k)}${j === 0 ? ' ✓' : ''}</div>`;
      tb.appendChild(r); hide(r.children[1], r.children[2]); rows.push(r);
    }
    // the drawing layers
    const legsO = [], legsI = [], dots = [], names = [];
    const start = dot(L, Is[0], { r: 7, color: BLUE });
    const sN = txt(L, ...away(Is[0], cI, 22), nm(0, true), { size: 18, color: BLUE });
    hide(start, sN);
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      legsO.push(moveLegs(L, Os[i], Os[j], O[j][0] - O[i][0], O[j][1] - O[i][1], cO, BROWN));
      legsI.push(moveLegs(L, Is[i], Is[j], (I[j][0] - I[i][0]), (I[j][1] - I[i][1]), cI, BLUE));
      if (j !== 0) { dots.push(hide(dot(L, Is[j], { r: 6, color: BLUE }))); names.push(hide(txt(L, ...away(Is[j], cI, 20), nm(j, true), { size: 18, color: BLUE }))); }
    }
    const poly = hide(path(L, polyD(Is), { stroke: BLUE, width: 3.6, fill: '#dbe7fb', fo: 0.55 }));
    const st = hide(stamp(stage, v === 'arrow' ? '5 by 4 ✓' : 'similar ✓', { ok: true, x: tx + tw / 2, y: H - 30, size: 'sm' }));
    const steps = [{ cap: `<b>Step 1.</b> Start at ${cfg.names ? T('A') : 'the dot'}. Mark the starting dot ${cfg.names ? T("A'") : ''} on the new grid.`, run: async (c) => { await c.pop(start); await c.pop(sN); } }];
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n, dx = O[j][0] - O[i][0], dy = O[j][1] - O[i][1], last = j === 0;
      const from = cfg.names ? `${T(cfg.names[i] + '\\to ' + cfg.names[j])}` : `Move ${i + 1}`;
      steps.push({
        cap: `${from}: <b>${moveText(dx, dy)}</b>. ${T('\\times' + (k === 0.5 ? '\\tfrac12' : k))} gives <b>${moveText(dx * k, dy * k)}</b>.${last ? ' Back on the start ✓' : ''}`,
        run: async (c) => {
          await legsO[i].play(c); await c.pop(rows[i].children[1], 260);
          await legsI[i].play(c); if (!last) { await c.pop(dots[i]); await c.pop(names[i]); } else await pulse(c, start, 1.8, 500);
          await c.pop(rows[i].children[2], 260);
        }
      });
    }
    steps.push({ cap: '<b>Step 5.</b> Join the corners with a ruler.', run: async (c) => { await Promise.all([...legsO, ...legsI].map((g) => op(c, g, 0.25, 300))); poly.style.opacity = 1; await drawIn(poly, 1100, c); } });
    steps.push({
      cap: v === 'house' ? `Check: ${T('AB=4')} and ${T("A'B'=8")} squares; ${T('BC=3')} and ${T("B'C'=6")}. Each side is twice as long, and the roof still makes a right angle.`
        : v === 'arrow' ? 'The arrow is 10 squares long and 8 tall. The reduction is <b>5 long and 4 tall</b>: half of each.'
          : 'Each side is twice as long, and the slanted side keeps its slant: <b>similar</b>.',
      run: (c) => stampIn(c, st)
    });
    return steps;
  }
};

/* ======================================================================================
 * 2b. Slanted sides and half squares (Full)
 * ====================================================================================== */
const slant = {
  title: 'Slanted sides: multiply both counts',
  height: 380,
  choices: [{ v: 2, label: T('k=2') }, { v: 1.5, label: T('k=1.5') }],
  ask: (k) => (k === 2 ? `A slanted side goes 2 right and 1 up. Enlarge it with ${T('k=2')}.` : `A slanted side goes 3 right and 2 up. Enlarge it with ${T('k=1.5')}.`),
  make(stage, k, ex) {
    const W = ex.W, H = 380, ox = Math.max(0, (W - 980) / 2), svg = stageSvg(stage, W, H), cell = 44;
    const G = grid(svg, ox + 20, 20, 15, 7, cell);
    const d = k === 2 ? [2, 1] : [3, 2], P0 = [1, 1], Q0 = [7, 1];
    const P1 = [P0[0] + d[0], P0[1] + d[1]], Q1 = [Q0[0] + d[0] * k, Q0[1] + d[1] * k];
    const C = [ox + 400, 400];
    const segO = path(svg, polyD([G(...P0), G(...P1)], false), { stroke: INK, width: 4.5 });
    dot(svg, G(...P0), { r: 6 }); dot(svg, G(...P1), { r: 6 });
    const legO = moveLegs(svg, G(...P0), G(...P1), d[0], d[1], [ox, 0], BROWN);
    const legI = moveLegs(svg, G(...Q0), G(...Q1), d[0] * k, d[1] * k, [ox, 0], BLUE);
    dot(svg, G(...Q0), { r: 6, color: BLUE });
    const segI = hide(path(svg, polyD([G(...Q0), G(...Q1)], false), { stroke: BLUE, width: 4.5 }));
    const endI = hide(dot(svg, G(...Q1), { r: 7, color: BLUE }));
    const right = h('div', 'u6l3-side'); add(stage, right, ox + 700, 30); right.style.width = '270px';
    const ln = lines(stage, ox + 700, 40, 270, k === 2 ? ['original: 2 right, 1 up', `${T('\\times2')}: <b>4 right, 2 up</b>`, '<span class="u6l3-red">only one count × 2: 4 right, 1 up ✗</span>', 'two copies of the old side fit along the new one'] : ['original: 3 right, 2 up', `${T('3\\times1.5=4.5')} right`, `${T('2\\times1.5=3')} up`, 'the corner is in the middle of a square: fine']);
    void C;
    if (k === 2) {
      const bad = hide(path(svg, polyD([G(...Q0), G(Q0[0] + 4, Q0[1] + 1)], false), { stroke: RED, width: 4, dash: '10 7' }));
      const st1 = hide(stamp(stage, '✗', { ok: false, x: G(Q0[0] + 4, Q0[1] + 1)[0] + 40, y: G(Q0[0] + 4, Q0[1] + 1)[1] + 6, size: 'sm' }));
      const cp = [0, 1].map((i) => hide(pp(svgEl('path', { d: polyD([G(Q0[0] + 2 * i, Q0[1] + i), G(Q0[0] + 2 * i + 2, Q0[1] + i + 1)], false), stroke: i ? AMBER : GREEN, 'stroke-width': 9, 'stroke-opacity': 0.6, 'stroke-linecap': 'round', fill: 'none' }, svg))));
      const st2 = hide(stamp(stage, 'twice as long ✓', { ok: true, x: G(...Q1)[0] + 30, y: G(...Q1)[1] - 50, size: 'sm' }));
      return [
        { cap: 'A slanted side: <b>2 right and 1 up</b>. Don’t count squares along the slant.', run: async (c) => { await legO.play(c); await c.pop(ln[0]); } },
        { cap: `Multiply <b>both</b> counts by 2: <b>4 right and 2 up</b>.`, run: async (c) => { await legI.play(c); segI.style.opacity = 1; await drawIn(segI, 600, c); await c.pop(endI); await c.pop(ln[1]); } },
        { cap: 'Multiply only one count (4 right, 1 up) and the slant changes: the shape would not be similar.', run: async (c) => { bad.style.opacity = 1; await drawIn(bad, 600, c); await stampIn(c, st1); await c.pop(ln[2]); } },
        { cap: 'The right side has the <b>same slant</b> and is <b>twice as long</b>: two copies of the old side fit along it.', run: async (c) => { await op(c, bad, 0.2, 300); for (const e of cp) await c.pop(e, 380); await c.pop(ln[3]); await stampIn(c, st2); } }
      ];
    }
    const half = hide(svgEl('rect', { x: G(Q0[0] + 4, Q0[1] + 3)[0], y: G(Q0[0] + 4, Q0[1] + 3)[1], width: cell, height: cell, fill: AMBER, 'fill-opacity': 0.25 }, svg));
    return [
      { cap: 'A slanted side: <b>3 right and 2 up</b>.', run: async (c) => { await legO.play(c); await c.pop(ln[0]); } },
      { cap: `Multiply both counts by 1.5: ${T('3\\times1.5=4.5')} right and ${T('2\\times1.5=3')} up.`, run: async (c) => { await legI.play(c); await c.pop(ln[1]); await c.pop(ln[2]); } },
      { cap: '4.5 squares: the corner lands in the <b>middle</b> of a square. That’s fine.', run: async (c) => { half.style.opacity = 1; await c.pop(half); segI.style.opacity = 1; await drawIn(segI, 600, c); await c.pop(endI); await c.pop(ln[3]); } }
    ];
  }
};

/* ======================================================================================
 * 3. Ruler and protractor (Example 5 and 6 checks)
 * ====================================================================================== */
const rulerEx = {
  title: 'Ruler and protractor: copy the side × k, copy the angles',
  height: 470, tap: false,
  choices: [{ sep: 'Example 5 check:' }, { v: 'tri', label: `${T('\\triangle PQR')}, ${T('k=1.5')}` }, { sep: 'Example 6 check:' }, { v: 'ramp', label: `the ramp, ${T('k=0.5')}` }],
  ask: (v) => (v === 'tri' ? `Example 5: draw ${T("\\triangle P'Q'R'")}, an enlargement of ${T('\\triangle PQR')} with ${T('k=1.5')}.` : `Example 6: draw a reduction of Theo’s ramp ${T('ABCD')} with ${T('k=0.5')}. Then check ${T("B'C'")}.`),
  make(stage, v, ex) { return v === 'tri' ? rulerTri(stage, ex) : rulerRamp(stage, ex); }
};
function protAt(stage, W, H, V, r) {
  const P = staticProt(Geo.protractor(stage, { x: 0, y: 0, width: W, height: H, r, cx: V[0], cy: V[1], rot: 0, buttons: false, readout: false }));
  P.el.style.pointerEvents = 'none'; P.g.style.opacity = 0; return P;
}
function rulerTri(stage, ex) {
  const W = ex.W, H = 470, ox = Math.max(0, (W - 980) / 2), svg = stageSvg(stage, W, H), u = 55;
  const Q = [ox + 40, 225], R = [Q[0] + 4 * u, Q[1]], Pp = [Q[0] + 2.401 * u, Q[1] - 3.429 * u];
  path(svg, polyD([Q, R, Pp]), { fill: '#e9edf4', width: 3.2 });
  txt(svg, Q[0] - 14, Q[1] + 14, 'Q'); txt(svg, R[0] + 14, R[1] + 14, 'R'); txt(svg, Pp[0], Pp[1] - 16, 'P');
  const m1 = hide(txt(svg, (Q[0] + R[0]) / 2, Q[1] + 20, '4 cm', { size: 18, color: RED, weight: 800 }));
  const a1 = hide(arcLab(svg, Q, 0, 55, '55°', { color: RED, r: 30 })), a2 = hide(arcLab(svg, R, 115, 65, '65°', { color: RED, r: 30 }));
  const Q2 = [ox + 300, 425], R2 = [Q2[0] + 6 * u, Q2[1]], P2 = [Q2[0] + 1.5 * 2.401 * u, Q2[1] - 1.5 * 3.429 * u];
  const rul = ruler(svg, Q2[0], Q2[1] + 3, 6, u); rul.style.opacity = 0;
  const base = hide(line(svg, Q2, R2, { width: 3.6 }));
  const dQ = hide(dot(svg, Q2, { r: 5 })), dR = hide(dot(svg, R2, { r: 5 }));
  const nQ = hide(txt(svg, Q2[0] - 18, Q2[1] + 10, 'Q′')), nR = hide(txt(svg, R2[0] + 20, R2[1] + 10, 'R′'));
  const P = protAt(stage, W, H, Q2, 112);
  const g2 = svgEl('g', {}, svg);
  const armQ = hide(line(g2, Q2, A(Q2, 55, 6.4 * u), { width: 2.6, color: GREY, cls: '' }));
  const armR = hide(line(g2, R2, A(R2, 115, 6.0 * u), { width: 2.6, color: GREY, cls: '' }));
  const b1 = hide(arcLab(g2, Q2, 0, 55, '55°', { color: BLUE, r: 34 })), b2 = hide(arcLab(g2, R2, 115, 65, '65°', { color: BLUE, r: 34 }));
  const tri = hide(path(g2, polyD([Q2, R2, P2]), { stroke: BLUE, width: 3.8, fill: '#dbe7fb', fo: 0.5 }));
  const dP = hide(dot(g2, P2, { r: 6, color: BLUE })), nP = hide(txt(g2, P2[0] + 6, P2[1] - 22, 'P′', { color: BLUE }));
  const b3 = hide(arcLab(g2, P2, 235, 60, '60°', { color: GREEN, r: 30 }));
  const ln = lines(stage, ox + 690, 26, 285, [`${T('QR=4')} cm, ${T('\\angle Q=55^\\circ')}, ${T('\\angle R=65^\\circ')}`, `${T("Q'R'=4\\times1.5=6")} cm`, `copy ${T('55^\\circ')} at ${T("Q'")}`, `copy ${T('65^\\circ')} at ${T("R'")}`, `${T("\\angle P'=180-55-65=60^\\circ")}`, `${T("P'Q'\\approx6.3")}, and ${T('4.2\\times1.5=6.3')} ✓`]);
  const st = hide(stamp(stage, 'similar ✓', { ok: true, x: ox + 832, y: 445, size: 'sm' }));
  return [
    { cap: '<b>Step 1.</b> Measure one side and the two angles at its ends: <b>QR = 4 cm</b>, ∠Q = 55°, ∠R = 65°.', run: async (c) => { await c.pop(m1); await c.pop(a1); await c.pop(a2); await c.pop(ln[0]); } },
    { cap: `<b>Step 2.</b> ${T("Q'R'=4\\times1.5=6")} cm. Draw it with a ruler.`, run: async (c) => {
      rul.style.opacity = 1; await tween(c, 700, (t) => rul.setAttribute('transform', `translate(${-260 * (1 - t)} 0)`));
      dQ.style.opacity = 1; await c.pop(dQ); base.style.opacity = 1; await drawIn(base, 900, c); dR.style.opacity = 1; await c.pop(dR);
      await c.pop(nQ); await c.pop(nR); await c.pop(ln[1]); await op(c, rul, 0, 400); } },
    { cap: `<b>Step 3.</b> At ${T("Q'")}: centre on ${T("Q'")}, base line on ${T("Q'R'")}. The inner 0 is on ${T("Q'R'")}: count to <b>55</b> and draw the arm.`, run: async (c) => {
      P.showScale('inner'); await op(c, P.g, 1, 500); armQ.style.opacity = 1; await drawIn(armQ, 800, c); await c.pop(b1); await c.pop(ln[2]); } },
    { cap: `At ${T("R'")}: the 0 on ${T("R'Q'")} is on the left, so use the <b>outer</b> scale. Count to <b>65</b> and draw the arm.`, run: async (c) => {
      await P.moveTo(c, { cx: R2[0], cy: R2[1] }, 1000); P.showScale('outer'); armR.style.opacity = 1; await drawIn(armR, 800, c); await c.pop(b2); await c.pop(ln[3]); } },
    { cap: `<b>Step 4.</b> The two arms meet at ${T("P'")}, the third corner.`, run: async (c) => { await op(c, P.g, 0, 400); await c.pop(dP); await c.pop(nP); tri.style.opacity = 1; await drawIn(tri, 900, c); } },
    { cap: `<b>Step 5.</b> Check: ${T("\\angle P'=60^\\circ=\\angle P")}, and ${T("P'Q'\\approx6.3")} cm ${T('=4.2\\times1.5')} ✓`, run: async (c) => { await c.pop(b3); await c.pop(ln[4]); await c.pop(ln[5]); await stampIn(c, st); } }
  ];
}
function rulerRamp(stage, ex) {
  const W = ex.W, H = 470, ox = Math.max(0, (W - 980) / 2), svg = stageSvg(stage, W, H), s = 20, u = 50;
  // Theo's sketch (not to scale)
  const a = [ox + 40, 200], b = [a[0] + 12 * s, a[1]], cc = [a[0] + 4 * s, a[1] - 6 * s], d = [a[0], a[1] - 6 * s];
  path(svg, polyD([a, b, cc, d]), { fill: '#e9edf4', width: 3 });
  square(svg, a, 0, 12); square(svg, d, 270, 12);
  [[a, 'A', -12, 14], [b, 'B', 14, 14], [cc, 'C', 12, -12], [d, 'D', -12, -12]].forEach(([p, t, dx, dy]) => txt(svg, p[0] + dx, p[1] + dy, t, { size: 19 }));
  txt(svg, (a[0] + b[0]) / 2, a[1] + 18, '12 cm', { size: 16 }); txt(svg, a[0] - 30, (a[1] + d[1]) / 2, '6 cm', { size: 16 });
  txt(svg, (d[0] + cc[0]) / 2, d[1] - 14, '4 cm', { size: 16 }); txt(svg, (b[0] + cc[0]) / 2 + 26, (b[1] + cc[1]) / 2 - 6, '10 cm', { size: 16 });
  txt(svg, a[0] + 130, 30, '(not to scale)', { size: 15, color: SLATE });
  // the reduction
  const A2 = [ox + 330, 420], B2 = [A2[0] + 6 * u, A2[1]], D2 = [A2[0], A2[1] - 3 * u], C2 = [D2[0] + 2 * u, D2[1]];
  const rul = ruler(svg, A2[0], A2[1] + 3, 6, u); rul.style.opacity = 0;
  const sAB = hide(line(svg, A2, B2, { width: 3.6, color: BLUE }));
  const P = protAt(stage, W, H, A2, 92);
  const armA = hide(line(svg, A2, A(A2, 90, 4.4 * u), { width: 2.4, color: GREY, cls: '' }));
  const sAD = hide(line(svg, A2, D2, { width: 3.6, color: BLUE }));
  const armD = hide(line(svg, D2, A(D2, 0, 4.4 * u), { width: 2.4, color: GREY, cls: '' }));
  const sDC = hide(line(svg, D2, C2, { width: 3.6, color: BLUE }));
  const sCB = hide(line(svg, C2, B2, { width: 3.6, color: BLUE }));
  const fill = hide(path(svg, polyD([A2, B2, C2, D2]), { stroke: 'none', fill: '#dbe7fb', fo: 0.55, cls: '' }));
  const q1 = hide(pp(square(svg, A2, 0, 14, { color: BLUE }))), q2 = hide(pp(square(svg, D2, 270, 14, { color: BLUE })));
  const nm = [[A2, 'A′', -18, 12], [B2, 'B′', 18, 12], [C2, 'C′', 14, -16], [D2, 'D′', -18, -12]].map(([p, t, dx, dy]) => hide(txt(svg, p[0] + dx, p[1] + dy, t, { size: 19, color: BLUE })));
  const tape = hide(path(svg, polyD([C2, B2], false), { stroke: AMBER, width: 12, opacity: 0.4, cls: '' }));
  const t5 = hide(txt(svg, (C2[0] + B2[0]) / 2 + 28, (C2[1] + B2[1]) / 2 - 14, '5 cm', { size: 19, color: AMBER, weight: 800 }));
  const aB = hide(arcLab(svg, B2, 180 - 36.87, 36.87, '37°', { color: GREEN, r: 46, gap: 22 }));
  const ln = lines(stage, ox + 690, 26, 285, [`${T("A'B'=12\\times0.5=6")} cm`, `${T("A'D'=6\\times0.5=3")} cm`, `${T("D'C'=4\\times0.5=2")} cm`, `check: ${T("B'C'=10\\times0.5=5")} cm`]);
  const st = hide(stamp(stage, '5 cm ✓', { ok: true, x: ox + 832, y: 445, size: 'sm' }));
  return [
    { cap: `Multiply each side by 0.5: ${T("A'B'=6")}, ${T("A'D'=3")} and ${T("D'C'=2")} cm.`, run: async (c) => { for (let i = 0; i < 3; i++) await c.pop(ln[i], 280); } },
    { cap: `Draw ${T("A'B'=6")} cm with a ruler.`, run: async (c) => {
      rul.style.opacity = 1; await tween(c, 700, (t) => rul.setAttribute('transform', `translate(${-280 * (1 - t)} 0)`));
      sAB.style.opacity = 1; await drawIn(sAB, 900, c); await c.pop(nm[0]); await c.pop(nm[1]); await op(c, rul, 0, 400); } },
    { cap: `A right angle at ${T("A'")} (90° on the protractor), then measure ${T("A'D'=3")} cm along the new arm.`, run: async (c) => {
      P.showScale('inner'); await op(c, P.g, 1, 500); armA.style.opacity = 1; await drawIn(armA, 700, c); await op(c, P.g, 0, 400);
      sAD.style.opacity = 1; await drawIn(sAD, 600, c); await c.pop(q1); await c.pop(nm[3]); } },
    { cap: `A right angle at ${T("D'")}, then ${T("D'C'=2")} cm along that arm.`, run: async (c) => {
      await P.moveTo(c, { cx: D2[0], cy: D2[1], rot: 270 }, 1000); await op(c, P.g, 1, 400); armD.style.opacity = 1; await drawIn(armD, 700, c); await op(c, P.g, 0, 400);
      sDC.style.opacity = 1; await drawIn(sDC, 500, c); await c.pop(q2); await c.pop(nm[2]); } },
    { cap: `Join ${T("C'")} to ${T("B'")}.`, run: async (c) => { await Promise.all([op(c, armA, 0.2), op(c, armD, 0.2)]); sCB.style.opacity = 1; await drawIn(sCB, 700, c); await op(c, fill, 1, 400); } },
    { cap: `Check: ${T("B'C'")} should be ${T('10\\times0.5=5')} cm. It measures 5 cm ✓, and ${T("\\angle B'\\approx37^\\circ")}, the same as ${T('\\angle B')}.`, run: async (c) => {
      tape.style.opacity = 0.4; await drawIn(tape, 700, c); await c.pop(t5); await c.pop(aB); await c.pop(ln[3]); await stampIn(c, st); } }
  ];
}

/* ======================================================================================
 * 4. The projection method: rays from O and a measuring tape (Example 7 and 8 checks)
 * ====================================================================================== */
const PROJ = {
  tri: { k: 2, u: 82, O: [70, 250], c: [['A', 30, 2], ['B', 8, 2.5], ['C', -12, 1.8]], lo: [100, 0, 270], li: [100, 0, 270] },
  ex7: { k: 2, u: 70, O: [60, 255], c: [['A', 35, 2], ['B', 10, 3], ['C', -15, 2.5], ['D', 5, 1.5]], lo: [95, 0, 270, 120], li: [120, 0, 270, 285] },
  ex8: { k: 0.5, u: 54, O: [300, 215], c: [['J', 90, 3], ['K', 160, 4], ['L', 230, 3], ['M', 300, 3.6], ['N', 20, 2.8]], lo: [90, 160, 230, 300, 20], li: [0, 90, 180, 0, 60] }
};
const project = {
  title: 'The projection method: rays from O',
  height: 440,
  choices: [{ v: 'tri', label: `a triangle, ${T('k=2')}` }, { v: 'k3', label: `watch out: ${T('k=3')}` }, { sep: 'Example 7 check:' }, { v: 'ex7', label: `${T('ABCD')}, ${T('k=2')}` }, { sep: 'Example 8 check:' }, { v: 'ex8', label: `${T('JKLMN')}, ${T('k=\\tfrac12')}` }],
  ask: (v) => (v === 'tri' ? `Enlarge ${T('\\triangle ABC')} with centre ${T('O')} and ${T('k=2')}.` : v === 'k3' ? `${T('k=3')} and ${T('OA=2')} cm. Where does ${T("A'")} go?`
    : v === 'ex7' ? `Example 7: enlarge ${T('ABCD')} with centre ${T('O')} and ${T('k=2')}.` : `Example 8: reduce the pentagon ${T('JKLMN')} with centre ${T('O')} (inside) and ${T('k=\\tfrac12')}.`),
  make(stage, v, ex) {
    const W = ex.W, H = 440, ox = Math.max(0, (W - 980) / 2), svg = stageSvg(stage, W, H);
    if (v === 'k3') return projTrap(stage, svg, W, H, ox);
    const cfg = PROJ[v], k = cfg.k, u = cfg.u, O = [ox + cfg.O[0], cfg.O[1]], kT = k === 0.5 ? '\\tfrac12' : String(k);
    const Pt = (deg, r) => A(O, deg, r * u);
    const orig = cfg.c.map(([, d, r]) => Pt(d, r)), img = cfg.c.map(([, d, r]) => Pt(d, r * k));
    const gS = svgEl('g', {}, svg), gR = svgEl('g', {}, svg), gT = svgEl('g', {}, svg), gI = svgEl('g', {}, svg);
    const rays = cfg.c.map(([, d, r]) => hide(path(gR, polyD([O, Pt(d, Math.max(r, r * k) + 0.45)], false), { stroke: RED, width: 1.8, dash: '7 6' })));
    path(gS, polyD(orig), { fill: '#e9edf4', width: 3.2 });
    cfg.c.forEach(([nm], i) => txt(gS, ...A(orig[i], cfg.lo[i], 18), nm, { size: 20 }));
    dot(gS, O, { r: 6, color: INK }); txt(gS, O[0] - 16, O[1] + 16, 'O', { size: 21 });
    const tapes = [], tl = [], dots = [], names = [];
    cfg.c.forEach(([nm, d, r], i) => {
      tapes.push(hide(path(gT, polyD([O, O], false), { stroke: AMBER, width: 11, opacity: 0.45, cls: '' })));
      const mid = A(O, d, r * k * u / 2), off = A(mid, d + 90, 16);
      tl.push(hide(txt(gT, off[0], off[1], '', { size: 15, color: '#8a5a06', weight: 800 })));
      dots.push(hide(dot(gI, img[i], { r: 6, color: BLUE })));
      names.push(hide(txt(gI, ...A(img[i], cfg.li[i], v === 'ex8' ? 15 : 19), nm + '′', { size: 17, color: BLUE })));
    });
    const poly = hide(path(gI, polyD(img), { stroke: BLUE, width: 3.6, fill: '#dbe7fb', fo: 0.45 }));
    // the table
    const tx = ox + 640, tb = h('div', 'u6l3-mt u6l3-pt'); tb.style.width = '330px'; add(stage, tb, tx, 20);
    const hd = h('div', 'u6l3-mr u6l3-mh'); hd.innerHTML = `<div>Corner</div><div><span class="u6l3-nw">From ${T('O')}</span></div><div><span class="u6l3-nw">New: ${T('\\times' + kT)}</span></div>`; tb.appendChild(hd);
    const rows = cfg.c.map(([nm, , r]) => { const e = h('div', 'u6l3-mr'); e.innerHTML = `<div>${T(nm)}</div><div><span class="u6l3-nw">${T('O' + nm + '=' + r)} cm</span></div><div><span class="u6l3-nw">${T('O' + nm + "'=" + nf(r * k))} cm</span></div>`; tb.appendChild(e); hide(e.children[1], e.children[2]); return e; });
    const lenO = (i) => cfg.c[i][2] * u;
    const tapeTo = (i, L) => { const E = A(O, cfg.c[i][1], L); tapes[i].setAttribute('d', polyD([O, E], false)); };
    const steps = [{ cap: `<b>Step 1.</b> Draw a ray from ${T('O')} through each corner.`, run: async (c) => { for (const r of rays) { r.style.opacity = 1; await drawIn(r, 450, c); } } }];
    cfg.c.forEach(([nm, , r], i) => {
      steps.push({
        cap: `${i === 0 ? '<b>Step 2.</b> ' : ''}Measure ${T('O' + nm + '=' + r)} cm. ${T('\\times' + kT)}: ${T('O' + nm + "'=" + nf(r * k))} cm. Mark ${T(nm + "'")} on the same ray.`,
        run: async (c) => {
          tapes[i].style.opacity = 0.45; tl[i].textContent = r + ' cm';
          await tween(c, 600, (t) => tapeTo(i, lenO(i) * t)); await c.pop(rows[i].children[1], 240);
          tl[i].textContent = nf(r * k) + ' cm';
          await tween(c, 700, (t) => tapeTo(i, lenO(i) * (1 + (k - 1) * t))); tl[i].style.opacity = 1; await c.pop(tl[i]);
          await c.pop(dots[i]); await c.pop(names[i]); await c.pop(rows[i].children[2], 240);
          await op(c, tapes[i], 0.16, 300); await op(c, tl[i], 0, 200);
        }
      });
    });
    steps.push({ cap: '<b>Step 4.</b> Join the new corners in the same order.', run: async (c) => { poly.style.opacity = 1; await drawIn(poly, 1100, c); } });
    if (v === 'ex7') {
      const hl = [orig, img].map((P, j) => hide(svgEl('path', { d: polyD([P[1], P[2]], false), stroke: j ? BLUE : INK, 'stroke-width': 10, 'stroke-opacity': 0.3, 'stroke-linecap': 'round', fill: 'none' }, gI)));
      const st = hide(stamp(stage, `${T("B'C'\\approx2.6")} ✓`, { ok: true, x: tx + 165, y: 330, size: 'sm' }));
      steps.push({ cap: `Check: ${T('BC\\approx1.3')} cm and ${T("B'C'\\approx2.6")} cm: twice as long ✓`, run: async (c) => { for (const e of hl) await c.pop(pp(e)); await stampIn(c, st); } });
    } else if (v === 'ex8') {
      const st = hide(stamp(stage, 'half the size ✓', { ok: true, x: tx + 165, y: 375, size: 'sm' }));
      steps.push({ cap: 'Each new corner is <b>halfway</b> from O to the old one. The reduction sits inside: same shape, half the size.', run: (c) => stampIn(c, st) });
    } else {
      const st = hide(stamp(stage, 'k = 2 ✓', { ok: true, x: tx + 165, y: 280, size: 'sm' }));
      steps.push({ cap: `${T('k>1')}: every new corner is <b>past</b> the old one, twice as far from ${T('O')}.`, run: (c) => stampIn(c, st) });
    }
    return steps;
  }
};
function projTrap(stage, svg, W, H, ox) {
  const u = 62, O = [ox + 50, 300], d = 12, Pt = (r) => A(O, d, r * u);
  path(svg, polyD([O, Pt(8.6)], false), { stroke: RED, width: 1.8, dash: '7 6', cls: '' });
  dot(svg, O, { r: 6 }); txt(svg, O[0] - 14, O[1] + 18, 'O');
  dot(svg, Pt(2), { r: 6 }); txt(svg, ...A(Pt(2), d + 90, 22), 'A');
  const tick = (r, s, col, side = 1) => { const q = A(Pt(r), d - 90 * side, 30); return hide(txt(svg, q[0], q[1], s, { size: 16, color: col, weight: 800 })); };
  const tOk = hide(path(svg, polyD([O, Pt(6)], false), { stroke: GREEN, width: 11, opacity: 0.4, cls: '' }));
  const lOk = tick(3, '6 cm from O', GREEN), dOk = hide(dot(svg, Pt(6), { r: 7, color: GREEN })), nOk = hide(txt(svg, ...A(Pt(6), d - 90, 28), 'A′ ✓', { color: GREEN, size: 19 }));
  const tBad = hide(path(svg, polyD([Pt(2), Pt(8)], false), { stroke: RED, width: 11, opacity: 0.35, cls: '' }));
  const lBad = tick(5, '6 cm past A', RED, -1), dBad = hide(dot(svg, Pt(8), { r: 7, color: RED })), nBad = hide(txt(svg, ...A(Pt(8), d - 90, 28), '✗', { color: RED, size: 24 }));
  const four = hide(path(svg, polyD([A(Pt(2), d - 90, 62), A(Pt(6), d - 90, 62)], false), { stroke: AMBER, width: 3, cls: '' }));
  const lFour = hide(txt(svg, ...A(Pt(4), d - 90, 80), 'only 4 cm past A', { size: 16, color: '#8a5a06', weight: 800 }));
  const ln = lines(stage, ox + 640, 40, 330, [`${T("OA'=3\\times2=6")} cm, from ${T('O')}`, `6 cm past ${T('A')}: ${T('2+6=8')} cm from ${T('O')}`, `${T('8\\div2=4')}: that is ${T('k=4')} ✗`, `${T("A'")} is only 4 cm past ${T('A')}`]);
  return [
    { cap: `${T('OA=2')} cm. ${T('k=3')}: ${T("OA'=3\\times2=6")} cm, measured <b>from O</b>.`, run: async (c) => { tOk.style.opacity = 0.4; await drawIn(tOk, 800, c); await c.pop(lOk); await c.pop(dOk); await c.pop(nOk); await c.pop(ln[0]); } },
    { cap: `The trap: measuring 6 cm <b>past A</b> lands 8 cm from ${T('O')}. That is 4 times as far: ${T('k=4')}, not 3 ✗`, run: async (c) => { tBad.style.opacity = 0.35; await drawIn(tBad, 800, c); await c.pop(lBad); await c.pop(dBad); await c.pop(nBad); await c.pop(ln[1]); await c.pop(ln[2]); } },
    { cap: `So ${T("A'")} is 6 cm from ${T('O')}, only <b>4 cm past</b> ${T('A')}. Always measure from ${T('O')}.`, run: async (c) => { await op(c, tBad, 0.12); four.style.opacity = 1; await drawIn(four, 500, c); await c.pop(lFour); await c.pop(ln[3]); } }
  ];
}

/* ======================================================================================
 * 4b. Why projecting makes a similar shape (Full)
 * ====================================================================================== */
const why = {
  title: 'Slide k: the corners move along the rays',
  height: 440,
  ask: `Change ${T('k')} in the projection method. Why is the new shape always similar?`,
  make(stage, v, ex) {
    const W = ex.W, H = 420, ox = Math.max(0, (W - 980) / 2), svg = stageSvg(stage, W, H), cfg = PROJ.tri, u = 64, O = [ox + 60, 250];
    const C = cfg.c.map(([, d, r]) => [d, r]);
    C.forEach(([d, r]) => path(svg, polyD([O, A(O, d, r * 3.1 * u)], false), { stroke: RED, width: 1.6, dash: '7 6', cls: '' }));
    const orig = C.map(([d, r]) => A(O, d, r * u));
    path(svg, polyD(orig), { fill: '#e9edf4', width: 3 });
    ['A', 'B', 'C'].forEach((s, i) => txt(svg, ...A(orig[i], C[i][0] + 90 * (i === 2 ? -1 : 1), 16), s, { size: 18 }));
    dot(svg, O, { r: 6 }); txt(svg, O[0] - 14, O[1] + 18, 'O');
    const tOAB = hide(pp(path(svg, '', { stroke: 'none', fill: AMBER, fo: 0.22, cls: '' })));
    const img = path(svg, '', { stroke: BLUE, width: 3.4, fill: '#dbe7fb', fo: 0.4, cls: '' });
    const ds = C.map(() => dot(svg, [0, 0], { r: 5.5, color: BLUE }));
    const ns = ['A′', 'B′', 'C′'].map((s) => txt(svg, 0, 0, s, { size: 17, color: BLUE }));
    const sideHl = [INK, BLUE].map((cl) => hide(pp(svgEl('path', { d: '', stroke: cl, 'stroke-width': 9, 'stroke-opacity': 0.3, 'stroke-linecap': 'round', fill: 'none' }, svg))));
    const kl = lab(stage, '', ox + 805, 30, 'u6l3-big');
    const zone = lab(stage, '', ox + 805, 98, 'u6l3-tag');
    const ln = lines(stage, ox + 630, 140, 345, [`${T("\\triangle OAB")} and ${T("\\triangle OA'B'")} share the angle at ${T('O')}`, `${T("OA'=k\\times OA")}, ${T("OB'=k\\times OB")}`, `so ${T("A'B'=k\\times AB")}, parallel to ${T('AB')}`, 'every side the same way: <b>similar</b>']);
    let k = 1;
    const set = (kk) => {
      k = kk; const I = C.map(([d, r]) => A(O, d, r * k * u));
      img.setAttribute('d', polyD(I)); I.forEach((p, i) => { ds[i].setAttribute('cx', p[0].toFixed(1)); ds[i].setAttribute('cy', p[1].toFixed(1)); const q = A(p, C[i][0] + 90 * (i === 2 ? -1 : 1), 17); ns[i].setAttribute('x', q[0].toFixed(1)); ns[i].setAttribute('y', q[1].toFixed(1)); });
      tOAB.setAttribute('d', polyD([O, I[0], I[1]])); sideHl[0].setAttribute('d', polyD([orig[0], orig[1]], false)); sideHl[1].setAttribute('d', polyD([I[0], I[1]], false));
      kl.inner.innerHTML = T('k=' + k.toFixed(1)); zone.inner.innerHTML = Math.abs(k - 1) < 0.05 ? 'on top of the shape' : k > 1 ? 'past the shape' : 'between O and the shape';
    };
    set(1);
    const go = (c, to, ms) => { const k0 = k; return tween(c, ms, (t) => set(k0 + (to - k0) * t)); };
    return [
      { cap: `${T('k=1')}: each new corner lands right on top of the old one.`, run: (c) => pulse(c, kl.inner, 1.2, 500) },
      { cap: `Make ${T('k')} bigger than 1: the corners slide out along the rays, <b>past</b> the shape.`, run: (c) => go(c, 2.8, 1800) },
      { cap: `Make ${T('k')} smaller than 1: they slide back, <b>between</b> ${T('O')} and the shape.`, run: (c) => go(c, 0.5, 1800) },
      { cap: `Set ${T('k=2')}. ${T('\\triangle OAB')} and ${T("\\triangle OA'B'")} share the angle at ${T('O')}, and both sides from ${T('O')} are ${T('\\times2')}.`, run: async (c) => { await go(c, 2, 1000); tOAB.style.opacity = 1; await c.pop(tOAB); await c.pop(ln[0]); await c.pop(ln[1]); } },
      { cap: `So ${T("A'B'=2\\times AB")}, and it is parallel to ${T('AB')}. Every side works the same way, so the copy is <b>similar</b>.`, run: async (c) => { for (const e of sideHl) await c.pop(e); await c.pop(ln[2]); await c.pop(ln[3]); } }
    ];
  }
};

/* ======================================================================================
 * 5. Photos and posters (Example 9 checks)
 * ====================================================================================== */
/** a little mountain photo (6 × 4 shape) drawn into an <svg> that stretches to w × h at (x, y) */
function photo(parent, x, y, w, hh) {
  const s = svgEl('svg', { x, y, width: w, height: hh, viewBox: '0 0 60 40', preserveAspectRatio: 'none', overflow: 'hidden' }, parent);
  svgEl('rect', { x: 0, y: 0, width: 60, height: 40, fill: '#bfe0f5' }, s);
  svgEl('circle', { cx: 48, cy: 9, r: 4.5, fill: '#f7c948' }, s);
  svgEl('path', { d: 'M0 30 L12 14 L20 24 L30 8 L42 26 L50 18 L60 28 L60 40 L0 40 Z', fill: '#7c8ca6' }, s);
  svgEl('path', { d: 'M27 12 L30 8 L33 12.5 L31 11.5 L29 13 Z M10.5 16 L12 14 L13.8 16.5 L12 15.8 Z', fill: '#fff' }, s);
  svgEl('path', { d: 'M0 33 Q15 29 30 33 T60 32 L60 40 L0 40 Z', fill: '#6aa35a' }, s);
  svgEl('rect', { x: 0, y: 0, width: 60, height: 40, fill: 'none', stroke: '#3b4251', 'stroke-width': 0.8 }, s);
  s.size = (X, Y, W2, H2) => { s.setAttribute('x', X.toFixed(1)); s.setAttribute('y', Y.toFixed(1)); s.setAttribute('width', W2.toFixed(1)); s.setAttribute('height', H2.toFixed(1)); };
  return s;
}
const photoEx = {
  title: 'Photos, prints and posters',
  height: 430,
  choices: [{ sep: 'Example 9 check:' }, { v: 'a', label: `(a) 4 by 6, ${T('k=3')}` }, { v: 'b', label: '(b) an 8 by 10 print?' }, { v: 'c', label: '(c) the poster' }],
  ask: (v) => (v === 'a' ? 'Example 9(a): Mei’s 4 in by 6 in photo is enlarged with k = 3. What size is the print?' : v === 'b' ? 'Example 9(b): is an 8 in by 10 in print similar to Mei’s 4 in by 6 in photo?' : 'Example 9(c): the biggest similar enlargement of a 15 cm by 10 cm photo that fits on a 60 cm by 45 cm sheet.'),
  make(stage, v, ex) {
    const W = ex.W, H = 430, ox = Math.max(0, (W - 980) / 2), svg = stageSvg(stage, W, H);
    if (v === 'a') {
      const u = 24, x0 = ox + 40, y0 = 400;
      const ph = photo(svg, x0, y0 - 4 * u, 6 * u, 4 * u);
      const l0 = [txt(svg, x0 + 3 * u, y0 + 16, '6 in', { size: 17 }), txt(svg, x0 - 22, y0 - 2 * u, '4 in', { size: 17 })];
      const big = hide(photo(svg, x0, y0 - 4 * u, 6 * u, 4 * u));
      const l1 = [hide(txt(svg, x0 + 9 * u, 92, '18 in', { size: 19, color: BLUE, weight: 800 })), hide(txt(svg, x0 + 18 * u + 30, y0 - 6 * u, '12 in', { size: 19, color: BLUE, weight: 800 }))];
      const ln = lines(stage, ox + 640, 60, 330, [`${T('4\\times3=12')}`, `${T('6\\times3=18')}`, 'The print is <b>12 in by 18 in</b>.']);
      const st = hide(stamp(stage, 'same picture, bigger ✓', { ok: true, x: ox + 805, y: 300, size: 'sm' }));
      return [
        { cap: 'Mei’s photo: 4 in by 6 in.', run: (c) => pulse(c, pp(ph), 1.05, 500) },
        { cap: `${T('k=3')}: multiply <b>both</b> sides by 3. ${T('4\\times3=12')} and ${T('6\\times3=18')}.`, run: async (c) => { big.style.opacity = 1; l0.forEach((e) => (e.style.opacity = 0)); await tween(c, 1300, (t) => { const s = 1 + 2 * t; big.size(x0, y0 - 4 * u * s, 6 * u * s, 4 * u * s); }); await c.pop(l1[0]); await c.pop(l1[1]); await c.pop(ln[0]); await c.pop(ln[1]); } },
        { cap: 'The print is <b>12 in by 18 in</b>: the whole picture, just bigger.', run: async (c) => { await c.pop(ln[2]); await stampIn(c, st); } }
      ];
    }
    if (v === 'b') {
      const u = 24, x0 = ox + 50, y0 = 380, xp = ox + 300;
      photo(svg, x0, y0 - 4 * u, 6 * u, 4 * u);
      txt(svg, x0 + 3 * u, y0 + 16, '6 in', { size: 17 }); txt(svg, x0 - 20, y0 - 2 * u, '4 in', { size: 17 }); txt(svg, x0 + 3 * u, y0 - 4 * u - 20, 'photo', { size: 18, weight: 800 });
      const pr = svgEl('rect', { x: xp, y: y0 - 8 * u, width: 10 * u, height: 8 * u, fill: '#fff', stroke: INK, 'stroke-width': 3 }, svg);
      txt(svg, xp + 5 * u, y0 + 16, '10 in', { size: 17 }); txt(svg, xp - u - 22, y0 - 4 * u, '8 in', { size: 17 }); txt(svg, xp + 5 * u, y0 - 8 * u - 20, 'print', { size: 18, weight: 800 });
      const big = hide(photo(svg, xp - u, y0 - 8 * u, 12 * u, 8 * u));
      const cut = [hide(svgEl('rect', { x: xp - u, y: y0 - 8 * u, width: u, height: 8 * u, fill: RED, 'fill-opacity': 0.55 }, svg)), hide(svgEl('rect', { x: xp + 10 * u, y: y0 - 8 * u, width: u, height: 8 * u, fill: RED, 'fill-opacity': 0.55 }, svg))];
      const cl = hide(txt(svg, xp + 5 * u, y0 - 8 * u - 46, 'cropped: 1 in off each side', { size: 17, color: RED, weight: 800 }));
      const ln = lines(stage, ox + 640, 50, 330, [`${T('8\\div4=2')}`, `${T('10\\div6\\approx1.67')}`, `${T('\\times2')} to fill the 8 in: ${T('6\\times2=12')} in wide, but the print is only 10 in`]);
      const st = hide(stamp(stage, 'not similar ✗', { ok: false, x: ox + 805, y: 300, size: 'sm' }));
      void pr;
      return [
        { cap: 'The photo is 4 in by 6 in. The print is 8 in by 10 in.', run: (c) => sleepPulse(c) },
        { cap: `Divide print by photo, for each direction: ${T('8\\div4=2')}, but ${T('10\\div6\\approx1.67')}.`, run: async (c) => { await c.pop(ln[0]); await c.pop(ln[1]); } },
        { cap: 'Two different numbers: the sides were not multiplied by the same k. <b>Not similar</b>.', run: (c) => stampIn(c, st) },
        { cap: `Enlarge with ${T('k=2')} to fill the height: the photo is 12 in wide. The print is 10 in, so part of the picture is <b>cropped</b>.`, run: async (c) => { big.style.opacity = 1; await c.pop(big); for (const e of cut) { e.style.opacity = 1; await c.pop(e, 300); } await c.pop(cl); await c.pop(ln[2]); } }
      ];
    }
    const u = 6, x0 = ox + 40, y0 = 60;
    svgEl('rect', { x: x0, y: y0, width: 60 * u, height: 45 * u, fill: '#fff', stroke: INK, 'stroke-width': 3 }, svg);
    txt(svg, x0 + 30 * u, y0 + 45 * u + 18, '60 cm', { size: 17 }); txt(svg, x0 + 60 * u + 30, y0 + 22.5 * u, '45 cm', { size: 17 });
    txt(svg, x0 + 30 * u, y0 - 18, 'poster paper', { size: 18, weight: 800 });
    const ph = photo(svg, x0, y0, 15 * u, 10 * u);
    const pl = txt(svg, x0 + 7.5 * u, y0 + 10 * u + 16, '15 cm by 10 cm', { size: 15, color: SLATE });
    const over = hide(svgEl('rect', { x: x0 + 60 * u, y: y0, width: 7.5 * u, height: 45 * u, fill: RED, 'fill-opacity': 0.5 }, svg));
    const ovl = hide(txt(svg, x0 + 63.75 * u, y0 + 45 * u + 18, '67.5 cm ✗', { size: 16, color: RED, weight: 800 }));
    const strip = hide(svgEl('rect', { x: x0, y: y0 + 40 * u, width: 60 * u, height: 5 * u, fill: AMBER, 'fill-opacity': 0.35 }, svg));
    const sl = hide(txt(svg, x0 + 30 * u, y0 + 42.5 * u, 'left over: 5 cm', { size: 16, color: '#8a5a06', weight: 800 }));
    const ln = lines(stage, ox + 640, 40, 330, [`long: ${T('60\\div15=4')}`, `short: ${T('45\\div10=4.5')}`, `${T('k=4.5')}: ${T('15\\times4.5=67.5')} cm, too long ✗`, `${T('k=4')}: ${T('60')} cm by ${T('40')} cm ✓`, `left over: ${T('45-40=5')} cm`]);
    const sz = (s) => ph.size(x0, y0, 15 * u * s, 10 * u * s);
    return [
      { cap: 'The photo is 15 cm by 10 cm. The sheet is 60 cm by 45 cm.', run: (c) => pulse(c, pp(ph), 1.06, 500) },
      { cap: `Find ${T('k')} for each direction: long sides ${T('60\\div15=4')}, short sides ${T('45\\div10=4.5')}.`, run: async (c) => { await c.pop(ln[0]); await c.pop(ln[1]); } },
      { cap: `Try the bigger one, ${T('k=4.5')}: the long side is ${T('15\\times4.5=67.5')} cm. Too long for the sheet ✗`, run: async (c) => { await op(c, pl, 0, 200); await tween(c, 1400, (t) => sz(1 + 3.5 * t)); over.style.opacity = 1; await c.pop(over); await c.pop(ovl); await c.pop(ln[2]); } },
      { cap: `Use the <b>smaller</b> one, ${T('k=4')}: ${T('15\\times4=60')} cm by ${T('10\\times4=40')} cm. It fits ✓`, run: async (c) => { await Promise.all([op(c, over, 0, 300), op(c, ovl, 0, 300)]); await tween(c, 900, (t) => sz(4.5 - 0.5 * t)); await c.pop(ln[3]); } },
      { cap: `Left over: ${T('45-40=5')} cm across the short direction. The poster is <b>60 cm by 40 cm</b>.`, run: async (c) => { strip.style.opacity = 1; await c.pop(strip); await c.pop(sl); await c.pop(ln[4]); } }
    ];
  }
};
const sleepPulse = (c) => tween(c, 500, () => {});

/* ======================================================================================
 * 5b. Checking a drawing: copy ÷ original (Example 10 check)
 * ====================================================================================== */
const JADA = [['WX', 2, 6], ['XY', 3, 9], ['YZ', 2.5, 8.5], ['ZW', 4, 12]];
const check = {
  title: 'Check a drawing: copy ÷ original = k?',
  height: 400,
  choices: [{ sep: 'Example 10 check:' }, { v: 'jada', label: 'Jada’s copy, k = 3' }],
  ask: 'Example 10: Jada enlarged WXYZ with k = 3. Is her copy similar?',
  make(stage, v, ex) {
    const W = ex.W, ox = Math.max(0, (W - 980) / 2);
    const tb = h('div', 'u6l3-jt'); add(stage, tb, ox + 20, 16);
    tb.innerHTML = `<div class="u6l3-jh">Side</div><div class="u6l3-jh">Original</div><div class="u6l3-jh">Jada’s copy</div><div class="u6l3-jh">Copy ÷ original</div><div class="u6l3-jh"></div>`;
    const res = [], stm = [];
    JADA.forEach(([s, o, n]) => {
      [T(s), o.toFixed(1) + ' cm', n.toFixed(1) + ' cm'].forEach((x) => tb.appendChild(h('div', '', x)));
      const r = h('div', 'u6l3-jr', T(`${nf(n)}\\div${nf(o)}=${nf(n / o)}`)); tb.appendChild(r); hide(r); res.push(r);
      const sc = h('div', 'u6l3-js'); tb.appendChild(sc); const okk = Math.abs(n / o - 3) < 1e-9; const sp = stamp(sc, okk ? '✓' : '✗', { ok: okk, size: 'sm' }); hide(sp); stm.push(sp);
    });
    const ln = lines(stage, ox + 600, 270, 370, [`fix: ${T("Y'Z'=2.5\\times3=7.5")} cm`, 'then measure all four pairs of angles: each pair must be equal']);
    const ang = lines(stage, ox + 30, 300, 540, [`${T("\\angle W=\\angle W'")} &nbsp; ${T("\\angle X=\\angle X'")} &nbsp; ${T("\\angle Y=\\angle Y'")} &nbsp; ${T("\\angle Z=\\angle Z'")}`], 'u6l3-angs');
    const steps = JADA.map(([s, o, n], i) => ({
      cap: `${T(s)}: ${T(`${nf(n)}\\div${nf(o)}=${nf(n / o)}`)}${Math.abs(n / o - 3) < 1e-9 ? ' ✓' : `. <b>Not 3</b> ✗`}`,
      run: async (c) => { await c.pop(res[i]); await stampIn(c, stm[i]); }
    }));
    steps.unshift({ cap: 'Divide each copy side by its matching original side. Every answer should be <b>3</b>.', run: (c) => pulse(c, tb, 1.02, 500) });
    steps.push({ cap: `${T('YZ')} is wrong, so the copy is <b>not similar</b>. ${T("Y'Z'")} should be ${T('2.5\\times3=7.5')} cm.`, run: (c) => c.pop(ln[0]) });
    steps.push({ cap: 'With the sides fixed, Jada must still check the <b>angles</b>: each angle in her copy must match the original.', run: async (c) => { await c.pop(ln[1]); await c.pop(ang[0]); } });
    return steps;
  }
};

mountExplainers({ scale, addmult, grid: grid2, slant, ruler: rulerEx, project, why, photo: photoEx, check });

/* ======================================================================================
 * Hands-on: draw the image on a grid (Geo.gridDraw)
 * ====================================================================================== */
const GD = [
  { label: 'Flag, k = 2', pts: [[0, 0], [1, 0], [1, 2], [3, 3], [1, 4], [0, 4]], k: 2 },
  { label: 'Steps, k = ½', pts: [[0, 0], [6, 0], [6, 2], [4, 2], [4, 4], [2, 4], [2, 6], [0, 6]], k: 0.5 },
  { label: 'Wedge, k = 1.5', pts: [[0, 0], [4, 0], [4, 2]], k: 1.5 },
  { label: 'Kite, any k', pts: [[0, 0], [2, 0], [3, 2], [1, 3]], k: null }
];
(function gdTool() {
  const host = document.getElementById('u6l3-gd'), bar = document.getElementById('u6l3-gdbar'); if (!host || !bar) return;
  const btns = [];
  const pick = (i) => {
    host.innerHTML = '';
    const g = GD[i];
    Geo.gridDraw(host, { cols: 24, rows: 11, cell: 37, pts: g.pts, at: [1, 1], k: g.k, prompt: g.k == null ? 'Draw <b>any</b> similar copy (bigger or smaller). Check tells you its k.' : undefined });
    btns.forEach((b, j) => b.setAttribute('aria-pressed', String(i === j)));
  };
  GD.forEach((g, i) => { const b = h('button', 'pill small', g.label); b.type = 'button'; b.setAttribute('data-tap', ''); b.onclick = () => pick(i); bar.appendChild(b); btns.push(b); });
  pick(0);
})();

/* ======================================================================================
 * Static figures
 * ====================================================================================== */
const FIG = {
  wans(host) {
    const s = figSvg(host, 270, 150), E = [18, 75], M = [245, 75], R = 22;
    svgEl('rect', { x: 0, y: 0, width: 270, height: 150, rx: 12, fill: '#1d2a48' }, s);
    path(s, polyD([E, [M[0], M[1] - R], [M[0], M[1] + R]]), { stroke: '#f5e7b8', width: 1.6, fill: '#f5e7b8', fo: 0.15, cls: '' });
    svgEl('circle', { cx: M[0], cy: M[1], r: R, fill: '#f6efd6' }, s);
    svgEl('rect', { x: 66, y: 75 - 4.6, width: 9, height: 9.2, rx: 2, fill: '#e58aa0', stroke: '#8a3550', 'stroke-width': 1.5 }, s);
    svgEl('ellipse', { cx: E[0], cy: E[1], rx: 9, ry: 6, fill: '#fff' }, s); svgEl('circle', { cx: E[0] + 2, cy: E[1], r: 3, fill: '#2a3a5c' }, s);
    txt(s, 70, 104, 'eraser, 60 cm away', { size: 12.5, color: '#fff', halo: false });
    txt(s, 196, 128, 'Moon: 3 474 km wide,', { size: 12.5, color: '#fff', halo: false }); txt(s, 196, 142, '384 400 km away', { size: 12.5, color: '#fff', halo: false });
  },
  bird(host) {
    const s = figSvg(host, 250, 290), sc = 11.5, O = [38, 262], P = (x, y) => [O[0] + x * sc, O[1] - y * sc];
    path(s, polyD(BIRD.map((p) => P(...p))), { fill: '#f1e2c8', width: 3 });
    svgEl('circle', { cx: P(7.5, 7)[0], cy: P(7.5, 7)[1], r: 18, fill: '#fff', stroke: INK, 'stroke-width': 2.5 }, s);
    txt(s, ...P(7.5, -1.4), '15 cm', { size: 16 }); txt(s, ...P(-2.2, 6), '12 cm', { size: 16 }); txt(s, ...P(17.3, 6), '12 cm', { size: 16 });
    txt(s, ...P(1.6, 17.6), '10.5 cm', { size: 16 }); txt(s, ...P(13.4, 17.6), '10.5 cm', { size: 16 }); txt(s, ...P(7.5, 16.6), '91°', { size: 16 });
  },
  ex3(host) {
    const s = figSvg(host, 545, 380), cs = 28;
    const G1 = grid(s, 10, 170, 6, 7, cs), G2 = grid(s, 230, 20, 11, 12, cs);
    const H = [[1, 1], [5, 1], [5, 4], [3, 6], [1, 4]];
    const P1 = H.map((p) => G1(...p)); path(s, polyD(P1), { fill: '#e9edf4', width: 3, cls: '' });
    [['A', -12, 12], ['B', 12, 12], ['C', 14, 0], ['D', 0, -14], ['E', -14, 0]].forEach(([t, dx, dy], i) => txt(s, P1[i][0] + dx, P1[i][1] + dy, t, { size: 18 }));
    const a = svgEl('g', { class: 'u6l3-fa' }, s);
    const I = [[1, 1], [9, 1], [9, 7], [5, 11], [1, 7]].map((p) => G2(...p));
    path(a, polyD(I), { stroke: BLUE, width: 3.2, fill: '#dbe7fb', fo: 0.5, cls: '' });
    [['B′', 14, 12], ['C′', 18, 0], ['D′', 0, -15], ['E′', -18, 0]].forEach(([t, dx, dy], i) => txt(a, I[i + 1][0] + dx, I[i + 1][1] + dy, t, { size: 18, color: BLUE }));
    dot(s, G2(1, 1), { r: 5.5 }); txt(s, G2(1, 1)[0] - 16, G2(1, 1)[1] + 14, 'A′', { size: 18 });
  },
  ex4(host) {
    const s = figSvg(host, 960, 320), cs = 28, x1 = 150;
    const G1 = grid(s, x1, 10, 12, 10, cs), G2 = grid(s, x1 + 12 * cs + 70, 66, 7, 6, cs);
    const P = [[1, 3], [7, 3], [7, 1], [11, 5], [7, 9], [7, 7], [1, 7]].map((p) => G1(...p));
    path(s, polyD(P), { fill: '#e9edf4', width: 3, cls: '' });
    dot(s, G1(1, 3), { r: 5.5 }); txt(s, G1(1, 3)[0] - 30, G1(1, 3)[1], 'start', { size: 17 });
    const a = svgEl('g', { class: 'u6l3-fa' }, s);
    path(a, polyD([[1, 2], [4, 2], [4, 1], [6, 3], [4, 5], [4, 4], [1, 4]].map((p) => G2(...p))), { stroke: BLUE, width: 3.2, fill: '#dbe7fb', fo: 0.5, cls: '' });
    dot(s, G2(1, 2), { r: 5.5 });
  },
  exg(host) {
    const s = figSvg(host, 820, 280), cs = 34;
    const G1 = grid(s, 60, 50, 5, 5, cs), G2 = grid(s, 340, 10, 8, 7, cs);
    path(s, polyD([[1, 1], [4, 1], [4, 2], [2, 2], [2, 4], [1, 4]].map((p) => G1(...p))), { fill: '#e9edf4', width: 3, cls: '' });
    dot(s, G1(1, 1), { r: 5.5 }); dot(s, G2(1, 1), { r: 5.5 });
    const a = svgEl('g', { class: 'u6l3-fa' }, s);
    path(a, polyD([[1, 1], [5.5, 1], [5.5, 2.5], [2.5, 2.5], [2.5, 5.5], [1, 5.5]].map((p) => G2(...p))), { stroke: BLUE, width: 3.2, fill: '#dbe7fb', fo: 0.5, cls: '' });
  },
  rkey(host) {
    const s = figSvg(host, 330, 240), Q = [40, 200], R = [290, 200], r = 95;
    path(s, `M${Q[0] - r} ${Q[1]} A${r} ${r} 0 0 1 ${Q[0] + r} ${Q[1]} Z`, { stroke: '#7aa7e8', width: 2, fill: '#eaf2fd', fo: 0.8, cls: '' });
    for (let d = 0; d <= 180; d += 10) { const p1 = A(Q, d, r), p2 = A(Q, d, r - (d % 30 === 0 ? 12 : 7)); line(s, p1, p2, { width: 1.3, color: '#7aa7e8', cls: '' }); }
    line(s, Q, R, { width: 3.4 }); line(s, Q, A(Q, 55, 170), { width: 3.4 });
    arcLab(s, Q, 0, 55, '', { r: 34, color: RED });
    dot(s, Q, { r: 5 }); dot(s, R, { r: 5 });
    txt(s, Q[0] - 4, Q[1] + 20, 'Q′', { size: 18 }); txt(s, R[0] + 4, R[1] + 20, 'R′', { size: 18 });
    txt(s, 180, 222, 'k × QR', { size: 16, color: SLATE });
    txt(s, 205, 96, 'copy ∠Q', { size: 16, color: RED, weight: 700 }); txt(s, 205, 116, '(here 55°)', { size: 15, color: RED });
  },
  pkey(host) {
    const s = figSvg(host, 340, 250), O = [24, 150], u = 56, C = [[30, 2], [8, 2.5], [-12, 1.8]];
    C.forEach(([d, r]) => path(s, polyD([O, A(O, d, r * 2.3 * u)], false), { stroke: SLATE, width: 1.4, cls: '' }));
    path(s, polyD(C.map(([d, r]) => A(O, d, r * u))), { fill: '#e9edf4', width: 2.8, cls: '' });
    path(s, polyD(C.map(([d, r]) => A(O, d, 2 * r * u))), { stroke: BLUE, width: 3, fill: '#dbe7fb', fo: 0.4, cls: '' });
    dot(s, O, { r: 5 }); txt(s, O[0] - 2, O[1] + 18, 'O', { size: 17 });
    [['A', 0, 90], ['B', 1, 90], ['C', 2, -90]].forEach(([t, i, sd]) => { txt(s, ...A(A(O, C[i][0], C[i][1] * u), C[i][0] + sd, 14), t, { size: 16 }); txt(s, ...A(A(O, C[i][0], 2 * C[i][1] * u), C[i][0] + sd, 16), t + '′', { size: 16, color: BLUE }); });
    txt(s, 175, 232, 'k = 2: OA′ = 2 × OA', { size: 16, color: SLATE, weight: 700 });
  },
  ex5(host) {
    const s = figSvg(host, 430, 560), u = 50, Q = [70, 200], R = [Q[0] + 4 * u, Q[1]], P = [Q[0] + 2.401 * u, Q[1] - 3.429 * u];
    path(s, polyD([Q, R, P]), { fill: '#e9edf4', width: 3, cls: '' });
    txt(s, Q[0] - 14, Q[1] + 14, 'Q', { size: 19 }); txt(s, R[0] + 14, R[1] + 14, 'R', { size: 19 }); txt(s, P[0], P[1] - 15, 'P', { size: 19 });
    const a = svgEl('g', { class: 'u6l3-fa' }, s), u2 = 1.5 * u, Q2 = [40, 535], R2 = [Q2[0] + 4 * u2, Q2[1]], P2 = [Q2[0] + 2.401 * u2, Q2[1] - 3.429 * u2];
    path(a, polyD([Q2, R2, P2]), { stroke: BLUE, width: 3, fill: '#dbe7fb', fo: 0.5, cls: '' });
    txt(a, Q2[0] - 16, Q2[1] + 10, 'Q′', { size: 18, color: BLUE }); txt(a, R2[0] + 18, R2[1] + 10, 'R′', { size: 18, color: BLUE }); txt(a, P2[0] + 18, P2[1] - 8, 'P′', { size: 18, color: BLUE });
    arcLab(a, Q2, 0, 55, '55°', { color: BLUE, r: 28, size: 15 }); arcLab(a, R2, 115, 65, '65°', { color: BLUE, r: 28, size: 15 });
    txt(a, (Q2[0] + R2[0]) / 2, Q2[1] + 0 - 12, '6 cm', { size: 16, color: BLUE });
  },
  ex6(host) {
    const s = figSvg(host, 960, 250), sc = 14, a = [80, 190], P = (x, y) => [a[0] + x * sc, a[1] - y * sc];
    path(s, polyD([P(0, 0), P(12, 0), P(4, 6), P(0, 6)]), { fill: '#e9edf4', width: 3, cls: '' });
    square(s, P(0, 0), 0, 11); square(s, P(0, 6), 270, 11);
    [[P(0, 0), 'A', -12, 12], [P(12, 0), 'B', 12, 12], [P(4, 6), 'C', 12, -12], [P(0, 6), 'D', -12, -12]].forEach(([p, t, dx, dy]) => txt(s, p[0] + dx, p[1] + dy, t, { size: 18 }));
    txt(s, ...P(6, -1.3), '12 cm', { size: 15 }); txt(s, ...P(-2.3, 3), '6 cm', { size: 15 }); txt(s, ...P(2, 7.2), '4 cm', { size: 15 }); txt(s, ...P(9.4, 3.6), '10 cm', { size: 15 });
    const g = svgEl('g', { class: 'u6l3-fa' }, s), u = 50, A2 = [470, 210], Pt = (x, y) => [A2[0] + x * u, A2[1] - y * u];
    const I = [Pt(0, 0), Pt(6, 0), Pt(2, 3), Pt(0, 3)];
    path(g, polyD(I), { stroke: BLUE, width: 3, fill: '#dbe7fb', fo: 0.5, cls: '' });
    square(g, I[0], 0, 12, { color: BLUE }); square(g, I[3], 270, 12, { color: BLUE });
    [[I[0], 'A′', -16, 12], [I[1], 'B′', 16, 12], [I[2], 'C′', 14, -14], [I[3], 'D′', -16, -12]].forEach(([p, t, dx, dy]) => txt(g, p[0] + dx, p[1] + dy, t, { size: 18, color: BLUE }));
    txt(g, ...Pt(3, -0.35), '6 cm', { size: 15, color: BLUE }); txt(g, ...Pt(-0.55, 1.5), '3 cm', { size: 15, color: BLUE }); txt(g, ...Pt(1, 3.35), '2 cm', { size: 15, color: BLUE }); txt(g, ...Pt(4.6, 1.85), '5 cm', { size: 15, color: BLUE });
  },
  ex7(host) {
    const s = figSvg(host, 500, 320), u = 60, O = [40, 190], C = [['A', 35, 2], ['B', 10, 3], ['C', -15, 2.5], ['D', 5, 1.5]];
    const a = svgEl('g', { class: 'u6l3-fa' }, s);
    C.forEach(([, d, r]) => path(a, polyD([O, A(O, d, 2 * r * u + 22)], false), { stroke: RED, width: 1.5, dash: '6 5', cls: '' }));
    const I = C.map(([, d, r]) => A(O, d, 2 * r * u));
    path(a, polyD(I), { stroke: BLUE, width: 3, fill: '#dbe7fb', fo: 0.45, cls: '' });
    const ci = cen(I); C.forEach(([n], i) => txt(a, ...away(I[i], ci, 18), n + '′', { size: 17, color: BLUE }));
    const P = C.map(([, d, r]) => A(O, d, r * u));
    path(s, polyD(P), { fill: '#e9edf4', width: 3, cls: '' });
    const cp = cen(P); C.forEach(([n], i) => txt(s, ...away(P[i], cp, 15), n, { size: 17 }));
    dot(s, O, { r: 5 }); txt(s, O[0] - 14, O[1] + 2, 'O', { size: 18 });
  },
  ex8(host) {
    const s = figSvg(host, 500, 385), u = 52, O = [260, 195], C = [['J', 90, 3], ['K', 160, 4], ['L', 230, 3], ['M', 300, 3.6], ['N', 20, 2.8]];
    const P = C.map(([, d, r]) => A(O, d, r * u));
    path(s, polyD(P), { fill: '#e9edf4', width: 3, cls: '' });
    C.forEach(([n, d], i) => txt(s, ...A(P[i], d, 16), n, { size: 18 }));
    const a = svgEl('g', { class: 'u6l3-fa' }, s);
    C.forEach(([, d, r]) => path(a, polyD([O, A(O, d, r * u)], false), { stroke: RED, width: 1.5, dash: '6 5', cls: '' }));
    const I = C.map(([, d, r]) => A(O, d, r * u / 2));
    path(a, polyD(I), { stroke: BLUE, width: 3, fill: '#dbe7fb', fo: 0.5, cls: '' });
    C.forEach(([n, d], i) => txt(a, ...A(I[i], d + 90, 14), n + '′', { size: 15, color: BLUE }));
    dot(s, O, { r: 5 }); txt(s, O[0], O[1] + 17, 'O', { size: 17 });
  }
};
document.querySelectorAll('.u6l3-fig[data-fig]').forEach((host) => { const f = FIG[host.dataset.fig]; if (f) f(host); });

/* ======================================================================================
 * Math History: the pantograph (pin O, pointer S, pencil P = 2S on one line)
 * ====================================================================================== */
(function histAnim() {
  const svg = document.getElementById('u6l3-hist'); if (!svg) return;
  const NS = 'http://www.w3.org/2000/svg', mk = (t, a, p = svg) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); p.appendChild(e); return e; };
  mk('rect', { x: 0, y: 0, width: 600, height: 300, rx: 14, fill: '#fffaf1' });
  const O = [140, 272], X = (p) => [O[0] + p[0], O[1] - p[1]];
  const HOUSE = [[100, 12], [150, 12], [150, 52], [125, 77], [100, 52]];
  const loop = HOUSE.concat([HOUSE[0]]), segs = []; let tot = 0;
  for (let i = 0; i < 5; i++) { const L = Math.hypot(loop[i + 1][0] - loop[i][0], loop[i + 1][1] - loop[i][1]); segs.push([loop[i], loop[i + 1], L]); tot += L; }
  const along = (f) => { let d = f * tot; for (const [p, q, L] of segs) { if (d <= L) return [p[0] + (q[0] - p[0]) * d / L, p[1] + (q[1] - p[1]) * d / L]; d -= L; } return loop[5]; };
  const str = (P) => P.map((p) => X(p).map((v) => v.toFixed(1)).join(' ')).join(' ');
  mk('polygon', { points: str(HOUSE), fill: 'none', stroke: '#c8b89a', 'stroke-width': 2.5, 'stroke-dasharray': '5 4' });
  const big = mk('polyline', { points: '', fill: 'none', stroke: '#4a2c14', 'stroke-width': 3.5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' });
  const small = mk('polyline', { points: '', fill: 'none', stroke: '#b07a12', 'stroke-width': 3, 'stroke-linejoin': 'round' });
  const lineOP = mk('line', { stroke: '#b07a12', 'stroke-width': 2.5, 'stroke-dasharray': '7 6', opacity: 0 });
  const rod = () => mk('line', { stroke: '#7a4a26', 'stroke-width': 9, 'stroke-linecap': 'round', opacity: 0.92 });
  const rOA = rod(), rAP = rod(), rBS = rod(), rCS = rod();
  const jt = () => mk('circle', { r: 6, fill: '#fffaf1', stroke: '#4a2c14', 'stroke-width': 2.5 });
  const jA = jt(), jB = jt(), jC = jt();
  mk('circle', { cx: O[0], cy: O[1], r: 9, fill: '#b07a12', stroke: '#4a2c14', 'stroke-width': 2.5 });
  const lO = mk('text', { x: O[0] - 40, y: O[1] + 5, 'font-family': 'Georgia, serif', 'font-size': 16, fill: '#4a2c14', 'text-anchor': 'middle' }); lO.textContent = 'pin O';
  const ptr = mk('circle', { r: 7, fill: '#c93a33', stroke: '#4a2c14', 'stroke-width': 2 });
  const pen = mk('polygon', { points: '', fill: '#4a2c14' });
  const cap = mk('text', { x: 300, y: 34, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 21, fill: '#4a2c14' });
  const foot = mk('text', { x: 382, y: 290, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 16, fill: '#7a4a26' });
  const set = (el, a) => { for (const k in a) el.setAttribute(k, typeof a[k] === 'number' ? a[k].toFixed(1) : a[k]); };
  const l = 100;   // rods: OA = AP = 2l; B, C their midpoints; BS ∥ AC and CS ∥ BA (a parallelogram), so S is the midpoint of OP
  const draw = (s) => {
    const f = Math.max(0, Math.min(1, (s - 0.6) / 8)), Sp = along(f), Pp = [2 * Sp[0], 2 * Sp[1]];
    const D = Math.hypot(Pp[0], Pp[1]), a = D / 2, hh = Math.sqrt(Math.max(0, 4 * l * l - a * a)), Ap = [Pp[0] / 2 - hh * Pp[1] / D, Pp[1] / 2 + hh * Pp[0] / D];
    const Bp = [Ap[0] / 2, Ap[1] / 2], Cp = [(Ap[0] + Pp[0]) / 2, (Ap[1] + Pp[1]) / 2];
    const [o, A2, B2, C2, S2, P2] = [[0, 0], Ap, Bp, Cp, Sp, Pp].map(X);
    set(rOA, { x1: o[0], y1: o[1], x2: A2[0], y2: A2[1] }); set(rAP, { x1: A2[0], y1: A2[1], x2: P2[0], y2: P2[1] });
    set(rBS, { x1: B2[0], y1: B2[1], x2: S2[0], y2: S2[1] }); set(rCS, { x1: C2[0], y1: C2[1], x2: S2[0], y2: S2[1] });
    set(jA, { cx: A2[0], cy: A2[1] }); set(jB, { cx: B2[0], cy: B2[1] }); set(jC, { cx: C2[0], cy: C2[1] });
    set(ptr, { cx: S2[0], cy: S2[1] }); pen.setAttribute('points', `${P2[0]},${P2[1]} ${P2[0] - 6},${P2[1] - 18} ${P2[0] + 6},${P2[1] - 18}`);
    const n = Math.max(1, Math.round(f * 200)), tr = []; for (let i = 0; i <= n; i++) tr.push(along(i / 200 > f ? f : i / 200));
    small.setAttribute('points', str(tr)); big.setAttribute('points', str(tr.map((p) => [2 * p[0], 2 * p[1]])));
    const e = Math.max(0, Math.min(1, (s - 9) / 0.8)); set(lineOP, { x1: o[0], y1: o[1], x2: P2[0], y2: P2[1], opacity: e });
    cap.textContent = s < 9 ? 'The pointer traces the small house. The pencil draws it bigger.' : 'Pin, pointer and pencil: always on one line';
    foot.textContent = s >= 9.4 ? 'pencil twice as far from O as the pointer: k = 2' : '';
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
})();

/* ======================================================================================
 * Stand Up Break
 * ====================================================================================== */
standup('u6l3', {
  intro: 'Write every step with units. Then check: bigger for an enlargement, smaller for a reduction?',
  levels: {
    BEG: (r) => {
      const x = r.pick([4, 5, 6, 8, 10, 12, 15, 20]), k = r.pick([2, 3, 4, 0.5, 1.5, 2.5, 0.25, 0.75]), n = x * k;
      return { text: `A side is <b>${x} cm</b>. A similar copy is made with <b>k = ${k}</b>. How long is the matching side? Is it an enlargement or a reduction?`, q: '', a: [`${x}\\times${k}=${nf(n)}\\text{ cm}`, `k${k > 1 ? '>' : '<'}1:\\ \\text{${k > 1 ? 'enlargement' : 'reduction'}}`] };
    },
    PRG: (r) => r.pick([
      () => {
        const [o, n] = r.pick([[8, 20], [12, 18], [15, 6], [10, 4], [6, 15], [20, 5], [9, 12], [16, 12], [5, 8], [25, 10]]), k = n / o;
        return { text: `A side of <b>${o} cm</b> becomes <b>${n} cm</b> in a similar copy. Find the scale factor. Enlargement or reduction?`, q: '', a: [`k=\\text{new}\\div\\text{original}=${n}\\div${o}=${nf(k)}`, `\\text{${k > 1 ? 'enlargement' : 'reduction'}}`] };
      },
      () => {
        const o = r.pick([4, 6, 8, 10, 12, 14, 16]), k = r.pick([2, 2.5, 3, 1.5, 0.5, 4]), n = o * k;
        return { text: `A copy made with <b>k = ${k}</b> has a side of <b>${nf(n)} cm</b>. How long was that side on the original?`, q: '', a: [`\\text{original}=\\text{new}\\div k=${nf(n)}\\div${k}=${o}\\text{ cm}`, `\\text{check: }${o}\\times${k}=${nf(n)}`] };
      }
    ])(),
    MAS: (r) => r.pick([
      () => {
        const [w, hh] = r.pick([[6, 4], [15, 10], [12, 8], [10, 8], [7, 5], [9, 6]]), k = r.pick([2, 3, 4, 5, 2.5]), e = r.pick([1, 2, 3, 5]), wide = r.pick([true, false]);
        const SW = wide ? w * k + e : w * k, SH = wide ? hh * k : hh * k + e, k1 = SW / w, k2 = SH / hh;
        return { text: `A <b>${w} by ${hh}</b> photo is enlarged to fit a <b>${SW} by ${SH}</b> space. Find the biggest similar size and the space left over.`, q: '', a: [`${SW}\\div${w}=${nf(k1)},\\quad ${SH}\\div${hh}=${nf(k2)}`, `k=${nf(Math.min(k1, k2))}\\ \\text{(the smaller)}`, `${w}\\times${nf(k)}=${nf(w * k)},\\ \\ ${hh}\\times${nf(k)}=${nf(hh * k)}`, `\\text{left over: }${e}`] };
      },
      () => {
        const d = r.pick([1.5, 2, 2.5, 3, 4]), k = r.pick([2, 3, 4, 0.5]), n = d * k;
        return { text: `Projection method: <b>OA = ${d} cm</b> and <b>k = ${k}</b>. How far from O is A′? How far ${k > 1 ? 'past' : 'short of'} A is it?`, q: '', a: [`OA'=${k}\\times${d}=${nf(n)}\\text{ cm from }O`, `${k > 1 ? `${nf(n)}-${d}` : `${d}-${nf(n)}`}=${nf(Math.abs(n - d))}\\text{ cm ${k > 1 ? 'past' : 'short of'} }A`] };
      }
    ])()
  }
});
