/* Math 10-3 · Unit 7 · Lesson 8 — Finding Angles with Inverse Trig Ratios.
 * Explainers (Class view unless marked Full): the inverse "undo" machine (tan 35° ⇄ 0.7002, sin⁻¹ 0.5, cos⁻¹ 0.2), the
 * inverse keys on the TI-30XIIS with rounding to the nearest degree (Example 1 and 2 checks), the −1 is not a power
 * (Full), Maya's rounded ratio side by side (Example 2(d)), the 4-step routine on a right triangle with a SOH CAH TOA
 * chooser (Example 3 checks), the other acute angle with the opp/adj tags swapping (Examples 4 and 5), why the acute
 * angles add to 90° (Full), where the 45°/30°/60° benchmarks come from (Full), three students' mistakes with verdict
 * stamps (Example 6), and angles on the job: ladder, ramp gauge, roof pitch, drone (Examples 7 and 8).
 * Also the hands-on ramp you tilt (all three inverse ratios update), the static figures and the Stand Up Break. */
import { h, add, tex, svgEl, tween, anim, pop, stamp, stampIn, pulse, mountExplainers } from '../blocks.js';
import { Geo } from '../geo.js';
import { standup } from '../standup.js';

const A = Geo.at, arcD = Geo.arcD, wedgeD = Geo.wedgeD;
const INK = '#1c2230', BLUE = '#1f5bd6', GREEN = '#12805a', RED = '#c93a33', AMBER = '#c27a0e', PURPLE = '#7b4fc4', BROWN = '#9a6a24', GREY = '#9aa0ab', SLATE = '#3a4254';
const OPP = Geo.ROLE_COLORS.opp, ADJ = Geo.ROLE_COLORS.adj, HYP = Geo.ROLE_COLORS.hyp;
const T = (s) => tex(String(s));
const DEG = 180 / Math.PI;
const INV = { sin: (x) => Math.asin(x) * DEG, cos: (x) => Math.acos(x) * DEG, tan: (x) => Math.atan(x) * DEG };
const FWD = { sin: (d) => Math.sin(d / DEG), cos: (d) => Math.cos(d / DEG), tan: (d) => Math.tan(d / DEG) };
/** the calculator's 10-digit display */
const calcStr = (v) => String(Number(v.toPrecision(10)));
/** "38.68…" the way the booklet writes it (cut, not rounded) */
const cut = (v, dp = 2) => (Math.floor(v * 10 ** dp + 1e-9) / 10 ** dp).toFixed(dp);
const dots = (v, dp = 2) => cut(v, dp) + '\\ldots';
const r1 = (v) => (Math.round(v * 10) / 10).toFixed(1);
const nd = (v) => Math.round(v);
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const show = (c, el, ms = 350) => anim(c, el, [{ opacity: 0 }, { opacity: 1 }], ms);
const op = (c, el, to, ms = 350) => anim(c, el, [{ opacity: to }], ms);
const stageSvg = (stage, W, H) => add(stage, svgEl('svg', { class: 'u7l8-svg', width: W, height: H, viewBox: `0 0 ${W} ${H}` }), 0, 0);
/** an HTML label centred on (x, y): a 0×0 holder (so pop's scale doesn't undo the centring) */
function lab(host, html, x, y, cls = '') {
  const hold = h('div', 'u7l8-hold'); hold.appendChild(h('div', 'u7l8-lab ' + cls, html)); add(host, hold, x, y); hold.inner = hold.firstChild; return hold;
}
/** a left-aligned line of working at (x, y), hidden until shown */
const wl = (host, html, x, y, cls = '') => hide(add(host, h('div', 'u7l8-wl ' + cls, html), x, y));
function line(parent, P, Q, o = {}) {
  return svgEl('line', { x1: P[0].toFixed(2), y1: P[1].toFixed(2), x2: Q[0].toFixed(2), y2: Q[1].toFixed(2), stroke: o.color || INK, 'stroke-width': o.width || 3.2, 'stroke-linecap': o.cap || 'round', 'stroke-dasharray': o.dash || null, opacity: o.opacity ?? null }, parent);
}
function path(parent, d, o = {}) {
  return svgEl('path', { d, fill: o.fill || 'none', 'fill-opacity': o.fo ?? null, stroke: o.stroke === undefined ? INK : o.stroke, 'stroke-width': o.width || 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-dasharray': o.dash || null, opacity: o.opacity ?? null }, parent);
}
const setLine = (el, P, Q) => { el.setAttribute('x1', P[0].toFixed(2)); el.setAttribute('y1', P[1].toFixed(2)); el.setAttribute('x2', Q[0].toFixed(2)); el.setAttribute('y2', Q[1].toFixed(2)); };
const polyD = (pts, closed = true) => 'M' + pts.map((p) => p[0].toFixed(2) + ' ' + p[1].toFixed(2)).join('L') + (closed ? 'Z' : '');
const txt = (parent, x, y, s, o = {}) => Geo.text(parent, x, y, s, Object.assign({ size: 20 }, o));
const sq = (parent, V, d, s = 16, colr = INK) => { const u = A([0, 0], d, 1), v = A([0, 0], d + 90, 1); return path(parent, polyD([[V[0] + u[0] * s, V[1] + u[1] * s], [V[0] + (u[0] + v[0]) * s, V[1] + (u[1] + v[1]) * s], [V[0] + v[0] * s, V[1] + v[1] * s]], false), { width: 2.2, stroke: colr }); };
const svgBox = (host, W, H) => { host.style.width = W + 'px'; host.style.height = H + 'px'; return svgEl('svg', { class: 'geo-svg u7l8-svg', width: W, height: H, viewBox: `0 0 ${W} ${H}` }, host); };
const fn1 = (f) => `\\${f}^{-1}`;
const FRAC = (n, d) => `\\tfrac{${n}}{${d}}`;
const KEYS = (s) => `<span class="keys">${s}</span>`;

/* ---------- a small TI-30XIIS screen ---------- */
function lcd(stage, x, y, w, title) {
  const el = add(stage, h('div', 'u7l8-lcd', `${title ? `<div class="u7l8-lcdt">${title}</div>` : ''}<div class="u7l8-scr"><div class="u7l8-ind"><span class="u7l8-i2">2nd</span><span class="u7l8-im">DEG</span></div><div class="u7l8-e">&nbsp;</div><div class="u7l8-r">&nbsp;</div></div>`), x, y);
  el.style.width = w + 'px';
  const q = (s) => el.querySelector(s), E = q('.u7l8-e'), R = q('.u7l8-r'), M = q('.u7l8-im'), S2 = q('.u7l8-i2');
  S2.style.visibility = 'hidden';
  const api = {
    el, text: '',
    entry(s) { api.text = s; E.innerHTML = s ? s.replace(/⁻¹/g, '<sup>-1</sup>') : '&nbsp;'; },
    result(s, err) { R.innerHTML = s || '&nbsp;'; R.classList.toggle('u7l8-err', !!err); },
    mode(m) { M.textContent = m; M.classList.toggle('u7l8-rad', m !== 'DEG'); },
    second(on) { S2.style.visibility = on ? 'visible' : 'hidden'; },
    async type(c, s, ms = 85) { if (!c || c.fast) { api.entry(api.text + s); return; } for (const ch of s) { api.entry(api.text + ch); await c.sleep(ms); } },
    async flash(c) { await pulse(c, M, 1.35, 520); }
  };
  return api;
}
/** a row of drawn keys (not buttons: just a picture); press(c, name) lights one */
function keyRow(stage, x, y, names) {
  const row = add(stage, h('div', 'u7l8-keys'), x, y), K = {};
  names.forEach((n) => { const k = h('div', 'u7l8-key' + (n === '2nd' ? ' u7l8-k2' : n === 'ENTER' ? ' u7l8-ke' : ''), n.replace(/^(sin|cos|tan)$/, (m) => m.toUpperCase())); if (/^(sin|cos|tan)$/.test(n)) k.insertAdjacentHTML('afterbegin', `<small>${n.toUpperCase()}<sup>-1</sup></small>`); row.appendChild(k); K[n] = k; });
  return { row, K, async press(c, n) { const k = K[n]; if (!k || !c || c.fast) return; k.classList.add('on'); await c.sleep(330); k.classList.remove('on'); await c.sleep(90); } };
}
/** type "2nd fn number ) ENTER" on a screen; returns the result (DOMAIN error for |x| > 1 with sin/cos) */
async function runInverse(c, L, K, f, arg, val, mode = 'DEG') {
  if (K) await K.press(c, '2nd'); L.second(true); if (c && !c.fast) await c.sleep(120);
  if (K) await K.press(c, f); L.second(false); L.entry(''); await L.type(c, `${f}⁻¹(`, 40);
  await L.type(c, arg.replace(/\s/g, ''));
  if (K) await K.press(c, ')'); await L.type(c, ')', 10);
  if (K) await K.press(c, 'ENTER');
  if (val == null || Number.isNaN(val)) { L.entry(''); L.result('DOMAIN ERROR', true); return null; }
  L.result(calcStr(mode === 'RAD' ? val / DEG : val));
  return val;
}

/* ---------- a 1-unit rounding number line: which whole degree is closer? ---------- */
function roundLine(svg, x0, y, w, v) {
  const lo = Math.floor(v), t = v - lo, near = t < 0.5 ? lo : lo + 1, g = svgEl('g', {}, svg);
  line(g, [x0, y], [x0 + w, y], { width: 3, color: SLATE });
  [0, 1].forEach((k) => { line(g, [x0 + k * w, y - 12], [x0 + k * w, y + 12], { width: 3, color: SLATE }); txt(g, x0 + k * w, y + 30, (lo + k) + '°', { size: 21, color: (lo + k) === near ? GREEN : SLATE, weight: (lo + k) === near ? 800 : null }); });
  line(g, [x0 + w / 2, y - 8], [x0 + w / 2, y + 8], { width: 2, color: GREY, dash: '3 4' });
  const px = x0 + t * w, d = svgEl('circle', { cx: px.toFixed(1), cy: y, r: 8, fill: RED }, g);
  const tl = txt(g, px, y - 24, cut(v, 2) + '…', { size: 18, color: RED });
  const ar = svgEl('circle', { cx: (x0 + (near - lo) * w).toFixed(1), cy: y, r: 17, fill: 'none', stroke: GREEN, 'stroke-width': 3 }, g);
  return { g, d, tl, ar, near };
}

/* ======================================================================================
 * 1. The inverse undoes the trig key: a machine
 * ====================================================================================== */
const UNDO = {
  tan: { f: 'tan', deg: 35, ratio: '0.7002', start: 'angle', back: '35°', approx: false },
  sin: { f: 'sin', deg: 30, ratio: '0.5', start: 'ratio', back: '30°', approx: false },
  cos: { f: 'cos', deg: INV.cos(0.2), ratio: '0.2', start: 'ratio', back: '78°', approx: true }
};
const undo = {
  title: 'The inverse key undoes the trig key',
  height: 370,
  choices: [{ v: 'tan', label: `${T('\\tan35^\\circ')} and back` }, { v: 'sin', label: T('\\sin^{-1}(0.5)') }, { v: 'cos', label: T('\\cos^{-1}(0.2)') }],
  ask: (v) => (v === 'tan' ? `${T('\\tan35^\\circ\\approx0.7002')}. Can we get from 0.7002 back to the angle?` : v === 'sin' ? 'Which angle has a sine of 0.5?' : 'Which angle has a cosine of 0.2?'),
  make(stage, v, ex) {
    const W = ex.W, H = 370, d = UNDO[v], svg = stageSvg(stage, W, H), ox = (W - 960) / 2;
    const angBox = [ox + 20, 70, 270, 220], ratBox = [ox + 690, 70, 250, 220];
    [angBox, ratBox].forEach((b) => svgEl('rect', { x: b[0], y: b[1], width: b[2], height: b[3], rx: 18, fill: '#fff', stroke: '#d6cdbb', 'stroke-width': 2.5 }, svg));
    txt(svg, angBox[0] + angBox[2] / 2, 46, 'angle', { size: 22, color: AMBER, weight: 800 });
    txt(svg, ratBox[0] + ratBox[2] / 2, 46, 'ratio', { size: 22, color: BLUE, weight: 800 });
    // the angle picture
    const V = [angBox[0] + 40, angBox[1] + 160], L = 150;
    line(svg, V, A(V, 0, L), { width: 4 });
    const arm = line(svg, V, A(V, 0, L), { width: 4, color: AMBER }), arc = path(svg, '', { stroke: AMBER, width: 3 });
    const angTxt = txt(svg, angBox[0] + angBox[2] / 2, angBox[1] + 196, '', { size: 30, weight: 800, color: AMBER });
    const setAng = (deg) => { setLine(arm, V, A(V, deg, L)); arc.setAttribute('d', deg > 0.5 ? arcD(V, 52, 0, deg) : ''); };
    setAng(0);
    // the machine
    const mx = ox + 330, mw = 320, my = 95, mh = 170;
    svgEl('rect', { x: mx, y: my, width: mw, height: mh, rx: 22, fill: '#f5ecdf', stroke: BROWN, 'stroke-width': 4 }, svg);
    [[mx + 30, my + mh], [mx + mw - 30, my + mh]].forEach((p) => svgEl('circle', { cx: p[0], cy: p[1] + 8, r: 12, fill: SLATE }, svg));
    const mLab = lab(stage, '', mx + mw / 2, my + mh / 2, 'u7l8-mach');
    const setM = (inv) => { mLab.inner.innerHTML = T(inv ? fn1(d.f) : `\\${d.f}`); };
    // arrows (forward → or backward ←)
    const arrF = svgEl('g', {}, svg), arrB = svgEl('g', {}, svg);
    const arrow = (g, x1, x2, colr) => { line(g, [x1, 180], [x2, 180], { width: 5, color: colr }); const s = Math.sign(x2 - x1); path(g, `M${x2 - s * 16} 168 L${x2} 180 L${x2 - s * 16} 192`, { stroke: colr, width: 5 }); };
    arrow(arrF, angBox[0] + angBox[2] + 6, mx - 8, BLUE); arrow(arrF, mx + mw + 8, ratBox[0] - 6, BLUE);
    arrow(arrB, ratBox[0] - 6, mx + mw + 8, AMBER); arrow(arrB, mx - 8, angBox[0] + angBox[2] + 6, AMBER);
    hide(arrF, arrB);
    const ratTxt = lab(stage, '', ratBox[0] + ratBox[2] / 2, ratBox[1] + 110, 'u7l8-big');
    const token = lab(stage, '', W / 2, 180, 'u7l8-token'); hide(token);
    const slide = async (c, html, x1, x2) => { token.inner.innerHTML = html; token.style.opacity = 1; token.style.top = '180px'; await tween(c, 800, (t) => { token.style.left = (x1 + (x2 - x1) * t) + 'px'; }); token.style.opacity = 0; };
    const note = lab(stage, '', W / 2, 330, 'u7l8-note'); hide(note);
    const st = hide(stamp(stage, 'undo!', { ok: true, x: angBox[0] + angBox[2] - 20, y: angBox[1] + 16, size: 'sm' }));
    const angIn = async (c, deg, label) => { angTxt.textContent = label; await tween(c, 900, (t) => setAng(deg * t)); };
    const fwd = async (c, ratio) => { arrF.style.opacity = 1; arrB.style.opacity = 0; setM(false); await slide(c, `${Math.round(d.deg * 100) / 100 === d.deg ? d.deg : cut(d.deg, 2)}°`, angBox[0] + angBox[2] / 2, mx + mw / 2); await pulse(c, mLab, 1.15, 400); ratTxt.inner.innerHTML = ratio; await pop(c, ratTxt); };
    const bwd = async (c) => { arrF.style.opacity = 0; arrB.style.opacity = 1; setM(true); await pulse(c, mLab, 1.2, 450); await slide(c, d.ratio, ratBox[0] + ratBox[2] / 2, mx + mw / 2); await pulse(c, mLab, 1.15, 400); };
    setM(d.start === 'ratio');
    if (v === 'tan') {
      return [
        { cap: 'Lessons 4 to 7: start with an <b>angle</b>, 35°, and put it into the <b>tan</b> machine.', run: async (c) => { await angIn(c, 35, '35°'); arrF.style.opacity = 1; await show(c, arrF); } },
        { cap: `Out comes a <b>ratio</b>: ${T('\\tan35^\\circ\\approx0.7002')}.`, run: (c) => fwd(c, '0.7002') },
        { cap: `Now go <b>backwards</b>. The <b>inverse</b> machine, ${T('\\tan^{-1}')}, takes the ratio 0.7002…`, run: async (c) => { setAng(0); angTxt.textContent = ''; await bwd(c); } },
        { cap: `…and gives back the angle: ${T('\\tan^{-1}(0.7002)\\approx35^\\circ')}. <b>Inverse</b> means <b>undo</b>.`, run: async (c) => { await angIn(c, 35, '35°'); note.inner.innerHTML = `like ${T('-5')} undoes ${T('+5')}, and ${T('\\sqrt{\\ }')} undoes squaring`; await show(c, note); await stampIn(c, st); } }
      ];
    }
    ratTxt.inner.innerHTML = d.ratio; arrB.style.opacity = 1;
    return [
      { cap: `We know the <b>ratio</b>: ${T(`\\${d.f}\\theta=${d.ratio}`)}. Put it into the <b>inverse</b> machine, ${T(fn1(d.f))}.`, run: (c) => bwd(c) },
      { cap: d.approx ? `Out comes the angle: ${T(`\\cos^{-1}(0.2)=${dots(d.deg)}`)}, so ${T('\\theta\\approx78^\\circ')}.` : `Out comes the angle: ${T('\\sin^{-1}(0.5)=30^\\circ')}.`, run: (c) => angIn(c, d.deg, d.back) },
      { cap: d.approx ? `Check it forwards: ${T(`\\cos${cut(d.deg, 2)}^\\circ=0.2`)} ✓. Each machine <b>undoes</b> the other.` : `Check it forwards: ${T('\\sin30^\\circ=0.5')} ✓. Each machine <b>undoes</b> the other.`,
        run: async (c) => { ratTxt.style.opacity = 0; await fwd(c, d.ratio); await stampIn(c, st); } }
    ];
  }
};

/* ======================================================================================
 * 1b. The inverse keys, step by step (Example 1 and Example 2 checks)
 * ====================================================================================== */
const KX = {
  demo: { f: 'tan', arg: '0.7002', q: '\\tan\\theta=0.7002', n: '\\theta', dp: 2 },
  a: { f: 'sin', arg: '0.6157', q: '\\sin\\theta=0.6157', n: '\\theta', dp: 4 }, b: { f: 'cos', arg: '0.3420', q: '\\cos\\theta=0.3420', n: '\\theta', dp: 4 },
  c: { f: 'tan', arg: '0.4663', q: '\\tan\\theta=0.4663', n: '\\theta', dp: 4 }, d: { f: 'sin', arg: '0.95', q: '\\sin\\theta=0.95', n: '\\theta', dp: 4 },
  e: { f: 'cos', arg: '0.875', q: '\\cos\\theta=0.875', n: '\\theta', dp: 4 }, f: { f: 'tan', arg: '2.5', q: '\\tan\\theta=2.5', n: '\\theta', dp: 4 },
  A: { f: 'sin', num: 5, den: 8, n: '\\angle A' }, B: { f: 'cos', num: 4, den: 11, n: '\\angle B' }, C: { f: 'tan', num: 12, den: 7, n: '\\angle C' }
};
Object.values(KX).forEach((k) => {
  const x = k.num != null ? k.num / k.den : parseFloat(k.arg); k.val = INV[k.f](x);
  if (k.num != null) { k.arg = `${k.num}/${k.den}`; k.q = `\\${k.f} ${k.n.replace('\\angle ', '')}=\\dfrac{${k.num}}{${k.den}}`; k.inv = `${k.n}=\\${k.f}^{-1}\\!\\left(\\frac{${k.num}}{${k.den}}\\right)`; k.dp = 2; }
  else k.inv = `${k.n}=\\${k.f}^{-1}(${k.arg})`;
});
const keys = {
  title: 'The inverse keys, step by step',
  height: 400, capH: 92,
  choices: [{ v: 'demo', label: T('\\tan^{-1}(0.7002)') }, { sep: 'Example 1 check:' }, ...['a', 'b', 'c', 'd', 'e', 'f'].map((k) => ({ v: k, label: `(${k})` })),
    { sep: 'Example 2 check:' }, { v: 'A', label: '(a)' }, { v: 'B', label: '(b)' }, { v: 'C', label: '(c)' }],
  ask: (v) => { const k = KX[v]; return k.num != null ? `${T(k.q)}. Find ${T(k.n)} to the nearest degree.` : `${T(k.q)}. Find ${T('\\theta')} to the nearest degree.`; },
  make(stage, v, ex) {
    const W = ex.W, k = KX[v], svg = stageSvg(stage, W, 400), ox = (W - 960) / 2, frac = k.num != null;
    const L = lcd(stage, ox + 20, 18, 440);
    const K = keyRow(stage, ox + 20, 168, ['2nd', 'sin', 'cos', 'tan', '÷', ')', 'ENTER']);
    const X = ox + 520;
    const l1 = wl(stage, T(k.q), X, 18, 'u7l8-wbig'), l2 = wl(stage, T(k.inv), X, 88, 'u7l8-wbig');
    const l3 = wl(stage, T(`${k.n}=${dots(k.val, k.dp)}`), X, 160, 'u7l8-wbig'), l4 = wl(stage, T(`${k.n}\\approx${nd(k.val)}^\\circ`), X, 222, 'u7l8-wbig u7l8-wans');
    const RL = roundLine(svg, ox + 80, 330, 320, k.val); hide(RL.g);
    const lead = lab(stage, 'Round to the nearest degree', ox + 240, 262, 'u7l8-small'); hide(lead);
    const typed = frac ? `${k.num} ÷ ${k.den}` : k.arg;
    return [
      { cap: `Write it with an inverse: ${T(k.inv)}.`, run: async (c) => { await show(c, l1); await show(c, l2); } },
      { cap: `Check the screen says <b>DEG</b>. Press <b>2nd</b>, then <b>${k.f.toUpperCase()}</b>: the screen shows ${k.f}<sup>-1</sup>(.`,
        run: async (c) => { await L.flash(c); await K.press(c, '2nd'); L.second(true); await K.press(c, k.f); L.second(false); await L.type(c, `${k.f}⁻¹(`, 40); } },
      { cap: frac ? `Type the <b>whole fraction</b>, ${k.num} ÷ ${k.den}, close the bracket and press <b>ENTER</b>.` : `Type ${k.arg}, close the bracket ${KEYS('<kbd>)</kbd>')} and press <b>ENTER</b>.`,
        run: async (c) => { if (frac) { await L.type(c, String(k.num)); await K.press(c, '÷'); await L.type(c, '/'); await L.type(c, String(k.den)); } else await L.type(c, k.arg); await K.press(c, ')'); await L.type(c, ')', 10); await K.press(c, 'ENTER'); L.result(calcStr(k.val)); await pulse(c, L.el.querySelector('.u7l8-r'), 1.08, 400); await show(c, l3); } },
      { cap: `Round to the nearest degree: ${cut(k.val, 2)}… is closer to <b>${RL.near}</b> than to ${RL.near === Math.floor(k.val) ? RL.near + 1 : RL.near - 1}. So ${T(`${k.n}\\approx${RL.near}^\\circ`)}.`,
        run: async (c) => { void typed; await show(c, lead); await show(c, RL.g); await show(c, l4); } }
    ];
  }
};

/* ======================================================================================
 * 1x. The −1 is not a power (Full)
 * ====================================================================================== */
const notpower = {
  title: 'tan⁻¹ is not 1 ÷ tan',
  height: 360,
  ask: `Does ${T('\\tan^{-1}(0.7002)')} mean ${T('1\\div0.7002')}?`,
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 960) / 2;
    const L1 = lcd(stage, ox + 20, 30, 430, `${KEYS('<kbd>2nd</kbd><kbd>TAN</kbd>')} the inverse`), L2 = lcd(stage, ox + 510, 30, 430, `${KEYS('<kbd>x⁻¹</kbd>')} one over`);
    const m1 = lab(stage, 'an <b>angle</b>: about 35°', ox + 235, 232, 'u7l8-tag u7l8-tagok'), m2 = lab(stage, 'just a <b>number</b>, not an angle', ox + 725, 232, 'u7l8-tag u7l8-tagno'); hide(m1, m2);
    const s1 = hide(stamp(stage, 'the angle', { ok: true, x: ox + 235, y: 300, size: 'sm' })), s2 = hide(stamp(stage, 'not an angle', { ok: false, x: ox + 725, y: 300, size: 'sm' }));
    return [
      { cap: `${KEYS('<kbd>2nd</kbd><kbd>TAN</kbd>')} 0.7002 ) ENTER: the angle whose tangent is 0.7002. About <b>35°</b>.`, run: async (c) => { await runInverse(c, L1, null, 'tan', '0.7002', INV.tan(0.7002)); await pop(c, m1); } },
      { cap: `The ${KEYS('<kbd>x⁻¹</kbd>')} key does ${T('1\\div0.7002\\approx1.428')}. That is a different button and a different answer.`, run: async (c) => { L2.entry(''); await L2.type(c, '0.7002⁻¹'); L2.result(calcStr(1 / 0.7002)); await pop(c, m2); } },
      { cap: `So the ${T('-1')} in ${T('\\tan^{-1}')} is <b>not</b> a power. It means “undo tan”: ${T('\\tan35^\\circ=0.7002')}, so ${T('\\tan^{-1}(0.7002)=35^\\circ')}.`, run: async (c) => { await stampIn(c, s1); await stampIn(c, s2); } }
    ];
  }
};

