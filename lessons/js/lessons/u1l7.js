/* Math 10-3 · Unit 1 · Lesson 7 — Percents Refresher: Percents, Decimals and Percent of an Amount (refresher, no N1 box).
 * Static grids for Example 1 and the explainers:
 *   grid       (a 10 × 10 grid that fills to a percent, with the percent, fraction and decimal; Example 1 checks),
 *   slide      (the decimal point hops 2 places left or right, empty places fill with zeros; notes and Example 2),
 *   cents      (Full notes: percent of a dollar = cents, so 48% = $0.48 and 7% is 7¢, not 70¢),
 *   fracPct    (top ÷ bottom on the calculator, × 100, then the grid; percent → fraction by grouping squares; Example 3),
 *   bench      (benchmark bars of an amount: 10%, 5%, 15%, 20%, 50%, 25%, 1%; Example 4),
 *   tipCalc    (a tip calculator built from 10% + 5% and 2 × 10%, with the receipt filling in; Example 5),
 *   pctOf      (a double number line: estimate first, change to a decimal, multiply; Example 6),
 *   proportion (Full notes: the same answer with a proportion and cross-multiplying),
 *   whatPct    (part bar against the whole bar on a percent ruler: part ÷ whole × 100; Example 7),
 *   verdict    (Priya's two tests compared as percents with a verdict stamp; Marco's tip on a tip scale; Example 8).
 * Colours: shaded/percent amber, "not shaded"/second blue, answers red, the whole brand brown. */
import { h, tex, add, stamp, stampIn, mountExplainers, pop, fadeIn, appear, sleep, tween, svgEl, pulse, shake, anim, COLORS } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const K = (src) => {
  try { return window.katex.renderToString('\\displaystyle ' + String(src), { throwOnError: false, strict: 'ignore', output: 'html' }); }
  catch (e) { return tex(src); }
};
const INK = COLORS.ink, RED = COLORS.red, BLUE = COLORS.blue, GRN = COLORS.green, AMB = COLORS.amber, BRN = COLORS.brand;
const FA = '#f2b84b', FB = '#8fb0ec', FE = '#fffdf8', FW = '#e9dcc4';
const hide = (el) => { el.style.opacity = 0; return el; };
const show = (c, el) => fadeIn(c, el, 320);
const lab = (host, x, y, html, cls = '') => { const d = h('div', 'u1l7-abs ' + cls, html); d.style.left = x + 'px'; d.style.top = y + 'px'; host.appendChild(d); return d; };
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const F = (n, d) => `\\frac{${n}}{${d}}`;
/* exact decimal strings from integers (no floating-point surprises): dec(842, 3) → "0.842", dec(6000, 2) → "60" */
const dec = (k, p) => { const s = String(Math.abs(k)).padStart(p + 1, '0'); const i = s.slice(0, s.length - p), f = (p ? s.slice(s.length - p) : '').replace(/0+$/, ''); return (k < 0 ? '-' : '') + i + (f ? '.' + f : ''); };
const cents = (k) => { const s = String(Math.round(k)).padStart(3, '0'); return s.slice(0, -2) + '.' + s.slice(-2); };   // 842 → "8.42"
const $T = (k) => '\\$' + cents(k);     // money in TeX
const $H = (k) => '$' + cents(k);       // money in text
const nT = (s) => { const [i, f] = String(s).split('.'); const ii = i.length >= 4 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : i; return f !== undefined ? ii + '.' + f : ii; };
const nH = (s) => nT(s).replace(/\\,/g, '&#8201;');
const pin = (host, x, y, col) => { const s = svgEl('svg', { class: 'u1l7-abs', width: 30, height: 40 }); svgEl('path', { d: 'M15 38 L3 14 A13 13 0 1 1 27 14 Z', fill: col }, s); add(host, s, x - 15, y - 40); return s; };

/* =============================== a 10 × 10 grid (SVG) =============================== */
function grid10(parent, x, y, s, o = {}) {
  const g = svgEl('g', { transform: `translate(${x} ${y})` }, parent);
  svgEl('rect', { x: 0, y: 0, width: 10 * s, height: 10 * s, fill: FE }, g);
  const fills = svgEl('g', {}, g), cells = [];
  for (let i = 0; i < 100; i++) cells.push(svgEl('rect', { x: (i % 10) * s, y: Math.floor(i / 10) * s, width: s, height: s, fill: 'none' }, fills));
  const part = svgEl('rect', { x: 0, y: 0, width: 0, height: s, fill: 'none' }, fills);
  const lines = svgEl('g', { stroke: '#b9b2a3', 'stroke-width': o.thin || 1.2 }, g);
  for (let i = 1; i < 10; i++) { svgEl('line', { x1: i * s, x2: i * s, y1: 0, y2: 10 * s }, lines); svgEl('line', { x1: 0, x2: 10 * s, y1: i * s, y2: i * s }, lines); }
  const top = svgEl('g', {}, g);
  const frame = svgEl('rect', { x: 0, y: 0, width: 10 * s, height: 10 * s, fill: 'none', stroke: INK, 'stroke-width': 2.5 }, g);
  return {
    g, s, cells, top, frame, x, y,
    /** colour cells [from, from + n) (n may end in a part of a square); cells after it (from `from` on) are cleared */
    fill(n, color = FA, from = 0) {
      const end = from + Math.max(0, Math.min(100 - from, n));
      for (let i = from; i < 100; i++) cells[i].setAttribute('fill', i + 1 <= end + 1e-9 ? color : 'none');
      const fl = Math.floor(end + 1e-9), fr = end - fl;
      if (fr > 1e-6 && fl < 100) { part.setAttribute('x', (fl % 10) * s); part.setAttribute('y', Math.floor(fl / 10) * s); part.setAttribute('width', fr * s); part.setAttribute('fill', color); }
      else part.setAttribute('fill', 'none');
    },
    centre(i) { return [x + ((i % 10) + 0.5) * s, y + (Math.floor(i / 10) + 0.5) * s]; }
  };
}
/* several grids side by side share one count: 125 → 100 in the first, 25 in the second */
const fillAll = (G, n, color = FA) => G.forEach((g, k) => g.fill(Math.max(0, Math.min(100, n - 100 * k)), color));

function mountGrids() {
  document.querySelectorAll('.u1l7-grids[data-grids]').forEach((host) => {
    const ns = host.dataset.grids.split(',').map(Number), s = 13, gap = 14, w = ns.length * 10 * s + (ns.length - 1) * gap;
    const svg = svgEl('svg', { viewBox: `-2 -2 ${w + 4} ${10 * s + 4}`, width: w + 4, role: 'img', 'aria-label': `10 by 10 grid${ns.length > 1 ? 's' : ''} with ${ns.join(' and ')} squares shaded` });
    ns.forEach((n, i) => grid10(svg, i * (10 * s + gap), 0, s, { thin: 0.8 }).fill(n));
    host.appendChild(svg);
  });
}

