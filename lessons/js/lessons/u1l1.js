/* Math 10-3 · Unit 1 · Lesson 1 — Money Sense: Rounding, Estimating and Using Your Calculator (refresher).
 * Explainers: the place-value chart with money in each column, the cents → dollars "money slider", ordering prices
 * (Full notes), rounding on three number lines, round only at the end (Full notes), the receipt that totals itself
 * while an estimate races it, the "does it make sense?" verdict stamp, the BEDMAS machine, counting up change like a
 * cashier, and cash rounding to the nearest 5¢. Then the Stand Up Break and the penny's Math History animation. */
import { h, add, box, tex, svgEl, pop, fadeIn, appear, pulse, shake, sleep, tween, stamp, stampIn, mountExplainers } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const BR = '#6e4a1c', BLUE = '#1f5bd6', GREEN = '#12805a', PURPLE = '#7b4fc4', RED = '#c93a33', AMBER = '#c27a0e', INK = '#1c2230';
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const D = (c) => '$' + (c / 100).toFixed(2);          // cents → "$13.65"
const DT = (c) => '\\$' + (c / 100).toFixed(2);       // cents → TeX
const plural = (n, w, ws) => (n === 1 ? w : ws || w + 's');

/* coins and bills (Canadian): [label, class] */
const COIN = {
  penny: ['1¢', 'pen'], sliver: ['', 'sl'], nickel: ['5¢', 'nic'], dime: ['10¢', 'dim'], quarter: ['25¢', 'qua'],
  loonie: ['$1', 'loo'], toonie: ['$2', 'too'], bill5: ['$5', 'b5'], bill10: ['$10', 'b10'], bill20: ['$20', 'b20']
};
const coin = (k) => h('div', 'u1l1-coin u1l1-c-' + COIN[k][1], COIN[k][0]);

/* =====================================================================================
 * 1. The place-value chart, with the money each digit stands for
 * ===================================================================================== */
const PVC = [
  { k: 't', name: 'Tens', sub: '$10 bills', w: 150, c: BR, coin: 'bill10' },
  { k: 'o', name: 'Ones', sub: 'dollars', w: 150, c: BR, coin: 'loonie' },
  { k: 'pt', w: 44 },
  { k: 'd', name: 'Tenths', sub: 'dimes', w: 150, c: BLUE, coin: 'dime' },
  { k: 'h', name: 'Hundredths', sub: 'cents', w: 170, c: GREEN, coin: 'penny' },
  { k: 'th', name: 'Thousandths', sub: 'tenths of a cent', w: 196, c: PURPLE, coin: 'sliver' }
];
const PV = {
  e1: { s: '23.586', ask: 'Example 1(a): write each digit of <b>$23.586</b> in the place-value chart. (b) What is the value of the 8?' },
  gas: { s: '1.479', ask: 'Gas costs <b>$1.479</b> per litre. What does each digit stand for?' },
  calc: { s: '4.5', ask: 'After adding a bill, the calculator shows <b>4.5</b>. How much money is that?' }
};
const placeValue = {
  title: 'The place-value chart for money',
  height: 410,
  minW: 900,
  choices: [{ sep: 'Example 1 check:' }, { v: 'e1', label: '$23.586' }, { sep: 'More:' }, { v: 'gas', label: 'Gas: $1.479' }, { v: 'calc', label: 'Calculator: 4.5' }],
  ask: (k) => PV[k].ask,
  make(stage, k, ex) {
    const d = PV[k], [wh, fr = ''] = d.s.split('.');
    const dig = { t: wh.length > 1 ? wh[wh.length - 2] : '', o: wh[wh.length - 1], d: fr[0] || '', h: fr[1] || '', th: fr[2] || '' };
    const W = ex.W, TW = PVC.reduce((s, c) => s + c.w, 0), x0 = Math.round((W - TW) / 2);
    const xs = {}; let x = x0; PVC.forEach((c) => { xs[c.k] = x; x += c.w; });
    // the amount, digit by digit
    const amt = add(stage, h('div', 'u1l1-amt'), 0, 4); box(amt, W);
    const span = {};
    amt.appendChild(h('i', 'u1l1-ad', '$'));
    ['t', 'o'].forEach((q) => { if (dig[q]) amt.appendChild(span[q] = h('i', 'u1l1-ad', dig[q])); });
    amt.appendChild(h('i', 'u1l1-ad', '.'));
    ['d', 'h', 'th'].forEach((q) => { if (dig[q]) amt.appendChild(span[q] = h('i', 'u1l1-ad', dig[q])); });
    const extra0 = h('i', 'u1l1-ad u1l1-new', '0'); if (!dig.h) { amt.appendChild(extra0); hide(extra0); }
    // whole dollars | parts of a dollar
    const bandL = hide(add(stage, box(h('div', 'u1l1-band l', 'whole dollars'), xs.pt - x0, 158), x0, 66));
    const bandR = hide(add(stage, box(h('div', 'u1l1-band r', 'parts of a dollar'), x0 + TW - xs.d, 158), xs.d, 66));
    const cell = {}, area = {};
    PVC.forEach((c) => {
      if (c.k === 'pt') { cell.pt = hide(add(stage, box(h('div', 'u1l1-pvd u1l1-pvpt', '.'), c.w, 62), xs.pt, 160)); return; }
      add(stage, box(h('div', 'u1l1-pvh', `<b style="color:${c.c}">${c.name}</b><small>${c.sub}</small>`), c.w, 66), xs[c.k], 92);
      add(stage, box(h('div', 'u1l1-pvd'), c.w, 62), xs[c.k], 160);
      cell[c.k] = hide(add(stage, box(h('div', 'u1l1-pvd u1l1-pvv', dig[c.k] || '0'), c.w, 62), xs[c.k], 160));
      cell[c.k].style.color = c.c; if (!dig[c.k]) cell[c.k].classList.add('ghost');
      area[c.k] = add(stage, box(h('div', 'u1l1-pva'), c.w - 10, 168), xs[c.k] + 5, 234);
    });
    const coins = {};
    PVC.forEach((c) => { if (c.k === 'pt') return; const n = Number(dig[c.k] || 0); coins[c.k] = []; for (let i = 0; i < n; i++) { const e = hide(coin(c.coin)); area[c.k].appendChild(e); coins[c.k].push(e); } });
    const showCol = (q) => async (c) => {
      if (span[q]) { span[q].style.color = PVC.find((p) => p.k === q).c; span[q].classList.add('on'); }
      await c.pop(cell[q], 340);
      await Promise.all(coins[q].map((e, i) => c.pop(e, 300, { delay: i * 70 })));
    };
    const steps = [{
      cap: 'The <b>decimal point</b> splits the <b>whole dollars</b> (left) from the <b>parts of a dollar</b> (right).',
      run: async (c) => { await c.pop(cell.pt, 340); await Promise.all([appear(c, bandL, 400), appear(c, bandR, 400)]); }
    }];
    const n = (q) => Number(dig[q]);
    const wl = [];
    if (dig.t) wl.push(`<b>${dig.t}</b> ${plural(n('t'), 'ten')}: ${n('t') === 1 ? 'one $10 bill' : n('t') + ' $10 bills'}, $${dig.t}0.`);
    wl.push(`<b>${dig.o}</b> ${plural(n('o'), 'one')}: ${n('o')} ${plural(n('o'), 'loonie')}, $${dig.o}.`);
    steps.push({ cap: 'Left of the point: ' + wl.join(' '), run: async (c) => { if (dig.t) await showCol('t')(c); await showCol('o')(c); } });
    steps.push({ cap: `<b>${dig.d}</b> tenths: ${n('d')} ${plural(n('d'), 'dime')}, $0.${dig.d}0.`, run: showCol('d') });
    if (dig.h) steps.push({ cap: `<b>${dig.h}</b> hundredths: ${n('h')} ${plural(n('h'), 'cent')}, $0.0${dig.h}.`, run: showCol('h') });
    else steps.push({ cap: 'No hundredths digit? Then there are <b>0 cents</b>. Money always gets <b>two decimals</b>: write <b>$4.50</b>.',
      run: async (c) => { await c.pop(cell.h, 340); await c.pop(extra0, 340); } });
    if (dig.th) steps.push({ cap: `<b>${dig.th}</b> thousandths: ${n('th')} tenths of a cent. You can’t pay that, but you see it on <b>gas prices</b> and shelf tags.`, run: showCol('th') });
    const fin = {
      e1: { cap: '(b) The 8 is in the <b>hundredths</b> place: 8 hundredths = <b>$0.08 = 8 cents</b>.', q: 'h' },
      gas: { cap: '$1.479 is 1 dollar, 4 dimes, 7 cents and 9 tenths of a cent: just under <b>$1.48</b> a litre.', q: 'th' },
      calc: { cap: '4.5 is four dollars and <b>fifty</b> cents (5 dimes): <b>$4.50</b>. It is <b>not</b> $4.05.', q: 'd' }
    }[k];
    steps.push({ cap: fin.cap, run: async (c) => { await Promise.all([pulse(c, cell[fin.q], 1.12, 600), span[fin.q] ? pulse(c, span[fin.q], 1.25, 600) : null]); } });
    return steps;
  }
};

