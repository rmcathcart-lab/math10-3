/* Math 10-3 · Unit 1 · Lesson 10 — Currency Exchange: Converting, and Buy vs Sell Rates.
 * Explainers: the balance (1 USD = 1.38 CAD) and the scaled-up rate table, cents vs yen; the conversion machine
 * (× or ÷?); why dividing works, as a proportion (Full notes); reading the rate table; add about a third; bigger or
 * smaller? (catching a calculator mistake); the bank's two rates at the counter; there and back (money lost);
 * comparing total costs with fees; a flat fee vs a percent at different amounts (Full notes). Then the Stand Up Break. */
import { h, add, box, tex, svgEl, pulse, tween, stamp, stampIn, arrowHead, mountExplainers } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const rnd = (v, d = 2) => Math.round((v + (v >= 0 ? 1e-9 : -1e-9)) * 10 ** d) / 10 ** d;
const lerp = (a, b, t) => a + (b - a) * t;
/** thousands like the booklet: 27 000 (5+ digits get a narrow space; 1250 stays as it is) */
const big = (v, d = 0) => { const s = rnd(v, d).toFixed(d), [i, f] = s.split('.'); const ii = i.length > 4 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : i; return f ? ii + '.' + f : ii; };
const bigT = (v, d = 0) => big(v, d).replace(/ /g, '\\,');
const DOL = { CAD: 1, USD: 1 };
/** money text: $253.75 USD, 290.32 EUR, 27 000 JPY */
const amt = (v, code, d = code === 'JPY' ? 0 : 2) => (DOL[code] ? '$' : '') + big(v, d) + ' ' + code;
const M = (v, d = 2) => '$' + big(v, d);
const n2 = (v) => rnd(v, 2).toFixed(2);
/** a box whose mixed text and maths stay together on centred lines */
const cbox = (cls, html) => h('div', cls + ' u1l10-c', `<div>${html}</div>`);
const countTo = (c, el, a, b, ms, f) => tween(c, ms, (t) => { el.innerHTML = f(lerp(a, b, t)); });
const lcdBox = (e, r, cls = '') => h('div', 'u1l10-lcd ' + cls, `<div class="e">${e}</div><div class="r">${r}</div>`);
const svgAt = (stage, w, hh, x = 0, y = 0) => add(stage, svgEl('svg', { width: w, height: hh, viewBox: `0 0 ${w} ${hh}`, class: 'u1l10-svg' }), x, y);
const rateT = (a, r, b) => T(`1\\text{ ${a}}=${r}\\text{ ${b}}`);

/* =====================================================================================
 * 1. What a rate means: the balance, the scaled-up table, cents vs yen
 * ===================================================================================== */
const rateMeaning = {
  title: 'What a rate means',
  height: 400,
  minW: 900,
  choices: [{ sep: 'Example 1 check:' }, { v: 'ab', label: '(a)–(b) 1 USD = 1.38 CAD' }, { v: 'c', label: '(c) 1 CAD = 108 JPY' }],
  ask: (k) => (k === 'ab'
    ? `Example 1: use ${rateT('USD', '1.38', 'CAD')}. (a) Which is worth more, one US dollar or one Canadian dollar? (b) Complete the table.`
    : `Example 1(c): in Japan, ${rateT('CAD', '108', 'JPY')}. Is one yen worth more or less than one Canadian cent?`),
  make(stage, k, ex) { return k === 'ab' ? rmBalance(stage, ex) : rmYen(stage, ex); }
};

function rmBalance(stage, ex) {
  const W = ex.W;
  /* the balance: pivot (215, 80), arms 150 */
  const sv = svgAt(stage, 440, 290, 0, 0), PX = 215, PY = 80, A = 150;
  svgEl('path', { d: `M${PX - 60} 270 H${PX + 60} L${PX + 14} 250 V${PY + 6} H${PX - 14} V250 Z`, fill: '#9a6a24', stroke: '#4a3010', 'stroke-width': 3, 'stroke-linejoin': 'round' }, sv);
  const beam = svgEl('line', { stroke: '#4a3010', 'stroke-width': 8, 'stroke-linecap': 'round' }, sv);
  svgEl('circle', { cx: PX, cy: PY, r: 10, fill: '#e0a21a', stroke: '#4a3010', 'stroke-width': 3 }, sv);
  const mkPan = () => { const g = svgEl('g', {}, sv); svgEl('path', { d: 'M0 0 L-58 74 M0 0 L58 74', stroke: '#6b5a40', 'stroke-width': 2.5 }, g); svgEl('path', { d: 'M-72 74 H72 Q60 96 0 96 Q-60 96 -72 74 Z', fill: '#d9cdb8', stroke: '#6b5a40', 'stroke-width': 3 }, g); return g; };
  const pL = mkPan(), pR = mkPan();
  // 1 USD bill on the left pan
  const bill = svgEl('g', {}, pL);
  bill.innerHTML = '<rect x="-46" y="38" width="92" height="38" rx="5" fill="#cfe8c9" stroke="#2f6b3a" stroke-width="3"/><circle cx="0" cy="57" r="12" fill="none" stroke="#2f6b3a" stroke-width="2"/><text x="0" y="63" font-size="17" font-weight="800" fill="#2f6b3a" text-anchor="middle">1</text><text x="-30" y="52" font-size="11" font-weight="800" fill="#2f6b3a" text-anchor="middle">USD</text>';
  // $1.38 CAD on the right pan: a loonie and some coins
  const coins = svgEl('g', {}, pR);
  coins.innerHTML = '<circle cx="-22" cy="58" r="17" fill="#e8b923" stroke="#8a6a10" stroke-width="3"/><text x="-22" y="64" font-size="15" font-weight="800" fill="#5a4308" text-anchor="middle">$1</text><circle cx="10" cy="64" r="11" fill="#d7dbe0" stroke="#7a838d" stroke-width="2.5"/><circle cx="30" cy="66" r="8" fill="#d7dbe0" stroke="#7a838d" stroke-width="2"/><circle cx="45" cy="68" r="6" fill="#c98a4a" stroke="#7a4a20" stroke-width="1.5"/><circle cx="45" cy="60" r="6" fill="#c98a4a" stroke="#7a4a20" stroke-width="1.5"/>';
  hide(bill, coins);
  const lUSD = hide(add(stage, box(cbox('u1l10-panlab usd', '<b>1</b> USD'), 120, 34), 0, 0));
  const lCAD = hide(add(stage, box(cbox('u1l10-panlab cad', '<b>$1.38</b> CAD'), 140, 34), 0, 0));
  let ang = 0;
  const setTilt = (deg) => {
    ang = deg; const t = deg * Math.PI / 180, cx = Math.cos(t) * A, sy = Math.sin(t) * A;
    const L = [PX - cx, PY + sy], R = [PX + cx, PY - sy];
    beam.setAttribute('x1', L[0]); beam.setAttribute('y1', L[1]); beam.setAttribute('x2', R[0]); beam.setAttribute('y2', R[1]);
    pL.setAttribute('transform', `translate(${L[0]} ${L[1]})`); pR.setAttribute('transform', `translate(${R[0]} ${R[1]})`);
    lUSD.style.left = (L[0] - 60) + 'px'; lUSD.style.top = (L[1] + 104) + 'px';
    lCAD.style.left = (R[0] - 70) + 'px'; lCAD.style.top = (R[1] + 104) + 'px';
  };
  setTilt(0);
  const verdict = hide(add(stage, box(cbox('u1l10-verdict', `${T('1.38>1')}: <b>one US dollar</b> is worth more`), 420, 52), 10, 336));
  /* the table: USD row given, CAD row to fill */
  const X0 = 470, HW = 74, CW = (W - 20 - X0 - HW) / 4, TY = 150, RH = 56, us = [1, 10, 50, 200];
  add(stage, box(cbox('u1l10-th', 'USD'), HW, RH), X0, TY);
  add(stage, box(cbox('u1l10-th', 'CAD'), HW, RH), X0, TY + RH);
  const cad = us.map((u, i) => {
    add(stage, box(cbox('u1l10-td', M(u)), CW, RH), X0 + HW + i * CW, TY);
    const cell = add(stage, box(cbox('u1l10-td q', '?'), CW, RH), X0 + HW + i * CW, TY + RH);
    return cell;
  });
  const cx = (i) => X0 + HW + i * CW + CW / 2;
  const asv = svgAt(stage, W, 400, 0, 0);
  const arcs = [1, 2, 3].map((i) => {
    const hgt = 22 + 24 * i, a = cx(0) + 10, b = cx(i) - 6;
    const top = svgEl('path', { d: `M${a} ${TY - 4} Q${(a + b) / 2} ${TY - 4 - hgt * 2} ${b} ${TY - 4}`, fill: 'none', stroke: '#c27a0e', 'stroke-width': 3 }, asv);
    const bot = svgEl('path', { d: `M${a} ${TY + 2 * RH + 4} Q${(a + b) / 2} ${TY + 2 * RH + 4 + hgt * 2} ${b} ${TY + 2 * RH + 4}`, fill: 'none', stroke: '#c27a0e', 'stroke-width': 3 }, asv);
    const h1 = arrowHead(asv, b, TY - 4, 0.45, 1, { color: '#c27a0e', width: 3 }), h2 = arrowHead(asv, b, TY + 2 * RH + 4, 0.45, -1, { color: '#c27a0e', width: 3 });
    const k = us[i];
    const l1 = add(stage, box(cbox('u1l10-mult', `×${k}`), 70, 26), (a + b) / 2 - 35, TY - 4 - hgt - 26);
    const l2 = add(stage, box(cbox('u1l10-mult', `×${k}`), 70, 26), (a + b) / 2 - 35, TY + 2 * RH + 4 + hgt);
    const els = [top, bot, h1, h2, l1, l2]; hide(...els); return els;
  });
  const rows = [[1, 1.38], [10, 13.80], [50, 69.00], [200, 276.00]];
  const fillCell = async (c, i) => {
    const e = cad[i]; e.classList.remove('q'); e.classList.add('a'); e.firstChild.innerHTML = M(rows[i][1]);
    await c.pop(e);
  };
  return [
    { cap: `Read the rate: <b>1 US dollar</b> on one side…`, run: async (c) => { await Promise.all([c.pop(bill), c.fadeIn(lUSD)]); await tween(c, 600, (t) => setTilt(lerp(0, 13, t))); } },
    { cap: `…balances <b>$1.38</b> in Canadian money. Now the scale is level.`, run: async (c) => { await Promise.all([c.pop(coins), c.fadeIn(lCAD)]); await tween(c, 700, (t) => setTilt(lerp(13, 0, t))); } },
    { cap: `(a) ${T('1.38')} is <b>bigger than 1</b>: it takes more than one Canadian dollar to match one US dollar. <b>One US dollar</b> is worth more.`, run: async (c) => { await c.pop(verdict); } },
    { cap: `(b) A rate is a <b>unit rate</b> (for 1 US dollar). $1.00 USD is <b>$1.38</b> CAD.`, run: (c) => fillCell(c, 0) },
    ...[1, 2, 3].map((i) => ({ cap: `${M(us[i])} USD is <b>${us[i]} times</b> as much: ${T(`${us[i]}\\times1.38=${n2(rows[i][1])}`)}, so <b>${M(rows[i][1])}</b> CAD.`,
      run: async (c) => { if (i > 1) arcs[i - 2].forEach((e) => { e.style.opacity = 0; }); const [t1, b1, h1, h2, l1, l2] = arcs[i - 1]; await Promise.all([c.anim(t1, [{ opacity: 0 }, { opacity: 1 }], 300), c.anim(b1, [{ opacity: 0 }, { opacity: 1 }], 300), c.anim(h1, [{ opacity: 0 }, { opacity: 1 }], 300), c.anim(h2, [{ opacity: 0 }, { opacity: 1 }], 300), c.pop(l1), c.pop(l2)]); await fillCell(c, i); } }))
  ];
}

