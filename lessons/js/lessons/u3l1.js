/* Math 10-3 · Unit 3 · Lesson 1 — Fractions Refresher: Mixed Numbers (refresher, no outcome box).
 * Static figures: 2 3/4 as bars (Section 1), Example 1's bars and pies, the borrowing bars (Section 3).
 * Explainers (Class view unless marked Full):
 *   bars      (pieces drop into whole bars, or every piece of a picture is counted: improper ↔ mixed; Examples 1 and 3),
 *   convert   (divide → whole number and remainder; whole × bottom + top; Example 2),
 *   lcd       (Full: count by the bigger bottom to find a common denominator, then equivalent fractions),
 *   addBars   (two mixed numbers as bars: re-cut, wholes slide together, pieces pour together and regroup; Example 4),
 *   tape      (pipes, fabric and boards laid end to end on a tape measure with a zoomed-in reading; Examples 5, 7, 11),
 *   subBars   (bars with one whole broken into pieces to borrow, then pieces and wholes taken away; Example 6),
 *   flipTrap  (Full: "flip the fractions" vs regrouping, checked by adding back),
 *   multiply  (a three-station machine: improper fractions → multiply → back to a mixed number; Examples 8–11),
 *   areaWhy   (Full: why 2 1/2 × 2 1/2 is not 4 1/4 — the area of a square with the forgotten strips),
 *   estCheck  (estimate vs exact on a number line, the calculator screen, a verdict stamp; Examples 10 and 11).
 * Then the Stand Up Break.
 * Colours: first number amber, second number blue, taken-away pieces red, answers red, estimates blue. */
import { h, tex, add, stamp, stampIn, mountExplainers, pop, fadeIn, tween, svgEl, pulse, shake, anim, drawIn, arrowHead, COLORS } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const K = (src) => {
  try { return window.katex.renderToString('\\displaystyle ' + String(src), { throwOnError: false, strict: 'ignore', output: 'html' }); }
  catch (e) { return tex(src); }
};
const INK = COLORS.ink, RED = COLORS.red, BLUE = COLORS.blue, GRN = COLORS.green;
const FA = '#f2b84b', FA2 = '#f8dc9c', FB = '#9cc0f0', EDGE = '#6b5a3a', PAPER = '#fffdf8';
const hide = (el) => { el.style.opacity = 0; return el; };
const show = (c, el) => fadeIn(c, el, 320);
const lab = (host, x, y, html, cls = '') => { const d = h('div', 'u3l1-abs ' + cls, html); d.style.left = x + 'px'; d.style.top = y + 'px'; host.appendChild(d); return d; };
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const lcm = (a, b) => a / gcd(a, b) * b;
const easeIO = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const lin = (t) => t;
const PL = { 1: 'wholes', 2: 'halves', 3: 'thirds', 4: 'quarters', 5: 'fifths', 6: 'sixths', 8: 'eighths', 10: 'tenths', 12: 'twelfths', 16: 'sixteenths', 24: 'twenty-fourths' };
const pl = (d) => PL[d] || `pieces of size ${T(`\\tfrac1{${d}}`)}`;

/* ---- fractions as TeX ---- */
const fr = (n, d) => `\\tfrac{${n}}{${d}}`;
const mx = (w, n, d) => (n === 0 || d === 1 ? `${w + (d === 1 ? n : 0)}` : w ? `${w}${fr(n, d)}` : fr(n, d));
const mxD = (w, n, d) => (n === 0 ? `${w}` : w ? `${w}\\frac{${n}}{${d}}` : `\\frac{${n}}{${d}}`);
const imp = (o) => o.w * o.d + o.n;
const fromImp = (N, D) => ({ w: Math.floor(N / D), n: N % D, d: D });
const simp = (o) => { if (!o.n) return { w: o.w, n: 0, d: o.d }; const g = gcd(o.n, o.d); return { w: o.w, n: o.n / g, d: o.d / g }; };
const mxo = (o) => mx(o.w, o.n, o.d);
const A3 = (a) => ({ w: a[0], n: a[1], d: a[2] });
const digits = (v) => String(v).length;

/* ---- moving SVG things (all through tween, so Back / Start over / fast replay just work) ---- */
function moveRects(c, moves, ms = 650, stag = 50) {
  const st = moves.map((m) => ({ ...m, x0: +m.el.getAttribute('x'), y0: +m.el.getAttribute('y') }));
  const total = ms + stag * Math.max(0, st.length - 1);
  return tween(c, total, (t) => {
    const now = t * total;
    st.forEach((s, i) => { const p = easeIO(Math.min(1, Math.max(0, (now - i * stag) / ms))); s.el.setAttribute('x', s.x0 + (s.x - s.x0) * p); s.el.setAttribute('y', s.y0 + (s.y - s.y0) * p); if (s.op != null) s.el.setAttribute('opacity', 1 + (s.op - 1) * p); });
  }, lin);
}
function moveG(c, g, tx, ty, ms = 650) {
  const x0 = g._tx || 0, y0 = g._ty || 0;
  return tween(c, ms, (t) => { const x = x0 + (tx - x0) * t, y = y0 + (ty - y0) * t; g.setAttribute('transform', `translate(${x} ${y})`); g._tx = x; g._ty = y; });
}
function fadeAttr(c, els, to, ms = 400, stag = 0) {
  const list = [].concat(els), st = list.map((e) => +(e.getAttribute('opacity') ?? 1)), total = ms + stag * Math.max(0, list.length - 1);
  return tween(c, total, (t) => { const now = t * total; list.forEach((e, i) => { const p = Math.min(1, Math.max(0, (now - i * stag) / ms)); e.setAttribute('opacity', st[i] + (to - st[i]) * p); }); }, lin);
}
const moveEl = (c, el, x, y, ms = 650) => anim(c, el, [{ left: el.style.left, top: el.style.top }, { left: x + 'px', top: y + 'px' }], ms);

/* ---- a bar of d equal pieces, k of them shaded ---- */
function fillBar(svg, x, y, W, H, d, k, fill) {
  const g = svgEl('g', {}, svg), pw = W / d;
  for (let i = 0; i < d; i++) svgEl('rect', { x: x + i * pw, y, width: pw, height: H, fill: i < k ? fill : PAPER, stroke: EDGE, 'stroke-width': 1.3 }, g);
  svgEl('rect', { x, y, width: W, height: H, fill: 'none', stroke: INK, 'stroke-width': 3, rx: 2 }, g);
  return g;
}
function wedge(cx, cy, R, a0, a1) {
  const p = (a) => `${(cx + R * Math.sin(a)).toFixed(2)} ${(cy - R * Math.cos(a)).toFixed(2)}`;
  return `M${cx} ${cy} L${p(a0)} A${R} ${R} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${p(a1)} Z`;
}
function fillPie(svg, cx, cy, R, d, k, fill) {
  const g = svgEl('g', {}, svg);
  for (let i = 0; i < d; i++) svgEl('path', { d: wedge(cx, cy, R, i * 2 * Math.PI / d, (i + 1) * 2 * Math.PI / d), fill: i < k ? fill : PAPER, stroke: EDGE, 'stroke-width': 1.3 }, g);
  svgEl('circle', { cx, cy, r: R, fill: 'none', stroke: INK, 'stroke-width': 3 }, g);
  return g;
}

/* =============================== static figures =============================== */
function barsSVG(w, d, k, bw, bh, aria, fill = FA) {
  const gap = 14, nb = w + (k ? 1 : 0), Wt = nb * bw + (nb - 1) * gap + 8;
  const svg = svgEl('svg', { viewBox: `0 0 ${Wt} ${bh + 8}`, width: Wt, role: 'img', 'aria-label': aria });
  for (let b = 0; b < nb; b++) fillBar(svg, 4 + b * (bw + gap), 4, bw, bh, d, b < w ? d : k, fill);
  return svg;
}
function mountFigures() {
  const put = (id, el) => { const host = document.getElementById(id); if (host) host.appendChild(el); };
  put('u3l1-fig-intro', barsSVG(2, 4, 3, 150, 46, 'Two whole bars cut into quarters, all shaded, and a third bar with 3 of its 4 quarters shaded'));
  put('u3l1-fig-e1a', barsSVG(2, 5, 3, 120, 40, 'Two whole bars cut into fifths, all shaded, and a third bar with 3 of 5 fifths shaded'));
  const pie = svgEl('svg', { viewBox: '0 0 236 112', width: 236, role: 'img', 'aria-label': 'One whole circle cut into sixths, all shaded, and a second circle with 5 of 6 sixths shaded' });
  fillPie(pie, 56, 56, 52, 6, 6, FA); fillPie(pie, 178, 56, 52, 6, 5, FA); put('u3l1-fig-e1b', pie);
  // borrowing: 5 1/4 → 4 + 4/4 + 1/4
  const host = document.getElementById('u3l1-fig-borrow');
  if (host) {
    const row = (texs, w, broken, aria) => {
      const r = h('div', 'u3l1-brow'); r.innerHTML = `<div class="u3l1-blab">${K(texs)}</div>`;
      const bw = 104, gap = 12, nb = w + (broken ? 1 : 0) + 1, Wt = nb * bw + (nb - 1) * gap + 8;
      const svg = svgEl('svg', { viewBox: `0 0 ${Wt} 52`, width: Wt, role: 'img', 'aria-label': aria });
      for (let b = 0; b < w; b++) fillBar(svg, 4 + b * (bw + gap), 4, bw, 44, 1, 1, FA);
      if (broken) { const g = fillBar(svg, 4 + w * (bw + gap), 4, bw, 44, 4, 4, FA2); g.querySelector('rect:last-child').setAttribute('stroke', RED); }
      fillBar(svg, 4 + (w + (broken ? 1 : 0)) * (bw + gap), 4, bw, 44, 4, 1, broken ? FA2 : FA);
      r.appendChild(svg); return r;
    };
    host.append(row('5\\tfrac14', 5, false, 'Five whole bars and one bar with 1 of 4 quarters shaded'),
      row('4\\tfrac54', 4, true, 'Four whole bars, then one whole bar broken into 4 quarters, and the bar with 1 quarter: 4 and 5 quarters'));
  }
}

