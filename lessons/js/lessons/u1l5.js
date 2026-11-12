/* Math 10-3 · Unit 1 · Lesson 5 — Rates and Unit Rates.
 * Explainers: the rate-or-ratio sorter (units the same or different?), the unit-rate bar that splits into one piece per
 * unit, dividing the wrong way (Full notes), the beating heart and the 60-second clock, the double number line for
 * predicting, the proportion method (Full notes), paint cans covering a wall (round up), the road trip with odometer and
 * fuel gauge (L/100 km), the race (two typists; two vehicles over 100 km), and the rate converter (one unit at a time).
 * Then the Stand Up Break. */
import { h, add, box, tex, svgEl, appear, pulse, shake, sleep, tween, stamp, stampIn, mountExplainers } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const BR = '#6e4a1c', BLUE = '#1f5bd6', GREEN = '#12805a', RED = '#c93a33', AMBER = '#c27a0e', INK = '#1c2230', GRAY = '#9aa0ab';
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const m2 = (v) => (Math.round(v * 100) / 100).toFixed(2);          // money, two decimals
const cl = (v, d = 4) => String(parseFloat(Number(v).toFixed(d)));   // a clean decimal, no float noise
const lin = (t) => t;
const mz = (v) => { const r = Math.round(v * 100) / 100; return Number.isInteger(r) ? String(r) : r.toFixed(2); };   // $45, $16.65

/* curved arrow between two x positions on a line at y (above: bulges up), with a label pill */
function arc(svg, x1, x2, y, above, color, off = 10, hmax = 70) {
  const dy = above ? -1 : 1, mx = (x1 + x2) / 2, hgt = Math.min(hmax, 20 + Math.abs(x2 - x1) * 0.12), y0 = y + dy * off;
  const p = svgEl('path', { d: `M${x1} ${y0} Q${mx} ${y0 + dy * hgt * 2} ${x2} ${y0}`, fill: 'none', stroke: color, 'stroke-width': 3.2 }, svg);
  const ang = Math.atan2(-dy * hgt * 2, x2 - mx), hx = Math.cos(ang), hy = Math.sin(ang);
  const head = svgEl('polygon', { points: `${x2},${y0} ${x2 - hx * 13 - hy * 7},${y0 - hy * 13 + hx * 7} ${x2 - hx * 13 + hy * 7},${y0 - hy * 13 - hx * 7}`, fill: color }, svg);
  hide(p, head);
  return { p, head };
}
async function drawArc(c, a) {
  const len = a.p.getTotalLength ? a.p.getTotalLength() : 300;
  a.p.style.strokeDasharray = len;
  await c.anim(a.p, [{ opacity: 1, strokeDashoffset: len }, { opacity: 1, strokeDashoffset: 0 }], 600);
  await appear(c, a.head, 150);
}

/* =====================================================================================
 * 1. Rate or ratio? Pull out the two units and compare them
 * ===================================================================================== */
const RR = {
  a: { q: ['A printer prints ', '72 pages', ' in ', '3 minutes', '.'], u: ['pages', 'minutes'], rate: true, why: 'pages and minutes are different units', three: ['72 pages in 3 min', '\\dfrac{72\\text{ pages}}{3\\text{ min}}', '72 pages/3 min'] },
  b: { q: ['A recipe uses ', '2 cups', ' of rice for every ', '3 cups', ' of water.'], u: ['cups', 'cups'], rate: false, why: 'both amounts are in cups' },
  c: { q: ['Pears cost ', '$6.60', ' for ', '2 kg', '.'], u: ['dollars', 'kilograms'], rate: true, why: 'dollars and kilograms are different units' },
  d: { q: ['A hockey team won ', '9 games', ' and lost ', '6 games', '.'], u: ['games', 'games'], rate: false, why: 'both amounts are games' },
  hb: { q: ['A heart beats ', '120 times', ' in ', '2 min', '.'], u: ['beats', 'minutes'], rate: true, why: 'beats and minutes are different units' },
  fl: { q: ['A cake uses ', '2 cups', ' of flour to ', '3 cups', ' of milk.'], u: ['cups', 'cups'], rate: false, why: 'both amounts are in cups' }
};
const rateOrRatio = {
  title: 'Rate or ratio? Check the units',
  height: 400,
  minW: 900,
  choices: [{ sep: 'Example 1 check:' }, { v: 'a', label: '(a) printer' }, { v: 'b', label: '(b) rice' }, { v: 'c', label: '(c) pears' }, { v: 'd', label: '(d) hockey' }, { sep: 'More:' }, { v: 'hb', label: 'heartbeats' }, { v: 'fl', label: 'flour and milk' }],
  ask: (k) => `${k.length === 1 ? `Example 1(${k}): ` : ''}Is it a rate or a ratio? “${RR[k].q.join('')}”${k === 'a' ? ' (e) Write the rate as a fraction and with a slash.' : ''}`,
  make(stage, k, ex) {
    const d = RR[k], W = ex.W;
    const card = add(stage, box(h('div', 'u1l5-stmt'), W - 80), 40, 14);
    const qs = d.q.map((s, i) => card.appendChild(h('span', i % 2 ? 'u1l5-qty' : '', s)));
    const q1 = qs[1], q2 = qs[3];
    const TW = 230, xA = W / 2 - TW - 70, xB = W / 2 + 70;
    const tA = hide(add(stage, box(h('div', 'u1l5-utag', d.u[0]), TW), xA, 100));
    const tB = hide(add(stage, box(h('div', 'u1l5-utag', d.u[1]), TW), xB, 100));
    const same = d.u[0] === d.u[1];
    const cmp = hide(add(stage, box(h('div', 'u1l5-cmp ' + (same ? 'same' : 'diff'), T(same ? '=' : '\\neq')), 100), W / 2 - 50, 98));
    const cmpT = hide(add(stage, box(h('div', 'u1l5-cmpt', same ? 'the <b>same</b> unit' : '<b>different</b> units'), 300), W / 2 - 150, 160));
    const BW = 330, BY = 220;
    const binR = add(stage, box(h('div', 'u1l5-bin rate', '<b>RATE</b><small>different units</small>'), BW, 160), W / 2 - BW - 40, BY);
    const binQ = add(stage, box(h('div', 'u1l5-bin ratio', '<b>RATIO</b><small>same unit</small>'), BW, 160), W / 2 + 40, BY);
    const into = d.rate ? binR : binQ;
    const chip = hide(add(stage, box(h('div', 'u1l5-chip', d.rate ? `${d.q[1]}${d.q[2].replace(/ of rice for every | of flour to /, ' to ')}${d.q[3]}` : `${d.q[1]} to ${d.q[3]}`), BW - 40), (d.rate ? W / 2 - BW - 40 : W / 2 + 40) + 20, BY + 92));
    const st = hide(stamp(stage, d.rate ? 'rate ✓' : 'ratio ✓', { ok: true, x: (d.rate ? W / 2 - BW - 40 : W / 2 + 40) + BW - 30, y: BY + 14, rotate: 8 }));
    const steps = [
      { cap: 'Find the <b>two quantities</b> being compared.', run: async (c) => { q1.classList.add('on'); q2.classList.add('on'); await Promise.all([pulse(c, q1, 1.12, 500), pulse(c, q2, 1.12, 500)]); } },
      { cap: `Look at their <b>units</b>: <b>${d.u[0]}</b> and <b>${d.u[1]}</b>.`, run: async (c) => { await c.fadeIn(tA, 380, { from: 'translateY(-30px)' }); await c.fadeIn(tB, 380, { from: 'translateY(-30px)' }); } },
      { cap: same ? `Both are <b>${d.u[0]}</b>: the <b>same unit</b>.` : `${d.u[0][0].toUpperCase() + d.u[0].slice(1)} and ${d.u[1]} are <b>different units</b>.`, run: async (c) => { await c.pop(cmp, 380); await c.fadeIn(cmpT); } },
      { cap: `So it is a <b>${d.rate ? 'rate' : 'ratio'}</b>: ${d.why}.`, run: async (c) => { await c.fadeIn(chip, 420, { from: 'translateY(-60px)' }); await Promise.all([pulse(c, into, 1.04, 400), stampIn(c, st)]); } }
    ];
    if (d.three) {
      const strip = hide(add(stage, box(h('div', 'u1l5-three'), W - 80), 40, 98));
      d.three.forEach((s, i) => strip.appendChild(h('div', '', `<small>${['in words', 'as a fraction', 'with a slash'][i]}</small>${i === 1 ? T(s) : s}`)));
      steps.push({ cap: `(e) A rate keeps its units. Write it 3 ways. Read the slash as <b>per</b>: “72 pages per 3 minutes”.`,
        run: async (c) => { await Promise.all([c.anim(tA, [{ opacity: 1 }, { opacity: 0 }], 250), c.anim(tB, [{ opacity: 1 }, { opacity: 0 }], 250), c.anim(cmp, [{ opacity: 1 }, { opacity: 0 }], 250), c.anim(cmpT, [{ opacity: 1 }, { opacity: 0 }], 250)]); await c.fadeIn(strip, 420); } });
    }
    return steps;
  }
};

