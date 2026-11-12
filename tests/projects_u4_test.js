/* Unit 4 project (Recipe Rescue): the checkers, run in node. For every recipe, every "people" choice, every container
 * and many students, each checkpoint's solve() must pass its own check; typical mistakes must fail with the targeted
 * hint; blanks must be reported as blanks; the seeded numbers must be sensible.
 *   node tests/projects_u4_test.js [students per recipe] */
global.window = global;
require('../js/catalog.js');
// the catalog line this project needs (added by hand in js/catalog.js when the project goes live)
global.HW.CATALOG.filter(function (u) { return u.unit === 4; })[0].project = { id: 'u4', title: 'Recipe Rescue' };
require('../js/calendar.js'); require('../js/projects.js'); require('../js/projects/u4.js');
var HW = global.HW, PJ = HW.Projects, X = PJ.recipe, def = HW.PROJECTS.u4, N = Number(process.argv[2] || 40), fails = 0, checks = 0;
function ok(cond, msg) { checks++; if (!cond) { fails++; if (fails < 40) console.log('FAIL', msg); } }
function fresh(seedStr, recipe, ppl, cont) { var P = PJ.blank(); P.seed = PJ.hash(seedStr); var c = new PJ.Ctx(def, P, { seed: P.seed }); c.set('recipe', recipe); if (ppl) c.set('people', String(ppl)); if (cont) c.set('cont', cont); return { P: P, c: c }; }
function ev(i, c) { return PJ.evaluate(def, def.checkpoints[i], c); }
function res(i, c, f) { return ev(i, c).results.filter(function (x) { return x && x.f === f; })[0]; }
function hintOf(i, c, f) { var r = res(i, c, f); return r ? (r.ok ? 'OK' : r.blank ? 'BLANK' : r.hint) : 'NONE'; }
function tryHint(i, c, f, v, re, msg) { var save = c.get(f); c.set(f, String(v)); var h = hintOf(i, c, f); ok(re.test(h), msg + ' [' + v + '] → ' + h); c.set(f, save); }
function stillOk(i, c, f, v, msg) { var save = c.get(f); c.set(f, String(v)); var r = res(i, c, f); ok(r && r.ok, msg + ' [' + v + '] should pass: ' + hintOf(i, c, f)); c.set(f, save); }
function mustFail(i, c, f, v, msg) { var save = c.get(f); c.set(f, String(v)); var r = res(i, c, f); ok(r && !r.ok, msg + ' [' + v + '] should fail'); c.set(f, save); }
var CP = { pick: 0, scale: 1, fit: 2, temp: 3, metric: 4, shop: 5, card: 6 };

