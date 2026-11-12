/* Math 10-3 · Unit 5 · Lesson 1 — Spatial Puzzles: Tangrams and Pentominoes.
 * Explainers: counting squares by a systematic list (Example 1 and the pattern), covering the tangram pieces with small
 * triangles (Example 2 areas, fractions, the 20 cm card), two small triangles that slide into a square / triangle /
 * parallelogram (Example 3), filling the silhouettes (Example 4, pieces fly in), turn-or-flip tests (Example 5(b)),
 * one pentomino's looks (Full notes), the systematic list of all 12 (Example 6), a 3-D folding machine (Example 7),
 * why a 2 by 2 block never folds (Full notes), and Owen's P / a closed cube (Example 9).
 * Also the hands-on tools (Geo.tangram free play and silhouettes; Geo.pentomino all 12 and the 3 by 5 tiling; the
 * folding machine, built here), the static figures, the Math History box (Tetris) and the Stand Up Break.
 * The 3-D fold (class Folder) is local to this lesson: geo.js has no folding nets. */
import { h, add, box, tex, svgEl, tween, stamp, stampIn, liveCtx, mountExplainers } from '../blocks.js';
import { Geo } from '../geo.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const INK = '#1c2230', LINE = '#3a4254', BR = '#6e4a1c', AMB = '#e2a63a', RED = '#c93a33', GRN = '#12805a', BLU = '#1f5bd6';
const GRAY = '#e6e1d6', BAD = '#e5534b';
const RAD = Math.PI / 180;
const TCOL = { L1: '#f2c14e', L2: '#ef8a5b', M: '#7cc4a4', S1: '#8fb3f0', S2: '#c39be8', SQ: '#f28fb0', PA: '#a7d36b' };
const PCOL = { F: '#f2c14e', I: '#8fb3f0', L: '#ef8a5b', N: '#7cc4a4', P: '#c39be8', T: '#f28fb0', U: '#a7d36b', V: '#6fc7d9', W: '#e9a6a6', X: '#d9c27a', Y: '#9bb5a8', Z: '#b9a2d6' };
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const op = (c, el, to, ms = 350) => c.anim(el, [{ opacity: to }], ms);
const flash = (c, els, ms = 900) => Promise.all([].concat(els).map((e) => c.anim(e, [{ opacity: 1 }, { opacity: 0.25 }, { opacity: 1 }, { opacity: 0.25 }, { opacity: 1 }], ms)));
const stageSvg = (stage, W, H) => add(stage, svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u5l1-svg' }), 0, 0);
/** an HTML label centred on (cx, cy) */
const lab = (host, html, cx, cy, w = 90, hh = 36, cls = '') => add(host, box(h('div', 'u5l1-fl ' + cls, `<span>${html}</span>`), w, hh), cx - w / 2, cy - hh / 2);
/** change a label's text (one span, so words and maths stay on one line with their spaces) */
const setL = (el, html) => { el.innerHTML = `<span>${html}</span>`; };
/** an SVG group that can be moved with transform="…" about the view box (not about its own box; see BLOCKS.md) */
const tg = (parent, attrs = {}) => { const g = svgEl('g', attrs, parent); g.style.transformBox = 'view-box'; g.style.transformOrigin = '0 0'; return g; };
const r2 = (v) => Math.round(v * 100) / 100;
const PTS = (pts) => pts.map((p) => r2(p[0]) + ',' + r2(p[1])).join(' ');
const poly = (parent, pts, attrs = {}) => svgEl('polygon', Object.assign({ points: PTS(pts), stroke: LINE, 'stroke-width': 2.2, 'stroke-linejoin': 'round' }, attrs), parent);
const line = (parent, a, b, attrs = {}) => svgEl('line', Object.assign({ x1: r2(a[0]), y1: r2(a[1]), x2: r2(b[0]), y2: r2(b[1]), stroke: INK, 'stroke-width': 2, 'stroke-linecap': 'round' }, attrs), parent);
function txt(parent, x, y, s, o = {}) {
  const t = svgEl('text', { x: r2(x), y: r2(y), 'text-anchor': o.anchor || 'middle', 'font-size': o.size || 18, 'font-weight': o.weight || 800, fill: o.fill || INK }, parent);
  if (o.font) t.setAttribute('font-family', o.font);
  t.textContent = s; return t;
}
function centroid(pts) {
  let A = 0, cx = 0, cy = 0;
  for (let i = 0; i < pts.length; i++) { const [x0, y0] = pts[i], [x1, y1] = pts[(i + 1) % pts.length], k = x0 * y1 - x1 * y0; A += k; cx += (x0 + x1) * k; cy += (y0 + y1) * k; }
  A /= 2; return [cx / (6 * A), cy / (6 * A)];
}
function inPoly([x, y], vs) {
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) { const [xi, yi] = vs[i], [xj, yj] = vs[j]; if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside; }
  return inside;
}
/** booklet cells "x/y,x/y" (y up) → [[col, row]] (rows down); rows = the grid height (default: the shape's own) */
function BK(s, rows) {
  const a = s.split(',').map((t) => t.split('/').map(Number)), my = rows != null ? rows - 1 : Math.max(...a.map((p) => p[1]));
  return a.map(([x, y]) => [x, my - y]);
}
const mkSvg = (w, hh, label = '') => { const s = svgEl('svg', { width: w, height: hh, viewBox: `0 0 ${w} ${hh}`, role: 'img' }); if (label) s.setAttribute('aria-label', label); return s; };
/** a polyomino (one rect per square, like the booklet) with its top-left at (x, y) */
function polyo(parent, cells, o = {}) {
  const s = o.s || 30, x0 = o.x || 0, y0 = o.y || 0, g = tg(parent, o.cls ? { class: o.cls } : {});
  cells.forEach(([a, b]) => svgEl('rect', { x: r2(x0 + a * s), y: r2(y0 + b * s), width: s, height: s, fill: o.fill || GRAY, stroke: o.stroke || INK, 'stroke-width': o.sw || 2.2 }, g));
  return g;
}
function gridLines(parent, x, y, cols, rows, s, o = {}) {
  let d = ''; for (let i = 0; i <= cols; i++) d += `M${r2(x + i * s)} ${r2(y)}V${r2(y + rows * s)}`; for (let j = 0; j <= rows; j++) d += `M${r2(x)} ${r2(y + j * s)}H${r2(x + cols * s)}`;
  return svgEl('path', { d, stroke: o.color || '#b9bec8', 'stroke-width': o.w || 1.2, fill: 'none' }, parent);
}
const ext = (cells) => [Math.max(...cells.map((c) => c[0])) + 1, Math.max(...cells.map((c) => c[1])) + 1];
const fmtT = (n) => { const s = String(Math.round(n * 10000) / 10000), [i, d] = s.split('.'); const ii = i.length > 4 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : i; return d ? ii + '.' + d : ii; };

/* ============================== the booklet's tangram (4 by 4, y up) ============================== */
const BT = { L1: [[0, 0], [0, 4], [2, 2]], L2: [[0, 4], [4, 4], [2, 2]], M: [[2, 0], [4, 0], [4, 2]], S1: [[0, 0], [2, 0], [1, 1]], SQ: [[1, 1], [2, 0], [3, 1], [2, 2]], S2: [[2, 2], [3, 1], [3, 3]], PA: [[3, 1], [4, 2], [4, 4], [3, 3]] };
const BT_CUTS = { L1: [[[2, 2], [0, 2]], [[0, 2], [1, 1]], [[0, 2], [1, 3]]], L2: [[[2, 2], [2, 4]], [[2, 4], [1, 3]], [[2, 4], [3, 3]]], M: [[[4, 0], [3, 1]]], SQ: [[[1, 1], [3, 1]]], PA: [[[3, 3], [4, 2]]], S1: [], S2: [] };
const BT_LAB = { L1: [0.65, 2, 0, 'large'], L2: [2, 3.35, 0, 'large'], M: [3.5, 0.55, 0, 'medium'], S1: [1, 0.32, 0, 'small'], S2: [2.68, 2.15, 90, 'small'], SQ: [2, 1, 0, 'square'], PA: [3.5, 2.5, 90, 'parallelogram'] };
const BT_AREA = { L1: 4, L2: 4, M: 2, S1: 1, S2: 1, SQ: 2, PA: 2 };
function drawTangram(svg, x0, y0, u, o = {}) {
  const X = (p) => [x0 + p[0] * u, y0 + (4 - p[1]) * u], out = { polys: {}, cuts: {}, X };
  Object.keys(BT).forEach((id) => { out.polys[id] = poly(svg, BT[id].map(X), { fill: o.gray ? '#eceae4' : TCOL[id] }); });
  Object.keys(BT).forEach((id) => {
    const g = svgEl('g', o.cutCls ? { class: o.cutCls } : {}, svg);
    BT_CUTS[id].forEach(([a, b]) => line(g, X(a), X(b), { stroke: RED, 'stroke-width': 2.4, 'stroke-dasharray': '7 6' }));
    out.cuts[id] = g;
  });
  if (o.names) Object.keys(BT).forEach((id) => { const [lx, ly, rot, nm] = BT_LAB[id], [px, py] = X([lx, ly]); const t = txt(svg, px, py + 5, nm, { size: nm === 'parallelogram' ? 13 : 15, weight: 700 }); if (rot) t.setAttribute('transform', `rotate(${rot} ${r2(px)} ${r2(py)})`); });
  return out;
}

