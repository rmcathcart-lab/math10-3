/* Math 10-3 · Unit 6 · Lesson 1 — Similar Polygons and Scale Factor.
 * Explainers (Class view unless marked Full): a photo that grows, stretches, or turns and flips (similar or not?),
 * measuring every copy on the grid (Example 1 check), matching parts by the naming order (Examples 2 and 3), turning or
 * flipping the copy back onto the original (Full), the scale factor as new ÷ original with bars, tiles and a k meter
 * (Examples 4 and 5), the 4 steps for missing sides (Example 6 check and a reduction), the same sides with a
 * proportion (Full), the scale-factor machine (Example 7 checks), and why area grows by k × k (Full).
 * Also the hands-on "grow and shrink" tool with live ratio tags, the static figures and the Stand Up Break. */
import { h, add, tex, svgEl, tween, anim, stamp, stampIn, pulse, mountExplainers, liveCtx } from '../blocks.js';
import { Geo } from '../geo.js';
import { standup } from '../standup.js';

const A = Geo.at, dirTo = Geo.dirTo, n360 = Geo.n360, wedgeD = Geo.wedgeD;
const INK = '#1c2230', BLUE = '#1f5bd6', GREEN = '#12805a', RED = '#c93a33', AMBER = '#c27a0e', PURPLE = '#7b4fc4', BROWN = '#9a6a24', GREY = '#9aa0ab', TEAL = '#0f8ea8';
const MC = [BLUE, RED, GREEN, AMBER, PURPLE, TEAL, '#b8457a', '#5b6b2e'];
const FILL0 = '#e9edf4', FILL1 = '#fbf1de';
const T = (s) => tex(String(s));
const RAD = Math.PI / 180;
/** a tidy number: 7.499999 → 7.5 */
const rr = (v, d = 6) => Math.round(v * 10 ** d) / 10 ** d;
/** a number for TeX with a thin thousands space */
const tn = (v) => { const s = String(rr(v)); return Math.abs(v) >= 1000 ? s.replace(/^(\d+)(\d{3})/, '$1\\,$2') : s; };
/** plain text with a narrow no-break thousands space */
const pn = (v) => { const s = String(rr(v)); return Math.abs(v) >= 1000 ? s.replace(/^(\d+)(\d{3})/, '$1 $2') : s; };
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const op = (c, el, to, ms = 350) => anim(c, el, [{ opacity: to }], ms);
/** an svg element that may pop / pulse (scale about its own centre) */
const pp = (el) => { el.style.transformBox = 'fill-box'; el.style.transformOrigin = 'center'; return el; };
/** a group whose transform attribute is about the svg origin */
const grp = (parent, attrs = {}) => { const g = svgEl('g', attrs, parent); g.style.transformBox = 'view-box'; g.style.transformOrigin = '0 0'; return g; };
const stageSvg = (stage, W, H) => add(stage, svgEl('svg', { class: 'u6l1-svg', width: W, height: H, viewBox: `0 0 ${W} ${H}` }), 0, 0);
const figSvg = (host, W, H) => { host.style.width = W + 'px'; host.style.height = H + 'px'; return svgEl('svg', { class: 'u6l1-svg', width: W, height: H, viewBox: `0 0 ${W} ${H}` }, host); };
/** an HTML label centred on (x, y): a 0×0 holder (so c.pop's scale doesn't undo the centring) */
function lab(host, html, x, y, cls = '') {
  const hold = h('div', 'u6l1-hold'); hold.appendChild(h('div', 'u6l1-lab ' + cls, html)); add(host, hold, x, y); hold.inner = hold.firstChild; return hold;
}
/** a left-aligned HTML line at (x, y) (its vertical middle at y) */
function line(host, html, x, y, cls = '') {
  const hold = h('div', 'u6l1-hold'); hold.appendChild(h('div', 'u6l1-line ' + cls, html)); add(host, hold, x, y); hold.inner = hold.firstChild; return hold;
}
function path(parent, d, o = {}) {
  return svgEl('path', { d, fill: o.fill || 'none', 'fill-opacity': o.fo ?? null, stroke: o.stroke === undefined ? INK : o.stroke, 'stroke-width': o.width || 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-dasharray': o.dash || null, class: o.cls === undefined ? 'bk-stroke' : o.cls, opacity: o.opacity ?? null, 'vector-effect': o.nss ? 'non-scaling-stroke' : null }, parent);
}
const polyD = (P, closed = true) => 'M' + P.map((p) => p[0].toFixed(2) + ' ' + p[1].toFixed(2)).join('L') + (closed ? 'Z' : '');
const segD = (P, Q) => `M${P[0].toFixed(2)} ${P[1].toFixed(2)}L${Q[0].toFixed(2)} ${Q[1].toFixed(2)}`;
const txt = (parent, x, y, s, o = {}) => pp(Geo.text(parent, x, y, s, Object.assign({ size: 22 }, o)));
const mid = (P, Q) => [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2];
const cen = (P) => [P.reduce((s, p) => s + p[0], 0) / P.length, P.reduce((s, p) => s + p[1], 0) / P.length];
const lerp = (a, b, t) => a + (b - a) * t;
/** world (y up) → screen: fit the points into W × H with padding */
function fitW(P, W, H, pad = 40) {
  const xs = P.map((p) => p[0]), ys = P.map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const pd = Array.isArray(pad) ? pad : [pad, pad, pad, pad];
  const s = Math.min((W - pd[1] - pd[3]) / (x1 - x0 || 1), (H - pd[0] - pd[2]) / (y1 - y0 || 1));
  const ox = pd[3] + (W - pd[1] - pd[3] - (x1 - x0) * s) / 2 - x0 * s, oy = pd[0] + (H - pd[0] - pd[2] + (y1 - y0) * s) / 2 + y0 * s;
  const f = (p) => [ox + p[0] * s, oy - p[1] * s]; f.s = s; f.all = (Q) => Q.map(f); return f;
}
/** p → shift + rotate(rot) · (sx·x, sy·y)   (like TikZ [shift, rotate, xscale, yscale]) */
function tf(P, o = {}) {
  const c = Math.cos((o.rot || 0) * RAD), s = Math.sin((o.rot || 0) * RAD), sx = o.sx ?? 1, sy = o.sy ?? 1;
  return P.map(([x, y]) => [(o.dx || 0) + c * sx * x - s * sy * y, (o.dy || 0) + s * sx * x + c * sy * y]);
}
/** the interior corner of convex polygon P (screen px) at i → { start, span } */
function corner(P, i) {
  const n = P.length, V = P[i], d1 = dirTo(V, P[(i + n - 1) % n]), d2 = dirTo(V, P[(i + 1) % n]);
  const sp = n360(d2 - d1); return sp > 180 ? { start: d2, span: 360 - sp } : { start: d1, span: sp };
}
/** a side label outside the polygon (away from its centre C) */
function sideLab(parent, P, Q, C, s, o = {}) {
  const M = mid(P, Q); let nrm = A([0, 0], dirTo(P, Q) + 90, 1);
  if ((C[0] - M[0]) * nrm[0] + (C[1] - M[1]) * nrm[1] > 0) nrm = [-nrm[0], -nrm[1]];
  const size = o.size || 20, hw = String(s).length * size * 0.29 + 4, d = (o.gap ?? 7) + Math.abs(nrm[0]) * hw + Math.abs(nrm[1]) * size * 0.6;
  return txt(parent, M[0] + nrm[0] * d, M[1] + nrm[1] * d, s, { size, color: o.color || INK });
}
/** draw a polygon (screen pts) with vertex names and side labels → { path, P, C, names, labels, sides } */
function drawPoly(parent, P, o = {}) {
  const C = cen(P), n = P.length;
  const g = svgEl('g', {}, parent);
  const fill = path(g, polyD(P), { fill: o.fill || FILL0, stroke: 'none', cls: '' });
  const sides = P.map((p, i) => path(g, segD(p, P[(i + 1) % n]), { stroke: o.color || INK, width: o.width || 3.2, cls: '' }));
  const names = (o.names || []).map((nm, i) => (nm ? txt(g, ...A(P[i], dirTo(C, P[i]), o.nameGap || 19), nm, { size: o.nameSize || 22, italic: true }) : null));
  const labels = (o.labels || []).map((s, i) => (s ? sideLab(g, P[i], P[(i + 1) % n], C, s, { size: o.labSize || 19 }) : null));
  return { g, fill, P, C, names, labels, sides };
}
/** set the points of a drawn polygon (and move its names and labels) */
function movePoly(D, P, o = {}) {
  const C = cen(P), n = P.length; D.P = P; D.C = C;
  D.fill.setAttribute('d', polyD(P));
  D.sides.forEach((s, i) => s.setAttribute('d', segD(P[i], P[(i + 1) % n])));
  D.names.forEach((t, i) => { if (!t) return; const q = A(P[i], dirTo(C, P[i]), o.nameGap || 19); t.setAttribute('x', q[0].toFixed(1)); t.setAttribute('y', q[1].toFixed(1)); });
}
/** a coloured wedge in the corner of polygon P at i */
function wedge(parent, P, i, color, r = 30) {
  const k = corner(P, i); return pp(path(parent, wedgeD(P[i], r, k.start, k.span), { fill: color, fo: 0.32, stroke: color, width: 2, cls: '' }));
}
/** an angle label inside the corner */
function angLab(parent, P, i, s, o = {}) {
  const k = corner(P, i), q = A(P[i], k.start + k.span / 2, o.r || 46); return txt(parent, q[0], q[1], s, { size: o.size || 18, color: o.color || INK });
}
/** a thick see-through stroke over one side (for highlighting) */
const glow = (parent, P, i, color, w = 12) => path(parent, segD(P[i], P[(i + 1) % P.length]), { stroke: color, width: w, opacity: 0.35 });
const wait = (c, ms) => (c && !c.fast ? c.sleep(ms) : Promise.resolve());

/* ======================================================================================
 * 1. Same shape? A photo that grows, stretches, or turns and flips
 * ====================================================================================== */
/** a little photo of a dog, 120 × 90 in its own coordinates */
function photo(parent) {
  const g = svgEl('g', {}, parent);
  svgEl('rect', { x: 0, y: 0, width: 120, height: 90, fill: '#dff0fb' }, g);
  svgEl('path', { d: 'M0 68 Q34 54 70 63 T120 58 V90 H0Z', fill: '#9ccf7a' }, g);
  svgEl('circle', { cx: 101, cy: 18, r: 9, fill: '#f5c242' }, g);
  svgEl('ellipse', { cx: 34, cy: 44, rx: 7, ry: 14, fill: '#7a4f26', transform: 'rotate(22 34 44)' }, g);
  svgEl('ellipse', { cx: 66, cy: 44, rx: 7, ry: 14, fill: '#7a4f26', transform: 'rotate(-22 66 44)' }, g);
  svgEl('ellipse', { cx: 50, cy: 52, rx: 19, ry: 19, fill: '#c98a4b' }, g);
  svgEl('ellipse', { cx: 50, cy: 61, rx: 10, ry: 8, fill: '#ecc69a' }, g);
  svgEl('circle', { cx: 43, cy: 48, r: 2.8, fill: INK }, g); svgEl('circle', { cx: 57, cy: 48, r: 2.8, fill: INK }, g);
  svgEl('ellipse', { cx: 50, cy: 57, rx: 4.2, ry: 3.2, fill: INK }, g);
  path(g, 'M44 63 Q50 68 56 63', { width: 2, cls: '', nss: true });
  svgEl('rect', { x: 0, y: 0, width: 120, height: 90, fill: 'none', stroke: INK, 'stroke-width': 3.2, 'vector-effect': 'non-scaling-stroke' }, g);
  return g;
}
/** dimension line with end ticks and a label (horizontal when vert is false) */
function dim(parent, a, b, at, label, o = {}) {
  const g = svgEl('g', { class: 'u6l1-dim' }, parent), col = o.color || INK, t = 7;
  if (!o.vert) { path(g, `M${a} ${at}H${b}M${a} ${at - t}V${at + t}M${b} ${at - t}V${at + t}`, { stroke: col, width: 2, cls: '' }); g.t = txt(g, (a + b) / 2, at + 20, label, { size: 20, color: col }); }
  else { path(g, `M${at} ${a}V${b}M${at - t} ${a}H${at + t}M${at - t} ${b}H${at + t}`, { stroke: col, width: 2, cls: '' }); g.t = txt(g, at + 12, (a + b) / 2, label, { size: 20, color: col, anchor: 'start' }); }
  return g;
}
const STRETCH = {
  grow: { sx: 2, sy: 2, rot: 0, flip: 1 }, stretch: { sx: 2, sy: 1, rot: 0, flip: 1 }, turn: { sx: 1, sy: 1, rot: 90, flip: -1 }
};
const stretch = {
  title: 'Same shape? Grow it, stretch it, turn it',
  height: 400,
  choices: [{ v: 'grow', label: 'Every length × 2' }, { v: 'stretch', label: 'Stretch it sideways' }, { v: 'turn', label: 'Turn it and flip it' }],
  ask: (v) => ({ grow: 'A photo is 4 cm by 3 cm. A print has <b>every</b> length × 2. Is it the same shape?', stretch: 'Stretch the photo <b>sideways only</b>. Is it still the same shape?', turn: 'Turn the photo and flip it over. Is it still the same shape?' }[v]),
  make(stage, v, ex) {
    const W = ex.W, H = 400, svg = stageSvg(stage, W, H), m = STRETCH[v], U = 30;   // 30 px per cm
    const O = [150, 196], Cn = [Math.round(W * 0.62), 196];
    const g0 = grp(svg, { transform: `translate(${O[0] - 60} ${O[1] - 45})` }); photo(g0);
    const d0w = dim(svg, O[0] - 60, O[0] + 60, O[1] + 66, '4 cm'), d0h = dim(svg, O[1] - 45, O[1] + 45, O[0] + 76, '3 cm', { vert: true });
    const tag0 = txt(svg, O[0], O[1] - 76, 'original', { size: 21, color: '#6a7182' });
    const g1 = grp(svg); photo(g1); hide(g1);
    let st = { cx: O[0], cy: O[1], sx: 1, sy: 1, rot: 0, fl: 1 };
    const set = (s) => { st = s; g1.setAttribute('transform', `translate(${s.cx.toFixed(2)} ${s.cy.toFixed(2)}) rotate(${(-s.rot).toFixed(2)}) scale(${(s.sx * s.fl).toFixed(4)} ${s.sy.toFixed(4)}) translate(-60 -45)`); };
    set(st);
    // the copy's size when it is done (screen box)
    const turned = v === 'turn', bw = (turned ? 90 : 120 * m.sx), bh = (turned ? 120 : 90 * m.sy);
    const L = Cn[0] - bw / 2, R = Cn[0] + bw / 2, Tp = Cn[1] - bh / 2, B = Cn[1] + bh / 2;
    const wcm = rr(bw / U), hcm = rr(bh / U);
    const d1w = hide(dim(svg, L, R, B + 22, wcm + ' cm', { color: BLUE })), d1h = hide(dim(svg, Tp, B, R + 22, hcm + ' cm', { color: RED, vert: true }));
    const fw = turned ? '' : `× ${m.sx}`, fh = turned ? '' : `× ${m.sy}`;
    const tw = hide(lab(stage, `<span>width 4 → ${wcm} cm</span> <b>${fw}</b>`, Cn[0] - 125, 34, 'u6l1-pill u6l1-blue')), th = hide(lab(stage, `<span>height 3 → ${hcm} cm</span> <b>${fh}</b>`, Cn[0] + 125, 34, 'u6l1-pill u6l1-red'));
    const ok = v !== 'stretch';
    const st1 = hide(stamp(stage, ok ? (turned ? 'similar ✓ (congruent)' : 'similar ✓') : 'not similar ✗', { ok, x: W - 130, y: 360, size: turned ? 'sm' : undefined }));
    const to = (target, ms) => (c) => { g1.style.opacity = 1; const s0 = Object.assign({}, st); return tween(c, ms, (u) => set({ cx: lerp(s0.cx, target.cx, u), cy: lerp(s0.cy, target.cy, u), sx: lerp(s0.sx, target.sx, u), sy: lerp(s0.sy, target.sy, u), rot: lerp(s0.rot, target.rot, u), fl: lerp(s0.fl, target.fl, u) })); };
    const first = { cap: 'The original photo of a dog: <b>4 cm</b> wide and <b>3 cm</b> tall.', run: async (c) => { await pulse(c, pp(tag0), 1.15, 500); } };
    const measure = { cap: turned ? 'Measure it: still 4 cm one way and 3 cm the other way. Every length is <b>× 1</b>.' : v === 'grow' ? 'Width: 4 → 8 cm (<b>× 2</b>). Height: 3 → 6 cm (<b>× 2</b>). The <b>same number</b> both ways.' : 'Width: 4 → 8 cm (<b>× 2</b>). Height: 3 → 3 cm (<b>× 1</b>). <b>Not</b> the same number!',
      run: async (c) => { await c.pop(d1w); await c.pop(d1h); if (!turned) { await c.pop(tw); await c.pop(th); } } };
    const verdict = { cap: v === 'grow' ? 'Same shape, bigger size: the print is <b>similar</b> to the photo.' : v === 'stretch' ? 'The dog looks too wide. The shape changed, so it is <b>not similar</b>.' : 'Turning and flipping don’t change the shape: <b>similar</b> (same size too, so <b>congruent</b>).',
      run: (c) => stampIn(c, st1) };
    if (turned) {
      return [first,
        { cap: 'Make a copy and <b>turn</b> it a quarter turn.', run: to({ cx: Cn[0], cy: Cn[1], sx: 1, sy: 1, rot: 90, fl: 1 }, 1500) },
        { cap: 'Now <b>flip</b> it over, like turning a page.', run: to({ cx: Cn[0], cy: Cn[1], sx: 1, sy: 1, rot: 90, fl: -1 }, 1300) },
        measure, verdict];
    }
    return [first,
      { cap: v === 'grow' ? 'Enlarge it: multiply <b>every</b> length by 2.' : 'Stretch it <b>sideways only</b>: the width × 2, the height stays the same.',
        run: async (c) => { await to({ cx: O[0], cy: O[1], sx: 1, sy: 1, rot: 0, fl: 1 }, 1)(c); await to({ cx: Cn[0], cy: O[1], sx: 1, sy: 1, rot: 0, fl: 1 }, 900)(c); await to({ cx: Cn[0], cy: Cn[1], sx: m.sx, sy: m.sy, rot: 0, fl: 1 }, 1400)(c); } },
      measure, verdict];
  }
};

/* ======================================================================================
 * 1. Example 1 check: measure every copy on the grid
 * ====================================================================================== */
const LS = {
  O: [[0, 0], [2, 0], [2, 1], [1, 1], [1, 3], [0, 3]],
  A: [[0, 0], [4, 0], [4, 2], [2, 2], [2, 6], [0, 6]],
  B: [[0, 0], [4, 0], [4, 1], [2, 1], [2, 3], [0, 3]],
  C: [[0, 0], [3, 0], [3, 1], [1, 1], [1, 2], [0, 2]],
  D: [[0, 0], [3, 0], [3, 1.5], [1.5, 1.5], [1.5, 4.5], [0, 4.5]]
};
const EX1_ROWS = [['width', 0, BLUE], ['height', 5, RED], ['stem', 4, GREEN]];   // [name, side of the original, colour]
const EX1_SIDE = { A: [0, 5, 4], B: [0, 5, 4], C: [5, 0, 1], D: [0, 5, 4] };       // the matching side of each copy
const sideLen = (P, i) => Math.hypot(P[(i + 1) % P.length][0] - P[i][0], P[(i + 1) % P.length][1] - P[i][1]);
const copies = {
  title: 'Example 1 check: is every length multiplied by the same number?',
  height: 400,
  choices: [{ sep: 'Example 1' }, { v: 'A', label: 'Copy A' }, { v: 'B', label: 'Copy B' }, { v: 'C', label: 'Copy C' }, { v: 'D', label: 'Copy D' }],
  ask: (v) => `Example 1: is copy <b>${v}</b> similar to the original? If yes, every length was multiplied by what number?`,
  make(stage, v, ex) {
    const W = ex.W, H = 400, svg = stageSvg(stage, W, H), cell = 42, gx = 16, gy = 360, cols = 11, rows = 7;
    const G = (p, ox) => [gx + (p[0] + ox) * cell, gy - p[1] * cell];
    const gd = []; for (let i = 0; i <= cols; i++) gd.push(`M${gx + i * cell} ${gy}V${gy - rows * cell}`); for (let j = 0; j <= rows; j++) gd.push(`M${gx} ${gy - j * cell}H${gx + cols * cell}`);
    path(svg, gd.join(''), { stroke: '#cfd4dd', width: 1.2, cls: '' });
    const Po = LS.O.map((p) => G(p, 1)), dO = drawPoly(svg, Po, { fill: FILL0 });
    txt(svg, G([1, 0], 1)[0], gy + 22, 'Original', { size: 19 });
    const pc = LS[v], C0 = pc.map((p) => G(p, 5.5)), flipT = pc.map(([x, y]) => [y, x]);
    const dC = drawPoly(svg, C0, { fill: FILL1 }); hide(dC.g);
    const cTag = hide(txt(svg, G([2, 0], 5.5)[0], gy + 22, 'Copy ' + v, { size: 19 }));
    const hl = svgEl('g', {}, svg);
    const ks = EX1_ROWS.map(([, i], r) => rr(sideLen(pc, EX1_SIDE[v][r]) / sideLen(LS.O, i)));
    const oL = EX1_ROWS.map(([, i]) => rr(sideLen(LS.O, i))), cL = EX1_ROWS.map((_, r) => rr(sideLen(pc, EX1_SIDE[v][r])));
    // the table
    const tx = gx + cols * cell + 34, tw = W - tx - 12, tb = h('div', 'u6l1-mt'); tb.style.width = tw + 'px';
    ['length', 'original', 'copy ' + v, '× ?'].forEach((s) => tb.appendChild(h('div', 'u6l1-mh', s)));
    const cells = EX1_ROWS.map(([nm, , col]) => {
      const r = [h('div', 'u6l1-mn', nm), h('div', 'u6l1-mc', ''), h('div', 'u6l1-mc', ''), h('div', 'u6l1-mc u6l1-mk', '')];
      r[0].style.color = col; r.forEach((e) => tb.appendChild(e)); return r;
    });
    add(stage, tb, tx, 30);
    const same = ks.every((k) => Math.abs(k - ks[0]) < 1e-9);
    const st1 = hide(stamp(stage, same ? (v === 'C' ? 'similar ✓ × 1' : `similar ✓ × ${ks[0]}`) : 'not similar ✗', { ok: same, x: tx + tw / 2, y: 330 }));
    const steps = [{ cap: `Example 1: the original and copy ${v}. Each small square is 1 unit.`, run: async (c) => { await anim(c, dC.g, [{ opacity: 0 }, { opacity: 1 }], 500); await c.pop(cTag); } }];
    if (v === 'C') {
      steps.push({ cap: 'Copy C is <b>flipped</b>. Flip it back so it faces the same way as the original.', run: (c) => tween(c, 1600, (u) => movePoly(dC, pc.map((p, i) => G([lerp(p[0], flipT[i][0], u), lerp(p[1], flipT[i][1], u)], 5.5)))) });
    }
    EX1_ROWS.forEach(([nm, i, col], r) => {
      const cs = EX1_SIDE[v][r], f = ks[r];
      steps.push({ cap: `The <b>${nm}</b>: ${oL[r]} → ${cL[r]}. That is <b>× ${f}</b>.`,
        run: async (c) => {
          const g1 = glow(hl, Po, i, col), g2 = glow(hl, dC.P, cs, col);
          await Promise.all([c.pop(pp(g1)), c.pop(pp(g2))]);
          cells[r][1].textContent = oL[r]; cells[r][2].textContent = cL[r]; cells[r][3].textContent = '× ' + f;
          await c.pop(cells[r][1]); await c.pop(cells[r][2]); await c.pop(cells[r][3]);
        } });
    });
    steps.push({ cap: same ? `Every length × ${ks[0]}: copy ${v} is <b>similar</b>${v === 'C' ? ' (same size: <b>congruent</b>)' : ''}.` : 'The numbers are <b>not</b> all the same: B is stretched sideways. <b>Not similar</b>.',
      run: async (c) => { if (!same) cells[1][3].classList.add('u6l1-bad'); await stampIn(c, st1); } });
    return steps;
  }
};

/* ======================================================================================
 * 2. Corresponding parts: the naming order (Examples 2 and 3)
 * ====================================================================================== */
const TRI = [[0, 0], [3, 0], [2.08, 2.67]], QUAD = [[0, 0], [4, 0], [5.32, 3.26], [0.62, 2.93]];
const PAIRS = {
  e2: { P: TRI, Q: tf(TRI, { dx: 8.9, dy: 3.0, rot: 160, sx: 1.35, sy: 1.35 }), back: { dx: 8.9, dy: 3.0, rot: 160, sx: 1.35, sy: 1.35 }, n1: 'ABC', n2: 'XYZ' },
  e3: { P: QUAD, Q: tf(QUAD, { dx: 11.2, sx: -0.7, sy: 0.7 }), back: { dx: 11.2, dy: 0, rot: 0, sx: -0.7, sy: 0.7 }, n1: 'ABCD', n2: 'EFGH' }
};
/** the names written one above the other, with arrows (HTML) → { el, cols: [[top, bottom]…] } */
function nameCols(host, n1, n2, x, y) {
  const el = h('div', 'u6l1-nc'); el.style.setProperty('--n', n1.length);
  const cols = [...n1].map((a, i) => { const col = h('div', 'u6l1-ncc'); col.innerHTML = `<span>${a}</span><i>↕</i><span>${n2[i]}</span>`; el.appendChild(col); return col; });
  add(host, el, x, y); return { el, cols };
}
const match = {
  title: 'Match the parts: read down the columns',
  height: 440,
  choices: [{ v: 'e2', label: 'Example 2 (turned)' }, { v: 'e3', label: 'Example 3 (flipped)' }],
  ask: (v) => (v === 'e2' ? `Example 2: ${T('\\triangle ABC\\sim\\triangle XYZ')}, ${T('\\angle A=52^\\circ')}, ${T('\\angle B=71^\\circ')}. Match the parts and find the angles.` : `Example 3: ${T('ABCD\\sim EFGH')}, ${T('\\angle A=78^\\circ')}, ${T('\\angle B=112^\\circ')}, ${T('\\angle C=64^\\circ')}. Find the angles and the matching sides.`),
  make(stage, v, ex) {
    const W = ex.W, H = 440, fw = Math.min(560, Math.round(W * 0.56)), svg = stageSvg(stage, W, H), d = PAIRS[v], tri = v === 'e2';
    const F = fitW(d.P.concat(d.Q), fw, 400, [46, 40, 40, 40]);
    const P = F.all(d.P), Q = F.all(d.Q);
    const D1 = drawPoly(svg, P, { names: [...d.n1], fill: FILL0 }), D2 = drawPoly(svg, Q, { names: [...d.n2], fill: FILL1 });
    const back = svgEl('g', {}, svg);   // the corner wedges: over the fills, under the angle labels
    const given = tri ? ['52°', '71°'] : ['78°', '112°', '64°'];
    const g0 = given.map((s, i) => angLab(svg, P, i, s, { r: tri ? 40 : 44 }));
    const px = fw + 26, NC = nameCols(stage, d.n1, d.n2, px, 14); hide(NC.el);
    const wP = [], wQ = [];
    const n = d.P.length;
    for (let i = 0; i < n; i++) { wP.push(hide(wedge(back, P, i, MC[i], 26))); wQ.push(hide(wedge(back, Q, i, MC[i], 26))); }
    const vals = tri ? [52, 71, 57] : [78, 112, 64, 106];
    const missing = hide(angLab(svg, P, n - 1, vals[n - 1] + '°', { r: tri ? 40 : 44, color: RED }));
    const qv = vals.map((a, i) => hide(angLab(svg, Q, i, a + '°', { r: tri ? 36 : 34, color: RED, size: 17 })));
    const eqY = 170;
    const eqA = hide(line(stage, tri ? T('\\angle C=180^\\circ-52^\\circ-71^\\circ=57^\\circ') : T('\\angle D=360^\\circ-78^\\circ-112^\\circ-64^\\circ=106^\\circ'), px, eqY, 'u6l1-eq' + (tri ? '' : ' u6l1-sm')));
    const eqB = hide(line(stage, tri ? T('\\angle X=52^\\circ,\\ \\angle Y=71^\\circ,\\ \\angle Z=57^\\circ') : T('\\angle E=78^\\circ,\\ \\angle F=112^\\circ,') + '<br>' + T('\\angle G=64^\\circ,\\ \\angle H=106^\\circ'), px, tri ? eqY + 56 : eqY + 70, 'u6l1-eq'));
    const hl = svgEl('g', {}, svg);
    const highlightCol = (c, i, on = true) => { NC.cols[i].classList.toggle('u6l1-on', on); NC.cols[i].style.setProperty('--c', MC[i]); return on ? pulse(c, NC.cols[i], 1.1, 380) : null; };
    const steps = [
      { cap: tri ? 'Example 2: △XYZ is <b>turned</b> around. We can’t match corners by where they sit on the page.' : 'Example 3: EFGH is <b>smaller</b> and <b>flipped</b> over. We can’t match corners by where they sit.',
        run: async (c) => { await pulse(c, pp(D2.g), 1.04, 500); } },
      { cap: `Write the two names one above the other: <b>${d.n1}</b> over <b>${d.n2}</b>. Read <b>down</b> the columns.`, run: (c) => c.pop(NC.el) }
    ];
    if (tri) {
      steps.push({ cap: `1st with 1st: ${T('\\angle A')} matches ${T('\\angle X')}.`, run: async (c) => { highlightCol(c, 0); await Promise.all([c.pop(wP[0]), c.pop(wQ[0])]); } });
      steps.push({ cap: `2nd with 2nd: ${T('\\angle B')} and ${T('\\angle Y')}. 3rd with 3rd: ${T('\\angle C')} and ${T('\\angle Z')}.`, run: async (c) => { for (const i of [1, 2]) { highlightCol(c, i); await Promise.all([c.pop(wP[i]), c.pop(wQ[i])]); } } });
    } else {
      steps.push({ cap: `${T('\\angle A')} matches ${T('\\angle E')}, ${T('\\angle B')} matches ${T('\\angle F')}, ${T('\\angle C')} matches ${T('\\angle G')}, and ${T('\\angle D')} matches ${T('\\angle H')}.`,
        run: async (c) => { for (let i = 0; i < 4; i++) { highlightCol(c, i); await Promise.all([c.pop(wP[i]), c.pop(wQ[i])]); } } });
    }
    steps.push({ cap: tri ? `First the missing angle of △ABC: the angles in a triangle add to 180°. ${T('\\angle C=57^\\circ')}.` : `First ${T('\\angle D')}: the angles in a quadrilateral add to 360°. ${T('\\angle D=106^\\circ')}.`,
      run: async (c) => { await c.pop(eqA); await c.pop(missing); } });
    steps.push({ cap: 'Corresponding angles are <b>equal</b>: copy each angle down its column.',
      run: async (c) => { for (const e of qv) await c.pop(e); await c.pop(eqB); } });
    if (tri) {
      const sides = [0, 1, 2].map((i) => [glow(hl, P, i, MC[i + 4], 11), glow(hl, Q, i, MC[i + 4], 11)]); sides.flat().forEach((e) => hide(pp(e)));
      const eqC = hide(line(stage, T('AB\\leftrightarrow XY,\\ \\ BC\\leftrightarrow YZ,\\ \\ CA\\leftrightarrow ZX'), px, eqY + 116, 'u6l1-eq u6l1-sm'));
      const eqD = hide(line(stage, T('\\dfrac{XY}{AB}=\\dfrac{YZ}{BC}=\\dfrac{ZX}{CA}'), px, eqY + 196, 'u6l1-eq u6l1-box'));
      steps.push({ cap: `Sides use two columns: ${T('AB')} (1st, 2nd) matches ${T('XY')}, ${T('BC')} matches ${T('YZ')}, ${T('CA')} matches ${T('ZX')}.`,
        run: async (c) => { for (const s of sides) await Promise.all([c.pop(s[0]), c.pop(s[1])]); await c.pop(eqC); } });
      steps.push({ cap: 'The three equal ratios, <b>new over original</b> (part c).', run: (c) => c.pop(eqD) });
    } else {
      const sBC = [glow(hl, P, 1, PURPLE, 12), glow(hl, Q, 1, PURPLE, 12)], sHE = [glow(hl, P, 3, TEAL, 12), glow(hl, Q, 3, TEAL, 12)];
      [...sBC, ...sHE].forEach((e) => hide(pp(e)));
      const eqC = hide(line(stage, `${T('BC')}: 2nd and 3rd letters → ${T('FG')}`, px, eqY + 156, 'u6l1-eq u6l1-sm'));
      const eqD = hide(line(stage, `${T('HE')}: 4th and 1st letters → ${T('DA')}`, px, eqY + 206, 'u6l1-eq u6l1-sm'));
      steps.push({ cap: `${T('BC')}: ${T('B')} is the 2nd letter and ${T('C')} the 3rd. The 2nd and 3rd letters of EFGH make ${T('FG')}.`,
        run: async (c) => { await Promise.all([pulse(c, NC.cols[1], 1.15, 420), pulse(c, NC.cols[2], 1.15, 420)]); await Promise.all([c.pop(sBC[0]), c.pop(sBC[1])]); await c.pop(eqC); } });
      steps.push({ cap: `${T('HE')}: ${T('H')} is the 4th letter and ${T('E')} the 1st. In ABCD that is ${T('DA')}.`,
        run: async (c) => { await Promise.all([pulse(c, NC.cols[3], 1.15, 420), pulse(c, NC.cols[0], 1.15, 420)]); await Promise.all([c.pop(sHE[0]), c.pop(sHE[1])]); await c.pop(eqD); } });
    }
    void g0;
    return steps;
  }
};

/* ======================================================================================
 * 2. (Full) Turn or flip the copy back onto the original
 * ====================================================================================== */
const turnback = {
  title: 'Turn it back: matching letters land on each other',
  height: 380,
  choices: [{ v: 'e2', label: 'Example 2 (turned)' }, { v: 'e3', label: 'Example 3 (flipped)' }],
  ask: (v) => (v === 'e2' ? `Why does ${T('X')} match ${T('A')} in ${T('\\triangle ABC\\sim\\triangle XYZ')}?` : `Why does ${T('E')} match ${T('A')} in ${T('ABCD\\sim EFGH')}?`),
  make(stage, v, ex) {
    const W = ex.W, H = 380, svg = stageSvg(stage, W, H), d = PAIRS[v], tri = v === 'e2', b = d.back;
    const c1w = cen(d.P), cqw = cen(d.Q), rq = Math.max(...d.Q.map((q) => Math.hypot(q[0] - cqw[0], q[1] - cqw[1])));
    const ring = [0, 90, 180, 270].map((a) => [c1w[0] + rq * Math.cos(a * RAD), c1w[1] + rq * Math.sin(a * RAD)]);
    const F = fitW(d.P.concat(d.Q, ring), W - 260, H, [44, 30, 50, 64]);
    const P = F.all(d.P);
    const D1 = drawPoly(svg, P, { names: [...d.n1], fill: FILL0 });
    const ghost = svgEl('g', { opacity: 0.85 }, svg);
    const D2 = drawPoly(ghost, F.all(d.Q), { names: [...d.n2], fill: FILL1, color: BROWN, nameGap: 44 });
    D2.names.forEach((t) => t.setAttribute('fill', BROWN));
    D2.fill.setAttribute('fill-opacity', '.75');
    let s = { dx: b.dx, dy: b.dy, rot: b.rot, sx: b.sx, sy: b.sy };
    const set = (o) => { s = o; movePoly(D2, F.all(tf(d.P, o)), { nameGap: 44 }); };
    const go = (to, ms) => (c) => { const s0 = Object.assign({}, s); return tween(c, ms, (u) => set({ dx: lerp(s0.dx, to.dx, u), dy: lerp(s0.dy, to.dy, u), rot: lerp(s0.rot, to.rot, u), sx: lerp(s0.sx, to.sx, u), sy: lerp(s0.sy, to.sy, u) })); };
    const c1 = cen(d.P), cq = cen(d.Q);
    const pairs = [...d.n1].map((a, i) => hide(lab(stage, `<span>${d.n2[i]} lands on ${a}</span>`, W - 120, 70 + i * 52, 'u6l1-pill')));
    pairs.forEach((p, i) => p.inner.style.setProperty('--c', MC[i]));
    const st1 = hide(stamp(stage, 'same shape ✓', { ok: true, x: W - 120, y: 70 + d.n1.length * 52 + 30, size: 'sm' }));
    if (tri) {
      // slide the centre over, turn it back, then shrink it
      const at1 = { dx: b.dx - (cq[0] - c1[0]), dy: b.dy - (cq[1] - c1[1]), rot: 160, sx: 1.35, sy: 1.35 };
      const sh = (o) => { const C = cen(tf(d.P, o)); return { dx: o.dx - (C[0] - c1[0]), dy: o.dy - (C[1] - c1[1]), rot: o.rot, sx: o.sx, sy: o.sy }; };
      return [
        { cap: '△XYZ is turned around and bigger. Slide it over △ABC.', run: go(sh(at1), 1300) },
        { cap: '<b>Turn</b> it back, 160°.', run: async (c) => { const s0 = Object.assign({}, s); await tween(c, 1500, (u) => set(sh({ dx: 0, dy: 0, rot: lerp(s0.rot, 0, u), sx: 1.35, sy: 1.35 }))); } },
        { cap: '<b>Shrink</b> it: divide every length by 1.35.', run: go({ dx: 0, dy: 0, rot: 0, sx: 1, sy: 1 }, 1300) },
        { cap: `It fits exactly: ${T('X')} lands on ${T('A')}, ${T('Y')} on ${T('B')}, ${T('Z')} on ${T('C')}. The naming order tells us this without moving anything.`, run: async (c) => { for (const p of pairs) await c.pop(p); await stampIn(c, st1); } }
      ];
    }
    const sh = (o) => { const C = cen(tf(d.P, o)); return { dx: o.dx - (C[0] - c1[0]), dy: o.dy - (C[1] - c1[1]), rot: 0, sx: o.sx, sy: o.sy }; };
    return [
      { cap: 'EFGH is flipped over and smaller. Slide it over ABCD.', run: go(sh({ dx: b.dx, dy: 0, sx: -0.7, sy: 0.7 }), 1300) },
      { cap: '<b>Flip</b> it back over, like turning a page.', run: async (c) => { await tween(c, 1500, (u) => set(sh({ dx: 0, dy: 0, sx: lerp(-0.7, 0.7, u), sy: 0.7 }))); } },
      { cap: '<b>Grow</b> it: divide every length by 0.7.', run: async (c) => { await tween(c, 1300, (u) => set(sh({ dx: 0, dy: 0, sx: lerp(0.7, 1, u), sy: lerp(0.7, 1, u) }))); } },
      { cap: `It fits exactly: ${T('E')} on ${T('A')}, ${T('F')} on ${T('B')}, ${T('G')} on ${T('C')}, ${T('H')} on ${T('D')}: the naming order.`, run: async (c) => { for (const p of pairs) await c.pop(p); await stampIn(c, st1); } }
    ];
  }
};

/* ======================================================================================
 * 3. The scale factor: bars, tiles and a k meter (Examples 4 and 5)
 * ====================================================================================== */
const KF = {
  a: { o: 4, n: 10, u: 'cm' }, b: { o: 12, n: 3, u: 'm' }, c: { o: 15, n: 6, u: 'cm' }, d: { o: 7, n: 7, u: 'in' }, e: { o: 2.4, n: 8.4, u: 'ft' },
  logo: { o: 5, n: 120, u: 'cm', given: ['5 cm', '1.2 m'], conv: '1.2 m = 120 cm', who: ['letter', 'banner'] },
  boxcar: { o: 1566, n: 18, u: 'cm', given: ['15.66 m', '18 cm'], conv: '15.66 m = 1566 cm', who: ['real boxcar', 'model'], flip: 87 }
};
const kfactor = {
  title: 'The scale factor: k = new ÷ original',
  height: 410,
  choices: [{ sep: 'Example 4' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }, { v: 'c', label: '(c)' }, { v: 'd', label: '(d)' }, { v: 'e', label: '(e)' },
    { sep: 'Example 5' }, { v: 'logo', label: '(a) logo' }, { v: 'boxcar', label: '(b) boxcar' }],
  ask: (v) => (KF[v].given ? (v === 'logo' ? 'Example 5(a): a logo is 5 cm wide on a letter and 1.2 m wide on a banner. Find the scale factor from the letter to the banner.' : 'Example 5(b): a model boxcar is 18 cm long; the real boxcar is 15.66 m long. Find the scale factor from the real boxcar to the model.')
    : `Example 4(${v}): original ${KF[v].o} ${KF[v].u}, new ${KF[v].n} ${KF[v].u}. Find ${T('k')}. Enlargement, reduction or same size?`),
  make(stage, v, ex) {
    const W = ex.W, H = 410, svg = stageSvg(stage, W, H), d = KF[v], k = d.n / d.o, kT = d.flip ? '0.0114\\ldots' : tn(rr(k, 4));
    const x0 = 190, maxL = Math.min(680, W - x0 - 60), sc = maxL / Math.max(d.o, d.n), yO = 46, yN = 112, bh = 34;
    const oName = d.who ? d.who[0] : 'original', nName = d.who ? d.who[1] : 'new';
    const sub = (s) => (d.who ? `<br><span class="u6l1-mut">${s}</span>` : '');
    const nm1 = line(stage, `<b>Original</b>${sub(oName)}`, 20, yO + bh / 2, 'u6l1-bn'), nm2 = line(stage, `<b>New</b>${sub(nName)}`, 20, yN + bh / 2, 'u6l1-bn');
    void nm1; void nm2;
    const bar = (y, L, col) => { const r = svgEl('rect', { x: x0, y, width: Math.max(2, L * sc), height: bh, rx: 6, fill: col, 'fill-opacity': 0.28, stroke: col, 'stroke-width': 2.5 }, svg); r.style.transformBox = 'fill-box'; r.style.transformOrigin = 'left center'; return r; };
    const bO = hide(bar(yO, d.o, BLUE)), bN = hide(bar(yN, d.n, AMBER));
    const vO = txt(svg, x0 + Math.max(2, d.o * sc) + 12, yO + bh / 2, d.given ? d.given[0] : `${d.o} ${d.u}`, { size: 22, anchor: 'start', color: BLUE });
    const vN = txt(svg, x0 + Math.max(2, d.n * sc) + 12, yN + bh / 2, d.given ? d.given[1] : `${d.n} ${d.u}`, { size: 22, anchor: 'start', color: AMBER });
    if (d.given) { [vO, vN].forEach((t) => t.setAttribute('x', x0 + 12)); }
    hide(vO, vN);
    // tiles: copies of the shorter bar laid along the longer one
    const big = d.n >= d.o ? 'n' : 'o', small = big === 'n' ? d.o : d.n, bigY = big === 'n' ? yN : yO, cnt = Math.floor(d[big] / small + 1e-9), part = rr(d[big] / small - cnt, 6);
    const tiles = svgEl('g', {}, svg); hide(tiles);
    for (let i = 0; i < cnt; i++) svgEl('rect', { x: x0 + i * small * sc, y: bigY - 3, width: small * sc, height: bh + 6, fill: 'none', stroke: big === 'n' ? BLUE : AMBER, 'stroke-width': cnt > 30 ? 1 : 2.4, rx: cnt > 30 ? 0 : 4 }, tiles);
    if (part > 1e-6) svgEl('rect', { x: x0 + cnt * small * sc, y: bigY - 3, width: part * small * sc, height: bh + 6, fill: 'none', stroke: big === 'n' ? BLUE : AMBER, 'stroke-width': 2.4, 'stroke-dasharray': '5 4', rx: 4 }, tiles);
    const fits = d.n === d.o ? 'The two sides are the same length.' : big === 'n' ? `The original fits along the new side <b>${pn(rr(k, 4))}</b> times.` : `The new side fits along the original <b>${pn(rr(d.o / d.n, 4))}</b> times.`;
    // the equation and the meter
    const eq = hide(lab(stage, T(`k=\\dfrac{\\text{new}}{\\text{original}}=\\dfrac{${tn(d.n)}}{${tn(d.o)}}=${kT}`), W / 2, 222, 'u6l1-eq u6l1-big'));
    const eqF = d.flip ? hide(lab(stage, T(`${tn(d.o)}\\div${tn(d.n)}=${d.flip}\\ \\Rightarrow\\ k=\\tfrac{1}{${d.flip}}`), W / 2, 222, 'u6l1-eq u6l1-big')) : null;
    const mx0 = 150, mx1 = W - 110, my = 330, km = 4, X = (kk) => mx0 + (mx1 - mx0) * Math.min(kk, km) / km;
    const meter = svgEl('g', {}, svg);
    svgEl('rect', { x: mx0, y: my - 14, width: X(1) - mx0, height: 28, fill: '#fde6c8' }, meter);
    svgEl('rect', { x: X(1), y: my - 14, width: mx1 - X(1), height: 28, fill: '#dcefe4' }, meter);
    path(meter, `M${mx0} ${my + 14}H${mx1 + 18}`, { width: 2.4, cls: '' });
    for (let i = 0; i <= km; i++) { path(meter, `M${X(i)} ${my + 8}V${my + 22}`, { width: 2.4, cls: '' }); txt(meter, X(i), my + 38, String(i), { size: 18 }); }
    path(meter, `M${X(1)} ${my - 22}V${my + 22}`, { width: 4, stroke: BROWN, cls: '' });
    txt(meter, (mx0 + X(1)) / 2, my, 'reduction', { size: 17, color: AMBER, halo: false });
    txt(meter, (X(1) + mx1) / 2, my, 'enlargement', { size: 17, color: GREEN, halo: false });
    txt(meter, X(1), my + 60, 'same size', { size: 16, color: BROWN });
    txt(meter, mx0 - 40, my + 2, 'k', { size: 24, italic: true });
    const ptr = svgEl('g', {}, svg); hide(ptr);
    const px = X(k), off = k > km;
    path(ptr, `M${px} ${my - 16}l-10 -18h20z`, { fill: RED, stroke: RED, width: 2, cls: '' });
    const near0 = !off && px < mx0 + 50;
    txt(ptr, px + (off ? -12 : near0 ? -8 : 0), my - 50, off ? `k = ${pn(rr(k, 4))} →` : d.flip ? `k = 1/${d.flip}` : `k = ${pn(rr(k, 4))}`, { size: 19, color: RED, anchor: off ? 'end' : near0 ? 'start' : 'middle' });
    const type = Math.abs(k - 1) < 1e-9 ? 'same size' : k > 1 ? 'enlargement' : 'reduction';
    const st1 = hide(stamp(stage, type, { ok: k > 1 ? true : k < 1 ? null : true, x: W - 120, y: 222, size: 'sm' }));
    const grow = async (c) => { bO.style.opacity = 1; bN.style.opacity = 1; await Promise.all([anim(c, bO, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], 700), anim(c, bN, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], 700, { delay: 250 })]); };
    const est = Math.abs(k - 1) < 1e-9 ? 'Estimate: the same length, so <b>k = 1</b>.' : k > 1 ? 'Estimate: the new side is <b>longer</b>, so k is <b>more than 1</b>.' : 'Estimate: the new side is <b>shorter</b>, so k is <b>less than 1</b>.';
    const steps = [];
    if (d.given) {
      steps.push({ cap: v === 'logo' ? 'The letter is the original (5 cm). The banner is the new figure (1.2 m).' : 'The real boxcar is the original (15.66 m). The model is the new figure (18 cm).', run: async (c) => { await c.pop(vO); await c.pop(vN); } });
      steps.push({ cap: `<b>Same units first:</b> ${d.conv}.`, run: async (c) => { vO.textContent = `${pn(d.o)} ${d.u}`; vN.textContent = `${pn(d.n)} ${d.u}`; vO.setAttribute('x', x0 + Math.max(2, d.o * sc) + 12); vN.setAttribute('x', x0 + Math.max(2, d.n * sc) + 12); await grow(c); await c.pop(vO); await c.pop(vN); } });
    } else {
      steps.push({ cap: `Original side <b>${d.o} ${d.u}</b>, new side <b>${d.n} ${d.u}</b>. ${est}`, run: async (c) => { await grow(c); await c.pop(vO); await c.pop(vN); } });
    }
    steps.push({ cap: fits, run: async (c) => { tiles.style.opacity = 1; await anim(c, tiles, [{ opacity: 0 }, { opacity: 1 }], 600); } });
    steps.push({ cap: `${T('k')} = new ÷ original = ${tn(d.n)} ÷ ${tn(d.o)} = <b>${d.flip ? '0.0114…' : pn(rr(k, 4))}</b>`, run: (c) => c.pop(eq) });
    if (d.flip) steps.push({ cap: `A tiny decimal is hard to picture. Flip it: 1566 ÷ 18 = 87, so ${T('k=\\tfrac{1}{87}')}. The model is ${T('\\tfrac{1}{87}')} of the real size.`, run: async (c) => { await op(c, eq, 0, 250); await c.pop(eqF); } });
    steps.push({ cap: Math.abs(k - 1) < 1e-9 ? `${T('k=1')}: the <b>same size</b>. The figures are congruent.` : k > 1 ? `${T('k')} is more than 1: an <b>enlargement</b>.${v === 'logo' ? ' The banner logo is 24 times as wide.' : ''}` : `${T('k')} is less than 1: a <b>reduction</b>.${v === 'b' ? ` ${T('0.25=\\tfrac14')}: each new side is one quarter of the original.` : ''}`,
      run: async (c) => { ptr.style.opacity = 1; await anim(c, ptr, [{ opacity: 0, transform: `translateX(${mx0 - px}px)` }, { opacity: 1, transform: 'none' }], 900); await stampIn(c, st1); } });
    return steps;
  }
};

