/* Math 10-3 · Unit 3 · Lesson 12 — Unit 3 Review (M1, M2, M3, M4, A1).
 * A review lesson: no practice break; the review assignment is a practice unit test, and (the review is the exception)
 * some of its multiple-choice questions appear as chips in the Full-notes "Spot the trap" explainer.
 * Explainers (Class view unless marked):
 *   ruler    (a ruler in sixteenths: hop the small spaces to read A and B, the gap between them; Sofia's baseboard on an
 *             8 ft and a 10 ft board; Example 1),
 *   convert  (the SI staircase with the decimal point hopping; Liam's height on an inch/centimetre tape; the two
 *             shelves against the wall space; Example 2),
 *   bed      (walk the edge of the garden bed, the half circle, then lay 2.4 m pieces of edging along it; Example 3),
 *   undo     (the formula machine forward, then undone in reverse order, and the check; Example 4),
 *   areas    (the sail as half a rectangle, two flower beds make a rectangle, the rug's radius; Example 5),
 *   units    (Full notes: a square foot cut into 144 square inches, 1 yd² into 9 ft², 1 m² into 10 000 cm²),
 *   room     (Jaspreet's room: whole minus the corner that lifts out, then split and check, then square yards; Ex 6),
 *   prismNet (the chocolate-box net fills the face table, then boxes from 1 m² rounded down; Example 7),
 *   solids   (the can's label unrolls, the tent unfolds, the funnel flattens into a fan; Example 8),
 *   traps    (Full notes: practice-test multiple choice, with the slip behind every wrong choice).
 * Then the figures for the examples and the Stand Up Break (mixed review like the unit test). */
import { h, add, box, tex, svgEl, tween, stamp, stampIn, mountExplainers } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const PI = Math.PI, D = PI / 180;
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const rnd = (v, d = 2) => Math.round((v + (v >= 0 ? 1e-9 : -1e-9)) * 10 ** d) / 10 ** d;
const lerp = (a, b, t) => a + (b - a) * t;
const nT = (v) => { const s = String(v); const [i, d] = s.split('.'); const ii = i.length > 3 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : i; return d != null ? ii + '.' + d : ii; };
const nH = (v) => nT(v).replace(/\\,/g, ' ');
const dots = (v, d = 2) => nT((Math.floor(v * 10 ** d + 1e-7) / 10 ** d).toFixed(d)) + '\\ldots';
const STROKE = '#6e4a1c';
const P = (x, y) => `${x.toFixed(1)} ${y.toFixed(1)}`;
/** modifier classes are written short ('dim red') and get the lesson prefix, so no global class is hit */
const pre = (cls) => cls.split(/\s+/).filter(Boolean).map((c) => 'u3l12-' + c).join(' ');
const svgBox = (stage, W, H, x = 0, y = 0) => add(stage, svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u3l12-svg' }), x, y);
const lab = (stage, html, x, y, cls = '') => add(stage, h('div', 'u3l12-lab ' + pre(cls), html), x, y);
const labC = (stage, html, x, y, cls = '') => lab(stage, html, x, y, 'ctr ' + cls);
const line = (stage, html, x, y, w, cls = '') => hide(add(stage, box(h('div', 'u3l12-ln ' + pre(cls), `<div>${html}</div>`), w, 44), x, y));
const rcpt = (rows) => h('div', 'u3l12-rcpt', rows.map(([k, v, tot]) => `<div class="u3l12-rr${tot ? ' u3l12-rt' : ''}"><span class="u3l12-rk">${k}</span><b>${v || ''}</b></div>`).join(''));
const poly = (parent, pts, o = {}) => svgEl('polygon', Object.assign({ points: pts.map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' '), stroke: STROKE, 'stroke-width': 2.6, 'stroke-linejoin': 'round' }, o), parent);
const fr = (w, n, d) => `${w ? w : ''}\\tfrac{${n}}{${d}}`;

/* ---------- solids (the same drawings as Lesson 3.11) ---------- */
function cylSVG(cx, by, rx, hp, o = {}) {
  const ry = rx * 0.28, top = by - hp, sw = 2.6;
  let s = `<path d="M${P(cx - rx, by)} A${rx} ${ry} 0 0 0 ${P(cx + rx, by)} L${P(cx + rx, top)} A${rx} ${ry} 0 0 1 ${P(cx - rx, top)} Z" fill="${o.body || '#d7dbe0'}" stroke="${STROKE}" stroke-width="${sw}" stroke-linejoin="round"/>`;
  if (o.lid !== 'none') s += `<ellipse cx="${cx}" cy="${top}" rx="${rx}" ry="${ry}" fill="${o.lid || '#eef0f2'}" stroke="${STROKE}" stroke-width="${sw}"/>`;
  return s;
}
const bandD = (cx, by, rx, hp) => { const ry = rx * 0.28, top = by - hp; return `M${P(cx - rx, by)} A${rx} ${ry} 0 0 0 ${P(cx + rx, by)} L${P(cx + rx, top)} A${rx} ${ry} 0 0 1 ${P(cx - rx, top)} Z`; };
function fanD(fx, fy, R, th) {
  th = Math.max(th, 0.002);
  const a1 = PI / 2 - th / 2, a2 = PI / 2 + th / 2;
  const p1 = [fx + R * Math.cos(a1), fy + R * Math.sin(a1)], p2 = [fx + R * Math.cos(a2), fy + R * Math.sin(a2)];
  return { fan: `M${P(fx, fy)} L${P(p1[0], p1[1])} A${R} ${R} 0 ${th > PI ? 1 : 0} 1 ${P(p2[0], p2[1])} Z`, arc: `M${P(p1[0], p1[1])} A${R} ${R} 0 ${th > PI ? 1 : 0} 1 ${P(p2[0], p2[1])}`, p1, p2 };
}
function pyr3D(parent, b, s, o) {
  const H = Math.sqrt(s * s - b * b / 4), g = svgEl('g', {}, parent);
  const base = svgEl('polygon', { fill: o.baseFill || '#e8dcc0', stroke: STROKE, 'stroke-width': 2.4, 'stroke-linejoin': 'round' }, g);
  const NRM = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  const cols = o.cols || ['#9fd0a8', '#c6e6cb', '#9fd0a8', '#c6e6cb'];
  const faces = NRM.map((n, i) => svgEl('polygon', { fill: cols[i], stroke: STROKE, 'stroke-width': 2.4, 'stroke-linejoin': 'round' }, g));
  const phi0 = PI - Math.acos(b / (2 * s));
  const st = { phi: phi0, E: (o.E ?? 28) * D, psi: (o.psi ?? 22) * D, k: o.k, ox: o.ox, oy: o.oy };
  const rot = ([x, y, z]) => { const c = Math.cos(st.psi), sn = Math.sin(st.psi); return [x * c + z * sn, y, -x * sn + z * c]; };
  const proj = (p) => { const [x, y, z] = rot(p); return [st.ox + st.k * x, st.oy - st.k * (y * Math.cos(st.E) + z * Math.sin(st.E))]; };
  const depth = (p) => { const [, y, z] = rot(p); return -z * Math.cos(st.E) + y * Math.sin(st.E); };
  const mid = (i) => [NRM[i][0] * b / 2, 0, NRM[i][1] * b / 2];
  const apex = (i) => { const n = NRM[i], m = mid(i), c = Math.cos(st.phi), sn = Math.sin(st.phi); return [m[0] + s * c * n[0], s * sn, m[2] + s * c * n[1]]; };
  const corners = (i) => { const n = NRM[i], m = mid(i), t = [-n[1], n[0]]; return [[m[0] + t[0] * b / 2, 0, m[2] + t[1] * b / 2], [m[0] - t[0] * b / 2, 0, m[2] - t[1] * b / 2]]; };
  const ps = (pts) => pts.map((p) => proj(p).map((v) => v.toFixed(1)).join(',')).join(' ');
  const update = () => {
    base.setAttribute('points', ps([[-b / 2, 0, -b / 2], [b / 2, 0, -b / 2], [b / 2, 0, b / 2], [-b / 2, 0, b / 2]]));
    const order = faces.map((f, i) => { const [c1, c2] = corners(i), a = apex(i); f.setAttribute('points', ps([c1, c2, a])); return { f, d: depth([(c1[0] + c2[0] + a[0]) / 3, a[1] / 3, (c1[2] + c2[2] + a[2]) / 3]) }; });
    order.sort((p, q) => p.d - q.d).forEach((e) => g.appendChild(e.f));
  };
  update();
  return { g, base, faces, H, st, phi0, proj, mid, apex, corners, update };
}
function arrowH(svg, x1, x2, y, col = '#1c2230') { const g = svgEl('g', {}, svg); g.innerHTML = `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${col}" stroke-width="2.2"/><path d="M${x1 + 8} ${y - 5} L${x1} ${y} L${x1 + 8} ${y + 5} M${x2 - 8} ${y - 5} L${x2} ${y} L${x2 - 8} ${y + 5}" fill="none" stroke="${col}" stroke-width="2.2"/>`; return g; }
function arrowV(svg, x, y1, y2, col = '#1c2230') { const g = svgEl('g', {}, svg); g.innerHTML = `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="${col}" stroke-width="2.2"/><path d="M${x - 5} ${y1 + 8} L${x} ${y1} L${x + 5} ${y1 + 8} M${x - 5} ${y2 - 8} L${x} ${y2} L${x + 5} ${y2 - 8}" fill="none" stroke="${col}" stroke-width="2.2"/>`; return g; }

/** a ruler in inches (sixteenths) into an svg: x0 = position of 0, px per inch, top edge y */
function rulerSVG(svg, x0, pxIn, y, inches, o = {}) {
  const hgt = o.h || 96, g = svgEl('g', {}, svg);
  let s = `<rect x="${x0 - 14}" y="${y}" width="${inches * pxIn + 28}" height="${hgt}" rx="6" fill="#f6e7b8" stroke="${STROKE}" stroke-width="2.5"/>`;
  for (let k = 0; k <= inches * 16; k++) {
    const L = k % 16 === 0 ? 0.62 : k % 8 === 0 ? 0.46 : k % 4 === 0 ? 0.34 : k % 2 === 0 ? 0.24 : 0.15, x = x0 + k * pxIn / 16;
    s += `<line x1="${x.toFixed(1)}" y1="${y}" x2="${x.toFixed(1)}" y2="${(y + L * hgt).toFixed(1)}" stroke="#1c2230" stroke-width="${k % 16 === 0 ? 2.4 : k % 4 === 0 ? 1.7 : 1.2}"/>`;
    if (k % 16 === 0) s += `<text x="${x.toFixed(1)}" y="${y + hgt - 10}" text-anchor="middle" font-size="${o.fs || 22}" font-weight="800" fill="#1c2230">${k / 16}</text>`;
  }
  g.innerHTML = s; return g;
}
function rulerArrow(svg, x, y, name, col = '#c93a33') {
  const g = svgEl('g', {}, svg);
  g.innerHTML = `<line x1="${x}" y1="${y - 46}" x2="${x}" y2="${y - 4}" stroke="${col}" stroke-width="3"/><path d="M${x - 7} ${y - 14} L${x} ${y - 2} L${x + 7} ${y - 14}" fill="${col}" stroke="${col}" stroke-width="2"/><text x="${x}" y="${y - 54}" text-anchor="middle" font-size="22" font-weight="800" fill="${col}">${name}</text>`;
  return g;
}

/* =====================================================================================
 * Example 1: the ruler and the baseboard
 * ===================================================================================== */
