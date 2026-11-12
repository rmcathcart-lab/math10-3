/* Math 10-3 · Unit 1 · Lesson 9 — On Sale! Discounts and Sale Prices.
 * Explainers: the price tag that gets slashed (Example 1), the percent-you-pay bar (the shortcut, Example 2), Example 3
 * on the receipt (Full notes), the percent-decrease bars with a percent ruler (Example 4), divide by the original, not
 * the sale price (Full notes), the sale machine then the tax machine (Examples 5 and 6), 30% off vs $25 off on a
 * savings graph (Example 7), what you take home in a BOGO deal (Example 8), stacked discounts on a 100-square grid
 * (Example 9) and the fake deal bars (Example 10). Then the "try any price" slider and the Stand Up Break. */
import { Graph, h, add, box, tex, svgEl, pulse, tween, stamp, stampIn, mountExplainers } from '../blocks.js';
import { fmt } from '../explain.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const rnd = (v, d = 2) => Math.round((v + (v >= 0 ? 1e-9 : -1e-9)) * 10 ** d) / 10 ** d;
const clean = (v) => Number(v.toPrecision(10));                 // what the calculator screen shows
const M = (v) => '$' + (Math.abs(v) >= 1000 ? fmt(Math.round(v)) : rnd(v).toFixed(2)); // money text
const D = (v) => rnd(v).toFixed(2);                             // 2 decimals, no $
const lerp = (a, b, t) => a + (b - a) * t;
/** a box whose mixed text and maths stay together on centred lines */
const cbox = (cls, html) => h('div', cls + ' u1l9-c', `<div>${html}</div>`);
const line = (stage, html, x, y, w, hh = 44, cls = '') => hide(add(stage, box(h('div', 'u1l9-ln ' + cls, `<div>${html}</div>`), w, hh), x, y));
/** slide an element in from dx px to the left (a tag coming out of a machine) */
const slideIn = (c, el, dx, ms = 800) => c.anim(el, [{ opacity: 0.15, transform: `translateX(${-dx}px)` }, { opacity: 1, transform: 'none' }], ms);

/* =====================================================================================
 * 1. The price tag gets slashed: discount, then sale price (Example 1)
 * ===================================================================================== */
const SL = {
  jacket: { ask: 'Example 1: a winter jacket at a Calgary mall is regularly <b>$139.99</b>. It is on sale for <b>30% off</b>. Estimate, then find the discount and the sale price.',
    item: 'Winter jacket', reg: 139.99, pct: 30, e1: '$139.99 is about <b>$140</b>.', e2: `10% of $140 is $14, so 30% is about ${T('3\\times14=\\$42')}.`, eD: 42, eR: 140 },
  hoodie: { ask: 'A hoodie is regularly <b>$59.99</b>. It is on sale for <b>25% off</b>. Estimate, then find the discount and the sale price.',
    item: 'Hoodie', reg: 59.99, pct: 25, e1: '$59.99 is about <b>$60</b>.', e2: `25% is a quarter: ${T('\\$60\\div4=\\$15')}.`, eD: 15, eR: 60 }
};
const slash = {
  title: 'Slash the price tag',
  height: 400,
  minW: 900,
  choices: [{ sep: 'Example 1 check:' }, { v: 'jacket', label: 'Winter jacket' }, { sep: 'More:' }, { v: 'hoodie', label: 'Hoodie' }],
  ask: (k) => SL[k].ask,
  make(stage, k, ex) {
    const d = SL[k], W = ex.W, r = d.pct / 100, raw = clean(r * d.reg), disc = rnd(raw), sale = rnd(d.reg - disc), eS = d.eR - d.eD;
    // the tag
    const tag = add(stage, box(h('div', 'u1l9-tag', `<i class="hole"></i><small>${d.item}</small><div class="old">${M(d.reg)}</div><div class="new">${M(sale)}</div>`), 300, 230), 30, 34);
    const sticker = add(stage, box(h('div', 'u1l9-stick', `<b>${d.pct}%</b>OFF`), 96, 96), 268, 6);
    const sv = add(tag, svgEl('svg', { width: 300, height: 230, class: 'u1l9-svg' }), 0, 0);
    const cut = svgEl('line', { x1: 40, y1: 150, x2: 262, y2: 98, stroke: '#c0392b', 'stroke-width': 9, 'stroke-linecap': 'round', 'stroke-dasharray': 240, 'stroke-dashoffset': 240 }, sv);
    const nw = hide(tag.querySelector('.new'));
    const coupon = hide(add(stage, box(cbox('u1l9-coupon', `You save <b>${M(disc)}</b>`), 260, 56), 50, 300));
    void sticker;
    // the work
    const X = 390, LW = W - X - 16;
    const L1 = line(stage, `Estimate: ${d.e1}`, X, 10, LW);
    const L2 = line(stage, d.e2, X, 54, LW);
    const L3 = line(stage, `Sale price about ${T(`${d.eR}-${d.eD}=\\$${eS}`)}.`, X, 98, LW);
    const L4 = line(stage, `Discount: ${T(`${r.toFixed(2)}\\times${d.reg.toFixed(2)}=${raw}`)}`, X, 166, LW, 44, 'cl');
    const L5 = line(stage, `Round to the cent: discount = <b>${M(disc)}</b>`, X, 212, LW, 44, 'cl');
    const L6 = hide(add(stage, box(cbox('u1l9-res', `Sale price: ${T(`${d.reg.toFixed(2)}-${disc.toFixed(2)}=\\$${sale.toFixed(2)}`)}`), LW, 54), X, 276));
    const st = hide(stamp(stage, `Close to $${eS} ✓`, { ok: true, x: X + LW / 2, y: 364, rotate: -4 }));
    return [
      { cap: `Estimate first: ${d.e1}`, run: (c) => c.fadeIn(L1) },
      { cap: d.e2, run: (c) => c.fadeIn(L2) },
      { cap: `Sale price about ${T(`${d.eR}-${d.eD}=\\$${eS}`)}.`, run: (c) => c.fadeIn(L3) },
      { cap: `<b>Discount = regular price × discount rate.</b> Change ${d.pct}% to ${r.toFixed(2)} first.`, run: (c) => c.fadeIn(L4) },
      { cap: `Round to the cent: the discount is <b>${M(disc)}</b>. That is the money you save.`, run: async (c) => { await c.fadeIn(L5); await c.anim(coupon, [{ opacity: 0, transform: 'translateY(-90px) rotate(-8deg)' }, { opacity: 1, transform: 'none' }], 600); } },
      { cap: `<b>Sale price = regular price − discount:</b> ${T(`${d.reg.toFixed(2)}-${disc.toFixed(2)}=\\$${sale.toFixed(2)}`)}. Slash the old price!`,
        run: async (c) => { await tween(c, 500, (t) => cut.setAttribute('stroke-dashoffset', 240 * (1 - t))); tag.classList.add('cut'); await c.pop(nw, 420); await c.pop(L6); } },
      { cap: `${M(sale)} is close to the estimate of $${eS} ✓`, run: (c) => stampIn(c, st) }
    ];
  }
};

/* =====================================================================================
 * 2. The percent you pay: cut the discount off the bar (the shortcut, Example 2)
 * ===================================================================================== */
