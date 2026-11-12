/* Math 10-3 · Unit 2 · Lesson 9 — Unit 2 Review (N2, A1).
 * A review lesson: no practice break; the review assignment is a practice unit test, and (the review is the exception)
 * some of its multiple-choice questions appear as chips in the Full-notes "Spot the trap" explainer.
 * Explainers (Class view unless marked):
 *   chain      (Full notes: hours → wages → extras → gross → deductions → net, with Tyler's and Jas's weeks),
 *   timeCheck  (a clock whose minutes fill a decimal-hour bar, both ways; Leah's shift on a timeline and her cheque; Ex. 1),
 *   salary     (a year bar cut into 26 / 24 / 52 pays, a week cut into 40 hours; salary job vs hourly job; Example 2),
 *   overtime   (a week of shift bars that turn orange past 8 h a day and past 44 h a week; "use the bigger one"; Ex. 3),
 *   contract   (a tree-planting counter and a minimum-wage bar; Owen's bid minus costs, cut into hours, then rain; Ex. 4),
 *   commission (a sales bar coloured by what earns commission: straight, over a quota, graduated; Example 5),
 *   extras     (a tip jar shared by hour squares; Jas's rate tower with a night premium and a bonus; Example 6),
 *   payStub    (Maya's pay stub filling line by line while the gross bar loses each deduction; take-home %; Ex. 7),
 *   backwards  (the formula "undo machine" with a check; Zara's savings bar with a zoom on the goal: round up; Ex. 8),
 *   traps      (Full notes: practice-test multiple choice Q15–Q20, with the mistake behind every wrong choice).
 * Then the Stand Up Break (mixed review, like the unit test). */
import { h, add, box, tex, svgEl, pulse, tween, stamp, stampIn, mountExplainers } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const rnd = (v, d = 2) => Math.round((v + (v >= 0 ? 1e-9 : -1e-9)) * 10 ** d) / 10 ** d;
const grp = (s) => { const [i, d] = String(s).split('.'); const ii = i.replace(/^-/, '').length > 3 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, '\u202f') : i; return d != null ? ii + '.' + d : ii; };
const M = (v, d = 2) => '$' + grp(rnd(v, d).toFixed(d));                         // money as text: $1 155.00
const TMo = (v) => '\\$' + grp(rnd(v, 2).toFixed(2)).replace(/\u202f/g, '\\,');  // money in TeX: \$1\,155.00
const lerp = (a, b, t) => a + (b - a) * t;
/** an absolutely placed box on the stage */
const el = (stage, cls, html, x, y, w, hh) => add(stage, box(h('div', cls, /u2l9-(line|tot)\b/.test(cls) ? `<div>${html}</div>` : html), w, hh), x, y);
/** a box whose mixed text and maths stay together on centred lines */
const cb = (stage, cls, html, x, y, w, hh) => el(stage, cls + ' u2l9-c', `<div>${html}</div>`, x, y, w, hh);
const svgAt = (stage, w, hh, x = 0, y = 0) => { const s = add(stage, svgEl('svg', { width: w, height: hh, viewBox: `0 0 ${w} ${hh}`, class: 'u2l9-svg' }), x, y); return s; };
const grow = (c, e, ms = 600, o = {}) => c.anim(e, [{ opacity: 1, transform: 'scaleX(0)' }, { opacity: 1, transform: 'scaleX(1)' }], ms, o);
const growUp = (c, e, ms = 600, o = {}) => c.anim(e, [{ opacity: 1, transform: 'scaleY(0)' }, { opacity: 1, transform: 'scaleY(1)' }], ms, o);
const fadeOut = (c, e, ms = 250) => c.anim(e, [{ opacity: 1 }, { opacity: 0 }], ms);
const moveTo = (c, e, x, y, ms = 650) => { const x0 = parseFloat(e.style.left), y0 = parseFloat(e.style.top); return tween(c, ms, (t) => { e.style.left = lerp(x0, x, t) + 'px'; e.style.top = lerp(y0, y, t) + 'px'; }); };
const countTo = (c, e, a, b, ms, f) => tween(c, ms, (t) => { e.innerHTML = f(lerp(a, b, t)); });
const popAll = (c, els, gap = 30, ms = 260) => Promise.all(els.map((e, i) => c.pop(e, ms, { delay: i * gap })));

/* =====================================================================================
 * 0. Full notes: the whole unit as one chain, from hours to take-home pay
 * ===================================================================================== */
const CH = {
  tyler: { ask: 'Example 3: Tyler works 46 h in a week at $18.40/h (6 h of it overtime). Say his deductions are CPP 5.95%, EI 1.64% and income tax 15%. Follow his pay from hours to take-home pay.',
    vals: ['40 h + 6 h OT', M(901.6), M(0), M(901.6), '−' + M(203.68), M(697.92)],
    caps: ['<b>Hours:</b> 46 h in the week. By the day, 6 h are overtime: <b>40 regular h + 6 overtime h</b>.',
      `<b>Wages:</b> ${T('40\\times\\$18.40+6\\times\\$27.60=\\$736.00+\\$165.60=\\$901.60')}.`,
      '<b>Extras:</b> no tips, premiums or bonuses this week: <b>$0.00</b>.',
      '<b>Gross pay</b> is everything he earns: <b>$901.60</b>.',
      `<b>Deductions</b> (example rates): ${T('53.65+14.79+135.24=\\$203.68')}.`,
      `<b>Net pay:</b> ${T('\\$901.60-\\$203.68=\\$697.92')}. That is what lands in his bank account.`],
    notes: ['2.1, 2.3', '2.2, 2.3', '2.6', 'everything earned', 'CPP, EI, tax: 2.7', 'take-home'] },
  jas: { ask: 'Example 6(b): Jas works 36 night hours at $24.80/h, with a $2.25/h night premium and a $150 bonus. Say his deductions are CPP 5.95%, EI 1.64% and income tax 15%. Follow his pay from hours to take-home pay.',
    vals: ['36 h, all nights', M(892.8), M(231), M(1123.8), '−' + M(253.87), M(869.93)],
    caps: ['<b>Hours:</b> 36 h, all on nights. No day is over 8 h, so no overtime.',
      `<b>Wages:</b> ${T('36\\times\\$24.80=\\$892.80')}.`,
      `<b>Extras:</b> premium ${T('36\\times\\$2.25=\\$81.00')}, plus the $150 bonus: <b>$231.00</b>.`,
      `<b>Gross pay:</b> ${T('\\$892.80+\\$231.00=\\$1\\,123.80')}, the same as in Example 6.`,
      `<b>Deductions</b> (example rates): ${T('66.87+18.43+168.57=\\$253.87')}.`,
      `<b>Net pay:</b> ${T('\\$1\\,123.80-\\$253.87=\\$869.93')}.`],
    notes: ['2.1', '2.2', 'tips, premiums, bonus: 2.6', 'everything earned', 'CPP, EI, tax: 2.7', 'take-home'] }
};
const CH_NODES = [['Hours', 'time math'], ['× rate', 'wages, overtime'], ['+ extras', 'tips, premiums'], ['= Gross pay', 'what you earn'], ['− deductions', 'CPP, EI, tax, dues'], ['= Net pay', 'take-home pay']];
const chain = {
  title: 'From hours to take-home pay',
  height: 300,
  minW: 960,
  choices: [{ sep: 'Follow one week:' }, { v: 'tyler', label: 'Tyler (Example 3)' }, { v: 'jas', label: 'Jas (Example 6)' }],
  ask: (k) => CH[k].ask,
  make(stage, k, ex) {
    const d = CH[k], W = ex.W, G = 18, NW = (W - 32 - 5 * G) / 6;
    const xs = CH_NODES.map((_, i) => 16 + i * (NW + G));
    const nodes = CH_NODES.map(([a, b], i) => cb(stage, 'u2l9-node' + (i === 3 ? ' gross' : i === 5 ? ' net' : ''), `<b>${a}</b><small>${b}</small>`, xs[i], 20, NW, 84));
    CH_NODES.slice(1).forEach((_, i) => el(stage, 'u2l9-arr', '→', xs[i] + NW, 44, G, 36));
    const vals = d.vals.map((v, i) => hide(cb(stage, 'u2l9-val' + (i === 3 ? ' gross' : i === 5 ? ' net' : i === 4 ? ' ded' : ''), v, xs[i], 128, NW, 64)));
    const notes = d.notes.map((v, i) => hide(cb(stage, 'u2l9-vnote', v, xs[i], 202, NW, 40)));
    const brace = hide(cb(stage, 'u2l9-bracenote', 'Gross pay: everything you <b>earn</b>. Net pay: what is <b>left</b> after deductions.', 16, 252, W - 32, 40));
    return d.caps.map((cap, i) => ({ cap, run: async (c) => { nodes[i].classList.add('on'); await c.pop(vals[i]); await c.fadeIn(notes[i], 250); if (i === 5) await c.fadeIn(brace); } }));
  }
};

/* =====================================================================================
 * 1. Example 1: minutes ↔ decimal hours (a clock and an hour bar), and Leah's shift
 * ===================================================================================== */
