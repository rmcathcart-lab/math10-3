/* Math 10-3 · Unit 2 · Lesson 8 — Working Backwards: How Many Hours Do I Need?
 * Explainers: the formula "undo machine" (run pay = rate × hours backwards, then check forwards); the formula triangle
 * (Full notes); which way to divide (Full notes); round up (41 h is short, 42 h is enough, then 6-hour shifts);
 * Kofi's week with overtime blocks added to his shifts and a pay meter; paid hours (each overtime hour is a 1.5-wide
 * block); the commission machine run backwards (salary first); the graduated-commission sales bar with its two
 * levels and a commission meter; the savings-goal thermometer that fills with take-home pay hour by hour.
 * Then the Stand Up Break. */
import { h, add, box, tex, svgEl, tween, stamp, stampIn, mountExplainers } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const rnd = (v, d = 2) => Math.round((v + (v >= 0 ? 1e-9 : -1e-9)) * 10 ** d) / 10 ** d;
const grp = (s, sep) => s.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
const m = (v, d = 2) => { const [i, f] = rnd(v, d).toFixed(d).split('.'); return '$' + (i.length > 3 ? grp(i, ' ') : i) + (f ? '.' + f : ''); };   // money text
const MT = (v, d = 2) => { const [i, f] = rnd(v, d).toFixed(d).split('.'); return '\\$' + (i.length > 3 ? grp(i, '\\,') : i) + (f ? '.' + f : ''); }; // money TeX
const raw = (v) => String(parseFloat(v.toPrecision(10)));
const n0 = (v) => grp(String(v), ' ');
const lerp = (a, b, t) => a + (b - a) * t;
const cbox = (cls, html) => h('div', cls + ' u2l8-c', `<div>${html}</div>`);

/** one row of the undo machine: [left slot] → [machine] → [right slot], arrows pointing dir (1 → right, -1 ← left) */
function machineRow(stage, W, y, o) {
  const SW = 230, MW = 250, xL = 40, xM = (W - MW) / 2, xR = W - 40 - SW, H = 84;
  const L = add(stage, box(cbox('u2l8-slot ' + (o.lcls || ''), o.left), SW, H), xL, y);
  const M = add(stage, box(cbox('u2l8-mach ' + (o.mcls || ''), o.mach), MW, H + 16), xM, y - 8);
  const R = add(stage, box(cbox('u2l8-slot ' + (o.rcls || ''), o.right), SW, H), xR, y);
  const svg = add(stage, svgEl('svg', { width: W, height: H, class: 'u2l8-svg' }), 0, y);
  const col = o.color || '#6e4a1c', cy = H / 2;
  const arr = (x0, x1) => { const g = svgEl('g', {}, svg); svgEl('line', { x1: x0, y1: cy, x2: x1, y2: cy, stroke: col, 'stroke-width': 5, 'stroke-linecap': 'round' }, g); const d = Math.sign(x1 - x0); svgEl('path', { d: `M${x1} ${cy} l${-14 * d} -9 l0 18 z`, fill: col }, g); return g; };
  const a1 = o.dir > 0 ? arr(xL + SW + 8, xM - 8) : arr(xM - 8, xL + SW + 8);
  const a2 = o.dir > 0 ? arr(xM + MW + 8, xR - 8) : arr(xR - 8, xM + MW + 8);
  return { L, M, R, a1, a2, all: [L, M, R, svg] };
}

/* =====================================================================================
 * 1. The undo machine: run the pay formula backwards (Example 1)
 * ===================================================================================== */
const UM = {
  demo: { find: 'hours', pay: 450, rate: 18, hours: 25, est: '$450 at about $18 an hour is about 25 hours', who: 'Your goal' },
  a: { find: 'rate', pay: 446.25, rate: 17.5, hours: 25.5, est: 'about $450 for about 25 hours is about $18 an hour', who: 'Marco' },
  b: { find: 'hours', pay: 520, rate: 16.25, hours: 32, est: '$520 at about $16 an hour is about 30 hours', who: 'Jonas' }
};
const undoMachine = {
  title: 'The undo machine: run the formula backwards',
  height: 434,
  minW: 900,
  choices: [{ v: 'demo', label: '$450 at $18/h' }, { sep: 'Example 1 check:' }, { v: 'a', label: '(a) Marco’s wage' }, { v: 'b', label: '(b) Jonas’s hours' }],
  ask: (k) => ({
    demo: 'You earn <b>$18.00</b> an hour. How many hours must you work to earn <b>$450.00</b>?',
    a: 'Example 1(a): Marco earned <b>$446.25</b> for <b>25.5 hours</b> of work. What is his hourly wage?',
    b: 'Example 1(b): Jonas earns <b>$16.25</b> an hour. How many hours must he work to earn <b>$520.00</b>?'
  })[k],
  make(stage, k, ex) {
    const d = UM[k], W = ex.W, hrs = d.find === 'hours';
    // forward: the thing we want → × the thing we know → pay
    const know = hrs ? `rate ${m(d.rate)}` : `hours ${d.hours}`;
    const want = hrs ? 'hours' : 'rate';
    const ans = hrs ? `<b>${d.hours}</b> h` : `<b>${m(d.rate)}</b>/h`;
    add(stage, box(h('div', 'u2l8-rowlab', 'Forward'), 120, 26), 40, 4);
    const F = machineRow(stage, W, 34, { dir: 1, left: `${want} <b class="q">?</b>`, mach: `× ${hrs ? m(d.rate) : d.hours}<small>${know.split(' ')[0]}</small>`, right: `pay <b>${m(d.pay)}</b>` });
    const bl = hide(add(stage, box(h('div', 'u2l8-rowlab b', 'Backwards: undo × with ÷'), 360, 26), 40, 146));
    const B = machineRow(stage, W, 176, { dir: -1, left: `${want} <span class="u2l8-ans">${ans}</span>`, mach: `÷ ${hrs ? m(d.rate) : d.hours}<small>${know.split(' ')[0]}</small>`, right: `pay <b>${m(d.pay)}</b>`, color: '#c27a0e', mcls: 'undo' });
    B.all.forEach((e) => hide(e));
    const ansEl = B.L.querySelector('.u2l8-ans'); ansEl.style.opacity = 0;
    const est = hide(add(stage, box(cbox('u2l8-est', `Estimate: ${d.est}`), W - 80, 40), 40, 280));
    const eq = hide(add(stage, box(cbox('u2l8-eq', hrs ? `hours = pay ÷ rate ${T(`=${MT(d.pay)}\\div${MT(d.rate)}=${d.hours}`)}` : `rate = pay ÷ hours ${T(`=${MT(d.pay)}\\div${d.hours}=${MT(d.rate)}`)}`), W - 80, 46), 40, 326));
    const chk = hide(add(stage, box(cbox('u2l8-eq ok', `Check: ${T(`${MT(d.rate)}\\times${d.hours}=${MT(d.pay)}`)} ✓`), W - 300, 44), 40, 374));
    const st = hide(stamp(stage, 'Checks out ✓', { ok: true, x: W - 140, y: 396, rotate: -5 }));
    return [
      { cap: `Forward, the formula is a machine: ${want} → <b>× ${hrs ? m(d.rate) : d.hours}</b> → pay. But we don’t know the ${want}.`, run: (c) => c.anim(F.M, [{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }], 450) },
      { cap: `We know the <b>pay</b>. Run the machine <b>backwards</b>: the undo of × is <b>÷</b>.`, run: async (c) => { await c.fadeIn(bl); await c.fadeIn(B.R); await c.anim(B.all[3], [{ opacity: 0 }, { opacity: 1 }], 300); await c.pop(B.M); await c.fadeIn(B.L); } },
      { cap: `Estimate first: ${d.est}.`, run: (c) => c.fadeIn(est) },
      { cap: hrs ? `hours = pay ÷ rate = ${m(d.pay)} ÷ ${m(d.rate)} = <b>${d.hours}</b> hours.` : `rate = pay ÷ hours = ${m(d.pay)} ÷ ${d.hours} = <b>${m(d.rate)}</b> an hour.`, run: async (c) => { await c.fadeIn(eq); await c.pop(ansEl); } },
      { cap: `Check: put it back into pay = rate × hours: ${m(d.rate)} × ${d.hours} = ${m(d.pay)} ✓`, run: async (c) => { await c.fadeIn(chk); await stampIn(c, st); } }
    ];
  }
};

