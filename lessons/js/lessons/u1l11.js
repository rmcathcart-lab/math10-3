/* Math 10-3 · Unit 1 · Lesson 11 — Unit 1 Review (N1).
 * A review lesson: no practice break; the review assignment is a practice unit test, and (the review is the exception)
 * some of its questions appear as chips in the Full-notes explainers.
 * Explainers (Class view unless marked):
 *   share     (bars cut into GCF blocks for 36 : 48 and 90 cm : 1.5 m; the $250 snow money dealt out 6 : 4; Example 1),
 *   proportion(iced tea: cross-multiply, then batches of cups; the Calgary–Drumheller map with a ruler and a car; Ex. 2),
 *   fuelTrip  (the truck on a road of 100 km blocks: 9 L a block, then 970 km to Vancouver and the gas pump; Example 3),
 *   shelf     (coffee shelf with live unit-price tags and BEST BUY; reasons not about price; four small vs one big; Ex. 4),
 *   priceTag  (the price tag and its bar: markup, then GST/HST; markup %; discount then GST; percent decrease; Ex. 5, 6),
 *   stacked   (Store A's two discounts fall off one after the other vs Store B's $30; is it 35% off? Example 7),
 *   notAdded  (Full notes: the 100-square grid: the second discount is a percent of what is left; Ex. 7 and test Q20),
 *   bank      (the Calgary bank board and the exchange machine: buy at "We sell", sell back at "We buy"; Example 8),
 *   whichWay  (Full notes: multiply or divide? a flowchart from the rate; table example and practice-test questions),
 *   traps     (Full notes: practice-test multiple choice, with the mistake behind every wrong choice).
 * Then the Stand Up Break (mixed review). */
