/* Math 10-3 · Unit 2 · Lesson 2 — Wages and Salaries: Gross Pay and Pay Periods (N2).
 * Explainers:
 *   paycheque  (a paycheque that grows hour by hour as the shift fills, after an estimate; Example 1),
 *   sofia      (Sofia's timesheet fills row by row while her pay keeps a running total; Example 2),
 *   undo       (Full notes: hours × wage = pay, undone by ÷ hours; Example 3),
 *   minWage    (the wage slides along a scale to the right minimum line, verdict stamp; Example 4 — and Tyler's
 *               31 hours split into 28 at $13.00 and 3 at $15.00; Example 5),
 *   payPeriods (a year cut into 52 / 26 / 24 / 12 equal paycheques; Marco's cheques built back into a year; Example 6),
 *   biVsSemi   (Full notes: paydays every 2 weeks vs twice a month on one year: 26 vs 24),
 *   hourlyEq   (52 weeks of 40 h = 2080 h sharing the salary; Jesse's 52 weekly cheques; Example 7),
 *   jobCompare (Job A vs Job B as bars in the same units, with a verdict; Example 8),
 *   mistakes   (Full notes: the two wrong solutions of Example 9 stamped and fixed).
 * Colours: hours amber, money green, salary/year brand brown, minimums blue (students) and brown (everyone), answers red. */
import { h, tex, add, stamp, stampIn, mountExplainers, pop, fadeIn, tween, svgEl, pulse, shake, anim, drawIn, arrowHead, COLORS } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const K = (src) => {
  try { return window.katex.renderToString('\\displaystyle ' + String(src), { throwOnError: false, strict: 'ignore', output: 'html' }); }
  catch (e) { return tex(src); }
};
const INK = COLORS.ink, RED = COLORS.red, BLUE = COLORS.blue, GRN = COLORS.green, AMB = COLORS.amber, BRN = COLORS.brand;
const FA = '#f2b84b', FG = '#9fd3b4', FB = '#a9c4f0';
const hide = (el) => { el.style.opacity = 0; return el; };
const show = (c, el) => fadeIn(c, el, 320);
const lab = (host, x, y, html, cls = '') => { const d = h('div', 'u2l2-abs ' + cls, html); d.style.left = x + 'px'; d.style.top = y + 'px'; host.appendChild(d); return d; };
const pad = (n) => String(n).padStart(2, '0');
/* money from whole cents: 105000 → "$1 050.00" (thin space from 1000 up, like fmt()); TeX and HTML versions */
const grp = (n, sp) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, sp);
const mH = (c) => '$' + grp(Math.floor(Math.round(c) / 100), '&#8201;') + '.' + pad(Math.round(c) % 100);
const mT = (c) => '\\$' + grp(Math.floor(Math.round(c) / 100), '\\,') + '.' + pad(Math.round(c) % 100);
const nT = (n) => grp(n, '\\,'), nH = (n) => grp(n, '&#8201;');
/* an exact product shown like the calculator: hundredths of an hour × cents → "$184.8375" */
const exact4 = (v) => { const s = String(v).padStart(5, '0'), i = s.slice(0, -4), f = s.slice(-4).replace(/0+$/, ''); return grp(i, '\\,') + (f.length < 2 ? '.' + f.padEnd(2, '0') : '.' + f); };
const hrs = (hh) => String(hh / 100);   // 775 → "7.75"

/* =============================== explainer: the paycheque that grows =============================== */
const PC = {
  a: { who: 'Noor', where: 'Garden centre', hh: 600, w: 1640, est: [6, 16], ask: 'Example 1(a): Noor works 6 hours at $16.40/h. What is her gross pay?' },
  b: { who: 'Dev', where: 'Carpentry crew', hh: 775, w: 2385, hm: '7 h 45 min', est: [8, 24], ask: 'Example 1(b): Dev earns $23.85/h and works 7 h 45 min. Estimate, then find his gross pay.' }
};
const paycheque = {
  title: 'A paycheque that grows hour by hour',
  height: 300,
  minW: 940,
  capH: 92,
  choices: [{ sep: 'Example 1 check:' }, { v: 'a', label: '(a) Noor' }, { v: 'b', label: '(b) Dev' }],
  ask: (k) => PC[k].ask,
  make(stage, k) {
    const D = PC[k], H = D.hh / 100, n = Math.ceil(H), bw = 96, x0 = 40, y0 = 34;
    const blocks = Array.from({ length: n }, (_, i) => {
      const b = add(stage, h('div', 'u2l2-abs u2l2-hblk', `<i></i><span>hour ${i + 1}</span>`), x0 + i * (bw + 4), y0); b.style.width = bw + 'px'; return b.querySelector('i');
    });
    const hl = hide(lab(stage, 640, 112, D.hm ? `${D.hm} = <b>${hrs(D.hh)} h</b>` : `<b>${hrs(D.hh)} h</b>`, 'u2l2-hl u2l2-ml'));
    const chq = add(stage, h('div', 'u2l2-abs u2l2-chq', `<div class="top"><b>PAYCHEQUE</b><span>${D.where}</span></div><div class="mid"><span>Pay to: <b>${D.who}</b></span><span class="cx"></span></div><div class="amt"><span>$</span><b>0.00</b></div>`), x0, 128);
    const amt = chq.querySelector('.amt b'), calc = chq.querySelector('.cx');
    const est = hide(lab(stage, 640, 146, `<span class="k">Estimate</span>${K(`${D.est[0]}\\times\\$${D.est[1]}=\\$${D.est[0] * D.est[1]}`)}`, 'u2l2-est'));
    const exactV = D.hh * D.w, cents = Math.round(exactV / 100), isEx = exactV % 100 === 0;
    const st = stamp(stage, `close to $${D.est[0] * D.est[1]} ✓`, { ok: true, x: 780, y: 262, size: 'sm' }); hide(st);
    const grow = (c) => tween(c, 2400, (t) => {
      const hh = D.hh * t; blocks.forEach((b, i) => { b.style.width = Math.max(0, Math.min(1, hh / 100 - i)) * 100 + '%'; });
      amt.textContent = (Math.round(hh * D.w / 100) / 100).toFixed(2); calc.innerHTML = `${(hh / 100).toFixed(2)} h × ${mH(D.w)}`;
    }, (t) => t);
    const steps = [];
    if (D.hm) steps.push({ cap: `Write the hours as a decimal first: ${T('45\\div60=0.75')}, so 7 h 45 min = <b>7.75 h</b>.`, run: (c) => show(c, hl) });
    steps.push({ cap: `Estimate: round to easy numbers. About ${T(`${D.est[0]}\\times\\$${D.est[1]}=\\$${D.est[0] * D.est[1]}`)}.`, run: async (c) => { if (!D.hm) hl.style.opacity = 1; await show(c, est); } });
    steps.push({ cap: `Every hour worked adds <b>${mH(D.w)}</b> to the paycheque. Watch it grow.`, run: (c) => grow(c) });
    steps.push({ cap: `Gross pay ${T(`=${hrs(D.hh)}\\times${mT(D.w)}=${isEx ? mT(cents) : '\\$' + exact4(exactV) + '\\approx' + mT(cents)}`)}. ${D.who} earns <b>${mH(cents)}</b>.`,
      run: async (c) => { amt.textContent = (cents / 100).toFixed(2); calc.innerHTML = `${hrs(D.hh)} h × ${mH(D.w)}`; chq.classList.add('done'); await pulse(c, chq.querySelector('.amt'), 1.08); await stampIn(c, st); } });
    return steps;
  }
};

