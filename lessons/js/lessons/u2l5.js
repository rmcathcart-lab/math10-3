/* Math 10-3 · Unit 2 · Lesson 5 — Commission and Salary Plus Commission.
 * Explainers: the sales bar with a commission slice (estimate 10%, 5%, then calculate), percent → decimal with the
 * point hopping (Full notes), the pay tower (base pay + commission), percent of the sales vs of the base pay (Full
 * notes), the tiered sales bar that fills a level table, the quota meter, the formula worked backwards, Ava's two jobs
 * on a graph with the crossover, and Job B catching up $50 at a time (Full notes). Then the Stand Up Break. */
import { h, add, box, tex, svgEl, tween, stamp, stampIn, pulse, Graph, mountExplainers } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const rnd = (v, d = 2) => Math.round((v + (v >= 0 ? 1e-9 : -1e-9)) * 10 ** d) / 10 ** d;
const lerp = (a, b, t) => a + (b - a) * t;
/** group the whole part in threes when it has 5 or more digits (booklet style: $7385, $38 900) */
const grp = (s, sep) => { const [i, d] = s.split('.'); const g = i.length > 4 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, sep) : i; return d != null ? g + '.' + d : g; };
const M = (v, d = 2) => '$' + grp(rnd(v, d).toFixed(d), '\u202f');           // money text
const MT = (v, d = 2) => '\\$' + grp(rnd(v, d).toFixed(d), '\\,');           // money TeX
const NT = (v) => grp(String(v), '\\,');                                       // plain number TeX
const cbox = (cls, html) => h('div', cls + ' u2l5-c', `<div>${html}</div>`);
const lcd = (e, r) => h('div', 'u2l5-lcd', `<div class="e">${e}</div><div class="r">${r}</div>`);
const line = (stage, html, x, y, w, cls = '') => hide(add(stage, box(h('div', 'u2l5-line ' + cls, `<div>${html}</div>`), w, 40), x, y));

/* =====================================================================================
 * 1. Straight commission: a slice of the sales bar
 * ===================================================================================== */
const ST = {
  maya: { ask: 'Example 1: Maya earns <b>6%</b> commission. She sold <b>$7385.00</b> of appliances. Estimate, then calculate her commission.',
    who: 'Maya · appliances', sales: [7385], rate: 6, dec: '0.06', keys: '7385×0.06', shows: '443.1',
    est: [[0.10, '10% of $7385 is about <b>$740</b> (move the decimal one place left).', '10% ≈ $740'], [0.05, '5% is half of that: about <b>$370</b>.', '5% ≈ $370'], [0.06, '6% is a bit more: about <b>$440</b>.', '6% ≈ $440']] },
  kai: { ask: 'Example 2(a): Kai earns <b>2.5%</b> of the selling price. He sells a travel trailer for <b>$38&#8239;900.00</b>. What is his commission?',
    who: 'Kai · travel trailer', sales: [38900], rate: 2.5, dec: '0.025', keys: '38900×0.025', shows: '972.5',
    est: [[0.10, '10% of $38&#8239;900 is about <b>$3900</b>.', '10% ≈ $3900'], [0.025, '2.5% is a <b>quarter</b> of 10%: about <b>$975</b>.', '2.5% ≈ $975']] },
  bianca: { ask: 'Example 2(b): Bianca earns <b>8%</b> commission. Her sales were <b>$1249.99</b>, <b>$869.50</b> and <b>$2380.00</b>. What is her commission for the week?',
    who: 'Bianca · shoes', sales: [1249.99, 869.50, 2380], rate: 8, dec: '0.08', keys: '4499.49×0.08', shows: '359.9592',
    est: [[0.10, 'the total is about $4500. 10% of that is about <b>$450</b>.', '10% ≈ $450'], [0.08, '8% is a bit less: about <b>$360</b>.', '8% ≈ $360']] }
};
const straight = {
  title: 'Commission: a slice of the sales',
  height: 400,
  minW: 900,
  choices: [{ sep: 'Example 1 check:' }, { v: 'maya', label: 'Maya' }, { sep: 'Example 2 check:' }, { v: 'kai', label: '(a) Kai' }, { v: 'bianca', label: '(b) Bianca' }],
  ask: (k) => ST[k].ask,
  make(stage, k, ex) {
    const d = ST[k], W = ex.W, tot = rnd(d.sales.reduce((a, b) => a + b, 0), 2), com = tot * d.rate / 100, comR = rnd(com, 2);
    const many = d.sales.length > 1;
    // the sales tag (top left)
    const tag = add(stage, box(h('div', 'u2l5-tag', `<small>${d.who}</small><span>Sales</span><b>${many ? '?' : M(tot)}</b>`), 250, 104), 20, 4);
    const sumL = many ? hide(add(stage, box(cbox('u2l5-sum', T(d.sales.map((v) => MT(v)).join('+') + '=' + MT(tot))), 560, 46), 290, 4)) : null;
    const rateB = hide(add(stage, box(cbox('u2l5-rate', `${T(d.rate + '\\%=' + d.dec)} <small>(÷ 100)</small>`), 270, 52), 290, many ? 56 : 30));
    const lc = hide(add(stage, box(lcd(d.keys, d.shows), 250, 66), W - 270, many ? 50 : 22));
    // the sales bar with faint tenths
    const L = 40, BW = W - 80, Y = 150, BH = 58;
    const bar = add(stage, box(h('div', 'u2l5-sbar'), BW, BH), L, Y);
    for (let i = 1; i < 10; i++) add(bar, box(h('div', 'u2l5-tenth'), 2, BH - 6), BW * i / 10 - 1, 3);
    const barLab = add(stage, box(h('div', 'u2l5-sbarlab', many ? 'all her sales' : `Sales ${M(tot)}`), 300, BH), L + BW - 316, Y);
    const slice = hide(add(stage, box(h('div', 'u2l5-slice'), 0, BH + 14), L, Y - 7));
    const sliceLab = hide(add(stage, box(h('div', 'u2l5-slicelab'), 200, 30), L, Y + BH + 10));
    const setSlice = (p, txt) => { slice.style.width = BW * p + 'px'; sliceLab.innerHTML = txt; };
    // the estimate list and the answer
    const estL = d.est.map((e, i) => line(stage, e[2], L, 252 + i * 40, 230, 'est'));
    const res = hide(add(stage, box(cbox('u2l5-res', `Commission: ${T(MT(tot) + '\\times' + d.dec + '=' + (comR === rnd(com, 4) ? MT(comR) : '\\$' + rnd(com, 4) + '\\approx' + MT(comR)))}`), 640, 54), W - 660, 262));
    const okL = hide(add(stage, box(cbox('u2l5-ok', `${M(comR)} is close to the estimate ✓`), 400, 40), W - 520, 330));
    const steps = [];
    if (many) steps.push({ cap: `Add the sales first: total sales = <b>${M(tot)}</b>.`, run: async (c) => { await c.fadeIn(sumL); tag.querySelector('b').textContent = M(tot); await pulse(c, tag, 1.06); } });
    steps.push({ cap: `Change the rate to a decimal: ${T(d.rate + '\\%=' + d.dec)}.`, run: (c) => c.pop(rateB) });
    d.est.forEach((e, i) => steps.push({ cap: `Estimate: ${e[1]}`,
      run: async (c) => {
        const w0 = i ? d.est[i - 1][0] : 0;
        if (!i) await c.anim(slice, [{ opacity: 0 }, { opacity: 1 }], 200);
        const pc = e[2].split(' ')[0];
        sliceLab.style.opacity = 1; sliceLab.innerHTML = pc;
        await tween(c, 600, (t) => setSlice(lerp(w0, e[0], t), pc));
        await c.fadeIn(estL[i]);
      } }));
    steps.push({ cap: `Calculate: ${T(MT(tot) + '\\times' + d.dec)}. The calculator shows <b>${d.shows}</b>.`, run: async (c) => { await c.pop(lc); setSlice(d.rate / 100, M(comR)); slice.classList.add('done'); sliceLab.classList.add('done'); await pulse(c, slice, 1.04); } });
    steps.push({ cap: `${comR === rnd(com, 4) ? 'Write it as money' : 'Round to the nearest cent'}: <b>${M(comR)}</b>. Close to the estimate ✓`, run: async (c) => { await c.pop(res); await c.fadeIn(okL); } });
    return steps;
  }
};

