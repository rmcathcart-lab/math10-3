/* Math 10-3 · Unit 7 · Lesson 5 — The Sine Ratio.
 * Explainers (Class view unless marked Full): labelling opp/adj/hyp from θ, with θ jumping from ∠A to ∠B (Example 1
 * check); similar right triangles with a live opp ÷ hyp column (Geo.similarRights; Example 2 check, any angle); sin θ as
 * opp over hyp, then a decimal (Example 3 checks); the sliding 10 m ladder with height and sin θ updating, draggable
 * (Example 4 check, sin 30° = 0.5, sin θ < 1); finding the opposite side (Example 5 checks, Kai's ladder in Example 6);
 * finding the hypotenuse (Example 7 checks, the Okotoks ramp in Example 8 with the 1 : 12 check); why multiply / divide
 * with a cover-up triangle (Full); word problems as moving scenes (boom lift, zipline: Example 9); spot the mistake with
 * stamps (Example 10); check by putting the answer back in (Full). Also the static figures and the Stand Up Break. */
import { h, add, tex, svgEl, tween, anim, drawIn, stamp, stampIn, pulse, checkCard, mountExplainers } from '../blocks.js';
import { Geo } from '../geo.js';
import { standup } from '../standup.js';

const RAD = Math.PI / 180;
const INK = '#1c2230', RED = '#c93a33', BLUE = '#1f5bd6', GREEN = '#12805a', AMBER = '#c27a0e', SLATE = '#3a4254', GREY = '#9aa0ab';
const OPP = Geo.ROLE_COLORS.opp, ADJ = Geo.ROLE_COLORS.adj, HYP = Geo.ROLE_COLORS.hyp;
const RC = { opp: OPP, adj: ADJ, hyp: HYP };
const T = (s) => tex(String(s));
const sinD = (d) => Math.sin(d * RAD), cosD = (d) => Math.cos(d * RAD);
/** the digits the calculator shows, cut (not rounded) to dp places: 6.71031… → "6.710" */
const cut = (v, dp = 3) => { const f = 10 ** dp; return (Math.floor(v * f + 1e-9) / f).toFixed(dp); };
const r1 = (v) => (Math.round(v * 10 + 1e-9) / 10).toFixed(1);
const r4 = (v) => (Math.round(v * 1e4 + 1e-9) / 1e4).toFixed(4);
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const pp = (el) => { el.style.transformBox = 'fill-box'; el.style.transformOrigin = 'center'; return el; };
const op = (c, el, to, ms = 350) => anim(c, el, [{ opacity: to }], ms);
const stageSvg = (stage, W, H) => add(stage, svgEl('svg', { class: 'u7l5-svg', width: W, height: H, viewBox: `0 0 ${W} ${H}` }), 0, 0);
/** an HTML label centred on (x, y): a 0×0 holder, so c.pop's scale doesn't undo the centring */
function lab(host, html, x, y, cls = '') { const hold = h('div', 'u7l5-hold'); hold.appendChild(h('div', 'u7l5-lab ' + cls, html)); add(host, hold, x, y); hold.inner = hold.firstChild; return hold; }
/** a work line, left edge at x, vertical centre at y */
function ln(host, html, x, y, cls = '') { const hold = h('div', 'u7l5-hold'); hold.appendChild(h('div', 'u7l5-ln ' + cls, html)); add(host, hold, x, y); hold.inner = hold.firstChild; return hold; }
function path(parent, d, o = {}) {
  return svgEl('path', { d, fill: o.fill || 'none', 'fill-opacity': o.fo ?? null, stroke: o.stroke === undefined ? INK : o.stroke, 'stroke-width': o.width || 3, 'stroke-linecap': o.cap || 'round', 'stroke-linejoin': 'round', 'stroke-dasharray': o.dash || null, class: o.cls === undefined ? 'bk-stroke' : o.cls, opacity: o.opacity ?? null }, parent);
}
const P2 = (p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1);
const segD = (a, b) => `M${P2(a)}L${P2(b)}`;
const txt = (parent, x, y, s, o = {}) => Geo.text(parent, x, y, s, Object.assign({ size: 20 }, o));
function rightMark(parent, V, dx, dy, s = 15, colr = INK) {   // the small square at V, legs along (dx, 0) and (0, dy) (±1)
  return path(parent, `M${P2([V[0] + dx * s, V[1]])}L${P2([V[0] + dx * s, V[1] + dy * s])}L${P2([V[0], V[1] + dy * s])}`, { width: 2.2, stroke: colr, cls: '' });
}
/** an angle arc at V from direction a1 sweeping (CCW, math degrees) span, with an optional label */
function arcLab(parent, V, a1, span, r, label, o = {}) {
  const g = svgEl('g', {}, parent);
  path(g, Geo.arcD(V, r, a1, span), { stroke: o.color || AMBER, width: 2.6, cls: '' });
  if (label) { const p = Geo.at(V, a1 + span / 2, o.lr || r + 18); txt(g, p[0], p[1], label, { size: o.size || 19, color: o.color || AMBER }); }
  return g;
}
/** ladder rails and rungs from foot F to top Tp */
function ladderD(F, Tp, w = 7, step = 26) {
  const dx = Tp[0] - F[0], dy = Tp[1] - F[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, nx = -uy * w, ny = ux * w;
  const rails = `M${P2([F[0] + nx, F[1] + ny])}L${P2([Tp[0] + nx, Tp[1] + ny])}M${P2([F[0] - nx, F[1] - ny])}L${P2([Tp[0] - nx, Tp[1] - ny])}`;
  let rungs = ''; for (let s = step * 0.7; s < L - 8; s += step) { const p = [F[0] + ux * s, F[1] + uy * s]; rungs += `M${P2([p[0] + nx, p[1] + ny])}L${P2([p[0] - nx, p[1] - ny])}`; }
  return { rails, rungs };
}
function ladder(parent) {
  const g = svgEl('g', { class: 'u7l5-ladder' }, parent);
  const rungs = path(g, '', { stroke: '#c9a46a', width: 4, cls: '' }), rails = path(g, '', { stroke: HYP, width: 5, cls: '' });
  return { g, set(F, Tp) { const d = ladderD(F, Tp); rails.setAttribute('d', d.rails); rungs.setAttribute('d', d.rungs); } };
}
/** a house wall with siding, from x to x + w, ground G up to top */
function wall(parent, x, w, G, top) {
  const g = svgEl('g', {}, parent);
  svgEl('rect', { x, y: top, width: w, height: G - top, fill: '#e7dcc8', stroke: '#8a6f4d', 'stroke-width': 2.5 }, g);
  let d = ''; for (let y = G - 22; y > top + 8; y -= 22) d += `M${x} ${y}L${x + w} ${y}`;
  path(g, d, { stroke: '#cdbd9f', width: 1.6, cls: '' });
  return g;
}
const ground = (parent, x0, x1, G) => { svgEl('rect', { x: x0, y: G, width: x1 - x0, height: 14, rx: 3, fill: '#b98a55', stroke: '#7a5124', 'stroke-width': 2.5 }, parent); };
/** colour a role's side of a Geo.rightTri and pop its tag */
async function markRole(c, R, role, hl = true) {
  R.side(R.roles()[role]).setAttribute('stroke', RC[role]);
  if (hl) await R.highlight(c, role);
  if (R.tags[role]) await c.pop(R.tags[role]);
}
const figBox = (host, W, H) => { host.style.width = W + 'px'; host.style.height = H + 'px'; return host; };
const figSvg = (host, W, H) => svgEl('svg', { class: 'geo-svg u7l5-svg', width: W, height: H, viewBox: `0 0 ${W} ${H}` }, figBox(host, W, H));

/* ======================================================================================
 * 1. Label the sides from θ (Example 1 check)
 * ====================================================================================== */
const LBL = {
  a: { tri: { right: 'bl', A: 38, c: 5, theta: 'A', names: false } },
  b: { tri: { right: 'bl', A: 34, c: 5, theta: 'B', names: false } },
  cd: { tri: { right: 'br', A: 37, c: 5, theta: 'A', thetaLabel: '', names: ['A', 'B', 'C'] } }
};
const labels = {
  title: 'Label the sides from the angle',
  height: 350,
  choices: [{ v: 'a', label: 'Example 1(a)' }, { v: 'b', label: '(b)' }, { v: 'cd', label: '(c) and (d)' }],
  ask: (v) => (v === 'cd' ? `Label each side opp, adj or hyp: first for ${T('\\angle A')}, then for ${T('\\angle B')}.` : `Label each side opp, adj or hyp for the marked angle ${T('\\theta')}.`),
  make(stage, v, ex) {
    const W = ex.W, H = 350, cd = v === 'cd', R = Geo.rightTri(stage, Object.assign({ x: 0, y: 0, width: 480, height: H, colors: false, size: 22, pad: 66 }, LBL[v].tri));
    hide(...Object.values(R.tags));
    const X = 510, th = cd ? T('\\angle A') : T('\\theta');
    const rows = [
      `<b>Step 1.</b> Across from the right angle: the <b class="u7l5-hyp">hyp</b> (the longest side).`,
      `<b>Step 2.</b> Across from ${th}: the <b class="u7l5-opp">opp</b>. It does not touch ${th}.`,
      `<b>Step 3.</b> The last side touches ${th}: the <b class="u7l5-adj">adj</b>.`
    ].map((s, i) => ln(stage, s, X, 50 + i * 70, 'u7l5-stepln'));
    rows.forEach((r) => { r.inner.style.width = (W - X - 10) + 'px'; });
    const on = (i) => rows[i].inner.classList.add('on');
    const steps = [
      { cap: `<b>Step 1.</b> Find the right angle. The side across from it is the <b>hyp</b>. It is always the longest side.`, run: async (c) => { on(0); await markRole(c, R, 'hyp'); } },
      { cap: `<b>Step 2.</b> Find ${th}. The side across from it is the <b>opp</b>. It does not touch ${th}.`, run: async (c) => { on(1); await markRole(c, R, 'opp'); } },
      { cap: `<b>Step 3.</b> The last side is the <b>adj</b>. It touches ${th}, and it is not the hyp.`, run: async (c) => { on(2); await markRole(c, R, 'adj'); } }
    ];
    if (cd) {
      const sw = hide(ln(stage, `<b>Now ${T('\\angle B')}:</b> the hyp stays. <b class="u7l5-opp">opp</b> and <b class="u7l5-adj">adj</b> <b>swap</b>.`, X, 270, 'u7l5-stepln on u7l5-swap'));
      sw.inner.style.width = (W - X - 10) + 'px';
      steps.push({ cap: `Now use ${T('\\angle B')}. The hyp does not change. <b>opp and adj swap</b>: ${T('BC')} is now adj and ${T('AC')} is now opp.`,
        run: async (c) => { R.clearHighlight(); await R.setTheta(c, 'B'); ['opp', 'adj', 'hyp'].forEach((r) => R.side(R.roles()[r]).setAttribute('stroke', RC[r])); await c.pop(sw); } });
    }
    return steps;
  }
};

/* ======================================================================================
 * 2. Similar right triangles: opp ÷ hyp (Example 2 check; any angle)
 * ====================================================================================== */
const similar = {
  title: 'Similar right triangles: divide opp by hyp',
  height: 350,
  choices: [{ v: 'ex2', label: 'Example 2 check' }, { v: 'any', label: 'Any angle' }],
  ask: (v) => (v === 'ex2' ? 'Raj’s three right triangles each have a 40° angle. Find opp ÷ hyp for each one.' : 'Does opp ÷ hyp stay the same in similar triangles for <b>other</b> angles too?'),
  make(stage, v, ex) {
    const W = ex.W, S = Geo.similarRights(stage, { x: 0, y: 0, width: 470, height: 340, theta: 40, sizes: [5, 7.5, 10], by: 'hyp', ratios: ['opp/hyp'], unit: 38, min: 10, max: 80, cls: 'u7l5-srt' });
    const st = hide(stamp(stage, 'all 0.64', { ok: true, x: W - 110, y: 300, size: 'sm' }));
    const grow = { cap: 'Three right triangles, each with a <b>40°</b> angle. They are <b>similar</b>: same shape, different sizes.', run: (c) => S.grow(c) };
    if (v === 'ex2') return [
      grow,
      { cap: `Divide <b>opp ÷ hyp</b> in each one: ${T('3.2\\div5.0')}, ${T('4.8\\div7.5')} and ${T('6.4\\div10.0')}.`, run: (c) => S.highlightCol(c, 'opp/hyp') },
      { cap: 'They all give <b>0.64</b>. The size of the triangle does not matter. Only the <b>angle</b> matters.', run: (c) => stampIn(c, st) },
      { cap: `This number has a name: the <b>sine</b> of 40°. ${T('\\sin40^\\circ\\approx0.64')}, and the calculator row agrees.`, run: async (c) => { await S.name(c, 'opp/hyp'); } }
    ];
    const go = (a, b) => (c) => tween(c, 1800, (t) => S.set(Math.round((a + (b - a) * t) * 10) / 10));
    return [
      grow,
      { cap: `Make the angle <b>25°</b>. The triangles change, but opp ÷ hyp is the <b>same in all three</b>: ${T('0.42')}.`, run: go(40, 25) },
      { cap: `Now <b>65°</b>: a new number, ${T('0.91')}, but again the same in all three.`, run: go(25, 65) },
      { cap: 'Every angle has its <b>own</b> opp ÷ hyp. That number is <b>sin θ</b>. Drag the slider to try any angle.', run: async (c) => { await S.name(c, 'opp/hyp'); } }
    ];
  }
};

/* ======================================================================================
 * 3. sin θ from a triangle: opp over hyp, then divide (Example 3 checks)
 * ====================================================================================== */
const SF = {
  a: { tri: { right: 'br', a: 5, b: 12, theta: 'A', names: false, sides: { a: '5', b: '12', c: '13' } }, o: '5', hh: '13', show: '0.384615…', r: '0.3846', nm: '\\sin\\theta', ang: 'θ' },
  b: { tri: { right: 'tl', a: 8.4, b: 6.3, theta: 'B', names: false, sides: { a: '8.4 m', b: '6.3 m', c: '10.5 m' } }, o: '6.3', hh: '10.5', show: '0.6', r: '0.6000', nm: '\\sin\\theta', ang: 'θ', exact: true },
  cA: { tri: { right: 'br', a: 7, b: 24, theta: 'A', thetaLabel: '', names: ['A', 'B', 'C'], sides: { a: '7', b: '24', c: '25' } }, o: '7', hh: '25', show: '0.28', r: '0.2800', nm: '\\sin A', ang: '∠A', exact: true },
  cB: { tri: { right: 'br', a: 7, b: 24, theta: 'B', thetaLabel: '', names: ['A', 'B', 'C'], sides: { a: '7', b: '24', c: '25' } }, o: '24', hh: '25', show: '0.96', r: '0.9600', nm: '\\sin B', ang: '∠B', exact: true }
};
const sinFrac = {
  title: 'sin θ from a triangle: opp over hyp',
  height: 330,
  choices: [{ v: 'a', label: 'Example 3(a)' }, { v: 'b', label: '(b)' }, { v: 'cA', label: `(c) ${T('\\sin A')}` }, { v: 'cB', label: `(c) ${T('\\sin B')}` }],
  ask: (v) => (v[0] === 'c' ? `Find ${T(SF[v].nm)} as a fraction, then as a decimal to 4 decimal places.` : `Write ${T('\\sin\\theta')} as a fraction, then as a decimal to 4 decimal places.`),
  make(stage, v, ex) {
    const W = ex.W, H = 330, m = SF[v];
    const R = Geo.rightTri(stage, Object.assign({ x: 0, y: 0, width: 500, height: H, colors: false, size: 21, pad: 62, show: ['opp', 'hyp'] }, m.tri));
    hide(...Object.values(R.tags));
    const X = 540, cO = `\\color{${OPP}}{${m.o}}`, cH = `\\color{${HYP}}{${m.hh}}`;
    const L1 = hide(ln(stage, T(`${m.nm}=\\dfrac{\\text{opp}}{\\text{hyp}}=\\dfrac{${cO}}{${cH}}`), X, 70, 'u7l5-big'));
    const L2 = hide(ln(stage, T(`${m.nm}=${m.o}\\div${m.hh}=${m.show.replace('…', '\\ldots')}`), X, 160));
    const L3 = hide(ln(stage, T(`${m.nm}\\approx${m.r}`), X, 225, 'u7l5-big u7l5-res'));
    const st = hide(stamp(stage, 'less than 1 ✓', { ok: true, x: X + 300, y: 292, size: 'sm' }));
    const ang = m.ang === 'θ' ? 'θ' : T(m.ang === '∠A' ? '\\angle A' : '\\angle B');
    return [
      { cap: `Label from ${ang}. Across from it: the <b>opp</b>, ${T(m.o)}. Across from the right angle: the <b>hyp</b>, ${T(m.hh)}.`,
        run: async (c) => { await markRole(c, R, 'opp'); await markRole(c, R, 'hyp'); } },
      { cap: 'Write the sine as a fraction: <b>opp over hyp</b>.', run: (c) => c.pop(L1) },
      { cap: m.exact ? `Divide: ${m.o} ÷ ${m.hh} = ${m.show}. To 4 decimal places: <b>${m.r}</b>.` : `Divide: ${m.o} ÷ ${m.hh} = ${m.show} Round to 4 decimal places: <b>${m.r}</b>.`,
        run: async (c) => { await c.pop(L2); await c.pop(L3); } },
      { cap: 'Check: the hyp is on the bottom, and it is the longest side, so the sine is <b>less than 1</b>.', run: (c) => stampIn(c, st) }
    ];
  }
};

/* ======================================================================================
 * 4. The sliding ladder: sin θ = height ÷ 10, live (Example 4 check; sin 30° = 0.5; never above 1). Draggable foot.
 * ====================================================================================== */
const LD = { L: 10, s: 33, wx: 470, G: 392, ww: 28 };
function ladderRig(stage, W, H, theta0, o = {}) {
  const svg = stageSvg(stage, 560, H), Lp = LD.L * LD.s, G = LD.G, wx = LD.wx;
  ground(svg, 20, 560, G);
  wall(svg, wx, LD.ww, G, G - Lp - 14);
  const half = pp(hide(svgEl('g', {}, svg)));
  path(half, segD([wx - 30, G - 5 * LD.s], [wx + LD.ww + 6, G - 5 * LD.s]), { stroke: SLATE, width: 2.2, dash: '7 6', cls: '' });
  txt(half, wx + LD.ww + 30, G - 5 * LD.s, '5 m', { size: 18, color: SLATE });
  const oppL = path(svg, '', { stroke: OPP, width: 7, cls: '' });
  rightMark(svg, [wx, G], -1, -1, 16);
  const lad = ladder(svg);
  const arcG = svgEl('g', {}, svg);
  const tH = txt(svg, 0, 0, 'hyp 10 m', { size: 19, color: HYP, anchor: 'end' });
  const tO = txt(svg, wx + LD.ww + 30, 0, 'opp', { size: 18, color: OPP, weight: 800 });
  const mid = pp(hide(svgEl('circle', { r: 6, fill: '#fff', stroke: HYP, 'stroke-width': 3 }, svg)));
  const knob = svgEl('circle', { r: 15, fill: '#fff', stroke: AMBER, 'stroke-width': 3.5, class: 'u7l5-knob', 'data-tap': '' }, svg);
  // the readout
  const rd = h('div', 'u7l5-rd'); add(stage, rd, 585, 8); rd.style.width = (W - 600) + 'px';
  rd.innerHTML = `<div class="u7l5-rd-a"><i>θ</i> = <b data-k="a"></b></div>
    <div><span class="u7l5-opp">height (opp)</span> = <b data-k="o"></b></div>
    <div><span class="u7l5-hyp">ladder (hyp)</span> = <b>10 m</b></div>
    <div class="u7l5-rd-s">sin <i>θ</i> = <span data-k="f"></span> = <b data-k="s"></b></div>
    <div class="u7l5-meter"><i data-k="m"></i><span>0</span><span>1 = the whole ladder</span></div>`;
  const K = {}; rd.querySelectorAll('[data-k]').forEach((e) => { K[e.dataset.k] = e; });
  let theta = theta0;
  function set(t) {
    theta = Math.max(0, Math.min(90, t));
    const F = [wx - Lp * cosD(theta), G], Tp = [wx, G - Lp * sinD(theta)], ht = LD.L * sinD(theta);
    lad.set(F, Tp); oppL.setAttribute('d', segD([wx + 3, G], [wx + 3, Tp[1]]));
    arcG.innerHTML = ''; if (theta > 1.5) arcLab(arcG, F, 0, theta, 46, 'θ', { lr: 64 });
    const M = [(F[0] + Tp[0]) / 2, (F[1] + Tp[1]) / 2], n = [-sinD(theta), -cosD(theta)];
    tH.setAttribute('x', (M[0] + n[0] * 24 - 2).toFixed(1)); tH.setAttribute('y', (M[1] + n[1] * 24).toFixed(1));
    tO.setAttribute('y', ((G + Tp[1]) / 2).toFixed(1)); tO.style.display = theta > 6 ? '' : 'none';
    mid.setAttribute('cx', M[0].toFixed(1)); mid.setAttribute('cy', M[1].toFixed(1));
    knob.setAttribute('cx', F[0].toFixed(1)); knob.setAttribute('cy', (G - 2).toFixed(1));
    const a = Math.round(theta * 10) / 10;
    K.a.textContent = (Number.isInteger(a) ? a : a.toFixed(1)) + '°'; K.o.textContent = ht.toFixed(3) + ' m';
    K.f.textContent = ht.toFixed(3) + ' ÷ 10'; K.s.textContent = sinD(theta).toFixed(4); K.m.style.width = (sinD(theta) * 100).toFixed(1) + '%';
  }
  set(theta0);
  // drag the foot along the floor
  let drag = null;
  knob.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); knob.setPointerCapture(e.pointerId); const M = svg.getScreenCTM().inverse(); drag = { M, x0: e.clientX, y0: e.clientY, F0: wx - Lp * cosD(theta) }; });
  knob.addEventListener('pointermove', (e) => {
    if (!drag) return; const k = Math.hypot(drag.M.a, drag.M.b) || 1, x = drag.F0 + (e.clientX - drag.x0) * k;
    set(Math.acos(Math.max(0, Math.min(1, (wx - x) / Lp))) / RAD);
  });
  const end = () => { drag = null; }; knob.addEventListener('pointerup', end); knob.addEventListener('pointercancel', end);
  return { set, get theta() { return theta; }, half, mid, rd, K, meter: rd.querySelector('.u7l5-meter') };
}
const EX4 = [5, 20, 30, 45, 70, 89];
const ladderEx = {
  title: 'The sliding ladder: sin θ = height ÷ 10',
  height: 410,
  choices: [{ v: 'slide', label: 'Slide the ladder' }, { v: 'ex4', label: 'Example 4 check' }, { v: 'half', label: `${T('\\sin30^\\circ=0.5')}` }],
  ask: (v) => (v === 'ex4' ? 'Example 4: find the sine of 5°, 20°, 30°, 45°, 70° and 89°. What happens as the angle gets bigger?' : v === 'half' ? `Why is ${T('\\sin30^\\circ=0.5')}? Use it to check answers in your head.` : 'A 10 m ladder leans on a wall. What happens to sin θ as the ladder gets steeper?'),
  make(stage, v, ex) {
    const W = ex.W, H = 410, t0 = v === 'slide' ? 20 : v === 'ex4' ? 5 : 60, Lr = ladderRig(stage, W, H, t0);
    const go = (a, b, ms = 1600) => (c) => tween(c, ms, (t) => Lr.set(a + (b - a) * t));
    const ht = (d) => (LD.L * sinD(d)).toFixed(3), s4 = (d) => sinD(d).toFixed(4);
    if (v === 'slide') {
      const st = hide(stamp(stage, 'always less than 1', { ok: true, x: 585 + (W - 600) / 2, y: 330, size: 'sm' }));
      return [
        { cap: 'The ladder is the <b>hyp</b>: 10 m. The height it reaches up the wall is the <b>opp</b>. So sin θ = height ÷ 10.', run: async (c) => { await pulse(c, Lr.rd, 1.04, 500); } },
        { cap: `Pull the foot out: the ladder lies almost flat. At 5° it reaches only ${ht(5)} m: ${T('\\sin5^\\circ\\approx' + s4(5))}.`, run: go(20, 5, 1300) },
        { cap: 'Push the foot toward the wall. As θ gets <b>bigger</b>, the ladder reaches <b>higher</b>, so sin θ gets <b>bigger</b>.', run: go(5, 60, 2600) },
        { cap: `At 80°: height ${ht(80)} m, so ${T('\\sin80^\\circ\\approx' + s4(80))}. Almost the whole ladder.`, run: go(60, 80, 1400) },
        { cap: `Straight up, 90°: the height <b>is</b> the ladder. ${T('\\sin90^\\circ=10\\div10=1')}.`, run: go(80, 90, 1000) },
        { cap: 'The height can never be more than the ladder. So for an acute angle, <b>sin θ is always less than 1</b>.', run: async (c) => { await pulse(c, Lr.meter, 1.06, 500); await stampIn(c, st); } }
      ];
    }
    if (v === 'ex4') {
      const tb = h('table', 'u7l5-rtb'); tb.innerHTML = '<tr><th><i>θ</i></th><th>sin <i>θ</i></th><th><i>θ</i></th><th>sin <i>θ</i></th></tr>' + [0, 1, 2].map((r) => `<tr><td>${EX4[r]}°</td><td></td><td>${EX4[r + 3]}°</td><td></td></tr>`).join('');
      add(stage, tb, 585, 248); tb.style.width = (W - 600) + 'px';
      const cells = EX4.map((d, i) => tb.rows[1 + (i % 3)].cells[i < 3 ? 1 : 3]);
      const steps = EX4.map((d, i) => ({
        cap: `θ = ${d}°: the ladder reaches ${ht(d)} m up the wall, so ${T(`\\sin${d}^\\circ${d === 30 ? '=' : '\\approx'}${s4(d)}`)}.`,
        run: async (c) => { if (i === 0) await pulse(c, Lr.rd, 1.04, 400); else await go(EX4[i - 1], d, 1100)(c); cells[i].textContent = s4(d); await c.pop(cells[i], 300); }
      }));
      steps.push({ cap: `(b) As the angle gets bigger, the sine gets <b>bigger</b>. (d) At 90° the height equals the ladder: ${T('\\sin90^\\circ=1')}.`, run: go(89, 90, 700) });
      return steps;
    }
    const st = hide(stamp(stage, 'half ✓', { ok: true, x: 400, y: 120, size: 'sm' }));
    return [
      { cap: 'Let the ladder down to <b>30°</b>. It reaches 5.000 m up the wall.', run: go(60, 30, 1500) },
      { cap: `5 m is <b>half</b> of the 10 m ladder. So ${T('\\sin30^\\circ=5\\div10=0.5')}: with a 30° angle, the opp is half the hyp.`, run: async (c) => { Lr.half.style.opacity = 1; await c.pop(Lr.half); Lr.mid.style.opacity = 1; await c.pop(Lr.mid); await stampIn(c, st); } },
      { cap: `A bit <b>less</b> than 30° (25°): the height is a bit less than half, ${ht(25)} m.`, run: async (c) => { await op(c, st, 0, 200); await go(30, 25, 1200)(c); } },
      { cap: `<b>More</b> than 30° (40°): the height is more than half, ${ht(40)} m. Use ${T('\\sin30^\\circ=0.5')} to check answers in your head.`, run: go(25, 40, 1400) }
    ];
  }
};

