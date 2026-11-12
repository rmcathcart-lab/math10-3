/* Math 10-3 · Unit 5 · Lesson 3 — Measuring, Drawing and Classifying Angles.
 * Explainers (Class view unless marked Full): an angle is a turn (naming, arm length), sorting angles by size with a
 * sweeping arm and a type meter (Example 2 check), the protractor routine on angles in any orientation (Example 4 and
 * Example 5 checks), why every mark has two numbers (Full), drawing an angle in 4 steps (Example 6 check), reflex =
 * 360° − the smaller angle (Example 7), tearing the corners off a triangle, a polygon splitting into triangles from one
 * corner (Example 8 check), why n − 2 with a point inside (Full), and finding a missing angle with a sum bar
 * (Examples 9 and 10). Also the hands-on protractor (geo.js), the static figures and the Stand Up Break. */
import { h, add, tex, svgEl, tween, anim, drawIn, stamp, stampIn, pulse, mountExplainers } from '../blocks.js';
import { Geo } from '../geo.js';
import { standup } from '../standup.js';

const A = Geo.at, n360 = Geo.n360, arcD = Geo.arcD, wedgeD = Geo.wedgeD;
const INK = '#1c2230', BLUE = '#1f5bd6', GREEN = '#12805a', RED = '#c93a33', AMBER = '#c27a0e', PURPLE = '#7b4fc4', BROWN = '#9a6a24', GREY = '#9aa0ab';
const T = (s) => tex(String(s));
const RAD = Math.PI / 180;
/** a number for TeX with a thin thousands space: 1440 → 1\,440 */
const tn = (v) => (Math.abs(v) >= 1000 ? String(v).replace(/(\d)(\d{3})$/, '$1\\,$2') : String(v));
/** plain text with a narrow no-break thousands space */
const pn = (v) => (Math.abs(v) >= 1000 ? String(v).replace(/(\d)(\d{3})$/, '$1 $2') : String(v));
const hide = (...els) => { els.forEach((e) => { if (e) e.style.opacity = 0; }); return els[0]; };
const op = (c, el, to, ms = 350) => anim(c, el, [{ opacity: to }], ms);
const stageSvg = (stage, W, H) => add(stage, svgEl('svg', { class: 'u5l3-svg', width: W, height: H, viewBox: `0 0 ${W} ${H}` }), 0, 0);
/** an HTML label centred on (x, y): a 0×0 holder (so c.pop's scale doesn't undo the centring) */
function lab(host, html, x, y, cls = '') {
  const hold = h('div', 'u5l3-hold'); hold.appendChild(h('div', 'u5l3-lab ' + cls, html)); add(host, hold, x, y); hold.inner = hold.firstChild; return hold;
}
function line(parent, P, Q, o = {}) {
  return svgEl('line', { x1: P[0].toFixed(2), y1: P[1].toFixed(2), x2: Q[0].toFixed(2), y2: Q[1].toFixed(2), stroke: o.color || INK, 'stroke-width': o.width || 3.2, 'stroke-linecap': o.cap || 'round', 'stroke-dasharray': o.dash || null, class: o.cls === undefined ? 'bk-stroke' : o.cls, opacity: o.opacity ?? null }, parent);
}
function path(parent, d, o = {}) {
  return svgEl('path', { d, fill: o.fill || 'none', 'fill-opacity': o.fo ?? null, stroke: o.stroke === undefined ? INK : o.stroke, 'stroke-width': o.width || 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-dasharray': o.dash || null, class: o.cls === undefined ? 'bk-stroke' : o.cls, opacity: o.opacity ?? null }, parent);
}
const polyD = (pts, closed = true) => 'M' + pts.map((p) => p[0].toFixed(2) + ' ' + p[1].toFixed(2)).join('L') + (closed ? 'Z' : '');
const txt = (parent, x, y, s, o = {}) => Geo.text(parent, x, y, s, Object.assign({ size: 22 }, o));
const dot = (parent, p, o = {}) => Geo.dot(parent, p, o);
/** a small right-angle square at V between directions d (start) and d + 90 */
function square(parent, V, d, s = 18, o = {}) {
  const u = A([0, 0], d, 1), v = A([0, 0], d + 90, 1);
  return path(parent, polyD([[V[0] + u[0] * s, V[1] + u[1] * s], [V[0] + (u[0] + v[0]) * s, V[1] + (u[1] + v[1]) * s], [V[0] + v[0] * s, V[1] + v[1] * s]], false), { width: o.width || 2.4, stroke: o.color || INK });
}
const typeOf = (v) => (v < 90 - 1e-9 ? 'acute' : Math.abs(v - 90) < 1e-9 ? 'right' : v < 180 - 1e-9 ? 'obtuse' : Math.abs(v - 180) < 1e-9 ? 'straight' : 'reflex');
const TYPE_COL = { acute: BLUE, right: BROWN, obtuse: GREEN, straight: AMBER, reflex: RED };
const fdeg = (v) => String(Math.round(v * 10) / 10);
/** where to put a vertex so the arms (and a protractor at pose rot, radius R) sit in the middle of a W × H box */
function fitV(dirs, W, H, o = {}) {
  const pts = [[0, 0]], L = o.len || 150;
  dirs.forEach((d) => { pts.push(A([0, 0], d, L)); if (o.names) pts.push(A([0, 0], d, L + 30)); });
  if (o.R) {
    for (let a = 0; a <= 180; a += 5) pts.push(A([0, 0], o.rot + a, o.R));
    [o.rot, o.rot + 180].forEach((d) => pts.push(A(A([0, 0], d, o.R), o.rot - 90, o.R * 0.08 + 4)));
  }
  if (o.extra) pts.push(...o.extra);
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  return [Math.round(W / 2 - (Math.min(...xs) + Math.max(...xs)) / 2), Math.round(H / 2 - (Math.min(...ys) + Math.max(...ys)) / 2)];
}
/** the pose that puts a protractor on angle (a1, a2) with its base line on arm a1 → { rot, zero: 'inner'|'outer', value } */
function poseFor(a1, a2) {
  const rel = n360(a2 - a1);
  return rel <= 180 ? { rot: n360(a1), zero: 'inner', value: rel } : { rot: n360(a1 - 180), zero: 'outer', value: 360 - rel };
}
/** a protractor that is only a picture: no dragging, no handles, Pencil ink passes over it */
function staticProt(P) {
  P.g.style.pointerEvents = 'none'; P.g.classList.remove('geo-drag'); P.g.removeAttribute('data-tap');
  P.g.querySelectorAll('[data-tap]').forEach((e) => e.removeAttribute('data-tap'));
  P.g.querySelectorAll('.geo-knob').forEach((k) => { k.style.display = 'none'; k.classList.remove('geo-drag'); });
  return P;
}
const figSvg = (host, W, H) => { host.style.width = W + 'px'; host.style.height = H + 'px'; return svgEl('svg', { class: 'geo-svg u5l3-svg', width: W, height: H, viewBox: `0 0 ${W} ${H}` }, host); };

/* ======================================================================================
 * 1. An angle is a turn
 * ====================================================================================== */
const TURN_NAME = { 90: 'quarter', 180: 'half', 360: 'full' };
const turn = {
  title: 'An angle is a turn',
  height: 400,
  choices: [{ v: 'abc', label: T('\\angle ABC') }, { v: 90, label: 'quarter turn' }, { v: 180, label: 'half turn' }, { v: 360, label: 'full turn' }],
  ask: (v) => (v === 'abc' ? `Make ${T('\\angle ABC=50^\\circ')}, then name it.` : `Turn one arm a <b>${TURN_NAME[v]} turn</b>. How many degrees is that?`),
  make(stage, v, ex) {
    const W = ex.W, H = 400, svg = stageSvg(stage, W, H), tgt = v === 'abc' ? 50 : v;
    const cfg = { abc: [[W / 2 - 330, 340], 300], 90: [[W / 2 - 290, 350], 270], 180: [[W / 2 - 140, 300], 230], 360: [[W / 2 - 150, 205], 165] }[v];
    const V = cfg[0], L0 = cfg[1], px = W / 2 + 250, r = v === 'abc' ? 56 : 44;
    let len = L0, t = 0;
    const arc = path(svg, '', { stroke: v === 360 ? RED : BLUE, width: 3.2, cls: '' });
    const arm1 = line(svg, V, A(V, 0, len), { width: 4 });
    const arm2 = hide(line(svg, V, A(V, 0, len), { width: 4, color: v === 'abc' ? INK : BLUE, cls: '' }));
    dot(svg, V, { r: 5.5 });
    const lB = hide(txt(svg, ...A(V, 235, 30), v === 'abc' ? 'B' : '', { size: 26 }));
    const lA = hide(txt(svg, ...A(V, 0, len + 24), 'A', { size: 26 }));
    const lC = hide(txt(svg, 0, 0, 'C', { size: 26 }));
    const tagV = hide(txt(svg, ...A(V, v === 'abc' ? 192 : 205, v === 'abc' ? 66 : 60), 'vertex', { size: 19, color: '#6a7182' }));
    const one = hide(txt(svg, ...A(V, 25, r + 22), '1', { size: 24, color: BLUE }));
    const cnt = lab(stage, '0°', px, 80, 'u5l3-big');
    const sq = hide(square(svg, V, 0, 22, { color: BLUE }));
    function set(tt, L) {
      t = tt; if (L != null) len = L;
      const E = A(V, t, len);
      ['x2', 'y2'].forEach((k, i) => arm2.setAttribute(k, E[i].toFixed(2)));
      const E1 = A(V, 0, len); arm1.setAttribute('x2', E1[0].toFixed(2)); arm1.setAttribute('y2', E1[1].toFixed(2));
      arc.setAttribute('d', t > 0.4 ? arcD(V, r, 0, t) : '');
      const C = A(V, t, len + 24); lC.setAttribute('x', C[0].toFixed(1)); lC.setAttribute('y', C[1].toFixed(1));
      const Ap = A(V, 0, len + 24); lA.setAttribute('x', Ap[0].toFixed(1));
      cnt.inner.textContent = Math.round(t) + '°';
    }
    set(0);
    const first = { cap: v === 'abc' ? 'Two <b>arms</b> start at one point, the <b>vertex</b> <i>B</i>. At first they lie on top of each other.' : 'Two arms start at one point, the <b>vertex</b>. At first they lie on top of each other.',
      run: async (c) => { if (v === 'abc') { await c.pop(lB); await c.pop(lA); } await c.pop(tagV); } };
    const turnStep = (cap, ms) => ({ cap, run: async (c) => { arm2.style.opacity = 1; await tween(c, ms, (u) => set(tgt * u)); if (v === 'abc') await c.pop(lC); } });
    if (v === 'abc') {
      const n1 = hide(lab(stage, `${T('\\angle A{\\color{#c93a33}B}C')} &nbsp;or&nbsp; ${T('\\angle C{\\color{#c93a33}B}A')}`, px, 190, 'u5l3-name'));
      const n2 = hide(lab(stage, `${T('\\angle B')} &nbsp;or&nbsp; ${T('\\angle 1')}`, px, 262, 'u5l3-name'));
      const st = hide(stamp(stage, 'still 50°', { ok: true, x: px, y: 336, size: 'sm' }));
      return [
        first,
        turnStep('Turn one arm. The <b>size</b> of the angle is the amount of <b>turn</b>, counted in <b>degrees</b>.', 1700),
        { cap: `Name it with three letters, the <b>vertex in the middle</b>: ${T('\\angle ABC')} or ${T('\\angle CBA')}.`, run: async (c) => { await c.pop(n1); await pulse(c, lB, 1.4, 600); } },
        { cap: `Or the vertex alone, ${T('\\angle B')} (only one angle is at ${T('B')}), or a number inside: ${T('\\angle 1')}.`, run: async (c) => { await c.pop(one); await c.pop(n2); } },
        { cap: 'Long arms or short arms: the turn is the <b>same</b>. The angle is still 50°.', run: async (c) => {
          await tween(c, 900, (u) => set(50, L0 + (110 - L0) * u)); await tween(c, 1100, (u) => set(50, 110 + (L0 + 60 - 110) * u)); await tween(c, 700, (u) => set(50, L0 + 60 - 60 * u)); await stampIn(c, st); } }
      ];
    }
    const tag = hide(lab(stage, v === 90 ? 'a <b>right angle</b>' : v === 180 ? 'a <b>straight angle</b>' : 'one <b>full turn</b>', px, 200, 'u5l3-tag'));
    return [
      first,
      turnStep(`Turn one arm a <b>${TURN_NAME[v]} turn</b>. Count the degrees.`, v === 360 ? 2600 : 1600),
      { cap: v === 90 ? 'A quarter turn is <b>90°</b>: a square corner, a <b>right angle</b>. A small square marks it.'
          : v === 180 ? 'A half turn is <b>180°</b>: the two arms make a straight line, a <b>straight angle</b>.'
            : 'A full turn is <b>360°</b>: the arm is back where it started.',
        run: async (c) => { if (v === 90) { await op(c, arc, 0, 250); sq.style.opacity = 1; await c.pop(sq); } await c.pop(tag); } }
    ];
  }
};

/* ======================================================================================
 * 2. Types of angles: a sweeping arm and a type meter (Example 2 check)
 * ====================================================================================== */
const SWEEP = [
  [40, '<b>Acute</b>: less than 90°. A sharp corner.'],
  [90, '<b>Right</b>: exactly 90°. A square corner, marked with a small square.'],
  [130, '<b>Obtuse</b>: between 90° and 180°. Wider than a square corner.'],
  [180, '<b>Straight</b>: exactly 180°. The arms make a straight line.'],
  [300, '<b>Reflex</b>: between 180° and 360°. More than a half turn: the arc goes the long way around.']
];
const EX2 = [[47, 'less than 90°, so it is'], [90, 'exactly 90°, so it is'], [163, 'between 90° and 180°, so it is'], [181, 'just over 180°, so it is'], [300, 'between 180° and 360°, so it is'], [89.5, 'just under 90°, so it is still'], [180, 'exactly 180°, so it is'], [112, 'between 90° and 180°, so it is']];
const types = {
  title: 'Sort angles by size',
  height: 410,
  choices: [{ v: 'sweep', label: 'sweep 0° to 360°' }, { sep: 'Example 2 check:' }, { v: 'ex2', label: 'all 8 angles' }],
  ask: (v) => (v === 'sweep' ? 'Open an angle all the way around. What is each type called?' : 'Example 2: write the type of each angle: 47°, 90°, 163°, 181°, 300°, 89.5°, 180°, 112°.'),
  make(stage, v, ex) {
    const W = ex.W, H = 410, ox = (W - 960) / 2, svg = stageSvg(stage, W, H);
    const V = [ox + 215, 210], len = 165;
    const mx0 = ox + 470, mx1 = ox + 930, my = 270, X = (d) => mx0 + (mx1 - mx0) * d / 360;
    // the type meter
    [[0, 90, BLUE], [90, 180, GREEN], [180, 360, RED]].forEach(([a, b, cl]) => svgEl('rect', { x: X(a), y: my, width: X(b) - X(a), height: 26, fill: cl, 'fill-opacity': 0.22, stroke: cl, 'stroke-width': 1.5 }, svg));
    [[90, BROWN], [180, AMBER]].forEach(([d, cl]) => svgEl('rect', { x: X(d) - 3, y: my - 8, width: 6, height: 42, fill: cl }, svg));
    [0, 90, 180, 270, 360].forEach((d) => txt(svg, X(d), my + 46, String(d), { size: 17, color: '#4b5263' }));
    [['acute', 45, BLUE], ['obtuse', 135, GREEN], ['reflex', 270, RED]].forEach(([s, d, cl]) => txt(svg, X(d), my + 74, s, { size: 18, color: cl }));
    txt(svg, X(90), my - 22, 'right', { size: 16, color: BROWN }); txt(svg, X(180), my - 22, 'straight', { size: 16, color: AMBER });
    const ptr = svgEl('g', {}, svg); ptr.style.transformBox = 'view-box'; ptr.style.transformOrigin = '0 0';
    path(ptr, 'M-11 -16 L11 -16 L0 0 Z', { fill: INK, stroke: INK, width: 2, cls: '' });
    svgEl('line', { x1: 0, x2: 0, y1: 0, y2: 26, stroke: INK, 'stroke-width': 2.5 }, ptr);
    const pv = txt(svg, 0, my - 52, '0°', { size: 24 });
    // the angle
    const arc = path(svg, '', { width: 3.2, cls: '' }), sq = path(svg, '', { width: 2.6, cls: '' });
    line(svg, V, A(V, 0, len), { width: 4 });
    const arm = line(svg, V, A(V, 0, len), { width: 4, color: INK, cls: '' });
    dot(svg, V, { r: 5.5 });
    const tag = lab(stage, '', ox + 700, 70, 'u5l3-tag');
    let cur = 0;
    function set(d) {
      cur = d; const ty = typeOf(d), cl = TYPE_COL[ty], E = A(V, d, len);
      arm.setAttribute('x2', E[0].toFixed(2)); arm.setAttribute('y2', E[1].toFixed(2)); arm.setAttribute('stroke', cl);
      const right = ty === 'right';
      arc.setAttribute('d', d > 0.4 && !right ? arcD(V, d > 180 ? 34 : 48, 0, d) : ''); arc.setAttribute('stroke', cl);
      sq.setAttribute('d', right ? `M${V[0] + 24} ${V[1]}L${V[0] + 24} ${V[1] - 24}L${V[0]} ${V[1] - 24}` : ''); sq.setAttribute('stroke', cl);
      ptr.setAttribute('transform', `translate(${X(d).toFixed(2)} ${my})`);
      pv.setAttribute('x', X(d).toFixed(2)); pv.textContent = fdeg(d) + '°';
    }
    const showTag = async (c, d) => { const ty = typeOf(d); tag.inner.innerHTML = `${fdeg(d)}° is <b>${ty}</b>`; tag.inner.style.borderColor = TYPE_COL[ty]; tag.inner.style.color = TYPE_COL[ty]; tag.style.opacity = 1; await c.pop(tag); };
    set(0); hide(tag);
    const go = (d) => async (c) => { const d0 = cur; hide(tag); await tween(c, 300 + Math.abs(d - d0) * 6, (u) => set(d0 + (d - d0) * u)); await showTag(c, d); };
    if (v === 'sweep') return SWEEP.map(([d, cap]) => ({ cap, run: go(d) }));
    return EX2.map(([d, why]) => ({ cap: `<b>${fdeg(d)}°</b> is ${why} <b>${typeOf(d)}</b>.`, run: go(d) }));
  }
};

/* ======================================================================================
 * 3. The protractor routine (Example 4 and Example 5 checks)
 * ====================================================================================== */
const MEAS = {
  demo: { a1: 20, a2: 135, names: ['A', 'B', 'C'], label: '\\angle ABC' },
  a: { a1: 0, a2: 62, rot: 0 }, b: { a1: 180, a2: 35, rot: 0 }, c: { a1: 40, a2: 148, rot: 40 }, d: { a1: 290, a2: 255, rot: 110 },
  DEF: { a1: 105, a2: 143, names: ['D', 'E', 'F'], label: '\\angle DEF' }, GHI: { a1: -20, a2: 107, names: ['G', 'H', 'I'], label: '\\angle GHI' }, JKL: { a1: 250, a2: 324, names: ['J', 'K', 'L'], label: '\\angle JKL' }
};
const measure = {
  title: 'Measure with a protractor: 3 steps',
  height: 460, tap: false,
  choices: [{ v: 'demo', label: T('\\angle ABC') }, { sep: 'Example 4 check:' }, ...['a', 'b', 'c', 'd'].map((k) => ({ v: k, label: `(${k})` })),
    { sep: 'Example 5 check:' }, ...['DEF', 'GHI', 'JKL'].map((k) => ({ v: k, label: T(MEAS[k].label) }))],
  ask: (k) => (MEAS[k].rot != null ? `Example 4(${k}): read the protractor. Give the size of the angle and its type.` : k === 'demo' ? `Measure ${T('\\angle ABC')}.` : `Example 5: measure ${T(MEAS[k].label)}.`),
  make(stage, k, ex) {
    const W = ex.W, H = 460, R = 168, L = 196, m = MEAS[k], placed = m.rot != null;
    const p = poseFor(m.a1, m.a2), v = p.value, wrong = 180 - v, ty = typeOf(v);
    const V = fitV([m.a1, m.a2], W, H, { len: L, R, rot: p.rot, names: m.names });
    const start = placed ? { cx: V[0], cy: V[1], rot: p.rot } : { cx: V[0] < W / 2 ? W - 190 : 190, cy: H - 36, rot: 0 };
    const P = Geo.protractor(stage, { x: 0, y: 0, width: W, height: H, r: R, cx: start.cx, cy: start.cy, rot: start.rot, angle: { vertex: V, a1: m.a1, a2: m.a2, len: L, names: m.names }, buttons: false, readout: false, snap: false });
    staticProt(P);
    const ov = svgEl('g', {}, P.svg), zc = p.zero === 'inner' ? GREEN : BLUE;
    const hl = hide(line(ov, V, A(V, m.a1, L), { color: zc, width: 13, cls: '' })); hl.style.opacity = 0;
    const z0 = p.zero === 'inner' ? A(V, p.rot, R * 0.748) : A(V, p.rot + 180, R * 0.845);
    const ring = hide(svgEl('circle', { cx: z0[0].toFixed(1), cy: z0[1].toFixed(1), r: 17, fill: 'none', stroke: zc, 'stroke-width': 3.5 }, ov));
    ring.style.transformBox = 'fill-box'; ring.style.transformOrigin = 'center';
    const name = m.label ? m.label : '\\text{size}';
    const res = hide(lab(stage, `${T(`${name}=${v}^\\circ`)} &nbsp;<span class="u5l3-ty" style="color:${TYPE_COL[ty]}">${ty}</span>`, 160, 34, 'u5l3-res'));
    const st = hide(stamp(stage, `not ${wrong}°`, { ok: true, x: 150, y: 92, size: 'sm' }));
    const scale = p.zero === 'inner' ? 'the <b>inner</b> (grey) scale' : 'the <b>outer</b> (black) scale';
    const check = `Check: it looks ${ty === 'acute' ? 'smaller' : 'wider'} than a square corner, so it is <b>${ty}</b>: ${v}°, not ${wrong}° ✓`;
    const readStep = { cap: `Read the number where the other arm crosses that scale: <b>${v}°</b>. ${check}`, run: async (c) => { await c.pop(res); await stampIn(c, st); } };
    if (placed) {
      return [
        { cap: 'The centre mark is on the vertex. Which arm lies on a <b>0</b>?', run: async (c) => { await op(c, hl, 0.4, 400); await c.pop(ring); } },
        { cap: `That 0 belongs to ${scale}. Follow <b>that</b> scale around, counting up from 0.`, run: async (c) => { P.showScale(p.zero); await pulse(c, ring, 1.3, 600); } },
        readStep
      ];
    }
    return [
      { cap: '<b>Step 1.</b> Put the <b>centre mark</b> exactly on the <b>vertex</b>.', run: (c) => P.moveTo(c, { cx: V[0], cy: V[1] }, 1100) },
      { cap: '<b>Step 2.</b> Turn the protractor so the <b>base line</b> lies along <b>one arm</b>.', run: (c) => P.moveTo(c, { rot: p.rot }, 1100) },
      { cap: `<b>Step 3.</b> Find the 0 on that arm: it is on ${scale}. Follow that scale around to the other arm.`, run: async (c) => { await op(c, hl, 0.4, 300); await c.pop(ring); P.showScale(p.zero); } },
      readStep
    ];
  }
};

/* ======================================================================================
 * 3b. Why the two numbers at a mark add to 180 (Full notes)
 * ====================================================================================== */
const twoNums = {
  title: 'Two numbers at every mark',
  height: 400,
  choices: [50, 20, 75].map((a) => ({ v: a, label: `${a} and ${180 - a}` })),
  ask: (a) => `Why does the mark with <b>${a}</b> also say <b>${180 - a}</b>?`,
  make(stage, a, ex) {
    const W = ex.W, H = 400, R = 200, V = [W / 2, 330];
    const P = staticProt(Geo.protractor(stage, { x: 0, y: 0, width: W, height: H, r: R, cx: V[0], cy: V[1], rot: 0, buttons: false, readout: false }));
    const ov = svgEl('g', {}, P.svg);
    const wi = hide(path(ov, wedgeD(V, R * 0.66, 0, a), { fill: GREEN, fo: 0.25, stroke: GREEN, width: 2, cls: '' }));
    const wo = hide(path(ov, wedgeD(V, R * 0.66, a, 180 - a), { fill: BLUE, fo: 0.2, stroke: BLUE, width: 2, cls: '' }));
    const ray = line(ov, V, A(V, a, R * 1.2), { width: 4 }); hide(ray);
    const rings = [[0.748, GREEN], [0.845, BLUE]].map(([f, cl]) => { const q = A(V, a, R * f), e = svgEl('circle', { cx: q[0].toFixed(1), cy: q[1].toFixed(1), r: 15, fill: 'none', stroke: cl, 'stroke-width': 3.5 }, ov); e.style.transformBox = 'fill-box'; e.style.transformOrigin = 'center'; return hide(e); });
    const li = hide(txt(ov, ...A(V, a / 2, R * 0.42), a + '°', { size: 26, color: GREEN }));
    const lo = hide(txt(ov, ...A(V, (a + 180) / 2, R * 0.42), (180 - a) + '°', { size: 26, color: BLUE }));
    const eq = hide(lab(stage, T(`${a}^\\circ+${180 - a}^\\circ=180^\\circ`), 150, 40, 'u5l3-res'));
    return [
      { cap: `An arm crosses the scales at a mark with <b>two numbers</b>: <b>${a}</b> and <b>${180 - a}</b>.`, run: async (c) => { ray.style.opacity = 1; await c.pop(ray, 300); for (const r of rings) await c.pop(r); } },
      { cap: `The <b>inner</b> scale counts from the 0 on the <b>right</b>: the angle on the right is <b>${a}°</b>.`, run: async (c) => { P.showScale('inner'); await op(c, wi, 1); await c.pop(li); } },
      { cap: `The <b>outer</b> scale counts from the 0 on the <b>left</b>: the angle on the left is <b>${180 - a}°</b>.`, run: async (c) => { P.showScale('outer'); await op(c, wo, 1); await c.pop(lo); } },
      { cap: `Together they fill the straight base line: ${T(`${a}^\\circ+${180 - a}^\\circ=180^\\circ`)}. So read the scale whose 0 is on <b>your</b> arm.`, run: async (c) => { P.showScale(null); await c.pop(eq); } }
    ];
  }
};

/* ======================================================================================
 * 4. Drawing an angle (Example 6 check)
 * ====================================================================================== */
const DRAW = { k70: { arm: 0, deg: 70 }, a: { arm: 0, deg: 50, names: ['A', 'B', 'C'] }, b: { arm: 180, deg: 135, names: ['D', 'E', 'F'] }, c: { arm: 30, deg: 90, names: ['G', 'H', 'I'] } };
const draw = {
  title: 'Draw an angle: 4 steps',
  height: 450, tap: false,
  choices: [{ v: 'k70', label: '70°' }, { sep: 'Example 6 check:' }, { v: 'a', label: `(a) ${T('50^\\circ')}` }, { v: 'b', label: `(b) ${T('135^\\circ')}` }, { v: 'c', label: `(c) ${T('90^\\circ')}` }],
  ask: (k) => (k === 'k70' ? 'Draw an angle of <b>70°</b>.' : `Example 6(${k}): draw ${T(`\\angle ${DRAW[k].names.join('')}=${DRAW[k].deg}^\\circ`)} on the arm given.`),
  make(stage, k, ex) {
    const W = ex.W, H = 450, R = 175, L = 230, d = DRAW[k], outer = d.arm === 180;
    const rot = outer ? d.arm - 180 : d.arm, nd = outer ? d.arm - d.deg : d.arm + d.deg, zero = outer ? 'outer' : 'inner';
    const V = fitV([d.arm, nd], W, H, { len: L, R, rot, names: true });
    const svg = stageSvg(stage, W, H);
    const arm = hide(line(svg, V, A(V, d.arm, L), { width: 4 }));
    const vd = hide(dot(svg, V, { r: 5.5 }));
    const nm = d.names || ['', '', ''];
    const l0 = hide(txt(svg, ...A(V, d.arm, L + 24), nm[0], { size: 26 })), l1 = hide(txt(svg, ...A(V, (d.arm + nd) / 2 + 180, nm[1] ? 28 : 40), nm[1] || 'vertex', { size: nm[1] ? 26 : 18, color: nm[1] ? INK : '#6a7182' }));
    const P = staticProt(Geo.protractor(stage, { x: 0, y: 0, width: W, height: H, r: R, cx: V[0] < W / 2 ? W - 200 : 200, cy: H - 40, rot: 0, buttons: false, readout: false }));
    const ov = svgEl('g', {}, P.svg), zc = outer ? BLUE : GREEN;
    const band = hide(path(ov, arcD(V, R * (outer ? 0.845 : 0.748), d.arm, nd - d.arm), { stroke: zc, width: R * 0.08, opacity: 0.3, cls: '' })); band.style.opacity = 0;
    const mk = A(V, nd, R + 10), mdot = hide(svgEl('circle', { cx: mk[0].toFixed(1), cy: mk[1].toFixed(1), r: 7, fill: RED }, ov));
    mdot.style.transformBox = 'fill-box'; mdot.style.transformOrigin = 'center';
    const g2 = svgEl('g', {}, svg);
    const arm2 = hide(line(g2, V, A(V, nd, L - 20), { width: 4, color: RED }));
    const ang = Geo.angle(g2, { vertex: V, a1: d.arm, a2: nd, arms: false, dot: false, label: d.deg + '°', color: RED, size: 24 });
    hide(ang.arc, ang.label);
    const l2 = hide(txt(svg, ...A(V, nd, L + 4), nm[2], { size: 26, color: RED }));
    const scale = outer ? 'the <b>outer</b> scale (its 0 is on the left)' : 'the <b>inner</b> scale (its 0 is on the right)';
    return [
      { cap: '<b>Step 1.</b> Use a ruler to draw one arm. Put a dot at one end for the vertex.', run: async (c) => { arm.style.opacity = 1; await drawIn(arm, 700, c); await c.pop(vd); await c.pop(l1); if (nm[0]) await c.pop(l0); } },
      { cap: '<b>Step 2.</b> Put the centre mark on the vertex and the base line along the arm.', run: async (c) => { await P.moveTo(c, { cx: V[0], cy: V[1] }, 1000); await P.moveTo(c, { rot }, 900); } },
      { cap: `<b>Step 3.</b> Start at the 0 on your arm: ${scale}. Follow it to <b>${d.deg}</b> and make a small dot at the edge.`, run: async (c) => { P.showScale(zero); await op(c, band, 1, 600); await c.pop(mdot); } },
      { cap: `<b>Step 4.</b> Take the protractor away. Join the vertex to the dot with a ruler. ${d.deg === 90 ? 'Mark the right angle with a small square.' : `Label the angle ${d.deg}°.`}`,
        run: async (c) => { await op(c, P.g, 0, 500); await op(c, band, 0, 200); arm2.style.opacity = 1; await c.pop(arm2, 300); if (nm[2]) await c.pop(l2); ang.arc.style.opacity = 1; await c.pop(ang.arc); if (d.deg !== 90) await c.pop(ang.label); else hide(ang.label); } }
    ];
  }
};

/* ======================================================================================
 * 4b. Reflex angles (Example 7)
 * ====================================================================================== */
const reflex = {
  title: 'Reflex angle = 360° − the smaller angle',
  height: 420,
  choices: [{ sep: 'Example 7 check:' }, { v: 'a', label: '(a) 125°' }, { v: 'b', label: '(b) measure' }, { v: 'c', label: '(c) draw 250°' }],
  value: 'a',
  ask: (k) => (k === 'a' ? 'Example 7(a): the smaller angle between two arms is 125°. What is the reflex angle?' : k === 'b' ? 'Example 7(b): measure the marked reflex angle.' : 'Example 7(c): draw a reflex angle of 250° on the arm given.'),
  make(stage, k, ex) {
    const W = ex.W, H = 420, ox = (W - 960) / 2, svg = stageSvg(stage, W, H), V = [ox + 270, 262], len = 195, px = ox + 700;
    const cfg = { a: [20, 145], b: [10, 74], c: [0, 110] }[k], [a1, a2] = cfg, small = a2 - a1, big = 360 - small;
    const ring = hide(path(svg, `M${V[0] + 76} ${V[1]}A76 76 0 1 0 ${V[0] - 76} ${V[1]}A76 76 0 1 0 ${V[0] + 76} ${V[1]}`, { stroke: GREY, width: 2.5, dash: '7 6' }));
    const sArc = hide(path(svg, arcD(V, 50, a1, small), { stroke: BLUE, width: 3.4, cls: '' }));
    const sLab = hide(txt(svg, ...A(V, a1 + small / 2, 92), small + '°', { size: 26, color: BLUE }));
    const rArc = path(svg, '', { stroke: RED, width: 3.6, cls: '' });
    const rLab = hide(txt(svg, ...A(V, a2 + big / 2, 66), big + '°', { size: 26, color: RED }));
    line(svg, V, A(V, a1, len), { width: 4 });
    const arm2 = line(svg, V, A(V, a2, len), { width: 4, color: k === 'c' ? RED : INK }); if (k === 'c') hide(arm2);
    dot(svg, V, { r: 5.5 });
    if (k === 'c') txt(svg, ...A(V, 318, 62), 'vertex', { size: 17, color: '#6a7182' });
    const setR = (u) => rArc.setAttribute('d', u > 0.003 ? arcD(V, 34, a2, big * u) : '');
    let P = null;
    if (k !== 'a') { P = staticProt(Geo.protractor(stage, { x: 0, y: 0, width: W, height: H, r: 150, cx: V[0], cy: V[1], rot: a1, buttons: false, readout: false })); hide(P.el); P.showScale('inner'); }
    const L1 = (html, y) => hide(lab(stage, html, px, y, 'u5l3-eq'));
    if (k === 'a') {
      const e1 = L1(T('\\text{full turn}=360^\\circ'), 90), e2 = L1(T('360^\\circ-125^\\circ=235^\\circ'), 160);
      const st = hide(stamp(stage, '235° is reflex ✓', { ok: true, x: px, y: 250 }));
      return [
        { cap: 'The smaller angle between the arms is <b>125°</b>.', run: async (c) => { sArc.style.opacity = 1; await c.pop(sArc); await c.pop(sLab); } },
        { cap: 'All the way around the vertex is a <b>full turn: 360°</b>.', run: async (c) => { ring.style.opacity = 1; await c.fadeIn(ring, 500); await c.pop(e1); } },
        { cap: 'The <b>reflex</b> angle goes the <b>long way</b> around: the rest of the turn.', run: async (c) => { await tween(c, 1600, setR); await c.pop(rLab); } },
        { cap: `Reflex angle = 360° − the smaller angle: ${T('360^\\circ-125^\\circ=235^\\circ')}.`, run: (c) => c.pop(e2) },
        { cap: 'Check: 235° is between 180° and 360°, so it is a reflex angle ✓', run: (c) => stampIn(c, st) }
      ];
    }
    if (k === 'b') {
      setR(1); hide(rLab);
      const e1 = L1(`small angle: ${T('64^\\circ')}`, 90), e2 = L1(T('360^\\circ-64^\\circ=296^\\circ'), 160);
      const st = hide(stamp(stage, '296° is reflex ✓', { ok: true, x: px, y: 250 }));
      return [
        { cap: 'The arc goes the <b>long way</b> around: a reflex angle. A protractor only goes to 180°, so measure the <b>small</b> angle instead.', run: (c) => pulse(c, rArc, 1.08, 700) },
        { cap: 'Small angle: the 0 of the <b>inner</b> scale is on the lower arm. It reads <b>64°</b>.', run: async (c) => { P.el.style.opacity = 1; await c.fadeIn(P.el, 500); sArc.style.opacity = 1; await c.pop(sArc); await c.pop(sLab); await c.pop(e1); } },
        { cap: `Subtract from 360°: ${T('360^\\circ-64^\\circ=296^\\circ')}.`, run: async (c) => { await op(c, P.el, 0, 500); await c.pop(e2); await c.pop(rLab); } },
        { cap: 'Check: 296° is between 180° and 360° ✓', run: (c) => stampIn(c, st) }
      ];
    }
    hide(sLab, rLab);
    const e1 = L1(T('360^\\circ-250^\\circ=110^\\circ'), 90), e2 = L1(T('110^\\circ+250^\\circ=360^\\circ'), 160);
    const st = hide(stamp(stage, 'a full turn ✓', { ok: true, x: px, y: 250 }));
    return [
      { cap: `A protractor can’t draw 250° in one go. Find the smaller angle first: ${T('360^\\circ-250^\\circ=110^\\circ')}.`, run: (c) => c.pop(e1) },
      { cap: 'Draw <b>110°</b> with the protractor: inner scale, 0 on the arm. Join the vertex to the dot.', run: async (c) => { P.el.style.opacity = 1; await c.fadeIn(P.el, 500); arm2.style.opacity = 1; await c.pop(arm2, 300); sArc.style.opacity = 1; await c.pop(sArc); await c.pop(sLab); } },
      { cap: 'Take the protractor away. Mark the <b>reflex</b> angle with an arc going the long way around: <b>250°</b>.', run: async (c) => { await op(c, P.el, 0, 500); await tween(c, 1500, setR); await c.pop(rLab); } },
      { cap: `Check: ${T('110^\\circ+250^\\circ=360^\\circ')}, a full turn ✓`, run: async (c) => { await c.pop(e2); await stampIn(c, st); } }
    ];
  }
};

/* ======================================================================================
 * 5. Tear the corners off a triangle
 * ====================================================================================== */
const TRIS = [[50, 60, 70], [35, 45, 100], [90, 30, 60]];
const tear = {
  title: 'Tear the corners off a triangle',
  height: 420,
  choices: TRIS.map((t, i) => ({ v: i, label: `triangle ${i + 1}` })),
  ask: 'What do the three angles of a triangle add up to?',
  make(stage, i, ex) {
    const W = ex.W, H = 420, ox = (W - 960) / 2, svg = stageSvg(stage, W, H);
    const [Aa, Bb, Cc] = TRIS[i], base = 340, P0 = [ox + 50, 350], P1 = [ox + 50 + base, 350];
    const P2 = A(P0, Aa, base * Math.sin(Bb * RAD) / Math.sin(Cc * RAD));
    const tri = path(svg, polyD([P0, P1, P2]), { width: 3.4, fill: '#fbf6ec' });
    const r = 86, Q = [ox + 710, 300];
    const corners = [
      { k: 'a', V: P0, start: 0, span: Aa, cl: BLUE, t: Bb + Cc },
      { k: 'b', V: P1, start: 180 - Bb, span: Bb, cl: GREEN, t: 0 },
      { k: 'c', V: P2, start: Geo.dirTo(P2, P0), span: Cc, cl: AMBER, t: Bb }
    ];
    const lineQ = hide(line(svg, [Q[0] - 230, Q[1]], [Q[0] + 230, Q[1]], { width: 3.4, dash: '10 7' }));
    corners.forEach((o) => {
      o.g = svgEl('g', {}, svg); o.g.style.transformBox = 'view-box'; o.g.style.transformOrigin = '0 0';
      path(o.g, wedgeD([0, 0], r, o.start, o.span), { fill: o.cl, fo: 0.35, stroke: o.cl, width: 2.5, cls: '' });
      o.lt = txt(svg, 0, 0, o.k, { size: 26, color: o.cl, italic: true });
      o.pos = o.V.slice(); o.rot = 0;
      o.place = (pos, rot) => { o.pos = pos; o.rot = rot; o.g.setAttribute('transform', `translate(${pos[0].toFixed(2)} ${pos[1].toFixed(2)}) rotate(${(-rot).toFixed(2)})`); const m = A(pos, o.start + o.span / 2 + rot, r * 0.62); o.lt.setAttribute('x', m[0].toFixed(1)); o.lt.setAttribute('y', m[1].toFixed(1)); };
      o.place(o.V, 0); o.g.style.opacity = 0; o.lt.style.opacity = 0;
    });
    const l180 = hide(txt(svg, Q[0], Q[1] - r - 26, '180°', { size: 28, color: INK }));
    const eq1 = hide(lab(stage, T('a+b+c=180^\\circ'), Q[0], 60, 'u5l3-eq'));
    const eq2 = hide(lab(stage, T(`${Aa}^\\circ+${Bb}^\\circ+${Cc}^\\circ=180^\\circ`), Q[0], 112, 'u5l3-eq'));
    return [
      { cap: 'Any triangle. Colour its three corners <b>a</b>, <b>b</b> and <b>c</b>.', run: async (c) => { for (const o of corners) { await op(c, o.g, 1, 300); o.lt.style.opacity = 1; await c.pop(o.lt, 260); } } },
      { cap: 'Tear off the three corners.', run: async (c) => {
        await op(c, tri, 0.25, 400);
        const from = corners.map((o) => o.pos), to = corners.map((o) => A(o.V, o.start + o.span / 2 + 180, 26));
        await tween(c, 600, (u) => corners.forEach((o, j) => o.place([from[j][0] + (to[j][0] - from[j][0]) * u, from[j][1] + (to[j][1] - from[j][1]) * u], 0)));
      } },
      { cap: 'Put the corners side by side, with all three points together…', run: async (c) => {
        await op(c, lineQ, 0.5, 300);
        for (const o of [corners[1], corners[2], corners[0]]) {
          const p0 = o.pos.slice(), dr = ((o.t - o.start + 540) % 360) - 180;
          await tween(c, 1000, (u) => o.place([p0[0] + (Q[0] - p0[0]) * u, p0[1] + (Q[1] - p0[1]) * u], dr * u));
        }
      } },
      { cap: 'They always make a <b>straight line</b>. The angles in <b>any</b> triangle add up to <b>180°</b>.', run: async (c) => { await op(c, lineQ, 1, 300); await c.pop(l180); await c.pop(eq1); await c.pop(eq2); } }
    ];
  }
};

/* ======================================================================================
 * 5b. A polygon splits into triangles from one corner (Example 8 check)
 * ====================================================================================== */
const SHAPES = {
  3: [[0, 0], [1.8, 0], [0.6, 1.4]],
  4: [[0, 0], [2, 0], [2.3, 1.5], [0.3, 1.7]],
  5: [[0, 0], [1.8, 0], [2.4, 1.2], [1.0, 2.1], [-0.4, 1.2]],
  6: [[0, 0], [1.6, 0], [2.4, 1.1], [1.7, 2.2], [0.2, 2.2], [-0.6, 1.1]]
};
const PNAME = { 3: 'triangle', 4: 'quadrilateral', 5: 'pentagon', 6: 'hexagon', 7: 'heptagon', 8: 'octagon', 9: 'nonagon', 10: 'decagon', 12: 'dodecagon' };
/** polygon points (booklet coordinates, y up) placed in px: fitted into a box of w × h centred at (cx, cy) */
function placePoly(pts, cx, cy, w, h, maxS = 140) {
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const s = Math.min(w / (Math.max(...xs) - Math.min(...xs)), h / (Math.max(...ys) - Math.min(...ys)), maxS);
  const mx = (Math.max(...xs) + Math.min(...xs)) / 2, my = (Math.max(...ys) + Math.min(...ys)) / 2;
  return pts.map(([x, y]) => [cx + (x - mx) * s, cy - (y - my) * s]);
}
function regPts(n) { const out = []; for (let k = 0; k < n; k++) { const a = (-90 - 180 / n + k * 360 / n) * RAD; out.push([Math.cos(a), Math.sin(a)]); } return out; }   // y up, a side at the bottom, corner 0 bottom-left
const NS = [3, 4, 5, 6, 7, 10];
const TRI_COL = ['#dbe7fb', '#dcf1e6', '#fbecd2', '#efe3fb', '#fde2df', '#e3f0f3', '#f4eccd', '#e9e9f5'];
const split = {
  title: 'Split a polygon into triangles from one corner',
  height: 450,
  choices: [{ sep: 'Example 8 check:' }, ...NS.map((n) => ({ v: n, label: `${n} sides` }))],
  value: 3,
  ask: (n) => `Example 8: how many triangles in a ${PNAME[n]} (${n} sides), and what is the sum of its angles?${n >= 7 ? ' Use the pattern.' : ''}`,
  make(stage, n, ex) {
    const W = ex.W, H = 450, ox = (W - 960) / 2, svg = stageSvg(stage, W, H), S = (n - 2) * 180;
    const pts = placePoly(SHAPES[n] || regPts(n), ox + 235, 150, 400, 250, n >= 7 ? 135 : 120);
    const tris = [];
    for (let k = 1; k <= n - 2; k++) {
      const t = path(svg, polyD([pts[0], pts[k], pts[k + 1]]), { fill: TRI_COL[(k - 1) % TRI_COL.length], stroke: 'none', cls: '' }); hide(t);
      const cxy = [(pts[0][0] + pts[k][0] + pts[k + 1][0]) / 3, (pts[0][1] + pts[k][1] + pts[k + 1][1]) / 3];
      tris.push({ t, n: hide(txt(svg, cxy[0], cxy[1], String(k), { size: 22, color: '#4b5263' })) });
    }
    const outline = path(svg, polyD(pts), { width: 3.6 });
    const diags = []; for (let k = 2; k <= n - 2; k++) diags.push(hide(line(svg, pts[0], pts[k], { width: 2.8, dash: '9 6', color: BROWN })));
    const corner = hide(dot(svg, pts[0], { r: 9, color: RED }));
    // the panel
    const px = ox + 715;
    const e1 = hide(lab(stage, `${n} sides &nbsp;→&nbsp; <b>${n - 2}</b> triangle${n - 2 > 1 ? 's' : ''}`, px, 80, 'u5l3-eq'));
    const e2 = hide(lab(stage, T(`${n - 2}\\times180^\\circ=${tn(S)}^\\circ`), px, 145, 'u5l3-eq'));
    const e3 = n === 10 ? hide(lab(stage, `${T('n')} sides → ${T('n-2')} triangles<br>${T('S=(n-2)\\times180^\\circ')}`, px, 225, 'u5l3-eq u5l3-rule')) : null;
    // the table
    const tb = h('div', 'u5l3-st'), cols = NS.concat(['n']), idx = NS.indexOf(n), cells = {};
    const row = (head, f) => { tb.appendChild(h('div', 'u5l3-sth', `<span>${head}</span>`)); cols.forEach((m, j) => { const e = h('div', 'u5l3-stc', f(m, j)); tb.appendChild(e); cells[head + j] = e; }); };
    row('Sides, ' + T('n'), (m) => (m === 'n' ? T('n') : String(m)));
    row('Triangles', (m, j) => (j < idx ? String(m - 2) : j === idx ? '?' : ''));
    row('Sum', (m, j) => (j < idx ? pn((m - 2) * 180) + '°' : j === idx ? '?' : ''));
    add(stage, tb, ox + 20, 312);
    const fill = async (c, key, html) => { const e = cells[key]; e.innerHTML = html; e.classList.add('u5l3-new'); await c.pop(e, 380); };
    const s = [
      { cap: `A ${PNAME[n]} has <b>${n}</b> sides. Pick <b>one</b> corner.`, run: async (c) => { cells['Sides, ' + T('n') + idx].classList.add('u5l3-now'); corner.style.opacity = 1; await c.pop(corner); } },
      { cap: n === 3 ? 'A triangle is already one triangle: there are no other corners to join.' : 'Draw lines from that corner to every corner that is not next to it. Count the triangles.', run: async (c) => {
        for (let k = 0; k < tris.length; k++) { if (k > 0) { diags[k - 1].style.opacity = 1; await c.pop(diags[k - 1], 250); } await op(c, tris[k].t, 1, 300); tris[k].n.style.opacity = 1; await c.pop(tris[k].n, 260); }
      } },
      { cap: `<b>${n - 2}</b> triangle${n > 3 ? 's' : ''}: always <b>2 fewer</b> than the ${n} sides.`, run: async (c) => { await c.pop(e1); await fill(c, 'Triangles' + idx, String(n - 2)); } },
      { cap: `Each triangle adds 180°: ${T(`${n - 2}\\times180^\\circ=${tn(S)}^\\circ`)}.`, run: async (c) => { await c.pop(e2); await fill(c, 'Sum' + idx, pn(S) + '°'); } }
    ];
    if (n === 10) s.push({ cap: `The pattern for <b>any</b> polygon: ${T('n-2')} triangles, so the sum is ${T('S=(n-2)\\times180^\\circ')}.`, run: async (c) => { await c.pop(e3); await fill(c, 'Triangles6', T('n-2')); await fill(c, 'Sum6', T('(n-2)\\times180^\\circ')); } });
    return s;
  }
};

/* ======================================================================================
 * 5c. Another way: triangles from a point inside (Full notes)
 * ====================================================================================== */
const whyN2 = {
  title: 'Another way: triangles from a point inside',
  height: 410,
  choices: [5, 6, 8].map((n) => ({ v: n, label: PNAME[n] })),
  ask: (n) => `Why is the sum for a ${PNAME[n]} ${T(`(${n}-2)\\times180^\\circ`)}?`,
  make(stage, n, ex) {
    const W = ex.W, H = 410, ox = (W - 960) / 2, svg = stageSvg(stage, W, H), C = [ox + 250, 210], R = 175, S1 = n * 180, S = (n - 2) * 180;
    const pts = regPts(n).map(([x, y]) => [C[0] + x * R, C[1] - y * R]);
    const tris = pts.map((p, k) => hide(path(svg, polyD([C, p, pts[(k + 1) % n]]), { fill: TRI_COL[k % TRI_COL.length], stroke: 'none', cls: '' })));
    path(svg, polyD(pts), { width: 3.6 });
    const spokes = pts.map((p) => hide(line(svg, C, p, { width: 2.6, color: BROWN })));
    const cd = hide(dot(svg, C, { r: 7, color: BROWN }));
    const ring = hide(path(svg, `M${C[0] + 30} ${C[1]}A30 30 0 1 0 ${C[0] - 30} ${C[1]}A30 30 0 1 0 ${C[0] + 30} ${C[1]}`, { stroke: RED, width: 4, cls: '' }));
    ring.style.transformBox = 'fill-box'; ring.style.transformOrigin = 'center';
    const px = ox + 720;
    const e1 = hide(lab(stage, `${n} triangles: ${T(`${n}\\times180^\\circ=${tn(S1)}^\\circ`)}`, px, 90, 'u5l3-eq'));
    const e2 = hide(lab(stage, `around the middle: ${T('360^\\circ')}`, px, 155, 'u5l3-eq u5l3-redt'));
    const e3 = hide(lab(stage, T(`${tn(S1)}^\\circ-360^\\circ=${tn(S)}^\\circ`), px, 220, 'u5l3-eq'));
    const st = hide(stamp(stage, `= (${n} − 2) × 180° ✓`, { ok: true, x: px, y: 290 }));
    return [
      { cap: `Put a point <b>inside</b> the ${PNAME[n]}. Join it to every corner: <b>${n}</b> triangles.`, run: async (c) => { cd.style.opacity = 1; await c.pop(cd); for (let k = 0; k < n; k++) { spokes[k].style.opacity = 1; await c.pop(spokes[k], 200); await op(c, tris[k], 1, 200); } } },
      { cap: `All the triangles together: ${T(`${n}\\times180^\\circ=${tn(S1)}^\\circ`)}.`, run: (c) => c.pop(e1) },
      { cap: `But the angles around the middle point are <b>not</b> corners of the ${PNAME[n]}. Together they make a full turn: 360°.`, run: async (c) => { ring.style.opacity = 1; await c.pop(ring); await c.pop(e2); } },
      { cap: `Take them away: ${T(`${tn(S1)}^\\circ-360^\\circ=${tn(S)}^\\circ`)}, the same as ${T(`(${n}-2)\\times180^\\circ`)} ✓`, run: async (c) => { await c.pop(e3); await stampIn(c, st); } }
    ];
  }
};

/* ======================================================================================
 * 5d. Finding a missing angle: the sum bar (Examples 9 and 10)
 * ====================================================================================== */
function inLabel(pts, k, d) {   // a point inside a convex polygon near corner k, on the bisector
  const n = pts.length, V = pts[k], P = pts[(k + n - 1) % n], Q = pts[(k + 1) % n];
  const u = [(P[0] - V[0]) / Math.hypot(P[0] - V[0], P[1] - V[1]), (P[1] - V[1]) / Math.hypot(P[0] - V[0], P[1] - V[1])];
  const w = [(Q[0] - V[0]) / Math.hypot(Q[0] - V[0], Q[1] - V[1]), (Q[1] - V[1]) / Math.hypot(Q[0] - V[0], Q[1] - V[1])];
  const b = [u[0] + w[0], u[1] + w[1]], l = Math.hypot(b[0], b[1]) || 1;
  return [V[0] + b[0] / l * d, V[1] + b[1] / l * d];
}
const MISS = {
  tri: { n: 3, known: [48, 77], x: 55 },
  stop: { n: 8, regular: true },
  a: { n: 4, known: [85, 110, 72], x: 93, pts: [[0, 0], [3.4, 0], [4.08, 1.88], [0.18, 2.02]], labs: [[0.51, 0.47], [3.05, 0.5], [3.45, 1.46], [0.62, 1.52]] },
  b: { n: 5, known: [90, 90, 125, 125], x: 110, pts: [[0, 0], [3, 0], [3, 1.6], [1.5, 2.65], [0, 1.6]], labs: [[0.3, 0.3], [2.7, 0.3], [2.55, 1.45], [1.5, 2.25], [0.45, 1.45]], order: [0, 1, 2, 4, 3] }
};
const missing = {
  title: 'Find a missing angle: the sum, minus the angles you know',
  height: 430,
  choices: [{ v: 'tri', label: 'a triangle' }, { sep: 'Example 9 check:' }, { v: 'stop', label: 'stop sign' }, { sep: 'Example 10 check:' }, { v: 'a', label: '(a) quadrilateral' }, { v: 'b', label: '(b) shed' }],
  ask: (k) => ({ tri: `A triangle has angles 48° and 77°. Find the missing angle ${T('x')}.`, stop: 'Example 9: a stop sign is a regular octagon. Find the sum of its angles and the size of each corner.', a: `Example 10(a): find the missing angle ${T('x')} in the quadrilateral.`, b: `Example 10(b): find the angle ${T('x')} at the peak of the shed roof.` }[k]),
  make(stage, k, ex) {
    const W = ex.W, H = 430, ox = (W - 960) / 2, svg = stageSvg(stage, W, H), m = MISS[k], n = m.n, S = (n - 2) * 180;
    let pts, labs;
    if (k === 'tri') { const P0 = [ox + 40, 285], P1 = [ox + 300, 285], P2 = A(P0, 48, 260 * Math.sin(77 * RAD) / Math.sin(55 * RAD)); pts = [P0, P1, P2]; labs = pts.map((_, j) => inLabel(pts, j, j === 2 ? 62 : 70)); }
    else if (k === 'stop') { pts = regPts(8).map(([x, y]) => [ox + 220 + x * 128, 160 - y * 128]); labs = pts.map((_, j) => inLabel(pts, j, 40)); }
    else { const s = k === 'a' ? 92 : 98, o0 = k === 'a' ? [ox + 30, 285] : [ox + 75, 285]; pts = m.pts.map(([x, y]) => [o0[0] + x * s, o0[1] - y * s]); labs = m.labs.map(([x, y]) => [o0[0] + x * s, o0[1] - y * s]); }
    path(svg, polyD(pts), { width: 3.6, fill: k === 'stop' ? '#d23a2e' : k === 'b' ? '#f1e2c8' : '#fbf6ec', stroke: k === 'stop' ? '#7a1f16' : INK });
    if (k === 'stop') { path(svg, polyD(regPts(8).map(([x, y]) => [ox + 220 + x * 114, 160 - y * 114])), { stroke: '#fff', width: 3, cls: '' }); txt(svg, ox + 220, 160, 'STOP', { size: 46, color: '#fff', halo: false, weight: 900 }); }
    if (k === 'b') { svgEl('rect', { x: pts[0][0] + 1.2 * 98, y: pts[0][1] - 98, width: 0.6 * 98, height: 98, fill: '#fff', stroke: INK, 'stroke-width': 2.5 }, svg); square(svg, pts[0], 0, 20); square(svg, pts[1], 90, 20); }
    // side numbers (counting)
    const sideN = pts.map((p, j) => { const q = pts[(j + 1) % n], mid = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], cen = pts.reduce((a, b) => [a[0] + b[0] / n, a[1] + b[1] / n], [0, 0]); const d = [mid[0] - cen[0], mid[1] - cen[1]], l = Math.hypot(...d); return hide(txt(svg, mid[0] + d[0] / l * 22, mid[1] + d[1] / l * 22, String(j + 1), { size: 19, color: PURPLE })); });
    // corner labels
    const known = m.regular ? [] : m.known, xi = m.regular ? -1 : (k === 'b' ? 3 : n - 1);
    const cornerL = []; const kAt = m.order || [...Array(n).keys()];
    if (!m.regular) {
      let q = 0;
      kAt.forEach((j) => {
        if (j === xi) return;
        const val = known[q++];
        if (k === 'b' && val === 90) return;   // right angles shown by their squares
        txt(svg, labs[j][0], labs[j][1], val + '°', { size: 21 });
      });
    }
    const xl = m.regular ? null : txt(svg, labs[xi][0], labs[xi][1], 'x', { size: 26, italic: true, color: RED });
    const xans = m.regular ? null : hide(txt(svg, labs[xi][0], labs[xi][1], m.x + '°', { size: 23, color: RED }));
    const each = m.regular ? labs.map((p) => hide(txt(svg, p[0], p[1], '135°', { size: 17, color: '#fff', halo: false }))) : [];
    // the sum bar
    const bx0 = ox + 40, bx1 = ox + 920, by = 340, bh = 46, BX = (v) => bx0 + (bx1 - bx0) * v / S;
    const barO = hide(svgEl('rect', { x: bx0, y: by, width: bx1 - bx0, height: bh, rx: 6, fill: '#fff', stroke: INK, 'stroke-width': 2.5 }, svg));
    const barL = hide(txt(svg, (bx0 + bx1) / 2, by - 18, `all ${n} angles: ${pn(S)}°`, { size: 20 }));
    const pieces = []; let acc = 0;
    const PC = [BLUE, GREEN, AMBER, PURPLE, BROWN];
    const parts = m.regular ? Array(n).fill(S / n) : known;
    parts.forEach((v, j) => {
      const g = svgEl('g', {}, svg);
      svgEl('rect', { x: BX(acc) + 1.5, y: by + 1.5, width: BX(acc + v) - BX(acc) - 3, height: bh - 3, rx: 4, fill: m.regular ? '#d23a2e' : PC[j % 5], 'fill-opacity': m.regular ? 0.85 : 0.35 }, g);
      txt(g, (BX(acc) + BX(acc + v)) / 2, by + bh / 2, v + '°', { size: 19, color: m.regular ? '#fff' : INK, halo: m.regular ? false : 4 });
      g.style.transformBox = 'fill-box'; g.style.transformOrigin = 'left center'; hide(g); pieces.push(g); acc += v;
    });
    let gap = null;
    if (!m.regular) {
      gap = svgEl('g', {}, svg);
      svgEl('rect', { x: BX(acc) + 1.5, y: by + 1.5, width: BX(S) - BX(acc) - 3, height: bh - 3, rx: 4, fill: RED, 'fill-opacity': 0.18, stroke: RED, 'stroke-width': 2.5, 'stroke-dasharray': '7 5' }, gap);
      txt(gap, (BX(acc) + BX(S)) / 2, by + bh / 2, `x = ${m.x}°`, { size: 20, color: RED });
      hide(gap);
    }
    const px = ox + 715, E = (html, y) => hide(lab(stage, html, px, y, 'u5l3-eq'));
    const sumK = known.reduce((a, b) => a + b, 0);
    const e1 = E(T(`n=${n}`), 40), e2 = E(T(`S=(${n}-2)\\times180^\\circ=${tn(S)}^\\circ`), 100);
    const countStep = { cap: `Count the sides: ${T(`n=${n}`)}.`, run: async (c) => { for (const e of sideN) { e.style.opacity = 1; await c.pop(e, 200); } await c.pop(e1); } };
    const sumStep = { cap: `Sum of all ${n} angles: ${T(`S=(${n}-2)\\times180^\\circ=${tn(S)}^\\circ`)}.`, run: async (c) => { await c.pop(e2); barO.style.opacity = 1; await c.fadeIn(barO, 400); await c.pop(barL); } };
    if (m.regular) {
      const e3 = E(T(`${tn(S)}^\\circ\\div${n}=${S / n}^\\circ`), 160);
      const st = hide(stamp(stage, 'obtuse', { ok: null, x: px, y: 240 }));
      return [
        { cap: `A stop sign is a <b>regular octagon</b>: 8 equal sides and 8 equal angles. Count the sides: ${T('n=8')}.`, run: countStep.run },
        { cap: `Sum of the angles: ${T(`S=(8-2)\\times180^\\circ=6\\times180^\\circ=${tn(S)}^\\circ`)}.`, run: sumStep.run },
        { cap: `All 8 angles are equal, so share the sum: ${T(`${tn(S)}^\\circ\\div8=135^\\circ`)}. Each corner is <b>135°</b>.`, run: async (c) => { for (const g of pieces) { g.style.opacity = 1; await c.anim(g, [{ opacity: 0, transform: 'scaleX(0)' }, { opacity: 1, transform: 'scaleX(1)' }], 220); } await c.pop(e3); for (const e of each) { e.style.opacity = 1; await c.pop(e, 160); } } },
        { cap: '135° is between 90° and 180°: each corner is <b>obtuse</b>.', run: (c) => stampIn(c, st) }
      ];
    }
    const e3 = E(T(`${known.join('+')}=${sumK}^\\circ`), 160), e4 = E(T(`x=${tn(S)}^\\circ-${sumK}^\\circ=${m.x}^\\circ`), 220);
    return [
      countStep, sumStep,
      { cap: `Add the angles you know: ${T(`${known.join('^\\circ+')}^\\circ=${sumK}^\\circ`)}.`, run: async (c) => { for (const g of pieces) { g.style.opacity = 1; await c.anim(g, [{ opacity: 0, transform: 'scaleX(0)' }, { opacity: 1, transform: 'scaleX(1)' }], 380); } await c.pop(e3); } },
      { cap: `What is left is the missing angle: ${T(`x=${tn(S)}^\\circ-${sumK}^\\circ=${m.x}^\\circ`)}.`, run: async (c) => { gap.style.opacity = 1; await c.pop(gap); await c.pop(e4); await op(c, xl, 0, 200); xans.style.opacity = 1; await c.pop(xans); } }
    ];
  }
};

mountExplainers({ turn, types, measure, twoNums, draw, reflex, tear, split, whyN2, missing });

/* ======================================================================================
 * Hands-on protractor (Section 3)
 * ====================================================================================== */
(function tool() {
  const host = document.getElementById('u5l3-prot'); if (!host) return;
  Geo.protractor(host, { width: 960, height: 450, r: 200, cx: 210, angle: { vertex: [600, 228], a1: 25, a2: 140, len: 185, names: ['A', 'B', 'C'] } });
})();

/* ======================================================================================
 * Static figures on the cards
 * ====================================================================================== */
const FIG = {
  wans(host) {
    const s = figSvg(host, 260, 210), C = [236, 190], L = 180;
    path(s, `M${C[0]} 8L${C[0]} ${C[1]}L8 ${C[1]}`, { width: 4, stroke: '#7a5124' });
    [84, 66, 48, 30, 12].forEach((t, i) => { const B = [C[0] - L * Math.cos(t * RAD), C[1]], T2 = [C[0], C[1] - L * Math.sin(t * RAD)]; line(s, B, T2, { color: '#a8763a', width: 4, opacity: 0.35 + i * 0.12, cls: '' }); dot(s, [(B[0] + T2[0]) / 2, (B[1] + T2[1]) / 2], { r: 5.5, color: RED }); });
    path(s, arcD(C, L / 2, 90, 90), { stroke: RED, width: 3, dash: '7 5', cls: '' });
    square(s, C, 90, 14, { color: '#7a5124' });
  },
  parts(host) {
    const s = figSvg(host, 330, 250), V = [78, 205];
    Geo.angle(s, { vertex: V, a1: 0, a2: 50, len: 220, label: '1', names: ['A', 'B', 'C'], size: 24, r: 44 });
    const tv = txt(s, 34, 128, 'vertex', { size: 18, color: '#6a7182' }); void tv;
    line(s, [40, 140], [72, 196], { color: GREY, width: 2, cls: '' });
    txt(s, 190, 228, 'arm', { size: 18, color: '#6a7182' });
    txt(s, ...A(A(V, 50, 120), 140, 24), 'arm', { size: 18, color: '#6a7182' });
  },
  ex1(host) {
    const s = figSvg(host, 330, 270), V = [150, 235];
    Geo.angle(s, { vertex: V, a1: 15, a2: 70, len: 150, label: '1', r: 54, names: ['P', 'Q', 'R'], size: 24 });
    Geo.angle(s, { vertex: V, a1: 70, a2: 140, len: 150, label: '2', r: 40, names: [null, null, 'S'], size: 24, dot: false });
  },
  't-acute': (host) => Geo.angle(figSvg(host, 170, 120), { vertex: [30, 100], a1: 0, a2: 40, len: 125 }),
  't-right': (host) => Geo.angle(figSvg(host, 170, 120), { vertex: [45, 105], a1: 0, a2: 90, len: 95 }),
  't-obtuse': (host) => Geo.angle(figSvg(host, 170, 120), { vertex: [92, 105], a1: 0, a2: 130, len: 75, r: 30 }),
  't-straight': (host) => Geo.angle(figSvg(host, 170, 120), { vertex: [85, 92], a1: 0, a2: 180, len: 74, r: 28 }),
  't-reflex': (host) => Geo.angle(figSvg(host, 170, 120), { vertex: [60, 92], a1: 0, a2: 60, len: 80, reflex: true, r: 24 }),
  ex3a(host) {
    const s = figSvg(host, 210, 160), V = [44, 128];
    svgEl('rect', { x: 40, y: 128, width: 150, height: 14, rx: 3, fill: '#d9dde4', stroke: INK, 'stroke-width': 2.5 }, s);
    for (let i = 0; i < 6; i++) svgEl('rect', { x: 58 + i * 21, y: 131, width: 15, height: 4, rx: 1, fill: '#9aa0ab' }, s);
    line(s, V, A(V, 115, 112), { width: 10, color: '#3a4254', cls: '' });
    path(s, arcD(V, 30, 0, 115), { width: 2.6, cls: '' });
  },
  ex3b(host) {
    const s = figSvg(host, 210, 160), C = [105, 80], R = 64;
    svgEl('circle', { cx: C[0], cy: C[1], r: R, fill: 'none', stroke: GREY, 'stroke-width': 2, 'stroke-dasharray': '6 5' }, s);
    path(s, wedgeD(C, R, 45, 315), { fill: '#f4c46a', fo: 0.85, stroke: INK, width: 3, cls: '' });
    path(s, wedgeD(C, R - 9, 45, 315), { fill: '#e8a01e', fo: 0.6, stroke: 'none', cls: '' });
    [[150, 40], [200, 30], [250, 44], [300, 32], [110, 46], [330, 46], [80, 30]].forEach(([d, r]) => dot(s, A(C, d, r), { r: 6.5, color: '#b5352b' }));
    path(s, arcD(C, 16, 45, 315), { width: 2.6, cls: '' });
  },
  ex3c(host) {
    const s = figSvg(host, 210, 160), F = [112, 140];
    line(s, [8, 140], [196, 140], { width: 3.4, cls: '' });
    for (let x = 12; x < 196; x += 12) line(s, [x, 140], [x - 8, 150], { width: 1.5, color: GREY, cls: '' });
    line(s, [170, 140], [170, 10], { width: 3.4, cls: '' });
    const Tp = A(F, 60, 116);
    line(s, F, Tp, { width: 7, color: '#8a5a1c', cls: '' });
    path(s, arcD(F, 26, 0, 60), { width: 2.6, cls: '' });
  },
  ex3d(host) {
    const s = figSvg(host, 210, 160), B = [90, 140];
    line(s, [20, 140], [190, 140], { width: 3.4, cls: '' });
    for (let x = 24; x < 190; x += 12) line(s, [x, 140], [x - 8, 150], { width: 1.5, color: '#6f9a5a', cls: '' });
    line(s, B, [90, 14], { width: 5, cls: '' });
    path(s, 'M92 16L150 28L92 40Z', { fill: RED, stroke: '#7a1f16', width: 2, cls: '' });
    square(s, B, 0, 16);
  },
  protparts(host) {
    const P = staticProt(Geo.protractor(host, { width: 440, height: 300, r: 165, cx: 220, cy: 218, rot: 0, buttons: false, readout: false }));
    const s = P.svg, V = [220, 218], G = '#4b5263';
    const arrow = (from, to) => { line(s, from, to, { color: GREY, width: 2, cls: '' }); dot(s, to, { r: 3, color: GREY }); };
    txt(s, 120, 278, 'centre mark', { size: 17, color: G }); arrow([150, 266], [216, 222]);
    txt(s, 340, 278, 'base line (0 line)', { size: 17, color: G }); arrow([340, 265], [330, 220]);
    txt(s, 58, 22, 'outer scale:', { size: 17, color: G }); txt(s, 58, 42, '0 on the left', { size: 17, color: G }); arrow([62, 54], A(V, 176, 165 * 0.845));
    txt(s, 386, 22, 'inner scale:', { size: 17, color: G }); txt(s, 386, 42, '0 on the right', { size: 17, color: G }); arrow([380, 54], A(V, 6, 165 * 0.75));
  },
  ex6a: (host) => drawFig(host, { V: [40, 190], arm: 0, L: 225, nd: 50, nl: 185, names: ['A', 'B', 'C'], lab: '50°' }),
  ex6b: (host) => drawFig(host, { V: [190, 190], arm: 180, L: 165, nd: 45, nl: 110, names: ['D', 'E', 'F'], lab: '135°' }),
  ex6c: (host) => drawFig(host, { V: [112, 196], arm: 30, L: 170, nd: 120, nl: 140, names: ['G', 'H', 'I'] }),
  ex7b(host) {
    const s = figSvg(host, 300, 220), V = [82, 172];
    Geo.angle(s, { vertex: V, a1: 10, a2: 74, len: 160, reflex: true, r: 24, arcColor: INK });
  },
  ex7c(host) {
    const s = figSvg(host, 300, 220), V = [112, 150];
    line(s, V, A(V, 0, 175), { width: 3.2, cls: '' }); dot(s, V, { r: 4 });
    txt(s, V[0] - 34, V[1] + 34, 'vertex', { size: 15, color: '#6a7182' });
    const g = svgEl('g', { class: 'u5l3-fa' }, s);
    line(g, V, A(V, 110, 130), { width: 3.2, color: RED, cls: '' });
    path(g, arcD(V, 24, 110, 250), { stroke: RED, width: 2.6, cls: '' });
    txt(g, ...A(V, 170, 50), '250°', { size: 19, color: RED });
  },
  ex8(host) {
    const s = figSvg(host, 960, 200), sc = 64, offs = [0, 3, 6.8, 10.8], names = ['triangle', 'quadrilateral', 'pentagon', 'hexagon'];
    [3, 4, 5, 6].forEach((n, i) => {
      const pts = SHAPES[n].map(([x, y]) => [70 + (offs[i] + x) * sc, 160 - y * sc]);
      path(s, polyD(pts), { width: 3.2, fill: '#fbf6ec' });
      for (let k = 2; k <= n - 2; k++) line(s, pts[0], pts[k], { width: 2.4, dash: '8 6', color: BROWN, cls: '' });
      dot(s, pts[0], { r: 6, color: RED });
      txt(s, 70 + (offs[i] + (n === 3 ? 0.9 : n === 4 ? 1.1 : 1)) * sc, 188, names[i], { size: 18 });
    });
  },
  stop(host) {
    const s = figSvg(host, 220, 220), C = [110, 110];
    const oct = (r) => Array.from({ length: 8 }, (_, k) => A(C, 22.5 + 45 * k, r));
    path(s, polyD(oct(104)), { fill: '#d23a2e', stroke: '#7a1f16', width: 3, cls: '' });
    path(s, polyD(oct(92)), { stroke: '#fff', width: 3, cls: '' });
    txt(s, C[0], C[1], 'STOP', { size: 42, color: '#fff', halo: false, weight: 900 });
  },
  ex10a(host) {
    const s = figSvg(host, 440, 215), sc = 92, O = [30, 200], P = (x, y) => [O[0] + x * sc, O[1] - y * sc];
    path(s, polyD([P(0, 0), P(3.4, 0), P(4.08, 1.88), P(0.18, 2.02)]), { width: 3.2, fill: '#fbf6ec' });
    [[0.51, 0.47, '85°'], [3.05, 0.5, '110°'], [3.45, 1.46, '72°']].forEach(([x, y, t]) => txt(s, ...P(x, y), t, { size: 20 }));
    txt(s, ...P(0.62, 1.52), 'x', { size: 24, italic: true });
  },
  ex10b(host) {
    const s = figSvg(host, 440, 250), sc = 84, O = [94, 236], P = (x, y) => [O[0] + x * sc, O[1] - y * sc];
    path(s, polyD([P(0, 0), P(3, 0), P(3, 1.6), P(1.5, 2.65), P(0, 1.6)]), { width: 3.2, fill: '#f1e2c8' });
    square(s, P(0, 0), 0, 18); square(s, P(3, 0), 90, 18);
    svgEl('rect', { x: P(1.2, 1)[0], y: P(1.2, 1)[1], width: 0.6 * sc, height: sc, fill: '#fff', stroke: INK, 'stroke-width': 2.5 }, s);
    txt(s, ...P(0.45, 1.45), '125°', { size: 19 }); txt(s, ...P(2.55, 1.45), '125°', { size: 19 });
    txt(s, ...P(1.5, 2.22), 'x', { size: 24, italic: true });
  }
};
/** Example 6: the arm given, and the answer (hidden until the part's answer is shown) */
function drawFig(host, o) {
  const s = figSvg(host, 290, 220), V = o.V;
  line(s, V, A(V, o.arm, o.L), { width: 3.2, cls: '' }); dot(s, V, { r: 4.5 });
  txt(s, ...A(V, o.arm === 180 ? 300 : o.arm === 30 ? 255 : 245, 24), o.names[1], { size: 21 });
  txt(s, ...A(V, o.arm, o.L + 18), o.names[0], { size: 21 });
  const g = svgEl('g', { class: 'u5l3-fa' }, s);
  line(g, V, A(V, o.nd, o.nl), { width: 3.2, color: RED, cls: '' });
  Geo.angle(g, { vertex: V, a1: o.arm, a2: o.nd, arms: false, dot: false, label: o.lab || null, color: RED, size: 19, r: o.lab === '135°' ? 30 : 40 });
  txt(g, ...A(V, o.nd, o.nl + 18), o.names[2], { size: 21, color: RED });
}
/** Example 4: protractors to read, posed as in the booklet */
const EX4F = { ex4a: { rot: 0, a1: 0, a2: 62 }, ex4b: { rot: 0, a1: 180, a2: 35 }, ex4c: { rot: 40, a1: 40, a2: 148 }, ex4d: { rot: 110, a1: 290, a2: 255 } };
Object.entries(EX4F).forEach(([k, m]) => {
  FIG[k] = (host) => {
    const W = 440, H = 300, R = 132, L = 156, V = fitV([m.a1, m.a2], W, H, { len: L, R, rot: m.rot });
    staticProt(Geo.protractor(host, { width: W, height: H, r: R, cx: V[0], cy: V[1], rot: m.rot, angle: { vertex: V, a1: m.a1, a2: m.a2, len: L }, buttons: false, readout: false }));
  };
});
/** Example 5: angles to measure (full size in the booklet) */
const EX5F = { ex5a: { a1: 105, a2: 143, names: ['D', 'E', 'F'] }, ex5b: { a1: -20, a2: 107, names: ['G', 'H', 'I'] }, ex5c: { a1: 250, a2: 324, names: ['J', 'K', 'L'] } };
Object.entries(EX5F).forEach(([k, m]) => {
  FIG[k] = (host) => { const W = 300, H = 240, L = 150, V = fitV([m.a1, m.a2], W, H, { len: L, names: true }); Geo.angle(figSvg(host, W, H), { vertex: V, a1: m.a1, a2: m.a2, len: L, arc: false, names: m.names, size: 22 }); };
});
document.querySelectorAll('.u5l3-fig[data-fig]').forEach((host) => { const f = FIG[host.dataset.fig]; if (f) f(host); });

/* ======================================================================================
 * Stand Up Break
 * ====================================================================================== */
const POLY = { 5: 'pentagon', 6: 'hexagon', 7: 'heptagon', 8: 'octagon', 9: 'nonagon', 10: 'decagon', 12: 'dodecagon' };
standup('u5l3', {
  intro: 'Write every step, with the degree sign. Then check: does your answer make sense?',
  levels: {
    BEG: (r) => {
      let x; do { x = r.int(12, 176); } while (x === 90);
      return { text: `The smaller angle between two arms is <b>${x}°</b>. What type is it? Find the reflex angle.`, q: '', a: [`${x}^\\circ\\text{ is ${typeOf(x)}}`, `\\text{reflex}=360^\\circ-${x}^\\circ=${360 - x}^\\circ`] };
    },
    PRG: (r) => {
      const n = r.pick([5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 24]), S = (n - 2) * 180;
      return { text: `Find the sum of the interior angles of a polygon with <b>${n} sides</b>${POLY[n] ? ` (a ${POLY[n]})` : ''}.`, q: '', a: [`S=(${n}-2)\\times180^\\circ`, `=${n - 2}\\times180^\\circ`, `=${tn(S)}^\\circ`] };
    },
    MAS: (r) => r.pick([
      () => {
        const n = r.pick([4, 5]), S = (n - 2) * 180; let ks, x;
        do { ks = Array.from({ length: n - 1 }, () => r.int(n === 4 ? 55 : 80, n === 4 ? 140 : 150)); x = S - ks.reduce((a, b) => a + b, 0); } while (x < 45 || x > 170);
        return { text: `A ${n === 4 ? 'quadrilateral' : 'pentagon'} has angles <b>${ks.map((k) => k + '°').join(', ')}</b> and <b><i>x</i></b>. Find <i>x</i>.`, q: '', a: [`S=(${n}-2)\\times180^\\circ=${S}^\\circ`, `${ks.join('+')}=${ks.reduce((a, b) => a + b, 0)}^\\circ`, `x=${S}^\\circ-${ks.reduce((a, b) => a + b, 0)}^\\circ=${x}^\\circ`] };
      },
      () => {
        const n = r.pick([5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36]), S = (n - 2) * 180;
        return { text: `A <b>regular</b> polygon has <b>${n} sides</b>. How big is each of its angles?`, q: '', a: [`S=(${n}-2)\\times180^\\circ=${tn(S)}^\\circ`, `${tn(S)}^\\circ\\div${n}=${S / n}^\\circ`] };
      }
    ])()
  }
});
