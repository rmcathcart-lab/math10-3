/* Math 10-3 · Unit 4 · Lesson 3 — Temperature: Celsius and Fahrenheit.
 * Explainers: the double thermometer (freezing, boiling, 100 vs 180 degrees), the C → F machine (× 1.8, + 32), why
 * it works by climbing the thermometer (Full notes), the F → C undo machine (− 32, ÷ 1.8; an oven dial for Lucas),
 * brackets on the calculator (wrong vs right verdicts), the quick estimate vs the exact line (zoom out to an oven),
 * comparing on one thermometer (Full notes), the Calgary chinook (a change is only × 1.8), and where the scales meet
 * at −40 (Full notes). Also the hands-on double thermometer, the Math History box and the Stand Up Break. */
import { h, add, box, tex, svgEl, tween, pulse, stamp, stampIn, drawIn, liveCtx, Graph, ValueTable, mountExplainers } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const rnd = (v, d = 1) => Math.round((v + (v >= 0 ? 1e-9 : -1e-9)) * 10 ** d) / 10 ** d;
const toF = (c) => 1.8 * c + 32, toC = (f) => (f - 32) / 1.8;
const nt = (v, d = 1) => String(rnd(v, d));                    // TeX number (KaTeX draws the minus)
const nx = (v, d = 1) => String(rnd(v, d)).replace('-', '−');   // text number with a real minus
const par = (v) => (v < 0 ? `(${nt(v, 2)})` : nt(v, 2));          // bracket a negative in a product
const lerp = (a, b, t) => a + (b - a) * t;
const WL = (cls, html) => h('div', cls, `<div>${html}</div>`);   // a work line: flex-centred, spaces kept
const cbox = (cls, html) => h('div', cls + ' u4l3-c', `<div>${html}</div>`);
const lcdStr = (v) => String(parseFloat(v.toPrecision(10)));
/** the calculator screen: the entry on top, the result under it */
const lcd = (e, r, w = 300) => box(h('div', 'u4l3-lcd', `<div class="e">${e}</div><div class="r">${r}</div>`), w, 76);

/* ======================================================================================
 * The double thermometer (SVG): °C ticks on the left, °F ticks on the right, a red liquid.
 * thermo(host, { x, y, h, cmin, cmax, cStep, cMinor, fStep, fMinor, padL, padR })
 * → { el, yOf(c) (px in the svg), Y(c) (px in the host), X (left of the svg), cx, W, set(c), go(cx, c, ms),
 *     line(c, color), brace(c1, c2, side, color) }
 * ====================================================================================== */
function thermo(host, o = {}) {
  const { cmin = -40, cmax = 110, cStep = 10, cMinor = 5, fStep = 20, fMinor = 10, padL = 20, padR = 20, font = 16 } = o;
  const hh = o.h || 320, top = 36, tubeW = 24, cx = padL + 100, bot = top + hh, bulbR = 22, bulbY = bot + bulbR + 4, W = padL + padR + 200, H = bulbY + bulbR + 6;
  const svg = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u4l3-th' });
  const yOf = (c) => top + (cmax - c) / (cmax - cmin) * hh;
  const tl = cx - tubeW / 2, tr = cx + tubeW / 2;
  svgEl('rect', { x: tl, y: top - 16, width: tubeW, height: hh + 34, rx: tubeW / 2, fill: '#fff', stroke: '#3a4254', 'stroke-width': 3 }, svg);
  svgEl('circle', { cx, cy: bulbY, r: bulbR, fill: '#d8463e', stroke: '#3a4254', 'stroke-width': 3 }, svg);
  const liq = svgEl('rect', { x: cx - 6, width: 12, y: bulbY - 4, height: 4, fill: '#d8463e' }, svg);
  const knob = o.knob ? svgEl('rect', { x: cx - 22, width: 44, height: 12, rx: 6, fill: '#d8463e', stroke: '#7a1f16', 'stroke-width': 2.5 }, svg) : null;
  svgEl('rect', { x: cx - 6, y: bot - 2, width: 12, height: bulbY - bot, fill: '#d8463e' }, svg);
  const eps = 1e-6, mult = (v, s) => Math.abs(v / s - Math.round(v / s)) < eps;
  for (let c = Math.ceil(cmin / cMinor - eps) * cMinor; c <= cmax + eps; c += cMinor) {
    const y = yOf(c), maj = mult(c, cStep);
    svgEl('line', { x1: tl, x2: tl - (maj ? 15 : 8), y1: y, y2: y, stroke: '#3a4254', 'stroke-width': maj ? 2.5 : 1.6 }, svg);
    if (maj) { const t = svgEl('text', { x: tl - 19, y: y + 5.5, 'text-anchor': 'end', 'font-size': font, 'font-weight': 700, fill: '#1c2230', class: 'u4l3-tht' }, svg); t.textContent = nx(c, 1); }
  }
  const fmin = toF(cmin), fmax = toF(cmax);
  for (let f = Math.ceil(fmin / fMinor - eps) * fMinor; f <= fmax + eps; f += fMinor) {
    const y = yOf(toC(f)), maj = mult(f, fStep);
    svgEl('line', { x1: tr, x2: tr + (maj ? 15 : 8), y1: y, y2: y, stroke: '#3a4254', 'stroke-width': maj ? 2.5 : 1.6 }, svg);
    if (maj) { const t = svgEl('text', { x: tr + 19, y: y + 5.5, 'text-anchor': 'start', 'font-size': font, 'font-weight': 700, fill: '#1c2230', class: 'u4l3-tht' }, svg); t.textContent = nx(f, 1); }
  }
  const hd = (x, s, col) => { const t = svgEl('text', { x, y: 18, 'text-anchor': 'middle', 'font-size': 19, 'font-weight': 800, fill: col }, svg); t.textContent = s; };
  hd(tl - 34, '°C', '#9a3a12'); hd(tr + 34, '°F', '#1f5bd6');
  const X = o.x || 0, Yh = o.y || 0;
  if (host) add(host, svg, o.x, o.y);
  let level = cmin;
  const set = (c) => { level = c; const y = Math.max(top - 10, Math.min(bot, yOf(c))); liq.setAttribute('y', y); liq.setAttribute('height', Math.max(0, bulbY - y)); if (knob) knob.setAttribute('y', y - 6); };
  set(o.level ?? cmin);
  return {
    el: svg, yOf, Y: (c) => Yh + yOf(c), X, cx, W, H, tl, tr, top, bot,
    set, get level() { return level; },
    go(c, to, ms = 900) { const a = level; return tween(c, ms, (t) => set(lerp(a, to, t))); },
    line(c, color = '#9a6a24', o2 = {}) { return svgEl('line', { x1: o2.x1 ?? tl - 40, x2: o2.x2 ?? tr + 40, y1: yOf(c), y2: yOf(c), stroke: color, 'stroke-width': 3, 'stroke-dasharray': o2.dash || '7 5', class: 'bk-stroke' }, svg); },
    /** a bracket beside the scale from c1 to c2: side 'L' (left of the °C labels) or 'R' */
    brace(c1, c2, side, color) {
      const x = side === 'L' ? padL - 4 : W - padR + 4, d = side === 'L' ? 10 : -10, y1 = yOf(c1), y2 = yOf(c2);
      const g = svgEl('g', {}, svg);
      svgEl('path', { d: `M${x + d} ${y1} H${x} V${y2} H${x + d}`, fill: 'none', stroke: color, 'stroke-width': 4, 'stroke-linejoin': 'round', class: 'bk-stroke' }, g);
      return g;
    }
  };
}

/* ======================================================================================
 * 1. Two scales on one thermometer
 * ====================================================================================== */