const PB = {
  shoes: { ask: 'Example 2(b): running shoes, regularly <b>$124.50</b>, are <b>40% off</b>. Use the shortcut to find the sale price.', reg: 124.5, pct: 40 },
  phone: { ask: 'Example 2(c): a phone case, regularly <b>$18.99</b>, is <b>15% off</b>. Use the shortcut to find the sale price.', reg: 18.99, pct: 15 },
  jacket: { ask: 'Example 1 again: the <b>$139.99</b> jacket is <b>30% off</b>. Does the shortcut give the same sale price?', reg: 139.99, pct: 30, same: true }
};
const payBar = {
  title: 'Multiply by the percent you pay',
  height: 390,
  minW: 900,
  choices: [{ sep: 'Example 2 check:' }, { v: 'shoes', label: '(b) Shoes' }, { v: 'phone', label: '(c) Phone case' }, { sep: 'Example 1:' }, { v: 'jacket', label: 'Jacket, one step' }],
  ask: (k) => PB[k].ask,
  make(stage, k, ex) {
    const d = PB[k], W = ex.W, pay = 100 - d.pct, m = pay / 100, raw = clean(d.reg * m), sale = rnd(raw), rounds = Math.abs(raw - sale) > 1e-9;
    const L = 40, BW = W - 80, Y = 36, BH = 64, wp = BW * pay / 100;
    const payP = add(stage, box(h('div', 'u1l9-bar pay', `<span class="whole">Regular price ${M(d.reg)} = 100%</span><span class="lab">You pay <b>${pay}%</b></span>`), wp, BH), L, Y);
    const offP = add(stage, box(h('div', 'u1l9-bar off', `<span class="lab">${d.pct}% off</span>`), BW - wp, BH), L + wp, Y);
    const payLab = hide(payP.querySelector('.lab')), whole = payP.querySelector('.whole'), offLab = hide(offP.querySelector('.lab'));
    payP.classList.add('joined'); offP.classList.add('joined'); whole.style.width = (10000 / pay) + '%';
    // percent ruler
    const rs = add(stage, svgEl('svg', { width: W, height: 44, class: 'u1l9-svg' }), 0, Y + BH + 4);
    svgEl('line', { x1: L, y1: 6, x2: L + BW, y2: 6, stroke: '#6b5a40', 'stroke-width': 2 }, rs);
    for (let p = 0; p <= 100; p += 10) {
      const x = L + BW * p / 100; svgEl('line', { x1: x, y1: 0, x2: x, y2: 12, stroke: '#6b5a40', 'stroke-width': 2 }, rs);
      const t = svgEl('text', { x, y: 34, 'text-anchor': 'middle', class: 'u1l9-rt' + (p === pay ? ' hl' : '') }, rs); t.textContent = p + '%';
    }
    hide(rs);
    const ex1 = line(stage, `${T(`${pay}\\%=${m.toFixed(2)}`)}, so multiply by ${T(m.toFixed(2))}: &nbsp;${T(`${d.reg.toFixed(2)}\\times${m.toFixed(2)}`)}`, L, 256, BW * 0.64, 50, 'big');
    const lcd = hide(add(stage, box(h('div', 'u1l9-lcd', `<div class="e">${d.reg.toFixed(2)}×${m.toFixed(2)}</div><div class="r">${raw}</div>`), 250, 66), W - L - 250, 248));
    const res = hide(add(stage, box(cbox('u1l9-res', `Sale price: <b>${M(sale)}</b>${d.same ? ' &nbsp;(Example 1: $97.99 ✓)' : ''}`), 560, 54), (W - 560) / 2, 326));
    const steps = [
      { cap: `The regular price is the whole bar: <b>${M(d.reg)} = 100%</b>.`, run: (c) => c.fadeIn(rs) },
      { cap: `${d.pct}% off: cut the last <b>${d.pct}%</b> off the bar. That part is the discount.`,
        run: async (c) => { await c.anim(whole, [{ opacity: 1 }, { opacity: 0 }], 250); payP.classList.remove('joined'); offP.classList.remove('joined'); await c.anim(offP, [{ transform: 'none' }, { transform: 'translate(16px, 132px) rotate(3deg)' }], 700); await c.fadeIn(offLab); } },
      { cap: `What is left is what you pay: ${T(`100\\%-${d.pct}\\%=${pay}\\%`)}.`, run: (c) => c.pop(payLab) },
      { cap: `${T(`${pay}\\%=${m.toFixed(2)}`)}, so multiply the regular price by <b>${m.toFixed(2)}</b>.`, run: (c) => c.fadeIn(ex1) },
      { cap: rounds ? `The calculator shows <b>${raw}</b>. Round to the cent: <b>${M(sale)}</b>.` : `The calculator shows <b>${raw}</b>: the sale price is <b>${M(sale)}</b>.`, run: async (c) => { await c.pop(lcd); await c.pop(res); } }
    ];
    if (d.same) steps.push({ cap: 'One step, and the same sale price as Example 1 ✓', run: (c) => pulse(c, res, 1.06) });
    return steps;
  }
};

/* =====================================================================================
 * 3. Example 3 on the receipt (Full notes)
 * ===================================================================================== */
const RC = {
  carpet: { ask: 'Example 3(a): carpet cleaning is <b>$89.00 per room</b>. Book 4 or more rooms and get <b>12% off</b> the whole bill. What do 5 rooms cost (before tax)?',
    sign: '<b>Carpet Cleaning</b>$89.00 per room<i>Book 4+ rooms:<br>12% off the whole bill</i>', shop: 'SPARKLE CARPET CARE',
    rows: [
      { l: '5 rooms × $89.00', r: '445.00', cap: `Regular bill: ${T('5\\times89.00=\\$445.00')}.` },
      { l: '12% off → you pay 88%', r: '', cap: '5 rooms is 4 or more, so take 12% off the whole bill: you pay <b>88%</b>.', note: true },
      { l: '445.00 × 0.88', r: '391.60', cap: `${T('445.00\\times0.88=\\$391.60')}.` }
    ], total: 391.6, end: '5 rooms cost <b>$391.60</b> before tax.' },
  tools: { ask: 'Example 3(b): “Tool Days”: hand tools <b>20% off</b>, power tools <b>15% off</b>. Ali buys a hammer ($24.99) and a drill ($149.00). What is his total before tax?',
    sign: '<b>TOOL DAYS</b>Hand tools 20% off<i>Power tools 15% off</i>', shop: 'HARDWARE STORE',
    rows: [
      { l: 'Hammer $24.99 · hand tool', r: '', cap: 'The hammer is a <b>hand tool</b>: 20% off, so you pay 80%.', note: true },
      { l: '&nbsp; 24.99 × 0.80', r: '19.992', cap: `${T('24.99\\times0.80=19.992')}. Keep all the decimals for now.` },
      { l: 'Drill $149.00 · power tool', r: '', cap: 'The drill is a <b>power tool</b>: 15% off, so you pay 85%.', note: true },
      { l: '&nbsp; 149.00 × 0.85', r: '126.65', cap: `${T('149.00\\times0.85=126.65')}.` },
      { l: '19.992 + 126.65', r: '146.642', cap: `Add them: ${T('19.992+126.65=146.642')}.` }
    ], total: 146.64, end: 'Round to the cent only at the end: Ali pays <b>$146.64</b> before tax.' }
};
const receipt = {
  title: 'Print the receipt',
  height: 420,
  minW: 900,
  choices: [{ sep: 'Example 3 check:' }, { v: 'carpet', label: '(a) Carpet cleaning' }, { v: 'tools', label: '(b) Tool Days' }],
  ask: (k) => RC[k].ask,
  make(stage, k, ex) {
    const d = RC[k], W = ex.W, X = 300, RW = Math.min(560, W - X - 30);
    add(stage, box(h('div', 'u1l9-shop', d.sign), 240, 190), 24, 20);
    const paper = add(stage, box(h('div', 'u1l9-rcpt', `<div class="hd">${d.shop}</div>`), RW, 404), X, 6);
    const rows = d.rows.map((r) => hide(add(paper, h('div', 'u1l9-rr' + (r.note ? ' note' : ''), `<span>${r.l}</span><b>${r.r}</b>`))));
    const tot = hide(add(paper, h('div', 'u1l9-rr tot', `<span>TOTAL (before tax)</span><b>$${d.total.toFixed(2)}</b>`)));
    const st = hide(stamp(stage, 'PAID', { ok: true, x: X + RW - 90, y: 360, rotate: -12 }));
    return [
      ...d.rows.map((r, i) => ({ cap: r.cap, run: (c) => c.anim(rows[i], [{ opacity: 0, transform: 'translateY(-10px)' }, { opacity: 1, transform: 'none' }], 380) })),
      { cap: d.end, run: async (c) => { await c.pop(tot); await stampIn(c, st); } }
    ];
  }
};

/* =====================================================================================
 * 4. Percent decrease: the decrease out of the ORIGINAL price (Example 4)
 * ===================================================================================== */