/* ============================== static figures on the cards ============================== */
const FIGS = {
  ex1() {
    const s = 64, svg = mkSvg(3 * s + 8, 3 * s + 8, 'A 3 by 3 grid of squares');
    gridLines(svg, 4, 4, 3, 3, s, { color: INK, w: 2.6 });
    svgEl('rect', { x: 4 + 4, y: 4 + 4, width: 2 * s - 8, height: 2 * s - 8, fill: 'none', stroke: RED, 'stroke-width': 5, class: 'u5l1-a' }, svg);
    return svg;
  },
  ex2() {
    const u = 62, svg = mkSvg(4 * u + 8, 4 * u + 8, 'The tangram square cut into its 7 pieces, labelled');
    drawTangram(svg, 4, 4, u, { gray: true, names: true, cutCls: 'u5l1-a' });
    return svg;
  },
  ex3a: () => ex3fig([[[0, 0], [1, 0], [0, 1]], [[1, 0], [1, 1], [0, 1]]]),
  ex3b: () => ex3fig([[[0, 0], [1, 0], [1, 1]], [[1, 0], [2, 0], [1, 1]]]),
  ex3c: () => ex3fig([[[0, 0], [1, 0], [1, 1]], [[1, 0], [2, 1], [1, 1]]]),
  ex4a() {
    const L = 100, svg = mkSvg(2 * L + 8, 2 * L + 8, 'A grey square silhouette'), Q = ([x, y]) => [4 + x * L, 4 + (2 - y) * L];
    poly(svg, [[0, 0], [2, 0], [2, 2], [0, 2]].map(Q), { fill: '#bdbab3', stroke: '#9a978f' });
    const g = svgEl('g', { class: 'u5l1-a' }, svg);
    FIVE.forEach(([, pts]) => poly(g, pts.map(Q), { fill: 'none', stroke: RED, 'stroke-width': 3.2 }));
    return svg;
  },
  ex4b() {
    const u = 50, svg = mkSvg(8 * u + 8, 4 * u + 8, 'A grey triangle silhouette, twice as wide as it is tall'), Q = ([x, y]) => [4 + x * u, 4 + (4 - y) * u];
    poly(svg, [[0, 0], [8, 0], [4, 4]].map(Q), { fill: '#bdbab3', stroke: '#9a978f' });
    const g = svgEl('g', { class: 'u5l1-a' }, svg);
    Object.values(TRI7).forEach((pts) => poly(g, pts.map(Q), { fill: 'none', stroke: RED, 'stroke-width': 3.2 }));
    return svg;
  },
  same() {
    const s = 24, svg = mkSvg(900, 160, 'Four drawings of the same L pentomino, turned and flipped; then two shapes that are not allowed: squares joined only at corners, and squares joined on half a side');
    const sh = [['0/0,0/1,0/2,0/3,1/0', 0], ['0/0,1/0,2/0,3/0,3/1', 90], ['1/0,1/1,1/2,1/3,0/0', 230], ['0/0,0/1,1/1,2/1,3/1', 320]];
    sh.forEach(([c, x]) => { const cells = BK(c), [, hh] = ext(cells); polyo(svg, cells, { s, x: 20 + x, y: 10 + (4 - hh) * s }); });
    txt(svg, 250, 130, 'the same pentomino,', { size: 17, weight: 700 }); txt(svg, 250, 150, 'turned and flipped', { size: 17, weight: 700 });
    polyo(svg, BK('0/0,1/0,2/0,3/1'), { s, x: 520, y: 10 + 2 * s });
    txt(svg, 568, 130, 'not allowed:', { size: 17, weight: 700, fill: RED }); txt(svg, 568, 150, 'corners only', { size: 17, weight: 700, fill: RED });
    polyo(svg, BK('0/0,1/0,2/0,0.5/1,1.5/1'), { s, x: 720, y: 10 + 2 * s });
    txt(svg, 756, 130, 'not allowed:', { size: 17, weight: 700, fill: RED }); txt(svg, 756, 150, 'half sides', { size: 17, weight: 700, fill: RED });
    return svg;
  },
  ex5a() {
    const s = 30, svg = mkSvg(940, 210, 'Five shapes made of squares, labelled i to v');
    const sh = ['0/0,1/0,2/0,2/1,3/1', '0/0,1/0,2/0,1/1', '0/0,0/1,1/1,2/2,2/3', '0/0,1/0,2/0,0.5/1,1.5/1', '0/0,0/1,1/1,2/1,2/2'];
    const ans = ['yes', 'no: 4 squares', 'no: corners', 'no: half sides', 'yes'], nm = ['(i)', '(ii)', '(iii)', '(iv)', '(v)'];
    sh.forEach((c, i) => {
      const cells = BK(c), [w, hh] = ext(cells), cx = 94 + i * 188;
      txt(svg, cx - 70, 22, nm[i], { size: 19, anchor: 'start' });
      polyo(svg, cells, { s, x: cx - (w * s) / 2, y: 40 + (4 - hh) * s });
      txt(svg, cx, 196, ans[i], { size: 18, fill: RED, cls: '' }).setAttribute('class', 'u5l1-a');
    });
    return svg;
  },
  ex5b() {
    const s = 28, svg = mkSvg(940, 170, 'Three pairs of pentominoes, labelled i to iii');
    const pairs = [['0/0,0/1,0/2,1/1,1/2', '1/0,1/1,1/2,0/0,0/1', 'same: turn'], ['0/0,1/0,2/0,3/0,1/1', '0/0,1/0,2/0,3/0,3/1', 'different'], ['0/2,1/2,1/1,1/0,2/0', '0/0,1/0,1/1,1/2,2/2', 'same: flip']];
    pairs.forEach(([a, b, an], i) => {
      const x0 = 20 + i * 315, A = BK(a), B = BK(b), [wa, ha] = ext(A), [, hb] = ext(B);
      txt(svg, x0, 22, ['(i)', '(ii)', '(iii)'][i], { size: 19, anchor: 'start' });
      polyo(svg, A, { s, x: x0 + 10, y: 36 + (3 - ha) * s, fill: '#d7e3f7' });
      polyo(svg, B, { s, x: x0 + 10 + wa * s + 36, y: 36 + (3 - hb) * s, fill: '#d6efe2' });
      txt(svg, x0 + 120, 160, an, { size: 18, fill: RED }).setAttribute('class', 'u5l1-a');
    });
    return svg;
  },
  ex6() {
    const s = 22, svg = mkSvg(960, 330, 'Empty grids for a systematic list of pentominoes, in rows: 5 in a row (1 grid), 4 in a row (2 grids), 3 in a row (8 grids), 2 in a row (1 grid)');
    LIST_ROWS.forEach((R) => {
      txt(svg, 6, R.y + 20, R.name, { size: 18, anchor: 'start' });
      R.shapes.forEach((sh, k) => {
        const x = 140 + k * (R.cols * s + 14);
        gridLines(svg, x, R.y, R.cols, R.rows, s, { color: '#9aa0ab' });
        polyo(svg, BK(sh, R.rows), { s, x, y: R.y, fill: '#f0b9b4', stroke: RED, sw: 1.8, cls: 'u5l1-a' });
      });
    });
    return svg;
  },
  names() {
    const s = 20, svg = mkSvg(900, 140, 'The 12 pentominoes named by letters: F, I, L, N, P, T, U, V, W, X, Y, Z');
    let x = 6;
    NAMES.forEach(([L, c]) => { const cells = BK(c, 5), [w] = ext(cells); polyo(svg, cells, { s, x, y: 6, fill: PCOL[L], sw: 1.8 }); txt(svg, x + (w * s) / 2, 134, L, { size: 22, weight: 900, fill: BR }); x += w * s + 20; });
    return svg;
  },
  ex7() {
    const s = 34, svg = mkSvg(940, 210, 'Four pentominoes: (a) X, (b) L, (c) U, (d) P');
    const list = [['(a) X', '1/0,0/1,1/1,2/1,1/2', [1, 1], 'yes'], ['(b) L', '0/0,0/1,0/2,0/3,1/0', [1, 0], 'yes'], ['(c) U', '0/0,1/0,2/0,0/1,2/1', null, 'no'], ['(d) P', '0/0,0/1,0/2,1/1,1/2', null, 'no']];
    list.forEach(([nm, c, bot, an], i) => {
      const cells = BK(c), [w, hh] = ext(cells), x0 = 20 + i * 235, my = Math.max(...c.split(',').map((t) => +t.split('/')[1]));
      txt(svg, x0, 22, nm, { size: 19, anchor: 'start' });
      const gx = x0 + 10, gy = 36 + (4 - hh) * s;
      polyo(svg, cells, { s, x: gx, y: gy });
      if (bot) svgEl('rect', { x: gx + bot[0] * s + 2, y: gy + (my - bot[1]) * s + 2, width: s - 4, height: s - 4, fill: BR, opacity: 0.55, class: 'u5l1-a' }, svg);
      txt(svg, x0 + 150, 120, an, { size: 22, fill: RED }).setAttribute('class', 'u5l1-a');
    });
    return svg;
  },
  ex8() {
    const s = 26, S = 54, svg = mkSvg(760, 190, 'The L, T and Y pentominoes, and an empty 3 by 5 rectangle');
    [['L', '0/0,0/1,0/2,0/3,1/0', 0], ['T', '0/2,1/2,2/2,1/1,1/0', 80], ['Y', '0/0,1/0,2/0,3/0,1/1', 190]].forEach(([L, c, x]) => {
      const cells = BK(c), [w, hh] = ext(cells); polyo(svg, cells, { s, x: 10 + x, y: 14 + (4 - hh) * s }); txt(svg, 10 + x + (w * s) / 2, 150, L, { size: 21 });
    });
    const gx = 440, gy = 14;
    const ag = svgEl('g', { class: 'u5l1-a' }, svg);
    TILE.forEach(([L, cells]) => { cells.forEach(([a, b]) => svgEl('rect', { x: gx + a * S, y: gy + b * S, width: S, height: S, fill: PCOL[L], opacity: 0.85 }, ag)); });
    gridLines(svg, gx, gy, 5, 3, S, { color: '#9aa0ab' });
    svgEl('rect', { x: gx, y: gy, width: 5 * S, height: 3 * S, fill: 'none', stroke: INK, 'stroke-width': 2.6 }, svg);
    const ag2 = svgEl('g', { class: 'u5l1-a' }, svg);
    TILE.forEach(([L, cells]) => {
      const has = {}; cells.forEach(([a, b]) => { has[a + ',' + b] = 1; });
      cells.forEach(([a, b]) => { [[0, -1], [0, 1], [-1, 0], [1, 0]].forEach(([dx, dy]) => { if (has[(a + dx) + ',' + (b + dy)]) return; const x1 = gx + (a + (dx > 0 ? 1 : 0)) * S, y1 = gy + (b + (dy > 0 ? 1 : 0)) * S; line(ag2, [x1, y1], dx ? [x1, y1 + S] : [x1 + S, y1], { stroke: RED, 'stroke-width': 4 }); }); });
      const lc = { L: [1, 0], T: [3, 1], Y: [1, 2] }[L]; txt(ag2, gx + (lc[0] + 0.5) * S, gy + (lc[1] + 0.5) * S + 8, L, { size: 24, fill: RED });
    });
    return svg;
  },
  ex9() {
    const s = 34, svg = mkSvg(3 * s + 8, 4 * s + 8, 'The X pentomino on a 3 by 4 grid, with room for one more square');
    gridLines(svg, 4, 4, 3, 4, s, { color: '#9aa0ab' });
    polyo(svg, BK('1/0,0/1,1/1,2/1,1/2', 4), { s, x: 4, y: 4 });
    polyo(svg, [[1, 0]], { s, x: 4, y: 4, fill: '#f0b9b4', stroke: RED, cls: 'u5l1-a' });
    return svg;
  }
};
function ex3fig(tris) {
  const L = 90, svg = mkSvg(280, 150, 'An empty box to sketch the shape'), Q = ([x, y]) => [140 - (Math.max(...tris.flat().map((p) => p[0])) * L) / 2 + x * L, 130 - y * L];
  const g = svgEl('g', { class: 'u5l1-a' }, svg);
  tris.forEach((t, i) => poly(g, t.map(Q), { fill: i ? '#c39be8' : '#8fb3f0', stroke: RED, 'stroke-width': 3 }));
  return svg;
}
/* Example 4(a): the 5 pieces as a square of side 2 (1 = a leg of a small triangle; y up), as in the booklet */
const FIVE = [['M', [[0, 0], [2, 0], [1, 1]]], ['S1', [[0, 0], [1, 1], [0, 1]]], ['SQ', [[0, 1], [1, 1], [1, 2], [0, 2]]], ['PA', [[1, 1], [2, 0], [2, 1], [1, 2]]], ['S2', [[2, 1], [2, 2], [1, 2]]]];
/* Example 4(b): all 7 in the triangle (0,0)–(8,0)–(4,4) (1 = the tangram unit, the small triangle's long side is 2; y up) */
const TRI7 = { L1: [[0, 0], [4, 0], [2, 2]], L2: [[4, 0], [8, 0], [6, 2]], M: [[4, 0], [6, 2], [4, 2]], S1: [[4, 0], [4, 2], [3, 1]], SQ: [[3, 1], [4, 2], [3, 3], [2, 2]], PA: [[4, 2], [6, 2], [5, 3], [3, 3]], S2: [[5, 3], [4, 4], [3, 3]] };
/* Example 6: the systematic list, as in the booklet */
const LIST_ROWS = [
  { name: '5 in a row', y: 6, cols: 5, rows: 1, shapes: ['0/0,1/0,2/0,3/0,4/0'], letters: ['I'] },
  { name: '4 in a row', y: 52, cols: 4, rows: 2, shapes: ['0/0,1/0,2/0,3/0,0/1', '0/0,1/0,2/0,3/0,1/1'], letters: ['L', 'Y'] },
  { name: '3 in a row', y: 122, cols: 4, rows: 3, shapes: ['0/1,1/1,1/2,2/2,1/0', '0/0,1/0,2/0,2/1,3/1', '0/0,1/0,2/0,0/1,1/1', '0/2,1/2,2/2,1/1,1/0', '0/0,1/0,2/0,0/1,2/1', '0/0,1/0,2/0,0/1,0/2', '1/0,0/1,1/1,2/1,1/2', '0/2,1/2,1/1,1/0,2/0'], letters: ['F', 'N', 'P', 'T', 'U', 'V', 'X', 'Z'] },
  { name: '2 in a row', y: 220, cols: 3, rows: 3, shapes: ['0/0,1/0,1/1,2/1,2/2'], letters: ['W'] }
];
const NAMES = [['F', '1/0,1/1,1/2,0/1,2/2'], ['I', '0/0,0/1,0/2,0/3,0/4'], ['L', '0/0,0/1,0/2,0/3,1/0'], ['N', '0/0,0/1,1/1,1/2,1/3'], ['P', '0/0,0/1,0/2,1/1,1/2'], ['T', '0/2,1/2,2/2,1/1,1/0'], ['U', '0/0,1/0,2/0,0/1,2/1'], ['V', '0/0,1/0,2/0,0/1,0/2'], ['W', '0/0,1/0,1/1,2/1,2/2'], ['X', '1/0,0/1,1/1,2/1,1/2'], ['Y', '0/0,1/0,2/0,3/0,1/1'], ['Z', '0/2,1/2,1/1,1/0,2/0']];
/* Example 8: the booklet's tiling of the 3 by 5 rectangle ([col, row], rows down) */
const TILE = [['L', BK('0/1,0/2,1/2,2/2,3/2', 3)], ['T', BK('4/0,4/1,4/2,2/1,3/1', 3)], ['Y', BK('0/0,1/0,2/0,3/0,1/1', 3)]];
function drawFigs() {
  document.querySelectorAll('.u5l1 [data-fig]').forEach((el) => { const f = FIGS[el.dataset.fig]; if (f && !el.firstChild) el.appendChild(f()); });
}

