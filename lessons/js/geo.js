/* Geometry toolkit for the teaching pages: Unit 5 (angles, parallel lines, bearings, constructions, spatial puzzles) and
 * Units 6–7 (similar figures, grid drawing, scales and maps, right triangles, Pythagoras, trig ratios, elevation, clinometer,
 * shadows, mirrors). Reference: lessons/BLOCKS.md ("Geometry toolkit (Unit 5)" and "(Units 6–7)"). Demo / test bed: lessons/dev/geo.html (js/dev/geo-demo.js).
 *
 *   import { Geo } from '../geo.js';      (from js/lessons/u5lN.js; it imports blocks.js itself)
 *
 * Same conventions as blocks.js:
 *  - Builders take (host, opts). host is an <svg> (or a <g> inside one: the figure is drawn into it) or an HTML element
 *    (a card or an explainer stage: a sized box with its own <svg> is made; opts.x / opts.y place it absolutely).
 *  - Positions are SVG px (y down). DIRECTIONS AND ANGLES ARE MATH DEGREES: 0 = east (right), counterclockwise positive,
 *    so 90 = up. (Bearings in compassRose are true bearings: clockwise from north.)
 *  - Creating draws the figure at once (static). Animating takes the explainer context `c` FIRST and returns a Promise;
 *    without `c` it is instant, so the same calls draw static figures (Back / Start over just work).
 *  - Draggable things carry data-tap (a Pencil stroke or finger tap on them never inks or advances an explainer) and
 *    touch-action: none. Pointer positions go through the SVG's screen matrix (lesson scaling, explainer scaling) and
 *    every drag is measured from where it started, so a constant offset between the pointer and the layout (Safari
 *    under pinch zoom, see ink.js) cancels out.
 */
import { svgEl, h, tween, pop, fadeIn, appear, drawIn, arrowHead, COLORS } from './blocks.js';

/* ================================ basics ================================ */
const INK = '#1c2230', SLATE = '#3a4254', GREY = '#6a7182', LIGHT = '#9aa0ab', BLUE = '#1f5bd6', RED = '#c93a33',
  GREEN = '#12805a', AMBER = '#c27a0e', PURPLE = '#7b4fc4', PENCIL = '#7d8594';
const RAD = Math.PI / 180;
const col = (c, d) => (c ? COLORS[c] || c : d);
export const n360 = (a) => ((a % 360) + 360) % 360;
export const n180 = (a) => { a = n360(a); return a > 180 ? a - 360 : a; };
/** the point at distance r from V in direction deg (math degrees) */
export const at = (V, deg, r) => [V[0] + r * Math.cos(deg * RAD), V[1] - r * Math.sin(deg * RAD)];
/** direction (math degrees, 0–360) from V to Q */
export const dirTo = (V, Q) => n360(Math.atan2(-(Q[1] - V[1]), Q[0] - V[0]) / RAD);
export const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const r2 = (v) => Math.round(v * 100) / 100;
const fmtDeg = (v) => { const r = Math.round(v * 10) / 10; return String(Math.abs(r - Math.round(r)) < 1e-9 ? Math.round(r) : r); };
/** a 3-digit true bearing: 45 → "045", 22.5 → "022.5" */
export const bearingText = (b) => { b = n360(Math.round(b * 10) / 10); const w = Math.floor(b + 1e-9), f = Math.round((b - w) * 10); return String(w).padStart(3, '0') + (f ? '.' + f : ''); };
const pts = (a) => a.map((p) => p[0].toFixed(2) + ' ' + p[1].toFixed(2));
/** SVG arc path: centre V, radius r, from direction start, turning span degrees (positive = counterclockwise) */
export function arcD(V, r, start, span) {
  if (Math.abs(span) >= 359.99) span = Math.sign(span) * 359.99;
  const a = at(V, start, r), b = at(V, start + span, r);
  return `M${a[0].toFixed(2)} ${a[1].toFixed(2)}A${r} ${r} 0 ${Math.abs(span) > 180 ? 1 : 0} ${span > 0 ? 0 : 1} ${b[0].toFixed(2)} ${b[1].toFixed(2)}`;
}
export const wedgeD = (V, r, start, span) => `M${V[0].toFixed(2)} ${V[1].toFixed(2)}L${arcD(V, r, start, span).slice(1)}Z`;
/** pointer event → SVG user coordinates (follows every CSS transform: lesson scale, explainer scale, page zoom) */
export function svgPoint(svg, e) {
  const m = (svg.ownerSVGElement || svg).getScreenCTM(); if (!m) return [0, 0];
  const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse()); return [p.x, p.y];
}

/* styles (no shared CSS file to edit; injected once). Every class starts with geo- */
const CSS = `
.geo-box { position: relative; flex: none; }
.geo-box > .geo-svg { position: absolute; left: 0; top: 0; overflow: visible; }
.geo-t { font-family: var(--round, system-ui, sans-serif); font-weight: 700; paint-order: stroke; stroke: #fff; stroke-linejoin: round; }
.geo-tn { font-family: var(--font, system-ui, sans-serif); }
.geo-drag { touch-action: none; cursor: grab; }
.geo-grabbing .geo-drag { cursor: grabbing; }
.geo-pt { position: relative; }
.geo-pt-fig { position: relative; }
.geo-pt-read { font: 600 19px/1.35 var(--round, system-ui); color: var(--ink2, #3a4254); min-height: 2.75em; margin-top: 4px; padding: 6px 12px; background: #f7f5ef; border-radius: 12px; }
.geo-pt-read b.geo-big { font-size: 26px; color: var(--ink, #1c2230); }
.geo-pt-read .geo-sc-o { color: ${BLUE}; } .geo-pt-read .geo-sc-i { color: ${GREEN}; }
.geo-btns { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
.geo-btns .pill[aria-pressed="true"] { background: var(--brand, #6e4a1c); color: #fff; }
.geo-pc { position: relative; }
.geo-pc .geo-btns { margin-top: 6px; }
.geo-piece { touch-action: none; cursor: grab; }
.geo-wrap { position: relative; flex: none; }
.geo-panel:empty { display: none; }
.geo-panel { margin-top: 6px; display: flex; flex-wrap: wrap; gap: 6px 8px; align-items: center; }
.geo-chip { font: 700 17px/1.3 var(--round, system-ui); color: var(--c, #1c2230); background: #fff; border: 2px solid var(--c, #9aa0ab); border-radius: 999px; padding: 3px 12px; }
.geo-gd-msg, .geo-readout { flex: 1 1 100%; font: 600 18px/1.35 var(--round, system-ui); color: var(--ink2, #3a4254); background: #f7f5ef; border-radius: 12px; padding: 6px 12px; min-height: 1.5em; }
.geo-readout b.geo-big { font-size: 24px; color: var(--ink, #1c2230); }
.geo-gd-msg.geo-ok { background: #e3f4ea; color: ${GREEN}; } .geo-gd-msg.geo-no { background: #fbeceb; color: ${RED}; }
.geo-gd .geo-btns { margin-top: 0; }
.geo-table { border-collapse: collapse; font: 600 17px/1.2 var(--round, system-ui); color: var(--ink, #1c2230); background: #fff; border-radius: 10px; overflow: hidden; }
.geo-table th, .geo-table td { padding: 5px 12px; text-align: center; border-bottom: 1px solid #e4e1d8; }
.geo-table th { background: #f3efe4; font-weight: 800; }
.geo-table td i { display: inline-block; width: 14px; height: 14px; border-radius: 4px; }
.geo-table .geo-hl { background: #fff1c9; }
.geo-table .geo-calc td { color: ${GREY}; font-size: 15px; }
.geo-slider { flex: 1 1 100%; display: flex; align-items: center; gap: 10px; font: 700 19px var(--round, system-ui); }
.geo-slider input { flex: 1; max-width: 360px; touch-action: none; }
.geo-slider .geo-sl-t { font-style: italic; }
`;
if (typeof document !== 'undefined' && !document.getElementById('geo-css')) { const s = document.createElement('style'); s.id = 'geo-css'; s.textContent = CSS; document.head.appendChild(s); }

/** a group whose transform attribute is about the SVG origin (blocks.css gives .bk-svg groups a fill-box origin) */
function grp(parent, cls, attrs = {}) {
  const g = svgEl('g', Object.assign({ class: cls || null }, attrs), parent);
  g.style.transformBox = 'view-box'; g.style.transformOrigin = '0 0';
  return g;
}
/** for elements that pop / pulse with CSS transforms (no transform attribute on them) */
function popable(el) { el.style.transformBox = 'fill-box'; el.style.transformOrigin = 'center'; return el; }
function path(parent, d, o = {}) {
  return svgEl('path', { d, class: o.cls === undefined ? 'bk-stroke' : o.cls, fill: o.fill || 'none', 'fill-opacity': o.fillOpacity, stroke: o.stroke === undefined ? INK : o.stroke,
    'stroke-width': o.width ?? 3, 'stroke-linecap': o.cap || 'round', 'stroke-linejoin': 'round', 'stroke-dasharray': o.dash, opacity: o.opacity }, parent);
}
/** SVG text, centred on (x, y). o: size, color, anchor, halo (white outline, default 5; false = none), italic, weight */
export function text(parent, x, y, s, o = {}) {
  const t = svgEl('text', { x: r2(x), y: r2(y), class: o.halo === false ? 'geo-tn' : 'geo-t', 'font-size': o.size || 20, fill: col(o.color, INK),
    'text-anchor': o.anchor || 'middle', 'dominant-baseline': 'central', 'stroke-width': o.halo === false ? null : (o.halo || 5),
    'font-style': o.italic ? 'italic' : null, 'font-weight': o.weight || null }, parent);
  t.textContent = s; return t;
}
export const dot = (parent, p, o = {}) => popable(svgEl('circle', { cx: r2(p[0]), cy: r2(p[1]), r: o.r || 4.5, fill: col(o.color, INK) }, parent));
/** a ray / segment from V in direction deg (or to a point) */
export function ray(parent, V, to, o = {}) {
  const E = Array.isArray(to) ? to : at(V, to, o.len || 150);
  const p = path(parent, `M${pts([V, E]).join('L')}`, { stroke: col(o.color, INK), width: o.width ?? 3, dash: o.dash });
  if (o.arrow) arrowHead(parent, E[0], E[1], E[0] - V[0], E[1] - V[1], { color: col(o.color, INK), width: o.width ?? 3 });
  return p;
}
/* the drawing surface: an <svg>/<g> host is drawn into; an HTML host gets a sized box with its own <svg> */
function surface(host, o, W, H) {
  if (typeof SVGElement !== 'undefined' && host instanceof SVGElement) {
    const svg = host.ownerSVGElement || host;
    return { el: host, svg, parent: host, own: false, W, H, ox: o.x || 0, oy: o.y || 0 };
  }
  const el = h('div', 'geo-box' + (o.cls ? ' ' + o.cls : ''));
  el.style.width = W + 'px'; el.style.height = H + 'px';
  const abs = o.x != null || o.y != null || (host && host.classList && host.classList.contains('ex-stage'));
  if (abs) { el.style.position = 'absolute'; el.style.left = (o.x || 0) + 'px'; el.style.top = (o.y || 0) + 'px'; }
  const svg = svgEl('svg', { class: 'geo-svg', width: W, height: H, viewBox: `0 0 ${W} ${H}` }, el);
  if (host) host.appendChild(el);
  return { el, svg, parent: svg, own: true, W, H, ox: 0, oy: 0 };
}
const isPt = (a) => Array.isArray(a);

/* ================================ angles ================================ */
/** Geo.angle(host, { vertex, a1, a2, len, label, arc, reflex, r, right, color, arcColor, fill, names, dot, width, size })
 *  a1 / a2: directions (math degrees) or points. Draws the arms, the arc (or the square of a right angle) and the label for
 *  the smaller angle between the arms (reflex: true → the reflex one, arc in red). label: true = its measure ("65°") or any
 *  text. names: ['A', 'B', 'C'] = letters at the a1 end, the vertex and the a2 end. fill: shade the wedge (a colour).
 *  → { g, V, start, span, measure, mid, arms, arc, wedge, label, letters, drawIn(c, ms) } (sweep: start → start + span, CCW) */
export function angle(host, o = {}) {
  const S = surface(host, o, o.width || 320, o.height || 300);
  const g = grp(S.parent, 'geo-angle');
  const V = o.vertex || [S.W / 2, S.H / 2];
  const d1 = isPt(o.a1) ? dirTo(V, o.a1) : n360(o.a1 ?? 0), d2 = isPt(o.a2) ? dirTo(V, o.a2) : n360(o.a2 ?? 60);
  let start = d1, span = n360(d2 - d1);
  if ((span > 180) !== !!o.reflex) { start = d2; span = 360 - span; }
  if (o.reflex && span === 0) span = 360;
  const L1 = o.len ?? (isPt(o.a1) ? dist(V, o.a1) : 150), L2 = o.len ?? (isPt(o.a2) ? dist(V, o.a2) : 150);
  const ink = col(o.color, INK), acol = col(o.arcColor || o.color, o.reflex ? RED : INK), size = o.size || 22;
  const r = o.r ?? (o.reflex ? 30 : span < 25 ? 70 : span < 45 ? 54 : 40);
  const right = o.right ?? (!o.reflex && Math.abs(span - 90) < 0.05);
  const out = { g, V, start, span, measure: span, mid: n360(start + span / 2), letters: [] };
  if (o.fill) out.wedge = path(g, wedgeD(V, r + 6, start, span), { stroke: 'none', fill: col(o.fill), fillOpacity: o.fillOpacity ?? 0.22, cls: '' });
  if (o.arms !== false) out.arms = path(g, `M${pts([at(V, d1, L1), V, at(V, d2, L2)]).join('L')}`, { stroke: ink, width: o.width ?? 3.2 });
  if (o.arc !== false) {
    if (right) { const s = o.rs || 20, u = at([0, 0], start, 1), v = at([0, 0], start + 90, 1); out.arc = path(g, `M${pts([[V[0] + u[0] * s, V[1] + u[1] * s], [V[0] + (u[0] + v[0]) * s, V[1] + (u[1] + v[1]) * s], [V[0] + v[0] * s, V[1] + v[1] * s]]).join('L')}`, { stroke: acol, width: 2.4, cap: 'butt' }); }
    else out.arc = path(g, arcD(V, r, start, span), { stroke: acol, width: 2.6 });
  }
  if (o.dot !== false) out.dot = dot(g, V, { color: ink, r: 4 });
  if (o.label != null && o.label !== false) {
    const s = o.label === true ? fmtDeg(span) + '°' : String(o.label), hw = s.length * size * 0.3 + 4;
    let lr = o.labelR ?? Math.min(150, Math.max((right ? 22 : r) + size * 0.85, (hw + size * 0.35) / Math.max(0.12, Math.sin(Math.min(span, 180) / 2 * RAD)) + 5));
    if (right && o.labelR == null) lr = Math.max(lr, (o.rs || 20) * 1.41 + hw + 6);
    const p = at(V, start + span / 2, lr);
    out.label = popable(text(g, p[0], p[1], s, { size, color: o.labelColor || (o.reflex ? RED : ink) }));
  }
  if (o.names) {
    const nm = Array.isArray(o.names) ? o.names : [o.names.a1, o.names.vertex, o.names.a2];
    const ns = o.nameSize || 22;
    if (nm[0]) { const p = at(V, d1, L1 + ns * 0.9); out.letters.push(text(g, p[0], p[1], nm[0], { size: ns, italic: false })); }
    if (nm[1]) { const p = at(V, start + span / 2 + 180, ns * 1.15); out.letters.push(text(g, p[0], p[1], nm[1], { size: ns })); }
    if (nm[2]) { const p = at(V, d2, L2 + ns * 0.9); out.letters.push(text(g, p[0], p[1], nm[2], { size: ns })); }
  }
  out.drawIn = async (c, ms = 600) => {
    if (out.arms) await drawIn(out.arms, ms, c);
    if (out.wedge) await appear(c, out.wedge, 300);
    if (out.arc) await drawIn(out.arc, ms * 0.8, c);
    if (out.label) await pop(c, out.label);
  };
  out.el = S.own ? S.el : g; out.svg = S.svg;
  return out;
}

/* ================================ protractor ================================ */
/* Local drawing: centre (0, 0), base line along x, the arc above (y < 0). Math angle a on the protractor ↔ point
 * (r cos a, −r sin a). OUTER scale reads 180 − a (0 at the LEFT), INNER grey scale reads a (0 at the RIGHT). */
function drawProtractor(g, R, o = {}) {
  const base = R * 0.08, P0 = (a, r) => [r * Math.cos(a * RAD), -r * Math.sin(a * RAD)];
  const body = path(g, `M${-R} 0A${R} ${R} 0 0 1 ${R} 0L${R} ${base}L${-R} ${base}Z`, { fill: '#dce9fb', fillOpacity: 0.5, stroke: '#4d5b78', width: 1.6, cls: 'geo-pbody' });
  let d = '';
  for (let a = 0; a <= 180; a++) { const L = a % 10 === 0 ? 0.095 : a % 5 === 0 ? 0.062 : 0.036; const p = P0(a, R), q = P0(a, R * (1 - L)); d += `M${p[0].toFixed(2)} ${p[1].toFixed(2)}L${q[0].toFixed(2)} ${q[1].toFixed(2)}`; }
  path(g, d, { stroke: SLATE, width: 1, cls: '', cap: 'butt' });
  // inner arc with its own little ticks, and light guide lines every 10°
  path(g, `M${-R * 0.69} 0A${R * 0.69} ${R * 0.69} 0 0 1 ${R * 0.69} 0`, { stroke: '#5f6d8a', width: 1, cls: '' });
  let gd = '';
  for (let a = 10; a < 180; a += 10) { const p = P0(a, R * 0.14), q = P0(a, R * 0.69); gd += `M${p[0].toFixed(2)} ${p[1].toFixed(2)}L${q[0].toFixed(2)} ${q[1].toFixed(2)}`; }
  path(g, gd, { stroke: '#7c8aa6', width: 0.8, opacity: 0.45, cls: '' });
  path(g, `M${-R} 0H${R}`, { stroke: INK, width: 1.5, cls: '' });                    // the 0 line (base line)
  path(g, `M0 0V${-R * 0.12}M${-R * 0.05} 0H${R * 0.05}`, { stroke: INK, width: 1.6, cls: '' });
  svgEl('circle', { cx: 0, cy: 0, r: 3.2, fill: 'none', stroke: RED, 'stroke-width': 1.6 }, g);
  const outer = grp(g, 'geo-sc-outer'), inner = grp(g, 'geo-sc-inner');
  const fo = o.font || R * 0.07, fi = o.fontInner || R * 0.06;
  for (let a = 0; a <= 180; a += 10) {
    const po = P0(a, R * 0.845), pi = P0(a, R * 0.748);
    const to = svgEl('text', { x: r2(po[0]), y: r2(po[1]), 'font-size': fo.toFixed(1), 'font-weight': 700, fill: INK, class: 'geo-tn', 'text-anchor': 'middle', 'dominant-baseline': 'central', transform: `rotate(${90 - a} ${r2(po[0])} ${r2(po[1])})` }, outer);
    to.textContent = 180 - a;
    const ti = svgEl('text', { x: r2(pi[0]), y: r2(pi[1]), 'font-size': fi.toFixed(1), 'font-weight': 600, fill: '#6b7282', class: 'geo-tn', 'text-anchor': 'middle', 'dominant-baseline': 'central', transform: `rotate(${90 - a} ${r2(pi[0])} ${r2(pi[1])})` }, inner);
    ti.textContent = a;
  }
  return { body, outer, inner, base };
}

/** Geo.protractor(host, opts) — a school protractor students and the teacher drag (body) and turn (the round handles at
 *  the ends of the base). opts: { x, y, width 640, height 430, r 200, cx, cy, rot (math degrees the base line is turned),
 *  angle: { vertex, a1, a2, len, names } (an angle drawn under it to measure), snap true, readout true,
 *  buttons true | ['scale', 'hide', 'new', 'place', 'snap'], whichScale false (highlight the scale that starts at 0 on an
 *  arm), hidden false (reading shows "?"), onChange(reading) }.
 *  → { el, svg, arms, state {cx, cy, rot}, set(pose), moveTo(c, pose, ms), alignTo(arm, end) → pose, place(c),
 *      reading() → { centred, zero: 'outer'|'inner'|null, value, phi: [φ1, φ2] }, showScale('outer'|'inner'|'auto'|null),
 *      hide(on), setAngle(angleOpts), newAngle(), snap } */
