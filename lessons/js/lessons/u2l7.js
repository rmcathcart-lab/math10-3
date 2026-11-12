/* Math 10-3 · Unit 2 · Lesson 7 — Deductions and Net Pay: Reading a Pay Stub.
 * Explainers: the gross-pay bar that loses each deduction and shrinks to net pay; percent → decimal (the point hops
 * 2 places left); estimating with 1% blocks (Full notes); the deduction machine that fills a deduction table line by
 * line; Noah's two savings jars (gross vs net); the 100-square grid for percent of gross pay and finding a rate;
 * before-tax deductions cutting the gross bar down to taxable income; rounding each line first (Full notes); Lucas's
 * pay stub filling cell by cell; checking Aisha's stub line by line with ✓/✗ marks. Then the Stand Up Break and the
 * Math History animation (the "temporary" 1917 income tax). */
import { h, add, box, tex, svgEl, tween, stamp, stampIn, mountExplainers } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const rnd = (v, d = 2) => Math.round((v + (v >= 0 ? 1e-9 : -1e-9)) * 10 ** d) / 10 ** d;
const grp = (s, sep) => s.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
const m = (v, d = 2) => { const [i, f] = rnd(v, d).toFixed(d).split('.'); return '$' + (i.length > 3 ? grp(i, ' ') : i) + (f ? '.' + f : ''); };   // money text
const MT = (v, d = 2) => { const [i, f] = rnd(v, d).toFixed(d).split('.'); return '\\$' + (i.length > 3 ? grp(i, '\\,') : i) + (f ? '.' + f : ''); }; // money TeX
const raw = (v) => String(parseFloat(v.toPrecision(10)));          // what the calculator shows
const dec = (p) => String(parseFloat((p / 100).toPrecision(10)));    // 5.95 → "0.0595"
const lerp = (a, b, t) => a + (b - a) * t;
const cbox = (cls, html) => h('div', cls + ' u2l7-c', `<div>${html}</div>`);
const COL = ['#1f5bd6', '#12805a', '#c93a33', '#7b4fc4', '#c27a0e', '#0f8a8a'];
/** the rounding note for a raw calculator value: 20.336 → "20.33<u>6</u> → $20.34" (or null if it is already in cents) */
const roundNote = (v) => { const s = raw(v), k = s.indexOf('.'); if (k < 0 || s.length - k - 1 <= 2) return null; return `${s.slice(0, k + 3)}<u>${s[k + 3]}</u>${s.slice(k + 4)} → <b>${m(v)}</b>`; };

/* =====================================================================================
 * 1. Gross pay → net pay: the bar loses each deduction
 * ===================================================================================== */