/* =============================== explainer: fill the grid to a percent =============================== */
const GR = {
  a: { label: '(a) Grid A', n: 37 },
  b: { label: '(b) not shaded', n: 37, rest: true },
  c: { label: '(c) Grid B: two grids', n: 125 }
};
const grid = {
  title: 'Fill the grid to a percent',
  height: 330,
  minW: 940,
  capH: 92,
  choices: [{ sep: 'Example 1 check:' }].concat(Object.keys(GR).map((k) => ({ v: k, label: GR[k].label }))),
  ask: (k) => ({ a: 'Example 1(a): 37 squares of Grid A are shaded. What percent is shaded? Write it three ways.', b: 'Example 1(b): what percent of Grid A is <b>not</b> shaded?', c: 'Example 1(c): each grid in B is one whole. One grid is full and 25 more squares are shaded. What percent is shaded?' }[k]),
  make(stage, k, ex) {
    const D = GR[k], W = ex.W, s = 27, two = D.n > 100;
    const svg = svgEl('svg', { class: 'u1l7-abs', width: 620, height: 290 }); add(stage, svg, 0, 0);
    const G = (two ? [20, 316] : [150]).map((x) => grid10(svg, x, 6, s));
    const cnt = lab(stage, two ? 310 : 285, 300, '', 'u1l7-count u1l7-mid');
    const rx = 660, tri = (y, key) => { const r = lab(stage, rx, y, `<span class="k">${key}</span><span class="v"></span>`, 'u1l7-tri'); r.style.width = (W - rx - 20) + 'px'; return r.querySelector('.v'); };
    const vP = tri(34, 'Percent'), vF = tri(124, 'Fraction'), vD = tri(214, 'Decimal');
    const setTri = (p, color) => { vP.innerHTML = T(p + '\\%'); vF.innerHTML = K(F(p, 100)); vD.innerHTML = T(dec(p, 2)); [vP, vF, vD].forEach((v) => { v.style.color = color; hide(v); }); };
    const popTri = async (c) => { for (const v of [vP, vF, vD]) await pop(c, v); };
    const countTo = (c, from, to, ms, color, base = 0, word = 'squares') => tween(c, ms, (t) => { const m = Math.round(from + (to - from) * t); if (two) fillAll(G, m, color); else G[0].fill(m - base, color, base); cnt.innerHTML = `<b>${m - base}</b> ${word}`; }, (t) => t);
    if (k === 'a') {
      const [cx, cy] = G[0].centre(0), tag = hide(lab(stage, cx - 14, cy, '1 square = <b>1%</b>', 'u1l7-tag u1l7-mr'));
      setTri(37, RED);
      return [
        { cap: `A ${T('10\\times10')} grid has <b>100</b> small squares. So each square is <b>1%</b> of the grid.`,
          run: async (c) => { G[0].cells[0].setAttribute('fill', FA); await show(c, tag); await pulse(c, G[0].cells[0], 1.3); } },
        { cap: `Shade <b>37</b> squares. Count by rows of 10: 10, 20, 30, then 7 more.`,
          run: async (c) => { tag.style.opacity = 0; await countTo(c, 0, 37, 1500, FA); } },
        { cap: `37 out of 100 squares: ${T('37\\%')}, or ${T('\\frac{37}{100}')}, or ${T('0.37')}. Three ways to write the <b>same amount</b>.`,
          run: (c) => popTri(c) }
      ];
    }
    if (k === 'b') {
      setTri(63, BLUE);
      return [
        { cap: `Grid A: <b>37</b> of the 100 squares are shaded (37%).`, run: (c) => countTo(c, 0, 37, 700, FA) },
        { cap: `The rest are <b>not</b> shaded: ${T('100-37=63')} squares.`,
          run: async (c) => { await countTo(c, 37, 100, 1300, FB, 37, 'not shaded'); } },
        { cap: `So ${T('63\\%')} is not shaded. Check: ${T('37\\%+63\\%=100\\%')}, the whole grid.`, run: (c) => popTri(c) }
      ];
    }
    // (c) 125%: two grids
    const tags = G.map((g) => hide(lab(stage, g.x + 5 * s, 6 + 10 * s + 18, 'one whole = 100%', 'u1l7-tag u1l7-mid')));
    vP.innerHTML = T('125\\%'); vF.innerHTML = K(F(125, 100)); vD.innerHTML = T('1.25'); [vP, vF, vD].forEach((v) => { v.style.color = RED; hide(v); });
    cnt.style.top = '312px';
    return [
      { cap: `Each grid is <b>one whole</b>: 100 squares, or 100%.`, run: async (c) => { await Promise.all(G.map((g) => pulse(c, g.frame, 1.03))); for (const t of tags) await show(c, t); } },
      { cap: `The first grid is full: <b>100</b> squares, or 100%.`, run: async (c) => { tags.forEach((t) => { t.style.opacity = 0; }); await countTo(c, 0, 100, 1400, FA); } },
      { cap: `The second grid has <b>25</b> more: ${T('100+25=125')} squares.`, run: (c) => countTo(c, 100, 125, 800, FA) },
      { cap: `125 squares out of 100 is <b>125%</b>: more than one whole. ${T('125\\%=\\frac{125}{100}=1.25')}`, run: (c) => popTri(c) }
    ];
  }
};

/* =============================== explainer: the decimal point slides 2 places =============================== */
const SL = {
  n48: { label: 'Notes: 48%', s: '48', dir: 'L' },
  n03: { label: 'Notes: 0.3', s: '0.3', dir: 'R' },
  sep: { sep: 'Example 2 check:' },
  b: { label: '(b) 7%', s: '7', dir: 'L', note: 'Check: 7% is less than 10%, and 0.07 is less than 0.10 ✓' },
  c: { label: '(c) 7.5%', s: '7.5', dir: 'L' },
  e: { label: '(e) 0.5%', s: '0.5', dir: 'L', note: 'Less than 1%, so less than 0.01 ✓' },
  f: { label: '(f) 300%', s: '300', dir: 'L', note: '300% is 3 wholes.' },
  h: { label: '(h) 0.06', s: '0.06', dir: 'R' },
  j: { label: '(j) 0.025', s: '0.025', dir: 'R' },
  k: { label: '(k) 0.004', s: '0.004', dir: 'R', note: 'Less than 1%: a very small part.' },
  l: { label: '(l) 2', s: '2', dir: 'R', note: '2 wholes is 200%.' }
};
function slideModel(str, left) {
  const N = 9, [ip, fp = ''] = str.split('.'), B0 = left ? 6 : 3, B1 = left ? 4 : 5, slots = Array(N).fill(null);
  ip.split('').forEach((d, i) => { slots[B0 - ip.length + i] = d; });
  fp.split('').forEach((d, i) => { slots[B0 + i] = d; });
  const occ = slots.map((d, i) => (d === null ? -1 : i)).filter((i) => i >= 0), ones = B1 - 1;
  const lo = Math.min(occ[0], ones), hi = Math.max(occ[occ.length - 1], ones);
  const all = slots.slice(), fills = [];
  for (let i = lo; i <= hi; i++) if (all[i] === null) { all[i] = '0'; fills.push(i); }
  const strip = [];
  for (let i = lo; i < ones && all[i] === '0'; i++) strip.push(i);
  for (let i = hi; i >= B1 && all[i] === '0'; i--) strip.push(i);
  const kept = []; for (let i = lo; i <= hi; i++) if (!strip.includes(i)) kept.push(i);
  const keepFrac = kept.some((i) => i >= B1);
  const res = kept.filter((i) => i < B1).map((i) => all[i]).join('') + (keepFrac ? '.' + kept.filter((i) => i >= B1).map((i) => all[i]).join('') : '');
  return { N, slots, all, fills, strip, kept, keepFrac, res, B0, B1, hasPt: str.includes('.') };
}
const slide = {
  title: 'Move the decimal point 2 places',
  height: 320,
  minW: 940,
  capH: 92,
  choices: Object.keys(SL).map((k) => (SL[k].sep ? { sep: SL[k].sep } : { v: k, label: SL[k].label })),
  ask: (k) => (SL[k].dir === 'L' ? `Write ${T(SL[k].s + '\\%')} as a decimal.` : `Write ${T(SL[k].s)} as a percent.`),
  make(stage, k, ex) {
    const D = SL[k], L = D.dir === 'L', M = slideModel(D.s, L), W = ex.W, sw = 84, th = 88, x0 = (W - M.N * sw) / 2, ty = 92;
    const bx = (b) => x0 + b * sw, sx = (i) => x0 + i * sw;
    const svg = svgEl('svg', { class: 'u1l7-abs', width: W, height: 300 }); add(stage, svg, 0, 0);
    for (let i = 0; i < M.N; i++) svgEl('rect', { x: sx(i) + 4, y: ty, width: sw - 8, height: th, rx: 10, fill: '#faf6ee', stroke: '#e0d8c8', 'stroke-width': 2, 'stroke-dasharray': '6 5' }, svg);
    const rule = lab(stage, W / 2, 36, L ? `${T('\\div100')} &nbsp; move the point <b>2 places left</b> ←` : `${T('\\times100')} &nbsp; move the point <b>2 places right</b> →`, 'u1l7-rule u1l7-mid');
    const tiles = {};
    M.slots.forEach((d, i) => { if (d !== null) tiles[i] = lab(stage, sx(i) + 4, ty, d, 'u1l7-dg'); });
    M.fills.forEach((i) => { tiles[i] = hide(lab(stage, sx(i) + 4, ty, '0', 'u1l7-dg u1l7-zero')); });
    let last = 0; M.slots.forEach((d, i) => { if (d !== null) last = i; });
    const pctIn = L ? lab(stage, sx(last + 1) + 6, ty + th / 2, '%', 'u1l7-pct u1l7-ml') : null;
    const keptLast = Math.max(...M.kept);
    const pctOut = L ? null : hide(lab(stage, sx(keptLast + 1) + 6, ty + th / 2, '%', 'u1l7-pct u1l7-ml'));
    const pt = lab(stage, bx(M.B0), ty + th - 12, '', 'u1l7-pt u1l7-mid'); if (!M.hasPt) hide(pt);
    const arcs = [0, 1].map((j) => { const b0 = L ? M.B0 - j : M.B0 + j, b1 = L ? b0 - 1 : b0 + 1, xa = bx(b0), xb = bx(b1), y = ty + th + 8;
      const p = svgEl('path', { d: `M${xa} ${y} Q${(xa + xb) / 2} ${y + 46} ${xb} ${y}`, fill: 'none', stroke: RED, 'stroke-width': 3, 'stroke-dasharray': '6 5' }, svg); hide(p);
      const n = hide(lab(stage, (xa + xb) / 2, y + 40, String(j + 1), 'u1l7-hopn u1l7-mid')); return { p, n, xa, xb }; });
    const eq = hide(lab(stage, W / 2, 268, K(L ? `${D.s}\\%=${M.res}` : `${D.s}=${M.res}\\%`), 'u1l7-eqn u1l7-mid'));
    const hop = (c, a) => tween(c, 650, (t) => { pt.style.left = (a.xa + (a.xb - a.xa) * t) + 'px'; pt.style.top = (ty + th - 12 + 40 * Math.sin(Math.PI * t) * 0.9) + 'px'; });
    const what = [];
    if (M.fills.length) what.push(`fill the empty place${M.fills.length > 1 ? 's' : ''} with <b>zero${M.fills.length > 1 ? 's' : ''}</b>`);
    if (M.strip.length) what.push(`drop the zero${M.strip.length > 1 ? 's' : ''} we don’t need at the ${M.strip.some((i) => i >= M.B1) ? 'end' : 'front'}`);
    const cap3 = what.length ? what.join(', and ').replace(/^./, (ch) => ch.toUpperCase()) + `: <b>${M.res}${L ? '' : '%'}</b>.` : `Read the new number: <b>${M.res}</b>.`;
    return [
      { cap: (L ? `Percent → decimal: <b>divide by 100</b>. That moves the decimal point <b>2 places left</b>.` : `Decimal → percent: <b>multiply by 100</b>. That moves the decimal point <b>2 places right</b>.`)
          + (M.hasPt ? '' : ` ${D.s} has no point, so it is at the <b>end</b>: ${D.s}.`),
        run: async (c) => { if (!M.hasPt) await pop(c, pt); await pulse(c, rule, 1.06); if (pctIn) await anim(c, pctIn, [{ opacity: 1 }, { opacity: 0.18 }], 400); } },
      { cap: `Hop 1, hop 2: the point moves 2 places ${L ? 'left' : 'right'}.`,
        run: async (c) => { for (const a of arcs) { await appear(c, a.p, 150); await hop(c, a); await pop(c, a.n); } } },
      { cap: cap3,
        run: async (c) => {
          for (const i of M.fills) await pop(c, tiles[i]);
          for (const i of M.strip) { tiles[i].classList.add('u1l7-gone'); await anim(c, tiles[i], [{ opacity: 1 }, { opacity: 0.25 }], 300); tiles[i].style.opacity = 0.25; }
          if (!M.keepFrac) { await anim(c, pt, [{ opacity: 1 }, { opacity: 0 }], 300); pt.style.opacity = 0; }
          if (pctOut) await pop(c, pctOut);
        } },
      { cap: `So ${T(L ? `${D.s}\\%=${M.res}` : `${D.s}=${M.res}\\%`)}.${D.note ? ' ' + D.note : ''}`, run: (c) => pop(c, eq) }
    ];
  }
};

