/* Math 10-3 · Unit 4 · Lesson 5 — Converting Mass Between SI and Imperial.
 * Explainers: the two-sided kitchen scale (lb ring and kg ring), the balance that tips to the heavier mass (Example 1a),
 * the quick-estimate bars (Example 1b), the unit-factor machine that crosses out units (Example 2), bigger or smaller?
 * kg blocks vs lb blocks (Full notes), pounds and ounces (zoom into the last pound, Example 3), Tamika's suitcase on
 * the limit gauges (Example 4), Jun's parcel climbing the courier's price steps (Example 5), the meat tray of 2.2 one-pound
 * packages (Example 7) and the barbecue patty by patty (Full notes). Then the Gimli Glider history animation and the
 * Stand Up Break. */
import { h, add, box, tex, svgEl, tween, pulse, stamp, stampIn, mountExplainers } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const rnd = (v, d = 2) => Math.round((v + (v >= 0 ? 1e-9 : -1e-9)) * 10 ** d) / 10 ** d;
const fx = (v, d = 2) => rnd(v, d).toFixed(d);
const M = (v) => '$' + fx(v, 2);
const lerp = (a, b, t) => a + (b - a) * t;
const cbox = (cls, html) => h('div', cls + ' u4l5-c', `<div>${html}</div>`);
const lcd = (stage, e, r, x, y, w = 270) => hide(add(stage, box(h('div', 'u4l5-lcd', `<div class="e">${e}</div><div class="r">${r}</div>`), w, 66), x, y));
const mkSvg = (stage, w, hh, x, y) => add(stage, svgEl('svg', { width: w, height: hh, viewBox: `0 0 ${w} ${hh}`, class: 'u4l5-svg' }), x, y);
const txt = (svg, x, y, s, a = {}) => { const e = svgEl('text', Object.assign({ x, y, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 700, fill: '#1c2230' }, a), svg); e.textContent = s; return e; };
const ok = (host, s, x, y, o = {}) => hide(stamp(host, s, Object.assign({ x, y, size: 'sm' }, o)));

/* =====================================================================================
 * 1. The two-sided kitchen scale: an outer ring in pounds, an inner ring in kilograms
 * ===================================================================================== */
const DIAL = {
  butter: { label: '1 lb block of butter', kg: 0.454, lbT: 'about <b>1 lb</b>', kgT: 'about <b>0.454 kg</b> (454 g)', fact: `${T('1\\text{ lb}\\approx0.454\\text{ kg}')}: a pound is a bit <b>less than half</b> a kilogram.` },
  sugar: { label: '1 kg bag of sugar', kg: 1, lbT: 'about <b>2.2 lb</b>', kgT: 'exactly <b>1 kg</b>', fact: `${T('1\\text{ kg}\\approx2.2\\text{ lb}')}: a kilogram is a bit <b>more than 2</b> pounds.` },
  potato: { label: '5 lb bag of potatoes', kg: 5 * 0.454, lbT: '<b>5 lb</b>', kgT: `about <b>2.27 kg</b> (${T('5\\times0.454=2.27')})`, fact: 'Five pounds is not even <b>2.5 kg</b>. The kilogram number is always the <b>smaller</b> one.' },
  bread: { label: 'slice of bread (1 oz)', kg: 0.02835, lbT: 'the needle <b>barely moves</b> (1 oz is 1/16 lb)', kgT: 'about <b>28 g</b> (0.028 kg)', fact: `${T('1\\text{ oz}\\approx28.35\\text{ g}')}: about 30 g. It takes about <b>35 oz</b> to make 1 kg.` }
};
const PIC = {
  butter: '<rect x="-46" y="-34" width="92" height="34" rx="4" fill="#ffe08a" stroke="#b8860b" stroke-width="3"/><rect x="-46" y="-34" width="92" height="12" fill="#f6c94a"/><text x="0" y="-8" font-size="15" font-weight="800" fill="#7a5a10" text-anchor="middle">BUTTER</text>',
  sugar: '<path d="M-40 0 L-36 -60 Q0 -70 36 -60 L40 0 Z" fill="#fff" stroke="#8aa0b8" stroke-width="3"/><rect x="-30" y="-44" width="60" height="26" rx="4" fill="#cfe0fb"/><text x="0" y="-26" font-size="14" font-weight="800" fill="#1f5bd6" text-anchor="middle">SUGAR</text>',
  potato: '<path d="M-52 0 Q-58 -40 -38 -62 L38 -62 Q58 -40 52 0 Z" fill="#c9a26b" stroke="#7a5a2a" stroke-width="3"/><ellipse cx="-20" cy="-26" rx="12" ry="9" fill="#a67c43"/><ellipse cx="16" cy="-18" rx="13" ry="9" fill="#a67c43"/><ellipse cx="6" cy="-44" rx="11" ry="8" fill="#a67c43"/>',
  bread: '<path d="M-26 0 L-26 -30 Q-34 -50 -14 -54 Q0 -60 14 -54 Q34 -50 26 -30 L26 0 Z" fill="#f2d39b" stroke="#a8742a" stroke-width="3"/><path d="M-18 -4 L-18 -30 Q-24 -44 -10 -47 Q0 -51 10 -47 Q24 -44 18 -30 L18 -4 Z" fill="#fff4dc"/>'
};
const dial = {
  title: 'The two-sided scale: pounds outside, kilograms inside',
  height: 410, minW: 900,
  choices: [{ v: 'butter', label: 'Butter' }, { v: 'sugar', label: 'Sugar' }, { v: 'potato', label: 'Potatoes' }, { v: 'bread', label: 'Bread' }],
  ask: (k) => `Put a <b>${DIAL[k].label}</b> on a kitchen scale that shows <b>both</b> pounds and kilograms. What does each ring read?`,
  make(stage, k, ex) {
    const d = DIAL[k], W = ex.W;
    const S = mkSvg(stage, 440, 410, 10, 0), cx = 220, cy = 250, R = 140;
    const ang = (kg) => (-150 + 300 * Math.min(kg, 5) / 5) * Math.PI / 180;
    const pt = (kg, r) => [cx + r * Math.sin(ang(kg)), cy - r * Math.cos(ang(kg))];
    svgEl('rect', { x: 40, y: 92, width: 360, height: 314, rx: 30, fill: '#e8e3d8', stroke: '#6b665c', 'stroke-width': 4 }, S);
    svgEl('rect', { x: 70, y: 74, width: 300, height: 20, rx: 6, fill: '#b8b2a5', stroke: '#6b665c', 'stroke-width': 3 }, S);
    svgEl('circle', { cx, cy, r: R + 8, fill: '#fff', stroke: '#3a4254', 'stroke-width': 5 }, S);
    // outer ring: pounds (0 to 11)
    for (let lb = 0; lb <= 11; lb += 0.5) {
      const kg = lb * 0.454, big = lb % 1 === 0, [x1, y1] = pt(kg, R), [x2, y2] = pt(kg, R - (big ? 16 : 9));
      svgEl('line', { x1, y1, x2, y2, stroke: '#6e4a1c', 'stroke-width': big ? 3 : 2 }, S);
      if (big) { const [tx, ty] = pt(kg, R - 30); txt(S, tx, ty + 6, String(lb), { fill: '#6e4a1c', 'font-size': 17, 'font-weight': 800 }); }
    }
    // inner ring: kilograms (0 to 5)
    svgEl('circle', { cx, cy, r: 86, fill: '#eef4fb', stroke: '#1f5bd6', 'stroke-width': 2 }, S);
    for (let kg = 0; kg <= 5; kg += 0.25) {
      const big = kg % 1 === 0, mid = kg % 0.5 === 0, [x1, y1] = pt(kg, 86), [x2, y2] = pt(kg, 86 - (big ? 13 : mid ? 9 : 5));
      svgEl('line', { x1, y1, x2, y2, stroke: '#1f5bd6', 'stroke-width': big ? 3 : 1.5 }, S);
      if (big) { const [tx, ty] = pt(kg, 60); txt(S, tx, ty + 6, String(kg), { fill: '#1f5bd6', 'font-size': 16, 'font-weight': 800 }); }
    }
    txt(S, cx, cy + 72, 'lb', { fill: '#6e4a1c', 'font-size': 18, 'font-weight': 900 });
    txt(S, cx, cy + 30, 'kg', { fill: '#1f5bd6', 'font-size': 16, 'font-weight': 900 });
    const needle = svgEl('g', {}, S);
    svgEl('line', { x1: cx, y1: cy + 18, x2: cx, y2: cy - R + 4, stroke: '#c93a33', 'stroke-width': 4, 'stroke-linecap': 'round' }, needle);
    svgEl('circle', { cx, cy, r: 9, fill: '#c93a33' }, S);
    needle.style.transformBox = 'view-box'; needle.style.transformOrigin = '0 0';
    const setN = (kg) => needle.setAttribute('transform', `rotate(${-150 + 300 * Math.min(kg, 5) / 5} ${cx} ${cy})`);
    setN(0);
    const item = svgEl('g', { transform: 'translate(220 74)' }, S); item.innerHTML = PIC[k]; hide(item);
    // the readings
    const X = 470, PW = W - X - 20;
    add(stage, box(h('div', 'u4l5-dname', d.label), PW, 40), X, 22);
    const r1 = hide(add(stage, box(cbox('u4l5-read lb', `<span class="u4l5-rk">Outer ring (pounds)</span>${d.lbT}`), PW, 76), X, 82));
    const r2 = hide(add(stage, box(cbox('u4l5-read kg', `<span class="u4l5-rk">Inner ring (kilograms)</span>${d.kgT}`), PW, 76), X, 172));
    const fact = hide(add(stage, box(cbox('u4l5-fact', d.fact), PW, 110), X, 272));
    return [
      { cap: `Put the ${d.label} on the scale.`, run: async (c) => { await c.anim(item, [{ opacity: 0, transform: 'translate(220px, 30px)' }, { opacity: 1, transform: 'translate(220px, 74px)' }], 450); await tween(c, 1100, (t) => setN(d.kg * t)); } },
      { cap: `Read the <b>outer ring</b> (pounds): ${d.lbT}.`, run: (c) => c.fadeIn(r1) },
      { cap: `Read the <b>inner ring</b> (kilograms): ${d.kgT}.`, run: (c) => c.fadeIn(r2) },
      { cap: d.fact, run: (c) => c.pop(fact) }
    ];
  }
};

