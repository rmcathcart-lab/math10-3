// Checks js/geokit.js (Unit 5): the angle, bearing and pair-name checkers on right, wrong and badly formatted answers,
// the transversal numbering, and that every SVG builder renders over many random inputs.   node tests/geokit_test.js
var fs = require('fs'), path = require('path'), vm = require('vm');
var root = path.join(__dirname, '..');
var ctx = { console: console, Math: Math, JSON: JSON, Number: Number, String: String, Array: Array, Object: Object, isFinite: isFinite, RegExp: RegExp, Error: Error };
ctx.window = ctx; ctx.globalThis = ctx; vm.createContext(ctx);
['assets/katex/katex.min.js', 'js/core.js', 'js/expr.js', 'js/kit.js', 'js/kitx.js', 'js/geom.js', 'js/geokit.js'].forEach(function (f) { vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f }); });
var HW = ctx.HW, G = HW.geo, fails = 0, n = 0;
function T(name, chk, resp, want, code) { n++; var r = chk(resp); var okk = r.v === want && (!code || r.code === code); if (!okk) { fails++; console.log('FAIL', name, JSON.stringify(resp), '->', JSON.stringify(r), 'want', want, code || ''); } }
function eq(a, b, msg) { n++; if (JSON.stringify(a) !== JSON.stringify(b)) { fails++; console.log('FAIL', msg, '\n   got ', JSON.stringify(a), '\n   want', JSON.stringify(b)); } }

/* ---- angleChk ---- */
var a65 = G.angleChk(65);
['65', '65°', '65 °', '65^\\circ', '65^{\\circ}', '65\\degree', '65 degrees', '65deg', 'x = 65', '\\angle ABC=65°', '65.0', ' 65 '].forEach(function (s) { T('angle ok ' + s, a65, s, 'correct'); });
T('angle other scale', a65, '115', 'wrong', 'geo-other-scale'); T('angle other scale °', a65, '115°', 'wrong', 'geo-other-scale');
T('angle reflex given', a65, '295', 'wrong', 'geo-reflex-big'); T('angle wrong', a65, '60', 'wrong', 'value'); T('angle empty', a65, '', 'form', 'empty');
T('angle words', a65, 'sixty', 'form', 'notnumber'); T('angle comma', G.angleChk(22.5), '22,5', 'form', 'geo-comma'); T('angle decimal', G.angleChk(22.5), '22.5°', 'correct');
T('angle negative', a65, '-65', 'wrong');
var tol = G.angleChk(42, { tol: 2 }); T('tol low', tol, '40', 'correct'); T('tol high', tol, '44°', 'correct'); T('tol out', tol, '45', 'wrong'); T('tol other scale', tol, '139', 'wrong', 'geo-other-scale');
var r90 = G.angleChk(90); T('right ok', r90, '90', 'correct'); T('right no trap', r90, '89', 'wrong', 'value');
var near90 = G.angleChk(89, { tol: 2 }); T('near 90 no trap', near90, '91', 'correct');
var refl = G.angleChk(250, { reflex: true }); T('reflex ok', refl, '250°', 'correct'); T('reflex small', refl, '110', 'wrong', 'geo-reflex-small');
var sup = G.angleChk(70, { supplementTrap: 'Corresponding angles are equal, not supplementary.' }); T('custom trap', sup, '110', 'wrong', 'geo-supplement');
var noTrap = G.angleChk(70, { supplementTrap: false }); T('no trap', noTrap, '110', 'wrong', 'value');
var alts = G.angleChk(35, { alts: [{ v: 55, code: 'comp-x', hint: 'that is its complement' }] }); T('alts', alts, '55', 'wrong', 'comp-x');

