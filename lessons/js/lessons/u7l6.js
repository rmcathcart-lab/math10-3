/* Math 10-3 · Unit 7 · Lesson 6 — The Cosine Ratio.
 * Explainers (Class view unless marked Full): three similar triangles keep adj ÷ hyp (Example 1 check, 45° and 60°),
 * labelling from θ with the tags jumping when θ moves (Example 2 check), the floor ruler that reads cos θ as the angle
 * grows (Example 3 check), why cos 20° = sin 70° (Full), finding the adj (Example 4 checks), finding the hyp (Example 5
 * checks, and the "multiplied by mistake" verdict), the bar model for × and ÷ (Full), the SOH CAH TOA chooser (Example 6
 * checks), and the grain auger (Example 7). Also the hands-on similarRights table (geo.js), the hands-on ratio chooser,
 * the static figures and the Stand Up Break. */
import { h, add, tex, svgEl, tween, anim, drawIn, stamp, stampIn, pulse, mountExplainers, liveCtx } from '../blocks.js';
import { Geo } from '../geo.js';
import { standup } from '../standup.js';

const A_ = Geo.at, arcD = Geo.arcD;
const INK = '#1c2230', GREEN = '#12805a', RED = '#c93a33', AMBER = '#c27a0e', PURPLE = '#7b4fc4', GREY = '#9aa0ab', SLATE = '#4b5263';
const RC = Geo.ROLE_COLORS, OPP = RC.opp, ADJ = RC.adj, HYP = RC.hyp;
const T = (s) => tex(String(s));
const RAD = Math.PI / 180;
const cosd = (d) => Math.cos(d * RAD), sind = (d) => Math.sin(d * RAD), tand = (d) => Math.tan(d * RAD);
const f4 = (v) => v.toFixed(4);
const r1 = (v) => (Math.round(v * 10 + 1e-9) / 10).toFixed(1);
/** "13.24…": two decimals then dots, like the booklet */
const dots = (v, d = 2) => v.toFixed(d) + '\\ldots';
/** the calculator display: 9 or 10 significant digits like the TI-30XIIS */
const disp = (v) => String(parseFloat(v.toPrecision(10)));
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const stageSvg = (stage, W, H) => add(stage, svgEl('svg', { class: 'u7l6-svg', width: W, height: H, viewBox: `0 0 ${W} ${H}` }), 0, 0);
const figSvg = (host, W, H) => { host.style.width = W + 'px'; host.style.height = H + 'px'; return svgEl('svg', { class: 'geo-svg u7l6-svg', width: W, height: H, viewBox: `0 0 ${W} ${H}` }, host); };
/** an HTML label centred on (x, y): a 0×0 holder (so c.pop's scale doesn't undo the centring) */
function lab(host, html, x, y, cls = '') {
  const hold = h('div', 'u7l6-hold'); hold.appendChild(h('div', 'u7l6-lab ' + cls, html)); add(host, hold, x, y); hold.inner = hold.firstChild; return hold;
}
function line(parent, P, Q, o = {}) {
  return svgEl('line', { x1: P[0].toFixed(2), y1: P[1].toFixed(2), x2: Q[0].toFixed(2), y2: Q[1].toFixed(2), stroke: o.color || INK, 'stroke-width': o.width || 3.2, 'stroke-linecap': o.cap || 'round', 'stroke-dasharray': o.dash || null, class: o.cls === undefined ? 'bk-stroke' : o.cls, opacity: o.opacity ?? null }, parent);
}
function path(parent, d, o = {}) {
  return svgEl('path', { d, fill: o.fill || 'none', 'fill-opacity': o.fo ?? null, stroke: o.stroke === undefined ? INK : o.stroke, 'stroke-width': o.width || 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-dasharray': o.dash || null, class: o.cls === undefined ? 'bk-stroke' : o.cls, opacity: o.opacity ?? null }, parent);
}
const polyD = (pts, closed = true) => 'M' + pts.map((p) => p[0].toFixed(2) + ' ' + p[1].toFixed(2)).join('L') + (closed ? 'Z' : '');
const txt = (parent, x, y, s, o = {}) => Geo.text(parent, x, y, s, Object.assign({ size: 21 }, o));
/** a small right-angle square at V, along unit directions u and v (screen) */
function rmark(parent, V, u, v, s = 15, o = {}) {
  return path(parent, polyD([[V[0] + u[0] * s, V[1] + u[1] * s], [V[0] + (u[0] + v[0]) * s, V[1] + (u[1] + v[1]) * s], [V[0] + v[0] * s, V[1] + v[1] * s]], false), { width: o.width || 2.2, stroke: o.color || INK, cls: '' });
}
const unit = (P, Q) => { const d = Math.hypot(Q[0] - P[0], Q[1] - P[1]) || 1; return [(Q[0] - P[0]) / d, (Q[1] - P[1]) / d]; };
/** a key-press strip like the booklet: tokens → <kbd>s, then the screen */
function keysHTML(seq, out) {
  const k = seq.split(' ').map((t) => (/^[0-9.]+$/.test(t) ? t : `<kbd>${t === '√' ? '2nd</kbd><kbd>√' : t}</kbd>`)).join(' ');
  return `<span class="keys">${k}</span><span class="u7l6-scr">${out}</span>`;
}
/** a column of working lines (HTML) that pop in one at a time */
function workCol(stage, x, y, gap = 58) {
  let yy = y;
  return {
    line(html, cls = '', dy) { const e = hide(h('div', 'u7l6-wl ' + cls, html)); add(stage, e, x, yy); yy += dy ?? gap; return e; },
    skip(d) { yy += d; }, get y() { return yy; }
  };
}
/** a little pill between two working lines: "× 15 on both sides" */
const notePill = (stage, html, x, y) => hide(add(stage, h('div', 'u7l6-note', html), x, y));
/** a rightTri's px per unit and helpers */
function triInfo(R) {
  const px = Math.hypot(R.V.A[0] - R.V.C[0], R.V.A[1] - R.V.C[1]) / R.sides.b;
  return { px };
}
/** a rightTri drawn with the angle at A marked but not yet "theta" (no role tags until setTheta) */
function triFor(host, o) {
  return Geo.rightTri(host, Object.assign({ names: false, show: ['opp', 'adj', 'hyp'], colors: true, thetaLabel: o.thetaLabel || '' }, o));
}
/** a ring around an SVG element's box (bbox read when the step runs) */
function ringAround(parent, els, o = {}) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  els.filter(Boolean).forEach((e) => { const b = e.getBBox(); if (!b.width && !b.height) return; x0 = Math.min(x0, b.x); y0 = Math.min(y0, b.y); x1 = Math.max(x1, b.x + b.width); y1 = Math.max(y1, b.y + b.height); });
  if (!isFinite(x0)) return null;
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, rx = (x1 - x0) / 2 + 12, ry = (y1 - y0) / 2 + 9;
  const g = svgEl('g', {}, parent);
  svgEl('ellipse', { cx, cy, rx, ry, fill: 'none', stroke: o.color || INK, 'stroke-width': 3, 'stroke-dasharray': o.dash || null, class: 'bk-stroke' }, g);
  if (o.word) { const t = txt(g, cx, cy - ry - 13, o.word, { size: 16, color: o.color || INK, weight: 800 }); t.style.letterSpacing = '.06em'; }
  return g;
}

/* ======================================================================================
 * static scenes (used on the cards and in the explainers)
 * ====================================================================================== */
/** the ladder against a wall (Example 4b). Returns the points. s = px per foot */
function ladderScene(svg, F, s, o = {}) {
  const L = 24, th = 75, d = L * cosd(th), hh = L * sind(th);
  const W = [F[0] + d * s, F[1]], Tp = [F[0] + d * s, F[1] - hh * s];
  svgEl('rect', { x: W[0], y: F[1] - (hh + 2.2) * s, width: 22, height: (hh + 2.2) * s, fill: '#e6dccb', stroke: '#7a5124', 'stroke-width': 2.5 }, svg);
  for (let y = F[1] - 18; y > F[1] - (hh + 2) * s; y -= 18) line(svg, [W[0], y], [W[0] + 22, y - 10], { width: 1.4, color: '#b9ab92', cls: '' });
  line(svg, [F[0] - 40, F[1]], [W[0] + 60, F[1]], { width: 3.4, cls: '' });
  for (let x = F[0] - 36; x < W[0] + 60; x += 14) line(svg, [x, F[1]], [x - 8, F[1] + 10], { width: 1.4, color: GREY, cls: '' });
  // the ladder: two rails and rungs
  const u = unit(F, Tp), n = [-u[1], u[0]], g = svgEl('g', {}, svg);
  [-5, 5].forEach((k) => line(g, [F[0] + n[0] * k, F[1] + n[1] * k], [Tp[0] + n[0] * k, Tp[1] + n[1] * k], { width: 3.2, color: '#8a5a1c', cls: '' }));
  for (let t = 0.08; t < 1; t += 0.09) { const P = [F[0] + (Tp[0] - F[0]) * t, F[1] + (Tp[1] - F[1]) * t]; line(g, [P[0] - n[0] * 5, P[1] - n[1] * 5], [P[0] + n[0] * 5, P[1] + n[1] * 5], { width: 2.2, color: '#a8763a', cls: '' }); }
  rmark(svg, W, [-1, 0], [0, -1], 13);
  path(svg, arcD(F, 30, 0, th), { width: 2.4, stroke: AMBER, cls: '' });
  txt(svg, ...A_(F, 37, 52), '75°', { size: 18, color: AMBER });
  if (o.labels !== false) {
    txt(svg, (F[0] + Tp[0]) / 2 - 34, (F[1] + Tp[1]) / 2, '24 ft', { size: 19 });
    txt(svg, (F[0] + W[0]) / 2, F[1] + 24, o.dLabel || 'd', { size: 20, color: RED, italic: !o.dLabel });
  }
  return { F, W, Tp, g };
}
/** the garage end wall and roof (Example 5b); s = px per metre */
function garageScene(svg, M, s, o = {}) {
  const half = 3.6, rise = half * tand(26), wallH = 2.6;
  const L = [M[0] - half * s, M[1]], R = [M[0] + half * s, M[1]], P = [M[0], M[1] - rise * s];
  svgEl('rect', { x: L[0], y: M[1], width: 2 * half * s, height: wallH * s, fill: '#f6efe2', stroke: INK, 'stroke-width': 2.6 }, svg);
  svgEl('rect', { x: M[0] - 0.9 * s, y: M[1] + 0.6 * s, width: 1.8 * s, height: (wallH - 0.6) * s, fill: '#dfe3ea', stroke: INK, 'stroke-width': 2 }, svg);
  for (let k = 1; k < 5; k++) line(svg, [M[0] - 0.9 * s, M[1] + 0.6 * s + k * (wallH - 0.6) * s / 5], [M[0] + 0.9 * s, M[1] + 0.6 * s + k * (wallH - 0.6) * s / 5], { width: 1.2, color: GREY, cls: '' });
  path(svg, polyD([L, P, R]), { fill: '#f1e2c8', width: 3, cls: '' });
  line(svg, P, M, { width: 2, dash: '6 5', color: SLATE, cls: '' });
  rmark(svg, M, [-1, 0], [0, -1], 12);
  path(svg, arcD(L, 34, 0, 26), { width: 2.4, stroke: AMBER, cls: '' });
  txt(svg, ...A_(L, 13, 56), '26°', { size: 17, color: AMBER });
  const y2 = M[1] + wallH * s + 22;
  line(svg, [L[0], y2], [R[0], y2], { width: 1.8, color: SLATE, cls: '' });
  [L[0], R[0]].forEach((x) => line(svg, [x, y2 - 7], [x, y2 + 7], { width: 1.8, color: SLATE, cls: '' }));
  txt(svg, M[0], y2, '7.2 m', { size: 18, color: SLATE });
  if (o.labels !== false) txt(svg, ...A_([(L[0] + P[0]) / 2, (L[1] + P[1]) / 2], 116, 20), 'r', { size: 21, color: RED, italic: true });
  return { L, R, P, M };
}
/** the grain auger leaning on a bin (Example 7); s = px per metre */
function augerScene(svg, F, s, o = {}) {
  const th = 32, d = 16 * cosd(th), hh = 16 * sind(th), C = [F[0] + d * s, F[1]], P = [C[0], F[1] - hh * s];
  const bw = 4.4 * s, bh = 11 * s;
  svgEl('rect', { x: C[0], y: F[1] - bh, width: bw, height: bh, fill: '#e3e7ee', stroke: INK, 'stroke-width': 2.4 }, svg);
  for (let y = F[1] - 12; y > F[1] - bh; y -= 12) line(svg, [C[0], y], [C[0] + bw, y], { width: 1, color: '#c3c9d3', cls: '' });
  path(svg, polyD([[C[0] - 4, F[1] - bh], [C[0] + bw / 2, F[1] - bh - 1.8 * s], [C[0] + bw + 4, F[1] - bh]]), { fill: '#cfd5df', width: 2.4, cls: '' });
  line(svg, [F[0] - 34, F[1]], [C[0] + bw + 30, F[1]], { width: 3.4, cls: '' });
  for (let x = F[0] - 30; x < C[0] + bw + 30; x += 14) line(svg, [x, F[1]], [x - 8, F[1] + 10], { width: 1.4, color: '#6f9a5a', cls: '' });
  const g = svgEl('g', {}, svg);
  line(g, F, P, { width: 9, color: '#b0702a', cls: '' });
  line(g, F, P, { width: 2, color: '#e8b97a', dash: '3 9', cls: '' });
  rmark(svg, C, [-1, 0], [0, -1], 13);
  path(svg, arcD(F, 40, 0, th), { width: 2.4, stroke: AMBER, cls: '' });
  txt(svg, ...A_(F, 15, 64), '32°', { size: 18, color: AMBER });
  const labs = {};
  if (o.labels !== false) {
    labs.hyp = txt(svg, ...A_([(F[0] + P[0]) / 2, (F[1] + P[1]) / 2], 122, 30), '16 m', { size: 19 });
    labs.adj = txt(svg, (F[0] + C[0]) / 2, F[1] + 24, o.d || 'd', { size: 20, color: o.d ? ADJ : RED, italic: !o.d });
    labs.opp = txt(svg, C[0] - 22, (F[1] + P[1]) / 2, o.h || 'h', { size: 20, color: o.h ? OPP : RED, italic: !o.h, anchor: 'end' });
  }
  return { F, C, P, g, labs };
}
/** Example 1: three nested triangles sharing the angle at A (s px per cm) */
function nested(svg, A, s, th, hyps, o = {}) {
  const els = [], u = [cosd(th), -sind(th)];
  const big = hyps[hyps.length - 1];
  const base = line(svg, A, [A[0] + (big * cosd(th) + 0.4) * s, A[1]], { width: 3, cls: o.anim ? 'bk-stroke' : '' });
  const hypL = line(svg, A, [A[0] + u[0] * (big + 0.35) * s, A[1] + u[1] * (big + 0.35) * s], { width: 3, cls: o.anim ? 'bk-stroke' : '' });
  hyps.forEach((hp, i) => {
    const B = [A[0] + u[0] * hp * s, A[1] + u[1] * hp * s], C = [B[0], A[1]], g = svgEl('g', {}, svg);
    line(g, B, C, { width: 3, cls: o.anim ? 'bk-stroke' : '' });
    rmark(g, C, [-1, 0], [0, -1], 11, { width: 1.8 });
    txt(g, B[0] - 6, B[1] - 16, `B${'₁₂₃'[i]}`, { size: 18 });
    txt(g, C[0], C[1] + 19, `C${'₁₂₃'[i]}`, { size: 18 });
    els.push({ g, B, C });
  });
  path(svg, arcD(A, 44, 0, th), { width: 2.2, stroke: AMBER, cls: '' });
  txt(svg, ...A_(A, th / 2, 64), th + '°', { size: 18, color: AMBER });
  txt(svg, A[0] - 16, A[1], 'A', { size: 20 });
  return { els, base, hypL };
}

/* ======================================================================================
 * 1. Three similar triangles: adj ÷ hyp stays the same (Example 1 check)
 * ====================================================================================== */
const MEAS = { 25: [2.7, 4.5, 6.3], 45: [2.1, 3.5, 4.9], 60: [1.5, 2.5, 3.5] };
const discover = {
  title: 'Same angle, same adj ÷ hyp',
  height: 400,
  minW: 980,
  choices: [{ sep: 'Example 1 check:' }, { v: 25, label: 'three triangles at 25°' }, { sep: 'Another angle:' }, { v: 45, label: '45°' }, { v: 60, label: '60°' }],
  ask: (v) => `Three right triangles share the ${T(v + '^\\circ')} angle at ${T('A')}. The hyps are 3, 5 and 7 cm. Find adj ÷ hyp for each one.`,
  make(stage, v, ex) {
    const W = ex.W, H = 400, svg = stageSvg(stage, W, H), ox = (W - 980) / 2;
    const hyps = [3, 5, 7], adj = MEAS[v], rat = adj.map((a, i) => a / hyps[i]);
    const s = Math.min(470 / (7 * cosd(v) + 0.5), 290 / (7 * sind(v) + 0.4)), A = [ox + 50, 325];
    const N = nested(svg, A, s, v, hyps, { anim: true });
    hide(N.base, N.hypL); N.els.forEach((e) => hide(e.g));
    const hl = N.els.map((e, i) => {
      const g = hide(svgEl('g', {}, svg));
      line(g, A, e.C, { width: 7, color: ADJ, opacity: 0.85 });
      line(g, A, e.B, { width: 7, color: HYP, opacity: 0.85 });
      const u = [cosd(v), -sind(v)], n = [u[1], -u[0]];   // normal pointing up-left of the hyp
      const mid = [(A[0] + e.B[0]) / 2 + n[0] * 22, (A[1] + e.B[1]) / 2 + n[1] * 22];
      txt(g, mid[0], mid[1], String(hyps[i]), { size: 19, color: HYP, weight: 800 });
      txt(g, (A[0] + e.C[0]) / 2, A[1] + 44, String(adj[i]), { size: 19, color: ADJ, weight: 800 });
      return g;
    });
    // the table
    const tx = ox + 556, tb = add(stage, h('div', 'u7l6-dt'), tx, 40);
    tb.innerHTML = `<div class="u7l6-dth">triangle</div><div class="u7l6-dth u7l6-adj">adj</div><div class="u7l6-dth u7l6-hyp">hyp</div><div class="u7l6-dth">adj ÷ hyp</div>` +
      hyps.map((hp, i) => `<div>${T(`AB_${i + 1}C_${i + 1}`)}</div><div class="u7l6-c" data-c="a${i}"></div><div class="u7l6-c" data-c="h${i}"></div><div class="u7l6-c u7l6-r" data-c="r${i}"></div>`).join('');
    const cell = (k) => tb.querySelector(`[data-c="${k}"]`);
    const st = hide(stamp(stage, 'all the same!', { ok: true, x: tx + 200, y: 250, size: 'sm' }));
    const nameTag = hide(lab(stage, `adj ÷ hyp ${T('=\\cos' + v + '^\\circ')}`, tx + 200, 308, 'u7l6-tag'));
    const calc = hide(add(stage, h('div', 'u7l6-wl u7l6-sm'), tx - 40, 350));
    calc.innerHTML = `calculator: ${keysHTML(`cos ${v} ) ENTER`, disp(cosd(v)))}`;
    const steps = [{ cap: `Three right triangles share the ${T(v + '^\\circ')} angle at ${T('A')}. Same angle, same shape: they are <b>similar</b>.`,
      run: async (c) => { await Promise.all([drawIn(N.base, 600, c), drawIn(N.hypL, 600, c)]); N.base.style.opacity = N.hypL.style.opacity = 1; for (const e of N.els) { e.g.style.opacity = 1; await drawIn(e.g, 450, c); } } }];
    hyps.forEach((hp, i) => steps.push({
      cap: `Triangle ${T(`AB_${i + 1}C_${i + 1}`)}: <b class="u7l6-adj">adj</b> = ${adj[i]} cm (it touches the angle), <b class="u7l6-hyp">hyp</b> = ${hp} cm. ${T(`${adj[i]}\\div${hp}=${rat[i].toFixed(2)}`)}`,
      run: async (c) => {
        hl.forEach((g, j) => { if (j !== i) g.style.opacity = 0; });
        hl[i].style.opacity = 1; await drawIn(hl[i], 600, c);
        cell('a' + i).textContent = adj[i]; cell('h' + i).textContent = hp; cell('r' + i).innerHTML = T(rat[i].toFixed(2));
        await c.pop(cell('r' + i));
      } }));
    steps.push({ cap: `All three are <b>${rat[0].toFixed(2)}</b>. The size of the triangle does not matter. Only the <b>angle</b> does.`,
      run: (c) => stampIn(c, st) });
    steps.push({ cap: v === 60 ? `This ratio has a name: the <b>cosine</b>. The calculator says ${T('\\cos60^\\circ=0.5')}, exactly half.`
      : `This ratio has a name: the <b>cosine</b>. The calculator says ${T(`\\cos${v}^\\circ=${f4(cosd(v))}`)}, very close to our measured ${rat[0].toFixed(2)}.`,
      run: async (c) => { await c.pop(nameTag); await c.fadeIn(calc); } });
    return steps;
  }
};