/* ======================================================================================
 * 5. Finding the opposite side (Example 5 checks; Kai's ladder, Example 6)
 * ====================================================================================== */
const FO = {
  a: { tri: { right: 'br', A: 34, c: 12, theta: 'A', thetaLabel: '34°', names: false, sides: { a: 'x', c: '12 cm' } }, ang: 34, hyp: '12', u: 'cm', side: 'a' },
  b: { tri: { right: 'tl', A: 29, c: 8.5, theta: 'B', thetaLabel: '61°', names: false, sides: { b: 'x', c: '8.5 m' } }, ang: 61, hyp: '8.5', u: 'm', side: 'b', note: ' A big angle faces a long side.' }
};
function kaiScene(svg, o = {}) {   // wall, gutter at 5.5 m, a 6.0 m ladder at θ; s px per m
  const s = o.s || 52, G = o.G || 380, wx = o.wx || 330, Lp = 6 * s;
  ground(svg, wx - Lp * 0.75, wx + 90, G);
  wall(svg, wx, 70, G, G - 6.3 * s);
  const gy = G - 5.5 * s;
  svgEl('rect', { x: wx - 2, y: gy - 9, width: 74, height: 12, rx: 3, fill: '#8f97a6', stroke: SLATE, 'stroke-width': 2 }, svg);
  txt(svg, wx + 78, gy - 3, 'gutter', { size: o.fs || 17, color: SLATE, anchor: 'start' });
  const oppL = path(svg, '', { stroke: OPP, width: 6, cls: '' });
  rightMark(svg, [wx, G], -1, -1, 15);
  const lad = ladder(svg), arcG = svgEl('g', {}, svg);
  const tH = txt(svg, 0, 0, '6.0 m', { size: o.fs || 19, color: HYP }), tO = txt(svg, wx + 92, 0, 'h', { size: (o.fs || 19) + 3, color: RED, italic: true });
  const api = { s, G, wx, gy, Lp, set(t) {
    const F = [wx - Lp * cosD(t), G], Tp = [wx, G - Lp * sinD(t)];
    lad.set(F, Tp); oppL.setAttribute('d', segD([wx + 3, G], [wx + 3, Tp[1]]));
    arcG.innerHTML = ''; arcLab(arcG, F, 0, t, 34, Math.round(t) + '°', { lr: 58, size: o.fs || 19 });
    const M = [(F[0] + Tp[0]) / 2, (F[1] + Tp[1]) / 2]; tH.setAttribute('x', (M[0] - 34).toFixed(1)); tH.setAttribute('y', (M[1] - 8).toFixed(1));
    tO.setAttribute('y', ((G + Tp[1]) / 2).toFixed(1)); api.top = Tp;
  } };
  if (o.hTag === false) tO.style.display = 'none';
  api.set(o.theta ?? 75);
  return api;
}
const findOpp = {
  title: 'Find the opposite side: multiply',
  height: 400,
  choices: [{ v: 'a', label: 'Example 5(a)' }, { v: 'b', label: '(b)' }, { v: 'kai', label: 'Example 6: Kai’s ladder' }],
  ask: (v) => (v === 'kai' ? 'Kai sets his 6.0 m ladder at 75°. Will it reach a gutter 5.5 m above the ground?' : `Find ${T('x')} to the nearest tenth.`),
  make(stage, v, ex) {
    const W = ex.W, H = 400, X = 530;
    if (v === 'kai') {
      const svg = stageSvg(stage, 500, H), K = kaiScene(svg, { theta: 40 });
      const tags = [pp(txt(svg, 0, 0, 'hyp', { size: 17, color: HYP, weight: 800 })), pp(txt(svg, K.wx + 92, (K.G + K.top[1]) / 2 + 28, 'opp', { size: 16, color: OPP, weight: 800 }))];
      hide(...tags);
      const L1 = hide(ln(stage, T(`\\sin75^\\circ=\\dfrac{h}{6.0}`), X, 70, 'u7l5-big'));
      const L2 = hide(ln(stage, T(`h=6.0\\times\\sin75^\\circ`), X, 150));
      const L3 = hide(ln(stage, T(`h=5.795\\ldots\\approx5.8\\text{ m}`), X, 210, 'u7l5-res'));
      const L4 = hide(ln(stage, T(`5.8\\text{ m}>5.5\\text{ m}`), X, 270));
      const br = pp(hide(svgEl('g', {}, svg)));
      const st = hide(stamp(stage, 'It reaches!', { ok: true, x: X + 290, y: 340, size: 'sm' }));
      return [
        { cap: 'Set the ladder at 75°. The ladder is the <b>hyp</b> (across from the right angle at the wall). The height <i>h</i> it reaches is the <b>opp</b>.',
          run: async (c) => { await tween(c, 1600, (t) => K.set(40 + 35 * t)); const M = [(K.wx - K.Lp * cosD(75) + K.wx) / 2, (K.G + K.top[1]) / 2]; tags[0].setAttribute('x', (M[0] - 40).toFixed(1)); tags[0].setAttribute('y', (M[1] - 32).toFixed(1)); tags[1].setAttribute('y', ((K.G + K.top[1]) / 2 + 28).toFixed(1)); for (const t of tags) { t.style.opacity = 1; await c.pop(t); } } },
        { cap: `Write the sine ratio: ${T('\\sin75^\\circ=\\dfrac{h}{6.0}')}.`, run: (c) => c.pop(L1) },
        { cap: `${T('h')} is on top, so <b>multiply</b> by 6.0. The calculator shows 5.795…, so <b>h ≈ 5.8 m</b>.`, run: async (c) => { await c.pop(L2); await c.pop(L3); } },
        { cap: 'Compare with the gutter: 5.8 m &gt; 5.5 m. <b>Yes</b>, the ladder reaches it, with about 0.3 m to spare.',
          run: async (c) => {
            const y1 = K.gy, y2 = K.top[1], x = K.wx - 26;
            br.innerHTML = ''; path(br, `M${x - 6} ${y1}L${x + 6} ${y1}M${x} ${y1}L${x} ${y2}M${x - 6} ${y2}L${x + 6} ${y2}`, { stroke: GREEN, width: 2.6, cls: '' });
            txt(br, x - 40, (y1 + y2) / 2, '0.3 m', { size: 17, color: GREEN });
            br.style.opacity = 1; await c.pop(br); await c.pop(L4); await stampIn(c, st);
          } }
      ];
    }
    const m = FO[v], x = m.hyp * 1 * sinD(m.ang), xs = cut(x), xr = r1(x);
    const R = Geo.rightTri(stage, Object.assign({ x: 0, y: 0, width: 440, height: H, colors: false, size: 22, pad: 70, show: ['opp', 'hyp'] }, m.tri));
    hide(...Object.values(R.tags));
    const L1 = hide(ln(stage, T(`\\sin${m.ang}^\\circ=\\dfrac{x}{${m.hyp}}`), X, 60, 'u7l5-big'));
    const k1 = hide(lab(stage, `×&#8239;${m.hyp} on both sides`, W - 120, 102, 'u7l5-mul'));
    const L2 = hide(ln(stage, T(`${m.hyp}\\times\\sin${m.ang}^\\circ=x`), X, 145));
    const L3 = hide(ln(stage, T(`x=${xs}\\ldots\\approx${xr}\\text{ ${m.u}}`), X, 215, 'u7l5-res'));
    const L4 = hide(ln(stage, `Check: ${T(`${xr}<${m.hyp}`)} ✓`, X, 280));
    const st = hide(stamp(stage, 'opp < hyp ✓', { ok: true, x: X + 300, y: 345, size: 'sm' }));
    return [
      { cap: `<b>Step 1.</b> Label from the ${m.ang}° angle. The side we want, ${T('x')}, is the <b>opp</b>. The ${m.hyp} ${m.u} side is the <b>hyp</b>.`,
        run: async (c) => { await markRole(c, R, 'opp'); await markRole(c, R, 'hyp'); } },
      { cap: '<b>Step 2.</b> Write the sine ratio and put in the numbers.', run: (c) => c.pop(L1) },
      { cap: `<b>Step 3.</b> ${T('x')} is on <b>top</b>, so <b>multiply</b> both sides by ${m.hyp}.`, run: async (c) => { await c.pop(k1); await c.pop(L2); } },
      { cap: `Calculator: ${m.hyp} × SIN ${m.ang} ) ENTER shows ${xs}… Round at the end: <b>x ≈ ${xr} ${m.u}</b>.`,
        run: async (c) => { await c.pop(L3); const t = R.valLabels[m.side]; R.tags.opp.style.opacity = 0; t.textContent = xr + ' ' + m.u; t.setAttribute('fill', OPP); await c.pop(t); } },
      { cap: `<b>Step 4.</b> Check: the opp (${xr}) is shorter than the hyp (${m.hyp}).${m.note || ''}`, run: async (c) => { await c.pop(L4); await stampIn(c, st); } }
    ];
  }
};

