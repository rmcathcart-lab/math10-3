/* Math 10-3 · Unit 3 · Lesson 7 — Rearranging Formulas: Finding a Missing Side
 * Explainers: the balance (do the same to both sides: divide only one side and it tips; Example 1); the tape
 * unwrapped from a spruce trunk with diameters (or radii) laid along it, π ≈ 3.14 of them (Example 2); the formula
 * triangle for C = πd (Full notes); brackets on the calculator for 2π (Full notes); a floor filled one row at a time
 * (w = A ÷ l, Example 3); the undo stack for P = 2l + 2w (socks on, shoes on; shoes off first); Ava's fence laid out
 * straight, the two lengths taken off and the rest split in half, then wrapped around the run (Examples 4 and 7);
 * the verdict stamps for Noah's and Mei's answers (Example 6). Then the Stand Up Break. */
import { h, add, box, tex, svgEl, tween, stamp, stampIn, mountExplainers } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const rnd = (v, d = 2) => Math.round((v + (v >= 0 ? 1e-9 : -1e-9)) * 10 ** d) / 10 ** d;
const r1 = (v) => rnd(v, 1).toFixed(1);
const tr2 = (v) => (Math.floor(v * 100 + 1e-9) / 100).toFixed(2);   // calculator digits, cut (not rounded) before the …
const cbox = (cls, html) => h('div', cls + ' u3l7-cc', `<div>${html}</div>`);
const lerp = (a, b, t) => a + (b - a) * t;
const NS = 'http://www.w3.org/2000/svg';
const stxt = (parent, x, y, s, o = {}) => { const t = svgEl('text', { x, y, 'font-size': o.size || 20, 'font-weight': o.weight || 800, fill: o.fill || '#2b2b2b', 'text-anchor': o.anchor || 'middle', 'font-family': o.serif ? 'Georgia, serif' : null, 'font-style': o.italic ? 'italic' : null }, parent); t.textContent = s; return t; };

/* =====================================================================================
 * 1. The balance: do the same to both sides (Example 1)
 * ===================================================================================== */