/* ======================================================================================
 * 2. Labelling from θ: the tags jump when θ moves (Example 2 check)
 * ====================================================================================== */
const labels = {
  title: 'Label the sides from the angle',
  height: 400,
  minW: 980,
  choices: [{ v: 'roles', label: 'move θ' }, { sep: 'Example 2 check:' }, { v: 'ex2', label: '∠A and ∠B' }],
  ask: (v) => (v === 'roles' ? 'Which side is the hyp, the opp and the adj? What changes when θ moves to the other angle?'
    : `In ${T('\\triangle ABC')}, ${T('\\angle C=90^\\circ')}. Find ${T('\\cos A')} and ${T('\\cos B')}.`),
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 980) / 2, isEx = v === 'ex2';
    const opts = isEx ? { a: 9, b: 40, right: 'bl', names: ['A', 'B', 'C'], sides: { a: '9', b: '40', c: '41' }, angles: { A: '', B: '' }, width: 480, height: 360, x: ox + 20, y: 20, pad: 62 }
      : { a: 3, b: 4.6, right: 'bl', names: ['A', 'B', 'C'], width: 480, height: 380, x: ox + 40, y: 10, pad: 70, long: true };
    const R = Geo.rightTri(stage, Object.assign({ show: ['opp', 'adj', 'hyp'], thetaLabel: 'θ' }, opts));
    const steps = [];
    if (!isEx) {
      const fA = hide(lab(stage, `${T('\\cos A=\\dfrac{\\color{#1f5bd6}\\text{adj}}{\\color{#9a6a24}\\text{hyp}}=\\dfrac{AC}{AB}')}`, ox + 760, 130, 'u7l6-eq'));
      const fB = hide(lab(stage, `${T('\\cos B=\\dfrac{\\color{#1f5bd6}\\text{adj}}{\\color{#9a6a24}\\text{hyp}}=\\dfrac{BC}{AB}')}`, ox + 760, 270, 'u7l6-eq'));
      const hT = hide(txt(R.svg, 0, 0, 'hypotenuse', { size: 16, color: HYP, weight: 800 }));
      const M = [(R.V.A[0] + R.V.B[0]) / 2, (R.V.A[1] + R.V.B[1]) / 2], nn = unit(R.V.C, M); hT.setAttribute('x', M[0] + nn[0] * 34); hT.setAttribute('y', M[1] + nn[1] * 34);
      steps.push({ cap: 'First find the <b>hyp</b>: across from the right angle. It is always the longest side.', run: async (c) => { await R.highlight(c, 'c', { color: HYP }); await c.pop(hT); } });
      steps.push({ cap: 'Now mark the angle θ at A. <b class="u7l6-opp">opp</b> is across from θ. <b class="u7l6-adj">adj</b> touches θ (and is not the hyp).', run: async (c) => { R.clearHighlight(); hT.style.opacity = 0; await R.setTheta(c, 'A'); } });
      steps.push({ cap: `So ${T('\\cos A')} is the blue side over the brown side.`, run: async (c) => { await R.highlight(c, 'adj'); await c.pop(fA); } });
      steps.push({ cap: 'Move θ to B. Watch the tags: <b>opp and adj swap</b>. The hyp stays where it is.', run: async (c) => { R.clearHighlight(); await R.setTheta(c, 'B', 900); } });
      steps.push({ cap: `Now the <b>other</b> leg is adj, so ${T('\\cos B')} uses the other leg. Always mark the angle first, then label.`, run: async (c) => { await R.highlight(c, 'adj'); await c.pop(fB); } });
      return steps;
    }
    // Example 2: the table
    const tx = ox + 545, tb = add(stage, h('div', 'u7l6-dt u7l6-dt2'), tx, 26);
    const rows = [['hyp', 'u7l6-hyp'], ['adj', 'u7l6-adj'], ['opp', 'u7l6-opp'], ['cos (fraction)', ''], ['cos (4 places)', '']];
    tb.innerHTML = `<div class="u7l6-dth"></div><div class="u7l6-dth">${T('\\angle A')}</div><div class="u7l6-dth">${T('\\angle B')}</div>` +
      rows.map(([r, cl], i) => `<div class="u7l6-dth ${cl}">${r}</div><div class="u7l6-c" data-c="A${i}"></div><div class="u7l6-c" data-c="B${i}"></div>`).join('');
    const cell = (k) => tb.querySelector(`[data-c="${k}"]`);
    const fill = async (c, keys, vals) => { for (let i = 0; i < keys.length; i++) { cell(keys[i]).innerHTML = vals[i]; await c.pop(cell(keys[i]), 300); } };
    steps.push({ cap: 'The <b class="u7l6-hyp">hyp</b> is across from the right angle at C: <b>41</b>. It is the same for both angles.', run: async (c) => { await R.highlight(c, 'c', { color: HYP }); await fill(c, ['A0', 'B0'], ['41', '41']); } });
    steps.push({ cap: 'For ∠A: the leg that touches A is <b class="u7l6-adj">40</b> (adj). The leg across from A is <b class="u7l6-opp">9</b> (opp).', run: async (c) => { R.clearHighlight(); await R.setTheta(c, 'A'); await fill(c, ['A1', 'A2'], ['40', '9']); } });
    steps.push({ cap: `${T('\\cos A=\\dfrac{40}{41}=0.97560\\ldots\\approx0.9756')}`, run: async (c) => { await R.highlight(c, 'adj'); await fill(c, ['A3', 'A4'], [T('\\frac{40}{41}'), '0.9756']); } });
    steps.push({ cap: 'For ∠B: the tags jump. Now <b class="u7l6-adj">9</b> touches the angle (adj) and <b class="u7l6-opp">40</b> is across from it (opp).', run: async (c) => { R.clearHighlight(); await R.setTheta(c, 'B', 900); await fill(c, ['B1', 'B2'], ['9', '40']); } });
    steps.push({ cap: `${T('\\cos B=\\dfrac{9}{41}=0.21951\\ldots\\approx0.2195')}. Same hyp, different adj.`, run: async (c) => { await R.highlight(c, 'adj'); await fill(c, ['B3', 'B4'], [T('\\frac{9}{41}'), '0.2195']); } });
    return steps;
  }
};