/* =====================================================================================
 * 1b. Which is heavier? A balance that tips once both masses are in the same unit
 * ===================================================================================== */
const PAIRS = {
  i: { a: '1 kg', b: '1 lb', side: 0, conv: '1 kg ≈ 2.2 lb', va: 2.2, vb: 1, u: 'lb', A: '2.2 lb', B: '1 lb', heavy: 0, why: '1 kg ≈ 2.2 lb, more than 1 lb' },
  ii: { a: '4 lb', b: '2 kg', side: 1, conv: '2 × 2.2 = 4.4 lb', va: 4, vb: 4.4, u: 'lb', A: '4 lb', B: '4.4 lb', heavy: 1, why: '2 kg ≈ 4.4 lb, more than 4 lb' },
  iii: { a: '1 oz', b: '25 g', side: 0, conv: '1 oz ≈ 28.35 g', va: 28.35, vb: 25, u: 'g', A: '28.35 g', B: '25 g', heavy: 0, why: '1 oz ≈ 28.35 g, more than 25 g' },
  iv: { a: '1 ton', b: '1 tonne', side: 0, conv: '1 ton ≈ 0.907 t', va: 0.907, vb: 1, u: 't', A: '0.907 t', B: '1 t', heavy: 1, why: '1 ton ≈ 0.907 t, less than 1 t' },
  v: { a: '8 oz', b: '250 g', side: 0, conv: '8 × 28.35 = 226.8 g', va: 226.8, vb: 250, u: 'g', A: '226.8 g', B: '250 g', heavy: 1, why: '8 oz ≈ 226.8 g, less than 250 g' }
};
const heavier = {
  title: 'Which is heavier? Same unit, then the balance decides',
  height: 380, minW: 860,
  choices: [{ sep: 'Example 1(a) check:' }, { v: 'i', label: '(i)' }, { v: 'ii', label: '(ii)' }, { v: 'iii', label: '(iii)' }, { v: 'iv', label: '(iv)' }, { v: 'v', label: '(v)' }],
  ask: (k) => `Example 1(a)(${k}): which is heavier, <b>${PAIRS[k].a}</b> or <b>${PAIRS[k].b}</b>?`,
  make(stage, k, ex) {
    const d = PAIRS[k], W = ex.W, S = mkSvg(stage, W, 380, 0, 0), px = W / 2, py = 92, L = Math.min(300, W / 2 - 150);
    svgEl('path', { d: `M${px - 60} 360 L${px + 60} 360 L${px + 14} ${py + 8} L${px - 14} ${py + 8} Z`, fill: '#9a6a24', stroke: '#4a3010', 'stroke-width': 3 }, S);
    const beam = svgEl('rect', { x: px - L, y: py - 6, width: 2 * L, height: 12, rx: 6, fill: '#6e4a1c' }, S);
    svgEl('circle', { cx: px, cy: py, r: 11, fill: '#e0a21a', stroke: '#4a3010', 'stroke-width': 3 }, S);
    const pan = (lab, sub) => {
      const g = svgEl('g', {}, S);
      svgEl('path', { d: 'M0 0 L-70 110 M0 0 L70 110', stroke: '#6b665c', 'stroke-width': 2.5 }, g);
      svgEl('path', { d: 'M-90 110 Q0 150 90 110 Z', fill: '#c9ccd1', stroke: '#3a4254', 'stroke-width': 3 }, g);
      svgEl('path', { d: 'M-58 110 L-48 52 L48 52 L58 110 Z', fill: '#3a4254', stroke: '#1c2230', 'stroke-width': 3 }, g);
      svgEl('rect', { x: -22, y: 40, width: 44, height: 14, rx: 6, fill: '#3a4254' }, g);
      txt(g, 0, 92, lab, { fill: '#fff', 'font-size': 26, 'font-weight': 900 });
      const s = txt(g, 0, 182, sub, { fill: '#c93a33', 'font-size': 24, 'font-weight': 800 }); hide(s);
      return { g, s };
    };
    const P = [pan(d.a, d.side === 0 ? '≈ ' + d.A : d.A), pan(d.b, d.side === 1 ? '≈ ' + d.B : d.B)]; P.forEach((p) => hide(p.g));
    const set = (deg) => {
      beam.setAttribute('transform', `rotate(${deg} ${px} ${py})`);
      const r = deg * Math.PI / 180;
      P[0].g.setAttribute('transform', `translate(${px - L * Math.cos(r)} ${py - L * Math.sin(r)})`);
      P[1].g.setAttribute('transform', `translate(${px + L * Math.cos(r)} ${py + L * Math.sin(r)})`);
    };
    set(0);
    const conv = hide(add(stage, box(cbox('u4l5-conv', `Change ${d.side === 0 ? d.a : d.b} to ${d.u}: <b>${d.conv}</b>`), 440, 46), (W - 440) / 2, 6));
    const tilt = (d.heavy === 0 ? -1 : 1) * Math.min(11, 4 + 18 * Math.abs(d.va - d.vb) / Math.max(d.va, d.vb));
    const hv = d.heavy === 0 ? d.a : d.b;
    const st = ok(stage, 'Heavier', d.heavy === 0 ? px - L : px + L, 40, { ok: true });
    return [
      { cap: `Which is heavier: <b>${d.a}</b> or <b>${d.b}</b>? Make a guess.`, run: (c) => Promise.all(P.map((p) => c.anim(p.g, [{ opacity: 0 }, { opacity: 1 }], 350))) },
      { cap: `Use a conversion fact to change ${d.side === 0 ? d.a : d.b} to ${d.u} (the unit of the other mass): <b>${d.conv}</b>.`, run: async (c) => { await c.fadeIn(conv); await c.fadeIn(P[d.side].s); } },
      { cap: `Now both are in ${d.u}: <b>${d.A}</b> and <b>${d.B}</b>. The same unit, so we can compare.`, run: (c) => c.fadeIn(P[1 - d.side].s) },
      { cap: `The heavier side goes down: <b>${hv}</b> is heavier (${d.why}).`, run: async (c) => { await tween(c, 900, (t) => set(tilt * t)); await stampIn(c, st); } }
    ];
  }
};

/* =====================================================================================
 * 1c. Quick estimates: double and add 10%, halve and take away 10%, 30 g an ounce
 * ===================================================================================== */
const EST = {
  kg20: { n: 20, kind: 'kg', ex: '' }, lb120: { n: 120, kind: 'lb', ex: '' }, oz5: { n: 5, kind: 'oz', ex: '' },
  e1: { n: 30, kind: 'kg', ex: 'Example 1(b)(i)', what: 'A suitcase has a mass of 30 kg.' },
  e2: { n: 160, kind: 'lb', ex: 'Example 1(b)(ii)', what: 'Jacob weighs 160 lb.' },
  e3: { n: 6, kind: 'oz', ex: 'Example 1(b)(iii)', what: 'A steak is 6 oz.' }
};
const estimate = {
  title: 'Estimating in your head',
  height: 360, minW: 900,
  choices: [{ v: 'kg20', label: '20 kg → lb' }, { v: 'lb120', label: '120 lb → kg' }, { v: 'oz5', label: '5 oz → g' }, { sep: 'Example 1(b) check:' }, { v: 'e1', label: '(i)' }, { v: 'e2', label: '(ii)' }, { v: 'e3', label: '(iii)' }],
  ask: (k) => { const d = EST[k], to = { kg: 'pounds', lb: 'kilograms', oz: 'grams' }[d.kind]; return d.ex ? `${d.ex}: ${d.what} About how many ${to} is it?` : `Estimate <b>${d.n} ${d.kind}</b> in ${to}, in your head.`; },
  make(stage, k, ex) {
    const d = EST[k], n = d.n, W = ex.W, X0 = 40, BH = 50, TX = Math.min(660, W - 330);
    const steps = [];
    if (d.kind === 'oz') {
      const bw = Math.min(100, (TX - X0 - 30) / n), blocks = [], labs = [];
      add(stage, box(cbox('u4l5-bar u4l5-c start', `${n} oz`), bw * n, BH), X0, 30);
      for (let i = 0; i < n; i++) {
        blocks.push(hide(add(stage, box(cbox('u4l5-bar g', '30 g'), bw - 6, BH), X0 + i * bw, 130)));
        labs.push(hide(add(stage, box(h('div', 'u4l5-cnt', String(30 * (i + 1))), bw, 28), X0 + i * bw, 186)));
      }
      const l1 = hide(add(stage, box(cbox('u4l5-eline', `Each ounce ≈ <b>30 g</b>`), W - TX - 20, 46), TX, 30));
      const l2 = hide(add(stage, box(cbox('u4l5-eline', T(`${n}\\times30=${30 * n}`) + ' g'), W - TX - 20, 46), TX, 130));
      const res = hide(add(stage, box(cbox('u4l5-res', `About <b>${30 * n} g</b>`), 340, 52), X0, 240));
      const chk = hide(add(stage, box(cbox('u4l5-chk', `Exact: ${T(`${n}\\times28.35=${fx(n * 28.35, 2).replace(/\.?0+$/, '')}`)} g. The estimate is <b>a little high</b> (1 oz is a bit less than 30 g).`), W - 60, 60), 30, 296));
      steps.push(
        { cap: `${n} oz. Each ounce is about <b>30 g</b> (a slice of bread).`, run: (c) => c.fadeIn(l1) },
        { cap: `Count by 30s: ${T(`${n}\\times30=${30 * n}`)}.`, run: async (c) => { for (let i = 0; i < n; i++) { await c.pop(blocks[i], 260); await c.fadeIn(labs[i], 140); } await c.fadeIn(l2); } },
        { cap: `${n} oz is about <b>${30 * n} g</b>.`, run: (c) => c.pop(res) },
        { cap: `Check with the exact fact: ${T(`${n}\\times28.35\\approx${fx(n * 28.35, 1)}`)} g. A little less than the estimate ✓`, run: (c) => c.fadeIn(chk) });
      return steps;
    }
    const kg = d.kind === 'kg', a = kg ? 2 * n : n / 2, b = a / 10, r = kg ? a + b : a - b, ex2 = kg ? n * 2.2 : n * 0.454;
    const s = (TX - X0 - 30) / (kg ? 2.2 * n : n);
    const start = add(stage, box(cbox('u4l5-bar start', `${n} ${d.kind}`), n * s, BH), X0, 30);
    const half1 = hide(add(stage, box(cbox('u4l5-bar a', String(kg ? n : n / 2)), (kg ? n : n / 2) * s - 4, BH), X0, 130));
    const half2 = hide(add(stage, box(cbox('u4l5-bar a', String(kg ? n : n / 2)), (kg ? n : n / 2) * s - 4, BH), X0 + (kg ? n : n / 2) * s, 130));
    const chunk = hide(add(stage, box(cbox('u4l5-bar ' + (kg ? 'plus' : 'minus'), (kg ? '+' : '−') + b), b * s, BH), kg ? X0 + a * s : X0 + (a - b) * s, 214));
    const keep = hide(add(stage, box(cbox('u4l5-bar a', String(kg ? a : a - b)), (kg ? a : a - b) * s - 4, BH), X0, 214));
    const l1 = hide(add(stage, box(cbox('u4l5-eline', `${kg ? 'Double' : 'Halve'}: ${T(kg ? `${n}\\times2=${a}` : `${n}\\div2=${a}`)}`), W - TX - 20, 46), TX, 130));
    const l2 = hide(add(stage, box(cbox('u4l5-eline', `${kg ? 'Add' : 'Take away'} 10%: ${T(kg ? `${a}+${b}=${r}` : `${a}-${b}=${r}`)}`), W - TX - 20, 46), TX, 214));
    const unit = kg ? 'lb' : 'kg';
    const res = hide(add(stage, box(cbox('u4l5-res', `About <b>${r} ${unit}</b>`), W - TX - 20, 52), TX, 30));
    const exT = kg ? `${n}\\times2.2=${rnd(ex2, 2)}` : `${n}\\times0.454=${rnd(ex2, 3)}`;
    const chk = hide(add(stage, box(cbox('u4l5-chk', `Exact: ${T(exT)} ${unit}. ${kg ? '<b>The same!</b> Double plus 10% is exactly × 2.2.' : '<b>Very close</b> ✓'}`), W - 60, 52), 30, 298));
    steps.push(
      { cap: `${n} ${d.kind} to ${kg ? 'pounds: a kilogram is a bit more than 2 pounds, so <b>double</b> it' : 'kilograms: a pound is a bit less than half a kilogram, so <b>halve</b> it'}: ${T(kg ? `${n}\\times2=${a}` : `${n}\\div2=${a}`)}.`,
        run: async (c) => { await Promise.all([c.fadeIn(half1), kg ? c.fadeIn(half2) : Promise.resolve()]); await c.fadeIn(l1); } },
      { cap: `10% of ${a} is <b>${b}</b> (move the decimal point one place left). ${kg ? 'Add' : 'Take'} it ${kg ? 'on' : 'away'}: ${T(kg ? `${a}+${b}=${r}` : `${a}-${b}=${r}`)}.`,
        run: async (c) => { await c.fadeIn(keep); await c.pop(chunk); if (!kg) await c.anim(chunk, [{ opacity: 1 }, { opacity: 0.35 }], 400); await c.fadeIn(l2); } },
      { cap: `${n} ${d.kind} is about <b>${r} ${unit}</b>.`, run: (c) => c.pop(res) },
      { cap: `Check: ${T(exT)} ${unit}. ${kg ? 'Exactly the estimate ✓' : 'Very close to the estimate ✓'}`, run: (c) => c.fadeIn(chk) }
    );
    void start;
    return steps;
  }
};