/* ======================================================================================
 * 6. Finding the hypotenuse (Example 7 checks; the Okotoks ramp, Example 8)
 * ====================================================================================== */
const FH = {
  a: { tri: { right: 'br', A: 27, c: 4.5 / sinD(27), theta: 'A', thetaLabel: '27°', names: false, sides: { a: '4.5 cm', c: 'h' } }, ang: 27, opp: '4.5', u: 'cm' },
  b: { tri: { right: 'tr', A: 52, c: 15 / sinD(52), rot: 52, theta: 'A', thetaLabel: '52°', names: false, sides: { a: '15 ft', c: 'h' } }, ang: 52, opp: '15', u: 'ft' }
};
function rampScene(svg, o = {}) {   // a ramp at 4.8° up to a door 0.45 m high; true scale s px per m
  const s = o.s || 80, G = o.G || 300, rise = 0.45 * s, run = (0.45 / Math.tan(4.8 * RAD)) * s, x1 = o.x1 || 470, x0 = x1 - run;
  ground(svg, x0 - 20, x1 + 50, G);
  const dh = o.door || 110;
  svgEl('rect', { x: x1, y: G - rise - dh - 24, width: 46, height: dh + 24 + rise, fill: '#e7dcc8', stroke: '#8a6f4d', 'stroke-width': 2.5 }, svg);
  svgEl('rect', { x: x1 + 6, y: G - rise - dh, width: 34, height: dh, rx: 3, fill: '#9a6a24', stroke: '#6e4a1c', 'stroke-width': 2 }, svg);
  txt(svg, x1 - 30, G - rise - dh + 10, 'door', { size: 16, color: SLATE });
  const landing = path(svg, segD([x1, G - rise], [x1 + 2, G - rise]), { stroke: INK, width: 3, cls: '' });
  const tri = path(svg, `M${P2([x0, G])}L${P2([x1, G])}L${P2([x1, G - rise])}Z`, { stroke: 'none', fill: '#f3efe6', cls: '' });
  const oppL = pp(path(svg, segD([x1 - 1, G], [x1 - 1, G - rise]), { stroke: OPP, width: 5, cls: '' }));
  const ramp = path(svg, segD([x0, G], [x1, G - rise]), { stroke: HYP, width: 6, cls: '' });
  arcLab(svg, [x0, G], 0, 4.8, 120, '', {});
  txt(svg, x0 + 112, G + 32, '4.8°', { size: 18, color: AMBER });
  txt(svg, x1 - 46, G - rise / 2 - 4, '0.45 m', { size: 17, color: OPP });
  const tR = pp(txt(svg, (x0 + x1) / 2, G - rise / 2 - 44, 'ramp, r', { size: 19, color: HYP }));
  void landing; void tri;
  return { s, G, x0, x1, rise, run, ramp, oppL, tR };
}
const findHyp = {
  title: 'Find the hypotenuse: divide',
  height: 400,
  choices: [{ v: 'a', label: 'Example 7(a)' }, { v: 'b', label: '(b)' }, { v: 'ramp', label: 'Example 8: the ramp' }],
  ask: (v) => (v === 'ramp' ? 'A ramp rises 0.45 m at an angle of 4.8°. How long is the ramp surface? Does it agree with the 1 : 12 rule?' : `Find the hypotenuse ${T('h')} to the nearest tenth.`),
  make(stage, v, ex) {
    const W = ex.W, H = 400, X = 550;
    if (v === 'ramp') {
      const r = 0.45 / sinD(4.8), svg = stageSvg(stage, W, 230), S = rampScene(svg, { s: 80, G: 180, x1: 520, door: 100 });
      S.ramp.style.opacity = 0;
      const blocks = pp(hide(svgEl('g', {}, svg)));
      for (let i = 0; i < 12; i++) {
        const d = 0.45 * S.s, ux = cosD(4.8), uy = -sinD(4.8), a = [S.x0 + ux * d * i, S.G + uy * d * i], b = [S.x0 + ux * d * (i + 1), S.G + uy * d * (i + 1)];
        path(blocks, segD([a[0] + uy * 13, a[1] - ux * 13], [b[0] + uy * 13, b[1] - ux * 13]), { stroke: i % 2 ? OPP : '#e08a83', width: 7, cap: 'butt', cls: '' });
      }
      const nb = hide(lab(stage, `12 pieces of 0.45 m laid along the ramp`, 440, 214, 'u7l5-note2'));
      const Y = 255;
      const L1 = hide(ln(stage, T(`\\sin4.8^\\circ=\\dfrac{0.45}{r}`), 30, Y + 10, 'u7l5-big'));
      const L2 = hide(ln(stage, T(`r=\\dfrac{0.45}{\\sin4.8^\\circ}=${cut(r)}\\ldots\\approx5.4\\text{ m}`), 30, Y + 90, 'u7l5-res'));
      const L3 = hide(ln(stage, `(b) ${T('0.45\\times12=5.4\\text{ m}')}`, X + 20, Y + 10, 'u7l5-big'));
      const st = hide(stamp(stage, 'It agrees!', { ok: true, x: X + 220, y: Y + 90, size: 'sm' }));
      return [
        { cap: 'The rise, 0.45 m, is across from the 4.8° angle: the <b>opp</b>. The ramp surface <i>r</i> is the <b>hyp</b>.', run: async (c) => { await pulse(c, S.oppL, 1.15, 500); await c.pop(S.tR); } },
        { cap: `${T('\\sin4.8^\\circ=\\dfrac{0.45}{r}')}. The unknown is on the <b>bottom</b>, so <b>divide</b>.`, run: (c) => c.pop(L1) },
        { cap: `0.45 ÷ SIN 4.8 ) ENTER shows ${cut(r)}… The ramp must be about <b>5.4 m</b> long.`, run: async (c) => { await c.pop(L2); S.ramp.style.opacity = 1; await drawIn(S.ramp, 900, c); } },
        { cap: '(b) The 1 : 12 rule: about 12 m of ramp for each 1 m of rise. Lay 12 copies of the 0.45 m rise along the ramp: 0.45 × 12 = <b>5.4 m</b>. It agrees!',
          run: async (c) => { blocks.style.opacity = 1; await c.pop(blocks, 500); await c.pop(nb); await c.pop(L3); await stampIn(c, st); } }
      ];
    }
    const m = FH[v], hv = m.opp / sinD(m.ang), hs = cut(hv), hr = r1(hv);
    const R = Geo.rightTri(stage, Object.assign({ x: 0, y: 0, width: 440, height: H, colors: false, size: 22, pad: 70, show: ['opp', 'hyp'] }, m.tri));
    hide(...Object.values(R.tags));
    const L1 = hide(ln(stage, T(`\\sin${m.ang}^\\circ=\\dfrac{${m.opp}}{h}`), X, 50, 'u7l5-big'));
    const L2 = hide(ln(stage, T(`h\\times\\sin${m.ang}^\\circ=${m.opp}`), X, 125));
    const L3 = hide(ln(stage, T(`h=\\dfrac{${m.opp}}{\\sin${m.ang}^\\circ}`), X, 195, 'u7l5-big'));
    const L4 = hide(ln(stage, T(`h=${hs}\\ldots\\approx${hr}\\text{ ${m.u}}`), X, 270, 'u7l5-res'));
    const st = hide(stamp(stage, 'hyp is longest ✓', { ok: true, x: X + 300, y: 345, size: 'sm' }));
    const cH = hide(lab(stage, '×&#8239;h on both sides', W - 120, 88, 'u7l5-mul'));
    const dS = hide(lab(stage, `÷&#8239;sin&#8239;${m.ang}° on both sides`, W - 120, 160, 'u7l5-mul'));
    return [
      { cap: `Label from the ${m.ang}° angle. ${m.opp} ${m.u} is across from it: the <b>opp</b>. The unknown ${T('h')} is across from the right angle: the <b>hyp</b>.`,
        run: async (c) => { await markRole(c, R, 'opp'); await markRole(c, R, 'hyp'); } },
      { cap: 'Write the sine ratio. This time the unknown is on the <b>bottom</b>.', run: (c) => c.pop(L1) },
      { cap: `Multiply both sides by ${T('h')} to bring it up.`, run: async (c) => { await c.pop(cH); await c.pop(L2); } },
      { cap: `Then <b>divide</b> both sides by ${T(`\\sin${m.ang}^\\circ`)}.`, run: async (c) => { await c.pop(dS); await c.pop(L3); } },
      { cap: `Calculator: ${m.opp} ÷ SIN ${m.ang} ) ENTER shows ${hs}… So <b>h ≈ ${hr} ${m.u}</b>. Check: ${hr} &gt; ${m.opp}, the hyp is the longest side.`,
        run: async (c) => { await c.pop(L4); const t = R.valLabels.c; R.tags.hyp.style.opacity = 0; t.textContent = hr + ' ' + m.u; t.setAttribute('fill', HYP); await c.pop(t); await stampIn(c, st); } }
    ];
  }
};