/* =============================== explainer: Sofia's timesheet =============================== */
const SOFIA = [['Monday', '6:00 a.m.', '2:30 p.m.', 30, 850], ['Tuesday', '7:00 a.m.', '12:00 p.m.', 0, 500], ['Wednesday'], ['Thursday', '10:30 a.m.', '4:45 p.m.', 30, 625], ['Friday', '11:00 a.m.', '7:30 p.m.', 30, 850], ['Saturday', '8:00 a.m.', '12:00 p.m.', 0, 400]];
const sofia = {
  title: 'Sofia’s timesheet and paycheque',
  height: 330,
  minW: 940,
  capH: 92,
  choices: [{ sep: 'Example 2 check:' }, { v: 's', label: 'Sofia’s week' }],
  ask: () => 'Example 2: Sofia earns $17.60/h. Complete her timesheet, then find her gross pay for the week.',
  make(stage) {
    const W = 1760;
    const tb = h('table', 'u2l2-abs u2l2-tsx');
    tb.innerHTML = '<tr><th>Day</th><th>Start</th><th>End</th><th>Unpaid break</th><th>Hours paid</th></tr>' +
      SOFIA.map((r) => (r.length < 2 ? `<tr class="off"><th>${r[0]}</th><td colspan="3">day off</td><td>0</td></tr>` : `<tr><th>${r[0]}</th><td>${r[1]}</td><td>${r[2]}</td><td>${r[3] ? r[3] + ' min' : 'none'}</td><td class="f"></td></tr>`)).join('') +
      '<tr class="tot"><th colspan="4">Total hours</th><td class="t"></td></tr>';
    add(stage, tb, 0, 4);
    const trs = [...tb.querySelectorAll('tr')].slice(1), tcell = tb.querySelector('.t');
    const pan = add(stage, h('div', 'u2l2-abs u2l2-run', `<div class="k">Paycheque so far</div><div class="r">at <b>$17.60/h</b></div><div class="h">0 h</div><div class="m">$0.00</div><div class="x"></div>`), 640, 8);
    const pH = pan.querySelector('.h'), pM = pan.querySelector('.m'), pX = pan.querySelector('.x');
    const steps = [];
    let acc = 0;
    const word = { 850: '8 h 30 min = 8.5 h', 625: '6 h 15 min = 6.25 h', 500: '5 h', 400: '4 h' };
    SOFIA.forEach((r, i) => {
      if (r.length < 2) return;
      const [day, a, b, br, span] = r, paid = span - (br ? 50 : 0); acc += paid; const so = acc;
      steps.push({ cap: `<b>${day}:</b> ${a} to ${b} is ${word[span]}. ${br ? `Take off the 30 min break: ${T(`${hrs(span)}-0.5=${hrs(paid)}`)} h.` : 'No break.'}`,
        run: async (c) => { trs.forEach((x) => x.classList.remove('lit')); trs[i].classList.add('lit'); const f = trs[i].querySelector('.f'); f.textContent = hrs(paid); await pop(c, f); pH.textContent = hrs(so) + ' h'; pM.innerHTML = mH(so * W / 100); await pulse(c, pM, 1.08); } });
    });
    steps.push({ cap: `Total hours: ${T('8+5+5.75+8+4=30.75')} h.`, run: async (c) => { trs.forEach((x) => x.classList.remove('lit')); tcell.textContent = '30.75'; await pop(c, tcell); } });
    steps.push({ cap: `Gross pay ${T('=30.75\\times\\$17.60=\\$541.20')}.`, run: async (c) => { pX.innerHTML = K('30.75\\times\\$17.60=\\$541.20'); pan.classList.add('done'); await show(c, pX); } });
    steps.push({ cap: `Check with an estimate: ${T('31\\times\\$18=\\$558')}. Close ✓ <b>Sofia’s gross pay is $541.20.</b>`, run: (c) => stampIn(c, stamp(stage, 'close to $558 ✓', { ok: true, x: 790, y: 300, size: 'sm' })) });
    return steps;
  }
};

