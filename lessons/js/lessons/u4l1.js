/* Math 10-3 · Unit 4 · Lesson 1 — Volume of Prisms and Cylinders.
 * Explainers: a box filling with cubes layer by layer (Example 1), a triangle base sliding back into a prism (Examples 3
 * and 4), why the ½ (Full notes: the corners of the box turn into a second triangle), a can built from stacked circles
 * (Examples 5 and 6), the cake-pan verdict (Example 6: pour the batter), a 1 ft cube cut into 1728 in³ (and yd³, m³),
 * multiply or divide (Full notes: Example 7), the toy chest two ways (Full notes: Example 8), ordering concrete and
 * gravel with a round-up number line (Examples 9 and 10), and Mia's concrete spreading into a slab (Example 11).
 * Static figures (Examples 1, 3, 4, the cylinder key idea, the referents) are drawn with the same oblique helpers.
 * Then the Stand Up Break. */
import { h, add, box, tex, svgEl, tween, stamp, stampIn, NumberLine, mountExplainers } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const rnd = (v, d = 2) => Math.round((v + (v >= 0 ? 1e-9 : -1e-9)) * 10 ** d) / 10 ** d;
const lerp = (a, b, t) => a + (b - a) * t;
/** booklet style: 4-digit numbers plain, 5+ digits with thin spaces (TeX) */
const nT = (v) => { const s = String(v); const [i, d] = s.split('.'); const ii = i.length > 4 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : i; return d ? ii + '.' + d : ii; };
const nH = (v) => nT(v).replace(/\\,/g, ' ');
const cbox = (cls, html) => h('div', cls + ' u4l1-c', `<div>${html}</div>`);
const line = (stage, html, x, y, w, cls = '') => hide(add(stage, box(h('div', 'u4l1-ln ' + cls, `<div>${html}</div>`), w, 46), x, y));

/* ---------- oblique drawing: x to the right, y up, z (depth) going back up-right ---------- */
const KX = 0.45, KY = 0.3;
const proj = (ox, oy, s, ky = KY, kx = KX) => (x, y, z, sy = 1) => [ox + (x + z * kx) * s, oy - (y * sy + z * ky) * s];
const pstr = (pts) => pts.map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
const FACES = { amber: ['#f6d38b', '#fbe9c4', '#dcae55'], teal: ['#a6d8cc', '#d3ede6', '#74b6a6'], rose: ['#f4aaa0', '#fad5cf', '#d97c70'], blue: ['#bccbf2', '#e0e7fa', '#8ea3dc'],
  gray: ['#c9c6bf', '#e4e1da', '#a9a59c'], conc: ['#bdbab3', '#dad7d0', '#9c988f'], grav: ['#c8a77a', '#e0c79f', '#a8875a'], wood: ['#e7c48f', '#f4dcb5', '#c99d5e'], none: ['none', 'none', 'none'] };
const STROKE = '#6e4a1c';

