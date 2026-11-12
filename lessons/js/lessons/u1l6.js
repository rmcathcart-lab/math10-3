/* Math 10-3 · Unit 1 · Lesson 6 — Unit Price: Finding the Best Buy.
 * Explainers: sharing a price out into unit prices (the money bar splits over the items), which way to divide (Full
 * notes), counting the 100 g blocks (Full notes), the shelf with live unit-price tags and a BEST BUY stamp, the meat
 * counter vs the package on a scale, multi-buy yogurt, shipping that flips the verdict, Jasmine's spinach that spoils,
 * the deli scale that prints Kai's price chart, and Malik's floor box by box (Full notes). Then the Stand Up Break. */
import { h, add, box, tex, svgEl, appear, pulse, tween, stamp, stampIn, mountExplainers } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const rnd = (v, d = 2) => Math.round((v + (v >= 0 ? 1e-9 : -1e-9)) * 10 ** d) / 10 ** d;
const M = (v, d = 2) => '$' + rnd(v, d).toFixed(d);          // money text
const MT = (v, d = 2) => '\\$' + rnd(v, d).toFixed(d);       // money TeX
const lerp = (a, b, t) => a + (b - a) * t;
/** a box whose mixed text and maths stay together on centred lines */
const cbox = (cls, html) => h('div', cls + ' u1l6-c', `<div>${html}</div>`);
/** count a number up inside el (text), e.g. $0.000 → $0.950 */
const countTo = (c, el, a, b, ms, f) => tween(c, ms, (t) => { el.innerHTML = f(lerp(a, b, t)); });
const mixHex = (a, b, t) => { const p = (s, i) => parseInt(s.slice(1 + 2 * i, 3 + 2 * i), 16); return '#' + [0, 1, 2].map((i) => Math.round(lerp(p(a, i), p(b, i), t)).toString(16).padStart(2, '0')).join(''); };

/* ---------- little product pictures (viewBox 100 × 140, standing on y = 140) ---------- */
const PROD = {
  box: '<rect x="10" y="8" width="80" height="132" rx="4" fill="#e9a23b" stroke="#8a5a14" stroke-width="3"/><rect x="10" y="8" width="80" height="26" fill="#c0392b"/><path d="M28 92 Q50 120 72 92 Z" fill="#fff" stroke="#8a5a14" stroke-width="2.5"/><circle cx="40" cy="86" r="5" fill="#d98b2b"/><circle cx="52" cy="82" r="5" fill="#d98b2b"/><circle cx="62" cy="87" r="5" fill="#d98b2b"/>',
  jar: '<rect x="22" y="8" width="56" height="20" rx="4" fill="#c0392b" stroke="#7a1f16" stroke-width="2.5"/><rect x="14" y="26" width="72" height="114" rx="14" fill="#b9773a" stroke="#6b3f14" stroke-width="3"/><rect x="14" y="58" width="72" height="48" fill="#fff3dc"/><ellipse cx="50" cy="82" rx="16" ry="10" fill="#c98a4a"/>',
  bottle: '<rect x="40" y="2" width="20" height="14" rx="3" fill="#1f5bd6"/><rect x="42" y="16" width="16" height="20" fill="#8ccf9a" stroke="#2f7a45" stroke-width="2.5"/><rect x="18" y="34" width="64" height="106" rx="16" fill="#8ccf9a" stroke="#2f7a45" stroke-width="3"/><rect x="18" y="66" width="64" height="40" fill="#fff"/><circle cx="50" cy="86" r="10" fill="#bfe6ff" stroke="#1f5bd6" stroke-width="2"/>',
  cup: '<rect x="14" y="22" width="72" height="12" rx="4" fill="#1f5bd6"/><path d="M18 34 L82 34 L74 136 L26 136 Z" fill="#fff" stroke="#8aa0b8" stroke-width="3" stroke-linejoin="round"/><path d="M21 62 L79 62 L77 86 L23 86 Z" fill="#f4a9c4"/>',
  battery: '<rect x="42" y="6" width="16" height="12" rx="2" fill="#c9ccd1"/><rect x="28" y="16" width="44" height="124" rx="6" fill="#1c2230"/><rect x="28" y="16" width="44" height="40" rx="6" fill="#e0a21a"/><text x="50" y="104" font-size="26" font-weight="800" fill="#fff" text-anchor="middle">AA</text>',
  bag: '<path d="M30 30 Q50 20 70 30 L88 120 Q90 140 70 140 H30 Q10 140 12 120 Z" fill="#c9a26b" stroke="#7a5a2a" stroke-width="3" stroke-linejoin="round"/><path d="M36 30 Q50 40 64 30" fill="none" stroke="#7a5a2a" stroke-width="4"/><ellipse cx="38" cy="92" rx="9" ry="7" fill="#a67c43"/><ellipse cx="60" cy="108" rx="10" ry="7" fill="#a67c43"/><ellipse cx="58" cy="76" rx="8" ry="6" fill="#a67c43"/>',
  bagel: '<ellipse cx="50" cy="108" rx="44" ry="30" fill="#d39a52" stroke="#8a5a14" stroke-width="3"/><ellipse cx="50" cy="104" rx="13" ry="7" fill="#fff" stroke="#8a5a14" stroke-width="2"/><circle cx="30" cy="96" r="2" fill="#fff"/><circle cx="70" cy="98" r="2" fill="#fff"/><circle cx="44" cy="124" r="2" fill="#fff"/><circle cx="64" cy="120" r="2" fill="#fff"/>',
  carton: '<path d="M20 40 L50 12 L80 40 V140 H20 Z" fill="#fff" stroke="#1f5bd6" stroke-width="3" stroke-linejoin="round"/><path d="M20 40 H80" stroke="#1f5bd6" stroke-width="3"/><rect x="20" y="70" width="60" height="34" fill="#cfe0fb"/><text x="50" y="94" font-size="20" font-weight="800" fill="#1f5bd6" text-anchor="middle">1 L</text>',
  waterb: '<rect x="40" y="4" width="20" height="12" rx="3" fill="#1f5bd6"/><path d="M38 16 H62 L72 34 V132 Q72 140 64 140 H36 Q28 140 28 132 V34 Z" fill="#cfe9ff" stroke="#1f5bd6" stroke-width="3"/><rect x="28" y="66" width="44" height="26" fill="#1f5bd6" opacity=".55"/>',
  clam: '<rect x="8" y="60" width="84" height="80" rx="10" fill="#e9f7e6" stroke="#3c8d2f" stroke-width="3"/><ellipse cx="32" cy="98" rx="18" ry="12" fill="#3c8d2f"/><ellipse cx="62" cy="92" rx="20" ry="12" fill="#4fa83f"/><ellipse cx="48" cy="118" rx="22" ry="12" fill="#2f7a25"/><rect x="8" y="60" width="84" height="12" rx="6" fill="#fff" stroke="#3c8d2f" stroke-width="2"/>'
};
const prod = (kind, hgt) => { const s = svgEl('svg', { viewBox: '0 0 100 140', width: hgt * 100 / 140, height: hgt, class: 'u1l6-prod' }); s.innerHTML = PROD[kind]; return s; };
const prodAt = (stage, kind, hgt, cx, bottom) => add(stage, prod(kind, hgt), cx - hgt * 50 / 140, bottom - hgt);

/* =====================================================================================
 * 1. Unit price: share the price out over the items
 * ===================================================================================== */