const TC = {
  a1: { ask: 'Example 1(a)(i): change 2 h 40 min to decimal hours.' },
  a2: { ask: 'Example 1(a)(ii): change 4.2 h to hours and minutes.' },
  b: { ask: 'Example 1(b): Leah works at a grocery store from 08:45 to 15:15 (24-hour clock) with a 30 min unpaid lunch. She earns $15.75/h. What is her gross pay for the shift?' }
};
function clockKit(stage, ex) {
  const W = ex.W, CX = 140, CY = 132, R = 110;
  const sv = svgAt(stage, 290, 270, 0, 0);
  svgEl('circle', { cx: CX, cy: CY, r: R, fill: '#fff', stroke: '#4a3010', 'stroke-width': 5 }, sv);
  const wedge = svgEl('path', { d: '', fill: '#f2c46b', stroke: '#c27a0e', 'stroke-width': 2 }, sv);
  for (let i = 0; i < 60; i++) {
    const a = i / 60 * 2 * Math.PI, r1 = i % 5 ? R - 8 : R - 15;
    svgEl('line', { x1: CX + r1 * Math.sin(a), y1: CY - r1 * Math.cos(a), x2: CX + (R - 3) * Math.sin(a), y2: CY - (R - 3) * Math.cos(a), stroke: '#4a3010', 'stroke-width': i % 5 ? 1.5 : 3 }, sv);
  }
  for (let i = 1; i <= 12; i++) {
    const a = i / 12 * 2 * Math.PI, t = svgEl('text', { x: CX + (R - 32) * Math.sin(a), y: CY - (R - 32) * Math.cos(a) + 7, 'text-anchor': 'middle', 'font-size': 19, 'font-weight': 800, fill: '#4a3010' }, sv);
    t.textContent = String(i);
  }
  const hand = svgEl('line', { x1: CX, y1: CY, x2: CX, y2: CY - R + 20, stroke: '#c93a33', 'stroke-width': 6, 'stroke-linecap': 'round' }, sv);
  svgEl('circle', { cx: CX, cy: CY, r: 8, fill: '#c93a33' }, sv);
  const minLab = cb(stage, 'u2l9-minlab', '0 min', CX - 90, CY + R + 14, 180, 40);
  const setMin = (m) => {
    const a = m / 60 * 2 * Math.PI, x = CX + R * Math.sin(a), y = CY - R * Math.cos(a);
    wedge.setAttribute('d', m <= 0.01 ? '' : `M${CX} ${CY} L${CX} ${CY - R} A${R} ${R} 0 ${m > 30 ? 1 : 0} 1 ${x.toFixed(2)} ${y.toFixed(2)} Z`);
    hand.setAttribute('x2', CX + (R - 20) * Math.sin(a)); hand.setAttribute('y2', CY - (R - 20) * Math.cos(a));
    minLab.firstChild.innerHTML = Math.round(m) + ' min';
  };
  const BX = 330, BW = W - BX - 50, BY = 104, BH = 66;
  el(stage, 'u2l9-hcap', 'One hour', BX, BY - 32, 200, 28);
  const frame = el(stage, 'u2l9-hbar', '', BX, BY, BW, BH);
  const fill = el(stage, 'u2l9-hfill', '<span></span>', BX, BY, 0, BH);
  [[0, '0 h', ''], [0.25, '0.25 h', '15 min'], [0.5, '0.5 h', '30 min'], [0.75, '0.75 h', '45 min'], [1, '1 h', '60 min']].forEach(([f, a, b]) => {
    add(stage, box(h('div', 'u2l9-htick'), 0, BH + 12), BX + f * BW, BY);
    cb(stage, 'u2l9-hlab', `<b>${a}</b>${b ? `<small>${b}</small>` : ''}`, BX + f * BW - 50, BY + BH + 14, 100, 50);
  });
  void frame;
  const setBar = (f) => { fill.style.width = f * BW + 'px'; };
  return { setMin, setBar, fill, BX, BW };
}
function timeSteps(stage, k, ex) {
  const W = ex.W, K = clockKit(stage, ex);
  const head = hide(el(stage, 'u2l9-line', '', K.BX, 14, K.BW, 44));
  const res = hide(cb(stage, 'u2l9-res', '', K.BX, 262, K.BW, 54));
  const lab = (s) => { K.fill.firstChild.innerHTML = s; };
  void W;
  if (k === 'a1') {
    head.firstChild.innerHTML = '2 h 40 min = <b>2 h</b> + <span class="u2l9-r">40 min</span>';
    res.firstChild.innerHTML = `2 h 40 min ${T('\\approx')} <b>2.67 h</b>`;
    return [
      { cap: '2 h 40 min: the <b>2 whole hours</b> stay. Change only the <b>40 min</b>.', run: (c) => c.fadeIn(head) },
      { cap: 'On the clock, 40 min is <b>40 of the 60 minutes</b> in an hour.', run: (c) => tween(c, 1300, (t) => K.setMin(40 * t)) },
      { cap: `Fill the same part of the hour bar: ${T('40\\div60=0.666\\ldots\\approx0.67')}.`, run: (c) => { lab('0.67 h'); return tween(c, 1000, (t) => K.setBar(t * 40 / 60)); } },
      { cap: `So 2 h 40 min ${T('\\approx')} <b>2.67 h</b>. Not 2.40 h: 40 min is <b>not</b> 0.40 h.`, run: (c) => c.pop(res) }
    ];
  }
  head.firstChild.innerHTML = '4.2 h = <b>4 h</b> + <span class="u2l9-r">0.2 h</span>';
  res.firstChild.innerHTML = '4.2 h = <b>4 h 12 min</b>';
  return [
    { cap: '4.2 h: the <b>4 whole hours</b> stay. Change only the <b>0.2 h</b>.', run: (c) => c.fadeIn(head) },
    { cap: 'Fill <b>0.2</b> of the hour bar.', run: (c) => { lab('0.2 h'); return tween(c, 900, (t) => K.setBar(0.2 * t)); } },
    { cap: `The same part of the clock: ${T('0.2\\times60=12')} min.`, run: (c) => tween(c, 1000, (t) => K.setMin(12 * t)) },
    { cap: 'So 4.2 h = <b>4 h 12 min</b>. Not 4 h 20 min: 0.2 h is <b>not</b> 20 min.', run: (c) => c.pop(res) }
  ];
}
function shiftSteps(stage, ex) {
  const W = ex.W, L = 40, U = (W - 80) / 8, X = (t) => L + (t - 8) * U, AY = 150;
  add(stage, box(h('div', 'u2l9-axis'), W - 80, 4), L, AY);
  for (let t = 8; t <= 16; t++) {
    add(stage, box(h('div', 'u2l9-atick'), 0, 12), X(t), AY - 4);
    const t12 = t === 12 ? '12 noon' : t < 12 ? `${t} a.m.` : `${t - 12} p.m.`;
    cb(stage, 'u2l9-alab', `<b>${t12}</b><small>${String(t).padStart(2, '0')}:00</small>`, X(t) - 45, AY + 12, 90, 48);
  }
  const flag = (t, html, cls) => { add(stage, box(h('div', 'u2l9-fline'), 0, AY - 54), X(t), 54); return cb(stage, 'u2l9-flag ' + cls, html, X(t) - 78, 10, 156, 44); };
  flag(8.75, 'Start <b>08:45</b>', 's');
  const fEnd = flag(15.25, 'End <b>15:15</b>', 'e');
  const conv = hide(cb(stage, 'u2l9-conv', '= 3:15 p.m.', X(15.25) - 65, 56, 130, 32));
  const s1 = hide(cb(stage, 'u2l9-seg a', '4 h', X(8.75), 92, 4 * U, 48));
  const s2 = hide(cb(stage, 'u2l9-seg b', '2 h 30 min', X(12.75), 92, 2.5 * U, 48));
  const l1 = hide(el(stage, 'u2l9-line', `In all: 4 h + 2 h 30 min = <b>6 h 30 min</b>`, L, 218, 520, 44));
  const l2 = hide(el(stage, 'u2l9-line', `<span class="u2l9-lunch">30 min unpaid lunch</span> Paid: 6 h 30 min − 30 min = <b>6 h</b>`, L, 268, 600, 44));
  const chq = hide(el(stage, 'u2l9-chq', '<small>PAY TO THE ORDER OF</small><div class="nm">Leah</div><div class="wk">6 h × $15.75</div><b>$0.00</b>', W - 330, 208, 290, 112));
  const amt = chq.querySelector('b');
  void fEnd;
  return [
    { cap: `15:15 is on the 24-hour clock. After 12, subtract 12: ${T('15-12=3')}. The shift ends at <b>3:15 p.m.</b>`, run: (c) => c.pop(conv) },
    { cap: 'Count from 8:45 a.m. to 12:45 p.m.: <b>4 h</b>.', run: (c) => grow(c, s1, 900) },
    { cap: 'Then 12:45 to 3:15 p.m.: <b>2 h 30 min</b>.', run: (c) => grow(c, s2, 700) },
    { cap: 'In all: 6 h 30 min. Take off the <b>unpaid</b> 30 min lunch: <b>6 h</b> paid.', run: async (c) => { await c.fadeIn(l1); await c.fadeIn(l2); } },
    { cap: `Gross pay: ${T('6\\times\\$15.75=\\$94.50')}. Leah earns <b>$94.50</b> for the shift.`, run: async (c) => { await c.pop(chq); await countTo(c, amt, 0, 94.5, 900, (v) => M(v)); } }
  ];
}
const timeCheck = {
  title: 'Minutes ÷ 60, then the shift',
  height: 330,
  minW: 960,
  choices: [{ sep: 'Example 1 check:' }, { v: 'a1', label: '(a)(i) 2 h 40 min' }, { v: 'a2', label: '(a)(ii) 4.2 h' }, { v: 'b', label: '(b) Leah’s shift' }],
  ask: (k) => TC[k].ask,
  make: (stage, k, ex) => (k === 'b' ? shiftSteps(stage, ex) : timeSteps(stage, k, ex))
};

/* =====================================================================================
 * 2. Example 2: a salary cut into pays, a week cut into hours, salary vs hourly
 * ===================================================================================== */
