/* Math 10-3 · Unit 1 · Lesson 4 — Proportions: Finding the Missing Value.
 * Explainers: proportion or not (verdict stamp), the three punch jugs, scale arrows (×5), why adding fails (bars),
 * the cross-multiply machine, why cross products match, words-first set-up, the hiking map scale, the photo lab,
 * round up or down (grass seed / muffin tray). Then the Eratosthenes history animation and the Stand Up Break. */
import { h, tex, add, box, svgEl, stamp, stampIn, pulse, tween, mountExplainers, arrowHead } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const hide = (...els) => els.forEach((e) => { if (e) e.style.opacity = 0; });
const ctr = (el) => { el.style.translate = '-50% -50%'; return el; };            // centre an absolutely placed element on (x, y)
const lab = (stage, html, x, y, cls) => ctr(add(stage, h('div', 'u1l4-lab' + (cls ? ' ' + cls : ''), html), x, y));
const tn = (v) => (typeof v === 'number' ? String(v) : v);                         // a number as TeX
const fr = (a, b) => `\\dfrac{${tn(a)}}{${tn(b)}}`;
const r10 = (v) => Math.round(v * 10) / 10;
const clean = (v) => parseFloat(v.toFixed(9));
/* a division result the way the booklet writes it: exact if it ends within 4 places, else 3 places */
const dec = (v) => { const e = clean(v); return Math.abs(e * 1e4 - Math.round(e * 1e4)) < 1e-6 ? String(e) : e.toFixed(3); };
const sp = (n) => (Math.abs(n) >= 10000 ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : String(n)); // 12\,500
function svgLayer(stage, W, H) { const s = svgEl('svg', { class: 'u1l4-svg', width: W, height: H, viewBox: `0 0 ${W} ${H}` }); stage.appendChild(s); return s; }
function drawPath(c, p, ms = 600) {
  const L = p.getTotalLength ? p.getTotalLength() : 300;
  p.style.strokeDasharray = L + ' ' + L;
  p.style.strokeDashoffset = L;
  return tween(c, ms, (t) => { p.style.strokeDashoffset = L * (1 - t); });
}
/* a column of panels on the right of a stage: hidden panels keep their space, so nothing moves when they appear */
const column = (stage, x, y, w) => add(stage, box(h('div', 'u1l4-col'), w), x, y);
const item = (col, html, cls) => { const e = col.appendChild(h('div', 'u1l4-pl u1l4-' + (cls || 'eq'), html)); hide(e); return e; };
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
/* a big fraction made of three HTML pieces (so each number can glow): returns { t, b, bar } */
function bigFrac(stage, cx, cy, top, bot, o = {}) {
  const gap = o.gap || 52, cls = 'u1l4-num' + (o.cls ? ' ' + o.cls : '');
  const t = lab(stage, top === 'x' ? T('x') : T(tn(top)), cx, cy - gap, cls + (top === 'x' ? ' isx' : ''));
  const b = lab(stage, bot === 'x' ? T('x') : T(tn(bot)), cx, cy + gap, cls + (bot === 'x' ? ' isx' : ''));
  const len = Math.max(String(top).length, String(bot).length);
  const bar = ctr(add(stage, box(h('div', 'u1l4-bar'), 36 + 30 * len, 5), cx, cy));
  return { t, b, bar };
}

/* =====================================================================================
 * 1. Proportion or not? Simplify both, or divide both. Verdict stamp.
 * ===================================================================================== */
const IP = {
  d: { L: [2, 3], R: [4, 6], how: 'simp', f: ':' },
  a: { L: [4, 6], R: [10, 15], how: 'simp', f: ':' },
  b: { L: [3, 8], R: [9, 16], how: 'div', f: 'f' },
  c: { L: [12, 20], R: [9, 15], how: 'simp', f: ':' }
};
const rTex = (p, f) => (f === 'f' ? fr(p[0], p[1]) : `${p[0]}:${p[1]}`);
const isProp = {
  title: 'Proportion or not?',
  height: 340,
  choices: [{ v: 'd', label: T('2:3') + ' and ' + T('4:6') }, { sep: 'Example 1 check:' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }, { v: 'c', label: '(c)' }],
  intro: (k) => `Do ${T(rTex(IP[k].L, IP[k].f))} and ${T(rTex(IP[k].R, IP[k].f))} form a proportion?`,
  make(stage, key, ex) {
    const W = ex.W, d = IP[key], cw = 330, xs = [W / 2 - 70 - cw, W / 2 + 70];
    const sides = [d.L, d.R].map((p, i) => {
      const card = add(stage, box(h('div', 'u1l4-rcard', `<div class="u1l4-rch">Ratio ${i + 1}</div><div class="u1l4-rcm">${T(rTex(p, d.f))}</div>`), cw, 196), xs[i], 18);
      let work, line, cap;
      if (d.how === 'simp') {
        const g = gcd(p[0], p[1]), s = [p[0] / g, p[1] / g];
        work = g > 1 ? `<span class="u1l4-op">÷ ${g}</span> ${T(rTex(s, ':'))}` : `${T(rTex(s, ':'))} <span class="u1l4-mut">simplest already</span>`;
        line = s;
        cap = g > 1 ? `Simplify ${T(rTex(p, d.f))}: divide both numbers by <b>${g}</b>. It becomes ${T(rTex(s, ':'))}.` : `${T(rTex(p, d.f))} is already in simplest form: no number divides both 2 and 3.`;
      } else {
        const v = p[0] / p[1];
        work = T(`${p[0]}\\div${p[1]}=${dec(v)}`);
        line = dec(v);
        cap = `Divide top by bottom: ${T(`${p[0]}\\div${p[1]}=${dec(v)}`)}.`;
      }
      const w = add(card, h('div', 'u1l4-rcw', work)); hide(w);
      return { card, w, line, cap };
    });
    const same = d.how === 'simp' ? sides[0].line.join(':') === sides[1].line.join(':') : sides[0].line === sides[1].line;
    const q = lab(stage, '?', W / 2, 116, 'u1l4-sign');
    const sign = lab(stage, same ? '=' : '≠', W / 2, 116, 'u1l4-sign ' + (same ? 'ok' : 'no')); hide(sign);
    const st = stamp(stage, same ? 'Proportion ✓' : 'Not a proportion ✗', { ok: same, x: W / 2, y: 272, size: 'lg' }); hide(st);
    const steps = sides.map((s) => ({ cap: s.cap, run: (c) => Promise.all([c.fadeIn(s.w, 400), pulse(c, s.card, 1.03)]) }));
    const res = d.how === 'simp' ? T(sides[0].line.join(':')) : '';
    steps.push({
      cap: d.how === 'simp'
        ? (same ? `Both are ${res}. Same ratio, so they <b>do</b> form a proportion.` : `Different ratios, so they do <b>not</b> form a proportion.`)
        : (same ? `The decimals are the same, so it <b>is</b> a proportion.` : `${T(sides[0].line)} and ${T(sides[1].line)} are different, so it is <b>not</b> a proportion.`),
      run: async (c) => { await c.anim(q, [{ opacity: 1 }, { opacity: 0 }], 200); await c.pop(sign, 360); await stampIn(c, st); }
    });
    return steps;
  }
};

/* =====================================================================================
 * 1b. Three jugs of punch: strength = scoops ÷ litres
 * ===================================================================================== */