/* ======================================================================================
 * 3. Hands-on: grow and shrink a shape (live ratio tags)
 * ====================================================================================== */
const TOOL_SHAPES = {
  house: { label: 'House', pts: [[0, 0], [6, 0], [6, 3], [3, 7], [0, 3]], names: 'ABCDE' },
  L: { label: 'L shape', pts: [[0, 0], [4, 0], [4, 2], [2, 2], [2, 5], [0, 5]], names: 'ABCDEF' },
  tri: { label: 'Triangle', pts: [[0, 0], [4, 0], [0, 3]], names: 'ABC' }
};
(function tool() {
  const host = document.getElementById('u6l1-tool'); if (!host) return;
  const W = 960, H = 404, u = 19, base = 356, x0 = 40;
  const wrap = h('div', 'u6l1-tw'); host.appendChild(wrap);
  const svg = svgEl('svg', { class: 'u6l1-svg', width: W, height: H, viewBox: `0 0 ${W} ${H}` }); wrap.appendChild(svg);
  const gridD = []; for (let x = 0; x <= W; x += u) gridD.push(`M${x} 0V${H}`); for (let y = base; y >= 0; y -= u) gridD.push(`M0 ${y}H${W}`);
  path(svg, gridD.join(''), { stroke: '#eceef2', width: 1, cls: '' });
  const layer = svgEl('g', {}, svg);
  const ctl = h('div', 'u6l1-tctl'), shp = h('div', 'u6l1-tbtns'), chips = h('div', 'u6l1-tchips'), verdict = h('div', 'u6l1-tverd');
  const mk = (name, min, max, step, val) => {
    const row = h('label', 'u6l1-trow'); row.innerHTML = `<span class="u6l1-tl">${name}</span>`;
    const inp = h('input'); Object.assign(inp, { type: 'range', min, max, step, value: val }); inp.setAttribute('data-tap', '');
    const out = h('b', 'u6l1-tv'); row.append(inp, out); ctl.appendChild(row); return { inp, out };
  };
  const sk = mk('k (every side)', 0.5, 2.5, 0.1, 1.5), ss = mk('stretch sideways', 1, 2, 0.1, 1);
  wrap.append(shp, ctl, chips, verdict);
  let cur = 'house';
  Object.entries(TOOL_SHAPES).forEach(([key, s]) => { const b = h('button', 'pill small', s.label); b.type = 'button'; b.setAttribute('data-tap', ''); b.onclick = () => { cur = key; draw(); }; b.dataset.k = key; shp.appendChild(b); });
  const fmt1 = (v) => String(Math.round(v * 10 + 1e-9) / 10);
  function draw() {
    const S = TOOL_SHAPES[cur], P0 = S.pts, n = P0.length, k = +sk.inp.value, st = +ss.inp.value;
    sk.out.textContent = k.toFixed(1); ss.out.textContent = st === 1 ? 'none' : '× ' + st.toFixed(1);
    shp.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.k === cur)));
    layer.innerHTML = '';
    const w0 = Math.max(...P0.map((p) => p[0])), P1 = P0.map(([x, y]) => [x * k * st, y * k]);
    const So = P0.map(([x, y]) => [x0 + x * u, base - y * u]), xi = x0 + w0 * u + 80, Si = P1.map(([x, y]) => [xi + x * u, base - y * u]);
    const Do = drawPoly(layer, So, { names: [...S.names], fill: FILL0, nameSize: 18, nameGap: 15 });
    const Di = drawPoly(layer, Si, { names: [...S.names].map((c) => c + '′'), fill: FILL1, nameSize: 18, nameGap: 15 });
    const lo = P0.map((p, i) => sideLen(P0, i)), li = P1.map((p, i) => sideLen(P1, i)), rs = li.map((l, i) => l / lo[i]);
    [Do, Di].forEach((D, w) => D.sides.forEach((s, i) => { s.setAttribute('stroke', MC[i]); s.setAttribute('stroke-width', 3.6); sideLab(layer, D.P[i], D.P[(i + 1) % n], D.C, fmt1(w ? li[i] : lo[i]), { size: 16 }).setAttribute('fill', MC[i]); }));
    txt(layer, x0 + w0 * u / 2, base + 40, 'original', { size: 16, color: '#6a7182' }); txt(layer, xi + Math.max(...P1.map((p) => p[0])) * u / 2, base + 40, 'new figure', { size: 16, color: '#6a7182' });
    chips.innerHTML = '';
    rs.forEach((r, i) => { const nm = S.names[i] + S.names[(i + 1) % n]; const e = h('span', 'u6l1-tchip', `${nm.split('').join('′')}′ ÷ ${nm} = ${fmt1(li[i])} ÷ ${fmt1(lo[i])} = <b>${(Math.round(r * 100) / 100).toFixed(2).replace(/\.?0+$/, '')}</b>`); e.style.setProperty('--c', MC[i]); chips.appendChild(e); });
    const same = rs.every((r) => Math.abs(r - rs[0]) < 1e-6);
    verdict.className = 'u6l1-tverd ' + (same ? 'u6l1-ok' : 'u6l1-no');
    verdict.innerHTML = same ? `<b>Similar.</b> Every ratio is ${T('k=' + k.toFixed(1).replace(/\.0$/, ''))}: ${Math.abs(k - 1) < 1e-9 ? 'the <b>same size</b> (congruent).' : k > 1 ? 'an <b>enlargement</b>.' : 'a <b>reduction</b>.'}`
      : '<b>Not similar.</b> The ratios are <b>not</b> all the same: the shape is stretched. (The corners changed too.)';
  }
  [sk.inp, ss.inp].forEach((i) => i.addEventListener('input', draw));
  draw();
})();

