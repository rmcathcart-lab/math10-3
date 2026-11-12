/* Math 10-3 · Unit 4 · Lesson 7 — Unit 4 Review (M1, M2).
 * A review lesson: no practice break; the review assignment is a practice unit test, and (the review is the exception)
 * some of its multiple-choice questions appear as chips in the Full-notes "Spot the trap" explainer.
 * Explainers (Class view unless marked):
 *   bed      (a garden bed box filling with soil: V = lwh; then 1 m³ = 1000 L and 25 L bags, round up to 41; Example 1),
 *   barrel   (the rain barrel: radius, base circle, water rising to 90 cm, litres; then US vs British gallons cut
 *             from the same 254.469 L; Example 2),
 *   pad      (Dev's concrete pad: 4 in on a 12 in foot, V = 40 ft³; 40 little cubes grouped in 27s; ordering in
 *             half yards on a number line and the receipt; Example 3),
 *   cubic    (Full notes: build 1 yd³ and 1 ft³ layer by layer: 27 and 1728),
 *   thermo   (the double thermometer, °C on one side and °F on the other; the oven dial; Example 4),
 *   estLine  (Full notes: the exact line and the quick-estimate line, and the gap between them),
 *   massUnits(the SI mass staircase; the ounce strip in groups of 16; borrowing 1 lb as 16 oz; Example 5),
 *   scale2   (a two-ring bathroom scale and the 23 kg limit; a kilogram of beef as 2.2 pounds; the × 28.35 and × 0.907
 *             machines; Example 6),
 *   grain    (the bushels ⇄ tonnes machine with factor chips, tonne squares, the cheque, a tonne cut into bushels; Ex. 7),
 *   traps    (Full notes: practice-test multiple choice, with the mistake behind every wrong choice).
 * Then the Stand Up Break (mixed review like the unit test). */
