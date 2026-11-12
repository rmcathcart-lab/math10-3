/* Math 10-3 · Unit 6 · Lesson 4 — Scale Diagrams: Maps and Floor Plans.
 * Explainers (Class view unless marked Full): a scale three ways (a room shrinking to a plan, and a unit-changing machine
 * for Example 1), zooming a phone map (Example 2 c: the bar survives, the printed ratio doesn't), real lengths on the
 * apartment plan (Example 3 checks), proportion vs multiply (Full), why areas grow by 1.5 × 1.5 (Full), multiply or
 * divide? with a size meter and two lamps (Example 4 checks), real → drawing lengths (Examples 5 and 6 checks), choosing
 * a scale so the rink fits (Example 7), a floor plan drawn at three scales (Example 8), and routes on the town map with a
 * string for curved trails (Example 9 checks). Also the town map with a draggable measuring tape (Geo.mapTape), the
 * static figures and the Stand Up Break. */
import { h, add, tex, svgEl, tween, anim, drawIn, stamp, stampIn, pulse, mountExplainers, fmt } from '../blocks.js';
import { Geo } from '../geo.js';
import { standup } from '../standup.js';

const INK = '#1c2230', BLUE = '#1f5bd6', GREEN = '#12805a', RED = '#c93a33', AMBER = '#c27a0e', BROWN = '#9a6a24', GREY = '#9aa0ab', SLATE = '#4b5263';
const T = (s) => tex(String(s));
/** a number trimmed to d decimals: 9.2000 → "9.2" */
const n1 = (v, d = 3) => String(parseFloat(Number(v).toFixed(d)));
/** a number for TeX with a thin thousands space: 300000 → 300\,000 */
const tn = (v) => { const [i, d] = n1(v).split('.'); const g = i.length >= 4 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : i; return d ? g + '.' + d : g; };
/** plain text with a narrow no-break thousands space */
const pn = (v) => { const [i, d] = n1(v).split('.'); const g = i.length >= 4 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : i; return d ? g + '.' + d : g; };
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const op = (c, el, to, ms = 350) => anim(c, el, [{ opacity: to }], ms);
const stageSvg = (stage, W, H) => add(stage, svgEl('svg', { class: 'u6l4-svg', width: W, height: H, viewBox: `0 0 ${W} ${H}` }), 0, 0);
const figSvg = (host, W, H) => { host.style.width = W + 'px'; host.style.height = H + 'px'; return svgEl('svg', { class: 'geo-svg u6l4-svg', width: W, height: H, viewBox: `0 0 ${W} ${H}` }, host); };
/** an HTML label centred on (x, y) in a 0×0 holder (so c.pop's scale doesn't undo the centring); left: true = starts at x */
function lab(host, html, x, y, cls = '', left = false) {
  const hold = h('div', 'u6l4-hold' + (left ? ' u6l4-left' : '')); hold.appendChild(h('div', 'u6l4-lab ' + cls, html)); add(host, hold, x, y); hold.inner = hold.firstChild; return hold;
}
const set = (el, html) => { (el.inner || el).innerHTML = html; };
function line(parent, P, Q, o = {}) {
  return svgEl('line', { x1: P[0].toFixed(2), y1: P[1].toFixed(2), x2: Q[0].toFixed(2), y2: Q[1].toFixed(2), stroke: o.color || INK, 'stroke-width': o.width || 3, 'stroke-linecap': o.cap || 'round', 'stroke-dasharray': o.dash || null, class: o.cls === undefined ? 'bk-stroke' : o.cls, opacity: o.opacity ?? null }, parent);
}
function path(parent, d, o = {}) {
  return svgEl('path', { d, fill: o.fill || 'none', 'fill-opacity': o.fo ?? null, stroke: o.stroke === undefined ? INK : o.stroke, 'stroke-width': o.width || 3, 'stroke-linecap': o.cap || 'round', 'stroke-linejoin': 'round', 'stroke-dasharray': o.dash || null, class: o.cls === undefined ? 'bk-stroke' : o.cls, opacity: o.opacity ?? null }, parent);
}
const rect = (parent, x, y, w, hh, o = {}) => svgEl('rect', { x: x.toFixed(2), y: y.toFixed(2), width: Math.max(0, w).toFixed(2), height: Math.max(0, hh).toFixed(2), rx: o.rx ?? 0, fill: o.fill || 'none', 'fill-opacity': o.fo ?? null, stroke: o.stroke === undefined ? INK : o.stroke, 'stroke-width': o.width ?? 3, 'stroke-dasharray': o.dash || null, class: o.cls === undefined ? 'bk-stroke' : o.cls, opacity: o.opacity ?? null }, parent);
const polyD = (pts, closed = true) => 'M' + pts.map((p) => p[0].toFixed(2) + ' ' + p[1].toFixed(2)).join('L') + (closed ? 'Z' : '');
const txt = (parent, x, y, s, o = {}) => Geo.text(parent, x, y, s, Object.assign({ size: 20 }, o));
const dot = (parent, p, o = {}) => Geo.dot(parent, p, o);
/** a <g> moved with its transform attribute (blocks.css centres CSS transforms on g: turn that off) */
function tg(parent, cls) { const g = svgEl('g', cls ? { class: cls } : {}, parent); g.style.transformBox = 'view-box'; g.style.transformOrigin = '0 0'; return g; }
let UID = 0;

/* ---------- floor-plan symbols (plan coords: F.P maps [x, y] (y up) to px, F.s = px per unit) ---------- */
function planDoor(g, F, hinge, ang, w, swing = 1, o = {}) {
  const c = Math.cos(ang * Math.PI / 180), s = Math.sin(ang * Math.PI / 180);
  const L = (u, v) => F.P([hinge[0] + u * c - v * s, hinge[1] + u * s + v * c]);
  const t = ((o.wall || 5) / 2 + 1.5) / F.s;
  const gap = path(g, polyD([L(0, -t), L(w, -t), L(w, t), L(0, t)]), { fill: '#fff', stroke: 'none', cls: '' });
  const leaf = line(g, L(0, 0), L(0, swing * w), { width: o.leaf || 2.4, color: o.color || INK, cls: '' });
  const A = L(w, 0), B = L(0, swing * w), r = w * F.s;
  const arc = path(g, `M${A[0].toFixed(2)} ${A[1].toFixed(2)}A${r.toFixed(2)} ${r.toFixed(2)} 0 0 ${swing > 0 ? 0 : 1} ${B[0].toFixed(2)} ${B[1].toFixed(2)}`, { width: o.arc || 1.4, stroke: o.color || INK, cls: o.cls ?? '' });
  return { gap, leaf, arc };
}
function planWin(g, F, p1, p2, o = {}) {
  const A = F.P(p1), B = F.P(p2), w = o.wall || 5;
  const gg = svgEl('g', {}, g);
  line(gg, A, B, { color: '#fff', width: w + 2, cap: 'butt', cls: '' });
  line(gg, A, B, { color: o.color || INK, width: w, cap: 'butt', cls: '' });
  line(gg, A, B, { color: '#fff', width: Math.max(1.4, w - 3.2), cap: 'butt', cls: '' });
  return gg;
}
/** Example 3's apartment (plan cm, 7 by 5.2): walls, doors, windows; labels: 'full' (names + sizes) | 'names' | false */
const ROOMS = {
  living: { name: 'living room', box: [0, 0, 4.2, 3], dims: [4.2, 3], hz: 'b', vt: 'l', at: [2.1, 1.5] },
  kitchen: { name: 'kitchen', box: [0, 3, 4.2, 5.2], dims: [4.2, 2.2], hz: 't', vt: 'l', at: [2.1, 4.1] },
  bedroom: { name: 'bedroom', box: [4.2, 1.6, 7, 5.2], dims: [2.8, 3.6], hz: 't', vt: 'r', at: [5.6, 3.4] },
  bathroom: { name: 'bathroom', box: [4.2, 0, 7, 1.6], dims: [2.8, 1.6], hz: 'b', vt: 'r', at: [5.6, 0.8] },
  whole: { name: 'whole apartment', box: [0, 0, 7, 5.2], dims: [7, 5.2], hz: 'b', vt: 'r', at: [3.5, 2.6] }
};
function drawApt(g, F, labels = 'full') {
  const W1 = Math.max(4, F.s * 0.085), W2 = Math.max(2.2, F.s * 0.045);
  const [x0, y0] = F.P([0, 5.2]), [x1, y1] = F.P([7, 0]);
  rect(g, x0, y0, x1 - x0, y1 - y0, { fill: '#fffdf8', stroke: 'none', cls: '' });
  path(g, polyD([F.P([0, 3]), F.P([4.2, 3])], false) + polyD([F.P([4.2, 0]), F.P([4.2, 5.2])], false) + polyD([F.P([4.2, 1.6]), F.P([7, 1.6])], false), { width: W2, cls: '', cap: 'butt' });
  rect(g, x0, y0, x1 - x0, y1 - y0, { width: W1, cls: '' });
  planDoor(g, F, [2.6, 0], 0, 0.6, 1, { wall: W1 });
  planDoor(g, F, [4.2, 3.6], 90, 0.5, -1, { wall: W2 });
  planDoor(g, F, [4.2, 0.4], 90, 0.5, 1, { wall: W2 });
  planWin(g, F, [0, 1], [0, 2.2], { wall: W1 }); planWin(g, F, [5, 5.2], [6.4, 5.2], { wall: W1 });
  if (!labels) return;
  const fz = labels === 'full' ? 16 : 15;
  const put = (at, s, dy, o = {}) => { const p = F.P(at); txt(g, p[0], p[1] + dy, s, Object.assign({ size: fz, halo: 4 }, o)); };
  if (labels === 'full') {
    put([2.1, 1.5], 'Living room', -11, { weight: 700 }); put([2.1, 1.5], '4.2 cm × 3 cm', 11);
    put([2.1, 4.1], 'Kitchen', -11, { weight: 700 }); put([2.1, 4.1], '4.2 cm × 2.2 cm', 11);
    put([5.6, 3.4], 'Bedroom', -20, { weight: 700 }); put([5.6, 3.4], '2.8 cm', 2); put([5.6, 3.4], '× 3.6 cm', 22);
    put([5.6, 0.75], 'Bathroom', -11, { weight: 700 }); put([5.6, 0.75], '2.8 cm × 1.6 cm', 10, { size: 15 });
  } else {
    put([2.1, 1.5], 'Living room', 0); put([2.1, 4.1], 'Kitchen', 0); put([5.6, 3.4], 'Bedroom', 0); put([5.6, 0.8], 'Bathroom', 0);
  }
}
/** the town map of Example 9 (booklet cm, y up; home at the origin) */
function drawTown(g, F, o = {}) {
  const P = F.P, s = F.s;
  const cr = [[-0.6, 3.8], [2, 3.4], [4.5, 4.4], [7.2, 3.7], [7.2, 4.2], [4.5, 4.9], [2, 3.9], [-0.6, 4.3]].map(P);
  path(g, `M${cr[0]}C${cr[1]} ${cr[2]} ${cr[3]}L${cr[4]}C${cr[5]} ${cr[6]} ${cr[7]}Z`, { fill: '#d4e5f7', stroke: '#9cc0e6', width: 1.5, cls: '' });
  txt(g, ...P([1.1, 4.2]), 'Bow Creek', { size: 14, color: '#2b5f96', halo: 3 });
  const rw = Math.max(7, s * 0.17);
  [0, 1.5, 3].forEach((y) => line(g, P([-0.6, y]), P([7.2, y]), { color: '#d6d0c2', width: rw, cap: 'butt', cls: '' }));
  [0, 2, 4, 6].forEach((x) => line(g, P([x, -0.5]), P([x, 3.5]), { color: '#d6d0c2', width: rw, cap: 'butt', cls: '' }));
  [[0, '1 Ave'], [1.5, '2 Ave'], [3, '3 Ave']].forEach(([y, t]) => txt(g, ...P([7.75, y]), t, { size: 13, color: '#6a6455', halo: false }));
  [[0, '1 St'], [2, '2 St'], [4, '3 St'], [6, '4 St']].forEach(([x, t]) => txt(g, ...P([x, -0.82]), t, { size: 13, color: '#6a6455', halo: false }));
  const n0 = P([-1.2, 1.6]), n1p = P([-1.2, 2.4]);
  line(g, n0, n1p, { width: 2.4, cls: '' }); path(g, `M${n1p[0] - 6} ${n1p[1] + 10}L${n1p[0]} ${n1p[1]}L${n1p[0] + 6} ${n1p[1] + 10}`, { width: 2.4, cls: '' });
  txt(g, n1p[0], n1p[1] - 13, 'N', { size: 16, weight: 800 });
  if (o.bar !== false) { const b = P([1, -1.24]); Geo.scaleBar(g, { x: b[0] - 18, y: b[1] - 12, scale: '1 cm : 200 m', segments: 4, cmPx: s, title: false, size: 14 }); }
  if (o.places) {
    [[[0, 0], 'Home', -34, 18], [[4, 3], 'School', -38, -18], [[6, 1.5], 'Rink', 30, -18]].forEach(([p, t, dx, dy]) => { const q = P(p); dot(g, q, { r: 6.5, color: RED }); txt(g, q[0] + dx, q[1] + dy, t, { size: 16, weight: 700 }); });
  }
}
/** a hockey rink, L by W px, top-left (x, y) */
function rink(g, x, y, L, W, o = {}) {
  const gg = svgEl('g', {}, g), r = Math.min(W / 2, L * 8.5 / 61), col = o.color || INK;
  rect(gg, x, y, L, W, { rx: r, fill: o.fill || '#fff', stroke: col, width: o.width || 2.6, cls: '' });
  line(gg, [x + L / 2, y], [x + L / 2, y + W], { color: '#d23a2e', width: 2, cls: '' });
  [0.375, 0.625].forEach((f) => line(gg, [x + L * f, y], [x + L * f, y + W], { color: '#2d62c9', width: 2, cls: '' }));
  [3.35 / 61, 1 - 3.35 / 61].forEach((f) => line(gg, [x + L * f, y + 2], [x + L * f, y + W - 2], { color: '#d23a2e', width: 1, cls: '' }));
  svgEl('circle', { cx: x + L / 2, cy: y + W / 2, r: Math.max(2, L * 4.57 / 61), fill: 'none', stroke: '#2d62c9', 'stroke-width': 1.3 }, gg);
  return gg;
}
/** a little gear for the unit machine */
function gear(parent, cx, cy, r, teeth = 8, color = BROWN) {
  const g = tg(parent), pts = [];
  for (let i = 0; i < teeth * 2; i++) { const a = (i / (teeth * 2)) * Math.PI * 2, rr = i % 2 ? r : r * 1.25; pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)]); }
  path(g, polyD(pts), { fill: '#f1dfbd', stroke: color, width: 2.4, cls: '' });
  svgEl('circle', { cx, cy, r: r * 0.35, fill: '#fff', stroke: color, 'stroke-width': 2.4 }, g);
  g.spin = (a) => g.setAttribute('transform', `rotate(${a.toFixed(1)} ${cx} ${cy})`);
  return g;
}
/** a cm ruler: x0 = the 0 mark, y = the top edge, n cm at px per cm */
function ruler(parent, x0, y, n, px, o = {}) {
  const g = svgEl('g', {}, parent), H = o.h || 34;
  rect(g, x0 - 10, y, n * px + 20, H, { rx: 4, fill: '#fbe9a6', stroke: '#9b7d1d', width: 1.6, cls: '' });
  let d = '';
  for (let i = 0; i <= n * 10; i++) { const x = x0 + i * px / 10, L = i % 10 === 0 ? 14 : i % 5 === 0 ? 9 : 5; if (px / 10 >= 2.5 || i % 5 === 0) d += `M${x.toFixed(2)} ${y}V${y + L}`; }
  path(g, d, { stroke: '#5a4508', width: 1.2, cls: '' });
  for (let i = 0; i <= n; i += o.every || 1) txt(g, x0 + i * px, y + 24, String(i), { size: 13, halo: false, color: '#5a4508' });
  if (o.unit !== false) txt(g, x0 + n * px + (o.unitDx || 0) - 2, y + H - 6, 'cm', { size: 11, halo: false, color: '#5a4508', anchor: 'end' });
  return g;
}