/* ======================================================================================
 * 4. Missing sides: the 4 steps (Example 6 check, and a reduction)
 * ====================================================================================== */
const TRI2 = [[0, 0], [16, 0], [6.625, Math.sqrt(100 - 6.625 * 6.625)]];
const MISS = {
  ex6: { P: [[0, 0], [8, 0], [7.48, 4.97], [3.08, 5.15]], tfm: { dx: 25, dy: 7.4, rot: 180, sx: 1.5, sy: 1.5 }, n1: 'ABCD', n2: 'PQRS',
    l1: ['8 cm', '5 cm', '?', '6 cm'], l2: ['12 cm', '?', '6.6 cm', '?'], kp: 0, o: [8, 5, 4.4, 6], k: 1.5,
    finds: [{ i: 1, w: 'n', nm: 'QR', of: 'BC' }, { i: 3, w: 'n', nm: 'SP', of: 'DA' }, { i: 2, w: 'o', nm: 'CD', of: 'RS' }] },
  red: { P: TRI2, tfm: { dx: 35, dy: 0, sx: -0.75, sy: 0.75 }, n1: 'ABC', n2: 'DEF', l1: ['16 cm', '12 cm', '?'], l2: ['12 cm', '?', '7.5 cm'], kp: 0, o: [16, 12, 10], k: 0.75,
    finds: [{ i: 1, w: 'n', nm: 'EF', of: 'BC' }, { i: 2, w: 'o', nm: 'CA', of: 'FD' }] }
};
const missing = {
  title: 'Missing sides: find k, then multiply or divide',
  height: 450,
  choices: [{ v: 'ex6', label: 'Example 6 check' }, { v: 'red', label: 'A reduction' }],
  ask: (v) => (v === 'ex6' ? `Example 6: ${T('ABCD\\sim PQRS')}. Find ${T('k')}, then ${T('QR')}, ${T('SP')} and ${T('CD')}.` : `${T('\\triangle ABC\\sim\\triangle DEF')}. Find ${T('k')}, then ${T('EF')} and ${T('CA')}.`),
  make(stage, v, ex) {
    const W = ex.W, H = 450, d = MISS[v], fw = Math.max(520, W - 340), svg = stageSvg(stage, W, H), n = d.P.length, k = d.k;
    const Qw = tf(d.P, d.tfm), F = fitW(d.P.concat(Qw), fw, 420, [50, 50, 50, 50]);
    const P = F.all(d.P), Q = F.all(Qw);
    const hl = svgEl('g', {}, svg);
    const D1 = drawPoly(svg, P, { names: [...d.n1], labels: d.l1, fill: FILL0 }), D2 = drawPoly(svg, Q, { names: [...d.n2], labels: d.l2, fill: FILL1 });
    const px = fw + 24, NC = nameCols(stage, d.n1, d.n2, px, 10); hide(NC.el);
    const nm = (w, i) => (w === 1 ? d.n1 : d.n2)[i] + (w === 1 ? d.n1 : d.n2)[(i + 1) % n];
    const gl = Array.from({ length: n }, (_, i) => [hide(pp(glow(hl, P, i, MC[i], 11))), hide(pp(glow(hl, Q, i, MC[i], 11)))]);
    const kp = d.kp, oK = d.o[kp], nK = rr(d.o[kp] * k);
    const lines = [];
    const eqK = hide(line(stage, T(`k=\\dfrac{${nm(2, kp)}}{${nm(1, kp)}}=\\dfrac{${tn(nK)}}{${tn(oK)}}=${tn(k)}`), px, 150, 'u6l1-eq'));
    const fl = d.finds.map((f, j) => {
      const o = d.o[f.i], nv = rr(o * k);
      const s = f.w === 'n' ? `${f.nm}=${tn(k)}\\times ${tn(o)}=${tn(nv)}\\text{ cm}` : `${f.nm}=${tn(nv)}\\div ${tn(k)}=${tn(o)}\\text{ cm}`;
      return { f, o, nv, el: hide(line(stage, T(s), px, 214 + j * 52, 'u6l1-eq')) };
    });
    lines.push(eqK);
    const longer = k > 1, st1 = hide(stamp(stage, longer ? 'new sides longer ✓' : 'new sides shorter ✓', { ok: true, x: px + (W - px) / 2, y: 214 + d.finds.length * 52 + 34, size: 'sm' }));
    const steps = [
      { cap: v === 'ex6' ? 'Example 6: PQRS is turned around. Two sides of each figure are missing.' : 'DEF is flipped over and smaller. One side of each triangle is missing.', run: async (c) => { await pulse(c, pp(D2.g), 1.04, 480); } },
      { cap: `<b>Step 1.</b> Match the sides with the naming order: ${d.n1} over ${d.n2}.`, run: async (c) => { await c.pop(NC.el); for (const g of gl) await Promise.all([c.pop(g[0]), c.pop(g[1])]); } },
      { cap: `<b>Step 2.</b> ${T(nm(1, kp))} and ${T(nm(2, kp))} are both known: ${T('k')} = ${tn(nK)} ÷ ${tn(oK)} = <b>${tn(k)}</b> (${longer ? 'an enlargement' : 'a reduction'}).`,
        run: async (c) => { await Promise.all([pulse(c, D1.labels[kp], 1.4, 500), pulse(c, D2.labels[kp], 1.4, 500)]); await c.pop(eqK); } }
    ];
    fl.forEach(({ f, o, nv, el }, j) => {
      const tgt = f.w === 'n' ? D2.labels[f.i] : D1.labels[f.i], val = f.w === 'n' ? nv : o;
      steps.push({ cap: f.w === 'n' ? `${j === 0 ? '<b>Step 3.</b> ' : ''}${T(f.nm)} is in the <b>new</b> figure: <b>multiply</b>. ${T(f.nm)} = ${tn(k)} × ${T(f.of)} = ${tn(k)} × ${tn(o)} = <b>${tn(nv)} cm</b>.`
        : `${T(f.nm)} is in the <b>original</b>: <b>divide</b>. ${T(f.nm)} = ${T(f.of)} ÷ ${tn(k)} = ${tn(nv)} ÷ ${tn(k)} = <b>${tn(o)} cm</b>.`,
      run: async (c) => { await c.pop(el); tgt.textContent = tn(val) + ' cm'; tgt.setAttribute('fill', RED); await c.pop(tgt); } });
    });
    steps.push({ cap: `<b>Step 4.</b> Check: ${longer ? 'an enlargement, so every new side is <b>longer</b>' : 'a reduction, so every new side is <b>shorter</b>'} than its match. ✓`, run: (c) => stampIn(c, st1) });
    return steps;
  }
};

