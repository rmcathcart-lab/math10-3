/* Math 10-3 · Unit 3 · Lesson 5 — Converting Length Between SI and Imperial.
 * Card tool: a draggable two-edged ruler (inches on top, centimetres below).
 * Explainers: the conversion facts side by side (ruler, foot vs 30 cm, yard vs metre, mile vs km), which is longer?
 * (Example 1a), quick estimates (Example 1b), the unit-factor machine (Example 2), bigger or smaller? (Full notes),
 * heights in feet and inches (Example 4), Devon's SUV at the parkade (Example 5), the inch tape in sixteenths
 * (Example 6), US road signs to km and km/h (Example 7) and Mei's fabric (Example 8). Then the Stand Up Break. */
import { h, add, box, tex, svgEl, tween, pulse, stamp, stampIn, mountExplainers } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const rnd = (v, d = 2) => Math.round((v + (v >= 0 ? 1e-9 : -1e-9)) * 10 ** d) / 10 ** d;
const fx = (v, d = 2) => rnd(v, d).toFixed(d);
const cbox = (cls, html) => h('div', cls + ' u3l5-c', `<div>${html}</div>`);
const lcd = (stage, e, r, x, y, w = 270) => hide(add(stage, box(h('div', 'u3l5-lcd', `<div class="e">${e}</div><div class="r">${r}</div>`), w, 66), x, y));
const mkSvg = (stage, w, hh, x, y) => add(stage, svgEl('svg', { width: w, height: hh, viewBox: `0 0 ${w} ${hh}`, class: 'u3l5-svg' }), x, y);
const txt = (svg, x, y, s, a = {}) => { const e = svgEl('text', Object.assign({ x, y, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 700, fill: '#1c2230' }, a), svg); e.textContent = s; return e; };
const ok = (host, s, x, y, o = {}) => hide(stamp(host, s, Object.assign({ x, y, size: 'sm' }, o)));
const IMP = '#9a6a24', IMPD = '#6e4a1c', SI = '#1f5bd6', RED = '#c93a33';

/* inch ticks (eighths or sixteenths) and centimetre ticks (millimetres) along a ruler edge */
function inchTicks(g, x0, y, pin, from, to, dir, o = {}) {
  const sub = o.sub || 8, hs = sub === 16 ? [12, 20, 30, 42, 58] : [10, 16, 24, 34];
  for (let i = Math.round(from * sub); i <= Math.round(to * sub); i++) {
    const k = i % sub === 0 ? hs.length - 1 : i % (sub / 2) === 0 ? hs.length - 2 : i % (sub / 4) === 0 ? hs.length - 3 : (sub === 16 && i % 2 === 0) ? 1 : 0;
    const x = x0 + (i / sub - from) * pin, hh = hs[k];
    svgEl('line', { x1: x, y1: y, x2: x, y2: y + dir * hh, stroke: IMPD, 'stroke-width': k === hs.length - 1 ? 2.5 : 1.6 }, g);
    if (i % sub === 0 && o.labels !== false && (!o.every || (i / sub) % o.every === 0)) txt(g, x + (i === Math.round(to * sub) && o.endLeft ? -12 : 0), y + dir * (hh + 6) + (dir > 0 ? 14 : 0), String(i / sub), { fill: IMPD, 'font-size': 17, 'font-weight': 800 });
  }
}
function cmTicks(g, x0, y, pcm, from, to, dir, o = {}) {
  for (let mm = Math.ceil(from * 10 - 1e-9); mm <= Math.floor(to * 10 + 1e-9); mm++) {
    const x = x0 + (mm / 10 - from) * pcm, big = mm % 10 === 0, mid = mm % 5 === 0, hh = big ? 26 : mid ? 18 : 10;
    if (o.noMm && !big) continue;
    svgEl('line', { x1: x, y1: y, x2: x, y2: y + dir * hh, stroke: SI, 'stroke-width': big ? 2.2 : 1.2 }, g);
    if (big && (!o.every || (mm / 10) % o.every === 0)) txt(g, x, y + dir * (hh + 6) + (dir > 0 ? 14 : 0), String(mm / 10), { fill: SI, 'font-size': 16, 'font-weight': 800 });
  }
}

/* =====================================================================================
 * Card tool: drag the red line along a two-edged ruler
 * ===================================================================================== */
function dragRuler() {
  const host = document.getElementById('u3l5-rul'), out = document.getElementById('u3l5-rread'); if (!host) return;
  const W = 940, H = 196, X0 = 40, MAXIN = 6, pin = (W - 2 * X0) / MAXIN, pcm = pin / 2.54;
  const S = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, width: '100%', class: 'u3l5-rsvg' }, host);
  svgEl('rect', { x: X0 - 20, y: 14, width: W - 2 * X0 + 40, height: 168, rx: 8, fill: '#fff8e6', stroke: '#8a6a10', 'stroke-width': 3 }, S);
  inchTicks(S, X0, 14, pin, 0, MAXIN, 1, { sub: 16 });
  cmTicks(S, X0, 182, pcm, 0, MAXIN * 2.54, -1);
  txt(S, W - 12, 36, 'in', { fill: IMPD, 'font-size': 16, 'font-weight': 900 });
  txt(S, W - 12, 172, 'cm', { fill: SI, 'font-size': 16, 'font-weight': 900 });
  const mk = svgEl('g', {}, S);
  svgEl('rect', { x: -16, y: 4, width: 32, height: 188, fill: 'transparent' }, mk);
  svgEl('line', { x1: 0, y1: 6, x2: 0, y2: 190, stroke: RED, 'stroke-width': 4 }, mk);
  svgEl('circle', { cx: 0, cy: 118, r: 11, fill: RED, stroke: '#fff', 'stroke-width': 3 }, mk);
  let v = 1;
  const frac = (n16) => { const w = Math.floor(n16 / 16); let r = n16 % 16, d = 16; while (r && r % 2 === 0) { r /= 2; d /= 2; } return r ? (w ? `${w}\\tfrac{${r}}{${d}}` : `\\tfrac{${r}}{${d}}`) : String(w); };
  const set = (inch) => {
    const n16 = Math.max(0, Math.min(MAXIN * 16, Math.round(inch * 16))); v = n16 / 16;
    mk.setAttribute('transform', `translate(${X0 + v * pin} 0)`);
    out.innerHTML = `${T(frac(n16))} in &nbsp;=&nbsp; ${T(String(rnd(v * 2.54, 3)))} cm`;
  };
  const toIn = (e) => { const r = S.getBoundingClientRect(); return ((e.clientX - r.left) * W / r.width - X0) / pin; };
  let drag = false;
  S.addEventListener('pointerdown', (e) => { drag = true; S.setPointerCapture(e.pointerId); set(toIn(e)); e.preventDefault(); });
  S.addEventListener('pointermove', (e) => { if (drag) set(toIn(e)); });
  const up = () => { drag = false; };
  S.addEventListener('pointerup', up); S.addEventListener('pointercancel', up);
  set(1);
}

/* =====================================================================================
 * 1. The conversion facts, side by side
 * ===================================================================================== */
