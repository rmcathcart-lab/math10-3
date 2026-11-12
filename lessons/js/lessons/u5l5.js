/* Math 10-3 · Unit 5 · Lesson 5 — Copying and Bisecting Angles; Perpendicular Lines.
 * Explainers: copy with a compass (the booklet's 4 steps with P, Q, R, S; Example 2 check), why the copy works (Full
 * notes: the compass copies a triangle), copy with a protractor (Example 1), bisect by folding or with a Mira
 * (Example 4(c)), bisect with a compass (Example 4 check), halves and wholes (Full notes; Example 3), perpendicular
 * constructions (through a point; perpendicular bisector; Example 5), Mateo's table leg (Example 6), sorting lines
 * (Example 7), and mitre cuts and a gate brace (Example 8).
 * Also the static figures (the compass constructions in the key ideas are drawn by the same step lists), the Math
 * History box (bisecting is easy, trisecting is impossible: Wantzel 1837) and the Stand Up Break.
 * Compass-and-straightedge animations use Geo.construct (js/geo.js) with this lesson's own step lists, so the captions
 * use the booklet's letters. */
import { h, add, box, tex, svgEl, tween, pop, stamp, stampIn, pulse, drawIn, liveCtx, mountExplainers } from '../blocks.js';
import { Geo, at, dirTo, dist, arcD, wedgeD, text as gtext, dot as gdot } from '../geo.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const INK = '#1c2230', BLUE = '#1f5bd6', GREEN = '#12805a', RED = '#c93a33', AMBER = '#c27a0e', ORANGE = '#e0841a',
  PURPLE = '#7b4fc4', WOOD = '#c9a26b', WOOD2 = '#8a6234', PAPER = '#fbf6ea';
