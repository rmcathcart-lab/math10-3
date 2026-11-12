/* Geometry toolkit for the Unit 5 teaching pages (angles, parallel lines, bearings, constructions, spatial puzzles).
 * Reference: lessons/BLOCKS.md ("Geometry toolkit"). Demo / test bed: lessons/dev/geo.html (js/dev/geo-demo.js).
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

export const Geo = { protractor, angle, transversal, compassRose, construct, tangram, pentomino,
  PAIRS, PAIR_NAMES, PAIR_SHAPES, PAIR_COLORS, pairName, TANGRAM, PENTOMINOES,
  at, dirTo, dist, n360, n180, arcD, wedgeD, svgPoint, text, dot, ray, bearingText };
if (typeof window !== 'undefined') window.Geo = Geo;
export default Geo;
