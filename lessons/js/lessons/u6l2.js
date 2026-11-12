/* Math 10-3 · Unit 6 · Lesson 2 — Are They Similar? Checking Angles and Side Ratios.
 * Explainers (Class view unless marked Full): matching corresponding parts when one shape is turned or flipped; the
 * similarity tester (match, Test 1 angles, Test 2 ratios, stamps; Example 1 and Example 2 checks); flipping one ratio
 * (Full); a shape that grows and shrinks with fixed angles, then stretches; missing angles with a sum bar (Example 3
 * checks); a photo blown up to fill a print, fitting or cropped (Example 4 checks); boxes and cans (Full, Example 6);
 * the tester on a square and a rectangle and on Example 7 (Full); a mat border and Owen's mistake (Example 8 checks);
 * regular polygons (Example 9 checks). Also the hands-on print resizer, the static figures and the Stand Up Break. */
import { h, add, tex, svgEl, tween, anim, stamp, stampIn, pulse, mountExplainers } from '../blocks.js';
import { Geo } from '../geo.js';
import { standup } from '../standup.js';

const A = Geo.at, dirTo = Geo.dirTo, n360 = Geo.n360, arcD = Geo.arcD, dist = Geo.dist;
const INK = '#1c2230', GREEN = '#12805a', RED = '#c93a33', BROWN = '#9a6a24', GREY = '#9aa0ab', SLATE = '#5d6575';
const MC = Geo.MATCH_COLORS;                 // vertex i: MC[i]; side i: MC[4 + i]
const VC = (i) => MC[i % 4], SC = (i) => MC[4 + (i % 4)];
const T = (s) => tex(String(s));
const RAD = Math.PI / 180;
const r2 = (v) => Math.round(v * 100) / 100;
const f2 = (p) => r2(p[0]) + ' ' + r2(p[1]);
/** a number for display: at most dp places, trailing zeros dropped */
const fm = (v, dp = 3) => String(Math.round(v * 10 ** dp) / 10 ** dp);
/** "9\div6=1.5" or "4\div3\approx1.33" */
function divTex(a, b) {
  const q = a / b, exact = Math.abs(q * 1000 - Math.round(q * 1000)) < 1e-6;
  return `${fm(a)}\\div${fm(b)}${exact ? '=' + fm(q) : '\\approx' + q.toFixed(2)}`;
}
const q2 = (a, b) => Math.round((a / b) * 1000) / 1000;
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const op = (c, el, to, ms = 350) => anim(c, el, [{ opacity: to }], ms);
const pp = (el) => { el.style.transformBox = 'fill-box'; el.style.transformOrigin = 'center'; return el; };
const stageSvg = (stage, W, H) => add(stage, svgEl('svg', { class: 'u6l2-svg', width: W, height: H, viewBox: `0 0 ${W} ${H}` }), 0, 0);
const figSvg = (host, W, H) => { host.style.width = W + 'px'; host.style.height = H + 'px'; return svgEl('svg', { class: 'geo-svg u6l2-svg', width: W, height: H, viewBox: `0 0 ${W} ${H}` }, host); };
/** an HTML label centred on (x, y): a 0×0 holder (so c.pop's scale doesn't undo the centring) */
function lab(host, html, x, y, cls = '') {
  const hold = h('div', 'u6l2-hold'); hold.appendChild(h('div', 'u6l2-lab ' + cls, html)); add(host, hold, x, y); hold.inner = hold.firstChild; return hold;
}
function path(parent, d, o = {}) {
  return svgEl('path', { d, fill: o.fill || 'none', 'fill-opacity': o.fo ?? null, stroke: o.stroke === undefined ? INK : o.stroke, 'stroke-width': o.width || 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-dasharray': o.dash || null, class: o.cls === undefined ? 'bk-stroke' : o.cls, opacity: o.opacity ?? null }, parent);
}
const polyD = (P) => 'M' + P.map(f2).join('L') + 'Z';
const txt = (parent, x, y, s, o = {}) => Geo.text(parent, x, y, s, Object.assign({ size: 20 }, o));
const setXY = (t, p) => { t.setAttribute('x', r2(p[0])); t.setAttribute('y', r2(p[1])); };
const cen = (P) => [P.reduce((s, p) => s + p[0], 0) / P.length, P.reduce((s, p) => s + p[1], 0) / P.length];

/* ---------------- polygons ---------------- */
/** interior corner at vertex i of a convex polygon (screen px): { start, span } in math degrees */
function corner(P, i) {
  const n = P.length, V = P[i], d1 = dirTo(V, P[(i + 1) % n]), d2 = dirTo(V, P[(i + n - 1) % n]);
  const sp = n360(d2 - d1);
  return sp > 180 ? { start: d2, span: 360 - sp } : { start: d1, span: sp };
}
function markD(V, cn, r) {
  if (Math.abs(cn.span - 90) < 0.6) {
    const s = Math.min(r * 0.7, 15), u = A([0, 0], cn.start, 1), v = A([0, 0], cn.start + 90, 1);
    return `M${f2([V[0] + u[0] * s, V[1] + u[1] * s])}L${f2([V[0] + (u[0] + v[0]) * s, V[1] + (u[1] + v[1]) * s])}L${f2([V[0] + v[0] * s, V[1] + v[1] * s])}`;
  }
  return arcD(V, r, cn.start, cn.span);
}
/** a polygon with live labels. P: screen points. o: names, sides (labels), angs (labels), sideCol (fn|colour), angCol,
 *  nameCol, fill, width, size, r, arcs (false = none), sideLabCol (false = ink) → { g, sides, arcs, angLabs, sideLabs, names, set(P), P } */
function polyFig(parent, P, o = {}) {
  const n = P.length, g = svgEl('g', {}, parent), size = o.size || 19;
  const colOf = (v, i, d) => (typeof v === 'function' ? v(i) : v || d);
  const fill = path(g, '', { fill: o.fill || '#fbf6ec', stroke: 'none', cls: '' });
  const sides = P.map((_, i) => path(g, '', { stroke: colOf(o.sideCol, i, INK), width: o.width || 3.4, cls: '' }));
  const arcs = P.map((_, i) => (o.arcs === false ? null : path(g, '', { stroke: colOf(o.angCol, i, INK), width: 2.6, cls: '' })));
  const angLabs = P.map((_, i) => (o.angs && o.angs[i] != null ? pp(txt(g, 0, 0, o.angs[i], { size: o.angSize || 17, color: o.angLabCol ? colOf(o.angLabCol, i, INK) : INK, halo: o.angHalo })) : null));
  const sideLabs = P.map((_, i) => (o.sides && o.sides[i] != null ? pp(txt(g, 0, 0, o.sides[i], { size, color: o.sideLabCol === false ? INK : colOf(o.sideLabCol || o.sideCol, i, INK) })) : null));
  const names = P.map((_, i) => (o.names && o.names[i] ? pp(txt(g, 0, 0, o.names[i], { size: size + 3, italic: true, color: colOf(o.nameCol, i, INK) })) : null));
  const F = { g, fill, sides, arcs, angLabs, sideLabs, names, P };
  F.set = (Q) => {
    F.P = Q; fill.setAttribute('d', polyD(Q));
    const C = cen(Q), shortest = Math.min(...Q.map((p, i) => dist(p, Q[(i + 1) % n])));
    const r = o.r || Math.max(11, Math.min(24, shortest * 0.28));
    Q.forEach((V, i) => {
      const N = Q[(i + 1) % n], cn = corner(Q, i);
      sides[i].setAttribute('d', `M${f2(V)}L${f2(N)}`);
      if (arcs[i]) arcs[i].setAttribute('d', markD(V, cn, r));
      if (angLabs[i]) {
        const s = angLabs[i].textContent, sz = o.angSize || 17, hw = s.length * sz * 0.29 + 3;
        const lr = Math.min(95, Math.max(r + sz * 0.85, (hw + sz * 0.3) / Math.max(0.14, Math.sin(Math.min(cn.span, 179) / 2 * RAD)) + 4));
        setXY(angLabs[i], A(V, cn.start + cn.span / 2, lr));
      }
      if (names[i]) setXY(names[i], A(V, cn.start + cn.span / 2 + 180, size * 0.95));
      if (sideLabs[i]) {
        const M = [(V[0] + N[0]) / 2, (V[1] + N[1]) / 2]; let nr = A([0, 0], dirTo(V, N) + 90, 1);
        if ((C[0] - M[0]) * nr[0] + (C[1] - M[1]) * nr[1] > 0) nr = [-nr[0], -nr[1]];
        const s = sideLabs[i].textContent, hw = s.length * size * 0.29 + 3, d = 8 + Math.abs(nr[0]) * hw + Math.abs(nr[1]) * size * 0.55;
        setXY(sideLabs[i], [M[0] + nr[0] * d, M[1] + nr[1] * d]);
      }
    });
  };
  F.set(P);
  return F;
}
/** unit points (y up) → screen points: scale s, bounding box centred in box [x, y, w, h] */
function place(U, box, s) {
  const xs = U.map((p) => p[0]), ys = U.map((p) => p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const ox = box[0] + (box[2] - (x1 - x0) * s) / 2 - x0 * s, oy = box[1] + (box[3] + (y1 - y0) * s) / 2 + y0 * s;
  return U.map((p) => [ox + p[0] * s, oy - p[1] * s]);
}
/** the biggest common scale (≤ max) that fits every [U, box] pair with padding pad */
function fitS(pairs, pad = 34, max = 70) {
  return Math.min(max, ...pairs.map(([U, b]) => {
    const xs = U.map((p) => p[0]), ys = U.map((p) => p[1]);
    return Math.min((b[2] - 2 * pad) / Math.max(1e-6, Math.max(...xs) - Math.min(...xs)), (b[3] - 2 * pad) / Math.max(1e-6, Math.max(...ys) - Math.min(...ys)));
  }));
}
const scaleU = (U, k, sx = 1) => U.map((p) => [p[0] * k * sx, p[1] * k]);
const regU = (n, side) => { const R = side / (2 * Math.sin(Math.PI / n)); return Array.from({ length: n }, (_, j) => { const t = (-90 + 180 / n + 360 * j / n) * RAD; return [R * Math.cos(t), R * Math.sin(t)]; }); };
const angleAt = (P, i) => corner(P, i).span;

/* ======================================================================================
 * 1. Matching corresponding parts (one shape turned or flipped)
 * ====================================================================================== */
const MU = [[0, 0], [5, 0], [4.2, 2.8], [0.8, 2.2]];
const match = {
  title: 'Which parts match?',
  height: 400,
  choices: [{ v: 'turn', label: 'turned around' }, { v: 'flip', label: 'flipped over' }],
  ask: () => `${T('ABCD\\sim PQRS')}. Which angles and sides match?`,
  make(stage, v, ex) {
    const W = ex.W, H = 400, svg = stageSvg(stage, W, H), s = 66, k = 0.75;
    const left = place(MU, [20, 10, W / 2 - 30, 280], s);
    const FA = polyFig(svg, left, { names: 'ABCD'.split(''), nameCol: VC, angCol: VC, sideCol: INK });
    const g0 = cen(MU), cB = [W * 0.74, 150];
    const Bpts = (t) => {   // t = 0: turned / flipped; 1: lined up with ABCD
      const th = (v === 'turn' ? 145 : 0) * (1 - t) * RAD, fx = v === 'flip' ? -1 + 2 * t : 1;
      return MU.map((p) => { const x = (p[0] - g0[0]) * k * fx, y = (p[1] - g0[1]) * k; return [cB[0] + (x * Math.cos(th) - y * Math.sin(th)) * s, cB[1] - (x * Math.sin(th) + y * Math.cos(th)) * s]; });
    };
    const FB = polyFig(svg, Bpts(0), { names: 'PQRS'.split(''), nameCol: VC, angCol: VC, sideCol: INK, fill: '#fbf1de' });
    [FA, FB].forEach((F) => F.arcs.forEach((a) => hide(a)));
    const pairs = 'ABCD'.split('').map((a, i) => hide(lab(stage, `<span style="color:${VC(i)}">${T(a + '\\leftrightarrow ' + 'PQRS'[i])}</span>`, W / 2 - 300 + i * 200, 318, 'u6l2-eq')));
    const sp = ['AB', 'BC', 'CD', 'DA'].map((a, i) => hide(lab(stage, `<span style="color:${SC(i)}">${T(a + '\\leftrightarrow ' + ['PQ', 'QR', 'RS', 'SP'][i])}</span>`, W / 2 - 300 + i * 200, 370, 'u6l2-eq')));
    const showArcs = (on) => { FB.arcs.forEach((a) => { a.style.opacity = on ? 1 : 0; }); };
    return [
      { cap: `${T('ABCD\\sim PQRS')}: the letters are in <b>matching order</b>. 1st with 1st, 2nd with 2nd, and so on.`,
        run: async (c) => { for (let i = 0; i < 4; i++) { await Promise.all([pulse(c, FA.names[i], 1.5, 420), pulse(c, FB.names[i], 1.5, 420), c.pop(pairs[i])]); } } },
      { cap: v === 'turn' ? `${T('PQRS')} is smaller and <b>turned around</b>. Turn it back: it lines up with ${T('ABCD')}.` : `${T('PQRS')} is smaller and <b>flipped over</b> (a mirror image). Flip it back: it lines up with ${T('ABCD')}.`,
        run: async (c) => { await tween(c, 1800, (t) => FB.set(Bpts(t))); } },
      { cap: `Matching <b>angles</b> are equal: ${T('\\angle A=\\angle P')}, ${T('\\angle B=\\angle Q')}, ${T('\\angle C=\\angle R')}, ${T('\\angle D=\\angle S')}.`,
        run: async (c) => { showArcs(false); for (let i = 0; i < 4; i++) { FA.arcs[i].style.opacity = 1; FB.arcs[i].style.opacity = 1; await Promise.all([pulse(c, FA.names[i], 1.4, 380), pulse(c, FB.names[i], 1.4, 380)]); } } },
      { cap: `Matching <b>sides</b>: ${T('AB\\leftrightarrow PQ')}, ${T('BC\\leftrightarrow QR')}, and so on. Each side of ${T('PQRS')} is 0.75 times as long.`,
        run: async (c) => { for (let i = 0; i < 4; i++) { FA.sides[i].setAttribute('stroke', SC(i)); FB.sides[i].setAttribute('stroke', SC(i)); await c.pop(sp[i]); } } }
    ];
  }
};

/* ======================================================================================
 * 2. The similarity tester: match, Test 1 (angles), Test 2 (side ratios), verdict — with stamps
 * ====================================================================================== */
const SQ = (a) => [[0, 0], [a, 0], [a, a], [0, a]];
const PARA_A = [[0, 0], [10, 0], [12.571, 3.064], [2.571, 3.064]], PARA_B = [[0, 0], [15, 0], [19.178, 4.979], [4.178, 4.979]];
const TEST = {
  ex1: { nm: ['ABCD', 'PQRS'], A: [[0, 0], [6, 0], [6, 4], [3, 4]], B: scaleU([[0, 0], [6, 0], [6, 4], [3, 4]], 1.5), sa: [6, 4, 3, 5], sb: [9, 6, 4.5, 7.5], aa: [53, 90, 90, 127], ab: [53, 90, 90, 127], unit: 'cm' },
  rhom: { nm: ['ABCD', 'PQRS'], A: SQ(2), B: [[0, 0], [3, 0], [4.5, 2.598], [1.5, 2.598]], sa: [2, 2, 2, 2], sb: [3, 3, 3, 3], aa: [90, 90, 90, 90], ab: [60, 120, 60, 120], unit: 'cm', dp1: true },
  rect: { nm: ['ABCD', 'PQRS'], A: SQ(3), B: [[0, 0], [6, 0], [6, 4], [0, 4]], sa: [3, 3, 3, 3], sb: [6, 4, 6, 4], aa: [90, 90, 90, 90], ab: [90, 90, 90, 90], unit: 'cm' },
  ex7: { nm: ['ABCD', 'WXYZ'], A: PARA_A, B: PARA_B, sa: [10, 4, 10, 4], sb: [15, 6.5, 15, 6.5], aa: [50, 130, 50, 130], ab: [50, 130, 50, 130], unit: 'cm', show: [0, 3], angShow: [0] }
};
const ASK = {
  ex1: `Is ${T('ABCD\\sim PQRS')}? Check both tests.`,
  rhom: `Square ${T('ABCD')} (2.0 cm sides) and rhombus ${T('PQRS')} (3.0 cm sides). Are they similar?`,
  rect: `Square ${T('ABCD')} (3 cm sides) and rectangle ${T('PQRS')} (6 cm by 4 cm). Are they similar?`,
  ex7: `Are parallelograms ${T('ABCD')} and ${T('WXYZ')} similar?`
};
function makeTester(keys, labels, title) {
  return {
    title,
    height: 500,
    choices: keys.map((k, i) => ({ v: k, label: labels[i] })),
    ask: (v) => ASK[v],
    make(stage, v, ex) {
      const W = ex.W, H = 500, d = TEST[v], svg = stageSvg(stage, W, H), [na, nb] = d.nm.map((s) => s.split(''));
      const RW = 230, avail = W - RW - 20, boxA = [10, 6, avail * 0.42, 240], boxB = [10 + avail * 0.42, 6, avail * 0.58, 240];
      const s = fitS([[d.A, boxA], [d.B, boxB]], 34, 70);
      const ln = (x) => (d.dp1 ? x.toFixed(1) : fm(x)) + ' ' + d.unit;
      const show = (i) => !d.show || d.show.includes(i), angShow = (i) => !d.angShow || d.angShow.includes(i);
      const opts = (sl, al, fill) => ({ names: null, sides: sl.map((x, i) => (show(i) ? ln(x) : null)), angs: al.map((a, i) => (a !== 90 && angShow(i) ? a + '°' : null)), angCol: VC, sideCol: SC, fill });
      const FA = polyFig(svg, place(d.A, boxA, s), Object.assign(opts(d.sa, d.aa), { names: na, nameCol: VC }));
      const FB = polyFig(svg, place(d.B, boxB, s), Object.assign(opts(d.sb, d.ab, '#fbf1de'), { names: nb, nameCol: VC }));
      // the two test panels
      const pw = (W - 30) / 2, py = 256, mk = (x, ttl) => { const p = add(stage, h('div', 'u6l2-panel'), x, py); p.style.width = pw + 'px'; p.style.height = '238px'; const hd = h('div', 'u6l2-ph', `<span>${ttl}</span>`); p.appendChild(hd); return { p, hd }; };
      const P1 = mk(10, 'Test 1: angles'), P2 = mk(20 + pw, `Test 2: sides (${T(d.nm[1] + '\\div ' + d.nm[0])})`);
      const okA = d.aa.map((a, i) => a === d.ab[i]), passA = okA.every((x) => x);
      const rs = d.sb.map((b, i) => q2(b, d.sa[i])), okS = rs.map((r) => r === rs[0]), passS = okS.every((x) => x);
      const rows1 = na.map((a, i) => {
        const r = h('div', 'u6l2-row' + (okA[i] ? '' : ' u6l2-badrow'), `<span><i style="background:${VC(i)}"></i>${T('\\angle ' + a)} and ${T('\\angle ' + nb[i])}</span><span>${d.aa[i]}° and ${d.ab[i]}°</span><span class="u6l2-mk ${okA[i] ? 'u6l2-y' : 'u6l2-n'}">${okA[i] ? '✓' : '✗'}</span>`);
        P1.p.appendChild(r); return hide(r);
      });
      const rows2 = na.map((a, i) => {
        const j = (i + 1) % 4, sA = d.dp1 ? d.sa[i].toFixed(1) : fm(d.sa[i]), sB = d.dp1 ? d.sb[i].toFixed(1) : fm(d.sb[i]);
        const qt = d.dp1 ? `${sB}\\div${sA}=${fm(rs[i])}` : divTex(d.sb[i], d.sa[i]);
        const r = h('div', 'u6l2-row u6l2-r2' + (okS[i] ? '' : ' u6l2-badrow'), `<span><i style="background:${SC(i)}"></i>${T(nb[i] + nb[j] + '\\div ' + a + na[j])}</span><span>${T(qt)}</span><span class="u6l2-mk ${okS[i] ? 'u6l2-y' : 'u6l2-n'}">${okS[i] ? '✓' : '✗'}</span>`);
        P2.p.appendChild(r); return hide(r);
      });
      const st1 = hide(stamp(P1.hd, passA ? 'pass' : 'fail', { ok: passA, size: 'sm' })), st2 = hide(stamp(P2.hd, passS ? 'pass' : 'fail', { ok: passS, size: 'sm' }));
      const sim = passA && passS, k = rs[0];
      const vx = W - RW / 2 - 6;
      const verdict = hide(stamp(stage, sim ? 'similar' : 'not similar', { ok: sim, x: vx, y: 92 }));
      const kTag = sim ? hide(lab(stage, `${T('k=' + fm(k))}<br><span class="muted">${k > 1 ? 'enlargement' : 'reduction'}</span>`, vx, 182, 'u6l2-tag')) : null;
      const badA = okA.indexOf(false), badS = okS.indexOf(false);
      const pairList = na.map((a, i) => T(a + '\\leftrightarrow ' + nb[i])).join(', ');
      const res1 = passA ? `All four pairs of angles are equal: <b>Test 1 passes</b>.`
        : `${T(`\\angle ${na[badA]}=${d.aa[badA]}^\\circ`)} but ${T(`\\angle ${nb[badA]}=${d.ab[badA]}^\\circ`)}: <b>Test 1 fails</b>. One pair is enough, but let’s check the sides too.`;
      const res2 = passS ? `Every ratio is ${fm(k)}: <b>Test 2 passes</b>.`
        : `${T(divTex(d.sb[0], d.sa[0]))} but ${T(divTex(d.sb[badS], d.sa[badS]))}: <b>Test 2 fails</b>.`;
      const res3 = sim ? `Both tests pass: ${T(d.nm[0] + '\\sim ' + d.nm[1])} with ${T('k=' + fm(k))}. Since ${T('k>1')}, ${T(d.nm[1])} is an <b>enlargement</b>.`
        : !passA ? `Not similar because ${T(`\\angle ${na[badA]}=${d.aa[badA]}^\\circ`)} is not equal to ${T(`\\angle ${nb[badA]}=${d.ab[badA]}^\\circ`)}.`
          : `Not similar because ${T(divTex(d.sb[0], d.sa[0]))} is not equal to ${T(divTex(d.sb[badS], d.sa[badS]))}.`;
      const hl = (F, i, on) => { F.sides[i].setAttribute('stroke-width', on ? 7 : 3.4); };
      return [
        { cap: `<b>Step 1:</b> match the vertices in order: ${pairList}.`,
          run: async (c) => { for (let i = 0; i < 4; i++) await Promise.all([pulse(c, FA.names[i], 1.5, 380), pulse(c, FB.names[i], 1.5, 380)]); } },
        { cap: `<b>Test 1:</b> compare each pair of corresponding angles.`,
          run: async (c) => { for (let i = 0; i < 4; i++) { await Promise.all([pulse(c, FA.arcs[i], 1.5, 380), pulse(c, FB.arcs[i], 1.5, 380), op(c, rows1[i], 1, 380)]); } } },
        { cap: res1, run: (c) => stampIn(c, st1) },
        { cap: `<b>Test 2:</b> divide each pair of sides, the same way every time: ${T(d.nm[1])} side ÷ ${T(d.nm[0])} side.`,
          run: async (c) => { for (let i = 0; i < 4; i++) { hl(FA, i, true); hl(FB, i, true); await op(c, rows2[i], 1, 420); await (c.fast ? null : c.sleep(250)); hl(FA, i, false); hl(FB, i, false); } } },
        { cap: res2, run: (c) => stampIn(c, st2) },
        { cap: res3, run: async (c) => { await stampIn(c, verdict); if (kTag) await c.pop(kTag); } }
      ];
    }
  };
}
const tester = makeTester(['ex1', 'rhom'], ['Example 1 check', 'Example 2 check'], 'The similarity tester');
const tester4 = makeTester(['rect', 'ex7'], ['a square and a rectangle', 'Example 7 check'], 'The similarity tester');

/* ======================================================================================
 * 3. (Full) Divide the same way every time
 * ====================================================================================== */
const flip = {
  title: 'Divide the same way every time',
  height: 340,
  ask: () => `Rectangle ${T('ABCD')} is 6 cm by 4 cm. Rectangle ${T('PQRS')} is 9 cm by 6 cm. Find the side ratios.`,
  make(stage, v, ex) {
    const W = ex.W, svg = stageSvg(stage, W, 340), s = 34;
    polyFig(svg, place([[0, 0], [6, 0], [6, 4], [0, 4]], [10, 20, 250, 300], s), { names: 'ABCD'.split(''), sides: ['6 cm', '4 cm', null, null], sideCol: (i) => (i % 2 ? MC[1] : MC[0]) });
    polyFig(svg, place([[0, 0], [9, 0], [9, 6], [0, 6]], [260, 20, 370, 300], s), { names: 'PQRS'.split(''), sides: ['9 cm', '6 cm', null, null], sideCol: (i) => (i % 2 ? MC[1] : MC[0]), fill: '#fbf1de' });
    const x = W - 240;
    const r1 = hide(lab(stage, `${T('PQ\\div AB=9\\div6=1.5')}<br>${T('QR\\div BC=6\\div4=1.5')}`, x, 105, 'u6l2-eq u6l2-good'));
    const s1 = hide(stamp(stage, 'they match', { ok: true, x: x + 150, y: 36, size: 'sm' }));
    const r2e = hide(lab(stage, `${T('AB\\div PQ=6\\div9\\approx0.67')}<br>${T('QR\\div BC=6\\div4=1.5')}`, x, 240, 'u6l2-eq u6l2-bad'));
    const s2 = hide(stamp(stage, 'no match?', { ok: false, x: x + 150, y: 172, size: 'sm' }));
    const fix = hide(lab(stage, `The same shape goes on top: ${T('PQRS')} sides on top.`, W / 2, 318, 'u6l2-tag'));
    return [
      { cap: `Put ${T('PQRS')} on top every time: ${T('9\\div6=1.5')} and ${T('6\\div4=1.5')}. They match.`, run: async (c) => { await c.pop(r1); await stampIn(c, s1); } },
      { cap: `Now flip <b>one</b> of them: ${T('6\\div9\\approx0.67')} and ${T('6\\div4=1.5')}. They don’t match!`, run: async (c) => { await c.pop(r2e); await stampIn(c, s2); } },
      { cap: `But the shapes <b>are</b> similar. The flipped ratio has the wrong shape on top.`, run: async (c) => { await op(c, r2e, 0.35, 400); await c.pop(fix); } }
    ];
  }
};

/* ======================================================================================
 * 4. Bigger or smaller never changes the angles (then a stretch does)
 * ====================================================================================== */
const TRAP = [[0, 0], [6, 0], [6, 4], [3, 4]];
const angles = {
  title: 'Grow it, shrink it, stretch it',
  height: 410,
  ask: () => `This shape has sides 6, 4, 3 and 5 cm. What happens to its angles when it grows, shrinks or stretches?`,
  make(stage, v, ex) {
    const W = ex.W, H = 410, svg = stageSvg(stage, W, H), u = 28, O = [70, 380];
    const pts = (k, sx) => TRAP.map((p) => [O[0] + p[0] * k * sx * u, O[1] - p[1] * k * u]);
    const lens = (k, sx) => { const P = TRAP.map((p) => [p[0] * k * sx, p[1] * k]); return P.map((p, i) => dist(p, P[(i + 1) % 4])); };
    const F = polyFig(svg, pts(1, 1), { names: 'ABCD'.split(''), sides: lens(1, 1).map((l) => fm(l, 1) + ' cm'), sideCol: SC, angCol: VC, nameCol: VC });
    const px = W - 330;
    const box = add(stage, h('div', 'u6l2-panel'), px, 40); box.style.width = '300px'; box.style.height = '240px';
    const hd = h('div', 'u6l2-ph', '<span>The angles</span>'); box.appendChild(hd);
    const kTag = h('span', 'u6l2-tag', T('k=1')); hd.appendChild(kTag); kTag.style.fontSize = '19px';
    const vals = 'ABCD'.split('').map((a, i) => { const r = h('div', 'u6l2-row', `<span><i style="background:${VC(i)}"></i>${T('\\angle ' + a)}</span><span class="u6l2-av">53°</span><span></span>`); box.appendChild(r); return r.querySelector('.u6l2-av'); });
    const base = [0, 1, 2, 3].map((i) => Math.round(angleAt(pts(1, 1), i)));
    const set = (k, sx, tagHtml) => {
      const P = pts(k, sx), L = lens(k, sx);
      F.sideLabs.forEach((t, i) => { t.textContent = fm(L[i], 1) + ' cm'; });
      F.set(P);
      vals.forEach((el, i) => { const a = Math.round(angleAt(P, i)); el.textContent = a + '°'; el.style.color = a === base[i] ? '' : RED; el.style.fontWeight = a === base[i] ? '' : '800'; });
      if (tagHtml) kTag.innerHTML = tagHtml;
    };
    set(1, 1);
    const ok = hide(stamp(stage, 'same angles', { ok: true, x: px + 150, y: 330 }));
    const no = hide(stamp(stage, 'not similar', { ok: false, x: px + 150, y: 330 }));
    return [
      { cap: `The angles are 53°, 90°, 90° and 127°.`, run: async (c) => { for (let i = 0; i < 4; i++) await pulse(c, F.arcs[i], 1.6, 300); } },
      { cap: `Make it <b>bigger</b> (${T('k=2')}). Every side doubles, but the angles <b>don’t change</b>.`, run: (c) => tween(c, 1800, (t) => set(1 + t, 1, T('k=' + fm(1 + t, 1)))) },
      { cap: `Make it <b>smaller</b> (${T('k=0.5')}). Still 53°, 90°, 90° and 127°: the same shape.`, run: async (c) => { await tween(c, 2000, (t) => set(2 - 1.5 * t, 1, T('k=' + fm(2 - 1.5 * t, 1)))); await stampIn(c, ok); } },
      { cap: `Now <b>stretch</b> it sideways only. The angles <b>change</b>: 53° becomes 34°. A stretched shape is <b>not similar</b>.`,
        run: async (c) => { await tween(c, 500, (t) => set(0.5 + 0.5 * t, 1, T('k=' + fm(0.5 + 0.5 * t, 1)))); await op(c, ok, 0, 200); await tween(c, 1800, (t) => set(1, 1 + t, 'stretch →')); await stampIn(c, no); } }
    ];
  }
};

/* ======================================================================================
 * 5. Missing angles with a sum bar (Example 3 checks)
 * ====================================================================================== */
const EF = [[0, 0], [3, 0], [3.466, 1.739], [0.535, 1.995]], JK = [[0, 0], [4.2, 0], [4.614, 1.545], [0.51, 1.905]];
function sumBar(stage, svg, x, y, w, total, label) {
  const bh = 46, out = path(svg, `M${x} ${y}h${w}v${bh}h${-w}Z`, { stroke: INK, width: 2.6, fill: '#fff', cls: '' });
  const tl = hide(lab(stage, `The angles of ${label} add to <b>${total}°</b>`, x + w / 2, y - 22, 'u6l2-eq u6l2-plain'));
  const segs = [];
  const seg = (from, deg, colr, text, o = {}) => {
    const sx = x + (from / total) * w, sw = (deg / total) * w;
    const r = path(svg, `M${r2(sx)} ${y}h${r2(sw)}v${bh}h${r2(-sw)}Z`, { stroke: INK, width: 2, fill: colr, fo: o.fo ?? 0.28, dash: o.dash, cls: '' });
    const t = lab(stage, text, sx + sw / 2, y + bh / 2, o.cls || 'u6l2-sb');
    t.inner.style.fontSize = '20px'; if (o.color) t.inner.style.color = o.color;
    hide(r, t); segs.push([r, t]); return [r, t];
  };
  return { out, tl, seg, segs, y, bh };
}
const missing = {
  title: 'Find the missing angle, then compare',
  height: 430,
  choices: [{ v: 'ex3', label: 'Example 3 check' }, { v: 'pent', label: 'Example 3 (d) check' }],
  ask: (v) => (v === 'ex3' ? `Find ${T('\\angle H')} and ${T('\\angle L')}. Do the angles of ${T('EFGH')} and ${T('JKLM')} match?` : `Two pentagons both have angles of 100°, 120° and 95°, and all the side ratios are 2. Are they similar?`),
  make(stage, v, ex) {
    const W = ex.W, H = 430, svg = stageSvg(stage, W, H);
    if (v === 'ex3') {
      const bA = [10, 0, W / 2 - 20, 200], bB = [W / 2 + 10, 0, W / 2 - 20, 200], s = fitS([[EF, bA], [JK, bB]], 30, 64);
      const FA = polyFig(svg, place(EF, bA, s), { names: 'EFGH'.split(''), angs: ['75°', '105°', '80°', '?'], angCol: VC, nameCol: VC });
      const FB = polyFig(svg, place(JK, bB, s), { names: 'JKLM'.split(''), angs: ['75°', '105°', '?', '100°'], angCol: VC, nameCol: VC, fill: '#fbf1de' });
      const bw = W / 2 - 70, B1 = sumBar(stage, svg, 35, 252, bw, 360, T('EFGH')), B2 = sumBar(stage, svg, W / 2 + 35, 252, bw, 360, T('JKLM'));
      const a1 = [75, 105, 80], a2 = [75, 105, 100];
      const s1 = [B1.seg(0, 75, VC(0), '75°'), B1.seg(75, 105, VC(1), '105°'), B1.seg(180, 80, VC(2), '80°'), B1.seg(260, 100, VC(3), '100°', { fo: 0.55 })];
      const s2 = [B2.seg(0, 75, VC(0), '75°'), B2.seg(75, 105, VC(1), '105°'), B2.seg(180, 80, VC(2), '80°', { fo: 0.55 }), B2.seg(260, 100, VC(3), '100°')];
      const e1 = hide(lab(stage, T('\\angle H=360^\\circ-260^\\circ=100^\\circ'), 35 + bw / 2, 336, 'u6l2-eq')), e2 = hide(lab(stage, T('\\angle L=360^\\circ-280^\\circ=80^\\circ'), W / 2 + 35 + bw / 2, 336, 'u6l2-eq'));
      const cmp = hide(lab(stage, `${T('75=75')} &nbsp; ${T('105=105')} &nbsp; ${T('80=80')} &nbsp; ${T('100=100')}`, W * 0.3, 396, 'u6l2-eq u6l2-good'));
      const st1 = hide(stamp(stage, 'Test 1 passes', { ok: true, x: W * 0.63, y: 396, size: 'sm' })), st2 = hide(stamp(stage, 'similar? not yet', { ok: null, x: W * 0.86, y: 396, size: 'sm' }));
      const fillBar = async (c, B, segs, known) => { for (let i = 0; i < 4; i++) { if (i === known) continue; await Promise.all([op(c, segs[i][0], 1, 260), c.pop(segs[i][1])]); } };
      const setQ = (F, i, s) => { F.angLabs[i].textContent = s; F.angLabs[i].setAttribute('fill', RED); F.set(F.P); };
      return [
        { cap: `The angles of a quadrilateral add to <b>360°</b>.`, run: async (c) => { await Promise.all([c.pop(B1.tl), c.pop(B2.tl)]); } },
        { cap: `${T('EFGH')}: ${T('75^\\circ+105^\\circ+80^\\circ=260^\\circ')}, so ${T('\\angle H=360^\\circ-260^\\circ=100^\\circ')}.`,
          run: async (c) => { await fillBar(c, B1, s1, 3); await Promise.all([op(c, s1[3][0], 1, 300), c.pop(s1[3][1])]); await c.pop(e1); setQ(FA, 3, '100°'); await pulse(c, FA.angLabs[3], 1.6, 420); } },
        { cap: `${T('JKLM')}: ${T('75^\\circ+105^\\circ+100^\\circ=280^\\circ')}, so ${T('\\angle L=360^\\circ-280^\\circ=80^\\circ')}.`,
          run: async (c) => { await fillBar(c, B2, s2, 2); await Promise.all([op(c, s2[2][0], 1, 300), c.pop(s2[2][1])]); await c.pop(e2); setQ(FB, 2, '80°'); await pulse(c, FB.angLabs[2], 1.6, 420); } },
        { cap: `Compare in pairs: ${T('\\angle E=\\angle J')}, ${T('\\angle F=\\angle K')}, ${T('\\angle G=\\angle L')}, ${T('\\angle H=\\angle M')}. <b>Test 1 passes</b>.`, run: async (c) => { await c.pop(cmp); await stampIn(c, st1); } },
        { cap: `But no side lengths are given, so we can’t do Test 2. Similar? <b>Not yet!</b> (${T('JKLM')} looks longer and flatter.)`, run: (c) => stampIn(c, st2) }
      ];
    }
    const bw = W - 140, B1 = sumBar(stage, svg, 70, 70, bw, 540, 'pentagon 1'), B2 = sumBar(stage, svg, 70, 250, bw, 540, 'pentagon 2');
    const known = (B) => [B.seg(0, 100, VC(0), '100°'), B.seg(100, 120, VC(1), '120°'), B.seg(220, 95, VC(2), '95°')];
    const k1 = known(B1), k2 = known(B2);
    const left1 = B1.seg(315, 225, GREY, '225° left', { fo: 0.12, dash: '6 5' }), left2 = B2.seg(315, 225, GREY, '225° left', { fo: 0.12, dash: '6 5' });
    const sp1 = [B1.seg(315, 110, VC(3), '110°', { fo: 0.45 }), B1.seg(425, 115, MC[4], '115°', { fo: 0.45 })];
    const sp2 = [B2.seg(315, 105, VC(3), '105°', { fo: 0.45 }), B2.seg(420, 120, MC[4], '120°', { fo: 0.45 })];
    const eq = hide(lab(stage, T('540^\\circ-100^\\circ-120^\\circ-95^\\circ=225^\\circ'), W / 2, 158, 'u6l2-eq'));
    const bad = hide(lab(stage, `${T('110^\\circ\\ne105^\\circ')} and ${T('115^\\circ\\ne120^\\circ')}`, W / 2 - 120, 362, 'u6l2-eq u6l2-bad'));
    const st = hide(stamp(stage, 'not enough', { ok: false, x: W - 170, y: 362 }));
    const showSeg = (c, sg) => Promise.all([op(c, sg[0], 1, 300), c.pop(sg[1])]);
    return [
      { cap: `The angles of a pentagon add to <b>540°</b>.`, run: async (c) => { await Promise.all([c.pop(B1.tl), c.pop(B2.tl)]); } },
      { cap: `Both have 100°, 120° and 95°. That leaves ${T('540^\\circ-315^\\circ=225^\\circ')} in each.`,
        run: async (c) => { for (let i = 0; i < 3; i++) await Promise.all([showSeg(c, k1[i]), showSeg(c, k2[i])]); await Promise.all([showSeg(c, left1), showSeg(c, left2)]); await c.pop(eq); } },
      { cap: `But 225° can be split in different ways: ${T('110^\\circ+115^\\circ')} in one, ${T('105^\\circ+120^\\circ')} in the other.`,
        run: async (c) => { await Promise.all([op(c, left1[1], 0, 200), op(c, left2[1], 0, 200)]); for (const sg of [sp1[0], sp1[1], sp2[0], sp2[1]]) await showSeg(c, sg); } },
      { cap: `Then the angles don’t all match. Equal side ratios are not enough: we need to know <b>every</b> pair of angles.`, run: async (c) => { await c.pop(bad); await stampIn(c, st); } }
    ];
  }
};

/* ======================================================================================
 * 6. The photo: blown up to fill a print (Example 4 checks)
 * ====================================================================================== */
/** Kiara's photo, drawn in a 50 × 70 box (portrait) */
function drawPic(g) {
  svgEl('rect', { x: 0, y: 0, width: 50, height: 70, fill: '#cfe4f7' }, g);
  svgEl('circle', { cx: 38, cy: 13, r: 6, fill: '#f4c046' }, g);
  svgEl('path', { d: 'M0 50L12 27L19 37L30 18L42 36L50 30V70H0Z', fill: '#8a94a6' }, g);
  svgEl('path', { d: 'M12 27L9.5 32L12.5 31L14 33ZM30 18L26.5 24L30 22.5L33 25Z', fill: '#fff' }, g);
  svgEl('rect', { x: 0, y: 50, width: 50, height: 20, fill: '#7fb069' }, g);
  svgEl('path', { d: 'M6 58L9 47L12 58ZM40 60L43.5 48L47 60Z', fill: '#2f6b3a' }, g);
  svgEl('circle', { cx: 25, cy: 55, r: 2.2, fill: '#c93a33' }, g);
  svgEl('path', { d: 'M25 57.2V64M22 60H28M25 64L23 68M25 64L27 68', stroke: '#c93a33', 'stroke-width': 1.4, fill: 'none', 'stroke-linecap': 'round' }, g);
}
/** a group showing the photo in the rectangle (x, y, w, h); turned 90° when the rectangle is landscape */
function picG(parent) {
  const g = svgEl('g', {}, parent); drawPic(g);
  const frame = svgEl('rect', { x: 0, y: 0, width: 50, height: 70, fill: 'none', stroke: INK, 'stroke-width': 2, 'vector-effect': 'non-scaling-stroke' }, g);
  g.place = (x, y, w, hh) => {
    if (w <= hh) g.setAttribute('transform', `translate(${r2(x)} ${r2(y)}) scale(${(w / 50).toFixed(4)} ${(hh / 70).toFixed(4)})`);
    else g.setAttribute('transform', `translate(${r2(x + w)} ${r2(y)}) rotate(90) scale(${(hh / 50).toFixed(4)} ${(w / 70).toFixed(4)})`);
  };
  g.frame = frame; return g;
}
const PRINTS = { a: [10, 14, 'in', '(a) 10 in by 14 in'], b: [8, 10, 'in', '(b) 8 in by 10 in'], c: [0.5, 0.7, 'm', '(c) 0.5 m by 0.7 m'], d: [10, 14, 'in', '(d) Method 1'] };
const photo = {
  title: 'Will the photo fit the print?',
  height: 450,
  choices: [{ v: 'a', label: '(a) 10 by 14' }, { v: 'b', label: '(b) 8 by 10' }, { v: 'c', label: '(c) 0.5 m by 0.7 m' }, { v: 'd', label: '(d) Method 1' }],
  ask: (v) => (v === 'd' ? `Check the 10 in by 14 in print with Method 1. What is the scale factor?` : `Kiara’s photo is 5 in by 7 in. Is a ${PRINTS[v][3].slice(4)} print similar to it?`),
  make(stage, v, ex) {
    const W = ex.W, H = 450, svg = stageSvg(stage, W, H), [sw, sh, un] = PRINTS[v];
    const ph = [40, 170, 100, 140], L = 330, pw = (sw / sh) * L, cx = 230 + 160, px = cx - pw / 2, py = 60;
    const small = pp(svgEl('g', {}, svg)); picG(small).place(...ph);
    const lp1 = hide(lab(stage, '5 in', ph[0] + 50, ph[1] + ph[3] + 18, 'u6l2-sb')), lp2 = hide(lab(stage, '7 in', ph[0] - 22, ph[1] + 70, 'u6l2-sb'));
    const big = picG(svg); hide(big);
    const outline = hide(path(svg, `M${r2(px)} ${py}h${r2(pw)}v${L}h${r2(-pw)}Z`, { stroke: BROWN, width: 5, cls: '' }));
    const ls = hide(lab(stage, `${fm(sw)} ${un}`, cx, py + L + 32, 'u6l2-sb')), ll = hide(lab(stage, `${fm(sh)} ${un}`, px + pw + 34, py + L / 2, 'u6l2-sb'));
    const cover = Math.max(pw / 5, L / 7), gw = 5 * cover, gh = 7 * cover, gx = cx - gw / 2, gy = py + L / 2 - gh / 2;
    const cut = [];
    if (gh > L + 0.5) [[gx, gy, gw, py - gy], [gx, py + L, gw, gy + gh - py - L]].forEach((r) => cut.push(hide(svgEl('rect', { x: r2(r[0]), y: r2(r[1]), width: r2(r[2]), height: r2(r[3]), fill: RED, 'fill-opacity': 0.45, stroke: RED, 'stroke-width': 2 }, svg))));
    const cutLab = cut.length ? hide(lab(stage, 'cut off', cx + pw / 2 + 52, py - 6, 'u6l2-eq u6l2-bad')) : null;
    const x0 = W - 200, lines = [], line = (html, y, cls = '') => { const t = hide(lab(stage, html, x0, y, 'u6l2-eq ' + cls)); lines.push(t); return t; };
    const grow = (c) => tween(c, 1800, (t) => big.place(ph[0] + (gx - ph[0]) * t, ph[1] + (gy - ph[1]) * t, ph[2] + (gw - ph[2]) * t, ph[3] + (gh - ph[3]) * t));
    const intro = { cap: `Kiara’s photo: long ÷ short is ${T('7\\div5=1.4')}.`, run: async (c) => { await pulse(c, small, 1.15, 450); await Promise.all([c.pop(lp1), c.pop(lp2)]); await c.pop(line(`Photo: ${T('7\\div5=1.4')}`, 90)); } };
    const showPrint = async (c) => { await op(c, outline, 1, 400); await Promise.all([c.pop(ls), c.pop(ll)]); };
    if (v === 'd') {
      const hS = hide(path(svg, `M${ph[0]} ${ph[1] + ph[3]}h${ph[2]}M${r2(px)} ${py + L}h${r2(pw)}`, { stroke: GREEN, width: 8, opacity: 0.55, cls: '' }));
      const hL = hide(path(svg, `M${ph[0]} ${ph[1]}v${ph[3]}M${r2(px + pw)} ${py}v${L}`, { stroke: MC[0], width: 8, opacity: 0.55, cls: '' }));
      const st = hide(stamp(stage, 'similar, k = 2', { ok: true, x: x0, y: 330 }));
      return [
        { cap: `The photo is 5 in by 7 in. The print is 10 in by 14 in.`, run: async (c) => { await pulse(c, small, 1.15, 450); await Promise.all([c.pop(lp1), c.pop(lp2)]); await showPrint(c); } },
        { cap: `Short with short: ${T('10\\div5=2')}.`, run: async (c) => { await op(c, hS, 1, 400); await c.pop(line(`Short: ${T('10\\div5=2')}`, 120, 'u6l2-good')); } },
        { cap: `Long with long: ${T('14\\div7=2')}.`, run: async (c) => { await op(c, hL, 1, 400); await c.pop(line(`Long: ${T('14\\div7=2')}`, 190, 'u6l2-good')); } },
        { cap: `Both are 2: the print is similar, with ${T('k=2')}. The photo doubles and fits exactly.`, run: async (c) => { big.style.opacity = 1; await grow(c); await stampIn(c, st); } }
      ];
    }
    const q = sh / sw, same = Math.abs(q - 1.4) < 1e-9;
    const st = hide(stamp(stage, same ? 'fits: similar' : 'not similar', { ok: same, x: x0, y: 330 }));
    const pTex = divTex(sh, sw);
    return [
      intro,
      { cap: `The print ${PRINTS[v][3].slice(4)}: ${T(pTex)}.${v === 'c' ? ' (Both sides are in metres: Method 2 needs no converting.)' : ''}`, run: async (c) => { await showPrint(c); await c.pop(line(`Print: ${T(pTex)}`, 160, same ? 'u6l2-good' : 'u6l2-bad')); } },
      { cap: `Blow the photo up until it fills the print…`, run: async (c) => { big.style.opacity = 1; await grow(c); for (const r of cut) await op(c, r, 1, 300); if (cutLab) await c.pop(cutLab); } },
      { cap: same ? `${T('1.4=1.4')}: it fits <b>exactly</b>. The print is similar to the photo.` : `${T('1.25\\ne1.4')}: the photo is too tall for this print. The top and bottom get <b>cut off</b>. Not similar.`, run: (c) => stampIn(c, st) }
    ];
  }
};

/* ======================================================================================
 * 7. (Full) Boxes and cans
 * ====================================================================================== */
function boxD(svg, x, y, l, hh, d, o = {}) {   // front face bottom-left at (x, y); depth drawn up-right at 35°
  const dx = d * 0.55 * Math.cos(35 * RAD), dy = d * 0.55 * Math.sin(35 * RAD);
  const g = svgEl('g', {}, svg);
  path(g, `M${x} ${y}h${l}v${-hh}h${-l}Z`, { fill: o.fill || '#e8cfa4', stroke: INK, width: 2.6, cls: '' });
  path(g, `M${x} ${y - hh}l${r2(dx)} ${r2(-dy)}h${l}l${r2(-dx)} ${r2(dy)}Z`, { fill: '#f2dfbd', stroke: INK, width: 2.6, cls: '' });
  path(g, `M${x + l} ${y}l${r2(dx)} ${r2(-dy)}v${-hh}l${r2(-dx)} ${r2(dy)}Z`, { fill: '#d3b27c', stroke: INK, width: 2.6, cls: '' });
  path(g, `M${x + l * 0.42} ${y - hh}l${r2(dx)} ${r2(-dy)}h${l * 0.16}l${r2(-dx)} ${r2(dy)}Z`, { fill: '#c9a46a', stroke: 'none', cls: '' });
  return { g, dx, dy };
}
function canD(svg, cx, y, r, hh, o = {}) {
  const ry = r * 0.28, g = svgEl('g', {}, svg);
  path(g, `M${cx - r} ${y - hh}V${y}A${r} ${ry} 0 0 0 ${cx + r} ${y}V${y - hh}`, { fill: o.fill || '#d9dde4', stroke: o.stroke || INK, width: 2.6, dash: o.dash, cls: '' });
  if (!o.ghost) path(g, `M${cx - r} ${y - hh * 0.7}A${r} ${ry} 0 0 0 ${cx + r} ${y - hh * 0.7}V${y - hh * 0.3}A${r} ${ry} 0 0 1 ${cx - r} ${y - hh * 0.3}Z`, { fill: '#c93a33', fo: 0.85, stroke: 'none', cls: '' });
  svgEl('ellipse', { cx, cy: y - hh, rx: r, ry, fill: o.ghost ? 'none' : '#eef0f4', stroke: o.stroke || INK, 'stroke-width': 2.6, 'stroke-dasharray': o.dash || null }, g);
  return g;
}
const boxes = {
  title: 'Boxes and cans',
  height: 390,
  choices: [{ v: 'box', label: 'Example 6 (a) check' }, { v: 'can', label: 'Example 6 (b) check' }],
  ask: (v) => (v === 'box' ? `Two boxes measure 20 by 30 by 40 cm and 30 by 45 by 60 cm. Are they similar?` : `Soup cans: radius 4 cm, height 10 cm, and radius 6 cm, height 12 cm. Are they similar?`),
  make(stage, v, ex) {
    const W = ex.W, svg = stageSvg(stage, W, 390), x0 = W - 210, lines = [];
    const line = (html, y, cls = '') => { const t = hide(lab(stage, html, x0, y, 'u6l2-eq ' + cls)); lines.push(t); return t; };
    if (v === 'box') {
      const s = 3.1, B1 = boxD(svg, 70, 330, 40 * s, 30 * s, 20 * s), B2 = boxD(svg, 310, 330, 60 * s, 45 * s, 30 * s); hide(B1.g, B2.g);
      const L1 = [lab(stage, '40 cm', 70 + 20 * s, 352, 'u6l2-sb'), lab(stage, '30 cm', 40, 330 - 15 * s, 'u6l2-sb'), lab(stage, '20 cm', 70 + 40 * s + B1.dx / 2 + 26, 330 - B1.dy / 2 + 4, 'u6l2-sb')];
      const L2 = [lab(stage, '60 cm', 310 + 30 * s, 352, 'u6l2-sb'), lab(stage, '45 cm', 282, 330 - 22.5 * s, 'u6l2-sb'), lab(stage, '30 cm', 310 + 60 * s + B2.dx / 2 + 26, 330 - B2.dy / 2 + 4, 'u6l2-sb')];
      [...L1, ...L2].forEach((t, i) => { hide(t); t.inner.style.color = MC[[0, 1, 2][i % 3]]; });
      const st = hide(stamp(stage, 'similar, k = 1.5', { ok: true, x: x0, y: 300 }));
      return [
        { cap: `Two boxes: 20 by 30 by 40 cm, and 30 by 45 by 60 cm.`, run: async (c) => { await c.pop(B1.g); await c.pop(B2.g); for (const t of [...L1, ...L2]) await c.pop(t); } },
        { cap: `Divide each matching pair: ${T('30\\div20=1.5')}, ${T('45\\div30=1.5')}, ${T('60\\div40=1.5')}.`,
          run: async (c) => { const q = [[2, '30\\div20=1.5', 70], [1, '45\\div30=1.5', 130], [0, '60\\div40=1.5', 190]]; for (const [i, s2, y] of q) { await Promise.all([pulse(c, L1[i].inner, 1.4, 420), pulse(c, L2[i].inner, 1.4, 420)]); await c.pop(line(T(s2), y, 'u6l2-good')); } } },
        { cap: `All three ratios are 1.5: the boxes are <b>similar</b>, ${T('k=1.5')}.`, run: (c) => stampIn(c, st) }
      ];
    }
    const s = 14, y = 340, c1 = canD(svg, 120, y, 4 * s, 10 * s), c2 = canD(svg, 360, y, 6 * s, 12 * s); hide(c1, c2);
    const ghost = hide(canD(svg, 360, y, 6 * s, 15 * s, { ghost: true, dash: '8 6', stroke: GREEN, fill: 'none' }));
    const lr1 = hide(lab(stage, 'r = 4 cm', 120, y - 10 * s - 34, 'u6l2-sb')), lh1 = hide(lab(stage, '10 cm', 120 - 4 * s - 34, y - 5 * s, 'u6l2-sb'));
    const lr2 = hide(lab(stage, 'r = 6 cm', 360, y + 34, 'u6l2-sb')), lh2 = hide(lab(stage, '12 cm', 360 - 6 * s - 34, y - 6 * s, 'u6l2-sb'));
    const gl = hide(lab(stage, '15 cm tall would be similar', 360, y - 15 * s - 40, 'u6l2-eq u6l2-good'));
    const st = hide(stamp(stage, 'not similar', { ok: false, x: x0, y: 250 }));
    return [
      { cap: `Two soup cans: radius 4 cm, height 10 cm, and radius 6 cm, height 12 cm.`, run: async (c) => { await c.pop(c1); await c.pop(c2); for (const t of [lr1, lh1, lr2, lh2]) await c.pop(t); } },
      { cap: `Radius: ${T('6\\div4=1.5')}. Height: ${T('12\\div10=1.2')}.`, run: async (c) => { await c.pop(line(`Radius: ${T('6\\div4=1.5')}`, 70)); await c.pop(line(`Height: ${T('12\\div10=1.2')}`, 140, 'u6l2-bad')); } },
      { cap: `${T('1.5\\ne1.2')}, so the cans are <b>not similar</b>. The big can is too short.`, run: (c) => stampIn(c, st) },
      { cap: `A similar can would be ${T('10\\times1.5=15')} cm tall.`, run: async (c) => { await op(c, ghost, 1, 500); await c.pop(gl); } }
    ];
  }
};

/* ======================================================================================
 * 8. A border, and Owen's mistake (Example 8 checks)
 * ====================================================================================== */
const frame = {
  title: 'Adding is not multiplying',
  height: 440,
  choices: [{ v: 'mat', label: 'Example 8 (a) check' }, { v: 'owen', label: 'Example 8 (b) check' }],
  ask: (v) => (v === 'mat' ? `A 20 cm by 30 cm picture gets a 5 cm mat on every side. Is the matted picture similar to the picture?` : `Owen checks a 24 cm by 40 cm rectangle and a 50 cm by 30 cm rectangle. Find his mistake.`),
  make(stage, v, ex) {
    const W = ex.W, H = 440, svg = stageSvg(stage, W, H), x0 = W - 220, lines = [];
    const line = (html, y, cls = '') => { const t = hide(lab(stage, html, x0, y, 'u6l2-eq ' + cls)); lines.push(t); return t; };
    if (v === 'mat') {
      const s = 6.8, cx = 290, cy = 222, rect = (w, hh) => `M${r2(cx - w * s / 2)} ${r2(cy - hh * s / 2)}h${r2(w * s)}v${r2(hh * s)}h${r2(-w * s)}Z`;
      const ghost = hide(path(svg, rect(30, 45), { stroke: GREEN, width: 3, dash: '9 6', cls: '' }));
      const mat = path(svg, rect(20, 30), { fill: '#d8d2c4', stroke: INK, width: 3.4, cls: '' });
      svgEl('rect', { x: cx - 10 * s, y: cy - 15 * s, width: 20 * s, height: 30 * s, fill: '#fff', stroke: INK, 'stroke-width': 2 }, svg);
      picG(svg).place(cx - 10 * s, cy - 14 * s, 20 * s, 28 * s);
      const p1 = lab(stage, '20 cm', cx, cy + 15 * s + 18, 'u6l2-sb'), p2 = lab(stage, '30 cm', cx - 10 * s - 34, cy, 'u6l2-sb');
      const m1 = hide(lab(stage, '30 cm', cx, cy + 22.5 * s + 18, 'u6l2-sb')), m2 = hide(lab(stage, '40 cm', cx - 15 * s - 34, cy, 'u6l2-sb'));
      const b5 = hide(lab(stage, '5 cm', cx + 12.5 * s, cy - 6 * s, 'u6l2-sb'));
      const gl = hide(lab(stage, '30 by 45: similar', cx + 15 * s + 112, cy - 21 * s, 'u6l2-eq u6l2-good'));
      const st = hide(stamp(stage, 'not similar', { ok: false, x: x0, y: 250 }));
      return [
        { cap: `The picture: 20 cm by 30 cm.`, run: async (c) => { await Promise.all([c.pop(p1), c.pop(p2)]); } },
        { cap: `Add 5 cm on every side: ${T('20+5+5=30')} cm by ${T('30+5+5=40')} cm.`,
          run: async (c) => { await Promise.all([op(c, p1, 0, 200), op(c, p2, 0, 200)]); await tween(c, 1500, (t) => mat.setAttribute('d', rect(20 + 10 * t, 30 + 10 * t))); await Promise.all([c.pop(m1), c.pop(m2), c.pop(b5)]); } },
        { cap: `Short: ${T('30\\div20=1.5')}. Long: ${T('40\\div30\\approx1.33')}. Not equal: <b>not similar</b>.`,
          run: async (c) => { await c.pop(line(`Short: ${T('30\\div20=1.5')}`, 80)); await c.pop(line(`Long: ${T('40\\div30\\approx1.33')}`, 150, 'u6l2-bad')); await stampIn(c, st); } },
        { cap: `Adding 10 cm to both sides is not the same as multiplying. Times 1.5 gives ${T('20\\times1.5=30')} by ${T('30\\times1.5=45')}.`,
          run: async (c) => { await op(c, ghost, 1, 500); await c.pop(gl); } }
      ];
    }
    const s = 4.4, P1 = place([[0, 0], [24, 0], [24, 40], [0, 40]], [30, 30, 180, 330], s);
    const c2 = [440, 210], R2 = (th) => [[-25, -15], [25, -15], [25, 15], [-25, 15]].map(([x, y]) => [c2[0] + (x * Math.cos(th) - y * Math.sin(th)) * s, c2[1] - (x * Math.sin(th) + y * Math.cos(th)) * s]);
    const F1 = polyFig(svg, P1, { sides: ['24 cm', '40 cm', null, null], sideCol: (i) => (i % 2 ? MC[0] : GREEN), arcs: false });
    const F2 = polyFig(svg, R2(0), { sides: ['50 cm', '30 cm', null, null], sideCol: (i) => (i % 2 ? GREEN : MC[0]), arcs: false, fill: '#fbf1de' });
    const ow = hide(lab(stage, `Owen: ${T('50\\div24\\approx2.08')}<br>${T('30\\div40=0.75')}`, x0, 90, 'u6l2-eq u6l2-bad'));
    const so = hide(stamp(stage, 'mistake', { ok: false, x: x0, y: 170, size: 'sm' }));
    const wrong = hide(path(svg, `M${f2(cen([P1[0], P1[1]]))}C${f2([180, 420])} ${f2([380, 330])} ${f2(cen([R2(0)[0], R2(0)[1]]))}`, { stroke: RED, width: 3, dash: '8 6', cls: '' }));
    const tS = hide(lab(stage, 'short', 120, 330, 'u6l2-eq u6l2-bad')), tL = hide(lab(stage, 'long', 440, 326, 'u6l2-eq u6l2-bad'));
    const st = hide(stamp(stage, 'similar, k = 1.25', { ok: true, x: x0, y: 360 }));
    return [
      { cap: `Owen’s work: ${T('50\\div24\\approx2.08')} and ${T('30\\div40=0.75')}. He says they are not similar.`, run: async (c) => { await c.pop(ow); await op(c, wrong, 1, 500); } },
      { cap: `His mistake: he matched a <b>short</b> side (24) with a <b>long</b> side (50).`, run: async (c) => { await Promise.all([c.pop(tS), c.pop(tL)]); await stampIn(c, so); } },
      { cap: `Turn the second rectangle so short matches short and long matches long.`,
        run: async (c) => { await Promise.all([op(c, wrong, 0, 250), op(c, tS, 0, 250), op(c, tL, 0, 250), op(c, ow, 0.3, 250), op(c, so, 0.3, 250)]); await tween(c, 1600, (t) => F2.set(R2(t * Math.PI / 2))); } },
      { cap: `Short: ${T('30\\div24=1.25')}. Long: ${T('50\\div40=1.25')}. Equal: they <b>are</b> similar, with ${T('k=1.25')}.`,
        run: async (c) => { await c.pop(line(`Short: ${T('30\\div24=1.25')}`, 230, 'u6l2-good')); await c.pop(line(`Long: ${T('50\\div40=1.25')}`, 290, 'u6l2-good')); await stampIn(c, st); } }
    ];
  }
};

/* ======================================================================================
 * 9. Regular polygons (Example 9 checks)
 * ====================================================================================== */
const PNAME = { 3: 'equilateral triangles', 4: 'squares', 6: 'regular hexagons', 8: 'regular octagons' };
const regular = {
  title: 'Regular polygons',
  height: 430,
  choices: [{ v: 3, label: 'triangles' }, { v: 4, label: 'squares' }, { v: 6, label: 'hexagons' }, { v: 'stop', label: 'Example 9 (a) check' }, { v: 'hp', label: 'Example 9 (b) check' }],
  ask: (v) => (v === 'stop' ? `Stop signs: regular octagons with 25 cm and 32 cm sides. Similar? Each angle? Scale factor?` : v === 'hp' ? `A regular hexagon and a regular pentagon both have 10 cm sides. Are they similar?` : `Two ${PNAME[v]} have 4 cm and 6 cm sides. Are they similar?`),
  make(stage, v, ex) {
    const W = ex.W, H = 430, svg = stageSvg(stage, W, H), x0 = W - 185, lines = [];
    const line = (html, y, cls = '') => { const t = hide(lab(stage, html, x0, y, 'u6l2-eq ' + cls)); lines.push(t); return t; };
    const hp = v === 'hp', stop = v === 'stop', nA = hp ? 6 : stop ? 8 : v, nB = hp ? 5 : nA;
    const sA = hp ? 10 : stop ? 25 : 4, sB = hp ? 10 : stop ? 32 : 6;
    const UA = regU(nA, sA), UB = regU(nB, sB), RA = sA / (2 * Math.sin(Math.PI / nA)), RB = sB / (2 * Math.sin(Math.PI / nB));
    const avail = x0 - 165, gap = 36, sc = Math.min(165 / Math.max(RA, RB), 46, (avail - gap - 10) / (2 * RA + 2 * RB)), wA = 2 * RA * sc, wB = 2 * RB * sc, tot = wA + gap + wB, xA = (avail - tot) / 2 + 4;
    const angA = (nA - 2) * 180 / nA, angB = (nB - 2) * 180 / nB;
    const mk = (U, n, side, xl, wd, fill) => polyFig(svg, place(U, [xl, 20, wd, 360], sc), { sides: U.map((_, i) => (i === U.length - 1 ? side + ' cm' : null)), angs: U.map(() => fm(n === nA ? angA : angB, 1) + '°'), fill, angCol: stop ? '#fff' : BROWN, angLabCol: stop ? '#fff' : null, angHalo: stop ? false : undefined, sideCol: stop ? '#7a1f16' : INK });
    const FA = mk(UA, nA, sA, xA, wA, stop ? '#d23a2e' : '#fbf6ec'), FB = mk(UB, nB, sB, xA + wA + gap, wB, stop ? '#d23a2e' : '#fbf1de');
    [FA, FB].forEach((F) => { F.arcs.forEach((a) => hide(a)); F.angLabs.forEach((a) => hide(a)); });
    if (stop) [FA, FB].forEach((F, j) => { const C = cen(F.P); txt(F.g, C[0], C[1], 'STOP', { size: j ? 34 : 27, color: '#fff', halo: false, weight: 900 }); });
    const showAngs = async (c, F) => { F.arcs.forEach((a) => { a.style.opacity = 1; }); await Promise.all(F.angLabs.map((a) => c.pop(a))); };
    if (hp) {
      const nums = [FA, FB].map((F) => F.P.map((p, i) => { const C = cen(F.P), q = A(p, dirTo(p, C) + 180, 22); return hide(pp(txt(svg, q[0], q[1], String(i + 1), { size: 20, color: MC[0] }))); }));
      const st = hide(stamp(stage, 'not similar', { ok: false, x: x0, y: 330 }));
      return [
        { cap: `A regular hexagon and a regular pentagon, both with 10 cm sides.`, run: async (c) => { await c.pop(FA.g); await c.pop(FB.g); } },
        { cap: `Count the corners: 6 and 5. The vertices <b>can’t be matched</b>.`, run: async (c) => { for (const ns of nums) for (const t of ns) await c.pop(t, 200); await c.pop(line('6 corners ≠ 5 corners', 80, 'u6l2-bad')); } },
        { cap: `The angles don’t match either: ${T('720^\\circ\\div6=120^\\circ')} but ${T('540^\\circ\\div5=108^\\circ')}.`, run: async (c) => { await showAngs(c, FA); await showAngs(c, FB); await c.pop(line(T('120^\\circ\\ne108^\\circ'), 150, 'u6l2-bad')); } },
        { cap: `Equal side lengths do <b>not</b> make shapes similar. <b>Not similar.</b>`, run: (c) => stampIn(c, st) }
      ];
    }
    const k = q2(sB, sA), name = PNAME[nA];
    const st = hide(stamp(stage, 'always similar', { ok: true, x: x0, y: 330 }));
    const angTex = `(${nA}-2)\\times180^\\circ\\div${nA}=${fm(angA, 1)}^\\circ`;
    return [
      { cap: `Two ${name}${stop ? ' (stop signs)' : ''}, with ${sA} cm and ${sB} cm sides. In each one, all sides are equal and all angles are equal.`, run: async (c) => { await c.pop(FA.g); await c.pop(FB.g); } },
      { cap: `Each angle: ${T(angTex)}, in <b>both</b>. Test 1 passes.`, run: async (c) => { await showAngs(c, FA); await showAngs(c, FB); await c.pop(line(`Each angle: ${fm(angA, 1)}°`, 80, 'u6l2-good')); } },
      { cap: `Every side ratio is ${T(divTex(sB, sA))}. Test 2 passes.`, run: async (c) => { await Promise.all([pulse(c, FA.sideLabs[nA - 1], 1.5, 450), pulse(c, FB.sideLabs[nB - 1], 1.5, 450)]); await c.pop(line(`Every ratio: ${T(divTex(sB, sA))}`, 150, 'u6l2-good')); } },
      { cap: `Both tests pass every time: two ${name} are <b>always similar</b>. Here ${T('k=' + fm(k))}, an enlargement.`, run: (c) => stampIn(c, st) }
    ];
  }
};

mountExplainers({ match, tester, flip, angles, missing, photo, boxes, frame, tester4, regular });

/* ======================================================================================
 * Hands-on: will the photo fit? (drag the corner of the print)
 * ====================================================================================== */
(function printTool() {
  const host = document.getElementById('u6l2-print'); if (!host) return;
  const SW = 560, SH = 420, PX = 18, O = [34, 392], MAXW = 28, MAXH = 20;
  const box = h('div'), svg = svgEl('svg', { width: SW, height: SH, viewBox: `0 0 ${SW} ${SH}`, class: 'u6l2-svg' }, box); host.appendChild(box);
  const grid = []; for (let i = 0; i <= MAXW; i++) grid.push(`M${O[0] + i * PX} ${O[1]}V${O[1] - MAXH * PX}`); for (let j = 0; j <= MAXH; j++) grid.push(`M${O[0]} ${O[1] - j * PX}H${O[0] + MAXW * PX}`);
  path(svg, grid.join(''), { stroke: '#ebe6dc', width: 1, cls: '' });
  for (let i = 0; i <= MAXW; i += 2) txt(svg, O[0] + i * PX, O[1] + 14, String(i), { size: 12, color: GREY, halo: false });
  for (let j = 2; j <= MAXH; j += 2) txt(svg, O[0] - 14, O[1] - j * PX, String(j), { size: 12, color: GREY, halo: false });
  const defs = svgEl('defs', {}, svg), clip = svgEl('clipPath', { id: 'u6l2-clip' }, defs), clipR = svgEl('rect', {}, clip);
  const faded = picG(svg); faded.style.opacity = 0.28;
  const inner = svgEl('g', { 'clip-path': 'url(#u6l2-clip)' }, svg), pic = picG(inner);
  const cuts = [0, 1].map(() => svgEl('rect', { fill: RED, 'fill-opacity': 0.4, stroke: RED, 'stroke-width': 2, 'pointer-events': 'none' }, svg));
  const outline = svgEl('rect', { fill: 'none', stroke: BROWN, 'stroke-width': 5 }, svg);
  const lw = txt(svg, 0, 0, '', { size: 18, color: BROWN }), lh = txt(svg, 0, 0, '', { size: 18, color: BROWN });
  const hit = svgEl('circle', { r: 28, fill: 'transparent', class: 'u6l2-handle', 'data-tap': '' }, svg);
  const knob = svgEl('circle', { r: 12, fill: '#fff', stroke: BROWN, 'stroke-width': 4, 'pointer-events': 'none' }, svg);
  const side = h('div', 'u6l2-read'); host.appendChild(side);
  side.innerHTML = `<div>Kiara’s photo: 5 in by 7 in.<br>Long ÷ short: ${T('7\\div5=1.4')}</div><div class="u6l2-pr u6l2-gap"></div><div class="u6l2-verdict"></div><div class="u6l2-sizes"></div>`;
  const pr = side.querySelector('.u6l2-pr'), vd = side.querySelector('.u6l2-verdict'), sizes = side.querySelector('.u6l2-sizes');
  let w = 8, hh = 10;
  const fmtIn = (v) => String(v);
  function draw() {
    const x = O[0], y = O[1] - hh * PX, pw = w * PX, ph = hh * PX;
    [['x', x], ['y', y], ['width', pw], ['height', ph]].forEach(([k, val]) => { clipR.setAttribute(k, val); outline.setAttribute(k, val); });
    const lo = Math.max(w, hh), sh2 = Math.min(w, hh), cover = Math.max(sh2 / 5, lo / 7) * PX;
    const gw = (w <= hh ? 5 : 7) * cover, gh = (w <= hh ? 7 : 5) * cover, gx = x + pw / 2 - gw / 2, gy = y + ph / 2 - gh / 2;
    faded.place(gx, gy, gw, gh); pic.place(gx, gy, gw, gh);
    const rr = gh > ph + 0.5 ? [[gx, gy, gw, y - gy], [gx, y + ph, gw, gy + gh - y - ph]] : gw > pw + 0.5 ? [[gx, gy, x - gx, gh], [x + pw, gy, gx + gw - x - pw, gh]] : [[0, 0, 0, 0], [0, 0, 0, 0]];
    cuts.forEach((el, i) => ['x', 'y', 'width', 'height'].forEach((k, j) => el.setAttribute(k, r2(rr[i][j]))));
    setXY(lw, [x + pw / 2, O[1] + 30]); lw.textContent = fmtIn(w) + ' in';
    setXY(lh, [x + pw + 30, y + ph / 2]); lh.textContent = fmtIn(hh) + ' in';
    [hit, knob].forEach((c) => { c.setAttribute('cx', x + pw); c.setAttribute('cy', y); });
    const r = lo / sh2, same = Math.abs(r - 1.4) < 1e-9, rt = divTex(lo, sh2);
    pr.innerHTML = `Print: <b class="u6l2-big">${fmtIn(w)} in by ${fmtIn(hh)} in</b><br>long ÷ short <span class="u6l2-t">${T(rt)}</span>`;
    const tooLong = sh2 / 5 > lo / 7 + 1e-9;
    vd.className = 'u6l2-verdict ' + (same ? 'u6l2-vok' : 'u6l2-vno');
    vd.innerHTML = same ? `<span class="u6l2-ok">✓ Similar!</span> Same shape as the photo, so it fits exactly. ${T('k=' + fm(sh2 / 5))}${w > hh ? ' (turned on its side)' : ''}.`
      : `<span class="u6l2-no">✗ Not similar.</span> ${T(fm(Math.round(r * 100) / 100) + '\\ne1.4')}: the photo is too ${tooLong ? 'long' : 'wide'} for this print, so ${tooLong ? (w <= hh ? 'the top and bottom' : 'the ends') : (w <= hh ? 'the sides' : 'the top and bottom')} get cut off.`;
  }
  const snap = (v, lo, hi) => Math.max(lo, Math.min(hi, Math.round(v * 2) / 2));
  let drag = null;
  hit.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); drag = e.pointerId; try { hit.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ } });
  hit.addEventListener('pointermove', (e) => {
    if (drag !== e.pointerId) return;
    const p = Geo.svgPoint(svg, e), nw = snap((p[0] - O[0]) / PX, 2, MAXW - 2), nh = snap((O[1] - p[1]) / PX, 2, MAXH - 1);
    if (nw !== w || nh !== hh) { w = nw; hh = nh; draw(); }
  });
  const up = (e) => { if (drag === e.pointerId) drag = null; };
  hit.addEventListener('pointerup', up); hit.addEventListener('pointercancel', up);
  [[4, 6], [5, 7], [8, 10], [10, 14], [11, 14], [14, 10]].forEach(([a, b]) => {
    const bt = h('button', 'pill small', `${a} × ${b}${a > b ? ' (turned)' : ''}`); bt.type = 'button'; bt.setAttribute('data-tap', '');
    bt.onclick = () => { w = a; hh = b; draw(); }; sizes.appendChild(bt);
  });
  draw();
})();