/* ======================================================================================
 * 1d. Maya's shortcut: rounding the ratio first (Example 2(d))
 * ====================================================================================== */
const early = {
  title: 'Keep the whole fraction',
  height: 420,
  ask: `Example 2(d): ${T('\\cos B=\\frac4{11}')}. Maya rounded ${T('\\frac4{11}')} to 0.4 first. What angle did she get?`,
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 960) / 2, svg = stageSvg(stage, W, 420);
    const good = INV.cos(4 / 11), bad = INV.cos(0.4);
    const L1 = lcd(stage, ox + 20, 14, 430, 'Keep the whole fraction'), L2 = lcd(stage, ox + 510, 14, 430, 'Maya rounded first');
    const a1 = lab(stage, `${T(`\\angle B\\approx${nd(good)}^\\circ`)}`, ox + 235, 196, 'u7l8-tag u7l8-tagok'), a2 = lab(stage, `${T(`\\angle B\\approx${nd(bad)}^\\circ`)}`, ox + 725, 196, 'u7l8-tag u7l8-tagno'); hide(a1, a2);
    // the ratio number line (0.30 to 0.45)
    const nx0 = ox + 40, nx1 = ox + 440, ny = 330, X = (r) => nx0 + (r - 0.3) / 0.15 * (nx1 - nx0);
    const NL = svgEl('g', {}, svg); hide(NL);
    line(NL, [nx0, ny], [nx1, ny], { width: 3, color: SLATE });
    [0.3, 0.35, 0.4, 0.45].forEach((r) => { line(NL, [X(r), ny - 9], [X(r), ny + 9], { width: 2.5, color: SLATE }); txt(NL, X(r), ny + 28, r.toFixed(2), { size: 17, color: SLATE }); });
    svgEl('circle', { cx: X(4 / 11), cy: ny, r: 8, fill: GREEN }, NL); txt(NL, X(4 / 11), ny - 26, '0.3636…', { size: 18, color: GREEN });
    svgEl('circle', { cx: X(0.4), cy: ny, r: 8, fill: RED }, NL); txt(NL, X(0.4) + 14, ny - 26, '0.4', { size: 18, color: RED });
    path(NL, `M${X(4 / 11)} ${ny + 46} L${X(0.4)} ${ny + 46}`, { stroke: AMBER, width: 3 });
    txt(NL, (X(4 / 11) + X(0.4)) / 2 + 60, ny + 62, 'off by 0.036', { size: 16, color: AMBER });
    txt(NL, (nx0 + nx1) / 2, 262, 'the ratio', { size: 18, color: SLATE, weight: 800 });
    // the two angles
    const V = [ox + 560, 405], R = 150, G = svgEl('g', {}, svg); hide(G);
    line(G, V, A(V, 0, R + 40), { width: 3.5 });
    line(G, V, A(V, good, R), { width: 3.5, color: GREEN }); line(G, V, A(V, bad, R), { width: 3.5, color: RED, dash: '10 7' });
    path(G, arcD(V, 60, 0, bad), { stroke: RED, width: 2.5 }); path(G, arcD(V, 74, 0, good), { stroke: GREEN, width: 2.5 });
    txt(G, ...A(V, good + 2, R + 8), `${cut(good, 2)}°`, { size: 18, color: GREEN, anchor: 'end' }); txt(G, ...A(V, bad - 2, R + 8), `${cut(bad, 2)}°`, { size: 18, color: RED, anchor: 'start' });
    const sOk = hide(stamp(stage, 'keep it', { ok: true, x: ox + 390, y: 200, size: 'sm' })), sNo = hide(stamp(stage, '3° off', { ok: false, x: ox + 880, y: 200, size: 'sm' }));
    return [
      { cap: `Keep the fraction: ${KEYS('<kbd>2nd</kbd><kbd>COS</kbd>')} 4 ÷ 11 ) ENTER gives ${dots(good).replace('\\ldots', '…')}, so ${T(`\\angle B\\approx${nd(good)}^\\circ`)}.`, run: async (c) => { await runInverse(c, L1, null, 'cos', '4/11', good); await pop(c, a1); } },
      { cap: `Maya rounded first: ${T('\\cos^{-1}(0.4)')} gives ${cut(bad, 2)}…, so she got ${T(`${nd(bad)}^\\circ`)}.`, run: async (c) => { await runInverse(c, L2, null, 'cos', '0.4', bad); await pop(c, a2); } },
      { cap: `Why? ${T('4\\div11=0.3636\\ldots')}, but she used 0.4. The <b>ratio</b> moved by about 0.036.`, run: (c) => show(c, NL, 500) },
      { cap: 'That small change turned the angle by about <b>3°</b> (69° → 66°). Keep the whole fraction, or all the decimals, until the end.', run: async (c) => { await show(c, G, 600); await stampIn(c, sOk); await stampIn(c, sNo); } }
    ];
  }
};

