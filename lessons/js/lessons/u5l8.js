/* Math 10-3 · Unit 5 · Lesson 8 — Parallel Lines and Transversals: Finding Missing Angles
 * Explainers: the parallel-line rules, pair by pair, with their letter shapes (equal / add to 180° / always true /
 * only two sizes); why corresponding angles are equal (Full notes: the top crossing slides down the transversal);
 * one angle fills in all 8 with a reason for each (Examples 1 and 2); two roads and a triangle, plus an equation for x
 * (Example 3); a parking lot whose stall turns out to be a parallelogram, a car parks in it (Example 4); a transversal
 * turning until it is perpendicular, wall studs, complementary angles; balusters on a staircase (Example 5); Leah's
 * leaning bookshelf: turn the bottom shelf until it lines up, with a spirit level (Example 6); Owen's joists, which meet
 * far away when the picture zooms out, then turn by 3° (Example 7). Then the Stand Up Break and the Math History
 * animation (Euclid's fifth rule). Static figures on the cards use the shared Geo toolkit (js/geo.js). */
import { h, add, box, tex, svgEl, tween, stamp, stampIn, mountExplainers, drawIn } from '../blocks.js';
import { Geo } from '../geo.js';
import { standup } from '../standup.js';

const RAD = Math.PI / 180;
const { at, wedgeD, n360 } = Geo;
const T = (s) => tex(String(s));
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const COL = { blue: '#1f5bd6', green: '#12805a', purple: '#7b4fc4', amber: '#c27a0e', red: '#c93a33', ink: '#1c2230', slate: '#3a4254', brand: '#6e4a1c', wood: '#c8955a', woodD: '#8a5a2b' };
const P = (a) => a.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1));
const popable = (el) => { el.style.transformBox = 'fill-box'; el.style.transformOrigin = 'center'; return el; };
const line = (g, A, B, o = {}) => svgEl('path', { d: `M${P([A, B]).join('L')}`, stroke: o.color || COL.ink, 'stroke-width': o.w || 3, 'stroke-linecap': o.cap || 'round', fill: 'none', 'stroke-dasharray': o.dash, opacity: o.op, class: o.cls, 'vector-effect': o.nss ? 'non-scaling-stroke' : null }, g);
const poly = (g, pts, o = {}) => svgEl('path', { d: 'M' + P(pts).join('L') + (o.close ? 'Z' : ''), stroke: o.color || COL.ink, 'stroke-width': o.w ?? 3, fill: o.fill || 'none', 'fill-opacity': o.fo, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', opacity: o.op, 'stroke-dasharray': o.dash, class: o.cls }, g);
const wedge = (g, V, r, s, span, color, fo = 0.3) => popable(svgEl('path', { d: wedgeD(V, r, s, span), fill: color, 'fill-opacity': fo, stroke: 'none' }, g));
const lab = (g, p, s, o = {}) => popable(Geo.text(g, p[0], p[1], s, Object.assign({ size: 22 }, o)));
const relabel = (t, s, color) => { t.textContent = s; if (color) t.setAttribute('fill', color); };
const root = (stage, W, H, x = 0, y = 0) => add(stage, svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u5l8-svg' }), x, y);
const pane = (stage, x, y, w, html, cls = '') => hide(add(stage, box(h('div', 'u5l8-pn ' + cls, html), w), x, y));
const fadeOut = (c, el, ms = 260) => c.anim(el, [{ opacity: 1 }, { opacity: 0 }], ms);
/** reason text: ∠6 → KaTeX, "180° − 72°" → KaTeX */
const R = (s) => s.replace(/(\d+)° − (\d+)°(?: − (\d+)°)?/g, (m, a, b, c) => T(`${a}^\\circ-${b}^\\circ${c ? `-${c}^\\circ` : ''}`)).replace(/∠(\d)/g, (m, k) => T('\\angle' + k));
/** an angle at a crossing, numbered like the booklet (j = 1..4 clockwise from the upper-left): {X, start, span} */
function cornerAt(X, L, td, j) {
  const s = j === 1 ? td : j === 2 ? L : j === 3 ? td + 180 : L + 180, e = j === 1 ? L + 180 : j === 2 ? td : j === 3 ? L + 360 : td + 180;
  return { X, start: n360(s), span: n360(e - s) };
}
/** label distance so the text clears both arms */
const labD = (span, s, min = 30) => Math.max(min, Math.min(90, (String(s).length * 6.5 + 8) / Math.max(0.2, Math.sin(span / 2 * RAD)) + 4));
/** small table rows (Angle | Size | Reason) in an explainer */
function rowTable(stage, x, y, w, heads, rows, rowH = 42, cols = '64px 82px 1fr') {
  const hd = add(stage, box(h('div', 'u5l8-tr head', heads.map((s) => `<div>${s}</div>`).join('')), w), x, y); hd.style.gridTemplateColumns = cols;
  return rows.map((r, i) => { const e = pane(stage, x, y + 38 + i * rowH, w, r.map((s) => `<div>${s}</div>`).join(''), 'u5l8-tr'); e.style.gridTemplateColumns = cols; e.style.height = rowH + 'px'; return e; });
}

/* =====================================================================================
 * shared scenes (card figures and explainers)
 * ===================================================================================== */
/** Example 3: two roads meet at A on ℓ1 and make a triangle with ℓ2. o: { A, h, L, R, ext, size } */
function vee(g, o) {
  const A = o.A, hh = o.h, L = o.L, Rr = o.R, ext = o.ext || 60, sz = o.size || 20, k0 = sz / 20;
  const B = at(A, 180 + L, hh / Math.sin(L * RAD)), C = at(A, -Rr, hh / Math.sin(Rr * RAD)), y2 = A[1] + hh;
  const l2a = [B[0] - ext, y2], l2b = [C[0] + ext, y2], l1a = [A[0] - hh / Math.tan(L * RAD) - ext, A[1]], l1b = [A[0] + hh / Math.tan(Rr * RAD) + ext, A[1]];
  const tri = poly(g, [A, B, C], { close: true, color: 'none', fill: '#f5ecdf', fo: 0 });
  line(g, l1a, l1b); line(g, l2a, l2b);
  const ex = (U, V, t) => [U[0] + (V[0] - U[0]) * t, U[1] + (V[1] - U[1]) * t];
  line(g, ex(A, B, -0.22), ex(A, B, 1.18)); line(g, ex(A, C, -0.22), ex(A, C, 1.18));
  [l1a, l2a].forEach((E) => { const p = [E[0] + 26, E[1]]; poly(g, [[p[0] - 9, p[1] - 7], p, [p[0] - 9, p[1] + 7]], { w: 2.6 }); });
  Geo.text(g, l1b[0] + 18, A[1], 'ℓ₁', { size: sz, italic: true }); Geo.text(g, l2b[0] + 18, y2, 'ℓ₂', { size: sz, italic: true });
  Geo.text(g, A[0], A[1] - 25 * k0, 'A', { size: sz - 1, italic: true }); Geo.text(g, B[0] + 16, B[1] + 19, 'B', { size: sz - 1, italic: true }); Geo.text(g, C[0] - 16, C[1] + 19, 'C', { size: sz - 1, italic: true });
  const k = sz / 20;
  const labs = {
    L: lab(g, at(A, 180 + L / 2, labD(L, '48°') * k), o.labels.L, { size: sz }), R: lab(g, at(A, -Rr / 2, labD(Rr, '57°') * k), o.labels.R, { size: sz }),
    c: lab(g, at(A, 270 + (L - Rr) / 2, 30 * k), o.labels.c, { size: sz }), a: lab(g, at(B, L / 2, labD(L, '48°') * k), o.labels.a, { size: sz }), b: lab(g, at(C, 180 - Rr / 2, labD(Rr, '57°') * k), o.labels.b, { size: sz })
  };
  return { A, B, C, y2, l1a, l1b, l2a, l2b, labs, tri };
}
/** Example 4: the parking lot. o: { x0, yF, yC, sp, n, W, ang, size } */
function parkLot(g, o) {
  const dx = (o.yC - o.yF) / Math.tan(o.ang * RAD), sz = o.size || 20;
  svgEl('rect', { x: 0, y: o.yF - 18, width: o.W, height: o.yC - o.yF + 18, fill: '#eceae4' }, g);
  svgEl('rect', { x: 0, y: o.yC, width: o.W, height: 20, fill: '#cfcac0' }, g);
  line(g, [0, o.yC], [o.W, o.yC], { w: 5, cap: 'butt' });
  line(g, [0, o.yF], [o.W - 90, o.yF], { cap: 'butt' });
  Geo.text(g, o.W - 46, o.yF, 'front line', { size: sz - 4, color: COL.slate });
  Geo.text(g, o.W - 40, o.yC + 10, 'curb', { size: sz - 4, color: COL.slate, halo: false });
  const st = []; for (let i = 0; i < o.n; i++) { const x = o.x0 + i * o.sp; st.push([[x, o.yC], [x + dx, o.yF]]); line(g, st[i][0], st[i][1]); }
  return { dx, st };
}
/** Example 5: the staircase (booklet units → px). o: { s, ox, oy, size } */
function stairs(g, o) {
  const s = o.s, X = (x) => o.ox + x * s, Y = (y) => o.oy - y * s, Q = (x, y) => [X(x), Y(y)], r = 0.654, rail = (x) => 1.554 + 0.7265 * x, sz = o.size || 20;
  const tr = [[-1.2, 0], [0, 0]]; for (let k = 0; k < 5; k++) { tr.push([0.9 * k, r * (k + 1)]); tr.push([Math.min(0.9 * (k + 1), 4.6), r * (k + 1)]); }
  svgEl('path', { d: 'M' + P(tr.map(([x, y]) => Q(x, y))).join('L') + `L${X(4.6)} ${Y(0)}L${X(-1.2)} ${Y(0)}Z`, fill: '#efe6d6', stroke: 'none' }, g);
  poly(g, tr.map(([x, y]) => Q(x, y)));
  const bal = []; for (let k = 0; k < 4; k++) { const x = 0.9 * k + 0.45; bal.push({ foot: Q(x, r * (k + 1)), top: Q(x, rail(x)) }); line(g, bal[k].foot, bal[k].top, { w: 4, color: COL.woodD }); }
  const S0 = Q(-1.2, rail(-1.2)), E = Q(4.4, rail(4.4));
  line(g, S0, E, { w: 6.5, color: COL.brand });
  Geo.text(g, E[0] + 8, E[1], 'handrail', { size: sz - 4, anchor: 'start', color: COL.slate });
  const dash = line(g, S0, Q(-0.1, rail(-1.2)), { w: 2.5, dash: '7 5', color: COL.slate });
  const l36 = lab(g, at(S0, 18, 0.95 * s), '36°', { size: sz - 2 });
  const sq = (V, d1, d2, z = 0.18 * s) => poly(g, [at(V, d1, z), at(at(V, d1, z), d2, z), at(V, d2, z)], { w: 2 });
  sq(bal[0].foot, 0, 90);
  const la = lab(g, [bal[0].foot[0] + 0.37 * s, bal[0].foot[1] - 0.17 * s], 'a', { size: sz, italic: true });
  const Rp = bal[2].top;
  const lb = lab(g, at(Rp, 243, 0.55 * s), 'b', { size: sz, italic: true }), lc = lab(g, at(Rp, 333, 0.45 * s), 'c', { size: sz, italic: true });
  return { s, Q, X, Y, rail, bal, S0, Rp, dash, l36, la, lb, lc, sq };
}
/** Example 7: the beam and two joists. o: { s, ox, oy, d2, size, below } */
function joistScene(g, o) {
  const s = o.s, sz = o.size || 20, P1 = [o.ox + 1 * s, o.oy], P2 = [o.ox + 3.4 * s, o.oy], d2 = o.d2 ?? 63, below = o.below ?? 0.9, long = o.long || 2.3;
  line(g, [o.ox - 0.6 * s, o.oy], [o.ox + 5.6 * s, o.oy], { w: 6, cap: 'butt', nss: o.nss });
  const bl = Geo.text(g, o.ox + 5.6 * s + 8, o.oy, 'beam', { size: sz - 4, anchor: 'start', color: COL.slate });
  const j1 = line(g, at(P1, 240, below * s), at(P1, 60, (o.len1 || long) * s), { w: 3.5, nss: o.nss });
  const g2 = svgEl('g', {}, g); g2.style.transformBox = 'view-box'; g2.style.transformOrigin = '0 0';
  const j2 = line(g2, at(P2, d2 + 180, below * s), at(P2, d2, (o.len2 || long) * s), { w: 3.5, nss: o.nss });
  const n1 = Geo.text(g, ...at(P1, 60, long * s + 18), 'joist 1', { size: sz - 4, color: COL.slate }), n2 = Geo.text(g2, ...at(P2, d2, long * s + 18), 'joist 2', { size: sz - 4, color: COL.slate });
  const l60 = lab(g, at(P1, 30, labD(60, '60°') * sz / 20), '60°', { size: sz }), l117 = lab(g, at(P2, (d2 + 180) / 2, labD(180 - d2, '117°') * sz / 20), '117°', { size: sz });
  return { P1, P2, j1, j2, g2, l60, l117, n1, n2, bl };
}

/* =====================================================================================
 * 1. The parallel-line rules
 * ===================================================================================== */
const RULES = {
  corresponding: { nm: 'Corresponding angles', shp: 'F shape', eq: true, cap: 'Corresponding angles are in the <b>same corner</b> at each crossing. Together they make an <b>F</b>.' },
  'alt-int': { nm: 'Alternate interior angles', shp: 'Z shape', eq: true, cap: 'Alternate interior angles are <b>between</b> the lines, on <b>opposite sides</b> of <i>t</i>. They make a <b>Z</b>.' },
  'alt-ext': { nm: 'Alternate exterior angles', shp: '', eq: true, cap: 'Alternate exterior angles are <b>outside</b> the lines, on <b>opposite sides</b> of <i>t</i>.' },
  'int-same': { nm: 'Interior angles on the same side', shp: 'U shape', eq: false, cap: 'Interior angles on the same side are <b>between</b> the lines, on the <b>same side</b> of <i>t</i>. They make a <b>U</b>.' },
  'ext-same': { nm: 'Exterior angles on the same side', shp: '', eq: false, cap: 'Exterior angles on the same side are <b>outside</b> the lines, on the <b>same side</b> of <i>t</i>.' }
};
const rules = {
  title: 'The parallel-line rules, pair by pair',
  height: 420, minW: 960,
  choices: [{ sep: 'Equal:' }, { v: 'corresponding', label: 'corresponding (F)' }, { v: 'alt-int', label: 'alternate interior (Z)' }, { v: 'alt-ext', label: 'alternate exterior' },
    { sep: 'Add to 180°:' }, { v: 'int-same', label: 'interior, same side (U)' }, { v: 'ext-same', label: 'exterior, same side' },
    { sep: 'Always:' }, { v: 'always', label: 'opposite, straight line' }, { v: 'two', label: 'only two sizes' }],
  ask: (k) => (k === 'always' ? 'These two lines are <b>not</b> parallel. Which angle pairs still match for sure?'
    : k === 'two' ? `${T('\\ell_1\\parallel\\ell_2')} and <i>t</i> crosses them at 62°. How many <b>different sizes</b> of angle are there?`
      : `${T('\\ell_1\\parallel\\ell_2')}. Where are the <b>${RULES[k].nm.toLowerCase()}</b>, and how are they related?`),
  make(stage, k, ex) {
    const W = ex.W, par = k !== 'always';
    const TV = Geo.transversal(stage, { x: 0, y: 4, w: 600, h: 410, tilt: 62, parallel: par, skew: 14, size: 22 });
    const m = TV.measures(), X = 612, PW = W - X - 14;
    const head = pane(stage, X, 14, PW, '', 'head');
    const steps = [];
    if (RULES[k]) {
      const r = RULES[k], color = Geo.PAIR_COLORS[k], pairs = Geo.PAIRS[k], rh = r.eq ? 54 : 78;
      head.innerHTML = `<b style="color:${color}">${r.nm}</b>${r.shp ? `<small>${r.shp}</small>` : ''}`;
      const rows = pairs.map(([a, b], i) => pane(stage, X, 96 + i * rh, PW, r.eq ? `${T(`\\angle${a}=\\angle${b}`)}<span class="u5l8-sp"></span>${T(`${m[a]}^\\circ=${m[b]}^\\circ`)}` : `${T(`\\angle${a}+\\angle${b}`)}<br>${T(`=${m[a]}^\\circ+${m[b]}^\\circ=180^\\circ`)}`, 'row'));
      const st = hide(stamp(stage, r.eq ? 'equal ✓' : 'add to 180° ✓', { ok: true, x: X + PW / 2, y: 372, rotate: -5 }));
      pairs.forEach(([a, b], i) => steps.push({
        cap: i === 0 ? r.cap : `Another pair: angles <b>${a}</b> and <b>${b}</b>. ${r.eq ? `Both are <b>${m[a]}°</b>.` : `${m[a]}° + ${m[b]}° = <b>180°</b>.`}`,
        run: async (c) => { TV.clearHighlight(); if (i === 0) await c.fadeIn(head); TV.setLabel(a, m[a] + '°'); TV.setLabel(b, m[b] + '°'); await TV.highlight(c, [a, b], { name: false }); await c.fadeIn(rows[i]); }
      }));
      steps.push({ cap: `When ${T('\\ell_1\\parallel\\ell_2')}, ${r.nm.toLowerCase()} ${r.eq ? 'are <b>equal</b>.' : '<b>add to 180°</b> (they are supplementary).'}`, run: (c) => stampIn(c, st) });
      return steps;
    }
    if (k === 'always') {
      head.innerHTML = '<b>Always true</b><small>parallel or not</small>';
      const list = [[[1, 3], 'vert-opp', '<b>Vertically opposite</b> angles are across from each other at a crossing, like an X: ∠1 and ∠3.'],
        [[6, 8], 'vert-opp', 'At the bottom crossing too: ∠6 and ∠8 are equal, even though the lines are <b>not</b> parallel.'],
        [[1, 2], 'linear', 'Two angles side by side on a <b>straight line</b> add to 180°: ∠1 + ∠2.'],
        [[5, 6], 'linear', `On ℓ₂: ∠5 + ∠6 = ${m[5]}° + ${m[6]}° = <b>180°</b>.`]];
      const rows = list.map(([[a, b], nm], i) => pane(stage, X, 96 + i * 58, PW, nm === 'vert-opp' ? `${T(`\\angle${a}=\\angle${b}`)}<span class="u5l8-sp"></span>${T(`${m[a]}^\\circ`)}` : `${T(`\\angle${a}+\\angle${b}=180^\\circ`)}`, 'row'));
      const no = pane(stage, X, 336, PW, `${T('\\angle1=118^\\circ')}, ${T(`\\angle5=${m[5]}^\\circ`)}: <b class="u5l8-bad">not equal</b>`, 'row');
      list.forEach(([pr, nm, cap], i) => steps.push({ cap: R(cap), run: async (c) => { TV.clearHighlight(); if (i === 0) await c.fadeIn(head); pr.forEach((q) => TV.setLabel(q, m[q] + '°')); await TV.highlight(c, pr, { name: false, shape: nm === 'vert-opp' ? undefined : false }); await c.fadeIn(rows[i]); } }));
      steps.push({ cap: R(`But the parallel-line rules <b>fail</b> here: corresponding angles ∠1 and ∠5 are ${m[1]}° and ${m[5]}°. They need parallel lines.`), run: async (c) => { TV.clearHighlight(); TV.setLabel(5, m[5] + '°'); await TV.highlight(c, [1, 5], { name: false, color: 'red' }); await c.fadeIn(no); } });
      return steps;
    }
    // only two sizes
    head.innerHTML = '<b>Only two sizes</b><small>when the lines are parallel</small>';
    const r1 = pane(stage, X, 96, PW, `<b style="color:${COL.blue}">Small:</b> ${T('\\angle2,\\ \\angle4,\\ \\angle6,\\ \\angle8')}<br>all ${T('62^\\circ')}`, 'row');
    const r2 = pane(stage, X, 186, PW, `<b style="color:${COL.amber}">Big:</b> ${T('\\angle1,\\ \\angle3,\\ \\angle5,\\ \\angle7')}<br>all ${T('118^\\circ')}`, 'row');
    const r3 = pane(stage, X, 280, PW, `small + big ${T('=62^\\circ+118^\\circ=180^\\circ')}`, 'row');
    const st = hide(stamp(stage, 'only 2 sizes', { ok: true, x: X + PW / 2, y: 374, rotate: -5 }));
    return [
      { cap: 'All the <b>small</b> (acute) angles are equal: angles 2, 4, 6 and 8 are all 62°.', run: async (c) => { await c.fadeIn(head); [2, 4, 6, 8].forEach((q) => TV.setLabel(q, '62°')); await TV.highlight(c, [2, 4, 6, 8], { name: false, shape: false, color: 'blue' }); await c.fadeIn(r1); } },
      { cap: 'All the <b>big</b> (obtuse) angles are equal: angles 1, 3, 5 and 7 are all 118°.', run: async (c) => { [1, 3, 5, 7].forEach((q) => TV.setLabel(q, '118°')); await TV.highlight(c, [1, 3, 5, 7], { name: false, shape: false, color: 'amber' }); await c.fadeIn(r2); } },
      { cap: 'And <b>small + big = 180°</b>. Use this to <b>check</b> your answers, but write the rule’s name as your reason.', run: async (c) => { await c.fadeIn(r3); await stampIn(c, st); } }
    ];
  }
};

/* why corresponding angles are equal (Full notes) */
const whyF = {
  title: 'Slide the top crossing down the transversal',
  height: 400, minW: 900,
  choices: [{ v: 1, label: 'parallel lines' }, { v: 0, label: 'not parallel' }],
  ask: (p) => (p ? `${T('\\ell_1\\parallel\\ell_2')}. Why is ${T('\\angle2=\\angle6')}?` : 'The lines are <b>not</b> parallel. Does the copy of angle 2 still fit angle 6?'),
  make(stage, par, ex) {
    const TV = Geo.transversal(stage, { x: (ex.W - 640) / 2, y: 6, w: 640, h: 390, parallel: !!par, tilt: 62, skew: 16, numbers: false, size: 22 });
    const m2 = TV.measure(2), m6 = TV.measure(6);
    const st = hide(stamp(stage, par ? 'it fits ✓' : 'no fit ✗', { ok: !!par, x: ex.W - 110, y: 340, rotate: -6 }));
    const steps = [
      { cap: `Angle 2 is <b>${m2}°</b>.`, run: async (c) => { TV.setLabel(2, m2 + '°'); await c.pop(TV.labels[2]); } },
      { cap: 'Slide a copy of angle 2 down the transversal to the bottom crossing…', run: (c) => TV.slide(c, 2) },
      { cap: par ? 'The bottom line points the <b>same way</b> as the top line, so the copy fits angle 6 exactly: <b>corresponding angles are equal</b>.' : `Angle 6 is <b>${m6}°</b>. The bottom line is turned, so the copy does <b>not</b> fit. The rule needs <b>parallel</b> lines.`, run: async (c) => { TV.setLabel(6, m6 + '°'); await c.pop(TV.labels[6]); await stampIn(c, st); } }
    ];
    if (par) steps.push({ cap: 'Every corner at the top lands on its partner: 1 on 5, 2 on 6, 3 on 7, 4 on 8. The other rules follow from this one.', run: async (c) => { await Promise.all([1, 3, 4].map((q) => TV.slide(c, q, 1000, { color: q === 1 || q === 3 ? 'blue' : 'amber' }))); } });
    return steps;
  }
};

/* =====================================================================================
 * Examples 1 and 2: one angle fills in all 8
 * ===================================================================================== */
const FILL = {
  e1: { given: 3, v: 115, tilt: 65, small: 65, big: 115, rows: [[5, 115, 'alternate interior with ∠3', 3], [7, 115, 'corresponding to ∠3', 3], [1, 115, 'vertically opposite ∠3', 3], [6, 65, 'interior, same side: 180° − 115°', 3], [4, 65, 'on a straight line: 180° − 115°', 3]] },
  e2: { given: 6, v: 72, tilt: 72, small: 72, big: 108, rows: [[8, 72, 'vertically opposite ∠6', 6], [2, 72, 'corresponding to ∠6', 6], [4, 72, 'alternate interior with ∠6', 6], [5, 108, 'straight line with ∠6: 180° − 72°', 6], [7, 108, 'vertically opposite ∠5', 5], [1, 108, 'corresponding to ∠5', 5], [3, 108, 'alternate interior with ∠5', 5]] },
  o: { given: 8, v: 47, tilt: 47, small: 47, big: 133, rows: [[6, 47, 'vertically opposite ∠8', 8], [4, 47, 'corresponding to ∠8', 8], [2, 47, 'alternate exterior with ∠8', 8], [7, 133, 'straight line with ∠8: 180° − 47°', 8], [5, 133, 'vertically opposite ∠7', 7], [3, 133, 'corresponding to ∠7', 7], [1, 133, 'alternate exterior with ∠7', 7]] }
};
const fill8 = {
  title: 'One angle fills in all 8',
  height: 420, minW: 960,
  choices: [{ sep: 'Example 1 check:' }, { v: 'e1', label: '∠3 = 115°' }, { sep: 'Example 2 check:' }, { v: 'e2', label: '∠6 = 72°' }, { sep: 'Another:' }, { v: 'o', label: '∠8 = 47°' }],
  ask: (k) => ({ e1: `Example 1: ${T('\\ell_1\\parallel\\ell_2')} and ${T('\\angle3=115^\\circ')}. Find angles 5, 7, 1, 6 and 4.`, e2: `Example 2: ${T('\\ell_1\\parallel\\ell_2')} and ${T('\\angle6=72^\\circ')}. Find the other 7 angles, with a reason for each.`, o: `${T('\\ell_1\\parallel\\ell_2')} and ${T('\\angle8=47^\\circ')}. Find the other 7 angles, with a reason for each.` })[k],
  make(stage, k, ex) {
    const F = FILL[k], W = ex.W;
    const TV = Geo.transversal(stage, { x: 0, y: 4, w: 500, h: 410, tilt: F.tilt, angles: { [F.given]: F.v }, labelColors: { [F.given]: 'red' }, size: 22 });
    const X = 512, TW = W - X - 12, rh = k === 'e1' ? 50 : 42;
    const rows = rowTable(stage, X, 8, TW, ['Angle', 'Size', 'Reason'], F.rows.map(([q, v, why]) => [T('\\angle' + q), `<b>${v}°</b>`, R(why)]), rh);
    const found = [F.given];
    const chk = pane(stage, X, 8 + 38 + F.rows.length * rh + 8, TW, k === 'e1' ? `Check: big ${T('115^\\circ')}, small ${T('65^\\circ')}, ${T('115+65=180')} ✓` : `Check: four of ${T(F.small + '^\\circ')}, four of ${T(F.big + '^\\circ')}, ${T(`${F.small}+${F.big}=180`)} ✓`, 'chk');
    const steps = [{ cap: `Start with the one angle we know: ${T('\\angle' + F.given + '=' + F.v + '^\\circ')}. Find the others <b>one at a time</b>, each from an angle we already have.`, run: (c) => c.pop(TV.labels[F.given]) }];
    F.rows.forEach(([q, v, why, from], i) => steps.push({
      cap: `${T('\\angle' + q)} = <b>${v}°</b>: ${R(why)}.`,
      run: async (c) => { TV.clearHighlight(); await TV.highlight(c, [q, from], { name: false, r: 40 }); TV.setLabel(q, v + '°'); await c.pop(TV.labels[q]); found.push(q); await c.fadeIn(rows[i]); }
    }));
    const sm = () => found.filter((q) => TV.measure(q) === F.small), bg = () => found.filter((q) => TV.measure(q) === F.big);
    steps.push({ cap: k === 'e1' ? 'Check with the shortcut: the big angles are all 115°, the small ones 65°, and 115 + 65 = 180 ✓' : `Check with the shortcut: four angles of ${F.small}°, four of ${F.big}°, and ${F.small} + ${F.big} = 180 ✓`,
      run: async (c) => { TV.clearHighlight(); await TV.highlight(c, sm(), { name: false, shape: false, color: 'blue', r: 40 }); await TV.highlight(c, bg(), { name: false, shape: false, color: 'amber', r: 40 }); await c.fadeIn(chk); } });
    return steps;
  }
};

/* =====================================================================================
 * Example 3: two roads; an equation for x
 * ===================================================================================== */
const roads = {
  title: 'Find the angles in order',
  height: 400, minW: 960,
  choices: [{ sep: 'Example 3 check:' }, { v: 'ex3', label: 'Find a, b, c' }, { sep: 'Equations:' }, { v: 'eq', label: 'x and 47° on a line' }],
  ask: (k) => (k === 'ex3' ? `Example 3: ${T('\\ell_1\\parallel\\ell_2')}. Find <i>a</i>, <i>b</i> and <i>c</i>, in that order, with a reason for each.` : '<i>x</i> and 47° are on a straight line. Write an equation and solve it.'),
  make(stage, k, ex) {
    const W = ex.W;
    if (k === 'eq') {
      const sv = root(stage, 600, 400), O = [300, 290];
      line(sv, [40, O[1]], [560, O[1]]); line(sv, O, at(O, 47, 260));
      const w47 = wedge(sv, O, 64, 0, 47, COL.blue), wx = hide(wedge(sv, O, 48, 47, 133, COL.amber));
      const semi = hide(svgEl('path', { d: Geo.arcD(O, 120, 0, 180), fill: 'none', stroke: COL.amber, 'stroke-width': 2.5, 'stroke-dasharray': '7 6' }, sv));
      const t180 = hide(lab(sv, [O[0], O[1] - 140], '180°', { size: 22, color: COL.amber }));
      lab(sv, at(O, 23.5, 96), '47°'); const lx = lab(sv, at(O, 113.5, 74), 'x', { italic: true });
      void w47;
      const X = 620, PW = W - X - 14;
      const e1 = pane(stage, X, 60, PW, T('x+47^\\circ=180^\\circ'), 'eq'), e2 = pane(stage, X, 130, PW, T('x=180^\\circ-47^\\circ'), 'eq'), e3 = pane(stage, X, 200, PW, T('x=133^\\circ'), 'eq res');
      const st = hide(stamp(stage, '133 + 47 = 180 ✓', { ok: true, x: X + PW / 2, y: 300, rotate: -5 }));
      return [
        { cap: '<i>x</i> and 47° are on a <b>straight line</b>, so together they make 180°.', run: async (c) => { await c.fadeIn(wx); await c.fadeIn(semi); await c.fadeIn(t180); } },
        { cap: `Write the equation: ${T('x+47^\\circ=180^\\circ')}.`, run: (c) => c.fadeIn(e1) },
        { cap: 'Take 47° away from 180°.', run: (c) => c.fadeIn(e2) },
        { cap: `${T('x=133^\\circ')}. Check: 133 + 47 = 180 ✓`, run: async (c) => { await c.fadeIn(e3); relabel(lx, '133°', COL.red); lx.setAttribute('font-style', 'normal'); await c.pop(lx); await stampIn(c, st); } }
      ];
    }
    const sv = root(stage, 620, 400);
    const V = vee(sv, { A: [330, 72], h: 236, L: 48, R: 57, ext: 70, size: 22, labels: { L: '48°', R: '57°', c: 'c', a: 'a', b: 'b' } });
    ['a', 'b', 'c'].forEach((q) => V.labs[q].setAttribute('font-style', 'italic'));
    const hl = svgEl('g', {}, sv); sv.insertBefore(hl, sv.firstChild.nextSibling);
    const X = 632, TW = W - X - 12;
    const rows = rowTable(stage, X, 14, TW, ['Angle', 'Size', 'Reason'], [['<i>a</i>', '<b>48°</b>', 'alternate interior (road <i>AB</i>)'], ['<i>b</i>', '<b>57°</b>', 'alternate interior (road <i>AC</i>)'], ['<i>c</i>', '<b>75°</b>', `straight line at <i>A</i>: ${T('180^\\circ-48^\\circ-57^\\circ')}`]], 62, '58px 64px 1fr');
    const chk = pane(stage, X, 14 + 38 + 3 * 62 + 14, TW, `Triangle: ${T('48^\\circ+57^\\circ+75^\\circ=180^\\circ')} ✓`, 'chk');
    const st = hide(stamp(stage, 'checked ✓', { ok: true, x: X + TW / 2, y: 350, rotate: -5 }));
    const Zs = (A, B, C2, D, color) => { const z = poly(hl, [A, B, C2, D], { color, w: 12, op: 0.3 }); return z; };
    return [
      { cap: 'Road <b><i>AB</i></b> crosses both parallel lines: it is a <b>transversal</b>.', run: async (c) => { const t = line(hl, V.A, V.B, { color: COL.blue, w: 12, op: 0.3, cls: 'bk-stroke' }); await drawIn(t, 600, c); } },
      { cap: '<i>a</i> and 48° are between the lines, on opposite sides of <i>AB</i>: <b>alternate interior</b> angles (a Z). So <b><i>a</i> = 48°</b>.',
        run: async (c) => { const z = Zs([V.A[0] - 150, V.A[1]], V.A, V.B, [V.B[0] + 150, V.y2], COL.blue); const w1 = wedge(hl, V.A, 46, 180, 48, COL.blue), w2 = wedge(hl, V.B, 46, 0, 48, COL.blue); await drawIn(z, 700, c); await Promise.all([c.pop(w1), c.pop(w2)]); relabel(V.labs.a, '48°', COL.red); V.labs.a.setAttribute('font-style', 'normal'); await c.pop(V.labs.a); await c.fadeIn(rows[0]); } },
      { cap: 'Road <b><i>AC</i></b> is a transversal too. <i>b</i> and 57° make a Z: <b>alternate interior</b> angles, so <b><i>b</i> = 57°</b>.',
        run: async (c) => { const z = Zs([V.A[0] + 150, V.A[1]], V.A, V.C, [V.C[0] - 150, V.y2], COL.green); const w1 = wedge(hl, V.A, 46, -57, 57, COL.green), w2 = wedge(hl, V.C, 46, 123, 57, COL.green); await drawIn(z, 700, c); await Promise.all([c.pop(w1), c.pop(w2)]); relabel(V.labs.b, '57°', COL.red); V.labs.b.setAttribute('font-style', 'normal'); await c.pop(V.labs.b); await c.fadeIn(rows[1]); } },
      { cap: `The 3 angles at <i>A</i> make a <b>straight line</b>: ${T('48^\\circ+c+57^\\circ=180^\\circ')}, so ${T('c=180^\\circ-48^\\circ-57^\\circ=75^\\circ')}.`,
        run: async (c) => { const w = wedge(hl, V.A, 40, 228, 75, COL.amber, 0.4); const s = svgEl('path', { d: Geo.arcD(V.A, 50, 180, 180), fill: 'none', stroke: COL.amber, 'stroke-width': 2.5, 'stroke-dasharray': '6 5' }, hl); await c.pop(w); await c.fadeIn(s); relabel(V.labs.c, '75°', COL.red); V.labs.c.setAttribute('font-style', 'normal'); await c.pop(V.labs.c); await c.fadeIn(rows[2]); } },
      { cap: 'Check: the angles of triangle <i>ABC</i> add to 180°: 48° + 57° + 75° = 180° ✓', run: async (c) => { await c.anim(V.tri, [{ fillOpacity: 0 }, { fillOpacity: 1 }], 500); await c.fadeIn(chk); await stampIn(c, st); } }
    ];
  }
};

/* =====================================================================================
 * Example 4: the parking lot
 * ===================================================================================== */
function car(g, color = '#3b78d8') {
  const c = svgEl('g', {}, g); c.style.transformBox = 'view-box'; c.style.transformOrigin = '0 0';
  svgEl('rect', { x: -62, y: -30, width: 124, height: 60, rx: 16, fill: color, stroke: '#1d3f78', 'stroke-width': 2.5 }, c);
  svgEl('rect', { x: 14, y: -24, width: 26, height: 48, rx: 7, fill: '#cfe3ff', stroke: '#1d3f78', 'stroke-width': 1.5 }, c);
  svgEl('rect', { x: -44, y: -22, width: 20, height: 44, rx: 6, fill: '#cfe3ff', stroke: '#1d3f78', 'stroke-width': 1.5 }, c);
  svgEl('rect', { x: 54, y: -24, width: 7, height: 12, rx: 2, fill: '#ffe9a8' }, c); svgEl('rect', { x: 54, y: 12, width: 7, height: 12, rx: 2, fill: '#ffe9a8' }, c);
  return c;
}
const parking = {
  title: 'The parking lot, one angle at a time',
  height: 420, minW: 960,
  ask: `Example 4: the stall lines are parallel, and the curb is parallel to the front line. Each stall line meets the curb at 62°. Find <i>a</i>, <i>b</i> and <i>c</i>.`,
  make(stage, k, ex) {
    const W = ex.W, sv = root(stage, W, 420);
    const o = { x0: 120, yF: 150, yC: 360, sp: 214, n: 4, W, ang: 62, size: 22 };
    const L = parkLot(sv, o), hl = svgEl('g', {}, sv), top = svgEl('g', {}, sv);
    const [b0, t0] = L.st[0], [b1, t1] = L.st[1], [b2, t2] = L.st[2];
    const l62 = lab(top, at(b0, 31, 52), '62°'), la = lab(top, at(b0, 121, 40), 'a', { italic: true }), lb = lab(top, at(b1, 31, 52), 'b', { italic: true }), lc = lab(top, at(t1, 301, 40), 'c', { italic: true });
    void l62;
    const eqs = [pane(stage, 20, 14, W - 40, `(a) ${T('a+62^\\circ=180^\\circ')}, so ${T('a=180^\\circ-62^\\circ=118^\\circ')}`, 'eq band'),
      pane(stage, 20, 14, W - 40, `(b) ${T('b=62^\\circ')}: <b>corresponding</b> angles (the curb is the transversal)`, 'eq band'),
      pane(stage, 20, 14, W - 40, `(c) ${T('c=180^\\circ-62^\\circ=118^\\circ')}: <b>interior, same side</b> (the stall line is the transversal)`, 'eq band'),
      pane(stage, 20, 14, W - 40, 'Each stall is a <b>parallelogram</b>: 62°, 118°, 62°, 118°', 'eq band')];
    const showEq = async (c, i) => { if (i) await fadeOut(c, eqs[i - 1], 200); await c.fadeIn(eqs[i]); };
    const relab = async (c, t, s) => { relabel(t, s, COL.red); t.setAttribute('font-style', 'normal'); await c.pop(t); };
    const stall = poly(hl, [b1, b2, t2, t1], { close: true, color: 'none', fill: '#ffe2a8', fo: 0 });
    const cl = [lab(top, at(b2, 121, 40), '118°', { size: 20, color: COL.slate }), lab(top, at(t2, 211, 52), '62°', { size: 20, color: COL.slate })];
    cl.forEach((e) => hide(e));
    const centre = [(b1[0] + b2[0] + t1[0] + t2[0]) / 4, (o.yC + o.yF) / 2];
    const cr = car(top); const place = (d) => { const p = at(centre, 62, d); cr.setAttribute('transform', `translate(${p[0].toFixed(1)} ${p[1].toFixed(1)}) rotate(${-62 + 180})`); };
    place(430); hide(cr);
    return [
      { cap: '(a) <i>a</i> and 62° are on a <b>straight line</b> (the curb), so they add to 180°: <i>a</i> = 180° − 62° = <b>118°</b>.',
        run: async (c) => { const w1 = wedge(hl, b0, 46, 0, 62, COL.blue), w2 = wedge(hl, b0, 34, 62, 118, COL.amber); await Promise.all([c.pop(w1), c.pop(w2)]); await showEq(c, 0); await relab(c, la, '118°'); } },
      { cap: '(b) The stall lines are <b>parallel</b> and the curb is a transversal. Slide the 62° along the curb: it lands on <i>b</i>. <b>Corresponding</b> angles, so <i>b</i> = <b>62°</b>.',
        run: async (c) => { const cp = svgEl('g', {}, hl); wedge(cp, b0, 46, 0, 62, COL.blue, 0.45); poly(cp, [at(b0, 0, 80), b0, at(b0, 62, 80)], { color: COL.blue, w: 4 }); await tween(c, 1100, (t) => cp.setAttribute('transform', `translate(${(o.sp * t).toFixed(1)} 0)`)); await showEq(c, 1); await relab(c, lb, '62°'); } },
      { cap: '(c) The curb is parallel to the front line, and the stall line is a transversal. <i>b</i> and <i>c</i> are <b>interior angles on the same side</b> (a U): <i>c</i> = 180° − 62° = <b>118°</b>.',
        run: async (c) => { const u = poly(hl, [[b1[0] + 110, b1[1]], b1, t1, [t1[0] + 110, t1[1]]], { color: COL.amber, w: 13, op: 0.32, cls: 'bk-stroke' }); const w = wedge(hl, t1, 34, 242, 118, COL.amber); await drawIn(u, 800, c); await c.pop(w); await showEq(c, 2); await relab(c, lc, '118°'); } },
      { cap: 'So each stall is a <b>parallelogram</b> with angles 62°, 118°, 62° and 118°. Park the car!',
        run: async (c) => { await c.anim(stall, [{ fillOpacity: 0 }, { fillOpacity: 0.55 }], 400); for (const e of cl) await c.pop(e, 260); await showEq(c, 3); cr.style.opacity = 1; await tween(c, 1600, (t) => place(430 * (1 - t))); } }
    ];
  }
};

/* =====================================================================================
 * 3. Perpendicular transversals
 * ===================================================================================== */
const perp = {
  title: 'Perpendicular transversals',
  height: 410, minW: 960,
  choices: [{ v: 'turn', label: 'Turn t to 90°' }, { v: 'comp', label: 'Complementary angles' }],
  ask: (k) => (k === 'turn' ? `${T('\\ell_1\\parallel\\ell_2')}. Turn <i>t</i> until ${T('t\\perp\\ell_1')}. What happens at ${T('\\ell_2')}?` : 'Two angles make a right angle together. One is 25°. Find <i>x</i>.'),
  make(stage, k, ex) {
    const W = ex.W, X = 624, PW = W - X - 14;
    if (k === 'comp') {
      const sv = root(stage, 600, 410), V = [150, 360];
      line(sv, V, at(V, 0, 400)); line(sv, V, at(V, 90, 330)); line(sv, V, at(V, 25, 340));
      poly(sv, [at(V, 0, 22), at(at(V, 0, 22), 90, 22), at(V, 90, 22)], { w: 2.4 });
      const w1 = hide(wedge(sv, V, 120, 0, 25, COL.blue)), w2 = hide(wedge(sv, V, 92, 25, 65, COL.amber));
      lab(sv, at(V, 12.5, 160), '25°'); const lx = lab(sv, at(V, 57.5, 130), 'x', { italic: true });
      const e1 = pane(stage, X, 70, PW, T('x+25^\\circ=90^\\circ'), 'eq'), e2 = pane(stage, X, 140, PW, T('x=90^\\circ-25^\\circ=65^\\circ'), 'eq res');
      const st = hide(stamp(stage, '65 + 25 = 90 ✓', { ok: true, x: X + PW / 2, y: 250, rotate: -5 }));
      return [
        { cap: 'Together, the two angles make a <b>right angle</b> (the square). Angles that add to 90° are <b>complementary</b>.', run: async (c) => { await c.pop(w1); await c.pop(w2); } },
        { cap: `So ${T('x+25^\\circ=90^\\circ')}.`, run: (c) => c.fadeIn(e1) },
        { cap: `${T('x=90^\\circ-25^\\circ=65^\\circ')}.`, run: async (c) => { await c.fadeIn(e2); relabel(lx, '65°', COL.red); lx.setAttribute('font-style', 'normal'); await c.pop(lx); await stampIn(c, st); } }
      ];
    }
    const sv = root(stage, 610, 410), holder = svgEl('g', {}, sv), marks = svgEl('g', {}, sv);
    let TV = null;
    const build = (tl) => { if (TV) TV.g.remove(); const a = {}; for (let q = 1; q <= 8; q++) a[q] = q % 2 ? Math.round(180 - tl) : Math.round(tl); TV = Geo.transversal(holder, { x: 0, y: 0, w: 600, h: 405, tilt: tl, angles: a, size: 21, ext: 92 }); };
    build(62);
    const head = pane(stage, X, 16, PW, `<b>${T('t\\perp\\ell_1')}</b> and <b>${T('t\\perp\\ell_2')}</b>`, 'head');
    const st = hide(stamp(stage, 'all 8 are 90°', { ok: true, x: X + PW / 2, y: 96, rotate: -5 }));
    // a wall: studs parallel, perpendicular to the floor
    const wall = hide(svgEl('svg', { width: PW, height: 240, viewBox: `0 0 ${PW} 240`, class: 'u5l8-svg' })); add(stage, wall, X, 160);
    const wx0 = 20, wx1 = PW - 20, wy0 = 30, wy1 = 210;
    svgEl('rect', { x: wx0, y: wy1, width: wx1 - wx0, height: 14, fill: COL.wood, stroke: COL.woodD, 'stroke-width': 2 }, wall);
    svgEl('rect', { x: wx0, y: wy0 - 14, width: wx1 - wx0, height: 14, fill: COL.wood, stroke: COL.woodD, 'stroke-width': 2 }, wall);
    const n = 5; for (let i = 0; i < n; i++) { const x = wx0 + 8 + i * (wx1 - wx0 - 28) / (n - 1); svgEl('rect', { x, y: wy0, width: 12, height: wy1 - wy0, fill: '#e2b77e', stroke: COL.woodD, 'stroke-width': 2 }, wall); poly(wall, [[x + 12, wy1 - 14], [x + 26, wy1 - 14], [x + 26, wy1]], { w: 2, color: COL.red }); }
    Geo.text(wall, PW / 2, 232, 'a wall: studs ⊥ floor', { size: 16, color: COL.slate });
    return [
      { cap: '<i>t</i> crosses the parallel lines at 62°. The angles are 62° and 118°.', run: (c) => c.anim(TV.g, [{ opacity: 1 }, { opacity: 0.45 }, { opacity: 1 }], 600) },
      { cap: 'Turn <i>t</i> until it is <b>perpendicular</b> to ℓ₁: 90°…', run: (c) => tween(c, 1800, (t) => build(62 + 28 * t)) },
      { cap: `${T('t\\perp\\ell_1')}. Corresponding angles are equal, so <i>t</i> meets ℓ₂ at 90° too: ${T('t\\perp\\ell_2')}. <b>All 8 angles are 90°.</b>`,
        run: async (c) => { const sq = []; [TV.T, TV.B].forEach((Q) => [0, 90, 180, 270].forEach((d) => sq.push(poly(marks, [at(Q, d, 18), at(at(Q, d, 18), d + 90, 18), at(Q, d + 90, 18)], { w: 2.4, color: COL.red })))); sq.forEach(popable); await Promise.all(sq.map((e) => c.pop(e))); await c.fadeIn(head); await stampIn(c, st); } },
      { cap: 'Builders use this: wall studs are <b>parallel</b> to each other and <b>perpendicular</b> to the level floor.', run: (c) => c.fadeIn(wall) }
    ];
  }
};

/* =====================================================================================
 * Example 5: balusters
 * ===================================================================================== */
const stairsEx = {
  title: 'Balusters and the handrail',
  height: 420, minW: 960,
  ask: 'Example 5: the balusters are vertical, the treads are level, and the handrail rises at 36°. Find <i>a</i>, <i>b</i> and <i>c</i>.',
  make(stage, k, ex) {
    const W = ex.W, sv = root(stage, 600, 420), hl = svgEl('g', {}, sv);
    const S = stairs(sv, { s: 80, ox: 126, oy: 405, size: 22 }), Rp = S.Rp;
    sv.insertBefore(hl, sv.firstChild.nextSibling);
    const top = svgEl('g', {}, sv);
    const X = 612, PW = W - X - 14;
    const e = [pane(stage, X, 20, PW, `(a) ${T('a=90^\\circ')}: baluster ⊥ tread`, 'eq'),
      pane(stage, X, 84, PW, `(b) ${T('b+36^\\circ=90^\\circ')}`, 'eq'), pane(stage, X, 132, PW, T('b=90^\\circ-36^\\circ=54^\\circ'), 'eq res'),
      pane(stage, X, 196, PW, T('c=180^\\circ-54^\\circ=126^\\circ'), 'eq res'),
      pane(stage, X, 262, PW, '(c) the <b>same</b> 54° and 126° at every baluster', 'eq')];
    const relab = async (c, t, s) => { relabel(t, s, COL.red); t.setAttribute('font-style', 'normal'); await c.pop(t); };
    const hz = hide(line(hl, [Rp[0] - 1.6 * S.s, Rp[1]], [Rp[0] + 1.0 * S.s, Rp[1]], { w: 2.5, dash: '7 5', color: COL.slate }));
    return [
      { cap: '(a) A baluster is <b>vertical</b> and a tread is <b>level</b>, so they are perpendicular: <i>a</i> = <b>90°</b>.', run: async (c) => { await relab(c, S.la, '90°'); await c.fadeIn(e[0]); } },
      { cap: '(b) Draw a <b>horizontal</b> line through the top of the baluster. It is parallel to the dashed line at the bottom.', run: (c) => c.fadeIn(hz) },
      { cap: 'The rail crosses both horizontal lines. Slide the 36° up the rail: <b>corresponding angles</b>, so the rail makes 36° with the new line too.',
        run: async (c) => { const cp = svgEl('g', {}, hl); wedge(cp, S.S0, 56, 0, 36, COL.blue, 0.4); const d = [Rp[0] - S.S0[0], Rp[1] - S.S0[1]]; await tween(c, 1300, (t) => cp.setAttribute('transform', `translate(${(d[0] * t).toFixed(1)} ${(d[1] * t).toFixed(1)})`)); const t36 = lab(top, at(Rp, 17, 54), '36°', { size: 18, color: COL.blue }); await c.pop(t36); } },
      { cap: 'Its partner below the line on the left is 36° too (vertically opposite). The baluster is ⊥ the horizontal line, so <b><i>b</i> + 36° = 90°</b> (complementary).',
        run: async (c) => { const w = wedge(hl, Rp, 56, 180, 36, COL.blue, 0.4); await c.pop(w); const t36 = lab(top, at(Rp, 198, 58), '36°', { size: 18, color: COL.blue }); await c.pop(t36); const sq = poly(hl, [at(Rp, 180, 20), at(at(Rp, 180, 20), 270, 20), at(Rp, 270, 20)], { w: 2.4, color: COL.red }); popable(sq); await c.pop(sq); const wb = wedge(hl, Rp, 44, 216, 54, COL.amber, 0.45); await c.pop(wb); await c.fadeIn(e[1]); } },
      { cap: `${T('b=90^\\circ-36^\\circ=54^\\circ')}.`, run: async (c) => { await relab(c, S.lb, '54°'); await c.fadeIn(e[2]); } },
      { cap: '<i>c</i> is on a <b>straight line</b> with <i>b</i>, along the rail: <i>c</i> = 180° − 54° = <b>126°</b>.', run: async (c) => { const w = wedge(hl, Rp, 34, 270, 126, COL.green, 0.35); await c.pop(w); await relab(c, S.lc, '126°'); await c.fadeIn(e[3]); } },
      { cap: '(c) The balusters are parallel and the rail is a transversal: <b>corresponding angles</b> at every baluster. One cut angle fits them all.',
        run: async (c) => { for (const [i, B] of S.bal.entries()) { if (i === 2) continue; const t1 = lab(top, at(B.top, 243, 0.55 * S.s), '54°', { size: 16, color: COL.red }), t2 = lab(top, at(B.top, 333, 0.5 * S.s), '126°', { size: 16, color: COL.red }); await Promise.all([c.pop(t1, 300), c.pop(t2, 300)]); } await c.fadeIn(e[4]); } }
    ];
  }
};

/* =====================================================================================
 * 4. Leah's shelf: line it up (interactive), and Example 6 checks
 * ===================================================================================== */
const SHELF = {
  try: { tilt: 70, skew: 6, labels: { 2: true, 6: true } },
  a: { tilt: 70, skew: 0, labels: { 2: '70°', 6: '70°' }, pair: [2, 6], kind: 'corresponding', yes: true },
  b: { tilt: 68, skew: 2, labels: { 3: '112°', 6: '66°' }, pair: [3, 6], kind: 'int-same', yes: false },
  c: { tilt: 75, skew: 0, labels: { 4: '75°', 6: '75°' }, pair: [4, 6], kind: 'alt-int', yes: true }
};
const shelf = {
  title: 'Line up the shelf',
  height: 420, minW: 960, tap: false,
  choices: [{ v: 'try', label: 'Try it: turn the bottom shelf' }, { sep: 'Example 6 check:' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }, { v: 'c', label: '(c)' }],
  ask: (k) => (k === 'try' ? 'Leah’s top shelf meets the leg at 70°. Turn the bottom shelf until the shelves are parallel.' : `Example 6(${k}): Leah measures the two angles shown. Are the shelves parallel? Give the rule.`),
  make(stage, k, ex) {
    const W = ex.W, cfg = SHELF[k], st8 = { tilt: cfg.tilt, skew: cfg.skew };
    const sv = root(stage, 640, 420), T0 = [400, 118], gap = 214;
    const hl = svgEl('g', {}, sv), wood = svgEl('g', {}, sv), labs = svgEl('g', {}, sv);
    const td = st8.tilt, B0 = [T0[0] - gap / Math.tan(td * RAD), T0[1] + gap];
    // top shelf + books
    svgEl('rect', { x: 90, y: T0[1] - 7, width: 520, height: 14, rx: 4, fill: COL.wood, stroke: COL.woodD, 'stroke-width': 2 }, wood);
    [[120, 26, 66, '#d0477a'], [148, 20, 78, '#3b78d8'], [170, 30, 58, '#0f8a8a'], [202, 22, 72, '#e0841a'], [226, 18, 64, '#8a58c9'], [500, 24, 70, '#3fae6a'], [526, 28, 60, '#c93a33']].forEach(([x, w, hh, f]) => svgEl('rect', { x, y: T0[1] - 7 - hh, width: w, height: hh, rx: 2, fill: f, stroke: '#2b2b2b', 'stroke-width': 1.5 }, wood));
    // leg
    line(wood, at(T0, td, 92), at(B0, td + 180, 70), { w: 13, color: COL.woodD });
    Geo.text(labs, ...at(T0, td, 112), 't', { size: 22, italic: true });
    Geo.text(labs, 628, T0[1], 'ℓ₁', { size: 22, italic: true });
    // bottom shelf (turns about B0) with books and a spirit level
    const gB = svgEl('g', {}, wood); gB.style.transformBox = 'view-box'; gB.style.transformOrigin = '0 0';
    svgEl('rect', { x: B0[0] - 250, y: B0[1] - 7, width: 520, height: 14, rx: 4, fill: COL.wood, stroke: COL.woodD, 'stroke-width': 2 }, gB);
    const books = svgEl('g', {}, gB); books.style.transformBox = 'view-box'; books.style.transformOrigin = '0 0';
    [[110, 24, 62, '#e0841a'], [136, 30, 74, '#3b78d8'], [168, 20, 56, '#d0477a'], [190, 26, 68, '#0f8a8a']].forEach(([x, w, hh, f]) => svgEl('rect', { x: B0[0] + x, y: B0[1] - 7 - hh, width: w, height: hh, rx: 2, fill: f, stroke: '#2b2b2b', 'stroke-width': 1.5 }, books));
    const lvX = B0[0] - 220, lvW = 130;
    svgEl('rect', { x: lvX, y: B0[1] - 31, width: lvW, height: 24, rx: 8, fill: '#ffe680', stroke: '#8a6a10', 'stroke-width': 2 }, gB);
    svgEl('rect', { x: lvX + 40, y: B0[1] - 27, width: 50, height: 16, rx: 7, fill: '#f6fbe8', stroke: '#8a6a10', 'stroke-width': 1.5 }, gB);
    line(gB, [lvX + 58, B0[1] - 27], [lvX + 58, B0[1] - 11], { w: 1.5, color: '#8a6a10' }); line(gB, [lvX + 72, B0[1] - 27], [lvX + 72, B0[1] - 11], { w: 1.5, color: '#8a6a10' });
    const bub = svgEl('ellipse', { cx: lvX + 65, cy: B0[1] - 19, rx: 8, ry: 5.5, fill: '#9be07a', stroke: '#3b7a20', 'stroke-width': 1.5 }, gB);
    const nl2 = Geo.text(gB, B0[0] + 290, B0[1], 'ℓ₂', { size: 22, italic: true });
    void nl2;
    const angleLab = {};
    const X = 652, PW = W - X - 14;
    const read = pane(stage, X, 20, PW, '', 'read');
    const draw = () => {
      gB.setAttribute('transform', `rotate(${(-st8.skew).toFixed(2)} ${B0[0]} ${B0[1]})`);
      bub.setAttribute('cx', (lvX + 65 + Math.max(-22, Math.min(22, st8.skew * 7))).toFixed(1));
      for (const q in cfg.labels) {
        const j = (q - 1) % 4 + 1, cn = q <= 4 ? cornerAt(T0, 0, td, j) : cornerAt(B0, st8.skew, td, j);
        const s = cfg.labels[q] === true ? `${Math.round(cn.span)}°` : cfg.labels[q];
        if (!angleLab[q]) angleLab[q] = lab(labs, [0, 0], s, { size: 22 });
        const p = at(cn.X, cn.start + cn.span / 2, labD(cn.span, s) + 6); angleLab[q].setAttribute('x', p[0].toFixed(1)); angleLab[q].setAttribute('y', p[1].toFixed(1)); angleLab[q].textContent = s;
      }
      if (k === 'try') {
        const a6 = Math.round(td - st8.skew), ok = a6 === td;
        read.innerHTML = `${T('\\angle2=' + td + '^\\circ')} &nbsp; ${T('\\angle6=' + a6 + '^\\circ')}<div class="${ok ? 'u5l8-good' : 'u5l8-bad'}">${ok ? 'corresponding angles are equal: <b>parallel ✓</b>' : 'corresponding angles don’t match: <b>not parallel</b>'}</div>`;
      }
    };
    const pairHL = async (c, ks, color) => {
      const segs = []; const TB = Math.hypot(T0[0] - B0[0], T0[1] - B0[1]);
      const ws = ks.map((q) => { const j = (q - 1) % 4 + 1, cn = q <= 4 ? cornerAt(T0, 0, td, j) : cornerAt(B0, st8.skew, td, j); [cn.start, cn.start + cn.span].forEach((d) => { const alongT = Math.abs(Geo.n180(d - td)) < 0.5 || Math.abs(Geo.n180(d - td - 180)) < 0.5, toOther = (q <= 4 && Math.abs(Geo.n180(d - td - 180)) < 0.5) || (q > 4 && Math.abs(Geo.n180(d - td)) < 0.5); segs.push([cn.X, at(cn.X, d, toOther ? TB : alongT ? 80 : 150)]); }); return wedge(hl, cn.X, 46, cn.start, cn.span, color, 0.35); });
      const sh = svgEl('path', { d: segs.map((s) => 'M' + P(s).join('L')).join(''), stroke: color, 'stroke-width': 13, opacity: 0.3, fill: 'none', 'stroke-linecap': 'round', class: 'bk-stroke' }, hl);
      await Promise.all(ws.map((w) => c.pop(w))); await drawIn(sh, 700, c);
    };
    draw();
    if (k === 'try') {
      read.style.opacity = 1;
      const bt = h('div', 'u5l8-btns no-ink'); bt.setAttribute('data-tap', '');
      const mk = (txt, d) => { const b = h('button', 'pill', txt); b.type = 'button'; b.setAttribute('data-tap', ''); b.onclick = () => { st8.skew = Math.max(-12, Math.min(12, st8.skew + d)); draw(); }; bt.appendChild(b); };
      mk('↺ turn 1°', 1); mk('↻ turn 1°', -1);
      add(stage, bt, X, 150);
      const st = hide(stamp(stage, 'parallel ✓', { ok: true, x: X + PW / 2, y: 300, rotate: -5 }));
      return [
        { cap: 'Tap the buttons to turn the bottom shelf. Watch ∠6, the corresponding angle, and the bubble in the level.', run: (c) => c.anim(bt, [{ transform: 'scale(1)' }, { transform: 'scale(1.12)' }, { transform: 'scale(1)' }], 500) },
        { cap: `When ${T('\\angle6=\\angle2=70^\\circ')}, <b>corresponding angles are equal</b>, so the shelves are <b>parallel</b>. The bubble is centred.`, run: async (c) => { const s0 = st8.skew; await tween(c, 1000, (t) => { st8.skew = s0 * (1 - t); draw(); }); st8.skew = 0; draw(); await stampIn(c, st); } }
      ];
    }
    const nm = { corresponding: 'corresponding angles (F)', 'int-same': 'interior angles on the same side (U)', 'alt-int': 'alternate interior angles (Z)' }[cfg.kind];
    const [p, q] = cfg.pair, color = Geo.PAIR_COLORS[cfg.kind];
    const r1 = pane(stage, X, 110, PW, `${T(`\\angle${p}`)} and ${T(`\\angle${q}`)}:<br><b style="color:${color}">${nm}</b>`, 'row');
    const r2 = pane(stage, X, 200, PW, cfg.kind === 'int-same' ? `${T('112^\\circ+66^\\circ=178^\\circ')}<br>${T('178^\\circ\\ne180^\\circ')}` : `${T(cfg.labels[p].replace('°', '^\\circ') + '=' + cfg.labels[q].replace('°', '^\\circ'))}`, 'row');
    const st = hide(stamp(stage, cfg.yes ? 'parallel ✓' : 'not parallel ✗', { ok: cfg.yes, x: X + PW / 2, y: 320, rotate: -5 }));
    const hint = cfg.yes ? null : pane(stage, 424, 196, 206, 'closer and closer this way → they would meet', 'hint');
    read.innerHTML = 'Not drawn to scale: use the <b>numbers</b>.';
    return [
      { cap: `${T(`\\angle${p}`)} and ${T(`\\angle${q}`)} are <b>${nm}</b>.`, run: async (c) => { await c.fadeIn(read); await pairHL(c, cfg.pair, color); await c.fadeIn(r1); } },
      { cap: cfg.kind === 'int-same' ? 'If the shelves were parallel, these would add to 180°. But 112° + 66° = <b>178°</b>. Off by 2°: <b>not parallel</b>.' : `They are <b>equal</b> (${cfg.labels[p]} = ${cfg.labels[q]}), so <b>yes</b>, the shelves are parallel.`,
        run: async (c) => { await c.fadeIn(r2); await stampIn(c, st); if (hint) { await c.fadeIn(hint); await c.anim(books, [{ transform: 'translate(0px, 0px)' }, { transform: 'translate(-34px, 0px)' }], 900); } } }
    ];
  }
};

/* which pairs prove the lines are parallel (Full notes): turn the bottom line; ∠5 = ∠7 always, ∠1 = ∠5 only when parallel */
const proof = {
  title: 'Turn the bottom line: which pair proves parallel?',
  height: 410, minW: 960,
  ask: 'The bottom line turns. Watch the vertically opposite pair (∠5, ∠7) and the corresponding pair (∠1, ∠5).',
  make(stage, k, ex) {
    const W = ex.W, X = 624, PW = W - X - 14, tilt = 62;
    const sv = root(stage, 610, 410), holder = svgEl('g', {}, sv);
    let TV = null, sk = 14;
    const read = pane(stage, X, 20, PW, '', 'read'); read.style.opacity = 1;
    const build = (s0) => {
      sk = s0; if (TV) TV.g.remove();
      const m1 = 180 - tilt, m5 = Math.round(180 + s0 - tilt);
      TV = Geo.transversal(holder, { x: 0, y: 0, w: 600, h: 405, tilt, parallel: false, skew: s0, marks: 0, ext: 92, angles: { 1: m1, 5: m5, 7: m5 }, labelColors: { 1: 'blue', 5: 'red', 7: 'red' }, size: 21 });
      const par = Math.abs(s0) < 0.5;
      read.innerHTML = `${T(`\\angle5=\\angle7=${m5}^\\circ`)} <span class="u5l8-muted">always</span><br>${T(`\\angle1=${m1}^\\circ`)}, ${T(`\\angle5=${m5}^\\circ`)}: ${par ? '<b class="u5l8-good">equal, parallel ✓</b>' : '<b class="u5l8-bad">not equal</b>'}`;
    };
    build(14);
    const st = hide(stamp(stage, 'parallel ✓', { ok: true, x: X + PW / 2, y: 200, rotate: -5 }));
    const note = pane(stage, X, 260, PW, 'Only a <b>parallel-line pair</b> (corresponding, alternate, or same side) can prove the lines are parallel.', 'row');
    return [
      { cap: '∠5 and ∠7 are vertically opposite. ∠1 and ∠5 are corresponding.', run: (c) => c.anim(TV.g, [{ opacity: 1 }, { opacity: 0.45 }, { opacity: 1 }], 600) },
      { cap: 'Turn the bottom line one way… ∠5 and ∠7 change <b>together</b>: they are always equal.', run: (c) => tween(c, 1800, (t) => build(14 - 24 * t)) },
      { cap: 'Turn it back until ∠5 = ∠1. Now the <b>corresponding</b> angles match, so the lines are <b>parallel</b>.', run: async (c) => { await tween(c, 1500, (t) => build(-10 + 10 * t)); build(0); await stampIn(c, st); } },
      { cap: 'So “∠5 = ∠7” proves nothing. Check a parallel-line pair instead.', run: (c) => c.fadeIn(note) }
    ];
  }
};

/* =====================================================================================
 * Example 7: Owen's joists (zoom out to see them meet)
 * ===================================================================================== */
const joists = {
  title: 'Are the joists parallel?',
  height: 420, minW: 960,
  ask: 'Example 7: at joist 1 the angle is 60°; at joist 2 it is 117°. Are the joists parallel? If not, how far must joist 2 turn?',
  make(stage, k, ex) {
    const W = ex.W, sv = root(stage, 720, 420), zoom = svgEl('g', {}, sv); zoom.style.transformBox = 'view-box'; zoom.style.transformOrigin = '0 0';
    const s = 95, ox = 70, oy = 340, M1 = (3.4 - 1) * s;
    // where the joists meet (joist 1 at 60°, joist 2 at 63°)
    const u60 = [Math.cos(60 * RAD), Math.sin(60 * RAD)], u63 = [Math.cos(63 * RAD), Math.sin(63 * RAD)], kk = u60[1] / u63[1], dist1 = M1 / (u60[0] - kk * u63[0]);
    const J = joistScene(zoom, { s, ox, oy, d2: 63, size: 22, below: 0.45, long: 2.3, len1: dist1 / s + 2, len2: dist1 * kk / s + 2, nss: true });
    const hl = svgEl('g', {}, zoom); zoom.insertBefore(hl, zoom.firstChild);
    const Mp = at(J.P1, 60, dist1);
    const X = 604, PW = W - X - 12;
    const e = [pane(stage, X, 14, PW, `(a) ${T('180^\\circ-117^\\circ=63^\\circ')}`, 'eq'), pane(stage, X, 64, PW, `${T('63^\\circ\\ne60^\\circ')}<br><b class="u5l8-bad">not parallel</b>`, 'eq'),
      pane(stage, X, 196, PW, `(b) ${T('180^\\circ-60^\\circ=120^\\circ')}`, 'eq'), pane(stage, X, 246, PW, `(c) ${T('120^\\circ-117^\\circ=3^\\circ')}<br>turn joist 2 by <b>3°</b>`, 'eq')];
    const meet = pane(stage, 0, 0, 230, 'they meet <b>way up here</b>, about 15 times the gap between the joists', 'hint');
    const dot = hide(svgEl('circle', { cx: Mp[0], cy: Mp[1], r: 7, fill: COL.red }, zoom));
    const st = hide(stamp(stage, 'not parallel ✗', { ok: false, x: X + PW / 2, y: 160, rotate: -5 })), st2 = hide(stamp(stage, 'parallel ✓', { ok: true, x: X + PW / 2 + 40, y: 372, rotate: -5 }));
    const l63 = hide(lab(zoom, at(J.P2, 31.5, labD(63, '63°')), '63°', { color: COL.blue })), l120 = hide(lab(zoom, at(J.P1, 120, labD(120, '120°')), '120°', { color: COL.amber }));
    const text = [J.l60, J.l117, J.n1, J.n2, J.bl, l63];
    const Kend = 300 / (oy - Mp[1]), A0 = J.P1, A1 = [200, 392];
    const setZoom = (t) => { const kz = Math.exp(Math.log(Kend) * t), ax = A0[0] + (A1[0] - A0[0]) * t, ay = A0[1] + (A1[1] - A0[1]) * t; zoom.setAttribute('transform', `translate(${ax.toFixed(1)} ${ay.toFixed(1)}) scale(${kz.toFixed(5)}) translate(${-A0[0]} ${-A0[1]})`); dot.setAttribute('r', (7 / kz).toFixed(1)); return [ax + (Mp[0] - A0[0]) * kz, ay + (Mp[1] - A0[1]) * kz]; };
    setZoom(0);
    let w117 = null;
    const turn = (d) => { J.g2.setAttribute('transform', `rotate(${(63 - d).toFixed(2)} ${J.P2[0]} ${J.P2[1]})`); if (w117) w117.setAttribute('d', wedgeD(J.P2, 40, d, 180 - d)); J.l117.textContent = Math.round(180 - d) + '°'; const p = at(J.P2, (d + 180) / 2, labD(180 - d, '117°')); J.l117.setAttribute('x', p[0].toFixed(1)); J.l117.setAttribute('y', p[1].toFixed(1)); };
    return [
      { cap: '(a) First find the upper-right angle at joist 2. It is on a <b>straight line</b> with 117°: 180° − 117° = <b>63°</b>.', run: async (c) => { const w = wedge(hl, J.P2, 54, 0, 63, COL.blue); await c.pop(w); await c.pop(l63); await c.fadeIn(e[0]); } },
      { cap: 'It <b>corresponds</b> to the 60° at joist 1 (an F). But 63° ≠ 60°, so the joists are <b>not parallel</b>.', run: async (c) => { const w = wedge(hl, J.P1, 54, 0, 60, COL.blue); await c.pop(w); await c.fadeIn(e[1]); await stampIn(c, st); } },
      { cap: 'Not parallel means they would <b>meet</b>. Make the joists longer and zoom out…',
        run: async (c) => { await Promise.all(text.map((t) => fadeOut(c, t))); let mp = [0, 0]; await tween(c, 2600, (t) => { mp = setZoom(t); }); mp = setZoom(1); await c.pop(dot); meet.style.left = Math.min(720 - 240, mp[0] + 16) + 'px'; meet.style.top = Math.max(4, mp[1] - 10) + 'px'; await c.fadeIn(meet); } },
      { cap: '(b) Back to the beam. At joist 1 the upper-left angle is 180° − 60° = <b>120°</b>. The matching angle at joist 2 must also be <b>120°</b>.',
        run: async (c) => { await fadeOut(c, meet); fadeOut(c, st); c.anim(dot, [{ opacity: 1 }, { opacity: 0 }], 200); await tween(c, 1400, (t) => setZoom(1 - t)); setZoom(0); await Promise.all(text.filter((t) => t !== l63).map((t) => c.fadeIn(t))); const w = wedge(hl, J.P1, 40, 60, 120, COL.amber); await c.pop(w); await c.pop(l120); await c.fadeIn(e[2]); } },
      { cap: '(c) 120° − 117° = <b>3°</b>. Owen turns joist 2 by 3°, so the 117° angle gets <b>bigger</b>, up to 120°.',
        run: async (c) => { hl.querySelectorAll('path').forEach((p, i) => { if (i === 0) p.remove(); }); w117 = wedge(hl, J.P2, 40, 63, 117, COL.amber); await c.pop(w117); await tween(c, 1600, (t) => turn(63 - 3 * t)); turn(60); await c.fadeIn(e[3]); await stampIn(c, st2); } }
    ];
  }
};

/* =====================================================================================
 * card figures (static)
 * ===================================================================================== */
function figures() {
  const $ = (id) => document.getElementById(id);
  if ($('u5l8-f-rules')) Geo.transversal($('u5l8-f-rules'), { w: 300, h: 236, tilt: 62, size: 19, nameSize: 19 });
  if ($('u5l8-f-ex1')) Geo.transversal($('u5l8-f-ex1'), { w: 330, h: 250, tilt: 65, angles: { 3: 115 }, size: 19, nameSize: 19 });
  if ($('u5l8-f-ex2')) Geo.transversal($('u5l8-f-ex2'), { w: 330, h: 250, tilt: 72, angles: { 6: 72 }, size: 19, nameSize: 19 });
  if ($('u5l8-f-ex2b')) Geo.transversal($('u5l8-f-ex2b'), { w: 330, h: 250, tilt: 57, angles: { 4: 57 }, size: 19, nameSize: 19 });
  if ($('u5l8-f-ex3')) { const V = vee($('u5l8-f-ex3'), { A: [200, 40], h: 150, L: 48, R: 57, ext: 50, size: 19, labels: { L: '48°', R: '57°', c: 'c', a: 'a', b: 'b' } }); ['a', 'b', 'c'].forEach((q) => V.labs[q].setAttribute('font-style', 'italic')); }
  if ($('u5l8-f-ex4')) {
    const g = $('u5l8-f-ex4'), o = { x0: 110, yF: 34, yC: 170, sp: 180, n: 4, W: 860, ang: 62, size: 19 }, L = parkLot(g, o);
    const [b0] = L.st[0], [b1, t1] = L.st[1];
    lab(g, at(b0, 31, 46), '62°', { size: 19 }); lab(g, at(b0, 121, 34), 'a', { size: 20, italic: true }); lab(g, at(b1, 31, 34), 'b', { size: 20, italic: true }); lab(g, at(t1, 301, 34), 'c', { size: 20, italic: true });
    Geo.text(g, (L.st[1][0][0] + L.st[2][1][0]) / 2 - 10, (o.yF + o.yC) / 2, 'a stall', { size: 16, italic: true, color: COL.slate });
  }
  if ($('u5l8-f-ex5')) stairs($('u5l8-f-ex5'), { s: 54, ox: 86, oy: 270, size: 18 });
  if ($('u5l8-f-ex6a')) Geo.transversal($('u5l8-f-ex6a'), { w: 290, h: 210, tilt: 70, parallel: false, skew: 0, marks: 0, numbers: false, angles: { 2: 70, 6: 70 }, size: 18, nameSize: 18 });
  if ($('u5l8-f-ex6b')) Geo.transversal($('u5l8-f-ex6b'), { w: 290, h: 210, tilt: 68, parallel: false, skew: 2, marks: 0, numbers: false, angles: { 3: 112, 6: 66 }, size: 18, nameSize: 18 });
  if ($('u5l8-f-ex6c')) Geo.transversal($('u5l8-f-ex6c'), { w: 290, h: 210, tilt: 75, parallel: false, skew: 0, marks: 0, numbers: false, angles: { 4: 75, 6: 75 }, size: 18, nameSize: 18 });
  if ($('u5l8-f-ex7')) joistScene($('u5l8-f-ex7'), { s: 58, ox: 55, oy: 150, d2: 63, size: 18 });
}
figures();

mountExplainers({ rules, whyF, fill8, roads, parking, perp, stairs: stairsEx, shelf, proof, joists });

/* =====================================================================================
 * Math History: Euclid's fifth rule (two lines whose same-side interior angles add to 175° meet far away)
 * ===================================================================================== */
function histAnim() {
  const svg = document.getElementById('u5l8-hist'); if (!svg) return;
  const NS = 'http://www.w3.org/2000/svg', mk = (t, a, p = svg) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); p.appendChild(e); return e; };
  mk('rect', { x: 0, y: 0, width: 600, height: 300, rx: 14, fill: '#fffaf1' });
  const cap = mk('text', { x: 300, y: 30, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 20, fill: '#4a2c14' });
  const world = mk('g', {});
  const Tp = [110, 120], Bp = [110, 200], d1 = -3, d2 = 2;   // the top line slopes down 3°, the bottom line up 2° (to the right)
  const tn3 = Math.tan(3 * RAD), tn2 = Math.tan(2 * RAD), mx = 80 / (tn3 + tn2), Mp = [Tp[0] + mx, Tp[1] + mx * tn3];
  const ln = (A, B, w, col, dash) => mk('line', { x1: A[0], y1: A[1], x2: B[0], y2: B[1], stroke: col, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-dasharray': dash || 'none', 'vector-effect': 'non-scaling-stroke' }, world);
  ln([Tp[0], Tp[1] - 70], [Bp[0], Bp[1] + 70], 3, '#4a2c14');
  const top = ln([Tp[0] - 70, Tp[1] - 70 * tn3], Tp, 3.5, '#7a4a26'), bot = ln([Bp[0] - 70, Bp[1] + 70 * tn2], Bp, 3.5, '#7a4a26');
  const wA = mk('path', { d: wedgeD(Tp, 34, 270, 87), fill: 'rgba(176,122,18,.3)' }, world), wB = mk('path', { d: wedgeD(Bp, 34, 2, 88), fill: 'rgba(176,122,18,.3)' }, world);
  const tA = mk('text', { x: Tp[0] + 30, y: Tp[1] + 34, 'font-family': 'Georgia, serif', 'font-size': 17, fill: '#4a2c14' }, world); tA.textContent = '87°';
  const tB = mk('text', { x: Bp[0] + 30, y: Bp[1] - 22, 'font-family': 'Georgia, serif', 'font-size': 17, fill: '#4a2c14' }, world); tB.textContent = '88°';
  const sum = mk('text', { x: 300, y: 282, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 20, fill: '#b07a12' }); sum.textContent = '87° + 88° = 175°, less than 180°';
  const dot = mk('circle', { cx: Mp[0], cy: Mp[1], r: 7, fill: '#b07a12' }, world);
  const meet = mk('text', { x: 0, y: 0, 'font-family': 'Georgia, serif', 'font-size': 18, fill: '#b07a12', 'text-anchor': 'end' }); meet.textContent = 'they meet!';
  const CAPS = [[0, 'Two lines and a transversal'], [2.2, 'Same-side interior angles: 175° in all'], [4.4, 'Make the lines longer…'], [9.2, 'They meet, on the side of the 175°']];
  const cl = (t) => Math.max(0, Math.min(1, t)), ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const draw = (s) => {
    let txt = CAPS[0][1]; for (const [t0, x] of CAPS) if (s >= t0) txt = x; cap.textContent = txt;
    [wA, wB, tA, tB].forEach((e) => e.setAttribute('opacity', cl((s - 1.2) / 0.8)));
    sum.setAttribute('opacity', cl((s - 2.4) / 0.6));
    const grow = ease(cl((s - 4.4) / 4.4)), L = grow * mx;
    top.setAttribute('x2', Tp[0] + L); top.setAttribute('y2', Tp[1] + L * tn3); bot.setAttribute('x2', Bp[0] + L); bot.setAttribute('y2', Bp[1] - L * tn2);
    const k = 1 - 0.55 * ease(cl((s - 4.8) / 4)), cx = Tp[0], cy = 160;
    world.setAttribute('transform', `translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})`);
    dot.setAttribute('r', 7 / k); dot.setAttribute('opacity', cl((s - 9) / 0.4));
    meet.setAttribute('x', cx + (Mp[0] - cx) * k - 14); meet.setAttribute('y', cy + (Mp[1] - cy) * k - 16); meet.setAttribute('opacity', cl((s - 9.2) / 0.5));
  };
  let raf = 0;
  const play = () => {
    cancelAnimationFrame(raf);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { draw(12); return; }
    const t0 = performance.now(); const tick = (now) => { const s = (now - t0) / 1000; draw(s); if (s < 11) raf = requestAnimationFrame(tick); }; raf = requestAnimationFrame(tick);
  };
  void d1; void d2;
  draw(12);
  svg.addEventListener('click', play);
  const btn = svg.closest('.hist-anim') && svg.closest('.hist-anim').querySelector('.hist-play'); if (btn) btn.addEventListener('click', play);
  let seen = false;
  new IntersectionObserver((es) => { es.forEach((e) => { if (e.isIntersecting && !seen) { seen = true; play(); } }); }, { threshold: 0.5 }).observe(svg);
}
histAnim();

/* =====================================================================================
 * Stand Up Break! — parallel-line angles at the whiteboards
 * ===================================================================================== */
{
  const fig = (build, w = 340, hh = 230) => { const s = svgEl('svg', { viewBox: `0 0 ${w} ${hh}`, width: Math.round(w * 1.3), height: Math.round(hh * 1.3), class: 'u5l8-sufig' }); build(s); return s.outerHTML; };
  const tvFig = (o) => fig((s) => Geo.transversal(s, Object.assign({ w: 340, h: 230, size: 19, nameSize: 19 }, o)));
  const WHY = { corresponding: 'corresponding angles are equal', 'alt-int': 'alternate interior angles are equal', 'alt-ext': 'alternate exterior angles are equal', 'int-same': 'interior angles on the same side add to 180°', 'ext-same': 'exterior angles on the same side add to 180°', 'vert-opp': 'vertically opposite angles are equal', linear: 'angles on a straight line add to 180°' };
  const SUPP = new Set(['int-same', 'ext-same', 'linear']);
  const partner = (r, k, kinds) => { const opts = []; kinds.forEach((nm) => Geo.PAIRS[nm].forEach(([a, b]) => { if (a === k) opts.push([b, nm]); if (b === k) opts.push([a, nm]); })); return r.pick(opts); };
  const val = (r) => r.pick([r.int(32, 80), r.int(100, 152)]);
  standup('u5l8', {
    intro: 'Name the pair, decide: equal or add to 180°? Then find the angle and write the reason.',
    levels: {
      BEG: (r) => { const k = r.int(1, 8), v = val(r), [m, nm] = partner(r, k, ['corresponding', 'alt-int', 'alt-ext', 'vert-opp', 'linear']); const ans = SUPP.has(nm) ? 180 - v : v;
        return { text: `${T('\\ell_1\\parallel\\ell_2')} and ${T(`\\angle${k}=${v}^\\circ`)}. Find ${T(`\\angle${m}`)}. Give the reason.`, q: '', fig: tvFig({ angles: { [k]: v } }), a: [SUPP.has(nm) ? `\\angle${m}=180^\\circ-${v}^\\circ=${ans}^\\circ` : `\\angle${m}=${ans}^\\circ`, `\\text{${WHY[nm]}}`] }; },
      PRG: (r) => { const k = r.int(1, 8), v = val(r), [m, nm] = partner(r, k, ['corresponding', 'alt-int', 'alt-ext', 'int-same', 'ext-same']); const sup = SUPP.has(nm);
        return { text: `${T('\\ell_1\\parallel\\ell_2')}. Name the pair, write an equation, and solve for ${T('x')}.`, q: '', fig: tvFig({ angles: { [k]: v, [m]: 'x' } }), a: [`\\text{${Geo.PAIR_NAMES[nm].replace(' of the transversal', '')}}`, sup ? `x+${v}^\\circ=180^\\circ` : `x=${v}^\\circ`, ...(sup ? [`x=${180 - v}^\\circ`] : [])] }; },
      MAS: (r) => r.pick([
        () => { const L = r.int(35, 70), Rr = r.int(35, 70), c = 180 - L - Rr;
          return { text: `${T('\\ell_1\\parallel\\ell_2')}. Two roads meet at <i>A</i> on ${T('\\ell_1')}. Find <i>a</i>, <i>b</i> and <i>c</i>, in order, with reasons.`, q: '', fig: fig((s) => { const V = vee(s, { A: [180, 34], h: 150, L, R: Rr, ext: 40, size: 18, labels: { L: L + '°', R: Rr + '°', c: 'c', a: 'a', b: 'b' } }); ['a', 'b', 'c'].forEach((q) => V.labs[q].setAttribute('font-style', 'italic')); }, 380, 220),
            a: [`a=${L}^\\circ\\ \\text{(alternate interior)}`, `b=${Rr}^\\circ\\ \\text{(alternate interior)}`, `c=180^\\circ-${L}^\\circ-${Rr}^\\circ=${c}^\\circ`] }; },
        () => { const kind = r.pick(['corresponding', 'alt-int', 'int-same']), [a, b] = r.pick(Geo.PAIRS[kind]), v = r.int(55, 125), yes = r.chance(0.5), off = r.pick([1, 2, 3]) * r.sign();
          const sup = kind === 'int-same', w = sup ? (yes ? 180 - v : 180 - v + off) : (yes ? v : v + off);
          const tilt = a % 2 === 0 ? v : 180 - v;
          return { text: `Two lines are cut by a transversal. ${T(`\\angle${a}=${v}^\\circ`)} and ${T(`\\angle${b}=${w}^\\circ`)}. Are the lines parallel? Give the rule. (Not drawn to scale.)`, q: '', fig: tvFig({ parallel: false, skew: 0, marks: 0, numbers: true, tilt: Math.max(25, Math.min(155, tilt)), angles: { [a]: v, [b]: w } }),
            a: [`\\text{${Geo.PAIR_NAMES[kind].replace(' of the transversal', '')}}`, sup ? `${v}^\\circ+${w}^\\circ=${v + w}^\\circ` : `${v}^\\circ${yes ? '=' : '\\ne'}${w}^\\circ`, yes ? '\\text{Yes, parallel.}' : '\\text{No, not parallel.}'] }; }
      ])()
    }
  });
}