/* =====================================================================================
 * 2. The unit-rate bar: split the first quantity into one piece per unit
 * ===================================================================================== */
const UR = {
  n45: { a: 45, au: '', b: 3, bu: 'h', money: true, ask: 'Notes: <b>$45 for 3 h</b> of work. What is the pay for 1 hour?' },
  a: { a: 54, au: 'km', b: 3, bu: 'h', ask: 'Example 2(a): a cyclist rides <b>54 km in 3 h</b>. Find the unit rate.' },
  b: { a: 133.2, au: '', b: 8, bu: 'h', money: true, ask: 'Example 2(b): Jordan earns <b>$133.20 for an 8-hour shift</b> at a hardware store. Find the unit rate.' },
  c: { a: 390, au: 'words', b: 6, bu: 'min', ask: 'Example 2(c): Mei types <b>390 words in 6 min</b>. Find the unit rate.' },
  d: { a: 24, au: 'L', b: 1.5, bu: 'min', ask: 'Example 2(d): a tap fills a <b>24 L</b> bucket in <b>1.5 min</b>. Find the unit rate.' }
};
const urA = (d, v) => (d.money ? '$' + mz(v) : cl(v) + ' ' + d.au);                       // "54 km", "$133.20"
const urAT = (d, v) => (d.money ? '\\$' + mz(v) : cl(v) + '\\text{ ' + d.au + '}');
const urB = (d, v) => cl(v) + ' ' + d.bu;
const unitRate = {
  title: 'Unit rate: the amount for ONE unit',
  height: 400,
  minW: 900,
  choices: [{ sep: 'Notes:' }, { v: 'n45', label: '$45 for 3 h' }, { sep: 'Example 2 check:' }, { v: 'a', label: '(a) 54 km' }, { v: 'b', label: '(b) $133.20' }, { v: 'c', label: '(c) 390 words' }, { v: 'd', label: '(d) 24 L' }],
  ask: (k) => UR[k].ask,
  make(stage, k, ex) {
    const d = UR[k], W = ex.W, u = d.a / d.b, BW = 780, x0 = Math.round((W - BW) / 2), sw = BW / d.b;
    const whole = Math.floor(d.b + 1e-9), frac = d.b - whole;
    const fr = add(stage, box(h('div', 'u1l5-frac'), W), 0, 8);
    const F0 = `\\dfrac{${urAT(d, d.a)}}{${cl(d.b)}\\text{ ${d.bu}}}`;
    const F1 = `${F0}=\\dfrac{${urAT(d, d.a)}\\div${cl(d.b)}}{${cl(d.b)}\\text{ ${d.bu}}\\div${cl(d.b)}}`;
    const F2 = `${F1}=\\dfrac{${urAT(d, u)}}{1\\text{ ${d.bu}}}`;
    const rateTxt = d.money ? `$${mz(u)}/${d.bu}` : `${cl(u)} ${d.au}/${d.bu}`;
    fr.innerHTML = T(F0);
    const svg = add(stage, svgEl('svg', { width: W, height: 400, class: 'u1l5-svg' }), 0, 0);
    const YA = 140, HA = 64, YB = 236, HB = 46;
    // the first quantity (top bar) and the units (bottom bar)
    const lA = add(stage, box(h('div', 'u1l5-blab a', urA(d, d.a)), BW), x0, YA - 44);
    svgEl('rect', { x: x0, y: YA, width: BW, height: HA, rx: 8, fill: '#f3e6d0', stroke: BR, 'stroke-width': 3 }, svg);
    svgEl('rect', { x: x0, y: YB, width: BW, height: HB, rx: 8, fill: '#e7eefb', stroke: BLUE, 'stroke-width': 3 }, svg);
    const lB = add(stage, box(h('div', 'u1l5-blab b', urB(d, d.b)), BW), x0, YB + HB + 6);
    const divs = [], pieceL = [], unitL = [];
    for (let i = 1; i <= whole; i++) {
      const x = x0 + i * sw;
      if (i < d.b - 1e-9) divs.push(svgEl('line', { x1: x, x2: x, y1: YA - 6, y2: YB + HB + 6, stroke: INK, 'stroke-width': 2.5, 'stroke-dasharray': '7 5' }, svg));
    }
    for (let i = 0; i < Math.ceil(d.b - 1e-9); i++) {
      const isHalf = i === whole && frac > 1e-9, wSeg = isHalf ? sw * frac : sw, xs = x0 + i * sw;
      const val = isHalf ? u * frac : u;
      const pl = add(stage, box(h('div', 'u1l5-piece' + (wSeg < 110 ? ' sm' : ''), d.money ? '$' + mz(val) : cl(val)), wSeg), xs, YA + 14);
      const ul = add(stage, box(h('div', 'u1l5-piece u' + (wSeg < 110 ? ' sm' : ''), (isHalf ? cl(frac) : '1') + ' ' + d.bu), wSeg), xs, YB + 8);
      pieceL.push(pl); unitL.push(ul);
    }
    hide(...divs, ...pieceL, ...unitL);
    const hl = svgEl('rect', { x: x0 + 2, y: YA - 8, width: sw - 4, height: YB + HB + 16 - YA, rx: 10, fill: 'none', stroke: GREEN, 'stroke-width': 5 }, svg); hide(hl);
    const res = hide(add(stage, box(h('div', 'u1l5-res', `unit rate: <b>${rateTxt}</b>`), 420), W / 2 - 210, 338));
    const nParts = d.b === whole ? `<b>${d.b}</b> equal parts, one for each ${d.bu === 'h' ? 'hour' : 'minute'}` : `<b>1.5</b> parts: one whole minute and a half minute`;
    return [
      { cap: `The rate: <b>${urA(d, d.a)}</b> for <b>${urB(d, d.b)}</b>.`, run: (c) => Promise.all([pulse(c, lA, 1.06, 400), pulse(c, lB, 1.06, 400)]) },
      { cap: `Split it into ${nParts}.`, run: async (c) => { await Promise.all(divs.map((e, i) => appear(c, e, 260, { delay: i * 80 }))); await Promise.all(unitL.map((e, i) => c.pop(e, 300, { delay: i * 60 }))); } },
      { cap: `Divide: ${T(`${d.money ? mz(d.a) : cl(d.a)}\\div${cl(d.b)}=${d.money ? mz(u) : cl(u)}`)}. Each ${d.bu === 'h' ? 'hour' : 'minute'} gets <b>${urA(d, u)}</b>${frac ? ` (the half minute gets ${urA(d, u * frac)})` : ''}.`,
        run: async (c) => { await Promise.all(pieceL.map((e, i) => c.pop(e, 300, { delay: i * 60 }))); } },
      { cap: `It’s the same as dividing the top and bottom by ${cl(d.b)}.`, run: async (c) => { fr.innerHTML = T(F1); await c.fadeIn(fr, 300); } },
      { cap: `The amount for <b>1 ${d.bu}</b>: the unit rate is <b>${rateTxt}</b>.`, run: async (c) => { fr.innerHTML = T(F2 + `=${d.money ? '\\$' + mz(u) : cl(u) + '\\text{ ' + d.au + '}'}\\text{/${d.bu}}`); await c.fadeIn(fr, 300); await appear(c, hl, 300); await c.pop(res, 380); } }
    ];
  }
};

/* =====================================================================================
 * 3. Dividing the wrong way (Full notes): which order makes sense?
 * ===================================================================================== */
const WW = {
  jor: { ask: 'Jordan earns <b>$133.20</b> in <b>8 h</b>. Which division gives his wage?', good: ['133.20 ÷ 8', '16.65', '$16.65 per hour'], bad: ['8 ÷ 133.20', '0.06006006', '$0.06 per hour?'],
    end: 'Dollars <b>per hour</b>: dollars ÷ hours. 6 cents an hour makes no sense; <b>$16.65/h</b> does.' },
  mei: { ask: 'Mei types <b>390 words</b> in <b>6 min</b>. Which division gives her typing speed?', good: ['390 ÷ 6', '65.', '65 words per minute'], bad: ['6 ÷ 390', '0.015384615', '0.015 words per minute?'],
    end: 'Words <b>per minute</b>: words ÷ minutes. Nobody types 0.015 words in a minute; <b>65 words/min</b> makes sense.' }
};
const wrongWay = {
  title: 'Divide in the right order',
  height: 270,
  minW: 860,
  choices: [{ v: 'jor', label: 'Jordan’s wage' }, { v: 'mei', label: 'Mei’s typing' }],
  ask: (k) => WW[k].ask,
  make(stage, k, ex) {
    const d = WW[k], W = ex.W, PW = (W - 80) / 2;
    const pane = (x, cls, lines) => {
      const e = add(stage, box(h('div', 'u1l5-pane ' + cls), PW, 180), x, 14);
      const typed = e.appendChild(h('div', 'u1l5-lcd', `<div>${lines[0].replace('÷', '/')}</div><div class="r"></div>`));
      const r = typed.querySelector('.r');
      const said = hide(e.appendChild(h('div', 'u1l5-said', lines[2])));
      return { e, r, said, ans: lines[1] };
    };
    const A = pane(30, 'bad', d.bad), B = pane(50 + PW, 'good', d.good);
    const sA = hide(stamp(stage, 'makes no sense ✗', { ok: false, x: 30 + PW / 2, y: 234, rotate: -5 }));
    const sB = hide(stamp(stage, 'sensible ✓', { ok: true, x: 50 + PW * 1.5, y: 234, rotate: -5 }));
    return [
      { cap: `Divide the small number by the big one: ${d.bad[0]} = <b>${d.bad[1].slice(0, 6)}…</b>`, run: async (c) => { A.r.textContent = d.bad[1]; await pulse(c, A.e, 1.03, 400); await c.fadeIn(A.said); } },
      { cap: 'Does that make sense? No way!', run: (c) => stampIn(c, sA) },
      { cap: `The unit after “per” goes on the <b>bottom</b>: ${d.good[0]} = <b>${d.good[1].replace(/\.$/, '')}</b>.`, run: async (c) => { B.r.textContent = d.good[1]; await pulse(c, B.e, 1.03, 400); await c.fadeIn(B.said); } },
      { cap: d.end, run: (c) => stampIn(c, sB) }
    ];
  }
};

