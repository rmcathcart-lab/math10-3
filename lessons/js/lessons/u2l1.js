/* Math 10-3 · Unit 2 · Lesson 1 — Time Math: Hours, Minutes and Timesheets (refresher, no outcome box).
 * Static figures: the 24-hour day ribbon (Section 3) and the count-up jumps (Section 4).
 * Explainers:
 *   clockBar  (a clock face whose shaded minutes fill a one-hour "decimal hour" bar: fraction and decimal; Example 1),
 *   convert   (the hours-and-minutes machine: whole hours pass by, minutes go through ÷ 60 or the decimal part × 60; Example 2),
 *   trap      (Full notes: 7.30 h on a double ruler of tenths and minutes is only 7 h 18 min),
 *   pieces    (clocks cut into quarters or halves: improper fraction ↔ mixed number of hours; Example 3),
 *   regroup   (an hours | minutes board: trade 60 min for 1 h, or borrow 1 h as 60 min; Example 4),
 *   clock24   (a marker on the 24-hour day ribbon with both clocks' readouts; Example 5),
 *   countUp   (count-up jumps: next hour, whole hours, minutes left, even past midnight; Examples 6 and 7),
 *   sub24     (Full notes: subtracting 24-hour times with borrowing, and the 10.15 − 8.50 trap),
 *   timesheet (a timesheet that fills row by row and totals itself; Examples 8 and 9).
 * Then the Math History animation (base 60 → a decimal French clock) and the Stand Up Break.
 * Colours: minutes/time amber, hours brand brown, answers red, the "after midnight" night blue. */
import { h, tex, add, stamp, stampIn, mountExplainers, pop, fadeIn, sleep, tween, svgEl, pulse, shake, anim, drawIn, arrowHead, COLORS } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const K = (src) => {
  try { return window.katex.renderToString('\\displaystyle ' + String(src), { throwOnError: false, strict: 'ignore', output: 'html' }); }
  catch (e) { return tex(src); }
};
const INK = COLORS.ink, RED = COLORS.red, BLUE = COLORS.blue, GRN = COLORS.green, AMB = COLORS.amber, BRN = COLORS.brand;
const FA = '#f2b84b', FA2 = '#f7d58e', FB = '#9cc0f0';
const hide = (el) => { el.style.opacity = 0; return el; };
const show = (c, el) => fadeIn(c, el, 320);
const lab = (host, x, y, html, cls = '') => { const d = h('div', 'u2l1-abs ' + cls, html); d.style.left = x + 'px'; d.style.top = y + 'px'; host.appendChild(d); return d; };
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const pad = (n) => String(n).padStart(2, '0');
/* minutes of the day → clock strings; minutes → "8 h 15 min" */
const t12 = (t) => { const H = Math.floor(t / 60) % 24, M = t % 60; return `${H % 12 || 12}:${pad(M)} ${H < 12 ? 'a.m.' : 'p.m.'}`; };
const t24 = (t) => `${pad(Math.floor(t / 60) % 24)}:${pad(t % 60)}`;
const hm = (m, zero = false) => { const H = Math.floor(m / 60), M = m % 60; if (!H) return `${M} min`; if (!M && !zero) return `${H} h`; return `${H} h ${M} min`; };
const hmT = (m, zero = false) => hm(m, zero).replace(/ h/g, '\\text{ h}').replace(/ min/g, '\\text{ min}').replace(/(\d) (\d)/g, '$1\\ $2').replace(/h} (\d)/, 'h}\\ $1');
const P = (s) => { const [t, ap] = s.split(' '); const [a, b] = t.split(':').map(Number); return (a % 12 + (ap === 'p.m.' ? 12 : 0)) * 60 + b; };   // "8:40 a.m." → 520
/* m ÷ 60 as the calculator shows it: exact (0.25) or 3–4 digits and "…" */
const div60 = (m, d = 4) => { if (m % 3 === 0) return String(m / 60); const k = Math.floor(m * 10 ** d / 60), s = String(k).padStart(d + 1, '0'); return s.slice(0, -d) + '.' + s.slice(-d) + '\\ldots'; };
const r2 = (x) => String(Math.round(x * 100) / 100);
const dot = (s) => (/\.$/.test(s.replace(/<[^>]+>/g, '')) ? s : s + '.');   // end a sentence once, even after "p.m."

/* =============================== shared drawings =============================== */
function clockFace(svg, cx, cy, R, o = {}) {
  const g = svgEl('g', {}, svg);
  svgEl('circle', { cx, cy, r: R, fill: '#fffdf8', stroke: INK, 'stroke-width': o.w || 4 }, g);
  for (let m = 0; m < 60; m++) {
    const a = m * Math.PI / 30, big = m % 5 === 0, q = m % 15 === 0, r1 = R - (q ? 16 : big ? 11 : 6);
    svgEl('line', { x1: cx + r1 * Math.sin(a), y1: cy - r1 * Math.cos(a), x2: cx + R * Math.sin(a), y2: cy - R * Math.cos(a), stroke: INK, 'stroke-width': q ? 3.5 : big ? 2.2 : 1 }, g);
  }
  return g;
}
const wedgeD = (cx, cy, R, m) => {
  if (m <= 0) return '';
  if (m >= 60) return `M${cx} ${cy - R} A${R} ${R} 0 1 1 ${cx - 0.01} ${cy - R} Z`;
  const a = m * Math.PI / 30, x = cx + R * Math.sin(a), y = cy - R * Math.cos(a);
  return `M${cx} ${cy} L${cx} ${cy - R} A${R} ${R} 0 ${m > 30 ? 1 : 0} 1 ${x} ${y} Z`;
};
/* the 24-hour day: a.m. half (blue) and p.m. half (amber) with both clocks' labels */
function dayRibbon(svg, x0, x1, y, o = {}) {
  const px = (t) => x0 + (x1 - x0) * t / 1440, bh = o.bh || 34;
  svgEl('rect', { x: x0, y, width: (x1 - x0) / 2, height: bh, fill: '#e1ebfb', rx: 6 }, svg);
  svgEl('rect', { x: (x0 + x1) / 2, y, width: (x1 - x0) / 2, height: bh, fill: '#fcebc6', rx: 6 }, svg);
  svgEl('text', { x: (3 * x0 + x1) / 4, y: y + bh / 2 + 7, class: 'u2l1-rbh' }, svg).textContent = 'a.m.  (midnight → noon)';
  svgEl('text', { x: (x0 + 3 * x1) / 4, y: y + bh / 2 + 7, class: 'u2l1-rbh' }, svg).textContent = 'p.m.  (noon → midnight)';
  for (let H = 0; H <= 24; H++) {
    const x = px(H * 60), big = H % 3 === 0;
    svgEl('line', { x1: x, x2: x, y1: y - (big ? 10 : 5), y2: y, stroke: INK, 'stroke-width': big ? 2.2 : 1.2 }, svg);
    svgEl('line', { x1: x, x2: x, y1: y + bh, y2: y + bh + (big ? 10 : 5), stroke: INK, 'stroke-width': big ? 2.2 : 1.2 }, svg);
    if (big) {
      svgEl('text', { x, y: y - 16, class: 'u2l1-rb24' }, svg).textContent = pad(H) + ':00';
      svgEl('text', { x, y: y + bh + 30, class: 'u2l1-rb12' }, svg).textContent = `${H % 12 || 12} ${H % 24 < 12 ? 'a.m.' : 'p.m.'}`;
    }
  }
  [[0, 'midnight'], [720, 'noon'], [1440, 'midnight']].forEach(([t, s]) => { svgEl('text', { x: px(t), y: y + bh + 52, class: 'u2l1-rbn' }, svg).textContent = s; });
  svgEl('text', { x: x0 - 30, y: y - 16, class: 'u2l1-rbk', 'text-anchor': 'end' }, svg).textContent = '24-h';
  svgEl('text', { x: x0 - 30, y: y + bh + 30, class: 'u2l1-rbk', 'text-anchor': 'end' }, svg).textContent = '12-h';
  return { px, y, bh };
}
function mountRibbon() {
  const host = document.getElementById('u2l1-ribbon'); if (!host) return;
  const svg = svgEl('svg', { viewBox: '0 0 960 130', role: 'img', 'aria-label': 'The day from midnight to midnight: the 24-hour clock above and the 12-hour clock below' });
  dayRibbon(svg, 100, 920, 30); host.appendChild(svg);
}

