/* Unit 7 project (Ramp It Up): the checkers, run in node. For every building version (and many students), each
 * checkpoint's solve() must pass its own check and a later checkpoint must not pass before it is done; typical mistakes
 * (squares subtracted instead of added, no square root, a leg used as the hypotenuse, opp/adj swapped, RAD mode, no eye
 * height, multiplying when the unknown is on the bottom, …) must fail with the targeted hint; answers worked from the
 * student's own rounded numbers must be accepted; no right answer may sit on a rounding boundary; the drawings must
 * come out without NaN.
 *   node tests/projects_u7_test.js [students per building] */
global.window = global;
require('../js/catalog.js'); require('../js/calendar.js'); require('../js/projects.js'); require('../js/projects/u7.js');
var HW = global.HW, PJ = HW.Projects, RP = PJ.ramp, def = HW.PROJECTS.u7, N = Number(process.argv[2] || 40), fails = 0, checks = 0;
function ok(cond, msg) { checks++; if (!cond) { fails++; if (fails < 50) console.log('FAIL', msg); } }
function fresh(seedStr) { var P = PJ.blank(); P.seed = PJ.hash(seedStr); return { P: P, c: new PJ.Ctx(def, P, { seed: P.seed }) }; }
function ev(i, c) { return PJ.evaluate(def, def.checkpoints[i], c); }
function res(i, c, f) { return ev(i, c).results.filter(function (x) { return x.f === f; })[0]; }
function hintOf(i, c, f) { var r = res(i, c, f); return r ? (r.ok ? 'OK' : r.blank ? 'BLANK' : (r.form ? 'FORM ' : '') + r.hint) : 'NONE'; }
function tryHint(i, c, f, val, re, msg) { var save = c.get(f); c.set(f, typeof val === 'number' ? String(Math.round(val * 100) / 100) : String(val)); var h = hintOf(i, c, f); ok(re.test(h), msg + ' → ' + h + ' (typed ' + c.get(f) + ')'); c.set(f, save); ok(ev(i, c).ok, msg + ': restored'); }
function D(x) { return x * Math.PI / 180; }
function atanD(x) { return Math.atan(x) * 180 / Math.PI; }
/* how far a value is from a rounding boundary at n decimals */
function margin(v, n) { var p = Math.pow(10, n), f = v * p - Math.floor(v * p); return Math.abs(f - 0.5) / p; }
var seen = { v: {}, slip: {}, verdict: {}, enough: {}, square: {} };

// ---- every building version: the numbers are sane and no answer sits on a rounding boundary ----
Object.keys(RP.BLD).forEach(function (id) {
  RP.BLD[id].V.forEach(function (v, vi) {
    var tag = id + vi, h = v.h, run = 12 * h;
    ok(Math.abs(v.h / v.n * 100 - Math.round(v.h / v.n * 100)) < 1e-9, tag + ' each step rises a whole number of cm');
    ok(v.h / v.n >= 0.16 && v.h / v.n <= 0.22 && v.t >= 0.25 && v.t <= 0.3, tag + ' steps are realistic');
    ok(v.W >= 2.0 && v.D >= 1.5, tag + ' the biggest 3-4-5 triangle (2.0 × 1.5) fits on the landing');
    ok(v.Lold > h, tag + ' old ramp');
    var orun = Math.sqrt(v.Lold * v.Lold - h * h), oang = atanD(h / orun);
    ok(oang > 9 && oang < 14, tag + ' the old ramp is far too steep: ' + oang.toFixed(1));
    [[Math.hypot(run, h), 2, 'ramp length'], [orun, 2, 'old run'], [Math.hypot(v.W, v.D), 2, 'slab diagonal'], [Math.hypot(v.n * v.t, h), 2, 'stringer'], [atanD(h / (v.n * v.t)), 0, 'stair angle'], [oang, 0, 'old angle'], [orun / h, 1, 'old ratio']].forEach(function (q) {
      ok(margin(q[0], q[1]) > 0.0003 * Math.pow(10, 2 - q[1]), tag + ' ' + q[2] + ' ' + q[0] + ' is too close to a rounding boundary');
    });
    // the old run from the student's rounded value gives the same rounded angle and ratio
    var orr = Math.round(orun * 100) / 100;
    ok(Math.round(atanD(h / orr)) === Math.round(oang), tag + ' old angle from the rounded run');
  });
});