function rmYen(stage, ex) {
  const W = ex.W, PW = (W - 40) / 2;
  const panel = (x, n, kind, lab) => {
    const loon = add(stage, h('div', 'u1l10-loonie', '$1<small>CAD</small>'), x + 6, 120);
    add(stage, box(cbox('u1l10-eq', '='), 40, 60), x + 86, 128);
    const sv = svgAt(stage, 250, 250, x + 134, 50), dots = [];
    for (let i = 0; i < n; i++) {
      const r = Math.floor(i / 10), cI = i % 10;
      const d = svgEl('circle', { cx: 12 + cI * 23, cy: 12 + r * 21, r: 9.5, fill: kind === 'cent' ? '#c98a4a' : '#d7dbe0', stroke: kind === 'cent' ? '#7a4a20' : '#7a838d', 'stroke-width': 2, class: i >= 100 ? 'u1l10-extra' : '' }, sv);
      d.style.opacity = 0; dots.push(d);
    }
    const lb = hide(add(stage, box(cbox('u1l10-gridlab ' + kind, lab), 260, 40), x + 124, 6));
    return { loon, dots, lb };
  };
  const A = panel(20, 100, 'cent', '<b>100</b> cents'), B = panel(20 + PW, 108, 'yen', '<b>108</b> yen');
  const fillDots = (c, d, ms) => tween(c, ms, (t) => { const m = Math.round(t * d.length); d.forEach((e, i) => { e.style.opacity = i < m ? 1 : 0; }); });
  const verdict = hide(add(stage, box(cbox('u1l10-verdict', 'One yen is worth a little <b>less</b> than one cent'), 520, 52), (W - 520) / 2, 340));
  return [
    { cap: `<b>$1.00 CAD</b> is <b>100 cents</b>.`, run: async (c) => { await c.fadeIn(A.lb); await fillDots(c, A.dots, 900); } },
    { cap: `The same <b>$1.00 CAD</b> buys <b>108 yen</b>.`, run: async (c) => { await c.fadeIn(B.lb); await fillDots(c, B.dots, 900); } },
    { cap: `Same money, but you get <b>more</b> yen (108) than cents (100): 8 extra coins.`, run: async (c) => { B.dots.slice(100).forEach((d) => d.classList.add('hl')); await Promise.all(B.dots.slice(100).map((d) => c.anim(d, [{ transform: 'scale(1)' }, { transform: 'scale(1.5)' }, { transform: 'scale(1)' }], 500))); } },
    { cap: `The money is split into <b>more pieces</b>, so each piece is smaller: one yen is worth a little <b>less</b> than one cent.`, run: (c) => c.pop(verdict) }
  ];
}

/* =====================================================================================
 * 2. The conversion machine: multiply or divide?
 * ===================================================================================== */
const CV = {
  e2a: { ask: 'Example 2(a): Hamza changes <b>$350.00 CAD</b> into US dollars. The rate is ' + rateT('CAD', '0.725', 'USD') + '. How many US dollars does he get?',
    v: 350, have: 'CAD', want: 'USD', from: 'CAD', to: 'USD', r: '0.725', op: '×', lcd: '253.75', res: 253.75, chk: 'Fewer US dollars than Canadian dollars: a US dollar is worth more. Makes sense ✓' },
  e2b: { ask: 'Example 2(b): a hotel in Great Falls, Montana, costs <b>$164.00 USD</b> a night. The rate is ' + rateT('USD', '1.38', 'CAD') + '. What is the cost in Canadian dollars?',
    v: 164, have: 'USD', want: 'CAD', from: 'USD', to: 'CAD', r: '1.38', op: '×', lcd: '226.32', res: 226.32, chk: 'The CAD number is bigger than the US price. Makes sense ✓' },
  e3a: { ask: 'Example 3(a): only one rate is posted, ' + rateT('EUR', '1.55', 'CAD') + '. Sofia has <b>$450.00 CAD</b>. How many euros can she get?',
    v: 450, have: 'CAD', want: 'EUR', from: 'EUR', to: 'CAD', r: '1.55', op: '÷', lcd: '290.3225806', res: 290.32, chk: 'Fewer euros than Canadian dollars: a euro is worth more. Makes sense ✓' },
  e3b: { ask: 'Example 3(b): the rate is ' + rateT('EUR', '1.55', 'CAD') + '. A train ticket in Italy costs <b>38.40 EUR</b>. What is that in CAD?',
    v: 38.40, have: 'EUR', want: 'CAD', from: 'EUR', to: 'CAD', r: '1.55', op: '×', lcd: '59.52', res: 59.52, chk: 'More Canadian dollars than euros. Makes sense ✓' },
  e3c: { ask: 'Example 3(c): a shop in Tokyo posts only ' + rateT('CAD', '108', 'JPY') + '. A bento lunch box costs <b>1250 JPY</b>. What is that in CAD?',
    v: 1250, have: 'JPY', want: 'CAD', from: 'CAD', to: 'JPY', r: '108', op: '÷', lcd: '11.57407407', res: 11.57, chk: 'Far fewer dollars than yen: a yen is worth less than a cent. Makes sense ✓', dpv: 0 }
};
const converter = {
  title: 'The conversion machine: multiply or divide?',
  height: 400,
  minW: 900,
  choices: [{ sep: 'Example 2:' }, { v: 'e2a', label: '(a) $350 CAD' }, { v: 'e2b', label: '(b) Hotel' }, { sep: 'Example 3:' }, { v: 'e3a', label: '(a) Euros' }, { v: 'e3b', label: '(b) Train' }, { v: 'e3c', label: '(c) Bento' }],
  ask: (k) => CV[k].ask,
  make(stage, k, ex) {
    const d = CV[k], W = ex.W, mult = d.op === '×', starts = d.from === d.have;
    const vTxt = amt(d.v, d.have, d.dpv), resTxt = amt(d.res, d.want);
    const vNum = d.dpv === 0 ? String(d.v) : n2(d.v);
    add(stage, box(h('div', 'u1l10-amt', `<small>The amount</small><b>${vTxt.replace(' ' + d.have, '')}</b><span>${d.have}</span>`), 230, 116), 20, 12);
    const rc = hide(add(stage, box(cbox('u1l10-ratecard', `<span class="c1">1 ${d.from}</span> = ${d.r} ${d.to}`), 330, 58), 280, 12));
    const q = hide(add(stage, box(cbox('u1l10-qbox', `Does the rate start with <b>${d.have}</b>, the currency of the amount?`), 330, 66), 280, 86));
    const yes = hide(add(stage, box(cbox('u1l10-branch yes', '<b>YES</b>multiply ×'), 160, 62), 280, 172));
    const no = hide(add(stage, box(cbox('u1l10-branch no', '<b>NO</b>divide ÷'), 160, 62), 450, 172));
    const wire = svgAt(stage, W, 260, 0, 0);
    const wy = svgEl('path', { d: 'M360 152 V172', stroke: '#9a6a24', 'stroke-width': 3, fill: 'none' }, wire), wn = svgEl('path', { d: 'M530 152 V172', stroke: '#9a6a24', 'stroke-width': 3, fill: 'none' }, wire);
    hide(wy, wn);
    const lcd = hide(add(stage, box(lcdBox(`${vNum}${d.op}${d.r}`, d.lcd, 'big'), 330, 84), W - 350, 12));
    const res = hide(add(stage, box(h('div', 'u1l10-amt res', `<small>${d.have === 'CAD' ? 'You get' : 'In ' + d.want}</small><b>${resTxt.replace(' ' + d.want, '')}</b><span>${d.want}</span>`), 330, 116), W - 350, 112));
    // the check: two bars, the numbers before and after
    const BX = 250, BMAX = W - BX - 40, mx = Math.max(d.v, d.res), sc = BMAX / mx;
    const b1l = hide(add(stage, box(h('div', 'u1l10-blab', `Amount: ${vTxt}`), 230, 34), 14, 262));
    const b1 = hide(add(stage, box(h('div', 'u1l10-bar have'), Math.max(6, d.v * sc), 30), BX, 264));
    const b2l = hide(add(stage, box(h('div', 'u1l10-blab', `Answer: ${resTxt}`), 230, 34), 14, 304));
    const b2 = hide(add(stage, box(h('div', 'u1l10-bar want'), Math.max(6, d.res * sc), 30), BX, 306));
    const chk = hide(add(stage, box(cbox('u1l10-chk', `<b>Check:</b> ${d.chk}`), W - 28, 40), 14, 350));
    const roundCap = d.lcd.replace(/^\d+\./, '').length > 2
      ? `Step 3: round ${d.want === 'JPY' ? 'to the whole yen' : 'to the cent'} and write the code: <b>${resTxt}</b>.`
      : `Step 3: no rounding needed. Write the code: <b>${resTxt}</b>.`;
    const grow = (c, el) => c.anim(el, [{ opacity: 0, transform: 'scaleX(0)', transformOrigin: 'left' }, { opacity: 1, transform: 'scaleX(1)', transformOrigin: 'left' }], 500);
    return [
      { cap: `Step 1: the rate is <b>1 ${d.from} = ${d.r} ${d.to}</b>. It starts with <b>${d.from}</b>.`, run: async (c) => { await c.pop(rc); rc.querySelector('.c1').classList.add('hl'); await pulse(c, rc.querySelector('.c1'), 1.15, 450); } },
      { cap: starts ? `Step 2: the amount is in <b>${d.have}</b>, and the rate starts with <b>${d.have}</b> too. So <b>multiply</b>.`
        : `Step 2: the amount is in <b>${d.have}</b>, but the rate starts with <b>${d.from}</b>, the currency you want. So <b>divide</b>.`,
        run: async (c) => { await c.fadeIn(q); await Promise.all([c.fadeIn(yes), c.fadeIn(no), c.anim(wy, [{ opacity: 0 }, { opacity: 1 }], 200), c.anim(wn, [{ opacity: 0 }, { opacity: 1 }], 200)]); (mult ? yes : no).classList.add('on'); (mult ? no : yes).classList.add('off'); await pulse(c, mult ? yes : no, 1.08, 450); } },
      { cap: `${mult ? 'Amount × rate' : 'Amount ÷ rate'}: ${T(`${vNum}${mult ? '\\times' : '\\div'}${d.r}`)}. The calculator shows <b>${d.lcd}</b>.`, run: (c) => c.pop(lcd) },
      { cap: roundCap, run: (c) => c.pop(res) },
      { cap: `Check: bigger or smaller? ${d.chk}`, run: async (c) => { await Promise.all([c.fadeIn(b1l), c.fadeIn(b2l)]); await grow(c, b1); await grow(c, b2); await c.fadeIn(chk); } }
    ];
  }
};