/* =============================== explainer (Full notes): percent of a dollar is cents =============================== */
const CN = {
  p48: { label: '48% of $1', p: 48 },
  p7: { label: '7% of $1', p: 7 },
  p125: { label: '125%', p: 125 }
};
const cents$ = {
  title: 'Per hundred, like cents',
  height: 320,
  minW: 940,
  capH: 92,
  choices: Object.keys(CN).map((k) => ({ v: k, label: CN[k].label })),
  ask: (k) => `Why does ${T(CN[k].p + '\\%')} become ${T(dec(CN[k].p, 2))}? Think of a dollar: 100 cents.`,
  make(stage, k, ex) {
    const p = CN[k].p, W = ex.W, two = p > 100, gap = two ? 24 : 26, r = two ? 9 : 10.5;
    const svg = svgEl('svg', { class: 'u1l7-abs', width: 560, height: 300 }); add(stage, svg, 0, 0);
    const ox = two ? [20, 280] : [140], coins = [];
    ox.forEach((x0) => { for (let i = 0; i < 100; i++) coins.push(svgEl('circle', { cx: x0 + (i % 10) * gap + gap / 2, cy: 14 + Math.floor(i / 10) * gap + gap / 2, r, fill: '#efe7d8', stroke: '#c9b89a', 'stroke-width': 1.5 }, svg)); });
    const light = (n, col = '#d08a4a') => coins.forEach((c0, i) => { c0.setAttribute('fill', i < n ? col : '#efe7d8'); c0.setAttribute('stroke', i < n ? '#8a4f1e' : '#c9b89a'); });
    const head = lab(stage, two ? 270 : 270, 290, two ? 'each set of 100 cents = $1.00' : '100 cents = $1.00', 'u1l7-mut u1l7-mid');
    const rx = 600, line = (y, html, cls = 'u1l7-line') => { const d = hide(lab(stage, rx, y, html, cls)); d.style.width = (W - rx - 20) + 'px'; return d; };
    const L1 = line(30, `${p}% of a dollar<br><b class="u1l7-big">${p}¢</b>`);
    const L2 = line(140, K(`${p}\\text{ cents}=\\$${cents(p)}`), 'u1l7-flab');
    const L3 = line(200, K(`${p}\\%=${dec(p, 2)}`), 'u1l7-eqn u1l7-fit');
    const steps = [
      { cap: `One dollar is <b>100 cents</b>. So 1 cent is <b>1%</b> of a dollar.${two ? ' Here are two dollars.' : ''}`, run: (c) => pulse(c, head, 1.1) },
      { cap: `${p}% of a dollar is <b>${p} cents</b>.`, run: async (c) => { await tween(c, 1300, (t) => light(Math.round(p * t)), (t) => t); await show(c, L1); } },
      { cap: `${p} cents is written ${T('\\$' + cents(p))}. So ${T(`${p}\\%=${dec(p, 2)}`)}: the point moved <b>2 places left</b>.`, run: async (c) => { await show(c, L2); await pop(c, L3); } }
    ];
    if (p === 7) {
      const no = hide(line(262, `${T('0.7=\\$0.70')} is <b>70¢</b>, that’s 70% ✗`, 'u1l7-line u1l7-bad'));
      steps.push({ cap: `Careful: ${T('\\$0.70')} is <b>70 cents</b>, ten times as much. That would be 70%. So ${T('7\\%=0.07')}, not 0.7.`,
        run: async (c) => { coins.forEach((c0, i) => { if (i >= 7 && i < 70) { c0.setAttribute('stroke', RED); c0.setAttribute('stroke-dasharray', '3 2'); } }); await show(c, no); } });
    }
    return steps;
  }
};