/* count-up jumps on a time line: start → next hour → last whole hour → end (midnight marked) */
function jumpPlan(s, e, x0, x1) {
  if (e <= s) e += 1440;
  const n1 = Math.ceil(s / 60) * 60, n2 = Math.floor(e / 60) * 60, first = n1 - s, mid = n2 - n1, last = e - n2;
  const wF = first ? 170 : 0, wL = last ? 170 : 0, wM = x1 - x0 - wF - wL;
  const X = [x0, x0 + wF, x1 - wL, x1];
  const night = s < 1440 && e > 1440 ? 1440 : null, xn = night ? X[1] + wM * Math.max(0.3, Math.min(0.7, (night - n1) / mid)) : null;
  return { s, e, n1, n2, first, mid, last, X, night, xn, total: e - s };
}
function jumpLine(host, plan, y, o = {}) {
  const W = o.W || 940, svg = svgEl('svg', { class: o.abs ? 'u2l1-abs' : '', width: W, height: o.H || 200, viewBox: `0 0 ${W} ${o.H || 200}` });
  if (o.abs) add(host, svg, 0, 0); else host.appendChild(svg);
  const { X } = plan;
  svgEl('line', { x1: X[0] - 20, x2: X[3] + 20, y1: y, y2: y, stroke: INK, 'stroke-width': 3 }, svg);
  const ticks = [[X[0], plan.s, true], [X[1], plan.n1, !!plan.first], [X[2], plan.n2, !!plan.last], [X[3], plan.e, true]].filter((t) => t[2]);
  const tk = ticks.map(([x, t]) => {
    const g = svgEl('g', {}, svg);
    svgEl('line', { x1: x, x2: x, y1: y - 12, y2: y + 12, stroke: INK, 'stroke-width': 3 }, g);
    svgEl('text', { x, y: y + 40, class: 'u2l1-jt' }, g).textContent = t12(t % 1440);
    return g;
  });
  let nightG = null;
  if (plan.night) {
    nightG = svgEl('g', {}, svg);
    svgEl('line', { x1: plan.xn, x2: plan.xn, y1: y - 12, y2: y + 12, stroke: '#2d3f7a', 'stroke-width': 3 }, nightG);
    svgEl('text', { x: plan.xn, y: y + 40, class: 'u2l1-jt u2l1-jn' }, nightG).textContent = 'midnight';
  }
  const arc = (xa, xb, txt, ht, color) => {
    const g = svgEl('g', {}, svg), m = (xa + xb) / 2;
    const p = svgEl('path', { d: `M${xa + 4} ${y - 14} Q${m} ${y - 14 - ht * 2} ${xb - 4} ${y - 14}`, fill: 'none', stroke: color, 'stroke-width': 3.5 }, g);
    const ah = arrowHead(g, xb - 4, y - 14, 0.5, 1, { color, width: 3.5 });
    const t = svgEl('text', { x: m, y: y - 22 - ht, class: 'u2l1-ja', fill: color }, g); t.textContent = txt;
    return { g, p, ah, t };
  };
  const arcs = {};
  if (plan.first) arcs.first = arc(X[0], X[1], hm(plan.first), 34, AMB);
  if (plan.night && o.splitNight !== false) {
    arcs.mid = [arc(X[1], plan.xn, hm(1440 - plan.n1), 40, BRN), arc(plan.xn, X[2], hm(plan.n2 - 1440), 46, '#2d3f7a')];
  } else if (plan.mid) arcs.mid = [arc(X[1], X[2], hm(plan.mid), 58, BRN)];
  if (plan.last) arcs.last = arc(X[2], X[3], hm(plan.last), 34, AMB);
  return { svg, tk, arcs, nightG };
}
function mountJumpFig() {
  const host = document.getElementById('u2l1-jumpfig'); if (!host) return;
  jumpLine(host, jumpPlan(P('8:40 a.m.'), P('1:25 p.m.'), 80, 860), 120, { W: 940, H: 175 });
}

/* =============================== explainer: clock → decimal-hour bar =============================== */
const EX1 = [15, 30, 45, 20, 40, 10, 6, 12];
const clockBar = {
  title: 'Minutes as part of an hour',
  height: 320,
  minW: 940,
  capH: 92,
  choices: [{ sep: 'Example 1 check:' }].concat(EX1.map((m) => ({ v: m, label: m + ' min' }))),
  custom: [1, 59],
  ask: (m) => `${EX1.includes(m) ? 'Example 1: write' : 'Write'} <b>${m} min</b> as a fraction of an hour (simplest form) and in decimal hours (round to 2 places).`,
  make(stage, m) {
    const svg = svgEl('svg', { class: 'u2l1-abs', width: 940, height: 320 }); add(stage, svg, 0, 0);
    const cx = 140, cy = 150, R = 118;
    const wedge = svgEl('path', { d: '', fill: FA }, svg);
    clockFace(svg, cx, cy, R);
    [['0', 0], ['15', 15], ['30', 30], ['45', 45]].forEach(([s, mm]) => { const a = mm * Math.PI / 30, r = R - 32; svgEl('text', { x: cx + r * Math.sin(a), y: cy - r * Math.cos(a) + 7, class: 'u2l1-cn' }, svg).textContent = s; });
    const hand = svgEl('line', { x1: cx, y1: cy, x2: cx, y2: cy - R + 8, stroke: RED, 'stroke-width': 5, 'stroke-linecap': 'round' }, svg);
    svgEl('circle', { cx, cy, r: 7, fill: INK }, svg);
    const cnt = lab(stage, cx, 296, '<b>0</b> min', 'u2l1-count u2l1-mid');
    // the one-hour bar
    const bx0 = 320, bx1 = 910, by = 62, bh = 46, bpx = (mm) => bx0 + (bx1 - bx0) * mm / 60;
    svgEl('rect', { x: bx0, y: by, width: bx1 - bx0, height: bh, fill: '#fffdf8', stroke: INK, 'stroke-width': 2.5, rx: 4 }, svg);
    const bar = svgEl('rect', { x: bx0, y: by, width: 0, height: bh, fill: FA }, svg);
    for (let k = 0; k <= 12; k++) { const x = bpx(5 * k), q = k % 3 === 0; svgEl('line', { x1: x, x2: x, y1: by - (q ? 10 : 5), y2: by + (q ? bh : 12), stroke: INK, 'stroke-width': q ? 2.2 : 1.2, opacity: q ? 1 : .7 }, svg); }
    [0, 15, 30, 45, 60].forEach((mm) => { svgEl('text', { x: bpx(mm), y: by - 16, class: 'u2l1-bt' }, svg).textContent = mm + ' min'; });
    [['0 h', 0], ['0.25 h', 15], ['0.5 h', 30], ['0.75 h', 45], ['1 h', 60]].forEach(([s, mm]) => { svgEl('text', { x: bpx(mm), y: by + bh + 26, class: 'u2l1-bt u2l1-bh' }, svg).textContent = s; });
    svgEl('rect', { x: bx0, y: by, width: bx1 - bx0, height: bh, fill: 'none', stroke: INK, 'stroke-width': 2.5, rx: 4 }, svg);
    const tag = hide(lab(stage, bpx(m), by + bh / 2, `<b>${m}</b> of 60`, 'u2l1-btag u2l1-mid'));
    // the two answer tiles
    const g = gcd(m, 60), a = m / g, b = 60 / g, exact = m % 3 === 0, dv = r2(m / 60);
    const tile = (x, key) => { const d = lab(stage, x, 170, `<span class="k">${key}</span><span class="v"></span>`, 'u2l1-tile'); d.style.width = '280px'; return d.querySelector('.v'); };
    const vF = tile(320, 'Fraction of an hour'), vD = tile(630, 'Decimal hours');
    vF.innerHTML = K(g > 1 ? `\\frac{${m}}{60}=\\frac{${a}}{${b}}` : `\\frac{${m}}{60}`); vD.innerHTML = K(`${m}\\div60${exact ? '=' : '='}${div60(m, 3)}${exact ? '' : '\\approx' + dv}`);
    hide(vF); hide(vD);
    const setM = (mm) => { wedge.setAttribute('d', wedgeD(cx, cy, R - 2, mm)); const an = mm * Math.PI / 30; hand.setAttribute('x2', cx + (R - 8) * Math.sin(an)); hand.setAttribute('y2', cy - (R - 8) * Math.cos(an)); cnt.innerHTML = `<b>${Math.round(mm)}</b> min`; };
    const q = { 15: 'one quarter', 30: 'one half', 45: 'three quarters' }[m];
    return [
      { cap: `Shade <b>${m} min</b> on the clock. One full turn is <b>60 min</b>, or 1 hour.`, run: (c) => tween(c, 1300, (t) => setM(m * t)) },
      { cap: `The bar is <b>one hour</b> long. Fill the same part of it: <b>${m} out of 60</b> minutes.`,
        run: async (c) => { await tween(c, 1100, (t) => bar.setAttribute('width', (bpx(m) - bx0) * t)); await show(c, tag); } },
      { cap: g > 1 ? `As a fraction: ${T(`\\frac{${m}}{60}`)}. Divide the top and bottom by ${g}: ${T(`\\frac{${m}}{60}=\\frac{${a}}{${b}}`)}${q ? ` (${q} of an hour)` : ''}.` : `As a fraction: ${T(`\\frac{${m}}{60}`)}. It does not simplify.`,
        run: (c) => pop(c, vF) },
      { cap: exact ? `As a decimal: ${T(`${m}\\div60=${dv}`)}. So ${m} min = <b>${dv} h</b>.` : `As a decimal: ${T(`${m}\\div60=${div60(m, 3)}`)}. Round to 2 places: <b>${dv} h</b>.`,
        run: (c) => pop(c, vD) }
    ];
  }
};

