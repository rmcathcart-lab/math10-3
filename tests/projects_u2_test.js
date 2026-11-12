/* Unit 2 project (Pick Your Job): the checkers, run in node. For many students × both warehouse crews × each
 * first-choice job × each savings goal, every checkpoint's solve() must pass its own check; typical mistakes must
 * fail with the targeted hint; blanks must be blanks; a cent of rounding is fine where it should be.
 *   node tests/projects_u2_test.js [students per combination] */
global.window = global;
require('../js/catalog.js'); require('../js/calendar.js'); require('../js/projects.js'); require('../js/projects/u2.js');
var HW = global.HW, PJ = HW.Projects, def = HW.PROJECTS.u2, U = PJ.u2, N = Number(process.argv[2] || 12), fails = 0, checks = 0;
function ok(cond, msg) { checks++; if (!cond) { fails++; if (fails < 40) console.log('FAIL', msg); } }
function ev(i, c) { return PJ.evaluate(def, def.checkpoints[i], c); }
function res(i, c, f) { return ev(i, c).results.filter(function (x) { return x.f === f; })[0]; }
function hintOf(i, c, f) { var r = res(i, c, f); return r ? (r.ok ? 'OK' : r.blank ? 'BLANK' : r.hint) : 'NONE'; }
function tryWrong(i, c, f, v, re, name) { var s = c.get(f); c.set(f, String(v)); var h = hintOf(i, c, f); ok(re.test(h), name + ': ' + h + ' (typed ' + v + ')'); c.set(f, s); ok(ev(i, c).ok, name + ' restored'); }
var IDX = {}; def.checkpoints.forEach(function (cp, i) { IDX[cp.id] = i; });
ok(def.checkpoints.length === 7, '7 checkpoints');
ok(def.checkpoints.every(function (cp) { return cp.goal && cp.example && cp.example.steps.length >= 2 && cp.render && cp.check && cp.solve; }), 'every checkpoint has a goal, an example, a tool, a check and solve');
var cat = {}; HW.CATALOG.forEach(function (u) { u.lessons.forEach(function (l) { cat[l.id] = u.unit; }); });
def.checkpoints.forEach(function (cp) { (cp.needs || []).forEach(function (id) { ok(cat[id] === 2, cp.id + ' needs a Unit 2 lesson: ' + id); }); });

