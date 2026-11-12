/* Math 10-3 · Unit 5 · Lesson 7 — Transversals: Naming the Angle Pairs.
 * Explainers (Class view unless marked Full): what a transversal is (a moving line; Example 1 checks), numbering the
 * eight angles (a pointer sweeps clockwise; interior band; left/right of t; Example 2 table check), corresponding /
 * vertically opposite / straight-line pairs with their letter shapes (Example 3 check), why "add 4" works (Full: the
 * top crossing slides down t), alternate and same-side pairs (Z, C/U), the three-question machine (Example 4 checks),
 * real pictures (ladder, rails, the street map turned so the transversal goes up and down: Examples 5 and 6), a line
 * that tilts so the pairs stop matching (Example 7), why the one-crossing rules are always true (Full), and finding all
 * eight angles when the lines are not parallel (Example 8).
 * Hands-on: "name the pair" (tap two angles) and "turn ℓ2" (slider; sizes and verdicts). Static figures, the Math
 * History box (Euclid's fifth postulate) and the Stand Up Break.
 * Uses the shared geometry toolkit js/geo.js (Geo.transversal: 1–4 top crossing, 5–8 bottom, clockwise from upper left). */
import { h, add, box, tex, svgEl, tween, pop, appear, pulse, stamp, stampIn, mountExplainers } from '../blocks.js';
import { Geo, wedgeD, at, dirTo, text as gtext } from '../geo.js';
import { standup } from '../standup.js';

