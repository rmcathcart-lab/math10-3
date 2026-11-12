/* Math 10-3 · Unit 3 · Lesson 10 — Nets and Surface Area of Prisms.
 * A small CSS 3-D engine (FoldNet) folds and unfolds nets: each face is a box nested inside the face it is hinged to,
 * turned about the shared edge. Explainers: the cube-net folding machine (Example 2), a box unfolding into its net
 * with a face table filling in (Examples 3 and 4, and a cereal box), fill or wrap (Full notes), a triangular prism
 * unfolding (Examples 5 and 6), three rectangles make one (Full notes: the shortcut), the open planter box and its
 * cutting plan on one sheet of plywood (Example 7), and a bedroom's four walls unfolding into a strip (Example 8).
 * Static figures for the cards, the Math History animation (Dürer's nets) and the Stand Up Break follow. */
import { h, add, box, tex, svgEl, tween, stamp, stampIn, mountExplainers } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const rnd = (v, d = 2) => Math.round((v + (v >= 0 ? 1e-9 : -1e-9)) * 10 ** d) / 10 ** d;
const lerp = (a, b, t) => a + (b - a) * t;
/** thin space for numbers ≥ 1000: TeX (\,) and HTML (narrow no-break space) */
const nT = (v) => { const s = String(v); const [i, d] = s.split('.'); const ii = i.length > 3 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : i; return d ? ii + '.' + d : ii; };
const nH = (v) => nT(v).replace(/\\,/g, ' ');
const ap = (c, el, ms = 380) => c.anim(el, [{ opacity: 0 }, { opacity: 1 }], ms);
const pfx = (c) => c.split(/\s+/).filter(Boolean).map((t) => 'u3l10-' + t).join(' ');
const lab = (stage, html, x, y, cls = '') => add(stage, h('div', 'u3l10-lab ' + pfx(cls), html), x, y);
/** a label centred on (x, y): a 0 × 0 holder (animations scale and move about the point) with the label inside (holder.lab) */
const labC = (stage, html, x, y, cls = '') => { const w = add(stage, h('div', 'u3l10-cw'), x, y); w.lab = w.appendChild(h('div', 'u3l10-lab ' + pfx(cls), html)); return w; };
const line = (stage, html, x, y, w, cls = '') => hide(add(stage, box(h('div', 'u3l10-ln ' + pfx(cls), `<div>${html}</div>`), w, 46), x, y));
const BR = '#6e4a1c', INK = '#1c2230';
const PAIR = { tb: ['#f6d38b', '#b07a12'], fb: ['#a6d8cc', '#2f8a76'], ee: ['#f4aaa0', '#c24a3c'], tri: ['#bccbf2', '#3f63c4'], gray: ['#e4e1da', '#8a8170'] };
const NS = 'http://www.w3.org/2000/svg';
const sv = (tag, a = {}, p) => { const e = document.createElementNS(NS, tag); for (const k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; };

/* =====================================================================================
 * FoldNet: a net that folds in 3-D
 *   faces: { id: { w, h, parent, side: 'l'|'r'|'t'|'b', fold (deg, default 90), tri (apex x, for a triangle), col: [fill, stroke], extra(svg, W, H) } }
 *   root: the face that lies flat. s: px per unit. origin: [x, y, z] (px, root coords) the point the camera turns about.
 *   cam(t): the CSS rotation for the scene (t = 1 folded, 0 flat).
 * ===================================================================================== */
class FoldNet {
  constructor(host, o) {
    this.o = o; const s = o.s; this.F = {};
    this.wrap = add(host, box(h('div', 'u3l10-3d'), o.W, o.H), o.x, o.y);
    const scene = this.scene = h('div', 'u3l10-scene'); this.wrap.appendChild(scene);
    const kids = {}; Object.keys(o.faces).forEach((id) => { const p = o.faces[id].parent; if (p) (kids[p] = kids[p] || []).push(id); });
    const bb = [Infinity, Infinity, -Infinity, -Infinity];
    const build = (id, parentEl, px, py) => {
      const f = o.faces[id], W = f.w * s, H = f.h * s;
      const el = box(h('div', 'u3l10-face'), W, H);
      let x = 0, y = 0, org = '50% 50%';
      if (f.parent) {
        const P = o.faces[f.parent], PW = P.w * s, PH = P.h * s;
        if (f.side === 'r') { x = PW; org = '0 50%'; } else if (f.side === 'l') { x = -W; org = '100% 50%'; }
        else if (f.side === 'b') { y = PH; org = '50% 0'; } else { y = -H; org = '50% 100%'; }
      }
      el.style.left = x + 'px'; el.style.top = y + 'px'; el.style.transformOrigin = org;
      const svg = sv('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u3l10-skin' }, el);
      const [fill, stroke] = f.col || PAIR.gray;
      const pts = f.tri == null ? [[0, 0], [W, 0], [W, H], [0, H]] : f.side === 'b' ? [[0, 0], [W, 0], [f.tri * s, H]] : [[0, H], [W, H], [f.tri * s, 0]];
      const poly = sv('polygon', { points: pts.map((p) => p.join(',')).join(' '), fill, stroke, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, svg);
      if (f.extra) f.extra(svg, W, H, s);
      const lb = h('div', 'u3l10-flab'); el.appendChild(lb);
      if (f.tri != null) { // centre the label on the triangle's centroid
        const dx = (W + f.tri * s) / 3 - W / 2, dy = (f.side === 'b' ? -1 : 1) * H / 6;
        lb.style[dx > 0 ? 'paddingLeft' : 'paddingRight'] = Math.abs(2 * dx) + 'px'; lb.style[dy > 0 ? 'paddingTop' : 'paddingBottom'] = Math.abs(2 * dy) + 'px';
      }
      parentEl.appendChild(el);
      this.F[id] = { el, f, W, H, poly, lb, svg };
      const ax = px + x, ay = py + y;
      bb[0] = Math.min(bb[0], ax); bb[1] = Math.min(bb[1], ay); bb[2] = Math.max(bb[2], ax + W); bb[3] = Math.max(bb[3], ay + H);
      (kids[id] || []).forEach((k) => build(k, el, ax, ay));
    };
    build(o.root, scene, 0, 0);
    const R = this.F[o.root], org = o.origin || [R.W / 2, R.H / 2, 0];
    scene.style.left = (o.W / 2 - org[0]) + 'px'; scene.style.top = (o.H / 2 - org[1] + (o.dy || 0)) + 'px';
    box(scene, R.W, R.H);
    scene.style.transformOrigin = `${org[0]}px ${org[1]}px ${org[2] || 0}px`;
    this.shift = [org[0] - (bb[0] + bb[2]) / 2, org[1] - (bb[1] + bb[3]) / 2];
    this.bb = bb;
    this.set(o.t0 ?? 1);
  }
  /** t: 1 folded, 0 flat. cam: camera blend (defaults to t) */
  set(t, cam = t) {
    this.t = t;
    Object.values(this.F).forEach(({ el, f }) => {
      if (!f.parent) return;
      const a = t * (f.fold ?? 90);
      el.style.transform = f.side === 'r' ? `rotateY(${-a}deg)` : f.side === 'l' ? `rotateY(${a}deg)` : f.side === 'b' ? `rotateX(${a}deg)` : `rotateX(${-a}deg)`;
    });
    const [sx, sy] = this.shift;
    this.scene.style.transform = `translate(${sx * (1 - cam)}px, ${sy * (1 - cam)}px) ${this.o.cam(cam)}`;
  }
  fold(c, to, ms = 2200) { const t0 = this.t; return tween(c, ms, (u) => this.set(lerp(t0, to, u))); }
  label(id, html) { this.F[id].lb.innerHTML = html; return this.F[id].lb; }
  labels(ids) { return ids.map((id) => this.F[id].lb); }
  paint(id, [fill, stroke]) { this.F[id].poly.setAttribute('fill', fill); this.F[id].poly.setAttribute('stroke', stroke); }
}
const boxFaces = (l, w, hh, top = true) => {
  const f = {
    bottom: { w: l, h: w, col: PAIR.tb },
    back: { w: l, h: hh, parent: 'bottom', side: top ? 'b' : 't', col: PAIR.fb },
    front: { w: l, h: hh, parent: top ? 'top' : 'bottom', side: 'b', col: PAIR.fb },
    endL: { w: hh, h: top ? hh : w, parent: top ? 'front' : 'bottom', side: 'l', col: PAIR.ee },
    endR: { w: hh, h: top ? hh : w, parent: top ? 'front' : 'bottom', side: 'r', col: PAIR.ee }
  };
  if (top) { f.top = { w: l, h: w, parent: 'back', side: 'b', col: PAIR.tb }; f.endL.w = w; f.endR.w = w; }
  return f;
};

/* =====================================================================================
 * 1. The cube-net folding machine (Example 2)
 * ===================================================================================== */
const CN = { a: [[1, 0], [1, 1], [1, 2], [1, 3], [0, 2], [2, 2]], b: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [2, 1]], c: [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [3, 2]], d: [[0, 0], [1, 0], [2, 0], [3, 0], [0, 1], [1, 1]] };
const CN_COL = [['#f6d38b', '#b07a12'], ['#a6d8cc', '#2f8a76'], ['#f4aaa0', '#c24a3c'], ['#bccbf2', '#3f63c4'], ['#d7c4f0', '#7b4fc4'], ['#c8e6a8', '#5a8a2a']];
/** the fold tree of a square pattern (y up) + which cube face each square lands on (rolling a die over the net) */
function cubeNet(sq) {
  const key = (x, y) => x + ',' + y, at = new Map(sq.map((p, i) => [key(...p), i]));
  const nb = (i) => [[1, 0, 'r'], [-1, 0, 'l'], [0, 1, 't'], [0, -1, 'b']].map(([dx, dy, sd]) => [at.get(key(sq[i][0] + dx, sq[i][1] + dy)), sd]).filter(([j]) => j != null);
  let root = 0; sq.forEach((p, i) => { if (nb(i).length > nb(root).length) root = i; });
  const roll = { r: (d) => ({ dn: d.e, up: d.w, e: d.up, w: d.dn, n: d.n, s: d.s }), l: (d) => ({ dn: d.w, up: d.e, w: d.up, e: d.dn, n: d.n, s: d.s }),
    b: (d) => ({ dn: d.s, up: d.n, s: d.up, n: d.dn, e: d.e, w: d.w }), t: (d) => ({ dn: d.n, up: d.s, n: d.up, s: d.dn, e: d.e, w: d.w }) };
  const state = { [root]: { dn: 0, up: 1, n: 2, s: 3, e: 4, w: 5 } }, faces = {}, q = [root];
  faces['q' + root] = { w: 1, h: 1, col: CN_COL[root] };
  while (q.length) { const i = q.shift(); nb(i).forEach(([j, sd]) => { if (state[j]) return; state[j] = roll[sd](state[i]); faces['q' + j] = { w: 1, h: 1, parent: 'q' + i, side: sd, col: CN_COL[j] }; q.push(j); }); }
  const land = sq.map((p, i) => state[i].dn), seen = {}, dup = [];
  land.forEach((f, i) => { if (seen[f] != null) dup.push(seen[f], i); else seen[f] = i; });
  return { faces, root: 'q' + root, distinct: Object.keys(seen).length, dup: [...new Set(dup)] };
}
const CN_TXT = {
  a: 'The column of 4 wraps around, and the two side squares close the ends.',
  b: '5 squares in a row wrap all the way around: the first and the last land on the <b>same</b> face, and one face is left <b>open</b>.',
  c: 'The “staircase” folds up and closes into a cube.',
  d: 'The 2 by 2 block folds onto itself: two squares land on the <b>same</b> face, and one face is left <b>open</b>.'
};
const cubeNets = {
  title: 'The folding machine: is it a net of a cube?',
  height: 400, minW: 900,
  choices: [{ sep: 'Example 2 check:' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }, { v: 'c', label: '(c)' }, { v: 'd', label: '(d)' }],
  ask: (k) => `Example 2(${k}): six squares. Fold every square up along its edges. Does it close into a cube?`,
  make(stage, k, ex) {
    const N = cubeNet(CN[k]), ok = N.distinct === 6 && !N.dup.length;
    const net = new FoldNet(stage, { x: 0, y: 0, W: 540, H: 400, s: k === 'b' ? 84 : 92, faces: N.faces, root: N.root, origin: [k === 'b' ? 42 : 46, k === 'b' ? 42 : 46, k === 'b' ? 42 : 46], t0: 0,
      cam: (t) => `rotateX(${lerp(14, 58, t)}deg) rotateZ(${lerp(0, -32, t)}deg)` });
    CN[k].forEach((p, i) => net.label('q' + i, String(i + 1)));
    const PX = 560, PW = ex.W - PX - 16;
    const l1 = line(stage, `Faces covered: <b>${N.distinct} of 6</b>`, PX, 40, PW, ok ? 'ok' : 'no');
    const l2 = line(stage, ok ? 'No overlaps, no gaps' : `Overlap: squares <b>${N.dup.map((i) => i + 1).join(' and ')}</b>`, PX, 100, PW, ok ? 'ok' : 'no');
    const st = hide(stamp(stage, ok ? 'Yes: a net ✓' : 'No: not a net ✗', { ok, x: PX + PW / 2, y: 210, rotate: -6, size: 'lg' }));
    return [
      { cap: `Square ${N.root.slice(1) * 1 + 1} stays on the table. Fold every other square <b>up</b> along its edge…`,
        run: async (c) => { await Promise.all(net.labels(Object.keys(N.faces)).map((l) => c.anim(l, [{ opacity: 1 }, { opacity: 0 }], 300))); await net.fold(c, 1, 2600); } },
      { cap: `${CN_TXT[k]} ${ok ? '<b>Yes, it is a net of a cube.</b>' : '<b>No, it is not a net.</b>'}`,
        run: async (c) => { if (!ok) N.dup.forEach((i) => net.paint('q' + i, ['#e04a3c', '#8e1f16'])); await c.fadeIn(l1); await c.fadeIn(l2); await stampIn(c, st); } },
      { cap: 'Turn it around to look from every side.', run: (c) => tween(c, 2600, (u) => { net.scene.style.transform = `translate(0px,0px) rotateX(58deg) rotateZ(${-32 + 360 * u}deg)`; }) }
    ];
  }
};