/* ======================================================================================
 * 3. The floor ruler: cos θ as the angle grows (Example 3 check)
 * ====================================================================================== */
const EX3 = [10, 25, 40, 55, 70, 85];
const meter = {
  title: 'The cosine as the angle grows',
  height: 420,
  minW: 980,
  choices: [{ v: 'sweep', label: 'sweep 0° to 90°' }, { sep: 'Example 3 check:' }, { v: 'ex3', label: 'the six angles' }],
  ask: (v) => (v === 'sweep' ? 'The hyp is always <b>1</b> long. What happens to the adj, and to cos θ, as the angle grows?'
    : `Example 3: find ${T('\\cos\\theta')} for ${T('10^\\circ,\\ 25^\\circ,\\ 40^\\circ,\\ 55^\\circ,\\ 70^\\circ,\\ 85^\\circ')}.`),
  make(stage, v, ex) {
    const W = ex.W, H = 420, ox = (W - 980) / 2, svg = stageSvg(stage, W, H);
    const A = [ox + 50, 330], L = 300;
    // quarter circle, floor and ruler
    path(svg, arcD(A, L, 0, 90), { width: 1.6, stroke: GREY, dash: '5 6', cls: '' });
    line(svg, [A[0] - 20, A[1]], [A[0] + L + 30, A[1]], { width: 2, color: SLATE, cls: '' });
    for (let k = 0; k <= 10; k++) { const x = A[0] + L * k / 10; line(svg, [x, A[1] + 8], [x, A[1] + (k % 5 ? 18 : 26)], { width: k % 5 ? 1.4 : 2.2, color: SLATE, cls: '' }); }
    [[0, '0'], [5, '0.5'], [10, '1']].forEach(([k, s]) => txt(svg, A[0] + L * k / 10, A[1] + 44, s, { size: 17, color: SLATE }));
    txt(svg, A[0] + L / 2, A[1] + 72, 'the floor is a ruler: hyp = 1', { size: 15, color: GREY });
    const opp = line(svg, A, A, { width: 3, color: OPP, dash: '7 6', cls: '' });
    const adj = line(svg, A, A, { width: 7, color: ADJ, cls: '' });
    const hyp = line(svg, A, A, { width: 6, color: HYP, cls: '' });
    const arc = path(svg, '', { width: 2.4, stroke: AMBER, cls: '' });
    const thT = txt(svg, 0, 0, '', { size: 18, color: AMBER });
    const rm = path(svg, '', { width: 1.8, cls: '' });
    const hT = txt(svg, 0, 0, 'hyp = 1', { size: 17, color: HYP, weight: 800 });
    const aT = txt(svg, 0, 0, '', { size: 17, color: ADJ, weight: 800 });
    svgEl('circle', { cx: A[0], cy: A[1], r: 5, fill: INK }, svg);
    // readout
    const rd = lab(stage, '', ox + 720, 70, 'u7l6-read');
    let tb = null;
    if (v === 'ex3') {
      tb = add(stage, h('div', 'u7l6-dt u7l6-dt3'), ox + 470, 140);
      tb.innerHTML = `<div class="u7l6-dth">${T('\\theta')}</div>` + EX3.map((d) => `<div class="u7l6-dth">${d}°</div>`).join('') + `<div class="u7l6-dth">${T('\\cos\\theta')}</div>` + EX3.map((d, i) => `<div class="u7l6-c" data-c="${i}"></div>`).join('');
    }
    const verdict = hide(lab(stage, `${T('0<\\cos\\theta<1')}`, ox + 720, v === 'ex3' ? 300 : 200, 'u7l6-tag'));
    let cur = 0;
    function set(d) {
      cur = d; const B = [A[0] + L * cosd(d), A[1] - L * sind(d)], C = [B[0], A[1]];
      [['x2', B[0]], ['y2', B[1]]].forEach(([k, val]) => hyp.setAttribute(k, val.toFixed(2)));
      adj.setAttribute('x2', C[0].toFixed(2)); adj.setAttribute('y2', C[1].toFixed(2));
      opp.setAttribute('x1', B[0].toFixed(2)); opp.setAttribute('y1', B[1].toFixed(2)); opp.setAttribute('x2', C[0].toFixed(2)); opp.setAttribute('y2', C[1].toFixed(2));
      arc.setAttribute('d', d > 0.5 ? arcD(A, 46, 0, d) : '');
      const tp = A_(A, d / 2, 66); thT.setAttribute('x', tp[0].toFixed(1)); thT.setAttribute('y', tp[1].toFixed(1)); thT.textContent = Math.round(d) + '°';
      const u = 12; rm.setAttribute('d', d > 3 && d < 87 ? `M${C[0] - u} ${C[1]}L${C[0] - u} ${C[1] - u}L${C[0]} ${C[1] - u}` : '');
      const hm = A_([(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], d + 90, 22); hT.setAttribute('x', hm[0].toFixed(1)); hT.setAttribute('y', hm[1].toFixed(1));
      aT.setAttribute('x', ((A[0] + C[0]) / 2).toFixed(1)); aT.setAttribute('y', (A[1] - 16).toFixed(1)); aT.textContent = (C[0] - A[0]) > 70 ? 'adj' : '';
      rd.inner.innerHTML = `${T(`\\cos${Math.round(d)}^\\circ=${f4(cosd(Math.round(d)))}`)}`;
    }
    const go = (c, to, ms) => { const from = cur; return tween(c, ms, (t) => set(from + (to - from) * t)); };
    set(v === 'ex3' ? 0.01 : 10);
    if (v === 'sweep') {
      return [
        { cap: 'A small angle, <b>10°</b>: the adj is almost as long as the hyp. The ruler reads about 0.98.', run: async (c) => { await anim(c, adj, [{ opacity: 1 }, { opacity: 0.3 }, { opacity: 1 }, { opacity: 0.3 }, { opacity: 1 }], 900); await c.pop(rd); } },
        { cap: `Open the angle to <b>60°</b>: the adj is exactly <b>half</b> of the hyp. ${T('\\cos60^\\circ=0.5')}`, run: (c) => go(c, 60, 1800) },
        { cap: `Almost straight up, <b>85°</b>: the adj is very short. ${T('\\cos85^\\circ=0.0872')}`, run: (c) => go(c, 85, 1300) },
        { cap: 'adj is a leg and hyp is the longest side, so adj ÷ hyp is always <b>between 0 and 1</b>. The bigger the angle, the <b>smaller</b> the cosine.', run: async (c) => { await go(c, 30, 900); await c.pop(verdict); } }
      ];
    }
    const steps = EX3.map((d, i) => ({
      cap: `${T(`\\cos${d}^\\circ`)}: ${keysHTML(`cos ${d} ) ENTER`, disp(cosd(d)))} ≈ <b>${f4(cosd(d))}</b>`,
      run: async (c) => { await go(c, d, i ? 700 : 900); const e = tb.querySelector(`[data-c="${i}"]`); e.textContent = f4(cosd(d)); await c.pop(e, 300); }
    }));
    steps.push({ cap: 'As the angle gets bigger, the adj gets shorter, so cos θ gets <b>smaller</b>. Every value is <b>between 0 and 1</b>.', run: async (c) => { await c.pop(verdict); } });
    return steps;
  }
};

