/* Math 10-3 · Unit 2 · Lesson 4 — Piecework and Contracts.
 * Explainers: a piecework counter (pieces pop into a field while the pay meter climbs at the piece rate); the pay cut
 * into hour pieces (effective hourly rate) with a minimum-wage bar and the employer's top-up; the pay = rate × pieces
 * triangle that covers the unknown, with a goal line for "round up"; one basket's $9.00 split between picker and farm
 * (Full notes); a contract price bar that loses the materials, then is cut into the hours worked; a bid that stacks
 * materials + helpers + earnings, against "costs + 30%"; Jaxon's hourly line crossing the flat contract line; and
 * Kiana's pay per hour at 5 to 9 bags an hour against Job 1 (Full notes). Then the Stand Up Break. */
import { Graph, h, add, box, tex, svgEl, tween, stamp, stampIn, mountExplainers } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const rnd = (v, d = 2) => Math.round((v + (v >= 0 ? 1e-9 : -1e-9)) * 10 ** d) / 10 ** d;
const lerp = (a, b, t) => a + (b - a) * t;
const grp = (s, sep) => { const [i, f] = s.split('.'); const g = i.length > 3 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, sep) : i; return f != null ? g + '.' + f : g; };
const dec = (v, d = 2) => rnd(v, d).toFixed(d);
const M = (v, d = 2) => '$' + grp(dec(v, d), ' ');            // money text
const MT = (v, d = 2) => '\\$' + grp(dec(v, d), '\\,');             // money TeX
const N = (v) => grp(String(rnd(v, 4)), ' ');                  // a count / plain number, text
const NT = (v) => grp(String(rnd(v, 4)), '\\,');                     // the same in TeX
const cbox = (cls, html) => h('div', cls + ' u2l4-c', `<div>${html}</div>`);
const grow = (c, el, w1, ms = 700, prop = 'width') => { el.style.opacity = 1; return tween(c, ms, (t) => { el.style[prop] = (w1 * t) + 'px'; }); };
const zero = (el, prop = 'width') => { el.style[prop] = '0px'; el.style.opacity = 0; return el; };

/* ---------- little pictures of the pieces (viewBox 40 × 40) ---------- */
const ICON = {
  tree: '<rect x="18" y="30" width="4" height="8" fill="#7a4a26"/><path d="M20 2 L32 18 H26 L34 30 H6 L14 18 H8 Z" fill="#2f7a45"/>',
  flyer: '<rect x="8" y="4" width="24" height="32" rx="2" fill="#fff" stroke="#3a5b80" stroke-width="2.5"/><rect x="12" y="9" width="16" height="7" fill="#e0a21a"/><path d="M12 21 h16 M12 26 h16 M12 31 h10" stroke="#8aa0b8" stroke-width="2"/>',
  pillow: '<path d="M6 10 Q20 4 34 10 Q38 20 34 30 Q20 36 6 30 Q2 20 6 10 Z" fill="#d0477a" stroke="#8a1f4a" stroke-width="2.5"/><path d="M12 15 Q20 12 28 15" stroke="#fff" stroke-width="2" fill="none"/>',
  flat: '<path d="M4 20 H36 L32 36 H8 Z" fill="#c9a26b" stroke="#7a5a2a" stroke-width="2.5"/><circle cx="12" cy="17" r="5" fill="#d52b1e"/><circle cx="20" cy="15" r="5" fill="#e0412f"/><circle cx="28" cy="17" r="5" fill="#d52b1e"/>',
  basket: '<path d="M6 16 H34 L30 36 H10 Z" fill="#e3c38f" stroke="#7a5a2a" stroke-width="2.5"/><circle cx="14" cy="14" r="4" fill="#c2185b"/><circle cx="21" cy="12" r="4" fill="#d81b60"/><circle cx="27" cy="14" r="4" fill="#c2185b"/>',
  paint: '<rect x="8" y="10" width="24" height="26" rx="3" fill="#8aa0b8" stroke="#3a4254" stroke-width="2.5"/><rect x="8" y="16" width="24" height="10" fill="#1f5bd6"/><path d="M10 10 Q20 0 30 10" stroke="#3a4254" stroke-width="2" fill="none"/>',
  helper: '<circle cx="20" cy="10" r="6" fill="#7a4a26"/><path d="M10 38 V24 Q10 17 20 17 Q30 17 30 24 V38 Z" fill="#e0a21a"/><rect x="11" y="4" width="18" height="5" rx="2.5" fill="#f4c20d"/>'
};
const icon = (kind, s) => { const e = svgEl('svg', { viewBox: '0 0 40 40', width: s, height: s, class: 'u2l4-ic' }); e.innerHTML = ICON[kind]; return e; };

/* =====================================================================================
 * 1. Piecework: the counter and the pay meter
 * ===================================================================================== */