/* ============================== moving pieces (explainers) ============================== */
/** a polygon in a movable group: g.set(dx, dy, rot, sx) moves/turns/flips it about its own centre */
function mover(parent, pts, attrs) {
  const g = tg(parent); g.p = poly(g, pts, attrs); g.cen = centroid(pts);
  g.set = (dx, dy, rot = 0, sx = 1) => g.setAttribute('transform', `translate(${r2(g.cen[0] + dx)} ${r2(g.cen[1] + dy)}) rotate(${r2(rot)}) scale(${r2(sx)} 1) translate(${r2(-g.cen[0])} ${r2(-g.cen[1])})`);
  g.start = (x, y, rot = 0, flip = false) => { g.from = { dx: x - g.cen[0], dy: y - g.cen[1], rot, flip }; g.set(g.from.dx, g.from.dy, rot, flip ? -1 : 1); return g; };
  return g;
}
const fly = (c, g, ms = 850) => tween(c, ms, (t) => { const f = g.from; g.set(f.dx * (1 - t), f.dy * (1 - t), f.rot * (1 - t), f.flip ? 2 * t - 1 : 1); });

/* ============================== Example 1: count the squares ============================== */
const countSquares = {
  title: 'Count the squares: a systematic list',
  height: 400,
  minW: 940,
  choices: [{ sep: 'Example 1 check:' }, { v: 3, label: '(a) 3 by 3 grid' }, { v: 2, label: '(b) 2 by 2 grid' }, { v: 'pat', label: '(b) The pattern' }],
  ask: (v) => (v === 3 ? 'Example 1(a): how many squares of <b>any</b> size are in a 3 by 3 grid?' : v === 2 ? 'Example 1(b): simplify the problem. How many squares are in a 2 by 2 grid?' : 'Example 1(b), (c): does the list follow a pattern? Which strategies did we use?'),
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 940) / 2, svg = stageSvg(stage, W, 400);
    if (v === 'pat') return patSteps(stage, svg, ox);
    const n = v, G = 300, s = G / n, gx = ox + 50, gy = 30;
    gridLines(svg, gx, gy, n, n, s, { color: INK, w: 3 });
    const hl = svgEl('rect', { x: gx, y: gy, width: s, height: s, rx: 6, fill: 'rgba(226,166,58,.28)', stroke: AMB, 'stroke-width': 7 }, svg); hide(hl);
    const counter = lab(stage, '', gx + G / 2, gy + G + 34, 300, 36, 'brand big');
    const tb = h('table', 'u5l1-xt');
    const sizes = []; for (let k = 1; k <= n; k++) sizes.push(k);
    const counts = sizes.map((k) => (n - k + 1) ** 2), total = counts.reduce((a, b) => a + b, 0);
    tb.innerHTML = `<tr><th>Size of square</th>${sizes.map((k) => `<td>${k} by ${k}</td>`).join('')}<th>Total</th></tr><tr><th>How many</th>${counts.map((m) => `<td><span class="u5l1-cv">${m}</span></td>`).join('')}<td><b class="u5l1-cv">${total}</b></td></tr>`;
    add(stage, tb, ox + 420, 110);
    const cv = [...tb.querySelectorAll('.u5l1-cv')]; hide(...cv); cv.forEach((e) => { e.style.display = 'inline-block'; });
    const steps = sizes.map((k, i) => {
      const m = n - k + 1, pos = []; for (let r = 0; r < m; r++) for (let q = 0; q < m; q++) pos.push([q, r]);
      const cap = k === 1 ? `<b>1 by 1</b>: the small squares. Count them: <b>${n * n}</b>.` : k === n ? `<b>${n} by ${n}</b>: the whole grid. Just <b>1</b>.` : `<b>${k} by ${k}</b>: it can start in ${m} places across and ${m} places down: ${T(`${m}\\times${m}=${m * m}`)}.`;
      return { cap, run: async (c) => {
        hl.style.opacity = 1;
        for (let j = 0; j < pos.length; j++) {
          const [q, r] = pos[j]; hl.setAttribute('x', gx + q * s + 4); hl.setAttribute('y', gy + r * s + 4); hl.setAttribute('width', k * s - 8); hl.setAttribute('height', k * s - 8);
          setL(counter, `${k} by ${k}: ${j + 1}`);
          await c.sleep(k === 1 ? 170 : 520);
        }
        await c.pop(cv[i], 320);
      } };
    });
    steps.push({ cap: `Total: ${T(counts.join('+') + '=' + total)} squares. ${n === 3 ? 'Not 9: the bigger squares count too!' : 'The list sorted by size finds them all.'}`, run: async (c) => { hide(hl); setL(counter, `${total} squares`); await c.pop(cv[n], 320); await c.pop(counter, 360); } });
    return steps;
  }
};
function patSteps(stage, svg, ox) {
  const s = 46, xs = [ox + 120, ox + 360, ox + 640], y = 40, labs = [];
  [1, 2, 3].forEach((n, i) => {
    const g = svgEl('g', {}, svg); gridLines(g, xs[i] - (n * s) / 2, y + (3 - n) * s, n, n, s, { color: INK, w: 2.6 }); hide(g);
    labs.push({ g, name: lab(stage, `${n} by ${n} grid`, xs[i], y + 3 * s + 30, 200, 32), val: lab(stage, T(['1', '1+4=5', '1+4+9=14'][i]), xs[i], y + 3 * s + 74, 240, 40, 'big brand') });
  });
  labs.forEach((L) => hide(L.name, L.val));
  const adds = [lab(stage, T('+4=+2^2'), (xs[0] + xs[1]) / 2, 330, 200, 40, 'red big'), lab(stage, T('+9=+3^2'), (xs[1] + xs[2]) / 2, 330, 200, 40, 'red big')]; hide(...adds);
  const strat = lab(stage, '', ox + 470, 375, 900, 34, 'brand'); hide(strat);
  const showN = (i) => async (c) => { await op(c, labs[i].g, 1, 300); labs[i].name.style.opacity = 1; await c.pop(labs[i].val, 360); };
  return [
    { cap: 'A 1 by 1 grid has just <b>1</b> square.', run: showN(0) },
    { cap: `A 2 by 2 grid: 4 small and 1 big: ${T('1+4=5')}.`, run: showN(1) },
    { cap: `A 3 by 3 grid (part (a)): ${T('1+4+9=14')}.`, run: showN(2) },
    { cap: 'The pattern: each grid adds the <b>next square number</b> (4, then 9).', run: async (c) => { for (const a of adds) await c.pop(a, 360); } },
    { cap: '(c) Strategies: a <b>systematic list</b>, <b>simplify the problem</b> and <b>look for a pattern</b>.', run: async (c) => { setL(strat, 'systematic list · simplify the problem · look for a pattern'); await c.fadeIn(strat, 400); } }
  ];
}

/* ============================== Example 2: tangram areas ============================== */
const tanAreas = {
  title: 'Cover the pieces with small triangles',
  height: 420,
  minW: 960,
  choices: [{ sep: 'Example 2 check:' }, { v: 'a', label: '(a), (b) Areas and fractions' }, { v: 'c', label: '(c) A 20 cm card' }],
  ask: (v) => (v === 'a' ? 'Example 2(a), (b): a small triangle is 1 unit. Find the area of each piece, and of the whole square.' : 'Example 2(c): a tangram is cut from a square of card 20 cm by 20 cm. Find the area of each kind of piece.'),
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 960) / 2, svg = stageSvg(stage, W, 420), u = 84, x0 = ox + 40, y0 = 40;
    const tg7 = drawTangram(svg, x0, y0, u);
    Object.values(tg7.cuts).forEach((g) => hide(g));
    const at = (id) => { const [lx, ly] = BT_LAB[id]; return tg7.X([lx, ly]); };
    const pl = {}; Object.keys(BT).forEach((id) => { const [px, py] = at(id); pl[id] = lab(stage, '', px, py, 74, 32, 'big'); hide(pl[id]); });
    const setPl = (ids, f) => ids.forEach((id) => setL(pl[id], f(id)));
    if (v === 'a') {
      const KINDS = [['large triangle', ['L1', 'L2'], 4, '\\dfrac4{16}=\\dfrac14'], ['medium triangle', ['M'], 2, '\\dfrac2{16}=\\dfrac18'], ['small triangle', ['S1', 'S2'], 1, '\\dfrac1{16}'], ['square', ['SQ'], 2, '\\dfrac2{16}=\\dfrac18'], ['parallelogram', ['PA'], 2, '\\dfrac2{16}=\\dfrac18']];
      const tb = h('table', 'u5l1-xt'); tb.style.width = '470px';
      tb.innerHTML = '<tr><th>Piece</th><th>Area (small triangles)</th><th>Fraction of the square</th></tr>' + KINDS.map(([nm, , a, f]) => `<tr><td class="l">${nm}</td><td><span class="u5l1-cv">${a}</span></td><td><span class="u5l1-cv">${T(f)}</span></td></tr>`).join('');
      add(stage, tb, ox + 440, 40);
      const cv = [...tb.querySelectorAll('.u5l1-cv')]; hide(...cv); cv.forEach((e) => { e.style.display = 'inline-block'; });
      const areaCell = (k) => cv[2 * k], fracCell = (k) => cv[2 * k + 1];
      const sum = lab(stage, '', ox + 675, 352, 470, 34, 'big'); hide(sum);
      const chk = lab(stage, T('\\tfrac14+\\tfrac14+\\tfrac18+\\tfrac1{16}+\\tfrac1{16}+\\tfrac18+\\tfrac18=1'), ox + 675, 396, 470, 40, 'big'); hide(chk);
      const P = tg7.polys;
      return [
        { cap: 'A <b>small triangle</b> is 1 unit of area.', run: async (c) => { setPl(['S1', 'S2'], () => '1'); await flash(c, [P.S1, P.S2]); await Promise.all([c.pop(pl.S1), c.pop(pl.S2), c.pop(areaCell(2))]); } },
        { cap: 'A <b>large triangle</b>: 4 small triangles cover it.', run: async (c) => { await Promise.all([op(c, tg7.cuts.L1, 1, 500), op(c, tg7.cuts.L2, 1, 500)]); setPl(['L1', 'L2'], () => '4'); await Promise.all([c.pop(pl.L1), c.pop(pl.L2), c.pop(areaCell(0))]); } },
        { cap: 'The <b>medium triangle</b>, the <b>square</b> and the <b>parallelogram</b>: 2 small triangles each.', run: async (c) => { await Promise.all(['M', 'SQ', 'PA'].map((id) => op(c, tg7.cuts[id], 1, 500))); setPl(['M', 'SQ', 'PA'], () => '2'); await Promise.all([c.pop(pl.M), c.pop(pl.SQ), c.pop(pl.PA), c.pop(areaCell(1)), c.pop(areaCell(3)), c.pop(areaCell(4))]); } },
        { cap: `(b) The whole square: ${T('4+4+2+1+1+2+2=16')} small triangles.`, run: async (c) => { setL(sum, `whole square: <b>16</b> small triangles`); await c.pop(sum, 380); } },
        { cap: `Fraction of the whole = area ${T('\\div 16')}, in lowest terms.`, run: async (c) => { for (const k of [0, 1, 2, 3, 4]) await c.pop(fracCell(k), 300); } },
        { cap: 'Check: the fractions of all 7 pieces add up to 1 whole. ✓', run: (c) => c.pop(chk, 400) }
      ];
    }
    // (c) a 20 cm card
    const sideT = lab(stage, '20 cm', x0 + 2 * u, y0 - 18, 120, 30, 'brand'), sideL = lab(stage, '20 cm', x0 - 30, y0 + 2 * u, 60, 30, 'brand');
    sideL.style.transform = 'rotate(-90deg)';
    void sideT;
    const LINES = [
      ['Whole square:', '20\\times20=400\\text{ cm}^2'],
      ['Small triangle:', '400\\div16=25\\text{ cm}^2'],
      ['Medium triangle, square, parallelogram:', '2\\times25=50\\text{ cm}^2'],
      ['Large triangle:', '4\\times25=100\\text{ cm}^2'],
      ['Check:', '100+100+50+25+25+50+50=400\\ \\checkmark']
    ];
    const ls = LINES.map(([a, b], i) => { const e = lab(stage, `<span>${a}&nbsp; </span>${T(b)}`, ox + 690, 70 + i * 62, 520, 50, 'lft'); hide(e); return e; });
    const whole = svgEl('rect', { x: x0, y: y0, width: 4 * u, height: 4 * u, fill: 'rgba(226,166,58,.25)', stroke: AMB, 'stroke-width': 6 }, svg); hide(whole);
    return [
      { cap: `Whole square: ${T('20\\times20=400')} cm².`, run: async (c) => { await flash(c, whole, 700); await op(c, whole, 0, 300); await c.fadeIn(ls[0], 380); } },
      { cap: `16 small triangles make the square, so one is ${T('400\\div16=25')} cm².`, run: async (c) => { await Promise.all(Object.values(tg7.cuts).map((g) => op(c, g, 1, 450))); await c.fadeIn(ls[1], 380); setPl(['S1', 'S2'], () => '25'); await Promise.all([c.pop(pl.S1), c.pop(pl.S2)]); } },
      { cap: `The medium triangle, square and parallelogram are 2 small triangles: ${T('2\\times25=50')} cm².`, run: async (c) => { await c.fadeIn(ls[2], 380); setPl(['M', 'SQ', 'PA'], () => '50'); await Promise.all([c.pop(pl.M), c.pop(pl.SQ), c.pop(pl.PA)]); } },
      { cap: `A large triangle is 4 small triangles: ${T('4\\times25=100')} cm².`, run: async (c) => { await c.fadeIn(ls[3], 380); setPl(['L1', 'L2'], () => '100'); await Promise.all([c.pop(pl.L1), c.pop(pl.L2)]); } },
      { cap: 'Check: the 7 pieces add up to the whole 400 cm². ✓', run: (c) => c.fadeIn(ls[4], 380) }
    ];
  }
};

