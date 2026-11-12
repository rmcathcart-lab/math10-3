/* Math 10-3 · Unit 3 · Lesson 9 — Composite and Irregular Shapes.
 * Explainers: the coffee-shop floor splitting into rectangles (Example 1, plus a T-shaped hallway), the overlap trap
 * (Full notes), the shed wall as a rectangle + half a rectangle, with boxes of siding rounded up (Example 2), the arched
 * window as a rectangle + half a circle (Example 3), whole minus cut-out with the pieces lifting out (Examples 4 and 5),
 * three ways to one answer (Full notes), counting full and part squares on the pond and slough grids (Examples 6 and 7),
 * why two part squares make about one (Full notes: the part squares sorted and paired), and the skating-oval verdict
 * with an area meter (Example 8). Static figures for every example are drawn at the end, then the Stand Up Break. */
import { h, add, box, tex, svgEl, tween, stamp, stampIn, mountExplainers } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const rnd = (v, d = 2) => Math.round((v + (v >= 0 ? 1e-9 : -1e-9)) * 10 ** d) / 10 ** d;
const lerp = (a, b, t) => a + (b - a) * t;
/** thin space for numbers ≥ 1000: TeX (\,) and HTML (narrow no-break space) */
const nT = (v) => { const s = String(v); const [i, d] = s.split('.'); const ii = i.length > 3 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : i; return d ? ii + '.' + d : ii; };
const nH = (v) => nT(v).replace(/\\,/g, ' ');
const svgBox = (stage, W, H, x = 0, y = 0) => add(stage, svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u3l9-svg' }), x, y);
const pfx = (c) => c.split(/\s+/).filter(Boolean).map((t) => 'u3l9-' + t).join(' ');
const lab = (stage, html, x, y, cls = '') => add(stage, h('div', 'u3l9-lab ' + pfx(cls), html), x, y);
/** a label centred on (x, y): a 0 × 0 holder (animations scale and move about the point) with the label inside (holder.lab) */
const labC = (stage, html, x, y, cls = '') => { const w = add(stage, h('div', 'u3l9-cw'), x, y); w.lab = w.appendChild(h('div', 'u3l9-lab ' + pfx(cls), html)); return w; };
const line = (stage, html, x, y, w, cls = '') => hide(add(stage, box(h('div', 'u3l9-ln ' + pfx(cls), `<div>${html}</div>`), w, 46), x, y));
const BR = '#6e4a1c', INK = '#1c2230';
const FILL = { A: '#f6d38b', B: '#a6d8cc', C: '#f4aaa0', D: '#bccbf2', floor: '#efe6d6', sod: '#9fd08a', paint: '#cfe3c4', wall: '#e9dcc4', glass: '#dcecf8', wood: '#d9a86a', red: '#f4b6ae' };
const STR = { A: '#b07a12', B: '#2f8a76', C: '#c24a3c', D: '#3f63c4' };
/** a plan drawn in an svg: x right, y up; s px per unit; (ox, oy) is where (0, 0) goes */
const planP = (ox, oy, s) => (x, y) => [ox + x * s, oy - y * s];
const pts2 = (P, pts) => pts.map(([x, y]) => P(x, y).map((v) => v.toFixed(1)).join(',')).join(' ');
const rectPts = ([x0, y0, x1, y1]) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
function poly(svg, P, pts, attrs = {}) { return svgEl('polygon', Object.assign({ points: pts2(P, pts), fill: FILL.floor, stroke: BR, 'stroke-width': 3, 'stroke-linejoin': 'round' }, attrs), svg); }
function seg(svg, P, a, b, attrs = {}) { const [x1, y1] = P(...a), [x2, y2] = P(...b); return svgEl('line', Object.assign({ x1, y1, x2, y2, stroke: INK, 'stroke-width': 3, 'stroke-linecap': 'round' }, attrs), svg); }
/** an edge label placed outside a plan: pos n / s / e / w of the point (x, y) */
function edgeLab(stage, P, x, y, html, pos, cls = 'dim') {
  const [px, py] = P(x, y), d = 25;
  const off = { n: [0, -d], s: [0, d], e: [d + 14, 0], w: [-d - 14, 0] }[pos] || [0, 0];
  return labC(stage, html, px + off[0], py + off[1], cls);
}
const svgTxt = (svg, x, y, s, o = {}) => { const t = svgEl('text', Object.assign({ x, y, 'font-size': 18, 'font-weight': 700, fill: INK, 'text-anchor': 'middle' }, o), svg); t.textContent = s; return t; };

/* the two pond outlines from the booklet (grid units, y up) */
const POND = [8.48,3.65,8.48,3.74,8.46,3.82,8.44,3.91,8.42,4,8.38,4.08,8.35,4.17,8.3,4.25,8.25,4.33,8.2,4.41,8.14,4.48,8.08,4.56,8.01,4.63,7.94,4.7,7.86,4.76,7.78,4.83,7.7,4.89,7.61,4.95,7.53,5,7.44,5.05,7.34,5.1,7.25,5.15,7.16,5.2,7.06,5.24,6.97,5.28,6.87,5.32,6.77,5.36,6.67,5.4,6.57,5.43,6.47,5.46,6.37,5.5,6.27,5.53,6.16,5.56,6.06,5.58,5.95,5.61,5.85,5.64,5.74,5.66,5.63,5.68,5.52,5.71,5.41,5.73,5.29,5.75,5.17,5.76,5.05,5.78,4.93,5.79,4.81,5.8,4.68,5.81,4.56,5.81,4.43,5.81,4.3,5.81,4.17,5.8,4.04,5.79,3.91,5.77,3.78,5.75,3.65,5.72,3.53,5.69,3.4,5.65,3.28,5.61,3.16,5.56,3.05,5.51,2.94,5.45,2.83,5.39,2.73,5.33,2.64,5.25,2.55,5.18,2.47,5.1,2.4,5.02,2.34,4.93,2.29,4.84,2.24,4.75,2.2,4.66,2.17,4.56,2.15,4.47,2.13,4.37,2.13,4.28,2.13,4.19,2.13,4.09,2.15,4,2.17,3.91,2.19,3.82,2.22,3.73,2.26,3.65,2.3,3.56,2.34,3.48,2.38,3.4,2.43,3.32,2.47,3.25,2.52,3.18,2.57,3.1,2.62,3.03,2.68,2.96,2.73,2.89,2.78,2.82,2.83,2.76,2.88,2.69,2.94,2.62,2.99,2.56,3.05,2.49,3.11,2.42,3.17,2.36,3.23,2.29,3.29,2.23,3.36,2.16,3.43,2.1,3.5,2.03,3.57,1.97,3.65,1.91,3.74,1.85,3.83,1.79,3.92,1.74,4.01,1.68,4.12,1.63,4.22,1.59,4.33,1.54,4.44,1.5,4.55,1.47,4.67,1.44,4.79,1.41,4.91,1.39,5.04,1.37,5.16,1.36,5.29,1.36,5.42,1.35,5.54,1.36,5.67,1.36,5.8,1.38,5.92,1.39,6.05,1.41,6.17,1.44,6.29,1.47,6.41,1.5,6.52,1.54,6.64,1.58,6.75,1.62,6.85,1.66,6.96,1.71,7.06,1.76,7.16,1.82,7.26,1.87,7.36,1.93,7.45,1.99,7.54,2.05,7.62,2.12,7.7,2.18,7.78,2.25,7.86,2.32,7.93,2.39,8,2.47,8.07,2.54,8.13,2.62,8.19,2.7,8.24,2.78,8.29,2.86,8.33,2.95,8.37,3.03,8.4,3.12,8.43,3.2,8.45,3.29,8.47,3.38,8.48,3.47,8.48,3.56];
const SLOUGH = [9.07,3.62,9.14,3.69,9.22,3.77,9.31,3.85,9.39,3.94,9.47,4.03,9.54,4.12,9.61,4.22,9.67,4.32,9.71,4.43,9.74,4.53,9.76,4.64,9.76,4.75,9.73,4.85,9.69,4.96,9.63,5.06,9.55,5.15,9.45,5.24,9.34,5.32,9.2,5.39,9.06,5.45,8.9,5.51,8.72,5.55,8.55,5.59,8.36,5.62,8.17,5.64,7.98,5.65,7.79,5.65,7.6,5.65,7.42,5.64,7.24,5.64,7.06,5.62,6.9,5.61,6.73,5.6,6.58,5.59,6.43,5.58,6.28,5.58,6.14,5.58,6,5.58,5.86,5.59,5.72,5.6,5.57,5.62,5.43,5.64,5.28,5.66,5.12,5.68,4.96,5.7,4.8,5.73,4.62,5.75,4.45,5.76,4.27,5.78,4.09,5.78,3.9,5.78,3.72,5.77,3.54,5.76,3.36,5.73,3.19,5.7,3.03,5.65,2.88,5.6,2.74,5.53,2.62,5.46,2.51,5.38,2.42,5.29,2.34,5.2,2.29,5.1,2.25,5,2.22,4.9,2.21,4.8,2.22,4.69,2.23,4.59,2.26,4.49,2.29,4.4,2.33,4.3,2.37,4.21,2.42,4.13,2.46,4.05,2.49,3.97,2.52,3.89,2.55,3.82,2.56,3.75,2.57,3.68,2.57,3.62,2.56,3.55,2.54,3.48,2.51,3.41,2.48,3.33,2.44,3.26,2.39,3.18,2.35,3.09,2.31,3.01,2.27,2.92,2.24,2.82,2.21,2.73,2.2,2.63,2.19,2.53,2.2,2.43,2.22,2.33,2.26,2.23,2.31,2.14,2.37,2.05,2.46,1.96,2.55,1.88,2.66,1.8,2.78,1.73,2.92,1.66,3.06,1.6,3.21,1.55,3.37,1.51,3.53,1.47,3.7,1.44,3.87,1.41,4.04,1.39,4.21,1.38,4.39,1.36,4.56,1.35,4.73,1.35,4.89,1.34,5.06,1.34,5.23,1.33,5.39,1.33,5.55,1.33,5.72,1.33,5.88,1.33,6.04,1.33,6.21,1.33,6.37,1.33,6.54,1.34,6.71,1.35,6.87,1.37,7.03,1.39,7.2,1.41,7.36,1.44,7.51,1.47,7.66,1.52,7.81,1.56,7.94,1.62,8.07,1.68,8.19,1.75,8.29,1.82,8.39,1.89,8.47,1.98,8.54,2.06,8.6,2.15,8.65,2.24,8.68,2.33,8.71,2.42,8.73,2.51,8.74,2.6,8.74,2.68,8.74,2.77,8.74,2.85,8.74,2.93,8.74,3,8.75,3.07,8.76,3.14,8.78,3.21,8.81,3.28,8.84,3.34,8.89,3.41,8.94,3.48,9,3.55];
const ap = (c, el, ms = 380) => c.anim(el, [{ opacity: 0 }, { opacity: 1 }], ms);
const toPts = (flat) => { const o = []; for (let i = 0; i < flat.length; i += 2) o.push([flat[i], flat[i + 1]]); return o; };
const POND_P = toPts(POND), SLOUGH_P = toPts(SLOUGH);
function inPoly([x, y], P) { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const [x1, y1] = P[i], [x2, y2] = P[j]; if ((y1 > y) !== (y2 > y) && x < (x2 - x1) * (y - y1) / (y2 - y1) + x1) c = !c; } return c; }
/** fraction of each grid square inside the outline → { full: [[i, j]…], part: [[i, j, f]…] } */
function classify(P, W, H, n = 20) {
  const full = [], part = [];
  for (let j = H - 1; j >= 0; j--) for (let i = 0; i < W; i++) {
    let k = 0; for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) if (inPoly([i + (a + 0.5) / n, j + (b + 0.5) / n], P)) k++;
    const f = k / n / n; if (f > 0.999) full.push([i, j]); else if (f > 0.0005) part.push([i, j, f]);
  }
  return { full, part };
}
const CLS = {}; const cls = (k) => CLS[k] || (CLS[k] = k === 'pond' ? classify(POND_P, 10, 8) : classify(SLOUGH_P, 12, 8));
const polyArea = (P) => Math.abs(P.reduce((s, [x, y], i) => { const [x2, y2] = P[(i + 1) % P.length]; return s + x * y2 - x2 * y; }, 0)) / 2;

