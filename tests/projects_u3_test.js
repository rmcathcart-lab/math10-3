/* Unit 3 project (Reno Crew): the checkers, run in node. For every room, both ways of finding the area, both features,
 * both board lengths (and many students), each checkpoint's solve() must pass its own check; typical mistakes must fail
 * with the targeted hint; blanks must be blanks; the numbers must be realistic.
 *   node tests/projects_u3_test.js [students per combination] */
global.window = global;
require('../js/catalog.js'); require('../js/calendar.js'); require('../js/projects.js'); require('../js/projects/u3.js');
var HW = global.HW, PJ = HW.Projects, RN = PJ.reno, def = HW.PROJECTS.u3, N = Number(process.argv[2] || 12), fails = 0, checks = 0;
function ok(cond, msg) { checks++; if (!cond) { fails++; if (fails < 40) console.log('FAIL', msg); } }
function fresh(seedStr) { var P = PJ.blank(); P.seed = PJ.hash(seedStr); return { P: P, c: new PJ.Ctx(def, P, { seed: P.seed }) }; }
function ev(i, c) { return PJ.evaluate(def, def.checkpoints[i], c); }
function res(i, c, f) { return ev(i, c).results.filter(function (x) { return x.f === f; })[0]; }
function hintOf(i, c, f) { var r = res(i, c, f); return r ? (r.ok ? 'OK' : r.blank ? 'BLANK' : r.hint) : 'NONE'; }
function tryHint(i, c, f, val, re, msg) { var save = c.get(f); c.set(f, String(val)); var h = hintOf(i, c, f); ok(re.test(h), msg + ' → ' + h + ' (typed ' + val + ')'); c.set(f, save); ok(ev(i, c).ok, msg + ': restored'); }
var IDX = {}; def.checkpoints.forEach(function (cp, i) { IDX[cp.id] = i; });
var stats = { boards: [], boxes: [], rolls: [], cans: [], total: [] };

