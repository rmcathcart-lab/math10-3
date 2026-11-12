/* Math 10-3 · Unit 1 · Lesson 2 — Fractions Refresher: Equivalent Fractions and Simplest Form (refresher, no N1 box).
 * Static pictures for Example 1 and the uneven-pizza tip, the Math History animation (the fraction bar and ÷), and the
 * explainers:
 *   fracMean   (count the equal parts → denominator, count the shaded ones → numerator; pizza, crew, Example 1 checks),
 *   splitMerge (bars that split to show 1/2 = 2/4 = 4/8 and 2/3 = 8/12, and merge 15/20 into 3/4),
 *   addTrap    (Full notes: adding to top and bottom changes the amount; multiplying doesn't),
 *   missing    (scale arrows ×k between two fractions; Example 2(b)(c)(d) and Kenji's simplify-then-scale, Example 3),
 *   gcf        (factor pairs → common factors → GCF → group the pieces → simplest form; Examples 4 and 5),
 *   steps      (Full notes: no GCF? divide by small common factors again and again),
 *   fracDec    (a division machine: top ÷ bottom → decimal on a number line; and decimal → fraction by place value; Ex. 6),
 *   compare    (pizza slices 1/8 vs 1/5, common-denominator bars, decimals digit by digit, wrenches on a ruler; Ex. 7, 8),
 *   ofAmount   (a tape split into equal parts, then take some of them; the notes and Example 9),
 *   gasGauge   (Dana's tank: the gauge needle, the tank in quarters and a pump counting litres and dollars; Example 10).
 * Colours: shaded parts amber, second fraction blue, the answer red, the GCF gold. */
import { h, tex, add, stamp, stampIn, mountExplainers, pop, fadeIn, appear, sleep, tween, svgEl, pulse, shake, anim, COLORS } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const K = (src) => {
  try { return window.katex.renderToString('\\displaystyle ' + String(src), { throwOnError: false, strict: 'ignore', output: 'html' }); }
  catch (e) { return tex(src); }
};
const INK = COLORS.ink, RED = COLORS.red, BLUE = COLORS.blue, GRN = COLORS.green, AMB = COLORS.amber, BRN = COLORS.brand;
const FA = '#f2b84b', FB = '#8fb0ec', FE = '#fffdf8';      // shaded (amber), second fraction (blue), empty
const hide = (el) => { el.style.opacity = 0; return el; };
const show = (c, el) => fadeIn(c, el, 320);
const lab = (host, x, y, html, cls = '') => { const d = h('div', 'u1l2-abs ' + cls, html); d.style.left = x + 'px'; d.style.top = y + 'px'; host.appendChild(d); return d; };
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const F = (n, d) => `\\frac{${n}}{${d}}`;
const factorsOf = (n) => { const out = []; for (let k = 1; k <= n; k++) if (n % k === 0) out.push(k); return out; };
const pairsOf = (n) => { const out = []; for (let k = 1; k * k <= n; k++) if (n % k === 0) out.push([k, n / k]); return out; };
const ord = (d) => ({ 2: 'halves', 3: 'thirds', 4: 'fourths', 5: 'fifths', 6: 'sixths', 8: 'eighths', 10: 'tenths', 12: 'twelfths', 16: 'sixteenths', 20: 'twentieths', 100: 'hundredths', 1000: 'thousandths' }[d] || d + 'ths');
const money = (v) => '\\$' + v.toFixed(2);
const r3 = (v) => Math.round(v * 1000) / 1000;
const trunc3 = (v) => { const t = Math.floor(v * 1000 + 1e-9) / 1000; return Math.abs(t - v) < 1e-9 ? String(t) : t.toFixed(3) + '\\ldots'; };