/* ======================================================================================
 * 1. A scale three ways (concept) and the unit machine (Example 1 checks)
 * ====================================================================================== */
const NB = ' ';
const EX1 = {
  a: { kind: 'w2r', d: '1 cm', r: '5 m', side: 'r', tok: ['5 m', '500 cm'], op: '× 100', conv: '5\\text{ m}=5\\times100=500\\text{ cm}', unit: 'cm', ratio: '1:500', red: true },
  b: { kind: 'w2r', d: '1 cm', r: '3 km', side: 'r', tok: ['3 km', `300${NB}000 cm`], op: `× 100${NB}000`, conv: '3\\text{ km}=3\\times100\\,000=300\\,000\\text{ cm}', unit: 'cm', ratio: '1:300\\,000', red: true },
  c: { kind: 'w2r', d: '1 in', r: '8 ft', side: 'r', tok: ['8 ft', '96 in'], op: '× 12', conv: '8\\text{ ft}=8\\times12=96\\text{ in}', unit: 'inches', ratio: '1:96', red: true },
  d: { kind: 'w2r', d: '2 cm', r: '1 mm', side: 'd', tok: ['2 cm', '20 mm'], op: '× 10', conv: '2\\text{ cm}=2\\times10=20\\text{ mm}', unit: 'mm', ratio: '20:1', red: false },
  e: { kind: 'r2w', ratio: '1:250', n: '250', tok: ['250 cm', '2.5 m'], op: '÷ 100', conv: '250\\div100=2.5\\text{ m}', words: '1 cm represents 2.5 m', red: true },
  f: { kind: 'r2w', ratio: '1:40\\,000', n: `40${NB}000`, tok: [`40${NB}000 cm`, '400 m'], op: '÷ 100', conv: '40\\,000\\div100=400\\text{ m}', words: '1 cm represents 400 m', red: true }
};
const EX1_ASK = { a: '1 cm represents 5 m', b: '1 cm represents 3 km', c: '1 in represents 8 ft', d: '2 cm represents 1 mm' };
const ways = {
  title: 'One scale, three ways',
  height: 390,
  choices: [{ v: 'room', label: 'a room → a plan' }, { sep: 'Example 1 check:' }, ...'abcdef'.split('').map((k) => ({ v: k, label: `(${k})` }))],
  ask: (v) => (v === 'room' ? 'A bedroom is 8 m long and 5 m wide. On its plan, 1 cm represents 2 m. Write the scale three ways.'
    : EX1[v].kind === 'w2r' ? `Example 1 (${v}): write “${EX1_ASK[v]}” as a ratio. Reduction or enlargement?`
      : `Example 1 (${v}): write the ratio scale ${T(EX1[v].ratio)} in words. Reduction or enlargement?`),
  make(stage, v, ex) {
    const W = ex.W, H = 390, ox = (W - 960) / 2, svg = stageSvg(stage, W, H);
    if (v === 'room') return roomSteps(stage, svg, ox);
    const e = EX1[v], L = [ox + 150, 150], M = [ox + 480, 150], R = [ox + 810, 150];
    // the machine
    rect(svg, M[0] - 120, M[1] - 70, 240, 140, { rx: 18, fill: '#fbf3e3', stroke: BROWN, width: 3, cls: '' });
    txt(svg, M[0], M[1] - 88, 'unit changer', { size: 15, color: SLATE, weight: 700 });
    const g1 = gear(svg, M[0] - 70, M[1] + 34, 18), g2 = gear(svg, M[0] + 70, M[1] + 34, 18);
    path(svg, `M${M[0] - 150} ${M[1]}h28M${M[0] + 122} ${M[1]}h28`, { width: 3, stroke: BROWN, cls: '' });
    const opl = hide(lab(stage, e.op, M[0], M[1] - 22, 'u6l4-big'));
    const left = e.kind === 'w2r'
      ? hide(lab(stage, `<span class="u6l4-k">In words</span><span class="u6l4-d">${e.d}</span> represents <span class="u6l4-r">${e.r}</span>`, L[0], L[1] - 40, 'u6l4-card'))
      : hide(lab(stage, `<span class="u6l4-k">As a ratio</span><span class="u6l4-big">${T(e.ratio)}</span>`, L[0], L[1] - 40, 'u6l4-card'));
    const right = e.kind === 'w2r'
      ? hide(lab(stage, `<span class="u6l4-k">As a ratio</span><span class="u6l4-big">${T(e.ratio)}</span>`, R[0], R[1] - 40, 'u6l4-card'))
      : hide(lab(stage, `<span class="u6l4-k">In words</span>${e.words}${v === 'f' ? '<br><span class="u6l4-small muted">(or 0.4 km)</span>' : ''}`, R[0], R[1] - 40, 'u6l4-card'));
    const tokCls = e.kind === 'w2r' && e.side === 'd' ? 'u6l4-tok u6l4-d' : 'u6l4-tok u6l4-r';
    const tok = hide(lab(stage, e.tok[0], L[0], L[1] + 46, tokCls));
    const st = hide(stamp(stage, e.red ? 'reduction' : 'enlargement', { ok: e.red ? true : null, x: M[0], y: 318, size: 'lg' }));
    const why = hide(lab(stage, e.red ? 'the real thing is bigger' : 'the drawing is bigger', M[0], 368, 'u6l4-small'));
    const machine = async (c) => {
      await c.anim(tok, [{ left: L[0] + 'px', top: (L[1] + 46) + 'px' }, { left: M[0] + 'px', top: M[1] + 'px' }], 700);
      opl.style.opacity = 1; await c.pop(opl);
      await tween(c, 1000, (u) => { g1.spin(u * 360); g2.spin(-u * 360); });
      set(tok, e.tok[1]); await pulse(c, tok, 1.2, 360);
      await c.anim(tok, [{ left: M[0] + 'px', top: M[1] + 'px' }, { left: R[0] + 'px', top: (R[1] + 46) + 'px' }], 700);
    };
    const verdict = { cap: e.red ? 'The real thing is <b>bigger</b> than the drawing, so the scale is a <b>reduction</b>.' : 'The drawing is <b>bigger</b> than the real object, so the scale is an <b>enlargement</b>.',
      run: async (c) => { st.style.opacity = 1; await stampIn(c, st); why.style.opacity = 1; await c.pop(why); } };
    if (e.kind === 'w2r') {
      return [
        { cap: `In words: <b>${e.d}</b> on the drawing represents <b>${e.r}</b> in real life. The units are <b>different</b>.`, run: async (c) => { left.style.opacity = 1; await c.pop(left); tok.style.opacity = 1; await c.pop(tok); } },
        { cap: `Change the ${e.side === 'd' ? 'drawing' : 'real'} length to ${e.unit === 'inches' ? 'inches' : e.unit}: ${T(e.conv)}.`, run: machine },
        { cap: `Now both are in ${e.unit}. Write <b>drawing : real</b>, with no units: ${T(e.ratio)}.`, run: async (c) => { right.style.opacity = 1; await c.pop(right); await op(c, tok, 0.35); } },
        verdict
      ];
    }
    return [
      { cap: `${T(e.ratio)} means <b>1 cm</b> represents <b>${e.n} cm</b>.`, run: async (c) => { left.style.opacity = 1; await c.pop(left); tok.style.opacity = 1; await c.pop(tok); } },
      { cap: `${e.n} cm is hard to picture. Change it to metres: ${T(e.conv)}.`, run: machine },
      { cap: `In words: <b>${e.words}</b>.`, run: async (c) => { right.style.opacity = 1; await c.pop(right); await op(c, tok, 0.35); } },
      verdict
    ];
  }
};
function roomSteps(stage, svg, ox) {
  const X0 = ox + 64, Y0 = 62, S = 48;                 // the real room: 50 px per m
  const PX = ox + 500, PY = 96, PS = 20 / 48;              // the plan: 20 px per m = 1 cm (40 px) per 2 m
  const drawRoom = (g) => {
    rect(g, 0, 0, 8 * S, 5 * S, { fill: '#fbf6ec', width: 6, cls: '' });
    rect(g, 8 * S - 2 * S - 12, 12, 2 * S, 1.5 * S, { fill: '#dfe9f8', stroke: SLATE, width: 2.5, cls: '' });
    txt(g, 8 * S - S - 12, 12 + 0.75 * S, 'bed', { size: 18, color: SLATE });
    rect(g, 1.2 * S, 5 * S - 3, 0.9 * S, 6, { fill: '#fff', stroke: 'none', cls: '' });
  };
  const real = tg(svg); real.setAttribute('transform', `translate(${X0} ${Y0})`); drawRoom(real); hide(real);
  const rl = hide(txt(svg, X0 + 4 * S, Y0 + 5 * S + 24, '8 m', { size: 22, color: RED, weight: 800 }));
  const rw = hide(txt(svg, X0 - 8, Y0 + 2.5 * S, '5 m', { size: 22, color: RED, weight: 800, anchor: 'end' }));
  const rt = hide(txt(svg, X0 + 4 * S, Y0 - 16, 'the real room', { size: 17, color: SLATE }));
  const plan = tg(svg); drawRoom(plan); hide(plan);
  const place = (u) => { const sc = 1 + (PS - 1) * u; plan.setAttribute('transform', `translate(${X0 + (PX - X0) * u} ${Y0 + (PY - Y0) * u}) scale(${sc})`); };
  place(0);
  const pl = hide(txt(svg, PX + 80, PY + 5 * S * PS + 20, '4 cm', { size: 21, color: BLUE, weight: 800 }));
  const pt = hide(txt(svg, PX + 80, PY - 16, 'the plan', { size: 17, color: SLATE }));
  const bar = Geo.scaleBar(svg, { x: PX - 18, y: PY + 150, scale: '1 cm : 2 m', segments: 4, cmPx: 40, title: false, size: 15 });
  hide(bar.g);
  const cx = ox + 820;
  const c1 = hide(lab(stage, '<span class="u6l4-k">In words</span>1 cm represents 2 m', cx, 100, 'u6l4-card'));
  const c2 = hide(lab(stage, `<span class="u6l4-k">As a ratio</span>${T('2\\text{ m}=200\\text{ cm}')}<br><span class="u6l4-big">${T('1:200')}</span>`, cx, 205, 'u6l4-card'));
  const c3 = hide(lab(stage, '<span class="u6l4-k">As a bar scale</span>each 1 cm block is 2 m', cx, 312, 'u6l4-card'));
  const st = hide(stamp(stage, 'same scale', { ok: true, x: ox + 570, y: 360, size: 'sm' }));
  return [
    { cap: 'A real bedroom is <b>8 m</b> long and <b>5 m</b> wide.', run: async (c) => { real.style.opacity = 1; await op(c, real, 1, 400); for (const e of [rt, rl, rw]) await op(c, e, 1, 250); } },
    { cap: 'A plan shrinks <b>every</b> length the same way. Here 1 cm represents 2 m, so the 8 m wall is drawn <b>8 ÷ 2 = 4 cm</b> long.',
      run: async (c) => { plan.style.opacity = 1; await tween(c, 1500, (u) => place(u)); await op(c, pt, 1, 250); await op(c, pl, 1, 300); } },
    { cap: '<b>In words:</b> 1 cm represents 2 m.', run: async (c) => { c1.style.opacity = 1; await c.pop(c1); } },
    { cap: `<b>As a ratio:</b> change 2 m to cm first. ${T('2\\text{ m}=200\\text{ cm}')}, so ${T('1:200')}. Both numbers are in cm, so the ratio has <b>no units</b>.`, run: async (c) => { c2.style.opacity = 1; await c.pop(c2); } },
    { cap: '<b>As a bar scale:</b> each 1 cm block stands for 2 m. The plan’s 4 cm wall lines up with 8 m on the bar.',
      run: async (c) => { c3.style.opacity = 1; await c.pop(c3); bar.g.style.opacity = 1; await op(c, bar.g, 1, 500); await pulse(c, pl, 1.25, 500); st.style.opacity = 1; await stampIn(c, st); } }
  ];
}

