/* Math 10-3 · Unit 7 · Lesson 2 — The Pythagorean Theorem: Finding the Hypotenuse.
 * Explainers (Class view unless marked Full): counting a tilted square with a box (Example 1 check), tiles pouring from the
 * squares on the legs into the square on the hypotenuse (Example 2 check), the rearrangement proof (Full, Geo.pythagProof),
 * naming the hypotenuse with any letters (Example 3 check), finding the hypotenuse in 5 steps with a reasonableness number
 * line (Example 4 check), two traps (Full), the hinge counterexample with water poured between the squares (Example 5 check),
 * problems in context: TV, park shortcut, deck stairs (Examples 6–8 checks), and feet ↔ inches on a tape (Example 8).
 * Also: the hands-on hinge, static figures, the Math History box (Plimpton 322) and the Stand Up Break. */
import { h, add, tex, svgEl, tween, anim, drawIn, stamp, stampIn, pulse, liveCtx, mountExplainers } from '../blocks.js';
import { Geo } from '../geo.js';
import { standup } from '../standup.js';

const INK = '#1c2230', BLUE = '#1f5bd6', GREEN = '#12805a', RED = '#c93a33', AMBER = '#c27a0e', BROWN = '#9a6a24', GREY = '#9aa0ab', MUTED = '#6a7182';
const CA = RED, CB = BLUE, CC = BROWN;          // squares on leg a, leg b and the hypotenuse c (as in geo.js)
const WATER = '#4f9fdc';
const T = (s) => tex(String(s));
const RAD = Math.PI / 180;
/** thousands with a thin space: TeX (12\,529) and plain text (narrow no-break space) */
const grp = (v, sep) => { const [i, d] = String(v).split('.'); const ii = i.replace(/\B(?=(\d{3})+(?!\d))/g, sep); return d ? ii + '.' + d : ii; };
const tn = (v) => grp(v, '\\,');
const pn = (v) => grp(v, ' ');
const nf = (v, d = 4) => String(parseFloat((+v).toFixed(d)));     // 56.25, 7.5, 12.96
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const show = (el) => { el.style.opacity = 1; return el; };
const op = (c, el, to, ms = 350) => anim(c, el, [{ opacity: to }], ms);
const stageSvg = (stage, W, H) => add(stage, svgEl('svg', { class: 'u7l2-svg', width: W, height: H, viewBox: `0 0 ${W} ${H}` }), 0, 0);
const figSvg = (host, W, H) => { host.style.width = W + 'px'; host.style.height = H + 'px'; return svgEl('svg', { class: 'u7l2-svg', width: W, height: H, viewBox: `0 0 ${W} ${H}` }, host); };
/** HTML label centred on (x, y) in a 0×0 holder (c.pop's scale doesn't undo the centring) */
function lab(host, html, x, y, cls = '') { const hold = h('div', 'u7l2-hold'); hold.appendChild(h('div', 'u7l2-lab ' + cls, html)); add(host, hold, x, y); return hold; }
/** HTML label whose left edge is at x, centred on y */
function labL(host, html, x, y, cls = '') { const hold = h('div', 'u7l2-hold'); hold.appendChild(h('div', 'u7l2-labl ' + cls, html)); add(host, hold, x, y); return hold; }
function line(parent, P, Q, o = {}) {
  return svgEl('line', { x1: P[0].toFixed(2), y1: P[1].toFixed(2), x2: Q[0].toFixed(2), y2: Q[1].toFixed(2), stroke: o.color || INK, 'stroke-width': o.width || 3, 'stroke-linecap': o.cap || 'round', 'stroke-dasharray': o.dash || null, class: o.cls === undefined ? 'bk-stroke' : o.cls, opacity: o.opacity ?? null }, parent);
}
function path(parent, d, o = {}) {
  return svgEl('path', { d, fill: o.fill || 'none', 'fill-opacity': o.fo ?? null, stroke: o.stroke === undefined ? INK : o.stroke, 'stroke-width': o.width || 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-dasharray': o.dash || null, class: o.cls === undefined ? 'bk-stroke' : o.cls, opacity: o.opacity ?? null }, parent);
}
const polyD = (pts, closed = true) => 'M' + pts.map((p) => p[0].toFixed(2) + ' ' + p[1].toFixed(2)).join('L') + (closed ? 'Z' : '');
const txt = (parent, x, y, s, o = {}) => Geo.text(parent, x, y, s, Object.assign({ size: 20 }, o));
const g = (parent, cls) => svgEl('g', cls ? { class: cls } : {}, parent);
const popable = (el) => { el.style.transformBox = 'fill-box'; el.style.transformOrigin = 'center'; return el; };
const lerp = (a, b, t) => a + (b - a) * t;
const lerpP = (P, Q, t) => [lerp(P[0], Q[0], t), lerp(P[1], Q[1], t)];
const mid = (P, Q) => lerpP(P, Q, 0.5);
const len = (P, Q) => Math.hypot(Q[0] - P[0], Q[1] - P[1]);
const cen = (pts) => [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
const clamp01 = (t) => Math.max(0, Math.min(1, t));
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
/** a small right-angle square at V between the directions to P and Q (px) */
function rmark(parent, V, P, Q, s = 16, o = {}) {
  const u = [(P[0] - V[0]) / len(V, P), (P[1] - V[1]) / len(V, P)], v = [(Q[0] - V[0]) / len(V, Q), (Q[1] - V[1]) / len(V, Q)];
  return path(parent, polyD([[V[0] + u[0] * s, V[1] + u[1] * s], [V[0] + (u[0] + v[0]) * s, V[1] + (u[1] + v[1]) * s], [V[0] + v[0] * s, V[1] + v[1] * s]], false), { width: o.width || 2.4, stroke: o.color || INK, cls: o.cls ?? 'bk-stroke' });
}
/** map math points (y up) into a W × H box at (x0, y0) → P(p) = px, P.u = px per unit */
function fitter(pts, W, H, pad = 24, maxU = Infinity, x0 = 0, y0 = 0) {
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const x1 = Math.min(...xs), x2 = Math.max(...xs), y1 = Math.min(...ys), y2 = Math.max(...ys);
  const u = Math.min((W - 2 * pad) / (x2 - x1 || 1), (H - 2 * pad) / (y2 - y1 || 1), maxU);
  const ox = x0 + W / 2 - (x1 + x2) / 2 * u, oy = y0 + H / 2 + (y1 + y2) / 2 * u;
  const P = (p) => [ox + p[0] * u, oy - p[1] * u]; P.u = u; return P;
}
/** the square on side P0P1, on the side away from R (math or px points alike) */
function sqOn(P0, P1, R) {
  const d = [P1[0] - P0[0], P1[1] - P0[1]]; let n = [-d[1], d[0]];
  const M = mid(P0, P1); if ((R[0] - M[0]) * n[0] + (R[1] - M[1]) * n[1] > 0) n = [d[1], -d[0]];
  return [P0, P1, [P1[0] + n[0], P1[1] + n[1]], [P0[0] + n[0], P0[1] + n[1]]];
}
/** a light grid over [x1, x2] × [y1, y2] (math, whole units) */
function gridLines(parent, P, x1, x2, y1, y2, o = {}) {
  let d = '';
  for (let x = x1; x <= x2; x++) { const A = P([x, y1]), B = P([x, y2]); d += `M${A[0].toFixed(1)} ${A[1].toFixed(1)}V${B[1].toFixed(1)}`; }
  for (let y = y1; y <= y2; y++) { const A = P([x1, y]), B = P([x2, y]); d += `M${A[0].toFixed(1)} ${A[1].toFixed(1)}H${B[0].toFixed(1)}`; }
  return path(parent, d, { stroke: o.color || '#cfd5df', width: o.width || 1.2, cls: '' });
}
/** the a, b, c squares of a right triangle with legs a (up) and b (right), right angle at the origin (math coords) */
const SQ = (a, b) => ({ A: [[-a, 0], [0, 0], [0, a], [-a, a]], B: [[0, 0], [b, 0], [b, -b], [0, -b]], C: [[0, a], [b, 0], [a + b, b], [a, a + b]], tri: [[0, 0], [b, 0], [0, a]] });

/* ======================================================================================
 * 1. Count the tilted square with a box (Example 1)
 * ====================================================================================== */
const box = {
  title: 'Count the tilted square with a box',
  height: 440,
  choices: [{ v: '2,3', label: 'Legs 2 and 3' }, { sep: 'Example 1 check:' }, { v: '3,4', label: 'Legs 3 and 4' }],
  ask: (v) => (v === '3,4' ? 'Example 1: the legs are 3 and 4 units. Find the areas of squares A, B and C.' : 'A right triangle has legs of 2 units and 3 units. Find the area of each square, even the tilted one.'),
  make(stage, v, ex) {
    const [a, b] = v.split(',').map(Number), s = a + b, t = a * b / 2, c2 = a * a + b * b, cInt = Number.isInteger(Math.sqrt(c2));
    const W = ex.W, H = 440, ox = (W - 960) / 2, svg = stageSvg(stage, W, H), Q = SQ(a, b);
    const P = fitter([[-a, -b], [s, s]], 470, H, 16, 44, ox, 0), Pp = (pts) => pts.map(P);
    gridLines(svg, P, -a, s, -b, s);
    const sA = hide(popable(g(svg))), sB = hide(popable(g(svg))), sC = hide(popable(g(svg)));
    path(sA, polyD(Pp(Q.A)), { stroke: CA, fill: CA, fo: 0.16, width: 3, cls: '' });
    path(sB, polyD(Pp(Q.B)), { stroke: CB, fill: CB, fo: 0.16, width: 3, cls: '' });
    const cFill = path(sC, polyD(Pp(Q.C)), { stroke: CC, fill: CC, fo: 0, width: 3.4, cls: '' });
    txt(sA, ...P([-a / 2, a / 2]), `A = ${a * a}`, { size: 21, color: CA });
    txt(sB, ...P([b / 2, -b / 2]), `B = ${b * b}`, { size: 21, color: CB });
    const cLab = txt(sC, ...P(cen(Q.C)), 'C', { size: 24, color: CC });
    path(svg, polyD(Pp(Q.tri)), { stroke: INK, fill: '#9aa0ab', fo: 0.55, width: 3.4, cls: '' });
    rmark(svg, P([0, 0]), P([1, 0]), P([0, 1]), 14);
    const boxEl = hide(path(svg, polyD(Pp([[0, 0], [s, 0], [s, s], [0, s]])), { stroke: RED, width: 3, dash: '10 7' }));
    const corners = [Q.tri, [[b, 0], [s, 0], [s, b]], [[s, b], [s, s], [a, s]], [[a, s], [0, s], [0, a]]].map((tr) => {
      const gg = hide(popable(g(svg))); path(gg, polyD(Pp(tr)), { stroke: AMBER, fill: '#f2c14e', fo: 0.55, width: 2, cls: '' }); txt(gg, ...P(cen(tr)), String(t), { size: 20, color: '#7a4a06' }); return gg;
    });
    const x0 = ox + 500, ys = [40, 96, 152, 208, 264, 320];
    const E = [
      `A=${a}\\times${a}=${a * a}`, `B=${b}\\times${b}=${b * b}`, `\\text{box}=${s}\\times${s}=${s * s}`,
      `4\\text{ triangles}=4\\times${t}=${4 * t}`, `C=${s * s}-${4 * t}=${c2}`, `A+B=${a * a}+${b * b}=${c2}`
    ].map((e, i) => hide(labL(stage, T(e), x0, ys[i], 'u7l2-eq' + (i === 5 ? ' u7l2-eqk' : ''))));
    const st = hide(stamp(stage, 'A + B = C ✓', { ok: true, x: ox + 720, y: 392 }));
    return [
      { cap: `Square A sits on the ${a}-unit leg. Count: ${T(`${a}\\times${a}=${a * a}`)} squares.`, run: async (c) => { show(sA); await c.pop(sA, 420); await c.pop(show(E[0])); } },
      { cap: `Square B sits on the ${b}-unit leg: ${T(`${b}\\times${b}=${b * b}`)} squares.`, run: async (c) => { show(sB); await c.pop(sB, 420); await c.pop(show(E[1])); } },
      { cap: 'Square C sits on the hypotenuse. It is <b>tilted</b>, so its squares are cut into pieces. Hard to count!', run: async (c) => { show(sC); await c.pop(sC, 420); await pulse(c, sC, 1.05, 600); } },
      { cap: `Draw a ${T(`${s}\\times${s}`)} box around it, with a corner at the right angle: <b>${s * s}</b> squares.`, run: async (c) => { show(boxEl); await drawIn(boxEl, 900, c); await c.pop(show(E[2])); } },
      { cap: `The box also holds 4 triangles (one is the grey one). Each has legs ${a} and ${b}: ${T(`${a}\\times${b}\\div2=${t}`)}.`, run: async (c) => { for (const k of corners) { show(k); await c.pop(k, 330); } await c.pop(show(E[3])); } },
      { cap: `Take them away. Square C ${T(`=${s * s}-${4 * t}=${c2}`)}.`, run: async (c) => { await Promise.all(corners.map((k) => op(c, k, 0.25, 500))); await tween(c, 600, (u) => cFill.setAttribute('fill-opacity', (0.3 * u).toFixed(3))); cLab.textContent = `C = ${c2}`; await c.pop(cLab, 360); await c.pop(show(E[4])); } },
      { cap: `Compare: ${T(`A+B=${a * a}+${b * b}=${c2}`)}, the same as C! ${cInt ? `A square of area ${c2} has side ${Math.sqrt(c2)}, so the hypotenuse is <b>${Math.sqrt(c2)} units</b>.` : `So the hypotenuse is ${T(`\\sqrt{${c2}}\\approx${nf(Math.sqrt(c2), 1)}`)} units long.`}`, run: async (c) => { await c.pop(show(E[5])); await stampIn(c, show(st)); } }
    ];
  }
};

/* ======================================================================================
 * 2. Pour the tiles (Example 2)
 * ====================================================================================== */
const pour = {
  title: 'Pour the tiles from the two small squares into the big one',
  height: 470,
  choices: [{ v: '3,4', label: '3, 4, 5' }, { sep: 'Example 2 check:' }, { v: '6,8', label: '6, 8, 10' }, { v: '5,12', label: '5, 12, 13' }, { v: '8,15', label: '8, 15, 17' }],
  ask: (v) => { const [a, b] = v.split(',').map(Number), c = Math.round(Math.hypot(a, b)); return v === '3,4' ? 'A right triangle has legs 3 and 4 and hypotenuse 5. Do the squares on the legs fill the square on the hypotenuse?' : `Example 2: legs ${a} cm and ${b} cm, hypotenuse ${c} cm. Find ${T('a^2')}, ${T('b^2')}, ${T('a^2+b^2')} and ${T('c^2')}.`; },
  tap: true,
  make(stage, v, ex) {
    const [a, b] = v.split(',').map(Number), c = Math.round(Math.hypot(a, b)), N = a * a + b * b;
    const W = ex.W, H = 470, ox = (W - 960) / 2, svg = stageSvg(stage, W, H), Q = SQ(a, b);
    const P = fitter([[-a, -b], [a + b, a + b]], 540, H, 14, 40, ox, 0), u = P.u, Pp = (pts) => pts.map(P);
    const triG = g(svg);
    path(triG, polyD(Pp(Q.tri)), { stroke: INK, fill: '#f3efe6', width: 3.4, cls: '' });
    rmark(triG, P([0, 0]), P([1, 0]), P([0, 1]), Math.min(16, u * 0.6));
    const sl = hide(popable(g(svg))), Hm = mid(P([b, 0]), P([0, a])), O0 = P([0, 0]), hn = [O0[0] - Hm[0], O0[1] - Hm[1]], hL = Math.hypot(...hn);
    txt(sl, P([0, a / 2])[0] + 16, P([0, a / 2])[1], String(a), { size: 19, color: CA });
    txt(sl, P([b / 2, 0])[0], P([b / 2, 0])[1] - 15, String(b), { size: 19, color: CB });
    txt(sl, Hm[0] + hn[0] / hL * 18, Hm[1] + hn[1] / hL * 18, String(c), { size: 19, color: CC });
    const oA = hide(popable(g(svg))), oB = hide(popable(g(svg))), oC = hide(popable(g(svg)));
    path(oA, polyD(Pp(Q.A)), { stroke: CA, width: 2.6, cls: '' });
    path(oB, polyD(Pp(Q.B)), { stroke: CB, width: 2.6, cls: '' });
    // the empty cells of the hypotenuse square
    const e1 = [b / c, -a / c], e2 = [a / c, b / c], C0 = [0, a];
    const cellM = (i, j) => [C0[0] + (i + 0.5) * e1[0] + (j + 0.5) * e2[0], C0[1] + (i + 0.5) * e1[1] + (j + 0.5) * e2[1]];
    let dC = '';
    for (let k = 1; k < c; k++) {
      const A1 = P([C0[0] + k * e1[0], C0[1] + k * e1[1]]), A2 = P([C0[0] + k * e1[0] + c * e2[0], C0[1] + k * e1[1] + c * e2[1]]);
      const B1 = P([C0[0] + k * e2[0], C0[1] + k * e2[1]]), B2 = P([C0[0] + k * e2[0] + c * e1[0], C0[1] + k * e2[1] + c * e1[1]]);
      dC += `M${A1[0].toFixed(1)} ${A1[1].toFixed(1)}L${A2[0].toFixed(1)} ${A2[1].toFixed(1)}M${B1[0].toFixed(1)} ${B1[1].toFixed(1)}L${B2[0].toFixed(1)} ${B2[1].toFixed(1)}`;
    }
    path(oC, dC, { stroke: CC, width: 1, opacity: 0.45, cls: '' });
    path(oC, polyD(Pp(Q.C)), { stroke: CC, width: 3, cls: '' });
    // the tiles
    const tileL = g(svg), rot = Math.atan2(a, b) / RAD, sz = Math.max(3, u - Math.max(1.2, u * 0.08));
    const src = [], dst = [];
    for (let j = 0; j < a; j++) for (let i = 0; i < a; i++) src.push({ p: P([-a + i + 0.5, j + 0.5]), col: CA });
    for (let j = 0; j < b; j++) for (let i = 0; i < b; i++) src.push({ p: P([i + 0.5, -(j + 0.5)]), col: CB });
    for (let j = 0; j < c; j++) for (let i = 0; i < c; i++) dst.push(P(cellM(i, j)));
    const tiles = src.map((sItem) => {
      const r = svgEl('rect', { x: (-sz / 2).toFixed(2), y: (-sz / 2).toFixed(2), width: sz.toFixed(2), height: sz.toFixed(2), rx: Math.min(3, sz * 0.15).toFixed(1), fill: sItem.col, 'fill-opacity': 0.55, stroke: sItem.col, 'stroke-width': u > 14 ? 1.4 : 0.8 }, tileL);
      r.setAttribute('transform', `translate(${sItem.p[0].toFixed(2)} ${sItem.p[1].toFixed(2)})`); return r;
    });
    tileL.style.opacity = 0;
    const tA = hide(txt(svg, ...P([-a / 2, a / 2]), String(a * a), { size: Math.min(26, 10 + u * 0.5), color: '#7d1f19', halo: 4 }));
    const tB = hide(txt(svg, ...P([b / 2, -b / 2]), String(b * b), { size: Math.min(26, 10 + u * 0.5), color: '#123a8a', halo: 4 }));
    const tC = hide(popable(txt(svg, ...P(cen(Q.C)), `${c * c}`, { size: Math.min(30, 12 + u * 0.6), color: '#5a3a10', halo: 6 })));
    const x0 = ox + 580;
    const E = [
      [`a^2=${a}^2=${a * a}`, 'u7l2-ca'], [`b^2=${b}^2=${b * b}`, 'u7l2-cb'], [`c^2=${c}^2=${c * c}`, 'u7l2-cc'], [`a^2+b^2=${a * a}+${b * b}=${N}`, '']
    ].map(([e, cl], i) => hide(labL(stage, T(e), x0, 70 + i * 66, 'u7l2-eq ' + cl)));
    const st = hide(stamp(stage, `${a * a} + ${b * b} = ${c * c} ✓`, { ok: true, x: ox + 760, y: 380 }));
    const pourMs = Math.min(3600, 2000 + N * 6);
    return [
      { cap: `A right triangle with legs <b>${a}</b> and <b>${b}</b>. Its hypotenuse is <b>${c}</b>.`, run: async (c2) => { show(sl); await c2.pop(sl, 450); await pulse(c2, triG, 1.04, 500); } },
      { cap: `Build a square on each leg: ${T(`${a}^2=${a * a}`)} tiles and ${T(`${b}^2=${b * b}`)} tiles.`, run: async (cx) => { show(oA); show(oB); tileL.style.opacity = 1; await cx.fadeIn(tileL, 500); show(tA); show(tB); await cx.pop(tA); await cx.pop(tB); await cx.pop(show(E[0])); await cx.pop(show(E[1])); } },
      { cap: `Build a square on the hypotenuse. It has room for ${T(`${c}^2=${c * c}`)} tiles. Right now it is empty.`, run: async (cx) => { show(oC); await cx.pop(oC, 450); await cx.pop(show(E[2])); } },
      { cap: 'Now <b>pour</b> the tiles from the two small squares into the big one…', run: async (cx) => {
        op(cx, tA, 0, 300); op(cx, tB, 0, 300);
        const n = tiles.length;
        await tween(cx, pourMs, (T0) => {
          tiles.forEach((r, k) => {
            const s0 = n > 1 ? 0.6 * k / (n - 1) : 0, q = ease(clamp01((T0 - s0) / 0.4)), p = lerpP(src[k].p, dst[k], q), lift = Math.sin(Math.PI * q) * Math.min(40, u * 1.2);
            r.setAttribute('transform', `translate(${p[0].toFixed(2)} ${(p[1] - lift).toFixed(2)}) rotate(${(rot * q).toFixed(2)}) scale(${(1 + 0.18 * Math.sin(Math.PI * q)).toFixed(3)})`);
          });
        }, (x) => x);
      } },
      { cap: `They fill it <b>exactly</b>, with none left over: ${T(`${a * a}+${b * b}=${c * c}`)}. So ${T('a^2+b^2=c^2')} ✓`, run: async (cx) => { show(tC); await cx.pop(tC, 420); await cx.pop(show(E[3])); await stampIn(cx, show(st)); } }
    ];
  }
};

/* ======================================================================================
 * 2x. The rearrangement proof (Full)
 * ====================================================================================== */
const proof = {
  title: 'Why a² + b² = c² works for every right triangle',
  height: 400,
  choices: [{ v: '3,4', label: 'legs 3 and 4' }, { v: '5,2', label: 'legs 5 and 2' }],
  ask: (v) => { const [a, b] = v.split(',').map(Number); return `Two equal squares, each holding four copies of a right triangle with legs ${a} and ${b}. Compare the space that is left over.`; },
  make(stage, v, ex) {
    const [a, b] = v.split(',').map(Number), W = ex.W, PW = 760, PH = 350, x0 = (W - PW) / 2;
    const PF = Geo.pythagProof(stage, { x: x0, y: 0, width: PW, height: PH, a, b }); hide(PF.el);
    const s = a + b, u = Math.min((PW - 90) / (2 * s), (PH - 60) / s), side = s * u, gx = (PW - 2 * side) / 3, X = [gx, 2 * gx + side], Y = (PH - side) / 2 + 6, yl = Y + side + 26;
    const l1 = hide(lab(stage, `left over: ${T('c^2')}`, x0 + X[0] + side / 2, yl, 'u7l2-eq u7l2-cc')), l2 = hide(lab(stage, `left over: ${T('a^2+b^2')}`, x0 + X[1] + side / 2, yl, 'u7l2-eq'));
    const eq = hide(lab(stage, T('='), W / 2, yl, 'u7l2-big'));
    return [
      { cap: `Two big squares, the same size. Each side is ${T('a+b')}. Each holds the same <b>4 triangles</b>.`, run: async (c) => { show(PF.el); await c.fadeIn(PF.el, 600); } },
      { cap: `On the left, the space left over is the tilted square on the hypotenuse: ${T('c^2')}.`, run: (c) => c.pop(show(l1)) },
      { cap: 'On the right, slide three of the triangles to new spots. Nothing is added or taken away…', run: (c) => PF.play(c) },
      { cap: `…so the space left over is the same: two squares, ${T('a^2')} and ${T('b^2')}. That proves ${T('a^2+b^2=c^2')} for <b>every</b> right triangle.`, run: async (c) => { await c.pop(show(l2)); await c.pop(show(eq)); } }
    ];
  }
};

/* ======================================================================================
 * 2b. Naming the sides (Example 3)
 * ====================================================================================== */
const NAMES = {
  abc: { pts: [[0, 2.4], [3.6, 0], [0, 0]], vn: ['A', 'B', 'C'], right: 2, sl: ['a', 'b', 'c'], tl: ['a', 'b', 'c'], eq: 'a^2+b^2=c^2', legs: ['a', 'b'] },
  pqr: { pts: [[0, 2.6], [0, 0], [3.8, 0]], vn: ['P', 'Q', 'R'], right: 1, sl: ['p', 'q', 'r'], tl: ['p', 'q', 'r'], eq: 'p^2+r^2=q^2', legs: ['p', 'r'] },
  xyz: { pts: [[0, 0], [4, 0], [4, 2.6]], vn: null, right: 1, sl: ['z', 'y', 'x'], tl: ['z', 'y', 'x'], eq: 'x^2+z^2=y^2', legs: ['x', 'z'] },
  lad: { pts: [[0, 0], [0, 3.2], [2.0, 0]], vn: null, right: 0, sl: ['ℓ', 'd', 'h'], tl: ['\\ell', 'd', 'h'], eq: 'h^2+d^2=\\ell^2', legs: ['h', 'd'], ladder: true }
};
/** draw a named right triangle (NAMES entry) into svg, fitted in a box; returns the parts */
function drawNamed(svg, cfg, W, H, x0, y0, o = {}) {
  const extra = cfg.ladder ? [[-0.5, 0], [-0.5, 3.7], [2.8, 0]] : [];
  const F = fitter(cfg.pts.concat(extra), W, H, o.pad ?? 40, o.maxU ?? 95, x0, y0), V = cfg.pts.map(F);
  const parts = { V, F, sides: [] };
  if (cfg.ladder) {
    path(svg, polyD([F([-0.45, 0]), F([0, 0]), F([0, 3.7]), F([-0.45, 3.7])]), { stroke: '#7a7f8a', fill: '#d9dde4', width: 2, cls: '' });
    line(svg, F([-0.7, 0]), F([2.9, 0]), { width: 3, color: '#6b5b45', cls: '' });
  }
  const r = cfg.right, oi = [0, 1, 2].filter((i) => i !== r);
  [0, 1, 2].forEach((i) => {
    const [p, q] = [0, 1, 2].filter((k) => k !== i);
    const isHyp = i === r, colr = cfg.ladder && isHyp ? '#8a5a1c' : INK;
    parts.sides[i] = line(svg, V[p], V[q], { width: cfg.ladder && isHyp ? 7 : o.width || 3.2, color: colr, cls: '' });
  });
  if (cfg.ladder) { const A = V[1], B = V[2]; for (let k = 1; k < 6; k++) { const M = lerpP(A, B, k / 6), d = [(B[0] - A[0]) / len(A, B), (B[1] - A[1]) / len(A, B)], n = [-d[1] * 7, d[0] * 7]; line(svg, [M[0] - n[0], M[1] - n[1]], [M[0] + n[0], M[1] + n[1]], { width: 2.5, color: '#b0844a', cls: '' }); } }
  parts.mark = rmark(svg, V[r], V[oi[0]], V[oi[1]], o.rs || 16);
  const C0 = cen(V), size = o.size || 22;
  if (cfg.vn) cfg.vn.forEach((nm, i) => { const d = [V[i][0] - C0[0], V[i][1] - C0[1]], L = Math.hypot(...d); txt(svg, V[i][0] + d[0] / L * 26, V[i][1] + d[1] / L * 26, nm, { size: size + 1 }); });
  parts.labs = [0, 1, 2].map((i) => {
    const [p, q] = [0, 1, 2].filter((k) => k !== i), M = mid(V[p], V[q]); let n = [-(V[q][1] - V[p][1]), V[q][0] - V[p][0]]; const L = Math.hypot(...n); n = [n[0] / L, n[1] / L];
    if ((C0[0] - M[0]) * n[0] + (C0[1] - M[1]) * n[1] > 0) n = [-n[0], -n[1]];
    const off = cfg.ladder ? (i === r ? 40 : i === 2 ? -16 : 18) : 18, s = cfg.ladder && i === r ? 'ladder ℓ' : cfg.sl[i];
    return txt(svg, M[0] + n[0] * off, M[1] + n[1] * off, s, { size, italic: true, color: INK });
  });
  return parts;
}
const names = {
  title: 'Find the right angle, then the hypotenuse',
  height: 380,
  choices: [{ v: 'abc', label: T('\\triangle ABC') }, { sep: 'Example 3 check:' }, { v: 'pqr', label: '(a) P, Q, R' }, { v: 'xyz', label: '(b) x, y, z' }, { v: 'lad', label: '(c) the ladder' }],
  ask: (v) => (v === 'abc' ? `The right angle of ${T('\\triangle ABC')} is at ${T('C')}. Which side is the hypotenuse? Write the theorem.` : `Example 3${{ pqr: '(a)', xyz: '(b)', lad: '(c)' }[v]}: name the hypotenuse. Then write the Pythagorean theorem with the triangle’s own letters.`),
  make(stage, v, ex) {
    const cfg = NAMES[v], W = ex.W, H = 380, ox = (W - 960) / 2, svg = stageSvg(stage, W, H);
    const hl = g(svg), base = g(svg);
    const D = drawNamed(base, cfg, 500, H, ox + 10, 0, { maxU: 112 }), V = D.V, r = cfg.right, oi = [0, 1, 2].filter((i) => i !== r);
    const uu = oi.map((i) => [(V[i][0] - V[r][0]) / len(V[r], V[i]), (V[i][1] - V[r][1]) / len(V[r], V[i])]), RC = [V[r][0] + (uu[0][0] + uu[1][0]) * 9, V[r][1] + (uu[0][1] + uu[1][1]) * 9];
    const ring = hide(popable(svgEl('circle', { cx: RC[0].toFixed(1), cy: RC[1].toFixed(1), r: 21, fill: 'none', stroke: AMBER, 'stroke-width': 4 }, svg)));
    const hM = mid(V[oi[0]], V[oi[1]]), arr = hide(line(svg, lerpP(V[r], hM, 0.16), lerpP(V[r], hM, 0.86), { color: AMBER, width: 3.4, dash: '8 7' }));
    const hyp = hide(line(hl, V[oi[0]], V[oi[1]], { color: CC, width: 13, opacity: 0.35 }));
    const legs = oi.map((i, k) => hide(line(hl, V[i], V[r], { color: k ? CB : CA, width: 12, opacity: 0.3 })));
    const hn = cfg.tl[r], ln = cfg.legs, x0 = ox + 560;
    const e1 = hide(labL(stage, `hypotenuse: ${T(hn)}`, x0, 80, 'u7l2-eq u7l2-cc')), e2 = hide(labL(stage, `legs: ${T(ln[0])} and ${T(ln[1])}`, x0, 150, 'u7l2-eq'));
    const e3 = hide(labL(stage, T(cfg.eq), x0, 250, 'u7l2-eq u7l2-eqbig'));
    const where = v === 'abc' ? ` at ${T('C')}` : v === 'pqr' ? ` at ${T('Q')}` : v === 'lad' ? ', where the wall meets the ground' : '';
    return [
      { cap: `Find the <b>right angle</b> first: the small square${where}.`, run: async (c) => { show(ring); await c.pop(ring, 420); await pulse(c, D.mark, 1.3, 500); } },
      { cap: `The side <b>across from</b> the right angle is the hypotenuse: ${T(hn)}. It is the longest side.`, run: async (c) => { show(arr); await drawIn(arr, 600, c); show(hyp); await drawIn(hyp, 500, c); await c.pop(show(e1)); } },
      { cap: `The two sides that make the right angle are the <b>legs</b>: ${T(ln[0])} and ${T(ln[1])}.`, run: async (c) => { for (const L of legs) { show(L); await drawIn(L, 400, c); } await c.pop(show(e2)); } },
      { cap: `(leg)² + (leg)² = (hypotenuse)²: ${T(cfg.eq)}. The hypotenuse’s square is <b>alone</b> on one side.`, run: (c) => c.pop(show(e3), 450) }
    ];
  }
};

/* ======================================================================================
 * 3. Finding the hypotenuse in 5 steps (Example 4)
 * ====================================================================================== */
const HYPS = {
  d: { a: 9, b: 12, right: 'bl', unit: 'cm', legs: [9, 12] },
  a: { a: 21, b: 20, right: 'bl', unit: 'm', legs: [20, 21] },
  b: { a: 4, b: 7.5, right: 'br', unit: 'cm', legs: [7.5, 4] },
  c: { a: 6, b: 11, right: 'tl', unit: 'ft', legs: [11, 6] }
};
function hypNums(cfg) {
  const [l1, l2] = cfg.legs, s1 = +(l1 * l1).toFixed(4), s2 = +(l2 * l2).toFixed(4), sum = +(s1 + s2).toFixed(4), cv = Math.sqrt(sum);
  const exact = Math.abs(cv * 100 - Math.round(cv * 100)) < 1e-7, cr = exact ? nf(cv, 2) : nf(Math.round(cv * 10) / 10, 1);
  const trunc = exact ? '' : String(Math.floor(cv * 1000) / 1000);
  return { l1, l2, s1, s2, sum, cv, exact, cr, trunc, L: Math.max(l1, l2), S: +(l1 + l2).toFixed(4) };
}
const hyp = {
  title: 'Find the hypotenuse in 5 steps',
  height: 450,
  choices: [{ v: 'd', label: 'Legs 9 and 12' }, { sep: 'Example 4 check:' }, { v: 'a', label: '(a) 20 m, 21 m' }, { v: 'b', label: '(b) 7.5 cm, 4 cm' }, { v: 'c', label: '(c) 11 ft, 6 ft' }],
  ask: (v) => (v === 'd' ? 'A right triangle has legs of 9 cm and 12 cm. Find the hypotenuse and check that it is reasonable.' : `Example 4${{ a: '(a)', b: '(b)', c: '(c)' }[v]}: find the length of the hypotenuse${v === 'c' ? ', to the nearest tenth' : ''}. Check that the answer is reasonable.`),
  make(stage, v, ex) {
    const cfg = HYPS[v], n = hypNums(cfg), u = cfg.unit, W = ex.W, H = 450, ox = (W - 960) / 2;
    const Tr = Geo.rightTri(stage, { x: ox, y: 0, width: 420, height: 290, a: cfg.a, b: cfg.b, right: cfg.right, names: false, sides: { a: `${cfg.a} ${u}`, b: `${cfg.b} ${u}`, c: 'c' }, size: 21 });
    const x0 = ox + 450, ys = [30, 80, 130, 180, 232];
    const rootT = n.exact ? `c=\\sqrt{${tn(n.sum)}}=${n.cr}\\text{ ${u}}` : `c=\\sqrt{${tn(n.sum)}}=${n.trunc}\\ldots\\approx${n.cr}\\text{ ${u}}`;
    const E = ['a^2+b^2=c^2', `${n.l1}^2+${n.l2}^2=c^2`, `${tn(n.s1)}+${tn(n.s2)}=c^2`, `${tn(n.sum)}=c^2`, rootT].map((e, i) => hide(labL(stage, T(e), x0, ys[i], 'u7l2-eq' + (i === 4 ? ' u7l2-eqk' : ''))));
    // reasonableness number line
    const svg = stageSvg(stage, W, H), NL = hide(g(svg)), nx0 = ox + 50, nx1 = ox + 910, max = n.S * 1.1, X = (val) => nx0 + (nx1 - nx0) * val / max, ny = 378;
    svgEl('rect', { x: X(n.L).toFixed(1), y: ny - 40, width: (X(n.S) - X(n.L)).toFixed(1), height: 62, fill: GREEN, 'fill-opacity': 0.14, rx: 6 }, NL);
    line(NL, [nx0, ny], [nx1, ny], { width: 3, cls: '' });
    [[0, '0', INK], [n.L, `${nf(n.L)}`, INK], [n.S, `${nf(n.S)}`, INK]].forEach(([val, s]) => { line(NL, [X(val), ny - 12], [X(val), ny + 12], { width: 3, cls: '' }); txt(NL, X(val), ny + 30, s, { size: 19 }); });
    txt(NL, X(n.L), ny - 54, 'longest leg', { size: 16, color: MUTED });
    txt(NL, X(n.S), ny - 54, 'legs added', { size: 16, color: MUTED });
    txt(NL, (X(n.L) + X(n.S)) / 2, ny + 52, 'c must land in here', { size: 16, color: GREEN });
    const dotG = hide(popable(g(svg)));
    svgEl('circle', { cx: X(n.cv).toFixed(1), cy: ny, r: 9, fill: CC }, dotG); txt(dotG, X(n.cv), ny - 24, `c ≈ ${n.cr}`.replace('≈', n.exact ? '=' : '≈'), { size: 19, color: CC });
    const st = hide(stamp(stage, 'reasonable ✓', { ok: true, x: ox + 840, y: 286, size: 'sm' }));
    const lg = cfg.legs.map((x) => `${x} ${u}`).join(' and ');
    return [
      { cap: `<b>Step 1.</b> Find the right angle. The legs are ${lg}. The hypotenuse ${T('c')} is across from the right angle.`, run: async (c) => { await Tr.highlight(c, 'c'); } },
      { cap: `<b>Step 2.</b> Write the rule, then substitute the two legs: ${T(`${n.l1}^2+${n.l2}^2=c^2`)}.`, run: async (c) => { await c.pop(show(E[0])); await c.pop(show(E[1])); } },
      { cap: `<b>Step 3.</b> Square each leg, then add: ${T(`${tn(n.s1)}+${tn(n.s2)}=${tn(n.sum)}`)}.`, run: async (c) => { await c.pop(show(E[2])); await c.pop(show(E[3])); } },
      { cap: `<b>Step 4.</b> That is ${T('c^2')}, not ${T('c')}. Take the square root: ${T(rootT)}.`, run: (c) => c.pop(show(E[4]), 450) },
      { cap: `<b>Step 5.</b> Check: ${T('c')} must be longer than ${nf(n.L)} but shorter than ${T(`${nf(n.l1)}+${nf(n.l2)}=${nf(n.S)}`)}. ${n.cr} is in between ✓`, run: async (c) => { show(NL); await c.fadeIn(NL, 450); show(dotG); await c.anim(dotG, [{ opacity: 0, transform: 'translateY(-70px)' }, { opacity: 1, transform: 'none' }], 600); await stampIn(c, show(st)); } }
    ];
  }
};

/* ======================================================================================
 * 3x. Two traps (Full)
 * ====================================================================================== */
const traps = {
  title: 'Two traps: adding the legs, and stopping at c²',
  height: 440,
  ask: 'Example 4(b): legs 7.5 cm and 4 cm. Why are 11.5 cm and 72.25 cm both wrong?',
  make(stage, v, ex) {
    const W = ex.W, H = 440, ox = (W - 960) / 2, svg = stageSvg(stage, W, H), k = 34, R = [ox + 90, 196], A = [R[0] + 7.5 * k, R[1]], B = [R[0], R[1] - 4 * k];
    const tri = hide(g(svg));
    path(tri, polyD([R, A, B]), { fill: '#f3efe6', width: 3.4, cls: '' });
    line(tri, R, A, { color: CA, width: 5, cls: '' }); line(tri, R, B, { color: CB, width: 5, cls: '' }); line(tri, A, B, { color: CC, width: 5, cls: '' });
    rmark(tri, R, A, B, 15);
    txt(tri, mid(R, A)[0], R[1] + 24, '7.5 cm', { color: CA }); txt(tri, R[0] - 44, mid(R, B)[1], '4 cm', { color: CB }); txt(tri, mid(A, B)[0] + 40, mid(A, B)[1] - 16, '8.5 cm', { color: CC });
    const by = [262, 314, 392], bx = R[0];
    const barA = svgEl('rect', { x: bx, y: by[0] - 12, width: 0, height: 24, rx: 5, fill: CA, 'fill-opacity': 0.8 }, svg), barB = svgEl('rect', { x: bx + 7.5 * k, y: by[0] - 12, width: 0, height: 24, rx: 5, fill: CB, 'fill-opacity': 0.8 }, svg);
    const barC = svgEl('rect', { x: bx, y: by[1] - 12, width: 0, height: 24, rx: 5, fill: CC, 'fill-opacity': 0.85 }, svg);
    const bar2 = svgEl('rect', { x: bx, y: by[2] - 12, width: 0, height: 24, rx: 5, fill: RED, 'fill-opacity': 0.75 }, svg);
    const tS = hide(txt(svg, bx + 11.5 * k + 70, by[0], '11.5 cm', { size: 21, color: INK })), tC = hide(txt(svg, bx + 8.5 * k + 62, by[1], '8.5 cm', { size: 21, color: CC }));
    const edge = W - 16, t2 = hide(txt(svg, edge - 150, by[2] - 30, '72.25 cm… off the screen!', { size: 20, color: RED }));
    const arrow = hide(path(svg, `M${edge - 22} ${by[2] - 14}L${edge} ${by[2]}L${edge - 22} ${by[2] + 14}`, { stroke: RED, width: 4, cls: '' }));
    const t3 = hide(txt(svg, bx + 8.5 * k + 120, by[2], '√72.25 = 8.5 cm', { size: 21, color: CC }));
    const s1 = hide(stamp(stage, 'too long ✗', { ok: false, x: ox + 800, y: by[0], size: 'sm' }));
    const s2 = hide(stamp(stage, '8.5 cm ✓', { ok: true, x: ox + 820, y: by[2] - 2, size: 'sm' }));
    const x0 = ox + 560;
    const e1 = hide(labL(stage, T('7.5+4=11.5'), x0, 60, 'u7l2-eq u7l2-red')), e2 = hide(labL(stage, T('c^2=72.25,\\ \\text{so } c=72.25\\,?'), x0, 120, 'u7l2-eq u7l2-red'));
    const e3 = hide(labL(stage, T('c=\\sqrt{72.25}=8.5'), x0, 180, 'u7l2-eq u7l2-eqk'));
    const grow = (c, el, w, ms) => tween(c, ms, (t) => el.setAttribute('width', (w * t).toFixed(1)));
    return [
      { cap: 'Legs 7.5 cm and 4 cm. The hypotenuse is really <b>8.5 cm</b>.', run: async (c) => { show(tri); await c.fadeIn(tri, 500); } },
      { cap: `<b>Trap 1:</b> adding the legs. Lay them end to end: ${T('7.5+4=11.5')} cm.`, run: async (c) => { await grow(c, barA, 7.5 * k, 600); await grow(c, barB, 4 * k, 400); show(tS); await c.pop(tS); await c.pop(show(e1)); } },
      { cap: 'The hypotenuse is the <b>straight</b> path. It is always shorter than going around the corner, so 11.5 cm is too long ✗', run: async (c) => { await grow(c, barC, 8.5 * k, 600); show(tC); await c.pop(tC); await stampIn(c, show(s1)); } },
      { cap: `<b>Trap 2:</b> stopping at ${T('c^2=72.25')}. A side 72.25 cm long would run right off the screen!`, run: async (c) => { await c.pop(show(e2)); await grow(c, bar2, edge - 26 - bx, 1300); show(arrow); show(t2); await c.pop(t2); } },
      { cap: `That is far longer than the whole triangle ✗. Take the square root: ${T('\\sqrt{72.25}=8.5')} cm ✓`, run: async (c) => { op(c, t2, 0, 250); op(c, arrow, 0, 250); await tween(c, 900, (t) => bar2.setAttribute('width', lerp(edge - 26 - bx, 8.5 * k, t).toFixed(1))); bar2.setAttribute('fill', CC); show(t3); await c.pop(t3); await c.pop(show(e3)); await stampIn(c, show(s2)); } }
    ];
  }
};

/* ======================================================================================
 * 4. The hinge: only the right angle works (Example 5)
 * ====================================================================================== */
const HINGE = { 60: { c: 3.6, c2: 12.96 }, 90: { c: 5.0, c2: 25 }, 120: { c: 6.1, c2: 37.21 } };
/** a water level in a square on side P0P1 (px): fraction lev of the way out from the side */
function waterPoly(Q4, lev) { const [P0, P1, P2, P3] = Q4; return [P0, P1, lerpP(P1, P2, lev), lerpP(P0, P3, lev)]; }
const hinge = {
  title: 'Open the hinge: does 3² + 4² = c²?',
  height: 480,
  choices: [{ sep: 'Example 5 check:' }, { v: 60, label: '60°' }, { v: 90, label: '90°' }, { v: 120, label: '120°' }],
  value: 60,
  ask: (v) => `Example 5: two sticks, 3 cm and 4 cm, are joined by a hinge opened to ${v}°. Measure ${T('c')}. Is ${T('3^2+4^2=c^2')}?`,
  make(stage, v, ex) {
    const th = +v, d = HINGE[th], W = ex.W, H = 480, ox = (W - 960) / 2, svg = stageSvg(stage, W, H);
    const Vm = [0, 0], Pm = [3, 0], Qm = (t) => [4 * Math.cos(t * RAD), 4 * Math.sin(t * RAD)];
    const sqP = sqOn(Vm, Pm, Qm(th)), sqQ = sqOn(Vm, Qm(th), Pm), sqC = sqOn(Pm, Qm(th), Vm);
    const F = fitter([Vm, Pm, Qm(th), ...sqP, ...sqQ, ...sqC, Qm(30)], 580, H, 22, 52, ox, 0), Fp = (pts) => pts.map(F);
    const sqL = g(svg), wL = g(svg), triL = g(svg);
    const V = F(Vm), P = F(Pm);
    const sq = [[sqP, CA, '9'], [sqQ, CB, '16'], [sqC, CC, `c² = ${nf(d.c2)}`]].map(([Q4, col]) => hide(path(sqL, polyD(Fp(Q4)), { stroke: col, width: 3, fill: col, fo: 0.06, cls: '' })));
    const wA = path(wL, '', { stroke: 'none', fill: WATER, fo: 0.7, cls: '' }), wB = path(wL, '', { stroke: 'none', fill: WATER, fo: 0.7, cls: '' }), wC = path(wL, '', { stroke: 'none', fill: WATER, fo: 0.7, cls: '' });
    const setW = (la, lc) => { wA.setAttribute('d', la > 0.002 ? polyD(waterPoly(Fp(sqP), la)) : ''); wB.setAttribute('d', la > 0.002 ? polyD(waterPoly(Fp(sqQ), la)) : ''); wC.setAttribute('d', lc > 0.002 ? polyD(waterPoly(Fp(sqC), lc)) : ''); };
    const sqLab = [[sqP, CA, '9'], [sqQ, CB, '16'], [sqC, CC, `c² = ${nf(d.c2)}`]].map(([Q4, col, s]) => hide(popable(txt(triL, ...F(cen(Q4)), s, { size: 21, color: col, halo: 5 }))));
    const s3 = line(triL, V, P, { color: CA, width: 7, cls: '' }), s4 = line(triL, V, F(Qm(th)), { color: CB, width: 7, cls: '' });
    const cl = hide(line(triL, P, F(Qm(th)), { width: 3, dash: '9 7' }));
    const hingeDot = svgEl('circle', { cx: V[0], cy: V[1], r: 8, fill: '#fff', stroke: INK, 'stroke-width': 3 }, triL);
    const lab3 = txt(triL, ...mid(V, P).map((z, i) => z + (i ? 22 : 0)), '3 cm', { size: 19, color: CA });
    const placeQ = (t) => { const Q = F(Qm(t)); s4.setAttribute('x2', Q[0].toFixed(1)); s4.setAttribute('y2', Q[1].toFixed(1)); };
    const angG = g(triL);
    const drawAng = (t) => {
      angG.innerHTML = '';
      if (Math.abs(t - 90) < 0.01) rmark(angG, V, P, F(Qm(90)), 18, { cls: '' });
      else { const r = 34, A0 = [V[0] + r, V[1]], A1 = [V[0] + r * Math.cos(t * RAD), V[1] - r * Math.sin(t * RAD)]; path(angG, `M${A0[0]} ${A0[1]}A${r} ${r} 0 0 0 ${A1[0].toFixed(1)} ${A1[1].toFixed(1)}`, { width: 2.4, cls: '' }); }
      const L = [V[0] + 58 * Math.cos(t / 2 * RAD), V[1] - 58 * Math.sin(t / 2 * RAD)]; txt(angG, L[0], L[1], `${Math.round(t)}°`, { size: 18, color: AMBER });
    };
    const Qf = F(Qm(th)), lab4P = mid(V, Qf), n4 = [-(Qf[1] - V[1]), Qf[0] - V[0]], n4L = Math.hypot(...n4);
    const side4 = (P[0] - lab4P[0]) * n4[0] + (P[1] - lab4P[1]) * n4[1] > 0 ? -1 : 1;
    const lab4 = hide(txt(triL, lab4P[0] + side4 * n4[0] / n4L * 26, lab4P[1] + side4 * n4[1] / n4L * 26, '4 cm', { size: 19, color: CB }));
    const cM = mid(P, Qf), nc = [cM[0] - V[0], cM[1] - V[1]], ncL = Math.hypot(...nc);
    const labC = hide(popable(txt(triL, cM[0] + nc[0] / ncL * 14 + (nc[0] >= 0 ? 10 : -10), cM[1] + nc[1] / ncL * 14, `c = ${d.c.toFixed(1)} cm`, { size: 19, anchor: nc[0] >= 0 ? 'start' : 'end' })));
    const t0 = th === 60 ? 25 : th === 90 ? 40 : 60;
    placeQ(t0); drawAng(t0); hingeDot.parentNode.appendChild(hingeDot);
    const x0 = ox + 610, res = d.c2 < 25 ? 'less' : d.c2 > 25 ? 'more' : 'same';
    const E = [`c=${d.c.toFixed(1)}\\text{ cm}`, `c^2=${d.c.toFixed(1)}^2=${nf(d.c2)}`, '3^2+4^2=9+16=25', res === 'less' ? `${nf(d.c2)}<25` : res === 'more' ? `${nf(d.c2)}>25` : `${nf(d.c2)}=25`]
      .map((e, i) => hide(labL(stage, T(e), x0, 60 + i * 62, 'u7l2-eq' + (i === 3 ? (res === 'same' ? ' u7l2-eqk' : ' u7l2-red') : ''))));
    const sTxt = res === 'same' ? 'fits exactly ✓' : res === 'less' ? `${nf(25 - d.c2)} left over ✗` : `a gap of ${nf(d.c2 - 25)} ✗`;
    const st = hide(stamp(stage, sTxt, { ok: res === 'same', x: ox + 770, y: 340 }));
    const moved = Math.min(25, d.c2);
    const verdict = res === 'same' ? `It fits <b>exactly</b>: ${T('c^2=25=3^2+4^2')} ✓ Only the right angle works.`
      : res === 'less' ? `<b>Too much!</b> The square on ${T('c')} only holds ${nf(d.c2)}, so ${nf(25 - d.c2)} is left over. ${T('c^2')} is <b>smaller</b> than ${T('a^2+b^2')} ✗`
        : `<b>Not enough!</b> The 25 only fills part of ${nf(d.c2)}: a gap of ${nf(d.c2 - 25)} is left. ${T('c^2')} is <b>bigger</b> than ${T('a^2+b^2')} ✗`;
    return [
      { cap: `Open the hinge to <b>${th}°</b>.`, run: async (c) => { await tween(c, 1000, (t) => { const a = lerp(t0, th, t); placeQ(a); drawAng(a); }); show(lab4); await c.pop(lab4, 300); } },
      { cap: `Measure the distance between the free ends: ${T(`c=${d.c.toFixed(1)}`)} cm.`, run: async (c) => { show(cl); await drawIn(cl, 600, c); show(labC); await c.pop(labC); await c.pop(show(E[0])); } },
      { cap: `Build a square on each side. The sticks give ${T('3^2+4^2=9+16=25')}. The square on ${T('c')} is ${T(`${d.c.toFixed(1)}^2=${nf(d.c2)}`)}.`, run: async (c) => { op(c, labC, 0, 250); op(c, lab3, 0, 250); op(c, lab4, 0, 250); sq.forEach(show); setW(1, 0); await c.fadeIn(sqL, 400); await c.fadeIn(wL, 400); for (const L of sqLab) { show(L); await c.pop(L, 300); } await c.pop(show(E[1])); await c.pop(show(E[2])); } },
      { cap: `Pour the 25 from the two small squares into the square on ${T('c')}…`, run: async (c) => { op(c, sqLab[0], 0, 250); op(c, sqLab[1], 0, 250); await tween(c, 2200, (t) => { const x = moved * t; setW(1 - x / 25, x / d.c2); }); } },
      { cap: verdict, run: async (c) => { await c.pop(show(E[3])); await stampIn(c, show(st)); } }
    ];
  }
};

/* ======================================================================================
 * 5. Problems: TV, park, stairs (Examples 6–8)
 * ====================================================================================== */
const problems = {
  title: 'Find the right triangle, then solve',
  height: 480,
  choices: [{ sep: 'Check:' }, { v: 'tv', label: 'Example 6: the TV' }, { v: 'park', label: 'Example 7: the park' }, { v: 'stairs', label: 'Example 8: the stairs' }],
  value: 'tv',
  ask: (v) => ({ tv: 'Example 6: Amira’s TV screen is 48.0 in wide and 27.0 in high. Find the diagonal. Is it a 55-inch TV?', park: 'Example 7: a park in Airdrie is 140 m by 90 m. How much shorter is the walk straight across than along two edges?', stairs: 'Example 8: deck stairs rise 5 ft 3 in and run 7 ft. How long is the stringer? Which board, 8, 10 or 12 ft?' }[v]),
  make(stage, v, ex) {
    const W = ex.W, H = 480, ox = (W - 960) / 2, svg = stageSvg(stage, W, H), x0 = ox + 520, eqY = (i) => 40 + i * 56;
    const EQ = (list) => list.map((e, i) => hide(labL(stage, T(e), x0, eqY(i), 'u7l2-eq' + (i === list.length - 1 ? ' u7l2-eqk' : ''))));
    if (v === 'tv') {
      const k = 8, A = [ox + 50, 300], Bx = A[0] + 48 * k, By = A[1] - 27 * k, BR = [Bx, A[1]], TR = [Bx, By];
      path(svg, polyD([[A[0] - 12, By - 12], [Bx + 12, By - 12], [Bx + 12, A[1] + 12], [A[0] - 12, A[1] + 12]]), { fill: '#2b2f38', stroke: '#1c2230', width: 3, cls: '' });
      path(svg, polyD([A, BR, TR, [A[0], By]]), { fill: '#3d5a80', fo: 0.5, stroke: '#9fb6d4', width: 2, cls: '' });
      path(svg, polyD([[mid(A, BR)[0] - 30, A[1] + 12], [mid(A, BR)[0] + 30, A[1] + 12], [mid(A, BR)[0] + 60, A[1] + 44], [mid(A, BR)[0] - 60, A[1] + 44]]), { fill: '#4a4f5a', stroke: '#1c2230', width: 2.5, cls: '' });
      const rm = hide(rmark(svg, BR, A, TR, 20, { color: '#ffd166', width: 3.5 }));
      const diag = hide(line(svg, A, TR, { color: '#ffd166', width: 5, dash: '12 8' }));
      const lw = hide(txt(svg, mid(A, BR)[0], A[1] + 66, '48.0 in', { size: 21 })), lh = hide(txt(svg, Bx + 54, mid(BR, TR)[1], '27.0 in', { size: 21 }));
      const lc = hide(popable(txt(svg, mid(A, TR)[0] - 30, mid(A, TR)[1] - 22, 'c', { size: 26, color: '#ffd166', halo: false })));
      const E = EQ(['48^2+27^2=c^2', '2\\,304+729=3\\,033=c^2', 'c=\\sqrt{3\\,033}=55.07\\ldots\\approx55\\text{ in}']);
      const st = hide(stamp(stage, '55-inch TV ✓', { ok: true, x: ox + 740, y: 290 }));
      return [
        { cap: 'Sketch it: the screen is a rectangle, so its corner is a <b>right angle</b>.', run: async (c) => { show(rm); await drawIn(rm, 500, c); await pulse(c, rm, 1.3, 500); } },
        { cap: 'The diagonal is the <b>hypotenuse</b>. The legs are 48.0 in and 27.0 in.', run: async (c) => { show(diag); await drawIn(diag, 800, c); show(lw); show(lh); await c.pop(lw); await c.pop(lh); show(lc); await c.pop(lc); } },
        { cap: `Square and add: ${T('48^2+27^2=2\\,304+729=3\\,033')}.`, run: async (c) => { await c.pop(show(E[0])); await c.pop(show(E[1])); } },
        { cap: `Take the square root: ${T('c=\\sqrt{3\\,033}=55.07\\ldots\\approx55')} in.`, run: async (c) => { await c.pop(show(E[2])); lc.textContent = '55 in'; await c.pop(lc); } },
        { cap: 'Check: 55 is longer than 48 and shorter than 48 + 27 = 75 ✓ Yes, the box is right: it is a 55-inch TV.', run: (c) => stampIn(c, show(st)) }
      ];
    }
    if (v === 'park') {
      const k = 2.6, A = [ox + 40, 360], BR = [A[0] + 140 * k, A[1]], TR = [BR[0], A[1] - 90 * k], TL = [A[0], TR[1]];
      path(svg, polyD([A, BR, TR, TL]), { fill: '#cfe8c4', stroke: '#3f7a35', width: 3.5, cls: '' });
      [[0.25, 0.3], [0.7, 0.75], [0.55, 0.2], [0.18, 0.78]].forEach(([fx, fy]) => { const p = [lerp(A[0], BR[0], fx), lerp(A[1], TR[1], fy)]; svgEl('circle', { cx: p[0], cy: p[1], r: 13, fill: '#7fb069', stroke: '#3f7a35', 'stroke-width': 2 }, svg); });
      txt(svg, mid(A, BR)[0], A[1] + 26, '140 m', { size: 21 }); txt(svg, BR[0] + 40, mid(BR, TR)[1], '90 m', { size: 21 });
      txt(svg, A[0] - 4, A[1] + 26, 'start', { size: 16, color: MUTED }); txt(svg, TR[0] + 10, TR[1] - 18, 'end', { size: 16, color: MUTED });
      const pathE = hide(path(svg, polyD([A, BR, TR], false), { stroke: AMBER, width: 6, cls: '' }));
      const diag = hide(line(svg, A, TR, { color: RED, width: 5, dash: '12 8' })), rm = hide(rmark(svg, BR, A, TR, 18, { width: 3 }));
      const noah = svgEl('circle', { cx: A[0], cy: A[1], r: 11, fill: BLUE, stroke: '#fff', 'stroke-width': 3 }, svg);
      const cnt = hide(lab(stage, '0 m', A[0] + 40, A[1] - 34, 'u7l2-cnt'));
      const setN = (p, m) => { noah.setAttribute('cx', p[0].toFixed(1)); noah.setAttribute('cy', p[1].toFixed(1)); cnt.style.left = p[0] + 'px'; cnt.style.top = (p[1] - 32) + 'px'; cnt.firstChild.textContent = m; };
      const E = EQ(['140+90=230\\text{ m}', '140^2+90^2=c^2', '19\\,600+8\\,100=27\\,700=c^2', 'c=\\sqrt{27\\,700}=166.43\\ldots\\approx166.4\\text{ m}', '230-166.43\\ldots=63.56\\ldots']);
      const st = hide(stamp(stage, 'about 63.6 m shorter ✓', { ok: true, x: ox + 720, y: 360 }));
      const dg = Math.hypot(140, 90);
      return [
        { cap: `Along the two edges, Noah walks ${T('140+90=230')} m.`, run: async (c) => { show(cnt); show(pathE); await drawIn(pathE, 200, c); await tween(c, 2200, (t) => { const m = 230 * t; setN(m <= 140 ? lerpP(A, BR, m / 140) : lerpP(BR, TR, (m - 140) / 90), pn(Math.round(m)) + ' m'); }, (x) => x); await c.pop(show(E[0])); } },
        { cap: 'The shortcut is the <b>diagonal</b>. The park’s corner is 90°, so the diagonal is the hypotenuse of a right triangle.', run: async (c) => { show(diag); await drawIn(diag, 800, c); show(rm); await drawIn(rm, 400, c); await pulse(c, rm, 1.3, 400); } },
        { cap: `Square and add: ${T('140^2+90^2=19\\,600+8\\,100=27\\,700')}.`, run: async (c) => { await c.pop(show(E[1])); await c.pop(show(E[2])); } },
        { cap: `Take the square root: ${T('c=\\sqrt{27\\,700}=166.43\\ldots\\approx166.4')} m. Now Noah cuts across.`, run: async (c) => { await c.pop(show(E[3])); op(c, pathE, 0.3, 300); setN(A, '0 m'); await tween(c, 1800, (t) => setN(lerpP(A, TR, t), (Math.round(dg * t * 10) / 10).toFixed(1) + ' m'), (x) => x); } },
        { cap: `${T('230-166.43\\ldots=63.56\\ldots')} The shortcut is about <b>63.6 m shorter</b>.`, run: async (c) => { await c.pop(show(E[4])); await stampIn(c, show(st)); } }
      ];
    }
    // stairs
    const k = 3.3, G = [ox + 60, 300], R = [G[0] + 84 * k, G[1]], Tp = [R[0], G[1] - 63 * k];
    line(svg, [G[0] - 30, G[1]], [R[0] + 40, G[1]], { width: 3, color: '#6b5b45', cls: '' });
    path(svg, polyD([[R[0], G[1]], [R[0] + 40, G[1]], [R[0] + 40, Tp[1] - 6], [R[0], Tp[1] - 6]]), { fill: '#d8c3a0', stroke: '#8a6a3c', width: 2, cls: '' });
    let dS = `M${G[0]} ${G[1]}`; for (let i = 0; i < 7; i++) { const x = G[0] + (i + 1) * 12 * k, y = G[1] - i * 9 * k; dS += `H${x.toFixed(1)}V${(y - 9 * k).toFixed(1)}`; }
    path(svg, dS, { stroke: '#8a6a3c', width: 2.5, cls: '' });
    const strG = line(svg, G, Tp, { color: '#8a5a1c', width: 9, cls: '' }), hlS = hide(line(svg, G, Tp, { color: '#f2c14e', width: 18, opacity: 0.45 }));
    rmark(svg, R, G, Tp, 16);
    const lRun = txt(svg, mid(G, R)[0], G[1] + 26, '7 ft', { size: 21 }), lRise = txt(svg, R[0] + 92, mid(R, Tp)[1], '5 ft 3 in', { size: 21 });
    const lStr = popable(txt(svg, mid(G, Tp)[0] - 50, mid(G, Tp)[1] - 30, 'stringer', { size: 20, color: '#8a5a1c' }));
    strG.parentNode.appendChild(strG);
    const E = EQ(['5\\times12+3=63\\text{ in},\\ \\ 7\\times12=84\\text{ in}', '63^2+84^2=3\\,969+7\\,056', '=11\\,025=c^2', 'c=\\sqrt{11\\,025}=105\\text{ in}', '105\\div12=8\\text{ R }9:\\ 8\\text{ ft }9\\text{ in}']);
    const bG = hide(g(svg)), bk = 2.7, bx = ox + 60, need = 105 * bk;
    [[8, RED, '8 ft ✗ too short'], [10, GREEN, '10 ft ✓'], [12, GREY, '12 ft (more than needed)']].forEach(([ft, col, s], i) => {
      const y = 384 + i * 30; svgEl('rect', { x: bx, y: y - 10, width: ft * 12 * bk, height: 20, rx: 4, fill: col, 'fill-opacity': 0.75 }, bG); txt(bG, bx + 144 * bk + 16, y, s, { size: 17, color: col === GREY ? MUTED : col, anchor: 'start' });
    });
    line(bG, [bx + need, 362], [bx + need, 462], { color: '#8a5a1c', width: 3, dash: '6 5', cls: '' }); txt(bG, bx + need, 352, '8 ft 9 in', { size: 16, color: '#8a5a1c' });
    return [
      { cap: `One unit first: inches. Rise: ${T('5\\times12+3=63')} in. Run: ${T('7\\times12=84')} in.`, run: async (c) => { await c.pop(show(E[0])); lRun.textContent = '84 in'; lRise.textContent = '63 in'; await c.pop(popable(lRun)); await c.pop(popable(lRise)); } },
      { cap: `The stringer is the hypotenuse. Square and add: ${T('63^2+84^2=3\\,969+7\\,056=11\\,025')}.`, run: async (c) => { show(hlS); await drawIn(hlS, 600, c); await c.pop(show(E[1])); await c.pop(show(E[2])); } },
      { cap: `Take the square root: ${T('c=\\sqrt{11\\,025}=105')} in.`, run: async (c) => { await c.pop(show(E[3])); lStr.textContent = '105 in'; await c.pop(lStr); } },
      { cap: `Change back to feet: ${T('105\\div12=8')} remainder 9. The stringer is <b>8 ft 9 in</b>.`, run: async (c) => { await c.pop(show(E[4])); lStr.textContent = '8 ft 9 in'; await c.pop(lStr); } },
      { cap: 'Boards: 8 ft is too short. Kenji should buy the <b>10 ft</b> board ✓', run: async (c) => { show(bG); await c.fadeIn(bG, 500); } }
    ];
  }
};

/* ======================================================================================
 * 5b. Feet and inches on a tape (Example 8)
 * ====================================================================================== */
const FTIN = { d: { ft: 4, inch: 7 }, rise: { ft: 5, inch: 3 }, run: { ft: 7, inch: 0 }, back: { total: 105 } };
const ftin = {
  title: 'Feet and inches: change to one unit',
  height: 330,
  choices: [{ v: 'd', label: '4 ft 7 in' }, { sep: 'Example 8 check:' }, { v: 'rise', label: 'rise 5 ft 3 in' }, { v: 'run', label: 'run 7 ft' }, { v: 'back', label: '105 in → ft and in' }],
  ask: (v) => (v === 'back' ? 'Example 8: the stringer is 105 in. Write it in feet and inches.' : v === 'd' ? 'A shelf is 4 ft 7 in long. How many inches is that?' : `Example 8: the stairs ${v === 'rise' ? 'rise 5 ft 3 in' : 'run 7 ft'}. Change it to inches.`),
  make(stage, v, ex) {
    const W = ex.W, H = 330, ox = (W - 960) / 2, svg = stageSvg(stage, W, H), k = 8.4, x0 = ox + 40, y = 150, bh = 56;
    const block = (x, w, fill, s) => { const gg = hide(popable(g(svg))); svgEl('rect', { x: x.toFixed(1), y: y - bh / 2, width: w.toFixed(1), height: bh, fill, stroke: '#8a6a3c', 'stroke-width': 2 }, gg); if (s) txt(gg, x + w / 2, y, s, { size: 18, color: '#4a2c14', halo: false }); return gg; };
    if (v !== 'back') {
      const { ft, inch } = FTIN[v], tot = ft * 12 + inch;
      const bl = []; for (let i = 0; i < ft; i++) bl.push(block(x0 + i * 12 * k, 12 * k, i % 2 ? '#f6e3bd' : '#efd29a', '12 in'));
      const part = inch ? block(x0 + ft * 12 * k, inch * k, '#bfe0f5', `${inch}`) : null;
      const brace = hide(path(svg, `M${x0} ${y - bh / 2 - 10}V${y - bh / 2 - 22}H${x0 + ft * 12 * k}V${y - bh / 2 - 10}`, { stroke: AMBER, width: 3, cls: '' }));
      const lF = hide(lab(stage, T(`${ft}\\times12=${ft * 12}\\text{ in}`), x0 + ft * 6 * k, y - bh / 2 - 48, 'u7l2-eq'));
      const lI = inch ? hide(lab(stage, T(`+\\,${inch}\\text{ in}`), x0 + ft * 12 * k + inch * k / 2 + 30, y - bh / 2 - 48, 'u7l2-eq u7l2-cb')) : null;
      const lT = hide(lab(stage, `${ft} ft${inch ? ` ${inch} in` : ''} = <b>${tot} in</b>`, ox + 480, y + 100, 'u7l2-eq u7l2-eqk'));
      const nm = { d: 'the shelf', rise: 'the rise', run: 'the run' }[v];
      return [
        { cap: inch ? `${ft} ft ${inch} in is <b>${ft} whole feet</b> and <b>${inch} more inches</b>.` : `${ft} ft is <b>${ft} whole feet</b>, with no extra inches.`, run: async (c) => { for (const b of bl) { show(b); await c.pop(b, 220); } if (part) { show(part); await c.pop(part, 300); } } },
        { cap: `Each foot is 12 inches: ${T(`${ft}\\times12=${ft * 12}`)} in.`, run: async (c) => { show(brace); await drawIn(brace, 500, c); await c.pop(show(lF)); } },
        { cap: inch ? `Add the extra inches: ${T(`${ft * 12}+${inch}=${tot}`)}. So ${nm} is <b>${tot} in</b>.` : `So ${nm} is <b>${tot} in</b>.`, run: async (c) => { if (lI) await c.pop(show(lI)); await c.pop(show(lT)); } }
      ];
    }
    const tot = 105, ft = Math.floor(tot / 12), rem = tot % 12;
    const bar = svgEl('rect', { x: x0, y: y - bh / 2, width: 0, height: bh, fill: '#efd29a', stroke: '#8a6a3c', 'stroke-width': 2 }, svg);
    const tl = hide(txt(svg, x0 + tot * k / 2, y + bh / 2 + 22, '105 in', { size: 20 }));
    const cuts = []; for (let i = 1; i <= ft; i++) { const gg = hide(popable(g(svg))); line(gg, [x0 + i * 12 * k, y - bh / 2 - 8], [x0 + i * 12 * k, y + bh / 2 + 8], { color: RED, width: 3, cls: '' }); txt(gg, x0 + (i - 0.5) * 12 * k, y, String(i), { size: 20, color: '#4a2c14', halo: false }); cuts.push(gg); }
    const remR = hide(svgEl('rect', { x: x0 + ft * 12 * k, y: y - bh / 2, width: rem * k, height: bh, fill: '#bfe0f5', stroke: BLUE, 'stroke-width': 2.5 }, svg));
    const remT = hide(txt(svg, x0 + ft * 12 * k + rem * k / 2, y - bh / 2 - 18, `${rem} in left`, { size: 18, color: BLUE }));
    const lT = hide(lab(stage, `105 in = <b>${ft} ft ${rem} in</b>`, ox + 300, y + 112, 'u7l2-eq u7l2-eqk'));
    const lC = hide(lab(stage, T('105\\div12=8.75;\\ \\ 0.75\\times12=9'), ox + 700, y + 112, 'u7l2-eq'));
    return [
      { cap: 'The stringer is one long board: <b>105 inches</b>.', run: async (c) => { await tween(c, 900, (t) => bar.setAttribute('width', (tot * k * t).toFixed(1))); show(tl); await c.pop(tl); } },
      { cap: `Cut it into feet, 12 inches each. Count the whole feet: <b>${ft}</b>.`, run: async (c) => { for (const q of cuts) { show(q); await c.pop(q, 200); } } },
      { cap: `${rem} inches are left over: ${T(`105\\div12=${ft}`)} remainder ${rem}. So 105 in = <b>${ft} ft ${rem} in</b>.`, run: async (c) => { show(remR); await c.pop(remR, 350); show(remT); await c.pop(remT); await c.pop(show(lT)); } },
      { cap: `On the calculator, ${T('105\\div12=8.75')}. The 8 is the feet, and ${T('0.75\\times12=9')} inches.`, run: (c) => c.pop(show(lC)) }
    ];
  }
};

mountExplainers({ box, pour, proof, names, hyp, traps, hinge, problems, ftin });

/* ======================================================================================
 * Hands-on hinge (Section 4)
 * ====================================================================================== */
(function hingeTool() {
  const host = document.getElementById('u7l2-hingetool'); if (!host) return;
  const W = 520, H = 330, k = 56, V = [250, 290];
  const wrap = h('div', 'u7l2-ht'); host.appendChild(wrap);
  const svg = svgEl('svg', { class: 'u7l2-svg', width: W, height: H, viewBox: `0 0 ${W} ${H}` }, wrap);
  const panel = h('div', 'u7l2-htp'); wrap.appendChild(panel);
  const P = [V[0] + 3 * k, V[1]];
  const cLine = line(svg, P, P, { width: 3, dash: '9 7', cls: '' });
  line(svg, V, P, { color: CA, width: 8, cls: '' });
  const s4 = line(svg, V, V, { color: CB, width: 8, cls: '' });
  const angG = g(svg);
  svgEl('circle', { cx: V[0], cy: V[1], r: 9, fill: '#fff', stroke: INK, 'stroke-width': 3 }, svg);
  txt(svg, V[0] + 1.5 * k, V[1] + 24, '3 cm', { size: 18, color: CA });
  const l4 = txt(svg, 0, 0, '4 cm', { size: 18, color: CB }), lc = txt(svg, 0, 0, '', { size: 18 });
  const knob = svgEl('circle', { r: 17, fill: CB, 'fill-opacity': 0.25, stroke: CB, 'stroke-width': 3, class: 'geo-drag', 'data-tap': '' }, svg);
  panel.innerHTML = `<div class="u7l2-htr"><span>angle</span><b data-k="ang"></b></div>
    <div class="u7l2-htr"><span>${T('c')}</span><b data-k="c"></b></div>
    <div class="u7l2-htr"><span>${T('c^2')}</span><b data-k="c2"></b></div>
    <div class="u7l2-htr"><span>${T('3^2+4^2')}</span><b>25</b></div>
    <div class="u7l2-hbars"><div><i data-k="bc"></i><em>${T('c^2')}</em></div><div><i data-k="b25"></i><em>25</em></div></div>
    <div class="u7l2-htv" data-k="ver"></div>
    <div class="u7l2-htb"><button class="pill small" type="button" data-a="60">60°</button><button class="pill small" type="button" data-a="90">90°</button><button class="pill small" type="button" data-a="120">120°</button></div>`;
  const q = (s) => panel.querySelector(`[data-k="${s}"]`);
  let th = 60;
  function render() {
    const Q = [V[0] + 4 * k * Math.cos(th * RAD), V[1] - 4 * k * Math.sin(th * RAD)];
    s4.setAttribute('x2', Q[0].toFixed(1)); s4.setAttribute('y2', Q[1].toFixed(1));
    cLine.setAttribute('x2', Q[0].toFixed(1)); cLine.setAttribute('y2', Q[1].toFixed(1));
    knob.setAttribute('cx', Q[0].toFixed(1)); knob.setAttribute('cy', Q[1].toFixed(1));
    const M4 = mid(V, Q), n4 = [Math.cos((th + 90) * RAD), -Math.sin((th + 90) * RAD)];
    l4.setAttribute('x', (M4[0] + n4[0] * 28).toFixed(1)); l4.setAttribute('y', (M4[1] + n4[1] * 28).toFixed(1));
    const cv = Math.sqrt(25 - 24 * Math.cos(th * RAD)), cm = Math.round(cv * 100) / 100, c2 = Math.round(cm * cm * 100) / 100;
    const Mc = mid(P, Q), dc = [Mc[0] - V[0], Mc[1] - V[1]], L = Math.hypot(...dc);
    lc.setAttribute('x', (Mc[0] + dc[0] / L * 70).toFixed(1)); lc.setAttribute('y', (Mc[1] + dc[1] / L * 30).toFixed(1)); lc.textContent = `c = ${cm.toFixed(2)} cm`;
    angG.innerHTML = '';
    if (th === 90) rmark(angG, V, P, Q, 20, { cls: '' });
    else { const r = 36, A1 = [V[0] + r * Math.cos(th * RAD), V[1] - r * Math.sin(th * RAD)]; path(angG, `M${V[0] + r} ${V[1]}A${r} ${r} 0 0 0 ${A1[0].toFixed(1)} ${A1[1].toFixed(1)}`, { width: 2.4, cls: '' }); }
    const Lp = [V[0] + 62 * Math.cos(th / 2 * RAD), V[1] - 62 * Math.sin(th / 2 * RAD)]; txt(angG, Lp[0], Lp[1], `${th}°`, { size: 18, color: AMBER });
    q('ang').textContent = `${th}°`; q('c').textContent = `${cm.toFixed(2)} cm`; q('c2').textContent = `${cm.toFixed(2)}² = ${c2.toFixed(2)}`;
    q('bc').style.width = (c2 * 5.4).toFixed(1) + 'px'; q('b25').style.width = (25 * 5.4) + 'px';
    const ver = q('ver');
    if (th === 90) { ver.innerHTML = `${T('c^2=3^2+4^2')} &nbsp;Equal: a <b>right angle</b> ✓`; ver.className = 'u7l2-htv u7l2-ok'; q('bc').style.background = GREEN; }
    else if (c2 < 25) { ver.innerHTML = `${T('c^2<3^2+4^2')} &nbsp;(the angle is less than 90°)`; ver.className = 'u7l2-htv u7l2-no'; q('bc').style.background = RED; }
    else { ver.innerHTML = `${T('c^2>3^2+4^2')} &nbsp;(the angle is more than 90°)`; ver.className = 'u7l2-htv u7l2-no'; q('bc').style.background = RED; }
  }
  let drag = false;
  const setFrom = (e) => { const p = Geo.svgPoint(svg, e); let a = Math.atan2(V[1] - p[1], p[0] - V[0]) / RAD; if (a < 0) a = a < -90 ? 180 : 0; a = Math.max(15, Math.min(165, a)); if (Math.abs(a - 90) < 2) a = 90; th = Math.round(a); render(); };
  knob.addEventListener('pointerdown', (e) => { drag = true; knob.setPointerCapture(e.pointerId); e.preventDefault(); e.stopPropagation(); });
  knob.addEventListener('pointermove', (e) => { if (drag) { setFrom(e); e.preventDefault(); } });
  const end = () => { drag = false; };
  knob.addEventListener('pointerup', end); knob.addEventListener('pointercancel', end);
  panel.querySelectorAll('[data-a]').forEach((b) => b.addEventListener('click', () => { const from = th, to = +b.dataset.a; tween(liveCtx(), 700, (t) => { th = Math.round(lerp(from, to, t)); render(); }); }));
  render();
})();

/* ======================================================================================
 * Static figures on the cards
 * ====================================================================================== */
const FIG = {
  parts(host) {
    const s = figSvg(host, 330, 230), F = fitter([[0, 0], [4, 0], [0, 2.8]], 330, 230, 34, 70), C = F([0, 0]), A = F([4, 0]), B = F([0, 2.8]);
    path(s, polyD([C, A, B]), { fill: '#f3efe6', width: 3.4, cls: '' });
    line(s, C, A, { color: CB, width: 5, cls: '' }); line(s, C, B, { color: CA, width: 5, cls: '' }); line(s, A, B, { color: CC, width: 5, cls: '' });
    rmark(s, C, A, B, 18, { cls: '' });
    txt(s, mid(C, A)[0], C[1] + 22, 'leg', { size: 21, color: CB }); txt(s, C[0] - 30, mid(C, B)[1], 'leg', { size: 21, color: CA });
    const M = mid(A, B), d = [B[1] - A[1], A[0] - B[0]], L = Math.hypot(...d), sg = (M[0] - C[0]) * d[0] + (M[1] - C[1]) * d[1] > 0 ? 1 : -1;
    txt(s, M[0] + sg * d[0] / L * 30 + 22, M[1] + sg * d[1] / L * 30, 'hypotenuse', { size: 21, color: CC });
  },
  ex1(host) {
    const s = figSvg(host, 350, 370), a = 3, b = 4, Q = SQ(a, b), P = fitter([[-a, -b], [7, 7]], 350, 370, 14, 40), Pp = (pts) => pts.map(P);
    gridLines(s, P, -a, 7, -b, 7);
    path(s, polyD(Pp(Q.A)), { stroke: CA, fill: CA, fo: 0.14, width: 2.6, cls: '' });
    path(s, polyD(Pp(Q.B)), { stroke: CB, fill: CB, fo: 0.14, width: 2.6, cls: '' });
    path(s, polyD(Pp(Q.C)), { stroke: CC, fill: CC, fo: 0.14, width: 2.6, cls: '' });
    path(s, polyD(Pp(Q.tri)), { stroke: INK, fill: '#9aa0ab', fo: 0.6, width: 3.2, cls: '' });
    rmark(s, P([0, 0]), P([1, 0]), P([0, 1]), 12, { cls: '' });
    txt(s, ...P([-1.5, 1.5]), 'A', { size: 22, color: CA }); txt(s, ...P([2, -2]), 'B', { size: 22, color: CB }); txt(s, ...P([3.5, 3.5]), 'C', { size: 22, color: CC });
    const bx = g(s, 'u7l2-fa'); path(bx, polyD(Pp([[0, 0], [7, 0], [7, 7], [0, 7]])), { stroke: RED, width: 3, dash: '9 6', cls: '' });
  },
  key(host) {
    const s = figSvg(host, 280, 210); drawNamed(s, NAMES.abc, 280, 210, 0, 0, { pad: 34, size: 21 });
  },
  ex3a(host) { drawNamed(figSvg(host, 280, 200), NAMES.pqr, 280, 200, 0, 0, { pad: 32, size: 21 }); },
  ex3b(host) { drawNamed(figSvg(host, 280, 200), NAMES.xyz, 280, 200, 0, 0, { pad: 32, size: 21 }); },
  ex3c(host) { drawNamed(figSvg(host, 280, 200), NAMES.lad, 280, 200, 0, 0, { pad: 22, size: 19 }); }
};
['a', 'b', 'c'].forEach((k) => {
  FIG['ex4' + k] = (host) => { const cfg = HYPS[k]; Geo.rightTri(host, { width: 280, height: 210, a: cfg.a, b: cfg.b, right: cfg.right, names: false, sides: { a: `${cfg.a} ${cfg.unit}`, b: `${cfg.b} ${cfg.unit}`, c: 'c' }, size: 19, pad: 40 }); };
});
[['ex5a', 60], ['ex5b', 90], ['ex5c', 120]].forEach(([key, th]) => {
  FIG[key] = (host) => {
    const s = figSvg(host, 250, 190), Qm = [4 * Math.cos(th * RAD), 4 * Math.sin(th * RAD)], F = fitter([[0, 0], [3, 0], Qm, [-0.6, 0], [3.4, 0]], 250, 190, 26, 44), V = F([0, 0]), P = F([3, 0]), Q = F(Qm);
    line(s, V, P, { color: CA, width: 4, cls: '' }); line(s, V, Q, { color: CB, width: 4, cls: '' }); line(s, P, Q, { width: 2.6, dash: '7 6', cls: '' });
    if (th === 90) rmark(s, V, P, Q, 14, { cls: '' });
    else { const r = 26, A1 = [V[0] + r * Math.cos(th * RAD), V[1] - r * Math.sin(th * RAD)]; path(s, `M${V[0] + r} ${V[1]}A${r} ${r} 0 0 0 ${A1[0].toFixed(1)} ${A1[1].toFixed(1)}`, { width: 2, cls: '' }); const L = [V[0] + 46 * Math.cos(th / 2 * RAD), V[1] - 46 * Math.sin(th / 2 * RAD)]; txt(s, L[0], L[1], `${th}°`, { size: 16, color: AMBER }); }
    svgEl('circle', { cx: V[0], cy: V[1], r: 5, fill: '#fff', stroke: INK, 'stroke-width': 2.5 }, s);
    txt(s, mid(V, P)[0], V[1] + 18, '3 cm', { size: 16, color: CA });
    const M4 = mid(V, Q), n4 = [Math.cos((th + 90) * RAD), -Math.sin((th + 90) * RAD)]; txt(s, M4[0] + n4[0] * 26, M4[1] + n4[1] * 26, '4 cm', { size: 16, color: CB });
    const Mc = mid(P, Q), d = [Mc[0] - V[0], Mc[1] - V[1]], L = Math.hypot(...d); txt(s, Mc[0] + d[0] / L * 34, Mc[1] + d[1] / L * 16, `${HINGE[th].c.toFixed(1)} cm`, { size: 16 });
  };
});
FIG.ex6 = (host) => {
  const s = figSvg(host, 300, 220), k = 4.6, A = [14, 170], BR = [A[0] + 48 * k, A[1]], TR = [BR[0], A[1] - 27 * k];
  path(s, polyD([A, BR, TR, [A[0], TR[1]]]), { fill: '#e6eaf0', stroke: INK, width: 3.4, cls: '' });
  line(s, A, TR, { width: 2.6, dash: '8 6', cls: '' }); rmark(s, BR, A, TR, 14, { cls: '' });
  txt(s, mid(A, BR)[0], A[1] + 20, '48.0 in', { size: 17 }); txt(s, BR[0] + 8, mid(BR, TR)[1], '27.0 in', { size: 17, anchor: 'start' });
  txt(s, mid(A, TR)[0] - 14, mid(A, TR)[1] - 16, 'c', { size: 21, italic: true });
};
FIG.ex7 = (host) => {
  const s = figSvg(host, 300, 220), k = 1.8, A = [26, 186], BR = [A[0] + 140 * k, A[1]], TR = [BR[0], A[1] - 90 * k];
  path(s, polyD([A, BR, TR, [A[0], TR[1]]]), { fill: '#d9efd0', stroke: '#3f7a35', width: 3, cls: '' });
  line(s, A, TR, { width: 3, dash: '9 6', cls: '' }); rmark(s, BR, A, TR, 13, { cls: '' });
  svgEl('circle', { cx: A[0], cy: A[1], r: 5.5, fill: INK }, s); svgEl('circle', { cx: TR[0], cy: TR[1], r: 5.5, fill: INK }, s);
  txt(s, mid(A, BR)[0], A[1] + 20, '140 m', { size: 17 }); txt(s, BR[0] - 6, mid(BR, TR)[1], '90 m', { size: 17, anchor: 'end' });
  txt(s, A[0] + 4, A[1] - 16, 'start', { size: 14, color: MUTED, anchor: 'start' }); txt(s, TR[0] - 8, TR[1] + 18, 'end', { size: 14, color: MUTED, anchor: 'end' });
};
FIG.ex8 = (host) => {
  const s = figSvg(host, 300, 240), k = 2.3, G = [22, 200], R = [G[0] + 84 * k, G[1]], Tp = [R[0], G[1] - 63 * k];
  line(s, [G[0] - 10, G[1]], [R[0] + 14, G[1]], { width: 3, cls: '' }); line(s, R, Tp, { width: 3, cls: '' });
  let d = `M${G[0]} ${G[1]}`; for (let i = 0; i < 7; i++) { const x = G[0] + (i + 1) * 12 * k, y = G[1] - i * 9 * k; d += `H${x.toFixed(1)}V${(y - 9 * k).toFixed(1)}`; }
  path(s, d, { stroke: '#8a6a3c', width: 1.8, cls: '' });
  line(s, G, Tp, { color: '#8a5a1c', width: 6, cls: '' }); rmark(s, R, G, Tp, 13, { cls: '' });
  txt(s, mid(G, R)[0], G[1] + 20, '7 ft', { size: 17 }); txt(s, R[0] + 8, mid(R, Tp)[1], '5 ft 3 in', { size: 17, anchor: 'start' });
  txt(s, mid(G, Tp)[0] - 34, mid(G, Tp)[1] - 22, 'stringer', { size: 17, color: '#8a5a1c' });
};
document.querySelectorAll('.u7l2-fig[data-fig]').forEach((host) => { const f = FIG[host.dataset.fig]; if (f) f(host); });

/* =====================================================================================
 * Math History: Plimpton 322 (a Babylonian tablet of right-triangle numbers)
 * ===================================================================================== */
function histAnim() {
  const svg = document.getElementById('u7l2-hist'); if (!svg) return;
  const NS = 'http://www.w3.org/2000/svg', mk = (t, a, p = svg) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); p.appendChild(e); return e; };
  mk('rect', { x: 0, y: 0, width: 600, height: 300, rx: 14, fill: '#fffaf1' });
  const cap = mk('text', { x: 300, y: 28, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 19, fill: '#4a2c14' });
  // the tablet
  const tab = mk('g', {});
  mk('path', { d: 'M28 50 Q24 44 34 42 L262 46 Q272 48 270 58 L266 262 Q264 274 252 272 L40 270 Q28 268 30 256 Z', fill: '#c9a273', stroke: '#7a4a26', 'stroke-width': 3 }, tab);
  let seed = 7; const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const rows = [];
  for (let r = 0; r < 15; r++) {
    const y = 62 + r * 13.6, rg = mk('g', {}, tab); rows.push(rg);
    [[44, 4], [118, 3], [176, 3], [236, 1]].forEach(([x, n]) => { let xx = x; const m = n + Math.floor(rnd() * 3); for (let i = 0; i < m; i++) { const w = 6 + rnd() * 3; mk('path', { d: `M${xx.toFixed(1)} ${y - 4}L${(xx + w).toFixed(1)} ${y - 1.5}L${xx.toFixed(1)} ${y + 3}Z`, fill: '#6b4320' }, rg); xx += w + 3 + rnd() * 3; } });
  }
  const glow = mk('rect', { x: 34, y: 54, width: 232, height: 15, rx: 4, fill: '#b07a12', opacity: 0 }, tab);
  tab.insertBefore(glow, rows[0]);
  const hd = mk('text', { x: 150, y: 288, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 14, fill: '#4a2c14' }); hd.textContent = 'Plimpton 322, about 1800 BCE';
  const n1 = mk('text', { x: 300, y: 72, 'font-family': 'Georgia, serif', 'font-size': 17, fill: '#b07a12', opacity: 0 }); n1.textContent = 'width 119 · diagonal 169';
  // the triangle 119-120-169 (scaled)
  const s = 1.05, C = [330, 240], A = [C[0] + 120 * s * 1.75, C[1]], B = [C[0], C[1] - 119 * s];
  const triG = mk('g', { opacity: 0 });
  mk('path', { d: `M${C[0]} ${C[1]}L${A[0].toFixed(1)} ${A[1]}L${B[0]} ${B[1].toFixed(1)}Z`, fill: '#f6e7c8', stroke: '#7a4a26', 'stroke-width': 3, 'stroke-linejoin': 'round' }, triG);
  mk('path', { d: `M${C[0] + 14} ${C[1]}V${C[1] - 14}H${C[0]}`, fill: 'none', stroke: '#7a4a26', 'stroke-width': 2 }, triG);
  const tl = (x, y, s2, anchor = 'middle') => { const e = mk('text', { x, y, 'text-anchor': anchor, 'font-family': 'Georgia, serif', 'font-size': 17, fill: '#4a2c14' }, triG); e.textContent = s2; return e; };
  tl(C[0] - 8, (C[1] + B[1]) / 2, '119', 'end'); tl((C[0] + A[0]) / 2, C[1] + 20, '120'); tl((A[0] + B[0]) / 2 + 22, (A[1] + B[1]) / 2 - 10, '169');
  const eq = mk('text', { x: 440, y: 276, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 16, fill: '#b07a12', opacity: 0 }); eq.textContent = '119² + 120² = 28 561 = 169²';
  const CAPS = [[0, 'A clay tablet from Babylon'], [2.4, 'Row 1: two sides of a right triangle'], [5, 'The missing side is 120'], [8, 'They fit a² + b² = c²!']];
  const cl = (t) => Math.max(0, Math.min(1, t));
  const draw = (t) => {
    let c = CAPS[0][1]; for (const [t0, x] of CAPS) if (t >= t0) c = x; cap.textContent = c;
    rows.forEach((r, i) => r.setAttribute('opacity', cl((t - i * 0.1) / 0.4)));
    glow.setAttribute('opacity', 0.45 * cl((t - 2.4) / 0.5)); n1.setAttribute('opacity', cl((t - 2.8) / 0.6));
    triG.setAttribute('opacity', cl((t - 5) / 0.8)); eq.setAttribute('opacity', cl((t - 8) / 0.8));
  };
  let raf = 0;
  const play = () => {
    cancelAnimationFrame(raf);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { draw(12); return; }
    const t0 = performance.now(); const tick = (now) => { const s2 = (now - t0) / 1000; draw(s2); if (s2 < 10) raf = requestAnimationFrame(tick); }; raf = requestAnimationFrame(tick);
  };
  draw(12);
  svg.addEventListener('click', play);
  const btn = svg.closest('.hist-anim') && svg.closest('.hist-anim').querySelector('.hist-play'); if (btn) btn.addEventListener('click', play);
  let seen = false;
  new IntersectionObserver((es) => { es.forEach((e) => { if (e.isIntersecting && !seen) { seen = true; play(); } }); }, { threshold: 0.5 }).observe(svg);
}
histAnim();

/* =====================================================================================
 * Stand Up Break! — find the hypotenuse at the whiteboards
 * ===================================================================================== */
const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41], [12, 35, 37]];
const hypSteps = (a, b, u, dp = 1) => {
  const s1 = +(a * a).toFixed(4), s2 = +(b * b).toFixed(4), S = +(s1 + s2).toFixed(4), c = Math.sqrt(S), ex = Math.abs(c * 100 - Math.round(c * 100)) < 1e-7;
  const cr = ex ? nf(c, 2) : (Math.round(c * 10 ** dp) / 10 ** dp).toFixed(dp);
  return { c, cr, lines: [`${nf(a)}^2+${nf(b)}^2=c^2`, `${tn(s1)}+${tn(s2)}=${tn(S)}`, ex ? `c=\\sqrt{${tn(S)}}=${cr}\\text{ ${u}}` : `c=\\sqrt{${tn(S)}}\\approx${cr}\\text{ ${u}}`] };
};
standup('u7l2', {
  intro: 'Sketch the triangle, mark the right angle, and show every step. Then check: is the hypotenuse longer than each leg but shorter than the two legs added?',
  levels: {
    BEG: (r) => {
      const [p, q] = r.pick(TRIPLES), m = r.pick(q > 15 ? [1, 2] : [1, 2, 3, 4, 10]), u = r.pick(['cm', 'm', 'in']), [a, b] = r.shuffle([p * m, q * m]);
      const st = hypSteps(a, b, u);
      return { text: `A right triangle has legs of <b>${a} ${u}</b> and <b>${b} ${u}</b>. Find the hypotenuse.`, q: '', a: st.lines };
    },
    PRG: (r) => {
      let a, b; do { a = r.int(12, 150) / 10; b = r.int(12, 150) / 10; } while (Math.abs(a - b) < 1 || Number.isInteger(Math.sqrt(a * a + b * b) * 10));
      const u = r.pick(['cm', 'm']), st = hypSteps(a, b, u);
      return { text: `Find the hypotenuse of a right triangle with legs <b>${nf(a)} ${u}</b> and <b>${nf(b)} ${u}</b>, to the nearest tenth.`, q: '', a: st.lines };
    },
    MAS: (r) => r.pick([
      () => { const w = r.int(30, 80), hh = r.int(15, 45), st = hypSteps(w, hh, 'in', 0); return { text: `A computer monitor’s screen is <b>${w} in</b> wide and <b>${hh} in</b> high. How big is it (its diagonal), to the nearest inch?`, q: '', a: st.lines }; },
      () => { const ft1 = r.int(2, 5), in1 = r.int(1, 11), ft2 = r.int(6, 11), A1 = ft1 * 12 + in1, B1 = ft2 * 12, c = Math.round(Math.sqrt(A1 * A1 + B1 * B1)), F = Math.floor(c / 12), I = c % 12;
        return { text: `A ramp rises <b>${ft1} ft ${in1} in</b> over a run of <b>${ft2} ft</b>. How long is the ramp, to the nearest inch? Answer in feet and inches.`, q: '', a: [`${ft1}\\times12+${in1}=${A1}\\text{ in},\\ ${ft2}\\times12=${B1}\\text{ in}`, `${A1}^2+${B1}^2=${tn(A1 * A1)}+${tn(B1 * B1)}=${tn(A1 * A1 + B1 * B1)}`, `c=\\sqrt{${tn(A1 * A1 + B1 * B1)}}\\approx${c}\\text{ in}`, `${c}\\div12=${F}\\text{ R }${I}:\\ ${F}\\text{ ft }${I}\\text{ in}`] }; },
      () => { const n = r.int(4, 12) * 5, e = r.int(4, 12) * 5, t = r.pick([0.5, 1.5, 2]), N = n * t, E = e * t, st = hypSteps(N, E, 'km');
        return { text: `Two cyclists leave the same corner. One rides <b>north at ${n} km/h</b>, the other <b>east at ${e} km/h</b>. How far apart are they after <b>${t} h</b>, in a straight line?`, q: '', a: [`\\text{north } ${n}\\times${t}=${nf(N)}\\text{ km},\\ \\text{east } ${e}\\times${t}=${nf(E)}\\text{ km}`].concat(st.lines) }; }
    ])()
  }
});