const scales = {
  title: 'One thermometer, two scales',
  height: 440,
  minW: 900,
  ask: 'Water freezes and water boils. What do the two scales say, and how far apart are they?',
  make(stage, v, ex) {
    const W = ex.W;
    const th = thermo(stage, { x: 30, y: 0, h: 330, cmin: -10, cmax: 110, cStep: 10, cMinor: 5, fStep: 20, fMinor: 10, padL: 96, padR: 96 });
    const fr = hide(th.line(0, '#1f5bd6')), bo = hide(th.line(100, '#c93a33'));
    const PX = 30 + th.W + 24, PW = W - PX - 16;
    const card = (c, html, cls) => hide(add(stage, box(cbox('u4l3-sc ' + cls, html), PW, 56), PX, th.Y(c) - 28));
    const cF = card(0, '<b>Water freezes:</b> 0 °C = <b>32 °F</b>', 'fr'), cB = card(100, '<b>Water boils:</b> 100 °C = <b>212 °F</b>', 'bo');
    const bL = hide(th.brace(0, 100, 'L', '#9a3a12')), bR = hide(th.brace(0, 100, 'R', '#1f5bd6'));
    const pL = hide(add(stage, box(cbox('u4l3-bp l', '<b>100</b>Celsius degrees'), 84, 74), 30 + 4, th.Y(50) - 37));
    const pR = hide(add(stage, box(cbox('u4l3-bp r', '<b>180</b>Fahrenheit degrees'), 88, 74), 30 + th.W - 88, th.Y(50) - 37));
    // 5 Celsius degrees vs 9 Fahrenheit degrees: the same length
    const BW = Math.min(450, PW - 20), BX = PX + (PW - BW) / 2, BY = 104;
    const blocks = h('div', 'u4l3-blk'); box(blocks, BW, 108); add(stage, blocks, BX, BY);
    const row = (n, cls, lab) => { const r = h('div', 'u4l3-blkrow ' + cls); for (let i = 0; i < n; i++) r.appendChild(h('span', 'u4l3-bk', '')); blocks.appendChild(h('div', 'u4l3-blklab', lab)); blocks.appendChild(r); return r; };
    row(5, 'cel', '5 Celsius degrees'); row(9, 'fah', '9 Fahrenheit degrees (the same height)');
    hide(blocks);
    const res = hide(add(stage, box(cbox('u4l3-res', '<b>1 Celsius degree = 1.8 Fahrenheit degrees</b>'), PW, 50), PX, BY + 118));
    return [
      { cap: 'Water <b>freezes</b> at <b>0 °C</b>. The same height on the other side reads <b>32 °F</b>.', run: async (c) => { await th.go(c, 0, 900); await c.fadeIn(fr); await c.pop(cF); } },
      { cap: 'Water <b>boils</b> at <b>100 °C</b>, which is <b>212 °F</b>.', run: async (c) => { await th.go(c, 100, 1200); await c.fadeIn(bo); await c.pop(cB); } },
      { cap: 'Freezing to boiling is <b>100 Celsius degrees</b> on the left…', run: async (c) => { bL.style.opacity = 1; await drawIn(bL, 600, c); await c.pop(pL); } },
      { cap: `…but <b>180 Fahrenheit degrees</b> on the right: ${T('212-32=180')}.`, run: async (c) => { bR.style.opacity = 1; await drawIn(bR, 600, c); await c.pop(pR); } },
      { cap: `The same height is cut into <b>more, smaller</b> Fahrenheit degrees: ${T('180\\div100=1.8')}. Five Celsius degrees match nine Fahrenheit degrees.`, run: (c) => c.fadeIn(blocks) },
      { cap: 'So <b>1 Celsius degree = 1.8 Fahrenheit degrees</b>. And the scales <b>start</b> in different places: 0 on one, 32 on the other.', run: async (c) => { await c.pop(res); await pulse(c, cF, 1.06); } }
    ];
  }
};

/* ======================================================================================
 * 2. The C → F machine
 * ====================================================================================== */
const CF = {
  a: { c: 25, what: '(a) A hot summer afternoon', ex: 2 }, b: { c: 37, what: '(b) Normal body temperature', ex: 2 },
  c: { c: -15, what: '(c) A cold January morning', ex: 2 }, d: { c: 230, what: '(d) A pizza oven', ex: 2 },
  e: { c: 22.5, what: '(e) A warm bedroom', ex: 2 }, f: { c: -30, what: '(f) A bitter cold night', ex: 2 },
  e3a: { c: 21, what: '(a) Amira’s room at home', ex: 3, round: 0, say: 'Set the hotel thermostat to about <b>70 °F</b>.' },
  e3b: { c: -8, what: '(b) Calgary today', ex: 3, round: 0, say: 'It is about <b>17.6 °F</b> (about 18 °F) in Calgary.' }
};
/** a range for the little thermometer beside a machine */
const rangeFor = (c) => (Math.abs(c) <= 50 ? { cmin: -40, cmax: 50, cStep: 10, cMinor: 5, fStep: 20, fMinor: 10 } : { cmin: 0, cmax: 250, cStep: 50, cMinor: 10, fStep: 100, fMinor: 20 });
function machine(stage, x0, y0, labels, cls) {
  // four slots: [input] → [op1] → [op2] → [output]; returns their left x
  const xs = [x0, x0 + 170, x0 + 340, x0 + 510], els = {};
  els.b1 = add(stage, box(cbox('u4l3-mbox ' + cls, labels[0]), 130, 74), xs[1], y0);
  els.b2 = add(stage, box(cbox('u4l3-mbox ' + cls, labels[1]), 130, 74), xs[2], y0);
  [0, 1, 2].forEach((i) => add(stage, box(h('div', 'u4l3-marr ' + cls, labels[2] === 'rev' ? '◀' : '▶'), 40, 74), xs[i] + 130, y0));
  return { xs, els };
}
const cToF = {
  title: 'Celsius to Fahrenheit: × 1.8, then + 32',
  height: 440,
  minW: 900,
  choices: [{ sep: 'Example 2 check:' }, { v: 'a', label: '(a) 25 °C' }, { v: 'b', label: '(b) 37 °C' }, { v: 'c', label: '(c) −15 °C' }, { v: 'd', label: '(d) 230 °C' }, { v: 'e', label: '(e) 22.5 °C' }, { v: 'f', label: '(f) −30 °C' },
    { sep: 'Example 3:' }, { v: 'e3a', label: '(a) 21 °C' }, { v: 'e3b', label: '(b) −8 °C' }],
  ask: (k) => `Example ${CF[k].ex}${CF[k].what.slice(0, 4)}: change <b>${nx(CF[k].c)} °C</b> to °F.${CF[k].round === 0 ? ' Round to the nearest degree.' : ''}`,
  make(stage, k, ex) {
    const d = CF[k], c0 = d.c, m = 1.8 * c0, f = toF(c0), W = ex.W;
    const M = machine(stage, 14, 20, ['<b>× 1.8</b>', '<b>+ 32</b>', 'fwd'], 'fwd');
    const tok = add(stage, box(cbox('u4l3-tok cel', `${nx(c0)} °C`), 130, 74), M.xs[0], 20);
    const mid = hide(add(stage, box(cbox('u4l3-tok mid', nx(m, 2)), 130, 40), M.xs[1], 98));
    const out = hide(add(stage, box(cbox('u4l3-tok fah', `${nx(f, 2)} °F`), 130, 74), M.xs[3], 20));
    const L1 = hide(add(stage, box(WL('u4l3-wl', `Step 1: ${T(`1.8\\times${par(c0)}=${nt(m, 2)}`)}`), 640, 46), 20, 148));
    const L2 = hide(add(stage, box(WL('u4l3-wl', `Step 2: ${T(`${nt(m, 2)}+32=${nt(f, 2)}`)}`), 640, 46), 20, 200));
    const resTxt = d.say || `${nx(c0)} °C = <b>${nx(f, 2)} °F</b>`;
    const L3 = d.round === 0 ? hide(add(stage, box(WL('u4l3-wl', `Round: ${T(`${nt(f, 2)}\\approx${nt(f, 0)}`)}`), 640, 46), 20, 252)) : null;
    const res = hide(add(stage, box(cbox('u4l3-res', resTxt), 600, 56), 20, 316));
    const R = rangeFor(c0), th = thermo(stage, Object.assign({ x: W - 250, y: 0, h: 330, padL: 10, padR: 30, level: R.cmin }, R));
    const ln = hide(th.line(c0, '#9a6a24'));
    const steps = [
      { cap: `Put <b>${nx(c0)} °C</b> into the machine: <b>× 1.8</b>, then <b>+ 32</b>.`, run: (c) => c.pop(tok) },
      { cap: `Step 1: multiply by 1.8: ${T(`1.8\\times${par(c0)}=${nt(m, 2)}`)}.${c0 < 0 ? ' A negative times a positive is <b>negative</b>.' : ''}`,
        run: async (c) => { await c.anim(tok, [{ transform: 'none' }, { transform: `translateX(${M.xs[1] - M.xs[0]}px)`, opacity: 0.2 }], 600); tok.style.opacity = 0; await c.pop(mid); await c.fadeIn(L1); } },
      { cap: `Step 2: add 32: ${T(`${nt(m, 2)}+32=${nt(f, 2)}`)}.`,
        run: async (c) => { await c.anim(mid, [{ transform: 'none' }, { transform: `translateX(${M.xs[2] - M.xs[1]}px)`, opacity: 0.2 }], 600); mid.style.opacity = 0; await c.pop(out); await c.fadeIn(L2); } }
    ];
    if (L3) steps.push({ cap: `Round to the nearest degree: ${T(`${nt(f, 2)}\\approx${nt(f, 0)}`)}.`, run: (c) => c.fadeIn(L3) });
    steps.push({ cap: `${nx(c0)} °C = <b>${nx(f, 2)} °F</b>. The thermometer agrees: the same height on both scales.`,
      run: async (c) => { await th.go(c, c0, 900); await c.fadeIn(ln); await c.pop(res); } });
    return steps;
  }
};