/* ======================================================================================
 * 2. Finding an angle from two sides: the 4 steps (Example 3 checks)
 * ====================================================================================== */
const TRI = {
  demo: { tri: { a: 3, c: 5, right: 'bl' }, sides: { a: '3 cm', c: '5 cm' }, f: 'sin', num: '3', den: '5', why: 'opp and hyp' },
  a: { tri: { a: 5, b: 9, right: 'bl' }, sides: { a: '5 cm', b: '9 cm' }, f: 'tan', num: '5', den: '9', why: 'opp and adj' },
  b: { tri: { a: 7, c: 12, right: 'bl', rot: 90, flip: true }, sides: { a: '7 m', c: '12 m' }, f: 'sin', num: '7', den: '12', why: 'opp and hyp' },
  c: { tri: { b: 8.5, c: 11, right: 'bl', rot: 180 }, sides: { b: '8.5 cm', c: '11 cm' }, f: 'cos', num: '8.5', den: '11', why: 'adj and hyp' }
};
Object.values(TRI).forEach((t) => { t.val = INV[t.f](parseFloat(t.num) / parseFloat(t.den)); });
const ROLE_OF = { sin: ['opp', 'hyp'], cos: ['adj', 'hyp'], tan: ['opp', 'adj'] };
const SOH = [['sin', 'SOH', '\\sin\\theta=\\frac{\\text{opp}}{\\text{hyp}}'], ['cos', 'CAH', '\\cos\\theta=\\frac{\\text{adj}}{\\text{hyp}}'], ['tan', 'TOA', '\\tan\\theta=\\frac{\\text{opp}}{\\text{adj}}']];
function chooser(stage, x, y) {
  const row = add(stage, h('div', 'u7l8-soh3'), x, y), C = {};
  SOH.forEach(([f, w, tx]) => { const d = h('div', 'u7l8-sc', `<b>${w}</b>${T(tx.replace(/\\frac/g, '\\dfrac'))}`); row.appendChild(d); C[f] = d; });
  return { row, C, async light(c, f) { Object.entries(C).forEach(([g, d]) => { d.classList.toggle('dim', g !== f); d.classList.toggle('lit', g === f); }); await pulse(c, C[f], 1.08, 450); } };
}
const steps = {
  title: 'Find an angle from two sides: 4 steps',
  height: 420,
  choices: [{ v: 'demo', label: 'opp 3, hyp 5' }, { sep: 'Example 3 check:' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }, { v: 'c', label: '(c)' }],
  ask: (v) => (v === 'demo' ? `A right triangle: the side opposite ${T('\\theta')} is 3 cm and the hypotenuse is 5 cm. Find ${T('\\theta')}.` : `Example 3(${v}): label the two given sides from ${T('\\theta')}, then find ${T('\\theta')} to the nearest degree.`),
  make(stage, v, ex) {
    const W = ex.W, t = TRI[v], ox = (W - 960) / 2;
    const RT = Geo.rightTri(stage, Object.assign({ x: ox, y: 6, width: 480, height: 408, pad: [70, 120, 70, 120], theta: 'A', thetaLabel: 'θ', names: false, sides: t.sides, size: 22 }, t.tri));
    RT.layers.tags.style.opacity = 0; Object.values(RT.sideEls).forEach((e) => e.setAttribute('stroke', INK));
    const X = ox + 500, CH = chooser(stage, X, 16);
    const w1 = wl(stage, `${t.why} → <b>${t.f}</b>`, X, 148, 'u7l8-wmid'), w2 = wl(stage, T(`\\${t.f}\\theta=\\dfrac{${t.num}}{${t.den}}`), X, 192, 'u7l8-wbig');
    const w3 = wl(stage, T(`\\theta=\\${t.f}^{-1}\\!\\left(\\frac{${t.num}}{${t.den}}\\right)`), X, 272, 'u7l8-wbig'), w4 = wl(stage, T(`\\theta=${dots(t.val)}\\approx${nd(t.val)}^\\circ`), X, 344, 'u7l8-wbig u7l8-wans');
    const known = ROLE_OF[t.f];
    return [
      { cap: '<b>Step 1:</b> label the sides from θ. <b class="u7l8-hyp">hyp</b> is across from the right angle, <b class="u7l8-opp">opp</b> is across from θ, <b class="u7l8-adj">adj</b> touches θ.',
        run: async (c) => { const R = RT.roles(); ['opp', 'adj', 'hyp'].forEach((r) => RT.sideEls[R[r]].setAttribute('stroke', Geo.ROLE_COLORS[r])); await show(c, RT.layers.tags, 500); } },
      { cap: `<b>Step 2:</b> circle the two sides we know: <b>${known[0]}</b> and <b>${known[1]}</b>. They go with <b>${SOH.find((s) => s[0] === t.f)[1]}</b>: use ${t.f}.`,
        run: async (c) => { await RT.highlight(c, known[0]); await RT.highlight(c, known[1]); await CH.light(c, t.f); await show(c, w1); } },
      { cap: `<b>Step 3:</b> write the ratio and put in the two lengths: ${T(`\\${t.f}\\theta=\\frac{${t.num}}{${t.den}}`)}.`, run: (c) => show(c, w2) },
      { cap: `<b>Step 4:</b> use the inverse key: ${T(`\\theta=\\${t.f}^{-1}\\!\\left(\\frac{${t.num}}{${t.den}}\\right)=${dots(t.val)}`)}, so ${T(`\\theta\\approx${nd(t.val)}^\\circ`)}.`, run: async (c) => { await show(c, w3); await show(c, w4); } }
    ];
  }
};

/* ======================================================================================
 * 3. The other acute angle, and checking (Examples 4 and 5)
 * ====================================================================================== */