/* =====================================================================================
 * 4. The beating heart: count for 15 s (or 20 s), then fill a 60-second clock
 * ===================================================================================== */
const HR = {
  a: { beats: 18, secs: 15, ask: 'Example 3(a): at rest, Aiden counts <b>18 beats in 15 s</b>. What is his heart rate in beats per minute?' },
  b: { beats: 37, secs: 20, ask: 'Example 3(b): after running up the stairs, Aiden counts <b>37 beats in 20 s</b>. What is his heart rate now?' },
  m1: { beats: 22, secs: 15, ask: 'After gym class, Zoe counts <b>22 beats in 15 s</b>. What is her heart rate in beats per minute?' },
  m2: { beats: 25, secs: 20, ask: 'Liam counts <b>25 beats in 20 s</b>. What is his heart rate in beats per minute?' }
};
const HEART = 'M0 22 C-6 14 -34 2 -34 -14 C-34 -28 -22 -36 -12 -36 C-6 -36 -2 -32 0 -28 C2 -32 6 -36 12 -36 C22 -36 34 -28 34 -14 C34 2 6 14 0 22 Z';
const heartRate = {
  title: 'Taking a pulse: from 15 s to a whole minute',
  height: 400,
  minW: 900,
  choices: [{ sep: 'Example 3 check:' }, { v: 'a', label: '(a) 18 in 15 s' }, { v: 'b', label: '(b) 37 in 20 s' }, { sep: 'More:' }, { v: 'm1', label: '22 in 15 s' }, { v: 'm2', label: '25 in 20 s' }],
  ask: (k) => HR[k].ask,
  make(stage, k, ex) {
    const d = HR[k], W = ex.W, n = 60 / d.secs, bpm = d.beats * n;
    const svg = add(stage, svgEl('svg', { width: W, height: 400, class: 'u1l5-svg' }), 0, 0);
    // left: the heart, a stopwatch and a beat counter
    const hg = svgEl('g', { transform: 'translate(180 130)' }, svg);
    const heart = svgEl('path', { d: HEART, fill: RED, transform: 'scale(2.6)' }, hg);
    heart.style.transformBox = 'view-box'; heart.style.transformOrigin = '0 0';
    const sw = add(stage, box(h('div', 'u1l5-sw', '<small>timer</small><b>0 s</b>'), 150), 25, 250);
    const bc = add(stage, box(h('div', 'u1l5-sw bc', '<small>beats</small><b>0</b>'), 150), 195, 250);
    const swB = sw.querySelector('b'), bcB = bc.querySelector('b');
    // right: the 60-second clock in n equal pieces
    const CX = 520, CY = 200, R = 150;
    const face = svgEl('g', {}, svg); hide(face);
    svgEl('circle', { cx: CX, cy: CY, r: R, fill: '#fff', stroke: INK, 'stroke-width': 4 }, face);
    const pt = (a, r) => [CX + r * Math.sin(a), CY - r * Math.cos(a)];
    const sect = [], labs = [];
    for (let i = 0; i < n; i++) {
      const a0 = (i / n) * 2 * Math.PI, a1 = ((i + 1) / n) * 2 * Math.PI, [x0, y0] = pt(a0, R - 3), [x1, y1] = pt(a1, R - 3);
      const s = svgEl('path', { d: `M${CX} ${CY} L${x0} ${y0} A${R - 3} ${R - 3} 0 0 1 ${x1} ${y1} Z`, fill: i % 2 ? '#f6c9c4' : '#f2b0a8', stroke: '#fff', 'stroke-width': 3 }, svg);
      sect.push(s);
      const [lx, ly] = pt((a0 + a1) / 2, R * 0.58);
      labs.push(add(stage, box(h('div', 'u1l5-slab', `<b>${d.beats}</b><small>${d.secs} s</small>`), 90), lx - 45, ly - 30));
    }
    hide(...sect, ...labs);
    const spokes = svgEl('g', {}, svg); hide(spokes);
    for (let i = 0; i < n; i++) { const [x, y] = pt((i / n) * 2 * Math.PI, R); svgEl('line', { x1: CX, y1: CY, x2: x, y2: y, stroke: INK, 'stroke-width': 3 }, spokes); }
    const t60 = add(stage, box(h('div', 'u1l5-c60', '60 s = 1 min'), 200), CX - 100, CY - R - 32); hide(t60);
    const res = hide(add(stage, box(h('div', 'u1l5-res u1l5-hres', `<div>${T(`${d.beats}\\times${n}=${bpm}`)}</div><b>${bpm} beats/min</b>`), W - 720), 700, 150));
    return [
      { cap: `Count the beats for <b>${d.secs} s</b>: <b>${d.beats} beats</b>.`, run: (c) => tween(c, 3200, (t) => {
        const s = t * d.secs, b = Math.min(d.beats, Math.floor(t * d.beats + 1e-9)), ph = (t * d.beats) % 1;
        swB.textContent = Math.floor(s + 1e-9) + ' s'; bcB.textContent = String(b);
        heart.setAttribute('transform', `scale(${2.6 * (1 + 0.14 * Math.max(0, 1 - ph * 4) * (t < 1 ? 1 : 0))})`);
      }, lin) },
      { cap: `A minute is <b>60 s</b>. ${T(`60\\div${d.secs}=${n}`)}, so <b>${n}</b> pieces of ${d.secs} s fill a minute.`, run: async (c) => { await Promise.all([appear(c, face, 300), appear(c, spokes, 300)]); await c.fadeIn(t60); } },
      { cap: `Every ${d.secs} s has about ${d.beats} beats. Fill all ${n} pieces.`, run: async (c) => { for (let i = 0; i < n; i++) { await Promise.all([appear(c, sect[i], 250), c.pop(labs[i], 300)]); } } },
      { cap: `${n} groups of ${d.beats}: ${T(`${d.beats}\\times${n}=${bpm}`)}. The heart rate is <b>${bpm} beats/min</b>.`, run: (c) => c.pop(res, 380) }
    ];
  }
};

/* =====================================================================================
 * 5. Predicting with a double number line: go to 1 unit, then to any number of units
 * ===================================================================================== */