/* =====================================================================================
 * 3. Why divide? The proportion (Full notes)
 * ===================================================================================== */
const PR = {
  e3a: { ask: 'Example 3(a): the rate is ' + rateT('EUR', '1.55', 'CAD') + '. Sofia has <b>$450.00 CAD</b>. How many euros can she get?', want: 'EUR', other: 'CAD', r: '1.55', v: '450', calc: '290.322\\ldots', ans: '290.32 EUR', who: 'Sofia gets' },
  e3c: { ask: 'Example 3(c): the rate is ' + rateT('CAD', '108', 'JPY') + '. A bento lunch box costs <b>1250 JPY</b>. What is that in CAD?', want: 'CAD', other: 'JPY', r: '108', v: '1250', calc: '11.574\\ldots', ans: '$11.57 CAD', who: 'The lunch costs' }
};
const proportion = {
  title: 'Why divide? The proportion',
  height: 360,
  minW: 900,
  choices: [{ sep: 'Example 3 check:' }, { v: 'e3a', label: '(a) Sofia’s euros' }, { v: 'e3c', label: '(c) The bento' }],
  ask: (k) => PR[k].ask,
  make(stage, k, ex) {
    const d = PR[k], W = ex.W, C1 = 170, C2 = 470, FW = 200;
    const frac = (cx, num, den, cls) => {
      const n = add(stage, box(cbox('u1l10-fn ' + cls, num), FW, 50), cx - FW / 2, 30);
      const bar = add(stage, box(h('div', 'u1l10-fbar'), FW - 20, 4), cx - FW / 2 + 10, 86);
      const dn = add(stage, box(cbox('u1l10-fn ' + cls, den), FW, 50), cx - FW / 2, 96);
      return [n, bar, dn];
    };
    const F1 = frac(C1, T(`1\\text{ ${d.want}}`), T(`${d.r}\\text{ ${d.other}}`), 'a');
    const eq = add(stage, box(cbox('u1l10-feq', '='), 60, 50), (C1 + C2) / 2 - 30, 64);
    const F2 = frac(C2, T('x'), T(`${d.v}\\text{ ${d.other}}`), 'b');
    hide(...F1, eq, ...F2);
    const note = hide(add(stage, box(cbox('u1l10-pnote', `The same rate: ${d.want} on top, ${d.other} on the bottom of <b>both</b> fractions.`), W - C2 - FW / 2 - 50, 110), C2 + FW / 2 + 30, 30));
    const L = (y, html) => hide(add(stage, box(h('div', 'u1l10-pline', html), W - 80, 50), 60, y));
    const l1 = L(166, `Cross-multiply: &nbsp;<span class="u1l10-cb">${T(`${d.r}\\times x`)}</span> = <span class="u1l10-co">${T(`1\\times${d.v}`)}</span> &nbsp;→&nbsp; ${T(`${d.r}x=${d.v}`)}`);
    const l2 = L(222, `Divide both sides by ${d.r}: &nbsp;${T(`x=${d.v}\\div${d.r}=${d.calc}`)}`);
    const l3 = hide(add(stage, box(cbox('u1l10-verdict', `${d.who} <b>${d.ans}</b>. That is just <b>amount ÷ rate</b>.`), 640, 54), (W - 640) / 2, 296));
    const show = (c, els) => Promise.all(els.map((e) => c.fadeIn(e)));
    return [
      { cap: `Write the rate as a fraction: <b>1 ${d.want}</b> for <b>${d.r} ${d.other}</b>.`, run: (c) => show(c, F1) },
      { cap: `The amount we know is <b>${d.v} ${d.other}</b>. Call the ${d.want} we get <b>x</b>. Same rate, so the fractions are equal.`, run: async (c) => { await c.pop(eq); await show(c, F2); await c.fadeIn(note); } },
      { cap: `Cross-multiply: the <b>blue</b> pair and the <b>orange</b> pair. ${T(`${d.r}\\times x=1\\times${d.v}`)}, so ${T(`${d.r}x=${d.v}`)}.`, run: async (c) => { F1[2].classList.add('pb'); F2[0].classList.add('pb'); F1[0].classList.add('po'); F2[2].classList.add('po'); await Promise.all([F1[2], F2[0], F1[0], F2[2]].map((e) => pulse(c, e, 1.1, 450))); await c.fadeIn(l1); } },
      { cap: `Divide both sides by ${d.r}: ${T(`x=${d.v}\\div${d.r}=${d.calc}`)}.`, run: (c) => c.fadeIn(l2) },
      { cap: `${d.who} <b>${d.ans}</b>. The proportion ends in <b>amount ÷ rate</b>: dividing is the shortcut.`, run: (c) => c.pop(l3) }
    ];
  }
};

/* =====================================================================================
 * 4. Read the rate table
 * ===================================================================================== */