/* =====================================================================================
 * 2. A box unfolds into its net; the face table fills in (Examples 3 and 4)
 * ===================================================================================== */
const BOXES = {
  e3: { l: 40, w: 30, h: 25, u: 'cm', s: 3.3, ask: 'Example 3: a shipping box is <b>40 cm</b> long, <b>30 cm</b> wide and <b>25 cm</b> high. Find its surface area, in cm² and in m².' },
  e4a: { cube: 2.5, u: 'in', s: 40, ask: 'Example 4(a): a wooden toy block is a cube with edges <b>2½ in</b> long. Find its surface area.' },
  e4b: { cube: 15, u: 'in', s: 6.6, ft: true, ask: 'Example 4(b): a storage ottoman is a cube with edges <b>1 ft 3 in</b> long. How much fabric covers all 6 faces, in in² and in ft²?' },
  cer: { l: 20, w: 7, h: 30, u: 'cm', s: 4.6, ask: 'A cereal box is <b>20 cm</b> long, <b>7 cm</b> wide and <b>30 cm</b> high. Find its surface area.' }
};
const NAMES = { bottom: 'bottom', back: 'back', top: 'top', front: 'front', endL: 'end', endR: 'end' };
const unfoldBox = {
  title: 'Unfold the box: the net and the face table',
  height: 420, minW: 920,
  choices: [{ sep: 'Example 3 check:' }, { v: 'e3', label: 'Shipping box' }, { sep: 'Example 4 check:' }, { v: 'e4a', label: '(a) Toy block' }, { v: 'e4b', label: '(b) Ottoman' }, { sep: 'Another:' }, { v: 'cer', label: 'Cereal box' }],
  ask: (k) => BOXES[k].ask,
  make(stage, k, ex) {
    const d = BOXES[k], u = d.u, cube = d.cube != null;
    const l = cube ? d.cube : d.l, w = cube ? d.cube : d.w, hh = cube ? d.cube : d.h, s = d.s;
    const net = new FoldNet(stage, { x: 0, y: 0, W: 480, H: 420, s, faces: boxFaces(l, w, hh), root: 'bottom', origin: [l * s / 2, w * s / 2, hh * s / 2], dy: -10,
      cam: (t) => `rotateX(${lerp(8, 60, t)}deg) rotateZ(${lerp(0, -34, t)}deg)` });
    const ids = ['bottom', 'back', 'top', 'front', 'endL', 'endR'];
    ids.forEach((id) => net.label(id, NAMES[id]));
    const nl = net.labels(ids); hide(...nl);
    const dim = { bottom: [l, w], top: [l, w], back: [l, hh], front: [l, hh], endL: [w, hh], endR: [w, hh] };
    const PX = 500, PW = ex.W - PX - 14, steps = [];
    const unfold = { cap: 'Cut it along some edges and <b>unfold</b> it flat. This flat pattern is the <b>net</b>.', run: async (c) => { await net.fold(c, 0, 2600); for (const e of nl) await c.pop(e, 200); } };
    if (!cube) {
      const A = { tb: l * w, fb: l * hh, ee: w * hh }, SA = 2 * (A.tb + A.fb + A.ee);
      const rows = [['top &amp; bottom', `${l}\\times${w}`, A.tb, 'tb'], ['front &amp; back', `${l}\\times${hh}`, A.fb, 'fb'], ['two ends', `${w}\\times${hh}`, A.ee, 'ee']].map((r) => [...r.slice(0, 3), 'u3l10-r' + r[3]]);
      const tb = add(stage, h('table', 'u3l10-tbl u3l10-xt'), PX, 10); tb.style.width = PW + 'px';
      tb.innerHTML = `<tr><th>Faces</th><th>Size</th><th>One</th><th>Two</th></tr>` + rows.map((r) => `<tr class="${r[3]}"><td>${r[0]}</td><td><span class="v">${T(r[1])}</span></td><td><span class="v">${nH(r[2])}</span></td><td><span class="v">${nH(2 * r[2])}</span></td></tr>`).join('')
        + `<tr><td colspan="3" class="u3l10-sar">Surface area</td><td><span class="v"><b>${nH(SA)}</b></span></td></tr>`;
      const cells = [...tb.querySelectorAll('td span.v')]; hide(...cells);
      const lf = line(stage, `${T(`SA=2(${l})(${w})+2(${l})(${hh})+2(${w})(${hh})`)}`, PX, 262, PW);
      const lt = line(stage, `${T(`=${nT(2 * A.tb)}+${nT(2 * A.fb)}+${nT(2 * A.ee)}=${nT(SA)}`)} ${u}² ✓`, PX, 314, PW, 'big');
      const lm = k === 'e3' ? line(stage, `${T(`${nT(SA)}\\div10\\,000=${rnd(SA / 10000, 4)}`)} m²`, PX, 366, PW, 'ok') : null;
      steps.push({ cap: `A box ${l} ${u} long, ${w} ${u} wide and ${hh} ${u} high. Turn it around: it has <b>6 faces</b>, in 3 matching pairs.`,
        run: (c) => tween(c, 1800, (t) => { net.scene.style.transform = `translate(0px,0px) rotateX(60deg) rotateZ(${-34 + 360 * t}deg)`; }) });
      steps.push(unfold);
      steps.push({ cap: 'Write the size of each face on the net. Matching faces have the same size and colour.',
        run: async (c) => { for (const id of ids) { const [a, b] = dim[id]; const e = net.F[id].lb; await c.anim(e, [{ opacity: 1 }, { opacity: 0 }], 120); e.innerHTML = net.F[id].W < 70 || net.F[id].H < 44 ? `<b>${a} × ${b}</b>` : `${NAMES[id]}<br><b>${a} × ${b}</b>`; if (net.F[id].W < 50) e.style.writingMode = 'vertical-rl'; await c.pop(e, 220); } } });
      rows.forEach((r, i) => steps.push({ cap: `${r[0].replace('&amp;', '&')}: ${T(`${r[1]}=${nT(r[2])}`)} ${u}² each, so ${T(`2\\times${nT(r[2])}=${nT(2 * r[2])}`)} ${u}².`,
        run: async (c) => { for (const e of cells.slice(i * 3, i * 3 + 3)) await c.pop(e, 260); } }));
      steps.push({ cap: `Add the last column: ${T(`${nT(2 * A.tb)}+${nT(2 * A.fb)}+${nT(2 * A.ee)}=${nT(SA)}`)}. The surface area is <b>${nH(SA)} ${u}²</b>.`, run: (c) => c.pop(cells[9]) });
      steps.push({ cap: `Check with the formula ${T('SA=2lw+2lh+2wh')}: the same ${nH(SA)} ${u}² ✓`, run: async (c) => { await c.fadeIn(lf); await c.fadeIn(lt); } });
      if (lm) steps.push({ cap: `In m²: 1 m² = 10 000 cm², so divide. ${T(`${nT(SA)}\\div10\\,000=${rnd(SA / 10000, 4)}`)}: about <b>${rnd(SA / 10000, 4)} m²</b> of cardboard.`, run: (c) => c.fadeIn(lm) });
      return steps;
    }
    // a cube: six equal squares
    const sT = String(d.cube), a1 = d.cube * d.cube, SA = 6 * a1;
    let y = 20; const L = (html, cls) => { const e = line(stage, html, PX, y, PW, cls); y += 58; return e; };
    const l0 = d.ft ? L(`1 ft 3 in ${T('=12+3=15')} in`) : L(`${T('2\\tfrac12')} in ${T('=2.5')} in`);
    const l1 = L(`One face: ${T(`${sT}^2=${sT}\\times${sT}=${nT(a1)}`)} ${u}²`);
    const l2 = L(`${T(`SA=6s^2=6\\times${nT(a1)}=${nT(SA)}`)} ${u}²`, 'big');
    const l3 = d.ft ? L(`${T(`${nT(SA)}\\div144=${SA / 144}`)} → about <b>${rnd(SA / 144, 1)} ft²</b>`, 'ok') : null;
    steps.push({ cap: d.ft ? `First change 1 ft 3 in to inches: ${T('12+3=15')} in. The ottoman is a cube with edges 15 in.` : `Change ${T('2\\tfrac12')} to a decimal: 2.5 in. A cube has <b>6 equal square faces</b>.`,
      run: async (c) => { await c.fadeIn(l0); await tween(c, 1600, (t) => { net.scene.style.transform = `translate(0px,0px) rotateX(60deg) rotateZ(${-34 + 360 * t}deg)`; }); } });
    steps.push(unfold);
    steps.push({ cap: `Every face is a square ${sT} ${u} by ${sT} ${u}: ${T(`${sT}^2=${nT(a1)}`)} ${u}². Use the ${'<kbd>x²</kbd>'} key.`,
      run: async (c) => { for (const id of ids) { const e = net.F[id].lb; await c.anim(e, [{ opacity: 1 }, { opacity: 0 }], 100); e.innerHTML = `<b>${nH(a1)}</b>`; await c.pop(e, 200); } await c.fadeIn(l1); } });
    steps.push({ cap: `Six equal faces: ${T(`SA=6\\times${nT(a1)}=${nT(SA)}`)} ${u}².`, run: (c) => c.pop(l2) });
    if (l3) steps.push({ cap: `1 ft² = 144 in², so divide: ${T(`${nT(SA)}\\div144=${SA / 144}`)}. The ottoman needs <b>${nH(SA)} in²</b>, or about <b>${rnd(SA / 144, 1)} ft²</b>, of fabric.`, run: (c) => c.fadeIn(l3) });
    return steps;
  }
};