/* ============================== Example 3: two small triangles ============================== */
const EX3 = {
  a: { what: 'a square', how: 'put the two <b>long</b> sides together', piece: 'square', id: 'SQ', t1: [[0, 0], [1, 0], [0, 1]], t2: [[1, 0], [1, 1], [0, 1]], p: [[0, 0], [1, 0], [1, 1], [0, 1]] },
  b: { what: 'a bigger triangle', how: 'put two <b>short</b> sides together, side by side', piece: 'medium triangle', id: 'M', t1: [[0, 0], [1, 0], [1, 1]], t2: [[1, 0], [2, 0], [1, 1]], p: [[0, 0], [2, 0], [1, 1]] },
  c: { what: 'a parallelogram', how: 'put two <b>short</b> sides together, with one triangle turned', piece: 'parallelogram', id: 'PA', t1: [[0, 0], [1, 0], [1, 1]], t2: [[1, 0], [2, 1], [1, 1]], p: [[0, 0], [1, 0], [2, 1], [1, 1]] }
};
const twoSmall = {
  title: 'Two small triangles make three shapes',
  height: 360,
  minW: 900,
  choices: [{ sep: 'Example 3 check:' }, { v: 'a', label: '(a) a square' }, { v: 'b', label: '(b) a bigger triangle' }, { v: 'c', label: '(c) a parallelogram' }],
  ask: (v) => `Example 3(${v}), (d): use only the two small triangles to make <b>${EX3[v].what}</b>. Which tangram piece matches it?`,
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 900) / 2, svg = stageSvg(stage, W, 360), E = EX3[v], L = 120;
    const wmax = Math.max(...E.p.map((p) => p[0])), bx = ox + 420 - (wmax * L) / 2, by = 270, Q = ([x, y]) => [bx + x * L, by - y * L];
    const ghost = mover(svg, E.p.map(Q), { fill: TCOL[E.id], 'fill-opacity': 0.55, stroke: GRN, 'stroke-width': 3.5, 'stroke-dasharray': '9 6' }).start(ox + 780, 160, 0);
    hide(ghost);
    const t1 = mover(svg, E.t1.map(Q), { fill: TCOL.S1 }).start(ox + 90, 110, v === 'a' ? 90 : -45);
    const t2 = mover(svg, E.t2.map(Q), { fill: TCOL.S2 }).start(ox + 120, 260, v === 'c' ? 135 : 180);
    hide(t1, t2);
    const nameL = lab(stage, `the <b>${E.piece}</b> piece`, ox + 780, 250, 220, 34, 'green'); hide(nameL);
    const area = lab(stage, `area ${T('1+1=2')} small triangles`, ox + 420, 320, 360, 36, 'brand'); hide(area);
    return [
      { cap: 'Two small triangles: 1 unit of area each.', run: async (c) => { await Promise.all([op(c, t1, 1, 300), op(c, t2, 1, 300)]); } },
      { cap: `Make ${E.what}: ${E.how}.`, run: async (c) => { await Promise.all([fly(c, t1, 900), fly(c, t2, 1000)]); } },
      { cap: `(d) It has the same size and shape as the <b>${E.piece}</b> piece.`, run: async (c) => { await op(c, ghost, 1, 300); await c.fadeIn(nameL, 300); await fly(c, ghost, 900); } },
      { cap: `Both have an area of ${T('1+1=2')} small triangles.`, run: (c) => c.pop(area, 380) }
    ];
  }
};

/* ============================== Example 4: fill the silhouettes ============================== */
const bigTriangle = {
  title: 'Fill the silhouette: biggest pieces first',
  height: 430,
  minW: 960,
  choices: [{ sep: 'Example 4 check:' }, { v: 'a', label: '(a) The square (5 pieces)' }, { v: 'b', label: '(b) The triangle (all 7)' }],
  ask: (v) => (v === 'a' ? 'Example 4(a): make this square with both small triangles, the medium triangle, the square and the parallelogram.' : 'Example 4(b): make this triangle with <b>all 7</b> pieces.'),
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 960) / 2, svg = stageSvg(stage, W, 430);
    if (v === 'a') {
      const L = 105, bx = ox + 600, by = 360, Q = ([x, y]) => [bx + x * L, by - y * L];
      const sil = poly(svg, [[0, 0], [2, 0], [2, 2], [0, 2]].map(Q), { fill: '#d4d1ca', stroke: '#9a978f' });
      const cuts = svgEl('g', {}, svg); [[[1, 0], [1, 2]], [[0, 1], [2, 1]], [[0, 0], [2, 2]], [[2, 0], [0, 2]]].forEach(([a, b]) => line(cuts, Q(a), Q(b), { stroke: RED, 'stroke-width': 2.2, 'stroke-dasharray': '7 6' })); hide(cuts);
      const start = { M: [ox + 110, 110, 45], S1: [ox + 260, 70, 180], SQ: [ox + 110, 300, 45], PA: [ox + 330, 310, 90, true], S2: [ox + 420, 120, -90] };
      const P = {}; FIVE.forEach(([id, pts]) => { const [x, y, r, f] = start[id]; P[id] = mover(svg, pts.map(Q), { fill: TCOL[id] }).start(x, y, r, !!f); });
      const st = stamp(stage, '✓ solved', { ok: true, x: ox + 705, y: 60 }); hide(st);
      return [
        { cap: `Area check: ${T('1+1+2+2+2=8')} units. The square is 8 small triangles too. ✓`, run: async (c) => { await op(c, cuts, 1, 500); await flash(c, sil, 700); } },
        { cap: 'Biggest first: the <b>medium triangle</b>. Its long side fits along the bottom.', run: async (c) => { await op(c, cuts, 0, 300); await fly(c, P.M); } },
        { cap: 'Look at the corners. The top-left is a square corner: the <b>square</b> piece fits it.', run: (c) => fly(c, P.SQ) },
        { cap: 'The top-right corner: the square corner of a <b>small triangle</b>.', run: (c) => fly(c, P.S2) },
        { cap: 'Two gaps are left: a small triangle on the left, and the <b>parallelogram</b> on the right (it fits after a <b>flip</b>).', run: async (c) => { await fly(c, P.S1, 700); await fly(c, P.PA, 1000); } },
        { cap: 'Every corner and edge is filled: no gaps, no overlaps. Solved!', run: (c) => stampIn(c, st) }
      ];
    }
    const u = 52, bx = ox + 510, by = 380, Q = ([x, y]) => [bx + x * u, by - y * u];
    const sil = poly(svg, [[0, 0], [8, 0], [4, 4]].map(Q), { fill: '#d4d1ca', stroke: '#9a978f' });
    const dia = poly(svg, [[4, 0], [6, 2], [4, 4], [2, 2]].map(Q), { fill: 'none', stroke: AMB, 'stroke-width': 5, 'stroke-dasharray': '10 7' }); hide(dia);
    const start = { L1: [ox + 130, 80, 180], L2: [ox + 360, 80, 0], M: [ox + 70, 250, 90], S1: [ox + 190, 230, 45], SQ: [ox + 300, 250, 45], PA: [ox + 410, 240, 0, true], S2: [ox + 200, 340, 180] };
    const P = {}; Object.entries(TRI7).forEach(([id, pts]) => { const [x, y, r, f] = start[id]; P[id] = mover(svg, pts.map(Q), { fill: TCOL[id] }).start(x, y, r, !!f); });
    svg.appendChild(dia);
    const area = lab(stage, '16 units', ox + 718, by - 70, 120, 34, 'big brand'); hide(area);
    const st = stamp(stage, '✓ solved', { ok: true, x: ox + 870, y: 70 }); hide(st);
    return [
      { cap: 'Area check: the triangle uses all 7 pieces, so it is <b>16</b> units. ✓', run: async (c) => { await flash(c, sil, 700); await c.pop(area, 360); } },
      { cap: 'Biggest first: the two <b>large triangles</b> go along the bottom, one in each corner.', run: async (c) => { await op(c, area, 0, 250); await Promise.all([fly(c, P.L1, 1000), fly(c, P.L2, 1100)]); } },
      { cap: 'The gap in the middle is a <b>square turned on its corner</b>.', run: async (c) => { await op(c, dia, 1, 300); await flash(c, dia, 800); } },
      { cap: 'It is the square from part (a)! Build it with the other 5 pieces.', run: async (c) => { for (const id of ['M', 'SQ', 'S2', 'S1', 'PA']) await fly(c, P[id], 650); await op(c, dia, 0, 300); } },
      { cap: 'Solved. We reused a puzzle we had already solved: <b>simplify the problem</b>.', run: (c) => stampIn(c, st) }
    ];
  }
};