/* ======================================================================================
 * 2. Zoom in on a phone map (Example 2 c)
 * ====================================================================================== */
const zoom = {
  title: 'Zoom in on a phone map',
  height: 400,
  ask: 'Example 2 (c): Ana zooms in, so everything is twice as long, including the bar. Is the bar scale still right? Is a printed “1 : 5000”?',
  make(stage, v, ex) {
    const W = ex.W, H = 400, ox = (W - 960) / 2, svg = stageSvg(stage, W, H);
    const sx = ox + 60, sy = 62, sw = 320, sh = 318, cmPx = 28, B0 = [sx + 14, sy + 262];
    rect(svg, sx - 20, sy - 50, sw + 40, sh + 66, { rx: 30, fill: '#2a2f3a', stroke: '#141821', width: 3, cls: '' });
    rect(svg, sx, sy - 30, sw, 30, { fill: '#f4f1ea', stroke: 'none', cls: '' });
    const printed = txt(svg, sx + sw / 2, sy - 15, 'Nose Hill Park · Scale 1 : 5000', { size: 15, weight: 700, halo: false });
    const id = 'u6l4-clip' + (++UID), defs = svgEl('defs', {}, svg), cp = svgEl('clipPath', { id }, defs);
    svgEl('rect', { x: sx, y: sy, width: sw, height: sh }, cp);
    const clip = svgEl('g', { 'clip-path': `url(#${id})` }, svg);
    const map = tg(clip);
    rect(map, sx - 400, sy - 400, sw + 800, sh + 800, { fill: '#e2eed0', stroke: 'none', cls: '' });
    svgEl('ellipse', { cx: sx + 112, cy: sy + 178, rx: 40, ry: 22, fill: '#bcd8f2', stroke: '#8fb6de', 'stroke-width': 2 }, map);
    path(map, `M${sx - 10} ${sy + 200}C${sx + 80} ${sy + 150} ${sx + 140} ${sy + 210} ${sx + 200} ${sy + 160}S${sx + 300} ${sy + 60} ${sx + 340} ${sy + 40}`, { stroke: '#c29a5b', width: 5, cls: '' });
    path(map, `M${sx + 60} ${sy - 10}C${sx + 70} ${sy + 60} ${sx + 120} ${sy + 110} ${sx + 110} ${sy + 300}`, { stroke: '#c29a5b', width: 4, cls: '' });
    [[40, 40], [150, 30], [290, 160], [250, 230], [36, 150], [160, 214], [300, 250], [120, 70], [64, 226], [150, 150]].forEach(([x, y]) => svgEl('circle', { cx: sx + x, cy: sy + y, r: 11, fill: '#5e9a4a', stroke: '#3d6e2e', 'stroke-width': 2 }, map));
    txt(map, sx + 112, sy + 178, 'pond', { size: 13, color: '#2b5f96', halo: false });
    const bar = Geo.scaleBar(map, { x: B0[0] - 18, y: B0[1] - 12, scale: '1 cm : 50 m', segments: 4, cmPx, title: false, size: 13 });
    void bar;
    const zoomTo = (k) => map.setAttribute('transform', `translate(${B0[0] * (1 - k)} ${B0[1] * (1 - k)}) scale(${k})`);
    zoomTo(1);
    const rul = hide(ruler(svg, B0[0], B0[1] - 36, 8, cmPx, { h: 32, unit: false }));
    const px = ox + 430;
    const l1 = hide(lab(stage, `Before: 1 block = <b>1 cm</b> → 50 m`, px, 70, 'u6l4-work', true));
    const l2 = hide(lab(stage, `50 m = 5000 cm, so ${T('1:5000')} is right.`, px, 116, 'u6l4-work', true));
    const l3 = hide(lab(stage, `After: 1 block = <b>2 cm</b> → <b>still</b> 50 m`, px, 185, 'u6l4-work', true));
    const s3 = hide(stamp(stage, 'bar still right', { ok: true, x: px + 330, y: 230, size: 'sm' }));
    const l4 = hide(lab(stage, `2 cm → 5000 cm, so 1 cm → 2500 cm.<br>The real scale is ${T('1:2500')}.`, px, 296, 'u6l4-work', true));
    const s4 = hide(stamp(stage, 'printed ratio wrong', { ok: false, x: px + 330, y: 360, size: 'sm' }));
    return [
      { cap: 'Before zooming: one block of the bar is <b>1 cm</b> long and stands for <b>50 m</b>. 50 m = 5000 cm, so the printed scale 1 : 5000 is right.',
        run: async (c) => { rul.style.opacity = 1; await c.anim(rul, [{ opacity: 0, transform: 'translateY(-30px)' }, { opacity: 1, transform: 'none' }], 500); for (const e of [l1, l2]) { e.style.opacity = 1; await c.pop(e); } } },
      { cap: 'Ana zooms in. <b>Everything</b> on the screen doubles, including the bar.', run: async (c) => { await tween(c, 1600, (u) => zoomTo(1 + u)); } },
      { cap: 'Now one block is <b>2 cm</b> long, and it still says 50 m. The bar grew with the map, so it is <b>still right</b>.',
        run: async (c) => { l3.style.opacity = 1; await c.pop(l3); s3.style.opacity = 1; await stampIn(c, s3); } },
      { cap: 'The printed “1 : 5000” did not change. But now 2 cm stands for 5000 cm, so 1 cm stands for 2500 cm. The real scale is <b>1 : 2500</b>: the printed ratio is <b>wrong</b>.',
        run: async (c) => { await pulse(c, printed, 1.15, 500); l4.style.opacity = 1; await c.pop(l4); s4.style.opacity = 1; await stampIn(c, s4); } },
      { cap: 'That is why phone maps use a <b>bar scale</b>: it grows and shrinks with the map.', run: async (c) => { await tween(c, 900, (u) => zoomTo(2 - u)); await tween(c, 900, (u) => zoomTo(1 + u)); } }
    ];
  }
};

/* ======================================================================================
 * 3. Real lengths on the apartment plan (Example 3 checks)
 * ====================================================================================== */
const realLen = {
  title: 'From the plan to the real room',
  height: 430,
  choices: [{ sep: 'Example 3 check:' }, { v: 'living', label: '(a) living room' }, { v: 'kitchen', label: 'kitchen' }, { v: 'bedroom', label: 'bedroom' }, { v: 'bathroom', label: 'bathroom' }, { v: 'whole', label: 'whole apartment' }],
  ask: (v) => `Example 3: 1 cm represents 1.5 m. On the plan the ${ROOMS[v].name} is ${ROOMS[v].dims[0]} cm by ${ROOMS[v].dims[1]} cm. Find its real length and width.`,
  make(stage, v, ex) {
    const W = ex.W, H = 430, ox = (W - 960) / 2, svg = stageSvg(stage, W, H), s = 56, X0 = ox + 74, Y0 = 66 + 5.2 * s;
    const F = { s, P: ([x, y]) => [X0 + x * s, Y0 - y * s] };
    const R = ROOMS[v], [a, b] = R.dims, ra = a * 1.5, rb = b * 1.5, [bx0, by0, bx1, by1] = R.box;
    drawApt(svg, F, 'names');
    const hl = hide(rect(svg, X0 + bx0 * s, Y0 - by1 * s, (bx1 - bx0) * s, (by1 - by0) * s, { fill: AMBER, fo: 0.2, stroke: 'none', cls: '' }));
    const top = R.hz === 't', ey = top ? Y0 - by1 * s : Y0 - by0 * s, sgn = top ? -1 : 1;
    const ex0 = vlx(R), tags = [];
    function vlx(r) { return r.vt === 'l' ? X0 + r.box[0] * s : X0 + r.box[2] * s; }
    const hz = hide(lab(stage, `${a} cm`, X0 + (bx0 + bx1) / 2 * s, ey + sgn * 46, 'u6l4-tag u6l4-d'));
    const vt = hide(lab(stage, `${b} cm`, ex0 + (R.vt === 'l' ? -38 : 42), Y0 - (by0 + by1) / 2 * s, 'u6l4-tag u6l4-d'));
    // 1 cm pieces along the horizontal side, each "1.5 m"
    const pieces = svgEl('g', {}, svg);
    for (let i = 0; i < Math.floor(a + 1e-9); i++) {
      const x = X0 + (bx0 + i) * s;
      const g = svgEl('g', {}, pieces); hide(g); tags.push(g);
      line(g, [x, ey + sgn * 6], [x, ey + sgn * 26], { width: 1.6, color: BROWN, cls: '' }); line(g, [x + s, ey + sgn * 6], [x + s, ey + sgn * 26], { width: 1.6, color: BROWN, cls: '' });
      txt(g, x + s / 2, ey + sgn * 17, '1.5', { size: 14, color: RED, weight: 700 });
    }
    const nFull = Math.floor(a + 1e-9), cs = Array.from({ length: Math.min(nFull, 4) }, (_, i) => n1(1.5 * (i + 1)));
    const count = cs.join(', ') + (nFull > 4 ? ', …' : a > nFull + 1e-9 ? ', and a bit more.' : '.');
    const px = ox + 540;
    const w1 = hide(lab(stage, v === 'living' ? `${T('\\dfrac{1}{1.5}=\\dfrac{4.2}{x}')}, &nbsp;so ${T('x=1.5\\times4.2=6.3')}` : `${T(`${a}\\times1.5=${tn(ra)}`)}`, px, 150, 'u6l4-work', true));
    const w2 = hide(lab(stage, v === 'living' ? `${T('\\dfrac{1}{1.5}=\\dfrac{3}{y}')}, &nbsp;so ${T('y=1.5\\times3=4.5')}` : `${T(`${b}\\times1.5=${tn(rb)}`)}`, px, 230, 'u6l4-work', true));
    const res = hide(lab(stage, `The real ${R.name}:<br><b>${n1(ra)} m by ${n1(rb)} m</b>`, px + 180, 318, 'u6l4-res'));
    const key = hide(lab(stage, '<span class="u6l4-d">1 cm</span> on the plan → <span class="u6l4-r">1.5 m</span> real', px, 80, 'u6l4-work', true));
    return [
      { cap: `On the plan the ${R.name} is <b>${a} cm</b> by <b>${b} cm</b>.`, run: async (c) => { hl.style.opacity = 1; await op(c, hl, 1, 300); for (const e of [hz, vt]) { e.style.opacity = 1; await c.pop(e); } } },
      { cap: `Each <b>1 cm</b> of plan stands for <b>1.5 m</b> of real room. Count along the ${a} cm side: ${count}`,
        run: async (c) => { key.style.opacity = 1; await c.pop(key); for (const g of tags) { await op(c, g, 1, 220); } } },
      { cap: v === 'living' ? `Length with a proportion: ${T('\\dfrac{1}{1.5}=\\dfrac{4.2}{x}')}, so ${T('x=1.5\\times4.2=6.3')} m.` : `Length: multiply by 1.5. ${T(`${a}\\times1.5=${tn(ra)}`)} m.`,
        run: async (c) => { w1.style.opacity = 1; await c.pop(w1); set(hz, `${n1(ra)} m`); hz.inner.classList.replace('u6l4-d', 'u6l4-r'); await pulse(c, hz, 1.3, 450); } },
      { cap: v === 'living' ? `Width the same way: ${T('\\dfrac{1}{1.5}=\\dfrac{3}{y}')}, so ${T('y=4.5')} m.` : `Width: ${T(`${b}\\times1.5=${tn(rb)}`)} m.`,
        run: async (c) => { w2.style.opacity = 1; await c.pop(w2); set(vt, `${n1(rb)} m`); vt.inner.classList.replace('u6l4-d', 'u6l4-r'); await pulse(c, vt, 1.3, 450); } },
      { cap: `The real ${R.name} is <b>${n1(ra)} m by ${n1(rb)} m</b>. Each real length is bigger than its plan length. ✓`, run: async (c) => { res.style.opacity = 1; await c.pop(res); } }
    ];
  }
};