/* =============================== explainer: fractions ↔ percents =============================== */
const FP = {
  s1: { sep: 'Example 3(a):' },
  f25: { label: T('\\tfrac25'), n: 2, d: 5, v: '0.4', pc: '40', sq: 40 },
  f78: { label: T('\\tfrac78'), n: 7, d: 8, v: '0.875', pc: '87.5', sq: 87.5 },
  f13: { label: T('\\tfrac13'), n: 1, d: 3, v: '0.33333\\ldots', lcd: '0.333333333', pc: '33.333\\ldots', rnd: '33.3', sq: 100 / 3 },
  s2: { sep: '(b):' },
  p15: { label: '15%', p: 15 },
  p240: { label: '240%', p: 240 }
};
const fracPct = {
  title: 'Fractions and percents',
  height: 350,
  minW: 940,
  capH: 92,
  choices: Object.keys(FP).map((k) => (FP[k].sep ? { sep: FP[k].sep } : { v: k, label: FP[k].label })),
  ask: (k) => (FP[k].p ? `Example 3(b): write ${T(FP[k].p + '\\%')} as a fraction in simplest form.` : `Example 3(a): write ${T(`\\tfrac{${FP[k].n}}{${FP[k].d}}`)} as a percent${FP[k].rnd ? ' (to the nearest tenth of a percent)' : ''}.`),
  make(stage, k, ex) {
    const D = FP[k], W = ex.W;
    if (!D.p) {
      const svg = svgEl('svg', { class: 'u1l7-abs', width: W, height: 340 }); add(stage, svg, 0, 0);
      const s = 27, G = grid10(svg, W - 10 * s - 30, 10, s);
      const cnt = lab(stage, W - 5 * s - 30, 312, '', 'u1l7-count u1l7-mid');
      const fr = lab(stage, 80, 92, K(F(D.n, D.d)), 'u1l7-flab u1l7-mid u1l7-huge');
      const scr = add(stage, h('div', 'u1l7-abs u1l7-lcd', '<span class="e"></span><span class="r"></span>'), 150, 40); scr.style.width = '360px';
      const se = scr.querySelector('.e'), sr = scr.querySelector('.r');
      const l1 = hide(lab(stage, 40, 190, K(`${D.v}\\times100=${D.pc}\\%`), 'u1l7-flab'));
      const l2 = D.rnd ? hide(lab(stage, 40, 252, K(`${D.pc}\\%\\approx${D.rnd}\\%`), 'u1l7-eqn')) : null;
      const sqTxt = D.sq === 40 ? '<b>40</b> of the 100 squares' : D.sq === 87.5 ? '<b>87</b> squares and <b>half</b> of one more' : '<b>33</b> squares and <b>a third</b> of one more';
      const st = [
        { cap: `The fraction bar means <b>divide</b>: ${T(`${F(D.n, D.d)}=${D.n}\\div${D.d}`)}. Top ÷ bottom.`, run: async (c) => { await pulse(c, fr, 1.1); se.textContent = `${D.n}÷${D.d}`; await pop(c, se); } },
        { cap: D.rnd ? `${T(`${D.n}\\div${D.d}=0.33333\\ldots`)} The 3 <b>repeats</b> forever.` : `${T(`${D.n}\\div${D.d}=${D.v}`)}.`, run: async (c) => { sr.textContent = D.lcd || D.v; await pop(c, sr); } },
        { cap: `Multiply by 100 (move the point <b>2 places right</b>): ${T(`${D.v}\\times100=${D.pc}\\%`)}.`, run: (c) => show(c, l1) }
      ];
      if (D.rnd) st.push({ cap: `Round to the nearest <b>tenth</b> of a percent: 33.3|33… The next digit, 3, is less than 5, so ${T('\\frac13\\approx33.3\\%')}.`, run: (c) => pop(c, l2) });
      st.push({ cap: `On the grid that is ${sqTxt}: ${T(F(D.n, D.d))} of the grid is ${T((D.rnd ? '\\text{about }' + D.rnd : D.pc) + '\\%')}.`,
        run: (c) => tween(c, 1400, (t) => { G.fill(D.sq * t); cnt.innerHTML = `<b>${D.rnd ? (t >= 1 ? '33⅓' : Math.floor(D.sq * t)) : D.sq === 87.5 && t >= 1 ? '87½' : Math.floor(D.sq * t + 1e-9)}</b> squares`; }, (t) => t) });
      return st;
    }
    // percent → fraction: over 100, then group the squares by the GCF
    const p = D.p, g = gcd(p, 100), two = p > 100, s = two ? 18 : 27, svg = svgEl('svg', { class: 'u1l7-abs', width: W, height: 340 }); add(stage, svg, 0, 0);
    const xs = two ? [0, 1, 2].map((i) => (W - 600) / 2 + i * 210) : [40], G = xs.map((x) => grid10(svg, x, 10, s));
    const groups = svgEl('g', { stroke: BRN, 'stroke-width': 4, 'stroke-linecap': 'round' }, svg); hide(groups);
    const nums = [];
    G.forEach((gr, gi) => {
      if (g === 5) { // half rows
        svgEl('line', { x1: gr.x + 5 * s, x2: gr.x + 5 * s, y1: gr.y, y2: gr.y + 10 * s }, groups);
        for (let r = 1; r < 10; r++) svgEl('line', { x1: gr.x, x2: gr.x + 10 * s, y1: gr.y + r * s, y2: gr.y + r * s }, groups);
        for (let r = 0; r < 10; r++) for (let hh = 0; hh < 2; hh++) { const idx = gi * 20 + r * 2 + hh; if ((idx + 1) * 5 <= p) nums.push(hide(lab(stage, gr.x + (hh * 5 + 2.5) * s, gr.y + (r + 0.5) * s, String(idx + 1), 'u1l7-gnum u1l7-mid'))); }
      } else { // g = 20: two rows
        for (let r = 2; r < 10; r += 2) svgEl('line', { x1: gr.x, x2: gr.x + 10 * s, y1: gr.y + r * s, y2: gr.y + r * s }, groups);
        for (let r = 0; r < 5; r++) { const idx = gi * 5 + r; if ((idx + 1) * 20 <= p) nums.push(hide(lab(stage, gr.x + 5 * s, gr.y + (2 * r + 1) * s, String(idx + 1), 'u1l7-gnum u1l7-mid'))); }
      }
    });
    const rx = two ? W / 2 : 380, mid = two ? ' u1l7-mid' : '';
    const l1 = hide(lab(stage, rx, two ? 222 : 50, K(`${p}\\%=${F(p, 100)}`), 'u1l7-flab u1l7-sm' + mid));
    const l2 = hide(lab(stage, rx, two ? 258 : 130, `GCF of ${p} and 100 is <b class="u1l7-gold">${g}</b> &nbsp;·&nbsp; ${T(`100\\div${g}=${100 / g}`)} groups per grid, ${T(`${p}\\div${g}=${p / g}`)} shaded`, 'u1l7-line' + mid));
    if (!two) l2.style.whiteSpace = 'normal', l2.style.width = (W - rx - 20) + 'px';
    const fin = two ? `${p}\\%=${F(p, 100)}=${F(p / g, 100 / g)}=2\\tfrac25` : `${p}\\%=${F(p, 100)}=${F(`${p}\\div${g}`, `100\\div${g}`)}=${F(p / g, 100 / g)}`;
    const l3 = hide(lab(stage, rx, two ? 306 : 236, K(fin), 'u1l7-eqn' + mid));
    return [
      { cap: two ? `Percent means out of 100: ${T('240\\%=\\frac{240}{100}')}. That is 240 squares, and each grid of 100 is <b>one whole</b>.` : `Percent means out of 100: ${T('15\\%=\\frac{15}{100}')}. That is 15 of the 100 squares.`,
        run: async (c) => { await tween(c, 1400, (t) => fillAll(G, Math.round(p * t)), (t) => t); await show(c, l1); } },
      { cap: `Simplify. The GCF of ${p} and 100 is <b>${g}</b>. Group the squares in ${g}s (${g === 5 ? 'half rows' : '2 rows'}).`, run: (c) => appear(c, groups, 500) },
      { cap: two ? `Each grid has ${T('100\\div20=5')} groups. There are ${T('240\\div20=12')} shaded groups.` : `${T('100\\div5=20')} groups in the grid, and ${T('15\\div5=3')} of them are shaded.`,
        run: async (c) => { await show(c, l2); for (const n of nums) await pop(c, n); } },
      { cap: two ? `So ${T('240\\%=\\frac{240}{100}=\\frac{12}{5}')}, or ${T('2\\tfrac25')}: 2 whole grids and ${T('\\tfrac25')} of the third.` : `So ${T('15\\%=\\frac{15}{100}=\\frac{3}{20}')}: 3 of the 20 groups.`,
        run: (c) => pop(c, l3) }
    ];
  }
};

/* =============================== explainer: benchmark bars =============================== */
const BN = { a: { label: 'Example 4: $60.00', c: 6000 }, b: { label: '$84.20', c: 8420 } };
const bench = {
  title: 'Benchmarks: 10%, 5% and 1% first',
  height: 352,
  minW: 940,
  capH: 92,
  choices: Object.keys(BN).map((k) => ({ v: k, label: BN[k].label })),
  ask: (k) => `Example 4: find 10%, 5%, 15%, 20%, 50%, 25% and 1% of ${$H(BN[k].c)} without a calculator.`,
  make(stage, k, ex) {
    const c0 = BN[k].c, W = ex.W, x0 = 120, BW = W - x0 - 300, vx = x0 + BW + 24, rh = 41, bh = 26;
    const exact1 = c0 % 100 === 0, one = exact1 ? $H(c0 / 100) : '$' + dec(c0, 4), oneR = $H(Math.round(c0 / 100));
    const R = [
      { p: 100, v: c0, op: 'whole', col: '#e2cfae' },
      { p: 10, v: c0 / 10, op: '÷ 10' },
      { p: 5, v: c0 / 20, op: 'half of 10%', col: '#f6cf7e' },
      { p: 15, v: 3 * c0 / 20, op: '10% + 5%', parts: [[10, FA], [5, '#f6cf7e']] },
      { p: 20, v: c0 / 5, op: '2 × 10%', parts: [[10, FA], [10, FA]] },
      { p: 50, v: c0 / 2, op: 'half', col: '#e9a94a' },
      { p: 25, v: c0 / 4, op: 'half of 50%', col: '#eebd6a' },
      { p: 1, v: c0 / 100, op: '÷ 100', col: '#c96f2a' }
    ];
    const svg = svgEl('svg', { class: 'u1l7-abs', width: W, height: 350 }); add(stage, svg, 0, 0);
    const rows = R.map((r, i) => {
      const y = 8 + i * rh, lb = lab(stage, x0 - 16, y + bh / 2, `${r.p}%`, 'u1l7-blab u1l7-mr');
      svgEl('rect', { x: x0, y, width: BW, height: bh, rx: 4, fill: '#f7f3ea', stroke: '#e3dccd', 'stroke-width': 1 }, svg);
      const g = svgEl('g', {}, svg), segs = [];
      if (r.parts) { let at = 0; r.parts.forEach(([pp, col]) => { segs.push(svgEl('rect', { x: x0 + BW * at / 100, y, width: 0, height: bh, fill: col, stroke: '#8a5a1c', 'stroke-width': 1.5, 'data-w': BW * pp / 100, 'data-x': x0 + BW * at / 100 }, g)); at += pp; }); }
      else segs.push(svgEl('rect', { x: x0, y, width: 0, height: bh, fill: r.col || FA, stroke: '#8a5a1c', 'stroke-width': 1.5, 'data-w': BW * r.p / 100, 'data-x': x0 }, g));
      const val = r.p === 1 ? (exact1 ? `<b>${one}</b>` : `${one} ≈ <b>${oneR}</b>`) : (i === 0 ? $H(r.v) : `<b>${$H(r.v)}</b>`);
      const vl = lab(stage, vx, y + bh / 2, `<span class="op">${r.op}</span>${val}`, 'u1l7-bval u1l7-ml');
      if (i) { hide(vl); lb.style.opacity = 0.35; }
      return { segs, vl, lb };
    });
    const grow = (c, i) => tween(c, 600, (t) => rows[i].segs.forEach((s0) => s0.setAttribute('width', Number(s0.dataset.w) * t)));
    const step = async (c, i) => { rows[i].lb.style.opacity = 1; await grow(c, i); await pop(c, rows[i].vl); };
    const t10 = cents(c0 / 10), t50 = cents(c0 / 2);
    return [
      { cap: `${$H(c0)} is the <b>whole</b> amount: <b>100%</b>.`, run: (c) => grow(c, 0) },
      { cap: `<b>10%</b>: divide by 10. Move the decimal <b>1</b> place left: ${$H(c0)} → <b>${$H(c0 / 10)}</b>.`, run: (c) => step(c, 1) },
      { cap: `<b>5%</b> is half of 10%: ${T(`${t10}\\div2=${$T(c0 / 20)}`)}.`, run: (c) => step(c, 2) },
      { cap: `<b>15% = 10% + 5%</b>: ${T(`${t10}+${cents(c0 / 20)}=${$T(3 * c0 / 20)}`)}.`, run: (c) => step(c, 3) },
      { cap: `<b>20% = 2 × 10%</b>: ${T(`2\\times${t10}=${$T(c0 / 5)}`)}.`, run: (c) => step(c, 4) },
      { cap: `<b>50%</b> is half: ${T(`${cents(c0)}\\div2=${$T(c0 / 2)}`)}.`, run: (c) => step(c, 5) },
      { cap: `<b>25%</b> is half of 50%: ${T(`${t50}\\div2=${$T(c0 / 4)}`)}.`, run: (c) => step(c, 6) },
      { cap: `<b>1%</b>: move the decimal <b>2</b> places left: ${$H(c0)} → ${exact1 ? `<b>${one}</b>` : `${one}, which rounds to <b>${oneR}</b> (to the cent)`}.`, run: (c) => step(c, 7) }
    ];
  }
};