/* =====================================================================================
 * 2. The money slider: cents → dollars, the point slides 2 places left
 * ===================================================================================== */
const CS = {
  c604: { cents: '604', pre: true, ask: 'Example 1(c)(i): write <b>six dollars and four cents</b> in dollars.' },
  c75: { cents: '75', ask: 'Example 1(c)(ii): write <b>75¢</b> in dollars.' },
  c1399: { cents: '139.9', ask: 'Example 1(c)(iii): gas is <b>139.9¢</b> per litre. Write it in dollars.' },
  c85: { cents: '85', ask: 'Write <b>85¢</b> in dollars.' },
  c1499: { cents: '149.9', ask: 'Gas is <b>149.9¢</b> per litre. Write it in dollars.' }
};
const centsSlider = {
  title: 'Cents to dollars: the money slider',
  height: 350,
  minW: 860,
  choices: [{ sep: 'Example 1(c) check:' }, { v: 'c604', label: '(i) $6 and 4¢' }, { v: 'c75', label: '(ii) 75¢' }, { v: 'c1399', label: '(iii) 139.9¢' }, { sep: 'More:' }, { v: 'c85', label: '85¢' }, { v: 'c1499', label: '149.9¢' }],
  ask: (k) => CS[k].ask,
  make(stage, k, ex) {
    const d = CS[k], [wi, fr = ''] = d.cents.split('.'), digits = wi + fr, dec0 = fr.length, decF = dec0 + 2;
    const nZ = Math.max(0, decF + 1 - digits.length), slots = '0'.repeat(nZ) + digits, n = slots.length;
    const g0 = n - dec0, gF = g0 - 2, final = slots.slice(0, gF) + '.' + slots.slice(gF);
    const W = ex.W, SW = 112, x0 = Math.round((W - n * SW) / 2), Y = 116;
    const svg = add(stage, svgEl('svg', { width: W, height: 350, class: 'u1l1-svg' }), 0, 0);
    const slot = [];
    for (let i = 0; i < n; i++) {
      const lead = i < nZ;
      add(stage, box(h('div', 'u1l1-slot'), SW - 14, 108), x0 + i * SW + 7, Y);
      const e = add(stage, box(h('div', 'u1l1-sdig' + (lead ? ' u1l1-new' : ''), slots[i]), SW - 14, 108), x0 + i * SW + 7, Y);
      if (lead) hide(e);
      slot.push(e);
    }
    const gx = (g) => x0 + g * SW;
    const dot = hide(add(stage, h('div', 'u1l1-dot'), gx(g0) - 12, Y + 84));
    const cent = add(stage, h('div', 'u1l1-unit cu', '¢'), x0 + n * SW + 8, Y + 14);
    const dol = hide(add(stage, h('div', 'u1l1-unit du', '$'), x0 - 62, Y + 14));
    const top = add(stage, box(h('div', 'u1l1-sltag'), W, 40), 0, 2);
    top.innerHTML = d.pre ? 'six dollars and four cents' : d.cents + '¢';
    // hop arcs (above the slots)
    const arcs = [1, 2].map((j) => {
      const xa = gx(g0 - j + 1), xb = gx(g0 - j), p = svgEl('path', { d: `M${xa} ${Y - 6} Q${(xa + xb) / 2} ${Y - 54} ${xb + 6} ${Y - 10}`, fill: 'none', stroke: RED, 'stroke-width': 3, 'marker-end': '' }, svg);
      const hd = svgEl('polygon', { points: `${xb + 6},${Y - 10} ${xb + 18},${Y - 20} ${xb + 3},${Y - 24}`, fill: RED }, svg);
      const lab = add(stage, h('div', 'u1l1-hop', j === 1 ? '1 place' : '2 places'), (xa + xb) / 2 - 40, Y - 74);
      hide(p, hd, lab); return [p, hd, lab];
    });
    const labs = [];
    const names = gF === 1 ? ['dollars'] : ['tens', 'ones'];
    const rnames = ['dimes', 'cents', 'tenths of a cent'];
    for (let i = 0; i < n; i++) {
      const nm = i < gF ? names[i] : rnames[i - gF];
      labs.push(hide(add(stage, box(h('div', 'u1l1-slab', nm), SW, 40), x0 + i * SW, Y + 116)));
    }
    const res = hide(add(stage, box(h('div', 'u1l1-slres', `${d.pre ? '604' : d.cents}¢ = <b>$${final}</b>`), W, 50), 0, Y + 168));
    const hop = (j) => async (c) => {
      await Promise.all([appear(c, arcs[j - 1][0], 250), appear(c, arcs[j - 1][1], 250), c.fadeIn(arcs[j - 1][2], 300)]);
      const from = -(j - 1) * SW, to = -j * SW;
      await c.anim(dot, [{ transform: `translate(${from}px,0)` }, { transform: `translate(${(from + to) / 2}px,-46px)` }, { transform: `translate(${to}px,0)` }], 700);
    };
    const steps = [];
    if (d.pre) steps.push({ cap: 'Six dollars is <b>600¢</b>. Add the 4 cents: <b>604¢</b>.', run: async (c) => { top.innerHTML = '600¢ + 4¢ = <b>604¢</b>'; await pulse(c, top, 1.08, 500); } });
    steps.push({ cap: `Start in cents: <b>${d.cents}¢</b>.${dec0 ? '' : ' A whole number’s decimal point sits at its <b>end</b>.'}`, run: (c) => c.pop(dot, 360) });
    steps.push({ cap: '<b>100¢ = $1</b>, so divide by 100. Dividing by 100 slides the point <b>2 places left</b>. One…', run: hop(1) });
    steps.push({ cap: '…two.', run: hop(2) });
    if (nZ) steps.push({ cap: 'Nothing in the dollars place? Write a <b>0</b> there.', run: async (c) => { for (const e of slot.slice(0, nZ)) await c.pop(e, 340); } });
    const extra = decF === 3 ? ' Three decimals: that’s a <b>gas price</b>.' : Number(final) < 1 ? ' Less than 100¢, so less than $1 ✓' : '';
    steps.push({ cap: `<b>${d.pre ? '604' : d.cents}¢ = $${final}</b>.${extra}`,
      run: async (c) => { await Promise.all([c.anim(cent, [{ opacity: 1 }, { opacity: 0 }], 300), c.pop(dol, 360)]); await Promise.all(labs.map((e, i) => c.fadeIn(e, 300, { delay: i * 60 }))); await c.pop(res, 380); } });
    return steps;
  }
};

/* =====================================================================================
 * 3. Putting prices in order (Full notes)
 * ===================================================================================== */