/* ---- bearingChk ---- */
var b45 = G.bearingChk(45);
['045', '045°', '045 °', '045^\\circ', '045°T', '045 T', 'bearing 045', '045.0'].forEach(function (s) { T('bearing ok ' + s, b45, s, 'correct'); });
T('bearing 2 digits', b45, '45', 'form', 'geo-bearing-3digit'); T('bearing 2 digits °', b45, '45°', 'form', 'geo-bearing-3digit');
T('bearing quadrant', b45, 'N45E', 'form', 'geo-bearing-quadrant'); T('bearing quadrant spaced', b45, 'N 45° E', 'form', 'geo-bearing-quadrant'); T('bearing word', b45, 'NE', 'form', 'geo-bearing-word'); T('bearing word long', b45, 'north-east', 'form', 'geo-bearing-word');
T('bearing ccw', b45, '315', 'wrong', 'geo-bearing-ccw'); T('bearing wrong', b45, '050', 'wrong', 'value'); T('bearing empty', b45, '', 'form', 'empty');
var b230 = G.bearingChk(230); T('230 ok', b230, '230', 'correct'); T('230 ccw', b230, '130', 'wrong', 'geo-bearing-ccw'); T('230 acute', b230, '50', 'wrong', 'geo-bearing-acute'); T('230 east', b230, '220', 'wrong', 'geo-bearing-east'); T('230 from S line', b230, '050', 'wrong', 'geo-bearing-acute'); T('300 reverse', G.bearingChk(300), '120', 'wrong', 'geo-bearing-reverse'); T('150 acute', G.bearingChk(150), '030', 'wrong', 'geo-bearing-acute'); T('300 ccw', G.bearingChk(300), '060', 'wrong', 'geo-bearing-ccw');
T('bearing range', b230, '400', 'wrong', 'geo-bearing-range');
var b0 = G.bearingChk(0); T('north ok', b0, '000', 'correct'); T('north 360', b0, '360', 'form', 'geo-bearing-360'); T('north 0', b0, '0', 'form', 'geo-bearing-3digit');
var b225 = G.bearingChk(22.5); T('022.5 ok', b225, '022.5', 'correct'); T('22.5 nudge', b225, '22.5', 'form', 'geo-bearing-3digit');
var loose = G.bearingChk(45, { strict3: false }); T('loose 45', loose, '45', 'correct');
var back1 = G.bearingChk(50, { back: 230 }); T('back ok', back1, '050', 'correct'); T('back added', back1, '410', 'wrong', 'geo-back-add'); T('back same', back1, '230', 'wrong', 'geo-back-same');
var back2 = G.bearingChk(300, { back: 120 }); T('back2 ok', back2, '300', 'correct'); T('back subtracted', back2, '-60', 'wrong', 'geo-back-sub'); T('back2 same', back2, '120', 'wrong', 'geo-back-same');
var btol = G.bearingChk(358, { tol: 3 }); T('tol wrap', btol, '001', 'correct');

/* ---- pair names ---- */
var good = {
  corresponding: ['corresponding', 'Corresponding angles', 'corresponding (F)', 'coresponding', 'corrisponding angles', 'they are corresponding', 'corr'],
  'alt-int': ['alternate interior', 'Alternate Interior Angles', 'alt int', 'alternate-interior', 'alternat interier', 'alt. interior angles', 'alternating interior'],
  'alt-ext': ['alternate exterior', 'alt ext', 'alternate exterior angles', 'alternate outside'],
  'int-same': ['interior angles on the same side of the transversal', 'co-interior', 'cointerior', 'same-side interior', 'same side interior angles', 'consecutive interior', 'interior same side', 'interior on the same side', 'allied angles interior'],
  'ext-same': ['exterior angles on the same side of the transversal', 'same-side exterior', 'co-exterior', 'consecutive exterior', 'exterior on same side'],
  'vert-opp': ['vertically opposite', 'vertical angles', 'opposite angles', 'vertically opposite angles', 'verticaly oposite']
};
Object.keys(good).forEach(function (id) { var chk = G.pairChk(id); good[id].forEach(function (s) { T('pair ' + id + ' ' + s, chk, s, 'correct'); T('pair array ' + s, chk, [s], 'correct'); }); });
var pc = G.pairChk('alt-int');
T('pair alt only', pc, 'alternate', 'form', 'geo-pair-alt'); T('pair interior only', pc, 'interior', 'form', 'geo-pair-int'); T('pair letter', pc, 'Z', 'form', 'geo-pair-letter'); T('pair letter angles', pc, 'Z angles', 'form', 'geo-pair-letter');
T('pair gibberish', pc, 'banana', 'form', 'geo-pair-unknown'); T('pair empty', pc, '', 'form', 'empty');
T('pair wrong ext', pc, 'alternate exterior', 'wrong', 'geo-pair-alt-ext'); T('pair wrong corr', pc, 'corresponding', 'wrong', 'geo-pair-corresponding'); T('pair wrong same', pc, 'co-interior', 'wrong', 'geo-pair-int-same');
T('pair supplementary', G.pairChk('int-same'), 'supplementary', 'wrong', 'geo-pair-linear'); T('pair accept', G.pairChk('int-same', { accept: ['linear'] }), 'supplementary', 'correct');
eq(!!pc('alternate exterior').hint, true, 'pair wrong has hint'); eq(!!G.pairChk('corresponding')('alternate interior').hint, true, 'corr hint');