const BAL = {
  demo: { kind: 'div', k: 4, v: 's', total: 36, ans: 9, unit: 'cm', f: 'P=4s' },
  a: { kind: 'div', k: 4, v: 's', total: 46, ans: 11.5, unit: 'ft', f: 'P=4s' },
  b: { kind: 'div', k: 3, v: 'w', total: 7.5, ans: 2.5, unit: 'm', f: 'A=lw' },
  c: { kind: 'sub', parts: [2.8, 3.5], v: 'c', total: 10, sum: 6.3, ans: 3.7, unit: 'm', f: 'P=a+b+c' }
};
const balance = {
  title: 'The balance: whatever you do to one side, do to the other',
  height: 390,
  minW: 920,
  choices: [{ v: 'demo', label: 'P = 4s, P = 36 cm' }, { sep: 'Example 1 check:' }, { v: 'a', label: '(a) the patio' }, { v: 'b', label: '(b) the rug' }, { v: 'c', label: '(c) the flower bed' }],
  ask: (k) => ({
    demo: 'A square has a perimeter of <b>36 cm</b>. How long is each side? Use <b>P = 4s</b>.',
    a: 'Example 1(a): a square patio has a perimeter of <b>46 ft</b>. How long is each side? Use <b>P = 4s</b>.',
    b: 'Example 1(b): a rug has an area of <b>7.5 m²</b>. It is <b>3 m</b> long. How wide is it? Use <b>A = lw</b>.',
    c: 'Example 1(c): the edging is <b>10 m</b>. Two sides are <b>2.8 m</b> and <b>3.5 m</b>. How long is the third side?'
  })[k],
  make(stage, key, ex) {
    const d = BAL[key], W = ex.W, PX = 300, PY = 96, ARM = 205, DY = 116;
    const svg = add(stage, svgEl('svg', { width: 600, height: 390, class: 'u3l7-svg' }), 0, 0);
    // stand
    svgEl('path', { d: `M${PX - 70} 372 L${PX + 70} 372 L${PX + 46} 352 L${PX - 46} 352 Z`, fill: '#6e4a1c' }, svg);
    svgEl('rect', { x: PX - 7, y: PY, width: 14, height: 256, fill: '#9a6a24', rx: 4 }, svg);
    const beam = svgEl('g', {}, svg);
    svgEl('rect', { x: PX - ARM - 6, y: PY - 6, width: 2 * ARM + 12, height: 12, rx: 6, fill: '#3a4254' }, beam);
    svgEl('path', { d: `M${PX} ${PY - 22} l-14 18 l28 0 z`, fill: '#c27a0e' }, beam);
    svgEl('circle', { cx: PX, cy: PY, r: 9, fill: '#c27a0e', stroke: '#6e4a1c', 'stroke-width': 3 }, svg);
    const pan = (cx) => {
      const g = svgEl('g', {}, svg);
      svgEl('line', { x1: cx, y1: PY, x2: cx - 86, y2: PY + DY, stroke: '#7a7f8c', 'stroke-width': 2.5 }, g);
      svgEl('line', { x1: cx, y1: PY, x2: cx + 86, y2: PY + DY, stroke: '#7a7f8c', 'stroke-width': 2.5 }, g);
      svgEl('path', { d: `M${cx - 98} ${PY + DY} Q${cx} ${PY + DY + 44} ${cx + 98} ${PY + DY} Z`, fill: '#d6dbe4', stroke: '#3a4254', 'stroke-width': 3.5 }, g);
      const items = svgEl('g', {}, g); return { g, items, cx };
    };
    const L = pan(PX - ARM), R = pan(PX + ARM);
    const base = PY + DY - 2;
    const block = (p, x, label) => { const g = svgEl('g', {}, p.items); svgEl('rect', { x: x - 21, y: base - 42, width: 42, height: 42, rx: 7, fill: '#fbe6e4', stroke: '#8b2f1c', 'stroke-width': 3 }, g); stxt(g, x, base - 13, label, { size: 26, fill: '#8b2f1c', serif: true, italic: true }); return g; };
    const weight = (p, x, label, w = 84, ht = 50) => {
      const g = svgEl('g', {}, p.items);
      svgEl('path', { d: `M${x - w / 2 + 8} ${base - ht} L${x + w / 2 - 8} ${base - ht} L${x + w / 2} ${base} L${x - w / 2} ${base} Z`, fill: '#f5ecdf', stroke: '#6e4a1c', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
      svgEl('path', { d: `M${x - 10} ${base - ht} q10 -14 20 0`, fill: 'none', stroke: '#6e4a1c', 'stroke-width': 3 }, g);
      const t = stxt(g, x, base - ht / 2 + 8, label, { size: w < 60 ? 17 : 22, fill: '#4a2c14' }); g.t = t; return g;
    };
    const setTilt = (deg) => {
      beam.setAttribute('transform', `rotate(${deg} ${PX} ${PY})`);
      const dy = ARM * Math.sin(deg * Math.PI / 180), dx = ARM * (1 - Math.cos(deg * Math.PI / 180));
      L.g.setAttribute('transform', `translate(${dx} ${-dy})`); R.g.setAttribute('transform', `translate(${-dx} ${dy})`);
    };
    let tilt = 0;
    const tiltTo = (c, deg, ms = 700) => { const a = tilt; tilt = deg; return tween(c, ms, (t) => setTilt(lerp(a, deg, t))); };
    // equations column
    const X = 620, EW = W - X - 16;
    const line = (y, html, cls = '') => hide(add(stage, box(cbox('u3l7-eq ' + cls, html), EW, 48), X, y));
    const st = hide(stamp(stage, 'Checks out ✓', { ok: true, x: X + EW / 2 + 40, y: 356, rotate: -5 }));
    [[L.cx, 'Left side'], [R.cx, 'Right side']].forEach(([x, s]) => { const e = add(stage, box(h('div', 'u3l7-lab', s), 160, 24), x - 80, 4); e.style.textAlign = 'center'; });
    if (d.kind === 'div') {
      const bw = 48, xs = Array.from({ length: d.k }, (_, i) => L.cx + (i - (d.k - 1) / 2) * bw);
      const blocks = xs.map((x) => block(L, x, d.v));
      const big = weight(R, R.cx, String(d.total), 96, 56);
      const pw = 46, pxs = Array.from({ length: d.k }, (_, i) => R.cx + (i - (d.k - 1) / 2) * (pw + 3));
      const pieces = pxs.map((x) => hide(weight(R, x, String(d.ans), pw, 40)));
      const tl = `${d.total}=${d.k}${d.v}`;
      const l1 = line(30, `${T(d.f)} &nbsp;→&nbsp; ${T(tl)}`);
      const l2 = line(92, `${T(`${d.total}\\div${d.k}=${d.k}${d.v}\\div${d.k}`)}`);
      const l3 = line(154, `${T(`${d.v}=${d.ans}`)}&nbsp;${d.unit}`, 'res');
      const l4 = line(216, `Check: ${T(`${d.k}\\times${d.ans}=${d.total}`)} ✓`, 'good');
      return [
        { cap: `Substitute: ${T(tl)}. The two sides <b>balance</b>.`, run: (c) => c.fadeIn(l1) },
        { cap: `<b>${d.v}</b> is multiplied by ${d.k}. Undo it: <b>divide by ${d.k}</b>. Divide only the left side… it <b>tips</b>!`, run: async (c) => { await Promise.all(blocks.slice(1).map((b) => c.anim(b, [{ opacity: 1 }, { opacity: 0 }], 450))); blocks[0].setAttribute('transform', `translate(${L.cx - xs[0]} 0)`); await tiltTo(c, 9); } },
        { cap: `Do the <b>same</b> to the right side: ${d.total} ÷ ${d.k} = ${d.ans}. Level again.`, run: async (c) => { await c.fadeIn(l2); await c.anim(big, [{ opacity: 1 }, { opacity: 0 }], 250); for (const p of pieces) await c.pop(p, 220); await Promise.all(pieces.slice(1).map((p) => c.anim(p, [{ opacity: 1 }, { opacity: 0 }], 400))); pieces[0].style.transform = ''; pieces[0].setAttribute('transform', `translate(${R.cx - pxs[0]} 0)`); await tiltTo(c, 0); } },
        { cap: `So <b>${d.v} = ${d.ans} ${d.unit}</b>.`, run: (c) => c.pop(l3) },
        { cap: `Check: put it back in. ${d.k} × ${d.ans} = ${d.total} ✓`, run: async (c) => { await c.fadeIn(l4); await stampIn(c, st); } }
      ];
    }
    // subtract: 10 = 2.8 + 3.5 + c
    const w1 = weight(L, L.cx - 62, String(d.parts[0]), 58, 42), w2 = weight(L, L.cx, String(d.parts[1]), 58, 42), bc = block(L, L.cx + 60, d.v);
    const wsum = hide(weight(L, L.cx - 32, String(d.sum), 70, 46));
    const big = weight(R, R.cx, String(d.total), 96, 56);
    const offWrap = svgEl('g', { transform: 'translate(0 -56)' }, R.items), off = hide(weight(R, R.cx, String(d.sum), 70, 40)); offWrap.appendChild(off);
    const tl = `${d.total}=${d.parts[0]}+${d.parts[1]}+${d.v}`;
    const l1 = line(14, T(tl));
    const l2 = line(70, T(`${d.total}=${d.sum}+${d.v}`));
    const l3 = line(126, T(`${d.total}-${d.sum}=${d.sum}+${d.v}-${d.sum}`));
    const l4 = line(182, `${T(`${d.v}=${d.ans}`)}&nbsp;${d.unit}`, 'res');
    const l5 = line(238, `Check: ${T(`${d.parts[0]}+${d.parts[1]}+${d.ans}=${d.total}`)} ✓`, 'good');
    return [
      { cap: `Substitute into ${T(d.f)}: ${T(tl)}. The sides <b>balance</b>.`, run: (c) => c.fadeIn(l1) },
      { cap: `Add the numbers you know: ${d.parts[0]} + ${d.parts[1]} = <b>${d.sum}</b>.`, run: async (c) => { await Promise.all([c.anim(w1, [{ opacity: 1 }, { opacity: 0 }], 300), c.anim(w2, [{ opacity: 1 }, { opacity: 0 }], 300)]); await c.pop(wsum); await c.fadeIn(l2); } },
      { cap: `<b>${d.v}</b> has ${d.sum} added to it. Undo it: <b>subtract ${d.sum}</b>. Take it off the left only… it <b>tips</b>!`, run: async (c) => { await c.anim(wsum, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-70px)' }], 600); bc.setAttribute('transform', `translate(${-60} 0)`); await tiltTo(c, 9); } },
      { cap: `Take ${d.sum} off the right too: ${d.total} − ${d.sum} = ${d.ans}. Level again.`, run: async (c) => { await c.fadeIn(l3); big.t.textContent = String(d.ans); await c.pop(off, 250); await c.anim(off, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-70px)' }], 600); await tiltTo(c, 0); } },
      { cap: `So <b>${d.v} = ${d.ans} ${d.unit}</b>.`, run: (c) => c.pop(l4) },
      { cap: `Check: put it back in. ${d.parts[0]} + ${d.parts[1]} + ${d.ans} = ${d.total} ✓`, run: async (c) => { await c.fadeIn(l5); await stampIn(c, st); } }
    ];
  }
};

/* =====================================================================================
 * 2. Unwrap the tape: how many diameters (or radii) fit along it? (Example 2)
 * ===================================================================================== */
const TR = {
  demo: { C: 90, find: 'd', unit: 'cm', thing: 'trunk' },
  a: { C: 188, find: 'd', unit: 'cm', thing: 'trunk' },
  b: { C: 113, find: 'r', unit: 'in', thing: 'table' }
};
const trunk = {
  title: 'Unwrap the tape: how many diameters fit along it?',
  height: 392,
  minW: 920,
  choices: [{ v: 'demo', label: 'A trunk: C = 90 cm' }, { sep: 'Example 2 check:' }, { v: 'a', label: '(a) the spruce: d' }, { v: 'b', label: '(b) the table: r' }],
  ask: (k) => ({
    demo: 'A tree trunk has a circumference of <b>90 cm</b>. Find its diameter.',
    a: 'Example 2(a): a spruce trunk has a circumference of <b>188 cm</b>. Find the diameter, to the nearest tenth.',
    b: 'Example 2(b): a round table has <b>113 in</b> of trim around its edge. Find the radius, to the nearest tenth.'
  })[k],
  make(stage, key, ex) {
    const d = TR[key], W = ex.W, isR = d.find === 'r';
    const Lpx = 700, R = Lpx / (2 * Math.PI), cx = 64 + R, cy = 24 + R, X0 = 64, LY = 290;
    const svg = add(stage, svgEl('svg', { width: W, height: 392, class: 'u3l7-svg' }), 0, 0);
    // the trunk (or the table top)
    if (isR) {
      svgEl('circle', { cx, cy, r: R, fill: '#e8d2a8', stroke: '#9a6a24', 'stroke-width': 6 }, svg);
      svgEl('circle', { cx, cy, r: R - 16, fill: 'none', stroke: '#d4b98a', 'stroke-width': 2 }, svg);
    } else {
      svgEl('circle', { cx, cy, r: R, fill: '#d9a46a', stroke: '#6b4423', 'stroke-width': 10 }, svg);
      [0.78, 0.58, 0.4, 0.22].forEach((f) => svgEl('circle', { cx: cx + 3, cy: cy - 2, r: R * f, fill: 'none', stroke: '#b77b3e', 'stroke-width': 2.5 }, svg));
    }
    svgEl('circle', { cx, cy, r: 4, fill: '#4a2c14' }, svg);
    const dl = isR ? svgEl('line', { x1: cx, y1: cy, x2: cx + R, y2: cy, stroke: '#1f5bd6', 'stroke-width': 5, 'stroke-linecap': 'round' }, svg)
      : svgEl('line', { x1: cx - R, y1: cy, x2: cx + R, y2: cy, stroke: '#1f5bd6', 'stroke-width': 5, 'stroke-dasharray': '10 7' }, svg);
    stxt(svg, isR ? cx + R / 2 : cx, cy - 12, d.find, { size: 28, fill: '#1f5bd6', serif: true, italic: true });
    // the tape: a ring around the edge that unwraps into a straight line
    const Rt = R + 7, len = 2 * Math.PI * Rt;
    const ring = svgEl('circle', { cx, cy, r: Rt, fill: 'none', stroke: '#e0841a', 'stroke-width': 7, 'stroke-dasharray': `${len} ${len}`, 'stroke-dashoffset': len, transform: `rotate(90 ${cx} ${cy})` }, svg);
    const tape = svgEl('line', { x1: X0, y1: LY, x2: X0, y2: LY, stroke: '#e0841a', 'stroke-width': 9, 'stroke-linecap': 'round' }, svg);
    tape.style.opacity = 0;
    const ctag = hide(add(stage, box(cbox('u3l7-eq mid', `<b>C = ${d.C} ${d.unit}</b>`), 150, 34), X0 + Lpx - 150, LY - 44));
    // diameters (radii) along the tape
    const n = isR ? 6 : 3, seg = isR ? R : 2 * R, bars = [];
    for (let i = 0; i < n; i++) {
      const g = hide(svgEl('g', {}, svg));
      svgEl('rect', { x: X0 + i * seg + 1, y: LY + 14, width: seg - 2, height: 26, rx: 5, fill: '#cfe0fb', stroke: '#1f5bd6', 'stroke-width': 2.5 }, g);
      stxt(g, X0 + i * seg + seg / 2, LY + 34, `${d.find} ${i + 1}`, { size: 17, fill: '#1f5bd6' });
      bars.push(g);
    }
    const bit = hide(svgEl('g', {}, svg));
    svgEl('rect', { x: X0 + n * seg + 1, y: LY + 14, width: Lpx - n * seg - 2, height: 26, rx: 4, fill: '#f6d7a8', stroke: '#c27a0e', 'stroke-width': 2.5 }, bit);
    const many = isR ? '2π ≈ 6.28 radii' : 'π ≈ 3.14 diameters';
    const mtag = hide(add(stage, box(cbox('u3l7-eq mid', `<b>${many}</b> fit along <i>C</i>`), 380, 34), X0 + Lpx - 380, LY + 50));
    // working, right of the circle
    const X = 2 * R + 110, EW = W - X - 16;
    const ans = isR ? d.C / (2 * Math.PI) : d.C / Math.PI, a1 = r1(ans);
    const div = isR ? 6 : 3, est = Math.round(d.C / div);
    const f = hide(add(stage, box(cbox('u3l7-eq', `So <b>${isR ? T('r=C\\div(2\\pi)') : T('d=C\\div\\pi')}</b>`), EW, 44), X, 16));
    const e1 = hide(add(stage, box(cbox('u3l7-estb', `Estimate: ${T(`${d.C}\\div${div}\\approx${est}`)}, so a bit less than ${est} ${d.unit}`), EW, 46), X, 70));
    const e2 = hide(add(stage, box(cbox('u3l7-eq res', isR ? `${T(`r=${d.C}\\div(2\\times\\pi)=${tr2(ans)}\\ldots\\approx${a1}`)} in` : `${T(`d=${d.C}\\div\\pi=${tr2(ans)}\\ldots\\approx${a1}`)} ${d.unit}`), EW, 46), X, 126));
    const back = isR ? 2 * Math.PI * Number(a1) : Math.PI * Number(a1);
    const e3 = hide(add(stage, box(cbox('u3l7-eq good', `Check: ${T(`${isR ? '2\\times\\pi' : '\\pi'}\\times${a1}=${r1(back)}\\approx${d.C}`)} ✓`), EW - 230, 46), X, 182));
    const st = hide(stamp(stage, 'Checks out ✓', { ok: true, x: X + EW - 112, y: 205, rotate: -5 }));
    return [
      { cap: `The tape goes once around the ${d.thing}: <b>C = ${d.C} ${d.unit}</b>.`, run: async (c) => { await tween(c, 900, (t) => ring.setAttribute('stroke-dashoffset', len * (1 - t))); await c.fadeIn(ctag); } },
      { cap: `Unwrap the tape and lay it out straight.`, run: async (c) => { ctag.style.opacity = 0; tape.style.opacity = 1; await tween(c, 1500, (t) => { ring.setAttribute('stroke-dashoffset', len * t); tape.setAttribute('x2', X0 + Lpx * t); }); await c.fadeIn(ctag); } },
      { cap: isR ? `How many <b>radii</b> fit along it? Lay the radius down: 1, 2, 3, 4, 5, 6…` : `How many <b>diameters</b> fit along it? Lay the diameter down: 1, 2, 3…`, run: async (c) => { for (const b of bars) await c.pop(b, 300); } },
      { cap: isR ? `…and a little bit more: <b>2π ≈ 6.28</b> radii, for every circle. So <b>r = C ÷ (2π)</b>.` : `…and a little bit more: <b>π ≈ 3.14</b> diameters, for every circle. So <b>d = C ÷ π</b>.`, run: async (c) => { await c.pop(bit); await c.fadeIn(mtag); await c.fadeIn(f); } },
      { cap: `Estimate: ${d.C} ÷ ${div} ≈ ${est}, so a bit less than ${est} ${d.unit}.`, run: (c) => c.fadeIn(e1) },
      { cap: isR ? `r = ${d.C} ÷ (2 × π) = ${tr2(ans)}… ≈ <b>${a1} in</b>.` : `d = ${d.C} ÷ π = ${tr2(ans)}… ≈ <b>${a1} ${d.unit}</b>.`, run: (c) => c.pop(e2) },
      { cap: `Check: ${isR ? '2 × π' : 'π'} × ${a1} = ${r1(back)} ≈ ${d.C} ✓`, run: async (c) => { await c.fadeIn(e3); await stampIn(c, st); } }
    ];
  }
};

/* =====================================================================================
 * 3. The formula triangle for C = πd (Full notes)
 * ===================================================================================== */
const TRI = {
  d: { cover: 'd', f: 'd=C\\div\\pi', why: '<i>C</i> is above π: <b>divide</b>', eg: 'd=188\\div\\pi\\approx59.8' },
  C: { cover: 'C', f: 'C=\\pi\\times d', why: 'π and <i>d</i> are side by side: <b>multiply</b>', eg: 'C=\\pi\\times59.8\\approx187.9' },
  pi: { cover: 'π', f: '\\pi=C\\div d', why: '<i>C</i> is above <i>d</i>: <b>divide</b>', eg: '188\\div59.84\\approx3.14' }
};
const triangle = {
  title: 'The formula triangle',
  height: 340,
  minW: 880,
  choices: [{ v: 'd', label: 'Find d' }, { v: 'C', label: 'Find C' }, { v: 'pi', label: 'Find π?' }],
  ask: (k) => `Use the formula triangle for ${T('C=\\pi d')} to find <b>${k === 'pi' ? 'π' : k}</b>.`,
  make(stage, k, ex) {
    const d = TRI[k], W = ex.W, X = 50, Y = 14;
    const svg = add(stage, svgEl('svg', { width: 420, height: 320, viewBox: '0 0 300 230', class: 'u3l7-svg' }), X, Y);
    svgEl('path', { d: 'M150 10 L290 220 L10 220 Z', fill: '#fff6e5', stroke: '#6e4a1c', 'stroke-width': 4, 'stroke-linejoin': 'round' }, svg);
    svgEl('line', { x1: 80, y1: 115, x2: 220, y2: 115, stroke: '#6e4a1c', 'stroke-width': 4 }, svg);
    svgEl('line', { x1: 150, y1: 115, x2: 150, y2: 220, stroke: '#6e4a1c', 'stroke-width': 4 }, svg);
    const P = { C: [150, 94, '#6e4a1c', true], 'π': [100, 186, '#1f5bd6', false], d: [200, 186, '#12805a', true] };
    Object.entries(P).forEach(([w, [x, y, c, it]]) => stxt(svg, x, y, w, { size: 38, fill: c, serif: true, italic: it, weight: 700 }));
    const [cx, cy] = P[d.cover];
    const card = svgEl('rect', { x: cx - 40, y: cy - 38, width: 80, height: 50, rx: 8, fill: '#3a4254', opacity: 0 }, svg);
    const why = hide(add(stage, box(cbox('u3l7-eq mid', `What is left: ${d.why}.`), W - 540, 60), 500, 50));
    const fm = hide(add(stage, box(cbox('u3l7-eq res mid', `<b>${T(d.f)}</b>`), W - 540, 60), 500, 130));
    const eg = hide(add(stage, box(cbox('u3l7-eq good mid', `The spruce: ${T(d.eg)}`), W - 540, 60), 500, 210));
    return [
      { cap: `Cover the one you want to find: <b>${d.cover}</b>.`, run: (c) => c.anim(card, [{ opacity: 0, transform: 'translateY(-30px)' }, { opacity: 0.92, transform: 'none' }], 500) },
      { cap: `Read what is left: ${d.why}.`, run: (c) => c.fadeIn(why) },
      { cap: `So ${T(d.f)}.`, run: (c) => c.pop(fm) },
      { cap: k === 'pi' ? `For <b>every</b> circle, C ÷ d comes out to about 3.14. That number is π.` : `With the spruce from Example 2: ${T(d.eg)}.`, run: (c) => c.fadeIn(eg) }
    ];
  }
};

/* =====================================================================================
 * 4. Brackets on the calculator (Full notes)
 * ===================================================================================== */
const brackets = {
  title: 'Brackets for 2π',
  height: 360,
  minW: 900,
  choices: [{ sep: 'Example 2(b):' }, { v: 'b', label: 'r = 113 ÷ (2π)' }],
  ask: 'Example 2(b): the table has <b>113 in</b> of trim. Which key presses give the radius?',
  make(stage, k, ex) {
    const W = ex.W, est = add(stage, box(cbox('u3l7-estb', `Estimate: ${T('113\\div6\\approx19')} in`), 420, 44), (W - 420) / 2, 6);
    hide(est);
    const rows = [
      { keys: '113÷(2×π)', r: '17.98450857', ok: true, why: 'Brackets: 2 × π first ✓' },
      { keys: '113÷2÷π', r: '17.98450857', ok: true, why: 'Divide by 2, then by π ✓' },
      { keys: '113÷2×π', r: '177.4999849', ok: false, why: '÷ 2, then <b>× π</b>: way more than 19 ✗' }
    ].map((o, i) => {
      const y = 66 + i * 96;
      const l = hide(add(stage, box(h('div', 'u3l7-lcd', `<div class="e">${o.keys}</div><div class="r">${o.r}</div>`), 300, 76), 60, y));
      const t = hide(add(stage, box(cbox('u3l7-eq ' + (o.ok ? 'good' : 'bad'), o.why), W - 560, 52), 390, y + 12));
      const s = hide(stamp(stage, o.ok ? '✓' : '✗', { ok: o.ok, x: W - 90, y: y + 38, rotate: o.ok ? -6 : 6 }));
      return [l, t, s];
    });
    const show = (r) => async (c) => { await c.pop(r[0]); await c.fadeIn(r[1]); await stampIn(c, r[2]); };
    return [
      { cap: `Estimate first: 113 ÷ 6 ≈ <b>19</b> in.`, run: (c) => c.fadeIn(est) },
      { cap: `With brackets: 113 ÷ (2 × π) = 17.98… ✓`, run: show(rows[0]) },
      { cap: `Or divide twice: 113 ÷ 2 ÷ π = 17.98… ✓ Same answer.`, run: show(rows[1]) },
      { cap: `No brackets: 113 ÷ 2 × π divides by 2 and then <b>multiplies</b> by π: 177.5. Nowhere near 19 ✗`, run: show(rows[2]) }
    ];
  }
};

/* =====================================================================================
 * 5. Fill the floor one row at a time: w = A ÷ l (Example 3)
 * ===================================================================================== */
const STR = {
  a: { A: 132, side: 12, unit: 'ft', known: 'length', want: 'width', v: 'w', f: 'w=A\\div l', cell: 28, ans: 11 },
  b: { A: 22.5, side: 3.6, unit: 'm', known: 'width', want: 'length', v: 'l', f: 'l=A\\div w', cell: 50, ans: 6.25 }
};
const strips = {
  title: 'How many rows fill the area?',
  height: 392,
  minW: 900,
  choices: [{ sep: 'Example 3 check:' }, { v: 'a', label: '(a) Kai’s bedroom' }, { v: 'b', label: '(b) the patio' }],
  ask: (k) => ({ a: 'Example 3(a): Kai’s floor has an area of <b>132 ft²</b>. The room is <b>12 ft</b> long. How wide is it?',
    b: 'Example 3(b): a patio uses <b>22.5 m²</b> of paving stones and is <b>3.6 m</b> wide. How long is it?' })[k],
  make(stage, key, ex) {
    const d = STR[key], W = ex.W, cs = d.cell, X0 = 70, BY = 340;
    const svg = add(stage, svgEl('svg', { width: 520, height: 392, class: 'u3l7-svg' }), 0, 0);
    const full = Math.floor(d.side + 1e-9), part = rnd(d.side - full, 3), rowsFull = Math.floor(d.ans + 1e-9), last = rnd(d.ans - rowsFull, 3);
    const rowW = d.side * cs;
    // outline of the whole floor (dashed, the answer) and the known side
    const outline = hide(svgEl('rect', { x: X0, y: BY - d.ans * cs, width: rowW, height: d.ans * cs, fill: 'none', stroke: '#8b2f1c', 'stroke-width': 3, 'stroke-dasharray': '8 6' }, svg));
    svgEl('line', { x1: X0, y1: BY + 8, x2: X0 + rowW, y2: BY + 8, stroke: '#c27a0e', 'stroke-width': 4 }, svg);
    const sideLab = add(stage, box(cbox('u3l7-eq mid', `<b>${d.known} ${d.side} ${d.unit}</b>`), 200, 26), X0 + rowW / 2 - 100, BY + 16);
    sideLab.style.fontSize = '18px'; sideLab.style.color = '#8a560a';
    const row = (i, frac) => {
      const g = hide(svgEl('g', {}, svg)), hgt = frac * cs, y = BY - i * cs - hgt;
      for (let j = 0; j < full; j++) svgEl('rect', { x: X0 + j * cs, y, width: cs, height: hgt, fill: frac < 1 ? '#f6d7a8' : '#c9ecd9', stroke: '#12805a', 'stroke-width': 1.5 }, g);
      if (part > 0) svgEl('rect', { x: X0 + full * cs, y, width: part * cs, height: hgt, fill: '#f6d7a8', stroke: '#12805a', 'stroke-width': 1.5 }, g);
      return g;
    };
    const rows = []; for (let i = 0; i < rowsFull; i++) rows.push(row(i, 1));
    const lastRow = last > 0 ? row(rowsFull, last) : null;
    const want = hide(add(stage, box(cbox('u3l7-eq res mid', `<b>${d.want}<br>${d.ans} ${d.unit}</b>`), 110, 56), X0 + rowW + 10, BY - d.ans * cs / 2 - 28));
    want.style.fontSize = '19px';
    // the counter and the working
    const X = 580, EW = W - X - 16, Y = last > 0 ? [16, 70, 124, 178, 232, 286, 350] : [30, 90, 0, 0, 150, 210, 290];
    const perRow = `${d.side}\\times1=${d.side}`;
    const ctr = hide(add(stage, box(cbox('u3l7-eq', ''), EW, 48), X, Y[0]));
    const setCtr = (n) => { ctr.firstChild.innerHTML = `Rows: <b>${n}</b> &nbsp; Area: <b>${rnd(n * d.side, 2)} ${d.unit}²</b> of ${d.A}`; };
    setCtr(0);
    const e1 = hide(add(stage, box(cbox('u3l7-eq', `One row: ${T(perRow)} ${d.unit}²`), EW, 46), X, Y[1]));
    const left = rnd(d.A - rowsFull * d.side, 2);
    const e2 = last > 0 ? hide(add(stage, box(cbox('u3l7-eq', `Left over: ${T(`${d.A}-${rnd(rowsFull * d.side, 2)}=${left}`)} ${d.unit}²`), EW, 46), X, Y[2])) : null;
    const e2b = last > 0 ? hide(add(stage, box(cbox('u3l7-eq', `${T(`${left}\\div${d.side}=${last}`)} of a row`), EW, 46), X, Y[3])) : null;
    const e3 = hide(add(stage, box(cbox('u3l7-eq res', `${T(d.f)} ${T(`=${d.A}\\div${d.side}=${d.ans}`)} ${d.unit}`), EW, 46), X, Y[4]));
    const e4 = hide(add(stage, box(cbox('u3l7-eq good', `Check: ${T(`${d.side}\\times${d.ans}=${d.A}`)} ✓`), EW, 46), X, Y[5]));
    const st = hide(stamp(stage, 'Checks out ✓', { ok: true, x: X + EW - 100, y: Y[6], rotate: -5 }));
    const steps = [
      { cap: `One row along the ${d.side} ${d.unit} ${d.known}, 1 ${d.unit} deep, holds <b>${d.side} ${d.unit}²</b>.`, run: async (c) => { await c.fadeIn(ctr); await c.pop(rows[0]); setCtr(1); await c.fadeIn(e1); } },
      { cap: last > 0 ? `Keep adding rows: ${rowsFull} rows hold ${rowsFull} × ${d.side} = ${rnd(rowsFull * d.side, 2)} ${d.unit}². Not quite ${d.A}.` : `Keep adding rows until the floor holds ${d.A} ${d.unit}²…`,
        run: async (c) => { for (let i = 1; i < rowsFull; i++) { await c.anim(rows[i], [{ opacity: 0, transform: 'translateY(-14px)' }, { opacity: 1, transform: 'none' }], 160); setCtr(i + 1); } } }
    ];
    if (last > 0) steps.push({ cap: `The last ${rnd(d.A - rowsFull * d.side, 2)} ${d.unit}² is part of a row: ${rnd(d.A - rowsFull * d.side, 2)} ÷ ${d.side} = <b>${last}</b> of a row.`, run: async (c) => { await c.fadeIn(e2); await c.pop(lastRow); ctr.firstChild.innerHTML = `Rows: <b>${d.ans}</b> &nbsp; Area: <b>${d.A} ${d.unit}²</b> of ${d.A}`; await c.fadeIn(e2b); } });
    steps.push({ cap: `${d.ans} rows, so the ${d.want} is ${d.ans} ${d.unit}: ${T(d.f)} = ${d.A} ÷ ${d.side} = <b>${d.ans} ${d.unit}</b>.`, run: async (c) => { await c.fadeIn(outline); await c.pop(want); await c.pop(e3); } });
    steps.push({ cap: `Check: ${d.side} × ${d.ans} = ${d.A} ✓`, run: async (c) => { await c.fadeIn(e4); await stampIn(c, st); } });
    return steps;
  }
};

/* =====================================================================================
 * 6. The undo stack for P = 2l + 2w: socks on, shoes on; shoes off first (Example 4)
 * ===================================================================================== */
const STK = {
  w: { b: ['w', '\\times2', '2w', '+2l', 'P=2l+2w'], u: ['P', '-2l', 'P-2l=2w', '\\div2', 'w=(P-2l)\\div2'], fin: 'w=(P-2l)\\div2' },
  l: { b: ['l', '\\times2', '2l', '+2w', 'P=2l+2w'], u: ['P', '-2w', 'P-2w=2l', '\\div2', 'l=(P-2w)\\div2'], fin: 'l=(P-2w)\\div2' },
  ava: { b: ['w=\\,?', '\\times2', '2w', '+22', '2w+22=36'], u: ['36', '-22', '36-22=14', '\\div2', '14\\div2=7'], fin: 'w=7\\text{ m}' }
};
const stack = {
  title: 'The undo stack: undo the last step first',
  height: 400,
  minW: 920,
  choices: [{ v: 'w', label: 'Find w' }, { v: 'l', label: 'Find l' }, { sep: 'Example 4 check:' }, { v: 'ava', label: 'Ava: P = 36 m, l = 11 m' }],
  ask: (k) => ({ w: `Rearrange ${T('P=2l+2w')} to find <b>w</b>.`, l: `Rearrange ${T('P=2l+2w')} to find <b>l</b>.`,
    ava: 'Example 4: Ava has <b>36 m</b> of fencing. The dog run is <b>11 m</b> long. How wide will it be?' })[k],
  make(stage, key, ex) {
    const d = STK[key], W = ex.W, BW = 280, BH = 52, LX = 70, RX = W - 70 - BW, ys = [334, 268, 202, 136, 70];
    const v = key === 'l' ? 'l' : 'w', o = key === 'l' ? 'w' : 'l';
    add(stage, box(h('div', 'u3l7-lab', 'Build P'), 200, 24), LX, 30);
    add(stage, box(h('div', 'u3l7-lab undo', 'Undo, top first'), 260, 24), RX, 30);
    const cls = ['v', 'op', 'res', 'op', 'res'], ucls = ['res', 'un', 'res', 'un', 'fin'];
    const L = d.b.map((s, i) => hide(add(stage, box(cbox('u3l7-blk ' + cls[i], T(s)), BW, BH), LX, ys[i])));
    const R = d.u.map((s, i) => hide(add(stage, box(cbox('u3l7-blk ' + ucls[i], T(s)), BW, BH), RX, ys[4 - i])));
    const wear = (x, y, s) => hide(add(stage, box(h('div', 'u3l7-wear', s), 140, 20), x, y));
    const wl = [wear(LX + BW + 10, ys[1] + 16, 'socks on'), wear(LX + BW + 10, ys[3] + 16, 'shoes on')];
    const wr = [wear(RX - 150, ys[3] + 16, 'shoes off first'), wear(RX - 150, ys[1] + 16, 'then socks off')];
    wr.forEach((e) => { e.style.textAlign = 'right'; });
    const svg = add(stage, svgEl('svg', { width: W, height: 400, class: 'u3l7-svg' }), 0, 0);
    const ax0 = LX + BW + 14, ax1 = RX - 14, ay = ys[4] + BH / 2;
    const arr = hide(svgEl('g', {}, svg));
    svgEl('line', { x1: ax0, y1: ay, x2: ax1 - 6, y2: ay, stroke: '#c27a0e', 'stroke-width': 5, 'stroke-linecap': 'round' }, arr);
    svgEl('path', { d: `M${ax1} ${ay} l-16 -10 l0 20 z`, fill: '#c27a0e' }, arr);
    const st = key === 'ava' ? hide(stamp(stage, 'Checks out ✓', { ok: true, x: W / 2, y: 256, rotate: -5 })) : null;
    const chk = key === 'ava' ? hide(add(stage, box(cbox('u3l7-eq good mid', `${T('2(11)+2(7)=36')} ✓`), 240, 44), W / 2 - 120, 186)) : null;
    const up = (c, el) => c.anim(el, [{ opacity: 0, transform: 'translateY(20px)' }, { opacity: 1, transform: 'none' }], 380);
    const steps = [
      { cap: key === 'ava' ? `Start with the missing width, <b>w</b>. The formula does two things to it. First <b>× 2</b> (socks on)…` : `The formula starts with <b>${v}</b> and does two things to it. First <b>× 2</b> (socks on)…`,
        run: async (c) => { await c.pop(L[0]); await up(c, L[1]); await c.fadeIn(wl[0]); await up(c, L[2]); } },
      { cap: key === 'ava' ? `…then <b>+ 2 × 11 = + 22</b> (shoes on). That makes the 36 m of fence.` : `…then <b>+ 2${o}</b> (shoes on). That makes <b>P</b>.`,
        run: async (c) => { await up(c, L[3]); await c.fadeIn(wl[1]); await up(c, L[4]); } },
      { cap: `To get back to ${v}, undo in <b>reverse order</b>. Shoes come off first: undo ${key === 'ava' ? '+ 22 with <b>− 22</b>' : `+ 2${o} with <b>− 2${o}</b>`}.`,
        run: async (c) => { await c.fadeIn(arr); await c.pop(R[0]); await c.fadeIn(R[1]); await c.fadeIn(wr[0]); await c.fadeIn(R[2]); } },
      { cap: `Then the socks: undo × 2 with <b>÷ 2</b>.`, run: async (c) => { await c.fadeIn(R[3]); await c.fadeIn(wr[1]); await c.pop(R[4]); } }
    ];
    if (key === 'ava') steps.push({ cap: `The dog run will be <b>7 m</b> wide. Check: 2(11) + 2(7) = 22 + 14 = 36 ✓`, run: async (c) => { await c.fadeIn(chk); await stampIn(c, st); } });
    else steps.push({ cap: `So <b>${T(d.fin)}</b>. Two steps, undone in reverse order.`, run: (c) => c.anim(R[4], [{ transform: 'scale(1)' }, { transform: 'scale(1.08)' }, { transform: 'scale(1)' }], 500) });
    return steps;
  }
};

/* =====================================================================================
 * 7. Ava's fence: lay it out straight, take off the two lengths, split the rest (Examples 4 and 7)
 * ===================================================================================== */
const FEN = {
  ava: { P: 36, l: 11, unit: 'm', who: 'Ava', what: 'dog run' },
  maya: { P: 24, l: 7, unit: 'ft', who: 'Maya', what: 'garden bed', money: 78, price: 3.25 }
};
const fence = {
  title: 'Take off the two lengths, then split the rest in half',
  height: 420,
  minW: 920,
  choices: [{ sep: 'Example 4 check:' }, { v: 'ava', label: 'Ava: 36 m, l = 11 m' }, { sep: 'Example 7 check:' }, { v: 'maya', label: 'Maya: $78.00 of edging' }],
  ask: (k) => ({ ava: 'Example 4: Ava has <b>36 m</b> of fencing. The dog run is <b>11 m</b> long. How wide will it be?',
    maya: 'Example 7: Maya has <b>$78.00</b>. Edging costs <b>$3.25 per foot</b>. The bed is <b>7 ft</b> long. How wide can it be?' })[k],
  make(stage, key, ex) {
    const d = FEN[key], W = ex.W, w = (d.P - 2 * d.l) / 2, X0 = 70, BL = Math.min(820, W - 140), k = BL / d.P, BY = 70;
    const svg = add(stage, svgEl('svg', { width: W, height: 420, class: 'u3l7-svg' }), 0, 0);
    const total = hide(add(stage, box(cbox('u3l7-eq mid', `<b>${d.P} ${d.unit}</b> of ${key === 'maya' ? 'edging' : 'fence'}`), 260, 30), X0 + BL / 2 - 130, BY - 52));
    // the four pieces: l, l, w, w, laid end to end along the bar
    const lens = [d.l, d.l, w, w], col = ['#c27a0e', '#c27a0e', '#1f5bd6', '#1f5bd6'];
    let x = X0; const start = lens.map((L) => { const s = { x, y: BY, a: 0 }; x += L * k; return s; });
    const rects = [];
    const pieces = lens.map((L, i) => {
      const g = hide(svgEl('g', {}, svg));
      rects.push(svgEl('rect', { x: 0, y: -8, width: L * k, height: 16, rx: 5, fill: '#e8d2a8', stroke: '#9a6a24', 'stroke-width': 1.5 }, g));
      for (let j = 1; j < L; j++) svgEl('line', { x1: j * k, y1: -8, x2: j * k, y2: 8, stroke: '#9a6a24', 'stroke-width': 1, opacity: 0.45 }, g);
      g.setAttribute('transform', `translate(${start[i].x} ${start[i].y})`); return g;
    });
    const paint = (i) => { rects[i].setAttribute('fill', col[i]); rects[i].setAttribute('stroke', '#3a4254'); };
    const setP = (g, s) => g.setAttribute('transform', `translate(${s.x} ${s.y}) rotate(${s.a})`);
    const tag = (cx, y, html, color) => { const e = hide(add(stage, box(cbox('u3l7-eq mid', html), 120, 28), cx - 60, y)); e.style.color = color; e.style.fontSize = '19px'; return e; };
    const lt = [0, 1].map((i) => tag(start[i].x + d.l * k / 2, BY + 14, `<b>${d.l} ${d.unit}</b>`, '#8a560a'));
    const both = hide(add(stage, box(cbox('u3l7-eq mid', `<b>${d.P - 2 * d.l} ${d.unit}</b> = both widths`), 280, 28), start[2].x + w * k - 140, BY + 14));
    both.style.color = '#1f5bd6'; both.style.fontSize = '19px';
    const wt = [2, 3].map((i) => tag(start[i].x + w * k / 2, BY + 14, `<b>${w} ${d.unit}</b>`, '#1f5bd6'));
    // the rectangle the pieces wrap around
    const rx = 90, ry = 160, rw = d.l * k, rh = w * k;
    const yard = hide(svgEl('rect', { x: rx, y: ry, width: rw, height: rh, fill: '#e3f3ea' }, svg));
    svg.insertBefore(yard, svg.firstChild);
    const end = [{ x: rx, y: ry, a: 0 }, { x: rx, y: ry + rh, a: 0 }, { x: rx, y: ry, a: 90 }, { x: rx + rw, y: ry, a: 90 }];
    const rl = [tag(rx + rw / 2, ry - 34, `<b>${d.l} ${d.unit}</b>`, '#8a560a'), tag(rx + rw / 2, ry + rh + 8, `<b>${d.l} ${d.unit}</b>`, '#8a560a'),
      tag(rx - 70, ry + rh / 2 - 14, `<b>${w} ${d.unit}</b>`, '#1f5bd6'), tag(rx + rw + 52, ry + rh / 2 - 14, `<b>${w} ${d.unit}</b>`, '#1f5bd6')];
    rl[2].style.width = '74px'; rl[2].style.left = (rx - 84) + 'px';
    // the working
    const X = Math.max(rx + rw + 110, 480), EW = W - X - 16;
    const eq = (y, html, cls = '') => hide(add(stage, box(cbox('u3l7-eq ' + cls, html), EW, 44), X, y));
    const m0 = key === 'maya' ? eq(128, `${T('\\$78.00\\div\\$3.25=24')} ft`) : null;
    const e1 = eq(176, `${T(`2\\times${d.l}=${2 * d.l}`)}`);
    const e2 = eq(222, `${T(`${d.P}-${2 * d.l}=${d.P - 2 * d.l}`)} &nbsp;<small>both widths</small>`);
    const e3 = eq(268, `${T(`w=${d.P - 2 * d.l}\\div2=${w}`)} ${d.unit}`, 'res');
    const e4 = eq(314, `Check: ${T(`2(${d.l})+2(${w})=${2 * d.l}+${2 * w}=${d.P}`)} ✓`, 'good');
    const st = hide(stamp(stage, 'Checks out ✓', { ok: true, x: X + EW - 112, y: 388, rotate: -5 }));
    const steps = [];
    if (key === 'maya') steps.push({ cap: `First the perimeter: $78.00 buys $78.00 ÷ $3.25 per foot = <b>24 ft</b> of edging.`, run: (c) => c.fadeIn(m0) });
    steps.push(
      { cap: `${d.who} has <b>${d.P} ${d.unit}</b> of ${key === 'maya' ? 'edging' : 'fence'}. Lay it all out straight.`, run: async (c) => { await Promise.all(pieces.map((p) => c.anim(p, [{ opacity: 0 }, { opacity: 1 }], 400))); await c.fadeIn(total); } },
      { cap: `The ${d.what} has <b>two</b> lengths of ${d.l} ${d.unit}: 2 × ${d.l} = <b>${2 * d.l} ${d.unit}</b>. Mark them off.`, run: async (c) => { paint(0); paint(1); for (const t of lt) await c.pop(t); await c.fadeIn(e1); } },
      { cap: `What is left, ${d.P} − ${2 * d.l} = ${d.P - 2 * d.l} ${d.unit}, is <b>both widths together</b>.`, run: async (c) => { paint(2); paint(3); await c.fadeIn(both); await c.fadeIn(e2); } },
      { cap: `Split it in half: ${d.P - 2 * d.l} ÷ 2 = <b>${w} ${d.unit}</b> for each width.`, run: async (c) => { both.style.opacity = 0; await tween(c, 500, (t) => setP(pieces[3], { x: start[3].x + 14 * t, y: BY, a: 0 })); for (const t of wt) await c.pop(t); await c.pop(e3); } },
      { cap: `Now wrap it around the ${d.what}: ${d.l}, ${w}, ${d.l}, ${w}.`, run: async (c) => {
        [...lt, ...wt, total].forEach((e) => { e.style.opacity = 0; });
        const s3 = { x: start[3].x + 14, y: BY, a: 0 }, from = [start[0], start[1], start[2], s3];
        await c.fadeIn(yard, 300);
        await tween(c, 1400, (t) => pieces.forEach((p, i) => setP(p, { x: lerp(from[i].x, end[i].x, t), y: lerp(from[i].y, end[i].y, t), a: lerp(0, end[i].a, t) })));
        for (const t of rl) await c.fadeIn(t, 200);
      } },
      { cap: `Check: 2(${d.l}) + 2(${w}) = ${2 * d.l} + ${2 * w} = ${d.P} ✓${key === 'maya' ? ' And 24 × $3.25 = $78.00 ✓' : ''}`, run: async (c) => { await c.fadeIn(e4); await stampIn(c, st); } }
    );
    return steps;
  }
};

/* =====================================================================================
 * 8. Check it: verdict stamps for Noah and Mei (Example 6)
 * ===================================================================================== */
const verdict = {
  title: 'Check it: does it make sense, and does it substitute back?',
  height: 404,
  minW: 920,
  choices: [{ sep: 'Example 6 check:' }, { v: 'noah', label: '(a) Noah’s width' }, { v: 'mei', label: '(b) Mei’s diameter' }],
  ask: (k) => ({ noah: `Example 6(a): <b>P = 50 cm</b>, <b>l = 15 cm</b>. Noah wrote ${T('w=50-2(15)=20')} cm.`,
    mei: `Example 6(b): a round pool has <b>C = 94.2 in</b>. Mei wrote ${T('d=94.2\\times\\pi=295.9')} in.` })[k],
  make(stage, key, ex) {
    const W = ex.W;
    const svg = add(stage, svgEl('svg', { width: W, height: 392, class: 'u3l7-svg' }), 0, 0);
    if (key === 'noah') {
      const k = 8, PW = (W - 60) / 2;
      const panel = (x0, wv, ok) => {
        const g = hide(svgEl('g', {}, svg)), rw = 15 * k, rh = wv * k, rx = x0 + 40, ry = 40;
        svgEl('rect', { x: rx, y: ry, width: rw, height: rh, fill: ok ? '#e3f3ea' : '#fbe6e4', stroke: ok ? '#12805a' : '#c93a33', 'stroke-width': 4 }, g);
        stxt(g, rx + rw / 2, ry - 8, '15 cm', { size: 18, fill: '#8a560a' });
        stxt(g, rx + rw + 10, ry + rh / 2 + 6, `${wv} cm`, { size: 18, fill: '#1f5bd6', anchor: 'start' });
        return g;
      };
      const A = panel(20, 20, false), B = panel(40 + PW, 10, true);
      const ex1 = hide(add(stage, box(cbox('u3l7-eq', `Noah: ${T('w=20')} cm`), PW - 200, 40), 20 + 230, 50));
      const ch1 = hide(add(stage, box(cbox('u3l7-eq bad', `${T('2(15)+2(20)=70')}, not 50`), PW - 30, 44), 20, 250));
      const why = hide(add(stage, box(cbox('u3l7-why', `${T('50-30=20')} is <b>both</b> widths: no Step 2.`), PW - 10, 56), 20, 300));
      const s1 = hide(stamp(stage, 'Doesn’t check ✗', { ok: false, x: 20 + PW - 120, y: 180, rotate: 7 }));
      const ex2 = hide(add(stage, box(cbox('u3l7-eq res', `${T('w=(50-30)\\div2=10')} cm`), PW - 30, 44), 40 + PW, 150));
      const ch2 = hide(add(stage, box(cbox('u3l7-eq good', `${T('2(15)+2(10)=50')} ✓`), PW - 30, 44), 40 + PW, 250));
      const s2 = hide(stamp(stage, 'Checks out ✓', { ok: true, x: 40 + PW + PW / 2 + 60, y: 340, rotate: -5 }));
      return [
        { cap: `Noah says w = 20 cm. Substitute back: 2(15) + 2(20) = 30 + 40 = <b>70</b>.`, run: async (c) => { await c.fadeIn(A); await c.fadeIn(ex1); await c.fadeIn(ch1); } },
        { cap: `70 is not 50 ✗. ${T('50-30=20')} is <b>both</b> widths: Noah forgot Step 2.`, run: async (c) => { await stampIn(c, s1); await c.fadeIn(why); } },
        { cap: `Fix it: w = (50 − 30) ÷ 2 = 20 ÷ 2 = <b>10 cm</b>.`, run: async (c) => { await c.fadeIn(B); await c.pop(ex2); } },
        { cap: `Check: 2(15) + 2(10) = 30 + 20 = 50 ✓`, run: async (c) => { await c.fadeIn(ch2); await stampIn(c, s2); } }
      ];
    }
    // Mei: compare lengths on one scale
    const X0 = 230, k = Math.min(2.4, (W - X0 - 30) / 300);
    const row = (y, len, color, label, txt) => {
      const g = hide(svgEl('g', {}, svg)); g.style.transformOrigin = '0% 50%';
      svgEl('rect', { x: X0, y, width: len * k, height: 22, rx: 5, fill: color, stroke: '#3a4254', 'stroke-width': 1.5 }, g);
      const l = add(stage, box(cbox('u3l7-eq', label), X0 - 16, 30), 6, y - 4); hide(l); l.style.fontSize = '18px'; l.style.justifyContent = 'flex-end';
      const t = txt ? add(stage, box(cbox('u3l7-eq', txt), 360, 30), X0 + len * k + 12, y - 4) : null; if (t) { hide(t); t.style.fontSize = '18px'; }
      return [g, l, t];
    };
    const C = row(30, 94.2, '#e0841a', 'Distance around', '<b>94.2 in</b>');
    const M = row(100, 295.9, '#f7d3cf', 'Mei’s diameter', '');
    const mt = hide(add(stage, box(cbox('u3l7-eq bad mid', '<b>295.9 in</b>: about 3 times as long as the distance around!'), 560, 40), X0 + 60, 132));
    const s1 = hide(stamp(stage, 'No sense ✗', { ok: false, x: W - 130, y: 195, rotate: 7 }));
    const dd = 94.2 / Math.PI, bars = [];
    for (let i = 0; i < 3; i++) { const g = hide(svgEl('g', {}, svg)); svgEl('rect', { x: X0 + i * dd * k, y: 250, width: dd * k - 2, height: 22, rx: 5, fill: '#cfe0fb', stroke: '#1f5bd6', 'stroke-width': 2 }, g); stxt(g, X0 + (i + 0.5) * dd * k, 266, `d ${i + 1}`, { size: 15, fill: '#1f5bd6' }); bars.push(g); }
    const bit = hide(svgEl('rect', { x: X0 + 3 * dd * k, y: 250, width: (94.2 - 3 * dd) * k, height: 22, rx: 3, fill: '#f6d7a8', stroke: '#c27a0e', 'stroke-width': 2 }, svg));
    const lab = hide(add(stage, box(cbox('u3l7-eq', 'Correct diameter'), X0 - 16, 30), 6, 246)); lab.style.fontSize = '18px'; lab.style.justifyContent = 'flex-end';
    const fix = hide(add(stage, box(cbox('u3l7-eq res', `${T('d=94.2\\div\\pi=29.98\\ldots\\approx30.0')} in`), 470, 44), X0, 190));
    const chk = hide(add(stage, box(cbox('u3l7-eq good', `Check: ${T('\\pi\\times30.0=94.25\\approx94.2')} ✓ &nbsp;<small>about 3 diameters fit around</small>`), W - X0 - 20, 44), X0, 300));
    const s2 = hide(stamp(stage, 'Checks out ✓', { ok: true, x: W - 150, y: 370, rotate: -5 }));
    return [
      { cap: `The distance around the pool is <b>94.2 in</b>.`, run: async (c) => { await c.fadeIn(C[1]); await c.anim(C[0], [{ opacity: 0, transform: 'scaleX(0)' }, { opacity: 1, transform: 'none' }], 500); await c.fadeIn(C[2]); } },
      { cap: `Mei says the diameter is 295.9 in. Does it make sense? It is <b>longer</b> than the distance around! ✗`, run: async (c) => { await c.fadeIn(M[1]); await c.anim(M[0], [{ opacity: 0, transform: 'scaleX(0)' }, { opacity: 1, transform: 'none' }], 700); await c.fadeIn(mt); await stampIn(c, s1); } },
      { cap: `Mei multiplied by π. To undo × π, <b>divide</b>: d = 94.2 ÷ π = 29.98… ≈ <b>30.0 in</b>.`, run: async (c) => { await c.pop(fix); await c.fadeIn(lab); for (const b of bars) await c.pop(b, 260); await c.pop(bit, 260); } },
      { cap: `Check: π × 30.0 = 94.25 ≈ 94.2 ✓ About 3 diameters fit around, like every circle.`, run: async (c) => { await c.fadeIn(chk); await stampIn(c, s2); } }
    ];
  }
};

mountExplainers({ balance, trunk, triangle, brackets, strips, stack, fence, verdict });

/* ============ Stand Up Break! — finding a missing side, at the whiteboards ============ */
{
  const n = (v) => String(rnd(v, 2));
  standup('u3l7', {
    intro: 'Substitute or rearrange, estimate, solve, then CHECK by putting your answer back in.',
    levels: {
      BEG: (r) => r.pick([
        () => { const s = r.int(10, 60) / 2, P = rnd(4 * s, 2); return { text: `A square ${r.pick(['sandbox', 'window', 'quilt block', 'tile'])} has a perimeter of <b>${n(P)} ${r.pick(['in', 'cm'])}</b>. How long is each side? Use ${T('P=4s')}.`, q: '', a: [`${n(P)}=4s`, `s=${n(P)}\\div4=${n(s)}`, `\\text{check: }4\\times${n(s)}=${n(P)}`] }; },
        () => { const l = r.int(4, 15), w = r.int(3, 12), A = l * w; return { text: `A rectangular ${r.pick(['garden', 'room', 'deck', 'banner'])} has an area of <b>${A} ${r.pick(['m²', 'ft²'])}</b>. It is <b>${l}</b> long. How wide is it?`, q: '', a: [`w=A\\div l=${A}\\div${l}=${w}`, `\\text{check: }${l}\\times${w}=${A}`] }; },
        () => { const C = r.int(40, 320), dd = C / Math.PI; return { text: `A round ${r.pick(['tree trunk', 'pot', 'clock', 'drum'])} has a circumference of <b>${C} cm</b>. Estimate, then find its diameter to the nearest tenth.`, q: '', a: [`\\text{estimate: }${C}\\div3\\approx${Math.round(C / 3)}`, `d=${C}\\div\\pi=${r1(dd)}\\text{ cm}`] }; }
      ])(),
      PRG: (r) => r.pick([
        () => { const l = r.int(8, 30), w = r.int(3, l - 1), P = 2 * l + 2 * w; return { text: `A rectangular ${r.pick(['pen', 'yard', 'rink', 'parking lot'])} has a perimeter of <b>${P} m</b>. It is <b>${l} m</b> long. How wide is it? Check.`, q: '', a: [`w=(${P}-2\\times${l})\\div2`, `=(${P}-${2 * l})\\div2=${P - 2 * l}\\div2=${w}\\text{ m}`, `\\text{check: }2(${l})+2(${w})=${P}`] }; },
        () => { const w = r.int(3, 12) + r.pick([0, 0.5]), l = w + r.int(2, 10), P = 2 * l + 2 * w; return { text: `A picture frame needs <b>${n(P)} in</b> of trim. It is <b>${n(w)} in</b> wide. How long is it? Check.`, q: '', a: [`l=(${n(P)}-2\\times${n(w)})\\div2`, `=${n(P - 2 * w)}\\div2=${n(l)}\\text{ in}`, `\\text{check: }2(${n(l)})+2(${n(w)})=${n(P)}`] }; }
      ])(),
      MAS: (r) => r.pick([
        () => { const price = r.pick([2.5, 3.25, 4.5, 5.75, 6.25]), l = r.int(5, 14), w = r.int(2, l), P = 2 * (l + w), cost = rnd(P * price, 2); return { text: `You have <b>$${cost.toFixed(2)}</b> for edging at <b>$${price.toFixed(2)} per foot</b>. It goes all the way around a rectangular bed <b>${l} ft</b> long. How wide can the bed be?`, q: '', a: [`P=${cost.toFixed(2)}\\div${price.toFixed(2)}=${P}\\text{ ft}`, `w=(${P}-${2 * l})\\div2=${w}\\text{ ft}`, `\\text{check: }2(${l})+2(${w})=${P}`] }; },
        () => { const C = r.int(60, 400) / 2; return { text: `A round ${r.pick(['hot tub', 'trampoline', 'fire pit', 'table'])} has a circumference of <b>${n(C)} in</b>. Find its radius to the nearest tenth. Then check.`, q: '', a: [`r=${n(C)}\\div(2\\times\\pi)=${r1(C / (2 * Math.PI))}\\text{ in}`, `\\text{check: }2\\times\\pi\\times${r1(C / (2 * Math.PI))}\\approx${r1(2 * Math.PI * Number(r1(C / (2 * Math.PI))))}`] }; }
      ])()
    }
  });
}
