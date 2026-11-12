/* Math 10-3 · Unit 2 · Lesson 3 — Overtime: Time-and-a-Half and Double Time.
 * Explainers: wage bars that build time and a half (wage + half) and double time (two wages); × 1.5 vs + $1.50 (Full
 * notes); the pay "area" picture (hours across, $ per hour up) that stacks regular and overtime blocks into a gross pay;
 * rounding the rate early vs one calculator line (Full notes); two pay meters running through Kyle's Canada Day shift; a
 * week of shift bars that turn orange past 8 h a day and past 44 h a week, with a "use the bigger" stamp; why daily and
 * weekly overtime are never added (Full notes); Tomás's timesheet filling itself on a 6 a.m.–6 p.m. timeline.
 * Then the Stand Up Break and the Math History animation (the 1872 march for a nine-hour day). */
import { h, add, box, tex, svgEl, tween, stamp, stampIn, mountExplainers } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const rnd = (v, d = 2) => Math.round((v + (v >= 0 ? 1e-9 : -1e-9)) * 10 ** d) / 10 ** d;
const lerp = (a, b, t) => a + (b - a) * t;
const grp = (s, sep) => { const [i, f] = s.split('.'); const g = i.length > 3 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, sep) : i; return f != null ? g + '.' + f : g; };
const dec = (v, d = 2) => rnd(v, d).toFixed(d);
const M = (v, d = 2) => '$' + grp(dec(v, d), '\u202f');            // money text
const MT = (v, d = 2) => '\\$' + grp(dec(v, d), '\\,');             // money TeX
const hr = (v) => String(rnd(v, 2));                                 // hours: 8, 9.5, 8.75
/** decimals a money value really has (2, 3 or 4): keep them all until the final answer */
const nd = (v) => (Math.abs(v * 100 - Math.round(v * 100)) < 1e-6 ? 2 : Math.abs(v * 1000 - Math.round(v * 1000)) < 1e-6 ? 3 : 4);
const MX = (v) => MT(v, nd(v));                                      // money TeX with every decimal
/** "= $x" when it is whole cents, else "= $x.xxx ≈ $x.xx" */
const EQ = (v) => (nd(v) === 2 ? `=${MT(v)}` : `=${MX(v)}\\approx${MT(v)}`);
const cbox = (cls, html) => h('div', cls + ' u2l3-c', `<div>${html}</div>`);
const countTo = (c, el, a, b, ms, f) => tween(c, ms, (t) => { el.innerHTML = f(lerp(a, b, t)); });
const grow = (c, el, w1, ms = 700, prop = 'width') => { el.style.opacity = 1; return tween(c, ms, (t) => { el.style[prop] = (w1 * t) + 'px'; }); };
/** a bar that grows from nothing: invisible (no stray border) until it grows */
const zero = (el, prop = 'width') => { el.style[prop] = '0px'; el.style.opacity = 0; return el; };

/* =====================================================================================
 * 1. Overtime rates: wage + half = time and a half; two wages = double time
 * ===================================================================================== */
const RT = { t: 18, a: 15, b: 18.5, c: 21.2, d: 27.8 };
const rates = {
  title: 'Time and a half and double time',
  height: 360,
  minW: 900,
  choices: [{ v: 't', label: '$18.00/h' }, { sep: 'Example 1 check:' }, { v: 'a', label: '$15.00/h' }, { v: 'b', label: '$18.50/h' }, { v: 'c', label: '$21.20/h' }, { v: 'd', label: '$27.80/h' }],
  ask: (k) => `${k === 't' ? '' : 'Example 1: '}A base wage of <b>${M(RT[k])}/h</b>. Find the <b>time-and-a-half</b> rate and the <b>double-time</b> rate.`,
  make(stage, k, ex) {
    const w = RT[k], W = ex.W, half = w / 2, X0 = 250, B = Math.min(270, (W - X0 - 190) / 2), BH = 58;
    const Y = [14, 112, 210];
    const labs = ['Base wage', 'Time and a half <small>× 1.5</small>', 'Double time <small>× 2</small>'];
    labs.forEach((l, i) => add(stage, box(h('div', 'u2l3-rlab', l), X0 - 24, BH), 10, Y[i]));
    const bar = (cls, html, x, y, wd) => add(stage, box(h('div', 'u2l3-bar ' + cls, html), wd, BH), x, y);
    const b0 = zero(bar('base', M(w), X0, Y[0], B));
    const c1 = hide(bar('base', M(w), X0, Y[0], B));
    const hf = zero(bar('half', 'half: ' + M(half), X0 + B, Y[1], B / 2));
    const d1 = hide(bar('base', M(w), X0, Y[0], B)), d2 = hide(bar('base', M(w), X0 + B, Y[0], B));
    const r1 = hide(add(stage, box(cbox('u2l3-rres', `= <b>${M(w * 1.5)}</b>/h`), 170, BH), X0 + 1.5 * B + 14, Y[1]));
    const r2 = hide(add(stage, box(cbox('u2l3-rres', `= <b>${M(w * 2)}</b>/h`), 170, BH), X0 + 2 * B + 14, Y[2]));
    const r0 = hide(add(stage, box(cbox('u2l3-rres base', `<b>${M(w)}</b>/h`), 150, BH), X0 + B + 14, Y[0]));
    // the "how many wages" ruler
    const ax = hide(add(stage, box(h('div', 'u2l3-ruler'), 2 * B, 2), X0, 300));
    const ticks = [[0, '0'], [1, '1 wage'], [1.5, '1.5 wages'], [2, '2 wages']].map(([v, t]) => hide(add(stage, box(h('div', 'u2l3-tick' + (v === 1.5 ? ' am' : ''), t), 110, 40), X0 + v * B - 55, 292)));
    return [
      { cap: `Base wage: <b>${M(w)}</b> for each hour of regular work.`, run: async (c) => { await grow(c, b0, B, 600); await c.fadeIn(r0); } },
      { cap: `Copy the wage. Then add <b>half</b> of it: ${T(`${MT(w)}\\div2=${MT(half)}`)}.`,
        run: async (c) => { c1.style.opacity = 1; await c.anim(c1, [{ transform: 'translateY(0)' }, { transform: `translateY(${Y[1] - Y[0]}px)` }], 550); hf.style.opacity = 1; await grow(c, hf, B / 2, 500); } },
      { cap: `Wage + half: ${T(`${MT(w)}+${MT(half)}=${MT(w * 1.5)}`)} per hour. That is the same as ${T(`${MT(w)}\\times1.5`)}.`, run: (c) => c.pop(r1) },
      { cap: `Double time: <b>two</b> whole wages: ${T(`${MT(w)}\\times2=${MT(w * 2)}`)} per hour.`,
        run: async (c) => { d1.style.opacity = 1; d2.style.opacity = 1; await Promise.all([c.anim(d1, [{ transform: 'translateY(0)' }, { transform: `translateY(${Y[2] - Y[0]}px)` }], 550), c.anim(d2, [{ transform: 'translateY(0)' }, { transform: `translateY(${Y[2] - Y[0]}px)` }], 550, { delay: 150 })]); await c.pop(r2); } },
      { cap: `Time and a half pays <b>1.5 wages</b> for each hour. Double time pays <b>2 wages</b>.`, run: async (c) => { await c.fadeIn(ax); for (const t of ticks) await c.pop(t, 260); } }
    ];
  }
};