function quarter(svg, C, r, a, colA, colB, labA, labB) {
  const g = svgEl('g', {}, svg);
  path(g, wedgeD(C, r, 0, a), { stroke: colA, fill: colA, fo: 0.22, width: 2.5 });
  path(g, wedgeD(C, r, a, 90 - a), { stroke: colB, fill: colB, fo: 0.22, width: 2.5 });
  sq(g, C, 0, 18, INK);
  txt(g, ...A(C, a / 2, r + 12), labA, { size: 20, color: colA, weight: 800, anchor: 'start' });
  txt(g, ...A(C, a + (90 - a) / 2, r + 14), labB, { size: 20, color: colB, weight: 800, anchor: 'start' });
  txt(g, C[0] - 12, C[1] - r / 2, 'together 90°', { size: 17, color: SLATE, anchor: 'end' });
  return g;
}
const other = {
  title: 'The other acute angle, and a check',
  height: 430, capH: 92,
  choices: [{ v: 'ex4', label: 'Example 4' }, { v: 'ex5', label: 'Example 5' }],
  ask: (v) => (v === 'ex4' ? `Example 4: ${T('\\triangle ABC')}, ${T('\\angle C=90^\\circ')}, ${T('a=8')} cm, ${T('b=15')} cm, ${T('c=17')} cm. Find ${T('\\angle A')} and ${T('\\angle B')}, and check.` : `Example 5: ${T('\\triangle PQR')}, ${T('\\angle R=90^\\circ')}, ${T('PQ=14.5')} m, ${T('QR=6.2')} m. Find ${T('\\angle P')} and ${T('\\angle Q')}, and check ${T('\\angle Q')}.`),
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 960) / 2, svg = stageSvg(stage, W, 430), X = ox + 500;
    const e4 = v === 'ex4';
    const RT = Geo.rightTri(stage, e4 ? { x: ox, y: 0, width: 480, height: 330, pad: [40, 70, 56, 140], a: 8, b: 15, right: 'bl', names: ['A', 'B', 'C'], sides: { a: 'a = 8 cm', b: 'b = 15 cm', c: 'c = 17 cm' }, theta: null, thetaLabel: '', size: 20 }
      : { x: ox, y: 0, width: 480, height: 330, pad: [40, 150, 56, 60], a: 6.2, c: 14.5, right: 'bl', rot: 180, names: ['P', 'Q', 'R'], sides: { a: '6.2 m', c: '14.5 m' }, theta: null, thetaLabel: '', size: 20 });
    const P1 = e4 ? 'A' : 'P', Q1 = e4 ? 'B' : 'Q';
    const vA = e4 ? INV.tan(8 / 15) : INV.sin(6.2 / 14.5), vB = 90 - vA;
    const vBr = Math.round((90 - Math.round(vA * 100) / 100) * 100) / 100;   // 90 − the angle rounded to 2 places, as written in the booklet
    const lines = e4 ? [
      `\\angle A=\\tan^{-1}\\!\\left(\\dfrac{8}{15}\\right)=${dots(vA)}\\approx28^\\circ`,
      `\\text{check: }\\sin^{-1}\\!\\left(\\dfrac{8}{17}\\right)=${dots(INV.sin(8 / 17))}\\ \\checkmark`,
      `\\angle B=90^\\circ-${(Math.round(vA * 100) / 100).toFixed(2)}^\\circ=${vBr.toFixed(2)}^\\circ\\approx62^\\circ`,
      `\\text{check: }\\tan^{-1}\\!\\left(\\dfrac{15}{8}\\right)=${dots(INV.tan(15 / 8))}\\ \\checkmark`
    ] : [
      `\\angle P=\\sin^{-1}\\!\\left(\\dfrac{6.2}{14.5}\\right)=${dots(vA)}\\approx25^\\circ`,
      `\\angle Q=90^\\circ-${(Math.round(vA * 100) / 100).toFixed(2)}^\\circ=${vBr.toFixed(2)}^\\circ\\approx65^\\circ`,
      `\\text{check: }\\cos^{-1}\\!\\left(\\dfrac{6.2}{14.5}\\right)=${dots(INV.cos(6.2 / 14.5))}\\ \\checkmark`
    ];
    const W1 = lines.map((s, i) => wl(stage, T(s), X, 10 + i * 66, 'u7l8-wmid'));
    const Qd = quarter(svg, [ox + 600, 405], 130, vA, AMBER, PURPLE, `${P1} ≈ ${nd(vA)}°`, `${Q1} ≈ ${nd(vB)}°`); hide(Qd);
    Qd.setAttribute('transform', 'translate(0 0)');
    const ok1 = hide(stamp(stage, 'same', { ok: true, x: ox + 880, y: 330, size: 'sm' })), ok2 = hide(stamp(stage, 'same', { ok: true, x: ox + 880, y: e4 ? 380 : 330, size: 'sm' }));
    if (e4) return [
      { cap: `From ${T('A')}: opp ${T('=a=8')}, adj ${T('=b=15')}. ${T('\\tan A=\\frac{8}{15}')}, so ${T(`\\angle A=${dots(vA)}\\approx28^\\circ`)}.`, run: async (c) => { await RT.setTheta(c, 'A'); await show(c, W1[0]); } },
      { cap: `Check with sine: from ${T('A')}, opp ${T('=8')} and hyp ${T('=17')}. ${T('\\sin^{-1}\\left(\\frac{8}{17}\\right)')} gives the <b>same</b> angle ✓.`, run: async (c) => { await RT.highlight(c, 'hyp'); await show(c, W1[1]); await stampIn(c, ok1); } },
      { cap: `The two acute angles add to 90°: ${T(`\\angle B=90^\\circ-28.07^\\circ=${vBr.toFixed(2)}^\\circ\\approx62^\\circ`)}.`, run: async (c) => { RT.clearHighlight(); await show(c, Qd, 500); await show(c, W1[2]); } },
      { cap: `Now look from ${T('B')}: the tags <b>move</b>. opp and adj <b>swap</b>; the hyp stays.`, run: (c) => RT.setTheta(c, 'B', 900) },
      { cap: `From ${T('B')}: opp ${T('=15')}, adj ${T('=8')}. ${T(`\\tan^{-1}\\left(\\frac{15}{8}\\right)=${dots(INV.tan(15 / 8))}\\approx62^\\circ`)} ✓`, run: async (c) => { await show(c, W1[3]); await stampIn(c, ok2); } }
    ];
    return [
      { cap: `From ${T('P')}: ${T('QR=6.2')} is opp and ${T('PQ=14.5')} is hyp, so use sin. ${T(`\\angle P=${dots(vA)}\\approx25^\\circ`)}.`, run: async (c) => { await RT.setTheta(c, 'A'); await show(c, W1[0]); } },
      { cap: `The acute angles add to 90°: ${T(`\\angle Q=90^\\circ-25.31^\\circ=${vBr.toFixed(2)}^\\circ\\approx65^\\circ`)}.`, run: async (c) => { await show(c, Qd, 500); await show(c, W1[1]); } },
      { cap: `Check from ${T('Q')}: the tags move. Now ${T('QR=6.2')} is <b>adj</b> (it touches ${T('Q')}); the hyp stays.`, run: (c) => RT.setTheta(c, 'B', 900) },
      { cap: `adj and hyp → cos: ${T(`\\cos^{-1}\\left(\\frac{6.2}{14.5}\\right)=${dots(INV.cos(6.2 / 14.5))}\\approx65^\\circ`)} ✓`, run: async (c) => { await show(c, W1[2]); await stampIn(c, ok2); } }
    ];
  }
};

/* ======================================================================================
 * 3x. Why the acute angles add to 90° (Full)
 * ====================================================================================== */
const sum90 = {
  title: 'The two acute angles share 90°',
  height: 380,
  ask: 'Why do the two acute angles of a right triangle always add to 90°?',
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 960) / 2, svg = stageSvg(stage, W, 380);
    const C = [ox + 60, 330], base = 330;
    const tri = path(svg, '', { stroke: INK, width: 3.4, fill: '#f3efe6' }); sq(svg, C, 0, 18);
    const arcA = path(svg, '', { stroke: AMBER, width: 3 }), arcB = path(svg, '', { stroke: PURPLE, width: 3 });
    const tA = txt(svg, 0, 0, 'A', { size: 20, color: AMBER, weight: 800 }), tB = txt(svg, 0, 0, 'B', { size: 20, color: PURPLE, weight: 800 });
    // the "straight line" of 180°
    const O = [ox + 690, 320], R = 160, G = svgEl('g', {}, svg);
    line(G, [O[0] - R - 30, O[1]], [O[0] + R + 30, O[1]], { width: 3, color: SLATE });
    const wC = path(G, wedgeD(O, R, 90, 90), { stroke: GREY, fill: GREY, fo: 0.25, width: 2 }), wA = path(G, '', { stroke: AMBER, fill: AMBER, fo: 0.25, width: 2 }), wB = path(G, '', { stroke: PURPLE, fill: PURPLE, fo: 0.25, width: 2 });
    sq(G, O, 90, 20, SLATE);
    const lC = txt(G, ...A(O, 135, R * 0.6), '90°', { size: 22, color: SLATE, weight: 800 }), lA = txt(G, 0, 0, '', { size: 20, color: AMBER, weight: 800 }), lB = txt(G, 0, 0, '', { size: 20, color: PURPLE, weight: 800 });
    const tot = lab(stage, '', ox + 690, 40, 'u7l8-eq'); hide(G, tot);
    let a = 32;
    function set(deg) {
      a = deg; const P = [C[0] + base, C[1]], Q = [C[0], C[1] - base * Math.tan(deg / DEG)];
      tri.setAttribute('d', polyD([C, P, Q]));
      arcA.setAttribute('d', arcD(P, 46, 180 - deg, deg)); arcB.setAttribute('d', arcD(Q, 40, 270, 90 - deg));
      const pa = A(P, 180 - deg / 2, 72), pb = A(Q, 270 + (90 - deg) / 2, 64);
      ['x', 'y'].forEach((k, i) => { tA.setAttribute(k, pa[i].toFixed(1)); tB.setAttribute(k, pb[i].toFixed(1)); });
      wA.setAttribute('d', wedgeD(O, R, 0, deg)); wB.setAttribute('d', wedgeD(O, R, deg, 90 - deg));
      const la = A(O, deg / 2, R * 0.66), lb = A(O, deg + (90 - deg) / 2, R * 0.66);
      lA.setAttribute('x', la[0].toFixed(1)); lA.setAttribute('y', la[1].toFixed(1)); lA.textContent = Math.round(deg) + '°';
      lB.setAttribute('x', lb[0].toFixed(1)); lB.setAttribute('y', lb[1].toFixed(1)); lB.textContent = Math.round(90 - deg) + '°';
      tot.inner.innerHTML = T(`\\angle A+\\angle B=${Math.round(deg)}^\\circ+${90 - Math.round(deg)}^\\circ=90^\\circ`);
    }
    set(32); wA.style.opacity = 0; wB.style.opacity = 0; lA.style.opacity = 0; lB.style.opacity = 0;
    return [
      { cap: 'In <b>any</b> triangle the three angles add to <b>180°</b>: put them side by side and they make a straight line.', run: (c) => show(c, G, 500) },
      { cap: 'The right angle uses <b>90°</b> of the 180°.', run: (c) => pulse(c, lC, 1.4, 600) },
      { cap: `So ${T('\\angle A')} and ${T('\\angle B')} share the other <b>90°</b>. Other acute angle ${T('=90^\\circ-\\theta')}.`, run: async (c) => { for (const e of [wA, lA, wB, lB]) await show(c, e, 300); await show(c, tot); } },
      { cap: 'Change the triangle: one acute angle grows and the other shrinks. They <b>always</b> add to 90°.', run: async (c) => { await tween(c, 1600, (u) => set(32 + 30 * u)); await tween(c, 1600, (u) => set(62 - 40 * u)); } }
    ];
  }
};

/* ======================================================================================
 * 4. Is it reasonable? Three students (Example 6)
 * ====================================================================================== */