/* =============================== explainer: the hours-and-minutes machine =============================== */
const CV = {
  ai: { lab: '(i) 3 h 15 min', H: 3, m: 15 }, aii: { lab: '(ii) 5 h 50 min', H: 5, m: 50 }, aiii: { lab: '(iii) 8 h 36 min', H: 8, m: 36 }, aiv: { lab: '(iv) 95 min', H: 0, m: 95 },
  bi: { lab: '(i) 6.5 h', d: '6.5' }, bii: { lab: '(ii) 4.75 h', d: '4.75' }, biii: { lab: '(iii) 2.4 h', d: '2.4' }, biv: { lab: '(iv) 1.35 h', d: '1.35' }
};
const convert = {
  title: 'The hours-and-minutes machine',
  height: 290,
  minW: 940,
  capH: 92,
  choices: [{ sep: 'Example 2(a) check:' }, 'ai', 'aii', 'aiii', 'aiv', { sep: '(b):' }, 'bi', 'bii', 'biii', 'biv'].map((k) => (typeof k === 'string' ? { v: k, label: CV[k].lab } : k)),
  ask: (k) => (k[0] === 'a' ? `Example 2(a): change <b>${CV[k].lab.replace(/^\(\w+\) /, '')}</b> to decimal hours. Round to 2 decimal places if needed.` : `Example 2(b): change <b>${CV[k].d} h</b> to hours and minutes.`),
  make(stage, k) {
    const D = CV[k], toDec = k[0] === 'a';
    const svg = svgEl('svg', { class: 'u2l1-abs', width: 940, height: 290 }); add(stage, svg, 0, 0);
    // lanes and the machine
    svgEl('path', { d: 'M40 70 H700', stroke: '#d9cfbd', 'stroke-width': 3, 'stroke-dasharray': '8 8', fill: 'none' }, svg);
    svgEl('path', { d: 'M40 200 H700', stroke: '#d9cfbd', 'stroke-width': 3, 'stroke-dasharray': '8 8', fill: 'none' }, svg);
    lab(stage, 40, 36, 'whole hours: no change', 'u2l1-lane');
    lab(stage, 40, 236, toDec ? 'minutes → part of an hour' : 'decimal part → minutes', 'u2l1-lane');
    const mach = add(stage, h('div', 'u2l1-abs u2l1-mach', `<div class="nm">MACHINE</div><div class="op">${toDec ? '÷ 60' : '× 60'}</div>`), 360, 150);
    const gear = svgEl('svg', { class: 'u2l1-abs u2l1-gear', width: 30, height: 30, viewBox: '-20 -20 40 40' }); add(mach, gear, 134, 6);
    const gg = svgEl('g', {}, gear); for (let i = 0; i < 8; i++) svgEl('rect', { x: -3.5, y: -18, width: 7, height: 9, rx: 1.5, fill: '#e0a11b', transform: `rotate(${i * 45})` }, gg); svgEl('circle', { r: 11, fill: '#e0a11b' }, gg); svgEl('circle', { r: 4, fill: '#2c3442' }, gg);
    const spin = (c) => tween(c, 900, (t) => gg.setAttribute('transform', `rotate(${t * 270})`), (t) => t);
    const tok = (x, y, html, cls) => add(stage, h('div', 'u2l1-abs u2l1-tok ' + cls, html), x, y);
    const move = (c, el, x, y, ms = 700) => anim(c, el, [{ left: el.style.left, top: el.style.top }, { left: x + 'px', top: y + 'px' }], ms);
    const out = hide(add(stage, h('div', 'u2l1-abs u2l1-out'), 548, 104));
    const merge = async (c, a, b) => { await Promise.all([move(c, a, 650, 92), move(c, b, 650, 120)]); a.style.opacity = 0; b.style.opacity = 0; };
    if (toDec) {
      const { H, m } = D, dv = r2(H + m / 60), exact = m % 3 === 0, q = div60(m, 4), sum = H ? (exact ? String(H + m / 60) : `${String(Math.floor((H + m / 60) * 10000)).replace(/(\d{4})$/, '.$1')}\\ldots`) : q;
      const tH = H ? tok(60, 112, `${H} h`, 'h') : null, tM = tok(H ? 70 + tH.offsetWidth : 60, 112, `${m} min`, 'm'), tR = hide(tok(560, 178, K(q), 'r'));
      const steps = [];
      if (H) steps.push({ cap: `Split it. The <b>${H} h</b> are already whole hours. Only the <b>${m} min</b> need changing.`, run: async (c) => { await Promise.all([move(c, tH, 200, 48), move(c, tM, 200, 178)]); } });
      else steps.push({ cap: `There are no whole hours written: all <b>${m} min</b> go into the machine. (${m} min is more than an hour, so expect more than 1 h.)`, run: (c) => move(c, tM, 200, 178) });
      steps.push({ cap: `Minutes ÷ 60: ${T(`${m}\\div60=${q}`)}`,
        run: async (c) => { await move(c, tM, 380, 178, 600); tM.style.opacity = 0; await Promise.all([spin(c), shake(c, mach)]); await show(c, tR); } });
      if (H) steps.push({ cap: `Add the whole hours back: ${T(`${H}+${q}=${sum}`)} h`,
        run: async (c) => { await merge(c, tH, tR); out.innerHTML = K(`${H}+${q}=${sum}\\text{ h}`); await show(c, out); } });
      steps.push({ cap: exact ? `No rounding needed: ${hm(H * 60 + m)} = <b>${dv} h</b>.` : `Round to 2 decimal places: <b>about ${dv} h</b>.${H ? '' : ' (Check: 95 min = 60 min + 35 min = 1 h 35 min.)'}`,
        run: async (c) => { if (!H) { tR.style.opacity = 0; } out.innerHTML = K(`${H ? hmT(H * 60 + m) : m + '\\text{ min}'}${exact ? '=' : '\\approx'}\\mathbf{${dv}}\\text{ h}`); out.classList.add('fin'); await pop(c, out); } });
      return steps;
    }
    const d = D.d, [W0, F0] = d.split('.'), fr = '0.' + F0, mins = Math.round(Number(fr) * 60);
    const tW = tok(60, 112, W0, 'h'), tF = tok(64 + tW.offsetWidth, 112, '.' + F0, 'm'), tU = tok(68 + tW.offsetWidth + tF.offsetWidth, 112, 'h', 'u'), tR = hide(tok(560, 178, `${mins} min`, 'r'));
    return [
      { cap: `Split it. The <b>${W0}</b> before the point is <b>${W0} whole hour${W0 === '1' ? '' : 's'}</b>. The <b>.${F0}</b> is part of an hour.`,
        run: async (c) => { tU.style.opacity = 0; await Promise.all([move(c, tW, 200, 48), move(c, tF, 200, 178)]); tW.innerHTML = `${W0} h`; tF.innerHTML = fr; } },
      { cap: `Only the decimal part × 60: ${T(`${fr}\\times60=${mins}`)} min.`,
        run: async (c) => { await move(c, tF, 380, 178, 600); tF.style.opacity = 0; await Promise.all([spin(c), shake(c, mach)]); await show(c, tR); } },
      { cap: `Put them together: ${d} h = <b>${W0} h ${mins} min</b>. Check: ${T(`${mins}\\div60=${fr}`)} ✓`,
        run: async (c) => { await merge(c, tW, tR); out.innerHTML = K(`${d}\\text{ h}=\\mathbf{${W0}\\text{ h}\\ ${mins}\\text{ min}}`); out.classList.add('fin'); await show(c, out); } }
    ];
  }
};