/* =====================================================================================
 * 1. Split and add: the floor plan splits into rectangles
 * ===================================================================================== */
const CAFE = [[0, 0], [9, 0], [9, 4], [5, 4], [5, 7], [0, 7]];
const CAFE_LABS = [{ t: '9 m', at: [4.5, 0], pos: 's' }, { t: '7 m', at: [0, 3.5], pos: 'w' }, { t: '5 m', at: [2.5, 7], pos: 'n' }, { t: '4 m', at: [9, 2], pos: 'e' }];
const CAFE_MISS = [
  { n: 'a', at: [7, 4], pos: 'n', whole: [[0, 0], [9, 0]], known: [[0, 7], [5, 7]], unk: [[5, 4], [9, 4]], eq: 'a=9-5=4', val: '4 m',
    cap: `Find <b>a</b>: look across. The top is 5 m <b>plus</b> ${T('a')}, and it is as long as the bottom, 9 m. So ${T('a=9-5=4')} m.` },
  { n: 'b', at: [5, 5.5], pos: 'e', whole: [[0, 0], [0, 7]], known: [[9, 0], [9, 4]], unk: [[5, 4], [5, 7]], eq: 'b=7-4=3', val: '3 m',
    cap: `Find <b>b</b>: the left side is 7 m. On the right, 4 m <b>plus</b> ${T('b')} make the same height. So ${T('b=7-4=3')} m.` }
];
const SPLITS = {
  v: { ask: 'Example 1: the coffee shop floor (all corners square). Find <b>a</b> and <b>b</b>, then split it with a <b>vertical</b> line and find the area.',
    pts: CAFE, W: 9, H: 7, u: 'm', labs: CAFE_LABS, miss: CAFE_MISS, split: [[5, 0], [5, 4]], dir: 'x',
    parts: [{ n: 'A', r: [0, 0, 5, 7], dims: '5\\times7', a: 35, col: 'A', dx: -16 }, { n: 'B', r: [5, 0, 9, 4], dims: '4\\times4', a: 16, col: 'B', dx: 16, note: ' (B is a by 4 m)' }] },
  hz: { ask: 'Example 1: the coffee shop floor (all corners square). Find <b>a</b> and <b>b</b>, then split it with a <b>horizontal</b> line and find the area.',
    pts: CAFE, W: 9, H: 7, u: 'm', labs: CAFE_LABS, miss: CAFE_MISS, split: [[0, 4], [5, 4]], dir: 'y',
    parts: [{ n: 'C', r: [0, 0, 9, 4], dims: '9\\times4', a: 36, col: 'C', dy: -14 }, { n: 'D', r: [0, 4, 5, 7], dims: '5\\times3', a: 15, col: 'D', dy: 14, note: ' (D is 5 m by b)' }] },
  t: { ask: 'A T-shaped hallway. All the corners are square. Find the missing side <b>c</b>, then split and add.',
    pts: [[3, 0], [7, 0], [7, 5], [10, 5], [10, 8], [0, 8], [0, 5], [3, 5]], W: 11.4, H: 8, u: 'm',
    labs: [{ t: '4 m', at: [5, 0], pos: 's' }, { t: '10 m', at: [5, 8], pos: 'n' }, { t: '3 m', at: [0, 6.5], pos: 'w' }, { t: '8 m', at: [11.2, 4], pos: 'e' }],
    dim: [[11.2, 0], [11.2, 8]],
    miss: [{ n: 'c', at: [7, 2.5], pos: 'e', whole: [[11.2, 0], [11.2, 8]], known: [[10, 5], [10, 8]], unk: [[7, 0], [7, 5]], eq: 'c=8-3=5', val: '5 m',
      cap: `Find <b>c</b>: the whole height is 8 m. The top bar is 3 m of it, so the stem is ${T('c=8-3=5')} m tall.` }],
    split: [[3, 5], [7, 5]], dir: 'y',
    parts: [{ n: 'A', r: [0, 5, 10, 8], dims: '10\\times3', a: 30, col: 'A', dy: -14 }, { n: 'B', r: [3, 0, 7, 5], dims: '4\\times5', a: 20, col: 'B', dy: 14 }] }
};
const splitAdd = {
  title: 'Split and add: a floor plan in rectangles',
  height: 400, minW: 900,
  choices: [{ sep: 'Example 1 check:' }, { v: 'v', label: 'Vertical split' }, { v: 'hz', label: 'Horizontal split' }, { sep: 'Another floor:' }, { v: 't', label: 'T-shaped hallway' }],
  ask: (k) => SPLITS[k].ask,
  make(stage, k, ex) {
    const d = SPLITS[k], u = d.u;
    const s = Math.min(400 / d.W, 300 / d.H), ox = 60 + (420 - d.W * s) / 2, oy = 360 - (300 - d.H * s) / 2;
    const P = planP(ox, oy, s);
    const svg = svgBox(stage, 540, 400);
    const base = poly(svg, P, d.pts);
    const groups = d.parts.map((p) => { const g = svgEl('g', {}, svg); poly(g, P, rectPts(p.r), { fill: FILL[p.col], stroke: STR[p.col], 'stroke-width': 3 }); hide(g); return g; });
    const outline = poly(svg, P, d.pts, { fill: 'none' });
    if (d.dim) { seg(svg, P, d.dim[0], d.dim[1], { stroke: '#6b6457', 'stroke-width': 2 }); [d.dim[0], d.dim[1]].forEach((q) => { const [x, y] = P(...q); svgEl('line', { x1: x - 8, y1: y, x2: x + 8, y2: y, stroke: '#6b6457', 'stroke-width': 2 }, svg); }); }
    d.labs.forEach((l) => edgeLab(stage, P, l.at[0], l.at[1], l.t, l.pos));
    const mlabs = d.miss.map((m) => edgeLab(stage, P, m.at[0], m.at[1], `<i>${m.n}</i>`, m.pos, 'dim miss'));
    const hl = d.miss.map((m) => { const g = hide(svgEl('g', {}, svg)); seg(g, P, ...m.whole, { stroke: '#1f5bd6', 'stroke-width': 7 }); seg(g, P, ...m.known, { stroke: '#e8a01e', 'stroke-width': 7 }); seg(g, P, ...m.unk, { stroke: '#c93a33', 'stroke-width': 7 }); return g; });
    const sp = hide(seg(svg, P, d.split[0], d.split[1], { stroke: INK, 'stroke-width': 3.5, 'stroke-dasharray': '10 7' }));
    const plabs = d.parts.map((p) => { const [cx, cy] = P((p.r[0] + p.r[2]) / 2, (p.r[1] + p.r[3]) / 2); return hide(labC(stage, `<b>${p.n}</b><br>${p.a} ${u}²`, cx, cy, 'area')); });
    const PX = 560, PW = ex.W - PX - 16;
    let y = 14; const L = () => { const r = y; y += 56; return r; };
    const ml = d.miss.map((m) => line(stage, T(`${m.eq}\\text{ ${u}}`), PX, L(), PW));
    const pl = d.parts.map((p) => line(stage, `${p.n}: ${T(`${p.dims}=${p.a}\\text{ ${u}}^2`)}`, PX, L(), PW));
    const tot = d.parts.reduce((a, p) => a + p.a, 0);
    const lt = line(stage, `Total: ${T(`${d.parts.map((p) => p.a).join('+')}=${tot}\\text{ ${u}}^2`)}`, PX, L(), PW, 'big');
    const move = (c, i, back) => { const p = d.parts[i]; const tr = back ? 'translate(0px,0px)' : `translate(${p.dx || 0}px,${p.dy || 0}px)`; return Promise.all([c.anim(groups[i], [{ transform: tr }], 500), c.anim(plabs[i], [{ translate: back ? '0 0' : `${p.dx || 0}px ${p.dy || 0}px` }], 500)]); };
    const steps = d.miss.map((m, i) => ({ cap: m.cap, run: async (c) => { await c.fadeIn(hl[i]); await c.fadeIn(ml[i]); await c.anim(mlabs[i], [{ opacity: 0 }], 200); mlabs[i].lab.innerHTML = m.val; mlabs[i].lab.classList.add('u3l9-found'); await c.pop(mlabs[i]); await c.anim(hl[i], [{ opacity: 0.0 }], 300); } }));
    steps.push({ cap: `Draw a <b>${d.dir === 'x' ? 'vertical' : 'horizontal'}</b> line to split the floor into two rectangles, <b>${d.parts[0].n}</b> and <b>${d.parts[1].n}</b>.`,
      run: async (c) => { await c.anim(sp, [{ opacity: 0, strokeDashoffset: 60 }, { opacity: 1, strokeDashoffset: 0 }], 600); await Promise.all(groups.map((g) => ap(c, g))); await Promise.all(d.parts.map((p, i) => move(c, i))); } });
    d.parts.forEach((p, i) => steps.push({ cap: `Rectangle <b>${p.n}</b>: ${T(`${p.dims}=${p.a}`)} ${u}².${p.note ? ' <span class="u3l9-mut">' + p.note.replace(/\b([ab])\b/, '<i>$1</i>') + '</span>' : ''}`,
      run: async (c) => { await c.pop(plabs[i]); await c.fadeIn(pl[i]); } }));
    steps.push({ cap: `Push the parts back together and <b>add</b>: ${T(`${d.parts.map((p) => p.a).join('+')}=${tot}`)}. The floor is <b>${tot} ${u}²</b>.`,
      run: async (c) => { await Promise.all(d.parts.map((p, i) => move(c, i, true))); await c.pop(lt); } });
    return steps;
  }
};

/* =====================================================================================
 * 1b. The overlap trap (Full notes)
 * ===================================================================================== */