const ruler = {
  title: 'Read the ruler, cut the boards',
  height: 400,
  minW: 960,
  choices: [{ sep: 'Example 1:' }, { v: 'ab', label: '(a), (b) The ruler' }, { v: 'cd', label: '(c), (d) Baseboard' }],
  ask: (k) => (k === 'ab' ? 'Example 1(a), (b): read the length at arrows A and B. How far apart are they?'
    : 'Example 1(c), (d): Sofia needs 3 pieces of baseboard, each <b>2¾ ft</b> long. Is one 8 ft piece enough? With a 10 ft piece, how much is left?'),
  make(stage, k, ex) { return k === 'ab' ? rulerAB(stage, ex) : rulerCD(stage, ex); }
};
function rulerAB(stage, ex) {
  const svg = svgBox(stage, 960, 400), x0 = 60, PX = 140, y = 150;
  rulerSVG(svg, x0, PX, y, 6);
  const X = (v) => x0 + v * PX;
  const A = hide(rulerArrow(svg, X(1 + 3 / 16), y, 'A')), B = hide(rulerArrow(svg, X(4 + 10 / 16), y, 'B', '#1f5bd6'));
  A.style.opacity = 1; B.style.opacity = 1;
  const br = hide(svgEl('g', {}, svg)); br.innerHTML = `<rect x="${X(1)}" y="${y}" width="${PX}" height="96" fill="#f4d06a" opacity=".45"/>`;
  const lBr = hide(labC(stage, '1 inch = <b>16</b> small spaces', X(1.5), y + 124, 'tag'));
  const hops = (from, n, col) => { const g = hide(svgEl('g', {}, svg)); let s = ''; for (let i = 0; i < n; i++) { const a = X(from + i / 16), b = X(from + (i + 1) / 16); s += `<path d="M${a} ${y - 2} Q${(a + b) / 2} ${y - 22} ${b} ${y - 2}" fill="none" stroke="${col}" stroke-width="2.2"/>`; } g.innerHTML = s; return g; };
  const hA = hops(1, 3, '#c93a33'), hB = hops(4, 10, '#1f5bd6');
  const lA = hide(labC(stage, `A ${T(`=${fr(1, 3, 16)}`)} in`, X(1 + 3 / 16), y + 130, 'dim red'));
  const lB = hide(labC(stage, `B ${T(`=4\\tfrac{10}{16}=${fr(4, 5, 8)}`)} in`, X(4 + 10 / 16), y + 130, 'dim blue'));
  const gap = hide(arrowH(svg, X(1 + 3 / 16), X(4 + 10 / 16), y + 176, '#12805a'));
  const lG = hide(labC(stage, `${T(`${fr(4, 5, 8)}-${fr(1, 3, 16)}=${fr(4, 10, 16)}-${fr(1, 3, 16)}=${fr(3, 7, 16)}`)} in`, X(2.9), y + 204, 'dim green'));
  return [
    { cap: 'Each inch is cut into <b>16</b> small spaces. The longest marks are the inches, then the halves, quarters, eighths and sixteenths.',
      run: async (c) => { await c.fadeIn(br); await c.fadeIn(lBr); } },
    { cap: `Arrow A: the last number it passed is <b>1</b>. Count the small spaces past 1: <b>3</b>. So A ${T(`=${fr(1, 3, 16)}`)} in.`,
      run: async (c) => { br.style.opacity = 0; lBr.style.opacity = 0; await c.fadeIn(hA); await c.pop(lA); } },
    { cap: `Arrow B: past <b>4</b>, count <b>10</b> spaces. Simplify: ${T(`\\tfrac{10}{16}=\\tfrac58`)}. So B ${T(`=${fr(4, 5, 8)}`)} in.`,
      run: async (c) => { await c.fadeIn(hB); await c.pop(lB); } },
    { cap: `How far apart? Subtract with a common denominator: ${T(`${fr(4, 10, 16)}-${fr(1, 3, 16)}=${fr(3, 7, 16)}`)} in.`,
      run: async (c) => { await c.fadeIn(gap); await c.pop(lG); } }
  ];
}
function rulerCD(stage, ex) {
  const svg = svgBox(stage, 960, 380), x0 = 70, F = 82, pw = 2.75 * F;
  const scale = (y, ft) => { const g = svgEl('g', {}, svg); let s = ''; for (let i = 0; i <= ft; i++) s += `<line x1="${x0 + i * F}" y1="${y}" x2="${x0 + i * F}" y2="${y + 8}" stroke="#6b6457" stroke-width="1.5"/><text x="${x0 + i * F}" y="${y + 24}" text-anchor="middle" font-size="14" fill="#6b6457">${i}</text>`; g.innerHTML = s; return g; };
  const pieces = (y) => [0, 1, 2].map((i) => hide(svgEl('rect', { x: x0 + i * pw, y, width: pw, height: 36, fill: i % 2 ? '#e7c48f' : '#d9a95e', stroke: STROKE, 'stroke-width': 2.2 }, svg)));
  const top = pieces(40);
  const lTot = hide(labC(stage, `${T(`3\\times${fr(2, 3, 4)}=3\\times\\tfrac{11}{4}=\\tfrac{33}{4}=${fr(8, 1, 4)}`)} ft`, x0 + 1.5 * pw, 22, 'dim'));
  const b8 = hide(svgEl('rect', { x: x0, y: 80, width: 8 * F, height: 30, fill: '#f4dcb5', stroke: STROKE, 'stroke-width': 2.2 }, svg));
  const s8 = hide(scale(112, 8));
  const l8 = hide(lab(stage, '8 ft board', x0 + 8 * F + 30, 82, 'small'));
  const over = hide(svgEl('rect', { x: x0 + 8 * F, y: 40, width: 0.25 * F, height: 36, fill: '#c93a33', opacity: 0.75 }, svg));
  const st8 = hide(stamp(stage, 'Not enough', { ok: false, x: x0 + 8 * F + 90, y: 150, rotate: -6 }));
  const b10 = hide(svgEl('rect', { x: x0, y: 250, width: 10 * F, height: 30, fill: '#f4dcb5', stroke: STROKE, 'stroke-width': 2.2 }, svg));
  const s10 = hide(scale(282, 10));
  const low = pieces(212);
  const left = hide(svgEl('rect', { x: x0 + 8.25 * F, y: 212, width: 1.75 * F, height: 36, fill: '#a6e3bf', stroke: '#12805a', 'stroke-width': 2.4 }, svg));
  const lLeft = hide(labC(stage, `${T(`10-${fr(8, 1, 4)}=${fr(9, 4, 4)}-${fr(8, 1, 4)}=${fr(1, 3, 4)}`)} ft left`, x0 + 6.2 * F, 340, 'dim green'));
  return [
    { cap: `3 pieces, each ${T(fr(2, 3, 4))} ft. Multiply with an improper fraction: ${T(`3\\times\\tfrac{11}{4}=\\tfrac{33}{4}=${fr(8, 1, 4)}`)} ft.`,
      run: async (c) => { for (const p of top) await c.fadeIn(p, 250); await c.pop(lTot); } },
    { cap: `Put them on an 8 ft board: ${T(fr(8, 1, 4))} ft is more than 8 ft. One 8 ft piece is <b>not</b> enough.`,
      run: async (c) => { await c.fadeIn(b8); await c.fadeIn(s8); await c.fadeIn(l8); await c.fadeIn(over); await stampIn(c, st8); } },
    { cap: `A 10 ft board instead. Borrow 1 as ${T('\\tfrac44')}: ${T(`10-${fr(8, 1, 4)}=${fr(9, 4, 4)}-${fr(8, 1, 4)}=${fr(1, 3, 4)}`)} ft is left over.`,
      run: async (c) => { await c.fadeIn(b10); await c.fadeIn(s10); for (const p of low) await c.fadeIn(p, 220); await c.fadeIn(left); await c.pop(lLeft); } }
  ];
}

/* =====================================================================================
 * Example 2: the staircase, Liam's height, the shelves
 * ===================================================================================== */