import { h, add, box, tex, svgEl, tween, pulse, stamp, stampIn, mountExplainers, Graph, NumberLine, fmt } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const rnd = (v, d = 2) => Math.round((v + (v >= 0 ? 1e-9 : -1e-9)) * 10 ** d) / 10 ** d;
const lerp = (a, b, t) => a + (b - a) * t;
/** an absolutely placed box on the stage */
const el = (stage, cls, html, x, y, w, hh) => add(stage, box(h('div', cls, html), w, hh), x, y);
/** a box whose mixed text and maths stay together on centred lines */
const cb = (stage, cls, html, x, y, w, hh) => el(stage, cls + ' u4l7-c', `<div>${html}</div>`, x, y, w, hh);
/** a working line (text and maths on one line) */
const ln = (stage, html, x, y, w, hh = 46, cls = '') => el(stage, 'u4l7-line ' + cls, `<div>${html}</div>`, x, y, w, hh);
/** a small label centred on (cx, cy) */
const tag = (stage, html, cx, cy, cls = '') => { const e = add(stage, h('div', 'u4l7-tag ' + cls, html), cx, cy); e.style.translate = '-50% -50%'; return e; };
const show = (c, e, ms = 400) => c.anim(e, [{ opacity: 0 }, { opacity: 1 }], ms);
const fadeOut = (c, e, ms = 250) => c.anim(e, [{ opacity: 1 }, { opacity: 0 }], ms);
const moveTo = (c, e, x, y, ms = 650) => { const x0 = parseFloat(e.style.left), y0 = parseFloat(e.style.top); return tween(c, ms, (t) => { e.style.left = lerp(x0, x, t) + 'px'; e.style.top = lerp(y0, y, t) + 'px'; }); };
const svgOn = (stage, W, H) => add(stage, svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u4l7-svg' }), 0, 0);
const pts = (P, list) => list.map((q) => P(...q).map((v) => v.toFixed(1)).join(',')).join(' ');
const tx = (v) => fmt(v).replace(/ /g, '\\,');            // a number for TeX, with a thin space for thousands
/** oblique projection: x to the right, y into the page (up and right), z up */
const oblique = (ox, oy, s, zk = 1, dk = 1) => (x, y, z) => [ox + x * s + y * s * 0.41 * dk, oy - z * s * zk - y * s * 0.287 * dk];

/* =====================================================================================
 * 1. Example 1: the garden bed (V = lwh, then litres and 25 L bags)
 * ===================================================================================== */
const BED = {
  row: { ask: 'The unit on one page: find the volume of a box 2 m × 1.5 m × 0.4 m.', L: 2, D: 1.5, H: 0.4, Lt: '2', Dt: '1.5', Ht: '0.4', V: '1.2' },
  a: { ask: 'Example 1(a): a raised garden bed is a box 2.4 m long, 1.2 m wide and 0.35 m deep. How many cubic metres of soil fill the bed?', L: 2.4, D: 1.2, H: 0.35, Lt: '2.4', Dt: '1.2', Ht: '0.35', V: '1.008' },
  b: { ask: 'Example 1(b): garden soil is sold in 25 L bags. How many bags fill the 1.008 m³ bed?', L: 2.4, D: 1.2, H: 0.35, Lt: '2.4', Dt: '1.2', Ht: '0.35', V: '1.008' }
};
/** an open box (a bed) with soil that can rise; returns { setFill(f), labels } */
function soilBox(stage, svg, d, ox, oy, maxW, maxH) {
  const zk = 2.4, s = Math.min(maxW / (d.L + 0.41 * d.D), maxH / (d.H * zk + 0.287 * d.D));
  const P = oblique(ox, oy, s, zk);
  const soil = svgEl('g', {}, svg);
  const sf = svgEl('polygon', { fill: '#7a5230' }, soil), ss = svgEl('polygon', { fill: '#5e3d22' }, soil), st = svgEl('polygon', { fill: '#9a6b42' }, soil);
  const setFill = (f) => {
    const z = d.H * f;
    sf.setAttribute('points', pts(P, [[0, 0, 0], [d.L, 0, 0], [d.L, 0, z], [0, 0, z]]));
    ss.setAttribute('points', pts(P, [[d.L, 0, 0], [d.L, d.D, 0], [d.L, d.D, z], [d.L, 0, z]]));
    st.setAttribute('points', pts(P, [[0, 0, z], [d.L, 0, z], [d.L, d.D, z], [0, d.D, z]]));
    soil.style.opacity = f > 0 ? 1 : 0;
  };
  setFill(0);
  const wall = { fill: '#e8c99a', 'fill-opacity': 0.32, stroke: '#6e4a1c', 'stroke-width': 3, 'stroke-linejoin': 'round' };
  svgEl('polyline', { points: pts(P, [[0, 0, 0], [0, d.D, 0], [d.L, d.D, 0]]), fill: 'none', stroke: '#6e4a1c', 'stroke-width': 2, 'stroke-dasharray': '6 5' }, svg);
  svgEl('line', { x1: P(0, d.D, 0)[0], y1: P(0, d.D, 0)[1], x2: P(0, d.D, d.H)[0], y2: P(0, d.D, d.H)[1], stroke: '#6e4a1c', 'stroke-width': 2, 'stroke-dasharray': '6 5' }, svg);
  svgEl('polygon', Object.assign({ points: pts(P, [[0, 0, 0], [d.L, 0, 0], [d.L, 0, d.H], [0, 0, d.H]]) }, wall), svg);
  svgEl('polygon', Object.assign({ points: pts(P, [[d.L, 0, 0], [d.L, d.D, 0], [d.L, d.D, d.H], [d.L, 0, d.H]]) }, wall), svg);
  svgEl('polygon', { points: pts(P, [[0, 0, d.H], [d.L, 0, d.H], [d.L, d.D, d.H], [0, d.D, d.H]]), fill: 'none', stroke: '#6e4a1c', 'stroke-width': 3, 'stroke-linejoin': 'round' }, svg);
  const lp = P(d.L / 2, 0, 0), hp = P(0, 0, d.H / 2), dp = P(d.L, d.D / 2, 0);
  const labels = [tag(stage, `${d.Lt} m`, lp[0], lp[1] + 22), tag(stage, `${d.Ht} m`, hp[0] - 40, hp[1]), tag(stage, `${d.Dt} m`, dp[0] + 38, dp[1] + 12)];
  return { setFill, labels };
}
function bedSteps(stage, k, ex) {
  const d = BED[k], W = ex.W, H = 380, svg = svgOn(stage, W, H), RX = 500, RW = W - RX - 20;
  const bx = soilBox(stage, svg, d, 84, 340, 390, 280);
  if (k !== 'b') {
    const L1 = hide(ln(stage, `Same unit? ${d.Lt} m, ${d.Dt} m, ${d.Ht} m: all metres ✓`, RX, 40, RW, 46, 'sm'));
    const L2 = hide(ln(stage, T('V=l\\times w\\times h'), RX, 110, RW));
    const L3 = hide(ln(stage, T(`V=${d.Lt}\\times${d.Dt}\\times${d.Ht}`), RX, 170, RW));
    const R = hide(cb(stage, 'u4l7-res', T(`V=${d.V}\\text{ m}^3`), RX + 20, 250, RW - 40, 60));
    return [
      { cap: `A box ${d.Lt} m long, ${d.Dt} m wide and ${d.Ht} m ${k === 'row' ? 'high' : 'deep'}.`, run: async (c) => { for (const l of bx.labels) await c.pop(l, 300); } },
      { cap: 'Check the units first. All three lengths are in <b>metres</b>, so we can multiply.', run: (c) => c.fadeIn(L1) },
      { cap: `Fill it up. The volume of a box is ${T('V=lwh')}: length × width × height.`, run: async (c) => { await tween(c, 1400, (t) => bx.setFill(t)); await c.fadeIn(L2); } },
      { cap: `${T(`V=${d.Lt}\\times${d.Dt}\\times${d.Ht}=${d.V}`)} m³.${k === 'a' ? ' It takes about <b>1.008 m³</b> of soil.' : ''}`, run: async (c) => { await c.fadeIn(L3); await c.pop(R); } }
    ];
  }
  bx.setFill(1);
  const vt = tag(stage, '1.008 m³', 250, 40, 'bg');
  const L1 = hide(ln(stage, `${T('1\\text{ m}^3=1\\,000\\text{ L}')}, so ${T('1.008\\times1\\,000=1\\,008\\text{ L}')}`, RX, 14, RW));
  const L2 = hide(ln(stage, T('1\\,008\\div25=40.32\\text{ bags}'), RX, 66, RW));
  const BW = 28, BH = 36, G = 4, PER = 14, BX = RX + 4, BY = 126;
  const bags = Array.from({ length: 41 }, (_, i) => {
    const b = el(stage, 'u4l7-bag', '', BX + (i % PER) * (BW + G), BY + Math.floor(i / PER) * (BH + 8), BW, BH);
    if (i === 40) { b.classList.add('pt'); b.style.setProperty('--f', '32%'); }
    return hide(b);
  });
  const cnt = hide(el(stage, 'u4l7-cnt l', '', BX, BY + 3 * (BH + 8), 170, 34));
  const R = hide(cb(stage, 'u4l7-res', '40 bags is not quite enough: <b>41 bags</b>', RX + 10, 308, RW - 20, 56));
  const sp = hide(stamp(stage, 'Round up!', { ok: true, x: BX + 380, y: BY + 3 * (BH + 8) + 14, rotate: -8 }));
  return [
    { cap: `The bed holds ${T('1.008\\text{ m}^3')}. Bags are sold in litres, so change: ${T('1\\text{ m}^3=1\\,000\\text{ L}')}.`, run: async (c) => { await c.pop(vt); await c.fadeIn(L1); } },
    { cap: `Each bag holds 25 L. ${T('1\\,008\\div25=40.32')} bags.`,
      run: async (c) => { await c.fadeIn(L2); cnt.style.opacity = 1; await tween(c, 1800, (t) => { const n = t * 40.32; bags.forEach((b, i) => { b.style.opacity = i < Math.ceil(n - 1e-9) ? 1 : 0; }); cnt.innerHTML = `${(Math.min(n, 40.32)).toFixed(2)} bags`; }); } },
    { cap: `40 bags hold only ${T('40\\times25=1\\,000')} L: 8 L short. Round <b>up</b>: you need <b>41 bags</b>.`, run: async (c) => { await pulse(c, bags[40], 1.25); await stampIn(c, sp); await c.pop(R); } }
  ];
}
const bed = {
  title: 'Fill the bed, then count the bags',
  height: 380,
  minW: 960,
  choices: [{ sep: 'Unit on one page:' }, { v: 'row', label: '2 m × 1.5 m × 0.4 m box' }, { sep: 'Example 1 check:' }, { v: 'a', label: '(a) Cubic metres of soil' }, { v: 'b', label: '(b) Bags of soil' }],
  ask: (k) => BED[k].ask,
  make: (stage, k, ex) => bedSteps(stage, k, ex)
};

/* =====================================================================================
 * 2. Example 2: the rain barrel (radius, base, height; litres; US vs British gallons)
 * ===================================================================================== */
const BARREL_ASK = {
  ab: 'Example 2(a)(b): a rain barrel is a cylinder 60 cm across (diameter) and 90 cm tall. Find its volume in cubic centimetres, then in litres.',
  cd: 'Example 2(c)(d): the barrel holds 254.469 L. About how many US gallons (≈ 3.785 L) is it? How many British gallons (≈ 4.546 L)? Why is the British number smaller?'
};
function barrelVol(stage, ex) {
  const W = ex.W, H = 390, svg = svgOn(stage, W, H), cx = 190, rx = 130, ry = 30, yt = 74, yb = 330, RX = 440, RW = W - RX - 20;
  svgEl('path', { d: `M${cx - rx} ${yt} V${yb} A${rx} ${ry} 0 0 0 ${cx + rx} ${yb} V${yt}`, fill: '#f4f7fb', stroke: '#1c2230', 'stroke-width': 3 }, svg);
  const back = svgEl('path', { d: `M${cx - rx} ${yb} A${rx} ${ry} 0 0 1 ${cx + rx} ${yb}`, fill: 'none', stroke: '#1c2230', 'stroke-width': 2, 'stroke-dasharray': '7 6' }, svg);
  const base = hide(svgEl('ellipse', { cx, cy: yb, rx, ry, fill: '#f0b54a', 'fill-opacity': 0.75, stroke: '#c27a0e', 'stroke-width': 3 }, svg));
  const water = svgEl('path', { fill: '#7fb3ec', 'fill-opacity': 0.8 }, svg);
  const surf = svgEl('ellipse', { cx, rx, ry, fill: '#a9cdf5', stroke: '#1f5bd6', 'stroke-width': 2 }, svg);
  const setLevel = (f) => {
    const y = lerp(yb, yt, f);
    water.setAttribute('d', `M${cx - rx} ${y} V${yb} A${rx} ${ry} 0 0 0 ${cx + rx} ${yb} V${y} Z`);
    surf.setAttribute('cy', y); water.style.opacity = surf.style.opacity = f > 0 ? 1 : 0;
  };
  setLevel(0); void back;
  svgEl('ellipse', { cx, cy: yt, rx, ry, fill: 'none', stroke: '#1c2230', 'stroke-width': 3 }, svg);
  const dia = svgEl('line', { x1: cx - rx, y1: yt, x2: cx + rx, y2: yt, stroke: '#1c2230', 'stroke-width': 2.5, 'stroke-dasharray': '3 0' }, svg);
  const rad = hide(svgEl('line', { x1: cx, y1: yt, x2: cx + rx, y2: yt, stroke: '#c93a33', 'stroke-width': 5, 'stroke-linecap': 'round' }, svg));
  const cdot = hide(svgEl('circle', { cx, cy: yt, r: 5, fill: '#c93a33' }, svg));
  const hgt = svgEl('line', { x1: cx + rx + 26, y1: yt, x2: cx + rx + 26, y2: yb, stroke: '#1c2230', 'stroke-width': 2.5 }, svg);
  void dia; void hgt;
  const dl = tag(stage, '60 cm', cx - 60, yt - 46), hl = tag(stage, '90 cm', cx + rx + 62, (yt + yb) / 2);
  const rl = hide(tag(stage, T('r=30'), cx + rx / 2, yt - 22, 'red'));
  const L1 = hide(ln(stage, T('r=60\\div2=30\\text{ cm}'), RX, 20, RW));
  const L2 = hide(ln(stage, `Base: ${T('\\pi r^2=\\pi\\times30^2\\approx2\\,827\\text{ cm}^2')}`, RX, 80, RW));
  const L3 = hide(ln(stage, T('V=\\pi r^2h=\\pi\\times30^2\\times90'), RX, 140, RW));
  const R1 = hide(cb(stage, 'u4l7-res', T('V\\approx254\\,469\\text{ cm}^3'), RX + 30, 196, RW - 60, 56));
  const L4 = hide(ln(stage, `${T('1\\text{ L}=1\\,000\\text{ cm}^3')}: ${T('254\\,469\\div1\\,000')}`, RX, 268, RW));
  const R2 = hide(cb(stage, 'u4l7-res', T('\\approx254.5\\text{ L}'), RX + 30, 320, RW - 60, 54));
  return [
    { cap: `The barrel is 60 cm <b>across</b>: that is the diameter. The radius is half: ${T('r=60\\div2=30')} cm.`,
      run: async (c) => { await c.pop(dl); await show(c, rad); await show(c, cdot, 200); await c.pop(rl); await c.fadeIn(L1); } },
    { cap: `The base is a circle: ${T('\\pi r^2=\\pi\\times30^2\\approx2\\,827')} cm².`, run: async (c) => { await show(c, base, 500); await c.fadeIn(L2); } },
    { cap: `Stack the base up 90 cm: ${T('V=\\pi r^2h=\\pi\\times30^2\\times90\\approx254\\,469')} cm³.`,
      run: async (c) => { await c.pop(hl); await tween(c, 1600, (t) => setLevel(t)); await c.fadeIn(L3); await c.pop(R1); } },
    { cap: `(b) ${T('1\\text{ L}=1\\,000\\text{ cm}^3')}, so divide by 1000: about <b>254.5 L</b>.`, run: async (c) => { await c.fadeIn(L4); await c.pop(R2); } }
  ];
}
function barrelGal(stage, ex) {
  const W = ex.W, H = 390, svg = svgOn(stage, W, H), X0 = 240, X1 = W - 150, BW = X1 - X0, TOT = 254.469;
  const top = el(stage, 'u4l7-gbar w', `<div>The barrel: <b>254.469 L</b> <small>(from part b, before rounding)</small></div>`, X0, 22, BW, 56);
  hide(top);
  const rows = [{ y: 128, size: 3.785, name: 'US gallon', n: TOT / 3.785, cls: 'us', jh: 64 }, { y: 262, size: 4.546, name: 'British gallon', n: TOT / 4.546, cls: 'br', jh: 77 }];
  const parts = rows.map((r) => {
    const bar = hide(el(stage, 'u4l7-gbar ' + r.cls, '', X0, r.y, BW, 60));
    const g = svgEl('g', {}, svg); g.style.opacity = 0;
    const full = Math.floor(r.n), pw = BW * r.size / TOT;
    for (let i = 1; i <= full; i++) svgEl('line', { x1: X0 + i * pw, y1: r.y + 4, x2: X0 + i * pw, y2: r.y + 56, stroke: '#fff', 'stroke-width': 2 }, g);
    const clip = svgEl('clipPath', { id: 'u4l7clip' + r.cls }, svg); const cr = svgEl('rect', { x: X0, y: r.y - 4, width: 0, height: 70 }, clip);
    g.setAttribute('clip-path', `url(#u4l7clip${r.cls})`);
    const fill = hide(el(stage, 'u4l7-gfill ' + r.cls, '', X0, r.y, 0, 60));
    // a jug drawn to scale with its gallon
    const jx = 24, jw = r.jh * 0.75, jy = r.y + 60 - r.jh;
    const jug = add(stage, svgEl('svg', { width: jw + 20, height: r.jh + 4, viewBox: `0 0 ${jw + 20} ${r.jh + 4}`, class: 'u4l7-svg' }), jx, jy);
    svgEl('path', { d: `M4 ${r.jh * 0.28} Q4 ${r.jh * 0.14} ${jw * 0.3} ${r.jh * 0.1} V2 H${jw * 0.62} V${r.jh * 0.1} Q${jw} ${r.jh * 0.14} ${jw} ${r.jh * 0.28} V${r.jh} H4 Z`, fill: r.cls === 'us' ? '#cfe0fb' : '#f6d2c4', stroke: r.cls === 'us' ? '#1f5bd6' : '#b0451a', 'stroke-width': 3 }, jug);
    svgEl('path', { d: `M${jw} ${r.jh * 0.3} q16 4 14 22 q-2 14 -14 16`, fill: 'none', stroke: r.cls === 'us' ? '#1f5bd6' : '#b0451a', 'stroke-width': 4 }, jug);
    hide(jug);
    const nm = hide(el(stage, 'u4l7-jlab', `<div><b>${r.name}</b><br>≈ ${r.size} L</div>`, 112, r.y - 2, 124, 64));
    const ct = hide(el(stage, 'u4l7-gcnt ' + r.cls, '', X1 + 10, r.y + 6, 140, 48));
    return { r, bar, g, cr, fill, jug, nm, ct, pw };
  });
  stage.appendChild(svg); // the gallon lines go on top of the bars
  const sweep = async (c, p) => {
    p.bar.style.opacity = 1; p.g.style.opacity = 1; p.fill.style.opacity = 1;
    await c.fadeIn(p.jug); await c.fadeIn(p.nm, 250); p.ct.style.opacity = 1;
    await tween(c, 2000, (t) => { const w = BW * t; p.cr.setAttribute('width', w); p.fill.style.width = w + 'px'; p.ct.innerHTML = `${(p.r.n * t).toFixed(1)} gal`; });
  };
  const note = hide(cb(stage, 'u4l7-note', 'A British gallon is <b>bigger</b>, so it takes <b>fewer</b> of them to fill the same barrel.', 24, 338, W - 48, 44));
  return [
    { cap: 'Same barrel for both stores: <b>254.469 L</b>. Keep all the digits until the end.', run: (c) => c.fadeIn(top) },
    { cap: `How many US gallons fit? ${T('254.469\\div3.785\\approx67.2')} US gallons.`, run: (c) => sweep(c, parts[0]) },
    { cap: `How many British gallons? ${T('254.469\\div4.546\\approx56.0')} British gallons.`, run: (c) => sweep(c, parts[1]) },
    { cap: 'Why is 56.0 smaller than 67.2? Each British gallon is about 20% <b>bigger</b>, so fewer of them fill the barrel.', run: async (c) => { await pulse(c, parts[1].jug, 1.15); await c.fadeIn(note); } }
  ];
}
const barrel = {
  title: 'The rain barrel: litres and two kinds of gallon',
  height: 390,
  minW: 960,
  choices: [{ sep: 'Example 2 check:' }, { v: 'ab', label: '(a)(b) Volume, then litres' }, { v: 'cd', label: '(c)(d) US vs British gallons' }],
  ask: (k) => BARREL_ASK[k],
  make: (stage, k, ex) => (k === 'ab' ? barrelVol(stage, ex) : barrelGal(stage, ex))
};

/* =====================================================================================
 * 3. Example 3: the concrete pad (4 in → 1/3 ft, cubic yards, ordering in half yards)
 * ===================================================================================== */
const PAD_ASK = {
  a: 'Example 3(a): Dev’s concrete pad is 10 ft by 12 ft and 4 in thick. Find its volume in cubic feet.',
  b: 'Example 3(b): change the 40 ft³ of concrete to cubic yards.',
  c: 'Example 3(c): the plant sells concrete in half cubic yards (0.5, 1, 1.5, …) at $210.00 per cubic yard. How much should Dev order, and what will it cost before tax?'
};
function padA(stage, ex) {
  const W = ex.W, H = 380, svg = svgOn(stage, W, H), RX = 520, RW = W - RX - 20;
  const L = 12, D = 10, Hh = 1 / 3, s = 27, zk = 4.5, P = oblique(76, 300, s, zk);
  const f = { stroke: '#4a4f5a', 'stroke-width': 2.5, 'stroke-linejoin': 'round' };
  svgEl('polygon', Object.assign({ points: pts(P, [[0, 0, Hh], [L, 0, Hh], [L, D, Hh], [0, D, Hh]]), fill: '#d5d8dd' }, f), svg);
  svgEl('polygon', Object.assign({ points: pts(P, [[0, 0, 0], [L, 0, 0], [L, 0, Hh], [0, 0, Hh]]), fill: '#b4b9c2' }, f), svg);
  svgEl('polygon', Object.assign({ points: pts(P, [[L, 0, 0], [L, D, 0], [L, D, Hh], [L, 0, Hh]]), fill: '#9aa0ab' }, f), svg);
  const lp = P(L / 2, 0, 0), dp = P(L, D / 2, 0), hp = P(0, 0, Hh / 2);
  const l1 = tag(stage, '12 ft', lp[0], lp[1] + 22), l2 = tag(stage, '10 ft', dp[0] + 40, dp[1] + 8), l3 = tag(stage, '4 in', hp[0] - 32, hp[1], 'red');
  hide(l1, l2, l3);
  // the foot ruler: 12 inches, 4 of them shaded
  const RY = 30, CW = 34;
  const ruler = hide(el(stage, 'u4l7-ruler', Array.from({ length: 12 }, (_, i) => `<i class="${i < 4 ? 'on' : ''}">${i + 1}</i>`).join(''), RX, RY, CW * 12, 44));
  const rlab = hide(el(stage, 'u4l7-small', '1 ft = 12 in', RX, RY + 48, CW * 12, 26));
  const L1 = hide(ln(stage, `4 in ${T('=4\\div12=\\dfrac{1}{3}')} ft`, RX, 112, RW, 62));
  const L2 = hide(ln(stage, T('V=10\\times12\\times\\dfrac{1}{3}'), RX, 182, RW, 62));
  const R = hide(cb(stage, 'u4l7-res', T('V=40\\text{ ft}^3'), RX + 30, 252, RW - 60, 58));
  return [
    { cap: 'The pad is 10 ft by 12 ft, and only 4 <b>in</b> thick. Two different units!', run: async (c) => { await c.pop(l1, 300); await c.pop(l2, 300); await c.pop(l3, 300); await c.shake(l3); } },
    { cap: `Same units first. 1 ft = 12 in, so 4 in is 4 of the 12 parts: ${T('4\\div12=\\tfrac13')} ft.`, run: async (c) => { await c.fadeIn(ruler); await c.fadeIn(rlab, 250); await c.fadeIn(L1); } },
    { cap: `${T('V=l\\times w\\times h=10\\times12\\times\\tfrac13=40')} ft³.`, run: async (c) => { await c.fadeIn(L2); await c.pop(R); } }
  ];
}
function padB(stage, ex) {
  const W = ex.W, RX = 600, RW = W - RX - 20, CS = 40, G = 5, X0 = 40, Y0 = 30, COLS = 9;
  const cubes = Array.from({ length: 40 }, (_, i) => hide(el(stage, 'u4l7-cube', '', X0 + (i % COLS) * (CS + G), Y0 + Math.floor(i / COLS) * (CS + G), CS, CS)));
  const yd = hide(el(stage, 'u4l7-grp', '', X0 - 7, Y0 - 7, COLS * (CS + G) + 9, 3 * (CS + G) + 9));
  const ydl = hide(el(stage, 'u4l7-glab', '27 ft³ = 1 yd³', X0 + COLS * (CS + G) + 8, Y0 + 50, 120, 40));
  const left = hide(el(stage, 'u4l7-glab r', '13 ft³ left', X0 + 4 * (CS + G) + 10, Y0 + 4 * (CS + G) + 4, 140, 40));
  const L1 = hide(ln(stage, T('1\\text{ yd}^3=3\\times3\\times3=27\\text{ ft}^3'), RX, 40, RW));
  const L2 = hide(ln(stage, `${T('40\\div27\\approx1.48')}`, RX, 120, RW));
  const R = hide(cb(stage, 'u4l7-res', T('40\\text{ ft}^3\\approx1.48\\text{ yd}^3'), RX + 20, 200, RW - 40, 58));
  const N = hide(cb(stage, 'u4l7-note', 'A bit more than 1 cubic yard, a bit less than 1.5', RX, 282, RW, 52));
  return [
    { cap: 'The pad is <b>40 ft³</b>: 40 little cubes, each 1 ft on every edge.', run: (c) => tween(c, 1200, (t) => cubes.forEach((q, i) => { q.style.opacity = i < t * 40 ? 1 : 0; })) },
    { cap: `A cubic yard is ${T('3\\times3\\times3=27')} of them. Group 27 cubes: that is <b>1 yd³</b>.`,
      run: async (c) => { await c.fadeIn(L1); for (let i = 0; i < 27; i++) cubes[i].classList.add('yd'); await show(c, yd); await c.fadeIn(ydl); } },
    { cap: `13 cubes are left, part of another yard. ${T('40\\div27\\approx1.48')} yd³.`, run: async (c) => { for (let i = 27; i < 40; i++) cubes[i].classList.add('rest'); await c.fadeIn(left); await c.fadeIn(L2); await c.pop(R); await c.fadeIn(N); } }
  ];
}
function padC(stage, ex) {
  const W = ex.W, RX = 640, RW = W - RX - 20;
  const N = new NumberLine(stage, { x: 20, y: 120, width: 600, height: 120, min: 0, max: 2.5, step: 0.5, minor: 0.1, labels: (v) => T(v) });
  const need = N.point(1.48, { color: 'blue', label: '1.48 needed' }); hide(need, need.label);
  const no1 = hide(add(stage, h('div', 'u4l7-x', '✗'), 20 + N.toPx(1) - 12, 120 + N.ay - 58));
  const buy = N.point(1.5, { color: 'red' }); hide(buy);
  const buyl = hide(tag(stage, '<b>order 1.5 yd³</b>', 20 + N.toPx(1.5) + 30, 120 + N.ay + 70, 'red'));
  const L1 = hide(ln(stage, 'Sizes: 0.5, 1, 1.5, 2, … yd³', 20, 30, 600));
  const rc = hide(el(stage, 'u4l7-rcpt', `<div class="rh">Calgary Ready-Mix</div><div>Concrete <span class="rv">1.5 yd³</span></div><div>@ $210.00 / yd³</div><div class="rt">${T('1.5\\times\\$210.00')}</div><div class="rb">$315.00</div>`, RX, 30, RW, 250));
  return [
    { cap: 'Dev needs <b>1.48 yd³</b>. The plant only sells 0.5, 1, 1.5, 2, …', run: async (c) => { await c.fadeIn(L1); await show(c, need); await c.fadeIn(need.label); } },
    { cap: '1 yd³ is <b>not enough</b>: the pad would not get finished. Go to the next half yard <b>up</b>: 1.5 yd³.',
      run: async (c) => { await c.pop(no1); await N.hop(c, 1.48, 1.5, { height: 40, color: 'red' }); await show(c, buy); await c.pop(buyl); } },
    { cap: `Cost: ${T('1.5\\times\\$210.00=\\$315.00')}. Dev orders <b>1.5 yd³ for $315.00</b> before tax.`, run: (c) => c.pop(rc) }
  ];
}
const pad = {
  title: 'Same units first, then cubic yards',
  height: 380,
  minW: 960,
  choices: [{ sep: 'Example 3 check:' }, { v: 'a', label: '(a) Cubic feet' }, { v: 'b', label: '(b) Cubic yards' }, { v: 'c', label: '(c) Order and cost' }],
  ask: (k) => PAD_ASK[k],
  make: (stage, k, ex) => (k === 'a' ? padA(stage, ex) : k === 'b' ? padB(stage, ex) : padC(stage, ex))
};

/* =====================================================================================
 * 4. Full notes: build the cube (27 and 1728)
 * ===================================================================================== */
const CUBE = {
  yd: { ask: 'Why is 1 yd³ = 27 ft³? A cube 1 yd on each edge is 3 ft on each edge.', n: 3, big: 'yd', small: 'ft' },
  ft: { ask: 'Why is 1 ft³ = 1728 in³? A cube 1 ft on each edge is 12 in on each edge.', n: 12, big: 'ft', small: 'in' }
};
const cubic = {
  title: 'One layer, then the layers',
  height: 390,
  minW: 960,
  choices: [{ v: 'yd', label: '1 yd³ in ft³' }, { v: 'ft', label: '1 ft³ in in³' }],
  ask: (k) => CUBE[k].ask,
  make(stage, k, ex) {
    const d = CUBE[k], n = d.n, W = ex.W, svg = svgOn(stage, W, 390), S = 250, s = S / n, P = oblique(60, 340, s, 1, 1.15), RX = 470, RW = W - RX - 20;
    const lw = n > 6 ? 1 : 2;
    const layers = Array.from({ length: n }, (_, i) => {
      const g = svgEl('g', {}, svg); g.style.opacity = 0;
      const fa = { stroke: '#6e4a1c', 'stroke-width': 2, 'stroke-linejoin': 'round' };
      svgEl('polygon', Object.assign({ points: pts(P, [[0, 0, i], [n, 0, i], [n, 0, i + 1], [0, 0, i + 1]]), fill: '#f3dcb0' }, fa), g);
      svgEl('polygon', Object.assign({ points: pts(P, [[n, 0, i], [n, n, i], [n, n, i + 1], [n, 0, i + 1]]), fill: '#d9b77e' }, fa), g);
      svgEl('polygon', Object.assign({ points: pts(P, [[0, 0, i + 1], [n, 0, i + 1], [n, n, i + 1], [0, n, i + 1]]), fill: '#fbecd0' }, fa), g);
      for (let j = 1; j < n; j++) {
        const a = P(j, 0, i), b = P(j, 0, i + 1), c1 = P(n, j, i), c2 = P(n, j, i + 1), t1 = P(j, 0, i + 1), t2 = P(j, n, i + 1), u1 = P(0, j, i + 1), u2 = P(n, j, i + 1);
        [[a, b], [c1, c2], [t1, t2], [u1, u2]].forEach(([p, q]) => svgEl('line', { x1: p[0], y1: p[1], x2: q[0], y2: q[1], stroke: '#9a6a24', 'stroke-width': lw }, g));
      }
      return g;
    });
    const edge = tag(stage, `1 ${d.big} = ${n} ${d.small}`, P(n / 2, 0, 0)[0], P(n / 2, 0, 0)[1] + 22);
    const L1 = hide(ln(stage, `One layer: ${T(`${n}\\times${n}=${tx(n * n)}`)} cubes`, RX, 40, RW));
    const cnt = hide(ln(stage, '', RX, 110, RW));
    const R = hide(cb(stage, 'u4l7-res', T(`1\\text{ ${d.big}}^3=${n}\\times${n}\\times${n}=${tx(n ** 3)}\\text{ ${d.small}}^3`), RX, 190, RW, 60));
    const N = hide(cb(stage, 'u4l7-note', `Same idea in SI: ${T('1\\text{ m}^3=100\\times100\\times100=1\\,000\\,000\\text{ cm}^3')}`, RX, 290, RW, 56));
    void edge;
    return [
      { cap: `The bottom layer is ${n} by ${n}: ${T(`${n}\\times${n}=${tx(n * n)}`)} little cubes, 1 ${d.small} on each edge.`, run: async (c) => { await show(c, layers[0]); await c.fadeIn(L1); } },
      { cap: `Stack the layers. The cube is ${n} ${d.small} tall, so there are <b>${n} layers</b>.`,
        run: async (c) => { cnt.style.opacity = 1; for (let i = 1; i < n; i++) { cnt.innerHTML = `<div>${T(`${i + 1}\\text{ layers}\\times${tx(n * n)}=${tx((i + 1) * n * n)}`)}</div>`; await show(c, layers[i], n > 6 ? 160 : 400); } cnt.innerHTML = `<div>${T(`${n}\\text{ layers}\\times${tx(n * n)}=${tx(n ** 3)}`)}</div>`; } },
      { cap: `${T(`1\\text{ ${d.big}}^3=${n}\\times${n}\\times${n}=${tx(n ** 3)}\\text{ ${d.small}}^3`)}. Cubic units grow <b>three times</b> over, not once.`, run: async (c) => { await c.pop(R); await c.fadeIn(N); } }
    ];
  }
};

/* =====================================================================================
 * 5. Example 4: the double thermometer and the oven dial
 * ===================================================================================== */
const TH = {
  a: { ask: 'Example 4(a): the forecast in Phoenix, Arizona, is a high of 104 °F. What is that in Celsius?', lo: -10, hi: 50, cs: 10, fs: 20, v: 40 },
  b: { ask: 'Example 4(b): it is −15 °C in Calgary. What is that in Fahrenheit?', lo: -30, hi: 30, cs: 10, fs: 20, v: -15 },
  c: { ask: 'Example 4(c): use the quick estimate to change 22 °C to Fahrenheit. Then find the exact answer. Is the estimate good enough to decide what to wear?', lo: 0, hi: 40, cs: 10, fs: 10, v: 22 },
  d: { ask: 'Example 4(d): a cookie recipe from a US website says to bake at 375 °F. What should you set a Celsius oven to?', lo: 0, hi: 250, cs: 50, fs: 100, v: (375 - 32) / 1.8 }
};
const cToF = (C) => 1.8 * C + 32;
function thermoBase(stage, d, ex) {
  const W = ex.W, H = 400, svg = svgOn(stage, W, H), TX = 200, TW = 28, YT = 30, YB = 322;
  const y = (C) => YB - (C - d.lo) / (d.hi - d.lo) * (YB - YT);
  svgEl('rect', { x: TX - TW / 2, y: YT - 14, width: TW, height: YB - YT + 40, rx: TW / 2, fill: '#fff', stroke: '#1c2230', 'stroke-width': 3 }, svg);
  svgEl('circle', { cx: TX, cy: YB + 38, r: 26, fill: '#c93a33', stroke: '#1c2230', 'stroke-width': 3 }, svg);
  const liq = svgEl('rect', { x: TX - 7, width: 14, fill: '#c93a33', rx: 4 }, svg);
  const setT = (C) => { const yy = y(C); liq.setAttribute('y', yy); liq.setAttribute('height', YB + 30 - yy); };
  svgEl('text', { x: TX - 44, y: 18, 'text-anchor': 'middle', class: 'u4l7-thh' }, svg).textContent = '°C';
  svgEl('text', { x: TX + 46, y: 18, 'text-anchor': 'middle', class: 'u4l7-thh' }, svg).textContent = '°F';
  for (let C = Math.ceil(d.lo / d.cs) * d.cs; C <= d.hi + 1e-9; C += d.cs) {
    svgEl('line', { x1: TX - TW / 2 - 12, x2: TX - TW / 2, y1: y(C), y2: y(C), stroke: '#1c2230', 'stroke-width': 2.5 }, svg);
    svgEl('text', { x: TX - TW / 2 - 16, y: y(C) + 6, 'text-anchor': 'end', class: 'u4l7-thn' }, svg).textContent = String(C).replace('-', '−');
  }
  const flo = cToF(d.lo), fhi = cToF(d.hi);
  for (let F = Math.ceil(flo / d.fs) * d.fs; F <= fhi + 1e-9; F += d.fs) {
    const yy = y((F - 32) / 1.8);
    svgEl('line', { x1: TX + TW / 2, x2: TX + TW / 2 + 12, y1: yy, y2: yy, stroke: '#1f5bd6', 'stroke-width': 2.5 }, svg);
    svgEl('text', { x: TX + TW / 2 + 16, y: yy + 6, 'text-anchor': 'start', class: 'u4l7-thn f' }, svg).textContent = String(F).replace('-', '−');
  }
  if (d.lo < 0) { svgEl('line', { x1: TX - TW / 2 - 4, x2: TX + TW / 2 + 4, y1: y(0), y2: y(0), stroke: '#1f5bd6', 'stroke-width': 1.5, 'stroke-dasharray': '4 3' }, svg); }
  setT(d.lo);
  const cTag = (html, C, cls = '') => hide(el(stage, 'u4l7-ttag ' + cls, html, TX - 196, y(C) - 18, 100, 36));
  const fTag = (html, C, cls = '') => hide(el(stage, 'u4l7-ttag tf ' + cls, html, TX + 80, y(C) - 18, 104, 36));
  const rise = (c, C, ms = 1300) => { const y0 = parseFloat(liq.getAttribute('y')), C0 = d.lo + (YB - y0) / (YB - YT) * (d.hi - d.lo); return tween(c, ms, (t) => setT(lerp(C0, C, t))); };
  return { svg, y, rise, cTag, fTag, RX: 410, RW: W - 430 };
}
function thermoSteps(stage, k, ex) {
  const d = TH[k], B = thermoBase(stage, d, ex), RX = B.RX, RW = B.RW;
  const L = (html, i) => hide(ln(stage, html, RX, 24 + i * 62, RW));
  if (k === 'a') {
    const ft = B.fTag('104 °F', 40), ct = B.cTag('40 °C', 40, 'an');
    const l1 = L(T('C=(F-32)\\div1.8'), 0), l2 = L(T('=(104-32)\\div1.8'), 1), l3 = L(T('=72\\div1.8'), 2), l4 = L(T('=40'), 3);
    const R = hide(cb(stage, 'u4l7-res', 'It will be <b>40 °C</b> in Phoenix.', RX + 20, 290, RW - 40, 56));
    return [
      { cap: 'Phoenix: 104 °F. Find it on the <b>°F</b> side.', run: async (c) => { await B.rise(c, 40); await c.pop(ft); await c.fadeIn(l1); } },
      { cap: `Subtract 32 <b>first</b>: ${T('104-32=72')}.`, run: async (c) => { await c.fadeIn(l2); await c.fadeIn(l3); } },
      { cap: `Then divide by 1.8: ${T('72\\div1.8=40')}. Read it on the <b>°C</b> side.`, run: async (c) => { await c.fadeIn(l4); await c.pop(ct); } },
      { cap: 'It will be <b>40 °C</b> in Phoenix. Very hot!', run: (c) => c.pop(R) }
    ];
  }
  if (k === 'b') {
    const ct = B.cTag('−15 °C', -15), ft = B.fTag('5 °F', -15, 'an');
    const l1 = L(T('F=1.8\\times C+32'), 0), l2 = L(T('=1.8\\times(-15)+32'), 1), l3 = L(T('=-27+32'), 2), l4 = L(T('=5'), 3);
    const R = hide(cb(stage, 'u4l7-res', 'It is <b>5 °F</b> in Calgary.', RX + 20, 290, RW - 40, 56));
    return [
      { cap: 'Calgary: −15 °C. The liquid sits below 0 °C.', run: async (c) => { await B.rise(c, -15); await c.pop(ct); await c.fadeIn(l1); } },
      { cap: `Multiply by 1.8: ${T('1.8\\times(-15)=-27')}. On the calculator use <span class="keys"><kbd>(−)</kbd></span> for −15.`, run: async (c) => { await c.fadeIn(l2); await c.fadeIn(l3); } },
      { cap: `Then add 32: ${T('-27+32=5')}. Read it on the <b>°F</b> side.`, run: async (c) => { await c.fadeIn(l4); await c.pop(ft); } },
      { cap: 'It is <b>5 °F</b> in Calgary.', run: (c) => c.pop(R) }
    ];
  }
  if (k === 'c') {
    const ct = B.cTag('22 °C', 22), fe = B.fTag('≈ 74 °F', (74 - 32) / 1.8, 'est'), fx = B.fTag('71.6 °F', 22, 'an');
    fe.style.left = (parseFloat(fe.style.left) + 0) + 'px'; fe.style.top = (parseFloat(fe.style.top) - 22) + 'px'; fx.style.top = (parseFloat(fx.style.top) + 18) + 'px';
    const l1 = L(`Estimate: ${T('2\\times22+30=74')} °F`, 0), l2 = L(`Exact: ${T('1.8\\times22+32=71.6')} °F`, 1), l3 = L(`Off by ${T('74-71.6=2.4')} degrees`, 2);
    const R = hide(cb(stage, 'u4l7-res', '<b>Yes</b>: good enough to choose clothes.', RX + 20, 230, RW - 40, 56));
    const sp = hide(stamp(stage, 'Good enough ✓', { ok: true, x: RX + RW - 120, y: 330, rotate: -6 }));
    return [
      { cap: `22 °C. Quick estimate: <b>double it, then add 30</b>. ${T('2\\times22+30=74')} °F.`, run: async (c) => { await B.rise(c, 22); await c.pop(ct); await c.fadeIn(l1); await c.pop(fe); } },
      { cap: `The exact rule: ${T('1.8\\times22+32=71.6')} °F.`, run: async (c) => { await c.fadeIn(l2); await c.pop(fx); } },
      { cap: 'The estimate is only about 2 degrees off. That is close enough to decide between a T-shirt and a jacket.', run: async (c) => { await c.fadeIn(l3); await c.pop(R); await stampIn(c, sp); } }
    ];
  }
  // (d) the oven
  const ft = B.fTag('375 °F', d.v), ct = B.cTag('190.6 °C', d.v, 'an');
  const l1 = L(T('C=(375-32)\\div1.8'), 0), l2 = L(T('=343\\div1.8\\approx190.6'), 1);
  // the oven dial
  const DX = RX + RW - 130, DY = 268, DR = 92, a0 = -135, a1 = 135, v0 = 150, v1 = 250;
  const ang = (v) => a0 + (v - v0) / (v1 - v0) * (a1 - a0);
  const dial = svgEl('g', {}, B.svg); dial.style.opacity = 0;
  svgEl('circle', { cx: DX, cy: DY, r: DR + 14, fill: '#2f3542' }, dial);
  svgEl('circle', { cx: DX, cy: DY, r: DR, fill: '#f4f1e6' }, dial);
  for (let v = v0; v <= v1; v += 10) {
    const r = (ang(v) - 90) * Math.PI / 180, big = v % 50 === 0 || v === 190;
    svgEl('line', { x1: DX + Math.cos(r) * (DR - (big ? 16 : 9)), y1: DY + Math.sin(r) * (DR - (big ? 16 : 9)), x2: DX + Math.cos(r) * (DR - 2), y2: DY + Math.sin(r) * (DR - 2), stroke: v === 190 ? '#c93a33' : '#1c2230', 'stroke-width': big ? 3 : 2 }, dial);
    if (v % 50 === 0) { const t = svgEl('text', { x: DX + Math.cos(r) * (DR - 30), y: DY + Math.sin(r) * (DR - 30) + 6, 'text-anchor': 'middle', class: 'u4l7-dn' }, dial); t.textContent = v; }
  }
  const ptr = svgEl('g', {}, dial);
  svgEl('circle', { cx: DX, cy: DY, r: 24, fill: '#3a4254' }, ptr);
  svgEl('path', { d: `M${DX - 6} ${DY} L${DX} ${DY - DR + 34} L${DX + 6} ${DY} Z`, fill: '#c93a33' }, ptr);
  ptr.style.transformBox = 'view-box'; ptr.style.transformOrigin = `${DX}px ${DY}px`; ptr.style.transform = `rotate(${a0}deg)`;
  const dl = hide(el(stage, 'u4l7-small', 'Oven dial (°C)', DX - 80, DY + DR + 16, 160, 24));
  const R = hide(cb(stage, 'u4l7-res', 'Set the oven to <b>about 190 °C</b>.', RX, 172, RW - 250, 80));
  return [
    { cap: '375 °F for the cookies. Find it on the <b>°F</b> side.', run: async (c) => { await B.rise(c, d.v, 1500); await c.pop(ft); await c.fadeIn(l1); } },
    { cap: `Subtract 32 first, then divide by 1.8: ${T('343\\div1.8\\approx190.6')} °C.`, run: async (c) => { await c.fadeIn(l2); await c.pop(ct); } },
    { cap: 'Oven dials go up in steps of 5 or 10 degrees, so set the oven to <b>about 190 °C</b>.',
      run: async (c) => { await show(c, dial); await c.fadeIn(dl, 200); await tween(c, 1000, (t) => { ptr.style.transform = `rotate(${lerp(a0, ang(190), t)}deg)`; }); await c.pop(R); } }
  ];
}
const thermo = {
  title: 'The double thermometer',
  height: 400,
  minW: 960,
  choices: [{ sep: 'Example 4 check:' }, { v: 'a', label: '(a) 104 °F in Phoenix' }, { v: 'b', label: '(b) −15 °C in Calgary' }, { v: 'c', label: '(c) Estimate 22 °C' }, { v: 'd', label: '(d) The oven' }],
  ask: (k) => TH[k].ask,
  make: (stage, k, ex) => thermoSteps(stage, k, ex)
};

/* =====================================================================================
 * 6. Full notes: how good is the quick estimate? (two lines and the gap)
 * ===================================================================================== */
const EST = {
  c22: { C: 22, ask: 'Example 4(c) again: how far off is the quick estimate at 22 °C?' },
  c10: { C: 10, ask: 'How far off is the quick estimate at 10 °C?' },
  cm30: { C: -30, ask: 'How far off is the quick estimate on a very cold day, −30 °C?' }
};
const estLine = {
  title: 'Exact line vs estimate line',
  height: 400,
  minW: 960,
  choices: [{ sep: 'Compare at:' }, { v: 'c22', label: '22 °C' }, { v: 'c10', label: '10 °C' }, { v: 'cm30', label: '−30 °C' }],
  ask: (k) => EST[k].ask,
  make(stage, k, ex) {
    const d = EST[k], W = ex.W, RX = 590, RW = W - RX - 20, C = d.C, Fx = rnd(cToF(C), 1), Fe = 2 * C + 30, gap = rnd(Math.abs(Fe - Fx), 1);
    const G = new Graph(stage, { x: 10, y: 6, width: 560, height: 388, xmin: -40, xmax: 50, ymin: -40, ymax: 130, xstep: 10, ystep: 10, xlabels: 10, ylabels: 20, xtitle: 'C', ytitle: 'F', fontSize: 15 });
    const n = (v) => String(v).replace('-', '−');
    const k1 = hide(el(stage, 'u4l7-key b', `<div>Exact: ${T('F=1.8C+32')}</div>`, RX, 20, RW, 44));
    const k2 = hide(el(stage, 'u4l7-key o', `<div>Estimate: ${T('F\\approx2C+30')}</div>`, RX, 72, RW, 44));
    const cs = C < 0 ? `(${C})` : C;
    const l1 = hide(ln(stage, `Exact: ${T(`1.8\\times${cs}+32=${Fx}`)}`, RX, 140, RW, 44, 'sm'));
    const l2 = hide(ln(stage, `Estimate: ${T(`2\\times${cs}+30=${Fe}`)}`, RX, 190, RW, 44, 'sm'));
    const msg = C === 10 ? 'The lines <b>cross</b> at 10 °C: the estimate is exactly right there.'
      : C < 0 ? `Off by <b>${gap} degrees</b>! Far from 10 °C the lines drift apart. In very cold or very hot weather, use the exact rule.`
        : `Off by only <b>${gap} degrees</b>. Near 10 °C the two lines are close together.`;
    const R = hide(cb(stage, 'u4l7-note', msg, RX, 252, RW, 120));
    return [
      { cap: `The exact rule ${T('F=1.8C+32')} is a straight line.`, run: async (c) => { await c.fadeIn(k1); await G.drawIn(G.fn('1.8*x+32', { color: 'blue', width: 4 }), 900, c); } },
      { cap: `The quick estimate ${T('F\\approx2C+30')} is a line too, a little steeper.`, run: async (c) => { await c.fadeIn(k2); await G.drawIn(G.fn('2*x+30', { color: 'orange', width: 4, dash: '10 7' }), 900, c); } },
      { cap: `At ${n(C)} °C: exact ${n(Fx)} °F, estimate ${n(Fe)} °F.`,
        run: async (c) => { await G.drawIn(G.vline(C), 500, c); await G.reveal(G.point(C, Fx, { color: 'blue' }), c); await G.reveal(G.point(C, Fe, { color: 'orange' }), c); await c.fadeIn(l1); await c.fadeIn(l2); } },
      { cap: C === 10 ? 'At 10 °C the estimate and the exact answer are the same: 50 °F.' : `The gap is ${gap} degrees.`, run: (c) => c.fadeIn(R) }
    ];
  }
};

/* =====================================================================================
 * 7. Example 5: the SI staircase, the ounce strip, and borrowing a pound
 * ===================================================================================== */
const MU_ASK = {
  a: 'Example 5(a): fill in the blanks. 3.6 kg = ___ g, 750 mg = ___ g, 4.2 t = ___ kg',
  b: 'Example 5(b): fill in the blanks. 3 lb 6 oz = ___ oz, 74 oz = ___ lb ___ oz',
  c: 'Example 5(c): Baby Amira weighed 7 lb 9 oz at birth and 11 lb 4 oz at two months. How much did she gain?'
};
function stairSteps(stage, ex) {
  const W = ex.W, RX = 680, RW = W - RX - 20, SW = 140, SH = 58;
  const pos = { t: [20, 30], kg: [190, 108], g: [360, 186], mg: [530, 264] };
  const names = { t: 'tonne (t)', kg: 'kilogram (kg)', g: 'gram (g)', mg: 'milligram (mg)' };
  const st = Object.keys(pos).map((u) => hide(el(stage, 'u4l7-step', `<div>${names[u]}</div>`, pos[u][0], pos[u][1], SW, SH)));
  const arr = [['t', 'kg'], ['kg', 'g'], ['g', 'mg']].map(([a]) => hide(el(stage, 'u4l7-sarr', '<b>× 1000</b> ↘<br><i>÷ 1000</i> ↖', pos[a][0] + SW + 4, pos[a][1] + 6, 120, 52)));
  const tok = hide(el(stage, 'u4l7-tok', '', 0, 0, 92, 40));
  const lines = ['3.6 kg = <b>3600</b> g', '750 mg = <b>0.75</b> g', '4.2 t = <b>4200</b> kg'].map((s, i) => hide(ln(stage, s, RX, 40 + i * 70, RW)));
  const place = (u) => [pos[u][0] + SW / 2 - 46, pos[u][1] + SH + 6];
  const go = async (c, from, to, a, b) => {
    tok.innerHTML = a; at2(tok, ...place(from)); await c.pop(tok, 300);
    await moveTo(c, tok, ...place(to), 800); tok.innerHTML = b; await pulse(c, tok, 1.15);
  };
  const at2 = (e, x, y) => { e.style.left = x + 'px'; e.style.top = y + 'px'; };
  return [
    { cap: 'The SI staircase for mass. Going <b>down</b> to a smaller unit: × 1000. Going <b>up</b> to a bigger unit: ÷ 1000.', run: async (c) => { for (const s of st) await c.pop(s, 260); for (const a of arr) await c.fadeIn(a, 220); } },
    { cap: `3.6 kg to g: one step <b>down</b>, so × 1000. ${T('3.6\\times1\\,000=3\\,600')} g.`, run: async (c) => { await go(c, 'kg', 'g', '3.6 kg', '3600 g'); await c.fadeIn(lines[0]); } },
    { cap: `750 mg to g: one step <b>up</b>, so ÷ 1000. ${T('750\\div1\\,000=0.75')} g.`, run: async (c) => { await go(c, 'mg', 'g', '750 mg', '0.75 g'); await c.fadeIn(lines[1]); } },
    { cap: `4.2 t to kg: one step <b>down</b>, so × 1000. ${T('4.2\\times1\\,000=4\\,200')} kg.`, run: async (c) => { await go(c, 't', 'kg', '4.2 t', '4200 kg'); await c.fadeIn(lines[2]); } }
  ];
}
function ozSteps(stage, ex) {
  const W = ex.W, X0 = 30, CW = Math.floor((W - 60) / 74), CH = 38, Y1 = 44, Y2 = 214;
  const mk = (n, y, grp) => Array.from({ length: n }, (_, i) => hide(el(stage, 'u4l7-oz' + (grp ? ' g' + (Math.floor(i / 16) % 2) : ''), '', X0 + i * CW, y, CW, CH)));
  const r1 = mk(54, Y1, false);
  const lb1 = [0, 1, 2].map((j) => hide(el(stage, 'u4l7-brk', '1 lb = 16 oz', X0 + j * 16 * CW, Y1 + CH + 4, 16 * CW, 30)));
  const rest1 = hide(el(stage, 'u4l7-brk r', '6 oz', X0 + 48 * CW, Y1 + CH + 4, 6 * CW, 30));
  const t1 = hide(ln(stage, `${T('3\\times16=48')}, ${T('48+6=54')}: <b>3 lb 6 oz = 54 oz</b>`, X0, Y1 + CH + 44, 700));
  const r2 = mk(74, Y2, false);
  const lb2 = [0, 1, 2, 3].map((j) => hide(el(stage, 'u4l7-brk', '1 lb', X0 + j * 16 * CW, Y2 + CH + 4, 16 * CW, 30)));
  const rest2 = hide(el(stage, 'u4l7-brk r', '10 oz', X0 + 64 * CW, Y2 + CH + 4, 10 * CW, 30));
  const t2 = hide(ln(stage, `${T('74\\div16=4')} remainder 10: <b>74 oz = 4 lb 10 oz</b>`, X0, Y2 + CH + 44, 700));
  const lab1 = hide(el(stage, 'u4l7-small l', '3 lb 6 oz in ounces', X0, Y1 - 30, 400, 26));
  const lab2 = hide(el(stage, 'u4l7-small l', '74 oz, one box per ounce', X0, Y2 - 30, 400, 26));
  const sweep = (c, cells, ms) => tween(c, ms, (t) => cells.forEach((q, i) => { q.style.opacity = i < t * cells.length ? 1 : 0; }));
  return [
    { cap: '3 lb 6 oz. Each pound is <b>16 oz</b>: three blocks of 16.',
      run: async (c) => { await c.fadeIn(lab1, 200); for (let j = 0; j < 3; j++) { r1.slice(j * 16, j * 16 + 16).forEach((q) => q.classList.add('g' + (j % 2))); await sweep(c, r1.slice(j * 16, j * 16 + 16), 400); await c.fadeIn(lb1[j], 200); } } },
    { cap: `${T('3\\times16=48')} oz, plus the 6 oz: ${T('48+6=54')} oz.`, run: async (c) => { r1.slice(48).forEach((q) => q.classList.add('x')); await sweep(c, r1.slice(48), 300); await c.fadeIn(rest1, 200); await c.fadeIn(t1); } },
    { cap: '74 oz: line up 74 ounces.', run: async (c) => { await c.fadeIn(lab2, 200); await sweep(c, r2, 1200); } },
    { cap: `Group them in 16s: <b>4</b> full pounds (${T('4\\times16=64')}) and ${T('74-64=10')} oz left over. <b>4 lb 10 oz</b>.`,
      run: async (c) => { for (let j = 0; j < 4; j++) { r2.slice(j * 16, j * 16 + 16).forEach((q) => q.classList.add('g' + (j % 2))); await c.fadeIn(lb2[j], 260); } r2.slice(64).forEach((q) => q.classList.add('x')); await c.fadeIn(rest2, 220); await c.fadeIn(t2); } }
  ];
}
function borrowSteps(stage, ex) {
  const W = ex.W, LX = 250, OX = 420, CWd = 140, RH = 62, Y = [24, 92, 162, 252], RX = 640, RW = W - RX - 20;
  const head = [el(stage, 'u4l7-th', 'lb', LX, Y[0], CWd, 44), el(stage, 'u4l7-th', 'oz', OX, Y[0], CWd, 44)];
  const r1l = el(stage, 'u4l7-tc', '11', LX, Y[1], CWd, RH), r1o = el(stage, 'u4l7-tc', '4', OX, Y[1], CWd, RH);
  const minus = el(stage, 'u4l7-tc op', '−', LX - 70, Y[2], 60, RH);
  const r2l = el(stage, 'u4l7-tc', '7', LX, Y[2], CWd, RH), r2o = el(stage, 'u4l7-tc', '9', OX, Y[2], CWd, RH);
  const bar = el(stage, 'u4l7-bar', '', LX - 70, Y[2] + RH + 12, OX + CWd - LX + 70, 4);
  const a1 = hide(el(stage, 'u4l7-tc an', '3', LX, Y[3], CWd, RH)), a2 = hide(el(stage, 'u4l7-tc an', '11', OX, Y[3], CWd, RH));
  const lab = [el(stage, 'u4l7-rlab', 'two months', 20, Y[1], 150, RH), el(stage, 'u4l7-rlab', 'birth', 20, Y[2], 150, RH)];
  const chip = hide(el(stage, 'u4l7-chip', '1 lb', LX + CWd - 40, Y[1] - 18, 70, 36));
  const new1 = hide(el(stage, 'u4l7-new', '10', LX + CWd - 46, Y[1] + 6, 44, 30)), new2 = hide(el(stage, 'u4l7-new', '20', OX + CWd - 46, Y[1] + 6, 44, 30));
  const l1 = hide(ln(stage, '4 oz − 9 oz will not work', RX, 30, RW, 46, 'sm'));
  const l2 = hide(ln(stage, '11 lb 4 oz = <b>10 lb 20 oz</b>', RX, 90, RW, 46, 'sm'));
  const chk = hide(cb(stage, 'u4l7-note', 'Check: 7 lb 9 oz + 3 lb 11 oz<br>= 10 lb 20 oz = 11 lb 4 oz ✓', RX, 170, RW, 92));
  const R = hide(cb(stage, 'u4l7-res', 'She gained <b>3 lb 11 oz</b>.', RX, 288, RW, 56));
  void head; void minus; void bar; void lab; void r2l;
  return [
    { cap: 'Gain = later − birth: 11 lb 4 oz − 7 lb 9 oz. Pounds under pounds, ounces under ounces.', run: (c) => pulse(c, r1o, 1.05) },
    { cap: '4 oz − 9 oz will <b>not</b> work. Borrow 1 lb from the 11 lb.', run: async (c) => { await c.shake(r1o); await c.shake(r2o); await c.fadeIn(l1); await c.pop(chip); r1l.classList.add('cross'); await c.pop(new1); } },
    { cap: `1 lb = 16 oz, so the ounces become ${T('4+16=20')}. Now it is 10 lb 20 oz.`,
      run: async (c) => { await moveTo(c, chip, OX + CWd - 40, Y[1] - 18, 800); chip.innerHTML = '16 oz'; await pulse(c, chip, 1.2); r1o.classList.add('cross'); await c.pop(new2); await c.fadeIn(l2); } },
    { cap: `Subtract: ${T('20-9=11')} oz and ${T('10-7=3')} lb. She gained <b>3 lb 11 oz</b>.`, run: async (c) => { await c.pop(a2); await c.pop(a1); } },
    { cap: 'Check by adding back: 7 lb 9 oz + 3 lb 11 oz = 10 lb 20 oz = 11 lb 4 oz ✓', run: async (c) => { await c.fadeIn(chk); await c.pop(R); } }
  ];
}
const massUnits = {
  title: 'The staircase, the ounce strip and borrowing a pound',
  height: 380,
  minW: 960,
  choices: [{ sep: 'Example 5 check:' }, { v: 'a', label: '(a) SI blanks' }, { v: 'b', label: '(b) Pounds and ounces' }, { v: 'c', label: '(c) Baby Amira' }],
  ask: (k) => MU_ASK[k],
  make: (stage, k, ex) => (k === 'a' ? stairSteps(stage, ex) : k === 'b' ? ozSteps(stage, ex) : borrowSteps(stage, ex))
};

/* =====================================================================================
 * 8. Example 6: the two-ring scale, the beef price, and the conversion machines
 * ===================================================================================== */
const SC_ASK = {
  a: 'Example 6(a): an airline allows a checked bag of up to 23 kg. Jordan’s suitcase weighs 48 lb on his bathroom scale. Is it under the limit? (1 lb ≈ 0.454 kg)',
  b: 'Example 6(b): ground beef is $5.99/lb at one store and $12.99/kg at another. Which is the better price? (Use 1 kg ≈ 2.2 lb.)',
  c: 'Example 6(c): a bag of chips is labelled 12 oz. What is that in grams? (1 oz ≈ 28.35 g)',
  d: 'Example 6(d): a load of hay is 1.5 tons. What is that in tonnes? (1 ton ≈ 0.907 t)'
};
function suitcase(stage, ex) {
  const W = ex.W, svg = svgOn(stage, W, 380), DX = 210, DY = 188, R = 158, a0 = -135, a1 = 135;
  const angLb = (lb) => a0 + lb / 60 * (a1 - a0), rad = (a) => (a - 90) * Math.PI / 180;
  svgEl('rect', { x: DX - R - 18, y: DY - R - 18, width: 2 * R + 36, height: 2 * R + 30, rx: 40, fill: '#e9e6dd', stroke: '#9aa0ab', 'stroke-width': 3 }, svg);
  svgEl('circle', { cx: DX, cy: DY, r: R, fill: '#fff', stroke: '#1c2230', 'stroke-width': 3 }, svg);
  svgEl('circle', { cx: DX, cy: DY, r: R - 66, fill: '#eef3fb', stroke: '#1f5bd6', 'stroke-width': 2 }, svg);
  for (let lb = 0; lb <= 60; lb += 2) {
    const r = rad(angLb(lb)), big = lb % 10 === 0;
    svgEl('line', { x1: DX + Math.cos(r) * (R - (big ? 18 : 9)), y1: DY + Math.sin(r) * (R - (big ? 18 : 9)), x2: DX + Math.cos(r) * (R - 2), y2: DY + Math.sin(r) * (R - 2), stroke: '#1c2230', 'stroke-width': big ? 3 : 1.5 }, svg);
    if (big) svgEl('text', { x: DX + Math.cos(r) * (R - 36), y: DY + Math.sin(r) * (R - 36) + 6, 'text-anchor': 'middle', class: 'u4l7-dn' }, svg).textContent = lb;
  }
  for (let kg = 0; kg <= 27; kg += 1) {
    const r = rad(angLb(kg / 0.454)), big = kg % 5 === 0;
    svgEl('line', { x1: DX + Math.cos(r) * (R - 66), y1: DY + Math.sin(r) * (R - 66), x2: DX + Math.cos(r) * (R - 66 + (big ? 14 : 7)), y2: DY + Math.sin(r) * (R - 66 + (big ? 14 : 7)), stroke: '#1f5bd6', 'stroke-width': big ? 3 : 1.5 }, svg);
    if (big) svgEl('text', { x: DX + Math.cos(r) * (R - 84), y: DY + Math.sin(r) * (R - 84) + 6, 'text-anchor': 'middle', class: 'u4l7-dn b' }, svg).textContent = kg;
  }
  svgEl('text', { x: DX, y: DY - 30, 'text-anchor': 'middle', class: 'u4l7-dn' }, svg).textContent = 'lb';
  svgEl('text', { x: DX, y: DY + 52, 'text-anchor': 'middle', class: 'u4l7-dn b' }, svg).textContent = 'kg';
  const lim = svgEl('g', {}, svg); lim.style.opacity = 0;
  { const r = rad(angLb(23 / 0.454)); svgEl('line', { x1: DX + Math.cos(r) * (R - 104), y1: DY + Math.sin(r) * (R - 104), x2: DX + Math.cos(r) * (R - 52), y2: DY + Math.sin(r) * (R - 52), stroke: '#c93a33', 'stroke-width': 5, 'stroke-linecap': 'round' }, lim); }
  const limL = hide(tag(stage, '23 kg limit', DX + Math.cos(rad(angLb(23 / 0.454))) * (R - 128), DY + Math.sin(rad(angLb(23 / 0.454))) * (R - 128) + 4, 'red sm'));
  const nd = svgEl('g', {}, svg);
  svgEl('path', { d: `M${DX - 6} ${DY} L${DX} ${DY - R + 12} L${DX + 6} ${DY} Z`, fill: '#c93a33' }, nd);
  svgEl('circle', { cx: DX, cy: DY, r: 12, fill: '#1c2230' }, nd);
  nd.style.transformBox = 'view-box'; nd.style.transformOrigin = `${DX}px ${DY}px`; nd.style.transform = `rotate(${a0}deg)`;
  const RX = 440, RW = W - RX - 20;
  const l0 = hide(ln(stage, 'The scale reads <b>48 lb</b>. The limit is <b>23 kg</b>.', RX, 24, RW, 46, 'sm'));
  const l1 = hide(ln(stage, T('48\\times0.454\\approx21.8\\text{ kg}'), RX, 86, RW));
  const l2 = hide(ln(stage, 'Check: 21.8 is less than 48 ✓', RX, 146, RW, 46, 'sm'));
  const R2 = hide(cb(stage, 'u4l7-res', `${T('21.8<23')}: the suitcase is <b>under the limit</b>.`, RX, 214, RW, 60));
  const sp = hide(stamp(stage, 'Under the limit', { ok: true, x: RX + RW / 2, y: 324, rotate: -6 }));
  return [
    { cap: 'Jordan’s bathroom scale reads <b>48 lb</b>. The airline’s limit is in kilograms: <b>23 kg</b>.',
      run: async (c) => { await tween(c, 1300, (t) => { nd.style.transform = `rotate(${lerp(a0, angLb(48), t)}deg)`; }); await show(c, lim); await c.pop(limL); await c.fadeIn(l0); } },
    { cap: `Pounds to kilograms: ${T('48\\times0.454\\approx21.8')} kg. Read the inner (kg) ring.`, run: (c) => c.fadeIn(l1) },
    { cap: 'Check: the number of kilograms is <b>smaller</b> than the number of pounds ✓', run: (c) => c.fadeIn(l2) },
    { cap: `${T('21.8<23')}, so the suitcase is <b>under the limit</b>.`, run: async (c) => { await c.pop(R2); await stampIn(c, sp); } }
  ];
}
function beef(stage, ex) {
  const W = ex.W, X0 = 60, LBW = 300;
  const t1 = hide(el(stage, 'u4l7-ptag', '<small>Store 1</small><b>$5.99/lb</b><span class="cv"></span>', 40, 20, 260, 96));
  const t2 = hide(el(stage, 'u4l7-ptag', '<small>Store 2</small><b>$12.99/kg</b>', W - 300, 20, 260, 96));
  const kgl = hide(el(stage, 'u4l7-small l', '1 kg ≈ 2.2 lb', X0, 150, 300, 26));
  const segs = [0, 1, 2].map((i) => hide(el(stage, 'u4l7-lbseg' + (i === 2 ? ' fr' : ''), `<div>${i < 2 ? '1 lb' : '0.2'}</div><small>${i < 2 ? '$5.99' : '$1.20'}</small>`, X0 + i * (LBW + 6), 180, i < 2 ? LBW : LBW * 0.2, 72)));
  const tot = hide(ln(stage, T('5.99\\times2.2\\approx\\$13.18\\text{ per kg}'), X0, 276, 470));
  const cmp = hide(cb(stage, 'u4l7-res', `${T('\\$12.99<\\$13.18')}: Store 2 is the better price.`, W - 420, 300, 400, 64));
  const sp = hide(stamp(stage, 'Better price', { ok: true, x: W - 170, y: 140, rotate: -8 }));
  return [
    { cap: 'Two prices, two <b>different units</b>: per pound and per kilogram. Make the units match first.', run: async (c) => { await c.pop(t1); await c.pop(t2); } },
    { cap: 'A kilogram is about 2.2 pounds. So a kilogram at Store 1 costs the price of 2.2 pounds.', run: async (c) => { await c.fadeIn(kgl, 200); for (const s of segs) await c.pop(s, 320); } },
    { cap: `${T('5.99\\times2.2\\approx\\$13.18')} per kg at Store 1.`, run: async (c) => { await c.fadeIn(tot); t1.querySelector('.cv').innerHTML = '≈ $13.18/kg'; await pulse(c, t1, 1.06); } },
    { cap: `${T('\\$12.99')} per kg is less than ${T('\\$13.18')} per kg: the <b>second store</b> is the better price.`, run: async (c) => { await c.pop(cmp); await stampIn(c, sp); } }
  ];
}
function machine(stage, ex, d) {
  const W = ex.W, Y = 60;
  const pic = add(stage, svgEl('svg', { width: 150, height: 150, viewBox: '0 0 150 150', class: 'u4l7-svg' }), 30, Y);
  if (d.pic === 'chips') {
    svgEl('path', { d: 'M30 20 l10 8 l10 -8 l10 8 l10 -8 l10 8 l10 -8 l10 8 l10 -8 L116 140 H34 Z', fill: '#e8a01e', stroke: '#8a5a0e', 'stroke-width': 3, 'stroke-linejoin': 'round' }, pic);
    svgEl('ellipse', { cx: 75, cy: 80, rx: 30, ry: 22, fill: '#fff3c4' }, pic);
    svgEl('text', { x: 75, y: 88, 'text-anchor': 'middle', class: 'u4l7-dn' }, pic).textContent = '12 oz';
  } else {
    svgEl('rect', { x: 14, y: 50, width: 122, height: 80, rx: 14, fill: '#e3c766', stroke: '#8a6a14', 'stroke-width': 3 }, pic);
    for (let i = 0; i < 4; i++) svgEl('path', { d: `M22 ${64 + i * 16} q53 ${i % 2 ? 6 : -6} 106 0`, fill: 'none', stroke: '#b8962f', 'stroke-width': 2.5 }, pic);
    svgEl('rect', { x: 50, y: 50, width: 6, height: 80, fill: '#8a5a0e' }, pic); svgEl('rect', { x: 94, y: 50, width: 6, height: 80, fill: '#8a5a0e' }, pic);
  }
  hide(pic);
  const inp = hide(cb(stage, 'u4l7-mbox in', d.inp, 200, Y + 40, 160, 70));
  const mac = hide(cb(stage, 'u4l7-mach', `<small>machine</small><br><b>${d.op}</b>`, 400, Y + 20, 190, 110));
  const out = hide(cb(stage, 'u4l7-mbox out', d.out, 630, Y + 40, 180, 70));
  const work = hide(ln(stage, T(d.work), 200, Y + 160, 620));
  const chk = hide(cb(stage, 'u4l7-note', d.check, 120, Y + 220, W - 240, 56));
  return [
    { cap: d.c1, run: async (c) => { await c.fadeIn(pic); await c.pop(inp); await c.pop(mac); } },
    { cap: d.c2, run: async (c) => { await pulse(c, mac, 1.08); await c.pop(out); await c.fadeIn(work); } },
    { cap: d.c3, run: (c) => c.fadeIn(chk) }
  ];
}
const MACH = {
  c: { pic: 'chips', inp: '12 oz', op: '× 28.35', out: '340.2 g', work: '12\\times28.35=340.2\\text{ g}',
    c1: 'The bag says <b>12 oz</b>. 1 oz is about 28.35 g, so multiply by 28.35.', c2: `${T('12\\times28.35=340.2')} g.`,
    c3: `Estimate check: 1 oz is about 30 g, and ${T('12\\times30=360')} g. Close to 340.2 ✓`, check: `Estimate: 1 oz ≈ 30 g, so ${T('12\\times30=360')} g. Close ✓` },
  d: { pic: 'hay', inp: '1.5 tons', op: '× 0.907', out: '≈ 1.36 t', work: '1.5\\times0.907=1.3605\\approx1.36\\text{ t}',
    c1: 'The hay is <b>1.5 tons</b> (imperial). 1 ton is about 0.907 t (tonnes), so multiply by 0.907.', c2: `${T('1.5\\times0.907\\approx1.36')} t.`,
    c3: 'Check: a ton is a little <b>lighter</b> than a tonne, so the number of tonnes is a little smaller ✓', check: 'A ton (2000 lb) is a bit lighter than a tonne (1000 kg), so 1.36 t < 1.5 tons ✓' }
};
const scale2 = {
  title: 'Kilograms and pounds',
  height: 380,
  minW: 960,
  choices: [{ sep: 'Example 6 check:' }, { v: 'a', label: '(a) The suitcase' }, { v: 'b', label: '(b) Ground beef' }, { v: 'c', label: '(c) Chips' }, { v: 'd', label: '(d) Hay' }],
  ask: (k) => SC_ASK[k],
  make: (stage, k, ex) => (k === 'a' ? suitcase(stage, ex) : k === 'b' ? beef(stage, ex) : machine(stage, ex, MACH[k]))
};

/* =====================================================================================
 * 9. Example 7: the bushels ⇄ tonnes machine at the grain elevator
 * ===================================================================================== */
const GR_ASK = {
  a: 'Example 7(a): a farmer near Lethbridge harvests 8820 bushels of canola. For canola, use 44.1 bu/t. How many tonnes is that?',
  b: 'Example 7(b): the elevator pays $680.00 per tonne. How much are the 200 t of canola worth?',
  c: 'Example 7(c): what is the price per bushel, to the nearest cent? (44.1 bu/t, $680.00 per tonne)',
  d: 'Example 7(d): the farmer also has 92 t of barley. For barley, use 45.9 bu/t. How many bushels is that?'
};
function grainSteps(stage, k, ex) {
  const W = ex.W, MX = 30, MY = 12, MW = 560, RX = 620, RW = W - RX - 20;
  const bu = el(stage, 'u4l7-gbox bu', '<small>bushels</small><b></b>', MX, MY + 20, 170, 84);
  const tn = el(stage, 'u4l7-gbox t', '<small>tonnes</small><b></b>', MX + MW - 170, MY + 20, 170, 84);
  const top = el(stage, 'u4l7-garr', '<span class="lb">÷ factor</span>', MX + 190, MY + 18, MW - 380, 36);
  const bot = el(stage, 'u4l7-garr back', '<span class="lb">× factor</span>', MX + 190, MY + 70, MW - 380, 36);
  const barley = k === 'd';
  const chip = el(stage, 'u4l7-fchip' + (barley ? ' barley' : ''), `${barley ? 'Barley' : 'Canola'}: <b>${barley ? '45.9' : '44.1'} bu/t</b>`, MX + MW / 2 - 105, MY + 112, 210, 38);
  hide(chip);
  const B = (s) => { bu.querySelector('b').innerHTML = s; }, Tt = (s) => { tn.querySelector('b').innerHTML = s; };
  const sq = (n, cols, s = 19, g = 3, y0 = 170) => Array.from({ length: n }, (_, i) => hide(el(stage, 'u4l7-tsq' + (barley ? ' barley' : ''), '', MX + (i % cols) * (s + g), y0 + Math.floor(i / cols) * (s + g), s, s)));
  const L = (html, i, cls = '') => hide(ln(stage, html, RX, 20 + i * 62, RW, 50, cls));
  if (k === 'a') {
    B('8820'); Tt('?');
    const tiles = sq(200, 25);
    const leg = hide(el(stage, 'u4l7-small l', 'each square = 1 t = 44.1 bu', MX, 352, 400, 26));
    const l1 = L('bushels ÷ factor = tonnes', 0), l2 = L(T('8\\,820\\div44.1=200\\text{ t}'), 1);
    const sp = hide(stamp(stage, 'fewer tonnes ✓', { ok: true, x: RX + RW / 2, y: 200, rotate: -6 }));
    return [
      { cap: '8820 bushels of canola. The factor <b>44.1 bu/t</b> means 44.1 bushels make 1 tonne.', run: async (c) => { await c.pop(bu); await c.pop(chip); } },
      { cap: `Bushels to tonnes: <b>divide</b> by the factor. ${T('8\\,820\\div44.1=200')} t.`,
        run: async (c) => { top.classList.add('on'); await c.fadeIn(l1); await c.fadeIn(leg, 200); await tween(c, 1800, (t) => tiles.forEach((q, i) => { q.style.opacity = i < t * 200 ? 1 : 0; })); Tt('200'); await c.pop(tn); await c.fadeIn(l2); } },
      { cap: 'Check: 200 tonnes is a much <b>smaller</b> number than 8820 bushels ✓', run: (c) => stampIn(c, sp) }
    ];
  }
  if (k === 'b') {
    B('8820'); Tt('200'); top.classList.add('on');
    const one = hide(el(stage, 'u4l7-tsq bg', '1 t', MX, 180, 70, 70));
    const pr = hide(el(stage, 'u4l7-small l', '→ <b>$680.00</b> at the elevator', MX + 84, 200, 360, 30));
    const chq = hide(el(stage, 'u4l7-chq', '<small>Pay to the farmer</small><b>$0.00</b><i>200 t × $680.00</i>', MX, 266, MW, 100));
    const l1 = L(T('200\\times\\$680.00'), 0), l2 = L(T('=\\$136\\,000.00'), 1);
    return [
      { cap: 'From (a): 200 t of canola. The elevator pays <b>$680.00</b> for each tonne.', run: async (c) => { await c.pop(one); await c.fadeIn(pr); } },
      { cap: `${T('200\\times\\$680.00=\\$136\\,000.00')}. The crop is worth <b>$136 000.00</b>.`,
        run: async (c) => { await c.fadeIn(chq); await c.fadeIn(l1); const b = chq.querySelector('b'); await tween(c, 1600, (t) => { b.innerHTML = '$' + fmt(Math.round(136000 * t)) + '.00'; }); await c.fadeIn(l2); } }
    ];
  }
  if (k === 'c') {
    B('44.1'); Tt('1');
    const BX = MX, BW = MW, n = 44.1, sw = BW / n;
    const tb = hide(el(stage, 'u4l7-tbar', '<span class="lb">1 t of canola = $680.00</span>', BX, 176, BW, 70));
    const sl = svgOn(stage, W, 390); sl.style.opacity = 0;
    for (let i = 1; i <= 44; i++) svgEl('line', { x1: BX + i * sw, y1: 180, x2: BX + i * sw, y2: 242, stroke: '#fff', 'stroke-width': 1.5 }, sl);
    const one = hide(el(stage, 'u4l7-slice', '', BX, 176, sw, 70));
    const lab = hide(el(stage, 'u4l7-small l', '1 bushel ≈ <b>$15.42</b>', BX, 256, 300, 30));
    const l1 = L(T('\\$680.00\\div44.1'), 0), l2 = L(T('\\approx\\$15.42\\text{ per bushel}'), 1);
    return [
      { cap: 'One tonne of canola is worth <b>$680.00</b>, and one tonne is <b>44.1 bushels</b>.', run: async (c) => { await c.pop(chip); await c.fadeIn(tb); } },
      { cap: `Cut the tonne into 44.1 bushels: ${T('\\$680.00\\div44.1\\approx\\$15.42')} per bushel.`,
        run: async (c) => { await show(c, sl, 700); await c.pop(one); await c.fadeIn(lab); await c.fadeIn(l1); await c.fadeIn(l2); } }
    ];
  }
  B('?'); Tt('92');
  const tiles = sq(92, 23, 22, 3, 172);
  const leg = hide(el(stage, 'u4l7-small l', 'each square = 1 t = 45.9 bu', MX, 282, 400, 26));
  const cnt = hide(el(stage, 'u4l7-cnt l', '', MX, 316, 400, 40));
  const l1 = L('tonnes × factor = bushels', 0), l2 = L(T('92\\times45.9=4\\,222.8'), 1), l3 = L('about <b>4223 bushels</b>', 2);
  const sp = hide(stamp(stage, 'more bushels ✓', { ok: true, x: RX + RW / 2, y: 262, rotate: -6 }));
  return [
    { cap: '92 t of <b>barley</b>. Barley has its own factor: <b>45.9 bu/t</b>.', run: async (c) => { await c.pop(tn); await c.pop(chip); await tween(c, 900, (t) => tiles.forEach((q, i) => { q.style.opacity = i < t * 92 ? 1 : 0; })); await c.fadeIn(leg, 200); } },
    { cap: `Tonnes to bushels: <b>multiply</b> by the factor. ${T('92\\times45.9=4\\,222.8')}, about <b>4223 bushels</b>.`,
      run: async (c) => { bot.classList.add('on'); await c.fadeIn(l1); cnt.style.opacity = 1; await tween(c, 1500, (t) => { cnt.innerHTML = `${fmt(rnd(4222.8 * t, 1))} bu`; }); B('4223'); await c.pop(bu); await c.fadeIn(l2); await c.fadeIn(l3); } },
    { cap: 'Check: more bushels than tonnes ✓', run: (c) => stampIn(c, sp) }
  ];
}
const grain = {
  title: 'Bushels ⇄ tonnes',
  height: 390,
  minW: 960,
  choices: [{ sep: 'Example 7 check:' }, { v: 'a', label: '(a) Tonnes of canola' }, { v: 'b', label: '(b) The crop’s value' }, { v: 'c', label: '(c) Price per bushel' }, { v: 'd', label: '(d) Barley in bushels' }],
  ask: (k) => GR_ASK[k],
  make: (stage, k, ex) => grainSteps(stage, k, ex)
};

/* =====================================================================================
 * 10. Full notes: practice-test multiple choice, with the mistake behind every wrong choice
 * ===================================================================================== */
const MC = {
  q16: { ask: 'Practice test Q16: it is 20 °C outside. The quick estimate gives about…', opts: ['70 °F', '52 °F', '40 °F', '−7 °F'], ans: 0,
    work: '2\\times20+30=70', why: ['', 'only added 32', 'only doubled', 'used the °F-to-°C rule'], trap: 'The quick estimate: <b>double, then add 30</b>. (The exact answer is 68 °F.)' },
  q17: { ask: 'Practice test Q17: a can is 10 cm across and 12 cm tall. Its volume is about…', opts: ['942.5 cm³', '3769.9 cm³', '377.0 cm³', '300 cm³'], ans: 0,
    work: 'r=5:\\ \\pi\\times5^2\\times12\\approx942.5', why: ['', 'used 10 as the radius', 'used 10 and did not square', 'left out π'], trap: '“Across” is the diameter. Halve it <b>first</b>, then square the radius.' },
  q19: { ask: 'Practice test Q19: a landscaper orders 3 yd³ of topsoil. How many cubic feet is that?', opts: ['9 ft³', '27 ft³', '81 ft³', '36 ft³'], ans: 2,
    work: '3\\times27=81', why: ['used 3 ft in a yard (that is for length)', 'only 1 yd³', '', 'used 12'], trap: 'A cubic yard is <b>3 × 3 × 3 = 27</b> ft³, not 3.' },
  q22: { ask: 'Practice test Q22: grapes cost $2.99/lb. Using 1 kg ≈ 2.2 lb, their price per kilogram is about…', opts: ['$1.36', '$6.58', '$2.99', '$5.98'], ans: 1,
    work: '2.99\\times2.2\\approx\\$6.58', why: ['divided by 2.2', '', 'did not convert', 'used 2 lb in a kg'], trap: 'A kilogram is <b>more</b> than a pound, so a kilogram must cost <b>more</b>.' }
};
const traps = {
  title: 'Spot the trap',
  height: 330,
  minW: 960,
  choices: [{ sep: 'Practice test:' }, { v: 'q16', label: 'Q16 Estimate °F' }, { v: 'q17', label: 'Q17 A can' }, { v: 'q19', label: 'Q19 Topsoil' }, { v: 'q22', label: 'Q22 Grapes' }],
  ask: (k) => MC[k].ask,
  make(stage, k, ex) {
    const d = MC[k], W = ex.W, OW = (W - 50) / 2;
    const tiles = d.opts.map((o, i) => el(stage, 'u4l7-opt', `<b>${'ABCD'[i]}</b><span class="ot">${o}</span><span class="why"></span>`, 16 + (i % 2) * (OW + 18), 8 + Math.floor(i / 2) * 92, OW, 80));
    tiles.forEach((t, i) => { const w = t.querySelector('.why'); w.innerHTML = d.why[i]; hide(w); });
    const work = hide(cb(stage, 'u4l7-res', `Work it out: ${T(d.work)}`, (W - 640) / 2, 202, 640, 52));
    const tp = hide(cb(stage, 'u4l7-note', d.trap, 16, 266, W - 32, 52));
    const ok = tiles[d.ans];
    const st = hide(stamp(stage, '✓', { ok: true, x: 16 + (d.ans % 2) * (OW + 18) + OW - 34, y: 8 + Math.floor(d.ans / 2) * 92 + 40, rotate: -8 }));
    return [
      { cap: `Work it out <b>before</b> you look at the choices: ${T(d.work)}.`, run: (c) => c.pop(work) },
      { cap: `The answer is <b>${'ABCD'[d.ans]}</b>.`, run: async (c) => { ok.classList.add('ok'); await pulse(c, ok, 1.04); await stampIn(c, st); } },
      { cap: 'Every wrong choice is the answer to a <b>mistake</b>. Can you name each one?',
        run: async (c) => { for (const [i, t] of tiles.entries()) { if (i === d.ans) continue; t.classList.add('no'); await c.fadeIn(t.querySelector('.why'), 300); } } },
      { cap: d.trap, run: (c) => c.fadeIn(tp) }
    ];
  }
};

mountExplainers({ bed, barrel, pad, cubic, thermo, estLine, massUnits, scale2, grain, traps });

/* ============ Stand Up Break! — mixed review like the unit test, at the whiteboards ============ */
{
  const t1 = (v) => String(rnd(v, 1));
  const t2 = (v) => rnd(v, 2).toFixed(2);
  const NAMES = ['Ava', 'Noah', 'Kiran', 'Maya', 'Liam', 'Zara', 'Owen', 'Jasmine', 'Mateo', 'Leah'];
  standup('u4l7', {
    intro: 'Mixed review, like the unit test. Estimate first, then use your calculator. Show every step.',
    levels: {
      BEG: (r) => r.pick([
        () => { // SI capacity and mass
          const [a, f, tU, k] = r.pick([[r.int(12, 95) / 10, '\\text{ L}', '\\text{ mL}', 1000], [r.int(1200, 9800), '\\text{ g}', '\\text{ kg}', 0.001], [r.int(12, 48) / 10, '\\text{ m}^3', '\\text{ L}', 1000], [r.int(250, 2750), '\\text{ mL}', '\\text{ L}', 0.001]]);
          const ans = rnd(a * k, 4);
          return { text: 'Fill in the blank.', q: `${tx(a)}${f}=\\underline{\\qquad}${tU}`, a: [`${tx(a)}${k > 1 ? '\\times' : '\\div'}1\\,000=${tx(ans)}${tU}`] };
        },
        () => { // °C to °F
          const C = r.int(-25, 35), F = rnd(1.8 * C + 32, 1);
          return { text: `It is <b>${String(C).replace('-', '−')} °C</b> outside. What is that in °F?`, q: '', a: [`F=1.8\\times${C < 0 ? `(${C})` : C}+32`, `=${t1(1.8 * C)}+32=${t1(F)}\\ ^\\circ\\text{F}`] };
        },
        () => { // volume of a box in cm³ and mL
          const l = r.int(8, 30), w = r.int(5, 20), hh = r.int(4, 25), V = l * w * hh;
          return { text: `A box is <b>${l} cm × ${w} cm × ${hh} cm</b>. Find its volume and its capacity in mL.`, q: '', a: [`V=${l}\\times${w}\\times${hh}=${tx(V)}\\text{ cm}^3`, `1\\text{ cm}^3=1\\text{ mL, so }${tx(V)}\\text{ mL}`] };
        }
      ])(),
      PRG: (r) => r.pick([
        () => { // adding pounds and ounces with regrouping
          let a, b, c2, d; do { a = r.int(2, 9); b = r.int(5, 15); c2 = r.int(1, 8); d = r.int(5, 15); } while (b + d < 16);
          const oz = b + d, lb = a + c2;
          return { text: `Two parcels weigh <b>${a} lb ${b} oz</b> and <b>${c2} lb ${d} oz</b>. What is the total weight in pounds and ounces?`, q: '',
            a: [`${a}+${c2}=${lb}\\text{ lb},\\ ${b}+${d}=${oz}\\text{ oz}`, `${oz}\\text{ oz}=1\\text{ lb }${oz - 16}\\text{ oz}`, `\\text{Total: }${lb + 1}\\text{ lb }${oz - 16}\\text{ oz}`] };
        },
        () => { // lb to kg with a check
          const lb = r.int(18, 95), kg = lb * 0.454;
          return { text: `${r.pick(NAMES)}’s dog weighs <b>${lb} lb</b>. What is that in kilograms, to the nearest tenth? (1 lb ≈ 0.454 kg)`, q: '', a: [`${lb}\\times0.454=${rnd(kg, 3)}\\approx${t1(kg)}\\text{ kg}`, `\\text{Check: }${t1(kg)}<${lb}\\ \\checkmark`] };
        },
        () => { // °F to °C
          const F = r.pick([41, 50, 59, 68, 77, 86, 95, 104, 113, 122, 350, 400, 425, 450]) + r.pick([0, 0, 3, -2]), C = (F - 32) / 1.8;
          return { text: `Change <b>${F} °F</b> to °C. Round to the nearest tenth.`, q: '', a: [`C=(${F}-32)\\div1.8`, `=${F - 32}\\div1.8${Math.abs(C - rnd(C, 1)) < 1e-9 ? '=' : '\\approx'}${t1(C)}\\ ^\\circ\\text{C}`] };
        }
      ])(),
      MAS: (r) => r.pick([
        () => { // cylinder tank: litres, then US gallons
          const dd = r.pick([40, 50, 60, 70, 80]), hh = r.pick([60, 75, 90, 100, 120]), rr = dd / 2, V = Math.PI * rr * rr * hh, Lt = V / 1000;
          return { text: `A round water tank is <b>${dd} cm across</b> and <b>${hh} cm tall</b>. Find its capacity in litres, then in US gallons (1 US gal ≈ 3.785 L).`, q: '',
            a: [`r=${dd}\\div2=${rr}\\text{ cm}`, `V=\\pi\\times${rr}^2\\times${hh}\\approx${tx(Math.round(V))}\\text{ cm}^3`, `${tx(Math.round(V))}\\div1\\,000\\approx${t1(Lt)}\\text{ L}`, `${t1(Lt)}\\div3.785\\approx${t1(Lt / 3.785)}\\text{ US gal}`] };
        },
        () => { // bushels to tonnes, value
          const [crop, f] = r.pick([['canola', 44.1], ['wheat', 36.7], ['barley', 45.9]]), t = r.int(60, 240), bu = rnd(t * f, 1), p = r.pick([240, 280, 310, 350, 620, 680, 710]);
          return { text: `A farmer harvests <b>${fmt(bu)} bushels</b> of ${crop} (${f} bu/t). How many tonnes is that? The elevator pays <b>$${p}.00 per tonne</b>. What is the crop worth?`, q: '',
            a: [`${tx(bu)}\\div${f}=${t}\\text{ t}`, `${t}\\times\\$${p}.00=\\$${tx(t * p)}.00`] };
        },
        () => { // concrete pad in yd³, order in half yards
          const l = r.pick([8, 10, 12, 14, 16]), w = r.pick([8, 10, 12]), th = r.pick([4, 6]), V = l * w * th / 12, yd = V / 27, ord = Math.ceil(yd * 2 - 1e-9) / 2, pr = r.pick([195, 210, 225]);
          return { text: `A concrete pad is <b>${l} ft × ${w} ft</b> and <b>${th} in</b> thick. Find its volume in ft³ and yd³. Concrete is sold in half cubic yards at <b>$${pr}.00/yd³</b>. What should you order, and what does it cost?`, q: '',
            a: [`${th}\\text{ in}=${th}\\div12=${th === 4 ? '\\tfrac13' : '\\tfrac12'}\\text{ ft}`, `V=${l}\\times${w}\\times\\tfrac{${th}}{12}=${tx(rnd(V, 2))}\\text{ ft}^3`, `${tx(rnd(V, 2))}\\div27\\approx${t2(yd)}\\text{ yd}^3`, `\\text{Order }${ord}\\text{ yd}^3:\\ ${ord}\\times\\$${pr}.00=\\$${t2(ord * pr)}`] };
        }
      ])()
    }
  });
}
