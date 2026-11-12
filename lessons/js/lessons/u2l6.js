/* Math 10-3 · Unit 2 · Lesson 6 — Extra Earnings: Tips, Bonuses and Shift Premiums.
 * Explainers: a tip from 10% and half of 10% (and a tip percent as a slice of the bill), Noor's shift (wage blocks +
 * tips, then ÷ 6 hours), working backwards with a 100-square grid (Full notes), the tip jar shared by hours, the
 * tip-out (Full notes), lump sum vs percent with a verdict stamp, Sana's shift timeline with the premium hours lit,
 * the premium on every hour mistake (Full notes), 30% more per hour (danger pay), and Diego's pay stacking up.
 * Then the Stand Up Break. */
import { h, add, box, tex, svgEl, tween, stamp, stampIn, pulse, mountExplainers } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const rnd = (v, d = 2) => Math.round((v + (v >= 0 ? 1e-9 : -1e-9)) * 10 ** d) / 10 ** d;
const lerp = (a, b, t) => a + (b - a) * t;
const grp = (s, sep) => { const [i, d] = s.split('.'); const g = i.length > 4 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, sep) : i; return d != null ? g + '.' + d : g; };
const M = (v, d = 2) => '$' + grp(rnd(v, d).toFixed(d), '\u202f');
const MT = (v, d = 2) => '\\$' + grp(rnd(v, d).toFixed(d), '\\,');
const cbox = (cls, html) => h('div', cls + ' u2l6-c', `<div>${html}</div>`);
const lcd = (e, r) => h('div', 'u2l6-lcd', `<div class="e">${e}</div><div class="r">${r}</div>`);
const line = (stage, html, x, y, w, cls = '') => hide(add(stage, box(h('div', 'u2l6-line ' + cls, `<div>${html}</div>`), w, 40), x, y));
const fadeAll = (c, els, gap = 90) => Promise.all(els.map((e, i) => c.fadeIn(e, 300, { delay: i * gap })));

/* =====================================================================================
 * 1. Tips: 10% and half of 10%; a tip percent as a slice of the bill
 * ===================================================================================== */
const tipCalc = {
  title: 'A tip, in your head and on the calculator',
  height: 400,
  minW: 900,
  choices: [{ sep: 'Example 1 check:' }, { v: 'a', label: '(a) 15% and 20% of $64.80' }, { v: 'b', label: '(b) $9 on $52: what percent?' }],
  ask: (k) => (k === 'a' ? 'Example 1(a): a dinner bill is <b>$64.80</b> before tax. Estimate a 15% tip in your head. Then find a <b>15%</b> tip and a <b>20%</b> tip.'
    : 'Example 1(b): a customer leaves a <b>$9.00</b> tip on a <b>$52.00</b> haircut. What percent tip is that? Round to the nearest tenth of a percent.'),
  make(stage, k, ex) {
    const W = ex.W, L = 300, BW = W - L - 30, Y = 54, BH = 54;
    // the receipt (left)
    const rc = add(stage, box(h('div', 'u2l6-rcpt'), 250, 330), 20, 20);
    rc.innerHTML = k === 'a'
      ? '<div class="rh">Bow River Grill</div><div class="rl"><span>Dinner for 4</span><b>$64.80</b></div><div class="rl dash"></div><div class="rl t"><span>Tip 15%</span><b data-t="15"></b></div><div class="rl t"><span>Tip 20%</span><b data-t="20"></b></div><div class="rf">Thank you!</div>'
      : '<div class="rh">Studio 17 Hair</div><div class="rl"><span>Haircut</span><b>$52.00</b></div><div class="rl dash"></div><div class="rl t"><span>Tip</span><b>$9.00</b></div><div class="rl t"><span>Tip %</span><b data-t="p"></b></div><div class="rf">See you soon!</div>';
    const bill = k === 'a' ? 65 : 52;
    const bar = add(stage, box(h('div', 'u2l6-bbar'), BW, BH), L, Y);
    for (let i = 1; i < 10; i++) add(bar, box(h('div', 'u2l6-tenth'), 2, BH - 6), BW * i / 10 - 1, 3);
    add(stage, box(h('div', 'u2l6-bbarlab', k === 'a' ? 'bill ≈ $65' : 'bill $52.00'), 220, BH), L + BW - 236, Y);
    for (let i = 0; i <= 10; i += 1) if (i % 5 === 0 || k === 'b') add(stage, box(h('div', 'u2l6-pct', i * 10 + '%'), 60, 20), L + BW * i / 10 - 30, Y + BH + 4);
    const steps = [];
    if (k === 'a') {
      const c10 = hide(add(stage, box(h('div', 'u2l6-chunk a'), BW / 10, BH + 12), L, Y - 6));
      const c5 = hide(add(stage, box(h('div', 'u2l6-chunk b'), BW / 20, BH + 12), L + BW / 10, Y - 6));
      const c10b = hide(add(stage, box(h('div', 'u2l6-chunk a'), BW / 10, BH + 12), L + BW / 10, Y - 6));
      const est = [line(stage, '10% of $65 = <b>$6.50</b> (decimal one place left)', L, 150, BW, 'est'), line(stage, '5% = half of 10% = <b>$3.25</b>', L, 192, BW, 'est'),
        line(stage, `15% ≈ ${T('\\$6.50+\\$3.25=\\$9.75')}`, L, 234, BW, 'est')];
      const ex15 = line(stage, `15%: ${T('\\$64.80\\times0.15=\\$9.72')} &nbsp;<span class="u2l6-okt">close to $9.75 ✓</span>`, L, 290, BW);
      const ex20 = line(stage, `20%: ${T('\\$64.80\\times0.20=\\$12.96')} &nbsp;<span class="u2l6-okt">(2 × 10% ≈ $13 ✓)</span>`, L, 336, BW);
      const t15 = rc.querySelector('[data-t="15"]'), t20 = rc.querySelector('[data-t="20"]');
      steps.push({ cap: 'Round the bill: $64.80 is about <b>$65</b>.', run: (c) => pulse(c, bar, 1.03) });
      steps.push({ cap: '10%: move the decimal one place left. 10% of $65 is <b>$6.50</b>.', run: async (c) => { await c.pop(c10); await c.fadeIn(est[0]); } });
      steps.push({ cap: '5% is <b>half</b> of 10%: half of $6.50 is <b>$3.25</b>.', run: async (c) => { await c.pop(c5); await c.fadeIn(est[1]); } });
      steps.push({ cap: `15% = 10% + 5%: about ${T('\\$6.50+\\$3.25=\\$9.75')}.`, run: (c) => c.fadeIn(est[2]) });
      steps.push({ cap: `Now exactly: ${T('\\$64.80\\times0.15=\\$9.72')}. Close to the estimate ✓`, run: async (c) => { await c.fadeIn(ex15); t15.textContent = '$9.72'; await c.pop(t15); } });
      steps.push({ cap: `20% is 2 × 10%, about $13. Exactly: ${T('\\$64.80\\times0.20=\\$12.96')}.`, run: async (c) => { c5.style.opacity = 0; await c.pop(c10b); await c.fadeIn(ex20); t20.textContent = '$12.96'; await c.pop(t20); } });
    } else {
      const p = 9 / 52, sl = hide(add(stage, box(h('div', 'u2l6-chunk t'), 0, BH + 12), L, Y - 6));
      const sll = hide(add(stage, box(h('div', 'u2l6-sllab', 'tip $9.00'), 120, 24), L, Y - 32));
      const l1 = line(stage, `tip percent ${T('=\\dfrac{9.00}{52.00}\\times100')}`, L, 150, BW - 270);
      const lc = hide(add(stage, box(lcd('9÷52×100', '17.30769231'), 250, 66), W - 280, 140));
      const l2 = line(stage, T('=0.17307\\ldots\\times100\\approx17.3\\%'), L, 224, BW);
      const l3 = line(stage, 'Check: 17.3% is between 10% and 20% on the bar, a bit less than 20% ✓', L, 290, BW, 'chk');
      const tp = rc.querySelector('[data-t="p"]');
      steps.push({ cap: 'The tip is a <b>part</b> of the bill: $9.00 out of $52.00.', run: async (c) => { await c.anim(sl, [{ opacity: 0 }, { opacity: 1 }], 200); await tween(c, 700, (t) => { sl.style.width = BW * p * t + 'px'; }); await c.fadeIn(sll); } });
      steps.push({ cap: `Tip percent = tip ÷ bill × 100: ${T('9.00\\div52.00\\times100')}.`, run: async (c) => { await c.fadeIn(l1); await c.pop(lc); } });
      steps.push({ cap: 'The calculator shows 17.307… Round to the nearest tenth: <b>17.3%</b>.', run: async (c) => { await c.fadeIn(l2); tp.textContent = '17.3%'; await c.pop(tp); } });
      steps.push({ cap: 'Check with the bar: the slice is between 10% and 20% ✓', run: (c) => c.fadeIn(l3) });
    }
    return steps;
  }
};