const STEPS = ['km', 'hm', 'dam', 'm', 'dm', 'cm', 'mm'];
const convert = {
  title: 'Convert: the staircase, Liam, the shelves',
  height: 400,
  minW: 960,
  choices: [{ sep: 'Example 2:' }, { v: 'si', label: '(a) SI staircase' }, { v: 'liam', label: '(c) Liam’s height' }, { v: 'sh', label: '(e) Shelves' }],
  ask: (k) => ({ si: 'Example 2(a): 3.2 km = ? m, 65 mm = ? cm, 0.48 m = ? cm', liam: 'Example 2(c): Liam is <b>5′ 11″</b> tall. What is his height in centimetres, to the nearest centimetre?',
    sh: 'Example 2(e): two shelves are <b>3′ 9″</b> and <b>2′ 10″</b> long. Will they fit side by side on a wall space <b>6′ 6″</b> wide?' }[k]),
  make(stage, k, ex) { return k === 'si' ? stairMake(stage, ex) : k === 'liam' ? liamMake(stage, ex) : shelfMake(stage, ex); }
};
function stairMake(stage, ex) {
  const svg = svgBox(stage, 600, 400), SW = 80, SH = 44, X0 = 20, Y0 = 50;
  const pos = (i) => [X0 + i * SW, Y0 + i * SH];
  STEPS.forEach((u, i) => { const [x, y] = pos(i); svgEl('rect', { x, y, width: SW, height: 400 - y - 10, fill: u === 'm' ? '#f4d06a' : i % 2 ? '#f6ead2' : '#efdcb6', stroke: STROKE, 'stroke-width': 2 }, svg); const t = svgEl('text', { x: x + SW / 2, y: y + 30, 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 800, fill: '#4a2c14' }, svg); t.textContent = u; });
  const hopG = (from, to) => {
    const g = hide(svgEl('g', {}, svg)), dir = to > from ? 1 : -1; let s = '';
    for (let i = from; i !== to; i += dir) { const [x1, y1] = pos(i), [x2, y2] = pos(i + dir); const a = [x1 + SW / 2, y1 - 4], b = [x2 + SW / 2, y2 - 4]; s += `<path d="M${a[0]} ${a[1]} Q${(a[0] + b[0]) / 2} ${Math.min(a[1], b[1]) - 30} ${b[0]} ${b[1]}" fill="none" stroke="${dir > 0 ? '#c93a33' : '#1f5bd6'}" stroke-width="2.6"/><text x="${(a[0] + b[0]) / 2}" y="${Math.min(a[1], b[1]) - 20}" text-anchor="middle" font-size="16" font-weight="800" fill="${dir > 0 ? '#c93a33' : '#1f5bd6'}">${dir > 0 ? '×10' : '÷10'}</text>`; }
    g.innerHTML = s; return g;
  };
  const H1 = hopG(0, 3), H2 = hopG(6, 5), H3 = hopG(3, 5);
  const Xl = 608, LW = ex.W - Xl - 12;
  const lTip = hide(lab(stage, 'Each step <b>down</b>: × 10<br>Each step <b>up</b>: ÷ 10', Xl, 20, 'tag'));
  const L1 = line(stage, `3.2 km = ${T('3.2\\times1\\,000')} = <b>3&#8239;200 m</b>`, Xl, 110, LW);
  const L2 = line(stage, `65 mm = ${T('65\\div10')} = <b>6.5 cm</b>`, Xl, 166, LW);
  const L3 = line(stage, `0.48 m = ${T('0.48\\times100')} = <b>48 cm</b>`, Xl, 222, LW);
  return [
    { cap: 'The SI staircase. Each step <b>down</b> to a smaller unit is <b>× 10</b>. Each step <b>up</b> to a bigger unit is <b>÷ 10</b>.', run: async (c) => { await c.fadeIn(lTip); } },
    { cap: `3.2 km to m: <b>3 steps down</b>, so ${T('\\times10\\times10\\times10=\\times1\\,000')}. 3.2 km = <b>3&#8239;200 m</b>.`, run: async (c) => { await c.fadeIn(H1); await c.fadeIn(L1); } },
    { cap: '65 mm to cm: <b>1 step up</b>, so ÷ 10. 65 mm = <b>6.5 cm</b>.', run: async (c) => { H1.style.opacity = 0.25; await c.fadeIn(H2); await c.fadeIn(L2); } },
    { cap: '0.48 m to cm: <b>2 steps down</b>, so × 100. 0.48 m = <b>48 cm</b>.', run: async (c) => { H2.style.opacity = 0.25; await c.fadeIn(H3); await c.fadeIn(L3); } }
  ];
}
function liamMake(stage, ex) {
  const svg = svgBox(stage, 640, 400), base = 380, pin = 4.4, tx = 330;
  // the tape: inches on the left, centimetres on the right
  svgEl('rect', { x: tx - 40, y: base - 76 * pin, width: 80, height: 76 * pin, fill: '#f6e7b8', stroke: STROKE, 'stroke-width': 2 }, svg);
  const tk = svgEl('g', {}, svg); let s = '';
  for (let i = 0; i <= 76; i++) { const y = base - i * pin, L = i % 12 === 0 ? 26 : i % 6 === 0 ? 16 : 8; s += `<line x1="${tx - 40}" y1="${y}" x2="${tx - 40 + L}" y2="${y}" stroke="#1c2230" stroke-width="${i % 12 ? 1 : 2}"/>`; if (i % 12 === 0) s += `<text x="${tx - 48}" y="${y + 6}" text-anchor="end" font-size="16" font-weight="700" fill="#1c2230">${i / 12} ft</text>`; }
  for (let cm = 0; cm <= 190; cm += 2) { const y = base - cm / 2.54 * pin, L = cm % 10 === 0 ? 20 : 8; s += `<line x1="${tx + 40 - L}" y1="${y}" x2="${tx + 40}" y2="${y}" stroke="#1f5bd6" stroke-width="${cm % 10 ? 1 : 1.6}"/>`; if (cm % 20 === 0) s += `<text x="${tx + 48}" y="${y + 6}" font-size="15" font-weight="700" fill="#1f5bd6">${cm}</text>`; }
  tk.innerHTML = s;
  // Liam
  const yH = base - 71 * pin, lx = 150;
  const man = svgEl('g', {}, svg);
  man.innerHTML = `<circle cx="${lx}" cy="${yH + 22}" r="22" fill="#f1c9a5" stroke="${STROKE}" stroke-width="2.5"/><path d="M${lx - 24} ${yH + 2} Q${lx} ${yH - 8} ${lx + 24} ${yH + 8} L${lx + 22} ${yH + 16} Q${lx} ${yH + 6} ${lx - 22} ${yH + 16} Z" fill="#5a3a1c"/>`
    + `<path d="M${lx - 34} ${yH + 56} H${lx + 34} L${lx + 30} ${base - 150} H${lx - 30} Z" fill="#3f7fbf" stroke="${STROKE}" stroke-width="2.5"/><path d="M${lx - 28} ${base - 152} H${lx + 28} L${lx + 24} ${base} H${lx + 4} L${lx} ${base - 110} L${lx - 4} ${base} H${lx - 24} Z" fill="#4a4436" stroke="${STROKE}" stroke-width="2.5"/>`;
  const bar = hide(svgEl('line', { x1: lx - 30, y1: yH, x2: tx + 40, y2: yH, stroke: '#c93a33', 'stroke-width': 3, 'stroke-dasharray': '7 5' }, svg));
  const lIn = hide(lab(stage, `${T('5\\times12+11=71')} in`, tx - 250, yH - 40, 'dim'));
  const lCm = hide(lab(stage, `${T('\\approx180')} cm`, tx + 80, yH - 14, 'dim blue'));
  const Xl = 650, LW = ex.W - Xl - 12;
  const L1 = line(stage, `${T('5\\times12+11=71')} in`, Xl, 30, LW);
  const L2 = line(stage, `${T('71\\times2.54=180.34')} cm`, Xl, 86, LW);
  const L3 = line(stage, 'Liam is about <b>180 cm</b> tall.', Xl, 142, LW, 'big');
  return [
    { cap: `Change 5′ 11″ to inches first: 5 ft = ${T('5\\times12=60')} in, plus 11 in: <b>71 in</b>.`, run: async (c) => { await c.fadeIn(bar); await c.fadeIn(lIn); await c.fadeIn(L1); } },
    { cap: `1 in = 2.54 cm (exact), so multiply: ${T('71\\times2.54=180.34')} cm. Read it on the centimetre side of the tape.`, run: async (c) => { await c.pop(lCm); await c.fadeIn(L2); } },
    { cap: 'To the nearest centimetre: Liam is about <b>180 cm</b> tall. (Centimetres are smaller, so the number is bigger.)', run: async (c) => { await c.fadeIn(L3); } }
  ];
}
function shelfMake(stage, ex) {
  const svg = svgBox(stage, 960, 400), x0 = 60, pi = 10;
  svgEl('rect', { x: x0 - 30, y: 60, width: 78 * pi + 60, height: 230, fill: '#f3ece0' }, svg);
  svgEl('rect', { x: x0 - 30, y: 60, width: 30, height: 230, fill: '#c9b99a', stroke: STROKE, 'stroke-width': 2 }, svg);
  svgEl('rect', { x: x0 + 78 * pi, y: 60, width: 30, height: 230, fill: '#c9b99a', stroke: STROKE, 'stroke-width': 2 }, svg);
  arrowH(svg, x0, x0 + 78 * pi, 320);
  labC(stage, 'wall space 6′ 6″ = 78 in', x0 + 39 * pi, 344, 'dim');
  const s1 = hide(svgEl('rect', { x: x0, y: 170, width: 45 * pi, height: 26, fill: '#d9a95e', stroke: STROKE, 'stroke-width': 2.2 }, svg));
  const s2 = hide(svgEl('rect', { x: x0 + 45 * pi, y: 170, width: 34 * pi, height: 26, fill: '#e7c48f', stroke: STROKE, 'stroke-width': 2.2 }, svg));
  const l1 = hide(labC(stage, '3′ 9″', x0 + 22.5 * pi, 150, 'dim')), l2 = hide(labC(stage, '2′ 10″', x0 + 62 * pi, 150, 'dim'));
  const over = hide(svgEl('rect', { x: x0 + 78 * pi, y: 166, width: pi, height: 34, fill: '#c93a33', opacity: 0.8 }, svg));
  const lOver = hide(lab(stage, '1 in too long', x0 + 78 * pi - 130, 206, 'dim red'));
  const st = hide(stamp(stage, 'Won’t fit', { ok: false, x: 480, y: 250, rotate: -6 }));
  const lSum = hide(labC(stage, '3′ 9″ + 2′ 10″ = 5′ 19″', 300, 100, 'tag'));
  const lReg = hide(labC(stage, '19″ = 12″ + 7″, so 5′ 19″ = <b>6′ 7″</b>', 640, 100, 'tag'));
  return [
    { cap: 'Add the feet and the inches: 3′ 9″ + 2′ 10″ = 5′ 19″.', run: async (c) => { await c.fadeIn(s1); await c.fadeIn(l1); await c.fadeIn(s2); await c.fadeIn(l2); await c.fadeIn(lSum); } },
    { cap: 'The inches part must be less than 12. 19″ = 12″ + 7″, so change 12″ into 1 ft: 5′ 19″ = <b>6′ 7″</b>.', run: async (c) => { await c.fadeIn(lReg); } },
    { cap: 'The wall space is 6′ 6″. The shelves are 6′ 7″: <b>1 inch</b> too long. They will <b>not</b> fit.', run: async (c) => { await c.fadeIn(over); await c.fadeIn(lOver); await stampIn(c, st); } }
  ];
}

/* =====================================================================================
 * Example 3: the garden bed
 * ===================================================================================== */
const bed = {
  title: 'Walk the edge, then buy the edging',
  height: 430,
  minW: 960,
  ask: 'Example 3: a garden bed is a <b>6 m by 3 m</b> rectangle with a half circle on one end. Edging comes in <b>2.4 m</b> pieces at <b>$7.98</b> each. Add 5% GST.',
  make(stage, v, ex) {
    const svg = svgBox(stage, 620, 430), k = 56, x0 = 40, y0 = 40, W = 6 * k, Hh = 3 * k, cx = x0 + W, cy = y0 + Hh / 2, R = Hh / 2;
    svgEl('path', { d: `M${x0} ${y0} H${cx} A${R} ${R} 0 0 1 ${cx} ${y0 + Hh} H${x0} Z`, fill: '#cfe8c8', stroke: '#9aa0ab', 'stroke-width': 2 }, svg);
    svgEl('line', { x1: cx, y1: y0, x2: cx, y2: y0 + Hh, stroke: '#6b6457', 'stroke-width': 2, 'stroke-dasharray': '6 5' }, svg);
    const segs = [`M${x0} ${y0 + Hh} H${cx}`, `M${x0} ${y0} V${y0 + Hh}`, `M${x0} ${y0} H${cx}`].map((d) => hide(svgEl('path', { d, fill: 'none', stroke: '#c27a0e', 'stroke-width': 6, 'stroke-linecap': 'round' }, svg)));
    const arc = hide(svgEl('path', { d: `M${cx} ${y0} A${R} ${R} 0 0 1 ${cx} ${y0 + Hh}`, fill: 'none', stroke: '#1f5bd6', 'stroke-width': 6 }, svg));
    labC(stage, '6 m', x0 + W / 2, y0 + Hh + 18, 'dim'); labC(stage, '3 m', x0 - 2, cy, 'dim');
    const lD = labC(stage, 'd = 3 m', cx - 34, cy, 'small');
    const lArc = hide(lab(stage, `${T('\\pi\\times3\\div2\\approx4.712')} m`, cx - 20, y0 + Hh + 22, 'dim blue'));
    // the edge laid out straight, cut into 2.4 m pieces
    const sk = 22, bx = 40, by = 300;
    const strip = hide(svgEl('rect', { x: bx, y: by, width: 19.712 * sk, height: 16, fill: '#c27a0e' }, svg));
    const lStrip = hide(lab(stage, `perimeter ${T('\\approx19.71')} m`, bx, by - 34, 'small'));
    const pcs = []; for (let i = 0; i < 9; i++) pcs.push(hide(svgEl('rect', { x: bx + i * 2.4 * sk, y: by + 24, width: 2.4 * sk - 2, height: 22, rx: 3, fill: i === 8 ? '#f3c3b8' : '#9fc3ea', stroke: STROKE, 'stroke-width': 1.6 }, svg)));
    const nums = hide(svgEl('g', {}, svg)); nums.innerHTML = pcs.map((p, i) => `<text x="${bx + (i + 0.5) * 2.4 * sk}" y="${by + 41}" text-anchor="middle" font-size="14" font-weight="800" fill="#1c2230">${i + 1}</text>`).join('');
    const st = hide(stamp(stage, '9 pieces', { ok: true, x: bx + 20.5 * sk, y: by + 92, rotate: -6 }));
    const Xl = 630, LW = ex.W - Xl - 12;
    const L1 = line(stage, `Straight: ${T('6+6+3=15')} m`, Xl, 16, LW);
    const L2 = line(stage, `Curved: ${T('\\pi\\times3\\div2\\approx4.712')} m`, Xl, 68, LW);
    const L3 = line(stage, `${T('P\\approx19.712\\approx19.71')} m`, Xl, 120, LW, 'big');
    const L4 = line(stage, `${T('19.712\\div2.4\\approx8.21')} → 9 pieces`, Xl, 172, LW);
    const rc = hide(add(stage, box(rcpt([['9 × $7.98', '$71.82'], ['GST: × 1.05', '+ $3.59'], ['Total', '$75.41', 1]]), LW, 128), Xl, 230));
    return [
      { cap: 'Walk around the edge. The straight sides: <b>6 + 6 + 3 = 15 m</b>. The dashed line is inside the bed, not on the edge.',
        run: async (c) => { for (const sg of segs) await c.fadeIn(sg, 300); await c.fadeIn(L1); } },
      { cap: `The curved edge is half a circle with ${T('d=3')} m: ${T('\\pi d\\div2=\\pi\\times3\\div2\\approx4.712')} m.`,
        run: async (c) => { lD.style.opacity = 0; await c.fadeIn(arc); await c.pop(lArc); await c.fadeIn(L2); } },
      { cap: `Perimeter: ${T('P\\approx15+4.712=19.712\\approx19.71')} m.`, run: async (c) => { await c.fadeIn(strip); await c.fadeIn(lStrip); await c.fadeIn(L3); } },
      { cap: `Edging comes in 2.4 m pieces: ${T('19.712\\div2.4\\approx8.21')}. 8 pieces are a little short, so round <b>up</b>: <b>9 pieces</b>.`,
        run: async (c) => { for (const p of pcs) await c.fadeIn(p, 150); await c.fadeIn(nums); await stampIn(c, st); await c.fadeIn(L4); } },
      { cap: `Cost: ${T('9\\times\\$7.98=\\$71.82')}. With GST: ${T('\\$71.82\\times1.05=\\$75.411\\approx\\$75.41')}.`, run: async (c) => { await c.pop(rc); } }
    ];
  }
};