/* ======================================================================================
 * 4. (Full) The same sides with a proportion
 * ====================================================================================== */
const PROP = {
  QR: { pair: 'QR\\leftrightarrow BC=5,\\quad PQ=12\\leftrightarrow AB=8', eq: '\\dfrac{x}{5}=\\dfrac{12}{8}', top: ['new', 'new'], bot: ['original', 'original'], mul: 5, res: 'x=\\dfrac{12\\times5}{8}=7.5', same: '1.5\\times5=7.5', cap1: 'QR (new) matches BC = 5. PQ = 12 (new) matches AB = 8.', capR: '12 × 5 ÷ 8 = <b>7.5 cm</b>' },
  SP: { pair: 'SP\\leftrightarrow DA=6,\\quad PQ=12\\leftrightarrow AB=8', eq: '\\dfrac{x}{6}=\\dfrac{12}{8}', top: ['new', 'new'], bot: ['original', 'original'], mul: 6, res: 'x=\\dfrac{12\\times6}{8}=9', same: '1.5\\times6=9', cap1: 'SP (new) matches DA = 6. PQ = 12 (new) matches AB = 8.', capR: '12 × 6 ÷ 8 = <b>9 cm</b>' },
  CD: { pair: 'CD\\leftrightarrow RS=6.6,\\quad AB=8\\leftrightarrow PQ=12', eq: '\\dfrac{x}{6.6}=\\dfrac{8}{12}', top: ['original', 'original'], bot: ['new', 'new'], mul: 6.6, res: 'x=\\dfrac{8\\times6.6}{12}=4.4', same: '6.6\\div1.5=4.4', cap1: 'CD (original) matches RS = 6.6. AB = 8 (original) matches PQ = 12.', capR: '8 × 6.6 ÷ 12 = <b>4.4 cm</b>' }
};
const proportion = {
  title: 'Another way: a proportion',
  height: 360,
  choices: [{ sep: 'Example 6' }, { v: 'QR', label: T('QR') }, { v: 'SP', label: T('SP') }, { v: 'CD', label: T('CD') }],
  ask: (v) => `Example 6: find ${T(v)} with a proportion. (${T('ABCD\\sim PQRS')}, ${T('AB=8')}, ${T('PQ=12')}.)`,
  make(stage, v, ex) {
    const W = ex.W, d = PROP[v], cx = W / 2 - 60;
    const l1 = hide(lab(stage, T(d.pair), W / 2, 36, 'u6l1-eq'));
    const l2 = hide(lab(stage, T(d.eq), cx, 140, 'u6l1-eq u6l1-huge'));
    const tags = hide(lab(stage, T(`\\dfrac{\\text{${d.top[0]}}}{\\text{${d.bot[0]}}}`) + ' on both sides', cx + 340, 140, 'u6l1-eq u6l1-tagb'));
    const m1 = hide(lab(stage, `× ${String(d.mul)}`, cx - 150, 140, 'u6l1-pill u6l1-red')), m2 = hide(lab(stage, `× ${String(d.mul)}`, cx + 150, 140, 'u6l1-pill u6l1-red'));
    const l3 = hide(lab(stage, T(d.res), cx, 250, 'u6l1-eq u6l1-huge'));
    const st1 = hide(stamp(stage, 'same answer ✓', { ok: true, x: W - 150, y: 316, size: 'sm' }));
    const l4 = hide(lab(stage, `Scale factor way: ${T(d.same)}`, cx, 318, 'u6l1-eq'));
    return [
      { cap: d.cap1, run: (c) => c.pop(l1) },
      { cap: v === 'CD' ? 'CD is in the <b>original</b>, so put the original on top: original over new on both sides. Call the missing side x.' : 'New over original on both sides. Call the missing side x.', run: async (c) => { await c.pop(l2); await c.pop(tags); } },
      { cap: `Get x alone: <b>multiply both sides by ${String(d.mul)}</b>.`, run: async (c) => { await c.pop(m1); await c.pop(m2); } },
      { cap: `x = ${d.capR}`, run: async (c) => { await Promise.all([op(c, m1, 0), op(c, m2, 0)]); await c.pop(l3); } },
      { cap: 'Both methods give the same answer.', run: async (c) => { await c.pop(l4); await stampIn(c, st1); } }
    ];
  }
};