const fmt = (v) => { const r = Math.round(v * 10) / 10; return String(Math.abs(r - Math.round(r)) < 1e-9 ? Math.round(r) : r); };
const deg = (v) => fmt(v) + '°';
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const op = (c, el, to, ms = 350) => (c ? c.anim(el, [{ opacity: to }], ms) : (el.style.opacity = to, Promise.resolve()));
const P2 = (p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
const seg = (parent, a, b, o = {}) => svgEl('path', { d: `M${P2(a)}L${P2(b)}`, stroke: o.color || INK, 'stroke-width': o.width || 3, 'stroke-linecap': o.cap || 'round', fill: 'none', 'stroke-dasharray': o.dash || null, class: o.cls === undefined ? 'bk-stroke' : o.cls, opacity: o.opacity }, parent);
const arcP = (parent, V, r, start, span, o = {}) => svgEl('path', { d: arcD(V, r, start, span), stroke: o.color || INK, 'stroke-width': o.width || 2.6, fill: 'none', class: 'bk-stroke' }, parent);
const popable = (el) => { el.style.transformBox = 'fill-box'; el.style.transformOrigin = 'center'; return el; };
const label = (parent, p, s, o = {}) => popable(gtext(parent, p[0], p[1], s, o));
/** a right-angle square at V between directions d1 and d2 (math degrees) */
function square(parent, V, d1, d2, s = 18, color = RED) {
  const u = at([0, 0], d1, s), w = at([0, 0], d2, s);
  return svgEl('path', { d: `M${P2([V[0] + u[0], V[1] + u[1]])}L${P2([V[0] + u[0] + w[0], V[1] + u[1] + w[1]])}L${P2([V[0] + w[0], V[1] + w[1]])}`, stroke: color, 'stroke-width': 2.4, fill: 'none' }, parent);
}
/** an angle mark: arc (or square) from direction a to a + span, with a label */
function mark(parent, V, a, span, r, s, color = INK, o = {}) {
  const g = svgEl('g', {}, parent);
  if (Math.abs(span - 90) < 0.01 && !o.arc) square(g, V, a, a + 90, o.sq || 20, color); else arcP(g, V, r, a, span, { color, width: o.width || 2.6 });
  if (s) { const lr = o.lr || r + (o.size || 20) * 1.2; const p = at(V, a + span / 2, lr); gtext(g, p[0], p[1], s, { size: o.size || 20, color }); }
  return popable(g);
}
const stageSvg = (stage, W, H) => add(stage, svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u5l5-svg' }), 0, 0);
const res = (stage, html, x, y, w, cls = '') => add(stage, box(h('div', 'u5l5-res ' + cls, html), w), x, y);
function circleX(A, ra, B, rb) {
  const d = dist(A, B); if (d > ra + rb || d < Math.abs(ra - rb) || d === 0) return [];
  const a = (ra * ra - rb * rb + d * d) / (2 * d), hh = Math.sqrt(Math.max(0, ra * ra - a * a));
  const M = [A[0] + a * (B[0] - A[0]) / d, A[1] + a * (B[1] - A[1]) / d];
  return [[M[0] + hh * (B[1] - A[1]) / d, M[1] - hh * (B[0] - A[0]) / d], [M[0] - hh * (B[1] - A[1]) / d, M[1] + hh * (B[0] - A[0]) / d]];
}
/** the figure host on the page: <div data-fig="name"> → an <svg> W × H */
function figSvg(name, W, H) {
  const host = document.querySelector(`[data-fig="${name}"]`); if (!host) return null;
  const svg = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u5l5-svg', role: 'img' }, host);
  svg.style.maxWidth = '100%'; svg.style.height = 'auto';
  return svg;
}

/* ======================================================================================
 * Compass-and-straightedge step lists (for Geo.construct) with the booklet's letters
 * ====================================================================================== */
/** copy angle ABC (vertex V; arm BC at a1, arm BA at a1 + span) onto a ray from V2 pointing at d0.
 *  names [A, B, C], nn [E, F] (new vertex, end of its ray), lab [P, Q, R, S] or null (crossings unnamed) */
function copyList(o) {
  const { V, a1 = 0, span, len, V2, d0 = 0, r } = o, len2 = o.len2 || len, nm = o.names, nn = o.nn, L = o.lab;
  const P = at(V, a1 + span, r), Q = at(V, a1, r), R = at(V2, d0, r), S = at(V2, d0 + span, r), w = dist(P, Q);
  const b = (s) => `<b>${s}</b>`, cP = L ? ` at ${b(L[0])} and ${b(L[1])}` : '';
  const pq = L ? `${b(L[1])} to ${b(L[0])}` : 'the two crossings on the first angle';
  return [
    { given: true, do: [{ angle: { vertex: V, a1, a2: a1 + span, len, arc: false, arms: true, dot: true, names: [nm[2], nm[1], nm[0]] } },
      { line: { a: V2, b: at(V2, d0, len2), tool: false } }, { point: { at: V2, label: nn[0], pos: d0 - 90, dist: 22 } },
      { text: { at: at(V2, d0, len2 + 22), s: nn[1], size: 22 } }] },
    { cap: `<b>Step 1.</b> Compass point on the vertex ${b(nm[1])}. Draw an arc that crosses <b>both arms</b>${cP}.`,
      do: [{ arc: { c: V, r, from: a1 - 12, to: a1 + span + 12 } }, { point: { at: P, r: 4, label: L && L[0], pos: a1 + span + 75, dist: 20 } }, { point: { at: Q, r: 4, label: L && L[1], pos: a1 - 60, dist: 20 } }] },
    { cap: `<b>Step 2.</b> <b>Same width.</b> Compass point on ${b(nn[0])}. Draw a long arc that crosses the ray${L ? ` at ${b(L[2])}` : ''}.`,
      do: [{ arc: { c: V2, r, from: d0 - 12, to: d0 + span + 24 } }, { point: { at: R, r: 4, label: L && L[2], pos: d0 - 60, dist: 20 } }] },
    { cap: `<b>Step 3.</b> Set the compass to the distance from ${pq}. Compass point on ${L ? b(L[2]) : 'the crossing on the new ray'}: cut the long arc${L ? ` at ${b(L[3])}` : ''}.`,
      do: [{ arc: { c: Q, r: w, from: dirTo(Q, P) - 12, to: dirTo(Q, P) + 12, color: AMBER } }, { arc: { c: R, r: w, from: dirTo(R, S) - 14, to: dirTo(R, S) + 14, color: AMBER } }, { point: { at: S, r: 4, label: L && L[3], pos: d0 + span + 75, dist: 20 } }] },
    { cap: o.last || `<b>Step 4.</b> Draw the ray from ${b(nn[0])} through ${L ? b(L[3]) : 'that crossing'}. The new angle is an <b>exact copy</b>: ${deg(span)}.`,
      do: [{ line: { a: V2, b: at(V2, d0 + span, len2 * 0.92) } },
        { angle: { vertex: V, a1, a2: a1 + span, r: r * 0.36, label: deg(span), size: 20, arcColor: BLUE, labelColor: BLUE } },
        { angle: { vertex: V2, a1: d0, a2: d0 + span, r: r * 0.36, label: deg(span), size: 20, arcColor: BLUE, labelColor: BLUE } }] }
  ];
}
/** bisect angle ABC (vertex V, arm BC at a1, BA at a1 + span); lab [P, Q, D] or null */
function bisectList(o) {
  const { V, a1 = 0, span, len, r1, r2 } = o, nm = o.names, L = o.lab, b = (s) => `<b>${s}</b>`;
  const P = at(V, a1 + span, r1), Q = at(V, a1, r1), mid = a1 + span / 2;
  const D = circleX(P, r2, Q, r2).sort((p, q) => dist(q, V) - dist(p, V))[0], half = deg(span / 2);
  return [
    { given: true, angle: { vertex: V, a1, a2: a1 + span, len, arc: false, arms: true, dot: true, names: [nm[2], nm[1], nm[0]] } },
    { cap: `<b>Step 1.</b> Compass point on the vertex ${b(nm[1])}. Draw an arc that crosses <b>both arms</b>${L ? ` at ${b(L[0])} and ${b(L[1])}` : ''}.`,
      do: [{ arc: { c: V, r: r1, from: a1 - 12, to: a1 + span + 12 } }, { point: { at: P, r: 4, label: L && L[0], pos: a1 + span + 80, dist: 20 } }, { point: { at: Q, r: 4, label: L && L[1], pos: a1 - 70, dist: 20 } }] },
    { cap: `<b>Step 2.</b> Compass point on ${L ? b(L[1]) : 'the crossing on one arm'}. Draw an arc <b>inside</b> the angle.`, arc: { c: Q, r: r2, from: dirTo(Q, D) - 22, to: dirTo(Q, D) + 22 } },
    { cap: `<b>Step 3.</b> <b>Same width.</b> Compass point on ${L ? b(L[0]) : 'the other crossing'}. The arcs cross${L ? ` at ${b(L[2])}` : ''}.`,
      do: [{ arc: { c: P, r: r2, from: dirTo(P, D) + 22, to: dirTo(P, D) - 22 } }, { point: { at: D, r: 4.5, label: L && L[2], pos: mid + 90, dist: 22 } }] },
    { cap: `<b>Step 4.</b> Draw the ray from ${b(nm[1])} through ${L ? b(L[2]) : 'the crossing'}: the <b>bisector</b>.`, line: { a: V, b: at(V, mid, len * 1.04) } },
    { cap: o.last || `Two equal angles: ${deg(span)} ÷ 2 = <b>${half}</b> each.`,
      do: [{ angle: { vertex: V, a1, a2: mid, r: r1 * 0.42, label: half, size: 20, arcColor: BLUE, labelColor: BLUE } }, { angle: { vertex: V, a1: mid, a2: a1 + span, r: r1 * 0.5, label: half, size: 20, arcColor: GREEN, labelColor: GREEN } }] }
  ];
}
/** the perpendicular bisector of AB: names [A, B], lab [C, D, M]; cm = px per cm (adds lengths) */
function perpBisList(o) {
  const A = o.a, B = o.b, r = o.r, nm = o.names || ['A', 'B'], L = o.lab || ['C', 'D', 'M'];
  const [X, Y] = circleX(A, r, B, r).sort((p, q) => p[1] - q[1]), M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], th = dirTo(A, B);
  const list = [
    { given: true, do: [{ line: { a: A, b: B, tool: false } }, { point: { at: A, label: nm[0], pos: th + 180, dist: 22 } }, { point: { at: B, label: nm[1], pos: th, dist: 22 } }] },
    { cap: `<b>1.</b> Open the compass to <b>more than half</b> of ${nm[0]}${nm[1]}. Point on <b>${nm[0]}</b>: draw arcs above and below.`, do: [{ arc: { c: A, r, from: dirTo(A, X) - 15, to: dirTo(A, X) + 15 } }, { arc: { c: A, r, from: dirTo(A, Y) - 15, to: dirTo(A, Y) + 15 } }] },
    { cap: `<b>2.</b> <b>Same width</b>, point on <b>${nm[1]}</b>. The arcs cross at <b>${L[0]}</b> and <b>${L[1]}</b>.`, do: [{ arc: { c: B, r, from: dirTo(B, X) + 15, to: dirTo(B, X) - 15 } }, { arc: { c: B, r, from: dirTo(B, Y) + 15, to: dirTo(B, Y) - 15 } },
      { point: { at: X, r: 4.5, label: L[0], pos: th + 160, dist: 22 } }, { point: { at: Y, r: 4.5, label: L[1], pos: th + 200, dist: 22 } }] },
    { cap: `<b>3.</b> Draw line <b>${L[0]}${L[1]}</b>. It crosses ${nm[0]}${nm[1]} at its <b>midpoint ${L[2]}</b>, at <b>90°</b>: ${nm[0]}${L[2]} = ${L[2]}${nm[1]}.`,
      do: [{ line: { a: X, b: Y, ext: [26, 26] } }, { right: { V: M, P: B, Q: X } }, { ticks: { a: A, b: M } }, { ticks: { a: M, b: B } }, { point: { at: M, r: 4.5, label: L[2], pos: th - 135, dist: 24 } }] }
  ];
  if (o.cm) {
    const ab = dist(A, B) / o.cm;
    list.push({ cap: o.last || `Measure: ${nm[0]}${nm[1]} = ${fmt(ab)} cm, so ${nm[0]}${L[2]} = ${L[2]}${nm[1]} = <b>${fmt(ab / 2)} cm</b>, and the angle at ${L[2]} is <b>90°</b>.`,
      do: [{ text: { at: at([(A[0] + M[0]) / 2, (A[1] + M[1]) / 2], th - 90, 30), s: fmt(ab / 2) + ' cm', size: 20, color: BLUE } }, { text: { at: at([(B[0] + M[0]) / 2, (B[1] + M[1]) / 2], th - 90, 30), s: fmt(ab / 2) + ' cm', size: 20, color: BLUE } }] });
  }
  return list;
}
/** a perpendicular through P on line AB: lab { P, X, Y, Q } */
function perpAtList(o) {
  const A = o.a, B = o.b, Pp = o.p, th = dirTo(A, B), u = at([0, 0], th, 1), r1 = o.r1, r2 = o.r2, L = Object.assign({ P: 'P', X: 'X', Y: 'Y', Q: 'Q' }, o.lab || {});
  const X = [Pp[0] - u[0] * r1, Pp[1] - u[1] * r1], Y = [Pp[0] + u[0] * r1, Pp[1] + u[1] * r1], Q = at(Pp, th + 90, Math.sqrt(r2 * r2 - r1 * r1));
  const list = [
    { given: true, do: [{ line: { a: A, b: B, tool: false } }, { point: { at: Pp, label: L.P, pos: th - 125, dist: 24 } }].concat(o.lineName ? [{ text: { at: at(B, th, 22), s: o.lineName, size: 22 } }] : []) },
    { cap: `<b>1.</b> Compass point on <b>${L.P}</b>. Draw arcs that cross the line on <b>both sides</b>, at <b>${L.X}</b> and <b>${L.Y}</b>.`,
      do: [{ arc: { c: Pp, r: r1, from: th + 166, to: th + 194 } }, { arc: { c: Pp, r: r1, from: th + 14, to: th - 14 } }, { point: { at: X, r: 4.5, label: L.X, pos: th - 90, dist: 26 } }, { point: { at: Y, r: 4.5, label: L.Y, pos: th - 90, dist: 26 } }] },
    { cap: `<b>2.</b> Open the compass <b>wider</b>. Point on <b>${L.X}</b>: draw an arc above ${L.P}.`, arc: { c: X, r: r2, from: dirTo(X, Q) - 14, to: dirTo(X, Q) + 14 } },
    { cap: `<b>3.</b> <b>Same width</b>, point on <b>${L.Y}</b>: an arc that crosses it at <b>${L.Q}</b>.`, do: [{ arc: { c: Y, r: r2, from: dirTo(Y, Q) + 14, to: dirTo(Y, Q) - 14 } }, { point: { at: Q, r: 4.5, label: L.Q, pos: th + 10, dist: 24 } }] },
    { cap: o.last || `<b>4.</b> Draw line <b>${L.P}${L.Q}</b>: it is <b>perpendicular</b>. It bisects the straight angle at ${L.P}: 180° ÷ 2 = <b>90°</b>.`,
      do: [{ line: { a: Pp, b: Q, ext: [0, o.ext ?? 70] } }, { right: { V: Pp, P: Y, Q } }] }
  ];
  return list;
}
/** draw a step list's finished picture (static, no tools) */
function drawStatic(host, list, W, H) { const K = Geo.construct(host, list, { width: W, height: H }); K.play(null); return K; }

/* ======================================================================================
 * Static figures
 * ====================================================================================== */
function statics() {
  // key ideas: the finished constructions
  const kc = document.querySelector('[data-fig="keyCopy"]');
  if (kc) drawStatic(kc, copyList({ V: [26, 186], span: 48, len: 150, r: 80, V2: [250, 186], len2: 170, names: ['A', 'B', 'C'], nn: ['E', 'F'], lab: ['P', 'Q', 'R', 'S'] }), 450, 210);
  const kb = document.querySelector('[data-fig="keyBisect"]');
  if (kb) drawStatic(kb, bisectList({ V: [40, 228], span: 64, len: 215, r1: 105, r2: 105, names: ['A', 'B', 'C'], lab: ['P', 'Q', 'D'] }), 330, 250);
  const wb = document.querySelector('[data-fig="whyBisect"]');
  if (wb) {
    const o = { V: [40, 262], span: 64, len: 245, r1: 130, r2: 130, names: ['A', 'B', 'C'], lab: ['P', 'Q', 'D'] };
    const K = drawStatic(wb, bisectList(o).slice(0, 5), 400, 295), V = o.V, Pp = at(V, 64, 130), Q = at(V, 0, 130);
    const D = circleX(Pp, 130, Q, 130).sort((p, q) => dist(q, V) - dist(p, V))[0], g = svgEl('g', {}, K.svg);
    K.svg.insertBefore(g, K.svg.firstChild);
    svgEl('path', { d: `M${[V, Pp, D].map(P2).join('L')}Z`, fill: GREEN, 'fill-opacity': 0.16 }, g);
    svgEl('path', { d: `M${[V, Q, D].map(P2).join('L')}Z`, fill: BLUE, 'fill-opacity': 0.16 }, g);
    const tick = (a, b2, n, col) => { const M = [(a[0] + b2[0]) / 2, (a[1] + b2[1]) / 2], t = dirTo(a, b2); for (let i = 0; i < n; i++) { const m = at(M, t, (i - (n - 1) / 2) * 7); seg(K.svg, at(m, t + 90, 9), at(m, t - 90, 9), { color: col, width: 2.4, cls: '' }); } };
    seg(K.svg, Pp, D, { color: ORANGE, width: 2.4 }); seg(K.svg, Q, D, { color: ORANGE, width: 2.4 });
    tick(V, Pp, 1, RED); tick(V, Q, 1, RED); tick(Pp, D, 2, ORANGE); tick(Q, D, 2, ORANGE);
  }
  const kp = document.querySelector('[data-fig="keyPerpAt"]');
  if (kp) drawStatic(kp, perpAtList({ a: [20, 176], b: [420, 176], p: [220, 176], r1: 72, r2: 118, ext: 40 }), 440, 210);
  const kq = document.querySelector('[data-fig="keyPerpBis"]');
  if (kq) drawStatic(kq, perpBisList({ a: [90, 112], b: [350, 112], r: 152 }), 440, 225);

  let s = figSvg('ex1', 900, 230);
  if (s) {
    Geo.angle(s, { vertex: [110, 205], a1: 15, a2: 79, len: 180, arc: false, names: ['M', 'L', 'K'] });
    seg(s, [520, 205], [840, 205], { width: 3.2 }); gdot(s, [520, 205], { r: 4.5 }); gtext(s, 506, 224, 'S', { size: 22 }); gtext(s, 862, 205, 'T', { size: 22 });
  }
  s = figSvg('ex2', 900, 230);
  if (s) {
    Geo.angle(s, { vertex: [290, 205], a1: 0, a2: 112, len: 175, arc: false, names: ['F', 'E', 'D'] });
    seg(s, [560, 205], [860, 205], { width: 3.2 }); gdot(s, [560, 205], { r: 4.5 }); gtext(s, 560, 226, 'G', { size: 22 }); gtext(s, 882, 205, 'H', { size: 22 });
  }
  s = figSvg('ex4', 400, 330);
  if (s) Geo.angle(s, { vertex: [40, 300], a1: 10, a2: 80, len: 280, arc: false, names: ['L', 'K', 'J'] });
  s = figSvg('ex5a', 430, 290);
  if (s) { seg(s, [35, 145], [395, 145], { width: 3.2 }); gdot(s, [35, 145]); gdot(s, [395, 145]); gtext(s, 16, 145, 'A', { size: 22 }); gtext(s, 414, 145, 'B', { size: 22 }); }
  s = figSvg('ex5b', 430, 290);
  if (s) { const A = [10, 262], E = at(A, 15, 400), Pp = at(A, 15, 194); seg(s, A, E, { width: 3.2 }); gtext(s, E[0] + 4, E[1] - 18, 'n', { size: 22, italic: true }); gdot(s, Pp); gtext(s, Pp[0] + 14, Pp[1] + 20, 'P', { size: 22 }); }

  s = figSvg('plane', 430, 250);
  if (s) {
    svgEl('path', { d: 'M20 200 L290 200 L360 112 L90 112 Z', fill: '#eceae3', stroke: INK, 'stroke-width': 2 }, s);
    seg(s, [62, 156], [318, 156], { width: 2, dash: '7 6', color: '#5a6170' }); seg(s, [140, 200], [240, 112], { width: 2, dash: '7 6', color: '#5a6170' });
    svgEl('rect', { x: 182, y: 22, width: 16, height: 134, fill: '#8a5a2b', stroke: '#4a2c14', 'stroke-width': 2 }, s);
    square(s, [190, 156], 0, 90, 16, RED); square(s, [190, 156], 129, 90, 13, BLUE);
    gtext(s, 210, 40, 'post', { size: 18, color: '#4a2c14', anchor: 'start' });
    gtext(s, 50, 232, '90° to side-to-side', { size: 16, color: RED, anchor: 'start' }); gtext(s, 240, 232, '90° to front-to-back', { size: 16, color: BLUE, anchor: 'start' });
  }

  s = figSvg('ex7', 600, 370);
  if (s) drawLines(s, LX.s, 0, 0, true);

  s = figSvg('mitre', 280, 280);
  if (s) {
    svgEl('path', { d: 'M20 260 L260 260 L260 196 L84 196 L84 20 L20 20 Z', fill: '#ead6b4', stroke: INK, 'stroke-width': 2.6, 'stroke-linejoin': 'round' }, s);
    seg(s, [20, 260], [84, 196], { width: 2.6 });
    svgEl('path', { d: arcD([20, 260], 46, 0, 45), stroke: BLUE, 'stroke-width': 2.6, fill: 'none' }, s);
    svgEl('path', { d: arcD([20, 260], 56, 45, 45), stroke: GREEN, 'stroke-width': 2.6, fill: 'none' }, s);
    gtext(s, 112, 238, '45°', { size: 20, color: BLUE }); gtext(s, 48, 166, '45°', { size: 20, color: GREEN });
  }
}

/* ---------- Example 7: the five lines (booklet coordinates, y up) ---------- */
const LINES = {
  1: { p: [0.8, 0], d: 70, L: 4.6, lab: 'n' }, 2: { p: [3.2, 0], d: 70, L: 4.6, lab: 'n' }, 3: { p: [6.8, 1.0], d: 160, L: 7.2, lab: 'w' },
  4: { p: [0.1, 0.55], d: 10, L: 7.6, lab: 'e' }, 5: { p: [6.55, 2.6], d: 100, L: 1.9, lab: 'n' }
};
const LX = { s: 72, top: 4.75 };
const SUB = ['₀', '₁', '₂', '₃', '₄', '₅'];
const toPx = (p, ox, oy) => [ox + 24 + p[0] * LX.s, oy + 24 + (LX.top - p[1]) * LX.s];
const lineEnd = (k) => { const l = LINES[k], r = l.d * Math.PI / 180; return [l.p[0] + l.L * Math.cos(r), l.p[1] + l.L * Math.sin(r)]; };
function drawLines(svg, scale, ox, oy) {
  const out = {};
  for (const k of [1, 2, 3, 4, 5]) {
    const a = toPx(LINES[k].p, ox, oy), b = toPx(lineEnd(k), ox, oy), g = svgEl('g', {}, svg);
    out[k] = { g, a, b, ln: seg(g, a, b, { width: 3.2 }) };
    const dir = LINES[k].lab === 'n' ? [0, -20] : LINES[k].lab === 'w' ? [-22, 0] : [24, 0];
    out[k].t = gtext(g, b[0] + dir[0], b[1] + dir[1], 'ℓ' + SUB[k], { size: 22, italic: false });
  }
  return out;
}
/** intersection of the infinite lines k and m (booklet coords), or null if parallel */
function meet(k, m) {
  const A = LINES[k], B = LINES[m], ra = A.d * Math.PI / 180, rb = B.d * Math.PI / 180;
  const ux = Math.cos(ra), uy = Math.sin(ra), vx = Math.cos(rb), vy = Math.sin(rb), den = ux * vy - uy * vx;
  if (Math.abs(den) < 1e-9) return null;
  const dx = B.p[0] - A.p[0], dy = B.p[1] - A.p[1], s = (dx * vy - dy * vx) / den, t = (dx * uy - dy * ux) / den;
  return { pt: [A.p[0] + s * ux, A.p[1] + s * uy], s, t };
}

/* ======================================================================================
 * Explainers
 * ====================================================================================== */
const copyCompass = {
  title: 'Copy an angle with a compass and straightedge',
  height: 400, minW: 960,
  choices: [{ v: 'key', label: 'Copy ∠ABC (the steps)' }, { sep: 'Example 2 check:' }, { v: 'ex2', label: '∠DEF onto ray GH' }],
  ask: (v) => (v === 'ex2' ? `Example 2: copy ${T('\\angle DEF')} onto ray ${T('GH')} using only a compass and a straightedge.` : `Copy ${T('\\angle ABC')} onto a ray from a new point ${T('E')}, with no numbers at all.`),
  make(stage, v, ex) {
    const ox = (ex.W - 960) / 2;
    const list = v === 'ex2'
      ? copyList({ V: [330, 368], span: 112, len: 215, r: 118, V2: [620, 368], len2: 285, names: ['D', 'E', 'F'], nn: ['G', 'H'], lab: null,
        last: '<b>Step 4.</b> Draw the new arm through the crossing. <b>Check</b> with a protractor: both angles measure <b>112°</b> ✓' })
      : copyList({ V: [90, 368], span: 48, len: 290, r: 150, V2: [520, 368], len2: 350, names: ['A', 'B', 'C'], nn: ['E', 'F'], lab: ['P', 'Q', 'R', 'S'],
        last: `<b>Step 4.</b> Draw the ray from <b>E</b> through <b>S</b>. Now ${T('\\angle SER=\\angle ABC')}: both ${deg(48)}.` });
    return Geo.construct(stage, list, { x: ox, y: 0, width: 960, height: 400 }).steps;
  }
};

const whyCopy = {
  title: 'Why the compass copy works',
  height: 390, minW: 960,
  ask: `Why is ${T('\\angle SER')} exactly the same size as ${T('\\angle ABC')}?`,
  make(stage, v, ex) {
    const ox = (ex.W - 960) / 2, svg = stageSvg(stage, ex.W, 390), g = svgEl('g', { transform: `translate(${ox} 0)` }, svg);
    const B = [90, 348], E = [520, 348], span = 48, r = 160, len = 290;
    const Pp = at(B, span, r), Q = at(B, 0, r), R = at(E, 0, r), S = at(E, span, r);
    Geo.angle(g, { vertex: B, a1: 0, a2: span, len, arc: false, names: ['C', 'B', 'A'] });
    seg(g, E, at(E, 0, 350), { width: 3.2 }); seg(g, E, at(E, span, 320), { width: 3.2 }); gdot(g, E);
    gtext(g, E[0] - 4, E[1] + 22, 'E', { size: 22 }); gtext(g, E[0] + 372, E[1], 'F', { size: 22 });
    [[B, -12, span + 24], [E, -12, span + 36]].forEach(([c, a, sp]) => arcP(g, c, r, a, sp, { color: '#9aa0ab', width: 2 }));
    arcP(g, R, dist(R, S), dirTo(R, S) - 14, 28, { color: '#d7b68a', width: 2 });
    [[Pp, 'P', span + 75], [Q, 'Q', -60], [R, 'R', -60], [S, 'S', span + 75]].forEach(([p, s, d]) => { gdot(g, p, { r: 4 }); const q = at(p, d, 20); gtext(g, q[0], q[1], s, { size: 21 }); });
    const side = (a, b2, col) => hide(seg(g, a, b2, { color: col, width: 6 }));
    const s1 = [side(B, Pp, BLUE), side(B, Q, BLUE), side(E, R, BLUE), side(E, S, BLUE)];
    const s2 = [side(Q, Pp, ORANGE), side(R, S, ORANGE)];
    const tri = (pts, col) => hide(svgEl('path', { d: `M${pts.map(P2).join('L')}Z`, fill: col, 'fill-opacity': 0.18, stroke: 'none' }, g));
    const t1 = tri([B, Pp, Q], BLUE), t2 = tri([E, R, S], GREEN);
    const ghost = svgEl('g', {}, g); ghost.style.transformBox = 'view-box'; ghost.style.transformOrigin = '0 0'; hide(ghost);
    svgEl('path', { d: `M${[B, Pp, Q].map(P2).join('L')}Z`, fill: BLUE, 'fill-opacity': 0.28, stroke: BLUE, 'stroke-width': 3, 'stroke-dasharray': '8 5' }, ghost);
    const m1 = hide(mark(g, B, 0, span, 56, deg(span), BLUE)), m2 = hide(mark(g, E, 0, span, 56, deg(span), BLUE));
    const box1 = hide(res(stage, `<b>Same 3 sides</b><br>${T('BP=ER')}, ${T('BQ=ES')}, ${T('QP=RS')}`, ox + 300, 12, 300));
    return [
      { cap: `Steps 1 and 2 used the <b>same compass width</b>: ${T('BP')}, ${T('BQ')}, ${T('ER')} and ${T('ES')} are all equal.`, run: (c) => Promise.all(s1.map((e) => op(c, e, 1, 500))) },
      { cap: `Step 3 copied one more distance: ${T('QP=RS')}.`, run: (c) => Promise.all(s2.map((e) => op(c, e, 1, 500))) },
      { cap: `So triangle ${T('BPQ')} and triangle ${T('ERS')} have the <b>same three sides</b>.`, run: async (c) => { await Promise.all([op(c, t1, 1), op(c, t2, 1)]); await pop(c, box1); } },
      { cap: `Slide triangle ${T('BPQ')} over to ${T('E')}: it fits <b>exactly</b>. Three equal sides make the same triangle.`,
        run: async (c) => { ghost.style.opacity = 1; await tween(c, 1300, (t) => ghost.setAttribute('transform', `translate(${(E[0] - B[0]) * t} 0)`)); } },
      { cap: `Same triangle → same angle at the vertex: ${T('\\angle SER=\\angle ABC')}. A triangle can’t change shape: that’s why builders use them!`, run: async (c) => { await pop(c, m1); await pop(c, m2); } }
    ];
  }
};

const copyProt = {
  title: 'Copy an angle with a protractor',
  height: 450, minW: 960, tap: false,
  ask: `Example 1: measure ${T('\\angle KLM')}. Then copy it onto ray ${T('ST')}, with its vertex at ${T('S')}.`,
  make(stage, v, ex) {
    const ox = (ex.W - 960) / 2, L = [205, 370], S = [590, 370], R = 165;
    const P = Geo.protractor(stage, { x: ox, y: 0, width: 960, height: 450, r: R, cx: 520, cy: 230, rot: 0, angle: { vertex: L, a1: 15, a2: 79, names: ['M', 'L', 'K'], len: 205 }, buttons: false, readout: false });
    const lay = svgEl('g', {}, P.svg); lay.style.pointerEvents = 'none';
    seg(lay, S, [920, 370], { width: 3.4 }); gdot(lay, S, { r: 4.5 }); gtext(lay, S[0] - 14, S[1] + 22, 'S', { size: 22 }); gtext(lay, 940, 370, 'T', { size: 22 });
    const dt = hide(gdot(lay, at(S, 64, R + 10), { r: 6, color: RED }));
    const arm = hide(seg(lay, S, at(S, 64, 230), { width: 3.4, color: RED }));
    const m1 = hide(mark(lay, L, 15, 64, 50, '64°', BLUE)), m2 = hide(mark(lay, S, 0, 64, 50, '64°', RED));
    const r1 = hide(res(stage, `${T('\\angle KLM=64^\\circ')}`, ox + 10, 6, 200));
    return [
      { cap: '<b>Measure.</b> Put the protractor’s <b>centre mark</b> on the vertex <b>L</b>.', run: (c) => P.moveTo(c, { cx: L[0], cy: L[1] }) },
      { cap: 'Turn it so the <b>0 line</b> lies along arm <b>LM</b>.', run: (c) => P.moveTo(c, { rot: 15 }, 800) },
      { cap: 'Use the scale that has <b>0 on LM</b> and count up to arm LK: <b>64°</b>. Acute, less than 90° ✓', run: async (c) => { P.showScale('auto'); await pop(c, r1); } },
      { cap: '<b>Copy.</b> Move the centre mark to <b>S</b>, with the 0 line along ray <b>ST</b>.', run: async (c) => { P.showScale('inner'); await P.moveTo(c, { cx: S[0], cy: S[1], rot: 0 }, 1300); } },
      { cap: 'On the scale that has <b>0 on ST</b>, find <b>64</b>. Mark a dot there.', run: async (c) => { await pop(c, dt); await pulse(c, dt, 1.6); } },
      { cap: 'Lift the protractor off. Join <b>S</b> to the dot: the copy is <b>64°</b>, the same as ∠KLM.',
        run: async (c) => { await op(c, P.g, 0.12, 500); arm.style.opacity = 1; await drawIn(arm, 600, c); await pop(c, m1); await pop(c, m2); } }
    ];
  }
};

/* ---------- bisect by folding, or with a Mira (Example 4(c)) ---------- */
const fold = {
  title: 'Bisect without a compass: fold it, or use a Mira',
  height: 420, minW: 960,
  choices: [{ sep: 'Example 4(c) check:' }, { v: 'fold', label: 'Fold the paper' }, { v: 'mira', label: 'Use a Mira' }],
  ask: (v) => (v === 'mira' ? `Bisect ${T('\\angle JKL')} with a Mira (a see-through red mirror).` : `Example 4(c): check the bisector of ${T('\\angle JKL')} by folding.`),
  make(stage, v, ex) {
    const ox = (ex.W - 960) / 2, svg = stageSvg(stage, ex.W, 420), g = svgEl('g', { transform: `translate(${ox} 0)` }, svg);
    const K = [300, 388], a1 = 10, a2 = 80, len = 330, mid = 45, Jp = at(K, a2, len), Lp = at(K, a1, len);
    const fin = hide(svgEl('g', {}, g));
    const crease = seg(fin, K, at(K, mid, len), { width: 3, dash: '10 7', color: PURPLE });
    const h1 = mark(fin, K, a1, 35, 70, '35°', BLUE), h2 = mark(fin, K, mid, 35, 84, '35°', GREEN);
    const box1 = hide(res(stage, `${T('70^\\circ\\div2=35^\\circ')} ✓`, ox + 690, 30, 230));
    if (v === 'mira') {
      svgEl('rect', { x: 120, y: 20, width: 600, height: 390, rx: 6, fill: PAPER, stroke: '#cbbf9f', 'stroke-width': 2 }, g);
      g.appendChild(fin);
      Geo.angle(g, { vertex: K, a1, a2, len, arc: false, names: ['L', 'K', 'J'] });
      const refl = svgEl('path', { d: '', stroke: RED, 'stroke-width': 3, 'stroke-dasharray': '9 7', fill: 'none' }, g);
      const mira = svgEl('path', { d: '', fill: '#e2453a', 'fill-opacity': 0.3, stroke: '#b3261e', 'stroke-width': 2 }, g);
      let th = 22;
      const place = (t) => {
        th = t; const n = at([0, 0], th - 90, 9), A = at(K, th, -24), B = at(K, th, 300);
        mira.setAttribute('d', `M${P2(A)}L${P2(B)}L${P2([B[0] + n[0], B[1] + n[1]])}L${P2([A[0] + n[0], A[1] + n[1]])}Z`);
        refl.setAttribute('d', `M${P2(K)}L${P2(at(K, 2 * th - a1, len))}`);
      };
      hide(mira, refl); place(22);
      const ok = hide(stamp(stage, 'lined up ✓', { ok: true, x: ox + 820, y: 210 }));
      return [
        { cap: 'Stand the Mira on the vertex <b>K</b>. Look through it at arm <b>KL</b>: you see its <b>reflection</b> (dashed).', run: async (c) => { await op(c, mira, 1); await op(c, refl, 1); } },
        { cap: 'Turn the Mira. The reflection of KL turns <b>twice as fast</b>.', run: (c) => tween(c, 1500, (t) => place(22 + 36 * t)) },
        { cap: 'Turn it back until the reflection lies <b>right on</b> arm <b>KJ</b>.', run: async (c) => { await tween(c, 1100, (t) => place(58 - 13 * t)); await stampIn(c, ok); } },
        { cap: 'Draw along the Mira’s edge: that line is the <b>bisector</b>.', run: async (c) => { await op(c, mira, 0.25); refl.style.opacity = 0; fin.style.opacity = 1; [h1, h2].forEach((e) => (e.style.opacity = 0)); } },
        { cap: `Measure both halves: <b>35°</b> and <b>35°</b>. ${T('70^\\circ\\div2=35^\\circ')} ✓`, run: async (c) => { await pop(c, h1); await pop(c, h2); await pop(c, box1); } }
      ];
    }
    /* folding: the paper is two clipped halves; the flap (the J side of the crease) reflects over the crease */
    const id = 'u5l5c' + Math.random().toString(36).slice(2, 8), far = 1500;
    const half = (s) => { const A = at(K, mid, far), Bq = at(K, mid + 180, far), n = at([0, 0], mid + 90 * s, far); return `${P2(A)} ${P2([A[0] + n[0], A[1] + n[1]])} ${P2([Bq[0] + n[0], Bq[1] + n[1]])} ${P2(Bq)}`; };
    const defs = svgEl('defs', {}, svg);
    svgEl('polygon', { points: half(1) }, svgEl('clipPath', { id: id + 'a', clipPathUnits: 'userSpaceOnUse' }, defs));
    svgEl('polygon', { points: half(-1) }, svgEl('clipPath', { id: id + 'b', clipPathUnits: 'userSpaceOnUse' }, defs));
    const sheet = (parent) => svgEl('rect', { x: 120, y: 20, width: 600, height: 390, rx: 4, fill: PAPER, stroke: '#cbbf9f', 'stroke-width': 2 }, parent);
    const base = svgEl('g', { 'clip-path': `url(#${id}b)` }, g); sheet(base);
    seg(base, K, Lp, { width: 3.4 }); gtext(base, Lp[0] + 18, Lp[1] + 4, 'L', { size: 22 });
    const flapO = svgEl('g', {}, g); flapO.style.transformBox = 'view-box'; flapO.style.transformOrigin = '0 0';
    const flap = svgEl('g', { 'clip-path': `url(#${id}a)` }, flapO); const fs = sheet(flap);
    const jArm = seg(flap, K, Jp, { width: 3.4 }); const jl = gtext(flap, Jp[0] + 4, Jp[1] - 18, 'J', { size: 22 });
    g.appendChild(fin);
    gdot(g, K, { r: 4.5 }); gtext(g, K[0] - 18, K[1] + 4, 'K', { size: 22 });
    const setFold = (s) => {
      flapO.setAttribute('transform', `translate(${K[0]} ${K[1]}) rotate(${-mid}) scale(1 ${s.toFixed(4)}) rotate(${mid}) translate(${-K[0]} ${-K[1]})`);
      fs.setAttribute('fill', s < 0 ? '#efe2c4' : PAPER); jl.style.opacity = s < 0 ? 0 : 1;
    };
    setFold(1);
    const ok = hide(stamp(stage, 'arm on arm ✓', { ok: true, x: ox + 820, y: 210 }));
    return [
      { cap: 'Trace ∠JKL on thin paper. Fold <b>through K</b>, bringing arm <b>KJ</b> down toward arm <b>KL</b>…', run: (c) => tween(c, 1600, (t) => setFold(1 - 2 * t)) },
      { cap: '…until KJ lies <b>exactly on top</b> of KL. Press the fold flat.', run: async (c) => { jArm.setAttribute('stroke', BLUE); await stampIn(c, ok); } },
      { cap: 'Unfold. The <b>crease</b> is the bisector.', run: async (c) => { jArm.setAttribute('stroke', INK); if (c && !c.fast) await op(c, ok, 0, 200); else ok.style.opacity = 0; await tween(c, 1300, (t) => setFold(-1 + 2 * t)); [h1, h2].forEach((e) => (e.style.opacity = 0)); fin.style.opacity = 1; await drawIn(crease, 600, c); } },
      { cap: `Measure both halves: <b>35°</b> and <b>35°</b>. ${T('70^\\circ\\div2=35^\\circ')} ✓ The crease lies right on the bisector.`, run: async (c) => { await pop(c, h1); await pop(c, h2); await pop(c, box1); } }
    ];
  }
};

const bisectCompass = {
  title: 'Bisect an angle with a compass and straightedge',
  height: 410, minW: 960,
  choices: [{ v: 'key', label: 'Bisect ∠ABC (the steps)' }, { sep: 'Example 4 check:' }, { v: 'ex4', label: 'Bisect ∠JKL' }],
  ask: (v) => (v === 'ex4' ? `Example 4: bisect ${T('\\angle JKL')} with a compass and straightedge. What should each half be?` : `Bisect ${T('\\angle ABC')}: cut it into two equal angles.`),
  make(stage, v, ex) {
    const ox = (ex.W - 960) / 2;
    const list = v === 'ex4'
      ? bisectList({ V: [300, 362], a1: 10, span: 70, len: 320, r1: 140, r2: 140, names: ['J', 'K', 'L'], lab: null,
        last: `(b) Measure the two halves: ${T('70^\\circ\\div2=35^\\circ')}. Both are <b>35°</b> ✓` })
      : bisectList({ V: [300, 362], a1: 0, span: 64, len: 330, r1: 160, r2: 160, names: ['A', 'B', 'C'], lab: ['P', 'Q', 'D'],
        last: `Ray ${T('BD')} bisects ${T('\\angle ABC')}: ${T('\\angle ABD=\\angle DBC')} = 64° ÷ 2 = <b>32°</b>.` });
    return Geo.construct(stage, list, { x: ox, y: 0, width: 960, height: 410 }).steps;
  }
};

/* ---------- halves and wholes (Full notes; Example 3) ---------- */
const HALF = { a: { w: 90 }, b: { w: 128 }, c: { w: 75 }, d: { w: 180 }, e: { half: 34 }, f: { half: 81.5 } };
const halver = {
  title: 'Halves and wholes',
  height: 330, minW: 960,
  choices: [{ sep: 'Example 3 check:' }, ...Object.keys(HALF).map((k) => ({ v: k, label: `(${k}) ${HALF[k].w ? 'whole ' + HALF[k].w + '°' : 'half ' + HALF[k].half + '°'}` }))],
  ask: (k) => { const q = HALF[k]; return q.w ? `Example 3(${k}): a ${q.w}° angle is bisected. How big is each half?` : `Example 3(${k}): each half of a bisected angle is ${fmt(q.half)}°. How big was the whole angle?`; },
  make(stage, k, ex) {
    const q = HALF[k], whole = q.w || q.half * 2, hv = whole / 2, ox = (ex.W - 960) / 2, svg = stageSvg(stage, ex.W, 330), g = svgEl('g', { transform: `translate(${ox} 0)` }, svg);
    const V = [whole > 150 ? 320 : 220, 290], len = 220, w1 = hide(svgEl('path', { d: wedgeD(V, 120, 0, hv), fill: BLUE, 'fill-opacity': 0.2 }, g)), w2 = hide(svgEl('path', { d: wedgeD(V, 120, hv, hv), fill: GREEN, 'fill-opacity': 0.2 }, g));
    const armA = seg(g, V, at(V, 0, len), { width: 3.4 }), armB = seg(g, V, at(V, whole, len), { width: 3.4 }), bis = seg(g, V, at(V, hv, len), { width: 3, dash: '10 7', color: PURPLE });
    gdot(g, V);
    const right = Math.abs(hv - 90) < 0.01;
    const m1 = hide(mark(g, V, 0, hv, 62, deg(hv), BLUE, { arc: !right })), m2 = hide(mark(g, V, hv, hv, 76, deg(hv), GREEN, { arc: !right }));
    const mW = hide(mark(g, V, 0, whole, 138, deg(whole), INK, { arc: true, lr: 166, size: 22 }));
    const line = hide(res(stage, q.w ? `${T(`${whole}^\\circ\\div2=${fmt(hv)}^\\circ`)}` : `${T(`${fmt(hv)}^\\circ\\times2=${fmt(whole)}^\\circ`)}`, ox + 640, 120, 300, 'u5l5-big'));
    if (q.w) {
      hide(bis);
      return [
        { cap: `The whole angle is <b>${whole}°</b>.`, run: async (c) => { await op(c, w1, 1); await op(c, w2, 1); await pop(c, mW); } },
        { cap: 'The bisector cuts it into two <b>equal</b> halves.', run: async (c) => { await op(c, mW, 0, 250); bis.style.opacity = 1; await drawIn(bis, 600, c); } },
        { cap: `Each half = ${whole}° ÷ 2 = <b>${deg(hv)}</b>.${right ? ' Half a straight angle is a <b>right angle</b>!' : ''}`, run: async (c) => { await pop(c, m1); await pop(c, m2); await pop(c, line); } }
      ];
    }
    hide(armB, w2); bis.setAttribute('stroke-dasharray', '');
    const flipG = svgEl('g', {}, g); flipG.style.transformBox = 'view-box'; flipG.style.transformOrigin = '0 0';
    return [
      { cap: `One half is <b>${deg(hv)}</b>. The bisector is the line in the middle.`, run: async (c) => { await op(c, w1, 1); await pop(c, m1); } },
      { cap: 'The other half is a <b>mirror copy</b>: the same size, on the other side of the bisector.', run: async (c) => { await op(c, w2, 1, 500); await op(c, armB, 1, 400); await pop(c, m2); } },
      { cap: `The whole angle = ${deg(hv)} × 2 = <b>${deg(whole)}</b>.`, run: async (c) => { bis.setAttribute('stroke-dasharray', '10 7'); await pop(c, mW); await pop(c, line); } }
    ];
  }
};

/* ---------- perpendicular constructions (Example 5) ---------- */
const perp = {
  title: 'Construct a perpendicular',
  height: 420, minW: 960,
  choices: [{ v: 'pat', label: 'Through P on a line' }, { v: 'pb', label: 'Perpendicular bisector of AB' }, { sep: 'Example 5 check:' }, { v: 'ex5a', label: '(a) bisector of AB, 6 cm' }, { v: 'ex5b', label: '(b) through P, ⊥ to n' }],
  ask: (v) => ({ pat: `Draw a line through ${T('P')} that is perpendicular to the line.`, pb: `Construct the perpendicular bisector of segment ${T('AB')}.`,
    ex5a: `Example 5(a): construct the perpendicular bisector of ${T('AB')} (6 cm). Label the midpoint ${T('M')}. Measure ${T('AM')} and ${T('MB')}.`,
    ex5b: `Example 5(b): construct a line through ${T('P')} that is perpendicular to line ${T('n')}.` })[v],
  make(stage, v, ex) {
    const ox = (ex.W - 960) / 2;
    let list;
    if (v === 'pat') list = perpAtList({ a: [80, 340], b: [880, 340], p: [480, 340], r1: 130, r2: 215, ext: 90 });
    else if (v === 'pb') list = perpBisList({ a: [250, 210], b: [710, 210], r: 270 });
    else if (v === 'ex5a') list = perpBisList({ a: [270, 210], b: [690, 210], r: 266, cm: 70 });
    else { const A = [140, 390], Pp = at(A, 15, 330); list = perpAtList({ a: A, b: at(A, 15, 680), p: Pp, r1: 120, r2: 200, ext: 70, lineName: 'n',
      last: `<b>4.</b> Draw the line through <b>P</b> and the crossing. Measure: it meets ${T('n')} at <b>90°</b> ✓` }); }
    return Geo.construct(stage, list, { x: ox, y: 0, width: 960, height: 420 }).steps;
  }
};

/* ---------- Mateo's table leg (Example 6) ---------- */
const post = {
  title: 'Is the table leg perpendicular?',
  height: 430, minW: 960,
  ask: `Example 6: a table leg makes ${T('92.5^\\circ')} with the underside of the tabletop.`,
  make(stage, v, ex) {
    const ox = (ex.W - 960) / 2, svg = stageSvg(stage, ex.W, 430), g = svgEl('g', { transform: `translate(${ox} 0)` }, svg);
    gtext(g, 300, 22, 'Check 1: front to back', { size: 19, color: '#5a6170' });
    const top = (x, y, w) => svgEl('rect', { x, y, width: w, height: 26, rx: 4, fill: WOOD, stroke: WOOD2, 'stroke-width': 2.5 }, g);
    top(70, 62, 470); svgEl('path', { d: 'M40 404 H590', stroke: '#9aa0ab', 'stroke-width': 3 }, g);
    const A = [150, 88], LEN = 300;
    const legG = svgEl('g', {}, g);
    const leg = svgEl('path', { d: '', stroke: WOOD2, 'stroke-width': 22, 'stroke-linecap': 'butt', fill: 'none' }, legG);
    const legC = svgEl('path', { d: '', stroke: INK, 'stroke-width': 2, fill: 'none' }, legG);
    seg(g, [460, 88], [460, 388], { color: WOOD2, width: 22, cap: 'butt', cls: '' });
    const setLeg = (d) => { const E = at(A, d, LEN); leg.setAttribute('d', `M${P2(A)}L${P2(E)}`); legC.setAttribute('d', `M${P2(A)}L${P2(E)}`); };
    setLeg(-92.5);
    const guide = hide(svgEl('g', {}, g));
    seg(guide, A, at(A, -90, 250), { color: RED, width: 2.4, dash: '8 6', cls: '' }); square(guide, A, -90, 0, 22, RED);
    gtext(guide, A[0] + 54, A[1] + 120, '90°', { size: 18, color: RED });
    const gap = hide(svgEl('g', {}, g));
    svgEl('path', { d: wedgeD(A, 250, -92.5, 2.5), fill: AMBER, 'fill-opacity': 0.75 }, gap);
    seg(gap, at(A, -91.2, 238), [A[0] - 60, A[1] + 270], { color: AMBER, width: 2, cls: '' }); gtext(gap, A[0] - 66, A[1] + 290, '2.5°', { size: 20, color: AMBER });
    const mR = hide(mark(g, A, -92.5, 92.5, 44, '92.5°', BLUE, { arc: true, lr: 82 }));
    const mL = hide(mark(g, A, 180, 87.5, 34, '87.5°', GREEN, { arc: true, lr: 74 }));
    const f1 = hide(mark(g, A, -90, 90, 30, '90°', GREEN, { lr: 58 })), f2 = hide(mark(g, A, 180, 90, 30, '90°', GREEN, { lr: 58 }));
    const no = hide(stamp(stage, 'not ⊥', { ok: false, x: ox + 470, y: 230 }));
    const c1 = hide(res(stage, T('92.5^\\circ-90^\\circ=2.5^\\circ'), ox + 610, 60, 330)), c2 = hide(res(stage, T('180^\\circ-92.5^\\circ=87.5^\\circ'), ox + 610, 118, 330));
    // the side view (Check 2)
    const side = hide(svgEl('g', {}, g));
    gtext(side, 800, 196, 'Check 2: side to side', { size: 19, color: '#5a6170' });
    svgEl('rect', { x: 690, y: 226, width: 220, height: 24, rx: 4, fill: WOOD, stroke: WOOD2, 'stroke-width': 2.5 }, side);
    svgEl('path', { d: 'M660 404 H940', stroke: '#9aa0ab', 'stroke-width': 3 }, side);
    const B = [730, 250], leg2 = svgEl('path', { d: '', stroke: WOOD2, 'stroke-width': 22, fill: 'none' }, side), g2 = seg(side, B, at(B, -90, 150), { color: RED, width: 2.4, dash: '8 6', cls: '' });
    const setLeg2 = (d) => leg2.setAttribute('d', `M${P2(B)}L${P2(at(B, d, 154))}`); setLeg2(-97);
    const no2 = hide(stamp(stage, 'leans!', { ok: false, x: ox + 850, y: 330, size: 'sm' })), yes = hide(stamp(stage, '⊥ both ways ✓', { ok: true, x: ox + 820, y: 320, size: 'sm' }));
    return [
      { cap: 'Mateo’s leg makes <b>92.5°</b> with the underside of the tabletop.', run: (c) => pop(c, mR) },
      { cap: '(a) Hold a carpenter’s square in the corner. Perpendicular means <b>exactly 90°</b>: 92.5° is not 90°.', run: async (c) => { await op(c, guide, 1); await stampIn(c, no); } },
      { cap: '(b) The gap is 92.5° − 90° = <b>2.5°</b>. He must move the leg 2.5°.', run: async (c) => { await op(c, gap, 1); await pop(c, c1); } },
      { cap: '(c) The two angles sit on a straight line (180°): 180° − 92.5° = <b>87.5°</b>.', run: async (c) => { await pop(c, mL); await pop(c, c2); } },
      { cap: 'He moves the leg 2.5°. Now it fits the square: <b>90°</b> on both sides.', run: async (c) => { await Promise.all([op(c, mR, 0, 250), op(c, mL, 0, 250), op(c, gap, 0, 250), op(c, no, 0, 250)]); await tween(c, 1000, (t) => setLeg(-92.5 + 2.5 * t)); await pop(c, f1); await pop(c, f2); } },
      { cap: '(d) That checked one direction. Turn the table a quarter turn: from the side, the leg can still <b>lean</b>!', run: async (c) => { await op(c, side, 1, 500); await stampIn(c, no2); } },
      { cap: 'The tabletop is a flat surface, so check <b>both directions</b>. Fix the lean: now the leg is perpendicular to the tabletop.', run: async (c) => { await op(c, no2, 0, 200); await tween(c, 900, (t) => setLeg2(-97 + 7 * t)); await stampIn(c, yes); } }
    ];
  }
};

/* ---------- sort the lines (Example 7) ---------- */
const PAIRS = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [4, 5]];
const sortLines = {
  title: 'Parallel, perpendicular or neither?',
  height: 430, minW: 960,
  choices: [{ sep: 'Example 7 check:' }, ...PAIRS.map(([a, b]) => ({ v: a + '-' + b, label: `ℓ${SUB[a]} and ℓ${SUB[b]}` }))],
  ask: (v) => { const [a, b] = v.split('-').map(Number); return `Example 7: sort ${T(`\\ell_${a}`)} and ${T(`\\ell_${b}`)} as parallel, perpendicular or neither. Give a reason.`; },
  make(stage, v, ex) {
    const [k, m] = v.split('-').map(Number), ox = (ex.W - 960) / 2, svg = stageSvg(stage, ex.W, 430), g = svgEl('g', { transform: `translate(${ox} 0)` }, svg);
    const Lx = drawLines(g, LX.s, 0, 20), others = [1, 2, 3, 4, 5].filter((i) => i !== k && i !== m);
    const X = meet(k, m), cols = { [k]: BLUE, [m]: GREEN };
    const ext = svgEl('g', {}, g), meas = hide(svgEl('g', {}, g));
    const px = (p) => toPx(p, 0, 20);
    let kind, ang = 0, needExt = false;
    if (!X) {
      kind = 'parallel';
      [k, m].forEach((i) => { const l = LINES[i], a = l.p, b = lineEnd(i), u = [Math.cos(l.d * Math.PI / 180), Math.sin(l.d * Math.PI / 180)];
        hide(seg(ext, px(a), px([a[0] - u[0] * 0.35, a[1] - u[1] * 0.35]), { color: cols[i], width: 3, dash: '8 7' }));
        hide(seg(ext, px(b), px([b[0] + u[0] * 0.2, b[1] + u[1] * 0.2]), { color: cols[i], width: 3, dash: '8 7' })); });
      // the gap, straight across, in two places
      const n = [Math.cos((LINES[k].d - 90) * Math.PI / 180), Math.sin((LINES[k].d - 90) * Math.PI / 180)], A = LINES[k];
      const gapU = (LINES[m].p[0] - A.p[0]) * n[0] + (LINES[m].p[1] - A.p[1]) * n[1];
      [1.2, 3.6].forEach((s) => { const p = [A.p[0] + s * Math.cos(A.d * Math.PI / 180), A.p[1] + s * Math.sin(A.d * Math.PI / 180)], q = [p[0] + gapU * n[0], p[1] + gapU * n[1]];
        const a = px(p), b = px(q); seg(meas, a, b, { color: AMBER, width: 3 }); const dd = at([0, 0], dirTo(a, b), 1);
        [[a, -1], [b, 1]].forEach(([e, sg]) => svgEl('path', { d: `M${P2(e)}l${(-sg * dd[0] * 12 + dd[1] * 7).toFixed(1)} ${(-sg * dd[1] * 12 - dd[0] * 7).toFixed(1)}M${P2(e)}l${(-sg * dd[0] * 12 - dd[1] * 7).toFixed(1)} ${(-sg * dd[1] * 12 + dd[0] * 7).toFixed(1)}`, stroke: AMBER, 'stroke-width': 3, fill: 'none' }, meas));
        const mpt = at([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], LINES[k].d, 18); gtext(meas, mpt[0], mpt[1], 'same', { size: 17, color: AMBER }); });
    } else {
      const d = Math.abs(((LINES[m].d - LINES[k].d) % 180 + 180) % 180); ang = Math.min(d, 180 - d);
      kind = Math.abs(ang - 90) < 0.01 ? 'perpendicular' : 'neither';
      [[k, X.s], [m, X.t]].forEach(([i, s]) => { const l = LINES[i]; if (s < -0.02 || s > l.L + 0.02) { needExt = true; const from = s < 0 ? l.p : lineEnd(i), u = [Math.cos(l.d * Math.PI / 180), Math.sin(l.d * Math.PI / 180)], sg = s < 0 ? -1 : 1, over = 0.35;
        const to = [X.pt[0] + sg * u[0] * over, X.pt[1] + sg * u[1] * over]; hide(seg(ext, px(from), px(to), { color: cols[i], width: 3, dash: '8 7' })); } });
      const V = px(X.pt), midDir = (i) => { const a = LINES[i].p, b = lineEnd(i); return dirTo(V, px([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2])); };
      let a0 = midDir(k), sp = ((midDir(m) - a0) % 360 + 360) % 360;
      if (sp > 180) { a0 = midDir(m); sp = 360 - sp; }
      meas.appendChild(mark(meas, V, a0, sp, 30, deg(sp), RED, { size: 20, lr: Math.abs(sp - 90) < 0.01 ? 50 : 56, arc: Math.abs(sp - 90) > 0.01 }));
      if (kind === 'neither') meas.appendChild(mark(meas, V, a0 + sp, 180 - sp, 22, deg(180 - sp), PURPLE, { size: 18, arc: true, lr: 50 }));
      gdot(meas, V, { r: 5, color: RED });
    }
    [k, m].forEach((i) => { Lx[i].ln.setAttribute('stroke', cols[i]); Lx[i].ln.setAttribute('stroke-width', 4.4); Lx[i].t.setAttribute('fill', cols[i]); });
    [...ext.children].forEach((e) => hide(e));
    const lk = T(`\\ell_${k}`), lm = T(`\\ell_${m}`);
    const verdict = hide(stamp(stage, kind, { ok: kind === 'neither' ? null : true, x: ox + 800, y: 170 }));
    const why = kind === 'parallel' ? 'never meet; same gap' : kind === 'perpendicular' ? (needExt ? `extend ${T('\\ell_5')}: meet at 90°` : 'meet at 90°') : `meet at ${deg(ang)} (and ${deg(180 - ang)})`;
    const reason = hide(res(stage, `<b>Reason:</b> ${why}`, ox + 650, 250, 300));
    return [
      { cap: `Look at ${lk} and ${lm} only.`, run: (c) => Promise.all(others.map((i) => op(c, Lx[i].g, 0.15, 400))) },
      { cap: kind === 'parallel' ? 'Do they meet? Extend both with a ruler: they <b>never meet</b>.' : needExt ? 'They don’t touch on the page. A line goes on forever: <b>extend</b> it with a ruler. They meet!' : 'Do they meet? Yes, they cross on the page.',
        run: (c) => Promise.all([...ext.children].map((e) => op(c, e, 1, 600))) },
      { cap: kind === 'parallel' ? 'Measure the gap straight across in two places: it’s the <b>same</b> both times.' : `Measure the angle where they meet: <b>${deg(ang)}</b>${kind === 'neither' ? ` (and ${deg(180 - ang)} beside it)` : ''}.`, run: (c) => op(c, meas, 1, 500) },
      { cap: kind === 'parallel' ? `${lk} and ${lm} are <b>parallel</b>: never meet, same gap.` : kind === 'perpendicular' ? `90° → <b>perpendicular</b>.` : `${deg(ang)} is not 90° → <b>neither</b>.`, run: async (c) => { await stampIn(c, verdict); await pop(c, reason); } }
    ];
  }
};