/* =====================================================================================
 * Example 4: undo the formula
 * ===================================================================================== */
const UD = {
  a: { ask: 'Example 4(a): a rectangular dog run uses <b>32 m</b> of fencing and is <b>9.5 m</b> long. How wide is it? Check.',
    f: 'P=2l+2w', know: 'P=32,\\ l=9.5', v: 'w', fwd: [['\\times2', '2w'], ['+19', '32']], inv: [['-19', '13'], ['\\div2', '6.5']], res: 'w=(32-19)\\div2=6.5', u: 'm',
    chk: '2(9.5)+2(6.5)=19+13=32', capF: '× 2, then + 2l (that is + 19)', capU: '− 19 first, then ÷ 2' },
  b: { ask: 'Example 4(b): the edge of a round table top is <b>4.4 m</b> around. Find its diameter, to the nearest hundredth.',
    f: 'C=\\pi d', know: 'C=4.4', v: 'd', fwd: [['\\times\\pi', '4.4']], inv: [['\\div\\pi', '1.40']], res: 'd=4.4\\div\\pi\\approx1.4006\\approx1.40', u: 'm',
    chk: '\\pi\\times1.40\\approx4.40', capF: '× π', capU: '÷ π' },
  c: { ask: 'Example 4(c): a rectangular patio has an area of <b>22.5 m²</b>. It is <b>3 m</b> wide. How long is it?',
    f: 'A=lw', know: 'A=22.5,\\ w=3', v: 'l', fwd: [['\\times3', '22.5']], inv: [['\\div3', '7.5']], res: 'l=22.5\\div3=7.5', u: 'm',
    chk: '7.5\\times3=22.5', capF: '× w (that is × 3)', capU: '÷ 3' }
};
const undo = {
  title: 'Undo the formula, in reverse order',
  height: 380,
  minW: 960,
  choices: [{ sep: 'Example 4:' }, { v: 'a', label: '(a) Dog run' }, { v: 'b', label: '(b) Table top' }, { v: 'c', label: '(c) Patio' }],
  ask: (k) => UD[k].ask,
  make(stage, k, ex) {
    const d = UD[k], BW = 120, GAP = 150, n = d.fwd.length;
    const nodeX = (i) => 40 + i * (BW + GAP);
    const node = (html, x, y, cls) => hide(add(stage, box(h('div', 'u3l12-node ' + pre(cls), `<div>${html}</div>`), BW, 56), x, y));
    const arrow = (x, y, html, col) => { const g = hide(svgEl('svg', { width: GAP, height: 70, viewBox: `0 0 ${GAP} 70`, class: 'u3l12-svg' })); add(stage, g, x, y); g.innerHTML = `<line x1="8" y1="40" x2="${GAP - 12}" y2="40" stroke="${col}" stroke-width="3"/><path d="M${GAP - 22} 32 L${GAP - 10} 40 L${GAP - 22} 48" fill="none" stroke="${col}" stroke-width="3"/>`; const l = hide(h('div', 'u3l12-op', T(html))); l.style.color = col; add(stage, l, x + GAP / 2, y + 12); return [g, l]; };
    const lF = hide(lab(stage, `${T(d.f)} &nbsp; We know ${T(d.know)}. Find ${T(d.v)}.`, 40, 8, 'tag'));
    const rowF = hide(lab(stage, 'What the formula does:', 40, 58, 'small'));
    const fN = [node(T(d.v), nodeX(0), 86, 'var')]; const fA = [];
    d.fwd.forEach(([op, val], i) => { fA.push(arrow(nodeX(i) + BW, 80, op, '#9a6a24')); fN.push(node(T(val), nodeX(i + 1), 86, i === n - 1 ? 'known' : '')); });
    const rowU = hide(lab(stage, 'Undo it, in reverse order:', 40, 178, 'small'));
    const uN = [node(T(d.fwd[n - 1][1]), nodeX(0), 206, 'known')]; const uA = [];
    d.inv.forEach(([op, val], i) => { uA.push(arrow(nodeX(i) + BW, 200, op, '#1f5bd6')); uN.push(node(T(val), nodeX(i + 1), 206, i === n - 1 ? 'ans' : '')); });
    const lRes = hide(lab(stage, `${T(d.res)} ${d.u}`, 40, 290, 'tag'));
    const st = hide(stamp(stage, 'Check ✓', { ok: true, x: 830, y: 232, rotate: -6 }));
    const lChk = hide(lab(stage, T(d.chk), 600, 300, 'dim'));
    return [
      { cap: `The formula is ${T(d.f)}. We know ${T(d.know)}. We want ${T(d.v)}.`, run: async (c) => { await c.fadeIn(lF); } },
      { cap: `Read what the formula does to ${T(d.v)}: ${d.capF}.`,
        run: async (c) => { await c.fadeIn(rowF); await c.pop(fN[0]); for (let i = 0; i < n; i++) { await c.fadeIn(fA[i][0]); await c.fadeIn(fA[i][1]); await c.pop(fN[i + 1]); } } },
      { cap: `To get ${T(d.v)} back, undo each step in <b>reverse order</b>: ${d.capU}.`,
        run: async (c) => { await c.fadeIn(rowU); await c.pop(uN[0]); for (let i = 0; i < n; i++) { await c.fadeIn(uA[i][0]); await c.fadeIn(uA[i][1]); await c.pop(uN[i + 1]); } } },
      { cap: `${T(d.res)} ${d.u}.`, run: async (c) => { await c.fadeIn(lRes); } },
      { cap: `Check: put it back in the formula. ${T(d.chk)} ✓`, run: async (c) => { await stampIn(c, st); await c.fadeIn(lChk); } }
    ];
  }
};

/* =====================================================================================
 * Example 5: where the area formulas come from
 * ===================================================================================== */
const areas = {
  title: 'Half a rectangle, two beds, a radius',
  height: 400,
  minW: 960,
  choices: [{ sep: 'Example 5:' }, { v: 'a', label: '(a) Sail' }, { v: 'b', label: '(b) Flower bed' }, { v: 'c', label: '(c) Round rug' }],
  ask: (k) => ({ a: 'Example 5(a): a triangle-shaped sail has a base of <b>2.4 m</b> and a height of <b>3.5 m</b>. Find its area.',
    b: 'Example 5(b): a trapezoid flower bed has parallel sides <b>3½ ft</b> and <b>5½ ft</b>, <b>2 ft</b> apart. Find its area.',
    c: 'Example 5(c): a round rug is <b>1.8 m</b> across. Find its area, to the nearest hundredth.' }[k]),
  make(stage, k, ex) {
    const Xl = 600, LW = ex.W - Xl - 12;
    if (k === 'a') {
      const svg = svgBox(stage, 580, 400), s = 95, x0 = 100, y0 = 360, bw = 2.4 * s, hh = 3.5 * s;
      const ghost = hide(poly(svg, [[x0, y0], [x0 + bw, y0], [x0 + bw, y0 - hh], [x0, y0 - hh]], { fill: '#fbe9c4', 'stroke-dasharray': '7 6' }));
      const other = hide(poly(svg, [[x0 + bw, y0], [x0 + bw, y0 - hh], [x0, y0 - hh]], { fill: '#f6d38b' }));
      poly(svg, [[x0, y0], [x0 + bw, y0], [x0, y0 - hh]], { fill: '#bcd9f0' });
      svgEl('path', { d: `M${x0 + 16} ${y0} V${y0 - 16} H${x0}`, fill: 'none', stroke: '#1c2230', 'stroke-width': 2 }, svg);
      labC(stage, '2.4 m', x0 + bw / 2, y0 + 20, 'dim'); labC(stage, '3.5 m', x0 - 36, y0 - hh / 2, 'dim');
      const lR = hide(labC(stage, `${T('2.4\\times3.5=8.4')} m²`, x0 + bw + 120, y0 - hh / 2, 'dim'));
      const L1 = line(stage, `Rectangle: ${T('2.4\\times3.5=8.4')} m²`, Xl, 30, LW);
      const L2 = line(stage, `Sail: ${T('\\tfrac12\\times8.4=4.2')} m²`, Xl, 86, LW, 'big');
      return [
        { cap: 'The sail is a triangle with a square corner: base <b>2.4 m</b>, height <b>3.5 m</b>.', run: async (c) => { await c.sleep(200); } },
        { cap: `Draw the rectangle around it: ${T('2.4\\times3.5=8.4')} m².`, run: async (c) => { await c.fadeIn(ghost); await c.fadeIn(lR); await c.fadeIn(L1); } },
        { cap: `The diagonal cuts the rectangle into 2 equal triangles. The sail is half: ${T('A=\\tfrac12bh=\\tfrac12\\times2.4\\times3.5=4.2')} m².`, run: async (c) => { await c.fadeIn(other); await c.fadeIn(L2); } }
      ];
    }
    if (k === 'b') {
      const svg = svgBox(stage, 600, 400), s = 58, x0 = 40, y0 = 200;
      const pts = [[0, 0], [5.5, 0], [3.5, 2], [0, 2]], cen = [2.25, 1];
      const toPx = ([x, y]) => [x0 + x * s, y0 - y * s];
      poly(svg, pts.map(toPx), { fill: '#cfe8c8' });
      labC(stage, `${T('5\\tfrac12')} ft`, x0 + 2.75 * s, y0 + 20, 'dim'); labC(stage, `${T('3\\tfrac12')} ft`, x0 + 1.75 * s, y0 - 2 * s - 20, 'dim'); labC(stage, '2 ft', x0 - 22, y0 - s, 'dim');
      const cp = hide(poly(svg, pts.map(toPx), { fill: '#f6d38b' }));
      const at = (t) => { const a = PI * t, ox = lerp(cen[0] + 1, 9 - cen[0], t), oy = lerp(cen[1] - 3.2, 2 - cen[1], t); return pts.map(([x, y]) => { const dx = x - cen[0], dy = y - cen[1]; return toPx([ox + dx * Math.cos(a) - dy * Math.sin(a), oy + dx * Math.sin(a) + dy * Math.cos(a)]); }); };
      const setCp = (t) => cp.setAttribute('points', at(t).map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' '));
      setCp(0);
      const brk = hide(arrowH(svg, x0, x0 + 9 * s, y0 + 48, '#12805a'));
      const lB = hide(labC(stage, `${T('3\\tfrac12+5\\tfrac12=9')} ft`, x0 + 4.5 * s, y0 + 72, 'dim green'));
      const L1 = line(stage, `Rectangle: ${T('(3.5+5.5)\\times2=18')} ft²`, Xl, 30, LW);
      const L2 = line(stage, `Bed: ${T('\\tfrac12\\times18=9')} ft²`, Xl, 86, LW, 'big');
      return [
        { cap: 'The flower bed is a trapezoid: parallel sides <b>3½ ft</b> and <b>5½ ft</b>, <b>2 ft</b> apart.', run: async (c) => { await c.sleep(200); } },
        { cap: 'Make a copy, turn it upside down, and slide it next to the first one.', run: async (c) => { cp.style.opacity = 1; await tween(c, 1600, (t) => setCp(t)); } },
        { cap: `Together they make a rectangle ${T('3\\tfrac12+5\\tfrac12=9')} ft long and 2 ft high: ${T('9\\times2=18')} ft².`, run: async (c) => { await c.fadeIn(brk); await c.fadeIn(lB); await c.fadeIn(L1); } },
        { cap: `One bed is half of that: ${T('A=\\tfrac12(a+b)h=\\tfrac12\\times9\\times2=9')} ft².`, run: async (c) => { await c.fadeIn(L2); } }
      ];
    }
    const svg = svgBox(stage, 580, 400), cx = 250, cy = 200, R = 160;
    const circ = svgEl('circle', { cx, cy, r: R, fill: '#e9d6f2', stroke: STROKE, 'stroke-width': 2.6 }, svg);
    const dl = svgEl('line', { x1: cx - R, y1: cy, x2: cx + R, y2: cy, stroke: '#1f5bd6', 'stroke-width': 4 }, svg);
    const ldl = labC(stage, 'd = 1.8 m', cx - R / 2, cy + 20, 'dim blue');
    const rl = hide(svgEl('line', { x1: cx, y1: cy, x2: cx + R, y2: cy, stroke: '#c93a33', 'stroke-width': 5 }, svg));
    const lr = hide(labC(stage, 'r = 0.9 m', cx + R / 2, cy - 22, 'dim red'));
    const sq = hide(svgEl('rect', { x: cx, y: cy - R, width: R, height: R, fill: '#f4d06a', opacity: 0.6, stroke: STROKE, 'stroke-width': 2 }, svg));
    const lsq = hide(labC(stage, `${T('r^2')}`, cx + R / 2, cy - R / 2, 'dim'));
    const L1 = line(stage, `${T('r=1.8\\div2=0.9')} m`, Xl, 30, LW);
    const L2 = line(stage, `${T('A=\\pi\\times0.9^2\\approx2.544\\,69')}`, Xl, 86, LW);
    const L3 = line(stage, `${T('A\\approx2.54')} m²`, Xl, 142, LW, 'big');
    return [
      { cap: 'The rug is 1.8 m <b>across</b>: that is the diameter.', run: async (c) => { await c.sleep(200); } },
      { cap: `${T('\\pi r^2')} uses the <b>radius</b>: ${T('r=1.8\\div2=0.9')} m.`, run: async (c) => { dl.style.opacity = 0.3; ldl.style.opacity = 0.3; await c.fadeIn(rl); await c.fadeIn(lr); await c.fadeIn(L1); } },
      { cap: `${T('r^2')} is a square ${T('0.9')} m by ${T('0.9')} m. The circle holds a bit more than 3 of them: ${T('\\pi\\approx3.14')}.`, run: async (c) => { await c.fadeIn(sq); await c.fadeIn(lsq); } },
      { cap: `${T('A=\\pi r^2=\\pi\\times0.9^2\\approx2.544\\,69\\approx2.54')} m².`, run: async (c) => { await c.anim(circ, [{ fill: '#e9d6f2' }, { fill: '#d3b4e6' }], 400); await c.fadeIn(L2); await c.fadeIn(L3); } }
    ];
  }
};