/* =============================== explainer (Full notes): undo the multiplying =============================== */
const undo = {
  title: 'Undo × with ÷',
  height: 280,
  minW: 940,
  choices: [{ v: 'a', label: 'Example 3: Amara' }],
  ask: () => 'Example 3: Amara worked 25.5 hours and earned $446.25. What is her hourly wage?',
  make(stage) {
    const svg = svgEl('svg', { class: 'u2l2-abs', width: 940, height: 280 }); add(stage, svg, 0, 0);
    const bx = (x, y, html, cls) => lab(stage, x, y, html, 'u2l2-box u2l2-mid ' + cls);
    bx(200, 130, '25.5 h', 'hrs'); bx(740, 130, '$446.25', 'pay');
    const top = svgEl('path', { d: 'M300 104 Q470 20 640 104', fill: 'none', stroke: GRN, 'stroke-width': 4 }, svg); const ta = arrowHead(svg, 640, 104, 1, 0.6, { color: GRN, width: 4 });
    const tl = lab(stage, 470, 48, '× hourly wage (?)', 'u2l2-arl u2l2-mid u2l2-g');
    const bot = svgEl('path', { d: 'M640 156 Q470 240 300 156', fill: 'none', stroke: RED, 'stroke-width': 4 }, svg); const ba = arrowHead(svg, 300, 156, -1, -0.6, { color: RED, width: 4 });
    const bl = hide(lab(stage, 470, 226, '÷ 25.5', 'u2l2-arl u2l2-mid u2l2-r'));
    [top, ta, tl, bot, ba].forEach(hide);
    const res = hide(lab(stage, 470, 136, K('\\$446.25\\div25.5=\\mathbf{\\$17.50}'), 'u2l2-eqn u2l2-mid'));
    const st = stamp(stage, 'check ✓', { ok: true, x: 840, y: 240, size: 'sm' }); hide(st);
    return [
      { cap: `Hours <b>×</b> hourly wage = gross pay. We know the hours and the pay, but not the wage.`, run: async (c) => { top.style.opacity = 1; ta.style.opacity = 1; await drawIn(top, 700, c); await show(c, tl); } },
      { cap: `To undo <b>×</b>, go back the other way with <b>÷</b>: divide the pay by the hours.`, run: async (c) => { bot.style.opacity = 1; ba.style.opacity = 1; await drawIn(bot, 700, c); await show(c, bl); } },
      { cap: `Hourly wage ${T('=\\$446.25\\div25.5=\\$17.50')}.`, run: (c) => pop(c, res) },
      { cap: `Check by multiplying: ${T('25.5\\times\\$17.50=\\$446.25')} ✓ Amara earns <b>$17.50/h</b>.`, run: async (c) => { tl.innerHTML = '× $17.50'; await pulse(c, tl, 1.15); await stampIn(c, st); } }
    ];
  }
};