/* =====================================================================================
 * 2. The formula triangle (Full notes)
 * ===================================================================================== */
const TRI = {
  pay: { cover: 'pay', f: 'pay = rate × hours', why: '<b>rate</b> and <b>hours</b> are side by side: <b>multiply</b>' },
  hours: { cover: 'hours', f: 'hours = pay ÷ rate', why: '<b>pay</b> is above <b>rate</b>: <b>divide</b>' },
  rate: { cover: 'rate', f: 'rate = pay ÷ hours', why: '<b>pay</b> is above <b>hours</b>: <b>divide</b>' }
};
const triangle = {
  title: 'The formula triangle',
  height: 340,
  minW: 860,
  choices: [{ v: 'pay', label: 'Find the pay' }, { v: 'hours', label: 'Find the hours' }, { v: 'rate', label: 'Find the rate' }],
  ask: (k) => `Use the formula triangle to find the <b>${k}</b>.`,
  make(stage, k, ex) {
    const d = TRI[k], W = ex.W, X = 60, Y = 20;
    const svg = add(stage, svgEl('svg', { width: 420, height: 320, viewBox: '0 0 300 230', class: 'u2l8-svg' }), X, Y);
    svgEl('path', { d: 'M150 10 L290 220 L10 220 Z', fill: '#fff6e5', stroke: '#6e4a1c', 'stroke-width': 4, 'stroke-linejoin': 'round' }, svg);
    svgEl('line', { x1: 80, y1: 115, x2: 220, y2: 115, stroke: '#6e4a1c', 'stroke-width': 4 }, svg);
    svgEl('line', { x1: 150, y1: 115, x2: 150, y2: 220, stroke: '#6e4a1c', 'stroke-width': 4 }, svg);
    const P = { pay: [150, 90, '#6e4a1c'], rate: [96, 180, '#1f5bd6'], hours: [206, 180, '#12805a'] };
    Object.entries(P).forEach(([w, [x, y, c]]) => { const t = svgEl('text', { x, y, 'font-size': 30, 'font-weight': 800, fill: c, 'text-anchor': 'middle' }, svg); t.textContent = w; });
    const [cx, cy] = P[d.cover];
    const card = svgEl('rect', { x: cx - 48, y: cy - 34, width: 96, height: 46, rx: 8, fill: '#3a4254', opacity: 0 }, svg);
    const why = hide(add(stage, box(cbox('u2l8-tline', `What is left: ${d.why}.`), W - 560, 70), 520, 70));
    const fm = hide(add(stage, box(cbox('u2l8-tline big', `<b>${d.f}</b>`), W - 560, 70), 520, 170));
    return [
      { cap: `Cover the one you want to find: <b>${d.cover}</b>.`, run: (c) => c.anim(card, [{ opacity: 0, transform: 'translateY(-30px)' }, { opacity: 0.92, transform: 'none' }], 500) },
      { cap: `Read what is left: ${d.why}.`, run: (c) => c.fadeIn(why) },
      { cap: `So <b>${d.f}</b>.`, run: (c) => c.pop(fm) }
    ];
  }
};

/* =====================================================================================
 * 3. Which way do I divide? (Full notes)
 * ===================================================================================== */