const JUGS = [{ n: 'Jordan', s: 2, L: 3 }, { n: 'Priya', s: 5, L: 7.5 }, { n: 'Marco', s: 3, L: 5 }];
const punch = {
  title: 'Same strength?',
  height: 410,
  intro: () => `Jordan: 2 scoops in 3 L. Priya: 5 scoops in 7.5 L. Marco: 3 scoops in 5 L. Which punches taste the same?`,
  make(stage, _v, ex) {
    const W = ex.W, base = 316, k = 25, jw = 150, svg = svgLayer(stage, W, 410);
    const J = JUGS.map((j, i) => {
      const cx = W / 2 + (i - 1) * 300, x0 = cx - jw / 2, top = base - 8.2 * k, r = j.s / j.L;
      const g = svgEl('g', {}, svg);
      svgEl('path', { d: `M${x0 + jw - 6} ${top + 30} q42 8 34 56 q-6 40 -34 46`, class: 'u1l4-jhandle' }, g);
      const water = svgEl('rect', { x: x0 + 5, width: jw - 10, y: base, height: 0, fill: '#cfe6f7' }, g);
      const juice = svgEl('rect', { x: x0 + 5, width: jw - 10, y: base, height: 0, fill: '#d2304a', opacity: 0 }, g);
      svgEl('path', { d: `M${x0} ${top} L${x0} ${base - 10} q0 10 10 10 L${x0 + jw - 10} ${base} q10 0 10 -10 L${x0 + jw} ${top}`, class: 'u1l4-jug' }, g);
      for (let l = 1; l <= 8; l++) svgEl('line', { x1: x0, x2: x0 + 14, y1: base - l * k, y2: base - l * k, class: 'u1l4-jtick' }, g);
      const dots = Array.from({ length: j.s }, (_, m) => svgEl('circle', { cx: cx - (j.s - 1) * 11 + m * 22, cy: 20, r: 8, fill: '#c3243f', opacity: 0 }, g));
      lab(stage, `<b>${j.n}</b>`, cx, base + 26, 'u1l4-jn');
      lab(stage, `${j.s} scoops · ${j.L} L`, cx, base + 56, 'u1l4-jsub');
      const read = lab(stage, `${T(`${j.s}\\div${j.L}=${dec(r)}`)}`, cx, 44, 'u1l4-jread'); hide(read);
      return { j, cx, x0, water, juice, dots, read, r, op: Math.max(0.15, (r - 0.45) * 3.2), y: base - j.L * k };
    });
    const same = lab(stage, 'same strength', (J[0].cx + J[1].cx) / 2, 92, 'u1l4-same'); hide(same);
    const weak = stamp(stage, 'Weaker', { ok: false, x: J[2].cx, y: 196, size: 'lg', rotate: -9 }); hide(weak);
    return [
      { cap: `Each friend pours in water: <b>3 L</b>, <b>7.5 L</b> and <b>5 L</b>.`,
        run: (c) => tween(c, 1100, (t) => J.forEach((q) => { const hh = (base - q.y) * t; q.water.setAttribute('y', base - hh); q.water.setAttribute('height', hh); })) },
      { cap: `Then the scoops of crystals: <b>2</b>, <b>5</b> and <b>3</b>. More scoops per litre means a stronger (redder) punch.`,
        run: (c) => tween(c, 1500, (t) => J.forEach((q) => {
          q.dots.forEach((d, m) => { const u = Math.min(1, Math.max(0, (t - m * 0.09) / 0.5)); d.setAttribute('cy', 20 + (q.y - 20) * u); d.setAttribute('opacity', u > 0 && u < 1 ? 1 : 0); });
          q.juice.setAttribute('y', q.y); q.juice.setAttribute('height', base - q.y); q.juice.setAttribute('opacity', q.op * Math.min(1, Math.max(0, (t - 0.3) / 0.7)));
        })) },
      { cap: `Strength = scoops ÷ litres. Jordan: ${T('2\\div3=0.667')} scoops per litre.`, run: (c) => c.fadeIn(J[0].read, 380) },
      { cap: `Priya: ${T('5\\div7.5=0.667')}. The same! ${T('\\frac{2}{3}=\\frac{5}{7.5}')} is a proportion, so they are the <b>same strength</b>.`,
        run: async (c) => { await c.fadeIn(J[1].read, 380); await c.pop(same, 380); } },
      { cap: `Marco: ${T('3\\div5=0.6')}. That’s less than 0.667 scoops per litre, so Marco’s punch is <b>weaker</b>.`,
        run: async (c) => { await c.fadeIn(J[2].read, 380); await stampIn(c, weak); } }
    ];
  }
};

/* =====================================================================================
 * 2. Scale up or down: the ×5 arrows between the two fractions
 * ===================================================================================== */
const SC = {
  k1: { L: [2, 5], R: ['x', 30] },
  k2: { L: [10, 15], R: ['x', 3] },
  a: { L: [3, 4], R: ['x', 20] },
  b: { L: [5, 8], R: [35, 'x'] },
  c: { L: [18, 24], R: ['x', 4] },
  d: { L: [6, 'x'], R: [30, 45], colon: true }
};
function solveScale(d) {
  const xL = d.L.includes('x'), src = xL ? d.R : d.L, tgt = xL ? d.L : d.R;
  const r = tgt[0] === 'x' ? 1 : 0, o = 1 - r, a = src[r], b = tgt[r];
  const mul = b % a === 0, k = mul ? b / a : a / b, val = mul ? src[o] * k : src[o] / k;
  return { xL, src, tgt, r, o, a, b, mul, k, op: mul ? '\\times' : '\\div', opH: mul ? '×' : '÷', val };
}
const scale = {
  title: 'Scale up or down',
  height: 320,
  choices: [{ v: 'k1', label: T(fr(2, 5) + '=' + fr('x', 30)) }, { v: 'k2', label: T(fr(10, 15) + '=' + fr('x', 3)) }, { sep: 'Example 3 check:' }, ...'abcd'.split('').map((k) => ({ v: k, label: '(' + k + ')' }))],
  intro: (k) => SC[k].colon ? `Solve ${T('6:x=30:45')} by scaling. (As fractions: ${T(fr(6, 'x') + '=' + fr(30, 45))}.)` : `Solve ${T(fr(SC[k].L[0], SC[k].L[1]) + '=' + fr(SC[k].R[0], SC[k].R[1]))} by scaling.`,
  make(stage, key, ex) {
    const W = ex.W, d = SC[key], s = solveScale(d), cxs = [250, 560], cy = 160, svg = svgLayer(stage, W, 320);
    const F = [bigFrac(stage, cxs[0], cy, d.L[0], d.L[1]), bigFrac(stage, cxs[1], cy, d.R[0], d.R[1])];
    lab(stage, T('='), (cxs[0] + cxs[1]) / 2, cy, 'u1l4-num');
    const si = s.xL ? 1 : 0, ti = 1 - si;                       // source fraction, target fraction
    const el = (fi, row) => (row === 0 ? F[fi].t : F[fi].b);
    const xEl = el(ti, s.o);
    const valEl = lab(stage, T(s.val), cxs[ti], cy + (s.o === 0 ? -52 : 52), 'u1l4-num u1l4-val'); hide(valEl);
    function arc(row) {
      const x1 = cxs[si] + (si < ti ? 34 : -34), x2 = cxs[ti] + (si < ti ? -34 : 34), y = row === 0 ? cy - 96 : cy + 96, cyy = row === 0 ? y - 66 : y + 66, mx = (x1 + x2) / 2;
      const p = svgEl('path', { d: `M${x1} ${y} Q${mx} ${cyy} ${x2} ${y}`, class: 'u1l4-arc' }, svg);
      const hd = arrowHead(svg, x2, y, x2 - mx, y - cyy, { color: '#c27a0e', width: 4 }); hd.style.opacity = 0;
      const tag = lab(stage, `${s.opH} ${s.k}`, mx, row === 0 ? y - 44 : y + 44, 'u1l4-optag'); hide(tag);
      return { p, hd, tag };
    }
    const A1 = arc(s.r), A2 = arc(s.o);
    [A1, A2].forEach((A) => { const L = 400; A.p.style.strokeDasharray = L; A.p.style.strokeDashoffset = L; });
    const draw = async (c, A) => { await drawPath(c, A.p, 600); A.hd.style.opacity = 1; await c.pop(A.tag, 340); };
    const w1 = add(stage, h('div', 'u1l4-wl', T(`${s.a}${s.op}${s.k}=${s.b}`)), 740, 96); hide(w1);
    const w2 = add(stage, h('div', 'u1l4-wl', T(`x=${s.src[s.o]}${s.op}${s.k}=\\boldsymbol{${s.val}}`)), 740, 156); hide(w2);
    const top = s.xL ? (s.o === 0 ? [s.val, d.L[1]] : [d.L[0], s.val]) : (s.o === 0 ? [s.val, d.R[1]] : [d.R[0], s.val]);
    const other = s.xL ? d.R : d.L;
    const ok = Math.abs(top[0] / top[1] - other[0] / other[1]) < 1e-9;
    const w3 = add(stage, h('div', 'u1l4-wl u1l4-chk', `Check: ${T(`${top[0]}\\div${top[1]}=${dec(top[0] / top[1])}`)}<br>and ${T(`${other[0]}\\div${other[1]}=${dec(other[0] / other[1])}`)} ${ok ? '✓' : '✗'}`), 740, 220); hide(w3);
    return [
      { cap: `Find the pair with <b>both numbers known</b>: ${T(s.a)} and ${T(s.b)}.`,
        run: (c) => { [el(si, s.r), el(ti, s.r)].forEach((e) => e.classList.add('hot')); return Promise.all([pulse(c, el(si, s.r), 1.15), pulse(c, el(ti, s.r), 1.15)]); } },
      { cap: `What takes ${T(s.a)} to ${T(s.b)}? ${T(`${s.a}${s.op}${s.k}=${s.b}`)}.`, run: async (c) => { await draw(c, A1); await c.fadeIn(w1, 350); } },
      { cap: `Do the <b>same thing</b> to the other number: ${T(`${s.src[s.o]}${s.op}${s.k}`)}.`,
        run: async (c) => { el(si, s.o).classList.add('hot2'); await draw(c, A2); } },
      { cap: `So ${T(`x=${s.val}`)}.`, run: async (c) => { await c.anim(xEl, [{ opacity: 1 }, { opacity: 0 }], 220); await c.pop(valEl, 380); await c.fadeIn(w2, 350); } },
      { cap: `Check by dividing: both ratios give the same decimal ✓`, run: (c) => c.fadeIn(w3, 380) }
    ];
  }
};