const UP = {
  a: { item: '(a) Pack of AA batteries', what: 'pack of AA batteries', price: 11.92, n: 8, qty: '8 batteries', per: 'battery', piece: 'battery', kind: 'battery', est: '\\$12\\div8=\\$1.50', lcd: '1.49', to: 1.49 },
  b: { item: '(b) Bag of potatoes', what: 'bag of potatoes', price: 5.97, n: 3, qty: '3 kg', per: 'kg', piece: 'kilogram', kind: 'bag', tag: '1 kg', est: '\\$6\\div3=\\$2', lcd: '1.99', to: 1.99 },
  c: { item: '(c) Bag of bagels', what: 'bag of bagels', price: 4.49, n: 6, qty: '6 bagels', per: 'bagel', piece: 'bagel', kind: 'bagel', est: '\\$4.50\\div6=\\$0.75', lcd: '0.7483333333', to: 0.75,
    round: 'the next digit is <b>8</b> (5 or more), so round up', rlcd: '0.74<u>8</u>3…' },
  d: { item: '(d) Jug of milk', what: 'jug of milk', price: 6.29, n: 4, qty: '4 L', per: 'L', piece: 'litre', kind: 'carton', est: '\\$6\\div4=\\$1.50', lcd: '1.5725', to: 1.57,
    round: 'the next digit is <b>2</b> (4 or less), so keep the 7', rlcd: '1.57<u>2</u>5' }
};
const unitPrice = {
  title: 'Unit price: share the price out',
  height: 400,
  minW: 900,
  choices: [{ sep: 'Example 1 check:' }, { v: 'a', label: '(a) Batteries' }, { v: 'b', label: '(b) Potatoes' }, { v: 'c', label: '(c) Bagels' }, { v: 'd', label: '(d) Milk' }],
  ask: (k) => `Example 1${UP[k].item.slice(0, 3)}: find the unit price of a ${UP[k].what}: <b>${M(UP[k].price)}</b> for <b>${UP[k].qty}</b>. Round to the nearest cent.`,
  make(stage, k, ex) {
    const d = UP[k], W = ex.W, n = d.n;
    // the price tag
    add(stage, box(h('div', 'u1l6-ptag', `<small>${d.item}</small><b>${M(d.price)}</b><span>for ${d.qty}</span>`), 300, 112), 24, 6);
    // the work panel
    const x0 = 350, xL = W - 270;
    const expr = hide(add(stage, box(h('div', 'u1l6-expr', T(`\\$${d.price.toFixed(2)}\\div${n}`)), 330, 48), x0, 8));
    const est = hide(add(stage, box(h('div', 'u1l6-estl', `Estimate: ${T(d.est)}`), 340, 40), x0, 62));
    const lcd = hide(add(stage, box(h('div', 'u1l6-lcd', `<div class="e">${d.price.toFixed(2)}÷${n}</div><div class="r">${d.lcd}</div>`), 250, 64), xL, 6));
    const rnote = d.round ? hide(add(stage, box(cbox('u1l6-rnote', `${d.rlcd} ≈ <b>${M(d.to)}</b>`), 250, 40), xL, 76)) : null;
    // the money bar and the shares
    const L = 40, BW = W - 80, sw = BW / n, g = 14, sw2 = (BW - (n - 1) * g) / n, Y = 128;
    const segs = [], labs = [];
    for (let i = 0; i < n; i++) {
      const s = add(stage, box(h('div', 'u1l6-seg' + (i === 0 ? ' l' : '') + (i === n - 1 ? ' r' : '')), sw, 54), L + i * sw, Y);
      segs.push(s);
    }
    const whole = add(stage, box(h('div', 'u1l6-segtot', M(d.price)), BW, 54), L, Y);
    for (let i = 0; i < n; i++) {
      const cx = L + i * (sw2 + g) + sw2 / 2;
      labs.push(hide(add(stage, box(h('div', 'u1l6-seglab', (d.round ? '≈ ' : '') + M(d.to)), sw2, 54), cx - sw2 / 2, Y)));
      prodAt(stage, d.kind, 108, cx, 300);
      if (d.tag) add(stage, box(h('div', 'u1l6-piece', d.tag), 80, 24), cx - 40, 302);
    }
    const res = hide(add(stage, box(cbox('u1l6-res', `Unit price: <b>${M(d.to)} per ${d.per}</b>`), 520, 46), (W - 520) / 2, 342));
    const steps = [
      { cap: `Unit price = <b>price ÷ quantity</b>: ${T(`\\$${d.price.toFixed(2)}\\div${n}`)}.`, run: (c) => c.pop(expr) },
      { cap: `Estimate first: ${T(d.est)}.`, run: (c) => c.fadeIn(est) },
      { cap: `Share the price out: split ${M(d.price)} into <b>${n} equal parts</b>, one for each ${d.piece}.`,
        run: async (c) => {
          await c.anim(whole, [{ opacity: 1 }, { opacity: 0 }], 250);
          await tween(c, 800, (t) => segs.forEach((s, i) => { s.style.left = lerp(L + i * sw, L + i * (sw2 + g), t) + 'px'; s.style.width = lerp(sw, sw2, t) + 'px'; if (t > 0.05) s.classList.add('apart'); }));
        } },
      { cap: `The calculator shows <b>${d.lcd}</b>.`, run: (c) => c.pop(lcd) }
    ];
    if (d.round) steps.push({ cap: `Round to the nearest cent: ${d.round}: <b>${M(d.to)}</b>.`, run: (c) => c.pop(rnote) });
    steps.push({ cap: `Each ${d.piece} gets ${d.round ? 'about ' : ''}<b>${M(d.to)}</b>. Close to the estimate ✓`,
      run: async (c) => { await Promise.all(labs.map((e, i) => c.pop(e, 320, { delay: i * 60 }))); await c.pop(res); } });
    return steps;
  }
};

/* =====================================================================================
 * 2. Which way do I divide? (Full notes)
 * ===================================================================================== */
const WW = {
  a: { price: 11.92, n: 8, one: 'battery', est: 'about $12 for 8, so a bit more than <b>$1</b> each', right: '1.49', rv: 1.49, wrong: '0.6711409396', wv: 0.67 },
  c: { price: 4.49, n: 6, one: 'bagel', est: 'about $4.50 for 6, so less than <b>$1</b> each', right: '0.7483333333', rv: 0.75, wrong: '1.336302895', wv: 1.34, approx: true }
};
const wrongWay = {
  title: 'Money ÷ amount, not amount ÷ money',
  height: 400,
  minW: 900,
  choices: [{ sep: 'Example 1:' }, { v: 'a', label: '(a) 8 batteries' }, { v: 'c', label: '(c) 6 bagels' }],
  ask: (k) => `${WW[k].n} ${WW[k].one === 'battery' ? 'batteries' : 'bagels'} cost <b>${M(WW[k].price)}</b>. Which division gives the price of one ${WW[k].one}?`,
  make(stage, k, ex) {
    const d = WW[k], W = ex.W, CW = (W - 100) / 2;
    const est = hide(add(stage, box(cbox('u1l6-estband', `Estimate: ${d.est}`), 640, 52), (W - 640) / 2, 6));
    const col = (x, ok) => {
      const head = add(stage, box(cbox('u1l6-wwh ' + (ok ? 'ok' : 'no'), ok ? '<b>price ÷ quantity</b> (money ÷ amount)' : '<b>quantity ÷ price</b> (the other way)'), CW, 40), x, 78);
      const e = ok ? `${d.price.toFixed(2)}÷${d.n}` : `${d.n}÷${d.price.toFixed(2)}`;
      const l = add(stage, box(h('div', 'u1l6-lcd big', `<div class="e">${e}</div><div class="r">${ok ? d.right : d.wrong}</div>`), 320, 78), x + (CW - 320) / 2, 128);
      const v = ok ? d.rv : d.wv, tot = rnd(d.n * v, 2);
      const approx = ok && d.approx;
      const chk = add(stage, box(h('div', 'u1l6-wwc', `${approx ? 'About ' : ''}${M(v)} per ${d.one}?<br>${T(`${d.n}\\times${MT(v)}=${MT(tot)}`)}${ok ? (approx ? ' ≈ ' + M(d.price) : '') + ' ✓' : ', not ' + M(d.price) + ' ✗'}`), CW, 90), x, 222);
      const st = stamp(stage, ok ? 'Makes sense ✓' : 'No sense ✗', { ok, x: x + CW / 2, y: 352, rotate: ok ? -6 : 6 });
      return [head, l, chk, st].map((e2) => hide(e2));
    };
    const A = col(40, true), B = col(60 + CW, false);
    return [
      { cap: `Estimate first: ${d.est}.`, run: (c) => c.fadeIn(est) },
      { cap: `Price ÷ quantity: ${T(`${d.price.toFixed(2)}\\div${d.n}`)} → <b>${M(d.rv)}</b> per ${d.one}.`, run: async (c) => { await c.fadeIn(A[0]); await c.pop(A[1]); } },
      { cap: `Check: ${d.n} at ${M(d.rv)} is ${d.approx ? 'about ' : ''}${M(d.price)}, and it is close to the estimate.`, run: async (c) => { await c.fadeIn(A[2]); await stampIn(c, A[3]); } },
      { cap: `Now the other way: ${T(`${d.n}\\div${d.price.toFixed(2)}`)} → ${d.wrong.slice(0, 6)}…`, run: async (c) => { await c.fadeIn(B[0]); await c.pop(B[1]); } },
      { cap: `${M(d.wv)} per ${d.one}? Then ${d.n} would cost ${M(rnd(d.n * d.wv))}, not ${M(d.price)}. <b>It doesn’t make sense.</b>`, run: async (c) => { await c.fadeIn(B[2]); await stampIn(c, B[3]); } }
    ];
  }
};

