/* Math 10-3 · Unit 7 · Lesson 4 — Similar Right Triangles and the Tangent Ratio.
 * Explainers (Class view unless marked Full): the labelling routine on any right triangle, with the tags gliding when θ
 * moves (Example 1 checks); similar right triangles with a live opp ÷ adj column and a θ slider (Example 2 check); why the
 * ratio stays the same: k cancels (Full); a triangle that gets steeper while the tan table fills (Example 3 check); tan A
 * and tan B (Example 4 check, Full); the "x on top: multiply" routine (Example 5 checks); the cell-phone tower scene
 * (Example 6); the "x on the bottom: divide" routine (Examples 7 and 8); checking with the other angle (Example 7(b),
 * Full); Ava, Ben and Cole with verdict stamps (Example 9). Also a quick-fire labelling tool, the static figures,
 * the Math History animation (the tangent as a shadow) and the Stand Up Break. */
import { h, add, tex, svgEl, tween, anim, stamp, stampIn, pulse, liveCtx, mountExplainers } from '../blocks.js';
import { Geo } from '../geo.js';
import { standup } from '../standup.js';

const INK = '#1c2230', RED = '#c93a33', BLUE = '#1f5bd6', BROWN = '#9a6a24', AMBER = '#c27a0e', GREEN = '#12805a', GREY = '#9aa0ab';
const OPP = RED, ADJ = BLUE, HYP = BROWN;
const RAD = Math.PI / 180;
const tan = (d) => Math.tan(d * RAD);
const T = (s) => tex(String(s));
/** a calculator value cut (not rounded) to d places, with "…": 4.58572… → 4.5857\ldots */
const cut = (v, d) => (Math.floor(v * 10 ** d + 1e-9) / 10 ** d).toFixed(d) + '\\ldots';
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const stageSvg = (stage, W, H) => add(stage, svgEl('svg', { class: 'u7l4-svg', width: W, height: H, viewBox: `0 0 ${W} ${H}` }), 0, 0);
/** an HTML label centred on (x, y), in a 0×0 holder (so c.pop's scale doesn't undo the centring) */
function lab(host, html, x, y, cls = '') {
  const hold = h('div', 'u7l4-hold'); hold.appendChild(h('div', 'u7l4-lab ' + cls, html)); add(host, hold, x, y); hold.inner = hold.firstChild; return hold;
}
/** an HTML label whose left edge is at x (centred on y) */
function labL(host, html, x, y, cls = '') {
  const hold = h('div', 'u7l4-hold'); hold.appendChild(h('div', 'u7l4-labl ' + cls, html)); add(host, hold, x, y); hold.inner = hold.firstChild; return hold;
}
function line(parent, P, Q, o = {}) {
  return svgEl('line', { x1: P[0].toFixed(2), y1: P[1].toFixed(2), x2: Q[0].toFixed(2), y2: Q[1].toFixed(2), stroke: o.color || INK, 'stroke-width': o.width || 3, 'stroke-linecap': 'round', 'stroke-dasharray': o.dash || null, class: o.cls === undefined ? 'bk-stroke' : o.cls, opacity: o.opacity ?? null }, parent);
}
function path(parent, d, o = {}) {
  return svgEl('path', { d, fill: o.fill || 'none', 'fill-opacity': o.fo ?? null, stroke: o.stroke === undefined ? INK : o.stroke, 'stroke-width': o.width || 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-dasharray': o.dash || null, class: o.cls === undefined ? 'bk-stroke' : o.cls, opacity: o.opacity ?? null }, parent);
}
const setLine = (el, P, Q) => { el.setAttribute('x1', P[0].toFixed(2)); el.setAttribute('y1', P[1].toFixed(2)); el.setAttribute('x2', Q[0].toFixed(2)); el.setAttribute('y2', Q[1].toFixed(2)); };
const polyD = (P) => 'M' + P.map((p) => p[0].toFixed(2) + ' ' + p[1].toFixed(2)).join('L') + 'Z';
const txt = (parent, x, y, s, o = {}) => Geo.text(parent, x, y, s, Object.assign({ size: 20 }, o));
const figSvg = (host, W, H) => { host.style.width = W + 'px'; host.style.height = H + 'px'; return svgEl('svg', { class: 'geo-svg u7l4-svg', width: W, height: H, viewBox: `0 0 ${W} ${H}` }, host); };
/** a right-angle square at V, along unit directions u and v (screen px) */
function sqMark(parent, V, u, v, s = 14, colr = INK) {
  return path(parent, `M${(V[0] + u[0] * s).toFixed(2)} ${(V[1] + u[1] * s).toFixed(2)}L${(V[0] + (u[0] + v[0]) * s).toFixed(2)} ${(V[1] + (u[1] + v[1]) * s).toFixed(2)}L${(V[0] + v[0] * s).toFixed(2)} ${(V[1] + v[1] * s).toFixed(2)}`, { width: 2, stroke: colr, cls: '' });
}
/** geo rightTri helpers: hide its role tags; draw the sides in ink; colour one side by role */
const tagsOff = (R) => Object.values(R.tags).forEach((t) => { if (t) t.style.opacity = 0; });
const inkSides = (R) => ['a', 'b', 'c'].forEach((s) => R.sideEls[s].setAttribute('stroke', INK));
const colorRole = (R, role) => { const s = R.roles()[role]; R.sideEls[s].setAttribute('stroke', Geo.ROLE_COLORS[role]); };
/** change a side's length label (e.g. x → 4.6 cm) and push the label and its role tag out so they don't overlap the side */
function relabel(R, s, text, colr) {
  const el = R.valLabels[s]; if (!el) return null;
  const ends = { a: ['B', 'C'], b: ['A', 'C'], c: ['A', 'B'] }[s], P = R.V[ends[0]], Q = R.V[ends[1]], M = [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2];
  const x = +el.getAttribute('x'), y = +el.getAttribute('y'), L = Math.hypot(x - M[0], y - M[1]) || 1, n = [(x - M[0]) / L, (y - M[1]) / L];
  const d = (text.length - el.textContent.length) * 19 * 0.29 * Math.abs(n[0]);
  el.setAttribute('x', (x + n[0] * d).toFixed(1)); el.setAttribute('y', (y + n[1] * d).toFixed(1)); el.textContent = text; if (colr) el.setAttribute('fill', colr);
  const roles = R.roles(), role = roles && Object.keys(roles).find((k) => roles[k] === s), tg = role && R.tags[role];
  if (tg) { tg.setAttribute('x', (+tg.getAttribute('x') + n[0] * 2 * d).toFixed(1)); tg.setAttribute('y', (+tg.getAttribute('y') + n[1] * 2 * d).toFixed(1)); }
  return el;
}
/** the angle mark at vertex v of a geo rightTri, as its own Geo.angle (label shown) */
function markAt(R, v, label, colr = AMBER) {
  const others = ['A', 'B', 'C'].filter((k) => k !== v), V = R.V[v];
  let a1 = Geo.dirTo(V, R.V[others[0]]), a2 = Geo.dirTo(V, R.V[others[1]]);
  if (Geo.n360(a2 - a1) > 180) [a1, a2] = [a2, a1];
  return Geo.angle(R.layers.marks, { vertex: V, a1, a2, arms: false, dot: false, label, color: colr, size: 19, r: 34 });
}

/* ======================================================================================
 * 1. The labelling routine (Example 1 checks), tags glide when θ moves
 * ====================================================================================== */
const LBL = {
  r: { o: { a: 5, b: 8, right: 'br' }, th: 'A', swap: true },
  a: { o: { a: 2.2, b: 3.2, right: 'br' }, th: 'A' },
  b: { o: { a: 2.6, b: 2.6, right: 'bl' }, th: 'B' },
  c: { o: { a: 3.2, b: 2.4, right: 'tr', rot: 53.13 }, th: 'A' },
  d: { o: { a: 2.4, b: 3.6, right: 'br', names: ['A', 'B', 'C'], thetaLabel: '' }, th: 'A', swap: true }
};
const labels = {
  title: 'The labelling routine: hyp, opp, adj',
  height: 410,
  choices: [{ v: 'r', label: 'The routine' }, { v: 'a', label: 'Example 1 (a)' }, { v: 'b', label: '(b)' }, { v: 'c', label: '(c)' }, { v: 'd', label: '(d) from ∠A, then ∠B' }],
  ask: (v) => (v === 'r' ? `Label the three sides from ${T('\\theta')}.` : v === 'd' ? `Example 1 (d): in ${T('\\triangle ABC')}, ${T('\\angle C=90^\\circ')}. Label the sides from ${T('\\angle A')}, then from ${T('\\angle B')}.`
    : `Example 1 (${v}): write opp, adj or hyp beside each side. Use the angle marked ${T('\\theta')}.`),
  make(stage, v, ex) {
    const d = LBL[v], W = ex.W, named = v === 'd';
    const R = Geo.rightTri(stage, Object.assign({ x: 0, y: 0, width: 560, height: 410, names: false, theta: d.th }, d.o));
    tagsOff(R); inkSides(R);
    const px = 590, bw = Math.min(380, W - px - 10);
    const ang = named ? '∠A' : 'θ';
    const S = [
      h('div', 'u7l4-step', `<b>Step 1.</b> Find the right angle. The side across from it is the <b class="u7l4-hyp">hyp</b>.`),
      h('div', 'u7l4-step', `<b>Step 2.</b> Find ${named ? T('\\angle A') : T('\\theta')}. The side across from it is the <b class="u7l4-opp">opp</b>.`),
      h('div', 'u7l4-step', `<b>Step 3.</b> The last side is the <b class="u7l4-adj">adj</b>: it touches ${named ? T('\\angle A') : T('\\theta')} and is not the hyp.`)
    ];
    S.forEach((e, i) => { e.style.width = bw + 'px'; add(stage, e, px, 18 + i * 96); });
    const swapNote = d.swap ? hide(add(stage, h('div', 'u7l4-step on', named ? `From ${T('\\angle B')}: <b class="u7l4-opp">opp</b> and <b class="u7l4-adj">adj</b> <b>swap</b>. ${T('AB')} is still the <b class="u7l4-hyp">hyp</b>.` : `Other angle: <b class="u7l4-opp">opp</b> and <b class="u7l4-adj">adj</b> <b>swap</b>. The <b class="u7l4-hyp">hyp</b> stays.`), px, 312)) : null;
    if (swapNote) swapNote.style.width = bw + 'px';
    const on = (i) => S.forEach((e, k) => e.classList.toggle('on', k <= i));
    const where = { a: v === 'c' ? 'The right angle is at the top, so the hyp is the <b>bottom</b> side.' : '', b: v === 'b' ? `${T('\\theta')} is at the top, so the opp is the <b>bottom</b> side.` : '' };
    const steps = [
      { cap: `<b>Step 1.</b> Find the right angle (the small square). The side across from it is the <b>hyp</b>, the longest side. ${where.a}`,
        run: async (c) => { on(0); colorRole(R, 'hyp'); R.clearHighlight(); await R.highlight(c, 'hyp'); await c.pop(R.tags.hyp); } },
      { cap: `<b>Step 2.</b> Find ${named ? '∠A' : 'θ'}. The side across from it is the <b>opp</b>. It does not touch ${ang}. ${where.b}`,
        run: async (c) => { on(1); R.clearHighlight(); colorRole(R, 'opp'); await R.highlight(c, 'opp'); await c.pop(R.tags.opp); } },
      { cap: `<b>Step 3.</b> The last side is the <b>adj</b>. It touches ${ang}, and it is not the hyp.`,
        run: async (c) => { on(2); R.clearHighlight(); colorRole(R, 'adj'); await R.highlight(c, 'adj'); await c.pop(R.tags.adj); } }
    ];
    if (d.swap) steps.push({
      cap: named ? 'Now use <b>∠B</b>. The tags glide: <i>BC</i> becomes <b>adj</b>, <i>AC</i> becomes <b>opp</b>. <i>AB</i> is still the <b>hyp</b>.'
        : 'Now use the <b>other</b> acute angle as θ. The tags glide: <b>opp</b> and <b>adj</b> swap. The <b>hyp</b> never changes.',
      run: async (c) => { R.clearHighlight(); await R.setTheta(c, d.th === 'A' ? 'B' : 'A', 900); swapNote.style.opacity = 1; await c.pop(swapNote); }
    });
    return steps;
  }
};

/* ======================================================================================
 * Quick-fire: a random right triangle, turned any way
 * ====================================================================================== */
function quickFire() {
  const host = document.getElementById('u7l4-qf'); if (!host) return;
  const fig = h('div', 'u7l4-qf-fig'), side = h('div', 'u7l4-qf-side no-ink');
  const btn = (t) => { const b = h('button', 'pill', t); b.type = 'button'; side.appendChild(b); return b; };
  const bShow = btn('Show the labels'), bSwitch = btn('Switch θ'), bNew = btn('New triangle');
  const msg = h('div', 'u7l4-qf-msg', ''); side.appendChild(msg);
  host.append(fig, side);
  let R = null, last = -1;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  function make() {
    fig.innerHTML = '';
    let a, b; do { a = rnd(2, 7); b = rnd(2, 7); } while (a / b < 0.45 || a / b > 2.2);
    let rot; do { rot = rnd(0, 23) * 15; } while (rot === last); last = rot;
    R = Geo.rightTri(fig, { width: 560, height: 360, a, b, right: ['br', 'bl', 'tr', 'tl'][rnd(0, 3)], rot, flip: Math.random() < 0.5, names: false, theta: Math.random() < 0.5 ? 'A' : 'B' });
    host.classList.add('u7l4-hid'); bShow.disabled = false;
    msg.innerHTML = 'Which side is the <b class="u7l4-hyp">hyp</b>? The <b class="u7l4-opp">opp</b>? The <b class="u7l4-adj">adj</b>?';
  }
  bShow.addEventListener('click', () => {
    host.classList.remove('u7l4-hid'); bShow.disabled = true; const c = liveCtx(); Object.values(R.tags).forEach((t) => c.pop(t));
    msg.innerHTML = '<b class="u7l4-hyp">hyp</b>: across from the right angle. <b class="u7l4-opp">opp</b>: across from θ. <b class="u7l4-adj">adj</b>: touches θ, not the hyp.';
  });
  bSwitch.addEventListener('click', async () => {
    const wasHidden = host.classList.contains('u7l4-hid');
    await R.setTheta(liveCtx(), R.theta === 'A' ? 'B' : 'A', 800);
    msg.innerHTML = wasHidden ? 'θ moved to the other acute angle. Now which side is which?' : 'θ moved: <b class="u7l4-opp">opp</b> and <b class="u7l4-adj">adj</b> swapped. The <b class="u7l4-hyp">hyp</b> did not change.';
  });
  bNew.addEventListener('click', make);
  make();
}

/* ======================================================================================
 * 2. Similar right triangles: the live opp ÷ adj column (Example 2 check)
 * ====================================================================================== */
const discover = {
  title: 'Same angle, same ratio',
  height: 450,
  choices: [{ v: 35, label: '35° (Example 2)' }, { v: 20, label: '20°' }, { v: 60, label: '60°' }],
  ask: (v) => (v === 35 ? 'Example 2: three right triangles each have a 35° angle. What is opp ÷ adj in each one?' : `Three right triangles each have a ${v}° angle. What is opp ÷ adj in each one?`),
  make(stage, v, ex) {
    const dp = v === 35 ? 1 : 2, to = v < 45 ? 60 : 25;
    const R = Geo.similarRights(stage, { x: 0, y: 0, width: 540, height: 440, theta: v, sizes: [2, 3, 5], ratios: ['opp/adj'], slider: true, calc: true, min: 10, max: 80, unit: 80, dp, rdp: 2 });
    R.el.classList.add('u7l4-nocalc');
    const panel = R.el.querySelector('.geo-panel');
    Object.assign(panel.style, { position: 'absolute', left: '575px', top: '40px', width: Math.min(420, ex.W - 585) + 'px', margin: 0 });
    const vals = R.values(), f = (x) => Geo.fmtLen(x, dp), r2 = (x) => x.toFixed(2);
    const list = vals.map((t) => `${f(t.opp)} ÷ ${v === 35 ? t.adj.toFixed(1) : f(t.adj)}`).join(', ');
    return [
      { cap: `Three right triangles, each with a <b>${v}°</b> angle. They are similar: the same shape in three sizes.`, run: (c) => R.grow(c) },
      { cap: `Work out <b>opp ÷ adj</b> for each one: ${list}.`, run: (c) => R.highlightCol(c, 'opp/adj') },
      { cap: `Every one is <b>${r2(vals[0]['opp/adj'])}</b>! The size does not matter. This number is the <b>tangent</b> of ${v}°: <b>tan ${v}°</b>.`,
        run: async (c) => { R.el.classList.remove('u7l4-nocalc'); await R.name(c, 'opp/adj'); const row = R.table.querySelector('.geo-calc'); if (row) await c.pop(row); } },
      { cap: `Change the angle to <b>${to}°</b>. The triangles get ${to > v ? 'steeper' : 'flatter'} and opp ÷ adj changes, but it is still the <b>same</b> in all three: tan ${to}° = ${tan(to).toFixed(2)}.`,
        run: async (c) => { await tween(c, 1600, (t) => R.set(Math.round(v + (to - v) * t))); R.highlightCol(null, 'opp/adj'); } },
      { cap: 'Each angle has its own value of opp ÷ adj. Drag the <b>θ</b> slider to try any angle.', run: (c) => pulse(c, panel.querySelector('.geo-slider'), 1.05, 600) }
    ];
  }
};

/* ======================================================================================
 * 2. Why it works: the scale factor cancels (Full)
 * ====================================================================================== */
const whyK = {
  title: 'Why the ratio doesn’t change',
  height: 380,
  ask: () => `Triangle 1 (opp 1.4 cm, adj 2.0 cm) is enlarged by ${T('k=1.5')}. What happens to opp ÷ adj?`,
  make(stage, v, ex) {
    const W = ex.W, H = 380, svg = stageSvg(stage, W, H), s = 90, A = [30, 342];
    const tri = (k) => [A, [A[0] + 2.0 * k * s, A[1]], [A[0] + 2.0 * k * s, A[1] - 1.4 * k * s]];
    const t1 = path(svg, polyD(tri(1)), { stroke: BLUE, width: 3, fill: BLUE, fo: 0.08, cls: '' });
    const big = hide(path(svg, polyD(tri(1)), { stroke: GREEN, width: 3, fill: GREEN, fo: 0.06, cls: '' }));
    const arc = path(svg, Geo.arcD(A, 40, 0, 35), { stroke: AMBER, width: 2.4, cls: '' });
    txt(svg, A[0] + 58, A[1] - 14, '35°', { size: 17, color: AMBER });
    const sq = svgEl('g', {}, svg);
    const adjL = txt(svg, 0, 0, '', { size: 19, color: ADJ }), oppL = txt(svg, 0, 0, '', { size: 19, color: OPP, anchor: 'start' });
    const name = txt(svg, 30, 24, 'Triangle 1', { size: 22, color: BLUE, anchor: 'start', weight: 800 });
    let k = 1;
    function set(kk, lbl = true) {
      k = kk; const P = tri(k); big.setAttribute('d', polyD(P));
      sq.innerHTML = ''; sqMark(sq, P[1], [-1, 0], [0, -1], 13, k === 1 ? BLUE : GREEN);
      adjL.setAttribute('x', ((P[0][0] + P[1][0]) / 2).toFixed(1)); adjL.setAttribute('y', (P[1][1] + 18).toFixed(1));
      oppL.setAttribute('x', (P[1][0] + 10).toFixed(1)); oppL.setAttribute('y', ((P[1][1] + P[2][1]) / 2).toFixed(1));
      if (lbl) { adjL.textContent = (2.0 * k).toFixed(1) + ' cm'; oppL.textContent = (1.4 * k).toFixed(2).replace(/0$/, '') + ' cm'; }
    }
    set(1); void t1;
    const ex0 = Math.max(530, W - 420);
    const e0 = labL(stage, `${T('\\dfrac{\\text{opp}}{\\text{adj}}=\\dfrac{1.4}{2.0}=0.70')}`, ex0, 40, 'u7l4-eq');
    const e1 = hide(labL(stage, `${T('\\dfrac{\\text{opp}}{\\text{adj}}=\\dfrac{2.1}{3.0}=\\dfrac{1.4\\times1.5}{2.0\\times1.5}')}`, ex0, 122, 'u7l4-eq'));
    const e2 = hide(labL(stage, `${T('=\\dfrac{1.4\\times\\cancel{1.5}}{2.0\\times\\cancel{1.5}}=\\dfrac{1.4}{2.0}=0.70')}`, ex0 + 92, 204, 'u7l4-eq u7l4-ok'));
    const e3 = hide(labL(stage, `${T('k=2.5:\\ \\dfrac{3.5}{5.0}=\\dfrac{1.4\\times\\cancel{2.5}}{2.0\\times\\cancel{2.5}}=0.70')}`, ex0, 286, 'u7l4-eq'));
    const st = hide(stamp(stage, 'still 0.70', { ok: true, x: W - 110, y: 352, size: 'sm' }));
    const grow = (c, k0, k1, ms) => tween(c, ms, (t) => set(k0 + (k1 - k0) * t));
    return [
      { cap: 'Triangle 1 has opp 1.4 cm and adj 2.0 cm, so opp ÷ adj = 0.70.', run: (c) => c.pop(e0) },
      { cap: 'Enlarge it by the scale factor <b>k = 1.5</b>. <b>Both</b> legs are multiplied by 1.5: 1.4 × 1.5 = 2.1 and 2.0 × 1.5 = 3.0. That is Triangle 2.',
        run: async (c) => { big.style.opacity = 1; name.textContent = 'Triangle 2'; name.setAttribute('fill', GREEN); await grow(c, 1, 1.5, 1400); } },
      { cap: 'Write opp ÷ adj for Triangle 2, with the 1.5s showing.', run: (c) => c.pop(e1) },
      { cap: 'Multiplying the top and the bottom by the same number does not change a ratio: the 1.5s <b>cancel</b>. Still 0.70.', run: (c) => c.pop(e2) },
      { cap: 'Any scale factor cancels the same way. Triangle 3 (k = 2.5) also gives 0.70. Only the <b>angle</b> decides opp ÷ adj.',
        run: async (c) => { name.textContent = 'Triangle 3'; name.setAttribute('fill', '#7b4fc4'); big.setAttribute('stroke', '#7b4fc4'); await grow(c, 1.5, 2.5, 1300); await c.pop(e3); st.style.opacity = 1; await stampIn(c, st); } }
    ];
  }
};

/* ======================================================================================
 * 3. Steeper angle, bigger tan: the table fills (Example 3 check)
 * ====================================================================================== */
const SWEEP = [10, 20, 35, 45, 60, 70, 80];
const tanSweep = {
  title: 'Make θ steeper: compare opp with adj',
  height: 470,
  ask: () => `Example 3: find ${T('\\tan\\theta')} for each angle, to 4 decimal places.`,
  make(stage, v, ex) {
    const W = ex.W, H = 470, svg = stageSvg(stage, W, H), A = [46, 440], ADJ0 = 170, MAXH = 410;
    let th = 4;
    const fill = path(svg, '', { stroke: 'none', fill: AMBER, fo: 0.08, cls: '' });
    const lvl = line(svg, A, A, { color: GREY, width: 1.6, dash: '5 5', cls: '' }), lvlT = txt(svg, 0, 0, 'opp = adj', { size: 15, color: GREY, anchor: 'start' });
    const hyp = line(svg, A, A, { color: HYP, width: 3.4, cls: '' }), opp = line(svg, A, A, { color: OPP, width: 4, cls: '' }), adjLn = line(svg, A, A, { color: ADJ, width: 4, cls: '' });
    const sqG = svgEl('g', {}, svg);
    const arc = path(svg, '', { stroke: AMBER, width: 2.6, cls: '' }), thL = txt(svg, 0, 0, '', { size: 18, color: AMBER });
    const adjL = txt(svg, 0, A[1] + 17, 'adj', { size: 18, color: ADJ });
    const oppL = txt(svg, 0, 0, 'opp', { size: 18, color: OPP, anchor: 'start' });
    const zoom = txt(svg, A[0], 18, '', { size: 15, color: GREY, anchor: 'start' });
    function set(t) {
      th = t; const k = Math.min(1, MAXH / (ADJ0 * tan(t))), adj = ADJ0 * k, C = [A[0] + adj, A[1]], B = [C[0], A[1] - adj * tan(t)];
      setLine(hyp, A, B); setLine(opp, C, B); setLine(adjLn, A, C); fill.setAttribute('d', polyD([A, C, B]));
      sqG.innerHTML = ''; sqMark(sqG, C, [-1, 0], [0, -1], 12);
      setLine(lvl, [C[0] - 10, A[1] - adj], [C[0] + 36, A[1] - adj]); lvlT.setAttribute('x', (C[0] + 42).toFixed(1)); lvlT.setAttribute('y', (A[1] - adj).toFixed(1));
      arc.setAttribute('d', Geo.arcD(A, 34, 0, t)); const p = Geo.at(A, t / 2, 56); thL.setAttribute('x', p[0].toFixed(1)); thL.setAttribute('y', p[1].toFixed(1)); thL.textContent = Math.round(t) + '°';
      adjL.setAttribute('x', ((A[0] + C[0]) / 2).toFixed(1));
      oppL.setAttribute('x', (C[0] + 8).toFixed(1)); oppL.setAttribute('y', Math.min(A[1] - 14, (C[1] + B[1]) / 2 + (t > 30 && t < 60 ? 22 : 0)).toFixed(1));
      zoom.textContent = k < 0.999 ? '(zoomed out to fit)' : '';
      read.inner.innerHTML = `tan ${Math.round(t)}° = ${tan(Math.round(t)).toFixed(4)}`;
    }
    // the table
    const grid = h('div', 'u7l4-st'); const cells = [];
    grid.appendChild(h('div', 'u7l4-sth', T('\\theta'))); SWEEP.forEach((d) => grid.appendChild(h('div', 'u7l4-sth', d + '°')));
    grid.appendChild(h('div', 'u7l4-sth', T('\\tan\\theta'))); SWEEP.forEach(() => { const e = h('div', '', ''); cells.push(e); grid.appendChild(e); });
    const gx = Math.max(330, W - 634);
    add(stage, grid, gx, 30);
    const read = lab(stage, '', gx + 307, 190, 'u7l4-read');
    const note = lab(stage, '', gx + 307, 262, 'u7l4-note');
    const big = hide(lab(stage, 'Bigger angle → bigger tan', gx + 307, 340, 'u7l4-eq u7l4-key'));
    const eq = hide(stamp(stage, 'opp = adj', { ok: true, x: gx + 140, y: 410, size: 'sm' }));
    set(th);
    const NOTE = { 10: 'opp is much shorter than adj', 20: 'opp is about 0.36 of adj', 35: 'the 0.70 from Example 2!', 45: 'opp and adj are equal', 60: 'now opp is longer than adj', 70: 'opp is almost 3 times adj', 80: 'opp is more than 5 times adj' };
    const go = (d) => async (c) => {
      SWEEP.forEach((x, i) => cells[i].classList.toggle('u7l4-now', x === d));
      const t0 = th; await tween(c, 900, (t) => set(t0 + (d - t0) * t));
      const i = SWEEP.indexOf(d); cells[i].textContent = tan(d).toFixed(4); note.inner.textContent = NOTE[d];
      await c.pop(cells[i]);
      if (d === 45) { eq.style.opacity = 1; await stampIn(c, eq); } else if (d === 60) eq.style.opacity = 0;
    };
    const CAP = {
      10: `θ = 10°: a gentle slope. opp is short, so <b>tan 10° = ${tan(10).toFixed(4)}</b>.`,
      20: `θ = 20°: <b>tan 20° = ${tan(20).toFixed(4)}</b>.`,
      35: `θ = 35°: <b>tan 35° = ${tan(35).toFixed(4)}</b>. That matches the 0.70 from Example 2.`,
      45: `θ = 45°: opp and adj are <b>equal</b>, so <b>tan 45° = 1.0000</b>.`,
      60: `θ = 60°: now opp is <b>longer</b> than adj. <b>tan 60° = ${tan(60).toFixed(4)}</b>.`,
      70: `θ = 70°: <b>tan 70° = ${tan(70).toFixed(4)}</b>.`,
      80: `θ = 80°: very steep, and tan grows fast: <b>tan 80° = ${tan(80).toFixed(4)}</b>.`
    };
    return SWEEP.map((d) => ({ cap: CAP[d], run: go(d) })).concat([
      { cap: 'Bigger angle → bigger tan. Below 45°, tan θ is less than 1 (opp shorter). Above 45°, tan θ is more than 1 (opp longer).',
        run: async (c) => { cells.forEach((e) => e.classList.remove('u7l4-now')); note.inner.textContent = ''; await c.pop(big); } }
    ]);
  }
};

/* ======================================================================================
 * 3. tan A and tan B (Example 4 check, Full)
 * ====================================================================================== */
const tanAB = {
  title: 'From ∠A, then from ∠B',
  height: 380,
  ask: () => `Example 4: in ${T('\\triangle ABC')}, ${T('\\angle C=90^\\circ')}. Find ${T('\\tan A')} and ${T('\\tan B')}.`,
  make(stage, v, ex) {
    const R = Geo.rightTri(stage, { x: 0, y: 0, width: 470, height: 380, pad: 70, a: 8, b: 15, right: 'br', names: ['A', 'B', 'C'], sides: { a: '8 cm', b: '15 cm', c: '17 cm' }, theta: 'A', thetaLabel: '' });
    tagsOff(R);
    const x0 = 540;
    const e1 = hide(labL(stage, T('\\tan A=\\dfrac{\\text{opp}}{\\text{adj}}=\\dfrac{8}{15}\\approx0.5333'), x0, 70, 'u7l4-eq'));
    const e2 = hide(labL(stage, T('\\tan B=\\dfrac{\\text{opp}}{\\text{adj}}=\\dfrac{15}{8}=1.8750'), x0, 170, 'u7l4-eq'));
    const e3 = hide(labL(stage, `${T('1.875>0.5333')}, so <b>∠B is bigger</b>.<br>${T('\\tan B>1')}, so ∠B is more than 45°.`, x0, 280, 'u7l4-eq u7l4-ok'));
    return [
      { cap: 'From <b>∠A</b>: opp = <i>BC</i> = 8 and adj = <i>AC</i> = 15. The hyp, 17, is not used.', run: async (c) => { for (const r of ['hyp', 'opp', 'adj']) await c.pop(R.tags[r]); } },
      { cap: 'tan A = opp ÷ adj = 8 ÷ 15 ≈ 0.5333.', run: (c) => c.pop(e1) },
      { cap: 'Now from <b>∠B</b>: opp and adj swap. opp = <i>AC</i> = 15 and adj = <i>BC</i> = 8.', run: (c) => R.setTheta(c, 'B', 900) },
      { cap: 'tan B = 15 ÷ 8 = 1.8750. It is tan A turned upside down.', run: (c) => c.pop(e2) },
      { cap: 'tan B is bigger, so ∠B is the bigger angle (it is across from the longer leg). tan B is more than 1, so ∠B is more than 45°.', run: (c) => c.pop(e3) }
    ];
  }
};

/* ======================================================================================
 * 4. Solving: x on top (multiply) and x on the bottom (divide)
 * ====================================================================================== */
const SOLVE = {
  m5a: { name: 'Example 5 (a)', th: 27, g: '9.0', gv: 9, unit: 'cm', o: { a: 9 * tan(27), b: 9, right: 'br', theta: 'A', sides: { b: '9.0 cm', a: 'x' } }, xs: 'a' },
  m5b: { name: 'Example 5 (b)', th: 58, g: '3.5', gv: 3.5, unit: 'm', o: { a: 3.5, b: 3.5 * tan(58), right: 'bl', theta: 'B', sides: { a: '3.5 m', b: 'x' } }, xs: 'b' },
  d7a: { name: 'Example 7 (a)', th: 40, g: '6.3', gv: 6.3, unit: 'cm', o: { a: 6.3, b: 6.3 / tan(40), right: 'bl', theta: 'A', sides: { a: '6.3 cm', b: 'x' } }, xs: 'b' },
  d7b: { name: 'Example 7 (b)', th: 66, g: '12', gv: 12, unit: 'ft', o: { a: 12, b: 12 / tan(66), right: 'br', theta: 'A', sides: { a: '12 ft', b: 'x' } }, xs: 'b' },
  d8: { name: 'Example 8 (a)', th: 4.8, g: '0.48', gv: 0.48, unit: 'm', o: { a: 1.15, b: 5.6, right: 'br', theta: 'A', sides: { a: '0.48 m', b: 'x', c: 'ramp' } }, xs: 'b', flat: true }
};
function solver(mode) {
  const keys = mode === 'mul' ? ['m5a', 'm5b'] : ['d7a', 'd7b', 'd8'];
  return {
    title: mode === 'mul' ? 'x on the top: multiply' : 'x on the bottom: divide',
    height: 430,
    choices: keys.map((k) => ({ v: k, label: SOLVE[k].name })),
    ask: (v) => (v === 'd8' ? 'Example 8 (a): a ramp must rise 0.48 m at an angle of 4.8°. How far along the ground must it reach? (nearest tenth)' : `${SOLVE[v].name}: find ${T('x')}, to the nearest tenth.`),
    make(stage, v, ex) {
      const d = SOLVE[v], th = d.th, g = d.g, u = d.unit, mul = mode === 'mul';
      const X = mul ? d.gv * tan(th) : d.gv / tan(th), xr = X.toFixed(1);
      const R = Geo.rightTri(stage, Object.assign({ x: 0, y: d.flat ? 40 : 0, width: 450, height: d.flat ? 340 : 430, pad: [56, 110, 66, 124], names: false, thetaLabel: th + '°' }, d.o));
      tagsOff(R); inkSides(R);
      if (d.flat) add(stage, h('div', 'u7l4-note', '(not to scale)'), 170, 330);
      const x0 = 480, dy = 66, y0 = 34, TH = `${th}^\\circ`;
      const L = [];
      const put = (i, s, cls = '', dx = 0) => { const e = hide(labL(stage, T(s), x0 + dx, y0 + i * dy, 'u7l4-eq ' + cls)); L[i] = e; return e; };
      put(0, '\\tan\\theta=\\dfrac{\\text{opp}}{\\text{adj}}', 'u7l4-key');
      put(1, mul ? `\\tan${TH}=\\dfrac{x}{${g}}` : `\\tan${TH}=\\dfrac{${g}}{x}`);
      const both = hide(labL(stage, mul ? `<span class="u7l4-opp">× ${g} on both sides</span>` : `<span class="u7l4-opp">× ${T('x')} on both sides</span>`, x0 + 250, y0 + dy, 'u7l4-note'));
      if (mul) put(2, `${g}\\times\\tan${TH}=x`);
      else { put(2, `x\\times\\tan${TH}=${g}`); put(3, `x=\\dfrac{${g}}{\\tan${TH}}`); }
      const both2 = mul ? null : hide(labL(stage, `<span class="u7l4-opp">÷ ${T('\\tan' + TH)} on both sides</span>`, x0 + 250, y0 + 2 * dy, 'u7l4-note'));
      const iAns = mul ? 3 : 4;
      put(iAns, `x=${cut(X, mul ? 4 : 3)}\\approx${xr}\\text{ ${u}}`, 'u7l4-ok');
      const less = th < 45;
      const chk = hide(labL(stage, `Check: ${T(`${TH}${less ? '<' : '>'}45^\\circ`)}, so opp ${less ? '&lt;' : '&gt;'} adj:<br>${T(mul ? `${xr}${less ? '<' : '>'}${g}` : `${g}${less ? '<' : '>'}${xr}`)} ✓`, x0, y0 + (iAns + 1) * dy + 12, 'u7l4-eq'));
      const keysTxt = mul ? `${g} × tan ${th} ) ENTER` : `${g} ÷ tan ${th} ) ENTER`;
      const steps = [
        { cap: mul ? `<b>Step 1.</b> Label from ${th}°: <b>x</b> is across from it, so x is <b>opp</b>. ${g} touches it, so ${g} is <b>adj</b>.`
          : `<b>Step 1.</b> Label from ${th}°: <b>${g}</b> is across from it, so ${g} is <b>opp</b>. <b>x</b> touches it, so x is <b>adj</b>.`,
          run: async (c) => { colorRole(R, 'opp'); colorRole(R, 'adj'); await c.pop(R.tags.opp); await c.pop(R.tags.adj); } },
        { cap: '<b>Step 2.</b> Write the tangent ratio: tan θ = opp ÷ adj.', run: (c) => c.pop(L[0]) },
        { cap: `<b>Step 3.</b> Substitute: θ = ${th}°, opp = ${mul ? 'x' : g}, adj = ${mul ? g : 'x'}.`, run: (c) => c.pop(L[1]) }
      ];
      if (mul) steps.push({ cap: `<b>Step 4.</b> x is on the <b>top</b>: multiply both sides by ${g}.`, run: async (c) => { await c.pop(both); await c.pop(L[2]); } });
      else steps.push(
        { cap: '<b>Step 4.</b> x is on the <b>bottom</b>. First multiply both sides by x.', run: async (c) => { await c.pop(both); await c.pop(L[2]); } },
        { cap: `Then <b>divide</b> both sides by tan ${th}°. Now x is alone.`, run: async (c) => { await c.pop(both2); await c.pop(L[3]); } });
      steps.push(
        { cap: `Calculator: <b>${keysTxt}</b> gives ${X.toFixed(9).replace(/0+$/, '').slice(0, 11)}. Round at the end: <b>x ≈ ${xr} ${u}</b>.`,
          run: async (c) => { await c.pop(L[iAns]); const xEl = relabel(R, d.xs, `${xr} ${u}`, OPP); if (xEl) await c.pop(xEl); } },
        { cap: `<b>Step 5.</b> Check: ${th}° is ${less ? 'less' : 'more'} than 45°, so opp should be ${less ? 'shorter' : 'longer'} than adj. ${mul ? `${xr} ${less ? '<' : '>'} ${g}` : `${g} ${less ? '<' : '>'} ${xr}`} ✓`,
          run: (c) => c.pop(chk) });
      return steps;
    }
  };
}

/* ======================================================================================
 * 4. The cell-phone tower (Example 6): a scene that moves with the math
 * ====================================================================================== */
const tower = {
  title: 'Measuring a tower you can’t climb',
  height: 470,
  ask: () => 'Example 6: the tool is 45 m from the tower and measures 63° up to the top. How tall is the tower?',
  make(stage, v, ex) {
    const W = ex.W, H = 470, svg = stageSvg(stage, W, H), D = 45, TH = 63, Ht = D * tan(TH), s = 4.2, G = 410, X0 = 80;
    const P = (x, y) => [X0 + x * s, G - y * s], tool = P(0, 0), base = P(D, 0), top = P(D, Ht);
    svgEl('rect', { x: 0, y: 0, width: 440, height: G, fill: '#f2f6fc', rx: 10 }, svg);
    line(svg, [20, G], [430, G], { color: '#8a6f4d', width: 3, cls: '' });
    // tower: a tall lattice mast
    const tw = 9; let dTw = `M${base[0] - tw} ${G}L${top[0]} ${top[1]}L${base[0] + tw} ${G}`;
    for (let i = 1; i < 12; i++) { const y0 = G - (top[1] - G) * -(i - 1) / 12, y1 = G - (G - top[1]) * i / 12, w0 = tw * (1 - (i - 1) / 12), w1 = tw * (1 - i / 12); dTw += `M${base[0] - w0} ${y0}L${base[0] + w1} ${y1}M${base[0] + w0} ${y0}L${base[0] - w1} ${y1}`; }
    path(svg, dTw, { stroke: '#7b4fc4', width: 1.8, cls: '' });
    svgEl('circle', { cx: top[0], cy: top[1], r: 4, fill: RED }, svg);
    // the tool: a small tripod
    path(svg, `M${tool[0] - 10} ${G}L${tool[0]} ${G - 16}L${tool[0] + 10} ${G}`, { stroke: INK, width: 2.4, cls: '' });
    txt(svg, tool[0], G + 18, 'tool', { size: 15, color: '#6a7182' });
    // triangle, sight line, labels
    const tri = hide(path(svg, polyD([tool, base, top]), { stroke: 'none', fill: AMBER, fo: 0.12, cls: '' }));
    const adjLn = hide(line(svg, tool, base, { color: ADJ, width: 4.5, cls: '' }));
    const oppLn = hide(line(svg, base, top, { color: OPP, width: 4.5, cls: '' }));
    const sight = line(svg, tool, tool, { color: AMBER, width: 3, cls: '' });
    const arc = path(svg, '', { stroke: AMBER, width: 2.6, cls: '' }), aL = txt(svg, 0, 0, '', { size: 18, color: AMBER });
    const dimD = hide(svgEl('g', {}, svg)); line(dimD, [tool[0], G + 34], [base[0], G + 34], { color: '#3a4254', width: 1.6, cls: '' }); txt(dimD, (tool[0] + base[0]) / 2, G + 34, '45 m', { size: 18, color: ADJ });
    const tagO = hide(txt(svg, base[0] - 34, G - Ht * s * 0.78, 'opp', { size: 19, color: OPP, weight: 800 })), tagA = hide(txt(svg, (tool[0] + base[0]) / 2 + 20, G - 16, 'adj', { size: 19, color: ADJ, weight: 800 }));
    txt(svg, base[0] + 22, G - Ht * s * 0.64, 'h', { size: 24, color: OPP, italic: true });
    const hDim = line(svg, [base[0] + 44, G], [base[0] + 44, G], { color: OPP, width: 2.2, cls: '' }), hL = txt(svg, base[0] + 54, G - 20, '', { size: 21, color: OPP, anchor: 'start' });
    const lvl = hide(svgEl('g', {}, svg)); const L45 = P(D, D);
    line(lvl, tool, L45, { color: GREEN, width: 2, dash: '7 6', cls: '' }); line(lvl, [base[0] - 16, L45[1]], [base[0] + 16, L45[1]], { color: GREEN, width: 2.4, cls: '' });
    txt(lvl, base[0] - 22, L45[1] + 2, '45 m up', { size: 15, color: GREEN, anchor: 'end' });
    function aim(a) {
      const E = Geo.at(tool, a, Math.hypot(D, D * tan(a)) * s); setLine(sight, tool, a >= TH - 0.01 ? top : [Math.min(E[0], base[0]), Math.max(E[1], top[1])]);
      arc.setAttribute('d', a > 0.5 ? Geo.arcD(tool, 46, 0, a) : ''); const p = Geo.at(tool, a / 2, 66); aL.setAttribute('x', p[0].toFixed(1)); aL.setAttribute('y', p[1].toFixed(1)); aL.textContent = a > 3 ? Math.round(a) + '°' : '';
    }
    aim(0);
    const x0 = 470, dy = 70;
    const e = [T('\\tan63^\\circ=\\dfrac{h}{45}'), T('h=45\\times\\tan63^\\circ'), T(`h=${cut(Ht, 3)}\\approx88.3\\text{ m}`)].map((s2, i) => hide(labL(stage, s2, x0, 70 + i * dy, 'u7l4-eq' + (i === 2 ? ' u7l4-ok' : ''))));
    const ck = hide(labL(stage, `Check: ${T('63^\\circ>45^\\circ')}, so ${T('h>45')} m ✓`, x0, 70 + 3 * dy + 10, 'u7l4-eq'));
    const st = hide(stamp(stage, '88.3 m', { ok: true, x: x0 + 330, y: 400, size: 'sm' }));
    return [
      { cap: 'The surveyor’s tool sits on the ground, <b>45 m</b> from the base of the tower.', run: async (c) => { dimD.style.opacity = 1; await c.pop(dimD); } },
      { cap: 'She aims the tool at the top of the tower. It measures <b>63°</b> up from the ground.', run: (c) => tween(c, 1500, (t) => aim(TH * t)) },
      { cap: 'That makes a right triangle. From 63°: the tower <b>h</b> is <b>opp</b>, and the 45 m along the ground is <b>adj</b>.',
        run: async (c) => { tri.style.opacity = 1; adjLn.style.opacity = oppLn.style.opacity = 1; await c.pop(tagO); await c.pop(tagA); } },
      { cap: 'tan 63° = h ÷ 45. h is on the <b>top</b>, so multiply: h = 45 × tan 63°.', run: async (c) => { await c.pop(e[0]); await c.pop(e[1]); } },
      { cap: `Calculator: <b>45 × tan 63 ) ENTER</b> gives ${Ht.toFixed(8)}. The tower is about <b>88.3 m</b> tall.`,
        run: async (c) => { await c.pop(e[2]); await tween(c, 1500, (t) => { setLine(hDim, [base[0] + 44, G], [base[0] + 44, G - Ht * s * t]); hL.textContent = (Ht * t).toFixed(1) + ' m'; hL.setAttribute('y', (G - Ht * s * t / 2).toFixed(1)); }); } },
      { cap: 'Check: at 45° the height would equal the 45 m. 63° is steeper, so the tower must be <b>taller</b> than 45 m. 88.3 > 45 ✓',
        run: async (c) => { lvl.style.opacity = 1; await c.pop(lvl); await c.pop(ck); st.style.opacity = 1; await stampIn(c, st); } }
    ];
  }
};

/* ======================================================================================
 * 4. Check with the other angle (Example 7(b), Full)
 * ====================================================================================== */
const otherAngle = {
  title: 'The other angle gives the same answer',
  height: 420,
  ask: () => `Example 7(b): check ${T('x=12\\div\\tan66^\\circ')} by using the other acute angle.`,
  make(stage, v, ex) {
    const X = 12 / tan(66);
    const R = Geo.rightTri(stage, { x: 0, y: 0, width: 440, height: 420, pad: 76, a: 12, b: X, right: 'br', names: false, theta: 'A', thetaLabel: '66°', sides: { a: '12 ft', b: 'x' } });
    const x0 = 480, dy = 72;
    const e = [T('90^\\circ-66^\\circ=24^\\circ'), T('\\tan24^\\circ=\\dfrac{x}{12}'), T(`x=12\\times\\tan24^\\circ=${cut(12 * tan(24), 3)}`), `Before: ${T(`x=12\\div\\tan66^\\circ=${cut(X, 3)}`)}`]
      .map((s, i) => hide(labL(stage, s, x0, 50 + ((i + 1) % 4) * dy, 'u7l4-eq' + (i === 2 ? ' u7l4-ok' : ''))));
    const st = hide(stamp(stage, 'same answer', { ok: true, x: x0 + 220, y: 50 + 4 * dy + 6, size: 'sm' }));
    let m24 = null;
    return [
      { cap: 'From 66°: 12 is opp and x is adj, so we divided: x = 12 ÷ tan 66° = 5.342…', run: async (c) => { await c.pop(R.tags.opp); await c.pop(R.tags.adj); await c.pop(e[3]); } },
      { cap: 'The angles of a triangle add to 180°, so the other acute angle is 90° − 66° = <b>24°</b>.', run: async (c) => { m24 = markAt(R, 'B', '24°', GREEN); await c.pop(e[0]); } },
      { cap: 'Use 24° as θ. The tags glide: now <b>x is opp</b> and <b>12 is adj</b>.',
        run: async (c) => {
          if (m24) { m24.arc && m24.arc.remove(); m24.label && m24.label.remove(); }
          await R.setTheta(c, 'B', 900);
          R.layers.marks.querySelectorAll('text').forEach((t) => { if (t.textContent === '66°') t.textContent = '24°'; });
          markAt(R, 'A', '66°', GREY);
          await c.pop(e[1]);
        } },
      { cap: 'x is on top, so multiply: x = 12 × tan 24° = 5.342…', run: (c) => c.pop(e[2]) },
      { cap: 'Both ways give 5.342… ft, so x ≈ 5.3 ft ✓', run: async (c) => { st.style.opacity = 1; await stampIn(c, st); } }
    ];
  }
};

/* ======================================================================================
 * 5. Who is correct? Ava, Ben and Cole (Example 9)
 * ====================================================================================== */
const verdict = {
  title: 'Three answers, two checks',
  height: 420,
  ask: () => 'Example 9: a 52° angle, adj = 8 m. Who found the opposite side x correctly?',
  make(stage, v, ex) {
    const X = 8 * tan(52), W = ex.W;
    const R = Geo.rightTri(stage, { x: 0, y: 0, width: 420, height: 420, pad: 76, a: X, b: 8, right: 'br', names: false, theta: 'A', thetaLabel: '52°', sides: { b: '8 m', a: 'x' } });
    tagsOff(R); inkSides(R);
    const x0 = 450, bw = Math.min(400, W - x0 - 60);
    const kid = (name, work, i) => { const e = h('div', 'u7l4-kid', `<b>${name}</b> ${T(work)}<span class="u7l4-why"></span>`); e.style.width = bw + 'px'; add(stage, e, x0, 14 + i * 128); return e; };
    const K = { ava: kid('Ava', 'x=8\\div\\tan52^\\circ=6.3\\text{ m}', 0), ben: kid('Ben', 'x=8\\times\\tan52^\\circ=-48.4\\text{ m}', 1), cole: kid('Cole', 'x=8\\times\\tan52^\\circ=10.2\\text{ m}', 2) };
    const why = (k, s) => { K[k].querySelector('.u7l4-why').innerHTML = s; };
    const S = { ava: hide(stamp(stage, '✗', { ok: false, x: x0 + bw + 30, y: 50 })), ben: hide(stamp(stage, '✗', { ok: false, x: x0 + bw + 30, y: 178 })), cole: hide(stamp(stage, '✓', { ok: true, x: x0 + bw + 30, y: 306 })) };
    const more = hide(lab(stage, `${T('x>8')} m`, 240, 330, 'u7l4-eq u7l4-key'));
    const sIn = async (c, k) => { S[k].style.opacity = 1; await stampIn(c, S[k]); };
    return [
      { cap: 'Label first. From 52°: <b>x is opp</b> (on top) and <b>8 m is adj</b>. So the answer should be 8 × tan 52°.',
        run: async (c) => { colorRole(R, 'opp'); colorRole(R, 'adj'); await c.pop(R.tags.opp); await c.pop(R.tags.adj); } },
      { cap: 'The 45° check: 52° is more than 45°, so opp must be <b>longer</b> than adj. x must be more than 8 m.', run: (c) => c.pop(more) },
      { cap: 'Ben: −48.4 m. A length can’t be <b>negative</b> ✗ His set-up is right, but his calculator was in <b>RAD</b> mode.',
        run: async (c) => { K.ben.classList.add('u7l4-bad'); why('ben', 'negative: his calculator was in RAD mode'); await sIn(c, 'ben'); } },
      { cap: 'Ava: 6.3 m is <b>shorter</b> than 8 m ✗ She divided. Dividing is only right when x is the adj side.',
        run: async (c) => { K.ava.classList.add('u7l4-bad'); why('ava', 'less than 8 m: she divided, but x is opp'); await sIn(c, 'ava'); } },
      { cap: `Cole: 8 × tan 52° = ${(Math.floor(X * 1000) / 1000).toFixed(3)}… ≈ 10.2 m. Positive, and longer than 8 m ✓ Cole is correct.`,
        run: async (c) => { K.cole.classList.add('u7l4-good'); why('cole', 'x on top: multiply, in DEG mode'); await sIn(c, 'cole'); } }
    ];
  }
};

/* ======================================================================================
 * Static figures
 * ====================================================================================== */
const FIG = {
  routine: (host) => Geo.rightTri(host, { width: 330, height: 250, a: 2.6, b: 4, right: 'br', names: false, theta: 'A' }),
  ex1a: (host) => Geo.rightTri(host, { width: 290, height: 230, a: 2.2, b: 3.2, right: 'br', names: false, theta: 'A' }),
  ex1b: (host) => Geo.rightTri(host, { width: 290, height: 230, a: 2.6, b: 2.6, right: 'bl', names: false, theta: 'B' }),
  ex1c: (host) => Geo.rightTri(host, { width: 290, height: 230, a: 3.2, b: 2.4, right: 'tr', rot: 53.13, names: false, theta: 'A' }),
  ex1d: (host) => Geo.rightTri(host, { width: 300, height: 220, a: 2.4, b: 3.6, right: 'br', names: ['A', 'B', 'C'] }),
  ex2(host) {
    const s = figSvg(host, 960, 330), U = 60, base = 270, xs = [0, 250, 550];
    [[2, '1.4 cm', '2.0 cm'], [3, '2.1 cm', '3.0 cm'], [5, '3.5 cm', '5.0 cm']].forEach(([adj, ot, at], i) => {
      const opp = adj * tan(35), Wb = adj * U + 108, Hb = opp * U + 108;
      Geo.rightTri(s, { x: xs[i], y: base + 54 - Hb, width: Wb, height: Hb, unit: U, a: opp, b: adj, right: 'br', names: false, theta: 'A', thetaLabel: '35°', arcR: 26, show: [], colors: false, sides: { a: ot, b: at } });
      txt(s, xs[i] + Wb / 2, base + 52, `Triangle ${i + 1}`, { size: 18, weight: 800, color: '#6e4a1c' });
    });
  },
  ex4: (host) => Geo.rightTri(host, { width: 330, height: 250, a: 8, b: 15, right: 'br', names: ['A', 'B', 'C'], sides: { a: '8 cm', b: '15 cm', c: '17 cm' } }),
  ex5a: (host) => Geo.rightTri(host, { width: 400, height: 250, a: 9 * tan(27), b: 9, right: 'br', names: false, theta: 'A', thetaLabel: '27°', sides: { b: '9.0 cm', a: 'x' } }),
  ex5b: (host) => Geo.rightTri(host, { width: 400, height: 250, a: 3.5, b: 3.5 * tan(58), right: 'bl', names: false, theta: 'B', thetaLabel: '58°', sides: { a: '3.5 m', b: 'x' } }),
  ex7a: (host) => Geo.rightTri(host, { width: 400, height: 250, a: 6.3, b: 6.3 / tan(40), right: 'bl', names: false, theta: 'A', thetaLabel: '40°', sides: { a: '6.3 cm', b: 'x' } }),
  ex7b: (host) => Geo.rightTri(host, { width: 400, height: 250, a: 12, b: 12 / tan(66), right: 'br', names: false, theta: 'A', thetaLabel: '66°', sides: { a: '12 ft', b: 'x' } }),
  ex8(host) {
    Geo.rightTri(host, { width: 380, height: 200, pad: [46, 118, 56, 30], a: 1.15, b: 5.6, right: 'br', names: false, theta: 'A', thetaLabel: '4.8°', sides: { a: '0.48 m', b: 'x', c: 'ramp' } });
    host.appendChild(h('div', 'u7l4-note', '(not to scale)')).style.textAlign = 'center';
  },
  ex9: (host) => Geo.rightTri(host, { width: 320, height: 280, a: 8 * tan(52), b: 8, right: 'br', names: false, theta: 'A', thetaLabel: '52°', sides: { b: '8 m', a: 'x' }, show: [], colors: false }),
  ex6(host) {
    const s = figSvg(host, 300, 320), G = 290, tool = [70, G], base = [170, G], top = [170, G - 100 * tan(63)];
    svgEl('rect', { x: 0, y: 0, width: 300, height: G, fill: '#f2f6fc', rx: 8 }, s);
    line(s, [10, G], [290, G], { color: '#8a6f4d', width: 3, cls: '' });
    path(s, `M${base[0] - 6} ${G}L${top[0]} ${top[1]}L${base[0] + 6} ${G}`, { stroke: '#b9a3e3', width: 2, cls: '' });
    line(s, base, top, { width: 4.5, cls: '' });
    line(s, tool, top, { width: 2.4, cls: '' });
    sqMark(s, base, [-1, 0], [0, -1], 12);
    path(s, Geo.arcD(tool, 34, 0, 63), { stroke: AMBER, width: 2.4, cls: '' });
    txt(s, ...Geo.at(tool, 31.5, 54), '63°', { size: 17, color: AMBER });
    txt(s, (tool[0] + base[0]) / 2, G + 16, '45 m', { size: 18 });
    txt(s, base[0] + 22, (G + top[1]) / 2, 'h', { size: 22, italic: true, color: RED, anchor: 'start' });
    txt(s, tool[0], G - 16, 'tool', { size: 14, color: '#6a7182' });
  }
};
document.querySelectorAll('.u7l4-fig[data-fig]').forEach((host) => { const f = FIG[host.dataset.fig]; if (f) f(host); });

/* ======================================================================================
 * Math History: the tangent as a shadow on a wall
 * ====================================================================================== */
function histAnim() {
  const svg = document.getElementById('u7l4-hist'); if (!svg) return;
  const NS = 'http://www.w3.org/2000/svg', mk = (t, a, p = svg) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); p.appendChild(e); return e; };
  mk('rect', { x: 0, y: 0, width: 600, height: 300, rx: 14, fill: '#fffaf1' });
  const WX = 430, SY = 140, L = 110, TIP = [WX - L, SY];
  mk('rect', { x: WX, y: 14, width: 34, height: 272, fill: '#d9b98f', stroke: '#7a4a26', 'stroke-width': 2.5 });
  for (let y = 40; y < 286; y += 26) mk('line', { x1: WX, x2: WX + 34, y1: y, y2: y, stroke: '#b9946a', 'stroke-width': 1.5 });
  const raysG = mk('g', {});
  const shadow = mk('line', { x1: WX + 1, x2: WX + 1, y1: SY, y2: SY, stroke: '#4a2c14', 'stroke-width': 7, 'stroke-linecap': 'butt', opacity: 0.75 });
  mk('line', { x1: TIP[0], y1: SY, x2: WX, y2: SY, stroke: '#7a4a26', 'stroke-width': 7, 'stroke-linecap': 'round' });
  const ray = mk('line', { x1: 0, y1: 0, x2: 0, y2: 0, stroke: '#b07a12', 'stroke-width': 3 });
  const sun = mk('circle', { cx: 0, cy: 0, r: 20, fill: '#f2c14e', stroke: '#b07a12', 'stroke-width': 2.5 });
  const arc = mk('path', { d: '', fill: 'none', stroke: '#b07a12', 'stroke-width': 2.5 });
  const aT = mk('text', { x: 0, y: 0, 'font-family': 'Georgia, serif', 'font-size': 17, fill: '#7a4a26', 'text-anchor': 'middle' });
  const stickT = mk('text', { x: (TIP[0] + WX) / 2, y: SY - 14, 'font-family': 'Georgia, serif', 'font-size': 17, fill: '#4a2c14', 'text-anchor': 'middle' }); stickT.textContent = 'stick';
  const shT = mk('text', { x: WX + 44, y: 0, 'font-family': 'Georgia, serif', 'font-size': 17, fill: '#4a2c14' }); shT.textContent = 'shadow';
  const cap = mk('text', { x: 24, y: 172, 'font-family': 'Georgia, serif', 'font-size': 20, fill: '#4a2c14' });
  const r1 = mk('text', { x: 24, y: 222, 'font-family': 'Georgia, serif', 'font-size': 20, fill: '#7a4a26' });
  const r2 = mk('text', { x: 24, y: 258, 'font-family': 'Georgia, serif', 'font-size': 24, fill: '#b07a12', 'font-weight': 700 });
  const tanD = (d) => Math.tan(d * Math.PI / 180), clamp = (t) => Math.max(0, Math.min(1, t)), ease = (t) => t * t * (3 - 2 * t);
  const draw = (sTime) => {
    let a; if (sTime < 3) a = 15 + 35 * ease(clamp(sTime / 3)); else if (sTime < 5.5) a = 50 - 15 * ease(clamp((sTime - 3) / 2.5)); else a = 35;
    const u = [Math.cos(a * Math.PI / 180), Math.sin(a * Math.PI / 180)], yS = SY + L * tanD(a);
    sun.setAttribute('cx', (TIP[0] - 165 * u[0]).toFixed(1)); sun.setAttribute('cy', (SY - 165 * u[1]).toFixed(1));
    ray.setAttribute('x1', (TIP[0] - 145 * u[0]).toFixed(1)); ray.setAttribute('y1', (SY - 145 * u[1]).toFixed(1)); ray.setAttribute('x2', WX); ray.setAttribute('y2', yS.toFixed(1));
    raysG.innerHTML = '';
    [-44, 44].forEach((off) => {   // two more parallel sun rays, beside the one through the tip
      const P0 = [TIP[0] + off * u[1], SY - off * u[0]], t = (WX - 3 - P0[0]) / u[0], E = [P0[0] + t * u[0], P0[1] + t * u[1]];
      if (E[1] > 286) return;
      mk('line', { x1: (P0[0] - 120 * u[0]).toFixed(1), y1: (P0[1] - 120 * u[1]).toFixed(1), x2: E[0].toFixed(1), y2: E[1].toFixed(1), stroke: '#f2c14e', 'stroke-width': 2, opacity: 0.85 }, raysG);
    });
    shadow.setAttribute('y2', yS.toFixed(1)); shT.setAttribute('y', ((SY + yS) / 2 + 6).toFixed(1));
    const A0 = [TIP[0] + 30, SY], A1 = [TIP[0] + 30 * u[0], SY + 30 * u[1]];
    arc.setAttribute('d', `M${A0[0]} ${A0[1]}A30 30 0 0 1 ${A1[0].toFixed(1)} ${A1[1].toFixed(1)}`);
    aT.setAttribute('x', (TIP[0] + 48 * Math.cos(a / 2 * Math.PI / 180)).toFixed(1)); aT.setAttribute('y', (SY + 48 * Math.sin(a / 2 * Math.PI / 180) + 6).toFixed(1)); aT.textContent = Math.round(a) + '°';
    cap.textContent = sTime < 5.5 ? 'Higher sun, longer shadow' : 'The sun is 35° up';
    r1.textContent = `shadow ÷ stick = ${tanD(Math.round(a)).toFixed(2)}`;
    r2.textContent = sTime >= 6 ? '= tan 35°' : '';
  };
  let raf = 0;
  const play = () => {
    cancelAnimationFrame(raf);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { draw(12); return; }
    const t0 = performance.now(); const tick = (now) => { const s = (now - t0) / 1000; draw(s); if (s < 10) raf = requestAnimationFrame(tick); }; raf = requestAnimationFrame(tick);
  };
  draw(12);
  svg.addEventListener('click', play);
  const btn = svg.closest('.hist-anim') && svg.closest('.hist-anim').querySelector('.hist-play'); if (btn) btn.addEventListener('click', play);
  let seen = false;
  new IntersectionObserver((es) => { es.forEach((e) => { if (e.isIntersecting && !seen) { seen = true; play(); } }); }, { threshold: 0.5 }).observe(svg);
}