/* =============================== explainer: minimum wage verdicts, and Tyler's split week =============================== */
const MW = {
  a: { who: 'Ben', age: 22, when: 'any time', pay: 45600, h: 32, min: 1500, why: 'Ben is 22, so the minimum is <b>$15.00</b>.' },
  b: { who: 'Lucy', age: 16, when: 'November', pay: 28350, h: 21, min: 1300, why: 'Lucy is under 18, school is in (November) and she works under 28 h: the minimum is <b>$13.00</b>.' },
  c: { who: 'Lucy', age: 16, when: 'July', pay: 37800, h: 28, min: 1500, why: 'July is <b>summer</b>: no school, so the minimum is <b>$15.00</b>, even for Lucy.' }
};
const minWage = {
  title: 'At least minimum wage?',
  height: 300,
  minW: 940,
  capH: 92,
  choices: [{ sep: 'Example 4 check:' }, { v: 'a', label: '(a) Ben' }, { v: 'b', label: '(b) Lucy in November' }, { v: 'c', label: '(c) Lucy in July' }, { sep: 'Example 5:' }, { v: 't', label: 'Tyler’s 31 hours' }],
  ask: (k) => (k === 't' ? 'Example 5: Tyler is 17. His employer pays the lowest wage the law allows. In one week in October he works 31 hours. What is his gross pay?' : `Example 4(${k}): ${MW[k].who} is ${MW[k].age}. ${MW[k].when === 'any time' ? 'He' : `In ${MW[k].when} she`} earned ${mH(MW[k].pay)} for ${MW[k].h} hours. At least minimum wage?`),
  make(stage, k) {
    if (k === 't') return tyler(stage);
    const D = MW[k], wage = D.pay / D.h, ok = wage >= D.min;
    const card = add(stage, h('div', 'u2l2-abs u2l2-id', `<div class="nm">${D.who}<span>age ${D.age}</span></div><div class="ln">${D.when === 'any time' ? 'Car dealership' : 'Bakery · ' + D.when}</div><div class="ln"><b>${mH(D.pay)}</b> for <b>${D.h} h</b></div>`), 20, 10);
    const calc = hide(lab(stage, 20, 170, K(`${mT(D.pay)}\\div${D.h}=\\mathbf{${mT(wage)}}`), 'u2l2-eqn'));
    const svg = svgEl('svg', { class: 'u2l2-abs', width: 940, height: 300 }); add(stage, svg, 0, 0);
    const x0 = 400, x1 = 910, y = 150, px = (cnt) => x0 + (x1 - x0) * (cnt - 1200) / 400;
    svgEl('line', { x1: x0, x2: x1, y1: y, y2: y, stroke: INK, 'stroke-width': 4 }, svg);
    for (let v = 1200; v <= 1600; v += 50) { const big = v % 100 === 0; svgEl('line', { x1: px(v), x2: px(v), y1: y - (big ? 10 : 6), y2: y + (big ? 10 : 6), stroke: INK, 'stroke-width': 2 }, svg); if (big) lab(stage, px(v), y + 28, '$' + v / 100, 'u2l2-tk u2l2-mid'); }
    const mline = (v, col, txt) => { const g = svgEl('g', { opacity: 0.35 }, svg); svgEl('line', { x1: px(v), x2: px(v), y1: 60, y2: y + 50, stroke: col, 'stroke-width': 4, 'stroke-dasharray': '8 6' }, g); const t = lab(stage, px(v), 52, txt, 'u2l2-ml2 u2l2-mid'); t.style.color = col; t.style.opacity = 0.45; return { g, t }; };
    const m13 = mline(1300, BLUE, 'min $13.00<br><small>under 18, school in, first 28 h</small>'), m15 = mline(1500, BRN, 'min $15.00<br><small>everyone else</small>');
    const pin = svgEl('g', { opacity: 0 }, svg); svgEl('path', { d: 'M0 0 L-12 -26 A14 14 0 1 1 12 -26 Z', fill: RED }, pin);
    const pl = hide(lab(stage, px(wage), y + 62, mH(wage), 'u2l2-pinl u2l2-mid'));
    const put = (v) => pin.setAttribute('transform', `translate(${px(v)} ${y - 6})`); put(1200);
    const st = stamp(stage, ok ? 'Yes: legal' : 'No: too low', { ok, x: 230, y: 262, size: 'sm' }); hide(st);
    const M = D.min === 1500 ? m15 : m13;
    return [
      { cap: `Find the hourly wage: ${T(`${mT(D.pay)}\\div${D.h}=${mT(wage)}`)} per hour.`, run: async (c) => { await show(c, calc); pin.setAttribute('opacity', 1); await tween(c, 1100, (t) => put(1200 + (wage - 1200) * t)); await show(c, pl); } },
      { cap: `Which minimum? ${D.why}`, run: async (c) => { M.g.setAttribute('opacity', 1); M.t.style.opacity = 1; await pulse(c, M.t, 1.12); } },
      { cap: ok ? `${T(`${mT(wage)}\\ge${mT(D.min)}`)}: <b>Yes</b>, ${D.who} is paid at least minimum wage.` : `${T(`${mT(wage)}<${mT(D.min)}`)}: <b>No</b>. ${D.who} is paid less than minimum wage.`, run: (c) => stampIn(c, st) }
    ];
  }
};
function tyler(stage) {
  const n = 31, cw = 27, x0 = 30, y0 = 70;
  const cells = Array.from({ length: n }, (_, i) => add(stage, h('div', 'u2l2-abs u2l2-cell', String(i + 1)), x0 + i * (cw + 1), y0));
  cells.forEach((e) => { e.style.width = cw + 'px'; });
  lab(stage, x0, 30, 'Tyler’s 31 hours this week (October: school is in)', 'u2l2-lane');
  const svg = svgEl('svg', { class: 'u2l2-abs', width: 940, height: 300 }); add(stage, svg, 0, 0);
  const brace = (a, b, col) => { const xa = x0 + a * (cw + 1), xb = x0 + b * (cw + 1) - 1, yb = y0 + 54; return svgEl('path', { d: `M${xa} ${yb} q0 10 10 10 H${(xa + xb) / 2 - 8} q8 0 8 10 q0 -10 8 -10 H${xb - 10} q10 0 10 -10`, fill: 'none', stroke: col, 'stroke-width': 3, opacity: 0 }, svg); };
  const b1 = brace(0, 28, BLUE), b2 = brace(28, 31, AMB);
  const l1 = hide(lab(stage, x0 + 14 * (cw + 1), 172, `first 28 h at $13.00: ${K('28\\times\\$13.00=\\$364.00')}`, 'u2l2-bl u2l2-mid u2l2-b'));
  const l2 = hide(lab(stage, x0 + 29.5 * (cw + 1) - 120, 216, `3 h at $15.00: ${K('3\\times\\$15.00=\\$45.00')}`, 'u2l2-bl u2l2-mid u2l2-a'));
  const tot = hide(lab(stage, 470, 268, K('\\$364.00+\\$45.00=\\mathbf{\\$409.00}'), 'u2l2-eqn u2l2-mid'));
  const paint = (c, from, to, cls) => tween(c, 900, (t) => { const m = from + Math.round((to - from) * t); for (let i = from; i < to; i++) cells[i].classList.toggle(cls, i < m); }, (t) => t);
  return [
    { cap: `Tyler is 17 and it is October, so school is in. His <b>first 28 hours</b> can be paid the student minimum, $13.00.`, run: async (c) => { await paint(c, 0, 28, 'b'); b1.setAttribute('opacity', 1); } },
    { cap: `First 28 h: ${T('28\\times\\$13.00=\\$364.00')}.`, run: (c) => show(c, l1) },
    { cap: `Hours past 28: ${T('31-28=3')} h. These must be paid at least <b>$15.00</b>: ${T('3\\times\\$15.00=\\$45.00')}.`, run: async (c) => { await paint(c, 28, 31, 'a'); b2.setAttribute('opacity', 1); await show(c, l2); } },
    { cap: `Gross pay ${T('=\\$364.00+\\$45.00=\\$409.00')}. <b>Tyler’s gross pay is $409.00.</b>`, run: (c) => pop(c, tot) }
  ];
}