const RT = [['US dollar (USD)', 'USD', '1.38', '0.725'], ['euro (EUR)', 'EUR', '1.55', '0.645'], ['British pound (GBP)', 'GBP', '1.82', '0.549'], ['Mexican peso (MXN)', 'MXN', '0.075', '13.3'], ['Japanese yen (JPY)', 'JPY', '0.0093', '108']];
const RB = {
  a: { ask: 'Example 4(a): use the rate table. Change <b>$250.00 CAD</b> into Japanese yen.', have: 'CAD', row: 4, col: 2, v: '250', mul: '108', res: 27000, rT: '27\\,000', out: amt(27000, 'JPY'), rate: ['CAD', '108', 'JPY'], note: 'Yen have no cents: a whole number of yen.' },
  b: { ask: 'Example 4(b): Lena comes home from Mexico with <b>1800 MXN</b>. What are they worth in CAD?', have: 'MXN', row: 3, col: 1, v: '1800', mul: '0.075', res: 135, rT: '135.00', out: amt(135, 'CAD'), rate: ['MXN', '0.075', 'CAD'], note: '1800 pesos is not very much money: a peso is only a few cents.' },
  c: { ask: 'Example 4(c): a theatre ticket in London costs <b>46.50 GBP</b>. What is that in CAD?', have: 'GBP', row: 2, col: 1, v: '46.50', mul: '1.82', res: 84.63, rT: '84.63', out: amt(84.63, 'CAD'), rate: ['GBP', '1.82', 'CAD'] },
  d: { ask: 'Example 4(d): change <b>$80.00 CAD</b> into euros.', have: 'CAD', row: 1, col: 2, v: '80.00', mul: '0.645', res: 51.60, rT: '51.60', out: amt(51.60, 'EUR'), rate: ['CAD', '0.645', 'EUR'] }
};
const rateBoard = {
  title: 'Read the rate table',
  height: 380,
  minW: 900,
  choices: [{ sep: 'Example 4 check:' }, { v: 'a', label: '(a) CAD → JPY' }, { v: 'b', label: '(b) MXN → CAD' }, { v: 'c', label: '(c) GBP → CAD' }, { v: 'd', label: '(d) CAD → EUR' }],
  ask: (k) => RB[k].ask,
  make(stage, k, ex) {
    const d = RB[k], W = ex.W, BX = 16, BY = 8, CWs = [210, 170, 170], RH = 50;
    const brd = add(stage, box(h('div', 'u1l10-board'), CWs[0] + CWs[1] + CWs[2] + 24, 6 * RH + 46), BX, BY);
    add(brd, box(h('div', 'u1l10-btitle', 'Exchange rates'), CWs[0] + CWs[1] + CWs[2], 30), 12, 6);
    const cell = (r, cI, html, cls) => add(brd, box(cbox('u1l10-bc ' + cls, html), CWs[cI] - 4, RH - 6), 12 + CWs.slice(0, cI).reduce((a, b) => a + b, 0) + 2, 40 + r * RH + 3);
    const heads = [cell(0, 0, 'Currency', 'hd'), cell(0, 1, '1 unit = ___ CAD', 'hd'), cell(0, 2, '1 CAD = ___ units', 'hd')];
    const cells = RT.map((row, i) => [cell(i + 1, 0, row[0], 'nm'), cell(i + 1, 1, row[2], 'dg'), cell(i + 1, 2, row[3], 'dg')]);
    const RX = BX + CWs[0] + CWs[1] + CWs[2] + 50, RW = W - RX - 16;
    add(stage, box(h('div', 'u1l10-amt sm', `<small>You have</small><b>${d.v}</b><span>${d.have}</span>`), RW, 90), RX, 8);
    const rl = hide(add(stage, box(cbox('u1l10-ratecard', rateT(...d.rate)), RW, 56), RX, 112));
    const wk = hide(add(stage, box(cbox('u1l10-work', T(`${d.v}\\times${d.mul}=${d.rT}`)), RW, 56), RX, 180));
    const out = hide(add(stage, box(cbox('u1l10-outc', `<b>${d.out}</b>`), RW, 60), RX, 248));
    const nt = d.note ? hide(add(stage, box(cbox('u1l10-small', d.note), RW, 56), RX, 314)) : null;
    const colTxt = d.col === 2 ? '1 CAD = ___ units' : '1 unit = ___ CAD';
    return [
      { cap: d.have === 'CAD' ? `You have <b>CAD</b>. Use the column that starts with CAD: <b>${colTxt}</b>.` : `You have <b>${d.have}</b>. Use the column that starts with 1 unit of ${d.have}: <b>${colTxt}</b>.`,
        run: async (c) => { heads[d.col].classList.add('hl'); cells.forEach((r) => r[d.col].classList.add('col')); await pulse(c, heads[d.col], 1.06, 450); } },
      { cap: `Go down to the <b>${RT[d.row][1]}</b> row: ${rateT(...d.rate)}.`, run: async (c) => { cells[d.row].forEach((e) => e.classList.add('row')); cells[d.row][d.col].classList.add('hit'); await pulse(c, cells[d.row][d.col], 1.2, 500); await c.fadeIn(rl); } },
      { cap: `Multiply: ${T(`${d.v}\\times${d.mul}=${d.rT}`)}.`, run: (c) => c.pop(wk) },
      { cap: `${d.have === 'CAD' ? 'You get' : 'They are worth'} <b>${d.out}</b>.${d.note ? ' ' + d.note : ''}`, run: async (c) => { await c.pop(out); if (nt) await c.fadeIn(nt); } }
    ];
  }
};

/* =====================================================================================
 * 5. Estimate in your head: add about a third
 * ===================================================================================== */
const ES = {
  a: { ask: 'Example 5(a): use ' + rateT('USD', '1.38', 'CAD') + '. A ball cap costs <b>$24.00 USD</b>. Estimate first, then find the exact cost.', p: '24.00', f: 24, third: 8, est: 32, ex: 33.12, lcd: '33.12', round: '$24 is already a friendly number: <b>3 × 8</b>.', end: 'The estimate is close ✓' },
  b: { ask: 'Example 5(b): use ' + rateT('USD', '1.38', 'CAD') + '. Running shoes cost <b>$119.99 USD</b>. Estimate first, then find the exact cost.', p: '119.99', f: 120, third: 40, est: 160, ex: 165.59, lcd: '165.5862', round: `Round the US price to a friendly number: ${T('119.99\\approx120')}.`, end: 'The estimate is close ✓ (a little low: 1.38 is a bit more than 1⅓).' }
};
const estimate = {
  title: 'Estimate in your head: add about a third',
  height: 370,
  minW: 900,
  choices: [{ sep: 'Example 5 check:' }, { v: 'a', label: '(a) Ball cap' }, { v: 'b', label: '(b) Running shoes' }],
  ask: (k) => ES[k].ask,
  make(stage, k, ex) {
    const d = ES[k], W = ex.W, X0 = 210, s = (W - X0 - 150) / (d.ex * 1.04), RH = 62;
    const lab = (y, html) => add(stage, box(h('div', 'u1l10-rlab', html), 190, RH), 10, y);
    const Y1 = 30, Y2 = 140, Y3 = 250;
    lab(Y1, `<b>US price</b><small>$${d.p} USD</small>`);
    const L2 = hide(lab(Y2, '<b>Estimate</b><small>in CAD</small>')), L3 = hide(lab(Y3, '<b>Exact</b><small>in CAD</small>'));
    const fw = d.f * s, tw = fw / 3;
    const bar1 = add(stage, box(cbox('u1l10-ebar us', `$${d.p}`), fw, RH - 8), X0, Y1 + 4);
    const thirds = [0, 1, 2].map((i) => hide(add(stage, box(cbox('u1l10-third' + (i === 2 ? ' pick' : ''), `$${d.third}`), tw, RH - 8), X0 + i * tw, Y1 + 4)));
    const bar2 = hide(add(stage, box(cbox('u1l10-ebar us', `$${d.f}`), fw, RH - 8), X0, Y2 + 4));
    const mv = hide(add(stage, box(cbox('u1l10-third pick', `+ $${d.third}`), tw, RH - 8), X0 + 2 * tw, Y1 + 4));
    const estL = hide(add(stage, box(cbox('u1l10-etot', `≈ <b>$${d.est}</b>`), 130, RH), X0 + fw + tw + 10, Y2));
    const bar3 = hide(add(stage, box(h('div', 'u1l10-ebar ex'), d.ex * s, RH - 8), X0, Y3 + 4));
    const exL = hide(add(stage, box(cbox('u1l10-etot ex', `<b>${M(d.ex)}</b>`), 130, RH), X0 + d.ex * s + 10, Y3));
    const exW = hide(add(stage, box(cbox('u1l10-small', T(`${d.p}\\times1.38=${d.lcd === '33.12' ? '33.12' : '165.586\\ldots'}`)), 360, 40), X0, Y3 + RH + 4));
    const gapL = hide(add(stage, box(cbox('u1l10-gap2', `${M(rnd(d.ex - d.est))} apart`), 150, 30), X0 + d.est * s - 20, Y3 - 32));
    const steps = [
      { cap: `Step 1: ${d.round}`, run: (c) => { bar1.firstChild.innerHTML = `$${d.f}`; return pulse(c, bar1, 1.04, 400); } },
      { cap: `Step 2: find about a third: ${T(`${d.f}\\div3=${d.third}`)}.`, run: async (c) => { await Promise.all(thirds.map((e, i) => c.fadeIn(e, 300, { delay: i * 120 }))); } },
      { cap: `Step 3: add it on: ${T(`${d.f}+${d.third}=${d.est}`)}. About <b>$${d.est} CAD</b>.`,
        run: async (c) => { await c.fadeIn(L2); await c.fadeIn(bar2); mv.style.opacity = 1; await c.anim(mv, [{ transform: 'translate(0,0)' }, { transform: `translate(${fw - 2 * tw}px, ${Y2 - Y1}px)` }], 700); await c.pop(estL); } },
      { cap: `Exact: ${T(`${d.p}\\times1.38=${d.lcd === '33.12' ? '33.12' : '165.586\\ldots'}`)}, so <b>${M(d.ex)} CAD</b>.`,
        run: async (c) => { await c.fadeIn(L3); await c.anim(bar3, [{ opacity: 0, transform: 'scaleX(0)', transformOrigin: 'left' }, { opacity: 1, transform: 'scaleX(1)', transformOrigin: 'left' }], 700); await Promise.all([c.pop(exL), c.fadeIn(exW)]); } },
      { cap: d.end, run: (c) => c.pop(gapL) }
    ];
    return steps;
  }
};

