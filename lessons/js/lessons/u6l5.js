/* Math 10-3 · Unit 6 · Lesson 5 — Similar Triangles.
 * Explainers (Class view unless marked Full): the AA test (find the third angles, colour the angles by size, then pick up
 * the second triangle, flip/turn/shrink it and slide it into a corner of the first: it fits or it doesn't; Example 1),
 * why two angles are enough (Full: stretch the base, the third angle and the ratios never change), name them in order
 * (count the arcs, join the letters, the sides follow; Example 2), a missing side in 4 steps (Examples 3 and 4),
 * every side × k (Full: Geo.similar grows ABC into DEF with live ratio chips), same triangle on top (right vs flipped
 * proportion, verdict stamps), the ramp post that slides (live height ÷ ground; drag it; Example 5), pull nested
 * triangles apart (Example 6), turn the bow tie (a half turn nests it; Example 7), and F, Z and X (Full).
 * Also the static figures and the Stand Up Break. Triangles are drawn here (any turn or flip); Geo (lessons/js/geo.js)
 * supplies the angle maths, text, Geo.similar and the colours. */
import { h, add, box, tex, svgEl, tween, stamp, stampIn, mountExplainers } from '../blocks.js';
import { Geo } from '../geo.js';
import { standup } from '../standup.js';

const { arcD, wedgeD, n360, dirTo } = Geo;
const P = Geo.at;                                   // P(V, deg, r): the point r from V in direction deg (math degrees)
const T = (s) => tex(String(s));
const DG = (v) => `${v}^\\circ`;
const RAD = Math.PI / 180;
const INK = '#1c2230', RED = '#c93a33', BLUE = '#1f5bd6', GRN = '#12805a', PUR = '#7b4fc4', AMB = '#d08a12', GREY = '#8a8f9a';
const BRN = '#6e4a1c', TEAL = '#0f8ea8', PINK = '#b8457a';
const ACOL = [BLUE, AMB, GRN];                      // 1 arc, 2 arcs, 3 arcs
const SCOL = [PUR, TEAL, PINK];                     // matching side pairs
const FILL0 = '#e9edf4', FILL1 = '#fbf1de';
const f2 = (v) => +v.toFixed(2);
const sin = (d) => Math.sin(d * RAD), cos = (d) => Math.cos(d * RAD);
const dist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const lerp = (a, b, t) => a + (b - a) * t;
const lerpP = (p, q, t) => [lerp(p[0], q[0], t), lerp(p[1], q[1], t)];
const cen = (Q) => [(Q[0][0] + Q[1][0] + Q[2][0]) / 3, (Q[0][1] + Q[1][1] + Q[2][1]) / 3];
const polyD = (Q) => 'M' + Q.map((p) => `${f2(p[0])} ${f2(p[1])}`).join('L') + 'Z';
const M = (A, B) => `M${f2(A[0])} ${f2(A[1])}L${f2(B[0])} ${f2(B[1])}`;

/* ---------------- triangles in math coordinates (y up), booklet style: L = (0, 0), R = (base, 0), T on top ---------------- */
function triAA(base, aL, aR) { const r = base * sin(aR) / sin(aL + aR); return [[0, 0], [base, 0], [r * cos(aL), r * sin(aL)]]; }
function triSSS(base, left, right) { const x = (base * base + left * left - right * right) / (2 * base); return [[0, 0], [base, 0], [x, Math.sqrt(left * left - x * x)]]; }
/** TikZ scope order: flip (xscale = −1), then rotate, then shift */
function tf(pts, o = {}) {
  const c = cos(o.rot || 0), s = sin(o.rot || 0), sh = o.shift || [0, 0];
  return pts.map(([x, y]) => { x = o.flip ? -x : x; return [x * c - y * s + sh[0], x * s + y * c + sh[1]]; });
}
const bbox = (pts) => { const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]); return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) }; };
/** many shapes (math coords) fitted together into a W × H box: → { S: [screen pts per shape], s (px per unit), F (math → screen) } */
function fitWorld(shapes, x, y, W, H, maxS = Infinity) {
  const b = bbox(shapes.flat()), s = Math.min(W / Math.max(b.x1 - b.x0, 1e-6), H / Math.max(b.y1 - b.y0, 1e-6), maxS);
  const ox = x + (W - (b.x1 - b.x0) * s) / 2 - b.x0 * s, oy = y + (H - (b.y1 - b.y0) * s) / 2 + b.y1 * s;
  const F = (p) => [ox + p[0] * s, oy - p[1] * s];
  return { S: shapes.map((sh) => sh.map(F)), s, F };
}
/** each shape in its own box, all at one common scale */
function fitEach(shapes, boxes) {
  const s = Math.min(...shapes.map((sh, i) => { const b = bbox(sh); return Math.min(boxes[i][2] / (b.x1 - b.x0), boxes[i][3] / (b.y1 - b.y0)); }));
  return shapes.map((sh, i) => { const b = bbox(sh), [x, y, W, H] = boxes[i], ox = x + (W - (b.x1 - b.x0) * s) / 2 - b.x0 * s, oy = y + (H - (b.y1 - b.y0) * s) / 2 + b.y1 * s; return sh.map((p) => [ox + p[0] * s, oy - p[1] * s]); });
}