/* =====================================================================================
 * 2. Percent → decimal: the point hops two places left (Full notes)
 * ===================================================================================== */
const decimalRate = {
  title: 'Percent to decimal: ÷ 100',
  height: 330,
  minW: 760,
  choices: [{ v: '6', label: '6%' }, { v: '2.5', label: '2.5%' }, { v: '12', label: '12%' }, { v: '15', label: '15%' }],
  ask: (k) => `Write <b>${k}%</b> as a decimal.`,
  make(stage, k, ex) {
    const W = ex.W, [ip, fp = ''] = k.split('.'), digits = ['0', '0', ...ip.split(''), ...fp.split('')];
    const pp = 2 + ip.length, np = pp - 2, CW = 70, n = digits.length, x0 = (W - n * CW) / 2, Y = 120;
    const dec = String(parseFloat(k) / 100);
    const big = add(stage, box(cbox('u2l5-pct', `${k}% <small>means</small> ${k} <small>out of</small> 100`), 520, 60), (W - 520) / 2, 10);
    const cells = digits.map((g, i) => { const e = add(stage, box(h('div', 'u2l5-dig' + (i < 2 ? ' z' : ''), g), CW - 8, 86), x0 + i * CW + 4, Y); if (i < 2) e.style.opacity = 0; return e; });
    const pt = add(stage, box(h('div', 'u2l5-pt'), 16, 16), x0 + pp * CW - 8, Y + 72);
    const arcs = svgEl('svg', { width: W, height: 90, class: 'u2l5-svg' }); add(stage, arcs, 0, Y - 64); arcs.style.opacity = 0;
    [0, 1].forEach((j) => {
      const xa = x0 + (pp - j) * CW, xb = xa - CW;
      svgEl('path', { d: `M${xa} 60 Q${(xa + xb) / 2} 6 ${xb} 60`, fill: 'none', stroke: '#c93a33', 'stroke-width': 3, 'stroke-dasharray': '6 5' }, arcs);
      svgEl('path', { d: `M${xb - 6} 50 L${xb} 61 L${xb + 9} 53`, fill: 'none', stroke: '#c93a33', 'stroke-width': 3 }, arcs);
      const t = svgEl('text', { x: (xa + xb) / 2, y: 30, 'text-anchor': 'middle', class: 'u2l5-arcn' }, arcs); t.textContent = String(j + 1);
    });
    const keep = (i) => i >= np - 1 || i >= 2; // a leading zero is kept only right before the point
    const eq = hide(add(stage, box(cbox('u2l5-res', `${T(k + '\\%=' + dec)} &nbsp;·&nbsp; check: ${T(dec + '\\times100=' + k)} ✓`), 560, 54), (W - 560) / 2, 252));
    return [
      { cap: `“Percent” means “out of 100”, so ${k}% = ${k} ÷ 100.`, run: (c) => pulse(c, big, 1.05) },
      { cap: `Write ${k} with its decimal point: <b>${k}${fp ? '' : '.'}</b>`, run: (c) => pulse(c, pt, 1.6) },
      { cap: '÷ 100: the decimal point hops <b>two places left</b>.',
        run: async (c) => {
          await c.anim(arcs, [{ opacity: 0 }, { opacity: 1 }], 250);
          const px0 = x0 + pp * CW - 8;
          await tween(c, 900, (t) => { pt.style.left = (px0 - 2 * CW * t) + 'px'; pt.style.top = (Y + 72 - Math.sin(Math.PI * ((t * 2) % 1)) * 40) + 'px'; });
          pt.style.top = (Y + 72) + 'px';
        } },
      { cap: `Fill the empty places with zeros: <b>${dec}</b>`, run: async (c) => { await Promise.all(cells.slice(0, 2).map((e, i) => (keep(i) ? c.pop(e) : Promise.resolve()))); } },
      { cap: `${T(k + '\\%=' + dec)}. Check: ${T(dec + '\\times100=' + k)} ✓`, run: (c) => c.pop(eq) }
    ];
  }
};

/* =====================================================================================
 * 3. Base pay + commission: the pay tower
 * ===================================================================================== */