const PD = {
  headset: { ask: 'Example 4(a): a gaming headset goes from <b>$80.00</b> to <b>$60.00</b>. Find the percent decrease.', o: 80, n: 60 },
  truck: { ask: 'Example 4(b): a used truck is listed for <b>$18&#8239;500</b> but sells for <b>$15&#8239;900</b>. Find the percent decrease (nearest tenth of a percent).', o: 18500, n: 15900, big: true }
};
const pctDrop = {
  title: 'How much off was it?',
  height: 400,
  minW: 900,
  choices: [{ sep: 'Example 4 check:' }, { v: 'headset', label: '(a) Headset' }, { v: 'truck', label: '(b) Truck' }],
  ask: (k) => PD[k].ask,
  make(stage, k, ex) {
    const d = PD[k], W = ex.W, dec = d.o - d.n, pct = dec / d.o * 100, p1 = rnd(pct, 1), exact = Math.abs(pct - Math.round(pct)) < 1e-9;
    const tx = (v) => (d.big ? String(v).replace(/(\d)(\d{3})$/, '$1\\,$2') : v.toFixed(2));    // 18\,500 or 80.00
    const L = 170, BW = W - L - 40, fr = d.n / d.o;
    add(stage, box(h('div', 'u1l9-blab', `Before<b>${M(d.o)}</b>`), 140, 64), 16, 22);
    add(stage, box(h('div', 'u1l9-bar pay solo'), BW, 56), L, 26);
    add(stage, box(h('div', 'u1l9-blab', `After<b>${M(d.n)}</b>`), 140, 64), 16, 104);
    const after = add(stage, box(h('div', 'u1l9-bar sale solo'), BW, 56), L, 108);
    const gap = hide(add(stage, box(cbox('u1l9-gapp', `${BW * (1 - fr) > 170 ? 'decrease ' : ''}<b>${M(dec)}</b>`), BW * (1 - fr), 56), L + BW * fr, 108));
    // percent ruler under the bars
    const rs = hide(add(stage, svgEl('svg', { width: W, height: 70, class: 'u1l9-svg' }), 0, 172));
    svgEl('line', { x1: L, y1: 8, x2: L + BW, y2: 8, stroke: '#6b5a40', 'stroke-width': 2 }, rs);
    for (let p = 0; p <= 100; p += 10) {
      const x = L + BW * p / 100; svgEl('line', { x1: x, y1: 2, x2: x, y2: 14, stroke: '#6b5a40', 'stroke-width': 2 }, rs);
      const t = svgEl('text', { x, y: 34, 'text-anchor': 'middle', class: 'u1l9-rt' }, rs); t.textContent = p + '%';
    }
    const rlab = svgEl('text', { x: 40, y: 34, class: 'u1l9-rt b' }, rs); rlab.textContent = 'of the original';
    const brk = svgEl('path', { d: `M${L + BW * fr} 44 v12 H${L + BW} v-12`, fill: 'none', stroke: '#c0392b', 'stroke-width': 3 }, rs); hide(brk);
    const bl = svgEl('text', { x: L + BW * (1 + fr) / 2, y: 70, 'text-anchor': 'middle', class: 'u1l9-rt red' }, rs); bl.textContent = (exact ? '' : '≈ ') + (exact ? pct : p1) + '%'; hide(bl);
    const s1 = line(stage, `Step 1: ${T(`\\text{decrease}=${tx(d.o)}-${tx(d.n)}=\\$${d.big ? tx(dec) : dec.toFixed(2)}`)}`, L, 252, BW, 46, 'big');
    const s2 = line(stage, `Step 2: ${T(`\\dfrac{${d.big ? tx(dec) : dec.toFixed(2)}}{${tx(d.o)}}\\times100=${exact ? pct + '\\%' : pct.toFixed(2) + '\\ldots'}`)}`, L, 302, BW, 62, 'big');
    const res = hide(add(stage, box(cbox('u1l9-res', `The price dropped by ${exact ? '' : 'about '}<b>${exact ? pct : p1}%</b>.`), 420, 46), W - 440, 350));
    return [
      { cap: `Before: <b>${M(d.o)}</b>. After: <b>${M(d.n)}</b>. The price went down.`, run: (c) => tween(c, 900, (t) => { after.style.width = lerp(BW, BW * fr, t) + 'px'; }) },
      { cap: `Step 1: the amount of decrease is ${T(`${tx(d.o)}-${tx(d.n)}=\\$${d.big ? tx(dec) : dec.toFixed(2)}`)}.`, run: async (c) => { await c.pop(gap); await c.fadeIn(s1); } },
      { cap: `Step 2: compare the decrease with the <b>original</b> price: decrease ÷ original × 100.`, run: async (c) => { await c.fadeIn(rs); await c.fadeIn(s2); } },
      { cap: exact ? `The decrease is <b>${pct}%</b> of the original price. The price dropped by <b>${pct}%</b>.` : `${pct.toFixed(2)}… rounds to <b>${p1}%</b> (nearest tenth). The price dropped by about <b>${p1}%</b>.`,
        run: async (c) => { await c.fadeIn(brk); await c.pop(bl); await c.pop(res); } }
    ];
  }
};

/* =====================================================================================
 * 5. Divide by the original, not the sale price (Full notes)
 * ===================================================================================== */
const WB = {
  headset: { ask: 'Example 4(a): a headset goes from <b>$80.00</b> to <b>$60.00</b>. Which division gives the percent off?', o: 80, n: 60 },
  shirt: { ask: 'A shirt goes from <b>$50.00</b> to <b>$40.00</b>. Which division gives the percent off?', o: 50, n: 40 }
};
const wrongBase = {
  title: 'Out of the original price',
  height: 380,
  minW: 900,
  choices: [{ sep: 'Example 4:' }, { v: 'headset', label: '(a) Headset' }, { sep: 'More:' }, { v: 'shirt', label: '$50 → $40' }],
  ask: (k) => WB[k].ask,
  make(stage, k, ex) {
    const d = WB[k], W = ex.W, CW = (W - 100) / 2, dec = d.o - d.n;
    const ok = dec / d.o * 100, bad = dec / d.n * 100, badR = rnd(bad, 1), badEx = Math.abs(bad - Math.round(bad)) < 1e-9;
    const badPrice = rnd(d.o - d.o * bad / 100);
    const top = hide(add(stage, box(cbox('u1l9-band', `Decrease: ${T(`${d.o.toFixed(2)}-${d.n.toFixed(2)}=\\$${dec.toFixed(2)}`)}`), 520, 46), (W - 520) / 2, 4));
    const col = (x, good) => {
      const pc = good ? ok : bad, pcs = good ? `${ok}\\%` : (badEx ? `${bad}\\%` : `${badR}\\%`);
      const head = add(stage, box(cbox('u1l9-wh ' + (good ? 'ok' : 'no'), good ? 'Divide by the <b>original</b> price' : 'Divide by the <b>sale</b> price'), CW, 40), x, 64);
      const f = add(stage, box(cbox('u1l9-wf', T(`\\dfrac{${dec.toFixed(2)}}{${(good ? d.o : d.n).toFixed(2)}}\\times100${badEx || good ? '=' : '\\approx'}${pcs}`)), CW, 82), x, 112);
      const price = good ? d.n : badPrice;
      const chk = add(stage, box(h('div', 'u1l9-wc', `Check: ${good ? ok : (badEx ? bad : badR)}% off ${M(d.o)}<br>${good ? T(`${d.o.toFixed(2)}\\times${(1 - ok / 100).toFixed(2)}=\\$${d.n.toFixed(2)}`) : `${M(d.o)} − ${M(d.o * pc / 100)} = ${M(price)}`}${good ? ' ✓' : `, not ${M(d.n)} ✗`}`), CW, 80), x, 206);
      const st = stamp(stage, good ? 'Checks out ✓' : 'Doesn’t check ✗', { ok: good, x: x + CW / 2, y: 330, rotate: good ? -6 : 6 });
      return [head, f, chk, st].map((e) => hide(e));
    };
    const A = col(40, true), B = col(60 + CW, false);
    return [
      { cap: `The decrease is ${T(`\\$${dec.toFixed(2)}`)}. Now divide it by which price?`, run: (c) => c.fadeIn(top) },
      { cap: `Out of the <b>original</b> price: ${T(`\\dfrac{${dec}}{${d.o}}\\times100=${ok}\\%`)}.`, run: async (c) => { await c.fadeIn(A[0]); await c.pop(A[1]); } },
      { cap: `Check: ${ok}% off ${M(d.o)} gives ${M(d.n)}, the real sale price.`, run: async (c) => { await c.fadeIn(A[2]); await stampIn(c, A[3]); } },
      { cap: `Out of the sale price: ${T(`\\dfrac{${dec}}{${d.n}}\\times100${badEx ? '=' : '\\approx'}${badEx ? bad : badR}\\%`)}.`, run: async (c) => { await c.fadeIn(B[0]); await c.pop(B[1]); } },
      { cap: `${badEx ? bad : badR}% off ${M(d.o)} would give ${M(badPrice)}, not ${M(d.n)}. <b>Divide by the original price.</b>`, run: async (c) => { await c.fadeIn(B[2]); await stampIn(c, B[3]); } }
    ];
  }
};

/* =====================================================================================
 * 6. The sale machine, then the tax machine (Examples 5 and 6)
 * ===================================================================================== */