export function protractor(host, o = {}) {
  const W = o.width || 640, H = o.height || 430, R = o.r || 200;
  const wrap = h('div', 'geo-pt' + (o.cls ? ' ' + o.cls : ''));
  if (o.x != null || o.y != null || (host && host.classList && host.classList.contains('ex-stage'))) { wrap.style.position = 'absolute'; wrap.style.left = (o.x || 0) + 'px'; wrap.style.top = (o.y || 0) + 'px'; }
  wrap.style.width = W + 'px';
  const fig = h('div', 'geo-pt-fig'); fig.style.width = W + 'px'; fig.style.height = H + 'px'; wrap.appendChild(fig);
  const svg = svgEl('svg', { class: 'geo-svg', width: W, height: H, viewBox: `0 0 ${W} ${H}` }, fig);
  svg.style.position = 'absolute'; svg.style.left = svg.style.top = '0'; svg.style.overflow = 'visible';
  const pg = grp(svg, 'geo-pt-g geo-drag', { 'data-tap': '' }), armL = grp(svg, 'geo-pt-arms');
  armL.style.pointerEvents = 'none';   // the arms show through the protractor (drawn on top) but never catch a drag
  const band = path(pg, '', { stroke: BLUE, width: R * 0.085, opacity: 0, cls: '', cap: 'round' });
  const D = drawProtractor(pg, R, o);
  band.remove(); pg.insertBefore(band, D.outer);  // under the numbers
  /* the turn handles hang under the straight edge near its ends (clear of an arm lying along the base line) */
  const knobR = Math.max(16, R * 0.075), kx = R * 0.86, ky = D.base + knobR + 5;
  const knob = (sx) => {
    const k = grp(pg, 'geo-knob geo-drag', { 'data-tap': '' }), cx = sx * kx, rr = knobR * 0.52;
    svgEl('circle', { cx, cy: ky, r: knobR, fill: '#fff', stroke: BLUE, 'stroke-width': 2.5 }, k);
    path(k, `M${cx + rr} ${ky}A${rr} ${rr} 0 1 1 ${cx} ${ky - rr}`, { stroke: BLUE, width: 2.4, cls: '' });
    arrowHead(k, cx + 1, ky - rr, 1, 0, { color: BLUE, width: 2.2, L: 7, hw: 5 });
    return k;
  };
  const kR = knob(1), kL = knob(-1);
  const st = { cx: o.cx ?? W / 2, cy: o.cy ?? H - ky - knobR - 6, rot: o.rot || 0 };
  let ang = null, hidden = !!o.hidden, scaleMode = o.whichScale ? 'auto' : null, snap = o.snap !== false;
  const read = o.readout === false ? null : h('div', 'geo-pt-read');
  if (read) wrap.appendChild(read);
  if (host) host.appendChild(wrap);

  function setAngle(a) {
    armL.innerHTML = ''; ang = a ? Object.assign({ len: R * 1.15 }, a) : null;
    if (ang) {
      ang.vertex = ang.vertex || [W / 2, H / 2 + 20];
      ang.A = angle(armL, Object.assign({ arc: false, dot: true, width: 3.4, names: ang.names, color: ang.color }, ang));
      ang.d = [isPt(ang.a1) ? dirTo(ang.vertex, ang.a1) : n360(ang.a1), isPt(ang.a2) ? dirTo(ang.vertex, ang.a2) : n360(ang.a2)];
    }
    render();
  }
  function reading() {
    if (!ang) return { centred: false, zero: null, value: null, phi: [] };
    const V = ang.vertex, centred = dist(V, [st.cx, st.cy]) < 1.5;
    const phi = ang.d.map((d) => n360(d - st.rot + 0.0001) - 0.0001);
    let zero = null, other = null;
    phi.forEach((p, i) => { if (zero) return; const q = phi[1 - i]; if (Math.abs(n180(p)) < 0.6 && q <= 180.6) { zero = 'inner'; other = q; } else if (Math.abs(n180(p - 180)) < 0.6 && q <= 180.6 && q >= -0.6) { zero = 'outer'; other = q; } });
    const value = zero === 'inner' ? other : zero === 'outer' ? 180 - other : null;
    return { centred, zero: centred ? zero : null, value: centred && zero ? Math.round(Math.max(0, value) * 10) / 10 : null, phi, other };
  }
  function render() {
    pg.setAttribute('transform', `translate(${r2(st.cx)} ${r2(st.cy)}) rotate(${r2(-st.rot)})`);
    const rd = reading();
    const sc = scaleMode === 'auto' ? rd.zero : scaleMode;
    D.outer.style.opacity = sc === 'inner' ? 0.3 : 1; D.inner.style.opacity = sc === 'outer' ? 0.3 : 1;
    D.outer.setAttribute('fill', sc === 'outer' ? BLUE : INK); [...D.inner.children].forEach((t) => t.setAttribute('fill', sc === 'inner' ? GREEN : '#6b7282'));
    if (sc && rd.zero === sc && rd.other != null) {
      const rr = sc === 'outer' ? R * 0.845 : R * 0.748, from = sc === 'outer' ? 180 : 0, span = sc === 'outer' ? rd.other - 180 : rd.other;
      band.setAttribute('d', Math.abs(span) > 0.5 ? arcD([0, 0], rr, from, span) : ''); band.setAttribute('stroke', sc === 'outer' ? BLUE : GREEN); band.setAttribute('stroke-width', R * (sc === 'outer' ? 0.085 : 0.075)); band.setAttribute('opacity', 0.2);
    } else band.setAttribute('opacity', 0);
    if (read) read.innerHTML = message(rd);
    if (o.onChange) o.onChange(rd);
  }
  function message(rd) {
    if (!ang) return 'Drag the protractor to move it. Turn it with the round handles.';
    if (!rd.centred) return '<b>Step 1:</b> put the <b>centre mark</b> (the little red circle) on the <b>vertex</b>.';
    if (!rd.zero) {
      const outside = rd.phi.some((p) => p > 180.6 && p < 359.4);
      return outside ? 'An arm is under the base line. <b>Turn the protractor</b> so both arms are on the curved side.' : '<b>Step 2:</b> turn it so the <b>0 line</b> (the base line) lies on <b>one arm</b>.';
    }
    const v = hidden ? '?' : fmtDeg(rd.value) + '°', kind = rd.value < 90 ? 'acute' : rd.value === 90 ? 'right' : rd.value < 180 ? 'obtuse' : 'straight';
    const which = rd.zero === 'outer' ? 'the <b class="geo-sc-o">outer</b> scale' : 'the <b class="geo-sc-i">inner</b> scale';
    return `<b>Step 3:</b> its 0 is on an arm, so read ${which}, counting up from 0: <b class="geo-big">${v}</b>${hidden ? '' : ` &nbsp;· ${kind}`}`;
  }
  function set(p) { if (p.cx != null) st.cx = p.cx; if (p.cy != null) st.cy = p.cy; if (p.rot != null) st.rot = p.rot; render(); }
  function alignTo(arm = 0, end = 'auto') {
    if (!ang) return { cx: st.cx, cy: st.cy, rot: st.rot };
    const da = ang.d[arm], dob = ang.d[1 - arm], rel = n360(dob - da);
    const e = end === 'auto' ? (rel <= 180 ? 'inner' : 'outer') : end;
    return { cx: ang.vertex[0], cy: ang.vertex[1], rot: e === 'inner' ? da : da - 180 };
  }
  function moveTo(c, p, ms = 900) {
    const s0 = { ...st }, dr = p.rot != null ? n180(p.rot - s0.rot) : 0;
    return tween(c, ms, (t) => { if (p.cx != null) st.cx = s0.cx + (p.cx - s0.cx) * t; if (p.cy != null) st.cy = s0.cy + (p.cy - s0.cy) * t; st.rot = s0.rot + dr * t; render(); });
  }
  async function place(c, arm = 0, end = 'auto') { const p = alignTo(arm, end); await moveTo(c, { cx: p.cx, cy: p.cy }); await moveTo(c, { rot: p.rot }, 800); }

  /* ---- dragging (body moves, handles turn about the centre) ---- */
  let drag = null;
  const kAng = (sx) => dirTo([0, 0], [sx * kx, ky]);
  function down(e, mode) {
    if (drag || (e.pointerType === 'mouse' && e.button !== 0)) return;
    e.preventDefault(); e.stopPropagation();
    const p = svgPoint(svg, e); drag = { id: e.pointerId, mode, p0: p, s0: { ...st } };
    if (mode !== 'move') { const sx = mode === 'R' ? 1 : -1, k = at([st.cx, st.cy], st.rot + kAng(sx), Math.hypot(kx, ky)); drag.off = [p[0] - k[0], p[1] - k[1]]; drag.ka = kAng(sx); }
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    wrap.classList.add('geo-grabbing');
  }
  function move(e) {
    if (!drag || e.pointerId !== drag.id) return;
    const p = svgPoint(svg, e);
    if (drag.mode === 'move') {
      st.cx = Math.max(0, Math.min(W, drag.s0.cx + p[0] - drag.p0[0])); st.cy = Math.max(0, Math.min(H, drag.s0.cy + p[1] - drag.p0[1]));
      if (snap && ang && dist(ang.vertex, [st.cx, st.cy]) < 16) { st.cx = ang.vertex[0]; st.cy = ang.vertex[1]; }
    } else {
      const q = [p[0] - drag.off[0], p[1] - drag.off[1]];
      if (dist(q, [st.cx, st.cy]) < 8) return;
      let rot = dirTo([st.cx, st.cy], q) - drag.ka;
      if (snap) {
        let best = null;
        if (ang) ang.d.forEach((d) => { [0, 180].forEach((e0) => { const dd = Math.abs(n180(d - e0 - rot)); if (dd < 3.5 && (!best || dd < best.dd)) best = { dd, rot: d - e0 }; }); });
        rot = best ? best.rot : Math.round(rot);
      }
      st.rot = n360(rot);
    }
    render();
  }
  function up(e) { if (!drag || e.pointerId !== drag.id) return; drag = null; wrap.classList.remove('geo-grabbing'); render(); }
  [[D.body, 'move'], [kR, 'R'], [kL, 'L']].forEach(([el, m]) => { el.addEventListener('pointerdown', (e) => down(e, m)); el.addEventListener('pointermove', move); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up); });
  // the numbers and ticks also move it (they sit on the body)
  pg.addEventListener('pointerdown', (e) => { if (!e.defaultPrevented && !e.target.closest('.geo-knob')) down(e, 'move'); });
  pg.addEventListener('pointermove', move); pg.addEventListener('pointerup', up); pg.addEventListener('pointercancel', up);

  /* ---- buttons ---- */
  const api = { el: wrap, svg, g: pg, arms: armL, state: st, readout: read, set, moveTo, alignTo, place, reading, setAngle, render,
    showScale(s) { scaleMode = s; render(); }, hide(on) { hidden = on !== false; render(); },
    get snap() { return snap; }, set snap(v) { snap = !!v; },
    newAngle() {
      const m = 15 + Math.floor(Math.random() * 151), a1 = Math.floor(Math.random() * 72) * 5;
      setAngle(Object.assign({}, ang || {}, { a1, a2: a1 + m, A: null, d: null }));
      set({ cx: W * (0.3 + Math.random() * 0.4), cy: H - ky - knobR - 6, rot: (Math.random() < 0.5 ? 0 : Math.round(Math.random() * 60 - 30)) });
    } };
  const want = o.buttons === false ? [] : Array.isArray(o.buttons) ? o.buttons : ['place', 'scale', 'hide', 'new', 'snap'];
  if (want.length) {
    const row = h('div', 'geo-btns'); wrap.appendChild(row);
    const B = (label, fn, pressed) => { const b = h('button', 'pill small', label); b.type = 'button'; if (pressed != null) b.setAttribute('aria-pressed', String(pressed)); b.onclick = () => fn(b); row.appendChild(b); return b; };
    want.forEach((k) => {
      if (k === 'scale') B('Which scale?', (b) => { scaleMode = scaleMode ? null : 'auto'; b.setAttribute('aria-pressed', String(!!scaleMode)); render(); }, !!scaleMode);
      if (k === 'hide') B('Hide the reading', (b) => { hidden = !hidden; b.setAttribute('aria-pressed', String(hidden)); render(); }, hidden);
      if (k === 'new') B('New angle', () => api.newAngle());
      if (k === 'place') B('Show me', () => { if (ang) { const lc = { fast: false, check() {}, anim: (el, kf, ms) => el.animate(kf, { duration: ms, fill: 'both' }).finished, sleep: (ms) => new Promise((r) => setTimeout(r, ms)) }; place(lc); } });
      if (k === 'snap') B('Snap', (b) => { snap = !snap; b.setAttribute('aria-pressed', String(snap)); }, snap);
    });
  }
  setAngle(o.angle || null);
  return api;
}

/* ================================ transversal ================================ */
export const PAIRS = {
  corresponding: [[1, 5], [2, 6], [3, 7], [4, 8]], 'alt-int': [[3, 5], [4, 6]], 'alt-ext': [[1, 7], [2, 8]],
  'int-same': [[4, 5], [3, 6]], 'ext-same': [[1, 8], [2, 7]], 'vert-opp': [[1, 3], [2, 4], [5, 7], [6, 8]],
  linear: [[1, 2], [2, 3], [3, 4], [1, 4], [5, 6], [6, 7], [7, 8], [5, 8]]
};
export const PAIR_NAMES = { corresponding: 'corresponding angles', 'alt-int': 'alternate interior angles', 'alt-ext': 'alternate exterior angles',
  'int-same': 'interior angles on the same side of the transversal', 'ext-same': 'exterior angles on the same side of the transversal',
  'vert-opp': 'vertically opposite angles', linear: 'adjacent angles on a line (supplementary)' };
export const PAIR_SHAPES = { corresponding: 'F', 'alt-int': 'Z', 'int-same': 'U', 'vert-opp': 'X' };
export const PAIR_COLORS = { corresponding: BLUE, 'alt-int': GREEN, 'alt-ext': PURPLE, 'int-same': AMBER, 'ext-same': RED, 'vert-opp': SLATE, linear: '#9a6a24' };
/** the name (key of PAIRS) of angles a and b in the numbered diagram, or null */
export function pairName(a, b) { for (const k in PAIRS) if (PAIRS[k].some(([x, y]) => (x === a && y === b) || (x === b && y === a))) return k; return null; }

/** Geo.transversal(host, { x, y, w 560, h 340, parallel true, tilt (= angle 2, default 60, or worked out from a numeric
 *  angle), skew 14 (non-parallel: the bottom line turned this much), lineTilt 0, gap, angles: {1: 70, 5: 'x', …},
 *  numbers true (numerals 1–8 in the corners without a value), marks (the ">" arrows; default on when parallel; 2 = ">>"),
 *  names: { top: 'ℓ₁', bottom: 'ℓ₂', t: 't' } (false hides), highlight: [1, 5], size 20 })
 *  Angles 1–4 at the top crossing and 5–8 at the bottom, each clockwise from the upper-left (the booklet's numbering).
 *  → { g, T, B, measure(k), corner(k) → {X, start, span}, label(k), setLabel(k, s), highlight(c, [a, b], {shape, name,
 *      color, len}), clearHighlight(), slide(c, k, ms) (a copy of angle k slides along the transversal onto its partner) } */
export function transversal(host, o = {}) {
  const W = o.w || o.width || 560, H = o.h || o.height || 340;
  const S = surface(host, o, W, H), ox = S.own ? 0 : (o.x || 0), oy = S.own ? 0 : (o.y || 0);
  const parallel = o.parallel !== false, A = o.angles || {}, num = (k) => (typeof A[k] === 'number' ? A[k] : null);
  let tilt = o.tilt;
  if (tilt == null) {
    const t2 = num(2) ?? num(4), t1 = num(1) ?? num(3);
    tilt = t2 != null ? t2 : t1 != null ? 180 - t1 : null;
    if (tilt == null && parallel) { const b2 = num(6) ?? num(8), b1 = num(5) ?? num(7); tilt = b2 != null ? b2 : b1 != null ? 180 - b1 : null; }
    if (tilt == null) tilt = 60;
  }
  tilt = Math.max(15, Math.min(165, tilt));
  const skew = parallel ? 0 : (o.skew ?? 14), Lt = o.lineTilt || 0, gap = o.gap || H * 0.4;
  const C = [ox + W / 2, oy + H / 2], run = gap / Math.tan(tilt * RAD);
  const rot = (p) => { const dx = p[0] - C[0], dy = p[1] - C[1], c = Math.cos(Lt * RAD), s = Math.sin(Lt * RAD); return [C[0] + dx * c + dy * s, C[1] - dx * s + dy * c]; };
  const T0 = [C[0] + run / 2, C[1] - gap / 2], B0 = [C[0] - run / 2, C[1] + gap / 2];
  const T = rot(T0), B = rot(B0);
  const Ltop = Lt, Lbot = Lt + skew, tdir = Lt + tilt, hl = o.lineLen || W * 0.46;
  const topA = rot([C[0] - hl, T0[1]]), topB = rot([C[0] + hl, T0[1]]);
  const bs = (x) => (x - B0[0]) / Math.cos(skew * RAD), botA = at(B, Lbot, bs(C[0] - hl)), botB = at(B, Lbot, bs(C[0] + hl));
  const ext = o.ext || Math.max(30, (H / 2 - gap / 2 - 16) / Math.sin(tilt * RAD));
  const tA = at(T, tdir, ext), tB = at(B, tdir + 180, ext);
  const g = grp(S.parent, 'geo-tv'), Lw = grp(g, 'geo-tv-hl'), Ll = grp(g, 'geo-tv-lines'), Lb = grp(g, 'geo-tv-labels'), Lx = grp(g, 'geo-tv-extra');
  const ink = col(o.color, INK);
  const lines = {
    top: path(Ll, `M${pts([topA, topB]).join('L')}`, { stroke: ink, width: 3 }),
    bottom: path(Ll, `M${pts([botA, botB]).join('L')}`, { stroke: ink, width: 3 }),
    t: path(Ll, `M${pts([tA, tB]).join('L')}`, { stroke: col(o.tColor, ink), width: 3 })
  };
  const marks = o.marks ?? (parallel ? 1 : 0);
  if (marks) [[topA, Ltop], [botA, Lbot]].forEach(([E, L]) => {
    for (let i = 0; i < marks; i++) {
      const p = at(E, L, 0.12 * 2 * hl + i * 11), a = at(p, L + 180, 11), u = at([0, 0], L + 90, 8);
      path(Ll, `M${pts([[a[0] + u[0], a[1] + u[1]], p, [a[0] - u[0], a[1] - u[1]]]).join('L')}`, { stroke: ink, width: 2.6 });
    }
  });
  const names = o.names === false ? null : Object.assign({ top: 'ℓ₁', bottom: 'ℓ₂', t: 't' }, o.names || {});
  if (names) {
    const ns = o.nameSize || 20;
    if (names.top) { const p = at(topB, Ltop, ns * 0.9); text(Lb, p[0], p[1], names.top, { size: ns, italic: true }); }
    if (names.bottom) { const p = at(botB, Lbot, ns * 0.9); text(Lb, p[0], p[1], names.bottom, { size: ns, italic: true }); }
    if (names.t) { const p = at(tA, tdir, ns * 0.8); text(Lb, p[0], p[1], names.t, { size: ns, italic: true }); }
  }
  function corner(k) {
    const X = k <= 4 ? T : B, L = k <= 4 ? Ltop : Lbot, j = (k - 1) % 4 + 1;
    const s = j === 1 ? tdir : j === 2 ? L : j === 3 ? tdir + 180 : L + 180, e = j === 1 ? L + 180 : j === 2 ? tdir : j === 3 ? L + 360 : tdir + 180;
    return { k, X, start: n360(s), span: n360(e - s), L };
  }
  const measure = (k) => Math.round(corner(k).span * 10) / 10;
  const size = o.size || 20, labs = {};
  function placeLabel(k, s, isNum) {
    if (labs[k]) labs[k].remove();
    if (s == null || s === '') { delete labs[k]; return; }
    const cn = corner(k), hw = String(s).length * size * 0.29 + 3, d = Math.max(isNum ? 22 : 26, Math.min(80, (hw + size * 0.25) / Math.max(0.15, Math.sin(cn.span / 2 * RAD)) + 3));
    const p = at(cn.X, cn.start + cn.span / 2, d);
    labs[k] = popable(text(Lb, p[0], p[1], String(s), { size: isNum ? size - 1 : size, color: isNum ? (o.numColor || SLATE) : col((o.labelColors || {})[k], ink), weight: isNum ? 600 : 700 }));
  }
  for (let k = 1; k <= 8; k++) {
    if (A[k] != null) placeLabel(k, typeof A[k] === 'number' ? fmtDeg(A[k]) + '°' : A[k], false);
    else if (o.numbers !== false) placeLabel(k, String(k), true);
  }
  let hlEls = [];
  function rays(k, len) {
    const cn = corner(k), TB = dist(T, B), out = [];
    [cn.start, cn.start + cn.span].forEach((d) => {
      const alongT = Math.abs(n180(d - tdir)) < 0.01, alongTd = Math.abs(n180(d - tdir - 180)) < 0.01;
      const toOther = (k <= 4 && alongTd) || (k > 4 && alongT);
      out.push([cn.X, at(cn.X, d, toOther ? TB : Math.min(len, (alongT || alongTd) ? ext : hl * 0.75))]);
    });
    return out;
  }
  const api = {
    g, svg: S.svg, el: S.own ? S.el : g, T, B, tilt, skew, parallel, lines, corner, measure, labels: labs,
    measures: () => { const m = {}; for (let k = 1; k <= 8; k++) m[k] = measure(k); return m; },
    label: (k) => labs[k], setLabel: (k, s) => placeLabel(k, s, false),
    pairName,
    async highlight(c, ks, h2 = {}) {
      const name = h2.pair || pairName(ks[0], ks[1]), color = col(h2.color, PAIR_COLORS[name] || BLUE);
      const wedges = ks.map((k) => { const cn = corner(k); return popable(path(Lw, wedgeD(cn.X, h2.r || 44, cn.start, cn.span), { stroke: 'none', fill: color, fillOpacity: 0.3, cls: '' })); });
      const segs = []; ks.forEach((k) => rays(k, h2.len || 120).forEach((s) => segs.push(s)));
      const shape = h2.shape === false ? null : path(Lw, segs.map((s) => `M${pts(s).join('L')}`).join(''), { stroke: color, width: 13, opacity: 0.32 });
      let tag = null;
      if (h2.name !== false && name) {
        const s = (h2.name && typeof h2.name === 'string') ? h2.name : (PAIR_NAMES[name] || name).replace(' of the transversal', '') + (PAIR_SHAPES[name] && h2.letter !== false ? ` (${PAIR_SHAPES[name]})` : '');
        tag = popable(grp(Lx, 'geo-tag')); const tx = text(tag, h2.tagX ?? ox + 12, h2.tagY ?? oy + 18, s, { size: 18, anchor: 'start', color, halo: 6 }); void tx;
      }
      hlEls.push(...wedges, shape, tag);
      await Promise.all(wedges.map((w) => pop(c, w, 380)));
      if (shape) await drawIn(shape, 700, c);
      if (tag) await fadeIn(c, tag, 300);
      return { wedges, shape, tag, name };
    },
    clearHighlight() { hlEls.forEach((e) => e && e.remove()); hlEls = []; },
    async slide(c, k, ms = 1200, h2 = {}) {
      const cn = corner(k), dx = (k <= 4 ? B[0] - T[0] : T[0] - B[0]), dy = (k <= 4 ? B[1] - T[1] : T[1] - B[1]);
      const cg = grp(Lx, 'geo-tv-copy'), color = col(h2.color, AMBER);
      path(cg, wedgeD(cn.X, 40, cn.start, cn.span), { stroke: color, width: 2, fill: color, fillOpacity: 0.25, cls: '' });
      path(cg, `M${pts([at(cn.X, cn.start, 70), cn.X, at(cn.X, cn.start + cn.span, 70)]).join('L')}`, { stroke: color, width: 4 });
      hlEls.push(cg);
      await tween(c, ms, (t) => cg.setAttribute('transform', `translate(${r2(dx * t)} ${r2(dy * t)})`));
      return cg;
    }
  };
  if (o.highlight) api.highlight(null, o.highlight, o.highlightOpts || {});
  return api;
}

/* ================================ compass rose & bearings ================================ */
/** Geo.compassRose(host, { x, y, width 360, height 360, centre, r 140, bearing, points 4|8|16, ticks true, degrees false
 *  (000, 030, … around the ring), arc true, label true, color red })
 *  Bearings are TRUE bearings (clockwise from north, written with 3 digits).
 *  → { set(b), turn(c, b, ms) (the ray sweeps clockwise from north to b, the label counts up), back(c, {ms}) (dashed
 *      back bearing, b ± 180°), add(b, {color, dash, label, arc}) (another static ray), value, g } */
export function compassRose(host, o = {}) {
  const W = o.width || 360, H = o.height || 360, S = surface(host, o, W, H);
  const C = o.centre || [(S.own ? 0 : o.x || 0) + W / 2, (S.own ? 0 : o.y || 0) + H / 2], R = o.r || Math.min(W, H) * 0.38;
  const g = grp(S.parent, 'geo-rose'), base = grp(g), Lr = grp(g), Lt = grp(g);
  const B2D = (b) => 90 - b;  // true bearing → math direction
  svgEl('circle', { cx: C[0], cy: C[1], r: R, fill: o.fill || '#fff', 'fill-opacity': o.fill ? 1 : 0.6, stroke: LIGHT, 'stroke-width': 1.6 }, base);
  if (o.ticks !== false) {
    let d = '';
    for (let b = 0; b < 360; b += 5) { const L = b % 30 === 0 ? 0.1 : b % 10 === 0 ? 0.065 : 0.035; const p = at(C, B2D(b), R), q = at(C, B2D(b), R * (1 - L)); d += `M${pts([p, q]).join('L')}`; }
    path(base, d, { stroke: GREY, width: 1.2, cls: '', cap: 'butt' });
  }
  if (o.degrees) for (let b = 30; b < 360; b += 30) { if (b % 90 === 0) continue; const p = at(C, B2D(b), R * 0.82); text(base, p[0], p[1], bearingText(b), { size: 13, color: GREY, weight: 600 }); }
  const NP = o.points || 4;
  [0, 90, 180, 270].forEach((b) => { const E = at(C, B2D(b), R + (b === 0 ? 24 : 12)); path(base, `M${pts([C, E]).join('L')}`, { stroke: b === 0 ? INK : SLATE, width: b === 0 ? 3.4 : 2, cls: '' }); arrowHead(base, E[0], E[1], E[0] - C[0], E[1] - C[1], { color: b === 0 ? INK : SLATE, width: b === 0 ? 3.4 : 2 }); });
  const lettersAt = (b, s, size, colr) => { const p = at(C, B2D(b), R + (b === 0 ? 44 : 30)); text(base, p[0], p[1], s, { size, color: colr }); };
  lettersAt(0, 'N', 26, RED); lettersAt(90, 'E', 21, INK); lettersAt(180, 'S', 21, INK); lettersAt(270, 'W', 21, INK);
  if (NP >= 8) [[45, 'NE'], [135, 'SE'], [225, 'SW'], [315, 'NW']].forEach(([b, s]) => { path(base, `M${pts([C, at(C, B2D(b), R)]).join('L')}`, { stroke: LIGHT, width: 1.4, cls: '' }); const p = at(C, B2D(b), R + 22); text(base, p[0], p[1], s, { size: 15, color: SLATE }); });
  if (NP >= 16) [[22.5, 'NNE'], [67.5, 'ENE'], [112.5, 'ESE'], [157.5, 'SSE'], [202.5, 'SSW'], [247.5, 'WSW'], [292.5, 'WNW'], [337.5, 'NNW']].forEach(([b, s]) => { path(base, `M${pts([C, at(C, B2D(b), R)]).join('L')}`, { stroke: '#c9ccd3', width: 1, cls: '' }); const p = at(C, B2D(b), R + 22); text(base, p[0], p[1], s, { size: 12, color: GREY }); });
  dot(base, C, { r: 4.5 });
  const colr = col(o.color, RED), ra = o.arcR || R * 0.36;
  function rayGroup(parent, b, oo = {}) {
    const gg = grp(parent), c2 = col(oo.color, colr), len = oo.len || R * 0.96;
    const line = path(gg, '', { stroke: c2, width: oo.width || 4, dash: oo.dash, cls: '' });
    const head = svgEl('polygon', { fill: c2 }, gg);
    const arc = oo.arc === false ? null : path(gg, '', { stroke: c2, width: 2.4, cls: '' });
    const ahead = oo.arc === false ? null : svgEl('polygon', { fill: c2 }, gg);
    const lab = oo.label === false ? null : text(gg, 0, 0, '', { size: oo.size || 22, color: c2 });
    const rr = oo.arcR || ra;
    const draw = (bb) => {
      const E = at(C, B2D(bb), len); line.setAttribute('d', `M${pts([C, E]).join('L')}`);
      const u = at([0, 0], B2D(bb), 1), w = 5, L = 15; head.setAttribute('points', pts([E, [E[0] - L * u[0] + w * u[1], E[1] - L * u[1] - w * u[0]], [E[0] - L * u[0] - w * u[1], E[1] - L * u[1] + w * u[0]]]).join(' '));
      if (arc) {
        arc.setAttribute('d', bb > 0.5 ? arcD(C, rr, 90, -bb) : '');
        const ae = at(C, B2D(bb), rr), tg = at([0, 0], B2D(bb) - 90, 1);   // clockwise tangent
        ahead.setAttribute('points', bb > 8 ? pts([ae, [ae[0] - 10 * tg[0] + 4.5 * tg[1], ae[1] - 10 * tg[1] - 4.5 * tg[0]], [ae[0] - 10 * tg[0] - 4.5 * tg[1], ae[1] - 10 * tg[1] + 4.5 * tg[0]]]).join(' ') : '');
      }
      if (lab) { const p = at(C, B2D(bb / 2), rr + (oo.size || 22) * 1.25 + (bb < 40 ? 10 : 0)); lab.setAttribute('x', r2(p[0])); lab.setAttribute('y', r2(p[1])); lab.textContent = typeof oo.label === 'string' ? oo.label : bearingText(bb) + '°'; lab.style.opacity = bb > 0.5 ? 1 : 0; }
    };
    draw(b); gg.draw = draw; return gg;
  }
  const api = { g, svg: S.svg, el: S.own ? S.el : g, C, R, value: null, rays: [] };
  const mo = { color: o.color, label: o.label, arc: o.arc, size: o.labelSize, width: o.rayWidth };
  let main = null, backG = null;
  api.set = (b) => { api.value = n360(b); if (!main) main = rayGroup(Lr, api.value, mo); else main.draw(api.value); if (backG) { backG.remove(); backG = null; } return main; };
  api.turn = async (c, b, ms = 1400) => {
    b = n360(b); if (!main) main = rayGroup(Lr, 0, mo);
    if (backG) { backG.remove(); backG = null; }
    api.value = b; await tween(c, ms, (t) => main.draw(Math.round(b * t * 10) / 10));
    main.draw(b);
  };
  api.back = async (c, oo = {}) => {
    const bb = n360((api.value || 0) + 180);
    if (backG) backG.remove();
    backG = rayGroup(Lr, 0, Object.assign({ color: oo.color || BLUE, dash: '10 7', arcR: R * 0.56, size: 20 }, oo));
    await tween(c, oo.ms || 1400, (t) => backG.draw(Math.round(bb * t * 10) / 10));
    backG.draw(bb); return bb;
  };
  api.add = (b, oo = {}) => { const r = rayGroup(Lr, n360(b), Object.assign({ color: BLUE, arcR: R * (0.5 + 0.12 * api.rays.length) }, oo)); api.rays.push(r); return r; };
  if (o.bearing != null) api.set(o.bearing);
  return api;
}