const overlap = {
  title: 'The overlap trap',
  height: 380, minW: 900,
  ask: 'The coffee shop floor again. Mia splits it into a bottom part <b>9 m by 4 m</b> and a left part <b>5 m by 7 m</b>. Is her area right?',
  make(stage, k, ex) {
    const s = 38, P = planP(70, 330, s);
    const svg = svgBox(stage, 540, 380);
    poly(svg, P, CAFE);
    const gB = hide(poly(svg, P, rectPts([0, 0, 9, 4]), { fill: FILL.A, 'fill-opacity': 0.75, stroke: STR.A }));
    const gL = hide(poly(svg, P, rectPts([0, 0, 5, 7]), { fill: FILL.B, 'fill-opacity': 0.75, stroke: STR.B }));
    const ov = hide(poly(svg, P, rectPts([0, 0, 5, 4]), { fill: '#e04a3c', 'fill-opacity': 0.55, stroke: '#c93a33', 'stroke-width': 4 }));
    poly(svg, P, CAFE, { fill: 'none' });
    CAFE_LABS.forEach((l) => edgeLab(stage, P, l.at[0], l.at[1], l.t, l.pos));
    edgeLab(stage, P, 7, 4, '4 m', 'n'); edgeLab(stage, P, 5, 5.5, '3 m', 'e');
    const [ocx, ocy] = P(2.5, 2);
    const ovl = hide(labC(stage, '<b>counted<br>twice!</b>', ocx, ocy, 'area red'));
    const PX = 560, PW = ex.W - PX - 16;
    const l1 = line(stage, `Bottom: ${T('9\\times4=36\\text{ m}^2')}`, PX, 14, PW);
    const l2 = line(stage, `Left: ${T('5\\times7=35\\text{ m}^2')}`, PX, 70, PW);
    const l3 = line(stage, `Total? ${T('36+35=71\\text{ m}^2')}`, PX, 126, PW, 'no');
    const l4 = line(stage, `Overlap: ${T('5\\times4=20\\text{ m}^2')}`, PX, 194, PW);
    const l5 = line(stage, `${T('71-20=51\\text{ m}^2')} ✓`, PX, 250, PW, 'ok');
    const s1 = hide(stamp(stage, 'Too big ✗', { ok: false, x: PX + PW - 70, y: 150, rotate: -8, size: 'sm' }));
    const s2 = hide(stamp(stage, 'Same as Example 1 ✓', { ok: true, x: PX + PW / 2, y: 336, rotate: -4 }));
    return [
      { cap: 'The <b>bottom part</b>: 9 m by 4 m.', run: async (c) => { await ap(c, gB); await c.fadeIn(l1); } },
      { cap: 'The <b>left part</b>: 5 m by 7 m, all the way from the bottom to the top.', run: async (c) => { await ap(c, gL); await c.fadeIn(l2); } },
      { cap: `Add them: ${T('36+35=71')} m². But the floor is only 51 m² (Example 1). What went wrong?`, run: async (c) => { await c.fadeIn(l3); await stampIn(c, s1); } },
      { cap: 'The corner <b>5 m by 4 m</b> is in <b>both</b> parts. Those square metres were counted <b>twice</b>.', run: async (c) => { await ap(c, ov); await c.pop(ovl); await c.anim(ov, [{ opacity: 1 }, { opacity: 0.35 }, { opacity: 1 }], 700); await c.fadeIn(l4); } },
      { cap: `Take the overlap away once: ${T('71-20=51')} m² ✓ Better: split so the parts <b>don’t overlap</b> (the left part only <b>above</b> the bottom: ${T('5\\times3')}).`, run: async (c) => { await c.fadeIn(l5); await stampIn(c, s2); } }
    ];
  }
};

/* =====================================================================================
 * 1c. The shed wall: a rectangle and a triangle (half a rectangle), then boxes of siding
 * ===================================================================================== */
const WALLS = {
  e2: { w: 10, rh: 7.5, rhT: '7\\tfrac12', th: 3.5, thT: '3\\tfrac12', box: 50,
    ask: 'Example 2: Mila’s shed wall is a rectangle <b>10 ft</b> wide and <b>7½ ft</b> high, with a triangle <b>3½ ft</b> high on top. Find the area. Two walls; one box of siding covers <b>50 ft²</b>.' },
  g: { w: 12, rh: 8, th: 4, box: 50,
    ask: 'A garage end wall is a rectangle <b>12 ft</b> wide and <b>8 ft</b> high, with a triangle <b>4 ft</b> high on top. Find the area. Two walls; one box of siding covers <b>50 ft²</b>.' }
};
const shedWall = {
  title: 'A wall: a rectangle with half a rectangle on top',
  height: 410, minW: 900,
  choices: [{ sep: 'Example 2 check:' }, { v: 'e2', label: 'Mila’s shed' }, { sep: 'Another wall:' }, { v: 'g', label: 'Garage wall' }],
  ask: (k) => WALLS[k].ask,
  make(stage, k, ex) {
    const d = WALLS[k], { w, rh, th } = d, Hh = rh + th;
    const R = w * rh, Tr = w * th / 2, A = R + Tr, A2 = 2 * A, nb = A2 / d.box, nbox = Math.ceil(nb - 1e-9);
    const s = Math.min(330 / w, 320 / Hh), ox = 80 + (360 - w * s) / 2, oy = 366;
    const P = planP(ox, oy, s), svg = svgBox(stage, 540, 410);
    const ghost = hide(poly(svg, P, [[0, 0], [w, 0], [w, Hh], [0, Hh]].map(([x, y]) => [x + 0.9, y - 0.5]), { fill: '#e9dcc4', stroke: '#b9ad97', 'stroke-dasharray': '7 6' }));
    const wall = [[0, 0], [w, 0], [w, rh], [w / 2, Hh], [0, rh]];
    poly(svg, P, wall, { fill: FILL.wall });
    // siding lines
    const sl = svgEl('g', { stroke: '#c9b48e', 'stroke-width': 1.5 }, svg);
    for (let y = 0.75; y < Hh; y += 0.75) { const xa = y <= rh ? 0 : (y - rh) / th * w / 2, xb = y <= rh ? w : w - xa; seg(sl, P, [xa, y], [xb, y], { stroke: '#c9b48e', 'stroke-width': 1.5 }); }
    const gR = hide(poly(svg, P, rectPts([0, 0, w, rh]), { fill: FILL.A, 'fill-opacity': 0.85, stroke: STR.A }));
    const box2 = hide(poly(svg, P, rectPts([0, rh, w, Hh]), { fill: 'none', stroke: '#2f8a76', 'stroke-width': 2.5, 'stroke-dasharray': '8 6' }));
    const halves = hide(svgEl('g', {}, svg)); poly(halves, P, [[0, rh], [w / 2, Hh], [0, Hh]], { fill: '#d3ede6', stroke: 'none' }); poly(halves, P, [[w, rh], [w, Hh], [w / 2, Hh]], { fill: '#d3ede6', stroke: 'none' });
    const gT = hide(poly(svg, P, [[0, rh], [w, rh], [w / 2, Hh]], { fill: FILL.B, 'fill-opacity': 0.9, stroke: STR.B }));
    poly(svg, P, wall, { fill: 'none' });
    const sp = hide(seg(svg, P, [0, rh], [w, rh], { 'stroke-dasharray': '10 7', 'stroke-width': 3 }));
    const ht = hide(seg(svg, P, [w / 2, rh], [w / 2, Hh], { 'stroke-dasharray': '5 5', 'stroke-width': 2.2, stroke: '#2f8a76' }));
    edgeLab(stage, P, w / 2, 0, `${w} ft`, 's'); edgeLab(stage, P, 0, rh / 2, `${d.rhT ? '7½' : rh} ft`, 'w');
    const [hx, hy] = P(w / 2, rh + th / 2); lab(stage, `${d.thT ? '3½' : th} ft`, hx + 8, hy - 14, 'dim sm');
    const [rx, ry] = P(w / 2, rh / 2), [tx, ty] = P(w / 2, rh + th / 3);
    const aR = hide(labC(stage, `${R} ft²`, rx, ry, 'area')), aT = hide(labC(stage, `${Tr} ft²`, tx, ty + 4, 'area'));
    const [gx, gy] = P(w, Hh); const x2 = hide(labC(stage, '× 2 walls', gx + 30, gy - 6, 'area red'));
    const PX = 560, PW = ex.W - PX - 16;
    const rhs = d.rhT ? '7.5' : rh;
    const l1 = line(stage, `Rectangle: ${T(`${w}\\times${rhs}=${R}`)} ft²`, PX, 10, PW);
    const l2 = line(stage, `Triangle: ${T(`\\tfrac12\\times${w}\\times${th}=${Tr}`)} ft²`, PX, 64, PW);
    const l3 = line(stage, `One wall: ${T(`${R}+${Tr}=${A}`)} ft²`, PX, 118, PW, 'big');
    const l4 = line(stage, `Two walls: ${T(`2\\times${A}=${A2}`)} ft²`, PX, 172, PW);
    const l5 = line(stage, `${T(`${A2}\\div${d.box}=${rnd(nb, 3)}`)} → <b>${nbox} boxes</b>`, PX, 226, PW, 'ok');
    const bx = []; const bw = Math.min(84, (PW - 10 * (nbox - 1)) / nbox);
    for (let i = 0; i < nbox; i++) {
      const f = Math.min(1, nb - i);
      const b = hide(add(stage, box(h('div', 'u3l9-bx', `<div class="u3l9-bxf" style="height:${(f * 100).toFixed(0)}%"></div><span>${f >= 0.999 ? '50 ft²' : rnd(f * d.box, 1) + ' ft²'}</span>`), bw, 100), PX + i * (bw + 10), 290));
      bx.push(b);
    }
    return [
      { cap: 'Split the wall with a line across: a <b>rectangle</b> at the bottom and a <b>triangle</b> on top.', run: async (c) => { await c.anim(sp, [{ opacity: 0 }, { opacity: 1 }], 400); } },
      { cap: `The rectangle is ${w} ft by ${d.rhT ? T('7\\tfrac12=7.5') : rh} ft: ${T(`${w}\\times${rhs}=${R}`)} ft².`, run: async (c) => { await ap(c, gR); await c.pop(aR); await c.fadeIn(l1); } },
      { cap: `The triangle is <b>half</b> of a ${w} ft by ${th} ft rectangle: ${T(`\\tfrac12\\times${w}\\times${th}=${Tr}`)} ft². (${th} ft is its height, straight up.)`,
        run: async (c) => { await ap(c, box2); await ap(c, halves); await c.sleep(400); await ap(c, ht); await Promise.all([ap(c, gT), c.anim(halves, [{ opacity: 1 }, { opacity: 0.25 }], 600)]); await c.pop(aT); await c.fadeIn(l2); } },
      { cap: `<b>Add</b> the parts: ${T(`${R}+${Tr}=${A}`)} ft² for one wall.`, run: (c) => c.pop(l3) },
      { cap: `The shed has <b>two</b> end walls: ${T(`2\\times${A}=${A2}`)} ft².`, run: async (c) => { await ap(c, ghost); await c.pop(x2); await c.fadeIn(l4); } },
      { cap: `One box covers ${d.box} ft²: ${T(`${A2}\\div${d.box}=${rnd(nb, 3)}`)}. You can’t buy part of a box, so round <b>up</b>: <b>${nbox} boxes</b>.`,
        run: async (c) => { for (const b of bx) await c.pop(b, 300); await c.fadeIn(l5); } }
    ];
  }
};

