/* Math 10-3 · Unit 1 · Lesson 8 — Setting a Price: Markup and Sales Tax.
 * Explainers: the cost bar that grows by its markup (cost + markup = retail, and the × (1 + rate) shortcut), percent to a
 * decimal with a hopping decimal point (Full notes), the markup percent read off a "cost ruler", divide by the original
 * vs the new price with verdict stamps (Full notes), the Canada tax map (GST / PST / HST tiles, totals across the
 * country), estimating 5% as half of 10%, GST and PST on their own receipt lines vs the shortcut (and the 1¢ case), the
 * price tag that grows from the supplier to the shelf to the till, tax on the tag vs on the cost (Full notes), and Ava's
 * receipt that fills itself in. Then the Stand Up Break. */
import { h, add, box, tex, svgEl, pulse, tween, stamp, stampIn, mountExplainers } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const rnd = (v, d = 2) => Math.round((v + (v >= 0 ? 1e-9 : -1e-9)) * 10 ** d) / 10 ** d;
const M = (v, d = 2) => '$' + rnd(v, d).toFixed(d);          // money text
const Mm = M;
const MT = (v, d = 2) => '\\$' + rnd(v, d).toFixed(d);       // money TeX
const MTm = MT;
const D2 = (v) => (v / 100).toFixed(2);                       // 40 → "0.40", 5 → "0.05", 150 → "1.50"
const D1 = (v) => (1 + v / 100).toFixed(2);                   // 40 → "1.40"
const lerp = (a, b, t) => a + (b - a) * t;
const cbox = (cls, html) => h('div', cls + ' u1l8-c', `<div>${html}</div>`);
const line = (stage, html, x, y, w, cls = '') => hide(add(stage, box(h('div', 'u1l8-ln ' + cls, html), w, 40), x, y));
/** count a money amount up inside el */
const countTo = (c, el, a, b, ms = 700, pre = '$') => tween(c, ms, (t) => { el.textContent = pre + lerp(a, b, t).toFixed(2); });
/** move an absolutely placed element */
const moveTo = (c, el, x, y, ms = 700) => { const x0 = parseFloat(el.style.left), y0 = parseFloat(el.style.top); return tween(c, ms, (t) => { el.style.left = lerp(x0, x, t) + 'px'; el.style.top = lerp(y0, y, t) + 'px'; }); };
const growW = (c, el, w, ms = 700) => tween(c, ms, (t) => { el.style.width = w * t + 'px'; });

/* =====================================================================================
 * 1. Cost + markup = retail: the bar grows
 * ===================================================================================== */