const SA = {
  a: { ask: 'Example 2(a): Ines’s salary is $48 360 a year. How much is each pay if she is paid biweekly? semi-monthly?' },
  b: { ask: 'Example 2(b): Ines earns $48 360 a year and works 40 h a week. What is her hourly equivalent?' },
  c: { ask: 'Example 2(c): another office pays $23.75/h for 37.5 h a week. Which job pays more in a year, $48 360 or this one, and by how much?' }
};
function cutRow(stage, n, x, y, w, hh, cls = '') {
  return Array.from({ length: n }, (_, i) => hide(el(stage, 'u2l9-pc ' + cls, '', x + i * w / n, y, w / n, hh)));
}
const salary = {
  title: 'One salary, cut into pays',
  height: 340,
  minW: 960,
  choices: [{ sep: 'Example 2 check:' }, { v: 'a', label: '(a) Biweekly, semi-monthly' }, { v: 'b', label: '(b) Hourly equivalent' }, { v: 'c', label: '(c) Which job pays more?' }],
  ask: (k) => SA[k].ask,
  make(stage, k, ex) {
    const W = ex.W, LX = 16, BX = 186, BW = W - BX - 24, RH = 56;
    if (k === 'c') {
      const S = (v) => v / 50000 * BW;
      el(stage, 'u2l9-rowlab', 'Salary job<small>$48 360 a year</small>', LX, 24, 166, 60);
      el(stage, 'u2l9-rowlab', 'Hourly job<small>$23.75/h, 37.5 h a week</small>', LX, 114, 166, 60);
      const A = hide(cb(stage, 'u2l9-ybar', M(48360, 0), BX, 26, S(48360), RH));
      const B = hide(cb(stage, 'u2l9-ybar b', M(46312.5), BX, 116, S(46312.5), RH));
      const wk = hide(el(stage, 'u2l9-line sm', `One week: ${T('\\$23.75\\times37.5=\\$890.625')}`, BX, 186, 470, 40));
      const gap = hide(el(stage, 'u2l9-gap', '', BX + S(46312.5), 116, S(48360) - S(46312.5), RH));
      const gl = hide(cb(stage, 'u2l9-blab r', M(2047.5) + ' more', BX + S(48360) - 220, 186, 220, 40));
      const r1 = hide(cb(stage, 'u2l9-cmp', `Salary job: <b>$23.25</b>/h × <b>40 h</b>`, LX, 262, 330, 52));
      const r2 = hide(cb(stage, 'u2l9-cmp b', `Hourly job: <b>$23.75</b>/h × <b>37.5 h</b>`, LX + 346, 262, 330, 52));
      const st = hide(stamp(stage, 'Salary pays more', { ok: true, x: W - 150, y: 288, rotate: -5, size: 'sm' }));
      return [
        { cap: 'Salary job: <b>$48 360</b> a year.', run: (c) => grow(c, A, 800) },
        { cap: `Hourly job, one week: ${T('\\$23.75\\times37.5=\\$890.625')}. Keep every decimal for now.`, run: (c) => c.fadeIn(wk) },
        { cap: `A year is 52 weeks: ${T('\\$890.625\\times52=\\$46\\,312.50')}.`, run: (c) => grow(c, B, 800) },
        { cap: `Difference: ${T('\\$48\\,360-\\$46\\,312.50=\\$2\\,047.50')}. The <b>salary job</b> pays more.`, run: async (c) => { await c.pop(gap); await c.fadeIn(gl); await stampIn(c, st); } },
        { cap: 'Why? The hourly job has a <b>higher rate</b>, but <b>fewer hours</b> each week.', run: async (c) => { await c.pop(r1); await c.pop(r2); } }
      ];
    }
    el(stage, 'u2l9-rowlab', '1 year', LX, 24, 166, RH);
    const Y = hide(cb(stage, 'u2l9-ybar', '$48&#8239;360 a year', BX, 24, BW, RH));
    if (k === 'a') {
      el(stage, 'u2l9-rowlab', 'Biweekly<small>every 2 weeks: 26 pays</small>', LX, 108, 166, RH);
      el(stage, 'u2l9-rowlab', 'Semi-monthly<small>twice a month: 24 pays</small>', LX, 192, 166, RH);
      const p26 = cutRow(stage, 26, BX, 108, BW, RH), p24 = cutRow(stage, 24, BX, 192, BW, RH, 'b');
      const r1 = hide(cb(stage, 'u2l9-res', `Biweekly: ${T('48\\,360\\div26=\\$1\\,860.00')}`, LX, 272, (W - 48) / 2, 52));
      const r2 = hide(cb(stage, 'u2l9-res', `Semi-monthly: ${T('48\\,360\\div24=\\$2\\,015.00')}`, LX + (W - 48) / 2 + 16, 272, (W - 48) / 2, 52));
      return [
        { cap: 'Ines earns <b>$48 360</b> a year. Draw the year as one bar.', run: (c) => grow(c, Y, 800) },
        { cap: '<b>Biweekly</b> means every 2 weeks: <b>26 pays</b> a year. Cut the year into 26 equal pieces.', run: (c) => popAll(c, p26, 28) },
        { cap: `Each pay: ${T('48\\,360\\div26=\\$1\\,860.00')}.`, run: async (c) => { p26[0].classList.add('hl'); await c.pop(r1); } },
        { cap: '<b>Semi-monthly</b> means twice a month: <b>24 pays</b> a year.', run: (c) => popAll(c, p24, 30) },
        { cap: `Each pay: ${T('48\\,360\\div24=\\$2\\,015.00')}. Fewer pays, so each pay is <b>bigger</b>.`, run: async (c) => { p24[0].classList.add('hl'); await c.pop(r2); } }
      ];
    }
    el(stage, 'u2l9-rowlab', 'Weekly<small>52 weeks</small>', LX, 108, 166, RH);
    el(stage, 'u2l9-rowlab', '1 week<small>40 hours</small>', LX, 210, 166, RH);
    const p52 = cutRow(stage, 52, BX, 108, BW, RH), p40 = cutRow(stage, 40, BX, 210, BW, RH, 'b');
    const zs = svgAt(stage, W, 340, 0, 0);
    const zoom = hide(svgEl('polygon', { points: `${BX},${108 + RH} ${BX + BW / 52},${108 + RH} ${BX + BW},210 ${BX},210`, fill: '#f2c46b', opacity: 0.35 }, zs));
    const r1 = hide(cb(stage, 'u2l9-res', `One week: ${T('48\\,360\\div52=\\$930.00')}`, LX, 280, (W - 48) / 2, 52));
    const r2 = hide(cb(stage, 'u2l9-res', `One hour: ${T('\\$930\\div40=\\$23.25')}`, LX + (W - 48) / 2 + 16, 280, (W - 48) / 2, 52));
    return [
      { cap: 'Ines earns <b>$48 360</b> a year.', run: (c) => grow(c, Y, 800) },
      { cap: 'There are <b>52 weeks</b> in a year. Cut the year into 52 pieces.', run: (c) => popAll(c, p52, 16, 220) },
      { cap: `One week: ${T('48\\,360\\div52=\\$930.00')}.`, run: async (c) => { p52[0].classList.add('hl'); await c.pop(r1); } },
      { cap: 'Zoom in on one week. She works <b>40 h</b> a week, so cut the week into 40 hours.', run: async (c) => { await c.anim(zoom, [{ opacity: 0 }, { opacity: 0.35 }], 400); await popAll(c, p40, 18, 220); } },
      { cap: `One hour: ${T('\\$930\\div40=\\$23.25')}. Her hourly equivalent is <b>$23.25</b> an hour.`, run: async (c) => { p40[0].classList.add('hl'); await c.pop(r2); } }
    ];
  }
};

/* =====================================================================================
 * 3. Example 3: overtime by the day and by the week
 * ===================================================================================== */
const OT = {
  w1: { ask: 'Example 3(a)–(b): Tyler works 10, 8, 9, 8, 11 and 0 h (Monday to Saturday) at $18.40/h, with time and a half for overtime. How many overtime hours does he get? What is his gross pay?', hrs: [10, 8, 9, 8, 11, 0] },
  w2: { ask: 'Example 3(c): the next week Tyler works 9 h a day Monday to Friday and 6 h on Saturday. How many overtime hours does he get now? What is his gross pay?', hrs: [9, 9, 9, 9, 9, 6] }
};
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const overtime = {
  title: 'Count it by the day, count it by the week',
  height: 384,
  minW: 960,
  choices: [{ sep: 'Example 3 check:' }, { v: 'w1', label: '(a)–(b) Week 1' }, { v: 'w2', label: '(c) Week 2' }],
  ask: (k) => OT[k].ask,
  make(stage, k, ex) {
    const W = ex.W, hrs = OT[k].hrs, rate = 18.4, otr = rnd(rate * 1.5);
    const total = hrs.reduce((a, b) => a + b, 0), overs = hrs.map((x) => Math.max(0, x - 8)), daily = overs.reduce((a, b) => a + b, 0);
    const weekly = Math.max(0, total - 44), ot = Math.max(daily, weekly), reg = total - ot, useDaily = daily >= weekly;
    const regPay = rnd(reg * rate), otPay = rnd(ot * otr), gross = rnd(regPay + otPay);
    const dSum = overs.filter((x) => x > 0).join('+') + '=' + daily;
    const X0 = 70, CW = 60, GP = 20, PH = 21, BASE = 268, SU = (6 * (CW + GP) - GP) / 52;
    // day bars
    const line8 = hide(add(stage, box(h('div', 'u2l9-l8'), 6 * (CW + GP) + 4, 0), X0 - 12, BASE - 8 * PH));
    const l8 = hide(cb(stage, 'u2l9-l8lab', '8 h', 8, BASE - 8 * PH - 16, 54, 32));
    const bars = hrs.map((x, i) => {
      const bx = X0 + i * (CW + GP), r = Math.min(8, x), o = Math.max(0, x - 8);
      const rb = hide(el(stage, 'u2l9-day', '', bx, BASE - r * PH, CW, r * PH));
      const ob = o ? hide(cb(stage, 'u2l9-day o', `+${o}`, bx, BASE - x * PH, CW, o * PH)) : null;
      const top = hide(cb(stage, 'u2l9-dtop', `${x} h`, bx - 10, BASE - x * PH - 28, CW + 20, 26));
      cb(stage, 'u2l9-dlab', DAYS[i], bx - 6, BASE + 6, CW + 12, 26);
      return { rb, ob, top };
    });
    // the week strip
    const SY = 318;
    el(stage, 'u2l9-dlab', 'Week', 4, SY + 6, 62, 30);
    const wa = hide(cb(stage, 'u2l9-wk', `${total} h in the week`, X0, SY, Math.min(total, 44) * SU, 40));
    const wb = weekly ? hide(cb(stage, 'u2l9-wk o', `+${weekly}`, X0 + 44 * SU, SY, weekly * SU, 40)) : null;
    const m44 = hide(add(stage, box(h('div', 'u2l9-m44'), 0, 54), X0 + 44 * SU, SY - 7));
    const m44l = hide(cb(stage, 'u2l9-m44l', '44 h', X0 + 44 * SU - 30, SY + 46, 60, 22));
    // the right panel
    const RX = 570, RW = W - RX - 16;
    const cd = hide(el(stage, 'u2l9-rule', `<b>By the day:</b><span>${T(dSum)} h</span>`, RX, 8, RW, 64));
    const cw = hide(el(stage, 'u2l9-rule', `<b>By the week:</b><span>${T(`${total}-44=${weekly}`)} h</span>`, RX, 80, RW, 64));
    const st = hide(stamp(stage, 'Use this', { ok: true, x: RX + RW - 70, y: (useDaily ? 8 : 80) + 32, rotate: -8, size: 'sm' }));
    const L = [
      `Regular: ${T(`${reg}\\times\\$18.40=\\$${regPay.toFixed(2)}`)}`,
      `Overtime rate: ${T(`\\$18.40\\times1.5=\\$${otr.toFixed(2)}`)}/h`,
      `Overtime: ${T(`${ot}\\times\\$${otr.toFixed(2)}=\\$${otPay.toFixed(2)}`)}`
    ].map((s, i) => hide(el(stage, 'u2l9-line sm', s, RX, 156 + i * 44, RW, 40)));
    const res = hide(cb(stage, 'u2l9-res sm', `Gross: ${T(`${TMo(regPay)}+${TMo(otPay)}=${TMo(gross)}`)}`, RX, 292, RW, 52));
    return [
      { cap: `Tyler’s week: <b>${hrs.join(', ')}</b> h. One bar for each day.`,
        run: async (c) => { await Promise.all(bars.map((b, i) => (async () => { await growUp(c, b.rb, 450, { delay: i * 70 }); if (b.ob) await growUp(c, b.ob, 250); await c.fadeIn(b.top, 200); })())); } },
      { cap: `<b>By the day:</b> the hours over 8 turn orange. ${T(dSum)} h over 8.`,
        run: async (c) => { await c.fadeIn(line8, 300); await c.fadeIn(l8, 200); bars.forEach((b) => { if (b.ob) b.ob.classList.add('on'); }); await Promise.all(bars.filter((b) => b.ob).map((b) => pulse(c, b.ob, 1.08))); await c.pop(cd); } },
      { cap: `<b>By the week:</b> ${total} h in all. Over 44: ${T(`${total}-44=${weekly}`)} h.`,
        run: async (c) => { await grow(c, wa, 700); if (wb) { await grow(c, wb, 300); wb.classList.add('on'); } await c.fadeIn(m44, 200); await c.fadeIn(m44l, 200); await c.pop(cw); } },
      { cap: `Use the <b>bigger</b> one: <b>${ot} h</b> of overtime. Regular hours: ${T(`${total}-${ot}=${reg}`)} h.`,
        run: async (c) => { (useDaily ? cd : cw).classList.add('win'); (useDaily ? cw : cd).classList.add('dim'); await stampIn(c, st); } },
      { cap: `Regular pay: ${T(`${reg}\\times\\$18.40=\\$${regPay.toFixed(2)}`)}. Overtime rate: ${T('\\$18.40\\times1.5=\\$27.60')}/h.`,
        run: async (c) => { await c.fadeIn(L[0]); await c.fadeIn(L[1]); } },
      { cap: `Overtime pay: ${T(`${ot}\\times\\$27.60=\\$${otPay.toFixed(2)}`)}. Gross pay: <b>${M(gross)}</b>.`,
        run: async (c) => { await c.fadeIn(L[2]); await c.pop(res); } }
    ];
  }
};

