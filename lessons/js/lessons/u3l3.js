/* Math 10-3 · Unit 3 · Lesson 3 — The Imperial System and Reading a Tape Measure.
 * Explainers: how long each unit is (inch tiles → foot → yard → mile; Example 1(c) checks), splitting an inch
 * (halves → sixteenths; Example 2(a) check), why the fractions simplify (Full notes: stacked rulers), reading a
 * ruler (zoom in and count the sixteenths; Example 3), measuring objects (Example 4, the screw from 1 in), nearest
 * 1/16 and 1/8 (Example 5), why the hook is loose (Full notes), a tape in feet and inches (Example 6), why a
 * 2 by 4 is smaller (Full notes), and lining up wrenches and players (Example 7).
 * Also the two hands-on tools (a ruler and a tape measure you drag and read), the static figures, the Math History
 * box (three barleycorns) and the Stand Up Break. */
import { h, add, box, tex, svgEl, tween, pulse, stamp, stampIn, liveCtx, mountExplainers } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const lerp = (a, b, t) => a + (b - a) * t;
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
/** a fraction n/d in simplest form (TeX) */
const fracT = (n, d) => { const g = gcd(n, d); return `\\tfrac{${n / g}}{${d / g}}`; };
/** a length in sixteenths of an inch → a mixed number in simplest form (TeX) */
const mixT = (s) => { const w = Math.floor(s / 16), r = s - 16 * w; if (!r) return String(w); const f = fracT(r, 16); return w ? w + f : f; };
const inT = (s) => `${mixT(s)}\\text{ in}`;
/** sixteenths → feet and inches (TeX), e.g. 2'\,1\tfrac58'' */
const ftinT = (s) => { const f = Math.floor(s / 192), r = s - 192 * f; return `${f}'\\,${mixT(r)}''`; };
/** r sixteenths → "\tfrac{r}{16}" or "\tfrac{10}{16}=\tfrac58" */
const simpT = (r) => (gcd(r, 16) > 1 ? `\\tfrac{${r}}{16}=${fracT(r, 16)}` : `\\tfrac{${r}}{16}`);
/* the five kinds of line: inch, half, quarter, eighth, sixteenth */
const TIER = (k) => { const m = ((k % 16) + 16) % 16; return m === 0 ? 0 : m % 8 === 0 ? 1 : m % 4 === 0 ? 2 : m % 2 === 0 ? 3 : 4; };
const TH = [1, 0.775, 0.59, 0.425, 0.275];       // line length (× the inch line), as in the booklet
const TW = [3, 2.6, 2.2, 1.9, 1.6];
const TC = ['#1c2230', '#c93a33', '#1f5bd6', '#12805a', '#7b4fc4'];
const TNAME = ['whole-inch', 'half', 'quarter', 'eighth', 'sixteenth'];
const INK = '#1c2230', AMB = '#e2a63a', RED = '#c93a33', GRN = '#12805a', BLU = '#1f5bd6';
const cbox = (cls, html) => h('div', cls + ' u3l3-c', `<div>${html}</div>`);
/** an HTML label centred on (cx, cy) */
const lab = (host, html, cx, cy, w = 80, hh = 40, cls = '') => add(host, box(h('div', 'u3l3-fl ' + cls, html), w, hh), cx - w / 2, cy - hh / 2);
const stageSvg = (stage, W, H) => add(stage, svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u3l3-svg' }), 0, 0);
const op = (c, el, to, ms = 350) => c.anim(el, [{ opacity: to }], ms);

/* ======================================================================================
 * A ruler or tape-measure blade (SVG). Lines hang down from the top edge, numbers under them.
 * drawRuler(svg, { x, y, a, b, ppi, hh, tape, colour, font, pad }) → { g, X, tiers[t][], ticks{k}, nums{i}, tags{i}, L }
 * ====================================================================================== */
function drawRuler(svg, o) {
  const { x = 0, y = 0, a = 0, b = 6, ppi = 120, tape = false, colour = false, font = 20, pad = 12 } = o;
  const X = (inch) => x + (inch - a) * ppi;
  const g = svgEl('g', {}, svg), L = (o.hh || 80) * 0.6, hh = Math.round(L + font * 1.2 + 14);
  const x0 = X(o.from ?? a) - pad, x1 = X(o.to ?? b) + pad;
  svgEl('rect', { x: x0, y, width: x1 - x0, height: hh, rx: 4, fill: tape ? '#f6d64a' : '#fff', stroke: '#3a4254', 'stroke-width': 2.5 }, g);
  if (tape && a === 0 && o.hook !== false) svgEl('rect', { x: X(0) - 8, y: y - 8, width: 8, height: hh + 16, rx: 2, fill: '#9aa0ab', stroke: '#3a4254', 'stroke-width': 2 }, g);
  const tiers = [[], [], [], [], []], ticks = {}, nums = {}, tags = {};
  const k0 = Math.round(a * 16), k1 = Math.round(b * 16);
  for (let k = k0; k <= k1; k++) {
    const t = TIER(k), xx = X(k / 16);
    const ln = svgEl('line', { x1: xx, x2: xx, y1: y, y2: y + L * TH[t], stroke: colour ? TC[t] : INK, 'stroke-width': TW[t] * (o.tw || 1) }, g);
    tiers[t].push(ln); ticks[k] = ln;
  }
  const ny = y + L + 6 + font * 0.82;
  for (let i = Math.ceil(a); i <= Math.floor(b); i++) {
    const s = String(i), w = s.length * font * 0.62 + 8;
    if (tape && i > 0 && i % 16 === 0) svgEl('rect', { x: X(i) - w / 2, y: ny - font * 0.86, width: w, height: font * 1.12, rx: 3, fill: '#b3261e' }, g);
    const t = svgEl('text', { x: X(i), y: ny, 'text-anchor': 'middle', 'font-size': font, 'font-weight': 800, fill: tape && i > 0 && i % 16 === 0 ? '#fff' : INK }, g);
    t.textContent = s; nums[i] = t;
    if (tape && i > 0 && i % 12 === 0) {
      const tg = svgEl('g', {}, g), tw = font * 1.45, tx = X(i) + w / 2 + 3;
      svgEl('rect', { x: tx, y: ny - font * 0.78, width: tw, height: font * 0.98, rx: 2, fill: '#1c2230' }, tg);
      const tt = svgEl('text', { x: tx + tw / 2, y: ny - font * 0.06, 'text-anchor': 'middle', 'font-size': font * 0.72, 'font-weight': 800, fill: '#fff' }, tg);
      tt.textContent = `${i / 12}F`; tags[i] = tg;
    }
  }
  return { g, X, tiers, ticks, nums, tags, L, y, hh, ppi, a, b, ny };
}
/** an arrow pointing down at x onto the top edge yTop, with a letter above */
function markArrow(svg, x, yTop, label = '', color = RED, len = 44) {
  const g = svgEl('g', {}, svg);
  svgEl('line', { x1: x, x2: x, y1: yTop - len, y2: yTop - 10, stroke: color, 'stroke-width': 3.2 }, g);
  svgEl('path', { d: `M${x - 7} ${yTop - 13} L${x + 7} ${yTop - 13} L${x} ${yTop - 1} Z`, fill: color }, g);
  if (label) { const t = svgEl('text', { x, y: yTop - len - 6, 'text-anchor': 'middle', 'font-size': 21, 'font-weight': 800, fill: color }, g); t.textContent = label; }
  return g;
}
/** a grey bar (an object being measured) from inch x1 to x2, above ruler R, with dashed lines down to the ruler */
function objBar(svg, R, x1, x2, name, yy, hh = 34) {
  const g = svgEl('g', {}, svg);
  svgEl('path', { d: `M${R.X(x1)} ${yy + hh} V${R.y} M${R.X(x2)} ${yy + hh} V${R.y}`, stroke: '#7a8291', 'stroke-width': 2, 'stroke-dasharray': '5 4' }, g);
  svgEl('rect', { x: R.X(x1), y: yy, width: R.X(x2) - R.X(x1), height: hh, rx: 7, fill: '#dfe3ea', stroke: '#5d6675', 'stroke-width': 2.5 }, g);
  const t = svgEl('text', { x: (R.X(x1) + R.X(x2)) / 2, y: yy + hh / 2 + 6, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 700, fill: '#3a4254' }, g); t.textContent = name;
  return g;
}
/** hops between sixteenths from k0 for n spaces, bulging up from the line y (hidden until shown) */
function hopsAt(svg, R, k0, n, y, color = AMB) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const xa = R.X((k0 + i) / 16), xb = R.X((k0 + i + 1) / 16), g = svgEl('g', {}, svg);
    svgEl('path', { d: `M${xa + 2} ${y} Q${(xa + xb) / 2} ${y - 22} ${xb - 2} ${y}`, fill: 'none', stroke: color, 'stroke-width': 2.6 }, g);
    const t = svgEl('text', { x: (xa + xb) / 2, y: y - 18, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 800, fill: '#8a5a0a' }, g); t.textContent = i + 1;
    g.style.opacity = 0; out.push(g);
  }
  return out;
}
const showSeq = async (c, els, gap = 110) => { for (const e of els) { await c.anim(e, [{ opacity: 0 }, { opacity: 1 }], gap); } };
/** a ring around a ruler number */
const ring = (svg, R, i, color = AMB) => svgEl('circle', { cx: R.X(i), cy: R.ny - 7, r: 17, fill: 'none', stroke: color, 'stroke-width': 3.5 }, svg);
/** zoom: one inch of ruler R drawn big below it, with dashed lines from the small inch to the big one */
function zoomInch(svg, R, w, o) {
  const g = svgEl('g', {}, svg);
  const Z = drawRuler(g, { x: o.x, y: o.y, a: w, b: w + 1, ppi: o.ppi, hh: o.hh || 110, tape: o.tape, colour: o.colour, font: 20, pad: 16 });
  svgEl('path', { d: `M${R.X(w)} ${R.y + R.hh} L${Z.X(w)} ${o.y} M${R.X(w + 1)} ${R.y + R.hh} L${Z.X(w + 1)} ${o.y}`, stroke: '#9aa0ab', 'stroke-width': 2, 'stroke-dasharray': '6 5', fill: 'none' }, g);
  svgEl('rect', { x: R.X(w) - 2, y: R.y - 2, width: R.ppi + 4, height: R.hh + 4, fill: 'none', stroke: '#9aa0ab', 'stroke-width': 2, 'stroke-dasharray': '6 5' }, g);
  return { g, Z };
}

/* ======================================================================================
 * 1. How long is each unit?
 * ====================================================================================== */
