/* Math 10-3 · Unit 7 · Lesson 9 — Solving Right Triangles: Choosing the Right Ratio
 * Explainers: the tool chooser (a decision flowchart that lights up beside the triangle, with "leave one out" crossing
 * out a side and the SOH CAH TOA cards; Example 1 a–d); a speed round of new triangles (Full notes); solving a whole
 * triangle row by row, the labels filling in on the triangle (Examples 2 and 3); the Airdrie wheelchair ramp, with the
 * multiply-by-mistake trap and a wheelchair rolling up (Example 4); the painter's ladder with a safety gauge (Example 5);
 * the drone over the field, whose two triangles slide apart and back together (Example 6); the garage roof splitting
 * into two triangles (Full notes; Example 7); spot the wrong answer with stamps (Example 8); turning the angle to see why
 * the checks work (Full notes). Then the Stand Up Break. Card figures use the shared Geo toolkit (js/geo.js). */
import { h, add, box, tex, svgEl, tween, anim, stamp, stampIn, mountExplainers, Flowchart, pop, pulse, fadeIn, appear, sleep, drawIn } from '../blocks.js';
import { Geo } from '../geo.js';
import { standup } from '../standup.js';

const RAD = Math.PI / 180;
const T = (s) => tex(String(s));
const COL = { ink: '#1c2230', slate: '#3a4254', brand: '#6e4a1c', brand2: '#9a6a24', red: '#c93a33', blue: '#1f5bd6', green: '#12805a', amber: '#c27a0e', purple: '#7b4fc4', gray: '#9aa0ab', wood: '#c8955a', woodD: '#8a5a2b' };
const OPP = Geo.ROLE_COLORS.opp, ADJ = Geo.ROLE_COLORS.adj, HYP = Geo.ROLE_COLORS.hyp;
const sinD = (d) => Math.sin(d * RAD), cosD = (d) => Math.cos(d * RAD), tanD = (d) => Math.tan(d * RAD);
const asinD = (x) => Math.asin(x) / RAD, acosD = (x) => Math.acos(x) / RAD, atanD = (x) => Math.atan(x) / RAD;
/** calculator-style digits, cut (not rounded) after 3 places: 11.471… */
const dots = (v) => (Math.floor(v * 1000 + 1e-7) / 1000).toFixed(3) + '\\ldots';
const f1 = (v) => (Math.round(v * 10 + 1e-9) / 10).toFixed(1);
const P2 = (p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1);
const mid = (A, B) => [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
const lerp = (A, B, t) => [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t];
const popable = (el) => { el.style.transformBox = 'fill-box'; el.style.transformOrigin = 'center'; return el; };
const grp = (g, cls) => svgEl('g', cls ? { class: cls } : {}, g);
const line = (g, A, B, o = {}) => svgEl('path', { d: `M${P2(A)}L${P2(B)}`, stroke: o.color || COL.ink, 'stroke-width': o.w || 3, 'stroke-linecap': o.cap || 'round', fill: 'none', 'stroke-dasharray': o.dash, opacity: o.op }, g);
const poly = (g, pts, o = {}) => svgEl('path', { d: 'M' + pts.map(P2).join('L') + (o.close ? 'Z' : ''), stroke: o.color === undefined ? COL.ink : o.color, 'stroke-width': o.w ?? 3, fill: o.fill || 'none', 'fill-opacity': o.fo, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', opacity: o.op, 'stroke-dasharray': o.dash }, g);
const lab = (g, p, s, o = {}) => popable(Geo.text(g, p[0], p[1], s, Object.assign({ size: 20 }, o)));
const arc = (g, V, r, s, span, o = {}) => svgEl('path', { d: Geo.arcD(V, r, s, span), stroke: o.color || COL.amber, 'stroke-width': o.w || 2.6, fill: 'none' }, g);
const rightMk = (g, V, d1, d2, s = 14, color = COL.ink) => poly(g, [Geo.at(V, d1, s), Geo.at(Geo.at(V, d1, s), d2, s), Geo.at(V, d2, s)], { w: 2, color });
const root = (stage, W, H, x = 0, y = 0) => add(stage, svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u7l9-svg' }), x, y);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const pane = (stage, x, y, w, html, cls = 'box') => hide(add(stage, box(h('div', 'u7l9-pn ' + cls, html), w), x, y));
const show = (c, el, ms = 320) => fadeIn(c, el, ms);
/** a column of panes that stack by their own height (hidden ones keep their room, so nothing shifts) */
const column = (stage, x, y, w, gap = 6) => { const e = add(stage, box(h('div', 'u7l9-col'), w), x, y); e.style.gap = gap + 'px'; return e; };
const cp = (colEl, html, cls = 'box') => { const e = h('div', 'u7l9-pn ' + cls, html); e.style.opacity = 0; colEl.appendChild(e); return e; };
const showA = (c, el, ms = 320) => appear(c, el, ms);
/** a red ✗ (hidden) over point p */
const cross = (g, p, s = 15, color = COL.red) => { const e = popable(grp(g)); line(e, [p[0] - s, p[1] - s], [p[0] + s, p[1] + s], { w: 5, color }); line(e, [p[0] - s, p[1] + s], [p[0] + s, p[1] - s], { w: 5, color }); return hide(e); };
/** a dimension line beside A–B (off px to the left of A→B), with its label */
function dim(g, A, B, txt, o = {}) {
  const d = Geo.dirTo(A, B), n = d + 90, off = o.off ?? 18, A2 = Geo.at(A, n, off), B2 = Geo.at(B, n, off), e = grp(g), cl = o.color || COL.slate;
  line(e, A2, B2, { w: 2, color: cl });
  [A2, B2].forEach((P) => line(e, Geo.at(P, n, 7), Geo.at(P, n + 180, 7), { w: 2, color: cl }));
  const L = Geo.at(mid(A2, B2), n, o.lo ?? 14);
  Geo.text(e, L[0], L[1], txt, { size: o.size || 18, color: cl, weight: o.weight });
  return o.shown ? e : hide(e);
}
/** the angle label of a rightTri nearest to vertex v */
function angLabel(Tr, v) {
  let best = null, bd = 1e9; Tr.layers.marks.querySelectorAll('text').forEach((t) => { const dd = Math.hypot(+t.getAttribute('x') - Tr.V[v][0], +t.getAttribute('y') - Tr.V[v][1]); if (dd < bd) { bd = dd; best = t; } });
  return best && popable(best);
}
async function relabel(c, t, s, color = COL.ink) { if (!t) return; t.textContent = s; t.setAttribute('fill', color); popable(t); await pop(c, t, 380); }
/** put each opp/adj/hyp tag just beyond its side's length label (after a label got longer text) */
function fixTags(Tr) {
  const R = Tr.roles(); if (!R) return;
  Object.keys(R).forEach((role) => {
    const tg = Tr.tags[role], t = Tr.valLabels[R[role]]; if (!tg || !t) return;
    const M = sideMid(Tr, R[role]), p = [+t.getAttribute('x'), +t.getAttribute('y')], L = Math.hypot(p[0] - M[0], p[1] - M[1]) || 1, ux = (p[0] - M[0]) / L, uy = (p[1] - M[1]) / L;
    const fs = +t.getAttribute('font-size') || 20, ext = (n, f) => Math.abs(ux) * (n * f * 0.29 + 3) + Math.abs(uy) * f * 0.55;
    const d = ext(t.textContent.length, fs) + ext(tg.textContent.length, 16) + 4;
    tg.setAttribute('x', (p[0] + ux * d).toFixed(1)); tg.setAttribute('y', (p[1] + uy * d).toFixed(1));
  });
}
/** a rightTri side label gets a longer text: slide it outward so it still clears the side */
async function relabelSide(c, Tr, sd, s, color = COL.ink) {
  const t = Tr.valLabels[sd]; if (!t) return;
  const M = sideMid(Tr, sd), p = [+t.getAttribute('x'), +t.getAttribute('y')], L = Math.hypot(p[0] - M[0], p[1] - M[1]) || 1, ux = (p[0] - M[0]) / L, uy = (p[1] - M[1]) / L;
  const fs = +t.getAttribute('font-size') || 20, extra = (s.length - t.textContent.length) * fs * 0.29 * Math.abs(ux);
  t.setAttribute('x', (p[0] + ux * extra).toFixed(1)); t.setAttribute('y', (p[1] + uy * extra).toFixed(1));
  await relabel(c, t, s, color); fixTags(Tr);
}
const sideMid = (Tr, s) => { const e = { a: ['B', 'C'], b: ['A', 'C'], c: ['A', 'B'] }[s]; return mid(Tr.V[e[0]], Tr.V[e[1]]); };
/** where to cross out a side: away from the angle θ at A, so the angle label stays clear */
const crossPt = (Tr, s) => (s === 'a' ? sideMid(Tr, 'a') : lerp(Tr.V.A, Tr.V[s === 'b' ? 'C' : 'B'], 0.64));
const tagOf = (Tr, role) => Tr.tags[role];
const kStamp = (stage, txt, ok, x, y, rot = -6) => hide(stamp(stage, txt, { ok, x, y, rotate: rot }));
const sIn = (c, el) => { el.style.opacity = ''; return stampIn(c, el); };

/* =====================================================================================
 * shared scenes (card figures and explainers)
 * ===================================================================================== */
/** Example 4: the ramp to the hall door. o: { W, gy, xd, u (px per m along), vx (vertical stretch), top, size } */
function rampScene(g, o) {
  const run = 0.6 / tanD(4.8), A = [o.xd - run * o.u, o.gy], C = [o.xd, o.gy], B = [o.xd, o.gy - 0.6 * o.u * o.vx], sz = o.size || 20;
  svgEl('rect', { x: 0, y: o.gy, width: o.W, height: 16, fill: '#d9d4ca' }, g);
  svgEl('rect', { x: o.xd, y: o.top, width: o.W - o.xd, height: o.gy - o.top, fill: '#e8e1d4', stroke: COL.slate, 'stroke-width': 2 }, g);
  const dw = Math.min(56, (o.W - o.xd) - 26), dh = Math.min(o.dh || 120, B[1] - o.top - 8);
  svgEl('rect', { x: o.xd + 14, y: B[1] - dh, width: dw, height: dh, rx: 3, fill: COL.wood, stroke: COL.woodD, 'stroke-width': 2 }, g);
  svgEl('circle', { cx: o.xd + 14 + dw - 10, cy: B[1] - dh / 2, r: 3.5, fill: '#f2c14e' }, g);
  line(g, [o.xd, B[1]], [o.W, B[1]], { w: 3, color: COL.slate });
  line(g, [0, o.gy], [o.W, o.gy], { w: 3 });
  const fill = poly(g, [A, B, C], { close: true, color: 'none', fill: '#efe2cc' });
  const hyp = line(g, A, B, { w: 5, color: COL.brand });
  rightMk(g, C, 180, 90, 13);
  const ang = arc(g, A, 100, 0, Geo.dirTo(A, B));
  const lA = lab(g, [A[0] + 148, A[1] - 13], '4.8°', { size: sz, color: COL.amber });
  return { A, B, C, run, fill, hyp, ang, lA };
}
/** Example 5: the ladder against the house. o: { wx, gy, u (px per ft), size } */
function ladderScene(g, o) {
  const C = [o.wx, o.gy], F = [o.wx + 6 * o.u, o.gy], Tp = [o.wx, o.gy - Math.sqrt(540) * o.u], sz = o.size || 20;
  svgEl('rect', { x: o.wx - (o.wallW || 46), y: Tp[1] - 26, width: o.wallW || 46, height: o.gy - Tp[1] + 26, fill: '#e8e1d4' }, g);
  for (let y = o.gy - 18; y > Tp[1] - 20; y -= 18) line(g, [o.wx - (o.wallW || 46), y], [o.wx, y], { w: 1, color: '#cbbfa9' });
  line(g, [o.wx, Tp[1] - 26], [o.wx, o.gy], { w: 3.2 });
  line(g, [o.wx - (o.wallW || 46) - 10, o.gy], [F[0] + (o.gx || 90), o.gy], { w: 3 });
  const lad = grp(g), d = Geo.dirTo(F, Tp), L = Math.hypot(F[0] - Tp[0], F[1] - Tp[1]), sp = 6;
  const rail = (s) => line(lad, Geo.at(F, d + 90 * s, sp), Geo.at(Tp, d + 90 * s, sp), { w: 3, color: COL.amber });
  for (let t = 0.06; t < 0.98; t += 0.075) { const P = lerp(F, Tp, t); line(lad, Geo.at(P, d + 90, sp), Geo.at(P, d - 90, sp), { w: 2, color: '#b58a3c' }); }
  rail(1); rail(-1);
  const hyp = line(g, F, Tp, { w: 2, color: 'none' });
  rightMk(g, C, 0, 90, 13);
  const ang = arc(g, F, 40, d, 180 - d);
  return { C, F, Tp, d, L, lad, hyp, ang, sz, gy: o.gy };
}
/** Example 6: the drone, Ava and Ben. o: { x0, gy, u (px per m), size, apart } */
function droneScene(g, o) {
  const x = 45 / tanD(34), y = 45 / tanD(52), u = o.u, A = [o.x0, o.gy], D = [o.x0 + x * u, o.gy], Dr = [D[0], o.gy - 45 * u], B = [D[0] + y * u, o.gy], sz = o.size || 20;
  svgEl('rect', { x: 0, y: o.gy, width: o.W, height: o.gh || 18, fill: '#cfe6c2' }, g);
  line(g, [0, o.gy], [o.W, o.gy], { w: 3, color: '#5f8f4e' });
  const tri = (P, cl) => { const e = grp(g); poly(e, [P, D, Dr], { close: true, color: 'none', fill: cl, fo: 0.16 }); line(e, P, Dr, { w: 3, color: COL.ink }); line(e, D, Dr, { w: 2.6, dash: '8 6', color: COL.slate }); rightMk(e, D, P[0] < D[0] ? 180 : 0, 90, 12); return e; };
  const gA = tri(A, COL.blue), gB = tri(B, COL.purple);
  arc(gA, A, 54, 0, 34); arc(gB, B, 44, 128, 52);
  const lA = lab(gA, Geo.at(A, 17, 76), '34°', { size: sz, color: COL.amber }), lB = lab(gB, Geo.at(B, 154, 66), '52°', { size: sz, color: COL.amber });
  const person = (P, name, cl) => { const e = grp(g); svgEl('circle', { cx: P[0], cy: P[1] - 30, r: 6, fill: cl }, e); line(e, [P[0], P[1] - 24], [P[0], P[1] - 10], { w: 3, color: cl }); line(e, [P[0], P[1] - 10], [P[0] - 5, P[1]], { w: 3, color: cl }); line(e, [P[0], P[1] - 10], [P[0] + 5, P[1]], { w: 3, color: cl }); Geo.text(e, P[0], P[1] + (o.nameDy || 20), name, { size: sz - 2, color: cl, weight: 700 }); return e; };
  const pA = person(A, 'Ava', COL.blue), pB = person(B, 'Ben', COL.purple);
  const dr = grp(g); svgEl('rect', { x: Dr[0] - 14, y: Dr[1] - 6, width: 28, height: 11, rx: 4, fill: COL.slate }, dr);
  [-1, 1].forEach((s) => { line(dr, [Dr[0] + s * 12, Dr[1] - 6], [Dr[0] + s * 12, Dr[1] - 11], { w: 2, color: COL.slate }); const r = svgEl('ellipse', { cx: Dr[0] + s * 12, cy: Dr[1] - 12, rx: 11, ry: 2.6, fill: '#7d8797' }, dr); if (o.spin) svgEl('animate', { attributeName: 'rx', values: '11;3;11', dur: '0.25s', repeatCount: 'indefinite' }, r); });
  return { x, y, A, D, Dr, B, gA, gB, lA, lB, pA, pB, dr, gy: o.gy };
}
/** Example 7: the garage front. o: { x0, gy, u (px per m), size } */
function garageScene(g, o) {
  const u = o.u, x0 = o.x0, gy = o.gy, w = 7.2 * u, wt = gy - 2.7 * u, rise = 3.6 * tanD(24) * u, L = [x0, wt], R = [x0 + w, wt], M = [x0 + w / 2, wt], Pk = [x0 + w / 2, wt - rise], sz = o.size || 18;
  svgEl('rect', { x: x0, y: wt, width: w, height: gy - wt, fill: '#f3efe6', stroke: COL.ink, 'stroke-width': 3 }, g);
  svgEl('rect', { x: x0 + w * 0.18, y: wt + (gy - wt) * 0.3, width: w * 0.64, height: (gy - wt) * 0.7, fill: '#e2dccd', stroke: COL.slate, 'stroke-width': 2 }, g);
  for (let i = 1; i < 4; i++) line(g, [x0 + w * 0.18, wt + (gy - wt) * (0.3 + 0.175 * i)], [x0 + w * 0.82, wt + (gy - wt) * (0.3 + 0.175 * i)], { w: 1.5, color: '#b9b0a0' });
  const roof = poly(g, [L, Pk, R], { color: COL.brand, w: 4, fill: '#efe2cc' });
  line(g, [x0 - 30, gy], [x0 + w + 30, gy], { w: 3 });
  const dash = line(g, M, Pk, { w: 2.4, dash: '7 5', color: COL.slate });
  const rm = rightMk(g, M, 180, 90, 11);
  arc(g, L, 46, 0, 24); arc(g, R, 46, 156, 24);
  const aL = lab(g, Geo.at(L, 12, 68), '24°', { size: sz, color: COL.amber }), aR = lab(g, Geo.at(R, 168, 68), '24°', { size: sz, color: COL.amber });
  return { u, x0, gy, w, wt, rise, L, R, M, Pk, roof, dash, rm, aL, aR };
}

/* ---------- card figures ---------- */
function cardFigs() {
  const rt = (id, o) => { const el = document.getElementById(id); if (el) Geo.rightTri(el, Object.assign({ width: 270, height: 180, names: false, size: 18, pad: 40 }, o)); };
  rt('u7l9-f-1a', { a: 5, b: 12, sides: { a: '5 cm', b: '12 cm', c: 'x' } });
  rt('u7l9-f-1b', { A: 35, c: 20, sides: { a: 'x', c: '20 m' }, angles: { A: '35°' } });
  rt('u7l9-f-1c', { a: 7, b: 4, sides: { a: '7 in', b: '4 in' }, angles: { A: 'θ' }, width: 230, height: 200 });
  rt('u7l9-f-1d', { A: 62, c: 3, angles: { A: '62°', B: 'θ' }, width: 230, height: 190 });
  rt('u7l9-f-2', { A: 38, c: 14.5, names: ['A', 'B', 'C'], sides: { a: 'a', b: 'b', c: '14.5 m' }, angles: { A: '38°' }, width: 360, height: 250, size: 19 });
  rt('u7l9-f-3', { a: 7.2, b: 9.6, names: ['A', 'B', 'C'], sides: { a: '7.2 cm', b: '9.6 cm', c: 'c' }, width: 360, height: 250, size: 19 });
  rt('u7l9-f-3b', { A: 25, b: 10, names: ['A', 'B', 'C'], sides: { a: 'a', b: '10 m', c: 'c' }, angles: { A: '25°' }, width: 360, height: 220, size: 19 });
  const s4 = document.getElementById('u7l9-f-4');
  if (s4) { const R = rampScene(s4, { W: 860, gy: 160, xd: 760, u: 84, vx: 2, top: 20, dh: 100, size: 19 });
    Geo.text(s4, R.C[0] - 34, (R.B[1] + R.C[1]) / 2 + 8, '0.6 m', { size: 18 }); Geo.text(s4, mid(R.A, R.B)[0] - 10, mid(R.A, R.B)[1] - 22, 'ramp', { size: 18, color: COL.brand });
    Geo.text(s4, mid(R.A, R.C)[0], R.C[1] + 30, 'horizontal run', { size: 18 }); Geo.text(s4, 150, 40, '(not to scale)', { size: 15, color: COL.gray, halo: false }); }
  const s5 = document.getElementById('u7l9-f-5');
  if (s5) { const L = ladderScene(s5, { wx: 96, gy: 262, u: 9.4, wallW: 50, gx: 60, size: 19 });
    Geo.text(s5, mid(L.C, L.F)[0], L.gy + 22, '6 ft', { size: 18 }); const m = Geo.at(mid(L.F, L.Tp), L.d - 90, 30); Geo.text(s5, m[0], m[1], '24 ft', { size: 18 });
    Geo.text(s5, L.F[0] - 22, L.F[1] - 44, 'θ', { size: 20, color: COL.amber, italic: true }); Geo.text(s5, L.C[0] + 16, (L.C[1] + L.Tp[1]) / 2, 'h', { size: 20, italic: true, color: COL.red });
    Geo.text(s5, L.C[0] - 25, (L.C[1] + L.Tp[1]) / 2, 'wall', { size: 15, color: COL.slate, halo: false }); }
  const s6 = document.getElementById('u7l9-f-6');
  if (s6) { const D = droneScene(s6, { W: 860, x0: 226, gy: 206, u: 4, size: 18, gh: 44, spin: false });
    Geo.text(s6, D.Dr[0] + 30, (D.Dr[1] + D.D[1]) / 2, '45 m', { size: 18 }); Geo.text(s6, D.Dr[0], D.Dr[1] - 24, 'drone', { size: 16, color: COL.slate });
    Geo.text(s6, mid(D.A, D.D)[0], D.gy + 18, 'x', { size: 19, italic: true, color: COL.red }); Geo.text(s6, mid(D.D, D.B)[0], D.gy + 18, 'y', { size: 19, italic: true, color: COL.red }); }
  const s7 = document.getElementById('u7l9-f-7');
  if (s7) { const G = garageScene(s7, { x0: 70, gy: 232, u: 38, size: 17 });
    Geo.text(s7, G.x0 + G.w / 2, G.gy + 18, '7.2 m', { size: 17 }); Geo.text(s7, G.x0 - 30, (G.wt + G.gy) / 2, '2.7 m', { size: 17 });
    Geo.text(s7, G.M[0] + 28, G.wt - G.rise / 2 + 6, 'rise', { size: 15, color: COL.slate }); Geo.text(s7, G.x0 + G.w / 4 - 14, G.wt - G.rise / 2 - 18, 'rafter', { size: 15, color: COL.brand }); }
  const s7b = document.getElementById('u7l9-f-7b');
  if (s7b) { const u = 4.6, gy = 232, x1 = 70, x2 = x1 + 30 * u, top1 = gy - 20 * u, top2 = gy - 38.746 * u, M = [x1, top1];
    line(s7b, [10, gy], [370, gy], { w: 3 });
    svgEl('rect', { x: x1 - 50, y: top1, width: 50, height: 20 * u, fill: '#e2dccd', stroke: COL.ink, 'stroke-width': 2.4 }, s7b);
    svgEl('rect', { x: x2, y: top2, width: 70, height: gy - top2, fill: '#d7dee8', stroke: COL.ink, 'stroke-width': 2.4 }, s7b);
    line(s7b, M, [x2, top1], { w: 2.2, dash: '7 5', color: COL.slate }); line(s7b, M, [x2, top2], { w: 2.6, color: COL.ink }); line(s7b, M, [x2, gy], { w: 2.2, color: COL.slate, dash: '3 4' });
    rightMk(s7b, [x2, top1], 180, 90, 10); arc(s7b, M, 46, 0, 32);
    Geo.text(s7b, ...Geo.at(M, 16, 70), '32°', { size: 17, color: COL.amber }); Geo.text(s7b, (x1 + x2) / 2, top1 + 16, '30 m', { size: 16 });
    Geo.text(s7b, x1 - 25, (top1 + gy) / 2, '20 m', { size: 16 }); svgEl('circle', { cx: M[0] - 6, cy: M[1] - 9, r: 6, fill: COL.blue }, s7b); Geo.text(s7b, M[0] - 22, M[1] - 22, 'Mo', { size: 15, color: COL.blue });
    Geo.text(s7b, x2 + 35, top2 - 12, '?', { size: 20, color: COL.red, weight: 800 }); }
}
cardFigs();

/* =====================================================================================
 * 1. The tool chooser (Example 1)
 * ===================================================================================== */
const FN = {
  start: { x: 310, y: 30, w: 300, h: 50, html: '<b>What do I want?</b>', cls: 'bk-round' },
  side: { x: 155, y: 114, w: 230, h: 52, html: '<b>a side</b>', color: '#c93a33' },
  ang: { x: 465, y: 114, w: 230, h: 52, html: '<b>an angle</b>', color: '#7b4fc4' },
  pyth: { x: 78, y: 236, w: 146, h: 78, html: '<b>Pythagoras</b>I know two sides', color: '#1f5bd6' },
  ratio: { x: 232, y: 236, w: 146, h: 78, html: '<b>SOH CAH TOA</b>I know an angle + a side', color: '#12805a' },
  other: { x: 388, y: 236, w: 146, h: 78, html: '<b>90° − angle</b>I know the other angle', color: '#c27a0e' },
  inv: { x: 542, y: 236, w: 146, h: 78, html: '<b>2nd + ratio</b>I know two sides', color: '#9a6a24' }
};
const FE = [{ from: 'start', to: 'side', label: 'a side' }, { from: 'start', to: 'ang', label: 'an angle' },
  { from: 'side', to: 'pyth', route: 'vhv' }, { from: 'side', to: 'ratio', route: 'vhv' }, { from: 'ang', to: 'other', route: 'vhv' }, { from: 'ang', to: 'inv', route: 'vhv' }];
const CARDS = [['SOH', 'sin', ['opp', 'hyp']], ['CAH', 'cos', ['adj', 'hyp']], ['TOA', 'tan', ['opp', 'adj']]];
const RATIO_OF = { adj: 'SOH', opp: 'CAH', hyp: 'TOA' };
const CH = {
  a: { label: '(a) hypotenuse', ask: 'Example 1(a): the legs are 5 cm and 12 cm. Name the tool and find <i>x</i>.', tri: { a: 5, b: 12 }, sides: { a: '5 cm', b: '12 cm', c: 'x' }, angles: {},
    want: 'side', leaf: 'pyth', know: 'Know: <b>two sides</b> (5 and 12)<br>Want: <b>the third side</b>', cap1: 'Step 1: <b>sketch and label</b>. The <b>hyp</b> is across from the right angle. It is <i>x</i>.',
    capK: 'I know <b>two sides</b>: <b>Pythagoras</b>. No ratio needed.', eqs: ['x^2=5^2+12^2=25+144=169', 'x=\\sqrt{169}=13'], capS: `Step 3: solve. ${T('x^2=5^2+12^2=169')}, so ${T('x=13')}.`, res: 'The hypotenuse is <b>13 cm</b>', tool: 'Pythagoras' },
  b: { label: '(b) side x', ask: 'Example 1(b): an angle of 35° and a hypotenuse of 20 m. Name the tool and find <i>x</i>.', tri: { A: 35, c: 20 }, sides: { a: 'x', c: '20 m' }, angles: { A: '35°' }, theta: 'A', thetaLabel: '35°',
    want: 'side', leaf: 'ratio', leave: 'adj', know: 'Know: <b>35°</b> and the <b>hyp</b> (20 m)<br>Want: the <b>opp</b> side (<i>x</i>)', cap1: 'Step 1: <b>sketch and label</b> from the 35° angle.',
    capK: 'I know an <b>angle and a side</b>: a ratio.', capL: 'Leave one out: the <b>adj</b> is not known and not wanted. No adj → <b>SOH</b>.',
    eqs: ['\\sin35^\\circ=\\dfrac{x}{20}', 'x=20\\sin35^\\circ=11.471\\ldots'], capS: 'Step 3: <i>x</i> is on <b>top</b>, so <b>multiply</b>: 20 × sin 35°.', res: `${T('x\\approx11.5')} m`, tool: 'sine (SOH)' },
  c: { label: '(c) angle θ', ask: 'Example 1(c): the legs are 4 in and 7 in. Name the tool and find θ.', tri: { a: 7, b: 4 }, sides: { a: '7 in', b: '4 in' }, angles: { A: 'θ' }, theta: 'A', thetaLabel: 'θ',
    want: 'ang', leaf: 'inv', leave: 'hyp', know: 'Know: <b>opp</b> 7 in and <b>adj</b> 4 in<br>Want: the <b>angle</b> θ', cap1: 'Step 1: <b>sketch and label</b> from θ.',
    capK: 'I know <b>two sides</b> and want an <b>angle</b>: the inverse key.', capL: 'Leave one out: the <b>hyp</b> is not known and not wanted. No hyp → <b>TOA</b>.',
    eqs: ['\\tan\\theta=\\dfrac74', '\\theta=\\tan^{-1}\\!\\left(\\tfrac74\\right)=60.255\\ldots'], capS: `Step 3: ${T('\\tan\\theta=\\frac74')}, then <b>2nd tan</b>: ${T('\\theta=60.255\\ldots')}`, res: `${T('\\theta\\approx60^\\circ')}`, tool: 'inverse tangent' },
  d: { label: '(d) angle θ', ask: 'Example 1(d): one acute angle is 62°. Name the tool and find θ.', tri: { A: 62, c: 3 }, sides: {}, angles: { A: '62°', B: 'θ' },
    want: 'ang', leaf: 'other', know: 'Know: <b>one acute angle</b> (62°)<br>Want: <b>the other</b> acute angle', cap1: 'Step 1: <b>sketch and label</b>. Mark the angle you know (62°) and the one you want (θ).',
    capK: 'I know the <b>other acute angle</b>: the two add to 90°.', eqs: ['\\theta=90^\\circ-62^\\circ=28^\\circ'], capS: `Step 3: ${T('\\theta=90^\\circ-62^\\circ=28^\\circ')}`, res: `${T('\\theta=28^\\circ')}`, tool: '90° − the angle' }
};
const chooser = {
  title: 'Which tool? Follow the chart',
  height: 480, minW: 980,
  choices: Object.keys(CH).map((k) => ({ v: k, label: 'Example 1' + CH[k].label })),
  ask: (k) => CH[k].ask,
  make(stage, k, ex) {
    const d = CH[k], RW = 610, X = ex.W - RW, LW = X - 14;
    const Tr = Geo.rightTri(stage, Object.assign({ x: 0, y: 0, width: LW, height: 220, names: false, size: 19, pad: 42 }, d.tri, { sides: d.sides, angles: d.angles, thetaLabel: d.thetaLabel }));
    const F = new Flowchart(stage, { x: X - 5, y: 0, width: 620, height: 290, nodes: FN, edges: FE });
    const cw = (RW - 20) / 3, cards = CARDS.map(([nm, fn, uses], i) => { const e = add(stage, box(h('div', 'u7l9-card3', `${nm}<small>${T(`\\${fn}\\theta=\\tfrac{\\text{${uses[0]}}}{\\text{${uses[1]}}}`)}</small>`), cw, 72), X + i * (cw + 10), 300); e.nm = nm; e.uses = uses; return e; });
    const colL = column(stage, 0, 226, LW), know = cp(colL, d.know, 'kw');
    const eqs = d.eqs.map((q) => cp(colL, T(q), 'eq'));
    const res = cp(colL, d.res, 'res');
    const toolP = pane(stage, X, 390, RW - 190, `Tool: <b>${d.tool}</b>`, 'kw bigt');
    const st = kStamp(stage, d.tool === 'Pythagoras' || d.tool.startsWith('90') ? 'no ratio' : RATIO_OF[d.leave] + ' ✓', true, X + RW - 90, 420);
    const lo = d.leave ? cross(Tr.g, crossPt(Tr, Geo.rolesFor('A')[d.leave]), 14) : null;
    const steps = [];
    steps.push({ cap: d.cap1, run: async (c) => { if (d.theta) await Tr.setTheta(c, d.theta); else if (k === 'a') await Tr.highlight(c, 'c'); else { await pulse(c, angLabel(Tr, 'A'), 1.3); await pulse(c, angLabel(Tr, 'B'), 1.3); } } });
    steps.push({ cap: `Step 2: what do I <b>want</b>? ${d.want === 'side' ? 'A <b>side</b>.' : 'An <b>angle</b>.'}`, run: async (c) => { await F.visit(c, 'start'); await F.go(c, 'start', d.want); await F.visit(c, d.want); } });
    steps.push({ cap: d.capK, run: async (c) => { await show(c, know); await F.go(c, d.want, d.leaf); await F.visit(c, d.leaf); } });
    if (d.leave) {
      steps.push({ cap: d.capL, run: async (c) => {
        lo.style.opacity = ''; await pop(c, lo); const tg = tagOf(Tr, d.leave); if (tg) tg.setAttribute('opacity', 0.35);
        for (const e of cards) { if (e.uses.indexOf(d.leave) >= 0) e.classList.add('dim'); else { e.classList.add('on'); await pulse(c, e, 1.08); } }
      } });
    } else steps[2].run = ((r) => async (c) => { await r(c); cards.forEach((e) => e.classList.add('dim')); await sleep(c, 200); })(steps[2].run);
    steps.push({ cap: d.capS, run: async (c) => { for (const e of eqs) await show(c, e); } });
    steps.push({ cap: `${d.res}. Tool: <b>${d.tool}</b>.`, run: async (c) => { await show(c, res); await show(c, toolP); await sIn(c, st); } });
    return steps;
  }
};

/* ---------- speed round (Full notes): which tool? ---------- */
const QK = [
  { tri: { a: 6, b: 8 }, sides: { a: '6 m', b: '8 m', c: 'x' }, know: 'two legs', want: 'the hypotenuse', tool: 'Pythagoras', why: 'Two sides known, want the third side.', eq: ['x^2=6^2+8^2=100', 'x=\\sqrt{100}=10'], ans: 'x = 10 m' },
  { tri: { A: 40, b: 10 }, sides: { a: 'x', b: '10 m' }, theta: 'A', tl: '40°', know: '40° and the adj', want: 'the opp', tool: 'tangent (TOA)', leave: 'hyp', why: 'No hyp → <b>TOA</b>. <i>x</i> on top: multiply.', eq: ['\\tan40^\\circ=\\dfrac{x}{10}', `x=10\\tan40^\\circ=${dots(10 * tanD(40))}`], ans: 'x ≈ 8.4 m' },
  { tri: { a: 9, c: 15 }, sides: { a: '9 cm', c: '15 cm' }, theta: 'A', tl: 'θ', know: 'the opp and the hyp', want: 'the angle', tool: 'inverse sine', leave: 'adj', why: 'No adj → <b>SOH</b>, then <b>2nd sin</b>.', eq: ['\\sin\\theta=\\dfrac{9}{15}', `\\theta=\\sin^{-1}\\!\\left(\\dfrac{9}{15}\\right)=${dots(asinD(0.6))}`], ans: 'θ ≈ 37°' },
  { tri: { A: 55, c: 3 }, sides: {}, angles: { A: '55°', B: 'θ' }, know: 'one acute angle', want: 'the other one', tool: '90° − the angle', why: 'The two acute angles add to 90°.', eq: ['\\theta=90^\\circ-55^\\circ=35^\\circ'], ans: 'θ = 35°' },
  { tri: { A: 28, c: 30 }, sides: { b: 'x', c: '30 ft' }, theta: 'A', tl: '28°', know: '28° and the hyp', want: 'the adj', tool: 'cosine (CAH)', leave: 'opp', why: 'No opp → <b>CAH</b>. <i>x</i> on top: multiply.', eq: ['\\cos28^\\circ=\\dfrac{x}{30}', `x=30\\cos28^\\circ=${dots(30 * cosD(28))}`], ans: 'x ≈ 26.5 ft' },
  { tri: { A: 50, a: 12 }, sides: { a: '12 cm', c: 'x' }, theta: 'A', tl: '50°', know: '50° and the opp', want: 'the hyp', tool: 'sine (SOH)', leave: 'adj', why: 'No adj → <b>SOH</b>. <i>x</i> on the bottom: <b>divide</b>.', eq: ['\\sin50^\\circ=\\dfrac{12}{x}', `x=\\dfrac{12}{\\sin50^\\circ}=${dots(12 / sinD(50))}`], ans: 'x ≈ 15.7 cm' },
  { tri: { a: 5, c: 13 }, sides: { a: '5 m', c: '13 m', b: 'x' }, know: 'a leg and the hyp', want: 'the other leg', tool: 'Pythagoras', why: 'Two sides known, want the third: <b>subtract</b> for a leg.', eq: ['x^2=13^2-5^2=169-25=144', 'x=\\sqrt{144}=12'], ans: 'x = 12 m' }
];
const quick = {
  title: 'Speed round: which tool?',
  height: 380, minW: 900,
  choices: QK.map((q, i) => ({ v: i, label: 'Triangle ' + (i + 1) })),
  ask: 'Which tool would you use? Say it before you press Next.',
  make(stage, i, ex) {
    const q = QK[i], X = 470, PW = ex.W - X - 10;
    const Tr = Geo.rightTri(stage, Object.assign({ x: 0, y: 0, width: 450, height: 360, names: false, size: 21, pad: 52 }, q.tri, { sides: q.sides, angles: q.angles || (q.theta ? { A: q.tl } : {}), thetaLabel: q.tl }));
    const qc = column(stage, X, 8, PW), kp = cp(qc, `Know: <b>${q.know}</b><br>Want: <b>${q.want}</b>`, 'kw');
    const tp = cp(qc, `<b>${q.tool}</b><br><span class="u7l9-adj">${q.why}</span>`, 'box');
    const eqs = q.eq.map((s) => cp(qc, T(s), 'eq'));
    const ap = cp(qc, q.ans, 'res');
    const lo = q.leave ? cross(Tr.g, crossPt(Tr, Geo.rolesFor('A')[q.leave]), 14) : null;
    return [
      { cap: 'What do you know? What do you want? <b>Which tool?</b>', run: async (c) => { await show(c, kp); if (q.theta) await Tr.setTheta(c, 'A'); } },
      { cap: `<b>${q.tool}</b>. ${q.why}`, run: async (c) => { if (lo) { lo.style.opacity = ''; await pop(c, lo); } await show(c, tp); } },
      { cap: 'Write the equation and solve.', run: async (c) => { for (const e of eqs) await show(c, e); } },
      { cap: `${q.ans.replace(/^([a-zθ])/, '<i>$1</i>')}.`, run: (c) => show(c, ap) }
    ];
  }
};

/* =====================================================================================
 * 2. Solving a whole triangle (Examples 2 and 3)
 * ===================================================================================== */
const solveAll = {
  title: 'Solve the whole triangle, one piece at a time',
  height: 430, minW: 960,
  choices: [{ v: 'ex2', label: 'Example 2 check: 38° and 14.5 m' }, { v: 'ex3', label: 'Example 3 check: legs 7.2 and 9.6' }],
  ask: (k) => (k === 'ex2' ? `Solve ${T('\\triangle ABC')}: ${T('\\angle C=90^\\circ')}, ${T('\\angle A=38^\\circ')}, hypotenuse ${T('c=14.5')} m. Find ${T('\\angle B')}, <i>a</i> and <i>b</i>.` : `Solve ${T('\\triangle ABC')}: ${T('\\angle C=90^\\circ')}, legs ${T('a=7.2')} cm and ${T('b=9.6')} cm. Find <i>c</i>, ${T('\\angle A')} and ${T('\\angle B')}.`),
  make(stage, k, ex) {
    const X = 440, PW = ex.W - X - 4, col = column(stage, X, 0, PW);
    if (k === 'ex2') {
      const a = 14.5 * sinD(38), b = 14.5 * cosD(38);
      const Tr = Geo.rightTri(stage, { x: 0, y: 0, width: 436, height: 420, pad: [44, 104, 52, 40], A: 38, c: 14.5, sides: { a: 'a', b: 'b', c: '14.5 m' }, angles: { A: '38°', B: '?' }, thetaLabel: '38°', size: 21 });
      const head = cp(col, `To find: ${T('\\angle B')}, &nbsp;<i>a</i>, &nbsp;<i>b</i>`, 'kw');
      const r1 = cp(col, `<b>Angle</b> &nbsp;${T('\\angle B=90^\\circ-38^\\circ=52^\\circ')}`, 'eq');
      const r2a = cp(col, `<b><i>a</i></b>: <span class="u7l9-opp">opp</span>, <span class="u7l9-hyp">hyp</span> → SOH &nbsp;${T('\\sin38^\\circ=\\dfrac{a}{14.5}')}`, 'eq');
      const r2 = cp(col, `${T(`a=14.5\\sin38^\\circ=${dots(a)}\\approx8.9`)} m`, 'res');
      const r3a = cp(col, `<b><i>b</i></b>: <span class="u7l9-adj">adj</span>, <span class="u7l9-hyp">hyp</span> → CAH &nbsp;${T('\\cos38^\\circ=\\dfrac{b}{14.5}')}`, 'eq');
      const r3 = cp(col, `${T(`b=14.5\\cos38^\\circ=${dots(b)}\\approx11.4`)} m`, 'res');
      const r4 = cp(col, `Check: ${T('8.927^2+11.426^2=210.25=14.5^2')} ✓`, 'chk');
      return [
        { cap: 'To solve means to find <b>everything</b> that is missing: one angle and two sides.', run: (c) => show(c, head) },
        { cap: `Angle first: ${T('\\angle B=90^\\circ-38^\\circ=52^\\circ')}.`, run: async (c) => { await show(c, r1); await relabel(c, angLabel(Tr, 'B'), '52°', COL.amber); } },
        { cap: 'Side <i>a</i>: from 38°, <i>a</i> is <b>opp</b> and 14.5 m is <b>hyp</b>. No adj → <b>SOH</b>.', run: async (c) => { await Tr.setTheta(c, 'A'); await Tr.highlight(c, 'opp'); await Tr.highlight(c, 'hyp'); await show(c, r2a); } },
        { cap: `Unknown on top: <b>multiply</b>. ${T('a=14.5\\sin38^\\circ\\approx8.9')} m.`, run: async (c) => { await show(c, r2); await relabelSide(c, Tr, 'a', '8.9 m'); } },
        { cap: 'Side <i>b</i>: <b>adj</b> and <b>hyp</b> → <b>CAH</b>. Use the <b>given</b> 14.5, not the rounded 8.9.', run: async (c) => { Tr.clearHighlight(); await Tr.highlight(c, 'adj'); await Tr.highlight(c, 'hyp'); await show(c, r3a); } },
        { cap: `${T('b=14.5\\cos38^\\circ\\approx11.4')} m.`, run: async (c) => { await show(c, r3); await relabelSide(c, Tr, 'b', '11.4 m'); } },
        { cap: 'Check with Pythagoras (full values): it works ✓. And the bigger angle (52°) faces the longer leg (11.4 m) ✓', run: async (c) => { Tr.clearHighlight(); await show(c, r4); await Tr.highlight(c, 'b', { color: COL.green }); await pulse(c, angLabel(Tr, 'B'), 1.3); } }
      ];
    }
    const A = atanD(0.75);
    const Tr = Geo.rightTri(stage, { x: 0, y: 0, width: 436, height: 420, pad: [44, 104, 52, 40], a: 7.2, b: 9.6, sides: { a: '7.2 cm', b: '9.6 cm', c: 'c' }, angles: { A: '?', B: '?' }, thetaLabel: '?', size: 21 });
    const head = cp(col, `To find: <i>c</i>, &nbsp;${T('\\angle A')}, &nbsp;${T('\\angle B')}`, 'kw');
    const r1a = cp(col, `<b><i>c</i></b>: Pythagoras &nbsp;${T('c^2=7.2^2+9.6^2=144')}`, 'eq');
    const r1 = cp(col, `${T('c=\\sqrt{144}=12.0')} cm`, 'res');
    const r2a = cp(col, `<b>∠<i>A</i></b>: <span class="u7l9-opp">opp</span>, <span class="u7l9-adj">adj</span> → TOA &nbsp;${T('\\tan A=\\dfrac{7.2}{9.6}=0.75')}`, 'eq');
    const r2 = cp(col, `${T(`\\angle A=\\tan^{-1}(0.75)=${dots(A)}\\approx37^\\circ`)}`, 'res');
    const r3 = cp(col, `<b>∠<i>B</i></b>: ${T(`90^\\circ-${dots(A)}^\\circ\\approx53^\\circ`)}`, 'eq');
    const r4 = cp(col, `Check: ${T('\\tan^{-1}\\!\\left(\\tfrac{9.6}{7.2}\\right)=53.130\\ldots')} ✓`, 'chk');
    return [
      { cap: 'To solve means to find <b>everything</b> that is missing: one side and two angles.', run: (c) => show(c, head) },
      { cap: `Side <i>c</i>: two sides known → <b>Pythagoras</b>. ${T('51.84+92.16=144')}.`, run: async (c) => { await Tr.highlight(c, 'c'); await show(c, r1a); } },
      { cap: `${T('c=\\sqrt{144}=12.0')} cm.`, run: async (c) => { await show(c, r1); await relabelSide(c, Tr, 'c', '12.0 cm'); } },
      { cap: 'Angle <i>A</i>: from <i>A</i>, 7.2 is <b>opp</b> and 9.6 is <b>adj</b> (both given). No hyp → <b>TOA</b>.', run: async (c) => { Tr.clearHighlight(); await Tr.setTheta(c, 'A'); fixTags(Tr); await show(c, r2a); } },
      { cap: `<b>2nd tan</b>: ${T('\\angle A=36.869\\ldots\\approx37^\\circ')}.`, run: async (c) => { await show(c, r2); await relabel(c, angLabel(Tr, 'A'), '37°', COL.amber); } },
      { cap: `Angle <i>B</i>: ${T('90^\\circ-36.869\\ldots^\\circ=53.130\\ldots\\approx53^\\circ')}.`, run: async (c) => { await show(c, r3); await relabel(c, angLabel(Tr, 'B'), '53°', COL.amber); } },
      { cap: 'Check from <i>B</i>: 9.6 is opp, 7.2 is adj ✓. The bigger angle <i>B</i> faces the longer leg (9.6 cm) ✓', run: async (c) => { await show(c, r4); await Tr.highlight(c, 'b', { color: COL.green }); await pulse(c, angLabel(Tr, 'B'), 1.3); } }
    ];
  }
};

/* =====================================================================================
 * 3. Real problems: the ramp (Example 4) and the ladder (Example 5)
 * ===================================================================================== */
function wheelchair(g) {
  const e = grp(g), cl = COL.blue;
  svgEl('circle', { cx: 0, cy: -15, r: 15, fill: 'none', stroke: cl, 'stroke-width': 3.2 }, e);
  svgEl('circle', { cx: 24, cy: -6, r: 6, fill: 'none', stroke: cl, 'stroke-width': 3 }, e);
  poly(e, [[-4, -15], [-4, -40], [-12, -46]], { w: 3.2, color: cl });
  poly(e, [[-4, -24], [20, -24], [24, -12]], { w: 3.2, color: cl });
  svgEl('circle', { cx: 4, cy: -62, r: 7, fill: cl }, e);
  poly(e, [[2, -54], [4, -32], [18, -30], [20, -16]], { w: 4.5, color: cl });
  return e;
}
const ramp = {
  title: 'The Airdrie ramp: which ratio, and multiply or divide?',
  height: 400, minW: 960,
  choices: [{ v: 'a', label: 'Example 4(a) check: ramp length' }, { v: 'b', label: 'Example 4(b) check: space needed' }, { v: 'oops', label: 'The × mistake' }],
  ask: (k) => (k === 'b' ? 'Example 4(b): the door is 0.6 m up and the ramp rises at 4.8°. How much horizontal space does it need?' : k === 'oops' ? 'Kim found the ramp length with 0.6 × sin 4.8°. Does her answer make sense?' : 'Example 4(a): the door is 0.6 m up and the ramp rises at 4.8°. How long must the ramp be?'),
  make(stage, k, ex) {
    const W = ex.W, svg = root(stage, W, 400), R = rampScene(svg, { W, gy: 360, xd: W - 130, u: 100, vx: 2.5, top: 50, dh: 130, size: 21 });
    Geo.text(svg, W - 140 - 0, 30, '(not to scale)', { size: 15, color: COL.gray, halo: false, anchor: 'end' });
    const oppL = line(svg, R.C, R.B, { w: 7, color: OPP, op: 0 }), adjL = line(svg, R.A, R.C, { w: 7, color: ADJ, op: 0 });
    const lOpp = hide(lab(svg, [R.C[0] - 40, (R.B[1] + R.C[1]) / 2 + 10], '0.6 m', { size: 20, color: OPP }));
    const tOpp = hide(lab(svg, [R.C[0] - 40, (R.B[1] + R.C[1]) / 2 + 34], 'opp', { size: 16, color: OPP, weight: 800 }));
    const hm = mid(R.A, R.B), tHyp = hide(lab(svg, [hm[0] - 6, hm[1] - 26], 'hyp: the ramp', { size: 17, color: HYP, weight: 800 }));
    const tAdj = hide(lab(svg, [mid(R.A, R.C)[0], R.C[1] + 28], 'adj: the run', { size: 17, color: ADJ, weight: 800 }));
    const steps = [{ cap: 'The door is <b>0.6 m</b> up. The ramp rises at <b>4.8°</b>.', run: async (c) => { oppL.setAttribute('opacity', 1); await drawIn(oppL, 500, c); await pop(c, lOpp); await pulse(c, R.lA, 1.3); } }];
    const X = 16, PW = 470;
    if (k === 'a') {
      const L = 0.6 / sinD(4.8);
      const p1 = pane(stage, X, 8, PW, `No adj → <b>SOH</b>: ${T('\\sin4.8^\\circ=\\dfrac{0.6}{x}')}`, 'eq');
      const p2 = pane(stage, X, 76, PW, `${T(`x=\\dfrac{0.6}{\\sin4.8^\\circ}=${dots(L)}`)}`, 'eq');
      const p3 = pane(stage, X, 146, PW, 'The ramp is about <b>7.2 m</b> long.', 'res');
      const dm = dim(svg, R.A, R.B, '7.2 m', { off: 44, lo: 16, color: HYP, size: 20, weight: 800 });
      const wc = wheelchair(svg); wc.setAttribute('opacity', 0);
      const ang = Geo.dirTo(R.A, R.B), place = (t) => { const P = lerp([R.A[0] + 30, R.A[1]], R.B, t); wc.setAttribute('transform', `translate(${P2(P)}) rotate(${(-ang).toFixed(2)})`); };
      steps.push({ cap: 'From 4.8°: 0.6 m is <b>opp</b>, the ramp is the <b>hyp</b>. No adj → <b>SOH</b>.', run: async (c) => { await pop(c, tOpp); R.hyp.setAttribute('stroke', HYP); await pop(c, tHyp); await show(c, p1); } });
      steps.push({ cap: 'The unknown is on the <b>bottom</b>, so <b>divide</b>: 0.6 ÷ sin 4.8°.', run: (c) => show(c, p2) });
      steps.push({ cap: 'About <b>7.2 m</b>: longer than the run, as a hypotenuse must be ✓', run: async (c) => { await show(c, p3); await showA(c, dm); } });
      steps.push({ cap: 'Roll on up!', run: async (c) => { place(0); wc.setAttribute('opacity', 1); await tween(c, 2200, (t) => place(t * 0.93)); } });
    } else if (k === 'b') {
      const Y = 0.6 / tanD(4.8);
      const p1 = pane(stage, X, 8, PW, `No hyp → <b>TOA</b>: ${T('\\tan4.8^\\circ=\\dfrac{0.6}{y}')}`, 'eq');
      const p2 = pane(stage, X, 76, PW, `${T(`y=\\dfrac{0.6}{\\tan4.8^\\circ}=${dots(Y)}`)}`, 'eq');
      const p3 = pane(stage, X, 146, PW, `About <b>7.1 m</b> of sidewalk. Check: ${T('0.6\\times12=7.2')} m ✓`, 'chk');
      steps.push({ cap: 'From 4.8°: 0.6 m is <b>opp</b>, the run along the ground is <b>adj</b>. No hyp → <b>TOA</b>.', run: async (c) => { await pop(c, tOpp); adjL.setAttribute('opacity', 1); await drawIn(adjL, 600, c); await pop(c, tAdj); await show(c, p1); } });
      steps.push({ cap: 'The unknown is on the <b>bottom</b> again: <b>divide</b>, 0.6 ÷ tan 4.8°.', run: (c) => show(c, p2) });
      steps.push({ cap: 'About <b>7.1 m</b>. Check: 1 m up for every 12 m along gives 7.2 m: very close ✓', run: (c) => show(c, p3) });
    } else {
      const p1 = pane(stage, X, 8, PW, `Kim: ${T('0.6\\times\\sin4.8^\\circ=0.050\\ldots')} m`, 'bad');
      const p2 = pane(stage, X, 66, PW, 'A ramp only <b>5 cm</b> long can’t climb <b>60 cm</b>! The hyp must be the <b>longest</b> side.', 'bad');
      const p3 = pane(stage, X, 150, PW, `Fix: <i>x</i> is on the bottom, so divide. ${T('x=0.6\\div\\sin4.8^\\circ\\approx7.2')} m ✓`, 'chk');
      const tiny = line(svg, [R.C[0] - 5, R.C[1]], [R.C[0], R.C[1] - 1], { w: 6, color: COL.red, op: 0 });
      const tl = hide(lab(svg, [R.C[0] - 70, R.C[1] - 26], '5 cm ramp?', { size: 18, color: COL.red, weight: 800 }));
      R.hyp.setAttribute('opacity', 0.15); R.fill.setAttribute('opacity', 0.2);
      const st1 = kStamp(stage, '✗ too short', false, W - 340, 150), st2 = kStamp(stage, '7.2 m ✓', true, W - 380, 240);
      steps.push({ cap: `Kim multiplied: ${T('0.6\\times\\sin4.8^\\circ=0.05')} m. That is <b>5 cm</b>.`, run: async (c) => { await show(c, p1); tiny.setAttribute('opacity', 1); await pop(c, tl); } });
      steps.push({ cap: 'A ramp only 5 cm long can’t climb 60 cm. The hypotenuse must be the <b>longest</b> side.', run: async (c) => { await show(c, p2); await sIn(c, st1); } });
      steps.push({ cap: 'Unknown on the <b>bottom</b>: <b>divide</b>. The real ramp is about 7.2 m ✓', run: async (c) => { R.hyp.setAttribute('opacity', 1); R.fill.setAttribute('opacity', 1); await drawIn(R.hyp, 700, c); await show(c, p3); await sIn(c, st2); } });
    }
    return steps;
  }
};

const ladder = {
  title: 'The painter’s ladder: angle, safety, height',
  height: 420, minW: 960,
  choices: [{ v: 'a', label: 'Example 5(a) check: the angle' }, { v: 'b', label: 'Example 5(b) check: the height' }],
  ask: (k) => (k === 'a' ? 'Example 5(a): a 24 ft ladder, its foot 6 ft from the wall. What angle does it make with the ground? Is it safe (about 75°)?' : 'Example 5(b): a 24 ft ladder, its foot 6 ft from the wall. How high up the wall does it reach?'),
  make(stage, k, ex) {
    const W = ex.W, svg = root(stage, 470, 420), L = ladderScene(svg, { wx: 160, gy: 380, u: 15, wallW: 60, gx: 120, size: 21 });
    const hypL = line(svg, L.F, L.Tp, { w: 9, color: HYP, op: 0 }), adjL = line(svg, L.C, L.F, { w: 8, color: ADJ, op: 0 }), oppL = line(svg, L.C, L.Tp, { w: 8, color: OPP, op: 0 });
    const l6 = lab(svg, [mid(L.C, L.F)[0], L.gy + 22], '6 ft', { size: 20 }), m = Geo.at(mid(L.F, L.Tp), L.d - 90, 34), l24 = lab(svg, m, '24 ft', { size: 20 });
    const lT = lab(svg, Geo.at(L.F, (L.d + 180) / 2, 60), 'θ', { size: 22, color: COL.amber, italic: true });
    const lH = lab(svg, [L.C[0] - 32, (L.C[1] + L.Tp[1]) / 2], 'h', { size: 22, color: OPP, italic: true });
    const X = 490, PW = W - X - 6, steps = [];
    if (k === 'a') {
      const th = acosD(0.25);
      const p1 = pane(stage, X, 6, PW, `No opp → <b>CAH</b>: ${T('\\cos\\theta=\\dfrac{6}{24}=0.25')}`, 'eq');
      const p2 = pane(stage, X, 74, PW, `${T(`\\theta=\\cos^{-1}(0.25)=${dots(th)}\\approx76^\\circ`)}`, 'res');
      // the safety gauge: a quarter dial 0–90° (the needle leans like the ladder), green band 70–80°
      const gs = root(stage, 340, 210, X + (PW - 340) / 2, 140), G = [60, 186], R0 = 150;
      svgEl('path', { d: `M${P2(G)}L${P2(Geo.at(G, 0, R0))}A${R0} ${R0} 0 0 0 ${P2(Geo.at(G, 90, R0))}Z`, fill: '#f7f2e8', stroke: COL.slate, 'stroke-width': 2 }, gs);
      svgEl('path', { d: `M${P2(G)}L${P2(Geo.at(G, 70, R0))}A${R0} ${R0} 0 0 0 ${P2(Geo.at(G, 80, R0))}Z`, fill: '#bfe3cc' }, gs);
      for (let a = 0; a <= 90; a += 15) { line(gs, Geo.at(G, a, R0 - 10), Geo.at(G, a, R0), { w: 2, color: COL.slate }); Geo.text(gs, ...Geo.at(G, a, R0 + 17), a + '°', { size: 14, color: COL.slate }); }
      Geo.text(gs, ...Geo.at(G, 75, R0 - 52), 'safe', { size: 16, color: COL.green, weight: 800 });
      const nd = grp(gs); line(nd, G, [G[0] + R0 - 16, G[1]], { w: 5, color: COL.amber }); svgEl('circle', { cx: G[0], cy: G[1], r: 7, fill: COL.amber }, nd);
      nd.style.transformBox = 'view-box'; nd.style.transformOrigin = '0 0';
      const setN = (deg) => nd.setAttribute('transform', `rotate(${(-deg).toFixed(2)} ${G[0]} ${G[1]})`); setN(0);
      Geo.text(gs, G[0] + R0 / 2 + 10, G[1] + 16, 'ladder angle', { size: 14, color: COL.slate, halo: false });
      const st = kStamp(stage, 'Safe ✓', true, X + PW - 80, 370);
      steps.push({ cap: 'At the ground: the 6 ft gap is <b>adj</b> to θ, and the 24 ft ladder is the <b>hyp</b>.', run: async (c) => { adjL.setAttribute('opacity', 0.7); await drawIn(adjL, 500, c); hypL.setAttribute('opacity', 0.45); await drawIn(hypL, 600, c); await pulse(c, lT, 1.4); } });
      steps.push({ cap: `No opp → <b>CAH</b>: ${T('\\cos\\theta=\\frac{6}{24}=0.25')}.`, run: (c) => show(c, p1) });
      steps.push({ cap: `<b>2nd cos</b> 0.25: ${T('\\theta=75.522\\ldots\\approx76^\\circ')}.`, run: async (c) => { await show(c, p2); await relabel(c, lT, '76°', COL.amber); } });
      steps.push({ cap: 'Safety check: about 75° is safest. 76° is close, so the ladder is <b>safe</b> ✓', run: async (c) => { await tween(c, 1200, (t) => setN(th * t)); await sIn(c, st); } });
    } else {
      const H = Math.sqrt(540);
      const p1 = pane(stage, X, 6, PW, `Two sides known → <b>Pythagoras</b>. <i>h</i> is a leg: <b>subtract</b>.`, 'kw');
      const p2 = pane(stage, X, 78, PW, `${T('h^2=24^2-6^2=576-36=540')}`, 'eq');
      const p3 = pane(stage, X, 136, PW, `${T(`h=\\sqrt{540}=${dots(H)}\\approx23.2`)} ft`, 'res');
      const p4 = pane(stage, X, 194, PW, 'Check: <i>h</i> is a bit shorter than the 24 ft ladder (the hyp) ✓', 'chk');
      const roller = grp(svg); svgEl('rect', { x: -9, y: -6, width: 18, height: 12, rx: 3, fill: '#f2c14e', stroke: COL.woodD, 'stroke-width': 2 }, roller); roller.setAttribute('opacity', 0);
      const place = (t) => { const P = lerp([L.C[0] - 22, L.C[1] - 14], [L.Tp[0] - 22, L.Tp[1] + 8], t); roller.setAttribute('transform', `translate(${P2(P)})`); };
      steps.push({ cap: 'We want the height <i>h</i>. We know <b>two sides</b>: the 24 ft ladder and the 6 ft gap.', run: async (c) => { oppL.setAttribute('opacity', 0.75); await drawIn(oppL, 600, c); await pulse(c, lH, 1.4); await show(c, p1); } });
      steps.push({ cap: `The ladder is the hyp, so ${T('h^2=24^2-6^2=540')}.`, run: (c) => show(c, p2) });
      steps.push({ cap: `${T('h=\\sqrt{540}\\approx23.2')} ft. Only the <b>given</b> numbers were used.`, run: async (c) => { await show(c, p3); await relabel(c, lH, '23.2 ft', OPP); place(0); roller.setAttribute('opacity', 1); await tween(c, 1400, place); } });
      steps.push({ cap: 'Check: a leg is shorter than the hypotenuse: 23.2 ft < 24 ft ✓', run: (c) => show(c, p4) });
    }
    void l6; void l24;
    return steps;
  }
};

/* =====================================================================================
 * 4. Two triangles: the drone (Example 6) and the garage roof (Example 7, Full notes)
 * ===================================================================================== */
const drone = {
  title: 'Two triangles, one shared side',
  height: 450, minW: 980,
  ask: 'Example 6: a drone hovers 45 m up. Ava sees it at 34°, Ben at 52°, on opposite sides. How far apart are they?',
  make(stage, v, ex) {
    const W = ex.W, svg = root(stage, W, 450), u = 6.3, x0 = (W - 101.87 * u) / 2 - 30, D = droneScene(svg, { W, x0, gy: 372, u, size: 20, gh: 78, nameDy: 22, spin: true });
    const xv = D.x, yv = D.y, tot = xv + yv, ap = 46;
    [D.gA, D.gB].forEach((e) => { e.style.transformBox = 'view-box'; e.style.transformOrigin = '0 0'; });
    const shift = (t) => { D.gA.setAttribute('transform', `translate(${(-ap * t).toFixed(1)} 0)`); D.gB.setAttribute('transform', `translate(${(ap * t).toFixed(1)} 0)`); };
    const hL = lab(svg, [D.Dr[0] + 30, (D.Dr[1] + D.D[1]) / 2], '45 m', { size: 20 });
    const share = line(svg, D.D, D.Dr, { w: 10, color: COL.amber, op: 0 });
    const hA = hide(lab(D.gA, [D.D[0] - 34, (D.Dr[1] + D.D[1]) / 2 + 26], 'opp', { size: 16, color: OPP, weight: 800 }));
    const hB = hide(lab(D.gB, [D.D[0] + 34, (D.Dr[1] + D.D[1]) / 2 + 26], 'opp', { size: 16, color: OPP, weight: 800 }));
    const xL = hide(lab(D.gA, [mid(D.A, D.D)[0], D.gy + 24], `x = ${(Math.floor(xv * 1000) / 1000).toFixed(3)}… m`, { size: 19, color: ADJ, weight: 700 }));
    const yL = hide(lab(D.gB, [mid(D.D, D.B)[0], D.gy + 24], `y = ${(Math.floor(yv * 1000) / 1000).toFixed(3)}… m`, { size: 19, color: ADJ, weight: 700 }));
    const tDim = dim(svg, [D.A[0], D.gy + 50], [D.B[0], D.gy + 50], `${f1(tot)} m apart`, { off: 0, lo: -15, size: 20, color: COL.brand, weight: 800 });
    const pA = pane(stage, 8, 8, 330, `<b>Ava:</b> no hyp → TOA<br>${T(`x=\\dfrac{45}{\\tan34^\\circ}=${dots(xv)}`)}`, 'eq');
    const pB = pane(stage, W - 300, 8, 292, `<b>Ben:</b> no hyp → TOA<br>${T(`y=\\dfrac{45}{\\tan52^\\circ}=${dots(yv)}`)}`, 'eq');
    const pT = pane(stage, 8, 138, 330, `${T(`${dots(xv)}+${dots(yv)}`)}<br>${T(`=${dots(tot)}\\approx101.9`)} m`, 'res');
    const st = kStamp(stage, 'Ben is closer ✓', true, W - 150, 150, -5);
    return [
      { cap: 'Two lines of sight make <b>two right triangles</b>.', run: async (c) => { await pulse(c, D.lA, 1.3); await pulse(c, D.lB, 1.3); } },
      { cap: 'They <b>share</b> the 45 m height. Each triangle knows the height and an angle.', run: async (c) => { share.setAttribute('opacity', 0.5); await drawIn(share, 600, c); await pulse(c, hL, 1.3); } },
      { cap: 'Pull them apart: two separate triangles.', run: async (c) => { share.setAttribute('opacity', 0); hL.setAttribute('opacity', 0); await tween(c, 900, shift); } },
      { cap: 'Ava’s triangle: 45 m is <b>opp</b>, <i>x</i> is <b>adj</b>. No hyp → <b>TOA</b>. Divide.', run: async (c) => { await pop(c, hA); await show(c, pA); await pop(c, xL); } },
      { cap: 'Ben’s triangle: the same idea with 52°.', run: async (c) => { await pop(c, hB); await show(c, pB); await pop(c, yL); } },
      { cap: `Push them back together and <b>add</b>: about <b>${f1(tot)} m</b>.`, run: async (c) => { await tween(c, 900, (t) => shift(1 - t)); hL.style.opacity = ''; hL.setAttribute('opacity', 1); await show(c, pT); await showA(c, tDim); } },
      { cap: 'Check: Ben’s angle is steeper, so he should be closer: 35.2 m < 66.7 m ✓', run: (c) => sIn(c, st) }
    ];
  }
};

const garage = {
  title: 'The garage roof: two equal right triangles',
  height: 420, minW: 960,
  choices: [{ v: 'all', label: 'Example 7 check' }],
  ask: 'Example 7: the garage is 7.2 m wide with 2.7 m walls. Each side of the roof rises at 24°. Find the rise, the rafter and the total height.',
  make(stage, v, ex) {
    const W = ex.W, svg = root(stage, W, 420), G = garageScene(svg, { x0: 64, gy: 390, u: 46, size: 19 });
    lab(svg, [G.x0 + G.w / 2, G.gy + 18], '7.2 m', { size: 18 }); lab(svg, [G.x0 - 32, (G.wt + G.gy) / 2], '2.7 m', { size: 18 });
    G.dash.setAttribute('opacity', 0); G.rm.setAttribute('opacity', 0);
    const half = poly(svg, [G.L, G.M, G.Pk], { close: true, color: COL.amber, w: 3, fill: '#f9e7c4', fo: 0.9, op: 0 }); svg.appendChild(G.aL);
    // the big copy of the left half, on the right
    const S = 1.75, B0 = [W - 3.6 * G.u * 1.75 - 120, 376], bL = B0, bM = [B0[0] + 3.6 * G.u * S, B0[1]], bP = [bM[0], B0[1] - G.rise * S];
    const big = grp(svg); big.setAttribute('opacity', 0);
    poly(big, [bL, bM, bP], { close: true, color: COL.ink, w: 3, fill: '#f9e7c4' }); rightMk(big, bM, 180, 90, 14); arc(big, bL, 60, 0, 24);
    Geo.text(big, ...Geo.at(bL, 11, 92), '24°', { size: 20, color: COL.amber });
    const bAdj = line(big, bL, bM, { w: 6, color: ADJ }), bOpp = line(big, bM, bP, { w: 6, color: OPP }), bHyp = line(big, bL, bP, { w: 6, color: HYP });
    Geo.text(big, mid(bL, bM)[0], bL[1] + 22, '3.6 m (adj)', { size: 18, color: ADJ, weight: 700 });
    const rT = lab(big, [bM[0] + 44, mid(bM, bP)[1]], 'r (opp)', { size: 18, color: OPP, weight: 700 }), RT = lab(big, Geo.at(mid(bL, bP), 114, 26), 'R (hyp)', { size: 18, color: HYP, weight: 700 });
    void bAdj; void bOpp; void bHyp;
    const ghost = poly(svg, [G.L, G.M, G.Pk], { close: true, color: COL.amber, w: 3, fill: '#f9e7c4', op: 0 });
    const r = 3.6 * tanD(24), R = 3.6 / cosD(24), X = 440, PW = W - X - 6, col = column(stage, X, 4, PW);
    const p1 = cp(col, `(a) TOA &nbsp;${T(`r=3.6\\tan24^\\circ=${dots(r)}\\approx1.6`)} m`, 'eq');
    const p2 = cp(col, `(b) CAH &nbsp;${T(`R=\\dfrac{3.6}{\\cos24^\\circ}=${dots(R)}\\approx3.9`)} m`, 'eq');
    const p3 = cp(col, `(c) ${T(`2.7+${dots(r)}=${dots(2.7 + r)}\\approx4.3`)} m`, 'res');
    const tdim = dim(svg, [G.x0 + G.w + 22, G.gy], [G.x0 + G.w + 22, G.Pk[1]], '4.3 m', { off: 0, lo: -32, color: COL.brand, size: 19, weight: 800 });
    return [
      { cap: 'A dashed line from the peak straight down cuts the roof into <b>two equal right triangles</b>.', run: async (c) => { G.dash.setAttribute('opacity', 1); await drawIn(G.dash, 500, c); G.rm.setAttribute('opacity', 1); half.setAttribute('opacity', 1); await appear(c, half, 300); } },
      { cap: `Each one has half the width: ${T('7.2\\div2=3.6')} m, and the 24° angle.`, run: async (c) => {
        ghost.setAttribute('opacity', 1);
        await tween(c, 1000, (t) => { const k = (P, Q) => lerp(P, Q, t); ghost.setAttribute('d', 'M' + [k(G.L, bL), k(G.M, bM), k(G.Pk, bP)].map(P2).join('L') + 'Z'); });
        ghost.setAttribute('opacity', 0); big.setAttribute('opacity', 1); await appear(c, big, 300);
      } },
      { cap: '(a) The rise <i>r</i> is <b>opp</b>, 3.6 m is <b>adj</b>. No hyp → <b>TOA</b>, multiply.', run: async (c) => { await pulse(c, rT, 1.3); await show(c, p1); } },
      { cap: '(b) The rafter <i>R</i> is the <b>hyp</b>. Use the given 3.6 m: no opp → <b>CAH</b>, divide.', run: async (c) => { await pulse(c, RT, 1.3); await show(c, p2); } },
      { cap: `(c) Total height = wall + rise: about <b>4.3 m</b>.`, run: async (c) => { await show(c, p3); await showA(c, tdim); } }
    ];
  }
};

/* =====================================================================================
 * 5. Is it reasonable? (Example 8) and why the checks work (Full notes)
 * ===================================================================================== */
const sense = {
  title: 'Is it reasonable? Check before you trust it',
  height: 410, minW: 960,
  choices: [{ v: 'a', label: '(a) Jordan' }, { v: 'b', label: '(b) Priya' }, { v: 'c', label: '(c) Leo' }, { v: 'd', label: '(d) Sam' }],
  ask: (k) => ({ a: 'Example 8(a): the legs are 9 m and 4 m. Jordan says the hypotenuse is 8.5 m.', b: 'Example 8(b): opp = 8 cm, hyp = 12 cm. Priya pressed 2nd sin 12 ÷ 8 ) ENTER and got an ERROR.', c: 'Example 8(c): angles of 20° and 70°. Leo says the leg opposite 20° is 15 cm and the leg opposite 70° is 5.5 cm.', d: 'Example 8(d): Sam stands 20 m from a flagpole. The angle of elevation is 35°. He gets 20 tan 35° = 9.5 m.' })[k],
  make(stage, k, ex) {
    const W = ex.W, X = 520, PW = W - X - 6, steps = [];
    const svg = root(stage, 510, 410);
    if (k === 'a') {
      const u = 40, C = [430, 330], A = [C[0] - 9 * u, C[1]], B = [C[0], C[1] - 4 * u];
      poly(svg, [A, C, B], { w: 3 }); rightMk(svg, C, 180, 90, 14);
      lab(svg, [mid(A, C)[0], C[1] + 24], '9 m', { size: 20 }); lab(svg, [C[0] + 30, mid(B, C)[1]], '4 m', { size: 20 });
      const hypT = line(svg, A, B, { w: 4, color: COL.green, op: 0 }), hypTL = hide(lab(svg, Geo.at(mid(A, B), Geo.dirTo(A, B) + 90, 22), '9.8 m ✓', { size: 20, color: COL.green, weight: 800 }));
      const stick = grp(svg); line(stick, [0, 0], [8.5 * u, 0], { w: 7, color: COL.red }); Geo.text(stick, 4.25 * u, -16, '8.5 m', { size: 19, color: COL.red, weight: 800 });
      stick.style.transformBox = 'view-box'; stick.style.transformOrigin = '0 0';
      const setS = (deg) => stick.setAttribute('transform', `translate(${P2(A)}) rotate(${(-deg).toFixed(2)})`); setS(0); stick.setAttribute('opacity', 0);
      const p1 = pane(stage, X, 8, PW, 'Jordan: hypotenuse = <b>8.5 m</b>', 'bad');
      const p2 = pane(stage, X, 66, PW, 'The hyp must be <b>longer than both legs</b>. 8.5 m is shorter than the 9 m leg!', 'kw');
      const p3 = pane(stage, X, 152, PW, `${T('c=\\sqrt{9^2+4^2}=\\sqrt{97}=9.848\\ldots\\approx9.8')} m`, 'res');
      const s1 = kStamp(stage, '✗ too short', false, X + PW / 2, 260), s2 = kStamp(stage, '✓ longest side', true, X + PW / 2, 330);
      steps.push({ cap: 'Jordan says the hypotenuse is 8.5 m. Lay an 8.5 m stick along the hypotenuse…', run: async (c) => { await show(c, p1); stick.setAttribute('opacity', 1); await appear(c, stick, 300); await tween(c, 1100, (t) => setS(Geo.dirTo(A, B) * t)); } });
      steps.push({ cap: 'It doesn’t reach! It is even shorter than the 9 m leg. The hyp must be the <b>longest</b> side.', run: async (c) => { await show(c, p2); await sIn(c, s1); } });
      steps.push({ cap: `Correct: ${T('\\sqrt{97}\\approx9.8')} m, longer than 9 m ✓`, run: async (c) => { await anim(c, stick, [{ opacity: 1 }, { opacity: 0 }], 260); stick.setAttribute('opacity', 0); s1.style.opacity = 0; hypT.setAttribute('opacity', 1); await drawIn(hypT, 600, c); await pop(c, hypTL); await show(c, p3); await sIn(c, s2); } });
    } else if (k === 'b') {
      const x0 = 40, x1 = 470, y = 210, s = (x1 - x0) / 1.6, X_ = (v) => x0 + v * s;
      svgEl('rect', { x: X_(0), y: y - 26, width: X_(1) - X_(0), height: 52, fill: '#e3f2e8', rx: 8 }, svg);
      Geo.text(svg, mid([X_(0), 0], [X_(1), 0])[0], y + 60, 'a sine is always between 0 and 1', { size: 17, color: COL.green, weight: 700, halo: false });
      line(svg, [x0, y], [x1, y], { w: 3 });
      [0, 0.5, 1, 1.5].forEach((v) => { line(svg, [X_(v), y - 9], [X_(v), y + 9], { w: 2 }); Geo.text(svg, X_(v), y + 28, String(v), { size: 18 }); });
      const mk = (v, txt, cl) => { const e = popable(grp(svg)); svgEl('circle', { cx: X_(v), cy: y, r: 10, fill: cl }, e); Geo.text(e, X_(v), y - 46, txt, { size: 19, color: cl, weight: 800 }); return hide(e); };
      const m1 = mk(1.5, '12 ÷ 8 = 1.5', COL.red), m2 = mk(8 / 12, '8 ÷ 12 = 0.667', COL.green);
      const scr = pane(stage, 40, 300, 300, '<span style="font-family:monospace;font-size:26px">sin⁻¹(12/8)<br>ERROR: DOMAIN</span>', 'bad');
      const p1 = pane(stage, X, 8, PW, `${T('\\sin\\theta=\\dfrac{\\text{opp}}{\\text{hyp}}')}: the hyp is on the <b>bottom</b>, and it is the longest side.`, 'kw');
      const p2 = pane(stage, X, 102, PW, 'Priya put the hyp on <b>top</b>: 12 ÷ 8 = 1.5. No sine is more than 1.', 'bad');
      const p3 = pane(stage, X, 186, PW, `${T('\\theta=\\sin^{-1}\\!\\left(\\dfrac{8}{12}\\right)=41.810\\ldots\\approx42^\\circ')}`, 'res');
      const s1 = kStamp(stage, '42° ✓', true, X + PW / 2, 330);
      steps.push({ cap: 'Priya typed 12 ÷ 8 = 1.5. The calculator says <b>ERROR</b>.', run: async (c) => { await pop(c, m1); await show(c, scr); } });
      steps.push({ cap: 'A sine is <b>opp ÷ hyp</b>, and the hyp is the longest side, so a sine is always <b>less than 1</b>.', run: async (c) => { await show(c, p1); await show(c, p2); } });
      steps.push({ cap: `Opp on top: 8 ÷ 12 = 0.667. ${T('\\theta\\approx42^\\circ')} ✓`, run: async (c) => { await pop(c, m2); await show(c, p3); await sIn(c, s1); } });
    } else if (k === 'c') {
      const u = 24, C = [450, 330], A = [C[0] - 15 * u, C[1]], B = [C[0], C[1] - 15 * tanD(20) * u];
      poly(svg, [A, C, B], { w: 3, close: true, fill: '#f3efe6' }); rightMk(svg, C, 180, 90, 13);
      arc(svg, A, 70, 0, 20); lab(svg, Geo.at(A, 10, 98), '20°', { size: 19, color: COL.amber });
      arc(svg, B, 34, 200, 70); lab(svg, Geo.at(B, 235, 58), '70°', { size: 19, color: COL.amber });
      const lb = lab(svg, [mid(A, C)[0], C[1] + 26], '5.5 cm', { size: 20, color: COL.red, weight: 800 }), la = lab(svg, [C[0] + 40, mid(B, C)[1]], '15 cm', { size: 20, color: COL.red, weight: 800 });
      const longL = line(svg, A, C, { w: 9, color: COL.amber, op: 0 });
      const p1 = pane(stage, X, 8, PW, 'Leo: opposite 20° is <b>15 cm</b>, opposite 70° is <b>5.5 cm</b>.', 'bad');
      const p2 = pane(stage, X, 92, PW, 'The <b>bigger angle faces the longer side</b>. The 70° angle faces the long bottom leg, but Leo gave it 5.5 cm.', 'kw');
      const p3 = pane(stage, X, 206, PW, `Swap them. Check: ${T('\\tan20^\\circ=0.364')} and ${T('5.5\\div15=0.367')} ✓`, 'chk');
      const s1 = kStamp(stage, '✗ mixed up', false, 260, 140), s2 = kStamp(stage, '✓ swapped', true, X + PW / 2, 330);
      const pA = [+la.getAttribute('x'), +la.getAttribute('y')], pB = [+lb.getAttribute('x'), +lb.getAttribute('y')];
      steps.push({ cap: 'Leo put 5.5 cm on the long bottom leg and 15 cm on the short one.', run: async (c) => { await show(c, p1); await pulse(c, lb, 1.3); await pulse(c, la, 1.3); } });
      steps.push({ cap: 'The 70° angle is the <b>bigger</b> angle, so it must face the <b>longer</b> leg.', run: async (c) => { longL.setAttribute('opacity', 0.5); await drawIn(longL, 600, c); await show(c, p2); await sIn(c, s1); } });
      steps.push({ cap: 'Swap the labels: opposite 20° is 5.5 cm, opposite 70° is 15 cm ✓', run: async (c) => { s1.style.opacity = 0; await tween(c, 900, (t) => { const q = lerp(pA, pB, t), r = lerp(pB, pA, t); la.setAttribute('x', q[0]); la.setAttribute('y', q[1]); lb.setAttribute('x', r[0]); lb.setAttribute('y', r[1]); }); la.setAttribute('fill', COL.green); lb.setAttribute('fill', COL.green); await show(c, p3); await sIn(c, s2); } });
    } else {
      const u = 15, O = [40, 380], Pb = [O[0] + 20 * u, O[1]], hy = (deg) => 20 * tanD(deg), top = [Pb[0], O[1] - 21 * u];
      line(svg, [10, O[1]], [500, O[1]], { w: 3 }); line(svg, Pb, top, { w: 5, color: COL.slate }); svgEl('path', { d: `M${P2(top)}l34 9l-34 9z`, fill: COL.red }, svg);
      lab(svg, [mid(O, Pb)[0], O[1] + 20], '20 m', { size: 19 }); svgEl('circle', { cx: O[0], cy: O[1] - 4, r: 5, fill: COL.blue }, svg);
      const sight = (deg, cl, dash) => line(svg, O, [Pb[0], O[1] - hy(deg) * u], { w: 2.5, color: cl, dash, op: 0 });
      const mark = (deg, txt, cl) => { const y = O[1] - hy(deg) * u, e = popable(grp(svg)); line(e, [Pb[0] - 10, y], [Pb[0] + 10, y], { w: 4, color: cl }); Geo.text(e, Pb[0] + 18, y, txt, { size: 18, color: cl, anchor: 'start', weight: 700 }); return hide(e); };
      const s30 = sight(30, COL.gray, '7 5'), s45 = sight(45, COL.gray, '7 5'), s35 = sight(35, COL.green);
      const m30 = mark(30, '30°: 11.5 m', COL.slate), m45 = mark(45, '45°: 20 m', COL.slate);
      const ySam = O[1] - 9.476 * u, samE = popable(grp(svg)); line(samE, [Pb[0] - 12, ySam], [Pb[0] + 12, ySam], { w: 5, color: COL.red }); Geo.text(samE, Pb[0] + 18, ySam, 'Sam: 9.5 m ✗', { size: 18, color: COL.red, anchor: 'start', weight: 800 }); hide(samE);
      const m35 = mark(35, '35°: 14.0 m ✓', COL.green);
      const p1 = pane(stage, X, 8, PW, 'Benchmarks: at 30° the height is about 11.5 m; at 45° it equals the 20 m distance.', 'kw');
      const p2 = pane(stage, X, 92, PW, 'So at 35° the height must be <b>between 11.5 m and 20 m</b>. 9.5 m is too small: his calculator was in <b>RAD</b> mode.', 'bad');
      const p3 = pane(stage, X, 206, PW, `DEG mode: ${T('20\\tan35^\\circ=14.004\\ldots\\approx14.0')} m`, 'res');
      const s1 = kStamp(stage, 'DEG ✓', true, X + PW / 2, 330);
      steps.push({ cap: 'Benchmarks first: at <b>30°</b> the height is about 11.5 m, at <b>45°</b> it is 20 m.', run: async (c) => { for (const [s, m] of [[s30, m30], [s45, m45]]) { s.setAttribute('opacity', 1); await drawIn(s, 500, c); await pop(c, m); } await show(c, p1); } });
      steps.push({ cap: 'Sam’s 9.5 m is <b>below</b> the 30° mark. Too small for 35°: his calculator was in <b>RAD</b> mode.', run: async (c) => { await pop(c, samE); await show(c, p2); } });
      steps.push({ cap: `In DEG mode: ${T('20\\tan35^\\circ\\approx14.0')} m, between the benchmarks ✓`, run: async (c) => { s35.setAttribute('opacity', 1); await drawIn(s35, 600, c); await pop(c, m35); await show(c, p3); await sIn(c, s1); } });
    }
    return steps;
  }
};

const benchmarks = {
  title: 'Turn the angle: legs, sine and cosine',
  height: 400, minW: 940,
  ask: 'The hypotenuse stays 10 cm. What happens to the legs, sin θ and cos θ as θ grows?',
  make(stage, v, ex) {
    const W = ex.W, svg = root(stage, 480, 400), A = [40, 360], Lh = 300, k = Lh / 10;
    const fill = poly(svg, [A, A, A], { close: true, color: 'none', fill: '#f3efe6' });
    const adj = line(svg, A, A, { w: 5, color: ADJ }), opp = line(svg, A, A, { w: 5, color: OPP }), hyp = line(svg, A, A, { w: 5, color: HYP });
    const am = arc(svg, A, 50, 0, 10), rm = poly(svg, [A, A, A], { w: 2 }), bm = svgEl('path', { d: '', stroke: COL.purple, 'stroke-width': 2.4, fill: 'none' }, svg);
    const tA = Geo.text(svg, 0, 0, '', { size: 19, color: COL.amber }), tB = Geo.text(svg, 0, 0, '', { size: 18, color: COL.purple });
    const tO = Geo.text(svg, 0, 0, '', { size: 18, color: OPP, anchor: 'start' }), tJ = Geo.text(svg, 0, 0, '', { size: 18, color: ADJ }), tH = Geo.text(svg, 0, 0, '10 cm', { size: 18, color: HYP });
    const X = 500, PW = W - X - 6;
    const read = add(stage, box(h('div', 'u7l9-pn box u7l9-meter', ''), PW), X, 8);
    const bars = root(stage, PW, 120, X, 150), BW = PW - 120;
    const bar = (y, cl, name) => { Geo.text(bars, 4, y + 12, name, { size: 17, color: cl, anchor: 'start', halo: false, weight: 700 }); svgEl('rect', { x: 100, y, width: BW, height: 24, rx: 5, fill: '#eee8dc' }, bars); return svgEl('rect', { x: 100, y, width: 0, height: 24, rx: 5, fill: cl }, bars); };
    const bS = bar(10, OPP, 'sin θ'), bC = bar(56, ADJ, 'cos θ'); Geo.text(bars, 100 + BW, 104, '1', { size: 16, color: COL.slate, halo: false }); line(bars, [100 + BW, 4], [100 + BW, 88], { w: 2, color: COL.slate, dash: '4 3' });
    const note = pane(stage, X, 290, PW, '', 'chk');
    let cur = 15;
    const draw = (th) => {
      cur = th; const B = Geo.at(A, th, Lh), C = [B[0], A[1]], s = sinD(th), cc = cosD(th);
      fill.setAttribute('d', `M${P2(A)}L${P2(C)}L${P2(B)}Z`); adj.setAttribute('d', `M${P2(A)}L${P2(C)}`); opp.setAttribute('d', `M${P2(C)}L${P2(B)}`); hyp.setAttribute('d', `M${P2(A)}L${P2(B)}`);
      am.setAttribute('d', Geo.arcD(A, 46, 0, th)); rm.setAttribute('d', 'M' + [[C[0] - 13, C[1]], [C[0] - 13, C[1] - 13], [C[0], C[1] - 13]].map(P2).join('L'));
      bm.setAttribute('d', Geo.arcD(B, 34, 180 + th, 90 - th));
      const pa = Geo.at(A, th / 2, 72); tA.setAttribute('x', pa[0]); tA.setAttribute('y', pa[1]); tA.textContent = Math.round(th) + '°';
      const pb = Geo.at(B, 180 + th + (90 - th) / 2, 58); tB.setAttribute('x', pb[0]); tB.setAttribute('y', pb[1]); tB.textContent = Math.round(90 - th) + '°';
      tO.setAttribute('x', C[0] + 10); tO.setAttribute('y', (B[1] + C[1]) / 2); tO.textContent = (10 * s).toFixed(1) + ' cm';
      tJ.setAttribute('x', (A[0] + C[0]) / 2); tJ.setAttribute('y', A[1] + 22); tJ.textContent = (10 * cc).toFixed(1) + ' cm';
      const hm = Geo.at(mid(A, B), th + 90, 22); tH.setAttribute('x', hm[0]); tH.setAttribute('y', hm[1]);
      read.innerHTML = `θ = <b>${Math.round(th)}°</b> &nbsp; other angle = ${Math.round(90 - th)}°<br><span class="u7l9-opp">opp ${(10 * s).toFixed(1)}</span> · <span class="u7l9-adj">adj ${(10 * cc).toFixed(1)}</span> · <span class="u7l9-hyp">hyp 10</span><br>sin θ = ${s.toFixed(2)} &nbsp; cos θ = ${cc.toFixed(2)}`;
      bS.setAttribute('width', (BW * s).toFixed(1)); bC.setAttribute('width', (BW * cc).toFixed(1));
    };
    draw(15); void k;
    const go = (to, ms = 1100) => async (c) => { const a = cur; await tween(c, ms, (t) => draw(a + (to - a) * t)); };
    const say = async (c, html) => { note.innerHTML = html; await show(c, note, 250); };
    return [
      { cap: 'At <b>30°</b> the opposite side is <b>half</b> the hypotenuse: 5 of 10. sin 30° = 0.5.', run: async (c) => { await go(30)(c); await say(c, '30°: opp = 5.0 = half the hyp'); } },
      { cap: 'At <b>45°</b> the two legs are <b>equal</b>.', run: async (c) => { await go(45)(c); await say(c, '45°: opp = adj = 7.1'); } },
      { cap: 'Past 45°, the opposite leg is the longer leg: the <b>bigger angle faces the longer side</b>.', run: async (c) => { await go(65)(c); await say(c, '65° faces the longer leg (9.1)'); } },
      { cap: 'Even at 80°, a leg is shorter than the hyp, so sin θ and cos θ stay <b>less than 1</b>.', run: async (c) => { await go(80)(c); await say(c, 'sin 80° = 0.98: still less than 1'); } },
      { cap: 'And the two acute angles always add to <b>90°</b>.', run: async (c) => { await go(38, 900)(c); await say(c, '38° + 52° = 90°'); } }
    ];
  }
};

mountExplainers({ chooser, quick, solveAll, ramp, ladder, drone, garage, sense, benchmarks });

/* =====================================================================================
 * Stand Up Break! — choose the tool and solve, at the whiteboards
 * ===================================================================================== */
{
  const fig = (build, w = 320, hh = 230) => { const s = svgEl('svg', { viewBox: `0 0 ${w} ${hh}`, width: Math.round(w * 1.3), height: Math.round(hh * 1.3), class: 'u7l9-sufig' }); build(s); return s.outerHTML; };
  const triFig = (o) => fig((s) => Geo.rightTri(s, Object.assign({ width: 320, height: 230, names: false, size: 19, pad: 44 }, o)));
  const ROLES = ['opp', 'adj', 'hyp'], SIDE = { opp: 'a', adj: 'b', hyp: 'c' }, UNITS = ['m', 'cm', 'ft'];
  const FN = { SOH: ['sin', 'opp', 'hyp', sinD], CAH: ['cos', 'adj', 'hyp', cosD], TOA: ['tan', 'opp', 'adj', tanD] };
  const ratioFor = (g, w) => RATIO_OF[ROLES.find((r) => r !== g && r !== w)];
  /** find side w from angle th and side g (value gv): the steps as TeX */
  const solveSide = (th, g, gv, w) => {
    const [fn, top, bot, f] = FN[ratioFor(g, w)], wTop = w === top, val = wTop ? gv * f(th) : gv / f(th);
    return { val, lines: [`\\${fn}${th}^\\circ=${wTop ? `\\dfrac{x}{${gv}}` : `\\dfrac{${gv}}{x}`}`, wTop ? `x=${gv}\\${fn}${th}^\\circ=${dots(val)}` : `x=\\dfrac{${gv}}{\\${fn}${th}^\\circ}=${dots(val)}`, `x\\approx${f1(val)}`], fn, bot };
  };
  standup('u7l9', {
    intro: 'Sketch, label from θ, choose the tool, solve, check. Round sides to the nearest tenth and angles to the nearest degree.',
    levels: {
      BEG: (r) => {
        const th = r.int(22, 68), [g, w] = r.shuffle(ROLES).slice(0, 2), gv = r.int(6, 30), un = r.pick(UNITS), S = solveSide(th, g, gv, w);
        const sides = { [SIDE[g]]: `${gv} ${un}`, [SIDE[w]]: 'x' }, sd = { A: th, [SIDE[g]]: gv };
        return { text: `Name the tool, write the equation and find <i>x</i>.`, q: '', fig: triFig(Object.assign(sd, { sides, angles: { A: th + '°' } })), a: [`\\text{${ratioFor(g, w)}}`, ...S.lines.slice(0, 2), `${S.lines[2]}\\text{ ${un}}`] };
      },
      PRG: (r) => {
        if (r.chance(0.5)) {
          const th = r.int(25, 65), g = r.pick(ROLES), gv = r.int(8, 40), un = r.pick(UNITS), others = ROLES.filter((x) => x !== g);
          const sides = { [SIDE[g]]: `${gv} ${un}` }; others.forEach((x) => { sides[SIDE[x]] = SIDE[x]; });
          const lines = [`\\angle B=90^\\circ-${th}^\\circ=${90 - th}^\\circ`];
          others.forEach((x) => { const S = solveSide(th, g, gv, x); lines.push(`${SIDE[x]}${S.lines[1].slice(1).replace(/=[\d.]+\\ldots$/, '')}\\approx${f1(S.val)}\\text{ ${un}}`); });
          return { text: `Solve ${T('\\triangle ABC')}: find ${T('\\angle B')} and the two missing sides.`, q: '', fig: triFig({ A: th, [SIDE[g]]: gv, names: ['A', 'B', 'C'], sides, angles: { A: th + '°' } }), a: lines };
        }
        const legs = r.chance(0.5), un = r.pick(UNITS);
        if (legs) { const a = r.int(5, 20), b = r.int(5, 20), c = Math.hypot(a, b), A = atanD(a / b);
          return { text: `Solve ${T('\\triangle ABC')}: find <i>c</i>, ${T('\\angle A')} and ${T('\\angle B')}.`, q: '', fig: triFig({ a, b, names: ['A', 'B', 'C'], sides: { a: `${a} ${un}`, b: `${b} ${un}`, c: 'c' } }),
            a: [`c=\\sqrt{${a}^2+${b}^2}=${dots(c)}\\approx${f1(c)}\\text{ ${un}}`, `\\angle A=\\tan^{-1}\\!\\left(\\tfrac{${a}}{${b}}\\right)=${dots(A)}\\approx${Math.round(A)}^\\circ`, `\\angle B=90^\\circ-${dots(A)}^\\circ\\approx${Math.round(90 - A)}^\\circ`] }; }
        const c = r.int(12, 30), a = r.int(4, c - 3), b = Math.sqrt(c * c - a * a), A = asinD(a / c);
        return { text: `Solve ${T('\\triangle ABC')}: find <i>b</i>, ${T('\\angle A')} and ${T('\\angle B')}.`, q: '', fig: triFig({ a, c, names: ['A', 'B', 'C'], sides: { a: `${a} ${un}`, c: `${c} ${un}`, b: 'b' } }),
          a: [`b=\\sqrt{${c}^2-${a}^2}=${dots(b)}\\approx${f1(b)}\\text{ ${un}}`, `\\angle A=\\sin^{-1}\\!\\left(\\tfrac{${a}}{${c}}\\right)=${dots(A)}\\approx${Math.round(A)}^\\circ`, `\\angle B=90^\\circ-${dots(A)}^\\circ\\approx${Math.round(90 - A)}^\\circ`] };
      },
      MAS: (r) => r.pick([
        () => { const hgt = r.int(20, 60), a1 = r.int(25, 45), a2 = r.int(48, 70), x = hgt / tanD(a1), y = hgt / tanD(a2);
          const pic = fig((s) => { const u = 220 / (x + y), A = [40, 200], D = [40 + x * u, 200], Bp = [D[0] + y * u, 200], Top = [D[0], 200 - hgt * u * 0.9];
            line(s, [10, 200], [310, 200], { w: 3 }); poly(s, [A, Top, Bp], { w: 2.6 }); line(s, D, Top, { w: 2.4, dash: '7 5', color: COL.slate }); rightMk(s, D, 180, 90, 10);
            svgEl('circle', { cx: Top[0], cy: Top[1] - 8, r: 9, fill: '#f08a5d' }, s); Geo.text(s, Top[0] + 30, (Top[1] + 200) / 2, hgt + ' m', { size: 17 });
            Geo.text(s, A[0] + 46, 188, a1 + '°', { size: 16, color: COL.amber }); Geo.text(s, Bp[0] - 40, 188, a2 + '°', { size: 16, color: COL.amber }); Geo.text(s, A[0], 218, 'Jo', { size: 15 }); Geo.text(s, Bp[0], 218, 'Raj', { size: 15 }); }, 320, 230);
          return { text: `A hot-air balloon is ${hgt} m above a field, between Jo and Raj. Jo sees it at an angle of elevation of ${a1}°, Raj at ${a2}°. How far apart are they?`, q: '', fig: pic,
            a: [`\\text{Jo: }\\dfrac{${hgt}}{\\tan${a1}^\\circ}=${dots(x)}`, `\\text{Raj: }\\dfrac{${hgt}}{\\tan${a2}^\\circ}=${dots(y)}`, `${dots(x)}+${dots(y)}\\approx${f1(x + y)}\\text{ m}`] }; },
        () => { const wd = r.pick([6.4, 8, 8.8, 9.6, 10]), wall = r.pick([2.4, 2.7, 3]), ang = r.int(18, 35), half = wd / 2, rise = half * tanD(ang), raf = half / cosD(ang);
          const pic = fig((s) => { const u = 200 / wd, x0 = 60, gy = 210, wt = gy - wall * u, M = [x0 + wd * u / 2, wt], Pk = [M[0], wt - rise * u];
            svgEl('rect', { x: x0, y: wt, width: wd * u, height: wall * u, fill: '#f3efe6', stroke: COL.ink, 'stroke-width': 2.6 }, s); poly(s, [[x0, wt], Pk, [x0 + wd * u, wt]], { w: 3.4, color: COL.brand });
            line(s, M, Pk, { w: 2, dash: '6 5', color: COL.slate }); Geo.text(s, M[0], gy + 14, wd + ' m wide', { size: 16 }); Geo.text(s, x0 - 26, (wt + gy) / 2, wall + ' m', { size: 16 }); Geo.text(s, x0 + 48, wt - 10, ang + '°', { size: 16, color: COL.amber }); }, 320, 230);
          return { text: `A shed is ${wd} m wide with walls ${wall} m high. Each side of the roof rises at ${ang}° to a peak in the middle. Find the length of each rafter and the height of the peak.`, q: '', fig: pic,
            a: [`\\text{half the width: }${wd}\\div2=${half}`, `\\text{rafter: }\\dfrac{${half}}{\\cos${ang}^\\circ}=${dots(raf)}\\approx${f1(raf)}\\text{ m}`, `\\text{rise: }${half}\\tan${ang}^\\circ=${dots(rise)}`, `\\text{peak: }${wall}+${dots(rise)}\\approx${f1(wall + rise)}\\text{ m}`] }; }
      ])()
    }
  });
}
