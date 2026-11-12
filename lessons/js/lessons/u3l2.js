/* Math 10-3 · Unit 3 · Lesson 2 — The SI System: Units, Prefixes and Referents (M1).
 * Static figures: Example 5's ruler, bolt and tape; the prefix staircase (Section 5).
 * Explainers (Class view unless marked Full):
 *   zoom       (a metre bar cut into 10, zoomed, cut again: 1 m = 10 dm = 100 cm = 1000 mm; also km, L, kg),
 *   referents  (picture cards: a dime, a fingernail, a step, a door, a walk; a paper clip, a carton, a car; drops, spoons),
 *   sensible   (three choices, each judged against a referent with a stamp: too small / sensible / too big; Example 3(b)),
 *   estimate   (Full: a referent repeated along a pencil, up a wall, in a pile, into a pot; Example 4),
 *   ruler      (reading a metric ruler and tape: last full cm, count the mm; end − start; Example 5),
 *   stairs     (the prefix staircase: find both units, hop the steps, the decimal point hops with them; Example 6),
 *   trap       (Full: count every step, and smaller unit ⇒ bigger number, as a verdict),
 *   placeChart (Full: the same conversions in a place-value chart of units),
 *   compare    (bars, bottle vs cans, long jumps sorted onto a podium; Example 7),
 *   lemonade   (a jug pouring into cups, jugs needed, laps of a track plus the road; Example 8).
 * Then the Math History animation (the metre from the North Pole) and the Stand Up Break.
 * Colours: the unit you have amber, the unit you want green, steps down blue, steps up purple, answers red. */
import { h, tex, add, stamp, stampIn, mountExplainers, pop, fadeIn, tween, svgEl, pulse, anim, arrowHead, COLORS } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const INK = COLORS.ink, RED = COLORS.red, BLUE = COLORS.blue, GRN = COLORS.green, AMB = COLORS.amber, PUR = COLORS.purple, BRN = COLORS.brand;
const PAPER = '#fffdf8', TAPE = '#f6d54a', TAPE2 = '#9a7a10';
const hide = (el) => { el.style.opacity = 0; return el; };
const show = (c, el) => fadeIn(c, el, 320);
const lab = (host, x, y, html, cls = '') => { const d = h('div', 'u3l2-abs ' + cls, html); d.style.left = x + 'px'; d.style.top = y + 'px'; host.appendChild(d); return d; };
const lin = (t) => t;
const easeIO = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const fadeAttr = (c, els, to, ms = 400, stag = 0) => {
  const list = [].concat(els), st = list.map((e) => +(e.getAttribute('opacity') ?? 1)), total = ms + stag * Math.max(0, list.length - 1);
  return tween(c, total, (t) => { const now = t * total; list.forEach((e, i) => { const p = Math.min(1, Math.max(0, (now - i * stag) / ms)); e.setAttribute('opacity', st[i] + (to - st[i]) * p); }); }, lin);
};
const moveEl = (c, el, x, y, ms = 600) => anim(c, el, [{ left: el.style.left, top: el.style.top }, { left: x + 'px', top: y + 'px' }], ms);
const txt = (svg, x, y, s, cls, a = {}) => { const t = svgEl('text', { x, y, class: cls, ...a }, svg); t.textContent = s; return t; };
/* numbers: 4-digit numbers plain (1250), 5 or more digits with a thin space (12 500), like the booklet */
const nf = (s) => { s = String(s); const [i, f] = s.split('.'); const ii = i.length > 4 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : i; return f != null ? ii + '.' + f : ii; };
const nt = (s) => nf(s).replace(/ /g, '\\,');
/* multiply a decimal string by 10^k exactly */
function shift(v, k) {
  let [i, f = ''] = String(v).split('.'); let ds = i + f, p = i.length + k;
  while (p > ds.length) ds += '0';
  while (p <= 0) { ds = '0' + ds; p++; }
  const ip = ds.slice(0, p).replace(/^0+(?=\d)/, ''), fp = ds.slice(p).replace(/0+$/, '');
  return fp ? ip + '.' + fp : ip;
}
const PRE = ['k', 'h', 'da', '', 'd', 'c', 'm'], PNAME = ['kilo', 'hecto', 'deca', 'base', 'deci', 'centi', 'milli'], WORTH = ['1000', '100', '10', '1', '0.1', '0.01', '0.001'];
const baseOf = (u) => (/L$/.test(u) ? 'L' : /g$/.test(u) ? 'g' : 'm');
const idxOf = (u) => PRE.indexOf(u.slice(0, u.length - baseOf(u).length));
const POW = ['', '10', '100', '1000', '10\\,000', '100\\,000', '1\\,000\\,000'];

