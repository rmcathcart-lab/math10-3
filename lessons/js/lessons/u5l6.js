/* Math 10-3 · Unit 5 · Lesson 6 — Angle Partners: Complementary, Supplementary and Opposite Angles.
 * Explainers (Class view unless marked Full): the three adjacent tests (Example 1 checks), a ray turning on a straight
 * line / in a square corner (the sum stays 180° / 90°; drag the dot), partners that don't touch (Full: an angle slides
 * over to its partner), fill the corner / fill the straight line (Example 2 and 3 checks), complementary, supplementary
 * or neither (corner and straight-edge templates, verdict stamp; Example 4), the 4-step missing angle (Example 5),
 * scissors that open and close (vertically opposite angles stay equal; Example 9(a)), why they are equal (Full), a full
 * turn and angles around a point (ceiling fan, reflex; Example 7), and one angle at a time with reasons (Examples 6(d),
 * 8 and the pool ball of 9(b)).
 * Also the static figures, the protractor on Example 6 (lessons/js/geo.js) and the Stand Up Break. */
import { h, add, box, tex, svgEl, tween, stamp, stampIn, mountExplainers, arrowHead } from '../blocks.js';
import { Geo } from '../geo.js';
import { standup } from '../standup.js';

const { arcD, wedgeD, n360, n180, dirTo, svgPoint } = Geo;
const P = Geo.at;                                   // P(V, deg, r): the point r from V in direction deg (math degrees)
const T = (s) => tex(String(s));
const DG = (v) => `${v}^\\circ`;
const BRNSOFT = '#d9b98a';
const INK = '#1c2230', RED = '#c93a33', BLUE = '#1f5bd6', GRN = '#12805a', PUR = '#7b4fc4', AMB = '#d08a12', GREY = '#8a8f9a';
const f2 = (v) => +v.toFixed(2);
const M = (A, B) => `M${f2(A[0])} ${f2(A[1])}L${f2(B[0])} ${f2(B[1])}`;