const A = (k) => tex(`\\angle ${k}`);
const D = (v) => tex(`${v}^\\circ`);
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const lab = (host, html, cx, cy, w = 80, hh = 40, cls = '') => add(host, box(h('div', 'u5l7-fl ' + cls, `<span>${html}</span>`), w, hh), cx - w / 2, cy - hh / 2);
const bx = (host, cls, html, x, y, w, hh) => add(host, box(h('div', cls, html), w, hh), x, y);
const stageSvg = (stage, W, H) => add(stage, svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u5l7-svg' }), 0, 0);
const popable = (el) => { el.style.transformBox = 'fill-box'; el.style.transformOrigin = 'center'; return el; };
const show = (c, el, ms = 320) => appear(c, el, ms);
const INK = '#1c2230', ORG = '#e07b12', BLU = '#1f5bd6', GRN = '#12805a', RED = '#c93a33', AMB = '#c27a0e', GRY = '#6a7182';
const PC = Geo.PAIR_COLORS;
const KCOL = (k) => PC[k] || GRY;

/* ---------------- the numbered diagram: facts about each angle ---------------- */
const POS = ['upper left', 'upper right', 'lower right', 'lower left'];
const pos = (k) => POS[(k - 1) % 4];
const isTop = (k) => k <= 4;
const isInt = (k) => [3, 4, 5, 6].includes(k);
const isLeft = (k) => [1, 4, 5, 8].includes(k);
const NAMES = { corresponding: 'corresponding angles', 'alt-int': 'alternate interior angles', 'alt-ext': 'alternate exterior angles',
  'int-same': 'interior angles on the same side of the transversal', 'ext-same': 'exterior angles on the same side of the transversal',
  'vert-opp': 'vertically opposite angles', linear: 'next to each other: a straight line', none: 'no special name' };
const SHORT = { corresponding: 'corresponding', 'alt-int': 'alternate interior', 'alt-ext': 'alternate exterior', 'int-same': 'interior, same side',
  'ext-same': 'exterior, same side', 'vert-opp': 'vertically opposite', linear: 'a straight line (180°)', none: 'no special name' };
const SHAPE = { corresponding: 'F', 'alt-int': 'Z', 'int-same': 'C or U', 'vert-opp': 'X' };
/** the three questions for a pair → { same, io, side, key } */
function classify(a, b) {
  const key = Geo.pairName(a, b) || 'none';
  if (isTop(a) === isTop(b)) return { same: true, io: '—', side: '—', key };
  const io = isInt(a) && isInt(b) ? 'both interior' : !isInt(a) && !isInt(b) ? 'both exterior' : 'one of each';
  return { same: false, io, side: isLeft(a) === isLeft(b) ? 'same side' : 'opposite sides', key };
}
const nameHTML = (key) => NAMES[key] + (SHAPE[key] ? ` (${SHAPE[key]})` : '');
/* the booklet's standard diagram (ℓ1 across, ℓ2 turned 10°, t at 65°), and the parallel one */
const STD = { parallel: false, skew: -10, tilt: 65 };
const PAR = { parallel: true, tilt: 65 };

/* ---------------- drawing helpers on a Geo.transversal ---------------- */
function lineEnds(T, which) { const n = T.lines[which].getAttribute('d').match(/-?[\d.]+/g).map(Number); return [[n[0], n[1]], [n[2], n[3]]]; }
const under = (T, el) => { T.g.insertBefore(el, T.g.firstChild); return el; };
/** the band between ℓ1 and ℓ2 (interior) */
function band(T, color = '#e2a63a', op = 0.2) {
  const [a, b] = lineEnds(T, 'top'), [c, d] = lineEnds(T, 'bottom');
  return under(T, svgEl('path', { d: `M${a}L${b}L${d}L${c}Z`, fill: color, 'fill-opacity': op }));
}
let CLIP = 0;
/** tint one side of t (left: true = the side t + 90°), clipped to the figure box */
function sideTint(T, W, H, left, color, op = 0.1) {
  const id = 'u5l7c' + (++CLIP), defs = svgEl('defs', {}, T.svg), cp = svgEl('clipPath', { id }, defs);
  svgEl('rect', { x: 0, y: 0, width: W, height: H }, cp);
  const td = T.tilt, P1 = at(T.T, td, 3000), P2 = at(T.T, td + 180, 3000), s = left ? 90 : -90;
  const P3 = at(P2, td + s, 3000), P4 = at(P1, td + s, 3000);
  return under(T, svgEl('path', { d: `M${P1}L${P2}L${P3}L${P4}Z`, fill: color, 'fill-opacity': op, 'clip-path': `url(#${id})` }));
}
/** a coloured wedge on angle k */
function wedgeK(T, k, color, r = 46, op = 0.32) { const cn = T.corner(k); return popable(svgEl('path', { d: wedgeD(cn.X, r, cn.start, cn.span), fill: color, 'fill-opacity': op }, T.g)); }
const dotAt = (parent, p, color = INK, r = 7) => popable(svgEl('circle', { cx: p[0], cy: p[1], r, fill: color }, parent));
/** hide the numerals of a Geo diagram (they pop in later) */
const hideNums = (T, ks = [1, 2, 3, 4, 5, 6, 7, 8]) => ks.forEach((k) => hide(T.label(k)));

/* ======================================================================================
 * 1. What is a transversal? (a moving line) + Example 1 checks
 * ====================================================================================== */
/* Example 1 diagrams in booklet cm (TikZ coordinates). (b): t drawn exactly through the point where m and n cross. */
const EX1 = {
  a: { lines: { m: [[-0.3, 1.6], [3.6, 1.6], 'r'], n: [[-0.3, 0.15], [3.6, -0.25], 'r'], t: [[0.9, -0.9], [2.4, 2.6], 'a']}, par: [], ans: true,
    why: `${tex('t')} crosses ${tex('m')} and ${tex('n')} at <b>two different points</b>.` },
  b: { lines: { m: [[-0.2, 0], [3.4, 1.5], 'r'], n: [[-0.2, 1.6], [3.4, -0.1], 'r'], t: [[1.32, -0.9], [1.92, 2.6], 'a']}, par: [], ans: false,
    why: `${tex('t')} goes through the point where ${tex('m')} and ${tex('n')} cross: only <b>one point</b>.` },
  c: { lines: { t: [[-0.3, 1.6], [3.6, 1.6], 'r'], n: [[-0.3, 0], [3.6, 0], 'r'], m: [[0.6, -0.8], [2.3, 2.5], 'a']}, par: [[3, 1.6], [3, 0]], ans: false,
    why: `${tex('t')} is <b>parallel</b> to ${tex('n')} (matching arrows), so it never crosses ${tex('n')}.` },
  d: { lines: { m: [[-0.3, 1.6], [3.6, 1.6], 'r'], n: [[-0.3, 0], [3.6, 0], 'r'], t: [[2.4, -0.9], [0.6, 2.5], 'a']}, par: [[0.2, 1.6], [0.2, 0]], ans: true,
    why: `${tex('t')} crosses both lines at <b>two different points</b>. Parallel lines can have a transversal.` }
};
/** a parallel-line arrow mark (>) at p (px), pointing along direction ang */
function chevron(parent, p, ang, color = INK, s = 1) {
  const tip = at(p, ang, 5 * s), back = at(p, ang + 180, 6 * s), u = at(back, ang + 90, 7 * s), v = at(back, ang - 90, 7 * s);
  return svgEl('path', { d: `M${u}L${tip}L${v}`, fill: 'none', stroke: color, 'stroke-width': 2.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, parent);
}
function drawEx1(parent, d, s, ox, oy, size = 20) {
  const P = ([x, y]) => [ox + s * x, oy - s * y], out = { lines: {}, P };
  for (const nm in d.lines) {
    const [a, b, where] = d.lines[nm], pa = P(a), pb = P(b);
    out.lines[nm] = { el: svgEl('path', { d: `M${pa}L${pb}`, stroke: INK, 'stroke-width': 3, 'stroke-linecap': 'round', fill: 'none' }, parent), a: pa, b: pb };
    const lp = where === 'r' ? [pb[0] + size * 0.75, pb[1]] : [pb[0], pb[1] - size * 0.8];
    out.lines[nm].lab = gtext(parent, lp[0], lp[1], nm, { size, italic: true });
  }
  d.par.forEach((p) => chevron(parent, P(p), 0));
  return out;
}
function lineX(a, b, c, d) { // intersection of the infinite lines ab and cd (px), or null when parallel
  const r = [b[0] - a[0], b[1] - a[1]], s = [d[0] - c[0], d[1] - c[1]], den = r[0] * s[1] - r[1] * s[0];
  if (Math.abs(den) < 1e-6) return null;
  const u = ((c[0] - a[0]) * s[1] - (c[1] - a[1]) * s[0]) / den; return [a[0] + u * r[0], a[1] + u * r[1]];
}
const transversal = {
  title: 'What is a transversal?',
  height: 420, minW: 960,
  choices: [{ v: 'what', label: 'A line that crosses two lines' }, { sep: 'Example 1 check:' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }, { v: 'c', label: '(c)' }, { v: 'd', label: '(d)' }],
  ask: (v) => (v === 'what' ? 'When is a line a <b>transversal</b>?' : `Example 1 (${v}): Is line ${tex('t')} a transversal of lines ${tex('m')} and ${tex('n')}?`),
  make(stage, v, ex) {
    const W = ex.W, H = 420, ox = (W - 960) / 2, svg = stageSvg(stage, W, H);
    if (v !== 'what') return ex1Check(stage, svg, EX1[v], ox);
    svg.style.overflow = 'hidden';
    const X = [ox + 250, 205], a1 = 12, a2 = -8;                             // ℓ1 and ℓ2 cross at X, on the left
    const L1 = at(X, a1 + 180, 230), L2 = at(X, a2 + 180, 230);
    const ln = (P, a, len) => svgEl('path', { d: `M${P}L${at(P, a, len)}`, stroke: INK, 'stroke-width': 3.2, 'stroke-linecap': 'round' }, svg);
    ln(L1, a1, 940); ln(L2, a2, 940);
    const e1 = at(L1, a1, 940), e2 = at(L2, a2, 940);
    gtext(svg, e1[0] - 30, e1[1] - 24, 'ℓ₁', { size: 24, italic: true }); gtext(svg, e2[0] - 30, e2[1] + 26, 'ℓ₂', { size: 24, italic: true });
    const tl = svgEl('path', { stroke: ORG, 'stroke-width': 3.6, 'stroke-linecap': 'round' }, svg);
    const tlab = gtext(svg, 0, 0, 't', { size: 24, italic: true, color: ORG });
    const d1 = dotAt(svg, [0, 0], BLU, 8), d2 = dotAt(svg, [0, 0], GRN, 8);
    const st = { q: [ox + 620, 190], th: 70 };
    const draw = () => {
      const E1 = at(st.q, st.th, 700), E2 = at(st.q, st.th + 180, 700);
      tl.setAttribute('d', `M${E1}L${E2}`);
      const lp = at(st.q, st.th, 150); tlab.setAttribute('x', lp[0] + 18); tlab.setAttribute('y', lp[1]);
      const p1 = lineX(st.q, E1, L1, at(L1, a1, 100)), p2 = lineX(st.q, E1, L2, at(L2, a2, 100));
      const put = (d, p) => { const ok = p && p[0] > ox && p[0] < ox + 960 && p[1] > 0 && p[1] < H; d.setAttribute('cx', ok ? p[0] : -99); d.setAttribute('cy', ok ? p[1] : -99); return ok; };
      const o1 = put(d1, p1), o2 = put(d2, p2), same = o1 && o2 && Math.hypot(p1[0] - p2[0], p1[1] - p2[1]) < 6;
      cnt.innerHTML = `crossing points: <b>${same ? 1 : (o1 ? 1 : 0) + (o2 ? 1 : 0)}</b>`;
    };
    const cnt = bx(stage, 'u5l7-box', '', ox + 20, 20, 250, 48);
    const verdict = bx(stage, 'u5l7-nmbox', '', ox + 20, 340, 300, 64);
    hide(tl, tlab, d1, d2, cnt, verdict);
    const setV = (ok, txt) => { verdict.style.background = ok ? GRN : RED; verdict.innerHTML = (ok ? '✓ ' : '✗ ') + txt; };
    draw();
    const move = (c, q, th, ms = 1600) => { const q0 = st.q.slice(), th0 = st.th; return tween(c, ms, (t) => { st.q = [q0[0] + (q[0] - q0[0]) * t, q0[1] + (q[1] - q0[1]) * t]; st.th = th0 + (th - th0) * t; draw(); }); };
    return [
      { cap: 'Two lines, <b>ℓ₁</b> and <b>ℓ₂</b>. A line goes on forever: we only draw part of it.', run: async (c) => { await show(c, tl); await show(c, tlab); } },
      { cap: `Line ${tex('t')} crosses ℓ₁ at one point and ℓ₂ at a <b>different</b> point: <b>2 crossing points</b>.`, run: async (c) => { await pop(c, d1); await pop(c, d2); await show(c, cnt); } },
      { cap: `So ${tex('t')} is a <b>transversal</b> of ℓ₁ and ℓ₂.`, run: async (c) => { setV(true, 'transversal'); await pop(c, verdict); } },
      { cap: `Slide ${tex('t')} until it goes through the point where ℓ₁ and ℓ₂ cross…`, run: async (c) => { await c.anim(verdict, [{ opacity: 0 }], 200); await move(c, X, 70); } },
      { cap: 'Now it meets them at only <b>one point</b>: <b>not</b> a transversal.', run: async (c) => { setV(false, 'not a transversal'); await pop(c, verdict); } },
      { cap: `Turn ${tex('t')} until it is <b>parallel</b> to ℓ₂. It never crosses ℓ₂…`, run: async (c) => { await c.anim(verdict, [{ opacity: 0 }], 200); await move(c, [ox + 720, 200], a2, 2200); } },
      { cap: 'It crosses only ℓ₁: <b>not</b> a transversal. A transversal crosses the lines at <b>two different points</b>.', run: async (c) => { setV(false, 'not a transversal'); await pop(c, verdict); } }
    ];
  }
};
function ex1Check(stage, svg, d, ox) {
  const s = 96, F = drawEx1(svg, d, s, ox + 50, 40 + 3.0 * s, 26), tln = F.lines.t;
  tln.el.setAttribute('stroke', ORG); tln.lab.setAttribute('fill', ORG);
  const others = ['m', 'n'].map((nm) => ({ nm, L: F.lines[nm], p: lineX(tln.a, tln.b, F.lines[nm].a, F.lines[nm].b) }));
  const dots = others.map((o, i) => (o.p ? dotAt(svg, o.p, i ? GRN : BLU, 8) : null));
  const same = others[0].p && others[1].p && Math.hypot(others[0].p[0] - others[1].p[0], others[0].p[1] - others[1].p[1]) < 4;
  const X0 = ox + 520;
  const rows = others.map((o, i) => bx(stage, 'u5l7-row', `<span>Where does ${tex('t')} meet ${tex(o.nm)}?</span><span class="u5l7-a">${o.p ? (same && i ? `the same point as ${tex('m')}!` : 'one point') : 'never (parallel)'}</span>`, X0, 40 + i * 62, 430, 52));
  const verdict = bx(stage, 'u5l7-nmbox', (d.ans ? '✓ Yes: a transversal' : '✗ No: not a transversal'), X0, 190, 430, 62);
  verdict.style.background = d.ans ? GRN : RED;
  const why = bx(stage, 'u5l7-box', d.why, X0, 270, 430, 100);
  hide(...dots, ...rows, verdict, why);
  const parL = others.find((o) => !o.p);
  return [
    { cap: `Find where ${tex('t')} meets ${tex('m')}.`, run: async (c) => { if (dots[0]) await pop(c, dots[0]); else await pulse(c, others[0].L.el, 1.02); await show(c, rows[0]); } },
    { cap: `Find where ${tex('t')} meets ${tex('n')}.`, run: async (c) => { if (dots[1]) await pop(c, dots[1]); if (parL) { parL.L.el.setAttribute('stroke', RED); } await show(c, rows[1]); } },
    { cap: d.ans ? '<b>Two different points</b>: yes, a transversal.' : `<b>No</b>: a transversal needs two different crossing points.`, run: async (c) => { await stampIn(c, verdict); await show(c, why); } }
  ];
}

/* ======================================================================================
 * 1b. Number the eight angles + Example 2 check (the table)
 * ====================================================================================== */
/** a pointer that sweeps once clockwise around vertex V, popping the numbers as it passes them */
async function sweep(c, T, ks, color = ORG, ms = 2600) {
  const V = T.corner(ks[0]).X, mids = ks.map((k) => { const cn = T.corner(k); return cn.start + cn.span / 2; });
  const a0 = mids[0] + 25, g = svgEl('g', {}, T.g);
  const trail = svgEl('path', { fill: 'none', stroke: color, 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.8 }, g), ptr = svgEl('circle', { r: 8, fill: color }, g);
  const passed = ks.map((k, i) => ((a0 - mids[i]) % 360 + 360) % 360);
  const R = 66;
  await tween(c, ms, (t) => {
    const sw = 335 * t, a = a0 - sw, p = at(V, a, R);
    ptr.setAttribute('cx', p[0]); ptr.setAttribute('cy', p[1]);
    const s0 = at(V, a0, R), e0 = p, large = sw > 180 ? 1 : 0;
    trail.setAttribute('d', sw > 0.5 ? `M${s0}A${R} ${R} 0 ${large} 1 ${e0}` : '');
    ks.forEach((k, i) => { const el = T.label(k); if (sw >= passed[i] && el.style.opacity !== '1') { el.style.opacity = 1; if (!c.fast) el.animate([{ transform: 'scale(.4)' }, { transform: 'scale(1.2)' }, { transform: 'scale(1)' }], 380); } });
  }, (t) => t);
  ks.forEach((k) => (T.label(k).style.opacity = 1));
  await appear(c, g, 1); g.remove();
}
const TROWS = [
  { h: 'Top or bottom crossing?', f: (k) => (isTop(k) ? 'top' : 'bottom') },
  { h: 'Interior or exterior?', f: (k) => (isInt(k) ? 'int.' : 'ext.') },
  { h: `Left or right of ${tex('t')}?`, f: (k) => (isLeft(k) ? 'left' : 'right') }
];
const number = {
  title: 'Numbering the eight angles',
  height: 430, minW: 960,
  choices: [{ v: 'num', label: 'Number the angles' }, { sep: 'Example 2 check:' }, { v: 'tbl', label: 'the table' }],
  ask: (v) => (v === 'num' ? 'How do we number the eight angles a transversal makes?' : 'Example 2: complete the table for all eight angles.'),
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 960) / 2, FW = v === 'num' ? 540 : 380, FH = 408;
    const T = Geo.transversal(stage, Object.assign({ x: ox, y: 18, w: FW, h: FH, size: 25, nameSize: 23 }, STD));
    hideNums(T);
    const bnd = hide(band(T)), tl = hide(sideTint(T, FW, FH, true, '#7b4fc4', 0.12)), tr = hide(sideTint(T, FW, FH, false, '#12805a', 0.12));
    const wT = [1, 2, 3, 4].map((k) => hide(wedgeK(T, k, BLU, 50, 0.22))), wB = [5, 6, 7, 8].map((k) => hide(wedgeK(T, k, BLU, 50, 0.22)));
    const iw = [3, 4, 5, 6].map((k) => hide(wedgeK(T, k, AMB, 40, 0.35))), ew = [1, 2, 7, 8].map((k) => hide(wedgeK(T, k, BLU, 40, 0.3)));
    const flash = async (c, ws) => { await Promise.all(ws.map((w) => pop(c, w))); await c.sleep(450); await Promise.all(ws.map((w) => c.anim(w, [{ opacity: 0 }], 300))); };
    const tagI = hide(lab(stage, '<b>interior</b>', ox + 70, 4 + FH / 2, 120, 30, 'u5l7-tag')), tagL = hide(lab(stage, `left of ${tex('t')}`, ox + 80, 40, 140, 30, 'u5l7-tag')), tagR = hide(lab(stage, `right of ${tex('t')}`, ox + FW - 80, FH - 30, 140, 30, 'u5l7-tag'));
    const toWedges = (ks, col) => ks.map((k) => hide(wedgeK(T, k, col, 40, 0.35)));
    if (v === 'num') {
      const X0 = ox + 560, rw = 400;
      const rows = [
        bx(stage, 'u5l7-row', '<span><b>Top</b> crossing</span><span class="u5l7-a">1, 2, 3, 4 ↻</span>', X0, 20, rw, 54),
        bx(stage, 'u5l7-row', '<span><b>Bottom</b> crossing</span><span class="u5l7-a">5, 6, 7, 8 ↻</span>', X0, 84, rw, 54),
        bx(stage, 'u5l7-row', '<span><b>Interior</b> (between)</span><span class="u5l7-a">3, 4, 5, 6</span>', X0, 160, rw, 54),
        bx(stage, 'u5l7-row', '<span><b>Exterior</b> (outside)</span><span class="u5l7-a">1, 2, 7, 8</span>', X0, 224, rw, 54),
        bx(stage, 'u5l7-row', `<span><b>Left</b> of ${tex('t')}</span><span class="u5l7-a">1, 4, 5, 8</span>`, X0, 300, rw, 54),
        bx(stage, 'u5l7-row', `<span><b>Right</b> of ${tex('t')}</span><span class="u5l7-a">2, 3, 6, 7</span>`, X0, 364, rw, 54)
      ];
      hide(...rows);
      return [
        { cap: 'A transversal crossing two lines makes <b>eight angles</b>: four at each crossing.', run: async (c) => { await flash(c, wT); await flash(c, wB); } },
        { cap: 'Top crossing: <b>1, 2, 3, 4</b> go <b>clockwise</b>, starting at the <b>upper left</b>.', run: async (c) => { await sweep(c, T, [1, 2, 3, 4]); await show(c, rows[0]); } },
        { cap: 'Bottom crossing: <b>5, 6, 7, 8</b>, the same way: clockwise from the upper left.', run: async (c) => { await sweep(c, T, [5, 6, 7, 8]); await show(c, rows[1]); } },
        { cap: '<b>Interior</b> angles are <b>between</b> the two lines: 3, 4, 5 and 6.', run: async (c) => { await show(c, bnd); await show(c, tagI); await Promise.all(iw.map((w) => pop(c, w))); await show(c, rows[2]); } },
        { cap: '<b>Exterior</b> angles are <b>outside</b> the two lines: 1, 2, 7 and 8.', run: async (c) => { await Promise.all(ew.map((w) => pop(c, w))); await show(c, rows[3]); } },
        { cap: `Each angle is also on the <b>left</b> or the <b>right</b> of ${tex('t')}.`, run: async (c) => {
          await Promise.all([...iw, ...ew, bnd, tagI].map((w) => c.anim(w, [{ opacity: 0 }], 300)));
          await show(c, tl); await show(c, tagL); await show(c, rows[4]); await show(c, tr); await show(c, tagR); await show(c, rows[5]); } }
      ];
    }
    // Example 2: the table, filled row by row
    hideNums(T, []); [1, 2, 3, 4, 5, 6, 7, 8].forEach((k) => (T.label(k).style.opacity = 1));
    const X0 = ox + 392, tb = add(stage, h('table', 'u5l7-xt u5l7-xt8'), X0, 60); tb.style.width = '566px';
    tb.innerHTML = `<tr><th style="width:172px">Angle</th>${[1, 2, 3, 4, 5, 6, 7, 8].map((k) => `<th>${A(k)}</th>`).join('')}</tr>` +
      TROWS.map((r, i) => `<tr><td>${r.h}</td>${[1, 2, 3, 4, 5, 6, 7, 8].map((k) => `<td><span class="u5l7-cv" data-r="${i}">${r.f(k)}</span></td>`).join('')}</tr>`).join('');
    const cells = [0, 1, 2].map((i) => [...tb.querySelectorAll(`.u5l7-cv[data-r="${i}"]`)]);
    cells.flat().forEach((e) => hide(e));
    const fill = async (c, i) => { for (const e of cells[i]) await c.anim(e, [{ opacity: 0 }, { opacity: 1 }], 120); };
    const top4 = toWedges([1, 2, 3, 4], BLU), bot4 = toWedges([5, 6, 7, 8], GRN), iw2 = toWedges([3, 4, 5, 6], AMB);
    const fadeAll = (c, els) => Promise.all(els.map((w) => c.anim(w, [{ opacity: 0 }], 250)));
    return [
      { cap: '<b>1, 2, 3, 4</b> are at the <b>top</b> crossing; <b>5, 6, 7, 8</b> at the <b>bottom</b>.', run: async (c) => { await Promise.all(top4.map((w) => pop(c, w))); await Promise.all(bot4.map((w) => pop(c, w))); await fill(c, 0); } },
      { cap: '<b>Interior</b> (between the lines): 3, 4, 5, 6. The others are <b>exterior</b>.', run: async (c) => { await fadeAll(c, [...top4, ...bot4]); await show(c, bnd); await Promise.all(iw2.map((w) => pop(c, w))); await fill(c, 1); } },
      { cap: `<b>Left</b> of ${tex('t')}: 1, 4, 5, 8. <b>Right</b>: 2, 3, 6, 7.`, run: async (c) => { await fadeAll(c, [...iw2, bnd]); await show(c, tl); await show(c, tr); await show(c, tagL); await show(c, tagR); await fill(c, 2); } }
    ];
  }
};

