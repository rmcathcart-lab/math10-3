/* Math 10-3 · Unit 7 · Lesson 10 — Unit 7 Review (G2, G4, A1).
 * A review lesson: no practice break; the review assignment is a practice unit test, and (the review is the exception)
 * some of its multiple-choice questions appear as chips in the Full-notes "Spot the trap" explainer.
 * Static figures (geo.js rightTri): the mini triangle in the one-page table, Examples 4, 5, 6, 7 and 9.
 * Explainers (Class view unless marked):
 *   tool    (Full notes: a "which tool?" flowchart that lights up for four booklet examples),
 *   roots   (√70 on twin number lines with the 8×8 and 9×9 tile squares; the 180° bar for the third angle; squares on the
 *            sides of the 9-14 triangle; Example 1),
 *   pyth    (hay bales riding the elevator, then the 225 − 90.25 bar; the shed floor whose corner opens past 90° as the
 *            tape reads 4.06; the 16-63-65 test with an = verdict and stamp; Examples 2 and 3),
 *   ratios  (labels jump onto 12-35-37 and the three SOH CAH TOA cards; the doubled triangle with the same tan; Example 4),
 *   sides   (a SOH CAH TOA chooser that lights the two sides used, then × or ÷; Example 5),
 *   solar   (the panel tilts up to 35°, then TOA, CAH and the Pythagoras check; Example 6),
 *   angles  (the boat launch tilts while tan⁻¹ of drop ÷ 14 updates live; the coulee path with sin⁻¹ and 90° − θ; Example 7),
 *   elev    (Geo.elevation from Nolan's eye to the steeple, plus the eye height; the water tower with the equal angle of
 *            elevation at the dog; Example 8),
 *   solve   (solving △ABC with both checks; the two guy-wire triangles added together; Examples 9 and 10),
 *   traps   (Full notes: practice-test multiple choice, with the mistake behind every wrong choice).
 * Then the Stand Up Break (mixed review like the unit test). geo.js covered everything; the scenes (barn, shed frame,
 * solar panel, boat launch, church, water tower, cell tower) are drawn here. */