const PL = {
  a: { who: '(a) Tree planter', n: 2350, r: 0.16, what: 'seedlings', one: 'seedling', kind: 'tree', per: 50, est: 'about 2&#8239;000 trees at about 20¢ is about <b>$400</b>' },
  b: { who: '(b) Flyer carrier', n: 580, r: 0.05, what: 'flyers', one: 'flyer', kind: 'flyer', per: 20, est: 'about 600 flyers at 5¢ is about <b>$30</b>' },
  c: { who: '(c) Sewing worker', n: 64, r: 1.85, what: 'pillow covers', one: 'pillow cover', kind: 'pillow', per: 2, est: 'about 60 covers at about $2 is about <b>$120</b>' },
  d: { who: '(d) Strawberry picker', n: 27, r: 4.25, what: 'flats', one: 'flat', kind: 'flat', per: 1, est: 'about 30 flats at about $4 is about <b>$120</b>' }
};
const planter = {
  title: 'Piecework: the pay grows with every piece',
  height: 380,
  minW: 900,
  choices: [{ sep: 'Example 1 check:' }, { v: 'a', label: '(a) Trees' }, { v: 'b', label: '(b) Flyers' }, { v: 'c', label: '(c) Pillow covers' }, { v: 'd', label: '(d) Strawberries' }],
  ask: (k) => `Example 1${PL[k].who.slice(0, 3)}: a ${PL[k].who.slice(4).toLowerCase()} finishes <b>${N(PL[k].n)} ${PL[k].what}</b> at <b>${M(PL[k].r)}</b> ${PL[k].kind === 'flat' ? 'per flat' : 'each'}. Find the pay.`,
  make(stage, k, ex) {
    const d = PL[k], W = ex.W, pay = d.n * d.r, nI = Math.ceil(d.n / d.per);
    // the field of pieces
    const FX = 20, FY = 14, FW = Math.min(560, W - 380), cols = 10, S = Math.min(48, FW / cols), rows = Math.ceil(nI / cols);
    const field = add(stage, box(h('div', 'u2l4-field'), FW, Math.max(rows * S, S) + 16), FX, FY);
    const ics = [];
    for (let i = 0; i < nI; i++) { const e = add(field, icon(d.kind, S - 6), 8 + (i % cols) * S, 8 + Math.floor(i / cols) * S); e.style.opacity = 0; ics.push(e); }
    const key = add(stage, box(h('div', 'u2l4-key', d.per > 1 ? `each picture = ${d.per} ${d.what}` : `each picture = 1 ${d.one}`), FW, 24), FX, FY + rows * S + 24);
    // counter, rate tag, pay meter
    const PX = FX + FW + 30, PW = W - PX - 16;
    const tag = hide(add(stage, box(cbox('u2l4-ptag', `<small>piece rate</small><b>${M(d.r)}</b><em>per ${d.one}</em>`), PW, 86), PX, 10));
    const cnt = add(stage, box(h('div', 'u2l4-odo', `<small>${d.what}</small><b>0</b>`), PW, 70), PX, 110);
    const met = add(stage, box(h('div', 'u2l4-odo pay', '<small>pay</small><b>$0.00</b>'), PW, 70), PX, 190);
    const cB = cnt.querySelector('b'), mB = met.querySelector('b');
    const res = hide(add(stage, box(cbox('u2l4-res', `${T(`${d.r.toFixed(2)}\\times${NT(d.n)}=${MT(pay)}`)}`), PW, 50), PX, 272));
    const est = hide(add(stage, box(cbox('u2l4-est', `Estimate: ${d.est} ✓`), W - 40, 40), 20, 332));
    void key;
    return [
      { cap: `Piece rate: <b>${M(d.r)}</b> for each ${d.one}.`, run: (c) => c.pop(tag) },
      { cap: `Work! Every ${d.one} adds ${M(d.r)} to the pay.`,
        run: (c) => tween(c, 2600, (t) => { const n = Math.round(d.n * t); cB.textContent = N(n); mB.textContent = M(n * d.r); const on = Math.ceil(n / d.per); ics.forEach((e, i) => { e.style.opacity = i < on ? 1 : 0; }); }) },
      { cap: `Pay = rate × pieces = ${T(`${d.r.toFixed(2)}\\times${NT(d.n)}=${MT(pay)}`)}.`, run: (c) => c.pop(res) },
      { cap: `Estimate to check: ${d.est}. Close ✓`, run: (c) => c.fadeIn(est) }
    ];
  }
};

/* =====================================================================================
 * 1b. Effective hourly rate: cut the pay into hours; the minimum-wage bar
 * ===================================================================================== */