/* ======================================================================================
 * 2–3. The angle pairs on the diagram, with their letter shapes
 * ====================================================================================== */
const SETS = {
  corresponding: { pairs: Geo.PAIRS.corresponding, title: 'corresponding angles (F)', say: (a, b) => `${A(a)} and ${A(b)} are both <b>${pos(a)}</b> at their crossing: <b>corresponding</b>.`, row: (a) => pos(a),
    end: { cap: 'Easy to remember: <b>add 4</b>. They make an <b>F</b> (backwards, upside down or tilted).', res: '1 & 5, 2 & 6, 3 & 7, 4 & 8: add 4' } },
  'vert-opp': { pairs: Geo.PAIRS['vert-opp'], title: 'vertically opposite angles (X)', say: (a, b) => `${A(a)} and ${A(b)}: <b>across from each other</b> at the <b>same</b> crossing, like an X.`, row: (a) => (isTop(a) ? 'top crossing' : 'bottom crossing'),
    end: { cap: 'Vertically opposite angles are <b>always equal</b> (Lesson 6).', res: 'always equal' } },
  linear: { pairs: [[1, 2], [1, 4], [6, 7]], title: 'next to each other: a straight line', say: (a, b) => `${A(a)} and ${A(b)} sit <b>next to each other</b> at one crossing. Together they make a <b>straight line</b>.`, row: (a, b) => { const j = [(a - 1) % 4, (b - 1) % 4].sort().join(); return j === '0,1' || j === '2,3' ? (isTop(a) ? 'along ℓ₁' : 'along ℓ₂') : `along ${tex('t')}`; },
    end: { cap: 'Two angles next to each other on a straight line add to <b>180°</b>: they are <b>supplementary</b>.', res: 'they add to 180°' } },
  'alt-int': { pairs: Geo.PAIRS['alt-int'], title: 'alternate interior angles (Z)', say: (a, b) => `${A(a)} and ${A(b)}: both <b>between</b> the lines, on <b>opposite sides</b> of ${tex('t')}.`, row: () => 'both interior, opposite sides',
    end: { cap: 'Alternate interior angles make a <b>Z</b> shape.', res: '3 & 5, 4 & 6: a Z' } },
  'alt-ext': { pairs: Geo.PAIRS['alt-ext'], title: 'alternate exterior angles', say: (a, b) => `${A(a)} and ${A(b)}: both <b>outside</b> the lines, on <b>opposite sides</b> of ${tex('t')}.`, row: () => 'both exterior, opposite sides',
    end: { cap: '<b>Alternate</b> means one on each side of the transversal.', res: '1 & 7, 2 & 8' } },
  'int-same': { pairs: [[3, 6], [4, 5]], title: 'interior angles on the same side (C or U)', say: (a, b) => `${A(a)} and ${A(b)}: both <b>between</b> the lines, on the <b>same side</b> of ${tex('t')}.`, row: (a) => `both interior, ${isLeft(a) ? 'left' : 'right'} side`,
    end: { cap: 'They make a <b>C</b> (or a <b>U</b> when it is turned).', res: '3 & 6, 4 & 5: a C or U' } },
  'ext-same': { pairs: [[1, 8], [2, 7]], title: 'exterior angles on the same side', say: (a, b) => `${A(a)} and ${A(b)}: both <b>outside</b> the lines, on the <b>same side</b> of ${tex('t')}.`, row: (a) => `both exterior, ${isLeft(a) ? 'left' : 'right'} side`,
    end: { cap: 'Same side of the transversal, at different crossings, both outside.', res: '1 & 8, 2 & 7' } },
  none: { pairs: [[1, 6], [3, 8]], title: 'no special name', say: (a, b) => `${A(a)} and ${A(b)}: one interior, one exterior, on <b>opposite sides</b>. No special name.`, row: () => 'one of each, opposite sides',
    end: { cap: 'The four pairs with no name: 1 & 6, 2 & 5, 3 & 8, 4 & 7.', res: '1 & 6, 2 & 5, 3 & 8, 4 & 7' } }
};
const EX3 = [
  { pair: [2, 6], cap: `(a) ${A(2)} is upper right at the top crossing. Upper right at the bottom: ${A(6)}.`, ans: `(a) ${A(6)}` },
  { pair: [8, 4], cap: `(b) ${A(8)} is lower left at the bottom crossing. Lower left at the top: ${A(4)}.`, ans: `(b) ${A(4)}` },
  { pair: [5, 7], cap: `(c) Across from ${A(5)} at the same crossing: ${A(7)}.`, ans: `(c) ${A(7)}` },
  { pair: [2, 4], cap: `(d) Across from ${A(2)} at the same crossing: ${A(4)}.`, ans: `(d) ${A(4)}` },
  { pair: [6, 8], cap: `(e) ${A(6)} and ${A(8)} are across from each other at the bottom crossing: <b>vertically opposite angles</b>.`, ans: `(e) ${A(6)} &amp; ${A(8)}` },
  { pair: [4, 1], cap: `(f) ${A(4)} and ${A(1)} together make a straight line (along ${tex('t')}): <b>180°</b>.`, ans: `(f) ${A(4)} + ${A(1)} = ${D(180)}` }
];
function pairsDef(title, keys, ex3) {
  const choices = keys.map((k) => ({ v: k, label: SHORT[k] === 'a straight line (180°)' ? 'next to each other' : SHORT[k] + (SHAPE[k] ? ` (${SHAPE[k]})` : '') }));
  if (ex3) choices.push({ sep: 'Example 3 check:' }, { v: 'ex3', label: '(a) to (f)' });
  return {
    title, height: 430, minW: 960, choices,
    ask: (v) => (v === 'ex3' ? 'Example 3: name the corresponding or vertically opposite angle in (a) to (f).' : `Where are the <b>${SETS[v].title.replace(/ \(.*\)$/, '')}</b>?`),
    make(stage, v, ex) {
      const W = ex.W, ox = (W - 960) / 2, X0 = ox + 610, rw = 345;
      const T = Geo.transversal(stage, Object.assign({ x: ox, y: 18, w: 590, h: 408, size: 25, nameSize: 23 }, v === 'ex3' ? STD : PAR));
      if (v === 'ex3') {
        const rows = EX3.map((e, i) => hide(bx(stage, 'u5l7-row', `<span>${e.ans}</span><span class="u5l7-a">${SHORT[Geo.pairName(e.pair[0], e.pair[1])]}</span>`, X0, 12 + i * 62, rw, 52)));
        return EX3.map((e, i) => ({ cap: e.cap, run: async (c) => { T.clearHighlight(); rows.forEach((r) => r.classList.remove('on')); await T.highlight(c, e.pair, { name: false }); rows[i].classList.add('on'); await show(c, rows[i]); } }));
      }
      const S = SETS[v], col = KCOL(v);
      const nm = bx(stage, 'u5l7-nmbox', S.title, X0, 12, rw, 62); nm.style.background = col;
      const rows = S.pairs.map(([a, b], i) => hide(bx(stage, 'u5l7-row', `<span>${A(a)} &amp; ${A(b)}</span><span class="u5l7-a">${S.row(a, b)}</span>`, X0, 92 + i * 60, rw, 50)));
      const res = hide(bx(stage, 'u5l7-res', S.end.res, X0, 92 + S.pairs.length * 60 + 14, rw, 50));
      res.style.position = 'absolute';
      const steps = S.pairs.map(([a, b], i) => ({ cap: S.say(a, b), run: async (c) => {
        T.clearHighlight(); rows.forEach((r) => r.classList.remove('on'));
        await T.highlight(c, [a, b], { name: false, color: col }); rows[i].classList.add('on'); await show(c, rows[i]);
      } }));
      steps.push({ cap: S.end.cap, run: (c) => pop(c, res) });
      return steps;
    }
  };
}
const pairsA = pairsDef('Corresponding, vertically opposite, and side by side', ['corresponding', 'vert-opp', 'linear'], true);
const pairsB = pairsDef('Alternate angles and same-side angles', ['alt-int', 'alt-ext', 'int-same', 'ext-same', 'none'], false);

/* Full notes: why "add 4" — the whole top crossing slides down t onto the bottom crossing */
const slide4 = {
  title: 'Slide the top crossing down the transversal',
  height: 430, minW: 960,
  ask: 'Why are the corresponding pairs 1 & 5, 2 & 6, 3 & 7 and 4 & 8?',
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 960) / 2, X0 = ox + 610;
    const T = Geo.transversal(stage, Object.assign({ x: ox, y: 18, w: 590, h: 408, size: 25, nameSize: 23 }, PAR));
    const cols = [BLU, GRN, AMB, '#7b4fc4'];
    const ws = [1, 2, 3, 4].map((k, i) => hide(wedgeK(T, k, cols[i], 46, 0.35)));
    const rows = [1, 2, 3, 4].map((k, i) => hide(bx(stage, 'u5l7-row', `<span>${A(k)} lands on ${A(k + 4)}</span><span class="u5l7-a" style="color:${cols[i]}">${pos(k)}</span>`, X0, 20 + i * 62, 345, 52)));
    const res = hide(bx(stage, 'u5l7-res', 'same position, number + 4', X0, 290, 345, 52)); res.style.position = 'absolute';
    return [
      { cap: 'Colour the four angles at the <b>top</b> crossing.', run: (c) => Promise.all(ws.map((w) => pop(c, w))) },
      { cap: 'Slide a copy of the whole top crossing <b>down the transversal</b>…', run: async (c) => { await Promise.all([1, 2, 3, 4].map((k, i) => T.slide(c, k, 1600, { color: cols[i] }))); } },
      { cap: 'Each angle lands on the angle in the <b>same position</b> at the bottom crossing.', run: async (c) => { for (const r of rows) await show(c, r, 220); } },
      { cap: 'The bottom numbers are 4 more: <b>add 4</b>. Going up, subtract 4: the angle corresponding to ∠8 is ∠4.', run: (c) => pop(c, res) }
    ];
  }
};