const UC = {
  i: { q: '(i) 1 yd or 2 ft?', A: { lab: '1 yd', n: 3, seg: '1 ft', px: 240 }, B: { lab: '2 ft', n: 2, seg: '1 ft', px: 240 }, conv: '1 yd = 3 ft', win: 'A', say: '<b>1 yd</b> is longer: 3 ft is more than 2 ft.' },
  ii: { q: '(ii) 1 ft or 10 in?', A: { lab: '1 ft', n: 12, seg: '', px: 60 }, B: { lab: '10 in', n: 10, seg: '', px: 60 }, conv: '1 ft = 12 in', win: 'A', say: '<b>1 ft</b> is longer: 12 in is more than 10 in.' },
  iii: { q: '(iii) 1 mi or 2000 yd?', A: { lab: '1 mi', len: 1760 * 0.36, sub: '1760 yd' }, B: { lab: '2000 yd', len: 2000 * 0.36, sub: '2000 yd' }, conv: '1 mi = 1760 yd', win: 'B', say: '<b>2000 yd</b> is longer: 1 mi is only 1760 yd.' }
};
const units = {
  title: 'How long is each imperial unit?',
  height: 440,
  minW: 900,
  choices: [{ v: 'build', label: 'Inch, foot, yard, mile' }, { sep: 'Example 1(c) check:' }, { v: 'i', label: '(i) 1 yd or 2 ft' }, { v: 'ii', label: '(ii) 1 ft or 10 in' }, { v: 'iii', label: '(iii) 1 mi or 2000 yd' }],
  ask: (v) => (v === 'build' ? 'How big is an inch, a foot, a yard and a mile?' : `Example 1(c) ${UC[v].q.slice(0, UC[v].q.indexOf(')') + 1)} Which is longer: <b>${UC[v].q.slice(UC[v].q.indexOf(')') + 2, -1)}</b>?`),
  make(stage, v, ex) {
    const W = ex.W, H = 440, ox = (W - 900) / 2, svg = stageSvg(stage, W, H);
    if (v !== 'build') return unitsCompare(stage, svg, UC[v], ox);
    const u = 22, X0 = ox + 40;
    const tile = (x, y, fill = '#e7d3b0') => svgEl('rect', { x, y, width: u, height: 40, fill, stroke: '#6e4a1c', 'stroke-width': 1.6 }, svg);
    // the inch and a thumb
    const g1 = svgEl('g', {}, svg);
    svgEl('rect', { x: X0, y: 40, width: u, height: 40, fill: '#e7d3b0', stroke: '#6e4a1c', 'stroke-width': 2 }, g1);
    svgEl('path', { d: `M${X0 + 50} 82 V48 Q${X0 + 50} 30 ${X0 + 61} 30 Q${X0 + 72} 30 ${X0 + 72} 48 V82`, fill: '#f2c9a5', stroke: '#9a6a3a', 'stroke-width': 2.5 }, g1);
    svgEl('rect', { x: X0 + 54, y: 34, width: 14, height: 14, rx: 5, fill: '#fbe7dc', stroke: '#c49a7a', 'stroke-width': 1.6 }, g1);
    svgEl('path', { d: `M${X0} 30 V24 M${X0 + u} 30 V24 M${X0 + 50} 24 M${X0 + 50} 26 V20 M${X0 + 72} 26 V20`, stroke: '#9aa0ab', 'stroke-width': 1.5 }, g1);
    const l1 = lab(stage, '<b>1 in</b>', X0 + u / 2, 98, 60, 26, 'u3l3-tag'); const l1b = lab(stage, 'about a thumb wide', X0 + 170, 60, 190, 30, 'u3l3-small');
    hide(g1, l1, l1b);
    // the foot: 12 inch tiles, and a sheet of paper (11 in)
    const ft = []; for (let i = 0; i < 12; i++) { const r = tile(X0 + i * u, 120); r.style.opacity = 0; ft.push(r); }
    const lf = hide(lab(stage, '<b>1 ft = 12 in</b> &nbsp;<span class="u3l3-small">(a school ruler)</span>', X0 + 12 * u + 150, 140, 280, 30, 'u3l3-tag'));
    const paper = svgEl('g', {}, svg); svgEl('rect', { x: X0, y: 166, width: 11 * u, height: 26, fill: '#fff', stroke: '#7a8291', 'stroke-width': 2 }, paper);
    for (let i = 1; i < 4; i++) svgEl('line', { x1: X0 + 8, x2: X0 + 11 * u - 8, y1: 166 + i * 6.5, y2: 166 + i * 6.5, stroke: '#b9c4d6', 'stroke-width': 1.2 }, paper);
    const lp = hide(lab(stage, 'a sheet of paper: 11 in', X0 + 11 * u + 120, 179, 220, 26, 'u3l3-small')); hide(paper);
    // the yard: 3 feet, and a metre stick
    const yd = []; for (let j = 0; j < 3; j++) { const g = svgEl('g', {}, svg); svgEl('rect', { x: X0 + j * 12 * u, y: 220, width: 12 * u, height: 40, fill: '#d9c39a', stroke: '#6e4a1c', 'stroke-width': 2.2 }, g); const t = svgEl('text', { x: X0 + j * 12 * u + 6 * u, y: 246, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 800, fill: '#4a2c14' }, g); t.textContent = '1 ft'; g.style.opacity = 0; yd.push(g); }
    const ly = hide(lab(stage, '<b>1 yd = 3 ft = 36 in</b> &nbsp;<span class="u3l3-small">one long step</span>', X0 + 400, 206, 420, 26, 'u3l3-tag'));
    const ms = svgEl('g', {}, svg); for (let i = 0; i < 10; i++) svgEl('rect', { x: X0 + i * 3.937 * u, y: 266, width: 3.937 * u, height: 16, fill: i % 2 ? '#fff' : '#f3b23c', stroke: '#8a5a0a', 'stroke-width': 1.2 }, ms);
    const lm = hide(lab(stage, 'a metre stick is a little longer', X0 + 39.37 * u - 140, 296, 280, 24, 'u3l3-small')); hide(ms);
    // the mile: a road and a walker
    const road = svgEl('g', {}, svg);
    svgEl('rect', { x: X0, y: 336, width: 820, height: 22, rx: 4, fill: '#5d6675' }, road);
    svgEl('line', { x1: X0 + 6, x2: X0 + 814, y1: 347, y2: 347, stroke: '#fff', 'stroke-width': 2.5, 'stroke-dasharray': '18 14' }, road);
    const walker = svgEl('g', {}, road); svgEl('circle', { cx: 0, cy: 314, r: 6, fill: '#6e4a1c' }, walker); svgEl('path', { d: 'M0 320 V332 M0 332 L-6 340 M0 332 L6 340 M-7 324 L7 324', stroke: '#6e4a1c', 'stroke-width': 3, 'stroke-linecap': 'round' }, walker);
    walker.setAttribute('transform', `translate(${X0 + 10} 0)`);
    const lmi = hide(lab(stage, '<b>1 mi = 1760 yd = 5280 ft</b> &nbsp;<span class="u3l3-small">about a 20-minute walk (not to scale!)</span>', X0 + 410, 378, 640, 28, 'u3l3-tag')); hide(road);
    const sum = hide(add(stage, box(cbox('u3l3-res', '12 in = 1 ft · 3 ft = 1 yd · 1760 yd = 5280 ft = 1 mi'), 560, 44), ox + 330, 30));
    return [
      { cap: 'An <b>inch</b> (in or ″) is the smallest unit: about the width of your <b>thumb</b> at the top knuckle.', run: async (c) => { await c.pop(g1); await c.fadeIn(l1); await c.fadeIn(l1b); } },
      { cap: '<b>12 inches make 1 foot</b> (ft or ′), about a school ruler. A sheet of paper is 11 in long.', run: async (c) => { for (const r of ft) await c.anim(r, [{ opacity: 0 }, { opacity: 1 }], 70); await c.fadeIn(lf); await c.fadeIn(paper); await c.fadeIn(lp); } },
      { cap: '<b>3 feet make 1 yard</b> (yd) = 36 in: one long step, a little shorter than a metre stick.', run: async (c) => { for (const g of yd) await c.pop(g, 300); await c.fadeIn(ly); await c.fadeIn(ms); await c.fadeIn(lm); } },
      { cap: 'A <b>mile</b> (mi) is much longer: 1760 yd, or 5280 ft. Walking a mile takes about 20 minutes.', run: async (c) => { await c.fadeIn(road); await c.fadeIn(lmi); await tween(c, 2200, (t) => walker.setAttribute('transform', `translate(${X0 + 10 + 790 * t} 0)`)); } },
      { cap: 'Remember these four facts. The numbers are not tens like in SI, so you have to <b>know</b> them.', run: (c) => c.pop(sum) }
    ];
  }
};
function unitsCompare(stage, svg, d, ox) {
  const X0 = ox + 160, rows = [['A', 110], ['B', 250]], parts = {}, labs = {};
  rows.forEach(([k, y]) => {
    const s = d[k];
    labs[k] = add(stage, box(cbox('u3l3-card', `<b>${s.lab}</b>`), 120, 54), ox + 20, y);
    const g = svgEl('g', {}, svg), segs = [];
    if (s.n) {
      for (let i = 0; i < s.n; i++) {
        const sg = svgEl('g', {}, g);
        svgEl('rect', { x: X0 + i * s.px, y, width: s.px, height: 54, fill: s.px > 100 ? '#d9c39a' : '#d8e6f8', stroke: s.px > 100 ? '#6e4a1c' : '#1f5bd6', 'stroke-width': 2 }, sg);
        const t = svgEl('text', { x: X0 + (i + 0.5) * s.px, y: y + 34, 'text-anchor': 'middle', 'font-size': s.px > 100 ? 21 : 17, 'font-weight': 800, fill: '#3a4254' }, sg); t.textContent = s.seg || `${i + 1}`;
        sg.style.opacity = 0; segs.push(sg);
      }
    } else {
      const sg = svgEl('g', {}, g);
      svgEl('rect', { x: X0, y, width: s.len, height: 54, rx: 4, fill: '#d8e6f8', stroke: '#1f5bd6', 'stroke-width': 2.5 }, sg);
      const t = svgEl('text', { x: X0 + s.len / 2, y: y + 35, 'text-anchor': 'middle', 'font-size': 21, 'font-weight': 800, fill: '#1f3f8a' }, sg); t.textContent = s.sub;
      sg.style.opacity = 0; segs.push(sg);
    }
    parts[k] = segs;
  });
  const conv = hide(add(stage, box(cbox('u3l3-res', `<b>${d.conv}</b>`), 300, 46), ox + 300, 28));
  const unitNote = d.A.n ? (d.A.px > 100 ? 'Count the <b>feet</b>.' : 'Count the <b>inches</b>.') : 'Compare in <b>yards</b>.';
  const winY = d.win === 'A' ? 110 : 250, wlen = d[d.win].n ? d[d.win].n * d[d.win].px : d[d.win].len;
  const st = hide(stamp(stage, 'longer', { ok: true, x: X0 + Math.min(wlen, 720) - 60, y: winY - 12, rotate: -8 }));
  return [
    { cap: 'Two lengths in <b>different units</b>. To compare them, use the <b>same unit</b>.', run: async (c) => { await c.pop(labs.A); await c.pop(labs.B); } },
    { cap: `Use the facts: <b>${d.conv}</b>. ${unitNote}`, run: async (c) => { await c.pop(conv); for (const s of parts.A) await c.anim(s, [{ opacity: 0 }, { opacity: 1 }], d.A.n > 5 ? 80 : 300); } },
    { cap: `Now <b>${d.B.lab}</b> at the same scale.`, run: async (c) => { for (const s of parts.B) await c.anim(s, [{ opacity: 0 }, { opacity: 1 }], d.B.n > 5 ? 80 : 300); } },
    { cap: d.say, run: async (c) => { st.style.opacity = 1; await stampIn(c, st); } }
  ];
}