/* =====================================================================================
 * 4. Example 4: piecework (a tree counter) and a contract (bid − costs, ÷ hours)
 * ===================================================================================== */
const TREE = '<path d="M20 4 L34 26 H27 L36 40 H4 L13 26 H6 Z" fill="#2f7a45" stroke="#1d5a31" stroke-width="2" stroke-linejoin="round"/><rect x="17" y="40" width="6" height="8" fill="#7a4a24"/>';
const CO = {
  kiri: { ask: 'Example 4(a): Kiri plants trees in northern Alberta for $0.16 a tree. One day she plants 1 850 trees in 9.5 h. What does she earn, and what is that per hour?' },
  owen: { ask: 'Example 4(b)–(c): Owen bids $1 400 to stain a fence and deck. Stain and supplies cost $265. He pays a helper $20.00/h for 12 h, and he works 16 h himself. What is his profit, and his effective hourly rate?' }
};
const contract = {
  title: 'Paid by the piece, paid by the job',
  height: 350,
  minW: 960,
  choices: [{ sep: 'Example 4 check:' }, { v: 'kiri', label: '(a) Kiri’s trees' }, { v: 'owen', label: '(b)–(c) Owen’s fence' }],
  ask: (k) => CO[k].ask,
  make(stage, k, ex) {
    const W = ex.W;
    if (k === 'kiri') {
      const cnt = el(stage, 'u2l9-odo', '<small>TREES</small><b>0</b>', 20, 10, 260, 52);
      el(stage, 'u2l9-note2', 'Each little tree stands for <b>50</b> trees.', 296, 18, 200, 44);
      const trees = Array.from({ length: 37 }, (_, i) => {
        const s = svgEl('svg', { viewBox: '0 0 40 48', width: 38, height: 46, class: 'u2l9-svg' }); s.innerHTML = TREE;
        return hide(add(stage, s, 22 + (i % 10) * 47, 80 + Math.floor(i / 10) * 56));
      });
      const RX = 520, RW = W - RX - 20;
      const l1 = hide(el(stage, 'u2l9-line', `${T('1\\,850\\times\\$0.16=\\$296.00')}`, RX, 14, RW, 46));
      const l2 = hide(el(stage, 'u2l9-line', `${T('\\$296\\div9.5=31.157\\ldots\\approx\\$31.16')}/h`, RX, 70, RW, 46));
      const S = (v) => v / 34 * (RW - 10);
      const bk = hide(cb(stage, 'u2l9-hb k', 'Kiri: <b>$31.16</b>/h', RX, 160, S(31.16), 50));
      const bm = hide(cb(stage, 'u2l9-hb m', '<b>$15.00</b>/h', RX, 222, S(15), 50));
      const bml = hide(el(stage, 'u2l9-line sm', 'Alberta minimum wage', RX + S(15) + 12, 227, RW - S(15) - 12, 40));
      return [
        { cap: 'Kiri plants <b>1 850 trees</b> in one day.', run: (c) => tween(c, 1800, (t) => { cnt.querySelector('b').textContent = grp(String(Math.round(1850 * t))); trees.forEach((e, i) => { e.style.opacity = t * 37 > i ? 1 : 0; }); }, (t) => t) },
        { cap: `Piecework: trees × pay per tree. ${T('1\\,850\\times\\$0.16=\\$296.00')}.`, run: (c) => c.fadeIn(l1) },
        { cap: `She planted for 9.5 h. Per hour: ${T('\\$296\\div9.5=31.157\\ldots\\approx\\$31.16')}.`, run: (c) => c.fadeIn(l2) },
        { cap: 'That is more than <b>double</b> the $15.00 minimum wage. The faster she plants, the more she earns.', run: async (c) => { await grow(c, bm, 500); await c.fadeIn(bml, 250); await grow(c, bk, 800); } }
      ];
    }
    const BX = 40, BW = W - 80, S = (v) => v / 1400 * BW, BY = 40, BH = 62;
    const whole = hide(cb(stage, 'u2l9-cbar', 'Bid: <b>$1 400</b>', BX, BY, BW, BH));
    const pf = hide(cb(stage, 'u2l9-cbar', '', BX, BY, S(895), BH));
    const hp = hide(cb(stage, 'u2l9-cbar', 'helper <b>$240</b>', BX + S(895), BY, S(240), BH));
    const sn = hide(cb(stage, 'u2l9-cbar', 'stain <b>$265</b>', BX + S(1135), BY, S(265), BH));
    const costL = hide(cb(stage, 'u2l9-blab r', 'costs', BX + S(895) - 100, 146, 90, 50));
    const d16 = Array.from({ length: 15 }, (_, i) => hide(add(stage, box(h('div', 'u2l9-div'), 0, BH), BX + S(895) * (i + 1) / 16, BY)));
    const d20 = Array.from({ length: 19 }, (_, i) => hide(add(stage, box(h('div', 'u2l9-div b'), 0, BH), BX + S(895) * (i + 1) / 20, BY)));
    const one16 = hide(el(stage, 'u2l9-hr1', '', BX, BY, S(895) / 16, BH)), one20 = hide(el(stage, 'u2l9-hr1 b', '', BX, BY, S(895) / 20, BH));
    const r1 = hide(cb(stage, 'u2l9-res', `16 h: ${T('\\$895\\div16=55.9375\\approx\\$55.94')} per hour`, BX, 222, 600, 50));
    const r2 = hide(cb(stage, 'u2l9-res b', `20 h: ${T('\\$895\\div20=\\$44.75')} per hour`, BX, 284, 600, 50));
    const rain = hide(el(stage, 'u2l9-rain', '<svg viewBox="0 0 120 80" width="120" height="80"><ellipse cx="60" cy="30" rx="44" ry="20" fill="#9aa6b8"/><ellipse cx="38" cy="34" rx="26" ry="16" fill="#aab5c6"/><ellipse cx="84" cy="36" rx="24" ry="14" fill="#aab5c6"/><path d="M40 56 l-6 14 M60 56 l-6 14 M80 56 l-6 14" stroke="#1f5bd6" stroke-width="4" stroke-linecap="round"/></svg>', W - 200, 220, 120, 80));
    return [
      { cap: 'Owen’s bid: the customer pays <b>$1 400</b> for the whole job.', run: (c) => grow(c, whole, 800) },
      { cap: 'Take off the stain and supplies: <b>$265</b>.',
        run: async (c) => { [pf, hp, sn].forEach((e) => { e.style.opacity = 1; }); whole.style.opacity = 0; sn.classList.add('cost'); await moveTo(c, sn, BX + S(1135), 146, 700); } },
      { cap: `Take off the helper: ${T('12\\times\\$20=\\$240')}.`, run: async (c) => { hp.classList.add('cost'); await moveTo(c, hp, BX + S(895), 146, 700); await c.fadeIn(costL, 250); } },
      { cap: `Profit: ${T('\\$1\\,400-\\$265-\\$240=\\$895')}. That is what Owen keeps.`, run: async (c) => { pf.classList.add('profit'); pf.firstChild.innerHTML = 'profit <b>$895</b>'; await pulse(c, pf, 1.04); } },
      { cap: `Owen works 16 h. Cut the profit into 16 pieces: ${T('\\$895\\div16=55.9375\\approx\\$55.94')} per hour.`,
        run: async (c) => { await popAll(c, d16, 40, 200); await c.fadeIn(one16, 250); await c.pop(r1); } },
      { cap: `(c) Rain! Say the job takes him <b>20 h</b>. He still gets $1400: ${T('\\$895\\div20=\\$44.75')} per hour. A long job pays <b>less per hour</b>.`,
        run: async (c) => { await c.pop(rain); await Promise.all(d16.concat([one16]).map((e) => fadeOut(c, e, 250))); await popAll(c, d20, 35, 200); await c.fadeIn(one20, 250); await c.pop(r2); } }
    ];
  }
};

/* =====================================================================================
 * 5. Example 5: the sales bar, coloured by what earns commission
 * ===================================================================================== */
