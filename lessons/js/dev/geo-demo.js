/* Demo + test bed for js/geo.js (lessons/dev/geo.html): every piece statically and inside explainers (Unit 5, then Units 6–7). */
import { mountExplainers, svgEl } from '../blocks.js';
import { Geo } from '../geo.js';

/* ================= static ================= */
function statics() {
  const pt = Geo.protractor(document.getElementById('demo-pt'), { width: 900, height: 430, r: 210, cx: 300, angle: { vertex: [560, 270], a1: 15, a2: 128, names: ['A', 'B', 'C'] } });

  const host = document.getElementById('demo-angles');
  const svg = svgEl('svg', { class: 'geo-svg', width: 980, height: 250, viewBox: '0 0 980 250' }, host);
  Geo.angle(svg, { vertex: [40, 200], a1: 0, a2: 40, len: 140, label: true, fill: 'blue' });
  Geo.angle(svg, { vertex: [230, 200], a1: 0, a2: 90, len: 130, label: true });
  Geo.angle(svg, { vertex: [430, 200], a1: 0, a2: 130, len: 110, label: true, names: ['A', 'B', 'C'] });
  Geo.angle(svg, { vertex: [710, 200], a1: 0, a2: 180, len: 85, label: true });
  Geo.angle(svg, { vertex: [895, 130], a1: 20, a2: 130, len: 90, label: true, reflex: true });

  const tv = document.getElementById('demo-tv');
  Geo.transversal(tv, { w: 320, h: 240, size: 18 });
  Geo.transversal(tv, { w: 320, h: 240, angles: { 1: 118, 6: 'x' }, numbers: false });
  Geo.transversal(tv, { w: 320, h: 240, parallel: false, tilt: 70, highlight: [3, 5], highlightOpts: { name: false } });

  const rose = document.getElementById('demo-rose');
  Geo.compassRose(rose, { width: 380, height: 380, points: 16, bearing: 230 });
  Geo.compassRose(rose, { width: 380, height: 380, degrees: true, bearing: 22.5, color: 'blue' });

  const out = document.getElementById('demo-tan-out');
  const tan = Geo.tangram(document.getElementById('demo-tan'), { width: 900, height: 400, unit: 60, labels: 'area',
    onChange: (s) => { out.textContent = 'state: ' + s.pieces.map((p) => `${p.id} ${p.rot}°${p.flip ? ' flipped' : ''}`).join(' · '); } });
  const pout = document.getElementById('demo-pen-out');
  const pen = Geo.pentomino(document.getElementById('demo-pen'), { width: 900, height: 330, cell: 44, letters: 'IPP', board: { cols: 5, rows: 3, at: [11, 2] },
    onChange: (s) => { const e = s.extra; pout.textContent = e ? `${e.covered} of ${e.cells} squares covered${e.filled ? ' — filled!' : ''}` : ''; } });
  Geo.pentomino(document.getElementById('demo-pen12'), { width: 900, height: 470, cell: 38 });
  window.geoDemo = { pt, tan, pen };   // for the dev tests
}