/* ======================================================================================
 * 3b. The three-question machine + Example 4 checks
 * ====================================================================================== */
const SORT = [[3, 5], [2, 8], [3, 6], [1, 8], [1, 5], [2, 3], [1, 6]];
const EX4B = [
  { given: 4, key: 'alt-int', ans: 6, q: `alternate interior to ${A(4)}`, why: `between the lines, on the other side of ${tex('t')}, at the other crossing` },
  { given: 7, key: 'ext-same', ans: 2, q: `exterior on the same side as ${A(7)}`, why: `outside the lines, on the right of ${tex('t')}, at the top crossing` },
  { given: 5, key: 'int-same', ans: 4, q: `interior on the same side as ${A(5)}`, why: `between the lines, on the left of ${tex('t')}, at the top crossing` },
  { given: 1, key: 'alt-ext', ans: 7, q: `alternate exterior to ${A(1)}`, why: `outside the lines, on the right of ${tex('t')}, at the bottom crossing` }
];
const sorter = {
  title: 'Name a pair: ask three questions',
  height: 430, minW: 960,
  choices: [{ sep: 'Example 4(a) check:' }, ...SORT.map(([a, b]) => ({ v: `${a}-${b}`, label: `${a} & ${b}` })), { sep: 'More:' }, { v: 'b', label: '(b)' }, { v: 'kai', label: '(c) Kai' }],
  ask: (v) => (v === 'b' ? 'Example 4(b): name the angle that is…' : v === 'kai' ? `Example 4(c): Kai says ${A(3)} and ${A(4)} are alternate interior angles. What is wrong?` : `Example 4(a): name the pair ${A(v.split('-')[0])} and ${A(v.split('-')[1])}.`),
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 960) / 2, FW = 480, FH = 408, X0 = ox + 500, rw = 455;
    const T = Geo.transversal(stage, Object.assign({ x: ox, y: 18, w: FW, h: FH, size: 25, nameSize: 23 }, STD));
    const bnd = hide(band(T)), tintL = hide(sideTint(T, FW, FH, true, '#7b4fc4', 0.12)), tintR = hide(sideTint(T, FW, FH, false, '#12805a', 0.12));
    const dT = hide(dotAt(T.g, T.T, ORG, 8)), dB = hide(dotAt(T.g, T.B, ORG, 8));
    if (v === 'b') return sorterB(stage, T, X0, rw);
    const [a, b] = v === 'kai' ? [3, 4] : v.split('-').map(Number), K = classify(a, b), col = KCOL(K.key);
    const w1 = hide(wedgeK(T, a, col, 46, 0.4)), w2 = hide(wedgeK(T, b, col, 46, 0.4));
    const Q = [
      ['1. Same crossing?', K.same ? 'same crossing' : 'different crossings'],
      ['2. Interior or exterior?', K.io],
      [`3. Side of ${tex('t')}?`, K.side]
    ];
    const head = bx(stage, 'u5l7-box', v === 'kai' ? `Kai: “${A(3)} and ${A(4)} are <b>alternate interior</b>.”` : `The pair: ${A(a)} and ${A(b)}`, X0, 8, rw, 50);
    const rows = Q.map(([q, an], i) => bx(stage, 'u5l7-row', `<span>${q}</span><span class="u5l7-a">${an}</span>`, X0, 72 + i * 64, rw, 54));
    const ansEls = rows.map((r) => hide(r.querySelector('.u5l7-a')));
    const fullName = K.key === 'linear' ? 'a straight line: they add to 180°' : K.key === 'vert-opp' ? 'vertically opposite angles' : nameHTML(K.key);
    const nm = hide(bx(stage, 'u5l7-nmbox', fullName, X0, 274, rw, 70)); nm.style.background = col;
    const kaiNo = v === 'kai' ? hide(stamp(stage, '✗ not alternate', { ok: false, x: X0 + rw / 2, y: 390, size: 'sm' })) : null;
    const steps = [
      { cap: v === 'kai' ? `Kai’s pair: ${A(3)} and ${A(4)}. Ask the questions.` : `Find ${A(a)} and ${A(b)} in the diagram.`, run: async (c) => { await pop(c, w1); await pop(c, w2); } },
      { cap: K.same ? `<b>1.</b> Both are at the <b>${isTop(a) ? 'top' : 'bottom'}</b> crossing: the <b>same</b> crossing.` : `<b>1.</b> ${A(a)} is at the ${isTop(a) ? 'top' : 'bottom'} crossing, ${A(b)} at the ${isTop(b) ? 'top' : 'bottom'}: <b>different</b> crossings.`,
        run: async (c) => { rows[0].classList.add('on'); if (K.same) await pop(c, isTop(a) ? dT : dB); else { await pop(c, dT); await pop(c, dB); } await show(c, ansEls[0]); } }
    ];
    if (K.same) {
      steps.push({ cap: Math.abs(a - b) === 2 ? 'Across from each other: <b>vertically opposite</b>. Questions 2 and 3 are not needed.' : `Next to each other: they make a <b>straight line</b>, so they add to 180°.${v === 'kai' ? ' Alternate angles must be at <b>different</b> crossings.' : ''}`,
        run: async (c) => { await show(c, ansEls[1]); await show(c, ansEls[2]); await T.highlight(c, [a, b], { name: false, color: col }); await pop(c, nm); if (kaiNo) await stampIn(c, kaiNo); } });
      return steps;
    }
    const inner = K.io === 'both interior', outer = K.io === 'both exterior';
    steps.push(
      { cap: `<b>2.</b> The band between the lines is the inside. ${A(a)} is ${isInt(a) ? '<b>interior</b>' : '<b>exterior</b>'}, ${A(b)} is ${isInt(b) ? '<b>interior</b>' : '<b>exterior</b>'}${inner || outer ? '' : ': one of each'}.`,
        run: async (c) => { rows[1].classList.add('on'); await show(c, bnd); await show(c, ansEls[1]); } },
      { cap: `<b>3.</b> ${A(a)} is on the ${isLeft(a) ? 'left' : 'right'} of ${tex('t')}, ${A(b)} on the ${isLeft(b) ? 'left' : 'right'}: <b>${K.side}</b>.`,
        run: async (c) => { rows[2].classList.add('on'); await c.anim(bnd, [{ opacity: 0 }], 250); await show(c, tintL); await show(c, tintR); await show(c, ansEls[2]); } },
      { cap: K.key === 'none' ? 'One of each, on opposite sides: this pair has <b>no special name</b>.' : `So ${A(a)} and ${A(b)} are <b>${NAMES[K.key]}</b>${SHAPE[K.key] ? ` (a <b>${SHAPE[K.key]}</b> shape)` : ''}.`,
        run: async (c) => { await Promise.all([tintL, tintR].map((e) => c.anim(e, [{ opacity: 0 }], 250))); await T.highlight(c, [a, b], { name: false, color: col }); await pop(c, nm); } }
    );
    return steps;
  }
};
function sorterB(stage, T, X0, rw) {
  const rows = EX4B.map((e, i) => hide(bx(stage, 'u5l7-row', `<span>${e.q}</span><span class="u5l7-a">${A(e.ans)}</span>`, X0, 14 + i * 66, rw, 56)));
  const steps = [];
  EX4B.forEach((e, i) => {
    const col = KCOL(e.key);
    steps.push({ cap: `The angle ${e.q}: ${e.why}. That is <b>${A(e.ans)}</b>.`, run: async (c) => {
      T.clearHighlight(); rows.forEach((r) => r.classList.remove('on'));
      await T.highlight(c, [e.given, e.ans], { name: false, color: col }); rows[i].classList.add('on'); await show(c, rows[i]);
    } });
  });
  return steps;
}

/* ======================================================================================
 * 4. Real pictures: ladder, railway crossing, street map (also the static figures)
 * ====================================================================================== */
