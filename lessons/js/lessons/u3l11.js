/* Math 10-3 · Unit 3 · Lesson 11 — Surface Area of Cylinders, Pyramids and Cones (M4).
 * Explainers (Class view unless marked):
 *   unroll  (a can's label peels off into a rectangle, the lids pop off as circles, area of each piece, add; Ex 1, Ex 2),
 *   rollCan (Full notes: roll a painted can one turn; the stripe is about 3.14 diameters: the label is πd long),
 *   pieces  (sort the objects of Example 3(a) into "2 circles + side / 1 circle + side / side only"; the ottoman, 3(b)),
 *   columns (Example 4: 12 parkade columns, two coats sweep across, the area bar cut into 37 m² cans, the receipt),
 *   pyramid (a square pyramid unfolds in 3-D, then we look from straight above at the net; Ex 5(a) and Jonah's tent),
 *   slant   (Full notes: cut down the middle, h / half the base / s make a right triangle, so s is longest),
 *   cone    (a cone's side opens into a fan, the base pops off; Ex 6(a) closed cone, 6(b) open waffle cone),
 *   slices  (Full notes: the fan cut into 12 or 24 slices, re-stacked top to tail into a near rectangle πr by s),
 *   bin     (Example 7: the grain bin's walls unroll, the cone roof flattens into a fan, total steel and the cost).
 * Static figures for Examples 1, 3, 5, 6 and 7, the Math History animation (Archimedes' ball in a can), then the
 * Stand Up Break. */
import { h, add, box, tex, svgEl, tween, stamp, stampIn, mountExplainers } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const PI = Math.PI, D = PI / 180;
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const rnd = (v, d = 2) => Math.round((v + (v >= 0 ? 1e-9 : -1e-9)) * 10 ** d) / 10 ** d;
const lerp = (a, b, t) => a + (b - a) * t;
/** TeX number with a thin space from 1000 up: 3\,233.87 */
const nT = (v) => { const s = String(v); const [i, d] = s.split('.'); const ii = i.length > 3 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : i; return d != null ? ii + '.' + d : ii; };
/** the same for HTML (narrow no-break space) */
const nH = (v) => nT(v).replace(/\\,/g, ' ');
/** the booklet's "276.46…": cut (not rounded) to d decimals, then … */
const dots = (v, d = 2) => nT((Math.floor(v * 10 ** d + 1e-7) / 10 ** d).toFixed(d)) + '\\ldots';
const fx = (v, d) => nT(rnd(v, d).toFixed(d));
const STROKE = '#6e4a1c';