/* =====================================================================================
 * 2. Noor's shift: wage blocks + tips, then per hour
 * ===================================================================================== */
const shiftTips = {
  title: 'Gross pay = wage pay + tips',
  height: 420,
  minW: 900,
  ask: 'Example 2: Noor earns <b>$15.50/h</b>. She worked a <b>6-hour</b> shift. Her bills added up to <b>$1240.00</b>, and her tips were <b>16%</b> of the bills.',
  make(stage, v, ex) {
    const W = ex.W, L = 40, S = (W - 2 * L) / 300, Y = 90, BH = 64, wage = 93, tips = 198.4, gross = 291.4, ph = gross / 6;
    const blocks = Array.from({ length: 6 }, (_, i) => hide(add(stage, box(h('div', 'u2l6-hr', '1 h'), 15.5 * S - 2, BH), L + i * 15.5 * S, Y)));
    const wl = hide(add(stage, box(cbox('u2l6-blab b', `wage pay ${T('6\\times\\$15.50=\\$93.00')}`), 320, 30), L, Y - 72));
    const tb = hide(add(stage, box(h('div', 'u2l6-tipb', `<b>tips $198.40</b>`), tips * S, BH), L + wage * S, Y));
    const tl = hide(add(stage, box(cbox('u2l6-blab o', `tips ${T('\\$1240.00\\times0.16=\\$198.40')}`), 380, 30), L + wage * S + 20, Y - 36));
    const br = hide(add(stage, box(h('div', 'u2l6-brace'), gross * S, 14), L, Y + BH + 6));
    const gl = hide(add(stage, box(cbox('u2l6-res', `gross pay ${T('\\$93.00+\\$198.40=\\$291.40')}`), 520, 50), L + (gross * S - 520) / 2, Y + BH + 26));
    const Y2 = 260;
    const per = Array.from({ length: 6 }, (_, i) => hide(add(stage, box(h('div', 'u2l6-per', M(ph)), ph * S - 4, 50), L + i * ph * S, Y2)));
    const pl = hide(add(stage, box(cbox('u2l6-blab r', `per hour: ${T('\\$291.40\\div6\\approx\\$48.57')}`), 400, 30), L, Y2 - 34));
    const w1 = hide(add(stage, box(h('div', 'u2l6-w1', ''), 15.5 * S - 2, 40), L, Y2 + 66));
    const w3 = [1, 2].map((i) => hide(add(stage, box(h('div', 'u2l6-w1 g', ''), 15.5 * S - 2, 40), L + i * 15.5 * S, Y2 + 66)));
    const wn = hide(add(stage, box(cbox('u2l6-blab', '3 hours of wage ($15.50 each) is only $46.50'), 560, 30), L + 3 * 15.5 * S + 10, Y2 + 72));
    return [
      { cap: `Wage pay: 6 hours at $15.50: ${T('6\\times\\$15.50=\\$93.00')}.`, run: async (c) => { await fadeAll(c, blocks, 110); await c.fadeIn(wl); } },
      { cap: `Tips: 16% of the bills: ${T('\\$1240.00\\times0.16=\\$198.40')}.`, run: async (c) => { await c.fadeIn(tb, 450, { from: 'translateX(40px)' }); await c.fadeIn(tl); } },
      { cap: `Gross pay = wage pay + tips = <b>$291.40</b>.`, run: async (c) => { await c.fadeIn(br); await c.pop(gl); } },
      { cap: `Per hour, with tips: ${T('\\$291.40\\div6=\\$48.566\\ldots\\approx\\$48.57')}.`, run: async (c) => { await c.fadeIn(pl); await fadeAll(c, per, 100); } },
      { cap: 'That is <b>more than three times</b> her wage of $15.50 per hour.', run: async (c) => { await c.pop(w1); await fadeAll(c, w3, 150); await c.fadeIn(wn); } }
    ];
  }
};