/* =====================================================================================
 * 1d. The arched window: a rectangle and half a circle
 * ===================================================================================== */
const ARCH = {
  e3: { w: 36, hh: 48, ask: 'Example 3: an arched window is a rectangle <b>36 in</b> wide and <b>48 in</b> tall, with a semicircle on top. Find its area in in² and in ft².' },
  d: { w: 24, hh: 30, ask: 'A door has an arched window: a rectangle <b>24 in</b> wide and <b>30 in</b> tall, with a semicircle on top. Find its area in in² and in ft².' }
};
const archWindow = {
  title: 'Rectangle + semicircle',
  height: 410, minW: 900,
  choices: [{ sep: 'Example 3 check:' }, { v: 'e3', label: 'Arched window' }, { sep: 'Another:' }, { v: 'd', label: 'Door window' }],
  ask: (k) => ARCH[k].ask,
  make(stage, k, ex) {
    const d = ARCH[k], { w, hh } = d, r = w / 2, R = w * hh, S = Math.PI * r * r / 2, A = R + S, F = A / 144;
    const s = Math.min(300 / w, 330 / (hh + r)), ox = 150 + (220 - w * s) / 2, oy = 370;
    const P = planP(ox, oy, s), svg = svgBox(stage, 540, 410);
    const [x0, y0] = P(0, 0), [x1, y1] = P(w, hh), rp = r * s, cx = (x0 + x1) / 2;
    const win = svgEl('path', { d: `M${x0} ${y0} H${x1} V${y1} A${rp} ${rp} 0 0 0 ${x0} ${y1} Z`, fill: FILL.glass, stroke: BR, 'stroke-width': 5, 'stroke-linejoin': 'round' }, svg);
    svgEl('path', { d: `M${cx} ${y0} V${y1 - rp * 0.98} M${x0} ${(y0 + y1) / 2} H${x1}`, stroke: '#9a6a24', 'stroke-width': 3 }, svg);
    const gR = hide(svgEl('rect', { x: x0, y: y1, width: x1 - x0, height: y0 - y1, fill: FILL.A, 'fill-opacity': 0.75, stroke: STR.A, 'stroke-width': 3 }, svg));
    const circ = hide(svgEl('circle', { cx, cy: y1, r: rp, fill: 'none', stroke: '#2f8a76', 'stroke-width': 2.5, 'stroke-dasharray': '8 6' }, svg));
    const lowHalf = hide(svgEl('path', { d: `M${x0} ${y1} A${rp} ${rp} 0 0 0 ${x1} ${y1} Z`, fill: '#d3ede6', 'fill-opacity': 0.8 }, svg));
    const gS = hide(svgEl('path', { d: `M${x1} ${y1} A${rp} ${rp} 0 0 0 ${x0} ${y1} Z`, fill: FILL.B, 'fill-opacity': 0.9, stroke: STR.B, 'stroke-width': 3 }, svg));
    const sp = hide(svgEl('line', { x1: x0, y1, x2: x1, y2: y1, stroke: INK, 'stroke-width': 3, 'stroke-dasharray': '10 7' }, svg));
    const rad = hide(svgEl('g', {}, svg)); svgEl('line', { x1: cx, y1: y1 - 2, x2: x1 - 4, y2: y1 - 2, stroke: '#c93a33', 'stroke-width': 4 }, rad); svgEl('circle', { cx, cy: y1 - 2, r: 4.5, fill: INK }, rad);
    const radL = hide(labC(stage, `<i>r</i> = ${r}`, (cx + x1) / 2, y1 + 18, 'dim red'));
    labC(stage, `${w} in`, cx, y0 + 22, 'dim'); labC(stage, `${hh} in`, x0 - 42, (y0 + y1) / 2, 'dim');
    const aR = hide(labC(stage, `${nH(R)} in²`, cx, (y0 + y1) / 2 + 26, 'area'));
    const aS = hide(labC(stage, `${rnd(S, 3)}…`, cx, y1 - rp * 0.55, 'area'));
    const PX = 560, PW = ex.W - PX - 16;
    const l1 = line(stage, `Rectangle: ${T(`${w}\\times${hh}=${nT(R)}`)} in²`, PX, 10, PW);
    const l2 = line(stage, `Semicircle: ${T(`r=${w}\\div2=${r}`)} in`, PX, 64, PW);
    const l3 = line(stage, `${T(`\\tfrac12\\times\\pi\\times${r}^2=${rnd(S, 3)}\\ldots`)} in²`, PX, 118, PW);
    const lcd = hide(add(stage, box(h('div', 'u3l9-lcd', `<div class="e">.5×π×${r}²</div><div class="r">${S.toPrecision(10).replace(/0+$/, '')}</div>`), 250, 74), PX + PW - 252, 176));
    const l4 = line(stage, `Total: ${T(`${nT(R)}+${rnd(S, 3)}\\ldots\\approx${nT(Math.round(A))}`)} in²`, PX, 262, PW, 'big');
    const l5 = line(stage, `${T(`${nT(rnd(A, 3))}\\div144\\approx${rnd(F, 1)}`)} ft²`, PX, 318, PW, 'ok');
    return [
      { cap: 'Split the window with a line across the top of the rectangle: a <b>rectangle</b> and a <b>semicircle</b>.', run: (c) => ap(c, sp) },
      { cap: `Rectangle: ${T(`${w}\\times${hh}=${nT(R)}`)} in².`, run: async (c) => { await ap(c, gR); await c.pop(aR); await c.fadeIn(l1); } },
      { cap: `The semicircle sits on the ${w} in top, so its <b>diameter</b> is ${w} in. The radius is half: ${T(`r=${w}\\div2=${r}`)} in.`, run: async (c) => { await ap(c, rad); await c.pop(radL); await c.fadeIn(l2); } },
      { cap: `A semicircle is <b>half</b> a circle. Find the whole circle, ${T(`\\pi\\times${r}^2`)}, then take half: ${T(`\\tfrac12\\times\\pi\\times${r}^2=${rnd(S, 3)}\\ldots`)} in².`,
        run: async (c) => { await ap(c, circ); await ap(c, lowHalf); await c.sleep(300); await Promise.all([ap(c, gS), c.anim(lowHalf, [{ opacity: 1 }, { opacity: 0 }], 700), c.anim(circ, [{ opacity: 1 }, { opacity: 0.35 }], 700)]); await c.pop(aS); await c.fadeIn(l3); await c.fadeIn(lcd); } },
      { cap: `Add, and keep all the digits until the end: ${T(`${nT(R)}+${rnd(S, 3)}\\ldots=${nT(rnd(A, 3))}\\ldots`)}. About <b>${nH(Math.round(A))} in²</b>.`, run: (c) => c.pop(l4) },
      { cap: `Film is sold by the square foot. 1 ft² = 144 in², so <b>divide</b>: ${T(`${nT(rnd(A, 3))}\\div144=${rnd(F, 3)}\\ldots`)}, about <b>${rnd(F, 1)} ft²</b>.`, run: (c) => c.fadeIn(l5) }
    ];
  }
};

/* =====================================================================================
 * 2. Whole minus the cut-out: the pieces lift out
 * ===================================================================================== */