const svgBox = (stage, W, H, x = 0, y = 0) => add(stage, svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u3l11-svg' }), x, y);
/** modifier classes are written short ('dim red') and get the lesson prefix (u3l11-dim u3l11-red), so no global class is hit */
const pre = (cls) => cls.split(/\s+/).filter(Boolean).map((c) => 'u3l11-' + c).join(' ');
const lab = (stage, html, x, y, cls = '') => add(stage, h('div', 'u3l11-lab ' + pre(cls), html), x, y);
const labC = (stage, html, x, y, cls = '') => lab(stage, html, x, y, 'ctr ' + cls);
const line = (stage, html, x, y, w, cls = '') => hide(add(stage, box(h('div', 'u3l11-ln ' + pre(cls), `<div>${html}</div>`), w, 44), x, y));
const P = (x, y) => `${x.toFixed(1)} ${y.toFixed(1)}`;

/* ---------- drawing helpers ---------- */
/** an upright cylinder, centre of its bottom at (cx, by): the side (with the front bottom arc) and the lid */
function cylSVG(cx, by, rx, hp, o = {}) {
  const ry = rx * (o.k || 0.28), top = by - hp, st = o.stroke || STROKE, sw = o.sw || 2.6;
  const body = o.body || '#d7dbe0', lid = o.lid || '#eef0f2';
  let s = `<path d="M${P(cx - rx, by)} A${rx} ${ry} 0 0 0 ${P(cx + rx, by)} L${P(cx + rx, top)} A${rx} ${ry} 0 0 1 ${P(cx - rx, top)} Z" fill="${body}" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round"/>`;
  if (o.back) s += `<path d="M${P(cx - rx, by)} A${rx} ${ry} 0 0 1 ${P(cx + rx, by)}" fill="none" stroke="${st}" stroke-width="1.6" stroke-dasharray="6 5"/>`;
  if (o.rims) for (let i = 1; i < o.rims; i++) { const y = by - hp * i / o.rims; s += `<path d="M${P(cx - rx, y)} A${rx} ${ry} 0 0 0 ${P(cx + rx, y)}" fill="none" stroke="${st}" stroke-width="1.1" opacity=".4"/>`; }
  if (o.lid !== 'none') s += `<ellipse cx="${cx}" cy="${top}" rx="${rx}" ry="${ry}" fill="${lid}" stroke="${st}" stroke-width="${sw}"/>`;
  if (o.hole) s += `<ellipse cx="${cx}" cy="${top}" rx="${rx - 5}" ry="${ry - 3}" fill="${o.hole}"/>`;
  return s;
}
/** the front side band of a cylinder (top to bottom), as a path d */
const bandD = (cx, by, rx, hp, k = 0.28) => { const ry = rx * k, top = by - hp; return `M${P(cx - rx, by)} A${rx} ${ry} 0 0 0 ${P(cx + rx, by)} L${P(cx + rx, top)} A${rx} ${ry} 0 0 1 ${P(cx - rx, top)} Z`; };
/** an upright cone, centre of the base at (cx, by), apex height hp */
function coneSVG(cx, by, rx, hp, o = {}) {
  const ry = rx * (o.k || 0.28), st = o.stroke || STROKE, sw = o.sw || 2.6, fill = o.fill || '#cfe0f2';
  let s = `<path d="M${P(cx - rx, by)} L${P(cx, by - hp)} L${P(cx + rx, by)} A${rx} ${ry} 0 0 1 ${P(cx - rx, by)} Z" fill="${fill}" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round"/>`;
  s += `<path d="M${P(cx - rx, by)} A${rx} ${ry} 0 0 1 ${P(cx + rx, by)}" fill="none" stroke="${st}" stroke-width="1.6" stroke-dasharray="6 5"/>`;
  return s;
}
/** a fan (sector) with its apex at (fx, fy), radius R, opening angle th (radians) centred on straight down */
function fanD(fx, fy, R, th) {
  th = Math.max(th, 0.002);
  const a1 = PI / 2 - th / 2, a2 = PI / 2 + th / 2;
  const p1 = [fx + R * Math.cos(a1), fy + R * Math.sin(a1)], p2 = [fx + R * Math.cos(a2), fy + R * Math.sin(a2)];
  return { fan: `M${P(fx, fy)} L${P(p1[0], p1[1])} A${R} ${R} 0 ${th > PI ? 1 : 0} 1 ${P(p2[0], p2[1])} Z`, arc: `M${P(p1[0], p1[1])} A${R} ${R} 0 ${th > PI ? 1 : 0} 1 ${P(p2[0], p2[1])}`, p1, p2 };
}
/** a square pyramid in 3-D that can unfold: base b, slant s, scale k (px per unit), centre of the base at (ox, oy) on screen */
function pyr3D(parent, b, s, o) {
  const H = Math.sqrt(s * s - b * b / 4), g = svgEl('g', {}, parent);
  const base = svgEl('polygon', { fill: o.baseFill || '#eadcbf', stroke: STROKE, 'stroke-width': 2.4, 'stroke-linejoin': 'round' }, g);
  const NRM = [[0, -1], [1, 0], [0, 1], [-1, 0]]; // outward: front, right, back, left
  const cols = o.cols || ['#f2c38a', '#f7d9ad', '#f2c38a', '#f7d9ad'];
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
/** a grain bin: cylinder walls (with corrugation) and a cone roof; centre of the floor at (cx, by) */
function siloSVG(cx, by, rx, hp, rh, o = {}) {
  const ry = rx * 0.28, top = by - hp, st = STROKE;
  let s = `<path d="${bandD(cx, by, rx, hp)}" fill="${o.wall || '#c9d1da'}" stroke="${st}" stroke-width="2.6" stroke-linejoin="round"/>`;
  for (let i = 1; i < 6; i++) { const y = by - hp * i / 6; s += `<path d="M${P(cx - rx, y)} A${rx} ${ry} 0 0 0 ${P(cx + rx, y)}" fill="none" stroke="${st}" stroke-width="1" opacity=".35"/>`; }
  s += `<path d="M${P(cx - rx, top)} L${P(cx, top - rh)} L${P(cx + rx, top)} A${rx} ${ry} 0 0 1 ${P(cx - rx, top)} Z" fill="${o.roof || '#dfe4ea'}" stroke="${st}" stroke-width="2.6" stroke-linejoin="round"/>`;
  return s;
}

/* =====================================================================================
 * 1. Peel the label: the net of a cylinder (Examples 1 and 2)
 * ===================================================================================== */
const UN = {
  e1: { ask: 'Example 1: a can of soup is <b>8 cm</b> across (its diameter) and <b>11 cm</b> tall. Find the area of the label and the surface area of the can.',
    d: 8, h: 11, u: 'cm', word: 'label', obj: 'A can', peel: 'Peel off the label', body: '#d9483b', text: 'SOUP', dec: 1 },
  e2: { ask: 'Example 2: Rhys paints a steel drum (with both ends) <b>22½ in</b> across and <b>34½ in</b> tall. Find the surface area in in² and ft², then the cans of spray paint (20 ft² each).',
    d: 22.5, h: 34.5, u: 'in', word: 'side', obj: 'The drum', peel: 'Cut the side open', body: '#6f93b5', text: '', dec: 0, ft: true }
};
const unroll = {
  title: 'Peel the label: the net of a cylinder',
  height: 440,
  minW: 960,
  choices: [{ sep: 'Check:' }, { v: 'e1', label: 'Ex 1 Soup can' }, { v: 'e2', label: 'Ex 2 Steel drum' }],
  ask: (k) => UN[k].ask,
  make(stage, k, ex) {
    const d = UN[k], u = d.u, r = d.d / 2, C = PI * d.d, A1 = PI * r * r, c2 = 2 * A1, side = 2 * PI * r * d.h, SA = c2 + side;
    const SAw = d.dec ? fx(SA, 1) : nT(Math.round(SA));
    const svg = svgBox(stage, 650, 440);
    const cx = 150, by = 380, rx = 70, ry = rx * 0.28, hp = 2 * rx * d.h / d.d, top = by - hp;
    // the can: bare metal underneath, the label on top (clipped so it can peel away), then the lid
    const can = svgEl('g', {}, svg); can.innerHTML = cylSVG(cx, by, rx, hp, { lid: 'none', body: '#d7dbe0' });
    const id = 'u3l11c' + Math.floor(Math.random() * 1e9);
    const defs = svgEl('defs', {}, svg), cp = svgEl('clipPath', { id }, defs);
    const cr = svgEl('rect', { x: cx - rx - 4, y: top - 30, width: 2 * rx + 8, height: hp + 60 }, cp);
    const bandG = svgEl('g', { 'clip-path': `url(#${id})` }, svg);
    svgEl('path', { d: bandD(cx, by, rx, hp), fill: d.body, stroke: STROKE, 'stroke-width': 2.6 }, bandG);
    if (d.text) { const t = svgEl('text', { x: cx, y: top + hp / 2 + 10, 'text-anchor': 'middle', 'font-size': 30, 'font-weight': 800, fill: '#fff4d8' }, bandG); t.textContent = d.text; }
    const lidE = svgEl('ellipse', { cx, cy: top, rx, ry, fill: '#eef0f2', stroke: STROKE, 'stroke-width': 2.6 }, svg);
    const rim = hide(svgEl('ellipse', { cx, cy: top, rx, ry, fill: 'none', stroke: '#1f5bd6', 'stroke-width': 5 }, svg));
    // dimensions on the can
    const dA = hide(svgEl('g', {}, svg)); const yA = top - ry - 18;
    dA.innerHTML = `<line x1="${cx - rx}" y1="${yA}" x2="${cx + rx}" y2="${yA}" stroke="#1c2230" stroke-width="2"/><path d="M${cx - rx + 8} ${yA - 5} L${cx - rx} ${yA} L${cx - rx + 8} ${yA + 5} M${cx + rx - 8} ${yA - 5} L${cx + rx} ${yA} L${cx + rx - 8} ${yA + 5}" fill="none" stroke="#1c2230" stroke-width="2"/>`;
    const ldA = hide(labC(stage, `d = ${nH(d.d)} ${u}`, cx, yA - 16, 'dim'));
    const hA = hide(svgEl('g', {}, svg)); const xA = cx - rx - 20;
    hA.innerHTML = `<line x1="${xA}" y1="${top}" x2="${xA}" y2="${by}" stroke="#1c2230" stroke-width="2"/><path d="M${xA - 5} ${top + 8} L${xA} ${top} L${xA + 5} ${top + 8} M${xA - 5} ${by - 8} L${xA} ${by} L${xA + 5} ${by - 8}" fill="none" stroke="#1c2230" stroke-width="2"/>`;
    const lhA = hide(labC(stage, `h = ${nH(d.h)} ${u}`, xA - 18, top + hp / 2, 'dim rot'));
    // the net
    const NX = 262, NW = 380, NY = 18, NH = 410, kk = Math.min((NW - 10) / C, (NH - 20) / (d.h + 4 * r));
    const Lp = C * kk, Hp = d.h * kk, Rp = r * kk, x0 = NX + (NW - Lp) / 2, tot = (d.h + 4 * r) * kk, y0 = NY + (NH - tot) / 2 + 2 * Rp, xm = x0 + Lp / 2;
    const flat = svgEl('rect', { x: x0, y: y0, width: 0, height: Hp, fill: d.body, stroke: STROKE, 'stroke-width': 2.6 }, svg);
    const flatT = d.text ? hide(svgEl('text', { x: xm, y: y0 + Hp / 2 + 10, 'text-anchor': 'middle', 'font-size': 30, 'font-weight': 800, fill: '#fff4d8', opacity: 0.5 }, svg)) : null;
    if (flatT) flatT.textContent = d.text;
    const edge = hide(svgEl('line', { x1: x0, y1: y0, x2: x0 + Lp, y2: y0, stroke: '#1f5bd6', 'stroke-width': 6 }, svg));
    const lL = hide(labC(stage, `${T(`\\pi\\times${nT(d.d)}\\approx${fx(C, 1)}`)} ${u}`, xm, y0 + 24, 'dim blue'));
    const wA = hide(svgEl('g', {}, svg)); const xw = x0 + 16;
    wA.innerHTML = `<line x1="${xw}" y1="${y0 + 4}" x2="${xw}" y2="${y0 + Hp - 4}" stroke="#1c2230" stroke-width="2"/><path d="M${xw - 5} ${y0 + 12} L${xw} ${y0 + 4} L${xw + 5} ${y0 + 12} M${xw - 5} ${y0 + Hp - 12} L${xw} ${y0 + Hp - 4} L${xw + 5} ${y0 + Hp - 12}" fill="none" stroke="#1c2230" stroke-width="2"/>`;
    const lW = hide(lab(stage, `${nH(d.h)} ${u}`, xw + 8, y0 + Hp / 2 - 14, 'dim'));
    const cT = hide(svgEl('circle', { cx: xm, cy: y0 - Rp, r: Rp, fill: '#eef0f2', stroke: STROKE, 'stroke-width': 2.6 }, svg));
    const cB = hide(svgEl('circle', { cx: xm, cy: y0 + Hp + Rp, r: Rp, fill: '#eef0f2', stroke: STROKE, 'stroke-width': 2.6 }, svg));
    const rl = hide(svgEl('g', {}, svg));
    rl.innerHTML = [y0 - Rp, y0 + Hp + Rp].map((y) => `<line x1="${xm}" y1="${y}" x2="${xm + Rp}" y2="${y}" stroke="#c93a33" stroke-width="3"/><circle cx="${xm}" cy="${y}" r="3.5" fill="#1c2230"/>`).join('');
    const lr1 = hide(labC(stage, `r = ${nH(r)}`, xm + Rp / 2, y0 - Rp - 16, 'dim small red'));
    const lr2 = hide(labC(stage, `r = ${nH(r)}`, xm + Rp / 2, y0 + Hp + Rp - 16, 'dim small red'));
    const la1 = hide(lab(stage, `${T(dots(A1))} ${u}²`, xm + Rp + 10, y0 - Rp - 14, 'area'));
    const la2 = hide(lab(stage, `${T(dots(A1))} ${u}²`, xm + Rp + 10, y0 + Hp + Rp - 14, 'area'));
    const laS = hide(labC(stage, `${T(dots(side))} ${u}²`, xm, y0 + Hp - 28, 'area'));
    // the working, on the right
    const X = 664, LW = ex.W - X - 12;
    const L1 = line(stage, `${T(`r=${nT(d.d)}\\div2=${nT(r)}`)} ${u}`, X, 16, LW);
    const L2 = line(stage, `Circles: ${T(dots(c2))} ${u}²`, X, 68, LW);
    const L3 = line(stage, `${d.word === 'label' ? 'Label' : 'Side'}: ${T(dots(side))} ${u}²`, X, 120, LW);
    const L4 = line(stage, `${T(`\\text{SA}\\approx${SAw}`)} ${u}²`, X, 172, LW, 'big');
    const ft = SA / 144;
    const L5 = d.ft ? line(stage, `${T(`\\div144\\approx${fx(ft, 1)}`)} ft²`, X, 236, LW) : null;
    const L6 = d.ft ? line(stage, `${T('22.46\\div20=1.12\\ldots')} cans`, X, 288, LW) : null;
    const st = d.ft ? hide(stamp(stage, 'Buy 2 cans', { ok: true, x: X + LW / 2, y: 384, rotate: -5 })) : null;
    const steps = [
      { cap: `${d.obj} is a cylinder: 2 circles (the top and the bottom) and a curved side${d.word === 'label' ? ', the <b>label</b>' : ''}. ${T(`d=${nT(d.d)}`)} ${u}, ${T(`h=${nT(d.h)}`)} ${u}.`,
        run: async (c) => { await c.fadeIn(dA); await c.fadeIn(ldA); await c.fadeIn(hA); await c.fadeIn(lhA); } },
      { cap: `${d.peel} and lay it flat. It is a <b>rectangle</b>.`,
        run: async (c) => {
          await tween(c, 1500, (t) => { cr.setAttribute('x', cx - rx - 4 + t * (2 * rx + 8)); cr.setAttribute('width', (1 - t) * (2 * rx + 8)); flat.setAttribute('width', t * Lp); });
          if (flatT) await c.fadeIn(flatT);
        } },
      { cap: `Its width is the height, <b>${nH(d.h)} ${u}</b>. Its length goes once around: the circumference, ${T(`\\pi\\times${nT(d.d)}\\approx${fx(C, 1)}`)} ${u}.`,
        run: async (c) => { await c.fadeIn(wA); await c.fadeIn(lW); await c.fadeIn(rim); await c.fadeIn(edge); await c.pop(lL); } },
      { cap: `The top and the bottom come off as <b>2 circles</b>. The radius is half the diameter: ${T(`r=${nT(d.d)}\\div2=${nT(r)}`)} ${u}.`,
        run: async (c) => { await c.anim(lidE, [{ opacity: 1 }, { opacity: 0.35 }], 300); await c.pop(cT); await c.pop(cB); await c.fadeIn(rl); await c.fadeIn(lr1); await c.fadeIn(lr2); await c.fadeIn(L1); } },
      { cap: `Both circles: ${T(`2\\times\\pi\\times${nT(r)}^2=${dots(c2)}`)} ${u}².`,
        run: async (c) => { await c.anim(cT, [{ fill: '#eef0f2' }, { fill: '#fbe3b5' }], 300); await c.anim(cB, [{ fill: '#eef0f2' }, { fill: '#fbe3b5' }], 300); await c.pop(la1); await c.pop(la2); await c.fadeIn(L2); } },
      { cap: `The ${d.word}: length × width ${T(`=2\\times\\pi\\times${nT(r)}\\times${nT(d.h)}=${dots(side)}`)} ${u}².`,
        run: async (c) => { await c.pop(laS); await c.fadeIn(L3); } },
      { cap: `Add all the pieces: ${T(`\\text{SA}=${dots(c2)}+${dots(side)}=${dots(SA)}`)}. About <b>${nH(d.dec ? rnd(SA, 1).toFixed(1) : Math.round(SA))} ${u}²</b>.`,
        run: async (c) => { await c.fadeIn(L4); } }
    ];
    if (d.ft) steps.push(
      { cap: `In² to ft²: small unit to big unit, so divide. ${T(`${dots(SA)}\\div144=${dots(ft, 3)}`)}, about <b>22.5 ft²</b>.`,
        run: async (c) => { await c.fadeIn(L5); } },
      { cap: `One spray can covers 20 ft²: ${T('22.46\\div20=1.12\\ldots')} cans. You can’t buy part of a can, so round <b>up</b>: <b>2 cans</b>.`,
        run: async (c) => { await c.fadeIn(L6); await stampIn(c, st); } });
    return steps;
  }
};

/* =====================================================================================
 * 1b. Full notes: roll a painted can one turn
 * ===================================================================================== */
const rollCan = {
  title: 'Roll the can: the label is π × d long',
  height: 330,
  minW: 960,
  ask: 'The soup can from Example 1 is <b>8 cm</b> across. Why is its label <b>π × 8</b> long?',
  make(stage, v, ex) {
    const svg = svgBox(stage, 960, 330);
    const R = 60, fy = 262, x0 = 70, cy = fy - R, Cp = 2 * PI * R;
    svgEl('line', { x1: 30, y1: fy, x2: 930, y2: fy, stroke: '#8a7d66', 'stroke-width': 3 }, svg);
    const stripe = svgEl('rect', { x: x0, y: fy + 2, width: 0, height: 14, fill: '#d9483b' }, svg);
    const wheel = svgEl('g', {}, svg); wheel.style.transformBox = 'view-box'; wheel.style.transformOrigin = '0 0';
    const circ = svgEl('circle', { cx: x0, cy, r: R, fill: '#d9483b', stroke: STROKE, 'stroke-width': 3 }, wheel);
    svgEl('circle', { cx: x0, cy, r: R - 12, fill: '#eef0f2', stroke: STROKE, 'stroke-width': 2 }, wheel);
    const dia = svgEl('line', { x1: x0 - R + 12, y1: cy, x2: x0 + R - 12, y2: cy, stroke: '#1f5bd6', 'stroke-width': 3 }, wheel);
    const dot = svgEl('circle', { cx: x0, cy: fy, r: 7, fill: '#1c2230' }, svg);
    const ld = labC(stage, 'the end of the can: <b>8 cm</b> across', x0 + 150, cy - R - 26, 'small');
    const start = hide(svgEl('line', { x1: x0, y1: fy - 14, x2: x0, y2: fy + 26, stroke: '#1c2230', 'stroke-width': 2.5 }, svg));
    const endL = hide(svgEl('line', { x1: x0 + Cp, y1: fy - 14, x2: x0 + Cp, y2: fy + 26, stroke: '#1c2230', 'stroke-width': 2.5 }, svg));
    const lC = hide(labC(stage, 'the stripe = once around = the <b>circumference</b>', x0 + Cp / 2, fy + 44, 'blue'));
    const dGroup = hide(svgEl('g', {}, svg));
    let s = '';
    for (let i = 0; i < 3; i++) s += `<rect x="${x0 + i * 2 * R + 1}" y="${fy + 20}" width="${2 * R - 2}" height="12" rx="3" fill="${i % 2 ? '#7aa0e0' : '#1f5bd6'}"/><text x="${x0 + i * 2 * R + R}" y="${fy + 54}" text-anchor="middle" font-size="17" font-weight="800" fill="#1f5bd6">d</text>`;
    s += `<rect x="${x0 + 6 * R + 1}" y="${fy + 20}" width="${Cp - 6 * R - 2}" height="12" rx="3" fill="#c27a0e"/>`;
    dGroup.innerHTML = s;
    const lD = hide(lab(stage, `3 diameters and a bit more: ${T('C\\approx3.14\\times d=\\pi d')}`, x0 + Cp + R + 22, fy - 96, 'tag'));
    const lE = hide(lab(stage, `Soup can: ${T('\\pi\\times8\\approx25.1')} cm`, x0 + Cp + R + 22, fy - 48, 'tag red'));
    return [
      { cap: 'Look at the can from the end: a circle, <b>8 cm</b> across. Wet paint is on its label. Mark a spot where it touches the floor.',
        run: async (c) => { await c.pop(dot); await c.fadeIn(start); } },
      { cap: 'Roll the can <b>one full turn</b>. The label prints a stripe on the floor.',
        run: async (c) => {
          await tween(c, 2600, (t) => { const th = t * 2 * PI; wheel.setAttribute('transform', `translate(${R * th} 0) rotate(${th / D} ${x0} ${cy})`); stripe.setAttribute('width', R * th);
            dot.setAttribute('cx', x0 + R * th - R * Math.sin(th)); dot.setAttribute('cy', cy + R * Math.cos(th)); }, (t) => t);
          ld.style.opacity = 0;
        } },
      { cap: 'The stripe is the label laid flat. Its length is once around the circle: the <b>circumference</b>.',
        run: async (c) => { await c.fadeIn(endL); await c.fadeIn(lC); } },
      { cap: `Lay diameters along it: 3 fit, with a little left over. The circumference is about ${T('3.14')} diameters: ${T('C=\\pi d')}.`,
        run: async (c) => { lC.style.opacity = 0; await c.fadeIn(dGroup); await c.fadeIn(lD); } },
      { cap: `So the label of the soup can is ${T('\\pi\\times8\\approx25.1')} cm long. With the radius: ${T('\\pi d=2\\pi r')}.`,
        run: async (c) => { await c.pop(lE); } }
    ];
  }
};

/* =====================================================================================
 * 2. Which pieces are there? (Example 3)
 * ===================================================================================== */
const OBJ = {
  tube: { name: 'a tube of tennis balls with a lid', has: [1, 1, 1], bin: 0,
    svg: () => `${cylSVG(100, 186, 34, 160, { body: '#d5e6f5', lid: '#2f6fb0' })}${[0, 1, 2].map((i) => `<circle cx="100" cy="${160 - i * 52}" r="25" fill="#d8e85a" stroke="#8a9a22" stroke-width="2" opacity=".85"/>`).join('')}` },
  pipe: { name: 'a metal drainpipe', has: [0, 0, 1], bin: 2, svg: () => cylSVG(100, 186, 32, 160, { body: '#b8bec6', lid: '#b8bec6', hole: '#4a5260' }) },
  pan: { name: 'a round cake pan', has: [0, 1, 1], bin: 1, svg: () => cylSVG(100, 160, 80, 46, { body: '#cfd4da', lid: '#cfd4da', hole: '#8a6a44' }) },
  label: { name: 'the paper label on a jar', has: [0, 0, 1], bin: 2,
    svg: () => `${cylSVG(100, 186, 52, 140, { body: '#eef6f8', lid: '#9a6a24' })}<path d="${bandD(100, 150, 52, 70)}" fill="#e8a01e" stroke="${STROKE}" stroke-width="2.6"/>` }
};
const BINS = ['2 circles + side', '1 circle + side', 'side only'];
const pieces = {
  title: 'Which pieces are really there?',
  height: 430,
  minW: 960,
  choices: [{ sep: 'Example 3:' }, { v: 'sort', label: '(a) Sort them' }, { v: 'ott', label: '(b) Amara’s ottoman' }],
  ask: (k) => (k === 'sort' ? 'Example 3(a): which pieces of the net does each object need: 2 circles + side, 1 circle + side, or side only?'
    : 'Example 3(b): fabric covers the <b>top and the side</b> of an ottoman (not the bottom). It is <b>18 in</b> across and <b>16½ in</b> tall. How much fabric, in in² and ft²?'),
  make(stage, k, ex) { return k === 'sort' ? sortMake(stage, ex) : ottMake(stage, ex); }
};
function chkList(has) {
  return h('div', 'u3l11-chk', ['Top', 'Bottom', 'Side'].map((n, i) => `<div><span class="u3l11-chk-n">${n}</span><b class="${has[i] ? 'u3l11-y' : 'u3l11-n'}">${has[i] ? '✓' : '✗'}</b></div>`).join(''));
}
function sortMake(stage, ex) {
  const W = 960, BW = 300, BY = 262;
  const bins = BINS.map((t, i) => hide(add(stage, box(h('div', 'u3l11-bin', `<div class="u3l11-bin-h">${t}</div>`), BW, 160), 15 + i * (BW + 15), BY)));
  const used = [0, 0, 0];
  const keys = ['tube', 'pipe', 'pan', 'label'];
  const items = keys.map((key) => {
    const o = OBJ[key], el = hide(add(stage, svgEl('svg', { width: 200, height: 200, viewBox: '0 0 200 200', class: 'u3l11-svg u3l11-obj' }), 300, 24));
    el.innerHTML = o.svg(); el.style.transformOrigin = '0 0';
    const ck = hide(add(stage, chkList(o.has), 520, 40));
    const nm = hide(labC(stage, o.name, 400, 240, 'small'));
    const j = used[o.bin]++; const tx = 15 + o.bin * (BW + 15) + 40 + j * 120, ty = BY + 50;
    return { el, ck, nm, dx: tx - 300, dy: ty - 24 };
  });
  const move = async (c, it) => {
    await c.fadeIn(it.el); await c.fadeIn(it.nm); await c.fadeIn(it.ck);
    await c.sleep(500);
    await c.anim(it.ck, [{ opacity: 1 }, { opacity: 0 }], 250); it.nm.style.opacity = 0;
    await c.anim(it.el, [{ transform: 'none' }, { transform: `translate(${it.dx}px, ${it.dy}px) scale(.5)` }], 700);
  };
  return [
    { cap: 'Three kinds of cylinder. For each object, ask: is there a <b>top</b>? A <b>bottom</b>? A <b>side</b>?',
      run: async (c) => { for (const b of bins) await c.fadeIn(b, 220); } },
    { cap: 'A tube of tennis balls with a lid: a top, a bottom and a side. <b>2 circles + side</b>.', run: (c) => move(c, items[0]) },
    { cap: 'A metal drainpipe: open at both ends. Just the side: <b>side only</b>.', run: (c) => move(c, items[1]) },
    { cap: 'A round cake pan: a bottom and a side, but no top. <b>1 circle + side</b>.', run: (c) => move(c, items[2]) },
    { cap: 'The paper label on a jar: only the label, no circles. <b>Side only</b>.', run: (c) => move(c, items[3]) }
  ];
}
function ottMake(stage, ex) {
  const r = 9, hh = 16.5, top = PI * r * r, side = 2 * PI * r * hh, SA = top + side, ft = SA / 144;
  const svg = svgBox(stage, 560, 430);
  const cx = 230, by = 330, rx = 130, ry = rx * 0.28, hp = 2 * rx * hh / 18, yT = by - hp;
  const body = svgEl('g', {}, svg); body.innerHTML = cylSVG(cx, by, rx, hp, { body: '#b79ad6', lid: '#d6c4ea', back: true });
  // tufts on the top to say "fabric"
  const tufts = svgEl('g', {}, svg); tufts.innerHTML = [-60, 0, 60].map((dx) => `<circle cx="${cx + dx}" cy="${yT}" r="4" fill="#7b4fc4"/>`).join('');
  const topHi = hide(svgEl('ellipse', { cx, cy: yT, rx, ry, fill: '#f4d06a', stroke: STROKE, 'stroke-width': 2.6 }, svg));
  const sideHi = hide(svgEl('path', { d: `M${P(cx - rx, by)} A${rx} ${ry} 0 0 0 ${P(cx + rx, by)} L${P(cx + rx, yT)} A${rx} ${ry} 0 0 1 ${P(cx - rx, yT)} Z`, fill: '#f6b98a', stroke: STROKE, 'stroke-width': 2.6, opacity: 0.85 }, svg));
  const noBot = hide(svgEl('g', {}, svg));
  noBot.innerHTML = `<path d="M${cx - 30} ${by + 28} L${cx + 30} ${by + 52} M${cx + 30} ${by + 28} L${cx - 30} ${by + 52}" stroke="#c93a33" stroke-width="5" stroke-linecap="round"/>`;
  const lNo = hide(lab(stage, 'bottom: no fabric', cx + 40, by + 30, 'small red'));
  const dl = svgEl('g', {}, svg); const yA = yT - ry - 16;
  dl.innerHTML = `<line x1="${cx - rx}" y1="${yA}" x2="${cx + rx}" y2="${yA}" stroke="#1c2230" stroke-width="2"/><path d="M${cx - rx + 8} ${yA - 5} L${cx - rx} ${yA} L${cx - rx + 8} ${yA + 5} M${cx + rx - 8} ${yA - 5} L${cx + rx} ${yA} L${cx + rx - 8} ${yA + 5}" fill="none" stroke="#1c2230" stroke-width="2"/>`;
  labC(stage, '18 in', cx, yA - 16, 'dim');
  labC(stage, `${T('16\\tfrac12')} in`, cx + rx + 46, by - hp / 2, 'dim');
  const ck = hide(add(stage, chkList([1, 0, 1]), 410, 60));
  const X = 600, LW = ex.W - X - 12;
  const L0 = line(stage, `1 circle + side, ${T('r=18\\div2=9')} in`, X, 16, LW);
  const L1 = line(stage, `Top: ${T(`\\pi\\times9^2=${dots(top)}`)}`, X, 68, LW);
  const L2 = line(stage, `Side: ${T(`2\\pi\\times9\\times16.5=${dots(side)}`)}`, X, 120, LW);
  const L3 = line(stage, `${T(`\\text{SA}=${dots(SA)}\\approx1\\,188`)} in²`, X, 172, LW, 'big');
  const L4 = line(stage, `${T(`${dots(SA)}\\div144\\approx${fx(ft, 1)}`)} ft²`, X, 236, LW, 'big');
  return [
    { cap: 'Which pieces get fabric? The <b>top</b> and the <b>side</b>, not the bottom. So: <b>1 circle + side</b>.',
      run: async (c) => { await c.fadeIn(ck); await c.fadeIn(noBot); await c.fadeIn(lNo); await c.fadeIn(L0); } },
    { cap: `The top is a circle with ${T('r=9')} in: ${T(`\\pi\\times9^2=${dots(top)}`)} in².`,
      run: async (c) => { await c.fadeIn(topHi); await c.fadeIn(L1); } },
    { cap: `The side: ${T(`2\\times\\pi\\times9\\times16.5=${dots(side)}`)} in².`,
      run: async (c) => { await c.fadeIn(sideHi); await c.fadeIn(L2); } },
    { cap: `Add the two pieces: ${T(`${dots(top)}+${dots(side)}=${dots(SA)}`)}, about <b>1 188 in²</b>.`.replace('1 188', '1 188'),
      run: async (c) => { await c.fadeIn(L3); } },
    { cap: `Change to ft²: ${T(`${dots(SA)}\\div144=${dots(ft, 3)}`)}, about <b>8.2 ft²</b> of fabric.`,
      run: async (c) => { await c.fadeIn(L4); } }
  ];
}

/* =====================================================================================
 * 2b. Paint the parkade (Example 4)
 * ===================================================================================== */
const columns = {
  title: '12 columns, 2 coats: how many cans?',
  height: 430,
  minW: 960,
  ask: 'Example 4: 12 columns, each <b>0.6 m</b> across and <b>3.2 m</b> tall. Paint the sides only, <b>2 coats</b>. One can covers <b>37 m²</b> and costs <b>$68.99</b>. Add 5% GST.',
  make(stage, v, ex) {
    const side = 2 * PI * 0.3 * 3.2, tot = side * 24, cans = tot / 37;
    const svg = svgBox(stage, 620, 430);
    svgEl('rect', { x: 14, y: 22, width: 590, height: 18, fill: '#bdbab3', stroke: STROKE, 'stroke-width': 2 }, svg);
    svgEl('line', { x1: 14, y1: 212, x2: 604, y2: 212, stroke: '#8a7d66', 'stroke-width': 3 }, svg);
    const cols = [];
    for (let i = 0; i < 12; i++) {
      const cx = 40 + i * 49, g = svgEl('g', {}, svg);
      const body = svgEl('path', { d: bandD(cx, 206, 15, 166, 0.3), fill: '#d6d3cc', stroke: STROKE, 'stroke-width': 2 }, g);
      cols.push({ body, cx });
    }
    const n1 = hide(labC(stage, '1', 40, 196, 'small'));
    const lOne = hide(lab(stage, `one column: ${T('r=0.3')} m, ${T('h=3.2')} m`, 70, 222, 'small'));
    const lCoat = hide(labC(stage, '', 310, 234, 'tag'));
    // the area bar, cut into cans
    const kx = 520 / (37 * 4), bx = 30, byy = 318;
    const bar = svgEl('rect', { x: bx, y: byy, width: 0, height: 34, rx: 4, fill: '#6fa8dc' }, svg);
    const lBar = hide(lab(stage, `${T(dots(tot))} m² to paint`, bx, byy + 44, 'small'));
    const blocks = hide(svgEl('g', {}, svg));
    blocks.innerHTML = [0, 1, 2, 3].map((i) => `<rect x="${bx + i * 37 * kx}" y="${byy - 6}" width="${37 * kx}" height="46" fill="none" stroke="${i === 3 ? '#c93a33' : STROKE}" stroke-width="2.5" stroke-dasharray="${i === 3 ? '7 5' : ''}"/>`
      + `<g transform="translate(${bx + i * 37 * kx + 37 * kx / 2 - 14} ${byy - 52})"><rect x="0" y="6" width="28" height="34" rx="3" fill="${i === 3 ? '#f3c3b8' : '#6fa8dc'}" stroke="${STROKE}" stroke-width="2"/><rect x="2" y="0" width="24" height="8" rx="2" fill="#9aa0ab" stroke="${STROKE}" stroke-width="1.5"/><text x="14" y="30" text-anchor="middle" font-size="15" font-weight="800" fill="#1c2230">${i + 1}</text></g>`).join('');
    const lCan = hide(lab(stage, '1 can = 37 m²', bx + 220, byy + 44, 'small'));
    const X = 636, LW = ex.W - X - 12;
    const L1 = line(stage, `One side: ${T(dots(side, 3))} m²`, X, 16, LW);
    const L2 = line(stage, `${T(`\\times12\\times2=${dots(tot)}`)} m²`, X, 68, LW);
    const L3 = line(stage, `${T(`${dots(tot)}\\div37=${dots(cans)}`)}`, X, 120, LW);
    const st = hide(stamp(stage, '4 cans', { ok: true, x: bx + 3.5 * 37 * kx, y: byy + 76, rotate: -6 }));
    const rc = hide(add(stage, box(h('div', 'u3l11-rcpt', `<div class="u3l11-rr"><span class="u3l11-rk">4 cans × $68.99</span><b>$275.96</b></div><div class="u3l11-rr"><span class="u3l11-rk">GST: × 1.05</span><b>+ $13.80</b></div><div class="u3l11-rr u3l11-rt"><span class="u3l11-rk">Total</span><b>$289.76</b></div>`), LW, 130), X, 186));
    const paint = (t, col) => { const n = Math.round(t * 12); cols.forEach((o, i) => { if (i < n) o.body.style.fill = col; }); };
    return [
      { cap: `One column: side only, ${T('r=0.6\\div2=0.3')} m. ${T(`2\\times\\pi\\times0.3\\times3.2=${dots(side, 3)}`)} m².`,
        run: async (c) => { await c.anim(cols[0].body, [{ fill: '#d6d3cc' }, { fill: '#bcd9f0' }], 400); await c.fadeIn(n1); await c.fadeIn(lOne); await c.fadeIn(L1); } },
      { cap: `12 columns, and every column gets <b>2 coats</b>: ${T(`${dots(side, 3)}\\times12\\times2=${dots(tot)}`)} m².`,
        run: async (c) => {
          lOne.style.opacity = 0; n1.style.opacity = 0;
          lCoat.innerHTML = 'Coat 1'; await c.fadeIn(lCoat); await tween(c, 1100, (t) => paint(t, '#bcd9f0'), (t) => t);
          lCoat.innerHTML = 'Coat 2'; await tween(c, 1100, (t) => paint(t, '#4f8fcf'), (t) => t);
          lCoat.innerHTML = '12 columns × 2 coats = 24 sides'; await c.fadeIn(L2);
        } },
      { cap: `Each can covers 37 m²: ${T(`${dots(tot)}\\div37=${dots(cans)}`)} cans.`,
        run: async (c) => { await tween(c, 900, (t) => { bar.setAttribute('width', t * tot * kx); }); await c.fadeIn(lBar); await c.fadeIn(blocks); await c.fadeIn(lCan); await c.fadeIn(L3); } },
      { cap: '3 cans cover only 111 m², not enough. Round <b>up</b>: <b>4 cans</b>.',
        run: async (c) => { await stampIn(c, st); } },
      { cap: `Cost: ${T('4\\times\\$68.99=\\$275.96')}. With 5% GST: ${T('\\$275.96\\times1.05=\\$289.758\\approx\\$289.76')}.`,
        run: async (c) => { await c.pop(rc); } }
    ];
  }
};

/* =====================================================================================
 * 3. Unfold a square pyramid (Example 5)
 * ===================================================================================== */
const PY = {
  a: { ask: 'Example 5(a): a square pyramid with a base edge of <b>10 cm</b>, a slant height of <b>13 cm</b> and a height of <b>12 cm</b>. Find its surface area.',
    b: 10, s: 13, u: 'cm', hLab: '12 cm', baseW: 'Base', faceW: 'triangle', tri: 65, triT: '\\tfrac12\\times10\\times13=65', four: 260, baseA: 100, baseT: '10\\times10=100', SA: 360 },
  b: { ask: 'Example 5(b): Jonah’s tent has a <b>7 ft by 7 ft</b> floor (sewn in) and 4 walls with a slant height of <b>6½ ft</b>. How much fabric is in the tent?',
    b: 7, s: 6.5, u: 'ft', baseW: 'Floor', faceW: 'wall', tri: 22.75, triT: '\\tfrac12\\times7\\times6\\tfrac12=22.75', four: 91, baseA: 49, baseT: '7\\times7=49', SA: 140, cols: ['#9fd0a8', '#c6e6cb', '#9fd0a8', '#c6e6cb'], baseFill: '#e8dcc0' }
};
const pyramid = {
  title: 'Unfold the pyramid: 1 square + 4 triangles',
  height: 440,
  minW: 960,
  choices: [{ sep: 'Check:' }, { v: 'a', label: '5(a) Pyramid' }, { v: 'b', label: '5(b) Jonah’s tent' }],
  ask: (k) => PY[k].ask,
  make(stage, k, ex) {
    const d = PY[k], b = d.b, s = d.s, u = d.u, kk = 330 / (b + 2 * s), ox = 290, oy = 230;
    const svg = svgBox(stage, 580, 440);
    const py = pyr3D(svg, b, s, { k: kk, ox, oy, cols: d.cols, baseFill: d.baseFill });
    const lines = svgEl('g', {}, svg);
    const sl = svgEl('line', { stroke: '#c93a33', 'stroke-width': 4, 'stroke-linecap': 'round' }, lines);
    const hl = svgEl('line', { stroke: '#1c2230', 'stroke-width': 2.5, 'stroke-dasharray': '7 6' }, lines);
    const lS = hide(labC(stage, `${T('s')} = ${nH(String(s).replace('6.5', '6½'))} ${u}`, 0, 0, 'dim red'));
    const lB = hide(labC(stage, `${nH(b)} ${u}`, 0, 0, 'dim'));
    const lH = d.hLab ? hide(labC(stage, `${T('h')} = ${d.hLab}`, 0, 0, 'dim')) : null;
    const place = () => {
      const m = py.proj(py.mid(0)), a = py.proj(py.apex(0)), o0 = py.proj([0, 0, 0]), top = py.proj([0, py.H, 0]);
      sl.setAttribute('x1', m[0]); sl.setAttribute('y1', m[1]); sl.setAttribute('x2', a[0]); sl.setAttribute('y2', a[1]);
      hl.setAttribute('x1', o0[0]); hl.setAttribute('y1', o0[1]); hl.setAttribute('x2', top[0]); hl.setAttribute('y2', top[1]);
      const t = 0.72, sx = lerp(m[0], a[0], t), sy = lerp(m[1], a[1], t);
      lS.style.left = (sx - 74) + 'px'; lS.style.top = sy + 'px';
      lB.style.left = m[0] + 'px'; lB.style.top = (m[1] + 22) + 'px';
      if (lH) { lH.style.left = (top[0] + 64) + 'px'; lH.style.top = lerp(o0[1], top[1], 0.45) + 'px'; }
    };
    place();
    const redraw = () => { py.update(); place(); };
    // final (flat, from above) label spots
    const fin = () => { py.st.phi = 0; py.st.E = 90 * D; py.st.psi = 0; };
    const keep = { phi: py.st.phi, E: py.st.E, psi: py.st.psi, k: py.st.k, oy: py.st.oy };
    fin();
    const cBase = py.proj([0, 0, 0]);
    const cTri = [0, 1, 2, 3].map((i) => { const m = py.mid(i), a = py.apex(i); return py.proj([(m[0] + a[0]) / 2, 0, (m[2] + a[2]) / 2]); });
    Object.assign(py.st, keep);
    const kC = Math.min(26, 230 / Math.max(b, py.H * 1.1)), oyC = 316; py.st.k = kC; py.st.oy = oyC; redraw();
    const lBase = hide(labC(stage, `${T(nT(d.baseA))} ${u}²`, cBase[0], cBase[1], 'area'));
    const lTri = cTri.map((p) => hide(labC(stage, `${T(nT(d.tri))}`, p[0], p[1], 'area')));
    const X = 600, LW = ex.W - X - 12;
    const L1 = line(stage, `${d.baseW}: ${T(d.baseT)} ${u}²`, X, 16, LW);
    const L2 = line(stage, `One ${d.faceW}: ${T(d.triT)}`, X, 68, LW);
    const L3 = line(stage, `4 ${d.faceW}s: ${T(`4\\times${nT(d.tri)}=${d.four}`)} ${u}²`, X, 120, LW);
    const L4 = line(stage, `${T(`\\text{SA}=${d.baseA}+${d.four}=${d.SA}`)} ${u}²`, X, 172, LW, 'big');
    const st = d.hLab ? hide(stamp(stage, 'Height not used', { ok: null, x: X + LW / 2, y: 262, rotate: -5 })) : null;
    const steps = [
      { cap: d.hLab ? `A square pyramid: base edge <b>10 cm</b>, slant height <b>13 cm</b> (red, up the face), height <b>12 cm</b> (dashed, inside).`
          : `Jonah’s tent: a <b>7 ft</b> square floor and 4 walls. The slant height of a wall is <b>6½ ft</b> (red).`,
        run: async (c) => { await c.fadeIn(lB); await c.fadeIn(lS); if (lH) await c.fadeIn(lH); } },
      { cap: `Unfold it: the 4 ${d.faceW}s fold down flat around the ${d.baseW.toLowerCase()}.`,
        run: async (c) => {
          if (lH) { lH.style.opacity = 0; } hl.style.opacity = 0;
          await tween(c, 1800, (t) => { py.st.phi = lerp(py.phi0, 0, t); py.st.k = lerp(kC, kk, t); py.st.oy = lerp(oyC, oy, t); redraw(); });
        } },
      { cap: 'Look from straight above: the net is <b>1 square + 4 triangles</b>.',
        run: async (c) => { const E0 = py.st.E, p0 = py.st.psi; await tween(c, 1200, (t) => { py.st.E = lerp(E0, 90 * D, t); py.st.psi = lerp(p0, 0, t); redraw(); }); } },
      { cap: `${d.baseW}: ${T(`${d.baseT}`)} ${u}².`,
        run: async (c) => { lB.style.opacity = 0; await c.anim(py.base, [{ fill: d.baseFill || '#eadcbf' }, { fill: '#f4d06a' }], 400); await c.pop(lBase); await c.fadeIn(L1); } },
      { cap: `One ${d.faceW}: ${T('\\tfrac12\\times\\text{base}\\times\\text{slant height}')} ${T(`=${d.triT}`)} ${u}².`,
        run: async (c) => { await c.pop(lTri[0]); await c.fadeIn(L2); } },
      { cap: `All 4 ${d.faceW}s are the same size: ${T(`4\\times${nT(d.tri)}=${d.four}`)} ${u}².`,
        run: async (c) => { for (const l of lTri.slice(1)) await c.pop(l, 260); await c.fadeIn(L3); } },
      { cap: `Add: ${T(`\\text{SA}=${d.baseA}+${d.four}=${d.SA}`)} ${u}².${d.hLab ? ' The height, 12 cm, is <b>not</b> used.' : ' The tent has <b>140 ft²</b> of fabric.'}`,
        run: async (c) => { await c.fadeIn(L4); if (st) await stampIn(c, st); } }
    ];
    return steps;
  }
};

/* =====================================================================================
 * 3b. Full notes: why the slant height is longer than the height
 * ===================================================================================== */
const SL = {
  p: { ask: 'Example 5(a): the pyramid has a base edge of <b>10 cm</b>, a height of <b>12 cm</b> and a slant height of <b>13 cm</b>.', half: 5, hh: 12, s: 13, halfW: 'half the base', halfT: '10\\div2=5', what: 'pyramid', fill: '#f2c38a' },
  c: { ask: 'Example 6(a): the cone has a radius of <b>9 cm</b>, a height of <b>12 cm</b> and a slant height of <b>15 cm</b>.', half: 9, hh: 12, s: 15, halfW: 'the radius', halfT: 'r=9', what: 'cone', fill: '#cfe0f2' }
};
const slant = {
  title: 'Height inside, slant height outside',
  height: 360,
  minW: 960,
  choices: [{ v: 'p', label: 'Pyramid (Ex 5a)' }, { v: 'c', label: 'Cone (Ex 6a)' }],
  ask: (k) => SL[k].ask,
  make(stage, k, ex) {
    const d = SL[k], kk = 290 / Math.max(2 * d.half, d.hh + 2), cx = 260, by = 316, ap = [cx, by - d.hh * kk], L = [cx - d.half * kk, by], R = [cx + d.half * kk, by];
    const svg = svgBox(stage, 560, 360);
    svgEl('path', { d: `M${P(L[0], L[1])} L${P(ap[0], ap[1])} L${P(R[0], R[1])} Z`, fill: d.fill, stroke: STROKE, 'stroke-width': 3, 'stroke-linejoin': 'round' }, svg);
    const tri = hide(svgEl('path', { d: `M${P(cx, by)} L${P(ap[0], ap[1])} L${P(R[0], R[1])} Z`, fill: '#f4d06a', stroke: STROKE, 'stroke-width': 3 }, svg));
    const hL = hide(svgEl('line', { x1: cx, y1: by, x2: ap[0], y2: ap[1], stroke: '#1c2230', 'stroke-width': 3, 'stroke-dasharray': '8 6' }, svg));
    const bL = hide(svgEl('line', { x1: cx, y1: by, x2: R[0], y2: R[1], stroke: '#1f5bd6', 'stroke-width': 5 }, svg));
    const sL = hide(svgEl('line', { x1: R[0], y1: R[1], x2: ap[0], y2: ap[1], stroke: '#c93a33', 'stroke-width': 5 }, svg));
    const sq = hide(svgEl('path', { d: `M${cx + 16} ${by} V${by - 16} H${cx}`, fill: 'none', stroke: '#1c2230', 'stroke-width': 2.5 }, svg));
    const lh = hide(lab(stage, `${T('h')} = ${d.hh}`, cx - 70, by - d.hh * kk / 2 - 14, 'dim'));
    const lb = hide(labC(stage, `${d.half}`, cx + d.half * kk / 2, by + 16, 'dim blue'));
    const ls = hide(lab(stage, `${T('s')} = ${d.s}`, (R[0] + ap[0]) / 2 + 14, (R[1] + ap[1]) / 2 - 14, 'dim red'));
    const X = 590, LW = ex.W - X - 12;
    const L1 = line(stage, `height ${T('h')} = ${d.hh} cm (inside)`, X, 30, LW);
    const L2 = line(stage, `${d.halfW} = ${d.half} cm`, X, 84, LW);
    const L3 = line(stage, `slant height ${T('s')} = ${d.s} cm (outside)`, X, 138, LW, 'big');
    const st = hide(stamp(stage, `${d.s} > ${d.hh} ✓`, { ok: true, x: X + LW / 2, y: 240, rotate: -5 }));
    return [
      { cap: `Cut the ${d.what} straight down the middle. The cut face is a triangle.`, run: async (c) => { await c.sleep(200); } },
      { cap: `The height <b>${T('h')}</b> goes straight up the inside, from the centre of the base: <b>${d.hh} cm</b>.`, run: async (c) => { await c.fadeIn(hL); await c.fadeIn(lh); await c.fadeIn(L1); } },
      { cap: `Along the floor from the centre to the edge: ${d.halfW}, ${T(d.halfT)} cm.`, run: async (c) => { await c.fadeIn(bL); await c.fadeIn(lb); await c.fadeIn(L2); } },
      { cap: `The slant height <b>${T('s')}</b> runs up the outside to the apex: <b>${d.s} cm</b>. The three lengths make a <b>right triangle</b>.`,
        run: async (c) => { await c.fadeIn(tri); svg.appendChild(hL); svg.appendChild(bL); await c.fadeIn(sL); await c.fadeIn(sq); await c.fadeIn(ls); await c.fadeIn(L3); } },
      { cap: `The slant height is the side across from the square corner: the <b>longest</b> side. So ${T('s')} is always longer than ${T('h')}: ${T(`${d.s}>${d.hh}`)}.`,
        run: async (c) => { await stampIn(c, st); } }
    ];
  }
};

/* =====================================================================================
 * 4. Flatten a cone into a fan (Example 6)
 * ===================================================================================== */
const CO = {
  a: { ask: 'Example 6(a): a closed cone has a radius of <b>9 cm</b>, a slant height of <b>15 cm</b> and a height of <b>12 cm</b>. Find its surface area to the nearest tenth.',
    r: 9, s: 15, h: 12, k: 8, closed: true },
  b: { ask: 'Example 6(b): a waffle cone, open at the top, is <b>5 cm</b> across with a slant height of <b>12 cm</b>. How much waffle is in it, to the nearest tenth?',
    r: 2.5, s: 12, d: 5, h: Math.sqrt(144 - 6.25), k: 14, closed: false }
};
const cone = {
  title: 'Flatten the cone: a fan and a circle',
  height: 430,
  minW: 960,
  choices: [{ sep: 'Check:' }, { v: 'a', label: '6(a) Closed cone' }, { v: 'b', label: '6(b) Waffle cone' }],
  ask: (k) => CO[k].ask,
  make(stage, k, ex) {
    const d = CO[k], kk = d.k, R = d.s * kk, rp = d.r * kk, th = 2 * PI * d.r / d.s, base = PI * d.r * d.r, side = PI * d.r * d.s;
    const svg = svgBox(stage, 640, 430);
    // the cone (point up for 6(a), point down for the waffle cone)
    const cx = 130, coneG = svgEl('g', {}, svg);
    let rimY, apY;
    if (d.closed) { rimY = 330; apY = rimY - d.h * kk; coneG.innerHTML = coneSVG(cx, rimY, rp, d.h * kk, { fill: '#cfe0f2' }); }
    else { rimY = 120; apY = rimY + d.h * kk; coneG.innerHTML = `<path d="M${P(cx - rp, rimY)} L${P(cx, apY)} L${P(cx + rp, rimY)} Z" fill="#e9b96e" stroke="${STROKE}" stroke-width="2.6" stroke-linejoin="round"/><path d="M${P(cx - rp + 4, rimY + 14)} L${P(cx + rp - 8, rimY + 60)} M${P(cx + rp - 4, rimY + 14)} L${P(cx - rp + 8, rimY + 60)}" stroke="#b07a32" stroke-width="1.5" opacity=".6"/><ellipse cx="${cx}" cy="${rimY}" rx="${rp}" ry="${rp * 0.3}" fill="#f6dfb0" stroke="${STROKE}" stroke-width="2.6"/>`; }
    const rimHi = hide(svgEl('path', { d: d.closed ? `M${P(cx - rp, rimY)} A${rp} ${rp * 0.28} 0 0 0 ${P(cx + rp, rimY)}` : `M${P(cx - rp, rimY)} A${rp} ${rp * 0.3} 0 0 0 ${P(cx + rp, rimY)} A${rp} ${rp * 0.3} 0 0 0 ${P(cx - rp, rimY)}`, fill: 'none', stroke: '#1f5bd6', 'stroke-width': 5 }, svg));
    const cutL = hide(svgEl('line', { x1: cx, y1: apY, x2: d.closed ? cx + rp * 0.3 : cx + rp * 0.35, y2: d.closed ? rimY + rp * 0.27 : rimY + rp * 0.28, stroke: '#c93a33', 'stroke-width': 3, 'stroke-dasharray': '6 5' }, svg));
    const lr = labC(stage, d.closed ? `${T('r')} = 9 cm` : '5 cm across', cx, d.closed ? rimY + rp * 0.28 + 22 : rimY - rp * 0.3 - 18, 'dim');
    const ls = labC(stage, `${T('s')} = ${d.s} cm`, cx + (d.closed ? rp * 0.5 + 58 : rp * 0.5 + 54), (rimY + apY) / 2, 'dim red');
    const lh = d.closed ? labC(stage, `${T('h')} = 12`, cx - 44, (rimY + apY) / 2, 'dim small') : null;
    const hl = d.closed ? svgEl('line', { x1: cx, y1: rimY, x2: cx, y2: apY, stroke: '#1c2230', 'stroke-width': 2, 'stroke-dasharray': '6 5' }, svg) : null;
    // the fan
    const fxx = d.closed ? 400 : 400, fyy = d.closed ? 92 : 50;
    const fan = hide(svgEl('path', { d: fanD(fxx, fyy, R, 0).fan, fill: d.closed ? '#cfe0f2' : '#e9b96e', stroke: STROKE, 'stroke-width': 2.6, 'stroke-linejoin': 'round' }, svg));
    const arc = hide(svgEl('path', { d: fanD(fxx, fyy, R, th).arc, fill: 'none', stroke: '#1f5bd6', 'stroke-width': 6 }, svg));
    const F = fanD(fxx, fyy, R, th);
    const lArc = hide(labC(stage, `curved edge ${T('=2\\pi r')}`, fxx, fyy + R + 22, 'small blue'));
    const lFs = hide(labC(stage, `${T('s')} = ${d.s}`, lerp(fxx, F.p2[0], 0.5) - 30, lerp(fyy, F.p2[1], 0.5) - 8, 'dim small red'));
    const lFan = hide(labC(stage, `${T(`\\pi rs=${dots(side)}`)}`, fxx, fyy + R * 0.58, 'area'));
    // the base circle
    const bcx = 400, bcy = d.closed ? 344 : 330;
    const bc = hide(svgEl('circle', { cx: bcx, cy: bcy, r: rp, fill: d.closed ? '#fbe3b5' : 'none', stroke: d.closed ? STROKE : '#9aa0ab', 'stroke-width': 2.6, 'stroke-dasharray': d.closed ? '' : '7 6' }, svg));
    const bx = d.closed ? null : hide(svgEl('path', { d: `M${bcx - 26} ${bcy - 26} L${bcx + 26} ${bcy + 26} M${bcx + 26} ${bcy - 26} L${bcx - 26} ${bcy + 26}`, stroke: '#c93a33', 'stroke-width': 5, 'stroke-linecap': 'round' }, svg));
    const lBase = hide(lab(stage, d.closed ? `${T(`\\pi r^2=${dots(base)}`)}` : 'open top: no base', bcx + rp + 10, bcy - 14, d.closed ? 'area' : 'small red'));
    const X = 650, LW = ex.W - X - 12;
    const L1 = line(stage, d.closed ? `Base: ${T(`\\pi\\times9^2=${dots(base)}`)}` : `${T('r=5\\div2=2.5')} cm`, X, 16, LW);
    const L2 = line(stage, `Side: ${T(`\\pi\\times${nT(d.r)}\\times${d.s}=${dots(side)}`)}`, X, 68, LW);
    const L3 = line(stage, d.closed ? `${T(`\\text{SA}\\approx${fx(base + side, 1)}`)} cm²` : `Waffle ${T(`\\approx${fx(side, 1)}`)} cm²`, X, 120, LW, 'big');
    const st = d.closed ? hide(stamp(stage, 'Height not used', { ok: null, x: X + LW / 2, y: 210, rotate: -5 })) : null;
    return [
      { cap: d.closed ? 'A closed cone: radius <b>9 cm</b>, slant height <b>15 cm</b> (down the outside), height 12 cm (dashed, inside).'
          : 'A waffle cone, open at the top: <b>5 cm</b> across, slant height <b>12 cm</b> (down the outside).',
        run: async (c) => { await c.fadeIn(cutL); } },
      { cap: 'Cut the side along a slant line and flatten it. It opens up into a <b>fan</b>.',
        run: async (c) => {
          await c.anim(coneG, [{ opacity: 1 }, { opacity: 0.3 }], 300);
          fan.style.opacity = 1; await tween(c, 1600, (t) => { fan.setAttribute('d', fanD(fxx, fyy, R, th * t).fan); });
        } },
      { cap: `The straight edges of the fan are the slant height, <b>${d.s} cm</b>. The curved edge went once around the base: it is ${T('2\\pi r')} long.`,
        run: async (c) => { await c.fadeIn(rimHi); await c.fadeIn(arc); await c.fadeIn(lArc); await c.fadeIn(lFs); } },
      d.closed
        ? { cap: `The base is a circle with ${T('r=9')} cm: ${T(`\\pi\\times9^2=${dots(base)}`)} cm².`, run: async (c) => { await c.pop(bc); await c.pop(lBase); await c.fadeIn(L1); } }
        : { cap: `It is <b>open</b> at the top, so there is no base. Use the radius: ${T('r=5\\div2=2.5')} cm.`, run: async (c) => { await c.fadeIn(bc); await c.fadeIn(bx); await c.fadeIn(lBase); await c.fadeIn(L1); } },
      { cap: `The fan (the curved side): ${T(`\\pi rs=\\pi\\times${nT(d.r)}\\times${d.s}=${dots(side)}`)} cm².`,
        run: async (c) => { await c.anim(fan, [{ fill: d.closed ? '#cfe0f2' : '#e9b96e' }, { fill: d.closed ? '#9fc3ea' : '#dc9c48' }], 400); await c.pop(lFan); await c.fadeIn(L2); } },
      d.closed
        ? { cap: `Add: ${T(`\\text{SA}=${dots(base)}+${dots(side)}=${dots(base + side)}`)}, about <b>678.6 cm²</b>. The 12 cm height is not used.`,
          run: async (c) => { await c.fadeIn(L3); await stampIn(c, st); } }
        : { cap: `Side only: the cone has about <b>${fx(side, 1)} cm²</b> of waffle.`, run: async (c) => { await c.fadeIn(L3); } }
    ];
  }
};

/* =====================================================================================
 * 4b. Full notes: the fan cut into slices becomes a rectangle πr by s
 * ===================================================================================== */
const slices = {
  title: 'Slice the fan: why the side is πrs',
  height: 400,
  minW: 960,
  choices: [{ v: 12, label: '12 slices' }, { v: 24, label: '24 slices' }],
  ask: 'The fan from a cone has straight edges <b>s</b> and a curved edge <b>2πr</b> long. Why is its area <b>πrs</b>?',
  make(stage, N, ex) {
    const r = 2, s = 6, kk = 33, R = s * kk, th = 2 * PI * r / s, al = th / N, w = 2 * R * Math.sin(al / 2);
    const svg = svgBox(stage, 960, 400);
    const FX = 200, FY = 40;
    const X0 = 470, YT = 120;                       // the rectangle: top-left corner
    const fanPts = (i, t) => {
      // slice i: apex + arc points; at t=0 in the fan, at t=1 in the row
      const ang0 = PI / 2 - th / 2 + (i + 0.5) * al;   // the slice's middle direction in the fan
      const up = i % 2 === 0;
      const rowAng = up ? PI / 2 : -PI / 2;            // middle direction in the row (down for apex-up slices)
      const ang = lerp(ang0, rowAng, t);
      const ax = lerp(FX, X0 + w / 2 + i * w / 2, t), ay = lerp(FY, up ? YT : YT + R * Math.cos(al / 2), t);
      const pts = [[ax, ay]];
      for (let j = 0; j <= 4; j++) { const a = ang - al / 2 + al * j / 4; pts.push([ax + R * Math.cos(a), ay + R * Math.sin(a)]); }
      return pts.map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
    };
    const polys = [];
    for (let i = 0; i < N; i++) polys.push(svgEl('polygon', { points: fanPts(i, 0), fill: i % 2 ? '#9fc3ea' : '#cfe0f2', stroke: '#cfe0f2', 'stroke-width': 1.2, 'stroke-linejoin': 'round' }, svg));
    const F = fanD(FX, FY, R, th);
    const arc = svgEl('path', { d: F.arc, fill: 'none', stroke: '#1f5bd6', 'stroke-width': 5 }, svg);
    const l1 = labC(stage, `curved edge ${T('2\\pi r')}`, FX, FY + R + 24, 'small blue');
    const l2 = labC(stage, `edge ${T('s')}`, lerp(FX, F.p2[0], 0.5) - 34, lerp(FY, F.p2[1], 0.5) - 8, 'dim red');
    const L = N * w / 2;
    const brT = hide(svgEl('g', {}, svg)); const yB = YT + R * Math.cos(al / 2);
    brT.innerHTML = `<line x1="${X0}" y1="${yB + 26}" x2="${X0 + L + w / 2}" y2="${yB + 26}" stroke="#1f5bd6" stroke-width="3"/><path d="M${X0} ${yB + 18} V${yB + 34} M${X0 + L + w / 2} ${yB + 18} V${yB + 34}" stroke="#1f5bd6" stroke-width="3"/>`
      + `<line x1="${X0 + L + w / 2 + 22}" y1="${YT}" x2="${X0 + L + w / 2 + 22}" y2="${yB}" stroke="#c93a33" stroke-width="3"/><path d="M${X0 + L + w / 2 + 14} ${YT} H${X0 + L + w / 2 + 30} M${X0 + L + w / 2 + 14} ${yB} H${X0 + L + w / 2 + 30}" stroke="#c93a33" stroke-width="3"/>`;
    const lLen = hide(labC(stage, `half of ${T('2\\pi r')} on top, half on the bottom: length ${T('\\pi r')}`, X0 + L / 2, yB + 52, 'small blue'));
    const lHt = hide(lab(stage, `height ${T('s')}`, X0 + L + w / 2 + 34, (YT + yB) / 2 - 14, 'small red'));
    const res = hide(add(stage, box(h('div', 'u3l11-res', `<div>${T('\\text{area}=\\pi r\\times s=\\pi rs')}</div>`), 330, 56), X0 + 20, 36));
    return [
      { cap: `The fan from a cone. Its straight edges are the slant height ${T('s')}. Its curved edge went around the base: ${T('2\\pi r')}.`, run: async (c) => { await c.sleep(200); } },
      { cap: `Cut it into ${N} thin slices. Each slice is almost a triangle with a height of ${T('s')}.`,
        run: async (c) => { for (const p of polys) p.setAttribute('stroke', STROKE); await c.sleep(300); } },
      { cap: 'Turn every other slice upside down and push them together, top to tail.',
        run: async (c) => { arc.style.opacity = 0; l1.style.opacity = 0; l2.style.opacity = 0; await tween(c, 2000, (t) => { polys.forEach((p, i) => p.setAttribute('points', fanPts(i, t))); }); } },
      { cap: `It is very close to a <b>rectangle</b>. Its height is ${T('s')}. Half the curved edge is on the bottom and half on top, so its length is ${T('\\pi r')}.`,
        run: async (c) => { await c.fadeIn(brT); await c.fadeIn(lLen); await c.fadeIn(lHt); } },
      { cap: `Area of a rectangle = length × height: ${T('\\pi r\\times s=\\pi rs')}. ${N === 12 ? 'Try 24 slices: even closer to a rectangle.' : 'More slices, even closer to a rectangle.'}`,
        run: async (c) => { await c.pop(res); } }
    ];
  }
};

/* =====================================================================================
 * 5. The grain bin (Example 7)
 * ===================================================================================== */
const bin = {
  title: 'Build the bin from flat steel',
  height: 440,
  minW: 960,
  ask: 'Example 7: grain bin walls <b>6.4 m</b> across and <b>5.5 m</b> tall, a cone roof with slant height <b>3.6 m</b>, a concrete floor (no steel). Steel costs <b>$24.80</b> per m².',
  make(stage, v, ex) {
    const r = 3.2, hh = 5.5, s = 3.6, walls = 2 * PI * r * hh, roof = PI * r * s, tot = walls + roof, C = PI * 6.4;
    const svg = svgBox(stage, 600, 440);
    const k = 22, cx = 130, by = 352, rx = r * k, hp = hh * k, rh = Math.sqrt(s * s - r * r) * k;
    svgEl('rect', { x: cx - rx - 26, y: by - 4, width: 2 * rx + 52, height: 22, fill: '#bdbab3', stroke: STROKE, 'stroke-width': 2 }, svg);
    const silo = svgEl('g', {}, svg); silo.innerHTML = siloSVG(cx, by, rx, hp, rh);
    const floorX = hide(svgEl('g', {}, svg)); floorX.innerHTML = `<path d="M${cx - 14} ${by + 22} L${cx + 14} ${by + 40} M${cx + 14} ${by + 22} L${cx - 14} ${by + 40}" stroke="#c93a33" stroke-width="4" stroke-linecap="round"/>`;
    const lFloor = hide(labC(stage, 'concrete floor: no steel', cx, by + 58, 'small red'));
    const wA = svgEl('g', {}, svg); const yW = by - hp * 0.62; wA.innerHTML = `<line x1="${cx - rx + 4}" y1="${yW}" x2="${cx + rx - 4}" y2="${yW}" stroke="#1c2230" stroke-width="2"/><path d="M${cx - rx + 11} ${yW - 5} L${cx - rx + 4} ${yW} L${cx - rx + 11} ${yW + 5} M${cx + rx - 11} ${yW - 5} L${cx + rx - 4} ${yW} L${cx + rx - 11} ${yW + 5}" fill="none" stroke="#1c2230" stroke-width="2"/>`;
    labC(stage, '6.4 m', cx, yW - 16, 'dim');
    labC(stage, '5.5 m', cx + rx + 32, by - hp / 2, 'dim');
    labC(stage, '3.6 m', cx + rx / 2 + 40, by - hp - rh / 2 - 14, 'dim red');
    // flat pieces
    const k2 = 14.5, RX = 252, RY = 268, Lw = C * k2, Hw = hh * k2;
    const rect = svgEl('rect', { x: RX, y: RY, width: 0, height: Hw, fill: '#c9d1da', stroke: STROKE, 'stroke-width': 2.6 }, svg);
    const corr = hide(svgEl('g', {}, svg)); corr.innerHTML = Array.from({ length: 5 }, (_, i) => `<line x1="${RX}" x2="${RX + Lw}" y1="${RY + Hw * (i + 1) / 6}" y2="${RY + Hw * (i + 1) / 6}" stroke="${STROKE}" stroke-width="1" opacity=".35"/>`).join('');
    const lRw = hide(labC(stage, `${T('\\pi\\times6.4\\approx20.1')} m long, 5.5 m tall`, RX + Lw / 2, RY - 16, 'small'));
    const lRa = hide(labC(stage, `${T(dots(walls))} m²`, RX + Lw / 2, RY + Hw / 2, 'area'));
    const FX = 400, FY = 120, FR = s * k2, th = 2 * PI * r / s;
    const fan = hide(svgEl('path', { d: fanD(FX, FY, FR, 0).fan, fill: '#dfe4ea', stroke: STROKE, 'stroke-width': 2.6, 'stroke-linejoin': 'round' }, svg));
    const lFa = hide(lab(stage, `${T(dots(roof))} m²`, FX + FR + 12, FY - 14, 'area'));
    const lFn = hide(labC(stage, 'the roof: almost a whole circle', FX, FY + FR + 20, 'small'));
    const X = 612, LW = ex.W - X - 12;
    const L1 = line(stage, `${T('r=6.4\\div2=3.2')} m`, X, 16, LW);
    const L2 = line(stage, `Walls: ${T(`2\\pi\\times3.2\\times5.5=${dots(walls)}`)}`, X, 68, LW);
    const L3 = line(stage, `Roof: ${T(`\\pi\\times3.2\\times3.6=${dots(roof)}`)}`, X, 120, LW);
    const L4 = line(stage, `Total steel ${T('\\approx146.8')} m²`, X, 172, LW, 'big');
    const rc = hide(add(stage, box(h('div', 'u3l11-rcpt', `<div class="u3l11-rr"><span class="u3l11-rk">146.8 m² × $24.80</span></div><div class="u3l11-rr u3l11-rt"><span class="u3l11-rk">Before tax</span><b>$3&#8239;640.64</b></div>`), LW, 92), X, 236));
    return [
      { cap: 'Which pieces need steel? The <b>walls</b> (the side of a cylinder) and the <b>roof</b> (an open cone). The concrete floor needs none.',
        run: async (c) => { await c.fadeIn(floorX); await c.fadeIn(lFloor); await c.fadeIn(L1); } },
      { cap: `Unroll the walls: a rectangle <b>5.5 m</b> tall and ${T('\\pi\\times6.4\\approx20.1')} m long (once around).`,
        run: async (c) => { await tween(c, 1500, (t) => { rect.setAttribute('width', t * Lw); }); await c.fadeIn(corr); await c.fadeIn(lRw); } },
      { cap: `Walls: ${T(`2\\times\\pi\\times3.2\\times5.5=${dots(walls)}`)} m².`,
        run: async (c) => { await c.pop(lRa); await c.fadeIn(L2); } },
      { cap: `Flatten the roof into a fan. It is an open cone: ${T(`\\pi rs=\\pi\\times3.2\\times3.6=${dots(roof)}`)} m².`,
        run: async (c) => { fan.style.opacity = 1; await tween(c, 1500, (t) => { fan.setAttribute('d', fanD(FX, FY, FR, th * t).fan); }); await c.pop(lFa); await c.fadeIn(lFn); await c.fadeIn(L3); } },
      { cap: `Total steel: ${T(`${dots(walls)}+${dots(roof)}=${dots(tot)}`)}, about <b>146.8 m²</b>.`,
        run: async (c) => { await c.fadeIn(L4); } },
      { cap: `Cost (with the answer to (c)): ${T('146.8\\times\\$24.80=\\$3\\,640.64')} before tax.`,
        run: async (c) => { await c.pop(rc); } }
    ];
  }
};

mountExplainers({ unroll, rollCan, pieces, columns, pyramid, slant, cone, slices, bin });

/* =====================================================================================
 * Static figures for the examples
 * ===================================================================================== */
function figSVG(id, W, H) { const host = document.getElementById(id); if (!host) return null; const s = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, class: 'u3l11-fsvg' }); host.appendChild(s); return s; }
function txt(svg, x, y, s, o = {}) { const t = svgEl('text', Object.assign({ x, y, 'font-size': 18, 'font-weight': 700, fill: '#1c2230', 'text-anchor': 'middle' }, o), svg); t.textContent = s; return t; }
function arrowH(svg, x1, x2, y) { const g = svgEl('g', {}, svg); g.innerHTML = `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#1c2230" stroke-width="2"/><path d="M${x1 + 7} ${y - 5} L${x1} ${y} L${x1 + 7} ${y + 5} M${x2 - 7} ${y - 5} L${x2} ${y} L${x2 - 7} ${y + 5}" fill="none" stroke="#1c2230" stroke-width="2"/>`; }
function arrowV(svg, x, y1, y2) { const g = svgEl('g', {}, svg); g.innerHTML = `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="#1c2230" stroke-width="2"/><path d="M${x - 5} ${y1 + 7} L${x} ${y1} L${x + 5} ${y1 + 7} M${x - 5} ${y2 - 7} L${x} ${y2} L${x + 5} ${y2 - 7}" fill="none" stroke="#1c2230" stroke-width="2"/>`; }
{
  let s = figSVG('u3l11-fig-ex1', 230, 250);
  if (s) { const g = svgEl('g', {}, s); g.innerHTML = cylSVG(100, 220, 62, 170, { body: '#d9483b', lid: '#eef0f2' }); txt(s, 100, 150, 'SOUP', { fill: '#fff4d8', 'font-size': 26, 'font-weight': 800 }); arrowH(s, 38, 162, 22); txt(s, 100, 16, '8 cm'); arrowV(s, 184, 50, 220); txt(s, 210, 140, '11 cm', { 'font-size': 17 }); }
  s = figSVG('u3l11-fig-ex3', 260, 214);
  if (s) { const g = svgEl('g', {}, s); g.innerHTML = cylSVG(104, 190, 90, 140, { body: '#b79ad6', lid: '#d6c4ea', back: true }); arrowH(s, 14, 194, 16); txt(s, 104, 11, '18 in'); arrowV(s, 210, 50, 190); txt(s, 236, 120, '16½', { 'font-size': 17 }); txt(s, 236, 140, 'in', { 'font-size': 17 }); }
  s = figSVG('u3l11-fig-ex5', 280, 240);
  if (s) {
    const py = pyr3D(s, 10, 13, { k: 13, ox: 132, oy: 196, E: 22, psi: 18 });
    const m = py.proj(py.mid(0)), a = py.proj(py.apex(0)), o0 = py.proj([0, 0, 0]);
    svgEl('line', { x1: m[0], y1: m[1], x2: a[0], y2: a[1], stroke: '#c93a33', 'stroke-width': 3 }, s);
    svgEl('line', { x1: o0[0], y1: o0[1], x2: a[0], y2: a[1], stroke: '#1c2230', 'stroke-width': 2, 'stroke-dasharray': '6 5' }, s);
    txt(s, m[0], m[1] + 24, '10 cm'); txt(s, lerp(m[0], a[0], 0.5) - 54, lerp(m[1], a[1], 0.5) + 4, '13 cm', { fill: '#c93a33' });
    svgEl('line', { x1: lerp(o0[0], a[0], 0.45), y1: lerp(o0[1], a[1], 0.45), x2: 226, y2: 92, stroke: '#1c2230', 'stroke-width': 1.2 }, s); txt(s, 252, 90, '12 cm', { 'font-size': 17 });
  }
  s = figSVG('u3l11-fig-ex6a', 250, 230);
  if (s) { const g = svgEl('g', {}, s); g.innerHTML = coneSVG(110, 180, 80, 128); svgEl('line', { x1: 110, y1: 180, x2: 110, y2: 52, stroke: '#1c2230', 'stroke-width': 2, 'stroke-dasharray': '6 5' }, s); svgEl('line', { x1: 110, y1: 180, x2: 190, y2: 180, stroke: '#1c2230', 'stroke-width': 2 }, s); svgEl('circle', { cx: 110, cy: 180, r: 3.5, fill: '#1c2230' }, s);
    txt(s, 150, 205, '9 cm', { 'font-size': 16 }); txt(s, 186, 110, '15 cm', { fill: '#c93a33' }); txt(s, 52, 122, '12 cm', { 'font-size': 16 }); svgEl('line', { x1: 74, y1: 118, x2: 108, y2: 118, stroke: '#1c2230', 'stroke-width': 1.2 }, s); txt(s, 110, 228, '(a) closed cone', { 'font-size': 15, 'font-weight': 600, fill: '#6b6457' }); }
  s = figSVG('u3l11-fig-ex6b', 200, 230);
  if (s) { const g = svgEl('g', {}, s); g.innerHTML = `<path d="M60 50 L100 196 L140 50 Z" fill="#e9b96e" stroke="${STROKE}" stroke-width="2.6" stroke-linejoin="round"/><ellipse cx="100" cy="50" rx="40" ry="12" fill="#f6dfb0" stroke="${STROKE}" stroke-width="2.6"/>`;
    arrowH(s, 60, 140, 22); txt(s, 100, 16, '5 cm'); txt(s, 160, 130, '12 cm', { fill: '#c93a33' }); txt(s, 100, 222, '(b) waffle cone', { 'font-size': 15, 'font-weight': 600, fill: '#6b6457' }); }
  s = figSVG('u3l11-fig-ex7', 250, 250);
  if (s) { const g = svgEl('g', {}, s); g.innerHTML = siloSVG(110, 200, 74, 128, 34); svgEl('rect', { x: 20, y: 197, width: 180, height: 12, fill: '#bdbab3', stroke: STROKE, 'stroke-width': 1.5 }, s);
    arrowH(s, 36, 184, 228); txt(s, 110, 248, '6.4 m'); txt(s, 214, 140, '5.5 m'); txt(s, 186, 46, '3.6 m', { fill: '#c93a33' }); }
}