/* =====================================================================================
 * 1b. × 1.5, not + $1.50 (Full notes)
 * ===================================================================================== */
const NP = { a: 18, b: 15 };
const notPlus = {
  title: 'Times 1.5, not plus $1.50',
  height: 380,
  minW: 900,
  choices: [{ v: 'a', label: '$18.00/h' }, { v: 'b', label: '$15.00/h' }],
  ask: (k) => `A base wage of <b>${M(NP[k])}/h</b>. What is the time-and-a-half rate?`,
  make(stage, k, ex) {
    const w = NP[k], W = ex.W, X0 = 230, B = Math.min(300, (W - X0 - 300) / 1.5), px = B / w, BH = 52, Y = [10, 92, 174];
    const labs = ['Base wage', 'Add $1.50?', 'Times 1.5'];
    labs.forEach((l, i) => add(stage, box(h('div', 'u2l3-rlab', l), X0 - 24, BH), 10, Y[i]));
    add(stage, box(h('div', 'u2l3-bar base', M(w)), B, BH), X0, Y[0]);
    add(stage, box(h('div', 'u2l3-bar base', M(w)), B, BH), X0, Y[1]);
    add(stage, box(h('div', 'u2l3-bar base', M(w)), B, BH), X0, Y[2]);
    const sl = zero(add(stage, box(h('div', 'u2l3-bar plus', ''), 1.5 * px, BH), X0 + B, Y[1]));
    const hf = zero(add(stage, box(h('div', 'u2l3-bar half', '+ ' + M(w / 2)), B / 2, BH), X0 + B, Y[2]));
    const t1 = hide(add(stage, box(cbox('u2l3-rres', `${M(w + 1.5)}/h`), 130, BH), X0 + B + 1.5 * px + 16, Y[1]));
    const t2 = hide(add(stage, box(cbox('u2l3-rres', `${M(w * 1.5)}/h`), 130, BH), X0 + 1.5 * B + 16, Y[2]));
    const s1 = hide(stamp(stage, 'Wrong ✗', { ok: false, x: X0 + B + 1.5 * px + 211, y: Y[1] + 26, rotate: 6, size: 'sm' }));
    const s2 = hide(stamp(stage, 'Right ✓', { ok: true, x: X0 + 1.5 * B + 211, y: Y[2] + 26, rotate: -6, size: 'sm' }));
    const hrs = 4, a1 = hrs * (w + 1.5), a2 = hrs * w * 1.5;
    const note = hide(add(stage, box(cbox('u2l3-note', `For ${hrs} h of overtime: ${T(`${hrs}\\times${MT(w + 1.5)}=${MT(a1)}`)} instead of ${T(`${hrs}\\times${MT(w * 1.5)}=${MT(a2)}`)}.<br>The worker would be <b>${M(a2 - a1)} short</b>.`), W - 60, 86), 30, 262));
    return [
      { cap: `Adding $1.50: ${T(`${MT(w)}+\\$1.50=${MT(w + 1.5)}`)}. Only a <b>sliver</b> more.`, run: async (c) => { await grow(c, sl, 1.5 * px, 400); await c.pop(t1); } },
      { cap: `Times 1.5: ${T(`${MT(w)}\\times1.5=${MT(w * 1.5)}`)}. <b>Half a wage</b> more.`, run: async (c) => { await grow(c, hf, B / 2, 600); await c.pop(t2); } },
      { cap: `Time and a half means <b>× 1.5</b>. ${M(w + 1.5)}/h is wrong; ${M(w * 1.5)}/h is right.`, run: async (c) => { s1.style.opacity = 1; await stampIn(c, s1); s2.style.opacity = 1; await stampIn(c, s2); } },
      { cap: `The mistake costs real money: <b>${M(a2 - a1)}</b> for just ${hrs} hours of overtime.`, run: (c) => c.fadeIn(note) }
    ];
  }
};

/* =====================================================================================
 * 2. Gross pay = regular pay + overtime pay: the pay "area" picture
 * ===================================================================================== */