const CUTS = {
  e4a: { ask: 'Example 4(a): the coffee shop floor (Example 1), using whole minus cut-out. The whole rectangle is <b>9 m by 7 m</b>; the missing corner is <b>a by b</b> (4 m by 3 m).',
    W: 9, H: 7, u: 'm', fill: FILL.floor, labs: [{ t: '9 m', at: [4.5, 0], pos: 's' }, { t: '7 m', at: [0, 3.5], pos: 'w' }],
    whole: { eq: '9\\times7=63', a: 63 },
    cuts: [{ kind: 'rect', r: [5, 4, 9, 7], look: FILL.floor, name: 'Corner', eq: 'a\\times b=4\\times3=12', a: 12, tag: '4 m × 3 m', fly: [70, -40] }],
    res: { eq: '63-12=51', txt: '51 m²', cap: 'The floor is <b>51 m²</b>, the same as Example 1 ✓' } },
  e4b: { ask: 'Example 4(b): the Nguyens’ backyard is <b>15 m by 12 m</b>, with a deck <b>6 m by 4.5 m</b> and a round flower bed <b>3 m across</b>. The rest is sod. Sod costs <b>$4.80 per m²</b> (area rounded up).',
    W: 15, H: 12, u: 'm', fill: FILL.sod, labs: [{ t: '15 m', at: [7.5, 0], pos: 's' }, { t: '12 m', at: [15, 6], pos: 'e' }],
    whole: { eq: '15\\times12=180', a: 180 },
    cuts: [{ kind: 'rect', r: [0, 7.5, 6, 12], look: FILL.wood, deck: true, name: 'Deck', eq: '6\\times4.5=27', a: 27, tag: 'deck', fly: [-40, -46] },
      { kind: 'circ', c: [10.5, 4.5], rad: 1.5, look: '#e79bc0', name: 'Bed', eq: '\\pi\\times1.5^2=7.0685\\ldots', a: 7.0685, tag: 'bed', fly: [40, 60], cap: 'The flower bed is 3 m across, so its radius is 1.5 m.' }],
    res: { eq: '180-27-7.0685\\ldots\\approx145.93', txt: '145.93 m²', cap: 'The sod covers about <b>145.93 m²</b>.' },
    extra: [{ cap: `The landscaper rounds <b>up</b> to 146 m²: ${T('146\\times\\$4.80=\\$700.80')}. The sod costs <b>$700.80</b>.`, html: `146 × $4.80 = <b>$700.80</b>` }] },
  e5: { ask: 'Example 5: Owen’s wall is <b>12 ft by 8 ft</b>. The door is <b>3 ft by 6 ft 8 in</b>, the window <b>4 ft by 3 ft 6 in</b>. Two coats; one can covers about <b>100 ft²</b>.',
    W: 12, H: 8, u: 'ft', fill: FILL.paint, labs: [{ t: '12 ft', at: [6, 0], pos: 's' }, { t: '8 ft', at: [0, 4], pos: 'w' }],
    pre: { cap: `First change the heights to feet: 6 ft 8 in = ${T('6\\tfrac{8}{12}=6\\tfrac23')} ft, and 3 ft 6 in = 3.5 ft.`, html: `Door ${T('6\\tfrac23')} ft · window 3.5 ft` },
    whole: { eq: '12\\times8=96', a: 96 },
    cuts: [{ kind: 'rect', r: [1.5, 0, 4.5, 20 / 3], look: '#b9824a', door: true, name: 'Door', eq: '3\\times6\\tfrac23=20', a: 20, tag: 'door', fly: [-30, -60] },
      { kind: 'rect', r: [7, 3, 11, 6.5], look: FILL.glass, win: true, name: 'Window', eq: '4\\times3.5=14', a: 14, tag: 'window', fly: [40, -60] }],
    res: { eq: '96-20-14=62', txt: '62 ft²', cap: 'Owen will paint <b>62 ft²</b>.' },
    extra: [{ cap: `Two coats: ${T('2\\times62=124')} ft². ${T('124\\div100=1.24')} cans, so round <b>up</b>: <b>2 cans</b>.`, html: `2 coats: ${T('124\\div100=1.24')} → <b>2 cans</b>` }] }
};
const cutOut = {
  title: 'Whole minus the cut-out',
  height: 420, minW: 900,
  choices: [{ sep: 'Example 4 check:' }, { v: 'e4a', label: '(a) Coffee shop' }, { v: 'e4b', label: '(b) Backyard' }, { sep: 'Example 5 check:' }, { v: 'e5', label: 'Owen’s wall' }],
  ask: (k) => CUTS[k].ask,
  make(stage, k, ex) {
    const d = CUTS[k], u = d.u;
    const s = Math.min(420 / d.W, 320 / d.H), ox = 50 + (440 - d.W * s) / 2, oy = 370 - (320 - d.H * s) / 2;
    const P = planP(ox, oy, s), svg = svgBox(stage, 540, 420);
    const whole = rectPts([0, 0, d.W, d.H]);
    poly(svg, P, whole, { fill: d.fill });
    if (k === 'e4b') { const g = svgEl('g', { stroke: '#7db66a', 'stroke-width': 1.3 }, svg); for (let i = 0.6; i < d.W; i += 0.9) for (let j = 0.5; j < d.H; j += 1.1) { const [x, y] = P(i + (j % 2) * 0.4, j); svgEl('path', { d: `M${x} ${y} l3 -7 M${x + 5} ${y} l-1 -6` }, g); } }
    const wl = hide(poly(svg, P, whole, { fill: '#fff6e5', 'fill-opacity': 0.0, stroke: '#12805a', 'stroke-width': 6 }));
    const holes = [], pieces = [], tags = [];
    d.cuts.forEach((q) => {
      let hole, pc;
      if (q.kind === 'rect') {
        hole = hide(poly(svg, P, rectPts(q.r), { fill: '#fff', stroke: '#c93a33', 'stroke-width': 3, 'stroke-dasharray': '8 6' }));
        pc = svgEl('g', {}, svg); poly(pc, P, rectPts(q.r), { fill: q.look, stroke: q.look === FILL.floor ? '#b9ad97' : BR, 'stroke-width': q.look === FILL.floor ? 2 : 3, 'stroke-dasharray': q.look === FILL.floor ? '7 6' : '' });
        const [x0, y0] = P(q.r[0], q.r[1]), [x1, y1] = P(q.r[2], q.r[3]);
        if (q.deck) for (let x = x0 + 9; x < x1; x += 9) svgEl('line', { x1: x, y1, x2: x, y2: y0, stroke: '#a8743a', 'stroke-width': 1.5 }, pc);
        if (q.door) svgEl('circle', { cx: x1 - 9, cy: (y0 + y1) / 2 + 6, r: 3.5, fill: '#4a2c14' }, pc);
        if (q.win) svgEl('path', { d: `M${(x0 + x1) / 2} ${y1} V${y0} M${x0} ${(y0 + y1) / 2} H${x1}`, stroke: '#9a6a24', 'stroke-width': 3 }, pc);
      } else {
        const [cx, cy] = P(...q.c), rr = q.rad * s;
        hole = hide(svgEl('circle', { cx, cy, r: rr, fill: '#fff', stroke: '#c93a33', 'stroke-width': 3, 'stroke-dasharray': '7 5' }, svg));
        pc = svgEl('g', {}, svg); svgEl('circle', { cx, cy, r: rr, fill: '#8a5a22', stroke: BR, 'stroke-width': 3 }, pc);
        for (let a = 0; a < 6; a++) svgEl('circle', { cx: cx + rr * 0.55 * Math.cos(a * 1.05), cy: cy + rr * 0.55 * Math.sin(a * 1.05), r: 4.5, fill: a % 2 ? '#f2c45a' : '#e79bc0' }, pc);
      }
      holes.push(hole); pieces.push(pc);
      const cxy = q.kind === 'rect' ? P((q.r[0] + q.r[2]) / 2, (q.r[1] + q.r[3]) / 2) : P(...q.c);
      tags.push(labC(stage, q.tag, cxy[0], cxy[1] + (q.kind === 'circ' ? q.rad * s + 16 : 0), 'tag'));
    });
    poly(svg, P, whole, { fill: 'none' });
    d.labs.forEach((l) => edgeLab(stage, P, l.at[0], l.at[1], l.t, l.pos));
    const PX = 560, PW = ex.W - PX - 16;
    let y = 10; const L = (html, cls) => { const e = line(stage, html, PX, y, PW, cls); y += 54; return e; };
    const lp = d.pre ? L(d.pre.html) : null;
    const lw = L(`Whole: ${T(`${d.whole.eq}`)} ${u}²`);
    const lc = d.cuts.map((q) => L(`${q.name}: ${T(q.eq)} ${u}²`));
    const lr = L(`${T(d.res.eq)} ${u}²`, 'big');
    const lx = (d.extra || []).map((e) => L(e.html, 'ok'));
    const steps = [];
    if (d.pre) steps.push({ cap: d.pre.cap, run: (c) => c.fadeIn(lp) });
    steps.push({ cap: `Start with the <b>whole</b> rectangle, as if nothing were missing: ${T(d.whole.eq)} ${u}².`, run: async (c) => { await ap(c, wl); await c.fadeIn(lw); await c.anim(wl, [{ opacity: 1 }, { opacity: 0 }], 500); } });
    d.cuts.forEach((q, i) => steps.push({ cap: `${q.cap ? q.cap + ' ' : ''}<b>Cut out</b> the ${q.name.toLowerCase()}: ${T(q.eq)} ${u}².`,
      run: async (c) => { await ap(c, holes[i], 200); await Promise.all([c.anim(pieces[i], [{ transform: 'none', opacity: 1 }, { transform: `translate(${q.fly[0]}px,${q.fly[1]}px) scale(.7)`, opacity: 0 }], 800), c.anim(tags[i], [{ opacity: 1 }, { opacity: 0 }], 400)]); await c.fadeIn(lc[i]); } }));
    steps.push({ cap: `<b>Subtract</b> every cut-out from the whole: ${T(d.res.eq)}. ${d.res.cap}`, run: (c) => c.pop(lr) });
    (d.extra || []).forEach((e, i) => steps.push({ cap: e.cap, run: (c) => c.fadeIn(lx[i]) }));
    return steps;
  }
};

/* =====================================================================================
 * 2b. Three ways, one answer (Full notes)
 * ===================================================================================== */
const threeWays = {
  title: 'Three ways, one answer',
  height: 390, minW: 900,
  ask: 'The coffee shop floor from Example 1: split it two different ways, then do whole minus cut-out.',
  make(stage, k, ex) {
    const PWd = (ex.W - 40) / 3, s = Math.min(26, (PWd - 70) / 9), ways = [
      { t: 'Vertical split', parts: [[[0, 0, 5, 7], 'A'], [[5, 0, 9, 4], 'B']], eq: '35+16=51' },
      { t: 'Horizontal split', parts: [[[0, 0, 9, 4], 'C'], [[0, 4, 5, 7], 'D']], eq: '36+15=51' },
      { t: 'Whole − cut-out', parts: [[[0, 0, 9, 7], 'floor']], cut: [5, 4, 9, 7], eq: '63-12=51' }];
    const out = ways.map((w, i) => {
      const x0 = 20 + i * PWd, ox = x0 + (PWd - 9 * s) / 2, oy = 60 + 7 * s;
      const P = planP(ox, oy, s), svg = svgBox(stage, PWd, 7 * s + 80, x0, 0);
      const Pl = planP(ox - x0, oy, s);
      labC(stage, `<b>${w.t}</b>`, x0 + PWd / 2, 24, 'way');
      const g = hide(svgEl('g', {}, svg));
      w.parts.forEach(([r, n]) => poly(g, Pl, rectPts(r), { fill: FILL[n] || FILL.floor, stroke: STR[n] || BR, 'stroke-width': 2.5 }));
      if (w.cut) { poly(g, Pl, rectPts(w.cut), { fill: '#fff', stroke: '#c93a33', 'stroke-width': 2.5, 'stroke-dasharray': '7 5' }); }
      const base = svgEl('g', {}, svg); poly(base, Pl, CAFE, { fill: 'none', stroke: BR, 'stroke-width': 3 });
      svg.insertBefore(g, base);
      const ln = line(stage, T(`${w.eq}\\text{ m}^2`), x0 + 10, oy + 30, PWd - 20, 'big');
      const st = hide(stamp(stage, '51 m² ✓', { ok: true, x: x0 + PWd / 2, y: oy + 108, rotate: -6, size: 'sm' }));
      return { g, ln, st, P };
    });
    const big = hide(stamp(stage, 'Same answer, three ways ✓', { ok: true, x: ex.W / 2, y: 352, rotate: -3 }));
    const st = (i, cap) => ({ cap, run: async (c) => { await ap(c, out[i].g); await c.fadeIn(out[i].ln); await stampIn(c, out[i].st); } });
    return [
      st(0, `<b>Vertical</b> line: A ${T('5\\times7=35')} and B ${T('4\\times4=16')}. ${T('35+16=51')} m².`),
      st(1, `<b>Horizontal</b> line: C ${T('9\\times4=36')} and D ${T('5\\times3=15')}. ${T('36+15=51')} m².`),
      st(2, `<b>Whole minus cut-out</b>: ${T('9\\times7=63')}, take away the ${T('4\\times3=12')} corner. ${T('63-12=51')} m².`),
      { cap: 'Every way gives <b>51 m²</b>. When two ways agree, you can trust the answer.', run: (c) => stampIn(c, big) }
    ];
  }
};

/* =====================================================================================
 * 3. Counting squares: ticks for full squares, dots for part squares
 * ===================================================================================== */