/* =====================================================================================
 * 6. Bigger or smaller? Catch the mistake
 * ===================================================================================== */
const BS = {
  kay: { ask: 'Example 5(c): use ' + rateT('USD', '1.38', 'CAD') + '. Kayden’s calculator says a <b>$45.00 USD</b> hoodie costs <b>$32.61 CAD</b>. Is that reasonable? What went wrong?',
    us: 45, est: 60, estT: '45+15=60', wrong: 32.61, wl: '32.60869565', right: 62.10, rl: '62.1', max: 80, step: 10,
    wcap: 'Kayden’s calculator says <b>$32.61</b>. That is <b>smaller</b> than 45. It can’t be right ✗', who: 'He divided' },
  hotel: { ask: 'Example 2(b): the hotel costs <b>$164.00 USD</b> a night, and ' + rateT('USD', '1.38', 'CAD') + '. What if you pressed ÷ by mistake?',
    us: 164, est: 220, estT: '165+55=220', wrong: 118.84, wl: '118.8405797', right: 226.32, rl: '226.32', max: 260, step: 20,
    wcap: 'Suppose you pressed ÷ by mistake: <b>$118.84</b>. That is <b>smaller</b> than 164. It can’t be right ✗', who: 'Dividing was the mistake' }
};
const biggerSmaller = {
  title: 'Bigger or smaller? Catch the mistake',
  height: 400,
  minW: 900,
  choices: [{ sep: 'Example 5(c) check:' }, { v: 'kay', label: 'Kayden’s hoodie' }, { sep: 'Example 2(b):' }, { v: 'hotel', label: 'What if you divided?' }],
  ask: (k) => BS[k].ask,
  make(stage, k, ex) {
    const d = BS[k], W = ex.W, L = 40, R = W - 40, Y = 92, px = (v) => L + (R - L) * v / d.max;
    const sv = svgAt(stage, W, 170, 0, 0);
    const zone = svgEl('rect', { x: px(d.us), y: Y - 22, width: R - px(d.us), height: 44, rx: 8, fill: '#e3f3ea' }, sv); hide(zone);
    svgEl('line', { x1: L, y1: Y, x2: R, y2: Y, stroke: '#4a4436', 'stroke-width': 3 }, sv);
    for (let v = 0; v <= d.max; v += d.step) { svgEl('line', { x1: px(v), y1: Y - 7, x2: px(v), y2: Y + 7, stroke: '#4a4436', 'stroke-width': 2 }, sv); const t = svgEl('text', { x: px(v), y: Y + 28, 'font-size': 15, 'text-anchor': 'middle', fill: '#4a4436' }, sv); t.textContent = v; }
    const zl = hide(add(stage, box(h('div', 'u1l10-zone', '→ the CAD price must be <b>bigger</b>'), 340, 26), Math.min(px(d.us) - 6, W - 350), 4));
    const pin = (v, cls, lab, up) => { const e = add(stage, box(cbox('u1l10-pin ' + cls + (up ? ' up' : ''), lab), 104, 30), px(v) - 52, up ? Y - 52 : Y + 36); const dot = svgEl('circle', { cx: px(v), cy: Y, r: 8, class: 'u1l10-dot ' + cls }, sv); hide(e, dot); return [e, dot]; };
    const pUS = pin(d.us, 'us', `$${d.us} USD`, true);
    const pE = pin(d.est, 'est', `≈ $${d.est}`, true);
    const pW = pin(d.wrong, 'no', M(d.wrong), false), pR = pin(d.right, 'ok', M(d.right), false);
    const CW = 320, cy = 200;
    const lw = hide(add(stage, box(lcdBox(`${d.us}÷1.38`, d.wl, 'big'), CW, 84), W / 2 - CW - 30, cy));
    const lr = hide(add(stage, box(lcdBox(`${d.us}×1.38`, d.rl, 'big'), CW, 84), W / 2 + 30, cy));
    const sw = hide(stamp(stage, 'Smaller ✗', { ok: false, x: W / 2 - CW / 2 - 30, y: cy + 128, rotate: 6 }));
    const sr = hide(stamp(stage, 'Bigger ✓', { ok: true, x: W / 2 + CW / 2 + 30, y: cy + 128, rotate: -6 }));
    const showPin = (c, p) => Promise.all([c.pop(p[0]), c.anim(p[1], [{ opacity: 0 }, { opacity: 1 }], 300)]);
    return [
      { cap: `A US dollar is worth <b>more</b> than a Canadian dollar, so the price in CAD must be a <b>bigger</b> number than ${d.us}.`, run: async (c) => { await showPin(c, pUS); await c.anim(zone, [{ opacity: 0 }, { opacity: 1 }], 400); await c.fadeIn(zl); } },
      { cap: `Estimate: add about a third: ${T(d.estT)}, so about <b>$${d.est} CAD</b>.`, run: (c) => showPin(c, pE) },
      { cap: d.wcap, run: async (c) => { await c.pop(lw); await showPin(c, pW); await stampIn(c, sw); } },
      { cap: `${d.who}. The rate starts with USD, the currency of the price, so <b>multiply</b>: ${T(`${d.us}.00\\times1.38=${n2(d.right)}`)}.`, run: async (c) => { await c.pop(lr); await showPin(c, pR); } },
      { cap: `<b>${M(d.right)} CAD</b> is bigger than ${d.us} and close to the estimate ✓`, run: (c) => stampIn(c, sr) }
    ];
  }
};

/* =====================================================================================
 * 7. The bank's two rates, at the counter
 * ===================================================================================== */
