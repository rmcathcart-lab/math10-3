// Checks js/geokit.js: Unit 5 (the angle, bearing and pair-name checkers on right, wrong and badly formatted answers, the
// transversal numbering) and Units 6–7 (lenChk / angleRatioChk / kChk with their traps over many random set-ups, the part
// builders, parseScale), and that every SVG builder renders over many random inputs.   node tests/geokit_test.js
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

/* ======================== Units 6–7 ======================== */
var RADF = Math.PI / 180, R1 = function (v, dp) { var p = Math.pow(10, dp == null ? 1 : dp); return Math.round(v * p + 1e-9) / p; };
var TRF = { sin: function (d) { return Math.sin(d * RADF); }, cos: function (d) { return Math.cos(d * RADF); }, tan: function (d) { return Math.tan(d * RADF); } };
/* a trap is only testable when its rounded value is unique among the answer and the other traps */
function uniq(vals, i, dp) { var r = R1(vals[i], dp); for (var j = 0; j < vals.length; j++) if (j !== i && isFinite(vals[j]) && Math.abs(R1(vals[j], dp) - r) < 1e-9) return false; return isFinite(vals[i]); }
function fmt1(v, dp) { return R1(v, dp).toFixed(dp == null ? 1 : dp); }
function code(chk, resp) { return chk(resp).code || chk(resp).v; }

/* ---- lenChk: trig set-ups ---- */
var rt = HW.rng(2026), seenTrap = {};
for (var i6 = 0; i6 < 600; i6++) {
  var fn = rt.pick(['sin', 'cos', 'tan']), deg = rt.int(8, 82), side = rt.int(2, 60) + rt.pick([0, 0.5, 0.3]), op = rt.pick(['mul', 'div']);
  var spec = { fn: fn, deg: deg, side: side, op: op }, want = op === 'mul' ? side * TRF[fn](deg) : side / TRF[fn](deg);
  var lc = G.lenChk(want, { trig: spec, unit: 'cm' });
  T('len ok ' + JSON.stringify(spec), lc, fmt1(want), 'correct'); T('len x= ' + i6, lc, 'x = ' + fmt1(want), 'correct');
  var w3 = R1(want, 3); if (Math.abs(w3 - R1(want)) > 1e-9 && Math.abs(R1(w3) - R1(want)) < 1e-9) T('len round ' + i6, lc, w3.toFixed(3), 'form', 'round');
  var radV = op === 'mul' ? side * Math[fn](deg) : side / Math[fn](deg), md = op === 'mul' ? side / TRF[fn](deg) : side * TRF[fn](deg);
  var others = ['sin', 'cos', 'tan'].filter(function (g) { return g !== fn; }).map(function (g) { return op === 'mul' ? side * TRF[g](deg) : side / TRF[g](deg); });
  var ups = op === 'div' ? TRF[fn](deg) / side : NaN, F1 = Math.round(TRF[fn](deg) * 10) / 10, F2 = Math.round(TRF[fn](deg) * 100) / 100;
  var early1 = op === 'div' ? side / F1 : side * F1, early2 = op === 'div' ? side / F2 : side * F2;
  var all = [want, radV, md, others[0], others[1], ups, early1, early2];
  var chop = Math.trunc(want * 10) / 10;
  if (Math.abs(R1(want) - chop) > 1e-9) all.push(chop);
  if (uniq(all, 1) && Math.abs(radV) < 1e5) { T('len RAD ' + JSON.stringify(spec), lc, fmt1(radV), 'wrong', 'trig-rad'); seenTrap.rad = 1; }
  if (uniq(all, 2) && md < 1e5) { T('len mul/div ' + JSON.stringify(spec), lc, fmt1(md), 'wrong', 'trig-mul-div'); seenTrap.md = 1; }
  if (uniq(all, 3)) { T('len ratio ' + JSON.stringify(spec), lc, fmt1(others[0]), 'wrong', 'trig-wrong-ratio'); seenTrap.ratio = 1; }
  if (op === 'div' && uniq(all, 5) && R1(ups) > 0) { T('len upside ' + JSON.stringify(spec), lc, fmt1(ups), 'wrong', 'trig-upside'); seenTrap.ups = 1; }
  if (uniq(all, 6) && F1 > 0) { T('len early ' + JSON.stringify(spec), lc, fmt1(early1), 'form', 'round-early'); seenTrap.early = 1; }
  T('len unit typed ' + i6, lc, fmt1(want) + ' cm', 'form', 'units'); T('len empty ' + i6, lc, '', 'form', 'empty');
  var noRad = G.lenChk(want, { trig: spec, radTrap: false }); if (uniq(all, 1) && Math.abs(radV) < 1e5) n++, (code(noRad, fmt1(radV)) === 'trig-rad' && (fails++, console.log('FAIL radTrap false still traps', JSON.stringify(spec))));
}
eq(Object.keys(seenTrap).sort(), ['early', 'md', 'rad', 'ratio', 'ups'], 'every trig trap was exercised');
/* the worked example from the brief: 12 sin 35° */
var ex12 = G.lenChk(12 * TRF.sin(35), { trig: { fn: 'sin', deg: 35, side: 12, op: 'mul' } });
T('12 sin 35 ok', ex12, '6.9', 'correct'); T('12 sin 35 rad', ex12, '-5.1', 'wrong', 'trig-rad'); T('12 sin 35 div', ex12, '20.9', 'wrong', 'trig-mul-div');
T('12 sin 35 cos', ex12, '9.8', 'wrong', 'trig-wrong-ratio'); T('12 sin 35 early', ex12, '7.2', 'form', 'round-early'); T('12 sin 35 chop', ex12, '6.8', 'wrong', 'truncate');
var ex8 = G.lenChk(8 / TRF.tan(40), { trig: { fn: 'tan', deg: 40, side: 8, op: 'div' } });
T('8 / tan 40 ok', ex8, '9.5', 'correct'); T('8 / tan 40 mul', ex8, '6.7', 'wrong', 'trig-mul-div'); T('8 / tan 40 rad', ex8, '-7.2', 'wrong', 'trig-rad'); T('8/tan40 ratio upside', ex8, '0.1', 'wrong', 'trig-upside');
T('RAD hint mentions DRG', function (r) { var x = ex8(r); return { v: /DRG/.test(x.hint) && /RAD/.test(x.hint) ? 'yes' : 'no' }; }, '-7.2', 'yes');