/* =====================================================================================
 * 3. Working backwards with 100 squares (Full notes)
 * ===================================================================================== */
const tipBack = {
  title: 'Working backwards: 12% is $86.40, so 100% is…',
  height: 400,
  minW: 860,
  ask: 'Example 3: Mateo got <b>$86.40</b> in tips. His tips were <b>12%</b> of his orders. What was the total of his orders?',
  make(stage, v, ex) {
    const W = ex.W, CS = 33, G0x = 30, G0y = 30;
    const cells = [];
    for (let r = 0; r < 10; r++) for (let q = 0; q < 10; q++) { const i = r * 10 + q; cells.push(add(stage, box(h('div', 'u2l6-sq' + (i < 12 ? ' tip' : '')), CS - 3, CS - 3), G0x + q * CS, G0y + r * CS)); }
    const RX = G0x + 10 * CS + 40, RW = W - RX - 20;
    const l0 = line(stage, '100 squares = all his orders (100%)', RX, 30, RW);
    const l1 = line(stage, `12 squares = his tips: <b>$86.40</b>`, RX, 76, RW, 'o');
    const l2 = line(stage, `1 square (1%): ${T('\\$86.40\\div12=\\$7.20')}`, RX, 138, RW);
    const l3 = line(stage, `100 squares: ${T('100\\times\\$7.20=\\$720.00')}`, RX, 190, RW);
    const l4 = line(stage, `Same as ${T('\\$86.40\\div0.12=\\$720.00')}`, RX, 252, RW);
    const l5 = line(stage, `Check: ${T('\\$720.00\\times0.12=\\$86.40')} ✓`, RX, 300, RW, 'chk');
    const cnt = hide(add(stage, box(cbox('u2l6-res', '$0.00'), 220, 50), RX, 342));
    return [
      { cap: 'Think of all his orders as <b>100 squares</b>. His tips are 12 of them.', run: async (c) => { await c.fadeIn(l0); await c.fadeIn(l1); await Promise.all(cells.slice(0, 12).map((e) => pulse(c, e, 1.15))); } },
      { cap: `One square is 1%: ${T('\\$86.40\\div12=\\$7.20')}.`, run: async (c) => { cells[0].classList.add('one'); await c.fadeIn(l2); await pulse(c, cells[0], 1.3); } },
      { cap: `All 100 squares: ${T('100\\times\\$7.20=\\$720.00')}.`,
        run: async (c) => { await c.fadeIn(l3); cnt.style.opacity = 1; await tween(c, 1400, (t) => { const n = Math.round(t * 100); cells.forEach((e, i) => e.classList.toggle('all', i < n)); cnt.firstChild.textContent = M(n * 7.2); }); } },
      { cap: `It is the same as dividing by the rate: ${T('\\$86.40\\div0.12=\\$720.00')} ✓`, run: async (c) => { await c.fadeIn(l4); await c.fadeIn(l5); } }
    ];
  }
};

/* =====================================================================================
 * 4. The tip jar, shared equally or by hours
 * ===================================================================================== */