/** a picture from booklet cm: { P, lines{}, V{}, ang{name: [V, start, span, labelR]} }; draws into parent */
function drawReal(kind, parent, s, ox, oy, o = {}) {
  const P = ([x, y]) => [ox + s * x, oy - s * y], F = { P, lines: {}, V: {}, ang: {}, labs: [] }, sz = o.size || 20;
  const seg = (nm, a, b, st = {}) => (F.lines[nm] = svgEl('path', { d: `M${P(a)}L${P(b)}`, stroke: st.color || INK, 'stroke-width': st.w || 3, 'stroke-linecap': 'round', fill: 'none' }, parent));
  const txt = (p, s2, opt = {}) => { const t = gtext(parent, p[0], p[1], s2, Object.assign({ size: sz - 3 }, opt)); F.labs.push(t); return t; };
  const angLab = (nm, V, dir, r) => { const p = at(V, dir, Math.max(24, r * s)); F.labs.push(gtext(parent, p[0], p[1], nm, { size: sz, italic: true })); };
  if (kind === 'ladder') {
    const k = 0.268;
    [0.9, 2.1, 3.3].forEach((y, i) => seg('rung' + i, [k * y, y], [1.4 + k * y, y], { color: '#9aa0ab', w: 5 }));
    seg('rail', [-k * 0.3, -0.3], [k * 4.2, 4.2], { w: 5.5 }); seg('rail2', [1.4 - k * 0.3, -0.3], [1.4 + k * 4.2, 4.2], { w: 5.5 });
    seg('ground', [-1, -0.3], [3.3, -0.3]);
    txt(P([2.9, -0.55]), 'ground');
    F.V.L1 = P([k * 0.9, 0.9]); F.V.L2 = P([k * 2.1, 2.1]);
    F.ang = { p: [F.V.L1, 0, 75], q: [F.V.L1, 255, 105], r: [F.V.L2, 0, 75], s: [F.V.L2, 255, 105] };
    angLab('p', F.V.L1, 37.5, 0.42); angLab('q', F.V.L1, 307.5, 0.42); angLab('r', F.V.L2, 37.5, 0.42); angLab('s', F.V.L2, 307.5, 0.42);
    txt(P([-0.1, 1.5]), 'left rail', { anchor: 'end' }); txt(P([2.2, 2.1]), 'rung', { anchor: 'start' });
    svgEl('path', { d: `M${P([2.15, 2.1])}L${P([1.62, 2.1])}`, stroke: INK, 'stroke-width': 1.6 }, parent);
    svgEl('path', { d: `M${at(P([1.62, 2.1]), 20, 9)}L${P([1.62, 2.1])}L${at(P([1.62, 2.1]), -20, 9)}`, stroke: INK, 'stroke-width': 1.6, fill: 'none' }, parent);
    F.tv = 'rail'; F.two = ['rung0', 'rung1'];
  } else if (kind === 'road') {
    const B = [0, 0], Tt = [1.7 * Math.cos(125 * Math.PI / 180), 1.7 * Math.sin(125 * Math.PI / 180)], u = [Math.cos(125 * Math.PI / 180), Math.sin(125 * Math.PI / 180)];
    const e0 = [B[0] - 1.3 * u[0], B[1] - 1.3 * u[1]], e1 = [Tt[0] + 1.2 * u[0], Tt[1] + 1.2 * u[1]];
    svgEl('path', { d: `M${P(e0)}L${P(e1)}L${P([e1[0] + 0.6, e1[1]])}L${P([e0[0] + 0.6, e0[1]])}Z`, fill: '#e9e6df' }, parent);
    seg('top', [Tt[0] - 2.4, Tt[1]], [Tt[0] + 3.1, Tt[1]]); seg('bot', [-2.4, 0], [3.1, 0]);
    chevron(parent, P([Tt[0] + 2.4, Tt[1]]), 0); chevron(parent, P([2.4, 0]), 0);
    seg('road', e0, e1);
    const lp = P(e1); F.labs.push(gtext(parent, lp[0], lp[1] - 16, 'road edge', { size: sz - 4 }));
    F.V.T = P(Tt); F.V.B = P(B);
    const rr = 0.5;
    [['e', 'T', 152.5, 125, 55], ['a', 'T', 62.5, 0, 125], ['b', 'T', 332.5, 305, 55], ['f', 'T', 242.5, 180, 125],
      ['c', 'B', 152.5, 125, 55], ['g', 'B', 62.5, 0, 125], ['h', 'B', 332.5, 305, 55], ['d', 'B', 242.5, 180, 125]].forEach(([nm, v, dir, st, sp]) => { F.ang[nm] = [F.V[v], st, sp]; angLab(nm, F.V[v], dir, rr); });
    txt(P([Tt[0] + 3.2, Tt[1]]), 'rail', { anchor: 'start' }); txt(P([3.2, 0]), 'rail', { anchor: 'start' });
    F.tv = 'road'; F.two = ['top', 'bot'];
  } else if (kind === 'window') {
    const c = (d) => [Math.cos(d * Math.PI / 180), Math.sin(d * Math.PI / 180)], U1 = [2 / Math.tan(75 * Math.PI / 180), 2], V1 = [3 + 2 / Math.tan(100 * Math.PI / 180), 2];
    seg('k', [-1, 2], [4.2, 2]); seg('m', [-1, 0], [4.2, 0]);
    chevron(parent, P([-0.5, 2]), 0); chevron(parent, P([-0.5, 0]), 0);
    seg('u', [0.8 * c(255)[0], 0.8 * c(255)[1]], [U1[0] + 0.8 * c(75)[0], 2 + 0.8 * c(75)[1]]);
    seg('v', [3 + 0.8 * c(280)[0], 0.8 * c(280)[1]], [V1[0] + 0.8 * c(100)[0], 2 + 0.8 * c(100)[1]]);
    const L = (nm, q, dx, dy) => { const pp = P(q); F.labs.push(gtext(parent, pp[0] + dx, pp[1] + dy, nm, { size: sz, italic: true })); };
    L('k', [4.2, 2], 16, 0); L('m', [4.2, 0], 16, 0); L('u', [U1[0] + 0.8 * c(75)[0], 2 + 0.8 * c(75)[1]], 0, -16); L('v', [V1[0] + 0.8 * c(100)[0], 2 + 0.8 * c(100)[1]], 0, -16);
    F.V = { U0: P([0, 0]), U1: P(U1), V0: P([3, 0]), V1: P(V1) };
    [['w', 'U1', 37.5, 0, 75], ['x', 'U0', 37.5, 0, 75], ['y', 'V0', 140, 100, 80], ['z', 'V1', 230, 180, 100]].forEach(([nm, v, dir, st, sp]) => { F.ang[nm] = [F.V[v], st, sp]; angLab(nm, F.V[v], dir, 0.5); });
  } else { // map
    const t70 = Math.tan(70 * Math.PI / 180), t115 = Math.tan(115 * Math.PI / 180), P1 = [2.4 / t70, 2.4], P2 = [4 + 2.4 / t115, 2.4];
    const c = (d) => [Math.cos(d * Math.PI / 180), Math.sin(d * Math.PI / 180)];
    seg('p', [-1.2, 2.4], [5.2, 2.4]); seg('q', [-1.2, 0], [5.2, 0]);
    chevron(parent, P([-0.6, 2.4]), 0); chevron(parent, P([-0.6, 0]), 0);
    seg('r', [0.9 * c(250)[0], 0.9 * c(250)[1]], [P1[0] + 0.9 * c(70)[0], P1[1] + 0.9 * c(70)[1]]);
    seg('s', [4 + 0.9 * c(295)[0], 0.9 * c(295)[1]], [P2[0] + 0.9 * c(115)[0], P2[1] + 0.9 * c(115)[1]]);
    F.lineLab = {
      p: gtext(parent, P([5.2, 2.4])[0] + 16, P([5.2, 2.4])[1], 'p', { size: sz, italic: true }), q: gtext(parent, P([5.2, 0])[0] + 16, P([5.2, 0])[1], 'q', { size: sz, italic: true }),
      r: gtext(parent, P([P1[0] + 0.9 * c(70)[0], 0])[0], P([0, P1[1] + 0.9 * c(70)[1]])[1] - 16, 'r', { size: sz, italic: true }),
      s: gtext(parent, P([P2[0] + 0.9 * c(115)[0], 0])[0], P([0, P2[1] + 0.9 * c(115)[1]])[1] - 16, 's', { size: sz, italic: true })
    };
    Object.values(F.lineLab).forEach((t) => F.labs.push(t));
    F.V = { A: P([0, 0]), P1: P(P1), S: P([4, 0]), P2: P(P2) };
    [['a', 'A', 35, 0, 70], ['b', 'P1', 35, 0, 70], ['e', 'P1', 305, 250, 110], ['c', 'S', 147.5, 115, 65], ['d', 'P2', 237.5, 180, 115], ['f', 'P2', 147.5, 115, 65]]
      .forEach(([nm, v, dir, st, sp]) => { F.ang[nm] = [F.V[v], st, sp]; angLab(nm, F.V[v], dir, 0.5); });
  }
  return F;
}
/** wedges and a letter shape for a pair of angles in a real picture */
function realPair(parent, F, n1, n2, color) {
  const ws = [n1, n2].map((n) => { const [V, st, sp] = F.ang[n]; return popable(svgEl('path', { d: wedgeD(V, 38, st, sp), fill: color, 'fill-opacity': 0.38 }, parent)); });
  const segs = [];
  [[n1, n2], [n2, n1]].forEach(([m, o]) => {
    const [V, st, sp] = F.ang[m], W2 = F.ang[o][0];
    [st, st + sp].forEach((d) => { const toO = Math.abs(((dirTo(V, W2) - d) % 360 + 540) % 360 - 180) < 2; segs.push([V, toO ? W2 : at(V, d, 82)]); });
  });
  const sh = svgEl('path', { d: segs.map(([p, q]) => `M${p}L${q}`).join(''), stroke: color, 'stroke-width': 12, 'stroke-linecap': 'round', opacity: 0.3, fill: 'none' }, parent);
  return { ws, sh };
}
const glow = (parent, el, color, w = 12) => { const g = svgEl('path', { d: el.getAttribute('d'), stroke: color, 'stroke-width': w, 'stroke-linecap': 'round', opacity: 0.35, fill: 'none' }, null); parent.insertBefore(g, parent.firstChild); return g; };
const REAL = {
  ladder: { s: 82, ox: 140, oy: 362, tvName: 'the left rail', twoName: 'the two rungs', pairs: [
    ['p', 'r', 'corresponding', `${tex('\\angle p')} and ${tex('\\angle r')}: both <b>above</b> their rung, on the right of the rail. Same position: <b>corresponding</b> (F).`, '(ii) p & r'],
    ['p', 's', 'int-same', `${tex('\\angle p')} is above the lower rung, ${tex('\\angle s')} below the upper rung: both <b>between</b> the rungs, on the right: <b>interior, same side</b>.`, '(ii) p & s'],
    ['q', 'r', 'ext-same', `${tex('\\angle q')} is below the lower rung, ${tex('\\angle r')} above the upper rung: both <b>outside</b>, on the right: <b>exterior, same side</b>.`, '(ii) q & r']] },
  road: { s: 72, ox: 260, oy: 260, tvName: 'the road edge', twoName: 'the two rails', pairs: [
    ['a', 'g', 'corresponding', `(i) ${tex('\\angle a')} and ${tex('\\angle g')}: both <b>upper right</b> at their crossing: <b>corresponding</b>.`, '(i) a & g'],
    ['f', 'g', 'alt-int', `(ii) ${tex('\\angle f')} and ${tex('\\angle g')}: both <b>between</b> the rails, on <b>opposite sides</b> of the road edge: <b>alternate interior</b> (Z).`, '(ii) f & g'],
    ['e', 'h', 'alt-ext', `(iii) ${tex('\\angle e')} and ${tex('\\angle h')}: both <b>outside</b> the rails, on <b>opposite sides</b>: <b>alternate exterior</b>.`, '(iii) e & h'],
    ['b', 'g', 'int-same', `(iv) ${tex('\\angle b')} and ${tex('\\angle g')}: both <b>between</b> the rails, on the <b>right</b>: <b>interior, same side</b> (C).`, '(iv) b & g']] }
};
const real = {
  title: 'Real pictures: find the transversal first',
  height: 430, minW: 960,
  choices: [{ sep: 'Example 5 check:' }, { v: 'ladder', label: '(a) the ladder' }, { v: 'road', label: '(b) the railway' }, { sep: 'Example 6 check:' }, { v: 'map', label: 'the street map' }],
  ask: (v) => (v === 'ladder' ? 'Example 5(a): a ladder with parallel rungs. Find the two lines and the transversal, then name the pairs.' : v === 'road' ? 'Example 5(b): a road crosses two parallel rails. Name each pair.' : `Example 6: for each pair, name the two lines and the transversal. Then name the pair.`),
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 960) / 2, svg = stageSvg(stage, W, 430), X0 = ox + 560, rw = 395;
    if (v === 'map') return realMap(stage, svg, ox);
    const R = REAL[v], g = svgEl('g', {}, svg), F = drawReal(v, g, R.s, ox + R.ox, R.oy, { size: 24 });
    const vd = Object.values(F.V).map((p) => hide(dotAt(g, p, ORG, 7)));
    const tg = hide(glow(g, F.lines[F.tv], ORG, 13)), twos = F.two.map((n) => hide(glow(g, F.lines[n], BLU, 13)));
    const r0 = hide(bx(stage, 'u5l7-row', `<span>transversal</span><span class="u5l7-a" style="color:${ORG}">${R.tvName}</span>`, X0, 10, rw, 50));
    const r1 = hide(bx(stage, 'u5l7-row', `<span>the two lines</span><span class="u5l7-a" style="color:${BLU}">${R.twoName}</span>`, X0, 68, rw, 50));
    const prs = R.pairs.map(([a, b, k, , lbl], i) => ({ k, rp: null, row: hide(bx(stage, 'u5l7-row', `<span>${lbl.replace(/([a-z]) & ([a-z])/, (m, x, y) => `${tex('\\angle ' + x)} &amp; ${tex('\\angle ' + y)}`)}</span><span class="u5l7-a" style="color:${KCOL(k)}">${SHORT[k]}</span>`, X0, 140 + i * 60, rw, 50)) }));
    const hl = []; const clear = () => { hl.forEach((e) => e.remove()); hl.length = 0; };
    const steps = [
      { cap: 'The transversal goes through the <b>vertices of both angles</b>.', run: async (c) => { for (const d of vd) await pop(c, d); await show(c, tg); await show(c, r0); } },
      { cap: `The other line at each vertex is one of “the two lines”: <b>${R.twoName}</b>.`, run: async (c) => { await Promise.all(twos.map((e) => show(c, e))); await show(c, r1); } }
    ];
    R.pairs.forEach(([a, b, k, cap], i) => steps.push({ cap, run: async (c) => {
      clear(); const P2 = realPair(g, F, a, b, KCOL(k)); hl.push(...P2.ws, P2.sh); hide(P2.sh);
      await Promise.all(P2.ws.map((w) => pop(c, w))); await show(c, P2.sh); await show(c, prs[i].row);
    } }));
    return steps;
  }
};
function realMap(stage, svg, ox) {
  const s = 80, cx = ox + 280, g = svgEl('g', {}, svg); g.style.transformBox = 'view-box'; g.style.transformOrigin = '0 0';
  const F = drawReal('map', g, s, ox + 130, 330, { size: 24 }), X0 = ox + 590, rw = 365;
  const C = [cx, 215];
  const rowH = (i, html) => hide(bx(stage, 'u5l7-row', html, X0, 10 + i * 64, rw, 54));
  const rows = [
    rowH(0, `<span>${tex('a')} &amp; ${tex('b')} · lines ${tex('p,q')} · transv. ${tex('r')}</span><span class="u5l7-a" style="color:${KCOL('corresponding')}">corr.</span>`),
    rowH(1, `<span>${tex('c')} &amp; ${tex('d')} · lines ${tex('p,q')} · transv. ${tex('s')}</span><span class="u5l7-a" style="color:${KCOL('int-same')}">int., same</span>`),
    rowH(2, `<span>${tex('b')} &amp; ${tex('d')} · lines ${tex('r,s')} · transv. ${tex('p')}</span><span class="u5l7-a" style="color:${KCOL('alt-int')}">alt. int.</span>`),
    rowH(3, `<span>(d) alternate interior to ${tex('\\angle e')}</span><span class="u5l7-a" style="color:${KCOL('alt-int')}">${tex('\\angle f')}</span>`)
  ];
  const vd = (names) => names.map((n) => hide(dotAt(g, F.V[n], ORG, 7)));
  const dR = vd(['A', 'P1']), dS = vd(['S', 'P2']), dP = vd(['P1', 'P2']);
  const gl = { r: hide(glow(g, F.lines.r, ORG)), s: hide(glow(g, F.lines.s, ORG)), p: hide(glow(g, F.lines.p, ORG)), pB: hide(glow(g, F.lines.p, BLU)), qB: hide(glow(g, F.lines.q, BLU)), rB: hide(glow(g, F.lines.r, BLU)), sB: hide(glow(g, F.lines.s, BLU)) };
  const hl = []; const clear = () => { hl.forEach((e) => e.remove()); hl.length = 0; };
  const fadeG = (c, ks) => Promise.all(ks.map((k) => c.anim(gl[k], [{ opacity: 0 }], 250)));
  const pair = async (c, a, b, k) => { clear(); const P2 = realPair(g, F, a, b, KCOL(k)); hl.push(...P2.ws, P2.sh); hide(P2.sh); await Promise.all(P2.ws.map((w) => pop(c, w))); await show(c, P2.sh); };
  const turn = (c, deg, ms) => tween(c, ms, (t) => {
    const a = deg * t, sc = 1 - 0.27 * t;
    g.setAttribute('transform', `translate(${C[0]} ${C[1]}) rotate(${a}) scale(${sc}) translate(${-C[0]} ${-C[1]})`);
    F.labs.forEach((tx) => tx.setAttribute('transform', `rotate(${-a} ${tx.getAttribute('x')} ${tx.getAttribute('y')})`));
  });
  return [
    { cap: `${tex('\\angle a')} and ${tex('\\angle b')}: both vertices are on ${tex('r')}, so ${tex('r')} is the <b>transversal</b>. The two lines are ${tex('p')} and ${tex('q')}.`, run: async (c) => { for (const d of dR) await pop(c, d); await show(c, gl.r); await show(c, gl.pB); await show(c, gl.qB); } },
    { cap: `Both are <b>upper right</b> at their crossing: <b>corresponding</b>.`, run: async (c) => { await pair(c, 'a', 'b', 'corresponding'); await show(c, rows[0]); } },
    { cap: `${tex('\\angle c')} and ${tex('\\angle d')}: both vertices are on ${tex('s')}. Both are between ${tex('p')} and ${tex('q')}, on the left of ${tex('s')}: <b>interior, same side</b>.`, run: async (c) => { clear(); dR.forEach((d) => (d.style.opacity = 0)); await fadeG(c, ['r']); for (const d of dS) await pop(c, d); await show(c, gl.s); await pair(c, 'c', 'd', 'int-same'); await show(c, rows[1]); } },
    { cap: `${tex('\\angle b')} and ${tex('\\angle d')}: both vertices are on ${tex('p')}! Now ${tex('p')} is the transversal, and the two lines are ${tex('r')} and ${tex('s')}.`, run: async (c) => { clear(); dS.forEach((d) => (d.style.opacity = 0)); await fadeG(c, ['s', 'pB', 'qB']); for (const d of dP) await pop(c, d); await show(c, gl.p); await show(c, gl.rB); await show(c, gl.sB); } },
    { cap: `<b>Turn the page</b> so ${tex('p')} goes up and down…`, run: (c) => turn(c, -90, 2000) },
    { cap: `${tex('\\angle b')} is between ${tex('r')} and ${tex('s')} on one side of ${tex('p')}, ${tex('\\angle d')} on the other: <b>alternate interior</b> (Z).`, run: async (c) => { await pair(c, 'b', 'd', 'alt-int'); await show(c, rows[2]); } },
    { cap: `(d) ${tex('\\angle e')} is between ${tex('r')} and ${tex('s')}, below ${tex('p')}. Its partner: between them, above ${tex('p')}, at the other crossing: ${tex('\\angle f')}.`, run: async (c) => { await pair(c, 'e', 'f', 'alt-int'); await show(c, rows[3]); } }
  ];
}