const PH = {
  m: { ask: 'Example 2: Mei-Ling earned $9.50 × 18 + $14.00 × 7 + $11.25 × 4 in <b>13.5 hours</b>. What did she earn per hour?',
    parts: [['hems', 9.5, 18], ['zippers', 14, 7], ['shirts', 11.25, 4]], hrs: 13.5 },
  n: { ask: 'Example 3(a): Nadia planted 2&#8239;350 seedlings at $0.16 each in <b>10 hours</b>. What was her effective hourly rate?',
    parts: [['2&#8239;350 seedlings', 0.16, 2350]], hrs: 10, min: true },
  r: { ask: 'Example 3(b): on a rainy day, Nadia plants only <b>820 seedlings</b> in <b>9 hours</b>. Effective hourly rate? Does her employer need to add money?',
    parts: [['820 seedlings', 0.16, 820]], hrs: 9, min: true }
};
const perHour = {
  title: 'Effective hourly rate: pay ÷ hours',
  height: 400,
  minW: 900,
  capH: 92,
  choices: [{ sep: 'Check:' }, { v: 'm', label: 'Example 2(b) · Mei-Ling' }, { v: 'n', label: 'Example 3(a) · Nadia' }, { v: 'r', label: 'Example 3(b) · Rainy day' }],
  ask: (k) => PH[k].ask,
  make(stage, k, ex) {
    const d = PH[k], W = ex.W, pays = d.parts.map(([, r, n]) => r * n), pay = pays.reduce((a, b) => a + b, 0), mn = d.hrs * 15, per = pay / d.hrs;
    const X0 = 150, BW = W - X0 - 150, px = BW / Math.max(pay, d.min ? mn : 0), BH = 60, Y1 = 20, Y2 = 210;
    add(stage, box(h('div', 'u2l4-rlab', 'Pay'), X0 - 20, BH), 6, Y1);
    let x = X0; const segs = d.parts.map(([nm, r, n], i) => {
      const s = zero(add(stage, box(h('div', 'u2l4-seg s' + i, d.parts.length > 1 ? `${nm}<br>${M(r * n)}` : M(r * n)), r * n * px, BH), x, Y1));
      x += r * n * px; return s;
    });
    const tot = hide(add(stage, box(cbox('u2l4-rres', `<b>${M(pay)}</b>`), 140, BH), X0 + pay * px + 8, Y1));
    // hour cuts
    const cuts = []; for (let i = 1; i < d.hrs; i++) cuts.push(hide(add(stage, box(h('div', 'u2l4-cut'), 3, BH + 16), X0 + i * pay / d.hrs * px - 1, Y1 - 8)));
    const hlab = hide(add(stage, box(cbox('u2l4-hlab', `${d.hrs} hours: each hour gets ${Math.abs(per - rnd(per)) < 1e-9 ? '' : 'about '}<b>${M(per)}</b>`), BW, 30), X0, Y1 + BH + 14));
    const lines = [];
    const res = hide(add(stage, box(cbox('u2l4-res', `${T(`${MT(pay)}\\div${d.hrs}=${Math.abs(per - rnd(per)) < 1e-9 ? MT(per) : NT(rnd(per, 3)) + '\\ldots\\approx' + MT(per)}`)} per hour`), 520, 50), X0, Y1 + BH + 56));
    const steps = [];
    if (d.parts.length > 1) {
      steps.push({ cap: `Pay for each task: ${d.parts.map(([, r, n]) => T(`${r.toFixed(2)}\\times${n}=${MT(r * n)}`)).join(', ')}.`,
        run: async (c) => { for (let i = 0; i < segs.length; i++) await grow(c, segs[i], pays[i] * px, 500); } });
      steps.push({ cap: `Add them: ${T(`${pays.map((p) => MT(p)).join('+')}=${MT(pay)}`)} for the week.`, run: (c) => c.pop(tot) });
    } else {
      const [, r, n] = d.parts[0];
      steps.push({ cap: `Pay: ${T(`${NT(n)}\\times${MT(r)}=${MT(pay)}`)}.`, run: async (c) => { await grow(c, segs[0], pay * px, 800); await c.pop(tot); } });
    }
    steps.push({ cap: `She worked <b>${d.hrs} h</b>. Cut the pay into ${d.hrs} equal hour pieces${d.hrs % 1 ? ' (the last one is half an hour)' : ''}.`,
      run: async (c) => { for (const e of cuts) await c.fadeIn(e, 120, { from: 'scaleY(.2)' }); } });
    steps.push({ cap: `Effective hourly rate = pay ÷ hours: ${T(`${MT(pay)}\\div${d.hrs}`)} ${Math.abs(per - rnd(per)) < 1e-9 ? '=' : '≈'} <b>${M(per)}</b> per hour.`,
      run: async (c) => { await c.fadeIn(hlab); await c.pop(res); } });
    if (d.min) {
      add(stage, box(h('div', 'u2l4-rlab', 'Minimum<br><small>wage</small>'), X0 - 20, BH), 6, Y2);
      const mb = zero(add(stage, box(h('div', 'u2l4-seg min', `${d.hrs} × $15.00 = ${M(mn)}`), mn * px, BH), X0, Y2));
      steps.push({ cap: `Minimum wage for ${d.hrs} h: ${T(`${d.hrs}\\times\\$15.00=${MT(mn)}`)}.`, run: (c) => grow(c, mb, mn * px, 700) });
      if (pay >= mn) {
        const ok = hide(add(stage, box(cbox('u2l4-note', `${M(per)} per hour is <b>far more</b> than $15.00. No top-up needed.`), BW, 50), X0, Y2 + BH + 16));
        steps.push({ cap: `Her pay bar is much longer than the minimum-wage bar: ${M(per)} per hour is <b>far more</b> than $15.00.`, run: (c) => c.fadeIn(ok) });
      } else {
        const gap = zero(add(stage, box(h('div', 'u2l4-seg top', ''), (mn - pay) * px, BH), X0 + pay * px, Y1));
        const gapL = hide(add(stage, box(cbox('u2l4-rres', `+ <b>${M(mn - pay)}</b>`), 140, BH), X0 + mn * px + 8, Y1));
        const nt = hide(add(stage, box(cbox('u2l4-note', `Less than $15.00, so the employer adds ${T(`${MT(mn)}-${MT(pay)}=${MT(mn - pay)}`)}.`), BW, 50), X0, Y2 + BH + 16));
        steps.push({ cap: `${M(per)} per hour is <b>less</b> than $15.00. The employer adds ${T(`${MT(mn)}-${MT(pay)}=${MT(mn - pay)}`)}.`,
          run: async (c) => { await c.anim(tot, [{ opacity: 1 }, { opacity: 0 }], 250); await grow(c, gap, (mn - pay) * px, 600); await c.pop(gapL); await c.fadeIn(nt); } });
      }
    }
    void lines;
    return steps;
  }
};

/* =====================================================================================
 * 2. Working backwards: the pay = rate × pieces triangle
 * ===================================================================================== */