/* ======================================================================================
 * Static figures on the cards
 * ====================================================================================== */
const FIG = {
  ex1(host) {
    const s = figSvg(host, 900, 250), U = TEST.ex1.A, V = TEST.ex1.B, bA = [60, 0, 360, 250], bB = [440, 0, 420, 250], sc = fitS([[U, bA], [V, bB]], 36, 30);
    polyFig(s, place(U, bA, sc), { names: 'ABCD'.split(''), sides: ['6 cm', '4 cm', '3 cm', '5 cm'], angs: ['53°', null, null, '127°'], sideLabCol: false });
    polyFig(s, place(V, bB, sc), { names: 'PQRS'.split(''), sides: ['9 cm', '6 cm', '4.5 cm', '7.5 cm'], angs: ['53°', null, null, '127°'], sideLabCol: false, fill: '#fbf1de' });
  },
  ex2(host) {
    const s = figSvg(host, 420, 230), U = SQ(2), V = TEST.rhom.B, bA = [0, 0, 150, 230], bB = [150, 0, 270, 230], sc = fitS([[U, bA], [V, bB]], 30, 60);
    polyFig(s, place(U, bA, sc), { names: 'ABCD'.split(''), arcs: false });
    polyFig(s, place(V, bB, sc), { names: 'PQRS'.split(''), arcs: false, fill: '#fbf1de' });
  },
  ex3(host) {
    const s = figSvg(host, 900, 220), bA = [40, 0, 400, 220], bB = [460, 0, 420, 220], sc = fitS([[EF, bA], [JK, bB]], 32, 64);
    polyFig(s, place(EF, bA, sc), { names: 'EFGH'.split(''), angs: ['75°', '105°', '80°', '?'] });
    polyFig(s, place(JK, bB, sc), { names: 'JKLM'.split(''), angs: ['75°', '105°', '?', '100°'], fill: '#fbf1de' });
  },
  ex7(host) {
    const s = figSvg(host, 900, 200), bA = [20, 0, 340, 200], bB = [380, 0, 500, 200], sc = fitS([[PARA_A, bA], [PARA_B, bB]], 34, 24);
    polyFig(s, place(PARA_A, bA, sc), { names: 'ABCD'.split(''), sides: ['10 cm', null, null, '4 cm'], angs: ['50°', null, null, null], sideLabCol: false, arcs: true });
    polyFig(s, place(PARA_B, bB, sc), { names: 'WXYZ'.split(''), sides: ['15 cm', null, null, '6.5 cm'], angs: ['50°', null, null, null], sideLabCol: false, fill: '#fbf1de' });
  },
  flags(host) {
    const W = 330, H = 200, s = figSvg(host, W, H), x = 25, y = 30, L = 280, Wd = 140;
    svgEl('rect', { x, y, width: L, height: Wd, fill: '#fff', stroke: INK, 'stroke-width': 2.5 }, s);
    svgEl('rect', { x, y, width: L / 4, height: Wd, fill: '#d52b1e' }, s); svgEl('rect', { x: x + L * 0.75, y, width: L / 4, height: Wd, fill: '#d52b1e' }, s);
    const cx = x + L / 2, cy = y + Wd / 2 + 4, k = 44;
    const half = [[0, 1], [0.1, 0.78], [0.26, 0.86], [0.22, 0.48], [0.5, 0.66], [0.44, 0.48], [0.7, 0.42], [0.56, 0.2], [0.64, 0.1], [0.3, -0.06], [0.36, -0.28], [0.05, -0.22], [0.04, -0.6]];
    const all = [...half, [-0.04, -0.6], ...half.slice(1, -1).reverse().map(([a, b]) => [-a, b])];
    path(s, 'M' + all.map(([a, b]) => `${r2(cx + a * k)} ${r2(cy - b * k)}`).join('L') + 'Z', { fill: '#d52b1e', stroke: 'none', cls: '' });
    svgEl('rect', { x, y, width: L, height: Wd, fill: 'none', stroke: INK, 'stroke-width': 2.5 }, s);
    txt(s, cx, y + Wd + 24, 'length = 2 × width', { size: 18 });
    txt(s, x - 2, y + Wd / 2, 'width', { size: 16, anchor: 'end' }).setAttribute('transform', `rotate(-90 ${x - 10} ${y + Wd / 2})`);
  },
  mat(host) {
    const s = figSvg(host, 230, 260), k = 5.6, cx = 110, cy = 125;
    svgEl('rect', { x: cx - 15 * k, y: cy - 20 * k, width: 30 * k, height: 40 * k, fill: '#d8d2c4', stroke: INK, 'stroke-width': 3 }, s);
    svgEl('rect', { x: cx - 10 * k, y: cy - 15 * k, width: 20 * k, height: 30 * k, fill: '#fff', stroke: INK, 'stroke-width': 2 }, s);
    txt(s, cx, cy - 10, 'picture', { size: 17 }); txt(s, cx, cy + 14, '20 by 30', { size: 17 });
    path(s, `M${cx + 10 * k} ${cy - 11 * k}H${cx + 15 * k}`, { width: 2, cls: '' });
    Geo.text(s, cx + 15 * k + 4, cy - 11 * k, '5 cm', { size: 15, anchor: 'start' });
  },
  stops(host) {
    const s = figSvg(host, 300, 170);
    [[80, 92, 62, '25 cm'], [215, 85, 79, '32 cm']].forEach(([cx, cy, R, t]) => {
      const P = Array.from({ length: 8 }, (_, j) => A([cx, cy], 22.5 + 45 * j, R));
      path(s, polyD(P), { fill: '#d23a2e', stroke: '#7a1f16', width: 3, cls: '' });
      txt(s, cx, cy, 'STOP', { size: R * 0.42, color: '#fff', halo: false, weight: 900 });
      txt(s, cx, cy + R + 2, t, { size: 16 });
    });
  }
};
document.querySelectorAll('.u6l2-fig[data-fig]').forEach((host) => { const f = FIG[host.dataset.fig]; if (f) f(host); });