/* ============================== Example 5(b): turn or flip? ============================== */
const EX5 = {
  i: { a: '0/0,0/1,0/2,1/1,1/2', b: '1/0,1/1,1/2,0/0,0/1' },
  ii: { a: '0/0,1/0,2/0,3/0,1/1', b: '0/0,1/0,2/0,3/0,3/1', bumpA: [1, 0], bumpB: [3, 0] },
  iii: { a: '0/2,1/2,1/1,1/0,2/0', b: '0/0,1/0,1/1,1/2,2/2' }
};
/** cells centred on their box: local centres in cell units */
const localC = (cells) => { const [w, hh] = ext(cells); return cells.map(([a, b]) => [a + 0.5 - w / 2, b + 0.5 - hh / 2]); };
const keyOf = (pts) => pts.map(([x, y]) => Math.round(x * 2) + ',' + Math.round(y * 2)).sort().join(' ');
const poseC = (pts, rot, flip) => { const c = Math.cos(rot * RAD), s = Math.sin(rot * RAD); return pts.map(([x, y]) => { const fx = flip ? -x : x; return [fx * c - y * s, fx * s + y * c]; }); };
/** a polyomino group centred at (x, y): g.set(x, y, rot, sx) */
function cellGroup(parent, cells, s, fill, o = {}) {
  const g = tg(parent), [w, hh] = ext(cells);
  g.rects = cells.map(([a, b]) => svgEl('rect', { x: r2((a - w / 2) * s), y: r2((b - hh / 2) * s), width: s, height: s, fill, stroke: o.stroke || INK, 'stroke-width': o.sw || 2.4, 'fill-opacity': o.fo ?? 1 }, g));
  g.st = { x: 0, y: 0, rot: 0, sx: 1 };
  g.set = (x, y, rot = 0, sx = 1) => { g.st = { x, y, rot, sx }; g.setAttribute('transform', `translate(${r2(x)} ${r2(y)}) rotate(${r2(rot)}) scale(${r2(sx)} 1)`); };
  g.fill = (f) => g.rects.forEach((r) => r.setAttribute('fill', f));
  return g;
}
const moveTo = (c, g, to, ms = 700) => { const f = { ...g.st }; return tween(c, ms, (t) => g.set(f.x + (to.x - f.x) * t, f.y + (to.y - f.y) * t, f.rot + ((to.rot ?? f.rot) - f.rot) * t, f.sx + ((to.sx ?? f.sx) - f.sx) * t)); };
const turnFlip = {
  title: 'Same pentomino? Turn it, flip it',
  height: 380,
  minW: 940,
  choices: [{ sep: 'Example 5(b) check:' }, { v: 'i', label: 'Pair (i)' }, { v: 'ii', label: 'Pair (ii)' }, { v: 'iii', label: 'Pair (iii)' }],
  ask: (v) => `Example 5(b)(${v}): is the pair the same pentomino or different? If the same, do you turn or flip it?`,
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 940) / 2, svg = stageSvg(stage, W, 380), E = EX5[v], s = 52;
    const A = BK(E.a), B = BK(E.b), ax = ox + 190, bx = ox + 680, cy = 175;
    const gA = cellGroup(svg, A, s, '#d7e3f7'); gA.set(ax, cy);
    const gB = cellGroup(svg, B, s, '#d6efe2'); gB.set(bx, cy);
    lab(stage, 'first', ax, 330, 120, 30, 'sm'); lab(stage, 'second', bx, 330, 120, 30, 'sm');
    const ghost = cellGroup(svg, A, s, BLU, { fo: 0.35, stroke: BLU, sw: 3 }); ghost.set(ax, cy); hide(ghost);
    const LA = localC(A), KB = keyOf(localC(B));
    const fits = (rot, flip) => keyOf(poseC(LA, rot, flip)) === KB;
    const mark = (rot, flip) => { const ok = fits(rot, flip); ghost.fill(ok ? GRN : RED); ghost.rects.forEach((r) => r.setAttribute('stroke', ok ? GRN : RED)); return ok; };
    const st = stamp(stage, v === 'ii' ? 'different' : v === 'i' ? 'same: turn' : 'same: flip', { ok: v !== 'ii', x: ox + 470, y: 320 }); hide(st);
    const slide = { cap: 'Make a copy of the first one and slide it onto the second.', run: async (c) => { await op(c, ghost, 1, 250); await moveTo(c, ghost, { x: bx, y: cy }, 900); mark(0, false); } };
    if (v === 'i') return [slide,
      { cap: 'It does not fit. <b>Turn</b> it a quarter turn …', run: async (c) => { await moveTo(c, ghost, { x: bx, y: cy, rot: 90 }, 700); mark(90, false); } },
      { cap: '… and another quarter turn: a <b>half turn</b>. It fits! Same pentomino.', run: async (c) => { await moveTo(c, ghost, { x: bx, y: cy, rot: 180 }, 700); mark(180, false); await stampIn(c, st); } }];
    if (v === 'iii') return [slide,
      { cap: 'Try a quarter turn. No fit: turning will not fix this one.', run: async (c) => { await moveTo(c, ghost, { x: bx, y: cy, rot: 90 }, 700); mark(90, false); } },
      { cap: 'Turn it back and <b>flip</b> it over, like a mirror image. It fits! Same pentomino.', run: async (c) => { await moveTo(c, ghost, { x: bx, y: cy, rot: 0 }, 500); await moveTo(c, ghost, { x: bx, y: cy, rot: 0, sx: -1 }, 800); mark(0, true); await stampIn(c, st); } }];
    const bump = (g, cell) => { const i = (g === gA ? A : B).findIndex((q) => q[0] === cell[0] && q[1] === cell[1]); g.rects[i].setAttribute('fill', AMB); };
    return [slide,
      { cap: 'Turn it, a quarter turn at a time. It never fits.', run: async (c) => { for (const r of [90, 180, 270, 360]) { await moveTo(c, ghost, { x: bx, y: cy, rot: r }, 500); mark(r, false); await c.sleep(250); } } },
      { cap: 'Flip it over and turn it again. Still no fit.', run: async (c) => { await moveTo(c, ghost, { x: bx, y: cy, rot: 360, sx: -1 }, 600); mark(0, true); for (const r of [450, 540, 630, 720]) { await moveTo(c, ghost, { x: bx, y: cy, rot: r, sx: -1 }, 500); mark(r, true); await c.sleep(250); } } },
      { cap: 'The bump is on the <b>2nd</b> square in one and on the <b>end</b> square in the other. Different pentominoes.', run: async (c) => { await op(c, ghost, 0, 300); bump(gA, E.bumpA); bump(gB, E.bumpB); await stampIn(c, st); } }];
  }
};

/* ============================== Full notes: one pentomino, many looks ============================== */
const LOOKS = { L: '0/0,0/1,0/2,0/3,1/0', T: '0/2,1/2,2/2,1/1,1/0', X: '1/0,0/1,1/1,2/1,1/2' };
const orientations = {
  title: 'One pentomino, many looks',
  height: 350,
  minW: 960,
  choices: [{ v: 'L', label: 'The L' }, { v: 'T', label: 'The T' }, { v: 'X', label: 'The X' }],
  ask: (v) => `How many different ways can the <b>${v}</b> pentomino lie on a grid?`,
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 960) / 2, svg = stageSvg(stage, W, 350), s = 24, cells = BK(LOOKS[v]), LC = localC(cells);
    lab(stage, 'turned', ox + 50, 95, 90, 30, 'sm'); lab(stage, 'flipped, then turned', ox + 50, 245, 100, 50, 'sm');
    const slots = [], keys = [];
    for (let f = 0; f < 2; f++) for (let j = 0; j < 4; j++) {
      const x = ox + 190 + j * 220, y = 95 + f * 150, g = cellGroup(svg, cells, s, PCOL[v]);
      g.set(x, y, j * 90, f ? -1 : 1); hide(g);
      const k = keyOf(poseC(LC, j * 90, !!f)), dup = keys.indexOf(k);
      keys.push(k);
      const eq = dup >= 0 ? lab(stage, `same as #${dup + 1}`, x, y + 62, 140, 26, 'sm red') : lab(stage, `#${slots.length + 1}`, x, y + 62, 60, 26, 'sm');
      hide(eq); slots.push({ g, dup: dup >= 0, eq });
    }
    const n = new Set(keys).size;
    const showRow = (f) => async (c) => { for (let j = 0; j < 4; j++) { const S = slots[f * 4 + j]; await op(c, S.g, 1, 260); S.eq.style.opacity = 1; } };
    return [
      { cap: `Turn the ${v} a quarter turn at a time: 4 ways.`, run: showRow(0) },
      { cap: 'Flip it over, then turn it 4 more ways.', run: showRow(1) },
      { cap: n === 8 ? 'All <b>8</b> look different, but they are all the same L pentomino.' : n === 1 ? 'Every one is the same picture: the X has only <b>1</b> look.' : `Some are repeats: the ${v} has only <b>${n}</b> different looks.`, run: async (c) => { await Promise.all(slots.filter((S) => S.dup).map((S) => op(c, S.g, 0.25, 400))); } }
    ];
  }
};

/* ============================== Example 6: all 12 by a systematic list ============================== */
const allTwelve = {
  title: 'All the pentominoes: a systematic list',
  height: 440,
  minW: 980,
  ask: 'Example 6: find all the different pentominoes with a systematic list, sorted by the longest straight row.',
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 980) / 2, svg = stageSvg(stage, W, 440), s = 22, top = 18;
    const rows = LIST_ROWS.map((R) => {
      const y = top + R.y, nm = lab(stage, `<b>${R.name}</b>`, ox + 66, y + 13, 132, 28, 'sm lft');
      const pcs = R.shapes.map((sh, k) => {
        const x = ox + 150 + k * (R.cols * s + 16);
        gridLines(svg, x, y, R.cols, R.rows, s, { color: '#b9bec8' });
        const g = polyo(svg, BK(sh, R.rows), { s, x, y, fill: '#f0b9b4', stroke: RED, sw: 1.8 }); hide(g);
        const cells = BK(sh, R.rows), mid = cells.slice().sort((p, q) => Math.hypot(p[0] + 0.5 - avg(cells, 0), p[1] + 0.5 - avg(cells, 1)) - Math.hypot(q[0] + 0.5 - avg(cells, 0), q[1] + 0.5 - avg(cells, 1)))[0];
        const L = txt(svg, x + (mid[0] + 0.5) * s, y + (mid[1] + 0.5) * s + 6, R.letters[k], { size: 17, weight: 900, fill: BR }); hide(L);
        return { g, L };
      });
      return { R, nm, pcs };
    });
    // simplify first: the two trominoes
    const tro = svgEl('g', {}, svg); txt(tro, ox + 760, top + 238, 'With 3 squares: 2 shapes', { size: 17, weight: 700 });
    polyo(tro, [[0, 0], [1, 0], [2, 0]], { s, x: ox + 660, y: top + 274 }); polyo(tro, [[0, 0], [0, 1], [1, 1]], { s, x: ox + 820, y: top + 252 }); hide(tro);
    // the flip check in the 4-in-a-row row
    const r4 = rows[1], gx = ox + 150 + 2 * (4 * s + 16) + 30, gy = top + r4.R.y;
    const ghost = cellGroup(svg, BK('0/0,1/0,2/0,3/0,2/1'), s, '#fde8c4', { stroke: AMB, sw: 2 }); ghost.set(gx + 2 * s, gy + s); hide(ghost);
    const gnote = lab(stage, 'beside the 3rd? Flip it: it is the 2nd one again', gx + 270, gy + s, 330, 44, 'sm red'); hide(gnote);
    const total = lab(stage, '', ox + 560, 400, 640, 40, 'big brand'); hide(total);
    const showRow = (i, n) => async (c) => { for (const p of rows[i].pcs) await c.anim(p.g, [{ opacity: 0 }, { opacity: 1 }], 280); setL(rows[i].nm, `<b>${rows[i].R.name}:</b> <b style="color:#9a6a24">${n}</b>`); };
    return [
      { cap: 'Simplify first: with 3 squares there are only <b>2</b> shapes.', run: (c) => op(c, tro, 1, 400) },
      { cap: 'Sort by the <b>longest straight row</b>. 5 in a row: just <b>1</b>.', run: showRow(0, 1) },
      { cap: '4 in a row: the 5th square goes beside the <b>end</b> square, or beside the <b>2nd</b> square.', run: showRow(1, 2) },
      { cap: 'Beside the 3rd square? Flip it over: it is the 2nd one again. <b>Not new.</b>', run: async (c) => { await op(c, ghost, 1, 300); await c.fadeIn(gnote, 300); await moveTo(c, ghost, { x: gx + 2 * s, y: gy + s, rot: 0, sx: -1 }, 900); await c.sleep(500); await op(c, ghost, 0.0, 400); await op(c, gnote, 0, 300); } },
      { cap: '3 in a row: add 2 squares around a row of 3. Check each new one for turns and flips: <b>8</b>.', run: showRow(2, 8) },
      { cap: '2 in a row: only the staircase, <b>1</b>. (1 in a row is impossible: squares would touch only at corners.)', run: showRow(3, 1) },
      { cap: `Total: ${T('1+2+8+1=12')} different pentominoes.`, run: async (c) => { setL(total, `${T('1+2+8+1=12')} pentominoes`); await c.pop(total, 400); } },
      { cap: 'Each one is named by a capital letter it looks a bit like.', run: async (c) => { for (const r of rows) for (const p of r.pcs) await c.pop(p.L, 200); } }
    ];
  }
};
const avg = (cells, k) => cells.reduce((a, q) => a + q[k] + 0.5, 0) / cells.length;

/* ============================== the folding machine (3-D) ============================== */
const sub3 = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross3 = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
function rot3(p, P, k, a) {
  const v = sub3(p, P), c = Math.cos(a), s = Math.sin(a), kv = cross3(k, v), d = dot3(k, v);
  return [P[0] + v[0] * c + kv[0] * s + k[0] * d * (1 - c), P[1] + v[1] * c + kv[1] * s + k[1] * d * (1 - c), P[2] + v[2] * c + kv[2] * s + k[2] * d * (1 - c)];
}
function shade(hex, f) { const n = parseInt(hex.slice(1), 16), ch = (v) => Math.max(0, Math.min(255, Math.round(v * f))); return `rgb(${ch(n >> 16)},${ch((n >> 8) & 255)},${ch(n & 255)})`; }
const LIGHT = (() => { const l = [-0.35, -0.55, 0.76], m = Math.hypot(...l); return l.map((v) => v / m); })();
/** A net that folds up. Cells are [col, row] (rows down the page). Flat on the table: page up = away from you.
 *  Every square folds 90° up about the edge it shares with its parent (a tree from the bottom square, found by BFS);
 *  ang[level] is the fold angle of all squares at that depth. Camera: yaw (turn about the vertical), pitch (90 = top view). */