/* ======================================================================================
 * 7. Why multiply on top and divide on the bottom: a cover-up triangle (Full)
 * ====================================================================================== */
const why = {
  title: 'A cover-up triangle for the sine ratio',
  height: 360,
  ask: `Why is it ${T('\\text{opp}=\\text{hyp}\\times\\sin\\theta')} but ${T('\\text{hyp}=\\text{opp}\\div\\sin\\theta')}?`,
  make(stage, v, ex) {
    const W = ex.W, H = 360, svg = stageSvg(stage, W, H);
    const tri = (cx, cy, w, hh, top, bl, br, o = {}) => {
      const g = svgEl('g', {}, svg), A = [cx, cy - hh / 2], B = [cx - w / 2, cy + hh / 2], C = [cx + w / 2, cy + hh / 2], my = cy + hh * 0.08;
      path(g, `M${P2(A)}L${P2(B)}L${P2(C)}Z`, { stroke: o.color || SLATE, width: 3, fill: '#fffaf1', cls: '' });
      path(g, segD([cx - w * 0.29, my], [cx + w * 0.29, my]), { stroke: o.color || SLATE, width: 2.5, cls: '' });
      path(g, segD([cx, my], [cx, cy + hh / 2]), { stroke: o.color || SLATE, width: 2.5, cls: '' });
      const tT = lab(stage, top, cx, cy - hh * 0.12, 'u7l5-ct'), tL = lab(stage, bl, cx - w * 0.2, cy + hh * 0.3, 'u7l5-ct'), tR = lab(stage, br, cx + w * 0.2, cy + hh * 0.3, 'u7l5-ct');
      return { g, tT, tL, tR, all: [g, tT, tL, tR], my, cx, cy, w, hh };
    };
    const A = tri(170, 150, 230, 190, T('6'), T('3'), T('2'));
    hide(...A.all);
    const fa = [hide(ln(stage, T('3=6\\div2'), 40, 290)), hide(ln(stage, T('6=3\\times2'), 165, 290)), hide(ln(stage, T('2=6\\div3'), 290, 290))];
    const B = tri(W - 300, 150, 300, 220, `<span class="u7l5-opp">${T('\\text{opp}')}</span>`, `<span class="u7l5-hyp">${T('\\text{hyp}')}</span>`, T('\\sin\\theta'), { color: HYP });
    hide(...B.all);
    const cover = (x, y, w, hh) => { const r = hide(svgEl('rect', { x: x - w / 2, y: y - hh / 2, width: w, height: hh, rx: 12, fill: '#6e4a1c', opacity: 0 }, svg)); return r; };
    const cT = cover(B.cx, B.cy - 220 * 0.12, 110, 46), cL = cover(B.cx - 60, B.cy + 220 * 0.3, 90, 46);
    const f1 = hide(ln(stage, T('\\text{opp}=\\text{hyp}\\times\\sin\\theta'), W - 470, 300, 'u7l5-res'));
    const f2 = hide(ln(stage, T('\\text{hyp}=\\dfrac{\\text{opp}}{\\sin\\theta}'), W - 470, 300, 'u7l5-res'));
    const chk = hide(ln(stage, T('10\\times0.5=5\\qquad 5\\div0.5=10'), W - 470, 300, 'u7l5-res'));
    const show = async (c, els) => { for (const e of els) { e.style.opacity = 1; await c.pop(e, 300); } };
    return [
      { cap: `Numbers first. ${T('3=6\\div2')} is one fact. Turn it around: ${T('6=3\\times2')} and ${T('2=6\\div3')}. A triangle holds all three.`, run: async (c) => { await show(c, A.all); for (const e of fa) await c.pop(e); } },
      { cap: `${T('\\sin\\theta=\\text{opp}\\div\\text{hyp}')} is a fact like that. Put the opp on top. The hyp and ${T('\\sin\\theta')} go underneath.`, run: (c) => show(c, B.all) },
      { cap: 'Want the <b>opp</b>? Cover it. What is left is hyp beside sin θ: <b>multiply</b>.', run: async (c) => { await anim(c, cT, [{ opacity: 0 }, { opacity: 0.85 }], 400); await c.pop(f1); } },
      { cap: 'Want the <b>hyp</b>? Cover it. What is left is opp over sin θ: <b>divide</b>.', run: async (c) => { await anim(c, cT, [{ opacity: 0.85 }, { opacity: 0 }], 300); await op(c, f1, 0, 200); await anim(c, cL, [{ opacity: 0 }, { opacity: 0.85 }], 400); await c.pop(f2); } },
      { cap: `Check with the 10 m ladder at 30° (${T('\\sin30^\\circ=0.5')}): opp = 10 × 0.5 = 5, and hyp = 5 ÷ 0.5 = 10. ✓`, run: async (c) => { await anim(c, cL, [{ opacity: 0.85 }, { opacity: 0 }], 300); await op(c, f2, 0, 200); await c.pop(chk); } }
    ];
  }
};