const PS = {
  j: { tag: 'Example 2', who: 'Jordan', w: 17.6, blocks: [[40, 1], [6, 1.5]],
    ask: 'Example 2: Jordan earns <b>$17.60/h</b>. He worked <b>40 regular hours</b> and <b>6 overtime hours</b> at time and a half. Find his gross pay.' },
  p: { tag: 'Example 3', who: 'Priya', w: 22.75, blocks: [[40, 1], [6.5, 1.5]], pre: true,
    ask: 'Example 3: Priya earns <b>$22.75/h</b>, with time and a half for every hour <b>over 40</b> in a week. She worked <b>46 h 30 min</b>. Find her gross pay.' },
  a: { tag: 'Example 4(b)', who: 'Ayesha', w: 28.6, blocks: [[44, 1], [4, 1.5], [3, 2]],
    ask: 'Example 4(b): Ayesha earns <b>$28.60/h</b>. She worked <b>44 regular hours</b>, <b>4 h</b> at time and a half and <b>3 h</b> at double time. Find her gross pay.' }
};
const KIND = { 1: 'reg', 1.5: 'ot', 2: 'dt' };
const payStack = {
  title: 'Gross pay: regular pay + overtime pay',
  height: 420,
  minW: 900,
  capH: 92,
  choices: [{ sep: 'Check:' }, { v: 'j', label: 'Example 2 · Jordan' }, { v: 'p', label: 'Example 3 · Priya' }, { v: 'a', label: 'Example 4(b) · Ayesha' }],
  ask: (k) => PS[k].ask,
  make(stage, k, ex) {
    const d = PS[k], W = ex.W, w = d.w;
    const X0 = 96, GW = Math.min(470, W - 470), hpx = GW / 52, Yb = 352, BH = 92;
    const PX = X0 + GW + 34, PW = W - PX - 6;
    // axes
    add(stage, box(h('div', 'u2l3-axis y'), 3, Yb - 40), X0 - 3, 40);
    add(stage, box(h('div', 'u2l3-axis x'), GW + 16, 3), X0 - 3, Yb);
    add(stage, box(h('div', 'u2l3-axt', 'hours →'), 120, 24), X0 + GW - 110, Yb + 34);
    add(stage, box(h('div', 'u2l3-axt l', '$ per hour'), 90, 24), 2, 12);
    // blocks
    let x = X0; const parts = [];
    d.blocks.forEach(([hh, m], i) => {
      const bw = hh * hpx, bh = BH * m, rate = w * m, pay = hh * rate;
      const el = add(stage, box(h('div', 'u2l3-blk ' + KIND[m]), 0, bh), x, Yb - bh); el.style.setProperty('--hp', hpx + 'px'); zero(el);
      const hl = hide(add(stage, box(h('div', 'u2l3-hlab ' + KIND[m], hr(hh) + ' h'), Math.max(bw, 54), 26), x + bw / 2 - Math.max(bw, 54) / 2, Yb + 6));
      const rl = hide(add(stage, box(h('div', 'u2l3-ylab ' + KIND[m], M(rate, nd(rate))), 88, 26), 2, Yb - bh - 13));
      const gd = hide(add(stage, box(h('div', 'u2l3-guide'), x - X0 + 2, 0), X0, Yb - bh));
      const inside = i === 0 ? hide(add(stage, box(cbox('u2l3-inblk', M(pay)), bw, bh), x, Yb - bh)) : null;
      parts.push({ hh, m, rate, pay, el, bw, hl, rl, gd, inside });
      x += bw;
    });
    const gross = parts.reduce((s, p) => s + p.pay, 0);
    // the working panel
    const lines = []; let ly = 4;
    const line = (html, cls = '') => { const e = hide(add(stage, box(h('div', 'u2l3-pl ' + cls, html), PW, 40), PX, ly)); ly += cls.includes('big') ? 54 : 44; lines.push(e); return e; };
    const steps = [];
    if (d.pre) {
      const L = line(`overtime: ${T('46.5-40=6.5')} h`, 'ot');
      steps.push({ cap: `30 min = 0.5 h, so she worked <b>46.5 h</b>. Overtime = ${T('46.5-40=6.5')} h.`, run: (c) => c.fadeIn(L) });
    }
    parts.forEach((p, i) => {
      if (p.m > 1) {
        const word = p.m === 2 ? 'Double-time' : 'Overtime';
        const L = line(`rate: ${T(`${MT(w)}\\times${p.m}=${MX(p.rate)}`)}/h`, KIND[p.m]);
        steps.push({ cap: `${word} rate: ${T(`${MT(w)}\\times${p.m}=${MX(p.rate)}`)} per hour${nd(p.rate) > 2 ? ' (keep all the decimals)' : ''}. A <b>taller</b> block.`,
          run: async (c) => { await c.fadeIn(p.gd); await c.pop(p.rl); await c.fadeIn(L); } });
      }
      const L2 = line(`${i === 0 ? 'Step 1: ' : ''}${T(`${hr(p.hh)}\\times${MX(p.rate)}=${MX(p.pay)}`)}`, KIND[p.m]);
      steps.push({ cap: i === 0
        ? `<b>Step 1:</b> regular pay = hours × wage = ${T(`${hr(p.hh)}\\times${MT(w)}=${MT(p.pay)}`)}. The area of the block.`
        : `${i === 1 ? '<b>Step 2:</b> ' : ''}${p.m === 2 ? 'double-time' : 'overtime'} pay = ${T(`${hr(p.hh)}\\times${MX(p.rate)}=${MX(p.pay)}`)}.`,
      run: async (c) => { if (i === 0) await c.pop(p.rl); await grow(c, p.el, p.bw, i === 0 ? 900 : 500); await c.fadeIn(p.hl); if (p.inside) await c.pop(p.inside); await c.fadeIn(L2); } });
    });
    const sumTex = parts.map((p) => MX(p.pay)).join('+');
    const G1 = line(`Step 3: ${T(`${sumTex}`)}`);
    const G2 = line(`Gross pay = <b>${M(gross)}</b>`, 'big');
    steps.push({ cap: `<b>Step 3:</b> gross pay = ${T(`${sumTex}${EQ(gross)}`)}.`,
      run: async (c) => { await Promise.all(parts.map((p) => c.anim(p.el, [{ filter: 'brightness(1)' }, { filter: 'brightness(1.25)' }, { filter: 'brightness(1)' }], 600))); await c.fadeIn(G1); } });
    steps.push({ cap: `${d.who}’s gross pay is <b>${M(gross)}</b>: the total area of the blocks.`, run: (c) => c.pop(G2) });
    return steps;
  }
};

/* =====================================================================================
 * 2b. Rounding the rate early vs one calculator line (Full notes)
 * ===================================================================================== */
const oneLine = {
  title: 'Round only at the end',
  height: 360,
  minW: 900,
  ask: `Example 3: Priya’s overtime is <b>6.5 h</b> at ${T('\\$22.75\\times1.5=\\$34.125')} per hour. Her regular pay is $910.00.`,
  make(stage, v, ex) {
    const W = ex.W, CW = (W - 80) / 2, XL = 30, XR = 50 + CW;
    const col = (x, ok) => {
      const hd = add(stage, box(cbox('u2l3-wwh ' + (ok ? 'ok' : 'no'), ok ? '<b>One line</b>: keep every decimal' : '<b>Round the rate first</b>: $34.125 → $34.13'), CW, 42), x, 6);
      const lcd = add(stage, box(h('div', 'u2l3-lcd', ok ? '<div class="e">6.5×1.5×22.75</div><div class="r">221.8125</div>' : '<div class="e">6.5×34.13</div><div class="r">221.845</div>'), 300, 76), x + (CW - 300) / 2, 62);
      const r1 = add(stage, box(cbox('u2l3-wl', ok ? `overtime pay ≈ <b>$221.81</b>` : `overtime pay ≈ <b>$221.85</b>`), CW, 40), x, 152);
      const r2 = add(stage, box(cbox('u2l3-wl', ok ? `gross ${T('=\\$910.00+\\$221.81=\\$1\\,131.81')}` : `gross ${T('=\\$910.00+\\$221.85=\\$1\\,131.85')}`), CW, 40), x, 198);
      const st = stamp(stage, ok ? 'Right ✓' : '4¢ too much ✗', { ok, x: x + CW / 2, y: 290, rotate: ok ? -6 : 6 });
      return [hd, lcd, r1, r2, st].map((e) => hide(e));
    };
    const A = col(XL, false), B = col(XR, true);
    return [
      { cap: `Round the rate first: $34.13. Then ${T('6.5\\times34.13=221.845')}.`, run: async (c) => { await c.fadeIn(A[0]); await c.pop(A[1]); } },
      { cap: `That gives $221.85, and a gross pay of <b>$1&#8239;131.85</b>.`, run: async (c) => { await c.fadeIn(A[2]); await c.fadeIn(A[3]); } },
      { cap: `One line keeps every decimal: ${T('6.5\\times1.5\\times22.75=221.8125')}.`, run: async (c) => { await c.fadeIn(B[0]); await c.pop(B[1]); } },
      { cap: `That rounds to $221.81, and a gross pay of <b>$1&#8239;131.81</b>, the booklet’s answer.`, run: async (c) => { await c.fadeIn(B[2]); await c.fadeIn(B[3]); } },
      { cap: `Rounding early made Priya’s pay <b>4¢ wrong</b>. Keep all the decimals, and round <b>only at the end</b>.`, run: async (c) => { A[4].style.opacity = 1; await stampIn(c, A[4]); B[4].style.opacity = 1; await stampIn(c, B[4]); } }
    ];
  }
};

/* =====================================================================================
 * 2c. Kyle's Canada Day: two pay meters through the same shift
 * ===================================================================================== */