const GRIDS = {
  e6: { key: 'pond', P: POND_P, W: 10, H: 8, cell: 40, one: 1, oneEq: '1\\times1=1', unit: 'm',
    ask: 'Example 6: a pond on a park map. Each square is <b>1 m by 1 m</b>. Estimate the area of the pond.' },
  e7: { key: 'slough', P: SLOUGH_P, W: 12, H: 8, cell: 36, one: 100, oneEq: '10\\times10=100', unit: 'm', around: [2, 1, 10, 6], inside: [3, 2, 8, 5],
    ask: 'Example 7: a slough in a field. Each square stands for <b>10 m by 10 m</b>. Estimate its area, then check it between two rectangles.' }
};
function gridSVG(svg, d, gx, gy, cell, o = {}) {
  const P = (x, y) => [gx + x * cell, gy + (d.H - y) * cell];
  const path = 'M' + d.P.map(([x, y]) => P(x, y).map((v) => v.toFixed(1)).join(' ')).join('L') + 'Z';
  svgEl('path', { d: path, fill: '#cfe2f7' }, svg);
  const gl = svgEl('g', { stroke: '#a9b3bf', 'stroke-width': 1.2 }, svg);
  for (let i = 0; i <= d.W; i++) svgEl('line', { x1: gx + i * cell, y1: gy, x2: gx + i * cell, y2: gy + d.H * cell }, gl);
  for (let j = 0; j <= d.H; j++) svgEl('line', { x1: gx, y1: gy + j * cell, x2: gx + d.W * cell, y2: gy + j * cell }, gl);
  svgEl('path', { d: path, fill: 'none', stroke: '#2c5a8a', 'stroke-width': o.sw || 3, 'stroke-linejoin': 'round' }, svg);
  return P;
}
const tickPath = (x, y, c) => `M${x + c * 0.26} ${y + c * 0.52} L${x + c * 0.43} ${y + c * 0.7} L${x + c * 0.76} ${y + c * 0.3}`;
const gridCount = {
  title: 'Count the squares: full + part ÷ 2',
  height: 410, minW: 920,
  choices: [{ sep: 'Example 6 check:' }, { v: 'e6', label: 'Pond' }, { sep: 'Example 7 check:' }, { v: 'e7', label: 'Slough' }],
  ask: (k) => GRIDS[k].ask,
  make(stage, k, ex) {
    const d = GRIDS[k], { full, part } = cls(d.key), cell = d.cell, nf = full.length, np = part.length, half = np / 2, sq = nf + half, A = sq * d.one;
    const gx = 20, gy = 40 + (8 - d.H) * cell / 2, svg = svgBox(stage, d.W * cell + 40, 410);
    const P = gridSVG(svg, d, gx, gy, cell);
    const ticks = full.map(([i, j]) => { const [x, y] = P(i, j + 1); const t = svgEl('path', { d: tickPath(x, y, cell), fill: 'none', stroke: '#12805a', 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg); return hide(t); });
    const dots = part.map(([i, j]) => { const [x, y] = P(i + 0.5, j + 0.5); return hide(svgEl('circle', { cx: x, cy: y, r: 6, fill: '#e8a01e', stroke: '#8a5a12', 'stroke-width': 1.5 }, svg)); });
    const rect = (r, col, dash) => { const [x0, y0] = P(r[0], r[1]), [x1, y1] = P(r[2], r[3]); return hide(svgEl('rect', { x: x0, y: y1, width: x1 - x0, height: y0 - y1, fill: 'none', stroke: col, 'stroke-width': 4.5, 'stroke-dasharray': dash || '' }, svg)); };
    const ra = d.around ? rect(d.around, '#c93a33', '11 7') : null, ri = d.inside ? rect(d.inside, '#7b4fc4') : null;
    const PX = d.W * cell + 70, PW = ex.W - PX - 14;
    const cnt = hide(add(stage, box(h('div', 'u3l9-cnt', `<span class="tk">✓</span> Full: <b class="nf">0</b> <span class="dt">●</span> Part: <b class="np">0</b>`), PW, 46), PX, 8));
    const setN = (cl, n) => { cnt.querySelector(cl).textContent = n; };
    let y = 64; const L = (html, cls) => { const e = line(stage, html, PX, y, PW, cls); y += 52; return e; };
    const l0 = L(`One square: ${T(d.oneEq)} m²`);
    const l1 = L(`Part ÷ 2: ${T(`${np}\\div2=${half}`)}`);
    const l2 = L(`${T(`${nf}+${half}=${sq}`)} squares${d.one === 1 ? ` → <b>${sq} m²</b>` : ''}`, d.one === 1 ? 'big' : '');
    const l3 = d.one > 1 ? L(`${T(`${sq}\\times${d.one}=${nT(A)}`)} m²`, 'big') : null;
    const aw = d.around ? (d.around[2] - d.around[0]) * (d.around[3] - d.around[1]) : 0, iw = d.inside ? (d.inside[2] - d.inside[0]) * (d.inside[3] - d.inside[1]) : 0;
    const l4 = d.around ? L(`<span class="u3l9-red">Around:</span> ${T(`${d.around[2] - d.around[0]}\\times${d.around[3] - d.around[1]}=${aw}`)} → ${nH(aw * d.one)} m²`) : null;
    const l5 = d.inside ? L(`<span class="u3l9-pur">Inside:</span> ${T(`${d.inside[2] - d.inside[0]}\\times${d.inside[3] - d.inside[1]}=${iw}`)} → ${nH(iw * d.one)} m²`) : null;
    const st = d.around ? hide(stamp(stage, `${nH(iw * d.one)} < ${nH(A)} < ${nH(aw * d.one)} ✓`, { ok: true, x: gx + d.W * cell / 2, y: gy + d.H * cell + 34, rotate: -3 })) : null;
    const steps = [
      { cap: `Each square stands for ${T(d.oneEq)} m². Put a <b>tick</b> in every <b>full</b> square: completely inside the ${d.key}.`,
        run: async (c) => { await c.fadeIn(cnt); await c.fadeIn(l0); let n = 0; for (const t of ticks) { n++; setN('.nf', n); await c.pop(t, 150); } } },
      { cap: `Put a <b>dot</b> in every <b>part</b> square: the edge of the ${d.key} cuts through it. There are <b>${np}</b>.`,
        run: async (c) => { let n = 0; for (const t of dots) { n++; setN('.np', n); await c.pop(t, 130); } } },
      { cap: `A part square is about <b>half</b> full on average, so two part squares make about one full square: ${T(`${np}\\div2=${half}`)}.`,
        run: async (c) => { await Promise.all(dots.map((t) => c.anim(t, [{ transform: 'scale(1)' }, { transform: 'scale(1.5)' }, { transform: 'scale(1)' }], 500))); await c.fadeIn(l1); } },
      { cap: `Add: ${T(`${nf}+${half}=${sq}`)} squares.${d.one === 1 ? ` Each is 1 m², so the ${d.key} is about <b>${sq} m²</b>.` : ''}`, run: (c) => c.pop(l2) }
    ];
    if (l3) steps.push({ cap: `Each square stands for ${d.one} m²: ${T(`${sq}\\times${d.one}=${nT(A)}`)}. The slough is about <b>${nH(A)} m²</b>.`, run: (c) => c.pop(l3) });
    if (l4) steps.push({ cap: `Check: the smallest rectangle <b>around</b> it is ${d.around[2] - d.around[0]} by ${d.around[3] - d.around[1]} squares: ${nH(aw * d.one)} m². The slough is <b>less</b> than that.`, run: async (c) => { await ap(c, ra); await c.fadeIn(l4); } });
    if (l5) steps.push({ cap: `The biggest rectangle <b>inside</b> it is ${d.inside[2] - d.inside[0]} by ${d.inside[3] - d.inside[1]} squares: ${nH(iw * d.one)} m². The slough is <b>more</b> than that.`, run: async (c) => { await ap(c, ri); await c.fadeIn(l5); } });
    if (st) steps.push({ cap: `${nH(A)} m² is between ${nH(iw * d.one)} m² and ${nH(aw * d.one)} m², so the estimate is <b>reasonable</b> ✓`, run: (c) => stampIn(c, st) });
    return steps;
  }
};

/* =====================================================================================
 * 3b. Why half? The part squares sorted and paired (Full notes)
 * ===================================================================================== */
const whyHalf = {
  title: 'Why half? Pair the part squares',
  height: 420, minW: 940,
  ask: 'Example 6: the pond has 20 part squares. Why do we count them as 20 ÷ 2 = 10 full squares?',
  make(stage, k, ex) {
    const d = GRIDS.e6, { full, part } = cls('pond'), cell = 27;
    const svg = svgBox(stage, 300, 260, 0, 20);
    const P = gridSVG(svg, d, 14, 10, cell, { sw: 2.2 });
    part.forEach(([i, j]) => { const [x, y] = P(i, j + 1); svgEl('rect', { x: x + 1, y: y + 1, width: cell - 2, height: cell - 2, fill: '#e8a01e', 'fill-opacity': 0.35 }, svg); });
    const G = 54, gap = 8, X0 = 310, rows = [96, 230];
    const order = part.map((p, i) => i).sort((a, b) => part[a][2] - part[b][2]);
    const n = part.length, m = n / 2;
    // slot for sorted rank r: low half in row 0 left → right; high half in row 1 right → left (so a column is a pair)
    const slot = (r) => (r < m ? [X0 + r * (G + gap), rows[0]] : [X0 + (n - 1 - r) * (G + gap), rows[1]]);
    const start = (i) => [X0 + (i % m) * (G + gap), rows[Math.floor(i / m)]];
    const gs = part.map(([, , f], i) => { const e = hide(add(stage, box(h('div', 'u3l9-gauge', `<div class="lo" style="height:${(f * 100).toFixed(1)}%"></div><div class="hi" style="height:0"></div>`), G, G), ...start(i))); return e; });
    const rank = []; order.forEach((idx, r) => { rank[idx] = r; });
    const sums = []; for (let r = 0; r < m; r++) sums.push(part[order[r]][2] + part[order[n - 1 - r]][2]);
    const sumL = sums.map((v, r) => hide(labC(stage, rnd(v, 2).toFixed(2), X0 + r * (G + gap) + G / 2, rows[0] + G + 18, 'sum')));
    const one = hide(add(stage, box(h('div', 'u3l9-oneln', '<span>1 full square</span>'), m * (G + gap) - gap + 10, 2), X0 - 5, rows[0]));
    const tot = part.reduce((a, p) => a + p[2], 0), real = polyArea(POND_P);
    const l1 = hide(add(stage, box(h('div', 'u3l9-ln', `<div>Together: about ${T(rnd(tot, 1))} full squares ≈ ${T('20\\div2=10')}</div>`), ex.W - 330, 46), 310, 300));
    const l2 = hide(add(stage, box(h('div', 'u3l9-ln ok', `<div>Estimate ${T('12+10=22')} m² · measured exactly: ${T(rnd(real, 1))} m² ✓</div>`), ex.W - 330, 46), 310, 356));
    lab(stage, 'Blue = how much of the square is pond', 310, 52, 'note');
    return [
      { cap: 'Here are the pond’s <b>20 part squares</b>. The blue in each box shows how much of that square is pond.', run: async (c) => { for (const g of gs) await c.pop(g, 110); } },
      { cap: 'Sort them: the almost-empty ones in the top row, the almost-full ones in the bottom row (fullest on the left).',
        run: (c) => Promise.all(gs.map((g, i) => { const [x, y] = slot(rank[i]), [x0, y0] = start(i); return c.anim(g, [{ translate: `${x - x0}px ${y - y0}px` }], 900); })) },
      { cap: 'Pour each bottom square into the one above it: an almost-empty one plus an almost-full one makes about <b>one full square</b>.',
        run: async (c) => {
          await ap(c, one);
          await Promise.all(order.slice(m).map((idx) => { const g = gs[idx], [x, y] = slot(rank[idx]), [x0, y0] = start(idx); return c.anim(g, [{ translate: `${x - x0}px ${y - y0}px`, opacity: 1 }, { translate: `${x - x0}px ${y - y0 - (rows[1] - rows[0])}px`, opacity: 0 }], 800); }));
          await Promise.all(order.slice(0, m).map((idx, r) => { const hi = gs[idx].querySelector('.hi'), f2 = part[order[n - 1 - r]][2]; return c.anim(hi, [{ height: '0%' }, { height: (f2 * 100).toFixed(1) + '%' }], 600); }));
          for (const s of sumL) await c.pop(s, 160);
        } },
      { cap: `${m} pairs, each close to 1. So the 20 part squares are worth about <b>10</b> full squares: ${T('20\\div2=10')}.`, run: (c) => c.fadeIn(l1) },
      { cap: `A computer measured the pond exactly: about <b>${rnd(real, 1)} m²</b>. Our estimate of 22 m² is very close ✓`, run: (c) => c.fadeIn(l2) }
    ];
  }
};

/* =====================================================================================
 * 4. The skating oval: estimate, calculate, and the verdict on Jordan's answer
 * ===================================================================================== */
const ovalCheck = {
  title: 'Is the answer reasonable? The skating oval',
  height: 470, minW: 920,
  ask: 'Example 8: the skating oval is a rectangle <b>40 m by 20 m</b> with a semicircle on each end. Find its area, and decide whether Jordan’s 2 057 m² can be right.',
  make(stage, k, ex) {
    const s = 6.4, X0 = 30 + 10 * s, Y0 = 26, r = 10 * s, L = 40 * s, CY = Y0 + r;
    const svg = svgBox(stage, 520, 340);
    const ghost = svgEl('path', { d: `M${X0} ${Y0} A${r} ${r} 0 0 0 ${X0} ${Y0 + 2 * r} M${X0 + L} ${Y0} A${r} ${r} 0 0 1 ${X0 + L} ${Y0 + 2 * r}`, fill: 'none', stroke: '#9ab', 'stroke-width': 2, 'stroke-dasharray': '6 5' }, svg);
    const rectE = svgEl('rect', { x: X0, y: Y0, width: L, height: 2 * r, fill: '#e3f1fb', stroke: '#3c6e9a', 'stroke-width': 3 }, svg);
    const rFill = hide(svgEl('rect', { x: X0, y: Y0, width: L, height: 2 * r, fill: FILL.A, 'fill-opacity': 0.8, stroke: STR.A, 'stroke-width': 3 }, svg));
    const capL = svgEl('path', { d: `M${X0} ${Y0} A${r} ${r} 0 0 0 ${X0} ${Y0 + 2 * r} Z`, fill: '#e3f1fb', stroke: '#3c6e9a', 'stroke-width': 3 }, svg);
    const capR = svgEl('path', { d: `M${X0 + L} ${Y0} A${r} ${r} 0 0 1 ${X0 + L} ${Y0 + 2 * r} Z`, fill: '#e3f1fb', stroke: '#3c6e9a', 'stroke-width': 3 }, svg);
    const around = hide(svgEl('rect', { x: X0 - r, y: Y0, width: L + 2 * r, height: 2 * r, fill: 'none', stroke: '#c93a33', 'stroke-width': 4, 'stroke-dasharray': '11 7' }, svg));
    labC(stage, '40 m', X0 + L / 2, Y0 + 2 * r + 18, 'dim'); lab(stage, '20 m', X0 + 8, CY - 14, 'dim');
    const aroundL = hide(labC(stage, '10 + 40 + 10 = 60 m', X0 + L / 2, Y0 - 2, 'dim red'));
    const aR = hide(labC(stage, '800 m²', X0 + L / 2, CY, 'area'));
    // where the two caps meet to make one circle
    const TX = X0 + L / 2, TY = Y0 + 2 * r + 46 + r;
    const circL = hide(labC(stage, `${T('\\pi\\times10^2')}<br>314.159…`, TX + r + 70, TY, 'area'));
    const PX = 540, PW = ex.W - PX - 14;
    const l1 = line(stage, `Around: ${T('60\\times20=1\\,200')} m²`, PX, 6, PW);
    const l2 = line(stage, `Rectangle: ${T('40\\times20=800')} m²`, PX, 58, PW);
    const l3 = line(stage, `Circle: ${T('\\pi\\times10^2=314.159\\ldots')}`, PX, 110, PW);
    const l4 = line(stage, `${T('800+314.159\\ldots\\approx1\\,114')} m²`, PX, 162, PW, 'big');
    const l5 = line(stage, `Jordan: ${T('800+\\pi\\times20^2\\approx2\\,057')} ✗`, PX, 214, PW, 'no');
    const l6 = line(stage, `He used <b>d = 20</b> as the radius!`, PX, 266, PW, 'no');
    // the area meter
    const MX = 40, MW = ex.W - 80, MY = 420, MAX = 2400, mx = (v) => MX + v / MAX * MW;
    const meter = svgBox(stage, ex.W, 60, 0, MY - 26);
    svgEl('line', { x1: MX, y1: 40, x2: MX + MW, y2: 40, stroke: INK, 'stroke-width': 2.5 }, meter);
    for (let v = 0; v <= MAX; v += 400) { svgEl('line', { x1: mx(v), y1: 34, x2: mx(v), y2: 46, stroke: INK, 'stroke-width': 2 }, meter); }
    const tickL = []; for (let v = 0; v <= MAX; v += 400) tickL.push(labC(stage, nH(v), mx(v), MY + 34, 'tick'));
    const limit = hide(svgEl('g', {}, meter)); svgEl('line', { x1: mx(1200), y1: 0, x2: mx(1200), y2: 52, stroke: '#c93a33', 'stroke-width': 4, 'stroke-dasharray': '6 4' }, limit);
    const limL = hide(labC(stage, 'around: 1 200 m²', mx(1200), MY - 40, 'dim red'));
    const barG = hide(svgEl('rect', { x: MX, y: 22, width: 0, height: 16, rx: 4, fill: '#12805a' }, meter));
    const barJ = hide(svgEl('rect', { x: MX, y: 4, width: 0, height: 16, rx: 4, fill: '#c93a33' }, meter));
    const sOk = hide(stamp(stage, 'Less than 1 200 ✓', { ok: true, x: PX + PW * 0.27, y: 345, rotate: -5, size: 'sm' }));
    const sNo = hide(stamp(stage, 'Too big ✗', { ok: false, x: PX + PW * 0.78, y: 345, rotate: -6, size: 'sm' }));
    const grow = (c, el, v) => tween(c, 900, (t) => { el.setAttribute('width', (mx(v) - MX) * t); });
    return [
      { cap: 'Estimate first: draw a rectangle <b>around</b> the oval. Each end adds a radius (10 m): ' + T('10+40+10=60') + ' m long, 20 m wide.', run: async (c) => { await ap(c, around); await c.fadeIn(aroundL); await c.fadeIn(l1); } },
      { cap: `${T('60\\times20=1\\,200')} m². The oval fits inside this rectangle, so its area must be <b>less than 1 200 m²</b>.`, run: async (c) => { await ap(c, limit); await c.fadeIn(limL); } },
      { cap: `Now calculate. The middle rectangle: ${T('40\\times20=800')} m².`, run: async (c) => { await ap(c, rFill); await c.pop(aR); await c.fadeIn(l2); } },
      { cap: `The two semicircles push together to make <b>one whole circle</b>. Its diameter is 20 m, so ${T('r=10')} m: ${T('\\pi\\times10^2=314.159\\ldots')} m².`,
        run: async (c) => { await Promise.all([c.anim(capL, [{ transform: 'translate(0px,0px)' }, { transform: `translate(${TX - X0}px,${TY - CY}px)` }], 1100), c.anim(capR, [{ transform: 'translate(0px,0px)' }, { transform: `translate(${TX - X0 - L}px,${TY - CY}px)` }], 1100)]); await c.pop(circL); await c.fadeIn(l3); } },
      { cap: `Add: ${T('800+314.159\\ldots\\approx1\\,114')} m². That is less than 1 200 m², so it is <b>reasonable</b> ✓`, run: async (c) => { await c.pop(l4); await ap(c, barG, 100); await grow(c, barG, 1114.16); await stampIn(c, sOk); } },
      { cap: 'Jordan got <b>2 057 m²</b>. That is more than the whole rectangle around the oval, so it <b>cannot</b> be right.', run: async (c) => { await c.fadeIn(l5); await ap(c, barJ, 100); await grow(c, barJ, 2056.64); await stampIn(c, sNo); } },
      { cap: `His mistake: he used the <b>diameter</b> (20 m) as the radius. ${T('\\pi\\times20^2=1\\,256.6\\ldots')} and ${T('800+1\\,256.6\\ldots\\approx2\\,057')}.`, run: (c) => c.fadeIn(l6) }
    ];
  }
};

mountExplainers({ splitAdd, overlap, shedWall, archWindow, cutOut, threeWays, gridCount, whyHalf, ovalCheck });

/* =====================================================================================
 * Static figures on the cards
 * ===================================================================================== */
function figSVG(id, W, H) { const host = document.getElementById(id); if (!host) return null; const s = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, class: 'u3l9-fsvg' }); host.appendChild(s); return s; }
const it = { 'font-style': 'italic', 'font-family': 'Georgia, serif', fill: '#c93a33', 'font-size': 22 };
function cafeFig(id, s) {
  const W = 9 * s + 110, H = 7 * s + 64, svg = figSVG(id, W, H); if (!svg) return;
  const P = planP(52, 7 * s + 32, s);
  poly(svg, P, CAFE, { 'stroke-width': s > 24 ? 3 : 2.5 });
  const fs = s > 24 ? 18 : 16;
  const t = (x, y, str, o = {}) => svgTxt(svg, ...P(x, y).map((v, i) => v + (o.d ? o.d[i] : 0)), str, Object.assign({ 'font-size': fs }, o.a || {}));
  t(4.5, 0, '9 m', { d: [0, 22] }); t(0, 3.5, '7 m', { d: [-26, 6] }); t(2.5, 7, '5 m', { d: [0, -9] }); t(9, 2, '4 m', { d: [26, 6] });
  t(7, 4, 'a', { d: [0, -9], a: Object.assign({}, it, { 'font-size': fs + 4 }) }); t(5, 5.5, 'b', { d: [14, 8], a: Object.assign({}, it, { 'font-size': fs + 4 }) });
}
cafeFig('u3l9-fig-ex1', 32); cafeFig('u3l9-fig-ex1b', 20); cafeFig('u3l9-fig-ex1c', 20); cafeFig('u3l9-fig-ex4a', 20);
{ // Example 2: the shed wall
  const s = 24, svg = figSVG('u3l9-fig-ex2', 10 * s + 110, 11 * s + 50);
  if (svg) {
    const P = planP(66, 11 * s + 20, s);
    poly(svg, P, [[0, 0], [10, 0], [10, 7.5], [5, 11], [0, 7.5]], { fill: FILL.wall });
    seg(svg, P, [0, 7.5], [10, 7.5], { 'stroke-dasharray': '8 6', 'stroke-width': 2 }); seg(svg, P, [5, 7.5], [5, 11], { 'stroke-dasharray': '5 5', 'stroke-width': 2 });
    const [rx, ry] = P(5, 7.5); svgEl('path', { d: `M${rx} ${ry - 10} h10 v10`, fill: 'none', stroke: INK, 'stroke-width': 1.6 }, svg);
    svgTxt(svg, ...P(5, 0).map((v, i) => v + [0, 22][i]), '10 ft'); svgTxt(svg, ...P(0, 3.75).map((v, i) => v + [-32, 6][i]), '7½ ft');
    svgTxt(svg, ...P(5, 9.2).map((v, i) => v + [30, 6][i]), '3½ ft', { 'font-size': 16 });
  }
}
{ // Example 3: the arched window
  const s = 4, svg = figSVG('u3l9-fig-ex3', 36 * s + 110, 66 * s + 50);
  if (svg) {
    const P = planP(70, 66 * s + 18, s), [x0, y0] = P(0, 0), [x1, y1] = P(36, 48), rp = 18 * s;
    svgEl('path', { d: `M${x0} ${y0} H${x1} V${y1} A${rp} ${rp} 0 0 0 ${x0} ${y1} Z`, fill: FILL.glass, stroke: BR, 'stroke-width': 4 }, svg);
    svgEl('line', { x1: x0, y1, x2: x1, y2: y1, stroke: INK, 'stroke-width': 2, 'stroke-dasharray': '8 6' }, svg);
    svgTxt(svg, (x0 + x1) / 2, y0 + 22, '36 in'); svgTxt(svg, x0 - 32, (y0 + y1) / 2 + 6, '48 in');
  }
}
{ // Example 4(b): the backyard
  const s = 17, svg = figSVG('u3l9-fig-ex4b', 15 * s + 100, 12 * s + 56);
  if (svg) {
    const P = planP(20, 12 * s + 22, s);
    poly(svg, P, rectPts([0, 0, 15, 12]), { fill: FILL.sod });
    poly(svg, P, rectPts([0, 7.5, 6, 12]), { fill: '#fff', 'stroke-width': 2.5 }); svgTxt(svg, ...P(3, 9.75).map((v, i) => v + [0, 6][i]), 'deck', { 'font-size': 16 });
    const [cx, cy] = P(10.5, 4.5); svgEl('circle', { cx, cy, r: 1.5 * s, fill: '#fff', stroke: BR, 'stroke-width': 2.5 }, svg); svgTxt(svg, cx, cy + 5, 'bed', { 'font-size': 14 });
    svgTxt(svg, ...P(7.5, 0).map((v, i) => v + [0, 22][i]), '15 m'); svgTxt(svg, ...P(15, 6).map((v, i) => v + [30, 6][i]), '12 m');
    svgTxt(svg, ...P(3, 7.5).map((v, i) => v + [0, 18][i]), '6 m', { 'font-size': 15 }); svgTxt(svg, ...P(6, 9.75).map((v, i) => v + [26, 5][i]), '4.5 m', { 'font-size': 15 });
    svgTxt(svg, cx, cy + 1.5 * s + 18, '3 m across', { 'font-size': 15 });
  }
}
{ // Example 5: Owen's wall
  const s = 24, svg = figSVG('u3l9-fig-ex5', 12 * s + 70, 8 * s + 44);
  if (svg) {
    const P = planP(50, 8 * s + 12, s);
    poly(svg, P, rectPts([0, 0, 12, 8]), { fill: FILL.paint });
    poly(svg, P, rectPts([1.5, 0, 4.5, 20 / 3]), { fill: '#fff', 'stroke-width': 2.5 }); svgTxt(svg, ...P(3, 3.3).map((v, i) => v + [0, 6][i]), 'door', { 'font-size': 16 });
    poly(svg, P, rectPts([7, 3, 11, 6.5]), { fill: '#fff', 'stroke-width': 2.5 }); svgTxt(svg, ...P(9, 4.75).map((v, i) => v + [0, 6][i]), 'window', { 'font-size': 16 });
    svgTxt(svg, ...P(6, 0).map((v, i) => v + [0, 22][i]), '12 ft'); svgTxt(svg, ...P(0, 4).map((v, i) => v + [-26, 6][i]), '8 ft');
  }
}
function pondFig(id, d, cell) { const svg = figSVG(id, d.W * cell + 8, d.H * cell + 8); if (!svg) return; gridSVG(svg, d, 4, 4, cell, { sw: 2.6 }); }
pondFig('u3l9-fig-ex6', GRIDS.e6, 36); pondFig('u3l9-fig-ex7', GRIDS.e7, 32);
{ // Example 8: the skating oval
  const s = 6.4, svg = figSVG('u3l9-fig-ex8', 60 * s + 40, 20 * s + 40);
  if (svg) {
    const X0 = 20 + 10 * s, Y0 = 8, r = 10 * s, L = 40 * s;
    svgEl('path', { d: `M${X0} ${Y0} H${X0 + L} A${r} ${r} 0 0 1 ${X0 + L} ${Y0 + 2 * r} H${X0} A${r} ${r} 0 0 1 ${X0} ${Y0} Z`, fill: '#e3f1fb', stroke: '#3c6e9a', 'stroke-width': 3 }, svg);
    svgEl('path', { d: `M${X0} ${Y0} V${Y0 + 2 * r} M${X0 + L} ${Y0} V${Y0 + 2 * r}`, stroke: INK, 'stroke-width': 2, 'stroke-dasharray': '7 5' }, svg);
    svgTxt(svg, X0 + L / 2, Y0 + 2 * r + 24, '40 m'); svgTxt(svg, X0 + 30, Y0 + r + 6, '20 m');
  }
}