/* ======================================================================================
 * 4. (Full) Why cos 20° = sin 70°
 * ====================================================================================== */
const cofn = {
  title: 'One side, two names',
  height: 380,
  minW: 980,
  choices: [{ v: 20, label: '20° and 70°' }, { v: 35, label: '35° and 55°' }],
  ask: (v) => `Why is ${T(`\\cos${v}^\\circ`)} the same as ${T(`\\sin${90 - v}^\\circ`)}?`,
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 980) / 2, o = { a: 4 * tand(v), b: 4, right: 'bl', names: false, width: 520, height: 370, x: ox, y: 4, thetaLabel: '' };
    const R = Geo.rightTri(stage, Object.assign({ show: ['opp', 'adj', 'hyp'] }, o));
    const G0 = [(R.V.A[0] + R.V.B[0] + R.V.C[0]) / 3, (R.V.A[1] + R.V.B[1] + R.V.C[1]) / 3];
    txt(R.g, ...A_(R.V.A, Geo.dirTo(R.V.A, G0), 92), v + '°', { size: 20, color: AMBER, weight: 800 });
    txt(R.g, ...A_(R.V.B, Geo.dirTo(R.V.B, G0), 80), (90 - v) + '°', { size: 20, color: AMBER, weight: 800 });
    const e1 = hide(lab(stage, `${T(`\\cos${v}^\\circ=\\dfrac{\\color{#1f5bd6}\\text{this side}}{\\text{hyp}}`)}`, ox + 770, 90, 'u7l6-eq'));
    const e2 = hide(lab(stage, `${T(`\\sin${90 - v}^\\circ=\\dfrac{\\color{#c93a33}\\text{this side}}{\\text{hyp}}`)}`, ox + 770, 200, 'u7l6-eq'));
    const st = hide(stamp(stage, `both ${f4(cosd(v))}`, { ok: true, x: ox + 770, y: 300, size: 'sm' }));
    return [
      { cap: `The two acute angles add to 90°: ${T(`${v}^\\circ+${90 - v}^\\circ=90^\\circ`)}.`, run: (c) => c.sleep(300) },
      { cap: `For the ${v}° angle, the bottom leg <b>touches</b> it: it is the <b class="u7l6-adj">adj</b>.`, run: async (c) => { await R.setTheta(c, 'A'); await R.highlight(c, 'adj'); await c.pop(e1); } },
      { cap: `For the ${90 - v}° angle, the <b>same leg</b> is across from it: now it is the <b class="u7l6-opp">opp</b>.`, run: async (c) => { R.clearHighlight(); await R.setTheta(c, 'B', 900); await R.highlight(c, 'opp'); await c.pop(e2); } },
      { cap: `Same side ÷ same hyp: ${T(`\\cos${v}^\\circ=\\sin${90 - v}^\\circ=${f4(cosd(v))}`)}. (“Co-sine” means the sine of the other angle.)`, run: (c) => stampIn(c, st) }
    ];
  }
};

/* ======================================================================================
 * 5. Finding the adjacent side (Example 4 checks)
 * ====================================================================================== */
const findAdj = {
  title: 'Finding the adj: multiply',
  height: 440,
  minW: 980,
  choices: [{ sep: 'Example 4 check:' }, { v: 'a', label: '(a) 28°, 15 cm' }, { v: 'b', label: '(b) the ladder' }],
  ask: (v) => (v === 'a' ? `Find ${T('x')} to the nearest tenth of a centimetre.`
    : 'A 24-foot ladder leans against a wall at 75° to the ground. How far from the wall is the bottom of the ladder? (nearest tenth of a foot)'),
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 980) / 2, isA = v === 'a';
    const th = isA ? 28 : 75, hy = isA ? 15 : 24, un = isA ? 'cm' : 'ft', x = isA ? 'x' : 'd', ans = hy * cosd(th);
    let R = null, sc = null, fig = null;
    if (isA) {
      R = triFor(stage, { a: 1.41, b: 2.65, right: 'br', rot: -90, sides: { b: 'x', c: '15 cm' }, angles: { A: '28°' }, thetaLabel: '28°', width: 440, height: 420, x: ox, y: 6 });
    } else {
      const svg = stageSvg(stage, 460, 440); svg.style.left = ox + 'px';
      sc = ladderScene(svg, [150, 390], 15);
      fig = svgEl('g', {}, svg);
    }
    const wc = workCol(stage, ox + 500, 28, 62);
    const l1 = wc.line(isA ? `${T('x')} is <b class="u7l6-adj">adj</b>, 15 cm is <b class="u7l6-hyp">hyp</b>` : `${T('d')} is <b class="u7l6-adj">adj</b>, 24 ft is <b class="u7l6-hyp">hyp</b>`);
    const l2 = wc.line(T(`\\cos${th}^\\circ=\\dfrac{${x}}{${hy}}`), 'u7l6-wbig', 78);
    const n3 = notePill(stage, `${T(`\\times${hy}`)} on both sides`, ox + 760, wc.y - 34);
    const l3 = wc.line(T(`${hy}\\times\\cos${th}^\\circ=${x}`), 'u7l6-wbig', 66);
    const l4 = wc.line(keysHTML(`${hy} × cos ${th} ) ENTER`, disp(ans)), '', 58);
    const l5 = wc.line(`${T(`${x}=${dots(ans)}\\approx${r1(ans)}`)} ${un}`, 'u7l6-wbig u7l6-wans', 70);
    const st = hide(stamp(stage, isA ? `13.2 < 15 ✓` : `24 ÷ 4 = 6 ✓`, { ok: true, x: ox + 800, y: 395, size: 'sm' }));
    const hlAdj = isA ? null : hide(line(fig, sc.F, sc.W, { width: 8, color: ADJ, opacity: 0.8 }));
    const hlHyp = isA ? null : hide(line(fig, sc.F, sc.Tp, { width: 14, color: HYP, opacity: 0.35 }));
    return [
      { cap: isA ? `<b>Step 1.</b> Label from the 28° angle. ${T('x')} touches it: <b class="u7l6-adj">adj</b>. 15 cm is across from the right angle: <b class="u7l6-hyp">hyp</b>.`
        : '<b>Step 1.</b> The ladder is across from the right angle: <b class="u7l6-hyp">hyp</b> (24 ft). The distance d along the ground touches the 75° angle: <b class="u7l6-adj">adj</b>.',
        run: async (c) => { if (isA) { await R.setTheta(c, 'A'); } else { hlHyp.style.opacity = 1; await drawIn(hlHyp, 500, c); hlAdj.style.opacity = 1; await drawIn(hlAdj, 500, c); } await c.fadeIn(l1); } },
      { cap: '<b>Step 2.</b> adj and hyp: use cos. Write the ratio and put in the numbers.', run: (c) => c.pop(l2) },
      { cap: `<b>Step 3.</b> ${T(x)} is on <b>top</b>. Multiply both sides by ${hy} to get ${T(x)} alone.`, run: async (c) => { await c.pop(n3); await c.fadeIn(l3); } },
      { cap: 'Calculator (DEG mode): keep all the digits for now.', run: (c) => c.fadeIn(l4) },
      { cap: `<b>Step 4.</b> Round at the end: ${T(`${x}\\approx${r1(ans)}`)} ${un}.`, run: (c) => c.pop(l5) },
      { cap: isA ? 'Check: the adj must be <b>shorter</b> than the hyp. 13.2 cm < 15 cm ✓'
        : 'Check: a safety rule puts the foot about ¼ of the ladder’s length from the wall: 24 ÷ 4 = 6 ft. Our 6.2 ft is close ✓',
        run: (c) => stampIn(c, st) }
    ];
  }
};

/* ======================================================================================
 * 6. Finding the hypotenuse (Example 5 checks, and the "multiplied by mistake" verdict)
 * ====================================================================================== */
const findHyp = {
  title: 'Finding the hyp: divide',
  height: 440,
  minW: 980,
  capH: 92,
  choices: [{ sep: 'Example 5 check:' }, { v: 'a', label: '(a) 41°, 8.5 m' }, { v: 'b', label: '(b) the garage rafter' }, { sep: 'Watch out:' }, { v: 'oops', label: 'multiplied by mistake' }],
  ask: (v) => (v === 'b' ? 'A garage is 7.2 m wide. Its roof rises from each wall to the middle at 26°. How long is each rafter r? (nearest tenth of a metre)'
    : v === 'oops' ? `A student finds ${T('x')} with ${T('x=8.5\\times\\cos41^\\circ')}. Is that right?` : `Find ${T('x')} to the nearest tenth of a metre.`),
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 980) / 2;
    if (v === 'b') {
      const svg = stageSvg(stage, 480, 440); svg.style.left = ox + 'px';
      const s = 52, G = garageScene(svg, [240, 190], s), ans = 3.6 / cosd(26);
      const fig = svgEl('g', {}, svg);
      const hlAdj = hide(line(fig, G.L, G.M, { width: 8, color: ADJ, opacity: 0.8 }));
      const hlHyp = hide(line(fig, G.L, G.P, { width: 14, color: HYP, opacity: 0.35 }));
      const halfT = hide(txt(fig, (G.L[0] + G.M[0]) / 2, G.M[1] + 22, '3.6 m', { size: 19, color: ADJ, weight: 800 }));
      const wc = workCol(stage, ox + 510, 24, 60);
      const l1 = wc.line(`adj ${T('=7.2\\div2=3.6')} m`);
      const l2 = wc.line(T('\\cos26^\\circ=\\dfrac{3.6}{r}'), 'u7l6-wbig', 76);
      const l3 = wc.line(T('r\\times\\cos26^\\circ=3.6'), 'u7l6-wbig', 60);
      const l4 = wc.line(T('r=3.6\\div\\cos26^\\circ'), 'u7l6-wbig', 58);
      const l5 = wc.line(keysHTML('3.6 ÷ cos 26 ) ENTER', disp(ans)), '', 56);
      const l6 = wc.line(`${T(`r=${ans.toFixed(3)}\\ldots\\approx4.0`)} m`, 'u7l6-wbig u7l6-wans', 60);
      const st = hide(stamp(stage, '4.0 > 3.6 ✓', { ok: true, x: ox + 870, y: 330, size: 'sm' }));
      return [
        { cap: 'The dashed line from the peak makes a right triangle. Its bottom side is <b>half</b> the width: 7.2 ÷ 2 = 3.6 m. That is the <b class="u7l6-adj">adj</b>.', run: async (c) => { hlAdj.style.opacity = 1; await drawIn(hlAdj, 500, c); await c.pop(halfT); await c.fadeIn(l1); } },
        { cap: 'The rafter r is across from the right angle: the <b class="u7l6-hyp">hyp</b>. adj and hyp: cos.', run: async (c) => { hlHyp.style.opacity = 1; await drawIn(hlHyp, 500, c); await c.pop(l2); } },
        { cap: `${T('r')} is on the <b>bottom</b>. Multiply both sides by ${T('r')}, then divide by ${T('\\cos26^\\circ')}.`, run: async (c) => { await c.fadeIn(l3); await c.fadeIn(l4); } },
        { cap: 'Calculator: 3.6 ÷ cos 26 ) ENTER.', run: (c) => c.fadeIn(l5) },
        { cap: `Each rafter is about <b>4.0 m</b> long. Check: the hyp is longer than the adj, 4.0 > 3.6 ✓`, run: async (c) => { await c.pop(l6); await stampIn(c, st); } }
      ];
    }
    const R = triFor(stage, { a: 2.61, b: 3, right: 'bl', sides: { b: '8.5 m', c: 'x' }, angles: { A: '41°' }, thetaLabel: '41°', width: 460, height: 400, x: ox, y: 20 });
    const px = triInfo(R).px * 3 / 8.5, ans = 8.5 / cosd(41), wrong = 8.5 * cosd(41);
    const wc = workCol(stage, ox + 510, 24, 60);
    if (v === 'oops') {
      const dAB = Geo.dirTo(R.V.A, R.V.B), E6 = A_(R.V.A, dAB, wrong * px);
      const short = hide(line(R.g, R.V.A, E6, { width: 7, color: RED, dash: '10 6' }));
      const shortT = hide(txt(R.g, ...A_(E6, dAB + 90, 26), '6.4 m', { size: 19, color: RED, weight: 800 }));
      const w1 = wc.line(`${T('x=8.5\\times\\cos41^\\circ')}`, 'u7l6-wbig u7l6-wrong', 62);
      const w2 = wc.line(`${T(`x=${dots(wrong)}\\approx${r1(wrong)}`)} m`, 'u7l6-wbig u7l6-wrong', 70);
      const bad = hide(stamp(stage, '6.4 < 8.5 ✗', { ok: false, x: ox + 880, y: 96, size: 'sm' }));
      const g1 = wc.line(`${T('\\cos41^\\circ=\\dfrac{8.5}{x}')} : ${T('x')} is on the <b>bottom</b>`, 'u7l6-wbig', 76);
      const g2 = wc.line(`${T(`x=8.5\\div\\cos41^\\circ=${dots(ans)}\\approx11.3`)} m`, 'u7l6-wbig u7l6-wans', 62);
      const good = hide(stamp(stage, '11.3 > 8.5 ✓', { ok: true, x: ox + 880, y: 320, size: 'sm' }));
      return [
        { cap: `The student multiplied: ${T('8.5\\times\\cos41^\\circ=6.4')} m.`, run: async (c) => { await R.setTheta(c, 'A'); await c.fadeIn(w1); await c.fadeIn(w2); } },
        { cap: 'Draw a 6.4 m hyp along the slanted side: it does not even reach the end of the 8.5 m adj!', run: async (c) => { short.style.opacity = 1; await drawIn(short, 900, c); await c.pop(shortT); } },
        { cap: 'The hyp is the <b>longest</b> side. A hyp shorter than the adj is impossible, so the answer is wrong.', run: (c) => stampIn(c, bad) },
        { cap: `Fix: ${T('x')} is on the <b>bottom</b> of the fraction, so <b>divide</b>.`, run: (c) => c.pop(g1) },
        { cap: `${T('x\\approx11.3')} m, longer than 8.5 m ✓. Always check: is the hyp the longest side?`, run: async (c) => { await c.pop(g2); await stampIn(c, good); } }
      ];
    }
    const l2 = wc.line(T('\\cos41^\\circ=\\dfrac{8.5}{x}'), 'u7l6-wbig', 82);
    const n3 = notePill(stage, `${T('\\times x')} on both sides`, ox + 760, wc.y - 36);
    const l3 = wc.line(T('x\\times\\cos41^\\circ=8.5'), 'u7l6-wbig', 72);
    const n4 = notePill(stage, `${T('\\div\\cos41^\\circ')} on both sides`, ox + 760, wc.y - 30);
    const l4 = wc.line(T('x=\\dfrac{8.5}{\\cos41^\\circ}'), 'u7l6-wbig', 82);
    const l5 = wc.line(keysHTML('8.5 ÷ cos 41 ) ENTER', disp(ans)), '', 56);
    const l6 = wc.line(`${T(`x=${dots(ans)}\\approx11.3`)} m`, 'u7l6-wbig u7l6-wans', 60);
    const st = hide(stamp(stage, '11.3 > 8.5 ✓', { ok: true, x: ox + 890, y: 336, size: 'sm' }));
    return [
      { cap: `<b>Step 1.</b> 8.5 m touches the 41° angle: <b class="u7l6-adj">adj</b>. ${T('x')} is across from the right angle: <b class="u7l6-hyp">hyp</b>.`, run: (c) => R.setTheta(c, 'A') },
      { cap: '<b>Step 2.</b> adj and hyp: cos. This time the unknown is on the <b>bottom</b>.', run: (c) => c.pop(l2) },
      { cap: `<b>Step 3.</b> Multiply both sides by ${T('x')} to get it off the bottom.`, run: async (c) => { await c.pop(n3); await c.fadeIn(l3); } },
      { cap: `Then divide both sides by ${T('\\cos41^\\circ')}.`, run: async (c) => { await c.pop(n4); await c.fadeIn(l4); } },
      { cap: 'Calculator: 8.5 ÷ cos 41 ) ENTER.', run: (c) => c.fadeIn(l5) },
      { cap: `<b>Step 4.</b> ${T('x\\approx11.3')} m. Check: the hyp is longer than the adj, 11.3 > 8.5 ✓`, run: async (c) => { await c.pop(l6); await stampIn(c, st); } }
    ];
  }
};

/* ======================================================================================
 * 7. (Full) The bar model: why × for the adj and ÷ for the hyp
 * ====================================================================================== */
const bars = {
  title: 'cos θ is a part of the hyp',
  height: 340,
  minW: 980,
  choices: [{ v: 'mul', label: 'adj from hyp (×)' }, { v: 'div', label: 'hyp from adj (÷)' }],
  ask: (v) => (v === 'mul' ? `The hyp is 15 cm and ${T('\\cos28^\\circ=0.8829')}. How long is the adj?` : `The adj is 8.5 m and ${T('\\cos41^\\circ=0.7547')}. How long is the hyp?`),
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 980) / 2, x0 = ox + 60, full = 760, isM = v === 'mul';
    const k = isM ? cosd(28) : cosd(41);
    const hb = hide(add(stage, h('div', 'u7l6-bar u7l6-barH', isM ? 'hyp = 15 cm' : 'hyp = ?'), x0, 60)); hb.style.width = full + 'px';
    const ab = add(stage, h('div', 'u7l6-bar u7l6-barA', isM ? 'adj = ?' : 'adj = 8.5 m'), x0, 150); ab.style.width = (isM ? 0 : full * k) + 'px'; if (isM) hide(ab);
    const pct = hide(lab(stage, `${(k * 100).toFixed(0)}% of the hyp`, x0 + full * k / 2, 215, 'u7l6-pct'));
    const tick = hide(svgEl('svg', { width: 4, height: 150, style: 'position:absolute', class: 'u7l6-svg' }, stage)); tick.style.left = (x0 + full * k - 2) + 'px'; tick.style.top = '50px';
    svgEl('line', { x1: 2, y1: 0, x2: 2, y2: 150, stroke: GREY, 'stroke-width': 2, 'stroke-dasharray': '5 5' }, tick);
    const res = hide(lab(stage, isM ? `${T(`0.8829\\times15=${dots(15 * k)}`)} cm: smaller than 15 ✓` : `${T(`8.5\\div0.7547=${dots(8.5 / k)}`)} m: bigger than 8.5 ✓`, x0 + full / 2, 290, 'u7l6-eq'));
    if (isM) {
      return [
        { cap: 'The hyp is the whole bar: 15 cm.', run: (c) => c.fadeIn(hb) },
        { cap: `${T('\\cos28^\\circ=0.8829')}: the adj is 0.8829 of the hyp, about <b>88%</b> of it.`, run: async (c) => { ab.style.opacity = 1; await tween(c, 900, (t) => { ab.style.width = (full * k * t) + 'px'; }); tick.style.opacity = 1; await c.pop(pct); } },
        { cap: 'To find a <b>part</b> of 15, <b>multiply</b>: adj = 15 × cos 28°.', run: async (c) => { ab.textContent = 'adj = 13.24… cm'; await c.pop(res); } }
      ];
    }
    return [
      { cap: 'We know the adj: 8.5 m.', run: (c) => c.fadeIn(ab) },
      { cap: `${T('\\cos41^\\circ=0.7547')}: the adj is only about <b>75%</b> of the hyp. So the hyp is <b>longer</b> than 8.5 m.`, run: async (c) => { hb.style.opacity = 1; await tween(c, 900, (t) => { hb.style.width = (full * k + full * (1 - k) * t) + 'px'; }); tick.style.opacity = 1; await c.pop(pct); } },
      { cap: '8.5 is the part; the hyp is the whole. To find the whole from a part, <b>divide</b>: hyp = 8.5 ÷ cos 41°.', run: async (c) => { hb.textContent = 'hyp = 11.26… m'; await c.pop(res); } }
    ];
  }
};