class Folder {
  constructor(parent, o) {
    this.g = tg(parent); this.s = o.size || 70; this.cx = o.cx; this.cy = o.cy; this.color = o.color || '#f2c14e';
    this.yaw = 0; this.pitch = 90; this.onTap = o.onTap; this.showBottom = false; this.bad = new Set();
    this.setCells(o.cells, o.bottom || 0);
  }
  setCells(cells, bottom) {
    this.cells = cells; this.g.innerHTML = '';
    this.polys = cells.map((_, i) => {
      const p = svgEl('polygon', { stroke: LINE, 'stroke-width': 2.4, 'stroke-linejoin': 'round' }, this.g);
      if (this.onTap) { p.setAttribute('data-tap', ''); p.classList.add('u5l1-fcell'); p.addEventListener('pointerup', (e) => { e.stopPropagation(); this.onTap(i); }); }
      return p;
    });
    this.setBottom(bottom);
  }
  setBottom(b) {
    const C = this.cells, n = C.length, idx = {}; C.forEach(([a, r], i) => { idx[a + ',' + r] = i; });
    this.root = b; this.par = new Array(n).fill(-1); this.lvl = new Array(n).fill(0); this.hinge = new Array(n).fill(null);
    const seen = new Set([b]), q = [b];
    while (q.length) {
      const p = q.shift(), [pc, pr] = C[p];
      for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const j = idx[(pc + dc) + ',' + (pr + dr)]; if (j == null || seen.has(j)) continue;
        seen.add(j); q.push(j); this.par[j] = p; this.lvl[j] = this.lvl[p] + 1;
        // hinge in flat world coords (x = col, y = −row: page up = +y), outward n = direction from parent to child
        const nx = dc, ny = -dr; let P0;
        if (dc === 1) P0 = [pc + 1, -pr - 1, 0]; else if (dc === -1) P0 = [pc, -pr - 1, 0]; else if (dr === 1) P0 = [pc, -pr - 1, 0]; else P0 = [pc, -pr, 0];
        this.hinge[j] = { P: P0, k: [ny, -nx, 0] };
      }
    }
    this.maxL = Math.max(...this.lvl); this.ang = new Array(this.maxL + 1).fill(0); this.bad = new Set();
    const [bc, br] = C[b]; this.o = [bc + 0.5, -br - 0.5, 0];
    this.render();
  }
  pts(i, ang = this.ang) {
    const [c, r] = this.cells[i]; let ps = [[c, -r - 1, 0], [c + 1, -r - 1, 0], [c + 1, -r, 0], [c, -r, 0]];
    let j = i; while (j !== this.root) { const H = this.hinge[j], a = ang[this.lvl[j]] * RAD; ps = ps.map((p) => rot3(p, H.P, H.k, a)); j = this.par[j]; }
    return ps.map((p) => sub3(p, this.o));
  }
  proj([x, y, z]) {
    const a = this.yaw * RAD, p = this.pitch * RAD, x1 = x * Math.cos(a) - y * Math.sin(a), y1 = x * Math.sin(a) + y * Math.cos(a);
    return [this.cx + this.s * x1, this.cy - this.s * (z * Math.cos(p) + y1 * Math.sin(p)), -y1 * Math.cos(p) + z * Math.sin(p)];
  }
  render() {
    const faces = this.cells.map((_, i) => {
      const P3 = this.pts(i), P2 = P3.map((p) => this.proj(p)), n = cross3(sub3(P3[1], P3[0]), sub3(P3[3], P3[0])), m = Math.hypot(...n) || 1;
      const b = Math.abs(dot3(n, LIGHT)) / m, base = this.bad.has(i) ? BAD : (this.showBottom && i === this.root ? '#b98a55' : this.color);
      return { i, P2, depth: P2.reduce((a, q) => a + q[2], 0) / 4 + (i === this.root ? -0.001 : 0), fill: shade(base, 0.72 + 0.34 * b) };
    });
    faces.sort((a, b) => a.depth - b.depth).forEach((f) => { const el = this.polys[f.i]; el.setAttribute('points', PTS(f.P2)); el.setAttribute('fill', f.fill); this.g.appendChild(el); });
  }
  /** where every square ends up when all are folded: overlapping squares, and whether one is a lid (the top) */
  result() {
    const full = this.ang.map(() => 90), cen = this.cells.map((_, i) => { const p = this.pts(i, full); return [0, 1, 2].map((k) => Math.round(((p[0][k] + p[2][k]) / 2) * 100) / 100); });
    const groups = {}; cen.forEach((c, i) => { const k = c.join(','); (groups[k] = groups[k] || []).push(i); });
    const overlap = Object.values(groups).filter((g) => g.length > 1).flat();
    return { overlap, faces: Object.keys(groups).length, lid: cen.some((c) => Math.abs(c[2] - 1) < 0.01) };
  }
  isFlat() { return this.ang.every((a) => a === 0); }
  fold(c, levels, ms = 900, to = 90) { const from = levels.map((l) => this.ang[l]); return tween(c, ms, (t) => { levels.forEach((l, k) => { this.ang[l] = from[k] + (to - from[k]) * t; }); this.render(); }); }
  camera(c, yaw, pitch, ms = 900, cx = this.cx, cy = this.cy, s = this.s) {
    const f = { yaw: this.yaw, pitch: this.pitch, cx: this.cx, cy: this.cy, s: this.s };
    return tween(c, ms, (t) => { this.yaw = f.yaw + (yaw - f.yaw) * t; this.pitch = f.pitch + (pitch - f.pitch) * t; this.cx = f.cx + (cx - f.cx) * t; this.cy = f.cy + (cy - f.cy) * t; this.s = f.s + (s - f.s) * t; this.render(); });
  }
  /** the centre of the flat shape on screen, relative to the bottom square's centre (px) */
  flatOffset() { const xs = this.cells.map((c) => c[0] + 0.5), ys = this.cells.map((c) => c[1] + 0.5), [bc, br] = this.cells[this.root]; return [((Math.min(...xs) + Math.max(...xs)) / 2 - bc - 0.5) * this.s, ((Math.min(...ys) + Math.max(...ys)) / 2 - br - 0.5) * this.s]; }
}
/* the Example 7 pentominoes (booklet cells) and the square the booklet uses as the bottom */
const FOLD = {
  a: { name: 'X', cells: '1/0,0/1,1/1,2/1,1/2', bottom: '1/1' },
  b: { name: 'L', cells: '0/0,0/1,0/2,0/3,1/0', bottom: '1/0' },
  c: { name: 'U', cells: '0/0,1/0,2/0,0/1,2/1', bottom: '1/0' },
  d: { name: 'P', cells: '0/0,0/1,0/2,1/1,1/2', bottom: '0/1' }
};
const bIndex = (cells, b) => cells.split(',').indexOf(b);
/** a Folder on a stage, placed so the flat shape is centred at (fx, fy); the box will sit at (bx, by) */
function stageFolder(svg, F, fx, fy, size, color) {
  const cells = BK(F.cells), [w, hh] = ext(cells); size = Math.min(size, 330 / hh, 480 / w);
  const K = new Folder(svg, { cells, bottom: bIndex(F.cells, F.bottom), size, cx: 0, cy: 0, color });
  const [dx, dy] = K.flatOffset(); K.cx = fx - dx; K.cy = fy - dy; K.render();
  return K;
}
const foldSteps = (K, box, opts = {}) => {
  const res = K.result(), steps = [];
  steps.push({ cap: opts.cap1 || 'Step 1. Pick one square to be the <b>bottom</b>.', run: async (c) => { K.showBottom = true; K.render(); await flash(c, K.polys[K.root], 800); } });
  steps.push({ cap: 'Tilt the picture so we can see it in 3-D.', run: (c) => K.camera(c, -28, 36, 1000, box[0], box[1], 118) });
  steps.push({ cap: 'Step 2. Fold the squares that touch the bottom straight up: they are <b>sides</b>.', run: (c) => K.fold(c, [1], 1000) });
  if (K.maxL >= 2) steps.push({ cap: opts.cap3 || 'Step 3. Fold the other squares up against the sides.', run: async (c) => { for (let l = 2; l <= K.maxL; l++) await K.fold(c, [l], 900); } });
  return { steps, res };
};
const foldBox = {
  title: 'The folding machine: will it make an open box?',
  height: 420,
  minW: 900,
  tap: false,
  choices: [{ sep: 'Example 7 check:' }, { v: 'a', label: '(a) X' }, { v: 'b', label: '(b) L' }, { v: 'c', label: '(c) U' }, { v: 'd', label: '(d) P' }],
  ask: (v) => `Example 7(${v}): does the <b>${FOLD[v].name}</b> pentomino fold into an open box?`,
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 900) / 2, svg = stageSvg(stage, W, 420), F = FOLD[v];
    const K = stageFolder(svg, F, ox + 330, 205, 96, PCOL[F.name]);
    const { steps, res } = foldSteps(K, [ox + 330, 270]);
    const ok = !res.overlap.length;
    const st = stamp(stage, ok ? 'yes' : 'no', { ok, x: ox + 740, y: 120, size: 'lg' }); hide(st);
    const note = lab(stage, '', ox + 740, 220, 300, 90, ok ? 'green' : 'red'); hide(note);
    if (v === 'd') {
      // the 2 by 2 block, outlined on the flat shape first
      const blk = BK(F.cells).filter((q, i, all) => [[1, 0], [0, 1], [1, 1]].every(([dc, dr]) => all.some((r) => r[0] === q[0] + dc && r[1] === q[1] + dr)))[0];
      const p0 = K.proj(sub3([blk[0], -blk[1], 0], K.o)), out = svgEl('rect', { x: p0[0] - 6, y: p0[1] - 6, width: 2 * K.s + 12, height: 2 * K.s + 12, rx: 8, fill: 'none', stroke: RED, 'stroke-width': 5, 'stroke-dasharray': '10 7' }, svg); hide(out);
      steps.unshift({ cap: 'Quick elimination: the P has a <b>2 by 2 block</b>, so it is out right away.', run: async (c) => { await op(c, out, 1, 300); await flash(c, out, 800); } });
      steps[1] = { cap: 'Check by folding anyway. Step 1: pick a bottom.', run: async (c) => { await op(c, out, 0, 300); K.showBottom = true; K.render(); await flash(c, K.polys[K.root], 700); } };
    }
    const verdict = {
      a: ['Bottom and 4 different sides. The top stays open. <b>Yes!</b>', 'bottom + 4 sides'],
      b: ['The column of 4 wraps around as the 4 sides; the extra square is the bottom. <b>Yes!</b>', '4 sides wrap around'],
      c: ['Step 4. The two tips both land on the <b>back</b>: they overlap, and the front is missing. <b>No.</b>', 'two squares on the back'],
      d: ['Two squares land on the same face. <b>No:</b> a 2 by 2 block never folds.', 'two squares on one face']
    }[v];
    steps.push({ cap: verdict[0], run: async (c) => {
      if (!ok) { res.overlap.forEach((i) => K.bad.add(i)); K.render(); await flash(c, res.overlap.map((i) => K.polys[i]), 900); }
      setL(note, verdict[1]); await stampIn(c, st); await c.fadeIn(note, 300);
      await K.camera(c, ok ? 30 : 20, 36, 1600);
    } });
    return steps;
  }
};
/* Example 9: Owen's P, and the X with a lid */
const lid = {
  title: '5 squares is not enough; a 6th square makes a lid',
  height: 420,
  minW: 900,
  tap: false,
  choices: [{ sep: 'Example 9 check:' }, { v: 'a', label: '(a) Owen’s P' }, { v: 'b', label: '(b) X plus one square' }],
  ask: (v) => (v === 'a' ? 'Example 9(a): Owen says P has 5 squares and an open box has 5 faces, so P must fold into an open box. Is he right?' : 'Example 9(b): add one square to the X pentomino to make a net of a <b>closed</b> cube (6 faces).'),
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 900) / 2, svg = stageSvg(stage, W, 420);
    if (v === 'a') {
      const K = stageFolder(svg, FOLD.d, ox + 330, 205, 96, PCOL.P), res = K.result();
      const st = stamp(stage, 'not enough!', { ok: false, x: ox + 740, y: 130 }); hide(st);
      return [
        { cap: 'P has 5 squares, and an open box has 5 faces. That part is true …', run: (c) => flash(c, K.polys, 900) },
        { cap: '… but each square must land on a <b>different</b> face. Pick a bottom and fold it.', run: async (c) => { K.showBottom = true; K.render(); await K.camera(c, -28, 36, 900, ox + 330, 270, 118); } },
        { cap: 'Fold up the sides, then the rest.', run: async (c) => { for (let l = 1; l <= K.maxL; l++) await K.fold(c, [l], 850); } },
        { cap: 'Two squares land on the same face (red). 5 squares is needed, but <b>not enough</b>: Owen is wrong.', run: async (c) => { res.overlap.forEach((i) => K.bad.add(i)); K.render(); await flash(c, res.overlap.map((i) => K.polys[i]), 900); await stampIn(c, st); } }
      ];
    }
    const F = { cells: '1/0,0/1,1/1,2/1,1/2,1/3', bottom: '1/1' };
    const K = stageFolder(svg, F, ox + 330, 205, 90, PCOL.X), lidI = 5; hide(K.polys[lidI]);
    const st = stamp(stage, 'a cube!', { ok: true, x: ox + 740, y: 130 }); hide(st);
    return [
      { cap: 'The X folds into an open box with the middle square as the bottom.', run: async (c) => { K.showBottom = true; K.render(); await K.camera(c, -28, 36, 900, ox + 330, 300, 112); await K.fold(c, [1], 900); } },
      { cap: 'The open top is across from the bottom. So add the new square to the <b>end of an arm</b> …', run: async (c) => { await op(c, K.polys[lidI], 1, 400); await flash(c, K.polys[lidI], 700); } },
      { cap: '… and it folds over as the <b>lid</b>.', run: (c) => K.fold(c, [2], 1200) },
      { cap: 'Bottom, 4 sides and a lid: 6 different faces. A closed cube!', run: async (c) => { await stampIn(c, st); await K.camera(c, 30, 30, 1500); } }
    ];
  }
};
/* Full notes: why a 2 by 2 block never folds */
const cubeCorner = {
  title: 'Four squares at a point, three faces at a corner',
  height: 400,
  minW: 900,
  tap: false,
  ask: 'Why does a 2 by 2 block of squares never fold into a box?',
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 900) / 2, svg = stageSvg(stage, W, 400);
    const F = { cells: '0/0,1/0,0/1,1/1', bottom: '0/0' };
    const K = stageFolder(svg, F, ox + 260, 190, 100, '#d9c27a'), res = K.result();
    const mid = K.proj(sub3([1, -1, 0], K.o));
    const dot = svgEl('circle', { cx: mid[0], cy: mid[1], r: 11, fill: RED, stroke: '#fff', 'stroke-width': 3 }, svg); hide(dot);
    const four = lab(stage, '4 squares meet here', mid[0], mid[1] + 120, 220, 30, 'red'); hide(four);
    // a cube on the right with the three faces at its front-top corner
    const cube = svgEl('g', {}, svg), cx0 = ox + 690, cy0 = 210, a = 78;
    poly(cube, [[cx0, cy0], [cx0 + a * 0.87, cy0 - a * 0.5], [cx0 + a * 0.87, cy0 + a * 0.5], [cx0, cy0 + a]], { fill: shade('#d9c27a', 0.85) });
    poly(cube, [[cx0, cy0], [cx0 - a * 0.87, cy0 - a * 0.5], [cx0 - a * 0.87, cy0 + a * 0.5], [cx0, cy0 + a]], { fill: shade('#d9c27a', 1.0) });
    poly(cube, [[cx0, cy0], [cx0 + a * 0.87, cy0 - a * 0.5], [cx0, cy0 - a], [cx0 - a * 0.87, cy0 - a * 0.5]], { fill: shade('#d9c27a', 1.15) });
    svgEl('circle', { cx: cx0, cy: cy0, r: 11, fill: RED, stroke: '#fff', 'stroke-width': 3 }, cube);
    const three = lab(stage, 'only 3 faces meet at a corner', cx0, cy0 + a + 40, 300, 30, 'red');
    hide(cube, three);
    const st = stamp(stage, 'overlap!', { ok: false, x: ox + 690, y: 70 }); hide(st);
    return [
      { cap: 'In a 2 by 2 block, <b>4 squares</b> meet at the middle point.', run: async (c) => { await c.pop(dot, 360); await c.fadeIn(four, 300); } },
      { cap: 'On a cube, only <b>3 faces</b> meet at a corner. So the 4 squares can not all fit around one corner.', run: async (c) => { await op(c, cube, 1, 400); await c.fadeIn(three, 300); } },
      { cap: 'Fold it to see: pick a bottom, and fold up the two squares that touch it.', run: async (c) => { await Promise.all([op(c, dot, 0, 250), op(c, four, 0, 250)]); K.showBottom = true; await K.camera(c, -28, 36, 900, ox + 260, 280, 120); await K.fold(c, [1], 900); } },
      { cap: 'The 4th square has to fold onto a side that is already there. They overlap.', run: async (c) => { await K.fold(c, [2], 900); res.overlap.forEach((i) => K.bad.add(i)); K.render(); await stampIn(c, st); await K.camera(c, 22, 36, 1200); } },
      { cap: 'So any pentomino with a 2 by 2 block (like the P) is eliminated right away.', run: (c) => flash(c, res.overlap.map((i) => K.polys[i]), 800) }
    ];
  }
};