/* =====================================================================================
 * Math History: Archimedes' ball in a can
 * ===================================================================================== */
function histAnim() {
  const svg = document.getElementById('u3l11-hist'); if (!svg) return;
  const NS = 'http://www.w3.org/2000/svg', mk = (t, a, p = svg) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); p.appendChild(e); return e; };
  mk('rect', { x: 0, y: 0, width: 600, height: 300, rx: 14, fill: '#fffaf1' });
  const cap = mk('text', { x: 300, y: 36, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 22, fill: '#4a2c14' });
  const R = 46, cx = 112, top = 112, bot = top + 2 * R, ry = 12;
  // the can (back), the ball, the label (front, peels), the rim
  mk('path', { d: `M${cx - R} ${bot} A${R} ${ry} 0 0 0 ${cx + R} ${bot} L${cx + R} ${top} A${R} ${ry} 0 0 1 ${cx - R} ${top} Z`, fill: '#efe3cc', stroke: '#4a2c14', 'stroke-width': 2.5 });
  const ball = mk('g', {});
  mk('circle', { cx, cy: 0, r: R - 1, fill: '#d9a441', stroke: '#4a2c14', 'stroke-width': 2.5 }, ball);
  mk('path', { d: `M${cx - R + 1} 0 A${R - 1} 14 0 0 0 ${cx + R - 1} 0`, fill: 'none', stroke: '#7a4a26', 'stroke-width': 1.5 }, ball);
  mk('circle', { cx: cx - 15, cy: -16, r: 9, fill: '#f3d48a' }, ball);
  const clipId = 'u3l11-hclip';
  const defs = mk('defs', {}), cp = mk('clipPath', { id: clipId }, defs), cr = mk('rect', { x: cx - R - 3, y: top - 20, width: 2 * R + 6, height: 2 * R + 40 }, cp);
  const label = mk('path', { d: `M${cx - R} ${bot} A${R} ${ry} 0 0 0 ${cx + R} ${bot} L${cx + R} ${top} A${R} ${ry} 0 0 1 ${cx - R} ${top} Z`, fill: '#b07a12', stroke: '#4a2c14', 'stroke-width': 2.5, 'clip-path': `url(#${clipId})`, opacity: 0.92 });
  mk('ellipse', { cx, cy: top, rx: R, ry, fill: 'none', stroke: '#4a2c14', 'stroke-width': 2.5 });
  const LX = 220, LW = 2 * PI * R;
  const flat = mk('rect', { x: LX, y: top, width: 0, height: 2 * R, fill: '#b07a12', stroke: '#4a2c14', 'stroke-width': 2.5 });
  const tW = mk('text', { x: LX + LW / 2, y: top - 10, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 17, fill: '#7a4a26' });
  const tH = mk('text', { x: LX + LW + 10, y: top + R + 6, 'font-family': 'Georgia, serif', 'font-size': 17, fill: '#7a4a26' });
  const tBall = mk('text', { x: cx, y: 250, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 19, fill: '#4a2c14' });
  const tLab = mk('text', { x: LX + LW / 2, y: 250, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 19, fill: '#4a2c14' });
  const eq = mk('text', { x: 300, y: 286, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 21, 'font-weight': 700, fill: '#b07a12' });
  const CAPS = [[0, 'A ball that fits snugly in a can'], [3, 'Peel off the can’s label…'], [6.5, '…it has the same area as the ball!']];
  const clamp = (t) => Math.max(0, Math.min(1, t)), ease = (t) => t * t * (3 - 2 * t);
  const draw = (s) => {
    let c = CAPS[0][1]; for (const [t0, txt0] of CAPS) if (s >= t0) c = txt0; cap.textContent = c;
    const fall = ease(clamp(s / 1.6));
    ball.setAttribute('transform', `translate(0 ${lerp(-60, top + R, fall)})`);
    label.style.opacity = s < 1.6 ? 0 : 0.92;
    const pe = ease(clamp((s - 3.2) / 2));
    cr.setAttribute('x', cx - R - 3 + pe * (2 * R + 6)); cr.setAttribute('width', (1 - pe) * (2 * R + 6));
    flat.setAttribute('width', pe * LW);
    tW.textContent = pe > 0.98 ? 'once around: 2πr' : ''; tH.textContent = pe > 0.98 ? '2r' : '';
    tLab.textContent = s >= 6 ? 'label: 2πr × 2r = 4πr²' : '';
    tBall.textContent = s >= 7 ? 'ball: 4πr²' : '';
    eq.textContent = s >= 8 ? 'Same area. Archimedes, about 225 BCE' : '';
  };
  let raf = 0;
  const play = () => {
    cancelAnimationFrame(raf);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { draw(11); return; }
    const t0 = performance.now(); const tick = (now) => { const s = (now - t0) / 1000; draw(s); if (s < 10.5) raf = requestAnimationFrame(tick); }; raf = requestAnimationFrame(tick);
  };
  draw(11);
  svg.addEventListener('click', play);
  const btn = svg.closest('.hist-anim') && svg.closest('.hist-anim').querySelector('.hist-play'); if (btn) btn.addEventListener('click', play);
  let seen = false;
  new IntersectionObserver((es) => { es.forEach((e) => { if (e.isIntersecting && !seen) { seen = true; play(); } }); }, { threshold: 0.5 }).observe(svg);
}
histAnim();