/* ======================================================================================
 * 3. Why × 1.8 + 32: climb the thermometer from freezing (Full notes)
 * ====================================================================================== */
const whyF = {
  title: 'Climb from freezing',
  height: 430,
  minW: 900,
  choices: [{ v: 25, label: '25 °C' }, { v: 10, label: '10 °C' }, { v: -15, label: '−15 °C' }],
  ask: (c0) => `Why does ${T(`1.8\\times${par(c0)}+32`)} give ${nx(c0)} °C in °F? Climb the thermometer from freezing.`,
  make(stage, c0, ex) {
    const W = ex.W, up = c0 >= 0, dC = Math.abs(c0), dF = 1.8 * dC, f = toF(c0);
    const th = thermo(stage, { x: 20, y: 0, h: 340, cmin: -20, cmax: 40, cStep: 10, cMinor: 2, fStep: 10, fMinor: 2, padL: 96, padR: 96, level: -20 });
    const l0 = hide(th.line(0, '#1f5bd6')), l1 = hide(th.line(c0, '#9a6a24'));
    const bL = hide(th.brace(0, c0, 'L', '#9a3a12')), bR = hide(th.brace(0, c0, 'R', '#1f5bd6'));
    const ym = th.Y(c0 / 2);
    const pL = hide(add(stage, box(cbox('u4l3-bp l', `${up ? 'up' : 'down'} <b>${dC}</b>Celsius degrees`), 84, 80), 24, ym - 40));
    const pR = hide(add(stage, box(cbox('u4l3-bp r', `${up ? 'up' : 'down'} <b>${nx(dF)}</b>Fahrenheit degrees`), 88, 80), 20 + th.W - 88, ym - 40));
    const PX = 20 + th.W + 30, PW = W - PX - 16;
    const L = [
      `Start: 0 °C = <b>32 °F</b>`,
      `${up ? 'Up' : 'Down'} ${T(String(dC))} Celsius degrees`,
      `${T(`${dC}\\times1.8=${nt(dF)}`)} Fahrenheit degrees ${up ? 'up' : 'down'}`,
      `${T(up ? `32+${nt(dF)}=${nt(f)}` : `32-${nt(dF)}=${nt(f)}`)} so ${nx(c0)} °C = <b>${nx(f)} °F</b>`,
      `That is the formula: ${T(`1.8\\times${par(c0)}+32=${nt(f)}`)}`
    ].map((s, i) => hide(add(stage, box(WL('u4l3-wl' + (i === 4 ? ' hl' : ''), s), PW, 52), PX, 20 + i * 66)));
    return [
      { cap: 'Start at freezing: 0 °C is <b>32 °F</b>. (That is why we <b>add 32</b>.)', run: async (c) => { await th.go(c, 0, 700); await c.fadeIn(l0); await c.fadeIn(L[0]); } },
      { cap: `Go ${up ? 'up' : 'down'} <b>${dC} Celsius degrees</b> to ${nx(c0)} °C.`, run: async (c) => { bL.style.opacity = 1; await Promise.all([th.go(c, c0, 900), drawIn(bL, 900, c)]); await c.fadeIn(l1); await c.pop(pL); await c.fadeIn(L[1]); } },
      { cap: `Each Celsius degree is <b>1.8</b> Fahrenheit degrees: ${T(`${dC}\\times1.8=${nt(dF)}`)} Fahrenheit degrees. (That is why we <b>multiply by 1.8</b>.)`, run: async (c) => { bR.style.opacity = 1; await drawIn(bR, 800, c); await c.pop(pR); await c.fadeIn(L[2]); } },
      { cap: `From 32, go ${up ? 'up' : 'down'} ${nx(dF)}: <b>${nx(f)} °F</b>.`, run: (c) => c.fadeIn(L[3]) },
      { cap: `It is the same as the formula: ${T(`1.8\\times${par(c0)}+32=${nt(f)}`)}.`, run: (c) => c.pop(L[4]) }
    ];
  }
};

/* ======================================================================================
 * 4. The F → C undo machine
 * ====================================================================================== */