const POOL = [['Mia', 8], ['Jon', 6], ['Priya', 5], ['Sam', 5]];
const tipJar = {
  title: 'Sharing the tip jar',
  height: 450,
  minW: 900,
  choices: [{ sep: 'Example 4 check:' }, { v: 'a', label: '(a) Equally' }, { v: 'b', label: '(b) By hours' }],
  ask: (k) => `Example 4${k === 'a' ? '(a)' : '(b)'}: four servers share a tip pool of <b>$612.00</b>${k === 'a' ? ' <b>equally</b>.' : ' <b>by hours worked</b>: Mia 8 h, Jon 6 h, Priya 5 h, Sam 5 h.'}`,
  make(stage, k, ex) {
    const W = ex.W;
    // the jar
    const jar = add(stage, svgEl('svg', { width: 230, height: 300, viewBox: '0 0 230 300', class: 'u2l6-svg' }), 20, 70);
    jar.innerHTML = '<rect x="58" y="10" width="114" height="26" rx="6" fill="#c9a26b" stroke="#6e4a1c" stroke-width="3"/><path d="M50 40 H180 Q200 40 200 64 V262 Q200 290 172 290 H58 Q30 290 30 262 V64 Q30 40 50 40 Z" fill="#eef6fb" stroke="#6b8aa3" stroke-width="4"/>';
    const fill = svgEl('rect', { x: 34, y: 92, width: 162, height: 194, rx: 22, fill: '#e9c46a' }, jar);
    svgEl('rect', { x: 64, y: 140, width: 102, height: 46, rx: 8, fill: '#fff', stroke: '#6e4a1c', 'stroke-width': 2 }, jar);
    const jt = svgEl('text', { x: 115, y: 172, 'text-anchor': 'middle', class: 'u2l6-jart' }, jar); jt.textContent = '$612.00';
    add(stage, box(h('div', 'u2l6-jarl', 'TIPS'), 230, 24), 20, 40);
    const setJar = (amt) => { const hh = 194 * amt / 612; fill.setAttribute('y', 286 - hh); fill.setAttribute('height', Math.max(0, hh)); jt.textContent = M(amt); };
    // the four servers
    const C0 = 290, CW = (W - C0 - 20) / 4, BOT = 300, HH = 27;
    const cols = POOL.map(([n, hrs], j) => {
      const x = C0 + j * CW;
      add(stage, box(h('div', 'u2l6-name', n), CW - 10, 28), x + 5, BOT + 6);
      const blocks = k === 'b' ? Array.from({ length: hrs }, (_, i) => hide(add(stage, box(h('div', 'u2l6-hb', '1 h'), CW - 30, HH - 3), x + 15, BOT - (i + 1) * HH))) : [];
      const stack = k === 'a' ? hide(add(stage, box(h('div', 'u2l6-stack', '$153.00'), CW - 30, 153 * 1.2), x + 15, BOT - 153 * 1.2)) : null;
      const share = hide(add(stage, box(cbox('u2l6-share', ''), CW - 6, 60), x + 3, BOT + 36));
      return { blocks, stack, share, hrs, n };
    });
    const steps = [];
    if (k === 'a') {
      const l = hide(add(stage, box(cbox('u2l6-res', `${T('\\$612.00\\div4=\\$153.00')} each`), 380, 50), C0 + (W - C0 - 400) / 2, 10));
      steps.push({ cap: `Equally: 4 servers, so ${T('\\$612.00\\div4=\\$153.00')} each.`, run: async (c) => { await c.pop(l); await tween(c, 900, (t) => setJar(612 * (1 - t))); await fadeAll(c, cols.map((o) => o.stack), 120); } });
      steps.push({ cap: 'Everyone gets the same, even though Mia worked 8 hours and Priya worked 5.',
        run: async (c) => { cols.forEach((o) => { o.share.firstChild.innerHTML = `${o.hrs} h worked<br><b>$153.00</b>`; }); await fadeAll(c, cols.map((o) => o.share), 100); } });
      steps.push({ cap: 'That is why many restaurants share <b>by hours</b> instead. Tap “(b) By hours”.', run: (c) => pulse(c, cols[0].share, 1.08) });
      return steps;
    }
    const TBW = (W - C0 - 30) / 2;
    const tot = hide(add(stage, box(cbox('u2l6-tot', `Step 1: ${T('8+6+5+5=24')} h`), TBW, 46), C0, 6));
    const one = hide(add(stage, box(cbox('u2l6-tot o', `Step 2: ${T('\\$612.00\\div24=\\$25.50')}`), TBW, 46), C0 + TBW + 10, 6));
    const chk = hide(add(stage, box(cbox('u2l6-chk', `Step 4: ${T('\\$204.00+\\$153.00+\\$127.50+\\$127.50=\\$612.00')} ✓`), W - 40, 40), 20, 404));
    steps.push({ cap: `Step 1: add everyone’s hours: ${T('8+6+5+5=24')} h.`, run: async (c) => { for (const o of cols) await fadeAll(c, o.blocks, 40); await c.fadeIn(tot); } });
    steps.push({ cap: `Step 2: the share for 1 hour: ${T('\\$612.00\\div24=\\$25.50')}.`,
      run: async (c) => {
        await c.fadeIn(one);
        const all = cols.flatMap((o) => o.blocks);
        await tween(c, 1300, (t) => { const n = Math.round(t * 24); all.forEach((b, i) => { b.classList.toggle('paid', i < n); b.innerHTML = i < n ? '$25.50' : '1 h'; }); setJar(612 - 25.5 * n); });
      } });
    steps.push({ cap: 'Step 3: each person’s hours × $25.50.',
      run: async (c) => { cols.forEach((o) => { o.share.firstChild.innerHTML = `${T(`${o.hrs}\\times\\$25.50`)}<br><b>${M(o.hrs * 25.5)}</b>`; }); await fadeAll(c, cols.map((o) => o.share), 140); } });
    steps.push({ cap: 'Step 4: check that the shares add up to the pool ✓', run: (c) => c.fadeIn(chk) });
    return steps;
  }
};

/* =====================================================================================
 * 5. The tip-out (Full notes)
 * ===================================================================================== */
const tipOut = {
  title: 'Tip-out first, then share the rest',
  height: 380,
  minW: 900,
  ask: 'Example 5: the bar collects <b>$825.00</b> in tips. <b>30%</b> goes to the kitchen. The rest is shared equally by <b>3 bartenders</b>.',
  make(stage, v, ex) {
    const W = ex.W, L = 40, BW = W - 80, Y = 40, BH = 60;
    const bar = add(stage, box(h('div', 'u2l6-bbar'), BW, BH), L, Y);
    for (let i = 1; i < 10; i++) add(bar, box(h('div', 'u2l6-tenth'), 2, BH - 6), BW * i / 10 - 1, 3);
    const bl = add(stage, box(h('div', 'u2l6-bbarlab', 'tips $825.00'), 240, BH), L + BW - 256, Y);
    const kit = hide(add(stage, box(h('div', 'u2l6-kit', '<b>kitchen 30%</b>$247.50'), BW * 0.3, BH), L, Y));
    const l1 = line(stage, `kitchen ${T('=\\$825.00\\times0.30=\\$247.50')}`, L, 130, BW);
    const l2 = line(stage, `left ${T('=\\$825.00-\\$247.50=\\$577.50')} &nbsp;(or ${T('\\$825.00\\times0.70')})`, L, 176, BW);
    const SW = BW * 0.7 / 3;
    const parts = [0, 1, 2].map((i) => hide(add(stage, box(h('div', 'u2l6-bt', `bartender ${i + 1}<b>$192.50</b>`), SW - 10, 70), L + BW * 0.3 + i * SW + 5, 236)));
    const l3 = line(stage, `each bartender ${T('=\\$577.50\\div3=\\$192.50')}`, L, 320, BW);
    return [
      { cap: `Take the kitchen’s 30% off the top: ${T('\\$825.00\\times0.30=\\$247.50')}.`, run: async (c) => { await c.fadeIn(kit, 400, { from: 'translateY(-20px)' }); await c.fadeIn(l1); } },
      { cap: `What is left for the bartenders: ${T('\\$825.00-\\$247.50=\\$577.50')}.`, run: async (c) => { bl.innerHTML = 'left $577.50'; await c.fadeIn(l2); } },
      { cap: `Share it equally: ${T('\\$577.50\\div3=\\$192.50')} each.`, run: async (c) => { await fadeAll(c, parts, 150); await c.fadeIn(l3); } }
    ];
  }
};

/* =====================================================================================
 * 6. Lump sum or percent? Find both in dollars, then compare
 * ===================================================================================== */