/* ================================ constructions ================================ */
/* the compass tool: needle at C, pencil at the arc. Legs keep their length; the hinge stays on one side of the legs for the
 * whole sweep (the side that is up on the screen halfway through it), like a compass held by its handle. */
function compassTool(parent, r) {
  const g = grp(parent, 'geo-ctool'), Lg = Math.max(r / 2 + 30, r * 0.72);
  const legN = path(g, '', { stroke: '#59606e', width: 5, cls: '' }), legP = path(g, '', { stroke: '#59606e', width: 5, cls: '' });
  const tipP = svgEl('circle', { r: 3.5, fill: AMBER }, g), handle = path(g, '', { stroke: '#2f3440', width: 7, cls: '' }), hinge = svgEl('circle', { r: 6, fill: '#2f3440' }, g);
  g.place = (C, th, side = 1) => {
    const Pp = at(C, th, r), M = [(C[0] + Pp[0]) / 2, (C[1] + Pp[1]) / 2], hh = Math.sqrt(Math.max(0, Lg * Lg - r * r / 4)), n = at([0, 0], th + 90 * side, 1);
    const Hn = [M[0] + n[0] * hh, M[1] + n[1] * hh], Ht = [Hn[0] + n[0] * 24, Hn[1] + n[1] * 24];
    legN.setAttribute('d', `M${pts([Hn, C]).join('L')}`); legP.setAttribute('d', `M${pts([Hn, Pp]).join('L')}`);
    handle.setAttribute('d', `M${pts([Hn, Ht]).join('L')}`); hinge.setAttribute('cx', r2(Hn[0])); hinge.setAttribute('cy', r2(Hn[1]));
    tipP.setAttribute('cx', r2(Pp[0])); tipP.setAttribute('cy', r2(Pp[1]));
  };
  return g;
}
function circleX(A, ra, Bc, rb) {   // intersections of two circles (the two points, or [] if none)
  const d = dist(A, Bc); if (d > ra + rb || d < Math.abs(ra - rb) || d === 0) return [];
  const a = (ra * ra - rb * rb + d * d) / (2 * d), hh = Math.sqrt(Math.max(0, ra * ra - a * a));
  const M = [A[0] + a * (Bc[0] - A[0]) / d, A[1] + a * (Bc[1] - A[1]) / d];
  return [[M[0] + hh * (Bc[1] - A[1]) / d, M[1] - hh * (Bc[0] - A[0]) / d], [M[0] - hh * (Bc[1] - A[1]) / d, M[1] + hh * (Bc[0] - A[0]) / d]];
}
/** Geo.construct(host, steps, { x, y, width 600, height 380 }) — compass-and-straightedge constructions, animated.
 *  steps: [{ cap, given, <op> | do: [ops…] }]. A step with given: true is drawn at once (the starting picture); the
 *  others become explainer steps. Ops (px, math degrees):
 *    { arc: { c, r, from, to, tool: true, color } }        compass: needle at c, the pencil sweeps from → to
 *    { line: { a, b, ext: [e0, e1], tool: true, color, width, dash, arrow } }   straightedge from a to b (extended)
 *    { point: { at, label, pos (direction of the label, degrees), color } }
 *    { angle: {…Geo.angle opts} } · { right: { V, P, Q } } · { ticks: { a, b, n } } · { text: { at, s, size, color } }
 *    { fn: ({ c, g, layers, svg }) => … }
 *  → { el, svg, g, layers, steps: [{ cap, run(c) }] (give them straight to an explainer), play(c) }
 *  Presets that return such step lists: Geo.construct.bisect, .copy, .perpBisector, .perpAt, .perpFrom (see below). */
export function construct(host, list, o = {}) {
  const S = surface(host, o, o.width || 600, o.height || 380);
  const g = grp(S.parent, 'geo-con');
  const L = { given: grp(g), marks: grp(g), arcs: grp(g), lines: grp(g), pts: grp(g), tools: grp(g) };
  async function op(c, k, v) {
    if (k === 'arc') {
      const a = path(L.arcs, '', { stroke: col(v.color, PENCIL), width: v.width || 2, cls: '' }), span = v.to - v.from;
      const tool = v.tool === false ? null : compassTool(L.tools, v.r), side = at([0, 0], v.from + span / 2 + 90, 1)[1] < 0 ? 1 : -1;
      await tween(c, v.ms || Math.min(1500, 500 + Math.abs(span) * 7), (t) => { const th = v.from + span * t; a.setAttribute('d', Math.abs(span * t) > 0.2 ? arcD(v.c, v.r, v.from, span * t) : ''); if (tool) tool.place(v.c, th, side); });
      if (tool) { if (c && !c.fast) await tween(c, 220, (t) => { tool.style.opacity = 1 - t; }); tool.remove(); }
      return a;
    }
    if (k === 'line') {
      const u = at([0, 0], dirTo(v.a, v.b), 1), e = v.ext || [0, 0], A0 = [v.a[0] - u[0] * e[0], v.a[1] - u[1] * e[0]], B0 = [v.b[0] + u[0] * e[1], v.b[1] + u[1] * e[1]];
      const ln = path(L.lines, '', { stroke: col(v.color, '#2b3140'), width: v.width || 2.4, dash: v.dash, cls: '' });
      let rl = null;
      if (v.tool !== false && c && !c.fast) {
        const len = dist(A0, B0) + 70, th = dirTo(A0, B0), nrm = at([0, 0], th - 90, 1), off = 3, wdt = 34;
        const p1 = [A0[0] - u[0] * 35 + nrm[0] * off, A0[1] - u[1] * 35 + nrm[1] * off], p2 = [p1[0] + u[0] * len, p1[1] + u[1] * len];
        rl = path(L.tools, `M${pts([p1, p2, [p2[0] + nrm[0] * wdt, p2[1] + nrm[1] * wdt], [p1[0] + nrm[0] * wdt, p1[1] + nrm[1] * wdt]]).join('L')}Z`, { stroke: '#a08a5c', width: 1.5, fill: '#f7ecd2', fillOpacity: 0.85, cls: '' });
        await appear(c, rl, 250);
      }
      await tween(c, v.ms || 700, (t) => ln.setAttribute('d', `M${pts([A0, [A0[0] + (B0[0] - A0[0]) * t, A0[1] + (B0[1] - A0[1]) * t]]).join('L')}`));
      if (v.arrow) arrowHead(L.lines, B0[0], B0[1], u[0], u[1], { color: col(v.color, '#2b3140'), width: v.width || 2.4 });
      if (rl) { await tween(c, 220, (t) => { rl.style.opacity = 1 - t; }); rl.remove(); }
      return ln;
    }
    if (k === 'point') {
      const d = dot(L.pts, v.at, { color: v.color, r: v.r || 4.5 });
      let lab = null;
      if (v.label) { const p = at(v.at, v.pos ?? 45, v.dist || 20); lab = popable(text(L.pts, p[0], p[1], v.label, { size: v.size || 21, color: v.color })); }
      await Promise.all([pop(c, d, 300), lab ? pop(c, lab, 300) : null]);
      return d;
    }
    if (k === 'angle') { const A = angle(L.marks, Object.assign({ arms: false, dot: false }, v)); await A.drawIn(c, 500); return A; }
    if (k === 'right') { const s = v.s || 18, u = at([0, 0], dirTo(v.V, v.P), 1), w = at([0, 0], dirTo(v.V, v.Q), 1); const p = path(L.marks, `M${pts([[v.V[0] + u[0] * s, v.V[1] + u[1] * s], [v.V[0] + (u[0] + w[0]) * s, v.V[1] + (u[1] + w[1]) * s], [v.V[0] + w[0] * s, v.V[1] + w[1] * s]]).join('L')}`, { stroke: col(v.color, RED), width: 2.4, cap: 'butt' }); await drawIn(p, 400, c); return p; }
    if (k === 'ticks') {
      const M = [(v.a[0] + v.b[0]) / 2, (v.a[1] + v.b[1]) / 2], th = dirTo(v.a, v.b), n = v.n || 1; let d = '';
      for (let i = 0; i < n; i++) { const m = at(M, th, (i - (n - 1) / 2) * 7); d += `M${pts([at(m, th + 90, 9), at(m, th - 90, 9)]).join('L')}`; }
      const p = path(L.marks, d, { stroke: col(v.color, RED), width: 2.4 }); await drawIn(p, 300, c); return p;
    }
    if (k === 'text') { const t = popable(text(L.pts, v.at[0], v.at[1], v.s, { size: v.size || 20, color: v.color, anchor: v.anchor })); await fadeIn(c, t, 300); return t; }
    if (k === 'fn') return v({ c, g, layers: L, svg: S.svg });
    return null;
  }
  const KEYS = ['arc', 'line', 'point', 'angle', 'right', 'ticks', 'text', 'fn'];
  async function runStep(c, s) {
    const ops = s.do ? s.do : KEYS.filter((k) => s[k] != null).map((k) => ({ [k]: s[k] }));
    for (const one of ops) for (const k of KEYS) if (one[k] != null) { const vals = Array.isArray(one[k]) && typeof one[k][0] === 'object' && !Array.isArray(one[k][0]) ? one[k] : [one[k]]; for (const v of vals) await op(c, k, v); }
  }
  const steps = [];
  list.forEach((s) => { if (s.given) runStep(null, s); else steps.push({ cap: s.cap || '', run: (c) => runStep(c, s) }); });
  return { el: S.own ? S.el : g, svg: S.svg, g, layers: L, steps, play: async (c) => { for (const s of steps) await s.run(c); } };
}
const P_ = (p, u, k) => [p[0] + u[0] * k, p[1] + u[1] * k];
/** bisect an angle: { vertex, a1, a2 (directions or points), len 250, r1, r2, names, labels true } */
construct.bisect = function (o) {
  const V = o.vertex, d1 = isPt(o.a1) ? dirTo(V, o.a1) : o.a1, d2 = isPt(o.a2) ? dirTo(V, o.a2) : o.a2;
  let start = d1, span = n360(d2 - d1); if (span > 180) { start = d2; span = 360 - span; }
  const len = o.len || 250, r1 = o.r1 || len * 0.46, P = at(V, start, r1), Q = at(V, start + span, r1), pq = dist(P, Q);
  const r2v = o.r2 || Math.max(pq * 0.72, r1 * 0.62), mid = start + span / 2;
  const X = circleX(P, r2v, Q, r2v).sort((a, b) => dist(b, V) - dist(a, V))[0];
  const half = fmtDeg(span / 2);
  return [
    { given: true, angle: { vertex: V, a1: d1, a2: d2, len, arc: false, arms: true, dot: true, names: o.names } },
    { cap: '<b>1.</b> Compass point on the <b>vertex</b>. Draw an arc that crosses <b>both arms</b>.', do: [{ arc: { c: V, r: r1, from: start - 10, to: start + span + 10 } }, { point: { at: P, r: 4 } }, { point: { at: Q, r: 4 } }] },
    { cap: '<b>2.</b> Compass point where the arc crosses one arm. Draw an arc <b>inside</b> the angle.', arc: { c: P, r: r2v, from: dirTo(P, X) - 22, to: dirTo(P, X) + 22 } },
    { cap: '<b>3.</b> <b>Same compass width</b>, from the other arm. The two arcs cross.', do: [{ arc: { c: Q, r: r2v, from: dirTo(Q, X) + 22, to: dirTo(Q, X) - 22 } }, { point: { at: X, r: 4 } }] },
    { cap: '<b>4.</b> Line up the straightedge from the vertex through the crossing. Draw the <b>bisector</b>.', line: { a: V, b: at(V, mid, len * 1.02) } },
    { cap: `The bisector splits the angle into <b>two equal angles</b>${o.labels === false ? '' : `: ${fmtDeg(span)}° ÷ 2 = <b>${half}°</b>`}.`,
      do: [{ angle: { vertex: V, a1: start, a2: mid, r: r1 * 0.42, label: o.labels === false ? null : half + '°', size: 19, arcColor: BLUE, labelColor: BLUE } }, { angle: { vertex: V, a1: mid, a2: start + span, r: r1 * 0.5, label: o.labels === false ? null : half + '°', size: 19, arcColor: GREEN, labelColor: GREEN } }] }
  ];
};
/** copy an angle: { from: { vertex, a1, a2, len }, to: { vertex, dir, len }, r1, labels true } (the copy opens counterclockwise from dir) */
construct.copy = function (o) {
  const F = o.from, V = F.vertex, d1 = isPt(F.a1) ? dirTo(V, F.a1) : F.a1, d2 = isPt(F.a2) ? dirTo(V, F.a2) : F.a2;
  let start = d1, span = n360(d2 - d1); if (span > 180) { start = d2; span = 360 - span; }
  const len = F.len || 200, V2 = o.to.vertex, d0 = o.to.dir || 0, len2 = o.to.len || len, r1 = o.r1 || len * 0.5;
  const P = at(V, start, r1), Q = at(V, start + span, r1), P2 = at(V2, d0, r1), Q2 = at(V2, d0 + span, r1), pq = dist(P, Q);
  return [
    { given: true, do: [{ angle: { vertex: V, a1: d1, a2: d2, len, arc: false, arms: true, dot: true, names: F.names } }, { line: { a: V2, b: at(V2, d0, len2), tool: false } }, { point: { at: V2, r: 4 } }] },
    { cap: '<b>1.</b> On the angle you are copying: compass on the <b>vertex</b>, draw an arc across <b>both arms</b>.', do: [{ arc: { c: V, r: r1, from: start - 8, to: start + span + 8 } }, { point: { at: P, r: 4 } }, { point: { at: Q, r: 4 } }] },
    { cap: '<b>2.</b> <b>Same width</b>: compass on the end of the new ray. Draw a long arc across it.', do: [{ arc: { c: V2, r: r1, from: d0 - 8, to: d0 + span + 20 } }, { point: { at: P2, r: 4 } }] },
    { cap: '<b>3.</b> Back on the first angle: set the compass to the <b>distance between the two crossings</b>.', arc: { c: P, r: pq, from: dirTo(P, Q) - 14, to: dirTo(P, Q) + 14 } },
    { cap: '<b>4.</b> Keep that width. From the crossing on the new ray, cut the long arc.', do: [{ arc: { c: P2, r: pq, from: dirTo(P2, Q2) - 14, to: dirTo(P2, Q2) + 14 } }, { point: { at: Q2, r: 4 } }] },
    { cap: '<b>5.</b> Draw a ray from the vertex through that crossing. The new angle is an <b>exact copy</b>.',
      do: [{ line: { a: V2, b: at(V2, d0 + span, len2) } }, { angle: { vertex: V, a1: start, a2: start + span, r: r1 * 0.38, label: o.labels === false ? null : fmtDeg(span) + '°', size: 19, arcColor: BLUE, labelColor: BLUE } }, { angle: { vertex: V2, a1: d0, a2: d0 + span, r: r1 * 0.38, label: o.labels === false ? null : fmtDeg(span) + '°', size: 19, arcColor: BLUE, labelColor: BLUE } }] }
  ];
};
/** the perpendicular bisector of segment AB: { a, b, r, names: ['A', 'B'] } */
construct.perpBisector = function (o) {
  const A = o.a, Bp = o.b, r = o.r || dist(A, Bp) * 0.7, nm = o.names || ['A', 'B'];
  const [X, Y] = circleX(A, r, Bp, r).sort((p, q) => p[1] - q[1]);
  const M = [(A[0] + Bp[0]) / 2, (A[1] + Bp[1]) / 2], th = dirTo(A, Bp);
  return [
    { given: true, do: [{ line: { a: A, b: Bp, tool: false } }, { point: { at: A, label: nm[0], pos: th + 180 + 30 } }, { point: { at: Bp, label: nm[1], pos: th - 30 } }] },
    { cap: '<b>1.</b> Open the compass to <b>more than half</b> of the segment. From one end, draw an arc above and below.', do: [{ arc: { c: A, r, from: dirTo(A, X) - 16, to: dirTo(A, X) + 16 } }, { arc: { c: A, r, from: dirTo(A, Y) - 16, to: dirTo(A, Y) + 16 } }] },
    { cap: '<b>2.</b> <b>Same width</b>, from the other end. The arcs cross at two points.', do: [{ arc: { c: Bp, r, from: dirTo(Bp, X) + 16, to: dirTo(Bp, X) - 16 } }, { arc: { c: Bp, r, from: dirTo(Bp, Y) + 16, to: dirTo(Bp, Y) - 16 } }, { point: { at: X, r: 4 } }, { point: { at: Y, r: 4 } }] },
    { cap: '<b>3.</b> Join the two crossings with the straightedge: the <b>perpendicular bisector</b>.', line: { a: X, b: Y, ext: [30, 30] } },
    { cap: 'It cuts the segment <b>in half</b> (equal tick marks) at a <b>right angle</b> (the square).', do: [{ right: { V: M, P: Bp, Q: X } }, { ticks: { a: A, b: M } }, { ticks: { a: M, b: Bp } }, { point: { at: M, label: o.mid || 'M', pos: th - 135, r: 4 } }] }
  ];
};
/** a perpendicular through a point P ON line AB: { a, b, p, r1, r2, name: 'P' } */
construct.perpAt = function (o) {
  const A = o.a, Bp = o.b, Pp = o.p, th = dirTo(A, Bp), u = at([0, 0], th, 1), r1 = o.r1 || 100, r2v = o.r2 || r1 * 1.6;
  const Cc = P_(Pp, u, -r1), Dd = P_(Pp, u, r1), E = at(Pp, th + 90, Math.sqrt(r2v * r2v - r1 * r1));
  return [
    { given: true, do: [{ line: { a: A, b: Bp, tool: false } }, { point: { at: Pp, label: o.name || 'P', pos: th - 60 } }] },
    { cap: '<b>1.</b> Compass point on <b>P</b>. Mark the line on <b>both sides</b> of P, the same distance away.', do: [{ arc: { c: Pp, r: r1, from: th + 168, to: th + 192 } }, { arc: { c: Pp, r: r1, from: th + 12, to: th - 12 } }, { point: { at: Cc, r: 4 } }, { point: { at: Dd, r: 4 } }] },
    { cap: '<b>2.</b> Open the compass <b>wider</b>. From each mark, draw an arc above P. They cross.', do: [{ arc: { c: Cc, r: r2v, from: dirTo(Cc, E) - 14, to: dirTo(Cc, E) + 14 } }, { arc: { c: Dd, r: r2v, from: dirTo(Dd, E) + 14, to: dirTo(Dd, E) - 14 } }, { point: { at: E, r: 4 } }] },
    { cap: '<b>3.</b> Draw the line through P and the crossing: it is <b>perpendicular</b> to the first line.', do: [{ line: { a: Pp, b: E, ext: [0, 60] } }, { right: { V: Pp, P: Dd, Q: E } }] }
  ];
};
/** a perpendicular from a point P OFF line AB: { a, b, p, r1, name: 'P' } */
construct.perpFrom = function (o) {
  const A = o.a, Bp = o.b, Pp = o.p, th = dirTo(A, Bp), u = at([0, 0], th, 1);
  const t = (Pp[0] - A[0]) * u[0] + (Pp[1] - A[1]) * u[1], F = P_(A, u, t), dPF = dist(Pp, F), r1 = o.r1 || dPF * 1.45;
  const hw = Math.sqrt(r1 * r1 - dPF * dPF), Cc = P_(F, u, -hw), Dd = P_(F, u, hw), down = dirTo(Pp, F), half = Math.acos(dPF / r1) / RAD;
  const eD = o.below || Math.min(dPF, 110), r2v = o.r2 || Math.hypot(hw, eD), E = at(F, down, Math.sqrt(r2v * r2v - hw * hw));
  return [
    { given: true, do: [{ line: { a: A, b: Bp, tool: false } }, { point: { at: Pp, label: o.name || 'P', pos: down + 180 } }] },
    { cap: '<b>1.</b> Compass point on <b>P</b>. Draw an arc that crosses the line <b>twice</b>.', do: [{ arc: { c: Pp, r: r1, from: down - half - 10, to: down + half + 10 } }, { point: { at: Cc, r: 4 } }, { point: { at: Dd, r: 4 } }] },
    { cap: '<b>2.</b> From each crossing, with the <b>same width</b> both times, draw an arc on the <b>other side</b> of the line. They cross.', do: [{ arc: { c: Cc, r: r2v, from: dirTo(Cc, E) - 14, to: dirTo(Cc, E) + 14 } }, { arc: { c: Dd, r: r2v, from: dirTo(Dd, E) + 14, to: dirTo(Dd, E) - 14 } }, { point: { at: E, r: 4 } }] },
    { cap: '<b>3.</b> Join P to that crossing: the line is <b>perpendicular</b> to the first line.', do: [{ line: { a: Pp, b: E, ext: [0, 20] } }, { right: { V: F, P: Dd, Q: Pp } }] }
  ];
};

/* ================================ puzzle pieces (tangrams, pentominoes) ================================ */
/* piece state: x, y = where its centre is (px), rot = degrees CLOCKWISE on screen, flip = mirrored.
 * world point = (x, y) + rotate(rot) · mirror(flip) · local point (local points are around the centre). */