const facts = {
  title: 'The conversion facts, side by side',
  height: 380, minW: 900,
  choices: [{ v: 'in', label: '1 inch' }, { v: 'ft', label: '1 foot' }, { v: 'yd', label: '1 yard or 1 metre' }, { v: 'mi', label: '1 mile or 1 km' }],
  ask: (k) => ({ in: 'How many centimetres long is <b>1 inch</b>?', ft: 'A school ruler is <b>30 cm</b>. Is that a whole <b>foot</b>?', yd: 'Which is longer: a <b>yardstick</b> or a <b>metre stick</b>?', mi: 'How many kilometres is <b>1 mile</b>?' }[k]),
  make(stage, k, ex) {
    const W = ex.W, S = mkSvg(stage, W, 380, 0, 0), X0 = 60;
    const fact = (html) => hide(add(stage, box(cbox('u3l5-fact', html), W - 80, 66), 40, 300));
    if (k === 'in') {
      const L = W - 2 * X0, pin = L / 4, pcm = pin / 2.54, g = svgEl('g', {}, S);
      svgEl('rect', { x: X0 - 24, y: 70, width: L + 48, height: 140, rx: 10, fill: '#fff8e6', stroke: '#8a6a10', 'stroke-width': 3 }, g);
      inchTicks(g, X0, 70, pin, 0, 4, 1, { sub: 8 }); cmTicks(g, X0, 210, pcm, 0, 10.16, -1);
      txt(g, X0 + L + 8, 96, 'in', { fill: IMPD, 'font-size': 16, 'font-weight': 900, 'text-anchor': 'start' });
      txt(g, X0 + L + 8, 196, 'cm', { fill: SI, 'font-size': 16, 'font-weight': 900, 'text-anchor': 'start' });
      hide(g);
      const mkw = svgEl('g', {}, S), mk = svgEl('line', { x1: 0, y1: 58, x2: 0, y2: 222, stroke: RED, 'stroke-width': 4 }, mkw); mk.setAttribute('transform', `translate(${X0} 0)`); hide(mkw);
      const t1 = hide(add(stage, box(h('div', 'u3l5-tag imp', '1 in'), 90, 36), X0 + pin - 45, 18));
      const t2 = hide(add(stage, box(h('div', 'u3l5-tag si', '2.54 cm'), 120, 36), X0 + pin - 60, 230));
      const f = fact(`${T('1\\text{ in}=2.54\\text{ cm}')} <b>exactly</b>. About 2.5 cm: the width of your thumb.`);
      return [
        { cap: 'A ruler with <b>inches</b> on the top edge and <b>centimetres</b> on the bottom edge.', run: (c) => c.fadeIn(g) },
        { cap: 'Slide the red line to <b>1 inch</b> on the top edge.', run: async (c) => { await c.fadeIn(mkw, 200); await tween(c, 1000, (t) => mk.setAttribute('transform', `translate(${X0 + pin * t} 0)`)); await c.pop(t1); } },
        { cap: 'Look down at the bottom edge: the line is at <b>2.54 cm</b>.', run: (c) => c.pop(t2) },
        { cap: `${T('1\\text{ in}=2.54\\text{ cm}')} exactly. Each inch is a bit more than <b>2.5 cm</b>.`, run: (c) => c.pop(f) }
      ];
    }
    if (k === 'ft' || k === 'yd') {
      const ft = k === 'ft', topIn = ft ? 12 : 36, botCm = ft ? 30 : 100, maxIn = ft ? 12 : 39.37;
      const L = W - 200, pin = L / maxIn, pcm = pin / 2.54;
      const a = svgEl('g', {}, S), b = svgEl('g', {}, S);
      svgEl('rect', { x: X0, y: 50, width: topIn * pin, height: 64, rx: 4, fill: '#f6dfae', stroke: IMP, 'stroke-width': 3 }, a);
      inchTicks(a, X0, 50, pin, 0, topIn, 1, { sub: ft ? 4 : 1, every: ft ? 1 : 6, endLeft: true });
      txt(a, X0 + topIn * pin + 12, 90, ft ? '1 ft ruler (12 in)' : 'yardstick (36 in)', { fill: IMPD, 'font-size': 17, 'text-anchor': 'start' });
      svgEl('rect', { x: X0, y: 170, width: botCm * pcm, height: 64, rx: 4, fill: '#cfe0fb', stroke: SI, 'stroke-width': 3 }, b);
      cmTicks(b, X0, 170, pcm, 0, botCm, 1, { noMm: true, every: ft ? 5 : 10 });
      txt(b, X0 + botCm * pcm + (ft ? 16 : 28), 210, ft ? '30 cm ruler' : 'metre stick', { fill: SI, 'font-size': 17, 'text-anchor': 'start' });
      hide(a); b.style.opacity = 0;
      const x1 = X0 + Math.min(topIn * pin, botCm * pcm), x2 = X0 + Math.max(topIn * pin, botCm * pcm);
      const gap = svgEl('g', {}, S);
      svgEl('rect', { x: x1, y: 46, width: x2 - x1, height: 192, fill: RED, opacity: 0.12 }, gap);
      svgEl('line', { x1, y1: 142, x2, y2: 142, stroke: RED, 'stroke-width': 3 }, gap);
      svgEl('line', { x1, y1: 132, x2: x1, y2: 152, stroke: RED, 'stroke-width': 3 }, gap); svgEl('line', { x1: x2, y1: 132, x2, y2: 152, stroke: RED, 'stroke-width': 3 }, gap);
      hide(gap);
      const gl = hide(add(stage, box(h('div', 'u3l5-tag rd', ft ? '0.48 cm short' : 'about 3.37 in longer'), ft ? 150 : 210, 34), ft ? x2 - 156 : x2 - 104, 248));
      const f = fact(ft ? `${T('1\\text{ ft}=12\\text{ in}=30.48\\text{ cm}')}. A 30 cm ruler is <b>just under</b> 1 ft. Estimate: about 30 cm.`
        : `${T('1\\text{ yd}=0.9144\\text{ m}')}, and ${T('1\\text{ m}\\approx3.28\\text{ ft}\\approx39.37\\text{ in}')}. A metre is a bit <b>more</b> than a yard.`);
      return [
        { cap: ft ? 'A <b>1 ft</b> ruler: 12 inches.' : 'A <b>yardstick</b>: 3 ft, or 36 inches.', run: (c) => c.fadeIn(a) },
        { cap: ft ? 'A school ruler: <b>30 cm</b>. Line it up at 0.' : 'A <b>metre stick</b>: 100 cm. Line it up at 0.', run: (c) => c.anim(b, [{ opacity: 0, transform: 'translateX(-60px)' }, { opacity: 1, transform: 'none' }], 700) },
        { cap: ft ? 'The 30 cm ruler is a little short: 1 ft is <b>30.48 cm</b>.' : 'The metre stick is longer, by about <b>3 inches</b>.', run: async (c) => { await c.fadeIn(gap); await c.pop(gl); } },
        { cap: ft ? `${T('1\\text{ ft}=30.48\\text{ cm}')}: about 30 cm.` : `${T('1\\text{ yd}=0.9144\\text{ m}')}: a bit less than 1 m.`, run: (c) => c.pop(f) }
      ];
    }
    // mile vs km: a road with km posts and a mile sign
    const L = W - 180, pk = L / 2, Y = 170;
    svgEl('rect', { x: 20, y: Y, width: W - 40, height: 62, fill: '#5d6470' }, S);
    svgEl('line', { x1: 20, y1: Y + 31, x2: W - 20, y2: Y + 31, stroke: '#fff', 'stroke-width': 4, 'stroke-dasharray': '24 18' }, S);
    const posts = [];
    for (let i = 0; i <= 4; i++) {
      const g = svgEl('g', {}, S), x = X0 + i * pk / 2, big = i % 2 === 0;
      svgEl('rect', { x: x - 3, y: Y - 70, width: 6, height: 70, fill: '#3a4254' }, g);
      svgEl('rect', { x: x - 30, y: Y - 104, width: 60, height: 36, rx: 6, fill: big ? '#fff' : '#eef4fb', stroke: SI, 'stroke-width': 3 }, g);
      txt(g, x, Y - 79, `${i / 2} km`, { fill: SI, 'font-size': 16, 'font-weight': 800 });
      posts.push(hide(g));
    }
    const sg = svgEl('g', {}, S), mx = X0 + 1.609 * pk;
    svgEl('rect', { x: mx - 3, y: Y + 62, width: 6, height: 62, fill: '#3a4254' }, sg);
    svgEl('rect', { x: mx - 46, y: Y + 72, width: 92, height: 40, rx: 6, fill: '#1e7a3c', stroke: '#fff', 'stroke-width': 3 }, sg);
    txt(sg, mx, Y + 99, '1 MILE', { fill: '#fff', 'font-size': 18, 'font-weight': 900 });
    hide(sg);
    const car = svgEl('g', {}, S);
    svgEl('rect', { x: -52, y: Y + 4, width: 52, height: 22, rx: 8, fill: RED }, car);
    svgEl('rect', { x: -40, y: Y - 6, width: 28, height: 14, rx: 5, fill: '#e98b8b' }, car);
    svgEl('circle', { cx: -42, cy: Y + 27, r: 6, fill: '#1c2230' }, car); svgEl('circle', { cx: -10, cy: Y + 27, r: 6, fill: '#1c2230' }, car);
    const at = (km) => car.setAttribute('transform', `translate(${X0 + km * pk} 0)`); at(0);
    const d1 = hide(add(stage, box(h('div', 'u3l5-tag si', '1 km'), 80, 34), X0 + pk - 40, Y + 70));
    const f = fact(`${T('1\\text{ mi}\\approx1.609\\text{ km}')} (about 1.6 km), and ${T('1\\text{ km}\\approx0.621\\text{ mi}')}: a bit more than half a mile.`);
    return [
      { cap: 'Distance posts along a road, every half kilometre.', run: async (c) => { for (const p of posts) await c.fadeIn(p, 140); } },
      { cap: 'The car drives <b>1 km</b>.', run: async (c) => { await tween(c, 1200, (t) => at(t)); await c.pop(d1); } },
      { cap: 'Keep going to the <b>1 mile</b> sign: it is at about <b>1.6 km</b>.', run: async (c) => { await c.fadeIn(sg); await tween(c, 900, (t) => at(1 + 0.609 * t)); } },
      { cap: `${T('1\\text{ mi}\\approx1.609\\text{ km}')}. A mile is longer than a kilometre.`, run: (c) => c.pop(f) }
    ];
  }
};

/* =====================================================================================
 * 1b. Which is longer? Same unit, then bars to scale
 * ===================================================================================== */
const PAIRS = {
  i: { a: '1 in', b: '1 cm', s: 0, conv: '1 in = 2.54 cm', u: 'cm', va: 2.54, vb: 1, A: '2.54 cm', B: '1 cm', L: 0, why: '1 in = 2.54 cm' },
  ii: { a: '1 yd', b: '1 m', s: 0, conv: '1 yd = 0.9144 m', u: 'm', va: 0.9144, vb: 1, A: '0.9144 m', B: '1 m', L: 1, why: '1 yd = 0.9144 m, less than 1 m' },
  iii: { a: '1 mi', b: '1 km', s: 0, conv: '1 mi ≈ 1.609 km', u: 'km', va: 1.609, vb: 1, A: '1.609 km', B: '1 km', L: 0, why: '1 mi ≈ 1.609 km' },
  iv: { a: '1 ft', b: '25 cm', s: 0, conv: '1 ft = 30.48 cm', u: 'cm', va: 30.48, vb: 25, A: '30.48 cm', B: '25 cm', L: 0, why: '1 ft = 30.48 cm, more than 25 cm' },
  v: { a: '10 in', b: '25 cm', s: 0, conv: '10 × 2.54 = 25.4 cm', u: 'cm', va: 25.4, vb: 25, A: '25.4 cm', B: '25 cm', L: 0, why: '25.4 cm is just over 25 cm' }
};
const longer = {
  title: 'Which is longer? Same unit, then compare',
  height: 330, minW: 860,
  choices: [{ sep: 'Example 1(a) check:' }, { v: 'i', label: '(i)' }, { v: 'ii', label: '(ii)' }, { v: 'iii', label: '(iii)' }, { v: 'iv', label: '(iv)' }, { v: 'v', label: '(v)' }],
  ask: (k) => `Example 1(a)(${k}): which is longer, <b>${PAIRS[k].a}</b> or <b>${PAIRS[k].b}</b>?`,
  make(stage, k, ex) {
    const d = PAIRS[k], W = ex.W, X = 200, BW = W - X - 140, sc = BW / Math.max(d.va, d.vb), Y = [120, 210];
    const names = [d.a, d.b].map((s, i) => add(stage, box(h('div', 'u3l5-pname ' + (i === 0 ? 'imp' : 'si'), s), 150, 60), 24, Y[i]));
    hide(...names);
    const conv = hide(add(stage, box(cbox('u3l5-conv', `Change ${d.a} to ${d.u}: <b>${d.conv}</b>`), 470, 48), (W - 470) / 2, 14));
    const bars = [d.va, d.vb].map((v, i) => add(stage, box(h('div', 'u3l5-lbar ' + (i === 0 ? 'imp' : 'si')), 0, 44), X, Y[i] + 8));
    const vl = [d.A, d.B].map((s, i) => hide(add(stage, box(h('div', 'u3l5-blab', s), 130, 44), X + [d.va, d.vb][i] * sc + 10, Y[i] + 8)));
    const st = ok(stage, 'Longer', X + [d.va, d.vb][d.L] * sc + 80, Y[d.L] - 20, { ok: true });
    const lg = d.L === 0 ? d.a : d.b;
    return [
      { cap: `Which is longer: <b>${d.a}</b> or <b>${d.b}</b>? Make a guess.`, run: async (c) => { await c.fadeIn(names[0]); await c.fadeIn(names[1]); } },
      { cap: `Use a conversion fact to change ${d.a} to ${d.u}: <b>${d.conv}</b>.`, run: (c) => c.fadeIn(conv) },
      { cap: `Now both are in ${d.u}: <b>${d.A}</b> and <b>${d.B}</b>. Draw them to scale.`, run: async (c) => { await tween(c, 900, (t) => { bars[0].style.width = d.va * sc * t + 'px'; bars[1].style.width = d.vb * sc * t + 'px'; }); await c.fadeIn(vl[0]); await c.fadeIn(vl[1]); } },
      { cap: `<b>${lg}</b> is longer (${d.why}).`, run: (c) => stampIn(c, st) }
    ];
  }
};

/* =====================================================================================
 * 1c. Quick estimates in your head
 * ===================================================================================== */