/* ======================================================================================
 * 2. Splitting an inch (and the Example 2(a) check)
 * ====================================================================================== */
const split = {
  title: 'Halve, and halve again',
  height: 400,
  minW: 900,
  choices: [{ v: 'halve', label: 'Halve and halve again' }, { sep: 'Example 2 check:' }, { v: 'ex2', label: '(a) Name every line' }],
  ask: (v) => (v === 'halve' ? 'How is one inch split into halves, quarters, eighths and sixteenths?' : 'Example 2(a): write the fraction for each line, in simplest form. The half is done for you.'),
  make(stage, v, ex) {
    const W = ex.W, H = 400, ox = (W - 900) / 2, svg = stageSvg(stage, W, H);
    const R = drawRuler(svg, { x: ox + 70, y: 160, a: 0, b: 1, ppi: 760, hh: 180, colour: true, font: 24, pad: 22, tw: 1.3 });
    const BOXY = 96, BH = 60;
    // boxes above the lines (as in the booklet)
    const boxes = {};
    for (let k = 1; k < 16; k++) boxes[k] = svgEl('rect', { x: R.X(k / 16) - 22, y: BOXY - BH / 2, width: 44, height: BH, rx: 4, fill: '#fff', stroke: '#b9ad97', 'stroke-width': 1.6 }, svg);
    const raw = {}, simp = {};
    for (let k = 1; k < 16; k++) {
      raw[k] = lab(stage, T(`\\dfrac{${k}}{16}`), R.X(k / 16), BOXY, 44, BH);
      simp[k] = lab(stage, T(fracT(k, 16).replace('tfrac', 'dfrac')), R.X(k / 16), BOXY, 44, BH);
      raw[k].style.color = TC[TIER(k)]; simp[k].style.color = TC[TIER(k)];
      hide(raw[k], simp[k]);
    }
    const allBoxes = Object.values(boxes);
    if (v === 'halve') {
      R.tiers.slice(1).forEach((tt) => hide(...tt)); allBoxes.forEach((b) => (b.style.opacity = 0));
      const nums = []; for (let k = 0; k < 16; k++) { const t = svgEl('text', { x: (R.X(k / 16) + R.X((k + 1) / 16)) / 2, y: 160 + 180 * 0.6 * 0.275 + 22, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 800, fill: '#8a5a0a' }, svg); t.textContent = k + 1; t.style.opacity = 0; nums.push(t); }
      const tierStep = (t, ks) => async (c) => { for (const ln of R.tiers[t]) await c.anim(ln, [{ opacity: 0 }, { opacity: 1 }], 90); for (const k of ks) { boxes[k].style.opacity = 1; await c.pop(simp[k], 260); } };
      return [
        { cap: 'This is <b>one inch</b>, made bigger. The <b>longest</b> lines are the whole inches.', run: (c) => pulse(c, R.nums[1], 1.2) },
        { cap: `Cut it in <b>half</b>. The next-longest line (red) is ${T('\\tfrac12')}.`, run: tierStep(1, [8]) },
        { cap: `Cut each half in half: <b>quarters</b> (blue), ${T('\\tfrac14')} and ${T('\\tfrac34')}.`, run: tierStep(2, [4, 12]) },
        { cap: `Again: <b>eighths</b> (green), ${T('\\tfrac18,\\ \\tfrac38,\\ \\tfrac58,\\ \\tfrac78')}.`, run: tierStep(3, [2, 6, 10, 14]) },
        { cap: `Again: <b>sixteenths</b> (purple), the <b>shortest</b> lines: ${T('\\tfrac1{16},\\ \\tfrac3{16},\\ \\dots')}`, run: tierStep(4, [1, 3, 5, 7, 9, 11, 13, 15]) },
        { cap: `Now there are <b>16 small spaces</b>. Each space is ${T('\\tfrac1{16}')} in. Count spaces to name any line.`, run: async (c) => { for (const n of nums) await c.anim(n, [{ opacity: 0 }, { opacity: 1 }], 70); } },
        { cap: 'The shortest lines are the <b>odd</b> sixteenths. They can not be simplified: an odd top and 16 share no factor but 1.', run: async (c) => { await Promise.all(R.tiers[4].map((ln) => c.anim(ln, [{ opacity: 1 }, { opacity: 0.15 }, { opacity: 1 }, { opacity: 0.15 }, { opacity: 1 }], 1100))); } }
      ];
    }
    // Example 2(a) check: the half is given
    boxes[8].setAttribute('stroke', '#7a8291'); simp[8].style.opacity = 1;
    const ks = [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15];
    const swap = (k) => async (c) => { await c.anim(raw[k], [{ opacity: 0 }], 200); await c.pop(simp[k], 300); };
    return [
      { cap: `Count the spaces from 0 to name each line in <b>sixteenths</b>: ${T('\\tfrac1{16},\\ \\tfrac2{16},\\ \\tfrac3{16},\\ \\dots')}`, run: async (c) => { for (const k of ks) await c.anim(raw[k], [{ opacity: 0 }, { opacity: 1 }], 80); } },
      { cap: `The green <b>eighth</b> lines: divide the top and bottom by 2. ${T('\\tfrac2{16}=\\tfrac18')}, ${T('\\tfrac6{16}=\\tfrac38')}, …`, run: async (c) => { for (const k of [2, 6, 10, 14]) await swap(k)(c); } },
      { cap: `The blue <b>quarter</b> lines: divide by 4. ${T('\\tfrac4{16}=\\tfrac14')} and ${T('\\tfrac{12}{16}=\\tfrac34')}.`, run: async (c) => { for (const k of [4, 12]) await swap(k)(c); } },
      { cap: 'The purple <b>odd</b> sixteenths are already in simplest form. Every line has its name!', run: async (c) => { for (const k of [1, 3, 5, 7, 9, 11, 13, 15]) { simp[k].style.opacity = 1; raw[k].style.opacity = 0; } await Promise.all([1, 3, 5, 7, 9, 11, 13, 15].map((k) => pulse(c, simp[k], 1.25))); } }
    ];
  }
};

/* ======================================================================================
 * 2b. Why the fractions simplify: stacked rulers (Full notes)
 * ====================================================================================== */
const simplify = {
  title: 'Sixteenths that land on bigger lines',
  height: 420,
  minW: 900,
  choices: [{ sep: 'Key idea:' }, 12, 6, 8, { sep: 'Example 2(b) check:' }, 2, 4, 10, 14, { sep: 'An odd one:' }, 9].map((n) => (typeof n === 'number' ? { v: n, label: `${n}/16` } : n)),
  ask: (n) => `Write ${T(`\\tfrac{${n}}{16}`)} in simplest form. Where does the line land on the other rulers?`,
  make(stage, n, ex) {
    const W = ex.W, H = 420, ox = (W - 900) / 2, svg = stageSvg(stage, W, H);
    const DEN = [16, 8, 4, 2], NAMES = ['sixteenths', 'eighths', 'quarters', 'halves'], X0 = ox + 210, PPI = 640, rows = [];
    DEN.forEach((d, i) => {
      const y = 22 + i * 86, g = svgEl('g', {}, svg);
      svgEl('rect', { x: X0 - 12, y, width: PPI + 24, height: 56, rx: 4, fill: '#fff', stroke: '#3a4254', 'stroke-width': 2.2 }, g);
      const lines = {};
      for (let j = 0; j <= d; j++) { const t = TIER(j * 16 / d), x = X0 + j / d * PPI; lines[j] = svgEl('line', { x1: x, x2: x, y1: y, y2: y + 46 * TH[t], stroke: TC[t], 'stroke-width': TW[t] }, g); }
      const t = svgEl('text', { x: X0 - 26, y: y + 34, 'text-anchor': 'end', 'font-size': 19, 'font-weight': 800, fill: '#3a4254' }, g); t.textContent = NAMES[i];
      rows.push({ y, d, lines });
    });
    const xv = X0 + n / 16 * PPI;
    const bar = svgEl('rect', { x: X0, y: 22 + 40, width: 0, height: 12, rx: 3, fill: AMB }, svg);
    const drop = svgEl('line', { x1: xv, x2: xv, y1: 22, y2: 22, stroke: AMB, 'stroke-width': 3, 'stroke-dasharray': '7 5' }, svg);
    // the chain of halvings
    const chain = []; let num = n, den = 16, i = 0;
    while (true) {
      chain.push({ num, den, row: i });
      if (num % 2 || den === 2) break;
      num /= 2; den /= 2; i++;
    }
    const nextRow = num % 2 && chain.length < 4 ? chain.length : -1;   // the row with no line here
    const labels = chain.map((s) => hide(lab(stage, T(`\\tfrac{${s.num}}{${s.den}}`), xv + 34, rows[s.row].y + 28, 56, 46, 'u3l3-card')));
    const miss = nextRow >= 0 ? hide(lab(stage, `✗ no ${NAMES[nextRow].slice(0, -1).replace('halve', 'half')} line here`, xv > ox + 600 ? xv - 150 : xv + 130, rows[nextRow].y + 28, 230, 40, 'u3l3-small')) : null;
    const fin = chain[chain.length - 1];
    const res = hide(add(stage, box(cbox('u3l3-res', `${T(`\\tfrac{${n}}{16}`)} ${chain.length > 1 ? '= ' + T(`\\tfrac{${fin.num}}{${fin.den}}`) : ''} &nbsp; in simplest form`), 340, 48), ox + 280, 366));
    const steps = [{ cap: `Count <b>${n}</b> sixteenths along the top ruler.`, run: async (c) => { await tween(c, 800, (t) => bar.setAttribute('width', n / 16 * PPI * t)); await c.pop(labels[0]); } }];
    chain.slice(1).forEach((s, j) => {
      const prev = chain[j];
      steps.push({ cap: `${prev.num} and ${prev.den} are both even: divide the top and bottom by 2. ${T(`\\tfrac{${prev.num}}{${prev.den}}=\\tfrac{${s.num}}{${s.den}}`)}: it sits right on a line of the <b>${NAMES[s.row]}</b> ruler.`,
        run: async (c) => { await tween(c, 500, (t) => drop.setAttribute('y2', lerp(rows[s.row - 1].y + 56, rows[s.row].y + 46, t))); const ln = rows[s.row].lines[s.num]; ln.setAttribute('stroke-width', 5); ln.setAttribute('stroke', AMB); await c.pop(labels[s.row]); } });
    });
    steps.push({ cap: miss ? `<b>${fin.num}</b> is odd, so it can not be halved again: there is no ${NAMES[nextRow].slice(0, -1).replace('halve', 'half')} line here. ${T(`\\tfrac{${fin.num}}{${fin.den}}`)} is in simplest form.` : `${T('\\tfrac12')} is as simple as it gets: the half line.`,
      run: async (c) => { if (miss) { await tween(c, 400, (t) => drop.setAttribute('y2', lerp(rows[nextRow - 1].y + 56, rows[nextRow].y + 52, t))); await c.fadeIn(miss); } await c.pop(res); } });
    return steps;
  }
};