/* =====================================================================================
 * 2. The unit-factor machine: have on the bottom, want on top, cross out, calculate
 * ===================================================================================== */
const UF = {
  a: { amt: '25', have: 'lb', want: 'kg', top: '0.454', bot: '1', div: false, e: '25×0.454', r: '11.35', ans: '11.4 kg', round: 'Round to the tenth: 11.35 → <b>11.4 kg</b>', est: 'A kilogram is bigger, so the number gets <b>smaller</b>. Half of 25 is 12.5, take away 1.25: about 11.3 ✓', task: '25 lb to kg' },
  b: { amt: '68', have: 'kg', want: 'lb', top: '2.2', bot: '1', div: false, e: '68×2.2', r: '149.6', ans: '149.6 lb', round: '149.6 is already to the tenth: <b>149.6 lb</b>', est: 'A pound is smaller, so the number gets <b>bigger</b>. Double 68 is 136, add 13.6: 149.6 ✓', task: '68 kg to lb' },
  c: { amt: '12', have: 'oz', want: 'g', top: '28.35', bot: '1', div: false, e: '12×28.35', r: '340.2', ans: '340.2 g', round: '340.2 is already to the tenth: <b>340.2 g</b>', est: 'Grams are tiny, so the number gets <b>much bigger</b>. 12 × 30 = 360, a bit high ✓', task: '12 oz to g' },
  d: { amt: '500', have: 'g', want: 'oz', top: '1', bot: '28.35', div: true, e: '500÷28.35', r: '17.63668430', ans: '17.6 oz', round: 'Round to the tenth: 17.636… → <b>17.6 oz</b>', est: 'Ounces are bigger than grams, so the number gets <b>much smaller</b>. 500 ÷ 30 is about 17 ✓', task: '500 g to oz' },
  e: { amt: '3', have: 'tons', want: 't', top: '0.907', bot: '1', div: false, e: '3×0.907', r: '2.721', ans: '2.7 t', round: 'Round to the tenth: 2.721 → <b>2.7 t</b>', est: 'A ton is a bit less than a tonne, so a bit <b>less than 3</b> ✓', task: '3 tons to tonnes', bw: 'ton' },
  f: { amt: '4.5', have: 't', want: 'tons', top: '1', bot: '0.907', div: true, e: '4.5÷0.907', r: '4.961411246', ans: '5.0 tons', round: 'Round to the tenth: 4.961… → <b>5.0 tons</b>', est: 'A tonne is a bit more than a ton, so a bit <b>more than 4.5</b> ✓', task: '4.5 t to tons', tw: 'ton' }
};
const unitFactor = {
  title: 'The unit factor: cross out the unit you have',
  height: 380, minW: 900,
  choices: [{ sep: 'Example 2 check:' }, ...'abcdef'.split('').map((v) => ({ v, label: `(${v}) ${UF[v].task}` }))],
  ask: (k) => `Example 2(${k}): convert <b>${UF[k].task}</b>. Round to the nearest tenth.`,
  make(stage, k, ex) {
    const d = UF[k], W = ex.W, topU = d.tw || d.want, botU = d.bw || d.have;
    const U = (s, cls) => `<span class="u4l5-u ${cls}">${s}<i class="u4l5-x"></i></span>`;
    const row = add(stage, box(h('div', 'u4l5-uf'), W - 40, 140), 20, 14);
    const amt = hide(h('div', 'u4l5-ufa', `${d.amt} ${U(d.have, 'have a')}`));
    const times = hide(h('div', 'u4l5-ufo', '×'));
    const frac = hide(h('div', 'u4l5-uff', `<div class="t">${d.top} ${U(topU, 'want')}</div><div class="b">${d.bot} ${U(botU, 'have b')}</div>`));
    const eq = hide(h('div', 'u4l5-ufo', '='));
    const out = hide(h('div', 'u4l5-ufr', d.ans));
    row.append(amt, times, frac, eq, out);
    const tags = hide(add(stage, box(h('div', 'u4l5-tags', `<span class="w">want on top</span><span class="hv">have on the bottom</span>`), 230, 110), 0, 30));
    const work = hide(add(stage, box(cbox('u4l5-eline big', d.div ? `The fact is on the bottom, so <b>divide</b>: ${T(d.e.replace('÷', '\\div'))}` : `Multiply: ${T(d.e.replace('×', '\\times'))}`), 520, 56), 30, 182));
    const screen = lcd(stage, d.e, d.r, W - 310, 176, 280);
    const rn = hide(add(stage, box(cbox('u4l5-rnote', d.round), 520, 46), 30, 252));
    const chk = hide(add(stage, box(cbox('u4l5-chk', `<b>Step 4. Check:</b> ${d.est}`), W - 60, 58), 30, 312));
    return [
      { cap: `<b>Step 1.</b> Write the amount you have, with its unit: <b>${d.amt} ${d.have}</b>.`, run: (c) => c.pop(amt) },
      { cap: `<b>Step 2.</b> Multiply by a unit factor: <b>${d.have}</b> (what you have) on the <b>bottom</b>, <b>${d.want}</b> (what you want) on the <b>top</b>.`,
        run: async (c) => {
          await c.fadeIn(times, 200); await c.pop(frac);
          const r = frac.getBoundingClientRect(), s = stage.getBoundingClientRect(), sc = (s.width / stage.offsetWidth) || 1;
          tags.style.left = ((r.right - s.left) / sc + 10) + 'px'; tags.style.top = ((r.top - s.top) / sc - 4) + 'px';
          await c.fadeIn(tags);
        } },
      { cap: `<b>Step 3.</b> <b>${d.have}</b> is on the top and on the bottom: cross it out. The unit left is <b>${d.want}</b>.`,
        run: async (c) => { await c.anim(tags, [{ opacity: 1 }, { opacity: 0 }], 250); for (const x of row.querySelectorAll('.have .u4l5-x')) await c.anim(x, [{ transform: 'rotate(-18deg) scaleX(0)' }, { transform: 'rotate(-18deg) scaleX(1)' }], 380); await pulse(c, row.querySelector('.want'), 1.25); } },
      { cap: d.div ? `The fact is on the <b>bottom</b>, so <b>divide</b>: ${T(d.e.replace('÷', '\\div'))} shows ${d.r.slice(0, 7)}…` : `Calculate: ${T(d.e.replace('×', '\\times'))} = ${d.r}.`,
        run: async (c) => { await c.fadeIn(work); await c.pop(screen); } },
      { cap: `${d.round.startsWith('Round') ? 'Round to the nearest tenth' : 'It is already to the tenth'}: <b>${d.ans}</b>.`, run: async (c) => { await c.fadeIn(rn); await c.fadeIn(eq, 200); await c.pop(out); } },
      { cap: `<b>Step 4.</b> Check with an estimate. ${d.est}`, run: (c) => c.fadeIn(chk) }
    ];
  }
};

/* =====================================================================================
 * 2b. Bigger or smaller? kilogram blocks vs pound blocks (Full notes)
 * ===================================================================================== */