const EST = {
  in12: { n: 12, kind: 'in' }, cm50: { n: 50, kind: 'cm' }, mi50: { n: 50, kind: 'mi' }, km100: { n: 100, kind: 'km' },
  e1: { n: 55, kind: 'in', ex: 'Example 1(b)(i)', what: 'A TV screen measures 55 in across.', about: 140 },
  e2: { n: 300, kind: 'km', ex: 'Example 1(b)(ii)', what: 'A highway sign says “Edmonton 300 km”.' },
  e3: { n: 5, kind: 'mi', ex: 'Example 1(b)(iii)', what: 'A hiking trail in Montana is 5 mi long.' }
};
const TO = { in: 'centimetres', cm: 'inches', mi: 'kilometres', km: 'miles' };
const estimate = {
  title: 'Estimating in your head',
  height: 370, minW: 900,
  choices: [{ v: 'in12', label: '12 in → cm' }, { v: 'cm50', label: '50 cm → in' }, { v: 'mi50', label: '50 mi → km' }, { v: 'km100', label: '100 km → mi' }, { sep: 'Example 1(b) check:' }, { v: 'e1', label: '(i)' }, { v: 'e2', label: '(ii)' }, { v: 'e3', label: '(iii)' }],
  ask: (k) => { const d = EST[k]; return d.ex ? `${d.ex}: ${d.what} About how many ${TO[d.kind]} is that?` : `Estimate <b>${d.n} ${d.kind}</b> in ${TO[d.kind]}, in your head.`; },
  make(stage, k, ex) {
    const d = EST[k], n = d.n, W = ex.W, X0 = 40, BH = 50, TX = W - 360, TW = 340;
    const line = (html, y) => hide(add(stage, box(cbox('u3l5-eline', html), TW, 46), TX, y));
    const res = (html) => hide(add(stage, box(cbox('u3l5-res', html), TW, 52), TX, 30));
    const chk = (html) => hide(add(stage, box(cbox('u3l5-chk', html), W - 60, 56), 30, 300));
    const bar = (cls, html, w, x, y) => add(stage, box(cbox('u3l5-bar ' + cls, html), w, BH), x, y);
    const room = TX - X0 - 30;
    if (d.kind === 'in') {
      const s = room / (2.5 * n), half = n / 2, r = 2.5 * n, about = d.about || r;
      bar('start', `${n} in`, n * s, X0, 30);
      const b1 = hide(bar('a', `${n}`, n * s - 4, X0, 130)), b2 = hide(bar('a', `${n}`, n * s - 4, X0 + n * s, 130));
      const b3 = hide(bar('plus', `+${half}`, half * s - 4, X0 + 2 * n * s, 130));
      const l1 = line(`Double: ${T(`${n}\\times2=${2 * n}`)}`, 130), l2 = line(`Add half: ${T(`${2 * n}+${half}=${r}`)}`, 200);
      const R = res(about === r ? `About <b>${r} cm</b>` : `${r}: about <b>${about} cm</b>`);
      const C = chk(`Exact: ${T(`${n}\\times2.54=${rnd(n * 2.54, 3)}`)} cm. Very close ✓`);
      return [
        { cap: `${n} in to centimetres: each inch is about 2.5 cm. First <b>double</b> it: ${T(`${n}\\times2=${2 * n}`)}.`, run: async (c) => { await c.fadeIn(b1); await c.fadeIn(b2); await c.fadeIn(l1); } },
        { cap: `Then <b>add half</b> of ${n}: ${T(`${2 * n}+${half}=${r}`)}.`, run: async (c) => { await c.pop(b3); await c.fadeIn(l2); } },
        { cap: `${n} in is about <b>${about} cm</b>.`, run: (c) => c.pop(R) },
        { cap: `Check: ${T(`${n}\\times2.54=${rnd(n * 2.54, 3)}`)} cm. Very close to the estimate ✓`, run: (c) => c.fadeIn(C) }
      ];
    }
    if (d.kind === 'mi') {
      const s = room / (1.6 * n), six = rnd(0.6 * n, 2), r = rnd(1.6 * n, 2);
      bar('start', `${n} mi`, n * s, X0, 30);
      const b1 = hide(bar('a', `${n}`, n * s - 4, X0, 130)), b2 = hide(bar('plus', `+${six}`, six * s - 4, X0 + n * s, 130));
      const l1 = line(`Six tenths of ${n}: ${T(`${six}`)}`, 130), l2 = line(`Add: ${T(`${n}+${six}=${r}`)}`, 200);
      const R = res(`About <b>${r} km</b>`);
      const C = chk(`Exact: ${T(`${n}\\times1.609=${rnd(n * 1.609, 3)}`)} km. Very close ✓`);
      return [
        { cap: `${n} mi to kilometres: a mile is about 1.6 km. Keep the ${n}, and find <b>six tenths</b> of it: ${T(`${six}`)}.`, run: async (c) => { await c.fadeIn(b1); await c.fadeIn(l1); } },
        { cap: `<b>Add</b> them: ${T(`${n}+${six}=${r}`)}.`, run: async (c) => { await c.pop(b2); await c.fadeIn(l2); } },
        { cap: `${n} mi is about <b>${r} km</b>.`, run: (c) => c.pop(R) },
        { cap: `Check: ${T(`${n}\\times1.609=${rnd(n * 1.609, 3)}`)} km. Very close to the estimate ✓`, run: (c) => c.fadeIn(C) }
      ];
    }
    if (d.kind === 'km') {
      const s = room / n, tenth = n / 10, r = 0.6 * n, tens = [];
      for (let i = 0; i < 10; i++) tens.push(bar('ten', i === 0 ? String(tenth) : '', tenth * s - 4, X0 + i * tenth * s, 30));
      const keep = hide(bar('a', `${r}`, r * s - 4, X0, 130));
      const l1 = line(`One tenth of ${n}: ${T(`${n}\\div10=${tenth}`)}`, 130), l2 = line(`Six tenths: ${T(`6\\times${tenth}=${r}`)}`, 200);
      const R = res(`About <b>${r} mi</b>`);
      const C = chk(`Exact: ${T(`${n}\\times0.621=${rnd(n * 0.621, 3)}`)} mi. The estimate is <b>a little low</b> (1 km is a bit more than 0.6 mi).`);
      return [
        { cap: `${n} km to miles: a kilometre is about 0.6 mi. Cut ${n} into <b>ten tenths</b>: each is ${T(`${n}\\div10=${tenth}`)}.`, run: async (c) => { await c.fadeIn(l1); for (const b of tens) await pulse(c, b, 1.06); } },
        { cap: `Take <b>six</b> of them: ${T(`6\\times${tenth}=${r}`)}.`, run: async (c) => { for (const b of tens.slice(0, 6)) b.classList.add('on'); await c.fadeIn(keep); await c.fadeIn(l2); } },
        { cap: `${n} km is about <b>${r} mi</b>.`, run: (c) => c.pop(R) },
        { cap: `Check: ${T(`${n}\\times0.621=${rnd(n * 0.621, 3)}`)} mi. The estimate is a little low.`, run: (c) => c.fadeIn(C) }
      ];
    }
    // cm -> in: how many 2.5 cm blocks fit?
    const s = room / n, r = n * 4 / 10, blocks = [];
    bar('start si', `${n} cm`, n * s, X0, 30);
    for (let i = 0; i < Math.floor(r); i++) blocks.push(hide(bar('inb', '', 2.5 * s - 3, X0 + i * 2.5 * s, 130)));
    const l1 = line(`× 4: ${T(`${n}\\times4=${4 * n}`)}`, 130), l2 = line(`÷ 10: ${T(`${4 * n}\\div10=${r}`)}`, 200);
    const R = res(`About <b>${r} in</b>`);
    const C = chk(`Exact: ${T(`${n}\\div2.54=${rnd(n / 2.54, 3)}`)} in. Very close ✓`);
    return [
      { cap: `${n} cm to inches: how many 2.5 cm blocks (inches) fit? Dividing by 2.5 is the same as <b>× 4, then ÷ 10</b>.`, run: async (c) => { for (const b of blocks) await c.fadeIn(b, 60); } },
      { cap: `${T(`${n}\\times4=${4 * n}`)}, then ${T(`${4 * n}\\div10=${r}`)}.`, run: async (c) => { await c.fadeIn(l1); await c.fadeIn(l2); } },
      { cap: `${n} cm is about <b>${r} in</b>: ${r} blocks.`, run: (c) => c.pop(R) },
      { cap: `Check: ${T(`${n}\\div2.54=${rnd(n / 2.54, 3)}`)} in. Very close to the estimate ✓`, run: (c) => c.fadeIn(C) }
    ];
  }
};

/* =====================================================================================
 * 2. The unit-factor machine: have on the bottom, want on top, cross out, calculate
 * ===================================================================================== */
const UF = {
  a: { amt: '9', have: 'in', want: 'cm', top: '2.54', bot: '1', div: false, e: '9×2.54', r: '22.86', ans: '22.9 cm', round: 'Round to the tenth: 22.86 → <b>22.9 cm</b>', est: 'A centimetre is shorter, so the number gets <b>bigger</b>. 9 × 2.5 = 22.5 ✓', task: '9 in to cm' },
  b: { amt: '60', have: 'cm', want: 'in', top: '1', bot: '2.54', div: true, e: '60÷2.54', r: '23.62204724', ans: '23.6 in', round: 'Round to the tenth: 23.622… → <b>23.6 in</b>', est: 'An inch is longer, so the number gets <b>smaller</b>. 60 × 4 = 240, ÷ 10 = 24 ✓', task: '60 cm to in' },
  c: { amt: '6', have: 'ft', want: 'cm', top: '30.48', bot: '1', div: false, e: '6×30.48', r: '182.88', ans: '182.9 cm', round: 'Round to the tenth: 182.88 → <b>182.9 cm</b>', est: 'A foot is about 30 cm: 6 × 30 = 180 ✓', task: '6 ft to cm' },
  d: { amt: '6', have: 'ft', want: 'cm', top: '30.48', bot: '1', div: false, e: '6×30.48', r: '182.88', ans: '1.83 m', m: true, round: 'Inside SI: 182.88 ÷ 100 = 1.8288 → <b>1.83 m</b>', est: 'A metre is about 3.28 ft, so 6 ft is a bit less than 2 m ✓', task: '6 ft to m' },
  e: { amt: '50', have: 'm', want: 'yd', top: '1', bot: '0.9144', div: true, e: '50÷0.9144', r: '54.68066492', ans: '54.7 yd', round: 'Round to the tenth: 54.680… → <b>54.7 yd</b>', est: 'A yard is a bit shorter than a metre, so a bit <b>more than 50</b> ✓', task: '50 m to yd' },
  f: { amt: '13.1', have: 'mi', want: 'km', top: '1.609', bot: '1', div: false, e: '13.1×1.609', r: '21.0779', ans: '21.1 km', round: 'Round to the tenth: 21.0779 → <b>21.1 km</b>', est: 'Add six tenths: 13.1 + 7.9 = 21 ✓', task: '13.1 mi to km' },
  g: { amt: '5', have: 'km', want: 'mi', top: '0.621', bot: '1', div: false, e: '5×0.621', r: '3.105', ans: '3.1 mi', round: 'Round to the tenth: 3.105 → <b>3.1 mi</b>', est: 'Six tenths of 5 is 3 ✓', task: '5 km to mi' }
};
const unitFactor = {
  title: 'The unit factor: cross out the unit you have',
  height: 380, minW: 900,
  choices: [{ sep: 'Example 2 check:' }, ...'abcdefg'.split('').map((v) => ({ v, label: `(${v}) ${UF[v].task}` }))],
  ask: (k) => `Example 2(${k}): convert <b>${UF[k].task}</b>. Round to the nearest ${k === 'd' ? 'hundredth' : 'tenth'}.`,
  make(stage, k, ex) {
    const d = UF[k], W = ex.W;
    const U = (s, cls) => `<span class="u3l5-u ${cls}">${s}<i class="u3l5-x"></i></span>`;
    const row = add(stage, box(h('div', 'u3l5-uf'), W - 40, 140), 20, 14);
    const amt = hide(h('div', 'u3l5-ufa', `${d.amt} ${U(d.have, 'have a')}`));
    const times = hide(h('div', 'u3l5-ufo', '×'));
    const frac = hide(h('div', 'u3l5-uff', `<div class="t">${d.top} ${U(d.want, 'want')}</div><div class="b">${d.bot} ${U(d.have, 'have b')}</div>`));
    const eq = hide(h('div', 'u3l5-ufo', '='));
    const out = hide(h('div', 'u3l5-ufr', d.ans));
    row.append(amt, times, frac, eq, out);
    const tags = hide(add(stage, box(h('div', 'u3l5-tags', `<span class="w">want on top</span><span class="hv">have on the bottom</span>`), 230, 110), 0, 30));
    const work = hide(add(stage, box(cbox('u3l5-eline lg', d.div ? `The fact is on the bottom, so <b>divide</b>: ${T(d.e.replace('÷', '\\div'))}` : `Multiply: ${T(d.e.replace('×', '\\times'))}`), 520, 56), 30, 182));
    const screen = lcd(stage, d.e, d.r, W - 310, 176, 280);
    const rn = hide(add(stage, box(cbox('u3l5-rnote', d.round), 560, 46), 30, 252));
    const chk = hide(add(stage, box(cbox('u3l5-chk', `<b>Step 4. Check:</b> ${d.est}`), W - 60, 58), 30, 312));
    const steps = [
      { cap: `<b>Step 1.</b> Write the length you have, with its unit: <b>${d.amt} ${d.have}</b>.`, run: (c) => c.pop(amt) },
      { cap: `<b>Step 2.</b> Multiply by a unit factor: <b>${d.have}</b> (what you have) on the <b>bottom</b>, <b>${d.want}</b> (what you want${d.m ? ' from the fact' : ''}) on the <b>top</b>.`,
        run: async (c) => {
          await c.fadeIn(times, 200); await c.pop(frac);
          const r = frac.getBoundingClientRect(), s = stage.getBoundingClientRect(), sc = (s.width / stage.offsetWidth) || 1;
          tags.style.left = ((r.right - s.left) / sc + 10) + 'px'; tags.style.top = ((r.top - s.top) / sc - 4) + 'px';
          await c.fadeIn(tags);
        } },
      { cap: `<b>Step 3.</b> <b>${d.have}</b> is on the top and on the bottom: cross it out. The unit left is <b>${d.want}</b>.`,
        run: async (c) => { await c.anim(tags, [{ opacity: 1 }, { opacity: 0 }], 250); for (const x of row.querySelectorAll('.have .u3l5-x')) await c.anim(x, [{ transform: 'rotate(-18deg) scaleX(0)' }, { transform: 'rotate(-18deg) scaleX(1)' }], 380); await pulse(c, row.querySelector('.want'), 1.25); } },
      { cap: d.div ? `The fact is on the <b>bottom</b>, so <b>divide</b>: ${T(d.e.replace('÷', '\\div'))} shows ${d.r.slice(0, 7)}…` : `Calculate: ${T(d.e.replace('×', '\\times'))} = ${d.r} ${d.want}.`,
        run: async (c) => { await c.fadeIn(work); await c.pop(screen); } },
      { cap: d.m ? 'The question wants metres. Convert inside SI: 182.88 cm ÷ 100 = 1.8288 m ≈ <b>1.83 m</b>.' : `Round to the nearest tenth: <b>${d.ans}</b>.`, run: async (c) => { await c.fadeIn(rn); await c.fadeIn(eq, 200); await c.pop(out); } },
      { cap: `<b>Step 4.</b> Check with an estimate. ${d.est}`, run: (c) => c.fadeIn(chk) }
    ];
    return steps;
  }
};