/* ======================================================================================
 * 8. Word problems as scenes: the boom lift and the zipline (Example 9)
 * ====================================================================================== */
function boomScene(svg, o = {}) {   // pivot 1.4 m up, a 9.5 m arm at θ, bucket at the end; s px per m
  const s = o.s || 30, G = o.G || 380, px = o.px || 90, fs = o.fs || 19, pv = [px, G - 1.4 * s], L = 9.5 * s;
  ground(svg, px - 130, px + 9.5 * s * 0.62 + 100, G);
  svgEl('rect', { x: px - 58, y: G - 0.7 * s - 14, width: 116, height: 0.7 * s + 2, rx: 6, fill: '#f2c14e', stroke: '#8a6a12', 'stroke-width': 2.5 }, svg);
  [px - 34, px + 34].forEach((x) => svgEl('circle', { cx: x, cy: G - 8, r: 11, fill: INK }, svg));
  path(svg, segD([px, G - 0.7 * s - 12], pv), { stroke: '#8a6a12', width: 9, cls: '' });
  const dash = svgEl('g', {}, svg), arm = path(svg, '', { stroke: '#e0841a', width: 9, cls: '' }), bucket = svgEl('rect', { width: 34, height: 26, rx: 4, fill: '#e0841a', stroke: '#8a4a0a', 'stroke-width': 2.5 }, svg);
  const head = svgEl('circle', { r: 7, fill: '#f6d8b8', stroke: INK, 'stroke-width': 2 }, svg);
  svgEl('circle', { cx: pv[0], cy: pv[1], r: 6, fill: INK }, svg);
  const arcG = svgEl('g', {}, svg), labs = svgEl('g', {}, svg);
  const api = { s, G, pv, L, set(t, show = {}) {
    const E = [pv[0] + L * cosD(t), pv[1] - L * sinD(t)];
    arm.setAttribute('d', segD(pv, E));
    bucket.setAttribute('x', (E[0] - 10).toFixed(1)); bucket.setAttribute('y', (E[1] - 22).toFixed(1));
    head.setAttribute('cx', (E[0] + 7).toFixed(1)); head.setAttribute('cy', (E[1] - 30).toFixed(1));
    arcG.innerHTML = ''; arcLab(arcG, pv, 0, t, 40, Math.round(t) + '°', { lr: 62, size: fs });
    dash.innerHTML = ''; labs.innerHTML = '';
    if (show.tri) {
      path(dash, segD(pv, [E[0], pv[1]]), { stroke: SLATE, width: 2.4, dash: '8 6', cls: '' });
      path(dash, segD([E[0], pv[1]], E), { stroke: OPP, width: 4, dash: '8 6', cls: '' });
      rightMark(dash, [E[0], pv[1]], -1, -1, 13);
      txt(labs, E[0] + 22, (pv[1] + E[1]) / 2, 'x', { size: fs + 3, color: RED, italic: true });
    }
    if (show.base) { path(dash, segD([E[0], pv[1]], [E[0], G]), { stroke: GREEN, width: 4, dash: '4 5', cls: '' }); txt(labs, E[0] + 34, (pv[1] + G) / 2, '1.4 m', { size: fs - 1, color: GREEN }); }
    const M = [(pv[0] + E[0]) / 2, (pv[1] + E[1]) / 2]; txt(labs, M[0] - 40, M[1] - 6, '9.5 m', { size: fs, color: HYP });
    const dx = pv[0] - 78; path(labs, `M${dx - 6} ${G}L${dx + 6} ${G}M${dx} ${G}L${dx} ${pv[1]}M${dx - 6} ${pv[1]}L${dx + 6} ${pv[1]}`, { stroke: SLATE, width: 2, cls: '' });
    path(labs, segD([dx + 6, pv[1]], [pv[0] - 8, pv[1]]), { stroke: SLATE, width: 1.4, dash: '3 4', cls: '' });
    txt(labs, dx - 8, (pv[1] + G) / 2, '1.4 m', { size: fs - 2, color: SLATE, anchor: 'end' });
    api.E = E;
  } };
  api.set(o.theta ?? 62, o.show || { tri: true });
  return api;
}
function zipScene(svg, o = {}) {   // start platform, end platform 18 m lower, cable at 7° (true scale); s px per m
  const s = o.s || 2.6, x0 = o.x0 || 60, fs = o.fs || 18, run = 18 / Math.tan(7 * RAD) * s, G = o.G || 220, yS = G - 40 * s, yE = yS + 18 * s, x1 = x0 + run;
  ground(svg, x0 - 40, x1 + 40, G);
  const tower = (x, y) => { path(svg, `M${x - 10} ${G}L${x - 6} ${y}M${x + 10} ${G}L${x + 6} ${y}M${x - 8} ${(G + y) / 2}L${x + 8} ${(G + y) / 2}`, { stroke: '#7a5124', width: 3.4, cls: '' }); svgEl('rect', { x: x - 18, y: y - 5, width: 36, height: 7, rx: 2, fill: '#9a6a24' }, svg); };
  tower(x0, yS); tower(x1, yE);
  const cable = pp(path(svg, segD([x0, yS], [x1, yE]), { stroke: INK, width: 2.6, cls: '' }));
  const dash = svgEl('g', {}, svg);
  path(dash, segD([x0, yS], [x1, yS]), { stroke: SLATE, width: 2.2, dash: '8 6', cls: '' });
  path(dash, segD([x1, yS], [x1, yE]), { stroke: OPP, width: 4, dash: '7 5', cls: '' });
  rightMark(dash, [x1, yS], -1, 1, 11);
  txt(dash, x1 + 34, (yS + yE) / 2, '18 m', { size: fs, color: OPP });
  path(dash, Geo.arcD([x0, yS], 110, -7, 7), { stroke: AMBER, width: 2.4, cls: '' });
  txt(dash, x0 + 150, yS + 9, '7°', { size: fs, color: AMBER });
  const cl = pp(txt(svg, (x0 + x1) / 2, (yS + yE) / 2 + 26, o.cableLabel || 'cable, c', { size: fs, color: HYP }));
  const rider = svgEl('g', {}, svg);
  path(rider, 'M0 0L0 16', { stroke: SLATE, width: 2, cls: '' }); svgEl('circle', { cx: 0, cy: 22, r: 6, fill: '#f6d8b8', stroke: INK, 'stroke-width': 2 }, rider);
  path(rider, 'M0 28L0 42M-8 34L8 34M0 42L-6 52M0 42L6 52', { stroke: '#1f5bd6', width: 3, cls: '' });
  const api = { x0, x1, yS, yE, cable, cl, rider, at(t) { const x = x0 + (x1 - x0) * t, y = yS + (yE - yS) * t; rider.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`); } };
  api.at(o.t ?? 0.08);
  return api;
}
const scenes = {
  title: 'Sketch the right triangle, then solve',
  height: 400,
  choices: [{ v: 'boom', label: 'Example 9(a): boom lift' }, { v: 'zip', label: '9(b): zipline' }],
  ask: (v) => (v === 'boom' ? 'A 9.5 m boom-lift arm turns on a pivot 1.4 m above the ground and is raised to 62°. How high is the bucket?' : 'A zipline cable drops 18 m at an angle of 7° with the horizontal. How long is the cable?'),
  make(stage, v, ex) {
    const W = ex.W, H = 400, X = 520;
    if (v === 'boom') {
      const svg = stageSvg(stage, 500, H), B = boomScene(svg, { s: 32, G: 380, px: 150, theta: 8, show: {} });
      const x = 9.5 * sinD(62);
      const L1 = hide(ln(stage, T(`\\sin62^\\circ=\\dfrac{x}{9.5}`), X, 60, 'u7l5-big'));
      const L2 = hide(ln(stage, T(`x=9.5\\times\\sin62^\\circ=${cut(x)}\\ldots\\text{ m}`), X, 140));
      const L3 = hide(ln(stage, T(`${cut(x)}\\ldots+1.4=${cut(x + 1.4)}\\ldots`), X, 210));
      const L4 = hide(ln(stage, T(`\\approx${r1(x + 1.4)}\\text{ m above the ground}`), X, 270, 'u7l5-res'));
      return [
        { cap: 'The arm rises to 62°. The arm is the <b>hyp</b>. The height of the bucket <b>above the pivot</b> is the <b>opp</b>.', run: async (c) => { await tween(c, 1800, (t) => B.set(8 + 54 * t)); B.set(62, { tri: true }); await sleep2(c); } },
        { cap: `Write the sine ratio: ${T('\\sin62^\\circ=\\dfrac{x}{9.5}')}.`, run: (c) => c.pop(L1) },
        { cap: `${T('x')} is on top: <b>multiply</b>. ${T('x=9.5\\times\\sin62^\\circ')} = ${cut(x)}… m above the pivot.`, run: (c) => c.pop(L2) },
        { cap: `The pivot is 1.4 m off the ground. <b>Add it</b>, and keep the full value: ${cut(x)}… + 1.4 = ${cut(x + 1.4)}…`, run: async (c) => { B.set(62, { tri: true, base: true }); await c.pop(L3); } },
        { cap: `Round only at the end: the bucket is about <b>${r1(x + 1.4)} m</b> above the ground.`, run: (c) => c.pop(L4) }
      ];
    }
    const svg = stageSvg(stage, W, 240), Z = zipScene(svg, { s: 3.3, x0: 70, G: 225, cableLabel: 'cable, c' });
    const cv = 18 / sinD(7);
    const L1 = hide(ln(stage, T(`\\sin7^\\circ=\\dfrac{18}{c}`), 40, 310, 'u7l5-big'));
    const L2 = hide(ln(stage, T(`c=\\dfrac{18}{\\sin7^\\circ}=${cut(cv)}\\ldots\\approx${r1(cv)}\\text{ m}`), 330, 310, 'u7l5-big u7l5-res'));
    return [
      { cap: 'The drop, 18 m, is across from the 7° angle: the <b>opp</b>. The cable <i>c</i> is the <b>hyp</b>. (This picture is to scale. 7° is not very steep!)', run: async (c) => { await pulse(c, Z.cable, 1.02, 500); await c.pop(Z.cl); } },
      { cap: `Write the sine ratio: ${T('\\sin7^\\circ=\\dfrac{18}{c}')}. The unknown is on the <b>bottom</b>, so <b>divide</b>.`, run: (c) => c.pop(L1) },
      { cap: `18 ÷ SIN 7 ) ENTER shows ${cut(cv)}… The cable is about <b>${r1(cv)} m</b> long. Wheee!`, run: async (c) => { await c.pop(L2); await tween(c, 2600, (t) => Z.at(0.08 + 0.8 * t)); } }
    ];
  }
};
const sleep2 = (c) => c.sleep(250);

/* ======================================================================================
 * 9. Spot the mistake (Example 10): stamps
 * ====================================================================================== */
const mistakes = {
  title: 'Spot the mistake: is the answer reasonable?',
  height: 380,
  choices: [{ v: 'a', label: '(a) Mia' }, { v: 'b', label: '(b) Theo' }, { v: 'c', label: '(c) Zoe' }],
  ask: (v) => ({ a: `Mia: opp ${T('=9')}, hyp ${T('=14')}, so ${T('\\sin\\theta=\\frac{14}{9}\\approx1.56')}.`, b: `Theo: opp ${T('=6')} m and a 35° angle, so hyp ${T('=6\\times\\sin35^\\circ\\approx3.4')} m.`, c: `Zoe: opp ${T('=10\\times\\sin50^\\circ')}, and her calculator shows ${T('-2.6')}.` })[v],
  make(stage, v, ex) {
    const W = ex.W, H = 380, X = 540;
    if (v === 'a') {
      const R = Geo.rightTri(stage, { x: 0, y: 0, width: 500, height: H, a: 9, c: 14, right: 'br', theta: 'A', names: false, sides: { a: '9', c: '14' }, size: 22, pad: 66, show: ['opp', 'hyp'] });
      const card = hide(ln(stage, `<span class="u7l5-who">Mia</span> ${T('\\sin\\theta=\\dfrac{14}{9}\\approx1.56')}`, X, 70, 'u7l5-card'));
      const no = hide(stamp(stage, 'more than 1!', { ok: false, x: X + 330, y: 130, size: 'sm' }));
      const fix = hide(ln(stage, T('\\sin\\theta=\\dfrac{\\color{' + OPP + '}{9}}{\\color{' + HYP + '}{14}}\\approx0.6429'), X, 240, 'u7l5-big u7l5-res'));
      const ok = hide(stamp(stage, 'fixed ✓', { ok: true, x: X + 330, y: 300, size: 'sm' }));
      return [
        { cap: `Mia’s work: ${T('\\sin\\theta=\\frac{14}{9}\\approx1.56')}.`, run: (c) => c.pop(card) },
        { cap: 'A sine can <b>never</b> be more than 1: the hyp is the longest side, and it goes on the bottom.', run: (c) => stampIn(c, no) },
        { cap: `She put the hyp on top. Fix it: opp over hyp, ${T('\\sin\\theta=\\frac{9}{14}\\approx0.6429')}.`, run: async (c) => { await c.pop(fix); await stampIn(c, ok); } }
      ];
    }
    if (v === 'b') {
      const svg = stageSvg(stage, 520, H), s = 30, A = [40, 350], Cc = [40 + 6 / Math.tan(35 * RAD) * s, 350], Bt = [Cc[0], 350 - 6 * s];
      path(svg, `M${P2(A)}L${P2(Cc)}L${P2(Bt)}`, { stroke: INK, width: 3.2, cls: '' });
      path(svg, segD(Cc, Bt), { stroke: OPP, width: 4.5, cls: '' });
      rightMark(svg, Cc, -1, -1, 15);
      arcLab(svg, A, 0, 35, 46, '35°', { lr: 70 });
      txt(svg, Cc[0] + 34, (Cc[1] + Bt[1]) / 2, '6 m', { size: 21, color: OPP });
      txt(svg, Cc[0] + 34, (Cc[1] + Bt[1]) / 2 + 26, 'opp', { size: 16, color: OPP, weight: 800 });
      const len = (m) => [A[0] + m * s * cosD(35), A[1] - m * s * sinD(35)];
      const stick = path(svg, segD(A, A), { stroke: RED, width: 5, dash: '9 6', cls: '' });
      const sl = hide(txt(svg, 0, 0, '3.4 m?', { size: 20, color: RED }));
      const card = hide(ln(stage, `<span class="u7l5-who">Theo</span> hyp ${T('=6\\times\\sin35^\\circ\\approx3.4')} m`, X, 60, 'u7l5-card'));
      const no = hide(stamp(stage, 'can’t reach!', { ok: false, x: X + 300, y: 125, size: 'sm' }));
      const fix = hide(ln(stage, T('\\sin35^\\circ=\\dfrac{6}{\\text{hyp}}'), X, 210, 'u7l5-res'));
      const fix2 = hide(ln(stage, T('\\text{hyp}=\\dfrac{6}{\\sin35^\\circ}\\approx10.5\\text{ m}'), X, 290, 'u7l5-res'));
      const ok = hide(stamp(stage, 'fixed ✓', { ok: true, x: W - 90, y: 350, size: 'sm' }));
      const grow = (c, a, b, ms) => tween(c, ms, (t) => { const E = len(a + (b - a) * t); stick.setAttribute('d', segD(A, E)); sl.setAttribute('x', (E[0] - 30).toFixed(1)); sl.setAttribute('y', (E[1] - 22).toFixed(1)); });
      return [
        { cap: `Theo’s work: hyp ${T('=6\\times\\sin35^\\circ\\approx3.4')} m.`, run: (c) => c.pop(card) },
        { cap: 'Try it: a 3.4 m hyp is <b>shorter than the 6 m opp</b>. It can’t reach the top! The hyp must be the longest side.', run: async (c) => { sl.style.opacity = 1; await grow(c, 0, 3.4, 1100); await stampIn(c, no); } },
        { cap: `The unknown hyp is on the <b>bottom</b>: ${T('\\sin35^\\circ=\\frac{6}{\\text{hyp}}')}, so <b>divide</b>. hyp = 6 ÷ sin 35° ≈ <b>10.5 m</b>, and now it reaches.`,
          run: async (c) => { sl.textContent = '10.5 m'; await grow(c, 3.4, 6 / sinD(35), 1300); stick.setAttribute('stroke', HYP); stick.removeAttribute('stroke-dasharray'); sl.setAttribute('fill', HYP); await c.pop(fix); await c.pop(fix2); await stampIn(c, ok); } }
      ];
    }
    // (c) the calculator screen in RAD, then DEG
    const scr = h('div', 'u7l5-lcd'); scr.innerHTML = `<div class="u7l5-lcd-m"><span data-k="mode">RAD</span></div><div class="u7l5-lcd-1">10×sin(50)</div><div class="u7l5-lcd-2" data-k="out">−2.623748537</div>`;
    add(stage, scr, 40, 40);
    const mode = scr.querySelector('[data-k="mode"]'), out = scr.querySelector('[data-k="out"]');
    hide(scr);
    const no = hide(stamp(stage, 'negative length?', { ok: false, x: 280, y: 280, size: 'sm' }));
    const L1 = hide(ln(stage, `<b>DRG</b> → choose <b>DEG</b> → <b>ENTER</b>`, X, 110));
    const L2 = hide(ln(stage, T('10\\times\\sin50^\\circ=7.660\\ldots\\approx7.7'), X, 190, 'u7l5-big u7l5-res'));
    const ok = hide(stamp(stage, 'fixed ✓', { ok: true, x: X + 260, y: 280, size: 'sm' }));
    return [
      { cap: `Zoe’s work: opp ${T('=10\\times\\sin50^\\circ')}. Her calculator shows −2.623748537.`, run: (c) => c.pop(scr) },
      { cap: 'A length can’t be <b>negative</b>. Look at the top of the screen: <b>RAD</b>. Her calculator was in radian mode, not degree mode.', run: async (c) => { mode.classList.add('u7l5-bad'); await pulse(c, mode, 1.5, 600); await stampIn(c, no); } },
      { cap: 'Press DRG, choose DEG, press ENTER, and do it again: 10 × sin 50° = 7.660… ≈ <b>7.7</b>.',
        run: async (c) => { await c.pop(L1); await op(c, no, 0, 200); mode.textContent = 'DEG'; mode.classList.remove('u7l5-bad'); out.textContent = '7.660444431'; await pulse(c, out, 1.2, 500); await c.pop(L2); await stampIn(c, ok); } }
    ];
  }
};

/* ======================================================================================
 * 10. Check a side: put it back into the ratio (Full)
 * ====================================================================================== */
const check = {
  title: 'Check: does opp ÷ hyp give the sine back?',
  height: 300,
  choices: [{ v: 'a', label: 'Example 5(a)' }, { v: 'h', label: 'Example 7(a)' }],
  ask: (v) => (v === 'a' ? `Example 5(a): ${T('x=6.710\\ldots')} cm with hyp 12 cm and a 34° angle. Check it.` : `Example 7(a): ${T('h=9.912\\ldots')} cm with opp 4.5 cm and a 27° angle. Check it.`),
  make(stage, v, ex) {
    const W = ex.W, x = 12 * sinD(34), hh = 4.5 / sinD(27);
    const k = v === 'a'
      ? checkCard(stage, { title: 'Put it back in', left: ['x\\div12', '6.710\\ldots\\div12', r4(x / 12)], right: ['\\sin34^\\circ', r4(sinD(34))], ok: true, x: 40, y: 20, width: 560, hidden: true })
      : checkCard(stage, { title: 'Put it back in', left: ['4.5\\div h', '4.5\\div9.912\\ldots', r4(4.5 / hh)], right: ['\\sin27^\\circ', r4(sinD(27))], ok: true, x: 40, y: 20, width: 560, hidden: true });
    const note = hide(ln(stage, v === 'a' ? `With the rounded 6.7: ${T('6.7\\div12=0.5583')}, close (the small gap is rounding).` : `With the rounded 9.9: ${T('4.5\\div9.9=0.4545')}, close (the small gap is rounding).`, 640, 120, 'u7l5-note3'));
    note.inner.style.width = (W - 660) + 'px'; note.inner.style.whiteSpace = 'normal';
    return [
      { cap: v === 'a' ? `Divide the opp by the hyp, using your answer: ${T('6.710\\ldots\\div12')}. Then find ${T('\\sin34^\\circ')}.` : `Divide the opp by your hyp: ${T('4.5\\div9.912\\ldots')}. Then find ${T('\\sin27^\\circ')}.`, run: (c) => k.play(c) },
      { cap: `Both sides match (${v === 'a' ? '0.5592' : '0.4540'}), so the answer is right.`, run: (c) => c.pop(note) }
    ];
  }
};

mountExplainers({ labels, similar, sinFrac, ladder: ladderEx, findOpp, findHyp, why, scenes, mistakes, check });

/* ======================================================================================
 * Static figures on the example cards
 * ====================================================================================== */
const triFig = (W, Hh, o, after) => (host) => { figBox(host, W, Hh); const R = Geo.rightTri(host, Object.assign({ width: W, height: Hh, colors: false, size: 18, pad: 44, show: [] }, o)); if (after) after(R); };
const hideTags = (R) => { R.layers.tags.classList.add('u7l5-fa'); };
const FIG = {
  ex1a: triFig(196, 180, Object.assign({ show: ['opp', 'adj', 'hyp'] }, LBL.a.tri), hideTags),
  ex1b: triFig(196, 180, Object.assign({ show: ['opp', 'adj', 'hyp'] }, LBL.b.tri), hideTags),
  ex1c: triFig(196, 180, Object.assign({ show: ['opp', 'adj', 'hyp'], size: 18 }, LBL.cd.tri), hideTags),
  ex1d: triFig(196, 180, Object.assign({ show: ['opp', 'adj', 'hyp'] }, LBL.cd.tri, { theta: 'B' }), hideTags),
  ex2s: triFig(300, 255, { right: 'br', A: 40, c: 5, theta: 'A', thetaLabel: '40°', names: false, unit: 26, sides: { a: '3.2', b: '3.8', c: '5.0' } }),
  ex2m: triFig(300, 255, { right: 'br', A: 40, c: 7.5, theta: 'A', thetaLabel: '40°', names: false, unit: 26, sides: { a: '4.8', b: '5.7', c: '7.5' } }),
  ex2l: triFig(300, 255, { right: 'br', A: 40, c: 10, theta: 'A', thetaLabel: '40°', names: false, unit: 26, sides: { a: '6.4', b: '7.7', c: '10.0' } }),
  ex3a: triFig(290, 190, SF.a.tri), ex3b: triFig(290, 210, SF.b.tri),
  ex3c: triFig(290, 170, { right: 'br', a: 7, b: 24, theta: null, names: ['A', 'B', 'C'], sides: { a: '7', b: '24', c: '25' } }),
  ex5a: triFig(400, 240, FO.a.tri), ex5b: triFig(400, 240, FO.b.tri),
  ex7a: triFig(400, 240, FH.a.tri), ex7b: triFig(400, 240, FH.b.tri),
  ex8: triFig(380, 230, { right: 'br', A: 18, c: 5, theta: 'A', thetaLabel: '4.8°', names: false, sides: { a: '0.45 m', c: 'ramp, r' } }),
  ex6: (host) => { const s = figSvg(host, 360, 330); kaiScene(s, { s: 46, G: 312, wx: 230, theta: 75, fs: 18 }); },
  ex9a: (host) => { const s = figSvg(host, 400, 300); boomScene(s, { s: 24, G: 290, px: 130, theta: 62, fs: 17, show: { tri: true } }); },
  ex9b: (host) => { const s = figSvg(host, 470, 220); zipScene(s, { s: 2.75, x0: 34, G: 205, fs: 17, t: 0.3 }); }
};
document.querySelectorAll('.u7l5-fig[data-fig]').forEach((host) => { const f = FIG[host.dataset.fig]; if (f) f(host); });

/* ======================================================================================
 * Stand Up Break
 * ====================================================================================== */
function figStr(o) {
  const W = 300, Hh = 200, svg = svgEl('svg', { class: 'geo-svg', width: W, height: Hh, viewBox: `0 0 ${W} ${Hh}` });
  Geo.rightTri(svg, Object.assign({ width: W, height: Hh, colors: false, size: 18, pad: 44, show: [], names: false }, o));
  return svg.outerHTML;
}
const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [12, 35, 37], [6, 8, 10], [9, 12, 15], [15, 20, 25]];
const fmtN = (v) => String(v);
standup('u7l5', {
  intro: 'Sketch the triangle, label opp and hyp, and show every step. Check: is the hyp the longest side?',
  levels: {
    BEG: (r) => {
      const [p, q, hh] = r.pick(TRIPLES), useP = r.chance(0.5), o = useP ? p : q, a = useP ? q : p, A = Math.atan2(o, a) / RAD;
      return { text: `For the angle θ, the opposite side is <b>${o}</b> and the hypotenuse is <b>${hh}</b>. Write sin θ as a fraction, then as a decimal to 4 decimal places.`, q: '',
        fig: figStr({ right: r.pick(['br', 'bl']), A, c: hh, theta: 'A', sides: { a: String(o), b: String(a), c: String(hh) } }),
        a: [`\\sin\\theta=\\dfrac{${o}}{${hh}}`, `\\approx${r4(o / hh)}`] };
    },
    PRG: (r) => {
      const c = r.chance(0.5) ? r.int(6, 30) : r.int(12, 59) / 2, t = r.int(15, 75), x = c * sinD(t), u = r.pick(['m', 'cm', 'ft']);
      return { text: `The hypotenuse is <b>${fmtN(c)} ${u}</b> and the angle is <b>${t}°</b>. Find the side <i>x</i> across from the angle, to the nearest tenth.`, q: '',
        fig: figStr({ right: 'br', A: t, c, theta: 'A', thetaLabel: t + '°', sides: { a: 'x', c: `${fmtN(c)} ${u}` } }),
        a: [`\\sin${t}^\\circ=\\dfrac{x}{${fmtN(c)}}`, `x=${fmtN(c)}\\times\\sin${t}^\\circ`, `x\\approx${r1(x)}\\text{ ${u}}`] };
    },
    MAS: (r) => r.pick([
      () => {
        const o = r.chance(0.5) ? r.int(4, 25) : r.int(9, 49) / 2, t = r.int(12, 70), hv = o / sinD(t);
        return { text: `The side across from a <b>${t}°</b> angle is <b>${fmtN(o)} m</b>. Find the hypotenuse <i>h</i> to the nearest tenth.`, q: '',
          fig: figStr({ right: 'br', A: t, c: hv, theta: 'A', thetaLabel: t + '°', sides: { a: `${fmtN(o)} m`, c: 'h' } }),
          a: [`\\sin${t}^\\circ=\\dfrac{${fmtN(o)}}{h}`, `h=\\dfrac{${fmtN(o)}}{\\sin${t}^\\circ}`, `h\\approx${r1(hv)}\\text{ m}`] };
      },
      () => {
        const L = r.int(30, 90), t = r.int(30, 65), hand = r.pick([1.1, 1.2, 1.3, 1.4, 1.5]), x = L * sinD(t);
        return { text: `A kite string is <b>${L} m</b> long and makes a <b>${t}°</b> angle with the ground. It is held <b>${hand} m</b> above the ground. How high is the kite, to the nearest tenth of a metre?`, q: '',
          a: [`${L}\\times\\sin${t}^\\circ=${cut(x)}\\ldots`, `${cut(x)}\\ldots+${hand}=${cut(x + hand)}\\ldots`, `\\approx${r1(x + hand)}\\text{ m}`] };
      },
      () => {
        const rise = r.pick([0.3, 0.36, 0.4, 0.5, 0.6, 0.75, 0.8]), t = r.pick([3, 4, 4.5, 5, 6]), rv = rise / sinD(t);
        return { text: `A ramp must rise <b>${rise} m</b> at an angle of <b>${t}°</b>. How long is the ramp surface, to the nearest tenth of a metre?`, q: '',
          a: [`\\sin${t}^\\circ=\\dfrac{${rise}}{r}`, `r=\\dfrac{${rise}}{\\sin${t}^\\circ}`, `r\\approx${r1(rv)}\\text{ m}`] };
      }
    ])()
  }
});