const wrongWay = {
  title: 'Pay ÷ rate, not rate ÷ pay',
  height: 340,
  minW: 860,
  choices: [{ sep: 'Example 1(b):' }, { v: 'b', label: 'Jonas: $520 at $16.25' }],
  ask: 'Jonas earns <b>$16.25</b> an hour and wants <b>$520.00</b>. Which division gives the hours?',
  make(stage, k, ex) {
    const W = ex.W, CW = (W - 100) / 2;
    const est = hide(add(stage, box(cbox('u2l8-est', 'Estimate: $520 at about $16 an hour is about <b>30 hours</b>'), 600, 46), (W - 600) / 2, 8));
    const col = (x, ok) => {
      const hd = add(stage, box(cbox('u2l8-wwh ' + (ok ? 'ok' : 'no'), ok ? '<b>pay ÷ rate</b>' : '<b>rate ÷ pay</b> (the wrong way)'), CW, 40), x, 70);
      const l = add(stage, box(h('div', 'u2l8-lcd', `<div class="e">${ok ? '520÷16.25' : '16.25÷520'}</div><div class="r">${ok ? '32' : '0.03125'}</div>`), 300, 72), x + (CW - 300) / 2, 122);
      const t = add(stage, box(cbox('u2l8-wwc', ok ? '32 hours: close to 30 ✓' : '0.03 hours is about <b>2 minutes</b>! Nobody earns $520 in 2 minutes.'), CW, 64), x, 206);
      const s = stamp(stage, ok ? 'Makes sense ✓' : 'No sense ✗', { ok, x: x + CW / 2, y: 304, rotate: ok ? -5 : 6 });
      return [hd, l, t, s].map((e) => hide(e));
    };
    const A = col(40, true), B = col(60 + CW, false);
    return [
      { cap: `Estimate first: about <b>30 hours</b>.`, run: (c) => c.fadeIn(est) },
      { cap: `Pay ÷ rate: 520 ÷ 16.25 = <b>32</b> hours. Close to the estimate ✓`, run: async (c) => { await c.fadeIn(A[0]); await c.pop(A[1]); await c.fadeIn(A[2]); await stampIn(c, A[3]); } },
      { cap: `The wrong way: 16.25 ÷ 520 = 0.03125. That is <b>0.03 hours</b>, about 2 minutes. It doesn’t make sense.`, run: async (c) => { await c.fadeIn(B[0]); await c.pop(B[1]); await c.fadeIn(B[2]); await stampIn(c, B[3]); } }
    ];
  }
};

/* =====================================================================================
 * 4. Round up: 41 h is short, 42 h is enough; then 6-hour shifts (Example 2)
 * ===================================================================================== */
const roundUp = {
  title: 'Round up: enough is at least the goal',
  height: 410,
  minW: 900,
  choices: [{ sep: 'Example 2 check:' }, { v: 'p', label: 'Priya’s phone' }],
  ask: 'Example 2: Priya earns <b>$15.50</b> an hour and wants to earn <b>$650.00</b>. (a) How many whole hours? (b) Her shifts are 6 hours long. How many shifts?',
  make(stage, k, ex) {
    const W = ex.W, rate = 15.5, goal = 650, q = goal / rate, X = 150, BW = W - X - 60, sc = BW / 700, gx = X + goal * sc;
    const lcd = hide(add(stage, box(h('div', 'u2l8-lcd', `<div class="e">650÷15.5</div><div class="r">${raw(q).slice(0, 11)}</div>`), 300, 72), 40, 8));
    const note = hide(add(stage, box(cbox('u2l8-est', `The question asks for <b>whole</b> hours: try <b>41</b> and <b>42</b>.`), W - 400, 50), 360, 18));
    add(stage, box(h('div', 'u2l8-goal', '<i>goal $650</i>'), 4, 170), gx - 2, 92);
    const row = (hrs, y) => {
      const v = hrs * rate;
      const lab = hide(add(stage, box(cbox('u2l8-hlab', `<b>${hrs} h</b>`), 100, 50), 40, y));
      const bar = hide(add(stage, box(cbox('u2l8-pbar ' + (v >= goal ? 'ok' : 'no'), `${hrs} × $15.50 = <b>${m(v)}</b>`), v * sc, 50), X, y));
      const s = hide(stamp(stage, v >= goal ? 'enough ✓' : `short ${m(goal - v)} ✗`, { ok: v >= goal, x: Math.min(W - 110, X + v * sc + 96), y: y + 25, rotate: -4, size: 'sm' }));
      return [lab, bar, s];
    };
    const r41 = row(41, 112), r42 = row(42, 184);
    const sy = 290, sw = (W - 120) / 7;
    const shifts = [];
    for (let i = 0; i < 7; i++) shifts.push(hide(add(stage, box(cbox('u2l8-shift', `<b>6 h</b><small>shift ${i + 1}</small>`), sw - 8, 60), 60 + i * sw, sy)));
    const sh = hide(add(stage, box(cbox('u2l8-eq', `(b) ${T('42\\div6=7')} shifts`), 400, 40), (W - 400) / 2, 360));
    return [
      { cap: `(a) hours = pay ÷ rate = $650.00 ÷ $15.50 = 41.935…`, run: async (c) => { await c.pop(lcd); await c.fadeIn(note); } },
      { cap: `41 hours: 41 × $15.50 = $635.50. That is <b>short</b> of $650 ✗`, run: async (c) => { await c.fadeIn(r41[0]); await c.fadeIn(r41[1], 500, { from: 'scaleX(0)' }); await stampIn(c, r41[2]); } },
      { cap: `42 hours: 42 × $15.50 = $651.00. At least $650 ✓. Round <b>up</b>: Priya must work <b>42 hours</b>.`, run: async (c) => { await c.fadeIn(r42[0]); await c.fadeIn(r42[1], 500, { from: 'scaleX(0)' }); await stampIn(c, r42[2]); } },
      { cap: `(b) Her shifts are 6 hours long: 42 ÷ 6 = <b>7 shifts</b>.`, run: async (c) => { for (const s of shifts) await c.pop(s, 220); await c.fadeIn(sh); } }
    ];
  }
};

/* =====================================================================================
 * 5. Overtime hours needed: Kofi's week (Example 3)
 * ===================================================================================== */