/* ======================================================================================
 * 3. Reading a ruler (Example 3)
 * ====================================================================================== */
const EX3 = { A: 12, B: 26, C: 37, D: 56, E: 71, F: 82 };
const readRuler = {
  title: 'Read a ruler: last number, then count',
  height: 420,
  minW: 900,
  choices: [{ sep: 'Example 3 check:' }, ...Object.keys(EX3).map((k) => ({ v: k, label: `Arrow ${k}` }))],
  value: 'E',
  ask: (k) => `Example 3: read the length at arrow <b>${k}</b>.`,
  make(stage, k, ex) {
    const W = ex.W, H = 420, ox = (W - 900) / 2, svg = stageSvg(stage, W, H), s = EX3[k], w = Math.floor(s / 16), r = s - 16 * w;
    const R = drawRuler(svg, { x: ox + 40, y: 64, a: 0, b: 6, ppi: 136, hh: 84, font: 19 });
    Object.entries(EX3).forEach(([kk, ss]) => { if (kk !== k) { const g = markArrow(svg, R.X(ss / 16), 64, kk, '#9aa0ab', 34); g.style.opacity = 0.55; } });
    const arr = hide(markArrow(svg, R.X(s / 16), 64, k, RED, 40));
    const rg = hide(ring(svg, R, w));
    const z = zoomInch(svg, R, w, { x: ox + 90, y: 236, ppi: 720, hh: 120, colour: true }); hide(z.g);
    const bigArr = markArrow(z.g, z.Z.X(s / 16), 236, '', RED, 40);
    const hops = hopsAt(svg, z.Z, 16 * w, r, 232);
    const t = TIER(s);
    const fl = hide(lab(stage, T(simpT(r)), ox + 330, 385, 170, 46, 'u3l3-card'));
    const res = hide(add(stage, box(cbox('u3l3-res', `${k} = ${T(inT(s))}`), 260, 50), ox + 450, 360));
    void bigArr;
    return [
      { cap: `Arrow <b>${k}</b>. <b>Step 1:</b> the whole inches are the last number it passed: <b>${w}</b>.`, run: async (c) => { await c.pop(arr); rg.style.opacity = 1; await c.pop(rg); } },
      { cap: `Zoom in on the inch from ${w} to ${w + 1}.`, run: (c) => c.fadeIn(z.g, 500) },
      { cap: `<b>Step 2:</b> count the small spaces past ${w}: <b>${r}</b> spaces of ${T('\\tfrac1{16}')} in.`, run: (c) => showSeq(c, hops, 120) },
      { cap: `${T(simpT(r))}. ${t === 4 ? 'It is one of the <b>shortest</b> lines (an odd sixteenth), so it does not simplify.' : `The line is a${t === 3 ? 'n' : ''} <b>${TNAME[t]}</b> line, so the fraction simplifies.`}`, run: (c) => c.pop(fl) },
      { cap: `<b>Step 3:</b> write the mixed number with the unit: <b>${k} = ${T(inT(s))}</b>.`, run: (c) => c.pop(res) }
    ];
  }
};

/* ======================================================================================
 * 3b. Measuring objects (Example 4)
 * ====================================================================================== */
const OB = { a: { name: 'a key', x1: 0, s: 38 }, b: { name: 'a crayon', x1: 0, s: 84 }, c: { name: 'a screw', x1: 1, s: 74 } };
const objects = {
  title: 'How long is the object?',
  height: 440,
  minW: 900,
  choices: [{ sep: 'Example 4 check:' }, { v: 'a', label: '(a) the key' }, { v: 'b', label: '(b) the crayon' }, { v: 'c', label: '(c) the screw' }],
  ask: (k) => `Example 4(${k}): how long is ${OB[k].name}?`,
  make(stage, k, ex) {
    const W = ex.W, H = 440, ox = (W - 900) / 2, svg = stageSvg(stage, W, H), d = OB[k], s = d.s, w = Math.floor(s / 16), r = s - 16 * w;
    const R = drawRuler(svg, { x: ox + 40, y: 96, a: 0, b: 6, ppi: 136, hh: 84, font: 19 });
    const ob = objBar(svg, R, d.x1, s / 16, d.name.slice(2), 40); hide(ob);
    const rs = hide(ring(svg, R, d.x1, d.x1 ? RED : GRN));
    const z = zoomInch(svg, R, w, { x: ox + 90, y: 276, ppi: 720, hh: 110, colour: true }); hide(z.g);
    markArrow(z.g, z.Z.X(s / 16), 276, '', '#5d6675', 36);
    const hops = hopsAt(svg, z.Z, 16 * w, r, 272);
    const fl = hide(lab(stage, `${w} and ${T(simpT(r))}`, z.Z.X(s / 16) + 130, 236, 190, 46, 'u3l3-card'));
    const len = s - 16 * d.x1;
    const res = hide(add(stage, box(cbox('u3l3-res', d.x1 ? `${T(`${mixT(s)}-1=${mixT(len)}`)} in` : `The ${d.name.slice(2)} is ${T(inT(s))} long`), 380, 46), ox + 480, 392));
    const steps = [
      { cap: d.x1 ? 'The screw starts at the <b>1 in</b> line, <b>not</b> at 0. Careful!' : `The ${d.name.slice(2)}’s left end lines up with the <b>0 line</b>. Good.`, run: async (c) => { await c.anim(ob, [{ opacity: 0, transform: 'translateX(-60px)' }, { opacity: 1, transform: 'none' }], 600); rs.style.opacity = 1; await c.pop(rs); } },
      { cap: `Its right end is past <b>${w}</b>. Zoom in and count: <b>${r}</b> spaces, so ${T(simpT(r))}.`, run: async (c) => { await c.fadeIn(z.g, 450); await showSeq(c, hops, 110); await c.pop(fl); } }
    ];
    if (!d.x1) steps.push({ cap: `It ends at ${T(inT(s))} and starts at 0, so the ${d.name.slice(2)} is <b>${T(inT(s))}</b> long.`, run: (c) => c.pop(res) });
    else {
      const wh = []; for (let i = 1; i < w; i++) { const g = svgEl('g', {}, svg), xa = R.X(i), xb = R.X(i + 1); const yb = R.y + R.hh + 4; svgEl('path', { d: `M${xa + 3} ${yb} Q${(xa + xb) / 2} ${yb + 36} ${xb - 3} ${yb}`, fill: 'none', stroke: BLU, 'stroke-width': 3 }, g); const t = svgEl('text', { x: (xa + xb) / 2, y: yb + 42, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 800, fill: BLU }, g); t.textContent = `${i}`; g.style.opacity = 0; wh.push(g); }
      steps.push({ cap: `It ends at ${T(inT(s))}. From 1 to ${w} is <b>${w - 1} whole inches</b>…`, run: async (c) => { await c.anim(z.g, [{ opacity: 0.25 }], 300); for (const hh of hops) hh.style.opacity = 0.25; fl.style.opacity = 0.25; await showSeq(c, wh, 300); } });
      steps.push({ cap: `…plus ${T(fracT(r, 16))} more: <b>${T(inT(len))}</b>. Or take away the start: ${T(`${mixT(s)}-1=${mixT(len)}`)}.`, run: (c) => c.pop(res) });
    }
    return steps;
  }
};

/* ======================================================================================
 * 4. Nearest 1/16 and nearest 1/8 (Example 5)
 * ====================================================================================== */
const NR = { P: 2.30, Q: 2.83 };
const nearest = {
  title: 'Nearest sixteenth, nearest eighth',
  height: 420,
  minW: 900,
  choices: [{ sep: 'Example 5 check:' }, { v: 'P', label: 'Arrow P' }, { v: 'Q', label: 'Arrow Q' }],
  ask: (k) => `Example 5: measure arrow <b>${k}</b> to the nearest ${T('\\tfrac1{16}')} in and to the nearest ${T('\\tfrac18')} in.`,
  make(stage, k, ex) {
    const W = ex.W, H = 420, ox = (W - 900) / 2, svg = stageSvg(stage, W, H), v = NR[k];
    const R = drawRuler(svg, { x: ox + 70, y: 92, a: 2, b: 3, ppi: 760, hh: 180, font: 24, pad: 22, tw: 1.3 });
    const arr = hide(markArrow(svg, R.X(v), 92, k, RED, 48));
    const f16 = v * 16, lo16 = Math.floor(f16), hi16 = lo16 + 1, n16 = Math.round(f16);
    const f8 = v * 8, lo8 = Math.floor(f8), hi8 = lo8 + 1, n8 = Math.round(f8);
    const hl = (kk) => svgEl('line', { x1: R.X(kk / 16), x2: R.X(kk / 16), y1: 92, y2: 92 + R.L * TH[TIER(kk)], stroke: AMB, 'stroke-width': 6, opacity: 0 }, svg);
    const gaps = (kLo, kHi, kN, y) => {
      const g = svgEl('g', {}, svg), xv = R.X(v);
      [[kLo, kLo === kN], [kHi, kHi === kN]].forEach(([kk, near]) => { const xx = R.X(kk / 16); svgEl('path', { d: `M${xx} ${y - 8} V${y + 8} M${xx} ${y} H${xv}`, stroke: near ? GRN : RED, 'stroke-width': 5, fill: 'none' }, g); });
      svgEl('line', { x1: xv, x2: xv, y1: y - 10, y2: y + 10, stroke: '#3a4254', 'stroke-width': 3 }, g);
      g.style.opacity = 0; return g;
    };
    const h1 = [hl(lo16), hl(hi16)], g1 = gaps(lo16, hi16, n16, 300);
    const h2 = [hl(lo8 * 2), hl(hi8 * 2)], g2 = gaps(lo8 * 2, hi8 * 2, n8 * 2, 330);
    const r1 = hide(add(stage, box(cbox('u3l3-res', `nearest ${T('\\tfrac1{16}')}: ${T(inT(n16))}`), 270, 48), ox + 40, 356));
    const ans8 = `2\\tfrac{${n8 - 16}}{8}` + (gcd(n8 - 16, 8) > 1 ? `=${mixT(n8 * 2)}` : '');
    const r2 = hide(add(stage, box(cbox('u3l3-res', `nearest ${T('\\tfrac18')}: ${T(mixT(n8 * 2) + '\\text{ in}')}`), 270, 48), ox + 590, 356));
    const lt = (kk) => T(`2\\tfrac{${kk - 32}}{16}`), l8 = (kk) => T(`2\\tfrac{${kk - 16}}{8}`);
    return [
      { cap: `Arrow ${k} falls <b>between</b> two lines: ${lt(lo16)} and ${lt(hi16)}.`, run: async (c) => { await c.pop(arr); await Promise.all(h1.map((e) => op(c, e, 1))); } },
      { cap: `<b>Nearest ${T('\\tfrac1{16}')}:</b> which line is closer? The <b style="color:${GRN}">green</b> gap is shorter.`, run: (c) => op(c, g1, 1, 500) },
      { cap: `So ${k} is about <b>${T(inT(n16))}</b> to the nearest ${T('\\tfrac1{16}')} in.`, run: (c) => c.pop(r1) },
      { cap: `<b>Nearest ${T('\\tfrac18')}:</b> skip the shortest (sixteenth) lines.`, run: async (c) => { await Promise.all([...h1, g1].map((e) => op(c, e, 0, 250))); await Promise.all(R.tiers[4].map((e) => op(c, e, 0.12, 500))); } },
      { cap: `Now ${k} is between ${l8(lo8)} and ${l8(hi8)}. The <b style="color:${GRN}">green</b> gap is shorter.`, run: async (c) => { await Promise.all(h2.map((e) => op(c, e, 1))); await op(c, g2, 1, 500); } },
      { cap: `So ${k} is about ${T(ans8)} in to the nearest ${T('\\tfrac18')} in.`, run: (c) => c.pop(r2) }
    ];
  }
};