const BB = {
  a: { ask: 'Example 6(a): Owen buys <b>$600.00 USD</b> in cash. Which rate is used? How much does it cost him in CAD?', who: 'Owen', dir: 'sell', v: '600.00', op: '×', calc: '852.00', out: '$852.00 CAD',
    c1: 'Owen wants US cash: the bank <b>sells</b> him USD. Use <b>We sell</b>: 1 USD = 1.42 CAD.', c2: 'The amount, $600.00, is in USD, and the rate starts with USD: <b>multiply</b>.', c3: 'It costs Owen <b>$852.00 CAD</b>.' },
  b: { ask: 'Example 6(b): his sister has <b>$500.00 CAD</b> to change. How many US dollars does she get?', who: 'His sister', dir: 'sell', v: '500.00', op: '÷', calc: '352.112\\ldots', out: '$352.11 USD',
    c1: 'She wants US cash too: the bank <b>sells</b> USD. Use <b>We sell</b> again: 1 USD = 1.42 CAD.', c2: 'She has <b>CAD</b>, and the rate starts with USD: <b>divide</b>.', c3: 'She gets <b>$352.11 USD</b>.' },
  c: { ask: 'Example 6(c): Owen comes home with <b>$140.00 USD</b> left and sells it back to the bank. How much CAD does he get?', who: 'Owen', dir: 'buy', v: '140.00', op: '×', calc: '187.60', out: '$187.60 CAD',
    c1: 'Owen sells his US cash back: the bank <b>buys</b> it. Use <b>We buy</b>: 1 USD = 1.34 CAD.', c2: 'The amount, $140.00, is in USD: <b>multiply</b>.', c3: 'He gets <b>$187.60 CAD</b>. The lower rate: the bank pays less than it charged.' }
};
const buySell = {
  title: 'The bank’s two rates',
  height: 400,
  minW: 900,
  choices: [{ sep: 'Example 6 check:' }, { v: 'a', label: '(a) Owen buys USD' }, { v: 'b', label: '(b) His sister' }, { v: 'c', label: '(c) Owen sells back' }],
  ask: (k) => BB[k].ask,
  make(stage, k, ex) {
    const d = BB[k], W = ex.W, sell = d.dir === 'sell', rate = sell ? '1.42' : '1.34';
    const brd = add(stage, box(h('div', 'u1l10-board'), 420, 236), 16, 8);
    add(brd, box(h('div', 'u1l10-btitle', 'Example Bank · foreign cash'), 396, 26), 12, 6);
    add(brd, box(h('div', 'u1l10-bsub', 'CAD for 1 unit'), 396, 20), 12, 32);
    const CWs = [176, 110, 110], RH = 44;
    const cell = (r, cI, html, cls) => add(brd, box(cbox('u1l10-bc ' + cls, html), CWs[cI] - 4, RH - 6), 12 + CWs.slice(0, cI).reduce((a, b) => a + b, 0) + 2, 56 + r * RH + 3);
    const hd = [cell(0, 0, 'Currency', 'hd'), cell(0, 1, 'We buy', 'hd'), cell(0, 2, 'We sell', 'hd')];
    const rows = [['USD', '1.34', '1.42'], ['EUR', '1.50', '1.60'], ['MXN', '0.070', '0.080']].map((r, i) => [cell(i + 1, 0, r[0], 'nm'), cell(i + 1, 1, r[1], 'dg'), cell(i + 1, 2, r[2], 'dg')]);
    const ci = sell ? 2 : 1;
    // the counter scene
    const SX = 470, SW = W - SX - 16;
    const you = add(stage, box(cbox('u1l10-who', `<svg viewBox="0 0 60 60" width="56" height="56"><circle cx="30" cy="20" r="12" fill="#e0a77a" stroke="#6b3f14" stroke-width="2.5"/><path d="M8 58 Q30 26 52 58 Z" fill="#3b78d8" stroke="#1f3f7a" stroke-width="2.5"/></svg><b>${d.who}</b>`), 120, 100), SX, 20);
    const bank = add(stage, box(cbox('u1l10-who', '<svg viewBox="0 0 60 60" width="56" height="56"><path d="M4 22 L30 6 L56 22 Z" fill="#9a6a24" stroke="#4a3010" stroke-width="2.5" stroke-linejoin="round"/><rect x="10" y="24" width="7" height="24" fill="#d9cdb8"/><rect x="26" y="24" width="7" height="24" fill="#d9cdb8"/><rect x="42" y="24" width="7" height="24" fill="#d9cdb8"/><rect x="4" y="48" width="52" height="8" fill="#9a6a24"/></svg><b>Bank</b>'), 120, 100), SX + SW - 120, 20);
    const tr = svgAt(stage, W, 240, 0, 0), ax0 = SX + 128, ax1 = SX + SW - 128;
    const lane = (y, toRight, col) => { const g = svgEl('g', {}, tr); svgEl('line', { x1: ax0, y1: y, x2: ax1, y2: y, stroke: col, 'stroke-width': 3, 'stroke-dasharray': '6 6' }, g); arrowHead(g, toRight ? ax1 : ax0, y, toRight ? 1 : -1, 0, { color: col, width: 3 }); hide(g); return g; };
    // foreign cash moves bank → you when the bank sells, you → bank when it buys; CAD the other way
    const ln1 = lane(52, !sell, '#2f6b3a'), ln2 = lane(96, sell, '#c0392b');
    const usd = hide(add(stage, box(cbox('u1l10-bill usd', 'USD'), 64, 30), sell ? ax1 - 64 : ax0, 37));
    const cad = hide(add(stage, box(cbox('u1l10-bill cad', 'CAD'), 64, 30), sell ? ax0 : ax1 - 64, 81));
    [usd, cad].forEach((e) => { e.style.zIndex = 2; });
    const verb = hide(add(stage, box(cbox('u1l10-verb', sell ? 'The bank <b>sells</b> USD: higher rate' : 'The bank <b>buys</b> USD: lower rate'), SW, 36), SX, 128));
    const w1 = hide(add(stage, box(cbox('u1l10-ratecard', `${T(`1\\text{ USD}=${rate}\\text{ CAD}`)} <span class="u1l10-tagw">${sell ? 'We sell' : 'We buy'}</span>`), SW, 54), SX, 176));
    const w2 = hide(add(stage, box(cbox('u1l10-work', T(`${d.v}${d.op === '×' ? '\\times' : '\\div'}${rate}=${d.calc}`)), 600, 56), (W - 600) / 2, 262));
    const w3 = hide(add(stage, box(cbox('u1l10-outc', `<b>${d.out}</b>`), 360, 60), (W - 360) / 2, 330));
    const travel = (c, el, dx) => c.anim(el, [{ opacity: 1, transform: 'translateX(0)' }, { opacity: 1, transform: `translateX(${dx}px)` }], 900);
    const dist = ax1 - ax0 - 64 - 18;
    return [
      { cap: d.c1, run: async (c) => { hd[ci].classList.add('hl'); rows[0][ci].classList.add('hit'); rows.forEach((r) => r[ci].classList.add('col')); await pulse(c, rows[0][ci], 1.2, 450);
        await Promise.all([c.anim(ln1, [{ opacity: 0 }, { opacity: 1 }], 250), c.anim(ln2, [{ opacity: 0 }, { opacity: 1 }], 250)]);
        await Promise.all([travel(c, usd, sell ? -dist : dist), travel(c, cad, sell ? dist : -dist)]); await c.fadeIn(verb); await c.fadeIn(w1); } },
      { cap: `${d.c2} ${T(`${d.v}${d.op === '×' ? '\\times' : '\\div'}${rate}=${d.calc}`)}`, run: (c) => c.pop(w2) },
      { cap: d.c3, run: (c) => c.pop(w3) }
    ];
  }
};

/* =====================================================================================
 * 8. There and back: money lost
 * ===================================================================================== */
const RTR = {
  d: { ask: 'Example 6(d): how much did Owen’s <b>$140.00 USD</b> cost him before the trip (We sell 1.42)? How much did he lose by changing them back (We buy 1.34)?',
    a: 198.80, u: 140.00, b: 187.60, aT: '140.00\\times1.42=198.80', bT: '140.00\\times1.34=187.60', loss: 11.20,
    c1: `Before the trip, the bank <b>sold</b> him the $140.00 USD at 1.42: ${T('140.00\\times1.42=198.80')}. They cost <b>$198.80 CAD</b>.`,
    c2: 'The Canadian money goes to the bank, and Owen takes <b>$140.00 USD</b> on his trip.',
    c3: `After the trip, the bank <b>buys</b> them back at 1.34: ${T('140.00\\times1.34=187.60')}. He gets <b>$187.60 CAD</b>.`,
    c4: `Compare: ${T('198.80-187.60=11.20')}. Owen lost <b>$11.20</b>.` },
  k: { ask: 'Change <b>$1000.00 CAD</b> into US dollars (We sell 1.42), then change it all straight back (We buy 1.34). How much is lost?',
    a: 1000, u: 704.23, b: 943.67, aT: '1000\\div1.42=704.225\\ldots', bT: '704.23\\times1.34=943.668\\ldots', loss: 56.33,
    c1: 'Start with <b>$1000.00 CAD</b>.',
    c2: `The bank sells USD at 1.42, and the rate starts with USD: divide. ${T('1000\\div1.42=704.225\\ldots')}, so <b>$704.23 USD</b>.`,
    c3: `Change it straight back: the bank buys at 1.34. ${T('704.23\\times1.34=943.668\\ldots')}, so <b>$943.67 CAD</b>.`,
    c4: `Lost: ${T('1000.00-943.67=56.33')}. <b>$56.33</b> gone, and you never left home!` }
};
const roundTrip = {
  title: 'There and back: money lost',
  height: 400,
  minW: 900,
  choices: [{ sep: 'Example 6(d) check:' }, { v: 'd', label: 'Owen’s $140 USD' }, { sep: 'More:' }, { v: 'k', label: '$1000 CAD there and back' }],
  ask: (k) => RTR[k].ask,
  make(stage, k, ex) {
    const d = RTR[k], W = ex.W, BASE = 370, MAXH = 220, s = MAXH / Math.max(d.a, d.u, d.b), SW = 120;
    const xL = 50, xM = W / 2 - SW / 2, xR = W - 50 - SW;
    add(stage, box(cbox('u1l10-who bank2', '<svg viewBox="0 0 60 60" width="64" height="64"><path d="M4 22 L30 6 L56 22 Z" fill="#9a6a24" stroke="#4a3010" stroke-width="2.5" stroke-linejoin="round"/><rect x="10" y="24" width="7" height="24" fill="#d9cdb8"/><rect x="26" y="24" width="7" height="24" fill="#d9cdb8"/><rect x="42" y="24" width="7" height="24" fill="#d9cdb8"/><rect x="4" y="48" width="52" height="8" fill="#9a6a24"/></svg><b>Bank</b>'), 130, 96), W / 2 - 65, 4);
    const stack = (x, v, cls, lab, top, ly) => {
      const hh = v * s, e = add(stage, box(h('div', 'u1l10-stack ' + cls), SW, hh), x, BASE - hh);
      const l = add(stage, box(cbox('u1l10-slab ' + cls, lab), SW + 60, 30), x - 30, (ly ?? BASE - hh) - 34);
      const t = add(stage, box(cbox('u1l10-stop', top), SW + 80, 24), x - 40, BASE + 4);
      hide(e, l, t); return [e, l, t];
    };
    const A = stack(xL, d.a, 'cad', amt(d.a, 'CAD'), 'before'), U = stack(xM, d.u, 'usd', amt(d.u, 'USD'), 'in US cash'), B = stack(xR, d.b, 'cad', amt(d.b, 'CAD'), 'after', BASE - d.a * s);
    const sv = svgAt(stage, W, 400, 0, 0);
    const arr = (x1, x2, lab, col) => { const g = svgEl('g', {}, sv), y = 262; svgEl('line', { x1, y1: y, x2: x2 - 4, y2: y, stroke: col, 'stroke-width': 4 }, g); arrowHead(g, x2, y, 1, 0, { color: col, width: 4 }); hide(g);
      const l = hide(add(stage, box(cbox('u1l10-alab', lab), 220, 30), (x1 + x2) / 2 - 110, y - 40)); return [g, l]; };
    const a1 = arr(xL + SW + 12, xM - 12, 'bank sells at <b>1.42</b>', '#c0392b'), a2 = arr(xM + SW + 12, xR - 12, 'bank buys at <b>1.34</b>', '#2f6b3a');
    const ghost = hide(add(stage, box(h('div', 'u1l10-ghost'), SW, (d.a - d.b) * s), xR, BASE - d.a * s));
    const gl = hide(add(stage, box(cbox('u1l10-loss', `lost <b>${M(d.loss)}</b>`), 150, 34), xR - 160, BASE - d.a * s + ((d.a - d.b) * s) / 2 - 17));
    const fin = hide(add(stage, box(cbox('u1l10-small', 'The bank <b>sells high</b> and <b>buys low</b>. The gap is how it makes money.'), 330, 70), 12, 8));
    const showS = (c, S) => Promise.all([c.anim(S[0], [{ opacity: 0, transform: 'scaleY(0)', transformOrigin: 'bottom' }, { opacity: 1, transform: 'scaleY(1)', transformOrigin: 'bottom' }], 600), c.fadeIn(S[1]), c.fadeIn(S[2])]);
    const showA = (c, a) => Promise.all([c.anim(a[0], [{ opacity: 0 }, { opacity: 1 }], 400), c.fadeIn(a[1])]);
    const steps = [
      { cap: d.c1, run: (c) => showS(c, A) },
      { cap: d.c2, run: async (c) => { await showA(c, a1); await showS(c, U); } },
      { cap: d.c3, run: async (c) => { await showA(c, a2); await showS(c, B); } }];
    steps.push({ cap: d.c4, run: async (c) => { await c.anim(ghost, [{ opacity: 0 }, { opacity: 1 }], 400); await c.pop(gl); } });
    steps.push({ cap: 'The bank <b>sells high</b> and <b>buys low</b>. The gap between the two rates is how it makes money.', run: (c) => c.fadeIn(fin) });
    return steps;
  }
};