/* =============================== explainer: pieces and whole bars =============================== */
const BARS = {
  q11: { mode: 'pile', n: 11, d: 4 },
  q17: { mode: 'pile', n: 17, d: 5 },
  m423: { mode: 'count', w: 4, n: 2, d: 3 },
  e1a: { mode: 'count', w: 2, n: 3, d: 5, both: true },
  e1b: { mode: 'count', w: 1, n: 5, d: 6, both: true, pie: true },
  e3a: { mode: 'count', w: 3, n: 1, d: 2, cut: 4, cup: true },
  e3b: { mode: 'pile', n: 11, d: 3, cup: true }
};
const bars = {
  title: 'Pieces and whole bars',
  height: 330,
  minW: 940,
  capH: 92,
  choices: [{ v: 'q11', label: T('\\tfrac{11}4') }, { v: 'q17', label: T('\\tfrac{17}5') }, { v: 'm423', label: T('4\\tfrac23') },
    { sep: 'Example 1 check:' }, { v: 'e1a', label: '(a)' }, { v: 'e1b', label: '(b)' },
    { sep: 'Example 3:' }, { v: 'e3a', label: '(a) oats' }, { v: 'e3b', label: '(b) sugar' }],
  ask: (k) => ({
    q11: `Write ${T('\\tfrac{11}4')} as a mixed number.`, q17: `Write ${T('\\tfrac{17}5')} as a mixed number.`, m423: `Write ${T('4\\tfrac23')} as an improper fraction.`,
    e1a: 'Example 1(a): write the picture as a mixed number and as an improper fraction.', e1b: 'Example 1(b): write the picture as a mixed number and as an improper fraction.',
    e3a: `Example 3(a): a batch needs ${T('3\\tfrac12')} cups of oats. The cook uses a ${T('\\tfrac14')}-cup scoop. How many scoops is that?`,
    e3b: `Example 3(b): the cook adds 11 scoops of sugar with a ${T('\\tfrac13')}-cup scoop. How many cups is that, as a mixed number?`
  })[k],
  make(stage, k) {
    const D = BARS[k];
    const svg = svgEl('svg', { class: 'u3l1-abs', width: 940, height: 330 }); add(stage, svg, 0, 0);
    const L0 = svgEl('g', {}, svg), L1 = svgEl('g', {}, svg), L2 = svgEl('g', {}, svg);   // slots, pieces, outlines
    const whole = D.cup ? '1 cup' : '1 whole';
    if (D.mode === 'pile') {
      const { n, d } = D, w = Math.floor(n / d), r = n % d, nb = w + (r ? 1 : 0);
      const gap = 24, barW = Math.min(200, (900 - (nb - 1) * gap) / nb), pw = barW / d, bh = 48, by = 172;
      const x0 = (940 - (nb * barW + (nb - 1) * gap)) / 2, bx = (b) => x0 + b * (barW + gap);
      for (let b = 0; b < nb; b++) {
        svgEl('rect', { x: bx(b), y: by, width: barW, height: bh, fill: PAPER }, L0);
        for (let i = 1; i < d; i++) svgEl('line', { x1: bx(b) + i * pw, x2: bx(b) + i * pw, y1: by, y2: by + bh, stroke: '#d6ccb8', 'stroke-width': 1.3, 'stroke-dasharray': '4 4' }, L0);
        svgEl('rect', { x: bx(b), y: by, width: barW, height: bh, fill: 'none', stroke: INK, 'stroke-width': 3, rx: 2 }, L2);
        if (D.cup) svgEl('text', { x: bx(b) + barW / 2, y: by + bh + 24, class: 'u3l1-tn' }, L2).textContent = '1 cup';
      }
      const tg = 6, trayW = n * pw + (n - 1) * tg, tx0 = (940 - trayW) / 2, ty = 56;
      const pcs = []; for (let i = 0; i < n; i++) pcs.push(svgEl('rect', { x: tx0 + i * (pw + tg), y: ty, width: pw, height: bh, fill: FA, stroke: EDGE, 'stroke-width': 1.3, rx: 2, opacity: 0 }, L1));
      lab(stage, 20, 4, `each piece is ${K(`\\frac1{${d}}`)} ${D.cup ? 'cup (one scoop)' : 'of a whole'}`, 'u3l1-leg');
      const badges = []; for (let b = 0; b < nb; b++) badges.push(hide(lab(stage, bx(b) + barW / 2, by - 26, b < w ? whole : K(`\\frac{${r}}{${d}}`), 'u3l1-badge u3l1-mid' + (b < w ? '' : ' pt'))));
      const tile = hide(lab(stage, 470, D.cup ? 292 : 280, K(`\\frac{${n}}{${d}}=${mxD(w, r, d)}`) + (D.cup ? ' cups' : ''), 'u3l1-tile u3l1-mid fin'));
      const go = (from, to) => pcs.slice(from, to).map((el, j) => { const i = from + j; return { el, x: bx(Math.floor(i / d)) + (i % d) * pw, y: by }; });
      const what = D.cup ? `${n} scoops of ${T(fr(1, d))} cup: <b>${n} pieces</b>, each ${T(fr(1, d))} of a cup.` : `${T(fr(n, d))} means <b>${n} pieces</b>, each ${T(fr(1, d))} of a whole.`;
      const steps = [
        { cap: what, run: (c) => fadeAttr(c, pcs, 1, 220, 45) },
        { cap: `<b>${d} pieces</b> fill one whole bar: ${T(`${fr(d, d)}=1`)}.`, run: async (c) => { await moveRects(c, go(0, d), 600, 70); await pop(c, badges[0]); } }
      ];
      if (w > 1) steps.push({ cap: `Keep filling bars. <b>${w} bars</b> are full: that is ${T(`${w}\\times${d}=${w * d}`)} pieces.`, run: async (c) => { await moveRects(c, go(d, w * d), 600, 45); for (let b = 1; b < w; b++) await pop(c, badges[b], 260); } });
      if (r) steps.push({ cap: `<b>${r}</b> piece${r > 1 ? 's are' : ' is'} left. ${r > 1 ? 'They fill' : 'It fills'} only ${T(fr(r, d))} of the next bar.`, run: async (c) => { await moveRects(c, go(w * d, n), 600, 70); await pop(c, badges[w]); } });
      steps.push({ cap: `${w} whole${w > 1 ? 's' : ''} and ${T(fr(r, d))}: ${T(`${fr(n, d)}=${mx(w, r, d)}`)}${D.cup ? ' cups' : ''}. Check: ${T(`${n}\\div${d}=${w}`)} R ${r}.`, run: (c) => pop(c, tile) });
      return steps;
    }
    // count mode: the picture is there; count wholes, then every piece
    const { w, n } = D, cut = D.cut || D.d, f = cut / D.d, d = cut, nn = n * f, N = w * d + nn, nb = w + (n ? 1 : 0);
    const nums = [], runs = [];
    let badges = [];
    if (D.pie) {
      const R = 66, cy = 146, sp = 2 * R + 46, x0 = 470 - (nb - 1) * sp / 2;
      for (let b = 0; b < nb; b++) {
        const cx = x0 + b * sp; fillPie(L1, cx, cy, R, d, b < w ? d : nn, FA);
        for (let i = 0; i < (b < w ? d : nn); i++) { const a = (i + 0.5) * 2 * Math.PI / d; const t = svgEl('text', { x: cx + R * 0.62 * Math.sin(a), y: cy - R * 0.62 * Math.cos(a) + 6, class: 'u3l1-cnt', opacity: 0 }, L2); t.textContent = b * d + i + 1; nums.push(t); }
        badges.push(hide(lab(stage, cx, cy - R - 26, b < w ? whole : K(`\\frac{${nn}}{${d}}`), 'u3l1-badge u3l1-mid' + (b < w ? '' : ' pt'))));
        const rt = svgEl('text', { x: cx, y: cy + R + 30, class: 'u3l1-run', opacity: 0 }, L2); rt.textContent = b < w ? (b + 1) * d : N; runs.push(rt);
      }
    } else {
      const gap = 24, barW = Math.min(190, (900 - (nb - 1) * gap) / nb), bh = 56, by = 120, x0 = (940 - (nb * barW + (nb - 1) * gap)) / 2, pw = barW / d;
      const extra = [];
      for (let b = 0; b < nb; b++) {
        const bx = x0 + b * (barW + gap), k = b < w ? d : nn;
        for (let i = 0; i < d; i++) svgEl('rect', { x: bx + i * pw, y: by, width: pw, height: bh, fill: i < k ? FA : PAPER }, L0);
        for (let i = 1; i < d; i++) { const ln = svgEl('line', { x1: bx + i * pw, x2: bx + i * pw, y1: by, y2: by + bh, stroke: EDGE, 'stroke-width': 1.3 }, L1); if (i % f) { ln.setAttribute('opacity', 0); ln.setAttribute('stroke', RED); extra.push(ln); } }
        svgEl('rect', { x: bx, y: by, width: barW, height: bh, fill: 'none', stroke: INK, 'stroke-width': 3, rx: 2 }, L2);
        for (let i = 0; i < k; i++) { const t = svgEl('text', { x: bx + (i + 0.5) * pw, y: by + bh / 2 + 6, class: 'u3l1-cnt', opacity: 0 }, L2); t.textContent = b * d + i + 1; nums.push(t); }
        badges.push(hide(lab(stage, bx + barW / 2, by - 30, b < w ? whole : (D.cut ? K(`\\frac{${n}}{${D.d}}`) : K(`\\frac{${nn}}{${d}}`)), 'u3l1-badge u3l1-mid' + (b < w ? '' : ' pt'))));
        const rt = svgEl('text', { x: bx + barW / 2, y: by + bh + 36, class: 'u3l1-run', opacity: 0 }, L2); rt.textContent = b < w ? (b + 1) * d : N; runs.push(rt);
      }
      badges.extra = extra;
    }
    const both = !!D.both;
    const tMix = hide(lab(stage, both ? 300 : 470, 292, `mixed: ${K(mxD(w, nn, d))}`, 'u3l1-tile u3l1-mid'));
    const tImp = hide(lab(stage, both ? 650 : 470, 292, (both ? 'improper: ' : '') + K(both ? `\\frac{${N}}{${d}}` : `${mxD(w, D.cut ? n : nn, D.cut ? D.d : d)}=\\frac{${N}}{${d}}`) + (D.cup ? ' cups' : ''), 'u3l1-tile u3l1-mid fin'));
    const runList = Array.from({ length: w }, (_, b) => (b + 1) * d).join(', ');
    const countAll = (c) => tween(c, 140 * N, (t) => { nums.forEach((e, i) => e.setAttribute('opacity', t * N > i ? 1 : 0)); runs.forEach((e, b) => e.setAttribute('opacity', t * N >= Math.min(N, (b + 1) * d) - 0.01 ? 1 : 0)); }, lin);
    const steps = [];
    const wd = D.pie ? 'circle' : 'bar', wds = w > 1 ? `${wd}s` : wd;
    if (D.cut) {
      steps.push({ cap: `${T(mx(w, n, D.d))} cups: <b>${w}</b> full cups and ${T(fr(n, D.d))} of a cup.`, run: async (c) => { for (const b of badges) await pop(c, b, 240); } });
      steps.push({ cap: `A scoop is ${T(fr(1, d))} cup, so cut every cup into <b>${pl(d)}</b>: ${T(`${fr(n, D.d)}=${fr(nn, d)}`)}, so ${T(`${mx(w, n, D.d)}=${mx(w, nn, d)}`)}.`, run: (c) => fadeAttr(c, badges.extra, 1, 500, 40) });
      steps.push({ cap: `Count the ${pl(d)} (scoops): ${runList}, then ${nn} more: <b>${N}</b>.`, run: (c) => countAll(c) });
      steps.push({ cap: `${N} quarters: ${T(`${mx(w, n, D.d)}=\\tfrac{${N}}{${d}}`)}. The cook needs <b>${N} scoops</b>. (Shortcut: ${T(`${w}\\times${d}+${nn}=${N}`)}.)`, run: (c) => pop(c, tImp) });
      return steps;
    }
    steps.push({ cap: `Each whole ${wd} is cut into <b>${d}</b> equal pieces (${pl(d)}). There ${w > 1 ? 'are' : 'is'} <b>${w}</b> full ${wds} and <b>${nn}</b> more piece${nn > 1 ? 's' : ''}.`, run: async (c) => { for (const b of badges) await pop(c, b, 240); } });
    if (both) steps.push({ cap: `Mixed number: ${w} whole${w > 1 ? 's' : ''} and ${T(fr(nn, d))} make ${T(mx(w, nn, d))}.`, run: (c) => pop(c, tMix) });
    steps.push({ cap: `Improper fraction: count <b>every</b> piece. ${runList}, then ${nn} more: <b>${N}</b>.`, run: (c) => countAll(c) });
    steps.push({ cap: `${N} pieces, each ${T(fr(1, d))}: ${T(`${mx(w, nn, d)}=\\tfrac{${N}}{${d}}`)}. Shortcut: ${T(`${w}\\times${d}+${nn}=${N}`)}.`, run: (c) => pop(c, tImp) });
    return steps;
  }
};