/* =====================================================================================
 * Full notes: why 144, 9 and 10 000
 * ===================================================================================== */
const UN = {
  ft: { big: '1 ft²', side: '12 in', n: 12, grid: 12, small: '1 in²', mult: '12\\times12=144', eq: '1\\text{ ft}^2=144\\text{ in}^2', ex: '9\\text{ ft}^2=9\\times144=1\\,296\\text{ in}^2' },
  yd: { big: '1 yd²', side: '3 ft', n: 3, grid: 3, small: '1 ft²', mult: '3\\times3=9', eq: '1\\text{ yd}^2=9\\text{ ft}^2', ex: '45\\text{ ft}^2=45\\div9=5\\text{ yd}^2' },
  m: { big: '1 m²', side: '100 cm', n: 100, grid: 10, small: '100 cm² (10 cm by 10 cm)', mult: '100\\times100=10\\,000', eq: '1\\text{ m}^2=10\\,000\\text{ cm}^2', ex: '4.2\\text{ m}^2=4.2\\times10\\,000=42\\,000\\text{ cm}^2' }
};
const units = {
  title: 'Cut the big square into small squares',
  height: 380,
  minW: 960,
  choices: [{ v: 'ft', label: '1 ft² = ? in²' }, { v: 'yd', label: '1 yd² = ? ft²' }, { v: 'm', label: '1 m² = ? cm²' }],
  ask: (k) => `Example 5(d): ${({ ft: '9 ft² = ? in²', yd: '45 ft² = ? yd²', m: '4.2 m² = ? cm²' })[k]}`,
  make(stage, k, ex) {
    const d = UN[k], S = 320, x0 = 84, y0 = 30;
    const svg = svgBox(stage, 460, 380);
    svgEl('rect', { x: x0, y: y0, width: S, height: S, fill: '#fbe9c4', stroke: STROKE, 'stroke-width': 3 }, svg);
    labC(stage, d.side, x0 + S / 2, y0 + S + 18, 'dim'); labC(stage, d.side, x0 - 36, y0 + S / 2, 'dim');
    const gl = svgEl('g', {}, svg);
    const one = hide(svgEl('rect', { x: x0, y: y0, width: S / d.grid, height: S / d.grid, fill: '#c93a33', opacity: 0.75 }, svg));
    const Xl = 480, LW = ex.W - Xl - 12;
    const L1 = line(stage, `${d.big}: a square ${d.side} by ${d.side}`, Xl, 30, LW);
    const L2 = line(stage, `${T(d.mult)}`, Xl, 86, LW);
    const L3 = line(stage, `${T(d.eq)}`, Xl, 142, LW, 'big');
    const L4 = line(stage, `${T(d.ex)}`, Xl, 220, LW);
    return [
      { cap: `${d.big} is a square <b>${d.side}</b> long and <b>${d.side}</b> wide.`, run: async (c) => { await c.fadeIn(L1); } },
      { cap: `Cut it into small squares: ${d.n} rows of ${d.n}.${k === 'm' ? ' (Only every 10th line is drawn: each square you see is 10 cm by 10 cm.)' : ''}`,
        run: async (c) => { await tween(c, 1200, (t) => { const n = Math.round(t * (d.grid - 1)); let s = ''; for (let i = 1; i <= n; i++) { const p = i * S / d.grid; s += `<line x1="${x0 + p}" y1="${y0}" x2="${x0 + p}" y2="${y0 + S}" stroke="${STROKE}" stroke-width="1.2"/><line x1="${x0}" y1="${y0 + p}" x2="${x0 + S}" y2="${y0 + p}" stroke="${STROKE}" stroke-width="1.2"/>`; } gl.innerHTML = s; }, (t) => t); await c.fadeIn(one); } },
      { cap: `It holds ${T(d.mult)} small squares. So ${T(d.eq)}, not ${d.n}.`, run: async (c) => { await c.fadeIn(L2); await c.fadeIn(L3); } },
      { cap: `Example 5(d): ${T(d.ex)}.`, run: async (c) => { await c.fadeIn(L4); } }
    ];
  }
};

/* =====================================================================================
 * Example 6: the L-shaped room
 * ===================================================================================== */
const room = {
  title: 'Lift out the corner, then split it',
  height: 430,
  minW: 960,
  ask: 'Example 6: an L-shaped room, <b>18 ft</b> by <b>15 ft</b> with a corner missing (top side 12 ft, right side 11 ft). Carpet is <b>$38.50</b> per square yard, sold in whole square yards.',
  make(stage, v, ex) {
    const svg = svgBox(stage, 600, 430), s = 19, x0 = 70, y0 = 380;
    const px = ([x, y]) => [x0 + x * s, y0 - y * s];
    const whole = hide(poly(svg, [[0, 0], [18, 0], [18, 15], [0, 15]].map(px), { fill: '#fbe9c4', 'stroke-dasharray': '7 6' }));
    const L = poly(svg, [[0, 0], [18, 0], [18, 11], [12, 11], [12, 15], [0, 15]].map(px), { fill: '#d7e6f5' });
    const cut = hide(poly(svg, [[12, 11], [18, 11], [18, 15], [12, 15]].map(px), { fill: '#f3a59a' }));
    const lCut = hide(labC(stage, `${T('6\\times4=24')} ft²`, px([15, 13])[0] + 40, px([15, 13])[1] - 44, 'dim red'));
    const A = hide(poly(svg, [[0, 0], [12, 0], [12, 15], [0, 15]].map(px), { fill: '#bfe3c6' })), B = hide(poly(svg, [[12, 0], [18, 0], [18, 11], [12, 11]].map(px), { fill: '#f6d38b' }));
    const lA = hide(labC(stage, `${T('12\\times15=180')}`, px([6, 7.5])[0], px([6, 7.5])[1], 'dim')), lB = hide(labC(stage, `${T('6\\times11=66')}`, px([15, 3])[0], px([15, 3])[1], 'dim'));
    labC(stage, '18 ft', px([9, 0])[0], y0 + 18, 'dim'); labC(stage, '15 ft', x0 - 34, px([0, 7.5])[1], 'dim');
    labC(stage, '12 ft', px([6, 15])[0], px([6, 15])[1] - 18, 'dim'); labC(stage, '11 ft', px([18, 5.5])[0] + 36, px([18, 5.5])[1], 'dim');
    const Xl = 610, LW = ex.W - Xl - 12;
    const L1 = line(stage, `Whole: ${T('18\\times15=270')} ft²`, Xl, 16, LW);
    const L2 = line(stage, `Corner: ${T('6\\times4=24')} ft²`, Xl, 68, LW);
    const L3 = line(stage, `${T('270-24=246')} ft²`, Xl, 120, LW, 'big');
    const L4 = line(stage, `Check: ${T('180+66=246')} ✓`, Xl, 172, LW);
    const rc = hide(add(stage, box(rcpt([[`246 ÷ 9 ≈ 27.33 yd²`, ''], ['buy 28 yd² × $38.50', ''], ['Before tax', '$1&#8239;078.00', 1]]), LW, 128), Xl, 236));
    return [
      { cap: `Pretend the room is a whole rectangle: ${T('18\\times15=270')} ft².`, run: async (c) => { svg.insertBefore(whole, L); await c.fadeIn(whole); await c.fadeIn(L1); } },
      { cap: `The missing corner is ${T('18-12=6')} ft by ${T('15-11=4')} ft: ${T('6\\times4=24')} ft². Lift it out.`,
        run: async (c) => { await c.fadeIn(cut); await c.anim(cut, [{ transform: 'none' }, { transform: 'translate(34px, -40px)' }], 700); await c.fadeIn(lCut); await c.fadeIn(L2); } },
      { cap: `Area: whole minus the corner, ${T('270-24=246')} ft².`, run: async (c) => { await c.fadeIn(L3); } },
      { cap: `Check another way: split it with an up-and-down line. ${T('12\\times15=180')} and ${T('6\\times11=66')}: ${T('180+66=246')} ✓`,
        run: async (c) => { cut.style.opacity = 0.25; lCut.style.opacity = 0; await c.fadeIn(A); await c.fadeIn(B); await c.fadeIn(lA); await c.fadeIn(lB); await c.fadeIn(L4); } },
      { cap: `Carpet is sold in whole square yards: ${T('246\\div9\\approx27.33')}, so buy <b>28 yd²</b>. ${T('28\\times\\$38.50=\\$1\\,078.00')}.`, run: async (c) => { await c.pop(rc); } }
    ];
  }
};