/* ---- numbering: the pairs and their geometry (parallel: equal or supplementary; not parallel: off by the skew) ---- */
eq(G.pairName(1, 5), 'corresponding', 'pair 1 5'); eq(G.pairName(6, 4), 'alt-int', 'pair 4 6'); eq(G.pairName(3, 5), 'alt-int', 'pair 3 5'); eq(G.pairName(2, 8), 'alt-ext', 'pair 2 8');
eq(G.pairName(4, 5), 'int-same', 'pair 4 5'); eq(G.pairName(7, 2), 'ext-same', 'pair 2 7'); eq(G.pairName(1, 3), 'vert-opp', 'pair 1 3'); eq(G.pairName(1, 6), null, 'pair 1 6');
for (var tilt = 20; tilt <= 160; tilt += 7) {
  var g = G.transversalGeom({ tilt: tilt }), m = function (k) { return g.measure(k); };
  eq([m(2), Math.round((m(1) + m(2)) * 10) / 10], [tilt, 180], 'angle 2 = tilt ' + tilt);
  ['corresponding', 'alt-int', 'alt-ext', 'vert-opp'].forEach(function (k) { G.PAIRS[k].forEach(function (p) { eq(m(p[0]), m(p[1]), k + ' equal ' + p + ' tilt ' + tilt); }); });
  ['int-same', 'ext-same', 'linear'].forEach(function (k) { G.PAIRS[k].forEach(function (p) { eq(Math.round((m(p[0]) + m(p[1])) * 10) / 10, 180, k + ' sum ' + p + ' tilt ' + tilt); }); });
  var gn = G.transversalGeom({ tilt: tilt, parallel: false, skew: 12 });
  if (tilt > 30) eq(Math.round((gn.measure(2) - gn.measure(6)) * 10) / 10, 12, 'not parallel: 2 − 6 = skew, tilt ' + tilt);
}
// the corners really are where the numbers say: 1 upper-left, 2 upper-right, 3 lower-right, 4 lower-left (screen y down)
var gg = G.transversalGeom({ tilt: 60 }), mid = function (k) { var c = gg.corner(k), d = (c.start + c.span / 2) * Math.PI / 180; return [Math.sign(Math.round(Math.cos(d) * 100)), Math.sign(Math.round(-Math.sin(d) * 100))]; };
eq([mid(1), mid(2), mid(3), mid(4), mid(5), mid(6), mid(7), mid(8)], [[-1, -1], [1, -1], [1, 1], [-1, 1], [-1, -1], [1, -1], [1, 1], [-1, 1]], 'corner positions');
eq(G.angleChk(gg.measure(5))(String(gg.measure(1))).v, 'correct', 'parallel: angle 5 = angle 1 (corresponding)');

/* ---- part builders ---- */
var r = HW.rng(7);
var pa = G.P.angle('Measure ∠ABC.', 65, { tol: 1 }); eq([pa.check(pa.key).v, pa.input.after, pa.check('115').code], ['correct', '°', 'geo-other-scale'], 'P.angle');
var pb = G.P.bearing('Bearing?', 45); eq([pb.key, pb.check(pb.key).v, pb.check('45').v], ['045', 'correct', 'form'], 'P.bearing');
var pp = G.P.pair('Name the pair.', 'int-same'); eq([pp.input.type, pp.check(pp.key).v, pp.check(['co-interior']).v], ['fields', 'correct', 'correct'], 'P.pair');
var pm = G.P.pairMC(r, 'Which pair?', 'alt-ext'); eq([pm.input.type, pm.input.options.length, pm.check(pm.key).v], ['mc', 5, 'correct'], 'P.pairMC');
['corresponding', 'alt-int', 'alt-ext', 'int-same', 'ext-same', 'vert-opp'].forEach(function (tg) { for (var i = 0; i < 20; i++) { var q = G.P.pairMC(HW.rng('pm' + tg + i), 'Which pair?', tg); eq([q.input.options.length, q.check(q.key).v], [5, 'correct'], 'P.pairMC answer kept: ' + tg); } });
var wrongKey = pm.input.options.filter(function (o) { return !o.right; })[0].key; eq([pm.check(wrongKey).v, !!pm.check(wrongKey).hint], ['wrong', true], 'P.pairMC wrong has hint');
['acute', 'right', 'obtuse', 'straight', 'reflex'].forEach(function (k, i) { var deg = [40, 90, 120, 180, 250][i], pcl = G.P.classify(r, 'Classify.', deg); var right = pcl.input.options.filter(function (o) { return o.right; })[0]; eq([right.html, pcl.check(pcl.key).v], [k, 'correct'], 'classify ' + deg); });