const checks = {
  title: 'Check the three students',
  height: 410, capH: 92,
  choices: [{ v: 'ava', label: '(a) Ava' }, { v: 'ben', label: '(b) Ben' }, { v: 'cara', label: '(c) Cara' }],
  ask: (v) => (v === 'cara' ? `Example 6(c): Cara’s triangle has adj 9.6 m and hyp 15 m. Her ${T('\\cos^{-1}\\left(\\frac{15}{9.6}\\right)')} gives ERROR. What went wrong?`
    : `Example 6(${v === 'ava' ? 'a' : 'b'}): legs 6 m and 11 m; ${T('\\theta')} is across from the 6 m leg. ${v === 'ava' ? `Ava wrote ${T('\\theta=\\tan^{-1}\\left(\\frac{11}{6}\\right)\\approx61^\\circ')}.` : `Ben’s ${T('\\tan^{-1}\\left(\\frac{6}{11}\\right)')} shows 0.4993.`} What went wrong?`),
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 960) / 2, svg = stageSvg(stage, W, 410), cara = v === 'cara';
    // the triangle: θ at P (right), right angle at R (left), the other leg up the left side
    const adj = cara ? 9.6 : 11, opp = cara ? Math.sqrt(15 * 15 - 9.6 * 9.6) : 6, s = cara ? 30 : 38;
    const R = [ox + 40, 370], P = [R[0] + adj * s, R[1]], Q = [R[0], R[1] - opp * s], th = Math.atan(opp / adj) * DEG;
    path(svg, polyD([R, P, Q]), { stroke: INK, width: 3.4, fill: '#f3efe6' }); sq(svg, R, 0, 18);
    path(svg, arcD(P, 54, 180 - th, th), { stroke: AMBER, width: 3 }); txt(svg, ...A(P, 180 - th / 2, 76), 'θ', { size: 22, color: AMBER, weight: 800 });
    txt(svg, (R[0] + P[0]) / 2, R[1] + 24, cara ? '9.6 m (adj)' : '11 m', { size: 19, color: cara ? ADJ : INK });
    if (cara) txt(svg, (P[0] + Q[0]) / 2 + 40, (P[1] + Q[1]) / 2 - 18, '15 m (hyp)', { size: 19, color: HYP }); else txt(svg, R[0] - 8, (R[1] + Q[1]) / 2, '6 m', { size: 19, anchor: 'end' });
    const X = ox + 520;
    const card = add(stage, h('div', 'u7l8-stu', cara ? `<b>Cara:</b> ${T('\\cos^{-1}\\!\\left(\\frac{15}{9.6}\\right)')} → ERROR` : v === 'ava' ? `<b>Ava:</b> ${T('\\theta=\\tan^{-1}\\!\\left(\\frac{11}{6}\\right)\\approx61^\\circ')}` : `<b>Ben:</b> ${T('\\tan^{-1}\\!\\left(\\frac{6}{11}\\right)')} shows 0.4993`), X, 10); hide(card);
    const SP = { ava: [[620, 205], [620, 335]], ben: [[610, 262], [820, 262]], cara: [[640, 350], [840, 350]] }[v];
    const no = hide(stamp(stage, cara ? 'more than 1' : v === 'ava' ? 'too big' : 'RAD mode', { ok: false, x: ox + SP[0][0], y: SP[0][1], size: 'sm' }));
    const yes = hide(stamp(stage, 'fits', { ok: true, x: ox + SP[1][0], y: SP[1][1], size: 'sm' }));
    const rayG = svgEl('g', {}, svg), ray = (deg, colr, dash, label, len = 330) => { const g = svgEl('g', {}, rayG); line(g, P, A(P, 180 - deg, len), { color: colr, width: 3.4, dash }); if (label) txt(g, ...A(P, 180 - deg - 4, len + 6), label, { size: 18, color: colr, weight: 800, anchor: 'end' }); hide(g); return g; };
    if (v === 'ava') {
      const r45 = ray(45, GREY, '8 7', '45°', 300), r61 = ray(61.39, RED, null, '61°', 300), rOk = ray(th, GREEN, null, '');
      const k1 = wl(stage, `opp (6) is <b>shorter</b> than adj (11), so ${T('\\theta<45^\\circ')}. 61° can’t be right: she put <b>adj on top</b>.`, X, 88, 'u7l8-wsm');
      const k2 = wl(stage, T(`\\theta=\\tan^{-1}\\!\\left(\\tfrac{6}{11}\\right)=${dots(th)}\\approx29^\\circ`), X, 258, 'u7l8-wmid');
      return [
        { cap: `Ava’s answer: ${T('\\tan^{-1}\\left(\\frac{11}{6}\\right)\\approx61^\\circ')}. Does 61° fit this triangle?`, run: (c) => show(c, card) },
        { cap: `Quick check: opp (6) is <b>shorter</b> than adj (11), so θ must be <b>less than 45°</b>. A 61° line misses the triangle completely.`, run: async (c) => { await show(c, r45); await show(c, r61); await show(c, k1); await stampIn(c, no); } },
        { cap: `She put <b>adj on top</b>. Fix: ${T(`\\theta=\\tan^{-1}\\left(\\frac{6}{11}\\right)=${dots(th)}\\approx29^\\circ`)}. It runs right along the hypotenuse ✓. (61° is the <b>other</b> acute angle.)`, run: async (c) => { await show(c, rOk); await show(c, k2); await stampIn(c, yes); } }
      ];
    }
    const L = lcd(stage, X, 92, 380);
    if (v === 'ben') {
      const rFlat = ray(0.5, RED, null, '0.5°', 340), rOk = ray(th, GREEN, null, '');
      L.mode('RAD');
      return [
        { cap: 'Ben’s screen shows <b>0.4993</b>. Is the angle really about half a degree?', run: async (c) => { await show(c, card); await runInverse(c, L, null, 'tan', '6/11', th, 'RAD'); } },
        { cap: 'Quick check: a 0.5° angle is almost <b>flat</b>, but this angle looks about 30°. Look at the screen: it says <b>RAD</b>.', run: async (c) => { await show(c, rFlat); await L.flash(c); await stampIn(c, no); } },
        { cap: `Press ${KEYS('<kbd>DRG</kbd>')}, choose <b>DEG</b>, press ENTER, and do it again: ${dots(th).replace('\\ldots', '…')}, so ${T('\\theta\\approx29^\\circ')} ✓.`, run: async (c) => { L.mode('DEG'); await L.flash(c); L.entry(''); L.result(''); await runInverse(c, L, null, 'tan', '6/11', th); await show(c, rOk); await stampIn(c, yes); } }
      ];
    }
    const rOk = ray(th, GREEN, null, '', 300);
    const k1 = wl(stage, `${T('15\\div9.6=1.5625')}, more than 1. But ${T('\\cos=\\frac{\\text{adj}}{\\text{hyp}}')}, and the hyp is the <b>longest</b> side, so the ratio is <b>less than 1</b>.`, X, 228, 'u7l8-wsm');
    return [
      { cap: `Cara types ${KEYS('<kbd>2nd</kbd><kbd>COS</kbd>')} 15 ÷ 9.6 ) ENTER. The screen shows an <b>error</b>.`, run: async (c) => { await show(c, card); await runInverse(c, L, null, 'cos', '15/9.6', null); } },
      { cap: `Quick check: ${T('15\\div9.6')} is <b>more than 1</b>. No angle has a cosine (or sine) more than 1, because the hyp is the longest side.`, run: async (c) => { await show(c, k1); await stampIn(c, no); } },
      { cap: `Put the hyp on the <b>bottom</b>: ${T(`\\theta=\\cos^{-1}\\left(\\frac{9.6}{15}\\right)=${dots(th)}\\approx50^\\circ`)} ✓.`, run: async (c) => { L.entry(''); L.result(''); k1.style.opacity = 0; await runInverse(c, L, null, 'cos', '9.6/15', th); await show(c, rOk); await stampIn(c, yes); } }
    ];
  }
};

/* ======================================================================================
 * 4x. Where the benchmarks come from (Full)
 * ====================================================================================== */
const bench = {
  title: 'Benchmarks: 45°, 30° and 60°',
  height: 400,
  ask: 'How can you tell roughly how big θ is before you use the calculator?',
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 960) / 2, svg = stageSvg(stage, W, 400);
    const P = [ox + 60, 370], adjPx = 200, Rv = [P[0] + adjPx, P[1]];
    const tri = path(svg, '', { stroke: INK, width: 3.4, fill: '#f3efe6' }); sq(svg, Rv, 90, 16);
    const sOpp = line(svg, Rv, Rv, { color: OPP, width: 5 }), sAdj = line(svg, P, Rv, { color: ADJ, width: 5 }), sHyp = line(svg, P, Rv, { color: HYP, width: 5 });
    const arc = path(svg, '', { stroke: AMBER, width: 3 }), tl = txt(svg, 0, 0, 'θ', { size: 22, color: AMBER, weight: 800 });
    const tOpp = txt(svg, 0, 0, 'opp', { size: 18, color: OPP, weight: 800, anchor: 'start' });
    txt(svg, (P[0] + Rv[0]) / 2, P[1] + 22, 'adj', { size: 18, color: ADJ, weight: 800 });
    const tHyp = txt(svg, 0, 0, 'hyp', { size: 18, color: HYP, weight: 800, anchor: 'end' });
    const X = ox + 480;
    const read = lab(stage, '', X + 230, 60, 'u7l8-read');
    const rule = lab(stage, '', X + 230, 200, 'u7l8-tag'); hide(rule);
    let k = 1;
    function set(ratio) {
      k = ratio; const Q = [Rv[0], Rv[1] - adjPx * ratio], th = Math.atan(ratio) * DEG;
      tri.setAttribute('d', polyD([P, Rv, Q])); setLine(sOpp, Rv, Q); setLine(sHyp, P, Q);
      arc.setAttribute('d', arcD(P, 48, 0, th)); const lp = A(P, th / 2, 70); tl.setAttribute('x', lp[0].toFixed(1)); tl.setAttribute('y', lp[1].toFixed(1));
      tOpp.setAttribute('x', (Rv[0] + 10).toFixed(1)); tOpp.setAttribute('y', ((Rv[1] + Q[1]) / 2).toFixed(1));
      const hm = [(P[0] + Q[0]) / 2 - 10, (P[1] + Q[1]) / 2 - 10]; tHyp.setAttribute('x', hm[0].toFixed(1)); tHyp.setAttribute('y', hm[1].toFixed(1));
      const hyp = Math.hypot(1, ratio);
      read.inner.innerHTML = `opp : adj : hyp = <b>${ratio.toFixed(2)} : 1 : ${hyp.toFixed(2)}</b><br>θ = <b>${(Math.round(th * 10) / 10).toFixed(1)}°</b>`;
    }
    set(1);
    const goTo = (c, r, ms = 1200) => { const r0 = k; return tween(c, ms, (u) => set(r0 + (r - r0) * u)); };
    const say = async (c, html, ok) => { rule.inner.innerHTML = html; rule.inner.classList.toggle('u7l8-tagok', !!ok); rule.style.opacity = 1; await pop(c, rule); };
    const t30 = Math.tan(30 / DEG), t60 = Math.tan(60 / DEG);
    return [
      { cap: 'Equal legs: opp = adj. The triangle is half of a square, so θ = <b>45°</b>.', run: (c) => say(c, 'opp = adj → <b>45°</b>', true) },
      { cap: 'Make opp <b>shorter</b> than adj: θ drops <b>below 45°</b>.', run: async (c) => { rule.style.opacity = 0; await goTo(c, 0.45); await say(c, 'opp &lt; adj → <b>less than 45°</b>'); } },
      { cap: 'Make opp <b>longer</b> than adj: θ goes <b>above 45°</b>.', run: async (c) => { rule.style.opacity = 0; await goTo(c, 1.6, 1500); await say(c, 'opp &gt; adj → <b>more than 45°</b>'); } },
      { cap: `When opp is exactly <b>half</b> the hypotenuse, θ = <b>30°</b> (${T('\\sin30^\\circ=0.5')}).`, run: async (c) => { rule.style.opacity = 0; await goTo(c, t30, 1400); await say(c, 'opp = ½ hyp → <b>30°</b>', true); } },
      { cap: `And when adj is half the hypotenuse, θ = <b>60°</b> (${T('\\cos60^\\circ=0.5')}).`, run: async (c) => { rule.style.opacity = 0; await goTo(c, t60, 1400); await say(c, 'adj = ½ hyp → <b>60°</b>', true); } }
    ];
  }
};

/* ======================================================================================
 * 5. Angles on the job (Examples 7 and 8)
 * ====================================================================================== */