/* =====================================================================================
 * 9. Compare the total cost (fees, and the Calgary store)
 * ===================================================================================== */
const CT = {
  e7: { ask: 'Example 7: Lucia needs <b>250 EUR</b> in cash for Spain. Bank: 1 EUR = 1.60 CAD, no fee. Airport kiosk: 1.57 plus a $9.95 fee. Mall: 1.55 plus 4% commission. Where is it cheapest?',
    min: 370, max: 410, tick: 10, axis: 'Total in CAD (the scale starts at $370)',
    rows: [{ lab: 'Bank', sub: '1.60, no fee', segs: [400] }, { lab: 'Airport kiosk', sub: '1.57 + $9.95', segs: [392.50, 9.95] }, { lab: 'Mall exchange', sub: '1.55 + 4%', segs: [387.50, 15.50] }],
    steps: [
      { cap: `Bank: ${T('250\\times1.60=400.00')}, no fee. Total <b>$400.00</b>.`, row: 0, seg: 0, tot: true },
      { cap: `Airport kiosk: ${T('250\\times1.57=392.50')}. Cheaper so far…`, row: 1, seg: 0 },
      { cap: `…plus the $9.95 fee: ${T('392.50+9.95=402.45')}.`, row: 1, seg: 1, tot: true },
      { cap: `Mall: ${T('250\\times1.55=387.50')}. The best rate…`, row: 2, seg: 0 },
      { cap: `…plus 4% commission: ${T('387.50\\times1.04=403.00')}.`, row: 2, seg: 1, tot: true }],
    win: 0, stampT: 'Cheapest', end: 'The <b>bank</b> is cheapest at <b>$400.00</b>, even though its rate is the highest, because it charges no fee.' },
  e8: { ask: 'Example 8: a US website sells the hoodie for <b>$52.00 USD</b> plus <b>$11.50 USD</b> shipping; the card uses 1 USD = 1.38 CAD and adds 2.5%. A Calgary store sells it for <b>$79.99</b> plus 5% GST.',
    min: 70, max: 95, tick: 5, axis: 'Total in CAD (the scale starts at $70)',
    rows: [{ lab: 'US website', sub: '$63.50 USD', segs: [87.63, 2.19] }, { lab: 'Calgary store', sub: '$79.99 + GST', segs: [79.99, 4.00] }],
    steps: [
      { cap: `Online, the US total: ${T('52.00+11.50=63.50')} USD.`, row: 0, sub: true },
      { cap: `In CAD: ${T('63.50\\times1.38=87.63')}.`, row: 0, seg: 0 },
      { cap: `Add the 2.5% fee: ${T('87.63\\times1.025=89.82')}. Online total <b>$89.82 CAD</b>.`, row: 0, seg: 1, tot: true },
      { cap: `Calgary store: $79.99 plus 5% GST: ${T('79.99\\times1.05=83.9895')}, so <b>$83.99</b>.`, row: 1, seg: 'all', tot: true }],
    win: 1, stampT: 'Better deal', end: `The <b>Calgary store</b> is cheaper by ${T('89.82-83.99=\\$5.83')}. And Tyler can try it on and take it home today.` }
};
const TOT = { e7: ['$400.00', '$402.45', '$403.00'], e8: ['$89.82', '$83.99'] };
const SEGLAB = { e7: [['$400.00'], ['$392.50', '+$9.95'], ['$387.50', '+4%']], e8: [['$87.63', '+2.5%'], ['$79.99', '+GST']] };
const compareTotals = {
  title: 'Compare the total cost',
  height: 400,
  minW: 900,
  choices: [{ sep: 'Example check:' }, { v: 'e7', label: '7 Lucia’s euros' }, { v: 'e8', label: '8 Tyler’s hoodie' }],
  ask: (k) => CT[k].ask,
  make(stage, k, ex) {
    const d = CT[k], W = ex.W, X0 = 230, X1 = W - 150, px = (v) => X0 + (X1 - X0) * (v - d.min) / (d.max - d.min);
    const n = d.rows.length, RH = 64, gap = n === 3 ? 22 : 50, Y0 = 20;
    const sv = svgAt(stage, W, 400, 0, 0), AY = Y0 + n * (RH + gap) + 4;
    svgEl('line', { x1: X0, y1: AY, x2: X1, y2: AY, stroke: '#4a4436', 'stroke-width': 2 }, sv);
    for (let v = d.min; v <= d.max + 1e-9; v += d.tick) { svgEl('line', { x1: px(v), y1: Y0 - 6, x2: px(v), y2: AY + 6, stroke: v === d.min ? '#4a4436' : '#e3dccd', 'stroke-width': v === d.min ? 2 : 1.5 }, sv); const t = svgEl('text', { x: px(v), y: AY + 24, 'font-size': 15, 'text-anchor': 'middle', fill: '#4a4436' }, sv); t.textContent = '$' + v; }
    if (d.min > 0) svgEl('path', { d: `M${X0 - 8} ${AY - 10} l6 -6 l6 12 l6 -6`, fill: 'none', stroke: '#4a4436', 'stroke-width': 2 }, sv);
    add(stage, box(cbox('u1l10-axis', d.axis), X1 - X0, 24), X0, AY + 30);
    const R = d.rows.map((r, i) => {
      const y = Y0 + i * (RH + gap);
      const lb = add(stage, box(h('div', 'u1l10-rlab', `<b>${r.lab}</b><small>${r.sub}</small>`), 210, RH), 10, y);
      const sub = lb.querySelector('small'); if (k === 'e8' && i === 0) hide(sub);
      let acc = 0;
      const segs = r.segs.map((v, j) => { const from = j === 0 ? d.min : acc; acc += v; const wd = Math.max(4, px(acc) - px(from));
        const e = add(stage, box(cbox('u1l10-seg s' + j + (r.segs.length === 1 ? ' only' : ''), wd > 50 ? SEGLAB[k][i][j] : ''), wd, RH - 14), px(from), y + 7); hide(e); return e; });
      const tot = hide(add(stage, box(cbox('u1l10-tot', `<b>${TOT[k][i]}</b>`), 120, RH), px(acc) + 8, y));
      return { lb, sub, segs, tot, y };
    });
    const win = R[d.win];
    const st = hide(stamp(stage, d.stampT, { ok: true, x: Math.min(W - 115, px(d.rows[d.win].segs.reduce((a, b) => a + b, 0)) + 210), y: win.y + RH / 2, rotate: -8 }));
    const grow = (c, e) => c.anim(e, [{ opacity: 0, transform: 'scaleX(0)', transformOrigin: 'left' }, { opacity: 1, transform: 'scaleX(1)', transformOrigin: 'left' }], 600);
    const steps = d.steps.map((s) => ({ cap: s.cap, run: async (c) => {
      const r = R[s.row];
      if (s.sub) { await c.pop(r.sub); return; }
      if (s.seg === 'all') { for (const e of r.segs) await grow(c, e); } else await grow(c, r.segs[s.seg]);
      if (s.tot) await c.pop(r.tot);
    } }));
    steps.push({ cap: d.end, run: async (c) => { R.forEach((r, i) => r.lb.classList.toggle('dim', i !== d.win)); await stampIn(c, st); } });
    return steps;
  }
};

/* =====================================================================================
 * 10. Flat fee or percent? (Full notes)
 * ===================================================================================== */