/* ======================================================================================
 * Stand Up Break
 * ====================================================================================== */
function triFig(o) { const d = document.createElement('div'); Geo.rightTri(d, Object.assign({ width: 300, height: 210, names: false, theta: 'A', show: [], colors: false, right: 'br' }, o)); return d.innerHTML; }
const f1 = (v) => v.toFixed(1);
standup('u7l4', {
  intro: 'Label opp, adj and hyp first. Write tan θ = opp ÷ adj, then solve. Round to the nearest tenth, and check.',
  levels: {
    BEG: (r) => {
      let th; do { th = r.int(15, 75); } while (Math.abs(th - 45) < 3);
      const adj = r.int(4, 30), u = r.pick(['cm', 'm']), x = adj * tan(th);
      return { text: `A right triangle has a <b>${th}°</b> angle. The side <b>adjacent</b> to it is <b>${adj} ${u}</b>. Find the <b>opposite</b> side, <i>x</i>.`, q: '',
        fig: triFig({ a: x, b: adj, thetaLabel: th + '°', sides: { b: `${adj} ${u}`, a: 'x' } }),
        a: [`\\tan${th}^\\circ=\\dfrac{x}{${adj}}`, `x=${adj}\\times\\tan${th}^\\circ`, `x\\approx${f1(x)}\\text{ ${u}}`] };
    },
    PRG: (r) => {
      let th; do { th = r.int(15, 75); } while (Math.abs(th - 45) < 3);
      const opp = r.int(4, 30), u = r.pick(['cm', 'm', 'ft']), x = opp / tan(th);
      return { text: `A right triangle has a <b>${th}°</b> angle. The side <b>opposite</b> it is <b>${opp} ${u}</b>. Find the <b>adjacent</b> side, <i>x</i>.`, q: '',
        fig: triFig({ a: opp, b: x, thetaLabel: th + '°', sides: { a: `${opp} ${u}`, b: 'x' } }),
        a: [`\\tan${th}^\\circ=\\dfrac{${opp}}{x}`, `x=\\dfrac{${opp}}{\\tan${th}^\\circ}`, `x\\approx${f1(x)}\\text{ ${u}}`] };
    },
    MAS: (r) => r.pick([
      () => { const d = r.int(20, 60), th = r.int(25, 65), hh = d * tan(th);
        return { text: `From a point on the ground <b>${d} m</b> from the base of a grain elevator, the angle up to its top is <b>${th}°</b>. How tall is the grain elevator?`, q: '',
          a: [`\\tan${th}^\\circ=\\dfrac{h}{${d}}`, `h=${d}\\times\\tan${th}^\\circ`, `h\\approx${f1(hh)}\\text{ m}`] }; },
      () => { const hh = r.int(15, 60), th = r.int(20, 70), d = hh / tan(th);
        return { text: `A drone hovers <b>${hh} m</b> straight above the centre spot of a soccer field. From where Sam stands on the field, the angle up to the drone is <b>${th}°</b>. How far is Sam from the centre spot?`, q: '',
          a: [`\\tan${th}^\\circ=\\dfrac{${hh}}{d}`, `d=\\dfrac{${hh}}{\\tan${th}^\\circ}`, `d\\approx${f1(d)}\\text{ m}`] }; },
      () => { const rise = r.pick([1.2, 1.5, 1.8, 2.4, 3]), th = r.int(12, 30), d = rise / tan(th);
        return { text: `A conveyor belt at a recycling plant lifts boxes <b>${rise} m</b>. It slopes up at <b>${th}°</b>. How far along the floor does it reach?`, q: '',
          a: [`\\tan${th}^\\circ=\\dfrac{${rise}}{d}`, `d=\\dfrac{${rise}}{\\tan${th}^\\circ}`, `d\\approx${f1(d)}\\text{ m}`] }; }
    ])()
  }
});

/* =============================== wiring =============================== */
quickFire();
histAnim();
mountExplainers({ labels, discover, whyK, tanSweep, tanAB, solveMul: solver('mul'), tower, solveDiv: solver('div'), otherAngle, verdict });