/* =====================================================================================
 * 2b (Full notes). Why adding doesn't work: fraction bars
 * ===================================================================================== */
const addTrap = {
  title: 'Multiply, don’t add',
  height: 330,
  intro: () => `Is ${T('\\frac{3}{4}')} equal to ${T('\\frac{3\\times5}{4\\times5}')}? To ${T('\\frac{3+16}{4+16}')}?`,
  make(stage, _v, ex) {
    const W = ex.W, x0 = 250, bw = W - x0 - 180, bh = 56, ys = [30, 132, 234];
    const rows = [[3, 4, '\\dfrac{3}{4}'], [15, 20, '\\dfrac{3\\times5}{4\\times5}=\\dfrac{15}{20}'], [19, 20, '\\dfrac{3+16}{4+16}=\\dfrac{19}{20}']].map(([n, m, t], i) => {
      const g = add(stage, box(h('div', 'u1l4-fbar'), bw, bh), x0, ys[i]);
      for (let j = 0; j < m; j++) g.appendChild(h('div', 'u1l4-fcell' + (j < n ? ' on' + (i === 2 ? ' bad' : '') : '')));
      const l = add(stage, box(h('div', 'u1l4-flab', T(t)), 230), 10, ys[i] + 6);
      if (i) hide(g, l);
      return { g, l };
    });
    const v1 = add(stage, h('div', 'u1l4-fv ok', '✓ same amount'), x0 + bw + 10, ys[1] + 14); hide(v1);
    const v2 = add(stage, h('div', 'u1l4-fv no', '✗ more'), x0 + bw + 10, ys[2] + 14); hide(v2);
    const shadeLine = svgEl('line', { x1: x0 + bw * 0.75, x2: x0 + bw * 0.75, y1: ys[0] - 8, y2: ys[2] + bh + 8, class: 'u1l4-fguide' }, svgLayer(stage, W, 330)); shadeLine.style.opacity = 0;
    return [
      { cap: `${T('\\frac{3}{4}')}: 3 of 4 equal parts are shaded.`, run: (c) => pulse(c, rows[0].g, 1.03) },
      { cap: `Multiply top and bottom by 5: ${T('\\frac{15}{20}')}. Each part is cut into 5. The shaded amount is <b>the same</b> ✓`,
        run: async (c) => { await Promise.all([c.fadeIn(rows[1].g, 450), c.fadeIn(rows[1].l, 450)]); await c.anim(shadeLine, [{ opacity: 0 }, { opacity: 1 }], 300); await c.fadeIn(v1, 300); } },
      { cap: `Add 16 to top and bottom: ${T('\\frac{19}{20}')}. Much more is shaded. <b>Not equal</b> ✗`,
        run: async (c) => { await Promise.all([c.fadeIn(rows[2].g, 450), c.fadeIn(rows[2].l, 450)]); await c.fadeIn(v2, 300); } },
      { cap: `As decimals: ${T('3\\div4=0.75')} and ${T('15\\div20=0.75')}, but ${T('19\\div20=0.95')}. Multiplying keeps the ratio; adding changes it.`, run: (c) => pulse(c, rows[2].g, 1.03) }
    ];
  }
};

/* =====================================================================================
 * 3. Cross-multiply: light both diagonals, write the equation, divide, check
 * ===================================================================================== */
const CR = {
  k: { L: ['x', 12], R: [7, 8] },
  a: { L: [9, 'x'], R: [15, 40] },
  b: { L: [6, 11], R: ['x', 25], rnd: true },
  c: { L: [2.5, 4], R: [7, 'x'] }
};
function solveCross(d) {
  const [a, b] = d.L, [cc, dd] = d.R;
  const d1 = [a, dd], d2 = [b, cc];                           // a×d and b×c
  const xIn1 = d1.includes('x'), xd = xIn1 ? d1 : d2, nd = xIn1 ? d2 : d1;
  const coef = xd[0] === 'x' ? xd[1] : xd[0], prod = clean(nd[0] * nd[1]);
  const exact = prod / coef, val = d.rnd ? r10(exact) : clean(exact);
  const side = (p) => (p.includes('x') ? `${p[0] === 'x' ? p[1] : p[0]}\\times x` : `${p[0]}\\times${p[1]}`);
  const l1 = `\\textcolor{#1f5bd6}{${side(d1)}}=\\textcolor{#c27a0e}{${side(d2)}}`;
  const l2 = xIn1 ? `${coef}x=${prod}` : `${prod}=${coef}x`;
  const l3 = d.rnd ? `x=${prod}\\div${coef}=${exact.toFixed(3)}\\dots` : `x=${prod}\\div${coef}=\\boldsymbol{${val}}`;
  const chk = clean(val * coef);
  return { d1, d2, coef, prod, val, exact, l1, l2, l3, l4: d.rnd ? `\\boldsymbol{x\\approx${val}}` : null, chk };
}
const cross = {
  title: 'Cross-multiply',
  height: 350,
  choices: [{ v: 'k', label: T(fr('x', 12) + '=' + fr(7, 8)) }, { sep: 'Example 4 check:' }, ...'abc'.split('').map((k) => ({ v: k, label: '(' + k + ')' }))],
  intro: (k) => `Solve ${T(fr(CR[k].L[0], CR[k].L[1]) + '=' + fr(CR[k].R[0], CR[k].R[1]))}${CR[k].rnd ? '. Round to the nearest tenth.' : '.'}`,
  make(stage, key, ex) {
    const W = ex.W, d = CR[key], s = solveCross(d), cxs = [150, 360], cy = 165, svg = svgLayer(stage, W, 350);
    const F = [bigFrac(stage, cxs[0], cy, d.L[0], d.L[1], { gap: 62 }), bigFrac(stage, cxs[1], cy, d.R[0], d.R[1], { gap: 62 })];
    lab(stage, T('='), (cxs[0] + cxs[1]) / 2, cy, 'u1l4-num');
    const diag = (x1, y1, x2, y2, cls) => { const p = svgEl('path', { d: `M${x1} ${y1} L${x2} ${y2}`, class: cls }, svg); p.style.strokeDasharray = 400; p.style.strokeDashoffset = 400; return p; };
    const D1 = diag(cxs[0] + 30, cy - 70, cxs[1] - 30, cy + 70, 'u1l4-dg blue');
    const D2 = diag(cxs[0] + 30, cy + 70, cxs[1] - 30, cy - 70, 'u1l4-dg amber');
    const X0 = 500, lines = [s.l1, s.l2, s.l3, s.l4].filter(Boolean).map((t, i) => { const e = add(stage, h('div', 'u1l4-wl u1l4-bigw', T(t)), X0, 30 + i * 62); hide(e); return e; });
    const ckY = 30 + lines.length * 62 + 6;
    const numD = (s.d1.includes('x') ? s.d2 : s.d1).join('\\times');
    const ckTxt = d.rnd ? `Check: ${T(`${numD}=${s.prod}`)}; ${T(`${s.coef}\\times${s.val}=${s.chk}\\approx${s.prod}`)} ✓` : `Check: ${T(`${s.coef}\\times${s.val}=${s.chk}`)} and ${T(`${numD}=${s.prod}`)} ✓`;
    const ck = add(stage, box(h('div', 'u1l4-wl u1l4-chk', ckTxt), W - X0 - 20), X0, ckY); hide(ck);
    const hot = (els, cls) => els.forEach((e) => e.classList.add(cls));
    const steps = [
      { cap: `Multiply along one diagonal: ${T(`${tn(d.L[0])}\\times ${tn(d.R[1])}`)}.`, run: async (c) => { hot([F[0].t, F[1].b], 'hotb'); await drawPath(c, D1, 500); } },
      { cap: `Now the other diagonal: ${T(`${tn(d.L[1])}\\times ${tn(d.R[0])}`)}.`, run: async (c) => { hot([F[0].b, F[1].t], 'hota'); await drawPath(c, D2, 500); } },
      { cap: `The cross products are equal. Write the equation: ${T(s.l1.replace(/\\textcolor\{[^}]*\}/g, ''))}.`, run: (c) => c.fadeIn(lines[0], 380, { from: 'translateX(-12px)' }) },
      { cap: `Multiply out: ${T(s.l2)}.`, run: (c) => c.fadeIn(lines[1], 380, { from: 'translateX(-12px)' }) },
      { cap: `Divide both sides by <b>${s.coef}</b>, the number with ${T('x')}.${d.rnd ? ' Round only at the end.' : ''}`, run: async (c) => { await c.fadeIn(lines[2], 380, { from: 'translateX(-12px)' }); if (lines[3]) await c.fadeIn(lines[3], 380, { from: 'translateX(-12px)' }); } },
      { cap: d.rnd ? `Check: ${T(`${s.coef}\\times${s.val}=${s.chk}`)}, very close to ${T(s.prod)} (we rounded) ✓` : `Check: put ${T(s.val)} back in. Both cross products are ${T(s.prod)} ✓`, run: (c) => c.fadeIn(ck, 400) }
    ];
    return steps;
  }
};