const CM = {
  hana: { ask: 'Example 5(a): Hana sells phones for a straight commission of 6%. Her sales are $14 250. What does she earn?', max: 15000 },
  diego: { ask: 'Example 5(b): Diego earns $1 800 a month plus 2.5% on sales over a quota of $20 000. His sales are $34 600. What does he earn?', max: 35000 },
  sofia: { ask: 'Example 5(c): Sofia earns 3% on the first $10 000 of sales and 5% on the rest. Her sales are $26 400. What does she earn?', max: 30000 }
};
const commission = {
  title: 'Which part of the sales earns commission?',
  height: 336,
  minW: 960,
  choices: [{ sep: 'Example 5 check:' }, { v: 'hana', label: '(a) Hana: straight' }, { v: 'diego', label: '(b) Diego: over a quota' }, { v: 'sofia', label: '(c) Sofia: graduated' }],
  ask: (k) => CM[k].ask,
  make(stage, k, ex) {
    const W = ex.W, d = CM[k], X0 = 60, AW = W - 120, X = (v) => X0 + v / d.max * AW, BY = 58, BH = 62, AY = 128;
    add(stage, box(h('div', 'u2l9-axis'), AW, 3), X0, AY);
    for (let v = 0; v <= d.max; v += 5000) {
      add(stage, box(h('div', 'u2l9-atick'), 0, 10), X(v), AY - 3);
      cb(stage, 'u2l9-alab', `<b>${M(v, 0)}</b>`, X(v) - 50, AY + 10, 100, 26);
    }
    const seg = (a, b, html) => hide(cb(stage, 'u2l9-sbar', html, X(a), BY, X(b) - X(a), BH));
    const top = (a, b, html, cls = '') => hide(cb(stage, 'u2l9-tier ' + cls, html, X(a), BY - 46, X(b) - X(a), 40));
    const lines = (arr) => arr.map((s, i) => hide(el(stage, 'u2l9-line', s, X0, 182 + i * 48, AW, 44)));
    const RES = (html) => hide(cb(stage, 'u2l9-res', html, X0, 280, 520, 50));
    if (k === 'hana') {
      const s = seg(0, 14250, 'sales <b>$14&#8239;250</b>'), t = top(0, 14250, '6% on <b>all</b> of it', 'g');
      const r = RES(`${T('\\$14\\,250\\times0.06=\\$855.00')}`);
      return [
        { cap: 'Hana’s sales this month: <b>$14 250</b>.', run: (c) => grow(c, s, 900) },
        { cap: '<b>Straight commission:</b> she earns 6% of <b>all</b> her sales.', run: async (c) => { s.classList.add('earn'); await c.fadeIn(t); } },
        { cap: `${T('\\$14\\,250\\times0.06=\\$855.00')}. Hana earns <b>$855.00</b>.`, run: (c) => c.pop(r) }
      ];
    }
    if (k === 'diego') {
      const s1 = seg(0, 20000, '<b>$20&#8239;000</b>'), s2 = seg(20000, 34600, '<b>$14&#8239;600</b>');
      const t1 = top(0, 20000, 'quota: <b>no</b> commission', 'n'), t2 = top(20000, 34600, '2.5% on this part', 'g');
      const q = hide(add(stage, box(h('div', 'u2l9-qline'), 0, BH + 64), X(20000), BY - 50));
      const [l1, l2] = lines([`Over the quota: ${T('\\$34\\,600-\\$20\\,000=\\$14\\,600')}`, `Commission: ${T('\\$14\\,600\\times0.025=\\$365.00')}`]);
      const r = RES(`Total: ${T('\\$1\\,800+\\$365=\\$2\\,165.00')}`);
      return [
        { cap: 'Diego’s sales this month: <b>$34 600</b>.', run: async (c) => { await grow(c, s1, 600); await grow(c, s2, 450); } },
        { cap: 'The first <b>$20 000</b> is the quota. There is <b>no</b> commission on it.', run: async (c) => { s1.classList.add('none'); await c.fadeIn(q, 250); await c.fadeIn(t1); } },
        { cap: `Over the quota: ${T('\\$34\\,600-\\$20\\,000=\\$14\\,600')}. He gets 2.5% of this part.`, run: async (c) => { s2.classList.add('earn'); await c.fadeIn(t2); await c.fadeIn(l1); } },
        { cap: `Commission: ${T('\\$14\\,600\\times0.025=\\$365.00')}.`, run: (c) => c.fadeIn(l2) },
        { cap: `Add his salary: ${T('\\$1\\,800+\\$365=\\$2\\,165.00')}. Diego earns <b>$2 165.00</b>.`, run: (c) => c.pop(r) }
      ];
    }
    const s1 = seg(0, 10000, '<b>$10&#8239;000</b>'), s2 = seg(10000, 26400, '<b>$16&#8239;400</b>');
    const t1 = top(0, 10000, '3% on this part', 'b'), t2 = top(10000, 26400, '5% on the rest', 'o');
    const [l1, l2] = lines([`First part: ${T('\\$10\\,000\\times0.03=\\$300.00')}`, `The rest: ${T('\\$26\\,400-\\$10\\,000=\\$16\\,400')}; ${T('\\$16\\,400\\times0.05=\\$820.00')}`]);
    const r = RES(`Total: ${T('\\$300+\\$820=\\$1\\,120.00')}`);
    return [
      { cap: 'Sofia’s sales this month: <b>$26 400</b>.', run: async (c) => { await grow(c, s1, 500); await grow(c, s2, 600); } },
      { cap: `The first $10 000 earns 3%: ${T('\\$10\\,000\\times0.03=\\$300.00')}.`, run: async (c) => { s1.classList.add('t1'); await c.fadeIn(t1); await c.fadeIn(l1); } },
      { cap: `The rest earns 5%: ${T('\\$26\\,400-\\$10\\,000=\\$16\\,400')}, and ${T('\\$16\\,400\\times0.05=\\$820.00')}.`, run: async (c) => { s2.classList.add('t2'); await c.fadeIn(t2); await c.fadeIn(l2); } },
      { cap: `Total: ${T('\\$300+\\$820=\\$1\\,120.00')}. Sofia earns <b>$1 120.00</b>.`, run: (c) => c.pop(r) }
    ];
  }
};

/* =====================================================================================
 * 6. Example 6: the tip jar shared by hours, and Jas's night shifts
 * ===================================================================================== */
const JAR = '<path d="M30 24 H140 V44 Q160 60 160 96 V214 Q160 236 138 236 H32 Q10 236 10 214 V96 Q10 60 30 44 Z" fill="#eef6fb" stroke="#5b6470" stroke-width="5" stroke-linejoin="round"/><rect x="24" y="8" width="122" height="20" rx="6" fill="#9a6a24"/><g fill="#e0b84a" stroke="#8a6a14" stroke-width="2"><ellipse cx="50" cy="214" rx="20" ry="8"/><ellipse cx="88" cy="216" rx="20" ry="8"/><ellipse cx="124" cy="213" rx="20" ry="8"/><ellipse cx="68" cy="202" rx="20" ry="8"/><ellipse cx="106" cy="201" rx="20" ry="8"/><ellipse cx="86" cy="189" rx="20" ry="8"/></g><rect x="40" y="120" width="54" height="30" rx="4" fill="#9fd3a8" stroke="#12805a" stroke-width="2.5" transform="rotate(-14 67 135)"/><rect x="76" y="140" width="54" height="30" rx="4" fill="#9fd3a8" stroke="#12805a" stroke-width="2.5" transform="rotate(10 103 155)"/>';
const EX6 = {
  tips: { ask: 'Example 6(a): three servers pool $630 in tips and share them by hours worked. Ana worked 18 h, Ben 12 h and Cole 15 h. How much does each get?' },
  jas: { ask: 'Example 6(b): Jas earns $24.80/h plus a $2.25/h night-shift premium. This week he works 36 h, all on nights, and gets a $150 bonus. What is his gross pay?' }
};
const extras = {
  title: 'Extras on top of the wage',
  height: 320,
  minW: 960,
  choices: [{ sep: 'Example 6 check:' }, { v: 'tips', label: '(a) The tip jar' }, { v: 'jas', label: '(b) Jas’s night shifts' }],
  ask: (k) => EX6[k].ask,
  make(stage, k, ex) {
    const W = ex.W;
    if (k === 'tips') {
      const js = svgEl('svg', { viewBox: '0 0 170 244', width: 160, height: 230, class: 'u2l9-svg' }); js.innerHTML = JAR; const jar = add(stage, js, 20, 20);
      el(stage, 'u2l9-jarlab', '$630', 52, 84, 100, 40);
      const P = [['Ana', 18, 252], ['Ben', 12, 168], ['Cole', 15, 210]], SX = 340, SQ = 22, SG = 4;
      const rows = P.map(([nm, hr, amt], r) => {
        const y = 30 + r * 64;
        el(stage, 'u2l9-rowlab', `${nm}<small>${hr} h</small>`, 214, y, 120, 44);
        const sq = Array.from({ length: hr }, (_, i) => hide(el(stage, 'u2l9-sq', '', SX + i * (SQ + SG), y + 10, SQ, SQ)));
        const tot = hide(el(stage, 'u2l9-tot sm', `${T(`${hr}\\times\\$14=\\$${amt}`)}`, SX + 18 * (SQ + SG) + 14, y, W - (SX + 18 * (SQ + SG) + 14) - 10, 44));
        return { sq, tot };
      });
      const per = hide(cb(stage, 'u2l9-res', '', 214, 238, 400, 52));
      const chk = hide(cb(stage, 'u2l9-note', `Check: ${T('252+168+210=630')} ✓`, 634, 238, W - 650, 52));
      const all = rows.flatMap((r) => r.sq);
      return [
        { cap: 'Ana, Ben and Cole pool <b>$630</b> in tips. One square is one hour worked.', run: (c) => popAll(c, all, 18, 220) },
        { cap: `Count all the hours: ${T('18+12+15=45')} h.`, run: (c) => { per.firstChild.innerHTML = `${T('18+12+15=45')} h in all`; return c.pop(per); } },
        { cap: `Tips per hour: ${T('\\$630\\div45=\\$14.00')}. Every square earns $14.`,
          run: async (c) => { per.firstChild.innerHTML = `${T('\\$630\\div45=\\$14.00')} per hour`; await pulse(c, per, 1.05); all.forEach((e) => e.classList.add('paid')); await pulse(c, jar, 1.04); } },
        { cap: `Ana: ${T('18\\times\\$14=\\$252')}. Ben: ${T('12\\times\\$14=\\$168')}. Cole: ${T('15\\times\\$14=\\$210')}.`, run: async (c) => { for (const r of rows) await c.pop(r.tot); } },
        { cap: `Check: ${T('\\$252+\\$168+\\$210=\\$630')} ✓ All the tips are shared.`, run: (c) => c.pop(chk) }
      ];
    }
    const TX = 40, TW = 130, BOT = 290, PX = 8;
    const base = hide(cb(stage, 'u2l9-tw', '$24.80', TX, BOT - 24.8 * PX, TW, 24.8 * PX));
    const prem = hide(cb(stage, 'u2l9-tw p', '', TX, BOT - 27.05 * PX, TW, 2.25 * PX));
    const bl = hide(el(stage, 'u2l9-line sm', 'wage', TX + TW + 10, BOT - 24.8 * PX / 2 - 20, 90, 40));
    const pl = hide(el(stage, 'u2l9-line sm', '<b class="u2l9-o">+ $2.25</b> night premium', TX + TW + 12, BOT - 27.05 * PX - 12, 230, 40));
    const rl = hide(cb(stage, 'u2l9-res', `${T('\\$27.05')} an hour`, 10, 10, 210, 46));
    const SX = 420, SQ = 32, SG = 6;
    const nights = Array.from({ length: 36 }, (_, i) => hide(el(stage, 'u2l9-night', '', SX + (i % 12) * (SQ + SG), 22 + Math.floor(i / 12) * (SQ + SG), SQ, SQ)));
    el(stage, 'u2l9-note2', '36 night hours', SX, 140, 200, 30);
    const pay = hide(el(stage, 'u2l9-tot big', '$0.00', SX, 176, 300, 56));
    const bonus = hide(cb(stage, 'u2l9-bonus', '+ $150 bonus', SX + 300, 176, 170, 56));
    const res = hide(cb(stage, 'u2l9-res', `Gross: ${T('\\$973.80+\\$150=\\$1\\,123.80')}`, SX, 252, W - SX - 20, 54));
    const pv = pay.firstChild;
    return [
      { cap: 'Jas’s wage: <b>$24.80</b> an hour.', run: async (c) => { await growUp(c, base, 700); await c.fadeIn(bl, 250); } },
      { cap: `Night-shift premium: <b>$2.25</b> more for every night hour. ${T('\\$24.80+\\$2.25=\\$27.05')} an hour.`, run: async (c) => { await c.pop(prem); await c.fadeIn(pl, 250); await c.pop(rl); } },
      { cap: `All 36 h are nights: ${T('36\\times\\$27.05=\\$973.80')}.`,
        run: async (c) => { pay.style.opacity = 1; await tween(c, 1800, (t) => { const n = Math.round(36 * t); nights.forEach((e, i) => { e.style.opacity = i < n ? 1 : 0; }); pv.innerHTML = M(n * 27.05); }, (t) => t); } },
      { cap: `Add the <b>$150</b> bonus for perfect attendance: ${T('\\$973.80+\\$150=\\$1\\,123.80')}.`, run: async (c) => { await c.pop(bonus); await c.pop(res); } }
    ];
  }
};