/* ======================================================================================
 * 4. The scale-factor machine (Example 7 checks)
 * ====================================================================================== */
function gear(parent, cx, cy, r, teeth, col) {
  const g = svgEl('g', {}, parent); g.style.transformBox = 'view-box'; g.style.transformOrigin = `${cx}px ${cy}px`;
  const pts = []; for (let i = 0; i < teeth * 4; i++) { const a = (i / (teeth * 4)) * 360, rr2 = (i % 4 < 2) ? r : r * 0.8; pts.push(A([cx, cy], a + 360 / teeth / 8, rr2)); }
  path(g, polyD(pts), { fill: col, stroke: '#3a4254', width: 2, cls: '' });
  svgEl('circle', { cx, cy, r: r * 0.28, fill: '#fff', stroke: '#3a4254', 'stroke-width': 2 }, g);
  return g;
}
/** a small picture over each side of the machine: a photo, a poster, a model truck or the real truck (bottom centre at x, y) */
function icon(parent, kind, x, y) {
  const g = grp(parent);
  if (kind === 'photo' || kind === 'poster') {
    const w = kind === 'photo' ? 40 : 80, hh = kind === 'photo' ? 27 : 54;
    svgEl('rect', { x: x - w / 2, y: y - hh, width: w, height: hh, fill: '#dff0fb', stroke: INK, 'stroke-width': 2.5 }, g);
    path(g, `M${x - w / 2} ${y - hh * 0.25}Q${x - w / 6} ${y - hh * 0.45} ${x + w / 2} ${y - hh * 0.3}V${y}H${x - w / 2}Z`, { fill: '#9ccf7a', stroke: 'none', cls: '' });
    svgEl('circle', { cx: x, cy: y - hh * 0.5, r: hh * 0.2, fill: '#c98a4b' }, g);
  } else {
    const s = kind === 'model' ? 0.42 : 1, t = grp(g, { transform: `translate(${x - 50 * s} ${y}) scale(${s})` });
    svgEl('rect', { x: 0, y: -36, width: 60, height: 24, rx: 3, fill: '#c93a33', stroke: INK, 'stroke-width': 2.5 }, t);
    path(t, 'M60 -12V-48H86L100 -30V-12Z', { fill: '#c93a33', stroke: INK, width: 2.5, cls: '' });
    svgEl('rect', { x: 66, y: -43, width: 16, height: 11, fill: '#dff0fb', stroke: INK, 'stroke-width': 1.8 }, t);
    [18, 80].forEach((wx) => svgEl('circle', { cx: wx, cy: -9, r: 9, fill: INK, stroke: '#fff', 'stroke-width': 2 }, t));
  }
  return g;
}
const MACH = {
  poster: { top: 'Photo 10 cm × 15 cm → poster, short side 60 cm', kcap: `${T('k')} = new ÷ original = 60 ÷ 10 = <b>6</b>. Set the machine to <b>× 6</b>.`, op: '× 6', inp: '15 cm', out: '90 cm', from: 'photo', to: 'poster',
    cap0: 'The photo is the original. The poster is the new figure. Short sides: 10 cm → 60 cm.', capIn: 'Feed in the <b>long side</b> of the photo: 15 cm.', capOut: 'Out comes 6 × 15 = <b>90 cm</b>. The poster is 60 cm by 90 cm.', check: 'longer ✓', capChk: 'Check: an enlargement, so the poster side is <b>longer</b> than 15 cm. ✓' },
  model: { top: '1 : 24 model truck · real truck 5.88 m = 588 cm', kcap: `Real → model: ${T('k=\\tfrac{1}{24}')}. Multiplying by ${T('\\tfrac{1}{24}')} is <b>dividing by 24</b>.`, op: '÷ 24', inp: '588 cm', out: '24.5 cm', from: 'real truck', to: 'model',
    cap0: 'A 1 : 24 model: every part is 1/24 of the real size. The real truck is 5.88 m = 588 cm long.', capIn: 'Feed in the real length: 588 cm.', capOut: 'Out comes 588 ÷ 24 = <b>24.5 cm</b>. The model is 24.5 cm long.', check: 'shorter ✓', capChk: 'Check: a reduction, so the model is <b>shorter</b> than the real truck. ✓' },
  real: { top: '1 : 24 model truck · model is 8.25 cm tall', kcap: 'Model → real goes the <b>other way</b>: the real truck is 24 times as big. Set the machine to <b>× 24</b>.', op: '× 24', inp: '8.25 cm', out: '198 cm', from: 'model', to: 'real truck',
    cap0: 'Now go from the model back to the real truck. The model is 8.25 cm tall.', capIn: 'Feed in the model’s height: 8.25 cm.', capOut: 'Out comes 8.25 × 24 = <b>198 cm = 1.98 m</b>. The real truck is 1.98 m tall.', check: 'taller ✓', capChk: 'Check: the real truck must be <b>taller</b> than the model. 1.98 m is about as tall as a tall person. ✓' }
};
const machine = {
  title: 'The scale-factor machine',
  height: 380,
  choices: [{ sep: 'Example 7' }, { v: 'poster', label: '(a) the poster' }, { v: 'model', label: '(b)(i) model length' }, { v: 'real', label: '(b)(ii) real height' }],
  ask: (v) => ({ poster: 'Example 7(a): a 10 cm by 15 cm photo; a similar poster is 60 cm on the short side. Find k and the long side.', model: 'Example 7(b)(i): a 1 : 24 model; the real truck is 5.88 m long. How long is the model, in cm?', real: 'Example 7(b)(ii): the 1 : 24 model is 8.25 cm tall. How tall is the real truck, in m?' }[v]),
  make(stage, v, ex) {
    const W = ex.W, H = 380, svg = stageSvg(stage, W, H), d = MACH[v], cx = W / 2, cy = 200, bw = 270, bh = 150;
    const topL = hide(lab(stage, d.top, cx, 34, 'u6l1-pill'));
    svgEl('rect', { x: cx - bw / 2, y: cy - bh / 2, width: bw, height: bh, rx: 18, fill: '#f5ecdf', stroke: BROWN, 'stroke-width': 4 }, svg);
    svgEl('rect', { x: cx - bw / 2 - 26, y: cy - 22, width: 26, height: 44, fill: '#e2d3bb', stroke: BROWN, 'stroke-width': 3 }, svg);
    svgEl('rect', { x: cx + bw / 2, y: cy - 22, width: 26, height: 44, fill: '#e2d3bb', stroke: BROWN, 'stroke-width': 3 }, svg);
    const g1 = gear(svg, cx - 82, cy + 38, 30, 9, '#d9b37a'), g2 = gear(svg, cx - 30, cy + 46, 21, 7, '#c7a26b');
    const opL = hide(lab(stage, d.op, cx + 40, cy - 6, 'u6l1-op'));
    txt(svg, cx - 300, cy + 60, d.from, { size: 19, color: '#6a7182' }); txt(svg, cx + 300, cy + 60, d.to, { size: 19, color: '#6a7182' });
    icon(svg, d.from, cx - 300, cy - 44); icon(svg, d.to, cx + 300, cy - 44);
    const ghost = hide(lab(stage, d.inp, cx - 300, cy, 'u6l1-card'));
    const cIn = hide(lab(stage, d.inp, cx - 300, cy, 'u6l1-card')), cOut = hide(lab(stage, d.out, cx + 300, cy, 'u6l1-card u6l1-cout'));
    const st1 = hide(stamp(stage, d.check, { ok: true, x: cx + 300, y: cy + 112, size: 'sm' }));
    const spin = (c, ms) => tween(c, ms, (u) => { g1.style.transform = `rotate(${u * 360}deg)`; g2.style.transform = `rotate(${-u * 470}deg)`; });
    return [
      { cap: d.cap0, run: (c) => c.pop(topL) },
      { cap: d.kcap, run: (c) => c.pop(opL) },
      { cap: d.capIn, run: async (c) => { await c.pop(cIn); await anim(c, cIn, [{ transform: 'translateX(0)', opacity: 1 }, { transform: 'translateX(170px)', opacity: 0 }], 900); await op(c, ghost, 0.35, 300); } },
      { cap: d.capOut, run: async (c) => { await spin(c, 1100); cOut.style.opacity = 1; await anim(c, cOut, [{ transform: 'translateX(-170px)', opacity: 0 }, { transform: 'translateX(0)', opacity: 1 }], 800); } },
      { cap: d.capChk, run: (c) => stampIn(c, st1) }
    ];
  }
};