/* ======================================================================================
 * 4. (Full) Two methods, one answer
 * ====================================================================================== */
const TWO = {
  ex3a: { ask: 'Example 3 (a): on a plan where 1 cm represents 1.5 m, the living room is 4.2 cm long. How long is it really?',
    m1: ['\\dfrac{\\text{plan (cm)}}{\\text{real (m)}}:\\ \\dfrac{1}{1.5}=\\dfrac{4.2}{x}', 'x=1.5\\times4.2', 'x=6.3\\text{ m}'],
    m2: ['\\text{1 cm represents 1.5 m}', '4.2\\times1.5', '=6.3\\text{ m}'], ans: '6.3 m', what: 'plan length', by: '1.5' },
  ex4b: { ask: 'Example 4 (b): a 1 : 64 model car is 7.5 cm long. How long is the real car?',
    m1: ['\\dfrac{\\text{model}}{\\text{real}}:\\ \\dfrac{1}{64}=\\dfrac{7.5}{x}', 'x=64\\times7.5=480\\text{ cm}', '480\\div100=4.8\\text{ m}'],
    m2: ['\\text{1 cm represents 64 cm}', '7.5\\times64=480\\text{ cm}', '=4.8\\text{ m}'], ans: '4.8 m', what: 'model length', by: '64' }
};
const twoWays = {
  title: 'Proportion or multiply?',
  height: 380,
  choices: [{ v: 'ex3a', label: 'Example 3 (a)' }, { v: 'ex4b', label: 'Example 4 (b)' }],
  ask: (v) => TWO[v].ask,
  make(stage, v, ex) {
    const W = ex.W, H = 380, ox = (W - 960) / 2, svg = stageSvg(stage, W, H), e = TWO[v];
    line(svg, [ox + 480, 30], [ox + 480, 270], { width: 2, color: '#d8cfbd', cls: '' });
    const h1 = hide(lab(stage, '<b>Method 1: proportion</b>', ox + 240, 40, 'u6l4-tag')), h2 = hide(lab(stage, '<b>Method 2: multiply</b>', ox + 720, 40, 'u6l4-tag'));
    const L1 = e.m1.map((s, i) => hide(lab(stage, T(s), ox + 240, 104 + i * 64, 'u6l4-work'))), L2 = e.m2.map((s, i) => hide(lab(stage, T(s), ox + 720, 104 + i * 64, 'u6l4-work')));
    const st = hide(stamp(stage, `same answer: ${e.ans}`, { ok: true, x: ox + 480, y: 318 }));
    const show = async (c, els) => { for (const el of els) { el.style.opacity = 1; await c.pop(el); await c.sleep(150); } };
    return [
      { cap: 'Method 1: a <b>proportion</b>. Put the scale on one side and your length on the other: <b>plan on top</b>, <b>real on the bottom</b>, on both sides.', run: (c) => show(c, [h1, L1[0]]) },
      { cap: `To get ${T('x')} alone, multiply the real part of the scale by the ${e.what}.`, run: (c) => show(c, [L1[1], L1[2]]) },
      { cap: `Method 2: <b>multiply</b>. Each 1 cm stands for ${e.by === '64' ? '64 cm' : '1.5 m'}, so multiply the ${e.what} by ${e.by}.`, run: (c) => show(c, [h2, ...L2]) },
      { cap: `Both methods give <b>${e.ans}</b>. Use the one you like best.`, run: async (c) => { st.style.opacity = 1; await stampIn(c, st); } }
    ];
  }
};

/* ======================================================================================
 * 5. (Full) Areas grow by 1.5 × 1.5
 * ====================================================================================== */
const area = {
  title: 'Real area: lengths first',
  height: 400,
  ask: 'Example 3 (c): the living room is 4.2 cm by 3 cm on the plan, and 1 cm represents 1.5 m. Find the real floor area.',
  make(stage, v, ex) {
    const W = ex.W, H = 400, ox = (W - 960) / 2, svg = stageSvg(stage, W, H), s = 60, X0 = ox + 50, Y0 = 70;
    let d = ''; for (let i = 0; i <= 4; i++) d += `M${X0 + i * s} ${Y0}V${Y0 + 3 * s}`; for (let j = 0; j <= 3; j++) d += `M${X0} ${Y0 + j * s}H${X0 + 4.2 * s}`;
    rect(svg, X0, Y0, 4.2 * s, 3 * s, { fill: '#fbf6ec', stroke: 'none', cls: '' });
    path(svg, d, { stroke: '#cfc4ad', width: 1.4, cls: '' });
    rect(svg, X0, Y0, 4.2 * s, 3 * s, { width: 3.5, cls: '' });
    txt(svg, X0 + 2.1 * s, Y0 + 3 * s + 24, '4.2 cm', { size: 19, color: BLUE, weight: 800 }); txt(svg, X0 - 10, Y0 + 1.5 * s, '3 cm', { size: 19, color: BLUE, weight: 800, anchor: 'end' });
    const one = hide(rect(svg, X0, Y0, s, s, { fill: AMBER, fo: 0.35, stroke: AMBER, width: 3, cls: '' }));
    const bx = ox + 420, by = 70, bs = 150;
    const big = hide(svgEl('g', {}, svg));
    rect(big, bx, by, bs, bs, { fill: '#fff4dc', stroke: AMBER, width: 3, cls: '' });
    txt(big, bx + bs / 2, by + bs + 20, '1.5 m', { size: 18, color: RED, weight: 800 }); txt(big, bx + bs + 8, by + bs / 2, '1.5 m', { size: 18, color: RED, weight: 800, anchor: 'start' });
    txt(big, bx + bs / 2, by + bs / 2, '2.25 m²', { size: 24, weight: 800 });
    const link = hide(path(svg, `M${X0 + s} ${Y0}L${bx} ${by}M${X0 + s} ${Y0 + s}L${bx} ${by + bs}`, { width: 1.6, dash: '6 5', stroke: AMBER, cls: '' }));
    const px = ox + 640;
    const a1 = hide(lab(stage, `Plan: ${T('4.2\\times3=12.6\\text{ cm}^2')}`, ox + 50, 330, 'u6l4-work', true));
    const a2 = hide(lab(stage, `${T('12.6\\times1.5=18.9\\text{ m}^2')}`, px, 90, 'u6l4-work u6l4-r', true));
    const s2 = hide(stamp(stage, 'wrong', { ok: false, x: px + 270, y: 92, size: 'sm' }));
    const a3 = hide(lab(stage, `${T('6.3\\times4.5=28.35\\text{ m}^2')}`, px, 200, 'u6l4-work', true));
    const a4 = hide(lab(stage, `Check: ${T('12.6\\times2.25=28.35')}`, px, 260, 'u6l4-work', true));
    const s4 = hide(stamp(stage, 'right', { ok: true, x: px + 210, y: 320, size: 'sm' }));
    return [
      { cap: `On the plan the floor is ${T('4.2\\times3=12.6\\text{ cm}^2')}: about 12.6 little squares, each 1 cm by 1 cm.`, run: async (c) => { a1.style.opacity = 1; await c.pop(a1); } },
      { cap: `Wrong: ${T('12.6\\times1.5=18.9\\text{ m}^2')}. That stretches the floor in only <b>one</b> direction.`, run: async (c) => { a2.style.opacity = 1; await c.pop(a2); s2.style.opacity = 1; await stampIn(c, s2); } },
      { cap: `Each 1 cm square is really <b>1.5 m by 1.5 m</b>, which is ${T('1.5\\times1.5=2.25\\text{ m}^2')}. Areas grow by 2.25, not 1.5.`,
        run: async (c) => { one.style.opacity = 1; await op(c, one, 1, 300); link.style.opacity = 1; await drawIn(link, 500, c); big.style.opacity = 1; await c.anim(big, [{ opacity: 0 }, { opacity: 1 }], 450); } },
      { cap: `Right: change the <b>lengths</b> first. ${T('6.3\\times4.5=28.35\\text{ m}^2')}. Check: ${T('12.6\\times2.25=28.35')}.`,
        run: async (c) => { for (const e of [a3, a4]) { e.style.opacity = 1; await c.pop(e); } s4.style.opacity = 1; await stampIn(c, s4); } }
    ];
  }
};

/* ======================================================================================
 * 6. Multiply or divide? (Example 4 checks)
 * ====================================================================================== */
const MD = {
  a: { ask: 'Example 4 (a): on a 1 : 2 000 000 road map, Lethbridge and Medicine Hat are 7.9 cm apart. How far apart are they really?',
    s1: `${T('1:2\\,000\\,000')}: 1 cm represents 2${NB}000${NB}000 cm. Move the decimal point 5 places left: <b>1 cm represents 20 km</b>.`, chip: '1 cm → 20 km',
    s2: 'A map is a <b>reduction</b>: the real distance is <b>bigger</b>. So <b>multiply</b>.', big: true, d: 7.9, dl: 'map: 7.9 cm', rl: 'real distance', times: '2\u202f000\u202f000',
    s3: `${T('7.9\\times20=158')}. They are about <b>158 km</b> apart.`, w: ['7.9\\times20=158\\text{ km}'], icon: 'map' },
  b: { ask: 'Example 4 (b): a 1 : 64 model car is 7.5 cm long. How long is the real car, in metres?',
    s1: `${T('1:64')}: 1 cm on the model is <b>64 cm</b> on the real car.`, chip: '1 cm → 64 cm',
    s2: 'A model is a <b>reduction</b>: the real car is <b>bigger</b>. So <b>multiply</b>.', big: true, d: 7.5, dl: 'model: 7.5 cm', rl: 'real car', times: '64',
    s3: `${T('7.5\\times64=480')} cm, and ${T('480\\div100=4.8')}. The real car is <b>4.8 m</b> long.`, w: ['7.5\\times64=480\\text{ cm}', '480\\div100=4.8\\text{ m}'], icon: 'car' },
  c: { ask: 'Example 4 (c): a science book shows an ant at 8 : 1. The ant in the picture is 6 cm long. How long is the real ant, in mm?',
    s1: `${T('8:1')}: <b>8 cm</b> in the picture is <b>1 cm</b> of real ant.`, chip: '8 cm → 1 cm',
    s2: 'The picture is an <b>enlargement</b>: the real ant is <b>smaller</b>. So <b>divide</b>.', big: false, d: 6, dl: 'picture: 6 cm', rl: 'real ant', times: '8',
    s3: `${T('6\\div8=0.75')} cm, and ${T('0.75\\times10=7.5')}. The real ant is <b>7.5 mm</b> long.`, w: ['6\\div8=0.75\\text{ cm}', '0.75\\times10=7.5\\text{ mm}'], icon: 'ant' }
};
function icon(g, kind, x, y, k = 1, color = INK) {
  const gg = tg(g); gg.setAttribute('transform', `translate(${x} ${y}) scale(${k})`);
  if (kind === 'map') {
    path(gg, 'M-18 -12L-6 -16L6 -12L18 -16L18 12L6 16L-6 12L-18 16Z', { fill: '#f4ead2', stroke: color, width: 2, cls: '' });
    path(gg, 'M-6 -16L-6 12M6 -12L6 16', { stroke: color, width: 1.4, cls: '' });
    svgEl('circle', { cx: 0, cy: -2, r: 4, fill: RED }, gg);
  } else if (kind === 'car') {
    path(gg, 'M-22 6L-22 -2L-14 -4L-8 -12L8 -12L14 -4L22 -2L22 6Z', { fill: '#cfe0f7', stroke: color, width: 2, cls: '' });
    [-12, 12].forEach((cx) => svgEl('circle', { cx, cy: 7, r: 5, fill: color }, gg));
  } else {
    [-12, -2, 8].forEach((cx, i) => svgEl('ellipse', { cx, cy: 0, rx: i === 0 ? 7 : 5, ry: i === 0 ? 5 : 4, fill: color }, gg));
    path(gg, 'M-4 -3l-5 -7M-1 -3l0 -9M2 -3l5 -7M-4 3l-5 7M-1 3l0 9M2 3l5 7M11 -3q5 -6 8 -5', { stroke: color, width: 1.6, cls: '' });
  }
  return gg;
}
const multDiv = {
  title: 'Multiply or divide?',
  height: 400,
  choices: [{ sep: 'Example 4 check:' }, { v: 'a', label: '(a) road map' }, { v: 'b', label: '(b) model car' }, { v: 'c', label: '(c) ant' }],
  ask: (v) => MD[v].ask,
  make(stage, v, ex) {
    const W = ex.W, H = 400, ox = (W - 960) / 2, svg = stageSvg(stage, W, H), e = MD[v];
    const bx = ox + 150, cmPx = e.d > 7 ? 32 : 40, dl = e.d * cmPx, frame = ox + 610;
    txt(svg, ox + 20, 70, 'drawing', { size: 17, color: BLUE, weight: 800, anchor: 'start' }); txt(svg, ox + 20, 170, 'real', { size: 17, color: RED, weight: 800, anchor: 'start' });
    icon(svg, e.icon, bx - 30, 70, e.icon === 'ant' ? 1.3 : 1, BLUE); icon(svg, e.icon, bx - 30, 170, e.icon === 'ant' ? 0.55 : 1.25, RED);
    const db = hide(line(svg, [bx, 70], [bx + dl, 70], { width: 16, color: BLUE, cap: 'butt' }));
    const dlab = hide(txt(svg, bx + dl / 2, 98, e.dl, { size: 17, weight: 700 }));
    let rb, rlab, brk = null;
    if (e.big) {
      rb = hide(line(svg, [bx, 170], [frame - 30, 170], { width: 16, color: RED, cap: 'butt' }));
      brk = hide(path(svg, `M${frame - 34} 156L${frame - 24} 184M${frame - 22} 156L${frame - 12} 184`, { stroke: RED, width: 3, cls: '' }));
      rlab = hide(txt(svg, bx, 200, `${e.rl}: ${e.times} times longer`, { size: 17, weight: 700, anchor: 'start' }));
    } else {
      rb = hide(line(svg, [bx, 170], [bx + dl / 8, 170], { width: 16, color: RED, cap: 'butt' }));
      rlab = hide(txt(svg, bx + dl / 8 + 14, 170, `${e.rl}: 8 times shorter`, { size: 17, weight: 700, anchor: 'start' }));
    }
    const lx = ox + 800;
    const chip = hide(lab(stage, e.chip, lx, 250, 'u6l4-tag'));
    const lam1 = lab(stage, 'real is <b>bigger</b> → <b>× multiply</b>', lx, 70, 'u6l4-lamp'), lam2 = lab(stage, 'real is <b>smaller</b> → <b>÷ divide</b>', lx, 140, 'u6l4-lamp');
    const work = e.w.map((s, i) => hide(lab(stage, T(s), ox + 40, 270 + i * 52, 'u6l4-work', true)));
    const st = hide(stamp(stage, e.icon === 'map' ? '≈ 158 km' : e.icon === 'car' ? '4.8 m' : '7.5 mm', { ok: true, x: ox + 760, y: 330, size: 'lg' }));
    return [
      { cap: e.s1, run: async (c) => { db.style.opacity = 1; await drawIn(db, 600, c); dlab.style.opacity = 1; await op(c, dlab, 1, 250); chip.style.opacity = 1; await c.pop(chip); } },
      { cap: e.s2, run: async (c) => { rb.style.opacity = 1; await drawIn(rb, e.big ? 1100 : 500, c); if (brk) { brk.style.opacity = 1; await op(c, brk, 1, 200); } rlab.style.opacity = 1; await op(c, rlab, 1, 250); (e.big ? lam1 : lam2).inner.classList.add('u6l4-on'); await pulse(c, e.big ? lam1 : lam2, 1.12, 450); } },
      { cap: e.s3, run: async (c) => { for (const w of work) { w.style.opacity = 1; await c.pop(w); } st.style.opacity = 1; await stampIn(c, st); } }
    ];
  }
};