/* ---------- mitre cuts and a gate brace (Example 8) ---------- */
function frame(g, n, C, Ro, wB, rot0) {
  let O, I;
  if (n === 4) {   // a rectangle W × H (Ro = W, rot0 = H): corners TR, TL, BL, BR (counterclockwise), boards wB wide
    const W = Ro, H = rot0, x0 = C[0] - W / 2, x1 = C[0] + W / 2, y0 = C[1] - H / 2, y1 = C[1] + H / 2;
    const oc = [[x1, y0], [x0, y0], [x0, y1], [x1, y1]], ic = [[x1 - wB, y0 + wB], [x0 + wB, y0 + wB], [x0 + wB, y1 - wB], [x1 - wB, y1 - wB]];
    O = (i) => oc[((i % 4) + 4) % 4]; I = (i) => ic[((i % 4) + 4) % 4];
  } else {
    const ap = Ro * Math.cos(Math.PI / n), Ri = (ap - wB) / Math.cos(Math.PI / n), th0 = (i) => rot0 + i * 360 / n;
    O = (i) => at(C, th0(i), Ro); I = (i) => at(C, th0(i), Ri);
  }
  const th = (i) => dirTo(I(i), O(i));   // the joint direction, pointing out of the corner
  const boards = [];
  for (let i = 0; i < n; i++) {
    const bg = svgEl('g', {}, g); bg.style.transformBox = 'view-box'; bg.style.transformOrigin = '0 0';
    svgEl('path', { d: `M${[O(i), O(i + 1), I(i + 1), I(i)].map(P2).join('L')}Z`, fill: i % 2 ? '#e2c393' : '#d7b07a', stroke: WOOD2, 'stroke-width': 2.4, 'stroke-linejoin': 'round' }, bg);
    const m = [(O(i)[0] + O(i + 1)[0]) / 2, (O(i)[1] + O(i + 1)[1]) / 2];
    boards.push({ g: bg, dir: dirTo(C, m) });
  }
  const slide = (d) => boards.forEach((b) => { const u = at([0, 0], b.dir, d); b.g.setAttribute('transform', `translate(${u[0].toFixed(1)} ${u[1].toFixed(1)})`); });
  return { O, I, th, boards, slide };
}
function sawPanel(g, x, y, setting, cut) {
  const P = hide(svgEl('g', {}, g));
  gtext(P, x + 150, y, 'Mitre saw, from above', { size: 17, color: '#5a6170' });
  svgEl('rect', { x: x, y: y + 96, width: 300, height: 44, fill: '#e2c393', stroke: WOOD2, 'stroke-width': 2 }, P);
  const V = [x + 160, y + 96];
  seg(P, at(V, -90, 50), at(V, 90, 76), { color: '#5a6170', width: 2.4, dash: '7 6', cls: '' });
  gtext(P, V[0] - 52, y + 22, 'square cut', { size: 15, color: '#5a6170' });
  const blade = seg(P, V, V, { color: RED, width: 4, cls: '' }), ms = svgEl('g', {}, P), mc = svgEl('g', {}, P);
  const set = (s) => {
    const d = 90 - s; blade.setAttribute('d', `M${P2(at(V, d + 180, 52))}L${P2(at(V, d, 80))}`);
    ms.innerHTML = ''; mc.innerHTML = '';
    if (s > 0.5) { arcP(ms, V, 60, d, s, { color: PURPLE }); const p = at(V, d + s / 2, 78); gtext(ms, p[0], p[1], deg(s), { size: 18, color: PURPLE }); }
    arcP(mc, V, 34, 0, d, { color: BLUE }); const q = at(V, d / 2, 54); gtext(mc, q[0], q[1], deg(d), { size: 18, color: BLUE });
  };
  set(0);
  return { P, set, setting, cut };
}
const MITRE = { sq: 'Example 8(a): Ava’s rectangular picture frame. At what angle does she cut each end?', hex: 'Example 8(b): Jonah’s regular hexagon mirror frame. Find the corner angle, the cut angle and the saw setting.', gate: 'Example 8(c): a square gate with a brace from the bottom hinge corner to the top latch corner. What angle does the brace make with the top rail?' };
const mitre = {
  title: 'Mitre cuts: each cut is half the corner',
  height: 430, minW: 960,
  choices: [{ sep: 'Example 8 check:' }, { v: 'sq', label: '(a) Square frame' }, { v: 'hex', label: '(b) Hexagon frame' }, { v: 'gate', label: '(c) Gate brace' }],
  ask: (v) => MITRE[v],
  make(stage, v, ex) {
    const ox = (ex.W - 960) / 2, svg = stageSvg(stage, ex.W, 430), g = svgEl('g', { transform: `translate(${ox} 0)` }, svg);
    const C = [250, 220];
    const lines = [], line = (html, y) => { const e = hide(res(stage, html, ox + 560, y, 380)); lines.push(e); return e; };
    if (v === 'gate') {
      const x0 = 80, y0 = 40, s = 340, w = 30, rail = (x, y, ww, hh) => svgEl('rect', { x, y, width: ww, height: hh, fill: '#d7b07a', stroke: WOOD2, 'stroke-width': 2.4 }, g);
      rail(x0, y0, s, w); rail(x0, y0 + s - w, s, w); rail(x0, y0, w, s); rail(x0 + s - w, y0, w, s);
      [[x0 - 14, y0 + 50], [x0 - 14, y0 + s - 80]].forEach(([x, y]) => svgEl('rect', { x, y, width: 16, height: 30, rx: 3, fill: '#5a6170' }, g));
      gtext(g, x0 - 8, y0 + s + 22, 'hinge', { size: 16, color: '#5a6170' }); gtext(g, x0 + s + 2, y0 - 16, 'latch', { size: 16, color: '#5a6170' });
      const Hc = [x0 + w, y0 + s - w], Lc = [x0 + s - w, y0 + w];
      const brace = hide(svgEl('path', { d: `M${P2(Hc)}L${P2(Lc)}`, stroke: '#b98a55', 'stroke-width': 24, 'stroke-linecap': 'butt' }, g));
      const bl = hide(seg(g, Hc, Lc, { color: WOOD2, width: 2 }));
      const mA = hide(mark(g, Lc, 180, 45, 66, '45°', BLUE, { arc: true })), mB = hide(mark(g, Lc, 225, 45, 80, '45°', GREEN, { arc: true }));
      const corner = hide(mark(g, Lc, 180, 90, 22, '', RED));
      line(`Corner of a square: <b>90°</b>`, 70); line(`Corner to corner <b>bisects</b> it`, 130); line(T('90^\\circ\\div2=45^\\circ'), 190);
      return [
        { cap: 'A square gate. Without a brace, it sags.', run: (c) => pop(c, corner) },
        { cap: 'Nail a brace from the bottom <b>hinge</b> corner to the top <b>latch</b> corner.', run: async (c) => { await op(c, brace, 1, 500); await op(c, bl, 1); await pop(c, lines[0]); } },
        { cap: 'In a square, the corner-to-corner line <b>bisects</b> the 90° corner.', run: async (c) => { await pop(c, mA); await pop(c, mB); await pop(c, lines[1]); } },
        { cap: 'So the brace makes 90° ÷ 2 = <b>45°</b> with the top rail.', run: async (c) => { await pop(c, lines[2]); await pulse(c, mA, 1.15); } }
      ];
    }
    const n = v === 'hex' ? 6 : 4, F = n === 4 ? frame(g, 4, C, 400, 46, 280) : frame(g, 6, C, 190, 46, 0);
    F.slide(70);
    const k = n === 4 ? 1 : 2, Ok = F.O(k), Ik = F.I(k), th = F.th(k);
    const dNext = dirTo(Ok, F.O(k + 1)), cornerA = n === 4 ? 90 : 120, cut = cornerA / 2, setting = 90 - cut;
    const corner = hide(mark(g, Ok, dNext, cornerA, 40, deg(cornerA), RED, { arc: true, lr: 64 }));
    const joint = hide(seg(g, at(Ok, th, 26), at(Ik, th + 180, 24), { color: AMBER, width: 5 }));
    const hA = hide(mark(g, Ok, dNext, cut, 58, deg(cut), BLUE, { arc: true, lr: 82, size: 19 })), hB = hide(mark(g, Ok, dNext + cut, cut, 72, deg(cut), GREEN, { arc: true, lr: 96, size: 19 }));
    const saw = sawPanel(g, 600, 250, setting, cut);
    if (n === 4) { line(`Corner of a rectangle: <b>90°</b>`, 40); line(`Cut ${T('=90^\\circ\\div2=45^\\circ')}`, 98); line(`Saw setting ${T('=90^\\circ-45^\\circ=45^\\circ')}`, 156); }
    else { line(`Sum ${T('=(6-2)\\times180^\\circ=720^\\circ')}`, 30); line(`Corner ${T('=720^\\circ\\div6=120^\\circ')}`, 80); line(`Cut ${T('=120^\\circ\\div2=60^\\circ')}`, 130); line(`Saw setting ${T('=90^\\circ-60^\\circ=30^\\circ')}`, 180); }
    const steps = [
      { cap: n === 4 ? 'Ava’s frame: 4 boards. Each end is cut on an angle so the corners close up tight.' : 'Jonah’s mirror frame: a regular hexagon, <b>6</b> boards with angled ends.',
        run: (c) => tween(c, 1200, (t) => F.slide(70 * (1 - t))) },
      n === 4 ? { cap: 'Every corner of a rectangle is <b>90°</b>.', run: async (c) => { await pop(c, corner); await pop(c, lines[0]); } }
        : { cap: `Corner first (Lesson 3): angle sum = (6 − 2) × 180° = 720°, so one corner = 720° ÷ 6 = <b>120°</b>.`, run: async (c) => { await pop(c, lines[0]); await pop(c, corner); await pop(c, lines[1]); } },
      { cap: `The joint line <b>bisects</b> the corner, so each board’s cut is ${cornerA}° ÷ 2 = <b>${deg(cut)}</b>.`, run: async (c) => { await op(c, joint, 1, 400); await op(c, corner, 0.25, 250); await pop(c, hA); await pop(c, hB); await pop(c, lines[n === 4 ? 1 : 2]); } },
      { cap: `On the mitre saw, turn the blade away from a square cut: setting = 90° − ${deg(cut)} = <b>${deg(setting)}</b>.`, run: async (c) => { await op(c, saw.P, 1, 400); await tween(c, 1200, (t) => saw.set(setting * t)); await pop(c, lines[lines.length - 1]); } }
    ];
    return steps;
  }
};