/* ======================================================================================
 * 4. (Full) Why area grows by k × k
 * ====================================================================================== */
const AREA = { 2: { o: [2, 3], u: 'cm' }, 3: { o: [2, 3], u: 'cm' }, 6: { o: [10, 15], u: 'cm' } };
const area = {
  title: 'Area grows by k × k',
  height: 380,
  choices: [{ v: 2, label: T('k=2') }, { v: 3, label: T('k=3') }, { v: 6, label: 'Mia’s poster (k = 6)' }],
  ask: (v) => (v === 6 ? 'Mia’s 10 cm by 15 cm photo became a 60 cm by 90 cm poster. How many times the area?' : `A 2 cm by 3 cm rectangle is enlarged with ${T('k=' + v)}. How many times the area?`),
  make(stage, v, ex) {
    const W = ex.W, H = 380, svg = stageSvg(stage, W, H), k = +v, d = AREA[v];
    const th = Math.min(96, 300 / k), tw = th * 2 / 3, ox = 70, oy = 50, nx = 250, ny = 40;
    svgEl('rect', { x: ox, y: oy, width: tw, height: th, fill: '#cfe0f7', stroke: BLUE, 'stroke-width': 3 }, svg);
    txt(svg, ox + tw / 2, oy + th + 22, `${d.o[0]} cm × ${d.o[1]} cm`, { size: 18, color: BLUE });
    txt(svg, ox + tw / 2, oy - 20, 'original', { size: 18, color: '#6a7182' });
    const big = hide(svgEl('rect', { x: nx, y: ny, width: tw * k, height: th * k, fill: '#fff', stroke: AMBER, 'stroke-width': 3.5 }, svg));
    const bl = hide(txt(svg, nx + tw * k / 2, ny + th * k + 22, `${d.o[0] * k} cm × ${d.o[1] * k} cm`, { size: 18, color: AMBER }));
    const tiles = []; for (let r = 0; r < k; r++) for (let q = 0; q < k; q++) tiles.push(hide(svgEl('rect', { x: nx + q * tw + 2, y: ny + r * th + 2, width: tw - 4, height: th - 4, rx: 3, fill: '#cfe0f7', stroke: BLUE, 'stroke-width': 1.6 }, svg)));
    const tx = Math.min(W - 230, nx + tw * k + 150);
    const cntL = hide(lab(stage, '0 copies', tx, 150, 'u6l1-pill'));
    const oA = d.o[0] * d.o[1], nA = oA * k * k;
    const eq = hide(lab(stage, T(`${k}\\times${k}=${k * k}`) + ' copies', tx, 230, 'u6l1-eq u6l1-big'));
    const eq2 = hide(lab(stage, T(`${tn(oA)}\\text{ cm}^2\\to${tn(nA)}\\text{ cm}^2`), tx, 296, 'u6l1-eq'));
    return [
      { cap: `The original: ${d.o[0]} cm by ${d.o[1]} cm. Its area is ${tn(oA)} cm².`, run: async (c) => { await wait(c, 300); } },
      { cap: `Enlarge it with ${T('k=' + k)}: ${d.o[0] * k} cm by ${d.o[1] * k} cm. Every <b>length</b> is × ${k}.`, run: async (c) => { await c.pop(pp(big)); await c.pop(bl); } },
      { cap: 'How many copies of the original fit inside? Fill it row by row.',
        run: async (c) => { cntL.style.opacity = 1; let shown = 0; await tween(c, Math.min(2600, 380 * k * k), (u) => { const m = Math.round(u * tiles.length); while (shown < m) { tiles[shown].style.opacity = 1; shown++; } cntL.inner.textContent = shown + (shown === 1 ? ' copy' : ' copies'); }); tiles.forEach((t) => { t.style.opacity = 1; }); cntL.inner.textContent = tiles.length + ' copies'; } },
      { cap: `${k} rows of ${k}: ${T(`${k}\\times${k}=${k * k}`)} copies. The <b>area</b> is ${k * k} times as big, not ${k} times.`, run: async (c) => { await c.pop(eq); await c.pop(eq2); } }
    ];
  }
};