/* ---- lenChk: Pythagoras ---- */
for (var ip = 0; ip < 400; ip++) {
  var a = rt.int(1, 40), b = rt.int(1, 40), c = Math.sqrt(a * a + b * b);
  var hc = G.lenChk(c, { pyth: { legs: [a, b] } });
  T('hyp ok ' + [a, b], hc, fmt1(c), 'correct');
  var hv = [c, a * a + b * b, Math.sqrt(Math.abs(a * a - b * b)), a + b, Math.sqrt(2 * a + 2 * b)], hcode = [null, 'pyth-no-root', 'pyth-subtract', 'pyth-add-sides', 'pyth-double'];
  for (var q = 1; q < hv.length; q++) if (uniq(hv, q)) T('hyp trap ' + hcode[q] + ' ' + [a, b], hc, fmt1(hv[q]), 'wrong', hcode[q]);
  if (a !== b) {
    var hyp = Math.max(a, b) + rt.int(1, 20), leg = Math.min(a, b), want2 = Math.sqrt(hyp * hyp - leg * leg), lc2 = G.lenChk(want2, { pyth: { hyp: hyp, leg: leg } });
    T('leg ok ' + [hyp, leg], lc2, fmt1(want2), 'correct');
    var lv = [want2, hyp * hyp - leg * leg, Math.sqrt(hyp * hyp + leg * leg), hyp - leg, Math.sqrt(2 * hyp - 2 * leg)], lcode = [null, 'pyth-no-root', 'pyth-hyp-leg', 'pyth-sub-sides', 'pyth-double'];
    for (var q2 = 1; q2 < lv.length; q2++) if (uniq(lv, q2)) T('leg trap ' + lcode[q2] + ' ' + [hyp, leg], lc2, fmt1(lv[q2]), 'wrong', lcode[q2]);
    if (lv.every(function (x) { return Math.abs(x - hyp - 5) > 0.3; })) T('leg too long ' + [hyp, leg], lc2, fmt1(hyp + 5), 'wrong', 'pyth-too-long');
  }
}
T('3-4-5', G.lenChk(5, { pyth: { legs: [3, 4] } }), '5', 'correct'); T('3-4-5 no root', G.lenChk(5, { pyth: { legs: [3, 4] } }), '25', 'wrong', 'pyth-no-root');
T('3-4-5 sub', G.lenChk(5, { pyth: { legs: [3, 4] } }), '2.6', 'wrong', 'pyth-subtract'); T('3-4-5 add', G.lenChk(5, { pyth: { legs: [3, 4] } }), '7', 'wrong', 'pyth-add-sides');
T('leg 13-5 hyp as leg', G.lenChk(12, { pyth: { hyp: 13, leg: 5 } }), '13.9', 'wrong', 'pyth-hyp-leg');