const holiday = {
  title: 'Double time: two pay meters',
  height: 360,
  minW: 900,
  ask: 'Example 4(a): Kyle earns <b>$16.20/h</b>. His union pays <b>double time</b> on general holidays. He works a <b>7.5 h</b> shift on Canada Day. How much does he earn?',
  make(stage, v, ex) {
    const W = ex.W, w = 16.2, hrs = 7.5, dt = w * 2, X0 = 230, MW = Math.min(500, W - X0 - 190), px = MW / (hrs * dt);
    // the calendar page
    const cal = add(stage, box(h('div', 'u2l3-cal', '<div class="m">JULY</div><div class="d">1</div><svg viewBox="0 0 40 40" class="leaf"><path d="M20 3 L23 11 L28 8 L27 17 L34 14 L31 21 L37 23 L28 29 L29 33 L21 31 L21 38 L19 38 L19 31 L11 33 L12 29 L3 23 L9 21 L6 14 L13 17 L12 8 L17 11 Z" fill="#d52b1e"/></svg><div class="n">Canada Day</div>'), 170, 196), 20, 10);
    // the shift clock
    const clk = add(stage, box(h('div', 'u2l3-shift', 'Shift: <b>0</b> of 7.5 h'), 260, 40), X0, 8);
    const clkB = clk.querySelector('b');
    const rowY = [70, 176];
    const rl = [['Regular day', `${M(w)}/h`, 'reg'], ['Canada Day', `double time ${M(dt)}/h`, 'dt']];
    const meters = rl.map(([a, b, cls], i) => {
      add(stage, box(h('div', 'u2l3-mlab ' + cls, `<b>${a}</b><small>${b}</small>`), MW + 170, 26), X0, rowY[i]);
      add(stage, box(h('div', 'u2l3-mtrack'), MW, 44), X0, rowY[i] + 30);
      const f = add(stage, box(h('div', 'u2l3-mfill ' + cls), 0, 44), X0, rowY[i] + 30); f.style.width = '0px';
      const n = add(stage, box(h('div', 'u2l3-mval ' + cls, '$0.00'), 160, 44), X0 + MW + 12, rowY[i] + 30);
      return { f, n, rate: i ? dt : w };
    });
    const tags = meters.map(() => null);
    const rate = hide(add(stage, box(cbox('u2l3-note sm', `double-time rate ${T('=\\$16.20\\times2=\\$32.40')}/h`), W - X0 - 290, 44), X0 + 280, 6));
    const res = hide(add(stage, box(cbox('u2l3-res', `Kyle earns ${T('7.5\\times\\$32.40=\\$243.00')}`), 440, 50), 20, 290));
    const reg = hide(add(stage, box(cbox('u2l3-note', `regular shift: ${T('7.5\\times\\$16.20=\\$121.50')}, <b>half as much</b>`), W - 500, 50), 480, 290));
    const brk = hide(add(stage, box(h('div', 'u2l3-x2', '× 2'), MW / 2, 22), X0 + MW / 2, rowY[0] + 78));
    void tags; void cal;
    return [
      { cap: `Double time: ${T('\\$16.20\\times2=\\$32.40')} for <b>each hour</b> on the holiday.`, run: (c) => c.pop(rate) },
      { cap: 'Run the 7.5 h shift. Watch the Canada Day meter: it fills <b>twice as fast</b>.',
        run: (c) => tween(c, 2600, (t) => { const hh = hrs * t; clkB.textContent = hr(Math.round(hh * 4) / 4); meters.forEach((m) => { m.f.style.width = (m.rate * hh * px) + 'px'; m.n.textContent = M(m.rate * hh); }); }) },
      { cap: `Pay for the shift: ${T('7.5\\times\\$32.40=\\$243.00')}.`, run: (c) => c.pop(res) },
      { cap: `A regular shift would pay ${T('7.5\\times\\$16.20=\\$121.50')}. Double time pays <b>twice as much</b>.`, run: async (c) => { await c.fadeIn(brk); await c.fadeIn(reg); } }
    ];
  }
};

/* =====================================================================================
 * 3. Alberta's 8/44 rule: a week of shift bars
 * ===================================================================================== */
