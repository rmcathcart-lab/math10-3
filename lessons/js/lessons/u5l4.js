/* Math 10-3 · Unit 5 · Lesson 4 — Estimating Angles with Referents, and True Bearings.
 * Explainers: referents (a sheet of paper folds 90° → 45° → 22.5°, a straight line; a clock's hour marks; Example 1(a)
 * check), building angles from referents (Example 1(b) check), estimating (Example 2 check), which protractor scale
 * (Example 3 check), the ladder rule (Example 4), sketching (Example 5 check), true bearings on a compass rose (Example
 * 6 check), bearings on a map with a protractor on the north line (Examples 7 and 8), the bearing back (Example 9) and,
 * in Full notes, why the bearing back is 180° off.
 * Also the static figures, two hands-on tools (estimate-then-measure protractor, a compass you point) and the Stand Up
 * Break. Uses the Unit 5 geometry toolkit (js/geo.js). */
import { h, add, box, tex, svgEl, tween, stamp, stampIn, liveCtx, mountExplainers, drawIn, arrowHead } from '../blocks.js';
import { Geo } from '../geo.js';
import { standup } from '../standup.js';

const { at, arcD, wedgeD, n360, dirTo } = Geo;
const BT = Geo.bearingText;
const RAD = Math.PI / 180;
const INK = '#1c2230', SLATE = '#3a4254', GREY = '#6a7182', LIGHT = '#9aa0ab', BLUE = '#1f5bd6', RED = '#c93a33',
  GREEN = '#12805a', AMBER = '#c27a0e', PURPLE = '#7b4fc4', BRAND = '#6e4a1c', BRAND2 = '#9a6a24', PENCIL = '#4a4f5c';