const otSteps = {
  title: 'How many overtime hours do I need?',
  height: 440,
  minW: 940,
  choices: [{ sep: 'Example 3 check:' }, { v: 'kofi', label: 'Kofi’s week' }],
  ask: 'Example 3: Kofi works <b>8 h</b> a day, Monday to Friday, at <b>$20.00</b> an hour. Extra hours on a shift are overtime (time-and-a-half). How many overtime hours for <b>$950.00</b> this week?',
  make(stage, k, ex) {
    const W = ex.W, wage = 20, goal = 950, reg = 40 * wage, extra = goal - reg, otr = 1.5 * wage, oth = extra / otr;
    const X = 80, U = 44, RY = 14, RH = 40, days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const svg = add(stage, svgEl('svg', { width: X + 10 * U + 10, height: 5 * (RH + 8) + 30, class: 'u2l8-svg' }), 0, RY);
    for (let hh = 0; hh <= 10; hh++) { svgEl('line', { x1: X + hh * U, y1: 0, x2: X + hh * U, y2: 5 * (RH + 8), stroke: hh === 8 ? '#c93a33' : '#e6dccb', 'stroke-width': hh === 8 ? 3 : 1, 'stroke-dasharray': hh === 8 ? '6 4' : '' }, svg); const t = svgEl('text', { x: X + hh * U, y: 5 * (RH + 8) + 20, 'font-size': 15, fill: '#6b6455', 'text-anchor': 'middle' }, svg); t.textContent = hh; }
    const t8 = svgEl('text', { x: X + 8 * U + 4, y: -2, 'font-size': 14, 'font-weight': 800, fill: '#c93a33' }, svg); t8.textContent = '';
    const regs = [], ots = [];
    days.forEach((dname, i) => {
      add(stage, box(cbox('u2l8-day', dname), 60, RH), 14, RY + i * (RH + 8));
      regs.push(hide(add(stage, box(cbox('u2l8-reg', '8 h regular'), 8 * U, RH), X, RY + i * (RH + 8))));
      ots.push(hide(add(stage, box(cbox('u2l8-ot', '+1'), U, RH), X + 8 * U, RY + i * (RH + 8))));
    });
    const PX = X + 10 * U + 40, PW = W - PX - 20;
    const line = (y, html, cls = '') => hide(add(stage, box(cbox('u2l8-sline ' + cls, html), PW, 50), PX, y));
    const S1 = line(10, `<b>1</b> regular ${T(`40\\times${MT(wage)}=${MT(reg)}`)}`);
    const S2 = line(66, `<b>2</b> extra ${T(`${MT(goal)}-${MT(reg)}=${MT(extra)}`)}`);
    const S3 = line(122, `<b>3</b> OT rate ${T(`1.5\\times${MT(wage)}=${MT(otr)}`)}`);
    const S4 = line(178, `<b>4</b> OT hours ${T(`${MT(extra)}\\div${MT(otr)}=${oth}`)}`, 'res');
    // pay meter
    const MY = 300, MX = 80, MW = W - 160, ms = MW / 1000;
    add(stage, box(h('div', 'u2l8-meter'), MW, 44), MX, MY);
    const fill = add(stage, box(h('div', 'u2l8-mfill'), 0, 44), MX, MY);
    const ofill = add(stage, box(h('div', 'u2l8-mfill ot'), 0, 44), MX + reg * ms, MY);
    add(stage, box(h('div', 'u2l8-goal', '<i>goal $950</i>'), 4, 64), MX + goal * ms - 2, MY - 12);
    const mlab = add(stage, box(cbox('u2l8-mlab', 'pay this week: <b>$0.00</b>'), MW, 30), MX, MY + 52);
    const gap = hide(add(stage, box(cbox('u2l8-gap', `need ${m(extra)} more`), extra * ms, 44), MX + reg * ms, MY));
    const chk = hide(add(stage, box(cbox('u2l8-eq ok', `Check: ${T(`${MT(reg)}+5\\times${MT(otr)}=${MT(goal)}`)} ✓ &nbsp;<small>(weekly rule: 45 − 44 = 1 h, so the daily rule gives more)</small>`), W - 40, 40), 20, 396));
    const setPay = (v) => { mlab.innerHTML = `<div>pay this week: <b>${m(v)}</b></div>`; };
    return [
      { cap: `Step 1: the regular hours. 5 days × 8 h = 40 h, so regular pay = 40 × $20.00 = <b>$800.00</b>.`,
        run: async (c) => { for (const r of regs) await c.fadeIn(r, 200, { from: 'scaleX(0)' }); await c.fadeIn(S1); await tween(c, 600, (t) => { fill.style.width = reg * ms * t + 'px'; setPay(reg * t); }); } },
      { cap: `Step 2: extra pay needed = $950.00 − $800.00 = <b>$150.00</b>.`, run: async (c) => { await c.fadeIn(S2); await c.fadeIn(gap); } },
      { cap: `Step 3: every hour past 8 in a day is overtime: 1.5 × $20.00 = <b>$30.00</b> an hour.`, run: async (c) => { t8.textContent = 'overtime →'; await c.fadeIn(S3); } },
      { cap: `Step 4: overtime hours = $150.00 ÷ $30.00 = <b>5</b>. One extra hour on each shift.`,
        run: async (c) => { await c.fadeIn(S4); gap.style.opacity = 0; for (let i = 0; i < 5; i++) { await c.pop(ots[i], 260); await tween(c, 220, (t) => { ofill.style.width = (i + t) * otr * ms + 'px'; setPay(reg + (i + t) * otr); }); } } },
      { cap: `Check: $800.00 + 5 × $30.00 = $950.00 ✓. Kofi needs <b>5 hours</b> of overtime.`, run: (c) => c.fadeIn(chk) }
    ];
  }
};

/* =====================================================================================
 * 6. Paid hours: each overtime hour is a 1.5-wide block (Example 4)
 * ===================================================================================== */