const BP = {
  jordan: { ask: 'Example 3(a): Jordan earns <b>$450.00 a week</b> plus <b>4%</b> of his sales. This week he sold <b>$7325.00</b>. Find his gross pay.',
    base: 450, hours: 0, sales: 7325, rate: 4, dec: '0.04', baseCap: 'Base pay first: Jordan gets <b>$450.00</b> every week, even if he sells nothing.', baseTex: '\\text{base pay}=\\$450.00' },
  priya: { ask: 'Example 3(b): Priya earns <b>$15.50/h</b> plus <b>2.5%</b> commission. She worked <b>32 h</b> and sold <b>$18&#8239;640.00</b>. Find her gross pay.',
    base: 496, hours: 32, wage: 15.5, sales: 18640, rate: 2.5, dec: '0.025', baseCap: 'Base pay first: her wage is 32 hours × $15.50 = <b>$496.00</b>.', baseTex: '\\text{wage: }32\\times\\$15.50=\\$496.00' }
};
const basePlus = {
  title: 'Gross pay = base pay + commission',
  height: 410,
  minW: 900,
  choices: [{ sep: 'Example 3 check:' }, { v: 'jordan', label: '(a) Jordan' }, { v: 'priya', label: '(b) Priya' }],
  ask: (k) => BP[k].ask,
  make(stage, k, ex) {
    const d = BP[k], W = ex.W, com = rnd(d.sales * d.rate / 100, 2), gross = rnd(d.base + com, 2);
    const X = 50, TW = 200, B0 = 392, S = 300 / 1000;   // tower: px per dollar (same scale for both chips)
    add(stage, box(h('div', 'u2l5-floor'), TW + 60, 4), X - 30, B0);
    const baseB = hide(add(stage, box(h('div', 'u2l5-baseb'), TW, 0), X, B0));
    const baseLab = hide(add(stage, box(cbox('u2l5-blab', `Base pay<br><b>${M(d.base)}</b>`), TW, 60), X, B0 - d.base * S / 2 - 30));
    const bricks = [];
    if (d.hours) for (let i = 0; i < d.hours; i++) { const b = add(stage, box(h('div', 'u2l5-brick'), TW, d.wage * S), X, B0 - (i + 1) * d.wage * S); b.style.opacity = 0; bricks.push(b); }
    const comB = hide(add(stage, box(h('div', 'u2l5-comb'), TW, 0), X, B0 - d.base * S));
    const comLab = hide(add(stage, box(cbox('u2l5-clab', `Commission<br><b>${M(com)}</b>`), TW, 60), X, B0 - (d.base + com / 2) * S - 30));
    const gLab = hide(add(stage, box(cbox('u2l5-glab', `Gross pay <b>${M(gross)}</b>`), TW + 60, 40), X - 30, B0 - gross * S - 48));
    // the work, on the right
    const RX = 330, RW = W - RX - 20;
    const sbar = hide(add(stage, box(h('div', 'u2l5-sbar sm'), RW, 40), RX, 20));
    add(sbar, box(h('div', 'u2l5-sbarlab sm', `Sales ${M(d.sales)}`), 260, 40), RW - 270, 0);
    add(sbar, box(h('div', 'u2l5-slice sm done'), RW * d.rate / 100, 36), 0, 0);
    const sltag = hide(add(stage, box(h('div', 'u2l5-sltag', `${d.rate}% of the sales`), 220, 26), RX, 66));
    const l1 = line(stage, T(d.baseTex), RX, 120, RW);
    const l2 = line(stage, T(`\\text{commission}=${MT(d.sales)}\\times${d.dec}=${MT(com)}`), RX, 172, RW);
    const l3 = line(stage, T(`\\text{gross pay}=${MT(d.base)}+${MT(com)}=${MT(gross)}`), RX, 224, RW);
    const res = hide(add(stage, box(cbox('u2l5-res', `Gross pay: <b>${M(gross)}</b>`), 360, 54), RX + (RW - 360) / 2, 300));
    return [
      { cap: d.baseCap,
        run: async (c) => {
          await c.fadeIn(l1);
          if (d.hours) { await tween(c, 1100, (t) => { const n = Math.round(t * d.hours); bricks.forEach((b, i) => { b.style.opacity = i < n ? 1 : 0; }); }); }
          baseB.style.opacity = 1; await tween(c, d.hours ? 250 : 700, (t) => { baseB.style.height = d.base * S * t + 'px'; baseB.style.top = (B0 - d.base * S * t) + 'px'; });
          bricks.forEach((b) => { b.style.opacity = 0; });
          await c.fadeIn(baseLab);
        } },
      { cap: `Commission = sales × rate: ${T(`${MT(d.sales)}\\times${d.dec}=${MT(com)}`)}.`, run: async (c) => { await c.fadeIn(sbar); await c.pop(sltag); await c.fadeIn(l2); } },
      { cap: `Stack the commission <b>on top</b> of the base pay.`,
        run: async (c) => { comB.style.opacity = 1; await tween(c, 700, (t) => { comB.style.height = com * S * t + 'px'; comB.style.top = (B0 - (d.base + com * t) * S) + 'px'; }); await c.fadeIn(comLab); } },
      { cap: `Gross pay = base pay + commission = ${T(`${MT(d.base)}+${MT(com)}=${MT(gross)}`)}.`, run: async (c) => { await c.fadeIn(l3); await c.pop(gLab); await c.pop(res); } }
    ];
  }
};

/* =====================================================================================
 * 4. Percent of the sales, not of the base pay (Full notes)
 * ===================================================================================== */
const wrongBase = {
  title: 'Percent of the sales, not of the base pay',
  height: 380,
  minW: 900,
  choices: [{ sep: 'Example 3:' }, { v: 'jordan', label: '(a) Jordan' }, { v: 'priya', label: '(b) Priya' }],
  ask: (k) => BP[k].ask,
  make(stage, k, ex) {
    const d = BP[k], W = ex.W, CW = (W - 60) / 2, com = rnd(d.sales * d.rate / 100, 2), bad = rnd(d.base * d.rate / 100, 2);
    const col = (x, ok, a, b) => {
      const head = add(stage, box(cbox('u2l5-wh ' + (ok ? 'ok' : 'no'), ok ? `<b>${d.rate}% of the sales</b>` : `<b>${d.rate}% of the base pay</b>`), CW, 42), x, 4);
      const l1 = line(stage, T(a), x, 58, CW, 'ctr'), l2 = line(stage, T(b), x, 104, CW, 'ctr');
      return [head, l1, l2];
    };
    const A = col(20, true, `${MT(d.sales)}\\times${d.dec}=${MT(com)}`, `${MT(d.base)}+${MT(com)}=${MT(rnd(d.base + com))}`);
    const B = col(40 + CW, false, `${MT(d.base)}\\times${d.dec}=${MT(bad)}`, `${MT(d.base)}+${MT(bad)}=${MT(rnd(d.base + bad))}`);
    hide(A[0], B[0]);
    // bars: the commission each way, same scale
    const S = (CW - 40) / Math.max(com, 1);
    const barA = add(stage, box(h('div', 'u2l5-cmp ok'), 0, 40), 40, 196), barB = add(stage, box(h('div', 'u2l5-cmp no'), 0, 40), 60 + CW, 196);
    hide(barA, barB);
    const labA = hide(add(stage, box(h('div', 'u2l5-cmplab'), CW, 30), 20, 244)), labB = hide(add(stage, box(h('div', 'u2l5-cmplab'), CW, 30), 40 + CW, 244));
    labA.innerHTML = `commission ${M(com)}`; labB.innerHTML = `only ${M(bad)} for selling ${M(d.sales)}?`;
    const sA = stamp(stage, 'Right ✓', { ok: true, x: 20 + CW / 2, y: 320, rotate: -6 }), sB = stamp(stage, 'Too small ✗', { ok: false, x: 40 + CW * 1.5, y: 320, rotate: 6 });
    hide(sA, sB);
    return [
      { cap: `The right way: the commission is ${d.rate}% of what ${k === 'priya' ? 'she' : 'he'} <b>sold</b>.`, run: async (c) => { await c.fadeIn(A[0]); await c.fadeIn(A[1]); await c.fadeIn(A[2]); } },
      { cap: `The commission is ${M(com)}, a fair reward for ${M(d.sales)} of sales.`, run: async (c) => { barA.style.opacity = 1; await tween(c, 600, (t) => { barA.style.width = com * S * t + 'px'; }); await c.fadeIn(labA); await stampIn(c, sA); } },
      { cap: `A common mistake: taking ${d.rate}% of the <b>base pay</b>.`, run: async (c) => { await c.fadeIn(B[0]); await c.fadeIn(B[1]); await c.fadeIn(B[2]); } },
      { cap: `Only ${M(bad)}? That has nothing to do with the sales. <b>Find the commission from the sales.</b>`, run: async (c) => { barB.style.opacity = 1; await tween(c, 500, (t) => { barB.style.width = Math.max(4, bad * S) * t + 'px'; }); await c.fadeIn(labB); await stampIn(c, sB); } }
    ];
  }
};