const wrongWay = {
  title: 'Bigger or smaller? Line up the blocks',
  height: 390, minW: 900,
  choices: [{ v: 'kg', label: '10 kg to lb' }, { v: 'g', label: '500 g to oz' }],
  ask: (k) => (k === 'kg' ? 'Change <b>10 kg</b> to pounds. Should the number get bigger or smaller?' : 'Change <b>500 g</b> to ounces. Should the number get bigger or smaller?'),
  make(stage, k, ex) {
    const W = ex.W, X = 150, LEN = W - X - 40, kg = k === 'kg';
    const lab = (s, y) => add(stage, box(h('div', 'u4l5-rowlab', s), 130, 50), 12, y);
    const steps = [];
    if (kg) {
      const s = LEN / 10;
      lab('10 kg', 20); const top = []; for (let i = 0; i < 10; i++) top.push(hide(add(stage, box(cbox('u4l5-blk kg', '1 kg'), s - 3, 50), X + i * s, 20)));
      lab('right way', 140); const R = []; for (let i = 0; i < 22; i++) R.push(hide(add(stage, box(cbox('u4l5-blk lb', 'lb'), s / 2.2 - 3, 50), X + i * s / 2.2, 140)));
      lab('wrong way', 240); const Wr = []; for (let i = 0; i < 5; i++) Wr.push(hide(add(stage, box(cbox('u4l5-blk bad', i < 4 ? 'lb' : ''), (i < 4 ? s / 2.2 : 0.54 * s / 2.2) - 3, 50), X + i * s / 2.2, 240)));
      const t1 = hide(add(stage, box(cbox('u4l5-eline', `${T('10\\times0.454=4.54')} lb: <b>far too short!</b>`), 470, 50), X + 4.6 * s / 2.2 + 20, 240));
      const t2 = hide(add(stage, box(cbox('u4l5-eline', `${T('10\\times2.2=22')} lb fill the same length ✓`), 520, 50), W - 560, 196));
      const x1 = ok(stage, '✗', X + 4.6 * s / 2.2 + 520, 265, { ok: false });
      const rule = hide(add(stage, box(cbox('u4l5-fact', 'A kilogram is <b>bigger</b> than a pound, so there are <b>more</b> pounds than kilograms. Ask: bigger or smaller?'), W - 60, 52), 30, 320));
      steps.push(
        { cap: 'Here is <b>10 kg</b>: ten kilogram blocks.', run: async (c) => { for (const b of top) await c.pop(b, 120); } },
        { cap: `A wrong way: ${T('10\\times0.454=4.54')} lb. Only 4.54 pound blocks: much less than the 10 kg. That can’t be right.`, run: async (c) => { for (const b of Wr) await c.pop(b, 200); await c.fadeIn(t1); await stampIn(c, x1); } },
        { cap: `The right way: each kilogram is about 2.2 lb, so ${T('10\\times2.2=22')} lb. 22 pound blocks fill the same length.`, run: async (c) => { for (const b of R) await c.pop(b, 110); await c.fadeIn(t2); } },
        { cap: 'The bigger unit gives the <b>smaller</b> number. kg → lb: the number gets <b>bigger</b>.', run: (c) => c.fadeIn(rule) }
      );
    } else {
      const ozw = LEN * 28.35 / 500;
      lab('500 g', 20); const top = hide(add(stage, box(cbox('u4l5-blk g', '500 g'), LEN, 50), X, 20));
      lab('right way', 140); const R = []; for (let i = 0; i < 18; i++) R.push(hide(add(stage, box(cbox('u4l5-blk lb', i < 17 ? 'oz' : ''), (i < 17 ? ozw : 0.64 * ozw) - 3, 50), X + i * ozw, 140)));
      lab('wrong way', 240); const Wr = []; for (let i = 0; i < Math.floor(LEN / ozw); i++) Wr.push(hide(add(stage, box(h('div', 'u4l5-blk bad'), Math.max(2, ozw - 3), 50), X + i * ozw, 240)));
      const t1 = hide(add(stage, box(cbox('u4l5-eline warn', `${T('500\\times28.35=14\\,175')} oz? That is about <b>886 lb</b>: a piano, not a bag of rice! ✗`), W - 60, 50), 30, 300));
      const t2 = hide(add(stage, box(cbox('u4l5-eline', `${T('500\\div28.35\\approx17.6')} oz ✓`), 330, 50), W - 370, 196));
      steps.push(
        { cap: 'Here is <b>500 g</b> (a bag of rice).', run: (c) => c.fadeIn(top) },
        { cap: `A wrong way: ${T('500\\times28.35=14\\,175')} oz. The ounce blocks run right off the screen!`, run: async (c) => { for (const b of Wr) await c.pop(b, 60); await c.fadeIn(t1); } },
        { cap: `The right way: an ounce is about 28.35 g, so <b>divide</b>: ${T('500\\div28.35\\approx17.6')} oz. About 17.6 ounce blocks fill 500 g.`, run: async (c) => { await Promise.all(Wr.map((b) => c.anim(b, [{ opacity: 1 }, { opacity: 0.12 }], 300))); for (const b of R) await c.pop(b, 120); await c.fadeIn(t2); } }
      );
    }
    return steps;
  }
};

/* =====================================================================================
 * 2c. Pounds and ounces: zoom into the last pound (16 ounces)
 * ===================================================================================== */
const lbOz = {
  title: 'Pounds and ounces: one pound is 16 ounces',
  height: 400, minW: 900,
  choices: [{ v: 'why', label: 'Why not 7.6 lb?' }, { sep: 'Example 3 check:' }, { v: 'a1', label: '(a)(i) pounds first' }, { v: 'a2', label: '(a)(ii) ounces first' }, { v: 'b', label: '(b) dog food' }],
  ask: (k) => (k === 'why' ? 'Baby Amara was born at <b>7 lb 6 oz</b>. Is that 7.6 lb?' : k === 'b' ? 'Example 3(b): a bag of dog food is <b>9 kg</b>. Find its mass in pounds and ounces, to the nearest ounce.' : `Example 3(a)(${k === 'a1' ? 'i' : 'ii'}): Baby Amara was born at <b>7 lb 6 oz</b>. Find her mass in kilograms, to the nearest hundredth${k === 'a1' ? ': change to pounds first' : ': change to ounces first'}.`),
  make(stage, k, ex) {
    const W = ex.W, X0 = 40, LEN = W - 80;
    const cells = (y, filled, cw = LEN / 16, lab = true) => {
      const cs = [];
      for (let i = 0; i < 16; i++) {
        const f = Math.max(0, Math.min(1, filled - i));
        const c = hide(add(stage, box(h('div', 'u4l5-oz' + (f > 0 ? ' on' : ''), lab ? String(i + 1) : ''), cw - 3, 54), X0 + i * cw, y));
        if (f > 0 && f < 1) c.style.background = `linear-gradient(90deg, #e0a21a ${f * 100}%, #fff ${f * 100}%)`;
        cs.push(c);
      }
      return cs;
    };
    if (k === 'why') {
      const cs = cells(40, 0);
      const lb = hide(add(stage, box(h('div', 'u4l5-onelb', '1 lb = 16 oz'), LEN, 30), X0, 8));
      const ten = [];
      for (let i = 0; i < 10; i++) ten.push(hide(add(stage, box(h('div', 'u4l5-ten', (i + 1) / 10 === 1 ? '1.0' : '0.' + (i + 1)), LEN / 10 - 3, 54), X0 + i * LEN / 10, 150)));
      const m1 = hide(add(stage, box(h('div', 'u4l5-mk ok', '6 oz = 0.375 lb'), 200, 36), X0 + LEN * 0.375 - 100, 104));
      const m2 = hide(add(stage, box(h('div', 'u4l5-mk no', '0.6 lb ≈ 9.6 oz'), 200, 36), X0 + LEN * 0.6 - 100, 214));
      const res = hide(add(stage, box(cbox('u4l5-fact', `6 oz = ${T('6\\div16=0.375')} lb, so 7 lb 6 oz = <b>7.375 lb</b>, not 7.6 lb.`), W - 60, 64), 30, 290));
      const x = ok(stage, '✗ 7.6', X0 + LEN * 0.6 + 140, 232, { ok: false });
      return [
        { cap: 'One pound is <b>16 ounces</b>. Here is 1 lb cut into 16 ounces.', run: async (c) => { await c.fadeIn(lb); for (const e of cs) await c.fadeIn(e, 80); } },
        { cap: '<b>6 oz</b> is 6 of the 16 pieces.', run: async (c) => { for (const e of cs.slice(0, 6)) { e.classList.add('on'); await c.pop(e, 160); } await c.fadeIn(m1); } },
        { cap: 'Decimals count in <b>tenths</b>. 0.6 lb is 6 <b>tenths</b> of a pound: much farther along.', run: async (c) => { for (const e of ten) await c.fadeIn(e, 70); for (const e of ten.slice(0, 6)) e.classList.add('on'); await c.fadeIn(m2); await stampIn(c, x); } },
        { cap: `6 oz is ${T('6\\div16=0.375')} lb. So 7 lb 6 oz = <b>7.375 lb</b>.`, run: (c) => c.pop(res) }
      ];
    }
    const nb = k === 'b' ? 19 : 7, frac = k === 'b' ? 0.8 : 6 / 16, gap = 6, bw = Math.min(104, (LEN - gap * nb) / (nb + 1));
    const bars = [];
    for (let i = 0; i <= nb; i++) {
      const last = i === nb, b = add(stage, box(h('div', 'u4l5-lb' + (last ? ' part' : ''), last ? '' : (bw > 60 ? '1 lb' : '')), bw, 50), X0 + i * (bw + gap), 18);
      if (last) b.style.background = `linear-gradient(90deg, #e0a21a ${frac * 100}%, #fff ${frac * 100}%)`;
      bars.push(hide(b));
    }
    const lastX = X0 + nb * (bw + gap);
    const zoom = hide(svgEl('path', { d: `M${lastX} 70 L${X0} 106 M${lastX + bw} 70 L${X0 + LEN} 106`, stroke: '#9a6a24', 'stroke-width': 2, 'stroke-dasharray': '5 4', fill: 'none' }, mkSvg(stage, W, 110, 0, 0)));
    if (k === 'a1' || k === 'b') {
      const cs = cells(108, k === 'b' ? 12.8 : 6);
      const w1 = hide(add(stage, box(cbox('u4l5-eline', k === 'b' ? `${T('0.8\\times16=12.8')} oz` : `6 oz = ${T('6\\div16=0.375')} lb, so <b>7.375 lb</b>`), 470, 50), 30, k === 'b' ? 246 : 186));
      const scr = k === 'b' ? lcd(stage, '9×2.2', '19.8', W - 300, 186, 270) : lcd(stage, '7.375×0.454', '3.34825', W - 300, 186, 270);
      const w2 = hide(add(stage, box(cbox('u4l5-eline', k === 'b' ? `${T('9\\times2.2=19.8')} lb = 19 lb + 0.8 lb` : `${T('7.375\\times0.454=3.348\\ldots')} kg`), 470, 50), 30, k === 'b' ? 186 : 246));
      const res = hide(add(stage, box(cbox('u4l5-res', k === 'b' ? 'About <b>19 lb 13 oz</b> (12.8 oz rounds to 13 oz)' : 'Amara’s mass is about <b>3.35 kg</b>'), W - 60, 56), 30, 320));
      if (k === 'b') return [
        { cap: `9 kg to pounds: ${T('9\\times2.2=19.8')} lb.`, run: async (c) => { await c.pop(scr); await c.fadeIn(w2); } },
        { cap: '19.8 lb is <b>19 whole pounds</b> plus <b>0.8 lb</b>.', run: async (c) => { for (const b of bars) await c.fadeIn(b, 70); } },
        { cap: `Zoom in on the last pound: 16 ounces. 0.8 of 16 is ${T('0.8\\times16=12.8')} oz.`, run: async (c) => { await c.fadeIn(zoom); for (const e of cs) await c.fadeIn(e, 70); await c.fadeIn(w1); } },
        { cap: 'Round to the nearest ounce: 12.8 oz ≈ 13 oz. The bag is about <b>19 lb 13 oz</b>.', run: (c) => c.pop(res) }
      ];
      return [
        { cap: '7 lb 6 oz: <b>7 whole pounds</b> and 6 ounces.', run: async (c) => { for (const b of bars) await c.fadeIn(b, 110); } },
        { cap: 'Zoom in on the last pound: it is <b>16 ounces</b>. 6 of them are filled.', run: async (c) => { await c.fadeIn(zoom); for (const e of cs) await c.fadeIn(e, 70); } },
        { cap: `6 oz = ${T('6\\div16=0.375')} lb. So 7 lb 6 oz = <b>7.375 lb</b>.`, run: (c) => c.fadeIn(w1) },
        { cap: `Now the unit factor: ${T('7.375\\times0.454=3.348\\ldots')} kg.`, run: async (c) => { await c.pop(scr); await c.fadeIn(w2); } },
        { cap: 'Round to the nearest hundredth: Amara’s mass is about <b>3.35 kg</b>.', run: (c) => c.pop(res) }
      ];
    }
    // a2: all ounces
    const tot = [];
    for (let i = 0; i < nb; i++) tot.push(hide(add(stage, box(h('div', 'u4l5-cnt big', String(16 * (i + 1))), bw, 30), X0 + i * (bw + gap), 72)));
    const six = hide(add(stage, box(h('div', 'u4l5-cnt big hot', '+6'), bw, 30), lastX, 72));
    const w1 = hide(add(stage, box(cbox('u4l5-eline', `${T('7\\times16+6=112+6=118')} oz`), 470, 50), 30, 128));
    const w2 = hide(add(stage, box(cbox('u4l5-eline', `${T('118\\times28.35=3345.3')} g`), 470, 50), 30, 192));
    const scr = lcd(stage, '118×28.35', '3345.3', W - 300, 150, 270);
    const w3 = hide(add(stage, box(cbox('u4l5-eline', `${T('3345.3\\div1000=3.3453')} kg`), 470, 50), 30, 256));
    const res = hide(add(stage, box(cbox('u4l5-res', 'About <b>3.35 kg</b>: the same as way (i) ✓'), W - 60, 56), 30, 326));
    return [
      { cap: '7 lb 6 oz: change it <b>all to ounces</b>.', run: async (c) => { for (const b of bars) await c.fadeIn(b, 110); } },
      { cap: `Each pound is 16 oz. Count by 16s: ${T('7\\times16=112')} oz.`, run: async (c) => { for (const t of tot) await c.pop(t, 220); } },
      { cap: `Add the 6 oz: ${T('112+6=118')} oz.`, run: async (c) => { await c.pop(six); await c.fadeIn(w1); } },
      { cap: `Ounces to grams: ${T('118\\times28.35=3345.3')} g.`, run: async (c) => { await c.pop(scr); await c.fadeIn(w2); } },
      { cap: `Grams to kilograms (÷ 1000): ${T('3.3453\\approx3.35')} kg. The same answer both ways ✓`, run: async (c) => { await c.fadeIn(w3); await c.pop(res); } }
    ];
  }
};