const PR = {
  kiran: { top: 'dollars', bot: 'hours', ft: (v) => '$' + m2(v), fb: (v) => cl(v) + ' h',
    ask: 'Example 4: Kiran earned <b>$247.50 for 15 h</b>. How much will he earn for <b>22 h</b>?',
    pts: { k: [15, 247.5], one: [1, 16.5], t: [22, 363] }, pos: { k: 0.55, one: 0.12, t: 0.95 } },
  talia: { top: 'words', bot: 'minutes', ft: (v) => cl(v) + ' words', fb: (v) => cl(v) + ' min',
    ask: 'Example 5(a): Talia types <b>48 words/min</b>. How long will it take her to type a <b>1200-word</b> essay?',
    pts: { one: [1, 48], t: [25, 1200] }, pos: { one: 0.15, t: 0.95 } },
  deli: { top: 'dollars', bot: 'grams', ft: (v) => '$' + m2(v), fb: (v) => cl(v) + ' g',
    ask: 'Example 5(b): smoked turkey costs <b>$2.38 per 100 g</b>. How much will <b>450 g</b> cost?',
    pts: { one: [100, 2.38], t: [450, 10.71] }, pos: { one: 0.3, t: 0.95 } },
  bott: { top: 'bottles', bot: 'minutes', ft: (v) => cl(v), fb: (v) => cl(v) + ' min',
    ask: 'Example 6(a): a machine fills <b>270 bottles in 45 min</b>. How many can it fill in a <b>7.5-hour</b> shift?',
    pts: { k: [45, 270], one: [1, 6], t: [450, 2700] }, pos: { k: 0.4, one: 0.08, t: 0.95 } }
};
const predict = {
  title: 'Predicting with a double number line',
  height: 420,
  minW: 900,
  capH: 92,
  choices: [{ sep: 'Example 4 check:' }, { v: 'kiran', label: 'Kiran’s pay' }, { sep: 'Example 5:' }, { v: 'talia', label: '(a) Talia’s essay' }, { v: 'deli', label: '(b) the deli' }, { sep: 'Example 6:' }, { v: 'bott', label: '(a) bottles' }],
  ask: (k) => PR[k].ask,
  make(stage, k, ex) {
    const d = PR[k], W = ex.W, X0 = 170, X1 = W - 80, YT = 160, YB = 264;
    const svg = add(stage, svgEl('svg', { width: W, height: 420, class: 'u1l5-svg' }), 0, 0);
    [[YT, BR], [YB, BLUE]].forEach(([y, col]) => {
      svgEl('line', { x1: X0, x2: X1 + 30, y1: y, y2: y, stroke: col, 'stroke-width': 3 }, svg);
      svgEl('polygon', { points: `${X1 + 40},${y} ${X1 + 28},${y - 7} ${X1 + 28},${y + 7}`, fill: col }, svg);
      svgEl('line', { x1: X0, x2: X0, y1: y - 12, y2: y + 12, stroke: col, 'stroke-width': 3 }, svg);
    });
    add(stage, box(h('div', 'u1l5-dnh t', d.top), 140), 14, YT - 18);
    add(stage, box(h('div', 'u1l5-dnh b', d.bot), 140), 14, YB - 18);
    const P = {};
    Object.entries(d.pts).forEach(([key, [u, a]]) => {
      const x = X0 + (X1 - X0) * d.pos[key];          // in order, but not to scale (so 1 h has room)
      const tk = svgEl('g', {}, svg);
      svgEl('line', { x1: x, x2: x, y1: YT - 12, y2: YT + 12, stroke: BR, 'stroke-width': 3 }, tk);
      svgEl('line', { x1: x, x2: x, y1: YB - 12, y2: YB + 12, stroke: BLUE, 'stroke-width': 3 }, tk);
      svgEl('line', { x1: x, x2: x, y1: YT + 14, y2: YB - 14, stroke: GRAY, 'stroke-width': 1.6, 'stroke-dasharray': '4 5' }, tk);
      const lt = add(stage, box(h('div', 'u1l5-dnv t', d.ft(a)), 130), x - 65, YT - 50);
      const lb = add(stage, box(h('div', 'u1l5-dnv b', d.fb(u)), 130), x - 65, YB + 16);
      hide(tk, lt, lb);
      P[key] = { x, u, a, tk, lt, lb };
    });
    const show = (p, which = 'both') => async (c) => {
      const els = [p.tk]; if (which !== 'bot') els.push(p.lt); if (which !== 'top') els.push(p.lb);
      await Promise.all(els.map((e) => c.pop(e, 320)));
    };
    const fill = (p, lab, txt) => async (c) => { lab.innerHTML = txt; lab.classList.add('new'); await c.pop(lab, 340); };
    const both = (p, q, lt, col = GREEN, hm = 30, lx = (p.x + q.x) / 2) => {
      const lab = hide(add(stage, box(h('div', 'u1l5-op', lt), 110), lx - 55, (YT + YB) / 2 - 20));
      lab.style.color = col; lab.style.borderColor = col;
      return { lab, arcs: [arc(svg, p.x, q.x, YT, true, col, 54, hm), arc(svg, p.x, q.x, YB, false, col, 54, hm)] };
    };
    const go = (A) => async (c) => { await Promise.all(A.arcs.map((a) => drawArc(c, a))); await c.pop(A.lab, 320); };
    const res = (txt) => hide(add(stage, box(h('div', 'u1l5-res', txt), 640), W / 2 - 320, 368));
    const steps = [];
    if (k === 'kiran' || k === 'bott') {
      const { k: K, one: O, t: Tt } = P, r1 = both(K, O, '÷ ' + K.u, AMBER, 18), r2 = both(O, Tt, '× ' + Tt.u, GREEN, 40, (K.x + Tt.x) / 2);
      const R = res(k === 'kiran' ? 'Kiran will earn <b>$363.00</b> for 22 h.' : 'It can fill <b>2700 bottles</b> in one shift.');
      steps.push({ cap: `Two lines: <b>${d.top}</b> on top, <b>${d.bot}</b> below. Mark what we know: <b>${d.ft(K.a)}</b> in <b>${d.fb(K.u)}</b>.`, run: show(K) });
      steps.push({ cap: `Go to <b>1 ${k === 'kiran' ? 'h' : 'min'}</b>: ÷ ${K.u} on both lines. ${T(`${k === 'kiran' ? '247.50' : '270'}\\div${K.u}=${k === 'kiran' ? '16.50' : '6'}`)}. That’s the <b>unit rate</b>.`, run: async (c) => { await show(O, 'bot')(c); await go(r1)(c); await c.pop(O.lt, 340); } });
      if (k === 'bott') steps.push({ cap: `The shift is in <b>hours</b>, the rate is per <b>minute</b>. Match the units: ${T('7.5\\times60=450')} min.`, run: show(Tt, 'bot') });
      else steps.push({ cap: 'We want <b>22 h</b>. Mark it on the hours line.', run: show(Tt, 'bot') });
      steps.push({ cap: `From 1 to ${Tt.u}: × ${Tt.u} on both lines. ${T(k === 'kiran' ? '16.50\\times22=363' : '6\\times450=2700')}.`, run: async (c) => { await go(r2)(c); await fill(Tt, Tt.lt, d.ft(Tt.a))(c); } });
      steps.push({ cap: k === 'kiran' ? 'Kiran will earn <b>$363.00</b>. The estimate was about $350, so it makes sense ✓' : 'It can fill <b>2700 bottles</b> in a 7.5-hour shift.', run: (c) => c.pop(R, 380) });
    } else if (k === 'talia') {
      const { one: O, t: Tt } = P, r = both(O, Tt, '× 25', GREEN);
      const R = res('It will take Talia <b>25 min</b>.');
      Tt.lb.innerHTML = '? min';
      steps.push({ cap: 'Two lines: <b>words</b> on top, <b>minutes</b> below. The unit rate: <b>48 words in 1 min</b>.', run: show(O) });
      steps.push({ cap: 'The essay is <b>1200 words</b>. We know the <b>amount</b>; we need the <b>minutes</b>.', run: show(Tt) });
      steps.push({ cap: `Work backwards: number of units = amount ÷ unit rate. ${T('1200\\div48=25')}.`, run: async (c) => { await go(r)(c); await fill(Tt, Tt.lb, '25 min')(c); } });
      steps.push({ cap: 'It will take her <b>25 min</b>. Check: 48 × 25 = 1200 ✓', run: (c) => c.pop(R, 380) });
    } else {
      const { one: O, t: Tt } = P, r = both(O, Tt, '× 4.5', GREEN);
      const R = res('450 g will cost <b>$10.71</b>.');
      Tt.lt.innerHTML = '$?';
      steps.push({ cap: 'Two lines: <b>dollars</b> on top, <b>grams</b> below. The rate is for <b>100 g</b>: $2.38.', run: show(O) });
      steps.push({ cap: `We want <b>450 g</b>. How many groups of 100 g? ${T('450\\div100=4.5')}.`, run: show(Tt) });
      steps.push({ cap: `So × 4.5 on both lines: ${T('4.5\\times2.38=10.71')}.`, run: async (c) => { await go(r)(c); await fill(Tt, Tt.lt, '$10.71')(c); } });
      steps.push({ cap: '450 g of turkey will cost <b>$10.71</b>.', run: (c) => c.pop(R, 380) });
    }
    return steps;
  }
};

/* =====================================================================================
 * 6. The proportion method (Full notes): cross-multiply
 * ===================================================================================== */