/* ---- lenChk: scale and proportions ---- */
for (var is = 0; is < 200; is++) {
  var len = rt.int(2, 40), kk = rt.pick([0.25, 0.5, 1.5, 2, 2.5, 3, 4, 0.75]), opk = rt.pick(['mul', 'div']), ans = opk === 'mul' ? len * kk : len / kk;
  var sk = G.lenChk(ans, { scale: { len: len, k: kk, op: opk } }), sv = [ans, opk === 'mul' ? len / kk : len * kk, len + kk];
  T('scale ok', sk, fmt1(ans), 'correct'); if (uniq(sv, 1)) T('scale mul/div ' + [len, kk, opk], sk, fmt1(sv[1]), 'wrong', 'k-mul-div'); if (uniq(sv, 2)) T('scale added ' + [len, kk], sk, fmt1(sv[2]), 'wrong', 'k-added');
  var gv = rt.int(2, 30), nu = rt.int(2, 20), de = rt.int(2, 20); if (nu === de) continue;
  var pa2 = gv * nu / de, pk = G.lenChk(pa2, { prop: { given: gv, num: nu, den: de } }), pv = [pa2, gv * de / nu, gv + nu - de];
  T('prop ok', pk, fmt1(pa2), 'correct'); if (uniq(pv, 1)) T('prop flip ' + [gv, nu, de], pk, fmt1(pv[1]), 'wrong', 'prop-flip'); if (uniq(pv, 2) && pv[2] > 0) T('prop add ' + [gv, nu, de], pk, fmt1(pv[2]), 'wrong', 'prop-add');
}