mountExplainers({ copyCompass, whyCopy, copyProt, fold, bisectCompass, halver, perp, post, sortLines, mitre });
statics();

/* ======================================================================================
 * Math History: halves are easy, thirds are impossible (Wantzel, 1837)
 * ====================================================================================== */
function histAnim() {
  const svg = document.getElementById('u5l5-hist'); if (!svg) return;
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let run = 0;
  const NS = 'http://www.w3.org/2000/svg';
  const el = (tag, attrs, parent = svg) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent.appendChild(e); return e; };
  const V = [70, 270], LEN = 300, A = 60;
  function draw(final) {
    const my = ++run, c = liveCtx(), alive = () => my === run;
    svg.innerHTML = '';
    el('rect', { x: 0, y: 0, width: 600, height: 300, fill: '#fffaf1' });
    const ray = (d, o = {}) => { const E = at(V, d, o.len || LEN); return el('path', { d: `M${P2(V)}L${P2(E)}`, stroke: o.color || '#4a2c14', 'stroke-width': o.w || 4, 'stroke-linecap': 'round', 'stroke-dasharray': o.dash || '', fill: 'none' }); };
    ray(0); ray(A);
    el('circle', { cx: V[0], cy: V[1], r: 5, fill: '#4a2c14' });
    const txt = (x, y, s, o = {}) => { const t = el('text', { x, y, 'font-family': 'Georgia, serif', 'font-size': o.size || 26, 'font-weight': o.weight || 700, fill: o.color || '#4a2c14', 'text-anchor': o.anchor || 'start' }); t.textContent = s; return t; };
    const half = el('g', {}); const r30 = ray(30, { color: '#b07a12', w: 3.5 }); half.appendChild(r30);
    const t2 = txt(400, 80, '÷ 2  ✓', { color: '#b07a12' }), t2b = txt(400, 104, 'Euclid, c. 300 BCE', { size: 16, weight: 400 });
    const q = el('g', {}); [15, 45].forEach((d) => q.appendChild(ray(d, { color: '#7a4a26', w: 2.5 })));
    const t4 = txt(400, 146, '÷ 4  ✓', { color: '#7a4a26' });
    const tri = el('g', {}); const tr = [20, 40].map((d) => ray(d, { color: '#a33a2a', w: 3, dash: '9 8' })); tr.forEach((r) => tri.appendChild(r));
    const t3 = txt(400, 196, '÷ 3  ?', { color: '#a33a2a' });
    const st = el('g', { transform: 'rotate(-8 470 250)' });
    el('rect', { x: 372, y: 222, width: 200, height: 54, rx: 8, fill: 'none', stroke: '#a33a2a', 'stroke-width': 4 }, st);
    const s1 = el('text', { x: 472, y: 248, 'font-family': 'Georgia, serif', 'font-size': 21, 'font-weight': 800, fill: '#a33a2a', 'text-anchor': 'middle' }, st); s1.textContent = 'IMPOSSIBLE';
    const s2 = el('text', { x: 472, y: 268, 'font-family': 'Georgia, serif', 'font-size': 15, fill: '#a33a2a', 'text-anchor': 'middle' }, st); s2.textContent = 'Wantzel, 1837';
    const all = [half, t2, t2b, q, t4, tri, t3, st];
    if (final) { tri.style.opacity = 1; return; }
    all.forEach((e) => (e.style.opacity = 0));
    (async () => {
      const show = async (e, ms = 600) => { if (!alive()) return; await c.anim(e, [{ opacity: 0 }, { opacity: 1 }], ms); };
      await c.sleep(400); await show(half, 900); await show(t2); await show(t2b, 400); await c.sleep(900);
      await show(q, 800); await show(t4); await c.sleep(1100);
      if (!alive()) return; await c.anim(q, [{ opacity: 1 }, { opacity: 0.15 }], 500); await c.anim(half, [{ opacity: 1 }, { opacity: 0.15 }], 500);
      await show(tri, 500); await show(t3, 400);
      for (let i = 0; i < 3 && alive(); i++) { await c.anim(tri, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(-3deg)' }, { transform: 'rotate(3deg)' }, { transform: 'rotate(0deg)' }], 900); }
      if (!alive()) return; await c.anim(st, [{ opacity: 0 }, { opacity: 1 }], 400);
    })();
  }
  const finalPic = () => { draw(true); svg.querySelectorAll('g, text').forEach((e) => (e.style.opacity = 1)); };
  const play = () => (reduce ? finalPic() : draw(false));
  finalPic();
  const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); play(); } }, { threshold: 0.5 });
  io.observe(svg);
  svg.addEventListener('click', play);
  const btn = svg.closest('.hist-anim') && svg.closest('.hist-anim').querySelector('.hist-play'); if (btn) btn.addEventListener('click', play);
}
histAnim();