/* ======================================================================================
 * 5. A line that tilts: the pairs stop matching (Example 7), why the one-crossing rules always work, Example 8
 * ====================================================================================== */
const meas = (tilt, skew) => ({ 1: 180 - tilt, 2: tilt, 3: 180 - tilt, 4: tilt, 5: 180 + skew - tilt, 6: tilt - skew, 7: 180 + skew - tilt, 8: tilt - skew });
const r0 = (v) => Math.round(v);
const tilt = {
  title: 'Turn ℓ₂: do the pairs still match?',
  height: 430, minW: 960,
  choices: [{ sep: 'Example 7 check:' }, { v: -15, label: 'Diagram A → Diagram B' }, { sep: 'Try:' }, { v: 12, label: 'turn ℓ₂ the other way' }],
  ask: (v) => (v === -15 ? 'Example 7: measure the pairs in Diagram A (parallel) and Diagram B (ℓ₂ turned 15°).' : 'What if ℓ₂ turns the other way, 12° up on the right?'),
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 960) / 2, svg = stageSvg(stage, W, 430), g = svgEl('g', {}, svg), X0 = ox + 590, rw = 365, TI = 60;
    const st = { skew: 0, hl: null };
    let T = null;
    const draw = () => {
      g.innerHTML = '';
      const m = meas(TI, st.skew), par = Math.abs(st.skew) < 0.01;
      T = Geo.transversal(g, { x: ox, y: 18, w: 570, h: 408, parallel: false, skew: st.skew, tilt: TI, marks: par ? 1 : 0, size: 23, nameSize: 23,
        angles: { 1: r0(m[1]) + '°', 5: r0(m[5]) + '°', 4: r0(m[4]) + '°', 6: r0(m[6]) + '°' }, labelColors: { 1: BLU, 5: BLU, 4: GRN, 6: GRN } });
      if (st.hl) T.highlight(null, st.hl, { name: false });
      vals.forEach((e) => { e.el.textContent = e.f(m); });
    };
    const box3 = (y, ttl, rowsHTML) => bx(stage, 'u5l7-cmp', `<div><b>${ttl}</b></div>${rowsHTML}`, X0, y, rw, 118);
    const c1 = box3(6, 'corresponding', `<div>${A(1)} = <span class="u5l7-v" data-v="1"></span> &nbsp; ${A(5)} = <span class="u5l7-v" data-v="5"></span></div>`);
    const c2 = box3(144, 'alternate interior', `<div>${A(4)} = <span class="u5l7-v" data-v="4"></span> &nbsp; ${A(6)} = <span class="u5l7-v" data-v="6"></span></div>`);
    const c3 = box3(282, 'interior, same side', `<div>${A(4)} + ${A(5)} = <span class="u5l7-v" data-v="s"></span></div>`);
    const vals = [...stage.querySelectorAll('.u5l7-v')].map((el) => ({ el, f: (m) => (el.dataset.v === 's' ? r0(m[4] + m[5]) + '°' : r0(m[+el.dataset.v]) + '°') }));
    const sA = [[c1, 'equal'], [c2, 'equal'], [c3, '180°']].map(([b, t]) => hide(stamp(stage, '✓ ' + t, { ok: true, x: X0 + rw - 90, y: parseFloat(b.style.top) + 90, size: 'sm' })));
    const mB = meas(TI, v), sB = [[c1, 'not equal'], [c2, 'not equal'], [c3, 'not 180°']].map(([b, t]) => hide(stamp(stage, '✗ ' + t, { ok: false, x: X0 + rw - 90, y: parseFloat(b.style.top) + 90, size: 'sm' })));
    hide(c1, c2, c3);
    draw();
    const rule = (c, i, pair) => { st.hl = pair; draw(); return Promise.all([show(c, [c1, c2, c3][i]), stampIn(c, sA[i])]); };
    return [
      { cap: `<b>Diagram A:</b> ℓ₁ and ℓ₂ are parallel (arrows). Corresponding: ${A(1)} = 120°, ${A(5)} = 120°: <b>equal</b>.`, run: (c) => rule(c, 0, [1, 5]) },
      { cap: `Alternate interior: ${A(4)} = 60°, ${A(6)} = 60°: <b>equal</b>.`, run: (c) => rule(c, 1, [4, 6]) },
      { cap: `Interior, same side: ${A(4)} + ${A(5)} = 60° + 120° = <b>180°</b>.`, run: (c) => rule(c, 2, [4, 5]) },
      { cap: `Now turn ℓ₂ by ${Math.abs(v)}°. It is <b>not parallel</b> any more. Watch the sizes…`, run: async (c) => { st.hl = null; await Promise.all(sA.map((s) => c.anim(s, [{ opacity: 0 }], 200))); await tween(c, 2400, (t) => { st.skew = v * t; draw(); }); } },
      { cap: `${A(1)} is still 120°, but ${A(5)} = <b>${mB[5]}°</b>: not equal. ${A(4)} = 60°, but ${A(6)} = <b>${mB[6]}°</b>: not equal.`, run: async (c) => { st.hl = [1, 5]; draw(); await stampIn(c, sB[0]); st.hl = [4, 6]; draw(); await stampIn(c, sB[1]); } },
      { cap: `${A(4)} + ${A(5)} = 60° + ${mB[5]}° = <b>${60 + mB[5]}°</b>, not 180°. The names stay the same, but the sizes only match when the lines are <b>parallel</b>.`, run: async (c) => { st.hl = [4, 5]; draw(); await stampIn(c, sB[2]); } }
    ];
  }
};
const whyAlways = {
  title: 'Vertically opposite angles: always equal',
  height: 430, minW: 960,
  ask: `${A(2)} = 68°. Why is ${A(1)} = ${A(3)}, whether or not the lines are parallel?`,
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 960) / 2, svg = stageSvg(stage, W, 430), g = svgEl('g', {}, svg), X0 = ox + 590, rw = 365;
    const st = { tilt: 68, hl: null, lab: { 2: true } };
    const lines = [
      hide(bx(stage, 'u5l7-row', `<span>${A(1)} + ${A(2)} = 180°</span><span class="u5l7-a">straight line ℓ₁</span>`, X0, 20, rw, 52)),
      hide(bx(stage, 'u5l7-row', `<span>${A(2)} + ${A(3)} = 180°</span><span class="u5l7-a">straight line ${tex('t')}</span>`, X0, 84, rw, 52)),
      hide(bx(stage, 'u5l7-res', `${A(1)} = ${A(3)} = 180° − ${A(2)}`, X0, 160, rw, 52))
    ];
    lines[2].style.position = 'absolute';
    const draw = () => {
      g.innerHTML = '';
      const m = meas(st.tilt, -12), ang = {};
      Object.keys(st.lab).forEach((k) => (ang[k] = r0(m[k]) + '°'));
      const T = Geo.transversal(g, { x: ox, y: 18, w: 570, h: 408, parallel: false, skew: -12, tilt: st.tilt, size: 23, nameSize: 23, angles: ang, labelColors: { 1: BLU, 3: BLU, 2: ORG } });
      if (st.hl) T.highlight(null, st.hl.p, { name: false, color: st.hl.c });
    };
    draw();
    return [
      { cap: `${A(2)} = 68°. Lines ℓ₁ and ℓ₂ are <b>not</b> parallel.`, run: async () => { draw(); } },
      { cap: `${A(1)} and ${A(2)} make a straight line (ℓ₁): ${A(1)} = 180° − 68° = <b>112°</b>.`, run: async (c) => { st.hl = { p: [1, 2], c: '#9a6a24' }; st.lab[1] = true; draw(); await show(c, lines[0]); } },
      { cap: `${A(2)} and ${A(3)} make a straight line (${tex('t')}): ${A(3)} = 180° − 68° = <b>112°</b>.`, run: async (c) => { st.hl = { p: [2, 3], c: '#9a6a24' }; st.lab[3] = true; draw(); await show(c, lines[1]); } },
      { cap: `Both are 180° − ${A(2)}, so ${A(1)} = ${A(3)}. We only used <b>one crossing</b>.`, run: async (c) => { st.hl = { p: [1, 3], c: GRY }; draw(); await pop(c, lines[2]); } },
      { cap: `Turn ${tex('t')}: ${A(2)} changes, but ${A(1)} and ${A(3)} stay equal every time. It never depends on parallel lines.`, run: async (c) => { st.hl = null; await tween(c, 3200, (t) => { st.tilt = 68 - 30 * Math.sin(t * Math.PI * 2) * (t < 0.5 ? 1 : 0.6); draw(); }, (t) => t); st.tilt = 68; draw(); } }
    ];
  }
};
const FILL = [
  { k: 4, from: 2, key: 'vert-opp', v: 68, why: `vertically opposite ${A(2)}`, cap: `${A(4)} is vertically opposite ${A(2)}: <b>68°</b>.` },
  { k: 1, from: 2, key: 'linear', v: 112, why: `straight line with ${A(2)}: ${tex('180^\\circ-68^\\circ')}`, cap: `${A(1)} and ${A(2)} make a straight line: 180° − 68° = <b>112°</b>.` },
  { k: 3, from: 1, key: 'vert-opp', v: 112, why: `vertically opposite ${A(1)}`, cap: `${A(3)} is vertically opposite ${A(1)}: <b>112°</b>.` },
  { k: 5, from: 7, key: 'vert-opp', v: 100, why: `vertically opposite ${A(7)}`, cap: `Bottom crossing: ${A(5)} is vertically opposite ${A(7)}: <b>100°</b>.` },
  { k: 6, from: 7, key: 'linear', v: 80, why: `straight line with ${A(7)}: ${tex('180^\\circ-100^\\circ')}`, cap: `${A(6)} and ${A(7)} make a straight line: 180° − 100° = <b>80°</b>.` },
  { k: 8, from: 6, key: 'vert-opp', v: 80, why: `vertically opposite ${A(6)}`, cap: `${A(8)} is vertically opposite ${A(6)}: <b>80°</b>.` }
];
const fill = {
  title: 'Not parallel: one angle at each crossing',
  height: 430, minW: 960,
  choices: [{ sep: 'Example 8 check:' }, { v: 'ex8', label: 'all eight, then (b) and (c)' }],
  ask: `Example 8: ℓ₁ and ℓ₂ are <b>not</b> parallel. ${A(2)} = 68° and ${A(7)} = 100°. Find the other six angles, with reasons.`,
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 960) / 2, X0 = ox + 470;
    const T = Geo.transversal(stage, { x: ox, y: 18, w: 460, h: 408, parallel: false, skew: -12, tilt: 68, size: 23, nameSize: 22, angles: { 2: '68°', 7: '100°' }, labelColors: { 2: ORG, 7: ORG } });
    const tb = add(stage, h('table', 'u5l7-xt'), X0, 8); tb.style.width = '486px';
    tb.innerHTML = `<tr><th style="width:70px">Angle</th><th style="width:70px">Size</th><th>Reason</th></tr>` + FILL.map((f) => `<tr><td>${A(f.k)}</td><td><span class="u5l7-cv">${D(f.v)}</span></td><td style="text-align:left"><span class="u5l7-cv">${f.why}</span></td></tr>`).join('');
    const cells = [...tb.querySelectorAll('tr')].slice(1).map((r) => [...r.querySelectorAll('.u5l7-cv')]);
    cells.flat().forEach((e) => hide(e));
    const cB = hide(bx(stage, 'u5l7-cmp', `(b) corresponding ${A(2)} = 68°, ${A(6)} = 80° · alternate interior ${A(4)} = 68°, ${A(6)} = 80°`, X0, 316, 486, 66));
    const sNo = hide(stamp(stage, '✗ not equal', { ok: false, x: X0 + 400, y: 404, size: 'sm' }));
    const steps = FILL.map((f, i) => ({ cap: f.cap, run: async (c) => {
      T.clearHighlight(); await T.highlight(c, [f.from, f.k], { name: false, color: KCOL(f.key) }); T.setLabel(f.k, f.v + '°'); await pop(c, T.label(f.k));
      for (const e of cells[i]) await show(c, e, 220);
    } }));
    steps.push(
      { cap: `(b) Corresponding ${A(2)} = 68° but ${A(6)} = 80°. Alternate interior ${A(4)} = 68° but ${A(6)} = 80°: <b>not equal</b>. (${A(3)} + ${A(6)} = 192°, not 180°.)`, run: async (c) => { T.clearHighlight(); await T.highlight(c, [2, 6], { name: false }); await show(c, cB); await stampIn(c, sNo); } },
      { cap: '(c) The lines are not parallel, so the top crossing tells us <b>nothing</b> about the bottom one. We needed one angle at <b>each</b> crossing.', run: async (c) => { T.clearHighlight(); await pulse(c, T.label(2), 1.4); await pulse(c, T.label(7), 1.4); } }
    );
    return steps;
  }
};