/* =====================================================================================
 * 7. Example 7: Maya's pay stub, and the gross bar shrinking to net
 * ===================================================================================== */
const PS = {
  a: { ask: 'Example 7(a): Maya works 38 h at $19.50/h. Use CPP 5.95%, EI 1.64% and income tax 15% of taxable income, and $12.50 union dues (before tax). Complete her pay stub.' },
  b: { ask: 'Example 7(b): Maya’s gross pay is $741.00 and her net pay is $562.98. What percent of her gross pay does she take home? Why are they not the same?' }
};
const STUB = [
  ['Gross pay', '38\\times19.50', 741, 'kg'], ['CPP (5.95%)', '741\\times0.0595=44.0895', 44.09, 'kc'], ['EI (1.64%)', '741\\times0.0164=12.1524', 12.15, 'ke'],
  ['Income tax (15%)', '728.50\\times0.15=109.275', 109.28, 'kt'], ['Union dues', '\\text{before tax}', 12.5, 'ku'], ['Total deductions', '44.09+12.15+109.28+12.50', 178.02, 'kd'], ['Net pay', '741.00-178.02', 562.98, 'kn']
];
const payStub = {
  title: 'The pay stub, line by line',
  height: 360,
  minW: 960,
  choices: [{ sep: 'Example 7 check:' }, { v: 'a', label: '(a) The pay stub' }, { v: 'b', label: '(b) Take-home percent' }],
  ask: (k) => PS[k].ask,
  make(stage, k, ex) {
    const W = ex.W;
    if (k === 'b') {
      const X0 = 40, AW = W - 80, BY = 70, BH = 70, X = (p) => X0 + p / 100 * AW;
      el(stage, 'u2l9-hcap', 'Gross pay $741.00 = 100%', X0, BY - 34, 400, 28);
      el(stage, 'u2l9-hbar', '', X0, BY, AW, BH);
      const net = hide(cb(stage, 'u2l9-pbar n', 'net <b>$562.98</b> · <b>76.0%</b>', X0, BY, X(75.98) - X0, BH));
      const ded = hide(cb(stage, 'u2l9-pbar d', '<b>24.0%</b>', X(75.98), BY, X(100) - X(75.98), BH));
      [0, 25, 50, 75, 100].forEach((p) => { add(stage, box(h('div', 'u2l9-htick'), 0, BH + 10), X(p), BY); cb(stage, 'u2l9-alab', `<b>${p}%</b>`, X(p) - 40, BY + BH + 12, 80, 26); });
      const l1 = hide(el(stage, 'u2l9-line', `${T('562.98\\div741\\times100=75.97\\ldots\\approx76.0\\%')}`, X0, 196, AW, 46));
      const chips = ['CPP', 'EI', 'income tax', 'union dues'].map((s, i) => hide(cb(stage, 'u2l9-dchip', s, X0 + i * 150, 270, 138, 46)));
      const why = hide(cb(stage, 'u2l9-note', 'taken off <b>before</b> she is paid', X0 + 606, 270, AW - 606, 46));
      return [
        { cap: `Take-home part: net ÷ gross × 100. ${T('562.98\\div741\\times100=75.97\\ldots\\approx76.0\\%')}.`, run: async (c) => { await c.fadeIn(l1); await grow(c, net, 1000); } },
        { cap: 'The other <b>24.0%</b> is deductions.', run: (c) => c.pop(ded) },
        { cap: 'Why not the same? CPP, EI, income tax and union dues are taken off <b>before</b> she is paid.', run: async (c) => { await popAll(c, chips, 120, 300); await c.fadeIn(why); } }
      ];
    }
    const SX = 16, SW = 540, RY = 52, RH = 42;
    el(stage, 'u2l9-stubbg', '', SX, 6, SW, RY + 7 * RH + 6);
    el(stage, 'u2l9-stubh', 'PAY STUB · Maya · 38 h at $19.50/h', SX + 12, 12, SW - 24, 32);
    const rows = STUB.map(([lab, wk, v, cl], i) => {
      const y = RY + i * RH;
      const r = el(stage, 'u2l9-srow ' + cl + (i >= 5 ? ' strong' : ''), `<span class="u2l9-sdot"></span><span class="u2l9-slab">${lab}</span><span class="u2l9-swk"></span><span class="u2l9-samt"></span>`, SX + 8, y, SW - 16, RH - 4);
      const wkE = r.querySelector('.u2l9-swk'), amE = r.querySelector('.u2l9-samt');
      return { r, wk: wkE, am: amE, fill: () => { wkE.innerHTML = T(wk); amE.innerHTML = M(v); } };
    });
    const BX = 590, BW = W - BX - 24, S = (v) => v / 741 * BW, BY = 80, BH = 64;
    el(stage, 'u2l9-hcap', 'Gross pay', BX, BY - 32, 200, 28);
    const g = hide(cb(stage, 'u2l9-gbar', '', BX, BY, BW, BH));
    // deductions: cut from the right end, in this order: CPP, EI, tax, dues
    const D = [[44.09, 'kc'], [12.15, 'ke'], [109.28, 'kt'], [12.5, 'ku']];
    let right = 741, pile = 0;
    const chunks = D.map(([v, cl]) => { right -= v; const e = hide(el(stage, 'u2l9-chunk ' + cl, '', BX + S(right), BY, S(v), BH)); e.rem = right; e.px = pile; pile += S(v); return e; });
    const pileL = hide(el(stage, 'u2l9-line sm', 'deductions: <b>$178.02</b>', BX + pile + 10, 196, BW - pile - 10, 50));
    el(stage, 'u2l9-hcap', 'Taken off', BX, 168, 200, 26);
    const netL = hide(cb(stage, 'u2l9-res', 'Net pay <b>$562.98</b>', BX, 268, BW, 54));
    const drop = async (c, i) => { const e = chunks[i]; e.style.opacity = 1; const w0 = parseFloat(g.style.width); await Promise.all([moveTo(c, e, BX + e.px, 200, 650), tween(c, 650, (t) => { g.style.width = lerp(w0, S(e.rem), t) + 'px'; })]); };
    return [
      { cap: `Gross pay: ${T('38\\times\\$19.50=\\$741.00')}.`, run: async (c) => { rows[0].fill(); await c.pop(rows[0].am); g.firstChild.innerHTML = '$741.00'; await grow(c, g, 800); } },
      { cap: `CPP: ${T('741\\times0.0595=44.0895\\approx\\$44.09')}.`, run: async (c) => { rows[1].fill(); await c.pop(rows[1].am); await drop(c, 0); } },
      { cap: `EI: ${T('741\\times0.0164=12.1524\\approx\\$12.15')}.`, run: async (c) => { rows[2].fill(); await c.pop(rows[2].am); await drop(c, 1); } },
      { cap: `Income tax is on the <b>taxable income</b>: union dues come off first (before tax). ${T('741.00-12.50=\\$728.50')}, then ${T('728.50\\times0.15=109.275\\approx\\$109.28')}.`, run: async (c) => { rows[3].fill(); await c.pop(rows[3].am); await drop(c, 2); } },
      { cap: 'Union dues are a <b>set amount</b>: <b>$12.50</b>. Before tax, but still a deduction: count them in the total.', run: async (c) => { rows[4].fill(); await c.pop(rows[4].am); await drop(c, 3); } },
      { cap: `Total deductions: ${T('44.09+12.15+109.28+12.50=\\$178.02')}.`, run: async (c) => { rows[5].fill(); await c.pop(rows[5].am); await c.fadeIn(pileL); } },
      { cap: `Net pay: ${T('\\$741.00-\\$178.02=\\$562.98')}. That is Maya’s take-home pay.`,
        run: async (c) => { rows[6].fill(); await c.pop(rows[6].am); g.classList.add('net'); g.firstChild.innerHTML = '$562.98'; await c.pop(netL); } }
    ];
  }
};

/* =====================================================================================
 * 8. Example 8: the undo machine, and Zara's goal (round up)
 * ===================================================================================== */