const PM = {
  kiran: { ask: 'Example 4, Method 2: Kiran earned <b>$247.50 for 15 h</b>. Use a proportion to find his pay for <b>22 h</b>.',
    L: ['\\$247.50', '15\\text{ h}'], R: ['\\$x', '22\\text{ h}'], cross: '15x=247.50\\times22=5445', solve: 'x=5445\\div15=363', end: 'Kiran will earn <b>$363.00</b>: the same as Method 1 ✓' },
  deli: { ask: 'Example 5(b) as a proportion: <b>$2.38 per 100 g</b>. How much will <b>450 g</b> cost?',
    L: ['\\$2.38', '100\\text{ g}'], R: ['\\$x', '450\\text{ g}'], cross: '100x=2.38\\times450=1071', solve: 'x=1071\\div100=10.71', end: '450 g will cost <b>$10.71</b> ✓' }
};
const propMethod = {
  title: 'The proportion method: cross-multiply',
  height: 340,
  minW: 860,
  choices: [{ v: 'kiran', label: 'Kiran’s pay' }, { v: 'deli', label: 'The deli' }],
  ask: (k) => PM[k].ask,
  make(stage, k, ex) {
    const d = PM[k], W = ex.W;
    const svg = add(stage, svgEl('svg', { width: W, height: 340, class: 'u1l5-svg' }), 0, 0);
    const fracAt = (x, [t, b]) => { const e = add(stage, box(h('div', 'u1l5-pfr', `<div>${T(t)}</div><i></i><div>${T(b)}</div>`), 170, 130), x, 24); return e; };
    const eq = add(stage, box(h('div', 'u1l5-peq'), 440, 150), 30, 14);
    fracAt(40, d.L); fracAt(300, d.R);
    add(eq, box(h('div', 'u1l5-peqs', T('=')), 60), 205, 50);
    const x1 = svgEl('line', { x1: 190, y1: 126, x2: 330, y2: 62, stroke: RED, 'stroke-width': 4, 'stroke-linecap': 'round' }, svg);
    const x2 = svgEl('line', { x1: 190, y1: 62, x2: 330, y2: 126, stroke: BLUE, 'stroke-width': 4, 'stroke-linecap': 'round' }, svg);
    hide(x1, x2);
    const tag = hide(add(stage, box(h('div', 'u1l5-ptag', 'same units in the same places:<br><b>dollars</b> on top, <b>' + (k === 'kiran' ? 'hours' : 'grams') + '</b> on the bottom'), 400), 500, 40));
    const l1 = hide(add(stage, box(h('div', 'u1l5-pl', T(d.cross)), W - 80), 40, 196));
    const l2 = hide(add(stage, box(h('div', 'u1l5-pl', T(d.solve)), W - 80), 40, 250));
    return [
      { cap: 'Set up a proportion. Put the <b>same units</b> in the same places.', run: async (c) => { await c.fadeIn(eq); await c.fadeIn(tag); } },
      { cap: 'Cross-multiply: multiply along each diagonal.', run: async (c) => { await appear(c, x1, 300); await appear(c, x2, 300); } },
      { cap: `${T(d.cross)}.`, run: (c) => c.fadeIn(l1) },
      { cap: `Divide to get ${T('x')} alone: ${T(d.solve)}.`, run: (c) => c.fadeIn(l2) },
      { cap: d.end, run: (c) => pulse(c, l2, 1.06, 420) }
    ];
  }
};

/* =====================================================================================
 * 7. Paint cans: units must cover the whole wall, so round UP
 * ===================================================================================== */
const PC = {
  ty: { area: 160, per: 35, ask: 'Example 6(b): one can of paint covers <b>35 m²</b>. Ty needs to paint <b>160 m²</b> of walls. How many cans should he buy?' },
  n42: { area: 147, per: 35, ask: 'Watch out: a room has <b>147 m²</b> of walls, and one can covers <b>35 m²</b>. That’s 4.2 cans. How many do you buy?' }
};
const paintCans = {
  title: 'Whole cans: round UP',
  height: 400,
  minW: 900,
  choices: [{ sep: 'Example 6(b) check:' }, { v: 'ty', label: 'Ty’s walls' }, { sep: 'Watch out:' }, { v: 'n42', label: '4.2 cans' }],
  ask: (k) => PC[k].ask,
  make(stage, k, ex) {
    const d = PC[k], W = ex.W, q = d.area / d.per, n = Math.ceil(q - 1e-9), fl = Math.floor(q + 1e-9);
    const qs = k === 'ty' ? '4.57\\ldots' : '4.2';
    const WX = 60, WY = 160, WH = 130, s = (W - 2 * WX - 60) / (n * d.per), WW_ = d.area * s;
    const svg = add(stage, svgEl('svg', { width: W, height: 400, class: 'u1l5-svg' }), 0, 0);
    svgEl('rect', { x: WX, y: WY, width: WW_, height: WH, fill: '#efe9dd', stroke: INK, 'stroke-width': 3 }, svg);
    const wl = add(stage, box(h('div', 'u1l5-wall', `wall: <b>${d.area} m²</b>`), WW_), WX, WY + WH + 8);
    const paint = [];
    for (let i = 0; i < n; i++) {
      const x = WX + i * d.per * s, wFull = d.per * s, wIn = Math.min(wFull, WX + WW_ - x);
      const r = svgEl('rect', { x, y: WY + 3, width: 0, height: WH - 6, fill: i % 2 ? '#7fb0e8' : '#5d97dc', opacity: 0.9 }, svg);
      const over = i === n - 1 && wIn < wFull ? svgEl('rect', { x: WX + WW_, y: WY + 3, width: wFull - wIn, height: WH - 6, fill: 'none', stroke: '#5d97dc', 'stroke-width': 2.5, 'stroke-dasharray': '6 5' }, svg) : null;
      if (over) hide(over);
      const can = add(stage, box(h('div', 'u1l5-can', `<i></i><b>can ${i + 1}</b><small>35 m²</small>`), Math.min(110, wFull - 8)), x + (wFull - Math.min(110, wFull - 8)) / 2, 40);
      hide(can);
      paint.push({ r, wIn, can, over, x });
    }
    const gapX = WX + fl * d.per * s, gapW = WW_ - fl * d.per * s;
    const gap = svgEl('rect', { x: gapX, y: WY, width: gapW, height: WH, fill: 'rgba(201,58,51,.12)', stroke: RED, 'stroke-width': 4 }, svg); hide(gap);
    const gapL = hide(add(stage, box(h('div', 'u1l5-gapl', `${d.area - fl * d.per} m²<br>bare!`), Math.max(gapW, 90)), gapX + gapW / 2 - Math.max(gapW, 90) / 2, WY + 36));
    const calc = hide(add(stage, box(h('div', 'u1l5-res sm', `${T(`${d.area}\\div${d.per}=${qs}`)} cans`), 360), W - 380, 334));
    const st = hide(stamp(stage, `buy ${n} cans`, { ok: true, x: W / 2 - 80, y: 348, rotate: -5 }));
    const roll = (i) => async (c) => { const p = paint[i]; await c.pop(p.can, 300); await tween(c, 600, (t) => { p.r.setAttribute('width', p.wIn * t); }); };
    return [
      { cap: `The walls: <b>${d.area} m²</b>. One can covers <b>${d.per} m²</b>.`, run: (c) => pulse(c, wl, 1.06, 400) },
      { cap: `Divide: ${T(`${d.area}\\div${d.per}=${qs}`)} cans. But a store won’t sell you part of a can!`, run: (c) => c.pop(calc, 360) },
      { cap: `Try ${fl} cans: ${T(`${fl}\\times${d.per}=${fl * d.per}`)} m².`, run: async (c) => { for (let i = 0; i < fl; i++) await roll(i)(c); } },
      { cap: `<b>${d.area - fl * d.per} m²</b> is still bare. ${fl} cans are <b>not enough</b>.`, run: async (c) => { await appear(c, gap, 300); await c.pop(gapL, 340); await shake(c, gapL); } },
      { cap: `<b>Round up</b>: buy <b>${n} cans</b>. A little paint is left over, and that’s fine.`, run: async (c) => { await Promise.all([c.anim(gap, [{ opacity: 1 }, { opacity: 0 }], 250), c.anim(gapL, [{ opacity: 1 }, { opacity: 0 }], 250)]); await roll(n - 1)(c); if (paint[n - 1].over) await appear(c, paint[n - 1].over, 300); await stampIn(c, st); } }
    ];
  }
};

/* =====================================================================================
 * 8. The road trip: odometer, fuel gauge and litres used (L/100 km)
 * ===================================================================================== */