const BK = {
  a: { ask: 'Example 4(a): a florist is paid <b>$382.50</b> to make <b>30</b> centrepieces. How much is she paid for each one?',
    pay: 382.5, rate: 12.75, n: 30, find: 'rate', unit: 'centrepiece' },
  b: { ask: 'Example 4(b): Tomas translates for <b>$0.12 per word</b>. He was paid <b>$258.00</b>. How many words long was the document?',
    pay: 258, rate: 0.12, n: 2150, find: 'n', unit: 'word' },
  c: { ask: 'Example 4(c): Sana picks strawberries for <b>$4.25 per flat</b>. How many flats must she pick to earn <b>at least $120.00</b>?',
    pay: 120, rate: 4.25, n: 120 / 4.25, find: 'n', unit: 'flat', goal: true }
};
const backwards = {
  title: 'Work backwards: cover what you want',
  height: 400,
  minW: 900,
  capH: 92,
  choices: [{ sep: 'Example 4 check:' }, { v: 'a', label: '(a) Florist: rate' }, { v: 'b', label: '(b) Translator: pieces' }, { v: 'c', label: '(c) Sana: round up' }],
  ask: (k) => BK[k].ask,
  make(stage, k, ex) {
    const d = BK[k], W = ex.W;
    // the triangle
    const TX = 30, TW = 330, TY = 20, TH = 250;
    const tri = svgEl('svg', { width: TW, height: TH, viewBox: `0 0 ${TW} ${TH}`, class: 'u2l4-svg' });
    tri.innerHTML = `<path d="M${TW / 2} 6 L${TW - 6} ${TH - 6} L6 ${TH - 6} Z" fill="#fff6e5" stroke="#9a6a24" stroke-width="4" stroke-linejoin="round"/><line x1="${TW * 0.2}" y1="${TH * 0.55}" x2="${TW * 0.8}" y2="${TH * 0.55}" stroke="#9a6a24" stroke-width="4"/><line x1="${TW / 2}" y1="${TH * 0.55}" x2="${TW / 2}" y2="${TH - 6}" stroke="#9a6a24" stroke-width="3"/>`;
    add(stage, tri, TX, TY);
    const cell = (html, x, y, w) => add(stage, box(cbox('u2l4-tcell', html), w, 64), x, y);
    const showN = d.find === 'n' && d.goal ? '?' : d.find === 'n' ? '?' : N(d.n);
    const cPay = cell(`<small>pay</small><b>${M(d.pay)}</b>`, TX + TW / 2 - 70, TY + 60, 140);
    const cRate = cell(`<small>rate</small><b>${d.find === 'rate' ? '?' : M(d.rate)}</b>`, TX + 22, TY + 160, 130);
    const cN = cell(`<small>pieces</small><b>${showN}</b>`, TX + TW - 152, TY + 160, 130);
    const times = add(stage, box(h('div', 'u2l4-op', '×'), 30, 30), TX + TW / 2 - 15, TY + 176);
    const cover = hide(add(stage, box(h('div', 'u2l4-cover', 'cover it'), 140, 70), d.find === 'rate' ? TX + 17 : TX + TW - 157, TY + 157));
    const rule = hide(add(stage, box(cbox('u2l4-rule', d.find === 'rate' ? '<b>rate = pay ÷ pieces</b>' : '<b>pieces = pay ÷ rate</b>'), TW + 20, 46), TX - 10, TY + TH + 12));
    // working on the right
    const PX = TX + TW + 40, PW = W - PX - 16;
    const L = []; let ly = 14;
    const line = (html, cls = '') => { const e = hide(add(stage, box(cbox('u2l4-pl ' + cls, html), PW, 46), PX, ly)); ly += 54; L.push(e); return e; };
    const steps = [{ cap: '<b>pay = rate × pieces.</b> Fill in what you know.', run: async (c) => { await c.pop(cPay); await c.pop(cRate); await c.pop(cN); } }];
    if (d.find === 'rate') {
      const l1 = line(T(`${MT(d.pay)}\\div${d.n}=${MT(d.rate)}`)), l2 = line(`Check: ${T(`${d.n}\\times${MT(d.rate)}=${MT(d.pay)}`)} ✓`, 'ok'), l3 = line(`<b>${M(d.rate)}</b> per ${d.unit}`, 'big');
      steps.push({ cap: 'We want the <b>rate</b>. Cover it: what is left is <b>pay ÷ pieces</b>.', run: async (c) => { await c.pop(cover); await c.fadeIn(rule); } });
      steps.push({ cap: `rate = ${T(`${MT(d.pay)}\\div${d.n}=${MT(d.rate)}`)}.`, run: (c) => c.fadeIn(l1) });
      steps.push({ cap: `Check by multiplying: ${T(`${d.n}\\times${MT(d.rate)}=${MT(d.pay)}`)} ✓ She is paid <b>${M(d.rate)}</b> per centrepiece.`, run: async (c) => { await c.fadeIn(l2); await c.pop(l3); } });
    } else if (!d.goal) {
      const l1 = line(T(`${d.pay.toFixed(2)}\\div${d.rate.toFixed(2)}=${NT(d.n)}`)), l2 = line(`Check: ${T(`${NT(d.n)}\\times${MT(d.rate)}=${MT(d.pay)}`)} ✓`, 'ok'), l3 = line(`<b>${N(d.n)} words</b>`, 'big');
      steps.push({ cap: 'We want the number of <b>pieces</b> (words). Cover it: what is left is <b>pay ÷ rate</b>.', run: async (c) => { await c.pop(cover); await c.fadeIn(rule); } });
      steps.push({ cap: `pieces = ${T(`${d.pay.toFixed(2)}\\div${d.rate.toFixed(2)}=${NT(d.n)}`)}.`, run: (c) => c.fadeIn(l1) });
      steps.push({ cap: `Check: ${T(`${NT(d.n)}\\times${MT(d.rate)}=${MT(d.pay)}`)} ✓ The document was <b>${N(d.n)} words</b> long.`, run: async (c) => { await c.fadeIn(l2); await c.pop(l3); } });
    } else {
      const l1 = line(T('120.00\\div4.25=28.23\\ldots'));
      // goal chart: two bars against a $120 line
      const GX = PX + 10, GW = PW - 20, gy = 90, gpx = GW / 130;
      const goal = hide(add(stage, box(h('div', 'u2l4-goal'), 3, 150), GX + 120 * gpx, gy));
      const gl = hide(add(stage, box(h('div', 'u2l4-goall', 'goal $120.00'), 140, 22), GX + 120 * gpx - 70, gy - 22));
      const b28 = zero(add(stage, box(h('div', 'u2l4-gbar no', '28 flats: $119.00'), 119 * gpx, 52), GX, gy + 16));
      const b29 = zero(add(stage, box(h('div', 'u2l4-gbar ok', '29 flats: $123.25'), 123.25 * gpx, 52), GX, gy + 82));
      const s1 = hide(stamp(stage, 'Short ✗', { ok: false, x: GX + 70, y: gy + 170, rotate: 6, size: 'sm' }));
      const s2 = hide(stamp(stage, 'Enough ✓', { ok: true, x: GX + GW - 70, y: gy + 170, rotate: -6, size: 'sm' }));
      const fin = hide(add(stage, box(cbox('u2l4-pl big', '<b>Round up: 29 flats</b>'), PW, 46), PX, gy + 210));
      steps.push({ cap: 'We want the number of <b>flats</b>. Cover it: what is left is <b>pay ÷ rate</b>.', run: async (c) => { await c.pop(cover); await c.fadeIn(rule); } });
      steps.push({ cap: `${T('120.00\\div4.25=28.23\\ldots')} She cannot be paid for part of a flat. 28 or 29?`, run: (c) => c.fadeIn(l1) });
      steps.push({ cap: `28 flats: ${T('28\\times\\$4.25=\\$119.00')}. That is <b>short</b> of the $120.00 goal.`, run: async (c) => { await c.fadeIn(goal); await c.fadeIn(gl); await grow(c, b28, 119 * gpx, 700); s1.style.opacity = 1; await stampIn(c, s1); } });
      steps.push({ cap: `29 flats: ${T('29\\times\\$4.25=\\$123.25')}. Enough! <b>Round up</b>: she must pick <b>29 flats</b>.`, run: async (c) => { await grow(c, b29, 123.25 * gpx, 700); s2.style.opacity = 1; await stampIn(c, s2); await c.pop(fin); } });
    }
    void times;
    return steps;
  }
};

/* =====================================================================================
 * 2b. The employer's side: one basket's $9.00 (Full notes)
 * ===================================================================================== */