const FC = {
  a: { f: 86, what: '(a) A beach day in California', ex: 4 }, b: { f: 100, what: '(b) A very hot day', ex: 4 },
  c: { f: 0, what: '(c) A deep freezer', ex: 4 }, d: { f: -13, what: '(d) A winter night in Minnesota', ex: 4 },
  e: { f: 425, what: '(e) An oven for roasting', ex: 4 }, f: { f: 59, what: '(f) A cool fall morning', ex: 4 },
  e5a: { f: 375, what: '(a) Lucas’s cookies', ex: 5, dial: true }, e5b: { f: 165, what: '(b) Safe chicken', ex: 5, round: 0 }
};
const fToC = {
  title: 'Fahrenheit to Celsius: undo the steps',
  height: 440,
  minW: 900,
  choices: [{ sep: 'Example 4 check:' }, { v: 'a', label: '(a) 86 °F' }, { v: 'b', label: '(b) 100 °F' }, { v: 'c', label: '(c) 0 °F' }, { v: 'd', label: '(d) −13 °F' }, { v: 'e', label: '(e) 425 °F' }, { v: 'f', label: '(f) 59 °F' },
    { sep: 'Example 5:' }, { v: 'e5a', label: '(a) 375 °F oven' }, { v: 'e5b', label: '(b) 165 °F chicken' }],
  ask: (k) => `Example ${FC[k].ex}${FC[k].what.slice(0, 4)}: change <b>${nx(FC[k].f)} °F</b> to °C. Round to the nearest ${FC[k].round === 0 ? 'degree' : 'tenth'}.`,
  make(stage, k, ex) {
    const d = FC[k], f0 = d.f, s = f0 - 32, c0 = s / 1.8, W = ex.W, dp = d.round === 0 ? 0 : 1, cr = rnd(c0, dp);
    const exact = Math.abs(c0 - rnd(c0, 4)) < 1e-9 && Math.abs(c0 - cr) < 1e-9;
    const cShow = exact ? nt(c0, 4) : nt(c0, 2).replace(/(\.\d\d).*/, '$1') + '\\ldots';
    // the forward machine (faded) above, the undo machine below (right to left)
    const xs = [14, 184, 354, 524];
    const fw = h('div', 'u4l3-fwd'); box(fw, 650, 44); add(stage, fw, 14, 0);
    fw.innerHTML = '<span>°C</span><i>▶</i><b>× 1.8</b><i>▶</i><b>+ 32</b><i>▶</i><span>°F</span>';
    hide(fw);
    const Y = 54;
    const bD = hide(add(stage, box(cbox('u4l3-mbox rev', '<b>÷ 1.8</b>'), 130, 74), xs[1], Y));
    const bS = hide(add(stage, box(cbox('u4l3-mbox rev', '<b>− 32</b>'), 130, 74), xs[2], Y));
    const arr = [0, 1, 2].map((i) => hide(add(stage, box(h('div', 'u4l3-marr rev', '◀'), 40, 74), xs[i] + 130, Y)));
    const tok = hide(add(stage, box(cbox('u4l3-tok fah', `${nx(f0)} °F`), 130, 74), xs[3], Y));
    const mid = hide(add(stage, box(cbox('u4l3-tok mid', nx(s)), 130, 40), xs[2], Y + 78));
    const out = hide(add(stage, box(cbox('u4l3-tok cel', `${exact ? nx(c0) : '≈ ' + nx(cr, dp)} °C`), 130, 74), xs[0], Y));
    const L1 = hide(add(stage, box(WL('u4l3-wl', `Step 1: ${T(`${nt(f0)}-32=${nt(s)}`)}`), 640, 48), 20, 182));
    const L2 = hide(add(stage, box(WL('u4l3-wl', `Step 2: ${T(`${nt(s)}\\div1.8=${cShow}`)}`), 640, 48), 20, 232));
    const L3 = exact ? null : hide(add(stage, box(WL('u4l3-wl', `Round to the nearest ${dp ? 'tenth' : 'degree'}: ${T(`${cShow}\\approx${nt(cr, dp)}`)}`), 640, 48), 20, 282));
    const keys = `(${nx(f0)}−32)÷1.8`;
    const scr = hide(add(stage, lcd(keys, lcdStr(c0), 300), 20, 336));
    const res = hide(add(stage, box(cbox('u4l3-res', `${nx(f0)} °F ${exact ? '=' : '≈'} <b>${nx(cr, dp)} °C</b>`), 300, 60), 340, 344));
    let th = null, ln = null, dialG = null, dialRes = null;
    if (d.dial) {
      // Lucas's oven dial in °C, steps of 5 (labels every 50)
      const DX = W - 250, DCX = 120, DCY = 190, R = 105;
      const sv = svgEl('svg', { width: 240, height: 420, viewBox: '0 0 240 420', class: 'u4l3-dial' }); add(stage, sv, DX, 0);
      svgEl('rect', { x: 6, y: 50, width: 228, height: 290, rx: 24, fill: '#3a4254' }, sv);
      svgEl('circle', { cx: DCX, cy: DCY, r: R + 14, fill: '#e9e6dd' }, sv);
      const ang = (t) => -135 + (t - 50) / 200 * 270; // 50 °C at −135°, 250 °C at +135°
      for (let t = 50; t <= 250; t += 5) {
        const a = ang(t) * Math.PI / 180, maj = t % 50 === 0, r1 = R + 10, r2 = R + (maj ? -6 : 2);
        svgEl('line', { x1: DCX + r1 * Math.sin(a), y1: DCY - r1 * Math.cos(a), x2: DCX + r2 * Math.sin(a), y2: DCY - r2 * Math.cos(a), stroke: '#1c2230', 'stroke-width': maj ? 3 : 1.4 }, sv);
        if (maj) { const tt = svgEl('text', { x: DCX + (R - 26) * Math.sin(a), y: DCY - (R - 26) * Math.cos(a) + 6, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 800, fill: '#1c2230' }, sv); tt.textContent = t; }
      }
      dialG = svgEl('g', {}, sv); dialG.style.transformBox = 'view-box'; dialG.style.transformOrigin = `${DCX}px ${DCY}px`;
      svgEl('circle', { cx: DCX, cy: DCY, r: 34, fill: '#1c2230' }, dialG);
      svgEl('path', { d: `M${DCX - 6} ${DCY - 30} L${DCX} ${DCY - 66} L${DCX + 6} ${DCY - 30} Z`, fill: '#e8a01e' }, dialG);
      const lab = svgEl('text', { x: DCX, y: 380, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 800, fill: '#1c2230' }, sv); lab.textContent = 'Oven (°C)';
      dialG.style.transform = `rotate(${ang(50)}deg)`; dialG.ang = ang;
      dialRes = hide(add(stage, box(cbox('u4l3-res sm', 'Set to <b>190 °C</b>'), 220, 46), DX + 10, 386));
    } else {
      const R = rangeFor(c0); th = thermo(stage, Object.assign({ x: W - 250, y: 0, h: 330, padL: 10, padR: 30, level: R.cmin }, R)); ln = hide(th.line(c0, '#9a6a24'));
    }
    const steps = [
      { cap: '<b>Undo</b> the °C → °F machine: do the <b>opposite</b> steps in the <b>reverse</b> order. Subtract 32 first, then divide by 1.8.',
        run: async (c) => { await c.fadeIn(fw); for (const e of [bS, arr[2], bD, arr[1], arr[0]]) await c.fadeIn(e, 200); await c.pop(tok); } },
      { cap: `Step 1: subtract 32: ${T(`${nt(f0)}-32=${nt(s)}`)}.`,
        run: async (c) => { await c.anim(tok, [{ transform: 'none' }, { transform: `translateX(${xs[2] - xs[3]}px)`, opacity: 0.2 }], 600); tok.style.opacity = 0; await c.pop(mid); await c.fadeIn(L1); } },
      { cap: `Step 2: divide by 1.8: ${T(`${nt(s)}\\div1.8=${cShow}`)}.`,
        run: async (c) => { await c.anim(mid, [{ transform: 'none' }, { transform: `translateX(${xs[1] - xs[2]}px)`, opacity: 0.2 }], 600); mid.style.opacity = 0; await c.pop(out); await c.fadeIn(L2); } }
    ];
    if (L3) steps.push({ cap: `Round to the nearest ${dp ? 'tenth' : 'degree'}: ${T(`${cShow}\\approx${nt(cr, dp)}`)}.`, run: (c) => c.fadeIn(L3) });
    steps.push({ cap: `On the calculator, use <b>brackets</b>: ( ${nx(f0)} − 32 ) ÷ 1.8 ENTER. So ${nx(f0)} °F ${exact ? '=' : '≈'} <b>${nx(cr, dp)} °C</b>.`,
      run: async (c) => { await c.pop(scr); await c.pop(res); if (th) { await th.go(c, c0, 900); await c.fadeIn(ln); } } });
    if (d.dial) steps.push({ cap: 'His oven goes in steps of 5: 190.6 is closest to <b>190</b>. Set the dial to <b>190 °C</b>.',
      run: async (c) => { const a0 = dialG.ang(50), a1 = dialG.ang(190); await tween(c, 1200, (t) => { dialG.style.transform = `rotate(${lerp(a0, a1, t)}deg)`; }); await c.pop(dialRes); } });
    return steps;
  }
};

/* ======================================================================================
 * 5. Brackets on the calculator: the wrong order vs the right order
 * ====================================================================================== */
const BR = {
  body: { f: 98.6, what: 'normal body temperature', badW: 'hotter than a mug of hot chocolate, not a body', good: 'normal body temperature' },
  oven: { f: 375, what: 'Lucas’s cookie oven (Example 5)', badW: 'far hotter than a baking oven (about 180 °C)', good: 'a baking oven, close to 180 °C' }
};
const brackets = {
  title: 'Brackets: subtract first',
  height: 400,
  minW: 900,
  choices: [{ v: 'body', label: '98.6 °F (body)' }, { v: 'oven', label: 'Example 5(a): 375 °F' }],
  ask: (k) => `Change ${nx(BR[k].f)} °F (${BR[k].what}) to °C on the calculator. Which key presses are right?`,
  make(stage, k, ex) {
    const d = BR[k], W = ex.W, CW = (W - 60) / 2, q = 32 / 1.8, bad = d.f - q, good = (d.f - 32) / 1.8;
    const col = (x, ok) => {
      const head = add(stage, box(cbox('u4l3-wwh ' + (ok ? 'ok' : 'no'), ok ? '<b>With brackets</b>' : '<b>No brackets</b>'), CW, 40), x, 0);
      const s = add(stage, lcd(ok ? `(${d.f}−32)÷1.8` : `${d.f}−32÷1.8`, lcdStr(ok ? good : bad), 320), x + (CW - 320) / 2, 52);
      const w1 = add(stage, box(h('div', 'u4l3-wwc', ok ? `The brackets make it subtract first:<br>${T(`${nt(d.f)}-32=${nt(d.f - 32)}`)}, then ${T(`${nt(d.f - 32)}\\div1.8${Math.abs(good - rnd(good)) < 1e-9 ? '=' : '\\approx'}${nt(good)}`)}`
        : `It <b>divides first</b> (order of operations):<br>${T(`32\\div1.8\\approx17.8`)}, then ${T(`${nt(d.f)}-17.8\\approx${nt(bad)}`)}`), CW, 96), x, 146);
      const v = add(stage, box(h('div', 'u4l3-wwc', ok ? `${nx(good)} °C: ${d.good} ✓` : `${nx(bad)} °C? That is ${d.badW}.`), CW, 60), x, 248);
      const st = stamp(stage, ok ? 'Right ✓' : 'Wrong ✗', { ok, x: x + CW / 2, y: 350, rotate: ok ? -6 : 6 });
      return [head, s, w1, v, st].map((e) => hide(e));
    };
    const A = col(20, false), B = col(40 + CW, true);
    return [
      { cap: `Without brackets: ${d.f} − 32 ÷ 1.8 ENTER shows <b>${lcdStr(bad).slice(0, 6)}…</b>`, run: async (c) => { await c.fadeIn(A[0]); await c.pop(A[1]); } },
      { cap: 'Why? The calculator follows the <b>order of operations</b>: it divides <b>before</b> it subtracts.', run: (c) => c.fadeIn(A[2]) },
      { cap: `${nx(bad)} °C does not make sense for ${d.what}.`, run: async (c) => { await c.fadeIn(A[3]); await stampIn(c, A[4]); } },
      { cap: `With brackets: ( ${d.f} − 32 ) ÷ 1.8 ENTER subtracts first and shows <b>${lcdStr(good).slice(0, 6).replace(/\.$/, '')}</b>${Math.abs(good - rnd(good, 4)) < 1e-9 ? '' : '…'}.`, run: async (c) => { await c.fadeIn(B[0]); await c.pop(B[1]); await c.fadeIn(B[2]); } },
      { cap: `${nx(good)} °C is ${d.good}. That makes sense ✓`, run: async (c) => { await c.fadeIn(B[3]); await stampIn(c, B[4]); } }
    ];
  }
};