const FT = {
  dana: { ask: 'Example 7: on a road trip, Dana’s pickup truck used <b>55.2 L</b> of gas to travel <b>480 km</b>. What is its fuel consumption in L/100 km?', km: 480, L: 55.2, tank: 98, car: 'truck' },
  sam: { ask: 'Example 8: Calgary to Banff is about <b>130 km</b> each way. Sam’s car uses <b>7.4 L/100 km</b>, and gas costs <b>$1.42/L</b>. (a) How many litres for the round trip? (b) What will the gas cost?', km: 260, L: 19.24, tank: 50, car: 'car' },
  why: { ask: 'Why per 100 km? A car burns <b>0.078 L</b> of gas in 1 km. How much in 100 km?', km: 100, L: 7.8, tank: 50, car: 'car' }
};
function carSvg(svg, truck) {
  const g = svgEl('g', {}, svg);
  if (truck) {
    svgEl('path', { d: 'M-46 -6 V-26 H-4 V-6 Z', fill: '#4a6fa5', stroke: '#24395e', 'stroke-width': 2 }, g);
    svgEl('path', { d: 'M-4 -6 V-34 H22 L34 -18 H46 V-6 Z', fill: '#c93a33', stroke: '#7a1d18', 'stroke-width': 2 }, g);
    svgEl('path', { d: 'M2 -30 H19 L27 -19 H2 Z', fill: '#cfe3f5' }, g);
  } else {
    svgEl('path', { d: 'M-40 -6 V-20 Q-36 -26 -26 -26 L-16 -38 H16 L28 -26 Q40 -24 42 -16 V-6 Z', fill: '#1f5bd6', stroke: '#123a8c', 'stroke-width': 2 }, g);
    svgEl('path', { d: 'M-12 -34 H0 V-26 H-20 Z M4 -34 H14 L22 -26 H4 Z', fill: '#cfe3f5' }, g);
  }
  [-26, 26].forEach((x) => { svgEl('circle', { cx: x, cy: -4, r: 9, fill: '#222' }, g); svgEl('circle', { cx: x, cy: -4, r: 3.5, fill: '#bbb' }, g); });
  return g;
}
const fuelTrip = {
  title: 'Fuel economy on a road trip',
  height: 350,
  minW: 900,
  capH: 92,
  choices: [{ sep: 'Example 7 check:' }, { v: 'dana', label: 'Dana’s truck' }, { sep: 'Example 8 check:' }, { v: 'sam', label: 'Sam’s Banff trip' }, { sep: 'Notes:' }, { v: 'why', label: 'Why per 100 km?' }],
  ask: (k) => FT[k].ask,
  make(stage, k, ex) {
    const d = FT[k], W = ex.W, RX0 = 70, RX1 = W - 70, RY = 120, kmx = (km) => RX0 + (RX1 - RX0) * km / d.km;
    const svg = add(stage, svgEl('svg', { width: W, height: 350, class: 'u1l5-svg' }), 0, 0);
    // sky, mountains for the Banff trip, road
    svgEl('rect', { x: 0, y: 0, width: W, height: RY + 6, fill: '#eef4fb' }, svg);
    if (k === 'sam') svgEl('path', { d: `M${kmx(130) - 150} ${RY} L${kmx(130) - 80} ${RY - 70} L${kmx(130) - 30} ${RY - 30} L${kmx(130) + 20} ${RY - 86} L${kmx(130) + 90} ${RY} Z`, fill: '#b9c4d3' }, svg);
    svgEl('rect', { x: 0, y: RY, width: W, height: 34, fill: '#5b5f66' }, svg);
    svgEl('line', { x1: 0, x2: W, y1: RY + 17, y2: RY + 17, stroke: '#f2d36b', 'stroke-width': 3, 'stroke-dasharray': '18 14' }, svg);
    // 100 km posts
    const posts = [], postL = [], segL = [];
    for (let km = 100; km < d.km - 1e-9; km += 100) {
      const x = kmx(km), g = svgEl('g', {}, svg);
      svgEl('line', { x1: x, x2: x, y1: RY + 34, y2: RY + 62, stroke: INK, 'stroke-width': 3 }, g);
      posts.push(g);
      postL.push(add(stage, box(h('div', 'u1l5-post', km + ' km'), 90), x - 45, RY + 62));
    }
    const nSeg = Math.ceil(d.km / 100 - 1e-9);
    for (let i = 0; i < nSeg; i++) {
      const a = i * 100, b = Math.min(d.km, a + 100), x = (kmx(a) + kmx(b)) / 2, full = b - a > 99.9;
      const per = k === 'sam' || k === 'why' ? 7.4 : 11.5;
      const txt = k === 'why' ? '7.8 L' : full ? `${cl(k === 'sam' ? 7.4 : 11.5)} L` : `${cl(per * (b - a) / 100)} L`;
      segL.push(add(stage, box(h('div', 'u1l5-segl' + (full ? '' : ' part'), txt), 100), x - 50, RY - 50));
    }
    hide(...posts, ...postL, ...segL);
    const startL = add(stage, box(h('div', 'u1l5-place', k === 'sam' ? 'Calgary' : 'start'), 100), RX0 - 50, RY + 38);
    const endL = add(stage, box(h('div', 'u1l5-place', k === 'sam' ? 'Calgary' : k === 'why' ? '100 km' : '480 km'), 100), RX1 - 50, RY + 38);
    if (k === 'sam') { add(stage, box(h('div', 'u1l5-place bf', 'Banff (130 km)'), 160), kmx(130) - 80, 2); svgEl('line', { x1: kmx(130), x2: kmx(130), y1: 26, y2: RY, stroke: INK, 'stroke-width': 2, 'stroke-dasharray': '5 4' }, svg); }
    void startL; void endL;
    const car = carSvg(svg, d.car === 'truck');
    const putCar = (km) => car.setAttribute('transform', `translate(${kmx(km)} ${RY + 14})`);
    putCar(0);
    // dashboard
    const DY = 222;
    const odo = add(stage, box(h('div', 'u1l5-dash', '<small>odometer</small><b>0 km</b>'), 190), 20, DY);
    const used = add(stage, box(h('div', 'u1l5-dash u', '<small>gas used</small><b>0 L</b>'), 190), 225, DY);
    const odoB = odo.querySelector('b'), usedB = used.querySelector('b');
    const GX = 505, GY = DY + 84, GR = 70;
    const gauge = svgEl('g', {}, svg);
    svgEl('path', { d: `M${GX - GR} ${GY} A${GR} ${GR} 0 0 1 ${GX + GR} ${GY}`, fill: '#fff', stroke: INK, 'stroke-width': 4 }, gauge);
    svgEl('path', { d: `M${GX - GR + 8} ${GY} A${GR - 8} ${GR - 8} 0 0 1 ${GX - GR * 0.62} ${GY - GR * 0.7}`, fill: 'none', stroke: RED, 'stroke-width': 7 }, gauge);
    const tx = (s, x, y) => { const t = svgEl('text', { x, y, 'font-size': 20, 'font-weight': 800, fill: INK, 'text-anchor': 'middle' }, gauge); t.textContent = s; };
    tx('E', GX - GR + 16, GY - 8); tx('F', GX + GR - 16, GY - 8); tx('FUEL', GX, GY - 26);
    const needle = svgEl('line', { x1: GX, y1: GY, x2: GX, y2: GY - GR + 10, stroke: RED, 'stroke-width': 5, 'stroke-linecap': 'round' }, gauge);
    svgEl('circle', { cx: GX, cy: GY, r: 8, fill: INK }, gauge);
    const setNeedle = (Lu) => { const f = 1 - Lu / d.tank, a = (-90 + 180 * f) * Math.PI / 180; needle.setAttribute('x2', GX + (GR - 10) * Math.sin(a)); needle.setAttribute('y2', GY - (GR - 10) * Math.cos(a)); };
    setNeedle(0);
    const glab = add(stage, box(h('div', 'u1l5-post', 'fuel gauge'), 140), GX - 70, GY + 6); void glab;
    const out = add(stage, box(h('div', 'u1l5-out'), W - 610), 595, DY - 6);
    const outLines = [];
    const addOut = (html, cls = '') => { const e = hide(out.appendChild(h('div', 'u1l5-ol ' + cls, html))); outLines.push(e); return e; };
    const drive = (fromKm, toKm, fromL, toL, ms) => (c) => tween(c, ms, (t) => {
      const km = fromKm + (toKm - fromKm) * t, Lu = fromL + (toL - fromL) * t;
      putCar(km); odoB.textContent = Math.round(km) + ' km'; usedB.textContent = (toL < 1 ? Lu.toFixed(3) : Lu.toFixed(1)) + ' L'; setNeedle(Lu);
    }, lin);
    const steps = [];
    if (k === 'dana') {
      const o1 = addOut(`${T('480\\div100=4.8')} groups of 100 km`), o2 = addOut(T('55.2\\div480\\times100=11.5')), o3 = addOut('<b>11.5 L/100 km</b>', 'big');
      steps.push({ cap: 'Dana drives <b>480 km</b>. Watch the odometer and the gas used: <b>55.2 L</b>.', run: async (c) => { await drive(0, 480, 0, 55.2, 3000)(c); usedB.textContent = '55.2 L'; } });
      steps.push({ cap: `Estimate: 480 km is about 5 × 100 km, and ${T('55\\div5=11')}: about 11 L for each 100 km.`, run: async (c) => { await Promise.all([...posts, ...postL].map((e, i) => appear(c, e, 250, { delay: i * 60 }))); await c.fadeIn(o1); } });
      steps.push({ cap: `Exact: litres ÷ km × 100. ${T('55.2\\div480\\times100=11.5')}.`, run: async (c) => { await c.fadeIn(o2); await Promise.all(segL.map((e, i) => c.pop(e, 300, { delay: i * 90 }))); } });
      steps.push({ cap: 'Every 100 km burns <b>11.5 L</b> (the last 80 km burns 9.2 L). Dana’s truck uses <b>11.5 L/100 km</b>.', run: (c) => c.pop(o3, 380) });
    } else if (k === 'sam') {
      const o1 = addOut(`round trip: ${T('2\\times130=260')} km`), o2 = addOut(T('7.4\\times260\\div100=19.24') + ' L'), o3 = addOut(`${T('19.24\\times1.42=27.3208')}`), o4 = addOut('gas costs <b>$27.32</b>', 'big');
      steps.push({ cap: `(a) There <b>and back</b>: ${T('2\\times130=260')} km.`, run: (c) => c.fadeIn(o1) });
      steps.push({ cap: 'The car uses <b>7.4 L</b> for every 100 km.', run: async (c) => { await Promise.all([...posts, ...postL].map((e) => appear(c, e, 250))); await Promise.all(segL.slice(0, 2).map((e, i) => c.pop(e, 300, { delay: i * 120 }))); } });
      steps.push({ cap: `Drive the round trip. Fuel needed = L/100 km × km ÷ 100: ${T('7.4\\times260\\div100=19.24')} L.`, run: async (c) => { await drive(0, 260, 0, 19.24, 2800)(c); usedB.textContent = '19.24 L'; await c.pop(segL[2], 300); await c.fadeIn(o2); } });
      steps.push({ cap: `(b) Each litre costs $1.42: ${T('19.24\\times1.42=27.3208')}.`, run: (c) => c.fadeIn(o3) });
      steps.push({ cap: 'Round to the cent at the <b>end</b>: the gas will cost <b>$27.32</b>.', run: (c) => c.pop(o4, 380) });
    } else {
      const o1 = addOut('1 km: <b>0.078 L</b>'), o2 = addOut(T('0.078\\times100=7.8') + ' L'), o3 = addOut('<b>7.8 L/100 km</b>', 'big');
      steps.push({ cap: 'Drive just <b>1 km</b>. The car burns <b>0.078 L</b>: a tiny number that is hard to read.', run: async (c) => { await drive(0, 1, 0, 0.078, 900)(c); usedB.textContent = '0.078 L'; await c.fadeIn(o1); } });
      steps.push({ cap: `Keep going to <b>100 km</b>: ${T('0.078\\times100=7.8')} L. A friendlier number!`, run: async (c) => { await drive(1, 100, 0.078, 7.8, 2400)(c); usedB.textContent = '7.8 L'; await c.pop(segL[0], 300); await c.fadeIn(o2); } });
      steps.push({ cap: 'So we say <b>7.8 L/100 km</b>. A <b>lower</b> number means <b>less</b> gas: better.', run: (c) => c.pop(o3, 380) });
    }
    return steps;
  }
};