const WK = {
  m: { who: 'Maya', w: 18, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], hrs: [10, 8, 9.5, 7, 8],
    ask: 'Example 5: Maya earns <b>$18.00/h</b>. Hours: Mon 10, Tue 8, Wed 9.5, Thu 7, Fri 8. Find her overtime hours and her gross pay.' },
  e: { who: 'Ethan', w: 16.5, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], hrs: [8, 8, 8.5, 8, 8, 7.5],
    ask: 'Example 6: Ethan earns <b>$16.50/h</b>. Mon to Sat: 8, 8, 8.5, 8, 8 and 7.5 h. Find his overtime hours and his gross pay.' },
  l: { who: 'Four long days', days: ['Mon', 'Tue', 'Wed', 'Thu'], hrs: [10, 10, 10, 10],
    ask: 'Four <b>long days</b>: 10 h, 10 h, 10 h, 10 h. Which rule gives more overtime?' },
  s: { who: 'Seven short days', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], hrs: [7, 7, 7, 7, 7, 7, 7],
    ask: 'Seven <b>short days</b> in a row: 7 h every day. Which rule gives more overtime?' }
};
const week844 = {
  title: 'The 8/44 rule: daily or weekly, use the bigger',
  height: 450,
  minW: 900,
  capH: 92,
  choices: [{ sep: 'Check:' }, { v: 'm', label: 'Example 5 · Maya' }, { v: 'e', label: 'Example 6 · Ethan' }, { sep: 'Which rule wins?' }, { v: 'l', label: 'Long days' }, { v: 's', label: 'Many days' }],
  ask: (k) => WK[k].ask,
  make(stage, k, ex) {
    const d = WK[k], W = ex.W, n = d.hrs.length, ex2 = !!d.w;
    const tot = d.hrs.reduce((a, b) => a + b, 0), over = d.hrs.map((x) => Math.max(0, x - 8)), daily = over.reduce((a, b) => a + b, 0);
    const weekly = Math.max(0, tot - 44), ot = Math.max(daily, weekly), reg = tot - ot;
    // day columns
    const X0 = 64, CW = 56, G = 14, py = 18, Yb = 262;
    add(stage, box(h('div', 'u2l3-axis x'), n * (CW + G) + 10, 3), X0 - 10, Yb);
    const eight = add(stage, box(h('div', 'u2l3-eight'), n * (CW + G) + 10, 0), X0 - 10, Yb - 8 * py);
    add(stage, box(h('div', 'u2l3-eightl', '8 h'), 50, 24), X0 - 60, Yb - 8 * py - 12);
    const cols = d.hrs.map((x, i) => {
      const cx = X0 + i * (CW + G);
      const b = add(stage, box(h('div', 'u2l3-day'), CW, 0), cx, Yb); b.style.top = Yb + 'px';
      const cap = over[i] > 0 ? hide(add(stage, box(h('div', 'u2l3-dayot'), CW, over[i] * py), cx, Yb - x * py)) : null;
      const pl = over[i] > 0 ? hide(add(stage, box(h('div', 'u2l3-plus', '+' + hr(over[i])), CW + 10, 24), cx - 5, Yb - x * py - 28)) : null;
      const vl = hide(add(stage, box(h('div', 'u2l3-dayv', hr(x)), CW, 24), cx, Yb - Math.min(x, 8) * py / 2 - 12));
      add(stage, box(h('div', 'u2l3-dayl', d.days[i]), CW, 22), cx, Yb + 6);
      return { b, cap, pl, vl, x, cx };
    });
    // week bar
    const WX = X0 - 10, WW = W - WX - 30, wpx = WW / 52, WY = 330;
    add(stage, box(h('div', 'u2l3-wtrack'), WW, 40), WX, WY);
    let acc = 0; const segs = d.hrs.map((x, i) => { const s = add(stage, box(h('div', 'u2l3-wseg' + (i % 2 ? ' alt' : ''), d.days[i]), x * wpx, 40), WX + acc * wpx, WY); zero(s); acc += x; return s; });
    add(stage, box(h('div', 'u2l3-w44'), 3, 58), WX + 44 * wpx - 1, WY - 9);
    add(stage, box(h('div', 'u2l3-w44l', '44 h'), 60, 22), WX + 44 * wpx - 30, WY - 30);
    const wot = weekly > 0 ? hide(add(stage, box(h('div', 'u2l3-wot'), weekly * wpx, 40), WX + 44 * wpx, WY)) : null;
    const wtot = hide(add(stage, box(h('div', 'u2l3-wtot', `${hr(tot)} h`), 90, 26), WX + Math.min(tot, 50) * wpx - 45, WY + 44));
    add(stage, box(h('div', 'u2l3-wlab', 'The whole week, end to end'), 280, 22), WX, WY + 44);
    // the two verdict cards
    const PX = X0 + n * (CW + G) + 40, PW = W - PX - 20;
    const cardD = hide(add(stage, box(cbox('u2l3-vcard', `<small>Daily overtime</small><b>${hr(daily)} h</b>`), PW, 74), PX, 22));
    const cardW = hide(add(stage, box(cbox('u2l3-vcard', `<small>Weekly overtime</small><b>${hr(weekly)} h</b>`), PW, 74), PX, 108));
    const big = daily >= weekly ? cardD : cardW, small = big === cardD ? cardW : cardD;
    const st = hide(stamp(stage, 'Use this!', { ok: true, x: PX + PW - 50, y: (big === cardD ? 22 : 108) + 66, rotate: -8, size: 'sm' }));
    const regL = ex2 ? hide(add(stage, box(cbox('u2l3-pl', `regular ${T(`=${hr(tot)}-${hr(ot)}=${hr(reg)}`)} h`), PW, 40), PX, 190)) : null;
    const rate = ex2 ? d.w * 1.5 : 0, rp = reg * (d.w || 0), op = ot * rate;
    const payL = ex2 ? hide(add(stage, box(cbox('u2l3-pl sm', `${T(`${hr(reg)}\\times${MT(d.w)}=${MT(rp)}`)}<br>${T(`${hr(ot)}\\times${MT(rate)}=${MT(op)}`)}`), PW, 64), PX, 232)) : null;
    const dailySum = over.map(hr).join('+');
    const steps = [
      { cap: `${ex2 ? d.who + '’s week' : d.who}: one bar per day. The dashed line is <b>8 h</b>.`,
        run: async (c) => { const kk = 1 + (n - 1) * 0.08; await tween(c, 900, (t) => cols.forEach((o, i) => { const hh = o.x * py * Math.min(1, Math.max(0, t * kk - i * 0.08)); o.b.style.height = hh + 'px'; o.b.style.top = (Yb - hh) + 'px'; })); await Promise.all(cols.map((o) => c.fadeIn(o.vl, 250))); } },
      { cap: daily > 0 ? `<b>Step 1: daily overtime.</b> The hours over 8 turn orange: ${T(`${dailySum}=${hr(daily)}`)} h.` : `<b>Step 1: daily overtime.</b> No day goes over 8 h, so daily overtime = <b>0 h</b>.`,
        run: async (c) => { for (const o of cols) if (o.cap) { await c.fadeIn(o.cap, 300, { from: 'scaleY(.2)' }); await c.pop(o.pl, 260); } await c.pop(cardD); } },
      { cap: `<b>Step 2: weekly overtime.</b> Put the days end to end: ${T(`${d.hrs.map(hr).join('+')}=${hr(tot)}`)} h.`,
        run: async (c) => { for (let i = 0; i < n; i++) await grow(c, segs[i], d.hrs[i] * wpx, 260); await c.fadeIn(wtot); } },
      { cap: weekly > 0 ? `Past the 44 h line: ${T(`${hr(tot)}-44=${hr(weekly)}`)} h of weekly overtime.` : `${hr(tot)} h is ${tot < 44 ? 'less than' : 'exactly'} 44 h, so weekly overtime = <b>0 h</b>.`,
        run: async (c) => { if (wot) await c.fadeIn(wot, 400, { from: 'scaleX(.2)' }); await c.pop(cardW); } },
      { cap: `<b>Step 3:</b> use the <b>bigger</b> one: <b>${hr(ot)} h</b> of overtime. Never add them (not ${hr(daily)} + ${hr(weekly)}).`,
        run: async (c) => { await c.anim(small, [{ opacity: 1 }, { opacity: 0.4 }], 400); st.style.opacity = 1; await stampIn(c, st); } }
    ];
    if (ex2) {
      steps.push({ cap: `Regular hours = total − overtime = ${T(`${hr(tot)}-${hr(ot)}=${hr(reg)}`)} h.`, run: (c) => c.fadeIn(regL) });
      steps.push({ cap: `<b>Step 4:</b> ${T(`${hr(reg)}\\times${MT(d.w)}=${MT(rp)}`)} and ${T(`${hr(ot)}\\times${MT(rate)}=${MT(op)}`)}. Gross pay = <b>${M(rp + op)}</b>.`, run: (c) => c.fadeIn(payL) });
    } else {
      const lesson = k === 'l' ? '<b>Long days</b> make the <b>daily</b> rule win.' : '<b>Many days in a row</b>, even short ones, make the <b>weekly</b> rule win.';
      const L = hide(add(stage, box(cbox('u2l3-note sm', lesson), PW, 84), PX, 200));
      steps.push({ cap: `${lesson} That is why you always check <b>both</b>.`, run: (c) => c.fadeIn(L) });
    }
    void eight;
    return steps;
  }
};

/* =====================================================================================
 * 3b. Why not add daily and weekly overtime? (Full notes)
 * ===================================================================================== */