/* =============================== explainer: the tip calculator (10% + 5%, 2 × 10%) =============================== */
const TP = {
  a: { label: '(a) estimate a 15% tip' },
  b: { label: '(b) exact 20% tip and total' }
};
const tipCalc = {
  title: 'A tip calculator built from benchmarks',
  height: 350,
  minW: 940,
  capH: 92,
  choices: [{ sep: 'Example 5 check:' }].concat(Object.keys(TP).map((k) => ({ v: k, label: TP[k].label }))),
  ask: (k) => (k === 'a' ? 'Noor’s bill is $47.60. Estimate a 15% tip in your head.' : 'Noor’s bill is $47.60. Find a 20% tip exactly, then the total they pay.'),
  make(stage, k, ex) {
    const W = ex.W;
    const rc = add(stage, h('div', 'u1l7-abs u1l7-rcpt', `<div class="hd">THE CORNER DINER<small>Calgary, AB</small></div><div class="ln"><span>Supper × 2</span><span>$47.60</span></div><div class="ln rb"><span><b>Bill</b></span><b>$47.60</b></div><div class="ln"><span>Tip</span><b class="tv">______</b></div><div class="ln rt"><span><b>Total</b></span><b class="ov">______</b></div><div class="ft">Thank you!</div>`), 30, 6);
    const tv = rc.querySelector('.tv'), ov = rc.querySelector('.ov'), billLn = rc.querySelector('.rb');
    const mx = 370, mw = W - mx - 24;
    const m = add(stage, h('div', 'u1l7-abs u1l7-tipm', `<div class="nm">TIP-O-MATIC</div><div class="scr"></div><div class="keys"><span data-k="10">10%</span><span data-k="5">5%</span><span data-k="x2">× 2</span><span data-k="add">+</span></div><div class="tape"></div>`), mx, 6);
    m.style.width = mw + 'px';
    const scr = m.querySelector('.scr'), tape = m.querySelector('.tape'), key = (kk) => m.querySelector(`[data-k="${kk}"]`);
    const press = async (c, kk) => { m.querySelectorAll('.keys span').forEach((e) => e.classList.remove('on')); const e = key(kk); e.classList.add('on'); await pulse(c, e, 1.12); };
    const say = async (c, v) => { scr.textContent = v; await pop(c, scr); };
    const row = async (c, html) => { const r = h('div', 'r', html); tape.appendChild(r); await fadeIn(c, r, 260); };
    if (k === 'a') return [
      { cap: `The bill is <b>$47.60</b>. To estimate, round it: ${T('\\$47.60\\approx\\$48')}.`, run: async (c) => { billLn.classList.add('lit'); await say(c, '48.00'); await row(c, '<span>Bill ≈</span><b>$48.00</b>'); } },
      { cap: `<b>10%</b>: move the decimal 1 place left. 10% of $48 is <b>$4.80</b>.`, run: async (c) => { await press(c, '10'); await say(c, '4.80'); await row(c, '<span>10%</span><b>$4.80</b>'); } },
      { cap: `<b>5%</b> is half of 10%: ${T('4.80\\div2=\\$2.40')}.`, run: async (c) => { await press(c, '5'); await say(c, '2.40'); await row(c, '<span>5%</span><b>$2.40</b>'); } },
      { cap: `<b>15% = 10% + 5%</b>: ${T('4.80+2.40=\\$7.20')}. A 15% tip is <b>about $7.20</b>, a little over $7.`,
        run: async (c) => { await press(c, 'add'); await say(c, '7.20'); await row(c, '<span>15% ≈</span><b class="u1l7-red">$7.20</b>'); tv.textContent = '≈ $7.20'; await pop(c, tv); } }
    ];
    return [
      { cap: `For an exact tip, use the exact bill: <b>$47.60</b>.`, run: async (c) => { billLn.classList.add('lit'); await say(c, '47.60'); await row(c, '<span>Bill</span><b>$47.60</b>'); } },
      { cap: `<b>10%</b>: move the decimal 1 place left. 10% of $47.60 is <b>$4.76</b>.`, run: async (c) => { await press(c, '10'); await say(c, '4.76'); await row(c, '<span>10%</span><b>$4.76</b>'); } },
      { cap: `<b>20% = 2 × 10%</b>: ${T('2\\times4.76=\\$9.52')}. That is the tip.`, run: async (c) => { await press(c, 'x2'); await say(c, '9.52'); await row(c, '<span>20%</span><b>$9.52</b>'); tv.textContent = '$9.52'; await pop(c, tv); } },
      { cap: `Total = bill + tip: ${T('47.60+9.52=\\$57.12')}. They pay <b>$57.12</b>.`,
        run: async (c) => { await press(c, 'add'); await say(c, '57.12'); await row(c, '<span>Total</span><b class="u1l7-red">$57.12</b>'); ov.textContent = '$57.12'; ov.classList.add('u1l7-red'); await pop(c, ov); } }
    ];
  }
};