const BC = {
  rosa: { ask: 'Example 7: a lump sum of <b>$750</b>, or <b>3%</b> of Rosa’s pay for the year. She earned <b>$28&#8239;600</b>. Which should she choose?',
    A: { name: 'Lump sum', lines: ['\\text{a set amount}'], v: 750 }, B: { name: '3% of her pay', lines: ['\\$28\\,600\\times0.03=\\$858.00'], v: 858 }, who: 'Rosa' },
  camp: { ask: 'Example 9(b): isolation pay of <b>$650 a month</b>, or <b>10%</b> of the cook’s <b>$5850</b> monthly pay, for a <b>4-month</b> contract. Which pays more?',
    A: { name: '$650 a month', lines: ['4\\times\\$650=\\$2600.00'], v: 2600 }, B: { name: '10% a month', lines: ['\\$5850\\times0.10=\\$585.00\\text{ a month}', '4\\times\\$585.00=\\$2340.00'], v: 2340 }, who: 'The cook' }
};
const bonusChoice = {
  title: 'Which choice pays more?',
  height: 400,
  minW: 900,
  choices: [{ sep: 'Example 7 check:' }, { v: 'rosa', label: 'Rosa’s bonus' }, { sep: 'Example 9(b) check:' }, { v: 'camp', label: 'Mine camp' }],
  ask: (k) => BC[k].ask,
  make(stage, k, ex) {
    const d = BC[k], W = ex.W, CW = (W - 60) / 2, mx = Math.max(d.A.v, d.B.v), S = (CW - 40) / mx, win = d.A.v > d.B.v ? 0 : 1, diff = Math.abs(d.A.v - d.B.v);
    const col = (o, x) => {
      const head = add(stage, box(cbox('u2l6-ch', `<b>${o.name}</b>`), CW, 44), x, 6);
      const ls = o.lines.map((t, i) => line(stage, T(t), x, 60 + i * 42, CW, 'ctr'));
      const bar = hide(add(stage, box(h('div', 'u2l6-cbar'), 0, 50), x + 20, 168));
      const val = hide(add(stage, box(cbox('u2l6-cval', M(o.v)), CW, 36), x, 224));
      return { head, ls, bar, val, o };
    };
    const A = col(d.A, 20), B = col(d.B, 40 + CW);
    const res = hide(add(stage, box(cbox('u2l6-res', `${T(`${MT(Math.max(d.A.v, d.B.v))}-${MT(Math.min(d.A.v, d.B.v))}=${MT(diff)}`)} more`), 460, 50), (W - 460) / 2, 280));
    const st = hide(stamp(stage, 'Choose this ✓', { ok: true, x: (win ? 40 + CW : 20) + CW / 2, y: 362, rotate: -5 }));
    const grow = (c, o) => { o.bar.style.opacity = 1; return tween(c, 700, (t) => { o.bar.style.width = o.o.v * S * t + 'px'; }); };
    return [
      { cap: k === 'rosa' ? 'Choice 1: the lump sum is <b>$750.00</b>.' : `Choice 1: $650 a month for 4 months: ${T('4\\times\\$650=\\$2600.00')}.`, run: async (c) => { await fadeAll(c, A.ls); A.bar.classList.add('a'); await grow(c, A); await c.fadeIn(A.val); } },
      { cap: k === 'rosa' ? `Choice 2: the percent in dollars: ${T('\\$28\\,600\\times0.03=\\$858.00')}.` : `Choice 2: 10% of $5850 is $585.00 a month; ${T('4\\times\\$585.00=\\$2340.00')}.`, run: async (c) => { await fadeAll(c, B.ls, 300); B.bar.classList.add('b'); await grow(c, B); await c.fadeIn(B.val); } },
      { cap: `Compare: ${win ? d.B.name : d.A.name} pays ${T(`${MT(diff)}`)} more. ${d.who} should choose it.`, run: async (c) => { await c.pop(res); await stampIn(c, st); } }
    ];
  }
};

/* =====================================================================================
 * 7. Sana's week on a timeline: the premium hours light up
 * ===================================================================================== */
const SANA = [['Monday', 14, 22], ['Tuesday', 10, 18], ['Wednesday', 15, 23], ['Friday', 16.5, 23.5]];
const shiftLine = {
  title: 'Shift premium: only the hours after 6:00 p.m.',
  height: 470,
  minW: 920,
  ask: 'Example 8: Sana earns <b>$21.60/h</b>, plus <b>$2.50/h</b> for every hour after <b>6:00 p.m.</b> Find her gross pay for the week.',
  make(stage, v, ex) {
    const W = ex.W, X0 = 130, X1 = W - 210, H0 = 10, H1 = 24, X = (t) => X0 + (X1 - X0) * (t - H0) / (H1 - H0), RY = (i) => 54 + i * 50, BH = 34;
    add(stage, box(h('div', 'u2l6-axis'), X1 - X0, 2), X0, 40);
    const tl = { 10: '10 a.m.', 12: 'noon', 14: '2', 16: '4', 18: '6 p.m.', 20: '8', 22: '10', 24: 'midnight' };
    for (let t = H0; t <= H1; t++) { add(stage, box(h('div', 'u2l6-tk' + (t % 2 ? ' m' : '')), 2, t % 2 ? 6 : 10), X(t) - 1, 36); if (tl[t]) add(stage, box(h('div', 'u2l6-tkl' + (t === 18 ? ' p' : ''), tl[t]), 70, 20), X(t) - 35, 12); }
    const six = hide(add(stage, box(h('div', 'u2l6-six'), 4, 4 * 50 + 6), X(18) - 2, 46));
    add(stage, box(h('div', 'u2l6-colh', 'worked'), 64, 20), X1 + 40, 12); add(stage, box(h('div', 'u2l6-colh p', 'after 6'), 70, 20), X1 + 114, 12);
    const rows = SANA.map(([d, a, b], i) => {
      add(stage, box(h('div', 'u2l6-day', d), 110, BH), 14, RY(i));
      const bar = hide(add(stage, box(h('div', 'u2l6-shift'), 0, BH), X(a), RY(i)));
      const prem = Math.max(0, b - Math.max(a, 18));
      const pb = prem ? hide(add(stage, box(h('div', 'u2l6-prem'), X(b) - X(Math.max(a, 18)), BH), X(Math.max(a, 18)), RY(i))) : null;
      const hw = hide(add(stage, box(cbox('u2l6-hcell', String(b - a)), 64, BH), X1 + 40, RY(i)));
      const hp = hide(add(stage, box(cbox('u2l6-hcell p', String(prem)), 70, BH), X1 + 114, RY(i)));
      return { a, b, bar, pb, hw, hp };
    });
    const totY = RY(4) + 4;
    add(stage, box(h('div', 'u2l6-totl', 'Total'), 110, 34), X1 - 80, totY);
    const tw = hide(add(stage, box(cbox('u2l6-hcell t', '31'), 64, 34), X1 + 40, totY)), tp = hide(add(stage, box(cbox('u2l6-hcell p t', '14.5'), 70, 34), X1 + 114, totY));
    const LY = totY + 50, LW = W - 60;
    const l1 = line(stage, `regular pay ${T('=31\\times\\$21.60=\\$669.60')} &nbsp;<span class="u2l6-note">(every hour gets the wage)</span>`, 30, LY, LW);
    const l2 = line(stage, `premium pay ${T('=14.5\\times\\$2.50=\\$36.25')} &nbsp;<span class="u2l6-note p">(only the orange hours)</span>`, 30, LY + 44, LW);
    const l3 = line(stage, `gross pay ${T('=\\$669.60+\\$36.25=\\$705.85')}`, 30, LY + 88, LW, 'res');
    return [
      { cap: 'Draw each shift from its start to its end, and count the hours worked.',
        run: async (c) => { for (const r of rows) { r.bar.style.opacity = 1; await tween(c, 380, (t) => { r.bar.style.width = (X(r.a + (r.b - r.a) * t) - X(r.a)) + 'px'; }); await c.fadeIn(r.hw, 200); } } },
      { cap: 'The premium starts at <b>6:00 p.m.</b> Light up the hours after the line.',
        run: async (c) => { await c.anim(six, [{ opacity: 0 }, { opacity: 1 }], 300); for (const r of rows) { if (r.pb) await c.fadeIn(r.pb, 300, { from: 'scaleX(0)' }); await c.fadeIn(r.hp, 200); } } },
      { cap: `Totals: ${T('8+8+8+7=31')} hours worked, and ${T('4+0+5+5.5=14.5')} hours after 6:00 p.m.`, run: async (c) => { await c.pop(tw); await c.pop(tp); } },
      { cap: `No day is over 8 h and the week is under 44 h: no overtime. Regular pay: ${T('31\\times\\$21.60=\\$669.60')}.`, run: (c) => c.fadeIn(l1) },
      { cap: `Premium pay, only for the 14.5 orange hours: ${T('14.5\\times\\$2.50=\\$36.25')}.`, run: (c) => c.fadeIn(l2) },
      { cap: 'Gross pay = regular pay + premium pay = <b>$705.85</b>.', run: (c) => c.pop(l3) }
    ];
  }
};