/* =====================================================================================
 * 2b. Bigger or smaller? inch blocks vs centimetre blocks (Full notes)
 * ===================================================================================== */
const wrongWay = {
  title: 'Bigger or smaller? Line up the blocks',
  height: 390, minW: 900,
  choices: [{ v: 'in', label: '9 in to cm' }, { v: 'cm', label: '60 cm to in' }],
  ask: (k) => (k === 'in' ? 'Change <b>9 in</b> to centimetres. Should the number get bigger or smaller?' : 'Change <b>60 cm</b> to inches. Should the number get bigger or smaller?'),
  make(stage, k, ex) {
    const W = ex.W, X = 150, LEN = W - X - 40;
    const lab = (s, y) => add(stage, box(h('div', 'u3l5-rowlab', s), 130, 50), 12, y);
    const blk = (cls, s, w, x, y) => hide(add(stage, box(cbox('u3l5-blk ' + cls, s), Math.max(2, w - 3), 50), x, y));
    if (k === 'in') {
      const s = LEN / 9, cw = s / 2.54;
      lab('9 in', 20); const top = []; for (let i = 0; i < 9; i++) top.push(blk('in', '1 in', s, X + i * s, 20));
      lab('right way', 140); const R = []; for (let i = 0; i < 23; i++) R.push(blk('cm', '', i < 22 ? cw : 0.86 * cw, X + i * cw, 140));
      lab('wrong way', 240); const Wr = []; for (let i = 0; i < 4; i++) Wr.push(blk('bad', '', i < 3 ? cw : 0.54 * cw, X + i * cw, 240));
      const t1 = hide(add(stage, box(cbox('u3l5-eline', `${T('9\\div2.54\\approx3.5')} cm: <b>far too short!</b>`), 400, 50), X + 3.6 * cw + 20, 240));
      const x1 = ok(stage, '✗', X + 3.6 * cw + 440, 262, { ok: false });
      const t2 = hide(add(stage, box(cbox('u3l5-eline', `${T('9\\times2.54=22.86')} cm fill the same length ✓`), 470, 50), W - 510, 194));
      const rule = hide(add(stage, box(cbox('u3l5-fact', 'An inch is <b>longer</b> than a centimetre, so there are <b>more</b> centimetres than inches. Ask: bigger or smaller?'), W - 60, 52), 30, 320));
      return [
        { cap: 'Here is <b>9 in</b>: nine inch blocks.', run: async (c) => { for (const b of top) await c.pop(b, 120); } },
        { cap: `A wrong way: ${T('9\\div2.54\\approx3.5')} cm. Only 3.5 centimetre blocks: much shorter than 9 in. That can’t be right.`, run: async (c) => { for (const b of Wr) await c.pop(b, 200); await c.fadeIn(t1); await stampIn(c, x1); } },
        { cap: `The right way: each inch is 2.54 cm, so ${T('9\\times2.54=22.86')} cm. About 23 centimetre blocks fill the same length.`, run: async (c) => { for (const b of R) await c.pop(b, 90); await c.fadeIn(t2); } },
        { cap: 'Changing to the <b>smaller</b> unit gives the <b>bigger</b> number. in → cm: the number gets <b>bigger</b>.', run: (c) => c.fadeIn(rule) }
      ];
    }
    const iw = LEN * 2.54 / 60;
    lab('60 cm', 20); const top = blk('cm', '60 cm', LEN, X, 20);
    lab('right way', 140); const R = []; for (let i = 0; i < 24; i++) R.push(blk('in', '', i < 23 ? iw : 0.62 * iw, X + i * iw, 140));
    lab('wrong way', 240); const Wr = []; for (let i = 0; i < Math.floor(LEN / iw); i++) Wr.push(blk('bad', '', iw, X + i * iw, 240));
    const t1 = hide(add(stage, box(cbox('u3l5-eline warn', `${T('60\\times2.54=152.4')} in? That is about <b>12.7 ft</b>: taller than a room, not a small shelf! ✗`), W - 60, 50), 30, 300));
    const t2 = hide(add(stage, box(cbox('u3l5-eline', `${T('60\\div2.54\\approx23.6')} in ✓`), 300, 50), W - 340, 194));
    return [
      { cap: 'Here is <b>60 cm</b> (a small shelf).', run: (c) => c.fadeIn(top) },
      { cap: `A wrong way: ${T('60\\times2.54=152.4')} in. The inch blocks run right off the screen!`, run: async (c) => { for (const b of Wr) await c.pop(b, 60); await c.fadeIn(t1); } },
      { cap: `The right way: an inch is 2.54 cm, so <b>divide</b>: ${T('60\\div2.54\\approx23.6')} in. About 23.6 inch blocks fill 60 cm.`, run: async (c) => { await Promise.all(Wr.map((b) => c.anim(b, [{ opacity: 1 }, { opacity: 0.12 }], 300))); for (const b of R) await c.pop(b, 90); await c.fadeIn(t2); } }
    ];
  }
};

/* =====================================================================================
 * 3. Heights in feet and inches: a stack of foot blocks beside a centimetre scale
 * ===================================================================================== */