/* =============================== explainer (Full notes): 7.30 h is not 7 h 30 min =============================== */
const trap = {
  title: 'Tenths of an hour are not minutes',
  height: 270,
  minW: 940,
  choices: [{ v: '30', label: '7.30 h' }, { v: '45', label: '7.45 h' }],
  ask: (k) => `Is <b>7.${k} h</b> the same as <b>7 h ${k} min</b>?`,
  make(stage, k) {
    const svg = svgEl('svg', { class: 'u2l1-abs', width: 940, height: 270 }); add(stage, svg, 0, 0);
    const x0 = 90, x1 = 870, y = 130, px = (f) => x0 + (x1 - x0) * f;
    svgEl('line', { x1: x0, x2: x1, y1: y, y2: y, stroke: INK, 'stroke-width': 4 }, svg);
    const top = svgEl('g', { opacity: 0 }, svg), bot = svgEl('g', { opacity: 0 }, svg);
    for (let i = 0; i <= 10; i++) { const x = px(i / 10); svgEl('line', { x1: x, x2: x, y1: y - 16, y2: y, stroke: BRN, 'stroke-width': 2.5 }, top); svgEl('text', { x, y: y - 26, class: 'u2l1-tt' }, top).textContent = i === 10 ? '8.0' : '7.' + i; }
    for (let i = 0; i <= 10; i++) { const x = px(i / 10); svgEl('line', { x1: x, x2: x, y1: y, y2: y + 16, stroke: AMB, 'stroke-width': 2.5 }, bot); svgEl('text', { x, y: y + 42, class: 'u2l1-tb' }, bot).textContent = 6 * i; }
    svgEl('text', { x: x0 - 20, y: y - 26, class: 'u2l1-tk', 'text-anchor': 'end' }, top).textContent = 'hours';
    svgEl('text', { x: x0 - 20, y: y + 42, class: 'u2l1-tk', 'text-anchor': 'end' }, bot).textContent = 'min';
    const f1 = Number('0.' + k), m1 = Math.round(f1 * 60), f2 = Number(k) / 60, d2 = r2(7 + f2);
    const pinA = svgEl('g', { opacity: 0 }, svg); svgEl('path', { d: 'M0 0 L-11 -24 A13 13 0 1 1 11 -24 Z', fill: RED }, pinA);
    const pinB = svgEl('g', { opacity: 0 }, svg); svgEl('path', { d: 'M0 0 L-11 -24 A13 13 0 1 1 11 -24 Z', fill: GRN }, pinB);
    const drop = svgEl('line', { x1: px(f1), x2: px(f1), y1: y - 48, y2: y + 60, stroke: RED, 'stroke-width': 2.5, 'stroke-dasharray': '6 5', opacity: 0 }, svg);
    const la = hide(lab(stage, px(f1), 26, `7.${k} h`, 'u2l1-pl u2l1-mid u2l1-red'));
    const lm = hide(lab(stage, px(f1), 214, `only <b>${m1} min</b>`, 'u2l1-pl u2l1-mid u2l1-red'));
    const lb = hide(lab(stage, px(f2), 250, `7 h ${k} min = ${d2} h`, 'u2l1-pl u2l1-mid u2l1-grn'));
    const st = stamp(stage, 'not the same!', { ok: false, x: 790, y: 34, size: 'sm' }); hide(st);
    const place = (g, f, dy) => g.setAttribute('transform', `translate(${px(f)} ${y + dy})`);
    place(pinA, 0, -48); place(pinB, f2, -48);
    return [
      { cap: `From 7 h to 8 h is one hour. <b>Above:</b> tenths of an hour. <b>Below:</b> minutes. Each tenth is <b>6 min</b>.`,
        run: async (c) => { await anim(c, top, [{ opacity: 0 }, { opacity: 1 }], 400); await anim(c, bot, [{ opacity: 0 }, { opacity: 1 }], 400); } },
      { cap: `7.${k} h is ${k === '30' ? '3 tenths' : '4 and a half tenths'} of the way from 7 to 8.`,
        run: async (c) => { pinA.setAttribute('opacity', 1); await tween(c, 1000, (t) => place(pinA, f1 * t, -48)); await show(c, la); } },
      { cap: `Look below: that is only <b>${m1} min</b>, because ${T(`0.${k}\\times60=${m1}`)}. So 7.${k} h = 7 h ${m1} min.`,
        run: async (c) => { await anim(c, drop, [{ opacity: 0 }, { opacity: 1 }], 300); await show(c, lm); } },
      { cap: `7 h ${k} min is further along: ${T(`${k}\\div60=${r2(f2)}`)}, so it is <b>${d2} h</b>.`,
        run: async (c) => { pinB.setAttribute('opacity', 1); await pop(c, pinB); await show(c, lb); await stampIn(c, st); } }
    ];
  }
};

/* =============================== explainer: clocks cut into pieces (mixed numbers) =============================== */
const PC = { n94: { n: 9, d: 4 }, b: { n: 11, d: 4, hm: true }, c: { n: 7, d: 2, halves: true } };
const pieces = {
  title: 'Clocks cut into pieces',
  height: 330,
  minW: 940,
  capH: 92,
  choices: [{ v: 'n94', label: `Notes: ${T('\\tfrac94')} h` }, { sep: 'Example 3 check:' }, { v: 'b', label: `(b) ${T('\\tfrac{11}{4}')} h` }, { v: 'c', label: `(c) half-hour lessons in ${T('3\\tfrac12')} h` }],
  ask: (k) => ({ n94: `Write ${T('\\tfrac94')} h as a mixed number.`, b: `Example 3(b): a repair took ${T('\\tfrac{11}{4}')} h. Write this as a mixed number, and in hours and minutes.`, c: `Example 3(c): each swimming lesson is half an hour long. How many lessons fit in ${T('3\\tfrac12')} h?` }[k]),
  make(stage, k) {
    const D = PC[k], { n, d } = D, q = Math.floor(n / d), r = n % d, nc = Math.ceil(n / d), R = 72, cy = 120;
    const svg = svgEl('svg', { class: 'u2l1-abs', width: 940, height: 330 }); add(stage, svg, 0, 0);
    const cxs = Array.from({ length: nc }, (_, i) => 470 + (i - (nc - 1) / 2) * 200);
    const segs = [], nums = [], divs = svgEl('g', { opacity: 0 }, svg), faces = [];
    cxs.forEach((cx) => {
      faces.push(svgEl('circle', { cx, cy, r: R, fill: '#fffdf8', stroke: INK, 'stroke-width': 4 }, svg));
      for (let j = 0; j < d; j++) {
        const a0 = j / d * 2 * Math.PI, a1 = (j + 1) / d * 2 * Math.PI, p = (a) => `${cx + R * Math.sin(a)} ${cy - R * Math.cos(a)}`;
        segs.push(svgEl('path', { d: `M${cx} ${cy} L${p(a0)} A${R} ${R} 0 0 1 ${p(a1)} Z`, fill: 'none' }, svg));
        const am = (j + 0.5) / d * 2 * Math.PI; nums.push([cx + R * 0.55 * Math.sin(am), cy - R * 0.55 * Math.cos(am)]);
        svgEl('line', { x1: cx, y1: cy, x2: cx + R * Math.sin(a0), y2: cy - R * Math.cos(a0), stroke: INK, 'stroke-width': 2.5 }, divs);
      }
    });
    cxs.forEach((cx) => svgEl('circle', { cx, cy, r: R, fill: 'none', stroke: INK, 'stroke-width': 4 }, svg));
    const numEls = nums.slice(0, n).map(([x, y], i) => hide(lab(stage, x, y, String(i + 1), 'u2l1-pn u2l1-mid')));
    const hl = cxs.map((cx, i) => hide(lab(stage, cx, cy + R + 26, i < q ? '1 h' : r ? `${T(`\\tfrac{${r / gcd(r, d)}}{${d / gcd(r, d)}}`)} h` : '', 'u2l1-hl u2l1-mid')));
    const eq = hide(lab(stage, 470, 292, '', 'u2l1-eq u2l1-mid'));
    const fill = (c, ms) => tween(c, ms, (t) => { const m = Math.round(n * t); segs.forEach((s, i) => s.setAttribute('fill', i < m ? (D.halves ? FB : FA) : 'none')); }, (t) => t);
    const unit = d === 4 ? 'quarters' : 'halves';
    if (D.halves) {
      return [
        { cap: `Each clock is <b>1 hour</b>. A lesson is <b>half an hour</b>, so cut each clock in <b>half</b>.`, run: (c) => anim(c, divs, [{ opacity: 0 }, { opacity: 1 }], 500) },
        { cap: `${T('3\\tfrac12')} h is 3 whole clocks and half of one more.`, run: async (c) => { await fill(c, 1400); for (const e of hl) await show(c, e); } },
        { cap: `Count the halves: ${T('3\\times2+1=7')}. So ${T('3\\tfrac12=\\tfrac{3\\times2+1}{2}=\\tfrac72')}.`,
          run: async (c) => { for (const e of numEls) await pop(c, e, 220); eq.innerHTML = K('3\\tfrac12=\\frac{3\\times2+1}{2}=\\frac72'); await show(c, eq); } },
        { cap: `${T('\\tfrac72')} means <b>7 halves</b> of an hour. Each half is one lesson, so <b>7 lessons</b> fit.`,
          run: async (c) => { eq.innerHTML = K('3\\tfrac12=\\frac72\\ \\rightarrow\\ \\mathbf{7}\\textbf{ lessons}'); await pulse(c, eq, 1.08); } }
      ];
    }
    const steps = [
      { cap: `Each clock is <b>1 hour</b>. Cut each one into <b>${d} equal parts</b>: ${unit} of an hour.`, run: (c) => anim(c, divs, [{ opacity: 0 }, { opacity: 1 }], 500) },
      { cap: `${T(`\\tfrac{${n}}{${d}}`)} h means <b>${n} ${unit}</b>. Fill them one at a time.`,
        run: async (c) => { await fill(c, 1800); for (const e of numEls) e.style.opacity = 1; } },
      { cap: `<b>${q}</b> full clocks and <b>${r}</b> ${r === 1 ? 'quarter' : unit} left over: ${T(`${n}\\div${d}=${q}`)} remainder ${r}.`,
        run: async (c) => { for (const e of hl) await show(c, e); } },
      { cap: `So ${T(`\\tfrac{${n}}{${d}}=${q}\\tfrac{${r}}{${d}}`)} h.`, run: async (c) => { eq.innerHTML = K(`\\frac{${n}}{${d}}=${q}\\tfrac{${r}}{${d}}\\text{ h}`); await show(c, eq); } }
    ];
    if (D.hm) steps.push({ cap: `${T('\\tfrac34')} h is 45 min, so the repair took <b>2 h 45 min</b>.`,
      run: async (c) => { eq.innerHTML = K(`\\frac{11}{4}=2\\tfrac34\\text{ h}=\\mathbf{2\\text{ h}\\ 45\\text{ min}}`); await pulse(c, eq, 1.08); } });
    return steps;
  }
};