const farm = {
  title: 'Where does the $9.00 go?',
  height: 380,
  minW: 900,
  ask: 'Example 5: the farm pays pickers <b>$3.50</b> per basket and sells each basket for <b>$9.00</b>. The pickers fill <b>240</b> baskets.',
  make(stage, v, ex) {
    const W = ex.W, X0 = 170, BW = W - X0 - 40, px = BW / 9, BH = 64, Y = 50;
    add(stage, icon('basket', 110), 30, 20);
    add(stage, box(h('div', 'u2l4-rlab', 'one basket'), 140, 24), 10, 134);
    const full = zero(add(stage, box(h('div', 'u2l4-seg s0', 'selling price $9.00'), BW, BH), X0, Y));
    const pick = hide(add(stage, box(h('div', 'u2l4-seg pick', 'picker $3.50'), 3.5 * px, BH), X0, Y));
    const rest = hide(add(stage, box(h('div', 'u2l4-seg farmc', 'farm keeps $5.50'), 5.5 * px, BH), X0 + 3.5 * px, Y));
    const pct = hide(add(stage, box(cbox('u2l4-note', `${T('3.50\\div9.00\\times100=38.88\\ldots')} ≈ <b>38.9%</b> to the picker`), 3.5 * px + 260, 48), X0, Y + BH + 14));
    const rows = [
      `pickers: ${T('240\\times\\$3.50=\\$840.00')}`,
      `takes in: ${T('240\\times\\$9.00=\\$2\\,160.00')}`,
      `left: ${T('\\$2\\,160.00-\\$840.00=\\$1\\,320.00')} for other costs and profit`
    ].map((s, i) => hide(add(stage, box(cbox('u2l4-pl' + (i === 2 ? ' big' : ''), s), W - 60, 46), 30, 196 + i * 56)));
    return [
      { cap: 'One basket sells for <b>$9.00</b>.', run: (c) => grow(c, full, BW, 600) },
      { cap: 'The picker gets <b>$3.50</b> of it. The farm keeps <b>$5.50</b>.', run: async (c) => { await c.fadeIn(pick); await c.fadeIn(rest); } },
      { cap: `Percent to the picker: ${T('3.50\\div9.00\\times100=38.88\\ldots')} ≈ <b>38.9%</b>.`, run: (c) => c.fadeIn(pct) },
      { cap: `Now 240 baskets: the pickers get ${T('240\\times\\$3.50=\\$840.00')}.`, run: (c) => c.fadeIn(rows[0]) },
      { cap: `The farm takes in ${T('240\\times\\$9.00=\\$2\\,160.00')}. Left: <b>$1&#8239;320.00</b> for the farm’s other costs and profit.`, run: async (c) => { await c.fadeIn(rows[1]); await c.pop(rows[2]); } }
    ];
  }
};

/* =====================================================================================
 * 3. Contracts: price − materials, then cut into the hours worked
 * ===================================================================================== */
const CT = { a: 38, b: 52 };
const contract = {
  title: 'A contract: costs first, then the hours',
  height: 400,
  minW: 900,
  capH: 92,
  choices: [{ sep: 'Example 6 check:' }, { v: 'a', label: '(a) 38 hours' }, { v: 'b', label: '(b) 52 hours' }],
  ask: (k) => `Example 6${k === 'a' ? '(a)' : '(b)'}: Darnell paints a house for <b>$2&#8239;400.00</b>. Paint and supplies cost <b>$465.80</b>. The job takes <b>${CT[k]} hours</b>. Find his earnings and his effective hourly rate.`,
  make(stage, k, ex) {
    const hrs = CT[k], W = ex.W, price = 2400, mat = 465.8, earn = price - mat, per = earn / hrs;
    const X0 = 40, BW = W - 80, px = BW / price, BH = 66, Y = 30;
    const bar = zero(add(stage, box(h('div', 'u2l4-seg s0', ''), BW, BH), X0, Y));
    const lab = hide(add(stage, box(cbox('u2l4-blab', 'contract price <b>$2&#8239;400.00</b>'), BW, BH), X0, Y));
    const matB = hide(add(stage, box(h('div', 'u2l4-seg mat', 'materials $465.80'), mat * px, BH), X0 + earn * px, Y));
    const can = hide(add(stage, icon('paint', 56), X0 + earn * px + mat * px / 2 - 28, Y + BH + 8));
    const earnB = hide(add(stage, box(h('div', 'u2l4-seg earn', ''), earn * px, BH), X0, Y + 124));
    const earnL = hide(add(stage, box(cbox('u2l4-blab', `Darnell earns ${T('\\$2\\,400.00-\\$465.80=\\$1\\,934.20')}`), earn * px - 80, 36), X0, Y + BH + 14));
    const cuts = []; for (let i = 1; i < hrs; i++) cuts.push(hide(add(stage, box(h('div', 'u2l4-cut thin'), 2, BH + 10), X0 + i * earn * px / hrs - 1, Y + 119)));
    const hl = hide(add(stage, box(cbox('u2l4-hlab', `${hrs} hour pieces`), earn * px, 28), X0, Y + 124 + BH + 8));
    const res = hide(add(stage, box(cbox('u2l4-res', `${T(`\\$1\\,934.20\\div${hrs}=${Math.abs(per - rnd(per)) < 1e-9 ? MT(per) : NT(rnd(per, 3)) + '\\ldots\\approx' + MT(per)}`)} per hour`), 560, 50), X0, Y + 232));
    const cmp = k === 'b' ? hide(add(stage, box(cbox('u2l4-note', 'Same $1&#8239;934.20, more hours: only <b>$37.20</b> per hour instead of $50.90 for 38 hours.'), BW, 48), X0, Y + 294)) : null;
    const steps = [
      { cap: 'The contract price: <b>$2&#8239;400.00</b> for the whole job.', run: async (c) => { await grow(c, bar, BW, 700); await c.fadeIn(lab); } },
      { cap: 'The paint and supplies come out of that price: <b>$465.80</b>.', run: async (c) => { await c.fadeIn(matB); await c.pop(can); } },
      { cap: `<b>Subtract the costs first:</b> ${T('\\$2\\,400.00-\\$465.80=\\$1\\,934.20')}. That is what Darnell really earns.`,
        run: async (c) => { await c.anim(lab, [{ opacity: 1 }, { opacity: 0 }], 200); await c.anim(matB, [{ transform: 'none' }, { transform: 'translateX(40px)', opacity: 0.35 }], 500); await c.fadeIn(earnB); await c.fadeIn(earnL); } },
      { cap: `The job took <b>${hrs} hours</b>. Cut his earnings into ${hrs} equal hour pieces.`, run: async (c) => { for (const e of cuts) await c.fadeIn(e, 40, { from: 'none' }); await c.fadeIn(hl); } },
      { cap: `Effective hourly rate: ${T(`\\$1\\,934.20\\div${hrs}`)} ${Math.abs(per - rnd(per)) < 1e-9 ? '=' : '≈'} <b>${M(per)}</b> per hour.`, run: (c) => c.pop(res) }
    ];
    if (cmp) steps.push({ cap: 'Same pay, more hours: <b>less per hour</b>. A slow job costs the contractor.', run: (c) => c.fadeIn(cmp) });
    return steps;
  }
};