const paidHours = {
  title: 'Paid hours: overtime hours count 1.5 times',
  height: 400,
  minW: 900,
  choices: [{ sep: 'Example 4 check:' }, { v: 'lena', label: 'Lena’s wage' }],
  ask: 'Example 4: Lena’s pay stub shows <b>40 regular</b> hours and <b>6 overtime</b> hours (time-and-a-half). Her gross pay is <b>$1&#8239;029.00</b>. What is her hourly wage?',
  make(stage, k, ex) {
    const W = ex.W, R = 40, O = 6, g = 1029, paid = R + 1.5 * O, wage = g / paid;
    const u = Math.min(15.5, (W - 80) / paid), X = (W - paid * u) / 2, Y = 40, BH = 56;
    const regs = [], ots = [];
    for (let i = 0; i < R; i++) regs.push(hide(add(stage, box(h('div', 'u2l8-hb'), u - 2, BH), X + i * u, Y)));
    for (let i = 0; i < O; i++) ots.push(hide(add(stage, box(h('div', 'u2l8-hb ot'), 1.5 * u - 2, BH), X + R * u + i * 1.5 * u, Y)));
    const lr = hide(add(stage, box(cbox('u2l8-brace', '40 regular hours'), R * u, 30), X, Y + BH + 6));
    const lo = hide(add(stage, box(cbox('u2l8-brace ot', '6 OT hours'), O * 1.5 * u, 30), X + R * u, Y + BH + 6));
    // tick marks splitting the overtime blocks into paid hours
    const svg = add(stage, svgEl('svg', { width: W, height: BH, class: 'u2l8-svg' }), 0, Y);
    const ticks = svgEl('g', { opacity: 0 }, svg);
    for (let i = 1; i < 9; i++) svgEl('line', { x1: X + R * u + i * u, y1: 6, x2: X + R * u + i * u, y2: BH - 6, stroke: '#7a3e0a', 'stroke-width': 2, 'stroke-dasharray': '4 3' }, ticks);
    const L1 = hide(add(stage, box(cbox('u2l8-eq', `paid hours ${T(`=40+1.5\\times6=40+9=${paid}`)}`), W - 80, 44), 40, 150));
    const L2 = hide(add(stage, box(cbox('u2l8-eq res', `wage ${T(`=${MT(g)}\\div${paid}=${MT(wage)}`)}`), W - 80, 44), 40, 202));
    const bad = hide(add(stage, box(cbox('u2l8-wrong', `Not ÷ 46: ${T(`${MT(g)}\\div46\\approx${MT(g / 46)}`)} is too much. The overtime hours pay more!`), W - 80, 44), 40, 256));
    const L3 = hide(add(stage, box(cbox('u2l8-eq ok', `Check: ${T(`40\\times${MT(wage)}+6\\times${MT(wage * 1.5)}=${MT(40 * wage)}+${MT(6 * wage * 1.5)}=${MT(g)}`)} ✓`), W - 80, 44), 40, 316));
    return [
      { cap: `Lena worked 40 regular hours and 6 overtime hours. Each overtime hour is paid like <b>1.5</b> regular hours, so its block is 1.5 wide.`,
        run: async (c) => { await tween(c, 700, (t) => { const n = Math.round(R * t); regs.forEach((e, i) => { e.style.opacity = i < n ? 1 : 0; }); }); await c.fadeIn(lr); for (const e of ots) await c.pop(e, 200); await c.fadeIn(lo); } },
      { cap: `Count the paid hours: 6 overtime hours are paid like 6 × 1.5 = 9 hours. Paid hours = 40 + 9 = <b>49</b>.`, run: async (c) => { await c.anim(ticks, [{ opacity: 0 }, { opacity: 1 }], 400); await c.fadeIn(L1); } },
      { cap: `wage = gross pay ÷ paid hours = $1&#8239;029.00 ÷ 49 = <b>$21.00</b> an hour.`, run: (c) => c.fadeIn(L2) },
      { cap: `Watch out: dividing by the 46 hours she worked gives ${m(g / 46)}, too much, because the overtime hours pay more.`, run: (c) => c.fadeIn(bad) },
      { cap: `Check: overtime rate = 1.5 × $21.00 = $31.50. $840.00 + $189.00 = $1&#8239;029.00 ✓`, run: (c) => c.fadeIn(L3) }
    ];
  }
};

/* =====================================================================================
 * 7. Sales needed: the commission machine run backwards (Example 5)
 * ===================================================================================== */
const SN = {
  a: { rate: 8, comm: 1200, sal: 0, sales: 15000, who: 'Dana' },
  b: { rate: 4, comm: 1200, sal: 1800, target: 3000, sales: 30000, who: 'Raj' }
};
const salesNeeded = {
  title: 'Sales needed: run the commission formula backwards',
  height: 420,
  minW: 900,
  choices: [{ sep: 'Example 5 check:' }, { v: 'a', label: '(a) Dana: 8%' }, { v: 'b', label: '(b) Raj: salary + 4%' }],
  ask: (k) => k === 'a' ? 'Example 5(a): Dana earns <b>8%</b> commission. How much must she sell to earn <b>$1&#8239;200.00</b> in commission?'
    : 'Example 5(b): Raj earns <b>$1&#8239;800.00</b> a month plus <b>4%</b> commission. How much must he sell to earn <b>$3&#8239;000.00</b>?',
  make(stage, k, ex) {
    const d = SN[k], W = ex.W, r = d.rate / 100;
    const steps = [];
    let y0 = 30;
    if (d.sal) {
      const X = 60, BW = W - 120, sc = BW / d.target;
      const tbar = add(stage, box(cbox('u2l8-tgt', `target <b>${m(d.target)}</b>`), BW, 46), X, 20);
      const sal = hide(add(stage, box(cbox('u2l8-sal', `salary <b>${m(d.sal)}</b>`), d.sal * sc, 46), X, 20));
      const com = hide(add(stage, box(cbox('u2l8-com', `commission needed <b>${m(d.comm)}</b>`), d.comm * sc, 46), X + d.sal * sc, 20));
      void tbar;
      steps.push({ cap: `First take off the salary: commission needed = ${m(d.target)} − ${m(d.sal)} = <b>${m(d.comm)}</b>.`, run: async (c) => { await c.fadeIn(sal, 400, { from: 'scaleX(0)' }); await c.fadeIn(com); } });
      y0 = 110;
    }
    add(stage, box(h('div', 'u2l8-rowlab b', `Backwards: commission ÷ rate`), 360, 26), 40, y0);
    const B = machineRow(stage, W, y0 + 30, { dir: -1, left: `sales <span class="u2l8-ans"><b>${m(d.sales)}</b></span>`, mach: `÷ ${r}<small>${d.rate}% as a decimal</small>`, right: `commission <b>${m(d.comm)}</b>`, color: '#c27a0e', mcls: 'undo' });
    const ansEl = B.L.querySelector('.u2l8-ans'); ansEl.style.opacity = 0; B.M.style.opacity = 0;
    const wrong = hide(add(stage, box(cbox('u2l8-wrong', `Not ÷ ${d.rate}: ${T(`${MT(d.comm)}\\div${d.rate}=${MT(d.comm / d.rate)}`)}. Sales can’t be less than the commission!`), W - 80, 44), 40, y0 + 132));
    const eq = hide(add(stage, box(cbox('u2l8-eq res', `sales ${T(`=${MT(d.comm)}\\div${r}=${MT(d.sales)}`)}`), W - 80, 44), 40, y0 + 184));
    const chk = hide(add(stage, box(cbox('u2l8-eq ok', d.sal ? `Check: ${T(`${MT(d.sal)}+${r}\\times${MT(d.sales)}=${MT(d.target)}`)} ✓` : `Check: ${T(`${r}\\times${MT(d.sales)}=${MT(d.comm)}`)} ✓`), W - 80, 44), 40, y0 + 236));
    steps.push({ cap: `Commission = rate × sales. Undo the ×: sales = commission ÷ rate, with ${d.rate}% = <b>${r}</b>.`, run: (c) => c.pop(B.M) });
    if (!d.sal) steps.push({ cap: `Watch out: ${m(d.comm)} ÷ ${d.rate} = ${m(d.comm / d.rate)} is wrong. The rate must be a decimal.`, run: (c) => c.fadeIn(wrong) });
    steps.push({ cap: `sales = ${m(d.comm)} ÷ ${r} = <b>${m(d.sales)}</b>. Much bigger than the commission, as it should be.`, run: async (c) => { wrong.style.opacity = d.sal ? 0 : 0.35; await c.fadeIn(eq); await c.pop(ansEl); } });
    steps.push({ cap: d.sal ? `Check: ${m(d.sal)} + 4% of ${m(d.sales)} = ${m(d.sal)} + ${m(d.comm)} = ${m(d.target)} ✓` : `Check: 8% of ${m(d.sales)} = ${m(d.comm)} ✓. ${d.who} must sell <b>${m(d.sales)}</b>.`, run: (c) => c.fadeIn(chk) });
    return steps;
  }
};