/* =====================================================================================
 * 9. The race: compare for ONE unit (typists for 1 min, vehicles for 100 km)
 * ===================================================================================== */
const RC = {
  type: { ask: 'Example 9(a): Noah types <b>504 words in 7 min</b>. Priya types <b>620 words in 8 min</b>. Who types faster?',
    A: { name: 'Noah', tot: 504, per: 7, r: 72 }, B: { name: 'Priya', tot: 620, per: 8, r: 77.5 }, unit: 'words', pu: 'min', one: '1 minute', better: 'higher' },
  fuel: { ask: 'Example 9(b): an SUV used <b>46.8 L</b> of gas for <b>520 km</b>. A hatchback used <b>31.5 L</b> for <b>450 km</b>. Which uses less fuel?',
    A: { name: 'SUV', tot: 46.8, per: 520, r: 9 }, B: { name: 'Hatchback', tot: 31.5, per: 450, r: 7 }, unit: 'L', pu: 'km', one: '100 km', better: 'lower' }
};
const race = {
  title: 'Compare for the same ONE unit',
  height: 420,
  minW: 900,
  capH: 92,
  choices: [{ sep: 'Example 9 check:' }, { v: 'type', label: '(a) two typists' }, { v: 'fuel', label: '(b) SUV vs hatchback' }],
  ask: (k) => RC[k].ask,
  make(stage, k, ex) {
    const d = RC[k], W = ex.W, TX0 = 190, TX1 = W - 190, TW = TX1 - TX0, fuel = k === 'fuel';
    const lane = (p, y, col) => {
      add(stage, box(h('div', 'u1l5-lname', `<b>${p.name}</b>`), 170), 14, y + 14);
      const tr = add(stage, box(h('div', 'u1l5-track'), TW, 64), TX0, y);
      const fill = tr.appendChild(h('div', 'u1l5-fill')); fill.style.background = col; fill.style.width = '0px';
      const val = add(stage, box(h('div', 'u1l5-lval', ''), 170), TX1 + 12, y + 4);
      const sub = add(stage, box(h('div', 'u1l5-lsub', ''), 170), TX1 + 12, y + 38);
      return { p, fill, val, sub };
    };
    const A = lane(d.A, 52, fuel ? '#c27a0e' : '#6e4a1c'), B = lane(d.B, 146, fuel ? '#12805a' : '#1f5bd6');
    const clock = add(stage, box(h('div', 'u1l5-clock', ''), 400), W / 2 - 200, 12);
    const max1 = Math.max(d.A.tot, d.B.tot) * 1.04, maxU = Math.max(d.A.r, d.B.r) * 1.15;
    const fmtV = (v) => (fuel ? v.toFixed(1) + ' L' : Math.round(v * 2) / 2 + ' words');
    const set = (L, v, max) => { L.fill.style.width = (TW * v / max) + 'px'; L.val.innerHTML = `<b>${fmtV(v)}</b>`; };
    const res = hide(add(stage, box(h('div', 'u1l5-res u1l5-rres'), W - 240), 120, 232));
    const better = d.better === 'higher' ? (d.A.r > d.B.r ? d.A : d.B) : (d.A.r < d.B.r ? d.A : d.B);
    const st = hide(stamp(stage, fuel ? `${better.name}: less fuel` : `${better.name} is faster`, { ok: true, x: W / 2, y: 366, rotate: -4, size: 'lg' }));
    const rA = fuel ? T(`46.8\\div520\\times100=9.0`) : T('504\\div7=72'), rB = fuel ? T('31.5\\div450\\times100=7.0') : T('620\\div8=77.5');
    res.innerHTML = `<div>${d.A.name}: ${rA} ${fuel ? 'L/100 km' : 'words/min'}</div><div>${d.B.name}: ${rB} ${fuel ? 'L/100 km' : 'words/min'}</div>`;
    return [
      { cap: fuel ? 'The SUV: <b>46.8 L</b> for <b>520 km</b>. The hatchback: <b>31.5 L</b> for <b>450 km</b>.' : 'Noah: <b>504 words</b> in <b>7 min</b>. Priya: <b>620 words</b> in <b>8 min</b>.',
        run: async (c) => { clock.innerHTML = fuel ? 'the whole trips' : 'the whole typing time'; A.sub.textContent = fuel ? 'in 520 km' : 'in 7 min'; B.sub.textContent = fuel ? 'in 450 km' : 'in 8 min';
          await tween(c, 1400, (t) => { set(A, d.A.tot * t, max1); set(B, d.B.tot * t, max1); }); set(A, d.A.tot, max1); set(B, d.B.tot, max1); } },
      { cap: fuel ? 'Different distances, so that’s not fair. Compare both for the same <b>100 km</b>.' : 'Priya typed more, but she also typed <b>longer</b>. Not fair! Race them for <b>1 minute</b> each.',
        run: async (c) => { await tween(c, 500, (t) => { set(A, d.A.tot * (1 - t), max1); set(B, d.B.tot * (1 - t), max1); }); A.sub.textContent = ''; B.sub.textContent = '';
          await tween(c, 2400, (t) => { clock.innerHTML = fuel ? `distance: <b>${Math.round(100 * t)} km</b>` : `time: <b>0:${String(Math.round(60 * t)).padStart(2, '0')}</b>`.replace('0:60', '1:00'); set(A, d.A.r * t, maxU); set(B, d.B.r * t, maxU); }, lin);
          A.sub.textContent = fuel ? 'per 100 km' : 'per minute'; B.sub.textContent = fuel ? 'per 100 km' : 'per minute'; } },
      { cap: `The unit rates: ${d.A.name} ${rA}, ${d.B.name} ${rB}.`, run: (c) => c.fadeIn(res) },
      { cap: fuel ? 'For fuel, <b>lower is better</b>: 7.0 is lower than 9.0. <b>The hatchback uses less fuel.</b>' : `For typing, <b>higher is better</b>. <b>Priya types faster</b>, by ${T('77.5-72=5.5')} words/min.`,
        run: async (c) => { await pulse(c, (better === d.A ? A : B).val, 1.2, 500); await stampIn(c, st); } }
    ];
  }
};

/* =====================================================================================
 * 10. The rate converter: change one unit at a time
 * ===================================================================================== */