/* ================= explainers ================= */
const PAIR_KEYS = ['corresponding', 'alt-int', 'alt-ext', 'int-same', 'ext-same', 'vert-opp'];
const pairs = {
  title: 'Name the angle pairs',
  height: 400,
  choices: PAIR_KEYS.map((k) => ({ v: k, label: Geo.PAIR_NAMES[k].replace(' of the transversal', '').replace(' angles', '') })),
  make(stage, k, ex) {
    const T = Geo.transversal(stage, { x: (ex.W - 640) / 2, y: 10, w: 640, h: 380, size: 22 });
    const [p1, p2] = Geo.PAIRS[k];
    return [
      { cap: `<b>${Geo.PAIR_NAMES[k]}</b>: angles <b>${p1[0]}</b> and <b>${p1[1]}</b>.`, run: (c) => T.highlight(c, p1) },
      { cap: `Another pair: angles <b>${p2[0]}</b> and <b>${p2[1]}</b>.`, run: async (c) => { T.clearHighlight(); await T.highlight(c, p2); } }
    ];
  }
};
const slide = {
  title: 'Slide the top crossing down the transversal',
  height: 400,
  choices: [{ v: 1, label: 'parallel lines' }, { v: 0, label: 'not parallel' }],
  make(stage, par, ex) {
    const T = Geo.transversal(stage, { x: (ex.W - 640) / 2, y: 10, w: 640, h: 380, parallel: !!par, tilt: 62, skew: 16, numbers: false });
    const m2 = T.measure(2), m6 = T.measure(6);
    return [
      { cap: `Angle 2 measures <b>${m2}°</b>.`, run: async (c) => { T.setLabel(2, m2 + '°'); } },
      { cap: 'Slide a copy of angle 2 down the transversal to the bottom crossing…', run: (c) => T.slide(c, 2) },
      { cap: par ? `It fits angle 6 exactly: <b>corresponding angles are equal</b> when the lines are parallel.` : `Angle 6 is <b>${m6}°</b>: the copy does <b>not</b> fit. The rule only works for <b>parallel</b> lines.`, run: async (c) => { T.setLabel(6, m6 + '°'); } }
    ];
  }
};
const bearing = {
  title: 'True bearings: clockwise from north',
  height: 430,
  choices: [45, 130, 230, 300, 22.5].map((b) => ({ v: b, label: Geo.bearingText(b) + '°' })),
  make(stage, b, ex) {
    const R = Geo.compassRose(stage, { x: (ex.W - 420) / 2, y: 0, width: 420, height: 430, points: 8 });
    const back = (b + 180) % 360;
    return [
      { cap: 'Start facing <b>north</b> and turn <b>clockwise</b>…', run: (c) => R.turn(c, b) },
      { cap: `The true bearing is <b>${Geo.bearingText(b)}°</b> (always 3 digits).`, run: async () => {} },
      { cap: `The way back: ${b < 180 ? `add 180°: ${Geo.bearingText(b)}° + 180° =` : `subtract 180°: ${Geo.bearingText(b)}° − 180° =`} <b>${Geo.bearingText(back)}°</b>.`, run: (c) => R.back(c) }
    ];
  }
};
const MEAS = { a: { a1: 25, a2: 95, v: 70 }, b: { a1: 160, a2: 35, v: 125 }, c: { a1: 245, a2: 340, v: 95 } };
const measure = {
  title: 'Measure with a protractor: 3 steps',
  height: 500, tap: false,
  choices: Object.keys(MEAS).map((k) => ({ v: k, label: MEAS[k].v + '° angle' })),
  make(stage, k, ex) {
    const m = MEAS[k], P = Geo.protractor(stage, { x: (ex.W - 760) / 2, y: 0, width: 760, height: 400, r: 190, cx: 170, rot: 0, angle: { vertex: [470, 210], a1: m.a1, a2: m.a2 }, buttons: false, hidden: true });
    const pose = P.alignTo(0);
    return [
      { cap: '<b>1.</b> Put the <b>centre mark</b> on the vertex.', run: (c) => P.moveTo(c, { cx: pose.cx, cy: pose.cy }) },
      { cap: '<b>2.</b> Turn it so the <b>0 line</b> lies along one arm.', run: (c) => P.moveTo(c, { rot: pose.rot }) },
      { cap: '<b>3.</b> Use the scale that has <b>0 on that arm</b>.', run: async () => { P.showScale('auto'); } },
      { cap: `Count up from 0 to the other arm: <b>${m.v}°</b>. Check: ${m.v < 90 ? 'acute, less than 90° ✓' : 'obtuse, more than 90° ✓'}`, run: async () => { P.hide(false); } }
    ];
  }
};
const CON = {
  bisect: { label: 'bisect an angle', steps: () => Geo.construct.bisect({ vertex: [330, 330], a1: 10, a2: 74, len: 300 }) },
  copy: { label: 'copy an angle', steps: () => Geo.construct.copy({ from: { vertex: [80, 300], a1: 0, a2: 52, len: 230 }, to: { vertex: [560, 300], dir: 0, len: 260 } }) },
  pb: { label: 'perpendicular bisector', steps: () => Geo.construct.perpBisector({ a: [300, 200], b: [620, 200] }) },
  pat: { label: 'perpendicular at a point', steps: () => Geo.construct.perpAt({ a: [180, 320], b: [780, 320], p: [470, 320] }) },
  pfrom: { label: 'perpendicular from a point', steps: () => Geo.construct.perpFrom({ a: [180, 230], b: [780, 230], p: [520, 70] }) }
};
const construct = {
  title: 'Compass and straightedge',
  height: 400,
  choices: Object.keys(CON).map((k) => ({ v: k, label: CON[k].label })),
  make(stage, k, ex) {
    const K = Geo.construct(stage, CON[k].steps(), { x: (ex.W - 940) / 2, y: 0, width: 940, height: 400 });
    return K.steps;
  }
};