/* =====================================================================================
 * 3. Tamika's suitcase: the limit gauges
 * ===================================================================================== */
const baggage = {
  title: 'Tamika’s bags and the airline’s limits',
  height: 420, minW: 900,
  ask: 'Example 4: the airline’s limit is <b>23 kg</b> for a checked bag and <b>7 kg</b> for a carry-on. Tamika’s scale shows <b>53 lb</b> and <b>11 lb</b>.',
  make(stage, k, ex) {
    const W = ex.W;
    // the suitcase on a bathroom scale
    const S = mkSvg(stage, 220, 300, 14, 40);
    svgEl('rect', { x: 46, y: 18, width: 128, height: 162, rx: 16, fill: '#c0392b', stroke: '#6e1f16', 'stroke-width': 4 }, S);
    svgEl('path', { d: 'M86 18 V2 H134 V18', fill: 'none', stroke: '#3a4254', 'stroke-width': 7 }, S);
    svgEl('line', { x1: 110, y1: 30, x2: 110, y2: 170, stroke: '#8c2a20', 'stroke-width': 3 }, S);
    svgEl('rect', { x: 20, y: 184, width: 180, height: 46, rx: 12, fill: '#e8e3d8', stroke: '#6b665c', 'stroke-width': 4 }, S);
    svgEl('rect', { x: 66, y: 194, width: 88, height: 28, rx: 5, fill: '#c9d4bf', stroke: '#3a4254', 'stroke-width': 2 }, S);
    const rd = txt(S, 110, 215, '53 lb', { 'font-size': 20, 'font-weight': 900, fill: '#1d2a18', 'font-family': 'ui-monospace, Menlo, monospace' });
    void rd;
    // gauges
    const GX = 260, GW = W - GX - 40;
    const gauge = (y, max, lim, name) => {
      const g = { y, max, lim, s: GW / max };
      add(stage, box(h('div', 'u4l5-gname', name), GW, 26), GX, y - 30);
      add(stage, box(h('div', 'u4l5-gtrack'), GW, 40), GX, y);
      for (let v = 0; v <= max; v += max > 12 ? 5 : 1) add(stage, box(h('div', 'u4l5-gtick', String(v)), 40, 20), GX + v * g.s - 20, y + 44);
      g.fill = add(stage, box(h('div', 'u4l5-gfill'), 0, 40), GX, y);
      g.over = add(stage, box(h('div', 'u4l5-gover'), 0, 40), GX + lim * g.s, y);
      add(stage, box(h('div', 'u4l5-glim'), 4, 56), GX + lim * g.s - 2, y - 8); add(stage, box(h('div', 'u4l5-glimt', `limit ${lim} kg`), 120, 24), GX + lim * g.s + 6, y - 30);
      g.set = (v) => { g.fill.style.width = Math.min(v, lim) * g.s + 'px'; g.over.style.width = Math.max(0, v - lim) * g.s + 'px'; };
      g.set(0); return g;
    };
    const G1 = gauge(58, 30, 23, 'Checked suitcase (kg)'), G2 = gauge(240, 10, 7, 'Carry-on (kg)');
    const estM = hide(add(stage, box(h('div', 'u4l5-estm', 'estimate ≈ 23.9'), 150, 26), GX + 23.9 * G1.s - 75, 128));
    const estDash = hide(add(stage, box(h('div', 'u4l5-estd'), 3, 64), GX + 23.9 * G1.s - 1, 52));
    const overL = hide(add(stage, box(h('div', 'u4l5-ovl', 'over by ≈ 1.1 kg'), 190, 26), GX + 24.06 * G1.s - 110, 128));
    const L1 = hide(add(stage, box(cbox('u4l5-eline', `(b) ${T('53\\times0.454=24.062\\approx24.1')} kg`), 430, 46), GX, 160));
    const L2 = hide(add(stage, box(cbox('u4l5-eline', `(c) ${T('11\\times0.454=4.994\\approx5.0')} kg`), 430, 46), GX, 314));
    const pkg = hide(add(stage, box(h('div', 'u4l5-pkg', '1.5 kg'), 74, 40), GX + 22 * G1.s, G1.y));
    const s1 = ok(stage, '✓ 22.6 kg', GX + GW - 80, 182, { ok: true }), s2 = ok(stage, '✓ 6.5 kg', GX + GW - 80, 336, { ok: true });
    const fin = hide(add(stage, box(cbox('u4l5-res', '<b>Yes:</b> both bags are within the limits.'), 520, 50), GX, 366));
    return [
      { cap: `(a) Estimate 53 lb in kg: halve, ${T('53\\div2=26.5')}, then take away 10%: ${T('26.5-2.65\\approx23.9')} kg. It looks a little over 23 kg.`, run: async (c) => { await c.fadeIn(estDash); await c.fadeIn(estM); } },
      { cap: `(b) Exactly: ${T('53\\times0.454=24.062')} kg ≈ <b>24.1 kg</b>.`, run: async (c) => { await c.fadeIn(L1); await tween(c, 1200, (t) => G1.set(24.062 * t)); } },
      { cap: `It is over by ${T('24.062-23=1.062')}: about <b>1.1 kg</b>.`, run: async (c) => { await Promise.all([c.anim(estM, [{ opacity: 1 }, { opacity: 0 }], 200), c.anim(estDash, [{ opacity: 1 }, { opacity: 0 }], 200)]); await c.fadeIn(overL); await pulse(c, G1.over, 1.15); } },
      { cap: `(c) The carry-on: ${T('11\\times0.454=4.994\\approx5.0')} kg. Its limit is 7 kg.`, run: async (c) => { await c.fadeIn(L2); await tween(c, 900, (t) => G2.set(4.994 * t)); } },
      { cap: 'Move <b>1.5 kg</b> of things from the suitcase into the carry-on.',
        run: async (c) => {
          await c.anim(overL, [{ opacity: 1 }, { opacity: 0 }], 200); await c.pop(pkg);
          await Promise.all([c.anim(pkg, [{ transform: 'none' }, { transform: `translate(${5 * G2.s - 22 * G1.s}px, ${G2.y - G1.y}px)` }], 900), tween(c, 900, (t) => { G1.set(24.062 - 1.5 * t); G2.set(4.994 + 1.5 * t); })]);
          await c.anim(pkg, [{ opacity: 1 }, { opacity: 0 }], 250);
        } },
      { cap: `Suitcase: ${T('24.1-1.5=22.6')} kg, less than 23 kg. Carry-on: ${T('5.0+1.5=6.5')} kg, less than 7 kg. <b>Yes</b>, both are within the limits.`, run: async (c) => { await stampIn(c, s1); await stampIn(c, s2); await c.fadeIn(fin); } }
    ];
  }
};