/** the ladder scene: wall on the left, ground, a ladder of length Lm leaning out dm from the wall */
function ladderScene(svg, o) {
  const s = o.s, gy = o.gy, wx = o.wx, g = svgEl('g', {}, svg);
  svgEl('rect', { x: wx - 22, y: gy - o.wallH, width: 22, height: o.wallH, fill: '#d9cdb8', stroke: '#7a5124', 'stroke-width': 2 }, g);
  line(g, [wx - 40, gy], [wx + o.groundW, gy], { width: 3.5, color: '#7a5124' });
  sq(g, [wx, gy], 0, 16);
  const lad = svgEl('g', {}, g), rails = [line(lad, [0, 0], [0, 0], { width: 5, color: '#8a5a1c' }), line(lad, [0, 0], [0, 0], { width: 5, color: '#8a5a1c' })], rungs = [];
  for (let i = 1; i < 12; i++) rungs.push(line(lad, [0, 0], [0, 0], { width: 3, color: '#a8763a' }));
  const arc = path(g, '', { stroke: AMBER, width: 3 }), th = txt(g, 0, 0, o.thLabel ?? 'θ', { size: o.size || 20, color: AMBER, weight: 800 });
  const api = { g, arc, th, foot: null, top: null,
    set(deg) {   // the angle with the ground
      const L = o.L * s, foot = [wx + L * Math.cos(deg / DEG), gy], top = [wx, gy - L * Math.sin(deg / DEG)];
      api.foot = foot; api.top = top;
      const u = [(top[0] - foot[0]) / L, (top[1] - foot[1]) / L], n = [-u[1] * 7, u[0] * 7];
      setLine(rails[0], [foot[0] + n[0], foot[1] + n[1]], [top[0] + n[0], top[1] + n[1]]); setLine(rails[1], [foot[0] - n[0], foot[1] - n[1]], [top[0] - n[0], top[1] - n[1]]);
      rungs.forEach((r, i) => { const t = (i + 1) / 12, p = [foot[0] + (top[0] - foot[0]) * t, foot[1] + (top[1] - foot[1]) * t]; setLine(r, [p[0] + n[0], p[1] + n[1]], [p[0] - n[0], p[1] - n[1]]); });
      arc.setAttribute('d', arcD(foot, 34, 180 - deg, deg)); const lp = A(foot, 180 - deg / 2, 54); th.setAttribute('x', lp[0].toFixed(1)); th.setAttribute('y', lp[1].toFixed(1));
    } };
  return api;
}
/** the ramp: foot at the left, true rise exaggerated by ex */
function rampScene(svg, o) {
  const g = svgEl('g', {}, svg), F = [o.x0, o.gy], ang = Math.asin(o.rise / o.len) * DEG, run = o.len * Math.cos(ang / DEG);
  const P = (rise) => [o.x0 + run * o.s, o.gy - rise * o.s * o.ex];
  const fill = path(g, '', { stroke: INK, width: 3, fill: '#e4ddd0' }), sqm = sq(g, [o.x0 + run * o.s, o.gy], 90, 14);
  const arc = path(g, '', { stroke: AMBER, width: 3 }), th = txt(g, o.x0 + 92, o.gy - 14, 'θ', { size: 20, color: AMBER, weight: 800 });
  const api = { g, arc, th, sqm, run,
    set(rise) { const T2 = P(rise); fill.setAttribute('d', polyD([F, [T2[0], o.gy], T2])); const a = Math.atan2(o.gy - T2[1], T2[0] - F[0]) * DEG; arc.setAttribute('d', arcD(F, 70, 0, a)); api.top = T2; } };
  return api;
}
function roofScene(svg, o) {
  const g = svgEl('g', {}, svg), x0 = o.x0, y0 = o.y0, w = o.w, hw = o.wallH, rise = (w / 2) * 5 / 12;
  svgEl('rect', { x: x0, y: y0, width: w, height: hw, fill: '#f3efe6', stroke: INK, 'stroke-width': 3 }, g);
  svgEl('rect', { x: x0 + w / 2 - 34, y: y0 + hw - 80, width: 68, height: 80, fill: '#d7dbe3', stroke: SLATE, 'stroke-width': 2 }, g);
  const peak = [x0 + w / 2, y0 - rise], eaveL = [x0, y0], mid = [x0 + w / 2, y0];
  const half = path(g, polyD([eaveL, mid, peak]), { stroke: 'none', fill: AMBER, fo: 0.16 }); hide(half);
  path(g, polyD([eaveL, peak, [x0 + w, y0]], false), { stroke: INK, width: 3.5 });
  line(g, mid, peak, { width: 2.5, dash: '7 6', color: SLATE }); line(g, eaveL, mid, { width: 2.5, dash: '7 6', color: SLATE });
  sq(g, mid, 90, 14, SLATE);
  const arcT = path(g, arcD(eaveL, 52, 0, Math.atan(5 / 12) * DEG), { stroke: AMBER, width: 3 }), lt = txt(g, ...A(eaveL, 11, 76), 'θ', { size: 20, color: AMBER, weight: 800 });
  const arcX = path(g, arcD(peak, 46, 270, 90 - Math.atan(5 / 12) * DEG), { stroke: PURPLE, width: 3 }), lx = txt(g, ...A(peak, 290, 66), 'x', { size: 20, color: PURPLE, weight: 800, italic: true });
  // the pitch triangle
  const pg = svgEl('g', {}, g), s12 = o.pitchW, pax = x0 + w * 0.6, pa = [pax, peak[1] + (pax - peak[0]) * 5 / 12 - s12 * 0.42 - 6], pb = [pa[0] + s12, pa[1]], pc = [pb[0], pa[1] + s12 * 5 / 12];
  path(pg, `M${pa[0]} ${pa[1]} L${pb[0]} ${pb[1]} L${pc[0]} ${pc[1]}`, { stroke: BLUE, width: 2.5 });
  txt(pg, (pa[0] + pb[0]) / 2, pa[1] - 14, '12', { size: 17, color: ADJ, weight: 800 }); txt(pg, pb[0] + 14, (pb[1] + pc[1]) / 2, '5', { size: 17, color: OPP, weight: 800 });
  return { g, half, arcT, lt, arcX, lx, pg, peak, eaveL };
}
function droneScene(svg, o) {
  const g = svgEl('g', {}, svg), s = o.s, gx = o.x0, gy = o.gy, D = [gx, gy - 90 * s], Cr = [gx + 140 * s, gy], th = Math.atan(90 / 140) * DEG;
  line(g, [gx - 30, gy], [Cr[0] + 60, gy], { width: 3.5, color: '#7a5124' });
  line(g, D, [gx, gy], { width: 2.5, dash: '7 6', color: SLATE }); sq(g, [gx, gy], 0, 14, SLATE);
  const hor = line(g, D, [Cr[0] + 30, D[1]], { width: 2.5, dash: '7 6', color: SLATE }), horT = txt(g, Cr[0] + 34, D[1] - 16, 'horizontal', { size: 16, color: SLATE, anchor: 'end' });
  const sight = line(g, D, Cr, { width: 3.2, color: INK });
  // the drone
  const dr = svgEl('g', {}, g);
  svgEl('rect', { x: D[0] - 16, y: D[1] - 8, width: 32, height: 16, rx: 5, fill: SLATE }, dr);
  [-1, 1].forEach((k) => { line(dr, [D[0] + k * 10, D[1] - 6], [D[0] + k * 28, D[1] - 14], { width: 3, color: SLATE }); svgEl('ellipse', { cx: D[0] + k * 28, cy: D[1] - 16, rx: 16, ry: 3.5, fill: '#9aa0ab' }, dr); });
  // the car
  svgEl('rect', { x: Cr[0] - 4, y: gy - 16, width: 44, height: 12, rx: 4, fill: RED }, g); svgEl('rect', { x: Cr[0] + 6, y: gy - 26, width: 24, height: 11, rx: 4, fill: RED }, g);
  [Cr[0] + 6, Cr[0] + 32].forEach((x) => svgEl('circle', { cx: x, cy: gy - 3, r: 5, fill: INK }, g));
  const arcD1 = path(g, arcD(D, 70, -th, th), { stroke: AMBER, width: 3 }), lD = txt(g, ...A(D, -th / 2, 92), 'θ', { size: 20, color: AMBER, weight: 800 });
  const arcE = path(g, arcD(Cr, 70, 180, -th), { stroke: GREEN, width: 3 }), lE = txt(g, ...A(Cr, 180 - th / 2, 92), 'θ', { size: 20, color: GREEN, weight: 800 });
  return { g, D, Cr, th, hor, horT, sight, arcD1, lD, arcE, lE };
}
const JOB = {
  ladder: { ask: 'Example 7(a): a 6 m ladder, its foot 1.5 m from the wall. What angle does it make with the ground? Is it safe?', val: INV.cos(1.5 / 6) },
  ramp: { ask: 'Example 7(b): a ramp 8 m long (along its surface) rises 0.6 m. Find its angle to the nearest tenth. Does it meet the guideline?', val: INV.sin(0.6 / 8) },
  roof: { ask: 'Example 8(a): a 5/12 roof pitch. Find the angle θ with the horizontal, then angle x at the peak.', val: INV.tan(5 / 12) },
  drone: { ask: 'Example 8(b): a drone 90 m up, a car 140 m away along the ground. Find the angle of depression from the drone to the car.', val: INV.tan(90 / 140) }
};
const jobs = {
  title: 'Angles on the job',
  height: 420, capH: 92,
  choices: [{ sep: 'Example 7 check:' }, { v: 'ladder', label: '(a) ladder' }, { v: 'ramp', label: '(b) ramp' }, { sep: 'Example 8 check:' }, { v: 'roof', label: '(a) roof' }, { v: 'drone', label: '(b) drone' }],
  ask: (v) => JOB[v].ask,
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 960) / 2, svg = stageSvg(stage, W, 420), X = ox + 565, val = JOB[v].val;
    const W1 = (html, i, cls = 'u7l8-wmid') => wl(stage, html, X, 18 + i * 64, cls);
    if (v === 'ladder') {
      const sc = ladderScene(svg, { s: 56, gy: 378, wx: ox + 140, wallH: 360, groundW: 300, L: 6 });
      sc.set(90); hide(sc.arc, sc.th);
      const lh = lab(stage, '6 m (hyp)', ox + 300, 200, 'u7l8-small u7l8-hypc'), la = lab(stage, '1.5 m (adj)', ox + 300, 240, 'u7l8-small u7l8-adjc'); hide(lh, la);
      const ghost = svgEl('g', {}, svg); hide(ghost);
      const w = [W1(`adj and hyp → <b>cos</b>`, 0), W1(T(`\\theta=\\cos^{-1}\\!\\left(\\dfrac{1.5}{6}\\right)`), 1, 'u7l8-wbig'), W1(T(`\\theta=${dots(val)}\\approx76^\\circ`), 2.25, 'u7l8-wbig u7l8-wans'), W1('Safe: about <b>75°</b>. 76° is very close ✓', 3.3, 'u7l8-wsm')];
      const okS = hide(stamp(stage, 'safe', { ok: true, x: ox + 420, y: 200, size: 'sm' }));
      return [
        { cap: 'Sketch it: the ladder leans on the wall. The ladder (6 m) is the <b>hyp</b>; the gap at the foot (1.5 m) is <b>adj</b> to θ.', run: async (c) => {
          await tween(c, 1300, (u) => sc.set(90 - (90 - val) * u)); const f = sc.foot, t = sc.top;
          lh.style.left = ((f[0] + t[0]) / 2 + 70) + 'px'; lh.style.top = ((f[1] + t[1]) / 2) + 'px'; la.style.left = ((ox + 140 + f[0]) / 2 + 14) + 'px'; la.style.top = (f[1] + 4 + 18) + 'px';
          await show(c, lh); await show(c, la); await show(c, sc.arc); await show(c, sc.th); } },
        { cap: `adj and hyp → <b>cos</b>: ${T(`\\theta=\\cos^{-1}\\left(\\frac{1.5}{6}\\right)=${dots(val)}\\approx76^\\circ`)}.`, run: async (c) => { await show(c, w[0]); await show(c, w[1]); await show(c, w[2]); } },
        { cap: 'A ladder should lean at <b>about 75°</b> (dashed). 76° is very close, so it is set up <b>safely</b> ✓.', run: async (c) => {
          const g2 = ladderScene(ghost, { s: 56, gy: 378, wx: ox + 140, wallH: 0, groundW: 0, L: 6, thLabel: '' }); g2.set(75); g2.g.setAttribute('opacity', 0.35); g2.arc.remove();
          await show(c, ghost); await show(c, w[3]); await stampIn(c, okS); } }
      ];
    }
    if (v === 'ramp') {
      const sc = rampScene(svg, { x0: ox + 30, gy: 120, s: 56, ex: 1, rise: 0.6, len: 8 }); sc.set(0); hide(sc.arc, sc.th);
      const lh = lab(stage, '8 m (hyp)', ox + 250, 72, 'u7l8-small u7l8-hypc'), lo = lab(stage, '0.6 m (opp)', ox + 30 + sc.run * 56, 54, 'u7l8-small u7l8-oppc'); hide(lh, lo);
      // the gauge (0° to 10°)
      const Gc = [ox + 40, 405], GR = 210, gs = (d) => d * 9, G = svgEl('g', {}, svg); hide(G);
      path(G, wedgeD(Gc, GR, 0, gs(4.8)), { stroke: 'none', fill: GREEN, fo: 0.16 }); path(G, wedgeD(Gc, GR, gs(4.8), gs(10) - gs(4.8)), { stroke: 'none', fill: RED, fo: 0.14 });
      path(G, arcD(Gc, GR, 0, gs(10)), { stroke: SLATE, width: 2.5 }); line(G, Gc, A(Gc, 0, GR), { width: 2.5, color: SLATE });
      for (let d = 0; d <= 10; d++) { line(G, A(Gc, gs(d), GR - (d % 2 ? 8 : 14)), A(Gc, gs(d), GR), { width: 2, color: SLATE }); if (d % 2 === 0) txt(G, ...A(Gc, gs(d), GR + 18), d + '°', { size: 15, color: SLATE }); }
      line(G, Gc, A(Gc, gs(4.8), GR + 6), { width: 2.5, color: RED, dash: '6 5' }); txt(G, ...A(Gc, gs(4.8) - 2, GR + 14), 'guideline 4.8°', { size: 16, color: RED, anchor: 'start' });
      const needle = line(G, Gc, A(Gc, 0, GR - 10), { width: 4, color: AMBER });
      const w = [W1('opp and hyp → <b>sin</b>', 0), W1(T(`\\theta=\\sin^{-1}\\!\\left(\\dfrac{0.6}{8}\\right)`), 1, 'u7l8-wbig'), W1(T(`\\theta=${dots(val)}\\approx${r1(val)}^\\circ`), 2.25, 'u7l8-wbig u7l8-wans'), W1(`${r1(val)}° is less than 4.8°: it <b>meets</b> the guideline ✓`, 3.3, 'u7l8-wsm')];
      const okS = hide(stamp(stage, 'meets it', { ok: true, x: ox + 420, y: 300, size: 'sm' }));
      return [
        { cap: 'Sketch it: the ramp surface (8 m) is the <b>hyp</b>; the rise (0.6 m) is <b>opp</b> to θ. (A real ramp is this flat!)', run: async (c) => { await tween(c, 1100, (u) => sc.set(0.6 * u)); await show(c, lh); await show(c, lo); await show(c, sc.arc); await show(c, sc.th); } },
        { cap: `opp and hyp → <b>sin</b>: ${T(`\\theta=\\sin^{-1}\\left(\\frac{0.6}{8}\\right)=${dots(val)}\\approx${r1(val)}^\\circ`)} (nearest tenth).`, run: async (c) => { await show(c, w[0]); await show(c, w[1]); await show(c, w[2]); } },
        { cap: `The guideline: about <b>4.8°</b> or less. ${r1(val)}° is in the green, so <b>yes</b>, it meets the guideline ✓.`, run: async (c) => { await show(c, G); await tween(c, 1200, (u) => setLine(needle, Gc, A(Gc, gs(val * u), GR - 10))); await show(c, w[3]); await stampIn(c, okS); } }
      ];
    }
    if (v === 'roof') {
      const sc = roofScene(svg, { x0: ox + 30, y0: 235, w: 480, wallH: 165, pitchW: 96 }); hide(sc.arcT, sc.lt, sc.arcX, sc.lx, sc.pg);
      const vx = 90 - Math.round(val * 100) / 100;
      const w = [W1(`pitch triangle: <b>opp 5</b>, <b>adj 12</b> → <b>tan</b>`, 0, 'u7l8-wsm'), W1(T(`\\theta=\\tan^{-1}\\!\\left(\\dfrac{5}{12}\\right)=${dots(val)}\\approx23^\\circ`), 1, 'u7l8-wmid u7l8-wans'), W1(T(`x=90^\\circ-${(Math.round(val * 100) / 100).toFixed(2)}^\\circ=${vx.toFixed(2)}^\\circ\\approx67^\\circ`), 2.3, 'u7l8-wmid u7l8-wans')];
      return [
        { cap: 'A <b>5/12 pitch</b>: the roof rises <b>5</b> for every <b>12</b> across. That small triangle has <b>opp 5</b> and <b>adj 12</b> from θ.', run: async (c) => { await show(c, sc.pg); await show(c, sc.arcT); await show(c, sc.lt); await show(c, w[0]); } },
        { cap: `opp and adj → <b>tan</b>: ${T(`\\theta=\\tan^{-1}\\left(\\frac{5}{12}\\right)=${dots(val)}\\approx23^\\circ`)}.`, run: (c) => show(c, w[1]) },
        { cap: `The post, the rafter and the horizontal make a <b>right triangle</b>, so ${T(`x=90^\\circ-22.62^\\circ=${vx.toFixed(2)}^\\circ\\approx67^\\circ`)}.`, run: async (c) => { await show(c, sc.half, 500); await show(c, sc.arcX); await show(c, sc.lx); await show(c, w[2]); } }
      ];
    }
    const sc = droneScene(svg, { x0: ox + 112, gy: 380, s: 2.8 }); hide(sc.arcD1, sc.lD, sc.arcE, sc.lE);
    const l90 = lab(stage, '90 m (opp)', ox + 100, 380 - 45 * 2.8, 'u7l8-small u7l8-oppc u7l8-right'), l140 = lab(stage, '140 m (adj)', ox + 112 + 70 * 2.8, 400, 'u7l8-small u7l8-adjc'); hide(l90, l140);
    const zl = path(svg, `M${sc.D[0] + 170} ${sc.D[1]} L${sc.D[0]} ${sc.D[1]} L${sc.Cr[0]} ${sc.Cr[1]} L${sc.Cr[0] - 170} ${sc.Cr[1]}`, { stroke: AMBER, width: 10, opacity: 0.0 });
    const w = [W1('depression at the drone = elevation at the car', 0, 'u7l8-wsm'), W1('from the car: <b>opp 90</b>, <b>adj 140</b> → <b>tan</b>', 1.1, 'u7l8-wsm'), W1(T(`\\theta=\\tan^{-1}\\!\\left(\\dfrac{90}{140}\\right)=${dots(val)}\\approx33^\\circ`), 2, 'u7l8-wmid u7l8-wans')];
    return [
      { cap: 'The angle of <b>depression</b> is at the drone: down from the <b>horizontal</b> to the line of sight to the car.', run: async (c) => { await show(c, sc.arcD1); await show(c, sc.lD); } },
      { cap: 'It equals the angle of <b>elevation</b> at the car: alternate interior angles (a Z shape between the two horizontal lines).', run: async (c) => { await anim(c, zl, [{ opacity: 0 }, { opacity: 0.28 }], 500); await show(c, sc.arcE); await show(c, sc.lE); await show(c, w[0]); } },
      { cap: `From the car: opp = 90, adj = 140 → <b>tan</b>. ${T(`\\theta=\\tan^{-1}\\left(\\frac{90}{140}\\right)=${dots(val)}\\approx33^\\circ`)}.`, run: async (c) => { await show(c, l90); await show(c, l140); await show(c, w[1]); await show(c, w[2]); } }
    ];
  }
};