/* =====================================================================================
 * 5. Graduated commission: the sales bar split into levels
 * ===================================================================================== */
const TI = {
  lucas: { sales: 16400, ask: 'Example 4: Lucas earns <b>3%</b> on the first <b>$10&#8239;000</b> of his monthly sales and <b>5%</b> on sales <b>over</b> $10&#8239;000. In March he sold <b>$16&#8239;400</b>. Find his commission.' },
  s7000: { sales: 7000, ask: 'Lucas’s plan (3% on the first $10&#8239;000, 5% over $10&#8239;000). What is his commission in a month when he sells <b>$7000</b>?' },
  s25000: { sales: 25000, ask: 'Lucas’s plan (3% on the first $10&#8239;000, 5% over $10&#8239;000). What is his commission in a month when he sells <b>$25&#8239;000</b>?' }
};
const tiers = {
  title: 'Graduated commission: split the sales into levels',
  height: 430,
  minW: 900,
  choices: [{ sep: 'Example 4 check:' }, { v: 'lucas', label: 'Lucas, $16 400' }, { sep: 'Try:' }, { v: 's7000', label: '$7000' }, { v: 's25000', label: '$25 000' }],
  ask: (k) => TI[k].ask,
  make(stage, k, ex) {
    const W = ex.W, s = TI[k].sales, LV = 10000, MX = 30000, over = Math.max(0, s - LV), in1 = Math.min(s, LV);
    const c1 = rnd(in1 * 0.03), c2 = rnd(over * 0.05), tot = rnd(c1 + c2), all5 = rnd(s * 0.05);
    const L = 60, BW = W - 120, X = (v) => L + BW * v / MX, Y = 34, BH = 56;
    add(stage, box(h('div', 'u2l5-track'), BW, BH), L, Y);
    for (let v = 0; v <= MX; v += 5000) {
      add(stage, box(h('div', 'u2l5-tick'), 2, 10), X(v) - 1, Y + BH);
      add(stage, box(h('div', 'u2l5-ticklab', M(v, 0)), 90, 22), X(v) - 45, Y + BH + 10);
    }
    const f1 = add(stage, box(h('div', 'u2l5-fill'), 0, BH), L, Y), f2 = add(stage, box(h('div', 'u2l5-fill o'), 0, BH), X(LV), Y);
    const lvl = add(stage, box(h('div', 'u2l5-lvline'), 0, BH + 30), X(LV) - 2, Y - 26);
    add(stage, box(h('div', 'u2l5-lvflag', 'level: $10&#8239;000'), 170, 22), X(LV) + 6, Y - 28);
    const cnt = add(stage, box(h('div', 'u2l5-cnt', ''), 140, 30), L, Y + 13);
    const p1 = hide(add(stage, box(cbox('u2l5-plab b', `first ${M(in1, 0)} · <b>3%</b>`), Math.max(170, X(in1) - L), 30), L + (X(in1) - L) / 2 - Math.max(170, X(in1) - L) / 2, Y + BH + 36));
    const p2 = over ? hide(add(stage, box(cbox('u2l5-plab o', `over: ${M(over, 0)} · <b>5%</b>`), 200, 30), (X(LV) + X(s)) / 2 - 100, Y + BH + 36)) : null;
    // the level table (like the booklet's)
    const tb = add(stage, h('table', 'u2l5-tbl u2l5-stbl'), L, 170); tb.style.width = BW + 'px';
    tb.innerHTML = `<tr><th>Level</th><th>Sales in this level</th><th>Rate</th><th>Commission</th></tr>
      <tr><td>First $10&#8239;000</td><td class="h">${T(over ? MT(LV, 0) : MT(s, 0) + '\\text{ (all of it)}')}</td><td>3%</td><td class="h">${T(`${MT(in1, 0)}\\times0.03=${MT(c1)}`)}</td></tr>
      <tr><td>Over $10&#8239;000</td><td class="h">${T(over ? `${MT(s, 0)}-${MT(LV, 0)}=${MT(over, 0)}` : '\\$0\\text{ (none over)}')}</td><td>5%</td><td class="h">${T(over ? `${MT(over, 0)}\\times0.05=${MT(c2)}` : '\\$0')}</td></tr>
      <tr class="tot"><td colspan="3">Total commission</td><td class="h">${T(over ? `${MT(c1)}+${MT(c2)}=${MT(tot)}` : MT(tot))}</td></tr>`;
    const H = [...tb.querySelectorAll('td.h')]; hide(...H);
    const wrong = over ? hide(add(stage, box(cbox('u2l5-wrong', `5% on <b>all</b> the sales: ${T(`${MT(s, 0)}\\times0.05=${MT(all5)}`)} ✗`), 560, 44), L, 378)) : null;
    const st = over ? hide(stamp(stage, 'Wrong ✗', { ok: false, x: L + 640, y: 400, rotate: 6 })) : null;
    const fill = (c) => tween(c, 1100, (t) => { const v = s * t; f1.style.width = (X(Math.min(v, LV)) - L) + 'px'; f2.style.width = Math.max(0, X(v) - X(LV)) + 'px'; cnt.textContent = M(Math.round(v / 100) * 100, 0); });
    const steps = [{ cap: `Fill the sales bar to <b>${M(s, 0)}</b>.`, run: async (c) => { await fill(c); cnt.textContent = M(s, 0); } }];
    if (over) {
      steps.push({ cap: `Step 1: split the sales at the $10&#8239;000 level: <b>${M(LV, 0)}</b> and ${T(`${MT(s, 0)}-${MT(LV, 0)}=${MT(over, 0)}`)}.`, run: async (c) => { f1.classList.add('b'); await c.fadeIn(p1); await c.fadeIn(p2); await c.fadeIn(H[0]); await c.fadeIn(H[2]); } });
      steps.push({ cap: `Step 2: the first $10&#8239;000 at 3%: ${T(`${MT(LV, 0)}\\times0.03=${MT(c1)}`)}.`, run: (c) => c.pop(H[1]) });
      steps.push({ cap: `Only the ${M(over, 0)} <b>over</b> the level gets 5%: ${T(`${MT(over, 0)}\\times0.05=${MT(c2)}`)}.`, run: (c) => c.pop(H[3]) });
      steps.push({ cap: `Step 3: add: ${T(`${MT(c1)}+${MT(c2)}=${MT(tot)}`)}. The commission is <b>${M(tot)}</b>.`, run: (c) => c.pop(H[4]) });
      steps.push({ cap: `Watch out: 5% on all ${M(s, 0)} would give ${M(all5)}. The 5% is only for the part over $10&#8239;000.`, run: async (c) => { await c.fadeIn(wrong); await stampIn(c, st); } });
    } else {
      steps.push({ cap: `The bar stops <b>before</b> the $10&#8239;000 level, so all ${M(s, 0)} is in the first level.`, run: async (c) => { f1.classList.add('b'); await c.fadeIn(p1); await c.fadeIn(H[0]); await c.fadeIn(H[2]); } });
      steps.push({ cap: `First level at 3%: ${T(`${MT(s, 0)}\\times0.03=${MT(c1)}`)}. Nothing is over the level, so no 5%.`, run: async (c) => { await c.pop(H[1]); await c.fadeIn(H[3]); } });
      steps.push({ cap: `The commission is <b>${M(tot)}</b>.`, run: (c) => c.pop(H[4]) });
    }
    return steps;
  }
};