mountExplainers({ transversal, number, pairsA, slide4, pairsB, sorter, real, tilt, whyAlways, fill });

/* ======================================================================================
 * Hands-on: name the pair (Section 3) and turn ℓ2 (Section 5)
 * ====================================================================================== */
const ALLPAIRS = []; for (let a = 1; a <= 8; a++) for (let b = a + 1; b <= 8; b++) ALLPAIRS.push([a, b]);
function pairTool(host, o = {}) {
  if (!host) return;
  host.innerHTML = '';
  const figBox = add(host, h('div', 'u5l7-tfig')), panel = add(host, h('div', 'u5l7-panel'));
  const st = { sel: [], hidden: false, skew: 0 };
  let slider = null, measBox = null;
  if (o.tilt) {
    const sl = add(panel, h('label', 'u5l7-slide', `<span>turn ℓ₂</span><input type="range" min="-20" max="20" step="1" value="0" aria-label="Turn line two"><span class="u5l7-sv">0°</span>`));
    slider = sl.querySelector('input'); slider.oninput = () => { st.skew = -Number(slider.value); sl.querySelector('.u5l7-sv').textContent = slider.value + '°'; render(); };
  }
  const read = add(panel, h('div', 'u5l7-read'));
  if (o.tilt) measBox = add(panel, h('div', 'u5l7-meas'));
  const btns = add(panel, h('div', 'u5l7-btns'));
  const B = (label, fn) => { const b = h('button', 'pill small', label); b.type = 'button'; b.onclick = fn; btns.appendChild(b); return b; };
  B('New pair', () => { const p = ALLPAIRS[Math.floor(Math.random() * ALLPAIRS.length)]; st.sel = Math.random() < 0.5 ? p.slice() : [p[1], p[0]]; render(); });
  const bh = B('Hide the name', () => { st.hidden = !st.hidden; bh.setAttribute('aria-pressed', st.hidden); bh.textContent = st.hidden ? 'Show the name' : 'Hide the name'; render(); });
  if (o.tilt) B('Make parallel', () => { st.skew = 0; slider.value = 0; slider.parentNode.querySelector('.u5l7-sv').textContent = '0°'; render(); });
  B('Clear', () => { st.sel = []; render(); });
  function render() {
    figBox.innerHTML = '';
    const svg = add(figBox, svgEl('svg', { width: 600, height: 380, viewBox: '0 0 600 380' }));
    const par = Math.abs(st.skew) < 0.01, m = meas(62, st.skew);
    const ang = {}; if (o.tilt) st.sel.forEach((k) => (ang[k] = r0(m[k]) + '°'));
    const T = Geo.transversal(svg, { w: 600, h: 380, parallel: false, skew: st.skew, tilt: 62, marks: par ? 1 : 0, size: 24, nameSize: 22, angles: ang });
    for (let k = 1; k <= 8; k++) {
      const cn = T.corner(k), hit = svgEl('path', { d: wedgeD(cn.X, 78, cn.start, cn.span), class: 'u5l7-hit', 'data-tap': '' }, svg);
      hit.addEventListener('click', () => { if (st.sel.length >= 2) st.sel = []; if (!st.sel.includes(k)) st.sel.push(k); render(); });
    }
    if (st.sel.length === 1) { const w = wedgeK(T, st.sel[0], ORG, 46, 0.4); void w; }
    let html = '';
    if (!st.sel.length) html = 'Tap an angle in the diagram.';
    else if (st.sel.length === 1) html = `${A(st.sel[0])}: ${isTop(st.sel[0]) ? 'top' : 'bottom'} crossing, ${isInt(st.sel[0]) ? 'interior' : 'exterior'}, ${isLeft(st.sel[0]) ? 'left' : 'right'} of ${tex('t')}.<br>Now tap a second angle.`;
    else {
      const [a, b] = st.sel, K = classify(a, b), col = KCOL(K.key);
      T.highlight(null, [a, b], { name: false, color: col });
      const q = K.same ? `same crossing · ${Math.abs(a - b) === 2 ? 'across from each other' : 'next to each other'}` : `different crossings · ${K.io} · ${K.side}`;
      let name = K.key === 'linear' ? 'a straight line: they add to 180°' : nameHTML(K.key);
      let size = '';
      if (o.tilt) {
        const ma = r0(m[a]), mb = r0(m[b]), always = K.key === 'vert-opp' || K.key === 'linear';
        const eqRule = ['corresponding', 'alt-int', 'alt-ext', 'vert-opp'].includes(K.key), sumRule = ['int-same', 'ext-same', 'linear'].includes(K.key);
        if (eqRule) size = `${A(a)} = ${ma}°, ${A(b)} = ${mb}°: <b>${ma === mb ? 'equal' : 'not equal'}</b>${always ? ' (always)' : par ? ' (the lines are parallel)' : ' (the lines are not parallel)'}`;
        else if (sumRule) size = `${A(a)} + ${A(b)} = ${ma}° + ${mb}° = <b>${ma + mb}°</b>${always ? ' (always)' : par ? ' (parallel lines)' : ''}`;
        else size = `${A(a)} = ${ma}°, ${A(b)} = ${mb}°`;
      }
      html = `<div>${A(a)} and ${A(b)}: ${q}</div><b class="u5l7-nm" style="color:${col}">${st.hidden ? '<span class="u5l7-hid">? ? ?</span>' : name}</b>${size ? `<div style="margin-top:6px">${size}</div>` : ''}`;
    }
    read.innerHTML = html;
    if (measBox) measBox.innerHTML = [1, 2, 3, 4, 5, 6, 7, 8].map((k) => `<div class="${st.sel.includes(k) ? 'on' : ''}">${A(k)} ${r0(m[k])}°</div>`).join('');
  }
  render();
}
requestAnimationFrame(() => { pairTool(document.getElementById('u5l7-pairs')); pairTool(document.getElementById('u5l7-tilt'), { tilt: true }); });

/* ======================================================================================
 * Static figures on the cards
 * ====================================================================================== */