const noAdd = {
  title: 'Don’t add them: the week already counts the long day',
  height: 400,
  minW: 900,
  ask: 'Example 6: Ethan worked 8, 8, <b>8.5</b>, 8, 8 and 7.5 h. Daily overtime is 0.5 h and weekly overtime is 4 h. Why is his overtime not 4.5 h?',
  make(stage, v, ex) {
    const W = ex.W, days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], A = [8, 8, 8.5, 8, 8, 7.5], Bh = [8, 8, 8, 8, 8, 7.5];
    const WX = 150, WW = W - WX - 40, wpx = WW / 54;
    const bar = (hrs, y, label) => {
      add(stage, box(h('div', 'u2l3-rlab sm', label), WX - 16, 40), 6, y);
      add(stage, box(h('div', 'u2l3-wtrack'), WW, 40), WX, y);
      let acc = 0; const segs = hrs.map((x, i) => { const s = add(stage, box(h('div', 'u2l3-wseg' + (i % 2 ? ' alt' : ''), days[i]), x * wpx, 40), WX + acc * wpx, y); acc += x; return s; });
      add(stage, box(h('div', 'u2l3-w44'), 3, 56), WX + 44 * wpx - 1, y - 8);
      const ot = add(stage, box(h('div', 'u2l3-wot'), (acc - 44) * wpx, 40), WX + 44 * wpx, y);
      const t = add(stage, box(h('div', 'u2l3-wtot', `${hr(acc)} h`), 80, 26), WX + acc * wpx + 6, y + 7);
      return { el: [...segs, ot, t], segs, ot, acc };
    };
    add(stage, box(h('div', 'u2l3-w44l', '44 h'), 60, 22), WX + 44 * wpx - 30, 2);
    const b1 = bar(A, 30, 'Ethan’s week'), b2 = bar(Bh, 140, 'Wed only 8 h');
    b1.el.forEach((e) => hide(e)); b2.el.forEach((e) => hide(e));
    const wedX = WX + (8 + 8 + 8) * wpx;
    const sl = hide(add(stage, box(h('div', 'u2l3-wed'), 0.5 * wpx, 40), wedX, 30));
    const sll = hide(add(stage, box(h('div', 'u2l3-wedl', 'Wednesday’s extra 0.5 h'), 220, 24), wedX - 100, 76));
    const otl1 = hide(add(stage, box(h('div', 'u2l3-otl', '4 h'), 4 * wpx, 24), WX + 44 * wpx, 76));
    const otl2 = hide(add(stage, box(h('div', 'u2l3-otl', '3.5 h'), 3.5 * wpx, 24), WX + 44 * wpx, 186));
    const CWd = (W - 90) / 2;
    const wrong = hide(add(stage, box(cbox('u2l3-vcard no', `<small>Add them?</small><b>0.5 + 4 = 4.5 h</b><em>pays that half hour twice: $829.13</em>`), CWd, 96), 30, 236));
    const right = hide(add(stage, box(cbox('u2l3-vcard', `<small>Use the bigger</small><b>4 h</b><em>gross pay $825.00</em>`), CWd, 96), 60 + CWd, 236));
    const s1 = hide(stamp(stage, '✗', { ok: false, x: 30 + CWd - 40, y: 300, rotate: 8, size: 'sm' }));
    const s2 = hide(stamp(stage, '✓', { ok: true, x: 60 + 2 * CWd - 40, y: 300, rotate: -8, size: 'sm' }));
    return [
      { cap: `Ethan’s week is <b>48 h</b>. Weekly overtime: ${T('48-44=4')} h.`, run: async (c) => { for (const e of b1.el) await c.fadeIn(e, 160); await c.fadeIn(otl1); } },
      { cap: 'Wednesday was 8.5 h. Its <b>extra 0.5 h</b> is one of the hours inside the 48 h.', run: async (c) => { await c.pop(sl); await c.fadeIn(sll); } },
      { cap: `If Wednesday were only 8 h, the week would be 47.5 h, and weekly overtime would drop to ${T('47.5-44=3.5')} h.`, run: async (c) => { for (const e of b2.el) await c.fadeIn(e, 140); await c.fadeIn(otl2); } },
      { cap: 'So the weekly 4 h <b>already counts</b> Wednesday’s extra half hour. Adding 0.5 + 4 counts it <b>twice</b>.', run: async (c) => { await c.fadeIn(wrong); s1.style.opacity = 1; await stampIn(c, s1); } },
      { cap: 'Use the <b>bigger</b> one: <b>4 h</b> of overtime, and a gross pay of $825.00.', run: async (c) => { await c.fadeIn(right); s2.style.opacity = 1; await stampIn(c, s2); } }
    ];
  }
};

/* =====================================================================================
 * 4. Tomás's timesheet fills itself
 * ===================================================================================== */