import { h, add, box, tex, svgEl, tween, pulse, stamp, stampIn, mountExplainers, Flowchart } from '../blocks.js';
import { Geo, text as gText } from '../geo.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const lerp = (a, b, t) => a + (b - a) * t;
const RAD = Math.PI / 180;
const BLUE = '#1f5bd6', GREEN = '#12805a', RED = '#c93a33', AMBER = '#c27a0e', INK = '#1c2230', BROWN = '#9a6a24', SLATE = '#3a4254';
const OPP = RED, ADJ = BLUE, HYP = BROWN;
/** an absolutely placed box on the stage */
const el = (stage, cls, html, x, y, w, hh) => add(stage, box(h('div', cls, html), w, hh), x, y);
/** a box whose mixed text and maths stay together on centred lines */
const cb = (stage, cls, html, x, y, w, hh) => el(stage, cls + ' u7l10-c', `<div>${html}</div>`, x, y, w, hh);
/** a working line (text and maths on one line), hidden until shown */
const ln = (stage, html, x, y, w, hh = 46, cls = '') => hide(el(stage, 'u7l10-line ' + cls, `<span>${html}</span>`, x, y, w, hh));
/** a small label centred on (cx, cy) (in a 0×0 holder, so a pop's transform never moves it) */
const tag = (stage, html, cx, cy, cls = '') => {
  const holder = add(stage, h('div', ''), cx, cy); holder.style.width = '0'; holder.style.height = '0';
  const e = h('div', 'u7l10-tag ' + cls, html); e.style.position = 'absolute'; e.style.left = '0'; e.style.top = '0'; e.style.translate = '-50% -50%';
  holder.appendChild(e); return e;
};
const show = (c, e, ms = 400) => c.anim(e, [{ opacity: 0 }, { opacity: 1 }], ms);
const fadeOut = (c, e, ms = 250) => c.anim(e, [{ opacity: 1 }, { opacity: 0 }], ms);
const svgOn = (stage, W, H, cls = '') => add(stage, svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u7l10-svg ' + cls }), 0, 0);
const line = (svg, x1, y1, x2, y2, stroke, width = 2.5, extra = {}) => svgEl('line', Object.assign({ x1, y1, x2, y2, stroke, 'stroke-width': width, 'stroke-linecap': 'round' }, extra), svg);
const P = (pts) => pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ');
const arc = (svg, cx, cy, r, a0, a1, colr, width = 2.2) => {   // math degrees, counterclockwise from a0 to a1
  const p = (a) => [cx + r * Math.cos(a * RAD), cy - r * Math.sin(a * RAD)], [x0, y0] = p(a0), [x1, y1] = p(a1);
  return svgEl('path', { d: `M${x0.toFixed(1)} ${y0.toFixed(1)}A${r} ${r} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} ${a1 > a0 ? 0 : 1} ${x1.toFixed(1)} ${y1.toFixed(1)}`, fill: 'none', stroke: colr, 'stroke-width': width }, svg);
};
const rightMark = (svg, x, y, dx, dy, s = 14, colr = INK) => svgEl('path', { d: `M${x + dx * s} ${y}V${y + dy * s}H${x}`, fill: 'none', stroke: colr, 'stroke-width': 2 }, svg);
/** change a rightTri length label, growing away from its side ('start' = to the right, 'end' = to the left) */
const relabel = (lab, txt, anchor = 'middle', size = 20) => {
  if (!lab) return; const hw = String(lab.textContent).length * size * 0.29 + 3, x0 = +lab.getAttribute('x');
  if (anchor !== 'middle') { lab.setAttribute('x', (anchor === 'start' ? x0 - hw : x0 + hw).toFixed(1)); lab.setAttribute('text-anchor', anchor); lab.style.textAnchor = anchor; }
  lab.textContent = txt;
};
const keysHTML = (ks, res) => `<span class="u7l10-keys">${ks.map((k) => (/^[\d.]+$/.test(k) ? `<kbd class="n">${k}</kbd>` : `<kbd>${k}</kbd>`)).join('')}${res ? `<span class="eq">${res}</span>` : ''}</span>`;

/* ================= static figures on the cards ================= */
{
  const fig = (id, o) => { const e = document.getElementById(id); return e ? Geo.rightTri(e, Object.assign({ names: false, size: 18 }, o)) : null; };
  fig('u7l10-mini', { width: 250, height: 140, a: 2, b: 3.6, theta: 'A', pad: 30, size: 16 });
  fig('u7l10-f4', { width: 410, height: 210, a: 12, b: 35, sides: { a: '12', b: '35', c: '37' }, angles: { A: 'θ' } });
  fig('u7l10-f5a', { width: 290, height: 200, b: 12, A: 38, sides: { b: '12 m', a: 'x' }, angles: { A: '38°' } });
  fig('u7l10-f5b', { width: 290, height: 200, a: 5.5, A: 27, sides: { a: '5.5 cm', c: 'x' }, angles: { A: '27°' } });
  fig('u7l10-f5c', { width: 290, height: 200, c: 18, A: 63, sides: { c: '18 ft', b: 'x' }, angles: { A: '63°' } });
  fig('u7l10-f6', { width: 360, height: 250, b: 1.6, A: 35, sides: { b: '1.6 m', a: 'rise', c: 'panel' }, angles: { A: '35°' } });
  fig('u7l10-f7a', { width: 420, height: 130, a: 1.8, b: 14, sides: { a: '1.8 m', b: '14 m' }, angles: { A: 'θ' }, pad: 40 });
  fig('u7l10-f7b', { width: 420, height: 160, a: 60, c: 250, sides: { a: '60 m', c: '250 m' }, angles: { A: 'θ' }, pad: 44 });
  fig('u7l10-f9', { width: 380, height: 300, c: 15, A: 41, names: ['A', 'B', 'C'], sides: { c: '15 cm', a: 'a', b: 'b' }, angles: { A: '41°' } });
}

/* =====================================================================================
 * Full notes: which tool do I need? (a flowchart that lights up)
 * ===================================================================================== */
const TOOL = {
  ex2: { ask: 'Example 2: the elevator is 15 m, its foot is 9.5 m from the wall. Find the height h.', want: 'side', know: false,
    caps: ['We want <b>h</b>, a <b>side</b>.', 'Do we know an acute angle? <b>No</b>: only two sides, 15 m and 9.5 m.', 'Use the <b>Pythagorean theorem</b>. We want a leg, so subtract: h ≈ 11.6 m.'] },
  ex5b: { ask: 'Example 5(b): the side opposite 27° is 5.5 cm. Find the hypotenuse x.', want: 'side', know: true,
    caps: ['We want <b>x</b>, a <b>side</b>.', 'Do we know an acute angle? <b>Yes</b>: 27°.', 'Use <b>SOH CAH TOA</b>. We have opp, we want hyp: SOH, and x is on the bottom, so divide: x ≈ 12.1 cm.'] },
  ex7a: { ask: 'Example 7(a): the launch drops 1.8 m over 14 m. Find the angle θ.', want: 'angle', know: false,
    caps: ['We want <b>θ</b>, an <b>angle</b>.', 'Do we know the other acute angle? <b>No</b>: only two sides.', 'Use an <b>inverse key</b>. opp and adj: θ = tan⁻¹(1.8 ÷ 14) ≈ 7°.'] },
  ex9: { ask: 'Example 9: in △ABC, ∠C = 90° and ∠A = 41°. Find ∠B.', want: 'angle', know: true,
    caps: ['We want <b>∠B</b>, an <b>angle</b>.', 'Do we know the other acute angle? <b>Yes</b>: ∠A = 41°.', 'The two acute angles add to 90°: ∠B = 90° − 41° = 49°. No calculator needed!'] }
};
const tool = {
  title: 'Side or angle? Then: do you know an acute angle?',
  height: 360,
  minW: 960,
  choices: [{ v: 'ex2', label: 'Ex 2 the elevator' }, { v: 'ex5b', label: 'Ex 5(b) 27°, 5.5 cm' }, { v: 'ex7a', label: 'Ex 7(a) the launch' }, { v: 'ex9', label: 'Ex 9 ∠B' }],
  ask: (k) => TOOL[k].ask,
  make(stage, k, ex) {
    const W = ex.W, d = TOOL[k], FW = 960, X = (W - FW) / 2;
    const F = new Flowchart(stage, { x: X, y: 4, width: FW, height: 350,
      nodes: {
        start: { x: 480, y: 34, w: 330, h: 52, html: '<b>What do you want to find?</b>', cls: 'bk-round' },
        side: { x: 245, y: 116, w: 190, h: 48, html: '<b>A side</b>', color: 'blue' },
        ang: { x: 715, y: 116, w: 190, h: 48, html: '<b>An angle</b>', color: 'amber' },
        qs: { x: 245, y: 200, w: 330, h: 54, html: 'Do you know an acute angle?' },
        qa: { x: 715, y: 200, w: 360, h: 54, html: 'Do you know the other acute angle?' },
        py: { x: 115, y: 302, w: 220, h: 78, html: '<b>Pythagoras</b>two sides → the third', color: 'green' },
        tr: { x: 370, y: 302, w: 240, h: 78, html: '<b>SOH CAH TOA</b>label, pick the ratio, × or ÷', color: 'green' },
        sub: { x: 600, y: 302, w: 190, h: 78, html: '<b>90° − θ</b>the other angle', color: 'green' },
        inv: { x: 838, y: 302, w: 240, h: 78, html: '<b>Inverse key</b>two sides: tan⁻¹, sin⁻¹, cos⁻¹', color: 'green' }
      },
      edges: [{ from: 'start', to: 'side', route: 'vhv' }, { from: 'start', to: 'ang', route: 'vhv' }, { from: 'side', to: 'qs' }, { from: 'ang', to: 'qa' },
        { from: 'qs', to: 'py', label: 'no', route: 'vhv' }, { from: 'qs', to: 'tr', label: 'yes', route: 'vhv' }, { from: 'qa', to: 'sub', label: 'yes', route: 'vhv' }, { from: 'qa', to: 'inv', label: 'no', route: 'vhv' }] });
    const a = d.want === 'side' ? 'side' : 'ang', q = d.want === 'side' ? 'qs' : 'qa', end = d.want === 'side' ? (d.know ? 'tr' : 'py') : (d.know ? 'sub' : 'inv');
    return [
      { cap: d.caps[0], run: async (c) => { await F.visit(c, 'start'); await F.go(c, 'start', a); await F.visit(c, a); } },
      { cap: d.caps[1], run: async (c) => { await F.go(c, a, q); await F.visit(c, q); } },
      { cap: d.caps[2], run: async (c) => { await F.go(c, q, end); await F.visit(c, end); } }
    ];
  }
};

/* =====================================================================================
 * 2. Example 1: perfect squares, the 180° rule, squares on the sides
 * ===================================================================================== */
const ASK1 = {
  a: 'Example 1(a): √70 is between which two whole numbers? Estimate it, then find it to the nearest tenth.',
  b: 'Example 1(b): a triangle has angles of 90° and 34°. Find the third angle. What kind of triangle is it?',
  c: 'Example 1(c): a right triangle has legs of 9 cm and 14 cm. Find the hypotenuse.'
};
function rootSteps(stage, ex) {
  const W = ex.W, svg = svgOn(stage, W, 360), X0 = 80, X1 = W - 80, YT = 176, YB = 300;
  const xv = (v) => X0 + (v - 60) / 25 * (X1 - X0);
  // the top line: the numbers 60 to 85
  line(svg, X0 - 10, YT, X1 + 10, YT, INK, 3);
  for (let v = 60; v <= 85; v++) line(svg, xv(v), YT - (v % 5 ? 6 : 10), xv(v), YT + (v % 5 ? 6 : 10), INK, v % 5 ? 1.5 : 2.5);
  [60, 65, 75, 80, 85].forEach((v) => { const t = svgEl('text', { x: xv(v), y: YT + 24, class: 'u7l10-nlab sm' }, svg); t.textContent = v; });
  // the bottom line: square roots, each one right under its square (so the spacing is not even)
  line(svg, X0 - 10, YB, X1 + 10, YB, INK, 3);
  for (let r = 78; r <= 92; r++) { const x = xv(r * r / 100); line(svg, x, YB - (r % 5 ? 6 : 10), x, YB + (r % 5 ? 6 : 10), INK, r % 5 ? 1.5 : 2.5); }
  [8, 8.5, 9].forEach((r) => { const t = svgEl('text', { x: xv(r * r), y: YB + 24, class: 'u7l10-nlab' + (r === 8.5 ? ' sm' : '') }, svg); t.textContent = r; });
  const t1 = svgEl('text', { x: X0 - 10, y: YT - 26, class: 'u7l10-ltitle' }, svg); t1.textContent = 'the number';
  const t2 = svgEl('text', { x: X0 - 10, y: YB - 22, class: 'u7l10-ltitle' }, svg); t2.textContent = 'its square root';
  // tile squares 8 × 8 and 9 × 9 above 64 and 81
  const tiles = (n, v) => {
    const cs = 9, S = n * cs, x = xv(v) - S / 2, y = YT - 30 - S, g = svgEl('g', {}, svg);
    svgEl('rect', { x, y, width: S, height: S, fill: '#fbe7b6', stroke: '#9a6a24', 'stroke-width': 2 }, g);
    let d = ''; for (let i = 1; i < n; i++) d += `M${x + i * cs} ${y}V${y + S}M${x} ${y + i * cs}H${x + S}`;
    svgEl('path', { d, stroke: '#c9a25a', 'stroke-width': 1 }, g);
    const lb = svgEl('text', { x: x + S + 8, y: y + S / 2, class: 'u7l10-nlab', 'text-anchor': 'start' }, g); lb.textContent = `${n}² = ${n * n}`;
    svgEl('circle', { cx: xv(v), cy: YT, r: 7, fill: '#9a6a24' }, g);
    svgEl('line', { x1: xv(v), y1: YT + 8, x2: xv(v), y2: YB - 8, stroke: '#9a6a24', 'stroke-width': 2, 'stroke-dasharray': '6 5' }, g);
    svgEl('circle', { cx: xv(v), cy: YB, r: 7, fill: '#9a6a24' }, g);
    hide(g); return g;
  };
  const s8 = tiles(8, 64), s9 = tiles(9, 81);
  const band = hide(svgEl('g', {}, svg));
  svgEl('rect', { x: xv(64), y: YT - 7, width: xv(81) - xv(64), height: 14, rx: 7, fill: RED, opacity: 0.22 }, band);
  svgEl('rect', { x: xv(64), y: YB - 7, width: xv(81) - xv(64), height: 14, rx: 7, fill: RED, opacity: 0.22 }, band);
  const p70 = hide(svgEl('g', {}, svg));
  svgEl('circle', { cx: xv(70), cy: YT, r: 8, fill: RED }, p70);
  const l70 = svgEl('text', { x: xv(70), y: YT - 22, class: 'u7l10-nlab red' }, p70); l70.textContent = '70';
  const hop = (a, b, lab) => {
    const g = hide(svgEl('g', {}, svg)), xa = xv(a), xb = xv(b), ym = YT + 58;
    svgEl('path', { d: `M${xa} ${YT + 12}Q${(xa + xb) / 2} ${ym + 14} ${xb} ${YT + 12}`, fill: 'none', stroke: AMBER, 'stroke-width': 2.5 }, g);
    const t = svgEl('text', { x: (xa + xb) / 2, y: ym + 2, class: 'u7l10-nlab', fill: AMBER }, g); t.textContent = lab; t.style.fill = AMBER; return g;
  };
  const h6 = hop(64, 70, '6 away'), h11 = hop(70, 81, '11 away');
  const down = hide(svgEl('g', {}, svg));
  svgEl('line', { x1: xv(70), y1: YT + 10, x2: xv(70), y2: YB - 10, stroke: RED, 'stroke-width': 2.5, 'stroke-dasharray': '6 5' }, down);
  svgEl('circle', { cx: xv(70), cy: YB, r: 8, fill: RED }, down);
  const lr = svgEl('text', { x: xv(70), y: YB + 26, class: 'u7l10-nlab red' }, down); lr.textContent = '8.37';
  const LX = xv(64) + 110, L = [ln(stage, 'between <b>8</b> and <b>9</b>, a bit closer to 8', LX, 22, 440),
    ln(stage, keysHTML(['2nd', 'x²', '70', ')', 'ENTER'], '8.3666…'), LX, 22, 440), ln(stage, `${T('\\sqrt{70}\\approx8.4')}`, LX, 70, 300)];
  return [
    { cap: 'Which perfect squares are near 70? <b>8² = 64</b> and <b>9² = 81</b>. Under each number is its square root.', run: async (c) => { await show(c, s8); await show(c, s9); } },
    { cap: '70 is between 64 and 81, so √70 is between <b>8 and 9</b>.', run: async (c) => { await show(c, band); await c.pop(p70); await c.fadeIn(L[0]); } },
    { cap: '70 is <b>6</b> above 64, but <b>11</b> below 81. It is closer to 64, so √70 is <b>a bit closer to 8</b>.', run: async (c) => { await show(c, h6); await show(c, h11); } },
    { cap: `Calculator: <span class="keys"><kbd>2nd</kbd><kbd>x²</kbd></span> 70 <span class="keys"><kbd>)</kbd><kbd>ENTER</kbd></span> gives 8.3666…, so ${T('\\sqrt{70}\\approx8.4')}. Close to our estimate ✓`,
      run: async (c) => { await fadeOut(c, L[0]); await show(c, down); await c.fadeIn(L[1]); await c.fadeIn(L[2]); } }
  ];
}
function angleSumSteps(stage, ex) {
  const W = ex.W, TW = 440;
  const Tr = Geo.rightTri(stage, { x: 10, y: 20, width: TW, height: 320, A: 34, b: 6, names: false, angles: { A: '34°', B: '' }, size: 20 });
  const cen = [(Tr.V.A[0] + Tr.V.B[0] + Tr.V.C[0]) / 3, (Tr.V.A[1] + Tr.V.B[1] + Tr.V.C[1]) / 3];
  const qB = tag(stage, '?', 10 + lerp(Tr.V.B[0], cen[0], 0.42), 20 + lerp(Tr.V.B[1], cen[1], 0.42), 'red lg');
  tag(stage, '90°', 10 + Tr.V.C[0] - 30, 20 + Tr.V.C[1] - 30, 'sm');
  const BX = 500, BW = W - 530, sc = BW / 180, BY = 120, parts = [[90, '#9aa0ab', '90°'], [34, '#b9bec7', '34°'], [56, RED, '56°']];
  const frame = hide(el(stage, 'u7l10-bar', '', BX, BY, BW, 56));
  const top = hide(tag(stage, '180° in all', BX + BW / 2, BY - 22, 'lg'));
  const segs = []; let acc = 0;
  parts.forEach(([v, colr, lab], i) => { const s = el(stage, 'u7l10-bar', lab, BX + acc * sc, BY, v * sc, 56); s.style.background = colr; s.style.color = i === 2 ? '#fff' : INK; hide(s); segs.push(s); acc += v; });
  const L = [ln(stage, `${T('180^\\circ-90^\\circ-34^\\circ=56^\\circ')}`, BX, 210, BW), ln(stage, `Check: ${T('90^\\circ+34^\\circ+56^\\circ=180^\\circ')} ✓`, BX, 262, BW, 46, 'sm')];
  const st = hide(stamp(stage, 'Right triangle', { ok: true, x: BX + BW / 2, y: 296, size: 'lg' }));
  return [
    { cap: 'The angles of <b>any</b> triangle add to <b>180°</b>.', run: async (c) => { await show(c, frame); await c.pop(top); } },
    { cap: 'Take away the two angles you know: 180° − 90° − 34°.', run: async (c) => { await show(c, segs[0], 300); await show(c, segs[1], 300); } },
    { cap: `The third angle is <b>56°</b>.`, run: async (c) => { await c.pop(segs[2]); await c.fadeIn(L[0]); qB.textContent = '56°'; await pulse(c, qB, 1.2); } },
    { cap: 'It has a <b>90°</b> angle, so it is a <b>right triangle</b>. Check: the three angles add to 180° ✓', run: async (c) => { await c.fadeIn(L[1]); st.style.opacity = 1; await stampIn(c, st); } }
  ];
}
function hypSteps(stage, ex) {
  const W = ex.W;
  const Tr = Geo.rightTri(stage, { x: 0, y: 0, width: 520, height: 360, a: 9, b: 14, names: false, sides: { a: '9', b: '14', c: 'c' }, roomForSquares: true, size: 18 });
  const X = 540, L = [ln(stage, `${T('c^2=9^2+14^2')}`, X, 40, 420), ln(stage, `${T('c^2=81+196=277')}`, X, 96, 420),
    ln(stage, `${T('c=\\sqrt{277}\\approx16.6')} cm`, X, 168, 420), ln(stage, 'Check: 16.6 is longer than 14 ✓', X, 230, 420, 46, 'sm'), ln(stage, '<span class="u7l10-small">the hypotenuse is the longest side</span>', X, 270, 420, 40)];
  const st = hide(stamp(stage, '✓', { ok: true, x: W - 70, y: 186 }));
  return [
    { cap: 'The legs are 9 cm and 14 cm. The <b>hypotenuse</b>, c, is across from the right angle.', run: (c) => Tr.highlight(c, 'c') },
    { cap: 'Build a square on each side: <b>9² = 81</b> and <b>14² = 196</b>.', run: async (c) => { await Tr.showSquares(c, 'grid'); await c.fadeIn(L[0]); } },
    { cap: `The two small squares fill the big one: ${T('c^2=81+196=277')}.`, run: (c) => c.fadeIn(L[1]) },
    { cap: `${T('c=\\sqrt{277}\\approx16.6')} cm. Check: longer than 14 ✓`, run: async (c) => { await c.fadeIn(L[2]); await c.fadeIn(L[3]); await c.fadeIn(L[4]); st.style.opacity = 1; await stampIn(c, st); } }
  ];
}
const roots = {
  title: 'Perfect squares, 180°, squares on the sides',
  height: 360,
  minW: 960,
  choices: [{ v: 'a', label: 'Ex 1(a) √70' }, { v: 'b', label: 'Ex 1(b) third angle' }, { v: 'c', label: 'Ex 1(c) legs 9 and 14' }],
  ask: (k) => ASK1[k],
  make: (stage, k, ex) => (k === 'a' ? rootSteps(stage, ex) : k === 'b' ? angleSumSteps(stage, ex) : hypSteps(stage, ex))
};

/* =====================================================================================
 * 2. Examples 2 and 3: subtract for a leg; the shed floor diagonal; the right triangle test
 * ===================================================================================== */
const ASK23 = {
  hay: 'Example 2: the elevator is 15 m long; its foot is 9.5 m from the barn wall. How high is the hayloft door?',
  shed: 'Example 3(a): a shed floor 2.4 m by 3.2 m. What should the diagonal be? Gita measures 4.06 m. Are the corners square?',
  test: 'Example 3(b): is a triangle with sides 16 cm, 63 cm and 65 cm a right triangle?'
};
function haySteps(stage, ex) {
  const W = ex.W, svg = svgOn(stage, W, 380), s = 24, GY = 345, XB = 50, XW = XB + 9.5 * s, hgt = Math.sqrt(15 * 15 - 9.5 * 9.5), YT = GY - hgt * s;
  svgEl('rect', { x: XW, y: 20, width: 130, height: GY - 20, fill: '#ece7dd' }, svg);
  svgEl('path', { d: `M${XW} ${GY}V20H${XW + 130}`, fill: 'none', stroke: INK, 'stroke-width': 3 }, svg);
  svgEl('rect', { x: XW + 4, y: YT - 40, width: 30, height: 40, fill: '#fff', stroke: INK, 'stroke-width': 2 }, svg);
  gText(svg, XW + 72, YT - 20, 'loft door', { size: 15, color: '#6a7182' });
  line(svg, 10, GY, XW + 140, GY, '#8a6f4d', 3);
  line(svg, XB, GY, XW, YT, '#5c6470', 9);
  // bales riding up the elevator
  const ux = (XW - XB) / (15 * s), uy = (YT - GY) / (15 * s), nx = uy, ny = -ux, ang = Math.atan2(YT - GY, XW - XB) / RAD;
  const bales = [0, 0.33, 0.66].map(() => { const g = svgEl('g', {}, svg); svgEl('rect', { x: -13, y: -8, width: 26, height: 15, rx: 2, fill: '#e2c35f', stroke: '#9b7a1d', 'stroke-width': 1.5 }, g); return g; });
  const placeBales = (u0) => bales.forEach((g, i) => { const u = (u0 + i / 3) % 1, d = u * 15 * s, x = XB + ux * d + nx * 11, y = GY + uy * d + ny * 11; g.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${ang.toFixed(1)})`); g.style.opacity = u > 0.92 ? 0 : 1; });
  placeBales(0.1);
  // the right triangle
  const tri = hide(svgEl('g', {}, svg));
  line(tri, XB, GY, XW, YT, HYP, 5, { opacity: 0.8 }); line(tri, XB, GY, XW, GY, ADJ, 5); line(tri, XW, GY, XW, YT, OPP, 5);
  rightMark(tri, XW, GY, -1, -1, 16);
  const l15 = hide(tag(stage, '15 m (hyp)', (XB + XW) / 2 - 56, (GY + YT) / 2 - 16, 'brown')), l95 = hide(tag(stage, '9.5 m', (XB + XW) / 2, GY + 18, 'blue')), lh = hide(tag(stage, 'h', XW + 60, (GY + YT) / 2 + 20, 'red lg'));
  const X = 470, BW = W - X - 20, BY = 182, sc = BW / 225;
  const L = [ln(stage, 'The hypotenuse is <b>15 m</b>. We want a <b>leg</b>.', X, 14, BW), ln(stage, `${T('h^2=15^2-9.5^2')}`, X, 70, BW), ln(stage, `${T('h^2=225-90.25=134.75')}`, X, 118, BW),
    ln(stage, `${T('h=\\sqrt{134.75}\\approx11.6')} m`, X, 262, BW), ln(stage, 'Check: 11.6 &lt; 15 ✓ (a leg is shorter than the hyp)', X, 310, BW, 46, 'sm')];
  const bFull = hide(el(stage, 'u7l10-bar', `${T('15^2=225')}`, X, BY, BW, 52)); bFull.style.background = '#f3e6cf';
  const bCut = hide(el(stage, 'u7l10-bar', `${T('9.5^2=90.25')}`, X, BY, 90.25 * sc, 52)); bCut.style.background = '#cfe0fb';
  const bLeft = hide(el(stage, 'u7l10-bar', `${T('h^2=134.75')}`, X + 90.25 * sc, BY, 134.75 * sc, 52)); bLeft.style.background = '#f6d0cc';
  const st = hide(stamp(stage, '✓', { ok: true, x: W - 56, y: 278 }));
  return [
    { cap: 'The elevator, the barn wall and the ground make a <b>right triangle</b>. The right angle is at the foot of the wall.', run: async (c) => { await tween(c, 1500, (t) => { placeBales(0.1 + t * 0.6); }); await show(c, tri); await c.fadeIn(l95); await c.pop(lh); } },
    { cap: 'The elevator is across from the right angle: it is the <b>hypotenuse</b>, 15 m. We want a <b>leg</b>, so we <b>subtract</b>.', run: async (c) => { await c.pop(l15); await c.fadeIn(L[0]); await c.fadeIn(L[1]); } },
    { cap: `${T('h^2=15^2-9.5^2=225-90.25=134.75')}`, run: async (c) => { await show(c, bFull); await show(c, bCut); await c.anim(bCut, [{ opacity: 1 }, { opacity: 0.3 }], 600); await show(c, bLeft); await c.fadeIn(L[2]); } },
    { cap: `${T('h=\\sqrt{134.75}\\approx11.6')} m. Check: a leg must be shorter than the hypotenuse, and 11.6 &lt; 15 ✓`, run: async (c) => { await c.fadeIn(L[3]); lh.textContent = '11.6 m'; await pulse(c, lh, 1.15); await c.fadeIn(L[4]); st.style.opacity = 1; await stampIn(c, st); } }
  ];
}
function shedSteps(stage, ex) {
  const W = ex.W, svg = svgOn(stage, W, 380), s = 108, A = [76, 336], LB = 3.2 * s, LS = 2.4 * s;
  const frame = svgEl('polygon', { fill: '#fbf3e4', stroke: '#b07a3a', 'stroke-width': 12, 'stroke-linejoin': 'miter' }, svg);
  const tri = svgEl('polygon', { fill: '#cfe0fb', opacity: 0 }, svg);
  const tape = svgEl('line', { stroke: '#e0b52f', 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0 }, svg);
  const marks = svgEl('g', {}, svg); hide(marks);
  const tapeLab = hide(tag(stage, '', 0, 0, ''));
  tapeLab.className = 'u7l10-tape';
  const angTag = hide(tag(stage, 'about 92°', A[0] + 64, A[1] - 52, 'red'));
  const note = hide(tag(stage, '(the lean is drawn bigger than it is)', A[0] + LB / 2 + 30, 20, 'sm'));
  let vis = 90;
  const draw = (vAng, reading) => {
    vis = vAng; const u = [Math.cos(vAng * RAD), -Math.sin(vAng * RAD)], B = [A[0] + LB, A[1]], D = [A[0] + u[0] * LS, A[1] + u[1] * LS], C = [B[0] + u[0] * LS, B[1] + u[1] * LS];
    frame.setAttribute('points', P([A, B, C, D])); tri.setAttribute('points', P([A, B, D]));
    tape.setAttribute('x1', B[0]); tape.setAttribute('y1', B[1]); tape.setAttribute('x2', D[0]); tape.setAttribute('y2', D[1]);
    tapeLab.parentNode.style.left = ((B[0] + D[0]) / 2 + 26) + 'px'; tapeLab.parentNode.style.top = ((B[1] + D[1]) / 2 - 22) + 'px';
    if (reading != null) tapeLab.textContent = reading.toFixed(2) + ' m';
    marks.innerHTML = '';
    if (Math.abs(vAng - 90) < 0.01) [[A, 1, -1], [B, -1, -1], [C, -1, 1], [D, 1, 1]].forEach(([p, dx, dy]) => rightMark(marks, p[0] + dx * 8, p[1] + dy * 8, dx, dy, 14));
  };
  draw(90, 4);
  gText(svg, A[0] + LB / 2, A[1] + 26, '3.2 m', { size: 19 });
  const sideL = gText(svg, A[0] - 52, A[1] - LS / 2, '2.4 m', { size: 19 });
  void sideL;
  const X = 520, BW = W - X - 16;
  const L = [ln(stage, `${T('2.4^2+3.2^2=5.76+10.24=16')}`, X, 30, BW), ln(stage, `${T('\\sqrt{16}=4')}: the diagonal should be <b>4.00 m</b>`, X, 84, BW),
    ln(stage, 'Gita measures <b>4.06 m</b>: too long', X, 150, BW), ln(stage, 'a longer diagonal: the corner is <b>wider</b> than 90°', X, 200, BW, 46, 'sm')];
  const st = hide(stamp(stage, 'Not square', { ok: false, x: X + BW / 2, y: 300, size: 'lg' }));
  return [
    { cap: 'Square corners make two <b>right triangles</b>. The <b>diagonal</b> is the hypotenuse of each.', run: async (c) => { await c.fadeIn(marks); await show(c, tri); await c.anim(tri, [{ opacity: 0 }, { opacity: 0.55 }], 300); tri.style.opacity = 0.55; } },
    { cap: `${T('2.4^2+3.2^2=5.76+10.24=16')} and ${T('\\sqrt{16}=4')}. The diagonal should be <b>4.00 m</b>.`, run: async (c) => { await c.fadeIn(L[0]); await c.fadeIn(L[1]); tape.style.opacity = 1; await c.anim(tape, [{ opacity: 0 }, { opacity: 1 }], 400); await c.pop(tapeLab); } },
    { cap: 'Gita measures <b>4.06 m</b>: too long. A longer diagonal means the corner has opened up a little past 90°.',
      run: async (c) => { await c.fadeIn(L[2]); marks.style.opacity = 0; tri.style.opacity = 0.3;
        await tween(c, 1200, (t) => { const tr = (90 + 1.8 * t) * RAD; draw(90 + 6 * t, Math.sqrt(16 - 15.36 * Math.cos(tr))); });
        await c.fadeIn(L[3]); await c.pop(angTag); await c.fadeIn(note); } },
    { cap: 'So the corners are <b>not square</b>: the angle is a little <b>more</b> than 90° (about 92°).', run: async (c) => { st.style.opacity = 1; await stampIn(c, st); } }
  ];
}
function testSteps(stage, ex) {
  const W = ex.W, svg = svgOn(stage, W, 380), C = [420, 300], A = [20, 300], B = [420, 300 - 16 / 63 * 400];
  svgEl('polygon', { points: P([A, B, C]), fill: '#f3efe6', stroke: 'none' }, svg);
  const sAB = line(svg, A[0], A[1], B[0], B[1], INK, 3.4), sAC = line(svg, A[0], A[1], C[0], C[1], INK, 3.4), sBC = line(svg, B[0], B[1], C[0], C[1], INK, 3.4);
  void sAC; void sBC;
  const hl = hide(line(svg, A[0], A[1], B[0], B[1], HYP, 13, { opacity: 0.35 }));
  const rm = hide(rightMark(svg, C[0], C[1], -1, -1, 17));
  tag(stage, '63 cm', (A[0] + C[0]) / 2, C[1] + 22); tag(stage, '16 cm', C[0] + 40, (B[1] + C[1]) / 2); const l65 = tag(stage, '65 cm', (A[0] + B[0]) / 2 - 12, (A[1] + B[1]) / 2 - 26);
  const X = 520, BW = (W - X - 80) / 2;
  const bl = el(stage, 'u7l10-cmp', `<div><small>the two shorter sides</small>${T('16^2+63^2')}<br><span class="u7l10-v"></span></div>`, X, 30, BW + 30, 150);
  const br = el(stage, 'u7l10-cmp', `<div><small>the longest side</small>${T('65^2')}<br><span class="u7l10-v"></span></div>`, X + BW + 80, 30, BW - 30, 150);
  const eq = hide(cb(stage, 'u7l10-eqs', '=', X + BW + 30, 70, 50, 70));
  const L = [ln(stage, `${T('256+3\\,969=4\\,225')}`, X, 200, W - X - 10), ln(stage, `${T('65^2=4\\,225')}`, X, 250, W - X - 10)];
  const st = hide(stamp(stage, 'Right triangle', { ok: true, x: X + (W - X) / 2, y: 322, size: 'lg' }));
  const vl = bl.querySelector('.u7l10-v'), vr = br.querySelector('.u7l10-v');
  void sAB;
  return [
    { cap: 'The <b>longest</b> side is 65 cm. If this is a right triangle, 65 is the hypotenuse, c.', run: async (c) => { await show(c, hl); await pulse(c, l65, 1.2); } },
    { cap: `Square the two shorter sides and add: ${T('16^2+63^2=256+3\\,969=4\\,225')}.`, run: async (c) => { vl.innerHTML = T('=4\\,225'); await c.pop(bl); await c.fadeIn(L[0]); } },
    { cap: `Square the longest side: ${T('65^2=4\\,225')}.`, run: async (c) => { vr.innerHTML = T('=4\\,225'); await c.pop(br); await c.fadeIn(L[1]); } },
    { cap: 'The two are <b>equal</b>, so yes: it is a right triangle. The right angle is across from the 65 cm side.', run: async (c) => { await c.pop(eq); await show(c, rm); st.style.opacity = 1; await stampIn(c, st); } }
  ];
}
const pyth = {
  title: 'Subtract for a leg; test with a² + b² = c²',
  height: 380,
  minW: 960,
  choices: [{ v: 'hay', label: 'Ex 2 the hay elevator' }, { v: 'shed', label: 'Ex 3(a) the shed floor' }, { v: 'test', label: 'Ex 3(b) 16, 63, 65' }],
  ask: (k) => ASK23[k],
  make: (stage, k, ex) => (k === 'hay' ? haySteps(stage, ex) : k === 'shed' ? shedSteps(stage, ex) : testSteps(stage, ex))
};

/* =====================================================================================
 * 3. Example 4: label from θ, the three ratios; the doubled triangle
 * ===================================================================================== */
const ratios = {
  title: 'Label from θ, then SOH CAH TOA',
  height: 400,
  minW: 960,
  choices: [{ v: 'a', label: 'Ex 4(a) 12, 35, 37' }, { v: 'b', label: 'Ex 4(b) the bigger triangle' }],
  ask: (k) => (k === 'a' ? 'Example 4(a): label opp, adj and hyp for θ. Write sin θ, cos θ and tan θ as fractions and as decimals (4 places).' : 'Example 4(b): a bigger triangle has the same angle θ and sides 24, 70 and 74. Find its tan θ. What do you notice? Why?'),
  make(stage, k, ex) {
    const W = ex.W;
    if (k === 'a') {
      const Tr = Geo.rightTri(stage, { x: 0, y: 30, width: 500, height: 320, a: 12, b: 35, names: false, sides: { a: '12', b: '35', c: '37' }, angles: { A: 'θ' }, size: 20 });
      const X = 560, CW = W - X - 10, rows = [
        ['SOH', '\\sin\\theta=\\dfrac{\\text{opp}}{\\text{hyp}}=\\dfrac{12}{37}\\approx0.3243', OPP, ['opp', 'hyp']],
        ['CAH', '\\cos\\theta=\\dfrac{\\text{adj}}{\\text{hyp}}=\\dfrac{35}{37}\\approx0.9459', ADJ, ['adj', 'hyp']],
        ['TOA', '\\tan\\theta=\\dfrac{\\text{opp}}{\\text{adj}}=\\dfrac{12}{35}\\approx0.3429', GREEN, ['opp', 'adj']]];
      const cards = rows.map(([n, tx, colr], i) => { const e = hide(el(stage, 'u7l10-rat', `<b>${n}</b><span>${T(tx)}</span>`, X, 20 + i * 118, CW, 100)); e.style.setProperty('--rc', colr); return e; });
      const hl = async (c, roles) => { Tr.clearHighlight(); for (const r of roles) await Tr.highlight(c, r); };
      return [
        { cap: 'Stand at θ. <b>hyp</b> = 37 is across from the right angle, <b>opp</b> = 12 is across from θ, and <b>adj</b> = 35 is next to θ.', run: (c) => Tr.setTheta(c, 'A') },
        { cap: `<b>SOH</b>: ${T('\\sin\\theta=\\dfrac{12}{37}\\approx0.3243')}`, run: async (c) => { await hl(c, rows[0][3]); await c.fadeIn(cards[0]); } },
        { cap: `<b>CAH</b>: ${T('\\cos\\theta=\\dfrac{35}{37}\\approx0.9459')}`, run: async (c) => { await hl(c, rows[1][3]); await c.fadeIn(cards[1]); } },
        { cap: `<b>TOA</b>: ${T('\\tan\\theta=\\dfrac{12}{35}\\approx0.3429')}. Each ratio uses <b>two</b> sides.`, run: async (c) => { await hl(c, rows[2][3]); await c.fadeIn(cards[2]); } }
      ];
    }
    const th = Math.atan2(12, 35) / RAD;
    const R = Geo.similarRights(stage, { x: 0, y: 0, width: 560, height: 250, theta: th, sizes: [35, 70], ratios: ['opp/adj'], slider: false, calc: false, dp: 0, rdp: 4 });
    const X = 590, BW = W - X - 10;
    const L = [ln(stage, 'small: 12, 35, 37', X, 20, BW), ln(stage, 'big: 24, 70, 74: every side <b>× 2</b>', X, 70, BW),
      ln(stage, `${T('\\tan\\theta=\\dfrac{24}{70}\\approx0.3429')}`, X, 140, BW, 64), ln(stage, `the same as ${T('\\dfrac{12}{35}')} ✓`, X, 214, BW, 64),
      ln(stage, '<span class="u7l10-small">a trig ratio depends only on the angle</span>', X, 300, BW, 40)];
    return [
      { cap: 'The bigger triangle has the same angle θ. Its sides are 24, 70 and 74: <b>every side is doubled</b>.', run: async (c) => { await R.grow(c); await c.fadeIn(L[0]); await c.fadeIn(L[1]); } },
      { cap: `${T('\\tan\\theta=\\dfrac{24}{70}\\approx0.3429')}, and ${T('\\dfrac{12}{35}\\approx0.3429')}. <b>The same!</b>`, run: async (c) => { await R.highlightCol(c, 'opp/adj'); await c.fadeIn(L[2]); await c.fadeIn(L[3]); } },
      { cap: 'The triangles are <b>similar</b>, so the ratios do not change. A trig ratio depends <b>only on the angle</b>.', run: async (c) => { await R.name(c, 'opp/adj'); await c.fadeIn(L[4]); } }
    ];
  }
};

/* =====================================================================================
 * 3. Example 5: know, want, pick the ratio, multiply or divide
 * ===================================================================================== */
const SIDE = {
  a: { ask: 'Example 5(a): the side next to the 38° angle is 12 m. Find x, the side across from 38°.', A: 38, tri: { b: 12 }, sides: { b: '12 m', a: 'x' }, have: 'adj', haveV: '12 m', want: 'opp', ratio: 'TOA',
    eq: '\\tan38^\\circ=\\dfrac{x}{12}', top: true, solve: 'x=12\\times\\tan38^\\circ', keys: ['12', '×', 'tan', '38', ')', 'ENTER'], raw: '9.375…', ans: '9.4', unit: 'm', check: '' },
  b: { ask: 'Example 5(b): the side across from the 27° angle is 5.5 cm. Find x, the hypotenuse.', A: 27, tri: { a: 5.5 }, sides: { a: '5.5 cm', c: 'x' }, have: 'opp', haveV: '5.5 cm', want: 'hyp', ratio: 'SOH',
    eq: '\\sin27^\\circ=\\dfrac{5.5}{x}', top: false, solve: 'x=5.5\\div\\sin27^\\circ', keys: ['5.5', '÷', 'sin', '27', ')', 'ENTER'], raw: '12.114…', ans: '12.1', unit: 'cm', check: 'Check: the hyp is the longest side ✓' },
  c: { ask: 'Example 5(c): the hypotenuse is 18 ft and one angle is 63°. Find x, the side next to the 63° angle.', A: 63, tri: { c: 18 }, sides: { c: '18 ft', b: 'x' }, have: 'hyp', haveV: '18 ft', want: 'adj', ratio: 'CAH',
    eq: '\\cos63^\\circ=\\dfrac{x}{18}', top: true, solve: 'x=18\\times\\cos63^\\circ', keys: ['18', '×', 'cos', '63', ')', 'ENTER'], raw: '8.171…', ans: '8.2', unit: 'ft', check: 'Check: shorter than 18 ✓' }
};
const sides = {
  title: 'Know, want, pick the ratio',
  height: 380,
  minW: 960,
  choices: [{ v: 'a', label: 'Ex 5(a) 38°, 12 m' }, { v: 'b', label: 'Ex 5(b) 27°, 5.5 cm' }, { v: 'c', label: 'Ex 5(c) 63°, 18 ft' }],
  ask: (k) => SIDE[k].ask,
  make(stage, k, ex) {
    const W = ex.W, d = SIDE[k], side = { a: 'a', b: 'b', c: 'c' };
    const Tr = Geo.rightTri(stage, Object.assign({ x: 0, y: 10, width: 410, height: 360, A: d.A, names: false, sides: d.sides, thetaLabel: d.A + '°', angles: { A: d.A + '°' }, size: 20 }, d.tri));
    const X = 480, CW = (W - X - 20) / 3, cardDef = [['SOH', 'sin = opp ÷ hyp', ['opp', 'hyp']], ['CAH', 'cos = adj ÷ hyp', ['adj', 'hyp']], ['TOA', 'tan = opp ÷ adj', ['opp', 'adj']]];
    const cards = cardDef.map(([n, t], i) => el(stage, 'u7l10-sct', `<div><b>${n}</b><span>${t}</span></div>`, X + i * (CW + 10), 6, CW, 78));
    const BW = W - X - 10;
    const L = [ln(stage, `${T(d.eq)}`, X, 104, BW, 60), ln(stage, `${T(d.solve)} <span class="u7l10-small">&nbsp;${d.top ? 'x on top: multiply' : 'x on the bottom: divide'}</span>`, X, 172, BW, 50),
      ln(stage, keysHTML(d.keys, d.raw), X, 232, BW, 44), ln(stage, `${T('x\\approx' + d.ans)} ${d.unit}`, X, 284, BW, 46), ln(stage, d.check, X, 330, BW, 40, 'sm')];
    const unk = Object.keys(d.sides).find((s) => d.sides[s] === 'x');
    void side;
    return [
      { cap: `Label the sides from the <b>${d.A}°</b> angle: opp is across from it, hyp is across from the right angle, adj is next to it.`, run: (c) => Tr.setTheta(c, 'A') },
      { cap: `We <b>have</b> ${d.have} (${d.haveV}) and <b>want</b> ${d.want} (x). The ratio with ${d.have} and ${d.want} is <b>${d.ratio}</b>.`,
        run: async (c) => { await Tr.highlight(c, d.have); await Tr.highlight(c, d.want); cards.forEach((e, i) => { e.classList.toggle('on', cardDef[i][0] === d.ratio); e.classList.toggle('dim', cardDef[i][0] !== d.ratio); }); await pulse(c, cards[cardDef.findIndex((q) => q[0] === d.ratio)], 1.08); } },
      { cap: `Substitute: ${T(d.eq)}.`, run: (c) => c.fadeIn(L[0]) },
      { cap: d.top ? `x is on <b>top</b>, so <b>multiply</b>: ${T(d.solve)}.` : `x is on the <b>bottom</b>, so <b>divide</b>: ${T(d.solve)}.`, run: (c) => c.fadeIn(L[1]) },
      { cap: `On the calculator: x ≈ <b>${d.ans} ${d.unit}</b>.${d.check ? ' ' + d.check : ''}`,
        run: async (c) => { await c.fadeIn(L[2]); await c.fadeIn(L[3]); if (d.check) await c.fadeIn(L[4]); if (Tr.tags[d.want]) Tr.tags[d.want].style.opacity = 0; const lab = Tr.valLabels[unk]; if (lab) { relabel(lab, d.ans + ' ' + d.unit, { a: 'start', b: 'middle', c: 'end' }[unk]); await pulse(c, lab, 1.2); } } }
    ];
  }
};

/* =====================================================================================
 * 3. Example 6: the solar panel tilts up; TOA, CAH, then Pythagoras
 * ===================================================================================== */
const solar = {
  title: 'Tilt the panel, then find the rise and the length',
  height: 380,
  minW: 960,
  ask: 'Example 6: the panel is tilted at 35° and covers a horizontal distance of 1.6 m. Find (a) the rise, (b) the panel length, (c) check (b) with Pythagoras.',
  make(stage, v, ex) {
    const W = ex.W, svg = svgOn(stage, W, 380), s = 190, P0 = [70, 330], Lm = 1.6 / Math.cos(35 * RAD), Lp = Lm * s;
    // sun
    const sun = svgEl('g', {}, svg); svgEl('circle', { cx: 440, cy: 56, r: 22, fill: '#f6c445' }, sun);
    for (let i = 0; i < 8; i++) { const a = i * 45 * RAD; line(sun, 440 + 30 * Math.cos(a), 56 + 30 * Math.sin(a), 440 + 40 * Math.cos(a), 56 + 40 * Math.sin(a), '#e8a01e', 3); }
    line(svg, 20, P0[1], 470, P0[1], '#8a6f4d', 3);
    const base = line(svg, P0[0], P0[1], P0[0] + Lp, P0[1], ADJ, 4, { 'stroke-dasharray': '9 6' });
    const strut = line(svg, P0[0] + Lp, P0[1], P0[0] + Lp, P0[1], OPP, 4);
    const panel = svgEl('g', {}, svg); panel.style.transformBox = 'view-box'; panel.style.transformOrigin = '0 0';
    svgEl('rect', { x: 0, y: -14, width: Lp, height: 14, fill: '#2b4f8f', stroke: '#16305e', 'stroke-width': 2 }, panel);
    let gd = ''; for (let i = 1; i < 8; i++) gd += `M${(Lp * i / 8).toFixed(1)} -14V0`; svgEl('path', { d: gd + 'M0 -7H' + Lp.toFixed(1), stroke: '#8fb0e6', 'stroke-width': 1 }, panel);
    const hypLine = hide(line(svg, P0[0], P0[1], P0[0], P0[1], HYP, 4));
    const rm = hide(svgEl('g', {}, svg)), aArc = hide(svgEl('g', {}, svg));
    const labs = { adj: hide(tag(stage, '1.6 m', P0[0] + 152, P0[1] + 20, 'blue')), opp: hide(tag(stage, 'rise', P0[0] + 304 + 46, P0[1] - 106, 'red')), hyp: hide(tag(stage, 'panel', P0[0] + 120, P0[1] - 128, 'brown')) };
    const setA = (deg) => {
      const r = deg * RAD, x = P0[0] + Lp * Math.cos(r), y = P0[1] - Lp * Math.sin(r);
      panel.setAttribute('transform', `translate(${P0[0]} ${P0[1]}) rotate(${-deg})`);
      base.setAttribute('x2', x.toFixed(1)); strut.setAttribute('x1', x.toFixed(1)); strut.setAttribute('x2', x.toFixed(1)); strut.setAttribute('y2', y.toFixed(1));
      hypLine.setAttribute('x2', x.toFixed(1)); hypLine.setAttribute('y2', y.toFixed(1));
    };
    setA(0);
    const X = 500, BW = W - X - 10;
    const L = [ln(stage, `(a) ${T('\\text{rise}=1.6\\times\\tan35^\\circ')}`, X, 6, BW), ln(stage, `${T('\\approx1.12')}, so about <b>1.1 m</b>`, X + 40, 52, BW - 40),
      ln(stage, `(b) ${T('\\cos35^\\circ=\\dfrac{1.6}{x}')}`, X, 108, BW, 60), ln(stage, `${T('x=1.6\\div\\cos35^\\circ\\approx2.0')} m`, X + 40, 168, BW - 40),
      ln(stage, `(c) ${T('\\sqrt{1.6^2+1.1203^2}=\\sqrt{3.8151}')}`, X, 232, BW), ln(stage, `${T('\\approx1.95')}, about 2.0 m ✓`, X + 40, 280, BW - 40),
      ln(stage, '<span class="u7l10-small">use the unrounded rise, 1.1203…</span>', X + 40, 326, BW - 40, 36)];
    const st = hide(stamp(stage, '✓', { ok: true, x: W - 50, y: 292 }));
    return [
      { cap: 'The panel tilts up to <b>35°</b>. Seen from the side, the panel, the ground line and the support make a <b>right triangle</b>.',
        run: async (c) => { await tween(c, 1300, (t) => { setA(35 * t); }); svgEl('path', { d: `M${P0[0] + 304 - 15} ${P0[1]}V${P0[1] - 15}H${P0[0] + 304}`, fill: 'none', stroke: INK, 'stroke-width': 2 }, rm);
          arc(aArc, P0[0], P0[1], 62, 0, 35, AMBER); gText(aArc, P0[0] + 92, P0[1] - 26, '35°', { size: 19, color: AMBER }); await show(c, rm); await show(c, aArc); for (const r of ['adj', 'opp', 'hyp']) await c.fadeIn(labs[r]); } },
      { cap: '(a) For the 35° angle, 1.6 m is <b>adj</b> and the rise is <b>opp</b>: <b>TOA</b>.', run: async (c) => { labs.adj.textContent = '1.6 m (adj)'; labs.opp.textContent = 'rise (opp)'; await pulse(c, labs.opp, 1.15); await c.fadeIn(L[0]); } },
      { cap: `${T('\\text{rise}=1.6\\times\\tan35^\\circ\\approx1.12')}, so about <b>1.1 m</b>.`, run: async (c) => { await c.fadeIn(L[1]); labs.opp.textContent = '1.12 m'; await pulse(c, labs.opp, 1.15); } },
      { cap: '(b) The panel is the <b>hyp</b>, and we know adj: <b>CAH</b>.', run: async (c) => { labs.hyp.textContent = 'panel (hyp)'; await show(c, hypLine); await c.fadeIn(L[2]); } },
      { cap: `x is on the bottom, so divide: ${T('x=1.6\\div\\cos35^\\circ\\approx2.0')} m.`, run: async (c) => { await c.fadeIn(L[3]); labs.hyp.textContent = '2.0 m'; await pulse(c, labs.hyp, 1.15); } },
      { cap: `(c) Check with Pythagoras: ${T('\\sqrt{1.6^2+1.1203^2}=\\sqrt{3.8151}\\approx1.95')}, about 2.0 m ✓ Use the <b>unrounded</b> rise.`, run: async (c) => { await c.fadeIn(L[4]); await c.fadeIn(L[5]); await c.fadeIn(L[6]); st.style.opacity = 1; await stampIn(c, st); } }
    ];
  }
};

/* =====================================================================================
 * 4. Example 7: the boat launch tilts while tan⁻¹ updates; the coulee path
 * ===================================================================================== */
const angles = {
  title: 'Two sides in, the angle out',
  height: 380,
  minW: 960,
  choices: [{ v: 'a', label: 'Ex 7(a) the boat launch' }, { v: 'b', label: 'Ex 7(b) the coulee path' }],
  ask: (k) => (k === 'a' ? 'Example 7(a): a boat launch drops 1.8 m over a horizontal distance of 14 m. Find the angle it makes with the horizontal.' : 'Example 7(b): a path up a coulee is 250 m long and climbs 60 m. Find the angle with the horizontal, and the other acute angle.'),
  make(stage, k, ex) {
    const W = ex.W, X = 660, BW = W - X - 10;
    if (k === 'a') {
      const svg = svgOn(stage, W, 380), s = 40, T0 = [40, 150], XE = T0[0] + 14 * s, WY = 196;
      const land = svgEl('polygon', { fill: '#dccba6', stroke: 'none' }, svg);
      const ramp = svgEl('line', { x1: T0[0], y1: T0[1], stroke: '#7d828c', 'stroke-width': 9, 'stroke-linecap': 'round' }, svg);
      svgEl('rect', { x: 330, y: WY, width: XE + 30 - 330, height: 380 - WY, fill: '#7fb3e6', opacity: 0.55 }, svg);
      line(svg, 330, WY, XE + 30, WY, '#3f7fc4', 2.5);
      const boat = svgEl('g', {}, svg); svgEl('path', { d: 'M500 192 L560 192 L550 204 L510 204 Z', fill: '#a8743f', stroke: '#6a4a2a', 'stroke-width': 1.5 }, boat); line(boat, 530, 192, 530, 168, SLATE, 2); svgEl('path', { d: 'M530 168 L548 190 L530 190 Z', fill: '#fff' }, boat);
      line(svg, 0, T0[1], T0[0], T0[1], '#8a6f4d', 3);
      const adj = line(svg, T0[0], T0[1], XE, T0[1], ADJ, 3, { 'stroke-dasharray': '9 6' });
      const opp = line(svg, XE, T0[1], XE, T0[1], OPP, 4);
      const th = svgEl('path', { fill: 'none', stroke: AMBER, 'stroke-width': 2.4 }, svg);
      gText(svg, (T0[0] + XE) / 2, T0[1] - 18, '14 m', { size: 19, color: ADJ });
      const dLab = gText(svg, XE - 34, T0[1] + 24, '1.8 m', { size: 19, color: OPP }); hide(dLab);
      const tLab = gText(svg, T0[0] + 196, T0[1] + 10, 'θ', { size: 22, color: AMBER });
      const live = el(stage, 'u7l10-live', '', 40, 12, 560, 74);
      const setDrop = (dm) => {
        const yE = T0[1] + dm * s, ang = Math.atan2(dm, 14) / RAD;
        ramp.setAttribute('x2', XE); ramp.setAttribute('y2', yE.toFixed(1));
        land.setAttribute('points', P([[0, T0[1]], T0, [XE, yE], [XE + 30, yE], [XE + 30, 380], [0, 380]]));
        opp.setAttribute('y2', yE.toFixed(1));
        const r = 170, p1 = [T0[0] + r * Math.cos(ang * RAD), T0[1] + r * Math.sin(ang * RAD)];
        th.setAttribute('d', `M${T0[0] + r} ${T0[1]}A${r} ${r} 0 0 1 ${p1[0].toFixed(1)} ${p1[1].toFixed(1)}`);
        live.innerHTML = `drop <b>${dm.toFixed(2)} m</b> &nbsp;→&nbsp; opp ÷ adj = ${dm.toFixed(2)} ÷ 14 = ${(dm / 14).toFixed(4)}<br>${T('\\tan^{-1}')} gives θ = <b>${ang.toFixed(1)}°</b>`;
      };
      setDrop(0);
      void adj; void tLab;
      const L = [ln(stage, 'opp and adj: <b>TOA</b>', X, 20, BW), ln(stage, `${T('\\theta=\\tan^{-1}\\!\\left(\\dfrac{1.8}{14}\\right)')}`, X, 74, BW, 64), ln(stage, keysHTML(['2nd', 'tan', '1.8', '÷', '14', ')', 'ENTER']), X, 152, BW, 44),
        ln(stage, '<span class="u7l10-keys"><span class="eq">7.326…°</span></span>', X + 120, 196, BW - 120, 40), ln(stage, `${T('\\theta\\approx7^\\circ')}`, X, 248, BW)];
      const st = hide(stamp(stage, '7°', { ok: true, x: W - 70, y: 330 }));
      return [
        { cap: 'The launch drops <b>1.8 m</b> over a horizontal distance of <b>14 m</b>. Watch θ grow as the drop grows.', run: async (c) => { await tween(c, 1600, (t) => { setDrop(1.8 * t); }); dLab.style.opacity = 1; await c.pop(dLab); } },
        { cap: 'For θ: the drop, 1.8 m, is <b>opp</b>, and 14 m is <b>adj</b>. We have opp and adj: <b>TOA</b>.', run: (c) => c.fadeIn(L[0]) },
        { cap: `We want the <b>angle</b>, so use the inverse key: ${T('\\theta=\\tan^{-1}\\!\\left(\\dfrac{1.8}{14}\\right)')}.`, run: (c) => c.fadeIn(L[1]) },
        { cap: `<span class="keys"><kbd>2nd</kbd><kbd>tan</kbd></span> 1.8 ÷ 14 <span class="keys"><kbd>)</kbd><kbd>ENTER</kbd></span> gives 7.326…, so θ ≈ <b>7°</b>.`, run: async (c) => { await c.fadeIn(L[2]); await c.fadeIn(L[3]); await c.fadeIn(L[4]); st.style.opacity = 1; await stampIn(c, st); } }
      ];
    }
    const Tr = Geo.rightTri(stage, { x: 0, y: 70, width: 570, height: 260, a: 60, c: 250, names: false, sides: { a: '60 m', c: '250 m' }, fill: '#e3efd5', size: 20 });
    const cen = [(Tr.V.A[0] + Tr.V.B[0] + Tr.V.C[0]) / 3, (Tr.V.A[1] + Tr.V.B[1] + Tr.V.C[1]) / 3];
    const b76 = hide(tag(stage, '76°', Tr.V.B[0] - 26, 70 + Tr.V.B[1] + 44, 'amber')); void cen;
    const L = [ln(stage, 'opp and hyp: <b>SOH</b>', X, 10, BW), ln(stage, `${T('\\theta=\\sin^{-1}\\!\\left(\\dfrac{60}{250}\\right)')}`, X, 60, BW, 64), ln(stage, keysHTML(['2nd', 'sin', '60', '÷', '250', ')', 'ENTER']), X, 138, BW, 44),
      ln(stage, `13.88… so ${T('\\theta\\approx14^\\circ')}`, X, 190, BW), ln(stage, `${T('90^\\circ-14^\\circ=76^\\circ')}`, X, 250, BW), ln(stage, '76° faces the longer leg ✓', X, 300, BW, 44, 'sm')];
    return [
      { cap: 'Label from θ: the path, 250 m, is the <b>hyp</b>. The climb, 60 m, is <b>opp</b> θ.', run: (c) => Tr.setTheta(c, 'A') },
      { cap: `We have opp and hyp: <b>SOH</b>. ${T('\\theta=\\sin^{-1}\\!\\left(\\dfrac{60}{250}\\right)')}`, run: async (c) => { await Tr.highlight(c, 'opp'); await Tr.highlight(c, 'hyp'); await c.fadeIn(L[0]); await c.fadeIn(L[1]); } },
      { cap: `<span class="keys"><kbd>2nd</kbd><kbd>sin</kbd></span> 60 ÷ 250 <span class="keys"><kbd>)</kbd><kbd>ENTER</kbd></span> gives 13.88…, so θ ≈ <b>14°</b>.`, run: async (c) => { await c.fadeIn(L[2]); await c.fadeIn(L[3]); } },
      { cap: `The other acute angle: ${T('90^\\circ-14^\\circ=76^\\circ')}. Check: the bigger angle faces the <b>longer</b> leg ✓`, run: async (c) => { Tr.clearHighlight(); await c.pop(b76); await Tr.highlight(c, 'adj'); await c.fadeIn(L[4]); await c.fadeIn(L[5]); } }
    ];
  }
};

/* =====================================================================================
 * 4. Example 8: elevation from the eye (+ eye height); depression from the water tower
 * ===================================================================================== */
const elev = {
  title: 'Measure from the horizontal',
  height: 390,
  minW: 960,
  choices: [{ v: 'a', label: 'Ex 8(a) the steeple' }, { v: 'b', label: 'Ex 8(b) the lost dog' }],
  ask: (k) => (k === 'a' ? 'Example 8(a): Nolan is 55 m from a steeple. His eye is 1.5 m up; the angle of elevation to the tip is 27°. How tall is the steeple?' : 'Example 8(b): a worker 32 m up a water tower sees a dog at an angle of depression of 9°. How far is the dog from the base of the tower?'),
  make(stage, k, ex) {
    const W = ex.W, X = 640, BW = W - X - 10;
    if (k === 'a') {
      const E = Geo.elevation(stage, { x: 0, y: 0, width: 620, height: 390, angle: 27, dist: 55, eye: 1.5, target: 'church', labels: { height: 'opp', eye: '1.5 m', dist: '55 m', angle: '27°' }, sky: false });
      const F = E.F, bg = svgEl('g', {}); E.svg.insertBefore(bg, E.svg.firstChild);
      const D = 55, top = 1.5 + 55 * Math.tan(27 * RAD), R = (x0, y0, x1, y1, fill) => svgEl('rect', { x: F.X(x0), y: F.Y(y1), width: (x1 - x0) * F.s, height: (y1 - y0) * F.s, fill, stroke: '#6a7182', 'stroke-width': 1.5 }, bg);
      svgEl('rect', { x: 0, y: 0, width: 620, height: F.Y(0), fill: '#f2f6fc' }, bg);
      R(D - 13, 0, D + 1.6, 11, '#efe6d6');
      svgEl('path', { d: `M${F.X(D - 13)} ${F.Y(11)}L${F.X(D - 6)} ${F.Y(15)}L${F.X(D - 1.6)} ${F.Y(11)}Z`, fill: '#d8c7a8', stroke: '#6a7182', 'stroke-width': 1.5 }, bg);
      R(D - 1.6, 0, D + 1.6, 20, '#e3d6bd');
      svgEl('path', { d: `M${F.X(D - 1.9)} ${F.Y(20)}L${F.X(D)} ${F.Y(top)}L${F.X(D + 1.9)} ${F.Y(20)}Z`, fill: '#cdb68f', stroke: '#6a7182', 'stroke-width': 1.5 }, bg);
      const L = [ln(stage, 'from the eye: <b>adj</b> = 55 m, want <b>opp</b>', X, 14, BW, 46, 'sm'), ln(stage, `${T('\\tan27^\\circ=\\dfrac{\\text{opp}}{55}')}`, X, 62, BW, 64),
        ln(stage, `${T('\\text{opp}=55\\times\\tan27^\\circ\\approx28.02')} m`, X, 136, BW), ln(stage, '<span class="u7l10-small">that is only the part above the eye</span>', X, 182, BW, 36),
        ln(stage, `${T('28.02+1.5\\approx29.5')} m`, X, 230, BW), ln(stage, 'The steeple is about <b>29.5 m</b> tall.', X, 284, BW, 46, 'sm')];
      return [
        { cap: 'Start at Nolan’s <b>eye</b>, 1.5 m above the ground. Draw the <b>horizontal</b>, then the line of sight to the tip: <b>27°</b>.', run: (c) => E.drawIn(c) },
        { cap: `From the eye, the horizontal 55 m is <b>adj</b> and the height above the eye is <b>opp</b>: <b>TOA</b>. ${T('\\tan27^\\circ=\\dfrac{\\text{opp}}{55}')}`, run: async (c) => { await c.fadeIn(L[0]); await c.fadeIn(L[1]); } },
        { cap: `opp is on top, so multiply: ${T('\\text{opp}=55\\times\\tan27^\\circ\\approx28.02')} m.`, run: async (c) => { await c.fadeIn(L[2]); await c.fadeIn(L[3]); } },
        { cap: `That is only the part <b>above the eye</b>. Add the eye height: ${T('28.02+1.5\\approx29.5')} m.`, run: async (c) => { if (E.parts.eye) await pulse(c, E.parts.eye, 1.4); await c.fadeIn(L[4]); await c.fadeIn(L[5]); } }
      ];
    }
    // the water tower (a sketch, not to scale)
    const svg = svgOn(stage, W, 390), GY = 350, TX = 110, EY = 112, DX = 560, dAng = Math.atan2(GY - EY, DX - TX) / RAD;
    svgEl('rect', { x: 0, y: 0, width: 620, height: GY, fill: '#f2f6fc' }, svg);
    svgEl('path', { d: `M${TX - 34} ${GY}L${TX - 18} ${EY}M${TX + 2} ${GY}L${TX - 14} ${EY}M${TX - 30} ${GY - 80}L${TX - 2} ${GY - 80}M${TX - 25} ${GY - 160}L${TX - 6} ${GY - 160}`, stroke: '#6a7182', 'stroke-width': 3, fill: 'none' }, svg);
    svgEl('rect', { x: TX - 62, y: EY - 70, width: 90, height: 64, rx: 16, fill: '#d9e4f2', stroke: '#6a7182', 'stroke-width': 2 }, svg);
    line(svg, TX - 70, EY, TX + 10, EY, SLATE, 4);
    svgEl('circle', { cx: TX, cy: EY, r: 5, fill: INK }, svg);
    line(svg, 0, GY, 620, GY, '#8a6f4d', 3);
    const dog = svgEl('g', { fill: '#8a5a2b' }, svg); svgEl('ellipse', { cx: DX + 14, cy: GY - 12, rx: 15, ry: 8 }, dog); svgEl('circle', { cx: DX + 31, cy: GY - 20, r: 7 }, dog);
    line(dog, DX + 4, GY - 6, DX + 4, GY, '#8a5a2b', 3.5); line(dog, DX + 24, GY - 6, DX + 24, GY, '#8a5a2b', 3.5); line(dog, DX, GY - 15, DX - 8, GY - 24, '#8a5a2b', 3.5);
    gText(svg, DX + 18, GY - 44, 'dog', { size: 16, color: '#6a7182' });
    const hz = line(svg, TX, EY, 610, EY, SLATE, 2.5, { 'stroke-dasharray': '9 6' });
    gText(svg, 360, EY - 14, 'horizontal', { size: 15, color: SLATE });
    const sight = line(svg, TX, EY, DX, GY, AMBER, 3);
    const depA = svgEl('g', {}, svg); arc(depA, TX, EY, 96, -dAng, 0, AMBER); gText(depA, TX + 128, EY + 22, '9°', { size: 20, color: AMBER });
    const altA = hide(svgEl('g', {}, svg)); arc(altA, DX, GY, 96, 180 - dAng, 180, GREEN); gText(altA, DX - 128, GY - 22, '9°', { size: 20, color: GREEN });
    const zHl = hide(svgEl('g', {}, svg)); line(zHl, TX, EY, 610, EY, GREEN, 9, { opacity: 0.3 }); line(zHl, 0, GY, DX, GY, GREEN, 9, { opacity: 0.3 });
    const opp = hide(line(svg, TX, EY, TX, GY, OPP, 4)), adj = hide(line(svg, TX, GY, DX, GY, ADJ, 4));
    const rm = rightMark(svg, TX, GY, 1, -1, 15);
    const l32 = tag(stage, '32 m', TX + 38, (EY + GY) / 2, 'red'), ld = tag(stage, 'd', (TX + DX) / 2, GY + 22, 'blue lg');
    tag(stage, 'sketch, not to scale', 520, 26, 'sm');
    [hz, sight, depA].forEach((e) => hide(e)); void rm;
    const L = [ln(stage, 'from the dog: elevation = <b>9°</b>', X, 14, BW, 46, 'sm'), ln(stage, '32 m is <b>opp</b>, d is <b>adj</b>: TOA', X, 64, BW, 46, 'sm'),
      ln(stage, `${T('\\tan9^\\circ=\\dfrac{32}{d}')}`, X, 116, BW, 64), ln(stage, `${T('d=32\\div\\tan9^\\circ')}`, X, 190, BW), ln(stage, keysHTML(['32', '÷', 'tan', '9', ')', 'ENTER']), X, 242, BW, 44),
      ln(stage, `202.04… so ${T('d\\approx202.0')} m`, X, 294, BW)];
    return [
      { cap: 'The angle of <b>depression</b> is measured <b>down</b> from the horizontal at the worker’s eye: <b>9°</b>.', run: async (c) => { await show(c, hz); await show(c, sight); await show(c, depA); } },
      { cap: 'The ground is horizontal too, and the two horizontals are parallel. So from the dog, the angle of <b>elevation</b> is also <b>9°</b> (alternate interior angles).', run: async (c) => { await show(c, zHl); await show(c, altA); await c.fadeIn(L[0]); await fadeOut(c, zHl); } },
      { cap: `In the triangle at the dog, 32 m is <b>opp</b> and d is <b>adj</b>: TOA. ${T('\\tan9^\\circ=\\dfrac{32}{d}')}`, run: async (c) => { await show(c, opp); await show(c, adj); await pulse(c, l32, 1.15); await c.fadeIn(L[1]); await c.fadeIn(L[2]); } },
      { cap: `d is on the <b>bottom</b>, so divide: ${T('d=32\\div\\tan9^\\circ\\approx202.0')} m.`, run: async (c) => { await c.fadeIn(L[3]); await c.fadeIn(L[4]); await c.fadeIn(L[5]); ld.textContent = '202.0 m'; await pulse(c, ld, 1.15); } }
    ];
  }
};

/* =====================================================================================
 * 5. Examples 9 and 10: solve a right triangle; two triangles that share a side
 * ===================================================================================== */
function solve9(stage, ex) {
  const W = ex.W, Tr = Geo.rightTri(stage, { x: 0, y: 0, width: 500, height: 380, c: 15, A: 41, names: ['A', 'B', 'C'], sides: { c: '15 cm', a: 'a', b: 'b' }, angles: { A: '41°' }, thetaLabel: '41°', size: 20 });
  const cen = [(Tr.V.A[0] + Tr.V.B[0] + Tr.V.C[0]) / 3, (Tr.V.A[1] + Tr.V.B[1] + Tr.V.C[1]) / 3];
  const tB = hide(tag(stage, '49°', lerp(Tr.V.B[0], cen[0], 0.42), lerp(Tr.V.B[1], cen[1], 0.42), 'amber'));
  const X = 520, BW = W - X - 10;
  const L = [ln(stage, `${T('\\angle B=90^\\circ-41^\\circ=49^\\circ')}`, X, 10, BW), ln(stage, `<span class="u7l10-small">for ∠A: a is opp, b is adj, c is hyp</span>`, X, 58, BW, 36),
    ln(stage, `${T('a=15\\times\\sin41^\\circ\\approx9.8')} cm <span class="u7l10-small">&nbsp;SOH</span>`, X, 100, BW), ln(stage, `${T('b=15\\times\\cos41^\\circ\\approx11.3')} cm <span class="u7l10-small">&nbsp;CAH</span>`, X, 152, BW),
    ln(stage, `${T('9.841^2+11.321^2\\approx225=15^2')} ✓`, X, 220, BW, 46, 'sm'), ln(stage, 'bigger angle (49°) faces the longer leg (b) ✓', X, 270, BW, 46, 'sm')];
  const st = hide(stamp(stage, 'Solved', { ok: true, x: 130, y: 70, size: 'lg' }));
  return [
    { cap: `Start with the easy one: the two acute angles add to 90°. ${T('\\angle B=90^\\circ-41^\\circ=49^\\circ')}.`, run: async (c) => { await c.pop(tB); await c.fadeIn(L[0]); } },
    { cap: 'Label from <b>∠A</b>: a is <b>opp</b>, b is <b>adj</b>, and c = 15 cm is the <b>hyp</b>.', run: async (c) => { await Tr.setTheta(c, 'A'); await c.fadeIn(L[1]); } },
    { cap: `a: we have hyp, we want opp: <b>SOH</b>. ${T('a=15\\times\\sin41^\\circ\\approx9.8')} cm.`, run: async (c) => { await Tr.highlight(c, 'opp'); await c.fadeIn(L[2]); Tr.tags.opp.style.opacity = 0; relabel(Tr.valLabels.a, '9.8 cm', 'start'); await pulse(c, Tr.valLabels.a, 1.2); } },
    { cap: `b: we have hyp, we want adj: <b>CAH</b>. ${T('b=15\\times\\cos41^\\circ\\approx11.3')} cm.`, run: async (c) => { Tr.clearHighlight(); await Tr.highlight(c, 'adj'); await c.fadeIn(L[3]); Tr.tags.adj.style.opacity = 0; relabel(Tr.valLabels.b, '11.3 cm'); await pulse(c, Tr.valLabels.b, 1.2); } },
    { cap: `Check with Pythagoras (unrounded legs): ${T('9.841^2+11.321^2\\approx225=15^2')} ✓`, run: async (c) => { Tr.clearHighlight(); await c.fadeIn(L[4]); } },
    { cap: 'Check: the bigger angle, <b>49°</b>, faces the longer leg, <b>b</b> ✓ The triangle is solved.', run: async (c) => { await pulse(c, tB, 1.25); await c.fadeIn(L[5]); st.style.opacity = 1; await stampIn(c, st); } }
  ];
}
function solve10(stage, ex) {
  const W = ex.W, svg = svgOn(stage, W, 380), s = 4.1, GY = 310, x = 52 / Math.tan(61 * RAD), y = 52 / Math.tan(48 * RAD), TX = 50 + x * s, TY = GY - 52 * s, XL = 50, XR = TX + y * s;
  const fl = hide(svgEl('polygon', { points: P([[XL, GY], [TX, GY], [TX, TY]]), fill: BLUE, 'fill-opacity': 0.16 }, svg)), fr = hide(svgEl('polygon', { points: P([[TX, GY], [XR, GY], [TX, TY]]), fill: GREEN, 'fill-opacity': 0.16 }, svg));
  line(svg, 10, GY, XR + 40, GY, '#8a6f4d', 3);
  let d = `M${TX - 7} ${GY}L${TX} ${TY}L${TX + 7} ${GY}`; for (let i = 1; i < 6; i++) { const y0 = GY - (i - 1) * (GY - TY) / 6, y1 = GY - i * (GY - TY) / 6, w0 = 7 * (1 - (i - 1) / 6), w1 = 7 * (1 - i / 6); d += `M${TX - w0} ${y0}L${TX + w1} ${y1}M${TX + w0} ${y0}L${TX - w1} ${y1}`; }
  svgEl('path', { d, stroke: '#7b4fc4', 'stroke-width': 2, fill: 'none' }, svg);
  line(svg, XL, GY, TX, TY, INK, 2.6); line(svg, TX, TY, XR, GY, INK, 2.6);
  svgEl('circle', { cx: TX, cy: TY, r: 4.5, fill: RED }, svg);
  rightMark(svg, TX, GY, -1, -1, 14); rightMark(svg, TX, GY, 1, -1, 14);
  arc(svg, XL, GY, 46, 0, 61, INK); gText(svg, XL + 70, GY - 22, '61°', { size: 18 });
  arc(svg, XR, GY, 52, 132, 180, INK); gText(svg, XR - 78, GY - 20, '48°', { size: 18 });
  const t52 = tag(stage, '52 m', TX + 40, (GY + TY) / 2, 'red'), tx = tag(stage, 'x', (XL + TX) / 2, GY + 20, 'blue lg'), ty = tag(stage, 'y', (TX + XR) / 2, GY + 20, 'blue lg');
  const dim = hide(svgEl('g', {}, svg)); line(dim, XL, GY + 42, XR, GY + 42, SLATE, 1.6); svgEl('path', { d: `M${XL} ${GY + 42}l9 -4v8zM${XR} ${GY + 42}l-9 -4v8z`, fill: SLATE }, dim);
  const tTot = hide(tag(stage, '75.6 m', (XL + XR) / 2, GY + 42, 'red'));
  const X = 520, BW = W - X - 10;
  const L = [ln(stage, 'tower: <b>opp</b>; ground: <b>adj</b>: TOA', X, 6, BW, 46, 'sm'), ln(stage, `${T('x=52\\div\\tan61^\\circ\\approx28.82')} m`, X, 60, BW), ln(stage, `${T('y=52\\div\\tan48^\\circ\\approx46.82')} m`, X, 118, BW),
    ln(stage, `${T('28.82+46.82\\approx75.6')} m`, X, 186, BW), ln(stage, 'flatter wire, anchor farther ✓', X, 244, BW, 46, 'sm')];
  const st = hide(stamp(stage, '✓', { ok: true, x: W - 60, y: 320 }));
  return [
    { cap: 'Two right triangles share the tower, <b>52 m</b>. In each one, the tower is <b>opp</b> and the ground distance is <b>adj</b>: <b>TOA</b>.', run: async (c) => { await show(c, fl); await show(c, fr); await pulse(c, t52, 1.15); await c.fadeIn(L[0]); } },
    { cap: `Left: ${T('\\tan61^\\circ=\\dfrac{52}{x}')}, and x is on the bottom, so ${T('x=52\\div\\tan61^\\circ\\approx28.82')} m.`, run: async (c) => { await c.fadeIn(L[1]); tx.textContent = '28.82 m'; await pulse(c, tx, 1.15); } },
    { cap: `Right: ${T('y=52\\div\\tan48^\\circ\\approx46.82')} m.`, run: async (c) => { await c.fadeIn(L[2]); ty.textContent = '46.82 m'; await pulse(c, ty, 1.15); } },
    { cap: `The anchors are on <b>opposite</b> sides of the tower, so add: ${T('28.82+46.82\\approx75.6')} m.`, run: async (c) => { await show(c, dim); await c.pop(tTot); await c.fadeIn(L[3]); } },
    { cap: 'Reasonable? The flatter wire (48°) has its anchor <b>farther</b> from the tower ✓ The anchors are about <b>75.6 m</b> apart.', run: async (c) => { await c.fadeIn(L[4]); st.style.opacity = 1; await stampIn(c, st); } }
  ];
}
const solve = {
  title: 'Solve it, then check it',
  height: 380,
  minW: 960,
  choices: [{ v: 'ex9', label: 'Ex 9 solve △ABC' }, { v: 'ex10', label: 'Ex 10 the two guy wires' }],
  ask: (k) => (k === 'ex9' ? 'Example 9: in △ABC, ∠C = 90°, ∠A = 41° and the hypotenuse c = 15 cm. Find ∠B, a and b.' : 'Example 10: a 52 m tower has guy wires to anchors on opposite sides, at 61° and 48° to the ground. How far apart are the anchors?'),
  make: (stage, k, ex) => (k === 'ex9' ? solve9(stage, ex) : solve10(stage, ex))
};

/* =====================================================================================
 * 6. Full notes: practice-test multiple choice, with the mistake behind every wrong choice
 * ===================================================================================== */
const MC = {
  q15: { ask: 'Practice test Q15: √110 is between…', opts: ['9 and 10', '10 and 11', '54 and 56', '100 and 121'], ans: 1,
    work: '10^2=100\\text{ and }11^2=121', why: ['that is √81 to √100: too small', '', 'halved 110', 'the squares, not the roots'], trap: 'Find the two <b>perfect squares</b> around the number, then take their square roots.' },
  q16: { ask: 'Practice test Q16: for an acute angle θ in a right triangle, tan θ is…', opts: [T('\\dfrac{\\text{opp}}{\\text{hyp}}'), T('\\dfrac{\\text{adj}}{\\text{hyp}}'), T('\\dfrac{\\text{opp}}{\\text{adj}}'), T('\\dfrac{\\text{adj}}{\\text{opp}}')], ans: 2,
    work: '\\text{TOA: }\\tan=\\text{opp}\\div\\text{adj}', why: ['that is sine', 'that is cosine', '', 'upside down'], trap: '<b>SOH CAH TOA</b>: say it, write it at the top of your test.' },
  q17: { ask: 'Practice test Q17: a right triangle has legs of 5 m and 7 m. To the nearest tenth, its hypotenuse is…', opts: ['12.0 m', '8.6 m', '4.9 m', '74.0 m'], ans: 1,
    work: '\\sqrt{5^2+7^2}=\\sqrt{74}\\approx8.6', why: ['added the legs', '', 'subtracted the squares', 'forgot the square root'], trap: 'Square, add, then take the <b>square root</b>. The hyp is longer than each leg but shorter than both together.' },
  q19: { ask: 'Practice test Q19: if sin 25° = x/14, then to the nearest tenth x is…', opts: ['5.9', '33.1', '12.7', '6.5'], ans: 0,
    work: 'x=14\\times\\sin25^\\circ\\approx5.9', why: ['', 'divided instead', 'used cos', 'used tan'], trap: 'x is on <b>top</b>: multiply. And use the ratio in the question.' },
  q20: { ask: 'Practice test Q20: tan θ = 0.8. To the nearest degree, θ is…', opts: ['53°', '37°', '51°', '39°'], ans: 3,
    work: '\\theta=\\tan^{-1}(0.8)\\approx38.7^\\circ', why: ['used sin⁻¹', 'used cos⁻¹', 'the other angle, 90° − 39°', ''], trap: 'Use the inverse of the ratio you were given: tan → <b>tan⁻¹</b>.' },
  q21: { ask: 'Practice test Q21: from the top of a lookout, the angle of depression to a canoe is 14°. The angle of elevation from the canoe to the top is…', opts: ['14°', '76°', '104°', '166°'], ans: 0,
    work: '\\text{alternate interior angles: equal}', why: ['', 'the angle with the vertical', '90° + 14°', '180° − 14°'], trap: 'Both angles are measured from a <b>horizontal</b>, and the two horizontals are parallel.' }
};
const traps = {
  title: 'Spot the trap',
  height: 340,
  minW: 960,
  choices: [{ sep: 'Practice test:' }, { v: 'q15', label: 'Q15 √110' }, { v: 'q16', label: 'Q16 tan θ' }, { v: 'q17', label: 'Q17 legs 5, 7' }, { v: 'q19', label: 'Q19 sin 25°' }, { v: 'q20', label: 'Q20 tan θ = 0.8' }, { v: 'q21', label: 'Q21 depression' }],
  ask: (k) => MC[k].ask,
  make(stage, k, ex) {
    const d = MC[k], W = ex.W, OW = (W - 50) / 2;
    const tiles = d.opts.map((o, i) => el(stage, 'u7l10-opt', `<b>${'ABCD'[i]}</b><span class="ot">${o}</span><span class="why"></span>`, 16 + (i % 2) * (OW + 18), 8 + Math.floor(i / 2) * 92, OW, 80));
    tiles.forEach((t, i) => { const w = t.querySelector('.why'); w.innerHTML = d.why[i]; hide(w); });
    const work = hide(cb(stage, 'u7l10-res', `Work it out: ${T(d.work)}`, (W - 660) / 2, 202, 660, 56));
    const tp = hide(cb(stage, 'u7l10-note', d.trap, 16, 272, W - 32, 56));
    const ok = tiles[d.ans];
    const st = hide(stamp(stage, '✓', { ok: true, x: 16 + (d.ans % 2) * (OW + 18) + OW - 34, y: 8 + Math.floor(d.ans / 2) * 92 + 40, rotate: -8 }));
    return [
      { cap: `Work it out <b>before</b> you look at the choices: ${T(d.work)}.`, run: (c) => c.pop(work) },
      { cap: `The answer is <b>${'ABCD'[d.ans]}</b>.`, run: async (c) => { ok.classList.add('u7l10-ok'); await pulse(c, ok, 1.04); st.style.opacity = 1; await stampIn(c, st); } },
      { cap: 'Every wrong choice is the answer to a <b>mistake</b>. Can you name each one?',
        run: async (c) => { for (const [i, t] of tiles.entries()) { if (i === d.ans) continue; t.classList.add('u7l10-no'); await c.fadeIn(t.querySelector('.why'), 300); } } },
      { cap: d.trap, run: (c) => c.fadeIn(tp) }
    ];
  }
};

mountExplainers({ tool, roots, pyth, ratios, sides, solar, angles, elev, solve, traps });

/* ============ Stand Up Break! — mixed review like the unit test, at the whiteboards ============ */
{
  const f1 = (v) => (Math.round(v * 10) / 10).toFixed(1);
  const sq = (n) => (n >= 1000 ? String(n).replace(/(\d)(\d{3})$/, '$1\\,$2') : String(n));
  const fig = (o) => Geo.rightTri(null, Object.assign({ width: 300, height: 210, names: false, size: 17 }, o)).el.outerHTML;
  const FN = { sin: Math.sin, cos: Math.cos, tan: Math.tan };
  standup('u7l10', {
    intro: 'Mixed review, like the unit test. Sketch and label first, then show every step. Calculator in DEG mode; round lengths to the nearest tenth and angles to the nearest degree.',
    levels: {
      BEG: (r) => r.pick([
        () => { const a = r.int(3, 15); let b; do { b = r.int(4, 18); } while (b === a); const s = a * a + b * b, c = Math.sqrt(s), exact = Number.isInteger(c);
          return { text: `A right triangle has legs of <b>${a} cm</b> and <b>${b} cm</b>. Find the hypotenuse.`, q: '', fig: fig({ a, b, sides: { a: `${a} cm`, b: `${b} cm`, c: 'c' } }),
            a: [`c^2=${a}^2+${b}^2=${a * a}+${b * b}=${sq(s)}`, `c=\\sqrt{${sq(s)}}${exact ? '=' + c : '\\approx' + f1(c)}\\text{ cm}`] }; },
        () => { let n; do { n = r.int(12, 150); } while (Number.isInteger(Math.sqrt(n))); const k = Math.floor(Math.sqrt(n));
          return { text: `${tex(`\\sqrt{${n}}`)} is between which two whole numbers? Then find it to the nearest tenth.`, q: '',
            a: [`${k}^2=${k * k}\\text{ and }${k + 1}^2=${(k + 1) * (k + 1)}`, `\\sqrt{${n}}\\approx${f1(Math.sqrt(n))}`], atext: `Between <b>${k}</b> and <b>${k + 1}</b>.` }; },
        () => { const x = r.int(14, 76);
          return { text: `A right triangle has an angle of <b>${x}°</b>. Find the other acute angle.`, q: '', a: [`90^\\circ-${x}^\\circ=${90 - x}^\\circ`], atext: 'The three angles add to 180°, and one is 90°.' }; }
      ])(),
      PRG: (r) => r.pick([
        () => { let c, b; do { c = r.int(10, 30); b = r.int(4, c - 3); } while (false); const s = c * c - b * b, a = Math.sqrt(s), exact = Number.isInteger(a);
          return { text: `A ladder <b>${c} ft</b> long leans against a wall. Its foot is <b>${b} ft</b> from the wall. How high up the wall does it reach?`, q: '', fig: fig({ b, c, sides: { b: `${b} ft`, c: `${c} ft`, a: 'h' } }),
            a: [`h^2=${c}^2-${b}^2=${c * c}-${b * b}=${s}`, `h=\\sqrt{${s}}${exact ? '=' + a : '\\approx' + f1(a)}\\text{ ft}`] }; },
        () => {
          const cases = [['tan', 'b', 'a', true], ['tan', 'a', 'b', false], ['sin', 'c', 'a', true], ['sin', 'a', 'c', false], ['cos', 'c', 'b', true], ['cos', 'b', 'c', false]];
          const [fn, kn, un, top] = r.pick(cases), A = r.int(18, 72), kv = r.int(6, 40), o = { A }; o[kn] = kv;
          const sd = Geo.rightSides(o), x = sd[un], role = { a: 'opp', b: 'adj', c: 'hyp' }, nm = { tan: 'TOA', sin: 'SOH', cos: 'CAH' }[fn];
          const num = fn === 'cos' ? 'b' : 'a', den = fn === 'tan' ? 'b' : 'c', frac = `\\dfrac{${num === un ? 'x' : kv}}{${den === un ? 'x' : kv}}`;
          return { text: `Find ${tex('x')} to the nearest tenth.`, q: '', fig: fig({ A, [kn]: kv, sides: { [kn]: `${kv} m`, [un]: 'x' }, angles: { A: A + '°' } }),
            a: [`\\text{${role[kn]} and ${role[un]}: ${nm}}`, `\\${fn}${A}^\\circ=${frac}`, `x=${kv}${top ? '\\times' : '\\div'}\\${fn}${A}^\\circ\\approx${f1(x)}\\text{ m}`] }; },
        () => { const T3 = r.pick([[5, 12, 13], [8, 15, 17], [7, 24, 25], [9, 40, 41], [20, 21, 29], [6, 8, 10]]), near = r.chance(0.5), m = r.pick([1, 2]);
          const s = T3.map((v) => v * m); if (near) s[2] += r.pick([-1, 1]); const lhs = s[0] * s[0] + s[1] * s[1], rhs = s[2] * s[2];
          return { text: `Is a triangle with sides <b>${s[0]} cm</b>, <b>${s[1]} cm</b> and <b>${s[2]} cm</b> a right triangle? Explain.`, q: '',
            a: [`${s[0]}^2+${s[1]}^2=${s[0] * s[0]}+${s[1] * s[1]}=${sq(lhs)}`, `${s[2]}^2=${sq(rhs)}`], atext: lhs === rhs ? '<b>Equal</b>, so yes: it is a right triangle.' : '<b>Not equal</b>, so no: it is not a right triangle.' }; }
      ])(),
      MAS: (r) => r.pick([
        () => { const fn = r.pick(['tan', 'sin', 'cos']), p = r.int(3, 20); let q2; do { q2 = r.int(4, 30); } while ((fn !== 'tan' && q2 <= p) || q2 === p);
          const ratio = p / q2, th = (fn === 'tan' ? Math.atan(ratio) : fn === 'sin' ? Math.asin(ratio) : Math.acos(ratio)) / RAD;
          const sides = fn === 'tan' ? { a: p, b: q2 } : fn === 'sin' ? { a: p, c: q2 } : { b: p, c: q2 }, lab = {}; Object.keys(sides).forEach((k2) => { lab[k2] = `${sides[k2]} m`; });
          const nm = { tan: 'TOA', sin: 'SOH', cos: 'CAH' }[fn];
          return { text: `Find ${tex('\\theta')} to the nearest degree. Then find the other acute angle.`, q: '', fig: fig(Object.assign({ sides: lab, angles: { A: 'θ' } }, sides)),
            a: [`\\text{${nm}: }\\theta=\\${fn}^{-1}\\!\\left(\\dfrac{${p}}{${q2}}\\right)\\approx${Math.round(th)}^\\circ`, `90^\\circ-${Math.round(th)}^\\circ=${90 - Math.round(th)}^\\circ`] }; },
        () => { const dist = r.int(12, 60), A = r.int(20, 55), eye = r.pick([1.5, 1.6, 1.7]), opp = dist * Math.tan(A * RAD);
          return { text: `You stand <b>${dist} m</b> from a flagpole. Your eye is <b>${eye} m</b> above the ground. The angle of elevation to the top is <b>${A}°</b>. How tall is the flagpole?`, q: '',
            a: [`\\text{opp}=${dist}\\times\\tan${A}^\\circ\\approx${opp.toFixed(2)}\\text{ m}`, `${opp.toFixed(2)}+${eye}\\approx${f1(opp + eye)}\\text{ m}`], atext: 'Don’t forget to add the eye height.' }; },
        () => { const ht = r.int(20, 60), a1 = r.int(30, 50), a2 = r.int(12, a1 - 8), d1 = ht / Math.tan(a1 * RAD), d2 = ht / Math.tan(a2 * RAD);
          return { text: `From the top of a <b>${ht} m</b> cliff, the angles of depression to two boats in a straight line are <b>${a1}°</b> and <b>${a2}°</b>. How far apart are the boats?`, q: '',
            a: [`${ht}\\div\\tan${a1}^\\circ\\approx${d1.toFixed(2)}\\text{ m}`, `${ht}\\div\\tan${a2}^\\circ\\approx${d2.toFixed(2)}\\text{ m}`, `${d2.toFixed(2)}-${d1.toFixed(2)}\\approx${f1(d2 - d1)}\\text{ m}`], atext: 'The angles of elevation from the boats are the same (alternate interior angles).' }; }
      ])()
    }
  });
}