mountExplainers({ undo, keys, notpower, early, steps, other, sum90, checks, bench, jobs });

/* ======================================================================================
 * Hands-on: tilt the ramp (rise and run by dragging; tan⁻¹, sin⁻¹ and cos⁻¹ all update)
 * ====================================================================================== */
(function rampTool() {
  const host = document.getElementById('u7l8-ramp'); if (!host) return;
  const W = 940, H = 320, S = 52, F = [70, 290], svg = svgEl('svg', { class: 'u7l8-svg u7l8-rsvg', width: W, height: H, viewBox: `0 0 ${W} ${H}` }, host);
  const panel = h('div', 'u7l8-rpanel'); host.appendChild(panel);
  let rise = 2, run = 6, hidden = false;
  line(svg, [20, F[1]], [W - 20, F[1]], { width: 3.5, color: '#7a5124' });
  const dock = path(svg, '', { stroke: SLATE, width: 2, fill: '#d7dbe3' });
  const tri = path(svg, '', { stroke: 'none', fill: '#f3efe6' });
  const sAdj = line(svg, F, F, { color: ADJ, width: 6 }), sOpp = line(svg, F, F, { color: OPP, width: 6, dash: '9 6' }), sHyp = line(svg, F, F, { color: HYP, width: 8 });
  const rsq = path(svg, '', { stroke: INK, width: 2 }), arc = path(svg, '', { stroke: AMBER, width: 3 });
  const tTh = txt(svg, 24, 32, '', { size: 28, color: AMBER, weight: 800, anchor: 'start' }), tTh2 = txt(svg, 0, 0, 'θ', { size: 20, color: AMBER, weight: 800 });
  const tRun = txt(svg, 0, 0, '', { size: 19, color: ADJ, weight: 800 }), tRise = txt(svg, 0, 0, '', { size: 19, color: OPP, weight: 800, anchor: 'start' }), tLen = txt(svg, 0, 0, '', { size: 19, color: HYP, weight: 800 });
  const knob = svgEl('circle', { r: 16, fill: '#fff', stroke: BROWN, 'stroke-width': 4, class: 'u7l8-knob', 'data-tap': '' }, svg);
  const rows = h('div', 'u7l8-rrows'), badge = h('div', 'u7l8-rbadge'), btns = h('div', 'u7l8-rbtns');
  panel.append(rows, badge, btns);
  function render() {
    const T2 = [F[0] + run * S, F[1] - rise * S], B = [T2[0], F[1]], len = Math.hypot(rise, run), th = Math.atan2(rise, run) * DEG;
    dock.setAttribute('d', polyD([[T2[0], T2[1]], [T2[0] + 90, T2[1]], [T2[0] + 90, F[1]], B]));
    tri.setAttribute('d', polyD([F, B, T2])); setLine(sAdj, F, B); setLine(sOpp, B, T2); setLine(sHyp, F, T2);
    rsq.setAttribute('d', rise * S > 22 ? `M${B[0] - 14} ${B[1]} L${B[0] - 14} ${B[1] - 14} L${B[0]} ${B[1] - 14}` : '');
    arc.setAttribute('d', arcD(F, 74, 0, th)); const lp = A(F, th / 2, 94); tTh2.setAttribute('x', lp[0].toFixed(1)); tTh2.setAttribute('y', lp[1].toFixed(1)); tTh2.style.display = th > 9 ? '' : 'none';
    tTh.textContent = hidden ? 'θ = ?' : `θ = ${r1(th)}°`;
    knob.setAttribute('cx', T2[0].toFixed(1)); knob.setAttribute('cy', T2[1].toFixed(1));
    tRun.setAttribute('x', ((F[0] + B[0]) / 2).toFixed(1)); tRun.setAttribute('y', F[1] + 20); tRun.textContent = `run ${run.toFixed(2)} m`;
    tRise.setAttribute('x', (B[0] + 100).toFixed(1)); tRise.setAttribute('y', ((B[1] + T2[1]) / 2).toFixed(1)); tRise.textContent = `rise ${rise.toFixed(2)} m`;
    const mid = [(F[0] + T2[0]) / 2, (F[1] + T2[1]) / 2], nrm = A([0, 0], th + 90, 26);
    tLen.setAttribute('x', (mid[0] + nrm[0]).toFixed(1)); tLen.setAttribute('y', (mid[1] + nrm[1]).toFixed(1)); tLen.textContent = `ramp ${len.toFixed(2)} m`;
    const ang = hidden ? '?' : `${r1(th)}^\\circ`;
    rows.innerHTML = [
      ['tan', 'rise', 'run', rise, run],
      ['sin', 'rise', 'ramp', rise, len],
      ['cos', 'run', 'ramp', run, len]
    ].map(([f, n, d, a, b]) => `<div><span class="u7l8-rf">${f}</span>${T(`\\theta=\\${f}^{-1}\\!\\left(\\dfrac{${n === 'rise' ? '\\color{#c93a33}' : '\\color{#1f5bd6}'}${a.toFixed(2)}}{${d === 'run' ? '\\color{#1f5bd6}' : '\\color{#9a6a24}'}${b.toFixed(2)}}\\right)=${ang}`)}</div>`).join('');
    const okR = th <= 4.8 + 1e-9;
    badge.className = 'u7l8-rbadge ' + (hidden ? '' : okR ? 'ok' : 'no');
    badge.innerHTML = hidden ? 'All three give the same angle. Guess it first!' : okR ? `${r1(th)}° ≤ 4.8°: OK for a <b>wheelchair ramp</b>` : th < 45 ? `${r1(th)}° is steeper than the wheelchair guideline (4.8°)` : `${r1(th)}°: steeper than 45°. Rise is ${th > 45.05 ? 'more than' : 'equal to'} run.`;
  }
  const B = (label, fn) => { const b = h('button', 'pill small', label); b.type = 'button'; b.onclick = () => { fn(b); render(); }; btns.appendChild(b); return b; };
  B('Example 7(b)', () => { rise = 0.6; run = Math.sqrt(64 - 0.36); });
  B('1 in 12', () => { rise = 0.5; run = 6; });
  B('45°', () => { rise = 4; run = 4; });
  B('Hide the angle', (b) => { hidden = !hidden; b.textContent = hidden ? 'Show the angle' : 'Hide the angle'; });
  let drag = null;
  knob.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); knob.setPointerCapture(e.pointerId); drag = { p0: Geo.svgPoint(svg, e), r0: rise, u0: run }; });
  knob.addEventListener('pointermove', (e) => {
    if (!drag) return; e.preventDefault(); const p = Geo.svgPoint(svg, e);
    run = Math.min(14.5, Math.max(1, Math.round((drag.u0 + (p[0] - drag.p0[0]) / S) * 10) / 10));
    rise = Math.min(5.2, Math.max(0.1, Math.round((drag.r0 - (p[1] - drag.p0[1]) / S) * 20) / 20)); render();
  });
  const end = () => { drag = null; }; knob.addEventListener('pointerup', end); knob.addEventListener('pointercancel', end);
  render();
}());