/* ======================================================================================
 * 8. The SOH CAH TOA chooser (Example 6 checks)
 * ====================================================================================== */
const RATIOS = [
  { k: 'sin', w: 'SOH', sides: ['opp', 'hyp'], tex: '\\sin\\theta=\\dfrac{\\color{#c93a33}\\text{opp}}{\\color{#9a6a24}\\text{hyp}}' },
  { k: 'cos', w: 'CAH', sides: ['adj', 'hyp'], tex: '\\cos\\theta=\\dfrac{\\color{#1f5bd6}\\text{adj}}{\\color{#9a6a24}\\text{hyp}}' },
  { k: 'tan', w: 'TOA', sides: ['opp', 'adj'], tex: '\\tan\\theta=\\dfrac{\\color{#c93a33}\\text{opp}}{\\color{#1f5bd6}\\text{adj}}' }
];
const pickRatio = (know, want) => RATIOS.find((r) => r.sides.includes(know) && r.sides.includes(want));
const EX6 = {
  a: { a: 1.85, b: 2.2, right: 'br', deg: 40, sides: { a: 'x', c: '12' }, know: 'hyp', kv: '12', want: 'opp' },
  b: { a: 1.12, b: 2.4, right: 'bl', deg: 25, sides: { a: 'x', b: '8' }, know: 'adj', kv: '8', want: 'opp' },
  c: { a: 2.26, b: 1.2, right: 'br', deg: 62, sides: { b: '5', c: 'x' }, know: 'adj', kv: '5', want: 'hyp' },
  d: { a: 1.56, b: 2.4, right: 'tl', deg: 33, sides: { a: '7', c: 'x' }, know: 'opp', kv: '7', want: 'hyp' }
};
function ratioCards(host, x, y) {
  const wrap = add(host, h('div', 'u7l6-cards'), x, y);
  const cards = RATIOS.map((r) => { const e = h('div', 'u7l6-card', `<b>${r.w}</b>${T(r.tex)}<span class="u7l6-mk"></span>`); wrap.appendChild(e); return e; });
  return { wrap, cards };
}
const chooser = {
  title: 'Which ratio? SOH CAH TOA',
  height: 420,
  minW: 980,
  choices: [{ sep: 'Example 6 check:' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }, { v: 'c', label: '(c)' }, { v: 'd', label: '(d)' }],
  ask: (v) => `Example 6 (${v}): name the side you know and the side you want (${T('x')}). Then choose sin, cos or tan. Do not solve.`,
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 980) / 2, E = EX6[v], r = pickRatio(E.know, E.want);
    const R = Geo.rightTri(stage, { a: E.a, b: E.b, right: E.right, names: false, sides: E.sides, angles: { A: E.deg + '°' }, thetaLabel: E.deg + '°', show: ['opp', 'adj', 'hyp'], width: 480, height: 412, x: ox + 16, y: 4, pad: 70 });
    const roleSide = (role) => ({ opp: 'a', adj: 'b', hyp: 'c' })[role];
    const C = ratioCards(stage, ox + 520, 16);
    const res = hide(lab(stage, `Use <b>${r.k}</b>: ${T(`\\${r.k}${E.deg}^\\circ=${r.k === 'tan' ? '\\dfrac{x}{8}' : r.k === 'sin' && E.want === 'opp' ? '\\dfrac{x}{12}' : r.k === 'sin' ? '\\dfrac{7}{x}' : '\\dfrac{5}{x}'}`)}`, ox + 740, 372, 'u7l6-eq'));
    let rk = null, rw = null;
    return [
      { cap: `<b>Label</b> the sides from the ${E.deg}° angle.`, run: (c) => R.setTheta(c, 'A') },
      { cap: `We <b>know</b> the ${E.know} (${E.kv}).`, run: async (c) => { if (rk) rk.remove(); rk = ringAround(R.g, [R.tags[E.know], R.valLabels[roleSide(E.know)]], { word: 'KNOW', color: GREEN }); if (rk) await drawIn(rk, 500, c); } },
      { cap: `We <b>want</b> the ${E.want} (${T('x')}).`, run: async (c) => { if (rw) rw.remove(); rw = ringAround(R.g, [R.tags[E.want], R.valLabels[roleSide(E.want)]], { word: 'WANT', color: PURPLE, dash: '8 6' }); if (rw) await drawIn(rw, 500, c); } },
      { cap: `Which ratio has <b>both</b> ${E.know} and ${E.want}?`, run: async (c) => {
        for (let i = 0; i < 3; i++) {
          const ok = RATIOS[i] === r, mk = C.cards[i].querySelector('.u7l6-mk');
          const miss = [E.know, E.want].filter((sd) => !RATIOS[i].sides.includes(sd));
          mk.innerHTML = ok ? '✓ both' : `✗ no ${miss.join(', ')}`;
          C.cards[i].classList.add(ok ? 'u7l6-on' : 'u7l6-off');
          await c.pop(mk, 320); await c.sleep(250);
        } } },
      { cap: `<b>${r.w}</b>: use <b>${r.k}</b>. (Solving comes in Example 7 and Lesson 9.)`, run: (c) => c.pop(res) }
    ];
  }
};