/* =============================== the staircase =============================== */
function stairs(svg, x0, y0, o = {}) {
  const w = o.w || 120, hh = o.h || 54, dy = o.dy || 26, gap = o.gap || 128, base = o.base;
  const boxes = PRE.map((p, i) => {
    const x = x0 + i * gap, y = y0 + i * dy, g = svgEl('g', {}, svg);
    const r = svgEl('rect', { x, y, width: w, height: hh, rx: 8, fill: i === 3 ? '#e8dcc6' : '#f6f1e7', stroke: '#8f8676', 'stroke-width': 2 }, g);
    txt(g, x + w / 2, y + 26, base ? p + base : (i === 3 ? 'm, g, L' : p), 'u3l2-sb');
    txt(g, x + w / 2, y + 45, `${PNAME[i]} · ${WORTH[i]}`, 'u3l2-ss');
    return { g, r, x, y, cx: x + w / 2 };
  });
  return { boxes, w, hh };
}
function mountFigures() {
  const host = document.getElementById('u3l2-fig-stairs');
  if (host) {
    const svg = svgEl('svg', { viewBox: '0 0 960 290', role: 'img', 'aria-label': 'The prefix staircase from kilo at the top left down to milli at the bottom right. Down one step: times 10, the decimal point moves right. Up one step: divide by 10, it moves left.' });
    const S = stairs(svg, 20, 64, { w: 122, h: 58, dy: 22, gap: 132 });
    svgEl('path', { d: 'M40 20 L800 148', stroke: BLUE, 'stroke-width': 3.5, fill: 'none' }, svg); arrowHead(svg, 800, 148, 760, 128, { color: BLUE, width: 3.5 });
    txt(svg, 420, 74, 'DOWN one step (smaller unit): × 10, the point moves RIGHT', 'u3l2-hop', { fill: BLUE, transform: 'rotate(9.5 420 74)' });
    svgEl('path', { d: 'M900 282 L80 140', stroke: PUR, 'stroke-width': 3.5, fill: 'none' }, svg); arrowHead(svg, 80, 140, -820, -142, { color: PUR, width: 3.5 });
    txt(svg, 520, 244, 'UP one step (bigger unit): ÷ 10, the point moves LEFT', 'u3l2-hop', { fill: PUR, transform: 'rotate(9.8 520 244)' });
    host.appendChild(svg); void S;
  }
  // rulers for Example 5
  const put = (id, W, H, draw, aria) => { const e = document.getElementById(id); if (!e) return; const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': aria }); draw(svg); e.appendChild(svg); };
  put('u3l2-fig-e5a', 640, 130, (svg) => { const R = ruler(svg, 20, 50, 60, 0, 10); [['A', 2.4], ['B', 5.5], ['C', 8.9]].forEach(([s, v]) => pointer(svg, R.px(v), 50, s)); }, 'A centimetre ruler from 0 to 10 with arrows A, B and C');
  put('u3l2-fig-e5b', 470, 130, (svg) => { const R = ruler(svg, 20, 56, 52, 0, 8); svgEl('rect', { x: R.px(1), y: 26, width: R.px(6.3) - R.px(1), height: 28, rx: 5, fill: '#9aa0ab', stroke: INK, 'stroke-width': 2 }, svg); txt(svg, (R.px(1) + R.px(6.3)) / 2, 46, 'bolt', 'u3l2-rn'); }, 'A bolt lying on a ruler, from the 1 cm mark to between 6 and 7 cm');
  put('u3l2-fig-e5c', 470, 130, (svg) => { const R = ruler(svg, 20, 50, 43, 120, 10); pointer(svg, R.px(126.8), 50, ''); }, 'A tape measure from 120 to 130 cm with an arrow between 126 and 127');
}

/* =============================== a metric ruler: cm numbers, mm ticks =============================== */
function ruler(svg, x0, y, pxcm, from, n, o = {}) {
  const px = (v) => x0 + (v - from) * pxcm, Hh = o.h || 64, g = svgEl('g', {}, svg);
  svgEl('rect', { x: x0 - 12, y, width: n * pxcm + 24, height: Hh, rx: 4, fill: TAPE, stroke: TAPE2, 'stroke-width': 2 }, g);
  const ticks = [];
  for (let i = 0; i <= n * 10; i++) {
    const len = i % 10 === 0 ? Hh * 0.45 : i % 5 === 0 ? Hh * 0.32 : Hh * 0.2;
    ticks.push(svgEl('line', { x1: px(from + i / 10), x2: px(from + i / 10), y1: y, y2: y + len, stroke: '#2b2f38', 'stroke-width': i % 10 === 0 ? 2.2 : 1.2 }, g));
  }
  for (let i = 0; i <= n; i++) txt(g, px(from + i), y + Hh - 10, from + i, 'u3l2-rn');
  txt(g, px(from + n) + 6, y + Hh + 18, 'cm', 'u3l2-rn', { 'text-anchor': 'end' });
  return { px, g, ticks, y, Hh };
}
function pointer(svg, x, y, s) {
  const g = svgEl('g', {}, svg);
  svgEl('line', { x1: x, x2: x, y1: y - 34, y2: y - 4, stroke: RED, 'stroke-width': 3 }, g);
  arrowHead(g, x, y - 2, 0, 1, { color: RED, width: 3 });
  if (s) txt(g, x, y - 38, s, 'u3l2-ptr');
  return g;
}

/* =============================== explainer: zoom into a unit =============================== */
const ZOOM = {
  m: { u: ['m', 'dm', 'cm', 'mm'], ref: 'about the thickness of a dime' },
  km: { u: ['km', 'hm', 'dam', 'm'], ref: 'about one long step' },
  L: { u: ['L', 'dL', 'cL', 'mL'], ref: 'about 20 drops of water' },
  kg: { u: ['kg', 'hg', 'dag', 'g'], ref: 'about the mass of a paper clip' }
};
const zoom = {
  title: 'Zoom in: what the prefixes mean',
  height: 300,
  minW: 940,
  capH: 92,
  choices: [{ v: 'm', label: '1 metre' }, { v: 'km', label: '1 kilometre' }, { v: 'L', label: '1 litre' }, { v: 'kg', label: '1 kilogram' }],
  ask: (k) => `How many ${ZOOM[k].u[1]}, ${ZOOM[k].u[2]} and ${ZOOM[k].u[3]} are in <b>1 ${ZOOM[k].u[0]}</b>?`,
  make(stage, k) {
    const nm = k === 'm' || k === 'L', U = ZOOM[k].u, x0 = 30, W = 880, y = 96, H = 64, cols = ['#f2b84b', '#9cc0f0', '#b9e0c8', '#f2a39b'];
    const svg = svgEl('svg', { class: 'u3l2-abs', width: 940, height: 300 }); add(stage, svg, 0, 0);
    const levels = U.map((u, L) => {
      const g = svgEl('g', { opacity: L ? 0 : 1 }, svg);
      svgEl('rect', { x: x0, y, width: W, height: H, fill: cols[L], stroke: INK, 'stroke-width': 3, 'vector-effect': 'non-scaling-stroke' }, g);
      const cuts = svgEl('g', { opacity: 0 }, g);
      for (let i = 1; i < 10; i++) svgEl('line', { x1: x0 + i * W / 10, x2: x0 + i * W / 10, y1: y, y2: y + H, stroke: INK, 'stroke-width': 2, 'vector-effect': 'non-scaling-stroke' }, cuts);
      return { g, cuts };
    });
    const big = lab(stage, 470, y + H / 2, `1 ${U[0]}`, 'u3l2-big u3l2-mid'); hide(big);
    const pieceLabs = U.slice(1).map((u) => Array.from({ length: 10 }, (_, i) => hide(lab(stage, x0 + (i + 0.5) * W / 10, y + H + 22, `1 ${u}`, 'u3l2-lab sm u3l2-mid'))));
    const topLab = hide(lab(stage, 470, 40, '', 'u3l2-lab u3l2-mid'));
    const eq = hide(lab(stage, 470, 250, '', 'u3l2-tile fin u3l2-mid'));
    const zoomTo = async (c, L) => {
      levels[L].g.setAttribute('opacity', 1);
      await tween(c, 900, (t) => { const s = 0.1 + 0.9 * t; levels[L].g.setAttribute('transform', `translate(${x0} 0) scale(${s} 1) translate(${-x0} 0)`); levels[L - 1].g.setAttribute('opacity', 1 - t); });
    };
    const eqs = [`1 ${U[0]}`, `1 ${U[0]} = 10 ${U[1]}`, `1 ${U[0]} = 10 ${U[1]} = 100 ${U[2]}`, `1 ${U[0]} = 10 ${U[1]} = 100 ${U[2]} = 1000 ${U[3]}`];
    return [
      { cap: `This bar is <b>1 ${U[0]}</b>.`, run: async (c) => { await show(c, big); } },
      { cap: `Cut it into <b>10</b> equal parts. Each part is <b>1 ${U[1]}</b> (${nm ? 'deci: ' : ''}one tenth of a ${U[0]}). So 1 ${U[0]} = 10 ${U[1]}, and 1 ${U[1]} = 0.1 ${U[0]}.`,
        run: async (c) => { big.style.opacity = 0; await fadeAttr(c, levels[0].cuts, 1, 500); for (const e of pieceLabs[0]) e.style.opacity = 1; eq.textContent = eqs[1]; await pop(c, eq); } },
      { cap: `Zoom in on one ${U[1]} and cut it into 10. Each part is <b>1 ${U[2]}</b> (${nm ? 'centi: ' : ''}one hundredth of a ${U[0]}). 1 ${U[0]} = 10 × 10 = <b>100 ${U[2]}</b>.`,
        run: async (c) => { pieceLabs[0].forEach((e) => { e.style.opacity = 0; }); topLab.textContent = `zoomed in: this bar is 1 ${U[1]}`; topLab.style.opacity = 1; await zoomTo(c, 1); await fadeAttr(c, levels[1].cuts, 1, 500); for (const e of pieceLabs[1]) e.style.opacity = 1; eq.textContent = eqs[2]; await pulse(c, eq, 1.06); } },
      { cap: `Zoom in again and cut into 10: each part is <b>1 ${U[3]}</b> (${nm ? 'milli: ' : ''}one thousandth of a ${U[0]}). 1 ${U[0]} = 10 × 100 = <b>1000 ${U[3]}</b>.`,
        run: async (c) => { pieceLabs[1].forEach((e) => { e.style.opacity = 0; }); topLab.textContent = `zoomed in again: this bar is 1 ${U[2]}`; await zoomTo(c, 2); await fadeAttr(c, levels[2].cuts, 1, 500); for (const e of pieceLabs[2]) e.style.opacity = 1; eq.textContent = eqs[3]; await pulse(c, eq, 1.06); } },
      { cap: `So <b>1 ${U[3]} = 0.001 ${U[0]}</b>: tiny! 1 ${U[3]} is ${ZOOM[k].ref}.`, run: (c) => Promise.all(pieceLabs[2].map((e) => pulse(c, e, 1.15))) }
    ];
  }
};

/* =============================== explainer: referent picture cards =============================== */
function icon(kind) {
  const s = svgEl('svg', { viewBox: '0 0 156 140' });
  const E = (tag, a) => svgEl(tag, a, s);
  const T2 = (x, y, t, a = {}) => { const e = E('text', { x, y, 'font-size': 14, 'font-weight': 700, fill: '#5a4a2a', 'text-anchor': 'middle', 'font-family': 'system-ui, sans-serif', ...a }); e.textContent = t; return e; };
  const pal = { metal: '#c9ced8', wood: '#c8925a' };
  switch (kind) {
    case 'dime': E('circle', { cx: 52, cy: 70, r: 40, fill: pal.metal, stroke: '#7a808c', 'stroke-width': 3 }); E('circle', { cx: 52, cy: 70, r: 30, fill: 'none', stroke: '#9aa0ab', 'stroke-width': 2 }); T2(52, 76, '10¢', { 'font-size': 20 });
      E('rect', { x: 118, y: 30, width: 8, height: 80, fill: pal.metal, stroke: '#7a808c', 'stroke-width': 2 }); E('path', { d: 'M110 122 H134', stroke: RED, 'stroke-width': 2 }); T2(122, 136, 'edge'); break;
    case 'nail': E('path', { d: 'M48 140 V44 Q48 16 78 16 Q108 16 108 44 V140 Z', fill: '#f1c9a5', stroke: '#b98a62', 'stroke-width': 3 }); E('rect', { x: 61, y: 22, width: 34, height: 34, rx: 10, fill: '#fbe3e3', stroke: '#c98a8a', 'stroke-width': 2 });
      E('path', { d: 'M61 64 V72 M95 64 V72 M61 68 H95', stroke: RED, 'stroke-width': 2.5 }); break;
    case 'step': E('ellipse', { cx: 36, cy: 104, rx: 12, ry: 22, fill: '#6b5a3a' }); E('ellipse', { cx: 120, cy: 64, rx: 12, ry: 22, fill: '#6b5a3a' });
      E('path', { d: 'M36 128 H120', stroke: RED, 'stroke-width': 3 }); E('path', { d: 'M36 120 V136 M120 120 V136', stroke: RED, 'stroke-width': 3 }); T2(78, 122, '1 m step'); break;
    case 'door': E('rect', { x: 46, y: 10, width: 60, height: 124, fill: pal.wood, stroke: '#7a4a26', 'stroke-width': 3 }); E('circle', { cx: 96, cy: 74, r: 4, fill: '#e0a11b' });
      E('path', { d: 'M126 10 V134 M120 10 H132 M120 134 H132', stroke: RED, 'stroke-width': 3 }); T2(26, 76, 'knob'); T2(26, 92, '≈ 1 m'); break;
    case 'walk': E('path', { d: 'M14 120 C50 120 40 60 80 60 S120 20 144 20', stroke: '#9aa0ab', 'stroke-width': 8, fill: 'none', 'stroke-linecap': 'round', 'stroke-dasharray': '2 12' }); E('circle', { cx: 14, cy: 120, r: 7, fill: GRN }); E('circle', { cx: 144, cy: 20, r: 7, fill: RED });
      E('circle', { cx: 46, cy: 40, r: 22, fill: '#fff', stroke: INK, 'stroke-width': 3 }); E('path', { d: 'M46 40 V24 M46 40 L56 46', stroke: INK, 'stroke-width': 3 }); T2(110, 116, '12 min'); break;
    case 'clip': E('path', { d: 'M60 120 V40 Q60 22 78 22 Q96 22 96 40 V108 Q96 120 84 120 Q72 120 72 108 V50', fill: 'none', stroke: '#7a808c', 'stroke-width': 5, 'stroke-linecap': 'round' }); break;
    case 'carton': E('path', { d: 'M50 40 L78 14 L106 40 V132 H50 Z', fill: '#fff', stroke: '#1f5bd6', 'stroke-width': 3 }); E('path', { d: 'M50 40 H106', stroke: '#1f5bd6', 'stroke-width': 3 }); E('rect', { x: 56, y: 62, width: 44, height: 36, fill: '#cfe0fb' }); T2(78, 85, 'MILK', { fill: '#1f5bd6' }); T2(78, 124, '1 L'); break;
    case 'car': E('path', { d: 'M10 104 V86 Q14 74 32 72 L52 52 Q60 46 74 46 H108 Q120 46 130 60 L140 72 Q150 74 150 88 V104 Z', fill: '#c93a33' }); E('circle', { cx: 42, cy: 106, r: 14, fill: INK }); E('circle', { cx: 118, cy: 106, r: 14, fill: INK }); break;
    case 'drops': for (let i = 0; i < 20; i++) { const x = 22 + (i % 5) * 28, y = 22 + Math.floor(i / 5) * 30; E('path', { d: `M${x} ${y - 10} Q${x + 8} ${y + 2} ${x} ${y + 8} Q${x - 8} ${y + 2} ${x} ${y - 10} Z`, fill: '#5b9be0' }); } break;
    case 'spoon': E('ellipse', { cx: 52, cy: 70, rx: 30, ry: 20, fill: pal.metal, stroke: '#7a808c', 'stroke-width': 3 }); E('path', { d: 'M80 66 L148 52', stroke: '#7a808c', 'stroke-width': 8, 'stroke-linecap': 'round' }); break;
    case 'cup': E('path', { d: 'M38 30 H118 L108 130 H48 Z', fill: '#fff', stroke: INK, 'stroke-width': 3 }); E('path', { d: 'M42 60 H114 L108 130 H48 Z', fill: '#f2b84b' }); break;
    case 'thermo': E('rect', { x: 66, y: 8, width: 24, height: 106, rx: 12, fill: '#fff', stroke: INK, 'stroke-width': 3 }); E('circle', { cx: 78, cy: 120, r: 16, fill: RED }); E('rect', { x: 73, y: 50, width: 10, height: 70, fill: RED });
      [['100', 16], ['37', 50], ['20', 68], ['0', 92]].forEach(([s2, y]) => { E('path', { d: `M90 ${y} H100`, stroke: INK, 'stroke-width': 2 }); T2(122, y + 5, s2 + '°'); }); break;
  }
  return s;
}
const REF = {
  len: [['dime', '1 mm', 'the thickness of a dime'], ['nail', '1 cm', 'the width of your smallest fingernail'], ['step', '1 m', 'a long step, or a doorknob’s height'], ['door', '2 m', 'the height of a door'], ['walk', '1 km', 'about a 12-minute walk']],
  mass: [['clip', '1 g', 'a paper clip'], ['carton', '1 kg', 'a 1 L carton of water or milk'], ['car', '1 t', 'a small car (1000 kg)']],
  cap: [['drops', '1 mL', 'about 20 drops of water'], ['spoon', '5 mL', 'a teaspoon'], ['cup', '250 mL', 'a cup'], ['carton', '1 L', 'a carton of milk'], ['thermo', '°C', '0 freezes, 20 room, 37 body, 100 boils']]
};
const referents = {
  title: 'Referents: pictures of the units',
  height: 300,
  minW: 940,
  capH: 80,
  choices: [{ v: 'len', label: 'Length' }, { v: 'mass', label: 'Mass' }, { v: 'cap', label: 'Capacity and temperature' }],
  ask: (k) => `What everyday things are about the size of each ${{ len: 'length', mass: 'mass', cap: 'capacity' }[k]} unit?`,
  make(stage, k) {
    const L = REF[k], n = L.length, gap = 14, w = 172, x0 = (940 - (n * w + (n - 1) * gap)) / 2;
    const tiles = L.map(([ic, v, d], i) => { const t = hide(lab(stage, x0 + i * (w + gap), 16, `<div class="v">${v}</div><div class="d">${d}</div>`, 'u3l2-rt')); t.insertBefore(icon(ic), t.firstChild); return t; });
    return L.map(([, v, d], i) => ({ cap: `<b>${v}</b>${v === '°C' ? ' referents' : ''}: ${d}.${v === '1 kg' ? ' (1 L of water has a mass of about 1 kg.)' : v === '1 t' ? ' 1 t = 1000 kg.' : v === '1 km' ? ' 1 km = 1000 m.' : ''}`, run: (c) => pop(c, tiles[i]) }));
  }
};

/* =============================== explainer: sensible or not? =============================== */
const SENS = {
  door: { q: 'the height of a door', o: ['2000 mm', '2 m', '0.002 km'], ok: 1, why: ['correct, but a <b>huge</b> number', 'an easy number: <b>sensible</b>', 'correct, but a <b>tiny</b> number'], ex: false },
  i: { q: 'the height of a basketball hoop', o: ['3 cm', '3 m', '3 km'], ok: 1, why: ['3 fingernails: smaller than your hand', 'about 1½ doors', 'a 36-minute walk, straight up'] },
  ii: { q: 'the mass of a large egg', o: ['60 mg', '60 g', '60 kg'], ok: 1, why: ['less than one paper clip', 'about 60 paper clips', 'as heavy as an adult'] },
  iii: { q: 'what a bathtub holds', o: ['150 mL', '150 L', '15 000 L'], ok: 1, why: ['less than one cup', '150 milk cartons', 'a small swimming pool'] },
  iv: { q: 'the water in a hot bath', o: ['4 °C', '40 °C', '400 °C'], ok: 1, why: ['as cold as a fridge', 'a bit warmer than your body (37 °C)', 'far hotter than boiling water (100 °C)'] }
};
const sensible = {
  title: 'Sensible or not? Check with a referent',
  height: 300,
  minW: 940,
  capH: 80,
  choices: [{ v: 'door', label: 'a door' }, { sep: 'Example 3(b) check:' }, { v: 'i', label: '(i)' }, { v: 'ii', label: '(ii)' }, { v: 'iii', label: '(iii)' }, { v: 'iv', label: '(iv)' }],
  ask: (k) => `${SENS[k].ex === false ? 'Which is the most sensible way to give' : `Example 3(b)(${k}): which is the most reasonable for`} <b>${SENS[k].q}</b>?`,
  make(stage, k) {
    const S = SENS[k], xs = [160, 470, 780];
    const cards = S.o.map((s, i) => lab(stage, xs[i], 30, s, 'u3l2-opt'));
    const whys = S.why.map((s, i) => hide(lab(stage, xs[i], 160, s, 'u3l2-why')));
    const order = [0, 2, 1].filter((i) => i !== S.ok).concat([S.ok]);
    const stamps = S.o.map((_, i) => hide(stamp(stage, i === S.ok ? '✓' : '✗', { x: xs[i] + 112, y: 36, ok: i === S.ok, size: 'sm' })));
    return order.map((i) => ({
      cap: `<b>${S.o[i]}</b>: ${S.why[i].replace(/<\/?b>/g, '')}. ${i === S.ok ? (S.ex === false ? 'Choose the unit that gives an easy number.' : 'That makes sense: <b>' + S.o[i] + '</b>.') : (S.ex === false ? 'Not sensible.' : 'That doesn’t fit.')}`,
      run: async (c) => { await show(c, whys[i]); cards[i].classList.add(i === S.ok ? 'yes' : 'no'); await stampIn(c, stamps[i]); }
    }));
  }
};

/* =============================== explainer (Full): estimating with a referent =============================== */
const estimate = {
  title: 'Repeat the referent',
  height: 300,
  minW: 940,
  capH: 80,
  choices: [{ sep: 'Example 4 check:' }, { v: 'a', label: '(a) pencil' }, { v: 'b', label: '(b) wall' }, { v: 'c', label: '(c) paper clips' }, { v: 'd', label: '(d) soup pot' }],
  ask: (k) => ({ a: 'Example 4(a): a pencil is about 17 fingernails long. About how long is it?', b: 'Example 4(b): the gym wall is about 4 doors tall. About how tall is it?', c: 'Example 4(c): about what is the mass of 250 paper clips?', d: 'Example 4(d): a soup pot holds about as much as 6 milk cartons. About how much does it hold?' })[k],
  make(stage, k) {
    const svg = svgEl('svg', { class: 'u3l2-abs', width: 940, height: 300 }); add(stage, svg, 0, 0);
    const tile = hide(lab(stage, 700, 250, '', 'u3l2-tile fin u3l2-mid'));
    const count = lab(stage, 700, 200, '', 'u3l2-big u3l2-mid');
    const units = [];
    let ref, n, unit, step;
    if (k === 'a') {
      n = 17; unit = 'cm'; step = 1; ref = 'fingernail ≈ 1 cm';
      svgEl('path', { d: 'M40 70 H700 L740 90 L700 110 H40 Z', fill: '#f2c94c', stroke: '#9a7a10', 'stroke-width': 3 }, svg);
      svgEl('rect', { x: 20, y: 70, width: 30, height: 40, rx: 4, fill: '#f2a39b' }, svg);
      for (let i = 0; i < n; i++) units.push(svgEl('rect', { x: 50 + i * 38.8, y: 130, width: 36, height: 36, rx: 9, fill: '#fbe3e3', stroke: '#c98a8a', 'stroke-width': 2, opacity: 0 }, svg));
    } else if (k === 'b') {
      n = 4; unit = 'm'; step = 2; ref = 'door ≈ 2 m';
      svgEl('rect', { x: 60, y: 10, width: 260, height: 280, fill: '#e9dcc0', stroke: '#9a6a24', 'stroke-width': 3 }, svg);
      for (let i = 0; i < n; i++) units.push(svgEl('rect', { x: 340, y: 290 - (i + 1) * 70, width: 34, height: 68, fill: '#c8925a', stroke: '#7a4a26', 'stroke-width': 2, opacity: 0 }, svg));
    } else if (k === 'c') {
      n = 250; unit = 'g'; step = 1; ref = 'paper clip ≈ 1 g';
      for (let i = 0; i < n; i++) { const x = 30 + (i % 25) * 20, y = 30 + Math.floor(i / 25) * 24; units.push(svgEl('rect', { x, y, width: 8, height: 18, rx: 4, fill: 'none', stroke: '#7a808c', 'stroke-width': 2, opacity: 0 }, svg)); }
    } else {
      n = 6; unit = 'L'; step = 1; ref = 'milk carton = 1 L';
      for (let i = 0; i < n; i++) { const g = svgEl('g', { opacity: 0 }, svg); svgEl('path', { d: `M${40 + i * 70} 60 l18 -18 l18 18 v80 h-36 z`, fill: '#fff', stroke: BLUE, 'stroke-width': 2.5 }, g); units.push(g); }
      svgEl('path', { d: 'M90 190 H430 L410 290 H110 Z', fill: '#d6dbe3', stroke: INK, 'stroke-width': 3 }, svg);
      units.soup = svgEl('rect', { x: 100, y: 290, width: 320, height: 0, fill: '#e8a01e', opacity: 0.85 }, svg);
    }
    lab(stage, 700, 40, ref, 'u3l2-lab u3l2-mid');
    count.textContent = `0 ${unit}`; hide(count);
    const total = n * step;
    const fill = (c) => tween(c, k === 'c' ? 2000 : 220 * n, (t) => {
      const m = Math.round(t * n); units.forEach((u, i) => u.setAttribute('opacity', i < m ? 1 : 0));
      count.textContent = `${m * step} ${unit}`;
      if (units.soup) { const hh = 90 * t; units.soup.setAttribute('y', 290 - hh); units.soup.setAttribute('height', hh); }
    }, lin);
    const work = `${n}\\times${step}\\text{ ${unit}}=${total}\\text{ ${unit}}`;
    return [
      { cap: `The referent: <b>${ref}</b>.`, run: (c) => pop(c, count) },
      { cap: `Repeat it ${n} times${k === 'c' ? ' (10 rows of 25)' : ''}.`, run: (c) => fill(c) },
      { cap: `${T(work)}. About <b>${total} ${unit}</b>${k === 'c' ? ', a quarter of a kilogram' : ''}.`, run: async (c) => { tile.innerHTML = tex(work); await pop(c, tile); } }
    ];
  }
};

/* =============================== explainer: reading a ruler =============================== */
const RUL = { A: 2.4, B: 5.5, C: 8.9 };
const rulerEx = {
  title: 'Reading a metric ruler',
  height: 300,
  minW: 940,
  capH: 92,
  choices: [{ sep: 'Example 5 check:' }, { v: 'A', label: '(a) A' }, { v: 'B', label: 'B' }, { v: 'C', label: 'C' }, { v: 'bolt', label: '(b) bolt' }, { v: 'win', label: '(c) window' }],
  ask: (k) => (RUL[k] ? `Example 5(a): read the ruler at <b>${k}</b>, in centimetres and in millimetres.` : k === 'bolt' ? 'Example 5(b): how long is the bolt? Give your answer in cm and in mm.' : 'Example 5(c): the end of the window is at the arrow. Write the width in cm, in mm and in m.'),
  make(stage, k) {
    const svg = svgEl('svg', { class: 'u3l2-abs', width: 940, height: 300 }); add(stage, svg, 0, 0);
    const tile = hide(lab(stage, 470, 262, '', 'u3l2-tile fin u3l2-mid'));
    const lit = (R, v, color) => { const x = R.px(v); return svgEl('line', { x1: x, x2: x, y1: R.y - 6, y2: R.y + R.Hh + 6, stroke: color, 'stroke-width': 4, opacity: 0 }, svg); };
    // counted millimetre marks turn blue one at a time, with a running count under the ruler
    const mmNums = (R, v0, m) => { const list = Array.from({ length: m }, (_, i) => svgEl('line', { x1: R.px(v0 + (i + 1) / 10), x2: R.px(v0 + (i + 1) / 10), y1: R.y, y2: R.y + R.Hh * 0.5, stroke: BLUE, 'stroke-width': 4, opacity: 0 }, svg));
      list.cnt = hide(lab(stage, R.px(v0 + m / 20), R.y + R.Hh + 26, '', 'u3l2-lab b u3l2-mid')); return list; };
    const countMM = (c, list) => tween(c, 300 * list.length, (t) => { const m = Math.min(list.length, Math.floor(t * list.length + 0.999)); list.forEach((e, i) => e.setAttribute('opacity', i < m ? 1 : 0)); list.cnt.style.opacity = 1; list.cnt.textContent = `${m} mm`; }, lin);
    if (RUL[k] || k === 'win') {
      const win = k === 'win', from = win ? 120 : 0, v = win ? 126.8 : RUL[k], R = ruler(svg, 40, 110, 85, from, 10, { h: 70 });
      const P = pointer(svg, R.px(v), 110, win ? '' : k); P.setAttribute('opacity', 0);
      const whole = Math.floor(v + 1e-9), mm = Math.round((v - whole) * 10), cmL = lit(R, whole, GRN), nums = mmNums(R, whole, mm);
      const cm = win ? '126.8' : String(v), mmV = win ? '1268' : String(Math.round(v * 10));
      const steps = [];
      if (win) steps.push({ cap: 'A tape measure numbers every centimetre: 120, 121, 122, …', run: (c) => fadeAttr(c, P, 1, 300) });
      else steps.push({ cap: `Arrow <b>${k}</b> points between two centimetre numbers.`, run: (c) => fadeAttr(c, P, 1, 300) });
      steps.push({ cap: `The last full centimetre before the arrow is <b>${whole}</b>.`, run: (c) => fadeAttr(c, cmL, 1, 300) });
      steps.push({ cap: `Count the millimetre marks past it: <b>${mm}</b>${mm === 5 ? ' (the middle mark is 5 mm)' : ''}.`, run: (c) => countMM(c, nums) });
      steps.push({ cap: win ? `126 cm and 8 mm: <b>126.8 cm</b>. That is <b>1268 mm</b> (× 10) or <b>1.268 m</b> (÷ 100), about 1.27 m.` : `${whole} cm and ${mm} mm: <b>${cm} cm</b>, or <b>${mmV} mm</b>.`,
        run: async (c) => { tile.innerHTML = win ? '126.8 cm = 1268 mm = 1.268 m' : `${cm} cm = ${mmV} mm`; await pop(c, tile); } });
      return steps;
    }
    // the bolt
    const R = ruler(svg, 50, 120, 105, 0, 8, { h: 70 });
    const bolt = svgEl('rect', { x: R.px(1), y: 76, width: R.px(6.3) - R.px(1), height: 40, rx: 6, fill: '#9aa0ab', stroke: INK, 'stroke-width': 2.5 }, svg);
    svgEl('rect', { x: R.px(1), y: 70, width: 30, height: 52, rx: 4, fill: '#7a808c', stroke: INK, 'stroke-width': 2.5 }, svg);
    void bolt;
    const sL = lit(R, 1, AMB), eL = lit(R, 6.3, GRN);
    const sT = hide(lab(stage, R.px(1), 40, 'start: 1.0', 'u3l2-lab u3l2-mid')), eT = hide(lab(stage, R.px(6.3), 40, 'end: 6.3', 'u3l2-lab g u3l2-mid'));
    const br = svgEl('path', { d: `M${R.px(1)} 222 V232 H${R.px(6.3)} V222`, fill: 'none', stroke: RED, 'stroke-width': 3, opacity: 0 }, svg);
    return [
      { cap: 'The bolt does <b>not</b> start at 0. It starts at the <b>1 cm</b> mark.', run: async (c) => { await fadeAttr(c, sL, 1, 300); await show(c, sT); } },
      { cap: 'The other end is 3 mm past 6 cm: the end reading is <b>6.3 cm</b>.', run: async (c) => { await fadeAttr(c, eL, 1, 300); await show(c, eT); } },
      { cap: `Length = end − start: ${T('6.3-1.0=5.3')} cm. The bolt is <b>5.3 cm</b>, or <b>53 mm</b>, long.`, run: async (c) => { await fadeAttr(c, br, 1, 300); tile.textContent = '6.3 − 1.0 = 5.3 cm = 53 mm'; await pop(c, tile); } }
    ];
  }
};

/* =============================== explainer: the staircase with the hopping decimal point =============================== */
const ST = {
  a: ['3.45', 'm', 'cm'], b: ['2.6', 'km', 'm'], c: ['85', 'mm', 'cm'], d: ['640', 'cm', 'm'],
  e: ['1250', 'g', 'kg'], f: ['0.75', 'L', 'mL'], g: ['4', 'mm', 'm'], h: ['2.5', 'cm', 'mm']
};
const stairsEx = {
  title: 'The staircase: the decimal point hops',
  height: 340,
  minW: 940,
  capH: 92,
  choices: [{ sep: 'Example 6 check:' }, ...'abcdefgh'.split('').map((k) => ({ v: k, label: `(${k}) ${nf(ST[k][0])} ${ST[k][1]}` }))],
  ask: (k) => `Example 6(${k}): change <b>${nf(ST[k][0])} ${ST[k][1]}</b> to <b>${ST[k][2]}</b>.`,
  make(stage, k) {
    const [v, from, to] = ST[k], base = baseOf(from), i0 = idxOf(from), i1 = idxOf(to), kk = i1 - i0, down = kk > 0, n = Math.abs(kk);
    const res = shift(v, kk);
    const svg = svgEl('svg', { class: 'u3l2-abs', width: 940, height: 340 }); add(stage, svg, 0, 0);
    const S = stairs(svg, 24, 42, { base, w: 118, h: 54, dy: 24, gap: 130 });
    // the digits
    const [ip, fp = ''] = v.split('.'), ds0 = ip + fp, p = ip.length;
    const nl = Math.max(0, 1 - (p + kk)), nr = Math.max(0, p + kk - ds0.length), cells = '0'.repeat(nl) + ds0 + '0'.repeat(nr), p0 = p + nl, p1 = p0 + kk;
    const cw = 42, cy = 298, cx0 = 400 - cells.length * cw / 2;
    const cellEls = cells.split('').map((d, i) => { const e = lab(stage, cx0 + (i + 0.5) * cw, cy, d, 'u3l2-cell' + (i < nl || i >= nl + ds0.length ? ' pad' : '')); if (i < nl || i >= nl + ds0.length) e.style.opacity = 0; return e; });
    // insignificant cells at the end (leading zeros before the units digit, trailing zeros after the point)
    let firstSig = 0; while (firstSig < p1 - 1 && cells[firstSig] === '0') firstSig++;
    let lastSig = cells.length - 1; while (lastSig >= p1 && cells[lastSig] === '0') lastSig--;
    const dot = lab(stage, cx0 + p0 * cw, cy + 22, '', 'u3l2-pt');
    const unitEl = lab(stage, cx0 + cells.length * cw + 22, cy, from, 'u3l2-unit');
    // hops
    const hopEls = [];
    for (let j = 0; j < n; j++) {
      const a = S.boxes[i0 + (down ? j : -j)], b = S.boxes[i0 + (down ? j + 1 : -j - 1)], col = down ? BLUE : PUR;
      const x1 = a.cx, y1 = a.y - 2, x2 = b.cx, y2 = b.y - 2, mx = (x1 + x2) / 2, my = Math.min(y1, y2) - 18;
      const g = svgEl('g', { opacity: 0 }, svg);
      svgEl('path', { d: `M${x1} ${y1} Q${mx} ${my - 14} ${x2} ${y2}`, fill: 'none', stroke: col, 'stroke-width': 3.5 }, g);
      arrowHead(g, x2, y2, (x2 - mx) / 40, 1, { color: col, width: 3.5 });
      txt(g, mx, my - 14, down ? '× 10' : '÷ 10', 'u3l2-hop', { fill: col });
      hopEls.push(g);
    }
    const mark = (i, color) => { S.boxes[i].r.setAttribute('stroke', color); S.boxes[i].r.setAttribute('stroke-width', 5); };
    const tile = hide(lab(stage, 770, 298, '', 'u3l2-tile fin u3l2-mid'));
    const vT = nf(v), rT = nf(res);
    const opT = down ? `\\times${POW[n]}` : `\\div${POW[n]}`;
    return [
      { cap: `Find the unit you have, <b>${from}</b>, and the unit you want, <b>${to}</b>, on the staircase.`, run: async (c) => { mark(i0, AMB); mark(i1, GRN); await Promise.all([pulse(c, S.boxes[i0].g, 1.04), pulse(c, S.boxes[i1].g, 1.04)]); } },
      { cap: `From ${from} to ${to} is <b>${n} step${n > 1 ? 's' : ''} ${down ? 'down' : 'up'}</b>, so ${down ? 'multiply' : 'divide'} by ${POW[n].replace('\\,', ' ')}: ${T(`${nt(v)}${opT}`)}.`, run: (c) => fadeAttr(c, hopEls, 1, 320, 300) },
      { cap: `${down ? 'Down' : 'Up'}: move the decimal point <b>${n} place${n > 1 ? 's' : ''} ${down ? 'right' : 'left'}</b>${nl || nr ? ', and fill the empty places with zeros' : ''}.`,
        run: async (c) => {
          for (let j = 1; j <= n; j++) {
            const x0 = parseFloat(dot.style.left), x1 = cx0 + (p0 + (down ? j : -j)) * cw;
            await tween(c, 420, (t) => { dot.style.left = (x0 + (x1 - x0) * t) + 'px'; dot.style.top = (cy + 22 - 30 * Math.sin(Math.PI * t)) + 'px'; });
          }
          cellEls.forEach((e, i) => { if (e.style.opacity === '0') e.style.opacity = 1; });
          cellEls.forEach((e, i) => { if (i < firstSig || i > lastSig) e.style.opacity = 0.18; });
          unitEl.textContent = to; await pulse(c, unitEl, 1.1);
        } },
      { cap: `${vT} ${from} = <b>${rT} ${to}</b>. ${down ? 'Smaller unit, bigger number' : 'Bigger unit, smaller number'}: it makes sense.`, run: async (c) => { tile.innerHTML = `${vT} ${from} = ${rT} ${to}`; await pop(c, tile); } }
    ];
  }
};

/* =============================== explainer (Full): count every step =============================== */
const TRAP = {
  mm: { v: '2.8', from: 'm', to: 'mm', wrong: '280', why: '280 mm is only 28 cm, about a ruler. A 2.8 m board is much longer than that.' },
  km: { v: '7.5', from: 'km', to: 'm', wrong: '0.0075', why: '0.0075 m is less than a centimetre! A 7.5 km road can’t be that short.' }
};
const trap = {
  title: 'Two common mistakes',
  height: 300,
  minW: 940,
  capH: 92,
  choices: [{ v: 'mm', label: '2.8 m to mm' }, { v: 'km', label: '7.5 km to m' }],
  ask: (k) => `Change <b>${TRAP[k].v} ${TRAP[k].from}</b> to <b>${TRAP[k].to}</b>. A student wrote <b>${TRAP[k].wrong} ${TRAP[k].to}</b>. What went wrong?`,
  make(stage, k) {
    const D = TRAP[k], i0 = idxOf(D.from), i1 = idxOf(D.to), n = i1 - i0, base = baseOf(D.from), res = shift(D.v, n);
    const svg = svgEl('svg', { class: 'u3l2-abs', width: 940, height: 300 }); add(stage, svg, 0, 0);
    const xs = [], boxes = [];
    for (let j = 0; j <= n; j++) { const x = 60 + j * 150, i = i0 + j; xs.push(x); const r = svgEl('rect', { x, y: 30, width: 110, height: 56, rx: 8, fill: '#f6f1e7', stroke: '#8f8676', 'stroke-width': 2 }, svg); txt(svg, x + 55, 66, PRE[i] + base, 'u3l2-sb'); boxes.push(r); }
    const hops = [];
    for (let j = 0; j < n; j++) { const g = svgEl('g', { opacity: 0 }, svg); svgEl('path', { d: `M${xs[j] + 90} 30 Q${xs[j] + 130} 0 ${xs[j + 1] + 20} 30`, fill: 'none', stroke: BLUE, 'stroke-width': 3.5 }, g); txt(g, xs[j] + 130, 12, '× 10', 'u3l2-hop', { fill: BLUE }); hops.push(g); }
    const wrongC = hide(lab(stage, 60, 130, `${k === 'mm' ? 'Only 2 steps: × 100' : 'Divided: ÷ 1000'} → <b>${D.wrong} ${D.to}</b>`, 'u3l2-lab r'));
    const whyC = hide(lab(stage, 60, 168, D.why, 'u3l2-lab sm'));
    const rightC = hide(lab(stage, 60, 226, `${n} steps down: × ${POW[n]} → <b>${nf(res)} ${D.to}</b>`, 'u3l2-lab g'));
    const sNo = hide(stamp(stage, '✗', { x: 640, y: 140, ok: false })), sOk = hide(stamp(stage, '✓', { x: 640, y: 236, ok: true }));
    return [
      { cap: `Count every step from ${D.from} to ${D.to}: ${Array.from({ length: n + 1 }, (_, j) => PRE[i0 + j] + base).join(', ')}. That is <b>${n} steps down</b>.`, run: (c) => fadeAttr(c, hops, 1, 300, 250) },
      { cap: `The student’s answer: <b>${D.wrong} ${D.to}</b>. Does it make sense? ${D.why}`, run: async (c) => { await show(c, wrongC); await show(c, whyC); await stampIn(c, sNo); } },
      { cap: `Smaller unit ⇒ bigger number. ${n} steps down is ${T(`\\times${POW[n]}`)}: ${D.v} ${D.from} = <b>${nf(res)} ${D.to}</b>.`, run: async (c) => { await show(c, rightC); await stampIn(c, sOk); } }
    ];
  }
};

/* =============================== explainer (Full): the place-value chart of units =============================== */
const PCH = { a: ['3.45', 'm', 'cm'], b: ['2.6', 'km', 'm'], d: ['640', 'cm', 'm'], g: ['4', 'mm', 'm'] };
const placeChart = {
  title: 'Another way: a place-value chart of units',
  height: 220,
  minW: 940,
  capH: 92,
  choices: [{ sep: 'Example 6:' }, ...Object.keys(PCH).map((k) => ({ v: k, label: `(${k}) ${nf(PCH[k][0])} ${PCH[k][1]} to ${PCH[k][2]}` }))],
  ask: (k) => `Use a place-value chart to change <b>${nf(PCH[k][0])} ${PCH[k][1]}</b> to <b>${PCH[k][2]}</b>.`,
  make(stage, k) {
    const [v, from, to] = PCH[k], U = ['km', 'hm', 'dam', 'm', 'dm', 'cm', 'mm'], i0 = U.indexOf(from), i1 = U.indexOf(to);
    const [ip, fp = ''] = v.split('.'), start = i0 - ip.length + 1, digs = (ip + fp).split('');
    const tbl = h('table', 'u3l2-abs u3l2-pc'); tbl.innerHTML = `<tr>${U.map((u) => `<th>${u}</th>`).join('')}</tr><tr>${U.map(() => '<td></td>').join('')}</tr>`;
    add(stage, tbl, 106, 30);
    const tds = [...tbl.querySelectorAll('td')];
    digs.forEach((d, j) => { const td = tds[start + j]; if (td) { td.textContent = d; td.style.opacity = 0; } });
    const colX = (i) => 106 + 2 + i * 106 + 104;   // right edge of column i
    const dot = hide(lab(stage, colX(i0), 120, '', 'u3l2-pt'));
    const lo = Math.min(start, i1 - 0), hi = Math.max(start + digs.length - 1, i1);
    const pads = []; for (let i = lo; i <= hi; i++) if (!tds[i].textContent) { tds[i].textContent = '0'; tds[i].classList.add('pad'); tds[i].style.opacity = 0; pads.push(tds[i]); }
    const res = shift(v, i1 - i0);
    const tile = hide(lab(stage, 470, 186, `${nf(v)} ${from} = ${nf(res)} ${to}`, 'u3l2-tile fin u3l2-mid'));
    return [
      { cap: `Write ${nf(v)} ${from} with its ones digit (${ip.slice(-1)}) in the <b>${from}</b> column. The decimal point sits just after the ${from} column.`,
        run: async (c) => { tds[i0].classList.add('hl'); for (let j = 0; j < digs.length; j++) { const td = tds[start + j]; if (td) await fadeIn(c, td, 200); } await pop(c, dot); } },
      { cap: `To read it in <b>${to}</b>, the point moves to just after the <b>${to}</b> column.`,
        run: async (c) => { tds[i0].classList.remove('hl'); tds[i1].classList.add('hl'); const x0 = colX(i0), x1 = colX(i1); await tween(c, 700, (t) => { dot.style.left = (x0 + (x1 - x0) * t) + 'px'; dot.style.top = (120 - 30 * Math.sin(Math.PI * t)) + 'px'; }); } },
      { cap: `${pads.length ? 'Fill the empty columns with zeros and read' : 'Read'} the number: ${nf(v)} ${from} = <b>${nf(res)} ${to}</b>.`, run: async (c) => { for (const p of pads) await fadeIn(c, p, 200); await pop(c, tile); } }
    ];
  }
};

/* =============================== explainer: comparing =============================== */
const compare = {
  title: 'Same unit first, then compare',
  height: 320,
  minW: 940,
  capH: 92,
  choices: [{ sep: 'Example 7 check:' }, { v: 'a', label: '(a) 0.8 m or 75 cm' }, { v: 'b', label: '(b) bottle or cans' }, { v: 'c', label: '(c) long jump' }],
  ask: (k) => ({ a: 'Example 7(a): which is longer, 0.8 m or 75 cm?', b: 'Example 7(b): which holds more, one 1.5 L bottle or four 355 mL cans?', c: 'Example 7(c): Sana 4.35 m, Theo 428 cm, Uma 4410 mm, Vic 0.0043 km. Order the jumps from shortest to longest. Who won?' })[k],
  make(stage, k) {
    const svg = svgEl('svg', { class: 'u3l2-abs', width: 940, height: 320 }); add(stage, svg, 0, 0);
    const bar = (y, fill) => svgEl('rect', { x: 260, y, width: 0, height: 44, rx: 6, fill, stroke: INK, 'stroke-width': 2 }, svg);
    if (k === 'a') {
      const px = (cm) => cm * 7.5;
      for (let v = 0; v <= 80; v += 10) { svgEl('line', { x1: 260 + px(v), x2: 260 + px(v), y1: 240, y2: 252, stroke: INK, 'stroke-width': 2 }, svg); txt(svg, 260 + px(v), 272, v, 'u3l2-rn'); }
      txt(svg, 260 + px(80) + 40, 272, 'cm', 'u3l2-rn');
      const b1 = bar(70, '#f2b84b'), b2 = bar(150, '#9cc0f0');
      const l1 = lab(stage, 30, 92, '0.8 m', 'u3l2-big u3l2-ml'), l2 = lab(stage, 30, 172, '75 cm', 'u3l2-big u3l2-ml');
      const s = hide(stamp(stage, 'longer by 5 cm', { x: 560, y: 36, ok: true, size: 'sm' }));
      return [
        { cap: `Different units. Change 0.8 m to cm: m to cm is 2 steps down, ${T('0.8\\times100=80')} cm.`, run: async (c) => { l1.innerHTML = '0.8 m = <b>80 cm</b>'; await pulse(c, l1, 1.08); } },
        { cap: 'Now both are in cm: draw them on the same scale. 80 cm and 75 cm.', run: (c) => tween(c, 900, (t) => { b1.setAttribute('width', px(80) * t); b2.setAttribute('width', px(75) * t); }) },
        { cap: '80 cm is more than 75 cm, so <b>0.8 m is longer</b> (by 5 cm).', run: (c) => stampIn(c, s) }
      ];
    }
    if (k === 'b') {
      const ml = (v) => v * 0.15, yb = 290;
      const bot = svgEl('rect', { x: 110, y: yb, width: 110, height: 0, fill: '#c93a33', opacity: 0.8 }, svg);
      svgEl('path', { d: `M110 ${yb} V${yb - ml(1500) - 4} H220 V${yb}`, fill: 'none', stroke: INK, 'stroke-width': 3 }, svg);
      const cans = [0, 1, 2, 3].map((i) => svgEl('rect', { x: 540, y: yb - ml(355) * (i + 1), width: 110, height: ml(355), fill: '#9cc0f0', stroke: INK, 'stroke-width': 2, opacity: 0 }, svg));
      lab(stage, 165, 30, '1.5 L bottle', 'u3l2-lab u3l2-mid'); lab(stage, 595, 30, 'four 355 mL cans', 'u3l2-lab u3l2-mid');
      const vb = hide(lab(stage, 236, 100, `${T('1.5\\times1000=1500')} mL`, 'u3l2-big u3l2-ml')), vc = hide(lab(stage, 666, 160, `${T('4\\times355=1420')} mL`, 'u3l2-big u3l2-ml'));
      const s = hide(stamp(stage, 'bottle: 80 mL more', { x: 330, y: 230, ok: true, size: 'sm' }));
      return [
        { cap: `Change the bottle to mL: L to mL is 3 steps down, ${T('1.5\\times1000=1500')} mL.`, run: async (c) => { await show(c, vb); await tween(c, 800, (t) => { bot.setAttribute('height', ml(1500) * t); bot.setAttribute('y', yb - ml(1500) * t); }); } },
        { cap: `The cans: ${T('4\\times355=1420')} mL.`, run: async (c) => { await fadeAttr(c, cans, 1, 260, 220); await show(c, vc); } },
        { cap: '1500 mL is more than 1420 mL. <b>The bottle holds more</b>, by 80 mL.', run: (c) => stampIn(c, s) }
      ];
    }
    const J = [['Sana', '4.35 m', 435, '4.35\\times100=435'], ['Theo', '428 cm', 428, '428'], ['Uma', '4410 mm', 441, '4410\\div10=441'], ['Vic', '0.0043 km', 430, '0.0043\\times100\\,000=430']];
    const px = (cm) => (cm - 400) * 13, rows = J.map((j, i) => {
      const y = 22 + i * 64, b = svgEl('rect', { x: 220, y, width: 0, height: 44, rx: 6, fill: ['#f2b84b', '#9cc0f0', '#b9e0c8', '#d7c2f0'][i], stroke: INK, 'stroke-width': 2 }, svg);
      const n = lab(stage, 20, y + 22, `<b>${j[0]}</b> ${j[1]}`, 'u3l2-lab u3l2-ml');
      return { b, n, y, j };
    });
    for (let v = 400; v <= 450; v += 10) { svgEl('line', { x1: 220 + px(v), x2: 220 + px(v), y1: 278, y2: 290, stroke: INK, 'stroke-width': 2 }, svg); txt(svg, 220 + px(v), 310, v, 'u3l2-rn'); }
    txt(svg, 220 + px(450) + 34, 310, 'cm', 'u3l2-rn');
    const order = [1, 3, 0, 2];
    const medal = hide(stamp(stage, 'Uma wins!', { x: 220 + px(441) + 90, y: 22 + 3 * 64 + 22, ok: true, size: 'sm' }));
    return [
      { cap: 'Change every jump to <b>cm</b>: Sana 4.35 × 100 = 435, Theo 428, Uma 4410 ÷ 10 = 441, Vic 0.0043 km = 4.3 m = 430 cm.',
        run: async (c) => { for (const r of rows) { r.n.innerHTML = `<b>${r.j[0]}</b> ${r.j[2]} cm`; await pulse(c, r.n, 1.08); } } },
      { cap: 'Draw them on one scale (from 400 cm).', run: (c) => tween(c, 900, (t) => rows.forEach((r) => r.b.setAttribute('width', px(r.j[2]) * t))) },
      { cap: 'Shortest to longest: <b>Theo</b> (428 cm), <b>Vic</b> (430 cm), <b>Sana</b> (435 cm), <b>Uma</b> (441 cm).',
        run: (c) => tween(c, 900, (t) => order.forEach((ri, pos) => { const r = rows[ri], y = r.y + (22 + pos * 64 - r.y) * easeIO(t); r.b.setAttribute('y', y); r.n.style.top = (y + 22) + 'px'; })) },
      { cap: '<b>Uma won</b> with 441 cm.', run: (c) => stampIn(c, medal) }
    ];
  }
};

/* =============================== explainer: lemonade and laps =============================== */
const lemonade = {
  title: 'One unit, then work it out',
  height: 320,
  minW: 940,
  capH: 92,
  choices: [{ sep: 'Example 8 check:' }, { v: 'a1', label: '(a)(i) cups from a jug' }, { v: 'a2', label: '(a)(ii) jugs for 50 cups' }, { v: 'b', label: '(b) Owen’s run' }],
  ask: (k) => ({ a1: 'Example 8(a)(i): each cup holds 250 mL. A jug holds 4 L. How many cups can Marisol fill from one jug?', a2: 'Example 8(a)(ii): how many 4 L jugs does she need to make to fill 50 cups of 250 mL?', b: 'Example 8(b): Owen runs 3 laps of a 400 m track, then 1.8 km on the road. How far does he run, in km?' })[k],
  make(stage, k) {
    const svg = svgEl('svg', { class: 'u3l2-abs', width: 940, height: 320 }); add(stage, svg, 0, 0);
    const tile = hide(lab(stage, 470, 290, '', 'u3l2-tile fin u3l2-mid'));
    const jug = (x, y, s = 1) => { const g = svgEl('g', {}, svg); const lvl = svgEl('rect', { x: x + 6 * s, y: y + 150 * s, width: 108 * s, height: 0, fill: '#f2d64b' }, g); svgEl('path', { d: `M${x} ${y} H${x + 120 * s} V${y + 156 * s} H${x} Z`, fill: 'none', stroke: INK, 'stroke-width': 3 }, g); svgEl('path', { d: `M${x + 120 * s} ${y + 30 * s} q${30 * s} 10 ${30 * s} ${40 * s} t${-30 * s} ${40 * s}`, fill: 'none', stroke: INK, 'stroke-width': 3 }, g); return { g, lvl, set: (f) => { const hh = 144 * s * f; lvl.setAttribute('y', y + 150 * s - hh); lvl.setAttribute('height', hh); } }; };
    const cup = (x, y, w = 40) => { const g = svgEl('g', {}, svg); const f = svgEl('path', { d: `M${x + 3} ${y + 4} H${x + w - 3} L${x + w - 7} ${y + w * 1.1} H${x + 7} Z`, fill: '#f2d64b', opacity: 0 }, g); svgEl('path', { d: `M${x} ${y} H${x + w} L${x + w - 5} ${y + w * 1.15} H${x + 5} Z`, fill: 'none', stroke: INK, 'stroke-width': 2 }, g); return f; };
    if (k === 'a1') {
      const J = jug(60, 50); J.set(1);
      lab(stage, 120, 30, '4 L', 'u3l2-big u3l2-mid');
      const cups = Array.from({ length: 16 }, (_, i) => cup(340 + (i % 8) * 64, 60 + Math.floor(i / 8) * 90, 46));
      const cnt = lab(stage, 120, 232, '', 'u3l2-lab u3l2-mid');
      return [
        { cap: `Same unit first: a cup is in mL, so change the jug to mL. L to mL is 3 steps down: ${T('4\\times1000=4000')} mL.`, run: async (c) => { cnt.textContent = '4000 mL'; await pop(c, cnt); } },
        { cap: 'Pour 250 mL into each cup until the jug is empty.', run: (c) => tween(c, 3200, (t) => { const m = Math.floor(t * 16 + 1e-9); cups.forEach((f, i) => f.setAttribute('opacity', i < m ? 1 : 0)); J.set(1 - m / 16); cnt.textContent = `${4000 - 250 * m} mL left`; }, lin) },
        { cap: `${T('4000\\div250=16')}. She can fill <b>16 cups</b> from one jug.`, run: async (c) => { tile.innerHTML = tex('4000\\div250=16\\text{ cups}'); await pop(c, tile); } }
      ];
    }
    if (k === 'a2') {
      const cups = Array.from({ length: 50 }, (_, i) => cup(30 + (i % 10) * 40, 30 + Math.floor(i / 10) * 44, 28));
      const jugs = [0, 1, 2, 3].map((i) => { const J = jug(470 + i * 112, 70, 0.62); J.g.setAttribute('opacity', 0); return J; });
      const t1 = hide(lab(stage, 470, 30, `${T('50\\times250=12\\,500')} mL = 12.5 L`, 'u3l2-lab')), t2 = hide(lab(stage, 470, 196, `${T('12.5\\div4=3.125')} jugs`, 'u3l2-lab'));
      const s = hide(stamp(stage, 'make 4 jugs', { x: 760, y: 250, ok: true, size: 'sm' }));
      return [
        { cap: `50 cups of 250 mL: ${T('50\\times250=12\\,500')} mL. mL to L is 3 steps up: ${T('12\\,500\\div1000=12.5')} L.`, run: async (c) => { await tween(c, 1500, (t) => cups.forEach((f, i) => f.setAttribute('opacity', i < t * 50 ? 1 : 0)), lin); await show(c, t1); } },
        { cap: `Each jug is 4 L: ${T('12.5\\div4=3.125')} jugs. Three full jugs, and a little more.`, run: async (c) => { await show(c, t2); for (let i = 0; i < 4; i++) { await fadeAttr(c, jugs[i].g, 1, 200); await tween(c, 400, (t) => jugs[i].set((i < 3 ? 1 : 0.125) * t)); } } },
        { cap: '3 jugs are not enough (only 12 L). She needs to make <b>4 jugs</b>.', run: (c) => stampIn(c, s) }
      ];
    }
    // Owen
    const cx = 200, cy = 130, rx = 150, ry = 80;
    svgEl('ellipse', { cx, cy, rx, ry, fill: 'none', stroke: '#c96a3a', 'stroke-width': 18 }, svg);
    svgEl('ellipse', { cx, cy, rx: rx - 18, ry: ry - 18, fill: '#bfe0b0' }, svg);
    const dot = svgEl('circle', { cx: cx, cy: cy + ry, r: 11, fill: BLUE, stroke: '#fff', 'stroke-width': 3 }, svg);
    const lapT = lab(stage, cx, cy, '0 m', 'u3l2-big u3l2-mid');
    const kmx = (v) => 420 + v * 160;
    for (let v = 0; v <= 3; v += 0.5) { svgEl('line', { x1: kmx(v), x2: kmx(v), y1: 214, y2: 226, stroke: INK, 'stroke-width': 2 }, svg); txt(svg, kmx(v), 246, v, 'u3l2-rn'); }
    txt(svg, kmx(3) + 30, 246, 'km', 'u3l2-rn');
    const tb = svgEl('rect', { x: kmx(0), y: 160, width: 0, height: 44, fill: '#c96a3a' }, svg), rb = svgEl('rect', { x: kmx(1.2), y: 160, width: 0, height: 44, fill: '#9aa0ab' }, svg);
    const t1 = hide(lab(stage, kmx(0.6), 140, 'track 1.2 km', 'u3l2-lab u3l2-mid')), t2 = hide(lab(stage, kmx(2.1), 140, 'road 1.8 km', 'u3l2-lab u3l2-mid'));
    return [
      { cap: `3 laps of 400 m: ${T('3\\times400=1200')} m.`, run: (c) => tween(c, 3000, (t) => { const a = t * 3 * 2 * Math.PI; dot.setAttribute('cx', cx + rx * Math.sin(a)); dot.setAttribute('cy', cy + ry * Math.cos(a)); lapT.textContent = `${Math.round(t * 1200)} m`; }, lin) },
      { cap: `The answer must be in km. m to km is 3 steps up: ${T('1200\\div1000=1.2')} km.`, run: async (c) => { await tween(c, 700, (t) => tb.setAttribute('width', (kmx(1.2) - kmx(0)) * t)); await show(c, t1); } },
      { cap: `Add the road: ${T('1.2+1.8=3.0')} km. <b>Owen runs 3 km.</b>`, run: async (c) => { await tween(c, 700, (t) => rb.setAttribute('width', (kmx(3) - kmx(1.2)) * t)); await show(c, t2); tile.innerHTML = tex('1.2+1.8=3.0\\text{ km}'); await pop(c, tile); } }
    ];
  }
};

/* =============================== wiring =============================== */
mountFigures();
mountExplainers({ zoom, referents, sensible, estimate, ruler: rulerEx, stairs: stairsEx, trap, placeChart, compare, lemonade });

/* ============ Math History: the metre from the North Pole ============ */
function metreStory() {
  const svg = document.getElementById('u3l2-hist'); if (!svg) return;
  const NSV = 'http://www.w3.org/2000/svg', E = (tag, a, p) => { const e = document.createElementNS(NSV, tag); for (const k in a) e.setAttribute(k, a[k]); (p || svg).appendChild(e); return e; };
  const TX = (x, y, s, cls, p) => { const t = E('text', { x, y, class: cls }, p); t.textContent = s; return t; };
  svg.innerHTML = '';
  E('rect', { x: 0, y: 0, width: 600, height: 300, rx: 14, fill: '#fffaf1' });
  const cx = 160, cy = 150, R = 110;
  E('circle', { cx, cy, r: R, fill: '#e6eef6', stroke: '#4a2c14', 'stroke-width': 3 });
  E('path', { d: `M${cx - R} ${cy} H${cx + R}`, stroke: '#7a4a26', 'stroke-width': 2, 'stroke-dasharray': '6 5' });
  TX(cx + R + 8, cy + 5, 'equator', 'u3l2-hsm').setAttribute('text-anchor', 'start');
  TX(cx, cy - R - 8, 'North Pole', 'u3l2-hsm');
  // the quarter meridian through Paris, from the pole down to the equator
  const arc = E('path', { d: `M${cx} ${cy - R} A${R} ${R} 0 0 1 ${cx + R} ${cy}`, fill: 'none', stroke: '#b07a12', 'stroke-width': 6, 'stroke-linecap': 'round' });
  const L = Math.PI * R / 2; arc.setAttribute('stroke-dasharray', `${L} ${L}`);
  const paris = E('circle', { cx: cx + R * Math.sin(0.72), cy: cy - R * Math.cos(0.72), r: 6, fill: '#c93a33' });
  const pT = TX(cx + R * Math.sin(0.72) + 10, cy - R * Math.cos(0.72) - 6, 'Paris', 'u3l2-hsm'); pT.setAttribute('text-anchor', 'start');
  const yr = TX(450, 44, '1791', 'u3l2-hyr');
  const c1 = TX(450, 92, '', 'u3l2-hcap'), c2 = TX(450, 120, '', 'u3l2-hcap');
  const bar = E('rect', { x: 330, y: 170, width: 240, height: 22, rx: 4, fill: '#c9ced8', stroke: '#4a2c14', 'stroke-width': 2, opacity: 0 });
  const barT = TX(450, 216, '1799: a platinum bar, 1 m long', 'u3l2-hsm'); barT.setAttribute('opacity', 0);
  const beam = E('line', { x1: 330, y1: 256, x2: 330, y2: 256, stroke: '#e0a11b', 'stroke-width': 5, 'stroke-linecap': 'round' });
  const beamT = TX(450, 288, '1983: light, 1/299 792 458 of a second', 'u3l2-hsm'); beamT.setAttribute('opacity', 0);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let raf = 0;
  const draw = (t) => {
    const a = Math.min(1, t / 3); arc.setAttribute('stroke-dashoffset', L * (1 - a));
    paris.setAttribute('opacity', t > 1.4 ? 1 : 0); pT.setAttribute('opacity', t > 1.4 ? 1 : 0);
    c1.textContent = t > 3 ? 'pole to equator' : ''; c2.textContent = t > 3.6 ? '= 10 000 000 metres' : '';
    yr.textContent = t > 7.4 ? (t > 10 ? '1983' : '1799') : '1791';
    bar.setAttribute('opacity', Math.min(1, Math.max(0, (t - 7) / 0.6))); barT.setAttribute('opacity', Math.min(1, Math.max(0, (t - 7.4) / 0.6)));
    const b = Math.min(1, Math.max(0, (t - 10) / 1.5)); beam.setAttribute('x2', 330 + 240 * b); beamT.setAttribute('opacity', b > 0 ? 1 : 0);
  };
  const play = () => {
    cancelAnimationFrame(raf);
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
metreStory();

/* ============ Stand Up Break! — prefixes, conversions, comparing and problems ============ */
{
  const LEN = ['km', 'm', 'cm', 'mm'], MASS = ['kg', 'g', 'mg'], CAP = ['L', 'mL'];
  const conv = (r, list) => {
    let a, b; do { a = r.pick(list); b = r.pick(list); } while (a === b);
    const n = idxOf(b) - idxOf(a), v = n > 0 ? r.pick([String(r.int(1, 9)) + '.' + r.int(1, 9), String(r.int(2, 40)) + '.' + r.int(1, 9) + r.int(1, 9), String(r.int(1, 9))]) : r.pick([String(r.int(12, 950)), String(r.int(1, 9) * 100 + r.int(1, 9) * 5), String(r.int(2, 9)) + '.' + r.int(1, 9)]);
    return { a, b, n, v, res: shift(v, n) };
  };
  standup('u3l2', {
    intro: 'Use the staircase: count the steps, then move the decimal point. Smaller unit ⇒ bigger number.',
    levels: {
      BEG: (r) => r.pick([
        () => { const [u, b] = r.pick([['km', 'm'], ['m', 'cm'], ['m', 'mm'], ['cm', 'mm'], ['kg', 'g'], ['g', 'mg'], ['L', 'mL'], ['t', 'kg']]); const n = u === 't' ? 1000 : Math.pow(10, idxOf(b) - idxOf(u)); return { text: 'Complete the statement.', q: `1\\text{ ${u}}=\\ ?\\text{ ${b}}`, a: [`1\\text{ ${u}}=${n}\\text{ ${b}}`] }; },
        () => { const i = r.pick([0, 1, 2, 4, 5, 6]); return { text: `What is the prefix <b>${PNAME[i]}</b> worth? Give one unit that uses it.`, q: '', a: [`\\text{${PNAME[i]}}=${WORTH[i]}`, `\\text{e.g. 1 ${PRE[i]}m}=${WORTH[i]}\\text{ m}`] }; }
      ])(),
      PRG: (r) => { const C = conv(r, r.pick([LEN, LEN, MASS, CAP])); const n = Math.abs(C.n); return { text: 'Change the unit. Say how many steps, and up or down.', q: `${nt(C.v)}\\text{ ${C.a}}=\\ ?\\text{ ${C.b}}`, a: [`\\text{${n} step${n > 1 ? 's' : ''} ${C.n > 0 ? 'down' : 'up'}: }${nt(C.v)}${C.n > 0 ? '\\times' : '\\div'}${POW[n]}`, `=${nt(C.res)}\\text{ ${C.b}}`] }; },
      MAS: (r) => r.pick([
        () => { const m = r.int(2, 9), cm = r.int(5, 9) * 10 + r.int(1, 9), each = r.pick([25, 40, 45, 60, 75]); const tot = m * 100 + cm, n = Math.floor(tot / each), left = tot - n * each;
          return { text: `A rope is <b>${m}.${String(cm).padStart(2, '0')} m</b> long. It is cut into pieces <b>${each} cm</b> long. How many pieces? How much is left?`, q: '', a: [`${m}.${String(cm).padStart(2, '0')}\\text{ m}=${tot}\\text{ cm}`, `${tot}\\div${each}=${(tot / each).toFixed(2)}\\ldots\\Rightarrow ${n}\\text{ pieces}`, `${tot}-${n}\\times${each}=${left}\\text{ cm left}`] }; },
        () => { const vals = r.shuffle([[`${r.int(1, 2)}.${r.int(10, 99)}`, 'm'], [String(r.int(120, 260)), 'cm'], [String(r.int(1200, 2600)), 'mm'], [`0.00${r.int(12, 26)}`, 'km']]);
          const cm = vals.map(([v, u]) => Number(shift(v, idxOf('cm') - idxOf(u)))), ord = cm.map((x, i) => [x, i]).sort((a, b) => a[0] - b[0]);
          return { text: 'Put these in order from shortest to longest. Change to cm first.', q: vals.map(([v, u]) => `${v}\\text{ ${u}}`).join(',\\quad '), a: [vals.map(([v, u], i) => `${v}\\text{ ${u}}=${cm[i]}\\text{ cm}`).join(',\\ '), ord.map(([x]) => `${x}`).join('<').replace(/</g, '\\lt ') + '\\text{ cm}'] }; }
      ])()
    }
  });
}