/* =============================== explainer: changing forms by hand =============================== */
const CONV = {
  i17_5: ['imp', 17, 5], m4_2_3: ['mix', 4, 2, 3],
  i23_4: ['imp', 23, 4], i45_8: ['imp', 45, 8], i38_6: ['imp', 38, 6], i30_12: ['imp', 30, 12],
  m3_5_8: ['mix', 3, 5, 8], m6_2_3: ['mix', 6, 2, 3], m4_7_10: ['mix', 4, 7, 10], m12_1_2: ['mix', 12, 1, 2]
};
const convLabel = (k) => { const D = CONV[k]; return D[0] === 'imp' ? T(`\\tfrac{${D[1]}}{${D[2]}}`) : T(mx(D[1], D[2], D[3])); };
const convert = {
  title: 'Changing forms without a picture',
  height: 310,
  minW: 940,
  capH: 92,
  choices: [{ v: 'i17_5', label: convLabel('i17_5') }, { v: 'm4_2_3', label: convLabel('m4_2_3') }, { sep: 'Example 2 check:' }]
    .concat(['i23_4', 'i45_8', 'i38_6', 'i30_12', 'm3_5_8', 'm6_2_3', 'm4_7_10', 'm12_1_2'].map((k, i) => ({ v: k, label: `(${'abcdefgh'[i]}) ${convLabel(k)}` }))),
  ask: (k) => {
    const D = CONV[k], ex = /^i(23|45|38|30)|^m(3_5|6_2|4_7|12)/.test(k) ? 'Example 2: write ' : 'Write ';
    return D[0] === 'imp' ? `${ex}${T(`\\tfrac{${D[1]}}{${D[2]}}`)} as a mixed number in simplest form.` : `${ex}${T(mx(D[1], D[2], D[3]))} as an improper fraction.`;
  },
  make(stage, k) {
    const D = CONV[k];
    const svg = svgEl('svg', { class: 'u3l1-abs', width: 940, height: 310 }); add(stage, svg, 0, 0);
    const tok = (x, y, s, cls = '') => lab(stage, x, y, String(s), 'u3l1-tk ' + cls);
    const line = (x, y, w, cls = '') => { const d = lab(stage, x, y, '', 'u3l1-fl ' + cls); d.style.width = w + 'px'; return d; };
    const fw = (a, b, big) => Math.max(digits(a), digits(b)) * (big ? 34 : 27) + 26;
    if (D[0] === 'imp') {
      const [, N, d] = D, q = Math.floor(N / d), r = N % d, g = gcd(r, d), sN = r / g, sD = d / g;
      tok(120, 110, N, 's'); line(120, 152, fw(N, d)); const sDen = tok(120, 194, d, 's');
      lab(stage, 120, 46, 'improper fraction', 'u3l1-note u3l1-mid');
      // the division row
      const row = [[N, ''], ['÷', 'g'], [d, ''], ['=', 'g'], [q, 'r'], ['R', 'g'], [r, 'r']];
      let x = 300; const rt = row.map(([s, cl]) => { const w = String(s).length * 27 + 4, t = hide(tok(x + w / 2, 80, s, 's ' + cl)); x += w + 20; return t; });
      const note = hide(lab(stage, 300, 132, K(`${d}\\times${q}=${d * q},\\quad ${N}-${d * q}=${r}`), 'u3l1-note'));
      // the answer
      const cx = 760, wx = cx - 36 - (digits(q) - 1) * 17, fx = cx + 30;
      const rW = hide(tok(wx, 200, q, 'r')), rL = hide(line(fx, 200, fw(r, d, true), 'r')), rN = hide(tok(fx, 158, r, 'r')), rD = hide(tok(fx, 242, d, 'r'));
      const tag = hide(lab(stage, cx, 112, 'mixed number', 'u3l1-note u3l1-mid'));
      const simpNote = hide(lab(stage, fx, 292, `÷ ${g} top and bottom`, 'u3l1-note u3l1-mid'));
      const fly = async (c, src, dst) => { const t = lab(stage, parseFloat(src.style.left), parseFloat(src.style.top), src.textContent, dst.className.replace('u3l1-abs ', '')); t.style.opacity = 1; await moveEl(c, t, parseFloat(dst.style.left), parseFloat(dst.style.top), 700); t.remove(); dst.style.opacity = 1; };
      const steps = [
        { cap: `Divide the top by the bottom: ${T(`${N}\\div${d}`)}. ${d} goes into ${N} <b>${q}</b> times (${T(`${d}\\times${q}=${d * q}`)}), with <b>${r}</b> left over.`,
          run: async (c) => { for (const t of rt) await pop(c, t, 220); await show(c, note); } },
        { cap: `<b>${q}</b> is the whole number. The remainder <b>${r}</b> goes on top. The bottom stays <b>${d}</b>: ${T(`\\tfrac{${N}}{${d}}=${mx(q, r, d)}`)}.`,
          run: async (c) => { await show(c, tag); await Promise.all([fly(c, rt[4], rW), fly(c, rt[6], rN), fly(c, sDen, rD)]); await pop(c, rL); } }
      ];
      if (g > 1) steps.push({ cap: `Simplify the fraction part only: ${T(`${fr(r, d)}=${fr(sN, sD)}`)}. The whole number ${q} stays the same: <b>${T(mx(q, sN, sD))}</b>.`,
        run: async (c) => { rN.textContent = sN; rD.textContent = sD; await Promise.all([pop(c, rN), pop(c, rD), show(c, simpNote), pulse(c, rW, 1.08)]); } });
      return steps;
    }
    const [, w, n, d] = D, N = w * d + n;
    const cx = 150, wx = cx - 34 - (digits(w) - 1) * 18, fx = cx + 36;
    tok(wx, 165, w); tok(fx, 124, n, 's'); line(fx, 165, fw(n, d)); const sDen = tok(fx, 206, d, 's');
    lab(stage, cx, 46, 'mixed number', 'u3l1-note u3l1-mid');
    const a1 = svgEl('path', { d: `M${fx - 22} ${232} Q${(wx + fx) / 2 - 30} ${284} ${wx} ${200}`, fill: 'none', stroke: BLUE, 'stroke-width': 4, opacity: 0 }, svg);
    const h1 = arrowHead(svg, wx, 198, 0.15, -1, { color: BLUE, width: 4 }); h1.setAttribute('opacity', 0);
    const l1 = hide(lab(stage, (wx + fx) / 2 - 20, 290, '×', 'u3l1-mul big'));
    const a2 = svgEl('path', { d: `M${wx} ${128} Q${wx + 4} ${70} ${fx - 30} ${112}`, fill: 'none', stroke: GRN, 'stroke-width': 4, opacity: 0 }, svg);
    const h2 = arrowHead(svg, fx - 30, 112, 1, 0.55, { color: GRN, width: 4 }); h2.setAttribute('opacity', 0);
    const l2 = hide(lab(stage, wx - 22, 84, '+', 'u3l1-mul big g'));
    const r1 = hide(lab(stage, 340, 112, K(`${w}\\times${d}=${w * d}`), 'u3l1-wk u3l1-ml'));
    const r2 = hide(lab(stage, 340, 182, K(`${w * d}+${n}=${N}`), 'u3l1-wk u3l1-ml'));
    const ox = 790, rN = hide(tok(ox, 124, N, 'r')), rL = hide(line(ox, 166, fw(N, d, true), 'r')), rD = hide(tok(ox, 208, d, 'r'));
    const tag = hide(lab(stage, ox, 46, 'improper fraction', 'u3l1-note u3l1-mid'));
    const drawArrow = async (c, p, hd, l) => { p.setAttribute('opacity', 1); await drawIn(p, 600, c); hd.setAttribute('opacity', 1); await pop(c, l, 220); };
    return [
      { cap: `Multiply the whole number by the bottom: ${T(`${w}\\times${d}=${w * d}`)}. (${w} whole${w > 1 ? 's are' : ' is'} ${w * d} ${pl(d)}.)`, run: async (c) => { await drawArrow(c, a1, h1, l1); await show(c, r1); } },
      { cap: `Add the top: ${T(`${w * d}+${n}=${N}`)}.`, run: async (c) => { await drawArrow(c, a2, h2, l2); await show(c, r2); } },
      { cap: `Keep the same bottom: ${T(`${mx(w, n, d)}=\\tfrac{${N}}{${d}}`)}. Check: ${T(`${N}\\div${d}=${w}`)} R ${n}.`,
        run: async (c) => { const t = tok(fx, 206, d, 's'); await moveEl(c, t, ox, 208, 700); t.remove(); rD.style.opacity = 1; await Promise.all([pop(c, rN), pop(c, rL), show(c, tag)]); } }
    ];
  }
};

/* =============================== explainer (Full): a common denominator =============================== */
const LCD = { c: [[3, 4], [1, 6]], e4b: [[2, 3], [1, 4]], e4c: [[1, 6], [1, 2]], e4d: [[3, 4], [5, 8]], e6d: [[1, 4], [2, 3]], e10a: [[7, 8], [1, 3]] };
const lcdLab = (k) => T(LCD[k].map(([a, b]) => fr(a, b)).join('\\ \\&\\ '));
const lcd = {
  title: 'Finding a common denominator',
  height: 300,
  minW: 940,
  capH: 92,
  choices: [{ v: 'c', label: lcdLab('c') }, { sep: 'Examples 4, 6, 10:' }, ...['e4b', 'e4c', 'e4d', 'e6d', 'e10a'].map((k) => ({ v: k, label: lcdLab(k) }))],
  ask: (k) => `Find the lowest common denominator of ${LCD[k].map(([a, b]) => T(fr(a, b))).join(' and ')}, and write both with it.`,
  make(stage, k) {
    const [[a1, d1], [a2, d2]] = LCD[k], big = Math.max(d1, d2), small = Math.min(d1, d2), D = lcm(d1, d2);
    const mults = []; for (let m = big; m <= D; m += big) mults.push(m);
    lab(stage, 30, 70, `Count by ${big}:`, 'u3l1-wk u3l1-ml');
    const boxes = mults.map((m, i) => hide(lab(stage, 290 + i * 112, 70, String(m), 'u3l1-sc' + (m === D ? ' yes' : ' no'))));
    const marks = mults.map((m, i) => hide(lab(stage, 290 + i * 112, 108, m === D ? `÷ ${small} ✓` : `÷ ${small} ✗`, 'u3l1-scm ' + (m === D ? 'yes' : 'no'))));
    const eq = (x, a, d) => {
      const kf = D / d;
      return { e: hide(lab(stage, x, 220, K(`\\frac{${a}}{${d}}=\\frac{${a * kf}}{${D}}`), 'u3l1-eqv')), t: hide(lab(stage, x, 162, kf > 1 ? `× ${kf}` : 'same', 'u3l1-mul')), b: hide(lab(stage, x, 280, kf > 1 ? `× ${kf}` : '', 'u3l1-mul')), kf };
    };
    const E1 = eq(270, a1, d1), E2 = eq(670, a2, d2);
    const eqCap = (a, d, E) => (E.kf > 1 ? `${T(fr(a, d))}: multiply the top and the bottom by ${E.kf}: ${T(`${fr(a, d)}=${fr(a * E.kf, D)}`)}.` : `${T(fr(a, d))} already uses ${pl(D)}.`);
    return [
      { cap: `Count by the bigger bottom, <b>${big}</b>, until ${small} divides in: ${mults.join(', ')}.`,
        run: async (c) => { for (let i = 0; i < mults.length; i++) { await pop(c, boxes[i], 260); await show(c, marks[i]); } } },
      { cap: `<b>${D}</b> works, so use ${pl(D)}. ${eqCap(a1, d1, E1)}`, run: async (c) => { await pulse(c, boxes[boxes.length - 1], 1.15); await pop(c, E1.e); await Promise.all([show(c, E1.t), show(c, E1.b)]); } },
      { cap: eqCap(a2, d2, E2) + ' Now both fractions are the same size pieces.', run: async (c) => { await pop(c, E2.e); await Promise.all([show(c, E2.t), show(c, E2.b)]); } }
    ];
  }
};