Object.keys(X.RECIPES).forEach(function (rk) {
  var R = X.RECIPES[rk];
  for (var s = 0; s < N; s++) {
    var ppl = R.people[s % R.people.length], ck = R.cont[Math.floor(s / R.people.length) % R.cont.length].id;
    var x = fresh('class|student' + s + '|' + rk, rk, ppl, ck), c = x.c, P = x.P, tag = rk + ' s' + s + ' (' + ppl + ', ' + ck + ')';
    def.checkpoints.forEach(function (cp, i) {
      if (i > 1) { var e0 = ev(i, c); ok(!e0.ok, tag + ' cp' + (i + 1) + ' passes before it is done'); }
      cp.solve(c);
      var e = ev(i, c);
      ok(e.ok, tag + ' cp' + (i + 1) + ' solve() does not pass: ' + JSON.stringify(e.wrong.concat(e.blanks).slice(0, 3)));
      P.cps[cp.id] = { n: 1, first: {}, w: {}, ok: Date.now() };
    });
    ok(PJ.statuses(def, P).every(function (st) { return st === 'done'; }), tag + ' all done');
    ok(c.get('cont') === ck && c.get('people') === String(ppl), tag + ' solve kept the student’s own choices');

    // ---- sensible numbers ----
    var f = X.factor(c); ok(f >= 1.5 && f <= 6 && Math.abs(f * 2 - Math.round(f * 2)) < 1e-9, tag + ' scale factor is a whole or half number: ' + f);
    R.ings.forEach(function (g) { if (g.u === 'ea') ok(Math.abs(X.scaled(c, g) - Math.round(X.scaled(c, g))) < 1e-9, tag + ' whole eggs'); });
    var n = X.contCount(c); ok(n >= 1 && n <= 6, tag + ' containers needed 1–6: ' + n);
    X.RECIPES[rk].ings.filter(function (g) { return g.shop; }).forEach(function (g) { var p = X.prices(c, g); ok(Math.abs(p.aKg - p.B) / p.B >= 0.05 && p.A > 0.1 && p.B > 0.5, tag + ' store prices differ by 5%+: ' + JSON.stringify(p)); ok(Math.abs(p.A * 2.2 - p.B) / p.B >= 0.03, tag + ' still clear with ×2.2: ' + JSON.stringify(p)); });
    var T = X.exactTotal(c), B = X.budget(c); ok(T > 10 && T < 120, tag + ' a realistic total: ' + T); ok(Math.abs(B - T) >= 3 && B > 0 && B % 5 === 0, tag + ' the budget is not too close to call: ' + B + ' vs ' + T);

    // ---- targeted hints ----
    // cp2: scale factor flipped; an amount added instead of multiplied; amounts as fractions
    tryHint(1, c, 'f', (R.serves / ppl).toFixed(3), /Flip it/, tag + ' factor flipped');
    var g0 = R.ings[0], k0 = 'sc.' + g0.id, a0 = g0.amt * f;
    if (Math.abs(g0.amt + f - a0) > 0.01) tryHint(1, c, k0, g0.amt + f, /don’t add/, tag + ' added the factor');
    tryHint(1, c, k0, g0.amt, /original recipe/, tag + ' unscaled amount');
    tryHint(1, c, k0, g0.amt * ppl, /not by the number of people/, tag + ' multiplied by people');
    var w = Math.floor(a0), fr = a0 - w, fs = fr ? (fr === 0.5 ? '1/2' : fr === 0.25 ? '1/4' : fr === 0.75 ? '3/4' : fr === 0.125 ? '1/8' : fr === 0.375 ? '3/8' : fr === 0.625 ? '5/8' : '7/8') : '';
    if (fs) { stillOk(1, c, k0, w + ' ' + fs, tag + ' mixed number'); stillOk(1, c, k0, X.frac(a0) + ' lb', tag + ' unicode fraction + unit'); stillOk(1, c, k0, (w * 8 + fr * 8) + '/8', tag + ' improper fraction'); }
    tryHint(1, c, k0, '', /BLANK/, tag + ' blank is blank');
    ok(res(1, (function () { c.set(k0, 'lots'); return c; })(), k0).form, tag + ' a word is a format slip'); c.set(k0, String(a0));
    // cp3: metric cup, diameter for radius, full height, round down, US pint for British
    var cups = R.yld.cups * f;
    tryHint(2, c, 'yMl', (cups * 250).toFixed(0), /Canadian metric cup/, tag + ' 250 mL cup');
    tryHint(2, c, 'yL', (Number(c.get('yMl')) / 100).toFixed(2), /1000/, tag + ' mL ÷ 100');
    var K = X.cont(c), V = X.contVol(K);
    if (K.shape === 'cyl') {
      tryHint(2, c, 'rad', K.d, /diameter/, tag + ' radius = diameter');
      tryHint(2, c, 'vol', (Math.PI * K.d * K.d * K.fill).toFixed(1), /diameter/, tag + ' volume with the diameter');
      tryHint(2, c, 'vol', (Math.PI * K.d * K.d / 4 * K.H).toFixed(1), /fill line/, tag + ' volume with the whole height');
      tryHint(2, c, 'vol', (2 * Math.PI * K.d / 2 * K.fill).toFixed(1), /area of the side/, tag + ' 2πrh');
      stillOk(2, c, 'vol', (3.14 * K.d * K.d / 4 * K.fill).toFixed(0), tag + ' π = 3.14 is fine');
    } else {
      tryHint(2, c, 'vol', K.l * K.w * K.H, /batter only goes/, tag + ' pan: whole height');
      tryHint(2, c, 'vol', K.l * K.w, /area of the bottom/, tag + ' pan: no height');
    }
    tryHint(2, c, 'cap', (V / 1000 * 1000).toFixed(0), /1000 times too big/, tag + ' capacity left in cm³');
    var need = Number(c.get('nCont')), ratio = Number(c.get('yL')) / Number(c.get('cap'));
    if (Math.floor(ratio) >= 1 && Math.floor(ratio) < need) tryHint(2, c, 'nCont', Math.floor(ratio), /Round <b>up<\/b>/, tag + ' rounded down');
    if (Math.abs(ratio - Math.round(ratio)) > 0.01) tryHint(2, c, 'nCont', ratio.toFixed(2), /whole number/, tag + ' a decimal number of pots');
    var tw = R.twist; tryHint(2, c, 'tw.br', (tw.brP * 473).toFixed(0), /US<\/b> pint/, tag + ' British = US pint');
    tryHint(2, c, 'tw.pct', (Number(c.get('tw.diff')) / Number(c.get('tw.br')) * 100).toFixed(1), /smaller/, tag + ' percent of the wrong base');
    var sm = c.get('tw.more'); c.set('tw.more', 'same'); ok(!ev(2, c).ok, tag + ' "the same" fails'); c.set('tw.more', sm);
    // cp4: brackets, quick estimate, wrong formula, sign; yes/no answers
    var F = R.hot.F;
    tryHint(3, c, 'hotC', (F - 32 * 1.8).toFixed(1), /brackets/, tag + ' no brackets');
    tryHint(3, c, 'hotC', ((F - 30) / 2).toFixed(1), /quick estimate/, tag + ' quick estimate');
    tryHint(3, c, 'hotC', (F / 1.8).toFixed(1), /Subtract 32/, tag + ' forgot −32');
    tryHint(3, c, 'fzC', '17.8', /sign|below zero/, tag + ' lost the minus sign');
    stillOk(3, c, 'fzC', '-18', tag + ' whole number −18 is fine');
    stillOk(3, c, 'fzC', '−17.8', tag + ' unicode minus is fine');
    var rc = Number(c.get('roomF')); tryHint(3, c, 'roomF', ((((rc - 32) / 1.8) + 32) * 1.8).toFixed(1), /Multiply by 1.8 <b>first/, tag + ' (C + 32) × 1.8');
    var fq = c.get('frQ'); c.set('frQ', fq === 'yes' ? 'no' : 'yes'); ok(!ev(3, c).ok, tag + ' wrong fridge answer fails'); c.set('frQ', fq);
    var zq = c.get('fzQ'); c.set('fzQ', zq === 'yes' ? 'no' : 'yes'); ok(/negative/.test(hintOf(3, c, 'fzQ')), tag + ' freezer hint'); c.set('fzQ', zq);
    // cp5: every unit's typical slip; the card rounding
    R.ings.forEach(function (g) {
      if (g.u === 'ea') return;
      var A = X.scaled(c, g), mk = 'm.' + g.id, e = X.metricExact(c, g);
      if (g.u === 'cup') tryHint(4, c, mk, (A * 250).toFixed(0), /Canadian metric cup/, tag + ' cup ×250');
      if (g.u === 'floz') tryHint(4, c, mk, (A * 28.35).toFixed(1), /mass/, tag + ' fl oz × 28.35');
      if (g.u === 'tbsp') tryHint(4, c, mk, A * 5, /teaspoon/, tag + ' tbsp × 5');
      if (g.u === 'tsp') tryHint(4, c, mk, A * 15, /tablespoon/, tag + ' tsp × 15');
      if (g.u === 'lb') { tryHint(4, c, mk, (A * 0.454).toFixed(3), /kilograms/, tag + ' lb in kg'); tryHint(4, c, mk, (A * 2.2).toFixed(2), /less<\/b> than a kilogram/, tag + ' lb × 2.2'); stillOk(4, c, mk, (A / 2.2 * 1000).toFixed(0), tag + ' lb ÷ 2.2 × 1000 is fine'); stillOk(4, c, mk, (A * 453.6).toFixed(0), tag + ' 453.6 g is fine'); }
      if (g.u === 'oz') tryHint(4, c, mk, (A * 29.57).toFixed(0), /fluid/, tag + ' oz × 29.57');
      if (Math.abs(f - 1) > 1e-9) tryHint(4, c, mk, (g.amt * X.U[g.u].f).toFixed(0), /original recipe/, tag + ' unscaled');
      var t = X.cardTarget(e), cv = 'cv.' + g.id, cu = 'cu.' + g.id, su = c.get(cu);
      if (t.big) {
        c.set(cu, 's'); tryHint(4, c, cv, Math.round(e), /change it to/, tag + ' ' + g.id + ' card left in small units'); c.set(cu, su);
        if (Math.abs(e / 1000 - t.v) > 0.0015) tryHint(4, c, cv, (e / 1000).toFixed(3), /one decimal/, tag + ' ' + g.id + ' card not rounded');
        c.set(cu, 's'); mustFail(4, c, cv, t.v * 1000, tag + ' ' + g.id + ' 1000 or more must be in L/kg'); c.set(cu, su);
      } else {
        if (Math.abs(Math.round(e) - t.v) > 0.5) tryHint(4, c, cv, Math.round(e), /round it/, tag + ' ' + g.id + ' card not rounded');
        c.set(cu, 'b'); stillOk(4, c, cv, t.v / 1000, tag + ' ' + g.id + ' the same amount in L/kg is fine'); c.set(cu, su);
      }
    });
    // cp6: per lb → per kg the wrong way, kg × price per lb, the other store; pounds × price per pound is fine
    X.RECIPES[rk].ings.filter(function (g) { return g.shop; }).forEach(function (g) {
      var p = X.prices(c, g), pre = 'g.' + g.id + '.';
      tryHint(5, c, pre + 'pk', (p.A / 2.2).toFixed(2), /more<\/b> than a pound/, tag + ' per kg divided');
      stillOk(5, c, pre + 'pk', (p.A * 2.2).toFixed(2), tag + ' ×2.2 is fine'); stillOk(5, c, pre + 'pk', (p.A / 0.454).toFixed(2), tag + ' ÷0.454 is fine');
      var kg = X.metricExact(c, g) / 1000;
      tryHint(5, c, pre + 'kg', (kg * 1000).toFixed(0), /1000 times too big/, tag + ' grams in the kg box');
      var st = c.get(pre + 'st'), other = st === 'A' ? p.B : p.aKg;
      tryHint(5, c, pre + 'cost', (kg * other).toFixed(2), /other store/, tag + ' cost at the other store');
      if (st === 'A') { stillOk(5, c, pre + 'cost', ((X.scaled(c, g) * (g.u === 'oz' ? 1 / 16 : 1)) * p.A).toFixed(2), tag + ' lb × $/lb is fine'); tryHint(5, c, pre + 'cost', (kg * p.A).toFixed(2), /per <b>pound/, tag + ' kg × $/lb'); }
      c.set(pre + 'st', st === 'A' ? 'B' : 'A'); ok(!ev(5, c).ok, tag + ' the dearer store fails'); c.set(pre + 'st', st);
    });
    var bq = c.get('budget'); c.set('budget', bq === 'under' ? 'over' : 'under'); ok(!ev(5, c).ok, tag + ' wrong budget answer fails'); c.set('budget', bq);
    tryHint(5, c, 'sup.gst', (R.sup.price * 1.05).toFixed(2), /total/, tag + ' GST = total');
    // cp7: cost per person, the 250 mL question
    var t7 = Number(c.get('total'));
    tryHint(6, c, 'perServ', (ppl / t7).toFixed(2), /Flip/, tag + ' per person flipped');
    var ex = R.ings.filter(function (g) { return g.id === R.extra; })[0], cx = X.scaled(c, ex);
    tryHint(6, c, 'extra', (cx * 250).toFixed(0), /difference/, tag + ' extra = whole amount');
    // a cent of rounding is fine, 3 cents is not
    var tt = Number(c.get('total')); c.set('total', (tt + 0.01).toFixed(2)); var ok1 = ev(5, c).ok; c.set('total', (tt + 0.05).toFixed(2)); var ok2 = ev(5, c).ok; c.set('total', tt.toFixed(2));
    ok(ok1 || c.get('budget') !== (tt + 0.01 <= X.budget(c) ? 'under' : 'over'), tag + ' a cent off the total is fine'); ok(!ok2, tag + ' 5 cents off fails');
    // changing the people reopens checkpoint 2 and locks the rest
    c.set('people', String(R.people[(s + 1) % R.people.length])); var st2 = PJ.statuses(def, P); ok(st2[1] === 'open' && st2[2] === 'locked', tag + ' new people reopen checkpoint 2: ' + st2.join(','));
    c.set('people', String(ppl)); ok(PJ.statuses(def, P).every(function (q) { return q === 'done'; }), tag + ' back to done');
    // the card renders the student's numbers (no DOM needed for the html)
    var html = def.flyer(c); ok(html.indexOf(PJ.esc(c.get('dish'))) >= 0 && html.indexOf('°C') >= 0 && html.indexOf(PJ.money(tt)) >= 0, tag + ' card shows dish, °C and total');
    ok(PJ.suggest(def, P).ind, 'suggestion');
  }
});
// suggest: perfect first try → MAS; some wrong → lower
(function () {
  var x = fresh('sugg', 'chili', 30, 'stock'), c = x.c, P = x.P;
  def.checkpoints.forEach(function (cp) { cp.solve(c); var e = PJ.evaluate(def, cp, c), s = PJ.cpState(P, cp.id); s.n = 1; s.ok = 1; e.results.forEach(function (r) { if (r && r.f && r.graded) s.first[r.f] = 1; }); });
  ok(PJ.suggest(def, P).ind === 'MAS', 'all first try → MAS: ' + JSON.stringify(PJ.suggest(def, P)));
  var keys = Object.keys(P.cps.metric.first); keys.slice(0, Math.ceil(keys.length * 0.7)).forEach(function (k) { P.cps.metric.first[k] = 0; });
  var s2 = PJ.suggest(def, P); ok(PJ.LADDER.indexOf(s2.ind) < 6, 'some wrong → lower: ' + JSON.stringify(s2));
  console.log('  e.g. ' + s2.ind + ': ' + s2.why);
})();
// amounts: fractions and mixed numbers
[['3 3/4', 3.75], ['3-3/4', 3.75], ['15/4', 3.75], ['3¾', 3.75], ['3 ¾ cups', 3.75], ['½', 0.5], ['6.75 lb', 6.75], ['12 oz', 12], ['abc', NaN], ['', NaN], ['2/0', NaN]].forEach(function (t) { var v = X.parseAmt(t[0]); ok(isNaN(t[1]) ? isNaN(v) : Math.abs(v - t[1]) < 1e-9, 'parseAmt ' + t[0] + ' → ' + v); });
[[6.75, '6¾'], [5.625, '5⅝'], [0.5, '½'], [3, '3'], [1.5, '1½']].forEach(function (t) { ok(X.frac(t[0]) === t[1], 'frac ' + t[0] + ' → ' + X.frac(t[0])); });
// card rounding rule
[[37, 35, false], [888.75, 890, false], [3405, 3.4, true], [97, 95, false], [1777.5, 1.8, true], [2, 5, false]].forEach(function (t) { var r = X.cardTarget(t[0]); ok(r.v === t[1] && r.big === t[2], 'cardTarget ' + t[0] + ' → ' + JSON.stringify(r)); });
// the calendar: a project day before the Unit 4 review
var seq = HW.Cal.sequence(); ok(seq.indexOf('p4') === seq.indexOf('u4l7') - 1 && seq.indexOf('t4') === seq.indexOf('u4l7') + 1, 'p4 before the review');
console.log((fails ? 'FAILED ' + fails : 'ok') + ' — ' + checks + ' checks');
process.exit(fails ? 1 : 0);