/* =====================================================================================
 * 3. Count the hundreds: price per 100 g (Full notes)
 * ===================================================================================== */
const P1 = {
  e3a: { g: 525, p: 4.99, what: 'box of cereal', part: '25 g is a <b>quarter</b> of 100 g' },
  e3b: { g: 750, p: 6.79, what: 'box of cereal', part: '50 g is <b>half</b> of 100 g' },
  e4a: { g: 375, p: 3.29, what: 'jar of peanut butter', part: '75 g is <b>three quarters</b> of 100 g' },
  e4b: { g: 1000, p: 6.99, what: 'jar of peanut butter', lab: '1 kg' }
};
const per100 = {
  title: 'Price per 100 g: count the hundreds',
  height: 400,
  minW: 900,
  choices: [{ sep: 'Example 3:' }, { v: 'e3a', label: '525 g for $4.99' }, { v: 'e3b', label: '750 g for $6.79' }, { sep: 'Example 4:' }, { v: 'e4a', label: '375 g for $3.29' }, { v: 'e4b', label: '1 kg for $6.99' }],
  ask: (k) => { const d = P1[k]; return `A ${d.lab || d.g + ' g'} ${d.what} costs <b>${M(d.p)}</b>. What is the price per 100 g?`; },
  make(stage, k, ex) {
    const d = P1[k], W = ex.W, X0 = 50, U = (W - 100) / 1000, BW = 100 * U, Y = 104, BH = 100;
    const f = Math.floor(d.g / 100), r = d.g % 100, hund = d.g / 100, per = d.p / hund, per3 = rnd(per, 3).toFixed(3);
    add(stage, box(h('div', 'u1l6-ptag sm', `<b>${M(d.p)}</b><span>for ${d.lab ? d.lab + ' = ' : ''}${d.g} g</span>`), 260, 70), 24, 4);
    const blocks = [], nums = [], shares = [];
    for (let i = 0; i < f; i++) {
      blocks.push(hide(add(stage, box(h('div', 'u1l6-blk', '100 g'), BW - 4, BH), X0 + i * BW + 2, Y)));
      nums.push(hide(add(stage, box(h('div', 'u1l6-bnum', String(i + 1)), BW, 24), X0 + i * BW, Y - 26)));
      shares.push(hide(add(stage, box(h('div', 'u1l6-bshare', '$' + per3), BW, 26), X0 + i * BW, Y + BH + 4)));
    }
    const pb = r ? hide(add(stage, box(h('div', 'u1l6-blk part'), r * U - 4, BH), X0 + f * BW + 2, Y)) : null;
    const pn = r ? hide(add(stage, box(h('div', 'u1l6-bnum part', `+${r} g`), 70, 24), X0 + f * BW + r * U / 2 - 35, Y - 26)) : null;
    const l1 = hide(add(stage, box(h('div', 'u1l6-p1l', `${T(`${d.g}\\text{ g}\\div100=${hund}`)} <b>hundreds</b>`), W - 100, 46), 50, 244));
    const l2 = hide(add(stage, box(h('div', 'u1l6-p1l', `${T(`\\$${d.p.toFixed(2)}\\div${hund}=${rnd(per, 4)}`)} → <b>$${per3} per 100 g</b>`), W - 100, 46), 50, 294));
    const l3 = hide(add(stage, box(h('div', 'u1l6-p1l sm', `Calculator shortcut: ${T(`${d.p.toFixed(2)}\\div${d.g}\\times100=${rnd(per, 4)}`)} &nbsp;the same ✓`), W - 100, 46), 50, 346));
    return [
      { cap: `Cut ${d.g} g into 100 g blocks: <b>${f}</b> full blocks${r ? ` and <b>${r} g</b> more` : ''}.`,
        run: async (c) => { for (let i = 0; i < f; i++) { await Promise.all([c.pop(blocks[i], 260), c.pop(nums[i], 260)]); } if (pb) await Promise.all([c.pop(pb, 300), c.pop(pn, 300)]); } },
      { cap: r ? `${d.part}, so ${d.g} g is <b>${hund} hundreds</b>.` : `${d.lab} = 1000 g is <b>10 hundreds</b>.`, run: (c) => c.fadeIn(l1) },
      { cap: `Share the price over the hundreds: each 100 g block costs about <b>$${per3}</b>.`, run: async (c) => { await c.fadeIn(l2); await Promise.all(shares.map((e, i) => c.pop(e, 280, { delay: i * 50 }))); } },
      { cap: `÷ ${d.g} × 100 is the same as ÷ ${hund}, so the calculator shortcut gives the same answer.`, run: (c) => c.fadeIn(l3) }
    ];
  }
};

/* =====================================================================================
 * 4. The shelf: live unit-price tags and the BEST BUY stamp
 * ===================================================================================== */
const SH = {
  e3: { ask: 'Example 3: a 525 g box of cereal costs $4.99. A 750 g box of the same cereal costs $6.79. Which is the better buy?', unit: 'g', kind: 'box',
    items: [{ q: 525, p: 4.99, lab: '525 g', est: '≈ $1.00' }, { q: 750, p: 6.79, lab: '750 g', est: '≈ $0.90' }],
    estCap: 'Estimate: about $5 for 500 g is about <b>$1.00</b> per 100 g. About $6.80 for 7.5 hundreds is about <b>$0.90</b>.',
    end: 'The <b>750 g box</b> is the better buy: about 4.5¢ less per 100 g.' },
  e4: { ask: 'Example 4: peanut butter comes in three sizes: 375 g for $3.29, 1 kg for $6.99 and 2 kg for $14.49. Which size is the best buy?', unit: 'g', kind: 'jar',
    items: [{ q: 375, p: 3.29, lab: '375 g' }, { q: 1000, p: 6.99, lab: '1 kg', conv: '1000 g' }, { q: 2000, p: 14.49, lab: '2 kg', conv: '2000 g' }],
    convCap: 'Same unit first: <b>1 kg = 1000 g</b> and <b>2 kg = 2000 g</b>.',
    end: 'The <b>1 kg jar</b> is the best buy.', big: 'Bigger is <b>not always</b> cheaper: the 2 kg jar costs <b>more</b> per 100 g than the 1 kg jar.', save: true },
  e5: { ask: 'Example 5(a): a 740 mL bottle of dish soap costs $3.97. A 1.5 L bottle of the same soap costs $7.49. Which is the better buy?', unit: 'mL', kind: 'bottle',
    items: [{ q: 740, p: 3.97, lab: '740 mL' }, { q: 1500, p: 7.49, lab: '1.5 L', conv: '1500 mL' }],
    convCap: 'The units don’t match. Change 1.5 L to mL: 1.5 × 1000 = <b>1500 mL</b>.',
    end: 'The <b>1.5 L bottle</b> is the better buy.' }
};
const shelf = {
  title: 'The shelf: unit-price tags and the best buy',
  height: 430,
  minW: 900,
  choices: [{ sep: 'Example check:' }, { v: 'e3', label: '3 Cereal' }, { v: 'e4', label: '4 Peanut butter' }, { v: 'e5', label: '5(a) Dish soap' }],
  ask: (k) => SH[k].ask,
  make(stage, k, ex) {
    const d = SH[k], W = ex.W, n = d.items.length, SW = Math.min(330, (W - 40) / n), X0 = (W - SW * n) / 2, SY = 262;
    const qmax = Math.max(...d.items.map((it) => it.q));
    svgEl('rect', { x: 10, y: SY, width: W - 20, height: 16, rx: 4, fill: '#b07a3c' }, add(stage, svgEl('svg', { width: W, height: 300, class: 'u1l6-svg' }), 0, 0));
    const vals = d.items.map((it) => rnd(it.p / it.q * 100, 3));
    const best = vals.indexOf(Math.min(...vals));
    const tags = d.items.map((it, i) => {
      const cx = X0 + SW * i + SW / 2, hg = Math.max(104, 216 * Math.cbrt(it.q / qmax));
      const pic = prodAt(stage, d.kind, hg, cx, SY);
      const t = add(stage, box(h('div', 'u1l6-stag'), SW - 26, 140), cx - (SW - 26) / 2, SY + 22);
      t.innerHTML = `<div class="t1"><span class="lab">${it.lab}</span> · ${M(it.p)}</div><div class="t2">${T(`${it.p.toFixed(2)}\\div${it.conv ? it.q : it.q}\\times100`)}</div><div class="t3"><b>?</b><small>per 100 ${d.unit}</small></div>`;
      const t2 = hide(t.querySelector('.t2')), big = t.querySelector('.t3 b'), lab = t.querySelector('.lab');
      return { t, t2, big, lab, pic, cx, hg, it };
    });
    const st = hide(stamp(stage, 'BEST BUY', { ok: true, x: tags[best].cx, y: SY - tags[best].hg / 2 - 6, rotate: -9, size: 'lg' }));
    const steps = [];
    if (d.estCap) steps.push({ cap: d.estCap, run: async (c) => { for (const g of tags) { g.big.innerHTML = g.it.est; g.big.classList.add('est'); await c.pop(g.big, 300); } } });
    if (d.convCap) steps.push({ cap: d.convCap, run: async (c) => { for (const g of tags) if (g.it.conv) { g.lab.innerHTML = g.it.conv; g.lab.classList.add('conv'); await c.pop(g.lab, 320); } } });
    steps.push({ cap: `On each tag: <b>price ÷ ${d.unit === 'g' ? 'grams' : 'mL'} × 100</b>. Keep three decimals.`,
      run: async (c) => {
        for (const g of tags) { g.big.classList.remove('est'); await c.fadeIn(g.t2, 260); }
        await Promise.all(tags.map((g, i) => countTo(c, g.big, 0, vals[i], 900, (v) => '$' + v.toFixed(3))));
      } });
    steps.push({ cap: `Lowest price per 100 ${d.unit}: <b>$${vals[best].toFixed(3)}</b>. ${d.end}`,
      run: async (c) => { tags.forEach((g, i) => { g.t.classList.toggle('best', i === best); g.t.classList.toggle('dim', i !== best); }); await stampIn(c, st); } });
    if (d.big) steps.push({ cap: d.big, run: async (c) => { const g = tags[2]; g.t.classList.remove('dim'); g.t.classList.add('warn'); await pulse(c, g.t, 1.06, 500); } });
    if (d.save) {
      const note = hide(add(stage, box(h('div', 'u1l6-save', `(c) Need 2 kg? ${T('2\\times\\$6.99=\\$13.98')}<br>Save ${T('\\$14.49-\\$13.98=\\$0.51')}`), 380, 64), 14, 2));
      steps.push({ cap: '(c) Need 2 kg? Two 1 kg jars cost 2 × $6.99 = $13.98. You save $14.49 − $13.98 = <b>$0.51</b>.', run: (c) => c.pop(note) });
    }
    return steps;
  }
};