/* =============================== explainer: a year cut into paycheques =============================== */
const PPS = { w: ['weekly', 52], bw: ['biweekly', 26], sm: ['semi-monthly', 24], m: ['monthly', 12] };
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function yearBar(stage, svg, y, bh) {
  const x0 = 40, x1 = 900;
  MON.forEach((m, i) => { const x = x0 + (x1 - x0) * (i + 0.5) / 12; lab(stage, x, y - 16, m, 'u2l2-mon u2l2-mid'); });
  for (let i = 0; i <= 12; i++) { const x = x0 + (x1 - x0) * i / 12; svgEl('line', { x1: x, x2: x, y1: y - 6, y2: y, stroke: '#b9ad97', 'stroke-width': 1.5 }, svg); }
  const g = svgEl('g', {}, svg);
  const frame = svgEl('rect', { x: x0, y, width: x1 - x0, height: bh, fill: 'none', stroke: INK, 'stroke-width': 3, rx: 6 }, svg);
  const pieces = (n, fills = ['#e9d6b6', '#d8bb8c']) => { g.innerHTML = ''; const w = (x1 - x0) / n; return Array.from({ length: n }, (_, i) => svgEl('rect', { x: x0 + i * w, y, width: w, height: bh, fill: fills[i % 2], stroke: '#fff', 'stroke-width': n > 30 ? 0.8 : 1.5, opacity: 0 }, g)); };
  return { x0, x1, y, bh, g, frame, pieces };
}
const payPeriods = {
  title: 'A year cut into paycheques',
  height: 300,
  minW: 940,
  capH: 92,
  choices: [{ sep: 'Example 6(a) check:' }, { v: 'w', label: 'weekly' }, { v: 'bw', label: 'biweekly' }, { v: 'sm', label: 'semi-monthly' }, { v: 'm', label: 'monthly' }, { sep: '(b):' }, { v: 'mc', label: 'Marco' }],
  ask: (k) => (k === 'mc' ? 'Example 6(b): Marco is paid $1 925.50 biweekly. What is his yearly salary? What is his average pay per month?'.replace('1 925', '1&#8201;925') : `Example 6(a): Hana’s salary is $54&#8201;600 a year. What is her gross pay if she is paid <b>${PPS[k][0]}</b>?`),
  make(stage, k) {
    const svg = svgEl('svg', { class: 'u2l2-abs', width: 940, height: 300 }); add(stage, svg, 0, 0);
    const Y = yearBar(stage, svg, 96, 66);
    const head = hide(lab(stage, 470, 30, '', 'u2l2-yh u2l2-mid'));
    const cnt = hide(lab(stage, 470, 196, '', 'u2l2-cnt u2l2-mid'));
    const eq = hide(lab(stage, 470, 250, '', 'u2l2-eqn u2l2-mid'));
    if (k === 'mc') {
      const ps = Y.pieces(26, ['#cfe9d9', '#9fd3b4']);
      const Y2 = { y: 200 };
      const mp = Array.from({ length: 12 }, (_, i) => { const r = svgEl('rect', { x: Y.x0 + (Y.x1 - Y.x0) * i / 12, y: Y2.y, width: (Y.x1 - Y.x0) / 12, height: 34, fill: i % 2 ? '#e9d6b6' : '#d8bb8c', stroke: '#fff', 'stroke-width': 1.5, opacity: 0 }, svg); return r; });
      cnt.style.top = '178px';
      return [
        { cap: `Marco gets <b>$1&#8201;925.50</b> every two weeks. Biweekly means <b>26</b> cheques a year.`,
          run: async (c) => { head.innerHTML = 'one cheque: <b>$1&#8201;925.50</b>'; await show(c, head); ps[0].setAttribute('opacity', 1); await pulse(c, head, 1.05); } },
        { cap: `Yearly salary ${T('=\\$1\\,925.50\\times26=\\$50\\,063.00')}.`,
          run: async (c) => { await tween(c, 1800, (t) => { const m = Math.max(1, Math.round(26 * t)); ps.forEach((p, i) => p.setAttribute('opacity', i < m ? 1 : 0)); head.innerHTML = `${m} cheque${m > 1 ? 's' : ''}: <b>${mH(192550 * m)}</b>`; }, (t) => t); head.innerHTML = 'a year: <b>$50&#8201;063.00</b>'; } },
        { cap: `Per month: split the same year into <b>12</b> pieces. ${T('\\$50\\,063.00\\div12=\\$4\\,171.9166\\ldots\\approx\\$4\\,171.92')}.`,
          run: async (c) => { for (const r of mp) r.setAttribute('opacity', 1); eq.innerHTML = K('\\$50\\,063.00\\div12\\approx\\mathbf{\\$4\\,171.92}\\text{ a month}'); eq.style.top = '268px'; await show(c, eq); } }
      ];
    }
    const [name, n] = PPS[k], each = 5460000 / n;
    const ps = Y.pieces(n);
    return [
      { cap: `Hana’s salary is <b>$54&#8201;600</b> for the <b>whole year</b>.`, run: async (c) => { head.innerHTML = 'one year: <b>$54&#8201;600</b>'; Y.frame.style.fill = '#e9d6b6'; await show(c, head); } },
      { cap: `Paid <b>${name}</b>: the year is cut into <b>${n}</b> equal paycheques.`,
        run: async (c) => { Y.frame.style.fill = 'none'; await tween(c, 1500, (t) => { const m = Math.round(n * t); ps.forEach((p, i) => p.setAttribute('opacity', i < m ? 1 : 0)); cnt.innerHTML = `<b>${m}</b> cheques`; cnt.style.opacity = 1; }, (t) => t); } },
      { cap: `Each cheque ${T(`=\\$54\\,600\\div${n}=${mT(each)}`)}.`,
        run: async (c) => { ps[0].setAttribute('fill', '#2f9e66'); eq.innerHTML = K(`\\$54\\,600\\div${n}=\\mathbf{${mT(each)}}`); await show(c, eq); } }
    ];
  }
};