/* ======================================================================================
 * 5a. Why is the hook loose? (Full notes)
 * ====================================================================================== */
const hook = {
  title: 'The loose hook',
  height: 400,
  minW: 900,
  ask: 'The hook on a tape measure wiggles. Is the tape broken?',
  make(stage, v, ex) {
    const W = ex.W, H = 400, ox = (W - 900) / 2, svg = stageSvg(stage, W, H), t = 18, SC = 1.17;
    const top = svgEl('g', { transform: `translate(${ox} 0) scale(${SC})` }, svg);
    const scene = (x0, wall) => {
      const g = svgEl('g', {}, top), E = x0 + 90;
      const tt = svgEl('text', { x: x0 + 170, y: 40, 'text-anchor': 'middle', 'font-size': 21, 'font-weight': 800, fill: '#3a4254' }, g); tt.textContent = wall ? 'Pushed against a wall' : 'Hooked over the end of a board';
      if (wall) { svgEl('rect', { x: E - 50, y: 70, width: 50, height: 250, fill: '#c9ced8', stroke: '#5d6675', 'stroke-width': 2.5 }, g); for (let i = 0; i < 9; i++) svgEl('line', { x1: E - 50, x2: E, y1: 90 + i * 26, y2: 70 + i * 26, stroke: '#9aa0ab', 'stroke-width': 1.5 }, g); svgEl('rect', { x: E, y: 230, width: 240, height: 60, fill: '#e9e1d2', stroke: '#9a8a6a', 'stroke-width': 2 }, g); }
      else svgEl('rect', { x: E, y: 182, width: 230, height: 64, fill: '#c89b62', stroke: '#7a5124', 'stroke-width': 2.5 }, g);
      // the tape: blade + hook in one group that slides; the hook slides on the blade by t
      const yB = wall ? 212 : 164;
      const tape = svgEl('g', {}, g), blade = svgEl('g', {}, tape);
      svgEl('rect', { x: t, y: yB, width: 236, height: 18, fill: '#f6d64a', stroke: '#3a4254', 'stroke-width': 2 }, blade);
      for (let i = 0; i <= 9; i++) svgEl('line', { x1: t + i * 25, x2: t + i * 25, y1: yB, y2: yB + (i % 4 ? 7 : 13), stroke: INK, 'stroke-width': i % 4 ? 1.6 : 2.6 }, blade);
      const zero = svgEl('g', {}, blade); svgEl('line', { x1: t, x2: t, y1: yB - 34, y2: yB + 60, stroke: RED, 'stroke-width': 2.5, 'stroke-dasharray': '6 4' }, zero);
      const zt = svgEl('text', { x: t - 8, y: yB - 40, 'text-anchor': 'start', 'font-size': 17, 'font-weight': 800, fill: RED }, zero); zt.textContent = 'the tape counts from here';
      const hk = svgEl('rect', { x: 0, y: yB - 4, width: t, height: wall ? 22 : 56, fill: '#8d95a3', stroke: '#3a4254', 'stroke-width': 2 }, tape);
      return { g, E, blade, hk, zero, yB };
    };
    const A = scene(10, false), B = scene(400, true);
    // A: the hook's inside face touches the board end E; the blade starts pushed in (counts from E - t)
    const setA = (p) => { A.hk.setAttribute('x', A.E - t); A.blade.setAttribute('transform', `translate(${A.E - 2 * t + p * t} 0)`); };
    // B: the hook's outside face touches the wall E; the blade starts pulled out (counts from E + t)
    const setB = (p) => { B.hk.setAttribute('x', B.E); B.blade.setAttribute('transform', `translate(${B.E - p * t} 0)`); };
    setA(0); setB(0); hide(B.g);
    const okA = hide(stamp(stage, 'right', { ok: true, x: ox + (A.E + 110) * SC, y: 300, rotate: -6 })), okB = hide(stamp(stage, 'right', { ok: true, x: ox + (B.E + 130) * SC, y: 312, rotate: -6 }));
    const res = hide(add(stage, box(cbox('u3l3-res', 'The hook slides by its own thickness. Both readings are right!'), 760, 46), ox + 70, 350));
    return [
      { cap: 'The hook is <b>over the end</b> of a board. Pull the tape: the hook slides <b>out</b> a little.', run: (c) => tween(c, 900, (p) => setA(p)) },
      { cap: 'Now the tape counts from the <b>inside</b> of the hook: exactly at the end of the board.', run: async (c) => { await pulse(c, A.zero, 1.05); okA.style.opacity = 1; await stampIn(c, okA); } },
      { cap: 'Now <b>push</b> the hook <b>against a wall</b>. The hook slides <b>in</b> a little.', run: async (c) => { await c.fadeIn(B.g); await tween(c, 900, (p) => setB(p)); } },
      { cap: 'Now the tape counts from the <b>outside</b> of the hook: exactly at the wall.', run: async (c) => { okB.style.opacity = 1; await stampIn(c, okB); } },
      { cap: 'The hook moves by its <b>own thickness</b>, so both ways measure right. Never squeeze a loose hook “tight”.', run: (c) => c.pop(res) }
    ];
  }
};

/* ======================================================================================
 * 5b. A tape in feet and inches (Example 6)
 * ====================================================================================== */
const EX6 = { A: 364, B: 410, C: 435 };
const tapeFtIn = {
  title: 'Read a tape in feet and inches',
  height: 420,
  minW: 900,
  choices: [{ sep: 'Example 6 check:' }, { v: 'A', label: 'Arrow A' }, { v: 'B', label: 'Arrow B' }, { v: 'C', label: 'Arrow C' }],
  ask: (k) => `Example 6: read arrow <b>${k}</b> in inches, then in feet and inches.`,
  make(stage, k, ex) {
    const W = ex.W, H = 420, ox = (W - 900) / 2, svg = stageSvg(stage, W, H), s = EX6[k], w = Math.floor(s / 16), r = s - 16 * w;
    const R = drawRuler(svg, { x: ox + 30, y: 62, a: 21.5, b: 28.5, ppi: 120, hh: 96, tape: true, font: 20, pad: 0 });
    Object.entries(EX6).forEach(([kk, ss]) => { if (kk !== k) { const g = markArrow(svg, R.X(ss / 16), 62, kk, '#9aa0ab', 30); g.style.opacity = 0.55; } });
    const arr = hide(markArrow(svg, R.X(s / 16), 62, k, RED, 40));
    const rg = hide(ring(svg, R, w));
    const z = zoomInch(svg, R, w, { x: ox + 90, y: 240, ppi: 720, hh: 110, tape: true }); hide(z.g);
    markArrow(z.g, z.Z.X(s / 16), 240, '', RED, 36);
    const hops = hopsAt(svg, z.Z, 16 * w, r, 236);
    const inch = hide(add(stage, box(cbox('u3l3-res', `${k} = ${T(inT(s))}`), 240, 50), ox + 30, 362));
    const ft = Math.floor(s / 192), tagIn = 12 * ft, past = s - 192 * ft;
    const passed = tagIn >= 22, tag24 = R.tags[24];
    // a bracket from the foot tag (or the left edge) to the arrow
    const bx0 = passed ? R.X(tagIn) : R.X(21.5), bx1 = R.X(s / 16), by = 196;
    const br = svgEl('g', {}, svg);
    svgEl('path', { d: `M${bx0} ${by - 10} V${by} H${bx1} V${by - 10}`, stroke: '#6e4a1c', 'stroke-width': 3.5, fill: 'none' }, br);
    if (!passed) { svgEl('path', { d: `M${bx0 + 12} ${by + 8} L${bx0} ${by} L${bx0 + 12} ${by - 8}`, stroke: '#6e4a1c', 'stroke-width': 3.5, fill: 'none' }, br); }
    br.style.opacity = 0;
    const brl = hide(lab(stage, passed ? `${T(mixT(past))} in past ${ft}F` : `from 1F (12 in, off the left edge): ${T(`${mixT(s)}-12=${mixT(past)}`)} in`, passed ? (bx0 + bx1) / 2 : ox + 285, by + 28, passed ? 220 : 520, 34, 'u3l3-tag'));
    const tagMark = passed ? null : hide(lab(stage, '✗ 2F: not passed yet', R.X(24.4), R.y + R.hh + 16, 210, 28, 'u3l3-tag'));
    const res = hide(add(stage, box(cbox('u3l3-res', `${k} = ${T(inT(s))} = <b>${T(ftinT(s))}</b>`), 440, 50), ox + 320, 362));
    return [
      { cap: `Arrow <b>${k}</b>. First read the inches: the last number passed is <b>${w}</b>.`, run: async (c) => { await c.pop(arr); rg.style.opacity = 1; await c.pop(rg); await c.fadeIn(z.g, 450); } },
      { cap: `Count the spaces past ${w}: <b>${r}</b>. ${T(simpT(r))}, so ${k} = <b>${T(inT(s))}</b>.`, run: async (c) => { await showSeq(c, hops, 100); await c.pop(inch); } },
      { cap: passed ? `<b>Feet:</b> the last foot tag passed is <b>${ft}F</b> (${tagIn} in).` : '<b>Feet:</b> the 2F tag is <b>after</b> the arrow, so the last tag passed is <b>1F</b> (12 in).', run: async (c) => { await Promise.all([z.g, ...hops].map((e) => op(c, e, 0, 300))); await pulse(c, tag24, 1.25); if (tagMark) await c.fadeIn(tagMark); } },
      { cap: `<b>Inches:</b> how far past the tag? ${T(`${mixT(s)}-${tagIn}=${mixT(past)}`)} in. Less than 12, good.`, run: async (c) => { await op(c, br, 1, 500); await c.fadeIn(brl); } },
      { cap: `So ${k} = ${T(inT(s))} = <b>${T(ftinT(s))}</b>.`, run: (c) => c.pop(res) }
    ];
  }
};

/* ======================================================================================
 * 5c. Why a 2 by 4 is smaller (Full notes)
 * ====================================================================================== */