/* =============================== explainer: adding with bars =============================== */
const ADD = {
  c1: { a: [0, 3, 4], b: [0, 1, 6] }, c2: { a: [1, 2, 3], b: [1, 1, 2] },
  e4a: { a: [0, 3, 8], b: [0, 1, 8] }, e4b: { a: [0, 2, 3], b: [0, 1, 4] }, e4c: { a: [2, 1, 6], b: [3, 1, 2] }, e4d: { a: [4, 3, 4], b: [1, 5, 8] }
};
const pairLab = (P, op) => T(`${mx(...P.a)}${op}${mx(...P.b)}`);
const addBars = {
  title: 'Adding with bars',
  height: 300,
  minW: 940,
  capH: 92,
  choices: [{ v: 'c1', label: pairLab(ADD.c1, '+') }, { v: 'c2', label: pairLab(ADD.c2, '+') }, { sep: 'Example 4 check:' },
    ...['e4a', 'e4b', 'e4c', 'e4d'].map((k, i) => ({ v: k, label: `(${'abcd'[i]})` }))],
  ask: (k) => `${k[0] === 'e' ? `Example 4(${k[2]}): add` : 'Add'} ${pairLab(ADD[k], '+')}. Write the answer in simplest form.`,
  make(stage, k) {
    const P = ADD[k], A = A3(P.a), B = A3(P.b), D = lcm(A.d, B.d), na = A.n * D / A.d, nb = B.n * D / B.d;
    const W = A.w + B.w, S = na + nb, nTot = W + Math.ceil(S / D), mb = Math.max(A.w + (A.n ? 1 : 0), B.w + (B.n ? 1 : 0), nTot);
    const X0 = 170, gap = 12, barW = Math.min(260, (760 - (mb - 1) * gap) / mb), pw = barW / D, bh = 50, yA = 26, yB = 104, yT = 212;
    const bx = (j) => X0 + j * (barW + gap);
    const svg = svgEl('svg', { class: 'u3l1-abs', width: 940, height: 300 }); add(stage, svg, 0, 0);
    const L0 = svgEl('g', {}, svg), L1 = svgEl('g', {}, svg), L2 = svgEl('g', {}, svg);
    // the total row's empty slots
    const slotG = svgEl('g', { opacity: 0 }, L0);
    for (let j = 0; j < nTot; j++) {
      svgEl('rect', { x: bx(j), y: yT, width: barW, height: bh, fill: PAPER }, slotG);
      for (let i = 1; i < D; i++) svgEl('line', { x1: bx(j) + i * pw, x2: bx(j) + i * pw, y1: yT, y2: yT + bh, stroke: '#d6ccb8', 'stroke-width': 1.2, 'stroke-dasharray': '4 4' }, slotG);
      svgEl('rect', { x: bx(j), y: yT, width: barW, height: bh, fill: 'none', stroke: '#8f8676', 'stroke-width': 2.4, 'stroke-dasharray': '7 5', rx: 2 }, slotG);
    }
    const row = (o, y, fill, nD) => {
      const wholes = [];
      for (let j = 0; j < o.w; j++) { const g = svgEl('g', {}, L1); svgEl('rect', { x: bx(j), y, width: barW, height: bh, fill, stroke: INK, 'stroke-width': 3, rx: 2 }, g); wholes.push({ g, j }); }
      const pieces = [], extra = []; let part = null;
      if (o.n) {
        const x = bx(o.w); part = svgEl('g', {}, L0);
        svgEl('rect', { x, y, width: barW, height: bh, fill: PAPER }, part);
        for (let i = 1; i < D; i++) { const ln = svgEl('line', { x1: x + i * pw, x2: x + i * pw, y1: y, y2: y + bh, stroke: '#cfc6b4', 'stroke-width': 1.3 }, part); if (i % (D / o.d)) { ln.setAttribute('opacity', 0); extra.push(ln); } }
        svgEl('rect', { x, y, width: barW, height: bh, fill: 'none', stroke: INK, 'stroke-width': 3, rx: 2 }, part);
        for (let i = 0; i < nD; i++) pieces.push(svgEl('rect', { x: x + i * pw, y, width: pw, height: bh, fill, stroke: EDGE, 'stroke-width': 1.3, 'stroke-opacity': D === o.d ? 1 : 0 }, L1));
        // the old (coarser) piece edges of the shaded part, so the picture starts as the fraction you were given
        if (D !== o.d) for (let i = 1; i < o.n; i++) extra.push(Object.assign(svgEl('line', { x1: x + i * barW / o.d, x2: x + i * barW / o.d, y1: y, y2: y + bh, stroke: EDGE, 'stroke-width': 1.3 }, L2), { keep: true }));
      }
      return { wholes, pieces, extra, part };
    };
    const RA = row(A, yA, FA, na), RB = row(B, yB, FB, nb);
    const labA = lab(stage, 20, yA + bh / 2, K(mxD(A.w, A.n, A.d)), 'u3l1-rowlab u3l1-ml');
    const labB = lab(stage, 20, yB + bh / 2, K('+\\,' + mxD(B.w, B.n, B.d)), 'u3l1-rowlab b u3l1-ml');
    const labT = hide(lab(stage, 20, yT + bh / 2, '', 'u3l1-rowlab r u3l1-ml'));
    const reg = hide(lab(stage, bx(W) + barW / 2, yT - 22, 'regroup: 1 whole', 'u3l1-badge rg u3l1-mid'));
    const R0 = fromImp(W * D + S, D), F = simp(R0);
    const needCut = A.d !== D || B.d !== D;
    const eqs = [A.d !== D && A.n ? `${T(fr(A.n, A.d))}${T(`=${fr(na, D)}`)}` : '', B.d !== D && B.n ? `${T(fr(B.n, B.d))}${T(`=${fr(nb, D)}`)}` : ''].filter(Boolean).join(' and ');
    const steps = [];
    if (needCut) steps.push({ cap: `The pieces are different sizes. Cut them into <b>${pl(D)}</b>: ${eqs}.`,
      run: async (c) => {
        const keep = [...RA.extra, ...RB.extra].filter((e) => e.keep), add2 = [...RA.extra, ...RB.extra].filter((e) => !e.keep);
        await Promise.all([fadeAttr(c, add2, 1, 500), fadeAttr(c, keep, 0, 500), tween(c, 500, (t) => [...RA.pieces, ...RB.pieces].forEach((p) => p.setAttribute('stroke-opacity', t)))]);
        labA.innerHTML = K(mxD(A.w, na, D)); labB.innerHTML = K('+\\,' + mxD(B.w, nb, D)); await Promise.all([pulse(c, labA, 1.08), pulse(c, labB, 1.08)]);
      } });
    else steps.push({ cap: `Both use <b>${pl(D)}</b>: same-size pieces, so we can add them.`, run: (c) => Promise.all([pulse(c, labA, 1.08), pulse(c, labB, 1.08)]) });
    const wholesAll = [...RA.wholes.map((o) => ({ ...o, y: yA })), ...RB.wholes.map((o) => ({ ...o, y: yB }))];
    if (W) steps.push({ cap: `Add the whole numbers: ${T(`${A.w}+${B.w}=${W}`)}. The whole bars slide together.`,
      run: async (c) => { await fadeAttr(c, slotG, 1, 300); for (let i = 0; i < wholesAll.length; i++) { const o = wholesAll[i]; await moveG(c, o.g, bx(i) - bx(o.j), yT - o.y, 520); } } });
    const pcs = [...RA.pieces, ...RB.pieces];
    steps.push({ cap: `Add the ${pl(D)}: ${T(`${fr(na, D)}+${fr(nb, D)}=${fr(S, D)}`)}. ${W ? 'Pour the pieces in after the wholes.' : 'Pour the pieces into one bar.'}`,
      run: async (c) => {
        if (!W) await fadeAttr(c, slotG, 1, 300);
        await moveRects(c, pcs.map((el, i) => ({ el, x: bx(W + Math.floor(i / D)) + (i % D) * pw, y: yT })), 560, 60);
        await fadeAttr(c, [RA.part, RB.part].filter(Boolean), 0.25, 300);
        labT.innerHTML = K(`=${mxD(W, S, D)}`); await show(c, labT);
      } });
    if (S >= D) steps.push({ cap: `${T(fr(S, D))} is ${S === D ? 'exactly' : 'more than'} 1 whole: ${D} pieces fill a bar. <b>Regroup:</b> ${T(`${mx(W, S, D)}=${W ? W + '+' : ''}${mx(1, S - D, D)}=${mx(W + 1, S - D, D)}`)}.`,
      run: async (c) => { await pop(c, reg); labT.innerHTML = K(`=${mxD(R0.w, R0.n, D)}`); await pulse(c, labT, 1.1); } });
    const g = R0.n ? gcd(R0.n, D) : 1;
    steps.push({ cap: g > 1 ? `Simplest form: ${T(`${fr(R0.n, D)}=${fr(F.n, F.d)}`)}, so the answer is <b>${T(mxo(F))}</b>.` : `${R0.n ? `${T(fr(R0.n, D))} is in simplest form.` : 'No pieces left over.'} The answer is <b>${T(mxo(F))}</b>.`,
      run: async (c) => { labT.innerHTML = K(`=${mxD(F.w, F.n, F.d)}`); await pop(c, labT); } });
    return steps;
  }
};