/* =============================== explainer (Full notes): biweekly vs semi-monthly paydays =============================== */
const biVsSemi = {
  title: 'Biweekly or semi-monthly?',
  height: 300,
  minW: 940,
  capH: 92,
  choices: [{ v: 'h', label: 'Hana: 26 or 24 cheques' }],
  ask: () => 'Hana’s $54&#8201;600 salary: paid every two weeks, or twice a month. Which gives more cheques?',
  make(stage) {
    const svg = svgEl('svg', { class: 'u2l2-abs', width: 940, height: 300 }); add(stage, svg, 0, 0);
    const x0 = 190, x1 = 920, px = (d) => x0 + (x1 - x0) * d / 365, y1 = 110, y2 = 200;
    const mdays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], start = [0]; mdays.forEach((d, i) => start.push(start[i] + d));
    MON.forEach((m, i) => { lab(stage, px(start[i] + mdays[i] / 2), 40, m, 'u2l2-mon u2l2-mid'); svgEl('line', { x1: px(start[i]), x2: px(start[i]), y1: 56, y2: 240, stroke: '#e3dbcc', 'stroke-width': 1.5 }, svg); });
    [[y1, 'every 2 weeks'], [y2, 'twice a month']].forEach(([y, s]) => { svgEl('line', { x1: x0, x2: x1, y1: y, y2: y, stroke: INK, 'stroke-width': 3 }, svg); lab(stage, 14, y, s, 'u2l2-rowl u2l2-ml'); });
    const bi = Array.from({ length: 26 }, (_, i) => svgEl('circle', { cx: px(13 + 14 * i), cy: y1, r: 8, fill: GRN, opacity: 0 }, svg));
    const sm = []; for (let i = 0; i < 12; i++) { sm.push(svgEl('circle', { cx: px(start[i] + 14), cy: y2, r: 8, fill: BRN, opacity: 0 }, svg)); sm.push(svgEl('circle', { cx: px(start[i + 1] - 1), cy: y2, r: 8, fill: BRN, opacity: 0 }, svg)); }
    const c1 = hide(lab(stage, 470, 140, '', 'u2l2-cnt u2l2-mid')), c2 = hide(lab(stage, 470, 230, '', 'u2l2-cnt u2l2-mid'));
    const eq = hide(lab(stage, 470, 276, K('\\$54\\,600\\div26=\\$2\\,100.00\\qquad \\$54\\,600\\div24=\\$2\\,275.00'), 'u2l2-eqn u2l2-mid'));
    const drop = (c, dots, el, lbl) => tween(c, 1800, (t) => { const m = Math.round(dots.length * t); dots.forEach((d, i) => d.setAttribute('opacity', i < m ? 1 : 0)); el.innerHTML = `<b>${m}</b> paydays ${lbl}`; el.style.opacity = 1; }, (t) => t);
    return [
      { cap: `<b>Biweekly:</b> a payday every 14 days, all year long.`, run: (c) => drop(c, bi, c1, '(biweekly)') },
      { cap: `<b>Semi-monthly:</b> the 15th and the last day of each month: ${T('2\\times12=24')} paydays.`, run: (c) => drop(c, sm, c2, '(semi-monthly)') },
      { cap: `A month is a bit more than 4 weeks, so biweekly gives <b>26</b>, two more than 24. The same salary in <b>more pieces</b> means <b>smaller cheques</b>.`, run: (c) => show(c, eq) }
    ];
  }
};

/* =============================== explainer: 52 weeks of hours =============================== */
const hourlyEq = {
  title: 'A year of working weeks',
  height: 300,
  minW: 940,
  capH: 92,
  choices: [{ sep: 'Example 7 check:' }, { v: 'a', label: '(a) hourly equivalent' }, { v: 'b', label: '(b) Jesse’s year' }],
  ask: (k) => (k === 'a' ? 'Example 7(a): a salary of $46&#8201;800 for a 40-hour week. What is the hourly equivalent?' : 'Example 7(b): Jesse earns $21.40/h, 37.5 hours every week of the year. What is his yearly gross pay?'),
  make(stage, k) {
    const svg = svgEl('svg', { class: 'u2l2-abs', width: 940, height: 300 }); add(stage, svg, 0, 0);
    const x0 = 40, cw = 16.5, yb = 210, hh = k === 'a' ? 40 : 37.5, bh = hh * 3;
    const bars = Array.from({ length: 52 }, (_, i) => svgEl('rect', { x: x0 + i * cw + 1, y: yb - bh, width: cw - 2, height: bh, fill: k === 'a' ? FA : FG, rx: 2, opacity: 0 }, svg));
    svgEl('line', { x1: x0, x2: x0 + 52 * cw, y1: yb, y2: yb, stroke: INK, 'stroke-width': 3 }, svg);
    [1, 13, 26, 39, 52].forEach((w) => lab(stage, x0 + (w - 0.5) * cw, yb + 16, 'wk ' + w, 'u2l2-tk2 u2l2-mid'));
    const wk = hide(lab(stage, x0 + 14, yb - bh - 26, '', 'u2l2-wkl u2l2-ml'));
    const top = hide(lab(stage, 470, 24, '', 'u2l2-yh u2l2-mid'));
    const eq = hide(lab(stage, 470, 268, '', 'u2l2-eqn u2l2-mid'));
    const fill = (c, f) => tween(c, 2000, (t) => { const m = Math.max(1, Math.round(52 * t)); bars.forEach((b, i) => b.setAttribute('opacity', i < m ? 1 : 0)); f(m); }, (t) => t);
    if (k === 'a') return [
      { cap: `One full-time week is <b>40 h</b>.`, run: async (c) => { bars[0].setAttribute('opacity', 1); wk.innerHTML = '← 1 week: 40 h'; await show(c, wk); } },
      { cap: `A year has <b>52</b> weeks: ${T(`40\\times52=2\\,080`)} hours of work.`, run: (c) => fill(c, (m) => { top.innerHTML = `${m} week${m > 1 ? 's' : ''}: <b>${nH(40 * m)} h</b>`; top.style.opacity = 1; }) },
      { cap: `The salary, <b>$46&#8201;800</b>, pays for all 2&#8201;080 hours. Share it out: ${T('\\$46\\,800\\div2\\,080=\\$22.50')} per hour.`, run: async (c) => { eq.innerHTML = K('\\$46\\,800\\div(40\\times52)=\\$46\\,800\\div2\\,080=\\mathbf{\\$22.50}\\text{/h}'); await show(c, eq); } },
      { cap: `On the calculator, put <b>brackets</b> around ${T('40\\times52')}: 46800 ÷ ( 40 × 52 ) ENTER gives <b>22.5</b>. The salary works out to <b>$22.50/h</b>.`, run: (c) => pulse(c, eq, 1.06) }
    ];
    return [
      { cap: `One week: ${T('37.5\\times\\$21.40=\\$802.50')}.`, run: async (c) => { bars[0].setAttribute('opacity', 1); wk.innerHTML = '← 1 week: 37.5 h = $802.50'; await show(c, wk); } },
      { cap: `Every week of the year: <b>52</b> weekly paycheques.`, run: (c) => fill(c, (m) => { top.innerHTML = `${m} week${m > 1 ? 's' : ''}: <b>${mH(80250 * m)}</b>`; top.style.opacity = 1; }) },
      { cap: `Yearly gross pay ${T('=\\$21.40\\times37.5\\times52=\\$41\\,730.00')}. <b>Jesse earns $41&#8201;730.00 a year.</b>`, run: async (c) => { eq.innerHTML = K('\\$21.40\\times37.5\\times52=\\mathbf{\\$41\\,730.00}'); await show(c, eq); } }
    ];
  }
};