/* ---- SVG builders over many random inputs: no throw, no NaN/undefined, sane viewBox ---- */
function svgOk(s, msg) {
  n++;
  var bad = typeof s !== 'string' || !/^<svg class="fig-svg" viewBox="-?[\d.]+ -?[\d.]+ [\d.]+ [\d.]+"/.test(s) || /NaN|undefined|Infinity|null/.test(s) || (s.match(/<svg/g) || []).length !== 1 || !/<\/svg>$/.test(s);
  var vb = /viewBox="(-?[\d.]+) (-?[\d.]+) ([\d.]+) ([\d.]+)"/.exec(s || '');
  if (vb && (+vb[3] < 30 || +vb[4] < 30 || +vb[3] > 2000 || +vb[4] > 2000)) bad = true;
  if (bad) { fails++; console.log('FAIL svg', msg, String(s).slice(0, 300)); }
}
var rnd = HW.rng(12345), labels = ['x', '?', '(2x + 10)°', 'y', 70, 118.5, ''];
for (var i = 0; i < 400; i++) {
  var ang = rnd.int(1, 179), rot = rnd.int(0, 359), sc = rnd.pick(['inner', 'outer', 'none']);
  try {
    svgOk(G.protractorSVG({ angle: ang, rot: rot, scale: sc, offset: rnd.int(0, 179 - ang), names: rnd.int(0, 1) ? ['A', 'B', 'C'] : null, highlight: rnd.pick([null, 'inner', 'outer']) }), 'protractor ' + [ang, rot, sc]);
    svgOk(G.angleSVG({ a1: rot, a2: rot + rnd.int(1, 359), reflex: !!rnd.int(0, 1), label: rnd.pick([true, 'x', null, '?']), names: ['P', 'Q', 'R'], fill: !!rnd.int(0, 1) }), 'angle ' + rot);
    var rays = []; for (var k = rnd.int(1, 5); k > 0; k--) rays.push({ dir: rnd.int(0, 359), name: rnd.pick(['A', 'B', null]) });
    svgOk(G.angleSVG({ rays: rays, arcs: rays.length > 1 ? [{ a: rays[0].dir, b: rays[1].dir, label: 'a' }] : [], vertexName: 'O' }), 'rays');
    var A = {}; for (var j = 1; j <= 8; j++) if (rnd.int(0, 2) === 0) A[j] = rnd.pick(labels);
    svgOk(G.transversalSVG({ parallel: !!rnd.int(0, 3), tilt: rnd.pick([undefined, rnd.int(15, 165)]), skew: rnd.int(-20, 20), angles: A, highlight: rnd.int(0, 1) ? [1, 5] : null, numbers: !!rnd.int(0, 2), marks: rnd.int(0, 2) }), 'transversal ' + JSON.stringify(A));
    svgOk(G.compassSVG({ origin: 'A', points: [{ name: 'B', bearing: rnd.int(0, 359), dist: rnd.int(40, 140) }, { name: 'C', bearing: rnd.int(0, 359), dist: rnd.int(40, 140), from: 'B' }], bearings: [{ deg: rnd.int(0, 359), label: true, arc: !!rnd.int(0, 1) }], arcs: [{ from: 0, to: rnd.int(1, 359), label: true }], northAt: ['B'] }), 'compass');
    var nn = rnd.int(3, 10), labs = []; for (var q = 0; q < nn; q++) labs.push(rnd.pick(['x', 108, '', 90, null]));
    svgOk(G.polygonSVG({ n: nn, angles: labs, names: 'ABCDEFGHIJ'.split('').slice(0, nn), diagonals: !!rnd.int(0, 1), shade: !!rnd.int(0, 1) }), 'polygon ' + nn);
  } catch (e) { fails++; n++; console.log('FAIL throws', i, e && e.stack); break; }
}
svgOk(G.polygonSVG({ pts: [[0, 0], [4, 0], [5, 3], [2, 5], [-1, 3]], angles: [100, 'x', 120, '', 95], sides: ['a', 'b'] }), 'polygon pts');

console.log(n + ' checks, ' + fails + ' failed');
process.exit(fails ? 1 : 0);