/* =====================================================================================
 * 3b (Full notes). Why cross products match: give both fractions the same bottom
 * ===================================================================================== */
const WC = { p: [[2, 3], [4, 6]], q: [[3, 4], [15, 20]], n: [[3, 8], [9, 16]] };
const whyCross = {
  title: 'Same bottom, so compare the tops',
  height: 320,
  choices: [{ v: 'p', label: T(fr(2, 3) + '=' + fr(4, 6)) }, { v: 'q', label: T(fr(3, 4) + '=' + fr(15, 20)) }, { v: 'n', label: T(fr(3, 8)) + ' and ' + T(fr(9, 16)) }],
  intro: (k) => `Why are the cross products of ${T(fr(...WC[k][0]))} and ${T(fr(...WC[k][1]))} ${k === 'n' ? 'different' : 'equal'}?`,
  make(stage, key, ex) {
    const W = ex.W, [[a, b], [c2, d2]] = WC[key], B = b * d2, ok = a * d2 === b * c2;
    const cx = [W * 0.27, W * 0.73];
    lab(stage, T(fr(a, b)), cx[0], 60, 'u1l4-big');
    lab(stage, T(fr(c2, d2)), cx[1], 60, 'u1l4-big');
    const sg = lab(stage, T(ok ? '=' : '?'), W / 2, 60, 'u1l4-big');
    const e1 = lab(stage, T(`\\dfrac{${a}\\times${d2}}{${b}\\times${d2}}=\\dfrac{\\textcolor{#1f5bd6}{${a * d2}}}{${B}}`), cx[0], 170, 'u1l4-big2');
    const e2 = lab(stage, T(`\\dfrac{${c2}\\times${b}}{${d2}\\times${b}}=\\dfrac{\\textcolor{#c27a0e}{${c2 * b}}}{${B}}`), cx[1], 170, 'u1l4-big2');
    const fin = lab(stage, ok ? `Same bottom, so the tops must match: ${T(`${a}\\times${d2}=${b}\\times${c2}`)}` : `${T(`${a * d2}\\neq${c2 * b}`)}: the cross products are different, so it is <b>not</b> a proportion.`, W / 2, 278, 'u1l4-fin' + (ok ? '' : ' no'));
    hide(e1, e2, fin); void sg;
    return [
      { cap: `Multiply ${T(fr(a, b))} by ${T(fr(d2, d2))} (the other bottom, over itself). The value doesn’t change.`, run: (c) => c.fadeIn(e1, 400) },
      { cap: `Multiply ${T(fr(c2, d2))} by ${T(fr(b, b))}. Now both bottoms are ${T(B)}.`, run: (c) => c.fadeIn(e2, 400) },
      { cap: `The new tops are ${T(`${a}\\times${d2}`)} and ${T(`${c2}\\times${b}`)}: exactly the two <b>cross products</b>.`, run: (c) => Promise.all([pulse(c, e1, 1.06), pulse(c, e2, 1.06)]) },
      { cap: ok ? `Equal fractions with the same bottom have equal tops. That’s why cross-multiplying works.` : `Cross products are a third way to test for a proportion: different products, not a proportion.`, run: (c) => c.fadeIn(fin, 400) }
    ];
  }
};

/* =====================================================================================
 * 4. Words first, then numbers
 * ===================================================================================== */
const SU = {
  e5a: { ask: 'A muffin recipe uses 2.5 cups of flour to make 12 muffins. How much flour is needed for 30 muffins?', w: ['flour', 'muffins'], L: [2.5, 12], R: ['x', 30],
    est: 'Estimate: 30 muffins is a bit more than 2 batches of 12, so a bit more than <b>5 cups</b>.',
    eq: ['12x=2.5\\times30=75', 'x=75\\div12=6.25'], sense: '6.25 is a bit more than 5, so it makes sense ✓', ans: 'You need <b>6.25 cups</b> of flour (about 6¼ cups).' },
  e5b: { ask: 'The recipe uses 2.5 cups of flour for 12 muffins. Lena has only 4 cups of flour. How many whole muffins can she make?', w: ['flour', 'muffins'], L: [2.5, 12], R: [4, 'x'],
    eq: ['2.5x=12\\times4=48', 'x=48\\div2.5=19.2'], sense: 'She can’t bake 0.2 of a muffin, so round <b>down</b>.', ans: 'Lena can make <b>19 muffins</b>.' },
  e7a: { ask: 'Gas and oil are mixed 50 : 1. How many millilitres of oil go with 4 L of gas?', w: ['gas', 'oil'], L: [50, 1], R: ['4000', 'x'], conv: ['4\\text{ L}', '4000\\text{ mL}'],
    eq: ['50x=4000', 'x=4000\\div50=80'], sense: 'Check: 50 × 80 = 4000 mL, the gas ✓', ans: 'Mix <b>80 mL</b> of oil with 4 L of gas.' },
  e8: { ask: 'The order is 1.5 mL for every 10 kg of body mass. How many millilitres for a 24 kg child?', w: ['mL', 'kg'], L: [1.5, 10], R: ['x', 24],
    eq: ['10x=1.5\\times24=36', 'x=36\\div10=3.6'], sense: '24 kg is a bit more than 2 × 10 kg, so a bit more than 3 mL ✓', ans: 'The child should get <b>3.6 mL</b>.' }
};
const setup = {
  title: 'Words first, then numbers',
  height: 380,
  choices: [{ sep: 'Example 5 check:' }, { v: 'e5a', label: '(a) 30 muffins' }, { v: 'e5b', label: '(b) 4 cups' }, { sep: 'Example 7 check:' }, { v: 'e7a', label: '(a) oil' }, { sep: 'Example 8 check:' }, { v: 'e8', label: 'dose' }],
  intro: (k) => SU[k].ask,
  make(stage, key, ex) {
    const W = ex.W, d = SU[key], cxs = [140, 380], cy = 175, sw = 190;
    const slot = (cx, y, word, cls) => {
      const s = ctr(add(stage, box(h('div', 'u1l4-slot ' + cls, `<span class="u1l4-sw">${word}</span><span class="u1l4-sv"></span>`), sw, 92), cx, y));
      return { s, w: s.querySelector('.u1l4-sw'), v: s.querySelector('.u1l4-sv') };
    };
    const S = [[slot(cxs[0], cy - 58, d.w[0], 'a'), slot(cxs[0], cy + 58, d.w[1], 'b')], [slot(cxs[1], cy - 58, d.w[0], 'a'), slot(cxs[1], cy + 58, d.w[1], 'b')]];
    [0, 1].forEach((i) => ctr(add(stage, box(h('div', 'u1l4-bar'), sw - 10, 5), cxs[i], cy)));
    lab(stage, T('='), (cxs[0] + cxs[1]) / 2, cy, 'u1l4-num');
    S[1].forEach((q) => hide(q.s));
    S[0].forEach((q) => hide(q.s));
    const put = (q, v) => { q.v.innerHTML = v === 'x' ? T('x') : T(sp(v)); if (v === 'x') q.v.classList.add('isx'); };
    put(S[0][0], d.L[0]); put(S[0][1], d.L[1]); put(S[1][0], d.R[0]); put(S[1][1], d.R[1]);
    const vals = [S[0][0].v, S[0][1].v, S[1][0].v, S[1][1].v]; hide(...vals);
    const col = column(stage, 520, 16, W - 540);
    const est = d.est ? item(col, d.est, 'est') : null;
    const conv = d.conv ? item(col, `Units must match: ${T(`${d.conv[0]}=${d.conv[1]}`)}<br><span class="u1l4-mut">(${T('\\frac{50}{1}=\\frac{4}{x}')} would give 0.08, and 0.08 mL of oil in 4 L makes no sense!)</span>`, 'conv') : null;
    const eqs = d.eq.map((t) => item(col, T(t), 'eq'));
    const sense = item(col, d.sense, 'sense');
    const ans = item(col, d.ans, 'ans');
    const steps = [];
    if (est) steps.push({ cap: d.est, run: (c) => c.fadeIn(est, 380) });
    steps.push({ cap: `Which two things are compared? <b>${d.w[0]}</b> and <b>${d.w[1]}</b>.`, run: (c) => Promise.all(S[0].map((q, i) => c.pop(q.s, 380, { delay: i * 120 }))) });
    steps.push({ cap: `Word proportion: the <b>same thing in the same place</b> on both sides: ${d.w[0]} on top, ${d.w[1]} on the bottom.`, run: (c) => Promise.all(S[1].map((q, i) => c.pop(q.s, 380, { delay: i * 120 }))) });
    if (conv) steps.push({ cap: `Before the numbers go in: the units must match. ${T('4\\text{ L}=4000\\text{ mL}')}.`, run: (c) => c.fadeIn(conv, 400) });
    steps.push({ cap: `Put in the numbers. The missing one is ${T('x')}: ${T(fr(sp(d.L[0]), sp(d.L[1])) + '=' + fr(sp(d.R[0]), sp(d.R[1])))}.`, run: (c) => Promise.all(vals.map((v, i) => c.fadeIn(v, 340, { delay: i * 110 }))) });
    steps.push({ cap: `Solve: cross-multiply, then divide. ${T(d.eq[d.eq.length - 1])}.`, run: async (c) => { for (const e of eqs) await c.fadeIn(e, 340, { from: 'translateX(-12px)' }); } });
    steps.push({ cap: `Does it make sense? ${d.sense}`, run: (c) => c.fadeIn(sense, 380) });
    steps.push({ cap: `Write a sentence with units. ${d.ans}`, run: (c) => c.pop(ans, 400) });
    return steps;
  }
};