/* =====================================================================================
 * 3b. Setting a contract price: Amara's bid
 * ===================================================================================== */
const bid = {
  title: 'Building a bid',
  height: 400,
  minW: 900,
  capH: 92,
  ask: 'Example 7: materials <b>$1&#8239;180.00</b>; <b>2 helpers</b> × <b>12 h</b> × <b>$19.50</b>; Amara wants to earn <b>$600.00</b>. (a) What should she charge? (b) What does “costs plus 30%” give?',
  make(stage, v, ex) {
    const W = ex.W, X0 = 190, BW = W - X0 - 175, px = BW / 2248, BH = 62, YA = 30, YB = 190;
    const mat = 1180, hel = 2 * 12 * 19.5, want = 600, price = mat + hel + want, cost = mat + hel, p30 = cost * 1.3, earn30 = p30 - cost;
    add(stage, box(h('div', 'u2l4-rlab', 'Amara’s way'), X0 - 20, BH), 6, YA);
    const a1 = zero(add(stage, box(h('div', 'u2l4-seg mat', `materials<br>${M(mat)}`), mat * px, BH), X0, YA));
    const a2 = zero(add(stage, box(h('div', 'u2l4-seg help', `helpers<br>${M(hel)}`), hel * px, BH), X0 + mat * px, YA));
    const a3 = zero(add(stage, box(h('div', 'u2l4-seg earn', `Amara<br>${M(want)}`), want * px, BH), X0 + (mat + hel) * px, YA));
    const hwX = X0 + mat * px + 56, hw = hide(add(stage, box(cbox('u2l4-note sm', `helpers: ${T('2\\times12\\times\\$19.50=\\$468.00')}`), Math.min(380, W - hwX - 10), 44), hwX, YA + BH + 8));
    const ic = [hide(add(stage, icon('helper', 40), X0 + mat * px + 6, YA + BH + 8)), hide(add(stage, icon('helper', 40), X0 + mat * px + 6 - 46, YA + BH + 8))];
    const pA = hide(add(stage, box(cbox('u2l4-rres', `= <b>${M(price)}</b>`), 150, BH), X0 + price * px + 6, YA));
    add(stage, box(h('div', 'u2l4-rlab', 'Costs + 30%'), X0 - 20, BH), 6, YB);
    const b1 = zero(add(stage, box(h('div', 'u2l4-seg cost', `costs ${M(cost)}`), cost * px, BH), X0, YB));
    const b2 = zero(add(stage, box(h('div', 'u2l4-seg earn small', `${M(earn30)}`), earn30 * px, BH), X0 + cost * px, YB));
    const pB = hide(add(stage, box(cbox('u2l4-rres', `= <b>${M(p30)}</b>`), 150, BH), X0 + p30 * px + 6, YB));
    const gap = hide(add(stage, box(h('div', 'u2l4-gapb'), (want - earn30) * px, BH), X0 + p30 * px, YB));
    const nt = hide(add(stage, box(cbox('u2l4-note', `${T('\\$1\\,648.00\\times1.30=\\$2\\,142.40')}: Amara earns only ${T('\\$2\\,142.40-\\$1\\,648.00=\\$494.40')}, less than $600.00.`), W - 40, 56), 20, YB + BH + 22));
    return [
      { cap: `Start with the materials: <b>${M(mat)}</b>.`, run: (c) => grow(c, a1, mat * px, 600) },
      { cap: `Helpers: ${T('2\\times12\\times\\$19.50=\\$468.00')}.`, run: async (c) => { await c.pop(ic[0]); await c.pop(ic[1]); await c.fadeIn(hw); await grow(c, a2, hel * px, 500); } },
      { cap: 'Add what Amara wants to earn: <b>$600.00</b>.', run: (c) => grow(c, a3, want * px, 500) },
      { cap: `Price = ${T('\\$1\\,180.00+\\$468.00+\\$600.00=\\$2\\,248.00')}. (Many contractors round a bid, for example to $2&#8239;250.00.)`, run: (c) => c.pop(pA) },
      { cap: `Her friend’s way: costs ${T('\\$1\\,180.00+\\$468.00=\\$1\\,648.00')}, then × 1.30.`, run: async (c) => { await c.anim(hw, [{ opacity: 1 }, { opacity: 0 }], 200); ic.forEach((e) => { e.style.opacity = 0; }); await grow(c, b1, cost * px, 600); } },
      { cap: `${T('\\$1\\,648.00\\times1.30=\\$2\\,142.40')}. Amara’s part is only <b>$494.40</b>, less than the $600.00 she wants.`, run: async (c) => { await grow(c, b2, earn30 * px, 500); await c.pop(pB); await c.fadeIn(gap); await c.fadeIn(nt); } }
    ];
  }
};

/* =====================================================================================
 * 4. Jaxon: the hourly line and the flat contract line
 * ===================================================================================== */