const fd = (v) => String(Math.round(v * 10) / 10);           // 22.5 → "22.5"
const dg = (v) => fd(v) + '°';
const B2D = (b) => 90 - b;                                     // true bearing → math direction
const P2 = (p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
const hid = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const show = (c, el, ms = 350) => c.anim(el, [{ opacity: 0 }, { opacity: 1 }], ms);
const dim = (c, el, to = 0.25, ms = 300) => c.anim(el, [{ opacity: to }], ms);
const popable = (el) => { el.style.transformBox = 'fill-box'; el.style.transformOrigin = 'center'; return el; };
const T = (parent, x, y, s, o = {}) => popable(Geo.text(parent, x, y, s, o));
const stageSvg = (stage, W, H) => add(stage, svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u5l4-svg' }), 0, 0);
/** a stroked path that drawIn can draw */
const P = (parent, d, o = {}) => svgEl('path', { d, class: 'bk-stroke', fill: o.fill || 'none', stroke: o.color || INK, 'stroke-width': o.width ?? 3,
  'stroke-linecap': o.cap || 'round', 'stroke-linejoin': 'round', 'stroke-dasharray': o.dash || null, opacity: o.opacity ?? null }, parent);
const seg = (parent, A, B, o) => P(parent, `M${P2(A)}L${P2(B)}`, o);
const wedge = (parent, V, r, start, span, color, op = 0.28) => svgEl('path', { d: wedgeD(V, r, start, span), fill: color, 'fill-opacity': op, stroke: color, 'stroke-width': 1.6 }, parent);
const dotAt = (parent, p, r = 5, color = INK) => popable(svgEl('circle', { cx: p[0], cy: p[1], r, fill: color }, parent));
/** an HTML label centred on (cx, cy) */
const lab = (host, html, cx, cy, w = 90, hh = 34, cls = '') => add(host, box(h('div', 'u5l4-fl ' + cls, html), w, hh), cx - w / 2, cy - hh / 2);
/** a column of answer lines on the right of a stage; the lines are there from the start (opacity 0), so nothing moves */
function panel(stage, x, y, w) {
  const el = add(stage, h('div', 'u5l4-panel'), x, y); el.style.width = w + 'px';
  return { el, line(html, cls = '') { const d = h('div', 'u5l4-pl ' + cls, html); d.style.opacity = 0; el.appendChild(d); return d; } };
}
/** a ghost (dashed) ray with a label at its end */
function ghost(svg, V, dir, len, label, color = GREY, size = 18) {
  const g = svgEl('g', {}, svg);
  seg(g, V, at(V, dir, len), { color, width: 2.4, dash: '9 7' });
  if (label) { const p = at(V, dir, len + 26); T(g, p[0], p[1], label, { size, color }); }
  return hid(g);
}
/** a north line through p (dotted), with an N on top */
function northLine(svg, p, len, o = {}) {
  const g = svgEl('g', {}, svg), top = [p[0], p[1] - len];
  const l = seg(g, p, top, { color: o.color || SLATE, width: o.width || 2.4, dash: o.dash === undefined ? '3 6' : o.dash });
  arrowHead(g, top[0], top[1], 0, -1, { color: o.color || SLATE, width: 2.4 });
  if (o.n !== false) T(g, top[0], top[1] - 16, 'N', { size: o.size || 18, color: RED });
  g.line = l; return g;
}
/** an arc that sweeps from direction start by span (degrees, + = counterclockwise), with a moving arrowhead; set(t) */
function sweepArc(svg, V, r, start, span, color = AMBER, width = 3) {
  const g = svgEl('g', {}, svg), p = svgEl('path', { fill: 'none', stroke: color, 'stroke-width': width, 'stroke-linecap': 'round' }, g);
  const head = svgEl('polygon', { fill: color }, g);
  const set = (t) => {
    const s = span * t;
    p.setAttribute('d', Math.abs(s) > 0.5 ? arcD(V, r, start, s) : '');
    if (Math.abs(s) < 6) { head.setAttribute('points', ''); return; }
    const e = at(V, start + s, r), sg = Math.sign(span), tg = at([0, 0], start + s + sg * 90, 1);
    const u = [tg[0], tg[1]], L = 12, w = 5.5;
    head.setAttribute('points', [e, [e[0] - L * u[0] + w * u[1], e[1] - L * u[1] - w * u[0]], [e[0] - L * u[0] - w * u[1], e[1] - L * u[1] + w * u[0]]].map(P2).join(' '));
  };
  set(0); g.set = set; return g;
}
const sweep = (c, a, ms = 900) => tween(c, ms, (t) => a.set(t));
/** a slightly wobbly pencil line (a sketch, not a ruler line) */
function pencil(svg, A, B, o = {}) {
  const m = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], L = Math.hypot(B[0] - A[0], B[1] - A[1]) || 1, nx = -(B[1] - A[1]) / L, ny = (B[0] - A[0]) / L, k = o.bend ?? 3.5;
  return P(svg, `M${P2(A)}Q${P2([m[0] + nx * k, m[1] + ny * k])} ${P2(B)}`, { color: o.color || PENCIL, width: o.width || 3.6 });
}
const typeOf = (a) => (a < 90 ? 'acute' : a === 90 ? 'right' : a < 180 ? 'obtuse' : a === 180 ? 'straight' : 'reflex');
const typeWhy = (a) => (a < 90 ? 'less than 90°' : a < 180 ? 'between 90° and 180°' : 'more than 180°');
/** place a figure with these points inside a box [x0, y0, x1, y1]: returns the offset to add */
function fitIn(pts, bx, pad = 30) {
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  return [(bx[0] + bx[2]) / 2 - cx, (bx[1] + bx[3]) / 2 - cy];
}

/* ======================================================================================
 * 1. Referents: a folding sheet of paper, a clock, and the Example 1(a) check
 * ====================================================================================== */
const referents = {
  title: 'Referent angles: paper and a clock',
  height: 430,
  minW: 900,
  choices: [{ v: 'fold', label: 'Fold a sheet of paper' }, { v: 'clock', label: 'Hour marks on a clock' }, { sep: 'Example 1(a) check:' },
    ...[1, 2, 3, 4, 6, 8].map((n) => ({ v: n, label: n + ':00' }))],
  ask: (v) => (v === 'fold' ? 'How can a sheet of paper make <b>90°</b>, <b>45°</b>, <b>22.5°</b> and <b>180°</b>?' : v === 'clock' ? 'Why is one hour mark on a clock <b>30°</b>?'
    : `Example 1(a) What is the smaller angle between the hands of a clock at <b>${v}:00</b>?`),
  make(stage, v, ex) { return v === 'fold' ? foldScene(stage, ex) : clockScene(stage, ex, v); }
};
function foldScene(stage, ex) {
  const W = ex.W, H = 430, ox = Math.max(0, (W - 900) / 2), svg = stageSvg(stage, W, H);
  const s = 270, V = [ox + 60, 390], BR = [V[0] + s, V[1]], TR = [V[0] + s, V[1] - s], TL = [V[0], V[1] - s];
  const FRONT = '#fffdf6', BACK = '#f1e2c4', BACK2 = '#e9d5ad', EDGE = BRAND;
  const poly = (pts, fill) => svgEl('polygon', { points: pts.map(P2).join(' '), fill, stroke: EDGE, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, svg);
  const setPts = (el, pts) => el.setAttribute('points', pts.map(P2).join(' '));
  const lower = hid(poly([V, BR, TR], FRONT)), flap1 = hid(poly([V, TL, TR], FRONT));
  const t22 = Math.tan(22.5 * RAD), Pq = [V[0] + s, V[1] - s * t22];
  const flap2 = hid(poly([V, Pq, TR], BACK));
  const sq = poly([V, BR, TR, TL], FRONT); hid(sq);
  const corner = hid(P(svg, `M${P2([V[0], V[1] - 24])}L${P2([V[0] + 24, V[1] - 24])}L${P2([V[0] + 24, V[1]])}`, { color: RED, width: 2.6, cap: 'butt' }));
  const l90 = hid(T(svg, V[0] + 62, V[1] - 52, '90°', { size: 26, color: RED }));
  const M = [(V[0] + TR[0]) / 2, (V[1] + TR[1]) / 2];
  const crease1 = hid(seg(svg, V, TR, { color: EDGE, width: 1.8, dash: '6 5' }));
  const arc45 = hid(P(svg, arcD(V, 78, 0, 45), { color: BLUE, width: 3 })), l45 = hid(T(svg, ...at(V, 33.75, 112), '45°', { size: 24, color: BLUE }));
  const crease2 = hid(seg(svg, V, Pq, { color: EDGE, width: 1.8, dash: '6 5' }));
  const arc22 = hid(P(svg, arcD(V, 150, 0, 22.5), { color: GREEN, width: 3 })), l22 = hid(T(svg, ...at(V, 11.25, 190), '22.5°', { size: 24, color: GREEN }));
  // a straight line from two corners, bottom right
  const Q = [ox + 700, 400], q = 92, gS = hid(svgEl('g', {}, svg));
  svgEl('rect', { x: Q[0] - q, y: Q[1] - q, width: q, height: q, fill: FRONT, stroke: EDGE, 'stroke-width': 2.4 }, gS);
  svgEl('rect', { x: Q[0], y: Q[1] - q, width: q, height: q, fill: FRONT, stroke: EDGE, 'stroke-width': 2.4 }, gS);
  P(gS, `M${P2([Q[0] - 18, Q[1]])}L${P2([Q[0] - 18, Q[1] - 18])}L${P2([Q[0], Q[1] - 18])}L${P2([Q[0] + 18, Q[1] - 18])}L${P2([Q[0] + 18, Q[1]])}`, { color: RED, width: 2.2, cap: 'butt' });
  const line180 = hid(seg(svg, [Q[0] - 175, Q[1]], [Q[0] + 175, Q[1]], { color: INK, width: 4 }));
  const arc180 = hid(P(svg, arcD(Q, 120, 0, 180), { color: PURPLE, width: 3 })), l180 = hid(T(svg, Q[0], Q[1] - 140, '180°', { size: 26, color: PURPLE }));
  const pn = panel(stage, ox + 450, 18, 440);
  const L1 = pn.line('<b>corner of the sheet:</b> 90°', 'u5l4-red'), L2 = pn.line(`<b>fold 1:</b> ${tex('90^\\circ\\div2=45^\\circ')}`, 'u5l4-blue'),
    L3 = pn.line(`<b>fold 2:</b> ${tex('45^\\circ\\div2=22.5^\\circ')}`, 'u5l4-green'), L4 = pn.line(`<b>two corners:</b> ${tex('90^\\circ+90^\\circ=180^\\circ')}`);
  L4.style.borderColor = PURPLE;
  const fold = (el, base, moving, axisA, axisB, front, back) => {
    // each moving point turns about the fold line (seen from above: its distance to the line shrinks, then flips)
    const ax = [axisB[0] - axisA[0], axisB[1] - axisA[1]], al = Math.hypot(...ax), u = [ax[0] / al, ax[1] / al];
    const feet = moving.map((p) => { const k = (p[0] - axisA[0]) * u[0] + (p[1] - axisA[1]) * u[1]; return [axisA[0] + k * u[0], axisA[1] + k * u[1]]; });
    return (t) => {
      const cs = Math.cos(Math.PI * t), mv = moving.map((p, i) => [feet[i][0] + (p[0] - feet[i][0]) * cs, feet[i][1] + (p[1] - feet[i][1]) * cs]);
      setPts(el, base(mv)); el.setAttribute('fill', t < 0.5 ? front : back);
    };
  };
  const f1 = fold(flap1, (m) => [V, m[0], TR], [TL], V, TR, FRONT, BACK);
  const f2 = fold(flap2, (m) => [V, Pq, m[0]], [TR], V, Pq, BACK, BACK2);
  return [
    { cap: 'The <b>corner</b> of a sheet of paper is a <b>right angle: 90°</b>.', run: async (c) => { await c.pop(sq); await show(c, corner); await c.pop(l90); await show(c, L1); } },
    { cap: 'Fold the corner in half. The fold splits 90° into two equal parts: <b>45°</b>.', run: async (c) => {
      sq.style.opacity = 0; lower.style.opacity = 1; flap1.style.opacity = 1; await show(c, crease1, 250);
      await tween(c, 1400, f1); await dim(c, corner, 0); await dim(c, l90, 0);
      await show(c, arc45); await c.pop(l45); await show(c, L2);
    } },
    { cap: 'Fold it in half again. Half of 45° is <b>22.5°</b>.', run: async (c) => {
      setPts(flap1, [V, BR, Pq]); setPts(lower, [V, BR, Pq]); flap2.style.opacity = 1; await show(c, crease2, 250);
      await tween(c, 1400, f2); await dim(c, l45, 0.4); await dim(c, arc45, 0.4);
      await show(c, arc22); await c.pop(l22); await show(c, L3);
    } },
    { cap: 'Two paper corners side by side make a <b>straight line: 180°</b>.', run: async (c) => { await c.pop(gS); await show(c, line180); await show(c, arc180); await c.pop(l180); await show(c, L4); } }
  ];
}
function clockScene(stage, ex, v) {
  const W = ex.W, H = 430, ox = Math.max(0, (W - 900) / 2), svg = stageSvg(stage, W, H);
  const C = [ox + 225, 215], R = 190, hd = (hr) => 90 - 30 * hr;
  svgEl('circle', { cx: C[0], cy: C[1], r: R, fill: '#fff', stroke: INK, 'stroke-width': 5 }, svg);
  const wl = svgEl('g', {}, svg);
  const ticks = [], nums = [];
  for (let i = 1; i <= 12; i++) {
    const g = svgEl('g', {}, svg); seg(g, at(C, hd(i), R - 4), at(C, hd(i), R - 22), { color: INK, width: 4, cap: 'butt' });
    const p = at(C, hd(i), R - 44); T(g, p[0], p[1], String(i), { size: 26, color: INK, weight: 800 });
    popable(g); ticks.push(g); nums.push(p);
  }
  const hourH = svgEl('line', { stroke: INK, 'stroke-width': 9, 'stroke-linecap': 'round' }, svg), minH = svgEl('line', { stroke: SLATE, 'stroke-width': 5, 'stroke-linecap': 'round' }, svg);
  const setHand = (el, d, len) => { const e = at(C, d, len); el.setAttribute('x1', C[0]); el.setAttribute('y1', C[1]); el.setAttribute('x2', e[0].toFixed(1)); el.setAttribute('y2', e[1].toFixed(1)); };
  setHand(minH, 90, R - 40); setHand(hourH, 90, R - 85);
  dotAt(svg, C, 8);
  const wr = R - 66;
  const mark = (i, color, op = 0.3) => { const w = hid(wedge(wl, C, wr, hd(i), 30, color, op)); return w; };
  const cnt = (i, n, color) => { const p = at(C, hd(i) + 15, wr * 0.72); return hid(T(svg, p[0], p[1], String(n), { size: 19, color })); };
  const pn = panel(stage, ox + 470, 24, 420);
  if (v === 'clock') {
    ticks.forEach((t) => hid(t));
    const w1 = mark(1, AMBER), w2 = mark(2, BLUE), w3 = mark(3, GREEN);
    const L1 = pn.line(`a full turn: <b>360°</b>, 12 hour marks`), L2 = pn.line(`${tex('360^\\circ\\div12=30^\\circ')}`, 'u5l4-res'),
      L3 = pn.line(`two marks: ${tex('2\\times30^\\circ=60^\\circ')}`, 'u5l4-blue'), L4 = pn.line(`three marks: ${tex('3\\times30^\\circ=90^\\circ')}`, 'u5l4-green');
    const turn = (c, a, b) => tween(c, 900, (t) => setHand(hourH, hd(a + (b - a) * t), R - 85));
    const l30 = hid(T(svg, ...at(C, 75, wr * 0.62), '30°', { size: 22, color: AMBER }));
    const l60 = hid(T(svg, ...at(C, 45, wr * 0.66), '60°', { size: 22, color: BLUE }));
    const l90 = hid(T(svg, ...at(C, 15, wr * 0.7), '90°', { size: 22, color: GREEN }));
    return [
      { cap: 'Once around the clock is a <b>full turn: 360°</b>. The face has <b>12 hour marks</b>.', run: async (c) => { for (const t of ticks) await c.pop(t, 160); await show(c, L1); } },
      { cap: 'From one hour mark to the next is <b>360° ÷ 12 = 30°</b>.', run: async (c) => { await turn(c, 0, 1); await show(c, w1); await c.pop(l30); await show(c, L2); } },
      { cap: 'Two hour marks: <b>2 × 30° = 60°</b>.', run: async (c) => { await turn(c, 1, 2); await show(c, w2); await c.pop(l60); await show(c, L3); } },
      { cap: 'Three hour marks: <b>3 × 30° = 90°</b>, a right angle (3:00).', run: async (c) => { await turn(c, 2, 3); await show(c, w3); await c.pop(l90); await show(c, L4); } }
    ];
  }
  const n = v, k = Math.min(n, 12 - n), ang = k * 30;
  const longW = [], longC = [], shortW = [], shortC = [];
  for (let i = 1; i <= n; i++) { longW.push(mark(i, n > 6 ? LIGHT : AMBER, n > 6 ? 0.25 : 0.32)); longC.push(cnt(i, i, n > 6 ? GREY : AMBER)); }
  if (n > 6) for (let i = n + 1, j = 1; i <= 12; i++, j++) { shortW.push(mark(i, AMBER, 0.36)); shortC.push(cnt(i, j, AMBER)); }
  const L1 = pn.line(`minute hand on <b>12</b>, hour hand on <b>${n}</b>`), L2 = pn.line(n > 6 ? `the short way: <b>${k}</b> hour marks` : `<b>${k}</b> hour mark${k > 1 ? 's' : ''} apart`),
    L3 = pn.line(tex(`${k}\\times30^\\circ=${ang}^\\circ`), 'u5l4-res'), L4 = pn.line(`<b>${typeOf(ang)}</b>${ang === 180 ? ' (a straight line)' : ''}`);
  const big = hid(T(svg, ...at(C, hd(n > 6 ? n + k / 2 : k / 2), wr * 0.42), dg(ang), { size: 28, color: RED }));
  return [
    { cap: `At ${n}:00 the minute hand points at <b>12</b>. The hour hand points at <b>${n}</b>.`, run: async (c) => { await tween(c, 1300, (t) => setHand(hourH, hd(n * t), R - 85)); await show(c, L1); } },
    n > 6
      ? { cap: `From 12 clockwise to ${n} is ${n} marks. The <b>short way</b>, from ${n} on to 12, is only <b>${k}</b>.`, run: async (c) => {
        for (let i = 0; i < n; i++) { await show(c, longW[i], 120); await show(c, longC[i], 80); }
        await Promise.all([...longW, ...longC].map((e) => dim(c, e, 0.2)));
        for (let i = 0; i < shortW.length; i++) { await show(c, shortW[i], 160); await c.pop(shortC[i], 220); }
        await show(c, L2);
      } }
      : { cap: `Count the hour marks between the hands: <b>${k}</b>.`, run: async (c) => { for (let i = 0; i < n; i++) { await show(c, longW[i], 160); await c.pop(longC[i], 220); } await show(c, L2); } },
    { cap: `Each mark is 30°: <b>${k} × 30° = ${ang}°</b>, ${ang === 180 ? 'a straight angle' : ang === 90 ? 'a right angle' : `an ${typeOf(ang)} angle`}.`, run: async (c) => { await c.pop(big); await show(c, L3); await show(c, L4); } }
  ];
}

/* ======================================================================================
 * 1b. Building an angle from referents (Example 1(b) check)
 * ====================================================================================== */
const NAME = { 90: 'the corner of a sheet', 45: 'one fold', 22.5: 'two folds', 30: 'one hour mark', 60: 'two hour marks', 180: 'a straight line', 360: 'a full turn' };
const BUILD = {
  330: { ops: [['+', 360], ['-', 30]] }, 135: { ops: [['+', 90], ['+', 45]] }, 67.5: { ops: [['+', 45], ['+', 22.5]] }, 150: { ops: [['+', 180], ['-', 30]] },
  270: { ops: [['+', 180], ['+', 90]] }, 15: { ops: [['half', 30]] }, 112.5: { ops: [['+', 90], ['+', 22.5]] }
};
const build = {
  title: 'Build an angle from referents',
  height: 420,
  minW: 900,
  choices: [{ sep: 'From the notes:' }, { v: 330, label: '330°' }, { sep: 'Example 1(b) check:' }, ...[135, 67.5, 150, 270, 15, 112.5].map((v) => ({ v, label: dg(v) }))],
  ask: (v) => (v === 330 ? 'Build <b>330°</b> from referents.' : `Example 1(b) Build <b>${dg(v)}</b> from referents. Then name its type.`),
  make(stage, t, ex) {
    const W = ex.W, H = 420, ox = Math.max(0, (W - 900) / 2), svg = stageSvg(stage, W, H);
    const V = [ox + 250, 215], L = 192, r = 122, ops = BUILD[t].ops;
    const wl = svgEl('g', {}, svg);
    const arm1 = seg(svg, V, at(V, 0, L), { color: INK, width: 4 }); dotAt(svg, V, 5.5);
    const pn = panel(stage, ox + 530, 30, 360);
    const eqTex = ops[0][0] === 'half' ? `\\tfrac12\\times${fd(ops[0][1])}^\\circ` : ops.map(([o, a], i) => (i ? (o === '+' ? '+' : '-') : '') + fd(a) + '^\\circ').join('');
    const L0 = pn.line(`<b>${dg(t)}</b>`, 'u5l4-big'), L1 = pn.line(tex(`${fd(t)}^\\circ=${eqTex}`), 'u5l4-res'), L2 = pn.line(`<b>${typeOf(t)}</b>: ${typeWhy(t)}`);
    L0.style.opacity = 1;
    const steps = [];
    const tag = (dir, rr, s, color) => hid(T(svg, ...at(V, dir, rr), s, { size: 22, color }));
    if (ops[0][0] === 'half') {
      const a = ops[0][1], w1 = hid(wedge(wl, V, r, 0, a, BLUE, 0.25)), g1 = ghost(svg, V, a, L, '', BLUE), lt1 = tag(a * 0.8, L + 34, dg(a), BLUE);
      const bis = ghost(svg, V, a / 2, L + 20, '', GREEN), w2 = hid(wedge(wl, V, r * 1.35, 0, a / 2, GREEN, 0.32)), lt2 = tag(a / 4, L + 34, dg(a / 2), GREEN);
      steps.push({ cap: `Start with <b>${dg(a)}</b>: ${NAME[a]}.`, run: async (c) => { await show(c, g1); await tween(c, 700, (u) => w1.setAttribute('d', wedgeD(V, r, 0, Math.max(0.5, a * u)))); w1.style.opacity = 1; await c.pop(lt1); } });
      steps.push({ cap: `Cut it in half: half of ${dg(a)} is <b>${dg(a / 2)}</b>.`, run: async (c) => { await show(c, bis); await dim(c, w1, 0.35); await show(c, w2); await dim(c, lt1, 0.4); await c.pop(lt2); await show(c, L1); } });
    } else {
      let cur = 0;
      ops.forEach(([o, a], i) => {
        const from = o === '+' ? cur : cur - a, to = o === '+' ? cur + a : cur - a, color = o === '-' ? RED : i ? GREEN : BLUE;
        const w = hid(wedge(wl, V, o === '-' ? r * 1.22 : r, from, a, color, o === '-' ? 0.4 : 0.25)), g = ghost(svg, V, to, L, '', color);
        const lt = a < 40 ? tag(o === '-' ? from - 9 : to + 9, L - 22, (o === '-' ? '−' : '') + dg(a), color) : tag(from + a / 2, (o === '-' ? r * 1.22 : r) * 0.6, (o === '-' ? '−' : '') + dg(a), color);
        const before = cur;
        steps.push({
          cap: i === 0 ? `Start with <b>${dg(a)}</b>: ${NAME[a]}.` : o === '+' ? `Add <b>${dg(a)}</b> (${NAME[a]}): ${dg(before)} + ${dg(a)} = <b>${dg(to)}</b>.` : `Take away <b>${dg(a)}</b> (${NAME[a]}): ${dg(before)} − ${dg(a)} = <b>${dg(to)}</b>.`,
          run: async (c) => {
            w.style.opacity = 1;
            if (o === '+') await tween(c, 800, (u) => w.setAttribute('d', wedgeD(V, r, from, Math.max(0.5, a * u))));
            else await c.anim(w, [{ opacity: 0 }, { opacity: 1 }], 500);
            await show(c, g, 250); await c.pop(lt);
            if (i === ops.length - 1) await show(c, L1);
          }
        });
        cur = to;
      });
    }
    const arm2 = hid(seg(svg, V, at(V, t, L), { color: INK, width: 4 }));
    const arc = hid(P(svg, arcD(V, t > 180 ? 34 : 46, 0, t), { color: t > 180 ? RED : INK, width: 3 }));
    const st = hid(stamp(stage, typeOf(t), { ok: true, x: ox + 710, y: 330, rotate: -6 }));
    steps.push({ cap: `${dg(t)} is <b>${typeOf(t)}</b>: it is ${typeWhy(t)}.`, run: async (c) => { await show(c, arm2); await show(c, arc); await show(c, L2); st.style.opacity = 1; await stampIn(c, st); } });
    void arm1;
    return steps;
  }
};

/* ======================================================================================
 * 2. Estimating (Example 2 check)
 * ====================================================================================== */
const EST = {
  A: { s: 10, m: 35, lo: 30, hi: 45, close: 'closer to 30°', est: 35 },
  B: { s: -20, m: 115, lo: 90, hi: 135, close: 'near the middle', est: 115 },
  C: { s: 290, m: 70, lo: 60, hi: 90, close: 'closer to 60°', est: 70 },
  D: { s: 100, m: 160, lo: 150, hi: 180, close: 'closer to 180°', est: 160 }
};
const estimate = {
  title: 'Estimate an angle in 3 steps',
  height: 430,
  minW: 900,
  choices: [{ sep: 'Example 2 check:' }, ...Object.keys(EST).map((k) => ({ v: k, label: 'Angle ' + k }))],
  ask: (k) => `Example 2 Estimate <b>angle ${k}</b>. Then measure it.`,
  make(stage, k, ex) {
    const W = ex.W, H = 430, ox = Math.max(0, (W - 900) / 2), svg = stageSvg(stage, W, H);
    const d = EST[k], L = k === 'D' ? 160 : 205, a1 = d.s, a2 = d.s + d.m;
    const pts0 = [[0, 0], at([0, 0], a1, L), at([0, 0], a2, L), at([0, 0], a1 + 90, 120), at([0, 0], a1 + d.hi, L + 30), at([0, 0], a1 + d.lo, L + 30)];
    const off = fitIn(pts0, [ox + 20, 30, ox + 520, 410]), V = [off[0], off[1]];
    Geo.angle(svg, { vertex: V, a1, a2, len: L, width: 4, r: 52 });
    T(svg, ...at(V, a1 + d.m / 2 + 180, 30), k, { size: 26, color: INK });
    const gL = ghost(svg, V, a1 + 90, d.m > 90 ? 150 : 170, '90°', SLATE);
    const sqm = hid(P(svg, `M${P2(at(V, a1, 22))}L${P2(at(at(V, a1, 22), a1 + 90, 22))}L${P2(at(V, a1 + 90, 22))}`, { color: SLATE, width: 2.2, cap: 'butt' }));
    const gS = d.hi === 180 ? ghost(svg, V, a1 + 180, 150, '180°', SLATE) : null;
    const gLo = ghost(svg, V, a1 + d.lo, L + 10, dg(d.lo), BLUE, 20), gHi = d.hi === 180 ? null : ghost(svg, V, a1 + d.hi, L + 10, dg(d.hi), GREEN, 20);
    const ml = hid(T(svg, ...at(V, a1 + d.m / 2, 92), dg(d.m), { size: 26, color: RED }));
    const pn = panel(stage, ox + 560, 24, 330), type = typeOf(d.m);
    const L1 = pn.line(`<b>Step 1:</b> ${type}`), L2 = pn.line(`<b>Step 2:</b> between ${dg(d.lo)} and ${dg(d.hi)}, ${d.close}`),
      L3 = pn.line(`<b>Step 3:</b> about ${dg(d.est)}`, 'u5l4-res'), L4 = pn.line(`<b>Measure:</b> ${dg(d.m)}`);
    const st = hid(stamp(stage, 'within 10° ✓', { ok: true, x: ox + 725, y: 375, rotate: -6 }));
    return [
      { cap: `<b>Step 1:</b> compare it with an L (90°). It is ${d.m < 90 ? 'smaller' : 'bigger'}${d.m > 90 ? ', but less than a straight line' : ''}: <b>${type}</b>.`,
        run: async (c) => { await show(c, gL); await show(c, sqm); if (gS) await show(c, gS); await show(c, L1); } },
      { cap: `<b>Step 2:</b> it is between <b>${dg(d.lo)}</b> and <b>${dg(d.hi)}</b>, ${d.close}.`,
        run: async (c) => { await dim(c, gL, d.lo === 90 ? 0 : 0.25); await dim(c, sqm, 0.25); if (gS) await dim(c, gS, 0.35); await show(c, gLo); if (gHi) await show(c, gHi); await show(c, L2); } },
      { cap: `<b>Step 3:</b> write an estimate: <b>about ${dg(d.est)}</b>.`, run: async (c) => { await c.pop(L3); } },
      { cap: `Now measure: <b>${dg(d.m)}</b>. The estimate was within 10° ✓`, run: async (c) => { await c.pop(ml); await show(c, L4); st.style.opacity = 1; await stampIn(c, st); } }
    ];
  }
};

/* ======================================================================================
 * 2b. Which protractor scale? (Example 3 check)
 * ====================================================================================== */
const SC = {
  a: { rot: 0, a1: 180, a2: 115, arm: 115, L: 90, outer: 65, inner: 115, ans: 65, est: 'acute, about 65°', zero: 'outer', side: 'left', z: 'outer' },
  b: { rot: 20, a1: 20, a2: 160, arm: 160, L: 110, outer: 40, inner: 140, ans: 140, est: 'obtuse, about 135°', zero: 'inner', side: 'right', z: 'inner' }
};
const scales = {
  title: 'Estimate first, then pick the scale',
  height: 450,
  minW: 900,
  tap: false,
  choices: [{ sep: 'Example 3 check:' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }],
  ask: (k) => `Example 3(${k}) The arm crosses two numbers. Which one is the angle?`,
  make(stage, k, ex) {
    const W = ex.W, ox = Math.max(0, (W - 900) / 2), d = SC[k], V = [300, 300], R = 220;
    const Pt = Geo.protractor(stage, { x: ox, y: 0, width: 600, height: 440, r: R, cx: V[0], cy: V[1], rot: d.rot, angle: { vertex: V, a1: d.a1, a2: d.a2, len: 262 }, buttons: false, readout: false, hidden: true, snap: false });
    const sv = Pt.svg, top = svgEl('g', {}, sv);
    const gL = ghost(top, V, d.L, 200, '', SLATE);
    const co = hid(svgEl('circle', { cx: at(V, d.arm, R * 0.845)[0], cy: at(V, d.arm, R * 0.845)[1], r: 19, fill: 'none', stroke: BLUE, 'stroke-width': 3.5 }, top));
    const ci = hid(svgEl('circle', { cx: at(V, d.arm, R * 0.748)[0], cy: at(V, d.arm, R * 0.748)[1], r: 17, fill: 'none', stroke: GREEN, 'stroke-width': 3.5 }, top));
    const pn = panel(stage, ox + 610, 30, 285);
    const L1 = pn.line(`<b>Estimate:</b> ${d.est}`), L2 = pn.line(`outer scale: <b style="color:${BLUE}">${d.outer}</b>`, 'u5l4-blue'), L3 = pn.line(`inner scale: <b style="color:${GREEN}">${d.inner}</b>`, 'u5l4-green'),
      L4 = pn.line(`The angle is <b>${d.ans}°</b>`, 'u5l4-res');
    const wrong = d.ans === d.outer ? d.inner : d.outer;
    const st = hid(stamp(stage, `${d.ans}°`, { ok: true, x: ox + 750, y: 380, rotate: -6 }));
    return [
      { cap: `<b>Estimate first.</b> Compare with an L: the angle is ${d.ans < 90 ? 'smaller' : 'bigger'}, so it is <b>${d.est}</b>.`, run: async (c) => { await show(c, gL); await show(c, L1); } },
      { cap: `The arm crosses <b>${d.outer}</b> on the outer scale and <b>${d.inner}</b> on the inner scale. They add to 180°.`, run: async (c) => { await dim(c, gL, 0.2); await c.pop(co); await show(c, L2); await c.pop(ci); await show(c, L3); } },
      { cap: `It is ${typeOf(d.ans)}, so the angle is <b>${d.ans}°</b>, not ${wrong}°. The ${d.side} arm sits on the <b>${d.z} 0</b>.`,
        run: async (c) => { Pt.showScale(d.zero); await show(c, L4); st.style.opacity = 1; await stampIn(c, st); } }
    ];
  }
};

/* ======================================================================================
 * Example 4: the ladder rule (a scene that moves with the estimate)
 * ====================================================================================== */
const LAD = {
  P: { th: 75, lo: 60, hi: 90, say: 'About halfway between 60° and 90°: <b>about 75°</b>.', est: 75 },
  Q: { th: 55, lo: 45, hi: 60, say: 'A little less than 60°: <b>about 55°</b>.', est: 55 }
};
function ladderPath(F, Tp, w = 9, gap = 34) {
  const L = Math.hypot(Tp[0] - F[0], Tp[1] - F[1]), u = [(Tp[0] - F[0]) / L, (Tp[1] - F[1]) / L], n = [-u[1] * w, u[0] * w];
  let d = `M${P2([F[0] + n[0], F[1] + n[1]])}L${P2([Tp[0] + n[0], Tp[1] + n[1]])}M${P2([F[0] - n[0], F[1] - n[1]])}L${P2([Tp[0] - n[0], Tp[1] - n[1]])}`;
  for (let s = gap * 0.6; s < L - 8; s += gap) { const p = [F[0] + u[0] * s, F[1] + u[1] * s]; d += `M${P2([p[0] + n[0], p[1] + n[1]])}L${P2([p[0] - n[0], p[1] - n[1]])}`; }
  return d;
}
const ladder = {
  title: 'Is the ladder safe?',
  height: 420,
  minW: 900,
  choices: [{ sep: 'Example 4 check:' }, { v: 'P', label: 'Ladder P' }, { v: 'Q', label: 'Ladder Q' }],
  ask: (k) => `Example 4 Estimate the angle of <b>ladder ${k}</b> with the ground. Is it safe?`,
  make(stage, k, ex) {
    const W = ex.W, H = 420, ox = Math.max(0, (W - 900) / 2), svg = stageSvg(stage, W, H), d = LAD[k];
    const wx = ox + 70, gy = 390, Lp = 300, Vi = [ox + 615, 385];
    const hatch = svgEl('g', {}, svg);
    svgEl('rect', { x: wx - 24, y: 30, width: 24, height: gy - 30, fill: '#e6dfd2', stroke: SLATE, 'stroke-width': 2 }, hatch);
    for (let y = 40; y < gy; y += 22) seg(hatch, [wx - 24, y + 16], [wx, y], { color: LIGHT, width: 1.4 });
    seg(svg, [wx - 36, gy], [ox + 330, gy], { color: INK, width: 4 });
    svgEl('rect', { x: ox + 345, y: 50, width: 295, height: 365, rx: 14, fill: '#fff', stroke: '#e3dccb', 'stroke-width': 2 }, svg);
    T(svg, ox + 492, 72, 'zoom in at the foot', { size: 17, color: GREY });
    seg(svg, Vi, [Vi[0] - 245, Vi[1]], { color: INK, width: 4 });
    const ld = svgEl('path', { fill: 'none', stroke: '#8a8f99', 'stroke-width': 5, 'stroke-linecap': 'round' }, svg);
    const arc = svgEl('path', { fill: 'none', stroke: RED, 'stroke-width': 3 }, svg);
    const ring = svgEl('circle', { r: 30, fill: 'none', stroke: AMBER, 'stroke-width': 2.4, 'stroke-dasharray': '5 4' }, svg);
    const iL = svgEl('path', { fill: 'none', stroke: '#8a8f99', 'stroke-width': 9, 'stroke-linecap': 'round' }, svg);
    const iA = svgEl('path', { fill: 'none', stroke: RED, 'stroke-width': 3.5 }, svg);
    dotAt(svg, Vi, 5);
    const set = (a) => {
      const F = [wx + Lp * Math.cos(a * RAD), gy], Tp = [wx, gy - Lp * Math.sin(a * RAD)];
      ld.setAttribute('d', ladderPath(F, Tp)); arc.setAttribute('d', arcD(F, 40, 180 - a, a));
      ring.setAttribute('cx', F[0].toFixed(1)); ring.setAttribute('cy', F[1].toFixed(1));
      iL.setAttribute('d', `M${P2(Vi)}L${P2(at(Vi, 180 - a, 250))}`); iA.setAttribute('d', arcD(Vi, 72, 180 - a, a));
    };
    set(88);
    const gLo = ghost(svg, Vi, 180 - d.lo, 255, dg(d.lo), BLUE, 20), gHi = ghost(svg, Vi, 180 - d.hi, 255, dg(d.hi), GREEN, 20);
    const el = hid(lab(stage, `<span class="u5l4-pill">about ${d.est}°</span>`, ...at(Vi, 180 - d.th / 2, 128), 150, 34));
    const pn = panel(stage, ox + 655, 30, 240);
    const L1 = pn.line('<b>Rule:</b> about 75°'), L2 = pn.line(`<b>Ladder ${k}:</b> about ${d.est}°`, 'u5l4-res');
    L1.style.opacity = 1;
    const ok = k === 'P', st = hid(stamp(stage, ok ? 'SAFE ✓' : 'TOO FLAT ✗', { ok, x: ox + 775, y: 250, rotate: -7, size: 'lg' }));
    return [
      { cap: `Ladder ${k} leans against the wall. Look at the angle it makes with the <b>ground</b>.`, run: async (c) => { await tween(c, 1500, (t) => set(88 + (d.th - 88) * t)); } },
      { cap: `Compare with referents: <b>${dg(d.lo)}</b> and <b>${dg(d.hi)}</b>.`, run: async (c) => { await show(c, gLo); await show(c, gHi); } },
      { cap: d.say, run: async (c) => { await c.pop(el); await show(c, L2); } },
      ok ? { cap: 'Close to the 75° rule: Ladder P is set up <b>safely</b>.', run: async (c) => { st.style.opacity = 1; await stampIn(c, st); } }
        : { cap: 'About <b>20° less</b> than the rule: too flat. The bottom can slide out!', run: async (c) => {
          st.style.opacity = 1; await stampIn(c, st); await Promise.all([dim(c, gLo, 0), dim(c, gHi, 0), dim(c, el, 0)]);
          await tween(c, 900, (t) => set(d.th - 9 * t));
        } }
    ];
  }
};

/* ======================================================================================
 * 3. Sketching (Example 5 check)
 * ====================================================================================== */
const SK = {
  45: { sk: 48, refs: [[90, '90°', SLATE], [45, '45°', BLUE]], say: 'an L (90°), then <b>half of it</b>', V: [250, 360], L: 260 },
  150: { sk: 146, refs: [[180, '180°', SLATE], [150, '150°', BLUE]], say: 'a <b>straight line</b> (180°), less <b>30°</b> (one hour mark)', V: [290, 300], L: 240 },
  20: { sk: 22, refs: [[45, '45°', SLATE], [22.5, '22.5°', BLUE]], say: '45°, then half again: <b>22.5°</b>. 20° is a bit less', V: [200, 320], L: 300 },
  240: { sk: 236, refs: [[180, '180°', SLATE], [240, '240°', BLUE]], say: 'a <b>straight line</b> (180°), plus <b>60°</b> (two hour marks)', V: [300, 195], L: 215 }
};
const sketch = {
  title: 'Sketch an angle without a protractor',
  height: 430,
  minW: 900,
  choices: [{ sep: 'Example 5 check:' }, ...[45, 150, 20, 240].map((a, i) => ({ v: a, label: `(${'abcd'[i]}) ${a}°` }))],
  ask: (a) => `Example 5 Sketch <b>${a}°</b> without a protractor. Which referents help?`,
  make(stage, a, ex) {
    const W = ex.W, H = 430, ox = Math.max(0, (W - 900) / 2), svg = stageSvg(stage, W, H), d = SK[a];
    const V = [ox + d.V[0], d.V[1]], L = d.L;
    svgEl('rect', { x: ox + 10, y: 10, width: 540, height: 410, rx: 10, fill: '#fffef8', stroke: '#e3dccb', 'stroke-width': 2 }, svg);
    const arm1 = hid(pencil(svg, V, at(V, 0, L), { bend: 2 })), vd = hid(dotAt(svg, V, 5.5, PENCIL));
    const gs = d.refs.map(([r, s, color], i) => ghost(svg, V, r, i === d.refs.length - 1 ? L - 6 : L * (r === 180 ? 0.62 : 0.8), s, color, 19));
    const arm2 = hid(pencil(svg, V, at(V, d.sk, L * 0.92), { bend: -3 }));
    const arc = hid(P(svg, arcD(V, a > 180 ? 36 : a < 30 ? 120 : 52, 0, d.sk), { color: a > 180 ? RED : PENCIL, width: 3 }));
    const pn = panel(stage, ox + 575, 30, 320);
    const small = 360 - d.sk;
    const L1 = pn.line(`<b>Sketch ${a}°</b>`, 'u5l4-big'), L2 = pn.line(`referents: ${d.say}`), L3 = pn.line(a > 180
      ? `check: the other side is ${small}°, so ${tex(`360^\\circ-${small}^\\circ=${d.sk}^\\circ`)}` : `check: it measures <b>${d.sk}°</b>`, 'u5l4-res');
    L1.style.opacity = 1;
    const st = hid(stamp(stage, `off by ${Math.abs(d.sk - a)}° ✓`, { ok: true, x: ox + 735, y: 360, rotate: -6 }));
    return [
      { cap: '<b>Step 1:</b> draw one arm and mark the vertex.', run: async (c) => { arm1.style.opacity = 1; await drawIn(arm1, 700, c); await c.pop(vd); } },
      { cap: `<b>Step 2:</b> picture the referents: ${d.say}.`, run: async (c) => { for (const g of gs) await show(c, g, 400); await show(c, L2); } },
      { cap: '<b>Step 3:</b> draw the second arm where you think it goes. Mark the angle with an arc.', run: async (c) => { arm2.style.opacity = 1; await drawIn(arm2, 800, c); arc.style.opacity = 1; await drawIn(arc, 600, c); } },
      { cap: a > 180 ? `<b>Step 4:</b> check. The other side measures ${small}°, so the sketch is ${d.sk}°: within 10° ✓`
        : `<b>Step 4:</b> check with a protractor: <b>${d.sk}°</b>. Within 10° of ${a}° ✓`, run: async (c) => { await show(c, L3); st.style.opacity = 1; await stampIn(c, st); } }
    ];
  }
};

/* ======================================================================================
 * 4. True bearings on a compass rose (Example 6 check)
 * ====================================================================================== */
const DIRS = { E: 90, S: 180, W: 270, NW: 315, NE: 45, SW: 225, NNE: 22.5, WSW: 247.5 };
const HALF = { NNE: ['N', 0, 'NE', 45], WSW: ['SW', 225, 'W', 270], NW: ['W', 270, 'N', 360], NE: ['N', 0, 'E', 90], SW: ['S', 180, 'W', 270] };
const DB = {
  i: { q: '30° east of north', main: 'north', mb: 0, turn: 30, toward: 'east', cw: true, res: 30 },
  ii: { q: '20° south of east', main: 'east', mb: 90, turn: 20, toward: 'south', cw: true, res: 110 },
  iii: { q: '40° west of south', main: 'south', mb: 180, turn: 40, toward: 'west', cw: true, res: 220 },
  iv: { q: '15° west of north', main: 'north', mb: 0, turn: 15, toward: 'west', cw: false, res: 345 }
};
const bearing = {
  title: 'True bearings: clockwise from north',
  height: 440,
  minW: 900,
  choices: [{ v: 'nesw', label: 'N, E, S, W' }, { sep: 'Example 6(a) check:' }, ...Object.keys(DIRS).map((v) => ({ v, label: v })),
    { sep: 'Example 6(b) check:' }, ...Object.keys(DB).map((v) => ({ v, label: `(${v})` }))],
  ask: (v) => (v === 'nesw' ? 'What are the bearings of north, east, south and west?' : DIRS[v] != null ? `Example 6(a) What is the true bearing of <b>${v}</b>?`
    : `Example 6(b)(${v}) Write <b>${DB[v].q}</b> as a true bearing.`),
  make(stage, v, ex) {
    const W = ex.W, ox = Math.max(0, (W - 900) / 2);
    const R = Geo.compassRose(stage, { x: ox + 20, y: 0, width: 440, height: 440, points: 16, r: 150 });
    const C = R.C, sv = R.svg;
    const pn = panel(stage, ox + 500, 40, 390);
    if (v === 'nesw') {
      const L = [pn.line('N = <b>000°</b> (the start)'), pn.line('E = <b>090°</b>, a quarter turn'), pn.line('S = <b>180°</b>, a half turn'), pn.line('W = <b>270°</b>, three quarters')];
      return [
        { cap: 'Every true bearing starts at <b>north</b>: N = <b>000°</b>.', run: async (c) => { await show(c, L[0]); } },
        { cap: 'Turn <b>clockwise</b> a quarter turn: E = <b>090°</b>.', run: async (c) => { await R.turn(c, 90, 1000); await show(c, L[1]); } },
        { cap: 'Keep turning clockwise: S = <b>180°</b>.', run: async (c) => { await R.turn(c, 180, 1300); await show(c, L[2]); } },
        { cap: 'W = <b>270°</b>. One more quarter turn is back to north, so bearings stop before 360°.', run: async (c) => { await R.turn(c, 270, 1600); await show(c, L[3]); } }
      ];
    }
    if (DIRS[v] != null) {
      const b = DIRS[v], hf = HALF[v];
      const L1 = pn.line(`start at <b>N</b>, turn <b>clockwise</b> to <b>${v}</b>`);
      const L2 = pn.line(hf ? `halfway between ${hf[0]} (${BT(hf[1])}°) and ${hf[2]} (${BT(hf[3] % 360)}°)` : `${v} = ${b / 90} quarter turn${b > 90 ? 's' : ''}`);
      const L3 = pn.line(hf ? tex(`${BT(hf[1])}^\\circ+${fd((hf[3] - hf[1]) / 2)}^\\circ=${BT(b)}^\\circ`) : `${v} = <b>${BT(b)}°</b>`, 'u5l4-res');
      return [
        { cap: `Face <b>north</b> (000°) and turn <b>clockwise</b> to ${v}.`, run: async (c) => { await R.turn(c, b, 600 + b * 5); await show(c, L1); } },
        { cap: hf ? `${v} is halfway between ${hf[0]} and ${hf[2]}: ${BT(hf[1])}° + ${fd((hf[3] - hf[1]) / 2)}° = <b>${BT(b)}°</b>.` : `${v} = <b>${BT(b)}°</b>. Always write 3 digits.`,
          run: async (c) => { await show(c, L2); await c.pop(L3); } }
      ];
    }
    const d = DB[v], mainRay = R.add(d.mb, { color: SLATE, arc: false, label: false, dash: '10 7', width: 3 }); hid(mainRay);
    const turnArc = sweepArc(sv, C, R.R * 0.7, B2D(d.mb), d.cw ? -d.turn : d.turn, AMBER, 3.5);
    const tl = hid(T(sv, ...at(C, B2D(d.mb) + (d.cw ? -1 : 1) * d.turn / 2, R.R * 0.7 + 26), dg(d.turn), { size: 20, color: AMBER }));
    const eq = d.cw ? `${BT(d.mb)}^\\circ+${d.turn}^\\circ=${BT(d.res)}^\\circ` : `360^\\circ-${d.turn}^\\circ=${BT(d.res)}^\\circ`;
    const L1 = pn.line(`face <b>${d.main}</b>: ${BT(d.mb)}°`), L2 = pn.line(`turn ${d.turn}° toward ${d.toward}: <b>${d.cw ? 'clockwise, add' : 'counterclockwise, subtract'}</b>`),
      L3 = pn.line(tex(eq), 'u5l4-res');
    return [
      { cap: `${d.q}: face <b>${d.main}</b> first (${BT(d.mb)}°).`, run: async (c) => { await show(c, mainRay); await show(c, L1); } },
      { cap: `Turn ${d.turn}° toward ${d.toward}. That is <b>${d.cw ? 'clockwise' : 'counterclockwise'}</b>, so <b>${d.cw ? 'add' : 'subtract'}</b>.`, run: async (c) => { await sweep(c, turnArc, 700); await c.pop(tl); await show(c, L2); } },
      { cap: d.cw ? `${BT(d.mb)}° + ${d.turn}° = <b>${BT(d.res)}°</b>. Check: clockwise from north is ${BT(d.res)}°.` : `From north, back ${d.turn}°: 360° − ${d.turn}° = <b>${BT(d.res)}°</b>.`,
        run: async (c) => { await R.turn(c, d.res, 600 + d.res * 4); await c.pop(L3); } }
    ];
  }
};

/* ======================================================================================
 * 5. Bearings on a map: a protractor on the north line (Examples 7 and 8)
 * ====================================================================================== */
const MK = 66, MX = (x) => 20 + (x + 0.9) * MK, MY = (y) => 70 + (2.9 - y) * MK;      // Example 8 map (TikZ cm → px)
const MAPPT = (() => {
  const p = [0, 0], b = [p[0] + 3.2 * Math.cos(40 * RAD), p[1] + 3.2 * Math.sin(40 * RAD)], l = [b[0] + 3 * Math.cos(-45 * RAD), b[1] + 3 * Math.sin(-45 * RAD)],
    k = [l[0] + 4.5 * Math.cos(-165 * RAD), l[1] + 4.5 * Math.sin(-165 * RAD)];
  return { P: p, B: b, L: l, K: k };
})();
const LEG = { PB: ['P', 'B', 'a'], BL: ['B', 'L', 'b'], LK: ['L', 'K', 'c'], KP: ['K', 'P', 'd'] };
const DRAW7 = { a: 60, b: 135, c: 250, d: 320 };
const map = {
  title: 'Bearings with a protractor on the north line',
  height: 470,
  minW: 900,
  tap: false,
  choices: [{ sep: 'Example 7 check:' }, ...Object.keys(DRAW7).map((k) => ({ v: k, label: `(${k}) ${BT(DRAW7[k])}°` })),
    { sep: 'Example 8 check:' }, ...Object.keys(LEG).map((k) => ({ v: k, label: `(${LEG[k][2]}) ${LEG[k][0]} to ${LEG[k][1]}` }))],
  ask: (v) => (DRAW7[v] ? `Example 7(${v}) Draw a line from P on a bearing of <b>${BT(DRAW7[v])}°</b>.` : `Example 8(${LEG[v][2]}) Find the bearing from <b>${LEG[v][0]}</b> to <b>${LEG[v][1]}</b>.`),
  make(stage, v, ex) {
    const W = ex.W, H = 470, ox = Math.max(0, (W - 900) / 2), svg = stageSvg(stage, W, H);
    const pn = panel(stage, ox + 560, 30, 335);
    let X, Y = null, b, from, toName;
    if (DRAW7[v]) {
      b = DRAW7[v]; X = [ox + 270, 290];
      svgEl('rect', { x: ox + 20, y: 12, width: 510, height: 446, rx: 10, fill: '#fffef8', stroke: '#e3dccb', 'stroke-width': 2 }, svg);
      dotAt(svg, X, 6); T(svg, X[0] - 20, X[1] + 18, 'P', { size: 24 });
    } else {
      const [a, z] = LEG[v]; from = a; toName = z;
      const q = (n) => [ox + MX(MAPPT[n][0]), MY(MAPPT[n][1])];
      X = q(a); Y = q(z);
      svgEl('rect', { x: ox + 20, y: 70, width: 6.3 * MK, height: 4.8 * MK, fill: '#f4f7ef', stroke: '#b8c2a8', 'stroke-width': 2 }, svg);
      svgEl('path', { d: `M${['P', 'B', 'L', 'K'].map((n) => P2(q(n))).join('L')}`, fill: 'none', stroke: LIGHT, 'stroke-width': 2.4, 'stroke-dasharray': '8 6' }, svg);
      const nameOff = { P: [-18, 4], B: [-16, -16], L: [18, 0], K: [0, 20] };
      ['P', 'B', 'L', 'K'].forEach((n) => { const p = q(n); dotAt(svg, p, 6, n === a || n === z ? INK : GREY); T(svg, p[0] + nameOff[n][0], p[1] + nameOff[n][1], n, { size: 22 }); });
      const na = [ox + MX(4.9), MY(1.6)]; northLine(svg, na, 0.8 * MK, { dash: null, color: INK });
      const dv = [Y[0] - X[0], -(Y[1] - X[1])]; b = n360(90 - Math.atan2(dv[1], dv[0]) / RAD);
    }
    const east = b < 180, m = east ? b : 360 - b, mR = Math.round(m), bR = east ? Math.round(b) : 360 - mR;
    const nl = northLine(svg, X, Y ? 82 : 170, { size: 20 }); hid(nl);
    const Pt = Geo.protractor(stage, { x: ox, y: 0, width: 560, height: 470, r: Y ? 100 : 165, cx: X[0] - ox + (east ? -60 : 60), cy: Math.min(440, X[1] + 120), rot: 0, buttons: false, readout: false, snap: false });
    hid(Pt.el); Pt.g.style.pointerEvents = 'none';
    const sw = sweepArc(svg, X, Y ? 52 : 70, 90, east ? -m : m, AMBER, 3.5);
    const ml = hid(T(svg, ...(m < 20 ? at(X, 90 + (east ? -1 : 1) * (m + 55), 46) : at(X, 90 + (east ? -1 : 1) * m / 2, (Y ? 52 : 70) + 24)), dg(mR), { size: 21, color: AMBER }));
    const ray = Y ? hid(seg(svg, X, Y, { color: RED, width: 4 })) : hid(seg(svg, X, at(X, B2D(b), 200), { color: RED, width: 4 }));
    if (!Y) arrowHead(ray.parentNode, ...at(X, B2D(b), 200), Math.cos(B2D(b) * RAD), -Math.sin(B2D(b) * RAD), { color: RED, width: 4 });
    const head = !Y ? ray.parentNode.lastElementChild : null; if (head) hid(head);
    const L1 = pn.line(Y ? `from <b>${from}</b> to <b>${toName}</b>` : `bearing <b>${BT(b)}°</b>`, 'u5l4-big'),
      L2 = pn.line(east ? `<b>east</b> side: ${Y ? 'read' : 'measure'} ${mR}°` : Y ? `<b>west</b> side: read ${mR}°` : `more than 180°: ${tex(`360^\\circ-${b}^\\circ=${mR}^\\circ`)} on the <b>west</b> side`),
      L3 = pn.line(east ? `bearing = <b>${BT(bR)}°</b>` : tex(`360^\\circ-${mR}^\\circ=${BT(bR)}^\\circ`), 'u5l4-res');
    L1.style.opacity = 1;
    const pose = { cx: X[0] - ox, cy: X[1], rot: east ? -90 : 90 };
    return [
      { cap: `<b>Step 1:</b> draw a north line through ${Y ? from : 'P'}, straight up like the map’s north arrow.`, run: async (c) => { nl.style.opacity = 1; await drawIn(nl.line, 600, c); } },
      { cap: `<b>Step 2:</b> centre on ${Y ? from : 'P'}, with the protractor’s <b>0 line on the north line</b>${east ? '' : ', curved side to the west'}.`, run: async (c) => { await show(c, Pt.el); await Pt.moveTo(c, pose, 1300); } },
      Y ? { cap: east ? `${toName} is on the <b>east</b> side: read <b>${mR}°</b> from north.` : `${toName} is on the <b>west</b> side: read <b>${mR}°</b>${v === 'KP' ? ' (about)' : ''} from north.`,
        run: async (c) => { await sweep(c, sw, 1000); await c.pop(ml); await show(c, ray); await show(c, L2); } }
        : { cap: east ? `${BT(b)}° is less than 180°: count <b>${b}°</b> clockwise, on the east side.` : `${BT(b)}° is more than 180°: 360° − ${b}° = <b>${mR}°</b>. Mark it on the <b>west</b> side.`,
          run: async (c) => { await show(c, L2); await sweep(c, sw, 1000); await c.pop(ml); ray.style.opacity = 1; await drawIn(ray, 600, c); if (head) await show(c, head, 200); } },
      { cap: Y ? (east ? `The bearing from ${from} to ${toName} is <b>${BT(bR)}°</b>.` : `360° − ${mR}° = <b>${BT(bR)}°</b>${v === 'KP' ? ' (within 2° is fine)' : ''}.`)
        : `Done: the line from P points on a bearing of <b>${BT(b)}°</b>.`, run: async (c) => { await dim(c, Pt.el, 0, 400); await c.pop(L3); } }
    ];
  }
};

/* ======================================================================================
 * 5b. The bearing back (Example 9)
 * ====================================================================================== */
const PLANE = 'M0 -20 L3 -12 L3 -4 L16 3 L16 7 L3 4 L2 13 L7 17 L7 20 L0 18 L-7 20 L-7 17 L-2 13 L-3 4 L-16 7 L-16 3 L-3 -4 L-3 -12 Z';
const back = {
  title: 'The bearing back: the opposite way',
  height: 430,
  minW: 900,
  choices: [{ sep: 'Example 9(a) check:' }, ...[70, 145, 200, 315, 180].map((b) => ({ v: b, label: BT(b) + '°' })), { sep: 'Example 9(b) check:' }, { v: 'pilot', label: 'Bush pilot, 335°' }],
  ask: (v) => (v === 'pilot' ? 'Example 9(b) Out on <b>335°</b>. On what bearing does the pilot fly home?' : `Example 9(a) Find the bearing back for <b>${BT(v)}°</b>.`),
  make(stage, v, ex) {
    const W = ex.W, H = 430, ox = Math.max(0, (W - 900) / 2);
    const pn = panel(stage, ox + 520, 40, 375);
    if (v !== 'pilot') {
      const b = v, bk = b < 180 ? b + 180 : b - 180;
      const R = Geo.compassRose(stage, { x: ox + 20, y: 0, width: 430, height: 430, points: 8, r: 145 });
      const L1 = pn.line(`bearing <b>${BT(b)}°</b>`, 'u5l4-big'), L2 = pn.line(b < 180 ? `less than 180°: <b>add</b> 180°` : `180° or more: <b>subtract</b> 180°`),
        L3 = pn.line(tex(`${BT(b)}^\\circ${b < 180 ? '+' : '-'}180^\\circ=${BT(bk)}^\\circ`), 'u5l4-res');
      L1.style.opacity = 1;
      return [
        { cap: `Go out on a bearing of <b>${BT(b)}°</b>: clockwise from north.`, run: async (c) => { await R.turn(c, b, 600 + b * 4); } },
        { cap: `${BT(b)}° is ${b < 180 ? 'less than 180°, so <b>add</b>' : '180° or more, so <b>subtract</b>'} 180°.`, run: async (c) => { await show(c, L2); } },
        { cap: `${BT(b)}° ${b < 180 ? '+' : '−'} 180° = <b>${BT(bk)}°</b>: exactly the opposite way${b === 180 ? ' (south and north are opposite)' : ''}.`, run: async (c) => { await R.back(c, { ms: 1200 }); await c.pop(L3); } }
      ];
    }
    const svg = stageSvg(stage, W, H), F = [ox + 330, 360], len = 240, Lg = at(F, B2D(335), len);
    svgEl('rect', { x: ox + 20, y: 12, width: 470, height: 410, rx: 10, fill: '#eef4f8', stroke: '#c3d2de', 'stroke-width': 2 }, svg);
    for (const [cx, cy, rx, ry] of [[ox + 120, 110, 50, 24], [ox + 400, 200, 40, 20], [ox + 210, 300, 34, 16]]) svgEl('ellipse', { cx, cy, rx, ry, fill: '#bcd8ec' }, svg);
    dotAt(svg, F, 7); T(svg, F[0] + 10, F[1] + 26, 'Fort McMurray', { size: 18 });
    dotAt(svg, Lg, 7, BRAND); T(svg, Lg[0] + 44, Lg[1] + 4, 'lodge', { size: 18, color: BRAND });
    const n1 = northLine(svg, F, 110, { size: 18 }), n2 = hid(northLine(svg, Lg, 96, { size: 18 }));
    void n1;
    const out = hid(seg(svg, F, Lg, { color: RED, width: 3, dash: '10 7' })), home = hid(seg(svg, Lg, F, { color: BLUE, width: 3, dash: '10 7' }));
    const a1 = sweepArc(svg, F, 46, 90, -335, RED, 3), l1 = hid(T(svg, ...at(F, B2D(300), 80), '335°', { size: 21, color: RED }));
    const a2 = sweepArc(svg, Lg, 42, 90, -155, BLUE, 3), l2 = hid(T(svg, ...at(Lg, B2D(77), 74), '155°', { size: 21, color: BLUE }));
    const pl = svgEl('g', {}, svg); svgEl('path', { d: PLANE, fill: '#fff', stroke: INK, 'stroke-width': 2, 'stroke-linejoin': 'round' }, pl);
    const fly = (A, Bp, brg) => (t) => pl.setAttribute('transform', `translate(${P2([A[0] + (Bp[0] - A[0]) * t, A[1] + (Bp[1] - A[1]) * t])}) rotate(${brg}) scale(1.3)`);
    fly(F, Lg, 335)(0);
    const L1 = pn.line('out: <b>335°</b>'), L2 = pn.line('335° is more than 180°: <b>subtract</b> 180°'), L3 = pn.line(tex('335^\\circ-180^\\circ=155^\\circ'), 'u5l4-res'),
      L4 = pn.line('She flies home on <b>155°</b>.');
    return [
      { cap: 'The pilot flies from Fort McMurray on a bearing of <b>335°</b>.', run: async (c) => { await sweep(c, a1, 1200); await c.pop(l1); await show(c, out); await tween(c, 1600, fly(F, Lg, 335)); await show(c, L1); } },
      { cap: 'Home is the <b>opposite</b> way. 335° is more than 180°, so <b>subtract</b> 180°.', run: async (c) => { await show(c, n2); await show(c, L2); } },
      { cap: '335° − 180° = <b>155°</b>. She flies home on a bearing of 155°.', run: async (c) => {
        await sweep(c, a2, 900); await c.pop(l2); await show(c, L3); await tween(c, 500, (t) => pl.setAttribute('transform', `translate(${P2(Lg)}) rotate(${335 - 180 * t}) scale(1.3)`));
        await show(c, home); await tween(c, 1600, fly(Lg, F, 155)); await show(c, L4);
      } }
    ];
  }
};

/* ======================================================================================
 * Full notes: why the bearing back is 180° off
 * ====================================================================================== */
const whyBack = {
  title: 'Why the bearing back is 180° different',
  height: 420,
  minW: 900,
  choices: [{ v: 70, label: '070°' }, { v: 200, label: '200°' }],
  ask: (b) => `Why is the bearing back from <b>${BT(b)}°</b> exactly 180° different?`,
  make(stage, b, ex) {
    const W = ex.W, H = 420, ox = Math.max(0, (W - 900) / 2), svg = stageSvg(stage, W, H);
    const d = B2D(b), fig = (L) => { const A0 = at([0, 0], d + 180, L / 2), B0 = at([0, 0], d, L / 2); return [A0, B0, [A0[0], A0[1] - 120], [B0[0], B0[1] - 120], at(B0, d, 80), at(A0, d + 180, 40), [B0[0], B0[1] + 70], [A0[0], A0[1] + 40]]; };
    let L = 380; for (; L > 160; L -= 10) { const q = fig(L), xs = q.map((p) => p[0]), ys = q.map((p) => p[1]); if (Math.max(...xs) - Math.min(...xs) <= 470 && Math.max(...ys) - Math.min(...ys) <= 370) break; }
    const A0 = at([0, 0], d + 180, L / 2), B0 = at([0, 0], d, L / 2), off = fitIn(fig(L), [ox + 30, 30, ox + 520, 410]);
    const A = [A0[0] + off[0], A0[1] + off[1]], B = [B0[0] + off[0], B0[1] + off[1]];
    const nA = northLine(svg, A, 90, { dash: null, size: 18 }), nB = hid(northLine(svg, B, 90, { dash: null, size: 18 }));
    void nA;
    dotAt(svg, A, 6); dotAt(svg, B, 6); T(svg, ...at(A, d - 90, 24), 'A', { size: 22 }); T(svg, ...at(B, d - 90, 24), 'B', { size: 22 });
    const path = hid(seg(svg, A, B, { color: RED, width: 4 }));
    const aA = sweepArc(svg, A, 40, 90, -b, RED, 3), lA = hid(T(svg, ...at(A, 90 - b / 2, 64), BT(b) + '°', { size: 20, color: RED }));
    const mk = (p) => { const g = svgEl('g', {}, svg); const q = [p[0], p[1] - 52]; P(g, `M${P2([q[0] - 7, q[1] + 6])}L${P2(q)}L${P2([q[0] + 7, q[1] + 6])}`, { color: SLATE, width: 2.6 }); return hid(g); };
    const m1 = mk(A), m2 = mk(B);
    const fwd = hid(seg(svg, B, at(B, d, 70), { color: RED, width: 3, dash: '8 6' }));
    const half = sweepArc(svg, B, 38, d, 180, PURPLE, 3), lh = hid(T(svg, ...at(B, d + 90, 62), '180°', { size: 20, color: PURPLE }));
    const bk = n360(b + 180), ret = hid(seg(svg, B, at(B, d + 180, 110), { color: BLUE, width: 4 }));
    const aB = sweepArc(svg, B, 64, 90, -bk, BLUE, 3), lB = hid(T(svg, ...at(B, 90 - bk / 2, 90), BT(bk) + '°', { size: 20, color: BLUE }));
    const pn = panel(stage, ox + 560, 40, 330);
    const L1 = pn.line(`A to B: <b>${BT(b)}°</b>`), L2 = pn.line('north lines are <b>parallel</b>'), L3 = pn.line('turn around: <b>half a turn = 180°</b>'),
      L4 = pn.line(tex(`${BT(b)}^\\circ${b < 180 ? '+' : '-'}180^\\circ=${BT(bk)}^\\circ`), 'u5l4-res');
    return [
      { cap: `Walk from A to B on a bearing of <b>${BT(b)}°</b>.`, run: async (c) => { await sweep(c, aA, 900); await c.pop(lA); path.style.opacity = 1; await drawIn(path, 800, c); await show(c, L1); } },
      { cap: 'At B, draw a north line. Every north line points the same way: they are <b>parallel</b>.', run: async (c) => { await show(c, nB); await show(c, m1); await show(c, m2); await show(c, L2); } },
      { cap: 'Facing on along the path, turn around to face A: <b>half a turn, 180°</b>.', run: async (c) => { await show(c, fwd); await sweep(c, half, 900); await c.pop(lh); await show(c, ret); await show(c, L3); } },
      { cap: `So the bearing back is ${BT(b)}° ${b < 180 ? '+' : '−'} 180° = <b>${BT(bk)}°</b>.`, run: async (c) => { await dim(c, fwd, 0.2); await sweep(c, aB, 1000); await c.pop(lB); await c.pop(L4); } }
    ];
  }
};

mountExplainers({ referents, build, estimate, scales, ladder, sketch, bearing, map, back, whyBack });

/* ======================================================================================
 * Static figures
 * ====================================================================================== */
function strip() {
  const host = document.getElementById('u5l4-strip'); if (!host) return;
  const svg = svgEl('svg', { width: 500, height: 330, viewBox: '0 0 500 330' }, host);
  const NM = { 22.5: 'fold twice', 30: 'one hour mark', 45: 'fold once', 60: 'two hour marks', 90: 'paper corner', 180: 'straight line' };
  const cells = [[22.5, 20, 130], [30, 185, 130], [45, 345, 130], [60, 20, 300], [90, 200, 300]];
  for (const [a, x, y] of cells) {
    const V = [x + 8, y];
    Geo.angle(svg, { vertex: V, a1: 0, a2: a, len: 115, r: a < 40 ? 64 : 40, width: 3.4 });
    Geo.text(svg, V[0] + 60, y + 18, a + '°', { size: 22, color: BRAND });
    Geo.text(svg, V[0] + 62, y + 40 - 0, NM[a], { size: 15, color: GREY, halo: false });
  }
  const V = [418, 300];
  Geo.angle(svg, { vertex: V, a1: 0, a2: 180, len: 70, r: 36, width: 3.4 });
  Geo.text(svg, V[0], V[1] + 18, '180°', { size: 22, color: BRAND });
  Geo.text(svg, V[0], V[1] + 40, NM[180], { size: 15, color: GREY, halo: false });
}
function ex2() {
  const host = document.getElementById('u5l4-ex2'); if (!host) return;
  const k = 62, X = (x) => 40 + x * k, Y = (y) => 20 + (2.35 - y) * k;
  const svg = svgEl('svg', { width: 940, height: 270, viewBox: '0 0 940 270' }, host);
  const A = [['A', 0, 0, 10, 35, 2.2, -0.3, -0.3], ['B', 4.5, 0.2, -20, 115, 2, -0.25, -0.35], ['C', 8.6, 1.3, 290, 70, 2, -0.35, 0.1], ['D', 13.2, 0.4, 100, 160, 1.9, 0.3, 0.25]];
  for (const [n, x, y, s, m, L, dx, dy] of A) {
    Geo.angle(svg, { vertex: [X(x), Y(y)], a1: s, a2: s + m, len: L * k, width: 3.2, r: 30 });
    Geo.text(svg, X(x + dx), Y(y + dy), n, { size: 24 });
  }
}
function ex3() {
  for (const [id, d] of [['u5l4-ex3a', SC.a], ['u5l4-ex3b', SC.b]]) {
    const host = document.getElementById(id); if (!host) continue;
    const V = [220, 215];
    const Pt = Geo.protractor(host, { width: 440, height: 320, r: 170, cx: V[0], cy: V[1], rot: d.rot, angle: { vertex: V, a1: d.a1, a2: d.a2, len: 200 }, buttons: false, readout: false, snap: false });
    Pt.g.style.pointerEvents = 'none'; Pt.el.querySelectorAll('.geo-drag').forEach((e) => e.classList.remove('geo-drag'));
    Pt.g.removeAttribute('data-tap'); Pt.el.querySelectorAll('.geo-knob').forEach((e) => { e.style.display = 'none'; }); Pt.g.querySelectorAll('[data-tap]').forEach((e) => e.removeAttribute('data-tap'));
  }
}
function ex4() {
  const host = document.getElementById('u5l4-ex4'); if (!host) return;
  const svg = svgEl('svg', { width: 460, height: 270, viewBox: '0 0 460 270' }, host);
  [['P', 40, 75], ['Q', 250, 55]].forEach(([n, wx, th]) => {
    const gy = 228, L = 205;
    svgEl('rect', { x: wx - 16, y: 14, width: 16, height: gy - 14, fill: '#e6dfd2', stroke: SLATE, 'stroke-width': 1.6 }, svg);
    for (let y = 22; y < gy; y += 16) seg(svg, [wx - 16, y + 12], [wx, y], { color: LIGHT, width: 1.1 });
    seg(svg, [wx - 24, gy], [wx + 190, gy], { color: INK, width: 3 });
    const F = [wx + L * Math.cos(th * RAD), gy], Tp = [wx, gy - L * Math.sin(th * RAD)];
    svgEl('path', { d: ladderPath(F, Tp, 6, 24), fill: 'none', stroke: '#7a808b', 'stroke-width': 3.6, 'stroke-linecap': 'round' }, svg);
    P(svg, arcD(F, 30, 180 - th, th), { color: RED, width: 2.4 });
    Geo.text(svg, wx + 80, gy + 24, 'Ladder ' + n, { size: 18 });
  });
}
function minis() {
  const POS = { 45: [40, 92], 150: [92, 86], 20: [30, 86], 240: [86, 44] };
  document.querySelectorAll('.u5l4-mini[data-sk]').forEach((el) => {
    const a = Number(el.dataset.sk), svg = svgEl('svg', { width: 170, height: 112, viewBox: '0 0 170 112' }, el);
    Geo.angle(svg, { vertex: POS[a], a1: 0, a2: a, len: a > 180 ? 64 : 75, reflex: a > 180, width: 3, r: a > 180 ? 20 : a < 30 ? 50 : 26, label: dg(a), size: 16, labelR: a > 180 ? 34 : a < 30 ? 96 : undefined });
  });
}
function rose() {
  const host = document.getElementById('u5l4-rose'); if (!host) return;
  const R = Geo.compassRose(host, { width: 380, height: 380, points: 16, r: 128 });
  const sv = R.svg, C = R.C, a = sweepArc(sv, C, R.R * 0.42, 86, -70, RED, 2.6); a.set(1);
  Geo.text(sv, ...at(C, 52, R.R * 0.62), 'clockwise', { size: 14, color: RED });
}
function ex7() {
  const host = document.getElementById('u5l4-ex7'); if (!host) return;
  const svg = svgEl('svg', { width: 960, height: 250, viewBox: '0 0 960 250' }, host);
  Object.entries(DRAW7).forEach(([k, b], i) => {
    const x0 = 20 + i * 238, Pp = [x0 + 115, 150];
    northLine(svg, Pp, 95, { dash: null, color: INK, size: 16 });
    dotAt(svg, Pp, 5.5); Geo.text(svg, Pp[0] - 42, Pp[1] + 6, 'P', { size: 20 });
    Geo.text(svg, x0 + 22, 30, `(${k})`, { size: 20 });
    Geo.text(svg, x0 + 40, 226, BT(b) + '°', { size: 22, color: BRAND });
    const g = svgEl('g', { class: 'u5l4-fa' }, svg);
    seg(g, Pp, at(Pp, B2D(b), 95), { color: RED, width: 3.4 });
    P(g, arcD(Pp, 30, 90, -b), { color: RED, width: 2.2 });
  });
}
function ex8() {
  const host = document.getElementById('u5l4-ex8'); if (!host) return;
  const k = 68, X = (x) => 12 + (x + 0.9) * k, Y = (y) => 12 + (2.9 - y) * k;
  const W = Math.ceil(6.3 * k + 24), H = Math.ceil(4.8 * k + 24);
  const svg = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}` }, host);
  svgEl('rect', { x: 12, y: 12, width: 6.3 * k, height: 4.8 * k, fill: '#f4f7ef', stroke: '#b8c2a8', 'stroke-width': 2 }, svg);
  const q = (n) => [X(MAPPT[n][0]), Y(MAPPT[n][1])];
  svgEl('path', { d: `M${['P', 'B', 'L', 'K'].map((n) => P2(q(n))).join('L')}`, fill: 'none', stroke: GREY, 'stroke-width': 2.2, 'stroke-dasharray': '8 6' }, svg);
  const off = { P: [-16, 2], B: [-14, -14], L: [16, 0], K: [0, 18] };
  ['P', 'B', 'L', 'K'].forEach((n) => { const p = q(n); seg(svg, p, [p[0], p[1] - 0.9 * k], { color: GREY, width: 1.6, dash: '2 4' }); dotAt(svg, p, 5); Geo.text(svg, p[0] + off[n][0], p[1] + off[n][1], n, { size: 20 }); });
  northLine(svg, [X(4.9), Y(1.6)], 0.8 * k, { dash: null, color: INK, size: 16 });
  const g = svgEl('g', { class: 'u5l4-fa' }, svg); seg(g, q('K'), q('P'), { color: RED, width: 3, dash: '7 5' });
}

/* ======================================================================================
 * Hands-on tools: estimate-then-measure protractor; a compass you point
 * ====================================================================================== */
function ptTool() {
  const host = document.getElementById('u5l4-pt'); if (!host) return;
  Geo.protractor(host, { width: 920, height: 430, r: 200, cx: 250, angle: { vertex: [640, 310], a1: 20, a2: 77 }, hidden: true });
}
const POINTS16 = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
function compassTool() {
  const host = document.getElementById('u5l4-compass'); if (!host) return;
  const wrap = h('div', 'u5l4-ctool'); host.appendChild(wrap);
  const left = h('div'); wrap.appendChild(left);
  const R = Geo.compassRose(left, { width: 420, height: 420, points: 16, r: 140, degrees: true, bearing: 60 });
  const right = h('div'); wrap.appendChild(right);
  const read = h('div', 'u5l4-cread'); right.appendChild(read);
  const row = h('div', 'geo-btns'); right.appendChild(row);
  let b = 60, hidden = false, snapI = 0, showBack = false;
  const SNAPS = [5, 22.5, 1], SNAPL = ['Snap: 5°', 'Snap: 22.5°', 'Snap: 1°'];
  const render = () => {
    const pt = Math.abs(b / 22.5 - Math.round(b / 22.5)) < 1e-6 ? POINTS16[Math.round(b / 22.5) % 16] : '';
    const bk = n360(b + 180);
    read.innerHTML = hidden ? 'Bearing: <b class="u5l4-cbig">???°</b><span class="muted">Say it first, then tap Hide the bearing.</span>'
      : `Bearing: <b class="u5l4-cbig">${BT(b)}°</b>${pt ? `<span class="u5l4-cpt">${pt}</span><br>` : ''}${b < 180 ? 'east side of north' : b === 180 ? 'due south' : `west side: ${tex(`360^\\circ-${fd(b)}^\\circ=${fd(360 - b)}^\\circ`)} from north`}${showBack ? `<br><span class="u5l4-cback">bearing back: <b>${BT(bk)}°</b></span>` : ''}`;
  };
  const set = (v) => { b = n360(Math.round(v / SNAPS[snapI]) * SNAPS[snapI]); R.set(b); if (showBack) R.back({ fast: true, check() {}, anim() { return Promise.resolve(); } }); render(); };
  const B = (label, fn, pressed) => { const bt = h('button', 'pill small', label); bt.type = 'button'; if (pressed != null) bt.setAttribute('aria-pressed', String(pressed)); bt.onclick = () => fn(bt); row.appendChild(bt); return bt; };
  B('Hide the bearing', (bt) => { hidden = !hidden; bt.setAttribute('aria-pressed', String(hidden)); render(); }, false);
  const sb = B(SNAPL[0], () => { snapI = (snapI + 1) % 3; sb.textContent = SNAPL[snapI]; set(b); });
  B('Bearing back', (bt) => { showBack = !showBack; bt.setAttribute('aria-pressed', String(showBack)); if (showBack) R.back(liveCtx(), { ms: 900 }); else R.set(b); render(); }, false);
  B('Random', () => set(Math.floor(Math.random() * 72) * 5));
  const svg = R.svg; svg.setAttribute('data-tap', ''); svg.classList.add('geo-drag'); svg.style.touchAction = 'none';
  let drag = null;
  const toB = (e) => { const p = Geo.svgPoint(svg, e); return n360(90 - dirTo(R.C, p)); };
  svg.addEventListener('pointerdown', (e) => { if (e.pointerType === 'mouse' && e.button !== 0) return; e.preventDefault(); e.stopPropagation(); drag = e.pointerId; try { svg.setPointerCapture(e.pointerId); } catch (er) { /* ignore */ } set(toB(e)); });
  svg.addEventListener('pointermove', (e) => { if (drag !== e.pointerId) return; set(toB(e)); });
  const up = (e) => { if (drag === e.pointerId) drag = null; };
  svg.addEventListener('pointerup', up); svg.addEventListener('pointercancel', up);
  render();
}

strip(); ex2(); ex3(); ex4(); minis(); rose(); ex7(); ex8(); ptTool(); compassTool();

/* ======================================================================================
 * Stand Up Break
 * ====================================================================================== */
const BUILDS = { 225: ['180^\\circ+45^\\circ', 'reflex'], 315: ['360^\\circ-45^\\circ', 'reflex'], 240: ['180^\\circ+60^\\circ', 'reflex'], 202.5: ['180^\\circ+22.5^\\circ', 'reflex'],
  337.5: ['360^\\circ-22.5^\\circ', 'reflex'], 52.5: ['30^\\circ+22.5^\\circ', 'acute'], 82.5: ['60^\\circ+22.5^\\circ', 'acute'], 292.5: ['270^\\circ+22.5^\\circ', 'reflex'], 165: ['180^\\circ-15^\\circ', 'obtuse'] };
const MAIN = { north: 0, east: 90, south: 180, west: 270 };
const NEXT = { north: ['east', 'west'], east: ['south', 'north'], south: ['west', 'east'], west: ['north', 'south'] };
standup('u5l4', {
  intro: 'Sketch it first. Write every step. Bearings get 3 digits.',
  levels: {
    BEG: (r) => {
      const n = r.pick([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]), k = Math.min(n, 12 - n);
      return { text: `Find the smaller angle between the hands of a clock at <b>${n}:00</b>.`, q: '', a: [n > 6 ? `\\text{the short way: }${k}\\text{ hour marks}` : `${k}\\text{ hour mark${k > 1 ? 's' : ''}}`, `${k}\\times30^\\circ=${k * 30}^\\circ`] };
    },
    PRG: (r) => {
      const a = r.pick(Object.keys(BUILDS).map(Number)), [e, t] = BUILDS[a];
      return { text: `Build <b>${dg(a)}</b> from referents. Then name its type.`, q: '', a: [`${fd(a)}^\\circ=${e}`, `\\text{${t}}`] };
    },
    MAS: (r) => r.pick([
      () => {
        const m = r.pick(Object.keys(MAIN)), [cwd, ccwd] = NEXT[m], cw = r.chance(0.5), toward = cw ? cwd : ccwd, t = r.pick([5, 10, 25, 35, 45, 55, 65, 70, 80]);
        const mb = MAIN[m], res = n360(mb + (cw ? t : -t));
        const eq = cw ? `${BT(mb)}^\\circ+${t}^\\circ=${BT(res)}^\\circ` : mb === 0 ? `360^\\circ-${t}^\\circ=${BT(res)}^\\circ` : `${BT(mb)}^\\circ-${t}^\\circ=${BT(res)}^\\circ`;
        return { text: `Write <b>${t}° ${toward} of ${m}</b> as a true bearing.`, q: '', a: [`\\text{face ${m} }(${BT(mb)}^\\circ)\\text{, turn ${cw ? 'clockwise: add' : 'counterclockwise: subtract'}}`, eq] };
      },
      () => {
        const b = r.int(1, 71) * 5; if (b === 180) return { text: 'Find the bearing back for <b>180°</b>.', q: '', a: ['180^\\circ-180^\\circ=000^\\circ'] };
        const bk = b < 180 ? b + 180 : b - 180;
        return { text: `A canoe leaves the dock on a bearing of <b>${BT(b)}°</b>. On what bearing does it paddle back?`, q: '', a: [`${BT(b)}^\\circ${b < 180 ? '<180^\\circ\\text{: add}' : '>180^\\circ\\text{: subtract}'}`, `${BT(b)}^\\circ${b < 180 ? '+' : '-'}180^\\circ=${BT(bk)}^\\circ`] };
      }
    ])()
  }
});