/* =====================================================================================
 * Example 7: the chocolate-box net
 * ===================================================================================== */
const prismNet = {
  title: 'From the net to the face table',
  height: 420,
  minW: 960,
  ask: 'Example 7: the net of a chocolate box (a triangular prism). Triangle ends: sides 5, 5, 8 cm, height 3 cm. The box is 25 cm long.',
  make(stage, v, ex) {
    const svg = svgBox(stage, 540, 420), s = 16, xL = 100, yT = 40, L = 25 * s, a = 5 * s, b = 8 * s, tr = 3 * s;
    const r1 = poly(svg, [[xL, yT], [xL + L, yT], [xL + L, yT + a], [xL, yT + a]], { fill: '#f6ead2' });
    const r2 = poly(svg, [[xL, yT + a], [xL + L, yT + a], [xL + L, yT + a + b], [xL, yT + a + b]], { fill: '#f6ead2' });
    const r3 = poly(svg, [[xL, yT + a + b], [xL + L, yT + a + b], [xL + L, yT + 2 * a + b], [xL, yT + 2 * a + b]], { fill: '#f6ead2' });
    const t1 = poly(svg, [[xL, yT + a], [xL - tr, yT + a + b / 2], [xL, yT + a + b]], { fill: '#f6ead2' });
    const t2 = poly(svg, [[xL + L, yT + a], [xL + L + tr, yT + a + b / 2], [xL + L, yT + a + b]], { fill: '#f6ead2' });
    svgEl('line', { x1: xL - tr, y1: yT + a + b / 2, x2: xL, y2: yT + a + b / 2, stroke: '#1c2230', 'stroke-width': 1.5, 'stroke-dasharray': '4 4' }, svg);
    labC(stage, '25 cm', xL + L / 2, yT - 16, 'dim'); labC(stage, '5 cm', xL + L / 2, yT + a / 2, 'small'); labC(stage, '8 cm', xL + L / 2, yT + a + b / 2, 'small'); labC(stage, '5 cm', xL + L / 2, yT + 1.5 * a + b, 'small');
    labC(stage, '3 cm', xL - tr - 30, yT + a + b / 2, 'small');
    const tbl = add(stage, box(h('div', 'u3l12-ftab', '<div class="u3l12-fr u3l12-fh"><span class="u3l12-fk">Faces</span><b>Area</b></div>'
      + ['2 triangles', 'bottom 8 by 25', '2 sides 5 by 25', 'Surface area'].map((n, i) => `<div class="u3l12-fr${i === 3 ? ' u3l12-fs' : ''}"><span class="u3l12-fk">${n}</span><b class="u3l12-fv" data-i="${i}"></b></div>`).join('')), ex.W - 572, 250), 560, 16);
    const cells = [...tbl.querySelectorAll('.u3l12-fv')];
    const vals = ['2\\times\\tfrac12\\times8\\times3=24', '8\\times25=200', '2\\times5\\times25=250', '24+200+250=474'];
    cells.forEach((cel, i) => { cel.innerHTML = T(vals[i]) + ' cm²'; cel.style.opacity = 0; });
    const st = hide(stamp(stage, '21 boxes', { ok: true, x: 760, y: 360, rotate: -6 }));
    const lB = hide(lab(stage, `${T('10\\,000\\div474\\approx21.1')} → round <b>down</b>`, 560, 286, 'tag'));
    const fill = (c, els, col) => Promise.all(els.map((e) => c.anim(e, [{ fill: '#f6ead2' }, { fill: col }], 400)));
    return [
      { cap: 'The net: 3 rectangles in a row, each 25 cm long, and a triangle on each end of the middle one.', run: async (c) => { await c.sleep(200); } },
      { cap: `The 2 triangles: base 8 cm, height 3 cm. ${T('2\\times\\tfrac12\\times8\\times3=24')} cm².`, run: async (c) => { await fill(c, [t1, t2], '#f4d06a'); await c.fadeIn(cells[0]); } },
      { cap: `The bottom: 8 cm by 25 cm. ${T('8\\times25=200')} cm².`, run: async (c) => { await fill(c, [r2], '#bcd9f0'); await c.fadeIn(cells[1]); } },
      { cap: `The 2 sides: 5 cm by 25 cm each. ${T('2\\times5\\times25=250')} cm².`, run: async (c) => { await fill(c, [r1, r3], '#bfe3c6'); await c.fadeIn(cells[2]); } },
      { cap: `Add every face: ${T('\\text{SA}=24+200+250=474')} cm².`, run: async (c) => { await c.fadeIn(cells[3]); } },
      { cap: `1 m² = 10&#8239;000 cm²: ${T('10\\,000\\div474\\approx21.1')}. A part of a box is not a box, so round <b>down</b>: <b>21 boxes</b>.`, run: async (c) => { await c.fadeIn(lB); await stampIn(c, st); } }
    ];
  }
};

/* =====================================================================================
 * Example 8: unroll, unfold, flatten
 * ===================================================================================== */