/* =====================================================================================
 * 8. Graduated commission: fill the first level, then the next (Example 6)
 * ===================================================================================== */
const graduated = {
  title: 'Graduated commission: level by level',
  height: 430,
  minW: 900,
  choices: [{ sep: 'Example 6 check:' }, { v: 'j', label: 'Jasmine’s hot tubs' }],
  ask: 'Example 6: Jasmine earns <b>3%</b> on the first <b>$10&#8239;000</b> of sales and <b>5%</b> on sales over $10&#8239;000. How much must she sell to earn <b>$1&#8239;000.00</b> in commission?',
  make(stage, k, ex) {
    const W = ex.W, X = 150, BW = W - X - 40, ss = BW / 26000, cs = BW / 1100;
    add(stage, box(cbox('u2l8-blab', 'sales'), 110, 60), 30, 40);
    add(stage, box(h('div', 'u2l8-track'), BW, 60), X, 40);
    const t1 = hide(add(stage, box(cbox('u2l8-tier a', '3% level: first <b>$10&#8239;000</b>'), 10000 * ss, 60), X, 40));
    const t2 = add(stage, box(cbox('u2l8-tier b', ''), 0, 60), X + 10000 * ss, 40);
    const tick = (v, y) => { const e = add(stage, box(cbox('u2l8-tick', `${m(v, 0)}`), 90, 22), X + v * ss - 45, y); return e; };
    tick(0, 104); tick(10000, 104); const tk = hide(tick(24000, 104));
    add(stage, box(cbox('u2l8-blab', 'commission'), 110, 50), 30, 160);
    add(stage, box(h('div', 'u2l8-track'), BW, 50), X, 160);
    const c1 = add(stage, box(h('div', 'u2l8-cfill a'), 0, 50), X, 160);
    const c2 = add(stage, box(h('div', 'u2l8-cfill b'), 0, 50), X + 300 * cs, 160);
    add(stage, box(h('div', 'u2l8-goal', '<i>goal $1&#8239;000</i>'), 4, 70), X + 1000 * cs - 2, 150);
    const clab = add(stage, box(cbox('u2l8-mlab', 'commission so far: <b>$0.00</b>'), BW, 28), X, 216);
    const set = (v) => { clab.innerHTML = `<div>commission so far: <b>${m(v)}</b></div>`; };
    const line = (y, html, cls = '') => hide(add(stage, box(cbox('u2l8-sline ' + cls, html), W - 80, 40), 40, y));
    const L1 = line(254, `<b>1</b> first level ${T('0.03\\times\\$10\\,000=\\$300')}`);
    const L2 = line(296, `<b>2</b> still needed ${T('\\$1\\,000-\\$300=\\$700')} at 5%`);
    const L3 = line(338, `<b>3</b> sales over $10&#8239;000 ${T('=\\$700\\div0.05=\\$14\\,000')}`);
    const L4 = line(380, `<b>4</b> total sales ${T('=\\$10\\,000+\\$14\\,000=\\$24\\,000')}`, 'res');
    return [
      { cap: `Step 1: the first level is used up: 3% of $10&#8239;000 = <b>$300</b>.`, run: async (c) => { await c.fadeIn(t1, 500, { from: 'scaleX(0)' }); await tween(c, 600, (t) => { c1.style.width = 300 * cs * t + 'px'; set(300 * t); }); await c.fadeIn(L1); } },
      { cap: `Step 2: still needed = $1&#8239;000 − $300 = <b>$700</b>, earned at 5%.`, run: (c) => c.fadeIn(L2) },
      { cap: `Step 3: sales over $10&#8239;000 = $700 ÷ 0.05 = <b>$14&#8239;000</b>. Watch both bars grow together.`,
        run: async (c) => { await tween(c, 1400, (t) => { t2.style.width = 14000 * ss * t + 'px'; c2.style.width = 700 * cs * t + 'px'; set(300 + 700 * t); t2.innerHTML = t > 0.4 ? `<div>5% level: <b>${m(14000 * t, 0)}</b></div>` : ''; }); await c.fadeIn(L3); } },
      { cap: `Step 4: total sales = $10&#8239;000 + $14&#8239;000 = <b>$24&#8239;000</b>. Check: $300 + 5% of $14&#8239;000 = $300 + $700 = $1&#8239;000 ✓`, run: async (c) => { await c.fadeIn(tk); await c.fadeIn(L4); } }
    ];
  }
};