/* ---------------- SVG pieces (math degrees, SVG px) ---------------- */
function seg(p, A, B, o = {}) { return svgEl('path', { d: M(A, B), stroke: o.color || INK, 'stroke-width': o.w || 3.2, 'stroke-linecap': o.cap || 'round', fill: 'none', 'stroke-dasharray': o.dash || null, 'stroke-opacity': o.op ?? null }, p); }
const rayP = (p, V, deg, len, o) => seg(p, V, P(V, deg, len), o);
const lineP = (p, V, deg, len, o) => seg(p, P(V, deg + 180, len), P(V, deg, len), o);
function arcP(p, V, a0, a1, r, o = {}) { return svgEl('path', { d: arcD(V, r, a0, a1 - a0), stroke: o.color || INK, 'stroke-width': o.w || 2.6, fill: 'none', 'stroke-linecap': 'round' }, p); }
function wedgeP(p, V, a0, a1, r, color, op = 0.22) { return svgEl('path', { d: wedgeD(V, r, a0, a1 - a0), fill: color, 'fill-opacity': op, stroke: 'none' }, p); }
function txt(p, x, y, s, o = {}) {
  const t = Geo.text(p, x, y, s, { size: o.size || 22, color: o.color || INK, italic: o.italic, weight: o.weight || 700, halo: o.halo });
  if (o.cls) t.classList.add(o.cls); return t;
}
const labAt = (p, V, deg, r, s, o = {}) => { const q = P(V, deg, r); return txt(p, q[0], q[1], s, o); };
/** an arc with a label just outside it (o.at: label direction, o.lr: label radius) */
function arcL(p, V, a0, a1, r, s, o = {}) {
  const a = arcP(p, V, a0, a1, r, o);
  const t = s == null ? null : labAt(p, V, o.at ?? (a0 + a1) / 2, o.lr ?? r + (o.size || 22) * 0.95, s, Object.assign({ italic: /^[a-z?]$/.test(s) }, o));
  return { a, t };
}
function rmark(p, V, dir, s = 18, o = {}) {
  const u = P([0, 0], dir, 1), v = P([0, 0], dir + 90, 1);
  return svgEl('path', { d: `M${f2(V[0] + u[0] * s)} ${f2(V[1] + u[1] * s)}L${f2(V[0] + (u[0] + v[0]) * s)} ${f2(V[1] + (u[1] + v[1]) * s)}L${f2(V[0] + v[0] * s)} ${f2(V[1] + v[1] * s)}`, stroke: o.color || INK, 'stroke-width': o.w || 2.4, fill: o.fill || 'none' }, p);
}
const vdot = (p, V, o = {}) => svgEl('circle', { cx: f2(V[0]), cy: f2(V[1]), r: o.r || 4.5, fill: o.color || INK }, p);
const grp = (p) => { const g = svgEl('g', {}, p); g.style.transformBox = 'view-box'; g.style.transformOrigin = '0 0'; return g; };
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const show = (c, el, ms = 380) => (el ? c.anim(el, [{ opacity: 0 }, { opacity: 1 }], ms) : Promise.resolve());
const showAll = (c, els, ms = 380) => Promise.all(els.filter(Boolean).map((e) => show(c, e, ms)));
const stageSvg = (stage, W, H) => { const s = add(stage, svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u5l6-svg' }), 0, 0); s.style.position = 'absolute'; return s; };
/** an HTML box (KaTeX welcome) at (x, y) */
const hb = (stage, html, x, y, w, hh, cls = '') => add(stage, box(h('div', 'u5l6-c ' + cls, `<div>${html}</div>`), w, hh), x, y);
const glow = (p, A, B, color = PUR) => seg(p, A, B, { color, w: 14, op: 0.3 });
/** grow a dot's radius (Test 1: the vertex) */
const pulseDot = (c, d, big = 13, base = 6) => tween(c, 700, (t) => d.setAttribute('r', f2(base + (big - base) * Math.sin(Math.PI * t) + (t > 0.5 ? 0 : 0))));

/* ======================================================================================
 * Static figures on the cards (answers that show with "Answer" have class u5l6-fa)
 * ====================================================================================== */
function fig(name, W, H, draw) {
  const host = document.querySelector(`.u5l6-fig[data-fig="${name}"]`); if (!host) return;
  host.style.width = W + 'px'; host.style.height = H + 'px';
  draw(svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}` }, host));
}
/** two adjacent angles drawn to scale, first arm along 0° (the booklet's \ufiveLsixPair) */
function pairFig(svg, V, a, b, len = 92) {
  rayP(svg, V, 0, len); rayP(svg, V, a, len); rayP(svg, V, a + b, len);
  arcL(svg, V, 0, a, 28, a + '°', { size: 17, lr: 50 }); arcL(svg, V, a, a + b, 40, b + '°', { size: 17, lr: 62 }); vdot(svg, V, { r: 3.5 });
}
function figures() {
  fig('names', 330, 210, (s) => {
    const V = [40, 178];
    rayP(s, V, 0, 250); rayP(s, V, 50, 215); arcL(s, V, 0, 50, 46, '1', { size: 20, lr: 68 }); vdot(s, V);
    txt(s, V[0] - 16, V[1] + 16, 'Q', { size: 22 }); txt(s, V[0] + 250, V[1] + 20, 'P', { size: 22 }); labAt(s, V, 50, 237, 'R', { size: 22 });
    txt(s, 205, 112, '∠PQR, ∠Q or ∠1', { size: 17, color: '#6e4a1c', weight: 700 });
  });
  const L = (s, x, y, t) => txt(s, x, y, t, { size: 19 });
  fig('e1a', 210, 195, (s) => {
    const V = [26, 168];
    rayP(s, V, 0, 165); rayP(s, V, 35, 150); rayP(s, V, 85, 140);
    arcL(s, V, 0, 35, 34, '1', { size: 19, lr: 54 }); arcL(s, V, 35, 85, 34, '2', { size: 19, lr: 54 }); vdot(s, V);
    L(s, V[0] - 12, V[1] + 16, 'Q'); L(s, V[0] + 165, V[1] + 17, 'P'); const S = P(V, 35, 166); L(s, S[0] + 4, S[1], 'S'); const R = P(V, 85, 154); L(s, R[0], R[1] - 2, 'R');
  });
  fig('e1b', 210, 195, (s) => {
    const V = [105, 98];
    lineP(s, V, 20, 88); lineP(s, V, 70, 88);
    arcL(s, V, 20, 70, 30, '1', { size: 19, lr: 50 }); arcL(s, V, 200, 250, 30, '2', { size: 19, lr: 50 }); vdot(s, V);
  });
  fig('e1c', 210, 195, (s) => {
    const A = [18, 165], B = [190, 165];
    seg(s, A, B); rayP(s, A, 60, 100); rayP(s, B, 110, 100);
    arcL(s, A, 0, 60, 26, '1', { size: 19, lr: 44 }); arcL(s, B, 110, 180, 26, '2', { size: 19, lr: 44 }); vdot(s, A); vdot(s, B);
  });
  fig('e1d', 210, 195, (s) => {
    const V = [26, 168];
    rayP(s, V, 0, 165); rayP(s, V, 30, 155); rayP(s, V, 75, 140);
    arcL(s, V, 0, 30, 34, '1', { size: 19, lr: 54 }); arcL(s, V, 0, 75, 72, '2', { size: 19, lr: 96, at: 54 }); vdot(s, V);
  });
  fig('cs', 760, 236, (s) => {
    const A = [70, 186];
    rayP(s, A, 0, 160); rayP(s, A, 90, 160); rayP(s, A, 30, 160); rmark(s, A, 0, 18);
    arcL(s, A, 0, 30, 58, '30°', { size: 19, lr: 88 }); arcL(s, A, 30, 90, 58, '60°', { size: 19, lr: 84 }); vdot(s, A);
    txt(s, 170, 220, 'complementary: 30° + 60° = 90°', { size: 18, weight: 600 });
    const B = [560, 186];
    lineP(s, B, 0, 175); rayP(s, B, 50, 160);
    arcL(s, B, 0, 50, 46, '50°', { size: 19, lr: 74 }); arcL(s, B, 50, 180, 46, '130°', { size: 19, lr: 78 }); vdot(s, B);
    txt(s, 560, 220, 'supplementary: 50° + 130° = 180°', { size: 18, weight: 600 });
  });
  fig('bike', 420, 190, (s) => {
    const V = [210, 150];
    svgEl('rect', { x: 20, y: 150, width: 380, height: 18, fill: '#e2ded5' }, s);
    lineP(s, V, 0, 190); rayP(s, V, 73, 140, { w: 4 });
    arcL(s, V, 0, 73, 42, '73°', { size: 19, lr: 70 }); arcL(s, V, 73, 180, 42, 'x', { size: 21, lr: 66 }); vdot(s, V);
    txt(s, 350, 180, 'sidewalk', { size: 15, weight: 600 }); const E = P(V, 73, 140); txt(s, E[0] + 50, E[1] + 6, 'bike path', { size: 15, weight: 600 });
  });
  fig('flag', 380, 240, (s) => {
    const V = [66, 162];
    for (let y = 22; y < 232; y += 12) seg(s, [50, y + 10], [62, y], { color: GREY, w: 1.6 });
    seg(s, [64, 18], [64, 232], { w: 3.4 });
    seg(s, V, [330, 162], { dash: '7 6', w: 2.4 }); rayP(s, V, 34, 240, { w: 5 });
    const E = P(V, 34, 240); svgEl('path', { d: `M${f2(E[0])} ${f2(E[1])}l-34 6 l22 22 z`, fill: RED, opacity: 0.85 }, s);
    rmark(s, V, 0, 16); arcL(s, V, 0, 34, 70, '34°', { size: 19, lr: 98 }); arcL(s, V, 34, 90, 70, 'y', { size: 21, lr: 92 }); vdot(s, V);
    txt(s, 300, 180, 'level line', { size: 15, weight: 600 }); txt(s, 26, 34, 'wall', { size: 15, weight: 600 }); txt(s, E[0] - 70, E[1] + 26, 'flagpole', { size: 15, weight: 600 });
  });
  fig('e4a', 210, 140, (s) => pairFig(s, [105, 124], 42, 48));
  fig('e4b', 210, 140, (s) => pairFig(s, [105, 124], 125, 55));
  fig('e4c', 210, 140, (s) => pairFig(s, [105, 124], 35, 70));
  fig('e4d', 210, 140, (s) => pairFig(s, [105, 124], 100, 60));
  fig('e5a', 270, 222, (s) => {
    const V = [36, 204];
    rayP(s, V, 0, 190); rayP(s, V, 90, 185); rayP(s, V, 57, 190); rmark(s, V, 0, 16);
    arcL(s, V, 0, 57, 52, 'x', { size: 22, lr: 76 }); arcL(s, V, 57, 90, 100, '33°', { size: 19, lr: 128 }); vdot(s, V);
  });
  fig('e5b', 270, 200, (s) => {
    const V = [118, 172];
    seg(s, [10, 172], [262, 172]); rayP(s, V, 39, 145);
    arcL(s, V, 0, 39, 64, 'x', { size: 22, lr: 88 }); arcL(s, V, 39, 180, 42, '141°', { size: 19, lr: 70 }); vdot(s, V);
  });
  fig('e5c', 270, 200, (s) => {
    const V = [135, 172];
    seg(s, [8, 172], [262, 172]); rayP(s, V, 46, 140); rayP(s, V, 122, 140);
    arcL(s, V, 0, 46, 46, '46°', { size: 19, lr: 76 }); arcL(s, V, 46, 122, 46, 'x', { size: 22, lr: 70 }); arcL(s, V, 122, 180, 46, '58°', { size: 19, lr: 76 }); vdot(s, V);
  });
  fig('vo', 330, 236, (s) => {
    const V = [165, 118];
    lineP(s, V, 25, 158); lineP(s, V, 150, 158);
    [[25, 150, '∠1'], [150, 205, '∠2'], [205, 330, '∠3'], [330, 385, '∠4']].forEach(([a, b, t]) => arcL(s, V, a, b, 34, t, { size: 19, lr: 64, italic: false }));
    vdot(s, V);
  });
  fig('e7a', 280, 230, (s) => {
    const V = [140, 115];
    [0, 95, 205, 283].forEach((d) => rayP(s, V, d, 108));
    arcL(s, V, 0, 95, 34, '95°', { size: 18, lr: 62 }); arcL(s, V, 95, 205, 34, '110°', { size: 18, lr: 66 });
    arcL(s, V, 205, 283, 34, '78°', { size: 18, lr: 62 }); arcL(s, V, 283, 360, 34, 'x', { size: 21, lr: 56 }); vdot(s, V);
  });
  fig('e7b', 280, 230, (s) => {
    const C = [140, 118];
    for (let k = 0; k < 5; k++) { const d = 90 + 72 * k; seg(s, P(C, d, 26), P(C, d, 102), { color: '#b9bcc4', w: 16 }); }
    svgEl('circle', { cx: C[0], cy: C[1], r: 22, fill: '#d6d8de', stroke: INK, 'stroke-width': 2 }, s);
    arcL(s, C, 90, 162, 54, '?', { size: 22, lr: 76 });
  });
  fig('e7c', 280, 230, (s) => {
    const V = [138, 128];
    rayP(s, V, 0, 125); rayP(s, V, 130, 125);
    arcL(s, V, 0, 130, 30, '130°', { size: 18, lr: 54 });
    const ra = arcP(s, V, 130, 357, 58, { w: 2 }); const E = P(V, 358, 58); arrowHead(s, E[0], E[1], 0.1, -1, { color: INK, width: 2 }); void ra;
    labAt(s, V, 265, 80, 'reflex', { size: 16, weight: 600, italic: false });
    vdot(s, V); txt(s, V[0] - 14, V[1] + 18, 'O', { size: 19 }); txt(s, V[0] + 125, V[1] + 18, 'B', { size: 19 }); labAt(s, V, 130, 142, 'A', { size: 19 });
  });
  fig('e8', 360, 300, (s) => {
    const V = [180, 150];
    [0, 48, 122].forEach((d) => lineP(s, V, d, 140));
    [[0, 48, '48°'], [48, 122, '74°'], [122, 180, 'a'], [180, 228, 'b'], [228, 302, 'c'], [302, 360, 'd']].forEach(([a, b, t]) => arcL(s, V, a, b, 48, t, { size: t.length > 1 ? 18 : 22, lr: 76 }));
    vdot(s, V);
  });
  fig('x9', 420, 170, (s) => {
    const V = [210, 85];
    [[0, '#7a5124'], [38, '#7a5124']].forEach(([d]) => { lineP(s, V, d, 130, { color: '#9aa0ab', w: 12 }); lineP(s, V, d, 130, { w: 2.4, dash: '3 9' }); });
    arcL(s, V, 0, 38, 70, '38°', { size: 19, lr: 98 }); vdot(s, V);
  });
  fig('e9a', 420, 200, (s) => drawScissors(s, [236, 100], 26, { blade: 170, handle: 82, ring: 104, rr: 22, lab: true }));
  fig('e9b', 420, 210, (s) => {
    const V = [210, 166];
    svgEl('rect', { x: 14, y: 166, width: 392, height: 16, fill: '#9cc7a8' }, s);
    seg(s, [14, 166], [406, 166]);
    seg(s, P(V, 140, 175), V, { dash: '8 6', w: 2.6 }); seg(s, V, P(V, 40, 175), { dash: '8 6', w: 2.6 });
    const A = P(V, 140, 92), B = P(V, 40, 120); arrowHead(s, A[0], A[1], Math.cos(-40 * Math.PI / 180), -Math.sin(-40 * Math.PI / 180), { color: INK, width: 2.6 }); arrowHead(s, B[0], B[1], Math.cos(40 * Math.PI / 180), -Math.sin(40 * Math.PI / 180), { color: INK, width: 2.6 });
    const S = P(V, 140, 175); svgEl('circle', { cx: S[0], cy: S[1], r: 9, fill: '#fff', stroke: INK, 'stroke-width': 2 }, s);
    arcL(s, V, 0, 40, 54, '40°', { size: 18, lr: 82 }); arcL(s, V, 140, 180, 54, '40°', { size: 18, lr: 82 }); arcL(s, V, 40, 140, 54, 'p', { size: 22, lr: 76 });
    txt(s, 340, 196, 'cushion', { size: 15, weight: 600 });
  });
}

/** a pair of open scissors (two crossing straight lines) at V, opened th degrees. Returns update(th) */
function drawScissors(s, V, th, o = {}) {
  const BL = o.blade || 300, HL = o.handle || 130, RC = o.ring || 168, RR = o.rr || 32, g = svgEl('g', {}, s);
  const parts = [1, -1].map((sg, i) => ({
    blade: svgEl('path', { fill: '#d5dbe3', stroke: '#4d5666', 'stroke-width': 2, 'stroke-linejoin': 'round' }, g),
    handle: svgEl('path', { stroke: i ? BLUE : RED, 'stroke-width': o.hw || 11, 'stroke-linecap': 'round', fill: 'none' }, g),
    ring: svgEl('ellipse', { rx: RR, ry: RR * 1.12, fill: 'none', stroke: i ? BLUE : RED, 'stroke-width': o.hw || 11 }, g), sg
  }));
  const screw = svgEl('circle', { cx: V[0], cy: V[1], r: o.screw || 6, fill: '#4d5666' }, g);
  const out = { g, screw, parts };
  if (o.lab) {
    out.ab = arcL(s, V, -th / 2, th / 2, BL * 0.55, `${th}°`, { size: 18, lr: BL * 0.55 + 28 });
    out.ah = arcL(s, V, 180 - th / 2, 180 + th / 2, HL * 0.42, '?', { size: 22, lr: RC + RR + 20 });
    txt(s, V[0] + BL * 0.72, V[1] + 52, 'blades', { size: 15, weight: 600 }); txt(s, V[0] - RC, V[1] + RR * 2.4, 'handles', { size: 15, weight: 600 });
  }
  out.set = (t) => {
    parts.forEach((pp) => {
      const b = pp.sg * t / 2, n = b + 90 * pp.sg, tip = P(V, b, BL), back = P(V, n, 9), front = P(V, n + 180, 3), tb = P(tip, n, 1.5);
      pp.blade.setAttribute('d', `M${f2(back[0])} ${f2(back[1])}L${f2(tb[0])} ${f2(tb[1])}L${f2(tip[0])} ${f2(tip[1])}L${f2(front[0])} ${f2(front[1])}Z`);
      const hE = P(V, b + 180, HL), rc = P(V, b + 180, RC);
      pp.handle.setAttribute('d', M(V, hE)); pp.ring.setAttribute('cx', f2(rc[0])); pp.ring.setAttribute('cy', f2(rc[1]));
      pp.ring.setAttribute('transform', `rotate(${f2(-(b + 180))} ${f2(rc[0])} ${f2(rc[1])})`);
    });
  };
  out.set(th);
  return out;
}

/* ======================================================================================
 * 1. Adjacent: the three tests (Example 1)
 * ====================================================================================== */
const ADJ = {
  a: { res: [1, 1, 1], caps: [`the same vertex? <b>Yes</b>: both corners are at ${T('Q')}.`, `one shared arm? <b>Yes</b>: arm ${T('QS')} belongs to both angles.`, 'no overlap? <b>Yes</b>: they sit side by side.'], end: 'All three tests pass: they are <b>adjacent</b>.' },
  b: { res: [1, 0, 1], caps: ['the same vertex? <b>Yes</b>: both corners are at the same point.', 'one shared arm? <b>No</b>: no arm belongs to both angles. They are across from each other.', 'no overlap? <b>Yes</b>: they do not overlap.'], end: 'They share no arm: <b>not adjacent</b>.' },
  c: { res: [0, 1, 1], caps: ['the same vertex? <b>No</b>: the corners are at two different points.', 'one shared arm? <b>Yes</b>: they share the bottom line.', 'no overlap? <b>Yes</b>: they do not overlap.'], end: 'Different vertices: <b>not adjacent</b>.' },
  d: { res: [1, 1, 0], caps: ['the same vertex? <b>Yes</b>: both corners are at the same point.', 'one shared arm? <b>Yes</b>: the bottom arm belongs to both.', `no overlap? <b>No</b>: ${T('\\angle 1')} is <b>inside</b> ${T('\\angle 2')}.`], end: 'They overlap: <b>not adjacent</b>.' }
};
function adjPicture(svg, v, ox) {
  const L = (p, x, y, t) => txt(p, x, y, t, { size: 26 });
  if (v === 'a' || v === 'e') {
    const V = [ox + 70, 384];
    rayP(svg, V, 0, 340, { w: 4 }); const sh = rayP(svg, V, 35, 330, { w: 4 }); rayP(svg, V, 85, 310, { w: 4 });
    const w1 = hide(wedgeP(svg, V, 0, 35, 150, BLUE, 0.22)), w2 = hide(wedgeP(svg, V, 35, 85, 150, AMB, 0.25));
    const l1 = arcL(svg, V, 0, 35, 70, v === 'e' ? '35°' : '1', { size: 26, lr: 104 }), l2 = arcL(svg, V, 35, 85, 70, v === 'e' ? '50°' : '2', { size: 26, lr: 102 });
    const d = vdot(svg, V, { r: 6 });
    L(svg, V[0] - 18, V[1] + 20, 'Q'); L(svg, V[0] + 340, V[1] + 24, 'P'); const S = P(V, 35, 356); L(svg, S[0], S[1], 'S'); const R = P(V, 85, 334); L(svg, R[0], R[1], 'R');
    return { V, dots: [d], shared: [P(V, 35, 330), V], w: [w1, w2], l: [l1, l2] };
  }
  if (v === 'b') {
    const V = [ox + 250, 214];
    lineP(svg, V, 20, 200, { w: 4 }); lineP(svg, V, 70, 200, { w: 4 });
    const w1 = hide(wedgeP(svg, V, 20, 70, 150, BLUE, 0.22)), w2 = hide(wedgeP(svg, V, 200, 250, 150, AMB, 0.25));
    arcL(svg, V, 20, 70, 60, '1', { size: 26, lr: 92 }); arcL(svg, V, 200, 250, 60, '2', { size: 26, lr: 92 });
    const d = vdot(svg, V, { r: 6 });
    return { V, dots: [d], shared: null, arms1: [[P(V, 20, 200), V, P(V, 70, 200)], BLUE], arms2: [[P(V, 200, 200), V, P(V, 250, 200)], AMB], w: [w1, w2] };
  }
  if (v === 'c') {
    const A = [ox + 50, 340], B = [ox + 430, 340];
    seg(svg, A, B, { w: 4 }); rayP(svg, A, 60, 230, { w: 4 }); rayP(svg, B, 110, 230, { w: 4 });
    const w1 = hide(wedgeP(svg, A, 0, 60, 120, BLUE, 0.22)), w2 = hide(wedgeP(svg, B, 110, 180, 120, AMB, 0.25));
    arcL(svg, A, 0, 60, 56, '1', { size: 26, lr: 88 }); arcL(svg, B, 110, 180, 56, '2', { size: 26, lr: 88 });
    return { dots: [vdot(svg, A, { r: 6 }), vdot(svg, B, { r: 6 })], shared: [A, B], w: [w1, w2] };
  }
  const V = [ox + 70, 384];
  const sh = rayP(svg, V, 0, 340, { w: 4 }); rayP(svg, V, 30, 330, { w: 4 }); rayP(svg, V, 75, 310, { w: 4 }); void sh;
  const w2 = hide(wedgeP(svg, V, 0, 75, 250, AMB, 0.22)), w1 = hide(wedgeP(svg, V, 0, 30, 140, BLUE, 0.3));
  arcL(svg, V, 0, 30, 70, '1', { size: 26, lr: 100 }); arcL(svg, V, 0, 75, 170, '2', { size: 26, lr: 200, at: 54 });
  return { V, dots: [vdot(svg, V, { r: 6 })], shared: [V, P(V, 0, 340)], w: [w1, w2] };
}
const adjacent = {
  title: 'Adjacent? Check all three tests',
  height: 430,
  minW: 900,
  choices: [{ sep: 'Example 1 check:' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }, { v: 'c', label: '(c)' }, { v: 'd', label: '(d)' }, { v: 'e', label: '(e) Find ∠PQR' }],
  ask: (v) => (v === 'e' ? `Example 1(e): ${T('\\angle PQS=35^\\circ')} and ${T('\\angle SQR=50^\\circ')}. Find ${T('\\angle PQR')}.` : `Example 1(${v}): are ${T('\\angle 1')} and ${T('\\angle 2')} adjacent?`),
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 900) / 2, svg = stageSvg(stage, W, 430), pic = adjPicture(svg, v, ox);
    if (v === 'e') {
      const V = pic.V, big = svgEl('g', {}, svg); hide(big);
      arcP(big, V, 0, 85, 190, { color: RED, w: 3.4 }); const bl = labAt(big, V, 42, 222, '?', { size: 30, color: RED });
      const eq1 = hide(hb(stage, `${T('\\angle PQS+\\angle SQR=\\angle PQR')}`, ox + 500, 120, 390, 64, 'u5l6-eq'));
      const eq2 = hide(hb(stage, `${T('35^\\circ+50^\\circ=85^\\circ')}`, ox + 500, 210, 390, 64, 'u5l6-eq u5l6-res'));
      return [
        { cap: `${T('\\angle PQS')} and ${T('\\angle SQR')} are <b>adjacent</b>: same vertex, a shared arm, no overlap.`, run: (c) => showAll(c, pic.w, 500) },
        { cap: `Adjacent angles <b>add up</b>. The big angle ${T('\\angle PQR')} is made by the two outside arms, ${T('QP')} and ${T('QR')}.`, run: async (c) => { await show(c, big, 500); await c.pop(eq1); } },
        { cap: `${T('\\angle PQR=35^\\circ+50^\\circ=85^\\circ')}`, run: async (c) => { bl.textContent = '85°'; await c.pop(eq2); } }
      ];
    }
    const d = ADJ[v], X0 = ox + 520;
    const panel = add(stage, box(h('div', 'u5l6-chk'), 370, 300), X0, 50);
    const names = ['Same vertex?', 'Share one arm?', 'No overlap?'];
    const marks = names.map((nm, i) => { const r = h('div', 'u5l6-chkrow', `<span class="u5l6-mk"></span><span><b>Test ${i + 1}</b> ${nm}</span>`); panel.appendChild(r); return r.firstChild; });
    const st = hide(stamp(stage, d.res.every(Boolean) ? 'adjacent' : 'not adjacent', { ok: d.res.every(Boolean), x: X0 + 185, y: 330, size: 'lg', rotate: -6 }));
    const mark = (c, i) => { const ok = d.res[i]; marks[i].textContent = ok ? '✓' : '✗'; marks[i].className = 'u5l6-mk ' + (ok ? 'ok' : 'no'); return c.pop(marks[i]); };
    const armsGlow = [];
    if (pic.shared) armsGlow.push(hide(glow(svg, pic.shared[0], pic.shared[1], BLUE)));
    if (pic.arms1) [pic.arms1, pic.arms2].forEach(([pts, col]) => armsGlow.push(hide(svgEl('path', { d: `M${pts.map((q) => f2(q[0]) + ' ' + f2(q[1])).join('L')}`, stroke: col, 'stroke-width': 12, 'stroke-opacity': 0.35, fill: 'none', 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, svg))));
    return [
      { cap: `<b>Test 1:</b> ${d.caps[0]}`, run: async (c) => { await Promise.all(pic.dots.map((dd) => pulseDot(c, dd))); await mark(c, 0); } },
      { cap: `<b>Test 2:</b> ${d.caps[1]}`, run: async (c) => { await showAll(c, armsGlow, 500); await mark(c, 1); } },
      { cap: `<b>Test 3:</b> ${d.caps[2]}`, run: async (c) => { await show(c, pic.w[0], 450); await show(c, pic.w[1], 450); await mark(c, 2); } },
      { cap: d.end, run: (c) => { st.style.opacity = 1; return stampIn(c, st); } }
    ];
  }
};

/* ======================================================================================
 * 2. A ray turning on a straight line (or in a corner): the sum stays the same. Drag the dot.
 * ====================================================================================== */
const partners = {
  title: 'Turn the ray: the sum stays the same',
  height: 420,
  minW: 900,
  choices: [{ v: 'line', label: 'Straight line: 180°' }, { v: 'corner', label: 'Square corner: 90°' }],
  ask: (v) => (v === 'line' ? 'A ray turns on a <b>straight line</b>. What happens to the two angles?' : 'A ray turns inside a <b>square corner</b>. What happens to the two angles?'),
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 900) / 2, svg = stageSvg(stage, W, 420), line = v === 'line', TOT = line ? 180 : 90;
    const V = line ? [ox + 450, 345] : [ox + 250, 380], LEN = line ? 290 : 330;
    if (line) lineP(svg, V, 0, 380, { w: 4.5 }); else { rayP(svg, V, 0, LEN, { w: 4.5 }); rayP(svg, V, 90, LEN - 20, { w: 4.5 }); rmark(svg, V, 0, 24); }
    const wa = wedgeP(svg, V, 0, 1, 130, BLUE, 0.2), wb = wedgeP(svg, V, 1, TOT, 150, AMB, 0.22);
    const aa = arcP(svg, V, 0, 1, 80, { color: BLUE, w: 3.2 }), ab = arcP(svg, V, 1, TOT, 100, { color: AMB, w: 3.2 });
    const ray = seg(svg, V, V, { w: 5, color: '#6e4a1c' });
    const la = txt(svg, 0, 0, '', { size: 28, color: BLUE }), lb = txt(svg, 0, 0, '', { size: 28, color: '#a86a08' });
    vdot(svg, V, { r: 6 });
    const knob = svgEl('circle', { r: 17, fill: '#fff', stroke: '#6e4a1c', 'stroke-width': 4, class: 'geo-drag', 'data-tap': '' }, svg);
    const sum = hb(stage, '', line ? ox + 30 : ox + 560, line ? 18 : 120, 330, 66, 'u5l6-eq u5l6-sum'); hide(sum);
    let th = line ? 50 : 30;
    const set = (t) => {
      th = t; const a = t, b = TOT - t;
      wa.setAttribute('d', wedgeD(V, 130, 0, a)); wb.setAttribute('d', wedgeD(V, 150, a, b));
      aa.setAttribute('d', arcD(V, 80, 0, a)); ab.setAttribute('d', arcD(V, 100, a, b));
      const E = P(V, a, LEN); ray.setAttribute('d', M(V, E)); knob.setAttribute('cx', f2(E[0])); knob.setAttribute('cy', f2(E[1]));
      const qa = P(V, a / 2, a < 24 ? 205 : 132), qb = P(V, a + b / 2, b < 24 ? 215 : 150);
      la.setAttribute('x', f2(qa[0])); la.setAttribute('y', f2(qa[1])); la.textContent = Math.round(a) + '°';
      lb.setAttribute('x', f2(qb[0])); lb.setAttribute('y', f2(qb[1])); lb.textContent = Math.round(b) + '°';
      sum.firstChild.innerHTML = T(`${DG(Math.round(a))}+${DG(Math.round(b))}=${DG(TOT)}`);
    };
    set(th);
    const turn = (c, to, ms = 1500) => { const from = th; return tween(c, ms, (t) => set(from + (to - from) * t)); };
    // drag the dot
    let drag = null;
    knob.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); drag = e.pointerId; try { knob.setPointerCapture(e.pointerId); } catch (er) { /* */ } sum.style.opacity = 1; });
    knob.addEventListener('pointermove', (e) => {
      if (drag !== e.pointerId) return;
      let d = dirTo(V, svgPoint(svg, e)); if (d > TOT) d = d > (TOT + 360) / 2 ? 1 : TOT - 1;
      set(Math.max(1, Math.min(TOT - 1, Math.round(d))));
    });
    const up = () => { drag = null; }; knob.addEventListener('pointerup', up); knob.addEventListener('pointercancel', up);
    const st = hide(stamp(stage, `always ${TOT}°`, { ok: true, x: line ? ox + 760 : ox + 725, y: line ? 60 : 250, size: 'lg', rotate: -7 }));
    const word = line ? 'supplementary' : 'complementary';
    const S = line ? [[125, 'Turn the ray. One angle gets <b>bigger</b>…'], [30, '…and the other gets <b>smaller</b> by the same amount.'], [90, `Straight up: ${T('90^\\circ+90^\\circ=180^\\circ')}. Still a straight line.`]]
      : [[70, 'Turn the ray. One angle gets <b>bigger</b>…'], [15, '…and the other gets <b>smaller</b> by the same amount.'], [45, `Halfway: ${T('45^\\circ+45^\\circ=90^\\circ')}. Still a square corner.`]];
    return [
      { cap: line ? `On a straight line, the ray makes <b>two angles</b>: ${T('50^\\circ')} and ${T('130^\\circ')}.` : `In a square corner, the ray makes <b>two angles</b>: ${T('30^\\circ')} and ${T('60^\\circ')}.`, run: (c) => c.pop(sum) },
      ...S.map(([to, cap]) => ({ cap, run: (c) => turn(c, to) })),
      { cap: `The sum is <b>always ${T(DG(TOT))}</b>: the two angles are <b>${word}</b>. Drag the dot to try more.`, run: (c) => { st.style.opacity = 1; return stampIn(c, st); } }
    ];
  }
};

/* ======================================================================================
 * 2 (Full). Partners don't have to touch: slide one angle over to the other
 * ====================================================================================== */
const slide = {
  title: 'Partners don’t have to touch',
  height: 400,
  minW: 900,
  choices: [{ v: 's', label: '130° and 50°' }, { v: 'c', label: '30° and 60°' }],
  ask: (v) => (v === 's' ? `A ${T('130^\\circ')} angle and a ${T('50^\\circ')} angle, far apart. Are they partners?` : `A ${T('30^\\circ')} angle and a ${T('60^\\circ')} angle, far apart. Are they partners?`),
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 900) / 2, svg = stageSvg(stage, W, 400), sup = v === 's';
    const A = sup ? { V: [ox + 250, 320], a0: 0, a1: 130 } : { V: [ox + 170, 350], a0: 0, a1: 30 };
    const B = sup ? { V: [ox + 720, 200], a0: 200, a1: 250, to: 130 } : { V: [ox + 680, 330], a0: 100, a1: 160, to: 30 };
    const L = 200;
    wedgeP(svg, A.V, A.a0, A.a1, 95, BLUE, 0.22); rayP(svg, A.V, A.a0, L, { w: 4 }); rayP(svg, A.V, A.a1, L, { w: 4 }); arcP(svg, A.V, A.a0, A.a1, 60, { color: BLUE, w: 3 }); vdot(svg, A.V, { r: 5.5 });
    labAt(svg, A.V, (A.a0 + A.a1) / 2, 88, `${A.a1 - A.a0}°`, { size: 26, color: BLUE });
    const g = grp(svg);
    wedgeP(g, B.V, B.a0, B.a1, 95, AMB, 0.28); rayP(g, B.V, B.a0, L, { w: 4, color: '#8a5a0a' }); rayP(g, B.V, B.a1, L, { w: 4, color: '#8a5a0a' }); arcP(g, B.V, B.a0, B.a1, 60, { color: AMB, w: 3 }); vdot(g, B.V, { r: 5.5 });
    const n = B.a1 - B.a0, lb = labAt(svg, B.V, (B.a0 + B.a1) / 2, 92, `${n}°`, { size: 26, color: '#a86a08' });
    const lb2 = hide(labAt(svg, A.V, B.to + n / 2, 120, `${n}°`, { size: 26, color: '#a86a08' }));
    const rot = B.to - B.a0, dx = A.V[0] - B.V[0], dy = A.V[1] - B.V[1];
    const tot = A.a1 - A.a0 + n;
    const eq = hide(hb(stage, T(`${DG(A.a1 - A.a0)}+${DG(n)}=${DG(tot)}`), sup ? ox + 520 : ox + 470, 20, 320, 64, 'u5l6-eq'));
    const fin = sup ? hide(glow(svg, P(A.V, 180, 230), P(A.V, 0, 230), PUR)) : hide(rmark(svg, A.V, 0, 28, { color: GRN, w: 4 }));
    const st = hide(stamp(stage, sup ? 'a straight line!' : 'a square corner!', { ok: true, x: sup ? ox + 690 : ox + 640, y: sup ? 130 : 160, rotate: -6 }));
    return [
      { cap: `Two angles, far apart: ${T(DG(A.a1 - A.a0))} and ${T(DG(n))}.`, run: (c) => c.sleep(200) },
      { cap: `Add them: ${T(`${DG(A.a1 - A.a0)}+${DG(n)}=${DG(tot)}`)}. So they are <b>${sup ? 'supplementary' : 'complementary'}</b>.`, run: (c) => c.pop(eq) },
      { cap: `Slide the ${T(DG(n))} angle over and turn it to fit…`, run: async (c) => { await c.anim(lb, [{ opacity: 1 }, { opacity: 0 }], 250); await tween(c, 1800, (t) => g.setAttribute('transform', `translate(${f2(dx * t)} ${f2(dy * t)}) rotate(${f2(-rot * t)} ${B.V[0]} ${B.V[1]})`)); await show(c, lb2); } },
      { cap: `…and they make ${sup ? 'a <b>straight line</b>' : 'a <b>square corner</b>'}. Partners only need the right <b>sum</b>. They do not have to be next to each other.`, run: async (c) => { await show(c, fin, 400); st.style.opacity = 1; await stampIn(c, st); } }
    ];
  }
};

/* ======================================================================================
 * 2. Fill the corner, fill the straight line (Examples 2 and 3)
 * ====================================================================================== */
const EX3 = {
  '3a': { q: `Example 3(a): the complement of an angle is ${T('31^\\circ')}. What is the angle? What is its supplement?`, comp: 31 },
  '3b': { q: `Example 3(b): the supplement of an angle is ${T('142^\\circ')}. What is the angle? What is its complement?`, supp: 142 },
  '3c': { q: `Example 3(c): a bike path meets a straight sidewalk. One angle is ${T('73^\\circ')}. Find ${T('x')}.` },
  '3d': { q: `Example 3(d): a flagpole makes ${T('34^\\circ')} with a level line out from a vertical wall. Find ${T('y')}.` }
};
const fill = {
  title: 'Fill the corner, fill the straight line',
  height: 440,
  minW: 900,
  choices: [{ sep: 'Example 2 check:' }, ...[['a', 25], ['b', 64], ['c', 8], ['d', 97], ['e', 210]].map(([k, n]) => ({ v: n, label: `(${k}) ${n}°` })), { sep: 'Example 3 check:' }, { v: '3a', label: '(a) complement 31°' }, { v: '3b', label: '(b) supplement 142°' }, { v: '3c', label: '(c) bike path' }, { v: '3d', label: '(d) flagpole' }],
  ask: (v) => (EX3[v] ? EX3[v].q : `Example 2: find the complement and the supplement of ${T(DG(v))}.`),
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 900) / 2, svg = stageSvg(stage, W, 440);
    if (v === '3c' || v === '3d') return fillScene(stage, svg, v, ox);
    // the two frames
    const CV = [ox + 150, 318], SV = [ox + 665, 318], FR = 200;
    rayP(svg, CV, 0, FR + 10, { color: GREY, w: 3.5 }); rayP(svg, CV, 90, FR, { color: GREY, w: 3.5 }); rmark(svg, CV, 0, 20, { color: GREY });
    lineP(svg, SV, 0, 215, { color: GREY, w: 3.5 });
    hb(stage, `Corner: ${T('90^\\circ')}`, ox + 30, 4, 260, 40, 'u5l6-ttl'); hb(stage, `Straight line: ${T('180^\\circ')}`, ox + 535, 4, 260, 40, 'u5l6-ttl');
    const angleIn = (V, a, lab, len = FR) => {
      const g = svgEl('g', {}, svg), big = a > 180;
      wedgeP(g, V, 0, a, big ? 70 : 105, BLUE, 0.22); rayP(g, V, 0, len, { color: BLUE, w: 4 }); rayP(g, V, a, a > 90 ? 120 : len, { color: BLUE, w: 4 });
      labAt(g, V, a < 20 ? a + 10 : a / 2, a < 20 ? 150 : big ? 100 : 134, lab, { size: 26, color: BLUE });
      vdot(g, V, { r: 5 }); return g;
    };
    const partIn = (V, a, b, col, lab) => { const g = svgEl('g', {}, svg); wedgeP(g, V, a, b, 105, col, 0.24); arcP(g, V, a, b, 72, { color: col, w: 3 }); const t = labAt(g, V, (a + b) / 2, b - a < 22 ? 160 : 132, lab, { size: 26, color: col }); g.lab = t; return g; };
    const eqL = (html, cls = '') => hide(hb(stage, html, ox + 20, 360, 400, 60, 'u5l6-eq ' + cls)), eqR = (html, cls = '') => hide(hb(stage, html, ox + 470, 360, 410, 60, 'u5l6-eq ' + cls));
    const none = (x, y) => hide(stamp(stage, 'none', { ok: false, x, y, rotate: -8 }));
    if (EX3[v]) {
      const d = EX3[v], A = d.comp ? 90 - d.comp : 180 - d.supp;
      const ga = angleIn(d.comp ? CV : SV, A, '?'), gp = d.comp ? partIn(CV, A, 90, GRN, '31°') : partIn(SV, A, 180, PUR, '142°');
      const lab = ga.querySelector('text');
      const g2 = hide(angleIn(d.comp ? SV : CV, A, `${A}°`)), p2 = hide(d.comp ? partIn(SV, A, 180, PUR, `${180 - A}°`) : partIn(CV, A, 90, GRN, `${90 - A}°`));
      const e1 = d.comp ? eqL(`angle ${T(`=90^\\circ-31^\\circ=${DG(A)}`)}`) : eqR(`angle ${T(`=180^\\circ-142^\\circ=${DG(A)}`)}`);
      const e2 = d.comp ? eqR(`supplement ${T(`=180^\\circ-${DG(A)}=${DG(180 - A)}`)}`, 'u5l6-res') : eqL(`complement ${T(`=90^\\circ-${DG(A)}=${DG(90 - A)}`)}`, 'u5l6-res');
      return [
        { cap: d.comp ? `The complement (${T('31^\\circ')}) and the angle fill the <b>corner</b> together.` : `The supplement (${T('142^\\circ')}) and the angle fill the <b>straight line</b> together.`, run: (c) => showAll(c, [ga, gp], 450) },
        { cap: d.comp ? `So the angle is ${T(`90^\\circ-31^\\circ=${DG(A)}`)}.` : `So the angle is ${T(`180^\\circ-142^\\circ=${DG(A)}`)}.`, run: async (c) => { lab.textContent = A + '°'; await c.pop(e1); } },
        { cap: d.comp ? `Its supplement fills the straight line: ${T(`180^\\circ-${DG(A)}=${DG(180 - A)}`)}.` : `Its complement fills the corner: ${T(`90^\\circ-${DG(A)}=${DG(90 - A)}`)}.`, run: async (c) => { await show(c, g2); await show(c, p2, 450); await c.pop(e2); } }
      ];
    }
    const A = v, ga = hide(angleIn(CV, A, `${A}°`)), gs = hide(angleIn(SV, A, `${A}°`));
    const hasC = A < 90, hasS = A < 180;
    const pc = hasC ? hide(partIn(CV, A, 90, GRN, `${90 - A}°`)) : hide(svgEl('path', { d: arcD(CV, 150, 90, Math.min(A, 270) - 90), stroke: RED, 'stroke-width': 8, 'stroke-opacity': 0.55, fill: 'none' }, svg));
    const ps = hasS ? hide(partIn(SV, A, 180, PUR, `${180 - A}°`)) : hide(svgEl('path', { d: arcD(SV, 110, 180, A - 180), stroke: RED, 'stroke-width': 8, 'stroke-opacity': 0.55, fill: 'none' }, svg));
    const ec = eqL(hasC ? `complement ${T(`=90^\\circ-${DG(A)}=${DG(90 - A)}`)}` : `no complement: ${T(DG(A))} is more than ${T('90^\\circ')}`, hasC ? 'u5l6-res' : 'u5l6-bad');
    const es = eqR(hasS ? `supplement ${T(`=180^\\circ-${DG(A)}=${DG(180 - A)}`)}` : `no supplement: ${T(DG(A))} is more than ${T('180^\\circ')}`, hasS ? 'u5l6-res' : 'u5l6-bad');
    const n1 = hasC ? null : none(ox + 330, 80), n2 = hasS ? null : none(ox + 840, 150);
    const stampIt = async (c, s) => { if (s) { s.style.opacity = 1; await stampIn(c, s); } };
    return [
      { cap: `Draw the ${T(DG(A))} angle in the corner and on the straight line.`, run: (c) => showAll(c, [ga, gs], 450) },
      { cap: hasC ? `<b>Complement:</b> what fills the rest of the corner? ${T(`90^\\circ-${DG(A)}=${DG(90 - A)}`)}` : `<b>No complement:</b> ${T(DG(A))} is already more than ${T('90^\\circ')}. It does not fit in the corner.`, run: async (c) => { await show(c, pc, 450); await c.pop(ec); await stampIt(c, n1); } },
      { cap: hasS ? `<b>Supplement:</b> what fills the rest of the straight line? ${T(`180^\\circ-${DG(A)}=${DG(180 - A)}`)}` : `<b>No supplement:</b> ${T(DG(A))} is more than ${T('180^\\circ')}. It goes past the straight line.`, run: async (c) => { await show(c, ps, 450); await c.pop(es); await stampIt(c, n2); } }
    ];
  }
};
function fillScene(stage, svg, v, ox) {
  if (v === '3c') {
    const V = [ox + 450, 318];
    svgEl('rect', { x: ox + 60, y: 318, width: 780, height: 40, fill: '#e2ded5' }, svg);
    for (let x = ox + 100; x < ox + 840; x += 70) seg(svg, [x, 322], [x, 356], { color: '#c6c0b4', w: 2 });
    const E = P(V, 73, 300), n = P([0, 0], 163, 1);
    svgEl('path', { d: `M${f2(V[0] + n[0] * 24)} ${f2(V[1] + n[1] * 24)}L${f2(E[0] + n[0] * 24)} ${f2(E[1] + n[1] * 24)}L${f2(E[0] - n[0] * 24)} ${f2(E[1] - n[1] * 24)}L${f2(V[0] - n[0] * 24)} ${f2(V[1] - n[1] * 24)}Z`, fill: '#cfe3c7' }, svg);
    seg(svg, V, E, { color: '#7aa36c', w: 2, dash: '10 8' });
    lineP(svg, V, 0, 390, { w: 4 }); rayP(svg, V, 73, 300, { w: 4 });
    const a = arcL(svg, V, 0, 73, 80, '73°', { size: 26, lr: 112 }), x = arcL(svg, V, 73, 180, 70, 'x', { size: 28, lr: 104 }); void a;
    vdot(svg, V, { r: 5 });
    txt(svg, ox + 760, 372, 'sidewalk', { size: 19, weight: 600 }); txt(svg, E[0] + 70, E[1] + 20, 'bike path', { size: 19, weight: 600 });
    const bike = svgEl('g', {}, svg);
    svgEl('circle', { cx: -12, cy: 0, r: 10, fill: 'none', stroke: INK, 'stroke-width': 3 }, bike); svgEl('circle', { cx: 12, cy: 0, r: 10, fill: 'none', stroke: INK, 'stroke-width': 3 }, bike);
    svgEl('path', { d: 'M-12 0 L-2 -12 L12 0 M-2 -12 L4 -20', stroke: RED, 'stroke-width': 3, fill: 'none' }, bike);
    const at0 = P(V, 73, 280); bike.setAttribute('transform', `translate(${f2(at0[0])} ${f2(at0[1] - 14)})`);
    const gl = hide(glow(svg, P(V, 180, 390), P(V, 0, 390)));
    const e1 = hide(hb(stage, T('73^\\circ+x=180^\\circ'), ox + 40, 30, 300, 58, 'u5l6-eq')), e2 = hide(hb(stage, T('x=180^\\circ-73^\\circ=107^\\circ'), ox + 40, 100, 360, 58, 'u5l6-eq u5l6-res'));
    return [
      { cap: 'The bike path comes down to the sidewalk. The sidewalk is a <b>straight line</b>.', run: async (c) => { await tween(c, 1400, (t) => { const q = P(V, 73, 280 - 150 * t); bike.setAttribute('transform', `translate(${f2(q[0])} ${f2(q[1] - 14)})`); }); await show(c, gl, 400); } },
      { cap: `Angles on a straight line are <b>supplementary</b>: ${T('73^\\circ+x=180^\\circ')}.`, run: (c) => c.pop(e1) },
      { cap: `${T('x=180^\\circ-73^\\circ=107^\\circ')}`, run: async (c) => { x.t.textContent = '107°'; x.t.setAttribute('fill', RED); x.t.style.fontStyle = 'normal'; await c.pop(e2); } }
    ];
  }
  const V = [ox + 250, 300];
  for (let y = 30; y < 430; y += 16) seg(svg, [V[0] - 26, y + 14], [V[0] - 4, y], { color: GREY, w: 2 });
  seg(svg, [V[0], 22], [V[0], 432], { w: 4.5 });
  seg(svg, V, [ox + 760, 300], { dash: '10 8', w: 3 });
  const E = P(V, 34, 330); rayP(svg, V, 34, 330, { w: 7, color: '#5d6675' });
  const flag = svgEl('path', { d: `M${f2(E[0])} ${f2(E[1])}l-62 10 l40 38 z`, fill: RED, opacity: 0.9 }, svg); void flag;
  const rm = rmark(svg, V, 0, 26, { w: 3 });
  arcL(svg, V, 0, 34, 120, '34°', { size: 26, lr: 154 }); const y = arcL(svg, V, 34, 90, 120, 'y', { size: 28, lr: 150 });
  vdot(svg, V, { r: 5 });
  txt(svg, ox + 700, 326, 'level line', { size: 19, weight: 600 }); txt(svg, V[0] - 60, 50, 'wall', { size: 19, weight: 600 }); txt(svg, E[0] - 150, E[1] + 30, 'flagpole', { size: 19, weight: 600 });
  const box2 = hide(svgEl('rect', { x: V[0], y: V[1] - 40, width: 40, height: 40, fill: GRN, 'fill-opacity': 0.35 }, svg));
  const e1 = hide(hb(stage, T('34^\\circ+y=90^\\circ'), ox + 560, 40, 300, 58, 'u5l6-eq')), e2 = hide(hb(stage, T('y=90^\\circ-34^\\circ=56^\\circ'), ox + 520, 110, 340, 58, 'u5l6-eq u5l6-res'));
  void rm;
  return [
    { cap: 'The wall is straight up and the level line is flat: they make a <b>right angle</b>.', run: async (c) => { await show(c, box2, 400); await c.anim(box2, [{ opacity: 1 }, { opacity: 0.2 }, { opacity: 1 }], 700); } },
    { cap: `The pole splits the right angle, so the angles are <b>complementary</b>: ${T('34^\\circ+y=90^\\circ')}.`, run: (c) => c.pop(e1) },
    { cap: `${T('y=90^\\circ-34^\\circ=56^\\circ')}`, run: async (c) => { y.t.textContent = '56°'; y.t.setAttribute('fill', RED); y.t.style.fontStyle = 'normal'; await c.pop(e2); } }
  ];
}

/* ======================================================================================
 * 3. Complementary, supplementary or neither? (Example 4) — lay a corner and a straight edge on them
 * ====================================================================================== */
const PAIRS4 = { a: [42, 48], b: [125, 55], c: [35, 70], d: [100, 60] };
const verdict = {
  title: 'Complementary, supplementary or neither?',
  height: 430,
  minW: 900,
  choices: [{ sep: 'Example 4 check:' }, ...Object.keys(PAIRS4).map((k) => ({ v: k, label: `(${k}) ${PAIRS4[k][0]}° and ${PAIRS4[k][1]}°` }))],
  ask: (v) => `Example 4(${v}): two adjacent angles, ${T(DG(PAIRS4[v][0]))} and ${T(DG(PAIRS4[v][1]))}. Complementary, supplementary or neither?`,
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 900) / 2, svg = stageSvg(stage, W, 430), [a, b] = PAIRS4[v], S = a + b;
    const V = [ox + 290, 360], L = 250;
    wedgeP(svg, V, 0, a, 110, BLUE, 0.2); wedgeP(svg, V, a, S, 130, AMB, 0.24);
    rayP(svg, V, 0, L, { w: 4 }); rayP(svg, V, a, L, { w: 4 }); rayP(svg, V, S, L, { w: 4 });
    arcL(svg, V, 0, a, 66, `${a}°`, { size: 25, color: BLUE, lr: 98 }); arcL(svg, V, a, S, 90, `${b}°`, { size: 25, color: '#a86a08', lr: 122 });
    vdot(svg, V, { r: 5.5 });
    const big = hide(svgEl('g', {}, svg)); arcP(big, V, 0, S, 175, { color: RED, w: 3.4, }); labAt(big, V, S / 2, 205, `${S}°`, { size: 28, color: RED });
    const corner = hide(svgEl('g', {}, svg)); seg(corner, P(V, 0, 270), V, { color: GRN, w: 12, op: 0.4 }); seg(corner, V, P(V, 90, 270), { color: GRN, w: 12, op: 0.4 }); rmark(corner, V, 0, 30, { color: GRN, w: 4 });
    const edge = hide(seg(svg, P(V, 180, 280), P(V, 0, 290), { color: PUR, w: 14, op: 0.35 }));
    const X0 = ox + 610;
    const sumB = hide(hb(stage, `Sum: ${T(`${DG(a)}+${DG(b)}=${DG(S)}`)}`, X0 - 40, 30, 330, 60, 'u5l6-eq'));
    const row = (y, html) => { const r = hide(add(stage, box(h('div', 'u5l6-chkrow u5l6-vrow', `<span class="u5l6-mk"></span><span>${html}</span>`), 290, 56), X0, y)); return r; };
    const r90 = row(110, `Is it ${T('90^\\circ')}?`), r180 = row(176, `Is it ${T('180^\\circ')}?`);
    const tick = (r, ok) => { const m = r.querySelector('.u5l6-mk'); m.textContent = ok ? '✓' : '✗'; m.className = 'u5l6-mk ' + (ok ? 'ok' : 'no'); };
    tick(r90, S === 90); tick(r180, S === 180);
    const word = S === 90 ? 'complementary' : S === 180 ? 'supplementary' : 'neither';
    const st = hide(stamp(stage, word, { ok: S === 90 || S === 180 ? true : null, x: X0 + 130, y: 290, size: S === 90 || S === 180 ? null : 'lg', rotate: -6 }));
    return [
      { cap: `Add the two angles: ${T(`${DG(a)}+${DG(b)}=${DG(S)}`)}.`, run: async (c) => { await show(c, big, 500); await c.pop(sumB); } },
      { cap: `Is it ${T('90^\\circ')}? Lay a <b>square corner</b> on the outside arms. ${S === 90 ? '<b>It fits!</b>' : 'It does <b>not</b> fit.'}`, run: async (c) => { await show(c, corner, 500); await c.pop(r90); } },
      { cap: `Is it ${T('180^\\circ')}? Lay a <b>straight edge</b> on them. ${S === 180 ? '<b>It fits!</b>' : 'It does <b>not</b> fit.'}`, run: async (c) => { await c.anim(corner, [{ opacity: 1 }, { opacity: 0.25 }], 300); await show(c, edge, 500); await c.pop(r180); } },
      { cap: S === 90 ? `The sum is ${T('90^\\circ')}: <b>complementary</b>.` : S === 180 ? `The sum is ${T('180^\\circ')}: <b>supplementary</b>.` : `The sum is ${T(DG(S))}, not ${T('90^\\circ')} or ${T('180^\\circ')}: <b>neither</b>.`, run: (c) => { st.style.opacity = 1; return stampIn(c, st); } }
    ];
  }
};

/* ======================================================================================
 * 3. The missing angle in 4 steps (Example 5)
 * ====================================================================================== */
const MISS = {
  a: { kind: 'right', known: [33], x: 57, eq: 'x+33^\\circ=90^\\circ', sub: 'x=90^\\circ-33^\\circ=57^\\circ', chk: '57+33=90' },
  b: { kind: 'line', known: [141], x: 39, eq: 'x+141^\\circ=180^\\circ', sub: 'x=180^\\circ-141^\\circ=39^\\circ', chk: '39+141=180' },
  c: { kind: 'line', known: [46, 58], x: 76, eq: '46^\\circ+x+58^\\circ=180^\\circ', sub: 'x=180^\\circ-46^\\circ-58^\\circ=76^\\circ', chk: '46+76+58=180' }
};
const missing = {
  title: 'The missing angle in 4 steps',
  height: 430,
  minW: 900,
  choices: [{ sep: 'Example 5 check:' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }, { v: 'c', label: '(c)' }],
  ask: (v) => `Example 5(${v}): find the missing angle ${T('x')}.`,
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 900) / 2, svg = stageSvg(stage, W, 430), d = MISS[v];
    let xl, hl;
    if (v === 'a') {
      const V = [ox + 70, 400];
      rayP(svg, V, 0, 380, { w: 4 }); rayP(svg, V, 90, 370, { w: 4 }); rayP(svg, V, 57, 380, { w: 4 }); rmark(svg, V, 0, 26);
      xl = arcL(svg, V, 0, 57, 100, 'x', { size: 30, lr: 134 }).t; arcL(svg, V, 57, 90, 190, '33°', { size: 26, lr: 226 }); vdot(svg, V, { r: 5 });
      hl = hide(svgEl('rect', { x: V[0], y: V[1] - 46, width: 46, height: 46, fill: GRN, 'fill-opacity': 0.4 }, svg));
    } else {
      const V = [ox + 262, 330];
      seg(svg, [ox + 20, 330], [ox + 500, 330], { w: 4 });
      if (v === 'b') { rayP(svg, V, 39, 250, { w: 4 }); xl = arcL(svg, V, 0, 39, 120, 'x', { size: 30, lr: 154 }).t; arcL(svg, V, 39, 180, 70, '141°', { size: 26, lr: 108 }); }
      else { rayP(svg, V, 46, 240, { w: 4 }); rayP(svg, V, 122, 240, { w: 4 }); arcL(svg, V, 0, 46, 80, '46°', { size: 26, lr: 120 }); xl = arcL(svg, V, 46, 122, 80, 'x', { size: 30, lr: 114 }).t; arcL(svg, V, 122, 180, 80, '58°', { size: 26, lr: 120 }); }
      vdot(svg, V, { r: 5 });
      hl = hide(seg(svg, [ox + 20, 330], [ox + 500, 330], { color: PUR, w: 14, op: 0.35 }));
    }
    const X0 = ox + 520, rows = [
      `<b>Step 1</b> ${d.kind === 'right' ? `Right angle: ${T('90^\\circ')}` : `Straight line: ${T('180^\\circ')}`}`,
      `<b>Step 2</b> ${T(d.eq)}`, `<b>Step 3</b> ${T(d.sub)}`, `<b>Step 4</b> Check: ${T(d.chk + '\\ \\checkmark')}`
    ].map((html, i) => hide(hb(stage, html, X0, 24 + i * 86, 375, 70, 'u5l6-step' + (i === 2 ? ' u5l6-res' : ''))));
    const st = hide(stamp(stage, '✓', { ok: true, x: X0 + 330, y: 396, rotate: -8 }));
    const tot = d.kind === 'right' ? '90^\\circ' : '180^\\circ';
    return [
      { cap: d.kind === 'right' ? '<b>Step 1:</b> decide. The <b>square mark</b> says it is a right angle: the angles add to ' + T('90^\\circ') + '.' : '<b>Step 1:</b> decide. The angles sit on a <b>straight line</b>: they add to ' + T('180^\\circ') + '.', run: async (c) => { await show(c, hl, 400); await c.anim(hl, [{ opacity: 1 }, { opacity: 0.2 }, { opacity: 1 }], 700); await c.pop(rows[0]); } },
      { cap: `<b>Step 2:</b> write the equation: the missing angle and the angles you know add to ${T(tot)}.`, run: (c) => c.pop(rows[1]) },
      { cap: `<b>Step 3:</b> subtract to find the missing angle: ${T(`x=${DG(d.x)}`)}.`, run: async (c) => { xl.textContent = d.x + '°'; xl.setAttribute('fill', RED); xl.style.fontStyle = 'normal'; await c.pop(rows[2]); } },
      { cap: `<b>Step 4:</b> check by adding: ${T(d.chk)}. It works!`, run: async (c) => { await c.pop(rows[3]); st.style.opacity = 1; await stampIn(c, st); } }
    ];
  }
};

/* ======================================================================================
 * 4. Scissors: vertically opposite angles stay equal (and Example 9(a))
 * ====================================================================================== */
const scissors = {
  title: 'Open the scissors: opposite angles stay equal',
  height: 420,
  minW: 900,
  choices: [{ v: 'open', label: 'Open and close' }, { sep: 'Example 9(a) check:' }, { v: 'ex9', label: 'Blades open 26°' }],
  ask: (v) => (v === 'open' ? 'Two straight lines cross, like an open pair of scissors. Which angles stay <b>equal</b>?' : `Example 9(a): the blades are open ${T('26^\\circ')}. What is the angle between the handles? Why?`),
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 900) / 2, svg = stageSvg(stage, W, 420), V = [ox + 470, 205];
    let th = v === 'open' ? 30 : 26;
    const S = drawScissors(svg, V, th, { blade: 330, handle: 135, ring: 180, rr: 34 });
    const cl = [svgEl('path', { stroke: INK, 'stroke-width': 2, fill: 'none', 'stroke-dasharray': '2 0' }, svg), svgEl('path', { stroke: INK, 'stroke-width': 2, fill: 'none' }, svg)];
    const ab = arcP(svg, V, 0, 1, 130, { color: BLUE, w: 3.4 }), ah = arcP(svg, V, 0, 1, 70, { color: BLUE, w: 3.4 });
    const at = arcP(svg, V, 0, 1, 52, { color: AMB, w: 3 }), abm = arcP(svg, V, 0, 1, 52, { color: AMB, w: 3 });
    const lb = txt(svg, 0, 0, '', { size: 28, color: BLUE }), lh = txt(svg, 0, 0, '', { size: 28, color: BLUE });
    const lt = txt(svg, 0, 0, '', { size: 24, color: '#a86a08' }), lbm = txt(svg, 0, 0, '', { size: 24, color: '#a86a08' });
    const side = [at, abm, lt, lbm]; hide(...side);
    const knob = svgEl('circle', { r: 17, fill: '#fff', stroke: '#6e4a1c', 'stroke-width': 4, class: 'geo-drag', 'data-tap': '' }, svg);
    let handleQ = false;
    const set = (t) => {
      th = t; S.set(t);
      [1, -1].forEach((sg, i) => cl[i].setAttribute('d', M(P(V, sg * t / 2 + 180, 214), P(V, sg * t / 2, 330))));
      ab.setAttribute('d', arcD(V, 130, -t / 2, t)); ah.setAttribute('d', arcD(V, 70, 180 - t / 2, t));
      at.setAttribute('d', arcD(V, 52, t / 2, 180 - t)); abm.setAttribute('d', arcD(V, 52, 180 + t / 2, 180 - t));
      const r = Math.round(t), q1 = P(V, 0, 250), q2 = P(V, 180, t >= 50 ? 104 : 262), q3 = P(V, 90, 84), q4 = P(V, 270, 84);
      lb.setAttribute('x', f2(q1[0])); lb.setAttribute('y', f2(q1[1])); lb.textContent = r + '°';
      lh.setAttribute('x', f2(q2[0])); lh.setAttribute('y', f2(q2[1])); lh.textContent = handleQ ? '?' : r + '°';
      lt.setAttribute('x', f2(q3[0])); lt.setAttribute('y', f2(q3[1])); lt.textContent = (180 - r) + '°';
      lbm.setAttribute('x', f2(q4[0])); lbm.setAttribute('y', f2(q4[1])); lbm.textContent = (180 - r) + '°';
      const k = P(V, t / 2, 300); knob.setAttribute('cx', f2(k[0])); knob.setAttribute('cy', f2(k[1]));
    };
    const turn = (c, to, ms = 1500) => { const from = th; return tween(c, ms, (t) => set(from + (to - from) * t)); };
    let drag = null;
    knob.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); drag = e.pointerId; try { knob.setPointerCapture(e.pointerId); } catch (er) { /* */ } });
    knob.addEventListener('pointermove', (e) => { if (drag !== e.pointerId) return; const d = Math.abs(n180(dirTo(V, svgPoint(svg, e)))); set(Math.max(4, Math.min(84, Math.round(d))) * 2); });
    const up = () => { drag = null; }; knob.addEventListener('pointerup', up); knob.addEventListener('pointercancel', up);
    const st = hide(stamp(stage, 'always equal', { ok: true, x: ox + 160, y: 60, rotate: -7 }));
    if (v === 'ex9') {
      handleQ = true; set(26); hide(knob);
      const eq = hide(hb(stage, `handles ${T('=26^\\circ')}`, ox + 20, 330, 250, 58, 'u5l6-eq u5l6-res'));
      const ring = hide(svgEl('g', {}, svg)); arcP(ring, V, -13, 13, 130, { color: GRN, w: 10 }); arcP(ring, V, 167, 193, 70, { color: GRN, w: 10 }); ring.setAttribute('stroke-opacity', 0.45);
      return [
        { cap: `The blades are open ${T('26^\\circ')}. The handles are on the other side of the screw.`, run: (c) => c.sleep(200) },
        { cap: 'Each half of the scissors is a <b>straight line</b>. The handle angle is <b>across from</b> the blade angle: they are <b>vertically opposite</b>.', run: (c) => show(c, ring, 500) },
        { cap: `Vertically opposite angles are equal: the handles are open ${T('26^\\circ')}.`, run: async (c) => { handleQ = false; set(26); await c.pop(eq); } }
      ];
    }
    set(th);
    const lines = hide(svgEl('g', {}, svg)); [1, -1].forEach((sg) => seg(lines, P(V, sg * 15 + 180, 214), P(V, sg * 15, 330), { color: PUR, w: 12, op: 0.3 }));
    return [
      { cap: 'Each half of the scissors is a <b>straight line</b>. The two lines cross at the screw.', run: async (c) => { await show(c, lines, 500); await c.anim(lines, [{ opacity: 1 }, { opacity: 0 }], 700); } },
      { cap: 'Open them wider…', run: (c) => turn(c, 76) },
      { cap: '…or close them. The angle between the <b>blades</b> and the angle between the <b>handles</b> always match.', run: (c) => turn(c, 18, 1700) },
      { cap: 'They are <b>vertically opposite angles</b>: across from each other at the vertex. They are always <b>equal</b>.', run: (c) => { st.style.opacity = 1; return stampIn(c, st); } },
      { cap: `The angles beside them make a straight line with the blade angle: ${T('180^\\circ-18^\\circ=162^\\circ')}. Drag the dot to try more.`, run: (c) => showAll(c, side, 500) }
    ];
  }
};

/* ======================================================================================
 * 4 (Full). Why vertically opposite angles are equal
 * ====================================================================================== */
const why = {
  title: 'Why ∠1 = ∠3',
  height: 420,
  minW: 900,
  ask: `Two straight lines cross. Why is ${T('\\angle 1')} always equal to ${T('\\angle 3')}?`,
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 900) / 2, svg = stageSvg(stage, W, 420), V = [ox + 250, 210];
    const w = [[25, 150, BLUE], [150, 205, AMB], [205, 330, BLUE], [330, 385, AMB]].map(([a, b, col]) => hide(wedgeP(svg, V, a, b, 120, col, 0.24)));
    const g1 = hide(glow(svg, P(V, 205, 225), P(V, 25, 225), PUR)), g2 = hide(glow(svg, P(V, 150, 225), P(V, 330, 225), GRN));
    lineP(svg, V, 25, 225, { w: 4 }); lineP(svg, V, 150, 225, { w: 4 });
    const labs = [[25, 150, '∠1'], [150, 205, '∠2'], [205, 330, '∠3'], [330, 385, '∠4']].map(([a, b, t]) => arcL(svg, V, a, b, 56, t, { size: 26, lr: 96, italic: false }).t);
    vdot(svg, V, { r: 5 });
    const X0 = ox + 520;
    const rows = [`${T('\\angle 1+\\angle 2=180^\\circ')}`, `${T('\\angle 3+\\angle 2=180^\\circ')}`, `${T('\\angle 1=180^\\circ-\\angle 2=\\angle 3')}`, `${T('\\angle 2=55^\\circ,\\ \\angle 1=\\angle 3=125^\\circ')}`]
      .map((html, i) => hide(hb(stage, html, X0, 30 + i * 90, 370, 70, 'u5l6-step' + (i === 2 ? ' u5l6-res' : ''))));
    return [
      { cap: `${T('\\angle 1')} and ${T('\\angle 2')} make a <b>straight line</b>: ${T('\\angle 1+\\angle 2=180^\\circ')}.`, run: async (c) => { await showAll(c, [g1, w[0], w[1]], 450); await c.pop(rows[0]); } },
      { cap: `${T('\\angle 3')} and ${T('\\angle 2')} make the <b>other</b> straight line: ${T('\\angle 3+\\angle 2=180^\\circ')}.`, run: async (c) => { await c.anim(g1, [{ opacity: 1 }, { opacity: 0 }], 300); await c.anim(w[0], [{ opacity: 1 }, { opacity: 0.25 }], 300); await showAll(c, [g2, w[2]], 450); await c.pop(rows[1]); } },
      { cap: `So ${T('\\angle 1')} and ${T('\\angle 3')} are both “${T('180^\\circ')} minus ${T('\\angle 2')}”. They must be <b>equal</b>.`, run: async (c) => { await c.anim(g2, [{ opacity: 1 }, { opacity: 0 }], 300); await c.anim(w[0], [{ opacity: 0.25 }, { opacity: 1 }], 300); await c.pop(rows[2]); } },
      { cap: `The same works for ${T('\\angle 2')} and ${T('\\angle 4')}. Here ${T('\\angle 2=55^\\circ')}, so ${T('\\angle 1=\\angle 3=180^\\circ-55^\\circ=125^\\circ')}.`, run: async (c) => { await show(c, w[3], 400); labs[0].textContent = '125°'; labs[2].textContent = '125°'; labs[1].textContent = '55°'; labs[3].textContent = '55°'; await c.pop(rows[3]); } }
    ];
  }
};

/* ======================================================================================
 * 4. A full turn, angles around a point, the ceiling fan, the reflex angle (Example 7)
 * ====================================================================================== */
const around = {
  title: 'All the way around: 360°',
  height: 430,
  minW: 900,
  choices: [{ v: 'turn', label: 'A full turn' }, { sep: 'Example 7 check:' }, { v: 'a', label: '(a) Find x' }, { v: 'b', label: '(b) Ceiling fan' }, { v: 'c', label: '(c) Reflex angle' }],
  ask: (v) => ({ turn: 'How many degrees is one full turn?', a: `Example 7(a): four angles around a point. Find ${T('x')}.`, b: 'Example 7(b): a ceiling fan has 5 blades, evenly spaced. What angle is between two blades next to each other?', c: `Example 7(c): ${T('\\angle AOB=130^\\circ')}. How big is the reflex angle ${T('AOB')}?` }[v]),
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 900) / 2, svg = stageSvg(stage, W, 430), V = [ox + 250, 215], X0 = ox + 520;
    const eqs = (list) => list.map((html, i) => hide(hb(stage, html, X0, 40 + i * 90, 370, 70, 'u5l6-step' + (i === list.length - 1 ? ' u5l6-res' : ''))));
    if (v === 'turn') {
      const wd = wedgeP(svg, V, 0, 0.5, 170, BRNSOFT, 0.5), ray = seg(svg, V, P(V, 0, 190), { w: 5, color: '#6e4a1c' }); rayP(svg, V, 0, 190, { w: 3, color: GREY });
      const cnt = hb(stage, T('0^\\circ'), X0, 300, 160, 60, 'u5l6-eq'); vdot(svg, V, { r: 5 });
      const parts = [[0, 120, BLUE], [120, 270, AMB], [270, 360, GRN]].map(([a, b, col]) => { const g = hide(svgEl('g', {}, svg)); wedgeP(g, V, a, b, 150, col, 0.25); rayP(g, V, a, 190, { w: 4 }); labAt(g, V, (a + b) / 2, 110, `${b - a}°`, { size: 26, color: col === AMB ? '#a86a08' : col }); return g; });
      const [e1, e2] = eqs([`A full turn ${T('=360^\\circ')}`, T('120^\\circ+150^\\circ+90^\\circ=360^\\circ')]);
      return [
        { cap: 'Turn a ray all the way around, back to where it started.', run: (c) => tween(c, 2600, (t) => { const d = 360 * t; ray.setAttribute('d', M(V, P(V, d, 190))); wd.setAttribute('d', wedgeD(V, 170, 0, Math.max(0.5, d))); cnt.firstChild.innerHTML = T(DG(Math.round(d))); }) },
        { cap: `One <b>full turn</b> is ${T('360^\\circ')}.`, run: (c) => c.pop(e1) },
        { cap: `Split the turn into angles <b>around a point</b>, with no gaps and no overlaps. They add up to ${T('360^\\circ')}.`, run: async (c) => { await c.anim(wd, [{ opacity: 1 }, { opacity: 0 }], 300); for (const g of parts) await show(c, g, 400); await c.pop(e2); } }
      ];
    }
    if (v === 'a') {
      const A = [[0, 95, BLUE, '95°'], [95, 205, AMB, '110°'], [205, 283, GRN, '78°'], [283, 360, RED, 'x']];
      [0, 95, 205, 283].forEach((d) => rayP(svg, V, d, 195, { w: 4 }));
      const ws = A.map(([a, b, col]) => hide(wedgeP(svg, V, a, b, 150, col, 0.24)));
      const ls = A.map(([a, b, col, t]) => arcL(svg, V, a, b, 60, t, { size: 26, lr: 100, color: col === AMB ? '#a86a08' : col }).t); vdot(svg, V, { r: 5 });
      const [e1, e2, e3] = eqs([T('95^\\circ+110^\\circ+78^\\circ+x=360^\\circ'), T('283^\\circ+x=360^\\circ'), T('x=360^\\circ-283^\\circ=77^\\circ')]);
      return [
        { cap: 'Four angles around a point: no gaps, no overlaps.', run: async (c) => { for (const w of ws) await show(c, w, 320); } },
        { cap: `Angles around a point add up to ${T('360^\\circ')}.`, run: (c) => c.pop(e1) },
        { cap: `Add the three you know: ${T('95+110+78=283')}.`, run: (c) => c.pop(e2) },
        { cap: `Subtract: ${T('x=360^\\circ-283^\\circ=77^\\circ')}.`, run: async (c) => { ls[3].textContent = '77°'; ls[3].style.fontStyle = 'normal'; await c.pop(e3); } }
      ];
    }
    if (v === 'b') {
      const fan = grp(svg);
      for (let k = 0; k < 5; k++) {
        const d = 90 + 72 * k, n = P([0, 0], d + 90, 1), a = P(V, d, 34), b = P(V, d, 178);
        svgEl('path', { d: `M${f2(a[0] + n[0] * 12)} ${f2(a[1] + n[1] * 12)}L${f2(b[0] + n[0] * 22)} ${f2(b[1] + n[1] * 22)}Q${f2(P(b, d, 14)[0])} ${f2(P(b, d, 14)[1])} ${f2(b[0] - n[0] * 22)} ${f2(b[1] - n[1] * 22)}L${f2(a[0] - n[0] * 12)} ${f2(a[1] - n[1] * 12)}Z`, fill: '#c49a63', stroke: '#7a5124', 'stroke-width': 2.5 }, fan);
      }
      svgEl('circle', { cx: V[0], cy: V[1], r: 32, fill: '#d6d8de', stroke: INK, 'stroke-width': 3 }, fan);
      const ws = [0, 1, 2, 3, 4].map((k) => hide(wedgeP(svg, V, 90 + 72 * k, 162 + 72 * k, 200, k % 2 ? AMB : BLUE, 0.18)));
      const ls = [0, 1, 2, 3, 4].map((k) => hide(labAt(svg, V, 126 + 72 * k, 112, '?', { size: 26, color: INK })));
      const [e1, e2] = eqs([`5 equal angles make ${T('360^\\circ')}`, T('360^\\circ\\div5=72^\\circ')]);
      return [
        { cap: 'The fan spins… and stops.', run: (c) => tween(c, 3000, (t) => fan.setAttribute('transform', `rotate(${f2(-(720 * (1 - Math.pow(1 - t, 3))))} ${V[0]} ${V[1]})`), (t) => t) },
        { cap: `The 5 blades are evenly spaced, so the 5 angles between them are <b>equal</b>. Together they go all the way around: ${T('360^\\circ')}.`, run: async (c) => { await showAll(c, ws, 450); await showAll(c, ls, 300); await c.pop(e1); } },
        { cap: `${T('360^\\circ\\div5=72^\\circ')} between blades.`, run: async (c) => { ls.forEach((l) => { l.textContent = '72°'; l.setAttribute('fill', RED); }); await c.pop(e2); } }
      ];
    }
    rayP(svg, V, 0, 200, { w: 4 }); rayP(svg, V, 130, 200, { w: 4 });
    wedgeP(svg, V, 0, 130, 70, BLUE, 0.22); arcL(svg, V, 0, 130, 46, '130°', { size: 26, color: BLUE, lr: 84 }); vdot(svg, V, { r: 5 });
    txt(svg, V[0] - 18, V[1] + 24, 'O', { size: 26 }); txt(svg, V[0] + 200, V[1] + 24, 'B', { size: 26 }); labAt(svg, V, 130, 224, 'A', { size: 26 });
    const rw = wedgeP(svg, V, 130, 130.5, 110, RED, 0.16), ra = arcP(svg, V, 130, 130.5, 110, { color: RED, w: 3.6 });
    const rl = hide(labAt(svg, V, 245, 145, 'reflex: ?', { size: 26, color: RED }));
    const [e1, e2] = eqs([T('130^\\circ+\\text{reflex}=360^\\circ'), T('\\text{reflex}=360^\\circ-130^\\circ=230^\\circ')]);
    hide(rw, ra);
    return [
      { cap: `${T('\\angle AOB=130^\\circ')} goes the <b>short way</b> around, from ${T('OB')} to ${T('OA')}.`, run: (c) => c.sleep(200) },
      { cap: 'The <b>reflex</b> angle goes the <b>long way</b> around.', run: async (c) => { rw.style.opacity = 1; ra.style.opacity = 1; await tween(c, 1800, (t) => { const s = 0.5 + 229.5 * t; ra.setAttribute('d', arcD(V, 110, 130, s)); rw.setAttribute('d', wedgeD(V, 110, 130, s)); }); await show(c, rl); } },
      { cap: `Together they make a full turn: ${T('130^\\circ+\\text{reflex}=360^\\circ')}.`, run: (c) => c.pop(e1) },
      { cap: `The reflex angle is ${T('360^\\circ-130^\\circ=230^\\circ')}.`, run: async (c) => { rl.textContent = 'reflex: 230°'; await c.pop(e2); } }
    ];
  }
};

/* ======================================================================================
 * 5. One angle at a time, with reasons (Examples 6(d), 8 and 9(b))
 * ====================================================================================== */
const rz = (t) => t.replace(/∠([a-d])/g, (m, x) => T('\\angle ' + x)).replace(/ ([a-d])$/, (m, x) => ' ' + T(x)).replace(/(\d+)°/g, (m, n) => T(n + '^\\circ'));
const reasons = {
  title: 'One angle at a time, with a reason',
  height: 440,
  minW: 900,
  choices: [{ sep: 'Example 6(d) check:' }, { v: 'six', label: 'Only ∠a = 36°' }, { sep: 'Example 8 check:' }, { v: 'eight', label: 'Find a, b, c, d' }, { sep: 'Example 9(b) check:' }, { v: 'pool', label: 'The pool ball' }],
  ask: (v) => ({ six: `Example 6(d): you only know ${T('\\angle a=36^\\circ')}. Find the other three without a protractor.`, eight: `Example 8: three straight lines cross at one point. Find ${T('a')}, ${T('b')}, ${T('c')} and ${T('d')}. Give a reason for each.`, pool: `Example 9(b): a pool ball comes in at ${T('40^\\circ')} to the cushion and leaves at ${T('40^\\circ')}. Find ${T('p')}.` }[v]),
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 900) / 2, svg = stageSvg(stage, W, 440);
    if (v === 'pool') return poolScene(stage, svg, ox);
    const V = [ox + 225, 220], L = 205;
    const D = v === 'six'
      ? { lines: [15, 51], known: [[15, 51, '36°', BLUE]], find: [['c', 195, 231, '36°', BLUE, '36°', 'vertically opposite ∠a', null], ['b', 51, 195, '144°', AMB, '180° − 36° = 144°', 'angles on a straight line', [15, 195]], ['d', 231, 375, '144°', AMB, '144°', 'vertically opposite ∠b', null]],
        letters: { a: [15, 51], b: [51, 195], c: [195, 231], d: [231, 375] }, check: '36+144+36+144=360' }
      : { lines: [0, 48, 122], known: [[0, 48, '48°', BLUE], [48, 122, '74°', GRN]], find: [['a', 122, 180, '58°', AMB, '180 − 48 − 74 = 58°', 'angles on a straight line', [0, 180]], ['b', 180, 228, '48°', BLUE, '48°', 'vertically opposite the 48°', null], ['c', 228, 302, '74°', GRN, '74°', 'vertically opposite the 74°', null], ['d', 302, 360, '58°', AMB, '58°', 'vertically opposite a', null]],
        letters: { a: [122, 180], b: [180, 228], c: [228, 302], d: [302, 360] }, check: '48+74+58+48+74+58=360' };
    D.known.forEach(([a, b, , col]) => wedgeP(svg, V, a, b, 130, col, 0.22));
    const fw = D.find.map(([, a, b, , col]) => hide(wedgeP(svg, V, a, b, 130, col, 0.22)));
    D.lines.forEach((d) => lineP(svg, V, d, L, { w: 4 }));
    const gls = D.find.map(([, , , , , , , gl]) => (gl ? hide(svgEl('path', { d: arcD(V, 175, gl[0], gl[1] - gl[0]), stroke: PUR, 'stroke-width': 14, 'stroke-opacity': 0.3, fill: 'none' }, svg)) : null));
    const R = v === 'six' ? 64 : 58, LR = v === 'six' ? 100 : 94;
    if (v === 'six') arcL(svg, V, 15, 51, R, '36°', { size: 24, color: BLUE, lr: 134 });
    else D.known.forEach(([a, b, t, col]) => arcL(svg, V, a, b, R, t, { size: 24, color: col, lr: LR }));
    const lab = {};
    Object.entries(D.letters).forEach(([k, [a, b]]) => { if (v === 'six' && k === 'a') { labAt(svg, V, 33, 94, 'a', { size: 26, italic: true }); return; } const r = arcL(svg, V, a, b, R, k, { size: 26, lr: LR }); lab[k] = r.t; });
    vdot(svg, V, { r: 5 });
    // the table
    const X0 = ox + 470, tb = add(stage, box(h('div', 'u5l6-rtab'), 420, 50 + 62 * D.find.length), X0, 14);
    tb.innerHTML = '<div class="u5l6-rh"><span>Angle</span><span>Work</span><span>Reason</span></div>';
    const rows = D.find.map(([k, , , , , work, reason]) => { const r = h('div', 'u5l6-rr', `<span>${T(k)}</span><span>${T(work.replace(/°/g, '^\\circ').replace(/−/g, '-'))}</span><span>${rz(reason)}</span>`); r.style.opacity = 0; tb.appendChild(r); return r; });
    const chk = hide(hb(stage, `Check: ${T(D.check + '\\ \\checkmark')}`, X0, 70 + 62 * D.find.length, 420, 58, 'u5l6-eq u5l6-res u5l6-sm'));
    const st = hide(stamp(stage, '360°', { ok: true, x: X0 + 380, y: 414, rotate: -8 }));
    const capOf = ([k, , , val, , work, reason, gl]) => gl ? `${T(k)} is next to what you know, on a <b>straight line</b>: ${T(k + '=' + work.replace(/°/g, '^\\circ').replace(/−/g, '-'))}.` : `${T(k)} is <b>across from</b> an angle you know: ${rz(reason)}, so ${T(k + '=' + val.replace('°', '^\\circ'))}.`;
    return [
      ...D.find.map((f, i) => ({ cap: capOf(f), run: async (c) => { if (gls[i]) await show(c, gls[i], 400); await show(c, fw[i], 400); lab[f[0]].textContent = f[3]; lab[f[0]].setAttribute('fill', RED); lab[f[0]].style.fontStyle = 'normal'; await c.fadeIn(rows[i]); if (gls[i]) await c.anim(gls[i], [{ opacity: 1 }, { opacity: 0 }], 400); } })),
      { cap: `<b>Check:</b> the angles around the point add up to ${T('360^\\circ')}: ${T(D.check)}.`, run: async (c) => { await c.pop(chk); st.style.opacity = 1; await stampIn(c, st); } }
    ];
  }
};
function poolScene(stage, svg, ox) {
  const V = [ox + 450, 330], S = P(V, 140, 330), E = P(V, 40, 330);
  svgEl('rect', { x: ox + 20, y: 20, width: 860, height: 310, rx: 10, fill: '#2f7d4f' }, svg);
  svgEl('rect', { x: ox + 20, y: 330, width: 860, height: 40, fill: '#7a4a26' }, svg);
  const cush = seg(svg, [ox + 20, 330], [ox + 880, 330], { color: '#1d4d31', w: 6 });
  const tIn = seg(svg, S, S, { color: '#fff', w: 3, dash: '10 8' }), tOut = seg(svg, V, V, { color: '#fff', w: 3, dash: '10 8' });
  const ball = svgEl('circle', { cx: S[0], cy: S[1], r: 15, fill: '#fff', stroke: '#1c2230', 'stroke-width': 2 }, svg);
  const Y = '#ffe08a', arcs = hide(svgEl('g', {}, svg));
  arcL(arcs, V, 0, 40, 100, '40°', { size: 26, color: Y, lr: 134, halo: false }); arcL(arcs, V, 140, 180, 100, '40°', { size: 26, color: Y, lr: 134, halo: false });
  const pp = hide(svgEl('g', {}, svg)); const pl = arcL(pp, V, 40, 140, 80, 'p', { size: 30, color: '#fff', lr: 114, halo: false }).t;
  const gl = hide(seg(svg, [ox + 20, 330], [ox + 880, 330], { color: Y, w: 14, op: 0.45 }));
  const e1 = hide(hb(stage, T('40^\\circ+p+40^\\circ=180^\\circ'), ox + 40, 378, 380, 56, 'u5l6-eq')), e2 = hide(hb(stage, T('p=180^\\circ-80^\\circ=100^\\circ'), ox + 470, 378, 390, 56, 'u5l6-eq u5l6-res'));
  void cush;
  const roll = (c) => tween(c, 2400, (t) => {
    const u = t < 0.5 ? t * 2 : 1, w = t < 0.5 ? 0 : (t - 0.5) * 2;
    const q = t < 0.5 ? [S[0] + (V[0] - S[0]) * u, S[1] + (V[1] - S[1]) * u] : [V[0] + (E[0] - V[0]) * w, V[1] + (E[1] - V[1]) * w];
    tIn.setAttribute('d', M(S, t < 0.5 ? q : V)); tOut.setAttribute('d', M(V, t < 0.5 ? V : q));
    ball.setAttribute('cx', f2(q[0])); ball.setAttribute('cy', f2(q[1]));
  }, (t) => t);
  return [
    { cap: 'The ball rolls in and bounces off the cushion.', run: (c) => roll(c) },
    { cap: `It comes in at ${T('40^\\circ')} and leaves at ${T('40^\\circ')}, both measured from the cushion.`, run: (c) => show(c, arcs, 450) },
    { cap: `The cushion is a <b>straight line</b>, so the three angles add to ${T('180^\\circ')}: ${T('40^\\circ+p+40^\\circ=180^\\circ')}.`, run: async (c) => { await show(c, gl, 400); await show(c, pp, 400); await c.pop(e1); } },
    { cap: `${T('p=180^\\circ-80^\\circ=100^\\circ')}`, run: async (c) => { pl.textContent = '100°'; pl.style.fontStyle = 'normal'; await c.pop(e2); } }
  ];
}

mountExplainers({ adjacent, partners, slide, fill, verdict, missing, scissors, why, around, reasons });
figures();

/* ======================================================================================
 * Example 6: a protractor on the two crossing lines (measure a, b, c, d)
 * ====================================================================================== */
function protractorTool() {
  const host = document.getElementById('u5l6-prot'); if (!host) return;
  const V = [320, 196], ANG = { a: [15, 51], b: [51, 195], c: [195, 231], d: [231, 375] };
  const pr = Geo.protractor(host, { width: 640, height: 560, r: 188, hidden: true, buttons: ['place', 'hide', 'scale'], angle: { vertex: V, a1: 15, a2: 51, len: 150, color: BLUE } });
  // the two lines and the letters, under the protractor
  const base = svgEl('g', {}, null); pr.svg.insertBefore(base, pr.svg.firstChild);
  [15, 51].forEach((d) => lineP(base, V, d, 150, { w: 3.4 }));
  [['a', 33], ['b', 123], ['c', 213], ['d', 303]].forEach(([k, d]) => labAt(base, V, d, 62, k, { size: 26, italic: true }));
  vdot(base, V, { r: 4.5 });
  const row = h('div', 'geo-btns u5l6-mrow'); row.appendChild(h('span', 'u5l6-ml', 'Measure:'));
  const btns = Object.keys(ANG).map((k) => {
    const b = h('button', 'pill small', `∠${k}`); b.type = 'button'; b.setAttribute('aria-pressed', String(k === 'a'));
    b.onclick = () => { btns.forEach((x) => x.setAttribute('aria-pressed', String(x === b))); pr.setAngle({ vertex: V, a1: ANG[k][0], a2: ANG[k][1], len: 150, color: BLUE }); };
    row.appendChild(b); return b;
  });
  pr.el.insertBefore(row, pr.el.querySelector('.geo-btns'));
}
protractorTool();

/* ======================================================================================
 * Stand Up Break! — partners, a missing angle, crossing lines / around a point
 * ====================================================================================== */
function figStr({ W = 300, H = 200, V, lines = [], rays = [], arcs = [], right = null, len = 120 }) {
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="max-width:100%">`;
  const L = (A, B) => `<path d="${M(A, B)}" stroke="#1c2230" stroke-width="3" stroke-linecap="round" fill="none"/>`;
  lines.forEach((d) => { s += L(P(V, d + 180, len), P(V, d, len)); });
  rays.forEach((d) => { s += L(V, P(V, d, len)); });
  if (right != null) { const u = P([0, 0], right, 1), v = P([0, 0], right + 90, 1), k = 15; s += `<path d="M${f2(V[0] + u[0] * k)} ${f2(V[1] + u[1] * k)}L${f2(V[0] + (u[0] + v[0]) * k)} ${f2(V[1] + (u[1] + v[1]) * k)}L${f2(V[0] + v[0] * k)} ${f2(V[1] + v[1] * k)}" stroke="#1c2230" stroke-width="2" fill="none"/>`; }
  arcs.forEach(([a0, a1, r, lab]) => {
    s += `<path d="${arcD(V, r, a0, a1 - a0)}" stroke="#1c2230" stroke-width="2" fill="none"/>`;
    const q = P(V, (a0 + a1) / 2, r + 22), it = /^[a-z]$/.test(lab);
    s += `<text x="${f2(q[0])}" y="${f2(q[1])}" font-size="20" font-weight="700" text-anchor="middle" dominant-baseline="central"${it ? ' font-style="italic"' : ''} fill="#1c2230">${lab}</text>`;
  });
  return s + `<circle cx="${f2(V[0])}" cy="${f2(V[1])}" r="4" fill="#1c2230"/></svg>`;
}
standup('u5l6', {
  intro: 'Write the equation first. Then subtract. For crossing lines, give a reason for each angle.',
  levels: {
    BEG: (r) => {
      if (r.chance(0.5)) { const A = r.int(11, 79); return { text: `Find the <b>complement</b> of ${T(DG(A))}.`, q: '', a: [`90^\\circ-${DG(A)}=${DG(90 - A)}`] }; }
      const A = r.int(12, 168); return { text: `Find the <b>supplement</b> of ${T(DG(A))}.`, q: '', a: [`180^\\circ-${DG(A)}=${DG(180 - A)}`] };
    },
    PRG: (r) => {
      if (r.chance(0.6)) {
        let a, b; do { a = r.int(28, 80); b = r.int(28, 80); } while (180 - a - b < 28);
        const x = 180 - a - b, V = [150, 160];
        return { text: `The angles are on a straight line. Find ${T('x')}.`, q: '', fig: figStr({ W: 300, H: 190, V, lines: [0], rays: [a, 180 - b], len: 130, arcs: [[0, a, 40, a + '°'], [a, 180 - b, 40, 'x'], [180 - b, 180, 40, b + '°']] }),
          a: [`${DG(a)}+x+${DG(b)}=180^\\circ`, `x=180^\\circ-${DG(a)}-${DG(b)}`, `x=${DG(x)}`] };
      }
      let a, b; do { a = r.int(18, 40); b = r.int(18, 40); } while (90 - a - b < 18);
      const x = 90 - a - b, V = [40, 180];
      return { text: `Find ${T('x')}.`, q: '', fig: figStr({ W: 260, H: 200, V, rays: [0, 90, a, 90 - b], right: 0, len: 165, arcs: [[0, a, 70, a + '°'], [a, 90 - b, 105, 'x'], [90 - b, 90, 70, b + '°']] }),
        a: [`${DG(a)}+x+${DG(b)}=90^\\circ`, `x=90^\\circ-${DG(a)}-${DG(b)}`, `x=${DG(x)}`] };
    },
    MAS: (r) => {
      if (r.chance(0.5)) {
        let k; do { k = r.int(28, 152); } while (Math.abs(k - 90) < 8);
        const o = r.int(-15, 15), V = [150, 120];
        return { text: `Two straight lines cross. Find ${T('a')}, ${T('b')} and ${T('c')}. Give a reason for each.`, q: '', fig: figStr({ W: 300, H: 240, V, lines: [o, o + k], len: 115, arcs: [[o, o + k, 34, k + '°'], [o + k, o + 180, 34, 'a'], [o + 180, o + 180 + k, 34, 'b'], [o + 180 + k, o + 360, 34, 'c']] }),
          a: [`a=180^\\circ-${DG(k)}=${DG(180 - k)}\\ \\text{(straight line)}`, `b=${DG(k)}\\ \\text{(vertically opposite)}`, `c=${DG(180 - k)}\\ \\text{(vertically opposite } a)`] };
      }
      let p, q, s, x; do { p = r.int(70, 130); q = r.int(60, 115); s = r.int(50, 100); x = 360 - p - q - s; } while (x < 40 || x > 130);
      const V = [150, 120];
      return { text: `Angles around a point. Find ${T('x')}.`, q: '', fig: figStr({ W: 300, H: 240, V, rays: [0, p, p + q, p + q + s], len: 110, arcs: [[0, p, 34, p + '°'], [p, p + q, 34, q + '°'], [p + q, p + q + s, 34, s + '°'], [p + q + s, 360, 34, 'x']] }),
        a: [`${DG(p)}+${DG(q)}+${DG(s)}+x=360^\\circ`, `${DG(p + q + s)}+x=360^\\circ`, `x=${DG(x)}`] };
    }
  }
});