const compare = {
  title: 'Hourly or contract? It depends on the hours',
  height: 430,
  minW: 900,
  capH: 92,
  ask: 'Example 8: Option A pays <b>$26.50 per hour</b>. Option B is a <b>$1&#8239;400.00</b> contract, minus about <b>$95.00</b> for tape and mud. Which pays more?',
  make(stage, v, ex) {
    const W = ex.W, GW = Math.min(560, W - 360);
    const G = new Graph(stage, { x: 6, y: 6, width: GW, height: 410, xmin: 0, xmax: 70, ymin: 0, ymax: 2000, xstep: 10, ystep: 200, xlabels: 10, ylabels: 400, xtitle: '\\text{hours}', ytitle: '\\text{pay (\\$)}', fontSize: 16 });
    const A = G.fn((x) => 26.5 * x, { from: 0, to: 70, color: 'brand', width: 4 });
    const B = G.segment([0, 1305], [70, 1305], { color: 'blue', width: 4 });
    [A, B].forEach((e) => hide(e));
    const la = hide(G.label(62, 26.5 * 62, '<b>A: $26.50/h</b>', { pos: 'w', cls: 'bk-pill', dx: -8 }));
    const lb = hide(G.label(66, 1305, '<b>B: $1&#8239;305</b>', { pos: 'n', cls: 'bk-pill', dy: -6 }));
    const p40a = hide(G.point(40, 1060, { color: 'brand' })), p40b = hide(G.point(40, 1305, { color: 'blue' }));
    const p55a = hide(G.point(55, 1457.5, { color: 'brand' })), p55b = hide(G.point(55, 1305, { color: 'blue' }));
    const v40 = hide(G.segment([40, 0], [40, 1305], { dash: true, color: 'gray', width: 2 })), v55 = hide(G.segment([55, 0], [55, 1457.5], { dash: true, color: 'gray', width: 2 }));
    const xc = 1305 / 26.5, pc = hide(G.point(xc, 1305, { color: 'red', r: 7 })), vc = hide(G.segment([xc, 0], [xc, 1305], { dash: true, color: 'red', width: 2 }));
    const PX = GW + 24, PW = W - PX - 10;
    const L = [
      `<b>40 h</b>: A ${T('40\\times\\$26.50=\\$1\\,060.00')}<br>B ${T('\\$1\\,400.00-\\$95.00=\\$1\\,305.00')}<br><b>B</b> pays $245.00 more`,
      `<b>55 h</b>: A ${T('55\\times\\$26.50=\\$1\\,457.50')}<br>B still $1&#8239;305.00<br><b>A</b> pays $152.50 more`,
      `<b>Same pay:</b> ${T('1\\,305.00\\div26.50=49.24\\ldots')}<br>about <b>49.2 h</b>`
    ].map((s, i) => hide(add(stage, box(cbox('u2l4-pl tall' + (i === 2 ? ' big' : ''), s), PW, i === 2 ? 76 : 104), PX, 10 + i * 116)));
    const show = (c, ...els) => Promise.all(els.map((e) => c.anim(e, [{ opacity: 0 }, { opacity: 1 }], 300)));
    return [
      { cap: 'Option A: the pay grows <b>$26.50 every hour</b>. A sloped line.', run: async (c) => { A.style.opacity = 1; await G.drawIn(A, 900, c); await show(c, la); } },
      { cap: `Option B: ${T('\\$1\\,400.00-\\$95.00=\\$1\\,305.00')}, <b>no matter how long</b> it takes. A flat line.`, run: async (c) => { B.style.opacity = 1; await G.drawIn(B, 900, c); await show(c, lb); } },
      { cap: `(a) At 40 h: A pays ${T('\\$1\\,060.00')}, B pays ${T('\\$1\\,305.00')}. <b>B</b> pays more, by <b>$245.00</b>.`, run: async (c) => { await show(c, v40); await show(c, p40a, p40b); await c.fadeIn(L[0]); } },
      { cap: `(b) At 55 h: A pays ${T('\\$1\\,457.50')}, B still ${T('\\$1\\,305.00')}. <b>A</b> pays more, by <b>$152.50</b>.`, run: async (c) => { await show(c, v55); await show(c, p55a, p55b); await c.fadeIn(L[1]); } },
      { cap: `(c) The lines cross where ${T('26.50\\times\\text{hours}=1\\,305')}: ${T('1\\,305.00\\div26.50\\approx49.2')} h. Faster than that: the contract wins. Slower: the hourly wage wins.`, run: async (c) => { await show(c, vc, pc); await c.fadeIn(L[2]); } }
    ];
  }
};

/* =====================================================================================
 * 4b. Kiana: Job 2 per hour at 5 to 9 bags an hour (Full notes)
 * ===================================================================================== */
const kiana = {
  title: 'Job 1 or Job 2? It depends on her speed',
  height: 400,
  minW: 900,
  ask: 'Example 9: Job 1 pays <b>$16.50/h</b>. Job 2 pays <b>$2.40 per bag</b>, topped up to $15.00/h. Kiana sews 5 bags an hour now, 9 after practice.',
  make(stage, v, ex) {
    const W = ex.W, X0 = 120, Yb = 340, py = 13.5, CW = 80, G = (W - X0 - 60 - 5 * CW) / 4;
    add(stage, box(h('div', 'u2l4-axisx'), W - X0 - 30, 3), X0 - 10, Yb);
    const line = (val, cls, txt) => { const e = hide(add(stage, box(h('div', 'u2l4-hl ' + cls), W - X0 - 30, 0), X0 - 10, Yb - val * py)); const l = hide(add(stage, box(h('div', 'u2l4-hll ' + cls, txt), X0 - 12, 24), 2, cls === 'j1' ? Yb - val * py - 26 : Yb - val * py + 3)); return [e, l]; };
    const j1 = line(16.5, 'j1', 'Job 1: $16.50'), mw = line(15, 'mw', 'min $15.00');
    const cols = [5, 6, 7, 8, 9].map((b, i) => {
      const x = X0 + i * (CW + G), p = b * 2.4, top = Math.max(0, 15 - p);
      const col = zero(add(stage, box(h('div', 'u2l4-col' + (p > 16.5 ? ' win' : '')), CW, p * py), x, Yb - p * py), 'height');
      const tp = top > 0 ? hide(add(stage, box(h('div', 'u2l4-col top'), CW, top * py), x, Yb - 15 * py)) : null;
      const lab = hide(add(stage, box(h('div', 'u2l4-colv' + (top > 0 ? ' in' : '')), CW + 20, 26), x - 10, top > 0 ? Yb - p * py + 10 : Yb - p * py - 30));
      lab.innerHTML = top > 0 ? `${M(p)}<br>→ $15` : M(p);
      add(stage, box(h('div', 'u2l4-colx', `${b} bags/h`), CW + 20, 24), x - 10, Yb + 8);
      return { col, tp, lab, p, x };
    });
    const grow1 = async (c, o) => { o.col.style.opacity = 1; await tween(c, 500, (t) => { o.col.style.height = (o.p * py * t) + 'px'; o.col.style.top = (Yb - o.p * py * t) + 'px'; }); if (o.tp) await c.fadeIn(o.tp); await c.fadeIn(o.lab); };
    const st = hide(stamp(stage, 'Job 2 wins from 7 bags/h', { ok: true, x: cols[3].x + CW / 2, y: 30, rotate: -4, size: 'sm' }));
    return [
      { cap: 'Job 1 pays <b>$16.50</b> every hour, however fast she sews.', run: async (c) => { await c.fadeIn(j1[0]); await c.fadeIn(j1[1]); } },
      { cap: `Beginner, 5 bags an hour: ${T('5\\times\\$2.40=\\$12.00')}. Under minimum wage, so it is topped up to <b>$15.00</b>. Job 1 is better.`, run: async (c) => { await c.fadeIn(mw[0]); await c.fadeIn(mw[1]); await grow1(c, cols[0]); } },
      { cap: `6 bags: ${T('\\$14.40')} → $15.00. 7 bags: ${T('7\\times\\$2.40=\\$16.80')}, just over $16.50!`, run: async (c) => { await grow1(c, cols[1]); await grow1(c, cols[2]); } },
      { cap: `After practice, 9 bags an hour: ${T('9\\times\\$2.40=\\$21.60')}. Job 2 is much better.`, run: async (c) => { await grow1(c, cols[3]); await grow1(c, cols[4]); st.style.opacity = 1; await stampIn(c, st); } }
    ];
  }
};