['rec', 'bed', 'suite'].forEach(function (room) {
  ['split', 'cut'].forEach(function (method) {
    ['table', 'moon'].forEach(function (feat) {
      ['8', '12'].forEach(function (len) {
        for (var s = 0; s < N; s++) {
          var x = fresh('10c-b|student' + s + '|' + room + method + feat + len), c = x.c, P = x.P;
          c.set('room', room); c.set('trimLen', len); c.set('method', method); c.set('feat', feat);
          c.set('floor', ['lvp', 'lam', 'cpt'][s % 3]); c.set('paint', ['basic', 'pro', 'prem'][s % 3]); c.set('trimStyle', ['mdf', 'pine', 'oak'][s % 3]);
          def.checkpoints.forEach(function (cp, i) {
            if (i > 0) ok(!ev(i, c).ok, room + ' cp' + (i + 1) + ' passes before it is done');
            cp.solve(c);
            var e = ev(i, c);
            ok(e.ok, room + '/' + method + '/' + feat + '/' + len + ' seed ' + s + ' cp' + (i + 1) + ' solve() does not pass: ' + JSON.stringify(e.wrong.concat(e.blanks).slice(0, 3)));
            P.cps[cp.id] = { n: 1, first: {}, w: {}, ok: Date.now() };
          });
          ok(PJ.statuses(def, P).every(function (st) { return st === 'done'; }), room + ' all done');
          var G = RN.geo(c), e2 = RN.e2(c), e4 = RN.e4(c), e5 = RN.e5(c), e6 = RN.e6(c), e7 = RN.e7(c);
          // geometry: the two ways to find the area agree; every wall is a whole number of 1½ in; the door fits on its wall
          var area = function (m) { return G.parts[m].reduce(function (a, q) { return a + q.s * q.w * q.h; }, 0) / 144; };
          ok(Math.abs(area('split') - area('cut')) < 1e-9, room + ' split and cut agree: ' + area('split') + ' vs ' + area('cut'));
          ok(G.sides.every(function (L) { return Math.abs(L / 1.5 - Math.round(L / 1.5)) < 1e-9 && L > 12; }), room + ' wall lengths: ' + G.sides);
          G.doors.forEach(function (d) { ok(d.w < G.sides[d.side] - 6, room + ' door fits its wall'); });
          ok(G.win && G.winCm[0] / 2.54 < G.sides[G.win.side] - 12, room + ' window fits its wall');
          // realistic amounts
          stats.boards.push(e2.b1); stats.boxes.push(e4.boxes1); stats.rolls.push(e4.rolls1); stats.cans.push(e5.cans1); stats.total.push(e7.total);
          ok(e2.b1 >= 4 && e2.b1 <= 14, room + ' boards ' + e2.b1); ok(e4.boxes1 >= 4 && e4.boxes1 <= 25, room + ' boxes ' + e4.boxes1);
          ok(e4.rolls1 >= 2 && e4.rolls1 <= 5, room + ' rolls ' + e4.rolls1); ok(e5.cans1 >= 2 && e5.cans1 <= 8, room + ' cans ' + e5.cans1);
          ok(e7.total > 1500 && e7.total < 6000, room + ' total $' + e7.total.toFixed(2));
          // the quote has every line, and its sums
          ok(RN.quoteLines(c).length === 6, 'six quote lines');
          var q = RN.quoteHtml(c); ok(q.indexOf('GST') > 0 && q.indexOf(PJ.money(e7.total)) > 0, 'quote shows the total');

          // ---- targeted hints ----
          var T = G.tape;
          if (s % 3 === 0) {
            tryHint(0, c, 'tape.w', T.w + 1, /left/, 'tape: next inch');
            var save = [c.get('tape.n'), c.get('tape.d')];
            c.set('tape.n', String(T.k)); c.set('tape.d', '16');
            var g = res(0, c, 'tape.n'); if (T.k % 2 === 0) ok(g.form && /lowest terms/.test(g.hint), 'unsimplified fraction is a format nudge: ' + g.hint); else ok(g.ok, 'odd sixteenths are already simplest');
            c.set('tape.n', String(16 - T.k)); ok(/right/.test(hintOf(0, c, 'tape.n')) || T.k === 8, 'counted from the right: ' + hintOf(0, c, 'tape.n'));
            c.set('tape.n', String(T.k + 1)); ok(/So close|ticks/.test(hintOf(0, c, 'tape.n')), 'one tick off: ' + hintOf(0, c, 'tape.n'));
            c.set('tape.n', ''); ok(hintOf(0, c, 'tape.n') === 'BLANK', 'blank fraction is blank');
            c.set('tape.n', save[0]); c.set('tape.d', save[1]); ok(ev(0, c).ok, 'tape restored');
            var a = Math.floor(G.L / 12), b = G.L - 12 * a;
            if (b > 0) { tryHint(0, c, 'cv.Lft', (a + b / 10).toFixed(2), /tenths/, 'naive feet'); tryHint(0, c, 'cv.Lin', a * 12, /extra/, 'forgot inches'); }
            tryHint(0, c, 'cv.Lin', a + b, /12/, 'feet+inches added');
            c.set('cv.Lin', '172 1/2'); var r = res(0, c, 'cv.Lin'); ok(!r.form, 'mixed number accepted as a number'); c.set('cv.Lin', String(G.L)); ok(res(0, c, 'cv.Lin').ok, 'inches restored');
            c.set('cv.Lin', Math.floor(G.L) + (G.L % 1 ? ' 1/2' : '')); ok(res(0, c, 'cv.Lin').ok, 'inches as a mixed number: ' + c.get('cv.Lin')); c.set('cv.Lin', String(G.L));
            tryHint(0, c, 'win.w', (G.winCm[0] / 2.54).toFixed(2), /inches/, 'window in inches');
            tryHint(0, c, 'win.w', (G.winCm[0] / 100).toFixed(2), /metres/, 'window in metres');
            // baseboard
            tryHint(1, c, 'perim', G.sides.reduce(function (s2, L) { return s2 + L; }, 0), /inches/, 'perimeter in inches');
            tryHint(1, c, 'perim', (e2.P - G.sides[1] / 12).toFixed(3), /every wall/, 'perimeter missing a wall');
            if (room !== 'rec') tryHint(1, c, 'perim', (2 * (G.L + G.W) / 12).toFixed(3), /every|plain rectangle/, 'perimeter as a rectangle');
            if (Math.ceil(e2.need1 / e2.len) !== Math.floor(e2.need1 / e2.len)) tryHint(1, c, 'boards', Math.floor(e2.need1 / e2.len), /Round <b>up/, 'boards rounded down');
            tryHint(1, c, 'boards', (e2.need1 / e2.len).toFixed(2), /whole/, 'boards not whole');
            tryHint(1, c, 'trimNeed', (e2.P + e2.D).toFixed(2), /Subtract/, 'added the doors');
            // smudged plans
            tryHint(2, c, 'f1', 'a', /undo/, 'storage formula ×'); tryHint(2, c, 'f2', 'a', /Divide by 2/, 'laundry formula no ÷2');
            var e3 = RN.e3(c); tryHint(2, c, 'w2', (e3.P - 2 * e3.ll).toFixed(2), /2w/, 'laundry 2w'); tryHint(2, c, 'd3', (e3.C * Math.PI).toFixed(2), /Divide/, 'rug ×π');
            // flooring
            tryHint(3, c, 'buy', (e4.area1 * 0.1).toFixed(2), /extra 10%/, 'waste only');
            tryHint(3, c, 'buy', e4.area1.toFixed(2), /10%/, 'no waste');
            if (Math.ceil(e4.area1 / e4.F.cov) !== Math.ceil(e4.buy1 / e4.F.cov)) tryHint(3, c, 'boxes', Math.ceil(e4.area1 / e4.F.cov), /with/, 'boxes without waste');
            tryHint(3, c, 'm2', (e4.buy1 * 10.76).toFixed(2), /divide/, 'm² multiplied');
            tryHint(3, c, 'm2', (e4.buy1 * 0.3048).toFixed(2), /length/, 'm² with the length factor');
            if (method === 'cut') { var allAdd = e4.ps.reduce(function (a2, q, i) { return a2 + Number(c.get('part.' + (i + 1))); }, 0); tryHint(3, c, 'area', allAdd.toFixed(2), /Subtract/, 'added the cut-out'); }
            var q0 = e4.ps[0]; tryHint(3, c, 'part.1', (q0.w * q0.h).toFixed(1), /square <b>inches/, 'part in in²');
            // paint
            tryHint(4, c, 'coats', e5.n1.toFixed(2), /2/, 'forgot 2 coats');
            tryHint(4, c, 'net', (e5.g1 + e5.d1 + e5.w1).toFixed(2), /Subtract/, 'added door and window');
            tryHint(4, c, 'gross', (RN.e4(c).exact).toFixed(2), /floor/, 'floor area for walls');
            if (G.h % 12) tryHint(4, c, 'hft', (Math.floor(G.h / 12) + (G.h % 12) / 10).toFixed(2), /tenths/, 'naive height');
            // feature
            tryHint(5, c, 'r', e6.dft.toFixed(3), /diameter/, 'radius = diameter');
            tryHint(5, c, 'fArea', (Math.PI * e6.dft * e6.dft * (feat === 'moon' ? 0.5 : 1)).toFixed(2), /radius/, 'area with diameter');
            if (feat === 'moon') { tryHint(5, c, 'trimL', (Math.PI * e6.dft / 2).toFixed(2), /straight bottom/, 'half circle without the bottom'); tryHint(5, c, 'trimL', (Math.PI * e6.dft).toFixed(2), /half/, 'full circle for half'); }
            else tryHint(5, c, 'trimL', (2 * Math.PI * e6.dft).toFixed(2), /2 × π × d/, '2πd');
            c.set('trimL', (3.14 * (feat === 'moon' ? e6.dft / 2 : e6.dft) + (feat === 'moon' ? e6.dft : 0)).toFixed(2)); ok(res(5, c, 'trimL').ok, '3.14 for π is fine'); c.set('trimL', e6.trimL.toFixed(2));
            // quote
            tryHint(6, c, 'gst', (e7.sub1 * 1.05).toFixed(2), /total/, 'GST as total'); tryHint(6, c, 'gst', (e7.sub1 * 0.5).toFixed(2), /0\.05/, 'GST 0.5');
            tryHint(6, c, 'labour', e7.rate, /hours/, 'labour one hour');
            // follow-through: a wrong perimeter doesn't make the next boxes wrong
            var sp = c.get('perim'); c.set('perim', (e2.P + 1).toFixed(3)); var nP = e2.P + 1 - Number(c.get('doorFt')); c.set('trimNeed', nP.toFixed(2));
            ok(!res(1, c, 'perim').ok && res(1, c, 'trimNeed').ok, 'baseboard needed follows the student’s own perimeter'); c.set('perim', sp); RN.e2(c); def.checkpoints[1].solve(c);
            // changing the room reopens the later checkpoints
            var keep = c.get('room'); c.set('room', room === 'rec' ? 'bed' : 'rec'); var st = PJ.statuses(def, P); ok(st[0] === 'open' && st[1] === 'locked', 'a new room reopens checkpoint 1: ' + st.join(',')); c.set('room', keep);
            def.checkpoints.forEach(function (cp) { cp.solve(c); }); ok(PJ.statuses(def, P).every(function (st2) { return st2 === 'done'; }), 'all done again');
          }
          ok(PJ.suggest(def, P).ind, 'suggestion');
        }
      });
    });
  });
});
// every student's own sizes: the 3 variants of every room, many tape readings
(function () {
  var seen = {}, tapes = {};
  for (var s = 0; s < 300; s++) { var c = fresh('k|' + s).c; c.set('room', 'rec'); var G = RN.geo(c); seen[G.L + 'x' + G.W] = 1; tapes[G.tape.v] = 1; }
  ok(Object.keys(seen).length === 3, 'three rec room sizes: ' + Object.keys(seen)); ok(Object.keys(tapes).length > 30, 'many tape readings: ' + Object.keys(tapes).length);
})();
// mixed-number parsing
[['172 1/2', 172.5], ['172-1/2', 172.5], ['7/16', 0.4375], ['14.375 ft', 14.375], ['33 7⁄16', 33.4375], ['abc', NaN], ['', NaN], ['1/0', NaN]].forEach(function (t) { var v = RN.pm(t[0]); ok(isNaN(t[1]) ? isNaN(v) : Math.abs(v - t[1]) < 1e-9, 'parse ' + t[0] + ' → ' + v); });
function range(a) { a = a.slice().sort(function (x, y) { return x - y; }); return a[0] + '–' + a[a.length - 1]; }
console.log('  ranges: boards ' + range(stats.boards) + ', boxes ' + range(stats.boxes) + ', rolls ' + range(stats.rolls) + ', cans ' + range(stats.cans) + ', total $' + range(stats.total.map(function (x) { return Math.round(x); })));
console.log((fails ? 'FAILED ' + fails : 'ok') + ' — ' + checks + ' checks');
process.exit(fails ? 1 : 0);
