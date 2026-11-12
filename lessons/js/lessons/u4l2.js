/* Math 10-3 · Unit 4 · Lesson 2 — Capacity: Litres, Gallons, and US vs British Units.
 * Explainers: a 10 cm cube filling up to 1 L (and a 1 m cube holding 1000 L), the decimal point hopping 3 places (Full
 * notes: Example 1), a fish tank and a stock tank filling (Examples 2 and 3), the US unit ladder gal → qt → pt → cups →
 * fl oz (Example 4a), the lemonade stand pouring 384 fl oz into 32 cups (Example 4b), US and British gallons filled side
 * by side (Example 5), one fifth more (Full notes: Example 5c), estimate-then-convert with a verdict (Example 6), the gas
 * pump in Montana (Example 7), and a US cup next to a metric cup (Full notes: Example 8). Then the Stand Up Break. */
import { h, add, box, tex, svgEl, tween, stamp, stampIn, NumberLine, mountExplainers } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const rnd = (v, d = 2) => Math.round((v + (v >= 0 ? 1e-9 : -1e-9)) * 10 ** d) / 10 ** d;
const lerp = (a, b, t) => a + (b - a) * t;
/** booklet style: 4-digit numbers plain, 5+ digits with thin spaces (TeX) */
const nT = (v) => { const s = String(v); const [i, d] = s.split('.'); const ii = i.length > 4 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : i; return d ? ii + '.' + d : ii; };
const nH = (v) => nT(v).replace(/\\,/g, ' ');
const cbox = (cls, html) => h('div', cls + ' u4l2-c', `<div>${html}</div>`);
const line = (stage, html, x, y, w, cls = '') => hide(add(stage, box(h('div', 'u4l2-ln ' + cls, `<div>${html}</div>`), w, 46), x, y));
const svgBox = (stage, W, H, x = 0, y = 0) => add(stage, svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u4l2-svg' }), x, y);
const lab = (stage, html, x, y, cls = '') => add(stage, h('div', 'u4l2-lab ' + cls, html), x, y);
const labC = (stage, html, x, y, cls = '') => lab(stage, html, x, y, 'ctr ' + cls);
const WATER = '#7fb8ea', WATER2 = '#bcdcf6', MILK = '#efe4c4', LEMON = '#f5d75a';

/* ---------- oblique drawing (as in 4.1): x right, y up, z (depth) back and up-right ---------- */
const KX = 0.45, KY = 0.3;
const proj = (ox, oy, s, ky = KY, kx = KX) => (x, y, z) => [ox + (x + z * kx) * s, oy - (y + z * ky) * s];
const pstr = (pts) => pts.map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
const FACES = { water: ['#9cc9f2', '#cfe6fb', '#6fa7dc'], glass: ['none', 'none', 'none'], carton: ['#f4f1ea', '#ffffff', '#ddd8cc'] };
const STROKE = '#2f4a6e';
function boxSVG(P, l, w, hh, o = {}) {
  const [cf, ct, cr] = FACES[o.col || 'water'], sw = o.sw || 2.4, st = o.stroke || STROKE;
  let s = '';
  if (o.hidden) s += `<path d="M${pstr([P(0, 0, w)])} L${pstr([P(l, 0, w)])} M${pstr([P(0, 0, w)])} L${pstr([P(0, hh, w)])} M${pstr([P(0, 0, w)])} L${pstr([P(0, 0, 0)])}" fill="none" stroke="${o.hidden}" stroke-width="1.6" stroke-dasharray="5 5"/>`;
  s += `<polygon points="${pstr([P(0, 0, 0), P(l, 0, 0), P(l, hh, 0), P(0, hh, 0)])}" fill="${cf}" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round"/>`;
  s += `<polygon points="${pstr([P(0, hh, 0), P(l, hh, 0), P(l, hh, w), P(0, hh, w)])}" fill="${ct}" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round"/>`;
  s += `<polygon points="${pstr([P(l, 0, 0), P(l, 0, w), P(l, hh, w), P(l, hh, 0)])}" fill="${cr}" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round"/>`;
  if (o.grid) {
    const g = o.grid, d = [];
    for (let i = g; i < l - 1e-9; i += g) d.push([P(i, 0, 0), P(i, hh, 0)], [P(i, hh, 0), P(i, hh, w)]);
    for (let j = g; j < hh - 1e-9; j += g) d.push([P(0, j, 0), P(l, j, 0)], [P(l, j, 0), P(l, j, w)]);
    for (let k = g; k < w - 1e-9; k += g) d.push([P(0, hh, k), P(l, hh, k)], [P(l, 0, k), P(l, hh, k)]);
    s += `<path d="${d.map(([a, b]) => `M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${b[0].toFixed(1)} ${b[1].toFixed(1)}`).join('')}" stroke="${st}" stroke-width="1" opacity="${o.gop || 0.4}" fill="none"/>`;
  }
  return s;
}
function cylSVG(cx, by, rx, hp, o = {}) {
  const ry = rx * (o.k || 0.3), top = by - hp, st = o.stroke || STROKE, sw = o.sw || 2.4;
  return `<path d="M${cx - rx} ${by} A${rx} ${ry} 0 0 0 ${cx + rx} ${by} L${cx + rx} ${top} A${rx} ${ry} 0 0 1 ${cx - rx} ${top} Z" fill="${o.body || 'none'}" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round"/>`
    + `<ellipse cx="${cx}" cy="${top}" rx="${rx}" ry="${ry}" fill="${o.lid || 'none'}" stroke="${st}" stroke-width="${sw}"/>`;
}
/** a straight-sided see-through container with a handle; fill level 0..1 */
let CLIP = 0;
function vessel(svg, x, y, w, hh, o = {}) {
  const id = 'u4l2c' + (++CLIP), r = o.r == null ? 12 : o.r, col = o.fill || WATER;
  const shape = `M${x} ${y + r} Q${x} ${y} ${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${y + hh - r} Q${x + w} ${y + hh} ${x + w - r} ${y + hh} H${x + r} Q${x} ${y + hh} ${x} ${y + hh - r} Z`;
  const g = svgEl('g', {}, svg);
  const cp = svgEl('clipPath', { id }, g); svgEl('path', { d: shape }, cp);
  svgEl('path', { d: shape, fill: o.glass || '#f4f9fe' }, g);
  const wat = svgEl('rect', { x, y: y + hh, width: w, height: 0, fill: col, 'clip-path': `url(#${id})` }, g);
  const surf = svgEl('line', { x1: x, x2: x + w, y1: y + hh, y2: y + hh, stroke: o.surf || '#3d86c9', 'stroke-width': 2.5, 'clip-path': `url(#${id})`, opacity: 0 }, g);
  if (o.handle) svgEl('path', { d: `M${x + w} ${y + hh * 0.18} Q${x + w + w * 0.32} ${y + hh * 0.22} ${x + w + w * 0.3} ${y + hh * 0.45} Q${x + w + w * 0.28} ${y + hh * 0.66} ${x + w} ${y + hh * 0.7}`, fill: 'none', stroke: '#3a4254', 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
  svgEl('path', { d: shape, fill: 'none', stroke: '#3a4254', 'stroke-width': o.sw || 3 }, g);
  const set = (f) => { const hw = hh * Math.max(0, Math.min(1, f)); wat.setAttribute('y', y + hh - hw); wat.setAttribute('height', hw); surf.setAttribute('y1', y + hh - hw); surf.setAttribute('y2', y + hh - hw); surf.setAttribute('opacity', f > 0.002 && f < 0.998 ? 1 : 0); };
  return { g, set };
}
const CARTON = '<path d="M3 11 L13 2 L23 11 V38 H3 Z" fill="#fff" stroke="#1f5bd6" stroke-width="2" stroke-linejoin="round"/><rect x="3" y="18" width="20" height="10" fill="#cfe0fb"/>';

/* =====================================================================================
 * 1. 1 L is a 10 cm cube; 1 m³ holds 1000 L
 * ===================================================================================== */
const litreCube = {
  title: 'A litre is a 10 cm cube',
  height: 400,
  minW: 900,
  choices: [{ v: 'L', label: '1 L = 1000 cm³' }, { v: 'm', label: '1 m³ = 1000 L' }],
  ask: (k) => (k === 'L' ? 'How much water fits in a cube that is <b>10 cm</b> on each side?' : 'How many litres fit in a cube that is <b>1 m</b> on each side?'),
  make(stage, k, ex) {
    const svg = svgBox(stage, 540, 400), PX = 570, PW = ex.W - PX - 20;
    if (k === 'L') {
      const s = 25, P = proj(84, 366, s);
      const wat = svgEl('g', {}, svg);
      const glass = svgEl('g', {}, svg); glass.innerHTML = boxSVG(P, 10, 10, 10, { col: 'glass', stroke: '#3a4a7a', hidden: '#8aa0c8' });
      const drawW = (hh) => { wat.innerHTML = hh > 0.01 ? boxSVG(P, 10, 10, hh, { col: 'water', grid: 1, gop: 0.35, sw: 1.6 }) : ''; };
      const [bx, by] = P(5, 0, 0), [rx, ry] = P(10, 0, 5), [hx, hy] = P(0, 5, 0);
      labC(stage, '10 cm', bx, by + 18, 'dim'); lab(stage, '10 cm', rx + 8, ry - 6, 'dim'); lab(stage, '10 cm', hx - 70, hy - 14, 'dim');
      // the 1 cm cube (1 mL)
      const tiny = hide(svgEl('g', {}, svg)); const Pt = proj(458, 150, 25); tiny.innerHTML = boxSVG(Pt, 1, 1, 1, { col: 'water', sw: 2 });
      const tinyL = hide(labC(stage, '1 cm³ = <b>1 mL</b>', 478, 176, 'tag'));
      const carton = hide(svgEl('g', { transform: 'translate(452 250) scale(2.4)' }, svg)); carton.innerHTML = CARTON;
      const cartonL = hide(labC(stage, '1 L of milk', 484, 362, 'tag'));
      const cnt = hide(add(stage, box(cbox('u4l2-cnt', ''), 190, 42), 20, 6));
      const setCnt = (v) => { cnt.firstChild.innerHTML = `<b>${nH(v)}</b> mL`; };
      const L1 = line(stage, `1 cm³ holds <b>1 mL</b>`, PX, 30, PW);
      const L2 = line(stage, `One layer: ${T('10\\times10=100')} mL`, PX, 90, PW);
      const L3 = line(stage, `10 layers: ${T('100\\times10=1000')} cm³`, PX, 150, PW);
      const L4 = line(stage, `${T('1000\\text{ cm}^3=1000\\text{ mL}=1\\text{ L}')}`, PX, 220, PW, 'big');
      return [
        { cap: 'A cube <b>1 cm</b> on each side holds exactly <b>1 mL</b> of water: about 20 drops.', run: async (c) => { await c.pop(tiny); await c.fadeIn(tinyL); await c.fadeIn(L1); } },
        { cap: `Pour 1 cm of water into the big cube. The bottom layer is ${T('10\\times10=100')} little cubes: <b>100 mL</b>.`,
          run: async (c) => { await c.fadeIn(cnt); await tween(c, 700, (t) => { drawW(t); setCnt(Math.round(100 * t)); }); drawW(1); setCnt(100); await c.fadeIn(L2); } },
        { cap: 'Keep filling, one layer at a time: <b>10 layers</b> of 100 mL.',
          run: async (c) => { await tween(c, 1800, (t) => { const hh = 1 + 9 * t; drawW(hh); setCnt(Math.round(hh) * 100); }); drawW(10); setCnt(1000); await c.fadeIn(L3); } },
        { cap: `Full: ${T('1000\\text{ cm}^3=1000\\text{ mL}')} = <b>1 L</b>, a carton of milk. So <b>1 L = 1000 mL = 1000 cm³</b>.`, run: async (c) => { await c.pop(L4); await c.fadeIn(carton); await c.fadeIn(cartonL); } }
      ];
    }
    // 1 m³: 10 litre cubes along each edge
    const s = 28, P = proj(64, 370, s);
    const ghost = svgEl('g', {}, svg); ghost.innerHTML = boxSVG(P, 10, 10, 10, { col: 'glass', stroke: '#8aa0c8', hidden: '#b8c6dc', sw: 2 });
    const solid = svgEl('g', {}, svg);
    const draw = (l, w, hh) => { solid.innerHTML = boxSVG(P, l, w, hh, { col: 'water', grid: 1, gop: 0.55, sw: 2 }); };
    const [bx, by] = P(5, 0, 0), [rx, ry] = P(10, 0, 5), [hx, hy] = P(0, 5, 0);
    labC(stage, '1 m = 100 cm', bx, by + 18, 'dim'); lab(stage, '1 m', rx + 8, ry - 6, 'dim'); lab(stage, '1 m', hx - 48, hy - 14, 'dim');
    lab(stage, '(each small cube is 10 cm on each side: 1 L)', PX, 300, 'note');
    const cnt = hide(add(stage, box(cbox('u4l2-cnt', ''), 170, 42), 20, 6));
    const setCnt = (v) => { cnt.firstChild.innerHTML = `<b>${nH(v)}</b> L`; };
    const L1 = line(stage, `One row: <b>10</b> litre cubes`, PX, 40, PW);
    const L2 = line(stage, `One layer: ${T('10\\times10=100')} L`, PX, 100, PW);
    const L3 = line(stage, `10 layers: ${T('100\\times10=1000')} L`, PX, 160, PW);
    const L4 = line(stage, `${T('1\\text{ m}^3=1000\\text{ L}')}`, PX, 230, PW, 'big');
    const stepTo = (c, set) => tween(c, 1200, (t) => set(Math.max(1, Math.round(lerp(1, 10, t)))));
    return [
      { cap: '1 m = 100 cm. A 1 L cube is 10 cm on each side, so <b>10</b> of them fit along each edge.', run: async (c) => { await c.fadeIn(cnt); await stepTo(c, (v) => { draw(v, 1, 1); setCnt(v); }); await c.fadeIn(L1); } },
      { cap: `10 rows make a layer: ${T('10\\times10=100')} litres.`, run: async (c) => { await stepTo(c, (v) => { draw(10, v, 1); setCnt(10 * v); }); await c.fadeIn(L2); } },
      { cap: `10 layers fill the cube: ${T('100\\times10=1000')} litres.`, run: async (c) => { await stepTo(c, (v) => { draw(10, 10, v); setCnt(100 * v); }); await c.fadeIn(L3); } },
      { cap: 'So <b>1 m³ = 1000 L</b>. m³ → L: × 1000. L → m³: ÷ 1000.', run: (c) => c.pop(L4) }
    ];
  }
};

/* =====================================================================================
 * 2. × 1000 / ÷ 1000: the decimal point hops (Full notes, Example 1)
 * ===================================================================================== */
const MM = {
  a: { v: '2.5', from: 'L', to: 'mL', k: 3, rel: '1\\text{ L}=1000\\text{ mL}', res: '2500' },
  b: { v: '750', from: 'mL', to: 'L', k: -3, rel: '1\\text{ L}=1000\\text{ mL}', res: '0.75' },
  c: { v: '340', from: 'cm³', to: 'mL', k: 0, rel: '1\\text{ cm}^3=1\\text{ mL}', res: '340' },
  d: { v: '4.2', from: 'L', to: 'cm³', k: 3, rel: '1\\text{ L}=1000\\text{ cm}^3', res: '4200' },
  e: { v: '2.6', from: 'm³', to: 'L', k: 3, rel: '1\\text{ m}^3=1000\\text{ L}', res: '2600' },
  f: { v: '1800', from: 'L', to: 'm³', k: -3, rel: '1\\text{ m}^3=1000\\text{ L}', res: '1.8' }
};
const mlMachine = {
  title: 'Move the decimal point 3 places',
  height: 330,
  minW: 900,
  choices: [{ sep: 'Example 1:' }, ...'abcdef'.split('').map((v) => ({ v, label: `(${v})` }))],
  ask: (k) => `Example 1(${k}): change <b>${MM[k].v} ${MM[k].from}</b> to ${MM[k].to}.`,
  make(stage, k, ex) {
    const d = MM[k], W = ex.W;
    const rel = hide(add(stage, box(cbox('u4l2-key', T(d.rel)), 380, 46), (W - 380) / 2 - 200, 6));
    const res = hide(add(stage, box(cbox('u4l2-res', `${d.v} ${d.from} = <b>${d.res} ${d.to}</b>`), 420, 56), (W - 420) / 2, 250));
    if (!d.k) {
      const big = add(stage, box(cbox('u4l2-dig1', `${d.v}`), 300, 90), (W - 300) / 2, 100);
      void big;
      const st = hide(stamp(stage, 'Same number ✓', { ok: true, x: W / 2 + 270, y: 145, rotate: -6 }));
      return [
        { cap: `${T(d.rel)} exactly: a 1 cm cube holds 1 mL.`, run: (c) => c.fadeIn(rel) },
        { cap: 'So the number does not change: cm³ and mL are the <b>same size</b>.', run: (c) => stampIn(c, st) },
        { cap: `${d.v} cm³ = <b>${d.v} mL</b>.`, run: (c) => c.pop(res) }
      ];
    }
    const digs = d.v.replace('.', ''), p = d.v.includes('.') ? d.v.indexOf('.') : digs.length, p2 = p + d.k;
    const minI = Math.min(0, p2 <= 0 ? p2 - 1 : 0), maxI = Math.max(digs.length, p2), n = maxI - minI, CW = 70;
    const X0 = (W - n * CW) / 2, Y = 84;
    const cells = [];
    for (let i = minI; i < maxI; i++) {
      const has = i >= 0 && i < digs.length;
      const el = add(stage, box(cbox('u4l2-dig' + (has ? '' : ' pad'), has ? digs[i] : ''), CW - 8, 84), X0 + (i - minI) * CW + 4, Y);
      cells.push({ i, el, has });
    }
    const svg = svgBox(stage, W, 330);
    const px = (q) => X0 + (q - minI) * CW;
    const dot = svgEl('circle', { cx: px(p), cy: Y + 74, r: 8, fill: '#c93a33' }, svg);
    const arcs = svgEl('g', {}, svg);
    const mul = d.k > 0;
    const mach = hide(add(stage, box(cbox('u4l2-mach ' + (mul ? 'mul' : 'div'), mul ? `${T('\\times1000')}: 3 places right` : `${T('\\div1000')}: 3 places left`), 300, 46), (W - 380) / 2 + 220, 6));
    const steps = [
      { cap: mul ? `${T(d.rel)}: ${d.from} is the <b>bigger</b> unit, so you get <b>more</b> ${d.to}. Multiply by 1000.` : `${T(d.rel)}: ${d.from} is the <b>smaller</b> unit, so you get <b>fewer</b> ${d.to}. Divide by 1000.`,
        run: async (c) => { await c.fadeIn(rel); await c.fadeIn(mach); } },
      { cap: `${mul ? '× 1000' : '÷ 1000'} moves the decimal point <b>3 places ${mul ? 'right' : 'left'}</b>.`,
        run: async (c) => {
          for (let j = 1; j <= 3; j++) {
            const a = px(p + (mul ? j - 1 : -(j - 1))), b = px(p + (mul ? j : -j)), mx = (a + b) / 2;
            const path = svgEl('path', { d: `M${a} ${Y + 92} Q${mx} ${Y + 128} ${b} ${Y + 92}`, fill: 'none', stroke: '#c93a33', 'stroke-width': 2.5 }, arcs);
            const len = path.getTotalLength(); path.style.strokeDasharray = len; path.style.strokeDashoffset = len;
            await c.anim(path, [{ strokeDashoffset: len }, { strokeDashoffset: 0 }], 380);
            await c.anim(dot, [{ transform: `translateX(${a - px(p)}px)` }, { transform: `translateX(${b - px(p)}px)` }], 260);
          }
        } },
      { cap: 'Fill the empty places with <b>zeros</b>.',
        run: async (c) => { for (const q of cells) if (!q.has) { q.el.firstChild.innerHTML = '0'; await c.pop(q.el, 260); } } },
      { cap: `${T(`${d.v}${mul ? '\\times' : '\\div'}1000=${d.res}`)}. So ${d.v} ${d.from} = <b>${d.res} ${d.to}</b>.`, run: (c) => c.pop(res) }
    ];
    if (cells.every((q) => q.has)) steps.splice(2, 1); // nothing to fill (1800 → 1.800)
    return steps;
  }
};

/* =====================================================================================
 * 3. How much does it hold? Fill the tank (Examples 2 and 3)
 * ===================================================================================== */
const tankFill = {
  title: 'How much does it hold? Fill it up',
  height: 400,
  minW: 920,
  choices: [{ sep: 'Check:' }, { v: 'ab', label: 'Example 2(a)(b)' }, { v: 'c', label: 'Example 2(c)' }, { v: 'st', label: 'Example 3: stock tank' }],
  ask: (k) => (k === 'st' ? 'Example 3: a round stock tank is a cylinder <b>2.4 m</b> across and <b>0.6 m</b> high. How many litres does it hold?'
    : k === 'c' ? 'Example 2(c): Nadia’s tank (60 cm × 30 cm × 40 cm inside) is filled to <b>4 cm below the top</b>. How many litres of water is that?'
      : 'Example 2(a)(b): Nadia’s fish tank is <b>60 cm</b> long, <b>30 cm</b> wide and <b>40 cm</b> high inside. What is its capacity in litres?'),
  make(stage, k, ex) {
    const svg = svgBox(stage, 540, 400), PX = 560, PW = ex.W - PX - 16;
    if (k === 'st') {
      const s = 125, rx = 1.2 * s, hp = 0.6 * s, cx = 250, by = 300, ry = rx * 0.3;
      const wat = svgEl('g', {}, svg);
      const tank = svgEl('g', {}, svg); tank.innerHTML = cylSVG(cx, by, rx, hp, { stroke: '#4a4436', sw: 3 });
      tank.insertAdjacentHTML('afterbegin', `<path d="M${cx + rx} ${by} A${rx} ${ry} 0 0 0 ${cx - rx} ${by}" fill="none" stroke="#8a8170" stroke-width="1.6" stroke-dasharray="5 5"/>`);
      const dl = svgEl('line', { x1: cx - rx, y1: by - hp, x2: cx + rx, y2: by - hp, stroke: '#1f5bd6', 'stroke-width': 2.5, 'stroke-dasharray': '6 4' }, svg);
      void dl;
      labC(stage, 'd = 2.4 m', cx, by - hp - ry - 18, 'dim blue');
      lab(stage, 'h = 0.6 m', cx + rx + 12, by - hp / 2 - 14, 'dim');
      const L1 = line(stage, `${T('r=2.4\\div2=1.2')} m`, PX, 20, PW);
      const L2 = line(stage, `${T('V=\\pi\\times1.2^2\\times0.6\\approx2.714')} m³`, PX, 80, PW);
      const L3 = line(stage, `1 m³ = 1000 L: ${T('2.714\\ldots\\times1000')}`, PX, 140, PW);
      const L4 = line(stage, `It holds about <b>2714 L</b>`, PX, 208, PW, 'big');
      return [
        { cap: `Halve the diameter: ${T('r=2.4\\div2=1.2')} m.`, run: (c) => c.fadeIn(L1) },
        { cap: `Volume inside: ${T('V=\\pi r^2h=\\pi\\times1.2^2\\times0.6\\approx2.714')} m³.`,
          run: async (c) => { await tween(c, 1400, (t) => { wat.innerHTML = cylSVG(cx, by, rx, hp * t * 0.999, { body: WATER, lid: WATER2, stroke: '#3d86c9', sw: 1.5 }); }); await c.fadeIn(L2); } },
        { cap: 'Change to litres: 1 m³ = 1000 L, so <b>multiply by 1000</b>.', run: (c) => c.fadeIn(L3) },
        { cap: `${T('2.71433\\ldots\\times1000\\approx2714')}. The tank holds about <b>2714 L</b> of water.`, run: (c) => c.pop(L4) }
      ];
    }
    const s = 5.2, P = proj(40, 340, s), full = 40, lvl = k === 'c' ? 36 : 40;
    const wat = svgEl('g', {}, svg);
    const glass = svgEl('g', {}, svg); glass.innerHTML = boxSVG(P, 60, 30, 40, { col: 'glass', stroke: '#3a4254', hidden: '#8aa0c8', sw: 3 });
    const drawW = (hh) => { wat.innerHTML = hh > 0.05 ? boxSVG(P, 60, 30, hh, { col: 'water', sw: 1.4, stroke: '#3d86c9' }) : ''; };
    const [bx, by] = P(30, 0, 0), [rx, ry] = P(60, 0, 15), [hx, hy] = P(0, 20, 0);
    labC(stage, '60 cm', bx, by + 18, 'dim'); lab(stage, '30 cm', rx + 8, ry - 6, 'dim'); lab(stage, '40 cm', Math.max(2, hx - 70), hy - 14, 'dim');
    const PXc = PX;
    if (k === 'c') {
      const [ax, ay] = P(0, 36, 0), [bx2, by2] = P(60, 36, 0), [cx2, cy2] = P(60, 36, 30);
      const mk = svgEl('path', { d: `M${ax} ${ay} L${bx2} ${by2} L${cx2} ${cy2}`, stroke: '#c93a33', 'stroke-width': 2.5, 'stroke-dasharray': '7 5', fill: 'none' }, svg);
      void mk;
      const [tx, ty] = P(60, 38, 0);
      lab(stage, '4 cm below the top', tx - 150, ty - 34, 'dim red');
      const L1 = line(stage, `Water height: ${T('40-4=36')} cm`, PXc, 20, PW);
      const L2 = line(stage, `${T('60\\times30\\times36=64\\,800')} cm³`, PXc, 80, PW);
      const L3 = line(stage, `${T('64\\,800\\div1000=64.8')} L`, PXc, 148, PW, 'big');
      return [
        { cap: `The water stops 4 cm below the top: ${T('40-4=36')} cm deep.`, run: async (c) => { await c.fadeIn(L1); await tween(c, 1500, (t) => drawW(lvl * t)); } },
        { cap: `Volume of the water: ${T('60\\times30\\times36=64\\,800')} cm³ = 64 800 mL.`, run: (c) => c.fadeIn(L2) },
        { cap: `Change to litres (÷ 1000): ${T('64\\,800\\div1000=64.8')} L of water.`, run: (c) => c.pop(L3) }
      ];
    }
    const L1 = line(stage, `${T('V=60\\times30\\times40=72\\,000')} cm³`, PXc, 16, PW);
    const L2 = line(stage, `= 72 000 mL`, PXc, 70, PW);
    const L3 = line(stage, `${T('72\\,000\\div1000=72')} L`, PXc, 124, PW, 'big');
    const grid = svgBox(stage, PW, 190, PXc, 190), cartons = [];
    for (let i = 0; i < 72; i++) { const g = svgEl('g', { transform: `translate(${(i % 12) * (PW / 12) + 4} ${Math.floor(i / 12) * 31 + 2}) scale(.72)` }, grid); g.innerHTML = CARTON; g.style.opacity = 0; cartons.push(g); }
    const setC = (n) => cartons.forEach((g, i) => { g.style.opacity = i < n ? 1 : 0; });
    void full;
    return [
      { cap: `(a) The volume inside: ${T('V=lwh=60\\times30\\times40=72\\,000')} cm³.`, run: async (c) => { await tween(c, 1500, (t) => drawW(lvl * t)); await c.fadeIn(L1); } },
      { cap: '(b) 1 cm³ = 1 mL, so the tank holds <b>72 000 mL</b>.', run: (c) => c.fadeIn(L2) },
      { cap: `mL → L: ÷ 1000. ${T('72\\,000\\div1000=72')}: the tank holds <b>72 L</b>, like 72 one-litre cartons.`,
        run: async (c) => { await c.pop(L3); await tween(c, 1400, (t) => setC(Math.round(72 * t))); setC(72); } }
    ];
  }
};

/* =====================================================================================
 * 4. The US ladder: gal → qt → pt → cups → fl oz (Example 4a)
 * ===================================================================================== */
const UNITS = ['gal', 'qt', 'pt', 'cups', 'fl oz'], FAC = [4, 2, 2, 8];
const UL = {
  a: { from: 0, to: 1, v: 3 }, b: { from: 2, to: 3, v: 5 }, c: { from: 4, to: 3, v: 24 },
  d: { from: 1, to: 0, v: 6 }, e: { from: 0, to: 2, v: 2 }, f: { from: 0, to: 4, v: 1 }
};
const ICONS = [ // gallon jug, quart carton, pint glass, cup, fluid-ounce shot (viewBox 0 0 60 80, bottom at 80)
  '<path d="M10 22 Q10 12 20 12 H32 V4 H44 V12 Q52 12 52 22 V74 Q52 80 46 80 H16 Q10 80 10 74 Z" fill="#eef6fd" stroke="#3a4254" stroke-width="2.5"/><rect x="12" y="40" width="38" height="38" fill="#bcdcf6"/><path d="M52 26 Q60 30 58 44 Q56 54 52 54" fill="none" stroke="#3a4254" stroke-width="4"/>',
  '<path d="M14 24 L30 8 L46 24 V80 H14 Z" fill="#fff" stroke="#1f5bd6" stroke-width="2.5" stroke-linejoin="round"/><rect x="14" y="40" width="32" height="20" fill="#cfe0fb"/>',
  '<path d="M16 26 H44 L41 80 H19 Z" fill="#eef6fd" stroke="#3a4254" stroke-width="2.5" stroke-linejoin="round"/><path d="M17 40 H43 L41 78 H19 Z" fill="#f2c66d"/>',
  '<path d="M18 46 H42 L40 80 H20 Z" fill="#fff" stroke="#3a4254" stroke-width="2.5" stroke-linejoin="round"/><path d="M42 52 Q50 54 48 64 Q46 70 41 70" fill="none" stroke="#3a4254" stroke-width="3"/>',
  '<path d="M24 62 H36 L35 80 H25 Z" fill="#eef6fd" stroke="#3a4254" stroke-width="2.2" stroke-linejoin="round"/><rect x="25" y="68" width="10" height="10" fill="#bcdcf6"/>'
];
const usLadder = {
  title: 'The US ladder: bigger → smaller, multiply',
  height: 380,
  minW: 920,
  choices: [{ sep: 'Example 4(a):' }, { v: 'a', label: '3 gal → qt' }, { v: 'b', label: '5 pt → cups' }, { v: 'c', label: '24 fl oz → cups' }, { v: 'd', label: '6 qt → gal' }, { v: 'e', label: '2 gal → pt' }, { v: 'f', label: '1 gal → fl oz' }],
  ask: (k) => `Example 4(a): ${UL[k].v} ${UNITS[UL[k].from]} = ___ ${UNITS[UL[k].to]}`,
  make(stage, k, ex) {
    const d = UL[k], W = ex.W, BW = 140, G = (W - 40 - 5 * BW) / 4, X = (i) => 20 + i * (BW + G), BY = 170;
    const svg = svgBox(stage, W, 380);
    const boxes = UNITS.map((u, i) => {
      const ic = svgEl('svg', { x: X(i) + BW / 2 - 45, y: 40, width: 90, height: 120, viewBox: '0 0 60 80' }, svg); ic.innerHTML = ICONS[i];
      return add(stage, box(cbox('u4l2-ub', u), BW, 58), X(i), BY);
    });
    const arrows = FAC.map((f, i) => {
      const x1 = X(i) + BW + 6, x2 = X(i + 1) - 6;
      const g = svgEl('g', { opacity: 0.35 }, svg);
      g.innerHTML = `<line x1="${x1}" y1="${BY + 18}" x2="${x2 - 6}" y2="${BY + 18}" stroke="#12805a" stroke-width="3"/><path d="M${x2 - 12} ${BY + 11} L${x2} ${BY + 18} L${x2 - 12} ${BY + 25} Z" fill="#12805a"/>`
        + `<line x1="${x1 + 6}" y1="${BY + 42}" x2="${x2}" y2="${BY + 42}" stroke="#1f5bd6" stroke-width="3"/><path d="M${x1 + 12} ${BY + 35} L${x1} ${BY + 42} L${x1 + 12} ${BY + 49} Z" fill="#1f5bd6"/>`;
      const up = labC(stage, `× ${f}`, (x1 + x2) / 2, BY - 8, 'mul'), dn = labC(stage, `÷ ${f}`, (x1 + x2) / 2, BY + 70, 'div');
      return { g, up, dn };
    });
    const down = d.to > d.from, path = [];
    let v = d.v;
    for (let i = d.from; i !== d.to; i += down ? 1 : -1) { const f = FAC[down ? i : i - 1], nv = down ? v * f : v / f; path.push({ i, j: down ? i + 1 : i - 1, f, v, nv }); v = nv; }
    const res = v;
    const tok = hide(add(stage, box(cbox('u4l2-tok', `${d.v} ${UNITS[d.from]}`), 120, 48), X(d.from) + BW / 2 - 60, 262));
    const R = hide(add(stage, box(cbox('u4l2-res', `${d.v} ${UNITS[d.from]} = <b>${res} ${UNITS[d.to]}</b>`), 360, 52), (W - 360) / 2, 322));
    const steps = [{ cap: `Start at <b>${UNITS[d.from]}</b> and go to <b>${UNITS[d.to]}</b>. ${down ? 'Bigger unit → smaller unit: you need <b>more</b> of them, so <b>multiply</b>.' : 'Smaller unit → bigger unit: you need <b>fewer</b> of them, so <b>divide</b>.'}`,
      run: async (c) => { boxes[d.from].classList.add('on'); boxes[d.to].classList.add('goal'); await c.pop(tok); } }];
    path.forEach((st) => {
      const a = arrows[Math.min(st.i, st.j)];
      steps.push({ cap: `${down ? '×' : '÷'} ${st.f}: ${T(`${st.v}${down ? '\\times' : '\\div'}${st.f}=${st.nv}`)} ${UNITS[st.j]}.`,
        run: async (c) => {
          await c.anim(a.g, [{ opacity: 0.35 }, { opacity: 1 }], 200); await c.pop(down ? a.up : a.dn, 300);
          await c.anim(tok, [{ transform: 'none' }, { transform: `translateX(${X(st.j) - X(d.from)}px)` }], 0);
          tok.style.transform = 'none'; tok.style.left = (X(st.j) + BW / 2 - 60) + 'px'; tok.firstChild.innerHTML = `${st.nv} ${UNITS[st.j]}`;
          boxes[st.j].classList.add('on'); await c.pop(tok, 300);
        } });
    });
    steps.push({ cap: `So ${d.v} ${UNITS[d.from]} = <b>${res} ${UNITS[d.to]}</b>.`, run: (c) => c.pop(R) });
    return steps;
  }
};

/* =====================================================================================
 * 5. The lemonade stand (Example 4b)
 * ===================================================================================== */
const lemonade = {
  title: 'Lemonade: gallons → fluid ounces → cups → dollars',
  height: 380,
  minW: 920,
  ask: 'Example 4(b): <b>3 US gallons</b> of lemonade, sold in <b>12 fl oz</b> cups at <b>$2.50</b> each. How many cups, and how much money?',
  make(stage, k, ex) {
    const W = ex.W, svg = svgBox(stage, W, 380), PX = 660, PW = W - PX - 16;
    const jugs = [0, 1, 2].map((i) => { const j = vessel(svg, 22 + i * 82, 70, 62, 130, { fill: LEMON, surf: '#c9a20e', handle: true, r: 14 }); j.set(1); hide(j.g); return j; });
    const jl = [0, 1, 2].map((i) => hide(labC(stage, '128 fl oz', 53 + i * 82, 224, 'tag')));
    const cups = [];
    for (let i = 0; i < 32; i++) {
      const x = 300 + (i % 8) * 42, y = 40 + Math.floor(i / 8) * 64;
      const g = svgEl('g', {}, svg);
      g.innerHTML = `<path d="M${x} ${y} H${x + 30} L${x + 26} ${y + 46} H${x + 4} Z" fill="#fff" stroke="#8aa0b8" stroke-width="2" stroke-linejoin="round"/>`;
      const f = svgEl('path', { d: `M${x + 2} ${y + 8} H${x + 28} L${x + 25} ${y + 44} H${x + 5} Z`, fill: LEMON, opacity: 0 }, g);
      cups.push(f);
    }
    const ccnt = hide(add(stage, box(cbox('u4l2-cnt', ''), 170, 42), 380, 300));
    const money = hide(add(stage, box(cbox('u4l2-cash', '$0.00'), 220, 70), PX + (PW - 220) / 2, 250));
    const L1 = line(stage, `${T('3\\times128=384')} fl oz`, PX, 20, PW);
    const L2 = line(stage, `${T('384\\div12=32')} cups`, PX, 80, PW);
    const L3 = line(stage, `${T('32\\times\\$2.50=\\$80.00')}`, PX, 140, PW, 'big');
    return [
      { cap: `1 US gallon = <b>128 fl oz</b>. Three gallons: ${T('3\\times128=384')} fl oz.`,
        run: async (c) => { for (let i = 0; i < 3; i++) { await c.pop(jugs[i].g, 280); await c.fadeIn(jl[i], 200); } await c.fadeIn(L1); } },
      { cap: `Each cup holds 12 fl oz. Pour: ${T('384\\div12=32')} cups.`,
        run: async (c) => {
          await c.fadeIn(ccnt);
          await tween(c, 2200, (t) => { const n = Math.round(32 * t); cups.forEach((f, i) => f.setAttribute('opacity', i < n ? 1 : 0)); ccnt.firstChild.innerHTML = `<b>${n}</b> cups`; jugs.forEach((j, i) => j.set(Math.max(0, Math.min(1, 3 - 3 * t - (2 - i))))); });
          await c.fadeIn(L2);
        } },
      { cap: `Sell all 32 cups at $2.50: ${T('32\\times\\$2.50=\\$80.00')}.`,
        run: async (c) => { await c.fadeIn(money); await tween(c, 1200, (t) => { money.firstChild.innerHTML = '$' + (80 * t).toFixed(2); }); money.firstChild.innerHTML = '$80.00'; await c.pop(L3); } }
    ];
  }
};

/* =====================================================================================
 * 6. US vs British, filled side by side (Example 5)
 * ===================================================================================== */
const TG = {
  g1: { ask: 'A US gallon and a British gallon: how many litres does each hold?', u: 'L', max: 5, tick: 1, cap: [3.785, 4.546], name: ['US gallon', 'British gallon'],
    capL: ['US gallon: about <b>3.785 L</b>, a bit less than 4 L.', 'British gallon: about <b>4.546 L</b>, about 4½ L.'],
    line: ['US: ≈ 3.785 L', 'British: ≈ 4.546 L'], lv: ['3.785 L', '4.546 L'], diff: '4.546-3.785=0.761', diffW: '0.761 L', more: 'about 20% more' },
  g5: { ask: 'Example 5(a): how many litres are in <b>5 US gallons</b>? In <b>5 British gallons</b>? How many more in the British ones?', u: 'L', max: 25, tick: 5, cap: [18.925, 22.73], name: ['5 US gallons', '5 British gallons'],
    capL: [`5 US gallons: ${T('5\\times3.785=18.925\\approx18.93')} L.`, `5 British gallons: ${T('5\\times4.546=22.73')} L.`],
    line: [`US: ${T('5\\times3.785\\approx18.93')} L`, `British: ${T('5\\times4.546=22.73')} L`], lv: ['18.93 L', '22.73 L'], diff: '22.73-18.925\\approx3.81', diffW: '3.81 L' },
  pt: { ask: 'Example 5(b): a British pint is 568 mL. How many mL is a US pint (16 US fl oz)? How many more mL in the British pint?', u: 'mL', max: 600, tick: 100, cap: [473.12, 568], name: ['US pint', 'British pint'],
    capL: [`US pint: ${T('16\\times29.57=473.12\\approx473')} mL.`, 'British pint: <b>568 mL</b> (20 British fl oz).'],
    line: [`US: ${T('16\\times29.57\\approx473')} mL`, 'British: 568 mL'], lv: ['473 mL', '568 mL'], diff: '568-473=95', diffW: '95 mL', fill: '#f2a65a' }
};
const twoGallons = {
  title: 'Two “gallons”: fill them side by side',
  height: 400,
  minW: 900,
  choices: [{ v: 'g1', label: '1 gallon each' }, { sep: 'Example 5:' }, { v: 'g5', label: '(a) 5 gallons' }, { v: 'pt', label: '(b) a pint' }],
  ask: (k) => TG[k].ask,
  make(stage, k, ex) {
    const d = TG[k], svg = svgBox(stage, 540, 400), PX = 560, PW = ex.W - PX - 20;
    const base = 340, top = 50, sc = (base - top) / d.max, X0 = 80;
    // scale
    const ax = svgEl('g', {}, svg);
    let sAx = `<line x1="${X0}" y1="${base}" x2="${X0}" y2="${top - 6}" stroke="#3a4254" stroke-width="2"/>`;
    for (let v = 0; v <= d.max + 1e-9; v += d.tick) { const y = base - v * sc; sAx += `<line x1="${X0 - 8}" y1="${y}" x2="${X0}" y2="${y}" stroke="#3a4254" stroke-width="2"/>`; }
    ax.innerHTML = sAx;
    for (let v = 0; v <= d.max + 1e-9; v += d.tick) lab(stage, `${v}`, X0 - 52, base - v * sc - 12, 'axis');
    lab(stage, d.u, X0 - 30, top - 40, 'axis');
    const xs = [150, 320], w = 120;
    const vs = d.cap.map((cp, i) => { const hh = cp * sc; const v = vessel(svg, xs[i], base - hh, w, hh, { r: 8, fill: d.fill || WATER }); return v; });
    d.name.forEach((n, i) => labC(stage, `<b>${n}</b>`, xs[i] + w / 2, base + 22, 'tag'));
    const vl = d.cap.map((cp, i) => hide(labC(stage, d.lv[i], xs[i] + w / 2, base - cp * sc + 22, 'lvl')));
    const y0 = base - d.cap[0] * sc, y1 = base - d.cap[1] * sc;
    const dash = hide(svgEl('line', { x1: xs[0], y1: y0, x2: xs[1] + w + 14, y2: y0, stroke: '#c93a33', 'stroke-width': 2, 'stroke-dasharray': '6 5' }, svg));
    const br = hide(svgEl('path', { d: `M${xs[1] + w + 8} ${y1} H${xs[1] + w + 18} V${y0} H${xs[1] + w + 8}`, fill: 'none', stroke: '#c93a33', 'stroke-width': 3 }, svg));
    const brl = hide(lab(stage, `+${d.diffW}`, xs[1] + w + 24, (y0 + y1) / 2 - 14, 'dim red'));
    const L1 = line(stage, d.line[0], PX, 40, PW), L2 = line(stage, d.line[1], PX, 100, PW);
    const L3 = line(stage, `${T(d.diff)} ${d.u} more`, PX, 168, PW, 'big');
    const st = hide(stamp(stage, 'British is bigger', { ok: null, x: PX + PW / 2, y: 280, rotate: -5 }));
    const fillOne = (c, i) => tween(c, 1400, (t) => vs[i].set(t)).then(() => vs[i].set(1));
    return [
      { cap: d.capL[0], run: async (c) => { await fillOne(c, 0); await c.fadeIn(vl[0]); await c.fadeIn(L1); } },
      { cap: d.capL[1], run: async (c) => { await fillOne(c, 1); await c.fadeIn(vl[1]); await c.fadeIn(L2); } },
      { cap: `The British one holds ${T(d.diff)} ${d.u} more${d.more ? `: <b>${d.more}</b>` : ''}.`,
        run: async (c) => { await c.fadeIn(dash); await c.fadeIn(br); await c.fadeIn(brl); await c.pop(L3); await stampIn(c, st); } }
    ];
  }
};

/* =====================================================================================
 * 7. One fifth more: 20% (Full notes, Example 5c)
 * ===================================================================================== */
const percentBigger = {
  title: 'About 20% bigger: the extra piece is one fifth',
  height: 340,
  minW: 900,
  ask: 'Example 5(c): show that a British gallon (4.546 L) is about <b>20% bigger</b> than a US gallon (3.785 L).',
  make(stage, k, ex) {
    const W = ex.W, svg = svgBox(stage, W, 340), X0 = 150, sc = Math.min(140, (W - X0 - 120) / 4.546), BH = 54, yU = 50, yB = 170;
    const us = svgEl('rect', { x: X0, y: yU, width: 0, height: BH, rx: 6, fill: WATER, stroke: '#2f4a6e', 'stroke-width': 2.5 }, svg);
    const bu = svgEl('rect', { x: X0, y: yB, width: 0, height: BH, rx: 6, fill: WATER, stroke: '#2f4a6e', 'stroke-width': 2.5 }, svg);
    const ext = hide(svgEl('rect', { x: X0 + 3.785 * sc, y: yB, width: 0.761 * sc, height: BH, fill: '#f2a65a', stroke: '#8a4a10', 'stroke-width': 2.5 }, svg));
    lab(stage, '<b>US</b>', 30, yU + 14, 'tag'); lab(stage, '<b>British</b>', 30, yB + 14, 'tag');
    const vU = hide(lab(stage, '3.785 L', X0 + 3.785 * sc + 10, yU + 14, 'tag')), vB = hide(lab(stage, '4.546 L', X0 + 4.546 * sc + 10, yB + 14, 'tag'));
    const fifth = 3.785 / 5;
    const cuts = hide(svgEl('g', {}, svg));
    for (let i = 1; i < 5; i++) svgEl('line', { x1: X0 + i * fifth * sc, y1: yU - 6, x2: X0 + i * fifth * sc, y2: yU + BH + 6, stroke: '#1c2230', 'stroke-width': 2, 'stroke-dasharray': '5 4' }, cuts);
    const pcts = [0, 1, 2, 3, 4].map((i) => hide(labC(stage, '20%', X0 + (i + 0.5) * fifth * sc, yU + BH / 2, 'pct')));
    const copy = hide(svgEl('rect', { x: X0 + 3.785 * sc, y: yB, width: 0.761 * sc, height: BH, fill: '#f2a65a', stroke: '#8a4a10', 'stroke-width': 2.5, opacity: 0.9 }, svg));
    const extL = hide(labC(stage, '0.761 L', X0 + (3.785 + 0.38) * sc, yB + BH + 18, 'dim red'));
    const res = hide(add(stage, box(cbox('u4l2-res', `${T('0.761\\div3.785\\times100\\approx20.1\\%')}`), 440, 52), (W - 440) / 2, 272));
    const st = hide(stamp(stage, '≈ 20% bigger ✓', { ok: true, x: W - 130, y: 296, rotate: -5 }));
    return [
      { cap: 'The US gallon is 3.785 L. The British gallon is 4.546 L.',
        run: async (c) => { await tween(c, 1000, (t) => { us.setAttribute('width', 3.785 * sc * t); bu.setAttribute('width', 4.546 * sc * t); }); us.setAttribute('width', 3.785 * sc); bu.setAttribute('width', 4.546 * sc); await c.fadeIn(vU); await c.fadeIn(vB); } },
      { cap: `The extra part: ${T('4.546-3.785=0.761')} L.`, run: async (c) => { await c.fadeIn(ext); await c.fadeIn(extL); } },
      { cap: 'Cut the US gallon into <b>5 equal pieces</b>. Each piece is <b>20%</b> (one fifth), about 0.757 L.', run: async (c) => { await c.fadeIn(cuts); for (const p of pcts) await c.pop(p, 220); } },
      { cap: `Slide the extra piece up: it is about the same as one fifth. ${T('0.761\\div3.785\\times100\\approx20.1\\%')}.`,
        run: async (c) => { await c.anim(copy, [{ opacity: 0.9, transform: 'none' }, { opacity: 0.9, transform: `translate(${-0.002 * sc}px, ${yU + BH + 8 - yB}px)` }], 900); await c.pop(res); await stampIn(c, st); } }
    ];
  }
};

/* =====================================================================================
 * 8. Estimate, then convert (Example 6)
 * ===================================================================================== */
const CV = {
  a: { from: '10 US gal', to: 'L', est: '10\\times4=40', estV: 40, estW: '40 L', op: '\\times', f: '3.785', work: '10\\times3.785=37.85', ans: 37.85, ansW: '37.85 L', lcd: ['10×3.785', '37.85'],
    why: 'A gallon is <b>bigger</b> than a litre, so you get <b>more</b> litres: <b>multiply</b> by 3.785.', estWhy: 'a US gallon is a bit less than 4 L', nl: [30, 45, 5], pic: 'jugs' },
  b: { from: '60 L', to: 'US gal', est: '60\\div4=15', estV: 15, estW: '15 gal', op: '\\div', f: '3.785', work: '60\\div3.785=15.852\\ldots\\approx15.85', ans: 15.852, ansW: '15.85 US gal', lcd: ['60÷3.785', '15.85204756'],
    why: 'A gallon is <b>bigger</b> than a litre, so you get <b>fewer</b> gallons: <b>divide</b> by 3.785.', estWhy: 'about 4 L in each gallon', nl: [10, 20, 2], pic: 'tank' },
  c: { from: '12 US fl oz', to: 'mL', est: '12\\times30=360', estV: 360, estW: '360 mL', op: '\\times', f: '29.57', work: '12\\times29.57=354.84\\approx354.8', ans: 354.84, ansW: '354.8 mL', lcd: ['12×29.57', '354.84'],
    why: 'A fluid ounce is <b>bigger</b> than a millilitre: <b>multiply</b> by 29.57.', estWhy: 'a US fluid ounce is about 30 mL', nl: [300, 400, 20], pic: 'can' },
  d: { from: '500 mL', to: 'US fl oz', est: '500\\div30\\approx17', estV: 16.667, estW: 'about 17 fl oz', op: '\\div', f: '29.57', work: '500\\div29.57=16.909\\ldots\\approx16.91', ans: 16.909, ansW: '16.91 US fl oz', lcd: ['500÷29.57', '16.90902942'],
    why: 'A fluid ounce is <b>bigger</b> than a millilitre, so you get <b>fewer</b> fluid ounces: <b>divide</b> by 29.57.', estWhy: 'about 30 mL in each fluid ounce', nl: [10, 20, 2], pic: 'bottle' }
};
const PICS = {
  jugs: () => { let s = ''; for (let i = 0; i < 10; i++) { const x = 10 + (i % 5) * 46, y = 30 + Math.floor(i / 5) * 92; s += `<g transform="translate(${x} ${y}) scale(.7)"><path d="M6 20 Q6 10 16 10 H26 V2 H38 V10 Q46 10 46 20 V96 Q46 104 38 104 H14 Q6 104 6 96 Z" fill="#bcdcf6" stroke="#3a4254" stroke-width="3"/></g>`; } return s; },
  tank: () => '<rect x="40" y="40" width="160" height="150" rx="14" fill="#e9c46a" stroke="#4a3010" stroke-width="4"/><rect x="160" y="22" width="30" height="22" rx="4" fill="#4a3010"/><text x="120" y="130" font-size="40" font-weight="800" fill="#4a3010" text-anchor="middle">60 L</text>',
  can: () => '<rect x="80" y="30" width="90" height="170" rx="14" fill="#c93a33" stroke="#7a1f16" stroke-width="4"/><ellipse cx="125" cy="34" rx="45" ry="10" fill="#d9dce1" stroke="#7a1f16" stroke-width="3"/><text x="125" y="125" font-size="23" font-weight="800" fill="#fff" text-anchor="middle">12 fl oz</text>',
  bottle: () => '<rect x="108" y="16" width="34" height="22" rx="4" fill="#1f5bd6"/><path d="M104 38 H146 Q150 60 168 76 V194 Q168 204 158 204 H92 Q82 204 82 194 V76 Q100 60 104 38 Z" fill="#cfe9ff" stroke="#1f5bd6" stroke-width="4"/><text x="125" y="140" font-size="22" font-weight="800" fill="#1f5bd6" text-anchor="middle">500 mL</text>'
};
const convertSI = {
  title: 'Estimate, then convert',
  height: 400,
  minW: 920,
  choices: [{ sep: 'Example 6:' }, { v: 'a', label: '(a) 10 US gal → L' }, { v: 'b', label: '(b) 60 L → US gal' }, { v: 'c', label: '(c) 12 fl oz → mL' }, { v: 'd', label: '(d) 500 mL → fl oz' }],
  ask: (k) => `Example 6(${k}): change <b>${CV[k].from}</b> to ${CV[k].to}. Estimate first.`,
  make(stage, k, ex) {
    const d = CV[k], W = ex.W, PX = 290, PW = W - PX - 20;
    const pic = svgBox(stage, 250, 230, 10, 10); pic.innerHTML = PICS[d.pic]();
    const L1 = line(stage, `Estimate: ${T(d.est)} (${d.estW})`, PX, 10, PW, 'est');
    const mach = hide(add(stage, box(cbox('u4l2-mach ' + (d.op === '\\times' ? 'mul' : 'div'), T(d.op + d.f)), 170, 56), PX, 70));
    const why = hide(add(stage, box(h('div', 'u4l2-why', `<div>${d.why}</div>`), PW - 190, 60), PX + 186, 68));
    const lcd = hide(add(stage, box(h('div', 'u4l2-lcd', `<div class="e">${d.lcd[0]}</div><div class="r">${d.lcd[1]}</div>`), 230, 66), PX, 142));
    const L2 = line(stage, `${T(d.work)} ${d.to}`, PX + 246, 152, PW - 246, 'big');
    const [a, b, st] = d.nl;
    const N = new NumberLine(stage, { x: PX, y: 228, width: PW, height: 100, min: a, max: b, step: st, numbers: true });
    const leg1 = hide(lab(stage, '<span class="u4l2-dot b"></span>estimate', PX + 10, 334, 'tag')), leg2 = hide(lab(stage, '<span class="u4l2-dot r"></span>answer', PX + 150, 334, 'tag'));
    const sp = hide(stamp(stage, 'Close ✓', { ok: true, x: 140, y: 310, rotate: -5 }));
    return [
      { cap: `Estimate first: ${d.estWhy}. ${T(d.est)}.`, run: async (c) => { await c.fadeIn(L1); const p = N.point(d.estV, { color: 'blue' }); await c.pop(p); await c.fadeIn(leg1); } },
      { cap: d.why, run: async (c) => { await c.pop(mach); await c.fadeIn(why); } },
      { cap: `${T(d.work)}. The answer: <b>${d.ansW}</b>.`, run: async (c) => { await c.pop(lcd); await c.fadeIn(L2); const p = N.point(d.ans, { color: 'red' }); await c.pop(p); await c.fadeIn(leg2); } },
      { cap: `${d.ansW} is close to the estimate (${d.estW}) ✓ If it were far away, you probably ${d.op === '\\times' ? 'divided instead of multiplying' : 'multiplied instead of dividing'}.`, run: (c) => stampIn(c, sp) }
    ];
  }
};

/* =====================================================================================
 * 9. At the pump in Montana (Example 7)
 * ===================================================================================== */
const gasTrip = {
  title: 'At the pump: litres, gallons, US and Canadian dollars',
  height: 420,
  minW: 920,
  ask: 'Example 7: Sana’s gas tank holds <b>52 L</b>. In Montana, gas costs <b>$3.29 USD per US gallon</b>. Use 1 USD = 1.38 CAD.',
  make(stage, k, ex) {
    const W = ex.W, svg = svgBox(stage, 300, 420), PX = 320, PW = W - PX - 16;
    svg.innerHTML = '<rect x="30" y="20" width="200" height="330" rx="16" fill="#c93a33" stroke="#7a1f16" stroke-width="4"/><rect x="50" y="40" width="160" height="150" rx="8" fill="#1c2230"/>'
      + '<rect x="70" y="210" width="120" height="44" rx="6" fill="#fff6e5" stroke="#7a1f16" stroke-width="2"/><rect x="20" y="350" width="220" height="22" rx="6" fill="#4a4436"/>'
      + '<path d="M230 120 Q270 120 270 170 V300 Q270 320 252 320" fill="none" stroke="#1c2230" stroke-width="8" stroke-linecap="round"/><rect x="236" y="300" width="30" height="46" rx="6" fill="#1c2230"/>';
    const gal = add(stage, box(h('div', 'u4l2-pump', '<small>US GALLONS</small><b>0.00</b>'), 150, 64), 55, 48);
    const usd = add(stage, box(h('div', 'u4l2-pump', '<small>USD</small><b>0.00</b>'), 150, 64), 55, 120);
    add(stage, box(cbox('u4l2-ppl', '<b>$3.29</b> / US gal'), 120, 44), 70, 210);
    const setP = (g, m) => { gal.querySelector('b').textContent = g.toFixed(2); usd.querySelector('b').textContent = m.toFixed(2); };
    const L1 = line(stage, `(a) ${T('52\\div3.785=13.738\\ldots\\approx13.74')} US gal`, PX, 10, PW);
    const L2 = line(stage, `(b) ${T('13.74\\times\\$3.29=45.2046\\approx\\$45.20')} USD`, PX, 64, PW);
    const L3 = line(stage, `(c) ${T('\\$3.29\\div3.785\\approx\\$0.869')} USD per L`, PX, 118, PW);
    const L4 = line(stage, `(d) ${T('0.8692\\ldots\\times1.38\\approx\\$1.20')} CAD per L`, PX, 172, PW);
    const sign = (x, town, price, cls) => hide(add(stage, box(h('div', 'u4l2-sign ' + cls, `<small>${town}</small><b>${price}</b><span>CAD per litre</span>`), 210, 104), x, 240));
    const sC = sign(PX + 20, 'Calgary', '$1.45', 'u4l2-cal'), sM = sign(PX + 260, 'Montana', '$1.20', 'u4l2-mon');
    const st = hide(stamp(stage, '25¢ per litre cheaper', { ok: true, x: PX + 245, y: 382, rotate: -4 }));
    return [
      { cap: `(a) Litres → US gallons: a gallon is bigger, so divide. ${T('52\\div3.785=13.738\\ldots')}: about <b>13.74 US gallons</b>.`,
        run: async (c) => { await tween(c, 1500, (t) => setP(13.74 * t, 0)); setP(13.74, 0); await c.fadeIn(L1); } },
      { cap: `(b) The pump charges $3.29 per gallon: ${T('13.74\\times\\$3.29=45.2046')}, about <b>$45.20 USD</b>.`,
        run: async (c) => { await tween(c, 1200, (t) => setP(13.74, 45.2046 * t)); setP(13.74, 45.2046); usd.querySelector('b').textContent = '45.20'; await c.fadeIn(L2); } },
      { cap: `(c) $3.29 buys one gallon, which is 3.785 L: ${T('\\$3.29\\div3.785\\approx\\$0.869')} USD per litre.`, run: (c) => c.fadeIn(L3) },
      { cap: `(d) Change to Canadian dollars: ${T('0.8692\\ldots\\times1.38\\approx\\$1.20')} CAD per litre.`, run: async (c) => { await c.fadeIn(L4); await c.fadeIn(sM); } },
      { cap: `Compare with Calgary: ${T('\\$1.45-\\$1.20=\\$0.25')}. Gas in Montana is about <b>25¢ per litre cheaper</b>.`, run: async (c) => { await c.fadeIn(sC); await stampIn(c, st); } }
    ];
  }
};

/* =====================================================================================
 * 10. A US cup and a metric cup (Full notes, Example 8)
 * ===================================================================================== */
const pancakes = {
  title: '1½ US cups vs 1½ metric cups',
  height: 400,
  minW: 900,
  ask: 'Example 8(b)(c): the recipe needs <b>1½ US cups</b> of milk (1 US cup ≈ 237 mL). Marco uses <b>1½ metric cups</b> (1 cup = 250 mL). How much extra milk is that?',
  make(stage, k, ex) {
    const svg = svgBox(stage, 520, 400), PX = 540, PW = ex.W - PX - 20;
    const base = 350, sc = 0.72, X0 = 90, top = base - 400 * sc;
    let s = `<line x1="${X0}" y1="${base}" x2="${X0}" y2="${top}" stroke="#3a4254" stroke-width="2"/>`;
    for (let v = 0; v <= 400; v += 50) s += `<line x1="${X0 - (v % 100 ? 5 : 10)}" y1="${base - v * sc}" x2="${X0}" y2="${base - v * sc}" stroke="#3a4254" stroke-width="2"/>`;
    svgEl('g', {}, svg).innerHTML = s;
    for (let v = 0; v <= 400; v += 100) lab(stage, `${v}`, X0 - 50, base - v * sc - 12, 'axis');
    lab(stage, 'mL', X0 - 24, top - 34, 'axis');
    const xs = [150, 320], w = 110;
    const v1 = vessel(svg, xs[0], top, w, 400 * sc, { fill: MILK, surf: '#b9b39f', handle: true, r: 6 }), v2 = vessel(svg, xs[1], top, w, 400 * sc, { fill: MILK, surf: '#b9b39f', handle: true, r: 6 });
    labC(stage, '<b>US cups</b>', xs[0] + w / 2, base + 22, 'tag'); labC(stage, '<b>Metric cups</b>', xs[1] + w / 2, base + 22, 'tag');
    const yA = base - 355.5 * sc, yB = base - 375 * sc;
    const band = hide(svgEl('rect', { x: xs[1], y: yB, width: w, height: yA - yB, fill: '#f2a65a', opacity: 0.7 }, svg));
    const dash = hide(svgEl('line', { x1: xs[0], y1: yA, x2: xs[1] + w, y2: yA, stroke: '#c93a33', 'stroke-width': 2, 'stroke-dasharray': '6 5' }, svg));
    const spoons = hide(svgEl('g', {}, svg));
    for (let i = 0; i < 4; i++) spoons.insertAdjacentHTML('beforeend', `<g transform="translate(${470} ${70 + i * 36})"><ellipse cx="0" cy="0" rx="13" ry="9" fill="#d9dce1" stroke="#3a4254" stroke-width="2"/><line x1="12" y1="2" x2="40" y2="10" stroke="#3a4254" stroke-width="4" stroke-linecap="round"/></g>`);
    const spL = hide(lab(stage, '≈ 4 tsp', 452, 216, 'dim red'));
    const L1 = line(stage, `US: ${T('1.5\\times237=355.5')} mL`, PX, 30, PW);
    const L2 = line(stage, `Metric: ${T('1.5\\times250=375')} mL`, PX, 90, PW);
    const L3 = line(stage, `Extra: ${T('375-355.5=19.5')} mL`, PX, 150, PW, 'big');
    const L4 = line(stage, `${T('19.5\\div355.5\\approx0.055')}: about 5–6% more`, PX, 216, PW);
    const st = hide(stamp(stage, 'Close enough ✓', { ok: true, x: PX + PW / 2, y: 320, rotate: -5 }));
    const fillTo = (c, v, ml) => tween(c, 1300, (t) => v.set(ml * t / 400));
    return [
      { cap: `The recipe: 1½ US cups = ${T('1.5\\times237=355.5')} mL.`, run: async (c) => { await fillTo(c, v1, 355.5); await c.fadeIn(L1); } },
      { cap: `Marco’s metric cup: ${T('1.5\\times250=375')} mL.`, run: async (c) => { await fillTo(c, v2, 375); await c.fadeIn(L2); } },
      { cap: `Extra milk: ${T('375-355.5=19.5')} mL, about 20 mL. That is about <b>4 teaspoons</b> (5 mL each).`, run: async (c) => { await c.fadeIn(dash); await c.fadeIn(band); await c.fadeIn(L3); await c.fadeIn(spoons); await c.fadeIn(spL); } },
      { cap: '20 mL is only about <b>5–6% more</b> milk: the batter is just a little thinner. For pancakes, <b>close enough</b>. (For exact baking, convert carefully.)', run: async (c) => { await c.fadeIn(L4); await stampIn(c, st); } }
    ];
  }
};

mountExplainers({ litreCube, mlMachine, tankFill, usLadder, lemonade, twoGallons, percentBigger, convertSI, gasTrip, pancakes });

/* ============ Stand Up Break! — capacity units, US units and US/British gallons, at the whiteboards ============ */
{
  const d2 = (v) => rnd(v, 2).toFixed(2);
  standup('u4l2', {
    intro: 'Estimate first. Write the units in every step so you can see whether to multiply or divide.',
    levels: {
      BEG: (r) => r.pick([
        () => { const L = r.pick([1.5, 2.4, 3.75, 0.8, 4.25, 12]), ml = r.pick([250, 355, 680, 1250, 75, 2400]);
          return { text: `(a) Change <b>${L} L</b> to mL. &nbsp; (b) Change <b>${nH(ml)} mL</b> to L.`, q: '',
            a: [`\\text{(a) }${L}\\times1000=${nT(rnd(L * 1000, 2))}\\text{ mL}`, `\\text{(b) }${nT(ml)}\\div1000=${rnd(ml / 1000, 3)}\\text{ L}`] }; },
        () => { const l = r.pick([20, 25, 30, 40, 50]), w = r.pick([10, 15, 20, 25]), hh = r.pick([10, 12, 20, 30]), V = l * w * hh;
          return { text: `A box-shaped cooler is <b>${l} cm</b> long, <b>${w} cm</b> wide and <b>${hh} cm</b> high inside. What is its capacity in litres?`, q: '',
            a: [`V=${l}\\times${w}\\times${hh}=${nT(V)}\\text{ cm}^3`, `${nT(V)}\\text{ cm}^3=${nT(V)}\\text{ mL}`, `${nT(V)}\\div1000=${rnd(V / 1000, 3)}\\text{ L}`] }; }
      ])(),
      PRG: (r) => r.pick([
        () => { const g = r.pick([2, 3, 4, 5, 6]); return { text: `How many <b>cups</b> are in <b>${g} US gallons</b>? How many <b>fl oz</b>?`, q: '',
          a: [`${g}\\times4\\times2\\times2=${g * 16}\\text{ cups}`, `${g * 16}\\times8=${g * 128}\\text{ fl oz}`] }; },
        () => { const oz = r.pick([48, 64, 96, 80, 112]); return { text: `A jug of juice holds <b>${oz} US fl oz</b>. How many <b>cups</b>? How many <b>quarts</b>?`, q: '',
          a: [`${oz}\\div8=${oz / 8}\\text{ cups}`, `${oz / 8}\\div2=${oz / 16}\\text{ pt}`, `${oz / 16}\\div2=${oz / 32}\\text{ qt}`] }; },
        () => { const gal = r.pick([2, 3, 4, 5]), cup = r.pick([8, 12, 16]), n = gal * 128 / cup; return { text: `A water cooler holds <b>${gal} US gallons</b>. How many <b>${cup} fl oz</b> bottles can it fill?`, q: '',
          a: [`${gal}\\times128=${gal * 128}\\text{ fl oz}`, `${gal * 128}\\div${cup}=${rnd(n, 2)}`, Number.isInteger(n) ? `${n}\\text{ bottles}` : `${Math.floor(n)}\\text{ full bottles}`] }; }
      ])(),
      MAS: (r) => r.pick([
        () => { const g = r.pick([40, 50, 75, 120, 150]); const L = g * 4.546;
          return { text: `An old Canadian tractor tank is labelled <b>${g} gallons</b> (British). How many litres is that? How many <b>US</b> gallons? Round to the nearest tenth.`, q: '',
            a: [`${g}\\times4.546=${rnd(L, 3)}\\text{ L}`, `${rnd(L, 3)}\\div3.785\\approx${rnd(L / 3.785, 1).toFixed(1)}\\text{ US gal}`] }; },
        () => { const L = r.pick([45, 55, 60, 68, 75]), p = r.pick([3.09, 3.19, 3.39, 3.49, 3.59]), g = L / 3.785;
          return { text: `A truck’s tank holds <b>${L} L</b>. In Idaho, gas is <b>$${p.toFixed(2)} USD per US gallon</b>. How many US gallons fill the tank, and what does it cost (USD)?`, q: '',
            a: [`${L}\\div3.785\\approx${d2(g)}\\text{ US gal}`, `${d2(g)}\\times\\$${p.toFixed(2)}\\approx\\$${d2(rnd(g, 2) * p)}\\text{ USD}`] }; }
      ])()
    }
  });
}