/* =====================================================================================
 * 8. Premium on every hour? (Full notes)
 * ===================================================================================== */
const premiumWrong = {
  title: 'Premium only on the premium hours',
  height: 380,
  minW: 900,
  ask: 'Sana’s Monday (Example 8): 2:00 p.m. to 10:00 p.m., 8 hours, at <b>$21.60/h</b> plus <b>$2.50/h</b> after 6:00 p.m.',
  make(stage, v, ex) {
    const W = ex.W, CW = (W - 60) / 2, HW = (CW - 40) / 8;
    const col = (x, ok) => {
      add(stage, box(cbox('u2l6-ch ' + (ok ? 'ok' : 'no'), ok ? '<b>Premium on the 4 hours after 6</b>' : '<b>Premium on all 8 hours</b>'), CW, 42), x, 6);
      const hrs = Array.from({ length: 8 }, (_, i) => add(stage, box(h('div', 'u2l6-mh' + (i >= 4 ? ' late' : ''), ['2', '3', '4', '5', '6', '7', '8', '9'][i]), HW - 4, 40), x + 20 + i * HW, 62));
      const chips = Array.from({ length: 8 }, (_, i) => (ok && i < 4 ? null : hide(add(stage, box(h('div', 'u2l6-pc' + (ok ? '' : ' bad'), '+$2.50'), HW - 4, 26), x + 20 + i * HW, 106))));
      const ls = ok ? [line(stage, T('8\\times\\$21.60=\\$172.80'), x, 150, CW, 'ctr'), line(stage, T('4\\times\\$2.50=\\$10.00'), x, 192, CW, 'ctr'), line(stage, T('\\$172.80+\\$10.00=\\$182.80'), x, 234, CW, 'ctr res')]
        : [line(stage, T('\\$21.60+\\$2.50=\\$24.10'), x, 150, CW, 'ctr'), line(stage, T('8\\times\\$24.10=\\$192.80'), x, 192, CW, 'ctr'), line(stage, '$10.00 too much', x, 234, CW, 'ctr bad')];
      const st = hide(stamp(stage, ok ? 'Right ✓' : 'Wrong ✗', { ok, x: x + CW / 2, y: 320, rotate: ok ? -6 : 6 }));
      return { hrs, chips: chips.filter(Boolean), ls, st };
    };
    const A = col(20, true), B = col(40 + CW, false);
    return [
      { cap: 'The right way: every hour gets the wage. Only the 4 hours after 6:00 p.m. get +$2.50.', run: async (c) => { await fadeAll(c, A.chips, 120); await fadeAll(c, A.ls, 200); await stampIn(c, A.st); } },
      { cap: 'The mistake: adding $2.50 to the wage for all 8 hours.', run: async (c) => { await fadeAll(c, B.chips, 80); await fadeAll(c, B.ls.slice(0, 2), 200); } },
      { cap: 'That pays the premium on 4 hours that are <b>not</b> after 6:00 p.m.: $10.00 too much.', run: async (c) => { await c.fadeIn(B.ls[2]); await Promise.all(B.chips.slice(0, 4).map((e) => pulse(c, e, 1.15))); await stampIn(c, B.st); } }
    ];
  }
};

/* =====================================================================================
 * 9. 30% more per hour: danger pay
 * ===================================================================================== */
