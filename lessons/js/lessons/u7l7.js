/* Math 10-3 · Unit 7 · Lesson 7 — Angles of Elevation and Depression.
 * Explainers (Class view unless marked Full): looking up / looking down (a bird that rises, a boat that comes closer, and
 * "not from the wall"), the Example 1 check (elevation, depression or neither, with verdict stamps), elevation = depression
 * (the Z between two parallel horizontals; Example 2 checks), a half turn of the top corner (Full), reading a clinometer
 * (geo.js clinometer with both scales; Example 3 checks), finding a height and adding the eye height (Examples 4 and 5),
 * the 45° check (Full), looking down: a boat sailing in to a lighthouse, Ava’s canoe and the plane landing in Calgary
 * (Examples 6 and 7), and multiply or divide? (Full). Also a draggable clinometer that sights a tree (the activity), the
 * static figures and the Stand Up Break. */
import { h, add, tex, svgEl, tween, drawIn as drawIn0, stamp, stampIn, pulse, mountExplainers } from '../blocks.js';
import { Geo } from '../geo.js';
import { standup } from '../standup.js';

/** draw a stroke along its length (and make sure it is visible first: hidden strokes start at opacity 0) */
const drawIn = (el, ms, c) => { if (el) el.style.opacity = ''; return drawIn0(el, ms, c); };
const A = Geo.at, arcD = Geo.arcD, wedgeD = Geo.wedgeD, RAD = Math.PI / 180;
const INK = '#1c2230', BLUE = '#1f5bd6', GREEN = '#12805a', RED = '#c93a33', AMBER = '#c27a0e', HYP = '#9a6a24', SLATE = '#3a4254', GREY = '#9aa0ab';
const SKY = '#eef4fb', WATER = '#cfe3f5', WAVE = '#5b8fc7', SOIL = '#8a6f4d';
const ROLE = { opp: RED, adj: BLUE, hyp: HYP };
const T = (s) => tex(String(s));
const tanD = (d) => Math.tan(d * RAD), sinD = (d) => Math.sin(d * RAD), cosD = (d) => Math.cos(d * RAD);
/** round to dp places as a string (trailing zeros kept) */
const fx = (v, dp = 1) => (Math.round(v * 10 ** dp + 1e-9) / 10 ** dp).toFixed(dp);
/** a number for TeX with a thin thousands space */
const tn = (s) => String(s).replace(/^(\d+)(\d{3})(?=\.|$)/, '$1\\,$2');
/** plain text with a narrow no-break thousands space */
const pn = (s) => String(s).replace(/^(\d+)(\d{3})(?=\.|$)/, '$1 $2');
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const show = (...els) => els.forEach((e) => { if (e) e.style.opacity = 1; });
const stageSvg = (stage, W, H) => add(stage, svgEl('svg', { class: 'u7l7-svg', width: W, height: H, viewBox: `0 0 ${W} ${H}` }), 0, 0);
const figSvg = (host, W, H) => { host.style.width = W + 'px'; host.style.height = H + 'px'; return svgEl('svg', { class: 'geo-svg u7l7-svg', width: W, height: H, viewBox: `0 0 ${W} ${H}` }, host); };
const grp = (parent, cls) => svgEl('g', cls ? { class: cls } : {}, parent);
/** an HTML label centred on (x, y): a 0×0 holder (so c.pop's scale doesn't undo the centring) */
function lab(host, html, x, y, cls = '') {
  const hold = h('div', 'u7l7-hold'); hold.appendChild(h('div', 'u7l7-lab ' + cls, html)); add(host, hold, x, y); hold.inner = hold.firstChild; return hold;
}
function line(parent, P, Q, o = {}) {
  return svgEl('line', { x1: P[0].toFixed(2), y1: P[1].toFixed(2), x2: Q[0].toFixed(2), y2: Q[1].toFixed(2), stroke: o.color || INK, 'stroke-width': o.width || 3, 'stroke-linecap': o.cap || 'round', 'stroke-dasharray': o.dash || null, class: o.cls === undefined ? 'bk-stroke' : o.cls, opacity: o.opacity ?? null }, parent);
}
function path(parent, d, o = {}) {
  return svgEl('path', { d, fill: o.fill || 'none', 'fill-opacity': o.fo ?? null, stroke: o.stroke === undefined ? INK : o.stroke, 'stroke-width': o.width || 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-dasharray': o.dash || null, class: o.cls === undefined ? 'bk-stroke' : o.cls, opacity: o.opacity ?? null }, parent);
}
const polyD = (pts, closed = true) => 'M' + pts.map((p) => p[0].toFixed(2) + ' ' + p[1].toFixed(2)).join('L') + (closed ? 'Z' : '');
const txt = (parent, x, y, s, o = {}) => Geo.text(parent, x, y, s, Object.assign({ size: 20 }, o));
const dot = (parent, p, o = {}) => Geo.dot(parent, p, o);
const mid = (P, Q) => [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2];
const lerpP = (P, Q, t) => [P[0] + (Q[0] - P[0]) * t, P[1] + (Q[1] - P[1]) * t];
/** a small right-angle square at V between directions d and d + 90 (math degrees) */
function square(parent, V, d, s = 14, o = {}) {
  const u = A([0, 0], d, 1), v = A([0, 0], d + 90, 1);
  return path(parent, polyD([[V[0] + u[0] * s, V[1] + u[1] * s], [V[0] + (u[0] + v[0]) * s, V[1] + (u[1] + v[1]) * s], [V[0] + v[0] * s, V[1] + v[1] * s]], false), { width: o.width || 2, stroke: o.color || SLATE, cls: '' });
}
/** an angle arc from direction start, sweeping span (math degrees, counterclockwise), with a label just outside it */
function arcLab(parent, V, start, span, r, label, o = {}) {
  const g = grp(parent), colr = o.color || AMBER;
  if (o.fill) path(g, wedgeD(V, r, start, span), { stroke: 'none', fill: colr, fo: 0.16, cls: '' });
  const arc = path(g, arcD(V, r, start, span), { stroke: colr, width: o.width || 3, cls: '' });
  let t = null;
  if (label) { const lr = o.lr ?? r + 12 + String(label).length * 4.5 + (span < 14 ? 10 : 0); const p = A(V, start + span / 2 + (o.shift || 0), lr); t = txt(g, p[0], p[1], label, { size: o.size || 20, color: o.lc || colr, weight: 800 }); }
  g.arc = arc; g.t = t; return g;
}
/** a dimension line between P and Q (px) with arrow ends, and a label off to one side */
function dim(parent, P, Q, label, o = {}) {
  const g = grp(parent), colr = o.color || SLATE, d = Geo.dirTo(P, Q);
  line(g, P, Q, { color: colr, width: 1.8, cls: '' });
  [[P, d + 180], [Q, d]].forEach(([V, dd]) => { const a = A(V, dd + 150, 9), b = A(V, dd - 150, 9); path(g, polyD([a, V, b], false), { stroke: colr, width: 1.8, cls: '' }); });
  if (label) { const M = mid(P, Q), off = o.off || [0, 18]; g.t = txt(g, M[0] + off[0], M[1] + off[1], label, { size: o.size || 19, color: o.lc || colr, weight: 700 }); }
  return g;
}

/* ======================================================================================
 * Glyphs (px)
 * ====================================================================================== */
/** a stick figure standing at F, hh tall; the eye (head centre) is 0.9 hh up → returns the eye point */
function person(g, F, hh, o = {}) {
  const [x, y] = F, w = Math.max(2.2, hh * 0.05), c2 = o.color || SLATE, G = grp(g);
  path(G, `M${x} ${y - 0.8 * hh}L${x} ${y - 0.42 * hh}L${x - 0.13 * hh} ${y}M${x} ${y - 0.42 * hh}L${x + 0.13 * hh} ${y}M${x - 0.16 * hh} ${y - 0.52 * hh}L${x} ${y - 0.7 * hh}L${x + 0.16 * hh} ${y - 0.52 * hh}`, { stroke: c2, width: w, cls: '' });
  svgEl('circle', { cx: x, cy: y - 0.9 * hh, r: 0.1 * hh, fill: '#fff', stroke: c2, 'stroke-width': w * 0.9 }, G);
  dot(G, [x + 0.04 * hh, y - 0.9 * hh], { r: Math.max(1.6, hh * 0.022), color: INK });
  G.eye = [x, y - 0.9 * hh]; return G;
}
function groundLine(g, x0, x1, y) {
  const G = grp(g); svgEl('rect', { x: x0, y, width: x1 - x0, height: 14, fill: '#e7dcc8' }, G);
  line(G, [x0, y], [x1, y], { color: SOIL, width: 3, cls: '' });
  for (let x = x0 + 6; x < x1; x += 14) line(G, [x, y + 2], [x - 8, y + 11], { color: '#b9a789', width: 1.5, cls: '' });
  return G;
}
function waterLine(g, x0, x1, y, depth = 30) {
  const G = grp(g); svgEl('rect', { x: x0, y, width: x1 - x0, height: depth, fill: WATER }, G);
  let d = `M${x0} ${y}`; for (let x = x0; x < x1; x += 16) d += `q4 -4 8 0t8 0`;
  path(G, d, { stroke: WAVE, width: 2, cls: '' }); return G;
}
function flagpole(g, x, yT, yG) {
  const G = grp(g); line(G, [x, yG], [x, yT], { color: SLATE, width: 4, cls: '' });
  path(G, polyD([[x, yT + 2], [x + 30, yT + 11], [x, yT + 20]]), { fill: RED, stroke: '#7a1f16', width: 1.5, cls: '' });
  dot(G, [x, yT], { r: 3.5, color: SLATE }); return G;
}
function kiteG(g, P, s = 1) {
  const G = grp(g), [x, y] = P;
  path(G, polyD([[x, y - 22 * s], [x + 15 * s, y - 2 * s], [x, y + 26 * s], [x - 15 * s, y - 2 * s]]), { fill: '#f6c343', stroke: '#9b6a12', width: 2, cls: '' });
  line(G, [x, y - 22 * s], [x, y + 26 * s], { color: '#9b6a12', width: 1.4, cls: '' }); line(G, [x - 15 * s, y - 2 * s], [x + 15 * s, y - 2 * s], { color: '#9b6a12', width: 1.4, cls: '' });
  path(G, `M${x} ${y + 26 * s}q10 12 0 22t0 22`, { stroke: RED, width: 2, cls: '' });
  return G;
}
function birdG(g, P, s = 1) {
  const G = grp(g), [x, y] = P;
  path(G, `M${x - 16 * s} ${y - 4 * s}Q${x - 8 * s} ${y - 12 * s} ${x} ${y}Q${x + 8 * s} ${y - 12 * s} ${x + 16 * s} ${y - 4 * s}`, { stroke: INK, width: 3, cls: '' });
  return G;
}
function droneG(g, P, s = 1) {
  const G = grp(g), [x, y] = P;
  svgEl('rect', { x: x - 14 * s, y: y - 4 * s, width: 28 * s, height: 9 * s, rx: 3, fill: SLATE }, G);
  line(G, [x - 14 * s, y - 3 * s], [x - 14 * s, y - 9 * s], { color: SLATE, width: 2, cls: '' }); line(G, [x + 14 * s, y - 3 * s], [x + 14 * s, y - 9 * s], { color: SLATE, width: 2, cls: '' });
  line(G, [x - 24 * s, y - 10 * s], [x - 4 * s, y - 10 * s], { color: INK, width: 2.5, cls: '' }); line(G, [x + 4 * s, y - 10 * s], [x + 24 * s, y - 10 * s], { color: INK, width: 2.5, cls: '' });
  return G;
}
/** a cliff whose top right corner is at (xR, yT), face down to the ground at yG */
function cliffG(g, xR, yT, yG, w = 140) {
  return path(g, polyD([[xR - w, yG + 30], [xR - w, yT], [xR, yT], [xR + 5, (yT + yG) / 2], [xR, yG], [xR, yG + 30]]), { fill: '#c8b08a', stroke: '#7a6248', width: 2, cls: '' });
}
function buildingG(g, x0, x1, yT, yG) {
  const G = grp(g); svgEl('rect', { x: x0, y: yT, width: x1 - x0, height: yG - yT, fill: '#d7dbe3', stroke: '#6a7182', 'stroke-width': 2 }, G);
  const fw = (x1 - x0) / 5; for (let y = yT + 18; y < yG - 30; y += 38) for (let i = 0; i < 2; i++) svgEl('rect', { x: x0 + fw * (1 + i * 2.2), y, width: fw * 1.1, height: 18, fill: '#9fb4d6' }, G);
  return G;
}
function lighthouseG(g, x, yT, yG, w = 34) {
  const G = grp(g), hh = yG - yT;
  path(G, polyD([[x - w / 2, yG], [x - w * 0.32, yT + hh * 0.14], [x + w * 0.32, yT + hh * 0.14], [x + w / 2, yG]]), { fill: '#fff', stroke: '#6a7182', width: 2, cls: '' });
  [0.35, 0.65].forEach((f) => { const y0 = yT + hh * f, y1 = y0 + hh * 0.13, k0 = 0.32 + 0.18 * (y0 - yT - hh * 0.14) / (hh * 0.86), k1 = 0.32 + 0.18 * (y1 - yT - hh * 0.14) / (hh * 0.86); path(G, polyD([[x - w * k0, y0], [x + w * k0, y0], [x + w * k1, y1], [x - w * k1, y1]]), { fill: RED, stroke: 'none', cls: '' }); });
  svgEl('rect', { x: x - w * 0.3, y: yT + hh * 0.02, width: w * 0.6, height: hh * 0.12, fill: '#f6d47a', stroke: '#6a7182', 'stroke-width': 1.8 }, G);
  path(G, polyD([[x - w * 0.42, yT + hh * 0.02], [x, yT - hh * 0.06], [x + w * 0.42, yT + hh * 0.02]]), { fill: '#6a7182', stroke: 'none', cls: '' });
  return G;
}
function grainG(g, x0, x1, yT, yG) {
  const G = grp(g), w = x1 - x0;
  svgEl('rect', { x: x0, y: yT + w * 0.35, width: w, height: yG - yT - w * 0.35, fill: '#c9463d', stroke: '#7e2a24', 'stroke-width': 2 }, G);
  path(G, polyD([[x0, yT + w * 0.35], [x0 + w / 2, yT], [x1, yT + w * 0.35]]), { fill: '#e9e2d0', stroke: '#7e2a24', width: 2, cls: '' });
  return G;
}
function boatG(g, P, w = 60) {
  const G = grp(g), [x, y] = P;
  path(G, polyD([[x - w / 2, y - w * 0.22], [x + w / 2, y - w * 0.22], [x + w * 0.34, y], [x - w * 0.34, y]]), { fill: '#7a5124', stroke: '#4a2c14', width: 2, cls: '' });
  line(G, [x, y - w * 0.22], [x, y - w * 0.95], { color: '#4a2c14', width: 2.2, cls: '' });
  path(G, polyD([[x + 2, y - w * 0.9], [x + w * 0.42, y - w * 0.3], [x + 2, y - w * 0.3]]), { fill: '#fff', stroke: '#6a7182', width: 1.6, cls: '' });
  return G;
}
function canoeG(g, P, w = 60) {
  const G = grp(g), [x, y] = P;
  path(G, `M${x - w / 2} ${y - 8}Q${x} ${y + 8} ${x + w / 2} ${y - 8}Z`, { fill: '#d0632a', stroke: '#7a3410', width: 2, cls: '' });
  return G;
}
function truckG(g, P, w = 60) {
  const G = grp(g), [x, y] = P, hh = w * 0.42;
  svgEl('rect', { x: x - w / 2, y: y - hh - 6, width: w * 0.62, height: hh, fill: BLUE, rx: 3 }, G);
  svgEl('rect', { x: x + w * 0.14, y: y - hh * 0.78 - 6, width: w * 0.36, height: hh * 0.78, fill: '#3a6fd8', rx: 4 }, G);
  [x - w * 0.3, x + w * 0.3].forEach((cx) => svgEl('circle', { cx, cy: y - 5, r: 6, fill: INK }, G));
  return G;
}
function planeG(g, P, w = 70) {
  const G = grp(g), [x, y] = P;
  path(G, `M${x - w / 2} ${y}Q${x - w / 2} ${y - 7} ${x - w * 0.3} ${y - 7}L${x + w * 0.38} ${y - 7}Q${x + w / 2} ${y - 6} ${x + w / 2} ${y}Q${x + w / 2} ${y + 6} ${x + w * 0.38} ${y + 6}L${x - w * 0.3} ${y + 6}Q${x - w / 2} ${y + 6} ${x - w / 2} ${y}Z`, { fill: '#e8ecf3', stroke: '#4d5b78', width: 2, cls: '' });
  path(G, polyD([[x - w * 0.05, y], [x + w * 0.12, y + w * 0.3], [x + w * 0.22, y + w * 0.3], [x + w * 0.16, y]]), { fill: '#c5cee0', stroke: '#4d5b78', width: 1.6, cls: '' });
  path(G, polyD([[x - w * 0.46, y - 6], [x - w * 0.5, y - w * 0.24], [x - w * 0.38, y - w * 0.24], [x - w * 0.3, y - 6]]), { fill: '#c5cee0', stroke: '#4d5b78', width: 1.6, cls: '' });
  return G;
}
function treeG(g, x, yT, yG) {
  const G = grp(g), hh = yG - yT;
  svgEl('rect', { x: x - Math.max(4, hh * 0.035), y: yT + hh * 0.5, width: Math.max(8, hh * 0.07), height: hh * 0.5, fill: '#8a5a2b' }, G);
  path(G, polyD([[x, yT], [x + hh * 0.2, yT + hh * 0.42], [x + hh * 0.11, yT + hh * 0.42], [x + hh * 0.26, yT + hh * 0.72], [x - hh * 0.26, yT + hh * 0.72], [x - hh * 0.11, yT + hh * 0.42], [x - hh * 0.2, yT + hh * 0.42]]), { fill: '#4f8f45', stroke: '#2f6a2a', width: 2, cls: '' });
  return G;
}

/* ======================================================================================
 * 1. Looking up, looking down
 * ====================================================================================== */
const defs = {
  title: 'Looking up and looking down',
  height: 420,
  choices: [{ v: 'up', label: 'Looking up' }, { v: 'down', label: 'Looking down' }],
  ask: (v) => (v === 'up' ? 'You look <b>up</b> at a bird. Which angle is the angle of elevation?' : 'You look <b>down</b> from a rooftop at a boat. Which angle is the angle of depression?'),
  make(stage, v, ex) {
    const W = ex.W, H = 420, svg = stageSvg(stage, W, H), up = v === 'up';
    svgEl('rect', { x: 0, y: 0, width: W, height: H, fill: SKY, rx: 12 }, svg);
    const gy = 372, base = grp(svg), lines = grp(svg), marks = grp(svg);
    let E, tgtAt, tgtG;
    if (up) {
      groundLine(base, 0, W, gy);
      E = person(base, [150, gy], 96).eye;
      tgtAt = [680, 190];
      tgtG = grp(svg);
    } else {
      waterLine(base, 210, W, gy, H - gy);
      groundLine(base, 0, 210, gy);
      buildingG(base, 40, 210, 160, gy);
      E = person(base, [170, 160], 80).eye;
      tgtAt = [860, gy];
      tgtG = grp(svg);
    }
    const HZ = [W - 30, E[1]];
    const hz = hide(line(lines, E, HZ, { color: SLATE, width: 2.4, dash: '10 7' }));
    const hzT = hide(txt(lines, W - 110, E[1] + (up ? 18 : -18), 'horizontal', { size: 18, color: SLATE, weight: 700 }));
    const sight = hide(line(lines, E, tgtAt, { color: AMBER, width: 3.4 }));
    const sightT = hide(txt(lines, 0, 0, 'line of sight', { size: 18, color: AMBER, weight: 700 }));
    const arc = path(marks, '', { stroke: AMBER, width: 3.2, cls: '' }), wedge = path(marks, '', { stroke: 'none', fill: AMBER, fo: 0.15, cls: '' });
    const angT = txt(marks, 0, 0, '', { size: 21, color: AMBER, weight: 800 });
    const name = hide(lab(stage, up ? 'angle of <b>elevation</b>' : 'angle of <b>depression</b>', 400, 200, 'u7l7-tag'));
    let theta = 0, grow = 0;
    function place(P) {
      tgtAt = P; tgtG.innerHTML = ''; if (up) birdG(tgtG, P, 1.3); else boatG(tgtG, P, 56);
      const d = Geo.dirTo(E, P); theta = up ? d : 360 - d;
      ['x2', 'y2'].forEach((k, i) => sight.setAttribute(k, P[i].toFixed(2)));
      const M = lerpP(E, P, 0.55), n = A([0, 0], d + 90, 20); sightT.setAttribute('x', (M[0] + n[0]).toFixed(1)); sightT.setAttribute('y', (M[1] + n[1]).toFixed(1));
      sightT.style.transformBox = 'view-box'; sightT.style.transformOrigin = '0 0'; sightT.setAttribute('transform', `rotate(${(-d).toFixed(1)} ${(M[0] + n[0]).toFixed(1)} ${(M[1] + n[1]).toFixed(1)})`);
      drawArc();
    }
    function drawArc() {
      const sp = theta * grow, r = 70;
      if (sp < 0.3) { arc.setAttribute('d', ''); wedge.setAttribute('d', ''); angT.textContent = ''; return; }
      const st = up ? 0 : -sp;
      arc.setAttribute('d', arcD(E, r, st, sp)); wedge.setAttribute('d', wedgeD(E, r, st, sp));
      const p = A(E, st + sp / 2, r + 30); angT.setAttribute('x', p[0].toFixed(1)); angT.setAttribute('y', p[1].toFixed(1)); angT.textContent = Math.round(sp) + '°';
      const q = A(E, st + sp / 2, r + 150); name.style.left = q[0] + 'px'; name.style.top = (q[1] + (up ? -20 : 26)) + 'px';
    }
    place(tgtAt);
    const steps = [
      { cap: up ? 'You look <b>up</b> at a bird. The straight line from your eye to the bird is your <b>line of sight</b>.' : 'From a rooftop you look <b>down</b> at a boat. The line from your eye to the boat is your <b>line of sight</b>.',
        run: async (c) => { await drawIn(sight, 700, c); await c.anim(sightT, [{ opacity: 0 }, { opacity: 1 }], 350); } },
      { cap: 'The <b>horizontal</b> goes out <b>level</b> from your eye, flat like the floor or a calm lake.', run: async (c) => { await drawIn(hz, 700, c); await c.pop(hzT); } },
      { cap: up ? 'The <b>angle of elevation</b> is between them: from the horizontal <b>up</b> to the line of sight.' : 'The <b>angle of depression</b> is between them: from the horizontal <b>down</b> to the line of sight.',
        run: async (c) => { await tween(c, 900, (u) => { grow = u; drawArc(); }); await c.pop(name); } },
      up ? { cap: 'The bird flies <b>higher</b>. You look up more steeply: the angle of elevation gets <b>bigger</b>.', run: (c) => tween(c, 1800, (u) => place(lerpP([680, 190], [520, 50], u))) }
        : { cap: 'The boat comes <b>closer</b>. You look down more steeply: the angle of depression gets <b>bigger</b>.', run: (c) => tween(c, 1800, (u) => place([860 - 360 * u, gy])) }
    ];
    if (!up) {
      const vg = grp(svg), vline = hide(line(vg, E, [E[0], gy - 6], { color: RED, width: 2.4, dash: '6 6' }));
      const st = hide(stamp(stage, 'not this one!', { ok: false, x: 300, y: 300, size: 'sm' }));
      const vt = hide(txt(vg, E[0] - 18, gy - 60, 'vertical', { size: 17, color: RED, weight: 700, anchor: 'end' }));
      let va = null;
      steps.push({ cap: 'Not from the wall! The angle from the <b>vertical</b> (straight down the wall) is <b>not</b> the angle of depression.',
        run: async (c) => {
          await drawIn(vline, 500, c); await c.pop(vt);
          const d = Geo.dirTo(E, tgtAt); va = arcLab(vg, E, 270, d - 270, 46, '', { color: RED, fill: true }); hide(va); await c.anim(va, [{ opacity: 0 }, { opacity: 1 }], 400);
          await stampIn(c, st);
        } });
    }
    return steps;
  }
};

/* ======================================================================================
 * 1b. Example 1 check: the four booklet pictures (tikz units, y up)
 * ====================================================================================== */
const EX1 = {
  a: { eye: [0.4, 0.9], ref: [[0.4, 0.9], [3.1, 0.9]], sight: [2.8, 2.25], ang: [0, 29.4], r: 0.8, kind: 'elevation', from: 'horizontal', name: 'a drone',
    draw(g, P, k) { line(g, P([-0.2, 0]), P([3.2, 0]), { color: SOIL, width: 3, cls: '' }); person(g, P([0.4, 0]), k); droneG(g, P([2.8, 2.36]), k / 70); } },
  b: { eye: [0.4, 2.32], ref: [[0.4, 2.32], [3.3, 2.32]], sight: [2.88, 0.25], ang: [-39.8, 39.8], r: 0.85, kind: 'depression', from: 'horizontal', name: 'a lifeguard',
    draw(g, P, k) {
      svgEl('rect', { x: P([0.9, 0.1])[0], y: P([0.9, 0.1])[1], width: 2.4 * k, height: 0.3 * k, fill: WATER }, g);
      path(g, `M${P([0.9, 0.1]).join(' ')}` + Array.from({ length: 10 }, () => `q${k * 0.06} ${-k * 0.05} ${k * 0.12} 0t${k * 0.12} 0`).join(''), { stroke: WAVE, width: 2, cls: '' });
      path(g, `M${P([0, 0]).join(' ')}L${P([0.15, 1.6]).join(' ')}M${P([0.75, 0]).join(' ')}L${P([0.6, 1.6]).join(' ')}M${P([-0.05, 1.6]).join(' ')}L${P([0.8, 1.6]).join(' ')}`, { stroke: '#7a5124', width: 3.4, cls: '' });
      person(g, P([0.4, 1.6]), 0.8 * k); dot(g, P([2.9, 0.22]), { r: k * 0.07, color: INK });
    } },
  c: { eye: [0.6, 3.03], ref: [[0.6, 3.03], [0.6, 0.1]], sight: [2.75, 0.27], ang: [270, 38], r: 0.75, kind: 'neither', from: 'vertical', name: 'a rooftop',
    draw(g, P, k) {
      svgEl('rect', { x: P([0, 2.4])[0], y: P([0, 2.4])[1], width: 0.8 * k, height: 2.4 * k, fill: '#d7dbe3', stroke: '#6a7182', 'stroke-width': 2 }, g);
      line(g, P([-0.2, 0]), P([3.3, 0]), { color: SOIL, width: 3, cls: '' }); person(g, P([0.6, 2.4]), 0.7 * k);
      svgEl('rect', { x: P([2.5, 0.25])[0], y: P([2.5, 0.25])[1], width: 0.6 * k, height: 0.25 * k, rx: 4, fill: BLUE }, g);
    } },
  d: { eye: [0.4, 0.57], ref: [[0.4, 0.57], [2.45, 0.57]], sight: [2.7, 2.72], ang: [0, 43.1], r: 0.7, kind: 'elevation', from: 'horizontal', name: 'a lighthouse',
    draw(g, P, k) {
      svgEl('rect', { x: P([-0.3, 0])[0], y: P([-0.3, 0])[1], width: 2.7 * k, height: 0.25 * k, fill: WATER }, g);
      path(g, `M${P([-0.3, 0]).join(' ')}` + Array.from({ length: 11 }, () => `q${k * 0.06} ${-k * 0.05} ${k * 0.12} 0t${k * 0.12} 0`).join(''), { stroke: WAVE, width: 2, cls: '' });
      lighthouseG(g, P([2.75, 0])[0], P([2.75, 2.75])[1], P([2.75, 0])[1], 0.7 * k);
      canoeG(g, P([0.4, 0.06]), 0.7 * k); person(g, P([0.4, 0.12]), 0.5 * k);
    } }
};
/** draw Example 1 picture `key` into svg at k px per unit with its origin at (ox, oy) → { E, ref, refEl, sight, arc } */
function ex1Pic(svg, key, k, ox, oy, o = {}) {
  const m = EX1[key], P = (p) => [ox + p[0] * k, oy - p[1] * k], g = grp(svg);
  m.draw(g, P, k);
  const E = P(m.eye), refEl = line(g, P(m.ref[0]), P(m.ref[1]), { color: SLATE, width: 2, dash: '7 5', cls: '' });
  const S = P(m.sight), sight = line(g, E, S, { color: INK, width: 2.6, cls: '' });
  const arc = arcLab(g, E, m.ang[0], m.ang[1], m.r * k, 'θ', { color: INK, width: 2.2, size: o.size || 18, lc: INK, lr: m.r * k + (o.size || 18) * 0.85 });
  return { E, S, refA: P(m.ref[0]), refB: P(m.ref[1]), refEl, sight, arc, g, P };
}
const which = {
  title: 'Example 1 check: measured from where?',
  height: 400,
  choices: ['a', 'b', 'c', 'd'].map((k) => ({ v: k, label: `(${k}) ${EX1[k].name}` })),
  ask: (v) => `(${v}) ${EX1[v].name}: is ${T('\\theta')} an angle of elevation, an angle of depression, or neither?`,
  make(stage, v, ex) {
    const W = ex.W, H = 400, svg = stageSvg(stage, W, H), m = EX1[v], k = 112;
    svgEl('rect', { x: 0, y: 0, width: 470, height: H, fill: SKY, rx: 12 }, svg);
    const pic = ex1Pic(svg, v, k, 60, 372, { size: 22 });
    const hl = hide(line(svg, pic.refA, pic.refB, { color: m.from === 'vertical' ? RED : GREEN, width: 10, opacity: 0.35, cls: '' }));
    const refT = hide(lab(stage, m.from, 0, 0, 'u7l7-pill ' + (m.from === 'vertical' ? 'u7l7-pr' : 'u7l7-pg')));
    const tp = m.from === 'vertical' ? [pic.refA[0] - 56, (pic.refA[1] + pic.refB[1]) / 2] : [(pic.refA[0] + pic.refB[0]) / 2 + 40, pic.refA[1] + (m.kind === 'depression' ? -24 : 24)];
    refT.style.left = tp[0] + 'px'; refT.style.top = tp[1] + 'px';
    const dir = m.kind === 'elevation' ? 'up' : 'down';
    const res = hide(lab(stage, m.kind === 'neither' ? `measured from the <b>vertical</b>` : `from the <b>horizontal</b>, looking <b>${dir}</b>`, 740, 120, 'u7l7-res'));
    const st = hide(stamp(stage, m.kind === 'neither' ? 'NEITHER' : m.kind.toUpperCase(), { ok: m.kind === 'neither' ? null : true, x: 740, y: 210 }));
    const steps = [
      { cap: `Find the line that ${T('\\theta')} is measured <b>from</b>.`, run: async (c) => { hl.style.opacity = 0.35; await drawIn(hl, 600, c); await c.pop(refT); } },
      { cap: m.kind === 'neither' ? `${T('\\theta')} starts at the <b>vertical</b> (straight down the wall), not the horizontal: <b>neither</b>.`
          : `${T('\\theta')} starts at the <b>horizontal</b> and the line of sight goes <b>${dir}</b>: an angle of <b>${m.kind}</b>.`,
        run: async (c) => { await c.pop(res); await stampIn(c, st); } }
    ];
    if (m.kind === 'neither') {
      const hz2 = hide(line(svg, pic.E, [pic.E[0] + 3.0 * k, pic.E[1]], { color: GREEN, width: 2.6, dash: '8 6', cls: '' }));
      const d = Geo.dirTo(pic.E, pic.S), dep = hide(arcLab(svg, pic.E, d, 360 - d, 1.05 * k, '', { color: GREEN, fill: true }));
      const r2 = hide(lab(stage, `angle of depression ${T('=90^\\circ-\\theta')}`, 740, 310, 'u7l7-res u7l7-resg'));
      steps.push({ cap: `The angle of depression is from the horizontal: ${T('90^\\circ-\\theta')}.`,
        run: async (c) => { await drawIn(hz2, 600, c); await c.anim(dep, [{ opacity: 0 }, { opacity: 1 }], 400); await c.pop(r2); } });
    }
    return steps;
  }
};

/* ======================================================================================
 * Looking down: a scene with an observer above and a target below (depression)
 * ====================================================================================== */
/** cfg: { W, H, x0 (observer px), gy (ground px), s (px per m), vx (vertical stretch), hM, xM, obs, tgt, surface,
 *  top, bottom (angle labels), hLab, xLab, dLab, eyeH (person px) } → { svg, set(st), state, parts, E, B } */
function depScene(svg, cfg) {
  const W = cfg.W, H = cfg.H, gy = cfg.gy, s = cfg.s, vx = cfg.vx || 1, x0 = cfg.x0;
  const st = { xM: cfg.xM, sight: false, hz: false, top: false, bottom: false, roles: false, par: false, z: false, tri: false, dims: true, xl: cfg.xLab ?? 'x', dl: cfg.dLab ?? null, vert: false, topLab: cfg.topLab, botLab: cfg.botLab, vertLab: cfg.vertLab };
  const E = [x0, gy - cfg.hM * s * vx];
  const L = { bg: grp(svg), world: grp(svg), tri: grp(svg), lines: grp(svg), marks: grp(svg), labs: grp(svg) };
  if (cfg.sky !== false) svgEl('rect', { x: 0, y: 0, width: W, height: H, fill: SKY, rx: 12 }, L.bg);
  if (cfg.surface === 'ground' || cfg.obs === 'plane') groundLine(L.bg, 0, W, gy); else { waterLine(L.bg, x0, W, gy, H - gy); groundLine(L.bg, 0, x0, gy); }
  const ph = cfg.eyeH ?? 44, foot = E[1] + 0.9 * ph;
  if (cfg.obs === 'cliff') cliffG(L.world, x0, foot, gy, x0);
  if (cfg.obs === 'lighthouse') lighthouseG(L.world, x0 - 10, foot, gy, 40);
  if (cfg.obs === 'elevator') grainG(L.world, x0 - 70, x0, foot - 0, gy);
  if (cfg.obs === 'building') buildingG(L.world, x0 - 120, x0, foot, gy);
  if (cfg.obs === 'plane') { planeG(L.world, [E[0] - 30, E[1] - 2], 80); svgEl('rect', { x: 0, y: gy - 6, width: W, height: 6, fill: '#6a7182' }, L.bg); }
  else person(L.world, [cfg.obs === 'lighthouse' ? x0 - 10 : x0 - 14, foot], ph);
  if (cfg.obs !== 'plane' && cfg.obs !== 'lighthouse') { E[0] = x0 - 14; }
  if (cfg.obs === 'lighthouse') E[0] = x0 - 10;
  const F = [E[0], gy];
  const tgtL = grp(L.world);
  const api = { svg, state: st, parts: {}, E, F, L };
  function render() {
    Object.values(L).slice(2).forEach((g) => { g.innerHTML = ''; }); tgtL.innerHTML = '';
    const B = [E[0] + st.xM * s, gy]; api.B = B;
    if (cfg.tgt === 'boat') boatG(tgtL, B, 54); else if (cfg.tgt === 'canoe') canoeG(tgtL, [B[0], gy + 2], 56); else if (cfg.tgt === 'truck') truckG(tgtL, B, 64);
    else if (cfg.tgt === 'runway') { dot(tgtL, B, { r: 6, color: RED }); }
    const thd = Math.atan2(gy - E[1], B[0] - E[0]) / RAD; api.thd = thd;
    const P = api.parts = {};
    if (st.hz) P.hz = line(L.lines, E, [Math.min(W - 16, B[0] + 120), E[1]], { color: SLATE, width: 2.2, dash: '10 7' });
    if (st.sight) P.sight = line(L.lines, E, B, { color: st.roles ? HYP : AMBER, width: 3.4 });
    square(L.marks, F, 0, 14);
    if (st.tri) P.tri = path(L.tri, polyD([E, F, B]), { stroke: 'none', fill: AMBER, fo: 0.13, cls: '' });
    if (st.roles) {
      P.opp = line(L.lines, F, E, { color: RED, width: 6 }); P.adj = line(L.lines, F, B, { color: BLUE, width: 6 });
      P.hyp = line(L.lines, E, B, { color: HYP, width: 5 });
      const M = mid(E, B), n = A([0, 0], 90 - thd, 22);
      P.tags = [txt(L.labs, E[0] + 34, (E[1] + gy) / 2 + 26, 'opp', { size: 18, color: RED, weight: 800, anchor: 'start' }),
        txt(L.labs, (F[0] + B[0]) / 2 + 46, gy + 24, 'adj', { size: 18, color: BLUE, weight: 800, anchor: 'start' }),
        txt(L.labs, M[0] - n[0] * 1.3, M[1] - n[1] * 1.3, 'hyp', { size: 18, color: HYP, weight: 800 })];
    }
    if (st.dims) {
      P.h = txt(L.labs, E[0] - 10, (E[1] + gy) / 2, cfg.hLab, { size: 20, color: st.roles ? RED : INK, weight: 800, anchor: 'end' });
      if (st.xl) P.x = txt(L.labs, (F[0] + B[0]) / 2, gy + 24, st.xl, { size: 21, color: st.roles ? BLUE : INK, weight: 800, italic: /^[a-z]$/.test(st.xl) });
      if (st.dl) { const M = mid(E, B), n = A([0, 0], 90 - thd, 22); P.d = txt(L.labs, M[0] + n[0], M[1] + n[1], st.dl, { size: 21, color: HYP, weight: 800, italic: true }); }
    }
    if (st.top) P.top = arcLab(L.marks, E, -thd, thd, cfg.rTop || 86, st.topLab, { color: AMBER, fill: true, size: 21 });
    if (st.bottom) P.bottom = arcLab(L.marks, B, 180 - thd, thd, cfg.rBot || 86, st.botLab ?? st.topLab, { color: GREEN, fill: true, size: 21 });
    if (st.par) P.par = [E, [F[0], gy]].map((V, i) => { const x = i ? Math.max(F[0] + 40, B[0] - 140) : Math.min(W - 60, B[0] + 60), y = V[1]; return path(L.marks, `M${x - 8} ${y - 8}L${x} ${y}L${x - 8} ${y + 8}M${x + 2} ${y - 8}L${x + 10} ${y}L${x + 2} ${y + 8}`, { stroke: SLATE, width: 2.4, cls: '' }); });
    if (st.z) P.z = path(L.tri, polyD([[Math.min(W - 16, B[0] + 110), E[1]], E, B, [Math.max(F[0] + 10, B[0] - 160), gy]], false), { stroke: GREEN, width: 12, opacity: 0.25, cls: '' });
    if (st.vert) { P.vline = line(L.lines, E, [E[0], gy - 4], { color: RED, width: 2.2, dash: '6 6' }); P.varc = arcLab(L.marks, E, 270, 90 - thd, 54, st.vertLab, { color: RED, size: 20 }); if (st.hz) P.vsq = square(L.marks, E, 270, 16, { color: SLATE }); }
    return P;
  }
  api.render = render;
  api.set = (o) => { Object.assign(st, o); return render(); };
  /** a copy of the top angle slides down the line of sight and turns half a turn into the bottom corner */
  api.fly = async (c, ms = 1300) => {
    const g = grp(L.marks), wp = path(g, '', { stroke: 'none', fill: AMBER, fo: 0.45, cls: '' }), ap = path(g, '', { stroke: AMBER, width: 3, cls: '' });
    const B = api.B, thd = api.thd, r = cfg.rTop || 86;
    await tween(c, ms, (u) => { const V = lerpP(E, B, u), a0 = -thd + 180 * u; wp.setAttribute('d', wedgeD(V, r, a0, thd)); ap.setAttribute('d', arcD(V, r, a0, thd)); });
    g.remove();
  };
  render();
  return api;
}

/* ======================================================================================
 * 2. Elevation = depression (the Z), Example 2 checks
 * ====================================================================================== */
const ZCFG = {
  jada: { obs: 'cliff', tgt: 'boat', hM: 40, ang: 34, who: 'Jada', what: 'boat' },
  ex2a: { obs: 'elevator', tgt: 'truck', hM: 30, ang: 38, who: 'Mia', what: 'truck', surface: 'ground' },
  ex2c: { obs: 'cliff', tgt: 'canoe', hM: 25, ang: 26, who: 'Ken', what: 'canoe', vert: 64 }
};
const zangle = {
  title: 'One line of sight, two equal angles',
  height: 420,
  choices: [{ v: 'jada', label: 'Jada and the boat' }, { v: 'ex2a', label: 'Example 2 (a), (b) check' }, { v: 'ex2c', label: 'Example 2 (c) check' }],
  ask: (v) => (v === 'jada' ? 'Jada looks down from a cliff at a boat. How is the angle at the boat related to hers?'
    : v === 'ex2a' ? 'Mia sees her truck at an angle of depression of 38°. What is the angle of elevation from the truck?'
      : 'Ken’s line of sight makes 64° with the cliff face (the vertical). Find the angle of depression.'),
  make(stage, v, ex) {
    const m = ZCFG[v], W = ex.W, H = 420, svg = stageSvg(stage, W, H);
    const xM = m.hM / tanD(m.ang), s = Math.min(560 / xM, 290 / m.hM);
    const S = depScene(svg, { W, H, x0: 190, gy: 360, s, hM: m.hM, xM, obs: m.obs, tgt: m.tgt, surface: m.surface, hLab: '', xLab: '', topLab: m.ang + '°', vertLab: (m.vert || '') + '°' });
    const res = hide(lab(stage, '', W - 150, 64, 'u7l7-res'));
    if (v === 'ex2c') {
      res.inner.innerHTML = `${T('90^\\circ-64^\\circ=26^\\circ')}`;
      return [
        { cap: 'Ken’s 64° is measured from the <b>vertical</b>: straight down the cliff face.', run: async (c) => { const P = S.set({ vert: true, sight: true }); hide(P.vline, P.varc); await drawIn(P.sight, 600, c); await drawIn(P.vline, 500, c); await c.anim(P.varc, [{ opacity: 0 }, { opacity: 1 }], 400); } },
        { cap: 'The angle of depression starts at the <b>horizontal</b>. The vertical and the horizontal make <b>90°</b>.', run: async (c) => { const P = S.set({ top: true, hz: true, topLab: '?' }); hide(P.hz, P.top); await drawIn(P.hz, 600, c); await c.anim(P.top, [{ opacity: 0 }, { opacity: 1 }], 400); } },
        { cap: `Angle of depression ${T('=90^\\circ-64^\\circ=')} <b>26°</b>.`, run: async (c) => { S.set({ topLab: '26°' }); await c.pop(res); } }
      ];
    }
    const st = hide(stamp(stage, `${m.ang}° = ${m.ang}°`, { ok: true, x: W - 150, y: 150 }));
    const steps = [
      { cap: `${m.who} looks <b>down</b> at the ${m.what}: the angle of <b>depression</b> is at the top, ${m.ang}°.`,
        run: async (c) => { const P = S.set({ top: true, sight: true, hz: true }); hide(P.top); await drawIn(P.hz, 600, c); await drawIn(P.sight, 700, c); await c.anim(P.top, [{ opacity: 0 }, { opacity: 1 }], 400); } },
      { cap: `Someone at the ${m.what} looks <b>up</b> along the <b>same line of sight</b>.`, run: (c) => pulse(c, S.parts.sight, 1.03, 700) },
      { cap: 'The two horizontals (the top line and the ground or water) are <b>parallel</b>. The line of sight crosses both.',
        run: async (c) => { const P = S.set({ par: true }); hide(...P.par); for (const e of P.par) await c.pop(e); } },
      { cap: 'That makes a <b>Z</b>: alternate interior angles. They are <b>equal</b>.',
        run: async (c) => { const P = S.set({ z: true }); hide(P.z); await drawIn(P.z, 1000, c); await S.fly(c); S.set({ bottom: true }); await c.pop(S.parts.bottom.t); } },
      { cap: v === 'jada' ? `The angle of <b>elevation</b> from the boat is also <b>${m.ang}°</b>, and it is <b>inside</b> the right triangle.`
          : `(a) The angle of elevation from the truck is <b>38°</b>. (b) The same the other way: the pilot looks up 41°, so from the drone the angle of depression is <b>41°</b>.`,
        run: async (c) => { const P = S.set({ tri: true }); hide(P.tri); await c.anim(P.tri, [{ opacity: 0 }, { opacity: 1 }], 500); await stampIn(c, st); } }
    ];
    return steps;
  }
};

/* ======================================================================================
 * 2x. Why equal: a half turn of the top corner (Full notes)
 * ====================================================================================== */
const whyEqual = {
  title: 'Turn the top corner half a turn',
  height: 400,
  make(stage, v, ex) {
    const W = ex.W, H = 400, svg = stageSvg(stage, W, H), hM = 40, ang = 34, xM = hM / tanD(ang), s = Math.min(560 / xM, 270 / hM);
    const S = depScene(svg, { W, H, x0: 190, gy: 350, s, hM, xM, obs: 'cliff', tgt: 'boat', hLab: '', xLab: '', topLab: '34°' });
    S.set({ top: true, sight: true, hz: true }); const E = S.E, B = S.B, M = mid(E, B), thd = S.thd;
    const cp = grp(svg); cp.style.transformBox = 'view-box'; cp.style.transformOrigin = '0 0'; hide(cp);
    line(cp, E, [E[0] + 260, E[1]], { color: BLUE, width: 4.5 }); line(cp, E, M, { color: BLUE, width: 4.5 });
    path(cp, wedgeD(E, 86, -thd, thd), { stroke: BLUE, width: 3, fill: BLUE, fo: 0.25, cls: '' });
    const ctr = hide(dot(svg, M, { r: 6, color: RED })), ctrT = hide(txt(svg, M[0] + 16, M[1] - 18, 'middle', { size: 17, color: RED, weight: 700, anchor: 'start' }));
    const st = hide(stamp(stage, 'it fits: equal', { ok: true, x: W - 170, y: 90 }));
    return [
      { cap: 'The angle of depression at the top: between the horizontal and the line of sight.', run: async (c) => { show(cp); await c.anim(cp, [{ opacity: 0 }, { opacity: 1 }], 500); } },
      { cap: 'Turn a copy of this corner <b>half a turn</b> (180°) about the <b>middle</b> of the line of sight.', run: async (c) => {
        await c.pop(ctr); await c.pop(ctrT);
        await tween(c, 2200, (u) => cp.setAttribute('transform', `rotate(${(180 * u).toFixed(2)} ${M[0].toFixed(2)} ${M[1].toFixed(2)})`)); } },
      { cap: 'The line of sight lands on <b>itself</b>, and the level line lands on the level water. The corner fits the angle at the boat exactly.',
        run: async (c) => { S.set({ bottom: true }); await c.pop(S.parts.bottom.t); await stampIn(c, st); } }
    ];
  }
};

/* ======================================================================================
 * 3. Reading a clinometer (geo.js), with the second (inner) scale added
 * ====================================================================================== */
/** a clinometer that only shows (no drag), with both scales like a real protractor, and a ring where the string crosses */
function clinoFig(host, o) {
  const R = o.r || 150, K = Geo.clinometer(host, Object.assign({ interactive: false, readout: false }, o, { r: R }));
  const body = K.g.querySelector('.geo-clino-body');
  if (body) for (let a = 190; a <= 350; a += R >= 190 ? 10 : 20) {
    const t = a - 180, p = [R * 0.64 * Math.cos(a * RAD), -R * 0.64 * Math.sin(a * RAD)];
    const tt = svgEl('text', { x: p[0].toFixed(1), y: p[1].toFixed(1), 'font-size': 11, 'font-weight': 600, fill: '#6a7182', class: 'geo-tn u7l7-inner', 'text-anchor': 'middle', 'dominant-baseline': 'central', transform: `rotate(${270 - a} ${p[0].toFixed(1)} ${p[1].toFixed(1)})` }, body);
    tt.textContent = 180 - t;
  }
  K.R = R; return K;
}
const CLINO = { how: 25, a: 25, b: 40 };
const CTAB = [72, 58, 113, 90, 134];
const clino = {
  title: 'Reading a clinometer',
  height: 470,
  choices: [{ v: 'how', label: 'How it works' }, { v: 'a', label: 'Example 3 (a) check' }, { v: 'b', label: 'Example 3 (b) check' }, { v: 'c', label: 'Example 3 (c) check' }],
  ask: (v) => (v === 'how' ? 'Where does the string cross when you tilt the straw up 25°?' : v === 'c' ? 'Find the angle of elevation for each reading: 72°, 58°, 113°, 90°, 134°.' : `Read the clinometer in Example 3 (${v}). Find the angle of elevation.`),
  make(stage, v, ex) {
    const W = ex.W, tab = v === 'c';
    const K = clinoFig(stage, { x: tab ? 0 : 30, y: 4, width: 560, height: 460, r: 200, cx: 280, cy: 176, angle: v === 'how' || tab ? 0 : CLINO[v] });
    K.el.classList.add('u7l7-clbig');
    const cx0 = (tab ? 0 : 30) + 280, ring = hide(add(stage, h('div', 'u7l7-ring'), cx0, 4 + 176 + 200 * 0.93));
    const px = tab ? 760 : 770;
    if (tab) {
      const tb = add(stage, h('div', 'u7l7-ctab'), W - 470, 270);
      tb.innerHTML = '<div class="u7l7-cth">Reading</div>' + CTAB.map((r) => `<div>${r}°</div>`).join('') + '<div class="u7l7-cth">Angle</div>' + CTAB.map(() => '<div class="u7l7-cv"></div>').join('');
      const cells = [...tb.querySelectorAll('.u7l7-cv')], heads = [...tb.children].slice(1, 6);
      const rule = hide(lab(stage, `angle = difference from 90°`, W - 235, 200, 'u7l7-res'));
      return [{ cap: 'Each reading is some number of degrees <b>away from 90°</b>. That difference is the angle.', run: (c) => c.pop(rule) }].concat(CTAB.map((r, i) => {
        const ang = Math.abs(r - 90);
        return {
          cap: r < 90 ? `${r}° is less than 90: ${T(`90-${r}=`)} <b>${ang}°</b>.` : r > 90 ? `${r}° is more than 90 (the other scale): ${T(`${r}-90=`)} <b>${ang}°</b>.` : '90°: the straw is <b>level</b>. The angle is <b>0°</b>.',
          run: async (c) => { heads.forEach((e, j) => e.classList.toggle('u7l7-now', j === i)); await K.tiltTo(c, ang, 900); ring.style.opacity = 1; cells[i].innerHTML = ang + '°'; await c.pop(cells[i]); }
        };
      }));
    }
    const t = CLINO[v], r1 = 90 - t, r2 = 90 + t;
    const l1 = hide(lab(stage, '', px, 90, 'u7l7-read')), l2 = hide(lab(stage, '', px, 170, 'u7l7-read u7l7-read2')), l3 = hide(lab(stage, '', px, 290, 'u7l7-res'));
    l2.inner.innerHTML = `or <b>${r2}°</b> on the other scale`;
    l3.inner.innerHTML = `angle ${T(`=90^\\circ-${r1}^\\circ=`)} <b>${t}°</b>`;
    if (v === 'how') {
      return [
        { cap: 'Straw <b>level</b>: the string hangs straight down and crosses at <b>90°</b>. The angle is 0°.',
          run: async (c) => { l1.inner.innerHTML = 'string crosses <b>90°</b>'; ring.style.opacity = 1; await c.pop(ring); await c.pop(l1); } },
        { cap: `Tilt the straw <b>up ${t}°</b> to sight the top. The weight keeps the string hanging <b>straight down</b>.`,
          run: async (c) => { await c.anim(l1, [{ opacity: 1 }, { opacity: 0 }], 250); await K.tiltTo(c, t, 1500); } },
        { cap: `Now the string crosses <b>${r1}°</b> on one scale and <b>${r2}°</b> on the other.`,
          run: async (c) => { l1.inner.innerHTML = `string crosses <b>${r1}°</b>`; await pulse(c, ring, 1.4, 600); await c.pop(l1); await c.pop(l2); } },
        { cap: `Both are <b>${t}°</b> away from 90°. The angle of elevation is <b>${t}°</b>.`, run: (c) => c.pop(l3) }
      ];
    }
    return [
      { cap: `(${v}) The straw is tilted up to the top. Find where the string crosses the scale.`, run: async (c) => { ring.style.opacity = 1; await c.pop(ring); await pulse(c, ring, 1.4, 600); } },
      { cap: `It crosses <b>${r1}</b> (or <b>${r2}</b> on the other scale).`, run: async (c) => { l1.inner.innerHTML = `string crosses <b>${r1}°</b>`; await c.pop(l1); await c.pop(l2); } },
      { cap: `Angle of elevation ${T(`=90^\\circ-${r1}^\\circ=`)} <b>${t}°</b> (or ${T(`${r2}^\\circ-90^\\circ=${t}^\\circ`)}).`, run: (c) => c.pop(l3) }
    ];
  }
};

/* ======================================================================================
 * 4. Finding a height (Examples 4 and 5): the triangle sits on top of the eyes
 * ====================================================================================== */
const LIFT = {
  noor: { kind: 'flag', adj: 24, ang: 31, eye: 1.6, who: 'Noor', eyeLab: '1.6 m', adjLab: '24 m', unk: 'h' },
  ka: { kind: 'kite', hyp: 60, ang: 48, eye: 1.2, who: 'Liam', eyeLab: '1.2 m', hypLab: '60 m', unk: 'x' },
  kb: { kind: 'kite', hyp: 60, ang: 48, eye: 1.2, who: 'Liam', eyeLab: '1.2 m', hypLab: '60 m', unk: 'd' }
};
/** draws the scene into svg inside the box [x0, y0, x1, y1] → parts and groups (base, sketch, tri, roles, add) */
function liftScene(svg, cfg, box) {
  const [bx0, by0, bx1, by1] = box, gy = by1 - 50;
  const adj = cfg.adj ?? cfg.hyp * cosD(cfg.ang), opp = adj * tanD(cfg.ang);
  const s = Math.min((bx1 - bx0 - 200) / adj, (gy - by0 - 30 - 46) / opp), eyePx = Math.max(cfg.eye * s, 46);
  const xP = bx0 + 90, E = [xP, gy - eyePx], Hh = [xP + adj * s, E[1]], Tt = [Hh[0], E[1] - opp * s];
  const G = { base: grp(svg), tri: grp(svg), sketch: grp(svg), roles: grp(svg), add: grp(svg) };
  svgEl('rect', { x: bx0, y: by0, width: bx1 - bx0, height: by1 - by0, fill: SKY, rx: 12 }, G.base);
  groundLine(G.base, bx0, bx1, gy);
  person(G.base, [xP, gy], eyePx / 0.9);
  if (cfg.kind === 'flag') flagpole(G.base, Tt[0], Tt[1], gy);
  else { kiteG(G.base, [Tt[0] + 4, Tt[1] - 2], 1); line(G.base, Tt, [Tt[0], gy], { color: GREY, width: 2, dash: '3 5', cls: '' }); }
  // eye height
  dim(G.base, [xP - 34, gy], [xP - 34, E[1]], cfg.eyeLab, { off: [-36, 0], size: 18 });
  if (cfg.adjLab) dim(G.base, [xP, gy + 18], [Hh[0], gy + 18], cfg.adjLab, { off: [0, 16] });
  // sketch: horizontal, line of sight (or string), the angle
  const P = {};
  P.hz = line(G.sketch, E, [Hh[0] + 30, E[1]], { color: SLATE, width: 2.2, dash: '10 7' });
  P.sight = line(G.sketch, E, Tt, { color: cfg.kind === 'kite' ? INK : AMBER, width: cfg.kind === 'kite' ? 2.4 : 3.2 });
  P.arc = arcLab(G.sketch, E, 0, cfg.ang, 62, cfg.ang + '°', { color: AMBER, fill: true, size: 20 });
  if (cfg.hypLab) { const M = mid(E, Tt), n = A([0, 0], cfg.ang + 90, 22); P.hypT = txt(G.sketch, M[0] + n[0] - 8, M[1] + n[1], cfg.hypLab, { size: 20, weight: 800 }); }
  if (cfg.unk === 'h' || cfg.unk === 'x') P.unk = txt(G.sketch, Tt[0] + 34, (Tt[1] + E[1]) / 2, cfg.unk, { size: 24, color: RED, weight: 800, italic: true });
  if (cfg.unk === 'd') P.unk = txt(G.sketch, (E[0] + Hh[0]) / 2, E[1] + 22, 'd', { size: 24, color: BLUE, weight: 800, italic: true });
  // the right triangle above the eyes
  P.fill = path(G.tri, polyD([E, Hh, Tt]), { stroke: 'none', fill: AMBER, fo: 0.15, cls: '' });
  P.rm = square(G.tri, Hh, 90, 13);
  // roles
  P.opp = line(G.roles, Hh, Tt, { color: RED, width: 6 }); P.adj = line(G.roles, E, Hh, { color: BLUE, width: 6 }); P.hyp = line(G.roles, E, Tt, { color: HYP, width: 5 });
  const M = mid(E, Tt), n = A([0, 0], cfg.ang + 90, 26);
  P.tags = [txt(G.roles, Tt[0] + 34, (Tt[1] + E[1]) / 2 + 30, 'opp', { size: 18, color: RED, weight: 800 }),
    txt(G.roles, (E[0] + Hh[0]) / 2 + 70, E[1] + 22, 'adj', { size: 18, color: BLUE, weight: 800 }),
    cfg.hypLab ? txt(G.roles, M[0] - n[0] + 10, M[1] - n[1] + 8, 'hyp', { size: 18, color: HYP, weight: 800 }) : txt(G.roles, M[0] + n[0] - 50, M[1] + n[1] - 6, 'hyp', { size: 18, color: HYP, weight: 800 })];
  // add the eye height: the part of the object below eye level, and the total
  P.eyeSeg = line(G.add, [Hh[0], gy], Hh, { color: GREEN, width: 7, opacity: 0.8 });
  P.total = dim(G.add, [Hh[0] + 64, gy], [Hh[0] + 64, Tt[1]], '', { color: GREEN });
  return { G, P, E, Hh, Tt, s, gy, adj, opp };
}
const height = {
  title: 'Finding a height: the triangle starts at your eyes',
  height: 440,
  choices: [{ v: 'noor', label: 'Example 4 check' }, { v: 'ka', label: 'Example 5 (a) check' }, { v: 'kb', label: 'Example 5 (b) check' }],
  ask: (v) => (v === 'noor' ? 'Noor stands 24 m from a flagpole. Her eyes are 1.6 m up. The angle of elevation is 31°. How tall is the pole?'
    : v === 'ka' ? 'Liam’s kite string is 60 m long, held 1.2 m up, at an angle of elevation of 48°. How high is the kite?'
      : 'Liam’s kite string is 60 m long at 48°. How far is he from the spot right under the kite?'),
  make(stage, v, ex) {
    const W = ex.W, H = 440, svg = stageSvg(stage, W, H), m = LIFT[v];
    const S = liftScene(svg, m, [0, 0, 600, H]), G = S.G, P = S.P;
    hide(G.sketch, G.tri, G.roles, G.add);
    const wk = add(stage, h('div', 'u7l7-work'), 640, 18);
    const L = (html) => { const e = hide(h('div', 'u7l7-wl', html)); wk.appendChild(e); return e; };
    const kite = m.kind === 'kite';
    const showG = async (c, g, ms = 450) => { g.style.opacity = 1; await c.anim(g, [{ opacity: 0 }, { opacity: 1 }], ms); };
    const sketch = { cap: kite ? 'Step 1: <b>Sketch</b> it. The string starts at Liam’s <b>hand</b>, 1.2 m up. The horizontal goes out level from there.'
      : 'Step 1: <b>Sketch</b> it. The horizontal goes out from Noor’s <b>eyes</b>, 1.6 m up. Draw the line of sight and the 31° angle.',
    run: async (c) => { G.sketch.style.opacity = 1; [P.unk, P.hypT].forEach((e) => e && hide(e)); hide(P.arc); await drawIn(P.hz, 600, c); await drawIn(P.sight, 700, c); await c.anim(P.arc, [{ opacity: 0 }, { opacity: 1 }], 350); for (const e of [P.hypT, P.unk]) if (e) await c.pop(e); } };
    const tri = { cap: kite ? 'Step 2: the <b>right triangle</b> sits on top of his hand: its bottom side is the horizontal, not the ground.'
      : 'Step 2: the <b>right triangle</b> sits on top of her eyes: its bottom side is the horizontal, not the ground.', run: (c) => showG(c, G.tri, 600) };
    if (v === 'noor') {
      const h1 = 24 * tanD(31);
      const l1 = L(T('\\tan31^\\circ=\\dfrac{h}{24}')), l2 = L(T(`h=24\\times\\tan31^\\circ\\approx${fx(h1, 2)}\\text{ m}`)), l3 = L(T(`${fx(h1, 2)}+1.6=${fx(h1 + 1.6, 2)}`)), l4 = L(`<b>The flagpole is about 16.0 m tall.</b>`);
      const tot = hide(txt(svg, S.Hh[0] + 102, (S.gy + S.Tt[1]) / 2, '16.0 m', { size: 22, color: GREEN, weight: 800 }));
      const st = hide(stamp(stage, 'makes sense ✓', { ok: true, x: 800, y: 380, size: 'sm' }));
      return [sketch, tri,
        { cap: 'Step 3: from the 31° angle, <b>h</b> (above her eyes) is <b>opp</b> and 24 m is <b>adj</b>.', run: async (c) => { await showG(c, G.roles); } },
        { cap: 'Step 4: opp and adj → <b>tan</b>. h is on top, so <b>multiply</b>.', run: async (c) => { await c.fadeIn(l1); await c.fadeIn(l2); } },
        { cap: `Step 5: that is only the part <b>above her eyes</b>. Add her eye height: ${pn(fx(h1, 2))} + 1.6 ≈ <b>16.0 m</b>.`, run: async (c) => { await showG(c, G.add, 600); await c.pop(tot); await c.fadeIn(l3); } },
        { cap: 'Check: 31° is less than 45°, so h is less than 24 m ✓. The flagpole is about <b>16.0 m</b> tall.', run: async (c) => { await c.fadeIn(l4); await stampIn(c, st); } }];
    }
    if (v === 'ka') {
      const x = 60 * sinD(48);
      const l1 = L(T('\\sin48^\\circ=\\dfrac{x}{60}')), l2 = L(T(`x=60\\times\\sin48^\\circ\\approx${fx(x, 2)}\\text{ m}`)), l3 = L(T(`${fx(x, 2)}+1.2=${fx(x + 1.2, 2)}`)), l4 = L('<b>The kite is about 45.8 m above the ground.</b>');
      const tot = hide(txt(svg, S.Hh[0] + 102, (S.gy + S.Tt[1]) / 2, '45.8 m', { size: 22, color: GREEN, weight: 800 }));
      return [sketch, tri,
        { cap: 'Step 3: from 48°, the string (60 m) is <b>hyp</b>. The height above his hand, x, is <b>opp</b>.', run: (c) => showG(c, G.roles) },
        { cap: 'Step 4: opp and hyp → <b>sin</b>. x is on top, so <b>multiply</b>.', run: async (c) => { await c.fadeIn(l1); await c.fadeIn(l2); } },
        { cap: `Step 5: add his hand height: ${fx(x, 2)} + 1.2 ≈ <b>45.8 m</b>. Check: x is less than the 60 m string ✓.`, run: async (c) => { await showG(c, G.add, 600); await c.pop(tot); await c.fadeIn(l3); await c.fadeIn(l4); } }];
    }
    const d = 60 * cosD(48);
    const l1 = L(T('\\cos48^\\circ=\\dfrac{d}{60}')), l2 = L(T(`d=60\\times\\cos48^\\circ\\approx${fx(d, 1)}\\text{ m}`)), l3 = L('<b>Liam is about 40.1 m from that spot.</b>');
    const st = hide(stamp(stage, 'no hand height!', { ok: null, x: 800, y: 370, size: 'sm' }));
    return [sketch, tri,
      { cap: 'Step 3: from 48°, the string (60 m) is <b>hyp</b>. The distance along the ground, d, is <b>adj</b>.', run: (c) => showG(c, G.roles) },
      { cap: 'Step 4: adj and hyp → <b>cos</b>. d is on top, so <b>multiply</b>.', run: async (c) => { await c.fadeIn(l1); await c.fadeIn(l2); } },
      { cap: 'Nothing to add: d is a distance <b>along the ground</b>, not a height. Check: d is less than 60 m ✓.', run: async (c) => { await c.fadeIn(l3); await stampIn(c, st); } }];
  }
};

/* ======================================================================================
 * 4x. The 45° check (Full notes)
 * ====================================================================================== */
const check45 = {
  title: 'The 45° check',
  height: 420,
  make(stage, v, ex) {
    const W = ex.W, H = 420, svg = stageSvg(stage, W, H), gy = 380, s = 9.2, D = 20, eyePx = 42;
    svgEl('rect', { x: 0, y: 0, width: 560, height: H, fill: SKY, rx: 12 }, svg);
    groundLine(svg, 0, 560, gy);
    const xP = 80, E = person(svg, [xP, gy], eyePx / 0.9).eye, xW = xP + D * s;
    buildingG(svg, xW, xW + 120, 20, gy);
    dim(svg, [xP, gy + 18], [xW, gy + 18], '20 m', { off: [0, 14] });
    const dyn = grp(svg);
    // bars
    const bx = 640, by = gy, bs = 7;
    const barD = add(stage, h('div', 'u7l7-bar u7l7-barb'), bx, by - D * bs); barD.style.height = D * bs + 'px';
    const barH = add(stage, h('div', 'u7l7-bar u7l7-barr'), bx + 130, by); barH.style.height = '0px';
    lab(stage, 'distance', bx + 40, by + 18, 'u7l7-small'); lab(stage, 'height above eyes', bx + 170, by + 18, 'u7l7-small');
    const vD = lab(stage, '20 m', bx + 40, by - D * bs - 20, 'u7l7-bv u7l7-bvb'), vH = lab(stage, '', bx + 170, by - 20, 'u7l7-bv u7l7-bvr');
    let ang = 0;
    function set(a) {
      ang = a; dyn.innerHTML = ''; const hh = D * tanD(a), T2 = [xW, E[1] - hh * s];
      line(dyn, E, [xW, E[1]], { color: BLUE, width: 5, cls: '' }); line(dyn, [xW, E[1]], T2, { color: RED, width: 5, cls: '' }); line(dyn, E, T2, { color: AMBER, width: 3, cls: '' });
      dot(dyn, T2, { r: 7, color: RED }); if (a > 0.5) arcLab(dyn, E, 0, a, 56, Math.round(a) + '°', { color: AMBER, fill: true });
      barH.style.top = (by - hh * bs) + 'px'; barH.style.height = hh * bs + 'px'; vH.style.top = (by - hh * bs - 20) + 'px'; vH.inner.textContent = a > 0.5 ? Geo.fmtLen(hh, 1) + ' m' : '';
    }
    set(0);
    const eq = hide(stamp(stage, 'equal at 45°', { ok: true, x: 870, y: 120, size: 'sm' }));
    const rule = hide(lab(stage, 'less than 45° → less than the distance<br>more than 45° → more than the distance', 780, 60, 'u7l7-res u7l7-small2'));
    return [
      { cap: `Stand 20 m from a building and look up at 30°. Height above your eyes: 20 × tan 30° ≈ <b>11.5 m</b>, <b>less</b> than 20 m.`, run: (c) => tween(c, 1300, (u) => set(30 * u)) },
      { cap: 'At <b>45°</b> the triangle has two <b>equal legs</b>: the height above your eyes is <b>20 m</b>, the same as the distance.', run: async (c) => { await tween(c, 1200, (u) => set(30 + 15 * u)); await stampIn(c, eq); } },
      { cap: `At 60°: 20 × tan 60° ≈ <b>34.6 m</b>, <b>more</b> than 20 m.`, run: async (c) => { await c.anim(eq, [{ opacity: 1 }, { opacity: 0 }], 250); await tween(c, 1200, (u) => set(45 + 15 * u)); } },
      { cap: 'So 45° is a quick check: compare your angle with 45° before you trust the calculator.', run: (c) => c.pop(rule) }
    ];
  }
};

/* ======================================================================================
 * 5. Looking down: the lighthouse, Ava’s canoe, the plane (Examples 6 and 7)
 * ====================================================================================== */
const depress = {
  title: 'Looking down: move the angle to the bottom',
  height: 430,
  choices: [{ v: 'lh', label: 'The lighthouse' }, { v: 'ava', label: 'Example 6 check' }, { v: 'p1', label: 'Example 7 (a) check' }, { v: 'p2', label: 'Example 7 (b) check' }],
  ask: (v) => (v === 'lh' ? 'A lighthouse keeper’s eyes are 30 m above the water. How far away is a boat she sees at an angle of depression of 15°?'
    : v === 'ava' ? 'Ava is 45 m above a lake. A canoe is at an angle of depression of 17°. How far is it from the base of the cliff?'
      : v === 'p1' ? 'A plane is 1&#8239;800 m up and comes down at an angle of depression of 4°. What is the horizontal distance to touchdown?'
        : 'A plane is 1&#8239;800 m up and comes down at an angle of depression of 4°. How far does it fly along its path?'),
  make(stage, v, ex) {
    const W = ex.W, H = 430, svg = stageSvg(stage, W, H);
    const wk = add(stage, h('div', 'u7l7-work u7l7-work2'), 430, 14);
    const L = (html) => { const e = hide(h('div', 'u7l7-wl', html)); wk.appendChild(e); return e; };
    if (v === 'lh') {
      const hM = 30, xs = [15, 25, 45].map((a) => hM / tanD(a)), s = 760 / xs[0];
      const S = depScene(svg, { W, H, x0: 150, gy: 360, s, hM, xM: xs[0], obs: 'lighthouse', tgt: 'boat', hLab: '30 m', xLab: 'x', topLab: '15°', eyeH: 30, rTop: 70, rBot: 70 });
      const l1 = L(T(`x=\\dfrac{30}{\\tan15^\\circ}\\approx${fx(xs[0])}\\text{ m}`)), l2 = L(T(`x=\\dfrac{30}{\\tan25^\\circ}\\approx${fx(xs[1])}\\text{ m}`)), l3 = L(T(`x=\\dfrac{30}{\\tan45^\\circ}=${fx(xs[2])}\\text{ m}`));
      const st = hide(stamp(stage, 'closer!', { ok: true, x: 880, y: 250, size: 'sm' }));
      const go = (i0, i1) => (c) => tween(c, 1600, (u) => { const a = [15, 25, 45][i0] + ([15, 25, 45][i1] - [15, 25, 45][i0]) * u; S.set({ xM: hM / tanD(a), topLab: Math.round(a) + '°', xl: fx(hM / tanD(a)) + ' m' }); });
      return [
        { cap: 'The keeper’s eyes are <b>30 m</b> above the water. She sees a boat at an angle of depression of <b>15°</b>.', run: async (c) => { const P = S.set({ top: true, sight: true, hz: true }); hide(P.top); await drawIn(P.hz, 500, c); await drawIn(P.sight, 600, c); await c.anim(P.top, [{ opacity: 0 }, { opacity: 1 }], 350); } },
        { cap: 'Move the angle down to the boat: the angle of elevation there is also <b>15°</b>. Now 30 m is <b>opp</b> and x is <b>adj</b>.', run: async (c) => { await S.fly(c); S.set({ bottom: true, roles: true, botLab: null }); } },
        { cap: `x is on the bottom, so <b>divide</b>: x = 30 ÷ tan 15° ≈ <b>${fx(xs[0])} m</b>.`, run: async (c) => { await c.fadeIn(l1); } },
        { cap: `The boat sails in. At <b>25°</b>: x = 30 ÷ tan 25° ≈ <b>${fx(xs[1])} m</b>.`, run: async (c) => { await go(0, 1)(c); await c.fadeIn(l2); } },
        { cap: `At <b>45°</b>: x = 30 m, the same as the height. A <b>bigger</b> angle of depression means a <b>closer</b> boat.`, run: async (c) => { await go(1, 2)(c); await c.fadeIn(l3); await stampIn(c, st); } }
      ];
    }
    if (v === 'ava') {
      const hM = 45, x = hM / tanD(17), s = 700 / x;
      const S = depScene(svg, { W, H, x0: 170, gy: 360, s, hM, xM: x, obs: 'cliff', tgt: 'canoe', hLab: '45 m', xLab: 'x', topLab: '17°', eyeH: 40, rTop: 110, rBot: 110 });
      const l1 = L(T('\\tan17^\\circ=\\dfrac{45}{x}')), l2 = L(T(`x=\\dfrac{45}{\\tan17^\\circ}\\approx${fx(x)}\\text{ m}`)), l3 = L('<b>The canoe is about 147.2 m from the base of the cliff.</b>');
      const st = hide(stamp(stage, 'makes sense ✓', { ok: true, x: 780, y: 290, size: 'sm' }));
      return [
        { cap: 'Step 1: sketch. Ava looks <b>down</b> at the canoe: the angle of depression, 17°, is at the <b>top</b>, outside the triangle.', run: async (c) => { const P = S.set({ top: true, sight: true, hz: true }); hide(P.top); await drawIn(P.hz, 500, c); await drawIn(P.sight, 600, c); await c.anim(P.top, [{ opacity: 0 }, { opacity: 1 }], 350); } },
        { cap: 'Step 2: move it to the canoe. The angle of elevation there is also <b>17°</b> (alternate interior angles).', run: async (c) => { await S.fly(c); S.set({ bottom: true, tri: true }); } },
        { cap: 'Step 3: from the 17° at the canoe, 45 m is <b>opp</b> and x is <b>adj</b>.', run: async (c) => { S.set({ roles: true }); await pulse(c, S.parts.opp, 1.02, 400); } },
        { cap: 'Step 4: opp and adj → <b>tan</b>. x is on the <b>bottom</b>, so <b>divide</b>.', run: async (c) => { await c.fadeIn(l1); await c.fadeIn(l2); } },
        { cap: 'Check: 17° is much less than 45°, so x is much more than 45 m ✓. The canoe is about <b>147.2 m</b> from the cliff.', run: async (c) => { await c.fadeIn(l3); await stampIn(c, st); } }
      ];
    }
    const hM = 1800, x = hM / tanD(4), d = hM / sinD(4), s = 700 / x, vx = 3.6;
    const S = depScene(svg, { W, H, x0: 140, gy: 390, s, vx, hM, xM: x, obs: 'plane', tgt: 'runway', surface: 'ground', hLab: '1\u202f800 m', xLab: 'x', dLab: v === 'p2' ? 'd' : null, topLab: '4°', rTop: 150, rBot: 150 });
    txt(svg, W - 90, 410, '(not to scale)', { size: 15, color: GREY, weight: 600 });
    if (v === 'p1') {
      const l1 = L(T('\\tan4^\\circ=\\dfrac{1\\,800}{x}')), l2 = L(T(`x=\\dfrac{1\\,800}{\\tan4^\\circ}\\approx${tn(Math.round(x))}\\text{ m}`)), l3 = L(T(`${tn(Math.round(x))}\\text{ m}\\div1\\,000\\approx${fx(x / 1000)}\\text{ km}`));
      return [
        { cap: 'The plane is <b>1&#8239;800 m</b> up and comes down in a straight line at an angle of depression of <b>4°</b>.', run: async (c) => { const P = S.set({ top: true, sight: true, hz: true }); hide(P.top); await drawIn(P.hz, 500, c); await drawIn(P.sight, 700, c); await c.anim(P.top, [{ opacity: 0 }, { opacity: 1 }], 350); } },
        { cap: 'At the touchdown spot the angle of elevation is also <b>4°</b>. From it, 1&#8239;800 m is <b>opp</b> and x is <b>adj</b>.', run: async (c) => { await S.fly(c); S.set({ bottom: true, roles: true }); } },
        { cap: 'Opp and adj → <b>tan</b>. x is on the bottom, so <b>divide</b>.', run: async (c) => { await c.fadeIn(l1); await c.fadeIn(l2); } },
        { cap: `Change to kilometres: about <b>${fx(x / 1000)} km</b> away horizontally.`, run: (c) => c.fadeIn(l3) }
      ];
    }
    const l1 = L(T('\\sin4^\\circ=\\dfrac{1\\,800}{d}')), l2 = L(T(`d=\\dfrac{1\\,800}{\\sin4^\\circ}\\approx${tn(Math.round(d))}\\text{ m}`)), l3 = L(T(`\\approx${fx(d / 1000)}\\text{ km}`));
    const st = hide(stamp(stage, 'hyp is the longest ✓', { ok: true, x: 760, y: 300, size: 'sm' }));
    return [
      { cap: 'Move the 4° to the touchdown spot. The path the plane flies, d, is the <b>hypotenuse</b>; 1&#8239;800 m is <b>opp</b>.', run: async (c) => { const P = S.set({ top: true, sight: true, hz: true }); hide(P.top); await c.anim(P.top, [{ opacity: 0 }, { opacity: 1 }], 300); await S.fly(c); S.set({ bottom: true, roles: true }); } },
      { cap: 'Opp and hyp → <b>sin</b>. d is on the bottom, so <b>divide</b>.', run: async (c) => { await c.fadeIn(l1); await c.fadeIn(l2); } },
      { cap: `About <b>${fx(d / 1000)} km</b>. Check: the path (hyp) is the longest side, a little longer than x ≈ ${fx(x / 1000)} km ✓.`, run: async (c) => { await c.fadeIn(l3); await stampIn(c, st); } }
    ];
  }
};

/* ======================================================================================
 * 5x. Multiply or divide? (Full notes)
 * ====================================================================================== */
const divide = {
  title: 'Multiply or divide?',
  height: 460,
  make(stage, v, ex) {
    const W = ex.W, H = 460, svg = stageSvg(stage, W, H);
    const top = lab(stage, `${T('\\tan17^\\circ=\\dfrac{45}{x}')} &nbsp; Two students get two answers.`, W / 2, 30, 'u7l7-res');
    hide(top);
    const cards = [{ x0: 20, xM: 45 * tanD(17), ok: false, t: `45\\times\\tan17^\\circ\\approx${fx(45 * tanD(17))}\\text{ m}` }, { x0: W / 2 + 10, xM: 45 / tanD(17), ok: true, t: `\\dfrac{45}{\\tan17^\\circ}\\approx${fx(45 / tanD(17))}\\text{ m}` }];
    const els = cards.map((cd) => {
      const g = hide(grp(svg)), w = W / 2 - 30, s = (w - 80) / 160, gy = 330, E = [cd.x0 + 50, gy - 45 * s];
      svgEl('rect', { x: cd.x0, y: 70, width: w, height: 300, rx: 12, fill: SKY }, g);
      waterLine(g, cd.x0 + 50, cd.x0 + w, gy, 40); cliffG(g, cd.x0 + 50, E[1], gy, 40);
      const B = [E[0] + cd.xM * s, gy]; canoeG(g, [B[0], gy + 2], 30);
      line(g, E, [cd.x0 + w - 10, E[1]], { color: SLATE, width: 2, dash: '8 6', cls: '' }); line(g, E, B, { color: AMBER, width: 3, cls: '' });
      const a = Math.atan2(gy - E[1], B[0] - E[0]) / RAD; arcLab(g, E, -a, a, 40, Math.round(a) + '°', { color: cd.ok ? GREEN : RED, fill: true, size: 19 });
      const eq = lab(stage, T(cd.t), cd.x0 + w / 2, 110, 'u7l7-res'); hide(eq);
      const st = hide(stamp(stage, cd.ok ? 'makes sense' : 'not 17°!', { ok: cd.ok, x: cd.x0 + w - 90, y: 200, size: 'sm' }));
      return { g, eq, st };
    });
    const why = hide(lab(stage, `${T('x\\times\\tan17^\\circ=45')} &nbsp;→&nbsp; ${T('x=\\dfrac{45}{\\tan17^\\circ}')}`, W / 2, 418, 'u7l7-res'));
    return [
      { cap: `Ava’s canoe: ${T('\\tan17^\\circ=\\dfrac{45}{x}')}. Two students get two different answers.`, run: (c) => c.pop(top) },
      { cap: 'Multiply: about <b>13.8 m</b>. Draw it: a canoe that close makes a <b>steep</b> angle of about 73°, not 17°. ✗', run: async (c) => { const e = els[0]; show(e.g); await c.anim(e.g, [{ opacity: 0 }, { opacity: 1 }], 400); await c.pop(e.eq); await stampIn(c, e.st); } },
      { cap: 'Divide: about <b>147.2 m</b>. A shallow 17° means the canoe is <b>far</b> away. ✓', run: async (c) => { const e = els[1]; show(e.g); await c.anim(e.g, [{ opacity: 0 }, { opacity: 1 }], 400); await c.pop(e.eq); await stampIn(c, e.st); } },
      { cap: 'Why divide? x is on the <b>bottom</b>. Multiply both sides by x, then divide both sides by tan 17°.', run: (c) => c.pop(why) }
    ];
  }
};

mountExplainers({ defs, which, zangle, whyEqual, clino, height, check45, depress, divide });

/* ======================================================================================
 * The activity: a clinometer you drag to sight the top of a tree
 * ====================================================================================== */
(function tool() {
  const host = document.getElementById('u7l7-tool'); if (!host) return;
  const wrap = add(host, h('div', 'u7l7-tw'));
  const sceneBox = add(wrap, h('div', 'u7l7-tscene'));
  const SW = 370, SH = 340, svg = figSvg(sceneBox, SW, SH), eyeM = 1.5;
  const clBox = add(wrap, h('div', 'u7l7-tclino'));
  const msg = add(host, h('div', 'u7l7-tmsg', ''));
  const bar = add(host, h('div', 'u7l7-tbar'));
  const bNew = add(bar, h('button', 'pill', 'New tree')), bHide = add(bar, h('button', 'pill', 'Hide the reading')), bH = add(bar, h('button', 'pill', 'Find the height'));
  [bNew, bHide, bH].forEach((b) => { b.type = 'button'; });
  const res = add(host, h('div', 'u7l7-tres', ''));
  const TREES = [[15, 38], [20, 34], [12, 52], [24, 29], [18, 45], [25, 41], [30, 27], [16, 56], [22, 36]];
  let ti = 0, D, tgt, F, sight, topRing, hideRead = false, onT = false, ready = false;
  function scene() {
    svg.innerHTML = ''; [D, tgt] = TREES[ti % TREES.length];
    const tot = eyeM + D * tanD(tgt), gy = SH - 40, s = Math.min((SW - 150) / D, (gy - 30) / tot), xP = 84, E = [xP, gy - Math.max(eyeM * s, 40)], xT = xP + D * s, yT = E[1] - D * tanD(tgt) * s;
    svgEl('rect', { x: 0, y: 0, width: SW, height: SH, fill: SKY, rx: 12 }, svg);
    groundLine(svg, 0, SW, gy); person(svg, [xP, gy], (gy - E[1]) / 0.9); treeG(svg, xT, yT, gy);
    dim(svg, [xP, gy + 16], [xT, gy + 16], D + ' m', { off: [0, 14], size: 17 });
    dim(svg, [xP - 26, gy], [xP - 26, E[1]], '1.5 m', { off: [-30, 0], size: 16 });
    line(svg, E, [SW - 10, E[1]], { color: SLATE, width: 2, dash: '8 6', cls: '' });
    topRing = svgEl('circle', { cx: xT, cy: yT, r: 11, fill: 'none', stroke: GREEN, 'stroke-width': 4, opacity: 0 }, svg);
    sight = line(svg, E, E, { color: AMBER, width: 3, cls: '' });
    F = { E, xT, yT, s };
  }
  function update(r) {
    if (!ready) return;
    const a = r ? r.elevation * (r.up ? 1 : -1) : 0, L = 1200, Q = A(F.E, a, L);
    sight.setAttribute('x2', Q[0].toFixed(1)); sight.setAttribute('y2', Q[1].toFixed(1));
    onT = Math.abs(a - tgt) < 0.5; topRing.setAttribute('opacity', onT ? 1 : 0);
    msg.innerHTML = onT ? `<b>On target!</b> The line of sight hits the top of the tree.` : a > tgt ? 'Too high: tilt the straw <b>down</b> a little.' : 'Tilt the straw <b>up</b> until the line of sight hits the top of the tree.';
    msg.classList.toggle('u7l7-ok', onT); bH.disabled = !onT; if (!onT) res.innerHTML = '';
  }
  scene();
  const K = clinoFig(clBox, { width: 380, height: 300, r: 145, cx: 196, cy: 112, angle: 10, interactive: true, readout: true, min: 0, max: 75, onChange: (r) => update(r) });
  ready = true; update(K.reading());
  bNew.onclick = () => { ti++; scene(); K.set(10); res.innerHTML = ''; };
  bHide.onclick = () => { hideRead = !hideRead; clBox.classList.toggle('u7l7-hideread', hideRead); bHide.textContent = hideRead ? 'Show the reading' : 'Hide the reading'; };
  bH.onclick = () => {
    if (!onT) return; const hh = D * tanD(tgt);
    res.innerHTML = `Angle of elevation <b>${tgt}°</b>. Height above eyes ${T(`=${D}\\times\\tan${tgt}^\\circ\\approx${fx(hh, 2)}`)} m. Add the eye height: ${T(`${fx(hh, 2)}+1.5\\approx${fx(hh + 1.5, 1)}`)} m. The tree is about <b>${fx(hh + 1.5, 1)} m</b> tall.`;
  };
}());

/* ======================================================================================
 * Static figures
 * ====================================================================================== */
const FIG = {
  ex1a: (host) => ex1Pic(figSvg(host, 236, 214), 'a', 62, 22, 196),
  ex1b: (host) => ex1Pic(figSvg(host, 236, 214), 'b', 62, 22, 196),
  ex1c: (host) => ex1Pic(figSvg(host, 236, 214), 'c', 62, 22, 200),
  ex1d: (host) => ex1Pic(figSvg(host, 236, 214), 'd', 62, 30, 196),
  ex2c(host) {
    const svg = figSvg(host, 420, 250), hM = 25, xM = hM / tanD(26), s = 300 / xM;
    const S = depScene(svg, { W: 420, H: 250, x0: 70, gy: 214, s, hM, xM, obs: 'cliff', tgt: 'canoe', hLab: '', xLab: '', vertLab: '64°', eyeH: 30 });
    S.set({ vert: true, sight: true, hz: true });
    txt(svg, 330, 236, '(c)', { size: 18, weight: 700 });
  },
  make(host) {
    const R = 150, C = [215, 120], t = 20, K = clinoFig(host, { width: 430, height: 340, r: R, cx: C[0], cy: C[1], angle: t });
    const s2 = K.svg, c = cosD(t), sn = sinD(t), ex = -R - 34, ey = -7;
    const eye = [C[0] + ex * c + ey * sn, C[1] - ex * sn + ey * c];
    txt(s2, eye[0], eye[1] + 28, 'eye', { size: 17, weight: 700 });
    const top = A(C, t, R + 70); txt(s2, top[0] - 70, top[1] - 26, 'to the top', { size: 17, color: AMBER, weight: 700 });
    txt(s2, C[0] - 12, C[1] + R + 12, 'string', { size: 17, weight: 700, anchor: 'end' });
    txt(s2, C[0] + 18, C[1] + R * 1.08 + 12, 'weight', { size: 17, weight: 700, anchor: 'start' });
  },
  ex3a: (host) => clinoFig(host, { width: 440, height: 330, r: 160, cx: 220, cy: 120, angle: 25 }),
  ex3b: (host) => clinoFig(host, { width: 440, height: 340, r: 160, cx: 220, cy: 140, angle: 40 }),
  ex4(host) {
    const svg = figSvg(host, 440, 330), S = liftScene(svg, LIFT.noor, [0, 0, 440, 330]);
    [S.G.tri, S.G.roles, S.G.add].forEach((g) => g.remove());
  },
  ex5(host) {
    const svg = figSvg(host, 420, 360), S = liftScene(svg, Object.assign({}, LIFT.ka, { unk: null }), [0, 0, 420, 360]);
    [S.G.tri, S.G.roles, S.G.add].forEach((g) => g.remove());
  },
  ex6(host) {
    const svg = figSvg(host, 460, 250), hM = 45, x = hM / tanD(17), s = 330 / x;
    const S = depScene(svg, { W: 460, H: 250, x0: 80, gy: 214, s, hM, xM: x, obs: 'cliff', tgt: 'canoe', hLab: '45 m (opp)', xLab: 'x (adj)', topLab: '17°', eyeH: 26, rTop: 70, rBot: 70 });
    S.set({ top: true, bottom: true, sight: true, hz: true });
  },
  ex7(host) {
    const svg = figSvg(host, 440, 210), hM = 1800, x = hM / tanD(4), s = 330 / x;
    const S = depScene(svg, { W: 440, H: 210, x0: 70, gy: 176, s, vx: 3.6, hM, xM: x, obs: 'plane', tgt: 'runway', surface: 'ground', hLab: '1\u202f800 m', xLab: 'x', dLab: 'd', topLab: '4°', rTop: 90, rBot: 90 });
    S.set({ top: true, bottom: true, sight: true, hz: true });
    txt(svg, 370, 200, '(not to scale)', { size: 13, color: GREY, weight: 600 });
  }
};
document.querySelectorAll('.u7l7-fig[data-fig]').forEach((host) => { const f = FIG[host.dataset.fig]; if (f) f(host); });

/* ======================================================================================
 * Stand Up Break
 * ====================================================================================== */
standup('u7l7', {
  intro: 'Sketch it first: the horizontal, the line of sight, the angle. Then label opp, adj, hyp. Does your answer make sense?',
  levels: {
    BEG: (r) => r.pick([
      () => { let x; do { x = r.int(40, 140); } while (Math.abs(x - 90) < 5); const a = Math.abs(x - 90);
        return { text: `A clinometer reads <b>${x}°</b>. What is the angle of elevation?`, q: '', a: [x < 90 ? `90^\\circ-${x}^\\circ=${a}^\\circ` : `${x}^\\circ-90^\\circ=${a}^\\circ`] }; },
      () => { const v = r.int(48, 82);
        return { text: `From a balcony, Sara’s line of sight to a dog makes <b>${v}°</b> with the wall of the building (the vertical). What is the angle of depression? What is the angle of elevation from the dog to Sara?`, q: '', a: [`\\text{depression}=90^\\circ-${v}^\\circ=${90 - v}^\\circ`, `\\text{elevation}=${90 - v}^\\circ\\ \\text{(equal)}`] }; }
    ])(),
    PRG: (r) => {
      const d = r.pick([12, 15, 18, 20, 24, 25, 30, 35, 40]), a = r.int(22, 62), e = r.pick([1.4, 1.5, 1.6, 1.7, 1.8]), hh = d * tanD(a);
      return { text: `You stand <b>${d} m</b> from a tree. Your eyes are <b>${e} m</b> above the ground. The angle of elevation to the top is <b>${a}°</b>. How tall is the tree, to the nearest tenth of a metre?`, q: '',
        a: [`\\tan${a}^\\circ=\\dfrac{h}{${d}}`, `h=${d}\\times\\tan${a}^\\circ\\approx${fx(hh, 2)}\\text{ m}`, `${fx(hh, 2)}+${e}=${fx(hh + e, 2)}\\approx${fx(hh + e, 1)}\\text{ m}`] };
    },
    MAS: (r) => r.pick([
      () => { const H = r.pick([20, 25, 30, 35, 40, 48, 55, 60, 75]), a = r.int(8, 40), x = H / tanD(a);
        return { text: `From the top of a <b>${H} m</b> cliff, the angle of depression to a boat is <b>${a}°</b>. How far is the boat from the base of the cliff, to the nearest tenth of a metre?`, q: '',
          a: [`\\text{angle of elevation at the boat}=${a}^\\circ`, `\\tan${a}^\\circ=\\dfrac{${H}}{x}`, `x=\\dfrac{${H}}{\\tan${a}^\\circ}\\approx${fx(x, 1)}\\text{ m}`] }; },
      () => { const L = r.pick([40, 50, 55, 65, 70, 80, 90]), a = r.int(30, 65), e = r.pick([1, 1.1, 1.2, 1.3]), x = L * sinD(a);
        return { text: `A kite is on <b>${L} m</b> of straight string, held <b>${e} m</b> above the ground. The angle of elevation is <b>${a}°</b>. How high is the kite above the ground, to the nearest tenth of a metre?`, q: '',
          a: [`\\sin${a}^\\circ=\\dfrac{x}{${L}}`, `x=${L}\\times\\sin${a}^\\circ\\approx${fx(x, 2)}\\text{ m}`, `${fx(x, 2)}+${e}\\approx${fx(x + e, 1)}\\text{ m}`] }; }
    ])()
  }
});