/* ======================================================================================
 * 9. The grain auger (Example 7)
 * ====================================================================================== */
const auger = {
  title: 'The grain auger: cos, sin, then a check',
  height: 440,
  minW: 980,
  choices: [{ sep: 'Example 7:' }, { v: 'a', label: '(a) distance d' }, { v: 'b', label: '(b) height h' }, { v: 'c', label: '(c) Pythagoras check' }],
  ask: (v) => (v === 'a' ? 'A 16 m auger leans on a grain bin at 32° to the ground. (a) How far from the bin is the bottom of the auger?'
    : v === 'b' ? '(b) How high up the bin does the 16 m auger reach? (32° with the ground)' : '(c) Check d = 13.6 m and h = 8.5 m with the Pythagorean theorem.'),
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 980) / 2, d = 16 * cosd(32), hh = 16 * sind(32);
    const svg = stageSvg(stage, 540, 440); svg.style.left = ox + 'px';
    const S = augerScene(svg, [56, 380], 21, { d: v === 'c' || v === 'b' ? '13.6 m' : null, h: v === 'c' ? '8.5 m' : null });
    const g = svgEl('g', {}, svg);
    const hH = hide(line(g, S.F, S.P, { width: 16, color: HYP, opacity: 0.35 }));
    const hA = hide(line(g, S.F, S.C, { width: 8, color: ADJ, opacity: 0.8 }));
    const hO = hide(line(g, S.C, S.P, { width: 8, color: OPP, opacity: 0.8 }));
    const wc = workCol(stage, ox + (v === 'c' ? 505 : 570), 26, 64);
    if (v === 'c') {
      const l1 = wc.line(T('\\sqrt{13.6^2+8.5^2}'), 'u7l6-wbig', 70);
      const l2 = wc.line(T('=\\sqrt{184.96+72.25}'), 'u7l6-wbig', 70);
      const l3 = wc.line(T('=\\sqrt{257.21}\\approx16.04'), 'u7l6-wbig u7l6-wans', 66);
      const l4 = wc.line(keysHTML('√ 13.6 x² + 8.5 x² ) ENTER', disp(Math.sqrt(13.6 ** 2 + 8.5 ** 2))), 'u7l6-sm', 60);
      const st = hide(stamp(stage, '≈ 16 m ✓', { ok: true, x: ox + 760, y: 360, size: 'sm' }));
      return [
        { cap: 'The two legs are d = 13.6 m and h = 8.5 m. The hyp should come out about 16 m.', run: async (c) => { hA.style.opacity = hO.style.opacity = 1; await drawIn(hA, 400, c); await drawIn(hO, 400, c); await c.pop(l1); } },
        { cap: 'Square each leg and add.', run: (c) => c.fadeIn(l2) },
        { cap: 'Take the square root (√ is 2nd x² on the TI-30XIIS).', run: async (c) => { await c.fadeIn(l3); await c.fadeIn(l4); } },
        { cap: '16.04 is about 16 m ✓. It is not exact because we rounded d and h first.', run: async (c) => { hH.style.opacity = 1; await drawIn(hH, 500, c); await stampIn(c, st); } }
      ];
    }
    const isA = v === 'a', fn = isA ? 'cos' : 'sin', role = isA ? 'adj' : 'opp', x = isA ? 'd' : 'h', val = isA ? d : hh;
    const word = hide(lab(stage, isA ? '<b>CAH</b> → cos' : '<b>SOH</b> → sin', ox + 870, 116, 'u7l6-tag'));
    const l1 = wc.line(`Know <b class="u7l6-hyp">hyp</b> (16), want <b class="${isA ? 'u7l6-adj' : 'u7l6-opp'}">${role}</b> (${T(x)})`, '', 66);
    const l2 = wc.line(T(`\\${fn}32^\\circ=\\dfrac{${x}}{16}`), 'u7l6-wbig', 80);
    const l3 = wc.line(T(`${x}=16\\times\\${fn}32^\\circ`), 'u7l6-wbig', 62);
    const l4 = wc.line(keysHTML(`16 × ${fn} 32 ) ENTER`, disp(val)), '', 58);
    const l5 = wc.line(`${T(`${x}=${dots(val)}\\approx${r1(val)}`)} m`, 'u7l6-wbig u7l6-wans', 60);
    const fin = hide(lab(stage, isA ? 'About <b>13.6 m</b> from the bin.' : 'It reaches about <b>8.5 m</b> up.', ox + 760, 400, 'u7l6-eq'));
    const hl = isA ? hA : hO;
    return [
      { cap: `The auger is across from the right angle: the <b class="u7l6-hyp">hyp</b>, 16 m. ${isA ? 'd runs along the ground and touches the 32° angle: the <b class="u7l6-adj">adj</b>.' : 'h runs up the bin, across from the 32° angle: the <b class="u7l6-opp">opp</b>.'}`,
        run: async (c) => { hH.style.opacity = 1; await drawIn(hH, 500, c); hl.style.opacity = 1; await drawIn(hl, 500, c); await c.fadeIn(l1); } },
      { cap: `${isA ? 'adj' : 'opp'} and hyp: ${isA ? '<b>CAH</b>, use cos' : '<b>SOH</b>, use sin'}.`, run: async (c) => { await c.pop(word); await c.pop(l2); } },
      { cap: `${T(x)} is on top: multiply both sides by 16.`, run: (c) => c.fadeIn(l3) },
      { cap: `Calculator: 16 × ${fn} 32 ) ENTER.`, run: (c) => c.fadeIn(l4) },
      { cap: `Round to the nearest tenth: ${T(`${x}\\approx${r1(val)}`)} m.`, run: async (c) => { await c.pop(l5); await c.pop(fin); } }
    ];
  }
};