/* =============================== explainer: the hours | minutes board =============================== */
const RG = {
  n: { lab: 'Notes: 7 h 45 min + 6 h 30 min', ask: 'Add: 7 h 45 min + 6 h 30 min', ops: [['add', [[7, 45], [6, 30]]]] },
  a: { lab: '(a)', ask: 'Example 4(a): 4 h 25 min + 3 h 50 min', ops: [['add', [[4, 25], [3, 50]]]] },
  b: { lab: '(b)', ask: 'Example 4(b): 2 h 40 min + 1 h 35 min + 3 h 55 min', ops: [['add', [[2, 40], [1, 35], [3, 55]]]] },
  c: { lab: '(c)', ask: 'Example 4(c): 9 h 15 min − 3 h 40 min', ops: [['sub', [[9, 15], [3, 40]]]] },
  d: { lab: '(d) Rosa', ask: 'Example 4(d): Rosa may drive at most 11 h. She has driven 4 h 35 min and 3 h 50 min. How much longer can she drive?', ops: [['add', [[4, 35], [3, 50]]], ['sub', [[11, 0], [8, 25]]]] }
};
const regroup = {
  title: 'Regroup at 60',
  height: 340,
  minW: 940,
  capH: 92,
  choices: [{ v: 'n', label: RG.n.lab }, { sep: 'Example 4 check:' }, 'a', 'b', 'c', 'd'].map((k) => (typeof k === 'string' ? { v: k, label: RG[k].lab } : k)),
  ask: (k) => RG[k].ask,
  make(stage, k) {
    const D = RG[k], XH = 250, XM = 410, X0 = 80, RH = 54;
    const layer = add(stage, h('div', 'u2l1-abs'), 0, 0);
    lab(stage, XH, 10, 'hours', 'u2l1-colh u2l1-mid'); lab(stage, XM, 10, 'minutes', 'u2l1-colh u2l1-mid');
    const barX = 560, barW = 360, U = barW / 140;   // px per minute (140 min fits)
    let B = null;
    const build = (op, rows) => {
      layer.innerHTML = '';
      const cells = rows.map(([H, M], i) => {
        const y = 52 + i * RH;
        const sg = lab(layer, X0, y, i === rows.length - 1 ? (op === 'add' ? '+' : '−') : '', 'u2l1-op u2l1-ml');
        const ch = lab(layer, XH, y, `<span class="o">${H}</span> h`, 'u2l1-cell u2l1-mid'), cm = lab(layer, XM, y, `<span class="o">${M}</span> min`, 'u2l1-cell u2l1-mid');
        [sg, ch, cm].forEach(hide); return { sg, ch, cm, H, M };
      });
      const ly = 52 + rows.length * RH - 24;
      const line = hide(add(layer, h('div', 'u2l1-abs u2l1-rule'), X0, ly)); line.style.width = (XM + 90 - X0) + 'px';
      const sh = hide(lab(layer, XH, ly + 30, '', 'u2l1-cell u2l1-mid u2l1-sum')), sm = hide(lab(layer, XM, ly + 30, '', 'u2l1-cell u2l1-mid u2l1-sum'));
      const fh = hide(lab(layer, XH, ly + 30 + RH, '', 'u2l1-cell u2l1-mid u2l1-fin')), fm = hide(lab(layer, XM, ly + 30 + RH, '', 'u2l1-cell u2l1-mid u2l1-fin'));
      const eqs = hide(lab(layer, X0, ly + 30 + RH, '=', 'u2l1-op u2l1-ml'));
      B = { cells, line, sh, sm, fh, fm, eqs, ly };
      return B;
    };
    const showRows = async (c) => { for (const r of B.cells) { await Promise.all([show(c, r.sg), show(c, r.ch), show(c, r.cm)]); } await show(c, B.line); };
    /* the minute bar on the right: full 60-min blocks (brown) and the rest (amber) */
    const barBox = add(stage, h('div', 'u2l1-abs u2l1-mbar'), barX, 150); hide(barBox);
    const drawBar = (M) => {
      barBox.innerHTML = '';
      const full = Math.floor(M / 60);
      for (let i = 0; i < full; i++) { const b = h('div', 'blk full', '60 min'); b.style.width = 60 * U + 'px'; barBox.appendChild(b); }
      if (M % 60) { const b = h('div', 'blk rest', (M % 60) + ''); b.style.width = (M % 60) * U + 'px'; barBox.appendChild(b); }
      return [...barBox.querySelectorAll('.full')];
    };
    const steps = [];
    D.ops.forEach(([op, rows], pi) => {
      if (pi > 0) steps.push({ cap: `Now find what is left: <b>11 h − 8 h 25 min</b>. Write 11 h as <b>11 h 0 min</b>.`, run: async (c) => { barBox.style.opacity = 0; build(op, rows); await showRows(c); } });
      else steps.push({ cap: `Line up <b>hours</b> under hours and <b>minutes</b> under minutes.`, run: async (c) => { build(op, rows); await showRows(c); } });
      if (op === 'add') {
        const Hs = rows.map((r) => r[0]), Ms = rows.map((r) => r[1]), H = Hs.reduce((a, b) => a + b), M = Ms.reduce((a, b) => a + b), kk = Math.floor(M / 60);
        steps.push({ cap: `Add the hours: ${Hs.join(' + ')} = <b>${H} h</b>. Add the minutes: ${Ms.join(' + ')} = <b>${M} min</b>.`,
          run: async (c) => { B.sh.innerHTML = `${H} h`; B.sm.innerHTML = `<span class="${M >= 60 ? 'u2l1-red' : ''}">${M}</span> min`; await Promise.all([show(c, B.sh), show(c, B.sm)]); } });
        if (kk) steps.push({ cap: `${M} min is more than 60. Trade <b>${60 * kk} min for ${kk} h</b>: ${M} min = ${kk} h ${M - 60 * kk} min. So ${H} h ${M} min = <b>${H + kk} h ${M - 60 * kk} min</b>.`,
          run: async (c) => {
            const blocks = drawBar(M); await show(c, barBox);
            for (const b of blocks) { b.textContent = '1 h'; b.classList.add('lit'); await pulse(c, b, 1.12); }
            B.fh.innerHTML = `${H + kk} h`; B.fm.innerHTML = `${M - 60 * kk} min`; await show(c, B.eqs); await Promise.all([show(c, B.fh), show(c, B.fm)]);
          } });
        steps.push({ cap: pi === 0 && D.ops.length > 1 ? `So far Rosa has driven <b>${hm(60 * H + M)}</b>.` : `Answer: <b>${hm(60 * H + M)}</b>.`,
          run: async (c) => { const t = kk ? [B.fh, B.fm] : [B.sh, B.sm]; t.forEach((e) => e.classList.add('u2l1-ans')); await Promise.all(t.map((e) => pulse(c, e, 1.15))); } });
      } else {
        const [[H1, M1], [H2, M2]] = rows, bor = M1 < M2, h1 = bor ? H1 - 1 : H1, m1 = bor ? M1 + 60 : M1, rh = h1 - H2, rm = m1 - M2;
        if (bor) {
          steps.push({ cap: `${M1} min − ${M2} min? There are <b>not enough minutes</b> on top.`, run: async (c) => { await shake(c, B.cells[0].cm); B.cells[0].cm.classList.add('u2l1-warn'); } });
          steps.push({ cap: `Borrow <b>1 h = 60 min</b> from the ${H1} h: ${H1} h ${M1} min = <b>${h1} h ${m1} min</b>.`,
            run: async (c) => {
              const top = B.cells[0];
              const chip = lab(layer, XH, 52, '1 h', 'u2l1-chip u2l1-mid'); await pop(c, chip);
              await anim(c, chip, [{ left: XH + 'px' }, { left: XM + 'px' }], 700); chip.innerHTML = '60 min'; await pulse(c, chip, 1.1); chip.style.opacity = 0;
              top.ch.innerHTML = `<s>${H1}</s> <b class="u2l1-red">${h1}</b> h`; top.cm.innerHTML = `<s>${M1}</s> <b class="u2l1-red">${m1}</b> min`; top.cm.classList.remove('u2l1-warn');
              await Promise.all([pop(c, top.ch), pop(c, top.cm)]);
            } });
        }
        steps.push({ cap: `Subtract: ${h1} − ${H2} = <b>${rh} h</b> and ${m1} − ${M2} = <b>${rm} min</b>.`,
          run: async (c) => { B.sh.innerHTML = `${rh} h`; B.sm.innerHTML = `${rm} min`; await Promise.all([show(c, B.sh), show(c, B.sm)]); } });
        steps.push({ cap: k === 'd' ? `<b>Rosa can drive ${hm(60 * rh + rm)} more today.</b>` : `Answer: <b>${hm(60 * rh + rm)}</b>. Check: ${hm(60 * rh + rm)} + ${hm(60 * H2 + M2)} = ${hm(60 * H1 + M1)} ✓`,
          run: async (c) => { [B.sh, B.sm].forEach((e) => e.classList.add('u2l1-ans')); await Promise.all([pulse(c, B.sh, 1.15), pulse(c, B.sm, 1.15)]); } });
      }
    });
    return steps;
  }
};