/* ======================================================================================
 * Stand Up Break
 * ====================================================================================== */
standup('u5l5', {
  intro: 'Write every step. Divide by 2 to find a half; multiply by 2 to find the whole. Write ° on every angle.',
  levels: {
    BEG: (r) => {
      const w = r.pick([r.int(11, 89) * 2, r.int(20, 85) * 2 + 1]);
      return { text: 'An angle is bisected. How big is each half?', q: `\\text{whole angle} = ${w}^\\circ`, a: [`${w}^\\circ\\div2=${fmt(w / 2)}^\\circ`] };
    },
    PRG: (r) => r.pick([
      () => { const hv = r.int(12, 88) + r.pick([0, 0.5]); return { text: 'An angle is bisected. Each half measures:', q: `${fmt(hv)}^\\circ`, a: [`\\text{whole} = ${fmt(hv)}^\\circ\\times2=${fmt(hv * 2)}^\\circ`] }; },
      () => { const s = r.int(6, 40); return { text: `An angle is bisected. Then one half is bisected again. The smallest angle is <b>${s}°</b>. How big was the first angle?`, q: '', a: [`\\text{work backward: }${s}^\\circ\\times2=${2 * s}^\\circ`, `${2 * s}^\\circ\\times2=${4 * s}^\\circ`] }; }
    ])(),
    MAS: (r) => {
      const off = r.pick([0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4.5, 6]) * r.sign(), a = 90 + off;
      const thing = r.pick(['A shelf bracket meets the wall', 'A sign post meets the sidewalk', 'A door frame meets the floor']);
      return { text: `${thing} at <b>${fmt(a)}°</b> on one side. (a) What is the angle on the other side? (b) How many degrees is it away from perpendicular?`, q: '',
        a: [`\\text{(a) straight angle: }180^\\circ-${fmt(a)}^\\circ=${fmt(180 - a)}^\\circ`, `\\text{(b) }${fmt(Math.max(a, 90))}^\\circ-${fmt(Math.min(a, 90))}^\\circ=${fmt(Math.abs(off))}^\\circ`] };
    }
  }
});