mountExplainers({ countSquares, tanAreas, twoSmall, bigTriangle, turnFlip, orientations, allTwelve, foldBox, cubeCorner, lid });

/* ============================== hands-on tools ============================== */
const btn = (label, fn, cls = 'pill small') => { const b = h('button', cls, label); b.type = 'button'; b.addEventListener('click', fn); return b; };
/** the rot/flip/x/y that puts tangram piece id exactly on a target polygon (px) */
function fitTan(api, id, tpx) {
  const cen = centroid(tpx), p = api.pieces[id], save = { ...p.st };
  let found = null;
  for (const flip of [false, true]) for (let rot = 0; rot < 360 && !found; rot += 45) {
    api.set(id, { x: cen[0], y: cen[1], rot, flip });
    const w = api.worldPts(id);
    if (w.length === tpx.length && tpx.every((q) => w.some((r) => Math.hypot(q[0] - r[0], q[1] - r[1]) < 1.5))) found = { x: cen[0], y: cen[1], rot, flip };
  }
  api.set(id, save);
  if (!found) console.warn('u5l1: no fit for', id);
  return found;
}
function tanSolved(api, ids, tpx) {
  const xs = tpx.map((p) => p[0]), ys = tpx.map((p) => p[1]); let n = 0, bad = 0;
  const W = ids.map((id) => api.worldPts(id));
  for (let x = Math.min(...xs) + 3.1; x < Math.max(...xs); x += 7) for (let y = Math.min(...ys) + 2.7; y < Math.max(...ys); y += 7) {
    if (!inPoly([x, y], tpx)) continue; n++;
    if (W.filter((w) => inPoly([x, y], w)).length !== 1) bad++;
  }
  return n > 0 && bad <= n * 0.01;
}
function tanFree() {
  const host = document.getElementById('u5l1-tan'); if (!host) return;
  Geo.tangram(host, { width: 960, height: 420, unit: 62, labels: 'name' });
}
function silTool() {
  const host = document.getElementById('u5l1-sil'), bar = document.getElementById('u5l1-silbar'); if (!host || !bar) return;
  const r = Math.SQRT2, W = 960, H = 420;
  const PUZ = {
    a: { label: '4(a) The square: 5 pieces', u: 72, grid: false, size: [2 * r, 2 * r], target: [[0, 0], [2 * r, 0], [2 * r, 2 * r], [0, 2 * r]], pieces: Object.fromEntries(FIVE.map(([id, pts]) => [id, pts.map(([x, y]) => [x * r, (2 - y) * r])])) },
    b: { label: '4(b) The triangle: all 7', u: 52, size: [8, 4], target: [[0, 4], [8, 4], [4, 0]], pieces: Object.fromEntries(Object.entries(TRI7).map(([id, pts]) => [id, pts.map(([x, y]) => [x, 4 - y])])) },
    sq: { label: 'The big square: all 7', u: 62, size: [4, 4], target: [[0, 0], [4, 0], [4, 4], [0, 4]], pieces: null }
  };
  let api = null, cur = null, layout = null, tpx = null;
  const status = h('span', 'u5l1-status', '');
  const chips = Object.entries(PUZ).map(([k, P]) => { const b = btn(P.label, () => build(k)); b.dataset.k = k; return b; });
  bar.append(...chips, btn('Show me', () => { if (api && layout) api.arrange(liveCtx(), layout, 1100); }), btn('Mix them up', () => { if (api) api.scatter(liveCtx(), 700); }), status);
  function check() { if (!api) return; const ok = tanSolved(api, Object.keys(api.pieces), tpx); status.textContent = ok ? 'Solved! ✓' : ''; status.className = 'u5l1-status' + (ok ? ' ok' : ''); }
  function build(k) {
    cur = PUZ[k]; chips.forEach((b) => b.classList.toggle('on', b.dataset.k === k));
    host.innerHTML = ''; status.textContent = '';
    const u = cur.u, at = [Math.round(W - cur.size[0] * u - 50), Math.round((H - cur.size[1] * u) / 2)];
    const ids = cur.pieces ? Object.keys(cur.pieces) : Object.keys(Geo.TANGRAM);
    api = Geo.tangram(host, { width: W, height: H, unit: u, at, target: cur.target, targetAt: at, pieces: ids, grid: cur.grid !== false, buttons: false, onChange: () => check() });
    tpx = cur.target.map(([x, y]) => [at[0] + x * u, at[1] + y * u]);
    if (cur.pieces) { layout = {}; Object.entries(cur.pieces).forEach(([id, pts]) => { layout[id] = fitTan(api, id, pts.map(([x, y]) => [at[0] + x * u, at[1] + y * u])); }); } else layout = api.squareLayout;
  }
  build('b');
}
function pen12() {
  const host = document.getElementById('u5l1-pen12'); if (!host) return;
  Geo.pentomino(host, { width: 960, height: 470, cell: 38 });
}
function tileTool() {
  const host = document.getElementById('u5l1-tile'); if (!host) return;
  const cs = 46, at = [13, 1], status = h('span', 'u5l1-status', '');
  const api = Geo.pentomino(host, { width: 960, height: 300, cell: cs, letters: 'LTY', board: { cols: 5, rows: 3, at }, onChange: (s) => { const e = s.extra; if (!e) return; status.textContent = `${e.covered} of ${e.cells} squares covered${e.filled ? ': tiled! ✓' : ''}`; status.className = 'u5l1-status' + (e.filled ? ' ok' : ''); } });
  const layout = {};
  TILE.forEach(([L, cells]) => {
    const tgt = cells.map(([a, b]) => [a + at[0], b + at[1]]), key = (cs2) => cs2.map((q) => q.join(',')).sort().join(' '), K = key(tgt);
    const xs = tgt.map((q) => q[0]), ys = tgt.map((q) => q[1]), x = ((Math.min(...xs) + Math.max(...xs) + 1) / 2) * cs, y = ((Math.min(...ys) + Math.max(...ys) + 1) / 2) * cs;
    const p = api.pieces[L], save = { ...p.st };
    for (const flip of [false, true]) for (const rot of [0, 90, 180, 270]) { if (layout[L]) break; api.set(L, { x, y, rot, flip }); if (key(api.cellsOf(L)) === K) layout[L] = { x, y, rot, flip }; }
    api.set(L, save);
    if (!layout[L]) console.warn('u5l1: no tiling fit for', L);
  });
  const row = h('div', 'u5l1-trow'); row.append(btn('Show me', () => api.arrange(liveCtx(), layout, 1100)), status);
  host.appendChild(row);
}
function foldTool() {
  const host = document.getElementById('u5l1-fold'); if (!host) return;
  host.classList.add('u5l1-fold');
  const Wd = 640, Hd = 400, svg = svgEl('svg', { width: Wd, height: Hd, viewBox: `0 0 ${Wd} ${Hd}`, role: 'img', 'aria-label': 'A pentomino that folds up into a box' }, host);
  const side = h('div', 'u5l1-fside'); host.appendChild(side);
  const letters = h('div', 'u5l1-letters'), msg = h('p', '', ''), status = h('div', 'u5l1-status', '');
  let K = null, busy = false, cur = 'X';
  const place = () => { K.s = 66; const [dx, dy] = K.flatOffset(); K.cx = Wd / 2 - dx; K.cy = Hd / 2 - dy + 10; K.yaw = 0; K.pitch = 90; K.render(); };
  const tap = (i) => { if (busy || !K.isFlat()) return; K.bad.clear(); K.setBottom(i); K.showBottom = true; place(); status.textContent = ''; msg.innerHTML = 'Bottom picked. Press <b>Fold it</b>.'; };
  const letterBtns = 'FILNPTUVWXYZ'.split('').map((L) => { const b = btn(L, () => choose(L)); b.dataset.l = L; return b; });
  letters.append(...letterBtns);
  function choose(L) {
    if (busy) return; cur = L; letterBtns.forEach((b) => b.classList.toggle('on', b.dataset.l === L));
    const cells = Geo.PENTOMINOES[L].map((q) => q.slice());
    const mx = avg(cells, 0), my = avg(cells, 1), b = cells.map((q, i) => [i, Math.hypot(q[0] + 0.5 - mx, q[1] + 0.5 - my)]).sort((p, q) => p[1] - q[1])[0][0];
    if (!K) K = new Folder(svg, { cells, bottom: b, size: 66, cx: Wd / 2, cy: Hd / 2, color: PCOL[L], onTap: tap }); else { K.color = PCOL[L]; K.setCells(cells, b); }
    K.showBottom = true; place(); status.textContent = ''; msg.innerHTML = '<b>Tap a square</b> to make it the bottom (brown). Then press <b>Fold it</b>.';
  }
  async function doFold() {
    if (busy || !K.isFlat()) return; busy = true; const c = liveCtx(), res = K.result();
    await K.camera(c, -28, 36, 900, Wd / 2, Hd / 2 + 70, 110);
    for (let l = 1; l <= K.maxL; l++) await K.fold(c, [l], 800);
    if (res.overlap.length) { res.overlap.forEach((i) => K.bad.add(i)); K.render(); status.textContent = 'Two squares land on the same face.'; status.className = 'u5l1-status no'; msg.innerHTML = 'Try a different bottom square before you give up.'; }
    else if (res.lid) { status.textContent = '5 different faces: an open box!'; status.className = 'u5l1-status ok'; msg.innerHTML = 'It works, but the open side faces sideways. Another bottom square puts the opening on top.'; }
    else { status.textContent = 'It folds into an open box! ✓'; status.className = 'u5l1-status ok'; msg.innerHTML = 'Bottom and 4 different sides. The top is open.'; }
    await K.camera(c, 25, 36, 1400);
    busy = false;
  }
  async function flat() {
    if (busy || K.isFlat()) return; busy = true; const c = liveCtx(); K.bad.clear();
    for (let l = K.maxL; l >= 1; l--) await K.fold(c, [l], 450, 0);
    K.s = 66; const [dx, dy] = K.flatOffset(); K.s = 110; await K.camera(c, 0, 90, 700, Wd / 2 - dx, Hd / 2 - dy + 10, 66);
    status.textContent = ''; msg.innerHTML = '<b>Tap a square</b> to make it the bottom. Then press <b>Fold it</b>.'; busy = false;
  }
  const row = h('div', 'u5l1-trow'); row.append(btn('Fold it', doFold, 'pill'), btn('Flat again', flat, 'pill'));
  side.append(letters, row, status, msg);
  choose(cur);
}