/* =====================================================================================
 * 9. The savings thermometer: take-home pay, hour by hour (Examples 7 and 8)
 * ===================================================================================== */
const TH = {
  ethan: { wage: 16, keep: 0.80, goal: 600, ded: '20%', who: 'Ethan' },
  sofia: { wage: 18.5, keep: 0.7741, goal: 944.99, price: 899.99, ded: '22.59%', who: 'Sofia' }
};
const thermo = {
  title: 'Fill the goal with take-home pay',
  height: 450,
  minW: 940,
  capH: 92,
  choices: [{ sep: 'Check:' }, { v: 'ethan', label: 'Example 7: Ethan' }, { v: 'sofia', label: 'Example 8: Sofia' }],
  ask: (k) => k === 'ethan' ? 'Example 7: Ethan earns <b>$16.00</b> an hour. Deductions take about <b>20%</b>. How many hours to take home <b>$600.00</b>?'
    : 'Example 8: Sofia earns <b>$18.50</b> an hour. Deductions: CPP 5.95%, EI 1.64%, income tax 15%. How many hours to buy a <b>$899.99</b> laptop (plus 5% GST)?',
  make(stage, k, ex) {
    const d = TH[k], W = ex.W, net = d.wage * d.keep, q = d.goal / net, need = Math.ceil(q - 1e-9), low = need - 1;
    // one hour of pay, split into kept and deductions
    const HX = 40, HW = 440, HY = 40;
    add(stage, box(cbox('u2l8-blab l', `one hour: <b>${m(d.wage)}</b>`), HW, 28), HX, HY - 32);
    const hk = add(stage, box(cbox('u2l8-keep', ''), HW, 60), HX, HY);
    const hd = hide(add(stage, box(cbox('u2l8-dedb', ''), HW * (1 - d.keep), 60), HX + HW * d.keep, HY));
    const hkl = hide(add(stage, box(cbox('u2l8-hl', `kept ${k === 'ethan' ? '80%' : '77.41%'}: <b>${k === 'ethan' ? m(net) : '$14.32085'}</b>`), HW * d.keep, 30), HX, HY + 64));
    const hdl = hide(add(stage, box(cbox('u2l8-hl d', `${d.ded} off`), 140, 30), HX + HW - 140, HY + 64));
    const gst = d.price ? hide(add(stage, box(cbox('u2l8-sline', `GST: ${T(`${MT(d.price)}\\times1.05=944.9895\\approx${MT(d.goal)}`)}`), HW + 20, 44), HX, HY + 106)) : null;
    const lcd = hide(add(stage, box(h('div', 'u2l8-lcd', `<div class="e">${k === 'ethan' ? '600÷12.8' : '944.99÷(18.5×0.7741)'}</div><div class="r">${raw(q).slice(0, 10)}</div>`), 330, 72), HX, HY + 160));
    const v1 = hide(add(stage, box(cbox('u2l8-sline no', `${low} h: ${T(`${low}\\times${MT(d.wage)}\\times${d.keep}=${MT(low * net)}`)} ✗`), HW + 20, 44), HX, HY + 244));
    const v2 = hide(add(stage, box(cbox('u2l8-sline res', `${need} h: ${T(`${need}\\times${MT(d.wage)}\\times${d.keep}=${MT(need * net)}`)} ✓`), HW + 20, 44), HX, HY + 296));
    // the thermometer
    const TX = W - 330, TW = 90, TY = 30, TH0 = 300, top = d.goal * 1.12, ts = TH0 / top, base = TY + TH0;
    add(stage, box(h('div', 'u2l8-tube'), TW, TH0), TX, TY);
    add(stage, box(h('div', 'u2l8-bulb'), TW + 20, TW + 20), TX - 10, base - 20);
    const fill = add(stage, box(h('div', 'u2l8-tfill'), TW - 20, 0), TX + 10, base);
    add(stage, box(h('div', 'u2l8-goal h', `<i>goal ${m(d.goal)}</i>`), TW + 60, 4), TX - 30, base - d.goal * ts);
    const cnt = add(stage, box(cbox('u2l8-cnt', '0 h<br><b>$0.00</b>'), 150, 64), TX + TW + 20, base - 70);
    const setF = (hrs) => { const v = hrs * net; fill.style.height = v * ts + 'px'; fill.style.top = (base - v * ts) + 'px'; cnt.innerHTML = `<div>${Math.floor(hrs + 1e-9)} h<br><b>${m(Math.floor(hrs + 1e-9) * net)}</b></div>`; cnt.style.top = Math.min(base - 70, base - v * ts - 30) + 'px'; };
    const st = hide(stamp(stage, `${need} hours ✓`, { ok: true, x: TX + TW / 2, y: base + 40, rotate: -5, size: 'lg' }));
    const steps = [];
    if (d.price) steps.push({ cap: `First the goal: the laptop with GST: $899.99 × 1.05 = 944.9895 ≈ <b>$944.99</b>.`, run: (c) => c.fadeIn(gst) });
    steps.push({ cap: k === 'ethan'
      ? `Each hour earns $16.00, but deductions take 20%. Ethan keeps 80%: $16.00 × 0.80 = <b>$12.80</b> an hour.`
      : `Deductions: 5.95% + 1.64% + 15% = 22.59%. She keeps 77.41%: $18.50 × 0.7741 = $14.32085 ≈ <b>$14.32</b> an hour.`,
    run: async (c) => { await c.fadeIn(hd); hk.style.width = HW * d.keep + 'px'; await c.fadeIn(hkl); await c.fadeIn(hdl); } });
    steps.push({ cap: `hours = net pay needed ÷ net per hour = ${m(d.goal)} ÷ ${k === 'ethan' ? '$12.80' : '14.32085'} = ${raw(q).length > 8 ? raw(q).slice(0, 7) + '…' : raw(q)}`, run: (c) => c.pop(lcd) });
    steps.push({ cap: `Fill the goal one hour of take-home pay at a time… after ${low} hours: <b>${m(low * net)}</b>. Not enough ✗`, run: async (c) => { await tween(c, 1600, (t) => { setF(low * t); }); await c.fadeIn(v1); } });
    steps.push({ cap: `Round <b>up</b>: ${need} hours gives ${m(need * net)}, at least ${m(d.goal)} ✓. ${d.who} must work <b>${need} hours</b>.`, run: async (c) => { await tween(c, 400, (t) => { setF(low + t); }); await c.fadeIn(v2); await stampIn(c, st); } });
    return steps;
  }
};