/* =====================================================================================
 * 3b. Jun's parcel climbing the courier's price steps
 * ===================================================================================== */
const parcel = {
  title: 'The parcel and the price steps',
  height: 380, minW: 900,
  choices: [{ sep: 'Example 5 check:' }, { v: 'a', label: '(a) 2 candles' }, { v: 'b', label: '(b) the most candles' }],
  ask: (k) => (k === 'a' ? 'Example 5(a): <b>2 candles</b> (14 oz each), a <b>250 g</b> box of soap and <b>180 g</b> of packing. What does it cost to ship?' : 'Example 5(b): with the same soap and packing, what is the greatest number of candles for <b>$18.40</b>?'),
  make(stage, k, ex) {
    const W = ex.W, X = 40, LEN = W - 80, s = LEN / 3000, Y = 150;
    const zone = (a, b, cls, price, lab) => {
      add(stage, box(h('div', 'u4l5-zone ' + cls), (b - a) * s, 92), X + a * s, Y - 22);
      add(stage, box(h('div', 'u4l5-zprice ' + cls, `<b>${price}</b><span>${lab}</span>`), (b - a) * s, 52), X + a * s, Y - 80);
    };
    zone(0, 1000, 'z1', '$13.95', 'up to 1 kg'); zone(1000, 2500, 'z2', '$18.40', 'over 1 kg, up to 2.5 kg'); zone(2500, 3000, 'z3', '$24.75', 'over 2.5 kg →');
    for (let g = 0; g <= 3000; g += 500) add(stage, box(h('div', 'u4l5-gtick', g % 1000 === 0 ? `${g / 1000} kg` : `${g / 1000}`), 60, 22), X + g * s - 30, Y + 74);
    const seg = (a, m, cls, lab) => hide(add(stage, box(h('div', 'u4l5-pseg ' + cls, lab), m * s - 2, 46), X + a * s, Y));
    const C = 14 * 28.35;
    if (k === 'a') {
      const c1 = seg(0, C, 'cand', 'candle'), c2 = seg(C, C, 'cand', 'candle'), so = seg(2 * C, 250, 'soap', 'soap'), pk = seg(2 * C + 250, 180, 'pack', 'box');
      const L1 = hide(add(stage, box(cbox('u4l5-eline', `Candles: ${T('2\\times14=28')} oz; ${T('28\\times28.35=793.8')} g`), 520, 46), X, 250));
      const L2 = hide(add(stage, box(cbox('u4l5-eline', `Total: ${T('793.8+250+180=1223.8')} g ≈ <b>1.22 kg</b>`), 520, 46), X, 302));
      const st = ok(stage, '$18.40', W - 180, 300, { ok: true, size: 'lg' });
      return [
        { cap: `Each candle is 14 oz. Two candles: ${T('2\\times14=28')} oz, and ${T('28\\times28.35=793.8')} g.`, run: async (c) => { await c.fadeIn(c1); await c.fadeIn(c2); await c.fadeIn(L1); } },
        { cap: `Add the soap and the packing: ${T('793.8+250+180=1223.8')} g = 1.2238 kg ≈ 1.22 kg.`, run: async (c) => { await c.fadeIn(so); await c.fadeIn(pk); await c.fadeIn(L2); } },
        { cap: '1.22 kg is over 1 kg but not over 2.5 kg: the middle step. It costs <b>$18.40</b>.', run: (c) => stampIn(c, st) }
      ];
    }
    const so = seg(0, 250, 'soap', 'soap'), pk = seg(250, 180, 'pack', 'box'), cs = [];
    for (let i = 0; i < 6; i++) cs.push(seg(430 + i * C, C, i < 5 ? 'cand' : 'cand bad', String(i + 1)));
    const room = hide(add(stage, box(h('div', 'u4l5-room', 'room for candles: 2070 g'), 2070 * s, 22), X + 430 * s, Y - 22));
    const tally = hide(add(stage, box(h('div', 'u4l5-tally', ''), 300, 40), X, 256));
    const L1 = hide(add(stage, box(cbox('u4l5-eline', `${T('2070\\div396.9=5.21\\ldots')}: round <b>down</b> to <b>5 candles</b>`), 560, 46), X, 302));
    const st = ok(stage, '5 candles', W - 160, 290, { ok: true });
    const tot = (n) => fx(430 + n * C, 1);
    return [
      { cap: `One candle: ${T('14\\times28.35=396.9')} g. The soap and packing: ${T('250+180=430')} g.`, run: async (c) => { await c.fadeIn(so); await c.fadeIn(pk); } },
      { cap: `To stay at $18.40, the parcel must not go over 2500 g. Room for candles: ${T('2500-430=2070')} g.`, run: (c) => c.fadeIn(room) },
      { cap: 'Add candles one at a time.', run: async (c) => { await c.fadeIn(tally); for (let i = 0; i < 5; i++) { tally.innerHTML = `${i + 1} candle${i ? 's' : ''}: <b>${tot(i + 1)} g</b>`; await c.fadeIn(cs[i], 300); await c.sleep(150); } } },
      { cap: `A 6th candle: ${tot(6)} g. That is over 2.5 kg: it would cost $24.75!`, run: async (c) => { tally.innerHTML = `6 candles: <b>${tot(6)} g</b> ✗`; await c.fadeIn(cs[5]); await c.shake(cs[5]); await c.anim(cs[5], [{ opacity: 1 }, { opacity: 0.25 }], 400); } },
      { cap: `${T('2070\\div396.9=5.21\\ldots')}: round <b>down</b>. Jun can ship <b>5 candles</b> (${T('5\\times396.9+430=2414.5')} g) for $18.40.`, run: async (c) => { tally.innerHTML = `5 candles: <b>${tot(5)} g</b> ✓`; await c.fadeIn(L1); await stampIn(c, st); } }
    ];
  }
};

/* =====================================================================================
 * 4. Meat prices: a 1 kg tray holds 2.2 one-pound packages
 * ===================================================================================== */
