/* Unit 5 project (Mini-Golf Designer): the checkers, run in node. For every hole shape (and many students), each
 * checkpoint's solve() must pass its own check and a later checkpoint must not pass before it is done; typical mistakes
 * must fail with the targeted hint; answers that follow from the student's own earlier numbers must be accepted; the
 * drawings' geometry must be sound (simple holes, a clear bank shot, separated tents, tileable pads).
 *   node tests/projects_u5_test.js [students per shape] */
global.window = global;
require('../js/catalog.js'); require('../js/calendar.js'); require('../js/projects.js'); require('../js/projects/u5.js');
var HW = global.HW, PJ = HW.Projects, G5 = PJ.golf, def = HW.PROJECTS.u5, N = Number(process.argv[2] || 40), fails = 0, checks = 0;
function ok(cond, msg) { checks++; if (!cond) { fails++; if (fails < 40) console.log('FAIL', msg); } }
function fresh(seedStr) { var P = PJ.blank(); P.seed = PJ.hash(seedStr); return { P: P, c: new PJ.Ctx(def, P, { seed: P.seed }) }; }
function ev(i, c) { return PJ.evaluate(def, def.checkpoints[i], c); }
function res(i, c, f) { return ev(i, c).results.filter(function (x) { return x.f === f; })[0]; }
function hintOf(i, c, f) { var r = res(i, c, f); return r ? (r.ok ? 'OK' : r.blank ? 'BLANK' : r.hint) : 'NONE'; }
function tryHint(i, c, f, val, re, msg) { var save = c.get(f); c.set(f, String(val)); var h = hintOf(i, c, f); ok(re.test(h), msg + ' → ' + h + ' (typed ' + val + ')'); c.set(f, save); ok(ev(i, c).ok, msg + ': restored'); }
function segX(a, b, c, d) { function o(p, q, r) { return Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0])); } return o(a, b, c) !== o(a, b, d) && o(c, d, a) !== o(c, d, b); }
function inside(pts, p) { var n = pts.length, inn = false; for (var i = 0, j = n - 1; i < n; j = i++) { var a = pts[i], b = pts[j]; if ((a[1] > p[1]) !== (b[1] > p[1]) && p[0] < (b[0] - a[0]) * (p[1] - a[1]) / (b[1] - a[1]) + a[0]) inn = !inn; } return inn; }
var seen = { bank: {}, brg: {}, pad: {}, err: {}, shape: {} };

// ---- the hole shapes: every version is a simple polygon with the right angles, tee and cup inside ----
Object.keys(G5.SHAPES).forEach(function (id) {
  var S = G5.SHAPES[id];
  S.V.forEach(function (p, vi) {
    var A = S.A(p), G = G5.geoFrom(A, p.L), n = G.n, sides = G.pts.map(function (a, i) { var b = G.pts[(i + 1) % n]; return Math.hypot(b[0] - a[0], b[1] - a[1]); });
    ok(A.reduce(function (a, b) { return a + b; }, 0) === (n - 2) * 180, id + vi + ' angle sum');
    ok(sides.every(function (s) { return s > 3.5; }), id + vi + ' sides ' + sides.map(function (s) { return s.toFixed(1); }));
    for (var i = 0; i < n; i++) for (var j = i + 2; j < n; j++) if (!(i === 0 && j === n - 1)) ok(!segX(G.pts[i], G.pts[(i + 1) % n], G.pts[j], G.pts[(j + 1) % n]), id + vi + ' simple polygon');
    ok(G.corners.filter(function (k) { return k.type === 'reflex'; }).length === 1, id + vi + ' exactly one reflex corner');
    ok(G.corners.some(function (k) { return k.type === 'acute'; }) && G.corners.some(function (k) { return k.type === 'obtuse'; }), id + vi + ' has acute and obtuse corners');
    // the measured angle (from the drawn points) is the angle the page expects
    G.corners.forEach(function (k) { var t = ((k.dp - k.dn) % 360 + 360) % 360; ok(Math.abs(t - k.A) < 1e-6, id + vi + ' corner ' + k.L + ' drawn ' + t + ' vs ' + k.A); });
    ok(Math.abs(G.pts[n - 1][1] - G.pts[n - 2][1]) < 1e-9 && Math.abs(G.pts[0][1] - G.pts[1][1]) < 1e-9, id + vi + ' the tee stretch has two parallel (horizontal) rails');
    ok(G.W < 20 && G.H < 14, id + vi + ' fits: ' + G.W.toFixed(1) + ' × ' + G.H.toFixed(1));
  });
});