/* =====================================================================================
 * 4b. The hiking map: 2 cm → 5 km, measure, set up, check with the scale bar
 * ===================================================================================== */
const MAP = {
  a: { ask: 'On the map, 2 cm represents 5 km. Two campsites are 7.4 cm apart on the map. How far apart are they really?', cm: 7.4, km: 18.5, find: 'km',
    eq: ['\\dfrac{2}{5}=\\dfrac{7.4}{x}', '2x=5\\times7.4=37', 'x=37\\div2=\\boldsymbol{18.5}'], ans: 'The campsites are <b>18.5 km</b> apart.' },
  b: { ask: 'On the map, 2 cm represents 5 km. A trail is 12 km long. How long is it on the map?', cm: 4.8, km: 12, find: 'cm',
    eq: ['\\dfrac{2}{5}=\\dfrac{x}{12}', '5x=2\\times12=24', 'x=24\\div5=\\boldsymbol{4.8}'], ans: 'The trail is <b>4.8 cm</b> long on the map.' }
};
const map = {
  title: 'Map scale: 2 cm → 5 km',
  height: 380,
  choices: [{ sep: 'Example 6 check:' }, { v: 'a', label: '(a) campsites' }, { v: 'b', label: '(b) trail' }],
  intro: (k) => MAP[k].ask,
  make(stage, key, ex) {
    const W = ex.W, d = MAP[key], U = 64, mx = 16, my = 14, mw = 620, mh = 350, x0 = mx + 50, yT = my + 170;
    const m = add(stage, box(h('div', 'u1l4-map'), mw, mh), mx, my);
    const svg = svgLayer(stage, W, 380);
    // contour rings and a lake for flavour
    [[180, 110, 70, 38], [180, 110, 44, 22], [470, 300, 90, 40], [470, 300, 56, 22]].forEach(([cx, cy, rx, ry]) => svgEl('ellipse', { cx: mx + cx, cy: my + cy, rx, ry, class: 'u1l4-contour' }, svg));
    svgEl('path', { d: `M${mx + 430} ${my + 40} q60 -20 110 10 q30 30 -10 50 q-50 20 -100 -10 q-30 -25 0 -50 z`, class: 'u1l4-lake' }, svg);
    // the winding trail and the two campsites (part a) or the trailhead (part b)
    if (key === 'a') svgEl('path', { d: `M${x0} ${yT} C ${x0 + 120} ${yT - 120}, ${x0 + 260} ${yT + 110}, ${x0 + 330} ${yT - 30} S ${x0 + 440} ${yT - 60}, ${x0 + d.cm * U} ${yT}`, class: 'u1l4-trail' }, svg);
    const tent = (x, name) => { const g = svgEl('g', {}, svg); svgEl('path', { d: `M${x - 16} ${yT + 2} L${x} ${yT - 26} L${x + 16} ${yT + 2} Z`, class: 'u1l4-tent' }, g); lab(stage, name, x, yT - 42, 'u1l4-mlab'); return g; };
    if (key === 'a') { tent(x0, 'Camp A'); tent(x0 + d.cm * U, 'Camp B'); } else { svgEl('circle', { cx: x0, cy: yT, r: 9, class: 'u1l4-thead' }, svg); lab(stage, 'Trailhead', x0 + 4, yT - 30, 'u1l4-mlab'); }
    // scale bar (top left of the map)
    const sb = svgEl('g', {}, svg);
    svgEl('rect', { x: mx + 30, y: my + 26, width: 2 * U, height: 10, class: 'u1l4-sbar2' }, sb);
    const sbl = lab(stage, `${T('2')} cm = ${T('5')} km`, mx + 30 + U, my + 54, 'u1l4-mlab b');
    // ruler along the bottom
    const R = add(stage, box(h('div', 'u1l4-ruler'), 8 * U + 24, 46), x0 - 12, my + mh - 66);
    for (let i = 0; i <= 16; i++) { const t = h('i', i % 2 ? 'h' : ''); t.style.left = (12 + i * U / 2) + 'px'; R.appendChild(t); if (i % 2 === 0) { const n = h('b', '', String(i / 2)); n.style.left = (12 + i * U / 2) + 'px'; R.appendChild(n); } }
    hide(R);
    // the measured line and the scale-bar hops
    const L = d.cm * U, ym = yT + 40;
    const meas = svgEl('path', { d: `M${x0} ${ym} L${x0 + L} ${ym}`, class: 'u1l4-meas' + (key === 'b' ? ' new' : '') }, svg);
    meas.style.strokeDasharray = L + 1; meas.style.strokeDashoffset = L + 1;
    const mlab = lab(stage, `${T(d.cm)} cm`, x0 + L / 2, ym - 16, 'u1l4-mlab m'); hide(mlab);
    const hops = []; const n = d.km / 5;
    for (let i = 0; i < Math.ceil(n - 1e-9); i++) {
      const a = x0 + i * 2 * U, b = Math.min(x0 + L, a + 2 * U), last = b === x0 + L;
      const p = svgEl('path', { d: `M${a} ${ym + 4} Q${(a + b) / 2} ${ym + 44} ${b} ${ym + 4}`, class: 'u1l4-hop' }, svg); p.style.opacity = 0;
      const t = lab(stage, last ? `${d.km} km` : `${(i + 1) * 5} km`, (a + b) / 2, ym + 46, 'u1l4-hlab' + (last ? ' end' : '')); hide(t);
      hops.push({ p, t });
    }
    const col = column(stage, mx + mw + 20, 14, W - mx - mw - 34);
    const words = item(col, T('\\dfrac{\\text{map (cm)}}{\\text{real (km)}}'));
    const eqs = d.eq.map((t) => item(col, T(t)));
    const ans = item(col, d.ans, 'ans');
    const steps = [{ cap: `The scale: <b>2 cm</b> on the map is <b>5 km</b> for real.`, run: (c) => Promise.all([pulse(c, sb, 1.08), pulse(c, sbl, 1.12)]) }];
    if (key === 'a') steps.push({ cap: `Measure with a ruler: the campsites are <b>7.4 cm</b> apart on the map.`, run: async (c) => { await c.fadeIn(R, 400, { from: 'translateY(20px)' }); await drawPath(c, meas, 700); await c.fadeIn(mlab, 300); } });
    else steps.push({ cap: `The real trail is <b>12 km</b>. We want its length on the map, in cm.`, run: (c) => c.fadeIn(R, 400, { from: 'translateY(20px)' }) });
    steps.push({ cap: `Words first: map (cm) over real (km) on both sides. ${T(d.eq[0])}`, run: async (c) => { await c.fadeIn(words, 350); await c.fadeIn(eqs[0], 350); } });
    steps.push({ cap: `Cross-multiply and divide: ${T(d.eq[2].replace('\\boldsymbol', ''))}.`, run: async (c) => { await c.fadeIn(eqs[1], 350); await c.fadeIn(eqs[2], 350); } });
    if (key === 'b') steps.push({ cap: `Draw it on the map: a line <b>4.8 cm</b> long.`, run: async (c) => { await drawPath(c, meas, 700); await c.fadeIn(mlab, 300); } });
    steps.push({
      cap: key === 'a' ? `Check with the scale bar: each 2 cm is 5 km. 7.4 cm is 3.7 scale bars, and ${T('3.7\\times5=18.5')} ✓` : `Check with the scale bar: 12 km is 2.4 lots of 5 km, so ${T('2.4\\times2=4.8')} cm ✓`,
      run: async (c) => { for (const q of hops) { await c.anim(q.p, [{ opacity: 0 }, { opacity: 1 }], 260); await c.pop(q.t, 260); } }
    });
    steps.push({ cap: d.ans, run: (c) => c.pop(ans, 380) });
    return steps;
  }
};