const BW8 = {
  liam: { ask: 'Example 8(a): Liam was paid $612.00 for 36 h. What is his hourly rate?',
    fw: ['36 h', '× <span class="u2l9-r">?</span>', '$612.00'], fwDone: '× <b>$17</b>', rv: ['$612.00', '÷ 36', '$17.00'], formula: 'rate = pay ÷ hours',
    tw: '\\$612\\div36=\\$17.00', check: '36\\times\\$17=\\$612', what: 'per hour', unk: 1 },
  grace: { ask: 'Example 8(b): Grace earns a straight 4% commission. What must she sell to earn $2 000 in a month?',
    fw: ['<span class="u2l9-r">?</span> sales', '× 0.04', '$2 000'], fwDone: '<b>$50&#8239;000</b>', rv: ['$2 000', '÷ 0.04', '$50&#8239;000'], formula: 'sales = commission ÷ rate',
    tw: '\\$2\\,000\\div0.04=\\$50\\,000', check: '\\$50\\,000\\times0.04=\\$2\\,000', what: 'in sales', unk: 0 }
};
const backwards = {
  title: 'Undo the formula, then check',
  height: 340,
  minW: 960,
  choices: [{ sep: 'Example 8 check:' }, { v: 'liam', label: '(a) Liam’s rate' }, { v: 'grace', label: '(b) Grace’s sales' }, { v: 'zara', label: '(c) Zara’s phone' }],
  ask: (k) => (k === 'zara' ? 'Example 8(c): Zara wants a $1 100 phone, plus 5% GST. After deductions she takes home $13.40 for each hour she works. How many hours must she work?' : BW8[k].ask),
  make(stage, k, ex) {
    const W = ex.W;
    if (k === 'zara') {
      const X0 = 50, AW = W - 100, X = (v) => X0 + v / 1200 * AW, BY = 46, BH = 48;
      el(stage, 'u2l9-hbar', '', X0, BY, AW, BH);
      const fill = el(stage, 'u2l9-sfill', '', X0, BY, 0, BH);
      for (let v = 0; v <= 1200; v += 200) cb(stage, 'u2l9-alab', `<b>${M(v, 0)}</b>`, X(v) - 50, BY + BH + 4, 100, 24);
      const goal = hide(add(stage, box(h('div', 'u2l9-goal'), 0, BH + 26), X(1155), BY - 14));
      const gl = hide(cb(stage, 'u2l9-flag e', 'Goal <b>$1 155.00</b>', X(1155) - 170, 4, 160, 36));
      // the zoom: $1 140 to $1 170
      const ZY = 212, ZH = 52, Z = (v) => X0 + (v - 1140) / 30 * AW;
      const zs = svgAt(stage, W, 340, 0, 0);
      const cone = hide(svgEl('polygon', { points: `${X(1140)},${BY + BH} ${X(1170)},${BY + BH} ${X0 + AW},${ZY} ${X0},${ZY}`, fill: '#f2c46b', opacity: 0.22 }, zs));
      const zf = hide(el(stage, 'u2l9-hbar', '', X0, ZY, AW, ZH));
      const zfill = hide(el(stage, 'u2l9-sfill', '<span></span>', X0, ZY, 0, ZH));
      const zg = hide(add(stage, box(h('div', 'u2l9-goal'), 0, ZH + 16), Z(1155), ZY - 8));
      const zl = [1140, 1145, 1150, 1155, 1160, 1165, 1170].map((v) => hide(cb(stage, 'u2l9-alab', `<b>${grp(String(v))}</b>`, Z(v) - 40, ZY + ZH + 4, 80, 24)));
      const zcap = hide(el(stage, 'u2l9-hcap', 'Zoom in: $1 140 to $1 170', X0, ZY - 30, 300, 26));
      const l1 = hide(el(stage, 'u2l9-line sm', `${T('1\\,155\\div13.40=86.19\\ldots')} h`, X0, 130, 400, 40));
      const sx = hide(stamp(stage, 'Not enough', { ok: false, x: Z(1146), y: ZY + 8, rotate: -6, size: 'sm' }));
      const sk = hide(stamp(stage, '87 h ✓', { ok: true, x: Z(1165.8) + 40, y: ZY - 14, rotate: -6, size: 'sm' }));
      const res = hide(cb(stage, 'u2l9-res', `${T('87\\times\\$13.40=\\$1\\,165.80')} ✓`, W - 470, 128, 420, 46));
      const setV = (v) => { fill.style.width = X(v) - X0 + 'px'; zfill.style.width = Math.max(0, Math.min(AW, Z(v) - X0)) + 'px'; zfill.firstChild.innerHTML = v > 1140 ? M(v) : ''; };
      return [
        { cap: `Cost with GST: ${T('\\$1\\,100\\times1.05=\\$1\\,155.00')}. That is Zara’s goal.`, run: async (c) => { await c.fadeIn(goal, 300); await c.pop(gl); } },
        { cap: `hours = net pay needed ÷ net pay per hour: ${T('1\\,155\\div13.40=86.19\\ldots')}`, run: (c) => c.fadeIn(l1) },
        { cap: `Try 86 h: ${T('86\\times\\$13.40=\\$1\\,152.40')}. Zoom in: it is just short of the goal. <b>Not enough!</b>`,
          run: async (c) => {
            await tween(c, 1200, (t) => { const v = 1152.4 * t; fill.style.width = X(v) - X0 + 'px'; });
            await Promise.all([zf, zg, zcap].concat(zl).map((e) => c.fadeIn(e, 300)).concat([c.anim(cone, [{ opacity: 0 }, { opacity: 0.22 }], 300)]));
            zfill.style.opacity = 1; zfill.classList.add('short'); await tween(c, 800, (t) => setV(lerp(1140, 1152.4, t))); await stampIn(c, sx);
          } },
        { cap: `Round <b>up</b> to 87 h: ${T('87\\times\\$13.40=\\$1\\,165.80')} ✓ Zara must work <b>87 hours</b>.`,
          run: async (c) => { await fadeOut(c, sx, 200); zfill.classList.remove('short'); zfill.classList.add('ok'); await tween(c, 800, (t) => setV(lerp(1152.4, 1165.8, t))); await stampIn(c, sk); await c.pop(res); } }
      ];
    }
    const d = BW8[k], BWd = 210, OW = 170, AG = 56, x0 = (W - (2 * BWd + OW + 2 * AG)) / 2;
    const row = (vals, y, cls) => {
      const xs = [x0, x0 + BWd + AG, x0 + BWd + AG + OW + AG], ws = [BWd, OW, BWd];
      const bx = vals.map((v, i) => hide(cb(stage, 'u2l9-mbox' + (i === 1 ? ' op' : '') + ' ' + cls, v, xs[i], y, ws[i], 70)));
      const ar = [0, 1].map((i) => hide(el(stage, 'u2l9-arr ' + cls, '→', xs[i] + ws[i], y + 14, AG, 42)));
      return { bx, ar };
    };
    el(stage, 'u2l9-hcap', 'Forward: the formula', x0, 6, 300, 26);
    const F = row(d.fw, 34, 'f');
    const rcap = hide(el(stage, 'u2l9-hcap', `Backwards: ${d.formula}`, x0, 124, 520, 26));
    const R = row(d.rv, 152, 'r');
    const chk = hide(cb(stage, 'u2l9-note', `Check: ${T(d.check)} ✓`, x0, 252, 2 * BWd + OW + 2 * AG, 50));
    const st = hide(stamp(stage, '✓', { ok: true, x: x0 + 2 * BWd + OW + 2 * AG - 30, y: 34, rotate: -8 }));
    return [
      { cap: `Forward: ${k === 'liam' ? 'hours × rate = pay' : 'sales × rate = commission'}. One number is missing.`,
        run: async (c) => { for (let i = 0; i < 3; i++) { await c.pop(F.bx[i]); if (i < 2) await c.fadeIn(F.ar[i], 200); } } },
      { cap: `Work backwards: start with the answer and <b>undo</b> the ×. The undo for × is ÷: <b>${d.formula}</b>.`,
        run: async (c) => { await c.fadeIn(rcap, 250); await c.pop(R.bx[0]); await c.fadeIn(R.ar[0], 200); await c.pop(R.bx[1]); } },
      { cap: `${T(d.tw)} ${d.what}.`, run: async (c) => { await c.fadeIn(R.ar[1], 200); R.bx[2].classList.add('got'); await c.pop(R.bx[2]); } },
      { cap: `Check: put it back in. ${T(d.check)} ✓`,
        run: async (c) => { F.bx[d.unk].firstChild.innerHTML = d.fwDone; F.bx[d.unk].classList.add('got'); await pulse(c, F.bx[d.unk], 1.08); await c.pop(chk); await stampIn(c, st); } }
    ];
  }
};

/* =====================================================================================
 * 9. Full notes: practice-test multiple choice, with the mistake behind every wrong choice
 * ===================================================================================== */