/* =============================== explainer: Job A vs Job B =============================== */
const jobCompare = {
  title: 'Compare in the same units',
  height: 300,
  minW: 940,
  capH: 92,
  choices: [{ sep: 'Example 8 check:' }, { v: 'a', label: '(a) per week' }, { v: 'b', label: '(b) per hour' }, { v: 'c', label: '(c) Job A at 40 h' }],
  ask: (k) => ({ a: 'Example 8(a): find the weekly pay for each job.', b: 'Example 8(b): find the pay per hour for each job.', c: 'Example 8(c): what if Job A gave Riya 40 hours a week? Which job pays more each week then?' }[k]),
  make(stage, k) {
    const hA = k === 'c' ? 40 : 35;
    lab(stage, 20, 6, `<b>Job A</b> $22.75/h, <b>${hA} h</b> a week`, 'u2l2-job a');
    lab(stage, 490, 6, '<b>Job B</b> salary $42&#8201;900 a year, <b>37.5 h</b> a week', 'u2l2-job b');
    const svg = svgEl('svg', { class: 'u2l2-abs', width: 940, height: 300 }); add(stage, svg, 0, 0);
    const perH = k === 'b', max = perH ? 2500 : 100000, X0 = 90, Wd = 600, px = (v) => Wd * v / max;
    const unit = perH ? 'per hour' : 'per week';
    lab(stage, 470, 76, `pay <b>${unit}</b>`, 'u2l2-unit u2l2-mid');
    const row = (y, name, col) => { lab(stage, 40, y + 22, name, 'u2l2-rowl u2l2-ml'); const r = svgEl('rect', { x: X0, y, width: 0, height: 44, fill: col, rx: 6 }, svg); const v = hide(lab(stage, X0 + 10, y + 22, '', 'u2l2-bv u2l2-ml')); return { r, v }; };
    const A = row(110, 'A', '#e3b25f'), B = row(176, 'B', '#9fd3b4');
    const growTo = (c, R, val, html) => tween(c, 1000, (t) => { R.r.setAttribute('width', px(val) * t); }).then(() => { R.v.innerHTML = html; R.v.style.left = (X0 + px(val) + 12) + 'px'; return show(c, R.v); });
    const eq = hide(lab(stage, 380, 262, '', 'u2l2-eqn u2l2-mid'));
    if (k === 'b') {
      const st = stamp(stage, 'A: more per hour', { ok: true, x: 800, y: 262, size: 'sm' }); hide(st);
      return [
        { cap: `Job A is already per hour: <b>$22.75/h</b>.`, run: (c) => growTo(c, A, 2275, '$22.75/h') },
        { cap: `Job B: weekly pay ÷ hours: ${T('\\$825.00\\div37.5=\\$22.00')} per hour.`, run: (c) => growTo(c, B, 2200, '$22.00/h') },
        { cap: `${T('\\$22.75>\\$22.00')}: <b>Job A pays more for each hour</b>.`, run: (c) => stampIn(c, st) }
      ];
    }
    const aw = hA * 2275, st = stamp(stage, k === 'a' ? 'B: more per week' : 'A: more per week', { ok: true, x: 800, y: 262, size: 'sm' }); hide(st);
    return [
      { cap: `Job A: hours × wage: ${T(`${hA}\\times\\$22.75=${mT(aw)}`)} a week.`, run: (c) => growTo(c, A, aw, mH(aw)) },
      { cap: `Job B: salary ÷ 52 weeks: ${T('\\$42\\,900\\div52=\\$825.00')} a week.`, run: (c) => growTo(c, B, 82500, '$825.00') },
      { cap: k === 'a' ? `${T('\\$825.00-\\$796.25=\\$28.75')}: <b>Job B pays $28.75 more a week</b> (but Riya works 2.5 h more).` : `${T('\\$910.00>\\$825.00')}: with 40 hours, <b>Job A would pay more</b> each week.`,
        run: async (c) => { if (k === 'a') { eq.innerHTML = K('\\$825.00-\\$796.25=\\$28.75'); await show(c, eq); } await stampIn(c, st); } }
    ];
  }
};