/* ======================================================================================
 * 6. The quick estimate vs the exact formula
 * ====================================================================================== */
const ES = {
  c: { f: 54, what: '(c) Seattle forecast', ok: true, why: 'Only 0.2 degrees off: good enough for weather. About 12 °C: a light jacket.' },
  d: { f: 450, what: '(d) Roasting vegetables', ok: false, why: 'About 22 degrees too low: the food would cook too slowly. Use the formula for ovens.' }
};
const estimate = {
  title: 'Quick estimate vs exact',
  height: 450,
  minW: 900,
  choices: [{ sep: 'Example 6 check:' }, { v: 'tab', label: '(a) The table' }, { v: 'c', label: '(c) 54 °F' }, { v: 'd', label: '(d) 450 °F' }],
  ask: (k) => (k === 'tab' ? 'Example 6(a): compare the estimate <b>2C + 30</b> with the exact <b>1.8C + 32</b>. Where is the estimate good?'
    : `Example 6${ES[k].what.slice(0, 3)}: estimate <b>${ES[k].f} °F</b> in °C, then find the exact value. Is the estimate good enough?`),
  make(stage, k, ex) {
    const W = ex.W;
    if (k !== 'tab') {
      const d = ES[k], e = (d.f - 30) / 2, x = toC(d.f), off = x - e, CW = (W - 60) / 2;
      const A = [
        add(stage, box(cbox('u4l3-wwh est', '<b>Estimate</b> (in your head)'), CW, 42), 20, 0),
        add(stage, box(WL('u4l3-wl cen', `Subtract 30, then halve:<br>${T(`(${d.f}-30)\\div2=${d.f - 30}\\div2=${nt(e)}`)} °C`), CW, 90), 20, 56)
      ].map((el) => hide(el));
      const B = [
        add(stage, box(cbox('u4l3-wwh ok', '<b>Exact</b> (the formula)'), CW, 42), 40 + CW, 0),
        add(stage, box(WL('u4l3-wl cen', `Subtract 32, then divide by 1.8:<br>${T(`(${d.f}-32)\\div1.8=${d.f - 32}\\div1.8\\approx${nt(x)}`)} °C`), CW, 90), 40 + CW, 56)
      ].map((el) => hide(el));
      // a gap bar: how far apart are they?
      const gap = hide(add(stage, box(cbox('u4l3-gapb', `Off by about <b>${nx(off)}</b> degree${Math.abs(rnd(off)) === 1 ? '' : 's'}`), 420, 56), (W - 420) / 2, 170));
      const why = hide(add(stage, box(cbox('u4l3-why', d.why), W - 80, 64), 40, 244));
      const st = hide(stamp(stage, d.ok ? 'Good enough ✓' : 'Use the formula ✗', { ok: d.ok, x: W / 2, y: 372, rotate: d.ok ? -5 : 5, size: 'lg' }));
      return [
        { cap: `Estimate: ${T(`(${d.f}-30)\\div2=${nt(e)}`)} °C.`, run: async (c) => { await c.fadeIn(A[0]); await c.fadeIn(A[1]); } },
        { cap: `Exact: ${T(`(${d.f}-32)\\div1.8\\approx${nt(x)}`)} °C.`, run: async (c) => { await c.fadeIn(B[0]); await c.fadeIn(B[1]); } },
        { cap: `How far apart? ${T(`${nt(x)}-${nt(e)}=${nt(off)}`)} degrees.`, run: (c) => c.pop(gap) },
        { cap: d.ok ? '<b>Yes</b>, good enough to choose a jacket.' : '<b>No</b>: for cooking, use the exact formula.', run: async (c) => { await c.fadeIn(why); await stampIn(c, st); } }
      ];
    }
    const G = new Graph(stage, { x: 4, y: 0, width: 520, height: 440, xmin: -30, xmax: 40, ymin: -30, ymax: 110, xstep: 10, ystep: 10, xlabels: 10, ylabels: 20, xtitle: '^\\circ\\text{C}', ytitle: '^\\circ\\text{F}', fontSize: 16, pad: [34, 18, 18, 18] });
    const fE = (c) => 1.8 * c + 32, fQ = (c) => 2 * c + 30;
    const lx = G.fn(fE, { color: 'blue', width: 4, arrows: false }), lq = G.fn(fQ, { color: 'orange', width: 4, arrows: false, dash: '10 7' });
    hide(lx, lq);
    const keyB = hide(add(stage, box(cbox('u4l3-key', '<span><i class="b"></i> exact <b>1.8C + 32</b><br><i class="o"></i> estimate <b>2C + 30</b></span>'), 220, 60), 296, 366));
    const rows = [-20, 0, 10, 20, 30, 200].map((c) => [c, fQ(c), fE(c), Math.abs(fQ(c) - fE(c))]);
    const tb = new ValueTable(stage, { x: 544, y: 0, headers: ['^\\circ\\text{C}', '2C+30', '1.8C+32', '\\text{off}'], rows, hide: (r, c) => c > 0, tap: false, cellW: 96, cellH: 50, cls: 'u4l3-vt' });
    const meet = hide(G.point(10, 50, { color: 'purple', r: 7 })), meetL = hide(G.label(10, 50, 'they meet at 10 °C', { pos: 'nw', cls: 'bk-ptlab', color: '#7b4fc4' }));
    const gaps = {};
    const gapAt = (c) => { const s = G.segment([c, fE(c)], [c, fQ(c)], { color: 'red', width: 5 }); hide(s); return s; };
    [-20, 0, 20, 30].forEach((c) => { gaps[c] = gapAt(c); });
    let g200 = null;
    return [
      { cap: 'The <b>exact</b> line, F = 1.8C + 32, in blue.', run: async (c) => { await c.fadeIn(keyB); lx.style.opacity = 1; await G.drawIn(lx, 900, c); } },
      { cap: 'The <b>estimate</b>, F ≈ 2C + 30, in orange.', run: async (c) => { lq.style.opacity = 1; await G.drawIn(lq, 900, c); } },
      { cap: 'Fill in the estimate and the exact value for each row.', run: async (c) => { await tb.fill(c, { col: 1, stagger: 80 }); await tb.fill(c, { col: 2, stagger: 80 }); } },
      { cap: 'At <b>10 °C</b> the lines meet: both give 50 °F. Off by <b>0</b>.', run: async (c) => { await c.pop(meet); await c.fadeIn(meetL); await tb.reveal(2, 3, c); tb.highlight(2, true); } },
      { cap: 'Near ordinary weather the lines stay close: off by <b>2</b> at 0 °C and 20 °C, <b>4</b> at 30 °C, <b>6</b> at −20 °C.',
        run: async (c) => { tb.highlight(2, false); for (const [cc, r] of [[0, 1], [20, 3], [30, 4], [-20, 0]]) { gaps[cc].style.opacity = 1; await G.drawIn(gaps[cc], 300, c); await tb.reveal(r, 3, c); } } },
      { cap: 'Far from 10 °C the gap grows. Zoom out to an oven at <b>200 °C</b>: 430 vs 392, off by <b>38</b>!',
        run: async (c) => { await c.anim(meetL, [{ opacity: 1 }, { opacity: 0 }], 250); G.o.xlabels = 50; G.o.ylabels = 100; await G.setWindow({ xmin: -30, xmax: 220, ymin: -40, ymax: 460, xscl: 50, yscl: 50 }, c, 1200); if (!g200) g200 = G.segment([200, fE(200)], [200, fQ(200)], { color: 'red', width: 6 }); await G.drawIn(g200, 400, c); await tb.reveal(5, 3, c); tb.highlight(5, true); } }
    ];
  }
};

/* ======================================================================================
 * 7. Compare on one thermometer (Full notes)
 * ====================================================================================== */