function worldPts(p, s = p.st) {
  const c = Math.cos(s.rot * RAD), sn = Math.sin(s.rot * RAD);
  return p.poly.map(([vx, vy]) => { const fx = s.flip ? -vx : vx; return [s.x + fx * c - vy * sn, s.y + fx * sn + vy * c]; });
}
function pieceBoard(host, o, defs, kind) {
  const W = o.width || 640, H = o.height || 420;
  const wrap = h('div', 'geo-pc' + (o.cls ? ' ' + o.cls : ''));
  if (o.x != null || o.y != null || (host && host.classList && host.classList.contains('ex-stage'))) { wrap.style.position = 'absolute'; wrap.style.left = (o.x || 0) + 'px'; wrap.style.top = (o.y || 0) + 'px'; }
  const fig = h('div', 'geo-box'); fig.style.width = W + 'px'; fig.style.height = H + 'px'; wrap.appendChild(fig);
  const svg = svgEl('svg', { class: 'geo-svg', width: W, height: H, viewBox: `0 0 ${W} ${H}` }, fig);
  const Lg = grp(svg, 'geo-pc-grid'), Lt = grp(svg, 'geo-pc-target'), Lp = grp(svg, 'geo-pc-pieces');
  if (host) host.appendChild(wrap);
  const pieces = defs.map((d) => {
    const g = grp(Lp, 'geo-piece', { 'data-tap': '' }), body = grp(g);
    const p = { id: d.id, poly: d.poly, color: d.color, g, body, st: Object.assign({ x: W / 2, y: H / 2, rot: 0, flip: false }, d.st), home: null, squash: 1, tok: 0 };
    d.draw(body, p);
    p.labAt = d.labelAt || [0, 0];
    if (d.label) { p.lab = text(g, 0, 0, d.label, { size: d.labelSize || 18, color: INK, halo: 4 }); p.lab.style.pointerEvents = 'none'; }
    p.home = { ...p.st };
    return p;
  });
  const byId = {}; pieces.forEach((p) => { byId[p.id] = p; });
  function render(p) {
    const s = p.st;
    p.g.setAttribute('transform', `translate(${r2(s.x)} ${r2(s.y)}) scale(${r2(p.squash)} 1) rotate(${r2(s.rot)}) scale(${s.flip ? -1 : 1} 1)`);
    if (p.lab) p.lab.setAttribute('transform', `translate(${r2(p.labAt[0])} ${r2(p.labAt[1])}) scale(${s.flip ? -1 : 1} 1) rotate(${r2(-s.rot)})`);
  }
  const snapOn = () => o.snap !== false;
  function snapPiece(p) {
    if (!snapOn()) return;
    const v = worldPts(p), d = kind.snap(p, v, pieces);
    if (d) { p.st.x += d[0]; p.st.y += d[1]; }
    const bb = bbox(worldPts(p));   // keep it on the board
    if (bb[2] < 20) p.st.x += 20 - bb[2]; if (bb[0] > W - 20) p.st.x -= bb[0] - (W - 20);
    if (bb[3] < 20) p.st.y += 20 - bb[3]; if (bb[1] > H - 20) p.st.y -= bb[1] - (H - 20);
  }
  const changed = () => { if (o.onChange) o.onChange(api.state()); };
  function animRot(p, from, to, ms = 160) {
    const t0 = performance.now(), tok = ++p.tok;
    p.pending = () => { p.pending = null; p.st.rot = n360(to); snapPiece(p); render(p); changed(); };
    const step = (now) => { if (tok !== p.tok) return; const t = Math.min(1, (now - t0) / ms); if (t >= 1) { p.pending(); return; } p.st.rot = from + (to - from) * t; render(p); requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
  function animFlip(p, ms = 220) {
    const t0 = performance.now(), r0 = p.st.rot, f0 = p.st.flip, tok = ++p.tok;
    p.pending = () => { p.pending = null; p.squash = 1; p.st.rot = n360(-r0); p.st.flip = !f0; snapPiece(p); render(p); changed(); };
    const step = (now) => { if (tok !== p.tok) return; const t = Math.min(1, (now - t0) / ms); if (t >= 1) { p.pending(); return; } p.squash = Math.cos(Math.PI * t); render(p); requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
  // pointer: drag to move; tap = turn; a second tap soon after = flip instead
  let drag = null, lastTap = null;
  pieces.forEach((p) => {
    p.g.addEventListener('pointerdown', (e) => {
      if (drag || (e.pointerType === 'mouse' && e.button !== 0)) return;
      e.preventDefault(); e.stopPropagation();
      Lp.appendChild(p.g);   // to the front
      p.tok++; if (p.pending) p.pending();
      drag = { p, id: e.pointerId, p0: svgPoint(svg, e), c0: [e.clientX, e.clientY], s0: { ...p.st }, moved: false };
      try { p.g.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    });
    p.g.addEventListener('pointermove', (e) => {
      if (!drag || drag.p !== p || e.pointerId !== drag.id) return;
      if (!drag.moved && Math.hypot(e.clientX - drag.c0[0], e.clientY - drag.c0[1]) < 7) return;
      drag.moved = true; const q = svgPoint(svg, e);
      p.st.x = drag.s0.x + q[0] - drag.p0[0]; p.st.y = drag.s0.y + q[1] - drag.p0[1]; render(p);
    });
    const end = (e) => {
      if (!drag || drag.p !== p || e.pointerId !== drag.id) return;
      const was = drag; drag = null;
      if (was.moved) { snapPiece(p); render(p); changed(); lastTap = null; return; }
      if (e.type === 'pointercancel') return;
      const now = performance.now();
      if (o.flip !== false && lastTap && lastTap.p === p && now - lastTap.t < 340) { p.st.rot = lastTap.rot; render(p); lastTap = null; animFlip(p); return; }
      lastTap = { p, t: now, rot: p.st.rot };
      if (o.rotate !== false) animRot(p, p.st.rot, p.st.rot + kind.rotStep);
    };
    p.g.addEventListener('pointerup', end); p.g.addEventListener('pointercancel', end);
    p.g.addEventListener('dblclick', (e) => e.preventDefault());
    render(p);
  });
  const api = {
    el: wrap, svg, pieces: byId, list: pieces, layers: { grid: Lg, target: Lt, pieces: Lp },
    state: () => ({ pieces: pieces.map((p) => ({ id: p.id, x: r2(p.st.x), y: r2(p.st.y), rot: n360(Math.round(p.st.rot)), flip: p.st.flip })), extra: kind.extra ? kind.extra(pieces) : undefined }),
    set(id, s) { const p = byId[id]; Object.assign(p.st, s); render(p); },
    reset() { pieces.forEach((p) => { p.st = { ...p.home }; p.squash = 1; render(p); }); changed(); },
    /** move pieces to a layout ({ id: {x, y, rot, flip} }), animated with c */
    async arrange(c, layout, ms = 900) {
      const from = pieces.map((p) => ({ ...p.st }));
      await tween(c, ms, (t) => pieces.forEach((p, i) => { const L = layout[p.id]; if (!L) return; const f = from[i]; p.st.x = f.x + (L.x - f.x) * t; p.st.y = f.y + (L.y - f.y) * t; p.st.rot = f.rot + n180((L.rot || 0) - f.rot) * t; if (t >= 1) { p.st.flip = !!L.flip; p.st.rot = n360(L.rot || 0); } render(p); }));
      changed();
    },
    worldPts: (id) => worldPts(byId[id])
  };
  return api;
}
const bbox = (v) => { let a = Infinity, b = Infinity, c = -Infinity, d = -Infinity; v.forEach(([x, y]) => { a = Math.min(a, x); b = Math.min(b, y); c = Math.max(c, x); d = Math.max(d, y); }); return [a, b, c, d]; };
const centroid = (poly) => { let A = 0, cx = 0, cy = 0; for (let i = 0; i < poly.length; i++) { const [x0, y0] = poly[i], [x1, y1] = poly[(i + 1) % poly.length], k = x0 * y1 - x1 * y0; A += k; cx += (x0 + x1) * k; cy += (y0 + y1) * k; } A /= 2; return [cx / (6 * A), cy / (6 * A)]; };
const addBtns = (wrap, list) => { const row = h('div', 'geo-btns'); wrap.appendChild(row); list.forEach(([label, fn]) => { const b = h('button', 'pill small', label); b.type = 'button'; b.onclick = fn; row.appendChild(b); }); return row; };

/* tangram: the 7-piece square, side 4 units (small triangle = 1 square unit … large triangle = 4), y down */
export const TANGRAM = {
  L1: { poly: [[0, 4], [2, 2], [0, 0]], area: 4, name: 'large triangle', color: '#f2c14e' },
  L2: { poly: [[0, 0], [2, 2], [4, 0]], area: 4, name: 'large triangle', color: '#ef8a5b' },
  M: { poly: [[2, 4], [4, 4], [4, 2]], area: 2, name: 'medium triangle', color: '#7cc4a4' },
  S1: { poly: [[1, 3], [3, 3], [2, 2]], area: 1, name: 'small triangle', color: '#8fb3f0' },
  S2: { poly: [[3, 1], [4, 2], [4, 0]], area: 1, name: 'small triangle', color: '#c39be8' },
  SQ: { poly: [[2, 2], [3, 3], [4, 2], [3, 1]], area: 2, name: 'square', color: '#f28fb0' },
  PA: { poly: [[0, 4], [2, 4], [3, 3], [1, 3]], area: 2, name: 'parallelogram', color: '#a7d36b' }
};
/** Geo.tangram(host, { x, y, width 640, height 420, unit 50 (px per unit; the square is 4 units), layout 'scatter'|'square'
 *  | { id: {x, y, rot, flip} }, at: [x, y] (top-left of the solved square), labels false | 'area' | 'name', grid true,
 *  target: [[x, y]…] (a silhouette to fill, in units), targetAt: [x, y], snap true, buttons true, onChange(state) })
 *  Drag to move, tap to turn 45°, double-tap to flip. Pieces: L1 L2 (large), M (medium), S1 S2 (small), SQ, PA.
 *  → { el, svg, pieces, state(), set(id, s), reset(), solve(c), scatter(c), arrange(c, layout), squareLayout } */
export function tangram(host, o = {}) {
  const W = o.width || 640, H = o.height || 420, u = o.unit || 50, ids = o.pieces || Object.keys(TANGRAM);
  const sqAt = o.at || [W - 4 * u - 30, (H - 4 * u) / 2];
  const sq = {}, defs = ids.map((id) => {
    const T = TANGRAM[id], cen = centroid(T.poly), poly = T.poly.map(([x, y]) => [(x - cen[0]) * u, (y - cen[1]) * u]);
    sq[id] = { x: sqAt[0] + cen[0] * u, y: sqAt[1] + cen[1] * u, rot: 0, flip: false };
    return { id, poly, color: T.color, label: o.labels === 'area' ? String(T.area) : o.labels === 'name' ? T.name : null, labelSize: o.labels === 'name' ? 13 : 20,
      draw: (g, p) => { svgEl('polygon', { points: pts(poly).join(' '), fill: T.color, stroke: '#3a4254', 'stroke-width': 2, 'stroke-linejoin': 'round' }, g); void p; } };
  });
  const scat = { L1: [0.13, 0.33, 45], L2: [0.32, 0.27, 0], M: [0.12, 0.78, 90], S1: [0.3, 0.72, 180], S2: [0.44, 0.62, 45], SQ: [0.47, 0.83, 45], PA: [0.25, 0.92, 0] };
  const scatter = {}; ids.forEach((id) => { const s = scat[id] || [0.3, 0.5, 0]; scatter[id] = { x: s[0] * W, y: s[1] * H, rot: s[2], flip: false }; });
  const start = o.layout === 'square' ? sq : (o.layout && typeof o.layout === 'object') ? Object.assign({}, scatter, o.layout) : scatter;
  defs.forEach((d) => { d.st = Object.assign({}, start[d.id]); });
  const kind = {
    rotStep: 45,
    snap(p, v, all) {   // nearest vertex-to-vertex (other pieces) or vertex-to-grid match within reach
      const reach = u * 0.3; let best = null;
      const cands = []; all.forEach((q) => { if (q !== p) worldPts(q).forEach((w) => cands.push(w)); });
      v.forEach((pt) => {
        cands.forEach((w) => { const d = dist(pt, w); if (d < reach && (!best || d < best.d)) best = { d, dx: w[0] - pt[0], dy: w[1] - pt[1] }; });
        if (o.grid !== false) { const gx = sqAt[0] + Math.round((pt[0] - sqAt[0]) / u) * u, gy = sqAt[1] + Math.round((pt[1] - sqAt[1]) / u) * u, d = dist(pt, [gx, gy]); if (d < reach * 0.7 && (!best || d < best.d - 2)) best = { d, dx: gx - pt[0], dy: gy - pt[1] }; }
      });
      return best ? [best.dx, best.dy] : null;
    }
  };
  const B = pieceBoard(host, Object.assign({ width: W, height: H }, o), defs, kind);
  if (o.grid !== false) { for (let gx = sqAt[0] % u; gx <= W; gx += u) for (let gy = sqAt[1] % u; gy <= H; gy += u) svgEl('circle', { cx: r2(gx), cy: r2(gy), r: 1.6, fill: '#c3c7cf' }, B.layers.grid); }
  if (o.outline !== false && !o.target) svgEl('rect', { x: sqAt[0], y: sqAt[1], width: 4 * u, height: 4 * u, fill: 'none', stroke: '#c3c7cf', 'stroke-width': 2, 'stroke-dasharray': '7 6' }, B.layers.target);
  if (o.target) { const ta = o.targetAt || sqAt; svgEl('polygon', { points: pts(o.target.map(([x, y]) => [ta[0] + x * u, ta[1] + y * u])).join(' '), fill: '#e7e3d9', stroke: '#9aa0ab', 'stroke-width': 2 }, B.layers.target); }
  const api = Object.assign(B, {
    squareLayout: sq, scatterLayout: scatter,
    solve: (c, ms) => B.arrange(c, sq, ms), scatter: (c, ms) => B.arrange(c, scatter, ms)
  });
  if (o.buttons !== false) addBtns(B.el, [['Make the square', () => api.solve({ fast: false, check() {} }, 900)], ['Mix them up', () => api.scatter({ fast: false, check() {} }, 700)]]);
  return api;
}

/* pentominoes: [col, row] cells */
export const PENTOMINOES = {
  F: [[1, 0], [2, 0], [0, 1], [1, 1], [1, 2]], I: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], L: [[0, 0], [0, 1], [0, 2], [0, 3], [1, 3]],
  N: [[0, 0], [0, 1], [1, 1], [1, 2], [1, 3]], P: [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2]], T: [[0, 0], [1, 0], [2, 0], [1, 1], [1, 2]],
  U: [[0, 0], [2, 0], [0, 1], [1, 1], [2, 1]], V: [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]], W: [[0, 0], [0, 1], [1, 1], [1, 2], [2, 2]],
  X: [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]], Y: [[1, 0], [0, 1], [1, 1], [1, 2], [1, 3]], Z: [[0, 0], [1, 0], [1, 1], [1, 2], [2, 2]]
};
const PENTO_COLORS = { F: '#f2c14e', I: '#8fb3f0', L: '#ef8a5b', N: '#7cc4a4', P: '#c39be8', T: '#f28fb0', U: '#a7d36b', V: '#6fc7d9', W: '#e9a6a6', X: '#d9c27a', Y: '#9bb5a8', Z: '#b9a2d6' };
/** Geo.pentomino(host, { x, y, width 640, height 420, cell 36, letters 'FILNPTUVWXYZ' (or a list; repeats allowed: 'PPLL'),
 *  board: { cols, rows, at: [col, row] } (a dashed rectangle to fill, in grid cells), labels true (the letter),
 *  layout: { id: {x, y, rot, flip} }, snap true, buttons true, onChange(state) })
 *  Drag to move, tap to turn 90°, double-tap to flip; pieces snap to the grid. state().extra = { covered, filled } for the board.
 *  Piece ids are the letters (a repeat gets a number: P, P2). → same API as tangram (arrange, reset, state, pieces) */
export function pentomino(host, o = {}) {
  const W = o.width || 640, H = o.height || 420, cs = o.cell || 36;
  const letters = (Array.isArray(o.letters) ? o.letters : (o.letters || 'FILNPTUVWXYZ').split('')).filter((l) => PENTOMINOES[l]);
  const seen = {}, defs = [];
  let px = cs, py = cs, rowH = 0;
  letters.forEach((L) => {
    seen[L] = (seen[L] || 0) + 1; const id = seen[L] > 1 ? L + seen[L] : L;
    const cells = PENTOMINOES[L], mx = Math.max(...cells.map((c) => c[0])) + 1, my = Math.max(...cells.map((c) => c[1])) + 1;
    const cx = mx / 2, cy = my / 2, poly = [];
    cells.forEach(([a, b]) => { [[a, b], [a + 1, b], [a + 1, b + 1], [a, b + 1]].forEach(([x, y]) => poly.push([(x - cx) * cs, (y - cy) * cs])); });
    if (px + mx * cs > W - cs * 0.5) { px = cs; py += rowH + cs; rowH = 0; }
    const st = { x: px + mx * cs / 2, y: py + my * cs / 2, rot: 0, flip: false };
    px += mx * cs + cs; rowH = Math.max(rowH, my * cs);
    const colr = PENTO_COLORS[L];
    const mcx = cells.reduce((a, c) => a + c[0] + 0.5, 0) / 5, mcy = cells.reduce((a, c) => a + c[1] + 0.5, 0) / 5;
    const lc = cells.slice().sort((a, b) => Math.hypot(a[0] + 0.5 - mcx, a[1] + 0.5 - mcy) - Math.hypot(b[0] + 0.5 - mcx, b[1] + 0.5 - mcy))[0];
    defs.push({ id, poly, color: colr, label: o.labels === false ? null : L, labelAt: [(lc[0] + 0.5 - cx) * cs, (lc[1] + 0.5 - cy) * cs], labelSize: Math.round(cs * 0.5), st: o.layout && o.layout[id] ? Object.assign({}, st, o.layout[id]) : st,
      draw: (g) => {
        cells.forEach(([a, b]) => svgEl('rect', { x: r2((a - cx) * cs), y: r2((b - cy) * cs), width: cs, height: cs, fill: colr, stroke: 'rgba(58,66,84,.35)', 'stroke-width': 1 }, g));
        const has = {}; cells.forEach(([a, b]) => { has[a + ',' + b] = 1; });
        let d = ''; const E = (x1, y1, x2, y2) => { d += `M${r2((x1 - cx) * cs)} ${r2((y1 - cy) * cs)}L${r2((x2 - cx) * cs)} ${r2((y2 - cy) * cs)}`; };
        cells.forEach(([a, b]) => { if (!has[a + ',' + (b - 1)]) E(a, b, a + 1, b); if (!has[a + ',' + (b + 1)]) E(a, b + 1, a + 1, b + 1); if (!has[(a - 1) + ',' + b]) E(a, b, a, b + 1); if (!has[(a + 1) + ',' + b]) E(a + 1, b, a + 1, b + 1); });
        svgEl('path', { d, stroke: '#3a4254', 'stroke-width': 2.4, 'stroke-linecap': 'round', fill: 'none' }, g);
      } });
  });
  const board = o.board ? Object.assign({ at: [Math.round((W / cs - o.board.cols) / 2), Math.floor(H / cs) - o.board.rows - 1] }, o.board) : null;
  const cellsOf = (p) => { const v = worldPts(p), out = []; for (let i = 0; i < v.length; i += 4) { const cx = (v[i][0] + v[i + 2][0]) / 2, cy = (v[i][1] + v[i + 2][1]) / 2; out.push([Math.floor(cx / cs), Math.floor(cy / cs)]); } return out; };
  const kind = {
    rotStep: 90,
    snap(p, v) { const bb = bbox(v); return [Math.round(bb[0] / cs) * cs - bb[0], Math.round(bb[1] / cs) * cs - bb[1]]; },
    extra(all) {
      if (!board) return undefined;
      const count = {}; all.forEach((p) => cellsOf(p).forEach(([a, b]) => { const k = a + ',' + b; count[k] = (count[k] || 0) + 1; }));
      let covered = 0, over = 0; for (let a = 0; a < board.cols; a++) for (let b = 0; b < board.rows; b++) { const n = count[(board.at[0] + a) + ',' + (board.at[1] + b)] || 0; if (n) covered++; if (n > 1) over++; }
      return { covered, cells: board.cols * board.rows, filled: covered === board.cols * board.rows && over === 0 };
    }
  };
  const B = pieceBoard(host, Object.assign({ width: W, height: H }, o), defs, kind);
  if (o.grid !== false) { let d = ''; for (let x = 0; x <= W; x += cs) d += `M${x} 0V${H}`; for (let y = 0; y <= H; y += cs) d += `M0 ${y}H${W}`; svgEl('path', { d, stroke: '#e3e5ea', 'stroke-width': 1, fill: 'none' }, B.layers.grid); }
  if (board) svgEl('rect', { x: board.at[0] * cs, y: board.at[1] * cs, width: board.cols * cs, height: board.rows * cs, fill: '#f3efe4', stroke: '#6e4a1c', 'stroke-width': 2.5, 'stroke-dasharray': '8 6' }, B.layers.target);
  B.list.forEach((p) => { const d = kind.snap(p, worldPts(p)); p.st.x += d[0]; p.st.y += d[1]; p.home = { ...p.st }; p.g.setAttribute('transform', `translate(${p.st.x} ${p.st.y})`); });
  B.reset();
  const api = Object.assign(B, { board, cellsOf: (id) => cellsOf(B.pieces[id]) });
  if (o.buttons !== false) addBtns(B.el, [['Start over', () => api.reset()]]);
  return api;
}

/* ================================ Units 6–7: similarity, scale, right triangles ================================ */
/* Shapes for similar / gridDraw are in GRID UNITS, MATH COORDINATES (y up); they are drawn at `unit` px per unit.
 * World pictures (elevation, shadow, mirror) are in metres (y up) and scaled to fit the box. Everything else is px. */
const OPP = RED, ADJ = BLUE, HYP = '#9a6a24';
export const ROLE_COLORS = { opp: OPP, adj: ADJ, hyp: HYP };
export const MATCH_COLORS = [BLUE, RED, GREEN, AMBER, PURPLE, '#0f8ea8', '#b8457a', '#5b6b2e'];
const SKY = '#f2f6fc', GROUND = '#8a6f4d', FILL0 = '#e9edf4', FILL1 = '#fbf1de';
/** a number for a label: rounded to dp places, trailing zeros dropped, real minus sign */
export const fmtLen = (v, dp = 1) => { const f = 10 ** dp, r = Math.round(v * f + (v >= 0 ? 1e-9 : -1e-9)) / f; return String(Object.is(r, -0) ? 0 : r).replace('-', '−'); };
const polyD = (P) => 'M' + pts(P).join('L') + 'Z';
const midPt = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const cenOf = (P) => [P.reduce((s, p) => s + p[0], 0) / P.length, P.reduce((s, p) => s + p[1], 0) / P.length];
const lerp = (a, b, t) => a + (b - a) * t;
const lerpP = (p, q, t) => [lerp(p[0], q[0], t), lerp(p[1], q[1], t)];
/** screen points: counterclockwise on screen (math sense)? */
const ccwScr = (P) => { let s = 0; for (let i = 0; i < P.length; i++) { const p = P[i], q = P[(i + 1) % P.length]; s += p[0] * -q[1] - q[0] * -p[1]; } return s > 0; };
/** the interior wedge of polygon P (screen px) at vertex i: { start, span } (math degrees, counterclockwise sweep) */
function cornerAt(P, i) {
  const n = P.length, V = P[i], dn = dirTo(V, P[(i + 1) % n]), dp = dirTo(V, P[(i + n - 1) % n]);
  return ccwScr(P) ? { start: dn, span: n360(dp - dn) } : { start: dp, span: n360(dn - dp) };
}
/** a label beside segment PQ, on the side away from point C (px); returns the text element */
function sideText(parent, P, Q, C, s, o = {}) {
  const M = midPt(P, Q); let nrm = at([0, 0], dirTo(P, Q) + 90, 1);
  if ((C[0] - M[0]) * nrm[0] + (C[1] - M[1]) * nrm[1] > 0) nrm = [-nrm[0], -nrm[1]];
  if (o.inside) nrm = [-nrm[0], -nrm[1]];
  const size = o.size || 19, hw = String(s).length * size * 0.29 + 3, d = (o.gap ?? 8) + Math.abs(nrm[0]) * hw + Math.abs(nrm[1]) * size * 0.55;
  return popable(text(parent, M[0] + nrm[0] * d, M[1] + nrm[1] * d, s, { size, color: o.color, weight: o.weight }));
}
/** an angle mark (arc, or the square of a right angle) and an optional label inside it */
function angMark(parent, V, start, span, o = {}) {
  const colr = col(o.color, INK), right = o.right ?? Math.abs(span - 90) < 0.6, r = o.r || (span < 30 ? 40 : 28);
  let mk;
  if (right) { const s = o.rs || 15, u = at([0, 0], start, 1), v = at([0, 0], start + 90, 1); mk = path(parent, `M${pts([[V[0] + u[0] * s, V[1] + u[1] * s], [V[0] + (u[0] + v[0]) * s, V[1] + (u[1] + v[1]) * s], [V[0] + v[0] * s, V[1] + v[1] * s]]).join('L')}`, { stroke: colr, width: o.width || 2, cap: 'butt' }); }
  else mk = path(parent, arcD(V, r, start, span), { stroke: colr, width: o.width || 2.4 });
  let lab = null;
  if (o.label != null && o.label !== '' && o.label !== false) {
    const s = String(o.label), size = o.size || 17, hw = s.length * size * 0.3 + 3;
    const lr = o.labelR ?? Math.min(130, Math.max((right ? 15 : r) + size * 0.8, (hw + size * 0.3) / Math.max(0.14, Math.sin(Math.min(span, 180) / 2 * RAD)) + 4));
    const p = at(V, start + span / 2, lr); lab = popable(text(parent, p[0], p[1], s, { size, color: o.labelColor || colr }));
  }
  return { mark: mk, label: lab };
}
/** fit world points (math coords, y up) into W × H with padding pad (number or [top, right, bottom, left]) */
function fitWorld(P, W, H, pad, maxS) {
  const pd = Array.isArray(pad) ? pad : [pad, pad, pad, pad], bb = bbox(P);
  const sw = Math.max(bb[2] - bb[0], 1e-6), sh = Math.max(bb[3] - bb[1], 1e-6);
  const s = Math.min((W - pd[1] - pd[3]) / sw, (H - pd[0] - pd[2]) / sh, maxS || Infinity);
  const ox = pd[3] + (W - pd[1] - pd[3] - sw * s) / 2 - bb[0] * s, oy = pd[0] + (H - pd[0] - pd[2] - sh * s) / 2 + bb[3] * s;
  const F = { s, X: (x) => ox + x * s, Y: (y) => oy - y * s }; F.P = (p) => [F.X(p[0]), F.Y(p[1])]; F.inv = (q) => [(q[0] - ox) / s, (oy - q[1]) / s];
  return F;
}
/** an HTML host gets a wrapper: a fixed-size figure box (with its svg) and a panel under it for readouts / tables / buttons */
function wrapped(host, o, W, H, cls) {
  if (typeof SVGElement !== 'undefined' && host instanceof SVGElement) { const S = surface(host, o, W, H); S.panel = null; S.root = S.el; return S; }
  const wrap = h('div', 'geo-wrap ' + cls + (o.cls ? ' ' + o.cls : ''));
  if (o.x != null || o.y != null || (host && host.classList && host.classList.contains('ex-stage'))) { wrap.style.position = 'absolute'; wrap.style.left = (o.x || 0) + 'px'; wrap.style.top = (o.y || 0) + 'px'; }
  wrap.style.width = W + 'px';
  const S = surface(wrap, {}, W, H);
  S.panel = h('div', 'geo-panel'); wrap.appendChild(S.panel); S.root = wrap; S.el = wrap;
  if (host) host.appendChild(wrap);
  return S;
}
/** the root group of a figure (shifted by x, y when drawn into an existing svg) */
function rootG(S, cls) { const g = grp(S.parent, cls); if (!S.own) g.setAttribute('transform', `translate(${r2(S.ox)} ${r2(S.oy)})`); return g; }
const localPt = (S, e) => { const p = svgPoint(S.svg, e); return S.own ? p : [p[0] - S.ox, p[1] - S.oy]; };
const liveC = () => ({ fast: false, check() {}, anim: (el, kf, ms, oo = {}) => el.animate(kf, { duration: ms, delay: oo.delay || 0, fill: 'both', easing: oo.easing || 'cubic-bezier(.25,.75,.3,1)' }).finished.catch(() => {}), sleep: (ms) => new Promise((r) => setTimeout(r, ms)) });
/** pointer dragging on el: start(p, e) → false to refuse; move(p, p0, e); end(p, e). p = local svg coordinates */
function dragger(S, el, start, move, end) {
  let d = null;
  el.setAttribute('data-tap', ''); el.classList.add('geo-drag');
  el.addEventListener('pointerdown', (e) => {
    if (d || (e.pointerType === 'mouse' && e.button !== 0)) return;
    const p = localPt(S, e); if (start && start(p, e) === false) return;
    e.preventDefault(); e.stopPropagation(); d = { id: e.pointerId, p0: p };
    try { el.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
  });
  el.addEventListener('pointermove', (e) => { if (d && e.pointerId === d.id) move(localPt(S, e), d.p0, e); });
  const up = (e) => { if (d && e.pointerId === d.id) { d = null; if (end) end(localPt(S, e), e); } };
  el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
}
const button = (row, label, fn, pressed) => { const b = h('button', 'pill small', label); b.type = 'button'; b.setAttribute('data-tap', ''); if (pressed != null) b.setAttribute('aria-pressed', String(pressed)); b.onclick = () => fn(b); row.appendChild(b); return b; };
const parseNames = (x, n) => { if (!x) return null; const a = Array.isArray(x) ? x.slice() : String(x).match(/[A-Za-z][′'’″]*/g) || []; return a.slice(0, n); };

/* ---------------- shapes ---------------- */
export const SHAPES = {
  tri: [[0, 0], [4, 0], [1, 3]], right: [[0, 0], [4, 0], [0, 3]], iso: [[0, 0], [4, 0], [2, 3]],
  rect: [[0, 0], [4, 0], [4, 2], [0, 2]], square: [[0, 0], [3, 0], [3, 3], [0, 3]], L: [[0, 0], [3, 0], [3, 1], [1, 1], [1, 3], [0, 3]],
  trap: [[0, 0], [5, 0], [4, 2], [1, 2]], para: [[0, 0], [4, 0], [5, 2], [1, 2]], kite: [[2, 0], [3.5, 2.5], [2, 4], [0.5, 2.5]],
  house: [[0, 0], [4, 0], [4, 2], [2, 4], [0, 2]], pent: [[0, 0], [3, 0], [4, 2], [1.5, 3.5], [-1, 2]],
  arrow: [[0, 1], [3, 1], [3, 0], [5, 2], [3, 4], [3, 3], [0, 3]]
};
const shapeOf = (o) => (o.pts || SHAPES[o.shape] || SHAPES.tri).map((p) => [p[0], p[1]]);
const sideLens = (P) => P.map((p, i) => dist(p, P[(i + 1) % P.length]));

/** Geo.similar(host, { x, y, width 700, height 340, shape 'tri'|'right'|'rect'|'square'|'L'|'trap'|'para'|'kite'|'house'|'pent'
 *  |'arrow' or pts: [[x, y]…] (grid units, y up), k 2, mode 'side' | 'centre' (projection from a point), centre: [x, y] (units),
 *  unit (max px per unit), names: ['ABC', 'DEF'] (matching order), labels true (side lengths) | false | [[…orig], […image]],
 *  units '' (e.g. 'cm', added to auto labels), dp 1, angles false | true (arcs, measures) | 'arcs', matchColors true,
 *  ratios false (show the ratio tags at once), grid false, rays true (centre mode), fill true, size 18 })
 *  → { el, svg, g, k, orig, image (screen px), lens: { orig, image }, ratios: [{ i, orig, image, k, text }], setK(k),
 *      grow(c, ms) (the image grows out of a copy of the original), showRatios(c), hideRatios(), highlight(c, i), clear() } */
export function similar(host, o = {}) {
  const W = o.width || 700, H = o.height || 340, S = wrapped(host, o, W, H, 'geo-sim'), g = rootG(S, 'geo-sim-g');
  const P0 = shapeOf(o), n = P0.length, mode = o.mode === 'centre' || o.mode === 'center' ? 'centre' : 'side', pad = o.pad ?? 46, size = o.size || 18;
  const names = [parseNames(o.names && o.names[0], n), parseNames(o.names && o.names[1], n)];
  const L = { grid: grp(g), rays: grp(g), fill: grp(g), sides: grp(g), marks: grp(g), labs: grp(g), hl: grp(g), tags: grp(g) };
  let k = o.k ?? 2, ratioEls = [], showImg = o.image !== false;
  const api = { el: S.root, svg: S.svg, g, layers: L, P0 };
  function layout(kk) {
    const bb0 = bbox(P0), w0 = bb0[2] - bb0[0], h0 = bb0[3] - bb0[1];
    if (mode === 'side') {
      const lw = o.labels === false ? 0 : Math.max(...sideLens(P0).map((l, i) => String(lab(1, i, l * kk) || '').length)) * size * 0.6, gap = o.gap ?? Math.max(60, 2 * lw + 34), kmax = Math.max(1, kk), sA = (W - 2 * pad - gap) / (w0 * (1 + kk)), sB = (H - 2 * pad) / (h0 * kmax);
      const u = Math.min(o.unit || 60, sA, sB), tot = w0 * u * (1 + kk) + gap, x0 = (W - tot) / 2, base = (H + h0 * kmax * u) / 2;
      const scr = (p, s, X) => [X + (p[0] - bb0[0]) * u * s, base - (p[1] - bb0[1]) * u * s];
      return { u, from: (s, t) => P0.map((p) => scr(p, s, lerp(x0, x0 + w0 * u + gap, t))), orig: P0.map((p) => scr(p, 1, x0)) };
    }
    const f = Math.min(3.2, 1.5 / Math.max(0.25, Math.abs(kk - 1))), O = o.centre || o.center || [bb0[0] - w0 * f, bb0[1] - h0 * 0.35 * f], img = P0.map((p) => [O[0] + kk * (p[0] - O[0]), O[1] + kk * (p[1] - O[1])]);
    const F = fitWorld([O].concat(P0, img), W, H, pad, o.unit || 60), sc = (s) => P0.map((p) => F.P([O[0] + s * (p[0] - O[0]), O[1] + s * (p[1] - O[1])]));
    return { u: F.s, O: F.P(O), from: (s) => sc(s), orig: sc(1) };
  }
  let LY = null;
  const colOf = (i) => (o.matchColors === false ? INK : MATCH_COLORS[i % MATCH_COLORS.length]);
  const lab = (which, i, len) => {
    if (o.labels === false) return null;
    if (Array.isArray(o.labels)) { const v = (o.labels[which] || [])[i]; return v == null || v === '' ? null : String(v); }
    return fmtLen(len, o.dp ?? 1) + (o.units ? ' ' + o.units : '');
  };
  function drawPoly(Pp, which, showLabels) {
    const lens = sideLens(P0).map((l) => l * (which ? k : 1));
    if (o.fill !== false) path(L.fill, polyD(Pp), { stroke: 'none', fill: which ? FILL1 : FILL0, cls: '' });
    const els = { sides: [], labels: [], marks: [], names: [] };
    Pp.forEach((p, i) => { els.sides.push(path(L.sides, `M${pts([p, Pp[(i + 1) % n]]).join('L')}`, { stroke: colOf(i), width: 3.4 })); });
    const shortest = Math.min(...Pp.map((p, i) => dist(p, Pp[(i + 1) % n])));
    if (o.angles) Pp.forEach((p, i) => { const cn = cornerAt(Pp, i); els.marks.push(angMark(L.marks, p, cn.start, cn.span, { color: colOf(i + 3), r: Math.max(10, Math.min(22, shortest * 0.28)), rs: Math.max(7, Math.min(13, shortest * 0.18)), label: o.angles === true ? (shortest >= 80 ? fmtDeg(cn.span) + '°' : null) : Array.isArray(o.angles) ? (o.angles[which] || [])[i] : null, size: 15 })); });
    const ccw = ccwScr(Pp);   // a point just inside each side decides "outside" (right for concave shapes too)
    if (showLabels) Pp.forEach((p, i) => { const s = lab(which, i, lens[i]); if (s) els.labels.push(sideText(L.labs, p, Pp[(i + 1) % n], at(midPt(p, Pp[(i + 1) % n]), dirTo(p, Pp[(i + 1) % n]) + (ccw ? 90 : -90), 10), s, { color: colOf(i), size })); });
    const nm = names[which];
    if (nm) Pp.forEach((p, i) => { if (!nm[i]) return; const cn = cornerAt(Pp, i), q = at(p, cn.start + cn.span / 2 + 180, size * 0.95); els.names.push(text(L.labs, q[0], q[1], nm[i], { size: size + 1 })); });
    return els;
  }
  function render(t = 1, showLabels = true) {
    Object.values(L).forEach((l) => { if (l !== L.tags && l !== L.hl) l.innerHTML = ''; });
    LY = layout(k);
    if (o.grid) { const u = LY.u, d = []; for (let x = 0; x <= W; x += u) d.push(`M${r2(x)} 0V${H}`); for (let y = H; y >= 0; y -= u) d.push(`M0 ${r2(y)}H${W}`); path(L.grid, d.join(''), { stroke: '#e3e6ec', width: 1, cls: '' }); }
    const img = LY.from(1 + (k - 1) * t, t);
    if (mode === 'centre' && o.rays !== false) {
      dot(L.rays, LY.O, { r: 5, color: SLATE }); if (o.centreName !== false) text(L.rays, LY.O[0] - 14, LY.O[1] + 14, o.centreName || 'O', { size: size, color: SLATE });
      const fin = LY.from(k); fin.forEach((q, i) => { const far = dist(LY.O, q) > dist(LY.O, LY.orig[i]) ? q : LY.orig[i]; path(L.rays, `M${pts([LY.O, far]).join('L')}`, { stroke: LIGHT, width: 1.6, dash: '6 5', cls: '' }); });
    }
    api.origEls = drawPoly(LY.orig, 0, true);
    api.imageEls = showImg ? drawPoly(img, 1, showLabels && t >= 1) : { sides: [], labels: [], marks: [], names: [] };
    api.orig = LY.orig; api.image = img;
  }
  function ratios() { const a = sideLens(P0); return a.map((l, i) => { const nmd = names[0] && names[1], on = nmd ? names[0][i] + names[0][(i + 1) % n] : '', nn = nmd ? names[1][i] + names[1][(i + 1) % n] : ''; return { i, orig: l, image: l * k, k, text: `${nmd ? `${nn} ÷ ${on} = ` : ''}${fmtLen(l * k)} ÷ ${fmtLen(l)} = ${fmtLen(k, 2)}`, color: colOf(i) }; }); }
  api.ratios = ratios();
  api.lens = { orig: sideLens(P0), image: sideLens(P0).map((l) => l * k) };
  api.setK = (kk) => { k = kk; api.k = k; api.ratios = ratios(); api.lens.image = api.lens.orig.map((l) => l * k); api.hideRatios(); render(1); };
  api.grow = async (c, ms = 1400) => { showImg = true; api.hideRatios(); render(0, false); await tween(c, ms, (t) => render(t, false)); render(1); if (c && !c.fast) await Promise.all(api.imageEls.labels.map((e) => pop(c, e, 320))); };
  api.showImage = (on = true) => { showImg = on; render(1); };
  api.showRatios = async (c) => {
    api.hideRatios();
    for (const r of api.ratios) {
      let el;
      if (S.panel) { el = h('span', 'geo-chip', r.text); el.style.setProperty('--c', r.color); S.panel.appendChild(el); }
      else el = popable(text(L.tags, 12, H + 8 + ratioEls.length * 24, r.text, { size: 17, color: r.color, anchor: 'start' }));
      ratioEls.push(el); if (c && !c.fast) await pop(c, el, 300);
    }
  };
  api.hideRatios = () => { ratioEls.forEach((e) => e.remove()); ratioEls = []; };
  api.highlight = async (c, i) => {
    const els = [api.orig, api.image].map((Pp) => popable(path(L.hl, `M${pts([Pp[i], Pp[(i + 1) % n]]).join('L')}`, { stroke: colOf(i), width: 12, opacity: 0.3 })));
    await Promise.all(els.map((e) => drawIn(e, 500, c))); return els;
  };
  api.clear = () => { L.hl.innerHTML = ''; };
  api.k = k; render(1);
  if (o.ratios) api.showRatios(null);
  return api;
}

/* ---------------- grid drawing ---------------- */
/** compare a drawn polygon S with the original P (both grid units): → { ok, code, msg, k, bad: [edge indexes], best } */
export function similarOnGrid(Sp, P, k) {
  const n = P.length, m = Sp.length, E = (A, i) => [A[(i + 1) % A.length][0] - A[i][0], A[(i + 1) % A.length][1] - A[i][1]];
  if (m !== n) return { ok: false, code: 'grid-count', msg: `The original has <b>${n}</b> corners; your drawing has <b>${m}</b>.`, bad: [] };
  const aligns = [];
  for (let s = 0; s < n; s++) for (const dir of [1, -1]) {   // the original's vertex order, started at s, either way round
    const Q = []; for (let i = 0; i < n; i++) Q.push(P[((s + dir * i) % n + n) % n]);
    aligns.push(Q);
  }
  let best = null;
  const cross = (u, v) => u[0] * v[1] - u[1] * v[0], dot2 = (u, v) => u[0] * v[0] + u[1] * v[1];
  aligns.forEach((Q) => {
    // a common factor kk with every drawn edge = kk × the original edge (same direction)
    const ks = [];
    let par = true;
    for (let i = 0; i < n; i++) { const es = E(Sp, i), eo = E(Q, i); if (Math.abs(cross(es, eo)) > 1e-6 || dot2(es, eo) <= 0) { par = false; break; } ks.push(Math.hypot(es[0], es[1]) / Math.hypot(eo[0], eo[1])); }
    const kk = par && ks.every((x) => Math.abs(x - ks[0]) < 1e-6) ? ks[0] : null;
    const good = []; for (let i = 0; i < n; i++) { const es = E(Sp, i), eo = E(Q, i); if (k != null && Math.abs(es[0] - k * eo[0]) < 1e-6 && Math.abs(es[1] - k * eo[1]) < 1e-6) good.push(i); }
    const add = (() => { if (!par) return null; const d = []; for (let i = 0; i < n; i++) { const es = E(Sp, i), eo = E(Q, i); d.push(Math.hypot(es[0], es[1]) - Math.hypot(eo[0], eo[1])); } return d.every((x) => Math.abs(x - d[0]) < 1e-6) && Math.abs(d[0]) > 1e-6 ? d[0] : null; })();
    const score = (kk != null ? 1000 : 0) + good.length;
    if (!best || score > best.score) best = { Q, kk, good, add, score };
  });
  const bad = []; for (let i = 0; i < n; i++) if (best.good.indexOf(i) < 0) bad.push(i);
  const kt = (v) => fmtLen(v, 2);
  if (best.kk != null && (k == null || Math.abs(best.kk - k) < 1e-6)) return { ok: true, code: 'ok', k: best.kk, msg: k == null ? `Similar! Every side is <b>${kt(best.kk)}</b> times as long: k = ${kt(best.kk)}.` : `Yes! Every side is <b>${kt(k)}</b> times as long and the angles match.`, bad: [] };
  if (best.kk != null && k != null && Math.abs(best.kk * k - 1) < 1e-6) return { ok: false, code: 'grid-flip', k: best.kk, msg: `Your shape is similar, but with k = ${kt(best.kk)}. You divided by ${kt(1 / best.kk)}; <b>multiply</b> every length by ${kt(k)}.`, bad };
  if (best.kk != null) return { ok: false, code: 'grid-wrong-k', k: best.kk, msg: `Your shape is similar with k = <b>${kt(best.kk)}</b>. You need k = <b>${kt(k)}</b>: multiply every length by ${kt(k)}.`, bad };
  if (best.add != null) return { ok: false, code: 'grid-added', msg: `You <b>added</b> ${kt(Math.abs(best.add))} to each side. A scale factor <b>multiplies</b>: every side × ${k == null ? 'k' : kt(k)}.`, bad };
  return { ok: false, code: 'grid-shape', msg: k == null ? 'Not similar yet: each side must be the same number of times as long as the matching side, and the angles must match.' : `${best.good.length} of ${n} sides are right. Each side must be ${kt(k)} × the matching side, in the same direction (red sides are off).`, bad };
}
/** Geo.gridDraw(host, { x, y, cols 20, rows 12, cell 32, shape | pts (grid units, y up, whole numbers), at: [col, row]
 *  (where the shape's lower-left corner sits; default 1, 1), k 2 (null = any enlargement or reduction is fine; the check
 *  reports k), imageAt: [col, row] (where Show me draws the image; default right of the original), names, buttons true,
 *  onCheck(result), onChange(points) })
 *  Tap grid points to draw the image: each tap adds a corner; tap the first corner to close; tap the last one to undo.
 *  → { el, svg, points(), closed, set(pts, closed), check() → { ok, code, msg, k, bad }, undo(), clear(), show(c), target } */
export function gridDraw(host, o = {}) {
  const cols = o.cols || 20, rows = o.rows || 12, cs = o.cell || 32, m = o.margin ?? 14, W = cols * cs + 2 * m, H = rows * cs + 2 * m;
  const S = wrapped(host, o, W, H, 'geo-gd'), g = rootG(S, 'geo-gd-g');
  const P = shapeOf(o), bb = bbox(P), at0 = o.at || [1, 1], k = o.k === undefined ? 2 : o.k;
  const orig = P.map((p) => [p[0] - bb[0] + at0[0], p[1] - bb[1] + at0[1]]);
  const toS = (q) => [m + q[0] * cs, m + (rows - q[1]) * cs];
  const L = { bg: grp(g), grid: grp(g), orig: grp(g), show: grp(g), mine: grp(g), top: grp(g) };
  const bgRect = svgEl('rect', { x: 0, y: 0, width: W, height: H, fill: '#fff', rx: 10 }, L.bg);
  let d = ''; for (let i = 0; i <= cols; i++) d += `M${m + i * cs} ${m}V${H - m}`; for (let j = 0; j <= rows; j++) d += `M${m} ${m + j * cs}H${W - m}`;
  path(L.grid, d, { stroke: '#d9dde5', width: 1, cls: '' });
  for (let i = 0; i <= cols; i++) for (let j = 0; j <= rows; j++) svgEl('circle', { cx: m + i * cs, cy: m + j * cs, r: 1.8, fill: '#b5bbc7' }, L.grid);
  const oS = orig.map(toS);
  path(L.orig, polyD(oS), { stroke: INK, width: 3, fill: FILL0, cls: '' });
  const nm = parseNames(o.names && o.names[0], P.length);
  if (nm) oS.forEach((p, i) => { const cn = cornerAt(oS, i), q = at(p, cn.start + cn.span / 2 + 180, 15); text(L.orig, q[0], q[1], nm[i], { size: 17 }); });
  const ow = bb[2] - bb[0], img0 = o.imageAt || [Math.min(cols - ow * (k || 1), at0[0] + ow + 2), at0[1]];
  const target = k == null ? null : P.map((p) => [(p[0] - bb[0]) * k + img0[0], (p[1] - bb[1]) * k + img0[1]]);
  let mine = [], closed = false, last = null;
  const fb = S.panel ? h('div', 'geo-gd-msg') : null;
  function draw() {
    L.mine.innerHTML = '';
    const sp = mine.map(toS);
    if (sp.length > 1) path(L.mine, (closed ? polyD(sp) : 'M' + pts(sp).join('L')), { stroke: BLUE, width: 3.4, fill: closed ? '#dbe7fb' : 'none', fillOpacity: 0.6, cls: '' });
    if (last && last.bad) last.bad.forEach((i) => { if (i < sp.length - (closed ? 0 : 1)) path(L.mine, `M${pts([sp[i], sp[(i + 1) % sp.length]]).join('L')}`, { stroke: RED, width: 5, cls: '' }); });
    sp.forEach((p, i) => { svgEl('circle', { cx: r2(p[0]), cy: r2(p[1]), r: i === 0 ? 7.5 : 5.5, fill: i === 0 ? '#fff' : BLUE, stroke: BLUE, 'stroke-width': 2.5 }, L.mine); });
    if (o.onChange) o.onChange(mine.slice());
  }
  function msg(s, okk) { if (fb) { fb.innerHTML = s || ''; fb.className = 'geo-gd-msg' + (okk === true ? ' geo-ok' : okk === false ? ' geo-no' : ''); } }
  function tap(q) {
    last = null;
    const i = mine.findIndex((p) => p[0] === q[0] && p[1] === q[1]);
    if (closed) { msg('Your shape is closed. Press <b>Check</b>, or <b>Undo</b> to change it.'); return; }
    if (i === 0 && mine.length >= 3) { closed = true; msg('Closed. Press <b>Check</b>.'); }
    else if (i === mine.length - 1 && i >= 0) mine.pop();
    else if (i < 0) mine.push(q);
    draw();
  }
  const hit = svgEl('rect', { x: 0, y: 0, width: W, height: H, fill: 'transparent' }, L.top);
  let downAt = null;
  dragger(S, hit, (p) => { downAt = p; }, () => {}, (p) => {
    if (!downAt || dist(p, downAt) > 12) return;
    const q = [Math.round((p[0] - m) / cs), rows - Math.round((p[1] - m) / cs)];
    if (q[0] < 0 || q[1] < 0 || q[0] > cols || q[1] > rows || dist(toS(q), p) > cs * 0.48) return;
    tap(q);
  });
  hit.classList.remove('geo-drag'); hit.style.cursor = 'crosshair'; hit.style.touchAction = 'none';
  const api = {
    el: S.root, svg: S.svg, g, layers: L, orig, target, toScreen: toS, feedback: fb,
    points: () => mine.map((p) => p.slice()), get closed() { return closed; },
    set(pp, cl = true) { mine = pp.map((p) => [p[0], p[1]]); closed = !!cl && mine.length >= 3; last = null; draw(); },
    undo() { last = null; if (closed) closed = false; else mine.pop(); msg(''); draw(); },
    clear() { mine = []; closed = false; last = null; L.show.innerHTML = ''; msg(''); draw(); },
    check() {
      let res;
      if (mine.length < 3) res = { ok: false, code: 'grid-empty', msg: 'Tap grid points to draw the corners of your image.', bad: [] };
      else if (!closed) { const r = similarOnGrid(mine, P, k); res = r.ok ? { ok: false, code: 'grid-open', msg: 'Nearly: tap your <b>first</b> corner to close the shape.', bad: [] } : r; }
      else res = similarOnGrid(mine, P, k);
      last = res; draw(); msg(res.msg, res.ok); if (o.onCheck) o.onCheck(res); return res;
    },
    async show(c) {
      L.show.innerHTML = ''; if (!target) return null;
      const T = target;
      const el = path(L.show, polyD(T.map(toS)), { stroke: GREEN, width: 3, dash: '9 6', fill: GREEN, fillOpacity: 0.08, cls: '' });
      await drawIn(el, 900, c); return el;
    }
  };
  if (S.panel) {
    const row = h('div', 'geo-btns'); S.panel.appendChild(row); S.panel.appendChild(fb);
    if (o.buttons !== false) { button(row, 'Check', () => api.check()); button(row, 'Undo', () => api.undo()); button(row, 'Clear', () => api.clear()); if (target) button(row, 'Show me', () => api.show(liveC())); }
    msg(o.prompt || `Tap grid points to draw the image${k == null ? '' : ` with scale factor <b>k = ${fmtLen(k, 2)}</b>`}. Tap the first corner to close it.`);
  }
  void bgRect; draw();
  return api;
}

/* ---------------- scale: bar scale, map tape ---------------- */
const UNIT_CM = { mm: 0.1, cm: 1, m: 100, km: 100000 };
/** '1 cm : 2 m', '1 cm represents 2 m', '1 cm = 2 m', '1 : 200', '1:50 000', { draw, real, units } or { draw, drawUnit,
 *  real, realUnit } → { draw, drawUnit, real, realUnit, ratio (real ÷ drawing in the same units), text } */
export function parseScale(sc) {
  let r;
  if (sc && typeof sc === 'object') r = { draw: sc.draw ?? 1, drawUnit: sc.drawUnit || 'cm', real: sc.real, realUnit: sc.realUnit || sc.units || 'm' };
  else {
    const s = String(sc || '1 cm : 1 m').replace(/(\d)[\s,](?=\d{3}\b)/g, '$1').trim();
    let mm = /^([\d.]+)\s*(mm|cm|m|km)\s*(?::|=|represents|to|→)\s*([\d.]+)\s*(mm|cm|m|km)$/i.exec(s);
    if (mm) r = { draw: +mm[1], drawUnit: mm[2].toLowerCase(), real: +mm[3], realUnit: mm[4].toLowerCase() };
    else if ((mm = /^([\d.]+)\s*:\s*([\d.]+)$/.exec(s))) {
      const ratio = +mm[2] / +mm[1], ru = ratio >= 100000 ? 'km' : ratio >= 100 ? 'm' : 'cm';
      r = { draw: 1, drawUnit: 'cm', real: ratio / UNIT_CM[ru], realUnit: ru, pure: true };
    } else throw new Error('Geo.parseScale: cannot read ' + s);
  }
  r.ratio = (r.real * UNIT_CM[r.realUnit]) / (r.draw * UNIT_CM[r.drawUnit]);
  r.perCm = r.real / (r.draw * UNIT_CM[r.drawUnit]);   // real units per drawing cm
  r.text = r.pure ? `1 : ${fmtLen(r.ratio, 3).replace(/\B(?=(\d{3})+(?!\d))/g, '\u2009')}` : `${fmtLen(r.draw, 3)} ${r.drawUnit} represents ${fmtLen(r.real, 3)} ${r.realUnit}`;
  r.toReal = (cm) => cm * r.perCm; r.toDraw = (real) => real / r.perCm;
  return r;
}
/** Geo.scaleBar(host, { x, y, scale '1 cm : 2 m' | {…}, segments 4, cmPx 40 (screen px per drawing cm), title true, size 15 })
 *  An alternating black/white bar scale, one segment per drawing unit. → { el, svg, g, scale (parseScale), width, height } */
export function scaleBar(host, o = {}) {
  const sc = parseScale(o.scale), cmPx = o.cmPx || 40, seg = sc.draw * UNIT_CM[sc.drawUnit] * cmPx, nseg = o.segments || 4, size = o.size || 15;
  const W = o.width || Math.ceil(seg * nseg + 60), Hh = o.height || 64, S = surface(host, o, W, Hh), g = rootG(S, 'geo-sbar');
  const x0 = 18, y0 = o.title === false ? 12 : 30;
  if (o.title !== false) text(g, x0, 12, sc.text, { size, anchor: 'start', color: SLATE });
  for (let i = 0; i < nseg; i++) svgEl('rect', { x: r2(x0 + i * seg), y: y0, width: r2(seg), height: 9, fill: i % 2 ? '#fff' : INK, stroke: INK, 'stroke-width': 1.3 }, g);
  for (let i = 0; i <= nseg; i++) text(g, x0 + i * seg, y0 + 22, i === nseg ? `${fmtLen(i * sc.real, 2)} ${sc.realUnit}` : fmtLen(i * sc.real, 2), { size: size - 1, weight: 600, anchor: i === nseg ? 'start' : 'middle', halo: false });
  return { el: S.own ? S.el : g, svg: S.svg, g, scale: sc, width: W, height: Hh };
}
/** Geo.mapTape(host, { x, y, width 660, height 400, scale '1 cm : 2 m', cmPx 40, a: [x, y], b: [x, y] (px), places:
 *  [{ name, at: [x, y] }], snap true (ends snap to places), map: (g, W, H) => … (draw your own map underneath), grid true
 *  (1 cm squares), bar true, dp 1 (the drawing length is read to the nearest 0.1 cm), readout true, onChange(r) })
 *  Drag the two round ends; the tape shows cm ticks and the readout gives the drawing length and the real length.
 *  → { el, svg, set(a, b), reading() → { cm, real, unit, text }, moveTo(c, a, b, ms), scale } */
export function mapTape(host, o = {}) {
  const W = o.width || 660, H = o.height || 400, cmPx = o.cmPx || 40, sc = parseScale(o.scale), dp = o.dp ?? 1;
  const S = wrapped(host, o, W, H, 'geo-tape'), g = rootG(S, 'geo-tape-g');
  const L = { map: grp(g), places: grp(g), tape: grp(g), ends: grp(g) };
  svgEl('rect', { x: 0, y: 0, width: W, height: H, rx: 12, fill: '#f6f3ea', stroke: '#d8d2c2', 'stroke-width': 1.5 }, L.map);
  if (o.grid !== false) { let d = ''; for (let x = cmPx; x < W; x += cmPx) d += `M${x} 0V${H}`; for (let y = cmPx; y < H; y += cmPx) d += `M0 ${y}H${W}`; path(L.map, d, { stroke: '#e3dccb', width: 1, cls: '' }); }
  if (o.map) o.map(L.map, W, H);
  (o.places || []).forEach((p) => { dot(L.places, p.at, { r: 6, color: p.color || RED }); text(L.places, p.at[0] + (p.dx ?? 0), p.at[1] + (p.dy ?? -27), p.name, { size: 16 }); });
  if (o.bar !== false) { const bar = scaleBar(L.places, { scale: o.scale, cmPx, segments: o.segments || 3 }); bar.g.setAttribute('transform', `translate(${W - bar.width - 6} ${H - 60})`); }
  const st = { a: (o.a || [W * 0.25, H * 0.55]).slice(), b: (o.b || [W * 0.62, H * 0.4]).slice() };
  const band = path(L.tape, '', { stroke: '#f2c94c', width: 22, opacity: 0.9, cap: 'butt', cls: '' }), ticks = path(L.tape, '', { stroke: '#6b5310', width: 1.3, cls: '', cap: 'butt' }), nums = grp(L.tape);
  L.tape.style.pointerEvents = 'none';
  const end = (key) => { const e = grp(L.ends, 'geo-tape-end'); svgEl('circle', { r: 15, fill: '#fff', stroke: '#8d6c0f', 'stroke-width': 3 }, e); svgEl('circle', { r: 3.5, fill: '#8d6c0f' }, e); e.key = key; return e; };
  const ends = { a: end('a'), b: end('b') };
  const read = S.panel && o.readout !== false ? h('div', 'geo-readout') : null; if (read) S.panel.appendChild(read);
  function reading() {
    const cm = Math.round(dist(st.a, st.b) / cmPx * 10 ** dp) / 10 ** dp, real = sc.toReal(cm), unit = sc.realUnit;
    const km = unit === 'm' && real >= 1000 ? ` (= ${fmtLen(real / 1000, 3)} km)` : '';
    return { cm, real, unit, text: `Drawing: <b>${fmtLen(cm, dp)} cm</b> → real: ${fmtLen(cm, dp)} × ${fmtLen(sc.perCm, 3)} ${unit} = <b class="geo-big">${fmtLen(real, 3)} ${unit}</b>${km}` };
  }
  function render() {
    const { a, b } = st, len = dist(a, b), th = dirTo(a, b), u = at([0, 0], th, 1), nrm = at([0, 0], th + 90, 1);
    band.setAttribute('d', `M${pts([a, b]).join('L')}`);
    let d = ''; nums.innerHTML = '';
    for (let i = 0; i * cmPx / 2 <= len + 0.01; i++) { const p = [a[0] + u[0] * i * cmPx / 2, a[1] + u[1] * i * cmPx / 2], L2 = i % 2 ? 5 : 10; d += `M${pts([[p[0] + nrm[0] * 11, p[1] + nrm[1] * 11], [p[0] + nrm[0] * (11 - L2), p[1] + nrm[1] * (11 - L2)]]).join('L')}`; if (i % 2 === 0 && i > 0 && i * cmPx / 2 < len - 12) { const tq = [p[0] - nrm[0] * 3, p[1] - nrm[1] * 3]; const tt = text(nums, tq[0], tq[1], String(i / 2), { size: 10.5, halo: false, color: '#5a4508' }); tt.setAttribute('transform', `rotate(${r2(-((th + 90) % 180 - 90))} ${r2(tq[0])} ${r2(tq[1])})`); } }
    ticks.setAttribute('d', d);
    ends.a.setAttribute('transform', `translate(${r2(a[0])} ${r2(a[1])})`); ends.b.setAttribute('transform', `translate(${r2(b[0])} ${r2(b[1])})`);
    const r = reading(); if (read) read.innerHTML = r.text; if (o.onChange) o.onChange(r);
  }
  ['a', 'b'].forEach((key) => {
    let s0 = null;
    dragger(S, ends[key], () => { s0 = st[key].slice(); }, (p, p0) => {
      let q = [Math.max(4, Math.min(W - 4, s0[0] + p[0] - p0[0])), Math.max(4, Math.min(H - 4, s0[1] + p[1] - p0[1]))];
      if (o.snap !== false) (o.places || []).forEach((pl) => { if (dist(q, pl.at) < 16) q = pl.at.slice(); });
      st[key] = q; render();
    });
  });
  render();
  return { el: S.root, svg: S.svg, g, scale: sc, reading, state: st, set(a, b) { if (a) st.a = a.slice(); if (b) st.b = b.slice(); render(); },
    async moveTo(c, a, b, ms = 900) { const a0 = st.a.slice(), b0 = st.b.slice(); await tween(c, ms, (t) => { if (a) st.a = lerpP(a0, a, t); if (b) st.b = lerpP(b0, b, t); render(); }); } };
}

/* ---------------- right triangles ---------------- */
/** the three sides of right triangle ABC (right angle at C) from any two of a, b, c (numbers) */
export function rightSides(o) {
  let { a, b, c } = o;
  if (a != null && b != null) c = Math.hypot(a, b); else if (a != null && c != null) b = Math.sqrt(Math.max(0, c * c - a * a)); else if (b != null && c != null) a = Math.sqrt(Math.max(0, c * c - b * b));
  else if (o.A != null && (a ?? b ?? c) != null) { const t = o.A * RAD; if (a != null) { b = a / Math.tan(t); c = a / Math.sin(t); } else if (b != null) { a = b * Math.tan(t); c = b / Math.cos(t); } else { a = c * Math.sin(t); b = c * Math.cos(t); } }
  else { a = a ?? 3; b = b ?? 4; c = Math.hypot(a, b); }
  return { a, b, c, A: Math.atan2(a, b) / RAD, B: Math.atan2(b, a) / RAD };
}
/** which side is opp / adj / hyp for the angle at A or B */
export const rolesFor = (theta) => (theta === 'B' ? { opp: 'b', adj: 'a', hyp: 'c' } : { opp: 'a', adj: 'b', hyp: 'c' });
/** the triangle's vertices in px: { A, B, C } fitted in W × H (with room for squares on the sides when squares is on) */
function triLayout(o, W, H, sd) {
  const R = o.right || 'br', sx = R[1] === 'l' ? 1 : -1, sy = R[0] === 'b' ? 1 : -1;
  let V = { C: [0, 0], A: [sx * sd.b, 0], B: [0, sy * sd.a] };
  const rot = o.rot || 0, cr = Math.cos(rot * RAD), sr = Math.sin(rot * RAD);
  Object.keys(V).forEach((key) => { let [x, y] = V[key]; if (o.flip) x = -x; V[key] = [x * cr - y * sr, x * sr + y * cr]; });
  const all = [V.A, V.B, V.C];
  if (o.squares) [['B', 'C', 'A'], ['A', 'C', 'B'], ['A', 'B', 'C']].forEach(([p, q, r]) => sqPts(V[p], V[q], V[r], true).forEach((z) => all.push(z)));
  const F = fitWorld(all, W, H, o.pad ?? 54, o.unit);
  return { F, A: F.P(V.A), B: F.P(V.B), C: F.P(V.C) };
}
/** the square on side PQ, outward (away from R); world or px points alike */
function sqPts(P, Q, R) {
  const d = [Q[0] - P[0], Q[1] - P[1]]; let nrm = [-d[1], d[0]];
  const M = midPt(P, Q); if ((R[0] - M[0]) * nrm[0] + (R[1] - M[1]) * nrm[1] > 0) nrm = [d[1], -d[0]];
  return [P, Q, [Q[0] + nrm[0], Q[1] + nrm[1]], [P[0] + nrm[0], P[1] + nrm[1]]];
}
/** Geo.rightTri(host, { x, y, width 520, height 360, a, b, c (any two; c = hypotenuse), right 'br'|'bl'|'tr'|'tl' (where the
 *  right angle C is), rot 0 (degrees), flip false, names ['A','B','C'] | false, sides: { a: '3 cm', c: '?' } | true (lengths),
 *  units '', theta: 'A'|'B'|null, thetaLabel 'θ' (or '35°'), angles: { A: '35°', B: 'x' }, show ['opp','adj','hyp'] (role tags,
 *  inside the triangle; [] = none), labels: { opp, adj, hyp } (tag text, default 'opp' 'adj' 'hyp'; long: true → words),
 *  colors true (colour the sides by role), squares false | true | 'grid' (squares on the sides; 'grid' = unit squares),
 *  squareLabels true, size 19 })
 *  → { el, svg, g, V: { A, B, C }, sides: { a, b, c } (numbers), roles(), side(k) → path, setTheta(c, 'A'|'B', ms),
 *      highlight(c, role|side), clearHighlight(), showSquares(c, on), tags } */
export function rightTri(host, o = {}) {
  const W = o.width || 520, H = o.height || 360, S = surface(host, o, W, H), g = rootG(S, 'geo-rt');
  const sd = rightSides(o), size = o.size || 19, nm = o.names === false ? null : (o.names || ['A', 'B', 'C']);
  const LY = triLayout(Object.assign({}, o, { squares: o.squares || o.roomForSquares }), W, H, sd), V = { A: LY.A, B: LY.B, C: LY.C }, C0 = cenOf([V.A, V.B, V.C]);
  const L = { sq: grp(g), fill: grp(g), hl: grp(g), sides: grp(g), marks: grp(g), labs: grp(g), tags: grp(g) };
  const ends = { a: ['B', 'C'], b: ['A', 'C'], c: ['A', 'B'] }, opp = { a: 'A', b: 'B', c: 'C' };
  let theta = o.theta || null;
  const tagText = Object.assign(o.long ? { opp: 'opposite', adj: 'adjacent', hyp: 'hypotenuse' } : { opp: 'opp', adj: 'adj', hyp: 'hyp' }, o.labels || {});
  const show = o.show || ['opp', 'adj', 'hyp'];
  path(L.fill, polyD([V.A, V.B, V.C]), { stroke: 'none', fill: o.fill || '#f3efe6', cls: '' });
  const sides = {};
  ['a', 'b', 'c'].forEach((s) => { sides[s] = path(L.sides, `M${pts([V[ends[s][0]], V[ends[s][1]]]).join('L')}`, { stroke: INK, width: 3.4 }); });
  { const dA = dirTo(V.C, V.A), dB = dirTo(V.C, V.B); angMark(L.marks, V.C, n360(dB - dA) < 180 ? dA : dB, 90, { right: true, rs: 17, color: INK }); }
  if (nm) ['A', 'B', 'C'].forEach((v, i) => { if (!nm[i]) return; const P = V[v], u = at([0, 0], dirTo(C0, P), 1); text(L.labs, P[0] + u[0] * 20, P[1] + u[1] * 20, nm[i], { size: size + 2 }); });
  const lenLab = (s) => { const want = o.sides === true ? true : (o.sides || {})[s]; if (want == null || want === false) return null; return want === true ? fmtLen(sd[s], o.dp ?? 1) + (o.units ? ' ' + o.units : '') : String(want); };
  const valLabs = {};
  const inward = !!(o.squares || o.roomForSquares), valTxt = {};
  ['a', 'b', 'c'].forEach((s) => { const t = lenLab(s); if (t) { valTxt[s] = t; valLabs[s] = sideText(L.labs, V[ends[s][0]], V[ends[s][1]], C0, t, { size, color: t === '?' || /^[a-z]$/i.test(t) ? RED : INK, gap: inward ? 6 : 9 }); } });
  const angLabs = {};
  const markAngle = (v, label, colr) => { const others = ['A', 'B', 'C'].filter((x) => x !== v), d1 = dirTo(V[v], V[others[0]]), d2 = dirTo(V[v], V[others[1]]); let st = d1, sp = n360(d2 - d1); if (sp > 180) { st = d2; sp = 360 - sp; } return angMark(L.marks, V[v], st, sp, { color: colr || AMBER, r: o.arcR || 34, label, size, labelColor: colr || AMBER }); };
  Object.keys(o.angles || {}).forEach((v) => { if (v !== theta) angLabs[v] = markAngle(v, o.angles[v]); });
  let thetaMk = null;
  const tags = {};
  const ext = (n, str, sz) => Math.abs(n[0]) * (String(str).length * sz * 0.29 + 3) + Math.abs(n[1]) * sz * 0.55;
  function tagPos(role, th) {   // outside the side (inside when there are squares), beyond its length label
    const s = rolesFor(th)[role], [p, q] = ends[s], M = midPt(V[p], V[q]); let nrm = at([0, 0], dirTo(V[p], V[q]) + 90, 1);
    if (((C0[0] - M[0]) * nrm[0] + (C0[1] - M[1]) * nrm[1] > 0) !== inward) nrm = [-nrm[0], -nrm[1]];
    const base = valTxt[s] && !inward ? 9 + 2 * ext(nrm, valTxt[s], size) + 6 : 9, dd = base + ext(nrm, tagText[role], 16);
    return [M[0] + nrm[0] * dd, M[1] + nrm[1] * dd];
  }
  function colorSides(th) {
    ['a', 'b', 'c'].forEach((s) => sides[s].setAttribute('stroke', INK));
    if (!th || o.colors === false) return;
    const R = rolesFor(th); ['opp', 'adj', 'hyp'].forEach((role) => { if (show.indexOf(role) >= 0) sides[R[role]].setAttribute('stroke', ROLE_COLORS[role]); });
  }
  function placeTags(th) {
    L.tags.innerHTML = '';
    if (!th) return;
    show.forEach((role) => { const p = tagPos(role, th); tags[role] = popable(text(L.tags, p[0], p[1], tagText[role], { size: 16, color: ROLE_COLORS[role], weight: 800 })); });
  }
  function setThetaNow(th) {
    theta = th; if (thetaMk) { thetaMk.mark.remove(); if (thetaMk.label) thetaMk.label.remove(); thetaMk = null; }
    if (th) { if (angLabs[th]) { angLabs[th].mark.remove(); if (angLabs[th].label) angLabs[th].label.remove(); delete angLabs[th]; } thetaMk = markAngle(th, o.thetaLabel ?? 'θ', o.thetaColor || AMBER); }
    colorSides(th); placeTags(th);
  }
  let sqEls = [];
  function squares(on) {
    sqEls.forEach((e) => e.remove()); sqEls = [];
    if (o.squareLabels !== false) Object.values(valLabs).forEach((e) => { e.style.display = on ? 'none' : ''; });   // the length moves into the square ("3² = 9")
    if (!on) return [];
    [['a', 'B', 'C', 'A'], ['b', 'A', 'C', 'B'], ['c', 'A', 'B', 'C']].forEach(([s, p, q, r], i) => {
      const Q4 = sqPts(V[p], V[q], V[r]), gg = popable(grp(L.sq, 'geo-rt-sq')), colr = [OPP, ADJ, HYP][i];
      path(gg, polyD(Q4), { stroke: colr, width: 2.2, fill: colr, fillOpacity: 0.1, cls: '' });
      const nU = Math.round(sd[s]);
      if (on === 'grid' && Math.abs(sd[s] - nU) < 1e-6 && nU <= 25) {
        let d = ''; for (let j = 1; j < nU; j++) { const t = j / nU; d += `M${pts([lerpP(Q4[0], Q4[1], t), lerpP(Q4[3], Q4[2], t)]).join('L')}M${pts([lerpP(Q4[0], Q4[3], t), lerpP(Q4[1], Q4[2], t)]).join('L')}`; }
        path(gg, d, { stroke: colr, width: 1, opacity: 0.55, cls: '' });
      }
      if (o.squareLabels !== false) {
        const cc = cenOf(Q4), sideOf = dist(Q4[0], Q4[1]), want = typeof o.squareLabels === 'object' ? o.squareLabels[s] : null, vt = valTxt[s], num = vt && /^\d+(\.\d+)?(\s*[a-z]+)?$/i.test(vt) ? parseFloat(vt) : null;
        const lab2 = want != null ? String(want) : num != null ? `${fmtLen(num, 3)}² = ${fmtLen(num * num, 2)}` : vt ? `${vt}²` : `${s}²`;
        text(gg, cc[0], cc[1], lab2, { size: Math.max(12, Math.min(size, sideOf / Math.max(3, lab2.length) * 1.7)), color: colr, halo: 5 });
      }
      sqEls.push(gg);
    });
    return sqEls;
  }
  const api = {
    el: S.own ? S.el : g, svg: S.svg, g, layers: L, V, sides: sd, sideEls: sides, tags, valLabels: valLabs,
    roles: () => (theta ? rolesFor(theta) : null), side: (s) => sides[s], get theta() { return theta; },
    async setTheta(c, th, ms = 700) {
      if (!theta || !th || th === theta || !c || c.fast) { setThetaNow(th); if (c && !c.fast && th) await Promise.all(Object.values(tags).map((t) => pop(c, t, 300))); return; }
      const from = {}; show.forEach((role) => { from[role] = tagPos(role, theta); });
      const to = {}; show.forEach((role) => { to[role] = tagPos(role, th); });
      if (thetaMk) { thetaMk.mark.remove(); if (thetaMk.label) thetaMk.label.remove(); thetaMk = null; }
      ['a', 'b'].forEach((s) => sides[s].setAttribute('stroke', INK));
      await tween(c, ms, (t) => show.forEach((role) => { const p = lerpP(from[role], to[role], t); tags[role].setAttribute('x', r2(p[0])); tags[role].setAttribute('y', r2(p[1])); }));
      setThetaNow(th); if (thetaMk) { await drawIn(thetaMk.mark, 400, c); if (thetaMk.label) await pop(c, thetaMk.label, 300); }
    },
    async highlight(c, which, ho = {}) {
      const s = ['opp', 'adj', 'hyp'].indexOf(which) >= 0 ? (theta ? rolesFor(theta)[which] : 'c') : which, colr = ho.color || (ROLE_COLORS[which] || (theta ? ROLE_COLORS[Object.keys(rolesFor(theta)).find((r) => rolesFor(theta)[r] === s)] : HYP));
      const el = path(L.hl, `M${pts([V[ends[s][0]], V[ends[s][1]]]).join('L')}`, { stroke: colr, width: 13, opacity: 0.3 }); await drawIn(el, 500, c); return el;
    },
    clearHighlight() { L.hl.innerHTML = ''; },
    async showSquares(c, on = true) { const els = squares(on); if (c && !c.fast) for (const e of els) await pop(c, e, 420); return els; }
  };
  setThetaNow(theta);
  if (o.squares) squares(o.squares);
  void opp;
  return api;
}

/** Geo.pythagProof(host, { x, y, width 640, height 330, a 3, b 4, labels true, colors }) — the rearrangement proof: two
 *  (a + b) squares, each with four copies of the triangle. Left: they leave the tilted c² square. play(c) slides them (in
 *  the right-hand copy) so they leave a² and b² instead. → { el, svg, play(c), reset(), state } */
export function pythagProof(host, o = {}) {
  const W = o.width || 640, H = o.height || 330, S = surface(host, o, W, H), g = rootG(S, 'geo-pp');
  const a = o.a || 3, b = o.b || 4, s = a + b, u = Math.min((W - 90) / (2 * s), (H - 60) / s), side = s * u, gx = (W - 2 * side) / 3;
  const X = [gx, 2 * gx + side], Y = (H - side) / 2 + 6, triCol = o.triColor || '#f2c14e';
  const T0 = { tl: [[0, 0], [a, 0], [0, b]], tr: [[s, 0], [s, a], [a, 0]], br: [[s, s], [b, s], [s, a]], bl: [[0, s], [0, b], [b, s]] };
  const MOVE = { tl: [0, a], tr: [0, 0], br: [-b, 0], bl: [a, -b] };
  const panel = (x0, which) => {
    const pg = grp(g); const P = (p) => [x0 + p[0] * u, Y + p[1] * u];
    svgEl('rect', { x: x0, y: Y, width: side, height: side, fill: '#fff', stroke: INK, 'stroke-width': 2.4 }, pg);
    const holes = grp(pg), tris = {}, triG = grp(pg);
    Object.keys(T0).forEach((key) => { const tg = grp(triG); path(tg, polyD(T0[key].map(P)), { stroke: INK, width: 2, fill: triCol, cls: '' }); tris[key] = tg; });
    return { pg, P, holes, tris };
  };
  const left = panel(X[0], 1), right = panel(X[1], 2);
  const hole = (pn, poly, lab, colr) => { const e = popable(grp(pn.holes)); path(e, polyD(poly.map(pn.P)), { stroke: 'none', fill: colr, fillOpacity: 0.22, cls: '' }); const cc = cenOf(poly.map(pn.P)); if (o.labels !== false) text(e, cc[0], cc[1], lab, { size: 22, color: colr }); return e; };
  hole(left, [[a, 0], [s, a], [b, s], [0, b]], 'c²', HYP);
  let r1 = hole(right, [[a, 0], [s, a], [b, s], [0, b]], 'c²', HYP), r2h = null;
  text(g, X[0] + side / 2, Y - 16, `side a + b = ${fmtLen(s)}`, { size: 15, color: SLATE });
  text(g, X[1] + side / 2, Y - 16, 'the same square', { size: 15, color: SLATE });
  const api = { el: S.own ? S.el : g, svg: S.svg, g, state: 1,
    async play(c, ms = 900) {
      if (r1) { r1.remove(); r1 = null; }
      for (const key of ['tl', 'br', 'bl']) { const [dx, dy] = MOVE[key]; await tween(c, ms, (t) => right.tris[key].setAttribute('transform', `translate(${r2(dx * u * t)} ${r2(dy * u * t)})`)); }
      r2h = [hole(right, [[0, 0], [a, 0], [a, a], [0, a]], 'a²', OPP), hole(right, [[a, a], [s, a], [s, s], [a, s]], 'b²', ADJ)];
      await Promise.all(r2h.map((e) => pop(c, e, 400))); api.state = 2;
    },
    reset() { Object.values(right.tris).forEach((t) => t.removeAttribute('transform')); (r2h || []).forEach((e) => e.remove()); r2h = null; if (!r1) r1 = hole(right, [[a, 0], [s, a], [b, s], [0, b]], 'c²', HYP); api.state = 1; } };
  if (o.state === 2) api.play(null);
  return api;
}

/** Geo.similarRights(host, { x, y, width 760, height 330, theta 35, sizes [3, 5, 7] (adjacent legs, cm), by 'adj' | 'hyp'
 *  (what sizes measure), unit 40 (max px per cm), ratios ['opp/adj', 'opp/hyp', 'adj/hyp'], names true (tan/sin/cos column
 *  headings once revealed), dp 1 (lengths), rdp 2 (ratios), slider true, calc true (a calculator row: tan 35° = …),
 *  reveal: [] (ratio keys whose name is shown: 'opp/adj' → tan θ), onChange(values) })
 *  Nested right triangles sharing angle θ at the lower left, with a live table. → { el, svg, table, set(theta), theta,
 *  values(), grow(c), highlightCol(c, key), name(c, key) (heading gets "= tan θ"), slider } */
export function similarRights(host, o = {}) {
  const W = o.width || 760, H = o.height || 330, S = wrapped(host, o, W, H, 'geo-srt'), g = rootG(S, 'geo-srt-g');
  const sizes = (o.sizes || [3, 5, 7]).slice().sort((x, y) => x - y), keys = o.ratios || ['opp/adj', 'opp/hyp', 'adj/hyp'], dp = o.dp ?? 1, rdp = o.rdp ?? 2;
  const NAME = { 'opp/adj': 'tan', 'opp/hyp': 'sin', 'adj/hyp': 'cos' }, TRIC = [BLUE, GREEN, PURPLE, AMBER, RED, '#0f8ea8'];
  let theta = o.theta ?? 35, named = {}; (o.reveal || []).forEach((k) => { named[k] = true; });
  const L = { tris: grp(g), marks: grp(g), hl: grp(g) };
  const tbl = S.panel ? h('table', 'geo-table') : null; if (tbl) S.panel.appendChild(tbl);
  let slider = null, sliderLab = null;
  if (S.panel && o.slider !== false) {
    const row = h('div', 'geo-slider'); sliderLab = h('span', '', ''); slider = h('input'); slider.type = 'range'; slider.min = o.min ?? 10; slider.max = o.max ?? 70; slider.step = 1; slider.value = theta;
    slider.setAttribute('data-tap', ''); slider.setAttribute('aria-label', 'angle θ'); row.appendChild(h('span', 'geo-sl-t', 'θ')); row.appendChild(slider); row.appendChild(sliderLab); S.panel.insertBefore(row, tbl);
    slider.addEventListener('input', () => api.set(+slider.value));
  }
  const vals = () => sizes.map((sz) => { const t = theta * RAD, adj = o.by === 'hyp' ? sz * Math.cos(t) : sz, hyp = o.by === 'hyp' ? sz : sz / Math.cos(t), opp = adj * Math.tan(t); return { opp, adj, hyp, 'opp/adj': opp / adj, 'opp/hyp': opp / hyp, 'adj/hyp': adj / hyp }; });
  function render() {
    L.tris.innerHTML = ''; L.marks.innerHTML = ''; L.hl.innerHTML = '';
    const v = vals(), big = v[v.length - 1], F = fitWorld([[0, 0], [big.adj, 0], [big.adj, big.opp]], W, H, [24, 70, 36, 40], o.unit || 40);
    const A = F.P([0, 0]);
    api.els = v.slice().reverse().map((t, ri) => {
      const i = v.length - 1 - ri, C = F.P([t.adj, 0]), B = F.P([t.adj, t.opp]), colr = TRIC[i % TRIC.length], gg = grp(L.tris);
      path(gg, polyD([A, C, B]), { stroke: colr, width: 2.6, fill: colr, fillOpacity: 0.07, cls: '' });
      angMark(gg, C, 90, 90, { right: true, rs: 11, color: colr, width: 1.6 });
      text(gg, B[0] + 6, (B[1] + C[1]) / 2, fmtLen(t.opp, dp), { size: 14, color: colr, anchor: 'start' });
      text(gg, C[0], C[1] + 16, fmtLen(t.adj, dp), { size: 14, color: colr });
      return gg;
    }).reverse();
    angMark(L.marks, A, 0, theta, { color: AMBER, r: 46, label: 'θ', size: 17, labelR: 60 });
    text(L.marks, A[0] - 8, A[1] + 18, `θ = ${fmtDeg(theta)}°`, { size: 15, color: AMBER, anchor: 'start' });
    if (sliderLab) sliderLab.textContent = fmtDeg(theta) + '°';
    if (tbl) {
      const head = ['', 'opp', 'adj', 'hyp'].concat(keys.map((k) => `<span class="geo-frac">${k.replace('/', '</span>/<span class="geo-frac">')}</span>` + (named[k] ? ` = ${NAME[k]} θ` : '')));
      let s = `<tr>${head.map((x, i) => `<th${i > 3 ? ` data-k="${keys[i - 4]}"` : ''}>${x}</th>`).join('')}</tr>`;
      v.forEach((t, i) => { s += `<tr><td><i style="background:${TRIC[i % TRIC.length]}"></i></td><td>${fmtLen(t.opp, dp)}</td><td>${fmtLen(t.adj, dp)}</td><td>${fmtLen(t.hyp, dp)}</td>${keys.map((k) => `<td data-k="${k}">${t[k].toFixed(rdp)}</td>`).join('')}</tr>`; });
      if (o.calc !== false) s += `<tr class="geo-calc"><td colspan="4">calculator (DEG):</td>${keys.map((k) => `<td data-k="${k}">${NAME[k]} ${fmtDeg(theta)}° = ${({ tan: Math.tan, sin: Math.sin, cos: Math.cos })[NAME[k]](theta * RAD).toFixed(rdp)}</td>`).join('')}</tr>`;
      tbl.innerHTML = s;
    }
    if (o.onChange) o.onChange(v);
  }
  const api = { el: S.root, svg: S.svg, g, table: tbl, slider, sizes,
    get theta() { return theta; }, values: vals,
    set(th) { theta = th; if (slider) slider.value = th; render(); },
    async grow(c, ms = 450) { render(); if (!c || c.fast) return; const rows = tbl ? [...tbl.querySelectorAll('tr')].slice(1) : []; api.els.forEach((e) => { e.style.opacity = 0; }); rows.forEach((r) => { r.style.opacity = 0; }); for (let i = 0; i < api.els.length; i++) { await appear(c, api.els[i], ms); if (rows[i]) await appear(c, rows[i], 250); } rows.slice(api.els.length).forEach((r) => { r.style.opacity = 1; }); },
    async highlightCol(c, key) { if (!tbl) return; tbl.querySelectorAll('.geo-hl').forEach((e) => e.classList.remove('geo-hl')); const cells = [...tbl.querySelectorAll(`[data-k="${key}"]`)]; cells.forEach((e) => e.classList.add('geo-hl')); if (c && !c.fast) for (const e of cells) await pop(c, e, 260); },
    async name(c, key) { named[key] = true; render(); api.highlightCol(null, key); const th = tbl && tbl.querySelector(`th[data-k="${key}"]`); if (th && c && !c.fast) await pop(c, th, 350); } };
  render();
  return api;
}

/* ---------------- world pictures: people, trees, towers… (metres, y up) ---------------- */
function glyph(gp, F, kind, x, hgt, o = {}) {
  const s = F.s, X = F.X, Y = F.Y, out = { top: [x, hgt] };
  const P = (p) => pts([F.P(p)])[0];
  if (kind === 'person') {
    const tot = hgt / 0.93, hr = tot * 0.075, hc = [x, tot - hr], col2 = o.color || SLATE, w = Math.max(2, tot * 0.03 * s);
    path(gp, `M${P([x, tot - 2 * hr])}L${P([x, tot * 0.47])}M${P([x - tot * 0.12, 0])}L${P([x, tot * 0.47])}L${P([x + tot * 0.12, 0])}M${P([x - tot * 0.16, tot * 0.58])}L${P([x, tot * 0.76])}L${P([x + tot * 0.16, tot * 0.58])}`, { stroke: col2, width: w, cls: '' });
    svgEl('circle', { cx: r2(X(hc[0])), cy: r2(Y(hc[1])), r: r2(Math.max(3, hr * s)), fill: '#fff', stroke: col2, 'stroke-width': Math.max(1.5, w * 0.8) }, gp);
    out.eye = [x + (o.face ?? 1) * hr * 0.45, hgt]; dot(gp, F.P(out.eye), { r: Math.max(1.6, hr * s * 0.22), color: INK }); out.top = [x, tot]; out.xr = tot * 0.16;
  } else if (kind === 'tree') {
    const tw = Math.max(hgt * 0.07, 0.15);
    svgEl('rect', { x: r2(X(x - tw / 2)), y: r2(Y(hgt * 0.45)), width: r2(tw * s), height: r2(hgt * 0.45 * s), fill: '#8a5a2b' }, gp);
    svgEl('ellipse', { cx: r2(X(x)), cy: r2(Y(hgt * 0.67)), rx: r2(hgt * 0.24 * s), ry: r2(hgt * 0.33 * s), fill: '#5f9e4f', stroke: '#3f7535', 'stroke-width': 1.5 }, gp); out.xr = hgt * 0.24;
  } else if (kind === 'building' || kind === 'elevator') {
    const bw = o.w || hgt * (kind === 'elevator' ? 0.32 : 0.45), side = o.side ?? 1, x0 = side > 0 ? x : x - bw; out.xr = side > 0 ? bw : 0;
    if (kind === 'elevator') {
      svgEl('rect', { x: r2(X(x0)), y: r2(Y(hgt * 0.82)), width: r2(bw * s), height: r2(hgt * 0.82 * s), fill: '#c9463d', stroke: '#7e2a24', 'stroke-width': 1.5 }, gp);
      path(gp, polyD([F.P([x0, hgt * 0.82]), F.P([x0 + bw / 2, hgt]), F.P([x0 + bw, hgt * 0.82])]), { stroke: '#7e2a24', width: 1.5, fill: '#e9e2d0', cls: '' });
      out.top = [x0 + bw / 2, hgt]; out.xr = side > 0 ? bw / 2 : 0;
    } else {
      svgEl('rect', { x: r2(X(x0)), y: r2(Y(hgt)), width: r2(bw * s), height: r2(hgt * s), fill: '#d7dbe3', stroke: '#6a7182', 'stroke-width': 1.5 }, gp);
      const nf = Math.max(2, Math.min(12, Math.round(hgt / 3.2))), fw = bw / 3;
      for (let f2 = 0; f2 < nf - 1; f2++) for (let c2 = 0; c2 < 2; c2++) svgEl('rect', { x: r2(X(x0 + fw * (0.5 + c2 * 1.5))), y: r2(Y(hgt * (f2 + 0.8) / nf)), width: r2(fw * 0.55 * s), height: r2(hgt / nf * 0.45 * s), fill: '#9fb4d6' }, gp);
      out.top = [side > 0 ? x0 : x0 + bw, hgt];
    }
  } else if (kind === 'tower') {
    const bw = hgt * 0.1; let d = `M${P([x - bw / 2, 0])}L${P([x, hgt])}L${P([x + bw / 2, 0])}`;
    for (let i = 1; i < 6; i++) { const y1 = hgt * i / 6, w1 = bw / 2 * (1 - i / 6), y0 = hgt * (i - 1) / 6, w0 = bw / 2 * (1 - (i - 1) / 6); d += `M${P([x - w0, y0])}L${P([x + w1, y1])}M${P([x + w0, y0])}L${P([x - w1, y1])}`; }
    path(gp, d, { stroke: '#7b4fc4', width: 1.8, cls: '' }); dot(gp, F.P([x, hgt]), { r: 3.5, color: RED }); out.xr = bw / 2;
  } else if (kind === 'pole' || kind === 'flag' || kind === 'stick' || kind === 'post') {
    path(gp, `M${P([x, 0])}L${P([x, hgt])}`, { stroke: kind === 'stick' ? '#8a5a2b' : SLATE, width: kind === 'stick' ? 3.5 : 3, cls: '' });
    if (kind === 'flag') { const fl = (o.side ?? 1) * Math.min(hgt * 0.22, 2.2); path(gp, polyD([F.P([x, hgt]), F.P([x + fl, hgt * 0.95]), F.P([x, hgt * 0.9])]), { stroke: 'none', fill: RED, cls: '' }); out.xr = Math.max(0, fl); }
  } else if (kind === 'lighthouse') {
    const bw = hgt * 0.16;
    path(gp, polyD([F.P([x - bw / 2, 0]), F.P([x - bw * 0.3, hgt * 0.86]), F.P([x + bw * 0.3, hgt * 0.86]), F.P([x + bw / 2, 0])]), { stroke: '#6a7182', width: 1.5, fill: '#fff', cls: '' });
    for (let i = 1; i < 4; i += 2) path(gp, polyD([F.P([x - bw / 2 + bw * 0.2 * i / 4 * 0.5, hgt * 0.86 * i / 4]), F.P([x - bw / 2 + bw * 0.2 * (i + 1) / 4 * 0.5, hgt * 0.86 * (i + 1) / 4]), F.P([x + bw / 2 - bw * 0.2 * (i + 1) / 4 * 0.5, hgt * 0.86 * (i + 1) / 4]), F.P([x + bw / 2 - bw * 0.2 * i / 4 * 0.5, hgt * 0.86 * i / 4])]), { stroke: 'none', fill: RED, cls: '' });
    svgEl('rect', { x: r2(X(x - bw * 0.3)), y: r2(Y(hgt)), width: r2(bw * 0.6 * s), height: r2(hgt * 0.14 * s), fill: '#f2c94c', stroke: '#6a7182', 'stroke-width': 1.5 }, gp); out.xr = bw / 2;
  } else if (kind === 'cliff') {
    const cw = o.w || hgt * 0.8, side = o.side ?? 1;
    path(gp, polyD([F.P([x - side * cw, 0]), F.P([x - side * cw, hgt]), F.P([x, hgt]), F.P([x + side * hgt * 0.06, hgt * 0.5]), F.P([x, 0])]), { stroke: '#7a6248', width: 1.5, fill: '#c8b08a', cls: '' });
  } else if (kind === 'boat') {
    const L2 = Math.max(hgt, 1) * 1.6;
    path(gp, polyD([F.P([x - L2 / 2, L2 * 0.2]), F.P([x + L2 / 2, L2 * 0.2]), F.P([x + L2 * 0.35, 0]), F.P([x - L2 * 0.35, 0])]), { stroke: '#6a4a2a', width: 1.5, fill: '#a8743f', cls: '' });
    path(gp, `M${P([x, L2 * 0.2])}L${P([x, L2 * 0.8])}`, { stroke: SLATE, width: 2, cls: '' });
    path(gp, polyD([F.P([x, L2 * 0.8]), F.P([x + L2 * 0.35, L2 * 0.25]), F.P([x, L2 * 0.25])]), { stroke: 'none', fill: '#fff', cls: '' });
    out.top = [x, 0];
  } else if (kind === 'plane') {
    const L2 = o.size || 6;
    path(gp, polyD([F.P([x - L2 / 2, hgt]), F.P([x + L2 / 2, hgt + L2 * 0.05]), F.P([x + L2 / 2, hgt - L2 * 0.05])]), { stroke: SLATE, width: 1.5, fill: '#dfe3ea', cls: '' });
    path(gp, `M${P([x + L2 * 0.05, hgt])}L${P([x - L2 * 0.15, hgt + L2 * 0.3])}M${P([x + L2 * 0.05, hgt])}L${P([x - L2 * 0.15, hgt - L2 * 0.3])}M${P([x - L2 * 0.42, hgt])}L${P([x - L2 * 0.5, hgt + L2 * 0.15])}`, { stroke: SLATE, width: 2, cls: '' });
  }
  return out;
}
const groundLine = (gp, F, x0, x1) => { const y = F.Y(0); path(gp, `M${r2(F.X(x0))} ${r2(y)}H${r2(F.X(x1))}`, { stroke: GROUND, width: 3, cls: '' }); let d = ''; for (let x = F.X(x0); x < F.X(x1); x += 14) d += `M${r2(x)} ${r2(y + 1)}l-7 8`; path(gp, d, { stroke: GROUND, width: 1.2, opacity: 0.6, cls: '' }); };
/** a length label with a dimension line (arrows both ends) beside world segment PQ (px offset off; + = left of P→Q) */
function dimLine(gp, F, P, Q, s, off, colr = SLATE, size = 17) {
  const p = F.P(P), q = F.P(Q), th = dirTo(p, q), nrm = at([0, 0], th + 90, off), A = [p[0] + nrm[0], p[1] + nrm[1]], B = [q[0] + nrm[0], q[1] + nrm[1]];
  path(gp, `M${pts([A, B]).join('L')}`, { stroke: colr, width: 1.4, cls: '' });
  arrowHead(gp, A[0], A[1], A[0] - B[0], A[1] - B[1], { color: colr, width: 1.4, L: 8, hw: 4 }); arrowHead(gp, B[0], B[1], B[0] - A[0], B[1] - A[1], { color: colr, width: 1.4, L: 8, hw: 4 });
  if (s == null || s === '') return null;
  const M = midPt(A, B), u = at([0, 0], th + 90, 1), hw = String(s).length * size * 0.29 + 4, d = Math.abs(u[0]) * hw + Math.abs(u[1]) * size * 0.6 + 2, sg = Math.sign(off) || 1;
  return popable(text(gp, M[0] + u[0] * d * sg, M[1] + u[1] * d * sg, s, { size, color: s === '?' || /^[a-zA-Zh]$/.test(s) ? RED : colr }));
}

/** Geo.elevation(host, { x, y, width 680, height 380, kind 'elevation' | 'depression', angle 35, dist 20, height (target top
 *  above the ground; or the observer's height above the target for depression), eye 1.6 (observer's eye height; 0 = an
 *  eye on the ground), observer 'person' | 'none' (elevation) | 'cliff' | 'lighthouse' | 'building' | 'plane' (depression),
 *  target 'tree' | 'building' | 'tower' | 'flag' | 'pole' | 'elevator' | 'plane' (elevation) | 'boat' | 'person' | 'car'
 *  (depression), labels: { angle: '35°' | 'θ', dist: '20 m', height: 'h' (the part above eye level), eye: '1.6 m', sight: '' },
 *  units 'm', alt false (depression: also mark the equal angle of elevation at the target), sky true })
 *  Horizontal (dashed) from the eye, the line of sight, the angle between them, the right angle, eye height.
 *  → { el, svg, g, state, setAngle(c, deg, ms), drawIn(c), showAlt(c), parts } */
export function elevation(host, o = {}) {
  const W = o.width || 680, Hh = o.height || 380, S = surface(host, o, W, Hh), g = rootG(S, 'geo-elev');
  const dep = o.kind === 'depression', st = { angle: o.angle ?? null, dist: o.dist ?? 20 };
  const eye0 = o.eye ?? (dep ? 0 : 1.6);
  if (st.angle == null) st.angle = Math.atan2(dep ? (o.height ?? 30) : (o.height ?? 15) - eye0, st.dist) / RAD;
  const api = { el: S.own ? S.el : g, svg: S.svg, g, state: st, parts: {} };
  let altOn = !!o.alt;
  function render() {
    g.innerHTML = '';
    const ang = st.angle, D = st.dist, units = o.units ?? 'm', lb = o.labels || {};
    const rise = D * Math.tan(ang * RAD);
    const obs = o.observer || (dep ? 'cliff' : 'person'), tgt = o.target || (dep ? 'boat' : 'tree');
    // world: observer at x = 0, target at x = D
    const eyeY = dep ? rise : eye0, topY = dep ? 0 : eye0 + rise;
    const EYE = [0, eyeY], TOP = [D, topY], HOR = [D, eyeY];
    const wpts = [[-D * 0.12, 0], [D * 1.12, 0], [0, eyeY * 1.08], [D, topY * 1.1], [D, eyeY]];
    const F = fitWorld(wpts, W, Hh, [26, 70, 56, 70]);
    const L = { sky: grp(g), world: grp(g), lines: grp(g), marks: grp(g), labs: grp(g) };
    if (o.sky !== false) svgEl('rect', { x: 0, y: 0, width: W, height: r2(F.Y(0)), fill: SKY }, L.sky);
    if (dep && (obs === 'cliff')) glyph(L.world, F, 'cliff', 0, eyeY - eye0, { w: D * 0.12 });
    if (dep && obs === 'lighthouse') glyph(L.world, F, 'lighthouse', 0, eyeY - eye0);
    if (dep && obs === 'building') glyph(L.world, F, 'building', 0, eyeY - eye0, { side: -1, w: D * 0.1 });
    groundLine(L.world, F, -D * 0.12, D * 1.12);
    const obsBase = dep ? eyeY - eye0 : 0;
    if (obs === 'person' || (dep && eye0 > 0 && obs !== 'plane')) { const pg = grp(L.world); glyph(pg, F, 'person', 0, eye0, {}); if (obsBase) pg.setAttribute('transform', `translate(0 ${r2(-obsBase * F.s)})`); }
    if (obs === 'plane') glyph(L.world, F, 'plane', 0, eyeY, { size: D * 0.08 });
    let xr = 0;
    if (!dep) { const gl = tgt === 'plane' ? glyph(L.world, F, 'plane', D, topY, { size: D * 0.1 }) : glyph(L.world, F, tgt, D, topY, { side: 1 }); xr = tgt === 'plane' ? 0 : gl.xr || 0; }
    else if (tgt === 'person') glyph(L.world, F, 'person', D, Math.min(1.6, eyeY * 0.1)); else if (tgt === 'car') { svgEl('rect', { x: r2(F.X(D - 2)), y: r2(F.Y(1.4)), width: r2(4 * F.s), height: r2(1.4 * F.s), rx: 3, fill: BLUE }, L.world); } else glyph(L.world, F, 'boat', D, Math.max(1, D * 0.04));
    const e = F.P(EYE), tp = F.P(TOP), hz = F.P(HOR);
    api.parts.horizontal = path(L.lines, `M${pts([e, hz]).join('L')}`, { stroke: SLATE, width: 2, dash: '9 6' });
    api.parts.sight = path(L.lines, `M${pts([e, tp]).join('L')}`, { stroke: AMBER, width: 3 });
    arrowHead(L.lines, tp[0], tp[1], tp[0] - e[0], tp[1] - e[1], { color: AMBER, width: 3 });
    if (!dep) path(L.lines, `M${pts([tp, F.P([D, 0])]).join('L')}`, { stroke: INK, width: 2.2, opacity: 0.55, dash: tgt === 'tree' || tgt === 'plane' ? '4 4' : null });
    else path(L.lines, `M${pts([F.P([0, 0]), e]).join('L')}`, { stroke: INK, width: 2.2, opacity: 0.55, dash: '4 4' });
    const dd = dirTo(e, tp), aLab = lb.angle ?? (fmtDeg(Math.abs(ang)) + '°');
    api.parts.angle = angMark(L.marks, e, dep ? dd : 0, dep ? -dd + 360 : dd, { color: AMBER, r: 48, label: aLab, size: 18 });
    if (!dep) angMark(L.marks, hz, 90, 90, { right: true, rs: 13, color: SLATE }); else angMark(L.marks, F.P([0, 0]), 0, 90, { right: true, rs: 13, color: SLATE });
    if (dep && altOn) { const tv = F.P([D, 0]); api.parts.alt = angMark(L.marks, tv, dirTo(tv, e), 180 - dirTo(tv, e), { color: GREEN, r: 48, label: lb.alt ?? aLab, size: 18 }); }
    const unitS = (v) => fmtLen(v, 1) + (units ? ' ' + units : '');
    api.parts.dist = dimLine(L.labs, F, [0, 0], [D, 0], lb.dist ?? unitS(D), -26);
    if (!dep) {
      api.parts.height = dimLine(L.labs, F, [D, eyeY], [D, topY], lb.height ?? unitS(rise), -(16 + xr * F.s), RED);
      if (eye0 > 0 && lb.eye !== false) api.parts.eye = dimLine(L.labs, F, [0, 0], [0, eyeY], lb.eye ?? unitS(eye0), 26 + (obs === 'person' ? 14 : 0));
    } else api.parts.height = dimLine(L.labs, F, [0, 0], [0, eyeY], lb.height ?? unitS(eyeY), obs === 'lighthouse' ? 14 + (eyeY - eye0) * 0.08 * F.s : 30, RED);
    if (lb.sight) { const M = midPt(e, tp), u = at([0, 0], dd + 90, 18); text(L.labs, M[0] + u[0], M[1] + u[1], lb.sight, { size: 17, color: AMBER }); }
    const hl = popable(text(L.labs, (e[0] + hz[0]) / 2, e[1] + (dep ? -14 : 14), 'horizontal', { size: 14, color: SLATE, weight: 600 }));
    api.parts.hzLabel = hl; api.F = F;
  }
  render();
  api.setAngle = (c, deg, ms = 800) => { const a0 = st.angle; return tween(c, ms, (t) => { st.angle = lerp(a0, deg, t); render(); }); };
  api.showAlt = async (c) => { altOn = true; render(); if (api.parts.alt) { await drawIn(api.parts.alt.mark, 400, c); await pop(c, api.parts.alt.label, 300); } };
  api.drawIn = async (c) => {
    render(); const P2 = api.parts, seq = [P2.horizontal, P2.hzLabel, P2.sight, P2.angle.mark, P2.angle.label];
    if (!c || c.fast) return; seq.forEach((e) => e && (e.style.opacity = 0));
    await drawIn(P2.horizontal, 600, c); await appear(c, P2.hzLabel, 250); await drawIn(P2.sight, 700, c); await drawIn(P2.angle.mark, 400, c); if (P2.angle.label) await pop(c, P2.angle.label, 300);
  };
  return api;
}

/** Geo.clinometer(host, { x, y, width 520, height 380, angle 30 (tilt: + = looking up), r 150, scale 'protractor' (0–180
 *  along the arc: elevation = 90° − reading) | 'direct' (0 at the bottom, counting up both ways), interactive true, sight
 *  true, readout true, min −80, max 80, onChange(r) })
 *  A protractor with a straw on its straight edge and a weighted string from the centre. Drag it to tilt: the string stays
 *  vertical. → { el, svg, set(deg), tiltTo(c, deg, ms), reading() → { scale, elevation, text }, state } */
export function clinometer(host, o = {}) {
  const W = o.width || 520, H = o.height || 380, S = wrapped(host, o, W, H, 'geo-clino'), g = rootG(S, 'geo-clino-g');
  const R = o.r || 165, C = [o.cx ?? W * 0.46, o.cy ?? H * 0.36], st = { angle: o.angle ?? 30 }, direct = o.scale === 'direct';
  const L = { sight: grp(g), body: grp(g, 'geo-clino-body'), str: grp(g) };
  L.body.style.transformBox = 'view-box'; L.body.style.transformOrigin = '0 0';
  // body in local coordinates: straight edge along x (y = 0), arc BELOW (y > 0 on screen = math −y)
  const b = L.body, P0 = (deg, r) => [r * Math.cos(deg * RAD), -r * Math.sin(deg * RAD)];
  path(b, `M${-R} 0A${R} ${R} 0 0 0 ${R} 0Z`, { stroke: '#4d5b78', width: 1.6, fill: '#dce9fb', fillOpacity: 0.7, cls: '' });
  let d = ''; for (let a = 180; a <= 360; a++) { const t = a - 180, Lt = t % 10 === 0 ? 0.1 : t % 5 === 0 ? 0.065 : 0.035, p = P0(a, R), q = P0(a, R * (1 - Lt)); d += `M${pts([p, q]).join('L')}`; }
  path(b, d, { stroke: SLATE, width: 1, cls: '', cap: 'butt' });
  for (let a = 190; a <= 350; a += 10) { const t = a - 180, v = direct ? Math.abs(90 - t) : t, p = P0(a, R * 0.81); const tt = svgEl('text', { x: r2(p[0]), y: r2(p[1]), 'font-size': 12, 'font-weight': 700, fill: INK, class: 'geo-tn', 'text-anchor': 'middle', 'dominant-baseline': 'central', transform: `rotate(${r2(270 - a)} ${r2(p[0])} ${r2(p[1])})` }, b); tt.textContent = v; }
  svgEl('rect', { x: -R - 14, y: -13, width: 2 * R + 28, height: 12, rx: 6, fill: '#f6d47a', stroke: '#9b7a1d', 'stroke-width': 1.5 }, b);   // the straw
  const eyeG = grp(b); svgEl('ellipse', { cx: -R - 34, cy: -7, rx: 13, ry: 8, fill: '#fff', stroke: INK, 'stroke-width': 1.8 }, eyeG); svgEl('circle', { cx: -R - 30, cy: -7, r: 4, fill: INK }, eyeG);
  svgEl('circle', { cx: 0, cy: 0, r: 3.5, fill: RED }, b);
  const hit = svgEl('path', { d: `M${-R - 50} -22H${R + 18}V${R + 10}H${-R - 50}Z`, fill: 'transparent' }, b);
  const sight = path(L.sight, '', { stroke: AMBER, width: 2.2, dash: '8 6', cls: '' });
  const str = path(L.str, '', { stroke: INK, width: 1.6, cls: '' }), wt = svgEl('circle', { r: 9, fill: SLATE }, L.str);
  const read = S.panel && o.readout !== false ? h('div', 'geo-readout') : null; if (read) S.panel.appendChild(read);
  L.str.style.pointerEvents = 'none'; L.sight.style.pointerEvents = 'none';
  function reading() {
    const a = st.angle, t = 90 - a, sc = direct ? Math.abs(a) : t, el = Math.abs(a), up = a >= 0;
    const txt = direct ? `The string crosses <b>${fmtDeg(sc)}°</b>: the angle of ${up ? 'elevation' : 'depression'} is <b class="geo-big">${fmtDeg(el)}°</b>.`
      : `The string crosses <b>${fmtDeg(t)}°</b>. Angle of ${up ? 'elevation' : 'depression'} = ${up ? `90° − ${fmtDeg(t)}°` : `${fmtDeg(t)}° − 90°`} = <b class="geo-big">${fmtDeg(el)}°</b>`;
    return { scale: sc, elevation: el, up, text: txt };
  }
  function render() {
    const a = st.angle;
    b.setAttribute('transform', `translate(${r2(C[0])} ${r2(C[1])}) rotate(${r2(-a)})`);
    const u = at([0, 0], a, 1), lim = Math.min(u[0] > 0 ? (W - 4 - C[0]) / u[0] : Infinity, u[1] < 0 ? (C[1] - 4) / -u[1] : u[1] > 0 ? (H - 4 - C[1]) / u[1] : Infinity), E = at(C, a, Math.max(R + 20, lim)), S0 = at(C, a, R + 14); sight.setAttribute('d', o.sight === false ? '' : `M${pts([S0, E]).join('L')}`);
    const end = [C[0], C[1] + R * 1.08]; str.setAttribute('d', `M${pts([C, end]).join('L')}`); wt.setAttribute('cx', r2(end[0])); wt.setAttribute('cy', r2(end[1] + 8));
    const r = reading(); if (read) read.innerHTML = r.text; if (o.onChange) o.onChange(r);
  }
  if (o.interactive !== false) { let a0 = 0; dragger(S, hit, (p) => { a0 = st.angle - dirTo(C, p); }, (p) => { let a = n180(dirTo(C, p) + a0); a = Math.max(o.min ?? -80, Math.min(o.max ?? 80, Math.round(a))); st.angle = a; render(); }); }
  render();
  return { el: S.root, svg: S.svg, g, state: st, reading, set(a) { st.angle = a; render(); }, tiltTo(c, a, ms = 900) { const a0 = st.angle; return tween(c, ms, (t) => { st.angle = lerp(a0, a, t); render(); }); } };
}

/** Geo.shadow(host, { x, y, width 700, height 360, small: { h 1.8, shadow 2.4, kind 'person'|'stick'|'pole', label: { h, s } },
 *  big: { h, shadow 15, kind 'tree'|'pole'|'flag'|'tower'|'building'|'elevator', label: { h: 'h', s: '15 m' } }, units 'm',
 *  split auto (two panels when the heights differ a lot), sunLabel (the equal angles at the shadow tips, e.g. 'θ'), shade true })
 *  Parallel sun rays, two objects and their shadows: two similar right triangles. → { el, svg, play(c), highlight(c), sun } */
export function shadow(host, o = {}) {
  const W = o.width || 700, Hh = o.height || 360, S = surface(host, o, W, Hh), g = rootG(S, 'geo-shadow');
  const sm = Object.assign({ h: 1.8, shadow: 2.4, kind: 'person' }, o.small || {}), bg = Object.assign({ shadow: 15, kind: 'tree' }, o.big || {});
  if (bg.h == null) bg.h = bg.shadow * sm.h / sm.shadow;
  const sun = Math.atan2(sm.h, sm.shadow) / RAD, units = o.units ?? 'm', split = o.split ?? (bg.h / sm.h > 4);
  const L = { sky: grp(g), tri: grp(g), world: grp(g), rays: grp(g), marks: grp(g), labs: grp(g) };
  const api = { el: S.own ? S.el : g, svg: S.svg, g, sun, triangles: [], rays: [] };
  const lab = (obj, k2, v) => { const l = (obj.label || {})[k2]; return l === false ? null : l ?? fmtLen(v, 1) + (units ? ' ' + units : ''); };
  svgEl('rect', { x: 0, y: 0, width: W, height: Hh, fill: SKY, rx: 10 }, L.sky);
  const panels = split ? [[sm, 0, W * 0.36], [bg, W * 0.36, W]] : [[null, 0, W]];
  const drawObj = (F, obj, x0) => {
    const top = [x0, obj.h], tip = [x0 + obj.shadow, 0], base = [x0, 0];
    const tri = path(L.tri, polyD([F.P(base), F.P(top), F.P(tip)]), { stroke: 'none', fill: AMBER, fillOpacity: o.shade === false ? 0 : 0.16, cls: '' }); api.triangles.push(tri);
    if (obj.kind === 'person') glyph(L.world, F, 'person', x0, obj.h * 0.93, {}); else glyph(L.world, F, obj.kind, x0, obj.h, { side: 1 });
    const sh = path(L.world, `M${pts([F.P(base), F.P(tip)]).join('L')}`, { stroke: '#4b4f5a', width: 6, opacity: 0.55, cap: 'butt', cls: 'geo-shadow-len' }); obj.shEl = sh;
    const back = obj.back;
    const ray = path(L.rays, `M${pts([F.P(back), F.P(tip)]).join('L')}`, { stroke: '#e0a100', width: 2.2 }); api.rays.push(ray);
    const mp = lerpP(F.P(back), F.P(top), 0.5); arrowHead(L.rays, mp[0], mp[1], F.X(tip[0]) - F.X(back[0]), F.Y(tip[1]) - F.Y(back[1]), { color: '#e0a100', width: 2.2 });
    angMark(L.marks, F.P(base), 0, 90, { right: true, rs: 11, color: SLATE });
    if (o.sunLabel != null) angMark(L.marks, F.P(tip), 180 - sun, sun, { color: '#c27a0e', r: 34, label: o.sunLabel, size: 17 });
    dimLine(L.labs, F, base, tip, lab(obj, 's', obj.shadow), -24);
    dimLine(L.labs, F, base, top, lab(obj, 'h', obj.h), 18 + (obj.kind === 'person' ? 10 : 0));
  };
  panels.forEach(([obj, x0, x1]) => {
    const objs = obj ? [obj] : [sm, bg];
    const xs = obj ? [0] : [0, sm.shadow + Math.max(sm.shadow * 1.2, bg.shadow * 0.25)];
    const right = xs[xs.length - 1] + objs[objs.length - 1].shadow, top = Math.max(...objs.map((b2) => b2.h));
    objs.forEach((b2, i) => { const f = Math.max(0.25, Math.min(0.9, (top * 1.1 - b2.h) / b2.h)); b2.back = [xs[i] - b2.shadow * f, b2.h * (1 + f)]; });
    const F0 = fitWorld([[-top * 0.15, 0], [right * 1.05, 0], [0, top * 1.12]].concat(objs.map((b2) => b2.back)), x1 - x0, Hh, [16, 22, 50, 46]);
    const F = Object.assign({}, F0, { X: (x) => F0.X(x) + x0 }); F.P = (p) => [F.X(p[0]), F.Y(p[1])];
    groundLine(L.world, F, -top * 0.15, right * 1.05);
    objs.forEach((b2, i) => drawObj(F, b2, xs[i]));
    if (obj && x0 > 0) path(L.sky, `M${r2(x0)} 10V${Hh - 10}`, { stroke: '#cfd5df', width: 1.5, dash: '5 5', cls: '' });
  });
  // the sun, upper left
  const sunG = grp(L.sky); svgEl('circle', { cx: 34, cy: 30, r: 15, fill: '#f6c343' }, sunG);
  api.play = async (c) => {
    if (!c || c.fast) return;
    [...api.rays, ...api.triangles].forEach((e) => { e.style.opacity = 0; }); [sm, bg].forEach((b2) => { b2.shEl.style.opacity = 0; });
    for (const r of api.rays) { r.style.opacity = 1; await drawIn(r, 700, c); }
    for (const b2 of [sm, bg]) { b2.shEl.style.opacity = 0.55; await drawIn(b2.shEl, 500, c); }
    await api.highlight(c);
  };
  api.highlight = async (c) => { for (const t of api.triangles) { t.style.opacity = 1; if (c && !c.fast) await appear(c, t, 350); } };
  return api;
}

/** Geo.mirror(host, { x, y, width 700, height 360, eye 1.6, d1 2 (person to mirror), d2 10 (mirror to object), h (object
 *  height; default eye × d2 ÷ d1), kind 'flag'|'pole'|'tree'|'building'|'tower'|'elevator', labels: { eye, d1, d2, h },
 *  units 'm', angleLabel '' (both equal angles, e.g. 'θ'), shade true })
 *  Light from the top of the object bounces off a mirror on the ground into the eye: angle in = angle out, so the two right
 *  triangles are similar. → { el, svg, play(c), parts } */
export function mirror(host, o = {}) {
  const W = o.width || 700, Hh = o.height || 360, S = surface(host, o, W, Hh), g = rootG(S, 'geo-mirror');
  const eye = o.eye ?? 1.6, d1 = o.d1 ?? 2, d2 = o.d2 ?? 10, ht = o.h ?? eye * d2 / d1, units = o.units ?? 'm', lb = o.labels || {};
  const L = { sky: grp(g), tri: grp(g), world: grp(g), ray: grp(g), marks: grp(g), labs: grp(g) };
  const F = fitWorld([[-d1 * 0.25 - 0.6, 0], [d1 + d2 * 1.08, 0], [0, eye * 1.1], [d1 + d2, ht * 1.08]], W, Hh, [18, 50, 66, 56]);
  svgEl('rect', { x: 0, y: 0, width: W, height: r2(F.Y(0)), fill: SKY }, L.sky);
  groundLine(L.world, F, -d1 * 0.25 - 0.6, d1 + d2 * 1.08);
  const t1 = path(L.tri, polyD([F.P([0, 0]), F.P([0, eye]), F.P([d1, 0])]), { stroke: 'none', fill: BLUE, fillOpacity: o.shade === false ? 0 : 0.14, cls: '' });
  const t2 = path(L.tri, polyD([F.P([d1, 0]), F.P([d1 + d2, ht]), F.P([d1 + d2, 0])]), { stroke: 'none', fill: BLUE, fillOpacity: o.shade === false ? 0 : 0.14, cls: '' });
  glyph(L.world, F, 'person', 0, eye, { face: 1 });
  glyph(L.world, F, o.kind || 'flag', d1 + d2, ht, { side: -1 });
  const M = F.P([d1, 0]); svgEl('rect', { x: r2(M[0] - 14), y: r2(M[1] - 4), width: 28, height: 6, rx: 2, fill: '#7fb3f0', stroke: BLUE, 'stroke-width': 1.5 }, L.world);
  const E = F.P([0, eye]), T = F.P([d1 + d2, ht]);
  const ray = path(L.ray, `M${pts([T, M, E]).join('L')}`, { stroke: '#e0a100', width: 2.6 });
  arrowHead(L.ray, (T[0] + M[0]) / 2, (T[1] + M[1]) / 2, M[0] - T[0], M[1] - T[1], { color: '#e0a100', width: 2.6 });
  arrowHead(L.ray, (M[0] + E[0]) / 2, (M[1] + E[1]) / 2, E[0] - M[0], E[1] - M[1], { color: '#e0a100', width: 2.6 });
  const aIn = dirTo(M, T), aOut = dirTo(M, E);
  const m1 = angMark(L.marks, M, 0, aIn, { color: GREEN, r: 30, label: o.angleLabel || '', size: 17 }), m2 = angMark(L.marks, M, aOut, 180 - aOut, { color: GREEN, r: 30, label: o.angleLabel || '', size: 17 });
  angMark(L.marks, F.P([0, 0]), 0, 90, { right: true, rs: 11, color: SLATE }); angMark(L.marks, F.P([d1 + d2, 0]), 90, 90, { right: true, rs: 11, color: SLATE });
  const us = (v) => fmtLen(v, 1) + (units ? ' ' + units : '');
  dimLine(L.labs, F, [0, 0], [d1, 0], lb.d1 ?? us(d1), -36); dimLine(L.labs, F, [d1, 0], [d1 + d2, 0], lb.d2 ?? us(d2), -36);
  dimLine(L.labs, F, [0, 0], [0, eye], lb.eye ?? us(eye), 30); dimLine(L.labs, F, [d1 + d2, ht], [d1 + d2, 0], lb.h ?? us(ht), 22);
  text(L.labs, M[0], M[1] + 17, 'mirror', { size: 14, color: BLUE });
  const api = { el: S.own ? S.el : g, svg: S.svg, g, parts: { ray, triangles: [t1, t2], angles: [m1, m2] }, h: ht };
  api.play = async (c) => {
    if (!c || c.fast) return;
    [ray, t1, t2, m1.mark, m2.mark, m1.label, m2.label].forEach((e) => e && (e.style.opacity = 0));
    ray.style.opacity = 1; await drawIn(ray, 1100, c);
    for (const m of [m1, m2]) { m.mark.style.opacity = 1; await drawIn(m.mark, 350, c); if (m.label) await pop(c, m.label, 280); }
    await Promise.all([appear(c, t1, 400), appear(c, t2, 400)]);
  };
  return api;
}

export const Geo = { protractor, angle, transversal, compassRose, construct, tangram, pentomino,
  similar, gridDraw, scaleBar, mapTape, parseScale, rightTri, pythagProof, similarRights, elevation, clinometer, shadow, mirror,
  similarOnGrid, rightSides, rolesFor, ROLE_COLORS, MATCH_COLORS, SHAPES, fmtLen,
  PAIRS, PAIR_NAMES, PAIR_SHAPES, PAIR_COLORS, pairName, TANGRAM, PENTOMINOES,
  at, dirTo, dist, n360, n180, arcD, wedgeD, svgPoint, text, dot, ray, bearingText };
if (typeof window !== 'undefined') window.Geo = Geo;
export default Geo;