const orderPrices = {
  title: 'Prices in order: line them up',
  height: 410,
  minW: 860,
  choices: [{ sep: 'Example 1(d) check:' }, { v: 'e1d', label: '$2.5, $2.05, $2.45, $2.54' }],
  ask: 'Example 1(d): put these prices in order from least to greatest: $2.5, $2.05, $2.45, $2.54.',
  make(stage, k, ex) {
    const W = ex.W, P = [['2.5', 250], ['2.05', 205], ['2.45', 245], ['2.54', 254]];
    const LX = 70, RX = W - 70, LY = 340, lo = 200, hi = 260, px = (v) => LX + (v - lo) / (hi - lo) * (RX - LX);
    const svg = add(stage, svgEl('svg', { width: W, height: 410, class: 'u1l1-svg' }), 0, 0);
    const line = svgEl('g', {}, svg); hide(line);
    svgEl('line', { x1: LX - 20, x2: RX + 20, y1: LY, y2: LY, stroke: INK, 'stroke-width': 2.5 }, line);
    const labs = [];
    for (let v = lo; v <= hi; v += 5) {
      const big = v % 10 === 0;
      svgEl('line', { x1: px(v), x2: px(v), y1: LY - (big ? 10 : 6), y2: LY + (big ? 10 : 6), stroke: INK, 'stroke-width': big ? 2.4 : 1.4 }, line);
      if (big) labs.push(hide(add(stage, box(h('div', 'u1l1-nl', D(v)), 80), px(v) - 40, LY + 14)));
    }
    const order = P.slice().sort((a, b) => a[1] - b[1]);
    const TW = 128, tags = P.map(([s, v], i) => {
      const [a, b] = s.split('.');
      const e = add(stage, box(h('div', 'u1l1-tag', `$${a}.<i class="u1l1-tg td">${b[0]}</i>${b[1] ? `<i class="u1l1-tg tc">${b[1]}</i>` : '<i class="u1l1-tg tc u1l1-new z">0</i>'}`), TW), 70 + i * ((W - 140 - TW) / 3), 24);
      const z = e.querySelector('.z'); if (z) hide(z);
      const r = order.findIndex((o) => o[1] === v), ty = r % 2 ? 230 : 152;
      return { e, v, z, dx: px(v) - TW / 2 - parseFloat(e.style.left), dy: ty - 24, ty };
    });
    const leads = tags.map((t) => { const g = svgEl('line', { x1: px(t.v), x2: px(t.v), y1: t.ty + 58, y2: LY, stroke: '#9aa0ab', 'stroke-width': 2, 'stroke-dasharray': '5 4' }, svg); const dd = svgEl('circle', { cx: px(t.v), cy: LY, r: 7, fill: BR }, svg); hide(g, dd); return [g, dd]; });
    const strip = hide(add(stage, box(h('div', 'u1l1-strip', 'Least to greatest: <b>$2.05</b> &lt; <b>$2.45</b> &lt; <b>$2.5</b> &lt; <b>$2.54</b>'), W - 40), 20, 100));
    return [
      { cap: 'Write every price with <b>two decimals</b>: $2.5 is <b>$2.50</b>.', run: (c) => c.pop(tags[0].z, 360) },
      { cap: 'They all have <b>$2</b>. Compare the <b>dimes</b> (tenths): 5, 0, 4, 5. The fewest dimes: <b>$2.05</b>.',
        run: async (c) => { tags.forEach((t) => t.e.querySelector('.u1l1-tg.td').classList.add('hl')); await pulse(c, tags[1].e, 1.1, 500); } },
      { cap: '$2.50 and $2.54 both have 5 dimes. Compare the <b>cents</b>: 0 is less than 4, so $2.50 is less.',
        run: async (c) => { tags.forEach((t) => t.e.querySelector('.u1l1-tg.td').classList.remove('hl')); tags[0].z.classList.add('hl'); tags[3].e.querySelector('.u1l1-tg.tc').classList.add('hl'); await Promise.all([pulse(c, tags[0].e, 1.06, 400), pulse(c, tags[3].e, 1.06, 400)]); } },
      { cap: 'On a number line, a smaller price sits further <b>left</b>.',
        run: async (c) => {
          tags.forEach((t) => t.e.querySelectorAll('.hl').forEach((x) => x.classList.remove('hl')));
          await appear(c, line, 300); await Promise.all(labs.map((e) => appear(c, e, 300)));
          await Promise.all(tags.map((t, i) => c.anim(t.e, [{ transform: 'translate(0,0)' }, { transform: `translate(${t.dx}px,${t.dy}px)` }], 800, { delay: i * 120 })));
          await Promise.all(leads.flat().map((e) => appear(c, e, 300)));
        } },
      { cap: 'Least to greatest: <b>$2.05, $2.45, $2.5, $2.54</b>.', run: (c) => c.pop(strip, 380) }
    ];
  }
};

/* =====================================================================================
 * 4. Rounding on three number lines
 * ===================================================================================== */
const RPL = {
  d: { name: 'dollar', u: 1000, look: 'tenths (dimes)', place: 'ones', pi: -1, ri: 1 },
  t: { name: 'ten cents', u: 100, look: 'hundredths (cents)', place: 'tenths', pi: 1, ri: 2 },
  c: { name: 'cent', u: 10, look: 'thousandths', place: 'hundredths', pi: 2, ri: 3 }
};
const RL = {
  a: { amt: '8.274' }, b: { amt: '15.639' }, c: { amt: '0.958' }, d: { amt: '29.996' },
  kim: { amt: '62.118', rows: ['c'], ask: 'Example 2(b): Kim buys 42 L of gas at $1.479 per litre. Her calculator shows <b>62.118</b>. How much does she pay?' }
};
const fmtR = (q, v) => (q === 'd' ? '$' + v / 1000 : '$' + (v / 1000).toFixed(2));
const fmtMid = (q, v) => '$' + (v / 1000).toFixed(q === 'c' ? 3 : 2);
const roundLines = {
  title: 'Rounding: which one is it closer to?',
  height: 430,
  minW: 900,
  capH: 92,
  choices: [{ sep: 'Example 2(a) check:' }, { v: 'a', label: '$8.274' }, { v: 'b', label: '$15.639' }, { v: 'c', label: '$0.958' }, { v: 'd', label: '$29.996' }, { sep: 'Example 2(b):' }, { v: 'kim', label: 'Kim’s gas' }],
  ask: (k) => RL[k].ask || `Example 2(a): round <b>$${RL[k].amt}</b> to the nearest dollar, the nearest ten cents and the nearest cent.`,
  make(stage, k, ex) {
    const d = RL[k], W = ex.W, s = d.amt, A = Math.round(parseFloat(s) * 1000), p = s.indexOf('.');
    const rows = d.rows || ['d', 't', 'c'];
    const amt = add(stage, box(h('div', 'u1l1-amt sm'), W), 0, 2);
    const ch = ['$', ...s.split('')].map((x) => { const e = h('i', 'u1l1-ad', x); amt.appendChild(e); return e; });
    const digitAt = (i) => ch[i + 1];
    const svg = add(stage, svgEl('svg', { width: W, height: 430, class: 'u1l1-svg' }), 0, 0);
    const LX = 250, RX = W - 215, steps = [], results = [];
    const clearHl = () => ch.forEach((e) => e.classList.remove('u1l1-hp', 'u1l1-hr'));
    rows.forEach((q, i) => {
      const P = RPL[q], Y = 112 + i * 106 + (rows.length === 1 ? 90 : 0), u = P.u, lo = Math.floor(A / u) * u, hi = lo + u, up = (A - lo) * 2 >= u;
      const res = up ? hi : lo, r = Math.floor((A - lo) / (u / 10)), pd = Number(s[p + P.pi]);
      const xv = LX + (A - lo) / u * (RX - LX), xm = (LX + RX) / 2;
      const lab = add(stage, box(h('div', 'u1l1-rlab', `<b>Nearest ${P.name}</b><small>look at the ${P.look}</small>`), 220), 12, Y - 34);
      const g = svgEl('g', {}, svg);
      svgEl('line', { x1: LX, x2: RX, y1: Y, y2: Y, stroke: INK, 'stroke-width': 2.5 }, g);
      [LX, RX].forEach((x) => svgEl('line', { x1: x, x2: x, y1: Y - 12, y2: Y + 12, stroke: INK, 'stroke-width': 2.6 }, g));
      svgEl('line', { x1: xm, x2: xm, y1: Y - 22, y2: Y + 22, stroke: AMBER, 'stroke-width': 2.4, 'stroke-dasharray': '5 4' }, g);
      const dotv = svgEl('circle', { cx: xv, cy: Y, r: 9, fill: RED }, g);
      const L1 = add(stage, box(h('div', 'u1l1-nl', fmtR(q, lo)), 110), LX - 55, Y + 14);
      const L2 = add(stage, box(h('div', 'u1l1-nl', fmtR(q, hi)), 110), RX - 55, Y + 14);
      const L3 = add(stage, box(h('div', 'u1l1-nl mid', 'halfway ' + fmtMid(q, lo + u / 2)), 170), xm - 85, Y + 22);
      const L4 = add(stage, box(h('div', 'u1l1-nl val', '$' + s), 110), Math.min(RX - 60, Math.max(LX - 50, xv - 55)), Y - 46);
      hide(lab, g, L1, L2, L3, L4);
      const tx = up ? RX : LX, arr = svgEl('path', { d: `M${xv} ${Y - 14} Q${(xv + tx) / 2} ${Y - 44} ${tx} ${Y - 14}`, fill: 'none', stroke: GREEN, 'stroke-width': 3.5 }, svg);
      const hd = svgEl('circle', { cx: tx, cy: Y, r: 11, fill: 'none', stroke: GREEN, 'stroke-width': 4 }, svg); hide(arr, hd);
      const rb = hide(add(stage, box(h('div', 'u1l1-rres', fmtR(q, res)), 160), W - 190, Y - 28));
      results.push(fmtR(q, res));
      const carry = up && pd === 9 ? ` The ${P.place} digit 9 becomes 10, so <b>carry 1</b>.` : '';
      steps.push({
        cap: `<b>Nearest ${P.name}:</b> find the ${P.place} digit, <b>${pd}</b>. Look one place right: <b>${r}</b>.`,
        run: async (c) => { clearHl(); digitAt(p + P.pi).classList.add('u1l1-hp'); digitAt(p + P.ri).classList.add('u1l1-hr'); await Promise.all([c.fadeIn(lab), appear(c, g, 350), ...[L1, L2, L3, L4].map((e) => appear(c, e, 350))]); }
      });
      steps.push({
        cap: `${r} is ${up ? '<b>5 or more</b>, so round <b>up</b>' : '<b>4 or less</b>, so <b>keep</b> the ' + pd}: <b>${fmtR(q, res)}</b>.${carry}`,
        run: async (c) => { const len = arr.getTotalLength ? arr.getTotalLength() : 200; arr.style.strokeDasharray = len; await c.anim(arr, [{ opacity: 1, strokeDashoffset: len }, { opacity: 1, strokeDashoffset: 0 }], 600); await Promise.all([c.pop(hd, 300), c.pop(rb, 360)]); }
      });
    });
    steps.push({
      cap: k === 'kim' ? 'Kim pays <b>$62.12</b>.' : `$${s} rounds to <b>${results[0]}</b>, <b>${results[1]}</b> and <b>${results[2]}</b>.`,
      run: async (c) => { clearHl(); await sleep(c, 100); }
    });
    return steps;
  }
};