mountExplainers({ planter, perHour, backwards, farm, contract, bid, compare, kiana });

/* ============ Stand Up Break! — piecework pay, pay per hour, contracts and pieces needed, at the whiteboards ============ */
{
  const NAMES = ['Aria', 'Ben', 'Carmen', 'Dev', 'Elena', 'Femi', 'Gus', 'Hana', 'Isaac', 'Jade', 'Kofi', 'Lia', 'Marco', 'Nora', 'Owen', 'Pia'];
  const PIECE = [['plants', 'tree', 'trees', [12, 15, 16, 18, 20, 22]], ['picks', 'flat of berries', 'flats', [350, 400, 425, 450, 475]], ['sews', 'apron', 'aprons', [275, 320, 350, 380]], ['delivers', 'flyer', 'flyers', [4, 5, 6, 7]], ['assembles', 'circuit board', 'boards', [225, 250, 275, 300]]];
  const dd = (v) => grp(dec(v, 2), '\\,');
  const exact = (v) => Math.abs(v * 100 - Math.round(v * 100)) < 1e-6;
  standup('u2l4', {
    intro: 'Estimate first, then use your calculator. Show your work, and check by multiplying.',
    levels: {
      BEG: (r) => { // piecework pay
        const who = r.pick(NAMES), [verb, one, many, cents] = r.pick(PIECE), rate = r.pick(cents) / 100;
        const n = rate < 0.3 ? r.int(12, 30) * 50 : rate < 1 ? r.int(30, 90) * 10 : r.int(12, 48);
        return { text: `${who} ${verb} <b>${grp(String(n), ' ')} ${many}</b> at <b>$${dec(rate)}</b> per ${one}. Find the pay.`, q: '',
          a: [`${grp(String(n), '\\,')}\\times\\$${dd(rate)}=\\$${dd(n * rate)}`] };
      },
      PRG: (r) => { // effective hourly rate and minimum wage
        const who = r.pick(NAMES), rate = r.pick([14, 15, 16, 17, 18]) / 100, hrs = r.pick([7, 7.5, 8, 8.5, 9, 10]);
        const n = r.chance(0.5) ? r.int(16, 26) * 50 : r.int(60, 85) * 10, pay = n * rate, per = pay / hrs, mn = hrs * 15;
        const a = [`${grp(String(n), '\\,')}\\times\\$${dd(rate)}=\\$${dd(pay)}`, `\\$${dd(pay)}\\div${hrs}${exact(per) ? '=' : '\\approx'}\\$${dd(per)}\\text{ per hour}`];
        if (pay < mn) a.push(`\\text{under }\\$15.00:\\ ${hrs}\\times\\$15.00=\\$${dd(mn)}`, `\\text{employer adds }\\$${dd(mn)}-\\$${dd(pay)}=\\$${dd(mn - pay)}`);
        else a.push('\\text{at least }\\$15.00\\text{, so no top-up}');
        return { text: `${who} plants <b>${grp(String(n), ' ')} trees</b> at <b>$${dec(rate)}</b> per tree in <b>${hrs} hours</b>. Find the pay and the effective hourly rate. Does the employer need to add money to reach the $15.00 minimum wage?`, q: '', a };
      },
      MAS: (r) => r.pick([
        () => { // contract with a helper
          const who = r.pick(NAMES), price = r.int(30, 90) * 100, mat = rnd(price * r.int(20, 40) / 100 + r.int(0, 99) / 100, 2), hh = r.pick([8, 10, 12, 16]), hw = r.pick([18, 19.5, 20, 21, 22.5]), help = hh * hw, own = r.pick([24, 30, 32, 36, 40]);
          const earn = price - mat - help, per = earn / own;
          return { text: `${who} takes a contract for <b>$${grp(price.toFixed(2), ' ')}</b>. Materials cost <b>$${grp(dec(mat), ' ')}</b>. A helper works <b>${hh} h</b> at <b>$${dec(hw)}/h</b>. ${who} works <b>${own} h</b>. Find ${who}’s earnings and effective hourly rate.`, q: '',
            a: [`\\text{helper: }${hh}\\times\\$${dd(hw)}=\\$${dd(help)}`, `\\$${dd(price)}-\\$${dd(mat)}-\\$${dd(help)}=\\$${dd(earn)}`, `\\$${dd(earn)}\\div${own}${exact(per) ? '=' : '\\approx'}\\$${dd(per)}\\text{ per hour}`] };
        },
        () => { // pieces needed for a goal (round up)
          const who = r.pick(NAMES), rate = r.pick([0.14, 0.16, 0.18, 0.22, 0.24]), goal = r.int(25, 45) * 10, q = goal / rate, n = Math.ceil(q - 1e-9);
          const a = Number.isInteger(rnd(q, 6)) ? [`${dd(goal)}\\div${dd(rate)}=${grp(String(n), '\\,')}`, `\\text{Check: }${grp(String(n), '\\,')}\\times\\$${dd(rate)}=\\$${dd(n * rate)}`]
            : [`${dd(goal)}\\div${dd(rate)}=${grp(String(rnd(q, 2)), '\\,')}\\ldots`, `\\text{round up: }${grp(String(n), '\\,')}\\text{ trees}`, `\\text{Check: }${grp(String(n), '\\,')}\\times\\$${dd(rate)}=\\$${dd(n * rate)}\\ \\checkmark`];
          return { text: `${who} plants trees for <b>$${dec(rate)}</b> per tree. How many trees must ${who} plant to earn <b>at least $${dec(goal)}</b> in a day?`, q: '', a };
        }
      ])()
    }
  });
}