const HT = {
  m: { name: 'Marcus', f: 5, i: 10, ex: 'Example 4(a)' }, p: { name: 'Priya', f: 5, i: 2, ex: 'Example 4(a)' }, o: { name: 'Owen', f: 3, i: 6, ex: 'Example 4(a)' },
  h: { name: 'Hana', cm: 168, ex: 'Example 4(b)' }
};
const height = {
  title: 'Feet and inches: change to one unit first',
  height: 420, minW: 900,
  choices: [{ v: 'why', label: 'Why not 5.10 ft?' }, { sep: 'Example 4 check:' }, { v: 'm', label: 'Marcus' }, { v: 'p', label: 'Priya' }, { v: 'o', label: 'Owen' }, { v: 'h', label: '(b) Hana' }],
  ask: (k) => {
    if (k === 'why') return 'Marcus is <b>5′&nbsp;10″</b>. Is that 5.10 ft?';
    const d = HT[k]; return d.cm ? `${d.ex}: Hana is <b>168 cm</b> tall. Find her height in feet and inches, to the nearest inch.` : `${d.ex}: ${d.name} is <b>${d.f}′&nbsp;${d.i}″</b>. Change the height to centimetres, to the nearest centimetre.`;
  },
  make(stage, k, ex) {
    const W = ex.W;
    if (k === 'why') {
      const X0 = 40, LEN = W - 80, cs = [], ten = [];
      add(stage, box(h('div', 'u3l5-onelb', '1 ft = 12 in'), LEN, 30), X0, 8);
      for (let i = 0; i < 12; i++) cs.push(hide(add(stage, box(h('div', 'u3l5-in12', String(i + 1)), LEN / 12 - 3, 54), X0 + i * LEN / 12, 40)));
      for (let i = 0; i < 10; i++) ten.push(hide(add(stage, box(h('div', 'u3l5-ten', i < 9 ? '0.' + (i + 1) : '1.0'), LEN / 10 - 3, 54), X0 + i * LEN / 10, 160)));
      const m1 = hide(add(stage, box(h('div', 'u3l5-mk good', '10 in = 0.833 ft'), 210, 36), X0 + LEN * 10 / 12 - 105, 104));
      const m2 = hide(add(stage, box(h('div', 'u3l5-mk no', '0.10 ft ≈ 1.2 in'), 200, 36), X0 + LEN * 0.1 - 20, 224));
      const x = ok(stage, '✗ 5.10', X0 + LEN * 0.1 + 260, 242, { ok: false });
      const res = hide(add(stage, box(cbox('u3l5-fact', `${T('70\\div12=5.833\\ldots')}: 5 feet and 0.833 of a foot. And 0.833 of a foot is ${T('0.833\\times12\\approx10')} in. So 5′&nbsp;10″ = <b>5.833 ft</b>, not 5.10 ft.`), W - 60, 76), 30, 300));
      return [
        { cap: 'One foot is <b>12 inches</b>. Here is 1 ft cut into 12 inches.', run: async (c) => { for (const e of cs) await c.fadeIn(e, 70); } },
        { cap: '<b>10 in</b> is 10 of the 12 pieces: almost a whole foot.', run: async (c) => { for (const e of cs.slice(0, 10)) { e.classList.add('on'); await c.pop(e, 120); } await c.fadeIn(m1); } },
        { cap: 'Decimals count in <b>tenths</b>. 0.10 ft is only 1 tenth of a foot: about 1.2 in.', run: async (c) => { for (const e of ten) await c.fadeIn(e, 60); ten[0].classList.add('on'); await c.fadeIn(m2); await stampIn(c, x); } },
        { cap: `So 5′&nbsp;10″ is <b>not</b> 5.10 ft. It is 70 in, and ${T('70\\div12=5.833\\ldots')} ft.`, run: (c) => c.pop(res) }
      ];
    }
    const d = HT[k], G = 400, kpx = 340 / 74, SX = 70, SW = 110, CX = 210, TX = 330, TW = W - TX - 20;
    const n = d.cm ? 66 : d.f * 12 + d.i, feet = Math.floor(n / 12), rest = n - 12 * feet, cmv = d.cm ? 168 : rnd(n * 2.54, 2);
    // the person
    const P = mkSvg(stage, 60, 420, 0, 0), ph = (d.cm ? 168 / 2.54 : n) * kpx;
    const pg = svgEl('g', {}, P);
    svgEl('circle', { cx: 30, cy: G - ph + 13, r: 12, fill: '#e9c46a', stroke: '#6e4a1c', 'stroke-width': 2.5 }, pg);
    svgEl('path', { d: `M14 ${G - ph + 30} H46 L44 ${G - ph * 0.45} H16 Z`, fill: '#3b78d8', stroke: '#1c2230', 'stroke-width': 2 }, pg);
    svgEl('path', { d: `M16 ${G - ph * 0.45} L20 ${G} H28 L30 ${G - ph * 0.3} L32 ${G} H40 L44 ${G - ph * 0.45} Z`, fill: '#3a4254' }, pg);
    hide(pg);
    add(stage, box(h('div', 'u3l5-floor'), SW + 260, 4), 0, G);
    // foot blocks (bottom up) and the inch block
    const fb = [];
    for (let i = 0; i < feet; i++) fb.push(hide(add(stage, box(h('div', 'u3l5-ftb', '12 in'), SW, 12 * kpx - 3), SX, G - (i + 1) * 12 * kpx)));
    const ib = hide(add(stage, box(h('div', 'u3l5-inb2', `${rest} in`), SW, rest * kpx - 3), SX, G - n * kpx));
    const tally = hide(add(stage, box(h('div', 'u3l5-tally2', ''), 120, 30), SX - 4, G - feet * 12 * kpx - 34));
    // centimetre scale
    const C = mkSvg(stage, 90, 420, CX - 30, 0), cg = svgEl('g', {}, C), pcm = kpx / 2.54;
    svgEl('line', { x1: 30, y1: G, x2: 30, y2: G - 190 * pcm, stroke: SI, 'stroke-width': 3 }, cg);
    for (let v = 0; v <= 190; v += 10) { svgEl('line', { x1: 30, y1: G - v * pcm, x2: v % 50 === 0 ? 50 : 42, y2: G - v * pcm, stroke: SI, 'stroke-width': 2 }, cg); if (v % 20 === 0 && v > 0) txt(cg, 72, G - v * pcm + 6, String(v), { fill: SI, 'font-size': 14 }); }
    txt(cg, 30, G - 190 * pcm - 10, 'cm', { fill: SI, 'font-size': 15, 'font-weight': 900 });
    hide(cg);
    const mark = hide(add(stage, box(h('div', 'u3l5-hmark'), CX - SX + 60, 3), SX, G - cmv * pcm));
    const line = (html, y) => hide(add(stage, box(cbox('u3l5-eline', html), TW - 290, 46), TX, y));
    if (!d.cm) {
      const R = Math.round(cmv);
      const l1 = line(`${T(`${feet}\\times12=${12 * feet}`)} in`, 20), l2 = line(`${T(`${12 * feet}+${rest}=${n}`)} in`, 80), l3 = line(`${T(`${n}\\times2.54=${cmv}`)} cm`, 140);
      const scr = lcd(stage, `${n}×2.54`, String(cmv), W - 290, 140, 270);
      const res = hide(add(stage, box(cbox('u3l5-res', `${d.name} is about <b>${R} cm</b> tall.`), TW, 54), TX, 230));
      return [
        { cap: `${d.name} is <b>${d.f}′&nbsp;${d.i}″</b>: ${d.f} feet and ${d.i} inches. Two units: change to inches first.`, run: (c) => c.fadeIn(pg) },
        { cap: `Each foot is 12 inches: ${T(`${feet}\\times12=${12 * feet}`)} in.`, run: async (c) => { await c.fadeIn(tally); for (let i = 0; i < feet; i++) { tally.textContent = `${12 * (i + 1)} in`; tally.style.top = (G - (i + 1) * 12 * kpx - 34) + 'px'; await c.pop(fb[i], 220); } await c.fadeIn(l1); } },
        { cap: `Add the ${rest} inches: ${T(`${12 * feet}+${rest}=${n}`)} in.`, run: async (c) => { tally.textContent = `${n} in`; tally.style.top = (G - n * kpx - 34) + 'px'; await c.pop(ib); await c.fadeIn(l2); } },
        { cap: `Now one unit, so × 2.54: ${T(`${n}\\times2.54=${cmv}`)} cm.`, run: async (c) => { await c.fadeIn(cg); await c.pop(scr); await c.fadeIn(l3); await c.fadeIn(mark); } },
        { cap: `Round to the nearest centimetre: ${d.name} is about <b>${R} cm</b>.`, run: (c) => c.pop(res) }
      ];
    }
    const l1 = line(`${T('168\\div2.54=66.14\\ldots\\approx66')} in`, 20), l2 = line(`${T('5\\times12=60')} in`, 80), l3 = line(`${T('66-60=6')} in left over`, 140);
    const scr = lcd(stage, '168÷2.54', '66.14173228', W - 290, 20, 270);
    const res = hide(add(stage, box(cbox('u3l5-res', 'Hana is about <b>5′&nbsp;6″</b> tall.'), TW, 54), TX, 230));
    return [
      { cap: 'Hana is <b>168 cm</b> tall.', run: async (c) => { await c.fadeIn(pg); await c.fadeIn(cg); await c.fadeIn(mark); } },
      { cap: `Centimetres to inches: ÷ 2.54. ${T('168\\div2.54=66.14\\ldots')}, about <b>66 in</b>.`, run: async (c) => { await c.pop(scr); await c.fadeIn(l1); } },
      { cap: 'Take out as many 12s as you can: 12, 24, 36, 48, 60. That is <b>5 feet</b>.', run: async (c) => { await c.fadeIn(tally); for (let i = 0; i < feet; i++) { tally.textContent = `${12 * (i + 1)} in`; tally.style.top = (G - (i + 1) * 12 * kpx - 34) + 'px'; await c.pop(fb[i], 220); } await c.fadeIn(l2); } },
      { cap: `What is left over is the inches: ${T('66-60=6')} in.`, run: async (c) => { tally.textContent = '66 in'; tally.style.top = (G - n * kpx - 34) + 'px'; await c.pop(ib); await c.fadeIn(l3); } },
      { cap: 'Hana is about <b>5′&nbsp;6″</b> tall.', run: (c) => c.pop(res) }
    ];
  }
};

/* =====================================================================================
 * 3b. Devon's SUV at the parkade: the scene, and a zoomed-in height scale
 * ===================================================================================== */