/* =====================================================================================
 * 5. Round only at the end (Full notes)
 * ===================================================================================== */
const RE = {
  gas: { ask: 'Example 2(b) again: 42 L of gas at <b>$1.479</b> a litre. What if you round the price first?',
    L: ['42\\times1.479=62.118', '\\approx\\$62.12'], R: ['\\$1.479\\approx\\$1.48', '42\\times1.48=62.16', '\\$62.16'],
    end: 'Rounding the price first charged Kim <b>4¢ too much</b>. Keep every digit, and round <b>once, at the end</b>.' },
  pay: { ask: 'Example 7(a): Diego earns <b>$16.25</b> an hour for 18.5 hours. What if you round his wage first?',
    L: ['16.25\\times18.5=300.625', '\\approx\\$300.63'], R: ['\\$16.25\\approx\\$16', '16\\times18.5=296', '\\$296.00'],
    end: 'Rounding the wage first would cheat Diego out of <b>$4.63</b>. Round <b>once, at the end</b>.' }
};
const roundEnd = {
  title: 'Round only at the end',
  height: 330,
  minW: 860,
  choices: [{ v: 'gas', label: 'Kim’s gas' }, { v: 'pay', label: 'Diego’s pay' }],
  ask: (k) => RE[k].ask,
  make(stage, k, ex) {
    const d = RE[k], W = ex.W, PW = (W - 60) / 2;
    const pane = (x, cls, head, lines) => {
      const e = add(stage, box(h('div', 'u1l1-pane ' + cls, `<div class="u1l1-ph">${head}</div>`), PW, 250), x, 16);
      const ls = lines.map((t) => hide(e.appendChild(h('div', 'u1l1-pl', T(t))))); return { e, ls };
    };
    const A = pane(20, 'good', 'Round at the end', d.L), B = pane(40 + PW, 'bad', 'Round in the middle', d.R);
    const sA = hide(stamp(stage, '✓ right', { ok: true, x: 20 + PW - 80, y: 234 })), sB = hide(stamp(stage, '✗ off', { ok: false, x: 40 + PW * 2 - 70, y: 234 }));
    return [
      { cap: 'Keep <b>every digit</b> until the end, then round once.', run: async (c) => { for (const e of A.ls) await c.fadeIn(e); await stampIn(c, sA); } },
      { cap: 'Now round the first number <b>before</b> multiplying…', run: async (c) => { for (const e of B.ls) await c.fadeIn(e); } },
      { cap: d.end, run: (c) => stampIn(c, sB) }
    ];
  }
};

/* =====================================================================================
 * 6. The receipt that totals itself while an estimate races it
 * ===================================================================================== */
const ITEMS = [['Milk, 4 L', 649], ['Loaf of bread', 329], ['Bananas', 187], ['Peanut butter', 579], ['Cereal', 499]];
const FE = [[4], [2, 1], [0, 3]];          // cents groups of about $1: 99¢; 87¢ + 29¢; 49¢ + 79¢
const FEC = ['#c27a0e', '#1f5bd6', '#7b4fc4'];
const receiptRace = {
  title: 'The receipt vs. the estimate',
  height: 440,
  minW: 900,
  capH: 92,
  choices: [{ sep: 'Example 3 check:' }, { v: 'fe', label: '(a) Front-end' }, { v: 'rnd', label: '(b) Rounding' }, { sep: 'Tip:' }, { v: 'up', label: 'Round up to be sure' }],
  ask: 'Example 3: Jordan’s groceries. Estimate the total, then find the exact total. He has a $20 bill and a $5 bill.',
  make(stage, mode, ex) {
    const W = ex.W, RW = 390, RXp = 30, NX = RXp + RW + 40, NW = W - NX - 24;
    const rc = add(stage, box(h('div', 'u1l1-rcpt'), RW, 410), RXp, 12);
    rc.innerHTML = '<div class="u1l1-rh">FRESH MART<small>Calgary, AB</small></div>';
    const rows = ITEMS.map(([nm, c]) => {
      const r = rc.appendChild(h('div', 'u1l1-rr', `<span class="u1l1-rn">${nm}</span><span class="u1l1-rp">$<i class="u1l1-dl">${Math.floor(c / 100)}</i>.<i class="u1l1-ct">${String(c % 100).padStart(2, '0')}</i></span>`));
      hide(r); return r;
    });
    rc.appendChild(h('div', 'u1l1-rline'));
    const totRow = rc.appendChild(h('div', 'u1l1-rr tot', '<span class="u1l1-rn">TOTAL</span><span class="u1l1-rp u1l1-rtot">$0.00</span>'));
    const tot = totRow.querySelector('.u1l1-rtot');
    const pad = add(stage, box(h('div', 'u1l1-pad', `<div class="u1l1-padh">${mode === 'fe' ? 'Front-end estimate' : mode === 'rnd' ? 'Rounding estimate' : 'Round <b>up</b> to be sure'}</div>`), NW, 330), NX, 12);
    const est = add(stage, box(h('div', 'u1l1-est', 'Estimate: <b>$0</b>'), NW), NX, 352);
    const estB = est.querySelector('b');
    const stEnough = hide(stamp(stage, mode === 'up' ? 'Sure! ✓' : 'Enough ✓', { ok: true, x: RXp + RW - 90, y: 380, size: 'lg' }));
    let shown = 0;
    const tick = (c, to) => { const from = shown; shown = to; return tween(c, 650, (t) => { tot.textContent = D(Math.round(from + (to - from) * t)); }); };
    const steps = [];
    const exact = ITEMS.reduce((s, it) => s + it[1], 0);
    if (mode === 'rnd' || mode === 'up') {
      let run = 0, sum = 0;
      ITEMS.forEach(([nm, c], i) => {
        const r = mode === 'up' ? Math.ceil(c / 100) : Math.round(c / 100), dd = Math.floor(c / 10) % 10;
        run += c; sum += r; const sumNow = sum, runNow = run;
        const why = mode === 'up' ? 'round <b>up</b> to the next dollar' : dd >= 5 ? `the dimes digit is ${dd}, so round up` : `the dimes digit is ${dd}, so keep`;
        const line = hide(pad.appendChild(h('div', 'u1l1-padl', `${D(c)} → <b>$${r}</b>`)));
        steps.push({
          cap: `${nm}: ${D(c)} → <b>$${r}</b> (${why}).${i ? ` Estimate so far: <b>$${sumNow}</b>.` : ''}`,
          run: async (c2) => { await Promise.all([c2.fadeIn(rows[i], 300), c2.fadeIn(line, 300)]); estB.textContent = '$' + sumNow; await Promise.all([pulse(c2, est, 1.06, 400), tick(c2, runNow)]); }
        });
      });
      if (mode === 'rnd') {
        steps.push({ cap: `(b) Estimate <b>$${sum}</b>. (c) The receipt says <b>${D(exact)}</b>: close to the estimate, so it makes sense.`, run: async (c) => { await Promise.all([pulse(c, totRow, 1.06, 500), pulse(c, est, 1.08, 500)]); } });
        steps.push({ cap: `(d) Jordan has $20 + $5 = <b>$25.00</b>. ${D(exact)} is less than $25.00: <b>yes, he has enough</b>.`, run: (c) => stampIn(c, stEnough) });
      } else {
        steps.push({ cap: `Every price went <b>up</b>, so <b>$${sum}</b> is a bit too high. Jordan has $25, more than $${sum}: he <b>surely has enough</b>.`, run: (c) => stampIn(c, stEnough) });
        steps.push({ cap: `The real total, <b>${D(exact)}</b>, is less than the “sure” estimate, as it should be.`, run: (c) => pulse(c, totRow, 1.06, 500) });
      }
    } else {
      const dl = hide(pad.appendChild(h('div', 'u1l1-padl', 'Dollars: 6 + 3 + 1 + 5 + 4 = <b>$19</b>')));
      const gl = FE.map((g, j) => hide(pad.appendChild(h('div', 'u1l1-padl', `<i class="u1l1-sw" style="background:${FEC[j]}"></i>${g.map((i) => (ITEMS[i][1] % 100) + '¢').join(' + ')} ≈ <b>$1</b>`))));
      const fl = hide(pad.appendChild(h('div', 'u1l1-padl lg', '$19 + $3 = <b>$22</b>')));
      steps.push({ cap: `Front-end: add the <b>dollar</b> parts first: ${T('6+3+1+5+4=\\$19')}.`,
        run: async (c) => { await Promise.all(rows.map((r) => c.fadeIn(r, 300))); rows.forEach((r) => r.querySelector('.u1l1-dl').classList.add('hl')); tot.textContent = '$?'; await c.fadeIn(dl); estB.textContent = '$19'; await pulse(c, est, 1.06, 400); } });
      const said = ['<b>99¢</b> is about $1.', '<b>87¢ + 29¢</b> is about $1.', '<b>49¢ + 79¢</b> is about $1.'];
      FE.forEach((g, j) => steps.push({
        cap: `Now group the cents into dollars: ${said[j]}`,
        run: async (c) => { rows.forEach((r) => r.querySelector('.u1l1-dl').classList.remove('hl')); g.forEach((i) => { const e = rows[i].querySelector('.u1l1-ct'); e.style.background = FEC[j]; e.classList.add('grp'); }); await c.fadeIn(gl[j]); estB.textContent = '$' + (20 + j); await pulse(c, est, 1.06, 400); }
      }));
      steps.push({ cap: `(a) Front-end estimate: ${T('\\$19+\\$3=\\$22')}.`, run: (c) => c.pop(fl, 360) });
      steps.push({ cap: `(c) The exact total with the calculator: <b>${D(exact)}</b>. Close to $22 ✓`, run: (c) => tick(c, exact) });
      steps.push({ cap: `(d) Jordan has <b>$25.00</b>, and ${D(exact)} is less: <b>yes, he has enough</b>.`, run: (c) => stampIn(c, stEnough) });
    }
    return steps;
  }
};