const TS = [
  { d: 'Mon', s: 7, e: 17.5, b: 0.5, st: '7:00 a.m.', en: '5:30 p.m.' },
  { d: 'Tue', s: 7, e: 15.5, b: 0.5, st: '7:00 a.m.', en: '3:30 p.m.' },
  { d: 'Wed', s: 6.5, e: 17.25, b: 0.75, st: '6:30 a.m.', en: '5:15 p.m.' },
  { d: 'Thu', s: 7, e: 15, b: 0.5, st: '7:00 a.m.', en: '3:00 p.m.' },
  { d: 'Fri', s: 7, e: 16.25, b: 0.5, st: '7:00 a.m.', en: '4:15 p.m.' }
];
const timesheet = {
  title: 'From timesheet to paycheque',
  height: 450,
  minW: 900,
  capH: 92,
  ask: 'Example 7: Tomás earns <b>$19.20/h</b>. Complete his timesheet (start, end, unpaid break) and use the 8/44 rule to find his gross pay.',
  make(stage, v, ex) {
    const W = ex.W, DX = 8, TX = 84, CWh = 92, TW = W - TX - 2 * CWh - 54, px = TW / 12, HX = TX + TW + 40, OX = HX + CWh + 6;
    const t2x = (t) => TX + (t - 6) * px, RY = 46, RH = 46;
    // header: the clock across the top
    [[6, '6 a.m.'], [8, '8'], [10, '10'], [12, 'noon'], [14, '2'], [16, '4'], [18, '6 p.m.']].forEach(([t, l]) => {
      add(stage, box(h('div', 'u2l3-tlab', l), 70, 22), t2x(t) - 35, 6);
      add(stage, box(h('div', 'u2l3-tgrid'), 1, RY + TS.length * RH - 30), t2x(t), 30);
    });
    add(stage, box(h('div', 'u2l3-th', 'Hours worked'), CWh, 34), HX, 0);
    add(stage, box(h('div', 'u2l3-th', 'Over 8'), CWh, 34), OX, 0);
    const rows = TS.map((r, i) => {
      const y = RY + i * RH, hrs = r.e - r.s - r.b, ov = Math.max(0, hrs - 8);
      add(stage, box(h('div', 'u2l3-tday', r.d), TX - DX - 8, RH - 10), DX, y);
      const bar = zero(add(stage, box(h('div', 'u2l3-tbar'), 0, RH - 14), t2x(r.s), y + 2));
      const brk = hide(add(stage, box(h('div', 'u2l3-tbrk'), r.b * px, RH - 14), t2x(12), y + 2));
      const otb = ov > 0 ? hide(add(stage, box(h('div', 'u2l3-tov'), ov * px, RH - 14), t2x(r.e - ov), y + 2)) : null;
      const se = hide(add(stage, box(h('div', 'u2l3-tse', `${r.st} – ${r.en}`), 200, 20), t2x(r.s) + 6, y + 9));
      const hc = hide(add(stage, box(h('div', 'u2l3-tcell', hr(hrs)), CWh, RH - 10), HX, y));
      const oc = hide(add(stage, box(h('div', 'u2l3-tcell ot', hr(ov)), CWh, RH - 10), OX, y));
      return { r, bar, brk, otb, se, hc, oc, hrs, ov, bw: (r.e - r.s) * px };
    });
    const tot = rows.reduce((a, o) => a + o.hrs, 0), daily = rows.reduce((a, o) => a + o.ov, 0), weekly = Math.max(0, tot - 44), ot = Math.max(daily, weekly), reg = tot - ot;
    const yT = RY + TS.length * RH;
    const totL = hide(add(stage, box(h('div', 'u2l3-ttot', 'Total'), 160, RH - 10), HX - 172, yT));
    const totH = hide(add(stage, box(h('div', 'u2l3-tcell tot', hr(tot)), CWh, RH - 10), HX, yT));
    const totO = hide(add(stage, box(h('div', 'u2l3-tcell tot ot', hr(daily)), CWh, RH - 10), OX, yT));
    const verd = hide(add(stage, box(cbox('u2l3-pl', `daily <b>${hr(daily)} h</b> · weekly ${T(`${hr(tot)}-44=${hr(weekly)}`)} h → use <b>${hr(ot)} h</b> · regular ${T(`${hr(tot)}-${hr(ot)}=${hr(reg)}`)} h`), W - 20, 40), 10, yT + 46));
    const rp = reg * 19.2, op = ot * 28.8;
    const pay = hide(add(stage, box(cbox('u2l3-pl big', `${T(`${hr(reg)}\\times\\$19.20+${hr(ot)}\\times\\$28.80=${MT(rp)}+${MT(op)}=`)}<b>${M(rp + op)}</b>`), W - 20, 46), 10, yT + 92));
    const m = rows[0];
    return [
      { cap: 'Monday: 7:00 a.m. to 5:30 p.m. is <b>10 h 30 min</b>.', run: async (c) => { await c.fadeIn(m.se); await grow(c, m.bar, m.bw, 900); } },
      { cap: 'Take off the <b>unpaid break</b> (30 min, grey): 10 h 30 min − 30 min = <b>10 h</b>.', run: async (c) => { await c.pop(m.brk); await c.pop(m.hc); } },
      { cap: 'Same for every day. Wed: 10 h 45 min − 45 min = 10 h. Fri: 9 h 15 min − 30 min = 8 h 45 min = <b>8.75 h</b>.',
        run: async (c) => { for (const o of rows.slice(1)) { await c.fadeIn(o.se, 200); await grow(c, o.bar, o.bw, 450); await c.pop(o.brk, 250); await c.pop(o.hc, 250); } } },
      { cap: `Hours over 8 are the <b>end</b> of each long day (orange): ${rows.map((o) => hr(o.ov)).join(', ')}.`,
        run: async (c) => { for (const o of rows) { if (o.otb) await c.fadeIn(o.otb, 300, { from: 'scaleX(.2)' }); await c.pop(o.oc, 240); } } },
      { cap: `Totals: <b>${hr(tot)} h</b> worked. Daily overtime ${T(`${rows.map((o) => hr(o.ov)).join('+')}=${hr(daily)}`)} h.`, run: async (c) => { await c.fadeIn(totL); await c.pop(totH); await c.pop(totO); } },
      { cap: `Weekly overtime is only ${T(`${hr(tot)}-44=${hr(weekly)}`)} h. Use the bigger: <b>${hr(ot)} h</b>. Regular hours: ${T(`${hr(tot)}-${hr(ot)}=${hr(reg)}`)}.`, run: (c) => c.fadeIn(verd) },
      { cap: `Overtime rate ${T('\\$19.20\\times1.5=\\$28.80')}. Gross = ${T(`${MT(rp)}+${MT(op)}`)} = <b>${M(rp + op)}</b>.`, run: (c) => c.pop(pay) }
    ];
  }
};

mountExplainers({ rates, notPlus, payStack, oneLine, holiday, week844, noAdd, timesheet });

/* ============ Stand Up Break! — overtime rates, gross pay and the 8/44 rule, at the whiteboards ============ */
{
  const NAMES = ['Aria', 'Ben', 'Carmen', 'Dev', 'Elena', 'Femi', 'Gus', 'Hana', 'Isaac', 'Jade', 'Kofi', 'Lia', 'Marco', 'Nora', 'Owen', 'Pia'];
  const JOBS = ['a pizza place', 'a car wash', 'a hardware store', 'a daycare', 'a warehouse', 'a garden centre', 'a hotel', 'a print shop'];
  const dd = (v) => grp(dec(v, 2), '\\,');
  standup('u2l3', {
    intro: 'Estimate first, then use your calculator. Show every step: rate, regular pay, overtime pay, gross pay.',
    levels: {
      BEG: (r) => { // an overtime rate and the overtime pay
        const who = r.pick(NAMES), w = r.int(150, 320) / 10, dbl = r.chance(0.3), m = dbl ? 2 : 1.5, hh = r.pick(dbl ? [4, 6, 7.5, 8] : [2, 3, 4, 5, 2.5, 3.5, 4.5]), rate = w * m, pay = hh * rate;
        return { text: `${who} earns <b>$${dec(w)}/h</b>. ${dbl ? `On a holiday, ${who} works <b>${hr(hh)} h</b> at <b>double time</b>.` : `${who} works <b>${hr(hh)} h</b> of overtime at <b>time and a half</b>.`} Find the ${dbl ? 'double-time' : 'overtime'} rate and the pay for those hours.`, q: '',
          a: [`\\$${dd(w)}\\times${m}=\\$${dd(rate)}\\text{/h}`, `${hr(hh)}\\times\\$${dd(rate)}${EQ(pay)}`] };
      },
      PRG: (r) => { // gross pay, overtime after 40 h in a week
        const who = r.pick(NAMES), job = r.pick(JOBS), w = r.int(1550, 2890) / 100, tot = 40 + r.pick([2, 3, 4, 5, 6, 2.5, 3.5, 4.5, 5.5, 7.5]), ot = tot - 40, rate = w * 1.5, rp = 40 * w, op = ot * rate, g = rp + op;
        return { text: `${who} works at ${job} for <b>$${dec(w)}/h</b>. The company pays time and a half for every hour <b>over 40</b> in a week. This week ${who} worked <b>${hr(tot)} h</b>. Find the gross pay.`, q: '',
          a: [`\\text{overtime}=${hr(tot)}-40=${hr(ot)}\\text{ h}`, `40\\times\\$${dd(w)}=\\$${dd(rp)}`, `\\text{rate}=\\$${dd(w)}\\times1.5=${MX(rate)}\\text{/h}`, `${hr(ot)}\\times${MX(rate)}=${MX(op)}`, `\\text{gross}=\\$${dd(rp)}+${MX(op)}${EQ(g)}`] };
      },
      MAS: (r) => { // the 8/44 rule from a week of hours
        const who = r.pick(NAMES), n = r.pick([5, 6, 6]), w = r.int(150, 260) / 10;
        let hrs, daily, tot;
        do { hrs = Array.from({ length: n }, () => r.pick([6, 7, 7.5, 8, 8, 8, 8.5, 9, 9.5, 10, 10.5, 11])); daily = hrs.reduce((s, x) => s + Math.max(0, x - 8), 0); tot = hrs.reduce((s, x) => s + x, 0); } while (Math.abs(daily - Math.max(0, tot - 44)) < 0.25 || tot < 38);
        const weekly = Math.max(0, tot - 44), ot = Math.max(daily, weekly), reg = tot - ot, rate = w * 1.5, rp = reg * w, op = ot * rate;
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].slice(0, n);
        return { text: `${who} earns <b>$${dec(w)}/h</b> in Alberta. Hours this week: ${days.map((dname, i) => `${dname} <b>${hr(hrs[i])}</b>`).join(', ')}. Use the 8/44 rule to find the overtime hours and the gross pay.`, q: '',
          a: [`\\text{daily: }${hrs.map((x) => hr(Math.max(0, x - 8))).join('+')}=${hr(daily)}\\text{ h}`, `\\text{weekly: }${tot > 44 ? `${hr(tot)}-44=${hr(weekly)}` : `${hr(tot)}\\le44\\Rightarrow0`}\\text{ h}`, `\\text{use }${hr(ot)}\\text{ h; regular}=${hr(tot)}-${hr(ot)}=${hr(reg)}\\text{ h}`,
            `${hr(reg)}\\times\\$${dd(w)}+${hr(ot)}\\times\\$${dd(rate)}${EQ(rp + op)}`] };
      }
    }
  });
}