mountExplainers({ stretch, copies, match, turnback, kfactor, missing, proportion, machine, area });

/* ======================================================================================
 * Static figures
 * ====================================================================================== */
const FIG = {
  wans(host) {
    const s = figSvg(host, 300, 170), V1 = [16, 150], V2 = [104, 150];
    [[V1, 62], [V2, 186]].forEach(([V, L], j) => {
      path(s, segD(V, A(V, 0, L)), { width: 3.2, cls: '' }); path(s, segD(V, A(V, 30, L)), { width: 3.2, cls: '' });
      path(s, Geo.arcD(V, j ? 52 : 26, 0, 30), { stroke: RED, width: 2.6, cls: '' });
      txt(s, ...A(V, 15, j ? 78 : 42), '30°', { size: j ? 20 : 15, color: RED });
    });
    txt(s, V1[0] + 30, 165, 'drawn', { size: 14, color: '#6a7182' }); txt(s, V2[0] + 92, 165, 'through the glass (3×)', { size: 14, color: '#6a7182' });
  },
  ex1(host) {
    const s = figSvg(host, 946, 240), cell = 34, gx = 14, gy = 212;
    const d = []; for (let i = 0; i <= 27; i++) d.push(`M${gx + i * cell} ${gy}V${gy - 6 * cell}`); for (let j = 0; j <= 6; j++) d.push(`M${gx} ${gy - j * cell}H${gx + 27 * cell}`);
    path(s, d.join(''), { stroke: '#c9ced8', width: 1.2, cls: '' });
    const G = (p, ox) => [gx + (p[0] + ox) * cell, gy - p[1] * cell];
    [['O', 1, 2, 'Original'], ['A', 5, 7, 'A'], ['B', 11, 13, 'B'], ['C', 17, 18.5, 'C'], ['D', 22, 23.5, 'D']].forEach(([k, ox, lx, t]) => {
      path(s, polyD(LS[k].map((p) => G(p, ox))), { fill: '#e3e5ea', width: 3, cls: '' });
      txt(s, gx + lx * cell, gy + 18, t, { size: 18, weight: 800 });
    });
  },
  ex2(host) {
    const s = figSvg(host, 400, 250), d = PAIRS.e2, F = fitW(d.P.concat(d.Q), 400, 250, 34);
    drawPoly(s, F.all(d.P), { names: [...d.n1] }); drawPoly(s, F.all(d.Q), { names: [...d.n2], fill: FILL1 });
  },
  ex3(host) {
    const s = figSvg(host, 440, 220), d = PAIRS.e3, F = fitW(d.P.concat(d.Q), 440, 220, 30), P = F.all(d.P);
    drawPoly(s, P, { names: [...d.n1] }); drawPoly(s, F.all(d.Q), { names: [...d.n2], fill: FILL1 });
    ['78°', '112°', '64°'].forEach((t, i) => angLab(s, P, i, t, { r: 40, size: 16 }));
  },
  ex6(host) {
    const s = figSvg(host, 520, 250), d = MISS.ex6, Qw = tf(d.P, d.tfm), F = fitW(d.P.concat(Qw), 520, 250, 44);
    drawPoly(s, F.all(d.P), { names: [...d.n1], labels: d.l1 }); drawPoly(s, F.all(Qw), { names: [...d.n2], labels: d.l2, fill: FILL1 });
  }
};
document.querySelectorAll('.u6l1-fig[data-fig]').forEach((host) => { const f = FIG[host.dataset.fig]; if (f) f(host); });