const dangerPay = {
  title: '30% more per hour: wage × 1.30',
  height: 430,
  minW: 900,
  ask: 'Example 9(a): a wildfire crew member earns <b>$24.00/h</b>. On the fire line she gets <b>30% more</b> per hour. Find her pay for an <b>8-hour</b> day, and the danger pay.',
  make(stage, v, ex) {
    const W = ex.W, L = 40, U = (W - 2 * L - 240) / 13, Y = 40, BH = 54;   // U = px per 10%
    const base = add(stage, box(h('div', 'u2l6-wbar'), 10 * U, BH), L, Y);
    for (let i = 1; i < 10; i++) add(base, box(h('div', 'u2l6-tenth'), 2, BH - 6), U * i - 1, 3);
    add(stage, box(h('div', 'u2l6-wlab', '$24.00 = 100%'), 10 * U, BH), L, Y);
    const extra = hide(add(stage, box(h('div', 'u2l6-xbar', '+30%'), 3 * U, BH), L + 10 * U, Y));
    const el = hide(add(stage, box(cbox('u2l6-blab o', `30% of $24.00 = $7.20`), 260, 30), L + 10 * U - 60, Y + BH + 6));
    const nr = hide(add(stage, box(cbox('u2l6-res', `new rate ${T('\\$24.00\\times1.30=\\$31.20')}/h`), 430, 50), L + 13 * U + 10 - 430 + 240, Y + BH + 44));
    // the day: 8 columns
    const DY = 300, S = 120 / 31.2, CW = 44;
    const cols = Array.from({ length: 8 }, (_, i) => {
      const x = L + i * (CW + 10);
      const b = hide(add(stage, box(h('div', 'u2l6-dcol'), CW, 24 * S), x, DY - 24 * S));
      const o = hide(add(stage, box(h('div', 'u2l6-dtop'), CW, 7.2 * S), x, DY - 31.2 * S));
      return { b, o };
    });
    add(stage, box(h('div', 'u2l6-floor'), 8 * (CW + 10), 3), L - 4, DY);
    add(stage, box(h('div', 'u2l6-dayl', '8 hours on the fire line'), 8 * (CW + 10), 24), L, DY + 6);
    const RX = L + 8 * (CW + 10) + 20, RW = W - RX - 20;
    const l1 = line(stage, `day’s pay ${T('=8\\times\\$31.20=\\$249.60')}`, RX, 204, RW);
    const l2 = line(stage, `without danger pay: ${T('8\\times\\$24.00=\\$192.00')}`, RX, 250, RW, 'b');
    const l3 = line(stage, `danger pay ${T('=\\$249.60-\\$192.00=\\$57.60')}`, RX, 296, RW, 'o');
    const l4 = line(stage, `Check: ${T('8\\times\\$7.20=\\$57.60')} ✓`, RX, 342, RW, 'chk');
    return [
      { cap: 'Her wage, $24.00 per hour, is <b>100%</b>.', run: (c) => pulse(c, base, 1.03) },
      { cap: `30% more: add 3 more tenths. 30% of $24.00 is $7.20.`, run: async (c) => { await c.fadeIn(extra, 400, { from: 'translateX(-30px)' }); await c.fadeIn(el); } },
      { cap: `100% + 30% = 130%, so the new rate is ${T('\\$24.00\\times1.30=\\$31.20')} per hour.`, run: (c) => c.pop(nr) },
      { cap: `A day on the fire line: ${T('8\\times\\$31.20=\\$249.60')}.`, run: async (c) => { await fadeAll(c, cols.map((o) => o.b), 70); await fadeAll(c, cols.map((o) => o.o), 70); await c.fadeIn(l1); } },
      { cap: `Without danger pay (the blue parts): ${T('8\\times\\$24.00=\\$192.00')}.`, run: async (c) => { await c.fadeIn(l2); await Promise.all(cols.map((o) => pulse(c, o.b, 1.05))); } },
      { cap: `Danger pay (the orange parts): ${T('\\$249.60-\\$192.00=\\$57.60')}.`, run: async (c) => { await c.fadeIn(l3); await Promise.all(cols.map((o) => pulse(c, o.o, 1.15))); await c.fadeIn(l4); } }
    ];
  }
};

/* =====================================================================================
 * 10. Diego's pay stacks up
 * ===================================================================================== */
const payStack = {
  title: 'Total gross pay: find each part, then add',
  height: 450,
  minW: 900,
  ask: 'Example 10: Diego earns <b>$19.00/h</b>. He worked <b>46 h</b> (never over 8 h a day). Night premium <b>$1.50/h</b> for <b>20</b> hours. Tip-out share <b>$142.75</b>.',
  make(stage, v, ex) {
    const W = ex.W, L = 20, HW = (W - 40) / 46;
    const hrs = Array.from({ length: 46 }, (_, i) => add(stage, box(h('div', 'u2l6-h46' + (i >= 44 ? ' ot' : '')), HW - 2, 26), L + i * HW, 10));
    const hl = hide(add(stage, box(cbox('u2l6-blab', `${T('46-44=2')} h of overtime (weekly rule) · 44 regular hours`), 560, 28), L, 40));
    const tb = add(stage, h('table', 'u2l6-tbl u2l6-ptbl'), L, 80); tb.style.width = '560px';
    const R = [['Regular pay', '44\\times\\$19.00', 836, 'r'], ['Overtime pay', '2\\times\\$28.50', 57, 'o'], ['Night premium', '20\\times\\$1.50', 30, 'n'], ['Tip-out share', '', 142.75, 't']];
    tb.innerHTML = '<tr><th>Type of pay</th><th>Work</th><th>Amount</th></tr>' + R.map(([a, w, m, k]) => `<tr class="${k}"><td>${a}</td><td${w ? ' class="h"' : ''}>${w ? T(w) : ''}</td><td class="h">${M(m)}</td></tr>`).join('') + `<tr class="tot"><td>Gross pay</td><td></td><td class="h">${M(1065.75)}</td></tr>`;
    const cells = [...tb.querySelectorAll('td.h')]; hide(...cells);
    // the tower
    const TX = 620, TW = Math.min(170, W - TX - 110), B0 = 420, S = 300 / 1100;
    add(stage, box(h('div', 'u2l6-floor'), TW + 40, 3), TX - 20, B0);
    let acc = 0, ly = Infinity;
    const segs = R.map(([a, , m, k]) => { const s = hide(add(stage, box(h('div', 'u2l6-seg ' + k, ''), TW, m * S), TX, B0 - (acc + m) * S)); ly = Math.min(B0 - (acc + m / 2) * S - 11, ly - 24); const lab = hide(add(stage, box(h('div', 'u2l6-segl ' + k, M(m)), 100, 22), TX + TW + 8, ly)); acc += m; return { s, lab }; });
    const gl = hide(add(stage, box(cbox('u2l6-glab', `gross pay <b>${M(1065.75)}</b>`), TW + 80, 36), TX - 40, B0 - acc * S - 44));
    const show = (i) => async (c) => { await c.fadeIn(cells[2 * i]); await c.fadeIn(cells[2 * i + 1]); await c.fadeIn(segs[i].s, 400, { from: 'translateY(-30px)' }); await c.fadeIn(segs[i].lab); };
    return [
      { cap: 'No day is over 8 h, so use the weekly rule: <b>44</b> regular hours and <b>2</b> overtime hours.', run: async (c) => { await Promise.all(hrs.slice(44).map((e) => pulse(c, e, 1.3))); await c.fadeIn(hl); } },
      { cap: `Regular pay: ${T('44\\times\\$19.00=\\$836.00')}.`, run: show(0) },
      { cap: `Overtime rate: ${T('1.5\\times\\$19.00=\\$28.50')}/h. Overtime pay: ${T('2\\times\\$28.50=\\$57.00')}.`, run: show(1) },
      { cap: `Night premium: ${T('20\\times\\$1.50=\\$30.00')}.`, run: show(2) },
      { cap: 'Tip-out share: <b>$142.75</b>, already in dollars.', run: async (c) => { await c.fadeIn(cells[6]); await c.fadeIn(segs[3].s, 400, { from: 'translateY(-30px)' }); await c.fadeIn(segs[3].lab); } },
      { cap: `Add everything: ${T('\\$836.00+\\$57.00+\\$30.00+\\$142.75=\\$1065.75')}.`, run: async (c) => { await c.pop(cells[7]); await c.pop(gl); } }
    ];
  }
};