/* =====================================================================================
 * 6. Quota: commission only on the sales over the target
 * ===================================================================================== */
const QU = {
  a: { sales: 27850, ask: 'Example 5(a): Hana earns <b>$2400.00 a month</b> plus <b>6%</b> of her sales over a quota of <b>$20&#8239;000</b>. Find her gross pay when she sells <b>$27&#8239;850</b>.' },
  b: { sales: 18500, ask: 'Example 5(b): Hana earns <b>$2400.00 a month</b> plus <b>6%</b> of her sales over a quota of <b>$20&#8239;000</b>. Find her gross pay when she sells <b>$18&#8239;500</b>.' }
};
const quota = {
  title: 'Quota: commission only over the target',
  height: 410,
  minW: 900,
  choices: [{ sep: 'Example 5 check:' }, { v: 'a', label: '(a) $27 850' }, { v: 'b', label: '(b) $18 500' }],
  ask: (k) => QU[k].ask,
  make(stage, k, ex) {
    const W = ex.W, s = QU[k].sales, Q = 20000, MX = 30000, over = Math.max(0, s - Q), com = rnd(over * 0.06), gross = rnd(2400 + com);
    // the meter (left)
    const MX0 = 120, MW = 90, T0 = 20, B0 = 390, Yv = (v) => B0 - (B0 - T0) * v / MX;
    add(stage, box(h('div', 'u2l5-meter'), MW, B0 - T0), MX0, T0);
    for (let v = 0; v <= MX; v += 5000) add(stage, box(h('div', 'u2l5-mlab', M(v, 0)), 90, 22), MX0 - 98, Yv(v) - 11);
    const fA = add(stage, box(h('div', 'u2l5-mfill'), MW - 16, 0), MX0 + 8, B0), fB = add(stage, box(h('div', 'u2l5-mfill o'), MW - 16, 0), MX0 + 8, Yv(Q)); hide(fB);
    add(stage, box(h('div', 'u2l5-qline'), MW + 70, 4), MX0 - 10, Yv(Q) - 2);
    add(stage, box(h('div', 'u2l5-qflag', 'quota $20&#8239;000'), 160, 28), MX0 + MW + 8, Yv(Q) + 4);
    const cnt = add(stage, box(h('div', 'u2l5-mcnt', ''), 130, 26), MX0 + MW + 8, B0 - 26);
    const overLab = over ? hide(add(stage, box(h('div', 'u2l5-overlab', `over: <b>${M(over, 0)}</b>`), 150, 28), MX0 + MW + 8, (Yv(Q) + Yv(s)) / 2 - 14)) : null;
    // the work (right)
    const RX = 380, RW = W - RX - 20;
    const l1 = line(stage, over ? T(`\\text{over quota}=${MT(s, 0)}-${MT(Q, 0)}=${MT(over, 0)}`) : `${M(s, 0)} is <b>less</b> than the ${M(Q, 0)} quota: nothing is over it.`, RX, 20, RW);
    const l2 = line(stage, T(over ? `\\text{commission}=${MT(over, 0)}\\times0.06=${MT(com)}` : '\\text{commission}=\\$0'), RX, 72, RW);
    const l3 = line(stage, T(`\\text{gross pay}=\\$2400.00+${MT(com)}=${MT(gross)}`), RX, 124, RW);
    // the pay bar
    const PS = (RW - 40) / 3000, PY = 212;
    const pb = hide(add(stage, box(h('div', 'u2l5-payb'), 2400 * PS, 50), RX, PY));
    pb.innerHTML = '<span>salary $2400.00</span>';
    const pc = over ? hide(add(stage, box(h('div', 'u2l5-payc'), com * PS, 50), RX + 2400 * PS, PY)) : null;
    const pcl = over ? hide(add(stage, box(h('div', 'u2l5-paycl', `+ ${M(com)}`), 120, 26), RX + 2400 * PS - 20, PY + 54)) : null;
    const res = hide(add(stage, box(cbox('u2l5-res', `Hana earns <b>${M(gross)}</b>${over ? '' : ' (salary only)'}`), 420, 54), RX + (RW - 420) / 2, 312));
    return [
      { cap: `Fill the meter with Hana’s sales: <b>${M(s, 0)}</b>.`,
        run: async (c) => { await tween(c, 1200, (t) => { const v = s * t; const a = Math.min(v, Q); fA.style.height = (B0 - Yv(a)) + 'px'; fA.style.top = Yv(a) + 'px'; const b = Math.max(0, v - Q); fB.style.opacity = b > 0 ? 1 : 0; fB.style.height = (Yv(Q) - Yv(Q + b)) + 'px'; fB.style.top = Yv(Q + b) + 'px'; cnt.textContent = M(Math.round(v / 50) * 50, 0); }); cnt.textContent = M(s, 0); } },
      over ? { cap: `Only the part <b>over</b> the quota earns commission: ${T(`${MT(s, 0)}-${MT(Q, 0)}=${MT(over, 0)}`)}.`, run: async (c) => { fA.classList.add('dim'); await c.fadeIn(overLab); await c.fadeIn(l1); } }
        : { cap: `The meter stops <b>below</b> the quota line. No sales are over the quota.`, run: async (c) => { await c.shake(fA); fA.classList.add('dim'); await c.fadeIn(l1); } },
      { cap: over ? `Commission: ${T(`${MT(over, 0)}\\times0.06=${MT(com)}`)}.` : 'So the commission is <b>$0</b>.', run: (c) => c.fadeIn(l2) },
      { cap: `Gross pay = salary + commission = <b>${M(gross)}</b>.`, run: async (c) => { await c.fadeIn(l3); await c.fadeIn(pb, 350, { from: 'translateX(-20px)' }); if (pc) { await c.fadeIn(pc, 350, { from: 'translateX(-20px)' }); await c.fadeIn(pcl); } await c.pop(res); } }
    ];
  }
};

/* =====================================================================================
 * 7. Working backwards: the formula run in reverse
 * ===================================================================================== */
