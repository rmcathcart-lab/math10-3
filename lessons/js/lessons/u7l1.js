/* Math 10-3 · Unit 7 · Lesson 1 — Squares, Square Roots and Triangle Basics (refresher).
 * Explainers (Class view unless marked Full): squares built from tiles row by row (Example 1 check, "6² is not 12"),
 * squares of decimals on a unit grid (Full; Example 2 checks), the square-root machine with guess-and-check tiles
 * (Example 3(a) check), a number line that zooms in between two perfect squares (Example 5 checks), a verdict check by
 * squaring with comparison bars (Example 6 checks), tearing the corners off a triangle into a 180° half-circle (Example 7
 * checks), a triangle sorter with "by sides" and "by angles" bins (Example 8 checks), why only one big angle and why the
 * hypotenuse is longest (Full), the finger slide to the hypotenuse and side letters (Example 9 checks), and the ladder
 * against a wall that slides while its two acute angles keep adding to 90° (Example 10 check).
 * Also the static figures (geo.js helpers) and the Stand Up Break. */
import { h, add, tex, svgEl, tween, anim, stamp, stampIn, pulse, sleep, mountExplainers } from '../blocks.js';
import { Geo } from '../geo.js';
import { standup } from '../standup.js';

const A = Geo.at, n360 = Geo.n360, arcD = Geo.arcD, wedgeD = Geo.wedgeD, dirTo = Geo.dirTo;
const INK = '#1c2230', BLUE = '#1f5bd6', GREEN = '#12805a', RED = '#c93a33', AMBER = '#c27a0e', BROWN = '#9a6a24', TEAL = '#0f7f7a', GREY = '#9aa0ab', SLATE = '#6a7182';
const TILE = '#f2c14e', TILE_S = '#a8761e', HYP = '#8a5a1c';
const T = (s) => tex(String(s));
const RAD = Math.PI / 180;
/** TeX number with a thin thousands space: 2025 → 2\,025 */
const tn = (v) => String(v).replace(/^(\d+)(\d{3})/, (m, a, b) => (a.length ? a + '\\,' + b : m));
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const op = (c, el, to, ms = 350) => anim(c, el, [{ opacity: to }], ms);
const stageSvg = (stage, W, H) => add(stage, svgEl('svg', { class: 'bk-svg u7l1-svg', width: W, height: H, viewBox: `0 0 ${W} ${H}` }), 0, 0);
const figSvg = (host, W, H) => { host.style.width = W + 'px'; host.style.height = H + 'px'; return svgEl('svg', { class: 'bk-svg u7l1-svg', width: W, height: H, viewBox: `0 0 ${W} ${H}` }, host); };
/** an HTML label centred on (x, y): a 0×0 holder, so c.pop's scale doesn't undo the centring */
function lab(host, html, x, y, cls = '') {
  const hold = h('div', 'u7l1-hold'); hold.appendChild(h('div', 'u7l1-lab ' + cls, html)); add(host, hold, x, y); hold.inner = hold.firstChild; return hold;
}
const moveTo = (hold, x, y) => { hold.style.left = x + 'px'; hold.style.top = y + 'px'; hold.x = x; hold.y = y; };
async function slide(c, hold, x1, y1, ms = 600) {
  const x0 = parseFloat(hold.style.left), y0 = parseFloat(hold.style.top);
  await tween(c, ms, (u) => moveTo(hold, x0 + (x1 - x0) * u, y0 + (y1 - y0) * u));
}
function line(parent, P, Q, o = {}) {
  return svgEl('line', { x1: P[0].toFixed(2), y1: P[1].toFixed(2), x2: Q[0].toFixed(2), y2: Q[1].toFixed(2), stroke: o.color || INK, 'stroke-width': o.width || 3.2, 'stroke-linecap': o.cap || 'round', 'stroke-dasharray': o.dash || null, class: o.cls === undefined ? 'bk-stroke' : o.cls, opacity: o.opacity ?? null }, parent);
}
function path(parent, d, o = {}) {
  return svgEl('path', { d, fill: o.fill || 'none', 'fill-opacity': o.fo ?? null, stroke: o.stroke === undefined ? INK : o.stroke, 'stroke-width': o.width || 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-dasharray': o.dash || null, class: o.cls === undefined ? 'bk-stroke' : o.cls, opacity: o.opacity ?? null }, parent);
}
const polyD = (pts, closed = true) => 'M' + pts.map((p) => p[0].toFixed(2) + ' ' + p[1].toFixed(2)).join('L') + (closed ? 'Z' : '');
const txt = (parent, x, y, s, o = {}) => Geo.text(parent, x, y, s, Object.assign({ size: 21 }, o));
const pp = (el) => { el.style.transformBox = 'fill-box'; el.style.transformOrigin = 'center'; return el; };
/** a group whose transform attribute works about the SVG origin */
const vg = (parent) => { const g = svgEl('g', {}, parent); g.style.transformBox = 'view-box'; g.style.transformOrigin = '0 0'; return g; };
const mid = (P, Q) => [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2];
const cen = (pts) => [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
const dist = (P, Q) => Math.hypot(P[0] - Q[0], P[1] - Q[1]);
const lerp = (P, Q, t) => [P[0] + (Q[0] - P[0]) * t, P[1] + (Q[1] - P[1]) * t];
/** the interior angle at V of the triangle V, P, Q → { st, sp, mid } (math degrees) */
function corner(V, P, Q) { const d1 = dirTo(V, P), d2 = dirTo(V, Q); let st = d1, sp = n360(d2 - d1); if (sp > 180) { st = d2; sp = 360 - sp; } return { st, sp, mid: st + sp / 2 }; }
/** a right-angle square at V, inside the angle starting at direction d */
function rightSq(parent, V, d, s = 17, o = {}) {
  const u = A([0, 0], d, 1), v = A([0, 0], d + 90, 1);
  return path(parent, polyD([[V[0] + u[0] * s, V[1] + u[1] * s], [V[0] + (u[0] + v[0]) * s, V[1] + (u[1] + v[1]) * s], [V[0] + v[0] * s, V[1] + v[1] * s]], false), { width: o.width || 2.4, stroke: o.color || INK, cls: o.cls === undefined ? '' : o.cls });
}
/** angle mark at V (arc, or a square when it is 90°) with a label along the bisector */
function angMark(parent, V, P, Q, label, o = {}) {
  const k = corner(V, P, Q), g = svgEl('g', {}, parent), r = o.r || 30, colr = o.color || INK;
  if (Math.abs(k.sp - 90) < 0.5 && o.square !== false) rightSq(g, V, k.st, o.s || 17, { color: colr });
  else path(g, arcD(V, r, k.st, k.sp), { stroke: colr, width: o.width || 2.4, cls: '' });
  let t = null;
  if (label) { const lr = o.lr || (r + (k.sp < 40 ? 22 : 16)); const p = A(V, k.mid, lr); t = pp(txt(g, p[0], p[1], label, { size: o.size || 19, color: o.lcolor || colr, italic: /^[a-z]$/.test(label) })); }
  return { g, label: t, k };
}
/** a length label just outside side PQ (away from the point R) */
function sideLab(parent, P, Q, R, s, o = {}) {
  const M = mid(P, Q); let nrm = A([0, 0], dirTo(P, Q) + 90, 1);
  if ((R[0] - M[0]) * nrm[0] + (R[1] - M[1]) * nrm[1] > 0) nrm = [-nrm[0], -nrm[1]];
  const sz = o.size || 18, d = (o.gap || 10) + Math.abs(nrm[0]) * (String(s).length * sz * 0.28 + 2) + Math.abs(nrm[1]) * sz * 0.55;
  return pp(txt(parent, M[0] + nrm[0] * d, M[1] + nrm[1] * d, s, { size: sz, color: o.color || INK, italic: o.italic }));
}
/** a tick mark across the middle of PQ (equal sides) */
function tick(parent, P, Q, o = {}) {
  const M = mid(P, Q), n = A([0, 0], dirTo(P, Q) + 90, (o.len || 14) / 2);
  return line(parent, [M[0] - n[0], M[1] - n[1]], [M[0] + n[0], M[1] + n[1]], { width: o.width || 2.6, color: o.color || INK, cls: '' });
}
/** the triangle with base angles al (at A) and be (at B): unit coordinates, y up */
function triAngles(al, be, base = 1) {
  const ac = base * Math.sin(be * RAD) / Math.sin((al + be) * RAD);
  return [[0, 0], [base, 0], [ac * Math.cos(al * RAD), ac * Math.sin(al * RAD)]];
}
/** world points (y up) → px, fitted in a w × h box centred at (cx, cy) */
function fit(pts, cx, cy, w, hh, maxS = 1e9) {
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const s = Math.min(w / (Math.max(...xs) - Math.min(...xs) || 1), hh / (Math.max(...ys) - Math.min(...ys) || 1), maxS);
  const mx = (Math.max(...xs) + Math.min(...xs)) / 2, my = (Math.max(...ys) + Math.min(...ys)) / 2;
  return pts.map(([x, y]) => [cx + (x - mx) * s, cy - (y - my) * s]);
}
/** tiles: one row of n tiles of size s (a group, so a row can drop in) */
function tileRow(parent, x0, y, n, s, fill = TILE, stroke = TILE_S) {
  const g = pp(svgEl('g', {}, parent));
  for (let i = 0; i < n; i++) svgEl('rect', { x: (x0 + i * s + 1.5).toFixed(1), y: (y + 1.5).toFixed(1), width: (s - 3).toFixed(1), height: (s - 3).toFixed(1), rx: 3, fill, stroke, 'stroke-width': 2 }, g);
  return g;
}
const rowIn = (c, g, ms = 230) => anim(c, g, [{ opacity: 0, transform: 'translateY(-24px)' }, { opacity: 1, transform: 'none' }], ms);
const dec3 = (v) => { const s = String(Math.floor(v * 1000) / 1000); return s.indexOf('.') < 0 ? s : s.padEnd(s.indexOf('.') + 4, '0'); };
const r1 = (v) => String(Math.round(v * 10) / 10);

/* ======================================================================================
 * 1. Squares built from tiles (Example 1 check, 6² is not 12)
 * ====================================================================================== */
const tiles = {
  title: 'Squares built from tiles',
  height: 420,
  choices: [{ v: 3, label: T('3^2') }, { v: 5, label: T('5^2') }, { v: 'ex1', label: 'Example 1 check' }, { v: 'trap', label: `${T('6^2')} is not 12` }],
  ask: (v) => (v === 'ex1' ? 'Example 1: the areas of the squares with sides 2, 3, 4 and 5.' : v === 'trap' ? `What does ${T('6^2')} mean: 12 or 36?` : `What is ${T(v + '^2')}?`),
  make(stage, v, ex) {
    const W = ex.W, H = 420, ox = (W - 960) / 2, svg = stageSvg(stage, W, H);
    if (v === 'ex1') {
      const s = 36, ks = [2, 3, 4, 5], base = 320; let x = ox + 138; const items = [];
      ks.forEach((k) => {
        const rows = []; for (let r = 0; r < k; r++) rows.push(hide(tileRow(svg, x, base - (k - r) * s, k, s)));
        const fr = path(svg, polyD([[x, base - k * s], [x + k * s, base - k * s], [x + k * s, base], [x, base]]), { width: 3, dash: '7 6', stroke: GREY, cls: '' });
        const lb = hide(lab(stage, T(`${k}^2=${k * k}`), x + k * s / 2, base + 40, 'u7l1-eq'));
        items.push({ k, rows, fr, lb }); x += k * s + 70;
      });
      const tag = hide(lab(stage, '4, 9, 16, 25: <b>perfect squares</b>', ox + 480, 390, 'u7l1-tag'));
      return [
        ...items.map((it) => ({ cap: `Side ${it.k}: <b>${it.k} rows of ${it.k}</b> tiles. ${T(`${it.k}^2=${it.k}\\times${it.k}=${it.k * it.k}`)}`,
          run: async (c) => { for (const g of it.rows) await rowIn(c, g, 160); await op(c, it.fr, 0, 200); await c.pop(it.lb); } })),
        { cap: 'Each area is a whole number times itself. They are <b>perfect squares</b>.', run: (c) => c.pop(tag) }
      ];
    }
    const n = v === 'trap' ? 6 : v, s = v === 'trap' ? 44 : Math.min(56, 300 / n), side = n * s;
    const x0 = ox + (v === 'trap' ? 140 : 110), y0 = v === 'trap' ? 70 : (H - side) / 2 - 6, px = ox + 690;
    const frame = hide(path(svg, polyD([[x0, y0], [x0 + side, y0], [x0 + side, y0 + side], [x0, y0 + side]]), { width: 3, dash: '8 6', stroke: GREY }));
    const sB = hide(pp(txt(svg, x0 + side / 2, y0 + side + 24, String(n), { size: 24, color: BROWN })));
    const sL = hide(pp(txt(svg, x0 - 22, y0 + side / 2, String(n), { size: 24, color: BROWN })));
    const cnt = lab(stage, '0', px, 110, 'u7l1-big2'); lab(stage, 'tiles', px, 160, 'u7l1-sm');
    if (v === 'trap') {
      const rows = []; for (let r = 0; r < 6; r++) rows.push(hide(tileRow(svg, x0, y0 + r * s, 6, s, r < 2 ? '#f4b9b2' : TILE, r < 2 ? RED : TILE_S)));
      const st1 = hide(stamp(stage, 'not a square', { ok: false, x: x0 + side + 120, y: y0 + 44, size: 'sm' }));
      const e1 = hide(lab(stage, T('6\\times2=12'), px, 240, 'u7l1-eq u7l1-red'));
      const e2 = hide(lab(stage, T('6^2=6\\times6=36'), px, 300, 'u7l1-eq u7l1-box'));
      const st2 = hide(stamp(stage, '✓ a square', { ok: true, x: px, y: 360, size: 'sm' }));
      return [
        { cap: `${T('6^2')} does <b>not</b> mean ${T('6\\times2')}. Those 12 tiles make a long, thin <b>rectangle</b>.`,
          run: async (c) => { for (let r = 0; r < 2; r++) { await rowIn(c, rows[r]); cnt.inner.textContent = String((r + 1) * 6); } await c.pop(e1); await stampIn(c, st1); } },
        { cap: 'A square needs <b>6 rows of 6</b>. Keep adding rows.',
          run: async (c) => { frame.style.opacity = 1; for (let r = 2; r < 6; r++) { await rowIn(c, rows[r]); cnt.inner.textContent = String((r + 1) * 6); } await op(c, frame, 0, 200); await c.pop(sB); await c.pop(sL); } },
        { cap: `${T('6^2=6\\times6=36')}, not 12. The small 2 means “two 6s multiplied”.`, run: async (c) => { await op(c, st1, 0, 200); await c.pop(e2); await stampIn(c, st2); } }
      ];
    }
    const rows = []; for (let r = 0; r < n; r++) rows.push(hide(tileRow(svg, x0, y0 + r * s, n, s)));
    const eq = hide(lab(stage, T(`${n}^2=${n}\\times${n}=${n * n}`), px, 250, 'u7l1-eq u7l1-box'));
    const tag = hide(lab(stage, `${n * n} is a <b>perfect square</b>`, px, 330, 'u7l1-tag'));
    return [
      { cap: `To square ${n}, build a square that is <b>${n} tiles</b> long on each side.`, run: async (c) => { await op(c, frame, 1, 200); await c.pop(sB); await c.pop(sL); } },
      { cap: `Fill it row by row: <b>${n} rows of ${n}</b> tiles.`, run: async (c) => { for (let r = 0; r < n; r++) { await rowIn(c, rows[r]); cnt.inner.textContent = String((r + 1) * n); } await op(c, frame, 0, 200); } },
      { cap: `${T(`${n}^2=${n}\\times${n}=${n * n}`)}. The <b>area</b> of the square is ${n * n} square units.`, run: (c) => c.pop(eq) },
      { cap: `${n * n} is a <b>perfect square</b>: a whole number times itself.`, run: (c) => c.pop(tag) }
    ];
  }
};

/* ======================================================================================
 * 1b. Squares of decimals on a unit grid (Full; Example 2(d), (e) checks)
 * ====================================================================================== */
const small = {
  title: 'Squares of decimals',
  height: 420,
  choices: [{ v: 0.3, label: `Example 2(e): ${T('0.3^2')}` }, { v: 1.5, label: `Example 2(d): ${T('1.5^2')}` }],
  ask: (v) => `Draw ${T(v + '^2')} as a square. How big is it?`,
  make(stage, v, ex) {
    const W = ex.W, H = 420, ox = (W - 960) / 2, svg = stageSvg(stage, W, H), px = ox + 700;
    if (v === 0.3) {
      const S = 330, x0 = ox + 110, y0 = 40, c10 = S / 10;
      const sq = path(svg, polyD([[x0, y0], [x0 + S, y0], [x0 + S, y0 + S], [x0, y0 + S]]), { width: 3, fill: '#fff' });
      const grid = hide(svgEl('g', {}, svg));
      for (let i = 1; i < 10; i++) { line(grid, [x0 + i * c10, y0], [x0 + i * c10, y0 + S], { width: 1, color: GREY, cls: '' }); line(grid, [x0, y0 + i * c10], [x0 + S, y0 + i * c10], { width: 1, color: GREY, cls: '' }); }
      const lB = txt(svg, x0 + S / 2, y0 + S + 22, '1', { size: 22 }), lL = txt(svg, x0 - 20, y0 + S / 2, '1', { size: 22 });
      const strip = hide(svgEl('rect', { x: x0, y: y0, width: 3 * c10, height: S, fill: BLUE, 'fill-opacity': 0.16 }, svg));
      const sm = hide(pp(svgEl('rect', { x: x0, y: y0 + 7 * c10, width: 3 * c10, height: 3 * c10, fill: RED, 'fill-opacity': 0.55, stroke: RED, 'stroke-width': 3 }, svg)));
      const l03 = hide(pp(txt(svg, x0 + 1.5 * c10, y0 + S + 22, '0.3', { size: 20, color: BLUE })));
      const l03b = hide(pp(txt(svg, x0 - 26, y0 + 8.5 * c10, '0.3', { size: 20, color: RED })));
      const one = hide(lab(stage, `each small square: ${T('0.01')}`, px, 90, 'u7l1-eq'));
      const e1 = hide(lab(stage, `strip: ${T('0.3')} of the square`, px, 170, 'u7l1-eq'));
      const e2 = hide(lab(stage, T('0.3^2=0.3\\times0.3=0.09'), px, 250, 'u7l1-eq u7l1-box'));
      const e3 = hide(lab(stage, `${T('0.09<0.3')}: smaller!`, px, 320, 'u7l1-eq u7l1-red'));
      void sq; void lB; void lL;
      return [
        { cap: 'A square 1 unit on each side has an area of <b>1</b>. Split it into 100 small squares: each is <b>0.01</b>.', run: async (c) => { await op(c, grid, 1, 500); await c.pop(one); } },
        { cap: 'A strip 0.3 wide is 3 columns of 10: that is <b>0.3</b> of the square.', run: async (c) => { await op(c, strip, 1, 500); await c.pop(l03); await c.pop(e1); } },
        { cap: 'Now make it 0.3 tall too. A square 0.3 by 0.3 is only <b>3 × 3 = 9</b> small squares.', run: async (c) => { await c.pop(sm, 500); await c.pop(l03b); } },
        { cap: `${T('0.3^2=0.3\\times0.3=0.09')}: 9 of the 100. That is <b>smaller</b> than 0.3.`, run: async (c) => { await c.pop(e2); await c.pop(e3); } }
      ];
    }
    const u = 170, x0 = ox + 100, y0 = 40, S = 1.5 * u;
    const ghost = svgEl('g', {}, svg);
    for (let i = 0; i <= 2; i++) { line(ghost, [x0 + i * u, y0], [x0 + i * u, y0 + 2 * u], { width: 1.4, color: '#d6d0c2', dash: '5 6', cls: '' }); line(ghost, [x0, y0 + i * u], [x0 + 2 * u, y0 + i * u], { width: 1.4, color: '#d6d0c2', dash: '5 6', cls: '' }); }
    const out = path(svg, polyD([[x0, y0 + 2 * u - S], [x0 + S, y0 + 2 * u - S], [x0 + S, y0 + 2 * u], [x0, y0 + 2 * u]]), { width: 3.4 });
    const yb = y0 + 2 * u, yt = yb - S;
    const cut = hide(svgEl('g', {}, svg)); line(cut, [x0 + u, yt], [x0 + u, yb], { width: 2.4, dash: '8 5', color: BROWN, cls: '' }); line(cut, [x0, yb - u], [x0 + S, yb - u], { width: 2.4, dash: '8 5', color: BROWN, cls: '' });
    txt(svg, x0 + S / 2, yb + 24, '1.5', { size: 22 }); txt(svg, x0 - 30, yb - S / 2, '1.5', { size: 22 });
    const big = hide(pp(svgEl('rect', { x: x0 + 2, y: yb - u + 2, width: u - 4, height: u - 4, fill: TILE, 'fill-opacity': 0.75 }, svg)));
    const st1 = hide(pp(svgEl('rect', { x: x0 + u + 2, y: yb - u + 2, width: 0.5 * u - 4, height: u - 4, fill: BLUE, 'fill-opacity': 0.25 }, svg)));
    const st2 = hide(pp(svgEl('rect', { x: x0 + 2, y: yt + 2, width: u - 4, height: 0.5 * u - 4, fill: BLUE, 'fill-opacity': 0.25 }, svg)));
    const cr = hide(pp(svgEl('rect', { x: x0 + u + 2, y: yt + 2, width: 0.5 * u - 4, height: 0.5 * u - 4, fill: RED, 'fill-opacity': 0.35 }, svg)));
    const tB = hide(pp(txt(svg, x0 + u / 2, yb - u / 2, '1', { size: 26 })));
    const tS1 = hide(pp(txt(svg, x0 + 1.25 * u, yb - u / 2, '0.5', { size: 20, color: BLUE })));
    const tS2 = hide(pp(txt(svg, x0 + u / 2, yt + 0.25 * u, '0.5', { size: 20, color: BLUE })));
    const tC = hide(pp(txt(svg, x0 + 1.25 * u, yt + 0.25 * u, '0.25', { size: 18, color: RED })));
    const e1 = hide(lab(stage, T('1+0.5+0.5+0.25=2.25'), px + 20, 200, 'u7l1-eq'));
    const e2 = hide(lab(stage, T('1.5^2=1.5\\times1.5=2.25'), px + 20, 270, 'u7l1-eq u7l1-box'));
    const e3 = hide(lab(stage, `${T('2.25>1.5')}: bigger`, px + 20, 335, 'u7l1-eq'));
    void out;
    return [
      { cap: 'A square <b>1.5</b> units on each side. Cut it where the 1 ends.', run: (c) => op(c, cut, 1, 500) },
      { cap: 'One whole 1 by 1 square: <b>1</b>.', run: async (c) => { await c.pop(big, 450); await c.pop(tB); } },
      { cap: 'Two strips, each 1 by 0.5: <b>0.5 + 0.5</b>.', run: async (c) => { await c.pop(st1, 400); await c.pop(tS1); await c.pop(st2, 400); await c.pop(tS2); } },
      { cap: 'A small corner, 0.5 by 0.5: <b>0.25</b>.', run: async (c) => { await c.pop(cr, 400); await c.pop(tC); } },
      { cap: `Add the pieces: ${T('1.5^2=2.25')}. A number <b>more than 1</b> gets bigger when you square it.`, run: async (c) => { await c.pop(e1); await c.pop(e2); await c.pop(e3); } }
    ];
  }
};

/* ======================================================================================
 * 2. The square-root machine: guess and check with tiles (Example 3(a) check)
 * ====================================================================================== */
const undo = {
  title: 'Square roots undo squaring',
  height: 430,
  choices: [{ v: 49, label: T('\\sqrt{49}') }, { v: 'ex3', label: 'Example 3(a) check' }],
  ask: (v) => (v === 49 ? 'A square has an area of 49. How long is each side?' : `Example 3(a): ${T('\\sqrt{36}')}, ${T('\\sqrt{100}')}, ${T('\\sqrt{169}')} and ${T('\\sqrt{1}')}.`),
  make(stage, v, ex) {
    const W = ex.W, H = 430, ox = (W - 960) / 2, svg = stageSvg(stage, W, H);
    const cxL = ox + 205, cyL = 200, mx = ox + 670, my = 150;
    const sqG = svgEl('g', {}, svg);
    function grid(k, filled, colr) {
      sqG.innerHTML = ''; const s = Math.min(290 / k, 44), side = k * s, x0 = cxL - side / 2, y0 = cyL - side / 2;
      if (filled) for (let r = 0; r < k; r++) tileRow(sqG, x0, y0 + r * s, k, s);
      else {
        svgEl('rect', { x: x0, y: y0, width: side, height: side, fill: colr || '#fdf6e6' }, sqG);
        for (let i = 1; i < k; i++) { line(sqG, [x0 + i * s, y0], [x0 + i * s, y0 + side], { width: 1, color: GREY, cls: '' }); line(sqG, [x0, y0 + i * s], [x0 + side, y0 + i * s], { width: 1, color: GREY, cls: '' }); }
      }
      path(sqG, polyD([[x0, y0], [x0 + side, y0], [x0 + side, y0 + side], [x0, y0 + side]]), { width: 3, cls: '' });
      txt(sqG, cxL, y0 + side + 20, String(k), { size: 20, color: BROWN });
    }
    const mach = h('div', 'u7l1-mach', T('\\sqrt{\\ }')); mach.style.width = '150px'; mach.style.height = '116px'; add(stage, mach, mx - 75, my - 58);
    lab(stage, 'the √ key', mx, my + 78, 'u7l1-sm');
    const read = hide(lab(stage, '&nbsp;', cxL, 392, 'u7l1-eq'));
    if (v === 49) {
      const inC = lab(stage, '<b>49</b>', mx - 215, my, 'u7l1-card'); lab(stage, 'area', mx - 215, my - 50, 'u7l1-sm');
      const outC = hide(lab(stage, '<b>7</b>', mx + 215, my, 'u7l1-card u7l1-teal')); const outL = hide(lab(stage, 'side', mx + 215, my - 50, 'u7l1-sm'));
      const chk = hide(lab(stage, `Check: ${T('7^2=49')} ✓`, mx, 300, 'u7l1-eq u7l1-box'));
      const st = hide(stamp(stage, '✓ side 7', { ok: true, x: cxL + 170, y: 70, size: 'sm' }));
      const box = lab(stage, `Area <b>${T('49')}</b>`, cxL, cyL, 'u7l1-card');
      return [
        { cap: 'A square has an <b>area of 49</b>. Which side length makes it?', run: async (c) => { await c.pop(box); } },
        { cap: `Guess and check by squaring: ${T('5^2=25')} is too small. ${T('6^2=36')} is still too small.`, run: async (c) => {
          await op(c, box, 0, 200); grid(5); read.inner.innerHTML = `${T('5\\times5=25')} too small`; await c.pop(read); await sleep(c, 900);
          grid(6); read.inner.innerHTML = `${T('6\\times6=36')} too small`; await c.pop(read); } },
        { cap: `${T('7^2=7\\times7=49')} ✓ The side is <b>7</b>.`, run: async (c) => { grid(7, true); read.inner.innerHTML = `${T('7\\times7=49')} ✓`; await c.pop(read); await stampIn(c, st); } },
        { cap: `The √ key goes straight back: ${T('\\sqrt{49}=7')}, because ${T('7^2=49')}. A square root <b>undoes</b> the square.`, run: async (c) => {
          await slide(c, inC, mx, my, 700); await op(c, inC, 0, 150); await pulse(c, mach, 1.08, 400); outC.style.opacity = 1; await c.pop(outC); await c.pop(outL); await c.pop(chk); } }
      ];
    }
    const L = [[36, 6], [100, 10], [169, 13], [1, 1]];
    const res = L.map(([a, r], i) => hide(lab(stage, T(`\\sqrt{${a}}=${r}`), mx + (i - 1.5) * 140, 330, 'u7l1-eq u7l1-box')));
    const cards = L.map(([a]) => hide(lab(stage, `<b>${a}</b>`, mx - 215, my, 'u7l1-card')));
    const outs = L.map(([, r]) => hide(lab(stage, `<b>${r}</b>`, mx + 215, my, 'u7l1-card u7l1-teal')));
    lab(stage, 'area', mx - 215, my - 50, 'u7l1-sm'); lab(stage, 'side', mx + 215, my - 50, 'u7l1-sm');
    return L.map(([a, r], i) => ({
      cap: `${T(`\\sqrt{${a}}`)}: what number times itself makes ${a}? ${T(`${r}\\times${r}=${a}`)}, so ${T(`\\sqrt{${a}}=${r}`)}.`,
      run: async (c) => {
        if (i) { outs[i - 1].style.opacity = 0; }
        cards[i].style.opacity = 1; await c.pop(cards[i]); await slide(c, cards[i], mx, my, 600); await op(c, cards[i], 0, 150); await pulse(c, mach, 1.08, 350);
        outs[i].style.opacity = 1; await c.pop(outs[i]); grid(r, true); read.inner.innerHTML = T(`${r}\\times${r}=${a}`); await c.pop(read); await c.pop(res[i]);
      }
    }));
  }
};

/* ======================================================================================
 * 3. Estimating: a number line that zooms in between two perfect squares (Example 5 checks)
 * ====================================================================================== */
const zoom = {
  title: 'Zoom in between two perfect squares',
  height: 450,
  choices: [{ v: 50, label: T('\\sqrt{50}') }, { sep: 'Example 5 check:' }, ...[27, 62, 105, 8].map((n) => ({ v: n, label: T(`\\sqrt{${n}}`) }))],
  ask: (v) => `Estimate ${T(`\\sqrt{${v}}`)}. Then check with the calculator.`,
  make(stage, N, ex) {
    const W = ex.W, H = 450, ox = (W - 960) / 2, svg = stageSvg(stage, W, H);
    const lo = Math.floor(Math.sqrt(N)), hi = lo + 1, lo2 = lo * lo, hi2 = hi * hi, dLo = N - lo2, dHi = hi2 - N;
    const closer = dLo < dHi ? lo : hi, closer2 = closer * closer, root = Math.sqrt(N), est = lo + dLo / (hi2 - lo2);
    const yT = 140, xa = ox + 50, ux = 860 / 11, X = (v) => xa + v * ux;
    line(svg, [xa - 20, yT], [X(11) + 30, yT], { width: 3, cls: '' });
    path(svg, `M${X(11) + 30} ${yT}l-12 -7v14z`, { fill: INK, stroke: 'none', cls: '' });
    const above = [];
    for (let k = 0; k <= 11; k++) {
      line(svg, [X(k), yT - 9], [X(k), yT + 9], { width: 2.4, cls: '' });
      txt(svg, X(k), yT + 26, String(k), { size: 20 });
      above.push(lab(stage, T(`\\sqrt{${k * k}}`), X(k), yT - 36, 'u7l1-rt'));
    }
    const eq1 = hide(lab(stage, T(`${lo2}<${N}<${hi2}`), ox + 480, 40, 'u7l1-eq u7l1-box'));
    const seg = hide(line(svg, [X(lo), yT], [X(hi), yT], { width: 9, color: AMBER, opacity: 0.8 }));
    // the zoomed line
    const yZ = 300, za = ox + 110, zb = ox + 850, Z = (v) => za + (v - lo) * (zb - za);
    const zg = hide(svgEl('g', {}, svg));
    line(zg, [X(lo), yT + 10], [za, yZ - 12], { width: 1.6, dash: '6 6', color: GREY, cls: '' }); line(zg, [X(hi), yT + 10], [zb, yZ - 12], { width: 1.6, dash: '6 6', color: GREY, cls: '' });
    line(zg, [za - 20, yZ], [zb + 20, yZ], { width: 3, cls: '' });
    for (let i = 0; i <= 10; i++) { const x = Z(lo + i / 10); line(zg, [x, yZ - (i % 10 ? 7 : 11)], [x, yZ + (i % 10 ? 7 : 11)], { width: i % 10 ? 1.8 : 2.6, cls: '' }); txt(zg, x, yZ + 26, i === 0 ? String(lo) : i === 10 ? String(hi) : (lo + i / 10).toFixed(1), { size: i % 10 ? 16 : 21, color: i % 10 ? SLATE : INK }); }
    // the squares scale under it: lo² … N … hi²
    const yS = 400, sg = hide(svgEl('g', {}, svg)), S = (v) => za + (v - lo2) / (hi2 - lo2) * (zb - za);
    line(sg, [za, yS], [zb, yS], { width: 2, color: BROWN, cls: '' });
    [[lo2, za], [hi2, zb]].forEach(([v, x]) => { line(sg, [x, yS - 7], [x, yS + 7], { width: 2.2, color: BROWN, cls: '' }); txt(sg, x, yS + 22, String(v), { size: 18, color: BROWN }); });
    dot(sg, [S(N), yS], { r: 6, color: RED }); txt(sg, S(N), yS + 22, String(N), { size: 18, color: RED });
    txt(sg, (za + S(N)) / 2, yS - 14, `${dLo} away`, { size: 16, color: dLo < dHi ? RED : SLATE });
    txt(sg, (S(N) + zb) / 2, yS - 14, `${dHi} away`, { size: 16, color: dHi < dLo ? RED : SLATE });
    txt(sg, za - 52, yS, 'squares', { size: 15, color: BROWN });
    const pt = hide(pp(svgEl('circle', { cx: Z(lo + 0.5), cy: yZ, r: 9, fill: RED, stroke: '#fff', 'stroke-width': 2.5 }, svg)));
    const pl = hide(lab(stage, T(`\\sqrt{${N}}`), Z(lo + 0.5), yZ - 36, 'u7l1-eq u7l1-red'));
    const setPt = (v) => { pt.setAttribute('cx', Z(v).toFixed(1)); moveTo(pl, Z(v), yZ - 36); };
    const ans = hide(lab(stage, T(`\\sqrt{${N}}=${dec3(root)}\\ldots\\approx${r1(root)}`), ox + 480, 222, 'u7l1-eq u7l1-box'));
    const ok = hide(stamp(stage, '✓', { ok: true, x: ox + 700, y: 222, size: 'sm' }));
    return [
      { cap: `Find the perfect squares just below and just above ${N}: ${T(`${lo2}<${N}<${hi2}`)}.`, run: async (c) => { [lo, hi].forEach((k) => above[k].inner.classList.add('u7l1-red')); await c.pop(eq1); await pulse(c, above[lo], 1.3); await pulse(c, above[hi], 1.3); } },
      { cap: `Take their square roots: ${T(`\\sqrt{${lo2}}=${lo}`)} and ${T(`\\sqrt{${hi2}}=${hi}`)}. So ${T(`\\sqrt{${N}}`)} is <b>between ${lo} and ${hi}</b>.`, run: async (c) => { seg.style.opacity = 0.8; await anim(c, seg, [{ opacity: 0 }, { opacity: 0.8 }], 500); } },
      { cap: `Zoom in between ${lo} and ${hi}.`, run: async (c) => { await anim(c, zg, [{ opacity: 0, transform: 'scaleY(.3)' }, { opacity: 1, transform: 'none' }], 700); } },
      { cap: `${N} is ${dLo} away from ${lo2} and ${dHi} away from ${hi2}. It is closer to ${closer2}, so ${T(`\\sqrt{${N}}`)} is <b>closer to ${closer}</b>.`, run: async (c) => {
        await op(c, sg, 1, 400); pt.style.opacity = 1; pl.style.opacity = 1; await c.pop(pt); await tween(c, 900, (u) => setPt(lo + 0.5 + (est - lo - 0.5) * u)); } },
      { cap: `Calculator: ${T(`\\sqrt{${N}}=${dec3(root)}\\ldots\\approx${r1(root)}`)} ✓ It matches the estimate.`, run: async (c) => { await tween(c, 600, (u) => setPt(est + (root - est) * u)); await c.pop(ans); await stampIn(c, ok); } }
    ];
  }
};
const dot = (parent, p, o = {}) => Geo.dot(parent, p, o);

/* ======================================================================================
 * 3b. Is it reasonable? Square it and compare (Example 6 checks)
 * ====================================================================================== */
const VER = {
  ty: { claim: `Ty: ${T('\\sqrt{90}=45')}`, n: 90, a: 45, ok: false, fix: 9.5, root: Math.sqrt(90), lo: 81, hi: 100 },
  kara: { claim: `Kara: ${T('\\sqrt{1.2}\\approx1.1')}`, n: 1.2, a: 1.1, ok: true, root: Math.sqrt(1.2) },
  half: { claim: `${T('\\sqrt{64}=32')}?`, n: 64, a: 32, ok: false, fix: 8, root: 8 }
};
const verdict = {
  title: 'Is it reasonable? Square it and compare',
  height: 420,
  choices: [{ v: 'ty', label: 'Example 6(a): Ty' }, { v: 'kara', label: 'Example 6(b): Kara' }, { v: 'half', label: `${T('\\sqrt{64}=32')}?` }],
  ask: (v) => (v === 'ty' ? `Ty wrote ${T('\\sqrt{90}=45')}. Is that reasonable?` : v === 'kara' ? 'A square window has an area of 1.2 m². Kara says each side is about 1.1 m. Is that reasonable?' : `Is ${T('\\sqrt{64}=32')}?`),
  make(stage, v, ex) {
    const W = ex.W, H = 420, ox = (W - 960) / 2, svg = stageSvg(stage, W, H), o = VER[v];
    const sq = (x) => Math.round(x * x * 10000) / 10000, aa = sq(o.a);
    const LX = ox + 200; lab(stage, o.claim, LX, 60, 'u7l1-card');
    const arr = hide(svgEl('g', {}, svg)); line(arr, [LX, 92], [LX, 150], { width: 3, color: BROWN, cls: '' }); path(arr, `M${LX} 158l-8 -12h16z`, { fill: BROWN, stroke: 'none', cls: '' });
    txt(arr, LX + 58, 122, 'square it', { size: 17, color: BROWN });
    const sqL = hide(lab(stage, T(`${o.a}^2=${tn(aa)}`), LX, 190, 'u7l1-eq u7l1-box'));
    // bars: the number, and the answer squared
    const bx = ox + 480, bw = 330, rows = [[o.n, 'the number', INK, 150], [aa, 'the answer squared', o.ok ? GREEN : RED, 250]];
    const bars = rows.map(([val, name, colr, y]) => {
      const g = hide(svgEl('g', {}, svg));
      txt(g, bx, y - 34, name, { size: 18, color: SLATE, anchor: 'start' });
      const r = svgEl('rect', { x: bx, y: y - 16, width: 0, height: 32, rx: 6, fill: colr, 'fill-opacity': 0.75 }, g);
      const t = txt(g, bx + 10, y, '', { size: 19, anchor: 'start' });
      return { g, r, t, val, colr };
    });
    let scale = bw / Math.max(o.n, aa);
    const setBars = (u) => bars.forEach((b) => { const w = Math.max(4, b.val * scale * u); b.r.setAttribute('width', w.toFixed(1)); b.t.setAttribute('x', (bx + w + 10).toFixed(1)); b.t.textContent = String(b.val).replace(/^(\d+)(\d{3})$/, '$1\u202f$2'); });
    const bad = hide(stamp(stage, '✗ not reasonable', { ok: false, x: ox + 680, y: 350, size: 'sm' }));
    const good = hide(stamp(stage, '✓ reasonable', { ok: true, x: ox + 680, y: 350, size: 'sm' }));
    const steps = [
      { cap: `Check a square root by <b>squaring</b> it: ${T(`${o.a}^2=${o.a}\\times${o.a}=${tn(aa)}`)}.`, run: async (c) => { await op(c, arr, 1, 300); await c.pop(sqL); } },
      { cap: o.ok ? `Compare: ${aa} is very close to ${o.n}. <b>Reasonable.</b>` : `Compare: ${tn(aa).replace('\\,', ' ')} is <b>far</b> bigger than ${o.n}. Not reasonable.${v === 'ty' ? ' Ty divided by 2.' : ' A square root is <b>not</b> half the number.'}`,
        run: async (c) => { bars.forEach((b) => { b.g.style.opacity = 1; }); await tween(c, 900, setBars); await stampIn(c, o.ok ? good : bad); } }
    ];
    if (v === 'ty') {
      const est = hide(lab(stage, `${T('81<90<100')}: between 9 and 10`, LX, 270, 'u7l1-eq'));
      const fix = hide(lab(stage, T('\\sqrt{90}=9.486\\ldots\\approx9.5'), LX, 340, 'u7l1-eq u7l1-box'));
      steps.push({ cap: `Estimate: ${T('81<90<100')}, so ${T('\\sqrt{90}')} is between <b>9 and 10</b>.`, run: (c) => c.pop(est) });
      steps.push({ cap: `Calculator: ${T('\\sqrt{90}=9.486\\ldots\\approx9.5')}. Check: ${T('9.5^2=90.25')}, close to 90 ✓`, run: async (c) => {
        await c.pop(fix); await op(c, bad, 0, 200); bars[1].val = 90.25; bars[1].r.setAttribute('fill', GREEN);
        const s0 = scale, s1 = bw / 90.25; await tween(c, 900, (u) => { scale = s0 + (s1 - s0) * u; setBars(1); }); await stampIn(c, good); } });
    } else if (v === 'kara') {
      const fix = hide(lab(stage, `${T('\\sqrt{1.2}=1.095\\ldots\\approx1.1')} m`, LX, 290, 'u7l1-eq u7l1-box'));
      steps.push({ cap: `Calculator: ${T('\\sqrt{1.2}=1.095\\ldots\\approx1.1')} m ✓ Kara is right.`, run: (c) => c.pop(fix) });
    } else {
      const fix = hide(lab(stage, `Try 8: ${T('8^2=64')} ✓`, LX, 290, 'u7l1-eq u7l1-box'));
      steps.push({ cap: `Try 8: ${T('8^2=64')} ✓ So ${T('\\sqrt{64}=8')}, not 32.`, run: async (c) => {
        await c.pop(fix); await op(c, bad, 0, 200); bars[1].val = 64; bars[1].r.setAttribute('fill', GREEN);
        const s0 = scale, s1 = bw / 64; await tween(c, 900, (u) => { scale = s0 + (s1 - s0) * u; setBars(1); }); await stampIn(c, good); } });
    }
    return steps;
  }
};

/* ======================================================================================
 * 4. Tear the corners off a triangle; Example 7 checks with the 180° half-circle
 * ====================================================================================== */
const TEAR = {
  tear: { ang: [50, 70, 60], labs: ['a', 'b', 'c'], known: [1, 1, 1], order: [1, 2, 0] },
  a: { ang: [62, 71, 47], labs: ['62°', '71°', 'x'], known: [1, 1, 0], order: [1, 0, 2] },
  b: { ang: [90, 62, 28], labs: ['', 'x', '28°'], known: [1, 0, 1], order: [0, 2, 1] },
  c: { ang: [65, 65, 50], labs: ['65°', 'y', 'x'], known: [1, 0, 0], ticks: true, order: [0, 1, 2] },
  d: { ang: [35, 35, 110], labs: ['z', 'z', '110°'], known: [0, 0, 1], ticks: true, order: [0, 2, 1] }
};
const tear = {
  title: 'The three corners make a straight line',
  height: 430,
  choices: [{ v: 'tear', label: 'Tear the corners' }, { sep: 'Example 7 check:' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }, { v: 'c', label: '(c)' }, { v: 'd', label: '(d) roof truss' }],
  ask: (v) => ({ tear: 'What do the three angles of a triangle add up to?', a: `Example 7(a): find ${T('x')}.`, b: `Example 7(b): a right triangle with a ${T('28^\\circ')} angle. Find ${T('x')}.`, c: `Example 7(c): an isosceles triangle with a ${T('65^\\circ')} angle. Find ${T('x')} and ${T('y')}.`, d: `Example 7(d): a roof truss with a ${T('110^\\circ')} peak. Find the bottom angles.` }[v]),
  make(stage, v, ex) {
    const W = ex.W, H = 430, ox = (W - 960) / 2, svg = stageSvg(stage, W, H), o = TEAR[v];
    const P = fit(triAngles(o.ang[0], o.ang[1]), ox + 230, 235, 380, v === 'd' ? 200 : 290);
    const tri = path(svg, polyD(P), { width: 3.4, fill: '#fbf6ec' });
    if (o.ticks) { tick(svg, P[1], P[2]); tick(svg, P[2], P[0]); }
    if (v === 'b') { const k0 = corner(P[0], P[1], P[2]); rightSq(svg, P[0], k0.st, 18); }
    const Q = [ox + 705, 330], R = 150, r0 = 40, cols = [BLUE, GREEN, AMBER];
    const base = hide(line(svg, [Q[0] - 205, Q[1]], [Q[0] + 205, Q[1]], { width: 3.4, dash: '10 7' }));
    const halo = hide(path(svg, arcD(Q, R, 0, 180), { width: 2, dash: '5 6', stroke: GREY, cls: '' }));
    const pcs = [0, 1, 2].map((i) => {
      const V = P[i], k = corner(V, P[(i + 1) % 3], P[(i + 2) % 3]);
      const g = vg(svg), colr = o.known[i] ? cols[i] : RED;
      const isR = Math.abs(o.ang[i] - 90) < 0.1;
      path(g, wedgeD([0, 0], r0, k.st, k.sp), { fill: colr, fo: o.known[i] ? 0.35 : 0.12, stroke: colr, width: 2.2, cls: '' }).setAttribute('vector-effect', 'non-scaling-stroke');
      if (isR) rightSq(g, [0, 0], k.st, 13, { color: INK }).setAttribute('vector-effect', 'non-scaling-stroke');
      g.setAttribute('transform', `translate(${V[0].toFixed(2)} ${V[1].toFixed(2)})`);
      if (!o.known[i]) g.style.opacity = 0.0;
      const lp = A(V, k.mid, k.sp < 40 ? 64 : 58), t = o.labs[i] ? pp(txt(svg, lp[0], lp[1], o.labs[i], { size: 21, color: o.known[i] ? INK : RED, italic: /^[a-z]$/.test(o.labs[i]) })) : null;
      return { i, V, k, g, t, colr };
    });
    // slots in the half-circle, right to left, in o.order
    let acc = 0; const slot = {}; o.order.forEach((i) => { slot[i] = acc; acc += o.ang[i]; });
    const sc = R / r0;
    function place(pc, u) { const p = lerp(pc.V, Q, u), rot = ((slot[pc.i] - pc.k.st + 540) % 360) - 180, s = 1 + (sc - 1) * u; pc.g.setAttribute('transform', `translate(${p[0].toFixed(2)} ${p[1].toFixed(2)}) rotate(${(-rot * u).toFixed(2)}) scale(${s.toFixed(3)})`); }
    const slotLab = (i, s, colr) => { const m = A(Q, slot[i] + o.ang[i] / 2, R * 0.62); return hide(pp(txt(svg, m[0], m[1], s, { size: o.ang[i] < 40 ? 19 : 23, color: colr, italic: /^[a-z]$/.test(s) }))); };
    const move = async (c, list) => { for (const pc of list) { pc.g.style.opacity = 1; await tween(c, 900, (u) => place(pc, u)); } };
    const l180 = hide(pp(txt(svg, Q[0], Q[1] - R - 22, '180°', { size: 26 })));
    const eqAt = (s, y, cls = 'u7l1-eq') => hide(lab(stage, s, Q[0], y, cls));
    const okSt = hide(stamp(stage, '✓', { ok: true, x: Q[0] + 225, y: 54, size: 'sm' }));
    void tri;
    if (v === 'tear') {
      const lbs = pcs.map((pc) => slotLab(pc.i, o.labs[pc.i], pc.colr));
      const e1 = eqAt(T('a+b+c=180^\\circ'), 46, 'u7l1-eq u7l1-box'), e2 = eqAt(T('50^\\circ+70^\\circ+60^\\circ=180^\\circ'), 98);
      pcs.forEach((pc) => { pc.g.style.opacity = 0; });
      return [
        { cap: 'Any triangle. Colour its three corners <b>a</b>, <b>b</b> and <b>c</b>.', run: async (c) => { for (const pc of pcs) { await op(c, pc.g, 1, 300); } } },
        { cap: 'Tear off the three corners. Put them side by side, with all three points together…', run: async (c) => { await op(c, base, 0.5, 300); await op(c, halo, 1, 300); await move(c, [pcs[1], pcs[2], pcs[0]]); for (const l of lbs) await c.pop(l, 250); } },
        { cap: `They always make a <b>straight line</b>, ${T('180^\\circ')}. The angles in <b>any</b> triangle add up to ${T('180^\\circ')}.`, run: async (c) => { await op(c, base, 1, 300); await c.pop(l180); await c.pop(e1); await c.pop(e2); } }
      ];
    }
    const known = pcs.filter((pc) => o.known[pc.i]), unk = pcs.filter((pc) => !o.known[pc.i]);
    const kLabs = known.map((pc) => slotLab(pc.i, pc.i === 0 && v === 'b' ? '90°' : o.labs[pc.i], INK));
    const ansOf = { a: ['x = 47°'], b: ['x = 62°'], c: ['y = 65°', 'x = 50°'], d: ['z = 35°', 'z = 35°'] }[v];
    const uLabs = unk.map((pc, j) => slotLab(pc.i, ansOf[j].split(' = ')[1], RED));
    const showUnk = async (c, list) => { for (const pc of list) { place(pc, 1); pc.g.style.opacity = 0; await op(c, pc.g, 1, 450); } };
    const triLab = (pc, s) => { if (pc.t) { pc.t.textContent = s; pc.t.setAttribute('fill', RED); pc.t.setAttribute('font-style', 'normal'); } };
    if (v === 'a') {
      const e1 = eqAt(T('x+62^\\circ+71^\\circ=180^\\circ'), 46), e2 = eqAt(T('x=180^\\circ-62^\\circ-71^\\circ=47^\\circ'), 98, 'u7l1-eq u7l1-box');
      return [
        { cap: `Write the equation first: ${T('x+62^\\circ+71^\\circ=180^\\circ')}.`, run: (c) => c.pop(e1) },
        { cap: `The three corners fill a straight line, ${T('180^\\circ')}. Move in the two angles you know.`, run: async (c) => { await op(c, base, 1, 300); await op(c, halo, 1, 300); await c.pop(l180); await move(c, known); for (const l of kLabs) await c.pop(l, 250); } },
        { cap: `What is left is ${T('x')}: ${T('x=180^\\circ-62^\\circ-71^\\circ=47^\\circ')}.`, run: async (c) => { await showUnk(c, unk); await c.pop(uLabs[0]); await c.pop(e2); triLab(unk[0], '47°'); } },
        { cap: `Check: ${T('47+62+71=180')} ✓`, run: (c) => stampIn(c, okSt) }
      ];
    }
    if (v === 'b') {
      const e1 = eqAt(`the other two: ${T('90^\\circ')}`, 46), e2 = eqAt(T('x=90^\\circ-28^\\circ=62^\\circ'), 98, 'u7l1-eq u7l1-box');
      return [
        { cap: `A right triangle: the right angle uses ${T('90^\\circ')} of the ${T('180^\\circ')}. The other two angles share the other ${T('90^\\circ')}.`, run: async (c) => { await op(c, base, 1, 300); await op(c, halo, 1, 300); await c.pop(l180); await move(c, [known[0]]); await c.pop(kLabs[0]); await c.pop(e1); } },
        { cap: `Move in the ${T('28^\\circ')} angle.`, run: async (c) => { await move(c, [known[1]]); await c.pop(kLabs[1]); } },
        { cap: `What is left is ${T('x')}: ${T('x=90^\\circ-28^\\circ=62^\\circ')}.`, run: async (c) => { await showUnk(c, unk); await c.pop(uLabs[0]); await c.pop(e2); triLab(unk[0], '62°'); } },
        { cap: `Check: ${T('90+28+62=180')} ✓`, run: (c) => stampIn(c, okSt) }
      ];
    }
    if (v === 'c') {
      const yPc = unk.find((pc) => pc.i === 1), xPc = unk.find((pc) => pc.i === 2), yL = uLabs[unk.indexOf(yPc)], xL = uLabs[unk.indexOf(xPc)];
      const e1 = eqAt(`isosceles: ${T('y=65^\\circ')}`, 46), e2 = eqAt(T('x=180^\\circ-65^\\circ-65^\\circ=50^\\circ'), 98, 'u7l1-eq u7l1-box');
      return [
        { cap: `Isosceles: the angles across from the equal sides are equal, so ${T('y=65^\\circ')}.`, run: async (c) => { triLab(yPc, '65°'); if (yPc.t) await c.pop(yPc.t); await c.pop(e1); } },
        { cap: `Move in the two ${T('65^\\circ')} angles.`, run: async (c) => { await op(c, base, 1, 300); await op(c, halo, 1, 300); await c.pop(l180); await move(c, known); await c.pop(kLabs[0]); yPc.g.style.opacity = 1; await tween(c, 900, (u) => place(yPc, u)); await c.pop(yL); } },
        { cap: `What is left is ${T('x')}: ${T('x=180^\\circ-65^\\circ-65^\\circ=50^\\circ')}.`, run: async (c) => { await showUnk(c, [xPc]); await c.pop(xL); await c.pop(e2); triLab(xPc, '50°'); } },
        { cap: `Check: ${T('65+65+50=180')} ✓`, run: (c) => stampIn(c, okSt) }
      ];
    }
    const e1 = eqAt(T('180^\\circ-110^\\circ=70^\\circ'), 46), e2 = eqAt(T('70^\\circ\\div2=35^\\circ'), 98, 'u7l1-eq u7l1-box');
    return [
      { cap: `Move in the peak angle, ${T('110^\\circ')}. Two equal angles are left to fill the rest.`, run: async (c) => { await op(c, base, 1, 300); await op(c, halo, 1, 300); await c.pop(l180); await move(c, known); await c.pop(kLabs[0]); } },
      { cap: `What is left: ${T('180^\\circ-110^\\circ=70^\\circ')}, shared by the two equal bottom angles.`, run: async (c) => { await showUnk(c, unk); await c.pop(e1); } },
      { cap: `${T('70^\\circ\\div2=35^\\circ')}. Each bottom angle is ${T('35^\\circ')}.`, run: async (c) => { for (const l of uLabs) await c.pop(l); await c.pop(e2); unk.forEach((pc) => triLab(pc, '35°')); } },
      { cap: `Check: ${T('35+35+110=180')} ✓`, run: (c) => stampIn(c, okSt) }
    ];
  }
};

/* ======================================================================================
 * 4c. Name the triangle: by sides, then by the biggest angle (Example 8 checks)
 * ====================================================================================== */
const SORT = { a: [[5, 5, 5], [60, 60, 60]], b: [[6, 6, 8.5], [45, 45, 90]], c: [[4, 7, 9], [25, 48, 107]], d: [[6, 8, 10], [37, 53, 90]], e: [[7, 7, 4.8], [70, 70, 40]] };
const sorter = {
  title: 'Name the triangle',
  height: 440,
  choices: [{ sep: 'Example 8 check:' }, ...'abcde'.split('').map((k) => ({ v: k, label: `(${k})` }))],
  ask: (v) => `Example 8(${v}): sides ${SORT[v][0].join(' cm, ')} cm; angles ${SORT[v][1].map((a) => a + '°').join(', ')}. Name it.`,
  make(stage, v, ex) {
    const W = ex.W, H = 440, ox = (W - 960) / 2, svg = stageSvg(stage, W, H);
    const [sd, an] = SORT[v];
    const eqPairs = []; for (let i = 0; i < 3; i++) for (let j = i + 1; j < 3; j++) if (Math.abs(sd[i] - sd[j]) < 1e-9) eqPairs.push([i, j]);
    const nEq = eqPairs.length === 3 ? 3 : eqPairs.length ? 2 : 0;
    const bySide = nEq === 3 ? 'equilateral' : nEq === 2 ? 'isosceles' : 'scalene';
    const big = Math.max(...an), byAng = big === 90 ? 'right' : big > 90 ? 'obtuse' : 'acute';
    // base: the odd side of an isosceles triangle, otherwise the longest
    let bi = sd.indexOf(Math.max(...sd)); if (nEq === 2) bi = [0, 1, 2].find((i) => sd.filter((s) => Math.abs(s - sd[i]) < 1e-9).length === 1);
    const others = [0, 1, 2].filter((i) => i !== bi), b = sd[bi], Ls = sd[others[0]], Rs = sd[others[1]];
    const ax = (b * b + Ls * Ls - Rs * Rs) / (2 * b), ay = Math.sqrt(Math.max(0, Ls * Ls - ax * ax));
    const P = fit([[0, 0], [b, 0], [ax, ay]], ox + 225, 235, 360, 280);   // P0 left, P1 right, P2 apex
    // side index → its end points; angle across from each side
    const sideEnds = { [bi]: [P[0], P[1]], [others[0]]: [P[0], P[2]], [others[1]]: [P[1], P[2]] };
    const across = { [bi]: 2, [others[0]]: 1, [others[1]]: 0 };   // vertex across from the side
    const sortS = [0, 1, 2].sort((i, j) => sd[i] - sd[j]), sortA = an.slice().sort((x, y) => x - y), angAt = {};
    sortS.forEach((si, k) => { angAt[across[si]] = sortA[k]; });
    const triEl = path(svg, polyD(P), { width: 3.4, fill: '#fbf6ec' });
    const sLabs = [0, 1, 2].map((i) => hide(sideLab(svg, sideEnds[i][0], sideEnds[i][1], P[across[i]], `${sd[i]} cm`, { size: 19 })));
    const aMarks = [0, 1, 2].map((vi) => { const m = angMark(svg, P[vi], P[(vi + 1) % 3], P[(vi + 2) % 3], `${angAt[vi]}°`, { r: 30, size: 18 }); m.g.style.opacity = 0; return m; });
    const ticks = svgEl('g', {}, svg); ticks.style.opacity = 0;
    const eqSides = nEq === 3 ? [0, 1, 2] : nEq === 2 ? eqPairs[0] : [];
    eqSides.forEach((i) => tick(ticks, sideEnds[i][0], sideEnds[i][1], { color: RED, width: 3 }));
    // bins
    const bx = ox + 470, bw = 150, gap = 12, rowsY = [128, 288];
    [['By sides', ['equilateral', 'isosceles', 'scalene']], ['By angles', ['acute', 'right', 'obtuse']]].forEach(([hd], r) => { const e = h('div', 'u7l1-binh', hd); add(stage, e, bx, rowsY[r] - 66); });
    const bins = {};
    [['equilateral', 'isosceles', 'scalene'], ['acute', 'right', 'obtuse']].forEach((names, r) => names.forEach((nm, i) => {
      const e = h('div', 'u7l1-bin', nm); e.style.width = bw + 'px'; e.style.height = '58px'; add(stage, e, bx + i * (bw + gap), rowsY[r] - 29); bins[nm] = { el: e, x: bx + i * (bw + gap) + bw / 2, y: rowsY[r] };
    }));
    const tokS = hide(lab(stage, bySide, ox + 225, 235, 'u7l1-tok')), tokA = hide(lab(stage, byAng, ox + 225, 235, 'u7l1-tok'));
    const nameSt = hide(stamp(stage, `${byAng} ${bySide}`, { ok: true, x: ox + 700, y: 395 }));
    const bigV = Object.keys(angAt).find((k) => angAt[k] === big), bigMark = aMarks[bigV];
    const sideTxt = nEq === 3 ? `All 3 are equal (${sd.join(', ')}): <b>equilateral</b>.` : nEq === 2 ? `Two are equal (${sd[eqPairs[0][0]]} and ${sd[eqPairs[0][1]]}): <b>isosceles</b>.` : `No two are equal: <b>scalene</b>.`;
    const angTxt = big === 90 ? `It is exactly ${T('90^\\circ')}: <b>right</b>.` : big > 90 ? `${T(big + '^\\circ')} is more than ${T('90^\\circ')}: <b>obtuse</b>.` : `${T(big + '^\\circ')} is less than ${T('90^\\circ')}, so all three are: <b>acute</b>.`;
    const fly = async (c, tok, nm) => { tok.style.opacity = 1; await c.pop(tok); await slide(c, tok, bins[nm].x, bins[nm].y, 700); bins[nm].el.classList.add('u7l1-on'); tok.style.opacity = 0; bins[nm].el.innerHTML = `<b>${nm}</b>`; await pulse(c, bins[nm].el, 1.08, 400); };
    return [
      { cap: `Triangle (${v}): sides ${sd.join(' cm, ')} cm; angles ${an.map((a) => a + '°').join(', ')}.`, run: async (c) => { await pulse(c, triEl, 1.04, 400); for (const l of sLabs) await c.pop(l, 220); for (const m of aMarks) await op(c, m.g, 1, 220); } },
      { cap: `<b>By sides:</b> count the equal sides. ${sideTxt}`, run: async (c) => { await op(c, ticks, 1, 300); for (const i of eqSides) await pulse(c, sLabs[i], 1.25, 380); await fly(c, tokS, bySide); } },
      { cap: `<b>By angles:</b> look at the biggest angle. ${angTxt}`, run: async (c) => { if (bigMark.label) { bigMark.label.setAttribute('fill', RED); await pulse(c, bigMark.label, 1.35, 450); } await fly(c, tokA, byAng); } },
      { cap: `One name of each kind: a <b>${byAng} ${bySide}</b> triangle.`, run: (c) => stampIn(c, nameSt) }
    ];
  }
};

/* ======================================================================================
 * 4x. Why only one big angle; why the hypotenuse is the longest side (Full)
 * ====================================================================================== */
const why = {
  title: 'Only one big angle',
  height: 420,
  choices: [{ v: 'two90', label: 'Two right angles?' }, { v: 'obt', label: 'Two obtuse angles?' }, { v: 'long', label: 'Why is the hypotenuse longest?' }],
  ask: (v) => (v === 'two90' ? 'Can a triangle have two right angles?' : v === 'obt' ? 'Can a triangle have two obtuse angles?' : 'Why is the hypotenuse always the longest side?'),
  make(stage, v, ex) {
    const W = ex.W, H = 420, ox = (W - 960) / 2, svg = stageSvg(stage, W, H);
    if (v !== 'long') {
      const ang = v === 'two90' ? 90 : 100, L = [ox + 200, 370], R = [ox + 470, 370];
      const baseL = hide(line(svg, L, R, { width: 3.6 }));
      const armL = line(svg, L, L, { width: 3.6, color: BLUE, cls: '' }), armR = line(svg, R, R, { width: 3.6, color: BLUE, cls: '' });
      const dL = ang, dR = 180 - ang;
      const mL = hide(svgEl('g', {}, svg)), mR = hide(svgEl('g', {}, svg));
      if (ang === 90) { rightSq(mL, L, 0, 20); rightSq(mR, R, 90, 20); } else { path(mL, arcD(L, 34, 0, ang), { width: 2.4, cls: '' }); path(mR, arcD(R, 34, 180 - ang, ang), { width: 2.4, cls: '' }); txt(mL, ...A(L, ang / 2, 58), ang + '°', { size: 19 }); txt(mR, ...A(R, 180 - ang / 2, 58), ang + '°', { size: 19 }); }
      const grow = (len) => { const a = A(L, dL, len), b = A(R, dR, len); armL.setAttribute('x2', a[0].toFixed(1)); armL.setAttribute('y2', a[1].toFixed(1)); armR.setAttribute('x2', b[0].toFixed(1)); armR.setAttribute('y2', b[1].toFixed(1)); };
      const st = hide(stamp(stage, v === 'two90' ? 'never meet' : 'only spread apart', { ok: false, x: ox + 335, y: 60 }));
      const e1 = hide(lab(stage, T(`${ang}^\\circ+${ang}^\\circ=${2 * ang}^\\circ`), ox + 760, 170, 'u7l1-eq u7l1-box'));
      const e2 = hide(lab(stage, ang === 90 ? `nothing left for the third angle` : `more than ${T('180^\\circ')} already`, ox + 760, 240, 'u7l1-eq u7l1-red'));
      return [
        { cap: v === 'two90' ? 'Try a triangle with <b>two right angles</b>. Draw a side, and turn up 90° at each end.' : 'Try <b>two obtuse angles</b>, 100° each, one at each end of a side.', run: async (c) => { baseL.style.opacity = 1; await anim(c, baseL, [{ opacity: 0 }, { opacity: 1 }], 300); await c.pop(mL); await c.pop(mR); } },
        { cap: v === 'two90' ? 'The two sides go straight up. They stay the same distance apart…' : 'The two sides lean <b>away</b> from each other…', run: (c) => tween(c, 1400, (u) => grow(300 * u)) },
        { cap: v === 'two90' ? 'They never meet, so there is no third corner. <b>No triangle!</b>' : 'They only get farther apart. <b>No triangle!</b>', run: (c) => stampIn(c, st) },
        { cap: v === 'two90' ? `${T('90^\\circ+90^\\circ=180^\\circ')} already. Nothing is left for a third angle.` : `${T('100^\\circ+100^\\circ=200^\\circ')}: more than ${T('180^\\circ')} already.`, run: async (c) => { await c.pop(e1); await c.pop(e2); } }
      ];
    }
    const V = [ox + 120, 360], u = 70, a = 4, b = 3, len = (t) => Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(t * RAD));
    const E1 = A(V, 0, a * u);
    line(svg, V, E1, { width: 4, cls: '' });
    const arm = line(svg, V, V, { width: 4, cls: '' }), acr = line(svg, V, V, { width: 4, color: RED, cls: '' });
    const arc = path(svg, '', { width: 2.4, cls: '' }), sqm = svgEl('g', {}, svg);
    const tA = txt(svg, 0, 0, '', { size: 19 });
    txt(svg, ...mid(V, E1).map((p, i) => p + (i ? 22 : 0)), '4', { size: 20 });
    const lb3 = txt(svg, 0, 0, '3', { size: 20 });
    const bx = ox + 560, bars = [[a, '4', INK, 150], [b, '3', INK, 210], [0, 'across', RED, 270]].map(([val, nm, colr, y]) => {
      txt(svg, bx - 12, y, nm, { size: 18, color: SLATE, anchor: 'end' });
      const r = svgEl('rect', { x: bx, y: y - 15, width: val * 60, height: 30, rx: 6, fill: colr, 'fill-opacity': 0.7 }, svg);
      return r;
    });
    const rd = txt(svg, bx + 10, 330, '', { size: 19, anchor: 'start' });
    let th = 40;
    function set(t) {
      th = t; const E2 = A(V, t, b * u);
      arm.setAttribute('x2', E2[0].toFixed(1)); arm.setAttribute('y2', E2[1].toFixed(1));
      acr.setAttribute('x1', E1[0].toFixed(1)); acr.setAttribute('y1', E1[1].toFixed(1)); acr.setAttribute('x2', E2[0].toFixed(1)); acr.setAttribute('y2', E2[1].toFixed(1));
      sqm.innerHTML = ''; if (Math.abs(t - 90) < 0.6) { rightSq(sqm, V, 0, 20); arc.setAttribute('d', ''); } else arc.setAttribute('d', arcD(V, 34, 0, t));
      const lp = A(V, t / 2, 60); tA.setAttribute('x', lp[0].toFixed(1)); tA.setAttribute('y', lp[1].toFixed(1)); tA.textContent = Math.round(t) + '°';
      const m3 = A(mid(V, E2), t + 90, 18); lb3.setAttribute('x', m3[0].toFixed(1)); lb3.setAttribute('y', m3[1].toFixed(1));
      const L = len(t); bars[2].setAttribute('width', (L * 60).toFixed(1)); rd.textContent = `across: ${L.toFixed(2)}`;
    }
    set(40);
    const l40 = len(40).toFixed(1), tag = hide(lab(stage, 'biggest angle ↔ longest side', ox + 720, 395, 'u7l1-tag'));
    return [
      { cap: `Two sides, 4 and 3 long, with a hinge between them. The <b>red</b> side goes across from the angle: at ${T('40^\\circ')} it is about ${l40} long.`, run: (c) => pulse(c, acr, 1.04, 400) },
      { cap: 'Open the angle. The side across from it gets <b>longer</b>.', run: (c) => tween(c, 1600, (u) => set(40 + 80 * u)) },
      { cap: `Close it to ${T('90^\\circ')}: the side across is <b>5</b>, longer than 4 and 3. That side is the <b>hypotenuse</b>.`, run: (c) => tween(c, 900, (u) => set(120 - 30 * u)) },
      { cap: `In a right triangle, ${T('90^\\circ')} is the <b>biggest</b> angle, so the side across from it is the <b>longest</b>.`, run: (c) => c.pop(tag) }
    ];
  }
};

/* ======================================================================================
 * 5. Finger on the little square: find the hypotenuse; side letters (Example 9 checks)
 * ====================================================================================== */
/** a fingertip marker with a pulsing ring */
function finger(parent) {
  const g = vg(parent); g.style.opacity = 0;
  svgEl('circle', { cx: 0, cy: 0, r: 22, fill: 'none', stroke: AMBER, 'stroke-width': 3, opacity: 0.6 }, g);
  svgEl('circle', { cx: 0, cy: 0, r: 13, fill: AMBER, 'fill-opacity': 0.85, stroke: '#fff', 'stroke-width': 2.5 }, g);
  g.at = (p) => g.setAttribute('transform', `translate(${p[0].toFixed(1)} ${p[1].toFixed(1)})`);
  return g;
}
/** slide the finger from the right-angle vertex C straight across to the opposite side (the angle bisector) */
async function fingerSlide(c, svg, F, C, P, Q) {
  const D = lerp(P, Q, dist(C, P) / (dist(C, P) + dist(C, Q)));
  const start = A(C, dirTo(C, D), 20);
  const trail = line(svg, start, start, { width: 3, dash: '3 7', color: AMBER, cls: '' });
  F.at(start); await op(c, F, 1, 250);
  await tween(c, 1000, (u) => { const p = lerp(start, D, u); F.at(p); trail.setAttribute('x2', p[0].toFixed(1)); trail.setAttribute('y2', p[1].toFixed(1)); });
  return D;
}
const HYPF = {
  abc: { pts: { C: [0, 0], B: [0, 2.2], A: [3.2, 0] }, right: 'C', cx: 300, cy: 240, w: 380, h: 270 },
  pqr: { pts: { Q: [0, 0], P: [2.6 * Math.cos(35 * RAD), 2.6 * Math.sin(35 * RAD)], R: [1.8 * Math.cos(125 * RAD), 1.8 * Math.sin(125 * RAD)] }, right: 'Q', cx: 300, cy: 245, w: 420, h: 240 }
};
const hyp = {
  title: 'Find the hypotenuse',
  height: 430,
  choices: [{ v: 'abc', label: T('\\triangle ABC') }, { v: 'pqr', label: `Example 9 check: ${T('\\triangle PQR')}` }, { v: 'turn', label: 'Example 9(d) check' }],
  ask: (v) => (v === 'abc' ? `Right ${T('\\triangle ABC')} has its right angle at ${T('C')}. Which side is the hypotenuse? Which are the legs?` : v === 'pqr' ? `${T('\\triangle PQR')} has its right angle at ${T('Q')}. Name its sides.` : 'Example 9(d): which side is the hypotenuse of each right triangle?'),
  make(stage, v, ex) {
    const W = ex.W, H = 430, ox = (W - 960) / 2, svg = stageSvg(stage, W, H);
    if (v === 'turn') {
      const TR = [
        { p: [[0, 0], [8, 0], [0, 6]], r: 0, s: ['8 m', '10 m', '6 m'], hy: 1, chk: '10>8>6', len: '10 m' },
        { p: [[0, 0], [5, 0], [5, 5.5]], r: 1, s: ['5 ft', '5.5 ft', '7.4 ft'], hy: 2, chk: '7.4>5.5>5', len: '7.4 ft' },
        { p: [[0, 0], [9, 0], [7.18, 3.61]], r: 2, s: ['15 cm', '6.7 cm', '13.4 cm'], hy: 0, chk: '15>13.4>6.7', len: '15 cm' }
      ];
      const F = finger(svg);
      const items = TR.map((t, i) => {
        const P = fit(t.p, ox + 165 + i * 315, 210, 230, 190), cP = cen(P), g = svgEl('g', {}, svg);
        path(g, polyD(P), { width: 3.2, fill: '#fbf6ec', cls: '' });
        const Cv = P[t.r], k = corner(Cv, P[(t.r + 1) % 3], P[(t.r + 2) % 3]); rightSq(g, Cv, k.st, 15);
        const hl = hide(line(svg, P[t.hy], P[(t.hy + 1) % 3], { width: 12, color: HYP, cls: '' })); hl.setAttribute('stroke-opacity', 0.4);
        t.s.forEach((s, j) => sideLab(g, P[j], P[(j + 1) % 3], cP, s, { size: 18, color: j === t.hy ? INK : INK }));
        const st = hide(lab(stage, `${T(t.chk)} ✓`, ox + 165 + i * 315, 360, 'u7l1-eq'));
        return { P, t, hl, st };
      });
      const tag = hide(lab(stage, 'the hypotenuse can even be on the <b>bottom</b>', ox + 480, 405, 'u7l1-tag'));
      return [
        ...items.map((it, i) => ({ cap: `Triangle ${i + 1}: slide across from the little square. The hypotenuse is <b>${it.t.len}</b>. Check: ${T(it.t.chk)} ✓`,
          run: async (c) => { const r = it.t.r; await fingerSlide(c, svg, F, it.P[r], it.P[(r + 1) % 3], it.P[(r + 2) % 3]); it.hl.style.opacity = 1; await anim(c, it.hl, [{ opacity: 0 }, { opacity: 1 }], 400); await c.pop(it.st); await op(c, F, 0, 200); } })),
        { cap: 'A triangle can be turned any way. Always start from the <b>little square</b>, not from the slanted side.', run: (c) => c.pop(tag) }
      ];
    }
    const o = HYPF[v], names = Object.keys(o.pts), Pw = names.map((n) => o.pts[n]);
    const Px = fit(Pw, ox + o.cx, o.cy, o.w, o.h), V = {}; names.forEach((n, i) => { V[n] = Px[i]; });
    const Rv = o.right, [n1, n2] = names.filter((n) => n !== Rv), C0 = cen(Px);
    const hl = { hyp: hide(line(svg, V[n1], V[n2], { width: 13, color: HYP, cls: '' })), l1: hide(line(svg, V[Rv], V[n1], { width: 13, color: BLUE, cls: '' })), l2: hide(line(svg, V[Rv], V[n2], { width: 13, color: BLUE, cls: '' })) };
    Object.values(hl).forEach((e) => e.setAttribute('stroke-opacity', 0.35));
    path(svg, polyD(Px), { width: 3.4, fill: '#fbf6ec', cls: '' });
    Object.values(hl).forEach((e) => svg.appendChild(e));
    const kR = corner(V[Rv], V[n1], V[n2]), sqm = pp(rightSq(svg, V[Rv], kR.st, 20, { width: 2.8 }));
    names.forEach((n) => { const u = A([0, 0], dirTo(C0, V[n]), 24); txt(svg, V[n][0] + u[0], V[n][1] + u[1], n, { size: 24, italic: true }); });
    const sl = (P, Q, s, colr) => hide(sideLab(svg, P, Q, C0, s, { size: 24, color: colr, italic: true, gap: 12 }));
    const small = (n) => n.toLowerCase();
    const letH = sl(V[n1], V[n2], small(Rv), HYP), let1 = sl(V[Rv], V[n2], small(n1), BLUE), let2 = sl(V[Rv], V[n1], small(n2), BLUE);
    const tagAt = (P, Q, s, colr, off = 52) => { const M = mid(P, Q); let nr = A([0, 0], dirTo(P, Q) + 90, 1); if ((C0[0] - M[0]) * nr[0] + (C0[1] - M[1]) * nr[1] > 0) nr = [-nr[0], -nr[1]]; return hide(lab(stage, s, M[0] + nr[0] * off, M[1] + nr[1] * off, 'u7l1-sm')); };
    const tH = tagAt(V[n1], V[n2], '<b style="color:#8a5a1c">hypotenuse</b>', 60), tL1 = tagAt(V[Rv], V[n1], '<b style="color:#1f5bd6">leg</b>', -30), tL2 = tagAt(V[Rv], V[n2], '<b style="color:#1f5bd6">leg</b>', -30);
    const F = finger(svg), px = ox + 760;
    const arrowAcross = (from, P, Q) => { const M = mid(P, Q), a = A(from, dirTo(from, M), 26), b = A(M, dirTo(M, from), 18); return hide(line(svg, a, b, { width: 2.2, dash: '5 6', color: GREY, cls: '' })); };
    const arH = arrowAcross(V[Rv], V[n1], V[n2]), ar1 = arrowAcross(V[n1], V[Rv], V[n2]), ar2 = arrowAcross(V[n2], V[Rv], V[n1]);
    const sn = (a, b) => [a, b].sort().join('');
    const nmH = hide(lab(stage, `hypotenuse: ${T(small(Rv))} = side ${T(sn(n1, n2))}`, px, 150, 'u7l1-eq')), nm1 = hide(lab(stage, `leg: ${T(small(n1))} = side ${T(sn(Rv, n2))}`, px, 215, 'u7l1-eq')), nm2 = hide(lab(stage, `leg: ${T(small(n2))} = side ${T(sn(n1, Rv))}`, px, 280, 'u7l1-eq'));
    const lettersStep = async (c, ar, lt, nm) => { ar.style.opacity = 1; await anim(c, ar, [{ opacity: 0 }, { opacity: 1 }], 350); await c.pop(lt); await c.pop(nm); await op(c, ar, 0, 300); };
    if (v === 'abc') {
      return [
        { cap: `The little square shows the <b>right angle</b>, at ${T('C')}.`, run: (c) => pulse(c, sqm, 1.6, 600) },
        { cap: 'Put your finger on the little square. Slide straight across the triangle…', run: (c) => fingerSlide(c, svg, F, V[Rv], V[n1], V[n2]) },
        { cap: 'You land on the <b>hypotenuse</b>. It is across from the right angle, and it is the <b>longest</b> side.', run: async (c) => { hl.hyp.style.opacity = 1; await anim(c, hl.hyp, [{ opacity: 0 }, { opacity: 1 }], 400); await c.pop(tH); await op(c, F, 0, 200); } },
        { cap: 'The two sides that make the right angle are the <b>legs</b>.', run: async (c) => { for (const e of [hl.l1, hl.l2]) { e.style.opacity = 1; await anim(c, e, [{ opacity: 0 }, { opacity: 1 }], 300); } await c.pop(tL1); await c.pop(tL2); } },
        { cap: `Each side gets the <b>small letter</b> of the corner across from it. Across from ${T('C')} is ${T('c')}: the hypotenuse is ${T('c')}, side ${T('AB')}.`, run: (c) => lettersStep(c, arH, letH, nmH) },
        { cap: `Across from ${T('A')} is leg ${T('a')} (side ${T('BC')}). Across from ${T('B')} is leg ${T('b')} (side ${T('AC')}).`, run: async (c) => { await lettersStep(c, ar2, let2, nm2); await lettersStep(c, ar1, let1, nm1); } }
      ];
    }
    return [
      { cap: `The little square shows the right angle, at ${T('Q')}.`, run: (c) => pulse(c, sqm, 1.6, 600) },
      { cap: `Slide from the little square straight across: you land on side ${T('PR')}. It is the <b>hypotenuse</b>.`, run: async (c) => { await fingerSlide(c, svg, F, V[Rv], V[n1], V[n2]); hl.hyp.style.opacity = 1; await anim(c, hl.hyp, [{ opacity: 0 }, { opacity: 1 }], 400); await c.pop(tH); await op(c, F, 0, 200); } },
      { cap: `${T('PR')} is across from ${T('Q')}, so the hypotenuse is side ${T('q')}.`, run: (c) => lettersStep(c, arH, letH, nmH) },
      { cap: `The legs: ${T('QR')} is across from ${T('P')}, so it is ${T('p')}. ${T('PQ')} is across from ${T('R')}, so it is ${T('r')}.`, run: async (c) => { for (const e of [hl.l1, hl.l2]) { e.style.opacity = 1; await anim(c, e, [{ opacity: 0 }, { opacity: 1 }], 300); } await c.pop(tL1); await c.pop(tL2); await lettersStep(c, ar1, let1, nm1); await lettersStep(c, ar2, let2, nm2); } }
    ];
  }
};

/* ======================================================================================
 * 5b. The ladder against the wall (Example 10 check); the ladder slides, the angles keep adding to 90°
 * ====================================================================================== */
const ladder = {
  title: 'The ladder: a right triangle against a house',
  height: 440,
  choices: [{ v: 'ex10', label: 'Example 10 check' }, { v: 'slide', label: 'Slide the ladder' }],
  ask: (v) => (v === 'ex10' ? `A ladder makes ${T('75^\\circ')} with level ground. Where is the right angle? What angle does it make with the wall?` : 'The foot of the ladder slides out. What happens to the two angles?'),
  make(stage, v, ex) {
    const W = ex.W, H = 440, ox = (W - 960) / 2, svg = stageSvg(stage, W, H);
    const Wx = ox + 250, Gy = 396, L = 350;
    // the house wall and the ground
    svgEl('rect', { x: Wx - 120, y: 26, width: 120, height: Gy - 26, fill: '#e9dcc6', stroke: '#7a5124', 'stroke-width': 3 }, svg);
    for (let y = 46; y < Gy; y += 26) line(svg, [Wx - 120, y], [Wx, y], { width: 1.4, color: '#c9b392', cls: '' });
    svgEl('rect', { x: Wx - 140, y: Gy, width: 760, height: 16, fill: '#b98a55', stroke: '#7a5124', 'stroke-width': 2.5 }, svg);
    txt(svg, Wx - 60, 60, 'wall', { size: 18, color: '#6e4a1c' }); txt(svg, Wx + 540, Gy + 30, 'ground', { size: 18, color: '#6e4a1c' });
    const legW = hide(line(svg, [Wx, Gy], [Wx, Gy], { width: 12, color: BLUE, cls: '' })), legG = hide(line(svg, [Wx, Gy], [Wx, Gy], { width: 12, color: BLUE, cls: '' }));
    legW.setAttribute('stroke-opacity', 0.35); legG.setAttribute('stroke-opacity', 0.35);
    const hl = hide(line(svg, [Wx, Gy], [Wx, Gy], { width: 22, color: HYP, cls: '' })); hl.setAttribute('stroke-opacity', 0.3);
    const lad = svgEl('g', {}, svg), sqm = pp(rightSq(svg, [Wx, Gy], 0, 22, { width: 3, color: RED }));
    const arcF = path(svg, '', { width: 2.6, cls: '', stroke: GREEN }), arcT = path(svg, '', { width: 2.6, cls: '', stroke: RED });
    const tF = txt(svg, 0, 0, '', { size: 21, color: GREEN }), tT = txt(svg, 0, 0, '', { size: 21, color: RED });
    const tags = { hyp: hide(lab(stage, '<b style="color:#8a5a1c">hypotenuse</b>', 0, 0, 'u7l1-sm')), w: hide(lab(stage, '<b style="color:#1f5bd6">leg</b>', Wx + 26, 0, 'u7l1-sm')), g: hide(lab(stage, '<b style="color:#1f5bd6">leg</b>', 0, Gy - 18, 'u7l1-sm')) };
    const rd = lab(stage, '', ox + 735, 120, 'u7l1-eq');
    let th = 75, topLab = '?', showArcs = v === 'slide';
    function set(t) {
      th = t; const F = [Wx + L * Math.cos(t * RAD), Gy], Tp = [Wx, Gy - L * Math.sin(t * RAD)];
      lad.innerHTML = '';
      const n = A([0, 0], dirTo(F, Tp) + 90, 9);
      line(lad, [F[0] + n[0], F[1] + n[1]], [Tp[0] + n[0], Tp[1] + n[1]], { width: 6, color: '#8a5a1c', cls: '' });
      line(lad, [F[0] - n[0], F[1] - n[1]], [Tp[0] - n[0], Tp[1] - n[1]], { width: 6, color: '#8a5a1c', cls: '' });
      for (let i = 1; i < 11; i++) { const p = lerp(F, Tp, i / 11); line(lad, [p[0] + n[0], p[1] + n[1]], [p[0] - n[0], p[1] - n[1]], { width: 3.5, color: '#a8763a', cls: '' }); }
      [[hl, F, Tp], [legW, [Wx, Gy], Tp], [legG, [Wx, Gy], F]].forEach(([e, P, Q]) => { e.setAttribute('x1', P[0].toFixed(1)); e.setAttribute('y1', P[1].toFixed(1)); e.setAttribute('x2', Q[0].toFixed(1)); e.setAttribute('y2', Q[1].toFixed(1)); });
      arcF.setAttribute('d', showArcs ? arcD(F, 46, 180 - t, t) : ''); arcT.setAttribute('d', showArcs ? arcD(Tp, 46, 270, 90 - t) : '');
      const pf = A(F, 180 - t / 2, 74), pt = A(Tp, 270 + (90 - t) / 2, 72);
      tF.setAttribute('x', pf[0].toFixed(1)); tF.setAttribute('y', pf[1].toFixed(1)); tF.textContent = showArcs ? Math.round(t) + '°' : '';
      tT.setAttribute('x', pt[0].toFixed(1)); tT.setAttribute('y', pt[1].toFixed(1)); tT.textContent = showArcs ? (topLab === '?' && v === 'ex10' ? '?' : Math.round(90 - t) + '°') : '';
      const mH = mid(F, Tp), nh = A([0, 0], dirTo(F, Tp) - 90, 40); moveTo(tags.hyp, mH[0] + nh[0] + 20, mH[1] + nh[1]); moveTo(tags.w, Wx - 36, (Gy + Tp[1]) / 2); moveTo(tags.g, (Wx + F[0]) / 2, Gy + 32);
      rd.inner.innerHTML = showArcs ? `ground <b style="color:#12805a">${Math.round(t)}°</b> + wall <b style="color:#c93a33">${Math.round(90 - t)}°</b> = <b>90°</b>` : '&nbsp;';
    }
    set(75);
    if (v === 'ex10') {
      sqm.style.opacity = 0; rd.style.opacity = 0;
      const eq = hide(lab(stage, T('90^\\circ-75^\\circ=15^\\circ'), ox + 735, 200, 'u7l1-eq u7l1-box'));
      return [
        { cap: 'Level ground and a wall that goes straight up meet at a <b>right angle</b>.', run: async (c) => { sqm.style.opacity = 1; await c.pop(sqm, 500); await pulse(c, sqm, 1.5, 500); } },
        { cap: 'The ladder is across from the right angle: it is the <b>hypotenuse</b>. The wall and the ground are the <b>legs</b>.', run: async (c) => { await op(c, hl, 1, 400); await c.pop(tags.hyp); await op(c, legW, 1, 300); await op(c, legG, 1, 300); await c.pop(tags.w); await c.pop(tags.g); } },
        { cap: `The ladder makes ${T('75^\\circ')} with the ground. In a right triangle, the other two angles add up to ${T('90^\\circ')}.`, run: async (c) => { showArcs = true; set(75); await c.pop(tF); await c.pop(tT); } },
        { cap: `Angle with the wall: ${T('90^\\circ-75^\\circ=15^\\circ')}.`, run: async (c) => { topLab = '15'; set(75); await c.pop(tT); await c.pop(eq); rd.style.opacity = 1; await c.pop(rd); } }
      ];
    }
    return [
      { cap: `Start at ${T('75^\\circ')} with the ground: then the ladder makes ${T('15^\\circ')} with the wall.`, run: (c) => pulse(c, rd, 1.06, 400) },
      { cap: `The foot slides out to ${T('60^\\circ')}: the angle with the wall grows to ${T('30^\\circ')}.`, run: (c) => tween(c, 1400, (u) => set(75 - 15 * u)) },
      { cap: `At ${T('45^\\circ')} the two angles are equal: ${T('45^\\circ+45^\\circ=90^\\circ')}.`, run: (c) => tween(c, 1200, (u) => set(60 - 15 * u)) },
      { cap: `At ${T('30^\\circ')}: ${T('30^\\circ+60^\\circ=90^\\circ')}. One angle shrinks, the other grows: they always add to ${T('90^\\circ')}.`, run: (c) => tween(c, 1200, (u) => set(45 - 15 * u)) }
    ];
  }
};

mountExplainers({ tiles, small, undo, zoom, verdict, tear, sorter, why, hyp, ladder });

/* ======================================================================================
 * Static figures
 * ====================================================================================== */
function grid(s, x0, y0, n, c) { svgEl('rect', { x: x0, y: y0, width: n * c, height: n * c, fill: '#ececec' }, s); for (let i = 1; i < n; i++) { line(s, [x0 + i * c, y0], [x0 + i * c, y0 + n * c], { width: 1.2, color: '#9a9a9a', cls: '' }); line(s, [x0, y0 + i * c], [x0 + n * c, y0 + i * c], { width: 1.2, color: '#9a9a9a', cls: '' }); } path(s, polyD([[x0, y0], [x0 + n * c, y0], [x0 + n * c, y0 + n * c], [x0, y0 + n * c]]), { width: 2.8, cls: '' }); }
/** a static triangle figure: pts (px), right: vertex index or null, angle labels per vertex, ticks on sides [i] (side i → i+1) */
function triFig(s, P, o = {}) {
  path(s, polyD(P), { width: 3, fill: o.fill || '#fbf6ec', cls: '' });
  (o.ticks || []).forEach((i) => tick(s, P[i], P[(i + 1) % 3]));
  (o.angles || []).forEach((lb, i) => { if (lb == null) return; angMark(s, P[i], P[(i + 1) % 3], P[(i + 2) % 3], lb, { r: o.r || 24, size: o.size || 18, lcolor: /^[a-z]$/.test(lb) ? RED : INK, square: lb === '' || lb === 'R' }); });
  return P;
}
const FIG = {
  wans(host) {
    const s = figSvg(host, 230, 190), B1 = [30, 160], B2 = [200, 170], B3 = [140, 118], Tp = [118, 22];
    const stick = (P, Q, back) => { line(s, P, Q, { width: 11, color: '#8a5a1c', cls: '', opacity: back ? 0.5 : 1 }); line(s, P, Q, { width: 6.5, color: back ? '#f6dc9a' : TILE, cls: '' }); };
    stick(B1, B3, true); stick(B3, B2, true); stick(B3, Tp, true);
    path(s, polyD([B1, B2, Tp]), { fill: TILE, fo: 0.18, stroke: 'none', cls: '' });
    stick(B1, B2); stick(B1, Tp); stick(B2, Tp);
    txt(s, 115, 182, '4 triangles, 6 pencils', { size: 14, color: SLATE });
  },
  a49(host) {
    const s = figSvg(host, 280, 270); grid(s, 35, 10, 7, 30);
    const t = lab(host, `Area ${T('=49')}`, 140, 115, 'u7l1-card'); t.inner.style.fontSize = '20px';
    lab(host, `side ${T('=\\sqrt{49}=7')}`, 140, 245, '');
  },
  nl(host) {
    const W = 760, Hh = 150, s = figSvg(host, W, Hh), X = (v) => 60 + (v - 4.6) / 4.9 * 640, y = 80;
    line(s, [X(4.6), y], [X(9.5), y], { width: 2.8, cls: '' }); path(s, `M${X(9.5)} ${y}l-12 -7v14z`, { fill: INK, stroke: 'none', cls: '' });
    [[5, 25], [6, 36], [7, 49], [8, 64], [9, 81]].forEach(([n, q]) => { line(s, [X(n), y - 8], [X(n), y + 8], { width: 2.2, cls: '' }); txt(s, X(n), y + 24, String(n), { size: 19 }); lab(host, T(`\\sqrt{${q}}`), X(n), y - 30, 'u7l1-sm'); });
    Geo.dot(s, [X(7.07), y], { r: 6, color: RED });
    line(s, [X(7.5), 18], [X(7.12), y - 10], { width: 1.8, color: RED, cls: '' });
    lab(host, `${T('\\sqrt{50}')} is just past 7, because 50 is just past 49`, X(7.5) + 170, 12, 'u7l1-red').inner.style.fontSize = '18px';
  },
  types(host) {
    const s = figSvg(host, 960, 160), cells = [
      ['equilateral', triAngles(60, 60), [0, 1, 2], null], ['isosceles', triAngles(70, 70), [1, 2], null], ['scalene', triAngles(30, 55), [], null],
      ['acute', triAngles(55, 65), [], null], ['right', triAngles(90, 35), [], 0], ['obtuse', triAngles(25, 120), [], null]];
    cells.forEach(([nm, pts, tk, rt], i) => {
      const P = fit(pts, 80 + i * 160, 64, 130, 100);
      path(s, polyD(P), { width: 3, fill: '#fbf6ec', cls: '' }); tk.forEach((j) => tick(s, P[j], P[(j + 1) % 3]));
      if (rt != null) { const k = corner(P[rt], P[(rt + 1) % 3], P[(rt + 2) % 3]); rightSq(s, P[rt], k.st, 13); }
      if (nm === 'obtuse') { const k = corner(P[2], P[0], P[1]); path(s, arcD(P[2], 16, k.st, k.sp), { width: 2.2, stroke: RED, cls: '' }); }
      txt(s, 80 + i * 160, 145, nm, { size: 18, color: '#6e4a1c', weight: 800 });
    });
    line(s, [480, 10], [480, 150], { width: 1.5, color: '#e2dacb', cls: '' });
  },
  ex7a(host) { const s = figSvg(host, 270, 200); triFig(s, fit(triAngles(62, 71), 135, 106, 220, 160), { angles: ['62°', '71°', 'x'] }); },
  ex7b(host) { const s = figSvg(host, 270, 200); triFig(s, fit(triAngles(90, 62), 135, 104, 220, 170), { angles: ['', 'x', '28°'] }); },
  ex7c(host) { const s = figSvg(host, 270, 200); triFig(s, fit(triAngles(65, 65), 135, 104, 220, 165), { ticks: [1, 2], angles: ['65°', 'y', 'x'] }); },
  ex7d(host) { const s = figSvg(host, 300, 140); triFig(s, fit(triAngles(35, 35), 150, 76, 260, 100), { ticks: [1, 2], angles: ['z', 'z', '110°'], r: 30 }); },
  parts(host) {
    const s = figSvg(host, 380, 290), P = fit([[0, 0], [0, 2.2], [3.2, 0]], 196, 140, 280, 200), [C, B, Ap] = P;
    path(s, polyD(P), { width: 3.2, fill: '#fbf6ec', cls: '' }); rightSq(s, C, 0, 18);
    txt(s, C[0] - 16, C[1] + 16, 'C', { size: 22, italic: true }); txt(s, B[0], B[1] - 18, 'B', { size: 22, italic: true }); txt(s, Ap[0] + 18, Ap[1] + 14, 'A', { size: 22, italic: true });
    txt(s, C[0] - 18, (C[1] + B[1]) / 2, 'a', { size: 22, italic: true }); txt(s, (C[0] + Ap[0]) / 2, C[1] + 20, 'b', { size: 22, italic: true });
    const M = mid(B, Ap), out = A([0, 0], dirTo(B, Ap) + 90, 1), al = A([0, 0], dirTo(B, Ap), 1), rot = Math.atan2(Ap[1] - B[1], Ap[0] - B[0]) / RAD;
    txt(s, M[0] + out[0] * 20 - al[0] * 40, M[1] + out[1] * 20 - al[1] * 40, 'c', { size: 22, italic: true });
    const hx = M[0] + out[0] * 20 + al[0] * 50, hy = M[1] + out[1] * 20 + al[1] * 50, tg = txt(s, hx, hy, 'hypotenuse', { size: 17, color: HYP, weight: 800 }); tg.setAttribute('transform', `rotate(${rot.toFixed(1)} ${hx.toFixed(1)} ${hy.toFixed(1)})`);
    const t2 = txt(s, C[0] - 46, (C[1] + B[1]) / 2, 'leg', { size: 17, color: BLUE, weight: 800 }); t2.setAttribute('transform', `rotate(-90 ${C[0] - 46} ${(C[1] + B[1]) / 2})`);
    txt(s, (C[0] + Ap[0]) / 2, C[1] + 46, 'leg', { size: 17, color: BLUE, weight: 800 });
  },
  pqr(host) {
    const s = figSvg(host, 330, 260), o = HYPF.pqr, P = fit([o.pts.Q, o.pts.P, o.pts.R], 165, 136, 250, 170), [Q, Pp, R] = P, C0 = cen(P);
    path(s, polyD(P), { width: 3.2, fill: '#fbf6ec', cls: '' }); const k = corner(Q, Pp, R); rightSq(s, Q, k.st, 16);
    [[Q, 'Q'], [Pp, 'P'], [R, 'R']].forEach(([V, n]) => { const u = A([0, 0], dirTo(C0, V), 22); txt(s, V[0] + u[0], V[1] + u[1], n, { size: 22, italic: true }); });
    const g = svgEl('g', { class: 'u7l1-fa' }, s);
    sideLab(g, Q, Pp, C0, 'r', { size: 22, color: RED, italic: true }); sideLab(g, Q, R, C0, 'p', { size: 22, color: RED, italic: true }); sideLab(g, Pp, R, C0, 'q', { size: 22, color: RED, italic: true });
  },
  h1(host) { const s = figSvg(host, 260, 200), P = fit([[0, 0], [8, 0], [0, 6]], 130, 96, 190, 150), c0 = cen(P); triFig(s, P, { angles: ['', null, null] }); [['8 m', 0, 1], ['10 m', 1, 2], ['6 m', 2, 0]].forEach(([t, i, j]) => sideLab(s, P[i], P[j], c0, t, { size: 18 })); },
  h2(host) { const s = figSvg(host, 260, 200), P = fit([[0, 0], [5, 0], [5, 5.5]], 130, 96, 190, 160), c0 = cen(P); triFig(s, P, { angles: [null, '', null] }); [['5 ft', 0, 1], ['5.5 ft', 1, 2], ['7.4 ft', 2, 0]].forEach(([t, i, j]) => sideLab(s, P[i], P[j], c0, t, { size: 18 })); },
  h3(host) { const s = figSvg(host, 280, 200), P = fit([[0, 0], [9, 0], [7.18, 3.61]], 140, 100, 230, 140), c0 = cen(P); triFig(s, P, { angles: [null, null, ''] }); [['15 cm', 0, 1], ['6.7 cm', 1, 2], ['13.4 cm', 2, 0]].forEach(([t, i, j]) => sideLab(s, P[i], P[j], c0, t, { size: 18 })); },
  ladder(host) {
    const s = figSvg(host, 300, 280), Wx = 60, Gy = 240, L = 210, t = 75, F = [Wx + L * Math.cos(t * RAD), Gy], Tp = [Wx, Gy - L * Math.sin(t * RAD)];
    for (let y = 8; y < Gy; y += 12) line(s, [Wx - 14, y + 10], [Wx, y], { width: 1.4, color: GREY, cls: '' });
    for (let x = Wx - 14; x < 270; x += 12) line(s, [x, Gy + 12], [x + 10, Gy], { width: 1.4, color: GREY, cls: '' });
    line(s, [Wx, 4], [Wx, Gy], { width: 3, cls: '' }); line(s, [Wx, Gy], [270, Gy], { width: 3, cls: '' });
    line(s, F, Tp, { width: 7, color: '#8a5a1c', cls: '' });
    txt(s, Wx - 30, 40, 'wall', { size: 16, color: SLATE }); txt(s, 220, Gy + 26, 'ground', { size: 16, color: SLATE });
    const m = lerp(F, Tp, 0.55); txt(s, m[0] + 34, m[1], 'ladder', { size: 16, color: '#6e4a1c' });
    path(s, arcD(F, 30, 180 - t, t), { width: 2.4, cls: '' }); txt(s, ...A(F, 180 - t / 2, 50), '75°', { size: 18 });
    const g = svgEl('g', { class: 'u7l1-fa' }, s); rightSq(g, [Wx, Gy], 0, 18, { color: RED, width: 3 });
  }
};
[2, 3, 4, 5].forEach((n) => { FIG['sq' + n] = (host) => { const c = 28, s = figSvg(host, n * c + 6, n * c + 6); grid(s, 3, 3, n, c); }; });
document.querySelectorAll('.u7l1-fig[data-fig]').forEach((host) => { const f = FIG[host.dataset.fig]; if (f) f(host); });

/* ======================================================================================
 * Stand Up Break
 * ====================================================================================== */
standup('u7l1', {
  intro: 'Show every step. Check square roots by squaring, and check angles by adding to 180°.',
  levels: {
    BEG: (r) => r.pick([
      () => { const n = r.int(2, 15); return { text: 'Find the square.', q: `${n}^2`, a: [`${n}\\times${n}=${n * n}`] }; },
      () => { const n = r.int(2, 15); return { text: 'Find the square root without a calculator.', q: `\\sqrt{${n * n}}`, a: [`${n}`, `\\text{because } ${n}^2=${n * n}`] }; },
      () => { const a = r.int(30, 85), b = r.int(30, 85); return { text: `A triangle has angles of <b>${a}°</b> and <b>${b}°</b>. Find the third angle.`, q: '', a: [`180^\\circ-${a}^\\circ-${b}^\\circ=${180 - a - b}^\\circ`] }; }
    ])(),
    PRG: (r) => r.pick([
      () => {
        let N; do { N = r.int(3, 200); } while (Number.isInteger(Math.sqrt(N)));
        const lo = Math.floor(Math.sqrt(N)), hi = lo + 1, cl = N - lo * lo < hi * hi - N ? lo : hi;
        return { text: `Estimate, then use your calculator (nearest tenth). Between which two whole numbers is it? Which one is it closer to?`, q: `\\sqrt{${N}}`, a: [`${lo * lo}<${N}<${hi * hi}`, `\\text{between } ${lo} \\text{ and } ${hi}\\text{, closer to } ${cl}`, `\\sqrt{${N}}=${dec3(Math.sqrt(N))}\\ldots\\approx${r1(Math.sqrt(N))}`] };
      },
      () => { const a = r.int(12, 78); return { text: `A right triangle has a <b>${a}°</b> angle. Find the other acute angle.`, q: '', a: [`90^\\circ-${a}^\\circ=${90 - a}^\\circ`, `\\text{check: } 90+${a}+${90 - a}=180`] }; },
      () => { const b = r.int(25, 80); return { text: `An isosceles triangle has two equal angles of <b>${b}°</b>. Find the third angle. Name the triangle by its angles.`, q: '', a: [`180^\\circ-${b}^\\circ-${b}^\\circ=${180 - 2 * b}^\\circ`, `\\text{${180 - 2 * b > 90 ? 'obtuse' : 180 - 2 * b === 90 ? 'right' : 'acute'}}`] }; }
    ])(),
    MAS: (r) => r.pick([
      () => { const p = 2 * r.int(10, 75); return { text: `A roof truss is an isosceles triangle with a <b>${p}°</b> angle at the peak. Find the two equal angles at the bottom.`, q: '', a: [`180^\\circ-${p}^\\circ=${180 - p}^\\circ`, `${180 - p}^\\circ\\div2=${(180 - p) / 2}^\\circ`] }; },
      () => {
        let A2; do { A2 = r.int(12, 150); } while (Number.isInteger(Math.sqrt(A2)));
        const sd = Math.sqrt(A2);
        return { text: `A square garden has an area of <b>${A2} m²</b>. How long is each side, and how much fencing goes all the way around it? (nearest tenth)`, q: '', a: [`\\text{side}=\\sqrt{${A2}}=${dec3(sd)}\\ldots\\approx${r1(sd)}\\text{ m}`, `\\text{fence}=4\\times${dec3(sd)}\\ldots\\approx${r1(4 * sd)}\\text{ m}`] };
      },
      () => { const g = r.int(50, 82); return { text: `A ladder leans on a wall and makes <b>${g}°</b> with the level ground. What angle does it make with the wall? Which part is the hypotenuse?`, q: '', a: [`90^\\circ-${g}^\\circ=${90 - g}^\\circ`], atext: 'The <b>ladder</b> is the hypotenuse (across from the right angle where the wall meets the ground).' }; }
    ])()
  }
});