const solids = {
  title: 'Unroll the can, unfold the tent, flatten the funnel',
  height: 430,
  minW: 960,
  choices: [{ sep: 'Example 8:' }, { v: 'can', label: '(a), (b) Soup can' }, { v: 'tent', label: '(c) Tent' }, { v: 'fun', label: '(d) Funnel' }],
  ask: (k) => ({ can: 'Example 8(a), (b): a soup can has a radius of <b>3.8 cm</b> and a height of <b>11 cm</b>. Find the area of the label, then the surface area of the whole can.',
    tent: 'Example 8(c): a tent is a square pyramid with a <b>2.2 m by 2.2 m</b> floor and a slant height of <b>1.8 m</b>. How much fabric is in the 4 sides and the floor?',
    fun: 'Example 8(d): a funnel is a cone with a radius of <b>6 cm</b> and a slant height of <b>15 cm</b>, with no base. Find the area of plastic.' }[k]),
  make(stage, k, ex) { return k === 'can' ? canMake(stage, ex) : k === 'tent' ? tentMake(stage, ex) : funMake(stage, ex); }
};
function canMake(stage, ex) {
  const r = 3.8, hh = 11, C = 2 * PI * r, side = C * hh, circ = 2 * PI * r * r;
  const svg = svgBox(stage, 640, 430), cx = 120, by = 380, rx = 66, hp = rx * 2 * hh / (2 * r), top = by - hp, ry = rx * 0.28;
  const can = svgEl('g', {}, svg); can.innerHTML = cylSVG(cx, by, rx, hp, { lid: 'none' });
  const id = 'u3l12c' + Math.floor(Math.random() * 1e9), defs = svgEl('defs', {}, svg), cp = svgEl('clipPath', { id }, defs);
  const cr = svgEl('rect', { x: cx - rx - 4, y: top - 30, width: 2 * rx + 8, height: hp + 60 }, cp);
  const band = svgEl('path', { d: bandD(cx, by, rx, hp), fill: '#2f8a5a', stroke: STROKE, 'stroke-width': 2.6, 'clip-path': `url(#${id})` }, svg);
  const lid = svgEl('ellipse', { cx, cy: top, rx, ry, fill: '#eef0f2', stroke: STROKE, 'stroke-width': 2.6 }, svg);
  const k = 380 / Math.max(C, (hh + 4 * r) * 1.0), Lp = C * k, Hp = hh * k, Rp = r * k, x0 = 230, y0 = 30 + 2 * Rp + 10, xm = x0 + Lp / 2;
  const flat = svgEl('rect', { x: x0, y: y0, width: 0, height: Hp, fill: '#2f8a5a', stroke: STROKE, 'stroke-width': 2.6 }, svg);
  const lL = hide(labC(stage, `${T('2\\pi r\\approx23.9')} cm`, xm, y0 + 22, 'dim blue'));
  const lH = hide(lab(stage, '11 cm', x0 + 8, y0 + Hp / 2 - 14, 'dim'));
  const lS = hide(labC(stage, `${T(dots(side))} cm²`, xm, y0 + Hp - 26, 'area'));
  const cT = hide(svgEl('circle', { cx: xm, cy: y0 - Rp - 4, r: Rp, fill: '#fbe3b5', stroke: STROKE, 'stroke-width': 2.4 }, svg));
  const cB = hide(svgEl('circle', { cx: xm, cy: y0 + Hp + Rp + 4, r: Rp, fill: '#fbe3b5', stroke: STROKE, 'stroke-width': 2.4 }, svg));
  const lC1 = hide(labC(stage, `${T(dots(circ / 2))}`, xm, y0 - Rp - 4, 'area')), lC2 = hide(labC(stage, `${T(dots(circ / 2))}`, xm, y0 + Hp + Rp + 4, 'area'));
  const Xl = 650, LW = ex.W - Xl - 12;
  const L1 = line(stage, `Label: ${T(`2\\pi\\times3.8\\times11\\approx262.6`)}`, Xl, 16, LW);
  const L2 = line(stage, `Circles: ${T('2\\pi\\times3.8^2\\approx90.7')}`, Xl, 68, LW);
  const L3 = line(stage, `${T('\\text{SA}\\approx353.4')} cm²`, Xl, 120, LW, 'big');
  return [
    { cap: 'Peel the label off and lay it flat: a <b>rectangle</b>, as tall as the can.',
      run: async (c) => { await tween(c, 1400, (t) => { cr.setAttribute('x', cx - rx - 4 + t * (2 * rx + 8)); cr.setAttribute('width', (1 - t) * (2 * rx + 8)); flat.setAttribute('width', t * Lp); }); await c.fadeIn(lH); } },
    { cap: `Its length goes once around the can: ${T('2\\pi r=2\\times\\pi\\times3.8\\approx23.9')} cm.`, run: async (c) => { await c.fadeIn(lL); } },
    { cap: `(a) Label: ${T(`2\\pi rh=2\\times\\pi\\times3.8\\times11=${dots(side)}`)}, about <b>262.6 cm²</b>.`, run: async (c) => { await c.pop(lS); await c.fadeIn(L1); } },
    { cap: `(b) The top and bottom: ${T(`2\\pi r^2=2\\times\\pi\\times3.8^2=${dots(circ)}`)} cm².`, run: async (c) => { lid.style.opacity = 0.35; await c.pop(cT); await c.pop(cB); await c.fadeIn(lC1); await c.fadeIn(lC2); await c.fadeIn(L2); } },
    { cap: `${T(`\\text{SA}=${dots(side)}+${dots(circ)}\\approx353.4`)} cm².`, run: async (c) => { await c.fadeIn(L3); } }
  ];
}
function tentMake(stage, ex) {
  const b = 2.2, s = 1.8, kk = 330 / (b + 2 * s), ox = 290, oy = 220;
  const svg = svgBox(stage, 580, 430);
  const py = pyr3D(svg, b, s, { k: kk, ox, oy });
  const kC = Math.min(110, 230 / Math.max(b, py.H * 1.1)), oyC = 316; py.st.k = kC; py.st.oy = oyC; py.update();
  const sl = svgEl('line', { stroke: '#c93a33', 'stroke-width': 4, 'stroke-linecap': 'round' }, svg);
  const place = () => { const m = py.proj(py.mid(0)), a = py.proj(py.apex(0)); sl.setAttribute('x1', m[0]); sl.setAttribute('y1', m[1]); sl.setAttribute('x2', a[0]); sl.setAttribute('y2', a[1]); };
  place();
  const redraw = () => { py.update(); place(); };
  const lS = hide(lab(stage, `${T('s')} = 1.8 m`, 20, 20, 'dim red'));
  const fin = { phi: 0, E: 90 * D, psi: 0, k: kk, oy };
  const save = { ...py.st }; Object.assign(py.st, fin);
  const cB = py.proj([0, 0, 0]); const cT = [0, 1, 2, 3].map((i) => { const m = py.mid(i), a = py.apex(i); return py.proj([(m[0] + a[0]) / 2, 0, (m[2] + a[2]) / 2]); });
  Object.assign(py.st, save); redraw();
  const lBase = hide(labC(stage, `${T('4.84')}`, cB[0], cB[1], 'area'));
  const lTri = cT.map((p) => hide(labC(stage, `${T('1.98')}`, p[0], p[1], 'area')));
  const Xl = 600, LW = ex.W - Xl - 12;
  const L1 = line(stage, `Floor: ${T('2.2\\times2.2=4.84')} m²`, Xl, 16, LW);
  const L2 = line(stage, `4 sides: ${T('4\\times\\tfrac12\\times2.2\\times1.8=7.92')}`, Xl, 68, LW);
  const L3 = line(stage, `${T('\\text{SA}=4.84+7.92=12.76')} m²`, Xl, 120, LW, 'big');
  return [
    { cap: 'The tent: a square floor, 2.2 m on each side, and 4 triangle sides with a slant height of <b>1.8 m</b> (red).', run: async (c) => { await c.fadeIn(lS); } },
    { cap: 'Unfold the 4 sides flat around the floor, then look from straight above.',
      run: async (c) => {
        await tween(c, 1600, (t) => { py.st.phi = lerp(py.phi0, 0, t); py.st.k = lerp(kC, kk, t); py.st.oy = lerp(oyC, oy, t); redraw(); });
        const E0 = py.st.E, p0 = py.st.psi; await tween(c, 1000, (t) => { py.st.E = lerp(E0, 90 * D, t); py.st.psi = lerp(p0, 0, t); redraw(); });
      } },
    { cap: `The floor: ${T('2.2\\times2.2=4.84')} m².`, run: async (c) => { await c.pop(lBase); await c.fadeIn(L1); } },
    { cap: `Each side: ${T('\\tfrac12\\times2.2\\times1.8=1.98')} m². All 4: ${T('4\\times1.98=7.92')} m².`, run: async (c) => { for (const l of lTri) await c.pop(l, 240); await c.fadeIn(L2); } },
    { cap: `Fabric: ${T('4.84+7.92=12.76')} m².`, run: async (c) => { await c.fadeIn(L3); } }
  ];
}
function funMake(stage, ex) {
  const r = 6, s = 15, th = 2 * PI * r / s, side = PI * r * s;
  const svg = svgBox(stage, 640, 430), k = 15, cx = 120, rimY = 80, rp = r * k, Hc = Math.sqrt(s * s - r * r) * k;
  const cone = svgEl('g', {}, svg);
  cone.innerHTML = `<path d="M${P(cx - rp, rimY)} L${P(cx, rimY + Hc)} L${P(cx + rp, rimY)} Z" fill="#bfe3c6" stroke="${STROKE}" stroke-width="2.6" stroke-linejoin="round"/><rect x="${cx - 6}" y="${rimY + Hc - 4}" width="12" height="40" fill="#bfe3c6" stroke="${STROKE}" stroke-width="2"/><ellipse cx="${cx}" cy="${rimY}" rx="${rp}" ry="${rp * 0.28}" fill="#e6f4e8" stroke="${STROKE}" stroke-width="2.6"/>`;
  labC(stage, '6 cm', cx + rp / 2, rimY - rp * 0.28 - 16, 'dim'); labC(stage, '15 cm', cx + rp / 2 + 40, rimY + Hc / 2, 'dim red');
  const fxx = 420, fyy = 40, R = s * 14;
  const fan = hide(svgEl('path', { d: fanD(fxx, fyy, R, 0).fan, fill: '#bfe3c6', stroke: STROKE, 'stroke-width': 2.6, 'stroke-linejoin': 'round' }, svg));
  const arc = hide(svgEl('path', { d: fanD(fxx, fyy, R, th).arc, fill: 'none', stroke: '#1f5bd6', 'stroke-width': 6 }, svg));
  const lArc = hide(labC(stage, `curved edge ${T('=2\\pi r')}`, fxx, fyy + R + 24, 'small blue'));
  const lF = hide(labC(stage, `${T(`\\pi rs=${dots(side)}`)}`, fxx, fyy + R * 0.6, 'area'));
  const Xl = 650, LW = ex.W - Xl - 12;
  const L1 = line(stage, 'No base: curved side only', Xl, 16, LW);
  const L2 = line(stage, `${T('\\pi\\times6\\times15\\approx282.7')} cm²`, Xl, 68, LW, 'big');
  return [
    { cap: 'The funnel has <b>no base</b> (the top is open and we ignore the spout). Only the curved side has plastic.', run: async (c) => { await c.fadeIn(L1); } },
    { cap: 'Cut it along a slant line and flatten it: a <b>fan</b>. Its straight edges are the slant height, 15 cm.',
      run: async (c) => { await c.anim(cone, [{ opacity: 1 }, { opacity: 0.35 }], 300); fan.style.opacity = 1; await tween(c, 1500, (t) => fan.setAttribute('d', fanD(fxx, fyy, R, th * t).fan)); await c.fadeIn(arc); await c.fadeIn(lArc); } },
    { cap: `The fan’s area: ${T(`\\pi rs=\\pi\\times6\\times15=${dots(side)}`)}, about <b>282.7 cm²</b>.`, run: async (c) => { await c.pop(lF); await c.fadeIn(L2); } }
  ];
}

/* =====================================================================================
 * Full notes: practice-test multiple choice, spot the trap (review questions 17, 18, 19, 23)
 * ===================================================================================== */
const TR = {
  q17: { q: 'Question 17: 3′ 8″ + 2′ 7″ is equal to', opts: ['6′ 3″', '6′ 5″', '5′ 3″', '6′ 15″'], work: '3′ 8″ + 2′ 7″ = 5′ 15″, and 15″ = 1′ 3″, so <b>6′ 3″</b>.',
    why: [null, 'took away 10 in for the foot, not 12', 'forgot to add the carried foot', 'added the foot but kept 15 in (it must be under 12)'] },
  q18: { q: 'Question 18: a rug covers 6 yd². How many square feet is that?', opts: ['54 ft²', '18 ft²', '72 ft²', '2 ft²'], work: `1 yd² = 3 × 3 = 9 ft², so ${T('6\\times9=54')} ft².`,
    why: [null, 'used 3: that is for length, not area', 'used 12: that is for inches', 'divided by 3'] },
  q19: { q: 'Question 19: a round patio is 10 m across. Its area is about', opts: ['78.5 m²', '31.4 m²', '314.2 m²', '15.7 m²'], work: `${T('r=5')}: ${T('\\pi\\times5^2\\approx78.5')} m².`,
    why: [null, 'used π × 10: that is the circumference, a length', 'used the diameter as the radius: π × 10²', 'did π × 5 and forgot to square the radius'] },
  q23: { q: 'Question 23: a cone has a radius of 3 cm and a slant height of 5 cm. Its total surface area (with the base) is about', opts: ['75.4 cm²', '47.1 cm²', '28.3 cm²', '207.3 cm²'],
    work: `${T('\\pi\\times3^2+\\pi\\times3\\times5=28.27\\ldots+47.12\\ldots\\approx75.4')} cm².`, why: [null, 'found only the curved side, πrs', 'found only the base, πr²', 'used the diameter, 6, as the radius'] }
};
const traps = {
  title: 'Spot the trap',
  height: 360,
  minW: 960,
  choices: [{ sep: 'Practice test:' }, { v: 'q17', label: 'Q17' }, { v: 'q18', label: 'Q18' }, { v: 'q19', label: 'Q19' }, { v: 'q23', label: 'Q23' }],
  ask: (k) => TR[k].q,
  make(stage, k, ex) {
    const d = TR[k], W = (ex.W - 60) / 2;
    const cards = d.opts.map((o, i) => add(stage, box(h('div', 'u3l12-mc', `<b class="u3l12-mcl">${'ABCD'[i]}</b><span class="u3l12-mco">${o}</span><span class="u3l12-mcw"></span>`), W, 64), 20 + (i % 2) * (W + 20), 16 + Math.floor(i / 2) * 140));
    const whys = d.why.map((w, i) => (w ? hide(lab(stage, `✗ ${w}`, 20 + (i % 2) * (W + 20), 86 + Math.floor(i / 2) * 140, 'why')) : null));
    const lW = hide(lab(stage, `Work it out first: ${d.work}`, 20, 300, 'tag'));
    const steps = [{ cap: `Work it out <b>before</b> you look at the choices: ${d.work}`, run: async (c) => { await c.fadeIn(lW); } }];
    [1, 2, 3].forEach((i) => steps.push({ cap: `${'ABCD'[i]} (${d.opts[i]}) is a trap: it ${d.why[i]}.`, run: async (c) => { cards[i].classList.add('u3l12-no'); await c.fadeIn(whys[i]); } }));
    steps.push({ cap: `The answer is <b>A, ${d.opts[0]}</b>.`, run: async (c) => { cards[0].classList.add('u3l12-yes'); await c.anim(cards[0], [{ transform: 'scale(1)' }, { transform: 'scale(1.05)' }, { transform: 'scale(1)' }], 420); } });
    return steps;
  }
};

mountExplainers({ ruler, convert, bed, undo, areas, units, room, prismNet, solids, traps });

/* =====================================================================================
 * Static figures for the examples
 * ===================================================================================== */