const GN = {
  kai: { gross: 684, ded: [['CPP', 40.70], ['EI', 11.22], ['Income tax', 68.40], ['Apron', 6.50]], who: 'Kai’s', when: 'in two weeks' },
  demo: { gross: 500, ded: [['CPP', 29.75], ['EI', 8.20], ['Income tax', 50.00]], who: 'The', when: 'this week' }
};
const grossNet = {
  title: 'Gross pay shrinks to net pay',
  height: 390,
  minW: 900,
  choices: [{ v: 'demo', label: 'A first paycheque' }, { sep: 'Example 1 check:' }, { v: 'kai', label: 'Kai' }],
  ask: (k) => k === 'kai'
    ? 'Example 1: Kai’s gross pay is <b>$684.00</b>. His deductions are CPP $40.70, EI $11.22, income tax $68.40 and $6.50 for his apron. Find his total deductions and his net pay.'
    : 'A first paycheque: gross pay <b>$500.00</b>. Deductions: CPP $29.75, EI $8.20, income tax $50.00. What is the net pay?',
  make(stage, k, ex) {
    const d = GN[k], W = ex.W, L = 40, BW = W - 80, sc = BW / d.gross, Y = 50, BH = 76;
    const tot = rnd(d.ded.reduce((s, x) => s + x[1], 0)), net = rnd(d.gross - tot);
    add(stage, box(h('div', 'u2l7-ghost'), BW, BH), L, Y);
    const bar = hide(add(stage, box(h('div', 'u2l7-gbar'), BW, BH), L, Y));
    const lab = add(stage, box(cbox('u2l7-glab', `Gross pay <b>${m(d.gross)}</b>`), BW, BH), L, Y); hide(lab);
    const tray = add(stage, box(h('div', 'u2l7-tray', '<span>Deductions</span>'), BW, 96), L, 186);
    const n = d.ded.length, tw = Math.min(190, (BW - 150 - (n - 1) * 12) / n);
    let cum = 0;
    const parts = d.ded.map(([name, v], i) => {
      cum += v; const x1 = L + (d.gross - cum + v) * sc, x0 = L + (d.gross - cum) * sc;
      const ch = hide(add(stage, box(h('div', 'u2l7-chunk'), Math.max(4, x1 - x0), BH), x0, Y)); ch.style.background = COL[i];
      const tile = hide(add(stage, box(h('div', 'u2l7-tile', `<small>${name}</small><b>${m(v)}</b>`), tw, 66), L + 138 + i * (tw + 12), 201));
      tile.style.borderColor = COL[i];
      return { name, v, ch, tile, left: rnd(d.gross - cum), w: x0 - L };
    });
    const sum = hide(add(stage, box(cbox('u2l7-eq', `Total deductions ${T('=' + d.ded.map((x) => MT(x[1])).join('+') + '=' + MT(tot))}`), BW, 44), L, 290));
    const neq = hide(add(stage, box(cbox('u2l7-eq net', `Net pay ${T('=' + MT(d.gross) + '-' + MT(tot) + '=' + MT(net))}`), BW, 44), L, 336));
    const steps = [{ cap: `${d.who} <b>gross pay</b>: everything earned ${d.when}, <b>${m(d.gross)}</b>.`, run: async (c) => { await c.fadeIn(bar); await c.fadeIn(lab); } }];
    parts.forEach((p, i) => steps.push({
      cap: `${i === 0 ? 'Before payday, the deductions come off. ' : ''}<b>${p.name}</b> comes off: ${m(p.v)}.`,
      run: async (c) => {
        await c.anim(p.ch, [{ opacity: 0 }, { opacity: 1 }], 250);
        const w0 = parseFloat(bar.style.width);
        await Promise.all([
          tween(c, 650, (t) => { bar.style.width = lerp(w0, p.w, t) + 'px'; lab.style.width = lerp(w0, p.w, t) + 'px'; }),
          c.anim(p.ch, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(150px) scaleY(.5)' }], 650)
        ]);
        lab.innerHTML = `<div>Left: <b>${m(p.left)}</b></div>`;
        await c.pop(p.tile);
      }
    }));
    steps.push({ cap: `Add <b>every</b> deduction: total deductions = <b>${m(tot)}</b>.`, run: (c) => c.fadeIn(sum) });
    steps.push({ cap: `What is left is the <b>net pay</b>: ${m(d.gross)} − ${m(tot)} = <b>${m(net)}</b>. That is the money that goes into the bank account.`,
      run: async (c) => { bar.classList.add('net'); lab.innerHTML = `<div>Net pay <b>${m(net)}</b></div>`; await c.pop(lab); await c.fadeIn(neq); } });
    return steps;
  }
};

/* =====================================================================================
 * 2. Percent → decimal: the point hops 2 places left
 * ===================================================================================== */
const PD = {
  cpp: { p: '5.95', use: 'CPP at 5.95%: gross pay × <b>0.0595</b>' },
  ei: { p: '1.64', use: 'EI at 1.64%: gross pay × <b>0.0164</b>' },
  tax: { p: '15', use: 'income tax at 15%: gross pay × <b>0.15</b>' },
  six: { p: '6', use: 'Noah’s income tax at 6%: gross pay × <b>0.06</b>' },
  dues: { p: '1.5', use: 'union dues at 1.5%: gross pay × <b>0.015</b>' }
};
const pctDecimal = {
  title: 'Percent to decimal: hop 2 places left',
  height: 350,
  minW: 900,
  choices: [{ v: 'cpp', label: '5.95% (CPP)' }, { v: 'ei', label: '1.64% (EI)' }, { v: 'tax', label: '15% (tax)' }, { v: 'six', label: '6%' }, { v: 'dues', label: '1.5% (dues)' }],
  ask: (k) => `Change <b>${PD[k].p}%</b> to a decimal.`,
  make(stage, k, ex) {
    const d = PD[k], W = ex.W, s = d.p, digits = s.replace('.', '').split(''), n = digits.length;
    const p = s.includes('.') ? s.indexOf('.') : s.length;   // digits before the point
    const p2 = p - 2, iMin = Math.min(0, p2 - 1), S = 76, Y = 34;
    const span = (n - iMin) * S, X0 = (W - span) / 2 - 40 - iMin * S;
    const cx = (i) => X0 + i * S, bx = (q) => X0 + q * S;
    const svg = add(stage, svgEl('svg', { width: W, height: 350, class: 'u2l7-svg' }), 0, 0);
    // place-value slots
    for (let i = iMin; i < n; i++) svgEl('rect', { x: cx(i) + 4, y: Y + 6, width: S - 8, height: 92, rx: 10, fill: i < 0 ? '#fbf6ec' : '#fff', stroke: '#d8cdb8', 'stroke-width': 2, 'stroke-dasharray': i < 0 ? '6 5' : '' }, svg);
    digits.forEach((g, i) => add(stage, box(h('div', 'u2l7-dg', g), S, 104), cx(i), Y));
    const pct = add(stage, box(h('div', 'u2l7-dg pc', '%'), S, 104), cx(n) + 4, Y);
    const zeros = [];
    for (let i = p2; i < 0; i++) zeros.push(hide(add(stage, box(h('div', 'u2l7-dg z', '0'), S, 104), cx(i), Y)));
    const lead = hide(add(stage, box(h('div', 'u2l7-dg z', '0'), S, 104), cx(p2 - 1), Y));
    const pt = add(stage, box(h('div', 'u2l7-pt'), 18, 18), bx(p) - 9, Y + 80);
    if (!s.includes('.')) pt.style.opacity = 0.35;
    const arc = (q, lab) => {
      const x1 = bx(q), x0 = bx(q - 1), g = svgEl('g', { opacity: 0 }, svg);
      svgEl('path', { d: `M${x1} ${Y + 108} Q${(x0 + x1) / 2} ${Y + 160} ${x0 + 6} ${Y + 110}`, fill: 'none', stroke: '#c27a0e', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
      svgEl('path', { d: `M${x0 + 6} ${Y + 110} l12 2 M${x0 + 6} ${Y + 110} l3 11`, stroke: '#c27a0e', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
      const t = svgEl('text', { x: (x0 + x1) / 2, y: Y + 162, 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 800, fill: '#c27a0e' }, g); t.textContent = lab;
      return g;
    };
    const a1 = arc(p, '1'), a2 = arc(p - 1, '2');
    const ans = dec(Number(s)), one = String(parseFloat((Number(s) / 10).toPrecision(10))), oneP = String(parseFloat((Number(s) * 10).toPrecision(10)));
    const eq = hide(add(stage, box(cbox('u2l7-eq big', T(`${s}\\%=${s}\\div100=${ans}`)), W - 80, 50), 40, Y + 176));
    const lcd = hide(add(stage, box(h('div', 'u2l7-lcd', `<div class="e">${s}÷100</div><div class="r">${ans}</div>`), 260, 70), 60, 266));
    const wrong = hide(add(stage, box(cbox('u2l7-wrong', `Only 1 hop: <b>${one.startsWith('.') ? '0' + one : one}</b> = ${oneP}%`), 360, 58), W - 540, 272));
    const st = hide(stamp(stage, 'Too big ✗', { ok: false, x: W - 105, y: 301, rotate: 8 }));
    const hop = (q) => (c) => tween(c, 520, (t) => { pt.style.left = lerp(bx(q) - 9, bx(q - 1) - 9, t) + 'px'; pt.style.top = (Y + 80 + Math.sin(t * Math.PI) * 26) + 'px'; });
    const steps = [
      { cap: `<b>Percent</b> means “out of 100”: ${T(`${s}\\%=${s}\\div100`)}.`, run: (c) => c.anim(pct, [{ opacity: 1 }, { opacity: 0.25 }], 400) },
      { cap: `Dividing by 100 moves the decimal point <b>2 places left</b>. Hop 1…`, run: async (c) => { pt.style.opacity = 1; await c.anim(a1, [{ opacity: 0 }, { opacity: 1 }], 250); await hop(p)(c); } },
      { cap: `…hop 2.`, run: async (c) => { await c.anim(a2, [{ opacity: 0 }, { opacity: 1 }], 250); await hop(p - 1)(c); } },
      { cap: zeros.length ? `Fill the empty place with a <b>0</b>, and write a 0 in front of the point: <b>${ans}</b>.` : `Write a 0 in front of the point: <b>${ans}</b>.`,
        run: async (c) => { await c.anim(pct, [{ opacity: 0.25 }, { opacity: 0 }], 250); for (const z of zeros) await c.pop(z); await c.pop(lead); await c.fadeIn(eq); } },
      { cap: `Check on the calculator: ${s} ÷ 100 = ${ans} ✓`, run: (c) => c.pop(lcd) },
      { cap: `<b>Watch out:</b> one hop gives ${one.startsWith('.') ? '0' + one : one}. That is ${oneP}%, ten times too big! So ${d.use}.`, run: async (c) => { await c.fadeIn(wrong); await stampIn(c, st); } }
    ];
    return steps;
  }
};

/* =====================================================================================
 * 3. Estimate with 1% blocks (Full notes)
 * ===================================================================================== */
const OP = {
  t720: { gross: 720, who: 'A pay of $720.00' },
  hana: { gross: 1240, who: 'Hana’s gross pay, $1 240.00' }
};
const onePercent = {
  title: 'Estimate with 1%: 100 little blocks',
  height: 390,
  minW: 900,
  choices: [{ v: 't720', label: '$720 (the tip)' }, { sep: 'Example 2 estimate:' }, { v: 'hana', label: 'Hana' }],
  ask: (k) => `Estimate CPP (5.95%), EI (1.64%) and a 15% income tax on <b>${m(OP[k].gross)}</b>.`,
  make(stage, k, ex) {
    const d = OP[k], g = d.gross, one = g / 100, Q = 29, G = 3, X = 36, Y = 30;
    const sq = [];
    for (let i = 0; i < 100; i++) sq.push(add(stage, box(h('div', 'u2l7-sq'), Q, Q), X + (i % 10) * (Q + G), Y + Math.floor(i / 10) * (Q + G)));
    const grid = sq; grid.forEach((e) => { e.style.opacity = 0; });
    const tag = hide(add(stage, box(cbox('u2l7-gtag', `${m(g)} = 100 blocks`), 316, 34), X, Y + 10 * (Q + G) + 4));
    const R = X + 360, RW = ex.W - R - 30;
    const line = (y, html, cls = '') => hide(add(stage, box(cbox('u2l7-oline ' + cls, html), RW, 54), R, y));
    const cpp = rnd(g * 0.0595), ei = rnd(g * 0.0164), tax = rnd(g * 0.15);
    const L1 = line(10, `1% of ${m(g)}: move the point 2 places left → <b>${m(one)}</b> a block`, 'one');
    const L2 = line(76, `CPP ≈ 6 blocks: ${T(`6\\times${MT(one)}\\approx${MT(Math.round(6 * one), 0)}`)}`, 'cpp');
    const L3 = line(142, `EI &lt; 2 blocks: less than ${T(MT(2 * one))}`, 'ei');
    const L4 = line(208, `Tax 15% = 15 blocks: ${T(`15\\times${MT(one)}=${MT(15 * one)}`)}`, 'tax');
    const L5 = line(286, `Exact: CPP <b>${m(cpp)}</b> ≈ ${m(Math.round(6 * one), 0)} ✓ &nbsp; EI <b>${m(ei)}</b> &lt; ${m(2 * one)} ✓ &nbsp; tax <b>${m(tax)}</b> ✓`, 'ok');
    const paint = (from, to, cls) => (c) => tween(c, 600, (t) => { const upto = from + Math.round((to - from) * t); for (let i = from; i < to; i++) sq[i].classList.toggle(cls, i < upto); });
    return [
      { cap: `Cut ${m(g)} into <b>100 equal blocks</b>. Each block is <b>1%</b>.`, run: async (c) => { await tween(c, 600, (t) => { const u = Math.round(100 * t); sq.forEach((e, i) => { e.style.opacity = i < u ? 1 : 0; }); }); await c.fadeIn(tag); } },
      { cap: `One block = 1% of ${m(g)} = <b>${m(one)}</b> (the point moves 2 places left).`, run: async (c) => { sq[0].classList.add('one'); await c.fadeIn(L1); } },
      { cap: `CPP is about 6%: <b>6 blocks</b>, about ${m(Math.round(6 * one), 0)}.`, run: async (c) => { await paint(0, 6, 'cpp')(c); await c.fadeIn(L2); } },
      { cap: `EI is less than 2%: less than <b>2 blocks</b>, so less than ${m(2 * one)}.`, run: async (c) => { await paint(10, 12, 'ei')(c); await c.fadeIn(L3); } },
      { cap: `A 15% tax is <b>15 blocks</b>: ${m(15 * one)}.`, run: async (c) => { await paint(20, 35, 'tax')(c); await c.fadeIn(L4); } },
      { cap: `The exact answers are close to the estimates ✓. If yours is far off, check the decimal.`, run: (c) => c.fadeIn(L5) }
    ];
  }
};

/* =====================================================================================
 * 4. The deduction machine fills the table line by line (Examples 2, 3, 4)
 * ===================================================================================== */
const DM = {
  hana: { ex: 'Example 2', gross: 1240, rows: [['CPP', 5.95], ['EI', 1.64], ['Income tax', 15]] },
  noah: { ex: 'Example 3', gross: 234, hours: 18, wage: 13, rows: [['CPP', 5.95], ['EI', 1.64], ['Income tax', 6]] },
  sofia: { ex: 'Example 4', gross: 960, rows: [['CPP', 5.95], ['EI', 1.64], ['Income tax', 16], ['Health plan', null, 14.25], ['Safety boots', null, 20.00], ['Food bank', null, 5.00]] }
};
const deductMachine = {
  title: 'The deduction machine',
  height: 450,
  minW: 940,
  choices: [{ sep: 'Check:' }, { v: 'hana', label: 'Example 2: Hana' }, { v: 'noah', label: 'Example 3(a): Noah' }, { v: 'sofia', label: 'Example 4: Sofia' }],
  ask: (k) => ({
    hana: 'Example 2: Hana’s gross pay is <b>$1 240.00</b>. CPP 5.95%, EI 1.64%, income tax 15%. Find each deduction, the total and her net pay.',
    noah: 'Example 3(a): Noah works <b>18 h</b> at <b>$13.00/h</b>. CPP 5.95%, EI 1.64%, income tax 6%. Find his gross pay, each deduction and his net pay.',
    sofia: 'Example 4: Sofia’s gross pay is <b>$960.00</b>. CPP 5.95%, EI 1.64%, tax 16%, health plan $14.25, boots $20.00, food bank $5.00. Find her net pay.'
  })[k],
  make(stage, k, ex) {
    const d = DM[k], W = ex.W, g = d.gross;
    const rows = d.rows.map(([name, r, fixed]) => { const v = r != null ? g * r / 100 : fixed; return { name, r, fixed, v, cents: rnd(v) }; });
    const tot = rnd(rows.reduce((s, x) => s + x.cents, 0)), net = rnd(g - tot);
    // the machine (left)
    const MX = 24, MW = 420;
    add(stage, box(h('div', 'u2l7-mach', '<div class="hd">Deduction machine</div>'), MW, 300), MX, 70);
    const gin = add(stage, box(cbox('u2l7-min', `gross pay <b>${d.hours ? '?' : m(g)}</b>`), MW - 40, 48), MX + 20, 120);
    const rin = hide(add(stage, box(cbox('u2l7-min r', ''), MW - 40, 48), MX + 20, 178));
    const lcd = hide(add(stage, box(h('div', 'u2l7-lcd', '<div class="e"></div><div class="r"></div>'), MW - 120, 72), MX + 60, 238));
    const rn = hide(add(stage, box(cbox('u2l7-rnote', ''), MW - 40, 40), MX + 20, 320));
    const gw = d.hours ? hide(add(stage, box(cbox('u2l7-eq', T(`${d.hours}\\times${MT(d.wage)}=${MT(g)}`)), MW, 44), MX, 18)) : null;
    // the table (right)
    const TX = MX + MW + 40, TW = W - TX - 20, rh = Math.min(44, 360 / (rows.length + 3));
    const tb = add(stage, box(h('table', 'u2l7-tbl st'), TW, null), TX, 18);
    tb.innerHTML = `<tr><th>Deduction</th><th>Rate</th><th>Amount</th></tr>` + rows.map((x) => `<tr><td>${x.name}</td><td>${x.r != null ? x.r + '%' : ''}</td><td class="a"></td></tr>`).join('')
      + `<tr class="tot"><td colspan="2">Total deductions</td><td class="a"></td></tr><tr class="tot net"><td colspan="2">Net pay</td><td class="a"></td></tr>`;
    tb.querySelectorAll('td, th').forEach((e) => { e.style.height = rh + 'px'; });
    const cells = [...tb.querySelectorAll('td.a')];
    const trs = [...tb.querySelectorAll('tr')].slice(1);
    const put = async (c, i, html) => { trs.forEach((t) => t.classList.remove('hl')); trs[i].classList.add('hl'); cells[i].innerHTML = `<span class="v">${html}</span>`; await c.pop(cells[i].firstChild); };
    const steps = [];
    if (d.hours) steps.push({ cap: `First the gross pay: hours × rate = ${d.hours} × ${m(d.wage)} = <b>${m(g)}</b>.`, run: async (c) => { await c.fadeIn(gw); gin.innerHTML = `<div>gross pay <b>${m(g)}</b></div>`; await c.pop(gin); } });
    rows.forEach((x, i) => {
      if (x.r == null) return;
      const note = roundNote(x.v);
      steps.push({
        cap: note ? `${x.name}: ${m(g)} × ${dec(x.r)} = ${raw(x.v)} → round to the cent: <b>${m(x.cents)}</b>.` : `${x.name}: ${m(g)} × ${dec(x.r)} = <b>${m(x.cents)}</b>.`,
        run: async (c) => {
          rin.innerHTML = `<div>× <b>${dec(x.r)}</b> &nbsp;<small>(${x.r}% as a decimal)</small></div>`; await c.fadeIn(rin);
          lcd.innerHTML = `<div class="e">${g}×${dec(x.r)}</div><div class="r">${raw(x.v)}</div>`; await c.pop(lcd);
          if (note) { rn.innerHTML = `<div>${note}</div>`; await c.fadeIn(rn); } else rn.style.opacity = 0;
          await put(c, i, m(x.cents));
        }
      });
    });
    const fixed = rows.map((x, i) => [x, i]).filter(([x]) => x.r == null);
    if (fixed.length) steps.push({ cap: `The other deductions are <b>fixed amounts</b>: they go straight in.`, run: async (c) => { rn.style.opacity = 0; for (const [x, i] of fixed) await put(c, i, m(x.cents)); } });
    steps.push({ cap: `Add the <b>rounded</b> lines: total deductions = <b>${m(tot)}</b>.`, run: async (c) => { rn.style.opacity = 0; await put(c, rows.length, m(tot)); } });
    steps.push({ cap: `Net pay = ${m(g)} − ${m(tot)} = <b>${m(net)}</b>.`, run: (c) => put(c, rows.length + 1, m(net)) });
    return steps;
  }
};

/* =====================================================================================
 * 5. Noah's scooter: two jars, gross vs net (Example 3(b))
 * ===================================================================================== */
const scooter = {
  title: 'Two jars: gross pay or net pay?',
  height: 420,
  minW: 900,
  choices: [{ sep: 'Example 3(b) check:' }, { v: 'noah', label: 'Noah’s e-scooter' }],
  ask: 'Example 3(b): Noah saves all his net pay, <b>$202.20</b> a week (his gross pay is $234.00). How many weeks until he has <b>$650.00</b>?',
  make(stage, k, ex) {
    const W = ex.W, goal = 650, gw = 234, nw = 202.20, TOP = 900, JH = 300, JY = 64, BOT = JY + JH, s = JH / TOP;
    const yOf = (v) => BOT - v * s;
    const jars = [{ x: W / 2 - 300, wk: gw, name: 'gross pay', cls: 'g' }, { x: W / 2 + 40, wk: nw, name: 'net pay', cls: 'n' }];
    jars.forEach((j) => {
      add(stage, box(h('div', 'u2l7-jar ' + j.cls), 200, JH), j.x, JY);
      add(stage, box(cbox('u2l7-jlab ' + j.cls, `<b>${m(j.wk)}</b> a week<br><small>${j.name}</small>`), 220, 50), j.x - 10, 8);
      j.blocks = [1, 2, 3, 4].map((w) => { const b = hide(add(stage, box(h('div', 'u2l7-jblk ' + j.cls, `week ${w}`), 188, j.wk * s - 3), j.x + 6, yOf(j.wk * w) + 1)); return b; });
      j.tot = hide(add(stage, box(cbox('u2l7-jtot', ''), 120, 36), j.x + 206, 0));
    });
    const gl = hide(add(stage, box(h('div', 'u2l7-goal', '<span>goal<br>$650.00</span>'), 660, 4), W / 2 - 330, yOf(goal)));
    const ghost = hide(add(stage, box(cbox('u2l7-jnote', 'Not real money!'), 200, 34), jars[0].x, BOT + 10));
    const st1 = hide(stamp(stage, '3 weeks? ✗', { ok: false, x: jars[0].x + 100, y: yOf(500), rotate: -8 }));
    const short = hide(add(stage, box(cbox('u2l7-short', `short by ${m(goal - 3 * nw)}`), 170, 36), jars[1].x + 206, yOf(goal) - 2));
    const st2 = hide(stamp(stage, '4 weeks ✓', { ok: true, x: jars[1].x + 100, y: BOT + 26, rotate: -4 }));
    const week = (w) => async (c) => {
      for (const j of jars) {
        await c.fadeIn(j.blocks[w - 1], 300, { from: 'translateY(-40px)' });
        const y = yOf(j.wk * w) - 18, gy = yOf(goal);
        j.tot.innerHTML = `<div>${m(j.wk * w)}</div>`; j.tot.style.top = (Math.abs(y + 18 - gy) < 26 ? gy - 46 : y) + 'px'; j.tot.style.opacity = 1;
      }
    };
    return [
      { cap: `The goal is <b>$650.00</b>. One jar fills with gross pay, the other with the money Noah really gets.`, run: (c) => c.fadeIn(gl) },
      { cap: `Week 1: ${m(gw)} in the gross jar, but only <b>${m(nw)}</b> really goes in.`, run: week(1) },
      { cap: `Week 2: ${m(2 * gw)} vs <b>${m(2 * nw)}</b>.`, run: week(2) },
      { cap: `Week 3: the gross jar passes $650 (${m(3 * gw)})… but that is not real money. The real jar has only <b>${m(3 * nw)}</b>.`,
        run: async (c) => { await week(3)(c); await c.fadeIn(ghost); await stampIn(c, st1); await c.fadeIn(short); } },
      { cap: `Week 4: <b>${m(4 * nw)}</b>, enough ✓. ${T('\\$650.00\\div\\$202.20\\approx3.2')}, so round <b>up</b>: it takes <b>4 weeks</b>.`,
        run: async (c) => { short.style.opacity = 0; jars[0].tot.style.opacity = 0.35; await c.fadeIn(jars[1].blocks[3], 300, { from: 'translateY(-40px)' }); const j = jars[1]; j.tot.innerHTML = `<div>${m(4 * nw)}</div>`; j.tot.style.top = (yOf(4 * nw) - 18) + 'px'; await stampIn(c, st2); } }
    ];
  }
};

/* =====================================================================================
 * 6. Percent of gross pay and finding a rate: the 100-square grid (Example 5)
 * ===================================================================================== */
const pctGrid = {
  title: 'Percent of gross pay: 100 squares',
  height: 400,
  minW: 900,
  choices: [{ sep: 'Example 5 check:' }, { v: 'a', label: '(a) Sofia keeps…' }, { v: 'b', label: '(b) Marcus’s tax rate' }],
  ask: (k) => k === 'a'
    ? 'Example 5(a): Sofia’s gross pay is <b>$960.00</b> and her net pay is <b>$694.29</b> (deductions $265.71). What percent does she take home? What percent goes to deductions?'
    : 'Example 5(b): Marcus pays income tax of <b>$97.20</b> on gross pay of <b>$810.00</b>. What is his tax rate?',
  make(stage, k, ex) {
    const W = ex.W, Q = 30, G = 3, X = 40, Y = 22;
    const sq = [];
    for (let i = 0; i < 100; i++) { const e = add(stage, box(h('div', 'u2l7-sq g'), Q, Q), X + (i % 10) * (Q + G), Y + Math.floor(i / 10) * (Q + G)); e.innerHTML = '<i class="keep"></i><i class="ded"></i>'; sq.push(e); }
    // keep fills a square from the left, ded from the right, so a square can be part kept, part deducted (72.3%)
    const fill = (from, to, cls) => (c) => tween(c, 900, (t) => { const u = from + (to - from) * t; for (let i = Math.floor(from); i < Math.ceil(to); i++) { const f = sq[i].querySelector('.' + cls); const w = Math.max(0, Math.min(1, Math.min(u, i + 1) - Math.max(from, i))); f.style.width = (w * 100) + '%'; } });
    const R = X + 380, RW = W - R - 30;
    const line = (y, html, cls = '') => hide(add(stage, box(cbox('u2l7-oline ' + cls, html), RW, 56), R, y));
    const lg = add(stage, box(h('div', 'u2l7-sqlab'), 330, 30), X, Y + 10 * (Q + G) + 6);
    if (k === 'a') {
      const g = 960, n = 694.29, dd = 265.71, tp = rnd(n / g * 100, 1), dp = rnd(100 - tp, 1);
      lg.innerHTML = `${m(g)} = 100% &nbsp;·&nbsp; 1 square = ${m(g / 100)}`;
      const L1 = line(20, `take-home: ${T(`${MT(n)}\\div${MT(g)}=${raw(n / g).slice(0, 6)}`)}`);
      const L2 = line(86, `${T(`${raw(n / g).slice(0, 6)}\\times100\\approx${tp}\\%`)} <b>kept</b>`, 'keep');
      const L3 = line(152, `deductions: ${T(`100\\%-${tp}\\%=${dp}\\%`)}`, 'ded');
      const L4 = line(230, `check: ${T(`${MT(dd)}\\div${MT(g)}\\times100\\approx${rnd(dd / g * 100, 1)}\\%`)} ✓`, 'ok');
      return [
        { cap: `Sofia’s gross pay, <b>${m(g)}</b>, is the whole: <b>100%</b>. Each square is 1%.`, run: (c) => c.fadeIn(lg) },
        { cap: `Take-home percent = net ÷ gross × 100 = <b>${tp}%</b>.`, run: async (c) => { await c.fadeIn(L1); await fill(0, tp, 'keep')(c); await c.fadeIn(L2); } },
        { cap: `The rest goes to deductions: 100% − ${tp}% = <b>${dp}%</b>.`, run: async (c) => { await fill(tp, 100, 'ded')(c); await c.fadeIn(L3); } },
        { cap: `Check with the deductions: ${m(dd)} ÷ ${m(g)} × 100 ≈ ${dp}% ✓. The two percents add to <b>100%</b>.`, run: (c) => c.fadeIn(L4) }
      ];
    }
    const g = 810, t = 97.2, r = rnd(t / g, 4);
    lg.innerHTML = `${m(g)} = 100% &nbsp;·&nbsp; 1 square = ${m(g / 100)}`;
    const L1 = line(20, `rate ${T(`=\\dfrac{${MT(t)}}{${MT(g)}}\\times100`)}`);
    const L2 = line(96, `${T(`${MT(t)}\\div${MT(g)}=${r}`)}`);
    const L3 = line(162, `${T(`${r}\\times100=${rnd(r * 100, 2)}\\%`)} <b>tax</b>`, 'ded');
    const L4 = line(240, `check: ${T(`${MT(g)}\\times${r}=${MT(g * r)}`)} ✓`, 'ok');
    return [
      { cap: `Marcus’s gross pay, <b>${m(g)}</b>, is 100%. Each square is 1%, or ${m(g / 100)}.`, run: (c) => c.fadeIn(lg) },
      { cap: `Rate = deduction ÷ the pay it was taken from × 100.`, run: (c) => c.fadeIn(L1) },
      { cap: `${m(t)} ÷ ${m(g)} = <b>${r}</b>.`, run: (c) => c.fadeIn(L2) },
      { cap: `× 100: <b>${rnd(r * 100, 2)}%</b>. The tax fills ${rnd(r * 100, 2)} squares: 12 × ${m(g / 100)} = ${m(t)}.`, run: async (c) => { await fill(0, r * 100, 'ded')(c); await c.fadeIn(L3); } },
      { cap: `Check: ${m(g)} × ${r} = ${m(g * r)} ✓. Marcus pays income tax at <b>12%</b>.`, run: (c) => c.fadeIn(L4) }
    ];
  }
};

/* =====================================================================================
 * 7. Before-tax deductions: the gross bar is cut down to taxable income (Example 6)
 * ===================================================================================== */
const taxable = {
  title: 'Before-tax deductions and taxable income',
  height: 430,
  minW: 940,
  choices: [{ sep: 'Example 6 check:' }, { v: 'a', label: '(a) Taxable income and net pay' }, { v: 'b', label: '(b) Tax saved' }],
  ask: (k) => k === 'a'
    ? 'Example 6(a): Ethan’s gross pay is <b>$2 080.00</b>. Before tax: union dues 1.5% and $50.00 RRSP. CPP 5.95%, EI 1.64%, income tax 18% of taxable income. Find his taxable income and net pay.'
    : 'Example 6(b): How much less income tax does Ethan pay because of his before-tax deductions?',
  make(stage, k, ex) {
    const W = ex.W, g = 2080, dues = rnd(g * 0.015), rrsp = 50, ti = rnd(g - dues - rrsp);
    const cpp = rnd(g * 0.0595), ei = rnd(g * 0.0164), tax = rnd(ti * 0.18), tot = rnd(dues + rrsp + cpp + ei + tax), net = rnd(g - tot);
    const L = 150, BW = W - L - 30, sc = BW / g, Y1 = 30, Y2 = 128, BH = 58;
    add(stage, box(cbox('u2l7-blab', 'gross pay'), 120, BH), 20, Y1);
    const gb = add(stage, box(cbox('u2l7-bar gross', `<b>${m(g)}</b>`), BW, BH), L, Y1);
    const c1 = hide(add(stage, box(h('div', 'u2l7-cut'), dues * sc, BH), L, Y1)); c1.style.background = COL[3];
    const c2 = hide(add(stage, box(h('div', 'u2l7-cut'), rrsp * sc, BH), L + dues * sc, Y1)); c2.style.background = COL[4];
    const cl = hide(add(stage, box(cbox('u2l7-cutlab', `dues ${m(dues)} + RRSP ${m(rrsp)}`), 300, 30), L - 10, Y1 + BH + 4));
    const tl = hide(add(stage, box(cbox('u2l7-blab', 'taxable income'), 120, BH), 20, Y2));
    const tb = hide(add(stage, box(cbox('u2l7-bar taxable', `<b>${m(ti)}</b>`), ti * sc, BH), L + (dues + rrsp) * sc, Y2));
    if (k === 'b') {
      [c1, c2, tl, tb].forEach((e) => { e.style.opacity = 1; });
      const XB = 170, bw2 = (W - XB - 200);
      const full = g * 0.18, sav = rnd(full - tax);
      const r1 = hide(add(stage, box(cbox('u2l7-tbar full', `tax on all the gross: ${T(`${MT(g)}\\times0.18=${MT(full)}`)}`), bw2, 58), XB, 220));
      const r2 = hide(add(stage, box(cbox('u2l7-tbar', `tax on taxable income: <b>${m(tax)}</b>`), bw2 * tax / full, 58), XB, 290));
      const gap = hide(add(stage, box(cbox('u2l7-gap', `${m(sav)}`), bw2 - bw2 * tax / full + 90, 58), XB + bw2 * tax / full + 6, 290));
      const st = hide(stamp(stage, `saves ${m(sav)}`, { ok: true, x: W - 230, y: 384, rotate: -5, size: 'lg' }));
      return [
        { cap: `What if there were <b>no</b> before-tax deductions? Tax on all of his gross pay: ${m(g)} × 0.18 = <b>${m(full)}</b>.`, run: (c) => c.fadeIn(r1) },
        { cap: `His real tax is on the smaller taxable income: <b>${m(tax)}</b>.`, run: (c) => c.fadeIn(r2) },
        { cap: `${m(full)} − ${m(tax)} = <b>${m(sav)}</b>. He pays ${m(sav)} less income tax.`, run: async (c) => { await c.fadeIn(gap); await stampIn(c, st); } }
      ];
    }
    const TY = 228, tw = (W - 60) / 5 - 10;
    const tiles = [['Union dues', dues, 3, 'before tax'], ['RRSP', rrsp, 4, 'before tax'], ['CPP', cpp, 0, 'on gross'], ['EI', ei, 1, 'on gross'], ['Income tax', tax, 2, 'on taxable']].map(([n, v, ci, why], i) => {
      const e = hide(add(stage, box(h('div', 'u2l7-tile', `<small>${n}</small><b>${m(v)}</b><em>${why}</em>`), tw, 84), 30 + i * (tw + 10), TY)); e.style.borderColor = COL[ci]; return e; });
    const tg1 = hide(add(stage, box(cbox('u2l7-btag', 'CPP, EI: 5.95%, 1.64% of the <b>gross</b>'), 360, 30), W - 30 - 360, Y1 + BH + 4));
    const tg2 = hide(add(stage, box(cbox('u2l7-btag t', 'income tax: 18% of the <b>taxable income</b>'), 380, 30), W - 30 - 380, Y2 + BH + 4));
    const sum = hide(add(stage, box(cbox('u2l7-eq', `Total ${T(`=${MT(dues)}+${MT(rrsp)}+${MT(cpp)}+${MT(ei)}+${MT(tax)}=${MT(tot)}`)}`), W - 60, 44), 30, 326));
    const neq = hide(add(stage, box(cbox('u2l7-eq net', `Net pay ${T(`=${MT(g)}-${MT(tot)}=${MT(net)}`)}`), W - 60, 44), 30, 374));
    return [
      { cap: `Step 1: the before-tax deductions: union dues ${m(g)} × 0.015 = <b>${m(dues)}</b>, and RRSP <b>${m(rrsp)}</b>.`, run: async (c) => { await c.pop(c1); await c.pop(c2); await c.fadeIn(cl); await c.pop(tiles[0]); await c.pop(tiles[1]); } },
      { cap: `Step 2: cut them off. Taxable income = ${m(g)} − ${m(dues)} − ${m(rrsp)} = <b>${m(ti)}</b>.`, run: async (c) => { await c.fadeIn(tl); await c.fadeIn(tb, 500, { from: `translateY(${Y1 - Y2}px)` }); } },
      { cap: `Step 3: CPP and EI on the <b>gross</b>: CPP ${m(cpp)}; EI = ${raw(g * 0.0164)} ≈ <b>${m(ei)}</b>.`, run: async (c) => { await c.fadeIn(tg1); await c.pop(tiles[2]); await c.pop(tiles[3]); } },
      { cap: `Income tax on the <b>taxable income</b>: ${m(ti)} × 0.18 = ${raw(ti * 0.18)} ≈ <b>${m(tax)}</b>.`, run: async (c) => { await c.fadeIn(tg2); await c.pop(tiles[4]); } },
      { cap: `Step 4: add <b>all five</b> deductions (the before-tax ones too): <b>${m(tot)}</b>.`, run: (c) => c.fadeIn(sum) },
      { cap: `Step 5: net pay = ${m(g)} − ${m(tot)} = <b>${m(net)}</b>.`, run: (c) => c.fadeIn(neq) }
    ];
  }
};

/* =====================================================================================
 * 8. Why round each line first? (Full notes)
 * ===================================================================================== */
const roundFirst = {
  title: 'Round each line, then add',
  height: 360,
  minW: 860,
  ask: 'Example 6: should Ethan’s total deductions be <b>$598.85</b> or <b>$598.86</b>?',
  make(stage, k, ex) {
    const W = ex.W, lines = [['Union dues', 31.20], ['RRSP', 50.00], ['CPP', 123.76], ['EI', 2080 * 0.0164], ['Income tax', 1998.80 * 0.18]];
    const CW = 330, xa = W / 2 - CW - 30, xb = W / 2 + 30;
    const col = (x, title, f) => {
      add(stage, box(cbox('u2l7-rfh', title), CW, 40), x, 10);
      return lines.map(([n, v], i) => add(stage, box(h('div', 'u2l7-rfl', `<span class="n">${n}</span><span class="v">${f(v)}</span>`), CW, 38), x, 56 + i * 40));
    };
    const la = col(xa, 'Not rounded', (v) => (Math.abs(v * 100 - Math.round(v * 100)) < 1e-6 ? v.toFixed(2) : raw(v)));
    col(xb, 'Rounded to the cent first', (v) => m(v).slice(1));
    const sa = lines.reduce((s, x) => s + x[1], 0), sb = rnd(lines.reduce((s, x) => s + rnd(x[1]), 0));
    const ta = hide(add(stage, box(h('div', 'u2l7-rfl tot', `<span class="n">total</span><span class="v">${raw(sa)} ≈ ${m(sa).slice(1)}</span>`), CW, 42), xa, 262));
    const tb = hide(add(stage, box(h('div', 'u2l7-rfl tot', `<span class="n">total</span><span class="v">${m(sb).slice(1)}</span>`), CW, 42), xb, 262));
    const s1 = hide(stamp(stage, '1¢ off ✗', { ok: false, x: xa + CW / 2, y: 330, rotate: 6, size: 'sm' }));
    const s2 = hide(stamp(stage, 'matches the stub ✓', { ok: true, x: xb + CW / 2, y: 330, rotate: -5, size: 'sm' }));
    return [
      { cap: `The calculator gives EI = ${raw(2080 * 0.0164)} and tax = ${raw(1998.80 * 0.18)}. A pay stub can only show <b>cents</b>.`, run: async (c) => { la[3].classList.add('hl'); la[4].classList.add('hl'); await c.anim(la[3], [{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }], 500); } },
      { cap: `Add the unrounded lines: ${raw(sa)}, which rounds to <b>${m(sa)}</b>.`, run: (c) => c.fadeIn(ta) },
      { cap: `Add the rounded lines, the ones printed on the stub: <b>${m(sb)}</b>.`, run: (c) => c.fadeIn(tb) },
      { cap: `They differ by a cent! The stub’s total must match the stub’s lines, so <b>round each deduction first</b>, then add: ${m(sb)}.`, run: async (c) => { await stampIn(c, s1); await stampIn(c, s2); } }
    ];
  }
};

/* =====================================================================================
 * 9. Lucas's pay stub fills cell by cell (Example 7)
 * ===================================================================================== */
const STUB7 = { reg: 40, ot: 4.5, wage: 19.20, rates: [5.95, 1.64, 14], health: 11.80 };
const stubFill = {
  title: 'A pay stub, filled in line by line',
  height: 500,
  minW: 940,
  choices: [{ sep: 'Example 7 check:' }, { v: 'lucas', label: 'Lucas’s pay stub' }],
  ask: 'Example 7: Lucas works 40 regular hours and 4.5 overtime hours (time and a half) at <b>$19.20</b> an hour. CPP 5.95%, EI 1.64%, income tax 14%, health plan $11.80. Complete his pay stub.',
  make(stage, k, ex) {
    const W = ex.W, d = STUB7, otr = rnd(d.wage * 1.5), reg = rnd(d.reg * d.wage), ot = rnd(d.ot * otr), g = rnd(reg + ot);
    const cpp = rnd(g * 0.0595), ei = rnd(g * 0.0164), tax = rnd(g * 0.14), tot = rnd(cpp + ei + tax + d.health), net = rnd(g - tot);
    const work = add(stage, box(cbox('u2l7-work', ''), W - 40, 56), 20, 8);
    const tb = add(stage, box(h('table', 'u2l7-stub st'), W - 40, null), 20, 76);
    const B = (id) => `<td class="r" data-c="${id}"></td>`;
    tb.innerHTML = `<tr class="co"><td colspan="7"><b>Prairie Link Logistics</b>, Balzac, AB &nbsp;·&nbsp; Lucas Moreau &nbsp;·&nbsp; Oct. 5–11, 2026</td></tr>
      <tr><th>Earnings</th><th>Hours</th><th>Rate</th><th>Amount</th><th>Deductions</th><th>Rate</th><th>Amount</th></tr>
      <tr><td>Regular</td><td>40</td><td>$19.20</td>${B('reg')}<td>CPP</td><td>5.95%</td>${B('cpp')}</tr>
      <tr><td>Overtime</td><td>4.5</td>${B('otr')}${B('ot')}<td>EI</td><td>1.64%</td>${B('ei')}</tr>
      <tr><td></td><td></td><td></td><td></td><td>Income tax</td><td>14%</td>${B('tax')}</tr>
      <tr><td></td><td></td><td></td><td></td><td>Health plan</td><td></td><td class="r">$11.80</td></tr>
      <tr class="tot"><td colspan="3">Gross pay</td>${B('g')}<td colspan="2">Total deductions</td>${B('tot')}</tr>
      <tr class="tot net"><td colspan="6">Net pay</td>${B('net')}</tr>`;
    const cell = (id) => tb.querySelector(`[data-c="${id}"]`);
    const st = hide(stamp(stage, 'Complete ✓', { ok: true, x: W - 190, y: 452, rotate: -5, size: 'lg' }));
    const fillC = (id, val, w) => async (c) => {
      tb.querySelectorAll('.hl').forEach((e) => e.classList.remove('hl'));
      work.innerHTML = `<div>${T(w)}</div>`; await c.fadeIn(work, 250);
      const e = cell(id); e.classList.add('hl'); e.innerHTML = `<span class="v">${m(val)}</span>`; await c.pop(e.firstChild);
    };
    return [
      { cap: `Overtime is time and a half: overtime rate = <b>${m(otr)}</b>.`, run: fillC('otr', otr, `\\text{OT rate}=${MT(d.wage)}\\times1.5=${MT(otr)}`) },
      { cap: `Each earnings line is <b>hours × rate</b>. Regular: <b>${m(reg)}</b>.`, run: fillC('reg', reg, `40\\times${MT(d.wage)}=${MT(reg)}`) },
      { cap: `Overtime: 4.5 × ${m(otr)} = <b>${m(ot)}</b>.`, run: fillC('ot', ot, `4.5\\times${MT(otr)}=${MT(ot)}`) },
      { cap: `Add the earnings: gross pay = <b>${m(g)}</b>.`, run: fillC('g', g, `${MT(reg)}+${MT(ot)}=${MT(g)}`) },
      { cap: `CPP on the gross pay: ${raw(g * 0.0595)} ≈ <b>${m(cpp)}</b>.`, run: fillC('cpp', cpp, `${MT(g)}\\times0.0595=${raw(g * 0.0595)}\\approx${MT(cpp)}`) },
      { cap: `EI: ${raw(g * 0.0164)} ≈ <b>${m(ei)}</b>.`, run: fillC('ei', ei, `${MT(g)}\\times0.0164=${raw(g * 0.0164)}\\approx${MT(ei)}`) },
      { cap: `Income tax: ${raw(g * 0.14)} ≈ <b>${m(tax)}</b>.`, run: fillC('tax', tax, `${MT(g)}\\times0.14=${raw(g * 0.14)}\\approx${MT(tax)}`) },
      { cap: `Add all four deductions, the health plan too: <b>${m(tot)}</b>.`, run: fillC('tot', tot, `${MT(cpp)}+${MT(ei)}+${MT(tax)}+${MT(d.health)}=${MT(tot)}`) },
      { cap: `Net pay = gross − total deductions = <b>${m(net)}</b>.`, run: async (c) => { await fillC('net', net, `${MT(g)}-${MT(tot)}=${MT(net)}`)(c); await stampIn(c, st); } }
    ];
  }
};

/* =====================================================================================
 * 10. Check every line of Aisha's stub (Example 8)
 * ===================================================================================== */
const stubCheck = {
  title: 'Check every line: ✓ or ✗',
  height: 480,
  minW: 960,
  capH: 92,
  choices: [{ sep: 'Example 8 check:' }, { v: 'aisha', label: 'Aisha’s pay stub' }],
  ask: 'Example 8: Aisha’s own record shows <b>38 hours</b> at $17.75. CPP 5.95%, EI 1.64%, income tax 12%, uniform $8.00. Find the two mistakes, her correct net pay, and how much she was underpaid.',
  make(stage, k, ex) {
    const W = ex.W, hrs = 38, wage = 17.75, g = rnd(hrs * wage);
    const cpp = rnd(g * 0.0595), ei = rnd(g * 0.0164), tax = rnd(g * 0.12), tot = rnd(cpp + ei + tax + 8), net = rnd(g - tot), under = rnd(net - 411.50);
    const SW = 600;
    const rec = add(stage, box(cbox('u2l7-rec', 'Aisha’s record: <b>38 h</b>'), 220, 40), 20, 8);
    void rec;
    const tb = add(stage, box(h('table', 'u2l7-stub st u2l7-ck'), SW, null), 20, 58);
    const C = (id, v) => `<td class="r" data-c="${id}">${v}<i class="mk"></i></td>`;
    tb.innerHTML = `<tr class="co"><td colspan="7"><b>Foothills Pharmacy</b> · Aisha Rahman · Nov. 2–8</td></tr>
      <tr><th>Earnings</th><th>Hours</th><th>Rate</th><th>Amount</th><th>Deductions</th><th>Rate</th><th>Amount</th></tr>
      <tr><td>Regular</td>${C('h', '36')}<td>$17.75</td>${C('a', '$639.00')}<td>CPP</td><td>5.95%</td>${C('cpp', '$38.02')}</tr>
      <tr><td></td><td></td><td></td><td></td><td>EI</td><td>1.64%</td>${C('ei', '$104.80')}</tr>
      <tr><td></td><td></td><td></td><td></td><td>Income tax</td><td>12%</td>${C('tax', '$76.68')}</tr>
      <tr><td></td><td></td><td></td><td></td><td>Uniform</td><td></td><td class="r">$8.00</td></tr>
      <tr class="tot"><td colspan="3">Gross pay</td><td class="r">$639.00</td><td colspan="2">Total</td>${C('tot', '$227.50')}</tr>
      <tr class="tot net"><td colspan="6">Net pay</td>${C('net', '$411.50')}</tr>`;
    const mark = (id, ok) => async (c) => { const e = tb.querySelector(`[data-c="${id}"]`), i = e.querySelector('.mk'); e.classList.toggle('bad', ok === false); i.className = 'mk ' + (ok === true ? 'ok' : ok === false ? 'no' : 'mid'); i.textContent = ok === true ? '✓' : ok === false ? '✗' : '~'; await c.pop(i); };
    const est = hide(add(stage, box(cbox('u2l7-estc', ''), SW, 46), 20, 400));
    const R = SW + 50, RW = W - R - 16;
    const fix = hide(add(stage, box(h('div', 'u2l7-fix'), RW, 380), R, 8));
    fix.innerHTML = `<div class="hd">Fixed</div>
      <div class="ln" data-f="g">gross ${T(`38\\times${MT(wage)}=${MT(g)}`)}</div>
      <div class="ln" data-f="d">CPP <b>${m(cpp)}</b> · EI <b>${m(ei)}</b><br>tax <b>${m(tax)}</b> · uniform <b>$8.00</b></div>
      <div class="ln" data-f="t">total <b>${m(tot)}</b></div>
      <div class="ln" data-f="n">net ${T(`${MT(g)}-${MT(tot)}=${MT(net)}`)}</div>
      <div class="ln big" data-f="u">underpaid ${T(`${MT(net)}-\\$411.50=${MT(under)}`)}</div>`;
    const F = (id) => fix.querySelector(`[data-f="${id}"]`);
    fix.querySelectorAll('.ln').forEach((e) => { e.style.opacity = 0; });
    const st = hide(stamp(stage, `underpaid ${m(under)}`, { ok: false, x: R + RW / 2, y: 438, rotate: -5 }));
    const say = async (c, html) => { est.innerHTML = `<div>${html}</div>`; await c.fadeIn(est, 250); };
    return [
      { cap: `<b>Check 1:</b> the hours. Her own record says <b>38</b>, but the stub says 36 ✗. <b>Mistake 1.</b>`, run: mark('h', false) },
      { cap: `Hours × rate: 36 × $17.75 = $639.00, the gross pay. The multiplying is right, but it uses the wrong hours.`, run: mark('a', null) },
      { cap: `<b>Check 3:</b> estimate each deduction. 1% of $639 is about $6.39, so CPP (about 6%) is about $38. $38.02 ✓`, run: async (c) => { await say(c, `1% of $639 ≈ <b>$6.39</b> &nbsp;·&nbsp; CPP ≈ 6 × $6.39 ≈ $38`); await mark('cpp', true)(c); } },
      { cap: `EI is less than 2%: less than $12.78. The stub says <b>$104.80</b>, way too big ✗. Someone used 16.4% (0.164). <b>Mistake 2.</b>`, run: async (c) => { await say(c, `EI &lt; 2 × $6.39 = <b>$12.78</b>, not $104.80!`); await mark('ei', false)(c); } },
      { cap: `Income tax: 12% of $639 is about $77. $76.68 ✓. The total and net add up, but they use the wrong numbers.`, run: async (c) => { await say(c, `tax ≈ 12 × $6.39 ≈ $77`); await mark('tax', true)(c); await mark('tot', null)(c); await mark('net', null)(c); } },
      { cap: `Fix it. Correct gross pay = 38 × $17.75 = <b>${m(g)}</b>.`, run: async (c) => { await c.fadeIn(fix); await c.fadeIn(F('g')); } },
      { cap: `New deductions: CPP ${raw(g * 0.0595)} ≈ ${m(cpp)}, EI ${raw(g * 0.0164)} ≈ ${m(ei)}, tax ${m(tax)}, uniform $8.00.`, run: (c) => c.fadeIn(F('d')) },
      { cap: `Total = <b>${m(tot)}</b>; net pay = ${m(g)} − ${m(tot)} = <b>${m(net)}</b>.`, run: async (c) => { await c.fadeIn(F('t')); await c.fadeIn(F('n')); } },
      { cap: `She was paid $411.50. Underpaid by ${m(net)} − $411.50 = <b>${m(under)}</b>. Always check your stub!`, run: async (c) => { await c.fadeIn(F('u')); await stampIn(c, st); } }
    ];
  }
};

mountExplainers({ grossNet, pctDecimal, onePercent, deductMachine, scooter, pctGrid, taxable, roundFirst, stubFill, stubCheck });

/* ============ Stand Up Break! — deductions and net pay, at the whiteboards ============ */
{
  const dd = (v) => MT(v).slice(2);   // TeX number with thin spaces, no $
  const JOBS = ['a grocery store', 'a pizza place', 'a hardware store', 'a rec centre', 'a car wash', 'a movie theatre', 'a vet clinic', 'a tire shop'];
  const NAMES = ['Ava', 'Liam', 'Zara', 'Mateo', 'Priya', 'Jonah', 'Elif', 'Cole', 'Nadia', 'Theo'];
  const pd = (g, r) => rnd(g * r / 100);
  standup('u2l7', {
    intro: 'Change each rate to a decimal, round each deduction to the cent, then subtract. Estimate first!',
    levels: {
      BEG: (r) => { // given deduction amounts → total and net
        const g = r.int(3200, 9800) / 10, cpp = pd(g, 5.95), ei = pd(g, 1.64), tax = rnd(g * r.int(6, 15) / 100), other = r.pick([4.50, 6.00, 7.25, 10.00]);
        const tot = rnd(cpp + ei + tax + other);
        return { text: `${r.pick(NAMES)}’s gross pay is <b>${m(g)}</b>. The deductions are CPP ${m(cpp)}, EI ${m(ei)}, income tax ${m(tax)} and ${m(other)} for a uniform. Find the total deductions and the net pay.`, q: '',
          a: [`\\text{total}=${dd(cpp)}+${dd(ei)}+${dd(tax)}+${dd(other)}`, `=\\$${dd(tot)}`, `\\text{net}=${dd(g)}-${dd(tot)}=\\$${dd(g - tot)}`] };
      },
      PRG: (r) => { // hours × wage, then CPP, EI and tax from rates
        const hrs = r.pick([16, 18, 20, 22.5, 24, 25, 30]), w = r.pick([15.00, 15.50, 16.25, 16.80, 17.40, 18.00]), t = r.int(6, 16), g = rnd(hrs * w);
        const cpp = pd(g, 5.95), ei = pd(g, 1.64), tax = pd(g, t), tot = rnd(cpp + ei + tax);
        return { text: `${r.pick(NAMES)} works <b>${hrs} h</b> at ${r.pick(JOBS)} for <b>${m(w)}</b> an hour. Deductions: CPP 5.95%, EI 1.64%, income tax ${t}%. Find the gross pay, each deduction and the net pay.`, q: '',
          a: [`\\text{gross}=${hrs}\\times${dd(w)}=\\$${dd(g)}`, `\\text{CPP}=\\$${dd(cpp)},\\ \\text{EI}=\\$${dd(ei)},\\ \\text{tax}=\\$${dd(tax)}`, `\\text{total}=\\$${dd(tot)},\\ \\text{net}=\\$${dd(g - tot)}`] };
      },
      MAS: (r) => r.pick([
        () => { // before-tax union dues → taxable income → net
          const g = r.int(140, 260) * 10, du = r.pick([1.25, 1.5, 2, 2.5]), t = r.int(14, 20), dues = pd(g, du), ti = rnd(g - dues);
          const cpp = pd(g, 5.95), ei = pd(g, 1.64), tax = pd(ti, t), tot = rnd(dues + cpp + ei + tax);
          return { text: `An apprentice electrician earns <b>${m(g)}</b> gross in two weeks. Union dues are <b>${du}%</b> of gross pay (before tax). CPP 5.95%, EI 1.64%, income tax <b>${t}%</b> of taxable income. Find the taxable income and the net pay.`, q: '',
            a: [`\\text{dues}=\\$${dd(dues)},\\ \\text{taxable}=${dd(g)}-${dd(dues)}=\\$${dd(ti)}`, `\\text{CPP}=\\$${dd(cpp)},\\ \\text{EI}=\\$${dd(ei)},\\ \\text{tax}=${dd(ti)}\\times${t / 100}=\\$${dd(tax)}`, `\\text{total}=\\$${dd(tot)},\\ \\text{net}=\\$${dd(g - tot)}`] };
        },
        () => { // percent kept and a rate
          const g = r.int(60, 140) * 10, t = r.int(10, 18), tax = pd(g, t), other = r.pick([12.50, 18.00, 22.40]), tot = rnd(pd(g, 5.95) + pd(g, 1.64) + tax + other), n = rnd(g - tot);
          return { text: `A pay stub shows gross pay <b>${m(g)}</b>, income tax <b>${m(tax)}</b>, and net pay <b>${m(n)}</b>. (a) What income tax rate is that? (b) What percent of the gross pay is taken home? Round to the nearest tenth.`, q: '',
            a: [`\\text{(a) }${dd(tax)}\\div${dd(g)}=${rnd(tax / g, 4)}\\to${t}\\%`, `\\text{(b) }${dd(n)}\\div${dd(g)}\\times100\\approx${rnd(n / g * 100, 1).toFixed(1)}\\%`] };
        }
      ])()
    }
  });
}

/* ============ Math History: the "temporary" income tax (1917) ============ */
function tempTax() {
  const svg = document.getElementById('u2l7-hist'); if (!svg) return;
  const NSV = 'http://www.w3.org/2000/svg', E = (tag, a, p) => { const e = document.createElementNS(NSV, tag); for (const k in a) e.setAttribute(k, a[k]); (p || svg).appendChild(e); return e; };
  const TX = (x, y, s, cls, p) => { const t = E('text', { x, y, class: cls }, p); t.textContent = s; return t; };
  svg.innerHTML = '';
  E('rect', { x: 0, y: 0, width: 600, height: 300, rx: 14, fill: '#fffaf1' });
  // the 1917 law: a small paper
  const doc = E('g', {});
  E('rect', { x: 46, y: 70, width: 150, height: 190, rx: 6, fill: '#fff', stroke: '#7a4a26', 'stroke-width': 3 }, doc);
  TX(121, 100, 'Income War', 'u2l7-hdoc', doc); TX(121, 120, 'Tax Act', 'u2l7-hdoc', doc);
  for (let i = 0; i < 6; i++) E('line', { x1: 66, x2: 176, y1: 142 + i * 16, y2: 142 + i * 16, stroke: '#c9b79a', 'stroke-width': 3 }, doc);
  TX(121, 286, '1917 · 11 pages', 'u2l7-hsm');
  const stp = E('g', { opacity: 0 });
  E('rect', { x: 52, y: 166, width: 140, height: 40, rx: 6, fill: 'none', stroke: '#b03a2e', 'stroke-width': 4, transform: 'rotate(-12 122 186)' }, stp);
  TX(122, 194, 'TEMPORARY', 'u2l7-hstamp', stp).setAttribute('transform', 'rotate(-12 122 186)');
  // the year counter
  const yr = TX(300, 60, '1917', 'u2l7-hyear');
  // the growing pile of pages
  const pile = E('g', {}), PX = 425, PB = 262, PW = 135;
  const sheets = []; for (let i = 0; i < 40; i++) sheets.push(E('rect', { x: PX + (i % 2) * 3, y: PB - (i + 1) * 5.4, width: PW, height: 5, fill: i % 2 ? '#fff' : '#f3e8d6', stroke: '#b9a27f', 'stroke-width': 1, opacity: 0 }, pile));
  const pc = TX(PX + PW / 2, 286, '', 'u2l7-hsm');
  const still = TX(300, 104, '', 'u2l7-hgold'), still2 = TX(300, 132, '', 'u2l7-hgold');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let raf = 0;
  const draw = (t) => {
    const k0 = Math.min(1, Math.max(0, (t - 1.2) / 0.5));
    stp.setAttribute('opacity', k0); stp.setAttribute('transform', `translate(122 186) scale(${1.6 - 0.6 * k0}) translate(-122 -186)`);
    const k1 = Math.min(1, Math.max(0, (t - 2.6) / 5.4));
    yr.textContent = String(Math.round(1917 + (2026 - 1917) * k1));
    const ns = Math.round(1 + 39 * k1); sheets.forEach((s, i) => s.setAttribute('opacity', i < ns ? 1 : 0));
    const pages = k1 < 1 ? Math.round(11 + (3000 - 11) * k1 * k1) : 3000;
    pc.textContent = t < 2.6 ? '' : (k1 < 1 ? `${pages > 999 ? String(pages).replace(/\B(?=(\d{3})+(?!\d))/g, '\u202f') : pages} pages` : 'over 3\u202f000 pages');
    still.textContent = t > 8.6 ? 'The war ended.' : ''; still2.textContent = t > 9.2 ? 'The tax stayed!' : '';
  };
  const play = () => {
    cancelAnimationFrame(raf);
    if (reduce) { draw(20); return; }
    const t0 = performance.now();
    const step = (now) => { const t = (now - t0) / 1000; draw(t); if (t < 10) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
  };
  draw(0);
  const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { play(); io.disconnect(); } }, { threshold: 0.5 });
  io.observe(svg);
  svg.addEventListener('click', play);
  const b = svg.closest('.card').querySelector('.hist-play'); if (b) b.addEventListener('click', play);
}
tempTax();