/* =====================================================================================
 * 7. Does the answer make sense? (estimate vs. answer, then a verdict stamp)
 * ===================================================================================== */
const RS = {
  e4a: { ask: 'Example 4(a): two burgers at $16.95 and two milkshakes at $6.25. The bill says <b>$56.40</b>. Does it make sense?',
    lab: 'The bill says', ans: 5640, est: ['2\\times\\$17=\\$34', '2\\times\\$6=\\$12'], estT: 4600, ok: false, gap: 'they are about <b>$10 apart</b>',
    fix: ['2\\times16.95+2\\times6.25', '=33.90+12.50=\\$46.40'], end: 'Exact: <b>$46.40</b>. The bill is <b>$10.00 too high</b>: Emma should ask the server to fix it.' },
  e4b: { ask: 'Example 4(b): Tyler buys 5 bags of chips at $3.89 each. His calculator shows <b>194.5</b>. Is this reasonable?',
    lab: 'The calculator shows', ans: 19450, est: ['5\\times\\$4=\\$20'], estT: 2000, ok: false, gap: 'the answer is about <b>10 times</b> the estimate',
    fix: ['\\text{He typed } 38.9 \\text{ instead of } 3.89', '5\\times3.89=\\$19.45'], end: 'A decimal point in the wrong place made it <b>10 times</b> too big. The right answer is <b>$19.45</b>.' },
  e5b: { ask: 'Example 5(b): Nadia’s calculator says <b>16.65</b> for 3 jars of salsa at $4.29 and 2 bags of chips at $1.89. Is it reasonable?',
    lab: 'The calculator shows', ans: 1665, est: ['3\\times\\$4=\\$12', '2\\times\\$2=\\$4'], estT: 1600, ok: true, gap: 'they are <b>close</b>',
    fix: ['\\$16.65\\ \\text{is close to}\\ \\$16'], end: 'The estimate and the answer are close, so <b>$16.65</b> is reasonable.' }
};
const reasonable = {
  title: 'Does the answer make sense?',
  height: 420,
  minW: 900,
  choices: [{ sep: 'Example 4 check:' }, { v: 'e4a', label: '(a) Emma’s bill' }, { v: 'e4b', label: '(b) Tyler’s chips' }, { sep: 'Example 5(b):' }, { v: 'e5b', label: 'Nadia’s total' }],
  ask: (k) => RS[k].ask,
  make(stage, k, ex) {
    const d = RS[k], W = ex.W, CW = 300;
    const cA = add(stage, box(h('div', 'u1l1-big', `<small>${d.lab}</small><b>${D(d.ans)}</b>`), CW, 170), 30, 14);
    const cE = add(stage, box(h('div', 'u1l1-big est', '<small>My estimate</small>'), CW + 40), W - CW - 70, 14);
    const eLines = d.est.map((t) => hide(cE.appendChild(h('div', 'u1l1-el', T(t)))));
    const eTot = hide(cE.appendChild(h('div', 'u1l1-el tot', `≈ <b>${D(d.estT).replace('.00', '')}</b>`)));
    hide(cA);
    // the number line: where both sit
    const svg = add(stage, svgEl('svg', { width: W, height: 420, class: 'u1l1-svg' }), 0, 0);
    const mx = Math.max(d.ans, d.estT) * 1.12, LX = 60, RX = W - 60, LY = 250, px = (v) => LX + v / mx * (RX - LX);
    const g = svgEl('g', {}, svg); hide(g);
    svgEl('line', { x1: LX, x2: RX, y1: LY, y2: LY, stroke: INK, 'stroke-width': 2.5 }, g);
    svgEl('line', { x1: LX, x2: LX, y1: LY - 10, y2: LY + 10, stroke: INK, 'stroke-width': 2.5 }, g);
    const z = hide(add(stage, box(h('div', 'u1l1-nl', '$0'), 60), LX - 30, LY + 12));
    const mk = (v, col, txt, up) => {
      const e = svgEl('g', {}, svg); svgEl('line', { x1: px(v), x2: px(v), y1: LY - 16, y2: LY + 16, stroke: col, 'stroke-width': 5 }, e); hide(e);
      const l = hide(add(stage, box(h('div', 'u1l1-mk', txt), 150), px(v) - 75, up ? LY - 50 : LY + 18)); l.style.color = col; return [e, l];
    };
    const mA = mk(d.ans, RED, D(d.ans), true), mE = mk(d.estT, BLUE, 'estimate ' + D(d.estT).replace('.00', ''), false);
    const st = hide(stamp(stage, d.ok ? 'Makes sense ✓' : 'Doesn’t make sense ✗', { ok: d.ok, x: 30 + CW / 2 + 24, y: 156, rotate: -6 }));
    const fixP = hide(add(stage, box(h('div', 'u1l1-fix ' + (d.ok ? 'good' : 'bad'), d.fix.map((t) => `<div>${T(t)}</div>`).join('')), W - 120), 60, 324));
    return [
      { cap: `${d.lab}: <b>${D(d.ans)}</b>.`, run: (c) => c.fadeIn(cA) },
      { cap: 'Estimate first, with easy numbers.', run: async (c) => { for (const e of eLines) await c.fadeIn(e); await c.pop(eTot, 340); } },
      { cap: `Put both on a number line: ${d.gap}.`, run: async (c) => { await appear(c, g, 300); await appear(c, z, 200); await Promise.all([...mA, ...mE].map((e) => c.pop(e, 340))); } },
      { cap: d.ok ? 'Close: the answer <b>makes sense</b>.' : 'Far apart: the answer <b>does not make sense</b>. Something went wrong.', run: (c) => stampIn(c, st) },
      { cap: d.end, run: (c) => c.fadeIn(fixP) }
    ];
  }
};

/* =====================================================================================
 * 8. The BEDMAS machine: the calculator works one operation at a time, in order
 * ===================================================================================== */