const CP = {
  a: { title: '(a) Edmonton and Minneapolis', cmin: -32, cmax: -18, cStep: 2, cMinor: 1, fStep: 5, fMinor: 1 },
  b: { title: '(b) The fridge', cmin: -2, cmax: 8, cStep: 1, cMinor: 0.5, fStep: 2, fMinor: 1 }
};
const compare = {
  title: 'Same scale, side by side',
  height: 440,
  minW: 900,
  choices: [{ sep: 'Example 7:' }, { v: 'a', label: '(a) −25 °C or −15 °F' }, { v: 'b', label: '(b) Fridge: 38 °F' }],
  ask: (k) => (k === 'a' ? 'Example 7(a): Edmonton is <b>−25 °C</b>, Minneapolis is <b>−15 °F</b>. Which is colder, and by how much?'
    : 'Example 7(b): a fridge should be <b>4 °C or colder</b>. The thermometer reads <b>38 °F</b>. Is it cold enough?'),
  make(stage, k, ex) {
    const d = CP[k], W = ex.W;
    const th = thermo(stage, Object.assign({ x: 20, y: 0, h: 340, padL: 30, padR: 30, level: d.cmin }, d));
    const PX = 20 + th.W + 6, PW = W - PX - 16;
    if (k === 'a') {
      const cm = toC(-15);
      const lE = hide(th.line(-25, '#9a3a12', { x2: th.W })), lM = hide(th.line(cm, '#1f5bd6', { x2: th.W }));
      const tE = hide(add(stage, box(cbox('u4l3-pin l', 'Edmonton −25 °C'), 150, 36), PX - 6, th.Y(-25) - 40));
      const tM = hide(add(stage, box(cbox('u4l3-pin r', 'Minneapolis −15 °F'), 180, 36), PX - 6, th.Y(cm) + 4));
      const L = [`Same scale first: ${T('(-15-32)\\div1.8')}`, `${T('=-47\\div1.8\\approx-26.1')} °C`, `${T('-26.1')} is lower than ${T('-25')}: <b>Minneapolis is colder</b>`, `by ${T('-25-(-26.1)=1.1')} Celsius degrees`]
        .map((s, i) => hide(add(stage, box(WL('u4l3-wl', s), PW - 200, 50), PX + 200, 40 + i * 64)));
      const b = hide(th.brace(-25, cm, 'R', '#c93a33'));
      return [
        { cap: 'Two scales: change −15 °F to °C first.', run: async (c) => { await c.fadeIn(L[0]); await c.fadeIn(L[1]); } },
        { cap: 'Mark Edmonton at −25 °C (left scale).', run: async (c) => { await th.go(c, -25, 800); await c.fadeIn(lE); await c.pop(tE); } },
        { cap: 'Mark Minneapolis at −15 °F (right scale). It is a little <b>lower</b>.', run: async (c) => { await th.go(c, cm, 600); await c.fadeIn(lM); await c.pop(tM); await c.fadeIn(L[2]); } },
        { cap: 'Minneapolis is colder by about <b>1.1 Celsius degrees</b>.', run: async (c) => { b.style.opacity = 1; await drawIn(b, 500, c); await c.fadeIn(L[3]); } }
      ];
    }
    const c38 = toC(38);
    const l4 = hide(th.line(4, '#12805a', { dash: '2 0', x2: th.W })), l38 = hide(th.line(c38, '#1f5bd6', { x2: th.W }));
    const t4 = hide(add(stage, box(cbox('u4l3-pin ok', 'safe line: 4 °C'), 160, 36), PX - 6, th.Y(4) - 40));
    const t38 = hide(add(stage, box(cbox('u4l3-pin r', 'fridge: 38 °F'), 150, 36), PX - 6, th.Y(c38) + 4));
    const L = [`Same scale first: ${T('(38-32)\\div1.8')}`, `${T('=6\\div1.8\\approx3.3')} °C`, '3.3 °C is <b>below</b> the 4 °C line']
      .map((s, i) => hide(add(stage, box(WL('u4l3-wl', s), PW - 200, 50), PX + 200, 40 + i * 64)));
    const st = hide(stamp(stage, 'Cold enough ✓', { ok: true, x: PX + 200 + (PW - 200) / 2, y: 290, rotate: -6 }));
    return [
      { cap: 'The rule: <b>4 °C or colder</b>. Draw the safe line.', run: async (c) => { await c.fadeIn(l4); await c.pop(t4); } },
      { cap: 'Change 38 °F to °C.', run: async (c) => { await c.fadeIn(L[0]); await c.fadeIn(L[1]); } },
      { cap: 'Mark 38 °F on the right scale: it is <b>below</b> the safe line.', run: async (c) => { await th.go(c, c38, 900); await c.fadeIn(l38); await c.pop(t38); await c.fadeIn(L[2]); } },
      { cap: '3.3 °C is colder than 4 °C. <b>Yes</b>, the fridge is cold enough.', run: (c) => stampIn(c, st) }
    ];
  }
};

/* ======================================================================================
 * 8. The chinook: a temperature change is only × 1.8
 * ====================================================================================== */
const chinook = {
  title: 'A chinook: the change in °F',
  height: 450,
  minW: 960,
  ask: 'Example 8: in Calgary it goes from <b>−21 °C</b> in the morning to <b>7 °C</b> in the afternoon. How much did it rise, in °C and in °F?',
  make(stage, v, ex) {
    const W = ex.W, SW = 330, SH = 290;
    // the scene: mountains, the chinook arch, the Calgary skyline, snow on the ground
    const sc = svgEl('svg', { width: SW, height: SH, viewBox: `0 0 ${SW} ${SH}`, class: 'u4l3-scene' }); add(stage, sc, 6, 6);
    const sky = svgEl('rect', { x: 0, y: 0, width: SW, height: SH, rx: 16, fill: '#9fb4c8' }, sc);
    const clouds = svgEl('rect', { x: 0, y: 0, width: SW, height: 112, rx: 16, fill: '#7d8794' }, sc);
    const arch = svgEl('path', { d: `M-10 120 Q ${SW / 2} 26 ${SW + 10} 120 L ${SW + 10} 120 Q ${SW / 2} 66 -10 120 Z`, fill: '#bfe0f7', opacity: 0 }, sc);
    svgEl('path', { d: 'M0 200 L50 118 L86 162 L128 98 L180 182 L204 156 L230 200 Z', fill: '#6f7f91' }, sc);
    svgEl('path', { d: 'M50 118 L63 137 L39 135 Z M128 98 L143 120 L113 118 Z', fill: '#fff' }, sc);
    const city = svgEl('g', { fill: '#3a4254' }, sc);
    [[196, 150, 18], [216, 120, 16], [236, 168, 22], [260, 98, 15], [278, 138, 20], [300, 158, 16], [318, 176, 12]].forEach(([x, y, w]) => svgEl('rect', { x, y, width: w, height: 232 - y }, city));
    svgEl('rect', { x: 264, y: 80, width: 6, height: 20 }, city); // the tower
    svgEl('circle', { cx: 267, cy: 84, r: 8 }, city);
    svgEl('rect', { x: 0, y: 228, width: SW, height: SH - 228, fill: '#f4f7fb' }, sc);
    const grass = svgEl('rect', { x: 0, y: 228, width: SW, height: SH - 228, fill: '#9c8a5c', opacity: 0 }, sc);
    const wind = svgEl('g', { stroke: '#fff', 'stroke-width': 4, 'stroke-linecap': 'round', fill: 'none', opacity: 0 }, sc);
    [[16, 146], [50, 170], [8, 194], [80, 134]].forEach(([x, y]) => svgEl('path', { d: `M${x} ${y} q 26 -11 52 0 t 52 0` }, wind));
    const flakes = svgEl('g', { fill: '#fff' }, sc);
    for (let i = 0; i < 16; i++) svgEl('circle', { cx: 12 + (i * 43) % SW, cy: 20 + (i * 71) % 196, r: 3 }, flakes);
    add(stage, box(cbox('u4l3-pin l', 'Morning: −21 °C'), 158, 38), 6, SH + 18);
    const tag2 = hide(add(stage, box(cbox('u4l3-pin r', 'Afternoon: 7 °C'), 158, 38), 176, SH + 18));
    // the thermometer
    const TX = 6 + SW + 8;
    const th = thermo(stage, { x: TX, y: 0, h: 340, cmin: -30, cmax: 15, cStep: 5, cMinor: 1, fStep: 10, fMinor: 2, padL: 56, padR: 56, level: -21 });
    const lA = hide(th.line(-21, '#1f5bd6')), l0 = hide(th.line(0, '#9aa0ab')), lB = hide(th.line(7, '#c93a33'));
    const b1 = hide(th.brace(-21, 0, 'L', '#1f5bd6')), b2 = hide(th.brace(0, 7, 'L', '#c93a33'));
    const p1 = hide(add(stage, box(cbox('u4l3-bp l sm', '<b>21</b>up to 0'), 48, 56), TX + 1, th.Y(-10.5) - 28));
    const p2 = hide(add(stage, box(cbox('u4l3-bp l sm', '<b>7</b>past 0'), 48, 50), TX + 1, th.Y(3.5) - 25));
    const bF = hide(th.brace(-21, 7, 'R', '#9a6a24'));
    const pF = hide(add(stage, box(cbox('u4l3-bp r sm', '<b>50.4</b>F degrees'), 50, 56), TX + th.W - 51, th.Y(-7) - 28));
    const PX = TX + th.W + 8, PW = W - PX - 6;
    const L = [
      `(a) ${T('7-(-21)=28')}<br>28 Celsius degrees`,
      `(b) ${T('1.8\\times28=50.4')}<br>50.4 Fahrenheit degrees`,
      `(c) ${T('-21')} °C = ${T('-5.8')} °F<br>7 °C = 44.6 °F<br>${T('44.6-(-5.8)=50.4')} ✓`
    ].map((s, i) => hide(add(stage, box(WL('u4l3-wl sm', s), PW, i === 2 ? 96 : 66), PX, [0, 74, 148][i])));
    const bad = hide(add(stage, box(WL('u4l3-wl sm no', `${T('50.4+32=82.4')}?<br>Far too big!`), PW, 64), PX, 256));
    const st = hide(stamp(stage, 'No + 32 ✗', { ok: false, x: PX + PW / 2, y: 372, rotate: 6 }));
    return [
      { cap: 'Morning in Calgary: <b>−21 °C</b>. Snow on the ground.', run: (c) => c.fadeIn(lA) },
      { cap: 'A <b>chinook</b> blows down from the Rockies. The warm wind melts the snow. By the afternoon it is <b>7 °C</b>.',
        run: async (c) => {
          await Promise.all([th.go(c, 7, 2200), tween(c, 2200, (t) => { arch.setAttribute('opacity', t); wind.setAttribute('opacity', Math.min(1, Math.sin(t * Math.PI) * 0.9 + (t > 0.5 ? 0.3 : 0))); flakes.setAttribute('opacity', 1 - t); grass.setAttribute('opacity', t * 0.85); sky.setAttribute('fill', t > 0.5 ? '#8cc4ec' : '#9fb4c8'); clouds.setAttribute('fill', t > 0.5 ? '#9aa6b4' : '#7d8794'); })]);
          await c.fadeIn(lB); await c.pop(tag2);
        } },
      { cap: '(a) Count up to 0, then past it: 21 degrees up to 0, then 7 more. <b>28 Celsius degrees</b>.',
        run: async (c) => { await c.fadeIn(l0); b1.style.opacity = 1; await drawIn(b1, 500, c); await c.pop(p1); b2.style.opacity = 1; await drawIn(b2, 400, c); await c.pop(p2); await c.fadeIn(L[0]); } },
      { cap: `(b) A <b>change</b> is only × 1.8: ${T('1.8\\times28=50.4')} Fahrenheit degrees. No + 32!`,
        run: async (c) => { bF.style.opacity = 1; await drawIn(bF, 600, c); await c.pop(pF); await c.fadeIn(L[1]); } },
      { cap: `(c) Check: change both readings to °F and subtract: ${T('44.6-(-5.8)=50.4')} ✓`,
        run: (c) => c.fadeIn(L[2]) },
      { cap: `Watch out: adding 32 to a change gives ${T('82.4')}. That is far too big.`, run: async (c) => { await c.fadeIn(bad); await stampIn(c, st); } }
    ];
  }
};