/* =====================================================================================
 * 5b. The photo lab: enlarge without stretching (a), and the frame that doesn't fit (b)
 * ===================================================================================== */
const PHOTO_SVG = `<svg viewBox="0 0 100 150" preserveAspectRatio="none"><defs><linearGradient id="u1l4-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cb7e8"/><stop offset="1" stop-color="#dcefff"/></linearGradient></defs>
<rect width="100" height="150" fill="url(#u1l4-sky)"/><circle cx="74" cy="30" r="11" fill="#ffd34d"/>
<path d="M0 104 L28 58 L46 84 L64 50 L100 100 L100 150 L0 150 Z" fill="#6f8796"/><path d="M28 58 L35 70 L22 68 Z M64 50 L72 62 L57 61 Z" fill="#fff"/>
<rect y="112" width="100" height="38" fill="#5c9b4c"/><path d="M18 128 l8 -26 l8 26 z" fill="#2f6b34"/><rect x="24" y="128" width="4" height="7" fill="#6e4a1c"/></svg>`;
const photo = {
  title: 'The photo lab',
  height: 390,
  choices: [{ sep: 'Example 9 check:' }, { v: 'a', label: '(a) 24 cm wide' }, { v: 'b', label: '(b) the frame' }],
  intro: (k) => (k === 'a' ? 'A 10 cm by 15 cm photo is enlarged to 24 cm wide without stretching. How tall is it?' : 'Can the 10 cm by 15 cm photo fill a 20 cm by 25 cm frame exactly, without cutting any off?'),
  make(stage, key, ex) {
    const W = ex.W, U = key === 'a' ? 8 : 10, base = 340;
    const pic = (x, wcm, hcm) => { const p = add(stage, box(h('div', 'u1l4-photo', PHOTO_SVG), wcm * U, hcm * U), x, base - hcm * U); return p; };
    const small = pic(36, 10, 15);
    const wl = lab(stage, '10 cm', 36 + 5 * U, base + 18, 'u1l4-dim');
    const hl = lab(stage, '15 cm', 36 + 10 * U + 30, base - 7.5 * U, 'u1l4-dim');
    const X0 = key === 'a' ? 500 : 610, col = column(stage, X0, 16, W - X0 - 16);
    if (key === 'a') {
      const bx = 200, big = pic(bx, 10, 15); hide(big);
      const bw = lab(stage, '24 cm', bx + 12 * U, base + 18, 'u1l4-dim'); hide(bw);
      const bh = lab(stage, '? cm', bx + 24 * U + 34, base - 18 * U, 'u1l4-dim u1l4-q'); hide(bh);
      const bh2 = lab(stage, '36 cm', bx + 24 * U + 34, base - 18 * U, 'u1l4-dim'); hide(bh2);
      const p0 = item(col, T('\\dfrac{\\text{width}}{\\text{height}}=\\dfrac{\\text{width}}{\\text{height}}'));
      const p1 = item(col, T('\\dfrac{10}{15}=\\dfrac{24}{x}'));
      const p2 = item(col, T('10x=15\\times24=360'));
      const p3 = item(col, T('x=360\\div10=\\boldsymbol{36}'));
      const p4 = item(col, 'The enlargement is <b>36 cm</b> tall.', 'ans');
      const grow = (c, w1, h1, ms) => tween(c, ms, (t) => { const ww = (10 + (w1 - 10) * t) * U, hh = (15 + (h1 - 15) * t) * U; big.style.width = ww + 'px'; big.style.height = hh + 'px'; big.style.top = (base - hh) + 'px'; });
      return [
        { cap: `The photo is <b>10 cm</b> wide and <b>15 cm</b> tall.`, run: (c) => Promise.all([pulse(c, small, 1.05), pulse(c, wl, 1.15), pulse(c, hl, 1.15)]) },
        { cap: `Words first: width over height on both sides. ${T('\\frac{10}{15}=\\frac{24}{x}')}`, run: async (c) => { await c.fadeIn(p0, 350); await c.fadeIn(p1, 350); } },
        { cap: `Make it <b>24 cm</b> wide. The height must grow in the same ratio, but by how much?`, run: async (c) => { await c.fadeIn(bw, 300); await c.fadeIn(bh, 300); } },
        { cap: `Cross-multiply: ${T('10x=15\\times24=360')}, so ${T('x=36')}.`, run: async (c) => { await c.fadeIn(p2, 350); await c.fadeIn(p3, 350); } },
        { cap: `<b>36 cm</b> tall. Same shape, no stretching ✓`, run: async (c) => { await c.anim(bh, [{ opacity: 1 }, { opacity: 0 }], 200); big.style.opacity = 1; await grow(c, 24, 36, 1100); await c.pop(bh2, 340); await c.pop(p4, 340); } }
      ];
    }
    // (b) the 20 × 25 frame
    const fx = 220, fy = base - 25 * U - 20, big = add(stage, box(h('div', 'u1l4-photo', PHOTO_SVG), 20 * U, 30 * U), fx, fy - 2.5 * U); hide(big);
    const cutT = add(stage, box(h('div', 'u1l4-cut'), 20 * U, 2.5 * U), fx, fy - 2.5 * U), cutB = add(stage, box(h('div', 'u1l4-cut'), 20 * U, 2.5 * U), fx, fy + 25 * U); hide(cutT, cutB);
    const frame = add(stage, box(h('div', 'u1l4-frame'), 20 * U + 24, 25 * U + 24), fx - 12, fy - 12); hide(frame);
    const fl = lab(stage, '20 cm by 25 cm', fx + 10 * U, fy - 36, 'u1l4-dim'); hide(fl);
    const cutL = add(stage, h('div', 'u1l4-dim no left', '2.5 cm cut off<br>top and bottom'), fx + 20 * U + 22, fy + 12.5 * U - 26); hide(cutL);
    const p1 = item(col, `Photo: ${T('10\\div15=0.667')}`);
    const p2 = item(col, `Frame: ${T('20\\div25=0.8')}`);
    const sw = col.appendChild(h('div', 'u1l4-stw')), st = stamp(sw, 'Not equal', { ok: false, size: 'lg' }); hide(st);
    const p3 = item(col, `At 20 cm wide: ${T('\\frac{10}{15}=\\frac{20}{x}')}, so ${T('x=30')} cm tall.`);
    const p4 = item(col, '<b>No.</b> Some of the photo would have to be cut off (cropped).', 'ans');
    return [
      { cap: `The photo is <b>10 cm</b> by <b>15 cm</b>. The frame is <b>20 cm</b> by <b>25 cm</b>.`, run: async (c) => { await c.fadeIn(frame, 400); await c.fadeIn(fl, 300); } },
      { cap: `Compare the ratios (width ÷ height): photo ${T('10\\div15=0.667')}, frame ${T('20\\div25=0.8')}.`, run: async (c) => { await c.fadeIn(p1, 350); await c.fadeIn(p2, 350); } },
      { cap: `The ratios are <b>not equal</b>, so the photo can’t fill the frame exactly.`, run: (c) => stampIn(c, st) },
      { cap: `Try it: enlarge the photo to 20 cm wide. It becomes <b>30 cm</b> tall, 5 cm too tall for the frame.`, run: async (c) => { await c.fadeIn(p3, 350); await c.fadeIn(big, 500); await Promise.all([c.fadeIn(cutT, 300), c.fadeIn(cutB, 300)]); await c.fadeIn(cutL, 300); } },
      { cap: `<b>No:</b> some of the photo would have to be cut off (cropped).`, run: (c) => c.pop(p4, 380) }
    ];
  }
};