/* =============================== explainer: percent of an amount on a double number line =============================== */
const PO = {
  a: { label: '(a) 35% of 260', p: 35, pS: '35', pd: '0.35', amt: 260, aS: '260', ans: 91, ansS: '91', win: 110, estP: 100 / 3, estTop: '\\frac13', estBot: '\\approx87',
    est: `Estimate first: 35% is a bit more than ${T('\\tfrac13')}. A bit more than ${T('\\tfrac13')} of 260 is <b>about 90</b>.`, ok: '91 is close to 90 ✓' },
  b: { label: '(b) 8% of $54.75', p: 8, pS: '8', pd: '0.08', amt: 54.75, aS: '\\$54.75', ans: 4.38, ansS: '\\$4.38', win: 110, estP: 10, estTop: '10\\%', estBot: '\\approx\\$5.50',
    est: `Estimate first: 10% of $54.75 is about $5.50, so 1% is about $0.55. 8% is about 8 × $0.55 = <b>$4.40</b>.`, ok: '$4.38 is close to $4.40 ✓' },
  c: { label: '(c) 140% of 85', p: 140, pS: '140', pd: '1.4', amt: 85, aS: '85', ans: 119, ansS: '119', win: 150, estP: 100, estTop: '', estBot: '',
    est: `Estimate first: 140% is <b>more than 100%</b>, so the answer is <b>more than 85</b>.`, ok: '119 is more than 85 ✓' },
  d: { label: '(d) 0.4% of 3&#8201;200', p: 0.4, pS: '0.4', pd: '0.004', amt: 3200, aS: '3\\,200', ans: 12.8, ansS: '12.8', win: 2, zoom: true, estP: 1, estTop: '1\\%', estBot: '32',
    est: `Estimate first: 1% of 3&#8201;200 is 32. 0.4% is less than 1%, so the answer is <b>less than 32</b>.`, ok: '12.8 is less than 32 ✓' },
  e: { label: '(e) 12.5% of 96', p: 12.5, pS: '12.5', pd: '0.125', amt: 96, aS: '96', ans: 12, ansS: '12', win: 110, estP: 10, estTop: '10\\%', estBot: '9.6',
    est: `Estimate first: 10% of 96 is 9.6. 12.5% is a bit more than 10%, so the answer is <b>a bit more than 9.6</b>.`, ok: '12 is a bit more than 9.6 ✓' },
  f: { label: '(f) 250% of $18', p: 250, pS: '250', pd: '2.5', amt: 18, aS: '\\$18', ans: 45, ansS: '\\$45.00', win: 270, estP: 200, estTop: '200\\%', estBot: '\\$36',
    est: `Estimate first: 250% is 2 and a half times $18. Two times $18 is $36, so the answer is <b>more than $36</b>.`, ok: '$45.00 is more than $36 ✓' }
};
const pctOf = {
  title: '“Of” means multiply',
  height: 356,
  minW: 940,
  capH: 92,
  choices: [{ sep: 'Example 6 check:' }].concat(Object.keys(PO).map((k) => ({ v: k, label: PO[k].label }))),
  ask: (k) => `Example 6: calculate ${PO[k].label.replace(/^\(.\) /, '')}. Estimate first.`,
  make(stage, k, ex) {
    const D = PO[k], W = ex.W, x0 = 120, x1 = W - 90, yT = 100, yB = 184, px = (P) => x0 + (x1 - x0) * P / D.win;
    const svg = svgEl('svg', { class: 'u1l7-abs', width: W, height: 260 }); add(stage, svg, 0, 0);
    lab(stage, 10, yT, 'percent', 'u1l7-axl u1l7-ml'); lab(stage, 10, yB, 'amount', 'u1l7-axl u1l7-ml');
    const axes = svgEl('g', {}, svg);
    [yT, yB].forEach((y) => { svgEl('line', { x1: x0, x2: x1 + 30, y1: y, y2: y, stroke: INK, 'stroke-width': 3 }, axes); svgEl('path', { d: `M${x1 + 22} ${y - 7} L${x1 + 32} ${y} L${x1 + 22} ${y + 7}`, fill: 'none', stroke: INK, 'stroke-width': 3 }, axes); });
    const tick = (P, top, bot, col = INK, dash = '', lift = 0) => {
      const g = svgEl('g', {}, svg), X = px(P);
      svgEl('line', { x1: X, x2: X, y1: yT - 12, y2: yT + 12, stroke: col, 'stroke-width': 3 }, g);
      svgEl('line', { x1: X, x2: X, y1: yB - 12, y2: yB + 12, stroke: col, 'stroke-width': 3 }, g);
      svgEl('line', { x1: X, x2: X, y1: yT + 14, y2: yB - 14, stroke: col, 'stroke-width': 1.8, 'stroke-dasharray': dash || '5 5' }, g);
      const a = top ? lab(stage, X, yT - 30 - lift, K(top), 'u1l7-tk u1l7-mid') : null, b = bot ? lab(stage, X, yB + 30 + lift, K(bot), 'u1l7-tk u1l7-mid') : null;
      if (a) a.style.color = col; if (b) b.style.color = col;
      return [g, a, b].filter(Boolean);
    };
    const t0 = tick(0, '0\\%', '0');
    const tW = D.zoom ? [] : tick(100, '100\\%', D.aS, BRN);
    const far = D.zoom ? hide(lab(stage, x1 - 10, yT - 64, `100% = 3&#8201;200 is far off to the right →`, 'u1l7-mut u1l7-mr')) : null;
    const tE = D.estTop || D.estBot ? tick(D.estP, D.estTop, D.estBot, BLUE, '3 4', 32) : [];
    tE.forEach(hide);
    if (!D.zoom) tW.forEach(hide);
    const barT = svgEl('rect', { x: x0, y: yT - 9, width: 0, height: 18, fill: FA, stroke: AMB, 'stroke-width': 1.5, rx: 3 }, svg);
    const barB = svgEl('rect', { x: x0, y: yB - 9, width: 0, height: 18, fill: '#f3a59f', stroke: RED, 'stroke-width': 1.5, rx: 3 }, svg);
    const tA = tick(D.p, D.pS + '\\%', D.ansS, RED, '2 0'); tA.forEach(hide);
    const m1 = hide(lab(stage, W / 2, 292, K(`${D.pS}\\%\\text{ of }${D.aS}=${D.pd}\\times${D.aS}`), 'u1l7-eqn u1l7-mid'));
    const ok = hide(lab(stage, W / 2, 336, D.ok, 'u1l7-ok u1l7-mid'));
    void t0;
    const amtH = D.aS.replace('\\$', '$').replace('\\,', '&#8201;');
    return [
      { cap: D.zoom ? `Percents on top, amounts below. 100% is the whole, 3&#8201;200: far off to the right. We zoom in on 0% to 2%.` : `Percents on top, amounts below. The whole amount, <b>${amtH}</b>, is <b>100%</b>.`,
        run: async (c) => { if (far) await show(c, far); else for (const e of tW) await show(c, e); } },
      { cap: D.est, run: async (c) => { for (const e of tE) await show(c, e); if (k === 'c') await Promise.all(tW.slice(1).map((e) => pulse(c, e, 1.15))); } },
      { cap: `Change the percent to a decimal (2 places left): ${T(`${D.pS}\\%=${D.pd}`)}. “Of” means <b>multiply</b>.`, run: (c) => show(c, m1) },
      { cap: `Multiply: ${T(`${D.pd}\\times${D.aS}=${D.ansS}`)}.`,
        run: async (c) => { await tween(c, 1100, (t) => { barT.setAttribute('width', (px(D.p) - x0) * t); barB.setAttribute('width', (px(D.p) - x0) * t); }); for (const e of tA) await show(c, e); m1.innerHTML = K(`${D.pd}\\times${D.aS}=${D.ansS}`); await pulse(c, m1, 1.06); } },
      { cap: `Compare with the estimate: ${D.ok}`, run: (c) => pop(c, ok) }
    ];
  }
};

/* =============================== explainer (Full notes): the proportion way =============================== */
const PR = {
  a: { label: '(a) 35% of 260', p: 35, amt: 260, prod: 9100, ans: 91 },
  c: { label: '(c) 140% of 85', p: 140, amt: 85, prod: 11900, ans: 119 }
};
function sfrac(host, x, y, top, bot, cls = '') {
  const d = h('div', 'u1l7-abs u1l7-sf ' + cls, `<span class="t">${top}</span><span class="bar"></span><span class="b">${bot}</span>`);
  d.style.left = x + 'px'; d.style.top = y + 'px'; host.appendChild(d); d.t = d.querySelector('.t'); d.b = d.querySelector('.b'); return d;
}
const proportion = {
  title: 'The same answer with a proportion',
  height: 330,
  minW: 940,
  capH: 92,
  choices: [{ sep: 'Example 6:' }].concat(Object.keys(PR).map((k) => ({ v: k, label: PR[k].label }))),
  ask: (k) => `Find ${PR[k].p}% of ${PR[k].amt} with a proportion: ${T(`\\tfrac{${PR[k].p}}{100}=\\tfrac{x}{${PR[k].amt}}`)}.`,
  make(stage, k, ex) {
    const D = PR[k], W = ex.W, xa = 220, xb = 500, yc = 130;
    const svg = svgEl('svg', { class: 'u1l7-abs', width: W, height: 330 }); add(stage, svg, 0, 0);
    const f1 = sfrac(stage, xa, yc, D.p, 100), f2 = sfrac(stage, xb, yc, '<i>x</i>', D.amt);
    lab(stage, (xa + xb) / 2, yc, K('='), 'u1l7-eqs u1l7-mid');
    const tg = [lab(stage, xa, yc - 84, 'percent', 'u1l7-tag u1l7-mid'), lab(stage, xa, yc + 84, 'out of 100', 'u1l7-tag u1l7-mid'), lab(stage, xb, yc - 84, 'part', 'u1l7-tag u1l7-mid'), lab(stage, xb, yc + 84, 'whole', 'u1l7-tag u1l7-mid')];
    tg.forEach(hide);
    const X1 = svgEl('line', { x1: xa + 36, y1: yc - 26, x2: xb - 40, y2: yc + 26, stroke: AMB, 'stroke-width': 4, 'stroke-linecap': 'round' }, svg);
    const X2 = svgEl('line', { x1: xa + 36, y1: yc + 26, x2: xb - 40, y2: yc - 26, stroke: BLUE, 'stroke-width': 4, 'stroke-linecap': 'round' }, svg);
    hide(X1); hide(X2);
    const rx = 640, line = (y, src, cls = 'u1l7-flab u1l7-sm') => hide(lab(stage, rx, y, K(src), cls));
    const l1 = line(40, `100\\times x=${D.p}\\times${D.amt}`), l2 = line(110, `100x=${nT(D.prod)}`), l3 = line(180, `x=${nT(D.prod)}\\div100=${D.ans}`, 'u1l7-eqn');
    const ok = hide(lab(stage, W / 2, 290, `Same answer as ${T(`${dec(D.p, 2)}\\times${D.amt}=${D.ans}`)} ✓`, 'u1l7-ok u1l7-mid'));
    return [
      { cap: `Percent means out of 100: ${T(F(D.p, 100))}. The part, ${T('x')}, is out of the whole, ${D.amt}.`, run: async (c) => { for (const t of tg) await show(c, t); } },
      { cap: `Cross-multiply: ${T(`100\\times x=${D.p}\\times${D.amt}`)}.`, run: async (c) => { await appear(c, X1, 400); await appear(c, X2, 400); await show(c, l1); } },
      { cap: `${T(`${D.p}\\times${D.amt}=${nT(D.prod)}`)}, so ${T(`100x=${nT(D.prod)}`)}.`, run: (c) => show(c, l2) },
      { cap: `Divide both sides by 100: ${T(`x=${nT(D.prod)}\\div100=${D.ans}`)}.`, run: async (c) => { await pop(c, l3); f2.t.innerHTML = `<span class="u1l7-ans">${D.ans}</span>`; await pop(c, f2.t.firstChild); } },
      { cap: `Both ways give the same answer. Use the one you like.`, run: (c) => pop(c, ok) }
    ];
  }
};