/* =====================================================================================
 * 2b. Fill or wrap? (Full notes)
 * ===================================================================================== */
const KX = 0.5, KY = 0.32;
const proj = (ox, oy, s) => (x, y, z) => [ox + (x + z * KX) * s, oy - (y + z * KY) * s];
const P2 = (pts) => pts.map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
function cubeAt(svg, P, x, y, z, cols) {
  const g = sv('g', { stroke: BR, 'stroke-width': 1.8, 'stroke-linejoin': 'round' }, svg);
  sv('polygon', { points: P2([P(x, y, z), P(x + 1, y, z), P(x + 1, y + 1, z), P(x, y + 1, z)]), fill: cols[0] }, g);
  sv('polygon', { points: P2([P(x, y + 1, z), P(x + 1, y + 1, z), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)]), fill: cols[1] }, g);
  sv('polygon', { points: P2([P(x + 1, y, z), P(x + 1, y, z + 1), P(x + 1, y + 1, z + 1), P(x + 1, y + 1, z)]), fill: cols[2] }, g);
  return g;
}
const notVolume = {
  title: 'Fill or wrap?',
  height: 400, minW: 900,
  ask: 'A box is <b>3 cm</b> long, <b>2 cm</b> wide and <b>2 cm</b> high. Someone writes: “SA = 3 × 2 × 2 = 12 cm².” Is that right?',
  make(stage, k, ex) {
    const svg = add(stage, sv('svg', { width: 400, height: 300, viewBox: '0 0 400 300', class: 'u3l10-svg' }), 0, 30);
    const P = proj(70, 250, 62);
    const ghost = sv('g', { fill: 'none', stroke: '#9a8e78', 'stroke-width': 2, 'stroke-dasharray': '6 5' }, svg);
    [[[0, 0, 0], [3, 0, 0], [3, 2, 0], [0, 2, 0]], [[0, 2, 0], [3, 2, 0], [3, 2, 2], [0, 2, 2]], [[3, 0, 0], [3, 0, 2], [3, 2, 2], [3, 2, 0]]].forEach((f) => sv('polygon', { points: P2(f.map((q) => P(...q))) }, ghost));
    const cubes = []; for (let z = 1; z >= 0; z--) for (let y = 0; y < 2; y++) for (let x = 0; x < 3; x++) cubes.push(hide(cubeAt(svg, P, x, y, z, ['#f6d38b', '#fbe9c4', '#dcae55'])));
    labC(stage, '3 cm', 70 + 1.5 * 62, 300, 'dim'); lab(stage, '2 cm', 0, 30 + 250 - 62 - 12, 'dim'); lab(stage, '2 cm', 70 + 3.5 * 62 + 24, 30 + 250 - 62 * 0.5 - 30, 'dim');
    // the net with a grid of 1 cm squares (bottom, back, top, front in a column; ends beside the front)
    const NX = 420, NY = 22, c0 = 25, faces = [['tb', 2, 0, 3, 2], ['fb', 2, 2, 3, 2], ['tb', 2, 4, 3, 2], ['fb', 2, 6, 3, 2], ['ee', 0, 6, 2, 2], ['ee', 5, 6, 2, 2]];
    const nsvg = add(stage, sv('svg', { width: 7 * c0 + 4, height: 8 * c0 + 4, viewBox: `-2 -2 ${7 * c0 + 4} ${8 * c0 + 4}`, class: 'u3l10-svg' }), NX, NY);
    const sqs = faces.map(([p, x, y, w, hh]) => { const g = hide(sv('g', {}, nsvg)); for (let i = 0; i < w; i++) for (let j = 0; j < hh; j++) sv('rect', { x: (x + i) * c0, y: (y + j) * c0, width: c0, height: c0, fill: PAIR[p][0], stroke: PAIR[p][1], 'stroke-width': 1.6 }, g); return g; });
    const cnt = hide(labC(stage, '0 squares', NX + 3.5 * c0, NY + 8 * c0 + 26, 'cnt'));
    const LX = 630, LW = ex.W - LX - 14;
    const l0 = line(stage, `${T('3\\times2\\times2=12')}`, LX, 20, LW, 'no');
    const l1 = line(stage, `12 <b>cubes</b> inside: ${T('12\\text{ cm}^3')}`, LX, 80, LW);
    const l2 = line(stage, `${T('6+6+6+6+4+4=32')}`, LX, 160, LW);
    const l3 = line(stage, `SA ${T('=32\\text{ cm}^2')}`, LX, 220, LW, 'big');
    const st = hide(stamp(stage, 'l × w × h is volume ✗', { ok: false, x: LX + LW / 2, y: 330, rotate: -6, size: 'sm' }));
    return [
      { cap: `${T('3\\times2\\times2=12')}. But what does 12 count?`, run: (c) => c.fadeIn(l0) },
      { cap: 'Fill the box with 1 cm cubes: <b>12 cubes</b>. Multiplying the three lengths counts the cubes <b>inside</b>: that is the <b>volume</b>, 12 cm³.',
        run: async (c) => { for (const q of cubes) await c.pop(q, 160); await c.fadeIn(l1); } },
      { cap: 'Surface area counts the <b>squares on the outside</b>. Unfold the box and count them, face by face.',
        run: async (c) => { await c.fadeIn(cnt); let n = 0; for (let i = 0; i < 6; i++) { n += faces[i][3] * faces[i][4]; await ap(c, sqs[i], 300); cnt.lab.innerHTML = `<b>${n}</b> squares`; } await c.fadeIn(l2); } },
      { cap: `The surface area is <b>32 cm²</b>, not 12. Use the face table or ${T('2lw+2lh+2wh')}, never ${T('l\\times w\\times h')}.`, run: async (c) => { await c.pop(l3); await stampIn(c, st); } }
    ];
  }
};