/* =============================== the tape measure =============================== */
function drawTape(svg, o) {
  const { x0, x1, y, L, sub } = o, px = (v) => x0 + (x1 - x0) * v / L, H = 46;
  svgEl('rect', { x: x0 - 14, y, width: x1 - x0 + 28, height: H, rx: 4, fill: '#f6d54a', stroke: '#9a7a10', 'stroke-width': 2 }, svg);
  const unit = (x1 - x0) / L;
  for (let i = 0; i <= L * sub; i++) {
    const v = i / sub; let lv = sub; for (const s of [1, 2, 4, 8, 16]) if (i % (sub / s) === 0) { lv = s; break; }
    const len = { 1: 26, 2: 18, 4: 13, 8: 9, 16: 6 }[lv];
    if (unit / lv < 3.2 && lv > 1) continue;
    svgEl('line', { x1: px(v), x2: px(v), y1: y, y2: y + len, stroke: '#2b2f38', 'stroke-width': lv === 1 ? 2.2 : 1.3 }, svg);
  }
  for (let v = 0; v <= L; v += o.num) svgEl('text', { x: px(v), y: y + 42, class: 'u3l1-tn' }, svg).textContent = v;
  svgEl('text', { x: x1 + 4, y: y - 8, class: 'u3l1-tn', 'text-anchor': 'end' }, svg).textContent = o.unit;
  return { px, y, H };
}
/* a magnified piece of tape from a to b (fractions of a unit), with coloured marks */
function zoomInset(stage, x, y, w, hgt, a, b, sub, marks) {
  const box = hide(lab(stage, x, y, '', 'u3l1-zoom')); box.style.width = w + 'px'; box.style.height = hgt + 'px';
  const svg = svgEl('svg', { width: w, height: hgt, viewBox: `0 0 ${w} ${hgt}`, style: 'position:absolute;left:0;top:0' }); box.appendChild(svg);
  const pad = 30, px = (v) => pad + (w - 2 * pad) * (v - a) / (b - a), ty = 26;
  svgEl('rect', { x: 8, y: ty, width: w - 16, height: 50, rx: 4, fill: '#f6d54a', stroke: '#9a7a10', 'stroke-width': 2 }, svg);
  for (let i = 0; i <= (b - a) * sub; i++) {
    const v = a + i / sub; let lv = sub; for (const s of [1, 2, 4, 8, 16]) if (i % (sub / s) === 0) { lv = s; break; }
    svgEl('line', { x1: px(v), x2: px(v), y1: ty, y2: ty + { 1: 32, 2: 24, 4: 18, 8: 12, 16: 8 }[lv], stroke: '#2b2f38', 'stroke-width': lv === 1 ? 2.6 : 1.6 }, svg);
    if (lv === 1) svgEl('text', { x: px(v), y: ty + 46, class: 'u3l1-zt' }, svg).textContent = v;
  }
  svgEl('text', { x: 54, y: 18, class: 'u3l1-zt' }, svg).textContent = 'zoomed in';
  marks.forEach((m) => {
    svgEl('line', { x1: px(m.v), x2: px(m.v), y1: ty - 8, y2: ty + 58, stroke: m.color, 'stroke-width': 3.5 }, svg);
    const t = lab(box, px(m.v), ty + 62 + (m.dy || 0), m.html, 'u3l1-flag ' + m.cls); t.style.translate = m.al === 'r' ? '-100% 0' : m.al === 'l' ? '0 0' : '-50% 0';
  });
  return box;
}
const TAPE = {
  e5: { title: 'pipes' }, e7: { title: 'fabric' }, e11: { title: 'bench' }
};
const tape = {
  title: 'End to end on the tape measure',
  height: 340,
  minW: 940,
  capH: 96,
  choices: [{ sep: 'Check:' }, { v: 'e5', label: 'Example 5 · pipes' }, { v: 'e7', label: 'Example 7 · fabric' }, { v: 'e11', label: 'Example 11 · bench' }],
  ask: (k) => ({
    e5: `Example 5: pipes of ${T('14\\tfrac38')} in, ${T('9\\tfrac34')} in and ${T('6\\tfrac12')} in are joined end to end. (a) Estimate the total. (b) Find the exact total.`,
    e7: `Example 7: Hailey has ${T('5\\tfrac14')} yd of fabric. She uses ${T('1\\tfrac78')} yd and ${T('2\\tfrac12')} yd. (a) How much is left? (b) Is it enough for a ${T('\\tfrac34')} yd sash?`,
    e11: `Example 11: 3 boards, each ${T('23\\tfrac58')} in, end to end. Jesse says ${T('59\\tfrac78')} in. (a) Show that is not reasonable. (b) Find the correct length.`
  })[k],
  make(stage, k) {
    const svg = svgEl('svg', { class: 'u3l1-abs', width: 940, height: 340 }); add(stage, svg, 0, 0);
    const TY = 232;
    if (k === 'e5' || k === 'e11') {
      const pipes = k === 'e5', L = pipes ? 32 : 76;
      const tp = drawTape(svg, { x0: 40, x1: 900, y: TY, L, sub: pipes ? 8 : 2, num: pipes ? 2 : 6, unit: 'in' });
      const lens = pipes ? [[14, 3, 8], [9, 3, 4], [6, 1, 2]] : [[23, 5, 8], [23, 5, 8], [23, 5, 8]];
      const vals = lens.map(([w, n, d]) => w + n / d), est = lens.map(([w, n, d]) => w + (n / d >= 0.5 ? 1 : 0));
      const fill = pipes ? '#d08a4e' : '#dcae6e', stroke = pipes ? '#8a4a1e' : '#9a6a24', ph = 30;
      let acc = 0;
      const items = lens.map((l, i) => {
        const y = 28 + i * 52, wpx = tp.px(vals[i]) - tp.px(0);
        const r = svgEl('rect', { x: tp.px(0), y, width: wpx, height: ph, rx: pipes ? 12 : 3, fill, stroke, 'stroke-width': 2.5, opacity: 0 }, svg);
        const lb = hide(lab(stage, tp.px(vals[i]) + 14, y + ph / 2, `${K(mxD(...l))} in`, 'u3l1-plab u3l1-ml'));
        const es = hide(lab(stage, tp.px(vals[i]) + 130, y + ph / 2, `≈ ${est[i]}`, 'u3l1-plab est u3l1-ml'));
        const at = acc; acc += vals[i];
        return { r, lb, es, at, wpx };
      });
      const total = acc, tot = fromImp(Math.round(total * 8), 8), totS = simp(tot);
      const endLine = svgEl('line', { x1: tp.px(total), x2: tp.px(total), y1: TY - 50, y2: TY + 56, stroke: RED, 'stroke-width': 3.5, opacity: 0 }, svg);
      const steps = [];
      if (pipes) {
        const ins = zoomInset(stage, 520, 10, 400, 150, 30, 31, 8, [{ v: 30.625, color: RED, html: `${K('30\\frac58')} in`, cls: 'r', al: 'r' }, { v: 31, color: BLUE, html: 'estimate 31', cls: 'b', al: 'r' }]);
        const ok = hide(stamp(stage, '✓ close', { x: 300, y: 100, ok: true }));
        steps.push({ cap: `Three pipes: ${T('14\\tfrac38')} in, ${T('9\\tfrac34')} in and ${T('6\\tfrac12')} in, drawn to scale above the tape.`, run: async (c) => { for (const it of items) { await fadeAttr(c, it.r, 1, 260); await show(c, it.lb); } } });
        steps.push({ cap: `(a) Estimate: round each piece to the nearest inch. ${T('14+10+7=31')} in.`, run: async (c) => { for (const it of items) await pop(c, it.es, 260); } });
        steps.push({ cap: 'Lay the pipes end to end on the tape.', run: async (c) => {
          items.forEach((it) => { it.es.style.opacity = 0; });
          for (const it of items) { await Promise.all([moveRects(c, [{ el: it.r, x: tp.px(it.at), y: TY - ph - 4 }], 650, 0), moveEl(c, it.lb, tp.px(it.at + 0) + it.wpx / 2 - 44, TY - ph - 26, 650)]); }
        } });
        steps.push({ cap: `(b) Use eighths: ${T('14\\tfrac38+9\\tfrac68+6\\tfrac48=29\\tfrac{13}8=30\\tfrac58')} in. Read it on the tape (zoomed in).`, run: async (c) => { await fadeAttr(c, endLine, 1, 300); await pop(c, ins); } });
        steps.push({ cap: `The exact total, ${T('30\\tfrac58')} in, is close to the estimate of 31 in. The answer is reasonable.`, run: (c) => stampIn(c, ok) });
        return steps;
      }
      // the bench
      const jx = tp.px(59.875), ex = tp.px(72);
      const jLine = svgEl('line', { x1: jx, x2: jx, y1: TY - 12, y2: TY + 66, stroke: COLORS.orange, 'stroke-width': 3.5, 'stroke-dasharray': '7 5', opacity: 0 }, svg);
      const jFlag = hide(lab(stage, jx, 284, `Jesse: ${K('59\\frac78')}`, 'u3l1-flag k')); jFlag.style.translate = '-100% 0';
      const eLine = svgEl('line', { x1: ex, x2: ex, y1: TY - 12, y2: TY + 66, stroke: BLUE, 'stroke-width': 3.5, 'stroke-dasharray': '7 5', opacity: 0 }, svg);
      const eFlag = hide(lab(stage, ex, 296, 'estimate 72', 'u3l1-flag b')); eFlag.style.translate = '-50% 0';
      const no = hide(stamp(stage, '✗', { x: jx - 190, y: 312, ok: false }));
      const ins = zoomInset(stage, 520, 10, 400, 150, 70, 72, 8, [{ v: 70.875, color: RED, html: `${K('70\\frac78')} in`, cls: 'r', al: 'r' }, { v: 72, color: BLUE, html: '72', cls: 'b', al: 'r' }]);
      steps.push({ cap: `Three boards, each ${T('23\\tfrac58')} in. Jesse says the seat is ${T('59\\tfrac78')} in long.`, run: async (c) => { for (const it of items) { await fadeAttr(c, it.r, 1, 240); await show(c, it.lb); } await fadeAttr(c, jLine, 1, 300); await pop(c, jFlag); } });
      steps.push({ cap: `(a) Estimate: ${T('23\\tfrac58\\approx24')}, and ${T('3\\times24=72')} in. Jesse’s ${T('59\\tfrac78')} in is far from 72 in, so it is <b>not reasonable</b>.`, run: async (c) => { await fadeAttr(c, eLine, 1, 300); await pop(c, eFlag); await stampIn(c, no); } });
      steps.push({ cap: 'Lay the boards end to end. They go well past Jesse’s mark.', run: async (c) => {
        for (const it of items) await Promise.all([moveRects(c, [{ el: it.r, x: tp.px(it.at), y: TY - ph - 4 }], 600, 0), moveEl(c, it.lb, tp.px(it.at) + it.wpx / 2 - 44, TY - ph - 26, 600)]);
      } });
      steps.push({ cap: `(b) ${T('3\\times23\\tfrac58=\\tfrac31\\times\\tfrac{189}8=\\tfrac{567}8=70\\tfrac78')} in. That is close to the estimate of 72 in.`, run: async (c) => { await fadeAttr(c, endLine, 1, 300); await pop(c, ins); } });
      return steps;
    }
    // Example 7: fabric in yards
    const tp = drawTape(svg, { x0: 40, x1: 900, y: TY, L: 6, sub: 8, num: 1, unit: 'yd' });
    const fy = TY - 40, fh = 34, P = (v) => tp.px(v);
    const seg = (a, b, fill) => svgEl('rect', { x: P(a), y: fy, width: P(b) - P(a), height: fh, fill, stroke: '#4a2c6a', 'stroke-width': 2 }, svg);
    const PUR = '#b99ad8';
    const s1 = seg(0, 1.875, PUR), s2 = seg(1.875, 4.375, PUR), s3 = seg(4.375, 5.25, PUR);
    [s1, s2, s3].forEach((s) => s.setAttribute('opacity', 0));
    const bolt = hide(lab(stage, P(2.625), fy - 22, `${K('5\\tfrac14')} yd of fabric`, 'u3l1-plab u3l1-mid'));
    const capeL = hide(lab(stage, P(0.9375), fy + fh / 2, `cape ${K('1\\tfrac78')}`, 'u3l1-plab u3l1-mid'));
    const curL = hide(lab(stage, P(3.125), fy + fh / 2, `curtain ${K('2\\tfrac12')}`, 'u3l1-plab u3l1-mid'));
    const leftL = hide(lab(stage, P(4.8125), 142, `left: ${K('\\frac78')} yd`, 'u3l1-flag r u3l1-mid'));
    const brk = svgEl('path', { d: `M${P(4.375)} ${fy - 8} V${fy - 20} H${P(5.25)} V${fy - 8}`, fill: 'none', stroke: RED, 'stroke-width': 3, opacity: 0 }, svg);
    const sash = svgEl('rect', { x: P(4.375), y: 90, width: P(0.75) - P(0), height: fh, fill: '#5cb88a', stroke: '#12583a', 'stroke-width': 2, opacity: 0 }, svg);
    const sashL = hide(lab(stage, P(4.9), 72, `sash ${K('\\tfrac34=\\tfrac68')}`, 'u3l1-plab u3l1-mid'));
    const spare = svgEl('rect', { x: P(5.125), y: fy - 2, width: P(0.125) - P(0), height: fh + 4, fill: 'none', stroke: GRN, 'stroke-width': 3.5, opacity: 0 }, svg);
    const spareL = hide(lab(stage, P(5.1875), 312, `${K('\\frac18')} yd spare`, 'u3l1-flag k u3l1-mid'));
    const ok = hide(stamp(stage, '✓ enough', { x: 480, y: 110, ok: true }));
    return [
      { cap: `Hailey has ${T('5\\tfrac14')} yd of fabric. Lay it on a tape marked in yards and eighths.`, run: async (c) => { await fadeAttr(c, [s1, s2, s3], 1, 400); await show(c, bolt); } },
      { cap: `She uses ${T('1\\tfrac78')} yd for a cape and ${T('2\\tfrac12')} yd for a curtain. Used: ${T('1\\tfrac78+2\\tfrac48=3\\tfrac{11}8=4\\tfrac38')} yd.`,
        run: async (c) => { s1.setAttribute('fill', '#e88a83'); s2.setAttribute('fill', '#8fb4ee'); await Promise.all([pulse(c, bolt, 1.02), show(c, capeL), show(c, curL)]); } },
      { cap: 'Cut those pieces off and lift them away.', run: async (c) => {
        bolt.style.opacity = 0;
        await Promise.all([moveRects(c, [{ el: s1, x: P(0), y: 14 }, { el: s2, x: P(2.05), y: 14 }], 700, 120), moveEl(c, capeL, P(0.9375), 31, 700), moveEl(c, curL, P(3.3), 31, 700)]);
      } },
      { cap: `Left: ${T('5\\tfrac14-4\\tfrac38=5\\tfrac28-4\\tfrac38')}. Regroup: ${T('4\\tfrac{10}8-4\\tfrac38=\\tfrac78')} yd.`, run: async (c) => { await fadeAttr(c, brk, 1, 300); await pop(c, leftL); } },
      { cap: `(b) The sash needs ${T('\\tfrac34=\\tfrac68')} yd, and ${T('\\tfrac78>\\tfrac68')}. Yes, it is enough, with ${T('\\tfrac18')} yd to spare.`,
        run: async (c) => { await Promise.all([fadeAttr(c, [s1, s2], 0.25, 300), fadeAttr(c, sash, 1, 300)]); capeL.style.opacity = curL.style.opacity = 0.3; await show(c, sashL); await moveRects(c, [{ el: sash, x: P(4.375), y: fy }], 700, 0); await fadeAttr(c, spare, 1, 300); await pop(c, spareL); await stampIn(c, ok); } }
    ];
  }
};

/* =============================== explainer: subtracting with bars =============================== */
const SUB = {
  c: { a: [5, 1, 4], b: [2, 3, 4] },
  e6a: { a: [6, 7, 8], b: [2, 3, 8] }, e6b: { a: [5, 1, 3], b: [1, 5, 6] }, e6c: { a: [9, 0, 1], b: [3, 5, 16] }, e6d: { a: [7, 1, 4], b: [3, 2, 3] }
};
const subBars = {
  title: 'Subtracting with bars',
  height: 310,
  minW: 940,
  capH: 96,
  choices: [{ v: 'c', label: pairLab(SUB.c, '-') }, { sep: 'Example 6 check:' }, ...['e6a', 'e6b', 'e6c', 'e6d'].map((k, i) => ({ v: k, label: `(${'abcd'[i]})` }))],
  ask: (k) => `${k === 'c' ? 'Subtract' : `Example 6(${k[3]}): subtract`} ${pairLab(SUB[k], '-')}. Write the answer in simplest form.`,
  make(stage, k) {
    const P = SUB[k], A = A3(P.a), B = A3(P.b), D = A.n ? lcm(A.d, B.d) : B.d, na = A.n * D / A.d, nb = B.n * D / B.d;
    const regroup = na < nb, nbars = A.w + (A.n ? 1 : 0);
    const X0 = 40, gap = 12, barW = Math.min(170, (860 - (nbars - 1) * gap) / nbars), pw = barW / D, bh = 60, by = 150;
    const bx = (j) => X0 + j * (barW + gap);
    const svg = svgEl('svg', { class: 'u3l1-abs', width: 940, height: 310 }); add(stage, svg, 0, 0);
    const L0 = svgEl('g', {}, svg), L1 = svgEl('g', {}, svg), L2 = svgEl('g', {}, svg);
    const wholes = [];
    for (let j = 0; j < A.w; j++) {
      const g = svgEl('g', {}, L1), pcs = [];
      const solid = svgEl('rect', { x: bx(j), y: by, width: barW, height: bh, fill: FA }, g);
      for (let i = 0; i < D; i++) pcs.push(svgEl('rect', { x: bx(j) + i * pw, y: by, width: pw, height: bh, fill: FA2, stroke: EDGE, 'stroke-width': 1.3, opacity: 0 }, g));
      const out = svgEl('rect', { x: bx(j), y: by, width: barW, height: bh, fill: 'none', stroke: INK, 'stroke-width': 3, rx: 2 }, g);
      wholes.push({ g, pcs, out, solid });
    }
    const extra = [], parts = [];
    if (A.n) {
      const x = bx(A.w);
      svgEl('rect', { x, y: by, width: barW, height: bh, fill: PAPER }, L0);
      for (let i = 1; i < D; i++) { const ln = svgEl('line', { x1: x + i * pw, x2: x + i * pw, y1: by, y2: by + bh, stroke: '#cfc6b4', 'stroke-width': 1.3 }, L0); if (i % (D / A.d)) { ln.setAttribute('opacity', 0); extra.push(ln); } }
      for (let i = 0; i < na; i++) parts.push(svgEl('rect', { x: x + i * pw, y: by, width: pw, height: bh, fill: FA, stroke: EDGE, 'stroke-width': 1.3, 'stroke-opacity': D === A.d ? 1 : 0 }, L1));
      if (D !== A.d) for (let i = 1; i < A.n; i++) extra.push(Object.assign(svgEl('line', { x1: x + i * barW / A.d, x2: x + i * barW / A.d, y1: by, y2: by + bh, stroke: EDGE, 'stroke-width': 1.3 }, L2), { keep: true }));
      svgEl('rect', { x, y: by, width: barW, height: bh, fill: 'none', stroke: INK, 'stroke-width': 3, rx: 2 }, L2);
    }
    const labA = lab(stage, 40, 62, `Start: ${K(mxD(A.w, A.n, A.d))}`, 'u3l1-rowlab u3l1-ml');
    const labB = lab(stage, 900, 62, `Take away: ${K(mxD(B.w, B.n, B.d))}`, 'u3l1-rowlab r u3l1-ml'); labB.style.translate = '-100% -50%';
    const brokenJ = A.w - 1;
    const rgB = hide(lab(stage, bx(brokenJ) + barW / 2, by - 30, `regroup: 1 = ${K(`\\frac{${D}}{${D}}`)}`, 'u3l1-badge rg u3l1-mid'));
    const top = regroup ? na + D : na, W1 = regroup ? A.w - 1 : A.w, Rw = W1 - B.w, Rn = top - nb, F = simp({ w: Rw, n: Rn, d: D });
    const tile = hide(lab(stage, 470, 270, '', 'u3l1-tile u3l1-mid fin'));
    const needCut = (A.n && A.d !== D) || B.d !== D;
    const steps = [];
    const eqs = [A.n && A.d !== D ? T(`${fr(A.n, A.d)}=${fr(na, D)}`) : '', B.d !== D ? T(`${fr(B.n, B.d)}=${fr(nb, D)}`) : ''].filter(Boolean).join(' and ');
    if (needCut && A.n) steps.push({ cap: `Give the fractions a common denominator: use <b>${pl(D)}</b>. ${eqs}.`,
      run: async (c) => {
        await Promise.all([fadeAttr(c, extra.filter((e) => !e.keep), 1, 500), fadeAttr(c, extra.filter((e) => e.keep), 0, 500), tween(c, 500, (t) => parts.forEach((p) => p.setAttribute('stroke-opacity', t)))]);
        labA.innerHTML = `Start: ${K(mxD(A.w, na, D))}`; labB.innerHTML = `Take away: ${K(mxD(B.w, nb, D))}`; await Promise.all([pulse(c, labA, 1.06), pulse(c, labB, 1.06)]);
      } });
    else if (!A.n) steps.push({ cap: `${A.w} is all whole bars. We will take away ${pl(D)}.`, run: (c) => pulse(c, labA, 1.06) });
    else steps.push({ cap: `Both use <b>${pl(D)}</b>: same-size pieces. Start with ${T(mx(A.w, na, D))}.`, run: (c) => Promise.all([pulse(c, labA, 1.06), pulse(c, labB, 1.06)]) });
    if (regroup) {
      const bw = wholes[brokenJ];
      steps.push({ cap: na ? `${T(fr(na, D))} is less than ${T(fr(nb, D))}: not enough pieces. <b>Regroup:</b> break 1 whole into ${T(fr(D, D))}. ${T(`${mx(A.w, na, D)}=${A.w - 1}${fr(na + D, D)}`)}.`
        : `There are no ${pl(D)} to take ${nb} away from. <b>Regroup:</b> break 1 whole into ${T(fr(D, D))}. ${T(`${A.w}=${A.w - 1}${fr(D, D)}`)}.`,
        run: async (c) => {
          await fadeAttr(c, bw.pcs, 1, 500); bw.solid.setAttribute('fill', PAPER); bw.out.setAttribute('stroke', RED);
          await pop(c, rgB); labA.innerHTML = `Now: ${K(`${A.w - 1}\\frac{${na + D}}{${D}}`)}`; await pulse(c, labA, 1.08);
        } });
    }
    const pool = [...parts].reverse().concat(regroup ? [...wholes[brokenJ].pcs].reverse() : []), gone = pool.slice(0, nb);
    steps.push({ cap: `Take away the ${pl(D)}: ${T(`${fr(top, D)}-${fr(nb, D)}=${fr(Rn, D)}`)}.`,
      run: async (c) => { gone.forEach((p) => p.setAttribute('fill', '#f2a39b')); await moveRects(c, gone.map((el) => ({ el, x: +el.getAttribute('x'), y: by - 70, op: 0 })), 650, 50); } });
    const keepW = wholes.filter((_, j) => !(regroup && j === brokenJ)), goneW = keepW.slice(keepW.length - B.w);
    if (B.w) steps.push({ cap: `Take away the whole numbers: ${T(`${W1}-${B.w}=${Rw}`)}.`,
      run: async (c) => { for (const o of goneW) { o.out.setAttribute('stroke', RED); await Promise.all([moveG(c, o.g, 0, -70, 500), fadeAttr(c, o.g, 0, 500)]); } } });
    const g = Rn ? gcd(Rn, D) : 1;
    steps.push({ cap: `What is left: ${T(mx(Rw, Rn, D))}${g > 1 ? `. Simplest form: ${T(`${fr(Rn, D)}=${fr(F.n, F.d)}`)}, so the answer is <b>${T(mxo(F))}</b>` : `. The answer is <b>${T(mxo(F))}</b>`}.`,
      run: async (c) => { tile.innerHTML = K(`${mxD(A.w, A.n, A.d)}-${mxD(B.w, B.n, B.d)}=${mxD(F.w, F.n, F.d)}`); await pop(c, tile); } });
    return steps;
  }
};