/* =====================================================================================
 * 5. Meat counter vs the package: same unit first, then a verdict (and a check on the scale)
 * ===================================================================================== */
const MS = {
  beef: { ask: 'Example 5(b): at the meat counter, lean ground beef is $11.00 per kg. A 650 g package in the cooler is $7.49. Which is the better buy?', name: 'Lean ground beef', rate: 11.00, g: 650, p: 7.49, food: '#b8484a' },
  chicken: { ask: 'At the meat counter, chicken thighs are $8.80 per kg. A 900 g package in the cooler is $7.59. Which is the better buy?', name: 'Chicken thighs', rate: 8.80, g: 900, p: 7.59, food: '#e3a77e' }
};
const meatScale = {
  title: 'The counter or the package?',
  height: 410,
  minW: 900,
  choices: [{ sep: 'Example 5(b) check:' }, { v: 'beef', label: 'Ground beef' }, { sep: 'More:' }, { v: 'chicken', label: 'Chicken' }],
  ask: (k) => MS[k].ask,
  make(stage, k, ex) {
    const d = MS[k], W = ex.W, kg = d.g / 1000, pkgPer = rnd(d.p / kg, 2), atCounter = rnd(kg * d.rate, 2), counterWins = d.rate < pkgPer;
    const sign = add(stage, box(h('div', 'u1l6-board', `<small>Counter</small><div>${d.name}</div><b>${M(d.rate)} <span class="u">/ kg</span></b>`), 290, 150), 24, 10);
    const pkg = add(stage, box(h('div', 'u1l6-pkg', `<small>Package in the cooler</small><svg viewBox="0 0 120 40" width="150" height="50"><rect x="4" y="8" width="112" height="30" rx="8" fill="#f1f1f1" stroke="#999" stroke-width="2"/><ellipse cx="60" cy="22" rx="44" ry="10" fill="${d.food}"/></svg><b><span class="u">${d.g} g</span> · ${M(d.p)}</b>`), 290, 150), W - 314, 10);
    const conv = hide(add(stage, box(cbox('u1l6-conv', `${T(`${d.g}\\div1000=${kg}`)} kg`), 290, 40), W - 314, 168));
    const ptag = hide(add(stage, box(cbox('u1l6-ktag', '<b>$0.00</b> per kg'), 290, 52), W - 314, 214));
    const pbig = ptag.querySelector('b');
    // the scale
    const SX = W / 2 - 150, sv = add(stage, svgEl('svg', { width: 300, height: 230, class: 'u1l6-svg' }), SX, 176);
    sv.innerHTML = '<rect x="40" y="70" width="220" height="12" rx="5" fill="#9aa3ad"/><rect x="140" y="82" width="20" height="40" fill="#7a838d"/><rect x="20" y="118" width="260" height="104" rx="14" fill="#d9dee4" stroke="#6b7480" stroke-width="3"/>';
    const food = svgEl('ellipse', { cx: 150, cy: 56, rx: 70, ry: 16, fill: d.food }, sv); hide(food);
    const disp = add(stage, box(h('div', 'u1l6-sdisp', '<div><small>WEIGHT (kg)</small><b class="w">0.000</b></div><div><small>COST</small><b class="c">$0.00</b></div>'), 256, 80), SX + 22, 310);
    const dw = disp.querySelector('.w'), dc = disp.querySelector('.c');
    const note = hide(add(stage, box(cbox('u1l6-note', `${T(`${kg}\\times${MT(d.rate)}=${MT(atCounter)}`)}<br>${atCounter < d.p ? 'less' : 'more'} than ${M(d.p)}`), 270, 76), 30, 262));
    const units = [sign.querySelector('.u'), pkg.querySelector('.u')];
    const st = hide(stamp(stage, 'BETTER BUY', { ok: true, x: counterWins ? 24 + 145 : W - 314 + 145, y: counterWins ? 196 : 300, rotate: -8 }));
    return [
      { cap: 'The units don’t match: the counter price is <b>per kg</b>, but the package is in <b>grams</b>.', run: async (c) => { units.forEach((u) => u.classList.add('hl')); await Promise.all(units.map((u) => pulse(c, u, 1.25, 600))); } },
      { cap: `Change ${d.g} g to kg: ${T(`${d.g}\\div1000=${kg}`)} kg.`, run: (c) => c.pop(conv) },
      { cap: `The package per kg: ${T(`${MT(d.p)}\\div${kg}`)} ≈ <b>${M(pkgPer)} per kg</b>.`, run: async (c) => { await c.fadeIn(ptag); await countTo(c, pbig, 0, pkgPer, 800, (v) => M(v)); } },
      { cap: counterWins ? `${M(d.rate)} per kg is less than ${M(pkgPer)} per kg: the <b>meat counter</b> is the better buy.` : `${M(pkgPer)} per kg is less than ${M(d.rate)} per kg: the <b>package in the cooler</b> is the better buy.`, run: (c) => stampIn(c, st) },
      { cap: `Or check on the scale: ${kg} kg at the counter costs ${T(`${kg}\\times${MT(d.rate)}=${MT(atCounter)}`)}, ${atCounter < d.p ? 'less' : 'more'} than ${M(d.p)}.`,
        run: async (c) => { await c.anim(food, [{ opacity: 0, transform: 'translateY(-40px)' }, { opacity: 1, transform: 'none' }], 450); await tween(c, 900, (t) => { dw.textContent = (kg * t).toFixed(3); dc.textContent = M(atCounter * t); }); await c.pop(note); } }
    ];
  }
};

/* =====================================================================================
 * 6. Multi-buy: single, 4 for $5.00, or the 12-pack?
 * ===================================================================================== */