mountExplainers({ tipCalc, shiftTips, tipBack, tipJar, tipOut, bonusChoice, shiftLine, premiumWrong, dangerPay, payStack });

/* ============ Stand Up Break! — tips, tip pools, bonuses and premiums, at the whiteboards ============ */
{
  const dd = (v) => grp(rnd(v, 2).toFixed(2), '\\,');
  const NAMES = ['Ava', 'Noah', 'Zara', 'Eli', 'Maya', 'Leo', 'Ines', 'Ravi', 'Tess', 'Omar', 'Kira', 'Finn', 'Lena', 'Jai'];
  standup('u2l6', {
    intro: 'Estimate first, then use your calculator. Show every line.',
    levels: {
      BEG: (r) => { // tips on a bill
        const bill = r.int(2400, 15800) / 100, p = r.pick([15, 18, 20]);
        const tip = bill * p / 100;
        return { text: `A restaurant bill is <b>$${bill.toFixed(2)}</b> before tax. Estimate a 15% tip in your head. Then find a <b>${p}%</b> tip.`, q: '',
          a: [`\\text{Estimate: 10\\% of about \\$${Math.round(bill)} is \\$${(Math.round(bill) / 10).toFixed(2)}; 15\\% is about \\$${(Math.round(bill) * 0.15).toFixed(2)}}`, `\\$${dd(bill)}\\times${p / 100}=${Math.abs(tip - rnd(tip)) < 1e-9 ? '' : rnd(tip, 4) + '\\approx'}\\$${dd(tip)}`] };
      },
      PRG: (r) => { // a pool shared by hours
        const names = r.shuffle(NAMES.slice()).slice(0, 3), hrs = names.map(() => r.int(3, 9)), tot = hrs.reduce((a, b) => a + b, 0), per = r.int(1200, 2600) / 100, pool = rnd(per * tot);
        return { text: `${names.join(', ')} share a tip pool of <b>$${dd(pool).replace('\\,', '\u202f')}</b> by hours worked: ${names.map((n, i) => `${n} <b>${hrs[i]} h</b>`).join(', ')}. Find each share.`, q: '',
          a: [`${hrs.join('+')}=${tot}\\text{ h}`, `\\$${dd(pool)}\\div${tot}=\\$${dd(per)}\\text{ per hour}`, names.map((n, i) => `\\text{${n}: }${hrs[i]}\\times\\$${dd(per)}=\\$${dd(hrs[i] * per)}`).join(';\\ ')] };
      },
      MAS: (r) => r.pick([
        () => { // shift premium week
          const who = r.pick(NAMES), wage = r.pick([16.5, 17.25, 18, 19.5, 20.75, 22.4]), hrs = r.pick([24, 28, 30, 32, 36]), ph = r.pick([6, 8, 9.5, 10, 12.5]), prem = r.pick([1.25, 1.5, 2, 2.25, 3]);
          const reg = rnd(hrs * wage), pp = rnd(ph * prem);
          return { text: `${who} earns <b>$${wage.toFixed(2)}/h</b>, plus a night premium of <b>$${prem.toFixed(2)}/h</b>. This week ${who} worked <b>${hrs} h</b> (no overtime), and <b>${ph}</b> of those hours were at night. Find the gross pay.`, q: '',
            a: [`${hrs}\\times\\$${wage.toFixed(2)}=\\$${dd(reg)}`, `${ph}\\times\\$${prem.toFixed(2)}=\\$${dd(pp)}`, `\\$${dd(reg)}+\\$${dd(pp)}=\\$${dd(reg + pp)}`] };
        },
        () => { // percent more per hour
          const wage = r.pick([18, 20, 22.5, 25, 28, 32]), p = r.pick([10, 15, 20, 25, 40]), h2 = r.pick([6, 8, 10, 12]);
          const nr = rnd(wage * (1 + p / 100)), day = rnd(h2 * nr), reg = rnd(h2 * wage);
          return { text: `A line worker earns <b>$${wage.toFixed(2)}/h</b>. For risky work, the pay is <b>${p}% more</b> per hour. Find the pay for <b>${h2} h</b> of risky work, and how much of it is danger pay.`, q: '',
            a: [`\\$${wage.toFixed(2)}\\times${1 + p / 100}=\\$${dd(nr)}\\text{/h}`, `${h2}\\times\\$${dd(nr)}=\\$${dd(day)}`, `${h2}\\times\\$${wage.toFixed(2)}=\\$${dd(reg)};\\ \\text{danger pay}=\\$${dd(day - reg)}`] };
        }
      ])()
    }
  });
}
