/* Math 10-3 · Unit 6 · Lesson 7 — Unit 6 Review (G3).
 * A review lesson: no practice break; the review assignment is a practice unit test, and (the review is the exception)
 * some of its multiple-choice questions appear as chips in the Full-notes "Spot the trap" explainer.
 * Card figures: Example 1 (Geo.similar), Example 2(a) beds, Example 3(a) a Geo.gridDraw students tap to draw on,
 * Example 3(b) projection rays (the image shows with the answers), Example 4 a Geo.mapTape with a draggable tape,
 * Example 6 the shed roof, Examples 7 and 8 (Geo.shadow, Geo.mirror).
 * Explainers (Class view unless marked):
 *   area     (Full notes: copies of the small patio fill the big one: k × k for area),
 *   simk     (matching colours and letters, k = 9 ÷ 6, the missing sides filled in × k or ÷ k; Example 1),
 *   tester   (the "similarity tester": angles row, ratio chips, stamp; Bree's photo enlarged over the print and cropped;
 *             square vs rhombus; Example 2),
 *   draw     (the image appears side by side on the grid; points slide out along the rays from O with a live distance;
 *             AB laid 2.5 times along A′B′; Example 3),
 *   map      (the tape measures each part of the trail and the lake; Example 4),
 *   plan     (the bedroom flies onto the plan; the garage rescales on the paper at 1:50, 1:100, 1:200; Example 5),
 *   aa       (third angles, matching colours, RQP turning and shrinking onto KLM; the small roof triangle growing into
 *             the big one, then the post sliding along with a live height; Example 6),
 *   indirect (sun rays and similar triangles; the light ray bouncing off the mirror; Examples 7, 8),
 *   traps    (Full notes: practice-test multiple choice, with the mistake behind every wrong choice).
 * Then the Stand Up Break (mixed review like the unit test). geo.js covered everything needed. */