/* =============================== explainer (Full): flip vs regroup =============================== */
const FLIP = { c: { a: [5, 1, 4], b: [2, 3, 4] }, o: { a: [4, 1, 8], b: [1, 5, 8] } };
const flipTrap = {
  title: 'Flipping the fractions? Check by adding back',
  height: 300,
  minW: 940,
  capH: 96,
  choices: [{ v: 'c', label: pairLab(FLIP.c, '-') }, { v: 'o', label: pairLab(FLIP.o, '-') }],
  ask: (k) => `Two students subtract ${pairLab(FLIP[k], '-')}. Who is right?`,
  make(stage, k) {
    const A = A3(FLIP[k].a), B = A3(FLIP[k].b), d = A.d;
    const fw = A.w - B.w, fn = B.n - A.n, rw = A.w - 1 - B.w, rn = A.n + d - B.n;
    const card = (x, title) => { const el = lab(stage, x, 8, `<div class="u3l1-note" style="margin-bottom:8px">${title}</div>`, 'u3l1-fcard'); el.style.cssText += 'width:420px;height:286px;box-sizing:border-box;border:2.5px solid #e6dfd0;border-radius:14px;background:#fffdf8;padding:12px 16px'; return el; };
    const L = card(16, 'Student 1: “flip” the fractions'), R = card(500, 'Student 2: regroup');
    const line = (host, src, cls = '') => { const d = h('div', 'u3l1-rowlab ' + cls, K(src.replace(/\\tfrac/g, '\\frac'))); d.style.margin = '4px 0'; d.style.fontSize = '23px'; d.style.opacity = 0; host.appendChild(d); return d; };
    const l1 = line(L, `${A.w}-${B.w}=${fw},\\quad ${fr(B.n, d)}-${fr(A.n, d)}=${fr(fn, d)}`), l2 = line(L, `\\text{answer: }${mxD(fw, fn, d)}`);
    const r1 = line(R, `${mxD(A.w, A.n, d)}=${mxD(A.w - 1, A.n + d, d)}`), r2 = line(R, `${mxD(A.w - 1, A.n + d, d)}-${mxD(B.w, B.n, d)}=${mxD(rw, rn, d)}`);
    const Lsum = fw + B.w, Ln = fn + B.n, Rsum = rw + B.w, Rn2 = rn + B.n;
    const l3 = line(L, `${mxD(fw, fn, d)}+${mxD(B.w, B.n, d)}=${mxD(Lsum, Ln, d)}=${mxD(Lsum + Math.floor(Ln / d), Ln % d, d)}`, 'r');
    const r3 = line(R, `${mxD(rw, rn, d)}+${mxD(B.w, B.n, d)}=${mxD(Rsum, Rn2, d)}=${mxD(Rsum + Math.floor(Rn2 / d), Rn2 % d, d)}`, 'b');
    const sL = hide(stamp(stage, '✗', { x: 380, y: 250, ok: false })), sR = hide(stamp(stage, '✓', { x: 864, y: 250, ok: true }));
    const want = mx(A.w, A.n, d);
    return [
      { cap: `Student 1 flips the fractions to make it easy: ${T(`${fr(B.n, d)}-${fr(A.n, d)}`)}. That gives ${T(mx(fw, fn, d))}.`, run: async (c) => { await show(c, l1); await show(c, l2); } },
      { cap: `Student 2 regroups: ${T(`${want}=${A.w - 1}${fr(A.n + d, d)}`)}, then subtracts: ${T(mx(rw, rn, d))}.`, run: async (c) => { await show(c, r1); await show(c, r2); } },
      { cap: `Check by adding back: answer ${T('+')} ${T(mx(B.w, B.n, d))} must give ${T(want)}.`, run: async (c) => { await show(c, l3); await show(c, r3); } },
      { cap: `Student 1 gets ${T(mx(Lsum + Math.floor(Ln / d), Ln % d, d))}, not ${T(want)}: wrong. Student 2 gets ${T(want)}: right. ${T(`${mx(rw, rn, d)}=${mxo(simp({ w: rw, n: rn, d }))}`)}.`, run: async (c) => { await stampIn(c, sL); await stampIn(c, sR); } }
    ];
  }
};

/* =============================== explainer: the multiplying machine =============================== */
const MUL = {
  c: { f: [[2, 1, 2], [2, 1, 2]] },
  e8a: { f: [[0, 2, 3], [0, 3, 5]] }, e8b: { f: [[4, 0, 1], [2, 3, 8]] }, e8c: { f: [[0, 1, 2], [3, 1, 3]], of: true }, e8d: { f: [[1, 3, 4], [2, 2, 5]], cut: true },
  e9a: { f: [[3, 0, 1], [1, 3, 4]], u: 'cups' }, e9b: { f: [[3, 0, 1], [1, 1, 3]], u: 'cups' }, e9c: { f: [[3, 0, 1], [2, 1, 2]], u: 'tbsp' },
  e9d: { f: [[0, 1, 2], [1, 3, 4]], u: 'cup' }, e9e: { f: [[0, 1, 2], [1, 1, 3]], u: 'cup' }, e9f: { f: [[0, 1, 2], [2, 1, 2]], u: 'tbsp' },
  e10b: { f: [[3, 2, 5], [4, 1, 2]] }, e11b: { f: [[3, 0, 1], [23, 5, 8]], u: 'in' }
};
const facT = (a) => (a[1] === 0 && a[2] === 1 ? `${a[0]}` : mx(...a));
const mulLab = (k) => { const P = MUL[k]; return T(P.of ? `${facT(P.f[0])}\\text{ of }${facT(P.f[1])}` : `${facT(P.f[0])}\\times${facT(P.f[1])}`); };
const multiply = {
  title: 'The multiplying machine',
  height: 350,
  minW: 940,
  capH: 96,
  choices: [{ v: 'c', label: mulLab('c') }, { sep: 'Example 8:' }, ...['e8a', 'e8b', 'e8c', 'e8d'].map((k, i) => ({ v: k, label: `(${'abcd'[i]})` })),
    { sep: 'Example 9:' }, { v: 'e9a', label: 'flour ×3' }, { v: 'e9b', label: 'milk ×3' }, { v: 'e9c', label: 'sugar ×3' }, { v: 'e9d', label: 'flour ½' }, { v: 'e9e', label: 'milk ½' }, { v: 'e9f', label: 'sugar ½' },
    { sep: 'Ex 10, 11:' }, { v: 'e10b', label: '10(b)' }, { v: 'e11b', label: '11(b)' }],
  ask: (k) => {
    const pre = { c: 'Watch out', e8a: 'Example 8(a)', e8b: 'Example 8(b)', e8c: 'Example 8(c)', e8d: 'Example 8(d)', e10b: 'Example 10(b)', e11b: 'Example 11(b)' }[k] || 'Example 9';
    return `${pre}: ${k === 'c' ? 'what is ' : 'multiply '}${mulLab(k)}${MUL[k].u ? ` (${MUL[k].u})` : ''}? Write the answer in simplest form.`;
  },
  make(stage, k) {
    const P = MUL[k], fs = P.f.map((a) => ({ w: a[0], n: a[1], d: a[2] })), ims = fs.map((o) => ({ N: imp(o), d: o.d, whole: o.n === 0 && o.d === 1, mixed: o.w > 0 && o.n > 0 }));
    const [p, q] = ims, Pn = p.N * q.N, Pd = p.d * q.d, R = fromImp(Pn, Pd), F = simp(R);
    const svg = svgEl('svg', { class: 'u3l1-abs', width: 940, height: 350 }); add(stage, svg, 0, 0);
    const xs = [160, 470, 780], my = 96;
    const mach = [['STEP 1', 'improper fractions'], ['STEP 2', 'multiply'], ['STEP 3', 'simplest form']].map(([nm, op], i) => add(stage, h('div', 'u3l1-abs u3l1-mach', `<div class="nm">${nm}</div><div class="op">${op}</div>`), xs[i] - 125, my));
    [0, 1].forEach((i) => { svgEl('path', { d: `M${xs[i] + 130} ${my + 46} H${xs[i + 1] - 136}`, stroke: '#b9ae98', 'stroke-width': 5 }, svg); arrowHead(svg, xs[i + 1] - 134, my + 46, 1, 0, { color: '#b9ae98', width: 5 }); });
    const fracT = (o) => `\\frac{${o.N}}{${o.d}}`;
    const outs = [
      `${fracT(p)}\\times${fracT(q)}`,
      `\\frac{${Pn}}{${Pd}}`,
      mxD(F.w, F.n, F.d)
    ].map((s, i) => hide(lab(stage, xs[i], 8, K(s), 'u3l1-out' + (i === 2 ? ' fin' : ''))));
    const subs = [
      ims.map((o, i) => (o.whole ? `${fs[i].w}=\\tfrac{${fs[i].w}}{1}` : o.mixed ? `${mx(fs[i].w, fs[i].n, fs[i].d)}=\\tfrac{${fs[i].w}\\times${fs[i].d}+${fs[i].n}}{${fs[i].d}}=\\tfrac{${o.N}}{${o.d}}` : '')).filter(Boolean),
      [`${p.N}\\times${q.N}=${Pn}`, `${p.d}\\times${q.d}=${Pd}`],
      []
    ];
    const g = R.n ? gcd(R.n, Pd) : 1, gp = gcd(Pn, Pd);
    if (Pn >= Pd) subs[2] = [`${Pn}\\div${Pd}=${R.w}\\text{ R }${R.n}`].concat(R.n && g > 1 ? [`${mx(R.w, R.n, Pd)}=${mxo(F)}`] : []);
    else subs[2] = gp > 1 ? [`${fr(Pn, Pd)}=${fr(F.n, F.d)}\\ (\\div${gp})`] : ['already simplest'];
    const subEls = subs.map((ls, i) => ls.map((s, j) => hide(lab(stage, xs[i], my + 104 + j * 54, s === 'already simplest' ? s : K(s.replace(/\\tfrac/g, '\\frac')), 'u3l1-sub'))));
    const work = async (c, i) => { mach[i].classList.add('on'); await shake(c, mach[i]); for (const e of subEls[i]) await show(c, e); await pop(c, outs[i]); mach[i].classList.remove('on'); };
    const conv = ims.map((o, i) => (o.whole ? `${T(`${fs[i].w}=\\tfrac{${fs[i].w}}1`)}` : o.mixed ? T(`${mx(fs[i].w, fs[i].n, fs[i].d)}=\\tfrac{${o.N}}{${o.d}}`) : '')).filter(Boolean);
    const unit = P.u ? ' ' + P.u : '';
    const steps = [
      { cap: `${P.of ? '“Of” means ×. ' : ''}Step 1: change to improper fractions. ${conv.length ? conv.join(' and ') + '.' : 'Both are fractions already: nothing to change.'}`, run: (c) => work(c, 0) },
      { cap: `Step 2: multiply the tops and multiply the bottoms: ${T(`\\tfrac{${p.N}\\times${q.N}}{${p.d}\\times${q.d}}=\\tfrac{${Pn}}{${Pd}}`)}.`, run: (c) => work(c, 1) },
      { cap: Pn >= Pd ? `Step 3: back to a mixed number: ${T(`${Pn}\\div${Pd}=${R.w}`)} R ${R.n}${R.n ? `, so ${T(mx(R.w, R.n, Pd))}${g > 1 ? ` ${T(`=${mxo(F)}`)}` : ''}` : ': a whole number'}. Answer: <b>${T(mxo(F))}${unit}</b>.`
        : `Step 3: ${gp > 1 ? `simplify: ${T(`${fr(Pn, Pd)}=${fr(F.n, F.d)}`)}` : `${T(fr(Pn, Pd))} is less than 1 and already in simplest form`}. Answer: <b>${T(mxo(F))}${unit}</b>.`, run: (c) => work(c, 2) }
    ];
    if (k === 'c') steps.push({ cap: `Not ${T('4\\tfrac14')}! Multiplying only ${T('2\\times2')} and ${T('\\tfrac12\\times\\tfrac12')} leaves out ${T('2\\times\\tfrac12')} and ${T('\\tfrac12\\times2')}, which add another 2.`, run: (c) => pulse(c, outs[2], 1.12) });
    if (P.cut) {
      const sc = hide(lab(stage, 470, 324, `Shortcut: ${T('\\tfrac{7}{4}\\times\\tfrac{12}{5}\\ \\to\\ \\tfrac71\\times\\tfrac35=\\tfrac{21}5=4\\tfrac15')}`, 'u3l1-tile u3l1-mid'));
      steps.push({ cap: `Shortcut: 12 and 4 both divide by 4 first: ${T('\\tfrac71\\times\\tfrac35=\\tfrac{21}5=4\\tfrac15')}. Smaller numbers, same answer.`, run: async (c) => { subEls[2].forEach((e) => { e.style.opacity = 0.25; }); await pop(c, sc); } });
    }
    return steps;
  }
};