['dogleg', 'fish', 'boom'].forEach(function (shape) {
  for (var s = 0; s < N; s++) {
    var x = fresh('10c-b|student' + s + '|' + shape), c = x.c, P = x.P;
    c.set('shape', shape); c.set('theme', ['farm', 'peaks', 'dino', 'hockey', 'lake', 'midway'][s % 6]);
    def.checkpoints.forEach(function (cp, i) {
      if (i > 0) ok(!ev(i, c).ok, shape + ' cp' + (i + 1) + ' passes before it is done');
      cp.solve(c);
      var e = ev(i, c);
      ok(e.ok, shape + ' seed ' + s + ' cp' + (i + 1) + ' solve() does not pass: ' + JSON.stringify(e.wrong.concat(e.blanks).slice(0, 3)));
      P.cps[cp.id] = { n: 1, first: {}, w: {}, ok: Date.now() };
    });
    ok(PJ.statuses(def, P).every(function (st) { return st === 'done'; }), shape + ' all done');
    var G = G5.geo(c), B = G5.bank(c), M = G5.mapGeo(c), R = G5.railGeo(c), K = G5.crook(c), Mi = G5.mill(c), pad = G5.padOf(c), E = G5.errTiling(c);
    seen.shape[shape + G.vi] = 1; seen.bank[B.a] = 1; seen.brg[M.b] = 1; seen.pad[pad.rows + 'x' + pad.cols] = 1; if (E) seen.err[E.kind] = 1;
    // the tee and the cup are on the green
    ok(inside(G.pts, G.tee) && inside(G.pts, G.cup), shape + ' tee and cup inside the hole');
    // the bank shot: the straight putt is blocked, the bank path clears the obstacle, only the right angle sinks
    ok(B.r >= 0.45 && B.clear - B.r >= 0.5, shape + ' bank obstacle clear of the path: r ' + B.r.toFixed(2) + ', clear ' + B.clear.toFixed(2));
    ok(G5.aimPath(B, B.a).sunk && !G5.aimPath(B, B.a + 1).sunk && !G5.aimPath(B, B.a - 1).sunk, shape + ' only the exact angle sinks');
    ok(G5.aimPath(B, B.a + 4).kind === 'steep' || G5.aimPath(B, B.a + 4).kind === 'obstacle', 'a steeper putt comes down too soon: ' + G5.aimPath(B, B.a + 4).kind);
    ok(['flat', 'end', 'obstacle'].indexOf(G5.aimPath(B, B.a - 4).kind) >= 0, 'a flatter putt goes past: ' + G5.aimPath(B, B.a - 4).kind);
    ok(G5.nearRef(B.a) !== null && REFDIST(B.a), 'bank angle has one clear nearest referent: ' + B.a);
    // the map: the tents and the hole are well apart; one tent is right, one each for the 3 mistakes
    var all = M.tents.map(function (t) { return t.brg; }).concat([M.b]), minSep = 999;
    all.forEach(function (a, i) { all.forEach(function (b, j) { if (i !== j) minSep = Math.min(minSep, Math.min(Math.abs(a - b), 360 - Math.abs(a - b))); }); });
    ok(minSep >= 14, 'tent bearings ' + all + ' apart ' + minSep);
    ok(M.tents.map(function (t) { return t.L; }).sort().join('') === 'ABCD', 'tents lettered A–D');
    M.tents.forEach(function (t) { ok(t.x > 0.8 && t.x < 21.2 && t.y > 0.8 && t.y < 15.2, 'tent on the map'); });
    // rails: 5 targets, one per relationship; crooked rail numbers
    var rels = R.targets.map(function (k) { return G5.rel(R.g, k).replace(/[IE]$/, ''); }).sort().join(',');
    ok(rels === 'alt,corr,line,same,vert', 'one target per relationship: ' + rels);
    ok(R.pairs.length === 3 && new Set(R.pairs.map(function (p) { return p.cat; })).size === 3, 'three different pair names');
    ok(K.six === K.t + K.d && (K.d === 0) === K.par, 'crooked rail numbers');
    // pentominoes: the pad can be tiled; Jordan's attempt has exactly its mistake
    var t = G5.tilePad(pad.rows, pad.cols, G5.seededOrder(c, 'x')); ok(t && t.length === pad.n, 'pad tileable');
    ok(E, 'error tiling exists: ' + pad.rows + 'x' + pad.cols);
    if (E) {
      var sizes = E.list.map(function (pc) { return pc.cells.length; }).sort().join(',');
      if (E.kind === 'six') ok(sizes.indexOf('4') >= 0 && sizes.indexOf('6') >= 0, 'six/four sizes ' + sizes);
      if (E.kind === 'twice') { var shp = E.list.map(function (pc) { return G5.shapeOf(pc.cells); }); ok(new Set(shp).size === shp.length - 1, 'twice: one shape repeated'); }
      if (E.kind === 'off') ok(E.list.some(function (pc) { return pc.cells.some(function (q) { return q[0] < 0 || q[1] < 0 || q[0] >= pad.rows || q[1] >= pad.cols; }); }), 'off: a piece hangs off');
    }
    ok(G5.cardHtml(c).indexOf('pj-u5-card') > 0 && G5.cardHtml(c).indexOf(G5.b3(M.b) + '°') > 0, 'card shows the bearing');

    // ---- targeted hints ----
    if (s % 4 === 0) {
      var nonR = G.corners.filter(function (k) { return k.type !== 'reflex' && k.type !== 'right'; })[0], rf = G.reflex;
      tryHint(1, c, 'ang.' + nonR.L, 180 - nonR.A, /other scale/, 'protractor: other scale');
      tryHint(1, c, 'ang.' + rf.L, 360 - rf.A, /outside/, 'reflex: the outside reading');
      tryHint(1, c, 'rfx.read', rf.A, /can’t read more than 180/, 'reflex read as the inside');
      tryHint(1, c, 'rule', G.n * 180, /triangles/, 'n × 180');
      var other = G.corners.filter(function (k) { return k !== rf; })[0]; tryHint(1, c, 'rfx.which', other.L, /bend/, 'wrong reflex corner');
      tryHint(1, c, 'typ.' + nonR.L, nonR.type === 'acute' ? 'obtuse' : 'acute', /Is corner/, 'type hint');
      c.set('ang.' + nonR.L, String(nonR.A + 1)); ok(res(1, c, 'ang.' + nonR.L).ok && !res(1, c, 'sum').ok, 'within 2° is fine, and the sum follows the student’s own numbers'); c.set('sum', String(Number(c.get('sum')) + 1)); ok(ev(1, c).ok, 'own sum accepted'); def.checkpoints[1].solve(c);
      ok(res(1, c, 'ang.A').ok && (c.set('ang.A', G.corners[0].A + '°'), res(1, c, 'ang.A').ok), 'a degree sign is fine'); def.checkpoints[1].solve(c);
      // bank shot
      var a = B.a;
      tryHint(2, c, 'pt.q', 180 - a, /complementary/, 'q as the supplement'); tryHint(2, c, 'pt.s', 90 - a, /supplementary/, 's as the complement');
      tryHint(2, c, 'pt.p', 180 - a, /same/, 'angle out as the supplement'); tryHint(2, c, 'pt.r', 180 - a, /both/, 'r with one angle');
      tryHint(2, c, 'in', 180 - a, /other scale/, 'angle in on the other scale');
      c.set('in', String(a + 1)); c.set('pt.p', String(a + 1)); c.set('pt.q', String(89 - a)); c.set('pt.r', String(178 - 2 * a)); c.set('pt.s', String(179 - a)); c.set('off', String(Math.abs(a + 4 - a - 1)));
      ok(ev(2, c).ok, 'partners follow the student’s own angle in'); def.checkpoints[2].solve(c);
      c.set('aim', String(a + 1)); ok(!ev(2, c).ok && /putt/.test(ev(2, c).results.filter(function (r) { return r.msg && !r.ok; })[0].hint), 'changing the aim needs a new putt'); def.checkpoints[2].solve(c);
      // bearings
      var b = M.b;
      if (b < 100) tryHint(3, c, 'brg', b, /3 digits/, 'two-digit bearing');
      tryHint(3, c, 'brg', G5.b3(360 - b), /clockwise/, 'counter-clockwise bearing');
      tryHint(3, c, 'back', b >= 180 ? b + 180 : b - 180, b >= 180 ? /subtract/ : /add/, 'back bearing: wrong way');
      tryHint(3, c, 'back', G5.b3(180 - b < 0 ? 0 : 180 - b), b < 180 ? /± 180/ : /./, 'back bearing 180 − b');
      var ccw = M.tents.filter(function (t2) { return t2.kind === 'ccw'; })[0]; tryHint(3, c, 'tent', ccw.L, /counter-clockwise/, 'tent counter-clockwise');
      var bk = M.tents.filter(function (t2) { return t2.kind === 'back'; })[0]; tryHint(3, c, 'tent', bk.L, /opposite/, 'tent opposite');
      c.set('brg', G5.b3(b + 1)); c.set('back', G5.b3(b + 181)); ok(ev(3, c).ok, 'back bearing follows the student’s own bearing'); def.checkpoints[3].solve(c);
      // rails
      var m = R.ang(R.g), same = R.targets.filter(function (k) { return /same/.test(G5.rel(R.g, k)); })[0], eqk = R.targets.filter(function (k) { return G5.rel(R.g, k) === 'corr'; })[0];
      tryHint(4, c, 'fa.' + same, m, /180/, 'same-side called equal'); tryHint(4, c, 'fa.' + eqk, 180 - m, /equal/, 'corresponding called supplementary');
      var alt = R.targets.filter(function (k) { return /alt/.test(G5.rel(R.g, k)); })[0]; tryHint(4, c, 'fr.' + alt, 'corr', /opposite sides/, 'alternate called corresponding');
      tryHint(4, c, 'meas', 180 - m, /other scale/, 'rails: other scale');
      tryHint(4, c, 'par', K.par ? 'no' : 'yes', /./, 'crooked: wrong call');
      c.set('meas', String(m + 2)); R.targets.forEach(function (k) { c.set('fa.' + k, String((k % 2) === (R.g % 2) ? m + 2 : 178 - m)); }); ok(ev(4, c).ok, 'missing angles follow the student’s own ∠g'); def.checkpoints[4].solve(c);
      // cuts
      var MC = G5.mitreCorners(G); tryHint(5, c, 'mitre.tee', 90, /half/, 'mitre at 90'); tryHint(5, c, 'mitre.' + MC[0].L, MC[0].A, /half|bisect/i, 'mitre = corner');
      tryHint(5, c, 'post.x', 180 - Mi.beta, /complementary/, 'post: supplement for complement'); tryHint(5, c, 'post.y', 90 - Mi.lam, /supplementary/, 'post: complement for supplement');
      c.set('copy', String(Mi.th + 3)); ok(!res(5, c, 'copy').ok && /wider/.test(res(5, c, 'copy').hint), 'a wide copy of the blade'); c.set('copy', String(Mi.th + 1)); ok(res(5, c, 'copy').ok, 'blade copy within 1°'); def.checkpoints[5].solve(c);
      c.set('ang.' + MC[0].L, String(MC[0].A + 1)); c.set('mitre.' + MC[0].L, String((MC[0].A + 1) / 2)); ok(res(5, c, 'mitre.' + MC[0].L).ok, 'mitre follows the student’s own corner'); def.checkpoints[1].solve(c); def.checkpoints[5].solve(c);
      // puzzle
      tryHint(6, c, 'pieces', pad.rows * pad.cols, /squares/, 'pieces as squares');
      var tl = JSON.parse(c.get('tile')); c.set('tile', JSON.stringify(tl.slice(1))); ok(!res(6, c, 'tile').ok && /more piece/.test(res(6, c, 'tile').hint), 'a gap in the pad: ' + res(6, c, 'tile').hint);
      c.set('tile', ''); ok(res(6, c, 'tile').blank, 'an empty pad is blank'); def.checkpoints[6].solve(c);
      tryHint(6, c, 'err', 'none', /There is a mistake/, 'nothing wrong');
      // changing the shape reopens checkpoint 2
      var keep = c.get('shape'); c.set('shape', shape === 'fish' ? 'boom' : 'fish'); var st = PJ.statuses(def, P); ok(st[0] === 'done' && st[1] === 'open' && st[2] === 'locked', 'a new shape reopens checkpoint 2: ' + st.join(',')); c.set('shape', keep);
      def.checkpoints.forEach(function (cp) { cp.solve(c); }); ok(PJ.statuses(def, P).every(function (st2) { return st2 === 'done'; }), 'all done again');
    }
    ok(PJ.suggest(def, P).ind, 'suggestion');
  }
});
function REFDIST(a) { var d = [22.5, 30, 45, 60, 90].map(function (r) { return Math.abs(r - a); }).sort(function (x, y) { return x - y; }); return d[1] - d[0] >= 2.5; }
// every version of every shape, many banks and bearings, both kinds of pads and all three kinds of mistakes turn up
ok(Object.keys(seen.shape).length === 9, 'all 9 hole versions: ' + Object.keys(seen.shape));
ok(Object.keys(seen.bank).length >= 6, 'many bank angles: ' + Object.keys(seen.bank));
ok(Object.keys(seen.brg).length >= 10, 'many bearings: ' + Object.keys(seen.brg).length);
ok(Object.keys(seen.err).length === 3, 'all three tiling mistakes: ' + Object.keys(seen.err));
ok(Object.keys(seen.pad).length === 3, 'pad sizes: ' + Object.keys(seen.pad));
// pentominoes: 12 pieces, 63 orientations; turning and flipping give back the same piece
var nO = 0; Object.keys(G5.ORI).forEach(function (p) { nO += G5.ORI[p].length; for (var k = 0; k < 8; k++) ok(G5.shapeOf(G5.orient(p, k)) === p, 'orientation ' + p + k); });
ok(nO === 63, '63 fixed pentominoes: ' + nO);
// the transversal names (the booklet’s 8-angle diagram)
[[1, 5, 'corr'], [4, 6, 'altI'], [3, 5, 'altI'], [1, 7, 'altE'], [2, 8, 'altE'], [4, 5, 'sameI'], [3, 6, 'sameI'], [1, 8, 'sameE'], [2, 7, 'sameE'], [1, 3, 'vert'], [6, 8, 'vert'], [1, 2, 'line'], [5, 8, 'line'], [1, 6, null], [7, 4, null]].forEach(function (t) { ok(G5.rel(t[0], t[1]) === t[2] && G5.rel(t[1], t[0]) === t[2], 'rel ' + t); });
// typed angles and bearings
[['35', 35], ['35°', 35], ['35 deg', 35], ['∠ 35', 35], ['057', 57], ['12.5°', 12.5], ['abc', NaN], ['', NaN]].forEach(function (t) { var v = G5.pa(t[0]); ok(isNaN(t[1]) ? isNaN(v) : v === t[1], 'parse ' + t[0] + ' → ' + v); });
[[57, '057'], [5, '005'], [237, '237'], [360, '000'], [-30, '330']].forEach(function (t) { ok(G5.b3(t[0]) === t[1], 'b3 ' + t[0]); });
console.log((fails ? 'FAILED ' + fails : 'ok') + ' — ' + checks + ' checks');
process.exit(fails ? 1 : 0);