const MEAT = {
  why: { ask: 'Ground beef is <b>$5.00/lb</b>. What is the price per kilogram? And what is <b>5 lb</b> in kilograms?', dir: 'lbkg', p: 5.00, item: 'Ground beef', r: 11.00 },
  i: { ask: 'Example 7(a)(i): ground beef is <b>$5.49 per lb</b>. Find the price per kg.', dir: 'lbkg', p: 5.49, item: 'Ground beef', r: 12.078 },
  ii: { ask: 'Example 7(a)(ii): pork tenderloin is <b>$14.30 per kg</b>. Find the price per lb.', dir: 'kglb', p: 14.30, item: 'Pork tenderloin', r: 6.50 },
  iii: { ask: 'Example 7(a)(iii): sweet potatoes are <b>$2.53 per kg</b>. Find the price per lb.', dir: 'kglb', p: 2.53, item: 'Sweet potatoes', r: 1.15 },
  b: { ask: 'Example 7(b): strip loin steak is <b>$9.99/lb</b> at Store A and <b>$21.50/kg</b> at Store B. Which is the better price, and by how much per kg?', dir: 'ab', p: 9.99, item: 'Strip loin', r: 21.978 }
};
const meatTags = {
  title: 'A kilogram of meat is 2.2 one-pound packages',
  height: 400, minW: 900,
  choices: [{ v: 'why', label: 'Price vs mass' }, { sep: 'Example 7 check:' }, { v: 'i', label: '(a)(i) beef' }, { v: 'ii', label: '(a)(ii) pork' }, { v: 'iii', label: '(a)(iii) potatoes' }, { v: 'b', label: '(b) Store A or B?' }],
  ask: (k) => MEAT[k].ask,
  make(stage, k, ex) {
    const d = MEAT[k], W = ex.W, TX = 260, TW = W - TX - 30, pw = TW / 2.2, Y = 30;
    const tag = (html, x, y, cls = '') => add(stage, box(h('div', 'u4l5-ptag ' + cls, html), 210, 96), x, y);
    add(stage, box(h('div', 'u4l5-tray'), TW, 128), TX, Y);
    add(stage, box(h('div', 'u4l5-traylab', '1 kg ≈ 2.2 lb'), TW, 26), TX, Y + 132);
    const packs = [0, 1, 2].map((i) => hide(add(stage, box(h('div', 'u4l5-pack' + (i === 2 ? ' sl' : ''), i === 2 ? '0.2' : '1 lb'), (i === 2 ? 0.2 * pw : pw) - 8, 100), TX + 4 + i * pw, Y + 14)));
    const per = d.dir === 'kglb' ? d.r : d.p;
    const stick = [0, 1, 2].map((i) => hide(add(stage, box(h('div', 'u4l5-stick', i === 2 ? M(0.2 * per) : M(per)), i === 2 ? 74 : 110, 34), TX + 4 + i * pw + (i === 2 ? (0.2 * pw - 74) / 2 : (pw - 118) / 2), Y + 60)));
    const steps = [];
    if (d.dir === 'kglb') {
      const t = tag(`<small>${d.item}</small><b>${M(d.p)}</b><span>per kg</span>`, 24, Y + 10);
      const kgTag = hide(add(stage, box(h('div', 'u4l5-trayprice', `${M(d.p)} for the whole kilogram`), TW, 34), TX, Y + 170));
      const L = hide(add(stage, box(cbox('u4l5-eline big', `price per lb = price per kg ÷ 2.2: &nbsp;${T(`${fx(d.p)}\\div2.2=${fx(d.r)}`)}`), W - 60, 56), 30, 236));
      const scr = lcd(stage, `${fx(d.p)}÷2.2`, String(rnd(d.p / 2.2, 6)), W - 300, 300, 270);
      const res = hide(tag(`<small>${d.item}</small><b>${M(d.r)}</b><span>per lb</span>`, 24, 290, 'pans'));
      void t;
      steps.push(
        { cap: `${d.item}: <b>${M(d.p)} per kg</b>. A kilogram is about <b>2.2 lb</b>.`, run: async (c) => { for (const p of packs) await c.fadeIn(p, 200); await c.fadeIn(kgTag); } },
        { cap: `The ${M(d.p)} is shared over 2.2 lb, so <b>divide by 2.2</b>: ${T(`${fx(d.p)}\\div2.2=${fx(d.r)}`)}.`, run: async (c) => { await c.fadeIn(L); await c.pop(scr); } },
        { cap: `Each pound costs <b>${M(d.r)}</b>. Check: ${T(`${fx(d.r)}\\times2.2=${fx(d.p)}`)} ✓ The price per lb is the smaller number.`, run: async (c) => { for (const s of stick) await c.pop(s, 220); await c.pop(res); } }
      );
      return steps;
    }
    const t = tag(`<small>${k === 'b' ? 'Store A' : d.item}</small><b>${M(d.p)}</b><span>per lb</span>`, 24, Y + 10);
    void t;
    const rr = Number.isInteger(rnd(d.r, 4)) ? fx(d.r, 2) : String(rnd(d.r, 4));
    const L = hide(add(stage, box(cbox('u4l5-eline big', `price per kg = price per lb × 2.2: &nbsp;${T(`${fx(d.p)}\\times2.2=${rr}`)}`), W - 60, 56), 30, 236));
    const scr = lcd(stage, `${fx(d.p)}×2.2`, String(rnd(d.r, 4)), W - 300, 300, 270);
    steps.push(
      { cap: `${k === 'b' ? 'Store A' : d.item}: <b>${M(d.p)} per lb</b>. A kilogram is about 2.2 lb: two 1 lb packages and a bit more.`, run: async (c) => { for (const p of packs) await c.fadeIn(p, 200); } },
      { cap: `Each pound costs ${M(d.p)}. The last 0.2 lb costs ${T(`0.2\\times${fx(d.p)}${Math.abs(0.2 * d.p - rnd(0.2 * d.p, 2)) < 1e-9 ? '=' : '\\approx'}${fx(0.2 * d.p)}`)}.`, run: async (c) => { for (const s of stick) await c.pop(s, 220); } },
      { cap: `Add up 2.2 pounds: ${T(`${fx(d.p)}\\times2.2=${rr}`)}.`, run: async (c) => { await c.fadeIn(L); await c.pop(scr); } }
    );
    if (k === 'why') {
      const res = hide(tag(`<small>${d.item}</small><b>$11.00</b><span>per kg</span>`, 24, 290, 'pans'));
      const mass = hide(add(stage, box(cbox('u4l5-fact', `But a <b>mass</b>: ${T('5\\text{ lb}\\times0.454=2.27\\text{ kg}')}, a <b>smaller</b> number. A price goes the <b>other way</b>: a kilogram is more meat, so it costs more.`), W - 300 - 260, 96), 250, 300));
      steps.push(
        { cap: 'So beef costs <b>$11.00 per kg</b>: the price per kg is the <b>bigger</b> number.', run: (c) => c.pop(res) },
        { cap: `Compare a mass: 5 lb is ${T('5\\times0.454=2.27')} kg, a <b>smaller</b> number. A price goes the <b>opposite way</b>.`, run: async (c) => { await c.anim(scr, [{ opacity: 1 }, { opacity: 0 }], 200); await c.fadeIn(mass); } }
      );
      return steps;
    }
    if (k === 'i') {
      const res = hide(tag(`<small>${d.item}</small><b>$12.08</b><span>per kg</span>`, 24, 290, 'pans'));
      steps.push({ cap: 'Round to the nearest cent: 12.078 → <b>$12.08 per kg</b>.', run: (c) => c.pop(res) });
      return steps;
    }
    const A = hide(tag('<small>Store A</small><b>$21.98</b><span>per kg</span>', 24, 290, 'pans'));
    const B = hide(tag('<small>Store B</small><b>$21.50</b><span>per kg</span>', 250, 290));
    const st = ok(stage, 'Better price', 360, 286, { ok: true });
    const diff = hide(add(stage, box(cbox('u4l5-eline', `by ${T('\\$21.98-\\$21.50=\\$0.48')} per kg`), 300, 46), 480, 316));
    steps.push(
      { cap: 'Round to the nearest cent: Store A is <b>$21.98 per kg</b>.', run: (c) => c.pop(A) },
      { cap: 'Store B is <b>$21.50 per kg</b>. Now both prices are per kg.', run: async (c) => { await Promise.all([c.anim(scr, [{ opacity: 1 }, { opacity: 0 }], 200), c.anim(L, [{ opacity: 1 }, { opacity: 0 }], 200)]); await c.pop(B); } },
      { cap: `<b>Store B</b> has the better price, by ${T('\\$21.98-\\$21.50=\\$0.48')} per kg.`, run: async (c) => { await stampIn(c, st); await c.fadeIn(diff); } }
    );
    return steps;
  }
};

/* =====================================================================================
 * 4b. The barbecue, patty by patty (Full notes)
 * ===================================================================================== */
const burgers = {
  title: '30 quarter-pound patties',
  height: 400, minW: 900,
  ask: 'Example 8: <b>30</b> quarter-pound patties. Beef is <b>$12.00 per kg</b> and comes in <b>1 kg packages</b>.',
  make(stage, k, ex) {
    const W = ex.W, GW = (W - 60) / 8, X = 30, pats = [], grps = [];
    for (let g = 0; g < 8; g++) {
      const n = g < 7 ? 4 : 2;
      grps.push(hide(add(stage, box(h('div', 'u4l5-grp', g < 7 ? '1 lb' : '½ lb'), GW - 10, 116), X + g * GW, 10)));
      for (let i = 0; i < n; i++) pats.push(hide(add(stage, box(h('div', 'u4l5-patty'), 36, 36), X + g * GW + 12 + (i % 2) * 44, 20 + Math.floor(i / 2) * 44)));
    }
    const L1 = hide(add(stage, box(cbox('u4l5-eline', `${T('30\\times\\tfrac14=30\\times0.25=7.5')} lb`), 420, 46), X, 140));
    const L2 = hide(add(stage, box(cbox('u4l5-eline', `${T('7.5\\times0.454=3.405')} kg`), 360, 46), X + 440, 140));
    const PX = X, PL = W - 60, s = PL / 4, PY = 222;
    const pk = [0, 1, 2, 3].map((i) => hide(add(stage, box(h('div', 'u4l5-kgpk', `package ${i + 1}<span>1 kg</span>`), s - 8, 60), PX + i * s, PY)));
    const beef = add(stage, box(h('div', 'u4l5-beef'), 0, 16), PX, PY + 66);
    const bl = hide(add(stage, box(h('div', 'u4l5-cnt big', '3.405 kg of beef'), 220, 28), PX + 3.405 * s - 110, PY + 86));
    const res = hide(add(stage, box(cbox('u4l5-res', `<b>4 packages</b>: ${T('4\\times\\$12.00=\\$48.00')} &nbsp;<span class="muted">(the beef itself: ${T('3.405\\times\\$12.00=\\$40.86')})</span>`), W - 60, 54), 30, 342));
    return [
      { cap: 'Each patty is ¼ lb, so <b>4 patties make 1 lb</b>.', run: async (c) => { for (const p of pats.slice(0, 4)) await c.pop(p, 160); await c.fadeIn(grps[0]); } },
      { cap: `30 patties make 7 full pounds and 2 more patties (half a pound): ${T('30\\times0.25=7.5')} lb.`, run: async (c) => { for (const p of pats.slice(4)) await c.pop(p, 60); for (const g of grps.slice(1)) await c.fadeIn(g, 120); await c.fadeIn(L1); } },
      { cap: `Pounds to kilograms: ${T('7.5\\times0.454=3.405')} kg.`, run: (c) => c.fadeIn(L2) },
      { cap: 'Fill the 1 kg packages: 3 packages hold only 3 kg. The last 0.405 kg needs a <b>4th package</b>.', run: async (c) => { for (const p of pk) await c.fadeIn(p, 160); await tween(c, 1400, (t) => { beef.style.width = 3.405 * s * t + 'px'; }); await c.fadeIn(bl); } },
      { cap: `Round <b>up</b> to 4 packages: ${T('4\\times\\$12.00=\\$48.00')}. (The beef they use is worth $40.86.)`, run: (c) => c.pop(res) }
    ];
  }
};