/* =====================================================================================
 * 5c (Full notes). Round up or round down? Grass seed and the muffin tray
 * ===================================================================================== */
const roundIt = {
  title: 'Round up or round down?',
  height: 340,
  choices: [{ v: 'seed', label: 'Grass seed (Example 10)' }, { v: 'muf', label: 'Muffins (Example 5b)' }],
  intro: (k) => (k === 'seed' ? 'Each bag of seed covers 45 m². The lawn is 160 m². How many bags?' : 'With 4 cups of flour (2.5 cups makes 12), how many whole muffins?'),
  make(stage, key, ex) {
    const W = ex.W, col = column(stage, 470, 16, W - 486);
    const pnl = (html) => item(col, html);
    const stw = () => col.appendChild(h('div', 'u1l4-stw'));
    if (key === 'seed') {
      const U = 24, lx = 36, ly = 46, lw = 16 * U, lh = 10 * U;
      const lawn = add(stage, box(h('div', 'u1l4-lawn'), lw, lh), lx, ly);
      lab(stage, '160 m² of bare dirt (16 m by 10 m)', lx + lw / 2, 24, 'u1l4-dim');
      const strips = [0, 1, 2, 3].map((i) => { const w = Math.min(4.5 * U, lw - i * 4.5 * U); const s = add(lawn, box(h('div', 'u1l4-strip', `bag ${i + 1}`), w, lh), i * 4.5 * U, 0); s.style.position = 'absolute'; hide(s); return s; });
      const bare = lab(stage, '25 m²<br>still bare!', lx + 13.5 * U + 1.25 * U, ly + lh / 2, 'u1l4-dim no'); hide(bare);
      const p1 = pnl(T('\\dfrac{1}{45}=\\dfrac{x}{160}')), p2 = pnl(T('x=160\\div45=3.56\\text{ bags}'));
      const p3 = pnl(`3 bags cover ${T('3\\times45=135')} m²`);
      const st = stamp(stw(), 'Round up: 4 bags', { ok: true, size: 'lg' }); hide(st);
      return [
        { cap: `Mateo’s lawn is <b>160 m²</b>. Each bag covers <b>45 m²</b>. ${T('\\frac{1}{45}=\\frac{x}{160}')}`, run: async (c) => { await pulse(c, lawn, 1.03); await c.fadeIn(p1, 350); } },
        { cap: `${T('45x=160')}, so ${T('x=160\\div45=3.56')} bags.`, run: (c) => c.fadeIn(p2, 350) },
        { cap: `Spread 3 bags: they cover ${T('3\\times45=135')} m². <b>25 m²</b> is still bare dirt!`, run: async (c) => { for (const s of strips.slice(0, 3)) await c.fadeIn(s, 380, { from: 'scaleX(.2)' }); await c.fadeIn(p3, 300); await c.pop(bare, 340); } },
        { cap: `3 bags is not enough. Round <b>up</b>: Mateo must buy <b>4 bags</b> (with a little seed left over).`, run: async (c) => { await c.anim(bare, [{ opacity: 1 }, { opacity: 0 }], 200); await c.fadeIn(strips[3], 380, { from: 'scaleX(.2)' }); await stampIn(c, st); } }
      ];
    }
    // muffin tray: 4 rows of 5
    const tx = 30, ty = 20, G = 76, R = 30;
    add(stage, box(h('div', 'u1l4-tray'), 5 * G + 16, 4 * G + 16), tx - 8, ty - 8);
    const cups = Array.from({ length: 20 }, (_, i) => {
      const cx = tx + (i % 5) * G + G / 2, cy = ty + Math.floor(i / 5) * G + G / 2;
      ctr(add(stage, box(h('div', 'u1l4-cup'), 2 * R, 2 * R), cx, cy));
      const mw = i === 19 ? 24 : 2 * R - 6, m = ctr(add(stage, box(h('div', 'u1l4-muf' + (i === 19 ? ' u1l4-part' : '')), mw, mw), cx, cy)); hide(m);
      return m;
    });
    const tag = lab(stage, '0.2', tx + 5 * G + 26, ty + 3 * G + G / 2, 'u1l4-dim no'); hide(tag);
    const p1 = pnl(T('\\dfrac{2.5}{12}=\\dfrac{4}{x}')), p2 = pnl(T('x=48\\div2.5=19.2\\text{ muffins}'));
    const st = stamp(stw(), 'Round down: 19', { ok: true, size: 'lg' }); hide(st);
    return [
      { cap: `Set up: ${T('\\frac{2.5}{12}=\\frac{4}{x}')}, so ${T('2.5x=48')} and ${T('x=19.2')} muffins.`, run: async (c) => { await c.fadeIn(p1, 350); await c.fadeIn(p2, 350); } },
      { cap: `Fill the tray: <b>19</b> full muffins…`, run: (c) => tween(c, 1600, (t) => cups.slice(0, 19).forEach((m, i) => { m.style.opacity = t * 19 > i ? 1 : 0; })) },
      { cap: `…and only <b>0.2</b> of a muffin for the 20th. You can’t bake 0.2 of a muffin!`, run: async (c) => { await c.fadeIn(cups[19], 400); await c.pop(tag, 300); } },
      { cap: `Round <b>down</b>: Lena can make <b>19 muffins</b>.`, run: (c) => stampIn(c, st) }
    ];
  }
};

mountExplainers({ isProp, punch, scale, addTrap, cross, whyCross, setup, map, photo, roundIt });

/* ---------- Math History (the brown box): Eratosthenes measures the Earth ----------
 * Sun rays come straight down. Syene's stick has no shadow; Alexandria's makes 7.2°. The same 7.2° at the centre cuts off
 * the 5000 stadia between them, and 50 such slices go around the whole Earth: 50 × 5000 = 250 000 stadia. Plays once
 * when the box is half in view; a tap or Replay plays it again; reduced motion shows the finished picture. */