const CV = {
  a: { ask: 'Example 10(a): Lena walks at <b>4.8 km/h</b>. Write her speed in m/min.',
    cards: [['4.8\\text{ km}', '1\\text{ h}'], ['4800\\text{ m}', '1\\text{ h}'], ['4800\\text{ m}', '60\\text{ min}'], ['80\\text{ m}', '1\\text{ min}']], hl: [null, 't', 'b', 'tb'],
    ops: ['top: km → m<br><b>× 1000</b>', 'bottom: 1 h = 60 min', '÷ 60 for<br><b>1 min</b>'],
    calc: ['4.8\\times1000=4800', '4800\\div60=80'], res: 'Lena walks <b>80 m/min</b>.' },
  b: { ask: 'Example 10(b): an escalator moves at <b>30 m/min</b>. Write its speed in km/h.',
    cards: [['30\\text{ m}', '1\\text{ min}'], ['1800\\text{ m}', '60\\text{ min}'], ['1800\\text{ m}', '1\\text{ h}'], ['1.8\\text{ km}', '1\\text{ h}']], hl: [null, 'tb', 'b', 't'],
    ops: ['per minute → per hour<br><b>× 60</b>', '60 min = 1 h', 'top: m → km<br><b>÷ 1000</b>'],
    calc: ['30\\times60=1800', '1800\\div1000=1.8'], res: 'The escalator moves at <b>1.8 km/h</b>.' },
  c: { ask: 'Example 10(c): Ethan earns <b>$18.60/h</b>. How much is that per minute?',
    cards: [['\\$18.60', '1\\text{ h}'], ['\\$18.60', '60\\text{ min}'], ['\\$0.31', '1\\text{ min}']], hl: [null, 'b', 'tb'],
    ops: ['1 h = 60 min', '÷ 60 for<br><b>1 min</b>'],
    calc: ['18.60\\div60=0.31'], res: 'He earns <b>$0.31/min</b> (31 cents).' }
};
const convert = {
  title: 'Converting a rate: one unit at a time',
  height: 380,
  minW: 900,
  capH: 92,
  choices: [{ sep: 'Example 10 check:' }, { v: 'a', label: '(a) km/h → m/min' }, { v: 'b', label: '(b) m/min → km/h' }, { v: 'c', label: '(c) $/h → $/min' }],
  ask: (k) => CV[k].ask,
  make(stage, k, ex) {
    const d = CV[k], W = ex.W, n = d.cards.length, CW = 170, GAP = (W - 40 - n * CW) / (n - 1), CY = 40, CH = 150;
    const cx = (i) => 20 + i * (CW + GAP);
    const svg = add(stage, svgEl('svg', { width: W, height: 380, class: 'u1l5-svg' }), 0, 0);
    const cards = d.cards.map(([t, b], i) => {
      const e = add(stage, box(h('div', 'u1l5-rcard' + (i === n - 1 ? ' fin' : ''), `<div class="t">${T(t)}</div><div class="bar"></div><div class="b">${T(b)}</div>`), CW, CH), cx(i), CY);
      if (i) hide(e);
      return e;
    });
    const arrows = [], ops = [];
    for (let i = 0; i < n - 1; i++) {
      const x1 = cx(i) + CW + 6, x2 = cx(i + 1) - 6, y = CY + CH / 2;
      const g = svgEl('g', {}, svg);
      svgEl('line', { x1, x2: x2 - 10, y1: y, y2: y, stroke: GREEN, 'stroke-width': 4 }, g);
      svgEl('polygon', { points: `${x2},${y} ${x2 - 14},${y - 8} ${x2 - 14},${y + 8}`, fill: GREEN }, g);
      hide(g); arrows.push(g);
      ops.push(hide(add(stage, box(h('div', 'u1l5-cop', d.ops[i]), CW + GAP - 10), (x1 + x2) / 2 - (CW + GAP - 10) / 2, CY + CH + 14)));
    }
    const res = hide(add(stage, box(h('div', 'u1l5-res', d.res), 520), W / 2 - 260, 300));
    const mark = (i) => { const e = cards[i], w = d.hl[i] || ''; if (w.includes('t')) e.querySelector('.t').classList.add('ch'); if (w.includes('b')) e.querySelector('.b').classList.add('ch'); };
    const stepTo = (i) => async (c) => { mark(i); await appear(c, arrows[i - 1], 260); await c.fadeIn(ops[i - 1]); await c.fadeIn(cards[i], 380, { from: 'translateX(-30px)' }); };
    const C = (i) => T(d.calc[i]);
    let caps;
    if (k === 'a') caps = ['Lena walks <b>4.8 km in 1 h</b>. We want <b>metres per minute</b>.', `Top first: km to m. ${C(0)} m.`, 'Now the bottom: 1 h is <b>60 min</b>. Same walk: 4800 m in 60 min.', `For <b>1 min</b>, divide top and bottom by 60: ${C(1)}.`];
    else if (k === 'b') caps = ['The escalator moves <b>30 m in 1 min</b>. We want <b>km per hour</b>.', `Per minute to per hour: in 60 min it moves ${C(0)} m.`, '60 min is <b>1 h</b>: 1800 m in 1 h.', `Now the top: m to km. ${C(1)} km.`];
    else caps = ['Ethan earns <b>$18.60 in 1 h</b>. We want <b>dollars per minute</b>.', '1 h is <b>60 min</b>: $18.60 in 60 min.', `For <b>1 min</b>, divide by 60: ${C(0)}.`];
    const steps = [{ cap: caps[0], run: (c) => pulse(c, cards[0], 1.05, 400) }];
    for (let i = 1; i < n; i++) steps.push({ cap: caps[i], run: stepTo(i) });
    steps.push({ cap: d.res, run: (c) => c.pop(res, 380) });
    return steps;
  }
};

mountExplainers({ rateOrRatio, unitRate, wrongWay, heartRate, predict, propMethod, paintCans, fuelTrip, race, convert });
void sleep;

/* ============ Stand Up Break! — unit rates, predicting, fuel and comparing, at the whiteboards ============ */
{
  const JOBS = ['a grocery store', 'a coffee shop', 'a hardware store', 'a movie theatre', 'a garden centre', 'a car wash', 'a pizza place'];
  const NAMES = ['Maya', 'Owen', 'Jada', 'Eli', 'Noor', 'Ravi', 'Tess', 'Luis'];
  const dd = (c) => (c / 100).toFixed(2);
  standup('u1l5', {
    intro: 'Find the unit rate first. Keep the units with every number.',
    levels: {
      BEG: (r) => r.pick([
        () => { // hourly wage
          const w = 5 * r.int(310, 440), hrs = r.int(4, 9), tot = w * hrs, nm = r.pick(NAMES);
          return { text: `${nm} earns <b>$${dd(tot)}</b> for a <b>${hrs}-hour</b> shift at ${r.pick(JOBS)}. What is ${nm}’s hourly wage?`, q: '',
            a: [`${dd(tot)}\\div${hrs}=${dd(w)}`, `\\$${dd(w)}\\text{/h}`] };
        },
        () => { // speed
          const s = r.int(6, 11) * 10, hrs = r.pick([2, 3, 4, 5]);
          return { text: `A bus travels <b>${s * hrs} km</b> in <b>${hrs} h</b>. What is its speed in km/h?`, q: '', a: [`${s * hrs}\\div${hrs}=${s}`, `${s}\\text{ km/h}`] };
        }
      ])(),
      PRG: (r) => r.pick([
        () => { // predict pay
          const w = 5 * r.int(310, 440), h1 = r.int(5, 9), H = r.int(12, 30), nm = r.pick(NAMES);
          return { text: `${nm} earns <b>$${dd(w * h1)}</b> for <b>${h1} h</b> of work. At this rate, how much will ${nm} earn for <b>${H} h</b>? Estimate first.`, q: '',
            a: [`\\text{unit rate: }${dd(w * h1)}\\div${h1}=\\$${dd(w)}\\text{/h}`, `${dd(w)}\\times${H}=\\$${dd(w * H)}`] };
        },
        () => { // fuel needed and cost
          const f = r.int(55, 120), km = r.int(2, 9) * 50, p = r.int(129, 159), L = f * km / 1000, cost = Math.round(L * p);
          return { text: `A car uses <b>${(f / 10).toFixed(1)} L/100 km</b>. How many litres of gas does it need for a <b>${km} km</b> trip? Gas costs <b>$${dd(p)}/L</b>. What will the gas cost?`, q: '',
            a: [`${(f / 10).toFixed(1)}\\times${km}\\div100=${cl(L)}\\text{ L}`, `${cl(L)}\\times${dd(p)}\\approx\\$${dd(cost)}`] };
        }
      ])(),
      MAS: (r) => r.pick([
        () => { // compare two job offers
          let wA, wB; do { wA = 5 * r.int(320, 420); wB = 5 * r.int(320, 420); } while (Math.abs(wA - wB) < 10);
          const hA = r.pick([6, 7, 8]), hB = r.pick([4, 5]), [jA, jB] = r.shuffle(JOBS).slice(0, 2);
          const best = wA > wB ? jA : jB;
          return { text: `Two job offers: ${jA} pays <b>$${dd(wA * hA)}</b> for a ${hA}-hour shift. ${jB[0].toUpperCase() + jB.slice(1)} pays <b>$${dd(wB * hB)}</b> for a ${hB}-hour shift. Which pays more per hour? How much more in a 20-hour week?`, q: '',
            a: [`${dd(wA * hA)}\\div${hA}=\\$${dd(wA)}\\text{/h}`, `${dd(wB * hB)}\\div${hB}=\\$${dd(wB)}\\text{/h}`, `\\text{${best} pays more: }(${dd(Math.max(wA, wB))}-${dd(Math.min(wA, wB))})\\times20=\\$${dd(Math.abs(wA - wB) * 20)}`] };
        },
        () => { // convert km/h to m/min
          const k = r.int(4, 15), s = (0.6 * k).toFixed(1), mm = 10 * k;
          return { text: `A hiker walks at <b>${s} km/h</b>. Write the speed in <b>m/min</b>. Then check your answer by going back to km/h.`, q: '',
            a: [`${s}\\times1000=${cl(Number(s) * 1000)}\\text{ m in 60 min}`, `${cl(Number(s) * 1000)}\\div60=${mm}\\text{ m/min}`, `\\text{check: }${mm}\\times60=${mm * 60}\\text{ m}=${s}\\text{ km}`] };
        }
      ])()
    }
  });
}