const parkade = {
  title: 'Will Devon’s SUV fit under the bar?',
  height: 420, minW: 900,
  ask: 'Example 5: the sign says <b>Clearance 6′&nbsp;8″</b>. Devon’s SUV with a cargo box is <b>2.05 m</b> tall; without the box it is <b>1.78 m</b>.',
  make(stage, k, ex) {
    const W = ex.W, G = 300, PXM = 118, SC = 580;
    const S = mkSvg(stage, SC, 310, 0, 0);
    // parkade entrance and the clearance bar
    const bh = G - 2.032 * PXM;
    svgEl('rect', { x: 440, y: 0, width: 140, height: G, fill: '#b9b2a5' }, S);
    svgEl('rect', { x: 452, y: bh - 6, width: 128, height: G - bh + 6, fill: '#3a3f4a' }, S);
    svgEl('line', { x1: 0, y1: G, x2: SC, y2: G, stroke: '#3a4254', 'stroke-width': 4 }, S);
    const barG = svgEl('g', {}, S);
    svgEl('line', { x1: 372, y1: 0, x2: 372, y2: bh - 12, stroke: '#6b665c', 'stroke-width': 2.5 }, barG);
    svgEl('line', { x1: 432, y1: 0, x2: 432, y2: bh - 12, stroke: '#6b665c', 'stroke-width': 2.5 }, barG);
    for (let i = 0; i < 4; i++) svgEl('rect', { x: 352 + i * 25, y: bh - 12, width: 25, height: 12, fill: i % 2 ? '#1c2230' : '#f2c230' }, barG);
    const sign = svgEl('g', {}, S);
    svgEl('rect', { x: 448, y: 2, width: 128, height: 46, rx: 6, fill: '#f2c230', stroke: '#1c2230', 'stroke-width': 3 }, sign);
    txt(sign, 512, 20, 'CLEARANCE', { 'font-size': 14, 'font-weight': 900 }); txt(sign, 512, 43, '6′ 8″', { 'font-size': 21, 'font-weight': 900 });
    // the SUV (origin: front-left wheel line on the ground)
    const suv = svgEl('g', {}, S), roof = 1.78 * PXM, top = 2.05 * PXM;
    svgEl('rect', { x: 0, y: G - 112, width: 220, height: 80, rx: 14, fill: '#2f6db5', stroke: '#173a66', 'stroke-width': 3 }, suv);
    svgEl('path', { d: `M28 ${G - 112} L52 ${G - roof} H178 L204 ${G - 112} Z`, fill: '#2f6db5', stroke: '#173a66', 'stroke-width': 3 }, suv);
    svgEl('path', { d: `M60 ${G - 116} L72 ${G - roof + 10} H120 V${G - 116} Z M128 ${G - 116} V${G - roof + 10} H172 L190 ${G - 116} Z`, fill: '#cfe0fb' }, suv);
    for (const cx of [48, 174]) { svgEl('circle', { cx, cy: G - 24, r: 24, fill: '#1c2230' }, suv); svgEl('circle', { cx, cy: G - 24, r: 10, fill: '#9aa4b1' }, suv); }
    const cargo = svgEl('g', {}, suv);
    svgEl('rect', { x: 62, y: G - top, width: 120, height: top - roof - 1, rx: 10, fill: '#3a4254', stroke: '#1c2230', 'stroke-width': 2 }, cargo);
    cargo.style.transformBox = 'view-box'; cargo.style.transformOrigin = '0 0';
    const at = (x) => suv.setAttribute('transform', `translate(${x} 0)`); at(20);
    // zoomed height scale: 1.70 m to 2.10 m
    const ZX = SC + 40, ZW = W - ZX - 20, zy = (m) => 30 + (2.10 - m) * 900;
    const Z = mkSvg(stage, ZW, 420, ZX, 0);
    svgEl('rect', { x: 0, y: 14, width: ZW, height: 400, rx: 12, fill: '#f7f4ee', stroke: '#b9ad97', 'stroke-width': 2 }, Z);
    txt(Z, ZW / 2, 34, 'zoom in: 1.70 m to 2.10 m', { 'font-size': 14, fill: '#6b665c' });
    for (let m = 1.70; m <= 2.1001; m += 0.05) { const y = zy(m); svgEl('line', { x1: 14, y1: y, x2: 34, y2: y, stroke: '#3a4254', 'stroke-width': 2 }, Z); txt(Z, 58, y + 5, fx(m, 2), { 'font-size': 14, fill: '#3a4254' }); }
    const zl = (m, col, lab, dash) => { const g = svgEl('g', {}, Z); svgEl('line', { x1: 86, y1: zy(m), x2: ZW - 12, y2: zy(m), stroke: col, 'stroke-width': 4, 'stroke-dasharray': dash || '' }, g); txt(g, ZW - 14, zy(m) + (lab.y || -8), lab.t, { 'font-size': 15, fill: col, 'text-anchor': 'end' }); return hide(g); };
    const zBar = zl(2.032, '#1c2230', { t: 'bar 2.032 m', y: 22 }, '10 6'), zBox = zl(2.05, RED, { t: 'SUV + box 2.05 m' }), zRoof = zl(1.78, '#2f6db5', { t: 'SUV 1.78 m', y: 22 });
    const gap = svgEl('g', {}, Z); svgEl('line', { x1: 110, y1: zy(2.032), x2: 110, y2: zy(1.78), stroke: '#12805a', 'stroke-width': 4 }, gap);
    txt(gap, 120, (zy(2.032) + zy(1.78)) / 2 + 6, '25.2 cm', { 'font-size': 20, fill: '#12805a', 'text-anchor': 'start', 'font-weight': 900 }); hide(gap);
    const over = svgEl('rect', { x: 86, y: zy(2.05), width: ZW - 98, height: zy(2.032) - zy(2.05), fill: RED, opacity: 0.25 }, Z); hide(over);
    const l1 = hide(add(stage, box(cbox('u3l5-eline', `${T('6\\times12+8=80')} in; &nbsp;${T('80\\times2.54=203.2')} cm = <b>2.032 m</b>`), SC - 20, 46), 10, 318));
    const l2 = hide(add(stage, box(cbox('u3l5-eline', `${T('2.05-2.032=0.018')} m = <b>1.8 cm</b> too tall`), SC - 20, 46), 10, 368));
    const l3 = hide(add(stage, box(cbox('u3l5-eline', `${T('2.032-1.78=0.252')} m = <b>25.2 cm</b> of space`), SC - 20, 46), 10, 368));
    const sx = ok(stage, '✗ 1.8 cm', ZX + ZW - 90, 136, { ok: false }), sy = ok(stage, '✓ fits', ZX + ZW - 80, 200, { ok: true });
    return [
      { cap: '(a) The sign says <b>6′&nbsp;8″</b>. Change it to one unit: <b>80 in</b>. Then 80 × 2.54 = 203.2 cm = <b>2.032 m</b>.', run: async (c) => { await pulse(c, sign, 1.08); await c.fadeIn(l1); await c.fadeIn(zBar); } },
      { cap: '(b) The SUV with the cargo box is <b>2.05 m</b> tall. Drive up to the bar…', run: async (c) => { await c.fadeIn(zBox); await tween(c, 1300, (t) => at(20 + 158 * t)); await c.shake(barG); } },
      { cap: `${T('2.05-2.032=0.018')} m = 1.8 cm. <b>No:</b> the SUV is about 1.8 cm too tall.`, run: async (c) => { await c.fadeIn(over); await c.fadeIn(l2); await stampIn(c, sx); } },
      { cap: '(c) Take the cargo box off. Now the SUV is <b>1.78 m</b> tall.', run: async (c) => { await c.anim(cargo, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translate(-60px, -40px)' }], 700); cargo.style.opacity = 0; await c.anim(zBox, [{ opacity: 1 }, { opacity: 0.15 }], 300); zBox.style.opacity = 0.15; over.style.opacity = 0; await c.fadeIn(zRoof); } },
      { cap: `It drives under. Space above: ${T('2.032-1.78=0.252')} m = <b>25.2 cm</b>.`, run: async (c) => { l2.style.opacity = 0; await tween(c, 1200, (t) => at(178 + 160 * t)); await c.fadeIn(gap); await c.fadeIn(l3); await stampIn(c, sy); } }
    ];
  }
};

/* =====================================================================================
 * 3c. The inch tape in sixteenths, with centimetres (or millimetres) on the other edge
 * ===================================================================================== */
const SX16 = {
  c23: { N: 2, v: 2.3, ask: 'Find <b>2.3 in</b> on an inch tape, to the nearest sixteenth.' },
  a: { N: 0, v: 5 / 16, ask: 'Example 6(a): a drill bit is <b>5/16 in</b> wide. What is that in millimetres, to the nearest tenth?' },
  b: { N: 17, v: 45 / 2.54, ask: 'Example 6(b): find <b>45 cm</b> to the nearest 1/16 in.' },
  c: { N: 17, v: 17 + 11 / 16, ask: 'Example 6(c): check by converting <b>17 11/16 in</b> back to centimetres.' }
};
const sixteenths = {
  title: 'Sixteenths of an inch: decimal part × 16',
  height: 420, minW: 900,
  choices: [{ v: 'c23', label: '2.3 in' }, { sep: 'Example 6 check:' }, { v: 'a', label: '(a) drill bit' }, { v: 'b', label: '(b) 45 cm' }, { v: 'c', label: '(c) check back' }],
  ask: (k) => SX16[k].ask,
  make(stage, k, ex) {
    const d = SX16[k], W = ex.W, X0 = 60, L = W - 120, Y1 = 40, Y2 = 200, N = d.N;
    const S = mkSvg(stage, W, 300, 0, 0), tape = svgEl('g', {}, S);
    svgEl('rect', { x: X0 - 30, y: Y1, width: L + 60, height: Y2 - Y1, rx: 8, fill: '#fff8e6', stroke: '#8a6a10', 'stroke-width': 3 }, tape);
    inchTicks(tape, X0, Y1, L, N, N + 1, 1, { sub: 16 });
    const mmMode = k === 'a', pcm = L / 2.54;
    if (mmMode) {
      for (let mm = 0; mm <= 25; mm++) { const x = X0 + mm / 10 * pcm, big = mm % 5 === 0; svgEl('line', { x1: x, y1: Y2, x2: x, y2: Y2 - (big ? 26 : 13), stroke: SI, 'stroke-width': big ? 2.2 : 1.2 }, tape); if (big) txt(tape, x, Y2 - 34, String(mm), { fill: SI, 'font-size': 16, 'font-weight': 800 }); }
      txt(tape, X0 + L + 18, Y2 - 8, 'mm', { fill: SI, 'font-size': 15, 'font-weight': 900 });
    } else if (k !== 'c23') {
      cmTicks(tape, X0, Y2, pcm, N * 2.54, (N + 1) * 2.54, -1);
      txt(tape, X0 + L + 18, Y2 - 8, 'cm', { fill: SI, 'font-size': 15, 'font-weight': 900 });
    }
    txt(tape, X0 + L + 18, Y1 + 22, 'in', { fill: IMPD, 'font-size': 15, 'font-weight': 900 });
    const xin = (v) => X0 + (v - N) * L;
    const mkw = svgEl('g', {}, S), mk = svgEl('g', {}, mkw); svgEl('line', { x1: 0, y1: Y1 - 10, x2: 0, y2: Y2 + 10, stroke: RED, 'stroke-width': 4 }, mk); hide(mkw);
    const mAt = (v) => mk.setAttribute('transform', `translate(${xin(v)} 0)`);
    const tag = (html, v, y, cls, w = 150) => hide(add(stage, box(h('div', 'u3l5-tag ' + cls, html), w, 38), Math.max(4, Math.min(W - w - 4, xin(v) - w / 2)), y));
    const line = (html, y, w = W - 380) => hide(add(stage, box(cbox('u3l5-eline', html), w, 46), 30, y));
    const n16 = (v) => Math.round((v - Math.floor(v + 1e-9)) * 16);
    const hl = (i) => { const g = svgEl('g', {}, S); svgEl('circle', { cx: xin(N + i / 16), cy: Y1 + 70, r: 13, fill: '#fff', stroke: RED, 'stroke-width': 2.5 }, g); txt(g, xin(N + i / 16), Y1 + 76, String(i), { 'font-size': 14, fill: RED, 'font-weight': 900 }); return hide(g); };
    if (k === 'c23') {
      const nums = []; for (let i = 1; i <= 5; i++) nums.push(hl(i));
      const t = tag('2.3 in', 2.3, 214, 'rd', 110), sn = tag(`${T('2\\tfrac{5}{16}')} in`, 2 + 5 / 16, 256, 'imp', 150);
      const l1 = line(`${T('0.3\\times16=4.8\\approx5')} sixteenths`, 300), res = hide(add(stage, box(cbox('u3l5-res', `2.3 in ${T('\\approx2\\tfrac{5}{16}')} in`), 330, 52), W - 360, 300));
      return [
        { cap: 'Here is the inch from 2 to 3, cut into <b>16 sixteenths</b>. The longest marks are halves, then quarters, eighths, sixteenths.', run: (c) => c.fadeIn(tape) },
        { cap: '2.3 in is <b>0.3</b> of the way from 2 to 3.', run: async (c) => { mAt(2); await c.fadeIn(mkw, 200); await tween(c, 900, (t) => mAt(2 + 0.3 * t)); await c.pop(t); } },
        { cap: `How many sixteenths is 0.3 of an inch? ${T('0.3\\times16=4.8')}.`, run: async (c) => { for (const e of nums) await c.pop(e, 150); await c.fadeIn(l1); } },
        { cap: `Round 4.8 to <b>5</b>: 2.3 in ${T('\\approx2\\tfrac{5}{16}')} in.`, run: async (c) => { await tween(c, 400, (t) => mAt(2.3 + (2 + 5 / 16 - 2.3) * t)); await c.pop(sn); await c.pop(res); } }
      ];
    }
    if (k === 'a') {
      const nums = []; for (let i = 1; i <= 5; i++) nums.push(hl(i));
      const l1 = line(`${T('5\\div16=0.3125')} in`, 260), l2 = line(`${T('0.3125\\times25.4=7.9375')} mm`, 310);
      const scr = lcd(stage, '0.3125×25.4', '7.9375', W - 300, 262, 270);
      const res = hide(add(stage, box(cbox('u3l5-res', 'The bit is about <b>7.9 mm</b> wide.'), 400, 50), 30, 356));
      return [
        { cap: 'An inch cut into sixteenths, with <b>millimetres</b> on the bottom edge (1 in = 25.4 mm).', run: (c) => c.fadeIn(tape) },
        { cap: `${T('\\tfrac{5}{16}')} in is 5 of the 16 marks. As a decimal: ${T('5\\div16=0.3125')} in.`, run: async (c) => { for (const e of nums) await c.pop(e, 150); mAt(5 / 16); await c.fadeIn(mkw); await c.fadeIn(l1); } },
        { cap: `Look straight down to the millimetre edge: ${T('0.3125\\times25.4=7.9375')} mm.`, run: async (c) => { await c.pop(scr); await c.fadeIn(l2); } },
        { cap: 'Round to the nearest tenth: the bit is about <b>7.9 mm</b> wide.', run: (c) => c.pop(res) }
      ];
    }
    if (k === 'b') {
      const v = 45 / 2.54, nn = n16(v);
      const t45 = tag('45 cm', v, 214, 'si', 100), sn = tag(`${T('17\\tfrac{11}{16}')} in`, 17 + 11 / 16, 0, 'imp', 170);
      const scr = lcd(stage, '45÷2.54', '17.71653543', W - 300, 262, 270);
      const l1 = line(`${T('45\\div2.54=17.7165\\ldots')} in`, 260), l2 = line(`${T('0.7165\\times16=11.46\\ldots\\approx11')}`, 310);
      const res = hide(add(stage, box(cbox('u3l5-res', `45 cm ${T('\\approx17\\tfrac{11}{16}')} in`), 400, 50), 30, 356));
      void nn;
      return [
        { cap: `Change to inches: ${T('45\\div2.54=17.7165\\ldots')} in. That is between 17 and 18.`, run: async (c) => { await c.pop(scr); await c.fadeIn(l1); await c.fadeIn(tape); } },
        { cap: 'Find <b>45 cm</b> on the bottom edge and look straight up to the inch edge.', run: async (c) => { mAt(17); await c.fadeIn(mkw, 200); await tween(c, 900, (t) => mAt(17 + (v - 17) * t)); await c.pop(t45); } },
        { cap: `The decimal part, in sixteenths: ${T('0.7165\\times16=11.46\\ldots')}.`, run: (c) => c.fadeIn(l2) },
        { cap: `Round to <b>11</b>: 45 cm ${T('\\approx17\\tfrac{11}{16}')} in. (11/16 does not simplify.)`, run: async (c) => { await tween(c, 400, (t) => mAt(v + (17 + 11 / 16 - v) * t)); await c.pop(sn); await c.pop(res); } }
      ];
    }
    const v = 17 + 11 / 16, cm = v * 2.54;
    const n11 = hl(11), sn = tag(`${T('17\\tfrac{11}{16}')} in`, v, 0, 'imp', 170), t45 = tag('45 cm', 45 / 2.54, 214, 'si', 100), tc = tag('44.93 cm', v, 252, 'rd', 130);
    const scr = lcd(stage, '17.6875×2.54', '44.92625', W - 300, 300, 270);
    const l1 = line(`${T('17+11\\div16=17.6875')} in`, 300), l2 = line(`${T('17.6875\\times2.54=44.926\\ldots')} cm`, 350);
    const res = hide(add(stage, box(cbox('u3l5-chk', 'About <b>44.9 cm</b>: within 1 mm of 45 cm ✓'), 440, 46), W - 470, 356));
    return [
      { cap: `${T('17\\tfrac{11}{16}')} in: 17 inches and 11 sixteenths. As a decimal: ${T('17+11\\div16=17.6875')} in.`, run: async (c) => { await c.fadeIn(tape); await c.pop(n11); mAt(v); await c.fadeIn(mkw); await c.pop(sn); await c.fadeIn(l1); } },
      { cap: `Look straight down to the centimetre edge: ${T('17.6875\\times2.54=44.926\\ldots')} cm.`, run: async (c) => { await c.pop(scr); await c.fadeIn(l2); await c.pop(tc); } },
      { cap: 'About <b>44.9 cm</b>. The 45 cm mark is less than 1 mm away ✓', run: async (c) => { await c.pop(t45); await c.anim(scr, [{ opacity: 1 }, { opacity: 0 }], 200); scr.style.opacity = 0; await c.fadeIn(res); } }
    ];
  }
};

/* =====================================================================================
 * 4. Road signs: miles and mph become km and km/h
 * ===================================================================================== */
const ROAD = {
  c60: { ask: 'A US speed limit is <b>60 mph</b>. What is that in km/h?', kind: 'speed', n: 60, r: '96.54', R: '96.5' },
  a: { ask: 'Example 7(a): the interstate speed limit is <b>80 mph</b>. What is that in km/h?', kind: 'speed', n: 80, r: '128.72', R: '129' },
  b: { ask: 'Example 7(b): a sign says <b>Great Falls 87 mi</b>. How far is that in kilometres?', kind: 'dist', n: 87, r: '139.983', R: '140' },
  c: { ask: 'Example 7(c): the limit drops to <b>55 mph</b>. Mr. Tran is driving at <b>95 km/h</b>. Is he speeding?', kind: 'check', n: 55, r: '88.495', R: '88.5' },
  d: { ask: 'Example 7(d): at the Great Falls sign the odometer read <b>48 312 km</b>. What should it read at Great Falls?', kind: 'odo' }
};
const roadSigns = {
  title: 'US road signs, in km and km/h',
  height: 400, minW: 900,
  choices: [{ v: 'c60', label: '60 mph' }, { sep: 'Example 7 check:' }, { v: 'a', label: '(a) 80 mph' }, { v: 'b', label: '(b) 87 mi' }, { v: 'c', label: '(c) speeding?' }, { v: 'd', label: '(d) odometer' }],
  ask: (k) => ROAD[k].ask,
  make(stage, k, ex) {
    const d = ROAD[k], W = ex.W, S = mkSvg(stage, W, 400, 0, 0);
    // the road, with a car that drives along
    svgEl('rect', { x: 0, y: 318, width: W, height: 70, fill: '#5d6470' }, S);
    const dash = svgEl('line', { x1: 0, y1: 353, x2: W, y2: 353, stroke: '#fff', 'stroke-width': 4, 'stroke-dasharray': '30 22' }, S);
    const car = svgEl('g', {}, S);
    svgEl('rect', { x: -70, y: 330, width: 70, height: 26, rx: 9, fill: RED }, car); svgEl('rect', { x: -54, y: 316, width: 38, height: 18, rx: 6, fill: '#e98b8b' }, car);
    svgEl('circle', { cx: -54, cy: 358, r: 8, fill: '#1c2230' }, car); svgEl('circle', { cx: -14, cy: 358, r: 8, fill: '#1c2230' }, car);
    const drive = (c, a, b, ms) => tween(c, ms, (t) => { car.setAttribute('transform', `translate(${a + (b - a) * t} 0)`); dash.setAttribute('stroke-dashoffset', String(-t * 200)); });
    car.setAttribute('transform', 'translate(90 0)');
    const usSpeed = (x, y, n) => { const g = svgEl('g', {}, S); svgEl('rect', { x, y, width: 150, height: 190, rx: 12, fill: '#fff', stroke: '#1c2230', 'stroke-width': 5 }, g); txt(g, x + 75, y + 40, 'SPEED', { 'font-size': 24, 'font-weight': 900 }); txt(g, x + 75, y + 68, 'LIMIT', { 'font-size': 24, 'font-weight': 900 }); txt(g, x + 75, y + 152, String(n), { 'font-size': 76, 'font-weight': 900 }); return g; };
    const caSpeed = (x, y, n) => { const g = svgEl('g', {}, S); svgEl('rect', { x, y, width: 150, height: 190, rx: 12, fill: '#fff', stroke: '#1c2230', 'stroke-width': 5 }, g); txt(g, x + 75, y + 36, 'MAXIMUM', { 'font-size': 20, 'font-weight': 900 }); txt(g, x + 75, y + 128, String(n), { 'font-size': n.length > 3 ? 54 : 70, 'font-weight': 900, fill: RED }); txt(g, x + 75, y + 168, 'km/h', { 'font-size': 24, 'font-weight': 900 }); return g; };
    const green = (x, y, top, n, u) => { const g = svgEl('g', {}, S); svgEl('rect', { x, y, width: 230, height: 120, rx: 12, fill: '#1e7a3c', stroke: '#fff', 'stroke-width': 4 }, g); txt(g, x + 115, y + 46, top, { 'font-size': 28, 'font-weight': 800, fill: '#fff' }); txt(g, x + 115, y + 96, `${n} ${u}`, { 'font-size': 38, 'font-weight': 900, fill: '#fff' }); return g; };
    const MX = 290, MW = W - 2 * MX + 40;
    const line = (html, y) => hide(add(stage, box(cbox('u3l5-eline lg', html), MW, 52), MX - 20, y));
    if (d.kind === 'odo') {
      const odo = add(stage, box(h('div', 'u3l5-odo', '48&#8239;312'), 300, 80), (W - 300) / 2, 70);
      const lab = add(stage, box(h('div', 'u3l5-odol', 'odometer (km)'), 300, 30), (W - 300) / 2, 40);
      const l1 = line(`${T('48\\,312+140=48\\,452')}`, 180);
      const res = hide(add(stage, box(cbox('u3l5-res', 'It should read about <b>48&#8239;452 km</b>.'), 480, 52), (W - 480) / 2, 246));
      void lab;
      return [
        { cap: 'At the sign, the odometer reads <b>48 312 km</b>. Great Falls is about <b>140 km</b> away (from (b)).', run: (c) => pulse(c, odo, 1.06) },
        { cap: `Drive 140 km: ${T('48\\,312+140=48\\,452')}.`, run: async (c) => { await Promise.all([drive(c, 90, W - 40, 1800), tween(c, 1800, (t) => { odo.innerHTML = String(48312 + Math.round(140 * t)).replace(/(\d\d)(\d{3})$/, '$1&#8239;$2'); })]); await c.fadeIn(l1); } },
        { cap: 'It should read about <b>48 452 km</b>.', run: (c) => c.pop(res) }
      ];
    }
    const left = d.kind === 'dist' ? green(20, 40, 'Great Falls', d.n, 'mi') : usSpeed(40, 40, d.n);
    const right = hide(d.kind === 'dist' ? green(W - 250, 40, 'Great Falls', d.R, 'km') : caSpeed(W - 190, 40, d.R));
    const l1 = line(`${T(`${d.n}\\times1.609=${d.r}`)}`, 50);
    const scr = lcd(stage, `${d.n}×1.609`, d.r, (W - 270) / 2, 120, 270);
    const u = d.kind === 'dist' ? 'km' : 'km/h';
    const steps = [
      { cap: d.kind === 'dist' ? 'A US sign: <b>87 mi</b> to Great Falls. The Trans’ car counts in km.' : `A US sign: <b>${d.n} mph</b>. The car’s speedometer shows km/h.`, run: async (c) => { await pulse(c, left, 1.05); await drive(c, 90, 240, 900); } },
      { cap: `1 mi ≈ 1.609 km${d.kind === 'dist' ? '' : ', and the “per hour” does not change'}: ${T(`${d.n}\\times1.609=${d.r}`)}.`, run: async (c) => { await c.fadeIn(l1); await c.pop(scr); } },
      { cap: `${d.kind === 'dist' ? 'Great Falls is about' : 'The limit is about'} <b>${d.R} ${u}</b>.`, run: async (c) => { await c.pop(right); await drive(c, 240, W - 230, 1000); } }
    ];
    if (d.kind === 'check') {
      const sp = hide(add(stage, box(h('div', 'u3l5-spd', '95 <small>km/h</small>'), 170, 70), (W - 170) / 2, 210));
      const st = ok(stage, '6.5 km/h over', W / 2 + 200, 236, { ok: false });
      steps.push({ cap: `Mr. Tran drives at <b>95 km/h</b>. ${T('95-88.5=6.5')}: <b>yes</b>, he is speeding, by about 6.5 km/h.`, run: async (c) => { await c.pop(sp); await c.shake(sp); await stampIn(c, st); } });
    }
    return steps;
  }
};

/* =====================================================================================
 * 4b. Mei's fabric: price per metre, quarter-yard steps, round up
 * ===================================================================================== */
const fabric = {
  title: 'Mei’s fabric: per yard or per metre?',
  height: 400, minW: 900,
  choices: [{ sep: 'Example 8 check:' }, { v: 'a', label: '(a) price per metre' }, { v: 'b', label: '(b) Fabric Barn' }, { v: 'c', label: '(c) Sew Central' }],
  ask: (k) => ({ a: 'Example 8(a): Fabric Barn: <b>$12.49 per yd</b>. Sew Central: <b>$13.29 per m</b>. Which has the lower price per metre?', b: 'Example 8(b): Mei needs <b>2.5 m</b>. Fabric Barn cuts in steps of <b>¼ yd</b>. How many yards must she buy, and what does it cost?', c: 'Example 8(c): what does <b>2.5 m</b> cost at Sew Central? How much does Mei save there?' }[k]),
  make(stage, k, ex) {
    const W = ex.W;
    const ptag = (html, x, y, cls = '') => add(stage, box(h('div', 'u3l5-ptag ' + cls, html), 230, 96), x, y);
    if (k === 'a') {
      const A = ptag('<small>Fabric Barn</small><b>$12.49</b><span>per yard</span>', 30, 20), B = ptag('<small>Sew Central</small><b>$13.29</b><span>per metre</span>', W - 260, 20);
      void A; void B;
      const X = 300, L = W - 600, ym = 0.9144;
      const yb = hide(add(stage, box(cbox('u3l5-blk in', '1 yd'), ym * L, 50), X, 40)), mb = hide(add(stage, box(cbox('u3l5-blk cm', '1 m'), L, 50), X, 100));
      const l1 = hide(add(stage, box(cbox('u3l5-eline lg', `Price per metre = price ÷ length in metres: ${T('\\$12.49\\div0.9144=13.659\\ldots')}`), W - 60, 56), 30, 180));
      const scr = lcd(stage, '12.49÷0.9144', '13.65923009', 30, 250, 280);
      const R = hide(ptag('<small>Fabric Barn</small><b>$13.66</b><span>per metre</span>', 340, 250, 'pans'));
      const st = ok(stage, 'Lower', W - 150, 140, { ok: true });
      return [
        { cap: 'Two prices, two units. A yard is <b>0.9144 m</b>: a bit less than a metre.', run: async (c) => { await c.fadeIn(yb); await c.fadeIn(mb); } },
        { cap: `Find Fabric Barn’s price for one metre: ${T('\\$12.49\\div0.9144=13.659\\ldots')}.`, run: async (c) => { await c.fadeIn(l1); await c.pop(scr); } },
        { cap: 'Round to the cent: <b>$13.66 per m</b>. A metre is longer than a yard, so it costs more ✓', run: (c) => c.pop(R) },
        { cap: '$13.29 is less than $13.66: <b>Sew Central</b> has the lower price per metre.', run: (c) => stampIn(c, st) }
      ];
    }
    if (k === 'b') {
      const X = 40, L = W - 80, py = L / 3, Y = 70;
      const bolt = add(stage, box(h('div', 'u3l5-bolt'), 0, 64), X, Y);
      for (let q = 0; q <= 12; q++) add(stage, box(h('div', 'u3l5-qt4' + (q % 4 === 0 ? ' lg' : ''), q % 4 === 0 ? `${q / 4} yd` : q % 2 === 0 ? `${q / 4}` : ''), 60, 26), X + q * py / 4 - 30, Y + 70);
      const mline = hide(add(stage, box(h('div', 'u3l5-need', ''), 3, 110), X + 2.734 * py - 1, Y - 30));
      const mlab = hide(add(stage, box(h('div', 'u3l5-tag si', '2.5 m = 2.734 yd'), 190, 34), X + 2.734 * py - 200, Y - 40));
      const cut = hide(add(stage, box(h('div', 'u3l5-cut', '✂'), 40, 40), X + 2.75 * py - 20, Y + 12));
      const short = hide(add(stage, box(h('div', 'u3l5-short', '2½ yd: too short'), 180, 30), X + 2.5 * py - 186, Y + 100));
      const l1 = hide(add(stage, box(cbox('u3l5-eline', `${T('2.5\\div0.9144=2.734\\ldots')} yd. Round <b>up</b>: ${T('2\\tfrac34')} yd = 2.75 yd`), W - 60, 50), 30, 210));
      const l2 = hide(add(stage, box(cbox('u3l5-eline', `${T('2.75\\times\\$12.49=34.3475\\approx\\$34.35')}`), 560, 50), 30, 270));
      const res = hide(add(stage, box(cbox('u3l5-res', 'Buy <b>2¾ yd</b> for <b>$34.35</b>'), 420, 54), 30, 332));
      return [
        { cap: `How many yards is 2.5 m? ${T('2.5\\div0.9144=2.734\\ldots')} yd.`, run: async (c) => { await tween(c, 1100, (t) => { bolt.style.width = 2.734 * py * t + 'px'; }); await c.fadeIn(mline); await c.fadeIn(mlab); } },
        { cap: 'The store cuts in steps of ¼ yd. 2½ yd is <b>too short</b>, so round <b>up</b> to the next step: 2¾ yd.', run: async (c) => { await c.fadeIn(short); await tween(c, 500, (t) => { bolt.style.width = (2.734 + 0.016 * t) * py + 'px'; }); await c.pop(cut); await c.fadeIn(l1); } },
        { cap: `Cost: ${T('2.75\\times\\$12.49=34.3475\\approx\\$34.35')}.`, run: async (c) => { await c.fadeIn(l2); await c.pop(res); } }
      ];
    }
    const A = ptag('<small>Fabric Barn: 2¾ yd</small><b>$34.35</b><span>from (b)</span>', 40, 30), B = hide(ptag('<small>Sew Central: 2.5 m</small><b>$33.23</b><span>cut to any length</span>', 330, 30, 'pans'));
    void A;
    const l1 = hide(add(stage, box(cbox('u3l5-eline lg', `${T('2.5\\times\\$13.29=33.225\\approx\\$33.23')}`), 560, 56), 30, 160));
    const l2 = hide(add(stage, box(cbox('u3l5-eline lg', `${T('\\$34.35-\\$33.23=\\$1.12')}`), 560, 56), 30, 230));
    const st = ok(stage, 'Saves $1.12', 700, 70, { ok: true });
    return [
      { cap: 'Sew Central cuts any length, so Mei buys exactly <b>2.5 m</b>.', run: (c) => c.fadeIn(l1) },
      { cap: `${T('2.5\\times\\$13.29=33.225\\approx\\$33.23')}.`, run: (c) => c.pop(B) },
      { cap: `Compare: ${T('\\$34.35-\\$33.23=\\$1.12')}. Mei saves <b>$1.12</b> at Sew Central.`, run: async (c) => { await c.fadeIn(l2); await stampIn(c, st); } }
    ];
  }
};

/* =============================== wiring =============================== */
dragRuler();
mountExplainers({ facts, longer, estimate, unitFactor, wrongWay, height, parkade, sixteenths, roadSigns, fabric });

/* ============ Stand Up Break! — conversions, heights, clearances and speed limits, at the whiteboards ============ */
{
  const t1 = (v) => fx(v, 1);
  const ITEMS_IN = [['A TV screen', 32, 75], ['A pizza', 10, 18], ['A skateboard', 28, 33], ['A laptop screen', 13, 17], ['A snowboard', 50, 62]];
  const ITEMS_CM = [['A pencil case', 18, 30], ['A shelf', 30, 90], ['A poster', 40, 100], ['A guitar', 90, 105], ['A hockey stick', 120, 160]];
  standup('u3l5', {
    intro: 'Estimate first. Then use a unit factor and your calculator. Did the number get bigger or smaller? Does that make sense?',
    levels: {
      BEG: (r) => r.pick([
        () => { const [w, a, b] = r.pick(ITEMS_IN), n = r.int(a, b); return { text: `${w} is <b>${n} in</b> long. Estimate it in centimetres, then find it to the nearest tenth.`, q: '', a: [`\\text{Estimate: }${n}\\times2=${2 * n},\\ ${2 * n}+${n / 2}=${2.5 * n}`, `${n}\\times2.54=${rnd(n * 2.54, 2)}\\approx${t1(n * 2.54)}\\text{ cm}`] }; },
        () => { const [w, a, b] = r.pick(ITEMS_CM), n = r.int(a, b); return { text: `${w} is <b>${n} cm</b> long. Estimate it in inches, then find it to the nearest tenth.`, q: '', a: [`\\text{Estimate: }${n}\\times4=${4 * n},\\ ${4 * n}\\div10=${rnd(0.4 * n, 1)}`, `${n}\\div2.54=${rnd(n / 2.54, 3)}\\ldots\\approx${t1(n / 2.54)}\\text{ in}`] }; },
        () => { const n = r.pick([5, 10, 15, 20, 25, 30, 40, 50, 60, 120]); return { text: `A road trip in Montana is <b>${n} mi</b>. Estimate it in kilometres, then find it to the nearest tenth.`, q: '', a: [`\\text{Estimate: }${n}+${rnd(0.6 * n, 1)}=${rnd(1.6 * n, 1)}`, `${n}\\times1.609=${rnd(n * 1.609, 3)}\\approx${t1(n * 1.609)}\\text{ km}`] }; }
      ])(),
      PRG: (r) => r.pick([
        () => { const f = r.int(4, 6), i = r.int(1, 11), n = 12 * f + i; return { text: `A basketball player is <b>${f}′&nbsp;${i}″</b>. Find the height in centimetres, to the nearest centimetre.`, q: '', a: [`${f}\\times12+${i}=${n}\\text{ in}`, `${n}\\times2.54=${rnd(n * 2.54, 2)}\\approx${Math.round(n * 2.54)}\\text{ cm}`] }; },
        () => { const cm = r.int(150, 195), n = Math.round(cm / 2.54), f = Math.floor(n / 12), i = n - 12 * f; return { text: `A driver’s licence says <b>${cm} cm</b>. Find the height in feet and inches, to the nearest inch.`, q: '', a: [`${cm}\\div2.54=${rnd(cm / 2.54, 2)}\\ldots\\approx${n}\\text{ in}`, `${f}\\times12=${12 * f},\\ ${n}-${12 * f}=${i}`, `\\text{about }${f}'\\,${i}''`] }; },
        () => { const cm = r.pick([12, 18, 20, 25, 35, 40, 55, 60]), v = cm / 2.54, w = Math.floor(v), s = Math.round((v - w) * 16); let a = s, b = 16; while (a && a % 2 === 0) { a /= 2; b /= 2; } const fr = s === 16 ? `${w + 1}` : a ? `${w}\\tfrac{${a}}{${b}}` : `${w}`; return { text: `A metric plan says <b>${cm} cm</b>. Find it on an inch tape, to the nearest 1/16 in.`, q: '', a: [`${cm}\\div2.54=${rnd(v, 4)}\\ldots`, `${rnd(v - w, 4)}\\times16=${rnd((v - w) * 16, 2)}\\approx${s}`, `${fr}\\text{ in}`] }; }
      ])(),
      MAS: (r) => r.pick([
        () => { const L = r.pick([45, 50, 55, 60, 65, 70, 75]), lim = L * 1.609, s = Math.round(lim + r.pick([-1, 1]) * r.int(3, 12)); return { text: `A US speed limit is <b>${L} mph</b>. A Canadian driver is going <b>${s} km/h</b>. Over or under the limit? By how much (nearest whole number)?`, q: '', a: [`${L}\\times1.609=${rnd(lim, 3)}\\text{ km/h}`, s > lim ? `\\text{Over, by about }${Math.round(s - lim)}\\text{ km/h}` : `\\text{Under, by about }${Math.round(lim - s)}\\text{ km/h}`] }; },
        () => { const f = r.pick([6, 7, 8, 9, 10]), i = r.int(0, 11), n = 12 * f + i, cl = n * 2.54, ht = rnd(cl / 100 + r.pick([-1, 1]) * r.int(3, 20) / 100, 2); return { text: `A sign says <b>Clearance ${f}′&nbsp;${i}″</b>. A truck is <b>${ht} m</b> tall. Will it fit? By how many centimetres?`, q: '', a: [`${f}\\times12+${i}=${n}\\text{ in};\\ ${n}\\times2.54=${rnd(cl, 2)}\\text{ cm}`, `\\text{truck: }${rnd(ht * 100, 1)}\\text{ cm}`, ht * 100 < cl ? `\\text{Yes, with }${rnd(cl - ht * 100, 2)}\\text{ cm to spare}` : `\\text{No, it is }${rnd(ht * 100 - cl, 2)}\\text{ cm too tall}`] }; },
        () => { const p = r.int(899, 1599) / 100, q = rnd(p / 0.9144 + r.pick([-1, 1]) * r.int(25, 90) / 100, 2), a = p / 0.9144; return { text: `Store A sells rope for <b>$${p.toFixed(2)} per yard</b>. Store B sells it for <b>$${q.toFixed(2)} per metre</b>. Which has the lower price per metre? By how much?`, q: '', a: [`\\text{A: }${p.toFixed(2)}\\div0.9144=${rnd(a, 4)}\\ldots\\approx\\$${fx(a, 2)}\\text{ per m}`, `\\text{B: }\\$${q.toFixed(2)}\\text{ per m}`, `\\text{Store ${rnd(a, 2) < q ? 'A' : 'B'}, by }\\$${fx(Math.abs(rnd(a, 2) - q), 2)}\\text{ per m}`] }; }
      ])()
    }
  });
}