/** a box l × w × h at the origin of P (faces: front, top, right), optional unit grid every `step` */
function boxSVG(P, l, w, hh, o = {}) {
  const [cf, ct, cr] = FACES[o.col || 'amber'], sw = o.sw || 2.5, st = o.stroke || STROKE, dash = o.dash ? ` stroke-dasharray="${o.dash}"` : '';
  const sy = o.sy || 1;
  const p = (x, y, z) => P(x, y, z, sy);
  let s = '';
  if (o.hidden) { // dashed hidden edges (wireframe look)
    s += `<path d="M${pstr([p(0, 0, w)])} L${pstr([p(l, 0, w)])} M${pstr([p(0, 0, w)])} L${pstr([p(0, hh, w)])} M${pstr([p(0, 0, w)])} L${pstr([p(0, 0, 0)])}" fill="none" stroke="${o.hidden}" stroke-width="1.6" stroke-dasharray="5 5"/>`;
  }
  s += `<polygon points="${pstr([p(0, 0, 0), p(l, 0, 0), p(l, hh, 0), p(0, hh, 0)])}" fill="${cf}" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round"${dash}/>`;
  s += `<polygon points="${pstr([p(0, hh, 0), p(l, hh, 0), p(l, hh, w), p(0, hh, w)])}" fill="${ct}" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round"${dash}/>`;
  s += `<polygon points="${pstr([p(l, 0, 0), p(l, 0, w), p(l, hh, w), p(l, hh, 0)])}" fill="${cr}" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round"${dash}/>`;
  if (o.grid) {
    const g = o.grid, d = [];
    for (let i = g; i < l - 1e-9; i += g) { d.push([p(i, 0, 0), p(i, hh, 0)], [p(i, hh, 0), p(i, hh, w)]); }
    for (let j = g; j < hh - 1e-9; j += g) { d.push([p(0, j, 0), p(l, j, 0)], [p(l, j, 0), p(l, j, w)]); }
    for (let k = g; k < w - 1e-9; k += g) { d.push([p(0, hh, k), p(l, hh, k)], [p(l, 0, k), p(l, hh, k)]); }
    s += `<path d="${d.map(([a, b]) => `M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${b[0].toFixed(1)} ${b[1].toFixed(1)}`).join('')}" stroke="${st}" stroke-width="${o.gsw || 1.2}" opacity="${o.gop || 0.55}" fill="none"/>`;
  }
  return s;
}
/** one unit cube (x, y, z) as a <g> */
function cubeG(parent, P, x, y, z, col) {
  const [cf, ct, cr] = FACES[col];
  const g = svgEl('g', {}, parent);
  g.innerHTML = `<polygon points="${pstr([P(x, y, z), P(x + 1, y, z), P(x + 1, y + 1, z), P(x, y + 1, z)])}" fill="${cf}"/>`
    + `<polygon points="${pstr([P(x, y + 1, z), P(x + 1, y + 1, z), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)])}" fill="${ct}"/>`
    + `<polygon points="${pstr([P(x + 1, y, z), P(x + 1, y, z + 1), P(x + 1, y + 1, z + 1), P(x + 1, y + 1, z)])}" fill="${cr}"/>`;
  g.setAttribute('stroke', STROKE); g.setAttribute('stroke-width', '1.8'); g.setAttribute('stroke-linejoin', 'round');
  return g;
}
/** a prism: front polygon pts (CCW, x right / y up) pushed back a depth L. Visible sides filled, hidden edges dashed. */
function prismSVG(P, pts, L, o = {}) {
  const [cf, ct, cr] = FACES[o.col || 'amber'], n = pts.length, st = o.stroke || STROKE, sw = o.sw || 2.6;
  const F = pts.map(([x, y]) => P(x, y, 0)), B = pts.map(([x, y]) => P(x, y, L));
  const vis = pts.map((a, i) => { const b = pts[(i + 1) % n]; const nx = b[1] - a[1], ny = -(b[0] - a[0]); return nx * KX + ny * KY > 1e-9; });
  let s = '';
  if (L > 1e-6) {
    const hid = [];
    pts.forEach((a, i) => { const j = (i + 1) % n; if (!vis[i]) hid.push([B[i], B[j]]); if (!vis[i] && !vis[(i - 1 + n) % n]) hid.push([F[i], B[i]]); });
    if (!o.noHidden) s += `<path d="${hid.map(([a, b]) => `M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${b[0].toFixed(1)} ${b[1].toFixed(1)}`).join('')}" stroke="#8a8170" stroke-width="1.6" stroke-dasharray="5 5" fill="none"/>`;
    pts.forEach((a, i) => { if (!vis[i]) return; const j = (i + 1) % n; const up = (pts[j][0] - a[0]) * -1 > 0 || Math.abs(pts[j][1] - a[1]) < 1e-9; s += `<polygon points="${pstr([F[i], F[j], B[j], B[i]])}" fill="${up ? ct : cr}" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round"/>`; });
  }
  s += `<polygon points="${pstr(F)}" fill="${o.front || cf}" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round"/>`;
  return s;
}
/** an upright cylinder: centre of the bottom (cx, by), radius rx px, height hp px */
function cylSVG(cx, by, rx, hp, o = {}) {
  const ry = rx * (o.k || 0.3), top = by - hp, st = o.stroke || STROKE, sw = o.sw || 2.6;
  const body = o.body || '#f1d9a8', lid = o.lid || '#f8e8c8';
  let s = '';
  s += `<path d="M${cx - rx} ${by} A${rx} ${ry} 0 0 0 ${cx + rx} ${by} L${cx + rx} ${top} A${rx} ${ry} 0 0 1 ${cx - rx} ${top} Z" fill="${body}" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round"/>`;
  if (o.rims) for (let i = 1; i < o.rims; i++) { const y = by - hp * i / o.rims; s += `<path d="M${cx - rx} ${y} A${rx} ${ry} 0 0 0 ${cx + rx} ${y}" fill="none" stroke="${st}" stroke-width="1.1" opacity=".45"/>`; }
  s += `<ellipse cx="${cx}" cy="${top}" rx="${rx}" ry="${ry}" fill="${lid}" stroke="${st}" stroke-width="${sw}"/>`;
  return s;
}
const svgBox = (stage, W, H, x = 0, y = 0) => add(stage, svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u4l1-svg' }), x, y);
const lab = (stage, html, x, y, cls = '') => { const e = add(stage, h('div', 'u4l1-lab ' + cls, html), x, y); return e; };
const labC = (stage, html, x, y, cls = '') => { const e = lab(stage, html, x, y, 'ctr ' + cls); return e; }; // centred on (x, y)

/* =====================================================================================
 * 1. Fill the box with cubes, layer by layer
 * ===================================================================================== */
const FB = {
  e1: { l: 4, w: 3, h: 2, u: 'cm', ask: 'Example 1: this box is built from 1 cm cubes. It is <b>4 cm</b> long, <b>3 cm</b> wide and <b>2 cm</b> high. What is its volume?' },
  d1: { l: 3, w: 3, h: 4, u: 'in', ask: 'A box <b>3 in</b> long, <b>3 in</b> wide and <b>4 in</b> high is filled with 1 in cubes. What is its volume?' }
};
const LAYER = ['amber', 'teal', 'rose', 'blue'];
const fillBox = {
  title: 'Fill the box: layers of cubes',
  height: 400,
  minW: 900,
  choices: [{ sep: 'Example 1 check:' }, { v: 'e1', label: '4 × 3 × 2 box' }, { sep: 'Another box:' }, { v: 'd1', label: '3 × 3 × 4 box' }],
  ask: (k) => FB[k].ask,
  make(stage, k, ex) {
    const d = FB[k], { l, w } = d, H = d.h, u = d.u, base = l * w, V = base * H;
    const s = Math.min(62, 420 / (l + w * KX), 300 / (H + w * KY));
    const ox = 50 + (440 - (l + w * KX) * s) / 2, oy = 360 - (300 - (H + w * KY) * s) / 2;
    const P = proj(ox, oy, s);
    const svg = svgBox(stage, 520, 400);
    const ghost = svgEl('g', {}, svg); ghost.innerHTML = boxSVG(P, l, w, H, { col: 'none', stroke: '#9a8e78', sw: 2, dash: '7 6', hidden: '#b9ad97' });
    const cubes = [];
    for (let z = w - 1; z >= 0; z--) for (let y = 0; y < H; y++) for (let x = 0; x < l; x++) cubes.push({ x, y, z, g: hide(cubeG(svg, P, x, y, z, LAYER[y % 4])) });
    const layer = (y) => cubes.filter((q) => q.y === y).sort((a, b) => (b.z - a.z) || (a.x - b.x));
    // dimension labels
    const [bx, by] = P(l / 2, 0, 0), [rx, ry] = P(l, 0, w / 2), [hx, hy] = P(0, H / 2, 0);
    labC(stage, `${l} ${u}`, bx, by + 20, 'dim');
    lab(stage, `${w} ${u}`, rx + 10, ry - 8, 'dim');
    lab(stage, `${H} ${u}`, hx - 66, hy - 14, 'dim');
    const cnt = hide(add(stage, box(cbox('u4l1-cnt', '0 cubes'), 150, 42), 20, 6));
    const PX = 560, PW = ex.W - PX - 20;
    const L1 = line(stage, `Bottom layer: ${T(`${l}\\times${w}=${base}`)} cubes`, PX, 40, PW);
    const L2 = line(stage, `Layers: <b>${H}</b>`, PX, 100, PW);
    const L3 = line(stage, `${T(`V=${base}\\times${H}=${V}\\text{ ${u}}^3`)}`, PX, 160, PW, 'big');
    const L4 = line(stage, `Check: ${T(`${l}\\times${w}\\times${H}=${V}\\text{ ${u}}^3`)} ✓`, PX, 230, PW, 'ok');
    const key = hide(add(stage, box(cbox('u4l1-key', '<b>V = (area of base) × height</b>'), PW, 52), PX, 300));
    const setCnt = (n) => { cnt.firstChild.innerHTML = `<b>${n}</b> cube${n === 1 ? '' : 's'}`; };
    return [
      { cap: `Fill the <b>bottom layer</b>: ${w} rows of ${l} cubes.`,
        run: async (c) => { await c.fadeIn(cnt); let n = 0; for (const q of layer(0)) { n++; setCnt(n); await c.pop(q.g, 170); } } },
      { cap: `Bottom layer: ${T(`${l}\\times${w}=${base}`)} cubes. That number is the <b>area of the base</b>.`, run: (c) => c.fadeIn(L1) },
      { cap: `Stack the layers. The box is ${H} ${u} high, so there are <b>${H} layers</b> of ${base} cubes.`,
        run: async (c) => {
          for (let y = 1; y < H; y++) {
            const qs = layer(y); setCnt(base * (y + 1));
            await Promise.all(qs.map((q) => c.anim(q.g, [{ opacity: 0, transform: 'translateY(-70px)' }, { opacity: 1, transform: 'none' }], 480)));
          }
          await c.fadeIn(L2);
        } },
      { cap: `Volume = cubes in a layer × layers: ${T(`${base}\\times${H}=${V}`)}. The volume is <b>${V} ${u}³</b>.`, run: (c) => c.pop(L3) },
      { cap: `Check with the formula ${T('V=l\\times w\\times h')}: ${T(`${l}\\times${w}\\times${H}=${V}`)} ${u}³ ✓`, run: async (c) => { await c.fadeIn(L4); await c.fadeIn(key); } }
    ];
  }
};

/* =====================================================================================
 * 2. Any prism: find the base area, then slide the base back
 * ===================================================================================== */
const PR = {
  e3: { ask: 'Example 3: a chocolate bar box is a triangular prism. Each triangle end has a base of <b>6 cm</b> and a height of <b>4 cm</b>. The box is <b>15 cm</b> long. Find its volume.',
    pts: [[0, 0], [6, 0], [3, 4]], rect: [6, 4], apex: 3, L: 15, u: 'cm', b: '6 cm', hgt: '4 cm', len: '15 cm', how: 'long', col: 'amber',
    s1: 'The base is the <b>end shape</b>: a triangle with base 6 cm and height 4 cm.',
    area: '\\tfrac12\\times6\\times4=12', A: '12', Ltx: '15', V: '180', alongWord: 'Slide the triangle back <b>15 cm</b>, the length of the box. Every slice is the same triangle.' },
  e4: { ask: 'Example 4: a concrete ramp is a triangular prism lying on its side. The triangle is <b>3.6 m</b> along the ground and <b>0.3 m</b> high. The ramp is <b>1.2 m</b> wide.',
    pts: [[0, 0], [3.6, 0], [3.6, 1.1]], rect: [3.6, 1.1], apex: 3.6, L: 1.2, u: 'm', b: '3.6 m', hgt: '0.3 m', len: '1.2 m wide', how: 'wide', col: 'conc', note: 'height not to scale',
    s1: 'The ramp lies on its side. The base is the <b>triangle at the side</b>: 3.6 m along the ground and 0.3 m high.',
    area: '\\tfrac12\\times3.6\\times0.3=0.54', A: '0.54', Ltx: '1.2', V: '0.648', cost: true, alongWord: 'Slide the triangle across the width of the ramp, <b>1.2 m</b>. Every slice is the same triangle.' }
};
function prismScene(stage, d, x0, y0, W, H) {
  const [rw, rh] = d.rect, tw = rw + d.L * KX, th = rh + d.L * KY;
  const s = Math.min(W / tw, H / th), ox = x0 + (W - tw * s) / 2, oy = y0 + H - (H - th * s) / 2;
  return { P: proj(ox, oy, s), s };
}
const prismSlide = {
  title: 'Any prism: area of the base × how far it goes',
  height: 400,
  minW: 900,
  choices: [{ sep: 'Check:' }, { v: 'e3', label: 'Example 3: chocolate box' }, { v: 'e4', label: 'Example 4: ramp' }],
  ask: (k) => PR[k].ask,
  make(stage, k, ex) {
    const d = PR[k], u = d.u;
    const { P } = prismScene(stage, d, 30, 40, 420, 300);
    const svg = svgBox(stage, 540, 400);
    const ghosts = svgEl('g', {}, svg), body = svgEl('g', {}, svg), over = svgEl('g', {}, svg);
    body.innerHTML = prismSVG(P, d.pts, 0, { col: d.col });
    hide(body);
    const [rw, rh] = d.rect;
    const rect = hide(svgEl('polygon', { points: pstr([P(0, 0, 0), P(rw, 0, 0), P(rw, rh, 0), P(0, rh, 0)]), fill: 'none', stroke: '#c27a0e', 'stroke-width': 2.5, 'stroke-dasharray': '8 6' }, over));
    const [ax, ay] = P(d.apex, rh, 0), [fx, fy] = P(d.apex, 0, 0);
    const hl = hide(svgEl('line', { x1: ax, y1: ay, x2: fx, y2: fy, stroke: '#1c2230', 'stroke-width': 2, 'stroke-dasharray': '4 4' }, over));
    // labels
    const [bx, by] = P(rw / 2, 0, 0);
    const lb = hide(labC(stage, d.b, bx, by + 20, 'dim'));
    const lh = hide(lab(stage, d.hgt, (d.apex === rw ? fx + 10 : fx + 8), (ay + fy) / 2 - 14, 'dim'));
    const ctr = P(rw * (d.apex === rw ? 0.66 : 0.5), rh * 0.33, 0);
    const la = hide(labC(stage, `${d.A} ${u}²`, ctr[0], ctr[1], 'area'));
    const [ex1, ey1] = P(rw, 0, d.L / 2);
    const ll = hide(lab(stage, d.len, ex1 + 12, ey1 - 6, 'dim'));
    if (d.note) lab(stage, `(${d.note})`, 30, 372, 'note');
    const PX = 580, PW = ex.W - PX - 20;
    const L1 = line(stage, `Area of base ${T(`=${d.area}`)} ${u}²`, PX, 40, PW);
    const L2 = line(stage, `${d.how === 'wide' ? 'Width' : 'Length'}: <b>${d.len.replace(' wide', '')}</b>`, PX, 104, PW);
    const L3 = line(stage, `${T(`V=${d.A}\\times${d.Ltx}=${d.V}\\text{ ${u}}^3`)}`, PX, 168, PW, 'big');
    const L4 = d.cost ? line(stage, `(b) ${T('0.648\\times\\$245.00=\\$158.76')}`, PX, 250, PW) : null;
    const steps = [
      { cap: d.s1, run: async (c) => { await c.fadeIn(body); await Promise.all([c.fadeIn(lb), c.fadeIn(lh), c.fadeIn(hl)]); } },
      { cap: `Area of the base: the triangle is <b>half</b> of a ${d.b.split(' ')[0]} by ${d.hgt.split(' ')[0]} rectangle. ${T(d.area)} ${u}².`,
        run: async (c) => { await c.fadeIn(rect); await c.pop(la); await c.fadeIn(L1); } },
      { cap: d.alongWord,
        run: async (c) => {
          await Promise.all([c.anim(rect, [{ opacity: 1 }, { opacity: 0 }], 250), c.anim(la, [{ opacity: 1 }, { opacity: 0 }], 250)]);
          const N = 6; let last = -1;
          await tween(c, 1400, (t) => {
            body.innerHTML = prismSVG(P, d.pts, d.L * t, { col: d.col, noHidden: t < 0.999 });
            const i = Math.floor(t * N + 1e-6);
            if (i > last && i < N) { last = i; const g = svgEl('polygon', { points: pstr(d.pts.map(([x, y]) => P(x, y, d.L * i / N))), fill: 'none', stroke: '#9a6a24', 'stroke-width': 1.4, opacity: 0.7 }, ghosts); g.dataset.k = i; }
          });
          body.innerHTML = prismSVG(P, d.pts, d.L, { col: d.col });
          await c.fadeIn(ll); await c.fadeIn(L2);
        } },
      { cap: `Volume = area of base × ${d.how === 'wide' ? 'width' : 'length'}: ${T(`${d.A}\\times${d.Ltx}=${d.V}`)}. It holds <b>${d.V} ${u}³</b>.`, run: (c) => c.pop(L3) }
    ];
    if (d.cost) steps.push({ cap: `(b) The concrete costs ${T('0.648\\times\\$245.00=\\$158.76')}.`, run: (c) => c.fadeIn(L4) });
    return steps;
  }
};

/* =====================================================================================
 * 3. Why the ½? The leftover corners make a second triangle (Full notes)
 * ===================================================================================== */
const HB = {
  e3: { box: '6\\times4\\times15=360', half: '360\\div2=180', fullX: '\\tfrac12\\times6\\times4\\times15=180', u: 'cm', boxV: '360', V: '180', w: 6, hh: 4,
    tri: [[0, 0], [6, 0], [3, 4]], corners: [[[0, 0], [3, 4], [0, 4]], [[6, 0], [6, 4], [3, 4]]], rl: '6 by 4' },
  e4: { box: '3.6\\times0.3\\times1.2=1.296', half: '1.296\\div2=0.648', fullX: '\\tfrac12\\times3.6\\times0.3\\times1.2=0.648', u: 'm', boxV: '1.296', V: '0.648', w: 3.6, hh: 1.1,
    tri: [[0, 0], [3.6, 0], [3.6, 1.1]], corners: [[[0, 0], [3.6, 1.1], [0, 1.1]]], rl: '3.6 by 0.3' }
};
const halfBox = {
  title: 'Why ½? The prism is half a box',
  height: 400,
  minW: 900,
  choices: [{ sep: 'With the numbers from:' }, { v: 'e3', label: 'Example 3' }, { v: 'e4', label: 'Example 4' }],
  ask: (k) => (k === 'e3' ? 'Why is the chocolate box (triangle 6 cm by 4 cm, 15 cm long) only <b>half</b> of a 6 × 4 × 15 box?' : 'Why is the ramp (triangle 3.6 m by 0.3 m, 1.2 m wide) only <b>half</b> of a 3.6 × 0.3 × 1.2 box?'),
  make(stage, k, ex) {
    const d = HB[k], P3 = PR[k], u = d.u;
    const { P } = prismScene(stage, P3, 20, 30, 380, 260);
    const svg = svgBox(stage, ex.W, 400);
    const boxG = svgEl('g', {}, svg); boxG.innerHTML = prismSVG(P, [[0, 0], [d.w, 0], [d.w, d.hh], [0, d.hh]], P3.L, { col: 'blue' });
    const triG = hide(svgEl('g', {}, svg)); triG.innerHTML = prismSVG(P, d.tri, P3.L, { col: P3.col });
    // the flat end, big, on the right
    const s2 = Math.min(200 / d.w, 150 / d.hh), X0 = 440, Y0 = 220;
    const Q = (x, y) => [X0 + x * s2, Y0 - y * s2];
    const endG = hide(svgEl('g', {}, svg));
    svgEl('polygon', { points: pstr([Q(0, 0), Q(d.w, 0), Q(d.w, d.hh), Q(0, d.hh)]), fill: '#e0e7fa', stroke: '#3a4a7a', 'stroke-width': 2.5 }, endG);
    svgEl('polygon', { points: pstr(d.tri.map(([x, y]) => Q(x, y))), fill: '#f6d38b', stroke: STROKE, 'stroke-width': 2.6, 'stroke-linejoin': 'round' }, endG);
    const pieces = d.corners.map((cp) => { const g = svgEl('g', {}, endG); svgEl('polygon', { points: pstr(cp.map(([x, y]) => Q(x, y))), fill: '#f4aaa0', stroke: '#8b2f1c', 'stroke-width': 2.4, 'stroke-linejoin': 'round' }, g); return { g, cp }; });
    const dx = (d.w + 0.4) * s2;
    const L0 = hide(lab(stage, `Box: ${T(d.box)} ${u}³`, 30, 336, 'pl'));
    const L1 = hide(lab(stage, `Triangle = <b>half</b> the rectangle`, 450, 250, 'pl'));
    const L2 = hide(add(stage, box(cbox('u4l1-res', `Prism: ${T(d.half)} ${u}³`), 420, 52), 440, 320));
    return [
      { cap: `A box with the same end and the same ${k === 'e3' ? 'length' : 'width'}: ${T(d.box)} ${u}³.`, run: (c) => c.fadeIn(L0) },
      { cap: 'The prism sits inside the box. Look at the end: the triangle, and the leftover corners (red).', run: async (c) => { await c.fadeIn(triG); await c.fadeIn(endG); } },
      { cap: d.corners.length > 1 ? 'Turn the two corners around and push them together: they make <b>another triangle</b>, the same as the first.' : 'Turn the corner around: it is <b>another triangle</b>, the same as the first.',
        run: async (c) => {
          await tween(c, 1300, (t) => pieces.forEach(({ g, cp }) => {
            const xs = cp.map((p) => p[0]), ys = cp.map((p) => p[1]);
            const [cx, cy] = Q((Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2);
            g.setAttribute('transform', `translate(${dx * t} 0) rotate(${180 * t} ${cx} ${cy})`);
          }));
          await c.fadeIn(L1);
        } },
      { cap: `So the triangle is half the rectangle, and the prism is <b>half the box</b>: ${T(d.half)} ${u}³, the same as ${T(d.fullX)}. That is where the ${T('\\tfrac12')} comes from.`, run: (c) => c.pop(L2) }
    ];
  }
};

/* =====================================================================================
 * 4. A cylinder is a stack of circles
 * ===================================================================================== */
const CY = {
  a: { ask: 'Example 5(a): a soup can is <b>7.4 cm</b> across (diameter) and <b>10.2 cm</b> tall. Estimate its volume, then calculate it to the nearest tenth.',
    d: 7.4, r: 3.7, hh: 10.2, u: 'cm', A: '43.00\\ldots', lcd: ['π×3.7²×10.2', '438.6857149'], V: '438.68\\ldots\\approx438.7', Vw: '438.7', est: '3\\times4^2\\times10=480', estLong: '3\\times4^2\\times10=3\\times16\\times10=480', estV: 480, col: ['#f3c3b8', '#fbe2dc'], label: 'SOUP' },
  b: { ask: 'Example 5(b): a round hay bale is a cylinder <b>5 ft</b> across and <b>4 ft</b> wide (its height when it stands on end). Find its volume to the nearest hundredth.',
    d: 5, r: 2.5, hh: 4, u: 'ft', A: '19.63\\ldots', lcd: ['π×2.5²×4', '78.53981634'], V: '78.539\\ldots\\approx78.54', Vw: '78.54', col: ['#e9cf7a', '#f6e6ad'], stand: true },
  c: { ask: 'Example 6(a): Marisol’s round cake pan is <b>9 in</b> across and <b>2 in</b> deep. Find its volume to the nearest hundredth.',
    d: 9, r: 4.5, hh: 2, u: 'in', A: '63.61\\ldots', lcd: ['π×4.5²×2', '127.2345025'], V: '127.234\\ldots\\approx127.23', Vw: '127.23', col: ['#c9ccd1', '#e6e8eb'] }
};
const cylinder = {
  title: 'A cylinder: a stack of circles',
  height: 410,
  minW: 900,
  choices: [{ sep: 'Check:' }, { v: 'a', label: '5(a) Soup can' }, { v: 'b', label: '5(b) Hay bale' }, { v: 'c', label: '6(a) Round pan' }],
  ask: (k) => CY[k].ask,
  make(stage, k, ex) {
    const d = CY[k], u = d.u;
    const s = Math.min(150 / d.r, 250 / d.hh), rx = d.r * s, hp = d.hh * s, cx = 250, by = 318, ry = rx * 0.3;
    const svg = svgBox(stage, 540, 410);
    const ghost = svgEl('g', {}, svg); ghost.innerHTML = cylSVG(cx, by, rx, hp, { body: 'none', lid: 'none', stroke: '#b9ad97', sw: 1.8 });
    ghost.querySelectorAll('path,ellipse').forEach((e) => e.setAttribute('stroke-dasharray', '7 6'));
    const baseE = svgEl('ellipse', { cx, cy: by, rx, ry, fill: '#fff', stroke: STROKE, 'stroke-width': 2.6 }, svg);
    const body = svgEl('g', {}, svg);
    const dl = svgEl('line', { x1: cx - rx, y1: by, x2: cx + rx, y2: by, stroke: '#1f5bd6', 'stroke-width': 3 }, svg);
    const ldl = labC(stage, `d = ${d.d} ${u}`, cx, by + ry + 18, 'dim blue');
    const rl = hide(svgEl('line', { x1: cx, y1: by, x2: cx + rx, y2: by, stroke: '#c93a33', 'stroke-width': 4 }, svg));
    const dot = svgEl('circle', { cx, cy: by, r: 4, fill: '#1c2230' }, svg);
    const lrl = hide(labC(stage, `r = ${d.r} ${u}`, cx + rx / 2, by - 22, 'dim red'));
    const larea = hide(labC(stage, `${T(`\\pi r^2=${d.A}`)} ${u}²`, cx, by - ry - 36, 'area'));
    const hArrow = hide(svgEl('g', {}, svg));
    hArrow.innerHTML = `<line x1="${cx + rx + 26}" y1="${by}" x2="${cx + rx + 26}" y2="${by - hp}" stroke="#1c2230" stroke-width="2"/><path d="M${cx + rx + 20} ${by - 8} L${cx + rx + 26} ${by} L${cx + rx + 32} ${by - 8} M${cx + rx + 20} ${by - hp + 8} L${cx + rx + 26} ${by - hp} L${cx + rx + 32} ${by - hp + 8}" fill="none" stroke="#1c2230" stroke-width="2"/>`;
    const lh = hide(lab(stage, `h = ${d.hh} ${u}`, cx + rx + 36, by - hp / 2 - 14, 'dim'));
    const PX = 570, PW = ex.W - PX - 20;
    const L1 = line(stage, `${T(`r=${d.d}\\div2=${d.r}`)} ${u}`, PX, 20, PW);
    const L2 = line(stage, `Base: ${T(`\\pi\\times${d.r}^2=${d.A}`)} ${u}²`, PX, 74, PW);
    const lcd = hide(add(stage, box(h('div', 'u4l1-lcd', `<div class="e">${d.lcd[0]}</div><div class="r">${d.lcd[1]}</div>`), 250, 66), PX, 136));
    const L3 = line(stage, `${T(`V=${d.V}`)} ${u}³`, PX, 214, PW, 'big');
    const L4 = d.est ? line(stage, `Estimate: ${T(d.est)}`, PX, 280, PW, 'est') : null;
    const st = d.est ? hide(stamp(stage, 'Reasonable ✓', { ok: true, x: PX + PW / 2, y: 362, rotate: -5 })) : null;
    const steps = [
      { cap: `Halve the diameter to get the radius: ${T(`r=${d.d}\\div2=${d.r}`)} ${u}.`,
        run: async (c) => { await c.anim(dl, [{ opacity: 1 }, { opacity: 0.25 }], 300); await c.fadeIn(rl); await c.fadeIn(lrl); await c.fadeIn(L1); } },
      { cap: `Area of the circle base: ${T(`\\pi r^2=\\pi\\times${d.r}^2=${d.A}`)} ${u}².`,
        run: async (c) => { await c.anim(baseE, [{ fill: '#fff' }, { fill: d.col[1] }], 400); await c.pop(larea); await c.fadeIn(L2); } },
      { cap: `${d.stand ? 'Stand the bale on end. ' : ''}Stack the base up to the height, <b>${d.hh} ${u}</b>. Every slice is the same circle.`,
        run: async (c) => {
          [rl, lrl, dl, dot, ldl].forEach((e) => { e.style.opacity = 0.0; });
          await c.anim(larea, [{ opacity: 1 }, { opacity: 0 }], 200);
          await tween(c, 1300, (t) => { body.innerHTML = cylSVG(cx, by, rx, hp * t, { body: d.col[0], lid: d.col[1], rims: Math.max(1, Math.round(8 * t)) }); });
          body.innerHTML = cylSVG(cx, by, rx, hp, { body: d.col[0], lid: d.col[1], rims: 8 });
          if (d.label) { const t2 = svgEl('text', { x: cx, y: by - hp / 2 + 10, 'text-anchor': 'middle', 'font-size': 30, 'font-weight': 800, fill: '#8b2f1c' }, body); t2.textContent = d.label; }
          await c.fadeIn(hArrow); await c.fadeIn(lh);
        } },
      { cap: `Volume = base × height: ${T(`\\pi\\times${d.r}^2\\times${d.hh}=${d.V}`)}. It holds about <b>${d.Vw} ${u}³</b>.`,
        run: async (c) => { await c.pop(lcd); await c.fadeIn(L3); } }
    ];
    if (d.est) steps.push({ cap: `Check with an estimate: ${T('\\pi\\approx3')}, ${T('r\\approx4')}, ${T('h\\approx10')}: ${T(d.estLong)} ${u}³. Close to ${d.Vw} ✓`,
      run: async (c) => { await c.fadeIn(L4); await stampIn(c, st); } });
    return steps;
  }
};

/* =====================================================================================
 * 5. Will the batter fit? (Example 6)
 * ===================================================================================== */
const panVerdict = {
  title: 'Pour the batter: will it fit?',
  height: 400,
  minW: 900,
  choices: [{ sep: 'Example 6 check:' }, { v: 'a', label: '(a) Round vs square' }, { v: 'b', label: '(b) The 9 × 13 pan' }],
  ask: (k) => (k === 'a' ? 'Example 6(a): the batter fills a <b>9 in</b> round pan, 2 in deep. Will it fit in an <b>8 in by 8 in</b> square pan, 2 in deep?' : 'Example 6(b): a <b>9 in by 13 in</b> pan, 2 in deep, holds how many round pans of batter? (One round pan holds 127.23 in³.)'),
  make(stage, k, ex) {
    const s = 21, svg = svgBox(stage, ex.W, 400), BAT = '#f2c66d';
    const PX = 610, PW = ex.W - PX - 20;
    const tag = (html, x, y) => hide(labC(stage, html, x, y, 'tag'));
    if (k === 'a') {
      const c1 = [150, 160], R = 4.5 * s, q0 = [330, 160 - 4 * s], Q = 8 * s;
      svgEl('circle', { cx: c1[0], cy: c1[1], r: R, fill: '#d9dce1', stroke: '#3a4254', 'stroke-width': 6 }, svg);
      const bat1 = svgEl('circle', { cx: c1[0], cy: c1[1], r: R - 3, fill: BAT }, svg);
      const sq = hide(svgEl('g', {}, svg));
      svgEl('rect', { x: q0[0], y: q0[1], width: Q, height: Q, rx: 6, fill: '#d9dce1', stroke: '#3a4254', 'stroke-width': 6 }, sq);
      const bat2 = svgEl('rect', { x: q0[0] + 3, y: q0[1] + 3, width: Q - 6, height: Q - 6, rx: 4, fill: BAT, opacity: 0 }, sq);
      labC(stage, '9 in round', c1[0], 280, 'dim');
      const ls = hide(labC(stage, '8 in by 8 in', q0[0] + Q / 2, 280, 'dim'));
      const t1 = tag(`${T('\\pi\\times4.5^2\\times2')}<br><b>≈ 127.23 in³</b>`, c1[0], 336);
      const t2 = tag(`${T('8\\times8\\times2')}<br><b>= 128 in³</b>`, q0[0] + Q / 2, 336);
      // gauges: how full the square pan is
      const G = { x: 540, y: 90, w: 34, h: 150 };
      const gg = hide(svgEl('g', {}, svg));
      svgEl('rect', { x: G.x, y: G.y, width: G.w, height: G.h, rx: 6, fill: '#fff', stroke: '#3a4254', 'stroke-width': 2.5 }, gg);
      const gf = svgEl('rect', { x: G.x + 2, y: G.y + G.h - 2, width: G.w - 4, height: 0, fill: BAT }, gg);
      const gl = hide(lab(stage, 'almost<br>full', G.x - 6, G.y + G.h + 6, 'note'));
      const L1 = line(stage, `Round: ${T('\\approx127.23')} in³`, PX, 40, PW);
      const L2 = line(stage, `Square: ${T('128')} in³`, PX, 100, PW);
      const L3 = line(stage, `${T('127.23<128')}, just barely`, PX, 160, PW, 'big');
      const st = hide(stamp(stage, 'It fits ✓', { ok: true, x: PX + PW / 2, y: 280, rotate: -6, size: 'lg' }));
      return [
        { cap: `The round pan: ${T('r=9\\div2=4.5')} in, so ${T('V=\\pi\\times4.5^2\\times2\\approx127.23')} in³ of batter.`, run: async (c) => { await c.fadeIn(t1); await c.fadeIn(L1); } },
        { cap: `The square pan: ${T('V=8\\times8\\times2=128')} in³.`, run: async (c) => { await c.fadeIn(sq); await c.fadeIn(ls); await c.fadeIn(t2); await c.fadeIn(L2); } },
        { cap: 'Pour all the batter into the square pan…',
          run: async (c) => {
            await c.fadeIn(gg);
            const fr = 127.23 / 128;
            await tween(c, 1500, (t) => { bat1.setAttribute('r', Math.max(0, (R - 3) * Math.sqrt(1 - t))); bat2.setAttribute('opacity', t); const hh = (G.h - 4) * fr * t; gf.setAttribute('height', hh); gf.setAttribute('y', G.y + G.h - 2 - hh); });
            await c.fadeIn(gl);
          } },
        { cap: `127.23 in³ is just under 128 in³: the square pan is filled almost to the top. <b>The batter fits.</b>`, run: async (c) => { await c.fadeIn(L3); await stampIn(c, st); } }
      ];
    }
    // (b): the 9 × 13 pan, filled one round pan at a time
    const B0 = [40, 200 - 4.5 * s], BW = 13 * s, BH = 9 * s;
    svgEl('rect', { x: B0[0], y: B0[1], width: BW, height: BH, rx: 6, fill: '#d9dce1', stroke: '#3a4254', 'stroke-width': 6 }, svg);
    const f1 = svgEl('rect', { x: B0[0] + 3, y: B0[1] + 3, width: 0, height: BH - 6, fill: BAT }, svg);
    const f2 = svgEl('rect', { x: B0[0] + 3, y: B0[1] + 3, width: 0, height: BH - 6, fill: '#e9ad45' }, svg);
    const div = hide(svgEl('line', { x1: 0, y1: B0[1] + 3, x2: 0, y2: B0[1] + BH - 3, stroke: '#8a5a14', 'stroke-width': 2, 'stroke-dasharray': '5 4' }, svg));
    labC(stage, '9 in by 13 in, 2 in deep', B0[0] + BW / 2, B0[1] + BH + 22, 'dim');
    const rp = (cx, cy) => { const g = svgEl('g', {}, svg); svgEl('circle', { cx, cy, r: 50, fill: '#d9dce1', stroke: '#3a4254', 'stroke-width': 4 }, g); const b = svgEl('circle', { cx, cy, r: 47, fill: BAT }, g); return { g, b }; };
    const p1 = rp(410, 80), p2 = rp(510, 80); hide(p1.g, p2.g);
    const n1 = hide(labC(stage, 'pan 1', 410, 150, 'note')), n2 = hide(labC(stage, 'pan 2', 510, 150, 'note'));
    const left = hide(labC(stage, 'left over', 510, 178, 'note'));
    const used = 127.23 / 234, W1 = (BW - 6) * used;
    const L1 = line(stage, `${T('V=9\\times13\\times2=234')} in³`, PX, 30, PW);
    const L2 = line(stage, `1 pan: 127.23 in³, about half`, PX, 90, PW);
    const L3 = line(stage, `2 pans: 254.46 in³, too much`, PX, 150, PW, 'no');
    const L4 = line(stage, `${T('234\\div127.23\\approx1.8')} pans`, PX, 220, PW, 'big');
    return [
      { cap: `The big pan holds ${T('V=9\\times13\\times2=234')} in³.`, run: (c) => c.fadeIn(L1) },
      { cap: 'Pour in one round pan (127.23 in³). It fills a little more than <b>half</b> of the big pan.',
        run: async (c) => { await c.fadeIn(p1.g); await c.fadeIn(n1); await tween(c, 1200, (t) => { p1.b.setAttribute('r', 47 * Math.sqrt(1 - t)); f1.setAttribute('width', W1 * t); }); div.setAttribute('x1', B0[0] + 3 + W1); div.setAttribute('x2', B0[0] + 3 + W1); await c.fadeIn(div); await c.fadeIn(L2); } },
      { cap: 'Pour from a second pan until the big pan is full. Some batter is <b>left over</b>: two pans (254.46 in³) are too much.',
        run: async (c) => {
          await c.fadeIn(p2.g); await c.fadeIn(n2);
          const rest = (234 - 127.23) / 127.23; // part of pan 2 used
          await tween(c, 1300, (t) => { p2.b.setAttribute('r', 47 * Math.sqrt(1 - rest * t)); f2.setAttribute('x', B0[0] + 3 + W1); f2.setAttribute('width', (BW - 6 - W1) * t); });
          await c.fadeIn(left); await c.fadeIn(L3);
        } },
      { cap: `So it holds ${T('234\\div127.23\\approx1.8')} round pans: a little less than 2.`, run: (c) => c.pop(L4) }
    ];
  }
};

/* =====================================================================================
 * 6. Cut the big cube: 1 ft³ = 1728 in³ (and 27, 1 000 000)
 * ===================================================================================== */
const CC = {
  ft: { n: 12, big: 'ft', sm: 'in', grid: 1, row: 12, lay: 144, all: 1728, layT: '12\\times12=144', allT: '144\\times12=1728', eq: '1\\text{ ft}^3=12\\times12\\times12=1728\\text{ in}^3' },
  yd: { n: 3, big: 'yd', sm: 'ft', grid: 1, row: 3, lay: 9, all: 27, layT: '3\\times3=9', allT: '9\\times3=27', eq: '1\\text{ yd}^3=3\\times3\\times3=27\\text{ ft}^3' },
  m: { n: 100, big: 'm', sm: 'cm', grid: 10, row: 100, lay: 10000, all: 1000000, layT: '100\\times100=10\\,000', allT: '10\\,000\\times100=1\\,000\\,000', eq: '1\\text{ m}^3=1\\,000\\,000\\text{ cm}^3', note: 'grid lines every 10 cm' }
};
const cubeCut = {
  title: 'Cut the big cube into small cubes',
  height: 400,
  minW: 900,
  choices: [{ v: 'ft', label: 'ft³ → in³' }, { v: 'yd', label: 'yd³ → ft³' }, { v: 'm', label: 'm³ → cm³' }],
  ask: (k) => `How many cubic ${CC[k].sm === 'in' ? 'inches' : CC[k].sm === 'ft' ? 'feet' : 'centimetres'} are in <b>1 ${CC[k].big}³</b>? (1 ${CC[k].big} = ${nH(CC[k].n)} ${CC[k].sm})`,
  make(stage, k, ex) {
    const d = CC[k], n = d.n, sm = d.sm;
    const s = Math.min(400 / (n * (1 + KX)), 320 / (n * (1 + KY))), ox = 100, oy = 370;
    const P = proj(ox, oy, s);
    const svg = svgBox(stage, 520, 400);
    const ghost = svgEl('g', {}, svg); ghost.innerHTML = boxSVG(P, n, n, n, { col: 'none', stroke: '#9a8e78', sw: 2, dash: '7 6', hidden: '#b9ad97' });
    const solid = svgEl('g', {}, svg);
    const draw = (l, w, hh) => { solid.innerHTML = l ? boxSVG(P, l, w, hh, { col: 'amber', grid: d.grid, gsw: n > 20 ? 1 : 1.3, gop: n > 20 ? 0.6 : 0.7, sw: 2.4 }) : ''; };
    const [bx, by] = P(n / 2, 0, 0), [rx, ry] = P(n, 0, n / 2), [hx, hy] = P(0, n / 2, 0);
    labC(stage, `1 ${d.big} = ${nH(n)} ${sm}`, bx, by + 18, 'dim');
    lab(stage, `${nH(n)} ${sm}`, rx + 8, ry - 6, 'dim');
    lab(stage, `${nH(n)} ${sm}`, hx - 78, hy - 14, 'dim');
    if (d.note) lab(stage, `(${d.note})`, 300, 6, 'note');
    const cnt = hide(add(stage, box(cbox('u4l1-cnt', ''), 200, 42), 20, 6));
    const setCnt = (v) => { cnt.firstChild.innerHTML = `<b>${nH(v)}</b> ${sm}³`; };
    const PX = 570, PW = ex.W - PX - 20;
    const L1 = line(stage, `One row: <b>${nH(d.row)}</b> cubes`, PX, 40, PW);
    const L2 = line(stage, `One layer: ${T(d.layT)}`, PX, 100, PW);
    const L3 = line(stage, `${nH(n)} layers: ${T(d.allT)}`, PX, 160, PW);
    const res = hide(add(stage, box(cbox('u4l1-res', T(d.eq)), PW, 56), PX, 240));
    const st = hide(stamp(stage, `1 ${d.big}³ ≠ ${nH(n)} ${sm}³`, { ok: false, x: 300, y: by - 70, rotate: -6 }));
    const stepTo = (c, from, to, set) => tween(c, 1300, (t) => { const v = Math.max(1, Math.round(lerp(from, to, t))); set(v); });
    return [
      { cap: `1 ${d.big} = ${nH(n)} ${sm}, so the cube is ${nH(n)} ${sm} long, ${nH(n)} ${sm} wide and ${nH(n)} ${sm} high.`, run: (c) => c.fadeIn(cnt).then(() => setCnt(0)) },
      { cap: `One row of 1 ${sm} cubes along the front: <b>${nH(d.row)} cubes</b>. That is only ${nH(n)} ${sm}³, <b>not</b> 1 ${d.big}³!`,
        run: async (c) => { await stepTo(c, 1, n, (v) => { draw(v, 1, 1); setCnt(v); }); await c.fadeIn(L1); await stampIn(c, st); } },
      { cap: `${nH(n)} rows make the bottom layer: ${T(d.layT)} cubes.`,
        run: async (c) => { await c.anim(st, [{ opacity: 1 }, { opacity: 0 }], 250); await stepTo(c, 1, n, (v) => { draw(n, v, 1); setCnt(n * v); }); await c.fadeIn(L2); } },
      { cap: `${nH(n)} layers fill the cube: ${T(d.allT)} cubes.`,
        run: async (c) => { await stepTo(c, 1, n, (v) => { draw(n, n, v); setCnt(n * n * v); }); await c.fadeIn(L3); } },
      { cap: `So ${T(d.eq)}. The ${nH(n)} is used <b>three times</b>: length, width and height.`, run: (c) => c.pop(res) }
    ];
  }
};

/* =====================================================================================
 * 7. Multiply or divide? (Full notes, Example 7)
 * ===================================================================================== */
const UM = {
  a: { v: '3.5', from: 'ft', to: 'in', f: '1728', big: 'ft', op: '\\times', res: '6048', rel: '1\\text{ ft}^3=1728\\text{ in}^3' },
  b: { v: '5184', from: 'in', to: 'ft', f: '1728', big: 'ft', op: '\\div', res: '3', rel: '1\\text{ ft}^3=1728\\text{ in}^3' },
  c: { v: '4', from: 'yd', to: 'ft', f: '27', big: 'yd', op: '\\times', res: '108', rel: '1\\text{ yd}^3=27\\text{ ft}^3' },
  d: { v: '81', from: 'ft', to: 'yd', f: '27', big: 'yd', op: '\\div', res: '3', rel: '1\\text{ yd}^3=27\\text{ ft}^3' },
  e: { v: '0.25', from: 'm', to: 'cm', f: '1\\,000\\,000', big: 'm', op: '\\times', res: '250\\,000', rel: '1\\text{ m}^3=1\\,000\\,000\\text{ cm}^3' },
  f: { v: '45\\,000', from: 'cm', to: 'm', f: '1\\,000\\,000', big: 'm', op: '\\div', res: '0.045', rel: '1\\text{ m}^3=1\\,000\\,000\\text{ cm}^3' }
};
const unitMachine = {
  title: 'Big → small: multiply. Small → big: divide.',
  height: 360,
  minW: 900,
  choices: [{ sep: 'Example 7:' }, ...'abcdef'.split('').map((v) => ({ v, label: `(${v})` }))],
  ask: (k) => `Example 7(${k}): change ${T(UM[k].v)} ${UM[k].from}³ to ${UM[k].to}³.`,
  make(stage, k, ex) {
    const d = UM[k], W = ex.W, toBig = d.to === d.big, mul = d.op === '\\times';
    const svg = svgBox(stage, W, 360);
    const icon = (cx, cy, sz, col) => { const g = svgEl('g', {}, svg); const P = proj(cx - sz * 0.72, cy + sz * 0.62, sz); g.innerHTML = boxSVG(P, 1, 1, 1, { col }); return g; };
    const fromBig = d.from === d.big;
    const iA = hide(icon(150, 120, fromBig ? 120 : 34, 'amber')), iB = hide(icon(W - 150, 120, fromBig ? 34 : 120, 'teal'));
    const lA = hide(labC(stage, `1 ${d.from}³`, 150, 236, 'dim')), lB = hide(labC(stage, `1 ${d.to}³`, W - 150, 236, 'dim'));
    const rel = hide(add(stage, box(cbox('u4l1-key', T(d.rel)), 380, 50), (W - 380) / 2, 20));
    const mach = hide(add(stage, box(cbox('u4l1-mach ' + (mul ? 'mul' : 'div'), `${T(d.op + d.f)}`), 230, 70), (W - 230) / 2, 110));
    const why = hide(add(stage, box(cbox('u4l1-why', mul ? `${d.from}³ is the <b>big</b> unit: you get <b>more</b> ${d.to}³` : `${d.to}³ is the <b>big</b> unit: you get <b>fewer</b> of them`), 520, 46), (W - 520) / 2, 196));
    const card = hide(add(stage, box(cbox('u4l1-card', `${T(d.v)} ${d.from}³`), 200, 54), 50, 272));
    const res = hide(add(stage, box(cbox('u4l1-res', `${T(`${d.v}${d.op}${d.f}=${d.res}`)} ${d.to}³`), 440, 54), (W - 440) / 2, 290));
    void toBig;
    return [
      { cap: `Which unit is bigger? ${T(d.rel)}, so 1 ${d.big}³ is the <b>big</b> unit.`, run: async (c) => { await Promise.all([c.pop(iA), c.pop(iB)]); await Promise.all([c.fadeIn(lA), c.fadeIn(lB)]); await c.fadeIn(rel); } },
      { cap: mul ? `Big unit → small unit: you need <b>more</b> of the small ones. <b>Multiply</b> by ${T(d.f)}.` : `Small unit → big unit: you need <b>fewer</b> of the big ones. <b>Divide</b> by ${T(d.f)}.`,
        run: async (c) => { await c.pop(mach); await c.fadeIn(why); } },
      { cap: `${T(`${d.v}${d.op}${d.f}=${d.res}`)}. The answer is <b>${T(d.res)} ${d.to}³</b>.`,
        run: async (c) => { await c.fadeIn(card); await c.anim(card, [{ transform: 'none', opacity: 1 }, { transform: `translateX(${(W - 200) / 2 - 50}px) translateY(-150px) scale(.6)`, opacity: 0 }], 900); await c.pop(res); } }
    ];
  }
};

/* =====================================================================================
 * 8. Example 8 two ways (Full notes)
 * ===================================================================================== */
const twoWays = {
  title: 'The toy chest, two ways',
  height: 400,
  minW: 900,
  ask: 'Example 8: a toy chest is <b>30 in</b> long, <b>18 in</b> wide and <b>16 in</b> high. Find its volume in cubic feet two ways.',
  make(stage, k, ex) {
    const W = ex.W, svg = svgBox(stage, W, 400);
    const P = proj(W / 2 - 130, 150, 6.6);
    const g = svgEl('g', {}, svg); g.innerHTML = boxSVG(P, 30, 18, 16, { col: 'wood' });
    const [bx, by] = P(15, 0, 0), [rx, ry] = P(30, 0, 9), [hx, hy] = P(0, 8, 0);
    const lL = labC(stage, '30 in', bx, by + 18, 'dim'), lW = lab(stage, '18 in', rx + 8, ry - 6, 'dim'), lH = lab(stage, '16 in', hx - 66, hy - 14, 'dim');
    const CW = (W - 80) / 2, A = 20, B = 60 + CW;
    const h1 = lab(stage, '<b>Way 1:</b> volume first', A, 202, 'way'), h2 = lab(stage, '<b>Way 2:</b> feet first', B, 202, 'way');
    void h1; void h2;
    const a1 = line(stage, `${T('30\\times18\\times16=8640')} in³`, A, 240, CW);
    const a2 = line(stage, `${T('8640\\div1728=5')} ft³`, A, 294, CW, 'big');
    const b1 = line(stage, `${T('30\\div12=2.5,\\;18\\div12=1.5,\\;16\\div12=1\\tfrac13')}`, B, 240, CW);
    const b2 = line(stage, `${T('2.5\\times1.5\\times1\\tfrac13=5')} ft³`, B, 294, CW, 'big');
    const st = hide(stamp(stage, 'Same answer ✓', { ok: true, x: W / 2, y: 370, rotate: -4 }));
    return [
      { cap: `Way 1: find the volume in cubic inches: ${T('30\\times18\\times16=8640')} in³.`, run: (c) => c.fadeIn(a1) },
      { cap: `Then change to cubic feet. 1 ft³ = 1728 in³, small → big, so divide: ${T('8640\\div1728=5')} ft³.`, run: (c) => c.pop(a2) },
      { cap: `Way 2: change each length to feet first (÷ 12): 2.5 ft, 1.5 ft and ${T('1\\tfrac13')} ft.`,
        run: async (c) => { await Promise.all([lL, lW, lH].map((e) => c.anim(e, [{ opacity: 1 }, { opacity: 0 }], 250))); lL.innerHTML = '2.5 ft'; lW.innerHTML = '1.5 ft'; lH.innerHTML = T('1\\tfrac13') + ' ft'; await Promise.all([lL, lW, lH].map((e) => c.fadeIn(e))); await c.fadeIn(b1); } },
      { cap: `Then multiply: ${T('2.5\\times1.5\\times1\\tfrac13=5')} ft³. (Calculator: ${T('2.5\\times1.5\\times16\\div12')}.)`, run: (c) => c.pop(b2) },
      { cap: 'Both ways give <b>5 ft³</b> ✓ Use the way that is easier for the numbers you have.', run: (c) => stampIn(c, st) }
    ];
  }
};

/* =====================================================================================
 * 9. Ordering concrete and gravel (Examples 9 and 10)
 * ===================================================================================== */
const PO = {
  p: { ask: 'Example 9: a concrete patio <b>12 ft</b> by <b>10 ft</b>, <b>4 in</b> thick. Concrete is sold in half cubic yards at <b>$215.00</b> per yd³.',
    L: 12, Wd: 10, T: '4 in', u: 'ft', col: 'conc', s1: `4 in ${'='} ${'4\\div12=\\tfrac13'}`, tconv: '4\\div12=\\tfrac13', tnew: '⅓ ft',
    V: '12\\times10\\times\\tfrac13=40', Vu: 'ft', conv: '40\\div27=1.48\\ldots', cv: 40 / 27, convWhy: 'ft³ ÷ 27 = yd³',
    nl: { min: 0, max: 3, step: 0.5 }, order: 1.5, below: 1, orderTx: '1.5', sold: 'half cubic yards', cost: '1.5\\times\\$215.00=\\$322.50', costW: '$322.50' },
  d: { ask: 'Example 10: a driveway <b>15 m</b> by <b>3.5 m</b> needs gravel <b>10 cm</b> deep. Sold in whole cubic yards at <b>$48.00</b> per yd³. Use 1 m³ ≈ 1.31 yd³.',
    L: 15, Wd: 3.5, T: '10 cm', u: 'm', col: 'grav', tconv: '10\\text{ cm}=0.1', tnew: '0.1 m',
    V: '15\\times3.5\\times0.1=5.25', Vu: 'm', conv: '5.25\\times1.31=6.8775', cv: 6.8775, convWhy: '1 m³ ≈ 1.31 yd³',
    nl: { min: 4, max: 9, step: 1 }, order: 7, below: 6, orderTx: '7', sold: 'whole cubic yards', cost: '7\\times\\$48.00=\\$336.00', costW: '$336.00' }
};
const pour = {
  title: 'Ordering material: round up!',
  height: 420,
  minW: 920,
  choices: [{ sep: 'Check:' }, { v: 'p', label: 'Example 9: patio' }, { v: 'd', label: 'Example 10: gravel' }],
  ask: (k) => PO[k].ask,
  make(stage, k, ex) {
    const d = PO[k], u = d.u;
    const svg = svgBox(stage, 520, 260);
    // the slab: L across, W back, thickness drawn thick enough to see
    const tv = 0.9, s = Math.min(380 / (d.L + d.Wd * KX * 1.3), 150 / (d.Wd * KY * 1.3 + tv));
    const P = proj(40 + (440 - (d.L + d.Wd * KX * 1.3) * s) / 2, 230, s, KY * 1.3, KX * 1.3);
    const form = svgEl('g', {}, svg); form.innerHTML = boxSVG(P, d.L, d.Wd, tv, { col: 'none', stroke: '#8a5a14', sw: 3, hidden: '#b9ad97' });
    const fill = svgEl('g', {}, svg);
    // the truck (or the gravel truck): a simple mixer at the top left
    const tr = svgEl('g', {}, svg);
    tr.innerHTML = k === 'p'
      ? '<rect x="10" y="40" width="44" height="36" rx="6" fill="#e8a01e" stroke="#4a3010" stroke-width="2.5"/><rect x="18" y="46" width="22" height="14" rx="2" fill="#cfe9ff"/><ellipse cx="96" cy="52" rx="42" ry="24" fill="#d9d6cf" stroke="#4a3010" stroke-width="2.5"/><path d="M66 40 L120 62 M74 32 L126 54" stroke="#9a6a24" stroke-width="5"/><rect x="54" y="72" width="88" height="8" fill="#4a4436"/><circle cx="34" cy="84" r="9" fill="#1c2230"/><circle cx="118" cy="84" r="9" fill="#1c2230"/><path d="M138 60 L168 92" stroke="#4a4436" stroke-width="7" stroke-linecap="round"/>'
      : '<rect x="10" y="40" width="44" height="36" rx="6" fill="#1f5bd6" stroke="#1c2230" stroke-width="2.5"/><rect x="18" y="46" width="22" height="14" rx="2" fill="#cfe9ff"/><path d="M58 30 L148 30 L140 76 L58 76 Z" fill="#c8a77a" stroke="#4a3010" stroke-width="2.5"/><rect x="54" y="72" width="88" height="8" fill="#4a4436"/><circle cx="34" cy="84" r="9" fill="#1c2230"/><circle cx="118" cy="84" r="9" fill="#1c2230"/>';
    const stream = hide(svgEl('path', { d: 'M168 92 Q176 120 186 160', stroke: k === 'p' ? '#9c988f' : '#a8875a', 'stroke-width': 10, fill: 'none', 'stroke-linecap': 'round' }, svg));
    const [bx, by] = P(d.L / 2, 0, 0), [rx, ry] = P(d.L, 0, d.Wd / 2), [tx, ty] = P(0, tv / 2, 0);
    labC(stage, `${d.L} ${u}`, bx, by + 18, 'dim'); lab(stage, `${d.Wd} ${u}`, rx + 8, ry - 10, 'dim');
    const lt = lab(stage, d.T, Math.max(4, tx - 66), ty - 14, 'dim red');
    const N = new NumberLine(stage, { x: 20, y: 290, width: 480, height: 100, min: d.nl.min, max: d.nl.max, step: d.nl.step, numbers: true });
    const nlT = lab(stage, `Sold in ${d.sold} (yd³):`, 24, 262, 'note');
    void nlT;
    const PX = 540, PW = ex.W - PX - 16;
    const L1 = line(stage, `${T(d.tconv)} ${u}`, PX, 14, PW);
    const L2 = line(stage, `${T(`V=${d.V}`)} ${d.Vu}³`, PX, 70, PW);
    const L3 = line(stage, `${T(d.conv)} yd³`, PX, 126, PW);
    const L4 = line(stage, `Round <b>up</b>: order <b>${d.orderTx} yd³</b>`, PX, 182, PW, 'ok');
    const L5 = line(stage, `${T(d.cost)}`, PX, 250, PW, 'big');
    let pt = null;
    return [
      { cap: `<b>Step 1:</b> all lengths in ${u === 'ft' ? 'feet' : 'metres'}. The thickness: ${T(d.tconv)} ${u}.`,
        run: async (c) => { await c.anim(lt, [{ opacity: 1 }, { opacity: 0 }], 220); lt.innerHTML = d.tnew; await c.fadeIn(lt); await c.fadeIn(L1); } },
      { cap: `<b>Step 2:</b> the volume: ${T(`V=${d.V}`)} ${d.Vu}³.`,
        run: async (c) => {
          await c.fadeIn(stream);
          await tween(c, 1500, (t) => { fill.innerHTML = boxSVG(P, d.L, Math.max(0.001, d.Wd * t), tv, { col: d.col, sw: 2 }); });
          fill.innerHTML = boxSVG(P, d.L, d.Wd, tv, { col: d.col, sw: 2.5 });
          await c.anim(stream, [{ opacity: 1 }, { opacity: 0 }], 250); await c.fadeIn(L2);
        } },
      { cap: `<b>Step 3:</b> change to cubic yards (${d.convWhy}): ${T(d.conv)} yd³.`,
        run: async (c) => { pt = N.point(d.cv, { color: 'red' }); await c.pop(pt); await c.fadeIn(L3); } },
      { cap: `<b>Step 4:</b> it is sold in ${d.sold}. ${d.below} yd³ is too little, so <b>round up</b> to <b>${d.orderTx} yd³</b>.`,
        run: async (c) => { await N.hop(c, d.cv, d.order, { label: 'round up', color: 'green' }); const p2 = N.point(d.order, { color: 'green' }); await c.pop(p2); await c.fadeIn(L4); } },
      { cap: `<b>Step 5:</b> the cost: ${T(d.cost)}.`, run: (c) => c.pop(L5) }
    ];
  }
};

/* =====================================================================================
 * 10. Working backwards: spread the concrete into a slab (Example 11)
 * ===================================================================================== */
const backwards = {
  title: 'Working backwards: how thick?',
  height: 360,
  minW: 900,
  ask: 'Example 11: Mia has <b>0.9 m³</b> of concrete. She pours it all into a slab <b>3 m</b> by <b>2.5 m</b>. How thick is the slab, in centimetres?',
  make(stage, k, ex) {
    const svg = svgBox(stage, 560, 360), s = 105, SY = 2.2; // thickness drawn 2.2 times bigger so it can be seen
    const P = proj(70, 296, s);
    const form = hide(svgEl('g', {}, svg)); form.innerHTML = boxSVG(P, 3, 2.5, 0.12, { col: 'none', stroke: '#8a5a14', sw: 2.5, dash: '8 6', sy: SY });
    const blk = svgEl('g', {}, svg);
    const c0 = Math.cbrt(0.9);
    const drawB = (a, b) => { blk.innerHTML = boxSVG(P, a, b, 0.9 / (a * b), { col: 'conc', sy: Math.min(SY, lerp(1, SY, (a - c0) / (3 - c0))) }); };
    drawB(c0, c0);
    const lv = labC(stage, '0.9 m³', ...P(c0 / 2, 0.45, 0), 'area');
    const [bx, by] = P(1.5, 0, 0), [rx, ry] = P(3, 0, 1.25);
    const l3 = hide(labC(stage, '3 m', bx, by + 18, 'dim')), l25 = hide(lab(stage, '2.5 m', rx + 8, ry - 6, 'dim'));
    const lt = hide(lab(stage, '0.12 m = 12 cm', 300, 316, 'dim red'));
    lab(stage, '(thickness not to scale)', 20, 336, 'note');
    const PX = 590, PW = ex.W - PX - 20;
    const L1 = line(stage, `Area of base ${T('=3\\times2.5=7.5')} m²`, PX, 30, PW);
    const L2 = line(stage, `${T('h=0.9\\div7.5=0.12')} m`, PX, 94, PW);
    const L3 = line(stage, `${T('0.12\\times100=12')} cm`, PX, 158, PW, 'big');
    const L4 = line(stage, `Check: ${T('3\\times2.5\\times0.12=0.9')} m³ ✓`, PX, 230, PW, 'ok');
    const st = hide(stamp(stage, '12 cm thick ✓', { ok: true, x: PX + PW / 2, y: 312, rotate: -5 }));
    return [
      { cap: 'The form for the slab is <b>3 m</b> by <b>2.5 m</b>. Area of the base: ' + T('3\\times2.5=7.5') + ' m².', run: async (c) => { await c.fadeIn(form); await c.fadeIn(l3); await c.fadeIn(l25); await c.fadeIn(L1); } },
      { cap: `Spread the 0.9 m³ over the whole base. It gets <b>thinner</b>. Undo the × with ÷: ${T('h=V\\div(\\text{area of base})=0.9\\div7.5=0.12')} m.`,
        run: async (c) => { await c.anim(lv, [{ opacity: 1 }, { opacity: 0 }], 200); await tween(c, 1600, (t) => drawB(lerp(c0, 3, t), lerp(c0, 2.5, t))); await c.fadeIn(L2); } },
      { cap: `The question asks for centimetres: 1 m = 100 cm, so ${T('0.12\\times100=12')} cm.`, run: async (c) => { await c.fadeIn(lt); await c.pop(L3); } },
      { cap: `Check: ${T('3\\times2.5\\times0.12=0.9')} m³ ✓ The slab will be <b>12 cm</b> thick.`, run: async (c) => { await c.fadeIn(L4); await stampIn(c, st); } }
    ];
  }
};

mountExplainers({ fillBox, prismSlide, halfBox, cylinder, panVerdict, cubeCut, unitMachine, twoWays, pour, backwards });

/* =====================================================================================
 * Static figures on the cards
 * ===================================================================================== */
function figSVG(id, W, H) { const host = document.getElementById(id); if (!host) return null; const s = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, class: 'u4l1-fsvg' }); host.appendChild(s); return s; }
function txt(svg, x, y, s, o = {}) { const t = svgEl('text', Object.assign({ x, y, 'font-size': 18, 'font-weight': 700, fill: '#1c2230', 'text-anchor': 'middle' }, o), svg); t.textContent = s; return t; }
{
  // Example 1: the 4 × 3 × 2 box of cubes
  const s1 = figSVG('u4l1-fig-ex1', 320, 220);
  if (s1) {
    const P = proj(40, 180, 46);
    for (let z = 2; z >= 0; z--) for (let y = 0; y < 2; y++) for (let x = 0; x < 4; x++) cubeG(s1, P, x, y, z, 'amber');
    txt(s1, P(2, 0, 0)[0], 204, '4 cm'); txt(s1, P(4, 0, 1.5)[0] + 26, P(4, 0, 1.5)[1] + 4, '3 cm'); txt(s1, 18, P(0, 1, 0)[1] + 6, '2 cm');
  }
  // Example 3: the chocolate box
  const s3 = figSVG('u4l1-fig-ex3', 340, 230);
  if (s3) {
    const P = proj(20, 190, 18);
    const g = svgEl('g', {}, s3); g.innerHTML = prismSVG(P, [[0, 0], [6, 0], [3, 4]], 15, { col: 'amber' });
    const [ax, ay] = P(3, 4, 0), [fx, fy] = P(3, 0, 0);
    svgEl('line', { x1: ax, y1: ay, x2: fx, y2: fy, stroke: '#1c2230', 'stroke-width': 1.8, 'stroke-dasharray': '4 4' }, s3);
    svgEl('rect', { x: fx, y: fy - 9, width: 9, height: 9, fill: 'none', stroke: '#1c2230', 'stroke-width': 1.5 }, s3);
    txt(s3, fx, fy + 22, '6 cm'); txt(s3, fx + 30, (ay + fy) / 2 + 12, '4 cm', { 'font-size': 16 });
    const [lx, ly] = P(6, 0, 7.5); txt(s3, lx + 34, ly + 14, '15 cm');
  }
  // Example 4: the ramp (height not to scale)
  const s4 = figSVG('u4l1-fig-ex4', 380, 170);
  if (s4) {
    const P = proj(20, 120, 80);
    const g = svgEl('g', {}, s4); g.innerHTML = prismSVG(P, [[0, 0], [3.6, 0], [3.6, 0.9]], 1.2, { col: 'conc' });
    txt(s4, P(1.8, 0, 0)[0], 144, '3.6 m'); const [hx, hy] = P(3.6, 0.45, 1.2); txt(s4, hx + 30, hy + 6, '0.3 m');
    const [wx, wy] = P(3.6, 0, 0.6); txt(s4, wx + 52, wy + 20, '1.2 m wide');
    txt(s4, 70, 166, '(height not to scale)', { 'font-size': 13, 'font-weight': 600, fill: '#6b6457' });
  }
  // the cylinder key idea
  const sc = figSVG('u4l1-fig-cyl', 190, 170);
  if (sc) {
    const g = svgEl('g', {}, sc); g.innerHTML = cylSVG(80, 140, 56, 104, { body: '#f1d9a8', lid: '#f8e8c8' });
    svgEl('path', { d: 'M136 140 A56 16.8 0 0 0 24 140', fill: 'none', stroke: '#8a8170', 'stroke-width': 1.6, 'stroke-dasharray': '5 5' }, sc);
    svgEl('line', { x1: 80, y1: 36, x2: 136, y2: 36, stroke: '#c93a33', 'stroke-width': 3 }, sc); svgEl('circle', { cx: 80, cy: 36, r: 3.5, fill: '#1c2230' }, sc);
    txt(sc, 108, 28, 'r', { 'font-style': 'italic', fill: '#c93a33', 'font-size': 22 });
    svgEl('line', { x1: 152, y1: 140, x2: 152, y2: 36, stroke: '#1c2230', 'stroke-width': 2 }, sc);
    svgEl('path', { d: 'M146 46 L152 36 L158 46 M146 130 L152 140 L158 130', fill: 'none', stroke: '#1c2230', 'stroke-width': 2 }, sc);
    txt(sc, 172, 96, 'h', { 'font-style': 'italic', 'font-size': 22 });
  }
  // the referents
  const ref = (id, col, sz, extra, cx = 75) => { const s = figSVG(id, 150, 110); if (!s) return; const P = proj(cx - sz * 0.72, 55 + sz * 0.65, sz); const g = svgEl('g', {}, s); g.innerHTML = boxSVG(P, 1, 1, 1, { col }); if (extra) extra(s); };
  ref('u4l1-ref-cm', 'gray', 30, (s) => { s.querySelectorAll('polygon').forEach((p, i) => p.setAttribute('fill', ['#ffffff', '#f6f6f6', '#e6e3dd'][i])); });
  ref('u4l1-ref-in', 'blue', 54, (s) => { s.querySelectorAll('polygon').forEach((p) => p.setAttribute('fill-opacity', '.75')); });
  ref('u4l1-ref-m', 'amber', 50, (s) => { // a tiny person beside the big cube
    s.innerHTML += '<g stroke="#1c2230" stroke-width="2.5" stroke-linecap="round" fill="none"><circle cx="26" cy="12" r="7" fill="#f4d7b5"/><path d="M26 19 V58 M26 58 L18 88 M26 58 L34 88 M14 32 L38 32"/></g>';
  }, 98);
}