const TX = {
  blender: { ask: 'Example 5: in Calgary, a blender is regularly <b>$84.00</b>. It is on sale for <b>35% off</b>. GST is 5%. Find the sale price, the GST and the total cost.', item: 'Blender', reg: 84, pct: 35, tax: 5, tname: 'GST 5%' },
  tent: { ask: 'Example 6: in Kelowna, BC, a tent is regularly <b>$260.00</b>. It is <b>25% off</b>. BC charges 5% GST and 7% PST. Find the sale price, the total, and how much Priya saves.', item: 'Tent', reg: 260, pct: 25, tax: 12, tname: 'GST + PST', bc: true }
};
const taxMachine = {
  title: 'Discount first, then the tax',
  height: 430,
  minW: 900,
  choices: [{ sep: 'Example check:' }, { v: 'blender', label: '5 Blender (AB)' }, { v: 'tent', label: '6 Tent (BC)' }],
  ask: (k) => TX[k].ask,
  make(stage, k, ex) {
    const d = TX[k], W = ex.W, m1 = (100 - d.pct) / 100, m2 = 1 + d.tax / 100;
    const sale = rnd(d.reg * m1), tAmt = rnd(sale * d.tax / 100), total = rnd(sale * m2), regT = rnd(d.reg * m2), save = rnd(regT - total), sp = rnd(save / regT * 100, 1);
    const SW = (W - 40 - 4 * 34) / 5, xs = [0, 1, 2, 3, 4].map((i) => 20 + i * (SW + 34)), Y = 30, HH = 120;
    const mkTag = (i, lab, v, cls) => add(stage, box(h('div', 'u1l9-mtag ' + cls, `<small>${lab}</small><b>${M(v)}</b>`), SW, HH), xs[i], Y);
    const mach = (i, top, sub) => add(stage, box(h('div', 'u1l9-mach', `<small>${top}</small><b>${sub}</b><i></i>`), SW, HH), xs[i], Y);
    mkTag(0, `${d.item} · regular`, d.reg, 'reg');
    const M1 = mach(1, `${d.pct}% OFF`, `× ${m1.toFixed(2)}`), M2 = mach(3, d.tname, `× ${m2.toFixed(2)}`);
    const tB = hide(mkTag(2, 'Sale price', sale, 'sale')), tC = hide(mkTag(4, 'Total cost', total, 'tot'));
    const ar = add(stage, svgEl('svg', { width: W, height: HH, class: 'u1l9-svg' }), 0, Y);
    [0, 1, 2, 3].forEach((i) => { const x = xs[i] + SW + 4; svgEl('path', { d: `M${x} ${HH / 2} h24 m-9 -8 l9 8 l-9 8`, fill: 'none', stroke: '#9a6a24', 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, ar); });
    const X = 40, LW = W - 80, dx = SW + 34;
    let lines, steps;
    if (!d.bc) {
      lines = [
        line(stage, `(a) Sale price: ${T(`${d.reg.toFixed(2)}\\times${m1.toFixed(2)}=\\$${D(sale)}`)}`, X, 176, LW),
        line(stage, `(b) GST: ${T(`${D(sale)}\\times0.05=\\$${D(tAmt)}`)} &nbsp;<span class="muted">(5% of the <b>sale</b> price)</span>`, X, 224, LW),
        line(stage, `(c) Total: ${T(`${D(sale)}+${D(tAmt)}=\\$${D(total)}`)}`, X, 272, LW),
        hide(add(stage, box(cbox('u1l9-res', `One line: ${T(`${d.reg}\\times${m1.toFixed(2)}\\times${m2.toFixed(2)}=${D(total)}`)} ✓`), 560, 54), (W - 560) / 2, 340))
      ];
      steps = [
        { cap: `(a) Discount first: ${d.pct}% off, so you pay ${100 - d.pct}%: ${T(`${d.reg.toFixed(2)}\\times${m1.toFixed(2)}=\\$${D(sale)}`)}.`, run: async (c) => { await Promise.all([pulse(c, M1, 1.08, 600), slideIn(c, tB, dx)]); await c.fadeIn(lines[0]); } },
        { cap: `(b) The GST is 5% of the <b>sale</b> price: ${T(`${D(sale)}\\times0.05=\\$${D(tAmt)}`)}.`, run: (c) => c.fadeIn(lines[1]) },
        { cap: `(c) Total: ${T(`${D(sale)}+${D(tAmt)}=\\$${D(total)}`)}. Adding 5% is the same as × 1.05.`, run: async (c) => { await Promise.all([pulse(c, M2, 1.08, 600), slideIn(c, tC, dx)]); await c.fadeIn(lines[2]); } },
        { cap: `Check in one line: ${T(`${d.reg}\\times${m1.toFixed(2)}\\times${m2.toFixed(2)}=${D(total)}`)} ✓`, run: (c) => c.pop(lines[3]) }
      ];
    } else {
      lines = [
        line(stage, `(a) Sale price: ${T(`${d.reg.toFixed(2)}\\times${m1.toFixed(2)}=\\$${D(sale)}`)}`, X, 170, LW / 2),
        line(stage, `Tax: ${T('5\\%+7\\%=12\\%')}, so × 1.12`, X + LW / 2, 170, LW / 2),
        line(stage, `(b) Total: ${T(`${D(sale)}\\times1.12=\\$${D(total)}`)}`, X, 216, LW),
        line(stage, `(c) Regular price with tax: ${T(`${d.reg.toFixed(2)}\\times1.12=\\$${D(regT)}`)} &nbsp;·&nbsp; Savings: ${T(`${D(regT)}-${D(total)}=\\$${D(save)}`)}`, X, 262, LW),
        hide(add(stage, box(cbox('u1l9-res', `(d) ${T(`\\dfrac{${D(save)}}{${D(regT)}}\\times100=${sp}\\%`)}: the same as the discount rate`), 640, 70), (W - 640) / 2, 326))
      ];
      steps = [
        { cap: `(a) ${d.pct}% off: you pay ${100 - d.pct}%: ${T(`${d.reg.toFixed(2)}\\times${m1.toFixed(2)}=\\$${D(sale)}`)}.`, run: async (c) => { await Promise.all([pulse(c, M1, 1.08, 600), slideIn(c, tB, dx)]); await c.fadeIn(lines[0]); } },
        { cap: 'BC tax: 5% GST + 7% PST = <b>12%</b>, so multiply by <b>1.12</b>.', run: async (c) => { await pulse(c, M2, 1.1, 600); await c.fadeIn(lines[1]); } },
        { cap: `(b) Tax on the sale price: ${T(`${D(sale)}\\times1.12=\\$${D(total)}`)}.`, run: async (c) => { await slideIn(c, tC, dx); await c.fadeIn(lines[2]); } },
        { cap: `(c) At the regular price she would pay ${T(`${d.reg.toFixed(2)}\\times1.12=\\$${D(regT)}`)}. She saves <b>${M(save)}</b>.`, run: (c) => c.fadeIn(lines[3]) },
        { cap: `(d) ${T(`${D(save)}\\div${D(regT)}\\times100=${sp}\\%`)}: the same as the discount rate. Tax does not change the percent saved.`, run: (c) => c.pop(lines[4]) }
      ];
    }
    return steps;
  }
};

/* =====================================================================================
 * 7. 30% off or $25 off? The savings graph (Example 7)
 * ===================================================================================== */
const BE = {
  a: { ask: 'Example 7(a): jeans are regularly <b>$60.00</b>. Which gives the lower price: <b>30% OFF</b> or <b>$25 OFF</b>?', p: 60, item: 'Jeans' },
  b: { ask: 'Example 7(b): a jacket is regularly <b>$120.00</b>. Which gives the lower price: <b>30% OFF</b> or <b>$25 OFF</b>?', p: 120, item: 'Jacket' },
  c: { ask: 'Example 7(c): boots are regularly <b>$85.00</b>. Which gives the lower price: <b>30% OFF</b> or <b>$25 OFF</b>?', p: 85, item: 'Boots' },
  even: { ask: 'Example 7: at what regular price do <b>30% OFF</b> and <b>$25 OFF</b> give the same price?', p: 25 / 0.3, item: 'Break-even' }
};
const breakEven = {
  title: '30% off or $25 off? Compare the savings',
  height: 420,
  minW: 940,
  choices: [{ sep: 'Example 7 check:' }, { v: 'a', label: '(a) Jeans $60' }, { v: 'b', label: '(b) Jacket $120' }, { v: 'c', label: '(c) Boots $85' }, { v: 'even', label: 'When are they equal?' }],
  ask: (k) => BE[k].ask,
  make(stage, k, ex) {
    const d = BE[k], W = ex.W, p = d.p, s30 = rnd(0.3 * p), pay30 = rnd(p - s30), pay25 = rnd(p - 25), even = k === 'even';
    const G = new Graph(stage, { x: 4, y: 6, width: 540, height: 404, xmin: 0, xmax: 150, ymin: 0, ymax: 50, xstep: 10, ystep: 5, xlabels: 20, ylabels: 10, xtitle: '\\text{price (\\$)}', ytitle: '\\text{saved (\\$)}', arrows: false });
    const flat = hide(G.segment([0, 25], [150, 25], { color: 'blue', width: 4 }));
    const rise = hide(G.segment([0, 0], [150, 45], { color: 'orange', width: 4 }));
    const lf = hide(G.label(140, 25, '<b>$25 off</b>', { pos: 'n', cls: 'u1l9-gl blue' }));
    const lr = hide(G.label(132, 39.6, '<b>30% off</b>', { pos: 'nw', cls: 'u1l9-gl orange' }));
    // right panel: the two signs
    const PX = 566, PW = W - PX - 10;
    const card = (y, cls, sign, sv, pay) => add(stage, box(h('div', 'u1l9-pc ' + cls, `<span class="u1l9-sg">${sign}</span><span class="u1l9-sv">saves <b>${M(sv)}</b></span><div class="u1l9-py">you pay <b>${M(pay)}</b></div>`), PW, 100), PX, y);
    const head = add(stage, box(cbox('u1l9-ph', even ? 'Where do the lines cross?' : `${d.item}: <b>${M(p)}</b>`), PW, 44), PX, 10);
    const c30 = card(64, 'o', '30% OFF', s30, pay30), c25 = card(184, 'b', '$25 OFF', 25, pay25);
    [c30, c25].forEach((cd) => { hide(cd.querySelector('.u1l9-sv'), cd.querySelector('.u1l9-py')); });
    const win = even ? null : pay30 < pay25 ? c30 : c25, diff = rnd(Math.abs(pay30 - pay25));
    const st = hide(stamp(stage, even ? 'SAME PRICE' : 'LOWER PRICE', { ok: even ? null : true, x: PX + PW - 78, y: win === c25 ? 262 : 142, rotate: -8, size: 'sm' }));
    const res = hide(add(stage, box(cbox('u1l9-res sm', even ? `Below ${M(p)}: take $25 off.<br>Above ${M(p)}: take 30% off.` : `<b>${win === c30 ? '30% off' : '$25 off'}</b> is better${k === 'c' ? `, by ${M(diff)}` : ''}.`), PW, even ? 84 : 56), PX, 312));
    const steps = [
      { cap: '<b>$25 off</b> saves $25 at <b>any</b> price: a flat line.', run: async (c) => { flat.style.opacity = 1; await G.drawIn(flat, 700, c); await c.fadeIn(lf); } },
      { cap: '<b>30% off</b> saves 30% of the price, so it saves <b>more</b> when the price is bigger.', run: async (c) => { rise.style.opacity = 1; await G.drawIn(rise, 800, c); await c.fadeIn(lr); } }
    ];
    if (!even) {
      let vl, d1, d2;
      steps.push({ cap: `${d.item}, ${M(p)}: 30% off saves ${T(`0.30\\times${p}=\\$${D(s30)}`)}. $25 off saves $25.`,
        run: async (c) => {
          vl = G.segment([p, 0], [p, Math.max(25, 0.3 * p)], { color: 'slate', dash: '6 6', width: 2 }); await G.drawIn(vl, 400, c);
          d1 = G.point(p, 0.3 * p, { color: 'orange', r: 7 }); d2 = G.point(p, 25, { color: 'blue', r: 7 }); await Promise.all([G.reveal(d1, c), G.reveal(d2, c)]);
          await Promise.all([c.fadeIn(c30.querySelector('.u1l9-sv')), c.fadeIn(c25.querySelector('.u1l9-sv'))]);
        } });
      steps.push({ cap: `You pay ${T(`${p}-${D(s30)}=\\$${D(pay30)}`)} or ${T(`${p}-25=\\$${D(pay25)}`)}. <b>${win === c30 ? '30% off' : '$25 off'}</b> is better${k === 'c' ? `, by ${M(diff)}` : ''}.`,
        run: async (c) => { await Promise.all([c.fadeIn(c30.querySelector('.u1l9-py')), c.fadeIn(c25.querySelector('.u1l9-py'))]); win.classList.add('win'); await stampIn(c, st); await c.fadeIn(res); } });
    } else {
      steps.push({ cap: `The lines cross where 30% of the price is $25: ${T('25\\div0.30\\approx\\$83.33')}.`,
        run: async (c) => {
          const vl = G.segment([p, 0], [p, 25], { color: 'slate', dash: '6 6', width: 2 }); await G.drawIn(vl, 400, c);
          const pt = G.point(p, 25, { color: 'ink', r: 7 }); await G.reveal(pt, c);
          const lb = G.label(p, 0, '<b>$83.33</b>', { pos: 'n', cls: 'u1l9-gl ink', dy: -4 }); await c.pop(lb);
          await Promise.all([c.fadeIn(c30.querySelector('.u1l9-sv')), c.fadeIn(c25.querySelector('.u1l9-sv')), c.fadeIn(c30.querySelector('.u1l9-py')), c.fadeIn(c25.querySelector('.u1l9-py'))]);
          await stampIn(c, st);
        } });
      steps.push({ cap: 'Below $83.33, <b>$25 off</b> saves more. Above $83.33, <b>30% off</b> saves more.',
        run: async (c) => {
          const [x0, y0] = G.toPx(0, 0), [xm] = G.toPx(p, 0), [x1, y1] = G.toPx(150, 50);
          const a = svgEl('rect', { x: x0, y: y1, width: xm - x0, height: y0 - y1, fill: '#1f5bd6', 'fill-opacity': 0.08 }, G.layers.bg);
          const b = svgEl('rect', { x: xm, y: y1, width: x1 - xm, height: y0 - y1, fill: '#e0841a', 'fill-opacity': 0.1 }, G.layers.bg);
          await Promise.all([c.fadeIn(a, 400, { from: 'none' }), c.fadeIn(b, 400, { from: 'none' })]); await c.fadeIn(res);
        } });
    }
    void head;
    return steps;
  }
};

/* =====================================================================================
 * 8. Buy one, get one: the percent saved out of everything you take home (Example 8)
 * ===================================================================================== */
const SHIRT = '<path d="M30 6 L12 14 L2 34 L18 42 L22 34 L22 86 L78 86 L78 34 L82 42 L98 34 L88 14 L70 6 Q50 20 30 6 Z" stroke-width="3" stroke-linejoin="round"/>';
const shirtAt = (stage, x, y, w, col) => { const s = add(stage, svgEl('svg', { viewBox: '0 0 100 90', width: w, height: w * 0.9, class: 'u1l9-shirt' }), x, y); s.innerHTML = SHIRT; s.firstChild.setAttribute('fill', col); s.firstChild.setAttribute('stroke', '#4a3010'); return s; };
const BG = {
  A: { name: 'Store A', deal: 'Buy one, get the second half price', tags: [22, 11], notes: ['', 'half price'], pay: 33, reg: 44, n: 2, save: 11, pct: '25\\%', pctT: '25%', pv: 25 },
  B: { name: 'Store B', deal: 'Buy 2, get 1 free', tags: [22, 22, 0], notes: ['', '', 'FREE'], pay: 44, reg: 66, n: 3, save: 22, pct: '33.3\\%', pctT: '33.3%', pv: 100 / 3, approx: true }
};
const bogo = {
  title: 'What do you take home?',
  height: 420,
  minW: 920,
  choices: [{ sep: 'Example 8 check:' }, { v: 'A', label: '(a) Store A' }, { v: 'B', label: '(b) Store B' }, { v: 'C', label: '(c) Which is better?' }],
  ask: (k) => (k === 'C' ? 'Example 8(c): Store A saves 25% and Store B saves 33.3%. Which is the better deal? Think about more than the price.' : `Example 8(${k === 'A' ? 'a' : 'b'}): T-shirts are regularly <b>$22.00</b> each. ${BG[k].name}: <b>${BG[k].deal}</b>. Find the cost of ${BG[k].n} shirts and the percent saved.`),
  make(stage, k, ex) {
    const W = ex.W;
    const panel = (s, x, w, small) => {
      const d = BG[s], el = {};
      add(stage, box(cbox('u1l9-sh', `<b>${d.name}:</b> ${d.deal}`), w, 40), x, 4);
      const sw = small ? 96 : 120, gapx = small ? 22 : 40, tot = d.n * sw + (d.n - 1) * gapx, x0 = x + (w - tot) / 2;
      el.shirts = d.tags.map((v, i) => {
        const sx = x0 + i * (sw + gapx), s2 = shirtAt(stage, sx, 52, sw, ['#4f8fd6', '#d65f4f', '#4fb07a'][i]);
        const tg = add(stage, box(h('div', 'u1l9-stg' + (v === 0 ? ' free' : v < 22 ? ' half' : ''), v === 0 ? 'FREE' : M(v) + (d.notes[i] ? `<small>${d.notes[i]}</small>` : '')), sw, small ? 44 : 50), sx, 52 + sw * 0.9 + 6);
        return [s2, tg];
      });
      el.l1 = line(stage, `Pay: ${s === 'A' ? T('22.00+11.00=\\$33.00') : T('2\\times22.00=\\$44.00')}`, x + 10, small ? 222 : 238, w - 20, 40, small ? 'sm' : '');
      el.l2 = line(stage, `Regular for all ${d.n}: ${T(`${d.n}\\times22.00=\\$${d.reg}.00`)}; saved ${M(d.save)}`, x + 10, small ? 262 : 280, w - 20, 40, small ? 'sm' : '');
      const MW = w - 40;
      el.meter = hide(add(stage, box(h('div', 'u1l9-meter', `<i style="width:${d.pv}%"></i><span>${small ? `<b>${d.pctT}</b> saved` : `${T(`\\dfrac{${d.save}.00}{${d.reg}.00}\\times100${d.approx ? '\\approx' : '='}${d.pct}`)} saved`}</span>`), MW, small ? 50 : 62), x + 20, small ? 310 : 330));
      return el;
    };
    if (k !== 'C') {
      const d = BG[k], P = panel(k, 20, W - 40, false);
      P.shirts.forEach((p) => hide(...p));
      return [
        { cap: k === 'A' ? `${d.name}: buy one shirt at <b>$22.00</b>. The second shirt is <b>half price</b>: ${T('22.00\\div2=\\$11.00')}.` : `${d.name}: pay for 2 shirts at <b>$22.00</b> each, and the 3rd shirt is <b>free</b>.`,
          run: async (c) => { for (const [s2, tg] of P.shirts) { await c.pop(s2, 320); await c.pop(tg, 300); } } },
        { cap: `You pay ${k === 'A' ? T('22.00+11.00=\\$33.00') : T('2\\times22.00=\\$44.00')} for ${d.n} shirts.`, run: (c) => c.fadeIn(P.l1) },
        { cap: `You take home ${d.n} shirts. Their regular price: ${T(`${d.n}\\times22.00=\\$${d.reg}.00`)}. You save <b>${M(d.save)}</b>.`, run: (c) => c.fadeIn(P.l2) },
        { cap: `Percent saved: ${T(`\\dfrac{${d.save}.00}{${d.reg}.00}\\times100${d.approx ? '\\approx' : '='}${d.pct}`)}.`, run: async (c) => { const bar = P.meter.querySelector('i'); await c.fadeIn(P.meter); await c.anim(bar, [{ width: '0%' }, { width: d.pv + '%' }], 700); } }
      ];
    }
    const w = (W - 60) / 2, A = panel('A', 20, w, true), B = panel('B', 40 + w, w, true);
    [A, B].forEach((P) => { P.l1.style.opacity = 1; P.l2.style.opacity = 1; P.meter.style.opacity = 1; });
    const sB = hide(stamp(stage, 'Best if you want 3', { ok: true, x: 40 + w + w / 2, y: 392, rotate: -4, size: 'sm' }));
    const sA = hide(stamp(stage, 'Best if you need 2', { ok: true, x: 20 + w / 2, y: 392, rotate: 4, size: 'sm' }));
    return [
      { cap: 'Store A saves <b>25%</b>. Store B saves <b>33.3%</b>, a bigger percent.', run: async (c) => { await Promise.all([pulse(c, A.meter, 1.04), pulse(c, B.meter, 1.04)]); } },
      { cap: 'If you want 3 shirts, <b>Store B</b> is the better deal.', run: (c) => stampIn(c, sB) },
      { cap: 'If you only need 2, <b>Store A</b> is better: you spend $33.00 instead of $44.00, and you don’t buy a shirt you don’t need.', run: (c) => stampIn(c, sA) }
    ];
  }
};

/* =====================================================================================
 * 9. A discount on a discount: 100 squares (Example 9)
 * ===================================================================================== */
const SK = {
  boots: { ask: 'Example 9: hiking boots are regularly <b>$150.00</b>. They are <b>20% off</b>, with an <b>extra 10% off</b> at the till. Find the final price and the total percent off.', item: 'Boots', reg: 150, a: 20, b: 10 },
  hoodie: { ask: 'A hoodie is regularly <b>$90.00</b>. It is <b>30% off</b>, with an <b>extra 10% off</b>. What is the total percent off?', item: 'Hoodie', reg: 90, a: 30, b: 10 },
  half: { ask: 'Sneakers are regularly <b>$120.00</b>. They are <b>50% off</b>, then an <b>extra 50% off</b>. Are they free?', item: 'Sneakers', reg: 120, a: 50, b: 50 }
};
const stack = {
  title: 'Two discounts don’t add',
  height: 430,
  minW: 920,
  choices: [{ sep: 'Example 9 check:' }, { v: 'boots', label: 'Boots: 20% + extra 10%' }, { sep: 'More:' }, { v: 'hoodie', label: '30% + extra 10%' }, { v: 'half', label: '50% + extra 50%' }],
  ask: (k) => SK[k].ask,
  make(stage, k, ex) {
    const d = SK[k], W = ex.W, left1 = 100 - d.a, k2 = left1 * d.b / 100, left2 = left1 - k2, tot = 100 - left2, m1 = left1 / 100, m2 = (100 - d.b) / 100;
    const p1 = rnd(d.reg * m1), p2 = rnd(p1 * m2), U = 32, GX = 30, GY = 44;
    const sv = add(stage, svgEl('svg', { width: 10 * U + 4, height: 10 * U + 4, class: 'u1l9-svg' }), GX - 2, GY - 2);
    const sq = [];
    for (let col = 0; col < 10; col++) for (let row = 0; row < 10; row++) {
      const r = svgEl('rect', { x: 2 + col * U + 1.5, y: 2 + row * U + 1.5, width: U - 3, height: U - 3, rx: 4, class: 'u1l9-sq' }, sv); r.col = col; r.row = row; sq.push(r);
    }
    const first = sq.filter((r) => r.col >= left1 / 10);
    // the extra discount takes squares from the right end of what is left, column by column, bottom up
    const rest = sq.filter((r) => r.col < left1 / 10).sort((p, q) => (q.col - p.col) || (q.row - p.row));
    const second = rest.slice(0, k2);
    add(stage, box(cbox('u1l9-glab', `<b>${d.item} ${M(d.reg)}</b> = 100 squares`), 10 * U + 60, 32), 4, 4);
    const cnt = hide(add(stage, box(cbox('u1l9-cnt', `<b>${left2}</b> squares left`), 10 * U, 40), GX, GY + 10 * U + 6));
    const X = GX + 10 * U + 40, LW = W - X - 14;
    const L = [
      line(stage, `${d.a}% off: you pay ${left1}%: ${T(`${d.reg.toFixed(2)}\\times${m1.toFixed(2)}=\\$${D(p1)}`)}`, X, 30, LW),
      line(stage, `Extra ${d.b}% of the <b>${left1}</b> squares left: ${T(`${d.b}\\%\\times${left1}=${k2}`)} squares`, X, 78, LW),
      line(stage, `You pay ${left2}%: ${T(`${m1.toFixed(2)}\\times${m2.toFixed(2)}=${(left2 / 100).toFixed(2)}`)}`, X, 126, LW),
      line(stage, `Final price: ${T(`${D(p1)}\\times${m2.toFixed(2)}=\\$${D(p2)}`)}`, X, 174, LW),
      hide(add(stage, box(cbox('u1l9-res', `Total off: <b>${tot}%</b>, not ${T(`${d.a}\\%+${d.b}\\%=${d.a + d.b}\\%`)}`), LW, 56), X, 230)),
      line(stage, k === 'boots' ? `Check: saved ${T('150.00-108.00=\\$42.00')} and ${T('42.00\\div150.00\\times100=28\\%')}. 30% off would be ${T('150\\times0.70=\\$105.00')}.` : k === 'half' ? `You still pay ${M(p2)}: <b>not free!</b>` : `Check in one step: ${T(`${d.reg}\\times${(left2 / 100).toFixed(2)}=\\$${D(p2)}`)} ✓`, X, 296, LW, k === 'boots' ? 70 : 46, 'chk')
    ];
    const st = hide(stamp(stage, `${tot}% ≠ ${d.a + d.b}%`, { ok: false, x: X + LW / 2, y: 394, rotate: -6 }));
    const mark = async (c, list, cls) => { for (let i = 0; i < list.length; i += 10) { list.slice(i, i + 10).forEach((r) => r.classList.add(cls)); if (c && !c.fast) await c.sleep(110); } };
    const steps = [
      { cap: `The whole price is 100 squares: <b>${M(d.reg)} = 100%</b>. Each square is 1%.`, run: (c) => pulse(c, sv, 1.03, 500) },
      { cap: `${d.a}% off: cross out ${d.a} squares. You pay ${left1}%: ${T(`${d.reg.toFixed(2)}\\times${m1.toFixed(2)}=\\$${D(p1)}`)}.`, run: async (c) => { await mark(c, first, 'x1'); await c.fadeIn(L[0]); } },
      { cap: `The extra ${d.b}% comes off the <b>sale</b> price: ${d.b}% of the ${left1} squares left is <b>${k2} squares</b>, not ${d.b}.`, run: async (c) => { await mark(c, second, 'x2'); await c.fadeIn(L[1]); } },
      { cap: `${left2} squares are left: you pay ${left2}% (${T(`${m1.toFixed(2)}\\times${m2.toFixed(2)}=${(left2 / 100).toFixed(2)}`)}). The final price is <b>${M(p2)}</b>.`, run: async (c) => { await c.pop(cnt); await c.fadeIn(L[2]); await c.fadeIn(L[3]); } },
      { cap: `${tot} squares are taken off: the total is <b>${tot}% off</b>, not ${d.a}% + ${d.b}% = ${d.a + d.b}%.`, run: async (c) => { await c.pop(L[4]); await stampIn(c, st); } },
      { cap: k === 'boots' ? `Check: saved $42.00, and ${T('42.00\\div150.00\\times100=28\\%')}. 30% off would be $105.00.` : k === 'half' ? `${tot}% off, not 100%. The sneakers are <b>not free</b>: you pay ${M(p2)}.` : `Check in one step: ${T(`${d.reg}\\times${(left2 / 100).toFixed(2)}=\\$${D(p2)}`)} ✓`, run: (c) => c.fadeIn(L[5]) }
    ];
    return steps;
  }
};

/* =====================================================================================
 * 10. Is it really a deal? Raised, then "on sale" (Example 10)
 * ===================================================================================== */
const FD = {
  tv: { ask: 'Example 10: a TV was <b>$500.00</b> in October. The week before Black Friday, the store raised the price by <b>20%</b>. Then it advertised <b>15% OFF!</b> Is it really a deal?', p0: 500, up: 20, off: 15, labs: ['October', 'Week before', 'Black Friday'], when: 'October' },
  bike: { ask: 'A bike was <b>$200.00</b> in March. In April the store raised the price by <b>25%</b>. Then it advertised <b>20% OFF!</b> Is it really a deal?', p0: 200, up: 25, off: 20, labs: ['March', 'April', '“Sale”'], when: 'March' }
};
const fakeDeal = {
  title: 'Is it really a deal?',
  height: 420,
  minW: 920,
  choices: [{ sep: 'Example 10 check:' }, { v: 'tv', label: 'The TV' }, { sep: 'More:' }, { v: 'bike', label: 'A bike' }],
  ask: (k) => FD[k].ask,
  make(stage, k, ex) {
    const d = FD[k], W = ex.W, u = 1 + d.up / 100, o = 1 - d.off / 100, p1 = rnd(d.p0 * u), p2 = rnd(p1 * o), diff = rnd(p2 - d.p0), pc = rnd(diff / d.p0 * 100, 1);
    const BASE = 380, TOPH = 250, sc = TOPH / p1, BW = 130, xs = [40, 250, 460], hgt = (v) => v * sc;
    const sv = add(stage, svgEl('svg', { width: 640, height: 420, class: 'u1l9-svg' }), 0, 0);
    svgEl('line', { x1: 20, y1: BASE, x2: 620, y2: BASE, stroke: '#6b5a40', 'stroke-width': 3 }, sv);
    const bars = [0, 1, 2].map((i) => svgEl('rect', { x: xs[i], y: BASE, width: BW, height: 0, rx: 6, class: 'u1l9-fb b' + i }, sv));
    const blabs = d.labs.map((t, i) => { const e = svgEl('text', { x: xs[i] + BW / 2, y: BASE + 30, 'text-anchor': 'middle', class: 'u1l9-ft' }, sv); e.textContent = t; return e; });
    void blabs;
    const vals = [d.p0, p1, p2];
    const tags = vals.map((v, i) => hide(add(stage, box(h('div', 'u1l9-ftag' + (i === 2 ? ' sale' : ''), M(v)), BW, 40), xs[i], BASE - hgt(v) - 46)));
    const ref = svgEl('line', { x1: 20, y1: BASE - hgt(d.p0), x2: 620, y2: BASE - hgt(d.p0), stroke: '#1f5bd6', 'stroke-width': 2.5, 'stroke-dasharray': '8 6' }, sv); hide(ref);
    const refl = hide(add(stage, box(h('div', 'u1l9-refl', `${d.when} price`), 76, 44), 172, BASE - hgt(d.p0) + 6));
    const arrow = (i, top, sub, up) => { const x = xs[i] + BW + 6, y = BASE - hgt(vals[i]) - 70; return hide(add(stage, box(h('div', 'u1l9-farr ' + (up ? 'up' : 'dn'), `<b>${top}</b><small>${sub}</small>`), 78, 62), x - 2, Math.max(4, y))); };
    const a1 = arrow(0, `+${d.up}%`, `× ${u.toFixed(2)}`, true), a2 = arrow(1, `${d.off}% OFF`, `× ${o.toFixed(2)}`, false);
    const X = 650, LW = W - X - 10;
    const L1 = line(stage, `(a) ${T(`${d.p0}.00\\times${u.toFixed(2)}=\\$${D(p1)}`)}`, X, 40, LW);
    const L2 = line(stage, `(b) ${T(`${D(p1)}\\times${o.toFixed(2)}=\\$${D(p2)}`)}`, X, 90, LW);
    const L3 = line(stage, `(c) ${T(`${D(p2)}-${D(d.p0)}=\\$${D(diff)}`)} ${diff > 0 ? 'more' : ''}`, X, 146, LW, 62, 'wrap');
    const L4 = line(stage, `${T(`\\dfrac{${D(diff)}}{${D(d.p0)}}\\times100=${pc}\\%`)}`, X, 212, LW, 62);
    const st = hide(stamp(stage, diff > 0 ? 'NOT A DEAL' : 'NO SAVINGS', { ok: diff > 0 ? false : null, x: X + LW / 2, y: 318, rotate: -8 }));
    const grow = (c, i, from, to) => tween(c, 700, (t) => { const v = lerp(from, to, t); bars[i].setAttribute('y', BASE - hgt(v)); bars[i].setAttribute('height', hgt(v)); });
    return [
      { cap: `In ${d.when}, the ${k === 'tv' ? 'TV' : 'bike'} was <b>${M(d.p0)}</b>.`, run: async (c) => { await grow(c, 0, 0, d.p0); await c.pop(tags[0]); await c.fadeIn(ref, 300, { from: 'none' }); await c.fadeIn(refl); } },
      { cap: `(a) Before the sale, the price goes <b>up</b> ${d.up}%: ${T(`${d.p0}.00\\times${u.toFixed(2)}=\\$${D(p1)}`)}.`, run: async (c) => { await c.pop(a1); await grow(c, 1, 0, p1); await c.pop(tags[1]); await c.fadeIn(L1); } },
      { cap: `(b) Then the sign says “${d.off}% OFF!”: ${T(`${D(p1)}\\times${o.toFixed(2)}=\\$${D(p2)}`)}.`, run: async (c) => { await c.pop(a2); await grow(c, 2, 0, p1); await grow(c, 2, p1, p2); await c.pop(tags[2]); await c.fadeIn(L2); } },
      { cap: `(c) Compare with the ${d.when} price: ${T(`${D(p2)}-${D(d.p0)}=\\$${D(diff)}`)}${diff > 0 ? ' <b>more</b>' : ''}. ${T(`${D(diff)}\\div${D(d.p0)}\\times100=${pc}\\%`)}.`, run: async (c) => { await pulse(c, refl, 1.15); await c.fadeIn(L3); await c.fadeIn(L4); } },
      { cap: diff > 0 ? `The “sale” price is ${pc}% <b>higher</b> than in ${d.when}. <b>Not a real deal!</b>` : `The “sale” price is the same as in ${d.when}. The ${d.off}% OFF sign saves you <b>nothing</b>.`, run: (c) => stampIn(c, st) }
    ];
  }
};

mountExplainers({ slash, payBar, receipt, pctDrop, wrongBase, taxMachine, breakEven, bogo, stack, fakeDeal });

/* ============ Try any price: 30% off or $25 off (hands-on slider on the card) ============ */
{
  const host = document.getElementById('u1l9-slider');
  if (host) {
    host.innerHTML = `<div class="u1l9-sl-top"><span>Regular price</span><b class="u1l9-sl-p"></b><input type="range" min="10" max="200" step="any" value="60" aria-label="Regular price" data-tap>
      <span class="u1l9-sl-btns"><button type="button" class="pill small" data-p="60">$60</button><button type="button" class="pill small" data-p="85">$85</button><button type="button" class="pill small" data-p="120">$120</button><button type="button" class="pill small" data-p="83.333333">Where they swap</button></span></div>
      <div class="u1l9-sl-row"><div class="u1l9-sl-c o"><span class="u1l9-sg">30% OFF</span><div class="u1l9-sbar"><i></i></div><div class="u1l9-st"></div></div>
      <div class="u1l9-sl-c b"><span class="u1l9-sg">$25 OFF</span><div class="u1l9-sbar"><i></i></div><div class="u1l9-st"></div></div></div>
      <div class="u1l9-sl-v"></div>`;
    const inp = host.querySelector('input'), pEl = host.querySelector('.u1l9-sl-p'), cards = host.querySelectorAll('.u1l9-sl-c'), v = host.querySelector('.u1l9-sl-v');
    const show = (p) => {
      const pay = [rnd(p * 0.7), rnd(Math.max(0, p - 25))], save = [rnd(p * 0.3), Math.min(25, rnd(p))];
      pEl.textContent = M(p);
      cards.forEach((cd, i) => { cd.querySelector('i').style.width = (pay[i] / 200 * 100) + '%'; cd.querySelector('.u1l9-st').innerHTML = `saves <b>${M(save[i])}</b> · you pay <b>${M(pay[i])}</b>`; });
      const dd = rnd(pay[1] - pay[0]);
      cards[0].classList.toggle('win', dd > 0); cards[1].classList.toggle('win', dd < 0);
      v.innerHTML = Math.abs(dd) < 0.005 ? `<b>Same price!</b> At ${M(p)}, 30% of the price is exactly $25.` : `<b>${dd > 0 ? '30% off' : '$25 off'}</b> gives the lower price, by ${M(Math.abs(dd))}.`;
    };
    inp.addEventListener('input', () => show(Math.round(+inp.value)));
    host.querySelectorAll('[data-p]').forEach((b) => b.addEventListener('click', () => { inp.value = b.dataset.p; show(+b.dataset.p); }));
    show(60);
  }
}

/* ============ Stand Up Break! — sale prices, percent off, tax on a sale, stacked discounts, at the whiteboards ============ */
{
  const ITEMS = [['hoodie', 24.99, 79.99], ['backpack', 29.99, 89.99], ['pair of headphones', 39.99, 199.99], ['video game', 49.99, 89.99], ['pair of skates', 89.99, 299.99], ['lamp', 19.99, 69.99], ['winter coat', 99.99, 249.99], ['toolbox', 34.99, 129.99]];
  const price = (r, it) => rnd(Math.round(r.int(it[1], it[2])) + r.pick([0.99, 0.49, 0, 0.95]) - 1, 2);
  const dd = (v) => D(v);
  standup('u1l9', {
    intro: 'Estimate first, then use your calculator. Show the percent you pay.',
    levels: {
      BEG: (r) => { // discount and sale price
        const it = r.pick(ITEMS), p = Math.max(9.99, price(r, it)), pct = r.pick([10, 15, 20, 25, 30, 40, 50]), disc = rnd(p * pct / 100), sale = rnd(p - disc), m = (100 - pct) / 100;
        return { text: `A <b>${it[0]}</b> is regularly <b>$${dd(p)}</b>. It is <b>${pct}% off</b>. Find the discount and the sale price.`, q: '',
          a: [`\\text{Discount: }${(pct / 100).toFixed(2)}\\times${dd(p)}\\approx\\$${dd(disc)}`, `\\text{Sale price: }${dd(p)}-${dd(disc)}=\\$${dd(sale)}`, `\\text{(or }${dd(p)}\\times${m.toFixed(2)}\\approx\\$${dd(rnd(p * m))})`] };
      },
      PRG: (r) => r.pick([
        () => { // percent decrease
          const o = r.pick([40, 60, 80, 120, 150, 200, 250, 360]), pct = r.pick([10, 15, 20, 25, 30, 35, 40]), n = rnd(o * (100 - pct) / 100);
          return { text: `A price drops from <b>$${dd(o)}</b> to <b>$${dd(n)}</b>. Find the percent decrease.`, q: '',
            a: [`\\text{Decrease: }${dd(o)}-${dd(n)}=\\$${dd(o - n)}`, `\\dfrac{${dd(o - n)}}{${dd(o)}}\\times100=${pct}\\%`] };
        },
        () => { // sale, then GST
          const it = r.pick(ITEMS), p = Math.max(9.99, price(r, it)), pct = r.pick([20, 25, 30, 35, 40]), m = (100 - pct) / 100, sale = rnd(p * m), gst = rnd(sale * 0.05), tot = rnd(sale + gst);
          return { text: `In Calgary, a <b>${it[0]}</b> is regularly <b>$${dd(p)}</b>. It is <b>${pct}% off</b>. GST is 5%. Find the total cost.`, q: '',
            a: [`\\text{Sale: }${dd(p)}\\times${m.toFixed(2)}\\approx\\$${dd(sale)}`, `\\text{GST: }${dd(sale)}\\times0.05\\approx\\$${dd(gst)}`, `\\text{Total: }${dd(sale)}+${dd(gst)}=\\$${dd(tot)}`] };
        }
      ])(),
      MAS: (r) => r.pick([
        () => { // stacked discounts
          const a = r.pick([20, 30, 40, 50]), b = r.pick([10, 20, 25]), p = r.pick([60, 80, 100, 120, 160, 200]), p1 = rnd(p * (100 - a) / 100), p2 = rnd(p1 * (100 - b) / 100), pay = (100 - a) * (100 - b) / 100;
          return { text: `A <b>$${dd(p)}</b> jacket is <b>${a}% off</b>, plus an <b>extra ${b}% off</b> at the till. Find the final price and the total percent off.`, q: '',
            a: [`${dd(p)}\\times${((100 - a) / 100).toFixed(2)}=\\$${dd(p1)}`, `${dd(p1)}\\times${((100 - b) / 100).toFixed(2)}=\\$${dd(p2)}`, `\\text{You pay }${rnd(pay, 1)}\\%\\text{, so }${rnd(100 - pay, 1)}\\%\\text{ off (not }${a + b}\\%)`] };
        },
        () => { // percent off vs dollars off
          const pct = r.pick([20, 25, 30, 40]), off = r.pick([10, 15, 20, 30]), p = r.pick([45, 60, 75, 90, 110, 140]), payP = rnd(p * (100 - pct) / 100), payD = p - off, even = rnd(off / (pct / 100));
          return { text: `Item: <b>$${dd(p)}</b>. One store gives <b>${pct}% off</b>, another gives <b>$${off} off</b>. Which gives the lower price? At what price are they equal?`, q: '',
            a: [`${pct}\\%\\text{ off: }${dd(p)}\\times${((100 - pct) / 100).toFixed(2)}=\\$${dd(payP)}`, `\\$${off}\\text{ off: }${dd(p)}-${off}=\\$${dd(payD)}`, payP === payD ? '\\text{Same price}' : `\\text{${payP < payD ? pct + '\\% off' : '\\$' + off + ' off'} is lower}`, `\\text{Equal at }${off}\\div${(pct / 100).toFixed(2)}\\approx\\$${dd(even)}`] };
        }
      ])()
    }
  });
}