const multiBuy = {
  title: 'Three ways to buy yogurt',
  height: 420,
  minW: 900,
  ask: 'Example 6: a single cup of yogurt costs $1.49. The sign says “4 for $5.00”. A 12-pack costs $13.99. (a) Find the price of one cup each way. (b) How much do you save with the 12-pack?',
  make(stage, k, ex) {
    const W = ex.W;
    const rows = [
      { lab: 'Single cup', p: 1.49, n: 1, per: 1.49, work: '\\$1.49', cap: 'Single: <b>$1.49</b> per cup.' },
      { lab: '4 for $5.00', p: 5.00, n: 4, per: 1.25, work: '\\$5.00\\div4=\\$1.25', cap: `4 for $5.00: ${T('\\$5.00\\div4=\\$1.25')} per cup.` },
      { lab: '12-pack', p: 13.99, n: 12, per: 13.99 / 12, work: '\\$13.99\\div12\\approx\\$1.166', cap: `12-pack: ${T('\\$13.99\\div12\\approx\\$1.166')} per cup.` }
    ];
    const RX = W - 300;
    const R = rows.map((r, i) => {
      const y = [4, 90, 176][i], per = Math.min(r.n, 6), nr = Math.ceil(r.n / 6), gh = nr * 66 + 8;
      const lab = add(stage, box(h('div', 'u1l6-mlab', `<b>${r.lab}</b><small>${r.n} cup${r.n > 1 ? 's' : ''} · ${M(r.p)}</small>`), 170, gh), 14, y);
      const grp = add(stage, box(h('div', 'u1l6-cups' + (r.n > 1 ? ' grp' : '')), per * 48 + 30, gh), 190, y);
      for (let j = 0; j < r.n; j++) grp.appendChild(prod('cup', 64));
      const res = hide(add(stage, box(cbox('u1l6-mres', T(r.work)), 290, 60), RX, y + gh / 2 - 30));
      return { lab, grp, res };
    });
    const st = hide(stamp(stage, 'BEST BUY', { ok: true, x: 190 + 3 * 48 + 8, y: 176 + 70, rotate: -8 }));
    // (b) bars
    const BX = 200, BMAX = W - BX - 220, sc = BMAX / 17.88, BY = 332;
    const b1l = hide(add(stage, box(h('div', 'u1l6-blab', '12 single cups'), 180, 36), 14, BY));
    const b1 = hide(add(stage, box(h('div', 'u1l6-bar a', T('12\\times\\$1.49=\\$17.88')), 17.88 * sc, 36), BX, BY));
    const b2l = hide(add(stage, box(h('div', 'u1l6-blab', '12-pack'), 180, 36), 14, BY + 44));
    const b2 = hide(add(stage, box(h('div', 'u1l6-bar b', '$13.99'), 13.99 * sc, 36), BX, BY + 44));
    const gap = hide(add(stage, box(h('div', 'u1l6-gapbar'), (17.88 - 13.99) * sc, 36), BX + 13.99 * sc, BY + 44));
    const gl = hide(add(stage, box(h('div', 'u1l6-gaplab', `save <b>$3.89</b>`), 200, 36), BX + 17.88 * sc + 12, BY + 44));
    return [
      { cap: 'Three ways to buy the <b>same</b> cup. Find the price of <b>one cup</b> each way.', run: (c) => Promise.all(R.map((r, i) => c.fadeIn(r.grp, 400, { delay: i * 120 }))) },
      ...rows.map((r, i) => ({ cap: r.cap, run: (c) => c.pop(R[i].res) })),
      { cap: 'The lowest price per cup: the <b>12-pack</b> is the best buy.', run: async (c) => { R[2].res.classList.add('best'); await stampIn(c, st); } },
      { cap: `(b) 12 single cups cost ${T('12\\times\\$1.49=\\$17.88')}. The 12-pack costs $13.99.`, run: async (c) => { await Promise.all([c.fadeIn(b1l), c.fadeIn(b2l)]); await c.anim(b1, [{ opacity: 0, transform: 'scaleX(0)', transformOrigin: 'left' }, { opacity: 1, transform: 'scaleX(1)', transformOrigin: 'left' }], 600); await c.anim(b2, [{ opacity: 0, transform: 'scaleX(0)', transformOrigin: 'left' }, { opacity: 1, transform: 'scaleX(1)', transformOrigin: 'left' }], 500); } },
      { cap: `You save ${T('\\$17.88-\\$13.99=\\$3.89')} with the 12-pack.`, run: async (c) => { await appear(c, gap, 300); await c.pop(gl); } }
    ];
  }
};

/* =====================================================================================
 * 7. Shipping: add it before you divide (the verdict flips)
 * ===================================================================================== */
const shipping = {
  title: 'Add the shipping before you divide',
  height: 420,
  minW: 900,
  ask: 'Example 7: Store A sells 24 bottles for $62.40, plus $9.99 shipping. Store B sells 30 bottles for $84.00, with free shipping. Which store is the better buy?',
  make(stage, k, ex) {
    const W = ex.W, CW = (W - 60) / 2;
    const card = (x, name, n, p, ship) => {
      const el = add(stage, box(h('div', 'u1l6-store'), CW, 248), x, 6);
      const rowsN = 2, perRow = n / rowsN;
      let bottles = ''; for (let i = 0; i < n; i++) bottles += `<i style="left:${(i % perRow) * 19}px;top:${Math.floor(i / perRow) * 36}px"></i>`;
      el.innerHTML = `<div class="sh">${name}</div><div class="bt" style="width:${perRow * 19}px">${bottles}</div><div class="pl">${n} bottles · <b>${M(p)}</b></div><div class="sp">${ship}</div><div class="tot"></div><div class="per"><b>?</b> per bottle</div>`;
      el.querySelectorAll('.bt i').forEach((b) => { b.appendChild(prod('waterb', 32)); });
      return { el, tot: el.querySelector('.tot'), per: el.querySelector('.per b'), perRow: el.querySelector('.per') };
    };
    const A = card(20, 'Store A', 24, 62.40, '+ $9.99 shipping'), B = card(40 + CW, 'Store B', 30, 84.00, 'Free shipping');
    hide(A.perRow, B.perRow);
    A.tot.innerHTML = T('\\$62.40+\\$9.99=\\$72.39'); hide(A.tot);
    // the delivery truck
    const truck = hide(add(stage, svgEl('svg', { width: 230, height: 90, class: 'u1l6-svg' }), 30, 264));
    truck.innerHTML = '<rect x="4" y="10" width="140" height="58" rx="6" fill="#c27a0e"/><text x="74" y="48" font-size="24" font-weight="800" fill="#fff" text-anchor="middle">$9.99</text><path d="M144 26 H180 L206 46 V68 H144 Z" fill="#9a6a24"/><rect x="156" y="32" width="24" height="16" rx="2" fill="#dbe9f7"/><circle cx="40" cy="72" r="13" fill="#1c2230"/><circle cx="174" cy="72" r="13" fill="#1c2230"/><circle cx="40" cy="72" r="5" fill="#ccc"/><circle cx="174" cy="72" r="5" fill="#ccc"/>';
    const keys = hide(add(stage, box(cbox('u1l6-keysband', 'Store A on the calculator: <span class="keys"><kbd>(</kbd> 62.40 <kbd>+</kbd> 9.99 <kbd>)</kbd> <kbd>÷</kbd> 24 <kbd>ENTER</kbd></span> → 3.01625'), W - 300, 50), 280, 286));
    const diff = hide(add(stage, box(cbox('u1l6-note wide', `Store B is cheaper by about ${T('\\$3.016-\\$2.80\\approx\\$0.22')} per bottle.`), W - 300, 50), 280, 350));
    const look = hide(stamp(stage, 'Looks cheaper?', { ok: null, x: 20 + CW / 2, y: 120, rotate: -7 }));
    const win = hide(stamp(stage, 'BETTER BUY', { ok: true, x: 40 + CW + CW / 2, y: 120, rotate: -7, size: 'lg' }));
    return [
      { cap: `(a) Store A <b>without</b> shipping: ${T('\\$62.40\\div24=\\$2.60')} per bottle.`, run: async (c) => { await c.fadeIn(A.perRow); await countTo(c, A.per, 0, 2.60, 600, (v) => M(v)); } },
      { cap: `Store B: ${T('\\$84.00\\div30=\\$2.80')} per bottle, and shipping is free.`, run: async (c) => { await c.fadeIn(B.perRow); await countTo(c, B.per, 0, 2.80, 600, (v) => M(v)); } },
      { cap: 'Store A <b>looks</b> cheaper… but you must pay the shipping to get the bottles.', run: (c) => stampIn(c, look) },
      { cap: `(b) Add the shipping <b>before</b> you divide: ${T('\\$62.40+\\$9.99=\\$72.39')}.`,
        run: async (c) => { await c.anim(truck, [{ opacity: 0, transform: 'translateX(-290px)' }, { opacity: 1, transform: 'translateX(0)' }], 900, { easing: 'cubic-bezier(.3,.8,.4,1)' }); await c.pop(A.tot); } },
      { cap: `${T('\\$72.39\\div24\\approx\\$3.016')} per bottle. Store A is not cheaper after all!`,
        run: async (c) => { await c.anim(look, [{ opacity: 1 }, { opacity: 0 }], 250); await c.fadeIn(keys); await countTo(c, A.per, 2.60, 3.01625, 700, (v) => '$' + v.toFixed(3)); A.per.classList.add('bad'); } },
      { cap: '<b>Store B</b> is the better buy, by about <b>$0.22</b> per bottle.', run: async (c) => { await stampIn(c, win); await c.fadeIn(diff); } }
    ];
  }
};