var tally = { most: {}, hr: {} }, combos = 0;
['day', 'eve'].forEach(function (shift) {
  ['w', 'p', 't'].forEach(function (first) {
    U.GOALS.forEach(function (G, gi) {
      for (var s = 0; s < N; s++) {
        combos++;
        var P = PJ.blank(); P.seed = PJ.hash('10c-b|student' + s + '|' + shift + first + gi); var c = new PJ.Ctx(def, P, { seed: P.seed }), tag = shift + '/' + first + '/' + G.id + '#' + s;
        // nothing filled in: no checkpoint passes; checkpoint 1 then everything else
        def.checkpoints.forEach(function (cp, i) { ok(!ev(i, c).ok, tag + ' cp' + (i + 1) + ' passes blank'); });
        c.set('shift', shift); c.set('first', first); c.set('goal', G.id);
        def.checkpoints.forEach(function (cp, i) {
          cp.solve(c); var e = ev(i, c);
          ok(e.ok, tag + ' cp' + (i + 1) + ' solve() does not pass: ' + JSON.stringify(e.wrong.concat(e.blanks).slice(0, 3)));
          P.cps[cp.id] = { n: 1, first: {}, w: {}, ok: Date.now() };
        });
        ok(PJ.statuses(def, P).every(function (x) { return x === 'done'; }), tag + ' all done');
        var S = U.scen(c);
        // realistic numbers
        ok(S.wage >= 15 && S.wage <= 20, 'wage at least Alberta minimum wage');
        ok(S.tot[0] <= 44 && S.tot[1] > 44, tag + ' week 1 under 44 h, week 2 over: ' + S.tot);
        ok(Math.abs(S.sales[0] + S.sales[1] - 18000) >= 400, tag + ' sales not too close to the bonus line');
        S.days.forEach(function (d) { ok(Math.abs(d.n - 1600) >= 15, 'tree day not too close to the bonus line'); });
        S.shifts.forEach(function (r) { ok(r.start >= 300 && r.end <= 1430 && r.h > 0 && Math.abs(r.h * 4 - Math.round(r.h * 4)) < 1e-9, tag + ' shift in one day, quarter hours: ' + r.start + '-' + r.end); });
        ['w', 'p', 't'].forEach(function (j) { var n = c.num('net.' + j), g = c.num(j + '.gross'); ok(n > 600 && n < g && n / g > 0.55, tag + ' net pay sensible for ' + j + ': ' + n + ' of ' + g); });
        var m = ['w', 'p', 't'].sort(function (a, b) { return c.num('net.' + b) - c.num('net.' + a); })[0]; tally.most[m] = (tally.most[m] || 0) + 1; tally.hr[c.get('mostHr')] = (tally.hr[c.get('mostHr')] || 0) + 1;

        // ---- targeted hints ----
        var i2 = IDX.time, r = S.shifts.filter(function (x) { return x.h % 1; })[0] || S.shifts[0], hk = r.k;
        tryWrong(i2, c, hk, ((r.end - r.start) / 60).toFixed(2), /unpaid break/, 'forgot the break');
        if (r.h % 1) tryWrong(i2, c, hk, (Math.floor(r.h) + Math.round((r.h % 1) * 60) / 100).toFixed(2), /÷ 60/, 'minutes as a decimal');
        var noon = S.shifts.filter(function (x) { return x.start < 720 && x.end > 720; })[0];
        if (noon) tryWrong(i2, c, noon.k, (Math.abs((noon.end - 720) - noon.start) / 60 - noon.brk / 60).toFixed(2), /noon/, 'past noon');
        tryWrong(i2, c, hk, '', /^BLANK$/, 'blank is blank');
        c.set(hk, 'abc'); ok(res(i2, c, hk).form, 'not a number is a format slip'); c.set(hk, String(r.h));
        tryWrong(i2, c, 'wot.0', (S.tot[0] - 40).toFixed(2), /44 hours/, 'weekly limit 40 vs 44');
        tryWrong(i2, c, 'wot.1', (S.tot[1] - 40).toFixed(2), /44 hours/, 'weekly limit 40 vs 44 (week 2)');
        var d1 = c.num('dot.1'), w1 = c.num('wot.1');
        tryWrong(i2, c, 'ot.1', (d1 + w1).toFixed(2), /bigger/, 'added daily and weekly');
        tryWrong(i2, c, 'ot.1', Math.min(d1, w1).toFixed(2), /bigger/, 'used the smaller');
        var signed = S.weeks[1].reduce(function (a, x) { return a + (x.off ? 0 : x.h - 8); }, 0);
        if (Math.abs(signed - d1) > 0.01) tryWrong(i2, c, 'dot.1', signed.toFixed(2), /short day|over/, 'short day taken away');
        var i3 = IDX.gross, W = S.wage;
        tryWrong(i3, c, 'w.otr', (W + 1.5).toFixed(2), /1\.5 × the wage/, 'OT rate +1.50');
        tryWrong(i3, c, 'w.otr', (2 * W).toFixed(2), /double/, 'OT rate double');
        tryWrong(i3, c, 'w.op', (c.num('w.oth') * W).toFixed(2), /overtime rate/, 'OT at the regular wage');
        tryWrong(i3, c, 'w.rp', ((c.num('w.reg') + c.num('w.oth')) * W).toFixed(2), /regular/, 'all hours at regular');
        tryWrong(i3, c, 'w.reg', (c.num('w.reg') + c.num('w.oth')).toFixed(2), /overtime/, 'regular hours with overtime in');
        tryWrong(i3, c, 'w.gross', (c.num('w.rp') + c.num('w.op')).toFixed(2), /premium/, 'gross without premium');
        tryWrong(i3, c, 'p.com', (c.num('p.sales') * S.rate).toFixed(2), /100 times/, 'commission percent not a decimal');
        tryWrong(i3, c, 'p.gross', (c.num('p.com') + c.num('p.bon')).toFixed(2), /base salary/, 'gross without base');
        tryWrong(i3, c, 'p.bon', c.num('p.bon') ? '0' : '150', c.num('p.bon') ? /earn the/ : /under/, 'bonus');
        tryWrong(i3, c, 't.ep', (c.num('t.easy') * S.r1 * 100).toFixed(2), /cents/, 'cents as dollars');
        tryWrong(i3, c, 't.easy', String(c.num('t.easy') + c.num('t.rough')), /easy/, 'all trees for easy ground');
        tryWrong(i3, c, 't.rp', (c.num('t.rough') * S.r1).toFixed(2), /higher rate/, 'rough ground at the easy rate');
        // a cent off a gross pay is fine; 3 cents is not
        var gv = c.num('w.gross'); c.set('w.gross', (gv + 0.01).toFixed(2)); ok(ev(i3, c).ok, 'a cent off is fine'); c.set('w.gross', (gv + 0.03).toFixed(2)); ok(!ev(i3, c).ok, '3 cents off fails'); c.set('w.gross', gv.toFixed(2));
        var i4 = IDX.stub, g = c.num(first + '.gross');
        tryWrong(i4, c, 'cpp.' + first, (g * 0.595).toFixed(2), /0\.0595/, 'CPP 0.595');
        tryWrong(i4, c, 'ei.' + first, (g * 0.164).toFixed(2), /0\.0164/, 'EI 0.164');
        tryWrong(i4, c, 'tax.' + first, (g * 0.015).toFixed(2), /0\.15/, 'tax 0.015');
        tryWrong(i4, c, 'net.' + first, (g + c.num('td.' + first)).toFixed(2), /Subtract/, 'net added');
        tryWrong(i4, c, 'keep.' + first, (c.num('td.' + first) / g * 100).toFixed(1), /taken|keep/, 'take-home percent flipped');
        if (first === 't') tryWrong(i4, c, 'oth.t', '25', /each/, 'camp costs for one day');
        var o = ['w', 'p', 't'].filter(function (j) { return j !== first; })[0], go = c.num(o + '.gross');
        tryWrong(i4, c, 'td.' + o, (go * 0.2259).toFixed(2), /too|Add the/, 'other job: forgot the other deduction');
        var i5 = IDX.goal, Pz = G.own ? 850 : G.price, gn = c.num('gNeed');
        tryWrong(i5, c, 'gNeed', (Pz * 0.7741).toFixed(2), /divide/, 'gross needed multiplied');
        tryWrong(i5, c, 'keepPct', '22.59', /off/, 'percent kept flipped');
        var hx = gn / W; if (Math.abs(hx - Math.round(hx)) > 0.02) { tryWrong(i5, c, 'bk.w', String(Math.floor(hx)), /up/, 'hours rounded down'); tryWrong(i5, c, 'bk.w', hx.toFixed(2), /up/, 'hours not rounded'); }
        tryWrong(i5, c, 'bk.p', String(Math.ceil(gn / S.rate)), /decimal/, 'sales: percent not a decimal');
        tryWrong(i5, c, 'bk.t', String(Math.ceil(gn / (S.r1 * 100))), /cents/, 'trees: cents');
        var sx = gn / (S.rate / 100); c.set('bk.p', sx.toFixed(2)); ok(ev(i5, c).ok, 'sales to the cent is fine'); c.set('bk.p', String(Math.ceil(sx)));
        var i6 = IDX.compare;
        tryWrong(i6, c, 'ph.w', (c.num('w.gross') / (c.num('tot.0') + c.num('tot.1'))).toFixed(2), /net/, 'per hour from gross');
        tryWrong(i6, c, 'steady', 'p', /commission/, 'steadiest: phone');
        tryWrong(i6, c, 'adv.w', 'p1', /phone store/, 'advantage of another job');
        var why = c.get('why'); c.set('why', 'Because I like it a lot and it is a good job for me.'); ok(/number/.test(hintOf(i6, c, 'why')), 'recommendation needs a number'); c.set('why', why);
        var i7 = IDX.offer, nt = c.num('net.' + c.get('take'));
        tryWrong(i7, c, 'summer', (2 * nt).toFixed(2), /4/, 'summer: 2 pays');
        tryWrong(i7, c, 'enough', c.get('enough') === 'yes' ? 'no' : 'yes', /Compare/, 'enough: wrong');
        // changing the warehouse crew reopens checkpoint 2 (different shifts)
        var sh0 = c.get('shift'); c.set('shift', sh0 === 'day' ? 'eve' : 'day'); var st = PJ.statuses(def, P); ok(ev(1, c).ok ? st[1] === 'done' && st.indexOf('open') > 1 : st[1] === 'open' && st[2] === 'locked', tag + ' a new crew reopens checkpoint 2 (unless the hours come out the same): ' + st.join(',')); c.set('shift', sh0);
        ok(PJ.statuses(def, P).every(function (x) { return x === 'done'; }), tag + ' back to all done');
        // the offer (final product) is built
        var oh = def.flyer(c); ok(/JOB OFFER/.test(oh) && oh.indexOf(PJ.money(c.num('net.' + c.get('take')))) > 0 && oh.indexOf('Sam Student') > 0, tag + ' the job offer shows the net pay and the name');
        var sg = PJ.suggest(def, P); ok(sg.ind && sg.why, 'suggestion');
      }
    });
  });
});
// own goal: a silly price is refused
(function () {
  var P = PJ.blank(); P.seed = 7; var c = new PJ.Ctx(def, P, { seed: 7 }); c.set('shift', 'day'); c.set('first', 'w');
  def.checkpoints.slice(0, 4).forEach(function (cp) { cp.solve(c); });
  c.set('goal', 'own'); c.set('goalName', 'Drum kit'); c.set('goalPrice', '20'); var e = ev(IDX.goal, c); ok(!e.ok && e.results.some(function (r) { return r.msg && !r.ok; }), 'own goal under $100 refused');
  c.set('goalPrice', '1200'); def.checkpoints[IDX.goal].solve(c); ok(ev(IDX.goal, c).ok, 'own goal $1200 works');
})();
// suggest: all first try → MAS
(function () {
  var P = PJ.blank(); P.seed = 99; var c = new PJ.Ctx(def, P, { seed: 99 }); c.set('shift', 'eve'); c.set('first', 'p'); c.set('goal', 'car');
  def.checkpoints.forEach(function (cp) { cp.solve(c); var e = PJ.evaluate(def, cp, c), s = PJ.cpState(P, cp.id); s.n = 1; s.ok = 1; e.results.forEach(function (r) { if (r.f && r.graded) s.first[r.f] = 1; }); });
  ok(PJ.suggest(def, P).ind === 'MAS', 'all first try → MAS: ' + JSON.stringify(PJ.suggest(def, P)));
})();
// the calendar puts a p2 day before the review when the catalog has the project
(function () {
  var u = HW.CATALOG.filter(function (x) { return x.unit === 2; })[0], had = u.project; u.project = { id: 'u2', title: 'Pick Your Job' };
  var seq = []; HW.CATALOG.forEach(function (x) { var ks = x.lessons.map(function (l) { return l.id; }); if (x.project) ks.splice(ks.length - 1, 0, 'p' + x.unit); seq = seq.concat(ks, ['t' + x.unit]); });
  ok(seq.indexOf('p2') === seq.indexOf('u2l9') - 1, 'p2 right before the Unit 2 review'); u.project = had;
})();
console.log('  ' + combos + ' students. Most take-home: ' + JSON.stringify(tally.most) + ' · most per hour: ' + JSON.stringify(tally.hr));
console.log((fails ? 'FAILED ' + fails : 'ok') + ' — ' + checks + ' checks');
process.exit(fails ? 1 : 0);