/* =============================== explainer (Full notes): find the mistake =============================== */
const MS = {
  a: { who: 'Cole', bad: '\\$39\\,000\\div26=\\$1\\,500.00', why: 'Semi-monthly means <b>24</b> cheques, not 26 (26 is biweekly).', good: '\\$39\\,000\\div24=\\mathbf{\\$1\\,625.00}', ask: 'Example 9(a): Cole’s salary is $39&#8201;000 a year, paid semi-monthly. Find the mistake.' },
  b: { who: 'Erin', bad: '6.45\\times\\$16.00=\\$103.20', why: '', good: '6.75\\times\\$16.00=\\mathbf{\\$108.00}', ask: 'Example 9(b): Erin worked 6 h 45 min at $16.00/h. Find the mistake.' }
};
const mistakes = {
  title: 'Find the mistake',
  height: 260,
  minW: 940,
  capH: 92,
  choices: [{ sep: 'Example 9 check:' }, { v: 'a', label: '(a) Cole' }, { v: 'b', label: '(b) Erin' }],
  ask: (k) => MS[k].ask,
  make(stage, k) {
    const D = MS[k];
    const p1 = add(stage, h('div', 'u2l2-abs u2l2-paper', `<div class="nm">${D.who}’s work</div><div class="w">${K(D.bad)}</div>`), 30, 20);
    const p2 = hide(add(stage, h('div', 'u2l2-abs u2l2-paper fix', `<div class="nm">Fixed</div><div class="w">${K(D.good)}</div>`), 500, 20));
    const s1 = stamp(stage, '✗', { ok: false, x: 400, y: 50 }); hide(s1);
    const s2 = stamp(stage, '✓', { ok: true, x: 870, y: 50 }); hide(s2);
    const note = hide(lab(stage, 30, 190, k === 'a' ? 'semi-monthly = twice a month = <b>24</b> cheques' : `${K('45\\div60=0.75')}, so 6 h 45 min = <b>6.75 h</b>`, 'u2l2-note'));
    return [
      { cap: `${D.who}’s work: ${T(D.bad)}. Look closely…`, run: (c) => pulse(c, p1, 1.04) },
      { cap: k === 'a' ? D.why : `45 min is <b>not</b> 0.45 h. ${T('45\\div60=0.75')}, so 6 h 45 min = <b>6.75 h</b>.`, run: async (c) => { await stampIn(c, s1); await show(c, note); } },
      { cap: `Fix it: ${T(D.good.replace('\\mathbf', ''))}. ${k === 'a' ? 'Each cheque is <b>$1&#8201;625.00</b>.' : 'Erin earned <b>$108.00</b>.'}`, run: async (c) => { await show(c, p2); await stampIn(c, s2); } }
    ];
  }
};

/* =============================== wiring =============================== */
mountExplainers({ paycheque, sofia, undo, minWage, payPeriods, biVsSemi, hourlyEq, jobCompare, mistakes });

/* ============ Stand Up Break! — gross pay, hourly wage, pay periods ============ */
{
  const prod = (hh, w) => { const v = hh * w, c = Math.round(v / 100); return { v, c, ex: v % 100 === 0 }; };   // hundredths of an hour × cents
  standup('u2l2', {
    intro: 'Show every step on the whiteboard. Estimate first, then use your calculator. Round money to the cent at the end.',
    levels: {
      BEG: (r) => { const hh = r.pick([400, 500, 600, 700, 800, 350, 650, 750]), w = 1500 + 5 * r.int(0, 180), p = prod(hh, w);
        return { text: `Find the gross pay for <b>${hrs(hh)} h</b> at <b>${mH(w)}/h</b>.`, q: '', a: [`${hrs(hh)}\\times${mT(w)}=${p.ex ? mT(p.c) : '\\$' + exact4(p.v)}`, ...(p.ex ? [] : [`\\approx${mT(p.c)}`])] }; },
      PRG: (r) => r.pick([
        () => { const H = r.int(3, 8), m = r.pick([15, 30, 45]), hh = H * 100 + m * 100 / 60, w = 1500 + 5 * r.int(0, 180), p = prod(hh, w);
          return { text: `Find the gross pay for <b>${H} h ${m} min</b> at <b>${mH(w)}/h</b>.`, q: '', a: [`${m}\\div60=${m / 60},\\ \\text{so}\\ ${hrs(hh)}\\text{ h}`, `${hrs(hh)}\\times${mT(w)}=${p.ex ? mT(p.c) : '\\$' + exact4(p.v)}`, ...(p.ex ? [] : [`\\approx${mT(p.c)}`])] }; },
        () => { const w = 1500 + 10 * r.int(0, 90), hh = 50 * r.int(30, 76), pay = hh * w / 100;
          return { text: `You earned <b>${mH(pay)}</b> for <b>${hrs(hh)} h</b>. What is your hourly wage?`, q: '', a: [`${mT(pay)}\\div${hrs(hh)}=${mT(w)}\\text{/h}`, `\\text{check: }${hrs(hh)}\\times${mT(w)}=${mT(pay)}`] }; }
      ])(),
      MAS: (r) => r.pick([
        () => { const S = 312 * r.int(120, 210), [nm, n] = r.pick(Object.values(PPS));
          return { text: `A salary of <b>$${nH(S)}</b> a year is paid <b>${nm}</b>. How much is each paycheque?`, q: '', a: [`${nm}\\text{: }${n}\\text{ cheques}`, `\\$${nT(S)}\\div${n}=${mT(S * 100 / n)}`] }; },
        () => { const w = 50 * r.int(35, 60), hw = r.pick([35, 37.5, 40]), S = w * hw * 52 / 100;
          return { text: `A salary of <b>$${nH(S)}</b> a year is for a <b>${hw}-hour</b> week. What is the hourly equivalent?`, q: '', a: [`${hw}\\times52=${nT(hw * 52)}\\text{ h}`, `\\$${nT(S)}\\div${nT(hw * 52)}=${mT(w)}\\text{/h}`] }; }
      ])()
    }
  });
}