const FB = { 100: [160.00, 166.95, 161.20, 155.00], 250: [400.00, 402.45, 403.00, 387.50], 400: [640.00, 637.95, 644.80, 620.00], 1000: [1600.00, 1579.95, 1612.00, 1550.00] };
const feeBreak = {
  title: 'Flat fee or percent? It depends on the amount',
  height: 400,
  minW: 900,
  choices: [{ sep: 'Buy this many euros:' }, { v: 100, label: '100 EUR' }, { v: 250, label: '250 EUR (Lucia)' }, { v: 400, label: '400 EUR' }, { v: 1000, label: '1000 EUR' }],
  ask: (a) => `You need <b>${a} EUR</b>. Bank: 1 EUR = 1.60 CAD, no fee. Airport kiosk: 1.57 plus a $9.95 fee. Mall: 1.55 plus 4% commission. Which is cheapest?`,
  make(stage, a, ex) {
    const W = ex.W, [bk, ki, ma, mb] = FB[a], tots = [bk, ki, ma], best = tots.indexOf(Math.min(...tots));
    const TW = (W - 80) / 3, names = ['Bank', 'Airport kiosk', 'Mall exchange'];
    const works = [`${a}\\times1.60`, `${a}\\times1.57+9.95`, `${big(mb, 2).replace(/ /g, '\\,')}\\times1.04`];
    const tk = names.map((nm, i) => {
      const e = add(stage, box(h('div', 'u1l10-ticket'), TW - 10, 170), 20 + i * (TW + 20), 10);
      e.innerHTML = `<div class="nm">${nm}</div><div class="wk">${T(works[i])}</div><div class="v">$0.00</div>`;
      const wk = e.querySelector('.wk'), v = e.querySelector('.v'); hide(wk); return { e, wk, v };
    });
    const st = hide(stamp(stage, 'Cheapest', { ok: true, x: 20 + best * (TW + 20) + (TW - 10) / 2, y: 178, rotate: -7 }));
    // the strip: who wins for each amount
    const L = 60, R = W - 60, Y = 262, MX = 1000, px = (v) => L + (R - L) * v / MX, BE = 9.95 / 0.03;
    const sv = svgAt(stage, W, 400, 0, 0);
    const g = svgEl('g', {}, sv); hide(g);
    svgEl('rect', { x: L, y: Y - 18, width: px(BE) - L, height: 36, fill: '#e3f3ea', rx: 6 }, g);
    svgEl('rect', { x: px(BE), y: Y - 18, width: R - px(BE), height: 36, fill: '#e7eefb', rx: 6 }, g);
    svgEl('line', { x1: L, y1: Y + 18, x2: R, y2: Y + 18, stroke: '#4a4436', 'stroke-width': 2 }, g);
    for (let v = 0; v <= MX; v += 100) { svgEl('line', { x1: px(v), y1: Y + 12, x2: px(v), y2: Y + 24, stroke: '#4a4436', 'stroke-width': 2 }, g); const t = svgEl('text', { x: px(v), y: Y + 42, 'font-size': 14, 'text-anchor': 'middle', fill: '#4a4436' }, g); t.textContent = v; }
    const t1 = svgEl('text', { x: (L + px(BE)) / 2, y: Y + 6, 'font-size': 16, 'font-weight': 800, 'text-anchor': 'middle', fill: '#0e5e41' }, g); t1.textContent = 'bank cheapest';
    const t2 = svgEl('text', { x: (px(BE) + R) / 2, y: Y + 6, 'font-size': 16, 'font-weight': 800, 'text-anchor': 'middle', fill: '#1f3f7a' }, g); t2.textContent = 'kiosk cheapest';
    const t3 = svgEl('text', { x: R, y: Y + 60, 'font-size': 14, 'text-anchor': 'end', fill: '#4a4436' }, g); t3.textContent = 'euros bought';
    svgEl('path', { d: `M${px(a)} ${Y - 22} l-9 -16 h18 Z`, fill: '#c0392b' }, g);
    const be = hide(add(stage, box(cbox('u1l10-small', `Break-even: the kiosk saves 3¢ a euro, so ${T('9.95\\div0.03\\approx332')} euros pay off its fee.`), 780, 40), (W - 780) / 2, 340));
    const fill = (c, i) => Promise.all([c.fadeIn(tk[i].wk), countTo(c, tk[i].v, 0, tots[i], 700, (v) => '$' + big(v, 2))]);
    const verdict = best === 0 ? `The <b>bank</b> is cheapest: the $9.95 fee costs more than the kiosk’s better rate saves.` : `Now the <b>kiosk</b> is cheapest: its better rate saves more than the $9.95 fee.`;
    return [
      { cap: `Bank: ${T(`${a}\\times1.60=${bigT(bk, 2)}`)}, no fee.`, run: (c) => fill(c, 0) },
      { cap: `Airport kiosk: ${T(`${a}\\times1.57+9.95=${bigT(ki, 2)}`)}.`, run: (c) => fill(c, 1) },
      { cap: `Mall: ${T(`${a}\\times1.55=${bigT(mb, 2)}`)}, then ${T(`${bigT(mb, 2)}\\times1.04=${bigT(ma, 2)}`)}.`, run: (c) => fill(c, 2) },
      { cap: verdict, run: async (c) => { tk.forEach((t, i) => t.e.classList.toggle('dim', i !== best)); await stampIn(c, st); } },
      { cap: `Below about <b>332 EUR</b> the bank wins; above it, the kiosk wins. The mall never wins: ${T('1.55\\times1.04=1.612')} CAD a euro, more than the bank’s 1.60.`, run: async (c) => { await c.anim(g, [{ opacity: 0 }, { opacity: 1 }], 500); await c.fadeIn(be); } }
    ];
  }
};

mountExplainers({ rateMeaning, converter, proportion, rateBoard, estimate, biggerSmaller, buySell, roundTrip, compareTotals, feeBreak });

/* ============ Stand Up Break! — converting, multiply or divide, the bank's two rates, at the whiteboards ============ */
{
  const dd = (v) => rnd(v, 2).toFixed(2);
  const ITEMS = [['a pair of jeans', 40, 95], ['a video game', 49, 79], ['a hockey jersey', 90, 160], ['a phone case', 15, 35], ['concert tickets', 60, 180], ['a tent', 120, 260], ['a pair of boots', 70, 150]];
  standup('u1l10', {
    intro: 'Write the rate first. Decide: multiply or divide? Estimate, then check: bigger or smaller?',
    levels: {
      BEG: (r) => { // a US price in CAD: the rate starts with the currency of the price
        const [what, lo, hi] = r.pick(ITEMS), p = r.int(lo, hi) + r.pick([0, 0.49, 0.99, 0.50]), rate = r.pick([1.35, 1.36, 1.37, 1.38, 1.39, 1.40, 1.41]);
        return { text: `The rate is <b>1 USD = ${rate.toFixed(2)} CAD</b>. In Montana, ${what} costs <b>$${dd(p)} USD</b>. What is that in Canadian dollars?`, q: '',
          a: [`\\text{Starts with USD: multiply}`, `${dd(p)}\\times${rate.toFixed(2)}=${rnd(p * rate, 4)}`, `\\approx\\$${dd(p * rate)}\\text{ CAD}`] };
      },
      PRG: (r) => r.pick([
        () => { // only a rate that starts with the currency you want: divide
          const cad = r.pick([200, 250, 300, 400, 500, 600, 750]), rate = r.pick([1.48, 1.50, 1.52, 1.54, 1.56, 1.58]), e = cad / rate;
          return { text: `You have <b>$${dd(cad)} CAD</b> for a trip to Germany. The only rate posted is <b>1 EUR = ${rate.toFixed(2)} CAD</b>. How many euros do you get?`, q: '',
            a: [`\\text{Starts with EUR (the one you want): divide}`, `${cad}\\div${rate.toFixed(2)}=${rnd(e, 4)}`, `\\approx${dd(e)}\\text{ EUR}`] };
        },
        () => { // pesos to CAD from a "1 CAD = … MXN" rate: divide
          const mx = r.pick([600, 850, 1200, 1500, 2400]), rate = r.pick([12.6, 12.9, 13.1, 13.3, 13.6]), c = mx / rate;
          return { text: `A snorkel tour in Mexico costs <b>${mx} MXN</b>. The rate is <b>1 CAD = ${rate} MXN</b>. What is the tour in Canadian dollars?`, q: '',
            a: [`\\text{The price is in MXN; the rate starts with CAD: divide}`, `${mx}\\div${rate}=${rnd(c, 4)}`, `\\approx\\$${dd(c)}\\text{ CAD}`] };
        }
      ])(),
      MAS: (r) => { // the bank's two rates: buy for the trip, sell the leftover back, find the loss
        const buy = r.pick([1.32, 1.33, 1.34, 1.35]), sell = rnd(buy + r.pick([0.06, 0.08, 0.09, 0.10]), 2), u = r.pick([300, 400, 500, 600, 800]), left = r.pick([60, 80, 90, 120, 150]);
        const cost = u * sell, back = left * buy, paid = left * sell;
        return { text: `A bank <b>buys</b> USD at <b>${buy.toFixed(2)}</b> and <b>sells</b> USD at <b>${sell.toFixed(2)}</b> (CAD for 1 USD). You buy <b>$${u}.00 USD</b> for a trip and come home with <b>$${left}.00 USD</b>, which you sell back. Find what the trip cash cost, what you get back, and how much you lost on the leftover.`, q: '',
          a: [`\\text{Cost: }${u}\\times${sell.toFixed(2)}=\\$${dd(cost)}\\text{ CAD}`, `\\text{Back: }${left}\\times${buy.toFixed(2)}=\\$${dd(back)}\\text{ CAD}`, `\\text{Lost: }${dd(paid)}-${dd(back)}=\\$${dd(paid - back)}`] };
      }
    }
  });
}