(function eratosthenes() {
  const svg = document.getElementById('u1l4-hist'); if (!svg) return;
  const NS = 'http://www.w3.org/2000/svg';
  const mk = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); Object.keys(attrs || {}).forEach((k) => e.setAttribute(k, attrs[k])); (parent || svg).appendChild(e); return e; };
  const txt = (s, attrs, parent) => { const e = mk('text', attrs, parent); e.textContent = s; return e; };
  const steps = []; const at = (el, t) => { steps.push({ el, t }); el.classList.add('u1l4h-g'); return el; };
  const O = [150, 180], R = 118, rad = (d) => (d * Math.PI) / 180, P = (deg, r = R) => [O[0] + r * Math.cos(rad(deg)), O[1] + r * Math.sin(rad(deg))];
  const aS = -90, aA = -90 - 7.2;           // Syene straight up; Alexandria 7.2° round the curve
  mk('circle', { cx: O[0], cy: O[1], r: R, class: 'u1l4h-earth' });
  // 50 slices (each 7.2°) fill the circle late in the play
  for (let i = 0; i < 50; i++) {
    const a1 = aA + i * 7.2, a2 = a1 + 7.2, [x1, y1] = P(a1), [x2, y2] = P(a2);
    at(mk('path', { d: `M${O[0]} ${O[1]} L${x1.toFixed(1)} ${y1.toFixed(1)} A${R} ${R} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z`, class: 'u1l4h-slice' + (i % 2 ? ' alt' : '') }), 7600 + i * 70);
  }
  // sun rays straight down
  const rays = at(mk('g', {}), 500);
  for (let x = 70; x <= 230; x += 20) mk('line', { x1: x, y1: 0, x2: x, y2: 24, class: 'u1l4h-ray' }, rays);
  txt('sun’s rays', { x: 238, y: 18, class: 'u1l4h-sm' }, rays);
  // the two sticks
  const [sx, sy] = P(aS), [ax, ay] = P(aA), [sx2, sy2] = P(aS, R + 22), [ax2, ay2] = P(aA, R + 22);
  const gS = at(mk('g', {}), 1500);
  mk('line', { x1: sx, y1: sy, x2: sx2, y2: sy2, class: 'u1l4h-stick' }, gS); txt('Syene', { x: sx + 10, y: sy2 + 8, class: 'u1l4h-city' }, gS);
  const gA = at(mk('g', {}), 2700);
  mk('line', { x1: ax, y1: ay, x2: ax2, y2: ay2, class: 'u1l4h-stick' }, gA); txt('Alexandria', { x: ax2 - 8, y: ay2 + 8, 'text-anchor': 'end', class: 'u1l4h-city' }, gA);
  // lines to the centre and the 7.2° slice
  const gC = at(mk('g', {}), 4100);
  mk('line', { x1: O[0], y1: O[1], x2: sx, y2: sy, class: 'u1l4h-rad' }, gC); mk('line', { x1: O[0], y1: O[1], x2: ax, y2: ay, class: 'u1l4h-rad' }, gC);
  txt('7.2°', { x: O[0] - 12, y: O[1] - 34, 'text-anchor': 'end', class: 'u1l4h-ang' }, gC);
  const [k1x, k1y] = P(aA), [k2x, k2y] = P(aS);
  const arc = at(mk('path', { d: `M${k1x} ${k1y} A${R} ${R} 0 0 1 ${k2x} ${k2y}`, class: 'u1l4h-arc' }), 5400);
  void arc;
  // the words on the right
  const lines = [
    ['Noon, the longest day:', 1000, ''], ['Syene: no shadow.', 1900, ''], ['Alexandria: a 7.2° shadow.', 3100, ''],
    ['The same 7.2° at the centre', 4500, ''], ['is 1/50 of the circle. Its slice', 5000, ''], ['of the Earth: 5000 stadia.', 5800, 'u1l4h-gold'],
    ['50 slices go all the way round:', 11400, ''], ['50 × 5000 = 250 000 stadia', 12400, 'u1l4h-big']
  ];
  lines.forEach(([s, t, cls], i) => at(txt(s, { x: 300, y: 40 + i * 29 + (i >= 6 ? 14 : 0), class: 'u1l4h-t ' + cls }), t));
  txt('(the 7.2° angle is drawn to scale)', { x: 300, y: 292, class: 'u1l4h-sm' });
  const END = 13400;
  let t0 = 0, raf = 0;
  const draw = (ms) => steps.forEach((s) => s.el.classList.toggle('on', s.t <= ms));
  function frame(now) { if (!t0) t0 = now; const ms = now - t0; draw(ms); if (ms < END) raf = requestAnimationFrame(frame); }
  function play() {
    cancelAnimationFrame(raf); t0 = 0;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { draw(END); return; }
    draw(-1); raf = requestAnimationFrame(frame);
  }
  draw(-1);
  svg.addEventListener('click', play);
  const btn = svg.closest('.hist-anim') && svg.closest('.hist-anim').querySelector('.hist-play'); if (btn) btn.addEventListener('click', play);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); play(); } }, { threshold: 0.5 });
    io.observe(svg);
  } else play();
})();

/* ============ Stand Up Break! — proportions at the whiteboards ============ */
{
  const F = (a, b) => `\\dfrac{${a}}{${b}}`;
  const d1 = (v) => String(r10(v));
  const longDec = (v) => { const e = clean(v); return Math.abs(e * 100 - Math.round(e * 100)) < 1e-9 ? String(e) : e.toFixed(3) + '\\dots'; };
  standup('u1l4', {
    intro: 'Write the proportion first (same thing in the same place). Then scale or cross-multiply. Round to the nearest tenth where needed.',
    levels: {
      BEG: (r) => { // scaling with a whole-number × or ÷
        const b = r.int(3, 9), a = r.int(1, b - 1), k = r.int(2, 9), f = r.int(0, 2);
        if (f === 0) return { text: 'Solve by scaling. Write the × or ÷ you used.', q: `${F(a, b)}=${F('x', b * k)}`, a: [`${b}\\times${k}=${b * k}`, `x=${a}\\times${k}=\\boldsymbol{${a * k}}`] };
        if (f === 1) return { text: 'Solve by scaling. Write the × or ÷ you used.', q: `${F(a, b)}=${F(a * k, 'x')}`, a: [`${a}\\times${k}=${a * k}`, `x=${b}\\times${k}=\\boldsymbol{${b * k}}`] };
        return { text: 'Solve by scaling. Write the × or ÷ you used.', q: `${F(a * k, b * k)}=${F('x', b)}`, a: [`${b * k}\\div${k}=${b}`, `x=${a * k}\\div${k}=\\boldsymbol{${a}}`] };
      },
      PRG: (r) => { // cross-multiplying, x in any of the four places
        let a, b, c, d;
        do { a = r.int(2, 15); b = r.int(3, 14); d = r.int(4, 30); } while (d % b === 0 || b % d === 0 || gcd(a, b) !== 1);
        const v = (a * d) / b, pos = r.int(0, 3);
        // a/b = x/d (x top right) or rearranged so x sits elsewhere; the cross products are always b·x and a·d
        const Q = [`${F(a, b)}=${F('x', d)}`, `${F('x', d)}=${F(a, b)}`, `${F(b, a)}=${F(d, 'x')}`, `${F(d, 'x')}=${F(b, a)}`][pos];
        void c;
        return { text: 'Solve by cross-multiplying. Round to the nearest tenth where needed.', q: Q, a: [`${b}x=${a}\\times${d}=${a * d}`, Number.isInteger(clean(v * 10)) ? `x=${a * d}\\div${b}=\\boldsymbol{${clean(v)}}` : `x=${a * d}\\div${b}=${longDec(v)}`, Number.isInteger(clean(v * 10)) ? null : `x\\approx\\boldsymbol{${d1(v)}}`].filter(Boolean) };
      },
      MAS: (r) => r.pick([
        () => { const K = r.pick([4, 8, 12, 15, 20]), D = r.int(25, 95) / 10; return { text: `On a road map, 1 cm represents ${K} km. Two towns are ${D} cm apart on the map. How far apart are they really?`, q: '', a: [`\\frac{\\text{map (cm)}}{\\text{real (km)}}:\\ ${F(1, K)}=${F(D, 'x')}`, `x=${K}\\times${D}=${clean(K * D)}`], atext: `The towns are <b>${clean(K * D)} km</b> apart.` }; },
        () => { let C, A; do { C = r.pick([8, 12, 15, 18, 35]); A = r.int(40, 160); } while (A % C === 0); const n = Math.ceil(A / C); return { text: `One can of stain covers ${C} m² of fence. A fence has ${A} m² to stain. How many cans must you buy?`, q: '', a: [`${F(1, C)}=${F('x', A)}`, `${C}x=${A}`, `x=${A}\\div${C}=${longDec(A / C)}`], atext: `Round <b>up</b>: buy <b>${n} cans</b>.` }; },
        () => { const R = r.pick([25, 32, 50]), L = r.int(2, 5), ml = 1000 * L, v = ml / R; return { text: `A chainsaw needs gas and oil mixed in the ratio ${R} : 1. How many millilitres of oil go with ${L} L of gas?`, q: '', a: [`${L}\\text{ L}=${sp(ml)}\\text{ mL}`, `\\frac{\\text{gas}}{\\text{oil}}:\\ ${F(R, 1)}=${F(sp(ml), 'x')}`, `${R}x=${sp(ml)}`, `x=${sp(ml)}\\div${R}=${longDec(v)}`], atext: `Mix about <b>${d1(v)} mL</b> of oil.` }; },
        () => { let Fl, G, v; do { Fl = r.pick([1.5, 2, 2.5, 3]); G = r.int(4, 9); v = (24 * G) / Fl; } while (Number.isInteger(v)); return { text: `A cookie recipe uses ${Fl} cups of flour for 24 cookies. You have ${G} cups of flour. How many whole cookies can you make?`, q: '', a: [`${F(Fl, 24)}=${F(G, 'x')}`, `${Fl}x=24\\times${G}=${24 * G}`, `x=${24 * G}\\div${Fl}=${longDec(v)}`], atext: `Round <b>down</b>: <b>${Math.floor(v)} cookies</b>.` }; }
      ])()
    }
  });
}