/* ======================================================================================
 * 9. Where the scales meet: −40 (Full notes)
 * ====================================================================================== */
const minus40 = {
  title: 'Where the scales meet',
  height: 430,
  minW: 900,
  ask: 'Go down 10 Celsius degrees at a time. When do °C and °F show the same number?',
  make(stage, v, ex) {
    const W = ex.W, cs = [20, 10, 0, -10, -20, -30, -40];
    const rows = cs.map((c) => [c, toF(c), toF(c) - c]);
    const tb = new ValueTable(stage, { x: 30, y: 0, headers: ['^\\circ\\text{C}', '^\\circ\\text{F}', '\\text{°F} - \\text{°C}'].map((s, i) => (i === 2 ? { html: 'the gap' } : s)), rows, hide: (r, c) => c > 0, tap: false, cellW: 150, cellH: 50, cls: 'u4l3-vt' });
    const PX = 30 + 450 + 50, PW = W - PX - 20;
    const n1 = hide(add(stage, box(WL('u4l3-wl', '°C goes down <b>10</b> each row.<br>°F goes down <b>18</b> each row.'), PW, 84), PX, 20));
    const n2 = hide(add(stage, box(WL('u4l3-wl', 'So the gap shrinks by <b>8</b> each row:<br>48, 40, 32, 24, 16, 8, <b>0</b>.'), PW, 84), PX, 120));
    const n3 = hide(add(stage, box(WL('u4l3-wl hl', `Check: ${T('1.8\\times(-40)+32')}<br>${T('=-72+32=-40')} ✓`), PW, 84), PX, 230));
    const st = hide(stamp(stage, '−40 °C = −40 °F', { ok: true, x: PX + PW / 2, y: 370, rotate: -5 }));
    return [
      { cap: 'Change each temperature to °F.', run: (c) => tb.fill(c, { col: 1, stagger: 90 }) },
      { cap: 'Celsius steps down by 10. Fahrenheit steps down by <b>18</b> (10 × 1.8).', run: (c) => c.fadeIn(n1) },
      { cap: 'The gap between them shrinks by 8 every row…', run: async (c) => { await tb.fill(c, { col: 2, stagger: 120 }); await c.fadeIn(n2); } },
      { cap: '…until the gap is <b>0</b>: at <b>−40</b>, both scales say the same number.', run: async (c) => { tb.highlight(6, true); await c.fadeIn(n3); await stampIn(c, st); } }
    ];
  }
};

mountExplainers({ scales, cToF, whyF, fToC, brackets, estimate, compare, chinook, minus40 });

/* ======================================================================================
 * The hands-on double thermometer: drag the red line, or tap a referent / an Example 1 button
 * ====================================================================================== */
function handsOn() {
  const host = document.getElementById('u4l3-dt'); if (!host) return;
  const wrap = h('div', 'u4l3-dtw'); host.appendChild(wrap);
  const thHost = h('div', 'u4l3-dtth'); thHost.setAttribute('data-tap', ''); wrap.appendChild(thHost);
  const th = thermo(null, { h: 440, cmin: -40, cmax: 200, cStep: 20, cMinor: 5, fStep: 40, fMinor: 10, padL: 10, padR: 10, font: 17, level: 21, knob: true });
  thHost.appendChild(th.el);
  const side = h('div', 'u4l3-dts'); wrap.appendChild(side);
  const read = h('div', 'u4l3-read'); side.appendChild(read);
  const note = h('div', 'u4l3-rnote'); side.appendChild(note);
  const mk = (cls, lab, fn) => { const b = h('button', 'pill small ' + cls, lab); b.type = 'button'; b.onclick = fn; return b; };
  let given = 'C', val = 21, hideOther = false, tok = 0;
  const show = () => {
    const c = given === 'C' ? val : toC(val), f = given === 'C' ? toF(val) : val;
    const cs = `${nx(c)} °C`, fs = `${nx(f)} °F`, q = '<span class="q">?</span>';
    read.innerHTML = given === 'C' ? `<b class="cel">${cs}</b><i>=</i><b class="fah">${hideOther ? q : fs}</b>` : `<b class="fah">${fs}</b><i>=</i><b class="cel">${hideOther ? q : cs}</b>`;
  };
  const goTo = (c, label) => {
    const my = ++tok, a = th.level;
    note.innerHTML = label || '';
    tween(liveCtx(), 700, (t) => { if (my !== tok) return false; th.set(lerp(a, c, t)); });
  };
  const REF = [['Water boils', 100], ['Hot oven', 180], ['Body', 37], ['Room', 21], ['Water freezes', 0], ['Very cold day', -40]];
  const g1 = h('div', 'u4l3-btns'); g1.appendChild(h('div', 'u4l3-bh', 'Referents'));
  REF.forEach(([lab, c]) => g1.appendChild(mk('', lab, () => { given = 'C'; val = c; show(); goTo(c, `<b>${lab}</b>`); })));
  side.appendChild(g1);
  const g2 = h('div', 'u4l3-btns'); g2.appendChild(h('div', 'u4l3-bh', 'Example 1(a) check'));
  [['(i) 10 °C', 'C', 10], ['(ii) 80 °F', 'F', 80], ['(iii) −20 °C', 'C', -20]].forEach(([lab, s, v]) => g2.appendChild(mk('', lab, () => { given = s; val = v; show(); goTo(s === 'C' ? v : toC(v), `Example 1(a) ${lab.slice(0, lab.indexOf(')') + 1)}: read across to the other scale.`); })));
  side.appendChild(g2);
  const tg = mk('u4l3-hide', 'Hide the other scale’s number', () => { hideOther = !hideOther; tg.setAttribute('aria-pressed', String(hideOther)); tg.textContent = hideOther ? 'Show the other scale’s number' : 'Hide the other scale’s number'; show(); });
  tg.setAttribute('aria-pressed', 'false'); side.appendChild(tg);
  // drag
  const fromEvent = (e) => { const r = th.el.getBoundingClientRect(), sy = (e.clientY - r.top) * (th.H / r.height); const c = 200 - (sy - th.top) / (th.bot - th.top) * 240; return Math.max(-40, Math.min(200, Math.round(c))); };
  let drag = false;
  thHost.addEventListener('pointerdown', (e) => { drag = true; thHost.setPointerCapture(e.pointerId); tok++; given = 'C'; val = fromEvent(e); th.set(val); note.innerHTML = ''; show(); e.preventDefault(); });
  thHost.addEventListener('pointermove', (e) => { if (!drag) return; given = 'C'; val = fromEvent(e); th.set(val); show(); });
  const end = () => { drag = false; };
  thHost.addEventListener('pointerup', end); thHost.addEventListener('pointercancel', end);
  note.innerHTML = '<b>Room</b>'; show();
}
handsOn();