/* =============================== explainer (Full): why not 4 1/4? =============================== */
const AREA = { a: [[2, 1, 2], [2, 1, 2]], b: [[1, 1, 2], [2, 1, 2]] };
const areaWhy = {
  title: 'Why you can’t just multiply the parts',
  height: 300,
  minW: 940,
  capH: 96,
  choices: [{ v: 'a', label: T('2\\tfrac12\\times2\\tfrac12') }, { v: 'b', label: T('1\\tfrac12\\times2\\tfrac12') }],
  ask: (k) => `Use an area picture: what is ${T(`${mx(...AREA[k][0])}\\times${mx(...AREA[k][1])}`)}?`,
  make(stage, k) {
    const [[aw], [bw]] = AREA[k], U = 84, x0 = 70, y0 = 18, Wd = (aw + 0.5) * U, Ht = (bw + 0.5) * U;
    const svg = svgEl('svg', { class: 'u3l1-abs', width: 940, height: 300 }); add(stage, svg, 0, 0);
    const cell = (x, y, w, hh, fill) => svgEl('rect', { x, y, width: w, height: hh, fill, stroke: EDGE, 'stroke-width': 1.5, opacity: 0 }, svg);
    const whole = [], strips = [];
    for (let i = 0; i < aw; i++) for (let j = 0; j < bw; j++) whole.push(cell(x0 + i * U, y0 + j * U, U, U, FA));
    for (let j = 0; j < bw; j++) strips.push(cell(x0 + aw * U, y0 + j * U, U / 2, U, FB));
    for (let i = 0; i < aw; i++) strips.push(cell(x0 + i * U, y0 + bw * U, U, U / 2, FB));
    const corner = cell(x0 + aw * U, y0 + bw * U, U / 2, U / 2, '#f2a39b');
    const outline = svgEl('rect', { x: x0, y: y0, width: Wd, height: Ht, fill: 'none', stroke: INK, 'stroke-width': 3.5, opacity: 0 }, svg);
    svgEl('text', { x: x0 + Wd / 2, y: y0 + Ht + 28, class: 'u3l1-al' }, svg).textContent = 'width';
    lab(stage, x0 + Wd / 2 + 52, y0 + Ht + 22, K(mxD(aw, 1, 2)), 'u3l1-ap');
    lab(stage, x0 - 30, y0 + Ht / 2, K(mxD(bw, 1, 2)), 'u3l1-ap');
    whole.forEach((r) => { r._l = hide(lab(stage, +r.getAttribute('x') + U / 2, +r.getAttribute('y') + U / 2, K('1'), 'u3l1-ap')); });
    strips.forEach((r) => { r._l = hide(lab(stage, +r.getAttribute('x') + +r.getAttribute('width') / 2, +r.getAttribute('y') + +r.getAttribute('height') / 2, K('\\frac12'), 'u3l1-ap')); });
    const cL = hide(lab(stage, x0 + aw * U + U / 4, y0 + bw * U + U / 4, K('\\tfrac14'), 'u3l1-ap sm'));
    const nW = aw * bw, nS = aw + bw, tot = fromImp(nW * 4 + nS * 2 + 1, 4);
    const exact = fromImp((2 * aw + 1) * (2 * bw + 1), 4);
    const row = (y, head, src, cls = '') => hide(lab(stage, 440, y, `<b>${head}</b> ${K(src)}`, 'u3l1-rowlab u3l1-ml ' + cls));
    const T1 = row(44, 'wrong way:', `${aw}\\times${bw}+\\frac12\\times\\frac12=${mxD(nW, 1, 4)}`, 'r');
    const T2 = row(110, 'forgotten strips:', `${nS}\\times\\frac12=${mxD(Math.floor(nS / 2), nS % 2, 2)}`, 'b');
    const T3 = row(176, 'total:', `${nW}+${mxD(Math.floor(nS / 2), nS % 2, 2)}+\\frac14=${mxD(tot.w, tot.n, 4)}`);
    const T4 = row(242, 'check:', `\\frac{${2 * aw + 1}}{2}\\times\\frac{${2 * bw + 1}}{2}=\\frac{${(2 * aw + 1) * (2 * bw + 1)}}{4}=${mxD(exact.w, exact.n, 4)}\\ \\checkmark`);
    const showCells = async (c, list) => { await fadeAttr(c, list, 1, 350, 60); for (const r of list) r._l.style.opacity = 1; };
    return [
      { cap: `${T(`${mx(aw, 1, 2)}\\times${mx(bw, 1, 2)}`)} is the area of a rectangle ${T(mx(aw, 1, 2))} wide and ${T(mx(bw, 1, 2))} tall.`, run: (c) => fadeAttr(c, outline, 1, 500) },
      { cap: `Whole × whole: ${T(`${aw}\\times${bw}=${nW}`)} full squares.`, run: (c) => showCells(c, whole) },
      { cap: `Fraction × fraction: ${T('\\tfrac12\\times\\tfrac12=\\tfrac14')}, the small corner. Multiplying only the parts gives ${T(mx(nW, 1, 4))}.`, run: async (c) => { await fadeAttr(c, corner, 1, 350); cL.style.opacity = 1; await show(c, T1); } },
      { cap: `But the <b>strips</b> were forgotten: ${nS} half-squares, ${T(`${nS}\\times\\tfrac12=${mx(Math.floor(nS / 2), nS % 2, 2)}`)}.`, run: async (c) => { await showCells(c, strips); await show(c, T2); } },
      { cap: `Total: ${T(mx(tot.w, tot.n, 4))}. Improper fractions give it straight away: ${T(`\\tfrac{${2 * aw + 1}}2\\times\\tfrac{${2 * bw + 1}}2=\\tfrac{${(2 * aw + 1) * (2 * bw + 1)}}4=${mx(exact.w, exact.n, 4)}`)}.`, run: async (c) => { await show(c, T3); await show(c, T4); } }
    ];
  }
};