import { h, add, box, tex, svgEl, tween, pulse, stamp, stampIn, mountExplainers } from '../blocks.js';
import { Geo, text as gText } from '../geo.js';
/** Geo.text, ready to pop or pulse in place */
const gT = (...a) => { const e = gText(...a); e.style.transformBox = 'fill-box'; e.style.transformOrigin = 'center'; return e; };
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const lerp = (a, b, t) => a + (b - a) * t;
const RAD = Math.PI / 180;
const BLUE = '#1f5bd6', GREEN = '#12805a', RED = '#c93a33', AMBER = '#c27a0e', INK = '#1c2230', BROWN = '#9a6a24', SLATE = '#5b6880';
const MC = Geo.MATCH_COLORS;
const nf = (v, dp = 3) => Geo.fmtLen(v, dp);
/** a number for KaTeX with a thin space every three digits */
const tn = (v, dp = 3) => nf(v, dp).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');
const col = (c, s) => `\\textcolor{${c}}{${s}}`;
/** an absolutely placed box on the stage */
const el = (stage, cls, html, x, y, w, hh) => add(stage, box(h('div', cls, html), w, hh), x, y);
/** a box whose mixed text and maths stay together on centred lines */
const cb = (stage, cls, html, x, y, w, hh) => el(stage, cls + ' u6l7-c', `<div>${html}</div>`, x, y, w, hh);
/** a working line (text and maths on one line) */
const ln = (stage, html, x, y, w, hh = 42, cls = '') => el(stage, 'u6l7-line ' + cls, `<div>${html}</div>`, x, y, w, hh);
const show = (c, e, ms = 400) => c.anim(e, [{ opacity: 0 }, { opacity: 1 }], ms);
const fadeOut = (c, e, ms = 250) => c.anim(e, [{ opacity: 1 }, { opacity: 0 }], ms);
const svgOn = (stage, W, H, x = 0, y = 0) => add(stage, svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u6l7-svg' }), x, y);

/* ---------- small SVG helpers (screen px) ---------- */
const P2 = (Q) => Q.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('L');
const pathOn = (svg, d, a = {}) => svgEl('path', Object.assign({ d, fill: 'none', stroke: INK, 'stroke-width': 3, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, a), svg);
const polyOn = (svg, Q, a) => pathOn(svg, 'M' + P2(Q) + 'Z', a);
const segOn = (svg, A, B, a) => pathOn(svg, 'M' + P2([A, B]), a);
const scr = (O, s) => (p) => [O[0] + p[0] * s, O[1] - p[1] * s];
const unit = (v) => { const L = Math.hypot(v[0], v[1]) || 1; return [v[0] / L, v[1] / L]; };
const mid = (A, B) => [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
const cen = (Q) => [Q.reduce((a, p) => a + p[0], 0) / Q.length, Q.reduce((a, p) => a + p[1], 0) / Q.length];
/** label side i of polygon Q, outside it */
function sideLab(svg, Q, i, s, o = {}) {
  const n = Q.length, A = Q[i], B = Q[(i + 1) % n], M = mid(A, B), C = cen(Q);
  let nr = unit([-(B[1] - A[1]), B[0] - A[0]]);
  if ((C[0] - M[0]) * nr[0] + (C[1] - M[1]) * nr[1] > 0) nr = [-nr[0], -nr[1]];
  const size = o.size || 18, hw = String(s).length * size * 0.29 + 3, d = (o.gap ?? 8) + Math.abs(nr[0]) * hw + Math.abs(nr[1]) * size * 0.55;
  return gT(svg, M[0] + nr[0] * d, M[1] + nr[1] * d, s, { size, color: o.color });
}
/** the interior angle mark at corner i of polygon Q (Geo.angle picks the side under 180°) */
const cornerArc = (svg, Q, i, o = {}) => Geo.angle(svg, Object.assign({ vertex: Q[i], a1: Q[(i + Q.length - 1) % Q.length], a2: Q[(i + 1) % Q.length], arms: false, dot: false, size: 16 }, o));
/** a vertex name just outside corner i */
function vName(svg, Q, i, s, o = {}) {
  const C = cen(Q), V = Q[i], u = unit([V[0] - C[0], V[1] - C[1]]), d = o.d || 16;
  return gT(svg, V[0] + u[0] * d, V[1] + u[1] * d, s, { size: o.size || 20, color: o.color, italic: true });
}

/* ================= shared figure data ================= */
const QUAD = [[0, 0], [1.553, 5.796], [5.193, 4.138], [8, 0]];          // ABCD: AB 6, BC 4, CD 5, DA 8 (cm)
const BED = [[0, 0], [5, 0], [4, 1.732], [1, 1.732]];                     // bed 1 (m); bed 2 is 1.5 times as big
const BED_SIDES = [['5 m', '2 m', '3 m', '2 m'], ['7.5 m', '3 m', '4.5 m', '3 m']];
const BED_ANG = ['60°', '60°', '120°', '120°'];
/** the two flower beds side by side, bottoms on y = base; → { Q: [bed1, bed2], arcs: [[…], […]], labs } */
function bedsFig(svg, x0, base, s, gap) {
  const Q1 = BED.map(scr([x0, base], s)), Q2 = BED.map((p) => [p[0] * 1.5, p[1] * 1.5]).map(scr([x0 + 5 * s + gap, base], s));
  const out = { Q: [Q1, Q2], arcs: [[], []], labs: [[], []], polys: [] };
  [Q1, Q2].forEach((Q, w) => {
    out.polys.push(polyOn(svg, Q, { fill: '#e6f4ea', stroke: INK, 'stroke-width': 3 }));
    Q.forEach((p, i) => { out.labs[w].push(sideLab(svg, Q, i, BED_SIDES[w][i], { size: 17 })); });
    Q.forEach((p, i) => { out.arcs[w].push(cornerArc(svg, Q, i, { r: 20 + w * 4, label: BED_ANG[i], size: 15 })); });
    const C = mid(Q[0], Q[1]); gT(svg, C[0], C[1] + 44, `Bed ${w + 1}`, { size: 17, color: SLATE });
  });
  return out;
}
const SIGN = [[1, 1], [3, 1], [4, 2], [3, 3], [1, 3]];                     // Example 3(a) sign (grid squares)
const SIGN2 = SIGN.map((p) => [1 + (p[0] - 1) * 2, 1 + (p[1] - 1) * 2]);   // its image with k = 2
const PROJ = [{ n: 'A', r: 2, a: 8, ray: 5.4 }, { n: 'B', r: 3, a: 30, ray: 7.9 }, { n: 'C', r: 2.4, a: 52, ray: 6.4 }];
const polar = (r, a) => [r * Math.cos(a * RAD), r * Math.sin(a * RAD)];
/** Example 3(b): rays from O, △ABC and (optionally) △A′B′C′ */
function projFig(svg, O, s, image) {
  const S = scr(O, s), out = { rays: [], pts: [], img: [] };
  PROJ.forEach((p) => out.rays.push(segOn(svg, O, S(polar(p.ray, p.a)), { stroke: '#8a93a3', 'stroke-width': 1.8, 'stroke-dasharray': '7 6' })));
  const Q = PROJ.map((p) => S(polar(p.r, p.a)));
  out.tri = polyOn(svg, Q, { fill: '#e9edf4', stroke: INK, 'stroke-width': 3 });
  out.names = Q.map((q, i) => gT(svg, q[0] + [6, 14, -16][i], q[1] + [18, 4, -8][i], PROJ[i].n, { size: 19, italic: true }));
  svgEl('circle', { cx: O[0], cy: O[1], r: 5, fill: INK }, svg); gT(svg, O[0] - 16, O[1] + 2, 'O', { size: 20, italic: true });
  out.Q = Q; out.Q2 = PROJ.map((p) => S(polar(p.r * 2.5, p.a)));
  if (image) {
    const g = svgEl('g', { class: image === true ? '' : image }, svg);
    polyOn(g, out.Q2, { fill: 'rgba(201,58,51,.07)', stroke: RED, 'stroke-width': 3 });
    out.Q2.forEach((q, i) => gT(g, q[0] + [8, 22, -20][i], q[1] + [18, 0, -8][i], PROJ[i].n + '′', { size: 19, italic: true, color: RED }));
    out.imgG = g;
  }
  return out;
}
const SHED = { A: [0, 0], D: [2.4, 0], C: [6, 0], E: [2.4, 1.5], B: [6, 3.75] };
/** the right-angle square at V between directions toward P and Q (screen px) */
function rightSq(svg, V, P, Q, s = 14, a = {}) {
  const u = unit([P[0] - V[0], P[1] - V[1]]), v = unit([Q[0] - V[0], Q[1] - V[1]]);
  return pathOn(svg, 'M' + P2([[V[0] + u[0] * s, V[1] + u[1] * s], [V[0] + (u[0] + v[0]) * s, V[1] + (u[1] + v[1]) * s], [V[0] + v[0] * s, V[1] + v[1] * s]]), Object.assign({ 'stroke-width': 2 }, a));
}
/** a dimension line with arrow ends and a label under (or beside) it */
function dim(svg, A, B, s, o = {}) {
  const g = svgEl('g', {}, svg), d = unit([B[0] - A[0], B[1] - A[1]]), n = [-d[1], d[0]], k = 7;
  segOn(g, A, B, { stroke: SLATE, 'stroke-width': 1.6 });
  [[A, 1], [B, -1]].forEach(([P, sg]) => pathOn(g, 'M' + P2([[P[0] + sg * d[0] * k + n[0] * 4, P[1] + sg * d[1] * k + n[1] * 4], P, [P[0] + sg * d[0] * k - n[0] * 4, P[1] + sg * d[1] * k - n[1] * 4]]), { stroke: SLATE, 'stroke-width': 1.6 }));
  const M = mid(A, B); gT(g, M[0] + (o.dx || 0), M[1] + (o.dy ?? 16), s, { size: o.size || 17, color: o.color || INK });
  return g;
}
function shedFig(svg, O, s) {
  const S = scr(O, s), P = {}; Object.keys(SHED).forEach((k) => { P[k] = S(SHED[k]); });
  const out = { P };
  out.big = polyOn(svg, [P.A, P.C, P.B], { fill: '#fbf1de', stroke: INK, 'stroke-width': 3 });
  out.small = polyOn(svg, [P.A, P.D, P.E], { fill: 'rgba(31,91,214,.12)', stroke: 'none' });
  out.post = segOn(svg, P.D, P.E, { stroke: INK, 'stroke-width': 3.4 });
  out.rC = rightSq(svg, P.C, P.A, P.B); out.rD = rightSq(svg, P.D, P.C, P.E);
  [['A', -12, 14], ['D', 0, 20], ['C', 12, 16], ['E', -14, -10], ['B', 14, -6]].forEach(([k, dx, dy]) => gT(svg, P[k][0] + dx, P[k][1] + dy, k, { size: 20, italic: true }));
  out.d1 = dim(svg, [P.A[0], P.A[1] + 40], [P.D[0], P.D[1] + 40], '2.4 m');
  out.d2 = dim(svg, [P.A[0], P.A[1] + 74], [P.C[0], P.C[1] + 74], '6 m');
  out.hE = gT(svg, P.D[0] + 34, (P.D[1] + P.E[1]) / 2, '1.5 m', { size: 17 });
  return out;
}

/* ================= static figures on the cards ================= */
{
  const f1 = document.getElementById('u6l7-ex1fig');
  if (f1) {
    const S = Geo.similar(f1, { width: 760, height: 290, pts: QUAD, k: 1.5, names: ['ABCD', 'WXYZ'], labels: [['6 cm', '4 cm', '', '8 cm'], ['9 cm', '', '7.5 cm', '']], gap: 150 });
    cornerArc(S.svg, S.orig, 1, { r: 22, label: '81°' });
  }
  const f2 = document.getElementById('u6l7-ex2fig');
  if (f2) { const svg = add(f2, svgEl('svg', { viewBox: '0 0 560 200', class: 'u6l7-fsvg' })); bedsFig(svg, 30, 140, 36, 46); }
  const gd = document.getElementById('u6l7-gd');
  if (gd) Geo.gridDraw(gd, { cols: 15, rows: 6, cell: 40, pts: SIGN, at: [1, 1], k: 2, imageAt: [7, 1] });
  const f3 = document.getElementById('u6l7-ex3fig');
  if (f3) { const svg = add(f3, svgEl('svg', { viewBox: '0 0 450 330', class: 'u6l7-fsvg' })); projFig(svg, [40, 300], 50, 'u6l7-hid'); }
  const f4 = document.getElementById('u6l7-ex4fig');
  if (f4) Geo.mapTape(f4, mapOpts({ width: 700, height: 300, a: [70, 240], b: [214, 240] }));
  const f6 = document.getElementById('u6l7-ex6fig');
  if (f6) { const svg = add(f6, svgEl('svg', { viewBox: '0 0 420 345', class: 'u6l7-fsvg' })); shedFig(svg, [30, 250], 56); }
  const f7 = document.getElementById('u6l7-ex7fig');
  if (f7) Geo.shadow(f7, { width: 460, height: 290, small: { h: 1.6, shadow: 2.4, label: { h: '1.6 m', s: '2.4 m' } }, big: { shadow: 33, kind: 'elevator', label: { h: 'h', s: '33 m' } } }).svg.style.overflow = 'visible';
  const f8 = document.getElementById('u6l7-ex8fig');
  if (f8) Geo.mirror(f8, { width: 460, height: 290, eye: 1.4, d1: 1.8, d2: 12.6, kind: 'pole', labels: { h: 'h' } });
}

/* ---------- Example 4: the trail map (px; 1 map cm = 60 px) ---------- */
function trail(P0, cmPx) {
  const add2 = (A, len, deg) => [A[0] + len * cmPx * Math.cos(deg * RAD), A[1] - len * cmPx * Math.sin(deg * RAD)];
  const P = P0, Q = add2(P, 2.4, 20), R = add2(Q, 3.1, -15), S = add2(R, 1.5, 60);
  const L = [P0[0] + 6.4 * cmPx, P0[1] - 1.98 * cmPx];
  return { P, Q, R, S, lake: L, lakeA: [L[0] - 1.4 * cmPx, L[1]], lakeB: [L[0] + 1.4 * cmPx, L[1]] };
}
function mapOpts(o) {
  const cmPx = 60, TR = trail([60, 230], cmPx);
  return Object.assign({
    scale: '1 cm : 0.2 km', cmPx, segments: 2, snap: true, grid: false,
    places: [{ name: 'P', at: TR.P, dx: -18, dy: 0 }, { name: 'Q', at: TR.Q }, { name: 'R', at: TR.R, dy: 26 }, { name: 'S', at: TR.S, dx: 20, dy: 8 }],
    map: (g) => {
      svgEl('ellipse', { cx: TR.lake[0], cy: TR.lake[1], rx: 1.4 * cmPx, ry: 0.45 * cmPx, fill: '#cfe0fb', stroke: '#7fb3f0', 'stroke-width': 2 }, g);
      gT(g, TR.lake[0] + 10, TR.lake[1] + 2, 'lake', { size: 16, color: '#1f4a8f', halo: false });
      [[120, 80], [150, 110], [95, 120], [300, 90], [330, 120], [560, 200], [600, 170], [250, 280]].forEach(([x, y]) => svgEl('path', { d: `M${x} ${y - 16}L${x + 10} ${y + 4}H${x - 10}Z`, fill: '#8fbf8f', stroke: '#4f8a55', 'stroke-width': 1.5 }, g));
      pathOn(g, 'M' + P2([TR.P, TR.Q, TR.R, TR.S]), { stroke: '#8a5a2b', 'stroke-width': 4, 'stroke-dasharray': '2 0' });
    }
  }, o);
}

/* =====================================================================================
 * Full notes: why area is k × k times as big
 * ===================================================================================== */
const AREA = { 2: { w: 3, h: 4, k: 2, cell: 30, what: 'patio', u: 'm' }, 3: { w: 2, h: 1, k: 3, cell: 40, what: 'mat', u: 'm' } };
const area = {
  title: 'Lengths × k, area × k × k',
  height: 330,
  minW: 960,
  choices: [{ v: 2, label: 'k = 2: the 3 m by 4 m patio' }, { v: 3, label: 'k = 3: a 2 m by 1 m mat' }],
  ask: (k) => (+k === 2 ? 'Bonus fact: double every side of a 3 m by 4 m patio. How many times the area?' : 'Triple every side of a 2 m by 1 m mat. How many times the area?'),
  make(stage, k, ex) {
    const d = AREA[k], c0 = d.cell, W1 = d.w * c0, H1 = d.h * c0, K = d.k, W2 = W1 * K, H2 = H1 * K;
    const svg = svgOn(stage, 620, 330), x1 = 50, y1 = 300 - H1, x2 = 60 + W1 + 40, y2 = 300 - H2;
    const grid = (g, x, y, w, hh, cell) => { let p = ''; for (let i = 1; i < w / cell; i++) p += `M${x + i * cell} ${y}V${y + hh}`; for (let j = 1; j < hh / cell; j++) p += `M${x} ${y + j * cell}H${x + w}`; pathOn(g, p, { stroke: '#cdb994', 'stroke-width': 1.2 }); };
    const small = svgEl('g', {}, svg);
    svgEl('rect', { x: x1, y: y1, width: W1, height: H1, fill: '#fbe9c8', stroke: BROWN, 'stroke-width': 3 }, small); grid(small, x1, y1, W1, H1, c0);
    gT(small, x1 + W1 / 2, y1 - 16, `${d.w} ${d.u}`, { size: 17 }); gT(small, x1 - 18, y1 + H1 / 2, `${d.h} ${d.u}`, { size: 17 });
    const big = svgEl('rect', { x: x2, y: y2, width: W2, height: H2, fill: '#fff', stroke: INK, 'stroke-width': 3 }, svg);
    const bigL = [gT(svg, x2 + W2 / 2, y2 - 16, `${d.w * K} ${d.u}`, { size: 17 }), gT(svg, x2 + W2 + 22, y2 + H2 / 2, `${d.h * K} ${d.u}`, { size: 17 })];
    hide(big, ...bigL);
    const copies = [];
    for (let j = 0; j < K; j++) for (let i = 0; i < K; i++) {
      const g = svgEl('g', {}, svg);
      svgEl('rect', { x: 0, y: 0, width: W1, height: H1, fill: ['#fbe9c8', '#dbe7fb', '#dff3e6', '#f6d9e3', '#efe4fb', '#fff1c9', '#e2f1f7', '#f5e3d3', '#e9ecef'][copies.length], stroke: BROWN, 'stroke-width': 2 }, g);
      grid(g, 0, 0, W1, H1, c0);
      gT(g, W1 / 2, H1 / 2, String(copies.length + 1), { size: 24, color: BROWN });
      g.dataset.tx = x2 + i * W1; g.dataset.ty = y2 + (K - 1 - j) * H1;
      g.setAttribute('transform', `translate(${x1} ${y1})`); g.style.opacity = 0; copies.push(g);
    }
    const X = 640, A1 = d.w * d.h, A2 = A1 * K * K;
    const L = [hide(ln(stage, `Small: ${T(`${d.w}\\times${d.h}=${A1}`)} m²`, X, 30, 320)), hide(ln(stage, `Big: ${T(`${d.w * K}\\times${d.h * K}=${A2}`)} m²`, X, 80, 320)),
      hide(ln(stage, `${T(`${A2}\\div${A1}=${K * K}`)} times`, X, 150, 320)), hide(ln(stage, `${T(`${K * K}=${K}\\times${K}`)}, not ${K}`, X, 200, 320))];
    return [
      { cap: `The ${d.what}: ${d.w} m by ${d.h} m. Its area is ${T(`${d.w}\\times${d.h}=${A1}`)} m².`, run: (c) => c.fadeIn(L[0]) },
      { cap: `Multiply every side by ${K}: ${d.w * K} m by ${d.h * K} m.`, run: async (c) => { await show(c, big); await Promise.all(bigL.map((e) => show(c, e))); await c.fadeIn(L[1]); } },
      { cap: `How many copies of the small ${d.what} fit inside? Fill it up…`, run: async (c) => {
        for (const g of copies) {
          g.style.opacity = 1;
          const tx = +g.dataset.tx, ty = +g.dataset.ty;
          await tween(c, 380, (t) => { g.setAttribute('transform', `translate(${lerp(x1, tx, t).toFixed(1)} ${lerp(y1, ty, t).toFixed(1)})`); });
        }
      } },
      { cap: `<b>${K * K} copies</b>: ${K} across and ${K} up, so ${K} × ${K}. The area is ${K * K} times as big, <b>not ${K}</b> times.`, run: async (c) => { await c.fadeIn(L[2]); await c.fadeIn(L[3]); } }
    ];
  }
};

/* =====================================================================================
 * 2. Example 1: match the parts, find k, multiply or divide
 * ===================================================================================== */
const simk = {
  title: 'Match, find k, then multiply or divide',
  height: 410,
  minW: 960,
  capH: 84,
  ask: 'Example 1: ABCD ∼ WXYZ. Match the parts, find k, then find XY, ZW, ∠X and CD.',
  make(stage, v, ex) {
    const labels = [['6 cm', '4 cm', '?', '8 cm'], ['9 cm', '?', '7.5 cm', '?']];
    const S = Geo.similar(stage, { x: 0, y: 6, width: 690, height: 380, pts: QUAD, k: 1.5, names: ['ABCD', 'WXYZ'], labels, gap: 100, pad: 34 });
    const ov = svgEl('g', {}, S.svg);
    const aB = cornerArc(ov, S.orig, 1, { r: 22, label: '81°' }), aX = cornerArc(ov, S.image, 1, { r: 28, label: '?', size: 18, color: RED });
    const X = 700, w = ex.W - X - 4, cs = MC;
    const L = [
      hide(ln(stage, `${T(`${col(cs[0], 'AB')}\\leftrightarrow ${col(cs[0], 'WX')}`)}&nbsp;&nbsp;${T(`${col(cs[1], 'BC')}\\leftrightarrow ${col(cs[1], 'XY')}`)}`, X, 4, w)),
      hide(ln(stage, `${T(`${col(cs[2], 'CD')}\\leftrightarrow ${col(cs[2], 'YZ')}`)}&nbsp;&nbsp;${T(`${col(cs[3], 'DA')}\\leftrightarrow ${col(cs[3], 'ZW')}`)}`, X, 48, w)),
      hide(ln(stage, `${T('\\angle B\\leftrightarrow\\angle X')}`, X, 92, w)),
      hide(ln(stage, `${T('k=9\\div6=1.5')}`, X, 134, w)),
      hide(ln(stage, `${T('XY=1.5\\times4=6')} cm`, X, 222, w)),
      hide(ln(stage, `${T('ZW=1.5\\times8=12')} cm`, X, 264, w)),
      hide(ln(stage, `${T('\\angle X=\\angle B=81^\\circ')}`, X, 306, w)),
      hide(ln(stage, `${T('CD=7.5\\div1.5=5')} cm`, X, 352, w))
    ];
    const enl = hide(stamp(stage, 'enlargement', { ok: true, x: X + 110, y: 190, rotate: -5 }));
    const relabel = (which, i, s) => { labels[which][i] = s; S.showImage(true); const e = (which ? S.imageEls : S.origEls).labels[i]; if (e) { e.style.fill = RED; } return e; };
    return [
      { cap: 'The names are in <b>matching order</b>: A ↔ W, B ↔ X, C ↔ Y, D ↔ Z. Matching sides have the same colour.', run: async (c) => { for (let i = 0; i < 4; i++) await S.highlight(c, i); await c.fadeIn(L[0]); await c.fadeIn(L[1]); } },
      { cap: 'The 2nd letters are B and X, so <b>∠B ↔ ∠X</b>.', run: async (c) => { S.clear(); await c.pop(aX.label); await c.fadeIn(L[2]); } },
      { cap: `(b) Use a pair where <b>both</b> lengths are known: AB = 6 and WX = 9. ${T('k=\\text{new}\\div\\text{original}=9\\div6=1.5')}`, run: async (c) => { await S.highlight(c, 0); await c.fadeIn(L[3]); } },
      { cap: `${T('k>1')}, so it is an <b>enlargement</b>: every side of WXYZ is 1.5 times as long.`, run: (c) => stampIn(c, enl) },
      { cap: `(c) New = ${T('k\\times')} original: ${T('XY=1.5\\times4=6')} cm.`, run: async (c) => { S.clear(); await S.highlight(c, 1); const e = relabel(1, 1, '6 cm'); await c.pop(e); await c.fadeIn(L[4]); } },
      { cap: `${T('ZW=1.5\\times8=12')} cm.`, run: async (c) => { S.clear(); await S.highlight(c, 3); const e = relabel(1, 3, '12 cm'); await c.pop(e); await c.fadeIn(L[5]); } },
      { cap: `Angles do <b>not</b> change: ${T('\\angle X=\\angle B=81^\\circ')}.`, run: async (c) => { S.clear(); aX.label.textContent = '81°'; await c.pop(aX.label); await c.fadeIn(L[6]); } },
      { cap: `(d) CD is on the <b>original</b>, so divide: ${T('CD=7.5\\div1.5=5')} cm. Check: ${T('1.5\\times5=7.5')} ✓`, run: async (c) => { await S.highlight(c, 2); const e = relabel(0, 2, '5 cm'); await c.pop(e); await c.fadeIn(L[7]); } }
    ];
  }
};

/* =====================================================================================
 * 3. Example 2: the similarity tester
 * ===================================================================================== */
function machine(stage, X, W, rows) {
  const m = el(stage, 'u6l7-mach', `<div class="mh">Similarity tester</div>` + rows.map((r, i) => `<div class="mrow"><span class="mn">${i + 1}</span><span class="ml">${r === 'ang' ? 'Angles equal?' : 'Side ratios equal?'}</span><span class="mres"></span></div><div class="mchips"></div>`).join(''), X, 6, W, 300);
  const R = {}; rows.forEach((r, i) => { R[r] = { res: m.querySelectorAll('.mres')[i], chips: m.querySelectorAll('.mchips')[i] }; });
  const chip = (r, html, bad) => { const e = h('span', 'u6l7-chip' + (bad ? ' bad' : ''), html); R[r].chips.appendChild(e); e.style.opacity = 0; return e; };
  const result = async (c, r, ok) => { const e = R[r].res; e.textContent = ok ? '✓' : '✗'; e.className = 'mres ' + (ok ? 'ok' : 'no'); await c.pop(e); };
  return { m, R, chip, result };
}
const TESTER = {
  beds: { ask: 'Example 2(a): two flower beds are shaped like trapezoids. Are they similar? Show both tests.' },
  photo: { ask: 'Example 2(b): Bree orders a 10 in by 12 in print of a 6 in by 9 in photo. Similar? What happens to her picture?' },
  rh: { ask: 'Example 2(c): a square and a rhombus both have 5 cm sides. The rhombus has angles of 60° and 120°. Similar?' }
};
const tester = {
  title: 'Two tests: angles, then side ratios',
  height: 410,
  minW: 960,
  capH: 84,
  choices: [{ v: 'beds', label: 'Ex 2(a) flower beds' }, { v: 'photo', label: 'Ex 2(b) the photo print' }, { v: 'rh', label: 'Ex 2(c) square and rhombus' }],
  ask: (k) => TESTER[k].ask,
  make(stage, k, ex) {
    const X = 590, MW = ex.W - X - 8, svg = svgOn(stage, 580, 410);
    if (k === 'beds') {
      const F = bedsFig(svg, 20, 250, 40, 40), M = machine(stage, X, MW, ['ang', 'side']);
      const ratios = [['bottom', '7.5\\div5'], ['top', '4.5\\div3'], ['left', '3\\div2'], ['right', '3\\div2']].map(([n, t]) => M.chip('side', `${n}: ${T(t + '=1.5')}`));
      const SI = [0, 2, 3, 1];   // bottom, top, left, right as side indexes of the trapezoid
      const hl = svgEl('g', {}, svg);
      const ver = hide(stamp(stage, 'SIMILAR', { ok: true, x: X + MW / 2, y: 352, rotate: -6, size: 'lg' }));
      return [
        { cap: '<b>Test 1:</b> are the matching angles equal? Both beds have 60°, 60°, 120°, 120° in the same places.', run: async (c) => {
          for (let i = 0; i < 4; i++) { const pr = [F.arcs[0][i], F.arcs[1][i]]; pr.forEach((a) => { a.arc.style.stroke = MC[i]; a.label.style.fill = MC[i]; a.arc.style.strokeWidth = 4; }); await Promise.all(pr.map((a) => c.pop(a.label, 300))); }
          await M.result(c, 'ang', true); } },
        { cap: '<b>Test 2:</b> divide every side of Bed 2 by the matching side of Bed 1.', run: async (c) => {
          for (const [j, ch] of ratios.entries()) {
            hl.innerHTML = ''; const i = SI[j];
            [0, 1].forEach((w) => segOn(hl, F.Q[w][i], F.Q[w][(i + 1) % 4], { stroke: MC[i], 'stroke-width': 10, opacity: 0.35 }));
            await c.pop(ch, 320); await c.sleep(c.fast ? 0 : 250);
          }
          hl.innerHTML = ''; await M.result(c, 'side', true); } },
        { cap: 'Both tests pass, so the beds are <b>similar</b>, with <b>k = 1.5</b>.', run: (c) => stampIn(c, ver) }
      ];
    }
    if (k === 'photo') {
      const s = 17, base = 330, ph = { x: 40, w: 6 * s, h: 9 * s }, pr = { x: 230, w: 10 * s, h: 12 * s };
      const picture = (g, w, hh) => {
        svgEl('rect', { x: 0, y: 0, width: w, height: hh, fill: '#cfe0fb' }, g);
        svgEl('circle', { cx: w * 0.72, cy: hh * 0.2, r: w * 0.11, fill: '#f6c343' }, g);
        pathOn(g, `M0 ${hh * 0.62}L${w * 0.3} ${hh * 0.34}L${w * 0.52} ${hh * 0.55}L${w * 0.72} ${hh * 0.4}L${w} ${hh * 0.6}V${hh}H0Z`, { fill: '#8fbf8f', stroke: 'none' });
        svgEl('rect', { x: 0, y: hh * 0.8, width: w, height: hh * 0.2, fill: '#5f9e66' }, g);
        pathOn(g, `M${w * 0.42} ${hh * 0.8}v${-hh * 0.12}h${w * 0.08}v${hh * 0.12}`, { fill: '#c93a33', stroke: 'none' });
        svgEl('rect', { x: 0, y: 0, width: w, height: hh, fill: 'none', stroke: INK, 'stroke-width': 3 }, g);
      };
      const g1 = svgEl('g', { transform: `translate(${ph.x} ${base - ph.h})` }, svg); picture(g1, ph.w, ph.h);
      gT(svg, ph.x + ph.w / 2, base - ph.h - 16, '6 in', { size: 17 }); gT(svg, ph.x - 22, base - ph.h / 2, '9 in', { size: 17 });
      gT(svg, ph.x + ph.w / 2, base + 44, 'photo', { size: 16, color: SLATE });
      const prY = base - pr.h;
      const frame = svgEl('rect', { x: pr.x, y: prY, width: pr.w, height: pr.h, fill: '#fff', stroke: INK, 'stroke-width': 3, 'stroke-dasharray': '9 6' }, svg);
      gT(svg, pr.x + pr.w / 2, prY - 16, '10 in', { size: 17 }); gT(svg, pr.x + pr.w + 26, prY + pr.h / 2, '12 in', { size: 17 });
      gT(svg, pr.x + pr.w / 2, base + 44, 'print', { size: 16, color: SLATE });
      const sq = [ph, pr].map((r) => { const y0 = base - r.h, g = svgEl('g', {}, svg); [[r.x, y0, 1, 1], [r.x + r.w, y0, -1, 1], [r.x, base, 1, -1], [r.x + r.w, base, -1, -1]].forEach(([x, y, a, b]) => pathOn(g, `M${x + a * 13} ${y}v${b * 13}h${-a * 13}`, { stroke: GREEN, 'stroke-width': 2.4 })); g.style.opacity = 0; return g; });
      // the photo enlarged so its short side is 10 in: 10 in by 15 in, over the print
      const bigH = 15 * s, big = svgEl('g', { transform: `translate(${pr.x} ${prY - (bigH - pr.h) / 2})` }, svg); picture(big, pr.w, bigH); big.style.opacity = 0;
      const cut = svgEl('g', {}, svg); cut.style.opacity = 0;
      [[prY - (bigH - pr.h) / 2, (bigH - pr.h) / 2], [prY + pr.h, (bigH - pr.h) / 2]].forEach(([y, hh]) => svgEl('rect', { x: pr.x, y, width: pr.w, height: hh, fill: 'rgba(201,58,51,.55)' }, cut));
      gT(cut, pr.x + pr.w / 2, prY - (bigH - pr.h) / 4, 'cut off', { size: 16, color: '#fff', halo: false, weight: 800 });
      gT(cut, pr.x + pr.w / 2, prY + pr.h + (bigH - pr.h) / 4, 'cut off', { size: 16, color: '#fff', halo: false, weight: 800 });
      svgEl('rect', { x: pr.x, y: prY, width: pr.w, height: pr.h, fill: 'none', stroke: INK, 'stroke-width': 3.4 }, cut);
      const M = machine(stage, X, MW, ['ang', 'side']);
      const c1 = M.chip('side', `short: ${T('10\\div6\\approx1.67')}`), c2 = M.chip('side', `long: ${T('12\\div9\\approx1.33')}`, true);
      const ver = hide(stamp(stage, 'NOT SIMILAR', { ok: false, x: X + MW / 2, y: 352, rotate: -6, size: 'lg' }));
      return [
        { cap: '<b>Test 1:</b> both are rectangles, so every angle is 90°. The angles pass.', run: async (c) => { await Promise.all(sq.map((g) => show(c, g))); await M.result(c, 'ang', true); } },
        { cap: `<b>Test 2:</b> short sides ${T('10\\div6\\approx1.67')}; long sides ${T('12\\div9\\approx1.33')}. The ratios are <b>different</b>.`, run: async (c) => { await c.pop(c1); await c.pop(c2); await M.result(c, 'side', false); } },
        { cap: 'One test fails, so the rectangles are <b>not similar</b>: the print has a different shape.', run: (c) => stampIn(c, ver) },
        { cap: `Enlarge the photo to fit the 10 in width: ${T('9\\times\\tfrac{10}{6}=15')} in long. The print is only 12 in, so <b>3 in of the picture is cut off</b> (cropped).`, run: async (c) => { await show(c, big, 500); await show(c, cut, 500); frame.style.opacity = 0; } }
      ];
    }
    // square and rhombus, 5 cm sides (32 px per cm)
    const s = 32, sqQ = [[0, 0], [5, 0], [5, 5], [0, 5]].map(scr([40, 320], s)), rhQ = [[0, 0], [5, 0], [7.5, 4.33], [2.5, 4.33]].map(scr([270, 320], s));
    polyOn(svg, sqQ, { fill: '#e9edf4', stroke: INK }); polyOn(svg, rhQ, { fill: '#fbf1de', stroke: INK });
    [sqQ, rhQ].forEach((Q) => { sideLab(svg, Q, 0, '5 cm', { size: 17 }); sideLab(svg, Q, 1, '5 cm', { size: 17 }); });
    const sqA = sqQ.map((p, i) => cornerArc(svg, sqQ, i, { label: '90°', size: 15 })), rhA = rhQ.map((p, i) => cornerArc(svg, rhQ, i, { r: 26, label: i % 2 ? '120°' : '60°', size: 15 }));
    const M = machine(stage, X, MW, ['side', 'ang']);
    const chs = [0, 1, 2, 3].map(() => M.chip('side', T('5\\div5=1')));
    const ca = M.chip('ang', `${T('90^\\circ')} vs ${T('60^\\circ')} and ${T('120^\\circ')}`, true);
    const ver = hide(stamp(stage, 'NOT SIMILAR', { ok: false, x: X + MW / 2, y: 352, rotate: -6, size: 'lg' }));
    return [
      { cap: `<b>Sides:</b> every side is 5 cm, so every ratio is ${T('5\\div5=1')}. The side test passes…`, run: async (c) => { for (const e of chs) await c.pop(e, 260); await M.result(c, 'side', true); } },
      { cap: '…but the <b>angles</b> fail: the square has 90° corners; the rhombus has 60° and 120°.', run: async (c) => {
        [...sqA, ...rhA].forEach((a) => { a.arc.style.stroke = RED; a.label.style.fill = RED; });
        await Promise.all([...sqA, ...rhA].map((a) => c.pop(a.label, 300))); await c.pop(ca); await M.result(c, 'ang', false); } },
      { cap: 'So they are <b>not similar</b>. One test is not enough: you need <b>both</b>.', run: (c) => stampIn(c, ver) }
    ];
  }
};

/* =====================================================================================
 * 4. Example 3: grid drawing and projection
 * ===================================================================================== */
const draw = {
  title: 'Every length × k, every angle the same',
  height: 400,
  minW: 960,
  capH: 84,
  choices: [{ v: 'grid', label: 'Ex 3(a) the sign, k = 2' }, { v: 'proj', label: 'Ex 3(b) projection, k = 2.5' }],
  ask: (k) => (k === 'grid' ? 'Example 3(a): enlarge the sign with a scale factor of 2 on the grid on the right.' : 'Example 3(b): projection from O with k = 2.5. OA = 2 cm, OB = 3 cm, OC = 2.4 cm.'),
  make(stage, k, ex) {
    const X = 660, w = ex.W - X - 6;
    if (k === 'grid') {
      const cs = 40, svg = svgOn(stage, 650, 400);
      const G1 = { x: 16, y: 150, c: 5, r: 4 }, G2 = { x: 290, y: 40, c: 8, r: 6 };
      const gp = (G) => (p) => [G.x + p[0] * cs, G.y + (G.r - p[1]) * cs];
      const grid = (G) => { let d = ''; for (let i = 0; i <= G.c; i++) d += `M${G.x + i * cs} ${G.y}v${G.r * cs}`; for (let j = 0; j <= G.r; j++) d += `M${G.x} ${G.y + j * cs}h${G.c * cs}`; pathOn(svg, d, { stroke: '#d4d9e2', 'stroke-width': 1.2 }); };
      grid(G1); grid(G2);
      const Q1 = SIGN.map(gp(G1)), Q2 = SIGN2.map(gp(G2));
      polyOn(svg, Q1, { fill: '#e9edf4', stroke: INK });
      gT(svg, G1.x + G1.c * cs / 2, G1.y + G1.r * cs + 22, 'original', { size: 16, color: SLATE });
      gT(svg, G2.x + G2.c * cs / 2, G2.y + G2.r * cs + 22, 'k = 2', { size: 16, color: SLATE });
      const lab1 = [[0, '2'], [3, '2'], [4, '2']].map(([i, s]) => hide(sideLab(svg, Q1, i, s, { size: 17, color: BLUE })));
      const stair = (A, B, g, colr) => pathOn(g, 'M' + P2([A, [B[0], A[1]], B]), { stroke: colr, 'stroke-width': 2, 'stroke-dasharray': '5 4' });
      const st1 = hide(svgEl('g', {}, svg)); stair(Q1[1], Q1[2], st1, BLUE); stair(Q1[2], Q1[3], st1, BLUE);
      const fill2 = hide(polyOn(svg, Q2, { fill: 'rgba(201,58,51,.08)', stroke: 'none' }));
      const edges = Q2.map((p, i) => hide(segOn(svg, p, Q2[(i + 1) % 5], { stroke: RED, 'stroke-width': 3.4 })));
      const dots = Q2.map((p) => hide(svgEl('circle', { cx: p[0], cy: p[1], r: 5, fill: RED }, svg)));
      const st2 = hide(svgEl('g', {}, svg)); stair(Q2[1], Q2[2], st2, RED); stair(Q2[2], Q2[3], st2, RED);
      const lab2 = [[0, '4'], [3, '4'], [4, '4']].map(([i, s]) => hide(sideLab(svg, Q2, i, s, { size: 17, color: RED })));
      const a1 = Q1.map((p, i) => cornerArc(svg, Q1, i, { r: 12, rs: 9 })), a2 = Q2.map((p, i) => cornerArc(svg, Q2, i, { r: 18, rs: 13 }));
      [...a1, ...a2].forEach((a) => { hide(a.arc); if (a.label) hide(a.label); });
      const L = [hide(ln(stage, `bottom: ${T('2\\times2=4')}`, X, 30, w)), hide(ln(stage, 'tip: 1 right, 1 up → <b>2 right, 2 up</b>', X, 80, w, 42, 'sm')),
        hide(ln(stage, `top: ${T('2\\times2=4')}`, X, 140, w)), hide(ln(stage, `left: ${T('2\\times2=4')}`, X, 190, w)), hide(ln(stage, `angles: <b>the same</b> (${T('90^\\circ')}, ${T('135^\\circ')})`, X, 250, w))];
      const edge = async (c, i) => { await show(c, dots[i], 150); await show(c, edges[i], 350); await show(c, dots[(i + 1) % 5], 150); };
      return [
        { cap: 'Count each side of the sign in grid squares: the bottom, top and left side are <b>2 squares</b> each.', run: async (c) => { for (const e of lab1) await c.pop(e, 260); await show(c, st1); } },
        { cap: `Start at a corner. Bottom: ${T('2\\times2=4')} squares.`, run: async (c) => { await edge(c, 0); await c.pop(lab2[0]); await c.fadeIn(L[0]); } },
        { cap: 'To the tip: 1 right and 1 up becomes <b>2 right and 2 up</b>. Back from the tip: 2 left and 2 up.', run: async (c) => { await show(c, st2); await edge(c, 1); await edge(c, 2); await c.fadeIn(L[1]); } },
        { cap: `Top: ${T('2\\times2=4')} squares. Then down the left side, ${T('2\\times2=4')}, back to the start.`, run: async (c) => { await edge(c, 3); await c.pop(lab2[1]); await c.fadeIn(L[2]); await edge(c, 4); await c.pop(lab2[2]); await c.fadeIn(L[3]); await show(c, fill2); } },
        { cap: 'Check the angles: 90° at the two left corners and at the tip, 135° at the other two. <b>Only the lengths changed.</b>', run: async (c) => { for (const a of [...a1, ...a2]) { show(c, a.arc); if (a.label) show(c, a.label); } await c.sleep(c.fast ? 0 : 400); await c.fadeIn(L[4]); } }
      ];
    }
    // projection
    const svg = svgOn(stage, 650, 400), O = [40, 372], s = 56, F = projFig(svg, O, s, false);
    F.rays.forEach((r) => hide(r));
    const runner = svgEl('g', {}, svg);
    const fin = svgEl('g', {}, svg);
    const tri2 = hide(polyOn(fin, F.Q2, { fill: 'rgba(201,58,51,.07)', stroke: RED, 'stroke-width': 3 }));
    const names2 = F.Q2.map((q, i) => hide(gT(fin, q[0] + [8, 22, -20][i], q[1] + [20, 0, -8][i], PROJ[i].n + '′', { size: 20, italic: true, color: RED })));
    const L = PROJ.map((p, i) => hide(ln(stage, `${T(`O${p.n}'=2.5\\times${p.r}=${nf(p.r * 2.5)}`)} cm`, X, 30 + i * 50, w)));
    const L4 = hide(ln(stage, 'Join A′, B′ and C′.', X, 190, w, 42, 'sm')), L5 = hide(ln(stage, `${T("A'B'=2.5\\times AB")}`, X, 250, w));
    const slide = async (c, i) => {
      const p = PROJ[i], S = scr(O, s), seg = segOn(runner, O, S(polar(p.r, p.a)), { stroke: RED, 'stroke-width': 5, opacity: 0.55 });
      const dot = svgEl('circle', { r: 6, fill: RED }, runner), t = gT(runner, 0, 0, '', { size: 17, color: RED });
      await tween(c, 1100, (u) => {
        const r = lerp(p.r, p.r * 2.5, u), q = S(polar(r, p.a)), nn = unit([-Math.sin(p.a * RAD), -Math.cos(p.a * RAD)]);
        seg.setAttribute('d', 'M' + P2([O, q])); dot.setAttribute('cx', q[0]); dot.setAttribute('cy', q[1]);
        t.setAttribute('x', (q[0] + nn[0] * 24 + 30).toFixed(1)); t.setAttribute('y', (q[1] + nn[1] * 24 - 6).toFixed(1)); t.textContent = `${nf(r, 1)} cm`;
      });
      t.remove(); seg.setAttribute('opacity', 0.25); await c.pop(names2[i]);
    };
    // AB laid 2.5 times along A′B′
    const A = F.Q[0], B = F.Q[1], A2 = F.Q2[0], B2 = F.Q2[1], dAB = [B[0] - A[0], B[1] - A[1]];
    const copies = [0, 1, 2].map((j) => hide(segOn(fin, [A2[0] + dAB[0] * j, A2[1] + dAB[1] * j], [A2[0] + dAB[0] * Math.min(j + 1, 2.5), A2[1] + dAB[1] * Math.min(j + 1, 2.5)], { stroke: [BLUE, GREEN, AMBER][j], 'stroke-width': 7, 'stroke-linecap': 'butt' })));
    const nb = unit([-dAB[1], dAB[0]]);
    const cn = ['1', '2', '½'].map((s0, j) => { const M = [A2[0] + dAB[0] * (j + (j < 2 ? 0.5 : 0.25)) - nb[0] * 20, A2[1] + dAB[1] * (j + (j < 2 ? 0.5 : 0.25)) - nb[1] * 20]; return hide(gT(fin, M[0], M[1], s0, { size: 17, color: [BLUE, GREEN, AMBER][j] })); });
    const abHl = hide(segOn(fin, A, B, { stroke: BLUE, 'stroke-width': 7 }));
    return [
      { cap: 'From O, draw a ray through each corner of △ABC.', run: async (c) => { for (const r of F.rays) { r.style.opacity = 1; await c.anim(r, [{ opacity: 0 }, { opacity: 1 }], 300); } } },
      { cap: `OA = 2 cm. Multiply by k: ${T("OA'=2.5\\times2=5")} cm. Slide out along the ray to 5 cm.`, run: async (c) => { await slide(c, 0); await c.fadeIn(L[0]); } },
      { cap: `${T("OB'=2.5\\times3=7.5")} cm.`, run: async (c) => { await slide(c, 1); await c.fadeIn(L[1]); } },
      { cap: `${T("OC'=2.5\\times2.4=6")} cm.`, run: async (c) => { await slide(c, 2); await c.fadeIn(L[2]); } },
      { cap: 'Join A′, B′ and C′. The image is the same shape, 2.5 times as big.', run: async (c) => { await show(c, tri2, 500); await c.fadeIn(L4); } },
      { cap: 'Check: AB fits <b>2.5 times</b> along A′B′. Every side of the image is 2.5 times the matching side.', run: async (c) => { await show(c, abHl); for (let j = 0; j < 3; j++) { await show(c, copies[j], 300); await c.pop(cn[j], 250); } await c.fadeIn(L5); } }
    ];
  }
};

/* =====================================================================================
 * 5. Example 4: the trail map with a tape
 * ===================================================================================== */
const map = {
  title: 'Measure on the map, then × the scale',
  height: 410,
  minW: 960,
  capH: 84,
  tap: false,
  ask: 'Example 4: the trail map. (a) Write the scale two ways. (b) How far is the hike from P to S? (c) How long is the lake on the map?',
  make(stage, v, ex) {
    const TR = trail([60, 230], 60);
    const M = Geo.mapTape(stage, mapOpts({ x: 0, y: 0, width: 640, height: 330, a: [40, 300], b: [160, 300] }));
    const ov = svgEl('g', {}, M.svg);
    const barBox = hide(svgEl('rect', { x: 450, y: 266, width: 188, height: 62, rx: 10, fill: 'none', stroke: RED, 'stroke-width': 3 }, ov));
    const X = 652, w = ex.W - X - 4;
    const L = [hide(ln(stage, '1 cm represents <b>0.2 km</b>', X, 6, w, 38, 'sm')), hide(ln(stage, `${T('0.2\\times100\\,000=20\\,000')} cm`, X, 46, w, 38, 'sm')),
      hide(ln(stage, `ratio: <b>${T('1:20\\,000')}</b>`, X, 86, w, 38, 'sm')),
      hide(ln(stage, `${T('PQ=2.4')} cm`, X, 136, w, 38, 'sm')), hide(ln(stage, `${T('QR=3.1')} cm`, X, 174, w, 38, 'sm')), hide(ln(stage, `${T('RS=1.5')} cm`, X, 212, w, 38, 'sm')),
      hide(ln(stage, `${T('2.4+3.1+1.5=7')} cm`, X, 252, w, 38, 'sm')), hide(ln(stage, `${T('7\\times0.2=1.4')} km`, X, 290, w, 38, 'sm')),
      hide(ln(stage, `lake: ${T('0.56\\div0.2=2.8')} cm ✓`, X, 342, w, 38, 'sm'))];
    return [
      { cap: '(a) Read the bar scale: 1 cm on the map represents <b>0.2 km</b>.', run: async (c) => { await show(c, barBox); await c.fadeIn(L[0]); } },
      { cap: `A ratio needs the <b>same units</b>: ${T('0.2\\text{ km}=0.2\\times100\\,000=20\\,000')} cm. The ratio is <b>${T('1:20\\,000')}</b>.`, run: async (c) => { await c.fadeIn(L[1]); await c.fadeIn(L[2]); await fadeOut(c, barBox); } },
      { cap: '(b) Measure the route one part at a time. <b>PQ = 2.4 cm.</b>', run: async (c) => { await M.moveTo(c, TR.P, TR.Q, 900); await c.fadeIn(L[3]); } },
      { cap: '<b>QR = 3.1 cm.</b>', run: async (c) => { await M.moveTo(c, TR.Q, TR.R, 900); await c.fadeIn(L[4]); } },
      { cap: '<b>RS = 1.5 cm.</b>', run: async (c) => { await M.moveTo(c, TR.R, TR.S, 900); await c.fadeIn(L[5]); } },
      { cap: `Add the map lengths: 7 cm. Real = diagram × scale: ${T('7\\times0.2=1.4')} km. <b>The hike is 1.4 km.</b>`, run: async (c) => { await c.fadeIn(L[6]); await c.fadeIn(L[7]); } },
      { cap: `(c) Diagram = real ÷ scale: ${T('0.56\\div0.2=2.8')} cm. Measure the lake: <b>2.8 cm</b> ✓`, run: async (c) => { await M.moveTo(c, TR.lakeA, TR.lakeB, 900); await c.fadeIn(L[8]); } }
    ];
  }
};

/* =====================================================================================
 * 5. Example 5: floor plans
 * ===================================================================================== */
const plan = {
  title: 'Same units, then ÷ the scale number',
  height: 400,
  minW: 960,
  capH: 84,
  choices: [{ v: 'bed', label: 'Ex 5(a) the bedroom, 1 : 50' }, { v: 'gar', label: 'Ex 5(b) the garage: which scale?' }],
  ask: (k) => (k === 'bed' ? 'Example 5(a): a bedroom is 3.8 m by 4.4 m. Find its size on a floor plan with a scale of 1 : 50.' : 'Example 5(b): a garage is 12 m by 9 m. The drawing space is 20 cm by 15 cm. Use 1 : 50, 1 : 100 or 1 : 200?'),
  make(stage, k, ex) {
    const svg = svgOn(stage, ex.W, 400);
    if (k === 'bed') {
      const m = 66, R = { x: 90, y: 50, w: 3.8 * m, h: 4.4 * m };
      const room = svgEl('g', {}, svg);
      svgEl('rect', { x: R.x, y: R.y, width: R.w, height: R.h, fill: '#f3e6cf', stroke: INK, 'stroke-width': 5 }, room);
      for (let i = 1; i < 9; i++) pathOn(room, `M${R.x} ${R.y + i * R.h / 9}h${R.w}`, { stroke: '#e0cfae', 'stroke-width': 1.5 });
      svgEl('rect', { x: R.x + 20, y: R.y + 20, width: 1.5 * m, height: 2 * m, rx: 8, fill: '#dbe7fb', stroke: BLUE, 'stroke-width': 2 }, room);
      svgEl('rect', { x: R.x + 30, y: R.y + 28, width: 1.5 * m - 20, height: 26, rx: 6, fill: '#fff', stroke: BLUE, 'stroke-width': 1.5 }, room);
      gT(svg, R.x + R.w / 2, R.y + R.h + 22, 'the real bedroom', { size: 16, color: SLATE });
      const wl = gT(svg, R.x + R.w / 2, R.y - 18, '3.8 m', { size: 19 }), hl = gT(svg, R.x - 30, R.y + R.h / 2, '4.4 m', { size: 19 });
      const cm = 22, Pp = { x: 600, y: 54, c: 11, r: 10 };
      let gd = ''; for (let i = 0; i <= Pp.c; i++) gd += `M${Pp.x + i * cm} ${Pp.y}v${Pp.r * cm}`; for (let j = 0; j <= Pp.r; j++) gd += `M${Pp.x} ${Pp.y + j * cm}h${Pp.c * cm}`;
      svgEl('rect', { x: Pp.x - 8, y: Pp.y - 8, width: Pp.c * cm + 16, height: Pp.r * cm + 16, fill: '#fff', stroke: '#c9ced8', 'stroke-width': 1.5, rx: 6 }, svg);
      pathOn(svg, gd, { stroke: '#dfe6f1', 'stroke-width': 1 });
      gT(svg, Pp.x + Pp.c * cm / 2, Pp.y + Pp.r * cm + 26, 'the plan (1 square = 1 cm)', { size: 16, color: SLATE });
      const pw = 7.6 * cm, ph = 8.8 * cm, px = Pp.x + cm, py = Pp.y + cm;
      const top = hide(segOn(svg, [px, py], [px + pw, py], { stroke: RED, 'stroke-width': 4 })), left = hide(segOn(svg, [px, py], [px, py + ph], { stroke: RED, 'stroke-width': 4 }));
      const tw = hide(gT(svg, px + pw / 2, py - 16, '7.6 cm', { size: 18, color: RED })), th = hide(gT(svg, px + pw + 40, py + ph / 2, '8.8 cm', { size: 18, color: RED }));
      const ghost = svgEl('g', {}, svg); ghost.style.opacity = 0;
      svgEl('rect', { x: 0, y: 0, width: R.w, height: R.h, fill: '#f3e6cf', stroke: INK, 'stroke-width': 4 }, ghost);
      svgEl('rect', { x: 20, y: 20, width: 1.5 * m, height: 2 * m, rx: 8, fill: '#dbe7fb', stroke: BLUE, 'stroke-width': 2 }, ghost);
      const mach = hide(cb(stage, 'u6l7-res', `${T('\\div\\,50')}`, 386, 160, 110, 54));
      const L = [hide(ln(stage, `${T('380\\div50=7.6')} cm`, 360, 240, 190, 40, 'sm')), hide(ln(stage, `${T('440\\div50=8.8')} cm`, 360, 284, 190, 40, 'sm'))];
      return [
        { cap: 'Same units first: 3.8 m = <b>380 cm</b> and 4.4 m = <b>440 cm</b>.', run: async (c) => { wl.textContent = '380 cm'; hl.textContent = '440 cm'; await Promise.all([pulse(c, wl), pulse(c, hl)]); } },
        { cap: `${T('1:50')} means every 50 cm of real room is 1 cm on the plan: <b>divide by 50</b>. ${T('380\\div50=7.6')} cm.`, run: async (c) => { await c.pop(mach); await show(c, top); await c.pop(tw); await c.fadeIn(L[0]); } },
        { cap: `${T('440\\div50=8.8')} cm.`, run: async (c) => { await show(c, left); await c.pop(th); await c.fadeIn(L[1]); } },
        { cap: 'The bedroom is <b>7.6 cm by 8.8 cm</b> on the plan.', run: async (c) => {
          ghost.style.opacity = 1; const s1 = pw / R.w;
          await tween(c, 1100, (t) => { const sc = lerp(1, s1, t); ghost.setAttribute('transform', `translate(${lerp(R.x, px, t).toFixed(1)} ${lerp(R.y, py, t).toFixed(1)}) scale(${sc.toFixed(4)})`); });
        } }
      ];
    }
    // the garage on a 20 cm by 15 cm page, 17 px per cm
    const cm = 17, Pg = { x: 40, y: 50, w: 20 * cm, h: 15 * cm };
    svgEl('rect', { x: Pg.x, y: Pg.y, width: Pg.w, height: Pg.h, fill: '#fff', stroke: SLATE, 'stroke-width': 2.5 }, svg);
    let gd = ''; for (let i = 1; i < 20; i++) gd += `M${Pg.x + i * cm} ${Pg.y}v${Pg.h}`; for (let j = 1; j < 15; j++) gd += `M${Pg.x} ${Pg.y + j * cm}h${Pg.w}`;
    pathOn(svg, gd, { stroke: '#e6eaf0', 'stroke-width': 1 });
    gT(svg, Pg.x + Pg.w / 2, Pg.y - 16, 'paper: 20 cm', { size: 17, color: SLATE }); gT(svg, Pg.x + Pg.w + 34, Pg.y + Pg.h / 2, '15 cm', { size: 17, color: SLATE });
    const gr = svgEl('rect', { x: Pg.x, y: Pg.y, width: 0, height: 0, fill: 'rgba(201,58,51,.15)', stroke: RED, 'stroke-width': 3.4 }, svg);
    const gl = gT(svg, Pg.x + 10, Pg.y + 10, '', { size: 18, color: RED, anchor: 'start' });
    const size = (wc, hc) => { gr.setAttribute('width', wc * cm); gr.setAttribute('height', hc * cm); gl.setAttribute('x', Pg.x + 8); gl.setAttribute('y', Pg.y + Math.min(hc * cm, 330) - 16); };
    const paint = (colr, fillc, txt) => { gr.setAttribute('stroke', colr); gr.setAttribute('fill', fillc); gl.setAttribute('fill', colr); gl.textContent = txt; };
    size(0, 0); hide(gr, gl);
    const go = async (c, from, to, ms = 900) => tween(c, ms, (t) => size(lerp(from[0], to[0], t), lerp(from[1], to[1], t)));
    const X = 470, w = ex.W - X - 8;
    const L = [hide(ln(stage, '12 m = 1 200 cm, 9 m = 900 cm', X, 20, w, 40, 'sm')),
      hide(ln(stage, `${T('1:50')}: 24 cm by 18 cm <b>too big</b>`, X, 80, w, 40, 'sm')),
      hide(ln(stage, `${T('1:100')}: 12 cm by 9 cm <span class="u6l7-g">fits</span>`, X, 130, w, 40, 'sm')),
      hide(ln(stage, `${T('1:200')}: 6 cm by 4.5 cm <span class="u6l7-a">fits, but small</span>`, X, 180, w, 40, 'sm'))];
    const use = hide(stamp(stage, 'Use 1 : 100', { ok: true, x: X + 160, y: 280, rotate: -6, size: 'lg' }));
    return [
      { cap: 'Same units: 12 m = <b>1 200 cm</b> and 9 m = <b>900 cm</b>. The paper is 20 cm by 15 cm.', run: (c) => c.fadeIn(L[0]) },
      { cap: `${T('1:50')}: ${T('1\\,200\\div50=24')} cm and ${T('900\\div50=18')} cm. Bigger than the paper: <b>too big</b>.`, run: async (c) => { paint(RED, 'rgba(201,58,51,.15)', '24 cm by 18 cm'); gr.style.opacity = 1; gl.style.opacity = 1; await go(c, [0, 0], [24, 18]); await c.fadeIn(L[1]); } },
      { cap: `${T('1:100')}: ${T('1\\,200\\div100=12')} cm and ${T('900\\div100=9')} cm. It <b>fits</b>.`, run: async (c) => { await go(c, [24, 18], [12, 9]); paint(GREEN, 'rgba(18,128,90,.14)', '12 cm by 9 cm'); await c.fadeIn(L[2]); } },
      { cap: `${T('1:200')}: ${T('1\\,200\\div200=6')} cm and ${T('900\\div200=4.5')} cm. It fits, but it is <b>small</b> and hard to read.`, run: async (c) => { await go(c, [12, 9], [6, 4.5]); paint(AMBER, 'rgba(194,122,14,.14)', '6 cm by 4.5 cm'); await c.fadeIn(L[3]); } },
      { cap: `Use <b>${T('1:100')}</b>: it fits on the paper and is as large as possible.`, run: async (c) => { await go(c, [6, 4.5], [12, 9]); paint(GREEN, 'rgba(18,128,90,.14)', '12 cm by 9 cm'); await stampIn(c, use); } }
    ];
  }
};

/* =====================================================================================
 * 6. Example 6: similar triangles
 * ===================================================================================== */
/** a triangle from base length b and the angles at its two base corners (math coords, base on the x-axis) */
function triFrom(b, a1, a2) {
  const a3 = 180 - a1 - a2, side = b * Math.sin(a2 * RAD) / Math.sin(a3 * RAD);
  return [[0, 0], [b, 0], [side * Math.cos(a1 * RAD), side * Math.sin(a1 * RAD)]];
}
const aa = {
  title: 'Two equal angles: similar triangles',
  height: 420,
  minW: 960,
  capH: 84,
  choices: [{ v: 'ang', label: 'Ex 6(a) matching angles' }, { v: 'shed', label: 'Ex 6(b)–(d) the shed roof' }],
  ask: (k) => (k === 'ang' ? 'Example 6(a): △KLM has ∠K = 47°, ∠L = 68°; △PQR has ∠P = 65°, ∠R = 47°. Similar? Name them in matching order.' : 'Example 6(b)–(d): the shed roof. Why is △ADE ∼ △ACB? Find BC. How tall is a post 4.2 m from A?'),
  make(stage, k, ex) {
    const X = 640, w = ex.W - X - 6;
    if (k === 'ang') {
      const svg = svgOn(stage, 630, 420);
      const K = triFrom(5, 47, 68).map(scr([30, 360], 54));            // K, L, M
      const Pt = triFrom(3.6, 65, 47).map(scr([368, 360], 68));        // P, R, Q
      const KLM = [K[0], K[1], K[2]], PRQ = [Pt[0], Pt[1], Pt[2]];
      polyOn(svg, KLM, { fill: '#e9edf4', stroke: INK }); polyOn(svg, PRQ, { fill: '#fbf1de', stroke: INK });
      ['K', 'L', 'M'].forEach((n, i) => vName(svg, KLM, i, n)); ['P', 'R', 'Q'].forEach((n, i) => vName(svg, PRQ, i, n));
      const aK = cornerArc(svg, KLM, 0, { r: 34, label: '47°' }), aL = cornerArc(svg, KLM, 1, { r: 30, label: '68°' }), aM = cornerArc(svg, KLM, 2, { r: 28, label: '?', color: RED });
      const aP = cornerArc(svg, PRQ, 0, { r: 30, label: '65°' }), aR = cornerArc(svg, PRQ, 1, { r: 34, label: '47°' }), aQ = cornerArc(svg, PRQ, 2, { r: 28, label: '?', color: RED });
      const ghost = hide(polyOn(svg, PRQ, { fill: 'rgba(31,91,214,.12)', stroke: BLUE, 'stroke-width': 3, 'stroke-dasharray': '8 6' }));
      const L = [hide(ln(stage, `${T('\\angle M=180^\\circ-47^\\circ-68^\\circ=65^\\circ')}`, X, 20, w, 40, 'sm')), hide(ln(stage, `${T('\\angle Q=180^\\circ-65^\\circ-47^\\circ=68^\\circ')}`, X, 64, w, 40, 'sm')),
        hide(ln(stage, `${T(`${col(BLUE, 'K\\leftrightarrow R')}\\ (47^\\circ)`)}`, X, 124, w, 40, 'sm')), hide(ln(stage, `${T(`${col(RED, 'L\\leftrightarrow Q')}\\ (68^\\circ)`)}`, X, 164, w, 40, 'sm')),
        hide(ln(stage, `${T(`${col(GREEN, 'M\\leftrightarrow P')}\\ (65^\\circ)`)}`, X, 204, w, 40, 'sm')), hide(cb(stage, 'u6l7-res', `${T('\\triangle KLM\\sim\\triangle RQP')}`, X, 262, w, 56))];
      const paintArc = (a, colr) => { a.arc.style.stroke = colr; a.arc.style.strokeWidth = 4; a.label.style.fill = colr; };
      // the similarity that takes R → K and Q → L (complex numbers), done a bit at a time
      const cx = (p) => ({ re: p[0], im: p[1] }), sub = (a, b) => ({ re: a.re - b.re, im: a.im - b.im });
      const div = (a, b) => { const d = b.re * b.re + b.im * b.im; return { re: (a.re * b.re + a.im * b.im) / d, im: (a.im * b.re - a.re * b.im) / d }; };
      const zr = cx(PRQ[1]), zq = cx(PRQ[2]), zk = cx(KLM[0]), zl = cx(KLM[1]), A = div(sub(zl, zk), sub(zq, zr));
      const mag = Math.hypot(A.re, A.im), ang = Math.atan2(A.im, A.re), c0 = cen(PRQ);
      const image = (p, t) => { const r = lerp(1, mag, t), th = ang * t, dx = p[0] - c0[0], dy = p[1] - c0[1]; const x = r * (dx * Math.cos(th) - dy * Math.sin(th)), y = r * (dx * Math.sin(th) + dy * Math.cos(th)); return [x, y]; };
      // where the centre ends up: the image of the centre under the full map z → A(z − zr) + zk
      const cEnd = (() => { const d = sub(cx(c0), zr); return [A.re * d.re - A.im * d.im + zk.re, A.re * d.im + A.im * d.re + zk.im]; })();
      return [
        { cap: `Each triangle adds to 180°. ${T('\\angle M=180^\\circ-47^\\circ-68^\\circ=65^\\circ')}.`, run: async (c) => { aM.label.textContent = '65°'; await c.pop(aM.label); await c.fadeIn(L[0]); } },
        { cap: `${T('\\angle Q=180^\\circ-65^\\circ-47^\\circ=68^\\circ')}.`, run: async (c) => { aQ.label.textContent = '68°'; await c.pop(aQ.label); await c.fadeIn(L[1]); } },
        { cap: 'Match the equal angles: <b>K ↔ R</b> (47°), <b>L ↔ Q</b> (68°), <b>M ↔ P</b> (65°).', run: async (c) => {
          paintArc(aK, BLUE); paintArc(aR, BLUE); await c.fadeIn(L[2]);
          paintArc(aL, RED); paintArc(aQ, RED); await c.fadeIn(L[3]);
          paintArc(aM, GREEN); paintArc(aP, GREEN); await c.fadeIn(L[4]); } },
        { cap: 'All three angles match, so they are <b>similar</b>. Write the letters in matching order: <b>△KLM ∼ △RQP</b>.', run: (c) => c.pop(L[5]) },
        { cap: 'Turn △RQP and shrink it: it fits exactly on △KLM. Same shape!', run: async (c) => {
          ghost.style.opacity = 1;
          await tween(c, 1500, (t) => { const C = [lerp(c0[0], cEnd[0], t), lerp(c0[1], cEnd[1], t)]; ghost.setAttribute('d', 'M' + P2(PRQ.map((p) => { const q = image(p, t); return [C[0] + q[0], C[1] + q[1]]; })) + 'Z'); });
        } }
      ];
    }
    // the shed roof, 80 px per metre
    const SC = 76, svg = svgOn(stage, 630, 420), F = shedFig(svg, [40, 320], SC), P = F.P;
    [F.rC, F.rD].forEach((r) => { r.style.stroke = INK; });
    const aA = Geo.angle(svg, { vertex: P.A, a1: P.C, a2: P.B, arms: false, dot: false, r: 52, color: GREEN, label: '', size: 16 }); hide(aA.arc);
    const grow = svgEl('path', { fill: 'rgba(31,91,214,.18)', stroke: BLUE, 'stroke-width': 3, 'stroke-dasharray': '8 6' }, svg); hide(grow);
    const kTag = hide(gT(svg, 0, 0, '', { size: 18, color: BLUE }));
    const bcL = hide(gT(svg, P.C[0] + 40, (P.C[1] + P.B[1]) / 2, '3.75 m', { size: 18, color: RED }));
    const post2 = hide(segOn(svg, P.D, P.E, { stroke: RED, 'stroke-width': 4 })), p2t = hide(gT(svg, 0, 0, '', { size: 17, color: RED })), p2d = hide(gT(svg, 0, 0, '', { size: 16, color: RED }));
    const L = [hide(ln(stage, `${T('\\angle D=\\angle C=90^\\circ')}`, X, 20, w, 40, 'sm')), hide(ln(stage, `${T('\\angle A')} shared: <b>AA</b>, similar`, X, 62, w, 40, 'sm')),
      hide(ln(stage, `${T('k=AC\\div AD=6\\div2.4=2.5')}`, X, 124, w, 40, 'sm')), hide(ln(stage, `${T('BC=2.5\\times1.5=3.75')} m`, X, 166, w, 40, 'sm')),
      hide(ln(stage, `${T('\\dfrac{\\text{height}}{4.2}=\\dfrac{1.5}{2.4}')}`, X, 222, w, 60, 'sm')), hide(ln(stage, `${T('1.5\\div2.4\\times4.2=2.625')}`, X, 288, w, 40, 'sm')),
      hide(ln(stage, `${T('\\approx2.6')} m ✓`, X, 330, w, 40, 'sm'))];
    const setGrow = (kk) => { const S = (p) => [P.A[0] + (p[0] - P.A[0]) * kk, P.A[1] + (p[1] - P.A[1]) * kk]; grow.setAttribute('d', 'M' + P2([P.A, S(P.D), S(P.E)]) + 'Z'); const q = S(P.E); kTag.setAttribute('x', (q[0] - 44).toFixed(1)); kTag.setAttribute('y', (q[1] - 18).toFixed(1)); kTag.textContent = `× ${nf(kk, 2)}`; };
    const setPost = (x) => { const hgt = 1.5 / 2.4 * x, B0 = [P.A[0] + x * SC, P.A[1]], T0 = [B0[0], P.A[1] - hgt * SC]; post2.setAttribute('d', 'M' + P2([B0, T0])); p2t.setAttribute('x', (B0[0] - 34).toFixed(1)); p2t.setAttribute('y', ((B0[1] + T0[1]) / 2).toFixed(1)); p2t.textContent = `${nf(hgt, 2)} m`; p2d.setAttribute('x', B0[0].toFixed(1)); p2d.setAttribute('y', (B0[1] + 18).toFixed(1)); p2d.textContent = `${nf(x, 1)} m`; };
    return [
      { cap: '(b) Both triangles have a <b>right angle</b>: ∠D = ∠C = 90°.', run: async (c) => { [F.rC, F.rD].forEach((r) => { r.style.stroke = RED; r.style.strokeWidth = 3.4; }); await c.fadeIn(L[0]); } },
      { cap: 'They <b>share</b> ∠A. Two pairs of equal angles, so △ADE ∼ △ACB (<b>AA</b>).', run: async (c) => { await show(c, aA.arc); await c.fadeIn(L[1]); } },
      { cap: 'Grow the small triangle from A: it fits the big one exactly when every side is <b>2.5 times</b> as long.', run: async (c) => { grow.style.opacity = 1; kTag.style.opacity = 1; await tween(c, 1600, (t) => setGrow(lerp(1, 2.5, t))); } },
      { cap: `(c) ${T('k=AC\\div AD=6\\div2.4=2.5')}.`, run: (c) => c.fadeIn(L[2]) },
      { cap: `${T('BC=2.5\\times1.5=3.75')} m. <b>The wall is 3.75 m tall.</b>`, run: async (c) => { await c.pop(bcL); await c.fadeIn(L[3]); } },
      { cap: '(d) Slide a post along the roof to 4.2 m from A. Its height grows with the roof: every post makes another similar triangle.', run: async (c) => {
        await Promise.all([fadeOut(c, grow), fadeOut(c, kTag)]); [post2, p2t, p2d].forEach((e) => { e.style.opacity = 1; });
        await tween(c, 1700, (t) => setPost(lerp(2.4, 4.2, t))); await c.fadeIn(L[4]); } },
      { cap: `height ${T('=1.5\\div2.4\\times4.2=2.625\\approx2.6')} m. Check: between 1.5 m and 3.75 m ✓`, run: async (c) => { p2t.textContent = '≈ 2.6 m'; await c.pop(p2t); await c.fadeIn(L[5]); await c.fadeIn(L[6]); } }
    ];
  }
};

/* =====================================================================================
 * 7. Examples 7 and 8: shadows and the mirror
 * ===================================================================================== */
const indirect = {
  title: 'Two similar triangles, one proportion',
  height: 400,
  minW: 960,
  capH: 84,
  choices: [{ v: 'sh', label: 'Ex 7 the grain elevator' }, { v: 'mi', label: 'Ex 8 the light pole' }],
  ask: (k) => (k === 'sh' ? 'Example 7: Priya is 1.6 m tall with a 2.4 m shadow. The elevator’s shadow is 33 m. How tall is the elevator?' : 'Example 8: mirror 12.6 m from the pole; Jordan 1.8 m from the mirror, eyes 1.4 m up. How tall is the pole?'),
  make(stage, k, ex) {
    const X = 650, w = ex.W - X - 6;
    if (k === 'sh') {
      const S = Geo.shadow(stage, { x: 24, y: 0, width: 616, height: 390, small: { h: 1.6, shadow: 2.4, label: { h: '1.6 m', s: '2.4 m' } }, big: { shadow: 33, kind: 'elevator', label: { h: 'h', s: '33 m' } } });
      S.svg.style.overflow = 'visible';   // the split picture's left height label sits just outside its box
      const L = [hide(ln(stage, `${T('\\dfrac{h}{33}=\\dfrac{1.6}{2.4}')}`, X, 30, w, 70)), hide(ln(stage, `${T('h=1.6\\div2.4\\times33')}`, X, 116, w)), hide(cb(stage, 'u6l7-res', `${T('h=22')} m`, X, 170, 200, 54)),
        hide(ln(stage, 'shadow 33 m &gt; height 22 m ✓', X, 250, w, 42, 'sm'))];
      return [
        { cap: 'The sun’s rays are <b>parallel</b>, and Priya and the elevator both stand straight up. The rays make two shaded triangles.', run: (c) => S.play(c) },
        { cap: 'Same angles, so the triangles are <b>similar</b>: height ÷ shadow is the same for both.', run: (c) => c.fadeIn(L[0]) },
        { cap: `${T('h=1.6\\div2.4\\times33=22')} m. Keep the full value until the last step.`, run: async (c) => { await c.fadeIn(L[1]); await c.pop(L[2]); } },
        { cap: 'Check: the elevator’s shadow is longer than its height, just like Priya’s ✓ <b>The elevator is 22 m tall.</b>', run: (c) => c.fadeIn(L[3]) }
      ];
    }
    const M = Geo.mirror(stage, { x: 0, y: 0, width: 640, height: 390, eye: 1.4, d1: 1.8, d2: 12.6, kind: 'pole', labels: { h: 'h' } });
    const L = [hide(ln(stage, 'right angles + equal angles: <b>AA</b>', X, 20, w, 42, 'sm')), hide(ln(stage, `${T('\\dfrac{h}{12.6}=\\dfrac{1.4}{1.8}')}`, X, 80, w, 70)),
      hide(ln(stage, `${T('h=1.4\\div1.8\\times12.6')}`, X, 166, w)), hide(cb(stage, 'u6l7-res', `${T('h=9.8')} m`, X, 220, 200, 54))];
    return [
      { cap: 'Light from the top of the pole <b>bounces</b> off the mirror into Jordan’s eyes. The angle in equals the angle out.', run: (c) => M.play(c) },
      { cap: '(a) Jordan and the pole both make right angles with the ground, and the angles at the mirror are equal: <b>AA</b>, similar.', run: async (c) => { M.parts.angles.forEach((a) => { a.mark.style.stroke = RED; a.mark.style.strokeWidth = 4; }); await c.sleep(c.fast ? 0 : 300); await c.fadeIn(L[0]); } },
      { cap: '(b) Height ÷ distance to the mirror is the same in both triangles.', run: (c) => c.fadeIn(L[1]) },
      { cap: `${T('h=1.4\\div1.8\\times12.6=9.8')} m. <b>The light pole is 9.8 m tall.</b>`, run: async (c) => { await c.fadeIn(L[2]); await c.pop(L[3]); } }
    ];
  }
};

/* =====================================================================================
 * 8. Full notes: practice-test multiple choice, with the mistake behind every wrong choice
 * ===================================================================================== */
const MCQ = {
  q15: { ask: 'Practice test Q15: a photo 20 cm wide is reduced to 8 cm wide. The scale factor is…', opts: ['2.5', '0.4', '12', '0.6'], ans: 1,
    work: 'k=8\\div20=0.4', why: ['divided the wrong way (20 ÷ 8)', '', 'the difference (20 − 8)', '12 ÷ 20'], trap: '<b>k = new ÷ original.</b> A reduction always has k less than 1.' },
  q18: { ask: 'Practice test Q18: a map scale of 1 : 250 000 means 1 cm on the map represents…', opts: ['250 m', '2.5 km', '25 km', '250 km'], ans: 1,
    work: '250\\,000\\text{ cm}=2\\,500\\text{ m}=2.5\\text{ km}', why: ['÷ 1 000 instead of ÷ 100', '', '÷ 10 000', 'read it as 250 000 m'], trap: '100 cm = 1 m and 1 000 m = 1 km, so <b>100 000 cm = 1 km</b>.' },
  q19: { ask: 'Practice test Q19: a design is enlarged with k = 2. An angle of 70° becomes…', opts: ['140°', '35°', '72°', '70°'], ans: 3,
    work: '\\text{angles do not change: }70^\\circ', why: ['multiplied the angle by k', 'divided the angle by k', 'added k', ''], trap: 'Lengths are multiplied by k. <b>Angles never change.</b>' },
  q21: { ask: 'Practice test Q21: a child 1.5 m tall casts a 2 m shadow. A tree casts a 12 m shadow. The tree is…', opts: ['16 m', '9 m', '13.5 m', '10.5 m'], ans: 1,
    work: 'h=1.5\\div2\\times12=9', why: ['flipped the ratio (2 ÷ 1.5 × 12)', '', 'added 1.5 to 12', 'took 1.5 away from 12'], trap: 'Keep the same order on both sides: <b>height ÷ shadow = height ÷ shadow</b>.' },
  q22: { ask: 'Practice test Q22: on a floor plan with a scale of 1 : 25, a wall 3 m long is drawn…', opts: ['0.12 cm', '0.75 cm', '12 cm', '75 m'], ans: 2,
    work: '3\\text{ m}=300\\text{ cm};\\ 300\\div25=12\\text{ cm}', why: ['forgot m → cm (3 ÷ 25)', 'used 3 × 0.25', '', 'multiplied by 25'], trap: 'Change to the <b>same units</b> first, then <b>divide</b> by the scale number.' }
};
const traps = {
  title: 'Spot the trap',
  height: 330,
  minW: 960,
  choices: [{ sep: 'Practice test:' }, { v: 'q15', label: 'Q15 Photo' }, { v: 'q18', label: 'Q18 Map scale' }, { v: 'q19', label: 'Q19 Angle' }, { v: 'q21', label: 'Q21 Tree' }, { v: 'q22', label: 'Q22 Floor plan' }],
  ask: (k) => MCQ[k].ask,
  make(stage, k, ex) {
    const d = MCQ[k], W = ex.W, OW = (W - 50) / 2;
    const tiles = d.opts.map((o, i) => el(stage, 'u6l7-opt', `<b>${'ABCD'[i]}</b><span class="ot">${o}</span><span class="why"></span>`, 16 + (i % 2) * (OW + 18), 8 + Math.floor(i / 2) * 92, OW, 80));
    tiles.forEach((t, i) => { const wy = t.querySelector('.why'); wy.innerHTML = d.why[i]; hide(wy); });
    const work = hide(cb(stage, 'u6l7-res', `Work it out: ${T(d.work)}`, (W - 640) / 2, 202, 640, 52));
    const tp = hide(cb(stage, 'u6l7-note', d.trap, 16, 266, W - 32, 52));
    const ok = tiles[d.ans];
    const st = hide(stamp(stage, '✓', { ok: true, x: 16 + (d.ans % 2) * (OW + 18) + OW - 34, y: 8 + Math.floor(d.ans / 2) * 92 + 40, rotate: -8 }));
    return [
      { cap: `Work it out <b>before</b> you look at the choices: ${T(d.work)}.`, run: (c) => c.pop(work) },
      { cap: `The answer is <b>${'ABCD'[d.ans]}</b>.`, run: async (c) => { ok.classList.add('u6l7-ok'); await pulse(c, ok, 1.04); await stampIn(c, st); } },
      { cap: 'Every wrong choice is the answer to a <b>mistake</b>. Can you name each one?',
        run: async (c) => { for (const [i, t] of tiles.entries()) { if (i === d.ans) continue; t.classList.add('u6l7-no'); await c.fadeIn(t.querySelector('.why'), 300); } } },
      { cap: d.trap, run: (c) => c.fadeIn(tp) }
    ];
  }
};

mountExplainers({ area, simk, tester, draw, map, plan, aa, indirect, traps });

/* ============ Stand Up Break! — mixed review like the unit test, at the whiteboards ============ */
{
  const r1 = (v) => Math.round(v * 10) / 10;
  const eq = (v, dp = 1) => (Math.abs(v - Math.round(v * 10 ** dp) / 10 ** dp) < 1e-9 ? '=' : '\\approx');
  standup('u6l7', {
    intro: 'Mixed review, like the unit test. Sketch it, write the proportion or the k, then show every step.',
    levels: {
      BEG: (r) => r.pick([
        () => { const o = r.pick([4, 5, 6, 8, 10, 12, 20]), k = r.pick([0.5, 1.5, 2, 2.5, 3, 0.75]), n = o * k;
          return { text: `A side <b>${nf(o)} cm</b> long becomes <b>${nf(n)} cm</b>. Find the scale factor. Is it an enlargement or a reduction?`, q: '',
            a: [`k=\\text{new}\\div\\text{original}=${tn(n)}\\div${tn(o)}=${tn(k)}`], atext: k > 1 ? '<b>enlargement</b> (k &gt; 1)' : '<b>reduction</b> (k &lt; 1)' }; },
        () => { const o = r.pick([3, 4, 4.5, 6, 7.5, 8, 12]), k = r.pick([2, 3, 1.5, 2.5, 0.5]), n = o * k;
          return r.chance(0.5) ? { text: `The scale factor is <b>k = ${nf(k)}</b>. The original side is <b>${nf(o)} cm</b>. Find the new side.`, q: '', a: [`\\text{new}=${tn(k)}\\times${tn(o)}=${tn(n)}\\text{ cm}`] }
            : { text: `The scale factor is <b>k = ${nf(k)}</b>. The new side is <b>${nf(n)} cm</b>. Find the original side.`, q: '', a: [`\\text{original}=${tn(n)}\\div${tn(k)}=${tn(o)}\\text{ cm}`] }; },
        () => { const m = r.pick([2, 5, 10, 0.5, 1.5]), d = r.pick([3.2, 4.5, 6.4, 7, 8.4, 2.6]);
          return { text: `On a map, 1 cm represents <b>${nf(m)} km</b>. Two towns are <b>${nf(d)} cm</b> apart on the map. How far apart are they really?`, q: '', a: [`${tn(d)}\\times${tn(m)}=${tn(d * m)}\\text{ km}`] }; }
      ])(),
      PRG: (r) => r.pick([
        () => { const p = r.pick([1.5, 1.6, 1.8]), s = r.pick([1.2, 2, 2.4, 3]), t = r.int(8, 30), hh = p / s * t;
          return { text: `A person <b>${nf(p)} m</b> tall casts a shadow <b>${nf(s)} m</b> long. At the same time, a tree casts a shadow <b>${t} m</b> long. How tall is the tree (nearest tenth)?`, q: '',
            a: [`\\dfrac{h}{${t}}=\\dfrac{${tn(p)}}{${tn(s)}}`, `h=${tn(p)}\\div${tn(s)}\\times${t}${eq(hh)}${tn(r1(hh), 1)}\\text{ m}`] }; },
        () => { const n = r.pick([20, 25, 50, 100]), m = r.pick([2.5, 3, 3.6, 4.2, 5, 6.5]), cmv = m * 100 / n;
          return { text: `A wall is <b>${nf(m)} m</b> long. How long is it on a floor plan with a scale of <b>1 : ${n}</b>?`, q: '',
            a: [`${tn(m)}\\text{ m}=${tn(m * 100)}\\text{ cm}`, `${tn(m * 100)}\\div${n}=${tn(cmv)}\\text{ cm}`] }; },
        () => { const a = r.int(2, 6), b = a + r.int(1, 4), k = r.pick([1.5, 2, 2.5, 3]), c2 = a * k, d = r.chance(0.5) ? b * k : b * k + r.pick([-1, 1, 2]);
          const r2 = d / b, same = Math.abs(r2 - k) < 1e-9;
          return { text: `Is a <b>${a} cm by ${b} cm</b> rectangle similar to a <b>${nf(c2)} cm by ${nf(d)} cm</b> rectangle? Show both tests.`, q: '',
            a: ['\\text{angles: all }90^\\circ', `${tn(c2)}\\div${a}=${tn(k)}`, `${tn(d)}\\div${b}${eq(r2, 2)}${tn(Math.round(r2 * 100) / 100, 2)}`], atext: same ? 'The ratios are equal: <b>similar</b>.' : 'The ratios are different: <b>not similar</b>.' }; }
      ])(),
      MAS: (r) => r.pick([
        () => { const e = r.pick([1.4, 1.5, 1.6, 1.7, 1.8]), d1 = r.pick([1.2, 1.5, 2, 2.4, 2.5]), d2 = r.int(8, 25), hh = e / d1 * d2;
          return { text: `Your eyes are <b>${nf(e)} m</b> above the ground. You see the top of a flagpole in a mirror on the ground. You are <b>${nf(d1)} m</b> from the mirror, and the mirror is <b>${d2} m</b> from the pole. How tall is the pole (nearest tenth)?`, q: '',
            a: [`\\dfrac{h}{${d2}}=\\dfrac{${tn(e)}}{${tn(d1)}}`, `h=${tn(e)}\\div${tn(d1)}\\times${d2}${eq(hh)}${tn(r1(hh), 1)}\\text{ m}`] }; },
        () => { const ad = r.pick([1.5, 2, 2.4, 3]), de = r.pick([0.8, 1, 1.2, 1.5]), k = r.pick([2, 2.5, 3, 4]), ac = ad * k;
          return { text: `A ramp rises from <b>A</b>. A post <b>${nf(de)} m</b> tall stands straight up <b>${nf(ad)} m</b> from A, under the ramp. The ramp ends on a wall <b>${nf(ac)} m</b> from A. How tall is the wall? Explain why the triangles are similar.`, q: '',
            a: [`k=${tn(ac)}\\div${tn(ad)}=${tn(k)}`, `\\text{wall}=${tn(k)}\\times${tn(de)}=${tn(k * de)}\\text{ m}`], atext: 'Both triangles have a right angle and share ∠A (AA).' }; },
        () => { const n = r.pick([25000, 50000, 100000, 250000]), d = r.pick([3.4, 4.8, 6.2, 7.5, 9.6]), km = n / 100000;
          return { text: `A map has a scale of <b>1 : ${tn(n).replace(/\\,/g, '&#8239;')}</b>. Two lakes are <b>${nf(d)} cm</b> apart on the map. How far apart are they, in kilometres?`, q: '',
            a: [`1\\text{ cm}\\to${tn(n)}\\text{ cm}=${tn(km)}\\text{ km}`, `${tn(d)}\\times${tn(km)}=${tn(d * km)}\\text{ km}`] }; }
      ])()
    }
  });
}
