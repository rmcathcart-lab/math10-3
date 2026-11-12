/* Math 10-3 · Unit 7 · Lesson 3 — The Pythagorean Theorem: Finding a Leg, and Squaring a Corner.
 * Explainers (Class view unless marked Full): take a small square away from the big one (the tiles of c² move into b², the
 * rest fill a²), the six steps for a missing side (Examples 1 and 2 checks), the ladder against the wall with the 4-to-1 rule
 * and a sliding foot (Example 3 check), Amara's kite and her hand height (Example 4 check), two triangles that share a side
 * and keeping the full value (Example 5 check), the right-triangle tester (sticks sorted, a balance weighing a² + b²
 * against c², a verdict stamp and the real triangle; Examples 6 and 7 checks), the longest-side trap (Full), squaring a deck
 * corner with a tape measure (3-4-5; Example 8 check), why a bigger triangle is more accurate (Full), and a garden-bed frame
 * whose diagonals must be equal (Example 9 check). Also the static figures and the Stand Up Break. */
import { h, add, tex, svgEl, tween, anim, drawIn, stamp, stampIn, pulse, mountExplainers } from '../blocks.js';
import { Geo } from '../geo.js';
import { standup } from '../standup.js';

const INK = '#1c2230', BLUE = '#1f5bd6', GREEN = '#12805a', RED = '#c93a33', AMBER = '#c27a0e', BROWN = '#9a6a24', GREY = '#9aa0ab', SLATE = '#6a7182';
const WOOD = '#c99a5e', WOODD = '#7a5124', TAPE = '#f2c14e';
const SQA = BLUE, SQB = GREEN, SQC = BROWN;          // the missing leg's square, the known leg's square, the hypotenuse's square
const T = (s) => tex(String(s));
const RAD = Math.PI / 180;
/** TeX number with a thin thousands space: 1600 → 1\,600 */
const tn = (v) => { const [i, d] = String(v).split('.'); const ii = i.length > 3 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : i; return d ? ii + '.' + d : ii; };
/** plain-text number with a narrow no-break thousands space */
const pn = (v) => { const [i, d] = String(v).split('.'); const ii = i.length > 3 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : i; return d ? ii + '.' + d : ii; };
/** round to dp places and drop trailing zeros (for exact decimal arithmetic like 10.89 + 31.36) */
const rd = (v, dp = 4) => Number(v.toFixed(dp));
/** calculator style: 8.062… */
const dots = (v, dp = 3) => (Math.abs(v - Math.round(v)) < 1e-9 ? String(Math.round(v)) : (Math.floor(v * 10 ** dp) / 10 ** dp).toFixed(dp) + '\\ldots');
const dotsP = (v, dp = 3) => (Math.abs(v - Math.round(v)) < 1e-9 ? String(Math.round(v)) : (Math.floor(v * 10 ** dp) / 10 ** dp).toFixed(dp) + '…');
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const show = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 1; }); return els[0]; };
const op = (c, el, to, ms = 350) => anim(c, el, [{ opacity: to }], ms);
const stageSvg = (stage, W, H) => add(stage, svgEl('svg', { class: 'u7l3-svg', width: W, height: H, viewBox: `0 0 ${W} ${H}` }), 0, 0);
const figSvg = (host, W, H) => { host.style.width = W + 'px'; host.style.height = H + 'px'; return svgEl('svg', { class: 'geo-svg u7l3-svg', width: W, height: H, viewBox: `0 0 ${W} ${H}` }, host); };
const grp = (parent, cls) => svgEl('g', cls ? { class: cls } : {}, parent);
/** an HTML label centred on (x, y) in a 0×0 holder (so c.pop's scale doesn't undo the centring); cls 'u7l3-left' = left edge at x */
function lab(host, html, x, y, cls = '') {
  const hold = h('div', 'u7l3-hold'); hold.appendChild(h('div', 'u7l3-lab ' + cls, html)); add(host, hold, x, y); hold.inner = hold.firstChild; return hold;
}
const moveLab = (hold, x, y) => { hold.style.left = x + 'px'; hold.style.top = y + 'px'; };
function line(parent, P, Q, o = {}) {
  return svgEl('line', { x1: P[0].toFixed(2), y1: P[1].toFixed(2), x2: Q[0].toFixed(2), y2: Q[1].toFixed(2), stroke: o.color || INK, 'stroke-width': o.width || 3.2, 'stroke-linecap': o.cap || 'round', 'stroke-dasharray': o.dash || null, class: o.cls === undefined ? 'bk-stroke' : o.cls, opacity: o.opacity ?? null }, parent);
}
const setLine = (el, P, Q) => { el.setAttribute('x1', P[0].toFixed(2)); el.setAttribute('y1', P[1].toFixed(2)); el.setAttribute('x2', Q[0].toFixed(2)); el.setAttribute('y2', Q[1].toFixed(2)); };
function path(parent, d, o = {}) {
  return svgEl('path', { d, fill: o.fill || 'none', 'fill-opacity': o.fo ?? null, stroke: o.stroke === undefined ? INK : o.stroke, 'stroke-width': o.width || 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-dasharray': o.dash || null, class: o.cls === undefined ? 'bk-stroke' : o.cls, opacity: o.opacity ?? null }, parent);
}
const polyD = (pts, closed = true) => 'M' + pts.map((p) => p[0].toFixed(2) + ' ' + p[1].toFixed(2)).join('L') + (closed ? 'Z' : '');
const txt = (parent, x, y, s, o = {}) => Geo.text(parent, x, y, s, Object.assign({ size: 21 }, o));
const dot = (parent, p, o = {}) => Geo.dot(parent, p, o);
const sub = (P, Q) => [P[0] - Q[0], P[1] - Q[1]];
const len = (v) => Math.hypot(v[0], v[1]);
const unit = (v) => { const L = len(v) || 1; return [v[0] / L, v[1] / L]; };
const lerp = (P, Q, t) => [P[0] + (Q[0] - P[0]) * t, P[1] + (Q[1] - P[1]) * t];
const cen = (pts) => [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
/** right-angle square at V between the directions to P and Q */
function rightMark(parent, V, P, Q, s = 16, o = {}) {
  const u = unit(sub(P, V)), v = unit(sub(Q, V));
  return path(parent, polyD([[V[0] + u[0] * s, V[1] + u[1] * s], [V[0] + (u[0] + v[0]) * s, V[1] + (u[1] + v[1]) * s], [V[0] + v[0] * s, V[1] + v[1] * s]], false), { width: o.width || 2.4, stroke: o.color || INK, cls: '' });
}
/** a label beside side PQ, pushed away from the point C (the triangle's centre) */
function sideLab(parent, P, Q, C, s, o = {}) {
  const M = lerp(P, Q, o.t ?? 0.5); let n = unit([-(Q[1] - P[1]), Q[0] - P[0]]);
  if (((C[0] - M[0]) * n[0] + (C[1] - M[1]) * n[1] > 0) !== !!o.inside) n = [-n[0], -n[1]];
  const size = o.size || 21, w = String(s).length * size * 0.29 + 4, d = (o.gap ?? 10) + Math.abs(n[0]) * w + Math.abs(n[1]) * size * 0.55;
  const variable = /^[a-z]$/i.test(s);
  return txt(parent, M[0] + n[0] * d, M[1] + n[1] * d, s, { size: variable ? size + 3 : size, italic: variable, color: o.color || (variable ? RED : INK), weight: o.weight });
}
/** fit math points (y up) into a px box → { s, P(p) } */
function fitBox(pts, box, pad = 30) {
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const s = Math.min((box.w - 2 * pad) / (x1 - x0 || 1), (box.h - 2 * pad) / (y1 - y0 || 1), box.max || 1e9);
  const cx = box.x + box.w / 2, cy = box.y + box.h / 2, mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
  return { s, P: (p) => [cx + (p[0] - mx) * s, cy - (p[1] - my) * s] };
}
/** a ✓/✗ stamp hidden until stampIn */
const hStamp = (stage, text, ok, x, y, o = {}) => hide(stamp(stage, text, Object.assign({ ok, x, y }, o)));

/* ======================================================================================
 * Triangles from the booklet: math coordinates, the right-angle vertex, and the side labels
 * ====================================================================================== */
const TRIS = {
  e1a: { pts: { C: [0, 0], A: [8, 0], B: [0, 15] }, right: 'C', sides: { CA: '8 cm', CB: 'a', AB: '17 cm' } },
  e1b: { pts: { C: [0, 0], A: [9, 0], B: [0, 5.6] }, right: 'C', sides: { CA: 'b', CB: '5.6 cm', AB: '10.6 cm' } },
  e2a: { pts: { Q: [0, 0], P: [3.6, 1.3], R: [-0.9, 2.5] }, right: 'Q', sides: { PQ: 'r', QR: 'p', PR: 'q' }, names: true },
  e2b: { pts: { C: [0, 0], A: [7, 0], B: [0, 4] }, right: 'C', sides: { CA: '7 m', CB: '4 m', AB: 'x' } },
  e2c: { pts: { C: [0, 0], A: [9.2, 0], B: [9.2, 6] }, right: 'A', sides: { CA: 'y', AB: '6 ft', CB: '11 ft' } }
};
/** draw a TRIS triangle into a px box → { P (px points), side(key) element, labs, hyp key, fill, rm } */
function drawTri(parent, def, box, o = {}) {
  const keys = Object.keys(def.pts), F = fitBox(keys.map((k) => def.pts[k]), box, o.pad ?? 34);
  const P = {}; keys.forEach((k) => { P[k] = F.P(def.pts[k]); });
  const C0 = cen(keys.map((k) => P[k]));
  const L = { fill: grp(parent), hl: grp(parent), sides: grp(parent), labs: grp(parent) };
  const fill = path(L.fill, polyD(keys.map((k) => P[k])), { stroke: 'none', fill: o.fill || '#f3efe6', cls: '' });
  const side = {}, labs = {};
  Object.keys(def.sides).forEach((sk) => { side[sk] = path(L.sides, polyD([P[sk[0]], P[sk[1]]], false), { width: 3.4 }); });
  const others = keys.filter((k) => k !== def.right);
  const rm = rightMark(L.sides, P[def.right], P[others[0]], P[others[1]], o.rs || 16);
  Object.keys(def.sides).forEach((sk) => { labs[sk] = sideLab(L.labs, P[sk[0]], P[sk[1]], C0, def.sides[sk], { size: o.size || 21 }); });
  if (def.names) keys.forEach((k) => { const u = unit(sub(P[k], C0)); txt(L.labs, P[k][0] + u[0] * 22, P[k][1] + u[1] * 22, k, { size: (o.size || 21) + 1, italic: true }); });
  const hyp = Object.keys(def.sides).find((sk) => sk.indexOf(def.right) < 0);
  return { P, side, labs, hyp, fill, rm, L, C0 };
}

/* ======================================================================================
 * 1a. Take a small square away from the big one (tiles move)
 * ====================================================================================== */
const TAKE = { '5,4': [5, 4], '10,6': [10, 6], '13,12': [13, 12] };
/** the three squares on a right triangle (legs a up, b across; right angle at the origin), math coordinates */
function squaresGeom(a, b) {
  const c = Math.hypot(a, b), C = [0, 0], A = [b, 0], B = [0, a], e2 = [a / c, b / c];
  return { c, C, A, B, sqA: [[-a, 0], [0, 0], [0, a], [-a, a]], sqB: [[0, 0], [b, 0], [b, -b], [0, -b]], sqC: [A, B, [B[0] + e2[0] * c, B[1] + e2[1] * c], [A[0] + e2[0] * c, A[1] + e2[1] * c]],
    all: [[-a, 0], [0, -b], [b + a, b], [a, a + b], [b, -b], [-a, a]] };
}
const takeAway = {
  title: 'Find a leg: take a small square away from the big one',
  height: 430,
  choices: [{ v: '5,4', label: 'hypotenuse 5, leg 4' }, { v: '10,6', label: 'hypotenuse 10, leg 6' }, { v: '13,12', label: 'hypotenuse 13, leg 12' }],
  value: '5,4',
  ask: (v) => { const [c, b] = TAKE[v]; return `A right triangle has a hypotenuse of ${c} and one leg of ${b}. How long is the other leg?`; },
  make(stage, v, ex) {
    const W = ex.W, H = 430, ox = (W - 960) / 2, svg = stageSvg(stage, W, H);
    const [c, b] = TAKE[v], a = Math.sqrt(c * c - b * b), G = squaresGeom(a, b);
    const F = fitBox(G.all, { x: ox, y: 0, w: 600, h: H }, 16), s = F.s, P = F.P;
    const Lsq = grp(svg), Ltile = grp(svg), Ltri = grp(svg), Llab = grp(svg);
    // squares (outlines), triangle, side labels
    const sqC = hide(path(Lsq, polyD(G.sqC.map(P)), { stroke: SQC, width: 2.6, fill: SQC, fo: 0.08, cls: '' }));
    const sqB = hide(path(Lsq, polyD(G.sqB.map(P)), { stroke: SQB, width: 2.6, fill: SQB, fo: 0.06, dash: '7 5', cls: '' }));
    const sqA = hide(path(Lsq, polyD(G.sqA.map(P)), { stroke: SQA, width: 2.6, fill: SQA, fo: 0.06, dash: '7 5', cls: '' }));
    const Cp = P(G.C), Ap = P(G.A), Bp = P(G.B), C0 = cen([Cp, Ap, Bp]);
    path(Ltri, polyD([Cp, Ap, Bp]), { stroke: INK, width: 3.4, fill: '#f3efe6' });
    rightMark(Ltri, Cp, Ap, Bp, 14);
    sideLab(Llab, Cp, Ap, C0, String(b), { size: 20, gap: 4, inside: true, color: SQB });
    sideLab(Llab, Ap, Bp, C0, String(c), { size: 20, gap: 4, inside: true, color: SQC });
    const qG = grp(Llab); sideLab(qG, Cp, Bp, C0, '?', { size: 24, gap: 4, color: RED, inside: true });
    // tiles: every unit square of c², each with a target in b² (the first b² of them) or a²
    const cc = c, e1 = unit(sub(G.B, G.A)), e2 = [a / c, b / c], tw = Math.max(4, s - 2);
    const angC = Math.atan2(-(e1[1]), e1[0]) / RAD;
    const src = [];
    for (let i = 0; i < cc; i++) for (let j = 0; j < cc; j++) src.push(P([G.A[0] + (i + 0.5) * e1[0] + (j + 0.5) * e2[0], G.A[1] + (i + 0.5) * e1[1] + (j + 0.5) * e2[1]]));
    const tgtB = [], tgtA = [];
    for (let i = 0; i < b; i++) for (let j = 0; j < b; j++) tgtB.push(P([i + 0.5, -(j + 0.5)]));
    for (let i = 0; i < a; i++) for (let j = 0; j < a; j++) tgtA.push(P([-(i + 0.5), j + 0.5]));
    const cB = cen(G.sqB.map(P)), cA = cen(G.sqA.map(P)), cC = cen(G.sqC.map(P));
    const byD = (Q) => (p, q) => len(sub(p, Q)) - len(sub(q, Q));
    const pool = src.slice().sort(byD(cB)), toB = pool.slice(0, b * b), rest = pool.slice(b * b).sort(byD(cA));
    tgtB.sort(byD(cC)); tgtA.sort(byD(cC));
    const tiles = [];
    const mk = (from, to, colr) => {
      const r = svgEl('rect', { x: (-tw / 2).toFixed(2), y: (-tw / 2).toFixed(2), width: tw.toFixed(2), height: tw.toFixed(2), rx: Math.min(3, tw / 6).toFixed(2), fill: SQC, 'fill-opacity': 0.55, stroke: '#fff', 'stroke-width': 1 }, Ltile);
      const t = { r, from, to, colr, set(u) { const p = lerp(from, to, u), ang = angC * (1 - u); r.setAttribute('transform', `translate(${p[0].toFixed(2)} ${p[1].toFixed(2)}) rotate(${ang.toFixed(2)})`); } };
      t.set(0); r.style.opacity = 0; tiles.push(t); return t;
    };
    const tB = toB.map((p, k) => mk(p, tgtB[k], SQB)), tA = rest.map((p, k) => mk(p, tgtA[k], SQA));
    const fly = (c, list, ms) => tween(c, ms, (t) => {
      const n = list.length, spread = 0.45;
      list.forEach((tile, k) => { const t0 = n > 1 ? (k / (n - 1)) * spread : 0, u = Math.max(0, Math.min(1, (t - t0) / (1 - spread))); tile.set(u); if (u >= 1) { tile.r.setAttribute('fill', tile.colr); } });
    });
    // area labels inside the squares, and the working on the right
    const inSq = (Q, html, colr) => hide(lab(stage, `<span style="color:${colr}">${html}</span>`, Q[0], Q[1], 'u7l3-eq'));
    const aC = inSq(cC, T(`${c}^2=${c * c}`), SQC), aB = inSq(cB, T(`${b}^2=${b * b}`), SQB), aA = inSq(cA, T(`${a * a}`), SQA), aA2 = inSq(cA, T(`${a}^2=${a * a}`), SQA);
    const px = ox + 790, E = (html, y, cls = '') => hide(lab(stage, html, px, y, 'u7l3-eq ' + cls));
    const e1L = E(T(`c^2=${c}^2=${c * c}`), 70, 'u7l3-hyp'), e2L = E(T(`b^2=${b}^2=${b * b}`), 140), e3L = E(T(`a^2=${c * c}-${b * b}=${a * a}`), 220), e4L = E(T(`a=\\sqrt{${a * a}}=${a}`), 300);
    const st = hStamp(stage, `the missing leg is ${a} ✓`, true, px, 375);
    const qa = hide(sideLab(Llab, Cp, Bp, C0, String(a), { size: 22, gap: 4, color: SQA, inside: true }));
    return [
      { cap: `A right triangle: the hypotenuse is <b>${c}</b> and one leg is <b>${b}</b>. The other leg is missing.`, run: (c2) => pulse(c2, qG, 1.25, 600) },
      { cap: `Build the square on the hypotenuse: ${c}² = <b>${pn(c * c)}</b> tiles.`, run: async (cx) => { show(sqC); await cx.fadeIn(sqC, 300, { from: 'none' }); await tween(cx, 900, (t) => { const n = tiles.length; tiles.forEach((tile, k) => { tile.r.style.opacity = t * n > k ? 1 : 0; }); }); await cx.pop(aC); await cx.pop(e1L); } },
      { cap: `The square on the known leg needs ${b}² = <b>${b * b}</b> tiles. Move them out of the big square.`, run: async (cx) => { await op(cx, aC, 0, 250); show(sqB); await cx.fadeIn(sqB, 300, { from: 'none' }); await fly(cx, tB, 1700); await cx.pop(aB); await cx.pop(e2L); } },
      { cap: `The <b>${a * a}</b> tiles that are left fill the square on the missing leg: ${pn(c * c)} − ${b * b} = ${a * a}.`, run: async (cx) => { show(sqA); await cx.fadeIn(sqA, 300, { from: 'none' }); await fly(cx, tA, 1500); await cx.pop(aA); await cx.pop(e3L); } },
      { cap: `Its side is √${a * a} = <b>${a}</b>. To find a leg, <b>subtract</b>: big square minus small square.`, run: async (cx) => { await op(cx, qG, 0, 250); show(qa); await cx.fadeIn(qa, 300, { from: 'none' }); await op(cx, aA, 0, 200); show(aA2); await cx.pop(aA2); await cx.pop(e4L); await stampIn(cx, st); } }
    ];
  }
};

/* ======================================================================================
 * 1b. The six steps (Examples 1 and 2)
 * ====================================================================================== */
const LEG = {
  '1a': { tri: 'e1a', ask: 'Example 1(a): find the missing leg <i>a</i>.', x: 'a', c: 17, k: 8, unit: 'cm' },
  '1b': { tri: 'e1b', ask: 'Example 1(b): find the missing leg <i>b</i>.', x: 'b', c: 10.6, k: 5.6, unit: 'cm' },
  '2a': { tri: 'e2a', ask: 'Example 2(a): in △<i>PQR</i> the right angle is at <i>Q</i>. Which side is the hypotenuse? Write the theorem, then rearrange it to find <i>r</i>.' },
  '2b': { tri: 'e2b', ask: 'Example 2(b): leg or hypotenuse? Find <i>x</i> to the nearest tenth.', x: 'x', hyp: true, legs: [7, 4], unit: 'm' },
  '2c': { tri: 'e2c', ask: 'Example 2(c): leg or hypotenuse? Find <i>y</i> to the nearest tenth.', x: 'y', c: 11, k: 6, unit: 'ft' }
};
const leg = {
  title: 'Leg or hypotenuse? Then add or subtract',
  height: 440,
  choices: [{ sep: 'Example 1 check:' }, { v: '1a', label: '(a) 17 and 8' }, { v: '1b', label: '(b) 10.6 and 5.6' }, { sep: 'Example 2 check:' }, { v: '2a', label: '(a) △PQR' }, { v: '2b', label: '(b) 7 and 4' }, { v: '2c', label: '(c) 11 and 6' }],
  value: '1a',
  ask: (k) => LEG[k].ask,
  make(stage, k, ex) {
    const W = ex.W, H = 440, ox = (W - 960) / 2, svg = stageSvg(stage, W, H), d = LEG[k], def = TRIS[d.tri];
    const Tr = drawTri(svg, def, { x: ox, y: 0, w: 440, h: H, max: k === '1a' ? 26 : 1e9 }, { size: 22, pad: 66 });
    const hypEl = Tr.side[Tr.hyp], hl = path(Tr.L.hl, hypEl.getAttribute('d'), { stroke: SQC, width: 14, opacity: 0.3, cls: '' }); hl.style.opacity = 0;
    const rmG = grp(svg); rmG.appendChild(Tr.rm);
    const unk = Object.keys(def.sides).find((sk) => def.sides[sk] === (k === '2a' ? 'r' : d.x));
    const px = ox + 470, y0 = 50, dy = 64, E = (html, i, cls = '') => hide(lab(stage, html, px, y0 + i * dy, 'u7l3-eq u7l3-left ' + cls));
    const hypTag = () => E(`hypotenuse: ${def.sides[Tr.hyp]}`, 0, 'u7l3-hyp');
    const mark = async (c) => { hl.style.opacity = 0.3; await drawIn(hl, 600, c); await pulse(c, rmG, 1.3, 500); };
    if (k === '2a') {
      const L0 = hypTag(), L1 = E(T('p^2+r^2=q^2'), 1), L2 = E(`${T('p^2+r^2-p^2=q^2-p^2')}`, 2, ''), L3 = E(T('r^2=q^2-p^2'), 3, 'u7l3-good');
      L0.inner.innerHTML = `hypotenuse: ${T('q')} (side ${T('PR')})`;
      const st = hStamp(stage, 'r is a leg: subtract ✓', true, px + 200, 330);
      return [
        { cap: 'Step 1. The right angle is at <b>Q</b>. The side across from it is <b>q</b> (side PR): the <b>hypotenuse</b>.', run: async (c) => { await mark(c); await c.pop(L0); } },
        { cap: 'Step 2. The two legs squared add up to the hypotenuse squared: p² + r² = q².', run: (c) => c.pop(L1) },
        { cap: 'To get r² by itself, subtract p² from <b>both</b> sides.', run: (c) => c.pop(L2) },
        { cap: 'So r² = q² − p². The side we want, r, is a <b>leg</b>: big square minus small square.', run: async (c) => { await c.pop(L3); await stampIn(c, st); } }
      ];
    }
    const L0 = hypTag(), x = d.x, u = d.unit;
    let lines, caps, res, resP, check;
    if (d.hyp) {
      const [p, q] = d.legs, sq = p * p + q * q; res = Math.sqrt(sq);
      resP = res.toFixed(1);
      L0.inner.innerHTML = `hypotenuse: ${T(x)} <span class="u7l3-small">(the missing side!)</span>`;
      lines = [`${x}^2=${p}^2+${q}^2`, `${x}^2=${p * p}+${q * q}=${sq}`, `${x}=\\sqrt{${sq}}=${dots(res)}`, `${x}\\approx${resP}\\text{ ${u}}`];
      caps = [`Step 1. Find the right angle. The side across from it is <b>${x}</b>: the missing side is the <b>hypotenuse</b>.`,
        `Step 2. Missing hypotenuse, so <b>add</b> the squares: ${x}² = ${p}² + ${q}².`,
        `Steps 3 and 4. Square and add: ${p * p} + ${q * q} = ${sq}.`,
        `Step 5. Take the square root: √${sq} = ${dotsP(res)} ≈ <b>${resP} ${u}</b>.`,
        `Step 6. Check: ${resP} is longer than both legs (${p} and ${q}), so it can be the hypotenuse ✓`];
      check = `${resP} > ${p} ✓`;
    } else {
      const cv = d.c, kv = d.k, c2 = rd(cv * cv), k2 = rd(kv * kv), r2 = rd(c2 - k2); res = Math.sqrt(r2);
      const exact = Math.abs(res - Math.round(res)) < 1e-9; resP = exact ? String(Math.round(res)) : res.toFixed(1);
      const other = x === 'a' ? 'b' : 'a', f0 = x === 'y' ? `${x}^2=(\\text{hyp})^2-(\\text{leg})^2` : `${x}^2=c^2-${other}^2`;
      lines = [f0, `${x}^2=${cv}^2-${kv}^2=${tn(c2)}-${tn(k2)}`, `${x}^2=${tn(r2)}`, exact ? `${x}=\\sqrt{${tn(r2)}}=${resP}\\text{ ${u}}` : `${x}=\\sqrt{${r2}}=${dots(res)}\\approx${resP}\\text{ ${u}}`];
      caps = [`Step 1. Find the right angle. The side across from it is the <b>hypotenuse: ${cv} ${u}</b>.`,
        `Step 2. The missing side <b>${x}</b> is a <b>leg</b>, so <b>subtract</b>: ${x === 'y' ? 'y² = (hypotenuse)² − (leg)²' : `${x}² = c² − ${other}²`}.`,
        `Step 3. Substitute and square: ${cv}² − ${kv}² = ${pn(c2)} − ${pn(k2)}.`,
        `Step 4. Subtract: ${x}² = ${pn(r2)}.`,
        `Step 5. Take the square root: ${x} = ${exact ? `√${pn(r2)} = <b>${resP} ${u}</b>` : `√${r2} = ${dotsP(res)} ≈ <b>${resP} ${u}</b>`}.`,
        `Step 6. Check: ${resP} is less than ${cv}. The hypotenuse is still the longest side ✓`];
      check = `${resP} < ${cv} ✓`;
    }
    const Ls = lines.map((s, i) => E(T(s), i + 1, i === lines.length - 1 ? 'u7l3-good' : ''));
    const st = hStamp(stage, check, true, px + 230, y0 + 5.4 * dy);
    // the unknown's label turns into the answer
    const uLab = Tr.labs[unk], ansLab = hide(sideLab(Tr.L.labs, Tr.P[unk[0]], Tr.P[unk[1]], Tr.C0, `${resP} ${u}`, { size: 22, color: GREEN }));
    const ansG = grp(Tr.L.labs); ansG.appendChild(ansLab);
    const swap = async (c) => { await op(c, uLab, 0, 250); show(ansLab); await c.pop(ansG); };
    if (d.hyp) {
      return [
        { cap: caps[0], run: async (c) => { await mark(c); await c.pop(L0); } },
        { cap: caps[1], run: (c) => c.pop(Ls[0]) },
        { cap: caps[2], run: (c) => c.pop(Ls[1]) },
        { cap: caps[3], run: async (c) => { await c.pop(Ls[2]); await c.pop(Ls[3]); await swap(c); } },
        { cap: caps[4], run: (c) => stampIn(c, st) }
      ];
    }
    return [
      { cap: caps[0], run: async (c) => { await mark(c); await c.pop(L0); } },
      { cap: caps[1], run: (c) => c.pop(Ls[0]) },
      { cap: caps[2], run: (c) => c.pop(Ls[1]) },
      { cap: caps[3], run: (c) => c.pop(Ls[2]) },
      { cap: caps[4], run: async (c) => { await c.pop(Ls[3]); await swap(c); } },
      { cap: caps[5], run: (c) => stampIn(c, st) }
    ];
  }
};

/* ======================================================================================
 * 2a. The ladder against the wall (Example 3) — a scene that slides
 * ====================================================================================== */
/** wall on the left, ground, ladder of length Lm (m) with its foot d m out. o: { x, y, w, h, s (px per m), wallTop (m) } */
function ladderScene(parent, host, o) {
  const s = o.s, gy = o.y + o.h - (o.bottom ?? 50), wx = o.x + 86, Lm = o.L;
  const g = grp(parent);
  // house wall (siding), ground
  svgEl('rect', { x: o.x + 30, y: gy - o.wallTop * s, width: wx - o.x - 30, height: o.wallTop * s, fill: '#e9dcc4', stroke: WOODD, 'stroke-width': 2.5 }, g);
  for (let yy = gy - 16; yy > gy - o.wallTop * s + 6; yy -= 16) line(g, [o.x + 31, yy], [wx - 1, yy], { color: '#cdbb98', width: 1.4, cls: '' });
  svgEl('rect', { x: o.x + 40, y: gy - o.wallTop * s * 0.72, width: wx - o.x - 60, height: 46, fill: '#bfe0f5', stroke: WOODD, 'stroke-width': 2.5 }, g);
  line(g, [o.x + 4, gy], [o.x + o.w - 6, gy], { color: '#6b8f4e', width: 4, cls: '' });
  for (let xx = wx + 8; xx < o.x + o.w - 10; xx += 14) line(g, [xx, gy + 1], [xx - 5, gy + 9], { color: '#8bb36b', width: 1.6, cls: '' });
  const tri = path(g, '', { stroke: 'none', fill: '#fbecd2', fo: 0.85, cls: '' });
  const rm = rightMark(g, [wx, gy], [wx + 10, gy], [wx, gy - 10], 15);
  const lad = grp(g);
  const hDim = grp(g), dDim = grp(g);
  const hLine = line(hDim, [0, 0], [0, 0], { color: SLATE, width: 2, cls: '' });
  const dLine = line(dDim, [0, 0], [0, 0], { color: SLATE, width: 2, cls: '' });
  const hTxt = txt(hDim, 0, 0, o.hLabel || 'h', { size: 22, italic: !o.hLabel, color: RED });
  const dTxt = txt(dDim, 0, 0, '', { size: 20 });
  const lTxt = txt(g, 0, 0, `${Lm} m`, { size: 21, color: WOODD });
  const marker = grp(g); marker.style.opacity = 0;
  const mk = path(marker, '', { stroke: GREEN, width: 3, fill: GREEN, fo: 0.25, cls: '' });
  const mkT = txt(marker, 0, 0, 'height ÷ 4', { size: 16, color: GREEN, anchor: 'start' });
  let cur = { d: 0, h: 0 };
  function set(d) {
    const hm = Math.sqrt(Math.max(0, Lm * Lm - d * d)), F = [wx + d * s, gy], Tp = [wx, gy - hm * s];
    cur = { d, h: hm, F, Tp };
    tri.setAttribute('d', polyD([[wx, gy], F, Tp]));
    lad.innerHTML = '';
    const u = unit(sub(Tp, F)), n = [-u[1], u[0]], rail = 6;
    line(lad, [F[0] + n[0] * rail, F[1] + n[1] * rail], [Tp[0] + n[0] * rail, Tp[1] + n[1] * rail], { color: '#8a5a1c', width: 5, cls: '' });
    line(lad, [F[0] - n[0] * rail, F[1] - n[1] * rail], [Tp[0] - n[0] * rail, Tp[1] - n[1] * rail], { color: '#8a5a1c', width: 5, cls: '' });
    const L = len(sub(Tp, F)); for (let t = 18; t < L - 8; t += 22) { const p = [F[0] + u[0] * t, F[1] + u[1] * t]; line(lad, [p[0] + n[0] * rail, p[1] + n[1] * rail], [p[0] - n[0] * rail, p[1] - n[1] * rail], { color: '#a8763a', width: 3, cls: '' }); }
    setLine(hLine, [o.x + 16, gy], [o.x + 16, Tp[1]]); hTxt.setAttribute('x', (o.x + 30).toFixed(1)); hTxt.setAttribute('y', ((gy + Tp[1]) / 2).toFixed(1));
    setLine(dLine, [wx, gy + 22], [F[0], gy + 22]); dTxt.setAttribute('x', ((wx + F[0]) / 2).toFixed(1)); dTxt.setAttribute('y', (gy + 22 + 14).toFixed(1));
    dTxt.textContent = `${d.toFixed(1)} m`;
    const M = lerp(F, Tp, 0.55), nn = [-u[1], u[0]]; lTxt.setAttribute('x', (M[0] + nn[0] * 36).toFixed(1)); lTxt.setAttribute('y', (M[1] + nn[1] * 36).toFixed(1));
    const mx = wx + (hm / 4) * s; mk.setAttribute('d', `M${mx - 9} ${gy + 2}L${mx + 9} ${gy + 2}L${mx} ${gy - 12}Z`); mkT.setAttribute('x', (mx + 14).toFixed(1)); mkT.setAttribute('y', (gy - 12).toFixed(1));
  }
  return { g, set, get cur() { return cur; }, rm, lad, tri, hTxt, dTxt, lTxt, marker, wx, gy, hDim, dDim };
}
const ladder = {
  title: 'The ladder is the hypotenuse',
  height: 450,
  choices: [{ sep: 'Example 3 check:' }, { v: 'ex3', label: 'Jordan’s 7.3 m ladder' }, { sep: 'Then:' }, { v: 'slide', label: 'slide the foot' }],
  value: 'ex3',
  ask: (k) => (k === 'ex3' ? 'Example 3: a 7.3 m ladder leans on a wall with its foot 1.8 m from the wall. (a) How high does it reach? (b) Does it follow the 4-to-1 rule?' : 'The same 7.3 m ladder. What happens to the top when the foot slides out or in?'),
  make(stage, k, ex) {
    const W = ex.W, H = 450, ox = (W - 960) / 2, svg = stageSvg(stage, W, H);
    const S = ladderScene(svg, stage, { x: ox, y: 0, w: 560, h: H, s: 50, L: 7.3, wallTop: 7.9 });
    S.set(1.8);
    const px = ox + 620, E = (html, y, cls = '') => hide(lab(stage, html, px, y, 'u7l3-eq u7l3-left ' + cls));
    const h0 = Math.sqrt(7.3 * 7.3 - 1.8 * 1.8);
    if (k === 'ex3') {
      const L1 = E(T('h^2=7.3^2-1.8^2'), 50), L2 = E(T('h^2=53.29-3.24=50.05'), 110), L3 = E(T(`h=\\sqrt{50.05}=${dots(h0)}`), 170), L4 = E(T('h\\approx7.1\\text{ m}'), 230, 'u7l3-good');
      const L5 = E(`4-to-1: ${T('7.1\\div4\\approx1.8')} m out`, 305);
      const st = hStamp(stage, 'follows the rule ✓', true, px + 150, 380);
      const hl = hide(path(svg, polyD([S.cur.F, S.cur.Tp], false), { stroke: SQC, width: 18, cls: '' }));
      return [
        { cap: 'The wall meets the ground at a <b>right angle</b>. The 7.3 m ladder is across from it: the <b>hypotenuse</b>.', run: async (c) => { hl.style.opacity = 0.3; await drawIn(hl, 600, c); await pulse(c, S.lad, 1.04, 500); } },
        { cap: 'The height <b>h</b> is a <b>leg</b>, so subtract: h² = 7.3² − 1.8² = 53.29 − 3.24 = 50.05.', run: async (c) => { await c.pop(L1); await c.pop(L2); } },
        { cap: `h = √50.05 = ${dotsP(h0)} ≈ <b>7.1 m</b> up the wall.`, run: async (c) => { await c.pop(L3); await c.pop(L4); S.hTxt.textContent = '7.1 m'; S.hTxt.removeAttribute('font-style'); await pulse(c, S.hDim, 1.15, 500); } },
        { cap: '(b) The 4-to-1 rule: the foot should be about height ÷ 4 = 7.1 ÷ 4 ≈ <b>1.8 m</b> out.', run: async (c) => { await c.pop(L5); show(S.marker); await c.fadeIn(S.marker, 400); } },
        { cap: 'The foot is 1.8 m out, right at the mark. Yes: Jordan’s ladder follows the rule ✓', run: (c) => stampIn(c, st) }
      ];
    }
    show(S.marker);
    const read = lab(stage, '', px + 160, 70, 'u7l3-read'), angT = lab(stage, '', px + 160, 130, 'u7l3-eq');
    const upd = () => { const { d, h: hm } = S.cur; read.inner.innerHTML = `top: ${hm.toFixed(2)} m up`; angT.inner.innerHTML = `foot: ${d.toFixed(1)} m out · angle ${Math.round(Math.acos(d / 7.3) / RAD)}°`; };
    upd();
    const E2 = (html, y, cls) => hide(lab(stage, html, px + 160, y, 'u7l3-eq ' + cls));
    const f1 = E2(T('\\sqrt{7.3^2-4.5^2}=5.75'), 200, ''), f2 = E2(T('\\sqrt{7.3^2-0.6^2}=7.28'), 200, '');
    const s1 = hStamp(stage, 'can slip ✗', false, px + 160, 290), s2 = hStamp(stage, 'can tip back ✗', false, px + 160, 290), s3 = hStamp(stage, 'safe ✓', true, px + 160, 290);
    const slide = (c, from, to) => tween(c, 1800, (t) => { S.set(from + (to - from) * t); upd(); });
    return [
      { cap: 'The 7.3 m ladder with its foot <b>1.8 m</b> out. The top is 7.07 m up the wall.', run: (c) => pulse(c, read, 1.12, 500) },
      { cap: 'Slide the foot out to <b>4.5 m</b>. The top slides down the wall to √(7.3² − 4.5²) = 5.75 m. Too far out: the foot can slip.', run: async (c) => { await slide(c, 1.8, 4.5); await c.pop(f1); await stampIn(c, s1); } },
      { cap: 'Slide it in to <b>0.6 m</b>. The top goes up to 7.28 m, but the ladder is too steep: it can tip backward.', run: async (c) => { await op(c, f1, 0, 200); await op(c, s1, 0, 200); await slide(c, 4.5, 0.6); await c.pop(f2); await stampIn(c, s2); } },
      { cap: 'About height ÷ 4 out is safe (about 75°). The ladder never changes length: it is always the <b>hypotenuse</b>.', run: async (c) => { await op(c, f2, 0, 200); await op(c, s2, 0, 200); await slide(c, 0.6, 1.8); await stampIn(c, s3); } }
    ];
  }
};

/* ======================================================================================
 * 2b. Amara's kite (Example 4)
 * ====================================================================================== */
/** not to scale: hand height drawn bigger so it can be seen. o: { x, y, w, h } */
function kiteScene(parent, o) {
  const gy = o.y + o.h - 26, hx = o.x + 70, hy = gy - (o.hand || 44), Gx = hx + (o.run || 270), Ky = hy - (o.rise || 330);
  const g = grp(parent);
  line(g, [o.x + 4, gy], [o.x + o.w - 4, gy], { color: '#6b8f4e', width: 4, cls: '' });
  for (let xx = o.x + 10; xx < o.x + o.w - 6; xx += 14) line(g, [xx, gy + 1], [xx - 5, gy + 9], { color: '#8bb36b', width: 1.6, cls: '' });
  // Amara
  const am = grp(g), bx = hx - 26;
  svgEl('circle', { cx: bx, cy: gy - (o.hand || 44) - 34, r: 11, fill: '#f4c9a6', stroke: '#8a5a34', 'stroke-width': 2.2 }, am);
  line(am, [bx, gy - (o.hand || 44) - 22], [bx, gy - 26], { color: '#3a5fa0', width: 5, cls: '' });
  line(am, [bx, gy - 26], [bx - 9, gy], { color: '#3a4254', width: 4, cls: '' }); line(am, [bx, gy - 26], [bx + 9, gy], { color: '#3a4254', width: 4, cls: '' });
  line(am, [bx, gy - (o.hand || 44) - 14], [hx, hy], { color: '#f4c9a6', width: 4, cls: '' });
  if (o.name !== false) txt(am, bx - 6, gy - (o.hand || 44) - 62, 'Amara', { size: 16, color: SLATE });
  const H = [hx, hy], Gp = [Gx, hy], K = [Gx, Ky];
  const fill = path(g, polyD([H, Gp, K]), { stroke: 'none', fill: '#fbecd2', fo: 0.8, cls: '' });
  const hor = line(g, H, Gp, { color: SLATE, width: 2.2, dash: '7 6', cls: '' });
  const ver = line(g, [Gx, gy], K, { color: SLATE, width: 2.2, dash: '7 6', cls: '' });
  const rm = grp(g); rightMark(rm, Gp, H, K, 14);
  const str = line(g, H, K, { color: INK, width: 2.6 });
  // the kite (sways a little)
  const kite = grp(g); kite.style.transformBox = 'view-box'; kite.style.transformOrigin = '0 0';
  path(kite, polyD([[Gx, Ky], [Gx - 16, Ky - 16], [Gx, Ky - 40], [Gx + 16, Ky - 16]]), { stroke: '#7a1f16', width: 2.4, fill: '#d23a2e', cls: '' });
  line(kite, [Gx, Ky], [Gx, Ky - 40], { color: '#7a1f16', width: 1.6, cls: '' }); line(kite, [Gx - 16, Ky - 16], [Gx + 16, Ky - 16], { color: '#7a1f16', width: 1.6, cls: '' });
  path(kite, `M${Gx} ${Ky - 40}q10 -14 2 -26`, { stroke: AMBER, width: 2, cls: '' });
  if (o.sway) svgEl('animateTransform', { attributeName: 'transform', type: 'rotate', values: `-5 ${Gx} ${Ky};5 ${Gx} ${Ky};-5 ${Gx} ${Ky}`, dur: '3.4s', repeatCount: 'indefinite' }, kite);
  const labs = grp(g);
  const t28 = txt(labs, (hx + Gx) / 2, hy + 18, '28 m', { size: 19 });
  const M = lerp(H, K, 0.5), u = unit(sub(K, H));
  const t45 = txt(labs, M[0] + u[1] * 30, M[1] - u[0] * 30, '45 m', { size: 19 });
  const hTxt = txt(labs, Gx + 22, (hy + Ky) / 2, 'h', { size: 23, italic: true, color: RED });
  const handDim = grp(g); line(handDim, [hx + 12, gy], [hx + 12, hy], { color: AMBER, width: 3, cls: '' }); txt(handDim, hx + 44, (gy + hy) / 2, '1.2 m', { size: 16, color: AMBER });
  const tot = grp(g); line(tot, [Gx + 56, gy], [Gx + 56, Ky], { color: GREEN, width: 3, cls: '' }); line(tot, [Gx + 49, gy], [Gx + 63, gy], { color: GREEN, width: 3, cls: '' }); line(tot, [Gx + 49, Ky], [Gx + 63, Ky], { color: GREEN, width: 3, cls: '' });
  return { g, H, Gp, K, fill, hor, ver, rm, str, kite, t28, t45, hTxt, handDim, tot, gy };
}
const kite = {
  title: 'Amara’s kite: the triangle starts at her hand',
  height: 440,
  ask: 'Example 4: the string is 45 m long, held 1.2 m above the ground. The kite is above a spot 28 m from Amara. How high is the kite above the ground?',
  make(stage, v, ex) {
    const W = ex.W, H = 440, ox = (W - 960) / 2, svg = stageSvg(stage, W, H);
    const K = kiteScene(svg, { x: ox, y: 0, w: 470, h: H, run: 290, rise: 290, hand: 44, sway: true });
    hide(K.fill, K.hor, K.ver, K.rm, K.t28, K.hTxt, K.tot, K.str, K.t45);
    const kG = K.kite; kG.style.opacity = 0;
    txt(svg, ox + 380, H - 8, '(not to scale)', { size: 14, color: GREY });
    const px = ox + 520, E = (html, y, cls = '') => hide(lab(stage, html, px, y, 'u7l3-eq u7l3-left ' + cls));
    const hv = Math.sqrt(1241);
    const L1 = E(T('h^2=45^2-28^2'), 50), L2 = E(T('h^2=2\\,025-784=1\\,241'), 110), L3 = E(T(`h=\\sqrt{1\\,241}=${dots(hv)}`), 170), L4 = E(`${T(`${dots(hv)}+1.2=${dots(hv + 1.2)}`)}`, 250, 'u7l3-hyp'), L5 = E(T('\\approx36.4\\text{ m above the ground}'), 310, 'u7l3-good');
    const st = hStamp(stage, 'above the ground ✓', true, px + 200, 385);
    return [
      { cap: 'Amara holds the string <b>1.2 m</b> above the ground. The string is pulled straight: <b>45 m</b> to the kite.', run: async (c) => { show(K.str); await drawIn(K.str, 800, c); await op(c, kG, 1, 300); show(K.t45); await c.fadeIn(K.t45, 300, { from: 'none' }); } },
      { cap: 'The kite is above a spot <b>28 m</b> away. The right angle is at the height of her <b>hand</b>, under the kite.', run: async (c) => { show(K.hor, K.ver); await drawIn(K.hor, 500, c); await drawIn(K.ver, 500, c); show(K.rm, K.t28, K.fill); await c.fadeIn(K.fill, 400, { from: 'none' }); await pulse(c, K.rm, 1.4, 500); } },
      { cap: 'The string is the hypotenuse and h is a leg. Subtract: h² = 45² − 28² = 2&#8239;025 − 784 = 1&#8239;241.', run: async (c) => { show(K.hTxt); await c.fadeIn(K.hTxt, 300, { from: 'none' }); await c.pop(L1); await c.pop(L2); } },
      { cap: `h = √1&#8239;241 = ${dotsP(hv)} m. That is the height above her <b>hand</b>.`, run: (c) => c.pop(L3) },
      { cap: `Read the question again: above the <b>ground</b>. Add her hand height: ${dotsP(hv)} + 1.2 = ${dotsP(hv + 1.2)}`, run: async (c) => { await pulse(c, K.handDim, 1.25, 600); show(K.tot); await c.fadeIn(K.tot, 400, { from: 'none' }); await c.pop(L4); } },
      { cap: 'The kite is about <b>36.4 m</b> above the ground ✓', run: async (c) => { await c.pop(L5); await stampIn(c, st); } }
    ];
  }
};

/* ======================================================================================
 * 2c. Two triangles that share a side (Example 5)
 * ====================================================================================== */
function twoScene(parent, box, o = {}) {
  const pts = { L: [0, 0], D: [4.1, 0], R: [10.4, 0], T: [4.1, 8.57] }, F = fitBox(Object.values(pts), box, o.pad ?? 36);
  const P = {}; Object.keys(pts).forEach((k) => { P[k] = F.P(pts[k]); });
  const g = grp(parent), fills = grp(g), sides = grp(g), labs = grp(g);
  const fL = path(fills, polyD([P.L, P.D, P.T]), { stroke: 'none', fill: BLUE, fo: 0.12, cls: '' });
  const fR = path(fills, polyD([P.D, P.R, P.T]), { stroke: 'none', fill: GREEN, fo: 0.12, cls: '' });
  path(sides, polyD([P.L, P.R, P.T]), { width: 3.4 });
  const xs = path(sides, polyD([P.T, P.D], false), { width: 3.4 });
  const xG = grp(sides); xG.appendChild(xs);
  rightMark(sides, P.D, P.R, P.T, 15);
  const sz = o.size || 20;
  txt(labs, (P.L[0] + P.D[0]) / 2, P.L[1] + 18, '4.1 cm', { size: sz });
  txt(labs, (P.D[0] + P.R[0]) / 2, P.L[1] + 18, '6.3 cm', { size: sz });
  const C0 = cen([P.L, P.T, P.R]);
  sideLab(labs, P.L, P.T, C0, '9.5 cm', { size: sz });
  const xl = txt(labs, P.D[0] + 16, lerp(P.D, P.T, 0.45)[1], 'x', { size: sz + 3, italic: true, color: RED });
  const yl = sideLab(labs, P.R, P.T, C0, 'y', { size: sz });
  return { g, P, fL, fR, xG, xl, yl };
}
const two = {
  title: 'Two triangles: keep the full value of the shared side',
  height: 440,
  ask: 'Example 5: find x and y, to the nearest tenth of a centimetre.',
  make(stage, v, ex) {
    const W = ex.W, H = 440, ox = (W - 960) / 2, svg = stageSvg(stage, W, H);
    const S = twoScene(svg, { x: ox, y: 10, w: 450, h: 420 }, { size: 21 });
    hide(S.fL, S.fR);
    const px = ox + 480, E = (html, y, cls = '') => hide(lab(stage, html, px, y, 'u7l3-eq u7l3-left ' + cls));
    const xv = Math.sqrt(73.44), yv = Math.sqrt(113.13), yb = Math.sqrt(113.65);
    const L1 = E(T('x^2=9.5^2-4.1^2'), 34), L1b = E(T('x^2=90.25-16.81=73.44'), 82), L2 = E(T(`x=\\sqrt{73.44}=${dots(xv)}\\approx8.6`), 130);
    const mem = hide(lab(stage, `keep ${T('x^2=73.44')}`, px + 150, 180, 'u7l3-mem'));
    const L3 = E(T('y^2=73.44+6.3^2'), 232), L3b = E(T('y^2=73.44+39.69=113.13'), 280), L4 = E(`${T(`y=\\sqrt{113.13}=${dots(yv)}\\approx10.6\\text{ cm}`)} ✓`, 328, 'u7l3-good');
    const L5 = E(`${T('8.6^2+6.3^2=113.65,\\ y\\approx10.7')} ✗`, 395, 'u7l3-redt');

    return [
      { cap: 'Two right triangles share the side <b>x</b>. Both right angles are at the bottom of x.', run: (c) => pulse(c, S.xG, 1.06, 600) },
      { cap: 'Left triangle: 9.5 cm is across from the right angle, so it is the <b>hypotenuse</b>. x is a leg: subtract.', run: async (c) => { show(S.fL); await c.fadeIn(S.fL, 400, { from: 'none' }); await c.pop(L1); await c.pop(L1b); } },
      { cap: `x = √73.44 = ${dotsP(xv)} ≈ 8.6 cm. <b>Keep</b> the full x² = 73.44 for the next triangle.`, run: async (c) => { await c.pop(L2); await c.pop(mem); } },
      { cap: 'Right triangle: the legs are x and 6.3 cm, and <b>y</b> is the hypotenuse: add. Use x² = 73.44.', run: async (c) => { await op(c, S.fL, 0.35, 300); show(S.fR); await c.fadeIn(S.fR, 400, { from: 'none' }); await pulse(c, mem, 1.15, 500); await c.pop(L3); await c.pop(L3b); } },
      { cap: `y = √113.13 = ${dotsP(yv)} ≈ <b>10.6 cm</b>.`, run: (c) => c.pop(L4) },
      { cap: `If you round x to 8.6 first: 8.6² + 6.3² = 113.65 and y = ${dotsP(yb)} ≈ 10.7. A little off! Round only at the end.`, run: (c) => c.pop(L5) }
    ];
  }
};

/* ======================================================================================
 * 3a. The right-triangle tester (Examples 6 and 7): sticks, a balance, a verdict, the real triangle
 * ====================================================================================== */
const TEST = {
  a: { sides: [9, 40, 41], unit: 'cm', ask: 'Example 6(a): 9 cm, 40 cm, 41 cm. Is it a right triangle?' },
  b: { sides: [7, 9, 12], unit: 'm', ask: 'Example 6(b): 7 m, 9 m, 12 m. Is it a right triangle?' },
  c: { sides: [3.3, 5.6, 6.5], unit: 'ft', ask: 'Example 6(c): 3.3 ft, 5.6 ft, 6.5 ft. Is it a right triangle?' },
  d: { sides: [15, 9, 13], unit: 'in', ask: 'Example 6(d): 15 in, 9 in, 13 in. Is it a right triangle?' },
  br: { sides: [30, 40, 49], unit: 'cm', ask: 'Example 7: the bracket is 30 cm on the wall, 40 cm under the shelf, and the brace is 49 cm. Is the corner a right angle? How long should the brace be?' }
};
const test = {
  title: 'Is it a right triangle? Weigh a² + b² against c²',
  height: 450,
  choices: [{ sep: 'Example 6 check:' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }, { v: 'c', label: '(c)' }, { v: 'd', label: '(d)' }, { sep: 'Example 7:' }, { v: 'br', label: 'the bracket' }],
  value: 'a',
  ask: (k) => TEST[k].ask,
  make(stage, k, ex) {
    const W = ex.W, H = 450, ox = (W - 960) / 2, svg = stageSvg(stage, W, H), d = TEST[k], u = d.unit;
    const given = d.sides, sorted = given.slice().sort((p, q) => p - q), [a, b, c] = sorted;
    const a2 = rd(a * a), b2 = rd(b * b), sum = rd(a2 + b2), c2 = rd(c * c), cmp = Math.abs(sum - c2) < 1e-9 ? 0 : sum > c2 ? 1 : -1;
    const ang = Math.acos((a * a + b * b - c * c) / (2 * a * b)) / RAD;
    // the sticks
    const maxL = 330, sx = ox + 70, rowY = [44, 92, 140], Lsk = grp(svg);
    const sticks = given.map((v, i) => {
      const gg = grp(Lsk), w = (v / c) * maxL;
      const r = svgEl('rect', { x: sx, y: rowY[i] - 9, width: w.toFixed(1), height: 18, rx: 6, fill: WOOD, stroke: WOODD, 'stroke-width': 2.2 }, gg);
      const t = txt(gg, sx + w + 14, rowY[i], `${v} ${u}`, { size: 20, anchor: 'start' });
      const setY = (y) => { r.setAttribute('y', (y - 9).toFixed(1)); t.setAttribute('y', y.toFixed(1)); };
      return { gg, r, t, w, v, y: rowY[i], setY };
    });
    const order = given.map((v, i) => i).sort((p, q) => given[p] - given[q]);   // order[j] = index of the j-th smallest
    const tags = ['a', 'b', 'c'].map((s, j) => hide(txt(svg, sx - 30, rowY[j], s, { size: 24, italic: true, color: j === 2 ? SQC : INK, weight: 800 })));
    sticks.forEach((st) => { st.gg.style.opacity = 0; });
    // the balance
    const pv = [ox + 700, 230], Lb = 170, bal = grp(svg);
    path(bal, polyD([[pv[0], pv[1]], [pv[0] - 40, pv[1] + 190], [pv[0] + 40, pv[1] + 190]]), { stroke: SLATE, width: 3, fill: '#e7e3da', cls: '' });
    line(bal, [pv[0] - 90, pv[1] + 192], [pv[0] + 90, pv[1] + 192], { color: SLATE, width: 5, cls: '' });
    const beam = line(bal, [0, 0], [0, 0], { color: INK, width: 6, cls: '' });
    const strs = [0, 1].map(() => grp(bal)), pans = [0, 1].map(() => path(bal, '', { stroke: INK, width: 3, fill: '#fff', cls: '' }));
    dot(bal, pv, { r: 7, color: INK });
    const panL = hide(lab(stage, `<span class="u7l3-pt">a² + b²</span>${T(tn(sum))}`, 0, 0, 'u7l3-pan')), panR = hide(lab(stage, `<span class="u7l3-pt">c²</span>${T(tn(c2))}`, 0, 0, 'u7l3-pan'));
    const cmpT = hide(lab(stage, T(cmp === 0 ? `${tn(sum)}=${tn(c2)}` : cmp > 0 ? `${tn(sum)}>${tn(c2)}` : `${tn(sum)}<${tn(c2)}`), pv[0], 40, 'u7l3-eq ' + (cmp === 0 ? 'u7l3-good' : 'u7l3-redt')));
    let tilt = 0;
    const setTilt = (deg) => {
      tilt = deg; const cs = Math.cos(deg * RAD), sn = Math.sin(deg * RAD);
      const Le = [pv[0] - Lb * cs, pv[1] + Lb * sn], Re = [pv[0] + Lb * cs, pv[1] - Lb * sn];
      setLine(beam, Le, Re);
      [Le, Re].forEach((E, i) => {
        strs[i].innerHTML = ''; const by = E[1] + 70;
        line(strs[i], E, [E[0] - 52, by], { color: SLATE, width: 1.8, cls: '' }); line(strs[i], E, [E[0] + 52, by], { color: SLATE, width: 1.8, cls: '' });
        pans[i].setAttribute('d', `M${E[0] - 62} ${by}Q${E[0]} ${by + 30} ${E[0] + 62} ${by}Z`);
        moveLab(i ? panR : panL, E[0], by - 26);
      });
    };
    setTilt(0);
    // the real triangle (c along the bottom, the biggest angle at the top)
    const triG = grp(svg); triG.style.opacity = 0;
    { const x = (b * b - a * a + c * c) / (2 * c), y = Math.sqrt(Math.max(0, b * b - x * x)), F = fitBox([[0, 0], [c, 0], [x, y]], { x: ox + 20, y: 175, w: 420, h: 270 }, 34);
      const A0 = F.P([0, 0]), B0 = F.P([c, 0]), V = F.P([x, y]);
      path(triG, polyD([A0, B0, V]), { width: 3.2, fill: '#f3efe6', cls: '' });
      const C0 = cen([A0, B0, V]);
      sideLab(triG, A0, B0, C0, `${c}`, { size: 19, color: SQC }); sideLab(triG, B0, V, C0, `${a}`, { size: 19 }); sideLab(triG, A0, V, C0, `${b}`, { size: 19 });
      if (cmp === 0) rightMark(triG, V, A0, B0, 16, { color: GREEN });
      else {
        const d1 = Math.atan2(-(A0[1] - V[1]), A0[0] - V[0]) / RAD, d2 = Math.atan2(-(B0[1] - V[1]), B0[0] - V[0]) / RAD;
        path(triG, Geo.arcD(V, 30, Math.min(d1, d2), Math.abs(d2 - d1)), { stroke: RED, width: 3, cls: '' });
        txt(triG, V[0], V[1] - 22, `about ${Math.round(ang)}°`, { size: 18, color: RED });
      }
    }
    const verdict = cmp === 0 ? hStamp(stage, 'right triangle ✓', true, ox + 700, 140) : hStamp(stage, 'not a right triangle ✗', false, ox + 700, 140);
    const lastNote = given[2] !== c ? ` (not ${given[2]}, the last one written)` : '';
    const steps = [
      { cap: `The three sides: ${given.map((s) => s + ' ' + u).join(', ')}.`, run: async (cx) => { for (const st of sticks) await op(cx, st.gg, 1, 260); } },
      { cap: `Sort them. The <b>longest</b> side is <b>c = ${c} ${u}</b>${lastNote}.`, run: async (cx) => {
        const y0 = sticks.map((st) => st.y), y1 = sticks.map((st, i) => rowY[order.indexOf(i)]);
        await tween(cx, 700, (t) => sticks.forEach((st, i) => st.setY(y0[i] + (y1[i] - y0[i]) * t)));
        for (const tg of tags) { show(tg); } await cx.fadeIn(tags[2], 300, { from: 'none' });
        sticks[order[2]].r.setAttribute('fill', '#e3c08e'); await pulse(cx, sticks[order[2]].gg, 1.04, 400); } },
      { cap: `Square the two shorter sides and add: ${a}² + ${b}² = ${pn(a2)} + ${pn(b2)} = <b>${pn(sum)}</b>.`, run: (cx) => { show(panL); return cx.pop(panL); } },
      { cap: `Square the longest side: ${c}² = <b>${pn(c2)}</b>.`, run: (cx) => { show(panR); return cx.pop(panR); } },
      { cap: cmp === 0 ? `${pn(sum)} = ${pn(c2)}: the two sides <b>balance</b>.` : cmp > 0 ? `${pn(sum)} &gt; ${pn(c2)}: the a² + b² side is heavier.` : `${pn(sum)} &lt; ${pn(c2)}: the c² side is heavier.`,
        run: async (cx) => { await cx.pop(cmpT); if (cmp === 0) await pulse(cx, bal, 1.03, 500); else await tween(cx, 900, (t) => setTilt(cmp * 9 * t)); } },
      { cap: cmp === 0 ? 'Equal: it <b>is</b> a right triangle. The right angle is across from c ✓'
        : cmp > 0 ? `Not equal: <b>not</b> a right triangle. a² + b² is bigger, so the biggest angle is <b>less</b> than 90° (about ${Math.round(ang)}°).`
          : `Not equal: <b>not</b> a right triangle. a² + b² is smaller, so the biggest angle is <b>more</b> than 90° (about ${Math.round(ang)}°).`,
        run: async (cx) => { await stampIn(cx, verdict); triG.style.opacity = 1; await cx.fadeIn(triG, 500, { from: 'none' }); } }
    ];
    if (k === 'br') {
      const fx = hide(lab(stage, T('\\sqrt{2\\,500}=50\\text{ cm}'), ox + 700, 92, 'u7l3-eq u7l3-good'));
      steps[5].cap = 'Not equal, so the corner is <b>not</b> 90°. a² + b² is bigger: the corner is less than 90° (about 88°), and the shelf would tilt down.';
      steps.push({ cap: '(b) For a right angle the brace must be √2&#8239;500 = <b>50 cm</b> long.', run: (cx) => cx.pop(fx) });
    }
    return steps;
  }
};

/* ======================================================================================
 * 3b. The longest-side trap (Full)
 * ====================================================================================== */
const trap = {
  title: 'Watch out: c is the longest side, wherever it is written',
  height: 360,
  ask: 'A triangle has sides 8, 17 and 15. Is it a right triangle?',
  make(stage, v, ex) {
    const W = ex.W, ox = (W - 960) / 2;
    const nums = [8, 17, 15].map((n, i) => hide(lab(stage, String(n), ox + 380 + i * 100, 46, 'u7l3-num')));
    const col = (x, title, lines, cls) => hide(lab(stage, `<b class="u7l3-h">${title}</b>${lines.map((s) => T(s)).join('<br>')}`, x, 190, 'u7l3-col ' + cls));
    const L = col(ox + 240, 'Using the last one written, 15, as c', ['8^2+17^2=64+289=353', '15^2=225', '353\\ne225'], '');
    const R = col(ox + 720, 'Using the longest side, 17, as c', ['8^2+15^2=64+225=289', '17^2=289', '289=289'], '');
    const s1 = hStamp(stage, '“not right” ✗ wrong!', false, ox + 240, 315), s2 = hStamp(stage, 'right triangle ✓', true, ox + 720, 315);
    return [
      { cap: 'The sides are written <b>8, 17, 15</b>. Which one is c?', run: async (c) => { for (const n of nums) { show(n); await c.pop(n, 260); } } },
      { cap: 'Wrong way: the last number, 15, used as c. 353 is not 225, so it looks like it is <b>not</b> a right triangle.', run: async (c) => { show(L); await c.fadeIn(L, 400); await stampIn(c, s1); } },
      { cap: 'Right way: c = <b>17</b>, the longest side. 8² + 15² = 289 = 17². It <b>is</b> a right triangle ✓', run: async (c) => { nums[1].inner.classList.add('u7l3-on'); await pulse(c, nums[1], 1.15, 400); show(R); await c.fadeIn(R, 400); await stampIn(c, s2); } },
      { cap: 'Always sort first: <b>c is the longest side</b>, even when it is not written last.', run: (c) => pulse(c, R, 1.04, 500) }
    ];
  }
};

/* ======================================================================================
 * 4a. Squaring a deck corner with a tape measure (3-4-5; Example 8)
 * ====================================================================================== */
const ftIn = (dft) => { const ti = Math.round(dft * 12), f = Math.floor(ti / 12), i = ti - f * 12; return i ? `${f} ft ${i} in` : `${f} ft`; };
/** top view: board 1 along the bottom (fixed), board 2 hinged at the corner O, at angle phi (deg) from board 1.
 *  o: { x, y, w, h, s (px per ft), L1, L2 (board lengths), m1, m2 (marks on board 1 and 2), dims } */
function deckScene(parent, host, o) {
  const s = o.s, O = [o.x + 70, o.y + o.h - (o.bottom ?? 84)], g = grp(parent), bw = 20;
  const b1 = path(g, polyD([O, [O[0] + o.L1 * s, O[1]], [O[0] + o.L1 * s, O[1] + bw], [O[0] - bw, O[1] + bw]]), { stroke: WOODD, width: 2.4, fill: WOOD, cls: '' });
  for (let k = 1; k < 4; k++) line(g, [O[0] + 10, O[1] + k * 5], [O[0] + o.L1 * s - 6, O[1] + k * 5], { color: '#b07f45', width: 1, cls: '' });
  const b2 = path(g, '', { stroke: WOODD, width: 2.4, fill: WOOD, cls: '' });
  const arc = path(g, '', { stroke: AMBER, width: 2.6, cls: '' });
  const angT = txt(g, 0, 0, '', { size: 18, color: AMBER });
  const rmG = grp(g); rmG.style.opacity = 0;
  const M1 = [O[0] + o.m1 * s, O[1]];
  const mk1 = grp(g); line(mk1, [M1[0], O[1] - 4], [M1[0], O[1] + bw + 4], { color: RED, width: 3, cls: '' }); dot(mk1, M1, { r: 5, color: RED });
  const mk2 = grp(g), mk2l = line(mk2, [0, 0], [0, 0], { color: RED, width: 3, cls: '' }), mk2d = svgEl('circle', { r: 5, fill: RED }, mk2);
  const d1 = grp(g); line(d1, [O[0], O[1] + bw + 18], [M1[0], O[1] + bw + 18], { color: SLATE, width: 2, cls: '' }); line(d1, [O[0], O[1] + bw + 10], [O[0], O[1] + bw + 26], { color: SLATE, width: 2, cls: '' }); line(d1, [M1[0], O[1] + bw + 10], [M1[0], O[1] + bw + 26], { color: SLATE, width: 2, cls: '' });
  txt(d1, (O[0] + M1[0]) / 2, O[1] + bw + 36, `${o.m1} ft`, { size: 19 });
  const d2 = grp(g), d2t = txt(d2, 0, 0, `${o.m2} ft`, { size: 19 });
  const tape = grp(g); const tBand = line(tape, [0, 0], [0, 0], { color: TAPE, width: 10, cls: '' }), tMid = line(tape, [0, 0], [0, 0], { color: '#8a6212', width: 1.6, dash: '3 9', cls: '' });
  const tCase = svgEl('rect', { width: 30, height: 30, rx: 7, fill: '#e0a21a', stroke: '#6b4a00', 'stroke-width': 2.5 }, tape);
  const read = lab(host, '', 0, 0, 'u7l3-read');
  let phi = 90, M2 = O;
  function set(p) {
    phi = p; const u = [Math.cos(p * RAD), -Math.sin(p * RAD)], n = [Math.cos((p + 90) * RAD), -Math.sin((p + 90) * RAD)];
    const E = [O[0] + u[0] * o.L2 * s, O[1] + u[1] * o.L2 * s];
    b2.setAttribute('d', polyD([O, E, [E[0] + n[0] * bw, E[1] + n[1] * bw], [O[0] + n[0] * bw, O[1] + n[1] * bw]]));
    arc.setAttribute('d', Geo.arcD(O, 44, 0, p)); const am = [O[0] + Math.cos(p / 2 * RAD) * 72, O[1] - Math.sin(p / 2 * RAD) * 72];
    angT.setAttribute('x', am[0].toFixed(1)); angT.setAttribute('y', am[1].toFixed(1)); angT.textContent = `${(Math.round(p * 10) / 10).toFixed(Math.abs(p - Math.round(p)) < 0.05 ? 0 : 1)}°`;
    M2 = [O[0] + u[0] * o.m2 * s, O[1] + u[1] * o.m2 * s];
    setLine(mk2l, [M2[0] + n[0] * -4, M2[1] + n[1] * -4], [M2[0] + n[0] * (bw + 4), M2[1] + n[1] * (bw + 4)]); mk2d.setAttribute('cx', M2[0].toFixed(1)); mk2d.setAttribute('cy', M2[1].toFixed(1));
    const dm = [O[0] + u[0] * o.m2 * s * 0.5 + n[0] * (bw + 30), O[1] + u[1] * o.m2 * s * 0.5 + n[1] * (bw + 30)]; d2t.setAttribute('x', dm[0].toFixed(1)); d2t.setAttribute('y', dm[1].toFixed(1));
    setLine(tBand, M1, M2); setLine(tMid, M1, M2); tCase.setAttribute('x', (M1[0] - 6).toFixed(1)); tCase.setAttribute('y', (M1[1] - 34).toFixed(1));
    const dft = Math.sqrt(o.m1 * o.m1 + o.m2 * o.m2 - 2 * o.m1 * o.m2 * Math.cos(p * RAD));
    read.inner.textContent = ftIn(dft);
    const mid = lerp(M1, M2, 0.5), nn = unit([-(M2[1] - M1[1]), M2[0] - M1[0]]); moveLab(read, mid[0] + nn[0] * 58, mid[1] + nn[1] * 58);
  }
  rightMark(rmG, O, [O[0] + 10, O[1]], [O[0], O[1] - 10], 20, { color: GREEN, width: 3 });
  return { g, set, get phi() { return phi; }, O, mk1, mk2, d1, d2, tape, read, rmG, diag: (p) => Math.sqrt(o.m1 * o.m1 + o.m2 * o.m2 - 2 * o.m1 * o.m2 * Math.cos(p * RAD)) };
}
/** the corner angle that makes the tape read a given diagonal */
const phiFor = (m1, m2, dft) => Math.acos((m1 * m1 + m2 * m2 - dft * dft) / (2 * m1 * m2)) / RAD;
const deck = {
  title: 'Squaring a corner with a tape measure',
  height: 460,
  choices: [{ v: '345', label: '3-4-5 (ft)' }, { sep: 'Example 8 check:' }, { v: 'ex8', label: 'Mateo’s 6-8-10' }],
  value: '345',
  ask: (k) => (k === '345' ? 'Two boards meet at a corner. Is the corner square (90°)? Use a tape measure and 3-4-5.' : 'Example 8: Mateo marks 6 ft and 8 ft from the corner. The diagonal is 10 ft 2 in. What should it be? Is the corner square?'),
  make(stage, k, ex) {
    const W = ex.W, H = 460, ox = (W - 960) / 2, svg = stageSvg(stage, W, H);
    const big = k === 'ex8', m1 = big ? 8 : 4, m2 = big ? 6 : 3, dg = big ? 10 : 5;
    const D = deckScene(svg, stage, { x: ox, y: 0, w: 560, h: H, s: big ? 34 : 64, L1: big ? 10.6 : 5.4, L2: big ? 9 : 4.8, m1, m2 });
    const p0 = big ? phiFor(8, 6, 10 + 2 / 12) : 98, pShort = phiFor(4, 3, 4 + 8 / 12);
    D.set(p0); hide(D.mk1, D.mk2, D.d1, D.d2, D.tape, D.read);
    const px = ox + 600, E = (html, y, cls = '') => hide(lab(stage, html, px, y, 'u7l3-eq u7l3-left ' + cls));
    const sq = hStamp(stage, 'square corner ✓', true, px + 170, 380);
    const tapeIn = async (c) => { show(D.tape); await c.fadeIn(D.tape, 500, { from: 'none' }); show(D.read); await c.pop(D.read); };
    const swing = (c, a, b, ms = 1500) => tween(c, ms, (t) => D.set(a + (b - a) * t));
    if (!big) {
      const L1 = E(T('3^2+4^2=9+16=25=5^2'), 330, 'u7l3-good');
      const n1 = E(`<b>${ftIn(D.diag(p0))}</b>: too long (over 90°)`, 60, 'u7l3-redt'), n2 = E(`<b>${ftIn(D.diag(pShort))}</b>: too short (under 90°)`, 130, 'u7l3-redt'), n3 = E('<b>5 ft</b> exactly: 90°', 200, 'u7l3-good');
      return [
        { cap: 'Step 1. From the corner, measure <b>3 ft</b> along one board and make a mark.', run: async (c) => { show(D.mk2, D.d2); await c.pop(D.mk2); await c.fadeIn(D.d2, 300, { from: 'none' }); } },
        { cap: 'Step 2. Measure <b>4 ft</b> along the other board and make a mark.', run: async (c) => { show(D.mk1, D.d1); await c.pop(D.mk1); await c.fadeIn(D.d1, 300, { from: 'none' }); } },
        { cap: `Step 3. Measure the diagonal between the marks. It reads <b>${ftIn(D.diag(p0))}</b>: too long, so the corner is more than 90°.`, run: async (c) => { await tapeIn(c); await c.pop(n1); } },
        { cap: `Push the boards closer together. Oops, too far: <b>${ftIn(D.diag(pShort))}</b> is too short, so the corner is less than 90°.`, run: async (c) => { await swing(c, p0, pShort); await c.pop(n2); } },
        { cap: 'Open them up a little until the tape reads exactly <b>5 ft</b>. Now the corner is square ✓', run: async (c) => { await swing(c, pShort, 90, 1100); show(D.rmG); await c.fadeIn(D.rmG, 300, { from: 'none' }); await c.pop(n3); await stampIn(c, sq); } },
        { cap: 'Why it works: 3² + 4² = 9 + 16 = 25 = 5². Only a 90° corner makes the diagonal exactly 5.', run: (c) => c.pop(L1) }
      ];
    }
    const L1 = E(T('6^2+8^2=36+64=100=10^2'), 60), L2 = E('should be <b>10 ft</b> (3-4-5 × 2)', 120, 'u7l3-good'), L3 = E('<b>10 ft 2 in</b>: too long (over 90°)', 200, 'u7l3-redt');
    return [
      { cap: 'Mateo marks <b>6 ft</b> along one rim board and <b>8 ft</b> along the other.', run: async (c) => { show(D.mk1, D.mk2, D.d1, D.d2); await c.pop(D.mk2); await c.pop(D.mk1); } },
      { cap: '(a) For a square corner: 6² + 8² = 36 + 64 = 100 = 10². The diagonal should be <b>10 ft</b> (6-8-10 is 3-4-5 times 2).', run: async (c) => { await c.pop(L1); await c.pop(L2); } },
      { cap: '(b) The tape reads <b>10 ft 2 in</b>: too long. The corner is more than 90° (about 92°).', run: async (c) => { await tapeIn(c); await c.pop(L3); } },
      { cap: 'Push the boards a little closer together until the tape reads 10 ft. Now the corner is square ✓', run: async (c) => { await swing(c, p0, 90, 1300); show(D.rmG); await c.fadeIn(D.rmG, 300, { from: 'none' }); await stampIn(c, sq); } }
    ];
  }
};

/* ======================================================================================
 * 4b. Why a bigger triangle is more accurate (Full)
 * ====================================================================================== */
const bigger = {
  title: 'The same 1-inch mistake on a small and a big triangle',
  height: 380,
  ask: 'The tape is off by 1 inch. How far out is the corner with a 3-4-5 triangle? With a 9-12-15 triangle?',
  make(stage, v, ex) {
    const W = ex.W, H = 380, ox = (W - 960) / 2, svg = stageSvg(stage, W, H);
    const cases = [{ m1: 4, m2: 3, d: 5 + 1 / 12, name: '3-4-5', reads: '5 ft 1 in' }, { m1: 12, m2: 9, d: 15 + 1 / 12, name: '9-12-15', reads: '15 ft 1 in' }];
    const panels = cases.map((cs, i) => {
      const x0 = ox + 20 + i * 480, O = [x0 + 70, 300], Lb = 230, g = grp(svg);
      const err = phiFor(cs.m1, cs.m2, cs.d) - 90, gap = 144 * Math.sin(err * RAD);
      txt(g, x0 + 210, 24, `${cs.name}: the tape reads ${cs.reads}`, { size: 19, weight: 700 });
      line(g, O, [O[0] + 330, O[1]], { color: WOODD, width: 9, cls: '' });
      line(g, O, [O[0], O[1] - Lb], { color: GREEN, width: 2.4, dash: '8 6', cls: '' });
      txt(g, O[0] - 2, O[1] - Lb - 14, 'square (90°)', { size: 15, color: GREEN });
      const b = line(g, O, [O[0], O[1] - Lb], { color: WOODD, width: 9, cls: '' });
      const note = hide(txt(g, x0 + 250, 120, '', { size: 19, color: RED }));
      const note2 = hide(txt(g, x0 + 250, 150, '', { size: 19, color: RED }));
      txt(g, O[0] + 165, O[1] + 26, '12 ft boards (angle drawn to scale)', { size: 13, color: GREY });
      return { g, O, Lb, b, err, gap, note, note2, set(t) { const p = 90 + err * t, u = [Math.cos(p * RAD), -Math.sin(p * RAD)]; setLine(b, O, [O[0] + u[0] * Lb, O[1] + u[1] * Lb]); } };
    });
    panels[0].note.textContent = `about ${(90 + panels[0].err).toFixed(0)}°: ${panels[0].err.toFixed(0)}° off`;
    panels[0].note2.textContent = `about ${Math.round(panels[0].gap)} in out at 12 ft`;
    panels[1].note.textContent = `about ${(90 + panels[1].err).toFixed(1)}°: under 1° off`;
    panels[1].note2.textContent = `under ${Math.ceil(panels[1].gap)} in out at 12 ft`;
    const st = hStamp(stage, 'bigger is better ✓', true, ox + 300, 235);
    return [
      { cap: 'Same mistake on both: the tape is <b>1 inch</b> too long.', run: (c) => Promise.all(panels.map((p) => pulse(c, p.b, 1.02, 400))) },
      { cap: `Small triangle (3-4-5): the corner is about ${(90 + panels[0].err).toFixed(0)}°. At the end of a 12 ft board it is about <b>${Math.round(panels[0].gap)} in</b> out!`, run: async (c) => { await tween(c, 1000, (t) => panels[0].set(t)); show(panels[0].note, panels[0].note2); await c.fadeIn(panels[0].note, 300, { from: 'none' }); } },
      { cap: `Big triangle (9-12-15): about ${(90 + panels[1].err).toFixed(1)}°, under 1° off. At 12 ft it is under <b>${Math.ceil(panels[1].gap)} in</b> out.`, run: async (c) => { await tween(c, 1000, (t) => panels[1].set(t)); show(panels[1].note, panels[1].note2); await c.fadeIn(panels[1].note, 300, { from: 'none' }); } },
      { cap: 'On a long diagonal, a small measuring error matters less. Use the <b>biggest</b> triangle that fits the job.', run: (c) => stampIn(c, st) }
    ];
  }
};

/* ======================================================================================
 * 4c. A rectangle's diagonals must be equal (Example 9)
 * ====================================================================================== */
const diag = {
  title: 'A rectangle check: the two diagonals must be equal',
  height: 420,
  choices: [{ sep: 'Example 9 check:' }, { v: 'a', label: '(a) the diagonal' }, { v: 'b', label: '(b) 2.71 m and 2.65 m' }],
  value: 'a',
  ask: (k) => (k === 'a' ? 'Example 9(a): the frame should be a rectangle 1.2 m by 2.4 m. How long should each diagonal be?' : 'Example 9(b): the diagonals measure 2.71 m and 2.65 m. Is the frame a rectangle with square corners? What should Noor do?'),
  make(stage, k, ex) {
    const W = ex.W, H = 420, ox = (W - 960) / 2, svg = stageSvg(stage, W, H), s = 185, O = [ox + 60, 330], wA = 2.4, hA = 1.2;
    const g = grp(svg), fillT = path(g, '', { stroke: 'none', fill: BLUE, fo: 0.12, cls: '' }), frame = path(g, '', { stroke: WOODD, width: 12, fill: '#f6ecd9', cls: '' });
    const inner = path(g, '', { stroke: WOOD, width: 7, cls: '' });
    const dg1 = line(g, [0, 0], [0, 0], { color: RED, width: 3, dash: '10 7', cls: '' }), dg2 = line(g, [0, 0], [0, 0], { color: BLUE, width: 3, dash: '10 7', cls: '' });
    const t1 = lab(stage, '', 0, 0, 'u7l3-eq u7l3-box'), t2 = lab(stage, '', 0, 0, 'u7l3-eq u7l3-box');
    t1.inner.style.color = RED; t2.inner.style.color = BLUE;
    txt(g, O[0] + wA * s / 2, O[1] + 34, '2.4 m', { size: 20 });
    const hT = txt(g, O[0] - 34, O[1] - hA * s / 2, '1.2 m', { size: 20 });
    const angT = txt(g, O[0] + 46, O[1] - 26, '', { size: 17, color: AMBER });
    const drawPhi = (p) => 90 - (90 - p) * 5;          // the push is drawn 5 times bigger than it really is
    let real = 90;
    const set = (p) => {
      real = p; const q = drawPhi(p) * RAD, up = [Math.cos(q) * hA * s, -Math.sin(q) * hA * s];
      const A = O, B = [O[0] + wA * s, O[1]], C = [B[0] + up[0], B[1] + up[1]], D = [O[0] + up[0], O[1] + up[1]];
      frame.setAttribute('d', polyD([A, B, C, D])); inner.setAttribute('d', polyD([A, B, C, D]));
      fillT.setAttribute('d', polyD([A, B, C])); setLine(dg1, A, C); setLine(dg2, B, D);
      hT.setAttribute('x', (D[0] / 2 + A[0] / 2 - 36).toFixed(1));
      const pr = p * RAD, d1 = Math.sqrt(wA * wA + hA * hA + 2 * wA * hA * Math.cos(pr)), d2 = Math.sqrt(wA * wA + hA * hA - 2 * wA * hA * Math.cos(pr));
      t1.inner.innerHTML = `${d1.toFixed(2)} m`; t2.inner.innerHTML = `${d2.toFixed(2)} m`;
      const P1 = lerp(A, C, 0.78), P2 = lerp(B, D, 0.78); moveLab(t1, P1[0] + 6, P1[1] + 30); moveLab(t2, P2[0] - 6, P2[1] + 30);
      angT.textContent = Math.abs(p - 90) < 0.05 ? '' : `${p.toFixed(1)}°`;
    };
    const px = ox + 600, E = (html, y, cls = '') => hide(lab(stage, html, px, y, 'u7l3-eq u7l3-left ' + cls));
    if (k === 'a') {
      set(90); hide(fillT, dg1, dg2, t1, t2);
      const L1 = E(T('d^2=1.2^2+2.4^2'), 70), L2 = E(T('d^2=1.44+5.76=7.2'), 130), L3 = E(T(`d=\\sqrt{7.2}=${dots(Math.sqrt(7.2))}`), 190), L4 = E(T('d\\approx2.68\\text{ m}'), 250, 'u7l3-good');
      const st = hStamp(stage, 'both 2.68 m ✓', true, px + 140, 340);
      return [
        { cap: 'Noor’s frame should be a rectangle: <b>2.4 m by 1.2 m</b>.', run: (c) => pulse(c, frame, 1.02, 500) },
        { cap: 'A diagonal cuts the rectangle into two right triangles. The diagonal is the <b>hypotenuse</b>.', run: async (c) => { show(fillT, dg1); await c.fadeIn(fillT, 400, { from: 'none' }); await drawIn(dg1, 600, c); } },
        { cap: 'Add the squares of the legs: d² = 1.2² + 2.4² = 1.44 + 5.76 = 7.2.', run: async (c) => { await c.pop(L1); await c.pop(L2); } },
        { cap: `d = √7.2 = ${dotsP(Math.sqrt(7.2))} ≈ <b>2.68 m</b> (to the nearest centimetre).`, run: async (c) => { await c.pop(L3); await c.pop(L4); show(t1); await c.pop(t1); } },
        { cap: 'In a rectangle, the other diagonal is the same length: both should be <b>2.68 m</b>.', run: async (c) => { await op(c, fillT, 0, 300); show(dg2); await drawIn(dg2, 600, c); show(t2); await c.pop(t2); await stampIn(c, st); } }
      ];
    }
    const p0 = Math.acos((2.71 * 2.71 - 2.65 * 2.65) / (4 * wA * hA)) / RAD;
    set(p0); hide(fillT);
    const note = hide(txt(svg, ox + 290, 24, '(the push is drawn bigger than it really is)', { size: 15, color: GREY }));
    const L1 = E(`${T('2.71\\ne2.65')}: not equal`, 70, 'u7l3-redt'), L2 = E('push the <b>longer</b> one’s ends in', 140), L3 = E(`${T('2.68=2.68')}: square corners`, 230, 'u7l3-good');
    const s1 = hStamp(stage, 'not square ✗', false, px + 150, 320), s2 = hStamp(stage, 'square corners ✓', true, px + 150, 320);
    const arrows = grp(svg); arrows.style.opacity = 0;
    { const q = drawPhi(p0) * RAD, A = O, C = [O[0] + wA * s + Math.cos(q) * hA * s, O[1] - Math.sin(q) * hA * s], u = unit(sub(C, A));
      const arr = (P, dir) => { const Q = [P[0] + dir[0] * 46, P[1] + dir[1] * 46]; line(arrows, [P[0] - dir[0] * 10, P[1] - dir[1] * 10], Q, { color: AMBER, width: 5, cls: '' }); const n = [-dir[1], dir[0]]; path(arrows, polyD([[Q[0] + dir[0] * 14, Q[1] + dir[1] * 14], [Q[0] + n[0] * 10, Q[1] + n[1] * 10], [Q[0] - n[0] * 10, Q[1] - n[1] * 10]]), { stroke: AMBER, fill: AMBER, width: 2, cls: '' }); };
      arr([A[0] - u[0] * 50, A[1] - u[1] * 50], u); arr([C[0] + u[0] * 50, C[1] + u[1] * 50], [-u[0], -u[1]]); }
    return [
      { cap: 'Noor measures the two diagonals: <b>2.71 m</b> and <b>2.65 m</b>.', run: async (c) => { show(note); await c.fadeIn(note, 300, { from: 'none' }); await pulse(c, t1, 1.15, 400); await pulse(c, t2, 1.15, 400); } },
      { cap: 'They are <b>not equal</b>, so the corners are not square: the frame has been pushed over.', run: async (c) => { await c.pop(L1); await stampIn(c, s1); } },
      { cap: 'Push the two corners at the ends of the <b>longer</b> diagonal (2.71 m) toward each other…', run: async (c) => { await op(c, s1, 0, 200); arrows.style.opacity = 1; await c.fadeIn(arrows, 300, { from: 'none' }); await c.pop(L2); await tween(c, 1600, (t) => set(p0 + (90 - p0) * t)); await op(c, arrows, 0, 300); } },
      { cap: '…until both diagonals measure about <b>2.68 m</b>. Now the corners are square ✓', run: async (c) => { await c.pop(L3); await stampIn(c, s2); } }
    ];
  }
};

mountExplainers({ takeAway, leg, ladder, kite, two, test, trap, deck, bigger, diag });

/* ======================================================================================
 * Static figures on the cards
 * ====================================================================================== */
const FIG = {
  sq(host) {
    const W = 300, H = 290, s = figSvg(host, W, H), G = squaresGeom(4, 3), F = fitBox(G.all, { x: 0, y: 0, w: W, h: H }, 8), P = F.P;
    path(s, polyD(G.sqC.map(P)), { stroke: INK, width: 2, fill: '#e9e6df', cls: '' });
    path(s, polyD(G.sqA.map(P)), { stroke: INK, width: 2, fill: '#cfcac0', cls: '' });
    path(s, polyD(G.sqB.map(P)), { stroke: INK, width: 2, fill: '#dcd8cf', cls: '' });
    path(s, polyD([P(G.C), P(G.A), P(G.B)]), { stroke: INK, width: 4, fill: '#fff', cls: '' });
    rightMark(s, P(G.C), P(G.A), P(G.B), 10);
    [[G.sqC, '25'], [G.sqA, '16'], [G.sqB, '9']].forEach(([q, t]) => { const cc = cen(q.map(P)); txt(s, cc[0], cc[1], t, { size: 24, weight: 800 }); });
  },
  ex1a: (host) => drawTri(figSvg(host, 200, 250), TRIS.e1a, { x: 0, y: 0, w: 200, h: 250 }, { size: 19, pad: 34 }),
  ex1b: (host) => drawTri(figSvg(host, 330, 250), TRIS.e1b, { x: 0, y: 0, w: 330, h: 250 }, { size: 19, pad: 44 }),
  ex2a: (host) => drawTri(figSvg(host, 250, 220), TRIS.e2a, { x: 0, y: 0, w: 250, h: 220 }, { size: 19, pad: 30 }),
  ex2b: (host) => drawTri(figSvg(host, 290, 190), TRIS.e2b, { x: 0, y: 0, w: 290, h: 190 }, { size: 19, pad: 36 }),
  ex2c: (host) => drawTri(figSvg(host, 330, 190), TRIS.e2c, { x: 0, y: 0, w: 330, h: 190 }, { size: 19, pad: 36 }),
  ex3(host) {
    const S = ladderScene(figSvg(host, 230, 300), host, { x: 0, y: 0, w: 230, h: 300, s: 34, L: 7.3, wallTop: 7.2, bottom: 40 }); S.set(1.8);
  },
  ex4(host) { kiteScene(figSvg(host, 330, 300), { x: 0, y: 0, w: 330, h: 300, run: 180, rise: 172, hand: 36 }); },
  ex5(host) { twoScene(figSvg(host, 360, 300), { x: 0, y: 0, w: 360, h: 300 }, { size: 18, pad: 30 }); },
  ex7(host) {
    const s = figSvg(host, 300, 270), wx = 70, top = 70, sc = 5.2;
    svgEl('rect', { x: wx - 22, y: 14, width: 22, height: 246, fill: '#e3ddd0' }, s);
    for (let y = 18; y < 258; y += 14) line(s, [wx - 22, y + 12], [wx - 4, y], { color: '#b9b2a4', width: 1.4, cls: '' });
    line(s, [wx, 14], [wx, 260], { width: 3 });
    svgEl('rect', { x: wx, y: top - 16, width: 46 * sc, height: 16, fill: '#e8cfa6', stroke: WOODD, 'stroke-width': 2 }, s);
    const A = [wx, top], B = [wx + 40 * sc, top], C = [wx, top + 30 * sc];
    path(s, polyD([C, A, B]), { width: 5, stroke: '#4b5263', cls: '' }); line(s, C, B, { width: 4, color: '#4b5263', cls: '' });
    txt(s, wx - 28, top + 15 * sc, '30 cm', { size: 17, anchor: 'end' });
    txt(s, wx + 20 * sc, top - 30, '40 cm', { size: 17 });
    txt(s, wx + 20 * sc + 30, top + 15 * sc + 20, '49 cm', { size: 17 });
  },
  corner(host) {
    const s = figSvg(host, 300, 250), O = [60, 210], sc = 50, bw = 16;
    svgEl('rect', { x: O[0] - bw, y: O[1], width: 5.2 * sc + bw, height: bw, fill: WOOD, stroke: WOODD, 'stroke-width': 2 }, s);
    svgEl('rect', { x: O[0] - bw, y: O[1] - 3.9 * sc, width: bw, height: 3.9 * sc, fill: WOOD, stroke: WOODD, 'stroke-width': 2 }, s);
    const M1 = [O[0] + 4 * sc, O[1]], M2 = [O[0], O[1] - 3 * sc];
    dot(s, M1, { r: 5, color: RED }); dot(s, M2, { r: 5, color: RED });
    line(s, M1, M2, { color: INK, width: 2.6, dash: '8 6', cls: '' });
    line(s, [O[0], O[1] + bw + 12], [M1[0], O[1] + bw + 12], { color: SLATE, width: 2, cls: '' }); txt(s, (O[0] + M1[0]) / 2, O[1] + bw + 26, '4 ft', { size: 18 });
    line(s, [O[0] - bw - 12, O[1]], [O[0] - bw - 12, M2[1]], { color: SLATE, width: 2, cls: '' }); txt(s, O[0] - bw - 34, (O[1] + M2[1]) / 2, '3 ft', { size: 18 });
    txt(s, (M1[0] + M2[0]) / 2 + 28, (M1[1] + M2[1]) / 2 - 14, '5 ft?', { size: 19, weight: 800, color: RED });
  },
  ex9(host) {
    const s = figSvg(host, 320, 200), O = [50, 150], sc = 105;
    path(s, polyD([O, [O[0] + 2.4 * sc, O[1]], [O[0] + 2.4 * sc, O[1] - 1.2 * sc], [O[0], O[1] - 1.2 * sc]]), { stroke: WOODD, width: 6, fill: '#f6ecd9', cls: '' });
    line(s, O, [O[0] + 2.4 * sc, O[1] - 1.2 * sc], { color: INK, width: 2.2, dash: '8 6', cls: '' }); line(s, [O[0], O[1] - 1.2 * sc], [O[0] + 2.4 * sc, O[1]], { color: INK, width: 2.2, dash: '8 6', cls: '' });
    txt(s, O[0] + 1.2 * sc, O[1] + 24, '2.4 m', { size: 18 }); txt(s, O[0] - 30, O[1] - 0.6 * sc, '1.2 m', { size: 18 });
  }
};
document.querySelectorAll('.u7l3-fig[data-fig]').forEach((host) => { const f = FIG[host.dataset.fig]; if (f) f(host); });

/* ======================================================================================
 * Stand Up Break
 * ====================================================================================== */
const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41], [12, 35, 37]];
standup('u7l3', {
  intro: 'Sketch the triangle. Find the hypotenuse first. Leg or hypotenuse? Then add or subtract.',
  levels: {
    BEG: (r) => {
      const [p, q, h0] = r.pick(TRIPLES), k = h0 * 3 <= 60 ? r.pick([1, 2, 3]) : h0 * 2 <= 60 ? r.pick([1, 2]) : 1, a = p * k, b = q * k, c = h0 * k;
      const giveA = r.chance(0.5), known = giveA ? a : b, want = giveA ? b : a;
      return { text: `A right triangle has a <b>hypotenuse of ${c} cm</b> and one <b>leg of ${known} cm</b>. Find the other leg.`, q: '',
        a: [`x^2=${c}^2-${known}^2`, `=${tn(c * c)}-${tn(known * known)}=${tn(want * want)}`, `x=\\sqrt{${tn(want * want)}}=${want}\\text{ cm}`] };
    },
    PRG: (r) => r.pick([
      () => {
        const L = r.int(40, 90) / 10, d = r.int(8, Math.round(L * 4)) / 10, h2 = rd(L * L - d * d), hv = Math.sqrt(h2);
        return { text: `A <b>${L} m</b> ladder leans against a wall. Its foot is <b>${d} m</b> from the wall. How high up the wall does it reach, to the nearest tenth?`, q: '',
          a: [`h^2=${L}^2-${d}^2=${rd(L * L)}-${rd(d * d)}=${h2}`, `h=\\sqrt{${h2}}=${dots(hv)}\\approx${hv.toFixed(1)}\\text{ m}`] };
      },
      () => {
        const c = r.int(12, 40), k = r.int(3, c - 3), x2 = c * c - k * k, xv = Math.sqrt(x2);
        return { text: `A right triangle has a <b>hypotenuse of ${c} ft</b> and one <b>leg of ${k} ft</b>. Find the other leg, to the nearest tenth.`, q: '',
          a: [`x^2=${c}^2-${k}^2=${tn(c * c)}-${tn(k * k)}=${tn(x2)}`, `x=\\sqrt{${tn(x2)}}=${dots(xv)}\\approx${xv.toFixed(1)}\\text{ ft}`] };
      }
    ])(),
    MAS: (r) => {
      const [p, q, h0] = r.pick(TRIPLES), k = r.pick([1, 2, 3]), tw = r.pick([0, 0, 1, -1]), a = p * k, b = q * k, c = h0 * k + tw;
      const sides = r.shuffle([a, b, c]), s2 = a * a + b * b, c2 = c * c;
      const verdict = s2 === c2 ? '\\text{equal: a right triangle}' : s2 > c2 ? '\\text{bigger: not right, angle}<90^\\circ' : '\\text{smaller: not right, angle}>90^\\circ';
      return { text: `A triangle has sides <b>${sides.join(' cm, ')} cm</b>. Is it a right triangle? If not, is its biggest angle more or less than 90°?`, q: '',
        a: [`c=${c}\\ (\\text{the longest})`, `${a}^2+${b}^2=${tn(a * a)}+${tn(b * b)}=${tn(s2)}`, `${c}^2=${tn(c2)}`, verdict] };
    }
  }
});