mountExplainers({ discover, labels, meter, cofn, findAdj, findHyp, bars, chooser, auger });

/* ======================================================================================
 * hands-on: the similarRights table
 * ====================================================================================== */
{
  const host = document.getElementById('u7l6-srt');
  if (host) Geo.similarRights(host, { theta: 25, sizes: [3, 5, 7], by: 'hyp', ratios: ['adj/hyp'], reveal: ['adj/hyp'], dp: 2, rdp: 4, width: 760, height: 300, min: 5, max: 85 });
}

/* ======================================================================================
 * hands-on: the ratio chooser (tap the side you know, then the side you want)
 * ====================================================================================== */
{
  const host = document.getElementById('u7l6-choose');
  if (host) {
    const wrap = h('div', 'u7l6-ch'), figBox = h('div', 'u7l6-ch-fig'), side = h('div', 'u7l6-ch-side');
    wrap.append(figBox, side); host.appendChild(wrap);
    const cardsHost = h('div', 'u7l6-ch-cards'); side.appendChild(cardsHost);
    const C = ratioCards(cardsHost); C.wrap.style.position = 'static';
    const out = h('div', 'u7l6-ch-out', 'Tap the side you <b>know</b>.'); side.appendChild(out);
    const btns = h('div', 'u7l6-btns'); side.appendChild(btns);
    const mk = (label, fn) => { const b = h('button', 'pill', label); b.type = 'button'; b.onclick = fn; btns.appendChild(b); return b; };
    let R = null, know = null, want = null, hideTags = false, layer = null;
    const ROLE_OF = (s) => { const r = R.roles(); return Object.keys(r).find((k) => r[k] === s); };
    function paint() {
      layer.innerHTML = '';
      const G0 = [(R.V.A[0] + R.V.B[0] + R.V.C[0]) / 3, (R.V.A[1] + R.V.B[1] + R.V.C[1]) / 3];
      [[know, GREEN, 'KNOW'], [want, PURPLE, 'WANT']].forEach(([role, colr, word]) => {
        if (!role) return;
        const sd = R.roles()[role], ends = { a: ['B', 'C'], b: ['A', 'C'], c: ['A', 'B'] }[sd], P = R.V[ends[0]], Q = R.V[ends[1]];
        line(layer, P, Q, { width: 16, color: colr, opacity: 0.32, cls: '' });
        const M = [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2], u = unit(G0, M), d = hideTags ? 26 : 50;
        const t = txt(layer, M[0] + u[0] * d, M[1] + u[1] * d, word, { size: 17, color: colr, weight: 900 }); t.style.letterSpacing = '.06em';
      });
      const r = know && want ? pickRatio(know, want) : null;
      C.cards.forEach((cd, i) => { cd.classList.toggle('u7l6-on', !!r && RATIOS[i] === r); cd.classList.toggle('u7l6-off', !!r && RATIOS[i] !== r); cd.querySelector('.u7l6-mk').innerHTML = r ? (RATIOS[i] === r ? '✓ both' : '') : ''; });
      out.innerHTML = !know ? 'Tap the side you <b>know</b>.' : !want ? `Know: <b>${know}</b>. Now tap the side you <b>want</b>.`
        : know === want ? 'Pick two <b>different</b> sides.' : `Know <b>${know}</b>, want <b>${want}</b>: <b>${r.w}</b>, use <b>${r.k}</b>.`;
      Object.values(R.tags).forEach((t) => { t.style.visibility = hideTags ? 'hidden' : ''; });
    }
    function build() {
      figBox.innerHTML = ''; know = want = null;
      const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
      const deg = rnd(24, 66), right = ['bl', 'br', 'tl', 'tr'][rnd(0, 3)], th = Math.random() < 0.5 ? 'A' : 'B';
      R = Geo.rightTri(figBox, { a: 3 * tand(deg), b: 3, right, rot: [0, 0, 15, -15, 30][rnd(0, 4)], names: false, theta: th, thetaLabel: 'θ', show: ['opp', 'adj', 'hyp'], width: 470, height: 360 });
      layer = svgEl('g', {}, R.g);
      ['a', 'b', 'c'].forEach((s) => {
        const P = R.sideEls[s].getAttribute('d');
        const hit = svgEl('path', { d: P, stroke: 'transparent', 'stroke-width': 34, fill: 'none', 'data-tap': '', class: 'u7l6-hit' }, R.g);
        hit.addEventListener('click', () => {
          const role = ROLE_OF(s);
          if (!know || (know && want)) { know = role; want = null; } else want = role;
          if (know === want) want = null;
          paint();
        });
      });
      paint();
    }
    mk('New triangle', build);
    mk('Clear', () => { know = want = null; paint(); });
    const tb = mk('Hide the labels', () => { hideTags = !hideTags; tb.textContent = hideTags ? 'Show the labels' : 'Hide the labels'; paint(); });
    build();
    void liveCtx;
  }
}

