/* Demo + test bed for js/geo.js (lessons/dev/geo.html): every piece statically and inside explainers. */
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

statics();
mountExplainers({ pairs, slide, bearing, measure, construct });
