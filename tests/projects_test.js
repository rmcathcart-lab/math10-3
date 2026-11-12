/* Unit projects: the checkers, run in node. For every shop type (and many students), each checkpoint's solve() must
 * pass its own check; typical mistakes must fail with the targeted hint; blanks must be reported as blanks.
 *   node tests/projects_test.js [students per shop] */
global.window = global;
require('../js/catalog.js'); require('../js/calendar.js'); require('../js/projects.js'); require('../js/projects/u1.js');
var HW = global.HW, PJ = HW.Projects, def = HW.PROJECTS.u1, N = Number(process.argv[2] || 40), fails = 0, checks = 0;
function ok(cond, msg) { checks++; if (!cond) { fails++; if (fails < 30) console.log('FAIL', msg); } }
function fresh(seedStr, shop) { var P = PJ.blank(); P.seed = PJ.hash(seedStr); var c = new PJ.Ctx(def, P, { seed: P.seed }); c.set('shop', shop); return { P: P, c: c }; }
function ev(i, c) { return PJ.evaluate(def, def.checkpoints[i], c); }
function hintOf(i, c, f) { var r = ev(i, c).results.filter(function (x) { return x.f === f; })[0]; return r ? (r.ok ? 'OK' : r.blank ? 'BLANK' : r.hint) : 'NONE'; }