/* =====================================================================================
 * 8. Jasmine's spinach: cheaper per 100 g, but it spoils
 * ===================================================================================== */
const spoil = {
  title: 'The best buy for Jasmine',
  height: 420,
  minW: 900,
  ask: 'Example 8: Jasmine lives on her own and eats about 100 g of spinach a week. Fresh spinach stays good for about 5 days. A 142 g box costs $3.49; a 1 kg tub costs $10.99.',
  make(stage, k, ex) {
    const W = ex.W, LX = 60, RX = W - 330;
    prodAt(stage, 'clam', 112, LX + 120, 150);
    add(stage, box(h('div', 'u1l6-plab', '142 g box · <b>$3.49</b>'), 240, 30), LX, 156);
    const tB = hide(add(stage, box(cbox('u1l6-ktag', `${T('3.49\\div142\\times100')}<br>≈ <b>$2.458</b> per 100 g`), 260, 72), LX - 10, 186));
    // the tub (custom, so its spinach can go down and turn brown)
    const tub = add(stage, svgEl('svg', { width: 220, height: 150, viewBox: '0 0 220 150', class: 'u1l6-svg' }), RX + 40, 4);
    const GR = '#3c8d2f', BRN = '#7d6a2a', top = 34, bot = 140;
    svgEl('path', { d: 'M14 24 H206 L194 144 H26 Z', fill: '#f2f8ef', stroke: GR, 'stroke-width': 3, 'stroke-linejoin': 'round' }, tub);
    const fill = svgEl('rect', { x: 26, y: top, width: 168, height: bot - top, fill: GR, opacity: 0.85 }, tub);
    svgEl('rect', { x: 8, y: 14, width: 204, height: 14, rx: 6, fill: '#fff', stroke: GR, 'stroke-width': 2.5 }, tub);
    add(stage, box(h('div', 'u1l6-plab', '1 kg tub · <b>$10.99</b>'), 240, 30), RX + 30, 156);
    const tT = hide(add(stage, box(cbox('u1l6-ktag', `${T('10.99\\div1000\\times100')}<br>≈ <b>$1.099</b> per 100 g`), 260, 72), RX + 20, 186));
    const cheap = hide(stamp(stage, 'Cheaper on price', { ok: null, x: RX + 150, y: 74, rotate: -7 }));
    // five days
    const DX = W / 2 - 300, days = [];
    for (let i = 0; i < 6; i++) days.push(hide(add(stage, box(h('div', 'u1l6-day' + (i === 5 ? ' bad' : ''), i === 5 ? 'Day 6<small>spoiled</small>' : `Day ${i + 1}<small>${i === 0 ? 'opened' : 'eats some'}</small>`), 88, 58), DX + i * 98, 262)));
    const eaten = hide(add(stage, box(cbox('u1l6-eaten', 'Jasmine has eaten<br>about <b>100 g</b>'), 220, 60), RX - 236, 70));
    // the bin and the wasted spinach
    const bin = hide(add(stage, svgEl('svg', { width: 90, height: 96, viewBox: '0 0 90 96', class: 'u1l6-svg' }), W - 110, 318));
    bin.innerHTML = '<rect x="10" y="20" width="70" height="72" rx="6" fill="#8a929c"/><rect x="4" y="10" width="82" height="12" rx="4" fill="#5b6470"/><path d="M28 34 V80 M45 34 V80 M62 34 V80" stroke="#5b6470" stroke-width="4"/>';
    const blob = hide(add(stage, box(h('div', 'u1l6-blob', '≈ 900 g'), 120, 54), RX + 90, 60));
    const winB = hide(stamp(stage, 'Best buy for Jasmine', { ok: true, x: LX + 120, y: 76, rotate: -7 }));
    const noT = hide(stamp(stage, 'Wasted ✗', { ok: false, x: RX + 150, y: 74, rotate: 6 }));
    const why = hide(add(stage, box(cbox('u1l6-note wide', 'A different person, a different best buy: a <b>family of five</b> eats spinach every day, so the tub would not spoil. <b>No room</b> in the fridge? Then the small box.'), W - 180, 64), 20, 336));
    const level = (v) => { const y = bot - (bot - top) * v; fill.setAttribute('y', y); fill.setAttribute('height', bot - y); };
    return [
      { cap: `(a) Per 100 g: the box is about <b>$2.458</b>; the tub (1 kg = 1000 g) is about <b>$1.099</b>.`, run: async (c) => { await c.fadeIn(tB); await c.fadeIn(tT); } },
      { cap: 'On price alone, the tub wins: <b>less than half</b> the price per 100 g.', run: (c) => stampIn(c, cheap) },
      { cap: 'But Jasmine eats only about <b>100 g a week</b>, and spinach goes bad in about <b>5 days</b>.',
        run: async (c) => { await c.anim(cheap, [{ opacity: 1 }, { opacity: 0 }], 250); for (let i = 0; i < 5; i++) { await c.pop(days[i], 260); await tween(c, 260, (t) => level(1 - 0.1 * (i + t) / 5)); } await c.fadeIn(eaten); } },
      { cap: 'Day 6: the rest has spoiled. About <b>900 g</b> goes in the garbage.',
        run: async (c) => { await c.pop(days[5], 300); await tween(c, 500, (t) => fill.setAttribute('fill', mixHex(GR, BRN, t))); await appear(c, bin, 250); await c.pop(blob, 300); await tween(c, 500, (t) => level(0.9 * (1 - t))); await c.anim(blob, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `translate(${W - RX - 215}px, 279px) scale(.4)` }], 800); } },
      { cap: 'She would pay $10.99 for about 100 g of spinach. The <b>142 g box</b> is the better buy for Jasmine.', run: async (c) => { await stampIn(c, noT); await stampIn(c, winB); } },
      { cap: '(c) Other reasons can change the best buy: <b>who</b> eats it, and <b>where</b> you store it.', run: (c) => c.fadeIn(why) }
    ];
  }
};

/* =====================================================================================
 * 9. The deli scale: cost = unit price × amount
 * ===================================================================================== */