/* =====================================================================================
 * Stand Up Break! — cylinders, pyramids and cones
 * ===================================================================================== */
{
  const CANS = ['soup can', 'paint can', 'tin of cookies', 'coffee tin', 'water tank', 'hockey puck'];
  const TRIPLES = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20]]; // half base (or r), h, s
  const r1 = (v) => nT(rnd(v, 1).toFixed(1));
  standup('u3l11', {
    intro: 'Sketch the net, label every piece, find each area, then add. Halve a diameter first.',
    levels: {
      BEG: (r) => { // a closed cylinder
        const what = r.pick(CANS), u = r.pick(['cm', 'in']), rr = r.int(2, 12), hh = r.int(3, 25);
        const c2 = 2 * PI * rr * rr, sd = 2 * PI * rr * hh;
        return { text: `A <b>${what}</b> is a closed cylinder with a radius of <b>${rr} ${u}</b> and a height of <b>${hh} ${u}</b>. Find its surface area to the nearest tenth.`, q: '',
          a: [`\\text{Circles: }2\\times\\pi\\times${rr}^2=${dots(c2)}`, `\\text{Side: }2\\times\\pi\\times${rr}\\times${hh}=${dots(sd)}`, `\\text{SA}\\approx${r1(c2 + sd)}\\text{ ${u}}^2`] };
      },
      PRG: (r) => r.pick([
        () => { // a square pyramid (the height is given too, as a trap)
          const [a, hh, s] = r.pick(TRIPLES), b = 2 * a;
          return { text: `A square pyramid has a base edge of <b>${b} cm</b>, a height of <b>${hh} cm</b> and a slant height of <b>${s} cm</b>. Find its surface area.`, q: '',
            a: [`\\text{Base: }${b}\\times${b}=${b * b}`, `\\text{4 triangles: }4\\times\\tfrac12\\times${b}\\times${s}=${2 * b * s}`, `\\text{SA}=${b * b + 2 * b * s}\\text{ cm}^2\\ (\\text{not using }h)`] };
        },
        () => { // a closed cone from its diameter
          const [rr, , s] = r.pick(TRIPLES), d = 2 * rr, bs = PI * rr * rr, sd = PI * rr * s;
          return { text: `A closed cone is <b>${d} cm</b> across and has a slant height of <b>${s} cm</b>. Find its surface area to the nearest tenth.`, q: '',
            a: [`r=${d}\\div2=${rr}`, `\\text{Base: }\\pi\\times${rr}^2=${dots(bs)}`, `\\text{Side: }\\pi\\times${rr}\\times${s}=${dots(sd)}`, `\\text{SA}\\approx${r1(bs + sd)}\\text{ cm}^2`] };
        }
      ])(),
      MAS: (r) => r.pick([
        () => { // an open planter, then paint cans
          const d = r.pick([40, 50, 60, 70, 80]), hh = r.pick([35, 45, 55, 60]), rr = d / 2, bt = PI * rr * rr, sd = 2 * PI * rr * hh, sa = bt + sd, m2 = sa / 10000, k = r.pick([5, 6, 8]);
          return { text: `${k} round planters are open at the top. Each is <b>${d} cm</b> across and <b>${hh} cm</b> tall. Paint the outside side and the bottom of all ${k}. How many m² is that, to the nearest hundredth? (1 m² = 10&#8239;000 cm²)`, q: '',
            a: [`r=${rr}`, `\\text{1 planter: }\\pi\\times${rr}^2+2\\pi\\times${rr}\\times${hh}=${dots(sa)}\\text{ cm}^2`, `\\times${k}\\div10\\,000\\approx${nT(rnd(m2 * k, 2).toFixed(2))}\\text{ m}^2`] };
        },
        () => { // a roof: a pyramid with no base, shingle bundles
          const b = r.pick([10, 12, 14, 16]), s = r.pick([7, 8, 9, 10, 11]), A = 2 * b * s, n = Math.ceil(A / 33.3 - 1e-9);
          return { text: `A square shed roof is a pyramid with a base edge of <b>${b} ft</b> and a slant height of <b>${s} ft</b> (no base). One bundle of shingles covers 33.3 ft². How many bundles are needed?`, q: '',
            a: [`4\\times\\tfrac12\\times${b}\\times${s}=${A}\\text{ ft}^2`, `${A}\\div33.3=${dots(A / 33.3)}`, `\\text{round up: }${n}\\text{ bundles}`] };
        },
        () => { // a silo: cylinder walls + cone roof, no floor
          const [rr, , s] = r.pick([[3, 4, 5], [6, 8, 10], [9, 12, 15]]).map((v) => v / 2), hh = r.int(4, 9), w = 2 * PI * rr * hh, rf = PI * rr * s;
          return { text: `A small bin has cylinder walls <b>${nT(2 * rr)} m</b> across and <b>${hh} m</b> tall, and a cone roof with a slant height of <b>${nT(s)} m</b>. The floor is concrete. Find the area of steel to the nearest tenth.`, q: '',
            a: [`\\text{Walls: }2\\pi\\times${nT(rr)}\\times${hh}=${dots(w)}`, `\\text{Roof: }\\pi\\times${nT(rr)}\\times${nT(s)}=${dots(rf)}`, `\\text{Total}\\approx${r1(w + rf)}\\text{ m}^2`] };
        }
      ])()
    }
  });
}