/* =============================== explainer: what percent? part ÷ whole on a percent ruler =============================== */
const WP = {
  a: { label: '(a) 18 of 72', part: 18, whole: 72, dv: '0.25', pc: '25', pcN: 25 },
  b: { label: '(b) 9 of 40', part: 9, whole: 40, dv: '0.225', pc: '22.5', pcN: 22.5 },
  c: { label: '(c) 7 of 9', part: 7, whole: 9, dv: '0.7777\\ldots', pc: '77.77\\ldots', pcN: 700 / 9, rnd: '77.8' },
  d: { label: '(d) 60 of 48', part: 60, whole: 48, dv: '1.25', pc: '125', pcN: 125 }
};
const whatPct = {
  title: 'Part ÷ whole × 100',
  height: 340,
  minW: 940,
  capH: 92,
  choices: [{ sep: 'Example 7 check:' }].concat(Object.keys(WP).map((k) => ({ v: k, label: WP[k].label }))),
  ask: (k) => `Example 7: ${WP[k].part} is what percent of ${WP[k].whole}?${WP[k].rnd ? ' Round to the nearest tenth of a percent.' : ''}`,
  make(stage, k, ex) {
    const D = WP[k], W = ex.W, x0 = 150, BW = W - x0 - 150, mx = Math.max(D.part, D.whole), u = BW / mx, wl = D.whole * u, bh = 46;
    const yW = 24, yP = 104, yR = 222;
    const svg = svgEl('svg', { class: 'u1l7-abs', width: W, height: 270 }); add(stage, svg, 0, 0);
    lab(stage, x0 - 16, yW + bh / 2, '<b>whole</b>', 'u1l7-blab u1l7-mr'); lab(stage, x0 - 16, yP + bh / 2, '<b>part</b>', 'u1l7-blab u1l7-mr');
    const bW = svgEl('rect', { x: x0, y: yW, width: 0, height: bh, rx: 5, fill: '#e2cfae', stroke: BRN, 'stroke-width': 2 }, svg);
    const bP = svgEl('rect', { x: x0, y: yP, width: 0, height: bh, rx: 5, fill: FA, stroke: AMB, 'stroke-width': 2 }, svg);
    const vW = hide(lab(stage, x0 + wl / 2, yW + bh / 2, `${D.whole} = 100%`, 'u1l7-bnum u1l7-mid')), vP = hide(lab(stage, x0 + D.part * u / 2, yP + bh / 2, String(D.part), 'u1l7-bnum u1l7-mid'));
    const rul = svgEl('g', {}, svg); hide(rul);
    svgEl('line', { x1: x0, x2: x0 + BW + 20, y1: yR, y2: yR, stroke: INK, 'stroke-width': 3 }, rul);
    const pmax = Math.floor(100 * mx / D.whole / 25) * 25;
    const rl = [];
    for (let P = 0; P <= pmax; P += 25) { const X = x0 + wl * P / 100; svgEl('line', { x1: X, x2: X, y1: yR - 10, y2: yR + 10, stroke: INK, 'stroke-width': P % 100 === 0 ? 3 : 2 }, rul); rl.push(hide(lab(stage, X, yR + 28, P + '%', 'u1l7-tk u1l7-mid'))); }
    const Xp = x0 + wl * D.pcN / 100;
    const drop = svgEl('line', { x1: Xp, x2: Xp, y1: yP + bh, y2: yR, stroke: RED, 'stroke-width': 3, 'stroke-dasharray': '6 4' }, svg); hide(drop);
    const mk = pin(stage, Xp, yR - 2, RED); hide(mk);
    const mkl = hide(lab(stage, Xp, yR - 56, (D.rnd ? '≈ ' + D.rnd : D.pc) + '%', 'u1l7-mkl u1l7-mid'));
    const m1 = hide(lab(stage, W / 2, 300, K(`${D.part}\\div${D.whole}=${D.dv}`), 'u1l7-eqn u1l7-mid'));
    const st = [
      { cap: `The <b>whole</b> comes after “of”: <b>${D.whole}</b>. The whole is <b>100%</b>.`, run: async (c) => { await tween(c, 700, (t) => bW.setAttribute('width', wl * t)); await show(c, vW); } },
      { cap: `The <b>part</b> is <b>${D.part}</b>.${D.part > D.whole ? ' It is <b>longer</b> than the whole!' : ''}`, run: async (c) => { await tween(c, 700, (t) => bP.setAttribute('width', D.part * u * t)); await show(c, vP); } },
      { cap: `Divide the part by the whole: ${T(`${D.part}\\div${D.whole}=${D.dv}`)}.`, run: (c) => show(c, m1) },
      { cap: `Multiply by 100 (2 places right): ${T(`${D.dv}=${D.pc}\\%`)}. On the percent ruler, the part reaches ${D.rnd ? 'about ' : ''}<b>${D.rnd ? D.rnd : D.pc}%</b>.`,
        run: async (c) => { await appear(c, rul, 300); for (const l of rl) await appear(c, l, 80); await appear(c, drop, 300); await fadeIn(c, mk, 300, { from: 'translateY(-20px)' }); await show(c, mkl); m1.innerHTML = K(`${D.part}\\div${D.whole}=${D.dv}=${D.pc}\\%`); } }
    ];
    if (D.rnd) st.push({ cap: `Round to the nearest <b>tenth</b>: 77.7|7… The next digit, 7, is 5 or more, so round up: ${T('77.8\\%')}.`,
      run: async (c) => { m1.innerHTML = K(`${D.part}\\div${D.whole}=${D.dv}=${D.pc}\\%\\approx${D.rnd}\\%`); await pulse(c, m1, 1.06); } });
    if (D.part > D.whole) st.push({ cap: `${T('125\\%')} is <b>more than 100%</b>, because the part is bigger than the whole.`, run: (c) => pulse(c, mkl, 1.25) });
    return st;
  }
};