/* =====================================================================================
 * 3. A triangular prism unfolds (Examples 5 and 6)
 * ===================================================================================== */
const TRIS = {
  e5: { a: 5, b: 12, c: 13, L: 4, t: 5, p: 0, u: 'cm', s: 15.5, names: ['5 × 4', '12 × 4', '13 × 4'],
    ask: 'Example 5: a door wedge. Its ends are right triangles with sides <b>5 cm, 12 cm and 13 cm</b>; the wedge is <b>4 cm</b> wide. Find its surface area.' },
  e6: { a: 2, b: 2.4, c: 2, L: 3, t: 1.6, p: 1.2, u: 'm', s: 54, tent: true, names: ['2 × 3', '2.4 × 3', '2 × 3'],
    ask: 'Example 6: a tent. The front is a triangle <b>2.4 m</b> wide and <b>1.6 m</b> high; the sloping sides are <b>2 m</b>; the tent is <b>3 m</b> long. Nylon (not the floor) costs <b>$8.95 per m²</b>, plus 5% GST.' }
};
const triPrism = {
  title: 'Unfold a triangular prism: 2 triangles + 3 rectangles',
  height: 420, minW: 920,
  choices: [{ sep: 'Example 5 check:' }, { v: 'e5', label: 'Door wedge' }, { sep: 'Example 6 check:' }, { v: 'e6', label: 'Tent' }],
  ask: (k) => TRIS[k].ask,
  make(stage, k, ex) {
    const d = TRIS[k], { a, b, c: cc, L, t, p, s, u } = d;
    const angL = Math.atan2(t, p) * 180 / Math.PI, angR = Math.atan2(t, b - p) * 180 / Math.PI;
    const faces = {
      mid: { w: b, h: L, col: d.tent ? PAIR.gray : PAIR.fb },
      left: { w: a, h: L, parent: 'mid', side: 'l', fold: 180 - angL, col: PAIR.fb },
      right: { w: cc, h: L, parent: 'mid', side: 'r', fold: 180 - angR, col: PAIR.fb },
      triT: { w: b, h: t, parent: 'mid', side: 't', tri: p, col: PAIR.tri },
      triB: { w: b, h: t, parent: 'mid', side: 'b', tri: p, col: PAIR.tri }
    };
    if (d.tent) { faces.left.col = faces.right.col = ['#9fd08a', '#3f7a2a']; faces.triT.col = faces.triB.col = ['#c8e6a8', '#3f7a2a']; }
    const net = new FoldNet(stage, { x: 0, y: 0, W: 500, H: 420, s, faces, root: 'mid', origin: [b * s / 2, L * s / 2, t * s / 2], dy: 0,
      cam: (q) => `rotateX(${lerp(6, 62, q)}deg) rotateZ(${lerp(0, -38, q)}deg)` });
    const ids = ['left', 'mid', 'right', 'triT', 'triB']; hide(...net.labels(ids));
    const tri = rnd(b * t / 2, 4), tri2 = rnd(2 * tri, 4), R = [a * L, b * L, cc * L].map((v) => rnd(v, 4));
    const PX = 520, PW = ex.W - PX - 14, steps = [];
    let y = 10; const Ln = (html, cls) => { const e = line(stage, html, PX, y, PW, cls); y += 54; return e; };
    const spin = { cap: d.tent ? 'Jordan’s tent is a triangular prism lying on its side: <b>5 faces</b>.' : 'The wedge is a triangular prism lying on one rectangle: <b>5 faces</b>, 2 triangles and 3 rectangles.',
      run: (c) => tween(c, 2600, (q) => { net.scene.style.transform = `translate(0px,0px) rotateX(62deg) rotateZ(${-38 + 360 * q}deg)`; }) };
    const unfold = { cap: 'Unfold it: three rectangles in a row, with a triangle on each side of the middle one.', run: (c) => net.fold(c, 0, 2600) };
    const showL = async (c, id, html) => { const e = net.label(id, html); await c.pop(e, 260); };
    if (!d.tent) {
      const l1 = Ln(`Triangles: ${T(`2\\times\\tfrac12\\times${b}\\times${t}=${tri2}`)}`);
      const l2 = Ln(`Rectangles: ${T(`${R.join('+')}=${R[0] + R[1] + R[2]}`)}`);
      const l3 = Ln(`Shortcut: ${T(`(${a}+${b}+${cc})\\times${L}=${(a + b + cc) * L}`)} ✓`, 'ok');
      const l4 = Ln(`${T(`SA=${tri2}+${R[0] + R[1] + R[2]}=${tri2 + R[0] + R[1] + R[2]}`)} cm²`, 'big');
      return [spin, unfold,
        { cap: `Each triangle: ${T(`\\tfrac12bh=\\tfrac12\\times${b}\\times${t}=${tri}`)} cm². Use the <b>height</b> (5 cm, straight up), not the slanted 13 cm side.`,
          run: async (c) => { await showL(c, 'triT', `<b>${tri}</b>`); await showL(c, 'triB', `<b>${tri}</b>`); await c.fadeIn(l1); } },
        { cap: `Each rectangle is one side of the triangle × the 4 cm width: ${T(`5\\times4=${R[0]}`)}, ${T(`12\\times4=${R[1]}`)}, ${T(`13\\times4=${R[2]}`)}.`,
          run: async (c) => { for (const [i, id] of ['left', 'mid', 'right'].entries()) await showL(c, id, `${d.names[i]}<br><b>${R[i]}</b>`); await c.fadeIn(l2); } },
        { cap: `Shortcut: the 3 rectangles together are (perimeter of the triangle) × (width): ${T(`30\\times4=120`)} ✓`, run: (c) => c.fadeIn(l3) },
        { cap: `Add: ${T(`SA=${tri2}+120=${tri2 + 120}`)}. The wedge has a surface area of <b>${tri2 + 120} cm²</b>.`, run: (c) => c.pop(l4) }];
    }
    const sides = 2 * a * L, floor = rnd(b * L, 4), all = rnd(tri2 + sides + floor, 4), nylon = rnd(all - floor, 4), cost = nylon * 8.95, cg = cost * 1.05;
    const l1 = Ln(`Ends: ${T(`2\\times\\tfrac12\\times2.4\\times1.6=${tri2}`)}`);
    const l2 = Ln(`Sloping sides: ${T(`2\\times(2\\times3)=${sides}`)}`);
    const l3 = Ln(`Floor: ${T(`2.4\\times3=${floor}`)}`);
    const l4 = Ln(`${T(`SA=${tri2}+${sides}+${floor}=${all}`)} m²`, 'big');
    const l5 = Ln(`Nylon: ${T(`${all}-${floor}=${nylon}`)} m²`, 'ok');
    const l6 = Ln(`${T(`${nylon}\\times\\$8.95\\times1.05\\approx\\$${cg.toFixed(2)}`)}`, 'ok');
    return [spin, unfold,
      { cap: `The two ends are triangles: ${T(`\\tfrac12\\times2.4\\times1.6=${tri}`)} m² each, ${T(`${tri2}`)} m² for both.`, run: async (c) => { await showL(c, 'triT', `<b>${tri}</b>`); await showL(c, 'triB', `<b>${tri}</b>`); await c.fadeIn(l1); } },
      { cap: `The two sloping sides are rectangles 2 m by 3 m: ${T(`2\\times(2\\times3)=${sides}`)} m².`, run: async (c) => { await showL(c, 'left', '2 × 3<br><b>6</b>'); await showL(c, 'right', '2 × 3<br><b>6</b>'); await c.fadeIn(l2); } },
      { cap: `The floor is 2.4 m by 3 m: ${T(`${floor}`)} m². The whole tent: ${T(`3.84+12+7.2=${all}`)} m².`, run: async (c) => { await showL(c, 'mid', `floor<br><b>${floor}</b>`); await c.fadeIn(l3); await c.pop(l4); } },
      { cap: `The floor is a heavier fabric, so take it away: ${T(`${all}-${floor}=${nylon}`)} m² of nylon.`, run: async (c) => { net.paint('mid', ['#f3f1ec', '#b9b4aa']); await c.anim(net.F.mid.lb, [{ opacity: 1 }, { opacity: 0.35 }], 400); await c.fadeIn(l5); } },
      { cap: `Cost: ${T(`${nylon}\\times\\$8.95=\\$${rnd(cost, 3)}`)}, then GST: ${T(`\\times1.05=\\$${rnd(cg, 3)}\\ldots`)}. The nylon costs <b>$${cg.toFixed(2)}</b>.`, run: (c) => c.fadeIn(l6) }];
  }
};