/* ======================================================================================
 * 7. Real → drawing (Examples 5 and 6 checks)
 * ====================================================================================== */
const MODELS = {
  pickup: { ask: 'Example 6 (a): a pickup truck is 5.9 m long. How long is a 1 : 64 model of it, to the nearest tenth of a cm?', m: 5.9, cm: 590, n: 64, q: 590 / 64, show: '9.218\\ldots', ans: 9.2, kind: 'truck' },
  boxcar: { ask: 'Example 6 (b): HO scale is 1 : 87. A real grain boxcar is 15.2 m long. How long is the HO model, to the nearest tenth of a cm?', m: 15.2, cm: 1520, n: 87, q: 1520 / 87, show: '17.47\\ldots', ans: 17.5, kind: 'boxcar' }
};
function vehicle(g, kind, L, color = INK) {           // drawn from x = 0 to L, wheels on y = 0
  const k = L / 100;
  if (kind === 'truck') {
    path(g, `M0 ${-8 * k}L0 ${-22 * k}L${52 * k} ${-22 * k}L${58 * k} ${-38 * k}L${82 * k} ${-38 * k}L${92 * k} ${-24 * k}L${100 * k} ${-21 * k}L${100 * k} ${-8 * k}Z`, { fill: '#d7e4f6', stroke: color, width: 2.4, cls: '' });
    [18, 80].forEach((x) => svgEl('circle', { cx: x * k, cy: -7 * k, r: 8 * k, fill: color }, g));
  } else {
    rect(g, 0, -34 * k, 100 * k, 26 * k, { fill: '#e7c9a0', stroke: color, width: 2.4, cls: '' });
    rect(g, 40 * k, -31 * k, 20 * k, 20 * k, { fill: 'none', stroke: color, width: 1.6, cls: '' });
    [8, 18, 82, 92].forEach((x) => svgEl('circle', { cx: x * k, cy: -5 * k, r: 4 * k, fill: color }, g));
  }
}
const toDraw = {
  title: 'From real lengths to the drawing',
  height: 410,
  choices: [{ sep: 'Example 5 check:' }, { v: 'garage', label: 'garage blueprint' }, { sep: 'Example 6 check:' }, { v: 'pickup', label: '(a) pickup' }, { v: 'boxcar', label: '(b) boxcar' }],
  ask: (v) => (v === 'garage' ? 'Example 5: ¼ in represents 1 ft. The garage is 24 ft by 22 ft with a 9 ft door. Find the lengths on the blueprint.' : MODELS[v].ask),
  make(stage, v, ex) {
    const W = ex.W, H = 410, ox = (W - 960) / 2, svg = stageSvg(stage, W, H);
    if (v === 'garage') {
      const bx = ox + 20, by = 14, bw = 450, bh = 384, ppi = 50, gx = bx + 70, gy = by + 50;
      rect(svg, bx, by, bw, bh, { rx: 8, fill: '#1f4f8f', stroke: '#173b6b', width: 2, cls: '' });
      let d = ''; for (let x = bx + 12.5; x < bx + bw; x += 12.5) d += `M${x} ${by}V${by + bh}`; for (let y = by + 12.5; y < by + bh; y += 12.5) d += `M${bx} ${y}H${bx + bw}`;
      path(svg, d, { stroke: '#ffffff', width: 0.5, opacity: 0.18, cls: '' });
      const WH = '#f4f8ff', Lp = 6 * ppi, Wp = 5.5 * ppi, Dp = 2.25 * ppi, dx0 = gx + (Lp - Dp) / 2;
      const bot = hide(path(svg, `M${gx} ${gy + Wp}H${gx + Lp}`, { stroke: WH, width: 4.5 }));
      const rest = hide(path(svg, `M${gx + Lp} ${gy + Wp}V${gy}H${gx}V${gy + Wp}`, { stroke: WH, width: 4.5 }));
      const gap = hide(rect(svg, dx0, gy + Wp - 5, Dp, 10, { fill: '#1f4f8f', stroke: 'none', cls: '' }));
      const door = hide(path(svg, `M${dx0} ${gy + Wp}H${dx0 + Dp}`, { stroke: '#ffd66b', width: 2.5, dash: '7 5' }));
      const t1 = hide(txt(svg, gx + Lp / 2, gy + Wp + 24, '6 in', { size: 19, color: WH, weight: 800, halo: false }));
      const t2 = hide(txt(svg, gx + Lp + 12, gy + Wp / 2, '5½ in', { size: 19, color: WH, weight: 800, halo: false, anchor: 'start' }));
      const t3 = hide(txt(svg, dx0 + Dp / 2, gy + Wp - 20, 'door 2¼ in', { size: 16, color: '#ffd66b', weight: 700, halo: false }));
      const ttl = txt(svg, gx + Lp / 2, by + 24, 'Garage · ¼ in represents 1 ft', { size: 15, color: WH, halo: false, weight: 700 });
      void ttl;
      // the zoomed-in inch
      const ix = ox + 540, iy = 70, q = 90;
      const inch = svgEl('g', {}, svg); hide(inch);
      for (let i = 0; i < 4; i++) { rect(inch, ix + i * q, iy, q, 22, { fill: i % 2 ? '#fff' : '#e6eefb', stroke: BLUE, width: 2, cls: '' }); txt(inch, ix + i * q + q / 2, iy + 40, '1 ft', { size: 17, color: RED, weight: 700 }); }
      txt(inch, ix, iy - 14, '0', { size: 14, halo: false }); txt(inch, ix + 4 * q, iy - 14, '1 in', { size: 14, halo: false, weight: 700 });
      [1, 2, 3].forEach((i) => txt(inch, ix + i * q, iy - 14, ['¼', '½', '¾'][i - 1], { size: 14, halo: false }));
      txt(inch, ix + 2 * q, iy + 66, '1 inch, zoomed in: 4 quarters = 4 ft', { size: 15, color: SLATE });
      const px = ox + 540;
      const w = ['24\\div4=6\\text{ in}', '22\\div4=5\\tfrac12\\text{ in}', '9\\div4=2\\tfrac14\\text{ in}'].map((s, i) => hide(lab(stage, `${['length', 'width', 'door'][i]}: ${T(s)}`, px, 190 + i * 56, 'u6l4-work', true)));
      const st = hide(stamp(stage, 'all smaller ✓', { ok: true, x: px + 210, y: 368, size: 'sm' }));
      return [
        { cap: '¼ in represents 1 ft. <b>4 quarters</b> make 1 in, so <b>1 in represents 4 ft</b>. To draw, <b>divide</b> each real length by 4.', run: async (c) => { inch.style.opacity = 1; await op(c, inch, 1, 500); } },
        { cap: `Length: ${T('24\\div4=6')} in.`, run: async (c) => { w[0].style.opacity = 1; await c.pop(w[0]); bot.style.opacity = 1; await drawIn(bot, 700, c); t1.style.opacity = 1; await op(c, t1, 1, 250); } },
        { cap: `Width: ${T('22\\div4=5\\tfrac12')} in.`, run: async (c) => { w[1].style.opacity = 1; await c.pop(w[1]); rest.style.opacity = 1; await drawIn(rest, 900, c); t2.style.opacity = 1; await op(c, t2, 1, 250); } },
        { cap: `Door: ${T('9\\div4=2\\tfrac14')} in, in the front wall.`, run: async (c) => { w[2].style.opacity = 1; await c.pop(w[2]); gap.style.opacity = 1; door.style.opacity = 1; await drawIn(door, 500, c); t3.style.opacity = 1; await op(c, t3, 1, 250); } },
        { cap: 'On the blueprint: <b>6 in by 5½ in</b>, door <b>2¼ in</b>. Check: every drawing length is much <b>smaller</b> than the real one.', run: async (c) => { st.style.opacity = 1; await stampIn(c, st); } }
      ];
    }
    const e = MODELS[v], cmPx = 30, rx0 = ox + 110, ry = 366, RL = 360, mL = e.ans * cmPx, RX = ox + 40, RY = 150;
    const real = tg(svg); vehicle(real, e.kind, RL); real.setAttribute('transform', `translate(${RX} ${RY})`);
    hide(real);
    const rlab = hide(lab(stage, `real: <b>${e.m} m</b> <span class="muted">(not to scale)</span>`, RX + RL / 2, RY + 22, 'u6l4-work'));
    const model = tg(svg); vehicle(model, e.kind, RL, BLUE); hide(model);
    const placeM = (u) => { const k = 1 + (mL / RL - 1) * u; model.setAttribute('transform', `translate(${RX + (rx0 - RX) * u} ${RY + (ry - 2 - RY) * u}) scale(${k})`); };
    placeM(0);
    ruler(svg, rx0, ry, 20, cmPx, { every: 1, h: 36 });
    const mk = hide(line(svg, [rx0 + mL, ry - 14], [rx0 + mL, ry + 4], { width: 3, color: RED, cls: '' }));
    const mlab = hide(lab(stage, `model ≈ <b>${e.ans} cm</b>`, rx0 + mL + 86, ry - 30, 'u6l4-tag u6l4-d'));
    const w1 = hide(lab(stage, T(`${e.m}\\text{ m}=${e.m}\\times100=${tn(e.cm)}\\text{ cm}`), ox + 470, 70, 'u6l4-work', true));
    const w2 = hide(lab(stage, `${T(`${tn(e.cm)}\\div${e.n}=${e.show}`)} &nbsp;→&nbsp; <b>${e.ans} cm</b>`, ox + 470, 130, 'u6l4-work', true));
    const st = hide(stamp(stage, 'smaller ✓', { ok: true, x: ox + 850, y: 230, size: 'sm' }));
    return [
      { cap: `Same units first: ${T(`${e.m}\\text{ m}=${e.m}\\times100=${tn(e.cm)}\\text{ cm}`)}.`, run: async (c) => { real.style.opacity = 1; await op(c, real, 1, 400); rlab.style.opacity = 1; await c.pop(rlab); w1.style.opacity = 1; await c.pop(w1); } },
      { cap: `${T(`1:${e.n}`)} is a reduction, so <b>divide</b> by ${e.n}: ${T(`${tn(e.cm)}\\div${e.n}=${e.show}`)}`,
        run: async (c) => { await op(c, real, 0.2, 300); await op(c, rlab, 0, 200); model.style.opacity = 1; await tween(c, 1500, (u) => placeM(u)); w2.style.opacity = 1; await c.pop(w2); } },
      { cap: `To the nearest tenth of a centimetre, the model is about <b>${e.ans} cm</b> long.`, run: async (c) => { mk.style.opacity = 1; await drawIn(mk, 300, c); mlab.style.opacity = 1; await c.pop(mlab); st.style.opacity = 1; await stampIn(c, st); } }
    ];
  }
};