/* =============================== explainer: verdicts with percents (Example 8) =============================== */
const verdict = {
  title: 'Compare with percents',
  height: 356,
  minW: 940,
  capH: 92,
  choices: [{ sep: 'Example 8 check:' }, { v: 'a', label: '(a) Priya’s two tests' }, { v: 'b', label: '(b) Marco’s tip' }],
  ask: (k) => (k === 'a' ? 'Priya got 38 out of 45 on Test 1 and 22 out of 25 on Test 2. On which test did she do better?' : 'Marco left a $12.00 tip on a $64.00 bill. What percent tip is that, to the nearest tenth? More or less than 15%?'),
  make(stage, k, ex) {
    const W = ex.W;
    if (k === 'a') {
      const pw = 360, xs = [W / 2 - pw - 40, W / 2 + 40];
      const papers = [['Test 1', 38, 45, 84.4, '38\\div45=0.8444\\ldots\\approx84.4\\%'], ['Test 2', 22, 25, 88, '22\\div25=0.88=88\\%']].map(([nm, a, b, pc, tx], i) => {
        const p = add(stage, h('div', 'u1l7-abs u1l7-paper', `<div class="nm">${nm}<span>Priya</span></div><div class="sc"><b>${a}</b>/${b}</div><div class="bar"><i></i></div><div class="pc"></div><div class="tx"></div>`), xs[i], 14);
        p.style.width = pw + 'px'; hide(p); p.fillEl = p.querySelector('.bar i'); p.pcEl = p.querySelector('.pc'); p.txEl = p.querySelector('.tx'); p.pc = pc; p.tx = tx; return p;
      });
      const vs = hide(lab(stage, W / 2, 80, '38 &gt; 22 ?', 'u1l7-vs u1l7-mid'));
      const st = stamp(stage, 'Better!', { ok: true, x: xs[1] + pw - 80, y: 198, size: 'sm' }); hide(st);
      const fillP = (c, p) => tween(c, 1000, (t) => { p.fillEl.style.width = (p.pc * t) + '%'; p.pcEl.textContent = (p.pc * t).toFixed(1).replace(/\.0$/, '') + '%'; });
      return [
        { cap: `Test 1: <b>38</b> marks. Test 2: <b>22</b> marks. More marks on Test 1… but Test 1 is out of <b>45</b> and Test 2 is out of <b>25</b>.`,
          run: async (c) => { for (const p of papers) await show(c, p); await show(c, vs); await shake(c, vs); } },
        { cap: `Test 1 as a percent: ${T(papers[0].tx)}.`, run: async (c) => { vs.style.opacity = 0; await fillP(c, papers[0]); papers[0].txEl.innerHTML = T(papers[0].tx); await show(c, papers[0].txEl); } },
        { cap: `Test 2 as a percent: ${T(papers[1].tx)}.`, run: async (c) => { await fillP(c, papers[1]); papers[1].txEl.innerHTML = T(papers[1].tx); await show(c, papers[1].txEl); } },
        { cap: `${T('88\\%>84.4\\%')}: she did better on <b>Test 2</b>, even with fewer marks. Percents let us compare tests with different totals.`, run: (c) => stampIn(c, st) }
      ];
    }
    const rc = add(stage, h('div', 'u1l7-abs u1l7-rcpt', `<div class="hd">MARCO’S SUPPER<small>Calgary, AB</small></div><div class="ln rb"><span><b>Bill</b> (whole)</span><b>$64.00</b></div><div class="ln rp"><span><b>Tip</b> (part)</span><b>$12.00</b></div><div class="ln rt"><span>Total</span><b>$76.00</b></div>`), 30, 10);
    rc.style.height = '230px';
    const sx0 = 380, sx1 = W - 50, sy = 150, spx = (P) => sx0 + (sx1 - sx0) * P / 25;
    const svg = svgEl('svg', { class: 'u1l7-abs', width: W, height: 260 }); add(stage, svg, 0, 0);
    svgEl('rect', { x: spx(15), y: sy - 26, width: spx(20) - spx(15), height: 52, fill: '#e3f3ea', stroke: GRN, 'stroke-width': 1.5 }, svg);
    lab(stage, (spx(15) + spx(20)) / 2, sy + 60, 'usual tips', 'u1l7-mut u1l7-mid');
    svgEl('line', { x1: sx0, x2: sx1, y1: sy, y2: sy, stroke: INK, 'stroke-width': 3 }, svg);
    for (let P = 0; P <= 25; P += 5) { svgEl('line', { x1: spx(P), x2: spx(P), y1: sy - 10, y2: sy + 10, stroke: INK, 'stroke-width': 2.5 }, svg); lab(stage, spx(P), sy + 30, P + '%', 'u1l7-tk u1l7-mid'); }
    const mk = pin(stage, spx(0), sy - 2, RED), mkl = hide(lab(stage, spx(18.8), sy - 66, '18.8%', 'u1l7-mkl u1l7-mid'));
    hide(mk);
    const m1 = hide(lab(stage, sx0, 236, K('12\\div64=0.1875=18.75\\%'), 'u1l7-eqn'));
    const st = stamp(stage, 'more than 15%', { ok: true, x: spx(6), y: 70, size: 'sm' }); hide(st);
    const chk = hide(lab(stage, W / 2, 322, `Check: 15% of $64 is ${T('6.40+3.20=\\$9.60')}, less than $12 ✓`, 'u1l7-ok u1l7-mid'));
    return [
      { cap: `The <b>part</b> is the tip, $12. The <b>whole</b> is the bill, $64 (the tip is a percent <b>of</b> the bill).`,
        run: async (c) => { const t = rc.querySelector('.rp'), b = rc.querySelector('.rb'); b.classList.add('lit'); await pulse(c, b, 1.05); t.classList.add('lit2'); await pulse(c, t, 1.05); } },
      { cap: `Part ÷ whole: ${T('12\\div64=0.1875')}, and × 100 gives ${T('18.75\\%')}.`, run: (c) => show(c, m1) },
      { cap: `To the nearest tenth: ${T('18.75\\%\\approx18.8\\%')}.`,
        run: async (c) => { mk.style.opacity = 1; await tween(c, 1100, (t) => { mk.style.left = (spx(18.8 * t) - 15) + 'px'; }); await show(c, mkl); m1.innerHTML = K('12\\div64=0.1875=18.75\\%\\approx18.8\\%'); } },
      { cap: `18.8% is <b>more than 15%</b>. Marco tipped about 18.8%.`, run: (c) => stampIn(c, st) },
      { cap: `Check with a benchmark: 15% of $64 is ${T('6.40+3.20=\\$9.60')}. $12 is more than that ✓`, run: (c) => show(c, chk) }
    ];
  }
};

/* =============================== wiring =============================== */
mountGrids();
mountExplainers({ grid, slide, cents: cents$, fracPct, bench, tipCalc, pctOf, proportion, whatPct, verdict });

/* ============ Stand Up Break! — percents ↔ decimals, benchmarks, percent of and what percent ============ */
{
  standup('u1l7', {
    intro: 'Show every step on the whiteboard. Estimate first with a benchmark (10%, 5%, 1%), then check your answer.',
    levels: {
      BEG: (r) => { // percent ↔ decimal, in tenths of a percent so the strings stay exact
        const k = r.pick([r.int(11, 99) * 10, r.int(1, 9) * 10, r.int(1, 9) * 10 + 5, r.int(22, 50) * 50, r.int(1, 9)]);   // 47%, 6%, 6.5%, 135%, 0.6%
        const p = dec(k, 1), d = dec(k, 3);
        return r.chance(0.5)
          ? { text: 'Write the percent as a decimal.', q: `${p}\\%`, a: [`${p}\\%=${p}\\div100`, `=${d}`] }
          : { text: 'Write the decimal as a percent.', q: d, a: [`${d}\\times100`, `=${p}\\%`] };
      },
      PRG: (r) => { // a benchmark percent of a money amount (whole cents all the way)
        const c0 = r.int(100, 600) * 20, A = $T(c0), ten = c0 / 10, five = c0 / 20;
        return r.pick([
          () => ({ text: 'No calculator! Find 15% of the amount. Show 10% and 5% first.', q: A, a: [`10\\%=${$T(ten)}`, `5\\%=${$T(ten)}\\div2=${$T(five)}`, `15\\%=${$T(ten)}+${$T(five)}=${$T(ten + five)}`] }),
          () => ({ text: 'No calculator! Find 20% of the amount.', q: A, a: [`10\\%=${$T(ten)}`, `20\\%=2\\times${$T(ten)}=${$T(2 * ten)}`] }),
          () => ({ text: 'No calculator! Find 25% of the amount.', q: A, a: [`50\\%=${$T(c0)}\\div2=${$T(c0 / 2)}`, `25\\%=${$T(c0 / 2)}\\div2=${$T(c0 / 4)}`] }),
          () => ({ text: 'No calculator! Find 30% of the amount.', q: A, a: [`10\\%=${$T(ten)}`, `30\\%=3\\times${$T(ten)}=${$T(3 * ten)}`] })
        ])();
      },
      MAS: (r) => r.pick([
        () => { // what percent, to the nearest tenth (no ties)
          for (;;) { const b = r.int(12, 80), a = r.int(3, Math.round(b * 1.4)); const q1000 = Math.floor(a * 1000 / b), rem = a * 1000 - q1000 * b; if (a === b || 2 * rem === b) continue;
            const t = Math.round(a * 1000 / b), exact = rem === 0;
            return { text: `${a} is what percent of ${b}? Round to the nearest tenth of a percent.`, q: '', a: [`${a}\\div${b}=${exact ? dec(q1000, 3) : dec(q1000, 3) + '\\ldots'}`, `${exact ? '=' + dec(t, 1) : '\\approx' + (t / 10).toFixed(1)}\\%`] }; }
        },
        () => { // percent of a money amount, estimate first
          const pt = r.pick([60, 80, 120, 150, 180, 350, 450, 75, 25, 1250, 1500]), c0 = r.int(2000, 12000);   // percent in tenths, amount in cents
          const exact = pt * c0, rounded = Math.round(exact / 1000), pS = dec(pt, 1), pd = dec(pt, 3);
          const exS = dec(exact, 5), isExact = exact % 1000 === 0;
          return { text: `Find ${pS}% of ${$H(c0)}. Estimate first, then use your calculator. Round to the cent.`, q: '', a: [`${pS}\\%=${pd}`, `${pd}\\times${cents(c0)}=${exS}`, `${isExact ? '=' : '\\approx'}${$T(rounded)}`] };
        }
      ])()
    }
  });
}