/* ---------------- drawing (screen px) ---------------- */
/** interior wedge of triangle Q at vertex i: { start, span } in math degrees */
function corner(Q, i) {
  const V = Q[i]; let d1 = dirTo(V, Q[(i + 1) % 3]), d2 = dirTo(V, Q[(i + 2) % 3]), sp = n360(d2 - d1);
  if (sp > 180) { [d1, d2] = [d2, d1]; sp = 360 - sp; }
  return { start: d1, span: sp };
}
function txt(p, x, y, s, o = {}) { return Geo.text(p, x, y, s, { size: o.size || 20, color: o.color || INK, italic: o.italic, weight: o.weight || 700, halo: o.halo }); }
function seg(p, A, B, o = {}) { return svgEl('path', { d: M(A, B), stroke: o.color || INK, 'stroke-width': o.w || 3, 'stroke-linecap': o.cap || 'round', fill: 'none', 'stroke-dasharray': o.dash || null, 'stroke-opacity': o.op ?? null }, p); }
const grp = (p, cls) => svgEl('g', cls ? { class: cls } : {}, p);
/** angle marks at V: n arcs (1–3), or a right-angle square ('r') */
function angMark(p, V, cn, n, o = {}) {
  const g = grp(p), col = o.color || INK, r = o.r || 22;
  if (n === 'r') {
    const s = o.rs || 14, u = P([0, 0], cn.start, 1), v = P([0, 0], cn.start + 90, 1);
    svgEl('path', { d: `M${f2(V[0] + u[0] * s)} ${f2(V[1] + u[1] * s)}L${f2(V[0] + (u[0] + v[0]) * s)} ${f2(V[1] + (u[1] + v[1]) * s)}L${f2(V[0] + v[0] * s)} ${f2(V[1] + v[1] * s)}`, stroke: col, 'stroke-width': o.w || 2.2, fill: 'none' }, g);
  } else for (let k = 0; k < n; k++) svgEl('path', { d: arcD(V, r + k * 6, cn.start, cn.span), stroke: col, 'stroke-width': o.w || 2.2, fill: 'none' }, g);
  return g;
}
const wedge = (p, V, cn, r, color, op = 0.3) => svgEl('path', { d: wedgeD(V, r, cn.start, cn.span), fill: color, 'fill-opacity': op, stroke: 'none' }, p);
/** a label inside the angle at vertex i */
function angLab(p, Q, i, s, o = {}) {
  const cn = corner(Q, i), size = o.size || 19, hw = String(s).length * size * 0.3 + 3, r = o.r || 22;
  const lr = o.lr ?? Math.min(o.lrMax ? o.lrMax + (cn.span < 40 ? 16 : 0) : 125, Math.max(r + size * 0.95, (hw + size * 0.35) / Math.max(0.14, sin(cn.span / 2)) + 4));
  const q = P(Q[i], cn.start + cn.span / 2, lr);
  return txt(p, q[0], q[1], s, { size, color: o.color, italic: o.italic, halo: o.halo });
}
/** a label beside side i (Q[i] → Q[i+1]), outside the triangle */
function sideLab(p, Q, i, s, o = {}) {
  const A = Q[i], B = Q[(i + 1) % 3], C = cen(Q), Mp = lerpP(A, B, 0.5);
  let nrm = P([0, 0], dirTo(A, B) + 90, 1);
  if ((C[0] - Mp[0]) * nrm[0] + (C[1] - Mp[1]) * nrm[1] > 0) nrm = [-nrm[0], -nrm[1]];
  const size = o.size || 19, hw = String(s).length * size * 0.29 + 3, d = (o.gap ?? 9) + Math.abs(nrm[0]) * hw + Math.abs(nrm[1]) * size * 0.55;
  return txt(p, Mp[0] + nrm[0] * d, Mp[1] + nrm[1] * d, s, { size, color: o.color, italic: o.italic ?? /^[a-z?]$/.test(s), halo: o.halo });
}
function nameLab(p, Q, i, s, o = {}) {
  const C = cen(Q), V = Q[i], d = dist(C, V) || 1, k = o.d || 21, q = [V[0] + (V[0] - C[0]) / d * k, V[1] + (V[1] - C[1]) / d * k];
  return txt(p, q[0], q[1], s, { size: o.size || 22, color: o.color, italic: true });
}
/** a triangle: o = { fill, stroke, w, arcs: [n|'r'|0 ×3], arcColor, angs: [label ×3], angColors, sides: [label ×3], sideColors, names: 'ABC', size } */
function drawTri(p, Q, o = {}) {
  const g = grp(p), R = { g, Q, marks: [], angs: [], sides: [], names: [], wedges: [] };
  R.fill = svgEl('path', { d: polyD(Q), fill: o.fill || 'none', stroke: 'none' }, g);
  R.wg = grp(g);
  R.edge = svgEl('path', { d: polyD(Q), fill: 'none', stroke: o.stroke || INK, 'stroke-width': o.w || 3.2, 'stroke-linejoin': 'round' }, g);
  for (let i = 0; i < 3; i++) {
    const n = o.arcs && o.arcs[i];
    if (n) R.marks[i] = angMark(g, Q[i], corner(Q, i), n, { color: o.arcColor || (o.arcColors && o.arcColors[i]) || INK, r: o.r, rs: o.rs });
    if (o.angs && o.angs[i] != null && o.angs[i] !== '') R.angs[i] = angLab(g, Q, i, o.angs[i], { size: o.size, color: o.angColors && o.angColors[i], r: o.r, lr: o.lrs && o.lrs[i], lrMax: o.lrMax });
    if (o.sides && o.sides[i] != null && o.sides[i] !== '') R.sides[i] = sideLab(g, Q, i, o.sides[i], { size: o.size, color: o.sideColors && o.sideColors[i], gap: o.gaps && o.gaps[i] });
    if (o.names && o.names[i]) R.names[i] = nameLab(g, Q, i, o.names[i], { size: (o.size || 19) + 3 });
  }
  return R;
}
/** a parallel-line arrow mark (>) at the middle of AB, pointing A → B */
function parMark(p, A, B, o = {}) {
  const Mp = lerpP(A, B, 0.5), d = dirTo(A, B), s = o.s || 8, a = P(Mp, d + 150, s * 1.4), b = P(Mp, d - 150, s * 1.4), tip = P(Mp, d, s * 0.5);
  return svgEl('path', { d: `M${f2(a[0])} ${f2(a[1])}L${f2(tip[0])} ${f2(tip[1])}L${f2(b[0])} ${f2(b[1])}`, stroke: o.color || INK, 'stroke-width': o.w || 2.4, fill: 'none', 'stroke-linejoin': 'round' }, p);
}
function rmark(p, V, dir, s = 15, o = {}) {
  const u = P([0, 0], dir, 1), v = P([0, 0], dir + 90, 1);
  return svgEl('path', { d: `M${f2(V[0] + u[0] * s)} ${f2(V[1] + u[1] * s)}L${f2(V[0] + (u[0] + v[0]) * s)} ${f2(V[1] + (u[1] + v[1]) * s)}L${f2(V[0] + v[0] * s)} ${f2(V[1] + v[1] * s)}`, stroke: o.color || INK, 'stroke-width': o.w || 2.2, fill: 'none' }, p);
}
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const show = (c, el, ms = 380) => (el ? c.anim(el, [{ opacity: 0 }, { opacity: 1 }], ms) : Promise.resolve());
const showAll = (c, els, ms = 380) => Promise.all(els.filter(Boolean).map((e) => show(c, e, ms)));
const dim = (c, el, to = 0.25, ms = 350) => c.anim(el, [{ opacity: 1 }, { opacity: to }], ms);
const flash = (c, el, ms = 900) => c.anim(el, [{ opacity: 1 }, { opacity: 0.25 }, { opacity: 1 }, { opacity: 0.25 }, { opacity: 1 }], ms);
const stageSvg = (stage, W, H) => { const s = add(stage, svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u6l5-svg' }), 0, 0); s.style.position = 'absolute'; return s; };
/** an HTML box (KaTeX welcome) at (x, y) */
const hb = (stage, html, x, y, w, hh, cls = '') => add(stage, box(h('div', 'u6l5-c ' + cls, `<div>${html}</div>`), w, hh), x, y);
const glow = (p, A, B, color = PUR, w = 14) => seg(p, A, B, { color, w, op: 0.32 });
/** set an SVG label's text and colour it as an answer */
const answer = (el, s, color = RED) => { el.textContent = s; el.setAttribute('fill', color); el.style.fontStyle = 'normal'; };

/* ======================================================================================
 * Static figures on the cards (labels that show with "Answer" have class u6l5-fa)
 * ====================================================================================== */
function fig(name, W, H, draw) {
  const host = document.querySelector(`.u6l5-fig[data-fig="${name}"]`); if (!host) return;
  host.style.width = W + 'px'; host.style.height = H + 'px';
  draw(svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}` }, host));
}
const ANS = (el) => { if (el) { el.classList.add('u6l5-fa'); el.setAttribute('fill', RED); } return el; };

/* Example 1 data (shared by the figures and the AA explainer); vals = the true angles at L, R, T */
const EX1 = {
  a: { t1: { pts: triAA(2.0, 47, 68), vals: [47, 68, 65], given: [1, 1, 0], eq: `${T('180^\\circ-(47^\\circ+68^\\circ)=65^\\circ')}` },
       t2: { pts: triAA(2.5, 65, 68), flip: true, vals: [65, 68, 47], given: [1, 1, 0], eq: `${T('180^\\circ-(65^\\circ+68^\\circ)=47^\\circ')}` },
       sim: true, match: [0, 2, 1, 1] },
  b: { t1: { pts: triAA(2.2, 90, 34), vals: [90, 34, 56], given: [1, 1, 0], rt: 0, eq: `${T('180^\\circ-(90^\\circ+34^\\circ)=56^\\circ')}` },
       t2: { pts: triAA(1.6, 90, 58), vals: [90, 58, 32], given: [1, 1, 0], rt: 0, eq: `${T('180^\\circ-(90^\\circ+58^\\circ)=32^\\circ')}` },
       sim: false, match: [0, 0, 1, 1] },
  c: { t1: { pts: triAA(1.3, 72, 72), vals: [72, 72, 36], given: [0, 0, 1], eq: `base angles ${T('(180^\\circ-36^\\circ)\\div2=72^\\circ')}` },
       t2: { pts: triAA(2.7, 36, 36), vals: [36, 36, 108], given: [1, 0, 0], eq: `${T('36^\\circ')} and top ${T('180^\\circ-72^\\circ=108^\\circ')}` },
       sim: false, match: [2, 0, 0, 1] }
};
const angTxt = (t, i, showAll) => (t.rt === i ? '' : (t.given[i] || showAll) ? t.vals[i] + '°' : '?');

function figures() {
  // Example 1: the three pairs (booklet layout: the second triangle shifted, (a) flipped)
  const e1 = { a: [{ shift: [0, 0] }, { shift: [5.2, 0], flip: true }], b: [{ shift: [0, 0] }, { shift: [3.1, 0] }], c: [{ shift: [0, 0] }, { shift: [2.0, 0] }] };
  Object.keys(EX1).forEach((k) => fig('e1' + k, 460, 215, (s) => {
    const d = EX1[k], sh = [tf(d.t1.pts, e1[k][0]), tf(d.t2.pts, e1[k][1])], { S } = fitWorld(sh, 16, 10, 428, 195, 96);
    [d.t1, d.t2].forEach((t, j) => drawTri(s, S[j], { w: 2.8, size: 17, r: 16, lrMax: 42, arcs: [0, 1, 2].map((i) => (t.rt === i ? 'r' : 1)), angs: [0, 1, 2].map((i) => angTxt(t, i)) }));
  }));
  // section 2: ABC ~ DEF with 1, 2, 3 arcs
  fig('names', 330, 200, (s) => {
    const { S } = fitWorld([triAA(1.8, 55, 75), tf(triAA(2.5, 55, 75), { shift: [2.95, 0] })], 24, 24, 282, 152);
    drawTri(s, S[0], { w: 2.8, arcs: [1, 2, 3], r: 17, names: 'ABC' }); drawTri(s, S[1], { w: 2.8, arcs: [1, 2, 3], r: 17, names: 'DEF' });
  });
  // Example 2: ABC and the turned RPQ
  fig('e2', 400, 250, (s) => {
    const { S } = fitWorld([triAA(2.4, 50, 70), tf(triAA(2.0, 50, 70), { rot: 150, shift: [5.6, 0.2] })], 26, 26, 348, 198);
    drawTri(s, S[0], { w: 2.8, arcs: [1, 2, 3], r: 17, names: 'ABC' }); drawTri(s, S[1], { w: 2.8, arcs: [1, 2, 3], r: 17, names: 'RPQ' });
  });
  // Example 3
  fig('e3', 380, 250, (s) => {
    const { S } = fitWorld([triSSS(1.8, 2.25, 2.7), tf(triSSS(3.0, 3.75, 4.5), { shift: [3.0, 0] })], 30, 22, 330, 200);
    drawTri(s, S[0], { w: 2.8, names: 'ABC', sides: ['6 cm', '9 cm', '7.5 cm'], size: 17 });
    drawTri(s, S[1], { w: 2.8, names: 'DEF', sides: ['10 cm', '?', '?'], size: 17 });
  });
  // Example 4: LMN and the turned STU
  fig('e4', 620, 200, (s) => {
    const { S } = fitWorld([triSSS(2.30, 1.99, 1.54), tf(triSSS(3.52, 3.04, 2.35), { rot: 180, shift: [6.3, 1.75] })], 40, 28, 540, 146);
    drawTri(s, S[0], { w: 2.8, names: 'LMN', arcs: [1, 2, 0], r: 17, sides: ['7.2 cm', '4.8 cm', '?'], size: 17 });
    drawTri(s, S[1], { w: 2.8, names: 'STU', arcs: [1, 2, 0], r: 17, sides: ['11.0 cm', 'x', '9.5 cm'], size: 17 });
  });
  fig('e5', 760, 270, (s) => rampFig(s, 760, 270));
  fig('nc', 700, 250, (s) => ncFig(s));
  fig('e6', 300, 290, (s) => {
    const Nn = nestedPts(), { S } = fitWorld([Object.values(Nn)], 40, 26, 230, 236), [A, B, C, D, E] = S[0];
    nestedDraw(s, { A, B, C, D, E }, { labels: true });
  });
  fig('e6b', 420, 150, (s) => {
    const { S } = fitWorld([triSSS(2.0, 1.67, 1.5), tf(triSSS(3.2, 2.67, 2.4), { shift: [3.3, 0] })], 30, 26, 360, 104);
    const p = drawTri(s, S[0], { w: 2.6 }), q = drawTri(s, S[1], { w: 2.6 });
    ['D', 'E', 'A'].forEach((n, i) => ANS(nameLab(s, S[0], i, n)));
    ['B', 'C', 'A'].forEach((n, i) => ANS(nameLab(s, S[1], i, n)));
    [['6', 0], ['4.5', 1], ['5', 2]].forEach(([v, i]) => ANS(sideLab(s, S[0], i, v, { size: 17 })));
    [['?', 0], ['?', 1], ['5 + 3 = 8', 2]].forEach(([v, i]) => ANS(sideLab(s, S[1], i, v, { size: 17 })));
    void p; void q;
  });
  fig('e7', 400, 290, (s) => { const B = bowPts(), { S } = fitWorld([Object.values(B)], 26, 46, 348, 220); const [A, Bb, C, D, E] = S[0]; bowDraw(s, { A, B: Bb, C, D, E }, { labels: true, pond: true }); });
}

/* ---------------- the ramp (Example 5): world in metres, drawn with the height stretched (not to scale) ---------------- */
const RAMP = { AD: 2.16, DE: 0.18, BC: 0.46, AB: 5.52, slope: 0.18 / 2.16 };
function rampFig(s, W, H) {
  const x0 = 50, y0 = H - 70, sx = (W - 150) / 5.52, sy = 105 / 0.46, X = (m) => x0 + m * sx, Y = (m) => y0 - m * sy;
  svgEl('rect', { x: 20, y: y0, width: W - 40, height: 14, fill: '#e6e1d6' }, s); seg(s, [20, y0], [W - 20, y0], { w: 3 });
  const A = [X(0), Y(0)], Dp = [X(2.16), Y(0)], Ep = [X(2.16), Y(0.18)], Bp = [X(5.52), Y(0)], Cp = [X(5.52), Y(0.46)];
  seg(s, A, Cp, { w: 5 }); seg(s, Cp, [W - 20, Cp[1]], { w: 5 }); seg(s, Dp, Ep, { w: 3.4 }); seg(s, Bp, Cp, { w: 3.4 });
  svgEl('rect', { x: W - 70, y: Cp[1] - 62, width: 30, height: 62, fill: '#d9b98a', stroke: BRN, 'stroke-width': 2.5 }, s); txt(s, W - 55, Cp[1] - 74, 'door', { size: 16 });
  rmark(s, Dp, 180); rmark(s, Bp, 180);
  svgEl('path', { d: arcD(A, 40, 0, Math.atan2(sy * 0.46, sx * 5.52) / RAD), stroke: INK, 'stroke-width': 2.2, fill: 'none' }, s);
  txt(s, A[0] - 14, A[1] + 16, 'A', { italic: true, size: 20 }); txt(s, Dp[0], Dp[1] + 22, 'D', { italic: true, size: 20 }); txt(s, Ep[0] - 14, Ep[1] - 14, 'E', { italic: true, size: 20 });
  txt(s, Bp[0], Bp[1] + 22, 'B', { italic: true, size: 20 }); txt(s, Cp[0] - 16, Cp[1] - 14, 'C', { italic: true, size: 20 });
  txt(s, Dp[0] + 40, (Dp[1] + Ep[1]) / 2 - 6, '0.18 m', { size: 16 }); txt(s, Bp[0] + 40, (Bp[1] + Cp[1]) / 2, '0.46 m', { size: 16 });
  const dim = (a, b, y, lab) => { seg(s, [a, y], [b, y], { w: 1.6 }); seg(s, [a, y - 7], [a, y + 7], { w: 1.6 }); seg(s, [b, y - 7], [b, y + 7], { w: 1.6 }); svgEl('rect', { x: (a + b) / 2 - 30, y: y - 11, width: 60, height: 22, fill: '#fff' }, s); txt(s, (a + b) / 2, y, lab, { size: 16, halo: false }); };
  dim(A[0], Dp[0], y0 + 36, '2.16 m'); dim(A[0], Bp[0], y0 + 62, '?');
}

/* ---------------- nested triangle (Example 6) and the bow tie (Example 7), booklet coordinates ---------------- */
function nestedPts(t = 0.625) { const A = [1.3, 3.0], B = [0, 0], C = [3.4, 0]; return { A, B, C, D: lerpP(A, B, t), E: lerpP(A, C, t) }; }
function nestedDraw(s, Q, o = {}) {
  const { A, B, C, D, E } = Q, g = grp(s);
  svgEl('path', { d: polyD([A, B, C]), fill: 'none', stroke: INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g); seg(g, D, E, { w: 3 });
  parMark(g, D, E); parMark(g, B, C);
  const nm = (V, s2, dx, dy) => txt(g, V[0] + dx, V[1] + dy, s2, { italic: true, size: 20 });
  nm(A, 'A', 0, -18); nm(D, 'D', -18, 0); nm(E, 'E', 18, 0); nm(B, 'B', -14, 14); nm(C, 'C', 14, 14);
  if (o.labels) { sideLab(g, [A, D, E], 0, '5 cm', { size: 16 }); sideLab(g, [D, B, C], 0, '3 cm', { size: 16 }); sideLab(g, [A, E, D], 0, '4.5 cm', { size: 16 }); sideLab(g, [D, E, A], 0, '6 cm', { size: 16, gap: 4 }); }
  return g;
}
function bowPts() { const A = [0, 3.4], B = [4.4, 3.4], C = [2.2, 1.3], k = -0.3158; return { A, B, C, D: [C[0] + k * (A[0] - C[0]), C[1] + k * (A[1] - C[1])], E: [C[0] + k * (B[0] - C[0]), C[1] + k * (B[1] - C[1])] }; }
function bowDraw(s, Q, o = {}) {
  const { A, B, C, D, E } = Q, g = grp(s);
  if (o.pond) {
    const u = dist(A, B) / 4.4, pts = [[0.05, 3.4], [0.8, 4.15], [2.2, 4.35], [3.6, 4.1], [4.35, 3.4], [3.2, 3.25], [1.5, 3.2]].map(([x, y]) => [A[0] + x * u, A[1] - (y - 3.4) * u]);
    const mids = pts.map((p, i) => lerpP(p, pts[(i + 1) % pts.length], 0.5));
    svgEl('path', { d: `M${f2(mids[0][0])} ${f2(mids[0][1])}` + pts.map((p, i) => `Q${f2(pts[(i + 1) % pts.length][0])} ${f2(pts[(i + 1) % pts.length][1])} ${f2(mids[(i + 1) % pts.length][0])} ${f2(mids[(i + 1) % pts.length][1])}`).join('') + 'Z', fill: '#cfe0f5', stroke: 'none' }, g);
    txt(g, (A[0] + B[0]) / 2, A[1] - 0.45 * u, 'pond', { size: 16, italic: true, color: '#3a6ea8', halo: false });
  }
  seg(g, A, B, { w: 3, dash: o.pond ? '9 7' : null }); seg(g, A, D, { w: 3 }); seg(g, B, E, { w: 3 }); seg(g, D, E, { w: 3 });
  parMark(g, A, B); parMark(g, E, D);
  svgEl('circle', { cx: f2(C[0]), cy: f2(C[1]), r: 4, fill: INK }, g);
  const nm = (V, s2, dx, dy) => txt(g, V[0] + dx, V[1] + dy, s2, { italic: true, size: 20 });
  nm(A, 'A', -16, 0); nm(B, 'B', 16, 0); nm(C, 'C', -20, 0); nm(D, 'D', 12, 16); nm(E, 'E', -12, 16);
  if (o.labels) { sideLab(g, [A, C, B], 0, '38 m', { size: 16 }); sideLab(g, [C, D, A], 0, '12 m', { size: 16 }); sideLab(g, [E, D, C], 0, '15.5 m', { size: 16, gap: 4 }); }
  return g;
}
function ncFig(s) {
  const N = nestedPts(0.45), { S: [n] } = fitWorld([Object.values(N)], 40, 22, 230, 170), [A, B, C, D, E] = n;
  nestedDraw(s, { A, B, C, D, E });
  const cn = (Q, i) => corner(Q, i);
  angMark(s, A, cn([A, B, C], 0), 1, { r: 22 }); angMark(s, D, cn([D, E, A], 0), 2, { r: 18 }); angMark(s, B, cn([B, C, A], 0), 2, { r: 18 });
  txt(s, 155, 238, 'nested: △ADE ~ △ABC', { size: 17, color: BRN });
  // crossing
  const Pq = [0, 2.4], Qq = [2.6, 2.4], X = [1.5, 1.4], Sq = [X[0] - 0.7 * (Pq[0] - X[0]), X[1] - 0.7 * (Pq[1] - X[1])], Tq = [X[0] - 0.7 * (Qq[0] - X[0]), X[1] - 0.7 * (Qq[1] - X[1])];
  const { S: [m] } = fitWorld([[Pq, Qq, X, Sq, Tq]], 420, 22, 240, 170), [p, q, x, sP, tP] = m;
  seg(s, p, q, { w: 3 }); seg(s, p, sP, { w: 3 }); seg(s, q, tP, { w: 3 }); seg(s, sP, tP, { w: 3 }); parMark(s, p, q); parMark(s, tP, sP);
  angMark(s, x, cn([x, p, q], 0), 2, { r: 18 }); angMark(s, x, cn([x, sP, tP], 0), 2, { r: 18 }); angMark(s, p, cn([p, q, x], 0), 1, { r: 22 }); angMark(s, sP, cn([sP, tP, x], 0), 1, { r: 22 });
  const nm = (V, s2, dx, dy) => txt(s, V[0] + dx, V[1] + dy, s2, { italic: true, size: 20 });
  nm(p, 'P', -4, -18); nm(q, 'Q', 4, -18); nm(x, 'X', 22, 0); nm(sP, 'S', 10, 16); nm(tP, 'T', -10, 16);
  txt(s, 540, 238, 'crossing: △XPQ ~ △XST', { size: 17, color: BRN });
}

/* ======================================================================================
 * 1. The AA test: slide one triangle onto the other (Example 1)
 * ====================================================================================== */
const aa = {
  title: 'The AA test: does one triangle fit in the other’s corner?',
  height: 470,
  minW: 900,
  choices: [{ sep: 'Example 1 check:' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }, { v: 'c', label: '(c)' }],
  ask: (v) => `Example 1(${v}): find the missing angles. Are the two triangles similar?`,
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 900) / 2, svg = stageSvg(stage, W, 470), d = EX1[v], t1 = d.t1, t2 = d.t2;
    const [Q1, Q2] = fitEach([tf(t1.pts), tf(t2.pts, { flip: t2.flip })], [[ox + 30, 100, 380, 270], [ox + 490, 100, 380, 270]]);
    // colours by angle size (first seen in triangle 1); sizes not in triangle 1 are grey
    const cmap = {}; t1.vals.forEach((a) => { if (!(a in cmap)) cmap[a] = ACOL[Object.keys(cmap).length]; });
    const colOf = (a) => cmap[a] || GREY;
    const wg1 = hide(grp(svg)), wg2 = hide(grp(svg));
    [0, 1, 2].forEach((i) => { wedge(wg1, Q1[i], corner(Q1, i), 34, colOf(t1.vals[i]), 0.45); wedge(wg2, Q2[i], corner(Q2, i), 34, colOf(t2.vals[i]), 0.45); });
    const opt = (t) => ({ w: 3.4, size: 21, r: 20, fill: '#fff', arcs: [0, 1, 2].map((i) => (t.rt === i ? 'r' : 1)), angs: [0, 1, 2].map((i) => angTxt(t, i)) });
    const R1 = drawTri(svg, Q1, opt(t1)), R2 = drawTri(svg, Q2, opt(t2));
    R1.fill.setAttribute('fill', 'none'); R2.fill.setAttribute('fill', 'none');
    const eq1 = hide(hb(stage, t1.eq, ox + 20, 18, 400, 60, 'u6l5-eq u6l5-nw')), eq2 = hide(hb(stage, t2.eq, ox + 480, 18, 400, 60, 'u6l5-eq u6l5-nw'));
    const unk = (R, t) => [0, 1, 2].filter((i) => !t.given[i] && t.rt !== i).map((i) => R.angs[i]);
    // the moving copy of triangle 2
    const [i1, i2, j1, j2] = d.match, cp = grp(svg);
    const third = (i, j) => 3 - i - j;
    const cross = (Q, i, j) => { const k = third(i, j), a = [Q[j][0] - Q[i][0], Q[j][1] - Q[i][1]], b = [Q[k][0] - Q[i][0], Q[k][1] - Q[i][1]]; return Math.sign(a[0] * b[1] - a[1] * b[0]); };
    const needFlip = cross(Q1, i1, j1) !== cross(Q2, i2, j2);
    const cx2 = cen(Q2)[0], Qf = needFlip ? Q2.map(([x, y]) => [2 * cx2 - x, y]) : Q2;
    let rot = dirTo(Q1[i1], Q1[j1]) - dirTo(Qf[i2], Qf[j2]); rot = ((rot % 360) + 540) % 360 - 180;
    const sc = 0.62 * dist(Q1[i1], Q1[j1]) / dist(Qf[i2], Qf[j2]);
    const rotS = (v2, th) => { const c2 = cos(th), s2 = sin(th); return [v2[0] * c2 + v2[1] * s2, -v2[0] * s2 + v2[1] * c2]; };
    function drawCopy(Q) {
      cp.innerHTML = '';
      svgEl('path', { d: polyD(Q), fill: '#fff6e5', 'fill-opacity': 0.75, stroke: BRN, 'stroke-width': 3, 'stroke-dasharray': '8 5', 'stroke-linejoin': 'round' }, cp);
      [0, 1, 2].forEach((i) => wedge(cp, Q[i], corner(Q, i), 30, colOf(t2.vals[i]), 0.6));
    }
    const at = (t) => { // t in 0..1: flip first (if needed), then turn, shrink and move
      const tf1 = needFlip ? Math.min(1, t * 2.2) : 1, tm = needFlip ? Math.max(0, (t - 0.45) / 0.55) : t;
      const Qa = Q2.map(([x, y]) => [cx2 + (x - cx2) * (1 - 2 * tf1 * (needFlip ? 1 : 0)), y]);
      const e = tm < 0.5 ? 2 * tm * tm : 1 - 2 * (1 - tm) * (1 - tm), anc = lerpP(Qa[i2], Q1[i1], e), th = rot * e, s2 = lerp(1, sc, e);
      return Qa.map((p) => { const r = rotS([p[0] - Qa[i2][0], p[1] - Qa[i2][1]], th); return [anc[0] + r[0] * s2, anc[1] + r[1] * s2]; });
    };
    hide(cp);
    const st = hide(stamp(stage, d.sim ? 'similar (AA)' : 'not similar', { ok: d.sim ? true : false, x: ox + 450, y: 430, rotate: -5 }));
    const v1 = t1.vals, v2 = t2.vals;
    const slideCap = v === 'a' ? `Pick up the right triangle: <b>flip</b> it, <b>turn</b> it and <b>shrink</b> it, then slide its ${T('47^\\circ')} corner into the ${T('47^\\circ')} corner.`
      : v === 'b' ? `Slide the right triangle’s square corner into the other square corner, with the bottom sides together.`
        : `Slide a ${T('36^\\circ')} corner of the right triangle into the ${T('36^\\circ')} corner of the left one.`;
    const endCap = v === 'a' ? `It fits exactly: ${T('47^\\circ')} on ${T('47^\\circ')}, ${T('68^\\circ')} on ${T('68^\\circ')}, ${T('65^\\circ')} on ${T('65^\\circ')}. Two angles match, so the triangles are <b>similar</b> (AA).`
      : v === 'b' ? `The slanted sides do <b>not</b> line up: ${T('58^\\circ\\ne34^\\circ')}. Only the right angles match: <b>not similar</b>.`
        : `The other angles do <b>not</b> match (${T('72^\\circ')} and ${T('72^\\circ')} against ${T('36^\\circ')} and ${T('108^\\circ')}): <b>not similar</b>.`;
    return [
      { cap: `Left triangle: the missing ${v === 'c' ? 'angles' : 'angle'}. ${v === 'c' ? 'The two base angles are equal: ' : 'Third angle '}${v === 'c' ? T('(180^\\circ-36^\\circ)\\div2=72^\\circ') : T(`180^\\circ-(${DG(v1[0])}+${DG(v1[1])})=${DG(v1[2])}`)}.`,
        run: async (c) => { await c.pop(eq1); unk(R1, t1).forEach((e, k) => { const i = [0, 1, 2].filter((ii) => !t1.given[ii] && t1.rt !== ii)[k]; answer(e, v1[i] + '°'); }); await showAll(c, unk(R1, t1), 400); } },
      { cap: `Right triangle: ${v === 'c' ? `the other base angle is also ${T('36^\\circ')}, so the top is ${T('180^\\circ-72^\\circ=108^\\circ')}` : `third angle ${T(`180^\\circ-(${DG(v2[0])}+${DG(v2[1])})=${DG(v2[2])}`)}`}.`,
        run: async (c) => { await c.pop(eq2); unk(R2, t2).forEach((e, k) => { const i = [0, 1, 2].filter((ii) => !t2.given[ii] && t2.rt !== ii)[k]; answer(e, v2[i] + '°'); }); await showAll(c, unk(R2, t2), 400); } },
      { cap: d.sim ? 'Colour the angles by <b>size</b>: the same colour means the same size. All three colours match up, even though the triangles sit differently.'
        : 'Colour the angles by <b>size</b>: the same colour means the same size. Grey angles have no partner.', run: (c) => showAll(c, [wg1, wg2], 600) },
      { cap: slideCap, run: async (c) => { cp.style.opacity = 1; drawCopy(Q2); await tween(c, needFlip ? 2400 : 1800, (t) => drawCopy(at(t))); drawCopy(at(1)); } },
      { cap: endCap, run: async (c) => { if (!d.sim) await c.anim(cp, [{ transform: 'translate(0,0)' }, { transform: 'translate(-5px,0)' }, { transform: 'translate(5px,0)' }, { transform: 'translate(0,0)' }], 400); st.style.opacity = 1; await stampIn(c, st); } }
    ];
  }
};

/* ======================================================================================
 * 1x. Why two angles are enough (Full): stretch the base
 * ====================================================================================== */
const twoangles = {
  title: 'Two angles fix the shape',
  height: 410,
  minW: 900,
  ask: false,
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 900) / 2, svg = stageSvg(stage, W, 410), g = grp(svg);
    const B0 = [ox + 60, 380], CM = 70;               // 70 px per cm
    const L = [130, 455, 230];
    let cur = L[0];
    const lens = (b) => ({ base: b / CM, left: b / CM * sin(68) / sin(65), right: b / CM * sin(47) / sin(65) });
    const tab = hb(stage, '', ox + 600, 30, 290, 200, 'u6l5-tab');
    function draw(b) {
      g.innerHTML = '';
      const Q = [B0, [B0[0] + b, B0[1]], P(B0, 47, b * sin(68) / sin(65))];
      drawTri(g, Q, { w: 3.6, size: 21, fill: '#fbf1de', arcs: [1, 2, 3], arcColors: ACOL, r: 22, angs: ['47°', '68°', '65°'], angColors: ACOL,
        sides: [Geo.fmtLen(b / CM, 1) + ' cm', Geo.fmtLen(lens(b).right, 1) + ' cm', Geo.fmtLen(lens(b).left, 1) + ' cm'] });
      const l = lens(b);
      tab.firstChild.innerHTML = `<div class="u6l5-trow"><span>base</span><b>${Geo.fmtLen(l.base, 2)} cm</b></div><div class="u6l5-trow"><span>left side ÷ base</span><b>${Geo.fmtLen(l.left / l.base, 2)}</b></div><div class="u6l5-trow"><span>right side ÷ base</span><b>${Geo.fmtLen(l.right / l.base, 2)}</b></div><div class="u6l5-trow"><span>third angle</span><b>65°</b></div>`;
    }
    draw(cur);
    const grow = (c, to, ms) => { const from = cur; cur = to; return tween(c, ms, (t) => draw(lerp(from, to, t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t)))).then(() => draw(to)); };
    const st = hide(stamp(stage, 'same shape', { ok: true, x: ox + 745, y: 300, rotate: -6 }));
    return [
      { cap: `A base with a ${T('47^\\circ')} angle and a ${T('68^\\circ')} angle. The arms meet, so the third angle is ${T('180^\\circ-(47^\\circ+68^\\circ)=65^\\circ')}.`, run: (c) => c.anim(g, [{ opacity: 0 }, { opacity: 1 }], 500) },
      { cap: 'Make the base <b>longer</b>. Watch the third angle and the two ratios in the table.', run: (c) => grow(c, L[1], 1900) },
      { cap: 'Now <b>shorter</b>. The angles never change, and each side ÷ base stays the same.', run: (c) => grow(c, L[2], 1500) },
      { cap: 'Same angles, sides in the same ratio: every one of these triangles is <b>similar</b>. Two angles were enough!', run: (c) => { st.style.opacity = 1; return stampIn(c, st); } }
    ];
  }
};

/* ======================================================================================
 * 2. Name them in order (Example 2)
 * ====================================================================================== */
const MATCH = {
  abc: { t1: { pts: triAA(1.8, 55, 75), names: 'ABC' }, t2: { pts: triAA(2.5, 55, 75), names: 'DEF' }, n2: 'DEF' },
  ex2: { t1: { pts: triAA(2.4, 50, 70), names: 'ABC' }, t2: { pts: triAA(2.0, 50, 70), rot: 150, names: 'RPQ' }, n2: 'RPQ' }
};
const match = {
  title: 'Name similar triangles in matching order',
  height: 430,
  minW: 900,
  choices: [{ v: 'abc', label: '△ABC ~ △DEF' }, { sep: 'Example 2 check:' }, { v: 'ex2', label: '△ABC and the turned triangle' }],
  ask: (v) => (v === 'ex2' ? 'Example 2: the triangles are similar. Matching angles have the same number of arcs. Name them in order.' : 'The triangles are similar. Matching angles have the same number of arcs. Which letters go together?'),
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 900) / 2, svg = stageSvg(stage, W, 430), d = MATCH[v], n1 = 'ABC', n2 = d.n2;
    const [Q1, Q2] = fitEach([tf(d.t1.pts), tf(d.t2.pts, { rot: d.t2.rot })], [[ox + 40, 70, 230, 290], [ox + 320, 70, 230, 290]]);
    const wg = grp(svg), lg = grp(svg), sg = grp(svg);
    const W1 = [0, 1, 2].map((i) => hide(wedge(wg, Q1[i], corner(Q1, i), 36, ACOL[i], 0.45))), W2 = [0, 1, 2].map((i) => hide(wedge(wg, Q2[i], corner(Q2, i), 36, ACOL[i], 0.45)));
    const S1 = [0, 1, 2].map((i) => hide(glow(sg, Q1[i], Q1[(i + 1) % 3], SCOL[i], 11))), S2 = [0, 1, 2].map((i) => hide(glow(sg, Q2[i], Q2[(i + 1) % 3], SCOL[i], 11)));
    const R1 = drawTri(svg, Q1, { w: 3.4, arcs: [1, 2, 3], r: 20, names: n1, size: 22 }), R2 = drawTri(svg, Q2, { w: 3.4, arcs: [1, 2, 3], r: 20, names: n2, size: 22 });
    void R1; void R2;
    const link = (i) => {
      const A = Q1[i], B = Q2[i], mid = [(A[0] + B[0]) / 2, Math.min(A[1], B[1]) - 90 - i * 10];
      return hide(svgEl('path', { d: `M${f2(A[0])} ${f2(A[1])}Q${f2(mid[0])} ${f2(mid[1])} ${f2(B[0])} ${f2(B[1])}`, stroke: ACOL[i], 'stroke-width': 3, fill: 'none', 'stroke-dasharray': '7 6' }, lg));
    };
    const LK = [0, 1, 2].map(link);
    const X0 = ox + 590, words = ['One arc', 'Two arcs', 'Three arcs'];
    const rows = [0, 1, 2].map((i) => hide(hb(stage, `<span class="u6l5-dot" style="background:${ACOL[i]}"></span>${words[i]}: ${T(n1[i] + '\\to ' + n2[i])}`, X0, 16 + i * 62, 300, 52, 'u6l5-step')));
    const nameB = hide(hb(stage, T(`\\triangle ${n1}\\sim\\triangle ${n2}`), X0, 210, 300, 64, 'u6l5-eq u6l5-res'));
    const sp = (i) => (i === 2 ? [n1[0] + n1[2], n2[0] + n2[2]] : [n1[i] + n1[i + 1], n2[i] + n2[i + 1]]);
    const ratB = hide(hb(stage, T(`\\dfrac{${sp(0)[1]}}{${sp(0)[0]}}=\\dfrac{${sp(1)[1]}}{${sp(1)[0]}}=\\dfrac{${sp(2)[1]}}{${sp(2)[0]}}`), X0, 290, 300, 90, 'u6l5-eq'));
    const pairTxt = [0, 1, 2].map((i) => T(`${sp(i)[0]}\\leftrightarrow ${sp(i)[1]}`)).join(', ');
    const opp1 = sp(0)[0], opp2 = sp(0)[1];   // side 0 (1st–2nd letters) is across from the 3rd letter
    return [0, 1, 2].map((i) => ({
      cap: `<b>${words[i]}:</b> ${T('\\angle ' + n1[i])} matches ${T('\\angle ' + n2[i])}.`,
      run: async (c) => { await showAll(c, [W1[i], W2[i]], 400); await c.anim(LK[i], [{ opacity: 0 }, { opacity: 1 }], 400); await c.pop(rows[i]); }
    })).concat([
      { cap: `Write the letters in that order: ${T(`\\triangle ${n1}\\sim\\triangle ${n2}`)}.${v === 'ex2' ? ' (It looks strange, but it is the order that matches.)' : ''}`, run: (c) => c.pop(nameB) },
      { cap: `The sides follow the letters: ${pairTxt}. They are in the same ratio.`, run: async (c) => { for (let i = 0; i < 3; i++) await showAll(c, [S1[i], S2[i]], 300); await c.pop(ratB); } },
      { cap: `A side and its opposite angle go together: ${T(opp1)} is across from ${T('\\angle ' + n1[2])}, so it matches the side across from ${T('\\angle ' + n2[2])}: ${T(opp2)}.`,
        run: async (c) => { [0, 1].forEach((i) => { S1[i].style.opacity = 0.12; S2[i].style.opacity = 0.12; }); W1.concat(W2).forEach((e, k) => { if (k % 3 !== 2) e.style.opacity = 0.15; }); await Promise.all([flash(c, S1[0]), flash(c, S2[0]), flash(c, W1[2]), flash(c, W2[2])]); } }
    ]);
  }
};

/* ======================================================================================
 * 3. A missing side in 4 steps (Examples 3 and 4)
 * ====================================================================================== */
const MISS = {
  ef: { ex: 3, part: 'EF' }, df: { ex: 3, part: 'DF' }, x: { ex: 4, part: 'x' }, ln: { ex: 4, part: 'LN' }
};
const EX3T = { t1: { pts: triSSS(6, 7.5, 9), names: 'ABC', sides: ['6 cm', '9 cm', '7.5 cm'] }, t2: { pts: triSSS(10, 12.5, 15), names: 'DEF', sides: ['10 cm', '?', '?'] } };
const EX4T = { t1: { pts: triSSS(7.2, 6.2182, 4.8), names: 'LMN', sides: ['7.2 cm', '4.8 cm', '?'], arcs: [1, 2, 0] }, t2: { pts: triSSS(11.0, 9.5, 7.3333), rot: 180, names: 'STU', sides: ['11.0 cm', 'x', '9.5 cm'], arcs: [1, 2, 0] } };
const missing = {
  title: 'A missing side in 4 steps',
  height: 430,
  minW: 900,
  choices: [{ sep: 'Example 3 check:' }, { v: 'ef', label: 'EF' }, { v: 'df', label: 'DF' }, { sep: 'Example 4 check:' }, { v: 'x', label: '(a) x' }, { v: 'ln', label: '(b) LN' }],
  ask: (v) => (MISS[v].ex === 3 ? `Example 3: ${T('\\triangle ABC\\sim\\triangle DEF')}. Find ${T(MISS[v].part)}.` : `Example 4: ${T('\\triangle LMN\\sim\\triangle STU')}. Find ${v === 'x' ? `${T('x')} (side ${T('TU')})` : `side ${T('LN')}`} to the nearest tenth.`),
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 900) / 2, svg = stageSvg(stage, W, 430), e3 = MISS[v].ex === 3, d = e3 ? EX3T : EX4T;
    const [Q1, Q2] = fitEach([tf(d.t1.pts), tf(d.t2.pts, { rot: d.t2.rot })], e3 ? [[ox + 30, 60, 190, 300], [ox + 262, 30, 262, 360]] : [[ox + 16, 90, 226, 220], [ox + 284, 60, 244, 280]]);
    const sg = grp(svg), kg = grp(svg);
    const S1 = [0, 1, 2].map((i) => hide(glow(sg, Q1[i], Q1[(i + 1) % 3], SCOL[i], 12))), S2 = [0, 1, 2].map((i) => hide(glow(sg, Q2[i], Q2[(i + 1) % 3], SCOL[i], 12)));
    const R1 = drawTri(svg, Q1, { w: 3.4, names: d.t1.names, sides: d.t1.sides, arcs: d.t1.arcs, r: 20, size: 20 }), R2 = drawTri(svg, Q2, { w: 3.4, names: d.t2.names, sides: d.t2.sides, arcs: d.t2.arcs, r: 20, size: 20 });
    const K1 = hide(glow(kg, Q1[0], Q1[1], RED, 20)), K2 = hide(glow(kg, Q2[0], Q2[1], RED, 20));
    // the worked numbers
    const W3 = {
      ef: { pair: 'AB = 6 and DE = 10', k: true, line: 'EF=BC\\times k=9\\times10\\div6=15\\text{ cm}', l2: ['EF=9\\times10\\div6', '=15\\text{ cm}'], res: '15 cm', cmp: '15>9', el: () => R2.sides[1], chk: `${T('\\triangle DEF')} is bigger: ${T('15>9')}` },
      df: { pair: 'AB = 6 and DE = 10', k: true, line: 'DF=AC\\times k=7.5\\times10\\div6=12.5\\text{ cm}', l2: ['DF=7.5\\times10\\div6', '=12.5\\text{ cm}'], res: '12.5 cm', cmp: '12.5>7.5', el: () => R2.sides[2], chk: `${T('\\triangle DEF')} is bigger: ${T('12.5>7.5')}` },
      x: { pair: 'LM = 7.2 and ST = 11.0', prop: '\\dfrac{x}{4.8}=\\dfrac{11.0}{7.2}', line: 'x=4.8\\times11.0\\div7.2=7.333\\ldots\\approx7.3\\text{ cm}', l2: ['x=4.8\\times11.0\\div7.2', '=7.333\\ldots\\approx7.3\\text{ cm}'], res: '7.3 cm', cmp: '7.3>4.8', el: () => R2.sides[1], chk: `${T('\\triangle STU')} is bigger: ${T('7.3>4.8')}` },
      ln: { pair: 'LM = 7.2 and ST = 11.0', prop: '\\dfrac{LN}{9.5}=\\dfrac{7.2}{11.0}', line: 'LN=9.5\\times7.2\\div11.0=6.218\\ldots\\approx6.2\\text{ cm}', l2: ['LN=9.5\\times7.2\\div11.0', '=6.218\\ldots\\approx6.2\\text{ cm}'], res: '6.2 cm', cmp: '6.2<9.5', el: () => R1.sides[2], chk: `${T('\\triangle LMN')} is smaller: ${T('6.2<9.5')}` }
    }[v];
    const X0 = ox + 566;
    const nm = e3 ? '\\triangle ABC\\sim\\triangle DEF' : '\\triangle LMN\\sim\\triangle STU';
    const step3 = `${W3.k ? T('k=\\dfrac{DE}{AB}=\\dfrac{10}{6}\\approx1.67') : T(W3.prop)}<br>${T(W3.l2[0])}<br>${T(W3.l2[1])}`;
    const rows = [
      hb(stage, `<b>1</b>${T(nm)}`, X0, 8, 334, 56, 'u6l5-step'),
      hb(stage, `<b>2</b>${T(W3.pair.replace(/ = /g, '=').replace(' and ', ',\\quad '))}`, X0, 72, 334, 56, 'u6l5-step'),
      hb(stage, `<b>3</b><span>${step3}</span>`, X0, 136, 334, 152, 'u6l5-step u6l5-res u6l5-s3'),
      hb(stage, `<b>4</b><span>${W3.chk} ✓</span>`, X0, 296, 334, 56, 'u6l5-step u6l5-nw')
    ].map((e) => hide(e));
    const st = hide(stamp(stage, '✓', { ok: true, x: X0 + 280, y: 392, rotate: -8 }));
    const known = e3 ? `${T('AB=6')} cm and ${T('DE=10')} cm` : `${T('LM=7.2')} cm and ${T('ST=11.0')} cm`;
    const big = e3 || v === 'x';
    return [
      { cap: `<b>Step 1:</b> match the vertices: ${T(nm)}. Matching sides get the same colour${e3 ? '' : ' (the arcs agree: one arc at L and S, two at M and T)'}.`, run: async (c) => { await c.pop(rows[0]); for (let i = 0; i < 3; i++) await showAll(c, [S1[i], S2[i]], 300); } },
      { cap: `<b>Step 2:</b> find a matching pair where you know <b>both</b> lengths: ${known}.`, run: async (c) => { await showAll(c, [K1, K2], 400); await c.pop(rows[1]); } },
      { cap: W3.k ? `<b>Step 3:</b> scale factor ${T('k=10\\div6')} (don’t round it). Multiply to go to the new triangle: ${T(W3.line)}.`
        : `<b>Step 3:</b> a proportion with the missing side on top (the same triangle on top on both sides): ${T(W3.prop)}, so ${T(W3.line)}.`,
        run: async (c) => { await c.pop(rows[2]); const el = W3.el(); answer(el, W3.res); await c.anim(el, [{ opacity: 0 }, { opacity: 1 }], 400); } },
      { cap: `<b>Step 4:</b> check. ${big ? 'The answer is a side of the <b>bigger</b> triangle, so it must be bigger than its partner' : 'The answer is a side of the <b>smaller</b> triangle, so it must be smaller than its partner'}: ${T(W3.cmp)} ✓`, run: async (c) => { await c.pop(rows[3]); st.style.opacity = 1; await stampIn(c, st); } }
    ];
  }
};

/* ======================================================================================
 * 3x. Every side × k (Full): Geo.similar grows ABC into DEF (Example 3)
 * ====================================================================================== */
const kmach = {
  title: 'Every side times the same k',
  height: 450,
  minW: 900,
  ask: 'Example 3: grow △ABC (6, 9, 7.5 cm) into △DEF with k = 10 ÷ 6.',
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 860) / 2;
    const S = Geo.similar(stage, { x: ox, y: 0, width: 860, height: 380, pts: triSSS(6, 7.5, 9), k: 10 / 6, names: ['ABC', 'DEF'], image: false,
      labels: [['6 cm', '9 cm', '7.5 cm'], ['10 cm', '15 cm', '12.5 cm']] });
    return [
      { cap: `Start with ${T('\\triangle ABC')}: sides 6 cm, 9 cm and 7.5 cm.`, run: (c) => c.anim(S.el, [{ opacity: 0.3 }, { opacity: 1 }], 400) },
      { cap: `Grow it by ${T('k=\\frac{10}{6}')}: <b>every</b> side is multiplied by the same ${T('k')}. ${T('9\\times10\\div6=15')} and ${T('7.5\\times10\\div6=12.5')}.`, run: (c) => S.grow(c, 1600) },
      { cap: `Each new side ÷ its matching original side gives the same ${T('k\\approx1.67')}. That is what “similar” means.`, run: (c) => S.showRatios(c) }
    ];
  }
};

/* ======================================================================================
 * 3b. Same triangle on top: right vs flipped proportion (Example 4(a))
 * ====================================================================================== */
const flip = {
  title: 'Same triangle on top on both sides',
  height: 430,
  minW: 900,
  ask: `Example 4(a): ${T('\\triangle LMN\\sim\\triangle STU')}, ${T('LM=7.2')}, ${T('MN=4.8')}, ${T('ST=11.0')}. Find ${T('x=TU')}. Which proportion is right?`,
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 900) / 2;
    const big = (s) => `\\color{${RED}}{${s}}`, sm = (s) => `\\color{${BLUE}}{${s}}`;
    const leg = hide(hb(stage, `<span class="u6l5-pill" style="--c:${BLUE}">small △LMN: 7.2, 4.8</span><span class="u6l5-pill" style="--c:${RED}">big △STU: 11.0, ${T('x')}</span>`, ox + 120, 6, 660, 46, 'u6l5-leg'));
    const col = (x0, k) => {
      const f = k ? `\\dfrac{${big('x')}}{${sm('4.8')}}=\\dfrac{${big('11.0')}}{${sm('7.2')}}` : `\\dfrac{${big('x')}}{${sm('4.8')}}=\\dfrac{${sm('7.2')}}{${big('11.0')}}`;
      return {
        fr: hide(hb(stage, T(f), x0, 64, 400, 108, 'u6l5-eq u6l5-big')),
        tag: hide(hb(stage, k ? 'big over small = big over small' : 'big over small = <b>small over big</b>', x0, 182, 400, 44, 'u6l5-tagb' + (k ? '' : ' u6l5-bad'))),
        calc: hide(hb(stage, T(k ? 'x=4.8\\times11.0\\div7.2\\approx7.3\\text{ cm}' : 'x=4.8\\times7.2\\div11.0\\approx3.1\\text{ cm}'), x0, 238, 400, 60, 'u6l5-eq')),
        chk: hide(hb(stage, k ? `${T('7.3>4.8')}: bigger than its partner ✓` : `${T('3.1<4.8')}: smaller than its partner in the <b>small</b> triangle!`, x0, 310, 400, 56, 'u6l5-step' + (k ? '' : ' u6l5-bad'))),
        st: hide(stamp(stage, k ? 'right' : 'wrong', { ok: k, x: x0 + 200, y: 398, rotate: k ? -6 : 6 }))
      };
    };
    const A = col(ox + 20, true), B = col(ox + 480, false);
    return [
      { cap: `Colour each number by its triangle: <b>blue</b> for the small ${T('\\triangle LMN')}, <b>red</b> for the big ${T('\\triangle STU')}. Here are two proportions.`, run: async (c) => { await c.pop(leg); await c.pop(A.fr); await c.pop(B.fr); } },
      { cap: 'Left: big over small on <b>both</b> sides. Right: the second fraction is flipped: small over big.', run: async (c) => { await c.pop(A.tag); await c.pop(B.tag); } },
      { cap: `Solve both: the left gives ${T('7.3')} cm, the right gives ${T('3.1')} cm.`, run: async (c) => { await c.pop(A.calc); await c.pop(B.calc); } },
      { cap: `${T('x')} is in the <b>bigger</b> triangle, so it must be more than ${T('4.8')}. Only ${T('7.3')} cm makes sense. Keep the same triangle on top!`,
        run: async (c) => { await c.pop(A.chk); await c.pop(B.chk); A.st.style.opacity = 1; B.st.style.opacity = 1; await stampIn(c, A.st); await stampIn(c, B.st); } }
    ];
  }
};

/* ======================================================================================
 * 4. The ramp post that slides (Example 5)
 * ====================================================================================== */
const ramp = {
  title: 'Slide the post along the ramp',
  height: 430,
  minW: 900,
  choices: [{ v: 'slide', label: 'Slide the post' }, { sep: 'Example 5 check:' }, { v: 'b', label: '(b) where the ramp ends' }, { v: 'c', label: '(c) a post 4.00 m from A' }],
  ask: (v) => (v === 'slide' ? 'A wheelchair ramp rises steadily from A to a door. A vertical post holds it up. (Height stretched: not to scale.)'
    : v === 'b' ? 'Example 5(b): the post is 2.16 m from A and 0.18 m tall. The door is 0.46 m up. How far from A must the ramp end?'
      : 'Example 5(c): the post is 2.16 m from A and 0.18 m tall. How tall must a second post 4.00 m from A be?'),
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 900) / 2, svg = stageSvg(stage, W, 430);
    const x0 = ox + 70, y0 = 352, sx = 690 / 5.52, sy = 190 / 0.46, X = (m) => x0 + m * sx, Y = (m) => y0 - m * sy;
    const A = [X(0), Y(0)], Bp = [X(5.52), Y(0)], Cp = [X(5.52), Y(0.46)];
    svgEl('rect', { x: ox + 20, y: y0, width: 860, height: 18, fill: '#e6e1d6' }, svg); seg(svg, [ox + 20, y0], [ox + 880, y0], { w: 3 });
    const bigT = hide(svgEl('path', { d: polyD([A, Bp, Cp]), fill: '#e3ecf9', stroke: BLUE, 'stroke-width': 2, 'stroke-dasharray': '7 5' }, svg));
    const smG = grp(svg), postG = grp(svg), lab = grp(svg);
    seg(svg, A, Cp, { w: 6, color: '#5a4630' }); seg(svg, Cp, [ox + 880, Cp[1]], { w: 6, color: '#5a4630' }); seg(svg, Bp, Cp, { w: 3, dash: '6 5', color: GREY });
    svgEl('rect', { x: ox + 812, y: Cp[1] - 96, width: 42, height: 96, fill: '#d9b98a', stroke: BRN, 'stroke-width': 2.5 }, svg); txt(svg, ox + 833, Cp[1] - 112, 'door', { size: 17 });
    const angA = Math.atan2(sy * 0.46, sx * 5.52) / RAD;
    const aArc = svgEl('path', { d: arcD(A, 58, 0, angA), stroke: RED, 'stroke-width': 3, fill: 'none' }, svg);
    txt(svg, A[0] - 16, A[1] + 18, 'A', { italic: true, size: 22 });
    const bLabs = hide(grp(svg)); txt(bLabs, Bp[0], Bp[1] + 24, 'B', { italic: true, size: 22 }); txt(bLabs, Cp[0] + 18, Cp[1] - 16, 'C', { italic: true, size: 22 }); rmark(bLabs, Bp, 180, 16, { color: BLUE });
    let d = RAMP.AD, drag = null;
    const readout = v === 'slide' ? hb(stage, '', ox + 30, 14, 330, 150, 'u6l5-tab') : null;
    function drawPost(m, g = postG, smallG = smG, o = {}) {
      g.innerHTML = ''; smallG.innerHTML = '';
      const hgt = m * RAMP.slope, Dp = [X(m), Y(0)], Ep = [X(m), Y(hgt)];
      svgEl('path', { d: polyD([A, Dp, Ep]), fill: o.fill || '#fbe3b8', 'fill-opacity': o.op ?? 0.9, stroke: o.fill ? (o.color || 'none') : 'none', 'stroke-width': 2, 'stroke-dasharray': '7 5' }, smallG);
      seg(g, Dp, Ep, { w: 5, color: o.color || BRN }); rmark(g, Dp, 180, 14, { color: o.color || BRN });
      if ((o.n1 ?? 'D') !== '') txt(g, Dp[0], Dp[1] + 24, o.n1 ?? 'D', { italic: true, size: 22 }); if ((o.n2 ?? 'E') !== '') txt(g, Ep[0] - 4, Ep[1] - 20, o.n2 ?? 'E', { italic: true, size: 22 });
      if (o.handle) { const hd = svgEl('circle', { cx: f2(Ep[0]), cy: f2(Ep[1]), r: 15, fill: '#fff', stroke: BRN, 'stroke-width': 3, class: 'u6l5-handle' }, g); hd.setAttribute('data-tap', ''); drag = hd; }
      if (readout) readout.firstChild.innerHTML = `<div class="u6l5-trow"><span>ground ${T('AD')}</span><b>${m.toFixed(2)} m</b></div><div class="u6l5-trow"><span>height ${T('DE')}</span><b>${hgt.toFixed(3)} m</b></div><div class="u6l5-trow"><span>height ÷ ground</span><b>${(hgt / m).toFixed(3)}</b></div>`;
      return { Dp, Ep };
    }
    let pp = drawPost(d, postG, smG, { handle: v === 'slide' });
    // dragging the post (finger, Pencil or mouse)
    if (v === 'slide') {
      const scr = (e) => { const r = svg.getBoundingClientRect(), k = r.width / W; return (e.clientX - r.left) / k; };
      svg.addEventListener('pointerdown', (e) => { if (e.target !== drag) return; e.preventDefault(); e.stopPropagation(); const id = e.pointerId; try { e.target.setPointerCapture(id); } catch (er) { /* */ }
        const mv = (ev) => { if (ev.pointerId !== id) return; d = Math.max(0.5, Math.min(5.4, (scr(ev) - x0) / sx)); pp = drawPost(d, postG, smG, { handle: true }); };
        const up = (ev) => { if (ev.pointerId !== id) return; svg.removeEventListener('pointermove', mv); svg.removeEventListener('pointerup', up); };
        svg.addEventListener('pointermove', mv); svg.addEventListener('pointerup', up); });
    }
    const slideTo = (c, to, ms) => { const from = d; d = to; return tween(c, ms, (t) => { pp = drawPost(lerp(from, to, t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t)), postG, smG, { handle: v === 'slide' }); }).then(() => { pp = drawPost(to, postG, smG, { handle: v === 'slide' }); }); };
    hide(smG); hide(aArc);
    if (v === 'slide') {
      return [
        { cap: 'The ramp and the ground make a long, thin right triangle: ' + T('\\triangle ABC') + ', with the right angle at ' + T('B') + ' under the door.', run: (c) => showAll(c, [bigT, bLabs], 500) },
        { cap: `The post ${T('DE')} cuts off a small right triangle ${T('\\triangle ADE')}. Both triangles have a <b>right angle</b> and they <b>share</b> ${T('\\angle A')}.`, run: async (c) => { await showAll(c, [smG, aArc], 500); await flash(c, aArc, 800); } },
        { cap: 'Slide the post: the small triangle grows and shrinks, but its shape stays the same. Height ÷ ground is always about 0.083.', run: async (c) => { await slideTo(c, 4.6, 1700); await slideTo(c, 1.2, 1500); await slideTo(c, RAMP.AD, 900); } },
        { cap: `Right angle + shared ${T('\\angle A')}: every post makes a triangle similar to ${T('\\triangle ABC')} (AA). Drag the post yourself!`, run: (c) => c.anim(postG, [{ opacity: 1 }, { opacity: 0.35 }, { opacity: 1 }], 700) }
      ];
    }
    const X1 = ox + 30, bx = (html, y, w = 420, hh = 58, cls = 'u6l5-eq') => hide(hb(stage, html, X1, y, w, hh, cls));
    const sLab = hide(grp(lab)); txt(sLab, (A[0] + pp.Dp[0]) / 2, y0 + 34, '2.16 m', { size: 19, color: '#a86a08' }); txt(sLab, pp.Dp[0] + 40, (pp.Dp[1] + pp.Ep[1]) / 2, '0.18 m', { size: 19, color: '#a86a08' });
    if (v === 'b') {
      const bL = hide(grp(lab)); txt(bL, Bp[0] + 40, (Bp[1] + Cp[1]) / 2, '0.46 m', { size: 19, color: BLUE }); const abT = txt(bL, (A[0] + Bp[0]) / 2 + 120, y0 + 34, 'AB = ?', { size: 19, color: BLUE });
      const b1 = bx(T('\\dfrac{AB}{2.16}=\\dfrac{0.46}{0.18}'), 14, 300, 92), b2 = bx(T('AB=2.16\\times0.46\\div0.18=5.52\\text{ m}'), 116, 420, 56, 'u6l5-eq u6l5-res');
      return [
        { cap: `Small triangle ${T('\\triangle ADE')}: ${T('AD=2.16')} m along the ground, ${T('DE=0.18')} m tall.`, run: async (c) => { await showAll(c, [smG, aArc], 400); await show(c, sLab, 400); } },
        { cap: `Big triangle ${T('\\triangle ABC')}: ${T('BC=0.46')} m (the door height). ${T('AB')} is missing. They share ${T('\\angle A')}, so they are similar.`, run: (c) => showAll(c, [bigT, bLabs, bL], 500) },
        { cap: `${T('AB')} matches ${T('AD')}, and ${T('BC')} matches ${T('DE')}. Big over small on both sides: ${T('\\frac{AB}{2.16}=\\frac{0.46}{0.18}')}.`, run: (c) => c.pop(b1) },
        { cap: `${T('AB=2.16\\times0.46\\div0.18=5.52')} m. Slide the post to 5.52 m: it is exactly 0.46 m tall, at the door ✓`, run: async (c) => { await c.pop(b2); answer(abT, 'AB = 5.52 m'); await dim(c, sLab, 0, 250); await slideTo(c, 5.52, 1600); } }
      ];
    }
    const ghost = hide(grp(svg)), gS = grp(ghost); svg.insertBefore(ghost, smG);
    const gp = drawPost(4.0, grp(ghost), gS, { color: RED, fill: '#f6d0cc', op: 0.5, n1: '', n2: '' });
    const hT = txt(ghost, gp.Dp[0] + 62, (gp.Dp[1] + gp.Ep[1]) / 2, 'h = ?', { size: 19, color: RED }); txt(ghost, (A[0] + gp.Dp[0]) / 2 + 70, y0 + 58, '4.00 m', { size: 19, color: RED });
    const b1 = bx(T('\\dfrac{h}{0.18}=\\dfrac{4.00}{2.16}'), 14, 300, 92), b2 = bx(T('h=0.18\\times4.00\\div2.16=0.333\\ldots\\approx0.33\\text{ m}'), 116, 540, 56, 'u6l5-eq u6l5-res u6l5-nw');
    return [
      { cap: `Small triangle ${T('\\triangle ADE')}: ${T('AD=2.16')} m along the ground, ${T('DE=0.18')} m tall.`, run: async (c) => { await showAll(c, [smG, aArc], 400); await show(c, sLab, 400); } },
      { cap: 'A new post 4.00 m from A makes a <b>third</b> right triangle. It shares the same angle at A, so it is similar too.', run: (c) => show(c, ghost, 600) },
      { cap: `Heights match heights, ground matches ground: ${T('\\frac{h}{0.18}=\\frac{4.00}{2.16}')}.`, run: (c) => c.pop(b1) },
      { cap: `${T('h=0.18\\times4.00\\div2.16=0.333\\ldots')}: the post must be about ${T('0.33')} m (33 cm) tall.`, run: async (c) => { await c.pop(b2); answer(hT, 'h ≈ 0.33 m'); await flash(c, hT, 700); } }
    ];
  }
};

/* ======================================================================================
 * 5. Pull the nested triangles apart (Example 6)
 * ====================================================================================== */
const pullapart = {
  title: 'Nested triangles: pull them apart',
  height: 430,
  minW: 900,
  choices: [{ v: 'see', label: 'Pull them apart' }, { sep: 'Example 6 check:' }, { v: 'bc', label: '(c) BC' }, { v: 'ec', label: '(d) EC' }],
  ask: (v) => `${v === 'see' ? 'Example 6' : `Example 6(${v === 'bc' ? 'c' : 'd'})`}: ${T('DE\\parallel BC')}, ${T('AD=5')}, ${T('DB=3')}, ${T('DE=6')}, ${T('AE=4.5')} (cm).${v === 'bc' ? ` Find ${T('BC')}.` : v === 'ec' ? ` Find ${T('EC')}.` : ''}`,
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 900) / 2, svg = stageSvg(stage, W, 430);
    const N = nestedPts(), u = 100, B0 = [ox + 60, 372], F = (p) => [B0[0] + p[0] * u, B0[1] - p[1] * u];
    const A = F(N.A), B = F(N.B), C = F(N.C), D = F(N.D), E = F(N.E);
    const small = hide(svgEl('path', { d: polyD([A, D, E]), fill: '#fbe3b8', stroke: 'none' }, svg));
    const big = svgEl('g', {}, svg);
    svgEl('path', { d: polyD([A, B, C]), fill: 'none', stroke: INK, 'stroke-width': 3.4, 'stroke-linejoin': 'round' }, big);
    const inner = grp(big); seg(inner, D, E, { w: 3.4 }); parMark(inner, D, E); parMark(big, B, C);
    const nm = (g, V, s2, dx, dy) => txt(g, V[0] + dx, V[1] + dy, s2, { italic: true, size: 22 });
    nm(big, A, 'A', 0, -20); nm(big, B, 'B', -16, 14); nm(big, C, 'C', 16, 14); const nD = nm(inner, D, 'D', -20, 0), nE = nm(inner, E, 'E', 20, 0); void nD; void nE;
    const labs = grp(inner);
    sideLab(labs, [A, D, E], 0, '5', { size: 20 }); const l3 = sideLab(labs, [D, B, C], 0, '3', { size: 20 }); sideLab(labs, [A, E, D], 0, '4.5', { size: 20 }); sideLab(labs, [D, E, A], 0, '6', { size: 20, gap: 4 });
    const arcs = hide(grp(svg));
    angMark(arcs, A, corner([A, B, C], 0), 1, { r: 26, color: BLUE, w: 3 }); angMark(arcs, D, corner([D, E, A], 0), 2, { r: 22, color: AMB, w: 3 }); angMark(arcs, B, corner([B, C, A], 0), 2, { r: 22, color: AMB, w: 3 });
    // the copy that slides out
    const shift = [ox + 480 - D[0], 222 - D[1]];
    const cp = hide(grp(svg));
    const Qs = [A, D, E].map((p) => [p[0] + shift[0], p[1] + shift[1]]);
    const Rc = drawTri(cp, Qs, { w: 3.4, fill: '#fbe3b8', names: 'ADE', sides: ['5', '6', '4.5'], size: 20, arcs: [1, 2, 0], arcColors: [BLUE, AMB], r: 24 });
    void Rc;
    const bigL = hide(grp(svg)), abL = sideLab(bigL, [A, B, C], 0, '8', { size: 24, color: RED, gap: 36 }), bcL = sideLab(bigL, [B, C, A], 0, '?', { size: 22, color: RED, gap: 26 }), acL = sideLab(bigL, [C, A, B], 0, '?', { size: 22, color: RED, gap: 40 });
    void abL;
    const X1 = ox + 450, bx = (html, y, w = 430, hh = 52, cls = 'u6l5-eq') => hide(hb(stage, html, X1, y, w, hh, cls));
    const base = [
      { cap: `${T('DE')} is <b>parallel</b> to ${T('BC')} (the arrow marks). The small triangle ${T('\\triangle ADE')} sits inside the big triangle ${T('\\triangle ABC')}.`, run: (c) => show(c, small, 500) },
      { cap: `They share ${T('\\angle A')}, and ${T('\\angle ADE=\\angle ABC')} (corresponding angles). Two pairs: similar by AA.`, run: async (c) => { await show(c, arcs, 500); await flash(c, arcs, 800); } },
      { cap: `Pull the small triangle out and draw it on its own: ${T('AD=5')}, ${T('DE=6')}, ${T('AE=4.5')}.`, run: async (c) => { cp.style.opacity = 1; await c.anim(cp, [{ transform: `translate(${-shift[0]}px, ${-shift[1]}px)` }, { transform: 'translate(0,0)' }], 1300); } },
      { cap: `Label the big triangle with its <b>whole</b> sides: ${T('AB=5+3=8')} cm, not just the 3!`, run: async (c) => { await flash(c, l3, 700); await dim(c, inner, 0.22); await dim(c, small, 0.25); await show(c, bigL, 500); } }
    ];
    if (v === 'see') return base;
    const kB = bx(T('k=AB\\div AD=8\\div5=1.6'), 252);
    if (v === 'bc') {
      const b2 = bx(T('BC=DE\\times k=6\\times1.6=9.6\\text{ cm}'), 314, 430, 52, 'u6l5-eq u6l5-res');
      return base.concat([
        { cap: `Scale factor from small to big: ${T('k=AB\\div AD=8\\div5=1.6')}.`, run: (c) => c.pop(kB) },
        { cap: `${T('BC')} matches ${T('DE')}: ${T('BC=6\\times1.6=9.6')} cm. Check: ${T('9.6>6')}, bigger ✓`, run: async (c) => { await c.pop(b2); answer(bcL, '9.6'); await flash(c, bcL, 700); } }
      ]);
    }
    const b2 = bx(T('AC=AE\\times k=4.5\\times1.6=7.2\\text{ cm}'), 314), b3 = bx(T('EC=AC-AE=7.2-4.5=2.7\\text{ cm}'), 376, 430, 52, 'u6l5-eq u6l5-res');
    const ecG = hide(grp(svg)); glow(ecG, E, C, RED, 14); sideLab(ecG, [E, C, B], 0, '2.7', { size: 20, color: RED, gap: 12 });
    return base.concat([
      { cap: `Scale factor from small to big: ${T('k=AB\\div AD=8\\div5=1.6')}.`, run: (c) => c.pop(kB) },
      { cap: `First the <b>whole</b> side ${T('AC')}: it matches ${T('AE')}, so ${T('AC=4.5\\times1.6=7.2')} cm.`, run: async (c) => { await c.pop(b2); answer(acL, '7.2'); await flash(c, acL, 600); } },
      { cap: `${T('EC')} is the bottom piece: ${T('EC=AC-AE=7.2-4.5=2.7')} cm.`, run: async (c) => { await c.pop(b3); await c.anim(inner, [{ opacity: 0.22 }, { opacity: 1 }], 400); await show(c, ecG, 500); } }
    ]);
  }
};

/* ======================================================================================
 * 5b. Turn the bow tie (Example 7)
 * ====================================================================================== */
const bowtie = {
  title: 'Crossing triangles: turn the bow tie',
  height: 430,
  minW: 900,
  choices: [{ v: 'turn', label: 'Turn it around' }, { sep: 'Example 7 check:' }, { v: 'pond', label: 'How wide is the pond?' }],
  ask: (v) => (v === 'turn' ? `${T('AB\\parallel DE')}. The segments ${T('AD')} and ${T('BE')} cross at ${T('C')}. Why are the two triangles similar?`
    : `Example 7: ${T('AB\\parallel DE')}, ${T('AC=38')} m, ${T('CD=12')} m, ${T('DE=15.5')} m. Find the width of the pond, ${T('AB')}.`),
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 900) / 2, svg = stageSvg(stage, W, 430), pond = v === 'pond';
    const Bw = bowPts(), u = pond ? 106 : 112, O = [ox + 50, pond ? 104 : 40], F = (p) => [O[0] + p[0] * u, O[1] + (3.4 - p[1]) * u];
    const A = F(Bw.A), B = F(Bw.B), C = F(Bw.C), D = F(Bw.D), E = F(Bw.E);
    const fills = grp(svg);
    const fBig = hide(svgEl('path', { d: polyD([A, B, C]), fill: '#e3ecf9', stroke: 'none' }, fills)), fSm = hide(svgEl('path', { d: polyD([C, D, E]), fill: '#fbe3b8', stroke: 'none' }, fills));
    const zG = hide(grp(svg)); svgEl('path', { d: `M${f2(B[0])} ${f2(B[1])}L${f2(A[0])} ${f2(A[1])}L${f2(D[0])} ${f2(D[1])}L${f2(E[0])} ${f2(E[1])}`, stroke: PUR, 'stroke-width': 14, 'stroke-opacity': 0.3, fill: 'none', 'stroke-linejoin': 'round' }, zG);
    bowDraw(svg, { A, B, C, D, E }, { labels: pond, pond });
    const xArc = hide(grp(svg)); angMark(xArc, C, corner([C, A, B], 0), 2, { r: 24, color: AMB, w: 3 }); angMark(xArc, C, corner([C, D, E], 0), 2, { r: 24, color: AMB, w: 3 });
    const zArc = hide(grp(svg)); angMark(zArc, A, corner([A, B, C], 0), 1, { r: 30, color: BLUE, w: 3 }); angMark(zArc, D, corner([D, E, C], 0), 1, { r: 30, color: BLUE, w: 3 });
    const X1 = ox + 590, bx = (html, y, w = 300, hh = 58, cls = 'u6l5-eq') => hide(hb(stage, html, X1, y, w, hh, cls));
    if (!pond) {
      const cp = hide(grp(svg));
      const drawCp = (th) => {
        cp.innerHTML = '';
        const R = (p) => { const r = [p[0] - C[0], p[1] - C[1]], c2 = cos(th), s2 = sin(th); return [C[0] + r[0] * c2 + r[1] * s2, C[1] - r[0] * s2 + r[1] * c2]; };
        const Q = [D, E].map(R);
        svgEl('path', { d: polyD([C, Q[0], Q[1]]), fill: '#fbe3b8', 'fill-opacity': 0.85, stroke: BRN, 'stroke-width': 3, 'stroke-dasharray': '8 5', 'stroke-linejoin': 'round' }, cp);
        angMark(cp, Q[0], corner([Q[0], Q[1], C], 0), 1, { r: 26, color: BLUE, w: 3 });
        txt(cp, Q[0][0] + (th > 90 ? -8 : 14), Q[0][1] + (th > 90 ? -18 : 16), 'D', { italic: true, size: 20, color: BRN }); txt(cp, Q[1][0] + (th > 90 ? 8 : -14), Q[1][1] + (th > 90 ? -18 : 16), 'E', { italic: true, size: 20, color: BRN });
      };
      const st = hide(stamp(stage, 'similar (AA)', { ok: true, x: X1 + 150, y: 360, rotate: -6 }));
      const r1 = bx(`<span class="u6l5-dot" style="background:${AMB}"></span>${T('\\angle ACB=\\angle DCE')} (X)`, 20, 300, 56, 'u6l5-step'), r2 = bx(`<span class="u6l5-dot" style="background:${BLUE}"></span>${T('\\angle CAB=\\angle CDE')} (Z)`, 90, 300, 56, 'u6l5-step');
      return [
        { cap: `The segments cross at ${T('C')}, and the ends are joined by parallel lines: two triangles point to point, like a bow tie.`, run: (c) => showAll(c, [fBig, fSm], 500) },
        { cap: `The angles at ${T('C')} are <b>vertically opposite</b> (an X), so they are equal.`, run: async (c) => { await show(c, xArc, 400); await c.pop(r1); } },
        { cap: `${T('AB\\parallel DE')}, so ${T('\\angle CAB=\\angle CDE')}: <b>alternate interior angles</b> (a Z shape).`, run: async (c) => { await showAll(c, [zG, zArc], 500); await c.pop(r2); } },
        { cap: `Give the small triangle a <b>half turn</b> about ${T('C')}…`, run: async (c) => { cp.style.opacity = 1; drawCp(0); await tween(c, 2000, (t) => drawCp(180 * (t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t)))); drawCp(180); } },
        { cap: `…it lands <b>inside</b> ${T('\\triangle ABC')}, nested, with ${T('DE')} parallel to ${T('AB')}. Two pairs of equal angles: similar (AA).`, run: async (c) => { await c.anim(zG, [{ opacity: 1 }, { opacity: 0 }], 300); st.style.opacity = 1; await stampIn(c, st); } }
      ];
    }
    const pairs = grp(svg);
    const gAC = hide(glow(pairs, A, C, PUR, 12)), gDC = hide(glow(pairs, D, C, PUR, 12)), gAB = hide(glow(pairs, A, B, TEAL, 12)), gDE = hide(glow(pairs, D, E, TEAL, 12));
    const abT = hide(txt(svg, (A[0] + B[0]) / 2, A[1] + 22, 'AB = ?', { size: 20, color: RED }));
    const r1 = bx(T('\\triangle ABC\\sim\\triangle DEC'), 16, 300, 56, 'u6l5-eq'), r2 = bx(T('\\dfrac{AB}{15.5}=\\dfrac{38}{12}'), 86, 300, 92), r3 = bx(T('AB=15.5\\times38\\div12'), 192, 300, 52), r4 = bx(`${T('=49.083\\ldots\\approx49.1')} m`, 252, 300, 52, 'u6l5-eq u6l5-res');
    const st = hide(stamp(stage, '✓', { ok: true, x: X1 + 270, y: 360, rotate: -8 }));
    return [
      { cap: `X at ${T('C')} (vertically opposite) and Z (alternate interior, ${T('AB\\parallel DE')}): the two triangles are similar.`, run: async (c) => { await showAll(c, [fBig, fSm, xArc, zArc], 500); await show(c, abT, 300); } },
      { cap: `Match in order: ${T('A\\to D')}, ${T('B\\to E')}, ${T('C\\to C')}, so ${T('\\triangle ABC\\sim\\triangle DEC')}. ${T('AB')} matches ${T('DE')}, ${T('AC')} matches ${T('DC')}.`, run: async (c) => { await c.pop(r1); await showAll(c, [gAC, gDC], 300); await showAll(c, [gAB, gDE], 300); } },
      { cap: `Big over small on both sides: ${T('\\frac{AB}{15.5}=\\frac{38}{12}')}.`, run: (c) => c.pop(r2) },
      { cap: `${T('AB=15.5\\times38\\div12=49.083\\ldots')}: the pond is about ${T('49.1')} m wide.`, run: async (c) => { await c.pop(r3); await c.pop(r4); abT.textContent = 'AB ≈ 49.1 m'; await flash(c, abT, 600); } },
      { cap: `Check: ${T('AC')} is about 3 times ${T('CD')} (${T('38\\approx3\\times12')}), and ${T('49.1')} is about 3 times ${T('15.5')} ✓`, run: (c) => { st.style.opacity = 1; return stampIn(c, st); } }
    ];
  }
};

/* ======================================================================================
 * 5x. F, Z and X (Full)
 * ====================================================================================== */
const why = {
  title: 'Where the equal angles come from',
  height: 400,
  minW: 900,
  ask: false,
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 900) / 2, svg = stageSvg(stage, W, 400);
    const N = nestedPts(0.5), u = 108, F1 = (p) => [ox + 50 + p[0] * u, 370 - p[1] * u];
    const A = F1(N.A), B = F1(N.B), C = F1(N.C), D = F1(N.D), E = F1(N.E);
    const shp = grp(svg), mk = grp(svg);
    const pathS = (pts, color) => hide(svgEl('path', { d: 'M' + pts.map((p) => `${f2(p[0])} ${f2(p[1])}`).join('L'), stroke: color, 'stroke-width': 15, 'stroke-opacity': 0.3, fill: 'none', 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, shp));
    const f1 = pathS([A, B, C], PUR), f1b = pathS([D, E], PUR), f2s = pathS([A, C, B], TEAL), f2b = pathS([E, D], TEAL);
    nestedDraw(svg, { A, B, C, D, E });
    const m1 = hide(grp(mk)); angMark(m1, D, corner([D, E, A], 0), 1, { r: 24, color: PUR, w: 3 }); angMark(m1, B, corner([B, C, A], 0), 1, { r: 24, color: PUR, w: 3 });
    const m2 = hide(grp(mk)); angMark(m2, E, corner([E, A, D], 0), 2, { r: 24, color: TEAL, w: 3 }); angMark(m2, C, corner([C, A, B], 0), 2, { r: 24, color: TEAL, w: 3 });
    const Bw = bowPts(), u2 = 92, F2 = (p) => [ox + 470 + p[0] * u2, 60 + (3.4 - p[1]) * u2];
    const a = F2(Bw.A), b = F2(Bw.B), c0 = F2(Bw.C), d = F2(Bw.D), e = F2(Bw.E);
    const z = pathS([b, a, d, e], BLUE), x1 = pathS([a, d], AMB), x2 = pathS([b, e], AMB);
    bowDraw(svg, { A: a, B: b, C: c0, D: d, E: e });
    const m3 = hide(grp(mk)); angMark(m3, a, corner([a, b, c0], 0), 1, { r: 28, color: BLUE, w: 3 }); angMark(m3, d, corner([d, e, c0], 0), 1, { r: 28, color: BLUE, w: 3 });
    const m4 = hide(grp(mk)); angMark(m4, c0, corner([c0, a, b], 0), 2, { r: 22, color: AMB, w: 3 }); angMark(m4, c0, corner([c0, d, e], 0), 2, { r: 22, color: AMB, w: 3 });
    return [
      { cap: `Nested: ${T('AB')} crosses the parallel lines ${T('DE')} and ${T('BC')}. ${T('\\angle ADE')} and ${T('\\angle ABC')} make an <b>F</b>: corresponding angles, equal.`, run: (c) => showAll(c, [f1, f1b, m1], 500) },
      { cap: `${T('AC')} crosses them too: ${T('\\angle AED=\\angle ACB')} (another F, turned around).`, run: async (c) => { await Promise.all([dim(c, f1, 0), dim(c, f1b, 0)]); await showAll(c, [f2s, f2b, m2], 500); } },
      { cap: `Crossing: ${T('AD')} crosses the parallel lines ${T('AB')} and ${T('DE')}. ${T('\\angle CAB')} and ${T('\\angle CDE')} make a <b>Z</b>: alternate interior angles, equal.`, run: (c) => showAll(c, [z, m3], 500) },
      { cap: `The two angles at ${T('C')} make an <b>X</b>: vertically opposite angles, equal. Two pairs of equal angles in each picture: AA.`, run: async (c) => { await dim(c, z, 0); await showAll(c, [x1, x2, m4], 500); } }
    ];
  }
};

mountExplainers({ aa, twoangles, match, missing, kmach, flip, ramp, pullapart, bowtie, why });
figures();

/* ======================================================================================
 * Stand Up Break! — similar or not, a missing side, a nested triangle
 * ====================================================================================== */
const nf = (v) => String(+v.toFixed(2));
standup('u6l5', {
  intro: 'Match the triangles first. Then find the scale factor or write a proportion. Check: bigger triangle, bigger side.',
  levels: {
    BEG: (r) => {
      const a = r.int(30, 80), b = r.int(25, 85 - Math.floor(a / 3)), cc = 180 - a - b;
      let p, q; if (r.chance(0.55)) { [p, q] = r.shuffle([a, b, cc]).slice(0, 2); } else { p = r.pick([a, b]); q = cc + r.pick([-12, -8, 7, 11]); }
      const t = 180 - p - q, key = (arr) => arr.slice().sort((m, n) => m - n).join(','), sim = key([a, b, cc]) === key([p, q, t]);
      return { text: `Triangle 1 has angles of ${T(DG(a))} and ${T(DG(b))}. Triangle 2 has angles of ${T(DG(p))} and ${T(DG(q))}. Find the missing angles. Are the triangles similar?`, q: '',
        a: [`\\text{Triangle 1: }180^\\circ-(${DG(a)}+${DG(b)})=${DG(cc)}`, `\\text{Triangle 2: }180^\\circ-(${DG(p)}+${DG(q)})=${DG(t)}`, sim ? '\\text{Same three angles: similar (AA)}' : '\\text{The angles do not all match: not similar}'] };
    },
    PRG: (r) => {
      const k = r.pick([1.5, 2, 2.5, 0.5, 1.25, 3]), ab = r.pick([4, 6, 8, 10, 12]), bc = r.pick([3, 5, 7, 9, 11]), de = ab * k, ef = bc * k;
      return { text: `${T('\\triangle ABC\\sim\\triangle DEF')}. ${T(`AB=${ab}`)} cm, ${T(`BC=${bc}`)} cm and ${T(`DE=${nf(de)}`)} cm. Find ${T('EF')}.`, q: '',
        a: [`k=\\dfrac{DE}{AB}=\\dfrac{${nf(de)}}{${ab}}=${nf(k)}`, `EF=BC\\times k=${bc}\\times${nf(k)}=${nf(ef)}\\text{ cm}`] };
    },
    MAS: (r) => {
      const ad = r.int(3, 9), db = r.int(2, 8), de = r.int(4, 12), bc = de * (ad + db) / ad;
      const s = `<svg viewBox="0 0 260 200" width="260" height="200" style="max-width:100%"><path d="M120 20L20 180L240 180Z" fill="none" stroke="#1c2230" stroke-width="3"/><path d="M70 100L180 100" stroke="#1c2230" stroke-width="3"/><g font-size="20" font-weight="700" font-style="italic" text-anchor="middle" fill="#1c2230"><text x="120" y="14">A</text><text x="56" y="104">D</text><text x="194" y="104">E</text><text x="12" y="194">B</text><text x="250" y="194">C</text></g><path d="M121 94l8 6l-8 6M126 174l8 6l-8 6" stroke="#1c2230" stroke-width="2.4" fill="none"/></svg>`;
      return { text: `${T('DE\\parallel BC')}. ${T(`AD=${ad}`)} cm, ${T(`DB=${db}`)} cm and ${T(`DE=${de}`)} cm. Find ${T('BC')} to the nearest tenth.`, q: '', fig: s,
        a: [`AB=${ad}+${db}=${ad + db}\\text{ cm (the whole side)}`, `\\dfrac{BC}{${de}}=\\dfrac{${ad + db}}{${ad}}`, `BC=${de}\\times${ad + db}\\div${ad}=${Math.abs(bc * 100 - Math.round(bc * 100)) < 1e-6 ? nf(bc) : bc.toFixed(3) + '\\ldots\\approx' + bc.toFixed(1)}\\text{ cm}`] };
    }
  }
});