/* ======================================================================================
 * 8. Choosing a scale: will the rink fit? (Example 7)
 * ====================================================================================== */
const choose = {
  title: 'Choose a scale that fits',
  height: 410,
  choices: [{ sep: 'Example 7 check:' }, { v: 'ex7', label: 'the rink' }, { sep: 'Try:' }, { v: 'tiny', label: '1 cm represents 20 m' }],
  ask: (v) => (v === 'ex7' ? 'Example 7: draw a hockey rink, 61 m by 26 m, in a space 15 cm by 10 cm. Choose an easy scale.' : 'What if Coach Diaz picks 1 cm represents 20 m for the 61 m by 26 m rink?'),
  make(stage, v, ex) {
    const W = ex.W, H = 410, ox = (W - 960) / 2, svg = stageSvg(stage, W, H), cp = 30, sx = ox + 74, sy = 40, SW = 15 * cp, SH = 10 * cp;
    const space = hide(rect(svg, sx, sy, SW, SH, { fill: '#fffdf6', stroke: SLATE, width: 2.5, dash: '9 6' }));
    const sl1 = hide(txt(svg, sx + SW / 2, sy + SH + 20, '15 cm', { size: 18, color: BLUE, weight: 800 })), sl2 = hide(txt(svg, sx - 10, sy + SH / 2, '10 cm', { size: 18, color: BLUE, weight: 800, anchor: 'end' }));
    const px = ox + 560;
    const card = hide(lab(stage, '<span class="u6l4-k">The rink</span><span class="u6l4-r">61 m</span> by <span class="u6l4-r">26 m</span>', px + 160, 52, 'u6l4-card'));
    const at5 = { L: 61 / 5 * cp, W: 26 / 5 * cp }, at4 = { L: 61 / 4 * cp, W: 26 / 4 * cp }, at20 = { L: 61 / 20 * cp, W: 26 / 20 * cp };
    const r5 = hide(rink(svg, sx + (SW - at5.L) / 2, sy + (SH - at5.W) / 2, at5.L, at5.W));
    const r4 = hide(rink(svg, sx, sy + (SH - at4.W) / 2, at4.L, at4.W, { color: RED, fill: '#fff5f4' }));
    const over = hide(rect(svg, sx + SW, sy + (SH - at4.W) / 2 - 6, at4.L - SW + 3, at4.W + 12, { fill: RED, fo: 0.5, stroke: RED, width: 1.5, cls: '' }));
    const r20 = hide(rink(svg, sx + 20, sy + 20, at20.L, at20.W));
    const first = { cap: 'Steps 1 and 2: the rink is <b>61 m by 26 m</b>. The space on the handout is <b>15 cm by 10 cm</b>.',
      run: async (c) => { space.style.opacity = 1; await drawIn(space, 600, c); for (const e of [sl1, sl2]) { e.style.opacity = 1; await op(c, e, 1, 200); } card.style.opacity = 1; await c.pop(card); } };
    if (v === 'tiny') {
      const w1 = hide(lab(stage, `${T('61\\div20=3.05')} cm, &nbsp;${T('26\\div20=1.3')} cm`, px, 150, 'u6l4-work', true));
      const st = hide(stamp(stage, 'fits, but tiny', { ok: null, x: px + 190, y: 250, size: 'lg' }));
      return [first,
        { cap: `With 1 cm represents 20 m: ${T('61\\div20=3.05')} cm and ${T('26\\div20=1.3')} cm.`, run: async (c) => { w1.style.opacity = 1; await c.pop(w1); r20.style.opacity = 1; await op(c, r20, 1, 500); } },
        { cap: 'It fits, but it fills only a corner and there is no room for details. Round up to the <b>smallest</b> easy number that fits.', run: async (c) => { st.style.opacity = 1; await stampIn(c, st); } }];
    }
    const w1 = hide(lab(stage, `length: ${T('61\\div15=4.07')} m per cm`, px, 120, 'u6l4-work', true));
    const w2 = hide(lab(stage, `width: ${T('26\\div10=2.6')} m per cm`, px, 170, 'u6l4-work', true));
    const w3 = hide(lab(stage, `round <b>up</b>: <b>5 m</b> per cm (${T('1:500')})`, px, 228, 'u6l4-work', true));
    const w4 = hide(lab(stage, `${T('61\\div5=12.2')} cm, &nbsp;${T('26\\div5=5.2')} cm`, px, 286, 'u6l4-work', true));
    const s5 = hide(stamp(stage, 'fits ✓', { ok: true, x: sx + SW / 2, y: sy + SH - 30, size: 'sm' }));
    const w5 = hide(lab(stage, `4 m: ${T('61\\div4=15.25')} cm &gt; 15 cm`, px, 350, 'u6l4-work u6l4-r', true));
    const s6 = hide(stamp(stage, 'too long ✗', { ok: false, x: sx + SW - 60, y: sy + 34, size: 'sm' }));
    return [first,
      { cap: `Step 3: divide. Length ${T('61\\div15=4.07')} m per cm. Width ${T('26\\div10=2.6')} m per cm. Use the <b>bigger</b> one, 4.07.`,
        run: async (c) => { for (const e of [w1, w2]) { e.style.opacity = 1; await c.pop(e); } await pulse(c, w1, 1.08, 450); } },
      { cap: `Step 4: round <b>up</b> to an easy number: 1 cm represents <b>5 m</b>, which is ${T('1:500')}.`, run: async (c) => { w3.style.opacity = 1; await c.pop(w3); } },
      { cap: `Step 5: ${T('61\\div5=12.2')} cm and ${T('26\\div5=5.2')} cm. Both fit in the space.`,
        run: async (c) => { w4.style.opacity = 1; await c.pop(w4); r5.style.opacity = 1; await op(c, r5, 1, 600); s5.style.opacity = 1; await stampIn(c, s5); } },
      { cap: `Why not 1 cm represents 4 m? ${T('61\\div4=15.25')} cm: longer than the 15 cm space. Rounding <b>down</b> makes the drawing too big.`,
        run: async (c) => { await op(c, r5, 0.15, 300); await op(c, s5, 0, 200); r4.style.opacity = 1; await op(c, r4, 1, 500); over.style.opacity = 1; await pulse(c, over, 1.5, 500); w5.style.opacity = 1; await c.pop(w5); s6.style.opacity = 1; await stampIn(c, s6); } }];
  }
};

/* ======================================================================================
 * 9. Drawing a floor plan at three scales (Example 8)
 * ====================================================================================== */
const PLAN_ROWS = [['Room length', 4.5], ['Room width', 3.6], ['Door', 0.9], ['Window', 1.5], ['Bed', [2.0, 1.5]], ['Dresser', [1.2, 0.5]]];
const fmtReal = (r) => (Array.isArray(r) ? `${r[0].toFixed(1)} × ${r[1]}` : String(r));
const fmtPlan = (r, sc) => (Array.isArray(r) ? `${n1(r[0] / sc)} × ${n1(r[1] / sc)}` : n1(r / sc));
const drawPlan = {
  title: 'Draw the floor plan',
  height: 420,
  choices: [{ sep: 'Example 8 check:' }, { v: 0.5, label: '1 cm represents 0.5 m' }, { sep: 'Try:' }, { v: 1, label: '1 cm represents 1 m' }, { v: 0.25, label: '1 cm represents 0.25 m' }],
  ask: (v) => `Draw Maya’s bedroom (4.5 m by 3.6 m) on the 10 cm by 8 cm grid with the scale <b>1 cm represents ${v} m</b>.`,
  make(stage, v, ex) {
    const W = ex.W, H = 420, ox = (W - 960) / 2, svg = stageSvg(stage, W, H), sc = v, cp = 38, gx = ox + 30, gy = 46, GW = 10 * cp, GH = 8 * cp;
    rect(svg, gx, gy, GW, GH, { fill: '#fff', stroke: '#b9b0a0', width: 1.5, cls: '' });
    let d = ''; for (let i = 1; i < 10; i++) d += `M${gx + i * cp} ${gy}V${gy + GH}`; for (let j = 1; j < 8; j++) d += `M${gx} ${gy + j * cp}H${gx + GW}`;
    path(svg, d, { stroke: '#dcd5c7', width: 1, cls: '' });
    const F = { s: cp / sc, P: ([x, y]) => [gx + (0.5 + x / sc) * cp, gy + GH - (0.4 + y / sc) * cp] };
    const id = 'u6l4-clip' + (++UID), defs = svgEl('defs', {}, svg), cpth = svgEl('clipPath', { id }, defs);
    svgEl('rect', { x: gx - 16, y: gy - 16, width: GW + 32, height: GH + 32 }, cpth);
    const draw = svgEl('g', { 'clip-path': `url(#${id})` }, svg);
    const big = sc < 0.5, col = big ? RED : INK, wall = 5;
    const [ax, ay] = F.P([0, 3.6]), [bx2, by2] = F.P([4.5, 0]);
    const walls = hide(rect(draw, ax, ay, bx2 - ax, by2 - ay, { width: wall, stroke: col }));
    const doorG = svgEl('g', {}, draw); hide(doorG); const dr = planDoor(doorG, F, [0.15, 0], 0, 0.9, 1, { wall, cls: 'bk-stroke' });
    const winG = planWin(draw, F, [1.5, 3.6], [3.0, 3.6], { wall }); hide(winG);
    const furn = svgEl('g', {}, draw); hide(furn);
    const [b0x, b0y] = F.P([2.5, 2.55]), [b1x, b1y] = F.P([4.5, 1.05]);
    rect(furn, b0x, b0y, b1x - b0x, b1y - b0y, { width: 2.5, fill: '#e3ecf9', stroke: BLUE, cls: '' });
    const [d0x, d0y] = F.P([0, 3.0]), [d1x, d1y] = F.P([0.5, 1.8]);
    rect(furn, d0x, d0y, d1x - d0x, d1y - d0y, { width: 2.5, fill: '#f3e3c6', stroke: BROWN, cls: '' });
    txt(furn, (b0x + b1x) / 2, (b0y + b1y) / 2, 'bed', { size: sc >= 1 ? 13 : 17 });
    if (sc < 1) { const tt = txt(furn, (d0x + d1x) / 2, (d0y + d1y) / 2, 'dresser', { size: 14 }); tt.setAttribute('transform', `rotate(-90 ${((d0x + d1x) / 2).toFixed(1)} ${((d0y + d1y) / 2).toFixed(1)})`); }
    const scl = hide(txt(svg, gx, gy + GH + 20, `Scale: 1 cm represents ${sc} m`, { size: 17, anchor: 'start', weight: 700 }));
    // the table
    const tb = h('div', 'u6l4-pt'); add(stage, tb, ox + 500, 40); tb.style.position = 'absolute';
    ['Item', 'Real (m)', 'Plan (cm)'].forEach((s) => tb.appendChild(h('div', 'u6l4-pth', s)));
    const cells = [];
    PLAN_ROWS.forEach(([name, r]) => { tb.appendChild(h('div', 'u6l4-ptl', name)); tb.appendChild(h('div', '', fmtReal(r))); const cc = h('div', 'u6l4-ptp', fmtPlan(r, sc)); cc.style.opacity = 0; tb.appendChild(cc); cells.push(cc); });
    const how = sc === 0.5 ? 'the same as × 2' : sc === 0.25 ? 'the same as × 4' : 'the lengths stay the same numbers';
    const fill = { cap: `Divide every real length by <b>${sc}</b> (${how}). For example, ${T(`4.5\\div${sc}=${n1(4.5 / sc)}`)} cm.`,
      run: async (c) => { for (const cc of cells) { await c.anim(cc, [{ opacity: 0 }, { opacity: 1 }], 220); } } };
    const vx = ox + 640, vy = 350;
    if (big) {
      const st = hide(stamp(stage, 'too big ✗', { ok: false, x: vx, y: vy, size: 'lg' }));
      return [fill,
        { cap: `The walls would be <b>18 cm by 14.4 cm</b>. They run right off the 10 cm by 8 cm grid!`, run: async (c) => { walls.style.opacity = 1; await drawIn(walls, 900, c); st.style.opacity = 1; await stampIn(c, st); } },
        { cap: 'A scale that is too <b>small a number</b> (0.25 m per cm) makes the drawing too <b>big</b>. Go back to 1 cm represents 0.5 m.', run: async (c) => { await pulse(c, st, 1.1, 500); } }];
    }
    const st = hide(stamp(stage, sc === 0.5 ? 'done ✓' : 'fits, but small', { ok: sc === 0.5 ? true : null, x: vx, y: vy, size: 'lg' }));
    const L = (r) => n1(r / sc);
    return [fill,
      { cap: `Draw the walls with a ruler: <b>${L(4.5)} cm by ${L(3.6)} cm</b>. Walls are thick lines.`, run: async (c) => { walls.style.opacity = 1; await drawIn(walls, 900, c); } },
      { cap: `The <b>door</b> (${L(0.9)} cm) goes near a corner of a long wall. Show which way it swings.`, run: async (c) => { dr.arc.style.opacity = 0; doorG.style.opacity = 1; await c.anim(doorG, [{ opacity: 0 }, { opacity: 1 }], 300); dr.arc.style.opacity = 1; await drawIn(dr.arc, 500, c); } },
      { cap: `The <b>window</b> (${L(1.5)} cm) goes in the middle of the other long wall.`, run: async (c) => { winG.style.opacity = 1; await c.anim(winG, [{ opacity: 0 }, { opacity: 1 }], 400); } },
      { cap: `Add the <b>bed</b> (${L(2)} cm by ${L(1.5)} cm) and the <b>dresser</b> (${L(1.2)} cm by ${L(0.5)} cm), clear of the door’s swing.`, run: async (c) => { furn.style.opacity = 1; await c.anim(furn, [{ opacity: 0 }, { opacity: 1 }], 500); } },
      { cap: sc === 0.5 ? 'Write the <b>scale</b> on the drawing. Done!' : 'It fits, but it fills only a corner of the grid. 1 cm represents 0.5 m is a better choice.',
        run: async (c) => { scl.style.opacity = 1; await op(c, scl, 1, 300); st.style.opacity = 1; await stampIn(c, st); } }
    ];
  }
};