/* =============================== explainer: estimate, calculate, check =============================== */
const EST = {
  e10a: { min: 0, max: 10, step: 1, lab: 1, estW: `${T('7\\tfrac78\\approx8')} and ${T('2\\tfrac13\\approx2')}`, est: 6, estHow: '8-2=6', exactHow: '7\\tfrac{21}{24}-2\\tfrac8{24}=5\\tfrac{13}{24}', ex: '5\\frac{13}{24}', exT: '5\\tfrac{13}{24}', v: 13 / 24 + 5, dec: '5.54', decHow: '13\\div24=0.5416\\ldots', lcd: '5u13⌟24', keys: ['7', 'A b/c', '7', 'A b/c', '8', '−', '2', 'A b/c', '1', 'A b/c', '3', 'ENTER'] },
  e10b: { min: 0, max: 20, step: 1, lab: 2, estW: `${T('3\\tfrac25\\approx3')} and ${T('4\\tfrac12\\approx5')} (it rounds up)`, est: 15, estHow: '3\\times5=15', exactHow: '\\tfrac{17}5\\times\\tfrac92=\\tfrac{153}{10}=15\\tfrac3{10}', ex: '15\\frac3{10}', exT: '15\\tfrac3{10}', v: 15.3, dec: '15.3', decHow: '3\\div10=0.3', lcd: '15u3⌟10', keys: ['3', 'A b/c', '2', 'A b/c', '5', '×', '4', 'A b/c', '1', 'A b/c', '2', 'ENTER'] },
  e11a: { claim: true, min: 50, max: 80, step: 1, lab: 5 },
  e11c: { decimal: true }
};
const lcdBox = (stage, x, y, top) => {
  const b = hide(lab(stage, x, y, `<div class="top">${top}</div><div class="v">&nbsp;</div>`, 'u3l1-lcd'));
  return { b, v: b.querySelector('.v') };
};
const estCheck = {
  title: 'Estimate, calculate, check',
  height: 330,
  minW: 940,
  capH: 96,
  choices: [{ sep: 'Check:' }, { v: 'e10a', label: 'Example 10(a)' }, { v: 'e10b', label: '10(b)' }, { v: 'e11a', label: 'Example 11(a)' }, { v: 'e11c', label: '11(c)' }],
  ask: (k) => ({
    e10a: `Example 10(a): ${T('7\\tfrac78-2\\tfrac13')}. Estimate, then find the exact answer as a mixed number and as a decimal. Check with the calculator.`,
    e10b: `Example 10(b): ${T('3\\tfrac25\\times4\\tfrac12')}. Estimate, then find the exact answer as a mixed number and as a decimal. Check with the calculator.`,
    e11a: `Example 11(a): 3 boards of ${T('23\\tfrac58')} in. Jesse says the seat is ${T('59\\tfrac78')} in. Is that reasonable?`,
    e11c: 'Example 11(c): the legs are 16.375 in long. Write this as a mixed number of inches.'
  })[k],
  make(stage, k) {
    const E = EST[k];
    const svg = svgEl('svg', { class: 'u3l1-abs', width: 940, height: 330 }); add(stage, svg, 0, 0);
    if (E.decimal) {
      const t1 = hide(lab(stage, 40, 50, K('16.375=16+0.375'), 'u3l1-rowlab u3l1-ml'));
      const t2 = hide(lab(stage, 40, 118, K('0.375=\\frac{375}{1000}=\\frac{3}{8}\\quad(\\div125)'), 'u3l1-rowlab u3l1-ml'));
      const L = lcdBox(stage, 640, 14, '16.375▸F◂▸D');
      const ins = zoomInset(stage, 120, 168, 640, 150, 16, 17, 8, [{ v: 16.375, color: RED, html: `${K('16\\frac38')} in`, cls: 'r', al: 'l' }]);
      return [
        { cap: 'The whole number part is <b>16</b> in. Only the decimal part, 0.375, needs changing.', run: (c) => show(c, t1) },
        { cap: `${T('0.375=\\tfrac{375}{1000}')}. Divide the top and bottom by 125: ${T('\\tfrac38')}.`, run: (c) => show(c, t2) },
        { cap: 'Or let the calculator do it: 16.375 ENTER, then 2nd F◂▸D. The screen shows <b>16u3⌟8</b>.', run: async (c) => { await pop(c, L.b); L.v.textContent = '16u3⌟8'; await pulse(c, L.b, 1.05); } },
        { cap: `Find ${T('16\\tfrac38')} in on the tape: 3 eighth-marks past 16. The legs are <b>${T('16\\tfrac38')} in</b> long.`, run: (c) => pop(c, ins) }
      ];
    }
    const x0 = 70, x1 = 870, ly = 230, px = (v) => x0 + (x1 - x0) * (v - E.min) / (E.max - E.min);
    const nl = svgEl('g', {}, svg);
    svgEl('line', { x1: x0 - 20, x2: x1 + 20, y1: ly, y2: ly, stroke: INK, 'stroke-width': 3 }, nl);
    for (let v = E.min; v <= E.max; v += E.step) {
      const big = (v - E.min) % E.lab === 0;
      svgEl('line', { x1: px(v), x2: px(v), y1: ly - (big ? 10 : 6), y2: ly + (big ? 10 : 6), stroke: INK, 'stroke-width': big ? 2.4 : 1.4 }, nl);
      if (big) svgEl('text', { x: px(v), y: ly + 32, class: 'u3l1-tn' }, nl).textContent = v;
    }
    const dot = (v, color) => { const g = svgEl('g', { opacity: 0 }, svg); svgEl('circle', { cx: px(v), cy: ly, r: 10, fill: color, stroke: '#fff', 'stroke-width': 3 }, g); return g; };
    if (E.claim) {
      const dJ = dot(59.875, COLORS.orange), dE = dot(72, BLUE), dX = dot(70.875, RED);
      const fJ = hide(lab(stage, px(59.875), ly - 66, `Jesse: ${K('59\\frac78')}`, 'u3l1-flag k')); fJ.style.translate = '-50% 0';
      const fE = hide(lab(stage, px(72), ly - 66, 'estimate 72', 'u3l1-flag b')); fE.style.translate = '-50% 0';
      const fX = hide(lab(stage, px(70.875), ly + 40, `exact ${K('70\\frac78')}`, 'u3l1-flag r')); fX.style.translate = '-70% 0';
      const gapP = svgEl('path', { d: `M${px(59.875)} ${ly - 18} V${ly - 30} H${px(72)} V${ly - 18}`, fill: 'none', stroke: COLORS.orange, 'stroke-width': 3, opacity: 0 }, svg);
      const gapL = hide(lab(stage, (px(59.875) + px(72)) / 2, ly - 98, 'about 12 in apart', 'u3l1-note u3l1-mid'));
      const sNo = hide(stamp(stage, 'not reasonable', { x: 200, y: 80, ok: false })), sOk = hide(stamp(stage, '✓', { x: px(70.875) + 90, y: ly + 58, ok: true }));
      return [
        { cap: `Jesse says ${T('59\\tfrac78')} in. Mark it on the number line.`, run: async (c) => { await fadeAttr(c, dJ, 1, 300); await pop(c, fJ); } },
        { cap: `Estimate: ${T('23\\tfrac58\\approx24')}, and ${T('3\\times24=72')} in.`, run: async (c) => { await fadeAttr(c, dE, 1, 300); await pop(c, fE); } },
        { cap: `${T('59\\tfrac78')} in is about 12 in short of 72 in: far off. Jesse’s answer is <b>not reasonable</b>.`, run: async (c) => { await fadeAttr(c, gapP, 1, 300); await show(c, gapL); await stampIn(c, sNo); } },
        { cap: `The exact length is ${T('3\\times23\\tfrac58=70\\tfrac78')} in (70.875 in), close to the estimate of 72 in.`, run: async (c) => { await fadeAttr(c, dX, 1, 300); await pop(c, fX); await stampIn(c, sOk); } }
      ];
    }
    const dE = dot(E.est, BLUE), dX = dot(E.v, RED);
    const fE = hide(lab(stage, px(E.est), ly - 64, `estimate ${E.est}`, 'u3l1-flag b')); fE.style.translate = E.est > E.v ? '-10% 0' : '-90% 0';
    const fX = hide(lab(stage, px(E.v), ly + 40, `${K(E.ex)} ≈ ${E.dec}`, 'u3l1-flag r')); fX.style.translate = E.est > E.v ? '-90% 0' : '-10% 0';
    const tEx = hide(lab(stage, 40, 40, K(`\\text{exact: }${E.exactHow.replace(/tfrac/g, 'frac')}`), 'u3l1-rowlab u3l1-ml'));
    const tDe = hide(lab(stage, 40, 104, K(E.decHow), 'u3l1-rowlab u3l1-ml'));
    const L = lcdBox(stage, 640, 14, E.keys.slice(0, -1).join('').replace(/A b\/c/g, '⌟'));
    const sOk = hide(stamp(stage, '✓ reasonable', { x: 250, y: 165, ok: true }));
    return [
      { cap: `Estimate first. Round each number to the nearest whole: ${E.estW}. ${T(E.estHow)}.`, run: async (c) => { await fadeAttr(c, dE, 1, 300); await pop(c, fE); } },
      { cap: `Calculate exactly: ${T(E.exactHow)}.`, run: (c) => show(c, tEx) },
      { cap: `As a decimal to the nearest hundredth: ${T(E.decHow)}, so ${T(E.exT)} ${T('\\approx')} <b>${E.dec}</b>.`, run: async (c) => { await show(c, tDe); await fadeAttr(c, dX, 1, 300); await pop(c, fX); } },
      { cap: `Check with the calculator: ${E.keys.join(' ')}. The screen shows <b>${E.lcd}</b>, the same answer.`, run: async (c) => { await pop(c, L.b); L.v.textContent = E.lcd; await pulse(c, L.b, 1.05); } },
      { cap: `${E.dec} is close to the estimate of ${E.est}, so the answer is <b>reasonable</b>.`, run: (c) => stampIn(c, sOk) }
    ];
  }
};

/* =============================== wiring =============================== */
mountFigures();
mountExplainers({ bars, convert, lcd, addBars, tape, subBars, flipTrap, multiply, areaWhy, estCheck });

/* ============ Stand Up Break! — changing forms, adding/subtracting with regrouping, multiplying ============ */
{
  const DEN = [2, 3, 4, 5, 6, 8];
  const PAIRS = [[2, 4], [4, 8], [2, 8], [3, 6], [2, 3], [3, 4], [4, 4], [8, 8], [6, 6]];
  const mxT = (o) => mx(o.w, o.n, o.d);
  standup('u3l1', {
    intro: 'Show every step on the whiteboard. Common denominator first, and regroup when you need to.',
    levels: {
      BEG: (r) => {
        const d = r.pick(DEN), w = r.int(2, 9), n = r.int(1, d - 1), N = w * d + n, s = simp({ w, n, d });
        if (r.chance(0.5)) return { text: 'Write as a mixed number in simplest form.', q: `\\frac{${N}}{${d}}`, a: [`${N}\\div${d}=${w}\\text{ R }${n}`, `\\frac{${N}}{${d}}=${mx(w, n, d)}${s.d !== d ? `=${mxT(s)}` : ''}`] };
        const n2 = s.n, d2 = s.d, N2 = w * d2 + n2;
        return { text: 'Write as an improper fraction.', q: mxD(w, n2, d2), a: [`\\frac{${w}\\times${d2}+${n2}}{${d2}}=\\frac{${N2}}{${d2}}`] };
      },
      PRG: (r) => {
        const [d1, d2] = r.shuffle(r.pick(PAIRS)), D = lcm(d1, d2);
        const n1 = r.int(1, d1 - 1), n2 = r.int(1, d2 - 1), w1 = r.int(3, 9), w2 = r.int(1, w1 - 1);
        const a1 = n1 * D / d1, a2 = n2 * D / d2;
        if (r.chance(0.5)) {
          const S = a1 + a2, R = fromImp((w1 + w2) * D + S, D), F = simp(R);
          return { text: 'Add. Write the answer in simplest form.', q: `${mxD(w1, n1, d1)}+${mxD(w2, n2, d2)}`,
            a: [`${mx(w1, a1, D)}+${mx(w2, a2, D)}=${w1 + w2}${fr(S, D)}`].concat(S >= D ? [`=${mx(R.w, R.n, D)}`] : []).concat(R.n && gcd(R.n, D) > 1 ? [`=${mxT(F)}`] : []) };
        }
        const top = a1 < a2 ? a1 + D : a1, W = (a1 < a2 ? w1 - 1 : w1) - w2, Rn = top - a2, F = simp({ w: W, n: Rn, d: D });
        return { text: 'Subtract. Regroup if you need to.', q: `${mxD(w1, n1, d1)}-${mxD(w2, n2, d2)}`,
          a: [`${mx(w1, a1, D)}-${mx(w2, a2, D)}`].concat(a1 < a2 ? [`=${w1 - 1}${fr(top, D)}-${mx(w2, a2, D)}`] : []).concat([`=${mx(W, Rn, D)}`]).concat(Rn && gcd(Rn, D) > 1 ? [`=${mxT(F)}`] : []) };
      },
      MAS: (r) => r.pick([
        () => { const k = r.int(3, 6), d = r.pick([4, 8]), w = r.int(1, 3), n = r.pick(d === 4 ? [1, 3] : [1, 3, 5, 7]), N = w * d + n, R = fromImp(k * N, d), F = simp(R);
          return { text: `A recipe needs <b>${T(mx(w, n, d))} cups</b> of flour. How much flour is needed for <b>${k} batches</b>?`, q: '',
            a: [`${k}\\times${mx(w, n, d)}=\\frac{${k}}{1}\\times\\frac{${N}}{${d}}=\\frac{${k * N}}{${d}}`, `=${mx(R.w, R.n, d)}${R.n && gcd(R.n, d) > 1 ? `=${mxT(F)}` : ''}\\text{ cups}`] }; },
        () => { const L = r.pick([60, 84, 96, 120]), p1 = { w: r.int(18, 30), n: r.pick([1, 3, 5, 7]), d: 8 }, p2 = { w: r.int(14, 24), n: r.pick([1, 3]), d: 4 };
          const a2 = p2.n * 2, S = p1.n + a2, used = fromImp((p1.w + p2.w) * 8 + S, 8), left = fromImp(L * 8 - imp(used), 8), Fl = simp(left), Fu = simp(used);
          return { text: `A <b>${L} in</b> board has two pieces cut from it: <b>${T(mx(p1.w, p1.n, 8))} in</b> and <b>${T(mx(p2.w, p2.n, 4))} in</b>. Ignoring the saw cuts, how much is left?`, q: '',
            a: [`${mx(p1.w, p1.n, 8)}+${mx(p2.w, a2, 8)}=${p1.w + p2.w}${fr(S, 8)}=${mxT(Fu)}\\text{ in used}`, `${L}-${mx(used.w, used.n, 8)}=${L - 1}${fr(8, 8)}-${mx(used.w, used.n, 8)}=${mxT(Fl)}\\text{ in left}`] }; },
        () => { const a = { w: r.int(1, 4), n: 1, d: r.pick([2, 3, 4]) }, b = { w: r.int(1, 4), n: 1, d: 2 }, Pn = imp(a) * imp(b), Pd = a.d * b.d, R = fromImp(Pn, Pd), F = simp(R);
          return { text: 'Multiply. Write the answer in simplest form. Estimate first!', q: `${mxD(a.w, a.n, a.d)}\\times${mxD(b.w, b.n, b.d)}`,
            a: [`\\frac{${imp(a)}}{${a.d}}\\times\\frac{${imp(b)}}{${b.d}}=\\frac{${Pn}}{${Pd}}`, `=${mx(R.w, R.n, Pd)}${R.n && gcd(R.n, Pd) > 1 ? `=${mxT(F)}` : ''}`] }; }
      ])()
    }
  });
}