['snack', 'phone', 'hockey', 'craft', 'own'].forEach(function (shop) {
  for (var s = 0; s < N; s++) {
    var x = fresh('class|student' + s + '|' + shop, shop), c = x.c, P = x.P;
    // nothing filled in: checkpoint 2 can't pass; blanks are blanks
    def.checkpoints.forEach(function (cp, i) {
      if (i > 0) { var e0 = ev(i, c); ok(!e0.ok, shop + ' cp' + (i + 1) + ' passes before it is done'); }
      cp.solve(c);
      var e = ev(i, c);
      ok(e.ok, shop + ' seed ' + s + ' cp' + (i + 1) + ' solve() does not pass: ' + JSON.stringify(e.wrong.concat(e.blanks).slice(0, 3)));
      P.cps[cp.id] = { n: 1, first: {}, w: {}, ok: Date.now() };
    });
    ok(PJ.statuses(def, P).every(function (st) { return st === 'done'; }), shop + ' all done');
    // money sanity: every unit cost and price is a real, positive amount
    PJ.popup.products(c).forEach(function (p) { ok(PJ.popup.cost(c, p) > 0 && PJ.popup.price(c, p) > PJ.popup.cost(c, p), shop + ' price above cost for ' + p.name); });
    var d = PJ.popup.usDeal(c), n = (d.price + d.ship) * 1.422 / d.n; ok(Math.abs(n - d.cadEach) / d.cadEach > 0.03, shop + ' US deal too close to call: ' + n.toFixed(3) + ' vs ' + d.cadEach);
    ok(d.price > 0, 'US price positive');

    // ---- targeted hints ----
    var p = PJ.popup.products(c)[0], k = p.packs[0], f = 'unit.' + p.id + '.' + k.id, save = c.get(f);
    c.set(f, (k.n / k.price).toFixed(2)); ok(/divided the number of items/.test(hintOf(1, c, f)), 'unit price flipped hint: ' + hintOf(1, c, f));
    c.set(f, (k.price / k.n * 100).toFixed(1)); ok(/100 times too big/.test(hintOf(1, c, f)), 'unit price x100 hint: ' + hintOf(1, c, f));
    c.set(f, ''); ok(hintOf(1, c, f) === 'BLANK', 'blank is blank');
    c.set(f, 'abc'); ok(ev(1, c).results.filter(function (r) { return r.f === f; })[0].form, 'not a number is a format slip');
    c.set(f, save); ok(ev(1, c).ok, 'restored');
    var g = 'gst.' + p.id, sp = PJ.popup.price(c, p), sg = c.get(g);
    c.set(g, (sp * 5).toFixed(2)); ok(/0\.05/.test(hintOf(3, c, g)), 'GST x5 hint: ' + hintOf(3, c, g));
    c.set(g, (sp * 1.05).toFixed(2)); ok(/total/.test(hintOf(3, c, g)), 'GST total hint: ' + hintOf(3, c, g));
    c.set(g, sg);
    var su = c.get('usUsd'), sub = c.num('usSub');
    c.set('usUsd', (sub * 1.361).toFixed(2)); ok(/divide/.test(hintOf(5, c, 'usUsd')), 'USD multiplied hint: ' + hintOf(5, c, 'usUsd'));
    c.set('usUsd', (sub / 1.422).toFixed(2)); ok(/sell rate/.test(hintOf(5, c, 'usUsd')), 'USD wrong rate hint: ' + hintOf(5, c, 'usUsd'));
    c.set('usUsd', su); c.set('usRate', 'sell'); ok(!ev(5, c).ok, 'wrong rate choice fails'); c.set('usRate', 'buy');
    var sd = c.get('pd.2'), amt = Number(c.get('amt.2')), sp2 = PJ.popup.price(c, PJ.popup.products(c)[1]);
    c.set('pd.2', (amt / (sp2 - amt) * 100).toFixed(1)); ok(/original/.test(hintOf(4, c, 'pd.2')), shop + ' percent decrease wrong base: ' + hintOf(4, c, 'pd.2') + ' amt ' + amt + ' sp ' + sp2 + ' ' + c.get('sale.2') + JSON.stringify(ev(4,c).results.map(function(r){return r.f}))); c.set('pd.2', sd);
    // a cent of rounding is fine; 3 cents is not
    var tot = 'tot.' + p.id, tv = c.num(tot); c.set(tot, (tv + 0.01).toFixed(2)); ok(ev(3, c).ok, 'a cent off is fine'); c.set(tot, (tv + 0.03).toFixed(2)); ok(!ev(3, c).ok, '3 cents off fails'); c.set(tot, tv.toFixed(2));
    // changing products after the fact reopens the later checkpoints
    if (shop !== 'own') { var picks = c.get('picks').slice(); var t = PJ.popup.SHOPS[shop]; picks[0] = t.products[7].id; c.set('picks', picks); var st = PJ.statuses(def, P); ok(st[1] === 'open' && st[2] === 'locked', 'a new product reopens checkpoint 2: ' + st.join(',')); }
    // the suggestion
    var sg2 = PJ.suggest(def, P); ok(sg2.ind && sg2.why, 'suggestion');
  }
});
// suggest: perfect first try, all done → MAS; a few wrong → lower
(function () {
  var x = fresh('sugg', 'snack'), c = x.c, P = x.P;
  def.checkpoints.forEach(function (cp) { cp.solve(c); var e = PJ.evaluate(def, cp, c), s = PJ.cpState(P, cp.id); s.n = 1; s.ok = 1; e.results.forEach(function (r) { if (r.f && r.graded) s.first[r.f] = 1; }); });
  ok(PJ.suggest(def, P).ind === 'MAS', 'all first try → MAS: ' + JSON.stringify(PJ.suggest(def, P)));
  var keys = Object.keys(P.cps.deal.first); keys.slice(0, Math.ceil(keys.length * 0.6)).forEach(function (k) { P.cps.deal.first[k] = 0; });
  var s2 = PJ.suggest(def, P); ok(PJ.LADDER.indexOf(s2.ind) < 6, 'some wrong → lower: ' + JSON.stringify(s2));
  P.cps.flyer.ok = 0; P.cps.us.ok = 0; var s3 = PJ.suggest(def, P); ok(PJ.LADDER.indexOf(s3.ind) < PJ.LADDER.indexOf(s2.ind) && /not done/.test(s3.why), 'missing checkpoints step down: ' + JSON.stringify(s3));
  console.log('  e.g. ' + s3.ind + ': ' + s3.why);
})();
// number parsing
[['$1,204.50', 1204.5], ['12.5 %', 12.5], ['US$ 9.99', 9.99], ['.5', 0.5], ['2,50', 2.5], ['abc', NaN], ['', NaN]].forEach(function (t) { var v = PJ.parse(t[0]); ok(isNaN(t[1]) ? isNaN(v) : v === t[1], 'parse ' + t[0] + ' → ' + v); });
// the calendar: a project day before the review
var seq = HW.Cal.sequence(); ok(seq.indexOf('p1') === seq.indexOf('u1l11') - 1 && seq.indexOf('t1') === seq.indexOf('u1l11') + 1, 'p1 before the review');
console.log((fails ? 'FAILED ' + fails : 'ok') + ' — ' + checks + ' checks');
process.exit(fails ? 1 : 0);