const MC = {
  q15: { ask: 'Practice test Q15: 4.6 h is the same as…', opts: ['4 h 6 min', '4 h 60 min', '4 h 36 min', '4 h 40 min'], ans: 2,
    work: '0.6\\times60=36\\text{ min}', why: ['read .6 as 6 min', 'read .6 as 60 min', '', 'took 0.6 h as ⅔ h'], trap: 'The decimal part of an hour is <b>not</b> minutes. Multiply it by 60.' },
  q16: { ask: 'Practice test Q16: a salary of $41 600 a year is paid biweekly. Each pay is…', opts: ['$800.00', '$1 600.00', '$1 733.33', '$3 466.67'], ans: 1,
    work: '41\\,600\\div26=\\$1\\,600.00', why: ['÷ 52: weekly', '', '÷ 24: semi-monthly', '÷ 12: monthly'], trap: 'Biweekly means every 2 weeks: <b>26 pays</b> a year.' },
  q17: { ask: 'Practice test Q17: a worker earns $18.60/h. Her time-and-a-half overtime rate is…', opts: ['$20.10/h', '$37.20/h', '$9.30/h', '$27.90/h'], ans: 3,
    work: '\\$18.60\\times1.5=\\$27.90', why: ['added 1.5', '× 2: double time', 'only the extra half', ''], trap: 'Time and a half: <b>multiply</b> the rate by 1.5.' },
  q18: { ask: 'Practice test Q18: in Alberta, Kim works 10 h a day from Monday to Thursday (40 h) and does not work Friday. How many overtime hours should she be paid?', opts: ['0 h', '8 h', '4 h', '2 h'], ans: 1,
    work: '\\text{day: }4\\times2=8\\text{ h; week: }0\\text{ h}', why: ['used only the week rule', '', 'counted only 2 of the 4 days', 'counted only 1 day'], trap: 'Check <b>both</b> rules, by the day and by the week. Use the bigger.' },
  q19: { ask: 'Practice test Q19: 2% on the first $50 000 of sales and 4% on sales above $50 000. With sales of $80 000, he earns…', opts: ['$1 600', '$3 200', '$2 400', '$2 200'], ans: 3,
    work: '50\\,000\\times0.02+30\\,000\\times0.04=\\$2\\,200', why: ['2% on all of it', '4% on all of it', '3% on all of it', ''], trap: 'Graduated commission: a different rate on <b>each part</b> of the sales.' },
  q20: { ask: 'Practice test Q20: gross pay is $900.00. Deductions are CPP $53.55, EI $14.76 and income tax $135.00. Net pay is…', opts: ['$696.69', '$1 103.31', '$765.00', '$711.45'], ans: 0,
    work: '900-(53.55+14.76+135.00)=\\$696.69', why: ['', 'added the deductions', 'took off only the tax', 'forgot the EI'], trap: 'Net pay = gross − <b>all</b> the deductions.' }
};
const traps = {
  title: 'Spot the trap',
  height: 330,
  minW: 960,
  choices: [{ sep: 'Practice test:' }, { v: 'q15', label: 'Q15 Decimal hours' }, { v: 'q16', label: 'Q16 Biweekly' }, { v: 'q17', label: 'Q17 Overtime rate' }, { v: 'q18', label: 'Q18 Kim’s overtime' }, { v: 'q19', label: 'Q19 Graduated' }, { v: 'q20', label: 'Q20 Net pay' }],
  ask: (k) => MC[k].ask,
  make(stage, k, ex) {
    const d = MC[k], W = ex.W, OW = (W - 50) / 2;
    const tiles = d.opts.map((o, i) => el(stage, 'u2l9-opt', `<b>${'ABCD'[i]}</b><span class="ot">${o.replace(/\$(\d{4})/, (m, n) => '$' + grp(n))}</span><span class="why"></span>`, 16 + (i % 2) * (OW + 18), 8 + Math.floor(i / 2) * 92, OW, 80));
    tiles.forEach((t, i) => { const w = t.querySelector('.why'); w.innerHTML = d.why[i]; hide(w); });
    const work = hide(cb(stage, 'u2l9-res', `Work it out: ${T(d.work)}`, (W - 700) / 2, 202, 700, 52));
    const tp = hide(cb(stage, 'u2l9-note', d.trap, 16, 266, W - 32, 52));
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

mountExplainers({ chain, timeCheck, salary, overtime, contract, commission, extras, payStub, backwards, traps });

/* ============ Stand Up Break! — mixed review like the unit test, at the whiteboards ============ */
{
  const dd = (v) => rnd(v, 2).toFixed(2);
  const tm = (v) => grp(dd(v)).replace(/\u202f/g, '\\,');           // money digits in TeX
  const tn = (v) => grp(String(v)).replace(/\u202f/g, '\\,');        // a whole number in TeX
  const NAMES = ['Ava', 'Noah', 'Kiran', 'Maya', 'Liam', 'Zara', 'Owen', 'Jasmine', 'Mateo', 'Leah', 'Ravi', 'Sofia'];
  const JOBS = ['a grocery store', 'a coffee shop', 'a hardware store', 'a car wash', 'a pizza place', 'a movie theatre', 'a garden centre'];
  standup('u2l9', {
    intro: 'Mixed review, like the unit test. Write the formula, show every step, then check.',
    levels: {
      BEG: (r) => r.pick([
        () => { // minutes to decimal hours, then pay
          const hh = r.int(3, 8), m = r.pick([15, 30, 45]), rate = r.int(1500, 1990) / 100, hrs = hh + m / 60;
          return { text: `${r.pick(NAMES)} works <b>${hh} h ${m} min</b> at ${r.pick(JOBS)} for <b>$${dd(rate)}/h</b>. Change the time to decimal hours, then find the gross pay.`, q: '',
            a: [`${m}\\div60=${m / 60}\\text{, so }${hrs}\\text{ h}`, `${hrs}\\times${dd(rate)}=\\$${tm(hrs * rate)}`] };
        },
        () => { // decimal hours to minutes
          const hh = r.int(2, 9), dec = r.pick([1, 2, 3, 4, 6, 7, 8, 9]);
          return { text: `Change <b>${hh}.${dec} h</b> to hours and minutes.`, q: '', a: [`0.${dec}\\times60=${dec * 6}\\text{ min}`, `${hh}\\text{ h }${dec * 6}\\text{ min}`] };
        },
        () => { // straight commission
          const sales = r.int(60, 240) * 100, pct = r.pick([3, 4, 5, 6, 8]);
          return { text: `A salesperson earns a straight commission of <b>${pct}%</b>. Her sales this month are <b>$${grp(String(sales))}</b>. What does she earn?`, q: '',
            a: [`${tn(sales)}\\times0.0${pct}=\\$${tm(sales * pct / 100)}`] };
        }
      ])(),
      PRG: (r) => r.pick([
        () => { // Alberta overtime, both ways
          const hrs = Array.from({ length: 5 }, () => r.pick([7, 8, 8, 9, 10, 11])); if (r.chance(0.5)) hrs.push(r.int(4, 8));
          const tot = hrs.reduce((a, b) => a + b, 0), daily = hrs.reduce((a, b) => a + Math.max(0, b - 8), 0), weekly = Math.max(0, tot - 44), ot = Math.max(daily, weekly);
          const rate = r.int(1600, 2400) / 100, otr = rnd(rate * 1.5), g = rnd(rnd((tot - ot) * rate) + rnd(ot * otr));
          return { text: `A worker in Alberta earns <b>$${dd(rate)}/h</b>, with time and a half for overtime. Her hours this week: <b>${hrs.join(', ')}</b>. How many overtime hours does she get? What is her gross pay?`, q: '',
            a: [`\\text{By the day: }${daily}\\text{ h}`, tot > 44 ? `\\text{By the week: }${tot}-44=${weekly}\\text{ h}` : `\\text{By the week: }${tot}\\text{ h is not over }44\\text{, so }0\\text{ h}`, `\\text{Use the bigger: }${ot}\\text{ h; regular: }${tot}-${ot}=${tot - ot}\\text{ h}`,
              `${tot - ot}\\times${dd(rate)}+${ot}\\times${dd(otr)}=\\$${tm(g)}`] };
        },
        () => { // salary per pay period and hourly equivalent
          const wk = r.int(30, 52) * 20, S = wk * 52, [nm, n] = r.pick([['biweekly', 26], ['semi-monthly', 24], ['monthly', 12]]), hrs = r.pick([37.5, 40]);
          return { text: `A salary of <b>$${grp(String(S))}</b> a year is paid <b>${nm}</b>. How much is each pay? The job is ${hrs} h a week: what is the hourly equivalent?`, q: '',
            a: [`${tn(S)}\\div${n}${Math.abs(S / n - rnd(S / n)) < 1e-9 ? '=' : '\\approx'}\\$${tm(S / n)}`, `\\text{Weekly: }${tn(S)}\\div52=\\$${tm(wk)}`, `\\$${tm(wk)}\\div${hrs}${Math.abs(wk / hrs - rnd(wk / hrs)) < 1e-9 ? '=' : '\\approx'}\\$${dd(wk / hrs)}\\text{ an hour}`] };
        },
        () => { // pooled tips
          const per = r.int(9, 16), hs = [r.int(10, 24), r.int(10, 24), r.int(10, 24)], tot = hs.reduce((a, b) => a + b, 0), nm = r.shuffle(NAMES).slice(0, 3);
          return { text: `${nm[0]}, ${nm[1]} and ${nm[2]} share <b>$${per * tot}</b> in tips by hours worked: <b>${hs[0]} h</b>, <b>${hs[1]} h</b> and <b>${hs[2]} h</b>. How much does each get?`, q: '',
            a: [`${hs.join('+')}=${tot}\\text{ h; }${per * tot}\\div${tot}=\\$${per}\\text{ per hour}`, `${hs[0]}\\times${per}=\\$${hs[0] * per},\\ ${hs[1]}\\times${per}=\\$${hs[1] * per},\\ ${hs[2]}\\times${per}=\\$${hs[2] * per}`] };
        }
      ])(),
      MAS: (r) => r.pick([
        () => { // a pay stub
          const hrs = r.pick([30, 32, 35, 36, 37.5, 38, 40]), rate = r.int(1650, 2650) / 100, g = rnd(hrs * rate), dues = r.pick([0, 10, 12.5, 15]);
          const ti = rnd(g - dues), cpp = rnd(g * 0.0595), ei = rnd(g * 0.0164), tax = rnd(ti * 0.15), tot = rnd(cpp + ei + tax + dues), net = rnd(g - tot);
          return { text: `<b>${hrs} h</b> at <b>$${dd(rate)}/h</b>. Deductions: CPP 5.95%, EI 1.64%, income tax 15% of taxable income${dues ? `, and <b>$${dd(dues)}</b> union dues (before tax)` : ''}. Find the gross pay, the total deductions and the net pay.`, q: '',
            a: [`\\text{Gross: }${hrs}\\times${dd(rate)}=\\$${tm(g)}`, ...(dues ? [`\\text{Taxable: }${tm(g)}-${dd(dues)}=\\$${tm(ti)}`] : []), `\\text{CPP }\\$${dd(cpp)},\\ \\text{EI }\\$${dd(ei)},\\ \\text{tax }\\$${dd(tax)}${dues ? `,\\ \\text{dues }\\$${dd(dues)}` : ''}`, `\\text{Total: }\\$${tm(tot)}`, `\\text{Net: }${tm(g)}-${tm(tot)}=\\$${tm(net)}`] };
        },
        () => { // hours needed, round up
          const [item, price] = r.pick([['a laptop', r.int(60, 140) * 10], ['a used dirt bike', r.int(150, 300) * 10], ['concert tickets', r.int(25, 60) * 10], ['a gaming console', r.int(45, 80) * 10]]);
          const per = r.int(1150, 1690) / 100, cost = rnd(price * 1.05), x = cost / per, n = Math.ceil(x - 1e-9);
          return { text: `${r.pick(NAMES)} wants ${item} for <b>$${grp(String(price))}</b> plus 5% GST. After deductions, they take home <b>$${dd(per)}</b> an hour. How many hours must they work?`, q: '',
            a: [`${tn(price)}\\times1.05=\\$${tm(cost)}`, `${tm(cost)}\\div${dd(per)}=${rnd(x, 2)}\\ldots`, `\\text{Round up: }${n}\\text{ h. Check: }${n}\\times${dd(per)}=\\$${tm(n * per)}`] };
        },
        () => { // graduated commission, or salary + commission over a quota
          if (r.chance(0.5)) {
            const t = r.pick([5000, 10000, 20000]), s = t + r.int(20, 160) * 100, p1 = r.pick([2, 3, 4]), p2 = p1 + r.pick([2, 3]);
            const c1 = t * p1 / 100, c2 = (s - t) * p2 / 100;
            return { text: `A salesperson earns <b>${p1}%</b> on the first <b>$${grp(String(t))}</b> of sales and <b>${p2}%</b> on the rest. Her sales are <b>$${grp(String(s))}</b>. What does she earn?`, q: '',
              a: [`${tn(t)}\\times0.0${p1}=\\$${tm(c1)}`, `${tn(s)}-${tn(t)}=${tn(s - t)};\\ ${tn(s - t)}\\times0.0${p2}=\\$${tm(c2)}`, `\\$${tm(c1)}+\\$${tm(c2)}=\\$${tm(c1 + c2)}`] };
          }
          const base = r.pick([1500, 1800, 2000, 2200]), q = r.pick([10000, 15000, 20000]), s = q + r.int(40, 200) * 100, p = r.pick([2, 3, 4, 5]), cm = (s - q) * p / 100;
          return { text: `A rep earns <b>$${grp(String(base))}</b> a month plus <b>${p}%</b> on sales over a quota of <b>$${grp(String(q))}</b>. Sales this month: <b>$${grp(String(s))}</b>. What does he earn?`, q: '',
            a: [`${tn(s)}-${tn(q)}=${tn(s - q)}`, `${tn(s - q)}\\times0.0${p}=\\$${tm(cm)}`, `${tn(base)}+${tm(cm)}=\\$${tm(base + cm)}`] };
        }
      ])()
    }
  });
}