/* ---- angleRatioChk ---- */
var seenA = {};
for (var ia = 0; ia < 500; ia++) {
  var fa = rt.pick(['sin', 'cos', 'tan']), x1 = rt.int(1, 30), x2 = rt.int(1, 30), num = fa === 'tan' ? x1 : Math.min(x1, x2), den = fa === 'tan' ? x2 : Math.max(x1, x2) + rt.int(1, 9);
  var th = { sin: Math.asin, cos: Math.acos, tan: Math.atan }[fa](num / den) / RADF, ac = G.angleRatioChk(th, { ratio: { fn: fa, num: num, den: den } });
  T('angle ok ' + [fa, num, den], ac, fmt1(th, 0), 'correct'); T('angle ° ok', ac, fmt1(th, 0) + '°', 'correct'); T('angle θ= ok', ac, 'θ = ' + fmt1(th, 0) + '^\\circ', 'correct');
  var t2 = R1(th, 2); if (Math.abs(t2 - R1(th, 0)) > 1e-9 && Math.abs(R1(t2, 0) - R1(th, 0)) < 1e-9) T('angle round', ac, t2.toFixed(2), 'form', 'round');
  var radA = { sin: Math.asin, cos: Math.acos, tan: Math.atan }[fa](num / den), noInv = TRF[fa](num / den), comp = 90 - th;
  var wr = ['sin', 'cos', 'tan'].filter(function (g) { return g !== fa; }).map(function (g) { var v = { sin: Math.asin, cos: Math.acos, tan: Math.atan }[g](num / den); return v / RADF; });
  var upA = { sin: Math.asin, cos: Math.acos, tan: Math.atan }[fa](den / num) / RADF;
  // the complement is also what the flipped tan ratio, or the co-function's inverse, gives: it is checked first
  var clash = [th, radA, noInv].concat(wr).some(function (x) { return isFinite(x) && Math.abs(x - comp) > 1e-6 && Math.abs(R1(x, 0) - R1(comp, 0)) < 1e-9; });
  if (!clash && Math.abs(R1(comp, 0) - R1(th, 0)) > 1e-9) { T('angle complement ' + [fa, num, den], ac, fmt1(comp, 0), 'wrong', 'trig-complement'); seenA.comp = 1; if (isFinite(upA)) eq(code(ac, fmt1(upA, 0)), 'trig-complement', 'flipped ratio = complement ' + [fa, num, den]); }
  var avals = [th, comp, wr[0], wr[1], radA, noInv];
  if (uniq(avals, 2, 0)) { T('angle wrong inverse ' + [fa, num, den], ac, fmt1(wr[0], 0), 'wrong', 'trig-wrong-ratio'); seenA.wr = 1; }
  if (Math.abs(radA - noInv) > 0.05 && R1(th, 0) > 3) { T('angle RAD ' + [fa, num, den], ac, radA.toFixed(2), 'wrong', 'trig-rad'); seenA.rad = 1; }
  if (Math.abs(radA - noInv) > 0.05 && R1(th, 0) > 3) { T('angle no inverse ' + [fa, num, den], ac, noInv.toFixed(4), 'wrong', 'trig-no-inverse'); seenA.noinv = 1; }
}
eq(Object.keys(seenA).sort(), ['comp', 'noinv', 'rad', 'wr'], 'every angle trap was exercised');
var a31 = G.angleRatioChk(Math.atan(3 / 5) / RADF, { ratio: { fn: 'tan', num: 3, den: 5 } });
T('tan⁻¹ 3/5 ok', a31, '31', 'correct'); T('tan⁻¹ 3/5 rad', a31, '0.54', 'wrong', 'trig-rad'); T('tan⁻¹ 3/5 comp (or flipped)', a31, '59', 'wrong', 'trig-complement'); T('tan⁻¹ 3/5 sin⁻¹', a31, '37', 'wrong', 'trig-wrong-ratio');
var a35 = G.angleRatioChk(35, {}); T('no ratio: complement', a35, '55', 'wrong', 'trig-complement'); T('no ratio ok', a35, '35', 'correct');

/* ---- kChk ---- */
for (var ik = 0; ik < 300; ik++) {
  var pn = rt.int(1, 12), qn = rt.int(1, 12); if (pn === qn) continue;
  var kv = pn / qn, kc = G.kChk(kv, { from: { new: pn * 3, orig: qn * 3 } }), terminating = Math.abs(kv * 1000 - Math.round(kv * 1000)) < 1e-9;
  T('k frac ' + pn + '/' + qn, kc, pn + '/' + qn, 'correct'); T('k tex frac', kc, '\\frac{' + pn + '}{' + qn + '}', 'correct'); T('k k= frac', kc, 'k = ' + pn + '/' + qn, 'correct');
  T('k 2dp ' + kv, kc, kv.toFixed(2), terminating && Math.abs(Number(kv.toFixed(2)) - kv) > 1e-9 ? 'wrong' : 'correct');
  if (!terminating) T('k 1dp nudge ' + kv, kc, kv.toFixed(1), Math.abs(Number(kv.toFixed(1)) - kv) <= 0.05 ? 'form' : 'wrong');
  T('k flip ' + pn + '/' + qn, kc, qn + '/' + pn, 'wrong', 'k-flip');
  T('k ratio form', kc, pn + ':' + qn, 'form', 'k-ratio');
  if (pn * 3 - qn * 3 > 0 && Math.abs((pn - qn) * 3 - qn / pn) > 1e-9 && (pn - qn) * 3 !== kv) T('k subtract ' + pn + '/' + qn, kc, String((pn - qn) * 3), 'wrong', 'k-subtract');
}
var k15 = G.kChk(1.5); T('k 1.5', k15, '1.5', 'correct'); T('k 3/2', k15, '3/2', 'correct'); T('k ×1.5', k15, '×1.5', 'correct'); T('k 1.5x', k15, '1.5x', 'correct'); T('k flip dec', k15, '0.67', 'wrong', 'k-flip');
T('k percent', k15, '150%', 'form', 'k-percent'); T('k direction', k15, '0.8', 'wrong', 'k-direction'); T('k empty', k15, '', 'form', 'empty'); T('k words', k15, 'big', 'form');
T('k no flip trap', G.kChk(1.5, { flipTrap: false }), '2/3', 'wrong', 'k-direction');