const DS = {
  chart: { ask: 'Example 9(a): Kai works at a deli. Black Forest ham is $2.36 per 100 g. Complete his price chart.' },
  prop: { ask: 'Ham is $2.36 per 100 g. What does 350 g cost? Write it as a proportion.' },
  trail: { ask: 'Example 9(b): a 400 g bag of trail mix costs $5.60. At the same unit price, how much would 1.5 kg cost?' }
};
const deliScale = {
  title: 'The deli scale: cost = unit price × amount',
  height: 410,
  minW: 900,
  choices: [{ sep: 'Example 9 check:' }, { v: 'chart', label: '(a) Kai’s price chart' }, { v: 'trail', label: '(b) Trail mix' }, { sep: 'More:' }, { v: 'prop', label: '350 g as a proportion' }],
  ask: (k) => DS[k].ask,
  make(stage, k, ex) {
    const W = ex.W, ham = k !== 'trail', rate = ham ? 2.36 : 1.40;
    // the scale (left)
    const sv = add(stage, svgEl('svg', { width: 440, height: 400, class: 'u1l6-svg' }), 16, 4);
    sv.innerHTML = '<rect x="70" y="196" width="300" height="14" rx="6" fill="#9aa3ad"/><rect x="205" y="210" width="30" height="40" fill="#7a838d"/><rect x="30" y="246" width="380" height="148" rx="16" fill="#e1e5ea" stroke="#6b7480" stroke-width="3"/>';
    const pile = svgEl('g', {}, sv);
    const disp = add(stage, box(h('div', 'u1l6-deli'), 350, 110), 61, 266);
    disp.innerHTML = `<div><small>WEIGHT</small><b class="w">0 g</b></div><div><small>$ / 100 g</small><b class="r">${ham ? '2.36' : '?'}</b></div><div><small>TOTAL</small><b class="t">$0.00</b></div>`;
    const dw = disp.querySelector('.w'), dr = disp.querySelector('.r'), dt = disp.querySelector('.t');
    const setPile = (g) => {
      pile.innerHTML = ''; if (!g) return;
      if (ham) { const n = Math.max(2, Math.round(Math.sqrt(g / 5))); for (let i = 0; i < n; i++) svgEl('ellipse', { cx: 220 + ((i * 37) % 23) - 11, cy: 188 - i * 6, rx: 86, ry: 12, fill: i % 2 ? '#f0a3a8' : '#e98990', stroke: '#c0606a', 'stroke-width': 1.5 }, pile); }
      else { const s = Math.sqrt(g / 1500); svgEl('path', { d: `M${220 - 120 * s - 20} 196 Q220 ${196 - 170 * s - 20} ${220 + 120 * s + 20} 196 Z`, fill: '#c9a26b', stroke: '#7a5a2a', 'stroke-width': 2 }, pile); }
    };
    const weigh = async (c, g0, g1, cost0, cost1) => {
      setPile(g1); await c.anim(pile, [{ opacity: 0, transform: 'translateY(-30px)' }, { opacity: 1, transform: 'none' }], 350);
      await tween(c, 800, (t) => { dw.textContent = Math.round(lerp(g0, g1, t)) + ' g'; dt.textContent = M(lerp(cost0, cost1, t)); });
    };
    const RX = 480, RW = W - RX - 14;
    if (k === 'chart') {
      const rows = [[100, 1, 2.36], [50, 0.5, 1.18], [150, 1.5, 3.54], [350, 3.5, 8.26], [1000, 10, 23.60]];
      const tb = add(stage, box(h('table', 'u1l6-dtbl'), RW, 360), RX, 10);
      tb.innerHTML = '<tr><th>Amount</th><th>Work</th><th>Cost</th></tr>' + rows.map(([g, m, cst]) => `<tr><td>${g === 1000 ? '1 kg' : g + ' g'}</td><td><span class="w">${g === 100 ? '' : T(`${m}\\times2.36`)}</span></td><td><span class="c">${M(cst)}</span></td></tr>`).join('');
      const cells = [...tb.querySelectorAll('tr')].slice(1).map((r) => [r.querySelector('.w'), r.querySelector('.c')]);
      cells.forEach(([a, b]) => hide(a, b));
      const caps = ['Ham is <b>$2.36 per 100 g</b>: 100 g on the scale costs $2.36.', `50 g is <b>half</b> of 100 g: ${T('0.5\\times\\$2.36=\\$1.18')}.`, `150 g is <b>1.5 hundreds</b>: ${T('1.5\\times\\$2.36=\\$3.54')}.`, `350 g is <b>3.5 hundreds</b>: ${T('3.5\\times\\$2.36=\\$8.26')}.`, `1 kg = 1000 g = <b>10 hundreds</b>: ${T('10\\times\\$2.36=\\$23.60')}.`];
      return rows.map(([g, , cst], i) => ({ cap: caps[i], run: async (c) => { cells.forEach(([a, b], j) => { a.parentElement.parentElement.classList.toggle('on', j === i); }); await weigh(c, 0, g, 0, cst); await c.pop(cells[i][0], 300); await c.pop(cells[i][1], 300); } }));
    }
    if (k === 'prop') {
      const pr = add(stage, box(h('div', 'u1l6-prop'), RW, 230), RX, 30);
      pr.innerHTML = `<div class="f">${T('\\dfrac{\\$2.36}{100\\text{ g}}=\\dfrac{x}{350\\text{ g}}')}</div><div class="a1">× 3.5</div><div class="a2">× 3.5</div>`;
      const a1 = hide(pr.querySelector('.a1')), a2 = hide(pr.querySelector('.a2'));
      const res = hide(add(stage, box(cbox('u1l6-res', `${T('x=3.5\\times\\$2.36=\\$8.26')}`), RW, 52), RX, 290));
      return [
        { cap: 'Set up the proportion: $2.36 for 100 g, and <b>x</b> for 350 g.', run: (c) => weigh(c, 0, 100, 0, 2.36) },
        { cap: '100 g × <b>3.5</b> = 350 g on the bottom, so multiply the top by <b>3.5</b> too.', run: async (c) => { await c.pop(a2); await c.pop(a1); } },
        { cap: `${T('x=3.5\\times\\$2.36=\\$8.26')}. The scale agrees.`, run: async (c) => { await weigh(c, 100, 350, 2.36, 8.26); await c.pop(res); } }
      ];
    }
    // trail mix: unit price first, then the cost of 1.5 kg
    const rt = add(stage, box(h('div', 'u1l6-rt'), RW, 300), RX, 20);
    rt.innerHTML = `<div class="r r1"><span>400 g</span><b>$5.60</b></div><div class="r r2"><span>100 g</span><b>$1.40</b></div><div class="r r3"><span>1500 g</span><b>$21.00</b></div><div class="ar a1">÷ 4</div><div class="ar a2">× 15</div><div class="kgnote">1.5 kg = 1500 g = 15 hundreds</div>`;
    const [r2, r3, a1, a2, kn] = ['.r2', '.r3', '.a1', '.a2', '.kgnote'].map((s) => hide(rt.querySelector(s)));
    return [
      { cap: 'The 400 g bag costs $5.60. Find the <b>unit price</b> first.', run: (c) => weigh(c, 0, 400, 0, 5.60) },
      { cap: `${T('\\$5.60\\div400\\times100=\\$1.40')} per 100 g.`, run: async (c) => { await c.pop(a1); await c.pop(r2); dr.textContent = '1.40'; await pulse(c, dr, 1.3, 400); } },
      { cap: 'Same unit: <b>1.5 kg = 1500 g = 15 hundreds</b>.', run: (c) => c.fadeIn(kn) },
      { cap: `${T('15\\times\\$1.40=\\$21.00')}. 1.5 kg would cost <b>$21.00</b>.`, run: async (c) => { await c.pop(a2); await weigh(c, 400, 1500, 5.60, 21.00); await c.pop(r3); } }
    ];
  }
};

/* =====================================================================================
 * 10. Malik's floor, box by box (Full notes)
 * ===================================================================================== */