['curl', 'lib', 'hall'].forEach(function (bld) {
  for (var s = 0; s < N; s++) {
    var x = fresh('10c-b|student' + s + '|' + bld), c = x.c, P = x.P;
    c.set('bld', bld); if (s % 3) c.set('k', ['0.3', '0.4', '0.5'][s % 3]);
    def.checkpoints.forEach(function (cp, i) {
      if (i > 0) ok(!ev(i, c).ok, bld + ' cp' + (i + 1) + ' passes before it is done');
      cp.solve(c);
      var e = ev(i, c);
      ok(e.ok, bld + ' seed ' + s + ' cp' + (i + 1) + ' solve() does not pass: ' + JSON.stringify(e.wrong.concat(e.blanks).slice(0, 3)));
      P.cps[cp.id] = { n: 1, first: {}, w: {}, ok: Date.now() };
    });
    ok(PJ.statuses(def, P).every(function (st) { return st === 'done'; }), bld + ' all done');
    var S = RP.site(c), k = Number(c.get('k'));
    seen.v[bld + S.vi] = 1; seen.slip[S.slip] = 1; seen.verdict[RP.verdict(S, k)] = 1; seen.enough[S.Lr >= S.need ? 'yes' : 'no'] = 1; seen.square[S.off ? 'no' : 'yes'] = 1;
    // the numbers make sense
    ok(Math.abs(S.Lr - S.need) > 0.04, 'pre-cut rail clearly long enough or not: ' + S.Lr + ' vs ' + S.need.toFixed(3));
    ok(S.H > S.a + 1 && S.H < 15, 'pole height ' + S.H.toFixed(2) + ' (wire at ' + S.a + ')');
    ok(S.dep > 15 && S.dep < 55, 'camera angle ' + S.dep.toFixed(1));
    ok(S.wang > 45 && S.wang < 70, 'wire angle ' + S.wang.toFixed(1));
    var m = 5 * k + S.delta; ok(S.delta === 0 || Math.abs(m * m - 25 * k * k) > 0.02, 'a crooked corner shows in c² vs a² + b²');
    // the drawings and the card have no NaN, and the card shows the student's numbers
    var card = RP.cardHtml(c);
    ok(card.indexOf('NaN') < 0 && card.indexOf('pj-u7-card') > 0 && card.indexOf(String(c.get('len'))) > 0 && card.indexOf(String(c.get('pole'))) > 0, 'card has the ramp length and the pole height');
    ok(RP.sceneSvg({ style: bld, sign: 'X', W: S.W, h: S.h, n: S.n, orun: S.orun, run: S.run, roof: S.roof, H: S.H, a: S.a, b: S.b }, {}).indexOf('NaN') < 0, 'scene: no NaN');
    ok([RP.rampSvg({ h: S.h, run: S.run, rail: true, tags: true, th: 'θ', top: 'B' }), RP.slabSvg({ W: S.W, D: S.D, k: k, diag: true, diag2: true }), RP.stairsSvg({ n: S.n, r: S.r, t: S.t, rail: true }), RP.poleSvg({ d: S.d, te: S.te, e: S.e, H: S.H, a: S.a, b: S.b, b2: S.b2, f2: S.f2, wires: true, wire2: true }), RP.camSvg({ roof: S.roof, h: S.h, run: S.run })].every(function (q) { return q.indexOf('NaN') < 0 && q.indexOf('<svg') === 0; }), 'drawings: no NaN');

    // ---- targeted hints ----
    if (s % 3 === 0) {
      var h = S.h, run = S.run, len = Math.hypot(run, h), a3 = 3 * k, b4 = 4 * k;
      // cp2: 3-4-5, squares, the diagonal
      tryHint(1, c, 'd5', 7 * k, /added the two marks/, '3-4-5 diagonal as the sum of the legs');
      tryHint(1, c, 'leg4', 4, /Multiply by your size/, 'forgot the multiple');
      tryHint(1, c, 'sumsq', a3 + b4, /Square each leg/, 'a + b instead of a² + b²');
      tryHint(1, c, 'sumsq', 2 * a3 + 2 * b4, /itself/, 'doubling instead of squaring');
      tryHint(1, c, 'csq', m, /Square the measured/, 'c instead of c²');
      if (S.delta) tryHint(1, c, 'csq', 25 * k * k, /measured/, 'c² as a² + b²');
      tryHint(1, c, 'diag', S.W * S.W + S.D * S.D, /square root/, 'diagonal: no square root');
      tryHint(1, c, 'diag', Math.sqrt(S.W * S.W - S.D * S.D), /subtracted/, 'diagonal: subtracted');
      tryHint(1, c, 'diag', S.W, /hypotenuse/, 'diagonal: a leg as the hypotenuse');
      tryHint(1, c, 'diag', Math.round(S.diag * 10) / 10 === Math.round(S.diag * 100) / 100 ? 'skip' : (Math.round(S.diag * 10) / 10).toFixed(1), /FORM|Type just/, 'diagonal to the tenth is a format slip');
      var v = RP.verdict(S, k); tryHint(1, c, 'verdict', v === 'right' ? 'wide' : 'right', /equal/, 'verdict');
      if (v !== 'right') tryHint(1, c, 'verdict', v === 'wide' ? 'narrow' : 'wide', /Compare/, 'verdict: wide vs narrow');
      tryHint(1, c, 'square', S.off ? 'yes' : 'no', /diagonals|same length/, 'square');
      ok(!res(1, c, 'csq').form && (c.set('csq', (m * m).toFixed(4)), res(1, c, 'csq').ok) && (c.set('csq', (m * m).toFixed(2) + ' m²'), res(1, c, 'csq').ok), 'c² with 4 decimals or a unit is fine'); def.checkpoints[1].solve(c);
      // cp3: run, length, old run
      tryHint(2, c, 'run', h / 12, /Multiply/, 'run: divided by 12');
      tryHint(2, c, 'len', run * run + h * h, /square root/, 'ramp: no square root');
      tryHint(2, c, 'len', Math.sqrt(run * run - h * h), /subtracted/, 'ramp: subtracted');
      tryHint(2, c, 'len', run, /leg/, 'ramp: the run as the hypotenuse');
      var l1 = Math.round(len * 10) / 10; if (Math.abs(l1 - len) > 0.006 && Math.abs(l1 - run) > 0.006) tryHint(2, c, 'len', l1.toFixed(1), /FORM Right idea/, 'ramp: rounded to the tenth');
      tryHint(2, c, 'oldrun', Math.hypot(S.Lold, h), /subtract/, 'old run: added');
      tryHint(2, c, 'oldrun', S.Lold, /shorter/, 'old run: the hypotenuse as a leg');
      tryHint(2, c, 'oldrun', S.Lold * S.Lold - h * h, /square root/, 'old run: no square root');
      c.set('len', String(len.toFixed(3))); ok(res(2, c, 'len').ok, 'more decimals are fine'); c.set('len', len.toFixed(2) + ' m'); ok(res(2, c, 'len').ok, 'a unit is fine'); def.checkpoints[2].solve(c);
      // cp4: labels, the angle (RAD, flipped), the check, the old ramp
      tryHint(3, c, 'lab.rise', 'adj', /opposite/, 'rise labelled adj');
      tryHint(3, c, 'ratio', 'sin', /TOA/, 'sin chosen for opp and adj');
      tryHint(3, c, 'ang', (S.ang * Math.PI / 180).toFixed(2), /RAD/, 'ramp angle in RAD');
      tryHint(3, c, 'ang', '0.1', /RAD/, 'ramp angle in RAD (rounded)');
      tryHint(3, c, 'ang', (90 - S.ang).toFixed(1), /upside down/, 'ramp angle: ratio upside down');
      tryHint(3, c, 'ang', '5', /FORM Right idea/, 'ramp angle to the whole degree is a format slip');
      tryHint(3, c, 'angS', (90 - S.ang).toFixed(1), /cos/, 'sine check: cos⁻¹');
      tryHint(3, c, 'top', (180 - Number(c.get('ang'))).toFixed(1), /180/, 'top angle: 180 − θ');
      tryHint(3, c, 'oldang', Math.round(90 - S.oang), /upside down/, 'old angle: flipped');
      tryHint(3, c, 'oldang', (S.oang * Math.PI / 180).toFixed(2), /RAD/, 'old angle: RAD');
      tryHint(3, c, 'oldratio', (h / S.orun).toFixed(1), /bigger number on top/, 'old ratio flipped');
      // the old angle and ratio follow the student's own old run
      c.set('oldrun', (S.orun + 0.004).toFixed(3)); c.set('oldratio', ((S.orun + 0.004) / h).toFixed(1)); ok(ev(3, c).ok, 'old angle and ratio from the student’s own old run'); def.checkpoints[2].solve(c); def.checkpoints[3].solve(c);
      // cp5: stairs and rail
      var R = S.R, th = S.sang, thr = Math.round(th);
      tryHint(4, c, 'R', S.t, /one tread/, 'total run: one tread');
      tryHint(4, c, 'str', Math.sqrt(Math.abs(R * R - h * h)), /subtracted/, 'stringer: subtracted');
      tryHint(4, c, 'str', R, /longest/, 'stringer: a leg as the hypotenuse');
      tryHint(4, c, 'sang', Math.round(90 - th), /Upside down/, 'stair angle flipped');
      tryHint(4, c, 'sang', (th * Math.PI / 180).toFixed(2), /RAD/, 'stair angle RAD');
      tryHint(4, c, 'ratio.rise', 'cos', /SOH/, 'rail rise: cos chosen');
      tryHint(4, c, 'rrise', S.Lr * Math.cos(D(thr)), /run/, 'rail rise: cos instead of sin');
      tryHint(4, c, 'rrise', S.Lr / Math.sin(D(thr)), /multiply/, 'rail rise: divided instead of multiplied');
      tryHint(4, c, 'rrise', S.Lr * Math.sin(thr), /RAD/, 'rail rise: RAD');
      tryHint(4, c, 'need', (R + S.t) * Math.cos(D(thr)), /divide/, 'rail length: multiplied instead of divided');
      tryHint(4, c, 'need', R / Math.cos(D(thr)), /extra tread/, 'rail length: forgot the extra tread');
      tryHint(4, c, 'need', (R + S.t) / Math.cos(thr), /RAD/, 'rail length: RAD');
      tryHint(4, c, 'enough', S.Lr >= S.need ? 'no' : 'yes', /Compare/, 'long enough');
      // the rail follows the student's own rounded stair angle and the exact one
      c.set('rrise', (S.Lr * Math.sin(D(th))).toFixed(2)); ok(res(4, c, 'rrise').ok, 'rail rise with the exact angle'); c.set('rrise', (S.Lr * Math.sin(D(thr))).toFixed(2)); ok(res(4, c, 'rrise').ok, 'rail rise with the rounded angle'); def.checkpoints[4].solve(c);
      // cp6: pole, wires, camera
      tryHint(5, c, 'pole', S.d * Math.tan(D(S.te)), /eye height/, 'pole: forgot the eye height');
      tryHint(5, c, 'pole', S.d * Math.tan(S.te) + S.e, /RAD/, 'pole: RAD');
      tryHint(5, c, 'pole', S.d / Math.tan(D(S.te)) + S.e, /multiply/, 'pole: divided');
      tryHint(5, c, 'pole', S.d * Math.sin(D(S.te)) + S.e, /tan, not sin|eye height/, 'pole: sin');
      tryHint(5, c, 'wire', S.a * S.a + S.b * S.b, /square root/, 'wire: no square root');
      tryHint(5, c, 'wire', Math.sqrt(S.a * S.a - S.b * S.b), /subtracted/, 'wire: subtracted');
      tryHint(5, c, 'wang', Math.round(90 - S.wang), /pole/, 'wire angle: the angle at the pole');
      tryHint(5, c, 'b2', S.a * Math.tan(D(S.f2)), /divide/, 'wire 2: multiplied instead of divided');
      tryHint(5, c, 'b2', S.a / Math.sin(D(S.f2)), /length/, 'wire 2: the wire length');
      tryHint(5, c, 'dep', Math.round(90 - S.dep), /vertical/, 'depression from the vertical');
      tryHint(5, c, 'dep', (S.dep * Math.PI / 180).toFixed(2), /RAD/, 'depression: RAD');
      tryHint(5, c, 'elev', Math.round(90 - Number(c.get('dep'))), /equals/, 'elevation = depression');
      // cp7
      var other = ['A', 'B', 'C', 'D'].filter(function (L) { return L !== RP.SLIPS[S.slip].L; })[0];
      tryHint(6, c, 'slip', other, /fine/, 'slip: a fine line');
      tryHint(6, c, 'why', 'eye', /eye height/, 'slip: eye height distractor');
      // changing the building reopens checkpoint 2
      var keep = c.get('bld'); c.set('bld', bld === 'lib' ? 'hall' : 'lib'); var st = PJ.statuses(def, P);
      var S2 = RP.site(c); if (Math.abs(S2.diag - S.diag) > 0.01) ok(st[0] === 'done' && st[1] === 'open' && st[2] === 'locked', 'a new building reopens checkpoint 2: ' + st.join(','));
      c.set('bld', keep); def.checkpoints.forEach(function (cp) { cp.solve(c); }); ok(PJ.statuses(def, P).every(function (st2) { return st2 === 'done'; }), 'all done again');
    }
    ok(PJ.suggest(def, P).ind, 'suggestion');
  }
});
ok(Object.keys(seen.v).length === 9, 'all 9 building versions: ' + Object.keys(seen.v));
ok(Object.keys(seen.slip).length === 4, 'all four slips: ' + Object.keys(seen.slip));
ok(Object.keys(seen.verdict).length === 3, 'square, too open and too closed corners: ' + Object.keys(seen.verdict));
ok(Object.keys(seen.enough).length === 2 && Object.keys(seen.square).length === 2, 'rails long enough and not; slabs square and not');
// typed numbers
[['8.67', 8.67], ['8.67 m', 8.67], ['8.67m', 8.67], ['4.8°', 4.8], ['35 deg', 35], ['θ = 35', 35], ['2.37 m²', 2.37], ['abc', NaN], ['', NaN]].forEach(function (t) { var v = RP.pl(t[0]); ok(isNaN(t[1]) ? isNaN(v) : v === t[1], 'parse ' + t[0] + ' → ' + v); });
console.log((fails ? 'FAILED ' + fails : 'ok') + ' — ' + checks + ' checks');
process.exit(fails ? 1 : 0);