/* ---- part builders ---- */
var pl = G.P.len('Find x.', 12 * TRF.sin(35), { trig: { fn: 'sin', deg: 35, side: 12, op: 'mul' }, unit: 'cm' });
eq([pl.key, pl.check(pl.key).v, pl.input.after, pl.check('-5.1').code], ['6.9', 'correct', 'cm', 'trig-rad'], 'P.len');
var pt = G.P.trigAngle('Find θ.', Math.atan(3 / 5) / RADF, { ratio: { fn: 'tan', num: 3, den: 5 } });
eq([pt.key, pt.check(pt.key).v, pt.input.after, pt.check('0.54').code], ['31', 'correct', '°', 'trig-rad'], 'P.trigAngle');
var pk1 = G.P.k('Scale factor?', [4, 6]); eq([pk1.key, pk1.check(pk1.key).v, pk1.check('3/2').code, pk1.input.type], ['\\frac{2}{3}', 'correct', 'k-flip', 'math'], 'P.k fraction');
var pk2 = G.P.k('Scale factor?', 2.5); eq([pk2.key, pk2.check(pk2.key).v], ['2.5', 'correct'], 'P.k decimal');
['sin', 'cos', 'tan', 'pyth'].forEach(function (w) {
  var pm2 = G.P.ratioMC(HW.rng('rm' + w), 'Which?', w); var right = pm2.input.options.filter(function (o2) { return o2.right; })[0];
  var wrongs = pm2.input.options.filter(function (o2) { return !o2.right; });
  eq([pm2.input.options.length, pm2.check(pm2.key).v, wrongs.every(function (o2) { var r2 = pm2.check(o2.key); return r2.v === 'wrong' && !!r2.hint; })], [4, 'correct', true], 'P.ratioMC ' + w);
  void right;
});

/* ---- parseScale, rightSides, rolesFor ---- */
var ps = G.parseScale('1 cm : 2 m'); eq([ps.ratio, ps.perCm, ps.text], [200, 2, '1 cm represents 2 m'], 'scale 1 cm : 2 m');
eq(G.parseScale('1 cm represents 5 km').ratio, 500000, 'scale represents'); eq(G.parseScale('1:50 000').realUnit, 'm', 'scale pure ratio'); eq(G.parseScale('1:50 000').ratio, 50000, 'scale pure ratio value');
eq(G.parseScale({ draw: 2, real: 5, units: 'km' }).perCm, 2.5, 'scale object'); eq(G.parseScale('1 : 200').text, '1 : 200', 'scale ratio text');
var thr = false; try { G.parseScale('banana'); } catch (e) { thr = true; } eq(thr, true, 'scale throws on nonsense');
var rs = G.rightSides({ a: 5, c: 13 }); eq([R1(rs.b, 6), R1(rs.A, 1), R1(rs.B, 1)], [12, 22.6, 67.4], 'rightSides a c');
var rs2 = G.rightSides({ A: 30, c: 10 }); eq([R1(rs2.a, 6), R1(rs2.b, 3)], [5, 8.66], 'rightSides A c');
eq([G.rolesFor('A').opp, G.rolesFor('B').opp, G.rolesFor('B').hyp], ['a', 'b', 'c'], 'rolesFor');