/* =============================== explainer: the 24-hour day =============================== */
const C24 = [['a', '6:15 a.m.'], ['b', '3:40 p.m.'], ['c', '12:20 a.m.'], ['d', '12:05 p.m.'], ['e', '11:55 p.m.'], ['f', '17:10'], ['g', '00:45']];
const clock24 = {
  title: 'The 12-hour and 24-hour clock',
  height: 320,
  minW: 940,
  capH: 92,
  choices: [{ sep: 'Example 5 check:' }].concat(C24.map(([v, s]) => ({ v, label: s }))),
  ask: (k) => { const s = C24.find((x) => x[0] === k)[1]; return /m\.$/.test(s) ? `Example 5: write <b>${s}</b> on the 24-hour clock.` : `Example 5: write <b>${s}</b> on the 12-hour clock.`; },
  make(stage, k) {
    const s = C24.find((x) => x[0] === k)[1], from12 = /m\.$/.test(s);
    const t = from12 ? P(s) : (() => { const [a, b] = s.split(':').map(Number); return a * 60 + b; })();
    const H = Math.floor(t / 60), H12 = H % 12 || 12, pm = H >= 12;
    const svg = svgEl('svg', { class: 'u2l1-abs', width: 940, height: 320 }); add(stage, svg, 0, 0);
    const Rb = dayRibbon(svg, 110, 900, 50, { bh: 36 });
    const pin = svgEl('g', { opacity: 0 }, svg);
    svgEl('line', { x1: 0, x2: 0, y1: -12, y2: 48, stroke: RED, 'stroke-width': 4 }, pin);
    svgEl('path', { d: 'M0 -10 L-10 -28 A12 12 0 1 1 10 -28 Z', fill: RED }, pin);
    const placePin = (tt) => pin.setAttribute('transform', `translate(${Rb.px(tt)} ${Rb.y})`);
    placePin(0);
    const box12 = lab(stage, 120, 200, `<span class="k">12-hour clock</span><span class="v"></span>`, 'u2l1-rd'), box24 = lab(stage, 600, 200, `<span class="k">24-hour clock</span><span class="v lcd"></span>`, 'u2l1-rd');
    const v12 = box12.querySelector('.v'), v24 = box24.querySelector('.v');
    v12.textContent = t12(t); v24.textContent = t24(t);
    hide(from12 ? v24 : v12);
    const rule = hide(lab(stage, 470, 244, '', 'u2l1-rule2 u2l1-mid'));
    let where, rtxt, rcap;
    if (from12) {
      if (H12 === 12 && !pm) { where = `${s} is <b>${t % 60} min after midnight</b>.`; rtxt = '12 a.m. → 00'; rcap = `The hour just after midnight is <b>00</b> on the 24-hour clock.`; }
      else if (H12 === 12) { where = `${s} is <b>${t % 60} min after noon</b>.`; rtxt = '12 p.m. → 12'; rcap = `The hour just after noon stays <b>12</b>.`; }
      else if (pm) { where = `${s} is in the <b>p.m.</b> half: after noon.`; rtxt = `p.m.: ${H12} + 12 = ${H}`; rcap = `p.m.: <b>add 12</b> to the hour: ${T(`${H12}+12=${H}`)}.`; }
      else { where = `${s} is in the <b>a.m.</b> half: before noon.`; rtxt = `a.m.: ${H12} → ${pad(H)}`; rcap = `a.m.: keep the hour and write <b>2 digits</b>: ${pad(H)}.`; }
    } else {
      if (H === 0) { where = `${s}: hour <b>00</b> is the hour just after midnight.`; rtxt = '00 → 12 a.m.'; rcap = `Hour 00: write <b>12</b>, and it is <b>a.m.</b>`; }
      else if (H > 12) { where = `${s}: hour <b>${H}</b> is past noon, in the <b>p.m.</b> half.`; rtxt = `${H} − 12 = ${H12}, p.m.`; rcap = `Hours 13 to 23: <b>subtract 12</b>: ${T(`${H}-12=${H12}`)}, and it is <b>p.m.</b>`; }
      else if (H === 12) { where = `${s} is just after noon.`; rtxt = '12 → 12 p.m.'; rcap = `Hour 12 is <b>p.m.</b>`; }
      else { where = `${s} is before noon.`; rtxt = `${pad(H)} → ${H} a.m.`; rcap = `Hours 01 to 11 are <b>a.m.</b>`; }
    }
    rule.textContent = rtxt;
    const goal = from12 ? v24 : v12;
    return [
      { cap: `Find it on the day. ${where}`, run: async (c) => { pin.setAttribute('opacity', 1); await tween(c, 1400, (tt) => placePin(t * tt)); } },
      { cap: rcap, run: async (c) => { await pop(c, rule); } },
      { cap: dot(`${s} = <b>${from12 ? t24(t) : t12(t)}</b>`), run: async (c) => { await pop(c, goal); goal.classList.add('u2l1-ansv'); } }
    ];
  }
};

/* =============================== explainer: count up in jumps =============================== */
const CU = {
  n: { lab: 'Notes: 8:40 a.m. → 1:25 p.m.', s: '8:40 a.m.', e: '1:25 p.m.', ask: 'Find the elapsed time from 8:40 a.m. to 1:25 p.m.' },
  a: { lab: 'Ex 6(a)', s: '8:50 a.m.', e: '11:20 a.m.', ask: 'Example 6(a): find the elapsed time from 8:50 a.m. to 11:20 a.m.' },
  b: { lab: 'Ex 6(b)', s: '10:35 a.m.', e: '3:10 p.m.', ask: 'Example 6(b): find the elapsed time from 10:35 a.m. to 3:10 p.m.' },
  g: { lab: 'Ex 7(a) night shift', s: '10:45 p.m.', e: '7:15 a.m.', ask: 'Example 7(a): a security guard works from 10:45 p.m. to 7:15 a.m. How long is his shift, in hours and minutes and in decimal hours?', dec: true }
};
const countUp = {
  title: 'Count up in friendly jumps',
  height: 300,
  minW: 940,
  capH: 92,
  choices: [{ v: 'n', label: CU.n.lab }, { sep: 'Check:' }, 'a', 'b', 'g'].map((k) => (typeof k === 'string' ? { v: k, label: CU[k].lab } : k)),
  ask: (k) => CU[k].ask,
  make(stage, k) {
    const D = CU[k], pl = jumpPlan(P(D.s), P(D.e), 90, 850), J = jumpLine(stage, pl, 150, { abs: true, W: 940, H: 220 });
    J.tk.forEach((g) => g.setAttribute('opacity', 0)); if (J.nightG) J.nightG.setAttribute('opacity', 0);
    const all = [J.arcs.first, ...(J.arcs.mid || []), J.arcs.last].filter(Boolean);
    all.forEach((a) => { a.p.style.opacity = 0; a.ah.style.opacity = 0; a.t.style.opacity = 0; });
    const jump = async (c, a) => { a.p.style.opacity = 1; await drawIn(a.p, 700, c); a.ah.style.opacity = 1; await anim(c, a.t, [{ opacity: 0 }, { opacity: 1 }], 300); };
    const fa = (c, g) => anim(c, g, [{ opacity: 0 }, { opacity: 1 }], 350);
    const sum = hide(lab(stage, 470, 262, '', 'u2l1-eq u2l1-mid'));
    const parts = [pl.first && hmT(pl.first), pl.mid && hmT(pl.mid), pl.last && hmT(pl.last)].filter(Boolean);
    const mm = pl.first + pl.last, tot = pl.total;
    const steps = [
      { cap: `Mark the start, <b>${D.s}</b>, and the end, ${dot(`<b>${D.e}</b>`)}${pl.night ? ' The shift goes past <b>midnight</b>.' : ''}`,
        run: async (c) => { await fa(c, J.tk[0]); await fa(c, J.tk[J.tk.length - 1]); if (J.nightG) await fa(c, J.nightG); } }
    ];
    if (pl.first) steps.push({ cap: `① Jump to the next whole hour: ${D.s} → ${t12(pl.n1 % 1440)} is <b>${hm(pl.first)}</b>.`, run: async (c) => { await fa(c, J.tk[1]); await jump(c, J.arcs.first); } });
    if (pl.mid) steps.push({ cap: pl.night ? `② Jump the whole hours: ${t12(pl.n1 % 1440)} → ${t12(pl.n2 % 1440)} is <b>${hm(pl.mid)}</b> (${hm(1440 - pl.n1)} to midnight + ${hm(pl.n2 - 1440)}).` : `② Jump the whole hours: ${t12(pl.n1 % 1440)} → ${t12(pl.n2 % 1440)} is <b>${hm(pl.mid)}</b>.`,
      run: async (c) => { if (pl.last) await fa(c, J.tk[2]); for (const a of J.arcs.mid) await jump(c, a); } });
    if (pl.last) steps.push({ cap: `③ Jump the minutes left: ${t12(pl.n2 % 1440)} → ${D.e} is <b>${hm(pl.last)}</b>.`, run: (c) => jump(c, J.arcs.last) });
    steps.push({ cap: `④ Add the jumps: ${parts.map((p) => T(p)).join(' + ')} = <b>${hm(tot)}</b>${mm >= 60 ? ` (${mm} min = ${hm(mm)})` : ''}.`,
      run: async (c) => { sum.innerHTML = K(`${parts.join('+')}=\\mathbf{${hmT(tot)}}`); await show(c, sum); } });
    if (D.dec) steps.push({ cap: `In decimal hours: ${T(`${tot % 60}\\div60=${r2((tot % 60) / 60)}`)}, so <b>${hm(tot)} = ${r2(tot / 60)} h</b>.`,
      run: async (c) => { sum.innerHTML = K(`${parts.join('+')}=${hmT(tot)}=\\mathbf{${r2(tot / 60)}\\text{ h}}`); await pulse(c, sum, 1.06); } });
    return steps;
  }
};