/* ======================================================================================
 * Math History: Celsius's upside-down scale
 * ====================================================================================== */
function histAnim() {
  const svg = document.getElementById('u4l3-hist'); if (!svg) return;
  const NS = 'http://www.w3.org/2000/svg', mk = (t, a, p = svg) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); p.appendChild(e); return e; };
  mk('rect', { x: 0, y: 0, width: 600, height: 300, rx: 14, fill: '#fffaf1' });
  const cap = mk('text', { x: 300, y: 36, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 23, fill: '#4a2c14' });
  // the thermometer
  const tx = 300, top = 60, bot = 214;
  mk('rect', { x: tx - 12, y: top - 10, width: 24, height: bot - top + 24, rx: 12, fill: '#fff', stroke: '#4a2c14', 'stroke-width': 3 });
  mk('circle', { cx: tx, cy: bot + 26, r: 18, fill: '#b0563a', stroke: '#4a2c14', 'stroke-width': 3 });
  const liq = mk('rect', { x: tx - 5, y: 150, width: 10, height: bot + 26 - 150, fill: '#b0563a' });
  [top, bot].forEach((y) => mk('line', { x1: tx - 30, x2: tx + 30, y1: y, y2: y, stroke: '#4a2c14', 'stroke-width': 3 }));
  const word = (y, s) => { const t = mk('text', { x: tx + 46, y: y + 7, 'font-family': 'Georgia, serif', 'font-size': 19, fill: '#7a4a26' }); t.textContent = s; return t; };
  word(top, 'water boils'); word(bot, 'water freezes');
  const nTop = mk('text', { x: tx - 46, y: top + 9, 'text-anchor': 'end', 'font-family': 'Georgia, serif', 'font-size': 28, 'font-weight': 700, fill: '#4a2c14' });
  const nBot = mk('text', { x: tx - 46, y: bot + 9, 'text-anchor': 'end', 'font-family': 'Georgia, serif', 'font-size': 28, 'font-weight': 700, fill: '#4a2c14' });
  const yr = mk('text', { x: 90, y: 160, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 34, fill: '#b07a12' });
  const foot = mk('text', { x: 300, y: 292, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 17, fill: '#7a4a26' });
  const CAPS = [[0, 'Celsius, 1742: boiling is 0, freezing is 100'], [4.6, 'Not long after 1744: flip it!'], [8, 'Today: freezing 0, boiling 100']];
  const clamp = (t) => Math.max(0, Math.min(1, t)), ease = (t) => t * t * (3 - 2 * t);
  const draw = (s) => {
    let c = CAPS[0][1]; for (const [t0, txt] of CAPS) if (s >= t0) c = txt; cap.textContent = c;
    const fl = ease(clamp((s - 5) / 1.6));                        // the labels swap places
    const sc = Math.cos(fl * Math.PI);                            // flip like a card
    nTop.textContent = fl < 0.5 ? '0' : '100'; nBot.textContent = fl < 0.5 ? '100' : '0';
    [nTop, nBot].forEach((n) => { n.setAttribute('transform', `translate(0 ${n === nTop ? top : bot}) scale(1 ${Math.abs(sc) < 0.05 ? 0.05 : Math.abs(sc)}) translate(0 ${-(n === nTop ? top : bot)})`); });
    yr.textContent = s < 4.6 ? '1742' : 'today';
    // the liquid rises and falls with a "warmer day" each phase: in 1742 a warm day had a SMALL number
    const lv = 140 - 20 * Math.sin(clamp(s / 4) * Math.PI);
    liq.setAttribute('y', lv); liq.setAttribute('height', bot + 26 - lv);
    foot.textContent = s < 4.6 ? 'On the old scale, a warmer day had a smaller number.' : s >= 8 ? 'Each degree is the same size. Only the direction changed.' : '';
  };
  let raf = 0;
  const play = () => {
    cancelAnimationFrame(raf);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { draw(11); return; }
    const t0 = performance.now(); const tick = (now) => { const s = (now - t0) / 1000; draw(s); if (s < 10.5) raf = requestAnimationFrame(tick); }; raf = requestAnimationFrame(tick);
  };
  draw(11);
  svg.addEventListener('click', play);
  const btn = svg.closest('.hist-anim') && svg.closest('.hist-anim').querySelector('.hist-play'); if (btn) btn.addEventListener('click', play);
  let seen = false;
  new IntersectionObserver((es) => { es.forEach((e) => { if (e.isIntersecting && !seen) { seen = true; play(); } }); }, { threshold: 0.5 }).observe(svg);
}
histAnim();

/* ============ Stand Up Break! — change temperatures both ways, compare, and changes ============ */
{
  const deg = (v, u) => `${nt(v)}^\\circ\\text{${u}}`;
  const PLACES = ['Phoenix', 'Chicago', 'Denver', 'Boston', 'Seattle', 'Miami', 'Anchorage', 'Fargo'];
  standup('u4l3', {
    intro: 'Write the formula first. Show both steps. Estimate to check your answer.',
    levels: {
      BEG: (r) => { // °C → °F with friendly numbers
        const c = r.pick([-30, -25, -20, -15, -10, -5, 5, 10, 15, 20, 25, 30, 35, 40]), m = 1.8 * c, f = toF(c);
        return { text: 'Change to degrees Fahrenheit.', q: `${deg(c, 'C')}\\ \\text{to}\\ ^\\circ\\text{F}`, a: [`F=1.8\\times${par(c)}+32`, `=${nt(m)}+32`, `=${deg(f, 'F')}`] };
      },
      PRG: (r) => { // °F → °C to the nearest tenth
        let f; do { f = r.int(-20, 110); } while (f === 32);
        const s = f - 32, c = s / 1.8;
        return { text: 'Change to degrees Celsius. Round to the nearest tenth.', q: `${deg(f, 'F')}\\ \\text{to}\\ ^\\circ\\text{C}`, a: [`C=(${nt(f)}-32)\\div1.8`, `=${nt(s)}\\div1.8`, `\\approx${deg(rnd(c), 'C')}`] };
      },
      MAS: (r) => r.pick([
        () => { // compare two cities
          const place = r.pick(PLACES), cA = r.int(-25, 30); let fB; do { fB = Math.round(toF(cA) + r.pick([-1, 1]) * r.int(2, 9)); } while (fB === Math.round(toF(cA)));
          const cB = rnd(toC(fB)), colder = cB < cA ? place : 'Calgary', diff = Math.abs(cB - cA);
          return { text: `On the same day it is <b>${nx(cA)} °C</b> in Calgary and <b>${nx(fB)} °F</b> in ${place}. Which city is colder, and by how many Celsius degrees?`, q: '',
            a: [`(${nt(fB)}-32)\\div1.8\\approx${deg(rnd(cB), 'C')}`, `\\text{${colder} is colder, by about ${nx(rnd(diff))} Celsius degrees}`] };
        },
        () => { // a temperature change
          const a = r.int(-30, -5), b = r.int(1, 15), d = b - a;
          return { text: `A chinook: the temperature rises from <b>${nx(a)} °C</b> to <b>${b} °C</b>. By how many Celsius degrees did it rise? By how many Fahrenheit degrees?`, q: '',
            a: [`${b}-(${a})=${d}\\text{ Celsius degrees}`, `1.8\\times${d}=${nt(1.8 * d)}\\text{ Fahrenheit degrees (no }+32\\text{)}`] };
        }
      ])()
    }
  });
}