const BK = {
  a: { ask: 'Example 6(a): Ethan earned <b>$378.00</b> in commission on sales of <b>$8400.00</b>. What is his commission rate?',
    vals: [MT(8400), '?', MT(378)], miss: 1 },
  b: { ask: 'Example 6(b): A booking agent keeps <b>15%</b> of what the band is paid. The agent earned <b>$1620.00</b>. How much was the band paid in all?',
    vals: ['?', '0.15', MT(1620)], miss: 0 }
};
const backwards = {
  title: 'Working backwards: undo the ×',
  height: 410,
  minW: 900,
  choices: [{ sep: 'Example 6 check:' }, { v: 'a', label: '(a) Find the rate' }, { v: 'b', label: '(b) Find the sales' }],
  ask: (k) => BK[k].ask,
  make(stage, k, ex) {
    const d = BK[k], W = ex.W, BW = 230, GAP = 70, x0 = (W - 3 * BW - 2 * GAP) / 2, Y = 30, BH = 92;
    const xs = [0, 1, 2].map((i) => x0 + i * (BW + GAP));
    const names = ['sales', 'rate', 'commission'];
    const boxes = names.map((n, i) => { const b = add(stage, box(h('div', 'u2l5-fbox' + (i === 2 ? ' com' : ''), `<small>${n}</small><b></b>`), BW, BH), xs[i], Y); return b; });
    ['×', '='].forEach((o, i) => add(stage, box(h('div', 'u2l5-fop', o), GAP, BH), xs[i] + BW, Y));
    const setV = (i, v) => { boxes[i].querySelector('b').innerHTML = v === '?' ? '?' : T(v); boxes[i].classList.toggle('q', v === '?'); };
    // the undo arrow (from commission back to the missing box), below the boxes
    const sv = add(stage, svgEl('svg', { width: W, height: 96, class: 'u2l5-svg' }), 0, Y + BH);
    const xa = xs[2] + BW / 2, xb = xs[d.miss] + BW / 2;
    const arc = svgEl('path', { d: `M${xa} 4 C${xa} 80, ${xb} 80, ${xb} 10`, fill: 'none', stroke: '#c93a33', 'stroke-width': 4, 'stroke-dasharray': '8 6' }, sv);
    const head = svgEl('path', { d: `M${xb - 9} 22 L${xb} 6 L${xb + 9} 22`, fill: 'none', stroke: '#c93a33', 'stroke-width': 4 }, sv);
    const op = svgEl('text', { x: (xa + xb) / 2, y: 86, 'text-anchor': 'middle', class: 'u2l5-undo' }, sv); op.textContent = `÷ ${d.miss === 1 ? 'sales' : 'rate'}`;
    hide(arc, head, op);
    const LX = 60, LW = W - 340;
    const lc = hide(add(stage, box(lcd(d.miss === 1 ? '378÷8400' : '1620÷0.15', d.miss === 1 ? '0.045' : '10800'), 240, 66), W - 270, 236));
    let L;
    if (d.miss === 1) L = [line(stage, T('\\text{rate}=\\$378.00\\div\\$8400.00=0.045'), LX, 230, LW), line(stage, T('0.045\\times100=4.5\\%'), LX, 278, LW), line(stage, T('\\text{Check: }\\$8400\\times0.045=\\$378\\ \\checkmark'), LX, 326, LW, 'chk')];
    else L = [line(stage, T('15\\%=0.15'), LX, 230, LW), line(stage, T('\\text{sales}=\\$1620.00\\div0.15=\\$10\\,800.00'), LX, 278, LW), line(stage, T('\\text{Check: }\\$10\\,800\\times0.15=\\$1620\\ \\checkmark'), LX, 326, LW, 'chk')];
    const st = hide(stamp(stage, '✓', { ok: true, x: W - 150, y: 352, rotate: -6 }));
    const ans = d.miss === 1 ? '4.5\\%' : MT(10800);
    return [
      { cap: 'The commission formula: <b>sales × rate = commission</b>.', run: (c) => Promise.all(boxes.map((b, i) => c.pop(b, 380, { delay: i * 120 }))) },
      { cap: d.miss === 1 ? 'Fill in what we know: the sales and the commission. The <b>rate</b> is missing.' : 'Fill in what we know: 15% = 0.15, and the commission. The <b>sales</b> are missing.',
        run: async (c) => { d.vals.forEach((v, i) => setV(i, v)); if (d.miss === 0) await c.fadeIn(L[0]); await pulse(c, boxes[d.miss], 1.08); } },
      { cap: `Undo the ×: <b>divide</b> the commission by the ${d.miss === 1 ? 'sales' : 'rate'}.`,
        run: async (c) => { await c.anim(arc, [{ opacity: 0 }, { opacity: 1 }], 300); head.style.opacity = 1; op.style.opacity = 1; await c.fadeIn(d.miss === 1 ? L[0] : L[1]); await c.pop(lc); } },
      d.miss === 1
        ? { cap: '0.045 is a decimal. × 100 to write it as a percent: <b>4.5%</b>.', run: async (c) => { await c.fadeIn(L[1]); setV(1, ans); await c.pop(boxes[1].querySelector('b')); } }
        : { cap: 'The band was paid <b>$10&#8239;800.00</b>.', run: async (c) => { setV(0, ans); await c.pop(boxes[0].querySelector('b')); } },
      { cap: 'Check: run the formula forward. Sales × rate gives the commission ✓', run: async (c) => { await c.fadeIn(L[2]); await stampIn(c, st); } }
    ];
  }
};

/* =====================================================================================
 * 8. Which job pays more? Two lines and the crossover
 * ===================================================================================== */