/* =============================== pictures (SVG): bar, grid, pie, set, people =============================== */
/* draws into an SVG group; returns { g, parts: [{ el, cx, cy, sh }] }. spec: { kind, d, n | filled, cols, rows } */
function pic(parent, spec, o = {}) {
  const g = svgEl('g', { transform: `translate(${o.x || 0} ${o.y || 0})` }, parent), parts = [];
  const shadeCol = o.color || FA, S = o.size || 1;
  const sh = (i) => (spec.filled ? spec.filled.includes(i + 1) : i < spec.n);
  if (spec.kind === 'bar') {
    const w = 300 * S, hh = 56 * S, pw = w / spec.d;
    for (let i = 0; i < spec.d; i++) { const r = svgEl('rect', { x: i * pw, y: 0, width: pw, height: hh, fill: sh(i) ? shadeCol : FE, stroke: INK, 'stroke-width': 2.5 }, g); parts.push({ el: r, cx: (i + 0.5) * pw, cy: hh / 2, sh: sh(i) }); }
  } else if (spec.kind === 'grid') {
    const s = 50 * S;
    for (let r = 0; r < spec.rows; r++) for (let c = 0; c < spec.cols; c++) {
      const i = r * spec.cols + c, el = svgEl('rect', { x: c * s, y: r * s, width: s, height: s, fill: sh(i) ? shadeCol : FE, stroke: INK, 'stroke-width': 2.5 }, g);
      parts.push({ el, cx: (c + 0.5) * s, cy: (r + 0.5) * s, sh: sh(i) });
    }
  } else if (spec.kind === 'pie') {
    const R = 80 * S, pg = svgEl('g', { transform: `translate(${R} ${R})` }, g);
    for (let i = 0; i < spec.d; i++) {
      const a0 = -Math.PI / 2 + i * 2 * Math.PI / spec.d, a1 = a0 + 2 * Math.PI / spec.d, am = (a0 + a1) / 2;
      const p = `M0 0 L${R * Math.cos(a0)} ${R * Math.sin(a0)} A${R} ${R} 0 ${spec.d === 1 ? 1 : 0} 1 ${R * Math.cos(a1)} ${R * Math.sin(a1)} Z`;
      const el = svgEl('path', { d: p, fill: sh(i) ? shadeCol : FE, stroke: INK, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, pg);
      parts.push({ el, cx: R + 0.6 * R * Math.cos(am), cy: R + 0.6 * R * Math.sin(am), sh: sh(i) });
    }
  } else if (spec.kind === 'set') {
    const gap = 44 * S, rr = 16 * S;
    for (let i = 0; i < spec.d; i++) { const el = svgEl('circle', { cx: rr + i * gap, cy: rr + 2, r: rr, fill: sh(i) ? '#6b6f78' : FE, stroke: INK, 'stroke-width': 2.5 }, g); parts.push({ el, cx: rr + i * gap, cy: rr + 2, sh: sh(i) }); }
  } else if (spec.kind === 'people') {
    const gap = 52 * S;
    for (let i = 0; i < spec.d; i++) {
      const o1 = svgEl('g', { transform: `translate(${i * gap} 0)` }, g), o2 = svgEl('g', { transform: `scale(${S})` }, o1), p = svgEl('g', {}, o2), col = sh(i) ? '#e8761e' : FE;
      o2.style.transformBox = 'view-box'; o2.style.transformOrigin = '0 0';
      svgEl('circle', { cx: 20, cy: 14, r: 11, fill: '#f3dcc0', stroke: INK, 'stroke-width': 2.2 }, p);
      if (sh(i)) svgEl('path', { d: 'M7 12 Q20 -6 33 12 Z', fill: '#f6c21c', stroke: INK, 'stroke-width': 2 }, p);
      svgEl('path', { d: 'M4 70 V44 Q4 29 20 29 Q36 29 36 44 V70 Z', fill: col, stroke: INK, 'stroke-width': 2.2 }, p);
      parts.push({ el: p, cx: i * gap + 20 * S, cy: 40 * S, sh: sh(i) });
    }
  }
  return { g, parts };
}
const PIC_BOX = { bar: [300, 56], grid: (s) => [s.cols * 50, s.rows * 50], pie: [160, 160], set: (s) => [s.d * 44 - 12, 36], people: (s) => [s.d * 52 - 12, 72] };
const picSize = (s, S = 1) => { const b = PIC_BOX[s.kind]; const [w, hh] = typeof b === 'function' ? b(s) : b; return [w * S, hh * S]; };
function parseSpec(str) {
  const [kind, a, b, c] = str.split(':');
  if (kind === 'bar' || kind === 'pie') return { kind, d: +a, n: +b };
  if (kind === 'grid') return { kind, cols: +a, rows: +b, d: a * b, n: +c };
  return { kind, d: +a, filled: b.split(',').map(Number) };
}
function mountPics() {
  document.querySelectorAll('.u1l2-pic[data-pic]').forEach((host) => {
    const s = parseSpec(host.dataset.pic), [w, hh] = picSize(s);
    const svg = svgEl('svg', { viewBox: `-4 -4 ${w + 8} ${hh + 8}`, role: 'img', 'aria-label': 'fraction picture' });
    pic(svg, s); host.appendChild(svg);
    host.style.setProperty('--pw', Math.min(200, w * 0.62 + 20) + 'px');
  });
  const u = document.getElementById('u1l2-uneven');
  if (u) {
    u.innerHTML = '<svg viewBox="0 0 250 104" role="img" aria-label="A pizza cut into 4 uneven pieces, crossed out, and one cut into 4 equal quarters, ticked"><g stroke="#1c2230" stroke-width="2.5" fill="#f6dc9a"><circle cx="52" cy="52" r="44"/><circle cx="178" cy="52" r="44"/></g>'
      + '<g stroke="#1c2230" stroke-width="2.5"><line x1="22" y1="20" x2="74" y2="94"/><line x1="10" y1="62" x2="94" y2="40"/><line x1="178" y1="8" x2="178" y2="96"/><line x1="134" y1="52" x2="222" y2="52"/></g>'
      + '<text x="96" y="22" font-size="30" font-weight="900" fill="#c93a33">✗</text><text x="222" y="22" font-size="30" font-weight="900" fill="#12805a">✓</text></svg>';
  }
}

/* =============================== fraction bars (SVG) for the explainers =============================== */
class FBar {
  constructor(host, o) {
    this.o = Object.assign({ h: 60 }, o);
    const { x, y, w } = this.o, hh = this.o.h;
    this.svg = svgEl('svg', { class: 'u1l2-bar', width: w + 8, height: hh + 8 }); add(host, this.svg, x - 4, y - 4);
    this.fill = svgEl('g', {}, this.svg); this.lines = svgEl('g', {}, this.svg); this.top = svgEl('g', {}, this.svg);
    svgEl('rect', { x: 4, y: 4, width: w, height: hh, fill: 'none', stroke: INK, 'stroke-width': 2.5, rx: 3 }, this.top);
  }
  px(v, d) { return 4 + this.o.w * v / d; }
  /** absolute x (stage px) of a point along the bar */
  sx(v, d) { return this.o.x + this.o.w * v / d; }
  shade(from, to, d, color = FA) { return svgEl('rect', { x: this.px(from, d), y: 4, width: this.px(to, d) - this.px(from, d), height: this.o.h, fill: color }, this.fill); }
  cuts(d, o = {}) {
    const g = svgEl('g', {}, this.lines);
    for (let i = 1; i < d; i++) { if (o.skip && i % o.skip === 0) continue; svgEl('line', { x1: this.px(i, d), x2: this.px(i, d), y1: 4, y2: 4 + this.o.h, stroke: o.color || INK, 'stroke-width': o.width || 2, 'stroke-dasharray': o.dash || '' }, g); }
    return g;
  }
  num(i, d, txt, cls = 'u1l2-pn') { const t = svgEl('text', { x: (this.px(i, d) + this.px(i + 1, d)) / 2, y: 4 + this.o.h / 2 + 6, 'text-anchor': 'middle', class: cls }, this.top); t.textContent = txt; return t; }
}
/* a stacked fraction built from HTML, so the top and the bottom can be lit separately */
function sfrac(host, x, y, top, bot, cls = '') {
  const d = h('div', 'u1l2-abs u1l2-sf ' + cls, `<span class="t">${top}</span><span class="bar"></span><span class="b">${bot}</span>`);
  d.style.left = x + 'px'; d.style.top = y + 'px'; host.appendChild(d);
  d.t = d.querySelector('.t'); d.b = d.querySelector('.b'); return d;
}
/* a curved arrow from (x1, y) to (x2, y), bulging up (dir −1) or down (dir 1), with a label */
function arc(svg, host, x1, x2, y, dir, label, color = BRN) {
  const g = svgEl('g', {}, svg), mx = (x1 + x2) / 2, bulge = 46 * dir;
  const p = svgEl('path', { d: `M${x1} ${y} Q${mx} ${y + bulge * 2} ${x2 - 6} ${y + 4 * dir}`, fill: 'none', stroke: color, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, g);
  const ang = Math.atan2(-(bulge * 2 - 4 * dir), x2 - 6 - mx), hx = x2 - 4, hy = y + 4 * dir, L = 13;
  const head = svgEl('path', { d: `M${hx} ${hy} L${hx - L * Math.cos(ang - 0.45)} ${hy - L * Math.sin(ang - 0.45)} M${hx} ${hy} L${hx - L * Math.cos(ang + 0.45)} ${hy - L * Math.sin(ang + 0.45)}`, stroke: color, 'stroke-width': 3.5, fill: 'none', 'stroke-linecap': 'round' }, g);
  const t = lab(host, mx, y + bulge + (dir < 0 ? -32 : 26), label, 'u1l2-op u1l2-mid'); t.style.color = color;
  return { g, p, head, t };
}
async function drawArc(c, a) {
  const len = a.p.getTotalLength ? a.p.getTotalLength() : 300;
  a.p.style.opacity = 1; a.p.style.strokeDasharray = len; a.p.style.strokeDashoffset = len; a.head.style.opacity = 0; a.t.style.opacity = 0;
  await anim(c, a.p, [{ strokeDashoffset: len }, { strokeDashoffset: 0 }], 520);
  await appear(c, a.head, 120); await pop(c, a.t);
}
const hideArc = (a) => { a.p.style.opacity = 0; a.head.style.opacity = 0; a.t.style.opacity = 0; };

/* =============================== explainer: what a fraction means =============================== */
const FM = {
  pz: { label: 'Pizza: 3 of 8 slices', s: { kind: 'pie', d: 8, n: 3 }, size: 1.35, what: 'shaded', ctx: '3 of the 8 slices of one pizza (part of a <b>whole</b>)' },
  crew: { label: 'Work crew: 3 of 8 people', s: { kind: 'people', d: 8, filled: [2, 5, 6] }, size: 1.05, what: 'in hard hats', ctx: '3 of the 8 people on a work crew wear hard hats (part of a <b>set</b>)' },
  sep: { sep: 'Example 1 check:' },
  a: { label: '(a)', s: { kind: 'bar', d: 8, n: 3 }, size: 1.4, what: 'shaded', ctx: 'Example 1(a): a bar' },
  b: { label: '(b)', s: { kind: 'grid', cols: 4, rows: 3, d: 12, n: 5 }, size: 1.1, what: 'shaded', ctx: 'Example 1(b): a grid' },
  c: { label: '(c)', s: { kind: 'pie', d: 6, n: 4 }, size: 1.35, what: 'shaded', ctx: 'Example 1(c): a circle' },
  d: { label: '(d)', s: { kind: 'set', d: 7, filled: [1, 4, 6] }, size: 1.3, what: 'filled', ctx: 'Example 1(d): a set of counters' }
};
const fracMean = {
  title: 'Count the parts',
  height: 310,
  minW: 900,
  choices: Object.keys(FM).map((k) => (FM[k].sep ? { sep: FM[k].sep } : { v: k, label: FM[k].label })),
  ask: (k) => `${FM[k].ctx}. What fraction is ${FM[k].what}?`,
  make(stage, k, ex) {
    const D = FM[k], s = D.s, set = s.kind === 'set' || s.kind === 'people', d = s.d, n = s.filled ? s.filled.length : s.n, W = ex.W;
    const [pw, ph] = picSize(s, D.size), left = 470;
    const svg = svgEl('svg', { class: 'u1l2-abs', width: left, height: 300, viewBox: `0 0 ${left} 300` }); add(stage, svg, 0, 0);
    const P = pic(svg, s, { x: (left - pw) / 2, y: (300 - ph) / 2, size: D.size }), ox = (left - pw) / 2, oy = (300 - ph) / 2;
    const nums = P.parts.map((p, i) => { const t = svgEl('text', { x: ox + p.cx, y: oy + p.cy + (s.kind === 'set' ? -30 * D.size : s.kind === 'people' ? 52 : 7), 'text-anchor': 'middle', class: 'u1l2-pn' }, svg); t.textContent = i + 1; hide(t); return t; });
    // the fraction builder on the right
    const fx = left + 40, box2 = h('div', 'u1l2-abs u1l2-fb', `<div class="nb"><span class="q">?</span></div><div class="nl">${set ? 'items that are ' + D.what : 'parts you have'} <b>(numerator)</b></div><div class="fl"></div><div></div><div class="db"><span class="q">?</span></div><div class="dl">${set ? 'items in the set' : 'equal parts in one whole'} <b>(denominator)</b></div>`);
    add(stage, box2, fx, 40); box2.style.width = (W - fx - 20) + 'px';
    const nb = box2.querySelector('.nb'), db = box2.querySelector('.db');
    const rest = hide(lab(stage, fx, 202, `Not ${D.what}: ${T(`${d}-${n}=${d - n}`)}, so ${T(F(d - n, d))}`, 'u1l2-line'));
    const eqn = hide(lab(stage, fx, 238, K(`${F(n, d)}+${F(d - n, d)}=${F(d, d)}=1\\text{ whole}`), 'u1l2-eqn'));
    const shadedEls = P.parts.filter((p) => p.sh);
    return [
      { cap: `Count the <b>${set ? 'items in the set' : 'equal parts'}</b>: <b>${d}</b>. That is the <b>denominator</b> (bottom number).`,
        run: async (c) => { for (const t of nums) await appear(c, t, 70); db.innerHTML = `<span>${d}</span>`; await pop(c, db.firstChild); } },
      { cap: `Count the ones that are ${D.what}: <b>${n}</b>. That is the <b>numerator</b> (top number). So ${T(F(n, d))} ${set ? 'of the set' : ''} is ${D.what}.`,
        run: async (c) => { await Promise.all(shadedEls.map((p) => pulse(c, p.el, 1.08))); nb.innerHTML = `<span>${n}</span>`; await pop(c, nb.firstChild); } },
      { cap: `The rest: ${T(`${d}-${n}=${d - n}`)} are not ${D.what}. That is ${T(F(d - n, d))}.`,
        run: (c) => show(c, rest) },
      { cap: `Together they make <b>one whole</b>: ${T(`${F(n, d)}+${F(d - n, d)}=${F(d, d)}=1`)}.`,
        run: (c) => pop(c, eqn) }
    ];
  }
};

/* =============================== explainer: bars that split and merge =============================== */
const SM = {
  half: { label: '1/2 = 2/4 = 4/8', rows: [[1, 2], [2, 4, 2], [4, 8, 2]] },
  thirds: { label: '2/3 = 8/12', rows: [[2, 3], [8, 12, 4]] },
  merge: { label: '15/20 = 3/4 (merge)', rows: [[15, 20], [3, 4, -5]] }
};
const splitMerge = {
  title: 'Same amount, different pieces',
  height: 356,
  minW: 900,
  capH: 92,
  choices: Object.keys(SM).map((k) => ({ v: k, label: SM[k].label.replace(/(\d+)\/(\d+)/g, (m, a, b) => T(`\\tfrac{${a}}{${b}}`)) })),
  ask: (k) => (k === 'merge' ? `Why is ${T('\\tfrac{15}{20}=\\tfrac34')}?` : k === 'half' ? `Why is ${T('\\tfrac12=\\tfrac24=\\tfrac48')}?` : `Why is ${T('\\tfrac23=\\tfrac{8}{12}')}?`),
  make(stage, k, ex) {
    const R = SM[k].rows, W = ex.W, x0 = 150, w = W - 330, bh = 58;
    const ys = R.length === 3 ? [18, 112, 206] : [40, 170];
    const bars = [], labs = [], ops = [];
    R.forEach(([n, d, kk], i) => {
      const B = new FBar(stage, { x: x0, y: ys[i], w, h: bh });
      const sh = B.shade(0, n, d); const cut = B.cuts(d, { width: kk < 0 ? 4 : 2.5 });
      const L = lab(stage, 72, ys[i] + bh / 2, K(F(n, d)), 'u1l2-flab u1l2-mid');
      bars.push({ B, sh, cut, n, d, kk }); labs.push(L);
      if (i) { hide(B.svg); hide(L); const op = kk > 0 ? `\\times${kk}` : `\\div${-kk}`; ops.push(hide(lab(stage, x0 + w + 80, ys[i] + bh / 2, `${T(op)}<small>top and bottom</small>`, 'u1l2-op u1l2-mid u1l2-optag'))); }
    });
    const edge = bars[0].B.sx(bars[0].n, bars[0].d), yEnd = ys[ys.length - 1] + bh + 10;
    const vline = svgEl('svg', { class: 'u1l2-abs', width: 6, height: yEnd - ys[0] + 20 }); add(stage, vline, edge - 3, ys[0] - 10);
    svgEl('line', { x1: 3, x2: 3, y1: 0, y2: yEnd - ys[0] + 20, stroke: RED, 'stroke-width': 3, 'stroke-dasharray': '7 5' }, vline); hide(vline);
    const chain = R.map(([n, d]) => F(n, d)).join('=');
    const eqn = hide(lab(stage, W / 2, 314, K(chain), 'u1l2-eqn u1l2-mid'));
    let g0 = null; // merge: the group lines drawn on the first bar
    if (k === 'merge') { g0 = bars[0].B.cuts(R[1][1], { width: 5, color: BRN }); hide(g0); }
    const steps = [{ cap: `${T(F(R[0][0], R[0][1]))}: ${R[0][1]} equal pieces, ${R[0][0]} shaded.`, run: async (c) => { await pulse(c, labs[0], 1.12); } }];
    if (k === 'merge') {
      const [, [n1, d1, kk]] = R, g = -kk;
      steps.push({ cap: `${g} divides both 15 and 20. <b>Group</b> the pieces in ${g}s.`, run: (c) => appear(c, g0, 500) });
      steps.push({ cap: `Now there are ${T(`20\\div${g}=${d1}`)} big pieces, and ${T(`15\\div${g}=${n1}`)} of them are shaded: ${T(F(n1, d1))}.`,
        run: async (c) => { await show(c, bars[1].B.svg); await show(c, labs[1]); await pop(c, ops[0]); } });
    } else {
      for (let i = 1; i < R.length; i++) {
        const [n, d, kk] = R[i], prev = R[i - 1];
        steps.push({ cap: `Cut <b>every</b> piece into ${kk}. Now there are ${T(`${prev[1]}\\times${kk}=${d}`)} pieces, and ${T(`${prev[0]}\\times${kk}=${n}`)} are shaded: ${T(F(n, d))}.`,
          run: async (c) => {
            const b = bars[i]; b.cut.style.opacity = 0; await show(c, b.B.svg);
            const thick = b.B.cuts(prev[1], { width: 4 }); await sleep(c, 150);
            await appear(c, b.cut, 450); thick.remove(); await show(c, labs[i]); await pop(c, ops[i - 1]);
          } });
      }
    }
    steps.push({ cap: `The shaded part is the <b>same size</b> in every bar, so ${T(chain)}. We ${k === 'merge' ? 'divided' : 'multiplied'} the top and the bottom by the <b>same</b> number.`,
      run: async (c) => { await appear(c, vline, 300); await pop(c, eqn); } });
    return steps;
  }
};

/* =============================== explainer (Full notes): adding doesn't work =============================== */
const AT = {
  h: { label: T('\\tfrac12') + ': add 1?', n: 1, d: 2, add: 1, mul: 2 },
  t: { label: T('\\tfrac13') + ': add 2?', n: 1, d: 3, add: 2, mul: 3 }
};
const addTrap = {
  title: 'Why adding does not work',
  height: 330,
  minW: 900,
  choices: Object.keys(AT).map((k) => ({ v: k, label: AT[k].label })),
  ask: (k) => { const D = AT[k]; return `Is ${T(F(D.n, D.d))} equal to ${T(F(`${D.n}+${D.add}`, `${D.d}+${D.add}`))}?`; },
  make(stage, k, ex) {
    const D = AT[k], W = ex.W, x0 = 150, w = W - 460, bh = 58, ys = [18, 118, 218];
    const rows = [[D.n, D.d], [D.n + D.add, D.d + D.add], [D.n * D.mul, D.d * D.mul]];
    const B = rows.map(([n, d], i) => { const b = new FBar(stage, { x: x0, y: ys[i], w, h: bh }); b.shade(0, n, d, i === 1 ? '#f0a39d' : FA); b.cuts(d); if (i) hide(b.svg); return b; });
    const L = rows.map(([n, d], i) => { const l = lab(stage, 75, ys[i] + bh / 2, K(F(n, d)), 'u1l2-flab u1l2-mid'); if (i) hide(l); return l; });
    const tagA = hide(lab(stage, x0 + w + 20, ys[1] + bh / 2, `${T(`+${D.add}`)} <small>top and bottom</small>`, 'u1l2-op u1l2-ml u1l2-optag')); tagA.style.color = RED;
    const tagM = hide(lab(stage, x0 + w + 20, ys[2] + bh / 2, `${T(`\\times${D.mul}`)} <small>top and bottom</small>`, 'u1l2-op u1l2-ml u1l2-optag'));
    const edge = x0 + w * D.n / D.d;
    const vl = svgEl('svg', { class: 'u1l2-abs', width: 6, height: 300 }); add(stage, vl, edge - 3, 6); svgEl('line', { x1: 3, x2: 3, y1: 0, y2: 290, stroke: INK, 'stroke-width': 3, 'stroke-dasharray': '7 5' }, vl); hide(vl);
    const no = stamp(stage, '✗ not the same', { ok: false, x: W - 108, y: ys[1] + bh / 2, size: 'sm' }); hide(no);
    const yes = stamp(stage, '✓ same amount', { ok: true, x: W - 108, y: ys[2] + bh / 2, size: 'sm' }); hide(yes);
    return [
      { cap: `Start with ${T(F(D.n, D.d))}. The dashed line marks how much is shaded.`, run: (c) => appear(c, vl, 300) },
      { cap: `Add ${D.add} to the top and the bottom: ${T(`${F(`${D.n}+${D.add}`, `${D.d}+${D.add}`)}=${F(D.n + D.add, D.d + D.add)}`)}. More is shaded! The amount <b>changed</b>.`,
        run: async (c) => { await show(c, B[1].svg); await show(c, L[1]); await show(c, tagA); await stampIn(c, no); } },
      { cap: `Multiply the top and the bottom by ${D.mul} instead: ${T(`${F(`${D.n}\\times${D.mul}`, `${D.d}\\times${D.mul}`)}=${F(D.n * D.mul, D.d * D.mul)}`)}. Exactly the same amount ✓`,
        run: async (c) => { await show(c, B[2].svg); await show(c, L[2]); await show(c, tagM); await stampIn(c, yes); } }
    ];
  }
};

/* =============================== explainer: missing number with scale arrows =============================== */
const MS = {
  b: { label: 'Example 2(b)', f1: [2, 3], f2: ['?', 18], side: 'b', k: 6, op: '×' },
  c: { label: '(c)', f1: [20, 32], f2: [5, '?'], side: 't', k: 4, op: '÷' },
  d: { label: '(d)', f1: [4, 7], f2: [36, '?'], side: 't', k: 9, op: '×' },
  e3: { label: 'Example 3: Kenji', kenji: true }
};
const missing = {
  title: 'What was it multiplied by?',
  height: 366,
  minW: 900,
  capH: 92,
  choices: Object.keys(MS).map((k) => ({ v: k, label: MS[k].label })),
  ask: (k) => (MS[k].kenji ? `Kenji got 15 of 20 right. At the same rate, how many of 28? ${T('\\tfrac{15}{20}=\\tfrac{\\square}{28}')}` : `Find the missing number: ${T(`\\tfrac{${MS[k].f1[0]}}{${MS[k].f1[1]}}=\\tfrac{${MS[k].f2[0] === '?' ? '\\square' : MS[k].f2[0]}}{${MS[k].f2[1] === '?' ? '\\square' : MS[k].f2[1]}}`)}`),
  make(stage, k, ex) {
    const W = ex.W, D = MS[k], yc = 150;
    const svg = svgEl('svg', { class: 'u1l2-abs', width: W, height: 350 }); add(stage, svg, 0, 0);
    const Q = '<span class="u1l2-box">?</span>';
    if (!D.kenji) {
      const x1 = W / 2 - 150, x2 = W / 2 + 150;
      const f1 = sfrac(stage, x1, yc, D.f1[0], D.f1[1]), f2 = sfrac(stage, x2, yc, D.f2[0] === '?' ? Q : D.f2[0], D.f2[1] === '?' ? Q : D.f2[1]);
      lab(stage, W / 2, yc, K('='), 'u1l2-eqsign u1l2-mid');
      const known = D.side === 'b' ? [D.f1[1], D.f2[1]] : [D.f1[0], D.f2[0]], other = D.side === 'b' ? D.f1[0] : D.f1[1];
      const ans = D.op === '×' ? other * D.k : other / D.k, opT = D.op === '×' ? '\\times' : '\\div';
      const word = D.op === '×' ? 'multiplied' : 'divided', sideW = D.side === 'b' ? 'bottoms' : 'tops', otherW = D.side === 'b' ? 'top' : 'bottom';
      const aK = arc(svg, stage, x1 + 36, x2 - 36, D.side === 'b' ? yc + 40 : yc - 40, D.side === 'b' ? 1 : -1, T(`${opT}\\,?`));
      const aO = arc(svg, stage, x1 + 36, x2 - 36, D.side === 'b' ? yc - 40 : yc + 40, D.side === 'b' ? -1 : 1, T(`${opT}${D.k}`));
      hideArc(aK); hideArc(aO);
      const final = D.side === 'b' ? [ans, D.f2[1]] : [D.f2[0], ans];
      const eqn = hide(lab(stage, W / 2, 322, `${K(`${F(D.f1[0], D.f1[1])}=${F(final[0], final[1])}`)} <span class="u1l2-mut">Check: ${T(`${D.f1[0]}\\div${D.f1[1]}`)} and ${T(`${final[0]}\\div${final[1]}`)} both give ${T(trunc3(D.f1[0] / D.f1[1]))}</span>`, 'u1l2-eqn u1l2-mid'));
      const kn1 = D.side === 'b' ? f1.b : f1.t, kn2 = D.side === 'b' ? f2.b : f2.t, un = D.side === 'b' ? f2.t : f2.b, ot = D.side === 'b' ? f1.t : f1.b;
      return [
        { cap: `Look at the two numbers we know: the <b>${sideW}</b>, ${known[0]} → ${known[1]}. What was ${known[0]} ${word} by?`,
          run: async (c) => { kn1.classList.add('lit'); kn2.classList.add('lit'); await Promise.all([pulse(c, kn1, 1.2), pulse(c, kn2, 1.2)]); await drawArc(c, aK); } },
        { cap: `${T(`${known[0]}${opT}${D.k}=${known[1]}`)}. The jump is <b>${D.op} ${D.k}</b>.`,
          run: async (c) => { aK.t.innerHTML = T(`${opT}${D.k}`); await pop(c, aK.t); } },
        { cap: `Do the <b>same</b> to the ${otherW}: ${T(`${other}${opT}${D.k}=${ans}`)}.`,
          run: async (c) => { ot.classList.add('lit2'); await drawArc(c, aO); un.innerHTML = `<span class="u1l2-ans">${ans}</span>`; await pop(c, un.firstChild); } },
        { cap: `So ${T(`${F(D.f1[0], D.f1[1])}=${F(final[0], final[1])}`)}. The calculator agrees: both fractions are the same number.`,
          run: (c) => pop(c, eqn) }
      ];
    }
    // Kenji: 15/20 = ?/28 → the jump 1.4 is not whole → simplify to 3/4 → ×7
    const x1 = W / 2 - 300, x2 = W / 2, x3 = W / 2 + 300;
    const f1 = sfrac(stage, x1, yc, 15, 20), f3 = sfrac(stage, x3, yc, Q, 28), f2 = hide(sfrac(stage, x2, yc, 3, 4, 'u1l2-sfb'));
    const eqA = lab(stage, (x1 + x3) / 2, yc, K('='), 'u1l2-eqsign u1l2-mid'), eqB = hide(lab(stage, (x1 + x2) / 2, yc, K('='), 'u1l2-eqsign u1l2-mid')), eqC = hide(lab(stage, (x2 + x3) / 2, yc, K('='), 'u1l2-eqsign u1l2-mid'));
    const bad = arc(svg, stage, x1 + 40, x3 - 40, yc + 40, 1, T('\\times\\,?'), RED); hideArc(bad);
    const d1 = arc(svg, stage, x1 + 40, x2 - 40, yc - 40, -1, T('\\div5')), d2 = arc(svg, stage, x1 + 40, x2 - 40, yc + 40, 1, T('\\div5'));
    const m1 = arc(svg, stage, x2 + 40, x3 - 40, yc + 40, 1, T('\\times7')), m2 = arc(svg, stage, x2 + 40, x3 - 40, yc - 40, -1, T('\\times7'));
    [d1, d2, m1, m2].forEach(hideArc);
    const fin = hide(lab(stage, W / 2, 322, `Kenji would get <b>21 of the 28</b> questions right.`, 'u1l2-eqn u1l2-mid'));
    return [
      { cap: `Look at the bottoms: 20 → 28. What times 20 makes 28?`,
        run: async (c) => { f1.b.classList.add('lit'); f3.b.classList.add('lit'); await drawArc(c, bad); } },
      { cap: `${T('28\\div20=1.4')}. That is <b>not a whole number</b>, so it’s hard to use. <b>Simplify first.</b>`,
        run: async (c) => { bad.t.innerHTML = T('\\times1.4\\ ?'); await shake(c, bad.t); await sleep(c, 300); await Promise.all([appear(c, bad.p, 1).then(() => anim(c, bad.p, [{ opacity: 1 }, { opacity: 0.12 }], 300)), anim(c, bad.head, [{ opacity: 1 }, { opacity: 0.12 }], 300), anim(c, bad.t, [{ opacity: 1 }, { opacity: 0.12 }], 300)]); } },
      { cap: `Step 1: Simplify. 5 divides 15 and 20: ${T('\\frac{15\\div5}{20\\div5}=\\frac34')}.`,
        run: async (c) => { f1.b.classList.remove('lit'); f3.b.classList.remove('lit'); eqA.style.opacity = 0; bad.g.style.opacity = 0; bad.t.style.opacity = 0; await show(c, eqB); await show(c, f2); await show(c, eqC); await drawArc(c, d1); await drawArc(c, d2); } },
      { cap: `Step 2: Scale up. Bottoms: 4 → 28, and ${T('4\\times7=28')}. The jump is <b>× 7</b>.`,
        run: async (c) => { f2.b.classList.add('lit'); f3.b.classList.add('lit'); await drawArc(c, m1); } },
      { cap: `Do the same to the top: ${T('3\\times7=21')}, so ${T('\\frac{15}{20}=\\frac34=\\frac{21}{28}')}.`,
        run: async (c) => { await drawArc(c, m2); f3.t.innerHTML = '<span class="u1l2-ans">21</span>'; await pop(c, f3.t.firstChild); await pop(c, fin); } }
    ];
  }
};

/* =============================== explainer: factor pairs, the GCF, simplest form =============================== */
const GC = {
  e4a: { label: 'Example 4(a)', n: 24, d: 40 },
  e4b: { label: '(b)', n: 18, d: 45 },
  e4c: { label: '(c)', n: 35, d: 56 },
  e4d: { label: '(d)', n: 40, d: 100 },
  e5: { label: 'Example 5: Rosa', n: 27, d: 36, ctx: 'Rosa: 27 of her 36 hours on the job site.' }
};
const gcf = {
  title: 'Find the GCF, then divide',
  height: 380,
  minW: 900,
  capH: 92,
  choices: Object.keys(GC).map((k) => ({ v: k, label: GC[k].label })),
  ask: (k) => `${GC[k].ctx ? GC[k].ctx + ' ' : ''}Write ${T(`\\tfrac{${GC[k].n}}{${GC[k].d}}`)} in simplest form.`,
  make(stage, k, ex) {
    const { n, d } = GC[k], g = gcd(n, d), W = ex.W;
    const row = (m, y) => {
      const r = add(stage, h('div', 'u1l2-abs u1l2-frow'), 30, y);
      const fs = factorsOf(m);
      r.innerHTML = `<b>Factors of ${m}:</b> ` + fs.map((f) => `<span class="u1l2-fac${n % f === 0 && d % f === 0 ? ' u1l2-common' : ''}${f === g ? ' u1l2-gcf' : ''}" data-f="${f}">${f}</span>`).join('');
      r.querySelectorAll('.u1l2-fac').forEach(hide);
      return r;
    };
    const r1 = row(n, 14), r2 = row(d, 70);
    const commons = factorsOf(g).filter((f) => n % f === 0 && d % f === 0);
    const gl = hide(lab(stage, 30, 128, `Common factors: ${commons.join(', ')}. &nbsp;The greatest: <b class="u1l2-gold">GCF = ${g}</b>`, 'u1l2-line'));
    const bx = 120, bw = W - 240, B = new FBar(stage, { x: bx, y: 186, w: bw, h: 60 });
    B.shade(0, n, d); B.cuts(d, { width: d > 60 ? 1 : 1.6, color: '#7a7f89' }); const thick = B.cuts(d / g, { width: 5, color: BRN }); hide(thick);
    hide(B.svg);
    const bl = lab(stage, 64, 216, K(F(n, d)), 'u1l2-flab u1l2-mid u1l2-sm'); hide(bl);
    const grp = hide(lab(stage, W / 2, 272, `${d / g} groups of ${g}; ${n / g} groups shaded`, 'u1l2-mut u1l2-mid'));
    const eqn = hide(lab(stage, W / 2, 330, K(`${F(n, d)}=${F(`${n}\\div${g}`, `${d}\\div${g}`)}=${F(n / g, d / g)}`), 'u1l2-eqn u1l2-mid'));
    const pairsT = (m) => pairsOf(m).map(([a, b]) => T(`${a}\\times${b}`)).join(', ');
    const revealPairs = async (c, r, m) => { for (const [a, b] of pairsOf(m)) { const ea = r.querySelector(`[data-f="${a}"]`), eb = r.querySelector(`[data-f="${b}"]`); await Promise.all([pop(c, ea), pop(c, eb)]); await sleep(c, 120); } };
    return [
      { cap: `Factors of ${n} come in pairs: ${pairsT(n)}.`, run: (c) => revealPairs(c, r1, n) },
      { cap: `Factors of ${d} in pairs: ${pairsT(d)}.`, run: (c) => revealPairs(c, r2, d) },
      { cap: `The <b>common</b> factors are ${commons.join(', ')}. The <b>greatest</b> is <b>${g}</b>, so the GCF is ${g}.`,
        run: async (c) => { r1.classList.add('u1l2-lit'); r2.classList.add('u1l2-lit'); await sleep(c, 300); await show(c, gl); } },
      { cap: `Group the ${d} pieces in ${g}s: ${T(`${d}\\div${g}=${d / g}`)} groups, and ${T(`${n}\\div${g}=${n / g}`)} of them are shaded.`,
        run: async (c) => { await show(c, B.svg); await show(c, bl); await appear(c, thick, 600); await show(c, grp); } },
      { cap: `Divide the top and the bottom by the GCF: ${T(`${F(n, d)}=${F(n / g, d / g)}`)}. Only 1 divides both ${n / g} and ${d / g}: <b>simplest form</b> ✓`,
        run: (c) => pop(c, eqn) }
    ];
  }
};

/* =============================== explainer (Full notes): divide in steps =============================== */
const ST = {
  a: { label: T('\\tfrac{40}{100}') + ': ÷10, ÷2', n: 40, d: 100, ks: [10, 2] },
  b: { label: T('\\tfrac{24}{40}') + ': ÷2, ÷2, ÷2', n: 24, d: 40, ks: [2, 2, 2] },
  c: { label: T('\\tfrac{18}{24}') + ': ÷2, ÷3', n: 18, d: 24, ks: [2, 3] }
};
const why = (k, a, b) => ({ 2: `${a} and ${b} are both <b>even</b>`, 3: `${a} and ${b} are both in the <b>3 times table</b>`, 5: `${a} and ${b} both end in 0 or 5`, 10: `${a} and ${b} both end in <b>0</b>` }[k]);
const steps = {
  title: 'No GCF? Divide in small steps',
  height: 324,
  minW: 900,
  choices: Object.keys(ST).map((k) => ({ v: k, label: ST[k].label })),
  ask: (k) => `Write ${T(`\\tfrac{${ST[k].n}}{${ST[k].d}}`)} in simplest form without finding the GCF.`,
  make(stage, k, ex) {
    const D = ST[k], W = ex.W, list = [[D.n, D.d]];
    D.ks.forEach((q) => { const [a, b] = list[list.length - 1]; list.push([a / q, b / q]); });
    const m = list.length, xs = list.map((_, i) => 90 + i * (W - 180) / (m - 1)), yc = 140;
    const svg = svgEl('svg', { class: 'u1l2-abs', width: W, height: 324 }); add(stage, svg, 0, 0);
    const fr = list.map(([a, b], i) => { const f = sfrac(stage, xs[i], yc, a, b, i === m - 1 ? 'u1l2-sfr' : ''); if (i) hide(f); return f; });
    const arcs = D.ks.map((q, i) => { const a = arc(svg, stage, xs[i] + 40, xs[i + 1] - 40, yc - 40, -1, T(`\\div${q}`)); hideArc(a); return a; });
    const notes = D.ks.map((q, i) => { const [a, b] = list[i]; return hide(lab(stage, (xs[i] + xs[i + 1]) / 2, yc + 70, why(q, a, b), 'u1l2-note u1l2-mid')); });
    const [ln, ld] = list[m - 1], G = D.n / ln;
    const st = stamp(stage, 'simplest form', { ok: true, x: xs[m - 1], y: 248, size: 'sm' }); hide(st);
    const one = hide(lab(stage, W / 2, 288, `One step with the GCF (${G}) gives the same answer: ${K(`${F(`${D.n}\\div${G}`, `${D.d}\\div${G}`)}=${F(ln, ld)}`)}`, 'u1l2-line u1l2-mid'));
    const out = D.ks.map((q, i) => {
      const [a, b] = list[i], [a2, b2] = list[i + 1];
      return { cap: `${why(q, a, b)}: divide both by ${q}. ${T(`${F(a, b)}=${F(a2, b2)}`)}`,
        run: async (c) => { await show(c, notes[i]); await drawArc(c, arcs[i]); await show(c, fr[i + 1]); } };
    });
    out.push({ cap: `${ln} and ${ld}: only 1 divides both. Stop: ${T(F(ln, ld))} is in <b>simplest form</b>.`, run: (c) => stampIn(c, st) });
    out.push({ cap: `Same answer as dividing by the GCF, ${G}, once. It just took ${D.ks.length} steps.`, run: (c) => show(c, one) });
    return out;
  }
};

/* =============================== explainer: the division machine (fractions ↔ decimals) =============================== */
const FD = {
  f38: { label: T('\\tfrac38'), n: 3, d: 8 },
  f720: { label: T('\\tfrac{7}{20}'), n: 7, d: 20 },
  f56: { label: T('\\tfrac56'), n: 5, d: 6, rep: true },
  sep: { sep: 'Decimal → fraction:' },
  d06: { label: '0.6', dec: '0.6' },
  d0125: { label: '0.125', dec: '0.125' },
  d045: { label: '0.45', dec: '0.45' }
};
function gear(svg, cx, cy, r, teeth, color) {
  const g = svgEl('g', {}, svg); g.style.transformBox = 'view-box'; g.style.transformOrigin = '0 0';
  for (let i = 0; i < teeth; i++) { const a = i * 360 / teeth; svgEl('rect', { x: cx - 6, y: cy - r - 9, width: 12, height: 14, rx: 2, fill: color, transform: `rotate(${a} ${cx} ${cy})` }, g); }
  svgEl('circle', { cx, cy, r, fill: color }, g); svgEl('circle', { cx, cy, r: r * 0.35, fill: '#fff' }, g);
  g.spin = (deg) => g.setAttribute('transform', `rotate(${deg} ${cx} ${cy})`);
  return g;
}
function numberLine(stage, x0, x1, y, lo, hi, step, labelEvery) {
  const svg = svgEl('svg', { class: 'u1l2-abs', width: x1 - x0 + 40, height: 70 }); add(stage, svg, x0 - 20, y - 20);
  svgEl('line', { x1: 20, x2: x1 - x0 + 20, y1: 20, y2: 20, stroke: INK, 'stroke-width': 3 }, svg);
  const px = (v) => x0 + (v - lo) / (hi - lo) * (x1 - x0);
  const nT = Math.round((hi - lo) / step);
  for (let i = 0; i <= nT; i++) {
    const v = lo + i * step, X = px(v) - x0 + 20, big = i % labelEvery === 0;
    svgEl('line', { x1: X, x2: X, y1: big ? 8 : 13, y2: big ? 32 : 27, stroke: INK, 'stroke-width': big ? 2.5 : 1.5 }, svg);
    if (big) { const t = svgEl('text', { x: X, y: 56, 'text-anchor': 'middle', class: 'u1l2-nl' }, svg); t.textContent = String(+v.toFixed(3)); }
  }
  return { svg, px, y };
}
const fracDec = {
  title: 'The fraction bar means divide',
  height: 340,
  minW: 900,
  capH: 92,
  choices: Object.keys(FD).map((k) => (FD[k].sep ? { sep: FD[k].sep } : { v: k, label: FD[k].label })),
  ask: (k) => (FD[k].dec ? `Example 6: write ${FD[k].dec} as a fraction in simplest form.` : `Example 6: write ${T(`\\tfrac{${FD[k].n}}{${FD[k].d}}`)} as a decimal${FD[k].rep ? ' (round to the nearest thousandth)' : ''}.`),
  make(stage, k, ex) {
    const D = FD[k], W = ex.W;
    const NL = numberLine(stage, 80, W - 80, 286, 0, 1, 0.1, 1);
    if (!D.dec) {
      const v = D.n / D.d, full = D.rep ? '0.8333333' : String(v), shown = D.rep ? '0.833' : String(v);
      const fr = sfrac(stage, 110, 120, D.n, D.d);
      const svg = svgEl('svg', { class: 'u1l2-abs', width: 360, height: 200 }); add(stage, svg, 230, 20);
      svgEl('rect', { x: 10, y: 20, width: 330, height: 160, rx: 18, fill: '#efe6d6', stroke: BRN, 'stroke-width': 4 }, svg);
      svgEl('rect', { x: 0, y: 82, width: 24, height: 36, fill: BRN }, svg); svgEl('rect', { x: 326, y: 82, width: 24, height: 36, fill: BRN }, svg);
      const g1 = gear(svg, 120, 110, 34, 10, '#c27a0e'), g2 = gear(svg, 206, 96, 24, 8, '#9a6a24');
      const mt = lab(stage, 230 + 175, 52, 'top ÷ bottom', 'u1l2-mach u1l2-mid');
      const io = hide(lab(stage, 230 + 290, 150, T(`${D.n}\\div${D.d}`), 'u1l2-machio u1l2-mid'));
      const scr = add(stage, h('div', 'u1l2-abs u1l2-lcd', '<span class="e"></span><span class="r"></span>'), 630, 56); scr.style.width = (W - 660) + 'px';
      const se = scr.querySelector('.e'), sr = scr.querySelector('.r');
      const mk = svgEl('svg', { class: 'u1l2-abs', width: 30, height: 40 }); svgEl('path', { d: 'M15 38 L3 14 A13 13 0 1 1 27 14 Z', fill: RED }, mk); add(stage, mk, NL.px(v) - 15, 246); hide(mk);
      const mkl = hide(lab(stage, NL.px(v), 232, shown, 'u1l2-mkl u1l2-mid'));
      const st = [
        { cap: `The fraction bar means <b>divide</b>: ${T(`${F(D.n, D.d)}=${D.n}\\div${D.d}`)}. Top ÷ bottom.`,
          run: async (c) => { await anim(c, fr, [{ transform: 'translate(0,0)', opacity: 1 }, { transform: 'translate(150px,0) scale(.6)', opacity: 0 }], 700); await show(c, io); se.textContent = `${D.n}÷${D.d}`; } },
        { cap: D.rep ? `${T(`${D.n}\\div${D.d}=0.83333\\ldots`)} The 3 <b>repeats</b> forever.` : `${T(`${D.n}\\div${D.d}=${v}`)}. The division ends: the decimal <b>stops</b>.`,
          run: async (c) => { await tween(c, 1100, (t) => { g1.spin(t * 360); g2.spin(-t * 500); sr.textContent = full.slice(0, Math.max(1, Math.round(t * full.length))); }); sr.textContent = full; } }
      ];
      if (D.rep) st.push({ cap: `Round to the nearest <b>thousandth</b> (3 decimal places): 0.833|3… The next digit, 3, is less than 5, so ${T('\\frac56\\approx0.833')}.`,
        run: async (c) => { sr.innerHTML = '0.833<span class="u1l2-cut">3333</span>'; await sleep(c, 500); sr.textContent = '≈ 0.833'; await pulse(c, sr, 1.08); } });
      st.push({ cap: `${shown} is <b>less than 1</b>. That makes sense: the top is smaller than the bottom, so ${T(F(D.n, D.d))} is less than one whole.`,
        run: async (c) => { await fadeIn(c, mk, 400, { from: 'translateY(-30px)' }); await show(c, mkl); } });
      return st;
    }
    // decimal → fraction: place value, then simplify
    const s = D.dec, digs = s.split('.')[1], places = digs.length, den = Math.pow(10, places), num = Number(digs), g = gcd(num, den), v = Number(s);
    const cols = ['ones', 'tenths', 'hundredths', 'thousandths'], cw = 100, cx0 = 30, fxc = Math.max(700, W - 230);
    const chart = add(stage, h('div', 'u1l2-abs u1l2-pv'), cx0, 18);
    chart.innerHTML = `<div class="hd">${cols.map((c) => `<span>${c}</span>`).join('<i></i>')}</div><div class="dg">${[0, 1, 2, 3].map((i) => `<span data-i="${i}">${i === 0 ? '0' : ''}</span>`).join('<i></i>')}</div>`;
    chart.style.width = (cw * 4 + 36) + 'px';
    const dots = chart.querySelectorAll('.dg i'); dots[0].textContent = '.';
    const cells = chart.querySelectorAll('.dg span'), heads = chart.querySelectorAll('.hd span');
    const denT = den === 1000 ? '1\\,000' : String(den);
    const f1 = hide(lab(stage, fxc, 70, K(`${s}=${F(num, denT)}`), 'u1l2-flab u1l2-mid'));
    const f2 = hide(lab(stage, fxc, 160, K(`${F(num, denT)}=${F(`${num}\\div${g}`, `${denT}\\div${g}`)}=${F(num / g, den / g)}`), 'u1l2-eqn u1l2-mid'));
    const mk = svgEl('svg', { class: 'u1l2-abs', width: 30, height: 40 }); svgEl('path', { d: 'M15 38 L3 14 A13 13 0 1 1 27 14 Z', fill: RED }, mk); add(stage, mk, NL.px(v) - 15, 246); hide(mk);
    const mkl = hide(lab(stage, NL.px(v), 232, T(F(num / g, den / g)) + ' = ' + s, 'u1l2-mkl u1l2-mid'));
    return [
      { cap: `Read ${s} with place value. The last digit is in the <b>${cols[places]}</b> place.`,
        run: async (c) => { for (let i = 0; i < places; i++) { cells[i + 1].textContent = digs[i]; await pop(c, cells[i + 1]); } heads[places].classList.add('lit'); cells[places].classList.add('lit'); } },
      { cap: `So ${s} is ${num} ${cols[places]}: ${T(`${s}=${F(num, denT)}`)}.`, run: (c) => pop(c, f1) },
      { cap: `Simplify. The GCF of ${num} and ${den === 1000 ? '1 000' : den} is ${g}: ${T(`${F(num, denT)}=${F(num / g, den / g)}`)}.`, run: (c) => pop(c, f2) },
      { cap: `Check on the calculator: ${s} <kbd>ENTER</kbd>, then <kbd>2nd</kbd> <kbd>F◂▸D</kbd> shows <b>${num / g}⌟${den / g}</b>.`,
        run: async (c) => { await fadeIn(c, mk, 400, { from: 'translateY(-30px)' }); await show(c, mkl); } }
    ];
  }
};

/* =============================== explainer: comparing (pizza, common denominator, decimals, a ruler) =============================== */
const CP = {
  pz: { label: 'Pizza: ' + T('\\tfrac18') + ' vs ' + T('\\tfrac15'), mode: 'pie' },
  e7a: { label: 'Example 7(a)', mode: 'bars', a: [3, 4], b: [5, 6], L: 12 },
  e7b: { label: '(b)', mode: 'dec', a: [5, 8], b: [7, 11], lo: 0.6, hi: 0.65 },
  e7c: { label: '(c) wrenches', mode: 'ruler' },
  e8: { label: 'Example 8: free throws', mode: 'dec', a: [13, 20], b: [16, 25], lo: 0.6, hi: 0.7, names: ['Ava', 'Noor'] }
};
const decStr = (n, d) => { const v = n / d; const ex4 = Math.abs(Math.round(v * 1e4) / 1e4 - v) < 1e-12; return ex4 ? String(+v.toFixed(4)) : (Math.floor(v * 1e4) / 1e4).toFixed(4) + '…'; };
const compare = {
  title: 'Which is bigger?',
  height: 370,
  minW: 900,
  capH: 92,
  choices: Object.keys(CP).map((k) => ({ v: k, label: CP[k].label })),
  ask: (k) => ({ pz: `Which is more pizza: ${T('\\tfrac18')} or ${T('\\tfrac15')} of the same pizza?`, e7a: `Use a common denominator to compare ${T('\\tfrac34')} and ${T('\\tfrac56')}.`, e7b: `Use decimals to compare ${T('\\tfrac58')} and ${T('\\tfrac{7}{11}')}.`, e7c: `Order the wrenches from smallest to largest: ${T('\\tfrac58,\\ \\tfrac12,\\ \\tfrac{9}{16},\\ \\tfrac34')} in.`, e8: 'Ava made 13 of 20 free throws. Noor made 16 of 25. Who has the better record?' }[k]),
  make(stage, k, ex) {
    const D = CP[k], W = ex.W;
    if (D.mode === 'pie') {
      const svg = svgEl('svg', { class: 'u1l2-abs', width: W, height: 350 }); add(stage, svg, 0, 0);
      const R = 110, ca = [W / 2 - 220, 150], cb = [W / 2 + 120, 150];
      const A = pic(svg, { kind: 'pie', d: 8, n: 0 }, { x: ca[0] - R, y: ca[1] - R, size: R / 80 }), B = pic(svg, { kind: 'pie', d: 5, n: 0 }, { x: cb[0] - R, y: cb[1] - R, size: R / 80 });
      lab(stage, ca[0], 286, `cut into <b>8</b>`, 'u1l2-mut u1l2-mid'); lab(stage, cb[0], 286, `cut into <b>5</b>`, 'u1l2-mut u1l2-mid');
      const la = hide(lab(stage, ca[0] - R - 50, 60, K('\\frac18'), 'u1l2-flab u1l2-mid')), lb = hide(lab(stage, cb[0] + R + 50, 60, K('\\frac15'), 'u1l2-flab u1l2-mid'));
      const cut = (cx, cy, d, col) => { const a0 = -Math.PI / 2, a1 = a0 + 2 * Math.PI / d; return svgEl('path', { d: `M${cx} ${cy} L${cx + R * Math.cos(a0)} ${cy + R * Math.sin(a0)} A${R} ${R} 0 0 1 ${cx + R * Math.cos(a1)} ${cy + R * Math.sin(a1)} Z`, fill: col, stroke: INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, svg); };
      const sb = cut(cb[0], cb[1], 5, FB), sa = cut(ca[0], ca[1], 8, FA); hide(sa); hide(sb);
      const st = stamp(stage, T('\\tfrac18<\\tfrac15'), { ok: null, x: W - 120, y: 280, size: 'lg' }); hide(st);
      void A; void B;
      return [
        { cap: `The same pizza, cut two ways: into <b>8</b> slices and into <b>5</b> slices.`, run: (c) => sleep(c, 200) },
        { cap: `Take <b>one</b> slice from each: ${T('\\tfrac18')} and ${T('\\tfrac15')}.`, run: async (c) => { await appear(c, sa, 300); await appear(c, sb, 300); await show(c, la); await show(c, lb); } },
        { cap: `Lay the ${T('\\tfrac18')} slice on top of the ${T('\\tfrac15')} slice. It is <b>smaller</b>: more slices means smaller slices.`,
          run: async (c) => { svg.appendChild(sa); await anim(c, sa, [{ transform: 'translate(0px,0px)' }, { transform: `translate(${cb[0] - ca[0]}px, 0px)` }], 1000); } },
        { cap: `A bigger denominator means <b>smaller pieces</b>: ${T('\\tfrac18<\\tfrac15')}.`, run: (c) => stampIn(c, st) }
      ];
    }
    if (D.mode === 'bars') {
      const [a1, a2] = D.a, [b1, b2] = D.b, L = D.L, x0 = 150, w = W - 400, bh = 60, ys = [40, 150];
      const A = new FBar(stage, { x: x0, y: ys[0], w, h: bh }), B = new FBar(stage, { x: x0, y: ys[1], w, h: bh });
      A.shade(0, a1, a2); A.cuts(a2, { width: 3.5 }); B.shade(0, b1, b2, FB); B.cuts(b2, { width: 3.5 });
      const ca = A.cuts(L, { skip: L / a2, dash: '6 4', color: '#555' }), cb = B.cuts(L, { skip: L / b2, dash: '6 4', color: '#555' }); hide(ca); hide(cb);
      const la = lab(stage, 72, ys[0] + bh / 2, K(F(a1, a2)), 'u1l2-flab u1l2-mid'), lb = lab(stage, 72, ys[1] + bh / 2, K(F(b1, b2)), 'u1l2-flab u1l2-mid');
      const na = [], nb = [];
      for (let i = 0; i < a1 * L / a2; i++) { const t = A.num(i, L, String(i + 1)); hide(t); na.push(t); }
      for (let i = 0; i < b1 * L / b2; i++) { const t = B.num(i, L, String(i + 1)); hide(t); nb.push(t); }
      const ea = hide(lab(stage, x0 + w + 90, ys[0] + bh / 2, K(`=${F(a1 * L / a2, L)}`), 'u1l2-flab u1l2-mid')), eb = hide(lab(stage, x0 + w + 90, ys[1] + bh / 2, K(`=${F(b1 * L / b2, L)}`), 'u1l2-flab u1l2-mid'));
      const st = stamp(stage, T(`${F(a1, a2)}<${F(b1, b2)}`), { ok: null, x: W / 2, y: 290, size: 'lg' }); hide(st);
      return [
        { cap: `${T(F(a1, a2))} and ${T(F(b1, b2))} have <b>different-size</b> pieces, so counting pieces doesn’t compare them.`, run: (c) => Promise.all([pulse(c, la), pulse(c, lb)]) },
        { cap: `${L} is a multiple of ${a2} and of ${b2}. Cut <b>both</b> bars into ${ord(L)}.`, run: async (c) => { await appear(c, ca, 400); await appear(c, cb, 400); } },
        { cap: `Count the shaded ${ord(L)}: ${T(`${F(a1, a2)}=${F(a1 * L / a2, L)}`)} and ${T(`${F(b1, b2)}=${F(b1 * L / b2, L)}`)}.`,
          run: async (c) => { for (const t of na) await appear(c, t, 50); await show(c, ea); for (const t of nb) await appear(c, t, 50); await show(c, eb); } },
        { cap: `Same-size pieces now: ${T(`${a1 * L / a2}<${b1 * L / b2}`)}, so ${T(`${F(a1, a2)}<${F(b1, b2)}`)}.`, run: (c) => stampIn(c, st) }
      ];
    }
    if (D.mode === 'dec') {
      const [a1, a2] = D.a, [b1, b2] = D.b, va = a1 / a2, vb = b1 / b2, nm = D.names || ['', ''];
      const sa = decStr(a1, a2), sb = decStr(b1, b2), ra = r3(va).toFixed(3), rb = r3(vb).toFixed(3);
      const ta = (nm[0] ? `\\text{${nm[0]}: }` : '') + `${F(a1, a2)}=${a1}\\div${a2}=${sa.replace('…', '\\ldots')}`;
      const tb = (nm[1] ? `\\text{${nm[1]}: }` : '') + `${F(b1, b2)}=${b1}\\div${b2}=${sb.replace('…', '\\ldots')}`;
      const L1 = hide(lab(stage, 40, 40, K(ta), 'u1l2-flab u1l2-ml')), L2 = hide(lab(stage, 40, 120, K(tb), 'u1l2-flab u1l2-ml'));
      // digits lined up, place by place
      const da = String(r3(va)).padEnd(5, '0'), db = String(r3(vb)).padEnd(5, '0');
      const tbl = add(stage, h('div', 'u1l2-abs u1l2-dig'), W - 330, 22);
      tbl.innerHTML = [da, db].map((s, r) => `<div><span class="nm">${nm[r] || (r ? T(F(b1, b2)) : T(F(a1, a2)))}</span>${s.split('').map((ch, i) => `<span class="d" data-i="${i}">${ch}</span>`).join('')}</div>`).join('');
      hide(tbl);
      let diff = 0; while (diff < 5 && da[diff] === db[diff]) diff++;
      const place = ['ones', '', 'tenths', 'hundredths', 'thousandths'][diff];
      const NL = numberLine(stage, 90, W - 90, 262, D.lo, D.hi, 0.01, 5);
      const pin = (v, col, txt, up) => { const s = svgEl('svg', { class: 'u1l2-abs', width: 30, height: 40 }); svgEl('path', { d: 'M15 38 L3 14 A13 13 0 1 1 27 14 Z', fill: col }, s); add(stage, s, NL.px(v) - 15, 222); hide(s); const l = hide(lab(stage, NL.px(v), up ? 180 : 206, txt, 'u1l2-mkl u1l2-mid')); l.style.color = col; return [s, l]; };
      const big = va > vb, aBig = big;
      const pa = pin(va, AMB, nm[0] ? `${nm[0]} ${ra.replace(/0+$/, '')}` : ra.replace(/0+$/, ''), aBig), pb = pin(vb, BLUE, nm[1] ? `${nm[1]} ${rb.replace(/0+$/, '')}` : rb.replace(/0+$/, ''), !aBig);
      const verdict = nm[0] ? `${nm[0]}’s record is better` : T(`${F(a1, a2)}${big ? '>' : '<'}${F(b1, b2)}`);
      const st = stamp(stage, verdict, { ok: null, x: W - 190, y: 172, size: nm[0] ? 'sm' : 'lg' }); hide(st);
      const roundNote = (s) => (s.includes('…') ? ' ≈ ' + r3(Number(s.replace('…', ''))).toFixed(3) : '');
      return [
        { cap: `Change ${nm[0] ? nm[0] + '’s record' : T(F(a1, a2))} to a decimal: ${T(`${a1}\\div${a2}=${sa.replace('…', '\\ldots')}`)}${roundNote(sa)}.`, run: (c) => show(c, L1) },
        { cap: `Now ${nm[1] ? nm[1] + '’s' : T(F(b1, b2))}: ${T(`${b1}\\div${b2}=${sb.replace('…', '\\ldots')}`)}${roundNote(sb)}.`, run: (c) => show(c, L2) },
        { cap: `Line up the digits. The first place they differ is the <b>${place}</b>: ${T(`${da[diff]}${da[diff] > db[diff] ? '>' : '<'}${db[diff]}`)}.`,
          run: async (c) => { await show(c, tbl); tbl.querySelectorAll(`[data-i="${diff}"]`).forEach((e) => e.classList.add('lit')); await Promise.all([...tbl.querySelectorAll(`[data-i="${diff}"]`)].map((e) => pulse(c, e, 1.25))); } },
        { cap: `On a number line, ${big ? (nm[0] || T(F(a1, a2))) : (nm[1] || T(F(b1, b2)))} is further right: ${T(`${ra.replace(/0+$/, '')}${big ? '>' : '<'}${rb.replace(/0+$/, '')}`)}.`,
          run: async (c) => { await fadeIn(c, pa[0], 300, { from: 'translateY(-20px)' }); await show(c, pa[1]); await fadeIn(c, pb[0], 300, { from: 'translateY(-20px)' }); await show(c, pb[1]); } },
        { cap: nm[0] ? `${T('0.65>0.64')}, so <b>Ava</b> has the better record. Noor made more shots, but she also <b>took</b> more. Compare fractions, not counts.` : `So ${T(`${F(a1, a2)}${big ? '>' : '<'}${F(b1, b2)}`)}.`, run: (c) => stampIn(c, st) }
      ];
    }
    // ruler: wrenches in sixteenths. Tags start in a row, then move above their mark (two levels, so neighbours don't overlap)
    const WR = [[5, 8], [1, 2], [9, 16], [3, 4]], x0 = 70, x1 = W - 70, px = (s) => x0 + (x1 - x0) * s / 16, RY = 238;
    const svg = svgEl('svg', { class: 'u1l2-abs', width: W, height: 370 }); add(stage, svg, 0, 0);
    svgEl('rect', { x: x0 - 20, y: RY, width: x1 - x0 + 40, height: 72, rx: 6, fill: '#f6e3b4', stroke: '#8a6a2a', 'stroke-width': 2.5 }, svg);
    for (let i = 0; i <= 16; i++) {
      const X = px(i), len = i % 16 === 0 ? 44 : i % 8 === 0 ? 36 : i % 4 === 0 ? 28 : i % 2 === 0 ? 20 : 13;
      svgEl('line', { x1: X, x2: X, y1: RY, y2: RY + len, stroke: INK, 'stroke-width': i % 4 === 0 ? 2.5 : 1.6 }, svg);
      if (i && i < 16 && i % 4 === 0) { const t = svgEl('text', { x: X, y: RY + 60, 'text-anchor': 'middle', class: 'u1l2-nls' }, svg); t.textContent = `${i / 4}/4`; }
    }
    [[0, '0'], [16, '1 in.']].forEach(([i, s]) => { const t = svgEl('text', { x: px(i), y: RY + 62, 'text-anchor': 'middle', class: 'u1l2-nl' }, svg); t.textContent = s; });
    const sx = WR.map(([n, d]) => n * 16 / d), rank = sx.map((v) => sx.filter((u) => u < v).length);
    const X0 = WR.map((_, i) => 130 + i * (W - 260) / 3);
    const tags = WR.map(([n, d], i) => {
      const t = add(stage, h('div', 'u1l2-abs u1l2-wr', `<svg viewBox="0 0 90 30" aria-hidden="true"><path d="M8 15 a10 10 0 1 1 14 -9 l58 6 v6 l-58 6 a10 10 0 1 1 -14 -9 z" fill="#8f99a8" stroke="#1c2230" stroke-width="2"/><circle cx="12" cy="15" r="4" fill="#fff"/></svg><span class="f">${T(F(n, d))}</span><span class="s">${d === 16 ? '' : T('=' + F(n * 16 / d, 16))}</span>`), X0[i], 8);
      t.querySelector('.s').style.opacity = 0; return t;
    });
    const lvlY = (i) => (rank[i] % 2 === 0 ? 128 : 8);
    const drops = sx.map((s, i) => { const l = svgEl('line', { x1: px(s), x2: px(s), y1: lvlY(i) + 100, y2: RY, stroke: RED, 'stroke-width': 3 }, svg); hide(l); return l; });
    const ol = hide(lab(stage, W / 2, 344, `Smallest to largest: ${T('\\tfrac12,\\ \\tfrac{9}{16},\\ \\tfrac58,\\ \\tfrac34')} in. &nbsp;<span class="u1l2-mut">(0.5, 0.5625, 0.625, 0.75)</span>`, 'u1l2-eqn u1l2-mid'));
    return [
      { cap: `The ruler’s smallest marks are <b>sixteenths</b>. Write every size in sixteenths: ${T('\\tfrac58=\\tfrac{10}{16},\\ \\tfrac12=\\tfrac{8}{16},\\ \\tfrac34=\\tfrac{12}{16}')}.`,
        run: async (c) => { for (let i = 0; i < 4; i++) if (WR[i][1] !== 16) await fadeIn(c, tags[i].querySelector('.s'), 300); } },
      { cap: `Put each wrench above its mark on the ruler: 10, 8, 9 and 12 sixteenths.`,
        run: async (c) => { for (let i = 0; i < 4; i++) { await anim(c, tags[i], [{ transform: 'translate(0px, 0px)' }, { transform: `translate(${px(sx[i]) - X0[i]}px, ${lvlY(i) - 8}px)` }], 550); await appear(c, drops[i], 150); } } },
      { cap: `Read them from left to right. Smallest to largest: ${T('\\tfrac12,\\ \\tfrac{9}{16},\\ \\tfrac58,\\ \\tfrac34')} in.`, run: (c) => pop(c, ol) }
    ];
  }
};

/* =============================== explainer: a fraction of an amount (tape) =============================== */
const OA = {
  n: { label: 'Notes: ' + T('\\tfrac34') + ' of 24', n: 3, d: 4, amt: 24 },
  sep: { sep: 'Example 9 check:' },
  a: { label: '(a)', n: 2, d: 3, amt: 45 },
  b: { label: '(b)', n: 5, d: 8, amt: 64 },
  c: { label: '(c)', n: 3, d: 10, amt: 85, $: true },
  d: { label: '(d)', n: 2, d: 7, amt: 50, $: true }
};
const ofAmount = {
  title: 'Split into equal parts, then take some',
  height: 330,
  minW: 900,
  capH: 92,
  choices: Object.keys(OA).map((k) => (OA[k].sep ? { sep: OA[k].sep } : { v: k, label: OA[k].label })),
  ask: (k) => `Find ${T(`\\tfrac{${OA[k].n}}{${OA[k].d}}`)} of ${OA[k].$ ? '$' : ''}${OA[k].amt}.`,
  make(stage, k, ex) {
    const D = OA[k], W = ex.W, x0 = 70, w = W - 140, bh = 70, y = 64, share = D.amt / D.d, ans = share * D.n;
    const nice = Number.isInteger(share * 100 + 1e-9) || Math.abs(share * 100 - Math.round(share * 100)) < 1e-9;
    const shT = nice ? (D.$ ? money(share) : String(share)) : (Math.floor(share * 1e4) / 1e4).toFixed(4) + '\\ldots';
    const amtT = D.$ ? money(D.amt).replace('.00', '') : String(D.amt), ansExact = nice ? (D.$ ? money(ans) : String(ans)) : (Math.floor(ans * 1e4) / 1e4).toFixed(4) + '\\ldots';
    const ansR = D.$ ? money(Math.round(ans * 100) / 100) : String(ans);
    const svg = svgEl('svg', { class: 'u1l2-abs', width: W, height: 330 }); add(stage, svg, 0, 0);
    // the whole amount
    svgEl('rect', { x: x0, y, width: w, height: bh, fill: FE, stroke: INK, 'stroke-width': 3 }, svg);
    const top = svgEl('g', {}, svg);
    svgEl('line', { x1: x0, x2: x0 + w, y1: y - 22, y2: y - 22, stroke: INK, 'stroke-width': 2 }, top);
    svgEl('path', { d: `M${x0 + 10} ${y - 30} L${x0} ${y - 22} L${x0 + 10} ${y - 14} M${x0 + w - 10} ${y - 30} L${x0 + w} ${y - 22} L${x0 + w - 10} ${y - 14}`, stroke: INK, 'stroke-width': 2, fill: 'none' }, top);
    lab(stage, W / 2, y - 24, T(amtT), 'u1l2-amt u1l2-mid');
    const pw = w / D.d, shades = [], cuts = svgEl('g', {}, svg), vals = [];
    for (let i = 0; i < D.d; i++) {
      const r = svgEl('rect', { x: x0 + i * pw + 1.5, y: y + 1.5, width: pw - 3, height: bh - 3, fill: FA }, svg); hide(r); if (i < D.n) shades.push(r);
      if (i) svgEl('line', { x1: x0 + i * pw, x2: x0 + i * pw, y1: y, y2: y + bh, stroke: INK, 'stroke-width': 2.5 }, cuts);
      vals.push(hide(lab(stage, x0 + (i + 0.5) * pw, y + bh / 2, T(nice ? shT.replace('\\$', '\\$') : share.toFixed(2) + '\\ldots'), 'u1l2-pval u1l2-mid')));
    }
    svg.appendChild(cuts); hide(cuts);
    // brace under the shaded parts
    const br = svgEl('path', { d: `M${x0} ${y + bh + 8} q0 14 14 14 H${x0 + D.n * pw / 2 - 12} q12 0 12 14 q0 -14 12 -14 H${x0 + D.n * pw - 14} q14 0 14 -14`, fill: 'none', stroke: RED, 'stroke-width': 3 }, svg); hide(br);
    const bl = hide(lab(stage, x0 + D.n * pw / 2, y + bh + 62, T(`${D.n}\\times${shT}=${ansExact}`), 'u1l2-ansl u1l2-mid'));
    // reasonable? number line 0 … amount with the half marked
    const NL = numberLine(stage, x0 + 40, x0 + w - 40, 268, 0, D.amt, D.amt / 2, 1);
    const half = D.amt / 2, more = D.n / D.d > 0.5;
    const mk = svgEl('svg', { class: 'u1l2-abs', width: 30, height: 40 }); svgEl('path', { d: 'M15 38 L3 14 A13 13 0 1 1 27 14 Z', fill: RED }, mk); add(stage, mk, NL.px(ans) - 15, 218); hide(mk);
    const nlab = hide(lab(stage, NL.px(ans), 204, T(ansR), 'u1l2-mkl u1l2-mid'));
    const halfT = D.$ ? money(half).replace('.00', '') : String(half);
    const steps2 = [
      { cap: `Step 1: split ${amtT.replace('\\$', '$')} into <b>${D.d} equal parts</b>: ${T(`${amtT}\\div${D.d}=${shT}`)} in each part.${nice ? '' : ' Not a nice number!'}`,
        run: async (c) => { await appear(c, cuts, 400); for (const v of vals) await appear(c, v, 90); } },
      { cap: nice ? `Step 2: take <b>${D.n}</b> of the parts: ${T(`${D.n}\\times${shT}=${ansExact}`)}.` : `Step 2: take <b>${D.n}</b> parts. On the calculator, multiply first: ${T(`${D.amt}\\times${D.n}\\div${D.d}=${ansExact}`)}`,
        run: async (c) => { for (const s of shades) await appear(c, s, 200); await appear(c, br, 300); bl.innerHTML = nice ? T(`${D.n}\\times${shT}=${ansExact}`) : T(`${D.amt}\\times${D.n}\\div${D.d}=${ansExact}`); await pop(c, bl); } }
    ];
    if (!nice) steps2.push({ cap: `Round money to the nearest cent <b>at the end</b>: ${T(`${ansExact}\\approx${ansR}`)}.`, run: async (c) => { bl.innerHTML = T(`${ansExact}\\approx${ansR}`); await pulse(c, bl, 1.12); } });
    steps2.push({ cap: `Is it reasonable? ${T(`\\tfrac{${D.n}}{${D.d}}`)} is ${more ? 'more' : 'less'} than half, so the answer should be ${more ? `between ${halfT.replace('\\$', '$')} and ${amtT.replace('\\$', '$')}` : `less than ${halfT.replace('\\$', '$')}`}. ${ansR.replace('\\$', '$')} ✓`,
      run: async (c) => { await fadeIn(c, mk, 350, { from: 'translateY(-24px)' }); await show(c, nlab); } });
    return steps2;
  }
};

/* =============================== explainer: Dana's gas tank =============================== */
const gasGauge = {
  title: 'Dana fills her tank',
  height: 360,
  minW: 900,
  capH: 92,
  ask: () => `Dana’s 52 L tank is ${T('\\tfrac14')} full. Gas costs $1.45/L.`,
  make(stage, v, ex) {
    const W = ex.W, svg = svgEl('svg', { class: 'u1l2-abs', width: W, height: 360 }); add(stage, svg, 0, 0);
    // gauge
    const gx = 170, gy = 200, R = 130;
    svgEl('path', { d: `M${gx - R} ${gy} A${R} ${R} 0 0 1 ${gx + R} ${gy}`, fill: 'none', stroke: '#2b2f38', 'stroke-width': 26, 'stroke-linecap': 'round' }, svg);
    svgEl('path', { d: `M${gx - R} ${gy} A${R} ${R} 0 0 1 ${gx - R * Math.cos(Math.PI / 8)} ${gy - R * Math.sin(Math.PI / 8)}`, fill: 'none', stroke: RED, 'stroke-width': 26 }, svg);
    [[0, 'E'], [0.25, '¼'], [0.5, '½'], [0.75, '¾'], [1, 'F']].forEach(([f, s]) => {
      const a = Math.PI * (1 - f), c1 = [gx + (R - 13) * Math.cos(a), gy - (R - 13) * Math.sin(a)], c2 = [gx + (R + 13) * Math.cos(a), gy - (R + 13) * Math.sin(a)];
      svgEl('line', { x1: c1[0], y1: c1[1], x2: c2[0], y2: c2[1], stroke: '#fff', 'stroke-width': 3 }, svg);
      const end = f === 0 || f === 1, t = svgEl('text', { x: end ? gx + R * Math.cos(a) : gx + (R - 42) * Math.cos(a), y: end ? gy + 40 : gy - (R - 42) * Math.sin(a) + 9, 'text-anchor': 'middle', class: 'u1l2-gl' }, svg); t.textContent = s;
    });
    const needle = svgEl('g', {}, svg);
    needle.style.transformBox = 'view-box'; needle.style.transformOrigin = '0 0';
    svgEl('line', { x1: gx, y1: gy, x2: gx - R + 22, y2: gy, stroke: RED, 'stroke-width': 6, 'stroke-linecap': 'round' }, needle); svgEl('circle', { cx: gx, cy: gy, r: 13, fill: '#2b2f38' }, svg);
    const setNeedle = (f) => needle.setAttribute('transform', `rotate(${180 * f} ${gx} ${gy})`);
    const gt = svgEl('text', { x: gx, y: gy + 64, 'text-anchor': 'middle', class: 'u1l2-gl' }, svg); gt.textContent = 'gas gauge';
    // tank
    const tx = 380, ty = 34, tw = 150, th = 272, q = th / 4;
    const fill = svgEl('rect', { x: tx, y: ty + th, width: tw, height: 0, fill: '#f2b84b' }, svg);
    const setFill = (f) => { fill.setAttribute('y', ty + th * (1 - f)); fill.setAttribute('height', th * f); };
    const ql = svgEl('g', {}, svg); for (let i = 1; i < 4; i++) svgEl('line', { x1: tx, x2: tx + tw, y1: ty + i * q, y2: ty + i * q, stroke: INK, 'stroke-width': 2, 'stroke-dasharray': '7 5' }, ql); hide(ql);
    svgEl('rect', { x: tx, y: ty, width: tw, height: th, rx: 10, fill: 'none', stroke: INK, 'stroke-width': 3.5 }, svg);
    const qv = [0, 1, 2, 3].map((i) => hide(lab(stage, tx + tw / 2, ty + th - (i + 0.5) * q, '13 L', 'u1l2-tq u1l2-mid')));
    lab(stage, tx + tw / 2, ty + th + 22, 'tank: 52 L', 'u1l2-mut u1l2-mid');
    const emp = svgEl('path', { d: `M${tx + tw + 12} ${ty} h12 v${3 * q} h-12`, fill: 'none', stroke: BLUE, 'stroke-width': 3 }, svg); hide(emp);
    const empL = hide(lab(stage, tx + tw + 34, ty + 1.5 * q, `${T('52-13')}<br>${T('=39')} L`, 'u1l2-empl u1l2-ml')); empL.style.color = BLUE;
    // pump
    const pump = add(stage, h('div', 'u1l2-abs u1l2-pump', '<div class="ph">PUMP 4</div><div class="pr"><span>SALE</span><b class="s">$0.00</b></div><div class="pr"><span>LITRES</span><b class="l">0.000</b></div><div class="pr sm"><span>PRICE/L</span><b>$1.45</b></div>'), 640, 30);
    pump.style.width = (W - 670) + 'px';
    const pS = pump.querySelector('.s'), pL = pump.querySelector('.l');
    const est = hide(add(stage, h('div', 'u1l2-abs u1l2-est', `Estimate: ${T('40\\times1.5=60')}<br>${T('\\$56.55')} is close ✓`), 640, 250)); est.style.width = (W - 670) + 'px';
    setNeedle(0); setFill(0);
    return [
      { cap: `Dana’s tank holds <b>52 L</b>. The gauge shows it is ${T('\\tfrac14')} full.`,
        run: (c) => tween(c, 900, (t) => { setNeedle(0.25 * t); setFill(0.25 * t); }) },
      { cap: `(a) ${T('\\tfrac14')} of 52 L: ${T('52\\div4\\times1=13')}. There are <b>13 L</b> in the tank.`,
        run: async (c) => { await appear(c, ql, 300); for (const l of qv) await appear(c, l, 120); await pulse(c, qv[0], 1.2); } },
      { cap: `(b) The empty part: ${T('52-13=39')} L (that is ${T('\\tfrac34')} of 52). It takes <b>39 L</b> to fill it.`,
        run: async (c) => { await appear(c, emp, 300); await show(c, empL); } },
      { cap: `(c) Pump 39 L at $1.45/L: ${T('39\\times1.45=56.55')}. It costs <b>$56.55</b> to fill the tank.`,
        run: (c) => tween(c, 2600, (t) => { const L = 39 * t; setFill(0.25 + 0.75 * t); setNeedle(0.25 + 0.75 * t); pL.textContent = L.toFixed(3); pS.textContent = '$' + (t >= 1 ? '56.55' : (Math.floor(L * 1.45 * 100) / 100).toFixed(2)); }, (t) => t) },
      { cap: `Check with an estimate: 39 is about 40 and $1.45 is about $1.50, so about ${T('40\\times1.5=\\$60')}. Close to $56.55 ✓`,
        run: (c) => show(c, est) }
    ];
  }
};

/* =============================== Math History: the fraction bar becomes ÷ =============================== */
function histAnim() {
  const svg = document.getElementById('u1l2-hist'); if (!svg) return;
  const NS = 'http://www.w3.org/2000/svg', mk = (t, a, p = svg) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); p.appendChild(e); return e; };
  mk('rect', { x: 0, y: 0, width: 600, height: 300, rx: 14, fill: '#fffaf1' });
  const cap = mk('text', { x: 300, y: 44, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 24, fill: '#4a2c14' });
  const cx = 200, top = mk('text', { x: cx, y: 128, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 64, fill: '#4a2c14' }); top.textContent = '3';
  const bot = mk('text', { x: cx, y: 222, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 64, fill: '#4a2c14' }); bot.textContent = '8';
  const bar = mk('line', { x1: cx - 40, x2: cx + 40, y1: 152, y2: 152, stroke: '#b07a12', 'stroke-width': 7, 'stroke-linecap': 'round' });
  const d1 = mk('circle', { cx, cy: 122, r: 9, fill: '#7a4a26' }), d2 = mk('circle', { cx, cy: 182, r: 9, fill: '#7a4a26' });
  const out = mk('text', { x: 430, y: 166, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 40, fill: '#7a4a26' }); out.textContent = '3 ÷ 8 = 0.375';
  const foot = mk('text', { x: 300, y: 276, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 18, fill: '#7a4a26' });
  const CAPS = [[0, 'India: one number on top of another'], [3, 'al-Hassar, about 1200: add a bar'], [6.2, 'Rahn, 1659: a tiny fraction, ÷'], [9.2, 'The bar still means divide']];
  const clamp = (t) => Math.max(0, Math.min(1, t)), ease = (t) => t * t * (3 - 2 * t);
  const draw = (s) => {
    let c = CAPS[0][1]; for (const [t0, txt] of CAPS) if (s >= t0) c = txt; cap.textContent = c;
    const b = ease(clamp((s - 3.4) / 1.2));                    // the bar draws in
    const m = ease(clamp((s - 6.6) / 1.6));                    // numbers shrink into dots
    const half = 40 - 8 * m; bar.setAttribute('x1', cx - half * b); bar.setAttribute('x2', cx - half * b + 2 * half * b);
    bar.setAttribute('opacity', b > 0 ? 1 : 0);
    top.setAttribute('opacity', 1 - m); bot.setAttribute('opacity', 1 - m);
    top.setAttribute('y', 128 - 6 * m); bot.setAttribute('y', 222 - 30 * m);
    d1.setAttribute('opacity', m); d2.setAttribute('opacity', m);
    const o = ease(clamp((s - 9.4) / 0.8)); out.setAttribute('opacity', o);
    foot.textContent = s >= 9.4 ? 'top ÷ bottom: the fraction 3/8 is the number 0.375' : '';
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

/* =============================== wiring =============================== */
mountPics();
histAnim();
mountExplainers({ fracMean, splitMerge, addTrap, missing, gcf, steps, fracDec, compare, ofAmount, gasGauge });

/* ============ Stand Up Break! — simplest form, missing numbers, a fraction of an amount, comparing ============ */
{
  const co = (r, lo, hi) => { for (;;) { const b = r.int(lo, hi), a = r.int(1, b - 1); if (gcd(a, b) === 1) return [a, b]; } };
  const ap = (v) => { const s = (Math.round(v * 1000) / 1000).toFixed(3).replace(/0+$/, '').replace(/\.$/, ''); return (Math.abs(Number(s) - v) < 1e-9 ? '=' : '\\approx') + s; };
  standup('u1l2', {
    intro: 'Show every step on the whiteboard. Simplify with the GCF, scale top and bottom by the same number, and estimate first.',
    levels: {
      BEG: (r) => { // simplest form: 12/18
        const [a, b] = co(r, 3, 9), k = r.int(2, 9);
        return { text: 'Write in simplest form.', q: F(k * a, k * b), a: [`\\text{GCF}=${k}`, `${F(k * a, k * b)}=${F(`${k * a}\\div${k}`, `${k * b}\\div${k}`)}=${F(a, b)}`] };
      },
      PRG: (r) => r.pick([
        () => { const [a, b] = co(r, 3, 9), k = r.int(3, 9); return r.chance(0.5)
          ? { text: 'Find the missing number.', q: `${F(a, b)}=${F('\\square', b * k)}`, a: [`${b}\\times${k}=${b * k}`, `${a}\\times${k}=${a * k}`, `${F(a, b)}=${F(a * k, b * k)}`] }
          : { text: 'Find the missing number.', q: `${F(a * k, b * k)}=${F(a, '\\square')}`, a: [`${a * k}\\div${k}=${a}`, `${b * k}\\div${k}=${b}`, `${F(a * k, b * k)}=${F(a, b)}`] }; },
        () => { const [a, b] = co(r, 3, 10), m = r.int(3, 12), amt = b * m; return { text: 'Find the amount.', q: `${F(a, b)}\\text{ of }${amt}`, a: [`${amt}\\div${b}=${m}`, `${m}\\times${a}=${m * a}`] }; }
      ])(),
      MAS: (r) => r.pick([
        () => { // compare with decimals
          for (;;) { const [a, b] = co(r, 5, 12), [c, d] = co(r, 5, 12); const v1 = a / b, v2 = c / d; if (b === d || Math.abs(v1 - v2) < 0.004 || Math.abs(v1 - v2) > 0.12) continue;
            return { text: 'Write &lt; or &gt;. Show your method.', q: `${F(a, b)}\\ \\square\\ ${F(c, d)}`, a: [`${F(a, b)}=${a}\\div${b}${ap(v1)}`, `${F(c, d)}=${c}\\div${d}${ap(v2)}`, `${F(a, b)}${v1 < v2 ? '<' : '>'}${F(c, d)}`] }; }
        },
        () => { // simplify first, then scale (like Kenji)
          for (;;) { const [a, b] = co(r, 3, 6), k = r.pick([2, 3, 4, 5]), m = r.int(3, 9); const D0 = b * k, D1 = b * m; if (m === k || D1 % D0 === 0 || D0 % D1 === 0) continue;
            return { text: 'Find the missing number. (Simplify first.)', q: `${F(a * k, D0)}=${F('\\square', D1)}`, a: [`${F(a * k, D0)}=${F(a, b)}`, `${b}\\times${m}=${D1},\\ ${a}\\times${m}=${a * m}`, `${F(a * k, D0)}=${F(a * m, D1)}`] }; }
        }
      ])()
    }
  });
}