const BM = {
  e5a1: { e: '4 + 6 × 2', ask: `Example 5(a)(i): work out ${T('4+6\\times2')} by hand.`, end: `Multiply first: ${T('4+6\\times2=\\boldsymbol{16}')}.` },
  e5a2: { e: '( 4 + 6 ) × 2', ask: `Example 5(a)(ii): work out ${T('(4+6)\\times2')} by hand.`, end: `Brackets first: ${T('(4+6)\\times2=\\boldsymbol{20}')}. The brackets changed the answer!` },
  e5b: { e: '3 × 4.29 + 2 × 1.89', m: 1, ask: 'Example 5(b): Nadia buys 3 jars of salsa at $4.29 and 2 bags of chips at $1.89. Find the total.', end: `The total is <b>$16.65</b>. Estimate: ${T('3\\times\\$4+2\\times\\$2=\\$16')}. Close ✓` },
  e6a: { e: '( 28.99 + 16.49 + 6.52 ) ÷ 4', m: 1, ask: 'Example 6(a): four coworkers share a pizza ($28.99), wings ($16.49) and drinks ($6.52) equally.', end: 'Each person pays <b>$13.00</b>.' },
  e6b: { e: '28.99 + 16.49 + 6.52 ÷ 4', m: 1, ask: 'Example 6(b): Sam types 28.99 + 16.49 + 6.52 ÷ 4 = and gets 47.11. What went wrong?', end: 'Only <b>6.52</b> was divided by 4. <b>$47.11</b> is almost the whole bill, not one share! Sam needs <b>brackets</b> around the adding.' }
};
const TOK = { '×': '\\times', '÷': '\\div', '+': '+', '−': '-', '(': '(', ')': ')' };
const OPF = { '×': (a, b) => a * b, '÷': (a, b) => a / b, '+': (a, b) => a + b, '−': (a, b) => a - b };
const RULE = { '×': 'DM', '÷': 'DM', '+': 'AS', '−': 'AS' };
function reduceAll(toks, money) {
  const out = [];
  toks = toks.slice();
  while (toks.length > 1) {
    let lo = 0, hi = toks.length - 1, br = false;
    const L = toks.lastIndexOf('(');
    if (L >= 0) { lo = L + 1; hi = toks.indexOf(')', L) - 1; br = true; }
    let i = -1;
    for (let j = lo; j <= hi; j++) if (toks[j] === '×' || toks[j] === '÷') { i = j; break; }
    if (i < 0) for (let j = lo; j <= hi; j++) if (toks[j] === '+' || toks[j] === '−') { i = j; break; }
    const a = parseFloat(toks[i - 1]), b = parseFloat(toks[i + 1]), v = Math.round(OPF[toks[i]](a, b) * 1e6) / 1e6;
    const vs = money ? v.toFixed(2) : String(v);
    const before = toks.slice();
    let next = [...toks.slice(0, i - 1), vs, ...toks.slice(i + 2)], at = i - 1;
    if (br && next[L] === '(' && next[L + 2] === ')') { next = [...next.slice(0, L), next[L + 1], ...next.slice(L + 3)]; at = L; }
    out.push({ before, hl: [i - 1, i + 1], op: toks[i], a: toks[i - 1], b: toks[i + 1], v: vs, br, next, at, rule: br ? 'B' : RULE[toks[i]] });
    toks = next;
  }
  return out;
}
const bedmas = {
  title: 'The calculator follows BEDMAS',
  height: 420,
  minW: 900,
  choices: [{ sep: 'Example 5:' }, { v: 'e5a1', label: '(a)(i)' }, { v: 'e5a2', label: '(a)(ii)' }, { v: 'e5b', label: '(b) Nadia' }, { sep: 'Example 6:' }, { v: 'e6a', label: '(a) with brackets' }, { v: 'e6b', label: '(b) Sam: no brackets' }],
  ask: (k) => BM[k].ask,
  make(stage, k, ex) {
    const d = BM[k], W = ex.W, toks = d.e.split(' '), red = reduceAll(toks, d.m);
    // the calculator screen: what was typed (as the TI-30XIIS shows it), the answer on the second line
    const lcd = add(stage, box(h('div', 'u1l1-lcd'), 520, 92), 24, 12);
    const typed = d.e.replace(/×/g, '*').replace(/÷/g, '/').replace(/ /g, '');
    const l1 = lcd.appendChild(h('div', 'u1l1-lcd1', '')), l2 = lcd.appendChild(h('div', 'u1l1-lcd2', ''));
    // BEDMAS ladder
    const lad = add(stage, box(h('div', 'u1l1-lad'), 230), W - 254, 12);
    const rungs = {};
    [['B', 'Brackets'], ['E', 'Exponents'], ['DM', '× ÷ left to right'], ['AS', '+ − left to right']].forEach(([key, t]) => { rungs[key] = lad.appendChild(h('div', 'u1l1-rung', `<b>${key === 'DM' ? 'D M' : key === 'AS' ? 'A S' : key}</b>${t}`)); });
    const light = (key) => Object.keys(rungs).forEach((q) => rungs[q].classList.toggle('on', q === key));
    const RH = 60, Y0 = 122;
    const row = (tk, y, hl, resAt) => {
      const e = add(stage, box(h('div', 'u1l1-brow'), W - 300), 24, y);
      tk.forEach((t, j) => { const s = e.appendChild(h('i', 'u1l1-tk' + (/^[0-9.]+$/.test(t) ? '' : ' op'), T(TOK[t] || t))); if (hl && j >= hl[0] && j <= hl[1]) s.classList.add('hl'); if (j === resAt) s.classList.add('res'); });
      return e;
    };
    const r0 = row(toks, Y0, null, -1); hide(r0);
    const rows = red.map((s, i) => hide(row(s.next, Y0 + (i + 1) * RH, null, s.at)));
    const ans = red.length ? red[red.length - 1].v : toks[0], disp = String(parseFloat(ans)) + (Number.isInteger(parseFloat(ans)) ? '.' : '');
    const say = (s) => {
      const ab = T(`${s.a}${TOK[s.op]}${s.b}=${s.v}`);
      if (s.br) return `<b>Brackets first:</b> ${ab}.`;
      if (s.rule === 'DM') return `<b>${s.op === '×' ? 'Multiply' : 'Divide'}</b> before adding: ${ab}.`;
      return `Now <b>${s.op === '+' ? 'add' : 'subtract'}</b>, left to right: ${ab}.`;
    };
    const steps = [{ cap: 'Type the <b>whole line</b>. The top line of the screen shows what you typed: check it before you press ENTER.', run: async (c) => {
      const n = typed.length; await tween(c, Math.min(1400, n * 70), (t) => { l1.textContent = typed.slice(0, Math.round(t * n)); }, (t) => t); await c.fadeIn(r0); } }];
    red.forEach((s, i) => steps.push({
      cap: say(s),
      run: async (c) => {
        light(s.rule);
        const prev = i ? rows[i - 1] : r0;
        prev.querySelectorAll('.u1l1-tk').forEach((e, j) => e.classList.toggle('hl', j >= s.hl[0] && j <= s.hl[1]));
        await pulse(c, prev, 1.02, 300);
        await c.fadeIn(rows[i], 380, { from: 'translateY(-14px)' });
        prev.classList.add('done');
      }
    }));
    steps.push({ cap: d.end, run: async (c) => { light(null); l2.textContent = disp; await pulse(c, lcd, 1.04, 400); } });
    return steps;
  }
};

/* =====================================================================================
 * 9. Counting up change, like a cashier
 * ===================================================================================== */