function figSVG(id, W, H) { const host = document.getElementById(id); if (!host) return null; const s = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, class: 'u3l12-fsvg' }); host.appendChild(s); return s; }
function txt(svg, x, y, s, o = {}) { const t = svgEl('text', Object.assign({ x, y, 'font-size': 18, 'font-weight': 700, fill: '#1c2230', 'text-anchor': 'middle' }, o), svg); t.textContent = s; return t; }
{
  let s = figSVG('u3l12-fig-ruler', 940, 170);
  if (s) { rulerSVG(s, 40, 144, 64, 6, { h: 96 }); rulerArrow(s, 40 + 1.1875 * 144, 64, 'A'); rulerArrow(s, 40 + 4.625 * 144, 64, 'B', '#1f5bd6'); }
  s = figSVG('u3l12-fig-bed', 330, 190);
  if (s) { const k = 40, x0 = 30, y0 = 30; svgEl('path', { d: `M${x0} ${y0} H${x0 + 6 * k} A${1.5 * k} ${1.5 * k} 0 0 1 ${x0 + 6 * k} ${y0 + 3 * k} H${x0} Z`, fill: '#cfe8c8', stroke: STROKE, 'stroke-width': 2.6 }, s);
    svgEl('line', { x1: x0 + 6 * k, y1: y0, x2: x0 + 6 * k, y2: y0 + 3 * k, stroke: '#6b6457', 'stroke-width': 2, 'stroke-dasharray': '6 5' }, s); txt(s, x0 + 3 * k, y0 + 3 * k + 24, '6 m'); txt(s, x0 - 4, y0 + 1.5 * k + 6, '3 m', { 'text-anchor': 'end' }); }
  s = figSVG('u3l12-fig-sail', 220, 200);
  if (s) { const k = 48, x0 = 70, y0 = 180; poly(s, [[x0, y0], [x0 + 2.4 * k, y0], [x0, y0 - 3.5 * k]], { fill: '#bcd9f0' }); svgEl('path', { d: `M${x0 + 12} ${y0} V${y0 - 12} H${x0}`, fill: 'none', stroke: '#1c2230', 'stroke-width': 2 }, s); txt(s, x0 + 1.2 * k, y0 + 20, '2.4 m', { 'font-size': 16 }); txt(s, x0 - 8, y0 - 1.75 * k, '3.5 m', { 'font-size': 16, 'text-anchor': 'end' }); txt(s, 160, 40, '(a)', { 'font-size': 15, fill: '#6b6457' }); }
  s = figSVG('u3l12-fig-trap', 300, 160);
  if (s) { const k = 40, x0 = 50, y0 = 120; poly(s, [[x0, y0], [x0 + 5.5 * k, y0], [x0 + 3.5 * k, y0 - 2 * k], [x0, y0 - 2 * k]], { fill: '#cfe8c8' }); svgEl('path', { d: `M${x0 + 10} ${y0} V${y0 - 10} H${x0}`, fill: 'none', stroke: '#1c2230', 'stroke-width': 2 }, s);
    txt(s, x0 + 2.75 * k, y0 + 22, '5½ ft', { 'font-size': 16 }); txt(s, x0 + 1.75 * k, y0 - 2 * k - 8, '3½ ft', { 'font-size': 16 }); txt(s, x0 - 8, y0 - k + 6, '2 ft', { 'font-size': 16, 'text-anchor': 'end' }); txt(s, 280, 30, '(b)', { 'font-size': 15, fill: '#6b6457' }); }
  s = figSVG('u3l12-fig-room', 300, 260);
  if (s) { const k = 12.5, x0 = 50, y0 = 225; const p = ([x, y]) => [x0 + x * k, y0 - y * k]; poly(s, [[0, 0], [18, 0], [18, 11], [12, 11], [12, 15], [0, 15]].map(p), { fill: '#d7e6f5' });
    txt(s, x0 + 9 * k, y0 + 22, '18 ft', { 'font-size': 16 }); txt(s, x0 - 8, y0 - 7.5 * k, '15 ft', { 'font-size': 16, 'text-anchor': 'end' }); txt(s, x0 + 6 * k, y0 - 15 * k - 8, '12 ft', { 'font-size': 16 }); txt(s, x0 + 18 * k + 6, y0 - 5.5 * k, '11 ft', { 'font-size': 16, 'text-anchor': 'start' }); }
  s = figSVG('u3l12-fig-net', 330, 220);
  if (s) { const k = 9.5, xL = 56, yT = 20, L = 25 * k, a = 5 * k, b = 8 * k, tr = 3 * k;
    [[yT, a], [yT + a, b], [yT + a + b, a]].forEach(([y, hh]) => poly(s, [[xL, y], [xL + L, y], [xL + L, y + hh], [xL, y + hh]], { fill: '#f6ead2' }));
    poly(s, [[xL, yT + a], [xL - tr, yT + a + b / 2], [xL, yT + a + b]], { fill: '#f6ead2' }); poly(s, [[xL + L, yT + a], [xL + L + tr, yT + a + b / 2], [xL + L, yT + a + b]], { fill: '#f6ead2' });
    txt(s, xL + L / 2, yT + a / 2 + 6, '5 cm', { 'font-size': 15 }); txt(s, xL + L / 2, yT + a + b / 2 + 6, '8 cm', { 'font-size': 15 }); txt(s, xL + L / 2, yT + 1.5 * a + b + 6, '5 cm', { 'font-size': 15 }); txt(s, xL + L / 2, yT + 2 * a + b + 22, '25 cm', { 'font-size': 15 }); txt(s, xL - tr - 2, yT + a + b / 2 + 5, '3 cm', { 'font-size': 13, 'text-anchor': 'end' }); }
  s = figSVG('u3l12-fig-can', 200, 190);
  if (s) { const g = svgEl('g', {}, s); g.innerHTML = cylSVG(80, 160, 44, 122, { body: '#2f8a5a' }); svgEl('line', { x1: 80, y1: 38, x2: 124, y2: 38, stroke: '#c93a33', 'stroke-width': 2.5 }, s); txt(s, 102, 30, '3.8 cm', { 'font-size': 15 }); txt(s, 160, 104, '11 cm', { 'font-size': 15 }); txt(s, 80, 186, '(a), (b) soup can', { 'font-size': 14, fill: '#6b6457', 'font-weight': 600 }); }
  s = figSVG('u3l12-fig-tent', 220, 190);
  if (s) { const py = pyr3D(s, 2.2, 1.8, { k: 58, ox: 100, oy: 140, E: 22, psi: 20 }); const m = py.proj(py.mid(0)), a = py.proj(py.apex(0)); svgEl('line', { x1: m[0], y1: m[1], x2: a[0], y2: a[1], stroke: '#c93a33', 'stroke-width': 2.5 }, s);
    txt(s, m[0], m[1] + 22, '2.2 m', { 'font-size': 15 }); txt(s, lerp(m[0], a[0], 0.5) - 40, lerp(m[1], a[1], 0.5), '1.8 m', { 'font-size': 15, fill: '#c93a33' }); txt(s, 110, 186, '(c) a tent', { 'font-size': 14, fill: '#6b6457', 'font-weight': 600 }); }
  s = figSVG('u3l12-fig-funnel', 200, 190);
  if (s) { const g = svgEl('g', {}, s); g.innerHTML = `<path d="M50 30 L100 150 L150 30 Z" fill="#bfe3c6" stroke="${STROKE}" stroke-width="2.6" stroke-linejoin="round"/><rect x="95" y="146" width="10" height="20" fill="#bfe3c6" stroke="${STROKE}" stroke-width="2"/><ellipse cx="100" cy="30" rx="50" ry="13" fill="#e6f4e8" stroke="${STROKE}" stroke-width="2.6"/><line x1="100" y1="30" x2="150" y2="30" stroke="#c93a33" stroke-width="2.5"/>`;
    txt(s, 126, 22, '6 cm', { 'font-size': 15 }); txt(s, 160, 100, '15 cm', { 'font-size': 15, fill: '#c93a33' }); txt(s, 100, 186, '(d) a funnel', { 'font-size': 14, fill: '#6b6457', 'font-weight': 600 }); }
}

/* =====================================================================================
 * Stand Up Break! — mixed review like the unit test
 * ===================================================================================== */
{
  const r1 = (v) => nT(rnd(v, 1).toFixed(1)), r2 = (v) => nT(rnd(v, 2).toFixed(2));
  const ftin = (inches) => `${Math.floor(inches / 12)}′ ${inches % 12}″`;
  standup('u3l12', {
    intro: 'Show every step. Units on every answer. Round only at the end.',
    levels: {
      BEG: (r) => r.pick([
        () => { const m = r.pick([1.25, 2.4, 3.75, 0.85, 4.6]), mm = r.pick([45, 120, 365, 85]), km = r.pick([1.5, 2.25, 0.6]);
          return { text: `Convert: (a) <b>${m} m</b> to cm &nbsp; (b) <b>${mm} mm</b> to cm &nbsp; (c) <b>${km} km</b> to m`, q: '',
            a: [`\\text{(a) }${m}\\times100=${nT(rnd(m * 100, 2))}\\text{ cm}`, `\\text{(b) }${mm}\\div10=${nT(rnd(mm / 10, 2))}\\text{ cm}`, `\\text{(c) }${km}\\times1\\,000=${nT(rnd(km * 1000, 2))}\\text{ m}`] }; },
        () => { const a = r.int(26, 60), b = r.int(26, 60), t = a + b;
          return { text: `Two boards are <b>${ftin(a)}</b> and <b>${ftin(b)}</b> long. What is their total length in feet and inches?`, q: '',
            a: [`${Math.floor(a / 12) + Math.floor(b / 12)}'\\,${(a % 12) + (b % 12)}''`, `=${Math.floor(t / 12)}'\\,${t % 12}''`] }; }
      ])(),
      PRG: (r) => r.pick([
        () => { const l = r.int(4, 9), w = r.int(2, 5), d = w, P = 2 * l + w + PI * d / 2;
          return { text: `A patio is a rectangle <b>${l} m</b> by <b>${w} m</b> with a half circle on one short side. Find the perimeter to the nearest hundredth.`, q: '',
            a: [`\\text{Straight: }${l}+${l}+${w}=${2 * l + w}`, `\\text{Curved: }\\pi\\times${d}\\div2=${dots(PI * d / 2, 3)}`, `P\\approx${r2(P)}\\text{ m}`] }; },
        () => { const P = r.pick([30, 36, 42, 48, 54]), l = r.pick([8.5, 9.5, 10, 11.5, 12]), w = (P - 2 * l) / 2;
          return w > 0 ? { text: `A rectangle has a perimeter of <b>${P} m</b> and a length of <b>${l} m</b>. Find its width. Check your answer.`, q: '',
            a: [`w=(P-2l)\\div2`, `w=(${P}-${nT(2 * l)})\\div2=${nT(rnd(w, 2))}\\text{ m}`, `\\text{Check: }2(${l})+2(${nT(rnd(w, 2))})=${P}\\ ✓`] }
            : { text: `A circle has a circumference of <b>${P} cm</b>. Find its diameter to the nearest tenth.`, q: '', a: [`d=${P}\\div\\pi\\approx${r1(P / PI)}\\text{ cm}`] }; }
      ])(),
      MAS: (r) => r.pick([
        () => { const L = r.int(14, 22), W = r.int(11, 16), cl = r.int(3, 6), cw = r.int(3, 5), A = L * W - cl * cw, yd = Math.ceil(A / 9 - 1e-9), pr = r.pick([29.5, 34.99, 41.25]);
          return { text: `An L-shaped room is a <b>${L} ft</b> by <b>${W} ft</b> rectangle with a <b>${cl} ft</b> by <b>${cw} ft</b> corner missing. Carpet is <b>$${pr.toFixed(2)}</b> per yd², sold in whole yd². Find the cost.`, q: '',
            a: [`${L}\\times${W}-${cl}\\times${cw}=${A}\\text{ ft}^2`, `${A}\\div9=${dots(A / 9)}\\to${yd}\\text{ yd}^2`, `${yd}\\times\\$${pr.toFixed(2)}=\\$${nT((yd * pr).toFixed(2))}`] }; },
        () => { const d = r.pick([1.2, 1.6, 2, 2.4, 3]), hh = r.pick([1.5, 2, 2.5, 3]), rr = d / 2, top = PI * rr * rr, sd = 2 * PI * rr * hh, n = Math.ceil((top + sd) / 10 - 1e-9);
          return { text: `A water tank is a cylinder <b>${d} m</b> across and <b>${hh} m</b> tall. Paint the top and the side (not the bottom). One can covers 10 m². How many cans?`, q: '',
            a: [`r=${nT(rr)}`, `\\pi\\times${nT(rr)}^2+2\\pi\\times${nT(rr)}\\times${hh}=${dots(top + sd)}\\text{ m}^2`, `\\div10\\to${n}\\text{ cans (round up)}`] }; }
      ])()
    }
  });
}