/* ======================================================================================
 * Stand Up Break
 * ====================================================================================== */
const nice1 = (v) => Math.abs(v * 10 - Math.round(v * 10)) < 1e-9;
standup('u6l1', {
  intro: 'New ÷ original for k. Multiply to get a new side, divide to get an original side. Check: bigger or smaller?',
  levels: {
    BEG: (r) => {
      const k = r.pick([0.25, 0.4, 0.5, 0.75, 1.5, 2, 2.5, 3, 4]), u = r.pick(['cm', 'm', 'in', 'ft']);
      let a; do { a = r.int(2, 24); } while (!nice1(a * k) || a * k < 1);
      const b = rr(a * k);
      return { text: `A side of the <b>original</b> figure is <b>${a} ${u}</b>. The matching side of a similar <b>new</b> figure is <b>${b} ${u}</b>. Find the scale factor. Is it an enlargement or a reduction?`, q: '',
        a: [`k=\\dfrac{\\text{new}}{\\text{original}}=\\dfrac{${tn(b)}}{${a}}=${tn(k)}`, `${tn(k)}${k > 1 ? '>' : '<'}1:\\ \\text{${k > 1 ? 'an enlargement' : 'a reduction'}}`] };
    },
    PRG: (r) => {
      const k = r.pick([1.5, 2, 2.5, 3, 0.5, 0.4, 0.75, 1.2]);
      let a, c2, m; do { a = r.int(4, 20); } while (!nice1(a * k)); do { c2 = r.int(3, 15); } while (!nice1(c2 * k)); do { m = r.int(3, 15); } while (!nice1(m * k) || m === c2);
      const b = rr(a * k), dd = rr(m * k);
      return { text: '<b>ABCD ∼ PQRS</b> (all lengths in cm). Find the scale factor, then find <b>QR</b> and <b>CD</b>.', q: `AB=${a},\\ \\ PQ=${tn(b)},\\ \\ BC=${c2},\\ \\ RS=${tn(dd)}`,
        a: [`k=\\dfrac{PQ}{AB}=\\dfrac{${tn(b)}}{${a}}=${tn(k)}`, `QR=${tn(k)}\\times${c2}=${tn(rr(c2 * k))}\\text{ cm}`, `CD=${tn(dd)}\\div${tn(k)}=${m}\\text{ cm}`] };
    },
    MAS: (r) => {
      const n = r.pick([24, 32, 50, 64, 87, 100, 150]), obj = r.pick(['school bus', 'fire truck', 'sailboat', 'tractor', 'train car']);
      let m, hgt; do { m = r.pick([4.5, 6, 7.5, 8, 9, 12, 12.5, 15, 18, 20, 24]); } while (m * n < 400 || m * n > 1600);
      do { hgt = r.pick([1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 8, 10]); } while (hgt * n < 150 || hgt * n > 450);
      const realCm = rr(m * n), hCm = rr(hgt * n);
      return { text: `A <b>1 : ${n}</b> model of a ${obj}. (i) The real ${obj} is <b>${pn(rr(realCm / 100))} m</b> long. How long is the model, in cm? (ii) The model is <b>${hgt} cm</b> tall. How tall is the real ${obj}, in m?`, q: '',
        a: [`\\text{(i) }${tn(rr(realCm / 100))}\\text{ m}=${tn(realCm)}\\text{ cm},\\ \\ ${tn(realCm)}\\div${n}=${tn(m)}\\text{ cm}`, `\\text{(ii) }${hgt}\\times${n}=${tn(hCm)}\\text{ cm}=${tn(rr(hCm / 100))}\\text{ m}`] };
    }
  }
});
void liveCtx; void GREY; void GREEN;