function fig(name, w, hh, draw) {
  const host = document.querySelector(`.u5l7-fig[data-fig="${name}"]`); if (!host) return;
  host.style.width = w + 'px'; host.style.height = hh + 'px';
  const svg = svgEl('svg', { width: w, height: hh, viewBox: `0 0 ${w} ${hh}` }, host);
  draw(svg, host);
}
/** a Geo diagram on a card, leaving room at the top for the t label */
const GT = (svg, o) => Geo.transversal(svg, Object.assign({}, o, { y: 14, h: o.h - 14 }));
function figures() {
  ['a', 'b', 'c', 'd'].forEach((k) => fig('ex1' + k, 232, 215, (svg) => drawEx1(svg, EX1[k], 52, 22, 162, 20)));
  fig('band', 430, 320, (svg) => {
    const T = GT(svg, Object.assign({ w: 430, h: 320, size: 21 }, STD));
    band(T, '#9aa0ab', 0.16);
    const tx = (x, y, s, anchor = 'middle') => gtext(svg, x, y, s, { size: 15, italic: true, color: '#6a7182', anchor });
    tx(70, 160, 'interior'); tx(64, 70, 'exterior'); tx(70, 290, 'exterior');
    gtext(svg, T.T[0] + 58, T.T[1] - 46, 'top crossing', { size: 15, anchor: 'start' }); gtext(svg, T.B[0] + 40, T.B[1] + 56, 'bottom crossing', { size: 15, anchor: 'start' });
  });
  fig('std-sm', 330, 260, (svg) => GT(svg, Object.assign({ w: 330, h: 260, size: 20 }, STD)));
  fig('std-sm2', 380, 290, (svg) => GT(svg, Object.assign({ w: 380, h: 290, size: 21 }, STD)));
  fig('std-sm3', 330, 270, (svg) => GT(svg, Object.assign({ w: 330, h: 270, size: 20 }, STD)));
  const shapeFig = (name, pr, letter) => fig(name, 380, 270, (svg) => {
    const T = GT(svg, Object.assign({ w: 380, h: 270, size: 20, highlight: pr, highlightOpts: { name: false, color: '#1f5bd6' } }, PAR));
    void T; gtext(svg, 352, 34, letter, { size: 30, color: '#1f5bd6', weight: 800 });
  });
  shapeFig('F', [3, 7], 'F'); shapeFig('Z', [4, 6], 'Z'); shapeFig('C', [3, 6], 'C');
  fig('diagA', 420, 300, (svg) => GT(svg, { w: 420, h: 300, parallel: true, tilt: 60, size: 20, gap: 150 }));
  fig('diagB', 420, 300, (svg) => GT(svg, { w: 420, h: 300, parallel: false, skew: -15, tilt: 60, size: 20, gap: 150 }));
  fig('ex8', 360, 300, (svg) => GT(svg, { w: 360, h: 300, parallel: false, skew: -12, tilt: 68, size: 20, angles: { 2: '68°', 7: '100°' } }));
  fig('ladder', 360, 400, (svg) => drawReal('ladder', svg, 76, 120, 352, { size: 22 }));
  fig('road', 430, 300, (svg) => drawReal('road', svg, 66, 232, 210, { size: 21 }));
  fig('window', 450, 300, (svg) => drawReal('window', svg, 72, 100, 220, { size: 21 }));
  fig('map', 450, 300, (svg) => drawReal('map', svg, 62, 90, 238, { size: 21 }));
  const spot = (name, lt, pr, tl = 62) => fig(name, 230, 210, (svg) => {
    const ang = {}; ang[pr[0]] = 'a'; ang[pr[1]] = 'b';
    GT(svg, { w: 230, h: 210, parallel: true, tilt: tl, lineTilt: lt, numbers: false, angles: ang, size: 20, nameSize: 17, highlight: pr, highlightOpts: { name: false, r: 30, len: 60 } });
  });
  spot('spot1', 90, [1, 5]); spot('spot2', 90, [3, 5]); spot('spot3', 90, [4, 5]); spot('spot4', 200, [2, 8], 55);
}
figures();

/* ======================================================================================
 * Math History: Euclid's fifth postulate (same-side interior angles less than 180° → the lines meet on that side)
 * ====================================================================================== */
function histAnim() {
  const svg = document.getElementById('u5l7-hist'); if (!svg) return;
  const NS = 'http://www.w3.org/2000/svg', mk = (t, a, p = svg) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); p.appendChild(e); return e; };
  const BR = '#4a2c14', GOLD = '#b07a12', RAD = Math.PI / 180, pt = (V, d, r) => [V[0] + r * Math.cos(d * RAD), V[1] - r * Math.sin(d * RAD)];
  mk('rect', { x: 0, y: 0, width: 600, height: 300, rx: 14, fill: '#fffaf1' });
  const cap = mk('text', { x: 300, y: 34, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 22, fill: BR });
  const X = 470, T1 = [X, 95], T2 = [X, 225];
  mk('line', { x1: X, y1: 55, x2: X, y2: 270, stroke: BR, 'stroke-width': 3 });
  const tl = mk('text', { x: X + 14, y: 66, 'font-family': 'Georgia, serif', 'font-style': 'italic', 'font-size': 20, fill: BR }); tl.textContent = 't';
  const l1 = mk('line', { stroke: BR, 'stroke-width': 3, 'stroke-linecap': 'round' }), l2 = mk('line', { stroke: BR, 'stroke-width': 3, 'stroke-linecap': 'round' });
  const a1 = mk('path', { fill: GOLD, 'fill-opacity': 0.3, stroke: GOLD, 'stroke-width': 2 }), a2 = mk('path', { fill: GOLD, 'fill-opacity': 0.3, stroke: GOLD, 'stroke-width': 2 });
  const n1 = mk('text', { 'font-family': 'Georgia, serif', 'font-size': 18, 'font-weight': 700, fill: BR, 'text-anchor': 'middle' }), n2 = mk('text', { 'font-family': 'Georgia, serif', 'font-size': 18, 'font-weight': 700, fill: BR, 'text-anchor': 'middle' });
  const sum = mk('text', { x: 300, y: 288, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 20, 'font-weight': 700, fill: GOLD });
  const star = mk('circle', { r: 9, fill: GOLD, stroke: BR, 'stroke-width': 2 });
  const wedge = (V, s, e, r) => { const p = pt(V, s, r), q = pt(V, e, r); return `M${V}L${p}A${r} ${r} 0 0 0 ${q}Z`; };
  const clamp = (t) => Math.max(0, Math.min(1, t)), ease = (t) => t * t * (3 - 2 * t);
  const draw = (s) => {
    const p2 = s >= 7.4, A1 = p2 ? 90 : 70, A2 = p2 ? 90 : 75;               // same-side interior angles on the left of t
    const d1 = 270 - A1, d2 = 90 + A2;                                         // left-going directions of ℓ1 (from T1) and ℓ2 (from T2)
    const meetL = p2 ? 0 : 213 * Math.cos(15 * RAD) / Math.cos(20 * RAD);      // distance along ℓ1 to the meeting point
    const grow = p2 ? ease(clamp((s - 8.2) / 2.2)) : ease(clamp((s - 3.6) / 2.4));
    const Lleft = p2 ? 70 + grow * 370 : 70 + grow * (meetL - 70), Lright = p2 ? 60 + grow * 60 : 60;
    const e1 = pt(T1, d1, Lleft), e2 = pt(T2, d2, p2 ? Lleft : Lleft * Math.cos(20 * RAD) / Math.cos(15 * RAD)), r1 = pt(T1, d1 + 180, Lright), r2 = pt(T2, d2 + 180, Lright);
    l1.setAttribute('x1', e1[0]); l1.setAttribute('y1', e1[1]); l1.setAttribute('x2', r1[0]); l1.setAttribute('y2', r1[1]);
    l2.setAttribute('x1', e2[0]); l2.setAttribute('y1', e2[1]); l2.setAttribute('x2', r2[0]); l2.setAttribute('y2', r2[1]);
    const on = (s > 1 && s < 7.4) || s > 7.8;
    a1.setAttribute('d', wedge(T1, d1, 270, 34)); a2.setAttribute('d', wedge(T2, 90, d2, 34));
    a1.style.opacity = a2.style.opacity = on ? 1 : 0;
    const q1 = pt(T1, (d1 + 270) / 2, 56), q2 = pt(T2, (90 + d2) / 2, 56);
    n1.setAttribute('x', q1[0]); n1.setAttribute('y', q1[1] + 6); n1.textContent = on ? A1 + '°' : '';
    n2.setAttribute('x', q2[0]); n2.setAttribute('y', q2[1] + 6); n2.textContent = on ? A2 + '°' : '';
    sum.textContent = (s > 2.2 && s < 7.4) ? `${A1}° + ${A2}° = ${A1 + A2}°: less than 180°` : s > 8 ? '90° + 90° = 180°' : '';
    const met = !p2 && s > 6;
    star.setAttribute('cx', met ? e1[0] : -50); star.setAttribute('cy', met ? e1[1] : -50);
    cap.textContent = p2 ? (s > 10.2 ? 'They never meet: parallel lines' : 'What if they add to exactly 180°?') : s > 6 ? 'The lines meet on that side!' : 'Euclid’s fifth rule';
  };
  let raf = 0;
  const play = () => {
    cancelAnimationFrame(raf);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { draw(6.5); return; }
    const t0 = performance.now(); const tick = (now) => { const s = (now - t0) / 1000; draw(Math.min(s, 12)); if (s < 12) raf = requestAnimationFrame(tick); }; raf = requestAnimationFrame(tick);
  };
  draw(6.5);
  svg.addEventListener('click', play);
  const btn = svg.closest('.hist-anim') && svg.closest('.hist-anim').querySelector('.hist-play'); if (btn) btn.addEventListener('click', play);
  let seen = false;
  new IntersectionObserver((es) => { es.forEach((e) => { if (e.isIntersecting && !seen) { seen = true; play(); } }); }, { threshold: 0.5 }).observe(svg);
}
histAnim();

/* ======================================================================================
 * Stand Up Break! — name the angle, name the pair, find all eight (not parallel)
 * ====================================================================================== */
function suFig(o) {
  const svg = svgEl('svg', { width: 380, height: 260, viewBox: '0 0 380 260', xmlns: 'http://www.w3.org/2000/svg' });
  Geo.transversal(svg, Object.assign({ w: 380, h: 260, size: 21 }, o));
  return svg.outerHTML;
}
const TO = { corresponding: 'corresponding to', 'alt-int': 'alternate interior to', 'alt-ext': 'alternate exterior to', 'int-same': 'interior on the same side as', 'ext-same': 'exterior on the same side as', 'vert-opp': 'vertically opposite' };
standup('u5l7', {
  intro: 'Find the angles in the diagram. Ask the three questions: same crossing? interior or exterior? same side of t?',
  levels: {
    BEG: (r) => {
      const k = r.pick(Object.keys(TO)), p = r.pick(Geo.PAIRS[k]), [a, b] = r.chance(0.5) ? p : [p[1], p[0]];
      return { text: `Name the angle that is <b>${TO[k]}</b> ${A(a)}.`, q: '', fig: suFig({ parallel: true, tilt: r.int(52, 75) }), a: [`\\angle ${b}`] };
    },
    PRG: (r) => {
      const p = r.pick(ALLPAIRS), [a, b] = r.chance(0.5) ? p : [p[1], p[0]], K = classify(a, b);
      const name = K.key === 'linear' ? 'next to each other: a straight line (they add to 180°)' : NAMES[K.key];
      return { text: `Name the pair ${A(a)} and ${A(b)}.`, q: '', fig: suFig({ parallel: r.chance(0.5), skew: r.pick([-12, -9, 9, 12]), tilt: r.int(55, 72) }),
        atext: `${K.same ? `same crossing, ${Math.abs(a - b) === 2 ? 'across from each other' : 'next to each other'}` : `different crossings · ${K.io} · ${K.side}`}<br><b>${name}</b>` };
    },
    MAS: (r) => {
      const ti = r.int(56, 74), sk = r.pick([-14, -12, -10, -8, 8, 10, 12, 14]), m = meas(ti, sk), k1 = r.int(1, 4), k2 = r.int(5, 8);
      const ang = {}; ang[k1] = m[k1] + '°'; ang[k2] = m[k2] + '°';
      const reason = (k, given) => { const vo = Math.abs(k - given) === 2; return vo ? `\\text{(vert. opp. }\\angle ${given}\\text{)}` : `\\text{(straight line with }\\angle ${given}\\text{)}`; };
      const lines = [];
      [[1, 2, 3, 4, k1], [5, 6, 7, 8, k2]].forEach(([p1, p2, p3, p4, g]) => {
        const opp = ((g - 1 + 2) % 4) + (g > 4 ? 5 : 1), nb = [p1, p2, p3, p4].filter((k) => k !== g && k !== opp);
        lines.push(`\\angle ${opp}=${m[opp]}^\\circ\\ ${reason(opp, g)}`);
        nb.forEach((k) => lines.push(`\\angle ${k}=180^\\circ-${m[g]}^\\circ=${m[k]}^\\circ\\ ${reason(k, g)}`));
      });
      return { text: `ℓ₁ and ℓ₂ are <b>not</b> parallel. ${A(k1)} = ${m[k1]}° and ${A(k2)} = ${m[k2]}°. Find the other six angles. Give a reason for each.`, q: '', fig: suFig({ parallel: false, skew: sk, tilt: ti, angles: ang }), a: lines };
    }
  }
});