/* ================= Units 6–7 ================= */
function statics67() {
  const sim = document.getElementById('demo-sim');
  const s1 = Geo.similar(sim, { width: 520, height: 300, shape: 'trap', k: 1.5, names: ['ABCD', 'PQRS'], units: 'cm', ratios: true });
  const s2 = Geo.similar(sim, { width: 400, height: 300, shape: 'tri', k: 2, mode: 'centre', names: ['ABC', 'A′B′C′'], labels: false, angles: true });
  const gd = Geo.gridDraw(document.getElementById('demo-gd'), { cols: 22, rows: 10, cell: 34, shape: 'L', k: 2, names: ['ABCDEF'] });
  const bars = document.getElementById('demo-bars');
  Geo.scaleBar(bars, { scale: '1 cm : 2 m' }); Geo.scaleBar(bars, { scale: '1:50 000', segments: 3 }); Geo.scaleBar(bars, { scale: { draw: 2, real: 5, units: 'km' }, segments: 3 });
  const tape = Geo.mapTape(document.getElementById('demo-tape'), { width: 900, height: 360, scale: '1 cm : 5 km', a: [140, 250], b: [520, 120],
    places: [{ name: 'Calgary', at: [140, 250] }, { name: 'Airdrie', at: [300, 140] }, { name: 'Cochrane', at: [520, 120], dy: 22 }, { name: 'Okotoks', at: [260, 330], dy: -18 }],
    map: (g) => { svgEl('path', { d: 'M40 300C200 260 300 200 420 190S700 120 880 160', stroke: '#7fb3f0', 'stroke-width': 7, fill: 'none', opacity: 0.6 }, g); svgEl('path', { d: 'M140 250L300 140L520 120M140 250L260 330', stroke: '#c9b48a', 'stroke-width': 5, fill: 'none' }, g); } });
  const rt = document.getElementById('demo-rt');
  const r1 = Geo.rightTri(rt, { width: 330, height: 260, a: 3, b: 4, theta: 'A', sides: { a: '3', b: '4', c: '?' } });
  const r2 = Geo.rightTri(rt, { width: 330, height: 260, a: 5, c: 13, right: 'bl', theta: 'B', thetaLabel: '35°', long: true, sides: { c: '13 m', a: 'x' } });
  const r3 = Geo.rightTri(rt, { width: 340, height: 340, a: 3, b: 4, squares: 'grid', names: false, sides: true, size: 16 });
  const srt = Geo.similarRights(document.getElementById('demo-srt'), { width: 900, height: 300, theta: 35, sizes: [3, 5, 7], reveal: ['opp/adj', 'opp/hyp', 'adj/hyp'] });
  const ev = document.getElementById('demo-elev');
  Geo.elevation(ev, { width: 440, height: 300, angle: 38, dist: 25, eye: 1.6, target: 'tree', labels: { height: 'h' } });
  Geo.elevation(ev, { width: 440, height: 300, kind: 'depression', observer: 'lighthouse', angle: 12, dist: 180, eye: 0, alt: true, labels: { dist: 'x', height: '38 m' } });
  const cl = document.getElementById('demo-clino');
  const c1 = Geo.clinometer(cl, { width: 470, height: 340, angle: 30 }), c2 = Geo.clinometer(cl, { width: 470, height: 340, angle: -20, scale: 'direct' });
  Object.assign(window.geoDemo, { s1, s2, gd, tape, r1, r2, r3, srt, c1, c2 });
}
const SIMK = { 2: { shape: 'rect', k: 2 }, 0.5: { shape: 'house', k: 0.5 }, 1.5: { shape: 'pent', k: 1.5 } };
const similarEx = {
  title: 'Enlarge or reduce: every side × k', height: 420,
  choices: Object.keys(SIMK).map((k) => ({ v: k, label: 'k = ' + k })),
  make(stage, k, ex) {
    const d = SIMK[k], S = Geo.similar(stage, { x: (ex.W - 860) / 2, y: 0, width: 860, height: 330, shape: d.shape, k: d.k, units: 'cm', image: false });
    return [
      { cap: 'The original shape.', run: async () => { S.hideRatios(); } },
      { cap: `Multiply every side by <b>k = ${k}</b>: ${d.k > 1 ? 'an <b>enlargement</b>' : 'a <b>reduction</b>'}. Matching sides have the same colour.`, run: (c) => S.grow(c) },
      { cap: 'Check: new ÷ original is the same for every pair of sides.', run: (c) => S.showRatios(c) }
    ];
  }
};
const roles = {
  title: 'Opposite, adjacent, hypotenuse: it depends on θ', height: 380,
  make(stage, v, ex) {
    const T = Geo.rightTri(stage, { x: (ex.W - 560) / 2, y: 0, width: 560, height: 380, a: 5, b: 8, sides: { a: '5', b: '8', c: '9.4' }, long: true });
    return [
      { cap: 'A right triangle. The <b>hypotenuse</b> is across from the right angle (always the longest side).', run: (c) => T.setTheta(c, 'A') },
      { cap: 'Move θ to the other acute angle: <b>opposite</b> and <b>adjacent</b> swap. The hypotenuse stays.', run: (c) => T.setTheta(c, 'B') },
      { cap: 'Back to A.', run: (c) => T.setTheta(c, 'A') },
      { cap: 'The opposite side is across from θ.', run: (c) => T.highlight(c, 'opp') }
    ];
  }
};
const pythag = {
  title: 'Why a² + b² = c²', height: 420,
  choices: [{ v: '3,4', label: '3, 4, 5' }, { v: '5,12', label: '5, 12, 13' }, { v: '2,5', label: '2, 5, ?' }],
  make(stage, v, ex) {
    const [a, b] = v.split(',').map(Number);
    const T = Geo.rightTri(stage, { x: 10, y: 0, width: 400, height: 420, a, b, names: false, sides: true, size: 16, roomForSquares: true });
    const P = Geo.pythagProof(stage, { x: 420, y: 40, width: ex.W - 430, height: 340, a, b });
    return [
      { cap: 'Build a square on each side.', run: (c) => T.showSquares(c, 'grid') },
      { cap: `Count: ${a * a} + ${b * b} = ${a * a + b * b}. The two small squares fill the big one.`, run: async () => {} },
      { cap: 'Proof without counting: slide the four triangles in the same big square.', run: (c) => P.play(c) }
    ];
  }
};
const discover = {
  title: 'Same angle, same ratio', height: 470,
  choices: [{ v: 'opp/adj', label: 'opp ÷ adj' }, { v: 'opp/hyp', label: 'opp ÷ hyp' }, { v: 'adj/hyp', label: 'adj ÷ hyp' }],
  make(stage, key, ex) {
    const R = Geo.similarRights(stage, { x: (ex.W - 760) / 2, y: 0, width: 760, height: 270, theta: 35, sizes: [3, 5, 7], ratios: [key], slider: false, calc: true });
    const nm = { 'opp/adj': 'tangent', 'opp/hyp': 'sine', 'adj/hyp': 'cosine' }[key];
    return [
      { cap: 'Three right triangles with the same angle θ = 35°.', run: (c) => R.grow(c) },
      { cap: `Work out ${key.replace('/', ' ÷ ')} for each one…`, run: (c) => R.highlightCol(c, key) },
      { cap: `It's the same every time! That ratio is the <b>${nm}</b> of θ.`, run: (c) => R.name(c, key) }
    ];
  }
};
const elev = {
  title: 'Elevation and depression', height: 400,
  choices: [{ v: 'e', label: 'elevation (tree)' }, { v: 'd', label: 'depression (cliff)' }],
  make(stage, v, ex) {
    const E = v === 'e' ? Geo.elevation(stage, { x: (ex.W - 760) / 2, y: 0, width: 760, height: 400, angle: 32, dist: 30, eye: 1.6, target: 'building', labels: { height: 'h' } })
      : Geo.elevation(stage, { x: (ex.W - 760) / 2, y: 0, width: 760, height: 400, kind: 'depression', angle: 25, dist: 90, eye: 1.6, labels: { dist: 'd' } });
    return [
      { cap: 'Start with the <b>horizontal</b> line at eye level, then the line of sight.', run: (c) => E.drawIn(c) },
      v === 'e' ? { cap: 'Steeper sight line → bigger angle → taller object.', run: (c) => E.setAngle(c, 45) }
        : { cap: 'From the boat, the angle of <b>elevation</b> is the same (alternate interior angles).', run: (c) => E.showAlt(c) }
    ];
  }
};
const shadowEx = {
  title: 'Shadows: parallel sun rays', height: 380,
  make(stage, v, ex) {
    const S = Geo.shadow(stage, { x: (ex.W - 820) / 2, y: 0, width: 820, height: 370, small: { h: 1.8, shadow: 2.4 }, big: { shadow: 18, kind: 'tower', label: { h: 'h' } }, sunLabel: 'θ' });
    return [{ cap: 'At the same time of day the sun rays are parallel, so the two triangles are similar.', run: (c) => S.play(c) }];
  }
};
const mirrorEx = {
  title: 'The mirror method', height: 380,
  make(stage, v, ex) {
    const M = Geo.mirror(stage, { x: (ex.W - 820) / 2, y: 0, width: 820, height: 370, eye: 1.6, d1: 2.1, d2: 12.5, kind: 'flag', labels: { h: 'h' }, angleLabel: '' });
    return [{ cap: 'Light from the top bounces off the mirror into the eye. Angle in = angle out: similar triangles.', run: (c) => M.play(c) }];
  }
};

statics();
statics67();
mountExplainers({ pairs, slide, bearing, measure, construct, similar: similarEx, roles, pythag, discover, elev, shadow: shadowEx, mirror: mirrorEx });