const CU = {
  e8a: { price: 1365, paid: 2000, ask: 'Example 8(a): lunch costs <b>$13.65</b>. You pay with a <b>$20 bill</b>. Count up to find your change.',
    adds: [[10, 'a dime', ['dime']], [25, 'a quarter', ['quarter']], [100, 'a loonie', ['loonie']], [500, 'a $5 bill', ['bill5']]] },
  d1: { price: 480, paid: 1000, ask: 'A sandwich costs <b>$4.80</b>. You pay with a <b>$10 bill</b>. Count up to find your change.',
    adds: [[20, '2 dimes', ['dime', 'dime']], [500, 'a $5 bill', ['bill5']]] },
  d2: { price: 1145, paid: 2000, ask: 'A haircut costs <b>$11.45</b>. You pay with a <b>$20 bill</b>. Count up to find your change.',
    adds: [[5, 'a nickel', ['nickel']], [50, '2 quarters', ['quarter', 'quarter']], [300, 'a toonie and a loonie', ['toonie', 'loonie']], [500, 'a $5 bill', ['bill5']]] }
};
const countUp = {
  title: 'Counting up change, like a cashier',
  height: 420,
  minW: 900,
  capH: 92,
  choices: [{ sep: 'Example 8(a) check:' }, { v: 'e8a', label: '$13.65 from $20' }, { sep: 'More:' }, { v: 'd1', label: '$4.80 from $10' }, { v: 'd2', label: '$11.45 from $20' }],
  ask: (k) => CU[k].ask,
  make(stage, k, ex) {
    const d = CU[k], W = ex.W, TW = 520;
    const tb = add(stage, box(h('div', 'u1l1-cut'), TW), 24, 14);
    tb.innerHTML = '<div class="u1l1-cur hd"><span>Start at</span><span>Add</span><span>Now at</span></div>';
    let now = d.price; const rows = [];
    d.adds.forEach(([v, nm]) => { const r = tb.appendChild(h('div', 'u1l1-cur', `<span>${D(now)}</span><span>${v < 100 ? v + '¢' : '$' + v / 100} <small>(${nm})</small></span><span><b>${D(now + v)}</b></span>`)); hide(r); rows.push(r); now += v; });
    const tray = add(stage, box(h('div', 'u1l1-tray', '<div class="u1l1-trh">Your change</div>'), W - TW - 80), TW + 50, 14);
    const pile = tray.appendChild(h('div', 'u1l1-pile'));
    const sofar = tray.appendChild(h('div', 'u1l1-sofar', 'so far: <b>$0.00</b>')), sB = sofar.querySelector('b');
    const coinsBy = d.adds.map(([, , cs]) => cs.map((q) => { const e = hide(coin(q)); pile.appendChild(e); return e; }));
    const change = d.paid - d.price;
    const chk = hide(add(stage, box(h('div', 'u1l1-chk', `Check: ${T(`${(d.paid / 100).toFixed(2)}-${(d.price / 100).toFixed(2)}=${(change / 100).toFixed(2)}`)} ✓`), W - 60), 30, 350));
    const steps = [];
    let acc = 0, at = d.price;
    d.adds.forEach(([v, nm], i) => {
      acc += v; const accNow = acc, from = at, to = at + v; at = to;
      steps.push({
        cap: `${i ? 'At' : 'Start at the price,'} <b>${D(from)}</b>. Add <b>${nm}</b> (${v < 100 ? v + '¢' : '$' + v / 100}): now at <b>${D(to)}</b>.${to === d.paid ? ' That’s the amount paid.' : ''}`,
        run: async (c) => { await c.fadeIn(rows[i]); await Promise.all(coinsBy[i].map((e, j) => c.anim(e, [{ opacity: 0, transform: 'translateY(-40px) scale(.7)' }, { opacity: 1, transform: 'none' }], 450, { delay: j * 120 }))); sB.textContent = D(accNow); await pulse(c, sofar, 1.08, 360); }
      });
    });
    const parts = d.adds.map(([v]) => (v < 100 ? '\\$0.' + String(v).padStart(2, '0') : '\\$' + v / 100)).join('+');
    steps.push({ cap: `Your change is everything you added: ${T(parts + '=' + DT(change))}.`, run: (c) => pulse(c, tray, 1.03, 420) });
    steps.push({ cap: `Check: <b>amount paid − price = change</b>: ${T(`${(d.paid / 100).toFixed(2)}-${(d.price / 100).toFixed(2)}=${(change / 100).toFixed(2)}`)} ✓`, run: (c) => c.fadeIn(chk) });
    return steps;
  }
};

/* =====================================================================================
 * 10. Paying cash: round to the nearest 5¢ (no pennies)
 * ===================================================================================== */
const CR = {
  e8b: { t: 842, paid: 1000, ask: 'Example 8(b): your total at a convenience store is <b>$8.42</b>. What do you pay in cash? What is your change from $10? What do you pay by debit?' },
  d1: { t: 1247, ask: 'Your total is <b>$12.47</b>. What do you pay in cash? By debit?' },
  d2: { t: 399, ask: 'Your total is <b>$3.99</b>. What do you pay in cash? By debit?' },
  d3: { t: 621, ask: 'Your total is <b>$6.21</b>. What do you pay in cash? By debit?' }
};
const cash5 = (c) => Math.round(c / 5) * 5;
const cashRound = {
  title: 'Paying cash: round to the nearest 5¢',
  height: 400,
  minW: 900,
  choices: [{ sep: 'Example 8(b) check:' }, { v: 'e8b', label: '$8.42' }, { sep: 'More:' }, { v: 'd1', label: '$12.47' }, { v: 'd2', label: '$3.99' }, { v: 'd3', label: '$6.21' }],
  ask: (k) => CR[k].ask,
  make(stage, k, ex) {
    const d = CR[k], W = ex.W, lo = Math.floor(d.t / 10) * 10, LX = 60, RX = W - 60, LY = 150, px = (v) => LX + (v - lo) / 10 * (RX - LX);
    const svg = add(stage, svgEl('svg', { width: W, height: 400, class: 'u1l1-svg' }), 0, 0);
    svgEl('line', { x1: LX - 20, x2: RX + 20, y1: LY, y2: LY, stroke: INK, 'stroke-width': 2.5 }, svg);
    const stops = [], arcs = [];
    for (let v = lo; v <= lo + 10; v++) {
      const stop = v % 5 === 0;
      svgEl('line', { x1: px(v), x2: px(v), y1: LY - (stop ? 12 : 7), y2: LY + (stop ? 12 : 7), stroke: INK, 'stroke-width': stop ? 2.6 : 1.5 }, svg);
      add(stage, box(h('div', 'u1l1-nl' + (stop ? ' stop' : ' sm'), stop ? D(v) : String(v % 10)), 80), px(v) - 40, LY + 16);
      if (stop) stops.push(svgEl('circle', { cx: px(v), cy: LY, r: 11, fill: GREEN }, svg));
      else {
        const to = cash5(v), up = to > v, col = up ? BLUE : AMBER;
        const p = svgEl('path', { d: `M${px(v)} ${LY - 10} Q${(px(v) + px(to)) / 2} ${LY - 48} ${px(to) + (up ? -6 : 6)} ${LY - 14}`, fill: 'none', stroke: col, 'stroke-width': 2.6 }, svg);
        arcs.push(p);
      }
    }
    hide(...stops); hide(...arcs);
    const key = add(stage, box(h('div', 'u1l1-ckey', '<span><i class="u1l1-sw" style="background:#c27a0e"></i>ends in 1, 2, 6, 7: <b>down</b></span><span><i class="u1l1-sw" style="background:#1f5bd6"></i>ends in 3, 4, 8, 9: <b>up</b></span>'), W - 80), 40, 28); hide(key);
    const cp = cash5(d.t), dot = svgEl('circle', { cx: px(d.t), cy: LY, r: 10, fill: RED }, svg); hide(dot);
    const tl = hide(add(stage, box(h('div', 'u1l1-nl val', D(d.t)), 110), px(d.t) - 55, LY + 44));
    const ring = svgEl('circle', { cx: px(cp), cy: LY, r: 17, fill: 'none', stroke: RED, 'stroke-width': 4 }, svg); hide(ring);
    const CW = (W - 100) / 2;
    const cash = hide(add(stage, box(h('div', 'u1l1-pay cash', `<small>Pay with cash</small><b>${D(cp)}</b>${d.paid ? `<div>change from $10: ${T(`10.00-${(cp / 100).toFixed(2)}=`)} <b>${D(d.paid - cp)}</b></div>` : ''}`), CW), 40, 236));
    const deb = hide(add(stage, box(h('div', 'u1l1-pay debit', `<small>Pay by debit or card</small><b>${D(d.t)}</b><div>not rounded</div>`), CW), 60 + CW, 236));
    const e = d.t % 10, dir = cp > d.t ? 'up' : cp < d.t ? 'down' : '';
    return [
      { cap: 'No pennies: a <b>cash</b> total must end in <b>0 or 5</b> cents.', run: async (c) => { await Promise.all(stops.map((s, i) => c.pop(s, 300, { delay: i * 120 }))); } },
      { cap: 'Every other total goes to the <b>nearest</b> 0 or 5.', run: async (c) => { await Promise.all(arcs.map((a) => appear(c, a, 400))); await c.fadeIn(key); } },
      { cap: e === 0 || e === 5 ? `<b>${D(d.t)}</b> already ends in ${e}: no rounding needed.` : `<b>${D(d.t)}</b> ends in ${e}, so it rounds <b>${dir}</b> to <b>${D(cp)}</b>.`,
        run: async (c) => { await Promise.all([c.pop(dot, 300), c.fadeIn(tl)]); await c.pop(ring, 340); } },
      { cap: d.paid ? `(i) Cash: pay <b>${D(cp)}</b>. (ii) Change from $10: <b>${D(d.paid - cp)}</b>.` : `Cash: pay <b>${D(cp)}</b>.`, run: (c) => c.fadeIn(cash) },
      { cap: `${d.paid ? '(iii) ' : ''}Debit and card payments are <b>not</b> rounded: pay <b>${D(d.t)}</b>.`, run: (c) => c.fadeIn(deb) }
    ];
  }
};