/* =====================================================================================
 * 3b. The shortcut: three rectangles make one (Full notes)
 * ===================================================================================== */
const shortcut = {
  title: 'Three rectangles make one',
  height: 330, minW: 900,
  choices: [{ sep: 'Example 5:' }, { v: 'e5', label: 'Door wedge' }, { sep: 'Example 6:' }, { v: 'e6', label: 'Tent' }],
  ask: (k) => k === 'e5' ? 'The door wedge: rectangles 5 × 4, 12 × 4 and 13 × 4 (the sides of the triangle × the width).' : 'The tent: rectangles 2 × 3, 2.4 × 3 and 2 × 3 (the sides of the triangle × the length).',
  make(stage, k, ex) {
    const d = TRIS[k], sides = [d.a, d.b, d.c], L = d.L, P = rnd(d.a + d.b + d.c, 4), sc = Math.min((ex.W - 200) / P, 150 / L), gap = 34;
    const x0 = (ex.W - (P * sc + 2 * gap)) / 2, y0 = 40;
    const rs = []; let x = x0;
    sides.forEach((sd, i) => {
      const r = add(stage, box(h('div', 'u3l10-rect', `<span>${sd} × ${L}</span><b class="u3l10-ra">${rnd(sd * L, 4)}</b>`), sd * sc, L * sc), x, y0);
      r.dataset.x = x; rs.push(r); x += sd * sc + gap;
    });
    rs.forEach((r) => hide(r.querySelector('.u3l10-ra')));
    const per = hide(labC(stage, `perimeter: ${T(`${sides.join('+')}=${P}`)}`, x0 + gap + P * sc / 2, y0 + L * sc + 30, 'dim'));
    const len = hide(lab(stage, `${L} ${d.u}`, x0 + gap * 2 + P * sc + 8, y0 + L * sc / 2 - 12, 'dim'));
    const l1 = line(stage, `${T(`${sides.map((sd) => rnd(sd * L, 4)).join('+')}=${rnd(P * L, 4)}`)} &nbsp; and &nbsp; ${T(`${P}\\times${L}=${rnd(P * L, 4)}`)} ✓`, ex.W / 2 - 260, y0 + L * sc + 70, 520, 'ok');
    return [
      { cap: `All three rectangles are ${L} ${d.u} long. Their areas: ${T(`${sides.map((sd) => rnd(sd * L, 4)).join('+')}=${rnd(P * L, 4)}`)}.`,
        run: async (c) => { for (const r of rs) await c.pop(r.querySelector('.u3l10-ra'), 300); } },
      { cap: 'Push them together: one long rectangle. Its width is all three sides of the triangle: the <b>perimeter</b>.',
        run: async (c) => { await Promise.all(rs.map((r, i) => c.anim(r, [{ translate: `${i === 0 ? gap : i === 2 ? -gap : 0}px 0` }], 700))); await c.fadeIn(per); await c.fadeIn(len); } },
      { cap: `So the 3 rectangles = perimeter × length: ${T(`${P}\\times${L}=${rnd(P * L, 4)}`)} ✓ One multiplication instead of three.`, run: (c) => c.fadeIn(l1) }
    ];
  }
};

/* =====================================================================================
 * 4. The open planter box, and its cutting plan on one sheet (Example 7)
 * ===================================================================================== */
const openBox = {
  title: 'An open box: which faces get built?',
  height: 450, minW: 920,
  ask: 'Example 7: Amira’s planter box has <b>no top</b>. It is <b>4 ft</b> long, <b>1½ ft</b> wide and <b>2 ft</b> high. How much plywood? Is one 4 ft by 8 ft sheet enough?',
  make(stage, k, ex) {
    const l = 4, w = 1.5, hh = 2, s = 50;
    const faces = boxFaces(l, w, hh, false);
    faces.bottom.col = ['#e7c48f', '#8a5a22']; ['back', 'front', 'endL', 'endR'].forEach((id) => { faces[id].col = ['#f4dcb5', '#8a5a22']; });
    const net = new FoldNet(stage, { x: 0, y: 0, W: 470, H: 450, s, faces, root: 'bottom', origin: [l * s / 2, w * s / 2, hh * s / 2],
      cam: (t) => `rotateX(${lerp(6, 58, t)}deg) rotateZ(${lerp(0, -30, t)}deg)` });
    const ids = ['bottom', 'back', 'front', 'endL', 'endR']; hide(...net.labels(ids));
    const PX = 490, PW = ex.W - PX - 14;
    const l1 = line(stage, `Bottom: ${T('4\\times1.5=6')} ft²`, PX, 8, PW);
    const l2 = line(stage, `Front and back: ${T('2\\times(4\\times2)=16')} ft²`, PX, 58, PW);
    const l2b = line(stage, `Two ends: ${T('2\\times(1.5\\times2)=6')} ft²`, PX, 108, PW);
    const l3 = line(stage, `Total: ${T('6+16+6=28')} ft² &lt; ${T('4\\times8=32')} ✓`, PX, 158, PW, 'big');
    // the sheet, 8 ft by 4 ft, with the cutting plan
    const sc = 38, SX = PX + (PW - 8 * sc) / 2, SY = 244;
    const sheet = hide(add(stage, box(h('div', 'u3l10-sheet', '<span>one sheet: 4 ft × 8 ft</span>'), 8 * sc, 4 * sc), SX, SY));
    const cuts = [[0, 0, 1.5, 4, 'bottom'], [1.5, 0, 2, 4, 'front'], [3.5, 0, 2, 4, 'back'], [5.5, 0, 2, 1.5, 'end'], [5.5, 1.5, 2, 1.5, 'end']]
      .map(([x, y, w2, h2, n]) => hide(add(stage, box(h('div', 'u3l10-cut', n), w2 * sc, h2 * sc), SX + x * sc, SY + y * sc)));
    const st = hide(stamp(stage, 'One sheet is enough ✓', { ok: true, x: SX + 8 * sc / 2, y: SY + 4 * sc + 26, rotate: -3, size: 'sm' }));
    return [
      { cap: 'No top, so only <b>5 faces</b> get built: the bottom, the front, the back and the two ends.',
        run: (c) => tween(c, 2600, (q) => { net.scene.style.transform = `translate(0px,0px) rotateX(58deg) rotateZ(${-30 + 360 * q}deg)`; }) },
      { cap: 'Unfold it: the bottom in the middle, with a wall on each side.', run: (c) => net.fold(c, 0, 2400) },
      { cap: `Bottom: ${T('4\\times1.5=6')} ft². Front and back: ${T('2\\times(4\\times2)=16')} ft². Ends: ${T('2\\times(1.5\\times2)=6')} ft².`,
        run: async (c) => { const v = { bottom: '4 × 1.5<br><b>6</b>', back: '4 × 2<br><b>8</b>', front: '4 × 2<br><b>8</b>', endL: '<b>3</b>', endR: '<b>3</b>' }; for (const id of ids) { await c.pop(net.label(id, v[id]), 220); } await c.fadeIn(l1); await c.fadeIn(l2); await c.fadeIn(l2b); } },
      { cap: `Total: ${T('6+16+6=28')} ft². One sheet is ${T('4\\times8=32')} ft², and 28 &lt; 32: <b>enough area</b>.`, run: async (c) => { await c.pop(l3); await ap(c, sheet); } },
      { cap: 'Plan the cuts: the three 4 ft pieces side by side, then the two ends. Everything fits, with a little left over (if she plans her cuts carefully).',
        run: async (c) => { for (const e of cuts) await c.pop(e, 280); await stampIn(c, st); } }
    ];
  }
};

/* =====================================================================================
 * 4b. The bedroom's four walls unfold into a strip (Example 8)
 * ===================================================================================== */