/* ============ Math History: the 1872 march for a nine-hour day ============ */
function histAnim() {
  const svg = document.getElementById('u2l3-hist'); if (!svg) return;
  const NS = 'http://www.w3.org/2000/svg', mk = (t, a, p = svg) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); p.appendChild(e); return e; };
  mk('rect', { x: 0, y: 0, width: 600, height: 300, rx: 14, fill: '#fffaf1' });
  // a skyline and a street
  const sky = mk('g', { fill: '#e8d9bf' });
  [[20, 120, 70, 110], [96, 90, 54, 140], [156, 130, 80, 100], [242, 70, 40, 160], [288, 110, 90, 120], [384, 96, 60, 134], [450, 124, 70, 106], [526, 84, 56, 146]].forEach(([x, y, w, hh]) => mk('rect', { x, y, width: w, height: hh }, sky));
  mk('rect', { x: 0, y: 230, width: 600, height: 70, fill: '#d9c4a0' });
  mk('line', { x1: 0, y1: 232, x2: 600, y2: 232, stroke: '#7a4a26', 'stroke-width': 2 });
  const cap = mk('text', { x: 300, y: 38, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 23, fill: '#4a2c14' });
  const cnt = mk('text', { x: 300, y: 72, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 30, 'font-weight': 700, fill: '#b07a12' });
  // marchers: 3 rows; each person = head + body; some hold signs
  const crowd = mk('g', {});
  const people = [];
  for (let i = 0; i < 42; i++) {
    const row = i % 3, col = Math.floor(i / 3), g = mk('g', {}, crowd);
    const x = 20 + col * 40 + row * 13, y = 214 + row * 12;
    mk('circle', { cx: 0, cy: -34, r: 7, fill: '#4a2c14' }, g);
    mk('path', { d: 'M-8 -24 h16 l3 26 h-22 Z', fill: ['#7a4a26', '#5a6b8a', '#8a3b2a'][i % 3] }, g);
    if (i % 5 === 1) { mk('line', { x1: 6, y1: -24, x2: 6, y2: -66, stroke: '#4a2c14', 'stroke-width': 2.5 }, g); mk('rect', { x: -18, y: -86, width: 48, height: 24, fill: '#fff', stroke: '#4a2c14', 'stroke-width': 2 }, g); const tx = mk('text', { x: 6, y: -69, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 13, 'font-weight': 700, fill: '#8a3b2a' }, g); tx.textContent = '9 HRS'; }
    people.push({ g, x, y, k: i });
  }
  // the calendar page for 1894
  const cal = mk('g', {});
  mk('rect', { x: 400, y: 92, width: 170, height: 120, rx: 10, fill: '#fff', stroke: '#7a4a26', 'stroke-width': 3 }, cal);
  mk('rect', { x: 400, y: 92, width: 170, height: 34, rx: 10, fill: '#b07a12' }, cal);
  const c1 = mk('text', { x: 485, y: 116, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 18, 'font-weight': 700, fill: '#fff' }, cal); c1.textContent = 'SEPTEMBER 1894';
  const c2 = mk('text', { x: 485, y: 162, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 26, 'font-weight': 700, fill: '#4a2c14' }, cal); c2.textContent = 'Labour Day';
  const c3 = mk('text', { x: 485, y: 192, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 15, fill: '#7a4a26' }, cal); c3.textContent = 'a national holiday';
  const CAPS = [[0, 'Toronto, 15 April 1872'], [4.2, 'The crowd grows on the way to Queen’s Park'], [8.6, 'Years later…']];
  const clamp = (t) => Math.max(0, Math.min(1, t)), ease = (t) => t * t * (3 - 2 * t);
  const draw = (s) => {
    let c = CAPS[0][1]; for (const [t0, txt] of CAPS) if (s >= t0) c = txt; cap.textContent = c;
    const walk = ease(clamp(s / 4)), grow = ease(clamp((s - 4.4) / 3.4)), fade = ease(clamp((s - 8.6) / 1));
    const n0 = 9, shown = Math.round(n0 + (people.length - n0) * grow);
    people.forEach((p) => {
      const on = p.k < shown;
      const dx = (1 - walk) * -260 + Math.sin((s * 6) + p.k) * 1.5;
      p.g.setAttribute('transform', `translate(${p.x + dx} ${p.y + (Math.sin(s * 9 + p.k) > 0.6 ? -2 : 0)})`);
      p.g.setAttribute('opacity', on ? 1 - 0.65 * fade : 0);
    });
    const v = Math.round((2000 + 8000 * grow) / 100) * 100;
    cnt.textContent = s < 8.6 ? `about ${v.toLocaleString('en-CA').replace(/,/g, '\u202f')} people` : 'first Monday in September';
    cal.setAttribute('opacity', fade);
    cal.setAttribute('transform', `translate(0 ${(1 - fade) * 20})`);
  };
  let raf = 0;
  const play = () => {
    cancelAnimationFrame(raf);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { draw(12); return; }
    const t0 = performance.now(); const tick = (now) => { const s = (now - t0) / 1000; draw(s); if (s < 11) raf = requestAnimationFrame(tick); }; raf = requestAnimationFrame(tick);
  };
  draw(12);
  svg.addEventListener('click', play);
  const btn = svg.closest('.hist-anim') && svg.closest('.hist-anim').querySelector('.hist-play'); if (btn) btn.addEventListener('click', play);
  let seen = false;
  new IntersectionObserver((es) => { es.forEach((e) => { if (e.isIntersecting && !seen) { seen = true; play(); } }); }, { threshold: 0.5 }).observe(svg);
}
histAnim();