const twoByFour = {
  title: 'A 2 by 4, seen from the end',
  height: 400,
  minW: 900,
  ask: 'A “2 by 4” from the lumber store. Is it really 2 in by 4 in?',
  make(stage, v, ex) {
    const W = ex.W, H = 400, ox = (W - 900) / 2, svg = stageSvg(stage, W, H), u = 72, cx = ox + 230, cy = 190;
    const g = svgEl('g', {}, svg);
    const rect = svgEl('rect', { fill: '#d9a868', stroke: '#7a5124', 'stroke-width': 3, rx: 3 }, g);
    const rings = svgEl('g', {}, g); for (let i = 1; i <= 4; i++) svgEl('path', { d: `M${cx - 70} ${cy + 150 - i * 40} Q${cx} ${cy + 120 - i * 46} ${cx + 70} ${cy + 150 - i * 40}`, stroke: '#a8743a', 'stroke-width': 2, fill: 'none', opacity: 0.7 }, rings);
    const clip = svgEl('clipPath', { id: 'u3l3-2x4c' }, svg); const cr = svgEl('rect', {}, clip); rings.setAttribute('clip-path', 'url(#u3l3-2x4c)');
    const set = (wi, hi) => { const a = { x: cx - wi * u / 2, y: cy - hi * u / 2, width: wi * u, height: hi * u }; Object.entries(a).forEach(([kk, vv]) => { rect.setAttribute(kk, vv); cr.setAttribute(kk, vv); }); };
    set(2, 4);
    svgEl('rect', { x: cx - u, y: cy - 2 * u, width: 2 * u, height: 4 * u, fill: 'none', stroke: '#9aa0ab', 'stroke-width': 2, 'stroke-dasharray': '7 5' }, svg);
    const dW = lab(stage, '2 in', cx, cy + 2 * u + 24, 120, 36, 'u3l3-res'), dH = lab(stage, '4 in', cx - 1 * u - 60, cy, 90, 36, 'u3l3-res');
    const dW2 = hide(lab(stage, T("1\\tfrac12''"), cx, cy + 2 * u + 24, 120, 44, 'u3l3-res')), dH2 = hide(lab(stage, T("3\\tfrac12''"), cx - 1 * u - 64, cy, 100, 44, 'u3l3-res'));
    const dust = []; for (let i = 0; i < 14; i++) { const d = svgEl('circle', { cx: cx + (i % 2 ? 1 : -1) * (70 + (i * 13) % 50), cy: cy - 140 + i * 20, r: 3 + (i % 3), fill: '#e8c48f' }, svg); d.style.opacity = 0; dust.push(d); }
    const card = hide(add(stage, box(cbox('u3l3-card', `<div><b>Name vs real size</b><br>2 by 4 → ${T("1\\tfrac12''\\times3\\tfrac12''")}<br>2 by 6 → ${T("1\\tfrac12''\\times5\\tfrac12''")}</div>`), 380, 130), ox + 470, 110));
    return [
      { cap: 'A “2 by 4” starts out cut from a log at about <b>2 in by 4 in</b>. This is its end.', run: (c) => pulse(c, g, 1.03) },
      { cap: 'The wood <b>dries and shrinks</b>, then it is <b>planed smooth</b> on all four sides.', run: async (c) => { await Promise.all(dust.map((d, i) => c.anim(d, [{ opacity: 0, transform: 'translateY(0)' }, { opacity: 1, offset: 0.3 }, { opacity: 0, transform: 'translateY(60px)' }], 1100, { delay: i * 40 }))); await tween(c, 900, (p) => set(lerp(2, 1.5, p), lerp(4, 3.5, p))); } },
      { cap: `What you buy is really ${T("1\\tfrac12''")} by ${T("3\\tfrac12''")}. Builders still call it a “2 by 4”.`, run: async (c) => { await Promise.all([op(c, dW, 0, 200), op(c, dH, 0, 200)]); await c.pop(dW2); await c.pop(dH2); } },
      { cap: 'The same goes for other boards. When a plan needs the real size, <b>measure</b>!', run: (c) => c.pop(card) }
    ];
  }
};

/* ======================================================================================
 * 5d. Put sizes in order (Example 7(b) and (c))
 * ====================================================================================== */
const order = {
  title: 'Line them up',
  height: 420,
  minW: 900,
  choices: [{ sep: 'Example 7 check:' }, { v: 'b', label: '(b) Volleyball players' }, { v: 'c', label: '(c) Wrenches' }],
  value: 'c',
  ask: (v) => (v === 'b' ? 'Example 7(b): order the players from tallest to shortest.' : `Example 7(c): order the wrenches from smallest to largest. The ${T("\\tfrac9{16}''")} is too small: which is next?`),
  make(stage, v, ex) {
    const W = ex.W, H = 420, ox = (W - 900) / 2;
    return v === 'b' ? orderPlayers(stage, W, H, ox) : orderWrenches(stage, W, H, ox);
  }
};
function orderWrenches(stage, W, H, ox) {
  const svg = stageSvg(stage, W, H);
  const WR = [[8, '\\tfrac12'], [7, '\\tfrac7{16}'], [10, '\\tfrac58'], [9, '\\tfrac9{16}'], [12, '\\tfrac34']];
  const R = drawRuler(svg, { x: ox + 70, y: 258, a: 0, b: 1, ppi: 760, hh: 120, font: 22, pad: 20 });
  const cardX = (i) => ox + 40 + i * 170, CY = 18, CW = 130;
  const sorted = WR.map((w, i) => [w[0], i]).sort((a, b) => a[0] - b[0]).map((p) => p[1]);
  const cards = WR.map(([n, t], i) => add(stage, box(cbox('u3l3-card', T(t + "''")), CW, 60), cardX(i), CY));
  const sub = WR.map(([n], i) => hide(lab(stage, `= ${T(`\\tfrac{${n}}{16}`)}`, cardX(i) + CW / 2, CY + 88, 110, 40, 'u3l3-tag')));
  const lines = WR.map(([n]) => { const l = svgEl('line', { stroke: '#9aa0ab', 'stroke-width': 2.2, 'stroke-dasharray': '5 4' }, svg); l.style.opacity = 0; return l; });
  const arrows = WR.map(([n]) => hide(markArrow(svg, R.X(n / 16), 258, '', '#6e4a1c', 30)));
  const pos = WR.map((w, i) => i);   // slot of each card
  const setLine = (i, slot) => { const l = lines[i]; l.setAttribute('x1', cardX(slot) + CW / 2); l.setAttribute('y1', CY + 110); l.setAttribute('x2', R.X(WR[i][0] / 16)); l.setAttribute('y2', 222); };
  WR.forEach((w, i) => setLine(i, i));
  const bad = hide(stamp(stage, 'too small', { ok: false, size: 'sm', x: 0, y: 0, rotate: -8 })), good = hide(stamp(stage, 'next!', { ok: true, size: 'sm', x: 0, y: 0, rotate: -8 }));
  return [
    { cap: 'The wrenches have different bottoms. Change them all to <b>sixteenths</b>.', run: async (c) => { for (const e of sub) await c.pop(e, 260); } },
    { cap: 'Put each size on one inch of a ruler. Further right means bigger.', run: async (c) => { for (let i = 0; i < 5; i++) { await c.pop(arrows[i], 220); await op(c, lines[i], 1, 200); } } },
    { cap: `Slide them into order: ${T("\\tfrac7{16}'',\\ \\tfrac12'',\\ \\tfrac9{16}'',\\ \\tfrac58'',\\ \\tfrac34''")}.`,
      run: async (c) => {
        const from = pos.slice(), to = []; sorted.forEach((ci, slot) => { to[ci] = slot; });
        await tween(c, 1000, (p) => { WR.forEach((w, i) => { const x = lerp(cardX(from[i]), cardX(to[i]), p); cards[i].style.left = x + 'px'; sub[i].style.left = (x + CW / 2 - 55) + 'px'; lines[i].setAttribute('x1', x + CW / 2); }); });
        WR.forEach((w, i) => { pos[i] = to[i]; });
      } },
    { cap: `The ${T("\\tfrac9{16}''")} is too small. The next size up is the <b>${T("\\tfrac58''")}</b> wrench.`,
      run: async (c) => {
        const i9 = 3, i58 = 2, sl9 = sorted.indexOf(i9), sl58 = sorted.indexOf(i58);
        bad.style.left = (cardX(sl9) + CW / 2) + 'px'; bad.style.top = '34px'; good.style.left = (cardX(sl58) + CW / 2) + 'px'; good.style.top = '34px';
        bad.style.opacity = 1; await stampIn(c, bad); good.style.opacity = 1; await stampIn(c, good);
      } }
  ];
}
function orderPlayers(stage, W, H, ox) {
  const svg = stageSvg(stage, W, H), floor = 372, k = 4.2;
  const P = [['Kenji', 71, "5'\\,11''"], ['Ruth', 74.5, "6'\\,2\\tfrac12''"], ['Marc', 72, "6'\\,0''"], ['Ines', 69.75, "5'\\,9\\tfrac34''"]];
  svgEl('line', { x1: ox + 20, x2: ox + 880, y1: floor, y2: floor, stroke: '#3a4254', 'stroke-width': 3 }, svg);
  const six = svgEl('g', {}, svg); svgEl('line', { x1: ox + 20, x2: ox + 880, y1: floor - 72 * k, y2: floor - 72 * k, stroke: BLU, 'stroke-width': 2.5, 'stroke-dasharray': '8 6' }, six);
  const st = svgEl('text', { x: ox + 24, y: floor - 72 * k - 8, 'font-size': 17, 'font-weight': 800, fill: BLU }, six); st.textContent = '6 ft'; six.style.opacity = 0;
  const slotX = (i) => ox + 90 + i * 200, BW = 120;
  const bars = P.map(([n, hIn, t], i) => {
    const hh = hIn * k, el = add(stage, box(h('div', 'u3l3-c', ''), BW, hh), slotX(i), floor - hh);
    el.style.cssText += `;background:#e7d3b0;border:3px solid #9a6a24;border-radius:46px 46px 6px 6px;flex-direction:column;justify-content:flex-start;padding-top:56px;box-sizing:border-box`;
    el.innerHTML = `<div class="u3l3-person" style="font-size:20px">${n}</div><div style="font-size:21px;margin-top:6px">${T(t)}</div>`;
    return el;
  });
  const order = [1, 2, 0, 3];
  const res = hide(add(stage, box(cbox('u3l3-res', 'Ruth, Marc, Kenji, Ines'), 340, 46), ox + 280, 4));
  const tint = (i, col) => { bars[i].style.borderColor = col; };
  return [
    { cap: 'Compare the <b>feet</b> first. Ruth and Marc are 6 ft and something; Kenji and Ines are only 5 ft and something.', run: async (c) => { await op(c, six, 1, 400); [1, 2].forEach((i) => tint(i, BLU)); [0, 3].forEach((i) => tint(i, '#e8a01e')); await Promise.all(bars.map((b) => pulse(c, b, 1.04))); } },
    { cap: `Same feet? Compare the <b>inches</b>. 6 ft: Ruth (${T('2\\tfrac12')} in) beats Marc (0 in).`, run: (c) => pulse(c, bars[1], 1.08) },
    { cap: `5 ft: Kenji (11 in) beats Ines (${T('9\\tfrac34')} in).`, run: (c) => pulse(c, bars[0], 1.08) },
    { cap: 'Tallest to shortest: <b>Ruth, Marc, Kenji, Ines</b>.', run: async (c) => { await tween(c, 1000, (p) => { order.forEach((pi, slot) => { bars[pi].style.left = lerp(slotX(pi), slotX(slot), p) + 'px'; }); }); await c.pop(res); } }
  ];
}