mountExplainers({ placeValue, centsSlider, orderPrices, roundLines, roundEnd, receiptRace, reasonable, bedmas, countUp, cashRound });
void shake;

/* ============ Stand Up Break! — round, estimate a bill, share a bill or pay cash, at the whiteboards ============ */
{
  const SHOP = [['a notebook', 'a pen', 'a binder', 'a calculator battery', 'a glue stick'], ['milk', 'bread', 'apples', 'cheese', 'eggs', 'yogurt'], ['a burger', 'fries', 'a drink', 'a salad', 'a wrap']];
  const ENDS = [29, 49, 79, 99, 89, 15, 65, 39, 25, 59];
  const price = (r, lo, hi) => r.int(lo, hi) * 100 + r.pick(ENDS);
  const dd = (c) => (c / 100).toFixed(2);
  standup('u1l1', {
    intro: 'Estimate first, then use your calculator. Round money to the nearest cent at the end.',
    levels: {
      BEG: (r) => { // round a calculator answer
        let A; do { A = r.int(1000, 59999); } while (A % 10 === 0 || A % 100 === 0);
        const s = (A / 1000).toFixed(3), cent = Math.round(A / 10), dol = Math.round(A / 1000);
        return { text: `A calculator shows <b>${s}</b>. Write it as money, rounded to the nearest <b>cent</b>. Then round it to the nearest <b>dollar</b>.`, q: '',
          a: [`\\text{nearest cent: }\\$${dd(cent)}`, `\\text{nearest dollar: }\\$${dol}`] };
      },
      PRG: (r) => { // estimate a bill, exact total, enough money?
        const list = r.pick(SHOP), items = r.shuffle(list).slice(0, 3), ps = items.map(() => price(r, 1, 8));
        const tot = ps.reduce((a, b) => a + b, 0), est = ps.reduce((a, b) => a + Math.round(b / 100), 0), have = Math.round(tot / 100) + r.pick([-1, 1, 2]);
        return { text: `You buy ${items.map((it, i) => `${it} (<b>$${dd(ps[i])}</b>)`).join(', ')}. You have <b>$${have}</b>. Estimate the total by rounding, find the exact total, and decide: is it enough?`, q: '',
          a: [`\\text{estimate: }${ps.map((p) => '\\$' + Math.round(p / 100)).join('+')}=\\$${est}`, `\\text{exact: }${ps.map(dd).join('+')}=\\$${dd(tot)}`, tot <= have * 100 ? `\\text{Yes: }\\$${dd(tot)}\\le\\$${have}.00` : `\\text{No: short by }\\$${dd(tot - have * 100)}`] };
      },
      MAS: (r) => r.pick([
        () => { // share a bill with brackets
          const n = r.pick([3, 4]), ps = [price(r, 9, 30), price(r, 5, 18), price(r, 3, 9)], tot = ps.reduce((a, b) => a + b, 0), sh = Math.floor(tot / n), extra = tot - sh * n;
          return { text: `${n} friends share a bill: a pizza for <b>$${dd(ps[0])}</b>, wings for <b>$${dd(ps[1])}</b> and drinks for <b>$${dd(ps[2])}</b>. Write one calculation with brackets. How much does each friend pay?`, q: '',
            a: [`(${ps.map(dd).join('+')})\\div${n}`, `=${dd(tot)}\\div${n}=${(tot / n / 100).toFixed(4).replace(/0+$/, '').replace(/\.$/, '')}`, extra === 0 ? `\\text{Each pays }\\$${dd(sh)}` : `\\text{${n - extra} pay }\\$${dd(sh)}\\text{, ${extra} pay${extra === 1 ? 's' : ''} }\\$${dd(sh + 1)}`] };
        },
        () => { // pay cash: round to 5¢, then the change
          let P; do { P = r.int(300, 1899); } while (P % 5 === 0);
          const cp = cash5(P), paid = P < 900 ? 1000 : 2000;
          return { text: `Your total is <b>$${dd(P)}</b>. You pay <b>cash</b> with a <b>$${paid / 100} bill</b>. What do you pay, and what is your change? What would you pay by debit?`, q: '',
            a: [`\\text{cash price: }\\$${dd(cp)}`, `\\text{change: }${dd(paid)}-${dd(cp)}=\\$${dd(paid - cp)}`, `\\text{debit: }\\$${dd(P)}`] };
        }
      ])()
    }
  });
}

/* ============ Math History: goodbye, penny (1858–2013) ============ */
function pennyStory() {
  const svg = document.getElementById('u1l1-hist'); if (!svg) return;
  const NSV = 'http://www.w3.org/2000/svg', E = (tag, a, p) => { const e = document.createElementNS(NSV, tag); for (const k in a) e.setAttribute(k, a[k]); (p || svg).appendChild(e); return e; };
  const TX = (x, y, s, cls, p) => { const t = E('text', { x, y, class: cls }, p); t.textContent = s; return t; };
  svg.innerHTML = '';
  E('rect', { x: 0, y: 0, width: 600, height: 300, rx: 14, fill: '#fffaf1' });
  // a penny
  const pg = E('g', {});
  E('circle', { cx: 92, cy: 92, r: 52, fill: '#c46a36', stroke: '#7a3e1c', 'stroke-width': 4 }, pg);
  E('circle', { cx: 92, cy: 92, r: 42, fill: 'none', stroke: '#e39a6b', 'stroke-width': 2 }, pg);
  TX(92, 104, '1¢', 'u1l1-hbig', pg);
  // worth vs cost bars
  const BX = 180, U = 220;
  TX(BX, 58, 'worth', 'u1l1-hlab');
  const bw = E('rect', { x: BX + 70, y: 42, width: 0, height: 22, fill: '#7a4a26', rx: 4 });
  const tw = TX(BX + 80, 59, '', 'u1l1-hval');
  TX(BX, 112, 'cost to make', 'u1l1-hlab');
  const bc = E('rect', { x: BX + 120, y: 96, width: 0, height: 22, fill: '#b07a12', rx: 4 });
  const tc = TX(BX + 130, 113, '', 'u1l1-hval');
  const scale = TX(300, 160, '', 'u1l1-hmid');
  // timeline
  const TY = 236;
  E('line', { x1: 40, x2: 560, y1: TY, y2: TY, stroke: '#7a4a26', 'stroke-width': 3 });
  const yrs = [[1858, 'first Canadian cent'], [2012, 'last one made'], [2013, 'no more handed out']];
  const ymk = yrs.map(([y, s], i) => {
    const x = i === 0 ? 70 : i === 1 ? 395 : 530, g = E('g', { opacity: 0 });
    E('circle', { cx: x, cy: TY, r: 8, fill: i === 2 ? '#b07a12' : '#7a4a26' }, g);
    TX(x, TY - 16, String(y), 'u1l1-hyr', g); TX(x, TY + 28, s, 'u1l1-hsm', g); return g;
  });
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let raf = 0;
  const draw = (t) => { // t in seconds
    const k1 = Math.min(1, t / 1.6), k2 = Math.min(1, Math.max(0, (t - 1.8) / 1.8));
    bw.setAttribute('width', U / 1.6 * k1 * 0.6); tw.setAttribute('x', BX + 80 + U / 1.6 * k1 * 0.6); tw.textContent = k1 > 0.2 ? '1¢' : '';
    bc.setAttribute('width', U * k2 * 0.6); tc.setAttribute('x', BX + 130 + U * k2 * 0.6); tc.textContent = k2 > 0.1 ? (1.6 * k2).toFixed(1) + '¢' : '';
    const k3 = Math.min(1, Math.max(0, (t - 4.2) / 2.2)), n = Math.round(1 + 99 * k3);
    scale.textContent = t < 4.2 ? '' : `${n} ${n === 1 ? 'penny' : 'pennies'}: worth $${(n / 100).toFixed(2)}, cost $${(n * 1.6 / 100).toFixed(2)}`;
    ymk.forEach((g, i) => g.setAttribute('opacity', Math.min(1, Math.max(0, (t - 7 - i * 0.9) / 0.6))));
  };
  const play = () => {
    cancelAnimationFrame(raf);
    if (reduce) { draw(20); return; }
    const t0 = performance.now();
    const step = (now) => { const t = (now - t0) / 1000; draw(t); if (t < 10.5) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
  };
  draw(0);
  const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { play(); io.disconnect(); } }, { threshold: 0.5 });
  io.observe(svg);
  svg.addEventListener('click', play);
  const b = svg.closest('.card').querySelector('.hist-play'); if (b) b.addEventListener('click', play);
}
pennyStory();