const crossover = {
  title: 'Which job pays more? Find the crossover',
  height: 450,
  minW: 940,
  ask: 'Example 7: <b>Job A</b> pays $2800 a month. <b>Job B</b> pays $1500 a month plus 5% of sales. Which job pays more?',
  make(stage, v, ex) {
    const W = ex.W;
    const G = new Graph(stage, { x: 4, y: 4, width: 580, height: 440, xmin: 0, xmax: 40000, ymin: 0, ymax: 4000, xstep: 5000, ystep: 500, numbers: false, arrows: false, xtitle: '', ytitle: '', pad: [12, 16, 56, 84] });
    for (let x = 0; x <= 40000; x += 10000) { const [px, py] = G.toPx(x, 0); const t = svgEl('text', { x: px, y: py + 22, 'text-anchor': 'middle', class: 'u2l5-gnum' }, G.layers.axes); t.textContent = grp(String(x), '\u202f'); }
    for (let y = 0; y <= 4000; y += 500) { const [px, py] = G.toPx(0, y); const t = svgEl('text', { x: px - 8, y: py + 6, 'text-anchor': 'end', class: 'u2l5-gnum' }, G.layers.axes); t.textContent = String(y); }
    const [ax, ay] = G.toPx(20000, 0); add(G.el, box(h('div', 'u2l5-gax', 'Monthly sales ($)'), 240, 24), ax - 120, ay + 28);
    const yt = add(G.el, box(h('div', 'u2l5-gax v', 'Monthly pay ($)'), 200, 24), -88, 190);
    const sales = [10000, 20000, 30000, 40000], A = (x) => 2800, B = (x) => 1500 + 0.05 * x;
    const ptsA = sales.map((x) => hide(G.point(x, A(x), { color: 'blue' }))), ptsB = sales.map((x) => hide(G.point(x, B(x), { color: 'orange' })));
    const lineA = G.segment([0, 2800], [40000, 2800], { color: 'blue', width: 4 }); hide(lineA);
    const lineB = G.segment([0, 1500], [40000, 3500], { color: 'orange', width: 4 }); hide(lineB);
    const labA = hide(G.label(4000, 2800, '<b>Job A</b>', { pos: 'n', color: 'blue', cls: 'bk-ptlab' })), labB = hide(G.label(5000, B(5000), '<b>Job B</b>', { pos: 'se', color: 'orange', cls: 'bk-ptlab' }));
    const shA = G.polyline([[0, 2800], [26000, 2800], [0, 1500]], { closed: true, fill: '#1f5bd6', fillOpacity: 0.14, color: 'transparent', width: 0 }); hide(shA);
    const shB = G.polyline([[26000, 2800], [40000, 3500], [40000, 2800]], { closed: true, fill: '#e8a01e', fillOpacity: 0.2, color: 'transparent', width: 0 }); hide(shB);
    const shAl = hide(G.label(11000, 2420, 'Job A pays more', { pos: 'c', cls: 'u2l5-shl a' })), shBl = hide(G.label(31000, 3750, 'Job B pays more', { pos: 'c', cls: 'u2l5-shl b' }));
    const gd = G.guides(26000, 2800); hide(gd);
    const X = hide(G.point(26000, 2800, { color: 'red', r: 8, label: 'same pay: $2800 at $26&#8239;000', pos: 'nw' })); hide(X.label);
    const v24 = G.vline(24000, { color: 'purple' }); hide(v24);
    const pA = hide(G.point(24000, 2800, { color: 'blue', r: 7 })), pB = hide(G.point(24000, 2700, { color: 'orange', r: 7 }));
    // the table (right)
    const RX = 610, RW = W - RX - 10;
    const tb = add(stage, h('table', 'u2l5-tbl u2l5-gtbl'), RX, 10); tb.style.width = RW + 'px';
    tb.innerHTML = '<tr><th>Sales</th><th class="a">Job A</th><th class="b">Job B</th></tr>' + sales.map((x) => `<tr><td>${M(x, 0)}</td><td class="h a">${M(A(x), 0)}</td><td class="h b">${M(B(x), 0)}</td></tr>`).join('');
    const cA = [...tb.querySelectorAll('td.h.a')], cB = [...tb.querySelectorAll('td.h.b')]; hide(...cA, ...cB);
    const calc = hide(add(stage, box(cbox('u2l5-xcalc', `${T('\\$2800-\\$1500=\\$1300')}<br>${T('\\$1300\\div0.05=\\$26\\,000')}`), RW, 74), RX, 262));
    const verdict = hide(add(stage, box(cbox('u2l5-verd', 'At $24&#8239;000: A <b>$2800</b>, B <b>$2700</b>'), RW, 52), RX, 346));
    const st = hide(stamp(stage, 'Job A', { ok: true, x: RX + RW / 2, y: 424, rotate: -5 }));
    return [
      { cap: '<b>Job A</b> pays $2800 every month, no matter what she sells.', run: async (c) => { for (let i = 0; i < 4; i++) { await c.fadeIn(cA[i], 200); await G.reveal(ptsA[i], c, 200); } lineA.style.opacity = 1; await G.drawIn(lineA, 600, c); await c.fadeIn(labA); } },
      { cap: `<b>Job B</b> at $10&#8239;000: ${T('\\$1500+\\$10\\,000\\times0.05=\\$2000')}. Each $10&#8239;000 more adds $500.`, run: async (c) => { for (let i = 0; i < 4; i++) { await c.fadeIn(cB[i], 200); await G.reveal(ptsB[i], c, 200); } } },
      { cap: 'Join the points. Job B starts at $1500 (no sales) and goes <b>up</b> as she sells more.', run: async (c) => { lineB.style.opacity = 1; await G.drawIn(lineB, 800, c); await c.fadeIn(labB); } },
      { cap: `The lines <b>cross</b> where the jobs pay the same: ${T('\\$1300\\div0.05=\\$26\\,000')} of sales, $2800 of pay.`, run: async (c) => { gd.style.opacity = 1; await G.drawIn(gd, 500, c); await G.reveal(X, c); await c.fadeIn(calc); } },
      { cap: 'Sell <b>less</b> than $26&#8239;000: Job A pays more. Sell <b>more</b>: Job B pays more.', run: async (c) => { await c.anim(shA, [{ opacity: 0 }, { opacity: 1 }], 400); await c.fadeIn(shAl); await c.anim(shB, [{ opacity: 0 }, { opacity: 1 }], 400); await c.fadeIn(shBl); } },
      { cap: 'Ava expects about $24&#8239;000: Job A pays $2800 and Job B pays $2700. <b>Job A pays more.</b>', run: async (c) => { v24.style.opacity = 1; await G.drawIn(v24, 400, c); await G.reveal(pA, c); await G.reveal(pB, c); await c.fadeIn(verdict); await stampIn(c, st); } }
    ];
  }
};

/* =====================================================================================
 * 9. Why difference ÷ rate? Job B catches up $50 at a time (Full notes)
 * ===================================================================================== */
const whyCross = {
  title: 'Job B catches up, $50 at a time',
  height: 430,
  minW: 900,
  ask: 'Example 7: Job A pays $2800. Job B pays $1500 + 5% of sales. How much must Ava sell for Job B to catch up?',
  make(stage, v, ex) {
    const W = ex.W, L = 170, S = (W - L - 60) / 3000;
    const rowA = add(stage, box(h('div', 'u2l5-rowl', 'Job A'), 140, 50), 20, 30), rowB = add(stage, box(h('div', 'u2l5-rowl b', 'Job B'), 140, 50), 20, 100);
    add(stage, box(h('div', 'u2l5-hb a', '<span>$2800</span>'), 2800 * S, 50), L, 30);
    const bB = add(stage, box(h('div', 'u2l5-hb b'), 1500 * S, 50), L, 100);
    const bBl = add(bB, h('span', '', '$1500'));
    const gap = add(stage, box(h('div', 'u2l5-gapb'), 1300 * S, 50), L + 1500 * S, 100);
    const gapL = add(stage, box(h('div', 'u2l5-gapl', 'gap: <b>$1300</b>'), 200, 30), L + 2150 * S - 100, 156);
    const sc = add(stage, box(cbox('u2l5-scount', 'Sales: <b>$0</b>'), 300, 50), L, 210);
    const chips = add(stage, box(h('div', 'u2l5-chips'), W - 80, 96), 40, 270);
    const res = hide(add(stage, box(cbox('u2l5-res', `${T('\\$1300\\div\\$50=26')} steps of $1000 &nbsp;=&nbsp; ${T('\\$1300\\div0.05=\\$26\\,000')}`), 680, 54), (W - 680) / 2, 370));
    const setN = (n) => { const b = 1500 + 50 * n; bB.style.width = b * S + 'px'; bBl.textContent = M(b, 0); gap.style.left = (L + b * S) + 'px'; gap.style.width = Math.max(0, (2800 - b) * S) + 'px';
      gapL.innerHTML = n >= 26 ? '<b>caught up!</b>' : `gap: <b>${M(2800 - b, 0)}</b>`; sc.firstChild.innerHTML = `Sales: <b>${M(n * 1000, 0)}</b>`;
      chips.innerHTML = Array.from({ length: n }, () => '<i>+$50</i>').join(''); };
    return [
      { cap: 'With no sales, Job A pays <b>$1300 more</b> than Job B: $2800 − $1500.', run: (c) => pulse(c, gapL, 1.12) },
      { cap: 'Ava sells $1000. Job B gets 5% of $1000 = <b>$50</b> more. The gap is now $1250.', run: async (c) => { setN(1); await pulse(c, bB, 1.03); } },
      { cap: 'Every $1000 of sales closes the gap by another $50. Keep going…', run: async (c) => { await tween(c, 2200, (t) => setN(1 + Math.round(t * 25))); setN(26); } },
      { cap: `It takes <b>26</b> steps of $1000: $26&#8239;000. That is the same as ${T('\\$1300\\div0.05')}.`, run: (c) => c.pop(res) }
    ];
  }
};