const roomPaint = {
  title: 'Paint the walls: unfold the room',
  height: 440, minW: 940,
  ask: 'Example 8: Lucas paints the 4 walls of a room <b>4 m</b> long, <b>3.5 m</b> wide, <b>2.5 m</b> high, but not the door (<b>0.9 m by 2 m</b>) or the window (<b>1.5 m by 1.2 m</b>). 2 coats; one can covers <b>35 m²</b> and costs <b>$54.98</b>.',
  make(stage, k, ex) {
    const s = 33, wall = ['#f1e6cf', '#8a5a22'];
    const door = (svg, W, H, ss) => sv('rect', { x: 1.4 * ss, y: H - 2 * ss, width: 0.9 * ss, height: 2 * ss, fill: '#b9824a', stroke: BR, 'stroke-width': 2, class: 'u3l10-hole' }, svg);
    const win = (svg, W, H, ss) => sv('rect', { x: 1.25 * ss, y: H - 2.1 * ss, width: 1.5 * ss, height: 1.2 * ss, fill: '#cfe3f6', stroke: '#3c6e9a', 'stroke-width': 2, class: 'u3l10-hole' }, svg);
    const faces = {
      w1: { w: 4, h: 2.5, col: wall, extra: door },
      w2: { w: 3.5, h: 2.5, parent: 'w1', side: 'r', col: wall },
      w3: { w: 4, h: 2.5, parent: 'w2', side: 'r', col: wall, extra: win },
      w4: { w: 3.5, h: 2.5, parent: 'w3', side: 'r', col: wall }
    };
    const net = new FoldNet(stage, { x: 0, y: 0, W: 520, H: 290, s, faces, root: 'w1', origin: [2 * s, 1.25 * s, 1.75 * s],
      cam: (t) => `rotateX(${lerp(0, -32, t)}deg) rotateY(${lerp(0, -28, t)}deg)` });
    const ids = ['w1', 'w2', 'w3', 'w4']; hide(...net.labels(ids));
    const holes = [...stage.querySelectorAll('.u3l10-hole')];
    const PX = 540, PW = ex.W - PX - 14;
    let y = 6; const Ln = (html, cls) => { const e = line(stage, html, PX, y, PW, cls); y += 52; return e; };
    const l1 = Ln(`Long walls: ${T('2\\times(4\\times2.5)=20')}`);
    const l2 = Ln(`Short walls: ${T('2\\times(3.5\\times2.5)=17.5')}`);
    const l3 = Ln(`Walls: ${T('20+17.5=37.5')} m²`);
    const l4 = Ln(`${T('37.5-1.8-1.8=33.9')} m²`, 'big');
    const l5 = Ln(`2 coats: ${T('67.8\\div35=1.93\\ldots')} → <b>2 cans</b>`, 'ok');
    const l6 = Ln(`${T('2\\times\\$54.98\\times1.05\\approx\\$115.46')}`, 'ok');
    const cans = [0, 1].map((i) => hide(add(stage, box(h('div', 'u3l10-can', `<div class="u3l10-canf" style="height:${i ? 93 : 100}%"></div><span>35 m²</span>`), 70, 84), 120 + i * 100, 330)));
    const canL = hide(lab(stage, '67.8 m² of paint needed', 320, 360, 'note'));
    return [
      { cap: 'Lucas paints the <b>four walls</b>: not the ceiling or the floor. Look into the room from above.',
        run: (c) => tween(c, 2400, (q) => { net.scene.style.transform = `translate(0px,0px) rotateX(-32deg) rotateY(${-28 - 360 * q}deg)`; }) },
      { cap: 'Unfold the walls into one long strip, like the picture in Example 8.', run: (c) => net.fold(c, 0, 2600) },
      { cap: `The two long walls: ${T('4\\times2.5=10')} m² each, ${T('2\\times10=20')} m².`, run: async (c) => { net.F.w1.lb.style.paddingLeft = net.F.w3.lb.style.paddingLeft = '55%'; await c.pop(net.label('w1', '<b>10</b>'), 240); await c.pop(net.label('w3', '<b>10</b>'), 240); await c.fadeIn(l1); } },
      { cap: `The two short walls: ${T('3.5\\times2.5=8.75')} m² each, ${T('17.5')} m². All four walls: ${T('20+17.5=37.5')} m².`, run: async (c) => { await c.pop(net.label('w2', '<b>8.75</b>'), 240); await c.pop(net.label('w4', '<b>8.75</b>'), 240); await c.fadeIn(l2); await c.fadeIn(l3); } },
      { cap: `Take away the openings: door ${T('0.9\\times2=1.8')}, window ${T('1.5\\times1.2=1.8')}. ${T('37.5-1.8-1.8=33.9')} m².`,
        run: async (c) => { await Promise.all(holes.map((e) => c.anim(e, [{ fill: e.getAttribute('fill') }, { fill: '#ffffff' }], 500))); holes.forEach((e) => { e.setAttribute('stroke', '#c93a33'); e.setAttribute('stroke-dasharray', '6 4'); }); await c.pop(l4); } },
      { cap: `Two coats: ${T('2\\times33.9=67.8')} m². One can covers 35 m²: ${T('67.8\\div35=1.93\\ldots')}. Round <b>up</b>: <b>2 cans</b>.`, run: async (c) => { for (const e of cans) await c.pop(e, 300); await c.fadeIn(canL); await c.fadeIn(l5); } },
      { cap: `Cost: ${T('2\\times\\$54.98=\\$109.96')}; with GST ${T('\\$109.96\\times1.05=\\$115.458')}. The paint costs <b>$115.46</b>.`, run: (c) => c.fadeIn(l6) }
    ];
  }
};

mountExplainers({ cubeNets, unfoldBox, notVolume, triPrism, shortcut, openBox, roomPaint });

/* =====================================================================================
 * Static figures on the cards
 * ===================================================================================== */