/* ======================================================================================
 * static figures
 * ====================================================================================== */
const FIG = {
  refresh(host) {
    const R = Geo.rightTri(host, { a: 3, b: 4.4, right: 'br', names: false, theta: 'A', thetaLabel: 'θ', show: ['opp', 'adj', 'hyp'], long: true, width: 340, height: 230 });
    void R;
  },
  ex1(host) {
    const s = figSvg(host, 470, 230);
    nested(s, [34, 196], 60, 25, [3, 5, 7]);
  },
  ex2(host) {
    Geo.rightTri(host, { a: 9, b: 40, right: 'bl', names: ['A', 'B', 'C'], sides: { a: '9', b: '40', c: '41' }, angles: { A: '', B: '' }, width: 400, height: 170, pad: 40 });
  },
  ex4a(host) { triFor(host, { a: 1.41, b: 2.65, right: 'br', rot: -90, sides: { b: 'x', c: '15 cm' }, angles: { A: '28°' }, show: [], width: 300, height: 290 }); },
  ex4b(host) { const s = figSvg(host, 320, 290); ladderScene(s, [56, 262], 10.6); },
  ex5a(host) { triFor(host, { a: 2.61, b: 3, right: 'bl', sides: { b: '8.5 m', c: 'x' }, angles: { A: '41°' }, show: [], width: 330, height: 270 }); },
  ex5b(host) { const s = figSvg(host, 360, 270); garageScene(s, [180, 110], 38); },
  ex7(host) { const s = figSvg(host, 420, 290); augerScene(s, [40, 250], 15); }
};
Object.entries(EX6).forEach(([k, E]) => { FIG['ex6' + k] = (host) => Geo.rightTri(host, { a: E.a, b: E.b, right: E.right, names: false, sides: E.sides, angles: { A: E.deg + '°' }, show: [], width: 205, height: 185, pad: 30 }); });
document.querySelectorAll('.u7l6-fig[data-fig]').forEach((host) => { const f = FIG[host.dataset.fig]; if (f) f(host); });

/* ======================================================================================
 * Stand Up Break
 * ====================================================================================== */
/** a static triangle for a station card (an HTML string) */
function triHTML(o) {
  const d = document.createElement('div');
  Geo.rightTri(d, Object.assign({ names: false, show: [], width: 300, height: 230, pad: 40 }, o));
  return d.innerHTML;
}
standup('u7l6', {
  intro: 'Label adj and hyp first. Write the ratio, solve, round at the end, and check: is the hyp the longest side?',
  levels: {
    BEG: (r) => {
      const th = r.int(20, 70), hy = r.pick([8, 10, 12, 14, 15, 18, 20, 25, 30, 6.5, 9.5, 12.5]), u = r.pick(['cm', 'm']), x = hy * cosd(th);
      const fig = triHTML({ a: 3 * tand(th), b: 3, right: r.pick(['bl', 'br']), sides: { b: 'x', c: `${hy} ${u}` }, angles: { A: th + '°' } });
      return { text: `Find <i>x</i> (the adj) to the nearest tenth.`, q: '', fig, a: [`\\cos${th}^\\circ=\\dfrac{x}{${hy}}`, `x=${hy}\\times\\cos${th}^\\circ`, `x=${dots(x)}\\approx${r1(x)}\\text{ ${u}}`] };
    },
    PRG: (r) => {
      const th = r.int(20, 70), ad = r.pick([5, 6, 7.5, 8, 9, 10, 11, 12, 14, 16, 4.5]), u = r.pick(['cm', 'm']), x = ad / cosd(th);
      const fig = triHTML({ a: 3 * tand(th), b: 3, right: r.pick(['bl', 'br']), sides: { b: `${ad} ${u}`, c: 'x' }, angles: { A: th + '°' } });
      return { text: `Find <i>x</i> (the hyp) to the nearest tenth.`, q: '', fig, a: [`\\cos${th}^\\circ=\\dfrac{${ad}}{x}`, `x=${ad}\\div\\cos${th}^\\circ`, `x=${dots(x)}\\approx${r1(x)}\\text{ ${u}}`, `\\text{Check: }${r1(x)}>${ad}\\ \\checkmark`] };
    },
    MAS: (r) => r.pick([
      () => { const L = r.pick([16, 18, 20, 24, 28, 32]), th = r.int(68, 78), d = L * cosd(th); return { text: `A <b>${L}-foot ladder</b> leans on a house at <b>${th}°</b> to the ground. How far from the wall is its foot? Choose the ratio. (nearest tenth)`, q: '', a: [`\\text{Know hyp, want adj: cos}`, `d=${L}\\times\\cos${th}^\\circ`, `d\\approx${r1(d)}\\text{ ft}`] }; },
      () => { const L = r.pick([16, 18, 20, 24, 28, 32]), th = r.int(68, 78), hh = L * sind(th); return { text: `A <b>${L}-foot ladder</b> leans on a house at <b>${th}°</b> to the ground. How high up the wall does it reach? Choose the ratio. (nearest tenth)`, q: '', a: [`\\text{Know hyp, want opp: sin}`, `h=${L}\\times\\sin${th}^\\circ`, `h\\approx${r1(hh)}\\text{ ft}`] }; },
      () => { const run = r.pick([3, 4.5, 6, 7.2, 8, 9.6]), th = r.pick([4, 5, 6, 8, 10]), L = run / cosd(th); return { text: `A ramp has a horizontal run of <b>${run} m</b> and slopes at <b>${th}°</b>. How long is the ramp surface? Choose the ratio. (nearest hundredth)`, q: '', a: [`\\text{Know adj, want hyp: cos}`, `L=${run}\\div\\cos${th}^\\circ`, `L\\approx${(Math.round(L * 100) / 100).toFixed(2)}\\text{ m}`] }; },
      () => { const run = r.pick([3, 4.5, 6, 7.2, 8, 9.6]), th = r.pick([4, 5, 6, 8, 10]), hh = run * tand(th); return { text: `A ramp has a horizontal run of <b>${run} m</b> and slopes at <b>${th}°</b>. How high does it rise? Choose the ratio. (nearest hundredth)`, q: '', a: [`\\text{Know adj, want opp: tan}`, `h=${run}\\times\\tan${th}^\\circ`, `h\\approx${(Math.round(hh * 100) / 100).toFixed(2)}\\text{ m}`] }; },
      () => { const s = r.pick([40, 50, 60, 75, 80, 100]), th = r.int(35, 60), d = s * cosd(th); return { text: `A kite string is <b>${s} m</b> long and makes <b>${th}°</b> with the ground. How far along the ground is the kite from you (to the point right under it)? Choose the ratio. (nearest tenth)`, q: '', a: [`\\text{Know hyp, want adj: cos}`, `d=${s}\\times\\cos${th}^\\circ`, `d\\approx${r1(d)}\\text{ m}`] }; }
    ])()
  }
});