mountExplainers({ straight, decimalRate, basePlus, wrongBase, tiers, quota, backwards, crossover, whyCross });

/* ============ Stand Up Break! — commission, base pay + commission, levels and quotas, at the whiteboards ============ */
{
  const dd = (v) => grp(rnd(v, 2).toFixed(2), '\\,');
  const n0 = (v) => grp(String(v), '\\,');
  const JOBS = [['sells e-bikes', 'e-bikes'], ['sells hot tubs', 'hot tubs'], ['sells laptops', 'laptops'], ['sells kitchen cabinets', 'cabinets'], ['sells snowmobiles', 'snowmobiles'], ['sells sofas', 'sofas'], ['sells TVs', 'TVs'], ['sells camping gear', 'camping gear']];
  const NAMES = ['Noah', 'Aria', 'Liam', 'Zoe', 'Mateo', 'Harper', 'Ethan', 'Sofia', 'Owen', 'Amara', 'Lucas', 'Mia'];
  standup('u2l5', {
    intro: 'Change the rate to a decimal, estimate, then use your calculator. Show every line.',
    levels: {
      BEG: (r) => { // straight commission
        const who = r.pick(NAMES), [job] = r.pick(JOBS), rate = r.pick([3, 4, 5, 6, 7, 8, 9, 2.5, 3.5]), sales = r.int(1800, 9800) + r.pick([0, 0.5, 0.99, 0.25]);
        const com = sales * rate / 100, dec = String(rate / 100);
        return { text: `${who} ${job} and earns <b>${rate}%</b> straight commission. This week ${who} sold <b>$${grp(sales.toFixed(2), '\u202f')}</b>. Estimate, then find the commission.`, q: '',
          a: [`${rate}\\%=${dec}`, `\\$${dd(sales)}\\times${dec}=${Math.abs(com - rnd(com)) < 1e-9 ? '\\$' + dd(com) : rnd(com, 4) + '\\approx\\$' + dd(com)}`] };
      },
      PRG: (r) => r.pick([
        () => { // weekly salary + commission
          const who = r.pick(NAMES), [job] = r.pick(JOBS), base = r.pick([350, 400, 425, 480, 500, 550]), rate = r.pick([2, 3, 4, 5, 6]), sales = r.int(30, 140) * 100 + r.pick([0, 25, 50, 75]);
          const com = rnd(sales * rate / 100), g = rnd(base + com);
          return { text: `${who} ${job}. ${who} earns <b>$${base}.00 a week</b> plus <b>${rate}%</b> of sales. This week, sales were <b>$${grp(String(sales), '\u202f')}.00</b>. Find the gross pay.`, q: '',
            a: [`\\text{commission}=\\$${n0(sales)}.00\\times${rate / 100}=\\$${dd(com)}`, `\\text{gross pay}=\\$${base}.00+\\$${dd(com)}=\\$${dd(g)}`] };
        },
        () => { // hourly + commission
          const who = r.pick(NAMES), [job] = r.pick(JOBS), wage = r.pick([15, 15.25, 15.5, 16, 16.5, 17]), hrs = r.pick([20, 24, 28, 30, 32, 36]), rate = r.pick([1.5, 2, 2.5, 3]), sales = r.int(40, 160) * 100;
          const wg = rnd(wage * hrs), com = rnd(sales * rate / 100), g = rnd(wg + com);
          return { text: `${who} ${job} for <b>$${wage.toFixed(2)}/h</b> plus <b>${rate}%</b> commission. One week ${who} works <b>${hrs} h</b> and sells <b>$${grp(String(sales), '\u202f')}.00</b>. Find the gross pay.`, q: '',
            a: [`\\text{wage: }${hrs}\\times\\$${wage.toFixed(2)}=\\$${dd(wg)}`, `\\text{commission: }\\$${n0(sales)}.00\\times${rate / 100}=\\$${dd(com)}`, `\\text{gross pay}=\\$${dd(wg)}+\\$${dd(com)}=\\$${dd(g)}`] };
        }
      ])(),
      MAS: (r) => r.pick([
        () => { // graduated
          const lv = r.pick([5000, 8000, 10000, 12000]), [r1, r2] = r.pick([[2, 4], [3, 5], [3, 6], [4, 7]]), sales = lv + r.int(10, 120) * 100;
          const c1 = rnd(lv * r1 / 100), ov = sales - lv, c2 = rnd(ov * r2 / 100);
          return { text: `A store pays <b>${r1}%</b> on the first <b>$${grp(String(lv), '\u202f')}</b> of monthly sales and <b>${r2}%</b> on sales <b>over</b> $${grp(String(lv), '\u202f')}. Find the commission on sales of <b>$${grp(String(sales), '\u202f')}</b>.`, q: '',
            a: [`\\$${n0(lv)}\\times${r1 / 100}=\\$${dd(c1)}`, `\\$${n0(sales)}-\\$${n0(lv)}=\\$${n0(ov)};\\quad \\$${n0(ov)}\\times${r2 / 100}=\\$${dd(c2)}`, `\\text{total}=\\$${dd(c1)}+\\$${dd(c2)}=\\$${dd(c1 + c2)}`] };
        },
        () => { // quota
          const who = r.pick(NAMES), base = r.pick([1800, 2000, 2200, 2500, 2600]), q = r.pick([10000, 12000, 15000, 18000, 25000]), rate = r.pick([5, 6, 8, 10]), sales = q + r.pick([-1, 1, 1, 1]) * r.int(5, 90) * 100;
          const ov = Math.max(0, sales - q), com = rnd(ov * rate / 100);
          return { text: `${who} earns <b>$${base}.00 a month</b> plus <b>${rate}%</b> of sales <b>over</b> a quota of <b>$${grp(String(q), '\u202f')}</b>. Find the gross pay in a month with sales of <b>$${grp(String(sales), '\u202f')}</b>.`, q: '',
            a: ov ? [`\\$${n0(sales)}-\\$${n0(q)}=\\$${n0(ov)}`, `\\$${n0(ov)}\\times${rate / 100}=\\$${dd(com)}`, `\\text{gross pay}=\\$${base}.00+\\$${dd(com)}=\\$${dd(base + com)}`]
              : [`\\text{\\$${n0(sales)} is less than the quota: commission }\\$0`, `\\text{gross pay}=\\$${base}.00`] };
        }
      ])()
    }
  });
}