const flooring = {
  title: 'Malik’s floor, box by box',
  height: 400,
  minW: 900,
  ask: 'Example 9(c): a box of laminate covers 2.4 m² and costs $67.20. Malik’s floor is 3 m by 4 m. (i) Price per m²? (ii) Area? (iii) How many boxes, and what do they cost?',
  make(stage, k, ex) {
    const W = ex.W, U = 98, GX = 64, GY = 56, COLS = 4, ROWS = 3;
    const sv = add(stage, svgEl('svg', { width: 500, height: 400, class: 'u1l6-svg' }), 0, 0);
    svgEl('rect', { x: GX, y: GY, width: COLS * U, height: ROWS * U, fill: '#fbf7f0', stroke: '#6e4a1c', 'stroke-width': 3 }, sv);
    const sq = [];
    for (let r = 0; r < ROWS; r++) for (let q = 0; q < COLS; q++) { const e = svgEl('rect', { x: GX + q * U, y: GY + r * U, width: U, height: U, fill: 'none', stroke: '#c9b697', 'stroke-width': 1.5 }, sv); sq.push(e); }
    const nums = [];
    for (let i = 0; i < 12; i++) { const t = svgEl('text', { x: GX + (i % 4) * U + U / 2, y: GY + Math.floor(i / 4) * U + U / 2 + 8, 'text-anchor': 'middle', class: 'u1l6-sqn' }, sv); t.textContent = i + 1; nums.push(t); hide(t); }
    add(stage, box(h('div', 'u1l6-dim', '4 m'), COLS * U, 28), GX, GY - 34);
    add(stage, box(h('div', 'u1l6-dim', '3 m'), 50, 28), GX - 56, GY + ROWS * U / 2 - 14);
    // the boxes laid row by row: box j covers area [2.4 j, 2.4 (j+1)]
    const COL = ['#f2c879', '#9fc5e8', '#b6d7a8', '#f4b6c2', '#c9b3e6'];
    const boxes = [];
    for (let j = 0; j < 5; j++) {
      const g = svgEl('g', {}, sv), segs = []; let a = 2.4 * j; const b = 2.4 * (j + 1);
      while (a < b - 1e-9) { const row = Math.floor(a / 4 + 1e-9), x0 = a - row * 4, x1 = Math.min(4, x0 + (b - a)); segs.push([row, x0, x1]); a += x1 - x0; }
      const rects = segs.map(([row, x0, x1]) => { const e = svgEl('rect', { x: GX + x0 * U + 1.5, y: GY + row * U + 1.5, width: 0, height: U - 3, fill: COL[j], stroke: '#5b4a33', 'stroke-width': 1.5 }, g); e.w = (x1 - x0) * U - 3; return e; });
      const t = svgEl('g', {}, g);
      segs.forEach(([row, x0, x1]) => { const e = svgEl('text', { x: GX + (x0 + x1) / 2 * U, y: GY + row * U + U / 2 + 7, 'text-anchor': 'middle', class: 'u1l6-bxn' }, t); e.textContent = 'Box ' + (j + 1); });
      hide(t);
      boxes.push({ rects, t });
    }
    const PX = 500, PW = W - PX - 20;
    const card = add(stage, box(cbox('u1l6-lbox', '<b>1 box</b> covers 2.4 m² · <b>$67.20</b>'), PW, 44), PX, 20);
    const L = [
      `(i) ${T('\\$67.20\\div2.4=\\$28.00')} per m²`,
      `(ii) ${T('3\\times4=12')} m²`,
      `(iii) ${T('12\\div2.4=5')} boxes`,
      `${T('5\\times\\$67.20=\\$336.00')}`,
      `Check: ${T('12\\times\\$28.00=\\$336.00')} ✓`
    ].map((s, i) => hide(add(stage, box(h('div', 'u1l6-fl' + (i === 3 ? ' big' : ''), s), PW, 50), PX, 80 + i * 60)));
    void card;
    return [
      { cap: `(i) Price per m²: ${T('\\$67.20\\div2.4=\\$28.00')}.`, run: (c) => c.fadeIn(L[0]) },
      { cap: `(ii) The floor is 3 m by 4 m: area = ${T('3\\times4=12')} m². Count the squares!`, run: async (c) => { for (const t of nums) await c.pop(t, 140); await c.fadeIn(L[1]); } },
      { cap: '(iii) Lay the boxes down one at a time. Each box covers <b>2.4 m²</b>.',
        run: async (c) => { await Promise.all(nums.map((t) => c.anim(t, [{ opacity: 1 }, { opacity: 0 }], 200))); for (const b of boxes) { for (const r of b.rects) await tween(c, 260, (t) => r.setAttribute('width', r.w * t)); await c.pop(b.t, 200); } } },
      { cap: `Exactly <b>5 boxes</b>: ${T('12\\div2.4=5')}.`, run: (c) => c.fadeIn(L[2]) },
      { cap: `They cost ${T('5\\times\\$67.20=\\$336.00')}. Check with the price per m²: ${T('12\\times\\$28.00=\\$336.00')} ✓`, run: async (c) => { await c.fadeIn(L[3]); await c.fadeIn(L[4]); } }
    ];
  }
};

mountExplainers({ unitPrice, wrongWay, per100, shelf, meatScale, multiBuy, shipping, spoil, deliScale, flooring });

/* ============ Stand Up Break! — unit prices, best buys, deals and the cost of any amount, at the whiteboards ============ */
{
  const dd = (v) => rnd(v, 2).toFixed(2), d3 = (v) => rnd(v, 3).toFixed(3);
  const PACKS = [['granola bars', 'bar'], ['juice boxes', 'box'], ['markers', 'marker'], ['light bulbs', 'bulb'], ['muffins', 'muffin'], ['hockey tape rolls', 'roll'], ['tennis balls', 'ball'], ['pens', 'pen']];
  const SIZES = [['crackers', 'g'], ['shampoo', 'mL'], ['rice', 'g'], ['orange juice', 'mL'], ['coffee', 'g'], ['laundry soap', 'mL']];
  standup('u1l6', {
    intro: 'Estimate first, then use your calculator. Show the unit price of each choice.',
    levels: {
      BEG: (r) => { // the unit price of a pack
        const [what, one] = r.pick(PACKS), n = r.pick([3, 4, 5, 6, 8, 10, 12]), unit = r.int(45, 260) / 100, price = rnd(unit * n + r.pick([0, 0, 0.01, -0.01, 0.02]), 2), up = price / n;
        return { text: `A pack of <b>${n} ${what}</b> costs <b>$${dd(price)}</b>. Estimate, then find the price of one ${one}. Round to the nearest cent.`, q: '',
          a: Math.abs(up - rnd(up, 2)) < 1e-9 ? [`${dd(price)}\\div${n}=\\$${dd(up)}\\text{ per ${one}}`] : [`${dd(price)}\\div${n}=${rnd(up, 4)}`, `\\approx\\$${dd(up)}\\text{ per ${one}}`] };
      },
      PRG: (r) => { // compare two sizes per 100 g / mL
        const [what, u] = r.pick(SIZES); let q1, q2, p1, p2, v1, v2;
        do { q1 = r.pick([250, 300, 340, 400, 450, 500]); q2 = r.pick([750, 900, 1000, 1200]); p1 = r.int(199, 699) / 100; p2 = rnd(p1 * q2 / q1 * (r.int(84, 112) / 100), 2); v1 = rnd(p1 / q1 * 100, 3); v2 = rnd(p2 / q2 * 100, 3); } while (Math.abs(v1 - v2) < 0.004);
        return { text: `${what[0].toUpperCase() + what.slice(1)}: <b>${q1} ${u}</b> for <b>$${dd(p1)}</b>, or <b>${q2} ${u}</b> for <b>$${dd(p2)}</b>. Which is the better buy? Show the price per 100 ${u}.`, q: '',
          a: [`${dd(p1)}\\div${q1}\\times100\\approx\\$${d3(v1)}`, `${dd(p2)}\\div${q2}\\times100\\approx\\$${d3(v2)}`, `\\text{The ${v1 < v2 ? q1 : q2} ${u} size is the better buy.}`] };
      },
      MAS: (r) => r.pick([
        () => { // shipping flips the verdict (or not)
          const nA = r.pick([20, 24, 30]), nB = r.pick([36, 40, 48]), uA = r.int(180, 260) / 100, pA = rnd(uA * nA, 2), sh = r.pick([7.99, 9.99, 12.50, 14.99]), uB = rnd(uA + r.int(5, 30) / 100, 2), pB = rnd(uB * nB, 2);
          const realA = (pA + sh) / nA, realB = pB / nB;
          return { text: `Store A: <b>${nA}</b> soccer balls for <b>$${dd(pA)}</b> plus <b>$${dd(sh)}</b> shipping. Store B: <b>${nB}</b> soccer balls for <b>$${dd(pB)}</b> with free shipping. Which store is the better buy, and by how much per ball?`, q: '',
            a: [`\\text{A: }(${dd(pA)}+${dd(sh)})\\div${nA}\\approx\\$${d3(realA)}`, `\\text{B: }${dd(pB)}\\div${nB}\\approx\\$${d3(realB)}`, `\\text{Store ${realA < realB ? 'A' : 'B'}, by about }\\$${dd(Math.abs(realA - realB))}\\text{ per ball}`] };
        },
        () => { // cost of a different amount, with a unit change
          const g = r.pick([200, 300, 400, 500]), per = r.int(85, 340) / 100, p = rnd(per * g / 100, 2), kg = r.pick([1.5, 2, 2.5, 3]), cost = per * kg * 10;
          return { text: `A <b>${g} g</b> bag of mixed nuts costs <b>$${dd(p)}</b>. At the same unit price, how much would <b>${kg} kg</b> cost?`, q: '',
            a: [`${dd(p)}\\div${g}\\times100=\\$${dd(per)}\\text{ per 100 g}`, `${kg}\\text{ kg}=${kg * 1000}\\text{ g}=${kg * 10}\\text{ hundreds}`, `${kg * 10}\\times\\$${dd(per)}=\\$${dd(cost)}`] };
        }
      ])()
    }
  });
}