/* =============================== explainer (Full notes): subtract on the 24-hour clock =============================== */
const SB = {
  n: { lab: 'Notes: 8:40 a.m. to 1:25 p.m.', a: [13, 25], b: [8, 40], from: ['1:25 p.m. = 13:25', '8:40 a.m. = 08:40'] },
  b: { lab: 'Ex 6(b): 10:35 a.m. to 3:10 p.m.', a: [15, 10], b: [10, 35], from: ['3:10 p.m. = 15:10', '10:35 a.m. = 10:35'] },
  w: { lab: 'Watch out: 8:50 to 10:15', a: [10, 15], b: [8, 50], wrong: true }
};
const sub24 = {
  title: 'Or subtract on the 24-hour clock',
  height: 290,
  minW: 940,
  capH: 92,
  choices: ['n', 'b', 'w'].map((k) => ({ v: k, label: SB[k].lab })),
  ask: (k) => (k === 'w' ? 'How long is it from 8:50 to 10:15?' : `Find the elapsed time ${SB[k].lab.replace(/^[^:]*: /, 'from ')} by subtracting on the 24-hour clock.`),
  make(stage, k) {
    const D = SB[k], [H1, M1] = D.a, [H2, M2] = D.b, h1 = H1 - 1, m1 = M1 + 60, rh = h1 - H2, rm = m1 - M2, XL = 300;
    const row = (y, sign, H, M) => { const d = lab(stage, XL, y, `<span class="sg">${sign}</span><span class="hh">${pad(H)}</span><span class="cl">:</span><span class="mm">${pad(M)}</span>`, 'u2l1-lcdrow'); return d; };
    const r1 = row(30, '', H1, M1), r2_ = row(110, '−', H2, M2);
    const line = add(stage, h('div', 'u2l1-abs u2l1-rule'), XL - 10, 196); line.style.width = '300px';
    const res = hide(lab(stage, XL + 10, 212, '', 'u2l1-lcdres'));
    const side = hide(lab(stage, 660, 40, '', 'u2l1-side'));
    const steps = [];
    if (D.wrong) {
      const bad = hide(lab(stage, 650, 60, `${T('10.15-8.50=1.65')}`, 'u2l1-bad'));
      const st = stamp(stage, 'not 1 h 65 min!', { ok: false, x: 780, y: 140, size: 'sm' }); hide(st);
      steps.push({ cap: `A calculator would say ${T('10.15-8.50=1.65')}. That treats an hour as <b>100 min</b>. Wrong!`, run: async (c) => { await show(c, bad); await stampIn(c, st); } });
    } else steps.push({ cap: `Write both times on the 24-hour clock: ${D.from[0]} and ${D.from[1]}. Put the later time on top.`, run: async (c) => { side.innerHTML = D.from.join('<br>'); await show(c, side); } });
    steps.push({ cap: `${M1} − ${M2}? <b>Not enough minutes.</b> Borrow 1 h = 60 min: ${pad(H1)}:${pad(M1)} → <b>${pad(h1)}:${m1}</b>.`,
      run: async (c) => { await shake(c, r1.querySelector('.mm')); r1.querySelector('.hh').innerHTML = `<s>${pad(H1)}</s><b>${pad(h1)}</b>`; r1.querySelector('.mm').innerHTML = `<s>${pad(M1)}</s><b>${m1}</b>`; await pop(c, r1); } });
    steps.push({ cap: `Subtract: ${h1} − ${H2} = <b>${rh} h</b> and ${m1} − ${M2} = <b>${rm} min</b>. Elapsed time: <b>${rh} h ${rm} min</b>${D.wrong ? ' ✓' : ', the same as counting up ✓'}.`,
      run: async (c) => { res.innerHTML = `${rh} h ${rm} min`; await pop(c, res); } });
    return steps;
  }
};

/* =============================== explainer: the timesheet that totals itself =============================== */
const TS = {
  p: { lab: 'Ex 8(a) Priya', ask: 'Example 8(a): Priya works from 8:30 a.m. to 5:15 p.m. with a 30 min unpaid lunch. How many hours does she work (hours and minutes, and decimal hours)?',
    rows: [['Priya', '8:30 a.m.', '5:15 p.m.', 30]], head: 'Name' },
  d: { lab: 'Ex 8(b) Mr. Dhillon (split shift)', ask: 'Example 8(b): Mr. Dhillon works 6:45 a.m. to 9:10 a.m. and 2:50 p.m. to 5:05 p.m. How many hours does he work? Round decimal hours to 2 places.',
    rows: [['Morning', '6:45 a.m.', '9:10 a.m.', 0], ['Afternoon', '2:50 p.m.', '5:05 p.m.', 0]], head: 'Shift' },
  j: { lab: 'Ex 9 Jordan’s week', ask: 'Example 9: Jordan is a cook in Cochrane. Complete his timesheet for the week.',
    rows: [['Monday', '7:15 a.m.', '3:45 p.m.', 30], ['Tuesday', '11:30 a.m.', '7:50 p.m.', 30], ['Wednesday', null], ['Thursday', '4:00 p.m.', '11:45 p.m.', 45], ['Friday', '5:30 p.m.', '1:15 a.m.', 30], ['Saturday', '9:00 a.m.', '1:40 p.m.', 0]], head: 'Day', short: true }
};
const timesheet = {
  title: 'A timesheet that totals itself',
  height: 372,
  minW: 940,
  capH: 92,
  choices: [{ sep: 'Check:' }, 'p', 'd', 'j'].map((k) => (typeof k === 'string' ? { v: k, label: TS[k].lab } : k)),
  ask: (k) => TS[k].ask,
  make(stage, k) {
    const D = TS[k];
    const rows = D.rows.map(([day, a, b, br]) => {
      if (!a) return { day, off: true };
      const s = P(a), e = P(b), pl = jumpPlan(s, e, 0, 1), span = pl.total, w = span - br;
      const jumps = [pl.first && hm(pl.first), pl.mid && hm(pl.mid), pl.last && hm(pl.last)].filter(Boolean);
      return { day, a, b, br, span, w, jumps, night: !!pl.night };
    });
    const work = rows.filter((r) => !r.off), sh = work.reduce((x, r) => x + Math.floor(r.w / 60), 0), sm = work.reduce((x, r) => x + r.w % 60, 0), tot = sh * 60 + sm;
    const tb = h('table', 'u2l1-abs u2l1-tsx');
    tb.innerHTML = `<tr><th>${D.head}</th><th>In</th><th>Out</th><th>Time in to out</th><th>Unpaid break</th><th>Hours worked</th></tr>` +
      rows.map((r) => (r.off ? `<tr class="off"><th>${r.day}</th><td colspan="5">day off</td></tr>` : `<tr><th>${r.day}</th><td>${r.a}</td><td>${r.b}</td><td class="f1"></td><td>${r.br ? r.br + ' min' : 'none'}</td><td class="f2"></td></tr>`)).join('') +
      `<tr class="tot"><th colspan="5">Total hours (hours and minutes)</th><td class="t1"></td></tr><tr class="tot"><th colspan="5">Total hours (decimal hours${k === 'j' ? '' : ', 2 places'})</th><td class="t2"></td></tr>`;
    add(stage, tb, 0, 4);
    const trs = [...tb.querySelectorAll('tr')].slice(1);
    const t1 = tb.querySelector('.t1'), t2 = tb.querySelector('.t2');
    const steps = [];
    let accH = 0, accM = 0;
    rows.forEach((r, i) => {
      if (r.off) return;
      const tr = trs[i], f1 = tr.querySelector('.f1'), f2 = tr.querySelector('.f2');
      accH += Math.floor(r.w / 60); accM += r.w % 60; const soH = accH, soM = accM;
      const how = (!D.short || r.night) ? `${r.jumps.join(' + ')} = ${hm(r.span, true)}` : hm(r.span, true);
      const brk = r.br ? `Take off the ${r.br} min break: <b>${hm(r.w, true)}</b>.` : `No break: <b>${hm(r.w, true)}</b>.`;
      steps.push({ cap: `<b>${r.day}:</b> ${r.a} to ${r.b}${r.night ? ' goes past midnight' : ''}: ${how}. ${brk}`,
        run: async (c) => {
          trs.forEach((x) => x.classList.remove('lit')); tr.classList.add('lit');
          f1.textContent = hm(r.span, true); await pop(c, f1); f2.textContent = hm(r.w, true); await pop(c, f2);
          if (work.length > 1) { t1.innerHTML = `<span class="so">so far: ${soH} h ${soM} min</span>`; }
        } });
    });
    const regroupTxt = sm >= 60 ? ` = ${hm(sm)}` : '';
    if (work.length > 1) steps.push({ cap: `Add the hours: ${work.map((r) => Math.floor(r.w / 60)).join(' + ')} = <b>${sh} h</b>. Add the minutes: ${work.map((r) => r.w % 60).join(' + ')} = <b>${sm} min</b>${regroupTxt}. Total: <b>${hm(tot, true)}</b>.`,
      run: async (c) => { trs.forEach((x) => x.classList.remove('lit')); t1.textContent = hm(tot, true); await pop(c, t1); } });
    else steps.push({ cap: `Total for the day: <b>${hm(tot, true)}</b>.`, run: async (c) => { trs.forEach((x) => x.classList.remove('lit')); t1.textContent = hm(tot, true); await pop(c, t1); } });
    const m = tot % 60, exact = m % 3 === 0;
    steps.push({ cap: `Change to decimal hours <b>at the end</b>: ${T(`${m}\\div60=${div60(m, 3)}`)}, so ${exact ? '' : 'about '}<b>${r2(tot / 60)} h</b>.`,
      run: async (c) => { t2.textContent = r2(tot / 60) + ' h'; t2.classList.add('fin'); await pop(c, t2); } });
    return steps;
  }
};