import { h, add, box, tex, svgEl, appear, pulse, tween, stamp, stampIn, mountExplainers, Flowchart, fmt } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const rnd = (v, d = 2) => Math.round((v + (v >= 0 ? 1e-9 : -1e-9)) * 10 ** d) / 10 ** d;
const M = (v, d = 2) => '$' + rnd(v, d).toFixed(d);          // money text
const lerp = (a, b, t) => a + (b - a) * t;
/** an absolutely placed box on the stage */
const el = (stage, cls, html, x, y, w, hh) => add(stage, box(h('div', cls, /u1l11-(line|tot)\b/.test(cls) ? `<div>${html}</div>` : html), w, hh), x, y);
/** a box whose mixed text and maths stay together on centred lines */
const cb = (stage, cls, html, x, y, w, hh) => el(stage, cls + ' u1l11-c', `<div>${html}</div>`, x, y, w, hh);
const countTo = (c, e, a, b, ms, f) => tween(c, ms, (t) => { e.innerHTML = f(lerp(a, b, t)); });
const grow = (c, e, ms = 600, o = {}) => c.anim(e, [{ opacity: 1, transform: 'scaleX(0)' }, { opacity: 1, transform: 'scaleX(1)' }], ms, o);
const fall = (c, e, ms = 650) => c.anim(e, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(60px) rotate(7deg)' }], ms, { easing: 'cubic-bezier(.5,0,.8,.4)' });
const fadeOut = (c, e, ms = 250) => c.anim(e, [{ opacity: 1 }, { opacity: 0 }], ms);
const moveTo = (c, e, x, y, ms = 650) => { const x0 = parseFloat(e.style.left), y0 = parseFloat(e.style.top); return tween(c, ms, (t) => { e.style.left = lerp(x0, x, t) + 'px'; e.style.top = lerp(y0, y, t) + 'px'; }); };
const sizeTo = (c, e, w, ms = 600) => { const w0 = parseFloat(e.style.width); return tween(c, ms, (t) => { e.style.width = lerp(w0, w, t) + 'px'; }); };

/* ---------- a hand-built fraction (each number in its own cell, so arrows can point at it) ---------- */
const frac = (stage, top, bot, x, y, w = 90, hh = 110, cls = '') => el(stage, 'u1l11-fr ' + cls, `<div>${top}</div><i></i><div>${bot}</div>`, x, y, w, hh);

/* =====================================================================================
 * 1. Example 1: ratios in simplest form (bars cut into GCF blocks) and the snow money
 * ===================================================================================== */
const SH1 = {
  r1: { ask: 'Example 1(a)(i): write 36 : 48 in simplest form.', a: 36, b: 48, la: '36', lb: '48', g: 12 },
  r2: { ask: 'Example 1(a)(ii): write 90 cm : 1.5 m in simplest form.', a: 90, b: 150, la: '90 cm', lb: '1.5 m', g: 30, conv: true },
  snow: { ask: 'Example 1(b): Priya and Jordan shovelled snow for $250. Priya worked 6 h and Jordan worked 4 h, so they split the money in the ratio 6 : 4. How much does each person get?' }
};
function ratioSteps(stage, d, ex) {
  const W = ex.W, X0 = 170, BW = W - X0 - 40, s = BW / d.b, BH = 72, YA = 26, YB = 136;
  const na = d.a / d.g, nb = d.b / d.g;
  const la = el(stage, 'u1l11-rowlab', d.la, 20, YA, 140, BH);
  const lb = el(stage, 'u1l11-rowlab', d.lb, 20, YB, 140, BH);
  const A = hide(el(stage, 'u1l11-rbar a', '', X0, YA, d.a * s, BH));
  const B = hide(el(stage, 'u1l11-rbar b', '', X0, YB, d.conv ? 1.5 * s : d.b * s, BH));
  const mk = (n, y) => Array.from({ length: n }, (_, i) => {
    const b = hide(el(stage, 'u1l11-blk', `<span>${i + 1}</span>`, X0 + i * d.g * s, y, d.g * s, BH));
    hide(b.firstChild); return b;
  });
  const blA = mk(na, YA), blB = mk(nb, YB);
  const gcf = hide(cb(stage, 'u1l11-gcf', `Divide both by <b>${d.g}</b>: the biggest number that goes into ${d.a} and ${d.b} (the GCF)`, X0, YB + BH + 18, BW, 46));
  const unit = d.conv ? hide(cb(stage, 'u1l11-unit', `${T('1.5\\text{ m}=1.5\\times100=150\\text{ cm}')}`, X0, YB + BH + 18, BW, 46)) : null;
  const res = hide(cb(stage, 'u1l11-res', T(d.conv ? `90:150=${na}:${nb}` : `${d.a}:${d.b}=${na}:${nb}`), (W - 420) / 2, 306, 420, 56));
  const steps = [];
  if (d.conv) {
    steps.push({ cap: 'Draw 90 cm and 1.5 m as bars. The 1.5 m bar looks tiny! The units are <b>different</b>.',
      run: async (c) => { await grow(c, A); await grow(c, B, 300); await c.shake(B); } });
    steps.push({ cap: `Change to the same unit first: ${T('1.5\\text{ m}=150\\text{ cm}')}.`,
      run: async (c) => { lb.innerHTML = '1.5 m<small>= 150 cm</small>'; await c.pop(unit); await sizeTo(c, B, d.b * s, 800); await fadeOut(c, unit, 300); } });
  } else {
    steps.push({ cap: `Draw ${d.a} and ${d.b} as bars. They have no units, so they are already the same kind of number.`,
      run: async (c) => { await grow(c, A); await grow(c, B); } });
  }
  steps.push({ cap: `Find the biggest number that divides <b>both</b> ${d.a} and ${d.b}: <b>${d.g}</b>.`, run: (c) => c.pop(gcf) });
  steps.push({ cap: `Cut both bars into blocks of ${d.g}${d.conv ? ' cm' : ''}.`,
    run: async (c) => { for (const b of blA) await c.pop(b, 260); for (const b of blB) await c.pop(b, 260); } });
  steps.push({ cap: `Count the blocks: ${d.la} is <b>${na}</b> blocks and ${d.conv ? '150 cm' : d.lb} is <b>${nb}</b> blocks.`,
    run: async (c) => { for (const b of blA.concat(blB)) await c.pop(b.firstChild, 220); } });
  steps.push({ cap: `So ${T(d.conv ? `90\\text{ cm}:1.5\\text{ m}=${na}:${nb}` : `${d.a}:${d.b}=${na}:${nb}`)}. (Divide both terms by ${d.g}.)`, run: (c) => c.pop(res) });
  void la;
  return steps;
}
function snowSteps(stage, ex) {
  const W = ex.W, L = 40, BW = W - 80, n = 10, sw = BW / n, gp = 10, Y = 22, BH = 56, RX = 190, PY = 150, JY = 236;
  const segs = Array.from({ length: n }, (_, i) => {
    const s = el(stage, 'u1l11-mseg' + (i === 0 ? ' l' : '') + (i === n - 1 ? ' r' : ''), '<span>$25</span>', L + i * sw, Y, sw, BH);
    hide(s.firstChild); return s;
  });
  const whole = el(stage, 'u1l11-mtot', '$250', L, Y, BW, BH);
  const pl = hide(el(stage, 'u1l11-rowlab', 'Priya<small>worked 6 h</small>', 30, PY, 150, BH));
  const jl = hide(el(stage, 'u1l11-rowlab', 'Jordan<small>worked 4 h</small>', 30, JY, 150, BH));
  const pt = hide(el(stage, 'u1l11-tot', T('6\\times\\$25=\\$150'), RX + 6 * sw + 6, PY, 230, BH));
  const jt = hide(el(stage, 'u1l11-tot', T('4\\times\\$25=\\$100'), RX + 4 * sw + 6, JY, 230, BH));
  const chk = hide(cb(stage, 'u1l11-res', `Check: ${T('\\$150+\\$100=\\$250')} ✓`, (W - 420) / 2, 318, 420, 50));
  return [
    { cap: `Add the parts: ${T('6+4=10')} parts. Cut the $250 into <b>10 equal parts</b>.`,
      run: async (c) => {
        await fadeOut(c, whole);
        await tween(c, 700, (t) => segs.forEach((s, i) => { s.style.left = lerp(L + i * sw, L + i * sw + gp / 2, t) + 'px'; s.style.width = lerp(sw, sw - gp, t) + 'px'; if (t > 0.05) s.classList.add('apart'); }));
      } },
    { cap: `One part: ${T('\\$250\\div10=\\$25')}.`, run: (c) => Promise.all(segs.map((s, i) => c.pop(s.firstChild, 300, { delay: i * 50 }))) },
    { cap: 'Priya worked 6 h, so she gets <b>6 parts</b>.',
      run: async (c) => { await c.fadeIn(pl); await Promise.all(segs.slice(0, 6).map((s, i) => { s.classList.add('p'); return moveTo(c, s, RX + i * sw + gp / 2, PY, 700); })); } },
    { cap: 'Jordan worked 4 h, so he gets <b>4 parts</b>.',
      run: async (c) => { await c.fadeIn(jl); await Promise.all(segs.slice(6).map((s, i) => { s.classList.add('j'); return moveTo(c, s, RX + i * sw + gp / 2, JY, 700); })); } },
    { cap: `Priya: ${T('6\\times\\$25=\\$150')}. Jordan: ${T('4\\times\\$25=\\$100')}.`, run: async (c) => { await c.pop(pt); await c.pop(jt); } },
    { cap: `Check: ${T('\\$150+\\$100=\\$250')} ✓ Priya gets <b>$150</b> and Jordan gets <b>$100</b>.`, run: (c) => c.pop(chk) }
  ];
}
const share = {
  title: 'Same units, equal blocks, equal parts',
  height: 380,
  minW: 960,
  choices: [{ sep: 'Example 1 check:' }, { v: 'r1', label: '(a)(i) 36 : 48' }, { v: 'r2', label: '(a)(ii) 90 cm : 1.5 m' }, { v: 'snow', label: '(b) The snow money' }],
  ask: (k) => SH1[k].ask,
  make: (stage, k, ex) => (k === 'snow' ? snowSteps(stage, ex) : ratioSteps(stage, SH1[k], ex))
};

/* =====================================================================================
 * 2. Example 2: iced tea (cross-multiply, then batches of cups) and the map scale
 * ===================================================================================== */
/** two lines that cross between the cells of two fractions; returns the two paths */
function crossLines(stage, a, b) {
  const sv = add(stage, svgEl('svg', { width: 1, height: 1, class: 'u1l11-svg' }), 0, 0); sv.style.overflow = 'visible';
  const mk = (p, q) => {
    const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy), k = 26 / L;
    const x1 = p[0] + dx * k, y1 = p[1] + dy * k, x2 = q[0] - dx * k, y2 = q[1] - dy * k, len = Math.hypot(x2 - x1, y2 - y1);
    const e = svgEl('line', { x1, y1, x2, y2, stroke: '#c27a0e', 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-dasharray': len, 'stroke-dashoffset': len, opacity: 0 }, sv); e.len = len; return e;
  };
  return [mk(a.top, b.bot), mk(a.bot, b.top)];
}
const cellsOf = (x, y, w = 90, hh = 110) => ({ top: [x + w / 2, y + hh * 0.24], bot: [x + w / 2, y + hh * 0.76] });
const drawLine = (c, e, ms = 500) => c.anim(e, [{ opacity: 1, strokeDashoffset: e.len }, { opacity: 1, strokeDashoffset: 0 }], ms);

function teaSteps(stage, ex) {
  const W = ex.W, FY = 18;
  const lf = hide(frac(stage, 'concentrate', 'water', 14, FY, 150, 110, 'sm'));
  lf.querySelectorAll('div').forEach((d) => { d.style.font = '700 19px var(--round)'; });
  const colon = hide(el(stage, 'u1l11-eq', ':', 166, FY, 24, 110));
  const f1 = hide(frac(stage, '3', '8', 196, FY)), eq = hide(el(stage, 'u1l11-eq', '=', 290, FY, 40, 110)), f2 = hide(frac(stage, '<span class="x">x</span>', '20', 334, FY));
  const [l1, l2] = crossLines(stage, cellsOf(196, FY), cellsOf(334, FY));
  const L1 = hide(el(stage, 'u1l11-line', T('8x=3\\times20=60'), 24, 150, 420, 46));
  const L2 = hide(el(stage, 'u1l11-line', T('x=60\\div8=7.5'), 24, 202, 420, 46));
  const res = hide(cb(stage, 'u1l11-res', 'Use <b>7.5 cups</b> of concentrate.', 24, 268, 400, 52));
  // batches of cups: concentrate (brown) then water (blue)
  const X0 = W - 500, CW = 22, CH = 34, G = 26;
  const rows = [{ t: 3, w: 8, lab: 'batch 1' }, { t: 3, w: 8, lab: 'batch 2' }, { t: 1.5, w: 4, lab: 'half batch', half: true }].map((r, i) => {
    const y = 14 + i * 84, nT = Math.ceil(r.t), wdt = (nT + r.w) * G + 18 + 16;
    const g = hide(el(stage, 'u1l11-grp' + (r.half ? ' half' : ''), '', X0 - 8, y - 6, wdt, CH + 34));
    for (let j = 0; j < nT; j++) el(g, 'u1l11-cup t' + (r.half && j === nT - 1 ? ' half' : ''), '', 8 + j * G, 8, CW, CH).style.position = 'absolute';
    for (let j = 0; j < r.w; j++) el(g, 'u1l11-cup w', '', 8 + nT * G + 18 + j * G, 8, CW, CH).style.position = 'absolute';
    el(g, 'u1l11-glab', `${r.t} + ${r.w}`, 0, CH + 10, wdt, 20).style.position = 'absolute';
    const lab = hide(el(stage, 'u1l11-glab' + (r.half ? ' r' : ''), r.lab, X0 + wdt, y + 12, 110, 24));
    return { g, lab };
  });
  const t1 = hide(cb(stage, 'u1l11-note', `Water: ${T('8+8+4=20')} cups<br>Concentrate: ${T('3+3+1.5=\\mathbf{7.5}')} cups ✓`, X0 - 8, 268, 420, 76));
  return [
    { cap: `Words first: <b>concentrate over water</b> on both sides. ${T('\\dfrac{3}{8}=\\dfrac{x}{20}')}`,
      run: async (c) => { await c.fadeIn(lf); await c.fadeIn(colon, 200); await c.fadeIn(f1); await c.fadeIn(eq, 200); await c.fadeIn(f2); } },
    { cap: `Cross-multiply: ${T('8\\times x=3\\times20')}, so ${T('8x=60')}.`, run: async (c) => { await drawLine(c, l1); await drawLine(c, l2); await c.fadeIn(L1); } },
    { cap: `Divide by 8: ${T('x=60\\div8=7.5')}. Use <b>7.5 cups</b> of concentrate.`, run: async (c) => { await c.fadeIn(L2); await c.pop(res); } },
    { cap: 'Check with cups. One batch is <b>3</b> cups of concentrate and <b>8</b> cups of water.', run: async (c) => { await c.pop(rows[0].g); await c.fadeIn(rows[0].lab); } },
    { cap: `20 cups of water is ${T('8+8+4')}: two batches and a <b>half</b> batch (half of 3 is 1.5).`,
      run: async (c) => { await c.pop(rows[1].g); await c.fadeIn(rows[1].lab); await c.pop(rows[2].g); await c.fadeIn(rows[2].lab); } },
    { cap: `Concentrate: ${T('3+3+1.5=7.5')} cups. The same answer ✓`, run: (c) => c.pop(t1) }
  ];
}
function mapSteps(stage, ex) {
  const W = ex.W, MX = 16, MY = 8, MW = 560, MH = 240, PX = 40, CX = MX + 50, DX = CX + 11.5 * PX, RY = MY + 170;
  el(stage, 'u1l11-map', '', MX, MY, MW, MH);
  const sv = add(stage, svgEl('svg', { width: MW, height: MH, class: 'u1l11-svg' }), MX, MY);
  svgEl('path', { d: `M${CX - MX} ${120} C ${CX - MX + 110} 70, ${CX - MX + 190} 150, ${CX - MX + 280} 104 S ${DX - MX - 70} 92, ${DX - MX} 120`, fill: 'none', stroke: '#c9b697', 'stroke-width': 7, 'stroke-linecap': 'round' }, sv);
  svgEl('path', { d: 'M40 56 C 140 42, 220 74, 330 52 S 470 60, 540 46', fill: 'none', stroke: '#8fb5d9', 'stroke-width': 5 }, sv); // a river
  svgEl('line', { x1: CX - MX, y1: 120, x2: DX - MX, y2: 120, stroke: '#6e4a1c', 'stroke-width': 2.5, 'stroke-dasharray': '7 6' }, sv);
  [CX, DX].forEach((x) => svgEl('circle', { cx: x - MX, cy: 120, r: 9, fill: '#c93a33', stroke: '#fff', 'stroke-width': 3 }, sv));
  el(stage, 'u1l11-city', 'Calgary', CX - 60, MY + 132, 120, 24);
  el(stage, 'u1l11-city', 'Drumheller', DX - 90, MY + 62, 140, 24);
  el(stage, 'u1l11-scale', 'Scale 1 cm : 12 km', MX + MW - 200, MY + 10, 186, 28);
  // the ruler
  const ruler = add(stage, svgEl('svg', { width: MW, height: 50, class: 'u1l11-svg' }), MX, RY);
  svgEl('rect', { x: CX - MX - 14, y: 4, width: 12.2 * PX, height: 40, rx: 4, fill: '#fff8dc', stroke: '#9a6a24', 'stroke-width': 2 }, ruler);
  for (let i = 0; i <= 12; i++) {
    const x = CX - MX + i * PX; if (i > 11.5) break;
    svgEl('line', { x1: x, y1: 4, x2: x, y2: i % 5 === 0 ? 22 : 16, stroke: '#4a3010', 'stroke-width': 2 }, ruler);
    const t = svgEl('text', { x, y: 38, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 700, fill: '#4a3010' }, ruler); t.textContent = i;
  }
  svgEl('line', { x1: DX - MX, y1: 4, x2: DX - MX, y2: 26, stroke: '#c93a33', 'stroke-width': 3 }, ruler);
  const meas = hide(el(stage, 'u1l11-seg off', '', CX, RY - 4, 11.5 * PX, 8)); meas.style.borderWidth = '0'; meas.style.background = '#c93a33';
  const mlab = hide(el(stage, 'u1l11-blab r', '11.5 cm', DX - 50, RY - 32, 100, 24));
  // the car and the odometer
  const car = hide(add(stage, svgEl('svg', { width: 54, height: 30, viewBox: '0 0 54 30', class: 'u1l11-svg' }), CX - 27, MY + 92));
  car.innerHTML = '<path d="M4 20 V14 Q6 9 14 8 L20 2 H36 L44 9 Q50 10 50 15 V20 Z" fill="#1f5bd6" stroke="#173f8f" stroke-width="2"/><rect x="22" y="4" width="12" height="6" fill="#dbe9f7"/><circle cx="14" cy="22" r="5" fill="#1c2230"/><circle cx="40" cy="22" r="5" fill="#1c2230"/>';
  const odo = hide(el(stage, 'u1l11-odo', '<small>REAL DISTANCE</small><span>0 km</span>', MX, MY + MH + 18, 300, 54));
  // the proportion (right)
  const RX = W - 372, FY = 30;
  const lf = hide(frac(stage, 'map (cm)', 'real (km)', RX, FY, 104, 110));
  lf.querySelectorAll('div').forEach((d) => { d.style.font = '700 17px var(--round)'; });
  const f1 = hide(frac(stage, '1', '12', RX + 122, FY, 80)), eq = hide(el(stage, 'u1l11-eq', '=', RX + 204, FY, 40, 110)), f2 = hide(frac(stage, '11.5', '<span class="x">x</span>', RX + 246, FY, 104));
  const aT = hide(el(stage, 'u1l11-arrow', '× 11.5 ⟶', RX + 140, FY - 28, 200, 24)), aB = hide(el(stage, 'u1l11-arrow', '× 11.5 ⟶', RX + 140, FY + 114, 200, 24));
  const L1 = hide(el(stage, 'u1l11-line', T('x=12\\times11.5=138'), RX + 10, FY + 160, 360, 46));
  const res = hide(cb(stage, 'u1l11-res', 'About <b>138 km</b> apart', RX + 10, FY + 222, 340, 52));
  const ospan = odo.querySelector('span');
  return [
    { cap: 'On the map, Calgary and Drumheller are <b>11.5 cm</b> apart. The scale is <b>1 cm : 12 km</b>.',
      run: async (c) => { await grow(c, meas, 900); await c.pop(mlab); } },
    { cap: `Set up <b>map over real</b>, with matching units in matching places: ${T('\\dfrac{1}{12}=\\dfrac{11.5}{x}')}.`,
      run: async (c) => { await c.fadeIn(lf); await c.fadeIn(f1); await c.fadeIn(eq, 200); await c.fadeIn(f2); } },
    { cap: 'The top goes from 1 to 11.5: <b>× 11.5</b>. Do the same to the bottom.', run: async (c) => { await c.pop(aT); await c.pop(aB); } },
    { cap: `${T('x=12\\times11.5=138')}. Drive it: every map centimetre is 12 real kilometres.`,
      run: async (c) => {
        await c.fadeIn(L1); await appear(c, odo); await appear(c, car, 200);
        await tween(c, 1800, (t) => { car.style.left = (CX - 27 + t * 11.5 * PX) + 'px'; ospan.textContent = Math.round(138 * t) + ' km'; });
      } },
    { cap: 'They are about <b>138 km</b> apart (in a straight line; the road is a bit longer).', run: (c) => c.pop(res) }
  ];
}
const proportion = {
  title: 'Proportions: words first, then cross-multiply or scale',
  height: 380,
  minW: 960,
  choices: [{ sep: 'Example 2 check:' }, { v: 'tea', label: '(a) Iced tea' }, { v: 'map', label: '(b) The road map' }],
  ask: (k) => (k === 'tea' ? 'Example 2(a): iced tea uses 3 cups of tea concentrate for every 8 cups of water. How much concentrate goes with 20 cups of water?'
    : 'Example 2(b): a road map has a scale of 1 cm : 12 km. Calgary and Drumheller are 11.5 cm apart on the map. About how far apart are they really?'),
  make: (stage, k, ex) => (k === 'tea' ? teaSteps(stage, ex) : mapSteps(stage, ex))
};

/* =====================================================================================
 * 3. Example 3: the truck on a road of 100 km blocks, then the gas pump
 * ===================================================================================== */
const TRUCK = '<rect x="2" y="8" width="66" height="36" rx="4" fill="#9a6a24" stroke="#4a3010" stroke-width="2.5"/><path d="M68 18 H88 L100 32 V44 H68 Z" fill="#c27a0e" stroke="#4a3010" stroke-width="2.5" stroke-linejoin="round"/><rect x="74" y="22" width="14" height="10" rx="2" fill="#dbe9f7"/><circle cx="20" cy="47" r="8" fill="#1c2230"/><circle cx="84" cy="47" r="8" fill="#1c2230"/><circle cx="20" cy="47" r="3" fill="#ccc"/><circle cx="84" cy="47" r="3" fill="#ccc"/>';
function road(stage, ex, km, y) {
  const X0 = 112, P = (ex.W - 150) / 10, n = Math.ceil(km / 100), blocks = [];
  for (let i = 0; i < n; i++) {
    const part = Math.min(100, km - i * 100) / 100;
    blocks.push(hide(el(stage, 'u1l11-road' + (part < 1 ? ' part' : ''), `${Math.round(part * 100)} km`, X0 + i * P, y, P * part, 34)));
  }
  const tr = add(stage, svgEl('svg', { width: 104, height: 56, viewBox: '0 0 104 56', class: 'u1l11-svg' }), X0 - 104, y - 58); tr.innerHTML = TRUCK;
  return { X0, P, blocks, tr };
}
const fuelTrip = {
  title: 'Fuel economy: litres for every 100 km',
  height: 400,
  minW: 960,
  choices: [{ sep: 'Example 3 check:' }, { v: 'a', label: '(a) L/100 km' }, { v: 'b', label: '(b) Calgary to Vancouver' }],
  ask: (k) => (k === 'a' ? 'Example 3(a): Mateo’s truck used 54 L of gas to drive 600 km. What is its fuel economy in L/100 km?'
    : 'Example 3(b): the truck uses 9 L/100 km. Mateo drives 970 km from Calgary to Vancouver. Gas costs $1.42/L. Estimate the cost of gas, then calculate it.'),
  make(stage, k, ex) {
    const W = ex.W, RY = 150;
    if (k === 'a') {
      const R = road(stage, ex, 600, RY);
      const pump = el(stage, 'u1l11-pump', '<div><small>DISTANCE</small><b class="d">0 km</b></div><div><small>GAS USED</small><b class="g">0.0 L</b></div>', W - 300, 6, 280, 78);
      const dd = pump.querySelector('.d'), gg = pump.querySelector('.g');
      const cans = R.blocks.map((b, i) => hide(el(stage, 'u1l11-can', '9 L', R.X0 + i * R.P + 10, RY + 46, R.P - 20, 42)));
      const L1 = hide(el(stage, 'u1l11-line', T('54\\div600\\times100=9'), 40, 270, 480, 46));
      const res = hide(cb(stage, 'u1l11-res', 'The truck uses <b>9 L/100 km</b>.', 40, 326, 460, 52));
      return [
        { cap: 'The truck drives <b>600 km</b> and uses <b>54 L</b> of gas.',
          run: async (c) => { await tween(c, 1800, (t) => { R.tr.style.left = (R.X0 - 104 + t * 6 * R.P) + 'px'; dd.textContent = Math.round(600 * t) + ' km'; gg.textContent = (54 * t).toFixed(1) + ' L'; }); } },
        { cap: 'L/100 km asks: how much gas for <b>each 100 km</b>? 600 km is <b>6 hundreds</b>.', run: async (c) => { for (const b of R.blocks) await c.pop(b, 220); } },
        { cap: `Share the 54 L over the 6 hundreds: ${T('54\\div600\\times100=9')}.`, run: async (c) => { await c.fadeIn(L1); for (const e of cans) await c.pop(e, 220); } },
        { cap: 'Each 100 km uses <b>9 L</b>. The truck uses <b>9 L/100 km</b>.', run: (c) => c.pop(res) }
      ];
    }
    const R = road(stage, ex, 970, RY);
    const kmc = el(stage, 'u1l11-odo', '<small>DISTANCE</small><span>0 km</span>', W - 300, 6, 280, 54), ks = kmc.querySelector('span');
    const cans = R.blocks.map((b, i) => { const part = i === 9 ? 0.7 : 1; return hide(el(stage, 'u1l11-can', part < 1 ? '6.3 L' : '9 L', R.X0 + i * R.P + 4, RY + 46, R.P * part - 8, 42)); });
    cans[9].style.fontSize = '14px';
    const L1 = hide(el(stage, 'u1l11-line', `${T('970\\text{ km}=9.7')} hundreds of km`, 40, 250, 520, 40));
    const L2 = hide(el(stage, 'u1l11-line', `Gas: ${T('9.7\\times9=87.3\\text{ L}')}`, 40, 294, 520, 40));
    const est = hide(cb(stage, 'u1l11-est', `Estimate: ${T('90\\text{ L}\\times\\$1.40\\approx\\$126')}`, 40, 342, 360, 44));
    const pump = hide(el(stage, 'u1l11-pump', '<div><small>LITRES</small><b class="l">0.000</b></div><div><small>PRICE / L</small><b>1.420</b></div><div><small>TOTAL</small><b class="big t">$0.00</b></div>', W - 280, 250, 260, 132));
    const pl = pump.querySelector('.l'), pt = pump.querySelector('.t');
    const st = hide(stamp(stage, 'Close to $126 ✓', { ok: true, x: W - 430, y: 362, rotate: -6 }));
    return [
      { cap: 'Calgary to Vancouver is <b>970 km</b>: that is <b>9.7 hundreds</b> of km.',
        run: async (c) => { await tween(c, 2000, (t) => { R.tr.style.left = (R.X0 - 104 + t * 9.7 * R.P) + 'px'; ks.textContent = Math.round(970 * t) + ' km'; }); for (const b of R.blocks) await c.pop(b, 150); await c.fadeIn(L1); } },
      { cap: `The truck uses 9 L for every 100 km: ${T('9.7\\times9=87.3')} L.`, run: async (c) => { for (const e of cans) await c.pop(e, 160); await c.fadeIn(L2); } },
      { cap: `Estimate first: about 90 L at about $1.40 a litre: ${T('90\\times\\$1.40\\approx\\$126')}.`, run: (c) => c.pop(est) },
      { cap: `Exact: ${T('87.3\\times1.42=123.966')}, so about <b>$123.97</b>.`,
        run: async (c) => { await c.fadeIn(pump); await tween(c, 1600, (t) => { pl.textContent = (87.3 * t).toFixed(3); pt.textContent = M(123.966 * t); }); } },
      { cap: '$123.97 is close to the $126 estimate ✓ Gas for the trip costs about <b>$123.97</b>.', run: (c) => stampIn(c, st) }
    ];
  }
};

/* =====================================================================================
 * 4. Example 4: the coffee shelf
 * ===================================================================================== */
const BAG = '<path d="M14 26 L86 26 L92 140 H8 Z" fill="#7a4a24" stroke="#3e220c" stroke-width="3" stroke-linejoin="round"/><path d="M14 26 L22 6 H78 L86 26 Z" fill="#9a6a3c" stroke="#3e220c" stroke-width="3" stroke-linejoin="round"/><rect x="22" y="58" width="56" height="50" rx="6" fill="#f6e7c8"/><ellipse cx="50" cy="83" rx="13" ry="17" fill="#6b3a16"/><path d="M50 68 Q44 83 50 98" stroke="#f6e7c8" stroke-width="3" fill="none"/>';
const bagSvg = (hh) => { const s = svgEl('svg', { viewBox: '0 0 100 140', width: hh * 100 / 140, height: hh, class: 'u1l11-svg' }); s.innerHTML = BAG; return s; };
const bagAt = (stage, hh, cx, bottom) => add(stage, bagSvg(hh), cx - hh * 50 / 140, bottom - hh);
const COF = [{ g: 340, p: 8.99, lab: '340 g' }, { g: 925, p: 19.49, lab: '925 g' }, { g: 1360, p: 27.99, lab: '1.36 kg', conv: `1${' '}360 g` }];
const shelf = {
  title: 'Coffee: the best buy, and other reasons',
  height: 410,
  minW: 960,
  choices: [{ sep: 'Example 4 check:' }, { v: 'a', label: '(a) Best buy' }, { v: 'b', label: '(b) Not about price' }, { v: 'c', label: '(c) Four small or one big?' }],
  ask: (k) => ({ a: 'Example 4(a): ground coffee costs $8.99 for 340 g, $19.49 for 925 g and $27.99 for 1.36 kg. Complete the unit prices. Which size is the best buy?',
    b: 'Example 4(b): give one reason that is not about price for buying the 340 g bag.',
    c: 'Example 4(c): four 340 g bags hold 1.36 kg. How much do you save by buying one 1.36 kg bag instead of four 340 g bags?' })[k],
  make(stage, k, ex) {
    const W = ex.W;
    if (k === 'a') {
      const n = 3, SW = Math.min(310, (W - 40) / n), X0 = (W - SW * n) / 2, SY = 222;
      svgEl('rect', { x: 10, y: SY, width: W - 20, height: 16, rx: 4, fill: '#b07a3c' }, add(stage, svgEl('svg', { width: W, height: 260, class: 'u1l11-svg' }), 0, 0));
      const vals = COF.map((it) => rnd(it.p / it.g * 100, 3));
      const tags = COF.map((it, i) => {
        const cx = X0 + SW * i + SW / 2, hg = Math.max(100, 200 * Math.cbrt(it.g / 1360));
        bagAt(stage, hg, cx, SY);
        const t = el(stage, 'u1l11-stag', `<div class="t1"><span class="lab">${it.lab}</span> · ${M(it.p)}</div><div class="t2">${T(`${it.p.toFixed(2)}\\div${it.g === 1360 ? '1\\,360' : it.g}\\times100`)}</div><div class="t3"><b>?</b><small>per 100 g</small></div>`, cx - (SW - 26) / 2, SY + 24, SW - 26, 140);
        return { t, t2: hide(t.querySelector('.t2')), big: t.querySelector('.t3 b'), lab: t.querySelector('.lab'), cx, hg, it };
      });
      const st = hide(stamp(stage, 'BEST BUY', { ok: true, x: tags[2].cx, y: SY - tags[2].hg / 2, rotate: -9, size: 'lg' }));
      return [
        { cap: 'Same unit first: <b>1.36 kg = 1\u202f360 g</b>.', run: async (c) => { const g = tags[2]; g.lab.innerHTML = g.it.conv; g.lab.classList.add('conv'); await c.pop(g.lab, 360); } },
        { cap: 'On each tag: <b>price ÷ grams × 100</b>. Keep three decimals.',
          run: async (c) => { for (const g of tags) await c.fadeIn(g.t2, 240); await Promise.all(tags.map((g, i) => countTo(c, g.big, 0, vals[i], 900, (v) => '$' + v.toFixed(3)))); } },
        { cap: 'The lowest price per 100 g is <b>$2.058</b>. The <b>1.36 kg bag</b> is the best buy.',
          run: async (c) => { tags.forEach((g, i) => { g.t.classList.toggle('best', i === 2); g.t.classList.toggle('dim', i !== 2); }); await stampIn(c, st); } }
      ];
    }
    if (k === 'b') {
      bagAt(stage, 150, 130, 190);
      el(stage, 'u1l11-plab', '340 g · <b>$8.99</b>', 30, 196, 200, 28);
      const why = [
        ['Stays fresh', 'Coffee goes <b>stale</b> once it is opened. Someone who drinks a little coffee finishes a small bag while it is fresh.'],
        ['Less to pay today', `${T('\\$8.99')} today, not ${T('\\$27.99')}. Good when money is tight this week.`],
        ['Try it first', 'Not sure you like this flavour? Buy the small bag before you buy a big one.']
      ].map(([hd, tx], i) => hide(cb(stage, 'u1l11-note', `<b>${hd}.</b> ${tx}`, 270, 10 + i * 96, W - 300, 84)));
      const st = hide(stamp(stage, 'Best for me?', { ok: null, x: 140, y: 280, rotate: -7 }));
      return [
        { cap: '(b) The big bag is cheaper per 100 g. But the best buy is about <b>more than price</b>.', run: (c) => c.fadeIn(why[0]) },
        { cap: 'It can also be about how much money you have <b>today</b>…', run: (c) => c.fadeIn(why[1]) },
        { cap: '…or about <b>quality</b> and trying something new. Any one good reason is enough.', run: async (c) => { await c.fadeIn(why[2]); await stampIn(c, st); } }
      ];
    }
    // (c) four small bags or one big bag
    const grp = el(stage, 'u1l11-grp', '', 24, 6, 400, 186);
    const small = [0, 1, 2, 3].map((i) => hide(bagAt(stage, 118, 80 + i * 96, 150)));
    el(stage, 'u1l11-plab', `4 × 340 g = 1${' '}360 g`, 24, 156, 400, 28);
    const eqs = el(stage, 'u1l11-eq', '=', 440, 50, 50, 90);
    const big = hide(bagAt(stage, 170, 590, 170));
    el(stage, 'u1l11-plab', '1.36 kg = 1\u202f360 g', 470, 172, 240, 28);
    void grp; void eqs;
    const BX = 240, sc = (W - BX - 210) / 35.96;
    const l1 = hide(el(stage, 'u1l11-rowlab', 'Four 340 g bags', 20, 230, 210, 50)), l2 = hide(el(stage, 'u1l11-rowlab', 'One 1.36 kg bag', 20, 300, 210, 50));
    const b1 = hide(el(stage, 'u1l11-seg cost', T('4\\times\\$8.99=\\$35.96'), BX, 230, 35.96 * sc, 50));
    const b2 = hide(el(stage, 'u1l11-seg sale', '$27.99', BX, 300, 27.99 * sc, 50));
    const gap = hide(el(stage, 'u1l11-gap2', '', BX + 27.99 * sc, 300, 7.97 * sc, 50));
    const gl = hide(el(stage, 'u1l11-tot', `save ${T('\\$7.97')}`, BX + 35.96 * sc + 12, 300, 190, 50));
    return [
      { cap: `Four 340 g bags hold ${T('4\\times340=1\\,360')} g = 1.36 kg: the <b>same amount</b> as one big bag.`,
        run: async (c) => { for (const s of small) await c.pop(s, 260); await c.pop(big, 360); } },
      { cap: `Four small bags cost ${T('4\\times\\$8.99=\\$35.96')}.`, run: async (c) => { await c.fadeIn(l1); await grow(c, b1, 700); } },
      { cap: 'One 1.36 kg bag costs <b>$27.99</b>.', run: async (c) => { await c.fadeIn(l2); await grow(c, b2, 600); } },
      { cap: `You save ${T('\\$35.96-\\$27.99=\\$7.97')} with the big bag.`, run: async (c) => { await appear(c, gap, 300); await c.pop(gl); } }
    ];
  }
};

/* =====================================================================================
 * 5. Examples 5 and 6: the price tag and its bar (markup, tax, discount, percent change)
 * ===================================================================================== */
function priceKit(stage, ex, max) {
  const W = ex.W, X = 190, BWID = W - X - 40, sc = BWID / (max * 1.24);
  const tag = el(stage, 'u1l11-tag', '<small></small><s></s><b></b>', 20, 8, 280, 120);
  const [ts, tsk, tb] = ['small', 's', 'b'].map((q) => tag.querySelector(q));
  const setTag = (lab, big, struck) => { ts.innerHTML = lab; tb.innerHTML = big; tsk.innerHTML = struck || ''; tsk.style.display = struck ? '' : 'none'; };
  const lines = [0, 1, 2].map((i) => hide(el(stage, 'u1l11-line sm', '', 330, 10 + i * 42, W - 350, 40)));
  const rowY = [214, 316];
  const rowLab = (i, html) => el(stage, 'u1l11-rowlab', html, 20, rowY[i], 165, 54);
  /** a bar piece on row i from value a, size v; html inside if it fits, else a label above */
  const seg = (i, a, v, cls, html, above) => {
    const wpx = Math.max(4, v * sc), s = hide(el(stage, 'u1l11-seg ' + cls, wpx >= 96 && !above ? html : '', X + a * sc, rowY[i], wpx, 54));
    if (html && (wpx < 96 || above)) s.lab = hide(el(stage, 'u1l11-blab ' + (cls === 'tax' ? 'b' : cls === 'off' ? 'r' : cls === 'mk' ? '' : ''), html, X + a * sc + wpx / 2 - 90, rowY[i] - 28, 180, 24));
    return s;
  };
  const show = async (c, s, ms = 600) => { await grow(c, s, ms); if (s.lab) await c.pop(s.lab, 280); };
  const end = (i, v, html) => { const x = X + v * sc + 10; return hide(el(stage, 'u1l11-tot', html, x, rowY[i], Math.min(170, W - x - 6), 54)); };
  const say = (c, i, html) => { lines[i].innerHTML = `<div>${html}</div>`; return c.fadeIn(lines[i]); };
  setTag('', '');
  return { X, sc, setTag, tag, tb, lines, say, seg, show, end, rowLab, rowY };
}
const PT = {
  bike: { ask: 'Example 5(a)(b): a bike shop pays $420.00 for a bike and marks it up 45%. What is the retail price? What does it cost with 5% GST in Alberta?' },
  hst: { ask: 'Example 5(c): the bike’s retail price is $609.00. What would it cost in Ontario (13% HST)?' },
  helmet: { ask: 'Example 5(d): the shop buys helmets for $32.00 and sells them for $56.00. What is the markup percent?' },
  coat: { ask: 'Example 6(a)(b): a winter coat regularly sells for $149.00. It is 35% off. Find the discount and the sale price, then the GST and the total in Calgary.' },
  pct: { ask: 'Example 6(c): another store sells the same coat for $104.30 (before tax). What percent decrease is that from $149.00?' }
};
const priceTag = {
  title: 'The price tag: markup, tax and discounts',
  height: 400,
  minW: 960,
  choices: [{ sep: 'Example 5 check:' }, { v: 'bike', label: '(a)(b) Bike in Alberta' }, { v: 'hst', label: '(c) Ontario' }, { v: 'helmet', label: '(d) Helmet markup %' },
    { sep: 'Example 6 check:' }, { v: 'coat', label: '(a)(b) Coat on sale' }, { v: 'pct', label: '(c) Percent decrease' }],
  ask: (k) => PT[k].ask,
  make(stage, k, ex) {
    if (k === 'bike') {
      const K = priceKit(stage, ex, 639.45);
      K.setTag('Cost (wholesale)', '$420.00');
      K.rowLab(0, 'Bike<small>Alberta</small>');
      const s1 = K.seg(0, 0, 420, 'cost', 'cost $420.00'), s2 = K.seg(0, 420, 189, 'mk', '+ $189.00 markup'), s3 = K.seg(0, 609, 30.45, 'tax', '+ $30.45 GST');
      const e2 = K.end(0, 609, ''), e3 = K.end(0, 639.45, '$639.45');
      void e2;
      return [
        { cap: 'The shop pays <b>$420.00</b> for the bike: its <b>cost</b>.', run: (c) => K.show(c, s1) },
        { cap: `(a) Markup: ${T('420\\times0.45=\\$189.00')}.`, run: async (c) => { await K.say(c, 0, `Markup: ${T('420\\times0.45=\\$189.00')}`); await K.show(c, s2); } },
        { cap: `Retail = cost + markup: ${T('420+189=\\$609.00')}. (Or in one step: ${T('420\\times1.45')}.)`,
          run: async (c) => { await K.say(c, 1, `Retail: ${T('420+189=\\$609.00')} or ${T('420\\times1.45')}`); K.setTag('Retail price', '$609.00'); await pulse(c, K.tag, 1.06); } },
        { cap: `(b) Add 5% GST to the retail price: ${T('609\\times1.05=\\$639.45')}.`,
          run: async (c) => { await K.say(c, 2, `With GST: ${T('609\\times1.05=\\$639.45')}`); await K.show(c, s3, 400); await c.pop(e3); K.setTag('Total in Alberta', '$639.45'); await pulse(c, K.tag, 1.06); } }
      ];
    }
    if (k === 'hst') {
      const K = priceKit(stage, ex, 688.17);
      K.setTag('Retail price', '$609.00');
      K.rowLab(0, 'Alberta<small>5% GST</small>'); K.rowLab(1, 'Ontario<small>13% HST</small>');
      const r0 = K.seg(0, 0, 609, 'cost', 'retail $609.00'), r1 = K.seg(1, 0, 609, 'cost', 'retail $609.00');
      const t0 = K.seg(0, 609, 30.45, 'tax', '+ $30.45'), t1 = K.seg(1, 609, 79.17, 'tax', '+ $79.17', true);
      const e0 = K.end(0, 639.45, '$639.45'), e1 = K.end(1, 688.17, '$688.17');
      return [
        { cap: 'The retail price is <b>$609.00</b> in every province. Only the <b>tax</b> is different.', run: async (c) => { await K.show(c, r0); await K.show(c, r1); } },
        { cap: `Alberta, 5% GST: ${T('609\\times1.05=\\$639.45')}.`, run: async (c) => { await K.say(c, 0, `Alberta: ${T('609\\times1.05=\\$639.45')}`); await K.show(c, t0, 400); await c.pop(e0); } },
        { cap: `(c) Ontario, 13% HST: ${T('609\\times1.13=\\$688.17')}.`,
          run: async (c) => { await K.say(c, 1, `Ontario: ${T('609\\times1.13=\\$688.17')}`); await K.show(c, t1, 500); await c.pop(e1); K.setTag('Total in Ontario', '$688.17'); await pulse(c, K.tag, 1.06); } },
        { cap: 'The bike costs <b>$688.17</b> in Ontario: more than in Alberta, because 13% is more than 5%.', run: (c) => pulse(c, t1, 1.15, 600) }
      ];
    }
    if (k === 'helmet') {
      const K = priceKit(stage, ex, 56);
      K.setTag('Selling price', '$56.00');
      K.rowLab(0, 'Cost'); K.rowLab(1, 'Selling price');
      const c0 = K.seg(0, 0, 32, 'cost', 'cost $32.00'), c1 = K.seg(1, 0, 32, 'cost', 'cost $32.00'), m1 = K.seg(1, 32, 24, 'mk', 'markup $24.00');
      const q0 = [0, 1, 2, 3].map((i) => hide(el(stage, 'u1l11-blk', '$8', K.X + i * 8 * K.sc, K.rowY[0], 8 * K.sc, 54)));
      const q1 = [0, 1, 2].map((i) => hide(el(stage, 'u1l11-blk', '$8', K.X + (32 + i * 8) * K.sc, K.rowY[1], 8 * K.sc, 54)));
      q0.forEach((b) => { b.style.cssText += 'font-size:19px;background:#f3dcb0;border-color:#9a6a24'; }); q1.forEach((b) => { b.style.cssText += 'font-size:19px;background:#ffe1a6;border-color:#c27a0e'; });
      const e1 = K.end(1, 56, '= 75%');
      return [
        { cap: 'The shop buys a helmet for <b>$32.00</b> and sells it for <b>$56.00</b>.', run: async (c) => { await K.show(c, c0); await K.show(c, c1); await K.show(c, m1); } },
        { cap: `The markup is the difference: ${T('56-32=\\$24.00')}.`, run: async (c) => { await K.say(c, 0, `Markup: ${T('56-32=\\$24.00')}`); m1.classList.add('hl'); await pulse(c, m1, 1.08); } },
        { cap: `Markup % compares the markup to the <b>cost</b>: ${T('24\\div32\\times100=75\\%')}.`, run: (c) => K.say(c, 1, `Markup %: ${T('24\\div32\\times100=75\\%')}`) },
        { cap: 'See it: cut the $32 cost into quarters of $8. The $24 markup is <b>3 quarters</b> of the cost: 75% ✓',
          run: async (c) => { c0.innerHTML = m1.innerHTML = ''; for (const b of q0) await c.pop(b, 200); for (const b of q1) await c.pop(b, 200); await c.pop(e1); } }
      ];
    }
    if (k === 'coat') {
      const K = priceKit(stage, ex, 149);
      K.setTag('Regular price', '$149.00');
      K.rowLab(0, 'Regular'); const l1 = hide(K.rowLab(1, 'In Calgary<small>sale + GST</small>'));
      const base = K.seg(0, 0, 149, 'cost', 'regular $149.00'), off = K.seg(0, 96.85, 52.15, 'off', '− $52.15');
      const ghost = K.seg(0, 96.85, 52.15, 'ghost', '35% off');
      const sale = K.seg(1, 0, 96.85, 'sale', 'sale $96.85'), tax = K.seg(1, 96.85, 4.84, 'tax', '+ $4.84 GST');
      const e1 = K.end(1, 101.69, '$101.69');
      return [
        { cap: 'The coat regularly sells for <b>$149.00</b>.', run: (c) => K.show(c, base) },
        { cap: `(a) Discount: ${T('149\\times0.35=\\$52.15')}.`, run: async (c) => { await K.say(c, 0, `Discount: ${T('149\\times0.35=\\$52.15')}`); await K.show(c, off, 500); } },
        { cap: `Take it off: ${T('149-52.15=\\$96.85')}. (Or in one step: ${T('149\\times0.65')}, since you pay 65%.)`,
          run: async (c) => {
            await K.say(c, 1, `Sale: ${T('149-52.15=\\$96.85')} or ${T('149\\times0.65')}`);
            await appear(c, ghost, 200); base.innerHTML = 'sale $96.85'; base.classList.add('sale');
            await Promise.all([fall(c, off), sizeTo(c, base, 96.85 * K.sc, 600), off.lab ? fadeOut(c, off.lab) : null]);
            K.setTag('Sale price', '$96.85', '$149.00'); await pulse(c, K.tag, 1.06);
          } },
        { cap: `(b) Tax goes on the <b>sale</b> price: GST ${T('96.85\\times0.05=4.8425')}, about <b>$4.84</b>.`,
          run: async (c) => { await c.fadeIn(l1); await K.show(c, sale); await K.show(c, tax, 400); } },
        { cap: `Total: ${T('96.85\\times1.05=101.6925')}, about <b>$101.69</b>.`,
          run: async (c) => { await K.say(c, 2, `Total: ${T('96.85\\times1.05\\approx\\$101.69')}`); await c.pop(e1); K.setTag('Total in Calgary', '$101.69', '$149.00'); await pulse(c, K.tag, 1.06); } }
      ];
    }
    // percent decrease
    const K = priceKit(stage, ex, 149);
    K.setTag('Other store', '$104.30', '$149.00');
    K.rowLab(0, 'Original<small>the old price</small>'); K.rowLab(1, 'Other store');
    const o = K.seg(0, 0, 149, 'cost', 'original $149.00'), n = K.seg(1, 0, 104.30, 'sale', '$104.30'), g = K.seg(1, 104.30, 44.70, 'ghost', '− $44.70');
    const tenths = Array.from({ length: 10 }, (_, i) => hide(el(stage, 'u1l11-blk', '10%', K.X + i * 14.9 * K.sc, K.rowY[0], 14.9 * K.sc, 54)));
    tenths.forEach((b, i) => { b.style.cssText += i >= 7 ? 'font-size:15px;background:#f4c4c0;border-color:#c93a33' : 'font-size:15px;background:#f3dcb0;border-color:#9a6a24'; });
    const e0 = K.end(0, 149, '30% ✓');
    return [
      { cap: 'The coat was <b>$149.00</b>. Another store sells it for <b>$104.30</b>.', run: async (c) => { await K.show(c, o); await K.show(c, n); } },
      { cap: `The decrease: ${T('149.00-104.30=\\$44.70')}.`, run: async (c) => { await K.say(c, 0, `Decrease: ${T('149.00-104.30=\\$44.70')}`); await K.show(c, g, 500); } },
      { cap: `Divide by the <b>original</b> (old) price: ${T('44.70\\div149\\times100=30\\%')}.`, run: async (c) => { await K.say(c, 1, `${T('44.70\\div149\\times100=30\\%')}`); o.classList.add('hl'); await pulse(c, o, 1.04); } },
      { cap: 'See it: 10% of $149 is $14.90. The $44.70 drop is <b>3</b> of those tenths: a <b>30% decrease</b> ✓',
        run: async (c) => { o.innerHTML = ''; for (const b of tenths) await c.pop(b, 150); await c.pop(e0); } }
    ];
  }
};

/* =====================================================================================
 * 6. Example 7: two discounts in a row vs $30 off
 * ===================================================================================== */
const stacked = {
  title: 'Two discounts in a row, or $30 off?',
  height: 400,
  minW: 960,
  choices: [{ sep: 'Example 7 check:' }, { v: 'a', label: '(a) Which store?' }, { v: 'b', label: '(b) Same as 35% off?' }],
  ask: (k) => (k === 'a' ? 'Example 7(a): runners cost $90.00. Store A: 25% off, then an extra 10% off at the till. Store B: $30 off. Find each price before tax. Which is cheaper?'
    : 'Example 7(b): is “25% off, then 10% off” the same as 35% off? Explain.'),
  make(stage, k, ex) {
    const W = ex.W, X = 200, sc = (W - X - 40) / (90 * 1.3), RY = [64, 214], BH = 56;
    const lab = (i, html) => el(stage, 'u1l11-rowlab', html, 20, RY[i], 175, BH);
    const piece = (i, a, v, cls, html) => hide(el(stage, 'u1l11-seg ' + cls, html, X + a * sc, RY[i], v * sc, BH));
    const tl = (i, a, v, html, up) => hide(el(stage, 'u1l11-blab r', html, X + (a + v / 2) * sc - 110, RY[i] - (up ? 52 : 28), 220, 24));
    const work = (i, html) => hide(el(stage, 'u1l11-line sm', html, X, RY[i] + BH + 8, W - X - 20, 36));
    const endl = (i, v, html) => hide(el(stage, 'u1l11-tot', html, X + 90 * sc + 14, RY[i], W - X - 90 * sc - 20, BH));
    /** take a chunk [a, a+v] off the end of base: it falls away and leaves a dashed ghost */
    const chunk = (i, a, v, html, up) => { const g = piece(i, a, v, 'ghost', ''), o = piece(i, a, v, 'off', ''), t = tl(i, a, v, html, up); return { g, o, t }; };
    const off = async (c, base, ch, newW, txt) => { await grow(c, ch.o, 400); await c.pop(ch.t, 260); await appear(c, ch.g, 150); base.innerHTML = txt; await Promise.all([fall(c, ch.o), sizeTo(c, base, newW * sc, 600)]); };
    if (k === 'a') {
      lab(0, 'Store A<small>25% off, then 10% off</small>'); lab(1, 'Store B<small>$30 off</small>');
      const A = piece(0, 0, 90, 'cost', '$90.00'), B = piece(1, 0, 90, 'cost', '$90.00');
      const a1 = chunk(0, 67.5, 22.5, '− 25%: $22.50'), a2 = chunk(0, 60.75, 6.75, '− 10%: $6.75', true), b1 = chunk(1, 60, 30, '− $30.00');
      const wA1 = work(0, `${T('90\\times0.75=\\$67.50')}`), wA2 = work(0, `${T('90\\times0.75=\\$67.50')}, then ${T('67.50\\times0.90=\\$60.75')}`), wB = work(1, T('90-30=\\$60.00'));
      const eA = endl(0, 60.75, '$60.75'), eB = endl(1, 60, '$60.00');
      const st = hide(stamp(stage, 'Cheaper by $0.75', { ok: true, x: X + 30 * sc, y: RY[1] + 130, rotate: -6 }));
      return [
        { cap: 'Both stores start at <b>$90.00</b>.', run: async (c) => { await grow(c, A); await grow(c, B); } },
        { cap: `Store A: 25% off. You pay 75%: ${T('90\\times0.75=\\$67.50')}.`, run: async (c) => { await off(c, A, a1, 67.5, '$67.50'); await c.fadeIn(wA1); } },
        { cap: `Then an <b>extra 10% off the new price</b>: ${T('67.50\\times0.90=\\$60.75')}.`,
          run: async (c) => { await off(c, A, a2, 60.75, '$60.75'); await fadeOut(c, wA1, 150); await c.fadeIn(wA2); await c.pop(eA); } },
        { cap: `Store B: $30 off: ${T('90-30=\\$60.00')}.`, run: async (c) => { await off(c, B, b1, 60, '$60.00'); await c.fadeIn(wB); await c.pop(eB); } },
        { cap: `Store B is cheaper, by ${T('\\$60.75-\\$60.00=\\$0.75')}.`, run: async (c) => { B.classList.add('sale'); await stampIn(c, st); } }
      ];
    }
    lab(0, '25% off,<small>then 10% off</small>'); lab(1, '35% off<small>in one go</small>');
    const A = piece(0, 0, 90, 'cost', '$90.00'), B = piece(1, 0, 90, 'cost', '$90.00');
    const a1 = chunk(0, 67.5, 22.5, '− $22.50'), a2 = chunk(0, 60.75, 6.75, '− $6.75', true), b1 = chunk(1, 58.5, 31.5, '− 35%: $31.50');
    const eA = endl(0, 60.75, '$60.75'), eB = endl(1, 58.5, '$58.50');
    const wB = work(1, T('90\\times0.65=\\$58.50'));
    const cmpY = RY[1] + BH + 44;
    const n1 = hide(el(stage, 'u1l11-line sm', `<b>10% of $67.50</b>&nbsp;= ${T('\\$6.75')}`, 20, cmpY, 300, 36));
    const p1 = hide(el(stage, 'u1l11-seg off', '', 320, cmpY + 4, 6.75 * sc * 2, 28));
    const n2 = hide(el(stage, 'u1l11-line sm', `<b>10% of $90.00</b>&nbsp;= ${T('\\$9.00')}`, 20, cmpY + 42, 300, 36));
    const p2 = hide(el(stage, 'u1l11-seg off', '', 320, cmpY + 46, 9 * sc * 2, 28));
    const st = hide(stamp(stage, 'Not 35% off ✗', { ok: false, x: W - 170, y: cmpY + 36, rotate: 6 }));
    return [
      { cap: '25% off, then 10% off: from part (a), the price is <b>$60.75</b>.',
        run: async (c) => { await grow(c, A, 400); await grow(c, B, 400); await off(c, A, a1, 67.5, '$67.50'); await off(c, A, a2, 60.75, '$60.75'); await c.pop(eA); } },
      { cap: `35% off in one go: you pay 65%: ${T('90\\times0.65=\\$58.50')}.`, run: async (c) => { await off(c, B, b1, 58.5, '$58.50'); await c.fadeIn(wB); await c.pop(eB); } },
      { cap: 'Not the same! The extra 10% came off <b>$67.50</b>, not off $90: it saves only <b>$6.75</b>, not $9.00.',
        run: async (c) => { await c.fadeIn(n1); await grow(c, p1, 400); await c.fadeIn(n2); await grow(c, p2, 400); } },
      { cap: 'Two discounts in a row give <b>less</b> than their sum: 25% then 10% is <b>not</b> 35% off.', run: (c) => stampIn(c, st) }
    ];
  }
};

/* =====================================================================================
 * 7. Full notes: why two discounts are not added (the 100-square grid)
 * ===================================================================================== */
const NA = {
  e7: { ask: 'Example 7: 25% off, then an extra 10% off. Why is that not 35% off?', d1: 25, d2: 10, price: 90 },
  q20: { ask: 'Practice test Q20: a store takes 30% off, then an extra 20% off the sale price. What single discount is that the same as?', d1: 30, d2: 20 }
};
const notAdded = {
  title: 'The second discount comes off what is left',
  height: 360,
  minW: 960,
  choices: [{ sep: 'Example 7:' }, { v: 'e7', label: '25% then 10%' }, { sep: 'Practice test:' }, { v: 'q20', label: 'Q20: 30% then 20%' }],
  ask: (k) => NA[k].ask,
  make(stage, k, ex) {
    const d = NA[k], W = ex.W, CS = 32, GX = 30, GY = 12, left1 = 100 - d.d1, two = rnd(left1 * d.d2 / 100, 2), left2 = rnd(left1 - two, 2), tot = rnd(100 - left2, 2);
    const sv = add(stage, svgEl('svg', { width: 10 * CS + 4, height: 10 * CS + 4, class: 'u1l11-svg' }), GX, GY);
    const sq = [];
    for (let i = 0; i < 100; i++) { const r = Math.floor(i / 10), q = i % 10; sq.push(svgEl('rect', { x: 2 + q * CS, y: 2 + r * CS, width: CS, height: CS, class: 'u1l11-sq' }, sv)); }
    const fromEnd = (n) => sq.slice(100 - n).reverse();           // the last n squares, bottom row first
    const first = fromEnd(d.d1), whole = Math.floor(two), next = sq.slice(100 - d.d1 - whole, 100 - d.d1).reverse();
    let half = null;
    if (two > whole) { const i = 100 - d.d1 - whole - 1, r = Math.floor(i / 10), q = i % 10; half = svgEl('rect', { x: 2 + q * CS + CS / 2, y: 2 + r * CS, width: CS / 2, height: CS, class: 'u1l11-sq off2' }, sv); hide(half); }
    const RX = 400, RW = W - RX - 20;
    const L = [
      `The price: all <b>100</b> squares = <b>100%</b>`,
      `${d.d1}% off: ${T(`100-${d.d1}=${left1}`)} squares left`,
      `${d.d2}% of the <b>${left1}</b> left: ${T(`0.${String(d.d2).padStart(2, '0')}\\times${left1}=${two}`)}`,
      `Left: ${T(`${left1}-${two}=${left2}`)}, so you pay <b>${left2}%</b>`,
      `Discount: ${T(`100-${left2}=${tot}\\%`)}, not ${T(`${d.d1 + d.d2}\\%`)}`
    ].map((s, i) => hide(el(stage, 'u1l11-line' + (i === 4 ? '' : ' sm'), s, RX, 12 + i * 52, RW, 44)));
    const chk = d.price ? hide(cb(stage, 'u1l11-res', `${T(`0.675\\times\\$90=\\$60.75`)}: the Store A price ✓`, RX, 280, RW, 52)) : null;
    const steps = [
      { cap: 'The whole price is <b>100%</b>: all 100 squares.', run: (c) => c.fadeIn(L[0]) },
      { cap: `${d.d1}% off: take away <b>${d.d1}</b> squares. <b>${left1}</b> are left.`,
        run: async (c) => { for (const s of first) { s.classList.add('off1'); if (!c.fast) await c.sleep(25); } await c.fadeIn(L[1]); } },
      { cap: `The extra ${d.d2}% is ${d.d2}% of the <b>${left1} squares left</b>, not of 100: that is <b>${two}</b> squares.`,
        run: async (c) => { for (const s of next) { s.classList.add('off2'); if (!c.fast) await c.sleep(60); } if (half) await appear(c, half, 200); await c.fadeIn(L[2]); } },
      { cap: `${T(`${left1}-${two}=${left2}`)} squares are left: you pay <b>${left2}%</b> of the price.`, run: (c) => c.fadeIn(L[3]) },
      { cap: `The total discount is ${T(`100-${left2}=${tot}\\%`)}, <b>not</b> ${T(`${d.d1}+${d.d2}=${d.d1 + d.d2}\\%`)}.`, run: (c) => c.pop(L[4]) }
    ];
    if (chk) steps.push({ cap: `Check: ${left2}% of $90 is ${T('0.675\\times\\$90=\\$60.75')}, the Store A price from Example 7 ✓`, run: (c) => c.pop(chk) });
    return steps;
  }
};

/* =====================================================================================
 * 8. Example 8: the bank board and the exchange machine
 * ===================================================================================== */
const RATES = [['US dollar', 'USD', '1.34', '1.42'], ['Euro', 'EUR', '1.46', '1.56'], ['Mexican peso', 'MXN', '0.072', '0.081']];
const BK = {
  a: { ask: 'Example 8(a): Kayla buys $300 USD in cash for a trip to Montana. How much does it cost her in Canadian dollars?' },
  b: { ask: 'Example 8(b): she comes home with $40 USD and sells it back to the bank. How much does she get? How much did she lose on that $40 USD?' },
  c: { ask: 'Example 8(c): in Montana a hoodie costs $45.00 USD. Estimate the cost in Canadian dollars in your head, then find it exactly using 1 USD = 1.38 CAD. Why does estimating help?' },
  d: { ask: 'Example 8(d): her friend buys 3000 Mexican pesos at this bank for a trip to Cancun. How much does that cost in Canadian dollars?'.replace('3000', fmt(3000)) }
};
const bank = {
  title: 'At the bank: which rate, and which way?',
  height: 410,
  minW: 960,
  choices: [{ sep: 'Example 8 check:' }, { v: 'a', label: '(a) Buy USD' }, { v: 'b', label: '(b) Sell it back' }, { v: 'c', label: '(c) Estimate ×1.4' }, { v: 'd', label: '(d) Pesos' }],
  ask: (k) => BK[k].ask,
  make(stage, k, ex) {
    const W = ex.W;
    const board = el(stage, 'u1l11-board', `<div class="bh">Calgary bank · CAD for 1 unit</div><table><tr><th>Currency</th><th>We buy</th><th>We sell</th></tr>${RATES.map((r) => `<tr><td>${r[1]}</td><td class="r">${r[2]}</td><td class="r">${r[3]}</td></tr>`).join('')}</table>`, 16, 6, 360, 214);
    const rows = [...board.querySelectorAll('tr')].slice(1);
    const light = (row, col) => rows.forEach((r, i) => { r.classList.toggle('dim', i !== row); r.querySelectorAll('td.r').forEach((td, j) => td.classList.toggle('on', i === row && j === col)); });
    const MX = 400, FW = 190, OW = 130, TW = W - MX - FW - OW - 20;
    const fromB = hide(el(stage, 'u1l11-cash usd', '', MX, 14, FW, 100));
    const op = hide(el(stage, 'u1l11-op', '', MX + FW, 14, OW, 100));
    const toB = hide(el(stage, 'u1l11-cash cad', '<span>$0.00</span><small>CAD</small>', MX + FW + OW, 14, TW, 100));
    const toN = toB.querySelector('span');
    const w1 = hide(el(stage, 'u1l11-line', '', MX, 134, W - MX - 20, 42)), w2 = hide(el(stage, 'u1l11-line sm', '', MX, 180, W - MX - 20, 40));
    const note = (html, y = 244, hh = 70) => hide(cb(stage, 'u1l11-note', html, 16, y, W - 32, hh));
    const machine = async (c, fromHtml, cls, opHtml, to, toLab) => {
      fromB.className = 'u1l11-cash ' + cls; fromB.innerHTML = fromHtml; op.innerHTML = opHtml;
      await c.pop(fromB); await c.fadeIn(op, 300, { from: 'translateX(-16px)' }); await c.fadeIn(toB);
      toB.querySelector('small').textContent = toLab || 'CAD';
      await countTo(c, toN, 0, to, 900, (v) => M(v));
    };
    const say = (c, e, html) => { e.innerHTML = `<div>${html}</div>`; return c.fadeIn(e); };
    if (k === 'a') {
      const n1 = note('Check: <b>bigger or smaller?</b> One US dollar costs <b>more</b> than one Canadian dollar, so the Canadian amount is <b>bigger</b> than 300 ✓');
      const st = hide(stamp(stage, 'Makes sense ✓', { ok: true, x: W - 150, y: 350, rotate: -6 }));
      return [
        { cap: 'Kayla <b>buys</b> US cash, so the bank <b>sells</b> it to her: use <b>We sell 1.42</b>.', run: async (c) => { light(0, 1); await pulse(c, rows[0], 1.04); } },
        { cap: `Each US dollar costs her $1.42 CAD: ${T('300\\times1.42=\\$426.00')}.`,
          run: async (c) => { await machine(c, '<span>$300</span><small>USD</small>', 'usd', '× 1.42 ⟶', 426); await say(c, w1, T('300\\times1.42=\\$426.00')); } },
        { cap: 'Bigger or smaller? A US dollar costs more than a Canadian dollar, so the CAD amount is <b>bigger</b> ✓ It costs her <b>$426.00 CAD</b>.', run: async (c) => { await c.fadeIn(n1); await stampIn(c, st); } }
      ];
    }
    if (k === 'b') {
      const BX = 240, sc = (W - BX - 220) / 56.8, Y1 = 252, Y2 = 322;
      const l1 = hide(el(stage, 'u1l11-rowlab', 'Paid for $40 USD<small>at 1.42</small>', 16, Y1, 220, 50)), l2 = hide(el(stage, 'u1l11-rowlab', 'Got back<small>at 1.34</small>', 16, Y2, 220, 50));
      const b1 = hide(el(stage, 'u1l11-seg cost', '$56.80', BX, Y1, 56.8 * sc, 50)), b2 = hide(el(stage, 'u1l11-seg sale', '$53.60', BX, Y2, 53.6 * sc, 50));
      const gap = hide(el(stage, 'u1l11-gap2', '', BX + 53.6 * sc, Y2, 3.2 * sc, 50)), gl = hide(el(stage, 'u1l11-tot', 'lost $3.20', BX + 56.8 * sc + 12, Y2, 200, 50));
      return [
        { cap: 'She <b>sells</b> US cash back, so the bank <b>buys</b> it: use <b>We buy 1.34</b>.', run: async (c) => { light(0, 0); await pulse(c, rows[0], 1.04); } },
        { cap: `${T('40\\times1.34=\\$53.60')}: she gets <b>$53.60 CAD</b>.`,
          run: async (c) => { await machine(c, '<span>$40</span><small>USD</small>', 'usd', '× 1.34 ⟶', 53.6); await say(c, w1, `Back: ${T('40\\times1.34=\\$53.60')}`); } },
        { cap: `But she paid ${T('40\\times1.42=\\$56.80')} for that $40 USD.`,
          run: async (c) => { await say(c, w2, `Paid: ${T('40\\times1.42=\\$56.80')}`); await c.fadeIn(l1); await grow(c, b1); await c.fadeIn(l2); await grow(c, b2); } },
        { cap: `There and back, she lost ${T('\\$56.80-\\$53.60=\\$3.20')}. The bank keeps the gap between its two rates.`, run: async (c) => { await appear(c, gap, 300); await c.pop(gl); } }
      ];
    }
    if (k === 'c') {
      const r = note('This part uses <b>1 USD = 1.38 CAD</b> (not the bank’s board). To estimate, round the rate: 1.38 ≈ <b>1.4</b>.', 244, 56);
      const e1 = hide(cb(stage, 'u1l11-est', `× 1.4 = the amount + 40%: ${T('10\\%\\text{ of }45=4.5,\\ 40\\%=4\\times4.5=18')}`, 16, 310, W - 32, 44));
      const n2 = note('Why estimate? You see what you are really paying in <b>your own money</b>, so you can compare with prices at home and stay on budget.', 312, 70);
      return [
        { cap: 'This part uses <b>1 USD = 1.38 CAD</b>. Round it to <b>1.4</b> to estimate in your head.', run: async (c) => { rows.forEach((rw) => rw.classList.add('dim')); await c.fadeIn(r); } },
        { cap: `× 1.4 means the amount <b>plus 40%</b>. 10% of 45 is 4.5, so 40% is ${T('4\\times4.5=18')}. Estimate: ${T('45+18=\\$63')}.`,
          run: async (c) => { await c.fadeIn(e1); await say(c, w2, `Estimate: ${T('45\\times1.4\\approx45+18=\\$63')}`); } },
        { cap: `Exact: ${T('45\\times1.38=\\$62.10')} CAD. Close to $63 ✓`, run: async (c) => { await machine(c, '<span>$45</span><small>USD</small>', 'usd', '× 1.38 ⟶', 62.1); await say(c, w1, T('45\\times1.38=\\$62.10')); } },
        { cap: 'Why estimate? You know what you are really paying in <b>your own money</b>, so you can compare with home and stay on budget.', run: async (c) => { await fadeOut(c, e1); await c.fadeIn(n2); } }
      ];
    }
    const n1 = note('Check: <b>bigger or smaller?</b> A peso is worth much <b>less</b> than a Canadian dollar, so the Canadian amount is much <b>smaller</b> than 3 000 ✓');
    const st = hide(stamp(stage, 'Makes sense ✓', { ok: true, x: W - 150, y: 350, rotate: -6 }));
    return [
      { cap: 'Her friend <b>buys</b> pesos, so the bank <b>sells</b>: use <b>We sell 0.081</b>.', run: async (c) => { light(2, 1); await pulse(c, rows[2], 1.04); } },
      { cap: `Each peso costs $0.081 CAD: ${T('3\\,000\\times0.081=\\$243.00')}.`,
        run: async (c) => { await machine(c, `<span>${fmt(3000)}</span><small>MXN (pesos)</small>`, 'mxn', '× 0.081 ⟶', 243); await say(c, w1, T('3\\,000\\times0.081=\\$243.00')); } },
      { cap: 'Bigger or smaller? A peso is worth much less than a dollar, so the CAD amount is much <b>smaller</b> ✓ It costs <b>$243.00 CAD</b>.', run: async (c) => { await c.fadeIn(n1); await stampIn(c, st); } }
    ];
  }
};

/* =====================================================================================
 * 9. Full notes: multiply or divide? (flowchart)
 * ===================================================================================== */
const WW = {
  tbl: { ask: 'From the table: change $50.00 USD to Canadian dollars, using 1 USD = 1.38 CAD.', rate: '1\\text{ USD}=1.38\\text{ CAD}', have: 'USD', starts: 'USD', yes: true,
    work: '50\\times1.38=\\$69.00\\text{ CAD}', check: 'A US dollar is worth <b>more</b> than a Canadian dollar, so you get <b>more</b> Canadian dollars ✓' },
  q22: { ask: 'Practice test Q22: the rate is 1 CAD = 0.72 USD. A $45.00 USD shirt costs about how much in Canadian dollars?', rate: '1\\text{ CAD}=0.72\\text{ USD}', have: 'USD', starts: 'CAD', yes: false,
    work: '45\\div0.72=\\$62.50\\text{ CAD}', check: 'A Canadian price should be <b>more</b> than the US price: $62.50 is more than $45 ✓' },
  q26: { ask: 'Practice test Q26: the rate is 1 CAD = 0.66 EUR. How many euros does Noor get for $450 CAD?', rate: '1\\text{ CAD}=0.66\\text{ EUR}', have: 'CAD', starts: 'CAD', yes: true,
    work: '450\\times0.66=297\\text{ euros}', check: 'A euro is worth <b>more</b> than a dollar, so she gets <b>fewer</b> euros than dollars ✓' },
  q13: { ask: 'Practice test Q13(d): she changes $500.00 CAD into British pounds. The bank sells pounds at 1.83, so 1 GBP = 1.83 CAD. How many pounds does she get?', rate: '1\\text{ GBP}=1.83\\text{ CAD}', have: 'CAD', starts: 'GBP', yes: false,
    work: '500\\div1.83=273.224\\ldots\\approx273.22\\text{ pounds}', check: 'A pound is worth <b>more</b> than a dollar, so she gets <b>fewer</b> pounds than dollars ✓' }
};
const whichWay = {
  title: 'Multiply or divide? Let the rate decide',
  height: 400,
  minW: 960,
  choices: [{ sep: 'Table:' }, { v: 'tbl', label: '$50 USD' }, { sep: 'Practice test:' }, { v: 'q22', label: 'Q22' }, { v: 'q26', label: 'Q26' }, { v: 'q13', label: 'Q13(d)' }],
  ask: (k) => WW[k].ask,
  make(stage, k, ex) {
    const d = WW[k], W = ex.W;
    const F = new Flowchart(stage, { x: 10, y: 4, width: 470, height: 392,
      nodes: {
        rate: { x: 235, y: 36, w: 420, h: 56, html: '<b>Write the rate</b>1 [currency] = rate', cls: 'bk-round' },
        q: { x: 235, y: 146, w: 420, h: 74, html: '<b>Does the rate start with</b>the currency you <b>have</b>?', cls: 'bk-diamond' },
        mul: { x: 105, y: 262, w: 180, h: 56, html: '<b>Multiply</b>', color: 'green' },
        div: { x: 365, y: 262, w: 180, h: 56, html: '<b>Divide</b>', color: 'blue' },
        chk: { x: 235, y: 360, w: 420, h: 50, html: '<b>Check:</b> bigger or smaller?', cls: 'bk-round' }
      },
      edges: [{ from: 'rate', to: 'q' }, { from: 'q', to: 'mul', label: 'yes', route: 'vhv' }, { from: 'q', to: 'div', label: 'no', route: 'vhv' }, { from: 'mul', to: 'chk' }, { from: 'div', to: 'chk' }] });
    const RX = 500, RW = W - RX - 16, op = d.yes ? 'mul' : 'div';
    const L = [
      `Rate: ${T(d.rate)}`,
      `You have <b>${d.have}</b>; the rate starts with <b>${d.starts}</b>: <b>${d.yes ? 'yes' : 'no'}</b>`,
      `<b>${d.yes ? 'Multiply' : 'Divide'}:</b> ${T(d.work)}`
    ].map((s, i) => hide(el(stage, 'u1l11-line sm', s, RX, 20 + i * 64, RW, 52)));
    L.forEach((e) => { e.style.whiteSpace = 'normal'; });
    const chk = hide(cb(stage, 'u1l11-note', d.check, RX, 220, RW, 96));
    return [
      { cap: `Write the rate as 1 [currency] = rate: ${T(d.rate)}.`, run: async (c) => { await F.visit(c, 'rate'); await c.fadeIn(L[0]); } },
      { cap: `You have <b>${d.have}</b>. Does the rate start with ${d.have}? It starts with ${d.starts}: <b>${d.yes ? 'yes' : 'no'}</b>.`, run: async (c) => { await F.go(c, 'rate', 'q'); await F.visit(c, 'q'); await c.fadeIn(L[1]); } },
      { cap: `${d.yes ? 'Yes: multiply' : 'No: divide'}. ${T(d.work)}.`, run: async (c) => { await F.go(c, 'q', op); await F.visit(c, op); await c.fadeIn(L[2]); } },
      { cap: d.check, run: async (c) => { await F.go(c, op, 'chk'); await F.visit(c, 'chk'); await c.pop(chk); } }
    ];
  }
};

/* =====================================================================================
 * 10. Full notes: practice-test multiple choice, with the mistake behind every wrong choice
 * ===================================================================================== */
const MC = {
  q15: { ask: 'Practice test Q15: which ratio is equivalent to 12 : 18?', opts: ['3:2', '2:3', '10:16', '6:12'], tex: true, ans: 1,
    work: '12:18\\ \\to\\ \\div6\\ \\to\\ 2:3', why: ['reversed: 18 : 12', '', 'took 2 off both terms', 'took 6 off both terms'], trap: 'Adding or subtracting the same number does <b>not</b> keep a ratio. Only multiply or divide.' },
  q16: { ask: 'Practice test Q16: a cyclist rides 54 km in 2.5 h. Her average speed is…', opts: ['27 km/h', '135 km/h', '21.6 km/h', '56.5 km/h'], ans: 2,
    work: '54\\div2.5=21.6\\text{ km/h}', why: ['divided by 2, not 2.5', 'multiplied: 54 × 2.5', '', 'added: 54 + 2.5'], trap: 'A unit rate is “per 1 hour”: divide by the hours.' },
  q17: { ask: 'Practice test Q17: a chainsaw uses a 50 : 1 mix of gas to oil. How much oil goes with 2.5 L of gas?', opts: ['20 mL', '50 mL', '125 mL', '0.05 mL'], ans: 1,
    work: '2.5\\text{ L}=2\\,500\\text{ mL};\\ 2\\,500\\div50=50\\text{ mL}', why: ['used 1 L, not 2.5 L', '', 'multiplied: 2.5 × 50', 'forgot to change L to mL'], trap: 'Same units first: the answer is in mL, so change 2.5 L to mL.' },
  q19: { ask: 'Practice test Q19: a jacket’s price drops from $80.00 to $60.00. The percent decrease is…', opts: ['25%', '20%', '33.3%', '75%'], ans: 0,
    work: '20\\div80\\times100=25\\%', why: ['', 'used the $20 as the percent', 'divided by the new price', 'the new price as a percent of the old'], trap: 'Percent change: always divide by the <b>original</b> (old) price.' }
};
const traps = {
  title: 'Spot the trap',
  height: 330,
  minW: 960,
  choices: [{ sep: 'Practice test:' }, { v: 'q15', label: 'Q15 Ratio' }, { v: 'q16', label: 'Q16 Speed' }, { v: 'q17', label: 'Q17 Gas mix' }, { v: 'q19', label: 'Q19 Percent decrease' }],
  ask: (k) => MC[k].ask,
  make(stage, k, ex) {
    const d = MC[k], W = ex.W, OW = (W - 50) / 2;
    const tiles = d.opts.map((o, i) => el(stage, 'u1l11-opt', `<b>${'ABCD'[i]}</b><span class="ot">${d.tex ? T(o) : o}</span><span class="why"></span>`, 16 + (i % 2) * (OW + 18), 8 + Math.floor(i / 2) * 92, OW, 80));
    tiles.forEach((t, i) => { const w = t.querySelector('.why'); w.innerHTML = d.why[i]; hide(w); });
    const work = hide(cb(stage, 'u1l11-res', `Work it out: ${T(d.work)}`, (W - 640) / 2, 202, 640, 52));
    const tp = hide(cb(stage, 'u1l11-note', d.trap, 16, 266, W - 32, 52));
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

mountExplainers({ share, proportion, fuelTrip, shelf, priceTag, stacked, notAdded, bank, whichWay, traps });

/* ============ Stand Up Break! — mixed review like the unit test, at the whiteboards ============ */
{
  const dd = (v) => rnd(v, 2).toFixed(2);
  const raw = (v) => String(rnd(v, 4));                           // a calculator-style answer, before rounding
  const eqOrApprox = (v) => (Math.abs(v - rnd(v, 2)) < 1e-9 ? `=\\$${dd(v)}` : `=${raw(v)}\\approx\\$${dd(v)}`);
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const NAMES = ['Ava', 'Noah', 'Kiran', 'Maya', 'Liam', 'Zara', 'Owen', 'Jasmine', 'Mateo', 'Leah'];
  const ITEMS = ['jacket', 'skateboard', 'pair of boots', 'backpack', 'drill', 'hockey stick', 'lamp', 'phone case'];
  standup('u1l11', {
    intro: 'Mixed review, like the unit test. Estimate first, then use your calculator. Show every step.',
    levels: {
      BEG: (r) => r.pick([
        () => { // hourly rate of pay
          const nm = r.pick(NAMES), rate = r.int(1550, 2290) / 100, hr = r.int(6, 14), pay = rnd(rate * hr, 2);
          return { text: `${nm} earns <b>$${dd(pay)}</b> for <b>${hr} hours</b> of work. What is the hourly rate of pay?`, q: '', a: [`${dd(pay)}\\div${hr}=\\$${dd(rate)}\\text{ per hour}`] };
        },
        () => { // a ratio with units
          const hrs = r.pick([1, 2]), tot = 60 * hrs; let a; do { a = 5 * r.int(2, tot / 5 - 1); } while (a % 60 === 0);
          const g = gcd(a, tot);
          return { text: `Write <b>${a} min : ${hrs} h</b> in simplest form.`, q: '', a: [`${hrs}\\text{ h}=${tot}\\text{ min, so }${a}:${tot}`, `\\div${g}:\\ ${a / g}:${tot / g}`] };
        },
        () => { // fuel economy
          const km = r.pick([300, 400, 500, 600, 800]), econ = r.int(60, 130) / 10, L = rnd(econ * km / 100, 1);
          return { text: `A car uses <b>${L} L</b> of gas to drive <b>${km} km</b>. What is its fuel economy in L/100 km?`, q: '', a: [`${L}\\div${km}\\times100=${econ}\\text{ L/100 km}`] };
        },
        () => { // GST on a purchase
          const p = r.int(1500, 9999) / 100;
          return { text: `What is the total with 5% GST on a <b>$${dd(p)}</b> purchase in Alberta?`, q: '', a: [`${dd(p)}\\times1.05${eqOrApprox(p * 1.05)}`] };
        }
      ])(),
      PRG: (r) => r.pick([
        () => { // markup, then tax
          const cost = r.int(20, 240), rate = r.pick([25, 30, 40, 45, 50, 60, 75]), m = 1 + rate / 100, retail = rnd(cost * m, 2), tot = retail * 1.05;
          return { text: `A store pays <b>$${dd(cost)}</b> for a ${r.pick(ITEMS)} and marks it up <b>${rate}%</b>. Find the retail price, then the total with 5% GST in Alberta.`, q: '',
            a: [`${cost}\\times${m.toFixed(2)}=\\$${dd(retail)}`, `${dd(retail)}\\times1.05${eqOrApprox(tot)}`] };
        },
        () => { // sale, then tax
          const p = r.pick([40, 48, 60, 64, 80, 96, 120, 150, 180]), off = r.pick([15, 20, 25, 30, 40]), m = 1 - off / 100, sale = rnd(p * m, 2), tot = sale * 1.05;
          return { text: `A <b>$${dd(p)}</b> ${r.pick(ITEMS)} is <b>${off}% off</b>. Find the sale price, then the total with 5% GST in Calgary.`, q: '',
            a: [`${p}\\times${m.toFixed(2)}=\\$${dd(sale)}`, `${dd(sale)}\\times1.05${eqOrApprox(tot)}`] };
        },
        () => { // compare two sizes per 100 g, one in kg
          const what = r.pick(['rice', 'flour', 'oats', 'coffee', 'pasta']); let g1, kg, p1, p2, v1, v2;
          do { g1 = r.pick([400, 450, 500, 750, 900]); kg = r.pick([1.5, 2, 2.5, 4]); p1 = r.int(199, 899) / 100; p2 = rnd(p1 * kg * 1000 / g1 * (r.int(80, 112) / 100), 2); v1 = rnd(p1 / g1 * 100, 3); v2 = rnd(p2 / (kg * 1000) * 100, 3); } while (Math.abs(v1 - v2) < 0.004);
          return { text: `${what[0].toUpperCase() + what.slice(1)}: <b>${g1} g</b> for <b>$${dd(p1)}</b>, or <b>${kg} kg</b> for <b>$${dd(p2)}</b>. Which is the better buy? Show the price per 100 g.`, q: '',
            a: [`${dd(p1)}\\div${g1}\\times100\\approx\\$${v1.toFixed(3)}`, `${kg}\\text{ kg}=${fmt(kg * 1000).replace(' ', '\\,')}\\text{ g: }${dd(p2)}\\div${fmt(kg * 1000).replace(' ', '\\,')}\\times100\\approx\\$${v2.toFixed(3)}`, `\\text{The ${v1 < v2 ? g1 + ' g' : kg + ' kg'} size is the better buy.}`] };
        }
      ])(),
      MAS: (r) => r.pick([
        () => { // two discounts in a row vs dollars off
          const P = r.pick([60, 80, 100, 120, 150, 200]), d1 = r.pick([20, 25, 30, 40]), d2 = r.pick([10, 15, 20]), m1 = 1 - d1 / 100, m2 = 1 - d2 / 100;
          const a1 = rnd(P * m1, 2), A = a1 * m2, flat = Math.round(P - A) + r.pick([-3, -2, 2, 3]), B = P - flat, one = P * (1 - (d1 + d2) / 100);
          const cheaper = rnd(A, 2) < B ? 'A' : 'B', diff = Math.abs(rnd(A, 2) - B);
          return { text: `A <b>$${dd(P)}</b> ${r.pick(ITEMS)}. Store A: <b>${d1}% off</b>, then an extra <b>${d2}% off</b>. Store B: <b>$${flat} off</b>. Which store is cheaper, and by how much? Is Store A’s deal the same as ${d1 + d2}% off?`, q: '',
            a: [`\\text{A: }${P}\\times${m1.toFixed(2)}=${dd(a1)},\\ ${dd(a1)}\\times${m2.toFixed(2)}${eqOrApprox(A)}`, `\\text{B: }${P}-${flat}=\\$${dd(B)}`, `\\text{Store ${cheaper} is cheaper by }\\$${dd(diff)}`, `${d1 + d2}\\%\\text{ off: }${P}\\times${(1 - (d1 + d2) / 100).toFixed(2)}=\\$${dd(one)}\\text{, not the same}`] };
        },
        () => { // there and back at the bank
          const [nm, cur, b, s] = r.pick([['US dollars', 'USD', 1.33, 1.43], ['euros', 'EUR', 1.47, 1.57], ['British pounds', 'GBP', 1.71, 1.83], ['US dollars', 'USD', 1.34, 1.42]]);
          const A = r.pick([200, 250, 300, 400, 500]), back = r.pick([20, 30, 40, 50, 60]), cost = A * s, got = back * b, paid = back * s;
          return { text: `A bank’s board shows ${nm} (${cur}): <b>We buy ${b}</b>, <b>We sell ${s}</b>. You buy <b>${A} ${cur}</b> for a trip, and sell <b>${back} ${cur}</b> back when you get home. What did the ${A} ${cur} cost? How much do you get back? How much did you lose on the ${back} ${cur}?`, q: '',
            a: [`\\text{Buy at We sell: }${A}\\times${s}=\\$${dd(cost)}\\text{ CAD}`, `\\text{Sell back at We buy: }${back}\\times${b}=\\$${dd(got)}`, `\\text{Lost: }${back}\\times${s}-${dd(got)}=${dd(paid)}-${dd(got)}=\\$${dd(paid - got)}`] };
        }
      ])()
    }
  });
}