/* ======================================================================================
 * 10. Routes on the town map (Example 9 checks) and a string for a curved trail
 * ====================================================================================== */
const ROUTE = {
  b: { ask: 'Example 9 (b): Jada walks from home east on 1 Ave, then north on 3 St, to school. Find her real walking distance.', legs: [[[0, 0], [4, 0]], [[4, 0], [4, 3]]], dirs: ['East on 1 Ave', 'North on 3 St'] },
  c: { ask: 'Example 9 (c): find the straight-line distance from home to school.', legs: [[[0, 0], [4, 3]]], straight: true },
  d: { ask: 'Example 9 (d): from school, Jada walks south on 3 St, then east on 2 Ave, to the rink. How far is that?', legs: [[[4, 3], [4, 1.5]], [[4, 1.5], [6, 1.5]]], dirs: ['South on 3 St', 'East on 2 Ave'] },
  e: { ask: 'Example 9 (e): Jada walks the 1.4 km from home to school at about 5 km/h. About how many minutes does it take?', legs: [[[0, 0], [4, 0]], [[4, 0], [4, 3]]] }
};
const route = {
  title: 'Measure the route, piece by piece',
  height: 420,
  choices: [{ v: 'string', label: 'a curved trail' }, { sep: 'Example 9 check:' }, { v: 'b', label: '(b) the route' }, { v: 'c', label: '(c) straight line' }, { v: 'd', label: '(d) to the rink' }, { v: 'e', label: '(e) the time' }],
  ask: (v) => (v === 'string' ? 'A hiking map uses 1 cm represents 500 m. How long is the curved trail from the parking lot to the lookout?' : ROUTE[v].ask),
  make(stage, v, ex) {
    const W = ex.W, H = 420, ox = (W - 960) / 2, svg = stageSvg(stage, W, H);
    if (v === 'string') return stringSteps(stage, svg, ox);
    const s = 50, F = { s, P: ([x, y]) => [ox + 110 + x * s, 290 - y * s] }, P = F.P, R = ROUTE[v];
    drawTown(svg, F, { places: true });
    const pathG = svgEl('g', {}, svg);
    const J = svgEl('circle', { r: 9, fill: '#7b4fc4', stroke: '#fff', 'stroke-width': 3 }, svg); hide(J);
    const putJ = (p) => { J.setAttribute('cx', p[0].toFixed(1)); J.setAttribute('cy', p[1].toFixed(1)); };
    putJ(P(R.legs[0][0]));
    const px = ox + 580;
    const lens = R.legs.map(([a, b]) => Math.hypot(b[0] - a[0], b[1] - a[1]));
    const tot = lens.reduce((a, b) => a + b, 0), real = tot * 200;
    const segs = R.legs.map(([a, b]) => { const el = line(pathG, P(a), P(a), { width: R.straight ? 4 : 7, color: R.straight ? INK : '#e0a21b', dash: R.straight ? '10 7' : null, cls: '' }); return el; });
    const cnt = R.legs.map(([a, b]) => { const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], q = P(m), horiz = a[1] === b[1]; return hide(lab(stage, '0 cm', q[0] + (horiz ? 0 : 34), q[1] + (horiz ? 22 : 0) + (R.straight ? -28 : 0), 'u6l4-tag u6l4-d')); });
    const walk = (i, ms) => async (c) => {
      const [a, b] = R.legs[i], A = P(a), B = P(b); J.style.opacity = 1; cnt[i].style.opacity = 1;
      await tween(c, ms, (u) => { const q = [A[0] + (B[0] - A[0]) * u, A[1] + (B[1] - A[1]) * u]; segs[i].setAttribute('x2', q[0].toFixed(1)); segs[i].setAttribute('y2', q[1].toFixed(1)); putJ(q); set(cnt[i], `${n1(lens[i] * u, 1)} cm`); });
    };
    if (v === 'e') {
      const w1 = hide(lab(stage, `time = distance ÷ speed`, px, 90, 'u6l4-work', true));
      const w2 = hide(lab(stage, T('1.4\\div5=0.28\\text{ h}'), px, 145, 'u6l4-work', true));
      const w3 = hide(lab(stage, T('0.28\\times60=16.8\\text{ min}'), px, 200, 'u6l4-work', true));
      const C = [px + 300, 300], cr = 56, clock = svgEl('g', {}, svg); hide(clock);
      svgEl('circle', { cx: C[0], cy: C[1], r: cr, fill: '#fff', stroke: INK, 'stroke-width': 3 }, clock);
      for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; line(clock, [C[0] + Math.sin(a) * (cr - 4), C[1] - Math.cos(a) * (cr - 4)], [C[0] + Math.sin(a) * (cr - 11), C[1] - Math.cos(a) * (cr - 11)], { width: 2, cls: '' }); }
      const wedge = path(clock, '', { fill: '#e0a21b', fo: 0.45, stroke: 'none', cls: '' });
      const hand = line(clock, C, [C[0], C[1] - cr + 12], { width: 3.5, color: RED, cls: '' });
      const setT = (m) => { const a = m / 60 * Math.PI * 2, E = [C[0] + Math.sin(a) * (cr - 6), C[1] - Math.cos(a) * (cr - 6)];
        wedge.setAttribute('d', m > 0.1 ? `M${C[0]} ${C[1]}L${C[0]} ${C[1] - cr + 6}A${cr - 6} ${cr - 6} 0 0 1 ${E[0].toFixed(1)} ${E[1].toFixed(1)}Z` : '');
        hand.setAttribute('x2', E[0].toFixed(1)); hand.setAttribute('y2', E[1].toFixed(1)); };
      setT(0);
      const st = hide(stamp(stage, 'about 17 min', { ok: true, x: px + 110, y: 290, size: 'sm' }));
      return [
        { cap: 'Her route is <b>1.4 km</b> (part b). She walks about <b>5 km</b> every hour.', run: async (c) => { await walk(0, 500)(c); await walk(1, 400)(c); } },
        { cap: `time = distance ÷ speed: ${T('1.4\\div5=0.28')} h.`, run: async (c) => { for (const e of [w1, w2]) { e.style.opacity = 1; await c.pop(e); } } },
        { cap: `Change hours to minutes: ${T('0.28\\times60=16.8')}. Her walk takes about <b>17 minutes</b>.`,
          run: async (c) => { w3.style.opacity = 1; await c.pop(w3); clock.style.opacity = 1; await op(c, clock, 1, 300); await tween(c, 1500, (u) => setT(16.8 * u)); st.style.opacity = 1; await stampIn(c, st); } }
      ];
    }
    if (v === 'c') {
      const route0 = svgEl('g', {}, svg); hide(route0);
      line(route0, P([0, 0]), P([4, 0]), { width: 6, color: '#e0a21b', opacity: 0.5, cls: '' }); line(route0, P([4, 0]), P([4, 3]), { width: 6, color: '#e0a21b', opacity: 0.5, cls: '' });
      const w1 = hide(lab(stage, `${T('5\\times200=1000')} m = <b>1 km</b>`, px, 110, 'u6l4-work', true));
      const bars = svgEl('g', {}, svg); hide(bars);
      line(bars, [px, 220], [px + 1 * 150, 220], { width: 14, color: INK, cap: 'butt', cls: '' }); line(bars, [px, 270], [px + 1.4 * 150, 270], { width: 14, color: '#e0a21b', cap: 'butt', cls: '' });
      txt(bars, px + 160, 220, 'straight: 1 km', { size: 16, anchor: 'start', weight: 700 }); txt(bars, px + 220, 270, 'route: 1.4 km', { size: 16, anchor: 'start', weight: 700 });
      const st = hide(stamp(stage, 'shorter', { ok: true, x: px + 150, y: 340, size: 'sm' }));
      return [
        { cap: 'Lay the ruler straight from home to school: <b>5 cm</b>.', run: walk(0, 1300) },
        { cap: `Change to real: ${T('5\\times200=1000')} m, which is <b>1 km</b>.`, run: async (c) => { w1.style.opacity = 1; await c.pop(w1); } },
        { cap: 'The straight line (1 km) is <b>shorter</b> than the route along the streets (1.4 km). Jada can’t walk through buildings!',
          run: async (c) => { route0.style.opacity = 1; await op(c, route0, 1, 300); bars.style.opacity = 1; await op(c, bars, 1, 400); st.style.opacity = 1; await stampIn(c, st); } }
      ];
    }
    const sum = lens.map((x) => n1(x)).join('+');
    const w1 = hide(lab(stage, `${R.dirs[0]}: <b>${n1(lens[0])} cm</b>`, px, 90, 'u6l4-work', true));
    const w2 = hide(lab(stage, `${R.dirs[1]}: <b>${n1(lens[1])} cm</b>`, px, 145, 'u6l4-work', true));
    const w3 = hide(lab(stage, `add: ${T(`${sum}=${n1(tot)}`)} cm`, px, 210, 'u6l4-work', true));
    const w4 = hide(lab(stage, `${T(`${n1(tot)}\\times200=${tn(real)}`)} m${real >= 1000 ? ` = <b>${n1(real / 1000)} km</b>` : ''}`, px, 265, 'u6l4-work', true));
    const st = hide(stamp(stage, real >= 1000 ? `${n1(real / 1000)} km` : `${real} m`, { ok: true, x: px + 150, y: 340, size: 'sm' }));
    return [
      { cap: `${R.dirs[0]}: measure the first straight piece, <b>${n1(lens[0])} cm</b>.`, run: async (c) => { await walk(0, 1100)(c); w1.style.opacity = 1; await c.pop(w1); } },
      { cap: `${R.dirs[1]}: the second piece, <b>${n1(lens[1])} cm</b>.`, run: async (c) => { await walk(1, 1000)(c); w2.style.opacity = 1; await c.pop(w2); } },
      { cap: `<b>Add</b> the pieces first: ${T(`${sum}=${n1(tot)}`)} cm. Then change to real <b>once</b>: ${T(`${n1(tot)}\\times200=${tn(real)}`)} m${real >= 1000 ? ` = <b>${n1(real / 1000)} km</b>` : ''}.`,
        run: async (c) => { for (const e of [w3, w4]) { e.style.opacity = 1; await c.pop(e); } st.style.opacity = 1; await stampIn(c, st); } }
    ];
  }
};
function stringSteps(stage, svg, ox) {
  const s = 50, A = [ox + 70, 210];
  rect(svg, ox + 20, 16, 560, 250, { rx: 10, fill: '#eef3e4', stroke: '#cdd6bc', width: 1.5, cls: '' });
  svgEl('ellipse', { cx: ox + 370, cy: 234, rx: 55, ry: 22, fill: '#cfe2f5', stroke: '#9cc0e6', 'stroke-width': 1.5 }, svg);
  txt(svg, ox + 370, 234, 'Lake', { size: 14, color: '#2b5f96', halo: false });
  // the trail: a smooth curve from A to B, sampled
  const ctrl = [A, [ox + 150, 100], [ox + 240, 215], [ox + 320, 135], [ox + 400, 90], [ox + 470, 195], [ox + 545, 150]];
  const pts = [];
  for (let i = 0; i < ctrl.length - 1; i++) {
    const p0 = ctrl[Math.max(0, i - 1)], p1 = ctrl[i], p2 = ctrl[i + 1], p3 = ctrl[Math.min(ctrl.length - 1, i + 2)];
    for (let t = 0; t < 1; t += 0.02) {
      const t2 = t * t, t3 = t2 * t;
      pts.push([0, 1].map((k) => 0.5 * ((2 * p1[k]) + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3)));
    }
  }
  pts.push(ctrl[ctrl.length - 1]);
  const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const Lpx = cum[cum.length - 1], Lcm = Math.round(Lpx / s * 10) / 10, km = Lcm * 0.5;
  path(svg, polyD(pts, false), { stroke: '#8a6a3a', width: 4, dash: '2 7', cls: '' });
  const B = pts[pts.length - 1];
  dot(svg, A, { r: 7, color: RED }); dot(svg, B, { r: 7, color: RED });
  txt(svg, A[0] + 6, A[1] + 26, 'parking lot', { size: 15, weight: 700 }); txt(svg, B[0] - 6, B[1] + 26, 'lookout', { size: 15, weight: 700 });
  Geo.scaleBar(svg, { x: ox + 24, y: 22, scale: '1 cm : 500 m', segments: 3, cmPx: s, title: true, size: 14 });
  const ry = 330, rx0 = ox + 70, n = Math.ceil(Lcm) + 1;
  ruler(svg, rx0, ry, n, s, { every: 1 });
  const k = 1;
  const str = path(svg, '', { stroke: '#e0641b', width: 4, cls: '' });
  const shape = (u, upto = 1) => {
    const out = []; const Lmax = Lpx * upto;
    for (let i = 0; i < pts.length; i++) { if (cum[i] > Lmax + 0.01) break; const Q = [rx0 + cum[i] * k, ry - 6]; out.push([pts[i][0] + (Q[0] - pts[i][0]) * u, pts[i][1] + (Q[1] - pts[i][1]) * u]); }
    return out.length > 1 ? polyD(out, false) : '';
  };
  str.setAttribute('d', '');
  const mk = hide(line(svg, [rx0 + Lpx * k, ry - 26], [rx0 + Lpx * k, ry + 4], { width: 3, color: RED, cls: '' }));
  const ml = hide(lab(stage, `string ≈ <b>${Lcm} cm</b>`, rx0 + Lpx * k, ry - 42, 'u6l4-tag u6l4-d'));
  const px = ox + 620;
  const w1 = hide(lab(stage, '1 cm represents 0.5 km', px, 80, 'u6l4-work', true));
  const w2 = hide(lab(stage, T(`${Lcm}\\times0.5=${n1(km)}\\text{ km}`), px, 140, 'u6l4-work', true));
  const st = hide(stamp(stage, `about ${n1(km)} km`, { ok: true, x: px + 150, y: 220, size: 'sm' }));
  return [
    { cap: 'The trail <b>curves</b>, and a ruler can’t bend. Lay a <b>string</b> along the trail, from end to end.', run: async (c) => { await tween(c, 1800, (u) => { str.setAttribute('d', shape(0, u)); }); } },
    { cap: `Pull the string <b>straight</b> and measure it with a ruler: about <b>${Lcm} cm</b>.`,
      run: async (c) => { await tween(c, 1600, (u) => { str.setAttribute('d', shape(u)); }); mk.style.opacity = 1; await op(c, mk, 1, 200); ml.style.opacity = 1; await c.pop(ml); } },
    { cap: `Change to real: 1 cm represents 500 m = 0.5 km, so ${T(`${Lcm}\\times0.5=${n1(km)}`)} km.`,
      run: async (c) => { for (const e of [w1, w2]) { e.style.opacity = 1; await c.pop(e); } st.style.opacity = 1; await stampIn(c, st); } }
  ];
}