/* ---- Units 6–7 SVG builders over many random inputs ---- */
var shapes = Object.keys(G.SHAPES), r67 = HW.rng(67);
for (var iv = 0; iv < 300; iv++) {
  try {
    var sh = r67.pick(shapes), kk2 = r67.pick([0.25, 0.5, 0.75, 1.5, 2, 3]), np = G.SHAPES[sh].length, nmA = 'ABCDEFG'.slice(0, np), nmB = 'PQRSTUV'.slice(0, np);
    svgOk(G.similarSVG({ shape: sh, k: kk2, names: [nmA, nmB], labels: r67.pick([true, false, [['x', '?'], ['4 cm']]]), units: r67.pick(['', 'cm']), angles: r67.pick([false, true]), matchColors: !!r67.int(0, 1), rot: r67.int(0, 359), flip: !!r67.int(0, 1) }), 'similar ' + sh);
    var aa = r67.int(1, 30), bb2 = r67.int(1, 30);
    svgOk(G.rightTriSVG({ a: aa, b: bb2, right: r67.pick(['br', 'bl', 'tr', 'tl']), rot: r67.int(0, 359), flip: !!r67.int(0, 1), theta: r67.pick([null, 'A', 'B']), roles: r67.pick([true, false, ['opp', 'hyp']]), long: !!r67.int(0, 1), sides: r67.pick([true, { a: '12 cm', c: '?' }, {}]), unknown: r67.pick([null, 'a', 'b', 'c', 'A', 'B']), angles: r67.pick([{}, { A: '35°' }]), squares: !r67.int(0, 4) }), 'rightTri ' + [aa, bb2]);
    svgOk(G.rightTriSVG({ c: r67.int(5, 50), A: r67.int(5, 85), theta: 'A', roles: true }), 'rightTri A c');
    var kind = r67.pick(['elevation', 'depression']);
    svgOk(G.elevationSVG({ kind: kind, angle: r67.int(3, 80), dist: r67.int(5, 400), eye: r67.pick([0, 1.5, 1.7]), target: kind === 'elevation' ? r67.pick(['tree', 'building', 'tower', 'flag', 'pole', 'plane']) : r67.pick(['boat', 'person']), observer: kind === 'elevation' ? r67.pick(['person', 'none']) : r67.pick(['cliff', 'lighthouse', 'building']), alt: !!r67.int(0, 1), labels: r67.pick([{}, { height: 'h', angle: 'θ' }, { dist: 'x', height: false }]) }), 'elevation ' + kind);
    svgOk(G.shadowSVG({ small: { h: r67.int(1, 3), shadow: r67.int(1, 6), kind: r67.pick(['person', 'stick', 'pole']) }, big: { shadow: r67.int(4, 60), kind: r67.pick(['tree', 'pole', 'flag', 'tower', 'building']), label: { h: '?' } }, sunLabel: r67.pick([null, 'θ']) }), 'shadow');
    svgOk(G.mirrorSVG({ eye: 1.5 + r67.int(0, 3) / 10, d1: r67.int(1, 5), d2: r67.int(4, 40), kind: r67.pick(['flag', 'pole', 'tree', 'building']), labels: r67.pick([{}, { h: 'h' }]) }), 'mirror');
    svgOk(G.gridSVG({ shape: sh, k: r67.pick([0.5, 1.5, 2, 3]), cols: 20, rows: 12, names: [nmA, nmB], image: !!r67.int(0, 2) }), 'grid ' + sh);
    svgOk(G.scaleMapSVG({ scale: r67.pick(['1 cm : 5 km', '1:50 000', '2 cm : 1 km', { draw: 1, real: 250, units: 'm' }]), places: [{ name: 'A', at: [1, 1] }, { name: 'B', at: [r67.int(2, 9), r67.int(1, 5)] }], routes: [{ from: 'A', to: 'B', label: r67.pick(['x', '4.2 cm', null]) }] }), 'map');
  } catch (e) { fails++; n++; console.log('FAIL throws (Units 6–7)', iv, e && e.stack); break; }
}

console.log(n + ' checks, ' + fails + ' failed');
process.exit(fails ? 1 : 0);