/* ======================================================================================
 * Static figures
 * ====================================================================================== */
const rt = (host, o) => Geo.rightTri(host, Object.assign({ width: 300, height: 220, names: false, size: 19, show: [], right: 'bl' }, o));
const FIG = {
  ex3a: (host) => rt(host, { a: 5, b: 9, theta: 'A', sides: { a: '5 cm', b: '9 cm' } }),
  ex3b: (host) => rt(host, { a: 7, c: 12, rot: 90, flip: true, theta: 'A', sides: { a: '7 m', c: '12 m' } }),
  ex3c: (host) => rt(host, { b: 8.5, c: 11, rot: 180, theta: 'A', sides: { b: '8.5 cm', c: '11 cm' } }),
  ex4: (host) => rt(host, { width: 360, height: 250, a: 8, b: 15, names: ['A', 'B', 'C'], sides: { a: 'a = 8 cm', b: 'b = 15 cm', c: 'c = 17 cm' }, angles: { A: '', B: '' } }),
  ex5: (host) => rt(host, { width: 360, height: 250, a: 6.2, c: 14.5, rot: 180, names: ['P', 'Q', 'R'], sides: { a: '6.2 m', c: '14.5 m' }, angles: { A: '', B: '' } }),
  ex6: (host) => rt(host, { width: 300, height: 190, a: 6, b: 11, theta: 'A', sides: { a: '6 m', b: '11 m' } }),
  ex7a: (host) => {
    const svg = svgBox(host, 300, 250), sc = ladderScene(svg, { s: 38, gy: 236, wx: 100, wallH: 236, groundW: 120, L: 6, size: 18 }); sc.set(INV.cos(0.25));
    txt(svg, (sc.foot[0] + sc.top[0]) / 2 + 30, (sc.foot[1] + sc.top[1]) / 2, '6 m', { size: 18, anchor: 'start' }); txt(svg, (100 + sc.foot[0]) / 2, 252 - 2, '1.5 m', { size: 17 });
  },
  ex7b: (host) => {
    const svg = svgBox(host, 420, 150), sc = rampScene(svg, { x0: 20, gy: 110, s: 46, ex: 2.6, rise: 0.6, len: 8 }); sc.set(0.6);
    txt(svg, 190, 64, '8 m', { size: 18 }); txt(svg, 20 + sc.run * 46 + 8, 90, '0.6 m', { size: 18, anchor: 'start' }); txt(svg, 190, 132, '(not to scale)', { size: 14, color: SLATE, italic: true });
  },
  ex8a: (host) => { const svg = svgBox(host, 420, 250); roofScene(svg, { x0: 20, y0: 140, w: 380, wallH: 105, pitchW: 74 }); },
  ex8b: (host) => {
    const svg = svgBox(host, 420, 250), sc = droneScene(svg, { x0: 60, gy: 220, s: 2.05 }); sc.arcE.remove(); sc.lE.remove();
    txt(svg, 52, 220 - 45 * 2.05, '90 m', { size: 17, anchor: 'end' }); txt(svg, 60 + 70 * 2.05, 240, '140 m', { size: 17 });
    txt(svg, sc.D[0] - 10, sc.D[1] - 30, 'drone', { size: 15, color: SLATE, anchor: 'start' }); txt(svg, sc.Cr[0] + 18, 240, 'car', { size: 15, color: SLATE });
  }
};
document.querySelectorAll('.u7l8-fig[data-fig]').forEach((host) => { const f = FIG[host.dataset.fig]; if (f) f(host); });

/* ======================================================================================
 * Stand Up Break
 * ====================================================================================== */
const triFig = (o) => { const d = h('div'); Geo.rightTri(d, Object.assign({ width: 300, height: 210, names: false, size: 19, show: [], right: 'bl', theta: 'A' }, o)); return `<div class="u7l8-sufig">${d.innerHTML}</div>`; };
const ROLE_WORD = { opp: 'the side opposite θ', adj: 'the side adjacent to θ', hyp: 'the hypotenuse' };
standup('u7l8', {
  intro: 'Write the ratio, then the inverse. Round to the nearest degree. Then check: is it reasonable?',
  levels: {
    BEG: (r) => {
      const f = r.pick(['sin', 'cos', 'tan']);
      if (r.chance(0.5)) {
        let deg, x; do { deg = r.int(12, 78); x = Math.round(FWD[f](deg) * 10000) / 10000; } while (f === 'tan' && x > 4);
        const v = INV[f](x);
        return { text: `Find θ to the nearest degree.`, q: `\\${f}\\theta=${x}`, a: [`\\theta=\\${f}^{-1}(${x})`, `\\theta=${dots(v)}\\approx${nd(v)}^\\circ`] };
      }
      let n, d; do { d = r.int(5, 15); n = r.int(1, f === 'tan' ? 20 : d - 1); } while (n === d || (f === 'tan' && n > 2 * d));
      const v = INV[f](n / d);
      return { text: 'Find the angle to the nearest degree. Type the whole fraction.', q: `\\${f} A=\\dfrac{${n}}{${d}}`, a: [`\\angle A=\\${f}^{-1}\\!\\left(\\frac{${n}}{${d}}\\right)`, `=${dots(v)}\\approx${nd(v)}^\\circ`] };
    },
    PRG: (r) => {
      const f = r.pick(['sin', 'cos', 'tan']), [k1, k2] = ROLE_OF[f], u = r.pick(['cm', 'm']);
      let p, q; do { q = r.int(6, 20); p = r.int(2, f === 'tan' ? 24 : q - 1); } while (p === q);
      const v = INV[f](p / q);
      // build the triangle: a = opp, b = adj, c = hyp (θ at A)
      const tri = f === 'tan' ? { a: p, b: q } : f === 'sin' ? { a: p, c: q } : { b: p, c: q };
      const sides = {}; sides[{ opp: 'a', adj: 'b', hyp: 'c' }[k1]] = `${p} ${u}`; sides[{ opp: 'a', adj: 'b', hyp: 'c' }[k2]] = `${q} ${u}`;
      return { text: `A right triangle: ${ROLE_WORD[k1]} is <b>${p} ${u}</b> and ${ROLE_WORD[k2]} is <b>${q} ${u}</b>. Find θ.`, q: '', fig: triFig(Object.assign({ sides, rot: r.pick([0, 90, 180, 270]), flip: r.chance(0.5) }, tri)),
        a: [`\\text{${k1} and ${k2}}\\rightarrow\\${f}`, `\\${f}\\theta=\\frac{${p}}{${q}}`, `\\theta=\\${f}^{-1}\\!\\left(\\frac{${p}}{${q}}\\right)=${dots(v)}\\approx${nd(v)}^\\circ`] };
    },
    MAS: (r) => r.pick([
      () => {
        let a, c; do { c = r.int(9, 25); a = r.int(3, c - 2); } while (a * 2 === c);
        const A1 = INV.sin(a / c), B1 = 90 - A1;
        return { text: `In <b>△ABC</b>, ∠C = 90°, <i>a</i> = <b>${a} m</b> and the hypotenuse <i>c</i> = <b>${c} m</b>. Find ∠A and ∠B. Check ∠B with a ratio.`, q: '', fig: triFig({ a, c, names: ['A', 'B', 'C'], theta: null, sides: { a: `${a} m`, c: `${c} m` } }),
          a: [`\\angle A=\\sin^{-1}\\!\\left(\\frac{${a}}{${c}}\\right)=${dots(A1)}\\approx${nd(A1)}^\\circ`, `\\angle B=90^\\circ-${(Math.round(A1 * 100) / 100).toFixed(2)}^\\circ\\approx${nd(90 - Math.round(A1 * 100) / 100)}^\\circ`, `\\text{check: }\\cos^{-1}\\!\\left(\\frac{${a}}{${c}}\\right)=${dots(B1)}\\ \\checkmark`] };
      },
      () => {
        const L = r.pick([4, 5, 5.5, 6.5, 7, 8, 9]), d = Math.round(L * r.pick([0.18, 0.22, 0.25, 0.28, 0.32]) * 10) / 10, v = INV.cos(d / L);
        return { text: `${L === 8 ? 'An' : 'A'} <b>${L} m</b> ladder leans on a wall. Its foot is <b>${d} m</b> from the wall. Find the angle with the ground. Is it close to the safe 75°?`, q: '',
          a: [`\\text{adj } ${d},\\ \\text{hyp } ${L}\\rightarrow\\cos`, `\\theta=\\cos^{-1}\\!\\left(\\frac{${d}}{${L}}\\right)=${dots(v)}\\approx${nd(v)}^\\circ`, Math.abs(v - 75) <= 2 ? '\\text{close to }75^\\circ\\text{: safe}' : v > 75 ? '\\text{too steep: move the foot out}' : '\\text{too flat: move the foot in}'] };
      },
      () => {
        const rise = r.pick([0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.6]), run = r.pick([3, 3.5, 4, 4.5, 5, 6, 7, 8]), v = INV.tan(rise / run);
        return { text: `A ramp rises <b>${rise} m</b> over <b>${run} m</b> along the ground. Find its angle to the nearest tenth of a degree. Does it meet the 4.8° guideline?`, q: '',
          a: [`\\text{opp } ${rise},\\ \\text{adj } ${run}\\rightarrow\\tan`, `\\theta=\\tan^{-1}\\!\\left(\\frac{${rise}}{${run}}\\right)=${dots(v)}\\approx${r1(v)}^\\circ`, Number(r1(v)) <= 4.8 ? '\\text{meets the guideline}' : '\\text{too steep}'] };
      }
    ])()
  }
});