mountExplainers({ undoMachine, triangle, wrongWay, roundUp, otSteps, paidHours, salesNeeded, graduated, thermo });

/* ============ Stand Up Break! — working backwards with pay, at the whiteboards ============ */
{
  const dd = (v) => MT(v).slice(2);   // TeX number with thin spaces, no $
  const NAMES = ['Ava', 'Liam', 'Zara', 'Mateo', 'Priya', 'Jonah', 'Elif', 'Cole', 'Nadia', 'Theo'];
  const ITEMS = [['a concert ticket', 189.99], ['new skates', 349.99], ['a gaming console', 499.99], ['a used bike', 260.00], ['a phone', 729.99], ['a tool set', 415.50]];
  standup('u2l8', {
    intro: 'Rearrange the formula, estimate, solve, then CHECK by putting your answer back in.',
    levels: {
      BEG: (r) => r.pick([
        () => { // hours for a goal, round up
          const w = r.pick([15.00, 15.25, 15.50, 16.00, 16.75, 17.25, 18.40]), goal = r.int(18, 60) * 10, q = goal / w, n = Math.ceil(q - 1e-9);
          return { text: `${r.pick(NAMES)} earns <b>${m(w)}</b> an hour and wants to earn at least <b>${m(goal)}</b>. How many whole hours must ${r.pick(['she', 'he'])} work? Check your answer.`, q: '',
            a: [`${goal}\\div${dd(w)}=${rnd(q, 3)}${Math.abs(q - n) < 1e-9 ? '' : '\\ldots'}\\to${n}\\text{ h}`, `\\text{check: }${n}\\times${dd(w)}=\\$${dd(n * w)}`] };
        },
        () => { // the wage from pay and hours
          const wr = r.int(60, 96) / 4, hrs = r.pick([16, 20, 22.5, 24, 27.5, 30, 32]), pay = rnd(wr * hrs);
          return { text: `${r.pick(NAMES)} earned <b>${m(pay)}</b> for <b>${hrs} hours</b> of work. What is the hourly wage? Check your answer.`, q: '',
            a: [`\\text{rate}=${dd(pay)}\\div${hrs}=\\$${dd(wr)}`, `\\text{check: }${dd(wr)}\\times${hrs}=\\$${dd(pay)}`] };
        }
      ])(),
      PRG: (r) => r.pick([
        () => { // overtime hours needed
          const w = r.pick([17, 18, 19, 20, 21, 22, 23, 24, 25, 26]), oh = r.int(2, 8), goal = 40 * w + oh * 1.5 * w;
          return { text: `A welder works 8 h a day, Monday to Friday, for <b>${m(w)}</b> an hour. Extra hours on a shift are overtime at time-and-a-half. How many overtime hours are needed to earn <b>${m(goal)}</b> this week?`, q: '',
            a: [`\\text{regular}=40\\times${dd(w)}=\\$${dd(40 * w)}`, `\\text{extra}=${dd(goal)}-${dd(40 * w)}=\\$${dd(goal - 40 * w)}`, `\\text{OT rate}=\\$${dd(1.5 * w)};\\ ${dd(goal - 40 * w)}\\div${dd(1.5 * w)}=${oh}\\text{ h}`] };
        },
        () => { // wage from paid hours
          const w = r.pick([17, 18, 18.5, 19.5, 20, 21, 22.5, 24, 25.5]), ot = r.pick([2, 3, 4, 5, 6, 8]), reg = r.pick([36, 38, 40]), paid = reg + 1.5 * ot, g = rnd(paid * w);
          return { text: `A pay stub shows <b>${reg}</b> regular hours and <b>${ot}</b> overtime hours (time-and-a-half). The gross pay is <b>${m(g)}</b>. What is the hourly wage?`, q: '',
            a: [`\\text{paid hours}=${reg}+1.5\\times${ot}=${paid}`, `\\text{wage}=${dd(g)}\\div${paid}=\\$${dd(w)}`] };
        }
      ])(),
      MAS: (r) => r.pick([
        () => { // salary + commission
          const sal = r.pick([1500, 1800, 2000, 2200]), rate = r.pick([3, 4, 5, 6]), sales = r.int(10, 40) * 2500, target = sal + sales * rate / 100;
          return { text: `A salesperson earns <b>${m(sal)}</b> a month plus <b>${rate}%</b> commission. How much must she sell to earn <b>${m(target)}</b> this month?`, q: '',
            a: [`\\text{commission needed}=${dd(target)}-${dd(sal)}=\\$${dd(target - sal)}`, `\\text{sales}=${dd(target - sal)}\\div${rate / 100}=\\$${dd(sales)}`] };
        },
        () => { // hours to take home a price with GST
          const [what, p] = r.pick(ITEMS), w = r.pick([15.50, 16.25, 17.00, 18.40, 19.75]), dp = r.pick([15, 18, 20, 22, 25]), keep = 1 - dp / 100;
          const need = rnd(p * 1.05), npH = rnd(w * keep, 4), q = need / npH, n = Math.ceil(q - 1e-9);
          return { text: `${r.pick(NAMES)} earns <b>${m(w)}</b> an hour. Deductions take about <b>${dp}%</b>. How many whole hours to take home enough for ${what} that costs <b>${m(p)}</b> plus 5% GST?`, q: '',
            a: [`\\text{with GST: }${dd(p)}\\times1.05\\approx\\$${dd(need)}`, `\\text{net per hour}=${dd(w)}\\times${rnd(keep, 2)}=\\$${rnd(npH, 4)}`, `${dd(need)}\\div${rnd(npH, 4)}=${rnd(q, 2)}\\ldots\\to${n}\\text{ h}`] };
        }
      ])()
    }
  });
}