mountExplainers({ units, split, simplify, readRuler, objects, nearest, hook, tapeFtIn, twoByFour, order });

/* ======================================================================================
 * Hands-on: a ruler (Section 3) and a tape measure (Section 5) you drag and read.
 * ====================================================================================== */
function tapeTool(host, o) {
  if (!host) return;
  const { a = 0, b = 12, view = 4, tape = false, ftin = false, free = false } = o;
  host.innerHTML = '';
  const MW = Math.max(600, (host.clientWidth || 990) - 36), ppi = MW / view, MH = 176, OVH = 44;
  let s = o.start ?? 37, v0 = Math.max(a - 0.25, Math.min(b + 0.25 - view, s / 16 - view / 2)), hid = false, colour = false, snap = true, m = s / 16;
  // overview strip
  const ov = h('div', 'u3l3-ov'); ov.setAttribute('data-tap', ''); host.appendChild(ov);
  const os = svgEl('svg', { width: MW, height: OVH, viewBox: `0 0 ${MW} ${OVH}` }, ov), oppi = (MW - 20) / (b - a), OX = (inch) => 10 + (inch - a) * oppi;
  svgEl('rect', { x: 4, y: 6, width: MW - 8, height: 30, rx: 4, fill: tape ? '#f6d64a' : '#fff', stroke: '#3a4254', 'stroke-width': 1.6 }, os);
  for (let i = a; i <= b; i++) { svgEl('line', { x1: OX(i), x2: OX(i), y1: 6, y2: i % 12 === 0 && tape ? 30 : 18, stroke: INK, 'stroke-width': 1.4 }, os); if ((b - a <= 24) || i % 6 === 0) { const t = svgEl('text', { x: OX(i), y: 32, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, fill: tape && i % 16 === 0 && i ? '#b3261e' : INK }, os); t.textContent = i; } }
  const win = svgEl('rect', { y: 2, height: 38, rx: 5, fill: 'rgba(31,91,214,.12)', stroke: BLU, 'stroke-width': 2.5 }, os);
  const omark = svgEl('line', { y1: 0, y2: 42, stroke: RED, 'stroke-width': 3 }, os);
  // main blade
  const main = h('div', 'u3l3-main'); main.setAttribute('data-tap', ''); host.appendChild(main);
  const ms = svgEl('svg', { width: MW, height: MH, viewBox: `0 0 ${MW} ${MH}` }, main);
  const clip = svgEl('clipPath', { id: 'u3l3-clip-' + host.id }, ms); svgEl('rect', { x: 0, y: 0, width: MW, height: MH }, clip);
  const vg = svgEl('g', { 'clip-path': `url(#u3l3-clip-${host.id})` }, ms), pan = svgEl('g', {}, vg);
  const R = drawRuler(pan, { x: 0, y: 46, a, b, ppi, hh: 122, tape, font: 24, pad: 20, tw: 1.3 });
  const mk = svgEl('g', {}, vg);
  svgEl('line', { x1: 0, x2: 0, y1: 38, y2: 168, stroke: RED, 'stroke-width': 3 }, mk);
  svgEl('path', { d: 'M-13 6 H13 V22 L0 38 L-13 22 Z', fill: RED, stroke: '#7a1f16', 'stroke-width': 2 }, mk);
  // read-out row
  const row = h('div', 'u3l3-trow'); host.appendChild(row);
  const read = h('div', 'u3l3-read'); row.appendChild(read);
  const big = h('div', 'u3l3-big'), how = h('div', 'u3l3-how'); read.append(big, how);
  const btns = h('div', 'u3l3-tbtns'); row.appendChild(btns);
  const B = (label, fn, toggle) => { const e = h('button', 'pill small', label); e.type = 'button'; e.onclick = fn; if (toggle) e.setAttribute('aria-pressed', 'false'); btns.appendChild(e); return e; };
  const nud = h('div', 'u3l3-nudge'); host.appendChild(nud);
  nud.appendChild(h('span', 'u3l3-nl', 'Move the arrow:'));
  [['− 1 in', -16], ['− ¹⁄₁₆', -1], ['+ ¹⁄₁₆', 1], ['+ 1 in', 16]].forEach(([l, d]) => { const e = h('button', 'pill small', l); e.type = 'button'; e.onclick = () => { snapNow(); setS(s + d, true); }; nud.appendChild(e); });
  const clampS = (x) => Math.max(Math.round(a * 16), Math.min(Math.round(b * 16), x));
  const snapNow = () => { if (!snap) { s = clampS(Math.round(m * 16)); m = s / 16; } };
  const render = () => {
    pan.setAttribute('transform', `translate(${-(v0 - a) * ppi + 0} 0)`);
    mk.setAttribute('transform', `translate(${(m - v0) * ppi} 0)`);
    win.setAttribute('x', OX(v0)); win.setAttribute('width', view * oppi); omark.setAttribute('x1', OX(m)); omark.setAttribute('x2', OX(m));
    const q = '<span class="u3l3-q">?</span>';
    if (snap) {
      const w = Math.floor(s / 16), r = s - 16 * w;
      big.innerHTML = hid ? q : T(inT(s));
      let t = hid ? 'Read it: the last number passed, then count the sixteenths past it.' : r ? `${w} whole inches, then ${r} space${r > 1 ? 's' : ''}: ${T(simpT(r))}` : `exactly on the ${w} line`;
      if (ftin && !hid) t += s >= 192 ? `<br><b class="u3l3-ftin">= ${T(ftinT(s))}</b> &nbsp;(${T(mixT(s - 192 * Math.floor(s / 192)))} in past ${Math.floor(s / 192)}F)` : '<br>less than 1 ft (before the 1F tag)';
      how.innerHTML = t;
    } else {
      const n16 = clampS(Math.round(m * 16)), n8 = clampS(Math.round(m * 8) * 2);
      big.innerHTML = hid ? q : `${T('\\approx' + mixT(n16))}`;
      how.innerHTML = hid ? 'Between two lines: which line is closest?' : `nearest ${T('\\tfrac1{16}')}: <b>${T(inT(n16))}</b><br>nearest ${T('\\tfrac18')}: <b>${T(inT(n8))}</b>${ftin ? ` &nbsp;·&nbsp; ${T(ftinT(n16))}` : ''}`;
    }
  };
  const keepIn = () => { const x = m - v0; if (x < view * 0.06) v0 = m - view * 0.06; if (x > view * 0.94) v0 = m - view * 0.94; v0 = Math.max(a - 0.25, Math.min(b + 0.25 - view, v0)); };
  const setS = (ns, centre) => { s = clampS(ns); m = s / 16; if (centre && (m < v0 + 0.2 || m > v0 + view - 0.2)) v0 = Math.max(a - 0.25, Math.min(b + 0.25 - view, m - view / 2)); keepIn(); render(); };
  const setM = (nm) => { nm = Math.max(a, Math.min(b, nm)); if (snap) { s = clampS(Math.round(nm * 16)); m = s / 16; } else { m = nm; s = clampS(Math.round(m * 16)); } render(); };
  // dragging on the blade: the arrow follows; near an edge the tape scrolls
  const inchAt = (e) => { const rc = ms.getBoundingClientRect(); return v0 + (e.clientX - rc.left) * (MW / rc.width) / ppi; };
  let drag = false, lastE = null, raf = 0;
  const edge = () => { if (!drag || !lastE) return; const rc = ms.getBoundingClientRect(), x = (lastE.clientX - rc.left) * (MW / rc.width); const d = x < 50 ? -1 : x > MW - 50 ? 1 : 0; if (d) { v0 = Math.max(a - 0.25, Math.min(b + 0.25 - view, v0 + d * 0.035)); setM(inchAt(lastE)); } raf = requestAnimationFrame(edge); };
  main.addEventListener('pointerdown', (e) => { drag = true; lastE = e; main.setPointerCapture(e.pointerId); setM(inchAt(e)); cancelAnimationFrame(raf); raf = requestAnimationFrame(edge); e.preventDefault(); });
  main.addEventListener('pointermove', (e) => { if (!drag) return; lastE = e; setM(inchAt(e)); });
  const end = () => { drag = false; cancelAnimationFrame(raf); };
  main.addEventListener('pointerup', end); main.addEventListener('pointercancel', end);
  // the overview: jump the window
  let odrag = false;
  const ovAt = (e) => { const rc = os.getBoundingClientRect(); const inch = a + ((e.clientX - rc.left) * (MW / rc.width) - 10) / oppi; v0 = Math.max(a - 0.25, Math.min(b + 0.25 - view, inch - view / 2)); if (m < v0 || m > v0 + view) setM(v0 + view / 2); else render(); };
  ov.addEventListener('pointerdown', (e) => { odrag = true; ov.setPointerCapture(e.pointerId); ovAt(e); e.preventDefault(); });
  ov.addEventListener('pointermove', (e) => { if (odrag) ovAt(e); });
  ov.addEventListener('pointerup', () => { odrag = false; }); ov.addEventListener('pointercancel', () => { odrag = false; });
  // buttons
  const bh = B('Hide the reading', () => { hid = !hid; bh.setAttribute('aria-pressed', String(hid)); bh.textContent = hid ? 'Show the reading' : 'Hide the reading'; render(); }, true);
  B('New length', () => { hid = true; bh.setAttribute('aria-pressed', 'true'); bh.textContent = 'Show the reading'; const lo = Math.round(a * 16) + 4, hi = Math.round(b * 16) - 4; let ns; do { ns = lo + Math.floor(Math.random() * (hi - lo)); } while (ns % 16 === 0); if (!snap) { m = ns / 16 + (Math.random() - 0.5) / 20; s = ns; v0 = Math.max(a - 0.25, Math.min(b + 0.25 - view, m - view / 2)); render(); } else setS(ns, true); });
  const bc = B('Colour the lines', () => { colour = !colour; bc.setAttribute('aria-pressed', String(colour)); R.tiers.forEach((tt, t) => tt.forEach((ln) => ln.setAttribute('stroke', colour ? TC[t] : INK))); }, true);
  if (free) { const bs = B('Stop on a line', () => { snap = !snap; bs.setAttribute('aria-pressed', String(snap)); if (snap) { s = clampS(Math.round(m * 16)); m = s / 16; } render(); }, true); bs.setAttribute('aria-pressed', 'true'); }
  render();
}
function tools() {
  tapeTool(document.getElementById('u3l3-ruler'), { a: 0, b: 12, view: 4, start: 37 });
  tapeTool(document.getElementById('u3l3-tape'), { a: 0, b: 72, view: 5, tape: true, ftin: true, free: true, start: 410 });
}
// draw once the cards have their width (the page lays out before this module runs, but be safe)
requestAnimationFrame(tools);

/* ======================================================================================
 * Static figures on the example cards (answers in red show with "Answer")
 * ====================================================================================== */