/* ============================== Math History: Tetris (an animation) ============================== */
function histAnim() {
  const svg = document.getElementById('u5l1-hist'); if (!svg) return;
  const card = svg.closest('.history'), reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const P1 = '#7a4a26', FILL = '#c9a77c', GOLD = '#b07a12';
  let anims = [];
  function build(play) {
    anims.forEach((a) => a.cancel()); anims = []; svg.innerHTML = '';
    svgEl('rect', { x: 0, y: 0, width: 600, height: 300, fill: '#fffaf1' }, svg);
    const A = (el, kf, o) => { if (!play) { const last = kf[kf.length - 1]; Object.assign(el.style, last); return; } const a = el.animate(kf, Object.assign({ fill: 'both', easing: 'ease-in-out' }, o)); anims.push(a); };
    // the pentomino (cell 34) at the left
    const c1 = 34, px = 92, py = 66;
    const t5 = txt(svg, 120, 36, 'a pentomino: 5 squares', { size: 19, font: 'Georgia, serif', fill: '#4a2c14' });
    const t4 = txt(svg, 120, 36, 'a Tetris piece: 4 squares', { size: 19, font: 'Georgia, serif', fill: GOLD });
    const topSq = tg(svg); svgEl('rect', { x: px, y: py, width: c1, height: c1, fill: P1, stroke: '#fffaf1', 'stroke-width': 2 }, topSq);
    // the L tetromino, drawn at its final place in the well (cell 20), moved by a transform
    const wx = 360, wy = 40, c2 = 20;
    svgEl('rect', { x: wx - 4, y: wy, width: 10 * c2 + 8, height: 12 * c2 + 4, fill: 'none', stroke: '#4a2c14', 'stroke-width': 3 }, svg);
    gridLines(svg, wx, wy, 10, 12, c2, { color: '#eadfcd', w: 1 });
    const blk = (g, a, b, f) => svgEl('rect', { x: wx + a * c2, y: wy + b * c2, width: c2, height: c2, fill: f, stroke: '#fffaf1', 'stroke-width': 1.5 }, g);
    const rowG = tg(svg), upG = tg(svg);
    for (let a = 0; a < 10; a++) if (a !== 4 && a !== 5) blk(rowG, a, 11, FILL);
    [0, 1, 2, 3, 6, 7].forEach((a) => blk(upG, a, 10, FILL)); [0, 1, 8].forEach((a) => blk(upG, a, 9, FILL));
    const LG = tg(svg), Lup = tg(LG), Lrow = tg(LG);
    blk(Lup, 4, 9, P1); blk(Lup, 4, 10, P1); blk(Lrow, 4, 11, P1); blk(Lrow, 5, 11, P1);
    const k = c1 / c2, start = `translate(${px - k * (wx + 4 * c2)}px, ${py + c1 - k * (wy + 9 * c2)}px) scale(${k})`;
    const name = txt(svg, 150, 260, 'TETRIS = tetra (four) + tennis', { size: 19, font: 'Georgia, serif', fill: '#4a2c14' });
    const arrow = svgEl('path', { d: 'M215 150 C 260 120, 300 110, 340 120', fill: 'none', stroke: GOLD, 'stroke-width': 3, 'stroke-dasharray': '6 5' }, svg);
    // timeline (ms)
    A(t4, [{ opacity: 0 }, { opacity: 0, offset: 0.99 }, { opacity: 1 }], { duration: 2300 });
    A(t5, [{ opacity: 1 }, { opacity: 1, offset: 0.99 }, { opacity: 0 }], { duration: 2300 });
    A(topSq, [{ transform: 'translate(0,0)', opacity: 1 }, { transform: 'translate(0,-34px)', opacity: 0 }], { duration: 800, delay: 1300 });
    A(arrow, [{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: 2500 });
    A(LG, [{ transform: start }, { transform: start, offset: 0.3 }, { transform: 'translate(0px,-180px) scale(1)' }], { duration: 3000 + 1200, delay: 0, easing: 'ease-in-out' });
    if (play) { const a = LG.animate([{ transform: 'translate(0px,-180px)' }, { transform: 'translate(0px,0px)' }], { duration: 1500, delay: 4300, fill: 'forwards', easing: 'steps(9, end)' }); anims.push(a); } else LG.style.transform = 'none';
    A(rowG, [{ opacity: 1 }, { opacity: 1 }, { opacity: 0 }], { duration: 900, delay: 6000 });
    A(Lrow, [{ opacity: 1 }, { opacity: 1 }, { opacity: 0 }], { duration: 900, delay: 6000 });
    const flashR = svgEl('rect', { x: wx, y: wy + 11 * c2, width: 10 * c2, height: c2, fill: GOLD }, svg);
    A(flashR, [{ opacity: 0 }, { opacity: 1, offset: 0.3 }, { opacity: 1, offset: 0.6 }, { opacity: 0 }], { duration: 900, delay: 6000 });
    A(upG, [{ transform: 'translate(0,0)' }, { transform: `translate(0,${c2}px)` }], { duration: 350, delay: 7000 });
    A(Lup, [{ transform: 'translate(0,0)' }, { transform: `translate(0,${c2}px)` }], { duration: 350, delay: 7000 });
    const plus = txt(svg, wx + 5 * c2, wy + 11 * c2 - 6, 'a full row!', { size: 18, font: 'Georgia, serif', fill: GOLD });
    A(plus, [{ opacity: 0 }, { opacity: 1, offset: 0.2 }, { opacity: 1, offset: 0.8 }, { opacity: 0 }], { duration: 1600, delay: 6000 });
    A(name, [{ opacity: 0 }, { opacity: 1 }], { duration: 600, delay: 7600 });
    if (!play) { flashR.style.opacity = 0; plus.style.opacity = 0; }
  }
  const play = () => build(!reduce);
  build(false);
  svg.addEventListener('click', play);
  const rb = card && card.querySelector('.hist-play'); if (rb) rb.addEventListener('click', play);
  let seen = false;
  new IntersectionObserver((es) => { es.forEach((e) => { if (e.isIntersecting && !seen) { seen = true; play(); } }); }, { threshold: 0.5 }).observe(svg);
}

/* ============================== Stand Up Break! ============================== */
function gridFig(m, n) {
  const s = 34, w = n * s + 8, hh = m * s + 8;
  let out = `<svg viewBox="0 0 ${w} ${hh}" width="${w}" height="${hh}" style="max-width:100%">`;
  for (let i = 0; i <= n; i++) out += `<line x1="${4 + i * s}" y1="4" x2="${4 + i * s}" y2="${4 + m * s}" stroke="#1c2230" stroke-width="2.4"/>`;
  for (let j = 0; j <= m; j++) out += `<line x1="4" y1="${4 + j * s}" x2="${4 + n * s}" y2="${4 + j * s}" stroke="#1c2230" stroke-width="2.4"/>`;
  return out + '</svg>';
}
function rectCount(m, n) {
  const lines = []; let total = 0;
  for (let k = 1; k <= Math.min(m, n); k++) { const a = m - k + 1, b = n - k + 1; total += a * b; lines.push(`${k}\\text{ by }${k}:\\ ${a}\\times${b}=${a * b}`); }
  return { lines, total };
}
standup('u5l1', {
  intro: 'Write every step. Make a systematic list. Check the area first.',
  levels: {
    BEG: (r) => {
      const s = r.pick([4, 10, 16, 24, 40, 60]), kind = r.pick([['small triangle', 1], ['medium triangle', 2], ['square', 2], ['parallelogram', 2], ['large triangle', 4]]);
      const A = s * s, sm = A / 16, ans = sm * kind[1];
      const a = [`\\text{whole square: }${s}\\times${s}=${fmtT(A)}\\text{ cm}^2`, `\\text{small triangle: }${fmtT(A)}\\div16=${fmtT(sm)}\\text{ cm}^2`];
      if (kind[1] > 1) a.push(`\\text{${kind[0]}: }${kind[1]}\\times${fmtT(sm)}=${fmtT(ans)}\\text{ cm}^2`);
      return { text: `A tangram is cut from a square of card <b>${s} cm by ${s} cm</b>. Find the area of one <b>${kind[0]}</b>.`, q: '', a };
    },
    PRG: (r) => {
      const n = r.int(3, 7), [m, k] = r.chance(0.5) ? [2, n] : [n, 2], { lines, total } = rectCount(m, k);
      return { text: `How many squares of <b>any</b> size are in this ${m} by ${k} grid? Make a systematic list by size.`, q: '', fig: gridFig(m, k), a: [...lines, `\\text{total: }${total}`] };
    },
    MAS: (r) => {
      const a = r.pick([3, 4]), b = r.int(a + 1, a + 4), [m, n] = r.chance(0.5) ? [a, b] : [b, a], { lines, total } = rectCount(m, n);
      return { text: `How many squares of <b>any</b> size are in this ${m} by ${n} grid? Make a systematic list by size.`, q: '', fig: gridFig(m, n), a: [...lines, `\\text{total: }${total}`] };
    }
  }
});

drawFigs();
tanFree();
silTool();
pen12();
tileTool();
foldTool();
histAnim();