/* ============ Stand Up Break! — volumes of boxes, prisms and cylinders, and cubic units, at the whiteboards ============ */
{
  const BOXES = ['tool box', 'fish tank', 'cooler', 'gift box', 'drawer', 'storage bin', 'sandbox'];
  const CANS = ['paint can', 'water bottle', 'coffee tin', 'rain barrel', 'oil drum', 'popcorn tin'];
  const r1 = (v) => rnd(v, 1).toFixed(1), r2 = (v) => rnd(v, 2).toFixed(2);
  standup('u4l1', {
    intro: 'Sketch the shape, label it, and show every step. Estimate first when there is a π.',
    levels: {
      BEG: (r) => { // a box
        const what = r.pick(BOXES), u = r.pick(['cm', 'in']), l = r.int(12, 40), w = r.int(6, 25), hh = r.int(5, 30) + r.pick([0, 0, 0.5]);
        const V = l * w * hh;
        return { text: `A <b>${what}</b> is <b>${l} ${u}</b> long, <b>${w} ${u}</b> wide and <b>${hh} ${u}</b> high. Find its volume.`, q: '',
          a: [`V=l\\times w\\times h`, `V=${l}\\times${w}\\times${hh}`, `V=${nT(rnd(V, 2))}\\text{ ${u}}^3`] };
      },
      PRG: (r) => r.pick([
        () => { // a cylinder from its diameter
          const what = r.pick(CANS), u = 'cm', d = r.int(6, 40), hh = r.int(8, 60), rr = d / 2, V = Math.PI * rr * rr * hh;
          return { text: `A <b>${what}</b> is a cylinder <b>${d} ${u}</b> across and <b>${hh} ${u}</b> tall. Find its volume to the nearest tenth.`, q: '',
            a: [`r=${d}\\div2=${rr}\\text{ ${u}}`, `V=\\pi\\times${rr}^2\\times${hh}`, `V\\approx${nT(r1(V))}\\text{ ${u}}^3`] };
        },
        () => { // a triangular prism
          const b = r.int(4, 14), th = r.int(3, 10), L = r.int(10, 40), A = b * th / 2, V = A * L;
          return { text: `A wooden wedge is a triangular prism. The triangle has a base of <b>${b} cm</b> and a height of <b>${th} cm</b>. The wedge is <b>${L} cm</b> long. Find its volume.`, q: '',
            a: [`\\text{Area of base}=\\tfrac12\\times${b}\\times${th}=${A}\\text{ cm}^2`, `V=${A}\\times${L}=${nT(V)}\\text{ cm}^3`] };
        }
      ])(),
      MAS: (r) => r.pick([
        () => { // a box in inches, answer in cubic feet
          const l = r.pick([24, 30, 36, 40, 48]), w = r.pick([12, 15, 18, 20, 24]), hh = r.pick([10, 12, 16, 18, 20]), V = l * w * hh;
          return { text: `A storage chest is <b>${l} in</b> long, <b>${w} in</b> wide and <b>${hh} in</b> high. Find its volume in <b>cubic feet</b>, to the nearest tenth.`, q: '',
            a: [`V=${l}\\times${w}\\times${hh}=${nT(V)}\\text{ in}^3`, `${nT(V)}\\div1728\\approx${r1(V / 1728)}\\text{ ft}^3`] };
        },
        () => { // cubic yards to cubic feet and back
          const yd = r.pick([2, 3, 4, 5, 6, 8]) + r.pick([0, 0.5]), ft = r.int(40, 300);
          return { text: `(a) Change <b>${yd} yd³</b> to ft³. &nbsp; (b) Change <b>${ft} ft³</b> to yd³, to the nearest hundredth.`, q: '',
            a: [`\\text{(a) }${yd}\\times27=${rnd(yd * 27, 2)}\\text{ ft}^3`, `\\text{(b) }${ft}\\div27\\approx${r2(ft / 27)}\\text{ yd}^3`] };
        }
      ])()
    }
  });
}