function fig(name, wdt, hgt, draw) {
  const host = document.querySelector(`.u3l3-fig[data-fig="${name}"]`); if (!host) return;
  host.style.width = wdt + 'px'; host.style.height = hgt + 'px';
  const svg = svgEl('svg', { width: wdt, height: hgt, viewBox: `0 0 ${wdt} ${hgt}` }, host);
  draw(svg, host);
}
function figures() {
  fig('ex2', 900, 220, (svg, host) => {
    const R = drawRuler(svg, { x: 40, y: 92, a: 0, b: 1, ppi: 820, hh: 120, font: 22, pad: 18, tw: 1.2 });
    for (let k = 1; k < 16; k++) {
      svgEl('rect', { x: R.X(k / 16) - 21, y: 18, width: 42, height: 60, rx: 4, fill: '#fff', stroke: k === 8 ? '#3a4254' : '#b9ad97', 'stroke-width': 1.8 }, svg);
      lab(host, T(fracT(k, 16).replace('tfrac', 'dfrac')), R.X(k / 16), 48, 42, 56, k === 8 ? '' : 'u3l3-fa');
    }
  });
  fig('ex3', 920, 160, (svg) => {
    const R = drawRuler(svg, { x: 20, y: 62, a: 0, b: 6, ppi: 146, hh: 92, font: 20 });
    Object.entries(EX3).forEach(([k, s]) => markArrow(svg, R.X(s / 16), 62, k, INK, 40));
  });
  fig('ex4a', 920, 200, (svg) => {
    const R = drawRuler(svg, { x: 20, y: 104, a: 0, b: 6, ppi: 146, hh: 92, font: 20 });
    objBar(svg, R, 0, 84 / 16, '(b) a crayon', 6); objBar(svg, R, 0, 38 / 16, '(a) a key', 54);
  });
  fig('ex4c', 920, 152, (svg) => {
    const R = drawRuler(svg, { x: 20, y: 56, a: 0, b: 6, ppi: 146, hh: 92, font: 20 });
    objBar(svg, R, 1, 74 / 16, '(c) a screw', 6);
  });
  fig('ex5', 480, 230, (svg) => {
    const R = drawRuler(svg, { x: 24, y: 62, a: 2, b: 3, ppi: 430, hh: 150, font: 22, pad: 16, tw: 1.1 });
    markArrow(svg, R.X(NR.P), 62, 'P', INK, 44); markArrow(svg, R.X(NR.Q), 62, 'Q', INK, 44);
  });
  fig('ex6', 920, 170, (svg) => {
    const R = drawRuler(svg, { x: 10, y: 62, a: 21.5, b: 28.5, ppi: 128, hh: 100, tape: true, font: 20, pad: 0 });
    Object.entries(EX6).forEach(([k, s]) => markArrow(svg, R.X(s / 16), 62, k, INK, 40));
  });
}
figures();

/* ======================================================================================
 * Math History: three barleycorns make an inch; shoe sizes go up a barleycorn at a time
 * ====================================================================================== */
function histAnim() {
  const svg = document.getElementById('u3l3-hist'); if (!svg) return;
  const NS = 'http://www.w3.org/2000/svg', mk = (t, a, p = svg) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); p.appendChild(e); return e; };
  mk('rect', { x: 0, y: 0, width: 600, height: 300, rx: 14, fill: '#fffaf1' });
  const cap = mk('text', { x: 300, y: 38, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 23, fill: '#4a2c14' });
  // one inch of ruler, 360 px long
  const X0 = 120, U = 360, Y = 200, rul = mk('g', {});
  mk('rect', { x: X0 - 14, y: Y, width: U + 28, height: 60, rx: 4, fill: '#fff', stroke: '#4a2c14', 'stroke-width': 2.5 }, rul);
  for (let k = 0; k <= 16; k++) { const t = TIER(k); mk('line', { x1: X0 + k / 16 * U, x2: X0 + k / 16 * U, y1: Y, y2: Y + 40 * TH[t], stroke: '#4a2c14', 'stroke-width': TW[t] }, rul); }
  [['0', X0], ['1 inch', X0 + U]].forEach(([s, x]) => { const t = mk('text', { x, y: Y + 56, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 17, 'font-weight': 700, fill: '#4a2c14' }, rul); t.textContent = s; });
  const grain = (cx) => { const g = mk('g', {}); mk('ellipse', { cx: 0, cy: 0, rx: 58, ry: 21, fill: '#d9a441', stroke: '#8a5a0a', 'stroke-width': 2.5 }, g); mk('path', { d: 'M-46 0 Q0 -8 46 0', stroke: '#b07a12', 'stroke-width': 2, fill: 'none' }, g); g.dataset.cx = cx; return g; };
  const grains = [0, 1, 2].map((i) => grain(X0 + U / 6 + i * U / 3));
  const lbl = mk('text', { x: 300, y: 130, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 30, 'font-weight': 700, fill: '#b07a12' });
  // the shoe (phase 2)
  const shoe = mk('g', {}); const sole = mk('path', { fill: '#7a4a26', stroke: '#4a2c14', 'stroke-width': 2.5 }, shoe); const sz = mk('text', { x: 300, y: 270, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 20, fill: '#4a2c14' }, shoe);
  const extra = mk('ellipse', { cy: 168, rx: 20, ry: 9, fill: '#d9a441', stroke: '#8a5a0a', 'stroke-width': 2 }, shoe);
  const shoePath = (L) => `M150 200 Q150 150 190 146 L${150 + L - 40} 150 Q${150 + L} 158 ${150 + L} 190 L${150 + L} 200 Z`;
  const clamp = (t) => Math.max(0, Math.min(1, t)), ease = (t) => t * t * (3 - 2 * t);
  const draw = (s) => {
    const p2 = s >= 6.2;
    cap.textContent = s < 3.4 ? '1324: three grains of barley…' : s < 6.2 ? '…laid end to end make one inch' : 'Each shoe size up: one more barleycorn';
    rul.style.opacity = p2 ? 0 : 1; shoe.style.opacity = p2 ? 1 : 0;
    grains.forEach((g, i) => { const t = ease(clamp((s - 0.4 - i * 0.9) / 0.9)), cx = +g.dataset.cx; g.setAttribute('transform', `translate(${cx} ${lerp(-40, Y - 24, t)}) rotate(${lerp(-40 + 30 * i, 0, t)})`); g.style.opacity = p2 ? 0 : t > 0 ? 1 : 0; });
    lbl.textContent = s >= 3.4 && !p2 ? '3 barleycorns = 1 inch' : '';
    if (p2) { const n = Math.min(2, Math.floor((s - 6.2) / 1.6)), f = ease(clamp(((s - 6.2) % 1.6) / 0.7)); const L = 260 + (n + (n < 2 ? f : 0)) * 40; sole.setAttribute('d', shoePath(Math.min(L, 340))); sz.textContent = `size ${7 + n + (n < 2 && f > 0.5 ? 1 : 0)}`; extra.setAttribute('cx', 150 + Math.min(L, 340) + 26); extra.style.opacity = n < 2 ? f : 0; }
  };
  let raf = 0;
  const play = () => {
    cancelAnimationFrame(raf);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { draw(5); return; }
    const t0 = performance.now(); const tick = (now) => { const s = (now - t0) / 1000; draw(Math.min(s, 11)); if (s < 11) raf = requestAnimationFrame(tick); }; raf = requestAnimationFrame(tick);
  };
  draw(5);
  svg.addEventListener('click', play);
  const btn = svg.closest('.hist-anim') && svg.closest('.hist-anim').querySelector('.hist-play'); if (btn) btn.addEventListener('click', play);
  let seen = false;
  new IntersectionObserver((es) => { es.forEach((e) => { if (e.isIntersecting && !seen) { seen = true; play(); } }); }, { threshold: 0.5 }).observe(svg);
}
histAnim();

/* ============ Stand Up Break! — simplest form, read a ruler, feet and inches ============ */
function rulerFig(w, s) {
  // a ruler piece from inch w to w + 2 (as an SVG string), with an arrow at s sixteenths
  const ppi = 170, x0 = 20, X = (i) => x0 + (i - w) * ppi, y = 48, hh = 80, L = hh * 0.6;
  let out = `<svg viewBox="0 0 ${2 * ppi + 40} 140" width="${2 * ppi + 40}" height="140" style="max-width:100%"><rect x="6" y="${y}" width="${2 * ppi + 28}" height="${hh}" rx="4" fill="#fff" stroke="#3a4254" stroke-width="2.5"/>`;
  for (let k = 16 * w; k <= 16 * (w + 2); k++) { const t = TIER(k), xx = X(k / 16); out += `<line x1="${xx}" x2="${xx}" y1="${y}" y2="${y + L * TH[t]}" stroke="#1c2230" stroke-width="${TW[t]}"/>`; }
  for (let i = w; i <= w + 2; i++) out += `<text x="${X(i)}" y="${y + L + 22}" text-anchor="middle" font-size="20" font-weight="800" fill="#1c2230">${i}</text>`;
  const xa = X(s / 16);
  out += `<line x1="${xa}" x2="${xa}" y1="6" y2="${y - 10}" stroke="#c93a33" stroke-width="3.2"/><path d="M${xa - 7} ${y - 13} L${xa + 7} ${y - 13} L${xa} ${y - 1} Z" fill="#c93a33"/></svg>`;
  return out;
}
standup('u3l3', {
  intro: 'Write every step. Count the sixteenths. Write the answer in simplest form, with the unit.',
  levels: {
    BEG: (r) => {
      const n = r.pick([2, 4, 6, 10, 12, 14]), g = gcd(n, 16);
      return { text: 'Write in simplest form.', q: `\\frac{${n}}{16}`, a: [`\\frac{${n}}{16}=\\frac{${n}\\div${g}}{16\\div${g}}`, `=\\frac{${n / g}}{${16 / g}}`] };
    },
    PRG: (r) => {
      const w = r.int(1, 7), off = r.int(1, 31); const s = 16 * w + (off === 16 ? 17 : off), ww = Math.floor(s / 16), rr = s - 16 * ww;
      return { text: 'Read the length at the arrow. Write it in simplest form.', q: '', fig: rulerFig(w, s), a: [`\\text{last number passed: }${ww}`, `${rr}\\text{ spaces: }${simpT(rr)}`, `${mixT(s)}\\text{ in}`] };
    },
    MAS: (r) => r.pick([
      () => {
        let s; do { s = r.int(13 * 16, 71 * 16); } while (s % 16 === 0 || s % 192 < 16 || (s % 16) % 2 === 1 && r.chance(0.5));
        const f = Math.floor(s / 192), past = s - 192 * f;
        return { text: `A tape measure shows <b>${T(inT(s))}</b>. Write it in feet and inches.`, q: '', a: [`\\text{last tag passed: }${f}\\text{F} = ${12 * f}\\text{ in}`, `${mixT(s)}-${12 * f}=${mixT(past)}`, ftinT(s)] };
      },
      () => {
        const st = r.int(1, 2), e = 16 * r.int(st + 2, 5) + r.pick([2, 3, 5, 6, 10, 11, 12, 13, 14]);
        const item = r.pick(['bolt', 'nail', 'pencil', 'hinge pin']);
        return { text: `A ${item} on a ruler starts at the <b>${st} in</b> line and ends at <b>${T(inT(e))}</b>. How long is it?`, q: '', a: [`${mixT(e)}-${st}=${mixT(e - 16 * st)}`, `\\text{The ${item} is }${inT(e - 16 * st)}\\text{ long.}`] };
      }
    ])()
  }
});