const MK = {
  e1: { ask: 'Example 1: a bike shop pays <b>$48.00</b> for a helmet. It uses a markup of <b>40%</b>. Find the markup and the retail price.',
    cost: 48, pct: 40, b: 'cost', a: 'markup', t: 'retail price', tw: 'retail', end: 'The helmet sells for <b>$67.20</b>.' },
  e2a: { ask: 'Example 2(a): a kiosk pays <b>$6.50</b> for a phone case. Its markup is <b>180%</b>. Find the markup and the retail price.',
    cost: 6.5, pct: 180, b: 'cost', a: 'markup', t: 'retail price', tw: 'retail', end: 'The case sells for <b>$18.20</b>.', big: true },
  e2b: { ask: 'Example 2(b): a café buys a box of <b>24</b> granola bars for <b>$21.60</b>. It marks them up <b>150%</b>. What does it charge for one bar?',
    cost: 0.9, pct: 150, box: 21.6, n: 24, b: 'cost', a: 'markup', t: 'retail price', tw: 'retail', end: 'One bar costs <b>$2.25</b>.', big: true },
  e4b: { ask: 'Example 4(b): a pizza place raises the price of a <b>$17.50</b> pizza by <b>8%</b>. What is the new price?',
    cost: 17.5, pct: 8, b: 'old price', a: 'increase', t: 'new price', tw: 'new price', end: 'The pizza now costs <b>$18.90</b>.' }
};
const markup = {
  title: 'Cost + markup = retail price',
  height: 400,
  minW: 900,
  choices: [{ sep: 'Example check:' }, { v: 'e1', label: '1 Helmet, 40%' }, { v: 'e2a', label: '2(a) Case, 180%' }, { v: 'e2b', label: '2(b) Granola bar, 150%' }, { sep: 'Price goes up:' }, { v: 'e4b', label: '4(b) Pizza, +8%' }],
  ask: (k) => MK[k].ask,
  make(stage, k, ex) {
    const d = MK[k], W = ex.W, r = d.pct / 100, mk = rnd(d.cost * r), tot = rnd(d.cost + mk);
    const X0 = 40, U = Math.min(430, (W - 80) / (1 + r)), BY = 136, BH = 70;
    const cap = (s) => s[0].toUpperCase() + s.slice(1);
    // the facts
    const c1 = add(stage, box(cbox('u1l8-chip', d.box ? `Box of ${d.n}: <b>${M(d.box)}</b>` : `${cap(d.b)}: <b>${M(d.cost)}</b>`), 220, 48), 24, 8);
    add(stage, box(cbox('u1l8-chip a', `${cap(d.a)}: <b>${d.pct}%</b>`), 190, 48), 256, 8);
    const dec = hide(add(stage, box(cbox('u1l8-dec', `${d.pct}% = <b>${D2(d.pct)}</b>`), 220, 52), W - 244, 8));
    const one = d.box ? hide(add(stage, box(cbox('u1l8-chip', `1 bar: ${T(`${MT(d.box)}\\div${d.n}=${MT(d.cost)}`)}`), W - 244 - 12 - 458, 48), 458, 8)) : null;
    // the bars
    const bc = add(stage, box(cbox('u1l8-bar cst', U >= 120 ? `${d.b}<br><b>${M(d.cost)}</b>` : `<b>${M(d.cost)}</b>`), U, BH), X0, BY);
    if (d.box) hide(bc);
    const bm = hide(add(stage, box(cbox('u1l8-bar mku', U * r >= 110 ? `${d.a}<br><b>${M(mk)}</b>` : ''), 0, BH), X0 + U, BY));
    const p1 = add(stage, box(h('div', 'u1l8-pl', '100%'), U, 26), X0, BY + BH + 4);
    if (d.box) hide(p1);
    const p2 = hide(add(stage, box(h('div', 'u1l8-pl m', d.pct + '%'), Math.max(U * r, 50), 26), X0 + U + Math.min(0, U * r - 50) / 2, BY + BH + 4));
    // the bracket over both
    const TW = U * (1 + r), sv = add(stage, svgEl('svg', { width: W, height: 400, class: 'u1l8-svg' }), 0, 0);
    const br = svgEl('path', { d: `M${X0} ${BY - 6} V${BY - 20} H${X0 + TW} V${BY - 6}`, fill: 'none', stroke: '#12805a', 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, sv); hide(br);
    const LW = 360, LX = Math.max(8, Math.min(W - LW - 8, X0 + TW / 2 - LW / 2));
    const bl = hide(add(stage, box(cbox('u1l8-brl', `${d.t}: <b>${M(tot)}</b>`), LW, 38), LX, BY - 62));
    const bp = hide(add(stage, box(cbox('u1l8-pct', `${100 + d.pct}%`), 90, 34), Math.min(W - 98, LX + LW + 6), BY - 60));
    // the work
    const L1 = line(stage, `${d.a} = ${T(`${MT(d.cost)}\\times${D2(d.pct)}=${MT(mk)}`)}`, 40, 250, W - 80);
    const L2 = line(stage, `${d.tw} = ${T(`${MT(d.cost)}+${MT(mk)}=${MT(tot)}`)}`, 40, 296, W - 80);
    const L3 = line(stage, `Shortcut: ${T(`1+${D2(d.pct)}=${D1(d.pct)}`)} &nbsp;→&nbsp; ${T(`${MT(d.cost)}\\times${D1(d.pct)}=${MT(tot)}`)} ✓ &nbsp; ${d.end}`, 40, 342, W - 80, 'ok');
    const steps = [];
    if (d.box) steps.push({ cap: `First find the <b>cost of one bar</b>: ${T(`${MT(d.box)}\\div${d.n}=${MT(d.cost)}`)}.`, run: async (c) => { await c.pop(one); await Promise.all([c.fadeIn(bc), c.fadeIn(p1)]); } });
    void c1;
    steps.push(
      { cap: `Change the percent to a decimal: <b>${d.pct}% = ${D2(d.pct)}</b>.`, run: (c) => c.pop(dec) },
      { cap: `${cap(d.a)} = ${d.b} × rate: ${T(`${MT(d.cost)}\\times${D2(d.pct)}=${MT(mk)}`)}.${d.big ? ` <b>${d.pct}%</b> is more than 100%, so the ${d.a} is <b>more than the cost</b>.` : ''}`,
        run: async (c) => { bm.style.opacity = 1; await growW(c, bm, U * r, 800); await Promise.all([c.fadeIn(p2), c.fadeIn(L1)]); } },
      { cap: `${cap(d.t)} = ${d.b} + ${d.a}: ${T(`${MT(d.cost)}+${MT(mk)}=${MT(tot)}`)}.`, run: async (c) => { await c.fadeIn(br); await Promise.all([c.pop(bl), c.fadeIn(L2)]); } },
      { cap: `Shortcut: 100% + ${d.pct}% = <b>${100 + d.pct}%</b> = ${D1(d.pct)}. So ${T(`${MT(d.cost)}\\times${D1(d.pct)}=${MT(tot)}`)} ✓`, run: async (c) => { await c.pop(bp); await c.fadeIn(L3); } }
    );
    return steps;
  }
};

/* =====================================================================================
 * 2. Percent to a decimal: the point hops two places (Full notes)
 * ===================================================================================== */
const decimalSlide = {
  title: 'Percent to a decimal: two hops left',
  height: 390,
  minW: 900,
  choices: [{ sep: 'Try:' }, { v: 40, label: '40%' }, { v: 5, label: '5%' }, { v: 180, label: '180%' }, { v: 60, label: '60%' }, { v: 8, label: '8%' }],
  ask: (p) => `Write <b>${p}%</b> as a decimal. Then find the “multiply by” number for a ${p}% markup.`,
  make(stage, p, ex) {
    const W = ex.W, s = String(p).padStart(3, '0'), CW = 92, CH = 116, n = s.length;
    const X0 = (W - (n * CW + 100)) / 2, Y = 40, ghosts = String(p).length < 3 ? 3 - String(p).length : 0;
    const cells = [...s].map((ch, i) => { const e = add(stage, box(h('div', 'u1l8-dig' + (i < ghosts ? ' ghost' : ''), ch), CW - 8, CH), X0 + i * CW + 4, Y); if (i < ghosts) hide(e); return e; });
    const pc = add(stage, box(h('div', 'u1l8-dig pc', '%'), 92, CH), X0 + n * CW + 4, Y);
    const dot = add(stage, box(h('div', 'u1l8-dot'), 22, 22), X0 + n * CW - 11, Y + CH - 26);
    const arcs = add(stage, svgEl('svg', { width: W, height: 390, class: 'u1l8-svg' }), 0, 0);
    const hopX = (j) => X0 + (n - j) * CW;               // the point after j hops
    const arc = (j) => { const a = hopX(j), b = hopX(j + 1); const e = svgEl('path', { d: `M${a} ${Y + CH + 6} Q${(a + b) / 2} ${Y + CH + 56} ${b} ${Y + CH + 6}`, fill: 'none', stroke: '#c27a0e', 'stroke-width': 3.5, 'stroke-dasharray': '7 6' }, arcs); hide(e);
      const t = hide(add(stage, box(h('div', 'u1l8-hopn', String(j + 1)), 40, 26), (a + b) / 2 - 20, Y + CH + 46)); return [e, t]; };
    const A = [arc(0), arc(1)];
    const L0 = line(stage, `${T(`${p}\\%=${p}\\div100`)} &nbsp;(“out of 100”)`, 40, 236, W - 80);
    const val = p / 100, valS = D2(p);
    const res = hide(add(stage, box(cbox('u1l8-res', `${p}% = <b>${valS}</b>`), 300, 50), (W - 300) / 2, 236));
    const no = p < 10 ? hide(add(stage, box(cbox('u1l8-no', `Not ${T(`0.${p}`)}: that is ${p * 10}%!`), 360, 44), (W - 360) / 2, 292)) : null;
    const L3 = line(stage, `Shortcut number: ${T(`1+${valS}=${D1(p)}`)} &nbsp;→&nbsp; retail = cost × <b>${D1(p)}</b> (that is ${100 + p}% of the cost)`, 40, p < 10 ? 342 : 300, W - 80, 'ok');
    void val;
    const steps = [
      { cap: `<b>${p}%</b> means ${p} out of 100, so ${p}% = ${p} ÷ 100.`, run: (c) => c.fadeIn(L0) },
      { cap: 'Dividing by 100 moves the decimal point <b>2 places left</b>: hop, hop.',
        run: async (c) => {
          await c.anim(pc, [{ opacity: 1 }, { opacity: 0 }], 300);
          for (let j = 0; j < 2; j++) {
            await c.fadeIn(A[j][0], 200); await c.pop(A[j][1], 200);
            const x0 = hopX(j) - 11, x1 = hopX(j + 1) - 11;
            await tween(c, 520, (t) => { dot.style.left = lerp(x0, x1, t) + 'px'; dot.style.top = (Y + CH - 26 + Math.sin(Math.PI * t) * 40) + 'px'; });
          }
        } },
      { cap: ghosts ? `Fill the empty place${ghosts > 1 ? 's' : ''} with <b>0</b>: ${p}% = <b>${valS}</b>.` : `${p}% = <b>${valS}</b>.`,
        run: async (c) => { await c.anim(L0, [{ opacity: 1 }, { opacity: 0 }], 200); cells.forEach((e, i) => { if (i < ghosts) e.classList.add('fill'); }); await Promise.all(cells.slice(0, ghosts).map((e) => c.pop(e))); await c.pop(res); } }
    ];
    if (no) steps.push({ cap: `Watch out: ${T(`0.${p}`)} would be ${p * 10}%. <b>${p}% is ${valS}</b>.`, run: (c) => c.pop(no) });
    steps.push({ cap: `For the shortcut, add the 100%: ${T(`1+${valS}=${D1(p)}`)}.`, run: (c) => c.fadeIn(L3) });
    return steps;
  }
};

/* =====================================================================================
 * 3. Markup percent: lay the markup on a cost ruler
 * ===================================================================================== */
const MP = {
  e3: { ask: 'Example 3: a skate shop buys a skateboard deck for <b>$32.00</b> and sells it for <b>$56.00</b>. What is the markup percent?',
    o: 32, n: 56, lo: 'cost', ln: 'retail price', inc: 'markup', res: 'The markup is <b>75%</b>.' },
  e4a: { ask: 'Example 4(a): a mechanic raises her hourly rate from <b>$96</b> to <b>$108</b>. What is the percent increase?',
    o: 96, n: 108, lo: 'old rate', ln: 'new rate', inc: 'increase', res: 'Her rate went up <b>12.5%</b>.' },
  c: { ask: 'A store pays <b>$60.00</b> for a jacket and sells it for <b>$90.00</b>. What is the markup percent?',
    o: 60, n: 90, lo: 'cost', ln: 'retail price', inc: 'markup', res: 'The markup is <b>50%</b>.' }
};
const markupPct = {
  title: 'Markup percent: compare with the cost',
  height: 430,
  minW: 900,
  choices: [{ sep: 'Example check:' }, { v: 'e3', label: '3 Skateboard deck' }, { v: 'e4a', label: '4(a) Mechanic' }, { sep: 'Another:' }, { v: 'c', label: '$60 → $90' }],
  ask: (k) => MP[k].ask,
  make(stage, k, ex) {
    const d = MP[k], W = ex.W, inc = d.n - d.o, q = inc / d.o, pct = rnd(q * 100, 1);
    const X0 = 200, u = (W - X0 - 40) / d.n, ow = d.o * u, iw = inc * u, R1 = 14, R2 = 88, BH = 54, RY = 214;
    const cap = (s) => s[0].toUpperCase() + s.slice(1);
    const dm = (v) => (d.o >= 90 ? '$' + v : M(v));     // the mechanic's rates are whole dollars (as in the booklet)
    const mt = (v) => (d.o >= 90 ? '\\$' + v : MT(v));
    add(stage, box(cbox('u1l8-rlab', `${d.lo}<br><b>${dm(d.o)}</b>`), 160, BH), 24, R1);
    add(stage, box(cbox('u1l8-rlab', `${d.ln}<br><b>${dm(d.n)}</b>`), 160, BH), 24, R2);
    const b1 = add(stage, box(h('div', 'u1l8-bar cst'), 0, BH), X0, R1);
    const b2 = add(stage, box(h('div', 'u1l8-bar cst lt'), 0, BH), X0, R2);
    const b3 = add(stage, box(cbox('u1l8-bar mku', `<b>${dm(inc)}</b>`), iw, BH), X0 + ow, R2); hide(b3);
    const sv = add(stage, svgEl('svg', { width: W, height: 430, class: 'u1l8-svg' }), 0, 0);
    const guide = svgEl('line', { x1: X0 + ow, x2: X0 + ow, y1: R1 - 4, y2: R2 + BH + 4, stroke: '#6e4a1c', 'stroke-width': 2.5, 'stroke-dasharray': '6 5' }, sv); hide(guide);
    // the cost ruler 0% … 100%
    const rg = svgEl('g', {}, sv); hide(rg);
    svgEl('rect', { x: X0, y: RY, width: ow, height: 40, rx: 6, fill: '#f3dcb0', stroke: '#9a6a24', 'stroke-width': 3 }, rg);
    for (let i = 0; i <= 10; i++) {
      const x = X0 + ow * i / 10;
      svgEl('line', { x1: x, x2: x, y1: RY + 40, y2: RY + (i % 5 ? 52 : 58), stroke: '#6e4a1c', 'stroke-width': i % 5 ? 2 : 3 }, rg);
      if (i % 5 === 0 || ow > 560) { const t = svgEl('text', { x, y: RY + 76, 'text-anchor': 'middle', class: 'u1l8-tick' + (i % 5 ? ' sm' : '') }, rg); t.textContent = i * 10 + '%'; }
    }
    const rlab = hide(add(stage, box(cbox('u1l8-rlab sm', `${d.lo} ruler`), 160, 40), 24, RY));
    const piece = hide(add(stage, box(h('div', 'u1l8-bar mku ghost'), iw, 40), X0 + ow, R2 + 7));
    const read = hide(add(stage, box(cbox('u1l8-pct', pct + '%'), 96, 34), X0 + iw - 48, RY - 40));
    const L1 = line(stage, `Step 1: ${d.inc} = ${T(`${mt(d.n)}-${mt(d.o)}=${mt(inc)}`)}`, 40, 300, W - 80);
    const L2 = line(stage, `Step 2: ${T(`${mt(inc)}\\div${mt(d.o)}=${rnd(q, 4)}`)}`, 40, 342, W - 80);
    const L3 = line(stage, `Step 3: ${T(`${rnd(q, 4)}\\times100=${pct}\\%`)} &nbsp; ${d.res}`, 40, 384, W - 80, 'ok');
    return [
      { cap: `The ${d.lo} is <b>${dm(d.o)}</b>. The ${d.ln} is <b>${dm(d.n)}</b>.`, run: (c) => Promise.all([growW(c, b1, ow, 700), growW(c, b2, ow, 700)]) },
      { cap: `Step 1: the ${d.inc} is the extra part: ${T(`${mt(d.n)}-${mt(d.o)}=${mt(inc)}`)}.`, run: async (c) => { await c.fadeIn(guide); b3.style.opacity = 1; b3.style.width = '0px'; await growW(c, b3, iw, 600); await c.fadeIn(L1); } },
      { cap: `Compare the ${d.inc} with the <b>${d.lo}</b> (the original). Lay it on a ruler as long as the ${d.lo}: 0% to 100%.`,
        run: async (c) => { await Promise.all([c.fadeIn(rg), c.fadeIn(rlab)]); piece.style.opacity = 1; await moveTo(c, piece, X0, RY, 900); } },
      { cap: `Step 2: ${T(`${mt(inc)}\\div${mt(d.o)}=${rnd(q, 4)}`)}.`, run: async (c) => { await c.fadeIn(L2); await c.pop(read); } },
      { cap: `Step 3: × 100 to get the percent: <b>${pct}%</b>. ${d.res}`, run: async (c) => { await c.fadeIn(L3); await pulse(c, read, 1.15); } }
    ];
  }
};

/* =====================================================================================
 * two-column verdict (used by "divide by the original" and "tax the tag")
 * ===================================================================================== */
function verdict(stage, W, top, cols) {
  const CW = (W - 100) / 2, out = {};
  out.top = hide(add(stage, box(cbox('u1l8-band', top), W - 120, 50), 60, 6));
  out.cols = cols.map((cl, i) => {
    const x = 40 + i * (CW + 20);
    const head = add(stage, box(cbox('u1l8-vh ' + (cl.ok ? 'ok' : 'no'), cl.head), CW, 44), x, 74);
    const body = cl.lines.map((s, j) => add(stage, box(cbox('u1l8-vl', s), CW, 44), x, 128 + j * 50));
    const st = stamp(stage, cl.stamp, { ok: cl.ok, x: x + CW / 2, y: 128 + cl.lines.length * 50 + 40, rotate: cl.ok ? -6 : 6 });
    return [head, ...body, st].map((e) => hide(e));
  });
  return out;
}

/* =====================================================================================
 * 4. Divide by the original, not the new price (Full notes)
 * ===================================================================================== */
const WB = {
  e3: { o: 32, n: 56, lo: 'cost', ln: 'retail price', ask: 'Example 3: cost <b>$32.00</b>, retail price <b>$56.00</b>. Which division gives the markup percent?' },
  e4a: { o: 96, n: 108, lo: 'old rate', ln: 'new rate', ask: 'Example 4(a): the rate went from <b>$96</b> to <b>$108</b>. Which division gives the percent increase?' }
};
const wrongBase = {
  title: 'Divide by the original',
  height: 330,
  minW: 900,
  choices: [{ sep: 'Example:' }, { v: 'e3', label: '3 Skateboard deck' }, { v: 'e4a', label: '4(a) Mechanic' }],
  ask: (k) => WB[k].ask,
  make(stage, k, ex) {
    const d = WB[k], W = ex.W, MT = (v) => (d.o >= 90 && Number.isInteger(v) ? '\\$' + v : MTm(v)), M = (v) => (d.o >= 90 && Number.isInteger(v) ? '$' + v : Mm(v)), inc = d.n - d.o, pR = rnd(inc / d.o * 100, 1), pW = rnd(inc / d.n * 100, 1);
    const mR = rnd(1 + pR / 100, 4), mW = rnd(1 + pW / 100, 4), cR = rnd(d.o * mR), cW = rnd(d.o * mW);
    const V = verdict(stage, W, `increase = ${T(`${MT(d.n)}-${MT(d.o)}=${MT(inc)}`)}`, [
      { ok: true, head: `÷ the <b>${d.lo}</b> (the original)`, stamp: 'Right ✓',
        lines: [T(`${MT(inc)}\\div${MT(d.o)}=${rnd(inc / d.o, 4)}`) + ` → <b>${pR}%</b>`, `Check: ${T(`${MT(d.o)}\\times${mR}=${MT(cR)}`)} ✓`] },
      { ok: false, head: `÷ the <b>${d.ln}</b> (the new price)`, stamp: 'Wrong ✗',
        lines: [T(`${MT(inc)}\\div${MT(d.n)}\\approx${rnd(inc / d.n, 4)}`) + ` → about <b>${pW}%</b>`, `Check: ${T(`${MT(d.o)}\\times${mW}\\approx${MT(cW)}`)}, not ${M(d.n)} ✗`] }
    ]);
    const [A, B] = V.cols;
    return [
      { cap: `The increase: ${T(`${MT(d.n)}-${MT(d.o)}=${MT(inc)}`)}.`, run: (c) => c.fadeIn(V.top) },
      { cap: `Compare with the <b>${d.lo}</b>, the starting amount: <b>${pR}%</b>.`, run: async (c) => { await c.fadeIn(A[0]); await c.fadeIn(A[1]); } },
      { cap: `Check: the ${d.lo} + ${pR}% should give the ${d.ln}. ${T(`${MT(d.o)}\\times${mR}=${MT(cR)}`)} ✓`, run: async (c) => { await c.fadeIn(A[2]); await stampIn(c, A[3]); } },
      { cap: `Now the mistake: divide by the ${d.ln}. That gives about <b>${pW}%</b>.`, run: async (c) => { await c.fadeIn(B[0]); await c.fadeIn(B[1]); } },
      { cap: `Check: ${T(`${MT(d.o)}\\times${mW}\\approx${MT(cW)}`)}, not ${M(d.n)}. Always divide by the <b>original</b>.`, run: async (c) => { await c.fadeIn(B[2]); await stampIn(c, B[3]); } }
    ];
  }
};

/* =====================================================================================
 * 5. The Canada tax map
 * ===================================================================================== */
// x, y, w, h on a 960-wide design; t: g = GST only, p = GST + PST, h = HST; r: total % (only the booklet's provinces)
const PROV = [
  { k: 'YT', x: 20, y: 6, w: 104, t: 'g' }, { k: 'NT', x: 132, y: 6, w: 128, t: 'g' }, { k: 'NU', x: 268, y: 6, w: 170, t: 'g' },
  { k: 'BC', n: 'British Columbia', x: 20, y: 98, w: 104, t: 'p', r: 12, tax: '5% + 7%' }, { k: 'AB', n: 'Alberta', x: 132, y: 98, w: 104, t: 'g', r: 5, tax: '5%' },
  { k: 'SK', n: 'Saskatchewan', x: 244, y: 98, w: 104, t: 'p', r: 11, tax: '5% + 6%' }, { k: 'MB', x: 356, y: 98, w: 104, t: 'p' },
  { k: 'ON', n: 'Ontario', x: 468, y: 98, w: 128, t: 'h', r: 13, tax: '13%' }, { k: 'QC', x: 604, y: 98, w: 128, t: 'p' },
  { k: 'NL', x: 744, y: 6, w: 100, t: 'h' }, { k: 'NB', x: 744, y: 98, w: 100, t: 'h' }, { k: 'PE', x: 852, y: 38, w: 96, h: 52, t: 'h' },
  { k: 'NS', n: 'Nova Scotia', x: 852, y: 98, w: 96, t: 'h', r: 14, tax: '14%' }
];
const TAXNAME = { g: 'GST', p: 'GST + PST', h: 'HST' };
const TM = {
  taxes: { ask: 'Sales tax across Canada: which provinces add more than the 5% GST?' },
  p100: { ask: 'A jacket costs <b>$100.00</b> before tax. What would you pay in each province in the table?', price: 100 },
  e7: { ask: 'Example 7: a game console costs <b>$499.99</b> in Calgary and in Toronto (13% HST). How much more does it cost in Toronto after tax?', price: 499.99 }
};
const taxMap = {
  title: 'The tax map: GST, PST and HST',
  height: 430,
  minW: 960,
  choices: [{ sep: 'The taxes:' }, { v: 'taxes', label: 'Build the map' }, { v: 'p100', label: 'A $100 jacket' }, { sep: 'Example 7 check:' }, { v: 'e7', label: 'Calgary vs Toronto' }],
  ask: (k) => TM[k].ask,
  make(stage, k, ex) {
    const W = ex.W, OX = (W - 960) / 2, TH = 84, mode = k, d = TM[k];
    const tiles = {};
    PROV.forEach((p) => {
      const el = add(stage, box(h('div', 'u1l8-tile', `<b>${p.k}</b><span class="rt"></span><span class="mu"></span>`), p.w, p.h || TH), OX + p.x, p.y);
      tiles[p.k] = { p, r: p.r || (p.t === 'g' ? 5 : 0), el, rt: el.querySelector('.rt'), mu: el.querySelector('.mu') };
      if (p.h) el.classList.add('small');
    });
    const T_ = (kk) => tiles[kk];
    const paint = (kk, t, rate) => { const o = T_(kk); o.el.classList.remove('g', 'p', 'h'); o.el.classList.add(t); o.rt.innerHTML = rate || TAXNAME[t]; };
    const mult = (kk) => { const o = T_(kk); o.mu.textContent = '× ' + (1 + o.r / 100).toFixed(2); };
    const legend = hide(add(stage, box(h('div', 'u1l8-legend', '<span class="g">GST only (5%)</span><span class="p">GST + PST</span><span class="h">HST (one joined tax)</span>'), 640, 34), OX + 160, 222));
    const note = add(stage, box(h('div', 'u1l8-mapnote', 'Rates as of 2026. Rates can change: check before you use them in real life.'), 640, 24), OX + 160, 402);
    const LX = OX + 40, LW = 880;
    const all = Object.keys(tiles), GONLY = ['YT', 'NT', 'NU', 'AB'], PST = ['BC', 'SK', 'MB', 'QC'], HST = ['ON', 'NS', 'NB', 'PE', 'NL'];
    const finish = () => { all.forEach((kk) => { const o = T_(kk); paint(kk, o.p.t, o.r ? o.r + '%' : TAXNAME[o.p.t]); if (o.r) mult(kk); }); };
    if (mode === 'taxes') {
      all.forEach((kk) => hide(T_(kk).el)); hide(note);
      const L1 = line(stage, `<b class="u1l8-cg">Alberta</b> and the territories: 5% GST only &nbsp;→&nbsp; × 1.05`, LX, 262, LW);
      const L2 = line(stage, `<b class="u1l8-cp">BC</b>: 5% + 7% = <b>12%</b> → × 1.12 &nbsp;·&nbsp; <b class="u1l8-cp">Saskatchewan</b>: 5% + 6% = <b>11%</b> → × 1.11`, LX, 306, LW);
      const L3 = line(stage, `<b class="u1l8-ch">Ontario</b>: <b>13%</b> HST → × 1.13 &nbsp;·&nbsp; <b class="u1l8-ch">Nova Scotia</b>: <b>14%</b> HST → × 1.14`, LX, 350, LW);
      return [
        { cap: 'Canada has <b>10 provinces</b> and <b>3 territories</b>.', run: (c) => Promise.all(all.map((kk, i) => c.pop(T_(kk).el, 300, { delay: i * 50 }))) },
        { cap: '<b>GST</b> (5%) is charged by the federal government <b>everywhere</b> in Canada.', run: async (c) => { all.forEach((kk) => paint(kk, 'g', '5%')); await Promise.all(all.map((kk) => pulse(c, T_(kk).el, 1.06, 400))); } },
        { cap: '<b>Alberta</b> and the territories have <b>GST only</b>: 5% in all. Multiply by <b>1.05</b>.',
          run: async (c) => { GONLY.forEach((kk) => mult(kk)); await Promise.all(GONLY.map((kk) => pulse(c, T_(kk).el, 1.1, 500))); await c.fadeIn(L1); } },
        { cap: 'Some provinces add a <b>PST</b> on top of the GST: BC 5% + 7% = <b>12%</b>, Saskatchewan 5% + 6% = <b>11%</b>.',
          run: async (c) => { PST.forEach((kk) => { const p = T_(kk).p; paint(kk, 'p', p.r ? p.r + '%' : 'GST + PST'); if (p.r) mult(kk); }); await Promise.all(PST.map((kk) => pulse(c, T_(kk).el, 1.1, 500))); await c.fadeIn(L2); } },
        { cap: 'In some provinces the two are <b>joined into one HST</b>: Ontario <b>13%</b>, Nova Scotia <b>14%</b>.',
          run: async (c) => { HST.forEach((kk) => { const p = T_(kk).p; paint(kk, 'h', p.r ? p.r + '%' : 'HST'); if (p.r) mult(kk); }); await Promise.all(HST.map((kk) => pulse(c, T_(kk).el, 1.1, 500))); await c.fadeIn(L3); } },
        { cap: 'The “multiply by” number is <b>1 + the total rate</b>, just like the markup shortcut.', run: async (c) => { await c.fadeIn(legend); await c.fadeIn(note); } }
      ];
    }
    finish(); legend.style.opacity = 1; void note;
    const ON = ['AB', 'BC', 'SK', 'ON', 'NS'];
    const pills = {};
    ON.forEach((kk) => { const p = T_(kk).p, v = rnd(d.price * (1 + p.r / 100)); pills[kk] = { v, el: hide(add(stage, box(cbox('u1l8-tot', M(v)), Math.max(p.w + 8, 112), 32), OX + p.x + p.w / 2 - Math.max(p.w + 8, 112) / 2, p.y + TH + 4)) }; });
    if (mode === 'p100') {
      const L1 = line(stage, `Each total = $100.00 × the “multiply by” number. BC: ${T('\\$100.00\\times1.12=\\$112.00')}`, LX, 262, LW);
      const L2 = line(stage, 'On $100, the tax in dollars is the same number as the percent: 5% of $100 is $5.', LX, 306, LW);
      const st = hide(stamp(stage, 'Lowest: Alberta ✓', { ok: true, x: OX + 700, y: 370 }));
      return [
        { cap: 'The tax map: <b>blue</b> GST only, <b>purple</b> GST + PST, <b>orange</b> HST.', run: (c) => c.fadeIn(legend) },
        { cap: 'Multiply $100.00 by each “multiply by” number.', run: async (c) => { await Promise.all(ON.map((kk, i) => c.pop(pills[kk].el, 340, { delay: i * 120 }))); await c.fadeIn(L1); } },
        { cap: 'On $100, a 12% tax adds <b>$12</b>. The same jacket costs <b>$9 more</b> in Nova Scotia than in Alberta.', run: async (c) => { await c.fadeIn(L2); await stampIn(c, st); } }
      ];
    }
    // Example 7: Calgary vs Toronto
    const L1 = line(stage, `Calgary: ${T('\\$499.99\\times1.05=\\$524.9895\\approx\\$524.99')}`, LX, 262, LW);
    const L2 = line(stage, `Toronto: ${T('\\$499.99\\times1.13=\\$564.9887\\approx\\$564.99')}`, LX, 306, LW);
    const L3 = line(stage, `difference = ${T('\\$564.99-\\$524.99=\\$40.00')}`, LX, 350, LW, 'ok');
    const st = hide(stamp(stage, '$40.00 more in Toronto', { ok: null, x: OX + 740, y: 318 }));
    return [
      { cap: 'Calgary is in Alberta: <b>GST only</b>, × 1.05. Toronto is in Ontario: <b>13% HST</b>, × 1.13.', run: (c) => Promise.all([pulse(c, T_('AB').el, 1.12, 500), pulse(c, T_('ON').el, 1.12, 500)]) },
      { cap: `Calgary: ${T('\\$499.99\\times1.05=\\$524.9895')}, about <b>$524.99</b>.`, run: async (c) => { await c.pop(pills.AB.el); await c.fadeIn(L1); } },
      { cap: `Toronto: ${T('\\$499.99\\times1.13=\\$564.9887')}, about <b>$564.99</b>.`, run: async (c) => { await c.pop(pills.ON.el); await c.fadeIn(L2); } },
      { cap: `Subtract: ${T('\\$564.99-\\$524.99=\\$40.00')}. The console costs <b>$40.00 more</b> in Toronto.`, run: async (c) => { await c.fadeIn(L3); await stampIn(c, st); } }
    ];
  }
};

/* =====================================================================================
 * 6. Estimate 5%: find 10%, then take half
 * ===================================================================================== */
const GE = {
  e5: { p: 54.99, r: 55, item: 'hoodie', ask: 'Example 5: a hoodie at a Calgary store is <b>$54.99</b>. Estimate the GST, then find the GST and the total cost.', ex: '2.7495', why: 'the next digit is <b>9</b>, so round up' },
  e6: { p: 129.99, r: 130, item: 'pair of headphones', ask: 'Headphones (Example 6) cost <b>$129.99</b>. In Calgary, estimate the GST, then find the GST and the total.', ex: '6.4995', why: 'the next digit is <b>9</b>, so round up' },
  c: { p: 38, r: 38, item: 'pair of shoes', ask: 'Shoes cost <b>$38.00</b> in Calgary. Estimate the GST, then find the GST and the total.', ex: '1.9' }
};
const gstEstimate = {
  title: 'Estimate 5%: 10%, then half',
  height: 430,
  minW: 900,
  choices: [{ sep: 'Example 5 check:' }, { v: 'e5', label: 'Hoodie, $54.99' }, { sep: 'More:' }, { v: 'e6', label: 'Headphones, $129.99' }, { v: 'c', label: 'Shoes, $38.00' }],
  ask: (k) => GE[k].ask,
  make(stage, k, ex) {
    const d = GE[k], W = ex.W, ten = d.r / 10, half = ten / 2, gst = rnd(d.p * 0.05), tot = rnd(d.p + gst), sc = rnd(d.p * 1.05, 4);
    add(stage, box(h('div', 'u1l8-ptag', `<b>${M(d.p)}</b><span>${d.item}</span>`), 220, 66), 24, 6);
    const rp = hide(add(stage, box(cbox('u1l8-chip', d.r === d.p ? `Easy to work with: <b>${M(d.r)}</b>` : `${M(d.p)} is about <b>${M(d.r)}</b>`), 300, 48), 270, 18));
    const X0 = 40, BW = W - 80, sw = BW / 10, BY = 126;
    const segs = [];
    for (let i = 0; i < 10; i++) segs.push(hide(add(stage, box(cbox('u1l8-seg', '10%'), sw - 4, 50), X0 + i * sw + 2, BY)));
    const whole = hide(add(stage, box(h('div', 'u1l8-pl'), BW, 24), X0, BY + 54)); whole.innerHTML = `all 10 parts: <b>${M(d.r)}</b> = 100%`;
    const tlab = hide(add(stage, box(cbox('u1l8-pct', `10% ≈ ${M(ten)}`), 170, 34), X0, BY - 38));
    const piece = hide(add(stage, box(cbox('u1l8-seg hl', `10% ≈ ${M(ten)}`), 300, 54), X0, BY));
    const hA = hide(add(stage, box(cbox('u1l8-seg half', `5% ≈ <b>${M(half)}</b>`), 148, 54), X0, 214));
    const hB = hide(add(stage, box(cbox('u1l8-seg half dim', '5%'), 148, 54), X0 + 152, 214));
    const lcd = hide(add(stage, box(h('div', 'u1l8-lcd', `<div class="e">${d.p}×0.05</div><div class="r">${d.ex}</div>`), 250, 70), W - 290, 206));
    const L1 = line(stage, `Estimate: 10% of ${M(d.r)} is ${M(ten)}; half is about <b>${M(half)}</b>.`, 40, 296, W - 80);
    const L2 = line(stage, `GST = ${T(`${MT(d.p)}\\times0.05=${d.ex}${d.why ? '\\approx' : '\\to'}${MT(gst)}`)} &nbsp;·&nbsp; total = ${T(`${MT(d.p)}+${MT(gst)}=${MT(tot)}`)}`, 40, 340, W - 80);
    const L3 = line(stage, `Shortcut: ${T(`${MT(d.p)}\\times1.05=${sc}${String(sc).split('.')[1]?.length > 2 ? '\\approx' : '\\to'}${MT(tot)}`)} ✓`, 40, 384, W - 80, 'ok');
    return [
      { cap: `Estimate first. ${d.r === d.p ? `${M(d.p)} is already easy to work with.` : `Round: ${M(d.p)} is about <b>${M(d.r)}</b>.`}`, run: (c) => c.pop(rp) },
      { cap: `Cut ${M(d.r)} into <b>10 equal parts</b>. Each part is <b>10%</b>.`, run: async (c) => { await Promise.all(segs.map((e, i) => c.pop(e, 260, { delay: i * 50 }))); await c.fadeIn(whole); } },
      { cap: `10%: move the decimal point <b>one place left</b>: ${M(d.r)} → <b>${M(ten)}</b>.`, run: async (c) => { segs[0].classList.add('hl'); await c.pop(tlab); } },
      { cap: `5% is <b>half</b> of 10%: half of ${M(ten)} is about <b>${M(half)}</b>.`,
        run: async (c) => { piece.style.opacity = 1; piece.style.width = sw - 4 + 'px'; await Promise.all([moveTo(c, piece, X0, 214, 600), growW(c, piece, 300, 600)]);
          await c.anim(piece, [{ opacity: 1 }, { opacity: 0 }], 200); await Promise.all([c.pop(hA), c.pop(hB)]); await c.fadeIn(L1); } },
      { cap: `Now exactly: ${T(`${MT(d.p)}\\times0.05=${d.ex}`)}${d.why ? `. Round to the cent (${d.why}): <b>${M(gst)}</b>` : `, so the GST is <b>${M(gst)}</b>`}. Close to the estimate ✓`,
        run: async (c) => { await c.pop(lcd); await c.fadeIn(L2); } },
      { cap: `Total = ${M(d.p)} + ${M(gst)} = <b>${M(tot)}</b>. The shortcut × 1.05 gives the same.`, run: (c) => c.fadeIn(L3) }
    ];
  }
};

/* =====================================================================================
 * 7. Two taxes, two lines (and the 1¢ case)
 * ===================================================================================== */
const TT = {
  e6: { ask: 'Example 6: Liam buys headphones for <b>$129.99</b> in Kamloops, BC (5% GST and 7% PST). Find each tax and the total.', store: 'SOUND SHACK', town: 'Kamloops, BC', item: 'Headphones', p: 129.99 },
  cent: { ask: 'Why can the two ways differ by 1¢? A pack of pens costs <b>$5.05</b> in Victoria, BC (5% GST and 7% PST).', store: 'PAPER PLUS', town: 'Victoria, BC', item: 'Pack of pens', p: 5.05 }
};
const twoTaxes = {
  title: 'GST and PST, each on its own line',
  height: 420,
  minW: 900,
  choices: [{ sep: 'Example 6 check:' }, { v: 'e6', label: 'Liam’s headphones' }, { sep: 'The tip:' }, { v: 'cent', label: 'When it’s 1¢ off' }],
  ask: (k) => TT[k].ask,
  make(stage, k, ex) {
    const d = TT[k], W = ex.W, g = d.p * 0.05, q = d.p * 0.07, gr = rnd(g), qr = rnd(q), tot = rnd(d.p + gr + qr), scx = rnd(d.p * 1.12, 4), sc = rnd(d.p * 1.12), same = Math.abs(sc - tot) < 1e-9;
    const RW = 380, rc = add(stage, box(h('div', 'u1l8-rcpt'), RW, 300), 30, 10);
    rc.innerHTML = `<div class="u1l8-rh">${d.store}<small>${d.town}</small></div>`;
    const row = (a, b, cls = '') => hide(rc.appendChild(h('div', 'u1l8-rr ' + cls, `<span>${a}</span><span class="v">${b}</span>`)));
    const rI = row(d.item, M(d.p)), rG = row('GST 5%', M(gr)), rQ = row('PST 7%', M(qr));
    rc.appendChild(h('div', 'u1l8-rline'));
    const rT = row('TOTAL', '$0.00', 'tot'), tv = rT.querySelector('.v');
    const PX = RW + 70, PW = W - PX - 24;
    const L1 = line(stage, `GST: ${T(`${MT(d.p)}\\times0.05=${rnd(g, 4)}\\approx${MT(gr)}`)}`, PX, 20, PW);
    const L2 = line(stage, `PST: ${T(`${MT(d.p)}\\times0.07=${rnd(q, 4)}\\approx${MT(qr)}`)}`, PX, 72, PW);
    const L3 = line(stage, `Total: ${T(`${MT(d.p)}+${MT(gr)}+${MT(qr)}=${MT(tot)}`)}`, PX, 124, PW);
    const sh = hide(add(stage, box(cbox('u1l8-chip', 'Shortcut: 5% + 7% = <b>12%</b> → × 1.12'), PW, 46), PX, 190));
    const lcd = hide(add(stage, box(h('div', 'u1l8-lcd', `<div class="e">${d.p}×1.12</div><div class="r">${scx}</div>`), 250, 70), PX, 246));
    const rd = hide(add(stage, box(cbox('u1l8-res', `≈ <b>${M(sc)}</b>`), PW - 270, 50), PX + 270, 256));
    const st = hide(stamp(stage, same ? 'Same total ✓' : '1¢ apart: that’s fine', { ok: same ? true : null, x: PX + PW / 2, y: 366 }));
    const why = same ? null : line(stage, `GST <b>${rnd(g, 4)}</b> and PST <b>${rnd(q, 4)}</b> both rounded <b>down</b> a little.`, 30, 320, RW + 10, 'sm');
    const steps = [
      { cap: `The receipt starts with the price: <b>${M(d.p)}</b>.`, run: (c) => c.fadeIn(rI) },
      { cap: `GST = ${T(`${MT(d.p)}\\times0.05=${rnd(g, 4)}`)}, about <b>${M(gr)}</b>. It gets its own line.`, run: async (c) => { await c.fadeIn(L1); await c.fadeIn(rG); } },
      { cap: `PST = ${T(`${MT(d.p)}\\times0.07=${rnd(q, 4)}`)}, about <b>${M(qr)}</b>.`, run: async (c) => { await c.fadeIn(L2); await c.fadeIn(rQ); } },
      { cap: `Total = price + GST + PST = <b>${M(tot)}</b>.`, run: async (c) => { await c.fadeIn(L3); rT.style.opacity = 1; await countTo(c, tv, 0, tot, 700); } },
      { cap: `Check with the shortcut: ${T(`${MT(d.p)}\\times1.12=${scx}`)}, about <b>${M(sc)}</b>.`, run: async (c) => { await c.fadeIn(sh); await c.pop(lcd); await c.pop(rd); } }
    ];
    if (same) steps.push({ cap: 'Both ways give the same total ✓', run: (c) => stampIn(c, st) });
    else steps.push({ cap: `${M(tot)} and ${M(sc)}: <b>1 cent apart</b>, because each tax was rounded on its own. That is fine.`, run: async (c) => { await c.fadeIn(why); await stampIn(c, st); } });
    return steps;
  }
};

/* =====================================================================================
 * 8. The price tag grows: supplier → shelf → till
 * ===================================================================================== */
const TG = {
  e8: { ask: 'Example 8: a work-wear store in Red Deer buys steel-toed boots for <b>$85.00</b> a pair. It marks them up <b>60%</b>. What does a customer pay, with GST?', cost: 85, pct: 60, item: 'boots' },
  e1: { ask: 'The helmet from Example 1: cost <b>$48.00</b>, markup <b>40%</b>. What does a customer in Calgary pay, with GST?', cost: 48, pct: 40, item: 'helmet' },
  e2a: { ask: 'The phone case from Example 2(a): cost <b>$6.50</b>, markup <b>180%</b>. What does a customer in Calgary pay, with GST?', cost: 6.5, pct: 180, item: 'phone case' }
};
const tagGrow = {
  title: 'The price tag grows: cost → tag → till',
  height: 420,
  minW: 900,
  choices: [{ sep: 'Example 8 check:' }, { v: 'e8', label: 'Boots' }, { sep: 'Then tax:' }, { v: 'e1', label: 'Helmet (Ex. 1)' }, { v: 'e2a', label: 'Phone case (Ex. 2a)' }],
  ask: (k) => TG[k].ask,
  make(stage, k, ex) {
    const d = TG[k], W = ex.W, ret = rnd(d.cost * (1 + d.pct / 100)), mk = rnd(ret - d.cost), gst = rnd(ret * 0.05), tot = rnd(ret + gst);
    const SX = [W * 0.15, W * 0.5, W * 0.85], TW = 200, TH = 108, TY = 62;
    const heads = ['<b>1</b> Supplier: the <b>cost</b>', '<b>2</b> Shelf: the <b>price tag</b>', '<b>3</b> Till: the <b>total</b>'];
    const hd = heads.map((s, i) => add(stage, box(cbox('u1l8-sth', s), 250, 40), SX[i] - 125, 6));
    void hd;
    const sv = add(stage, svgEl('svg', { width: W, height: 420, class: 'u1l8-svg' }), 0, 0);
    const arrow = (i) => { const a = SX[i] + TW / 2 + 8, b = SX[i + 1] - TW / 2 - 8, y = TY + TH / 2 + 18, g = svgEl('g', {}, sv);
      svgEl('path', { d: `M${a} ${y} H${b - 10}`, stroke: i ? '#1f5bd6' : '#c27a0e', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
      svgEl('path', { d: `M${b - 18} ${y - 11} L${b} ${y} L${b - 18} ${y + 11}`, fill: 'none', stroke: i ? '#1f5bd6' : '#c27a0e', 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
      hide(g); const lab = hide(add(stage, box(cbox('u1l8-alab ' + (i ? 'g' : 'm'), i ? '+5% GST<br><b>× 1.05</b>' : `+${d.pct}% markup<br><b>× ${D1(d.pct)}</b>`), b - a + 10, 56), a - 5, y - 64)); return [g, lab]; };
    const A1 = arrow(0), A2 = arrow(1);
    // the ghost of the cost (stays in the back room) and the moving tag
    const ghost = hide(add(stage, box(h('div', 'u1l8-ptag cost', `<b>${M(d.cost)}</b><span>cost</span>`), TW, TH), SX[0] - TW / 2, TY));
    const shelf = hide(add(stage, box(h('div', 'u1l8-ptag cost', `<b>${M(ret)}</b><span>price tag</span>`), TW, TH), SX[1] - TW / 2, TY));
    const tag = add(stage, box(h('div', 'u1l8-ptag big', `<b>${M(d.cost)}</b><span>cost</span>`), TW, TH), SX[0] - TW / 2, TY); hide(tag);
    const grow = (c, a, b, ms) => tween(c, ms, (t) => { tag.style.scale = lerp(a, b, t); });
    tag.style.scale = 0.86;
    const tb = tag.querySelector('b'), ts = tag.querySelector('span');
    const L1 = line(stage, `Step 1: retail = ${T(`${MT(d.cost)}\\times${D1(d.pct)}=${MT(ret)}`)}`, 40, 208, W - 80);
    const L2 = line(stage, `Step 2: GST = ${T(`${MT(ret)}\\times0.05=${MT(gst)}`)} &nbsp;(on the <b>retail</b> price)`, 40, 250, W - 80);
    const L3 = line(stage, `Step 3: total = ${T(`${MT(ret)}+${MT(gst)}=${MT(tot)}`)}`, 40, 292, W - 80, 'ok');
    // the stacked bar: cost + markup + GST
    const BX = 40, BW = W - 80, u = BW / tot, BY = 346;
    const sC = add(stage, box(cbox('u1l8-bar cst', `cost ${M(d.cost)}`), 0, 40), BX, BY);
    const sM = hide(add(stage, box(cbox('u1l8-bar mku', mk * u > 150 ? `markup ${M(mk)}` : ''), 0, 40), BX + d.cost * u, BY));
    const sG = hide(add(stage, box(cbox('u1l8-bar gst', ''), 0, 40), BX + ret * u, BY));
    const gl = hide(add(stage, box(h('div', 'u1l8-pl g', `GST ${M(gst)}`), 120, 24), Math.min(W - 128, BX + ret * u + gst * u / 2 - 60), BY + 42));
    const ml = mk * u > 150 ? null : hide(add(stage, box(h('div', 'u1l8-pl m', `markup ${M(mk)}`), 160, 24), BX + d.cost * u + mk * u / 2 - 80, BY + 42));
    const stt = hide(stamp(stage, 'store only', { ok: null, x: SX[0], y: TY + TH + 2, rotate: -8, size: 'sm' }));
    return [
      { cap: `The store pays the supplier <b>${M(d.cost)}</b>. This is the <b>cost</b>.`, run: async (c) => { await c.pop(tag); await growW(c, sC, d.cost * u, 600); } },
      { cap: `Step 1: retail = ${T(`${MT(d.cost)}\\times${D1(d.pct)}=${MT(ret)}`)}. That goes on the <b>price tag</b>.`,
        run: async (c) => { ghost.style.opacity = 0.45; await c.fadeIn(A1[0]); await c.pop(A1[1]); ts.textContent = 'price tag';
          sM.style.opacity = 1; await Promise.all([moveTo(c, tag, SX[1] - TW / 2, TY, 800), countTo(c, tb, d.cost, ret, 800), grow(c, 0.86, 1, 800), growW(c, sM, mk * u, 800)]); if (ml) await c.fadeIn(ml); await c.fadeIn(L1); } },
      { cap: `Step 2: the GST is on the <b>retail</b> price: ${T(`${MT(ret)}\\times0.05=${MT(gst)}`)}.`, run: async (c) => { await c.fadeIn(A2[0]); await c.pop(A2[1]); sG.style.opacity = 1; await growW(c, sG, gst * u, 500); await c.fadeIn(gl); await c.fadeIn(L2); } },
      { cap: `Step 3: total = ${T(`${MT(ret)}+${MT(gst)}=${MT(tot)}`)}. The customer pays <b>${M(tot)}</b> at the till.`,
        run: async (c) => { shelf.style.opacity = 0.55; ts.textContent = 'total with GST'; tag.classList.add('till'); await Promise.all([moveTo(c, tag, SX[2] - TW / 2, TY, 800), countTo(c, tb, ret, tot, 800), grow(c, 1, 1.08, 800)]); await c.fadeIn(L3); } },
      { cap: `The customer sees ${M(ret)} and ${M(tot)}, never the ${M(d.cost)} cost. That stays in the back room.`, run: (c) => stampIn(c, stt) }
    ];
  }
};

/* =====================================================================================
 * 9. Tax the tag, not the cost (Full notes)
 * ===================================================================================== */
const TC = {
  e8: { cost: 85, pct: 60, ask: 'Example 8: the boots cost the store <b>$85.00</b> and sell for <b>$136.00</b>. Which GST is right?' },
  e1: { cost: 48, pct: 40, ask: 'Example 1: the helmet costs the store <b>$48.00</b> and sells for <b>$67.20</b>. Which GST is right?' }
};
const taxOnCost = {
  title: 'Tax the tag, not the cost',
  height: 330,
  minW: 900,
  choices: [{ sep: 'Example:' }, { v: 'e8', label: '8 Boots' }, { v: 'e1', label: '1 Helmet' }],
  ask: (k) => TC[k].ask,
  make(stage, k, ex) {
    const d = TC[k], W = ex.W, ret = rnd(d.cost * (1 + d.pct / 100)), gR = rnd(ret * 0.05), gW = rnd(d.cost * 0.05), tR = rnd(ret + gR), tW = rnd(ret + gW), miss = rnd(gR - gW);
    const V = verdict(stage, W, `cost <b>${M(d.cost)}</b> &nbsp;→&nbsp; price tag (retail) <b>${M(ret)}</b>`, [
      { ok: true, head: 'GST on the <b>price tag</b>', stamp: 'Right ✓', lines: [`GST = ${T(`${MT(ret)}\\times0.05=${MT(gR)}`)}`, `total = ${T(`${MT(ret)}+${MT(gR)}=${MT(tR)}`)}`] },
      { ok: false, head: 'GST on the <b>cost</b>', stamp: 'Wrong ✗', lines: [`GST = ${T(`${MT(d.cost)}\\times0.05=${MT(gW)}`)}`, `total = ${T(`${MT(ret)}+${MT(gW)}=${MT(tW)}`)}`] }
    ]);
    const [A, B] = V.cols;
    return [
      { cap: `The cost is ${M(d.cost)}. The price tag says <b>${M(ret)}</b>.`, run: (c) => c.fadeIn(V.top) },
      { cap: `The GST is on what the customer pays for the item: the <b>tag</b>. ${T(`${MT(ret)}\\times0.05=${MT(gR)}`)}.`, run: async (c) => { await c.fadeIn(A[0]); await c.fadeIn(A[1]); } },
      { cap: `Total: <b>${M(tR)}</b>.`, run: async (c) => { await c.fadeIn(A[2]); await stampIn(c, A[3]); } },
      { cap: `The mistake: GST on the cost, ${T(`${MT(d.cost)}\\times0.05=${MT(gW)}`)}.`, run: async (c) => { await c.fadeIn(B[0]); await c.fadeIn(B[1]); } },
      { cap: `That total is ${M(tW)}: <b>${M(miss)}</b> of tax is missing. The customer never sees the cost.`, run: async (c) => { await c.fadeIn(B[2]); await stampIn(c, B[3]); } }
    ];
  }
};

/* =====================================================================================
 * 10. Ava's receipt fills itself in
 * ===================================================================================== */
const receipt = {
  title: 'Ava’s receipt, line by line',
  height: 400,
  minW: 900,
  ask: 'Example 9: Ava shops at Bow Valley Outfitters in Calgary. Complete her receipt. She pays with a <b>$100</b> gift card. How much is left on the gift card?',
  make(stage, k, ex) {
    const W = ex.W, RW = 440, rc = add(stage, box(h('div', 'u1l8-rcpt big'), RW, 384), 24, 8);
    rc.innerHTML = '<div class="u1l8-rh">BOW VALLEY OUTFITTERS<small>Calgary, AB</small></div>';
    const row = (a, b, cls = '') => { const r = rc.appendChild(h('div', 'u1l8-rr ' + cls, `<span>${a}</span><span class="v">${b}</span>`)); return r; };
    const r1 = row('2 × Wool socks @ 12.99', ''), r2 = row('1 × Toque @ 24.50', ''), r3 = row('1 × Water bottle @ 18.75', '');
    rc.appendChild(h('div', 'u1l8-rline'));
    const rS = row('SUBTOTAL', ''), rG = row('GST 5%', ''), rT = row('TOTAL', '', 'tot');
    rc.appendChild(h('div', 'u1l8-rline'));
    const rC = row('GIFT CARD', '$100.00'), rH = row('LEFT ON CARD', '', 'tot');
    const v = (r) => r.querySelector('.v');
    const PX = RW + 54, PW = W - PX - 20;
    const L = [
      `${T('2\\times\\$12.99=\\$25.98')}`,
      `subtotal = ${T('\\$25.98+\\$24.50+\\$18.75')}<br>${T('=\\$69.23')}`,
      `GST = ${T('\\$69.23\\times0.05=\\$3.4615')}<br>${T('\\approx\\$3.46')}`,
      `total = ${T('\\$69.23+\\$3.46=\\$72.69')}`,
      `left on card = ${T('\\$100.00-\\$72.69=\\$27.31')}`
    ].map((s, i) => hide(add(stage, box(cbox('u1l8-wk' + (i === 4 ? ' ok' : ''), s), PW, i === 1 || i === 2 ? 74 : 46), PX, [10, 66, 150, 234, 290][i])));
    const st = hide(stamp(stage, 'Left on card: $27.31', { ok: true, x: PX + PW / 2, y: 362 }));
    const fill = async (c, r, val, ms = 500) => { r.classList.add('on'); await countTo(c, v(r), 0, val, ms); };
    return [
      { cap: `Each line: <b>quantity × price</b>. Socks: ${T('2\\times\\$12.99=\\$25.98')}.`, run: async (c) => { await c.fadeIn(L[0]); await fill(c, r1, 25.98); await fill(c, r2, 24.5, 300); await fill(c, r3, 18.75, 300); } },
      { cap: 'Add the amounts for the <b>subtotal</b>: <b>$69.23</b>.', run: async (c) => { await c.fadeIn(L[1]); await fill(c, rS, 69.23); } },
      { cap: `GST on the subtotal: ${T('\\$69.23\\times0.05=\\$3.4615')}, about <b>$3.46</b>.`, run: async (c) => { await c.fadeIn(L[2]); await fill(c, rG, 3.46); } },
      { cap: 'Total = subtotal + GST = <b>$72.69</b>.', run: async (c) => { await c.fadeIn(L[3]); await fill(c, rT, 72.69); } },
      { cap: `Ava pays with a <b>$100.00</b> gift card. Left on card = ${T('\\$100.00-\\$72.69=\\$27.31')}.`, run: async (c) => { await pulse(c, rC, 1.06); await c.fadeIn(L[4]); await fill(c, rH, 27.31); await stampIn(c, st); } }
    ];
  }
};

mountExplainers({ markup, decimalSlide, markupPct, wrongBase, taxMap, gstEstimate, twoTaxes, tagGrow, taxOnCost, receipt });

/* ============ Stand Up Break! — markup, markup percent and sales tax, at the whiteboards ============ */
{
  const dd = (v) => rnd(v, 2).toFixed(2);
  const ITEMS = ['hoodie', 'backpack', 'phone charger', 'pair of gloves', 'water bottle', 'video game', 'toque', 'pair of skates', 'desk lamp', 'basketball'];
  const PROVS = [['Vancouver, BC', 5, 7], ['Kelowna, BC', 5, 7], ['Regina, SK', 5, 6], ['Saskatoon, SK', 5, 6]];
  const HSTS = [['Toronto, ON', 13], ['Ottawa, ON', 13], ['Halifax, NS', 14]];
  standup('u1l8', {
    intro: 'Change the percent to a decimal first. Round money to the nearest cent.',
    levels: {
      BEG: (r) => { // markup and retail price
        const it = r.pick(ITEMS), cost = r.pick([12, 16, 20, 24, 30, 36, 40, 45, 50, 64, 75, 80, 120]) + r.pick([0, 0, 0.5]), pct = r.pick([20, 25, 30, 40, 50, 60, 75, 80, 100, 150]);
        const mk = rnd(cost * pct / 100), ret = rnd(cost + mk);
        return { text: `A store pays <b>$${dd(cost)}</b> for a ${it}. It marks it up <b>${pct}%</b>. Find the markup and the retail price.`, q: '',
          a: [`${pct}\\%=${D2(pct)}`, `\\text{markup}=\\$${dd(cost)}\\times${D2(pct)}=\\$${dd(mk)}`, `\\text{retail}=\\$${dd(cost)}+\\$${dd(mk)}=\\$${dd(ret)}`] };
      },
      PRG: (r) => r.pick([
        () => { // markup percent
          const it = r.pick(ITEMS), cost = r.pick([20, 24, 25, 30, 32, 40, 48, 50, 60, 80]), pct = r.pick([25, 30, 40, 50, 60, 75, 80, 100, 120, 150]), ret = rnd(cost * (1 + pct / 100));
          return { text: `A store buys a ${it} for <b>$${dd(cost)}</b> and sells it for <b>$${dd(ret)}</b>. What is the markup percent?`, q: '',
            a: [`\\text{markup}=\\$${dd(ret)}-\\$${dd(cost)}=\\$${dd(ret - cost)}`, `\\$${dd(ret - cost)}\\div\\$${dd(cost)}=${rnd(pct / 100, 4)}`, `${rnd(pct / 100, 4)}\\times100=${pct}\\%`] };
        },
        () => { // GST in Alberta: estimate, then exact
          const it = r.pick(ITEMS), p = rnd(r.int(8, 180) + r.pick([0.99, 0.49, 0.95, 0.79, 0.25])), g = rnd(p * 0.05), e = Math.round(p) / 20;
          return { text: `A ${it} costs <b>$${dd(p)}</b> in Calgary. Estimate the GST, then find the GST and the total.`, q: '',
            a: [`\\text{Estimate: half of 10\\% of }\\$${Math.round(p)}\\approx\\$${dd(e)}`, `\\text{GST}=\\$${dd(p)}\\times0.05=${rnd(p * 0.05, 4)}\\approx\\$${dd(g)}`, `\\text{total}=\\$${dd(p)}+\\$${dd(g)}=\\$${dd(p + g)}`] };
        }
      ])(),
      MAS: (r) => r.pick([
        () => { // GST + PST on separate lines
          const [town, gp, pp] = r.pick(PROVS), it = r.pick(ITEMS), p = rnd(r.int(20, 400) + r.pick([0.99, 0.49, 0.95])), g = rnd(p * gp / 100), q = rnd(p * pp / 100);
          return { text: `A ${it} costs <b>$${dd(p)}</b> in ${town} (${gp}% GST and ${pp}% PST). Find each tax and the total.`, q: '',
            a: [`\\text{GST}=\\$${dd(p)}\\times0.0${gp}\\approx\\$${dd(g)}`, `\\text{PST}=\\$${dd(p)}\\times0.0${pp}\\approx\\$${dd(q)}`, `\\text{total}=\\$${dd(p)}+\\$${dd(g)}+\\$${dd(q)}=\\$${dd(p + g + q)}`] };
        },
        () => { // Calgary vs an HST city
          const [town, hr] = r.pick(HSTS), it = r.pick(ITEMS), p = rnd(r.int(40, 900) + r.pick([0.99, 0.00, 0.49])), a1 = rnd(p * 1.05), a2 = rnd(p * (1 + hr / 100));
          return { text: `A ${it} costs <b>$${dd(p)}</b> in Calgary and in ${town} (${hr}% HST). How much more does it cost in ${town.split(',')[0]} after tax?`, q: '',
            a: [`\\text{Calgary: }\\$${dd(p)}\\times1.05\\approx\\$${dd(a1)}`, `\\text{${town.split(',')[0]}: }\\$${dd(p)}\\times${(1 + hr / 100).toFixed(2)}\\approx\\$${dd(a2)}`, `\\$${dd(a2)}-\\$${dd(a1)}=\\$${dd(a2 - a1)}\\text{ more}`] };
        }
      ])()
    }
  });
}