/* =============================== Math History: the Gimli Glider =============================== */
function histAnim() {
  const svg = document.getElementById('u4l5-hist'); if (!svg) return;
  const NS = 'http://www.w3.org/2000/svg', mk = (t, a, p = svg) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); p.appendChild(e); return e; };
  const SER = 'Georgia, serif';
  mk('rect', { x: 0, y: 0, width: 600, height: 300, rx: 14, fill: '#fffaf1' });
  const cap = mk('text', { x: 300, y: 36, 'text-anchor': 'middle', 'font-family': SER, 'font-size': 22, fill: '#4a2c14' });
  // the fuel gauge
  const GX = 60, GY = 60, GH = 200, GW = 70;
  mk('rect', { x: GX, y: GY, width: GW, height: GH, rx: 8, fill: '#fff', stroke: '#7a4a26', 'stroke-width': 3 });
  const fill = mk('rect', { x: GX + 4, y: GY + GH - 4, width: GW - 8, height: 0, rx: 5, fill: '#b07a12' });
  const need = mk('line', { x1: GX - 10, x2: GX + GW + 10, y1: GY + 8, y2: GY + 8, stroke: '#7a4a26', 'stroke-width': 3, 'stroke-dasharray': '6 4' });
  const needT = mk('text', { x: GX + GW + 14, y: GY + 14, 'font-family': SER, 'font-size': 16, fill: '#4a2c14' }); needT.textContent = 'needed: 22 300 kg';
  const amt = mk('text', { x: GX + GW / 2, y: GY + GH + 28, 'text-anchor': 'middle', 'font-family': SER, 'font-size': 18, 'font-weight': 700, fill: '#7a4a26' });
  // the flight path
  const run = mk('rect', { x: 430, y: 262, width: 150, height: 8, rx: 3, fill: '#7a4a26' });
  const runT = mk('text', { x: 505, y: 288, 'text-anchor': 'middle', 'font-family': SER, 'font-size': 15, fill: '#4a2c14' }); runT.textContent = 'Gimli, Manitoba';
  void run;
  const path = mk('path', { d: 'M340 104 Q450 120 480 258', fill: 'none', stroke: '#b9a27f', 'stroke-width': 2, 'stroke-dasharray': '5 6' });
  const alt = mk('text', { x: 340, y: 88, 'text-anchor': 'middle', 'font-family': SER, 'font-size': 15, fill: '#4a2c14' }); alt.textContent = '41 000 ft';
  const plane = mk('g', {});
  mk('path', { d: 'M-26 0 L22 -3 Q30 0 22 3 Z M-4 0 L-14 -16 L-6 -16 L8 0 Z M-4 0 L-14 16 L-6 16 L8 0 Z M-24 0 L-30 -9 L-25 -9 L-18 0 Z', fill: '#4a2c14' }, plane);
  const L = path.getTotalLength ? path.getTotalLength() : 300;
  const clamp = (t) => Math.max(0, Math.min(1, t)), ease = (t) => t * t * (3 - 2 * t);
  const CAPS = [[0, 'The crew worked out the fuel: 22 300'], [3.2, '…but it was 22 300 pounds!'], [5.6, '22 300 lb ≈ 10 100 kg: less than half'], [8, 'The engines stopped. The jet glided to Gimli.']];
  const draw = (s) => {
    let c = CAPS[0][1]; for (const [t0, t] of CAPS) if (s >= t0) c = t; cap.textContent = c;
    const f1 = ease(clamp(s / 2.6)), f2 = ease(clamp((s - 5.8) / 1.6));
    const frac = f1 * (1 - f2 * (1 - 10100 / 22300));
    const hh = (GH - 12) * frac; fill.setAttribute('height', hh); fill.setAttribute('y', GY + GH - 4 - hh);
    fill.setAttribute('fill', s >= 5.8 ? '#c0392b' : '#b07a12');
    amt.textContent = s < 3.2 ? `${Math.round(22300 * f1 / 100) * 100} …` : s < 5.8 ? '22 300 lb' : `≈ ${Math.round((22300 - 12200 * f2) / 100) * 100} kg`;
    need.setAttribute('opacity', s > 5.6 ? 1 : 0.25); needT.setAttribute('opacity', s > 5.6 ? 1 : 0.25);
    const g = ease(clamp((s - 8.2) / 3.2)), p = path.getPointAtLength ? path.getPointAtLength(g * L) : { x: 340, y: 104 }, q = path.getPointAtLength ? path.getPointAtLength(Math.min(L, g * L + 2)) : { x: 341, y: 104 };
    const a = Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI;
    plane.setAttribute('transform', `translate(${p.x} ${p.y}) rotate(${g >= 1 ? 0 : a})`);
    plane.setAttribute('opacity', s >= 7.6 ? 1 : 0.35); alt.setAttribute('opacity', s >= 7.6 ? 1 : 0.35);
  };
  let raf = 0;
  const play = () => {
    cancelAnimationFrame(raf);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { draw(13); return; }
    const t0 = performance.now(); const tick = (now) => { const s = (now - t0) / 1000; draw(s); if (s < 12) raf = requestAnimationFrame(tick); }; raf = requestAnimationFrame(tick);
  };
  draw(13);
  svg.addEventListener('click', play);
  const btn = svg.closest('.hist-anim') && svg.closest('.hist-anim').querySelector('.hist-play'); if (btn) btn.addEventListener('click', play);
  let seen = false;
  new IntersectionObserver((es) => { es.forEach((e) => { if (e.isIntersecting && !seen) { seen = true; play(); } }); }, { threshold: 0.5 }).observe(svg);
}

/* =============================== wiring =============================== */
histAnim();
mountExplainers({ dial, heavier, estimate, unitFactor, wrongWay, lbOz, baggage, parcel, meatTags, burgers });

/* ============ Stand Up Break! — conversions, pounds and ounces, limits and prices, at the whiteboards ============ */
{
  const t1 = (v) => fx(v, 1), t2 = (v) => fx(v, 2);
  const ITEMS_KG = [['a dog', 18, 45], ['a suitcase', 15, 32], ['a bag of dog food', 5, 20], ['a hockey bag', 8, 18], ['a bike', 9, 16]];
  const ITEMS_LB = [['a backpack', 12, 30], ['a turkey', 12, 24], ['a bag of soil', 20, 50], ['a teenager', 110, 190], ['a box of books', 25, 60]];
  standup('u4l5', {
    intro: 'Estimate first. Then use a unit factor and your calculator. Is your answer bigger or smaller? Does that make sense?',
    levels: {
      BEG: (r) => r.pick([
        () => { const [w, a, b] = r.pick(ITEMS_KG), n = r.int(a, b); return { text: `The mass of ${w} is <b>${n} kg</b>. Estimate it in pounds, then find it to the nearest tenth.`, q: '', a: [`\\text{Estimate: }${n}\\times2=${2 * n},\\ ${2 * n}+${rnd(0.2 * n, 1)}=${rnd(2.2 * n, 1)}`, `${n}\\times2.2=${t1(n * 2.2)}\\text{ lb}`] }; },
        () => { const [w, a, b] = r.pick(ITEMS_LB), n = r.int(a, b); return { text: `The mass of ${w} is <b>${n} lb</b>. Estimate it in kilograms, then find it to the nearest tenth.`, q: '', a: [`\\text{Estimate: }${n}\\div2=${n / 2},\\ ${n / 2}-${rnd(n / 20, 2)}=${rnd(0.45 * n, 2)}`, `${n}\\times0.454=${rnd(n * 0.454, 3)}\\approx${t1(n * 0.454)}\\text{ kg}`] }; },
        () => { const n = r.int(3, 16); return { text: `A recipe needs <b>${n} oz</b> of cheese. About how many grams is that? Then find it to the nearest gram.`, q: '', a: [`\\text{Estimate: }${n}\\times30=${30 * n}\\text{ g}`, `${n}\\times28.35=${rnd(n * 28.35, 2)}\\approx${Math.round(n * 28.35)}\\text{ g}`] }; }
      ])(),
      PRG: (r) => r.pick([
        () => { const lb = r.int(5, 9), oz = r.int(1, 15), L = lb + oz / 16; return { text: `A baby was born at <b>${lb} lb ${oz} oz</b>. Find the mass in kilograms, to the nearest hundredth.`, q: '', a: [`${oz}\\div16=${rnd(oz / 16, 4)},\\text{ so }${rnd(L, 4)}\\text{ lb}`, `${rnd(L, 4)}\\times0.454=${rnd(L * 0.454, 4)}\\approx${t2(L * 0.454)}\\text{ kg}`] }; },
        () => { const kg = r.pick([2.5, 3.5, 4.5, 6, 7, 8, 11, 12]), lb = kg * 2.2, w = Math.floor(lb + 1e-9), oz = Math.round((lb - w) * 16); return { text: `A bag of rice is <b>${kg} kg</b>. Find its mass in pounds and ounces, to the nearest ounce.`, q: '', a: [`${kg}\\times2.2=${rnd(lb, 2)}\\text{ lb}=${w}\\text{ lb}+${rnd(lb - w, 2)}\\text{ lb}`, `${rnd(lb - w, 2)}\\times16=${rnd((lb - w) * 16, 2)}\\approx${oz}\\text{ oz}`, `\\text{about }${w}\\text{ lb }${oz}\\text{ oz}`] }; }
      ])(),
      MAS: (r) => r.pick([
        () => { const pa = r.int(399, 1299) / 100, pb = rnd(pa * 2.2 + r.pick([-1, 1]) * r.int(20, 90) / 100, 2), a = pa * 2.2; return { text: `Chicken wings cost <b>$${t2(pa)}/lb</b> at Store A and <b>$${t2(pb)}/kg</b> at Store B. Which store has the better price, and by how much per kg?`, q: '', a: [`\\text{A: }${t2(pa)}\\times2.2=${rnd(a, 3)}\\approx\\$${t2(a)}\\text{ per kg}`, `\\text{B: }\\$${t2(pb)}\\text{ per kg}`, `\\text{Store ${rnd(a, 2) < pb ? 'A' : 'B'}, by }\\$${t2(Math.abs(rnd(a, 2) - pb))}\\text{ per kg}`] }; },
        () => { const lim = r.pick([20, 23, 25]), lb = r.int(40, 60), kg = lb * 0.454; return { text: `A bag may be up to <b>${lim} kg</b>. Your scale says <b>${lb} lb</b>. Is the bag over the limit? By how much is it over or under?`, q: '', a: [`${lb}\\times0.454=${rnd(kg, 3)}\\approx${t1(kg)}\\text{ kg}`, `${kg > lim ? `\\text{Over, by about }${t1(kg - lim)}\\text{ kg}` : `\\text{Under, by about }${t1(lim - kg)}\\text{ kg}`}`] }; },
        () => { const [mat, f] = r.pick([['gravel', 1.4], ['topsoil', 1.1], ['sand', 1.3]]), lim = r.pick([2.5, 3, 3.5, 4, 4.5]), one = f * 0.907, n = Math.floor(lim / one + 1e-9); return { text: `A trailer can carry at most <b>${lim} t</b> (tonnes). ${mat[0].toUpperCase() + mat.slice(1)} has a mass of about <b>${f} tons</b> per cubic yard. How many whole cubic yards can it carry in one trip?`, q: '', a: [`1\\text{ yd}^3:\\ ${f}\\times0.907=${rnd(one, 4)}\\text{ t}`, `${lim}\\div${rnd(one, 4)}=${rnd(lim / one, 2)}\\ldots`, `\\text{round down: }${n}\\text{ cubic yard${n === 1 ? '' : 's'}}`] }; }
      ])()
    }
  });
}