/* ============ Stand Up Break! — composite areas at the whiteboards ============ */
{
  const lFig = (W, H, cw, ch, u) => {
    const s = Math.min(240 / W, 170 / H), ox = 56, oy = 20 + H * s;
    const P = (x, y) => `${(ox + x * s).toFixed(1)},${(oy - y * s).toFixed(1)}`;
    const pts = [[0, 0], [W, 0], [W, H - ch], [W - cw, H - ch], [W - cw, H], [0, H]].map(([x, y]) => P(x, y)).join(' ');
    const t = (x, y, str, dx, dy) => `<text x="${(ox + x * s + dx).toFixed(1)}" y="${(oy - y * s + dy).toFixed(1)}" font-size="17" font-weight="700" text-anchor="middle" fill="#1c2230">${str}</text>`;
    return `<svg viewBox="0 0 ${W * s + 120} ${H * s + 60}" width="${W * s + 120}" height="${H * s + 60}"><polygon points="${pts}" fill="#efe6d6" stroke="#6e4a1c" stroke-width="3"/>`
      + t(W / 2, 0, `${W} ${u}`, 0, 22) + t(0, H / 2, `${H} ${u}`, -30, 6) + t((W - cw) / 2, H, `${W - cw} ${u}`, 0, -8) + t(W, (H - ch) / 2, `${H - ch} ${u}`, 32, 6) + '</svg>';
  };
  const r1 = (v) => rnd(v, 1), r2 = (v) => rnd(v, 2).toFixed(2);
  standup('u3l9', {
    intro: 'Sketch the shape, split it (or cut out the hole), and show every step. Check with a second way if you have time.',
    levels: {
      BEG: (r) => { // an L-shaped room
        const u = r.pick(['m', 'ft']), W = r.int(8, 16), H = r.int(6, 12), cw = r.int(2, W - 4), ch = r.int(2, H - 3);
        const A1 = (W - cw) * H, A2 = cw * (H - ch), A = A1 + A2;
        return { text: `An <b>L-shaped ${r.pick(['room', 'deck', 'patio', 'kitchen floor', 'garden bed', 'parking lot'])}</b>. All the corners are square. Find the missing sides, then the area of the floor.`, q: '', fig: lFig(W, H, cw, ch, u),
          a: [`\\text{missing: }${W}-${W - cw}=${cw}\\text{ ${u}},\\ ${H}-${H - ch}=${ch}\\text{ ${u}}`, `${W - cw}\\times${H}=${A1},\\quad ${cw}\\times${H - ch}=${A2}`, `A=${A1}+${A2}=${A}\\text{ ${u}}^2`, `\\text{Check: }${W}\\times${H}-${cw}\\times${ch}=${A}\\ \\checkmark`] };
      },
      PRG: (r) => r.pick([
        () => { // a yard with a round pool
          const L = r.int(12, 25), Wd = r.int(8, 18), d = r.pick([3, 4, 5, 6, 2.5, 3.6]), rr = d / 2, C = Math.PI * rr * rr, A = L * Wd - C;
          return { text: `A backyard is <b>${L} m by ${Wd} m</b>. A round pool <b>${d} m across</b> is in it. The rest is lawn. Find the area of the lawn, to the nearest hundredth.`, q: '',
            a: [`\\text{Yard: }${L}\\times${Wd}=${L * Wd}\\text{ m}^2`, `\\text{Pool: }r=${d}\\div2=${rr},\\ \\pi\\times${rr}^2=${rnd(C, 4)}\\ldots`, `\\text{Lawn: }${L * Wd}-${rnd(C, 4)}\\ldots\\approx${r2(A)}\\text{ m}^2`] };
        },
        () => { // a stage: rectangle + semicircle
          const w = r.pick([6, 8, 10, 12, 7]), dp = r.int(3, 7), rr = w / 2, S = Math.PI * rr * rr / 2, A = w * dp + S;
          return { text: `A stage floor is a rectangle <b>${w} m wide</b> and <b>${dp} m deep</b>, with a semicircle across the ${w} m front. Find the area, to the nearest tenth.`, q: '',
            a: [`\\text{Rectangle: }${w}\\times${dp}=${w * dp}\\text{ m}^2`, `\\text{Semicircle: }r=${rr},\\ \\tfrac12\\times\\pi\\times${rr}^2=${rnd(S, 3)}\\ldots`, `A=${w * dp}+${rnd(S, 3)}\\ldots\\approx${r1(A).toFixed(1)}\\text{ m}^2`] };
        }
      ])(),
      MAS: (r) => { // a wall with a door and a window, two coats
        const L = r.int(10, 16), H = r.pick([8, 9]), ww = r.pick([3, 4, 5]), wh = r.pick([[3.5, '3 ft 6 in'], [4, '4 ft'], [2.5, '2 ft 6 in'], [4.5, '4 ft 6 in']]);
        const wall = L * H, door = 20, win = ww * wh[0], P = wall - door - win, two = 2 * P, cans = Math.ceil(two / 100 - 1e-9);
        return { text: `A wall is <b>${L} ft long</b> and <b>${H} ft high</b>. It has a door <b>3 ft by 6 ft 8 in</b> and a window <b>${ww} ft by ${wh[1]}</b>. It gets <b>two coats</b> of paint, and one can covers about <b>100 ft²</b>. How many cans are needed?`, q: '',
          a: [`\\text{Wall: }${L}\\times${H}=${wall}\\text{ ft}^2`, `\\text{Door: }3\\times6\\tfrac23=20,\\ \\text{window: }${ww}\\times${wh[0]}=${win}`, `\\text{Paint: }${wall}-20-${win}=${P}\\text{ ft}^2`, `2\\times${P}=${two},\\ ${two}\\div100=${rnd(two / 100, 2)}\\to${cans}\\text{ cans}`] };
      }
    }
  });
}