mountExplainers({ ways, zoom, realLen, twoWays, area, multDiv, toDraw, choose, drawPlan, route });

/* ======================================================================================
 * Static figures
 * ====================================================================================== */
const FIG = {
  wans(host) {
    const s = figSvg(host, 240, 250), u = 10, X = 70, Y = 230;
    rect(s, X, Y - 20 * u, 10 * u, 20 * u, { fill: '#f3e0bb', stroke: '#7a5124', width: 2.5, cls: '' });
    rect(s, X, Y - 10 * u, 10 * u, 10 * u, { fill: '#e9cfa2', stroke: '#7a5124', width: 2.5, cls: '' });
    line(s, [X - 6, Y - 10 * u], [X + 10 * u + 6, Y - 10 * u], { width: 1.6, dash: '5 4', color: '#7a5124', cls: '' });
    txt(s, X + 5 * u, Y - 15 * u, 'top', { size: 14, color: SLATE, halo: false }); txt(s, X + 5 * u, Y - 4 * u, 'front', { size: 14, color: SLATE, halo: false });
    line(s, [X, Y], [X + 10 * u, Y - 20 * u], { width: 3.5, color: RED, cls: '' });
    dot(s, [X, Y], { r: 5 }); dot(s, [X + 10 * u, Y - 20 * u], { r: 5, color: AMBER });
    txt(s, X - 8, Y, 'ant', { size: 14, anchor: 'end' }); txt(s, X + 10 * u + 8, Y - 20 * u, 'sugar', { size: 14, anchor: 'start' });
    txt(s, X + 10 * u + 8, Y - 5 * u, '10 cm', { size: 14, anchor: 'start', halo: false }); txt(s, X - 8, Y - 15 * u, '10 cm', { size: 14, anchor: 'end', halo: false });
    txt(s, X + 64, Y - 120, '≈ 22.4 cm', { size: 15, color: RED, weight: 800, anchor: 'start' });
  },
  bar200(host) { const s = figSvg(host, 280, 52); Geo.scaleBar(s, { x: 2, y: 6, scale: '1 cm : 2 m', segments: 4, cmPx: 50, title: false, size: 16 }); },
  ex2bar(host) {
    const s = figSvg(host, 400, 118), cm = 76;
    Geo.scaleBar(s, { x: 12, y: 6, scale: '1 cm : 50 m', segments: 4, cmPx: cm, title: false, size: 17 });
    ruler(s, 30, 58, 4, cm, { h: 38 });
    txt(s, 200, 110, 'the ruler is drawn the same size as the bar', { size: 13, color: SLATE, halo: false });
  },
  apt(host) { const sc = 55, sv = figSvg(host, 410, 310); drawApt(sv, { s: sc, P: ([x, y]) => [14 + x * sc, 298 - y * sc] }, 'full'); },
  symbols(host) {
    const s = figSvg(host, 780, 116), y = 76, F = (x0) => ({ s: 60, P: ([x, yy]) => [x0 + x * 60, y - yy * 60] });
    line(s, [30, y], [190, y], { width: 5, cap: 'butt', cls: '' }); txt(s, 110, y + 26, 'wall', { size: 18 });
    line(s, [290, y], [490, y], { width: 5, cap: 'butt', cls: '' }); planDoor(s, F(330), [0, 0], 0, 1.1, 1, { wall: 5 }); txt(s, 390, y + 26, 'door (and its swing)', { size: 18 });
    line(s, [580, y], [760, y], { width: 5, cap: 'butt', cls: '' }); planWin(s, F(0), [620 / 60, 0], [720 / 60, 0], { wall: 5 }); txt(s, 670, y + 26, 'window', { size: 18 });
  },
  ex8(host) {
    const cp = 34, s = figSvg(host, 10 * cp + 4, 8 * cp + 4), gx = 2, gy = 2;
    let d = ''; for (let i = 0; i <= 10; i++) d += `M${gx + i * cp} ${gy}V${gy + 8 * cp}`; for (let j = 0; j <= 8; j++) d += `M${gx} ${gy + j * cp}H${gx + 10 * cp}`;
    rect(s, gx, gy, 10 * cp, 8 * cp, { fill: '#fff', stroke: 'none', cls: '' }); path(s, d, { stroke: '#d6cfc0', width: 1, cls: '' });
    const g = svgEl('g', { class: 'u6l4-fa' }, s), A = '#b5361b';
    const F = { s: cp, P: ([x, y]) => [gx + x * cp, gy + (8 - y) * cp] };
    const [ax, ay] = F.P([0.5, 7.6]), [bx, by] = F.P([9.5, 0.4]);
    rect(g, ax, ay, bx - ax, by - ay, { width: 4.5, stroke: A, cls: '' });
    planDoor(g, F, [0.8, 0.4], 0, 1.8, 1, { wall: 4.5, color: A });
    planWin(g, F, [3.5, 7.6], [6.5, 7.6], { wall: 4.5, color: A });
    const [b0x, b0y] = F.P([5.5, 5.5]), [b1x, b1y] = F.P([9.5, 2.5]); rect(g, b0x, b0y, b1x - b0x, b1y - b0y, { width: 2.4, stroke: A, cls: '' }); txt(g, (b0x + b1x) / 2, (b0y + b1y) / 2, 'bed', { size: 15, color: A });
    const [d0x, d0y] = F.P([0.5, 6.4]), [d1x, d1y] = F.P([1.5, 4]); rect(g, d0x, d0y, d1x - d0x, d1y - d0y, { width: 2.4, stroke: A, cls: '' });
    const tt = txt(g, (d0x + d1x) / 2, (d0y + d1y) / 2, 'dresser', { size: 12, color: A }); tt.setAttribute('transform', `rotate(-90 ${((d0x + d1x) / 2).toFixed(1)} ${((d0y + d1y) / 2).toFixed(1)})`);
    txt(g, ...F.P([2.8, 1.0]), 'Scale: 1 cm represents 0.5 m', { size: 13, color: A, anchor: 'start' });
  }
};
document.querySelectorAll('.u6l4-fig[data-fig]').forEach((host) => { const f = FIG[host.dataset.fig]; if (f) f(host); });

/* ---------- Example 9: the town map with a measuring tape ---------- */
(function townTape() {
  const host = document.getElementById('u6l4-tape'); if (!host) return;
  const s = 60, F = { s, P: ([x, y]) => [2 * s + x * s, 5 * s - y * s] }, P = F.P;
  const pl = (p, name, dx, dy, color) => ({ name, at: P(p), dx, dy, color });
  const T9 = Geo.mapTape(host, { width: 620, height: 432, scale: '1 cm : 200 m', cmPx: s, bar: false, dp: 1,
    a: P([0, 0]), b: P([2, 0]),
    places: [pl([0, 0], 'Home', -36, 20), pl([4, 3], 'School', -40, -20), pl([6, 1.5], 'Rink', 30, -20), pl([4, 0], '', 0, 0, '#8a8f9c'), pl([4, 1.5], '', 0, 0, '#8a8f9c'), pl([2, 0], '', 0, 0, '#8a8f9c')],
    map: (g) => drawTown(g, F, { places: false }) });
  void T9;
  const btn = document.getElementById('u6l4-hide');
  if (btn) btn.addEventListener('click', () => { const on = host.classList.toggle('u6l4-hid'); btn.textContent = on ? 'Show the reading' : 'Hide the reading'; });
})();

/* ======================================================================================
 * Stand Up Break
 * ====================================================================================== */
const EASY = [0.5, 1, 2, 2.5, 4, 5, 10];
standup('u6l4', {
  intro: 'Write every step, with units. Then check: does your answer make sense?',
  levels: {
    BEG: (r) => r.pick([
      () => { const n = r.pick([2, 3, 4, 5, 8, 10, 20, 25, 50]); return { text: `Write the scale <b>1 cm represents ${n} m</b> as a ratio. Is it a reduction or an enlargement?`, q: '', a: [`${n}\\text{ m}=${n}\\times100=${tn(n * 100)}\\text{ cm}`, `1:${tn(n * 100)}`, '\\text{reduction}'] }; },
      () => { const n = r.pick([1, 2, 5, 10, 20, 25, 50]); return { text: `Write the scale <b>1 cm represents ${n} km</b> as a ratio.`, q: '', a: [`${n}\\text{ km}=${n}\\times100\\,000=${tn(n * 100000)}\\text{ cm}`, `1:${tn(n * 100000)}`] }; }
    ])(),
    PRG: (r) => r.pick([
      () => { let n, d; do { n = r.pick([50, 75, 100, 150, 200, 250]); d = r.int(20, 98) / 10; } while (d * n / 100 > 25); const cm = Math.round(d * n * 100) / 100;
        return { text: `On a <b>1 : ${n}</b> floor plan, a wall is <b>${d} cm</b> long. How long is the real wall, in metres?`, q: '', a: [`${d}\\times${n}=${tn(cm)}\\text{ cm}`, `${tn(cm)}\\div100=${tn(cm / 100)}\\text{ m}`] }; },
      () => { const per = r.pick([1.5, 2, 2.5, 4, 5]), d = r.int(12, 64) / 10, real = Math.round(per * d * 100) / 100;
        return { text: `A plan uses <b>1 cm represents ${per} m</b>. A room is <b>${d} cm</b> long on the plan. How long is the real room?`, q: '', a: [`${d}\\times${per}=${tn(real)}\\text{ m}`] }; }
    ])(),
    MAS: (r) => r.pick([
      () => { const n = r.pick([25000, 50000, 100000, 250000]), km = n / 100000, dist = r.pick([2, 3, 4, 5, 6, 7.5, 8, 9]) * (n >= 100000 ? 2 : 0.5), cm = dist / km;
        return { text: `A map has a scale of <b>1 : ${pn(n)}</b>. Two towns are <b>${dist} km</b> apart. How far apart are they on the map?`, q: '', a: [`1\\text{ cm represents }${tn(n)}\\text{ cm}=${tn(km)}\\text{ km}`, `${tn(dist)}\\div${tn(km)}=${tn(cm)}\\text{ cm}`] }; },
      () => { let L, Wd, per; do { L = r.int(20, 64); Wd = r.int(10, 40); per = Math.max(L / 15, Wd / 10); } while (per > 10 || Wd >= L);
        const e = EASY.find((x) => x >= per - 1e-9);
        return { text: `A yard is <b>${L} m by ${Wd} m</b>. Choose an easy scale to draw it in a space <b>15 cm by 10 cm</b>. Then find its size on the drawing.`, q: '',
          a: [`${L}\\div15=${n1(L / 15, 2)},\\quad ${Wd}\\div10=${n1(Wd / 10, 2)}`, `\\text{round up: 1 cm represents ${e} m}`, `${L}\\div${e}=${n1(L / e, 2)}\\text{ cm},\\quad ${Wd}\\div${e}=${n1(Wd / e, 2)}\\text{ cm}`] }; }
    ])()
  }
});
void fmt; void GREEN; void GREY;
