/* Math 10-3 · Unit 6 · Lesson 6 — Indirect Measurement: Shadows and Mirrors.
 * Explainers (Class view unless marked Full): a sun you can drag while the stick's and the flagpole's shadows stay in
 * proportion (sun), the shadow method in 4 steps (Examples 1, 2(b), 2(c), 3(a) checks: shadowSolve), the scale-factor
 * shortcut with shadows counted along the ground (Full: scaleK), the mirror method with a bouncing light ray and a person
 * who walks back until the light reaches the eyes (Example 4 checks: mirror), why the mirror triangles are similar by
 * flipping the pole under the ground (Full: whyMirror), the ruler at arm's length with the small triangle blown up into the
 * big one (Example 5: ruler), stakes across the Bow River with the sight line swinging onto the tree (Example 6: river),
 * a verdict/stamp check of each student's work (Example 7: verdict), and why small mistakes grow (Full: errors).
 * Also: the warm-up answer figure, the static figures, the Math History animation (Thales) and the Stand Up Break. */
import { h, add, tex, svgEl, tween, anim, drawIn, stamp, stampIn, pulse, appear, arrowHead, mountExplainers } from '../blocks.js';
import { Geo } from '../geo.js';
import { standup } from '../standup.js';

const INK = '#1c2230', BLUE = '#1f5bd6', GREEN = '#12805a', RED = '#c93a33', AMBER = '#c27a0e', BROWN = '#9a6a24', SLATE = '#3a4254', GOLD = '#e0a100';
const SKY = '#f2f6fc', DIRT = '#efe6d3', GROUND = '#8a6f4d', WATER = '#d7e8f7';
const T = (s) => tex(String(s));
const RAD = Math.PI / 180;
const A = Geo.at, dirTo = Geo.dirTo, arcD = Geo.arcD;
/** a tidy decimal: 12.80000001 → "12.8" */
const f = (v, dp = 2) => String(+(+v).toFixed(dp));
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const op = (c, el, to, ms = 350) => anim(c, el, [{ opacity: to }], ms);
const show = (c, el, ms = 350) => op(c, el, 1, ms);
const stageSvg = (stage, W, H) => add(stage, svgEl('svg', { class: 'u6l6-svg', width: W, height: H, viewBox: `0 0 ${W} ${H}` }), 0, 0);
const figSvg = (host, W, H) => { host.style.width = W + 'px'; host.style.height = H + 'px'; return svgEl('svg', { class: 'u6l6-svg', width: W, height: H, viewBox: `0 0 ${W} ${H}` }, host); };
/** an HTML label centred on (x, y) in a 0×0 holder (so a pop's scale doesn't undo the centring) */
function lab(host, html, x, y, cls = '') {
  const hold = h('div', 'u6l6-hold'); hold.appendChild(h('div', 'u6l6-lab ' + cls, html)); add(host, hold, x, y); hold.inner = hold.firstChild; return hold;
}
/** an HTML label whose LEFT edge is at x (vertically centred on y) */
const labL = (host, html, x, y, cls = '') => lab(host, html, x, y, 'u6l6-l ' + cls);
function line(parent, P, Q, o = {}) {
  return svgEl('line', { x1: P[0].toFixed(2), y1: P[1].toFixed(2), x2: Q[0].toFixed(2), y2: Q[1].toFixed(2), stroke: o.color || INK, 'stroke-width': o.width || 3, 'stroke-linecap': o.cap || 'round', 'stroke-dasharray': o.dash || null, class: o.cls === undefined ? 'bk-stroke' : o.cls, opacity: o.opacity ?? null }, parent);
}
function path(parent, d, o = {}) {
  return svgEl('path', { d, fill: o.fill || 'none', 'fill-opacity': o.fo ?? null, stroke: o.stroke === undefined ? INK : o.stroke, 'stroke-width': o.width || 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-dasharray': o.dash || null, class: o.cls === undefined ? 'bk-stroke' : o.cls, opacity: o.opacity ?? null }, parent);
}
const polyD = (pts, closed = true) => 'M' + pts.map((p) => p[0].toFixed(2) + ' ' + p[1].toFixed(2)).join('L') + (closed ? 'Z' : '');
const txt = (parent, x, y, s, o = {}) => Geo.text(parent, x, y, s, Object.assign({ size: 18 }, o));
const dot = (parent, p, o = {}) => Geo.dot(parent, p, o);
/** the small square of a right angle at V, between directions d and d + 90 (math degrees) */
function rightSq(parent, V, d, s = 11, o = {}) {
  const u = A([0, 0], d, 1), v = A([0, 0], d + 90, 1);
  return path(parent, polyD([[V[0] + u[0] * s, V[1] + u[1] * s], [V[0] + (u[0] + v[0]) * s, V[1] + (u[1] + v[1]) * s], [V[0] + v[0] * s, V[1] + v[1] * s]], false), { width: o.width || 2, stroke: o.color || SLATE, cls: '' });
}
/** a dimension line with arrowheads; label beside it (side: 'b' below, 'a' above, 'l' left, 'r' right) */
function dim(parent, P, Q, s, side = 'b', o = {}) {
  const g = svgEl('g', {}, parent), colr = o.color || SLATE;
  line(g, P, Q, { color: colr, width: 1.5, cls: '' });
  arrowHead(g, P[0], P[1], P[0] - Q[0], P[1] - Q[1], { color: colr, width: 1.5, L: 8, hw: 4 });
  arrowHead(g, Q[0], Q[1], Q[0] - P[0], Q[1] - P[1], { color: colr, width: 1.5, L: 8, hw: 4 });
  if (s != null && s !== '') {
    const M = [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2], size = o.size || 17;
    const off = { b: [0, size * 0.85], a: [0, -size * 0.85], l: [-8, 0], r: [8, 0] }[side];
    const t = txt(g, M[0] + off[0], M[1] + off[1], s, { size, color: o.textColor || (/^[a-z]$/.test(s) ? RED : colr), anchor: side === 'l' ? 'end' : side === 'r' ? 'start' : 'middle' });
    g.label = t;
  }
  return g;
}
/** a small standing person (side view) with the feet at (x, gy); eye at eyePx above the ground, face +1 (right) or -1 */
function person(parent, x, gy, eyePx, o = {}) {
  const g = svgEl('g', {}, parent), tot = o.totPx || eyePx / 0.93, hr = tot * 0.075, colr = o.color || SLATE, w = Math.max(2.2, tot * 0.035);
  const Y = (k) => gy - tot * k;
  path(g, `M${x} ${Y(0.85)}L${x} ${Y(0.47)}M${x - tot * 0.12} ${gy}L${x} ${Y(0.47)}L${x + tot * 0.12} ${gy}M${x - tot * 0.16} ${Y(0.58)}L${x} ${Y(0.76)}L${x + tot * 0.16} ${Y(0.58)}`, { stroke: colr, width: w, cls: '' });
  svgEl('circle', { cx: x, cy: (gy - tot + hr).toFixed(2), r: Math.max(3, hr).toFixed(2), fill: '#fff', stroke: colr, 'stroke-width': Math.max(1.6, w * 0.8) }, g);
  dot(g, [x, gy - eyePx], { r: Math.max(1.8, hr * 0.28), color: INK });
  return g;
}
function flagpole(parent, x, gy, hp, o = {}) {
  const g = svgEl('g', {}, parent);
  line(g, [x, gy], [x, gy - hp], { color: SLATE, width: o.width || 4, cls: '' });
  const fl = Math.min(hp * 0.2, 34) * (o.side ?? 1);
  path(g, polyD([[x, gy - hp], [x + fl, gy - hp + hp * 0.05 + 4], [x, gy - hp + hp * 0.1 + 8]]), { stroke: 'none', fill: RED, cls: '' });
  return g;
}
function sunIcon(parent, x, y, r = 20) {
  const g = svgEl('g', { class: 'u6l6-sun' }, parent);
  for (let k = 0; k < 8; k++) { const a = k * 45, p = A([x, y], a, r + 5), q = A([x, y], a, r + 12); line(g, p, q, { color: '#f0a92b', width: 3, cls: '' }); }
  svgEl('circle', { cx: x, cy: y, r, fill: '#f6c343', stroke: '#e0a100', 'stroke-width': 2 }, g);
  return g;
}

/* ======================================================================================
 * 1. A sun that moves: both shadows change, height ÷ shadow stays the same (Class)
 * ====================================================================================== */
const sun = {
  title: 'Move the sun: the shadows stay in proportion',
  height: 440,
  ask: 'A metre stick (1.00 m) and the school’s flagpole (8.0 m) stand on level ground in the sun. What happens to their shadows as the sun moves?',
  make(stage, v, ex) {
    const W = ex.W, H = 440, svg = stageSvg(stage, W, H), gy = 356, s = 26, xs = 120, xp = 360, hp = 8 * s, hs = 1 * s;
    const PT = [xp, gy - hp], ST = [xs, gy - hs], st = { alt: 40 };
    svgEl('rect', { x: 0, y: 0, width: W, height: gy, fill: SKY, rx: 10 }, svg);
    svgEl('rect', { x: 0, y: gy, width: W, height: H - gy, fill: DIRT }, svg);
    line(svg, [0, gy], [W, gy], { color: GROUND, width: 3, cls: '' });
    const gTri = svgEl('g', {}, svg), gSh = svgEl('g', {}, svg), gRay = svgEl('g', {}, svg), gObj = svgEl('g', {}, svg), gMk = svgEl('g', {}, svg), gLab = svgEl('g', {}, svg);
    const triS = path(gTri, '', { stroke: 'none', fill: AMBER, fo: 0.2, cls: '' }), triP = path(gTri, '', { stroke: 'none', fill: AMBER, fo: 0.2, cls: '' });
    const shS = path(gSh, '', { stroke: '#4b4f5a', width: 7, opacity: 0.55, cls: '' }), shP = path(gSh, '', { stroke: '#4b4f5a', width: 7, opacity: 0.55, cls: '' });
    const rays = [0, 1, 2, 3, 4].map((i) => path(gRay, '', { stroke: GOLD, width: i < 2 ? 2.6 : 1.6, dash: i < 2 ? null : '7 6', opacity: i < 2 ? 1 : 0.6 }));
    line(gObj, [xs, gy], ST, { color: '#8a5a2b', width: 6, cls: '' });
    flagpole(gObj, xp, gy, hp);
    const rq = [rightSq(gMk, [xs, gy], 0, 9), rightSq(gMk, [xp, gy], 0, 13)];
    const arcS = path(gMk, '', { stroke: AMBER, width: 3, cls: '' }), arcP = path(gMk, '', { stroke: AMBER, width: 3, cls: '' });
    txt(gLab, xs - 12, gy - hs / 2, '1.00 m', { anchor: 'end', size: 17 });
    txt(gLab, xp - 12, gy - hp / 2, '8.0 m', { anchor: 'end', size: 19 });
    const lS = txt(gLab, 0, gy + 20, '', { size: 17 }), lP = txt(gLab, 0, gy + 20, '', { size: 19 });
    const sunG = svgEl('g', { 'data-tap': '' }, svg); sunIcon(sunG, 0, 0, 21);
    svgEl('circle', { cx: 0, cy: 0, r: 40, fill: 'transparent' }, sunG);
    const tagS = hide(lab(stage, '', W * 0.25, 412, 'u6l6-tag')), tagP = hide(lab(stage, '', W * 0.66, 412, 'u6l6-tag'));
    const hint = hide(lab(stage, '<span class="u6l6-small">drag the sun ☀</span>', 0, 0));
    const rayPath = (Q, u) => { const L = Math.min(Q[1] / u[1], Q[0] / u[0]); return `M${(Q[0] - L * u[0]).toFixed(1)} ${(Q[1] - L * u[1]).toFixed(1)}`; };
    const render = () => {
      const a = st.alt * RAD, u = [Math.cos(a), Math.sin(a)], t = Math.tan(a), ls = hs / t, lp = hp / t;
      const tS = [xs + ls, gy], tP = [xp + lp, gy];
      triS.setAttribute('d', polyD([[xs, gy], ST, tS])); triP.setAttribute('d', polyD([[xp, gy], PT, tP]));
      shS.setAttribute('d', `M${xs} ${gy}L${tS[0].toFixed(1)} ${gy}`); shP.setAttribute('d', `M${xp} ${gy}L${tP[0].toFixed(1)} ${gy}`);
      rays[0].setAttribute('d', rayPath(ST, u) + `L${tS[0].toFixed(1)} ${gy}`); rays[1].setAttribute('d', rayPath(PT, u) + `L${tP[0].toFixed(1)} ${gy}`);
      [(tS[0] + tP[0]) / 2 - 40, tP[0] + 120, tP[0] + 240].forEach((gx, i) => rays[i + 2].setAttribute('d', gx < W ? rayPath([gx, gy], u) + `L${gx.toFixed(1)} ${gy}` : ''));
      arcS.setAttribute('d', arcD(tS, Math.max(10, Math.min(24, ls * 0.6)), 180 - st.alt, st.alt)); arcP.setAttribute('d', arcD(tP, 40, 180 - st.alt, st.alt));
      lS.setAttribute('x', ((xs + tS[0]) / 2).toFixed(1)); lS.textContent = f(1 / t, 2) + ' m';
      lP.setAttribute('x', ((xp + tP[0]) / 2).toFixed(1)); lP.textContent = f(8 / t, 1) + ' m';
      const sp = A(PT, 180 - st.alt, 138); sunG.setAttribute('transform', `translate(${sp[0].toFixed(1)} ${sp[1].toFixed(1)})`);
      hint.style.left = (sp[0] + 72) + 'px'; hint.style.top = (sp[1] + 4) + 'px';
      const r = Math.abs(t - 0.625) < 0.0006 ? '0.625' : f(t, 3);
      const ex1 = r === '0.625', eq = ex1 ? `= ${r}` : `≈ ${t.toFixed(2)}`;
      tagS.inner.innerHTML = `<b>Stick:</b> 1.00 ÷ ${(1 / t).toFixed(2)} ${eq}`; tagP.inner.innerHTML = `<b>Flagpole:</b> 8.0 ÷ ${ex1 ? '12.8' : (8 / t).toFixed(2)} ${eq}`;
    };
    render();
    // drag the sun (finger, Pencil or mouse)
    let drag = false;
    sunG.addEventListener('pointerdown', (e) => { drag = true; sunG.setPointerCapture(e.pointerId); e.preventDefault(); e.stopPropagation(); });
    sunG.addEventListener('pointermove', (e) => { if (!drag) return; const p = Geo.svgPoint(svg, e); let a = Math.atan2(PT[1] - p[1], PT[0] - p[0]) / RAD; st.alt = Math.max(24, Math.min(68, a)); render(); });
    const up = () => { drag = false; }; sunG.addEventListener('pointerup', up); sunG.addEventListener('pointercancel', up);
    const allR = [...rays]; hide(...allR, shS, shP, triS, triP, arcS, arcP, lS, lP, ...rq);
    const goTo = (c, target, ms) => { const a0 = st.alt; return tween(c, ms, (k) => { st.alt = a0 + (target - a0) * k; render(); }); };
    const EX1 = Math.atan(1 / 1.6) / RAD;
    return [
      { cap: 'The sun is so far away that its rays are <b>parallel</b>: they all come down at the same angle.', run: async (c) => { for (const r of allR) { r.style.opacity = r === rays[0] || r === rays[1] ? 1 : 0.6; await drawIn(r, 450, c); } await Promise.all([show(c, shS), show(c, shP), show(c, lS), show(c, lP)]); } },
      { cap: 'Each object, its shadow and a sun ray make a <b>right triangle</b>: the object stands straight up on level ground.', run: async (c) => { await Promise.all([show(c, triS, 450), show(c, triP, 450)]); await Promise.all(rq.map((q) => show(c, q))); } },
      { cap: 'The <b>sun’s angle</b> is the same at both shadow tips. Two pairs of equal angles: the triangles are <b>similar</b> (AA).', run: async (c) => { await show(c, arcS); await show(c, arcP); await pulse(c, arcP, 1.08, 500); } },
      { cap: 'The sun climbs higher. Both shadows get <b>shorter</b>, but <b>height ÷ shadow</b> is the same for both.', run: async (c) => { await Promise.all([c.pop(tagS), c.pop(tagP)]); await goTo(c, 63, 2600); } },
      { cap: 'Late in the day the sun is low: <b>long</b> shadows. The two ratios still match.', run: (c) => goTo(c, 26, 2800) },
      { cap: `Example 1, at 3:00 p.m.: 1.00 ÷ 1.60 = <b>0.625</b> and 8.0 ÷ 12.8 = <b>0.625</b>. Drag the sun to try any time of day.`, run: async (c) => { await goTo(c, EX1, 1600); await c.pop(hint); } }
    ];
  }
};

/** Geo.shadow draws a building / grain elevator to the RIGHT of its height line, so the sun ray and the shadow triangle
 *  cross it. Slide the elevator glyph left so its right wall is the height line. */
function fixElevator(fig) {
  const r = fig.svg.querySelector('rect[fill="#c9463d"]'); if (!r) return fig;
  const w = +r.getAttribute('width'), roof = r.nextElementSibling;
  [r, roof].forEach((e) => e && e.setAttribute('transform', `translate(${-w} 0)`));
  return fig;
}

/* ======================================================================================
 * 2. The shadow method in 4 steps (Class) — Example 1, 2(b), 2(c), 3(a) checks
 * ====================================================================================== */
const bl = (x) => `{\\color{#1f5bd6}${x}}`, rd = (x) => `{\\color{#c93a33}${x}}`;
const SH = {
  ex1: {
    ask: 'Example 1: a metre stick casts a 1.60 m shadow. At the same time, the flagpole’s shadow is 12.8 m. How tall is the flagpole?',
    small: { h: 1, shadow: 1.6, kind: 'stick', label: { h: '1.00 m', s: '1.60 m' } }, big: { h: 8, shadow: 12.8, kind: 'flag', label: { h: 'h', s: '12.8 m' } },
    rows: [['Metre stick', '1.00 m', '1.60 m'], ['Flagpole', T('h'), '12.8 m']],
    nums: `\\dfrac{${bl('h')}}{${rd('12.8')}}=\\dfrac{${rd('1.00')}}{${bl('1.60')}}`, work: [`${bl('1.60\\times h')}=${rd('12.8\\times1.00')}`, 'h=12.8\\div1.60=8'],
    solve: 'Divide by 1.60 to get <b>h</b> alone: h = 8.', ans: '8.0 m', who: 'The flagpole is',
    check: 'Check: the pole’s shadow is 12.8 ÷ 1.60 = 8 times as long, so the pole is 8 × 1.00 = 8.00 m tall ✓'
  },
  ex2b: {
    ask: 'Example 2(b): Jasmine (1.62 m) has a 2.25 m shadow. At the same time, a cell-phone tower’s shadow is 63.0 m. How tall is the tower?',
    small: { h: 1.62, shadow: 2.25, kind: 'person', label: { h: '1.62 m', s: '2.25 m' } }, big: { h: 45.36, shadow: 63, kind: 'tower', label: { h: 'h', s: '63.0 m' } },
    rows: [['Jasmine', '1.62 m', '2.25 m'], ['Tower', T('h'), '63.0 m']],
    nums: `\\dfrac{${bl('h')}}{${rd('63.0')}}=\\dfrac{${rd('1.62')}}{${bl('2.25')}}`, work: [`${bl('2.25\\times h')}=${rd('63.0\\times1.62')}`, '2.25h=102.06', 'h=102.06\\div2.25=45.36'],
    solve: 'Multiply out, then divide by 2.25: h = 45.36.', ans: '45.4 m', who: 'The tower is about',
    check: 'Check: our estimate was 48 m. 45.4 m is close ✓'
  },
  ex2c: {
    ask: 'Example 2(c): a light standard in the same parking lot is 9.0 m tall. How long is its shadow at that moment?',
    small: { h: 1.62, shadow: 2.25, kind: 'person', label: { h: '1.62 m', s: '2.25 m' } }, big: { h: 9, shadow: 12.5, kind: 'pole', label: { h: '9.0 m', s: 's' } },
    rows: [['Jasmine', '1.62 m', '2.25 m'], ['Light standard', '9.0 m', T('s')]],
    nums: `\\dfrac{${bl('9.0')}}{${rd('s')}}=\\dfrac{${rd('1.62')}}{${bl('2.25')}}`, work: [`${bl('9.0\\times2.25')}=${rd('1.62\\times s')}`, '20.25=1.62s', 's=20.25\\div1.62=12.5'],
    solve: 'This time the <b>shadow</b> is missing. Divide by 1.62: s = 12.5.', ans: '12.5 m', who: 'Its shadow is',
    check: 'Check: Jasmine’s shadow is longer than she is, so this shadow must be longer than 9.0 m ✓'
  },
  ex3: {
    ask: 'Example 3(a): a 6 ft fence post has a 4 ft 6 in shadow. At the same time, a grain elevator’s shadow is 52 ft. How tall is the elevator?',
    small: { h: 6, shadow: 4.5, kind: 'post', label: { h: '6 ft', s: '4 ft 6 in' } }, big: { h: 69.33, shadow: 52, kind: 'elevator', label: { h: 'h', s: '52 ft' } }, units: 'ft',
    rows: [['Fence post', '6 ft', '4 ft 6 in = 4.5 ft'], ['Elevator', T('h'), '52 ft']],
    nums: `\\dfrac{${bl('h')}}{${rd('52')}}=\\dfrac{${rd('6')}}{${bl('4.5')}}`, work: [`${bl('4.5\\times h')}=${rd('52\\times6')}=312`, 'h=312\\div4.5=69.33\\ldots'],
    solve: 'Divide by 4.5: h = 69.33…', ans: '69.3 ft', who: 'The elevator is about', units: 'Same units first: 4 ft 6 in = 4 6⁄12 ft = <b>4.5 ft</b>. ',
    check: 'Check: the post is taller than its shadow, so the elevator is taller than 52 ft ✓'
  }
};
const shadowSolve = {
  title: 'The shadow method in 4 steps',
  height: 456, capH: 92,
  choices: [{ sep: 'Example 1 check:' }, { v: 'ex1', label: 'flagpole' }, { sep: 'Example 2 check:' }, { v: 'ex2b', label: '(b) tower' }, { v: 'ex2c', label: '(c) shadow' }, { sep: 'Example 3 check:' }, { v: 'ex3', label: '(a) elevator' }],
  ask: (k) => SH[k].ask,
  make(stage, k, ex) {
    const W = ex.W, m = SH[k], x0 = 500;
    const fig = Geo.shadow(stage, { x: 24, y: 4, width: 450, height: 250, small: m.small, big: m.big, units: m.units || 'm' }); fixElevator(fig);
    const figEl = fig.el.closest('.geo-box') || fig.el; hide(figEl);
    const rows = m.rows.map((r) => `<tr><th>${r[0]}</th><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('');
    const tb = hide(add(stage, h('div', '', `<table class="u6l6-tbl" style="width:450px"><tr><th></th><th>Height</th><th>Shadow</th></tr>${rows}</table>`), 16, 268));
    const L = [labL(stage, `<span class="u6l6-st">Step 2</span>${T('\\dfrac{\\text{height}}{\\text{shadow}}=\\dfrac{\\text{height}}{\\text{shadow}}')}`, x0, 46, 'u6l6-eq'),
      labL(stage, `<span class="u6l6-st">Step 3</span>${T(m.nums)}`, x0, 116, 'u6l6-eq')];
    m.work.forEach((w, i) => L.push(labL(stage, T(w), x0 + 62, 172 + i * 48, 'u6l6-eq')));
    hide(...L);
    const yA = 172 + m.work.length * 48 + 22;
    const ans = hide(labL(stage, `<span class="u6l6-st">Step 4</span>${m.who} <b>${m.ans}</b> ${m.big.label.s === 's' ? 'long' : 'tall'}.`, x0, yA, 'u6l6-eq'));
    const chk = hide(labL(stage, m.check, x0, yA + 50, 'u6l6-small')); chk.inner.style.whiteSpace = 'normal'; chk.inner.style.width = (W - x0 - 12) + 'px';
    const st = hide(stamp(stage, m.ans, { ok: true, x: W - 80, y: 34, size: 'sm' }));
    const solveSteps = m.work.slice(1).map((w, i) => ({ cap: i === 0 ? m.solve : 'Keep going until the letter is alone.', run: (c) => c.pop(L[3 + i]) }));
    if (solveSteps.length > 1) { solveSteps[0].cap = m.solve; solveSteps.splice(1); solveSteps[0].run = async (c) => { for (let i = 3; i < L.length; i++) await c.pop(L[i]); }; }
    return [
      { cap: `<b>Step 1.</b> Sketch and label both triangles. The two shadows were measured at the <b>same time</b>.`, run: async (c) => { await appear(c, figEl, 300); await fig.play(c); await c.pop(tb); } },
      { cap: '<b>Step 2.</b> Write the word proportion: <b>heights on top</b>, shadows on the bottom.', run: (c) => c.pop(L[0]) },
      { cap: `<b>Step 3.</b> ${m.units || ''}Put in the numbers.`, run: (c) => c.pop(L[1]) },
      { cap: 'Cross-multiply: <b style="color:#1f5bd6">blue × blue</b> = <b style="color:#c93a33">red × red</b>.', run: (c) => c.pop(L[2]) },
      ...solveSteps,
      { cap: `<b>Step 4.</b> Make sense? ${m.check} Write the sentence.`, run: async (c) => { await c.pop(ans); await stampIn(c, st); await appear(c, chk, 300); } }
    ];
  }
};

/* ======================================================================================
 * 3. The scale factor shortcut: count shadows along the ground (Full)
 * ====================================================================================== */
const SK = {
  ex1: { ask: 'Example 1: the stick (1.00 m) has a 1.60 m shadow and the flagpole’s shadow is 12.8 m. How many times as long is the pole’s shadow?', k: 8, hS: '1.00 m', sS: '1.60 m', sB: '12.8 m', who: 'stick', big: 'flagpole', div: '12.8 ÷ 1.60 = 8', res: '8 × 1.00 m = <b>8.00 m</b>: the same answer as the proportion ✓', ratio: 1 / 1.6 },
  ex2: { ask: 'Example 2: Jasmine (1.62 m) has a 2.25 m shadow and the tower’s shadow is 63.0 m. How many Jasmine-shadows fit along the tower’s shadow?', k: 28, hS: '1.62 m', sS: '2.25 m', sB: '63.0 m', who: 'Jasmine', big: 'tower', div: '63.0 ÷ 2.25 = 28 (estimate: about 60 ÷ 2 = 30)', res: '28 × 1.62 = <b>45.36 m</b>. The estimate, 30 × 1.6 ≈ 48 m, was close ✓', ratio: 1.62 / 2.25 }
};
const scaleK = {
  title: 'Shadow k times as long → k times as tall',
  height: 430,
  choices: [{ sep: 'Example 1:' }, { v: 'ex1', label: 'k = 8' }, { sep: 'Example 2:' }, { v: 'ex2', label: 'k = 28' }],
  ask: (k) => SK[k].ask,
  make(stage, key, ex) {
    const W = ex.W, m = SK[key], svg = stageSvg(stage, W, 430), gy = 360, x0 = 90;
    const L = Math.min(W - 200, 300 / m.ratio), Hp = L * m.ratio, l = L / m.k, hs = Hp / m.k;
    const base = [x0, gy], top = [x0, gy - Hp], tip = [x0 + L, gy];
    svgEl('rect', { x: 0, y: 0, width: W, height: gy, fill: SKY, rx: 10 }, svg); svgEl('rect', { x: 0, y: gy, width: W, height: 70, fill: DIRT }, svg);
    line(svg, [0, gy], [W, gy], { color: GROUND, width: 3, cls: '' });
    path(svg, polyD([base, top, tip]), { stroke: 'none', fill: AMBER, fo: 0.16, cls: '' });
    line(svg, base, top, { color: SLATE, width: 5, cls: '' });
    line(svg, base, tip, { color: '#4b4f5a', width: 7, opacity: 0.5, cls: '' });
    const ray = hide(line(svg, A(top, 180 - Math.atan(m.ratio) / RAD, 60), tip, { color: GOLD, width: 2.6 }));
    const sx = x0 + L - l, stick = hide(line(svg, [sx, gy], [sx, gy - hs], { color: '#8a5a2b', width: 5, cls: '' }));
    const sTri = hide(path(svg, polyD([[sx, gy], [sx, gy - hs], tip]), { stroke: 'none', fill: BROWN, fo: 0.45, cls: '' }));
    txt(svg, x0 - 14, gy - Hp / 2, 'h', { anchor: 'end', size: 24, color: RED, italic: true });
    dim(svg, [x0, gy + 46], [x0 + L, gy + 46], m.sB, 'b');
    const sLab = hide(txt(svg, sx - 10, gy - hs - 14, `${m.who} ${m.hS}`, { anchor: 'end', size: 16 }));
    const ticks = [], cnts = [], stack = [];
    for (let i = 1; i <= m.k; i++) {
      const a = x0 + L - i * l, b = a + l;
      ticks.push(hide(line(svg, [a, gy + 8], [b, gy + 8], { color: i % 2 ? AMBER : BROWN, width: 8, cap: 'butt', cls: '' })));
      if (m.k <= 10 || i % 4 === 0) cnts.push(hide(txt(svg, (a + b) / 2, gy + 26, String(i), { size: 15, color: '#8a5a10' }))); else cnts.push(null);
      stack.push(hide(line(svg, [x0 - 8, gy - (i - 1) * hs], [x0 - 8, gy - i * hs], { color: i % 2 ? AMBER : BROWN, width: 8, cap: 'butt', cls: '' })));
    }
    const kTag = hide(lab(stage, `<b>k = ${m.k}</b>`, x0 + L + 70, gy - 40, 'u6l6-tag'));
    const res = hide(lab(stage, m.res, W / 2 + 60, 40, 'u6l6-tag'));
    const per = m.k > 10 ? 70 : 220;
    return [
      { cap: `Stand the ${m.who === 'stick' ? 'stick' : 'small triangle'} at the end of the ${m.big}’s shadow: the <b>same sun ray</b> touches both tops.`, run: async (c) => { ray.style.opacity = 1; await drawIn(ray, 700, c); await Promise.all([show(c, stick), show(c, sTri), show(c, sLab)]); } },
      { cap: `How many ${m.who === 'stick' ? 'stick' : 'Jasmine'}-shadows (${m.sS}) fit along ${m.sB}? ${m.div}.`, run: async (c) => { for (let i = 0; i < m.k; i++) { await show(c, ticks[i], per); if (cnts[i]) await c.pop(cnts[i], 160); } await c.pop(kTag); } },
      { cap: `The triangles are similar, so the ${m.big} is <b>${m.k} times</b> as tall: stack ${m.k} copies of ${m.hS}.`, run: async (c) => { for (const s of stack) await show(c, s, per); } },
      { cap: m.res, run: (c) => c.pop(res) }
    ];
  }
};

/* ======================================================================================
 * Mirror scene (shared by the mirror explainers and the figures)
 * ====================================================================================== */
/** o: { s (px per m), mx (mirror x px), gy, eye, d (person to mirror, m), d2, h, W, labels: {eye, d1, d2, h}, tot } */
function mirrorScene(svg, o) {
  const s = o.s, gy = o.gy, mx = o.mx, X = (m) => mx + m * s, M = [mx, gy], W = o.W;
  const P = {};
  svgEl('rect', { x: 0, y: 0, width: W, height: gy, fill: SKY, rx: 10 }, svg);
  svgEl('rect', { x: 0, y: gy, width: W, height: (o.H || gy + 80) - gy, fill: DIRT }, svg);
  line(svg, [0, gy], [W, gy], { color: GROUND, width: 3, cls: '' });
  P.gTri = svgEl('g', {}, svg); P.gRay = svgEl('g', {}, svg); P.gObj = svgEl('g', {}, svg); P.gMk = svgEl('g', {}, svg); P.gLab = svgEl('g', {}, svg);
  const Tp = [X(o.d2), gy - o.h * s]; P.T = Tp; P.M = M;
  if (o.kind === 'tree') { svgEl('rect', { x: Tp[0] - 4, y: gy - o.h * s * 0.5, width: 8, height: o.h * s * 0.5, fill: '#8a5a2b' }, P.gObj); svgEl('ellipse', { cx: Tp[0], cy: gy - o.h * s * 0.7, rx: o.h * s * 0.22, ry: o.h * s * 0.3, fill: '#5f9e4f', stroke: '#3f7535', 'stroke-width': 1.5 }, P.gObj); }
  else flagpole(P.gObj, Tp[0], gy, o.h * s, { side: 1 });
  svgEl('rect', { x: mx - 13, y: gy - 3, width: 26, height: 6, rx: 2, fill: '#7fb3f0', stroke: BLUE, 'stroke-width': 1.5 }, P.gObj);
  // the light: top → mirror → up to the left, as far as the picture goes
  const dx = Tp[0] - mx, dy = gy - Tp[1], kk = Math.min((mx - 8) / dx, (gy - 8) / dy);
  P.out = [mx - dx * kk, gy - dy * kk];
  P.rayIn = path(P.gRay, `M${Tp[0].toFixed(1)} ${Tp[1].toFixed(1)}L${mx} ${gy}`, { stroke: GOLD, width: 2.8 });
  P.rayOut = path(P.gRay, `M${mx} ${gy}L${P.out[0].toFixed(1)} ${P.out[1].toFixed(1)}`, { stroke: GOLD, width: 2.8 });
  P.arrIn = svgEl('g', {}, P.gRay); arrowHead(P.arrIn, (Tp[0] + mx) / 2, (Tp[1] + gy) / 2, mx - Tp[0], gy - Tp[1], { color: GOLD, width: 2.8 });
  P.arrOut = svgEl('g', {}, P.gRay); arrowHead(P.arrOut, mx - dx * kk * 0.5, gy - dy * kk * 0.5, -dx, -dy, { color: GOLD, width: 2.8 });
  const aIn = dirTo(M, Tp); P.aIn = aIn;
  P.arcIn = path(P.gMk, arcD(M, 34, 0, aIn), { stroke: GREEN, width: 3, cls: '' });
  P.arcOut = path(P.gMk, arcD(M, 34, 180 - aIn, aIn), { stroke: GREEN, width: 3, cls: '' });
  P.labIn = txt(P.gMk, ...A(M, aIn / 2, 54), 'in', { size: 15, color: GREEN }); P.labOut = txt(P.gMk, ...A(M, 180 - aIn / 2, 54), 'out', { size: 15, color: GREEN });
  P.sqObj = rightSq(P.gMk, [Tp[0], gy], 90, 11);
  const lb = o.labels || {};
  P.dimD2 = dim(P.gLab, [mx, gy + 22], [Tp[0], gy + 22], lb.d2 ?? f(o.d2, 2) + ' m', 'b');
  const hx = o.hSide === 'r' ? Tp[0] + 16 : Tp[0] - 22; P.dimH = dim(P.gLab, [hx, gy], [hx, Tp[1]], lb.h ?? f(o.h, 2) + ' m', o.hSide || 'l');
  txt(P.gLab, mx, gy + 58, 'mirror', { size: 14, color: BLUE });
  /** a person (eye height e m) standing d m from the mirror; returns { g, setD(d), tri, sq, dimD1, dimEye, E } */
  P.person = (e, d, po = {}) => {
    const R = { e, d };
    R.tri = path(P.gTri, '', { stroke: 'none', fill: BLUE, fo: 0.14, cls: '' });
    R.g = svgEl('g', {}, P.gObj); person(R.g, 0, gy, e * s, { color: po.color, totPx: po.tot ? po.tot * s : undefined });
    R.dimEye = dim(R.g, [-16, gy], [-16, gy - e * s], po.eyeLab ?? f(e, 2) + ' m', 'l', { size: po.size || 17 });
    R.sq = rightSq(R.g, [0, gy], 0, 10);
    R.dimD1 = svgEl('g', {}, P.gLab);
    R.setD = (dd) => {
      R.d = dd; const x = X(-dd); R.g.setAttribute('transform', `translate(${x.toFixed(1)} 0)`);
      R.tri.setAttribute('d', polyD([[x, gy], [x, gy - e * s], M]));
      R.dimD1.innerHTML = ''; dim(R.dimD1, [x, gy + 22], [mx, gy + 22], po.dLab ?? f(dd, 2) + ' m', 'b', { size: 16 });
      R.E = [x, gy - e * s];
    };
    R.setD(d);
    return R;
  };
  P.tri2 = path(P.gTri, polyD([M, Tp, [Tp[0], gy]]), { stroke: 'none', fill: BLUE, fo: 0.14, cls: '' });
  return P;
}

/* ======================================================================================
 * 4. The mirror method: the light bounces, the person walks back (Class) — Example 4 checks
 * ====================================================================================== */
const mirror = {
  title: 'The mirror method: angle in = angle out',
  height: 470, capH: 92,
  choices: [{ sep: 'Example 4 check:' }, { v: 'a', label: '(a) Diego' }, { v: 'b', label: '(b) Sara' }],
  ask: (k) => (k === 'a' ? 'Example 4(a): the mirror is 18.4 m from the flagpole. Diego’s eyes are 1.50 m up and he is 2.40 m from the mirror. How tall is the flagpole?'
    : 'Example 4(b): Sara’s eyes are 1.70 m up. The mirror stays 18.4 m from the 11.5 m flagpole. How far from the mirror must Sara stand?'),
  make(stage, k, ex) {
    const W = ex.W, H = 470, svg = stageSvg(stage, W, H), x0 = Math.max(668, W - 290);
    const S = mirrorScene(svg, { s: 26, mx: 120, gy: 392, d2: 18.4, h: 11.5, W, H, labels: { h: k === 'a' ? 'h' : '11.5 m', d2: '18.4 m' } });
    hide(S.rayIn, S.rayOut, S.arrIn, S.arrOut, S.arcIn, S.arcOut, S.labIn, S.labOut, S.tri2, S.sqObj, S.dimD2);
    const eqs = [], cap = [];
    if (k === 'a') {
      const D = S.person(1.5, 0.7, { dLab: '2.40 m', eyeLab: '1.50 m' }); hide(D.tri, D.sq, D.dimD1, D.dimEye);
      const bub = hide(lab(stage, 'I see the top!', 120 - 2.4 * 26 + 70, 392 - 1.5 * 26 - 56, 'u6l6-bubble'));
      eqs.push(labL(stage, T('\\dfrac{\\text{height}}{\\text{to mirror}}=\\dfrac{\\text{eyes}}{\\text{you to mirror}}'), x0, 70, 'u6l6-eq')); eqs[0].inner.style.fontSize = '19px';
      eqs.push(labL(stage, T('\\dfrac{h}{18.4}=\\dfrac{1.50}{2.40}'), x0, 150, 'u6l6-eq'));
      eqs.push(labL(stage, T('2.40\\times h=18.4\\times1.50'), x0, 212, 'u6l6-eq'));
      eqs.push(labL(stage, T('2.40h=27.6'), x0, 260, 'u6l6-eq'));
      eqs.push(labL(stage, T('h=27.6\\div2.40=11.5'), x0, 308, 'u6l6-eq'));
      hide(...eqs); const st = hide(stamp(stage, '11.5 m', { ok: true, x: x0 + 130, y: 372 }));
      return [
        { cap: 'Diego lays a mirror flat on the ground, <b>18.4 m</b> from the flagpole.', run: (c) => show(c, S.dimD2) },
        { cap: 'Light from the top of the pole hits the <b>centre</b> of the mirror…', run: async (c) => { S.rayIn.style.opacity = 1; await drawIn(S.rayIn, 900, c); await show(c, S.arrIn, 200); } },
        { cap: '…and bounces off at the <b>same angle</b>: angle in = angle out.', run: async (c) => { S.rayOut.style.opacity = 1; await drawIn(S.rayOut, 900, c); await show(c, S.arrOut, 200); await Promise.all([show(c, S.arcIn), show(c, S.arcOut), show(c, S.labIn), show(c, S.labOut)]); } },
        { cap: 'Diego walks backward until he sees the top of the pole in the mirror: the light reaches his <b>eyes</b>. He is <b>2.40 m</b> from the mirror, eyes <b>1.50 m</b> up.', run: async (c) => {
          await tween(c, 2200, (t) => { D.setD(0.7 + (2.4 - 0.7) * t); }); await c.pop(bub); await Promise.all([show(c, D.dimD1), show(c, D.dimEye)]); } },
        { cap: 'Two right triangles with equal angles at the mirror: they are <b>similar</b>.', run: async (c) => { await Promise.all([show(c, D.tri, 450), show(c, S.tri2, 450), show(c, D.sq), show(c, S.sqObj)]); } },
        { cap: 'Write the proportion: <b>height ÷ (object to mirror) = eye height ÷ (you to mirror)</b>.', run: async (c) => { await c.pop(eqs[0]); await c.pop(eqs[1]); } },
        { cap: 'Cross-multiply, then divide by 2.40. The flagpole is <b>11.5 m</b> tall.', run: async (c) => { for (const e of eqs.slice(2)) await c.pop(e); await stampIn(c, st); } }
      ];
    }
    const Sr = S.person(1.7, 1.0, { dLab: 'd', eyeLab: '1.70 m' }); hide(Sr.tri, Sr.sq, Sr.dimD1, Sr.dimEye);
    const bub = hide(lab(stage, 'I see it!', 120 - 2.72 * 26 + 60, 392 - 1.7 * 26 - 58, 'u6l6-bubble'));
    eqs.push(labL(stage, T('\\dfrac{11.5}{18.4}=\\dfrac{1.70}{d}'), x0, 110, 'u6l6-eq'));
    eqs.push(labL(stage, T('11.5\\times d=18.4\\times1.70'), x0, 180, 'u6l6-eq'));
    eqs.push(labL(stage, T('11.5d=31.28'), x0, 228, 'u6l6-eq'));
    eqs.push(labL(stage, T('d=31.28\\div11.5=2.72'), x0, 276, 'u6l6-eq'));
    hide(...eqs); const st = hide(stamp(stage, '2.72 m', { ok: true, x: x0 + 130, y: 350 }));
    void cap;
    return [
      { cap: 'Same mirror, same flagpole: <b>11.5 m</b> tall, <b>18.4 m</b> from the mirror.', run: (c) => show(c, S.dimD2) },
      { cap: 'The light from the top bounces off the mirror on the <b>same path</b> as before: angle in = angle out.', run: async (c) => { for (const r of [S.rayIn, S.rayOut]) { r.style.opacity = 1; await drawIn(r, 700, c); } await Promise.all([show(c, S.arrIn), show(c, S.arrOut), show(c, S.arcIn), show(c, S.arcOut), show(c, S.labIn), show(c, S.labOut)]); } },
      { cap: 'Sara’s eyes are higher (1.70 m). She walks back until the light reaches her eyes: <b>farther</b> back than Diego (2.40 m).', run: async (c) => {
        await tween(c, 2300, (t) => { Sr.setD(1.0 + (2.72 - 1.0) * t); }); await c.pop(bub); await Promise.all([show(c, Sr.dimD1), show(c, Sr.dimEye)]); } },
      { cap: 'Similar triangles again. Now the missing length is <b>you to mirror</b>, <i>d</i>.', run: async (c) => { await Promise.all([show(c, Sr.tri, 450), show(c, S.tri2, 450), show(c, Sr.sq), show(c, S.sqObj)]); await c.pop(eqs[0]); } },
      { cap: 'Cross-multiply, then divide by 11.5. Sara stands <b>2.72 m</b> from the mirror (higher eyes, farther back ✓).', run: async (c) => { for (const e of eqs.slice(1)) await c.pop(e); await stampIn(c, st); } }
    ];
  }
};

/* ======================================================================================
 * 5. Why the mirror triangles are similar: flip the pole under the ground (Full)
 * ====================================================================================== */
const whyMirror = {
  title: 'The mirror world',
  height: 440,
  ask: 'Why does “angle in = angle out” make the two triangles similar? (Diego’s numbers: eyes 1.50 m, 2.40 m and 18.4 m from the mirror.)',
  make(stage, v, ex) {
    const W = ex.W, H = 440, svg = stageSvg(stage, W, H), s = 15, gy = 210, mx = 230;
    const S = mirrorScene(svg, { s, mx, gy, d2: 18.4, h: 11.5, W, H, labels: { h: '', d2: '' } });
    S.dimD2.style.display = 'none'; S.dimH.style.display = 'none';
    const D = S.person(1.5, 2.4, { dLab: '', eyeLab: '' }); D.dimD1.style.display = 'none'; D.dimEye.style.display = 'none';
    svgEl('rect', { x: 0, y: gy + 2, width: W, height: H - gy - 2, fill: '#e9eef7', opacity: 0.9 }, S.gTri);
    const Ti = [S.T[0], gy + 11.5 * s];
    const img = hide(svgEl('g', {}, svg)); line(img, [S.T[0], gy], Ti, { color: '#7f8796', width: 4, dash: '8 6', cls: '' }); dot(img, Ti, { r: 5, color: '#7f8796' });
    txt(img, Ti[0] + 12, Ti[1] - 10, 'image of the top', { anchor: 'start', size: 16, color: '#5d6573' });
    const straight = hide(line(svg, D.E, Ti, { color: '#7b4fc4', width: 2.4, dash: '9 6' }));
    const aV = hide(path(svg, arcD(S.M, 30, 360 - S.aIn, S.aIn), { stroke: '#7b4fc4', width: 3, cls: '' }));
    hide(S.tri2, D.tri, S.arcIn, S.labIn, S.labOut);
    const t1 = hide(lab(stage, '<b>angle out</b> and the angle below are vertically opposite: <b>equal</b>', W - 230, 120, 'u6l6-tag')); t1.inner.style.whiteSpace = 'normal'; t1.inner.style.width = '380px';
    const t2 = hide(lab(stage, 'The image is a flip of the pole, so the angle below = <b>angle in</b>', W - 230, 300, 'u6l6-tag')); t2.inner.style.whiteSpace = 'normal'; t2.inner.style.width = '380px';
    return [
      { cap: 'The light from the top of the pole bounces off the mirror into Diego’s eye.', run: async (c) => { await pulse(c, S.rayOut, 1.02, 400); } },
      { cap: 'Picture the <b>mirror world</b>: the pole’s upside-down image under the ground, as deep as the pole is tall.', run: (c) => show(c, img, 500) },
      { cap: 'In the mirror, the top seems to be at its image: Diego’s eye, the mirror and the image are on <b>one straight line</b>.', run: async (c) => { straight.style.opacity = 1; await drawIn(straight, 900, c); } },
      { cap: 'Two straight lines cross at the mirror: <b>vertically opposite angles</b> are equal (Unit 5).', run: async (c) => { await show(c, aV); await c.pop(t1); } },
      { cap: 'The image is the pole flipped over, so its angle is the angle in. So <b>angle in = angle out</b>.', run: async (c) => { await Promise.all([show(c, S.arcIn), show(c, S.labIn), show(c, S.labOut)]); await c.pop(t2); } },
      { cap: 'Equal angles at the mirror and a right angle in each: the two triangles are <b>similar</b> (AA).', run: (c) => Promise.all([show(c, S.tri2, 450), show(c, D.tri, 450)]) }
    ];
  }
};

/* ======================================================================================
 * Ruler at arm's length (scene for the explainer and the Example 5 figure)
 * ====================================================================================== */
function rulerScene(svg, W, Hh, o = {}) {
  const P = {}, gy = Hh - (o.bottom ?? 42), E = [W * 0.11, gy - Hh * 0.31], D = W * 0.78, xT = E[0] + D, hT = D * 0.3, a = W * 0.16;
  const B = [xT, gy], Tp = [xT, gy - hT];
  const yB = E[1] + (B[1] - E[1]) * a / D, yT = E[1] + (Tp[1] - E[1]) * a / D, xr = E[0] + a;
  Object.assign(P, { E, B, Tp, xr, yB, yT, gy, k: D / a });
  svgEl('rect', { x: 0, y: 0, width: W, height: gy, fill: SKY, rx: 10 }, svg); svgEl('rect', { x: 0, y: gy, width: W, height: Hh - gy, fill: DIRT }, svg);
  line(svg, [0, gy], [W, gy], { color: GROUND, width: 3, cls: '' });
  P.gTri = svgEl('g', {}, svg);
  P.big = path(P.gTri, polyD([E, B, Tp]), { stroke: 'none', fill: AMBER, fo: 0.16, cls: '' });
  P.small = path(P.gTri, polyD([E, [xr, yB], [xr, yT]]), { stroke: 'none', fill: '#f2c94c', fo: 0.7, cls: '' });
  P.grow = path(P.gTri, polyD([E, [xr, yB], [xr, yT]]), { stroke: '#c27a0e', width: 2, fill: '#f2c94c', fo: 0.35, cls: '' });
  P.grow.style.transformBox = 'view-box'; P.grow.style.transformOrigin = `${E[0]}px ${E[1]}px`;
  // the tower and its blades
  const tw = Math.max(5, W * 0.012);
  path(svg, polyD([[xT - tw, gy], [xT - tw * 0.45, Tp[1]], [xT + tw * 0.45, Tp[1]], [xT + tw, gy]]), { stroke: '#8d96a6', width: 1.5, fill: '#f4f6f9', cls: '' });
  const bl2 = svgEl('g', {}, svg), bL = W * 0.085;
  [90, 210, 330].forEach((d) => { const q = A(Tp, d, bL); path(bl2, `M${Tp[0]} ${Tp[1]}L${q[0].toFixed(1)} ${q[1].toFixed(1)}`, { stroke: '#8d96a6', width: Math.max(3, W * 0.006), cls: '' }); });
  if (o.spin !== false) { const at2 = svgEl('animateTransform', { attributeName: 'transform', type: 'rotate', from: `0 ${Tp[0]} ${Tp[1]}`, to: `360 ${Tp[0]} ${Tp[1]}`, dur: '9s', repeatCount: 'indefinite' }, bl2); void at2; }
  dot(svg, Tp, { r: Math.max(3, W * 0.006), color: SLATE });
  // Paige, her arm and the ruler
  person(svg, E[0], gy, gy - E[1], { color: SLATE });
  P.arm = line(svg, [E[0], E[1] + (gy - E[1]) * 0.2], [xr, (yB + yT) / 2 + 6], { color: SLATE, width: Math.max(2.4, W * 0.004), cls: '' });
  const rw = Math.max(5, W * 0.011), rLen = (yB - yT) * 1.6;
  P.ruler = svgEl('g', {}, svg);
  svgEl('rect', { x: xr - rw / 2, y: yB - rLen, width: rw, height: rLen + 10, fill: '#f6dd7e', stroke: '#b38a15', 'stroke-width': 1.2 }, P.ruler);
  for (let i = 0; i <= 8; i++) { const y = yB - i * rLen / 8; line(P.ruler, [xr - rw / 2, y], [xr, y], { color: '#8a6a10', width: 1, cls: '' }); }
  P.piece = line(svg, [xr, yB], [xr, yT], { color: RED, width: Math.max(4, W * 0.008), cap: 'butt', cls: '' });
  P.sB = line(svg, E, B, { color: INK, width: 1.8, dash: '7 5' });
  P.sT = line(svg, E, Tp, { color: INK, width: 1.8, dash: '7 5' });
  const sz = o.size || 18;
  P.dArm = dim(svg, [E[0], yT - 26], [xr, yT - 26], o.arm ?? '60 cm', 'a', { size: sz });
  P.dD = dim(svg, [E[0], gy + 20], [xT, gy + 20], o.dist ?? '400 m', 'b', { size: sz });
  P.lR = txt(svg, xr + 12, (yB + yT) / 2 + 2, o.read ?? '18 cm', { anchor: 'start', size: sz, color: RED });
  P.lH = txt(svg, xT + 14 + tw, gy - hT / 2, o.h ?? 'h', { anchor: 'start', size: sz + 4, color: RED, italic: true });
  return P;
}
const ruler = {
  title: 'A ruler at arm’s length',
  height: 430, capH: 92,
  ask: 'Example 5: Paige is 400 m from a wind turbine. She holds a ruler upright 60 cm from her eye, and the tower (ground to hub) covers 18 cm of the ruler. How tall is the tower?',
  make(stage, v, ex) {
    const W = ex.W, H = 430, svg = stageSvg(stage, W, H), R = rulerScene(svg, W, H);
    hide(R.big, R.small, R.grow, R.piece, R.sB, R.sT, R.dArm, R.lR, R.ruler, R.arm);
    const eqs = [labL(stage, T('\\dfrac{\\text{height}}{\\text{distance}}=\\dfrac{\\text{ruler reading}}{\\text{eye to ruler}}'), 300, 38, 'u6l6-eq'),
      labL(stage, T('\\dfrac{h}{400}=\\dfrac{18}{60}'), 300, 96, 'u6l6-eq'), labL(stage, T('60\\times h=400\\times18=7\\,200'), 300, 144, 'u6l6-eq'), labL(stage, T('h=7\\,200\\div60=120'), 300, 186, 'u6l6-eq')];
    hide(...eqs); const st = hide(stamp(stage, '120 m', { ok: true, x: W * 0.66, y: 96 }));
    return [
      { cap: 'Paige holds a ruler straight up, <b>60 cm</b> from her eye, and closes one eye.', run: async (c) => { await Promise.all([show(c, R.arm), show(c, R.ruler)]); await show(c, R.dArm); } },
      { cap: 'She slides the ruler so its <b>0</b> lines up with the <b>bottom</b> of the tower.', run: async (c) => { R.sB.style.opacity = 1; await drawIn(R.sB, 900, c); } },
      { cap: 'The <b>hub</b> (the top of the tower) lines up with <b>18 cm</b> on the ruler.', run: async (c) => { R.sT.style.opacity = 1; await drawIn(R.sT, 900, c); await show(c, R.piece); await c.pop(R.lR); } },
      { cap: 'Two triangles, one inside the other. The ruler and the tower both stand straight up (parallel), so the triangles are <b>similar</b>.', run: async (c) => { await show(c, R.small, 400); await show(c, R.big, 500); } },
      { cap: 'The big triangle is the small one <b>blown up</b> from Paige’s eye.', run: async (c) => { R.grow.style.opacity = 1; await anim(c, R.grow, [{ transform: 'scale(1)' }, { transform: `scale(${R.k.toFixed(3)})` }], 2000); } },
      { cap: `${T('18\\div60')} has no unit (both cm), so the height comes out in <b>metres</b>, like the 400 m. The tower is about <b>120 m</b> tall.`, run: async (c) => { for (const e of eqs) await c.pop(e); await stampIn(c, st); } }
    ];
  }
};

/* ======================================================================================
 * Stakes across the river (scene for the explainer and the Example 6 figure)
 * ====================================================================================== */
function riverScene(svg, o) {
  const s = o.s, X = (x) => o.ox + x * s, Y = (y) => o.oy - y * s, P = {}, w = o.w ?? 22.8, ab = o.ab ?? 30, bc = o.bc ?? 10, cd = o.cd ?? 7.6;
  const pT = [X(0), Y(w)], pA = [X(0), Y(0)], pB = [X(ab), Y(0)], pC = [X(ab + bc), Y(0)], pD = [X(ab + bc), Y(-cd)];
  Object.assign(P, { pT, pA, pB, pC, pD, X, Y });
  const x1 = X(ab + bc) + (o.right ?? 40);
  svgEl('rect', { x: 0, y: 0, width: x1 + 20, height: o.H, fill: '#e8f0dc', rx: 10 }, svg);
  svgEl('rect', { x: 0, y: Y(w), width: x1 + 20, height: w * s, fill: WATER }, svg);
  line(svg, [0, Y(w)], [x1 + 20, Y(w)], { color: '#5d87b0', width: 2, cls: '' }); line(svg, [0, Y(0)], [x1 + 20, Y(0)], { color: '#5d87b0', width: 2, cls: '' });
  txt(svg, X((ab + bc) * 0.62), Y(w * 0.55), o.name ?? 'Bow River', { size: o.size ? o.size - 1 : 19, color: '#3d6a94', italic: true });
  // the tree on the far bank
  const tr = Math.max(7, s * 1.2); svgEl('rect', { x: pT[0] - tr * 0.18, y: pT[1] - tr * 1.6, width: tr * 0.36, height: tr * 1.6, fill: '#8a5a2b' }, svg);
  svgEl('circle', { cx: pT[0], cy: pT[1] - tr * 1.9, r: tr, fill: '#5f9e4f', stroke: '#3f7535', 'stroke-width': 1.5 }, svg);
  P.gTri = svgEl('g', {}, svg);
  P.t1 = path(P.gTri, polyD([pT, pA, pB]), { stroke: 'none', fill: AMBER, fo: 0.22, cls: '' });
  P.t2 = path(P.gTri, polyD([pD, pC, pB]), { stroke: 'none', fill: AMBER, fo: 0.22, cls: '' });
  P.TA = line(svg, pT, pA, { color: o.colTA || SLATE, width: 2.5, dash: '3 5' });
  P.AB = line(svg, pA, pB, { color: SLATE, width: 3 }); P.BC = line(svg, pB, pC, { color: SLATE, width: 3 }); P.CD = line(svg, pC, pD, { color: SLATE, width: 3 });
  P.sight = line(svg, pD, pT, { color: '#7b4fc4', width: 2, dash: '8 6' });
  P.sqA = rightSq(svg, pA, 0, 10); P.sqC = rightSq(svg, pC, 180, 10);
  const aB = dirTo(pB, pT); P.arcB1 = path(svg, arcD(pB, 26, aB, 180 - aB), { stroke: GREEN, width: 2.6, cls: '' }); P.arcB2 = path(svg, arcD(pB, 26, 360 - (180 - aB) , 180 - aB), { stroke: GREEN, width: 2.6, cls: '' });
  const z = o.size || 18;
  P.pts = [['T', pT, [-14, -4]], ['A', pA, [-14, 16]], ['B', pB, [0, 20]], ['C', pC, [12, -14]], ['D', pD, [14, 6]]].map(([n, p, d]) => { const g = svgEl('g', {}, svg); dot(g, p, { r: 4.5 }); txt(g, p[0] + d[0], p[1] + d[1], n, { size: z + 1, italic: true }); return g; });
  P.lW = txt(svg, pA[0] + 12, Y(w / 2), o.wl ?? 'w', { anchor: 'start', size: z + 3, color: RED, italic: true });
  P.lAB = txt(svg, (pA[0] + pB[0]) / 2, pA[1] - 13, o.abl ?? '30.0 m', { size: z });
  P.lBC = txt(svg, (pB[0] + pC[0]) / 2, pA[1] - 13, o.bcl ?? '10.0 m', { size: z });
  P.lCD = txt(svg, pC[0] + 10, (pC[1] + pD[1]) / 2, o.cdl ?? '7.6 m', { anchor: 'start', size: z });
  return P;
}
const river = {
  title: 'Stakes across the Bow River',
  height: 450, capH: 92,
  ask: 'Example 6: Kenji measures AB = 30.0 m, BC = 10.0 m and CD = 7.6 m. How wide is the river?',
  make(stage, v, ex) {
    const W = ex.W, H = 450, svg = stageSvg(stage, W, H), x0 = Math.max(600, W - 380);
    const R = riverScene(svg, { s: 11.5, ox: 60, oy: 306, H, right: 30 });
    hide(R.t1, R.t2, R.TA, R.AB, R.BC, R.CD, R.sight, R.sqA, R.sqC, R.arcB1, R.arcB2, R.lW, R.lAB, R.lBC, R.lCD, ...R.pts.slice(1));
    const you = hide(svgEl('g', {}, svg)); svgEl('circle', { cx: 0, cy: 0, r: 8, fill: '#f08a24', stroke: '#9a4f0c', 'stroke-width': 2 }, you);
    const ln = hide(line(svg, [0, 0], [1, 1], { color: '#7b4fc4', width: 2, dash: '8 6', cls: '' }));
    const setYou = (t) => { // you are t metres from C, walking away from the river
      const p = [R.X(40), R.Y(-t)], B = R.pB; you.setAttribute('transform', `translate(${p[0].toFixed(1)} ${p[1].toFixed(1)})`);
      const dx = B[0] - p[0], dy = B[1] - p[1], kk = (B[1] - R.pT[1]) / -dy; let q = [B[0] + dx * kk, R.pT[1]];
      if (q[0] < 8) { const k2 = (B[0] - 8) / -dx; q = [8, B[1] + dy * k2]; }
      ln.setAttribute('x1', p[0].toFixed(1)); ln.setAttribute('y1', p[1].toFixed(1)); ln.setAttribute('x2', q[0].toFixed(1)); ln.setAttribute('y2', q[1].toFixed(1));
    };
    setYou(1.5);
    const ok = hide(lab(stage, 'Lined up with the tree!', R.pD[0] - 150, R.pD[1] + 20, 'u6l6-bubble'));
    const eqs = [labL(stage, T('\\triangle TAB\\sim\\triangle DCB'), x0, 120, 'u6l6-eq'),
      labL(stage, T('\\dfrac{TA}{AB}=\\dfrac{DC}{CB}'), x0, 186, 'u6l6-eq'), labL(stage, T('\\dfrac{w}{30.0}=\\dfrac{7.6}{10.0}'), x0, 256, 'u6l6-eq'),
      labL(stage, T('10.0w=30.0\\times7.6=228'), x0, 316, 'u6l6-eq'), labL(stage, T('w=228\\div10.0=22.8'), x0, 364, 'u6l6-eq')];
    hide(...eqs); const st = hide(stamp(stage, '22.8 m', { ok: true, x: x0 + 200, y: 412, size: 'sm' }));
    const match = hide(labL(stage, `<span style="color:#c93a33">${T('TA\\leftrightarrow DC')}</span> &nbsp; <span style="color:#1f5bd6">${T('AB\\leftrightarrow CB')}</span>`, x0, 60, 'u6l6-eq'));
    return [
      { cap: 'Pick a tree <b>T</b> on the far bank. Put stake <b>A</b> straight across from it, on your side.', run: async (c) => { await c.pop(R.pts[1]); R.TA.style.opacity = 1; await drawIn(R.TA, 600, c); await Promise.all([show(c, R.lW), show(c, R.sqA)]); } },
      { cap: 'Walk along the bank: <b>30.0 m</b> to stake <b>B</b>, then <b>10.0 m</b> more to <b>C</b>.', run: async (c) => { R.AB.style.opacity = 1; await drawIn(R.AB, 700, c); await c.pop(R.pts[2]); await show(c, R.lAB, 200); R.BC.style.opacity = 1; await drawIn(R.BC, 400, c); await c.pop(R.pts[3]); await show(c, R.lBC, 200); } },
      { cap: 'At C, turn 90° and walk away from the river. Look back through B: keep going until B lines up with the tree. That spot is <b>D</b>.', run: async (c) => {
        await Promise.all([show(c, you), show(c, ln), show(c, R.sqC)]);
        await tween(c, 2600, (t) => { setYou(1.5 + (7.6 - 1.5) * t); });
        R.CD.style.opacity = 1; await Promise.all([c.pop(R.pts[4]), show(c, R.CD), show(c, R.lCD), c.pop(ok)]); } },
      { cap: 'Triangles <b>TAB</b> and <b>DCB</b> each have a right angle. The angles at B are <b>vertically opposite</b>, so they are equal: the triangles are <b>similar</b>.', run: async (c) => { await Promise.all([show(c, R.t1, 450), show(c, R.t2, 450)]); await Promise.all([show(c, R.arcB1), show(c, R.arcB2)]); await c.pop(eqs[0]); } },
      { cap: 'Matching sides: <b style="color:#c93a33">TA ↔ DC</b> (across from the angle at B) and <b style="color:#1f5bd6">AB ↔ CB</b> (along the bank).', run: async (c) => {
        R.TA.setAttribute('stroke', RED); R.CD.setAttribute('stroke', RED); R.AB.setAttribute('stroke', BLUE); R.BC.setAttribute('stroke', BLUE); R.TA.setAttribute('stroke-dasharray', '');
        await Promise.all([pulse(c, R.CD, 1.02, 300), c.pop(match)]); } },
      { cap: 'Proportion, cross-multiply, divide: the river is about <b>22.8 m</b> wide. Check: AB is 3 × BC, and 3 × 7.6 = 22.8 ✓', run: async (c) => { for (const e of eqs.slice(1)) await c.pop(e); await stampIn(c, st); } }
    ];
  }
};

/* ======================================================================================
 * 6. Check the work: a verdict for each student (Class) — Example 7
 * ====================================================================================== */
function paper(stage, who, lines, x, y) {
  const el = add(stage, h('div', 'u6l6-paper', `<div class="u6l6-who">${who}</div>` + lines.map((l) => `<div class="u6l6-line">${l}</div>`).join('')), x, y);
  return el;
}
function fixCard(stage, lines, x, y) {
  const el = add(stage, h('div', 'u6l6-fix', lines.map((l) => `<div class="u6l6-line">${l}</div>`).join('')), x, y);
  [...el.children].forEach((ch) => { ch.style.opacity = 0; }); el.style.opacity = 0; return el;
}
async function showFix(c, el, i) { el.style.opacity = 1; await appear(c, el.children[i], 350); }
const verdict = {
  title: 'Find the mistake, then fix it',
  height: 450, capH: 92,
  choices: [{ sep: 'Example 7 check:' }, { v: 'a', label: '(a) Ava' }, { v: 'b', label: '(b) Ethan' }, { v: 'c', label: '(c) Mia' }],
  ask: (k) => ({ a: 'Example 7(a): a 2.0 m post has a 3.0 m shadow, and a tree’s shadow is 21 m. Ava gets 31.5 m.', b: 'Example 7(b): Ethan (1.80 m tall, eyes 1.68 m) is 2.1 m from a mirror that is 14.7 m from a tree. He gets 12.6 m.', c: 'Example 7(c): Mia measured her shadow at 9:00 a.m. and the school’s shadow at 2:00 p.m.' })[k],
  make(stage, k, ex) {
    const W = ex.W, H = 450, px = 380, pw = W - px - 6;
    if (k === 'a') {
      const fig = Geo.shadow(stage, { x: px, y: 8, width: pw, height: 300, small: { h: 2, shadow: 3, kind: 'post', label: { h: '2.0 m', s: '3.0 m' } }, big: { h: 14, shadow: 21, kind: 'tree', label: { h: '?', s: '21 m' } } });
      void fig;
      const pp = paper(stage, 'Ava’s work', [T('\\dfrac{h}{21}=\\dfrac{3.0}{2.0}'), T('h=31.5\\text{ m}')], 16, 14);
      const x1 = stamp(stage, 'too tall!', { ok: false, x: 270, y: 132, size: 'sm' }); hide(x1);
      const tag = hide(lab(stage, 'shadow <b>longer</b> than the post', px + pw * 0.2, 340, 'u6l6-tag'));
      const tag2 = hide(lab(stage, 'so the tree is <b>shorter</b> than 21 m', px + pw * 0.62, 390, 'u6l6-tag'));
      const fx = fixCard(stage, [`Height on top on <b>both</b> sides: ${T('\\dfrac{h}{21}=\\dfrac{2.0}{3.0}')}`, `${T('3.0h=42')}, &nbsp; ${T('h=14')} m`], 16, 200);
      const ok = hide(stamp(stage, '14 m ✓', { ok: true, x: 270, y: 380, size: 'sm' }));
      void pp;
      return [
        { cap: 'Ava’s work. Quick check first: the post’s shadow (3.0 m) is <b>longer</b> than the post (2.0 m).', run: (c) => c.pop(tag) },
        { cap: 'So right now <b>every</b> shadow is longer than its object: the tree must be <b>shorter than 21 m</b>. 31.5 m can’t be right.', run: async (c) => { await c.pop(tag2); await stampIn(c, x1); } },
        { cap: 'Her mistake: she flipped the post’s ratio (shadow over height). Keep <b>height on top</b> on both sides.', run: (c) => showFix(c, fx, 0) },
        { cap: '3.0h = 42, so h = <b>14 m</b>. Shorter than 21 m ✓', run: async (c) => { await showFix(c, fx, 1); await stampIn(c, ok); } }
      ];
    }
    if (k === 'b') {
      const svg = add(stage, svgEl('svg', { class: 'u6l6-svg', width: pw, height: 330, viewBox: `0 0 ${pw} 330` }), px, 6);
      const S = mirrorScene(svg, { s: 16, mx: 150, gy: 272, d2: 14.7, h: 11.76, W: pw, H: 330, kind: 'tree', hSide: 'r', labels: { h: '?', d2: '14.7 m' } });
      const E = S.person(1.68, 2.1, { tot: 1.8, eyeLab: '1.68 m', dLab: '2.1 m', size: 15 });
      // a zoomed-in look at Ethan's head: the light goes into the eye, not to the top of the head
      const zx = pw - 160, zy = 14, zoom = svgEl('g', {}, svg);
      svgEl('rect', { x: zx, y: zy, width: 150, height: 150, rx: 12, fill: '#fff', stroke: '#b9ad97', 'stroke-width': 2 }, zoom);
      txt(zoom, zx + 75, zy + 16, 'zoom in', { size: 13, color: '#8a8f99' });
      svgEl('circle', { cx: zx + 60, cy: zy + 82, r: 36, fill: '#fff', stroke: SLATE, 'stroke-width': 3 }, zoom);
      dot(zoom, [zx + 80, zy + 84], { r: 4, color: INK });
      const zRay = hide(svgEl('g', {}, zoom)); line(zRay, [zx + 146, zy + 132], [zx + 84, zy + 86], { color: GOLD, width: 3, cls: '' }); arrowHead(zRay, zx + 100, zy + 98, -62, -46, { color: GOLD, width: 3 });
      txt(zoom, zx + 8, zy + 128, 'eyes', { anchor: 'start', size: 14, weight: 800 });
      const head = hide(svgEl('g', {}, zoom)); line(head, [zx + 6, zy + 46], [zx + 144, zy + 46], { color: RED, width: 2, dash: '5 4', cls: '' }); txt(head, zx + 75, zy + 34, 'top of head', { size: 13, color: RED });
      hide(S.rayIn, S.rayOut, S.arrIn, S.arrOut, S.arcIn, S.arcOut, S.labIn, S.labOut, S.tri2, E.tri);
      paper(stage, 'Ethan’s work', [T('h=1.80\\times14.7\\div2.1'), T('h=12.6\\text{ m}')], 16, 14);
      const x1 = hide(stamp(stage, 'full height', { ok: false, x: 260, y: 132, size: 'sm' }));
      const fx = fixCard(stage, [`Use his <b>eye</b> height: ${T('h=1.68\\times14.7\\div2.1')}`, `${T('h=11.76')}: about <b>11.8 m</b>`], 16, 200);
      const ok = hide(stamp(stage, '11.8 m ✓', { ok: true, x: 270, y: 380, size: 'sm' }));
      return [
        { cap: 'Ethan’s work. Follow the light from the top of the tree: it bounces off the mirror into his <b>eyes</b>…', run: async (c) => { for (const r of [S.rayIn, S.rayOut]) { r.style.opacity = 1; await drawIn(r, 700, c); } await Promise.all([show(c, S.arrIn), show(c, S.arrOut), show(c, zRay)]); } },
        { cap: '…not to the top of his head. He used his <b>full height</b>, 1.80 m, so his answer is too big.', run: async (c) => { await show(c, head); await stampIn(c, x1); } },
        { cap: 'Use his eye height, 1.68 m: h = 1.68 × 14.7 ÷ 2.1.', run: async (c) => { await Promise.all([show(c, E.tri), show(c, S.tri2)]); await showFix(c, fx, 0); } },
        { cap: 'h = 11.76. The tree is about <b>11.8 m</b> tall ✓', run: async (c) => { await showFix(c, fx, 1); await stampIn(c, ok); } }
      ];
    }
    // (c) Mia: two different times of day
    const svg = add(stage, svgEl('svg', { class: 'u6l6-svg', width: pw, height: 330, viewBox: `0 0 ${pw} 330` }), px, 6);
    const half = pw / 2, gy = 268;
    const scene = (x0, alt, label, kind) => {
      const g = svgEl('g', {}, svg);
      svgEl('rect', { x: x0 + 4, y: 0, width: half - 8, height: 300, fill: SKY, rx: 10 }, g);
      line(g, [x0 + 4, gy], [x0 + half - 4, gy], { color: GROUND, width: 3, cls: '' });
      const hh = kind === 'person' ? 70 : 150, bx = x0 + (kind === 'person' ? 40 : 96), sh = hh / Math.tan(alt * RAD), tip = [bx + sh, gy];
      path(g, polyD([[bx, gy], [bx, gy - hh], tip]), { stroke: 'none', fill: AMBER, fo: 0.22, cls: '' });
      if (kind === 'person') person(g, bx, gy, hh * 0.93, {}); else { svgEl('rect', { x: bx - 70, y: gy - hh, width: 70, height: hh, fill: '#d7dbe3', stroke: '#6a7182', 'stroke-width': 1.5 }, g); }
      line(g, [bx, gy], tip, { color: '#4b4f5a', width: 6, opacity: 0.5, cls: '' });
      line(g, A(tip, 180 - alt, Math.min(260, (gy - 40) / Math.sin(alt * RAD), (tip[0] - x0 - 10) / Math.cos(alt * RAD))), tip, { color: GOLD, width: 2.4, cls: '' });
      path(g, arcD(tip, 34, 180 - alt, alt), { stroke: AMBER, width: 3, cls: '' });
      txt(g, x0 + half / 2, 22, label, { size: 17, weight: 800 });
      return g;
    };
    const L = hide(scene(0, 22, 'Mia, 9:00 a.m.: low sun', 'person')), Rg = hide(scene(half, 48, 'School, 2:00 p.m.: higher sun', 'building'));
    paper(stage, 'Mia’s plan', ['my shadow at <b>9:00 a.m.</b>', 'the school’s shadow at <b>2:00 p.m.</b>', '→ shadow method'], 16, 14);
    const x1 = hide(stamp(stage, 'not similar', { ok: false, x: px + pw / 2, y: 150 }));
    const fx = fixCard(stage, ['Can’t be fixed with these numbers.', 'Measure <b>both</b> shadows again, at the <b>same time</b>.'], 16, 230);
    const ok = hide(stamp(stage, 'same time ✓', { ok: true, x: 260, y: 395, size: 'sm' }));
    return [
      { cap: 'Mia measured her shadow at <b>9:00 a.m.</b>, when the sun was low…', run: (c) => show(c, L, 450) },
      { cap: '…and the school’s shadow at <b>2:00 p.m.</b>, when the sun was higher.', run: (c) => show(c, Rg, 450) },
      { cap: 'The sun’s angles are <b>different</b>, so the triangles are <b>not similar</b>. Her answer is wrong.', run: (c) => stampIn(c, x1) },
      { cap: 'It can’t be fixed with these numbers: she must measure both shadows again, at the <b>same time</b>.', run: async (c) => { await showFix(c, fx, 0); await showFix(c, fx, 1); await stampIn(c, ok); } }
    ];
  }
};

/* ======================================================================================
 * 7. Small mistakes grow (Full)
 * ====================================================================================== */
const errors = {
  title: 'A 10 cm slip becomes a 77 cm mistake',
  height: 440,
  ask: 'Diego (Example 4): eyes 1.50 m, 2.40 m from the mirror, mirror 18.4 m from the pole. What if he measures his eye height 10 cm too high?',
  make(stage, v, ex) {
    const W = ex.W, H = 440, svg = stageSvg(stage, W, H);
    const S = mirrorScene(svg, { s: 15, mx: 120, gy: 232, d2: 18.4, h: 11.5, W, H: 262, labels: { h: '11.5 m', d2: '18.4 m' } });
    const D = S.person(1.5, 2.4, { eyeLab: '1.50 m', dLab: '2.40 m', size: 15 });
    void D;
    const by = 330, cm = 3.6, x0 = 270;
    const kTag = hide(lab(stage, `${T('18.4\\div2.40\\approx7.7')}: the pole’s triangle is about <b>7.7 times</b> as big as Diego’s`, W - 235, 44, 'u6l6-tag')); kTag.inner.style.whiteSpace = 'normal'; kTag.inner.style.width = '400px';
    const b1 = hide(svgEl('g', {}, svg)); svgEl('rect', { x: x0, y: by - 14, width: 10 * cm, height: 28, fill: RED, rx: 4 }, b1); txt(b1, x0 - 10, by, 'eye height: 10 cm off', { anchor: 'end', size: 16 }); txt(b1, x0 + 10 * cm + 10, by, '10 cm', { anchor: 'start', size: 17, color: RED, weight: 800 });
    const b2 = hide(svgEl('g', {}, svg)); svgEl('rect', { x: x0, y: by + 46, width: 76.7 * cm, height: 28, fill: RED, rx: 4 }, b2); txt(b2, x0 - 10, by + 60, 'height: 77 cm off', { anchor: 'end', size: 16 }); txt(b2, x0 + 76.7 * cm + 10, by + 60, '77 cm', { anchor: 'start', size: 17, color: RED, weight: 800 });
    const eqA = hide(lab(stage, `${T('h=18.4\\times1.60\\div2.40=12.27')} m,<br>not 11.5 m`, W - 235, 150, 'u6l6-eq'));
    const times = hide(lab(stage, '× 7.7', x0 + 76.7 * cm + 110, by + 30, 'u6l6-ans'));
    return [
      { cap: 'Diego’s two triangles. The pole’s triangle is about <b>7.7 times</b> as big as his.', run: (c) => c.pop(kTag) },
      { cap: 'Say he measures his eye height <b>10 cm</b> too high: 1.60 m instead of 1.50 m.', run: (c) => show(c, b1) },
      { cap: 'Then h = 18.4 × 1.60 ÷ 2.40 = <b>12.27 m</b>, instead of 11.5 m: <b>77 cm</b> too tall.', run: async (c) => { await c.pop(eqA); await show(c, b2, 600); } },
      { cap: 'The 10 cm slip grew about 7.7 times. <b>Small mistakes in short lengths grow when you multiply up</b>: measure them carefully.', run: (c) => c.pop(times) }
    ];
  }
};

mountExplainers({ sun, shadowSolve, scaleK, mirror, whyMirror, ruler, river, verdict, errors });

/* ======================================================================================
 * Static figures on the cards
 * ====================================================================================== */
/** the warm-up answer: a can as tall as it is wide, with two slices cut off (circle, square and triangle shadows) */
function plugFig(host) {
  const W = 300, H = 200, svg = figSvg(host, W, H), r = 50, cx = 92, base = 170;
  const P = (x, y, z) => [cx + r * (x + 0.38 * y), base - r * (z + 0.32 * y)];
  const curve = (t0, t1, n = 28) => { const out = []; for (let i = 0; i <= n; i++) { const t = t0 + (t1 - t0) * i / n; out.push(P(Math.cos(t), Math.sin(t), 2 * (1 + Math.sin(t)))); } return out; };
  const bottom = (t0, t1, n = 28) => { const out = []; for (let i = 0; i <= n; i++) { const t = t0 + (t1 - t0) * i / n; out.push(P(Math.cos(t), Math.sin(t), 0)); } return out; };
  const PI = Math.PI;
  path(svg, polyD([...bottom(PI, 1.5 * PI), ...curve(1.5 * PI, PI)]), { fill: '#c9a063', stroke: '#7a5124', width: 2, cls: '' });
  path(svg, polyD([...bottom(1.5 * PI, 2 * PI), ...curve(2 * PI, 1.5 * PI)]), { fill: '#b88c50', stroke: '#7a5124', width: 2, cls: '' });
  path(svg, polyD([P(-1, 0, 2), P(1, 0, 2), ...curve(2 * PI, PI)]), { fill: '#ecd29f', stroke: '#7a5124', width: 2, cls: '' });
  const sh = '#3d3a44', lx = 238;
  svgEl('circle', { cx: lx, cy: 30, r: 20, fill: sh, opacity: 0.75 }, svg); txt(svg, lx - 30, 30, 'above', { anchor: 'end', size: 14 });
  svgEl('rect', { x: lx - 20, y: 76, width: 40, height: 40, fill: sh, opacity: 0.75 }, svg); txt(svg, lx - 30, 96, 'front', { anchor: 'end', size: 14 });
  path(svg, polyD([[lx - 20, 184], [lx + 20, 184], [lx, 144]]), { fill: sh, fo: 0.75, stroke: 'none', cls: '' }); txt(svg, lx - 30, 168, 'side', { anchor: 'end', size: 14 });
}
const FIG = {
  wans: plugFig,
  sunrays: (host) => Geo.shadow(host, { width: 470, height: 250, small: { h: 1, shadow: 1.6, kind: 'stick', label: { h: 'stick', s: 'stick’s shadow' } }, big: { h: 8, shadow: 12.8, kind: 'flag', label: { h: 'flagpole', s: 'flagpole’s shadow' } }, sunLabel: '' }),
  ex1: (host) => Geo.shadow(host, { width: 400, height: 200, small: { h: 1, shadow: 1.6, kind: 'stick', label: { h: '1.00 m', s: '1.60 m' } }, big: { h: 8, shadow: 12.8, kind: 'flag', label: { h: 'h', s: '12.8 m' } } }),
  ex2: (host) => Geo.shadow(host, { width: 420, height: 250, small: { h: 1.62, shadow: 2.25, kind: 'person', label: { h: '1.62 m', s: '2.25 m' } }, big: { h: 45.36, shadow: 63, kind: 'tower', label: { h: 'h', s: '63.0 m' } } }),
  ex3: (host) => fixElevator(Geo.shadow(host, { width: 330, height: 170, small: { h: 6, shadow: 4.5, kind: 'post', label: { h: '6 ft', s: '4.5 ft' } }, big: { h: 69.33, shadow: 52, kind: 'elevator', label: { h: 'h', s: '52 ft' } }, units: 'ft' })),
  mirror0: (host) => Geo.mirror(host, { width: 470, height: 240, eye: 1.6, d1: 2.4, d2: 9, kind: 'tree', labels: { eye: 'eye height', d1: 'you to mirror', d2: 'mirror to object', h: 'object' } }),
  ex4: (host) => Geo.mirror(host, { width: 440, height: 230, eye: 1.5, d1: 2.4, d2: 18.4, kind: 'flag', labels: { eye: '1.50 m', d1: '2.40 m', d2: '18.4 m', h: 'h' } }),
  ex5: (host) => { const svg = figSvg(host, 440, 230); rulerScene(svg, 440, 230, { size: 15, bottom: 34 }); },
  ex6: (host) => { const svg = figSvg(host, 440, 250); riverScene(svg, { s: 6.6, ox: 34, oy: 178, H: 250, right: 60, size: 15 }); }
};
document.querySelectorAll('.u6l6-fig[data-fig]').forEach((host) => { const fn = FIG[host.dataset.fig]; if (fn) fn(host); });

/* ======================================================================================
 * Math History: Thales measures the Great Pyramid with a stick and its shadow
 * ====================================================================================== */
(function thales() {
  const svg = document.getElementById('u6l6-hist'); if (!svg) return;
  const NS = 'http://www.w3.org/2000/svg', E = (tag, at, par = svg) => { const e = document.createElementNS(NS, tag); for (const k in at) e.setAttribute(k, at[k]); par.appendChild(e); return e; };
  const Tt = (x, y, s, cls = 'u6l6-h-t', anchor = 'middle') => { const t = E('text', { x, y, class: cls, 'text-anchor': anchor }); t.textContent = s; return t; };
  const sc = 0.95, gy = 250, cx = 190, half = 115 * sc, top = [cx, gy - 146.6 * sc], tip = [cx + 220 * sc, gy];
  E('rect', { x: 0, y: 0, width: 600, height: gy, fill: '#fbf3e2' }); E('rect', { x: 0, y: gy, width: 600, height: 50, fill: '#ead6ad' });
  E('line', { x1: 0, y1: gy, x2: 600, y2: gy, stroke: '#7a4a26', 'stroke-width': 2 });
  const u = [tip[0] - top[0], tip[1] - top[1]], st0 = [top[0] - u[0] * 0.52, top[1] - u[1] * 0.52], sunP = [top[0] - u[0] * 0.62, top[1] - u[1] * 0.62];
  const sunE = E('g', {}); E('circle', { cx: sunP[0], cy: sunP[1], r: 18, fill: '#f2c14e', stroke: '#b07a12', 'stroke-width': 2 }, sunE);
  E('polygon', { points: `${cx - half},${gy} ${top[0]},${top[1]} ${cx + half},${gy}`, fill: '#e2c58c', stroke: '#7a4a26', 'stroke-width': 2 });
  const shadow = E('line', { x1: cx + half, y1: gy + 3, x2: tip[0], y2: gy + 3, stroke: '#4a2c14', 'stroke-width': 7, opacity: 0.55 });
  const ray = E('line', { x1: st0[0], y1: st0[1], x2: tip[0], y2: tip[1], stroke: '#b07a12', 'stroke-width': 2.4 });
  const sh = 34, sl = sh * 1.5, sx = tip[0];   // the stick, drawn larger than real (not to scale)
  const stick = E('g', {}); E('line', { x1: sx, y1: gy, x2: sx, y2: gy - sh, stroke: '#4a2c14', 'stroke-width': 4 }, stick);
  E('line', { x1: sx, y1: gy + 3, x2: sx + sl, y2: gy + 3, stroke: '#4a2c14', 'stroke-width': 6, opacity: 0.55 }, stick);
  E('line', { x1: sx - sl * 0.9, y1: gy - sh - sh * 0.9, x2: sx + sl, y2: gy, stroke: '#b07a12', 'stroke-width': 2.2 }, stick);
  Tt(sx + 30, gy - sh - 10, 'stick 2 m', 'u6l6-h-t', 'start').setAttribute('fill', '#4a2c14'); stick.appendChild(svg.lastChild);
  const tri = E('polygon', { points: `${cx},${gy} ${top[0]},${top[1]} ${tip[0]},${tip[1]}`, fill: '#b07a12', 'fill-opacity': 0.18, stroke: '#b07a12', 'stroke-width': 1.5, 'stroke-dasharray': '6 4' });
  const hl = E('line', { x1: cx, y1: gy, x2: top[0], y2: top[1], stroke: '#4a2c14', 'stroke-width': 2, 'stroke-dasharray': '5 4' });
  const hidden = E('g', {});
  E('line', { x1: cx, y1: gy - 10, x2: cx + half, y2: gy - 10, stroke: '#7a4a26', 'stroke-width': 3 }, hidden);
  hidden.appendChild(Tt(cx + half / 2, gy - 18, '115 m'));
  hidden.appendChild(Tt((cx + half + tip[0]) / 2, gy + 24, '+ 105 m'));
  hidden.appendChild(Tt((cx + tip[0]) / 2, gy + 44, '= 220 m from under the top', 'u6l6-h-big'));
  const hq = Tt(cx - 22, top[1] + 60, 'h', 'u6l6-h-big', 'end');
  const eq = E('g', {}); eq.appendChild(Tt(430, 60, 'h ÷ 220 = 2 ÷ 3', 'u6l6-h-big')); eq.appendChild(Tt(430, 90, 'h ≈ 147 m', 'u6l6-h-big'));
  const parts = [[sunE, 0], [ray, 900], [shadow, 1800], [stick, 3000], [tri, 4400], [hl, 4400], [hq, 4700], [hidden, 6000], [eq, 8000]];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let anims = [];
  const play = () => {
    anims.forEach((a) => a.cancel()); anims = [];
    parts.forEach(([el, t]) => { el.style.opacity = reduce ? 1 : 0; if (!reduce) anims.push(el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 700, delay: t, fill: 'forwards' })); });
  };
  parts.forEach(([el]) => { el.style.opacity = 1; });
  let played = false;
  new IntersectionObserver((es) => { es.forEach((e) => { if (e.isIntersecting && !played) { played = true; play(); } }); }, { threshold: 0.5 }).observe(svg);
  svg.addEventListener('click', play);
  const btn = svg.closest('.hist-anim') && svg.closest('.hist-anim').querySelector('.hist-play'); if (btn) btn.addEventListener('click', play);
})();

/* ======================================================================================
 * Stand Up Break
 * ====================================================================================== */
const OBJ = ['tree', 'flagpole', 'light pole', 'barn', 'water tower', 'silo', 'hotel', 'church steeple'];
standup('u6l6', {
  intro: 'Sketch the two triangles, write the word proportion, then solve. Does your answer make sense?',
  levels: {
    BEG: (r) => {
      const sh = r.pick([0.5, 0.8, 1.2, 1.5, 2, 2.5]), k = r.int(4, 15), S = f(sh * k, 2), o = r.pick(OBJ), sf = sh.toFixed(1);
      return { text: `At the same time, a <b>1.0 m</b> stick casts a <b>${sf} m</b> shadow and a ${o} casts a <b>${S} m</b> shadow. How tall is the ${o}?`, q: '',
        a: [`\\dfrac{h}{${S}}=\\dfrac{1.0}{${sf}}`, `${sf}h=${S}\\times1.0=${S}`, `h=${S}\\div${sf}=${k}\\text{ m}`] };
    },
    PRG: (r) => r.pick([
      () => {
        const p = r.int(30, 37) * 0.05, ps = r.int(12, 30) * 0.1, S = r.int(12, 60), o = r.pick(OBJ), hh = S * p / ps;
        return { text: `A person <b>${p.toFixed(2)} m</b> tall casts a <b>${ps.toFixed(1)} m</b> shadow. At the same time, a ${o} casts a <b>${S} m</b> shadow. How tall is the ${o}, to the nearest tenth?`, q: '',
          a: [`\\dfrac{h}{${S}}=\\dfrac{${p.toFixed(2)}}{${ps.toFixed(1)}}`, `${ps.toFixed(1)}h=${S}\\times${p.toFixed(2)}=${f(S * p, 3)}`, `h=${f(S * p, 3)}\\div${ps.toFixed(1)}\\approx${hh.toFixed(1)}\\text{ m}`] };
      },
      () => {
        const p = r.int(30, 37) * 0.05, ps = r.int(12, 30) * 0.1, hh = r.int(6, 30), o = r.pick(OBJ), s = hh * ps / p;
        return { text: `A person <b>${p.toFixed(2)} m</b> tall casts a <b>${ps.toFixed(1)} m</b> shadow. A ${o} <b>${hh} m</b> tall stands nearby. How long is the ${o}’s shadow, to the nearest tenth?`, q: '',
          a: [`\\dfrac{${hh}}{s}=\\dfrac{${p.toFixed(2)}}{${ps.toFixed(1)}}`, `${hh}\\times${ps.toFixed(1)}=${p.toFixed(2)}s`, `${f(hh * ps, 3)}=${p.toFixed(2)}s`, `s=${f(hh * ps, 3)}\\div${p.toFixed(2)}\\approx${s.toFixed(1)}\\text{ m}`] };
      }
    ])(),
    MAS: (r) => r.pick([
      () => {
        const e = r.int(28, 35) * 0.05, d1 = r.int(15, 30) * 0.1, d2 = r.int(16, 50) * 0.5, o = r.pick(['tree', 'flagpole', 'gym wall', 'light pole']), hh = e * d2 / d1;
        return { text: `Mirror method: your eyes are <b>${e.toFixed(2)} m</b> up, you stand <b>${d1.toFixed(1)} m</b> from the mirror, and the mirror is <b>${f(d2, 1)} m</b> from a ${o}. How tall is the ${o}, to the nearest tenth?`, q: '',
          a: [`\\dfrac{h}{${f(d2, 1)}}=\\dfrac{${e.toFixed(2)}}{${d1.toFixed(1)}}`, `${d1.toFixed(1)}h=${f(d2, 1)}\\times${e.toFixed(2)}=${f(d2 * e, 3)}`, `h=${f(d2 * e, 3)}\\div${d1.toFixed(1)}\\approx${hh.toFixed(1)}\\text{ m}`] };
      },
      () => {
        const e = r.int(28, 35) * 0.05, hh = r.int(6, 15), d2 = r.int(16, 40) * 0.5, d = e * d2 / hh;
        return { text: `A mirror lies <b>${f(d2, 1)} m</b> from a wall that is <b>${hh} m</b> tall. Your eyes are <b>${e.toFixed(2)} m</b> up. How far from the mirror must you stand to see the top of the wall? Round to the nearest hundredth.`, q: '',
          a: [`\\dfrac{${hh}}{${f(d2, 1)}}=\\dfrac{${e.toFixed(2)}}{d}`, `${hh}d=${f(d2, 1)}\\times${e.toFixed(2)}=${f(d2 * e, 3)}`, `d=${f(d2 * e, 3)}\\div${hh}\\approx${d.toFixed(2)}\\text{ m}`] };
      },
      () => {
        const ft = r.int(5, 6), inch = r.pick([3, 6, 9]), p = ft + inch / 12, ps = r.int(4, 9), S = r.int(20, 60), hh = S * p / ps;
        return { text: `A student <b>${ft} ft ${inch} in</b> tall casts a <b>${ps} ft</b> shadow. At the same time, a silo’s shadow is <b>${S} ft</b>. How tall is the silo, to the nearest tenth of a foot?`, q: '',
          a: [`${ft}\\text{ ft }${inch}\\text{ in}=${f(p, 2)}\\text{ ft}`, `\\dfrac{h}{${S}}=\\dfrac{${f(p, 2)}}{${ps}}`, `${ps}h=${S}\\times${f(p, 2)}=${f(S * p, 2)}`, `h=${f(S * p, 2)}\\div${ps}\\approx${hh.toFixed(1)}\\text{ ft}`] };
      }
    ])()
  }
});