/* ======================================================================================
 * Stand Up Break
 * ====================================================================================== */
const rq = (a, b) => { const q = a / b, ex = Math.abs(q * 100 - Math.round(q * 100)) < 1e-6; return `${fm(a)}\\div${fm(b)}${ex ? '=' + fm(q) : '\\approx' + q.toFixed(2)}`; };
standup('u6l2', {
  intro: 'Show every ratio, divide the same way every time, and finish with a sentence: “similar because …” or “not similar because …”.',
  levels: {
    BEG: (r) => {
      const [a, b] = r.pick([[2, 3], [3, 4], [3, 5], [4, 5], [2, 5], [4, 7], [5, 8], [3, 7], [5, 6]]), k = r.pick([1.5, 2, 2.5, 3, 4]);
      const sim = r.chance(0.5), m = r.pick([2, 3, 4, 5]);
      const c = sim ? a * k : a + m, d = sim ? b * k : b + m;
      const q1 = q2(b, a), q3 = q2(d, c), same = Math.abs(b / a - d / c) < 1e-9;
      return { text: `Rectangle A is <b>${a} cm by ${b} cm</b>. Rectangle B is <b>${fm(c)} cm by ${fm(d)} cm</b>. Are they similar? Use long ÷ short for each one.`, q: '',
        a: [`\\text{A: }${rq(b, a)}`, `\\text{B: }${rq(d, c)}`, same ? `\\text{equal, so similar}` : `${fm(Math.round(q1 * 100) / 100)}\\ne${fm(Math.round(q3 * 100) / 100)}\\text{, so not similar}`] };
    },
    PRG: (r) => {
      const sa = Array.from({ length: 4 }, () => r.int(2, 9) * 2), k = r.pick([0.5, 1.5, 2.5, 0.75, 1.25, 3]), bad = r.chance(0.5) ? r.int(0, 3) : -1;
      const sb = sa.map((x, i) => (i === bad ? x * k + r.pick([1, 2, 3]) : x * k));
      const rows = sb.map((b, i) => rq(b, sa[i]));
      return { text: `Quadrilaterals <i>ABCD</i> and <i>EFGH</i> have equal corresponding angles. <i>ABCD</i>: ${sa.join(', ')} cm. <i>EFGH</i>: ${sb.map((x) => fm(x)).join(', ')} cm (in matching order). Are they similar? If so, give <i>k</i>.`, q: '',
        a: [...rows, bad < 0 ? `\\text{all equal: similar, }k=${fm(k)}` : `\\text{one ratio is different: not similar}`] };
    },
    MAS: (r) => r.pick([
      () => {
        const n = r.pick([5, 6, 8, 10, 12]), nm = { 5: 'pentagons', 6: 'hexagons', 8: 'octagons', 10: 'decagons', 12: 'dodecagons' }[n];
        const a = r.int(3, 12) * 2, b = a + r.int(1, 6) * 2, ang = (n - 2) * 180 / n;
        return { text: `Two regular <b>${nm}</b> have sides of <b>${a} cm</b> and <b>${b} cm</b>. Are they similar? Find the size of each angle and the scale factor from small to large.`, q: '',
          a: [`\\text{same number of sides, regular: similar}`, `(${n}-2)\\times180^\\circ\\div${n}=${fm(ang, 1)}^\\circ`, `k=${rq(b, a)}`] };
      },
      () => {
        const [a, b] = r.pick([[8, 10], [12, 16], [10, 15], [20, 24], [16, 20], [12, 18]]), m = r.pick([1, 2, 3, 4]);
        const A2 = a + 2 * m, B2 = b + 2 * m;
        return { text: `A <b>${a} in by ${b} in</b> print gets a frame <b>${m} in</b> wide on every side. Find the outside size. Is the framed print similar to the print alone?`, q: '',
          a: [`${a}+${m}+${m}=${A2},\\ ${b}+${m}+${m}=${B2}`, `\\text{short: }${rq(A2, a)}`, `\\text{long: }${rq(B2, b)}`, `\\text{not equal, so not similar}`] };
      }
    ])()
  }
});