function figSVG(id, W, H) { const host = document.getElementById(id); if (!host) return null; const s = sv('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, class: 'u3l10-fsvg' }); host.appendChild(s); return s; }
const txt = (svg, x, y, s, o = {}) => { const t = sv('text', Object.assign({ x, y, 'font-size': 17, 'font-weight': 700, fill: INK, 'text-anchor': 'middle' }, o), svg); t.textContent = s; return t; };
/** an oblique prism: front polygon (x right, y up) pushed back a depth D; visible faces filled, hidden edges dashed */
function prismFig(svg, P, pts, D, o = {}) {
  const n = pts.length, F = pts.map(([x, y]) => P(x, y, 0)), B = pts.map(([x, y]) => P(x, y, D));
  const vis = pts.map((a, i) => { const b = pts[(i + 1) % n]; const nx = b[1] - a[1], ny = -(b[0] - a[0]); return nx * KX + ny * KY > 1e-9; });
  const hid = []; pts.forEach((a, i) => { const j = (i + 1) % n; if (!vis[i]) hid.push([B[i], B[j]]); if (!vis[i] && !vis[(i - 1 + n) % n]) hid.push([F[i], B[i]]); });
  pts.forEach((a, i) => { if (!vis[i]) return; const j = (i + 1) % n; const up = Math.abs(pts[j][1] - a[1]) < 1e-9 || pts[j][0] < a[0]; sv('polygon', { points: P2([F[i], F[j], B[j], B[i]]), fill: up ? (o.top || '#efe2cc') : (o.side || '#e2d2b4'), stroke: BR, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, svg); });
  sv('polygon', { points: P2(F), fill: o.front || '#f7efe1', stroke: BR, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, svg);
  sv('path', { d: hid.map(([a, b]) => `M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${b[0].toFixed(1)} ${b[1].toFixed(1)}`).join(''), stroke: '#8a8170', 'stroke-width': 1.8, 'stroke-dasharray': '5 5', fill: 'none' }, svg);
}
{ // the three prisms
  const a = figSVG('u3l10-fig-cube', 200, 150); if (a) prismFig(a, proj(50, 130, 70), [[0, 0], [1, 0], [1, 1], [0, 1]], 1);
  const b = figSVG('u3l10-fig-rect', 240, 150); if (b) prismFig(b, proj(20, 130, 50), [[0, 0], [3, 0], [3, 1.5], [0, 1.5]], 1.4);
  const c = figSVG('u3l10-fig-tri', 220, 150); if (c) prismFig(c, proj(30, 130, 56), [[0, 0], [1.6, 0], [0.8, 1.6]], 2.2, { front: '#dfe6fa' });
}
/** a flat box net drawn with SVG rects: front/top/back/bottom column (bottom at the top), ends beside the front */
function netFig(svg, x0, y0, l, w, hh, s, labs = {}, o = {}) {
  const R = { bottom: [w, 0, l, w], back: [w, w, l, hh], top: [w, w + hh, l, w], front: [w, 2 * w + hh, l, hh], endL: [0, 2 * w + hh, w, hh], endR: [w + l, 2 * w + hh, w, hh] };
  const col = { bottom: PAIR.tb, top: PAIR.tb, back: PAIR.fb, front: PAIR.fb, endL: PAIR.ee, endR: PAIR.ee };
  Object.entries(R).forEach(([k, [x, y, ww, hh2]]) => {
    sv('rect', { x: x0 + x * s, y: y0 + y * s, width: ww * s, height: hh2 * s, fill: o.plain ? '#f7efe1' : col[k][0], stroke: BR, 'stroke-width': 2 }, svg);
    if (labs[k]) txt(svg, x0 + (x + ww / 2) * s, y0 + (y + hh2 / 2) * s + 6, labs[k], { 'font-size': o.fs || 15 });
  });
}
{ // box → net
  const svg = figSVG('u3l10-fig-net', 470, 250);
  if (svg) {
    const P = proj(8, 160, 30); prismFig(svg, P, [[0, 0], [4, 0], [4, 2.5], [0, 2.5]], 2);
    const lt = (x, y, z, t) => { const [px, py] = P(x, y, z); txt(svg, px, py + 5, t, { 'font-size': 15 }); };
    lt(2, 1.25, 0, 'front'); lt(2.5, 2.5, 1, 'top'); const [ex, ey] = P(4, 1.25, 1); txt(svg, ex, ey + 5, 'end', { 'font-size': 14, transform: `rotate(-90 ${ex} ${ey})` });
    sv('path', { d: 'M178 110 H220 M210 100 L222 110 L210 120', stroke: BR, 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, svg);
    netFig(svg, 236, 4, 4, 2, 2.5, 26, { bottom: 'bottom', back: 'back', top: 'top', front: 'front', endL: 'end', endR: 'end' });
  }
}
{ // Example 2: the four square patterns (y up)
  ['a', 'b', 'c', 'd'].forEach((k) => {
    const sq = CN[k], c = 30, mx = Math.max(...sq.map((p) => p[0])) + 1, my = Math.max(...sq.map((p) => p[1])) + 1;
    const svg = figSVG('u3l10-fig-cn' + k, mx * c + 6, my * c + 6); if (!svg) return;
    sq.forEach(([x, y]) => sv('rect', { x: 3 + x * c, y: 3 + (my - 1 - y) * c, width: c, height: c, fill: '#f7efe1', stroke: BR, 'stroke-width': 2.2 }, svg));
  });
}
{ // Example 3: the box and a blank net
  const b = figSVG('u3l10-fig-ex3box', 250, 160);
  if (b) { const P = proj(20, 128, 4); prismFig(b, P, [[0, 0], [40, 0], [40, 25], [0, 25]], 30); txt(b, 100, 152, '40 cm'); txt(b, 196, 140, '30 cm', { 'text-anchor': 'start' }); txt(b, 4, 82, '25 cm', { 'text-anchor': 'start', transform: 'rotate(-90 14 82)' }); }
  const n = figSVG('u3l10-fig-ex3net', 210, 230); if (n) netFig(n, 4, 4, 40, 30, 25, 2.0, {}, { plain: true });
}
{ // Example 5: the wedge and its net
  const a = figSVG('u3l10-fig-ex5', 300, 150);
  if (a) { const P = proj(40, 120, 16); prismFig(a, P, [[0, 0], [12, 0], [0, 5]], 4, { front: '#dfe6fa' }); txt(a, 136, 144, '12 cm'); txt(a, 18, 84, '5 cm'); txt(a, 132, 60, '13 cm'); txt(a, 250, 112, '4 cm'); }
  const n = figSVG('u3l10-fig-ex5net', 300, 160);
  if (n) {
    const s = 9.4, x0 = 4, y0 = 4 + 5 * s, R = [[0, 5], [5, 12], [17, 13]];
    R.forEach(([x, w]) => sv('rect', { x: x0 + x * s, y: y0, width: w * s, height: 4 * s, fill: '#f7efe1', stroke: BR, 'stroke-width': 2 }, n));
    sv('polygon', { points: P2([[x0 + 5 * s, y0], [x0 + 17 * s, y0], [x0 + 5 * s, y0 - 5 * s]]), fill: '#eef1fb', stroke: BR, 'stroke-width': 2 }, n);
    sv('polygon', { points: P2([[x0 + 5 * s, y0 + 4 * s], [x0 + 17 * s, y0 + 4 * s], [x0 + 5 * s, y0 + 9 * s]]), fill: '#eef1fb', stroke: BR, 'stroke-width': 2 }, n);
  }
}
{ // Section 3: a triangular prism and its net
  const svg = figSVG('u3l10-fig-trinet', 470, 200);
  if (svg) {
    const P = proj(10, 140, 30); prismFig(svg, P, [[0, 0], [4, 0], [2, 2.6]], 3.2, { front: '#dfe6fa' });
    const [bx, by] = P(2, 0, 0); txt(svg, bx, by + 20, 'b', { 'font-style': 'italic' });
    sv('line', { x1: P(2, 0, 0)[0], y1: P(2, 0, 0)[1], x2: P(2, 2.6, 0)[0], y2: P(2, 2.6, 0)[1], stroke: INK, 'stroke-width': 1.6, 'stroke-dasharray': '4 4' }, svg);
    txt(svg, P(2, 1.1, 0)[0] + 10, P(2, 1.1, 0)[1], 'h', { 'font-style': 'italic' }); txt(svg, P(4, 0, 1.6)[0] + 38, P(4, 0, 1.6)[1] + 12, 'length', { 'font-size': 15 });
    sv('path', { d: 'M196 100 H232 M222 90 L234 100 L222 110', stroke: BR, 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, svg);
    const s = 20, x0 = 248, y0 = 52;
    [[0, 3.3], [3.3, 4], [7.3, 3.3]].forEach(([x, w], i) => { sv('rect', { x: x0 + x * s, y: y0, width: w * s, height: 3.2 * s, fill: '#f7efe1', stroke: BR, 'stroke-width': 2 }, svg); txt(svg, x0 + (x + w / 2) * s, y0 + 1.6 * s + 6, 'rect.', { 'font-size': 14 }); });
    sv('polygon', { points: P2([[x0 + 3.3 * s, y0], [x0 + 7.3 * s, y0], [x0 + 5.3 * s, y0 - 2.4 * s]]), fill: '#dfe6fa', stroke: BR, 'stroke-width': 2 }, svg);
    sv('polygon', { points: P2([[x0 + 3.3 * s, y0 + 3.2 * s], [x0 + 7.3 * s, y0 + 3.2 * s], [x0 + 5.3 * s, y0 + 5.6 * s]]), fill: '#dfe6fa', stroke: BR, 'stroke-width': 2 }, svg);
    txt(svg, x0 + 5.3 * s, y0 - 0.5 * s, 'triangle', { 'font-size': 14 }); txt(svg, x0 + 5.3 * s, y0 + 4.2 * s, 'triangle', { 'font-size': 14 });
  }
}
{ // Example 6: the tent
  const svg = figSVG('u3l10-fig-ex6', 300, 170);
  if (svg) {
    const P = proj(30, 130, 44); prismFig(svg, P, [[0, 0], [2.4, 0], [1.2, 1.6]], 3, { front: '#e3f3d8', top: '#bfe0a8', side: '#a8d38c' });
    sv('line', { x1: P(1.2, 0, 0)[0], y1: P(1.2, 0, 0)[1], x2: P(1.2, 1.6, 0)[0], y2: P(1.2, 1.6, 0)[1], stroke: INK, 'stroke-width': 1.6, 'stroke-dasharray': '4 4' }, svg);
    txt(svg, P(1.2, 0, 0)[0], P(1.2, 0, 0)[1] + 20, '2.4 m'); txt(svg, P(1.2, 0.6, 0)[0] + 24, P(1.2, 0.6, 0)[1], '1.6 m', { 'font-size': 14 });
    txt(svg, P(0.6, 0.8, 0)[0] - 28, P(0.6, 0.8, 0)[1], '2 m'); txt(svg, P(2.4, 0, 1.5)[0] + 26, P(2.4, 0, 1.5)[1] + 16, '3 m');
  }
}
{ // Example 7: the open planter box
  const svg = figSVG('u3l10-fig-ex7', 280, 190);
  if (svg) {
    const P = proj(30, 150, 46);
    const q = (pts, a) => sv('polygon', Object.assign({ points: P2(pts.map((p) => P(...p))), stroke: BR, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, a), svg);
    q([[0, 0, 1.5], [4, 0, 1.5], [4, 2, 1.5], [0, 2, 1.5]], { fill: '#e2c9a0' });           // back wall (inside)
    q([[0, 0, 0], [0, 0, 1.5], [0, 2, 1.5], [0, 2, 0]], { fill: '#d6b88a' });              // left end (inside)
    q([[0, 0, 0], [4, 0, 0], [4, 0, 1.5], [0, 0, 1.5]], { fill: '#caa676' });              // floor
    q([[4, 0, 0], [4, 0, 1.5], [4, 2, 1.5], [4, 2, 0]], { fill: '#e7c48f' });              // right end
    q([[0, 0, 0], [4, 0, 0], [4, 2, 0], [0, 2, 0]], { fill: '#f4dcb5' });                  // front
    txt(svg, P(2, 0, 0)[0], P(2, 0, 0)[1] + 22, '4 ft'); txt(svg, P(0, 1, 0)[0] - 22, P(0, 1, 0)[1] + 6, '2 ft'); txt(svg, P(4, 0, 0.75)[0] + 34, P(4, 0, 0.75)[1] + 8, '1½ ft');
    txt(svg, P(2, 2, 0.75)[0], P(2, 2, 0.75)[1] + 6, 'open top', { 'font-size': 14, fill: '#6b6457' });
  }
}
{ // Example 8: the four walls unfolded
  const svg = figSVG('u3l10-fig-ex8', 540, 120);
  if (svg) {
    const s = 32, x0 = 40, y0 = 14;
    [[0, 4], [4, 3.5], [7.5, 4], [11.5, 3.5]].forEach(([x, w]) => { sv('rect', { x: x0 + x * s, y: y0, width: w * s, height: 2.5 * s, fill: '#f1e6cf', stroke: BR, 'stroke-width': 2 }, svg); txt(svg, x0 + (x + w / 2) * s, y0 + 2.5 * s + 20, `${w} m`, { 'font-size': 15 }); });
    sv('rect', { x: x0 + 1.4 * s, y: y0 + 0.5 * s, width: 0.9 * s, height: 2 * s, fill: '#d9b07e', stroke: BR, 'stroke-width': 2 }, svg); txt(svg, x0 + 1.85 * s, y0 + 1.6 * s, 'door', { 'font-size': 14 });
    sv('rect', { x: x0 + 8.75 * s, y: y0 + 0.4 * s, width: 1.5 * s, height: 1.2 * s, fill: '#cfe3f6', stroke: '#3c6e9a', 'stroke-width': 2 }, svg); txt(svg, x0 + 9.5 * s, y0 + 1.1 * s, 'window', { 'font-size': 14 });
    txt(svg, x0 - 22, y0 + 1.25 * s + 5, '2.5 m', { 'font-size': 15, transform: `rotate(-90 ${x0 - 22} ${y0 + 1.25 * s})` });
  }
}

/* ======================================================================================
 * Math History: Dürer's nets (1525) — a cube net drawn on old paper, then a strip of 20 triangles, then the word "net"
 * ====================================================================================== */
function histAnim() {
  const svg = document.getElementById('u3l10-hist'); if (!svg) return;
  const mk = (t, a, p = svg) => sv(t, a, p);
  mk('rect', { x: 0, y: 0, width: 600, height: 300, rx: 14, fill: '#fffaf1' });
  const cap = mk('text', { x: 300, y: 34, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 22, fill: '#4a2c14' });
  // scene 1: a cube net (a cross), drawn line by line
  const s1 = mk('g', {}); const c = 46, X = 300 - 2 * c, Y = 60;
  const cells = [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]];
  const segs = cells.map(([i, j]) => mk('rect', { x: X + i * c, y: Y + j * c, width: c, height: c, fill: '#f3e6cc', stroke: '#4a2c14', 'stroke-width': 2.5, 'stroke-dasharray': 4 * c, 'stroke-dashoffset': 4 * c }, s1));
  const y1525 = mk('text', { x: 520, y: 250, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 40, fill: '#b07a12' }, s1); y1525.textContent = '1525';
  // scene 2: twenty triangles (an icosahedron net)
  const s2 = mk('g', { opacity: 0 }); const a = 44, hT = a * 0.866, X2 = 300 - 2.75 * a, Y2 = 120; const tris = [];
  for (let i = 0; i < 5; i++) {
    const x = X2 + i * a;
    tris.push([[x, Y2], [x + a, Y2], [x + a / 2, Y2 - hT]], [[x, Y2], [x + a, Y2], [x + a / 2, Y2 + hT]], [[x + a / 2, Y2 + hT], [x + a * 1.5, Y2 + hT], [x + a, Y2]], [[x + a / 2, Y2 + hT], [x + a * 1.5, Y2 + hT], [x + a, Y2 + 2 * hT]]);
  }
  const triEls = tris.map((t) => mk('polygon', { points: t.map((p) => p.join(',')).join(' '), fill: '#f3e6cc', stroke: '#4a2c14', 'stroke-width': 2, opacity: 0 }, s2));
  const t20 = mk('text', { x: 300, y: 272, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 18, fill: '#7a4a26' }, s2); t20.textContent = '20 triangles fold into a 20-sided solid';
  // scene 3: the word "net"
  const s3 = mk('g', { opacity: 0 });
  const w = mk('text', { x: 300, y: 160, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 64, 'font-style': 'italic', fill: '#b07a12' }, s3); w.textContent = 'net';
  const w2 = mk('text', { x: 300, y: 208, 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-size': 20, fill: '#4a2c14' }, s3); w2.textContent = '1543: Augustin Hirschvogel gives the patterns a name';
  const CAPS = [[0, 'Dürer draws a cube unfolded flat'], [4.6, 'and much fancier shapes too'], [8.6, 'A name for the patterns']];
  const cl = (t) => Math.max(0, Math.min(1, t));
  const draw = (s) => {
    let ct = CAPS[0][1]; for (const [t0, tx] of CAPS) if (s >= t0) ct = tx; cap.textContent = ct;
    segs.forEach((r, i) => r.setAttribute('stroke-dashoffset', 4 * c * (1 - cl((s - 0.3 - i * 0.5) / 0.6))));
    y1525.setAttribute('opacity', cl((s - 3.4) / 0.5));
    s1.setAttribute('opacity', 1 - cl((s - 4.3) / 0.4));
    s2.setAttribute('opacity', cl((s - 4.5) / 0.4) * (1 - cl((s - 8.3) / 0.4)));
    triEls.forEach((t, i) => t.setAttribute('opacity', cl((s - 4.7 - i * 0.12) / 0.3)));
    s3.setAttribute('opacity', cl((s - 8.6) / 0.6));
  };
  let raf = 0;
  const play = () => {
    cancelAnimationFrame(raf);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { draw(12); return; }
    const t0 = performance.now(); const tick = (now) => { const s = (now - t0) / 1000; draw(s); if (s < 11.5) raf = requestAnimationFrame(tick); }; raf = requestAnimationFrame(tick);
  };
  draw(3.9);
  svg.addEventListener('click', play);
  const btn = svg.closest('.hist-anim') && svg.closest('.hist-anim').querySelector('.hist-play'); if (btn) btn.addEventListener('click', play);
  let seen = false;
  new IntersectionObserver((es) => { es.forEach((e) => { if (e.isIntersecting && !seen) { seen = true; play(); } }); }, { threshold: 0.5 }).observe(svg);
}
histAnim();

/* ============ Stand Up Break! — surface area at the whiteboards ============ */
{
  const THINGS = ['shoe box', 'tissue box', 'storage bin', 'toolbox', 'jewellery box', 'moving box', 'gift box', 'cooler'];
  const r2 = (v) => rnd(v, 2);
  standup('u3l10', {
    intro: 'Sketch the object and its net. Use a face table, show every step, and give square units.',
    levels: {
      BEG: (r) => { // a box with a face table
        const what = r.pick(THINGS), u = r.pick(['cm', 'in']), l = r.int(8, 40), w = r.int(4, 25), hh = r.int(3, 30);
        const A = [l * w, l * hh, w * hh], SA = 2 * (A[0] + A[1] + A[2]);
        return { text: `A <b>${what}</b> is <b>${l} ${u}</b> long, <b>${w} ${u}</b> wide and <b>${hh} ${u}</b> high. Find its surface area.`, q: '',
          a: [`\\text{top \\& bottom: }2\\times${l}\\times${w}=${nT(2 * A[0])}`, `\\text{front \\& back: }2\\times${l}\\times${hh}=${nT(2 * A[1])}`, `\\text{ends: }2\\times${w}\\times${hh}=${nT(2 * A[2])}`, `SA=${nT(SA)}\\text{ ${u}}^2`] };
      },
      PRG: (r) => r.pick([
        () => { // a cube with a decimal or fractional edge
          const e = r.pick([[1.5, '1\\tfrac12', 'in'], [2.25, '2\\tfrac14', 'in'], [4.5, '4\\tfrac12', 'in'], [5.5, '5\\tfrac12', 'in'], [6.75, '6\\tfrac34', 'in'], [7, '7', 'cm'], [8, '8', 'cm'], [1.2, '1.2', 'm'], [0.8, '0.8', 'm']]), u = e[2];
          const a1 = rnd(e[0] * e[0], 4), SA = rnd(6 * a1, 4);
          return { text: `A cube has edges <b>${T(e[1])} ${u}</b> long. Find its surface area.`, q: '',
            a: [e[1].includes('frac') ? `${e[1]}=${e[0]}\\text{ ${u}}` : `s=${e[0]}\\text{ ${u}}`, `SA=6s^2=6\\times${e[0]}^2=6\\times${a1}`, `SA=${nT(SA)}\\text{ ${u}}^2`] };
        },
        () => { // a triangular prism with a right-triangle end
          const [a, b, c] = r.pick([[3, 4, 5], [6, 8, 10], [9, 12, 15], [8, 15, 17], [5, 12, 13]]), L = r.int(5, 30), u = 'cm';
          const tri = a * b / 2, rect = (a + b + c) * L;
          return { text: `A triangular prism has ends that are right triangles with sides <b>${a} ${u}, ${b} ${u} and ${c} ${u}</b>. It is <b>${L} ${u}</b> long. Find its surface area.`, q: '',
            a: [`\\text{triangles: }2\\times\\tfrac12\\times${a}\\times${b}=${2 * tri}`, `\\text{rectangles: }(${a}+${b}+${c})\\times${L}=${nT(rect)}`, `SA=${2 * tri}+${nT(rect)}=${nT(2 * tri + rect)}\\text{ ${u}}^2`] };
        }
      ])(),
      MAS: (r) => { // paint a room
        const l = r.pick([3, 3.5, 4, 4.5, 5]), w = r.pick([2.5, 3, 3.5, 4]), hh = r.pick([2.4, 2.5, 2.7]), wl = r.pick([1.2, 1.5, 1.8]), wh = r.pick([1, 1.2, 1.4]);
        const walls = rnd(2 * l * hh + 2 * w * hh, 4), door = 1.8, win = rnd(wl * wh, 4), P = rnd(walls - door - win, 4), two = rnd(2 * P, 4), cover = r.pick([30, 35, 40]), cans = Math.ceil(two / cover - 1e-9), price = r.pick([44.98, 49.98, 54.98]);
        return { text: `Paint the 4 walls of a room <b>${l} m</b> by <b>${w} m</b>, <b>${hh} m</b> high. Leave out a door (<b>0.9 m by 2 m</b>) and a window (<b>${wl} m by ${wh} m</b>). Two coats. One can covers <b>${cover} m²</b> and costs <b>$${price.toFixed(2)}</b>. How many cans, and what is the cost with 5% GST?`, q: '',
          a: [`\\text{walls: }2(${l})(${hh})+2(${w})(${hh})=${walls}`, `${walls}-1.8-${win}=${P}\\text{ m}^2`, `2\\times${P}=${two};\\ ${two}\\div${cover}=${rnd(two / cover, 2)}\\to${cans}\\text{ cans}`, `${cans}\\times\\$${price.toFixed(2)}\\times1.05\\approx\\$${(cans * price * 1.05).toFixed(2)}`] };
      }
    }
  });
}