/* =============================== wiring =============================== */
mountRibbon();
mountJumpFig();
mountExplainers({ clockBar, convert, trap, pieces, regroup, clock24, countUp, sub24, timesheet });

/* ============ Math History: why 60? (base 60 → a 10-hour French clock) ============ */
function sixtyStory() {
  const svg = document.getElementById('u2l1-hist'); if (!svg) return;
  const NSV = 'http://www.w3.org/2000/svg', E = (tag, a, p) => { const e = document.createElementNS(NSV, tag); for (const k in a) e.setAttribute(k, a[k]); (p || svg).appendChild(e); return e; };
  const TX = (x, y, s, cls, p) => { const t = E('text', { x, y, class: cls }, p); t.textContent = s; return t; };
  svg.innerHTML = '';
  E('rect', { x: 0, y: 0, width: 600, height: 300, rx: 14, fill: '#fffaf1' });
  const cx = 150, cy = 140, R = 100;
  const secG = E('g', {});
  E('circle', { cx, cy, r: R, fill: 'none', stroke: '#4a2c14', 'stroke-width': 4 });
  for (let m = 0; m < 60; m++) { const a = m * Math.PI / 30, r1 = R - (m % 5 ? 6 : 12); E('line', { x1: cx + r1 * Math.sin(a), y1: cy - r1 * Math.cos(a), x2: cx + R * Math.sin(a), y2: cy - R * Math.cos(a), stroke: '#4a2c14', 'stroke-width': m % 5 ? 1 : 2.5 }); }
  const cap = TX(cx, 274, '', 'u2l1-hcap');
  TX(cx, 22, 'one hour: 60 minutes', 'u2l1-hsm');
  // the French clock
  const fG = E('g', { opacity: 0 }), fx = 445, fy = 140, fR = 92;
  E('circle', { cx: fx, cy: fy, r: fR, fill: '#fffdf8', stroke: '#7a4a26', 'stroke-width': 4 }, fG);
  const fNums = [];
  for (let i = 1; i <= 10; i++) { const a = i * Math.PI / 5, r = fR - 20; const t = TX(fx + r * Math.sin(a), fy - r * Math.cos(a) + 6, String(i), 'u2l1-hnum', fG); t.setAttribute('opacity', 0); fNums.push(t); }
  const fHand = E('line', { x1: fx, y1: fy, x2: fx, y2: fy - fR + 22, stroke: '#b07a12', 'stroke-width': 4, 'stroke-linecap': 'round' }, fG);
  E('circle', { cx: fx, cy: fy, r: 5, fill: '#4a2c14' }, fG);
  TX(fx, 22, 'France, 1793', 'u2l1-hyr', fG);
  const fCap = TX(fx, 274, '10 hours of 100 minutes', 'u2l1-hcap', fG);
  const NS = [2, 3, 4, 5, 6, 12], COL = ['#e3b25f', '#c98a3a'];
  const sectors = (n) => {
    secG.innerHTML = '';
    for (let j = 0; j < n; j++) {
      const a0 = j / n * 2 * Math.PI, a1 = (j + 1) / n * 2 * Math.PI, p = (a) => `${cx + R * Math.sin(a)} ${cy - R * Math.cos(a)}`;
      E('path', { d: `M${cx} ${cy} L${p(a0)} A${R} ${R} 0 0 1 ${p(a1)} Z`, fill: COL[j % 2], opacity: 0.8 }, secG);
    }
  };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let raf = 0, lastN = 0;
  const draw = (t) => {
    const i = Math.min(NS.length - 1, Math.floor(t / 1.25)), n = NS[i];
    if (n !== lastN) { sectors(n); lastN = n; }
    cap.textContent = `60 ÷ ${n} = ${60 / n} min each`;
    const k = Math.min(1, Math.max(0, (t - 8) / 0.8)); fG.setAttribute('opacity', k);
    fNums.forEach((e, j) => e.setAttribute('opacity', Math.min(1, Math.max(0, (t - 8.6 - j * 0.15) / 0.3))));
    const ang = Math.max(0, t - 10.2) * 90; fHand.setAttribute('transform', `rotate(${ang} ${fx} ${fy})`);
    fCap.setAttribute('opacity', t > 10 ? 1 : 0);
  };
  const play = () => {
    cancelAnimationFrame(raf); lastN = 0;
    if (reduce) { draw(13); return; }
    const t0 = performance.now();
    const step = (now) => { const t = (now - t0) / 1000; draw(Math.min(t, 13)); if (t < 13) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
  };
  draw(0);
  const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { play(); io.disconnect(); } }, { threshold: 0.5 });
  io.observe(svg);
  svg.addEventListener('click', play);
  const b = svg.closest('.card').querySelector('.hist-play'); if (b) b.addEventListener('click', play);
}
sixtyStory();

/* ============ Stand Up Break! — decimal hours, regrouping, hours worked ============ */
{
  const hmL = (m) => hmT(m, true);
  standup('u2l1', {
    intro: 'Show every step on the whiteboard. Remember: an hour has 60 minutes, not 100.',
    levels: {
      BEG: (r) => r.pick([
        () => { const H = r.int(2, 9), m = 3 * r.int(1, 19); return { text: 'Change to decimal hours.', q: hmL(H * 60 + m), a: [`${m}\\div60=${r2(m / 60)}`, `${H}+${r2(m / 60)}=${r2(H + m / 60)}\\text{ h}`] }; },
        () => { const H = r.int(1, 9), f = r.pick([5, 10, 15, 20, 25, 30, 35, 40, 45, 55, 60, 65, 70, 75, 80, 85, 90, 95]); const fr = (f / 100).toString(), m = Math.round(f * 0.6); return { text: 'Change to hours and minutes.', q: `${r2(H + f / 100)}\\text{ h}`, a: [`${fr}\\times60=${m}`, hmL(H * 60 + m)] }; }
      ])(),
      PRG: (r) => r.pick([
        () => { const a = r.int(1, 6), b = r.int(1, 6), m1 = 5 * r.int(5, 11), m2 = 5 * r.int(Math.max(1, 13 - m1 / 5), 11); const H = a + b, M = m1 + m2; return { text: 'Add. Regroup so the minutes are less than 60.', q: `${hmL(a * 60 + m1)}+${hmL(b * 60 + m2)}`, a: [`${H}\\text{ h}\\ ${M}\\text{ min}`, `=${hmL(H * 60 + M)}`] }; },
        () => { const H1 = r.int(6, 12), m1 = 5 * r.int(0, 6), H2 = r.int(1, H1 - 2), m2 = 5 * r.int(m1 / 5 + 1, 11); return { text: 'Subtract. Borrow 1 h if you need to.', q: `${hmL(H1 * 60 + m1)}-${hmL(H2 * 60 + m2)}`, a: [`${H1 - 1}\\text{ h}\\ ${m1 + 60}\\text{ min}-${hmL(H2 * 60 + m2)}`, `=${hmL((H1 - H2) * 60 + m1 - m2)}`] }; }
      ])(),
      MAS: (r) => {
        const s = 60 * r.int(6, 10) + 5 * r.int(0, 11), e = 60 * r.int(15, 18) + 5 * r.int(0, 11), br = r.pick([30, 30, 45]), span = e - s, w = span - br, m = w % 60;
        const pl = jumpPlan(s, e, 0, 1), jumps = [pl.first && hmL(pl.first), pl.mid && hmL(pl.mid), pl.last && hmL(pl.last)].filter(Boolean);
        return { text: `A shift runs from <b>${t12(s)}</b> to <b>${t12(e)}</b> with a <b>${br} min</b> unpaid break. Find the hours worked, in hours and minutes and in decimal hours (2 places).`, q: '',
          a: [`${jumps.join('+')}=${hmL(span)}`, `${hmL(span)}-${br}\\text{ min}=${hmL(w)}`, `${m}\\div60${m % 3 === 0 ? '=' : '\\approx'}${r2(m / 60)}`, `${hmL(w)}${m % 3 === 0 ? '=' : '\\approx'}${r2(w / 60)}\\text{ h}`] };
      }
    }
  });
}
