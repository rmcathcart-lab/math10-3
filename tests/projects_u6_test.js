/* Unit 6 project (Scale It): the checkers, run in node. For every build (and many students), each checkpoint's solve()
 * must pass its own check and a later checkpoint must not pass before it is done; typical mistakes must fail with the
 * targeted hint; answers that follow from the student's own earlier numbers must be accepted; the geometry must be sound
 * (the logo versions really are similar / equal-angled / proportional; the drawing fits the grid; the plan fits).
 *   node tests/projects_u6_test.js [students per build] */
global.window = global;
require('../js/catalog.js'); require('../js/calendar.js'); require('../js/projects.js'); require('../js/projects/u6.js');
var HW = global.HW, PJ = HW.Projects, G6 = PJ.scale, def = HW.PROJECTS.u6, N = Number(process.argv[2] || 40), fails = 0, checks = 0;
function ok(cond, msg) { checks++; if (!cond) { fails++; if (fails < 40) console.log('FAIL', msg); } }
function fresh(seedStr) { var P = PJ.blank(); P.seed = PJ.hash(seedStr); return { P: P, c: new PJ.Ctx(def, P, { seed: P.seed }) }; }
function ev(i, c) { return PJ.evaluate(def, def.checkpoints[i], c); }
function res(i, c, f) { return ev(i, c).results.filter(function (x) { return x.f === f; })[0]; }
function hintOf(i, c, f) { var r = res(i, c, f); return r ? (r.ok ? 'OK' : r.blank ? 'BLANK' : r.hint) : 'NONE'; }
function tryHint(i, c, f, val, re, msg) { var save = c.get(f); c.set(f, String(val)); var h = hintOf(i, c, f); ok(re.test(h), msg + ' → ' + h + ' (typed ' + val + ')'); c.set(f, save); ok(ev(i, c).ok, msg + ': restored'); }
function close(a, b, t) { return Math.abs(a - b) <= (t || 1e-6); }
var seen = { logo: {}, order: {}, draw: {}, scale: {}, shad: {}, mirr: {}, kinds: {} };

['tiny', 'skate', 'truck'].forEach(function (bid) {
  for (var s = 0; s < N; s++) {
    var x = fresh('10c-b|student' + s + '|' + bid), c = x.c, P = x.P;
    c.set('build', bid);
    def.checkpoints.forEach(function (cp, i) {
      if (i > 0) ok(!ev(i, c).ok, bid + ' cp' + (i + 1) + ' passes before it is done');
      cp.solve(c);
      var e = ev(i, c);
      ok(e.ok, bid + ' seed ' + s + ' cp' + (i + 1) + ' solve() does not pass: ' + JSON.stringify(e.wrong.concat(e.blanks).slice(0, 3)));
      P.cps[cp.id] = { n: 1, first: {}, w: {}, ok: Date.now() };
    });
    ok(PJ.statuses(def, P).every(function (st) { return st === 'done'; }), bid + ' all done');
    var J = G6.job(c), Lg = G6.logos(c), Sh = G6.shapeOf(c), Z = G6.site(c), sc = G6.scaleOf(c);
    seen.logo[bid + JSON.stringify(Lg.p)] = 1; seen.order[Lg.order.join('')] = 1; seen.draw[bid + Sh.D.name] = 1; seen.scale[bid + sc] = 1; seen.shad[Z.S.S] = 1; seen.mirr[Z.M.d2] = 1;

    // ---- the logo versions ----
    var O = Lg.orig, types = Lg.LG.types;
    ok(Lg.vers.A && Lg.vers.B && Lg.vers.C && Lg.vers[Lg.simL].role === 'sim', bid + ' three versions, one similar');
    ['A', 'B', 'C'].forEach(function (L) {
      var V = Lg.vers[L], rs = types.map(function (t) { return V.ratio[t]; }), same = rs.every(function (r) { return close(r, rs[0], 1e-9); });
      var angSame = V.ang.every(function (a, j) { return close(a, O.ang[j], 1e-6); }), labSame = V.angR.every(function (a, j) { return a === O.angR[j]; });
      ok(G6.convex(V.P), bid + ' version ' + L + ' convex');
      ok(V.sides.every(function (x) { return x >= 1; }), bid + ' sides big enough');
      if (V.role === 'sim') { ok(same && angSame && labSame, bid + ' similar version: ratios ' + rs + ' angles ' + V.angR + ' vs ' + O.angR); ok(rs[0] >= 1.5, 'an enlargement'); }
      if (V.role === 'stretch') { ok(!same && angSame && labSame, bid + ' stretched: same angles, ratios differ ' + rs); ok(rs.some(function (r) { return Math.abs(r - rs[0]) >= 0.2; }) || rs.some(function (r) { return Math.abs(r - rs[rs.length - 1]) >= 0.2; }), 'ratios clearly different: ' + rs); }
      if (V.role === 'lean') {
        ok(same, bid + ' lean: every side ratio the same ' + rs);
        var d = V.angR.map(function (a, j) { return Math.abs(a - O.angR[j]); }); ok(d.filter(function (q) { return q >= 5; }).length >= 2, bid + ' lean: angles clearly different ' + V.angR + ' vs ' + O.angR);
        // the side labels really are the original × k (side by side, not just by type)
        V.sides.forEach(function (x, j) { ok(close(x, G6.sides(G6.logoPts(Lg.kind, Lg.p))[j] * rs[0], 0.006), 'lean side ' + j); });
      }
    });
    // the logo drawings and labels: the angle sum is right; a rounded angle never sits on a .5 (so rounding is stable)
    O.ang.forEach(function (a) { ok(Math.abs(a - Math.floor(a) - 0.5) > 0.001, 'angle not on a half: ' + a); });
    ok(O.angR.reduce(function (a, b) { return a + b; }, 0) === (O.P.length - 2) * 180, bid + ' original angle labels add to (n − 2) × 180: ' + O.angR);

    // ---- the build and the model ----
    ok(close(J.mL, J.L * 100 * J.k, 1e-6) && J.mL >= 15 && J.mL <= 85, bid + ' model length on a table: ' + J.mL);
    ok(J.mH >= 0.8 && J.mW >= 5, bid + ' model sizes sensible ' + J.mW + ' ' + J.mH);
    // ---- the drawing fits the grid at every k ----
    ['0.5', '1.5', '2', '2.5'].forEach(function (k) {
      k = Number(k); ok(Sh.w * k + 1 <= G6.GW && Sh.h * k + 1 <= G6.GH, bid + ' drawing fits at k = ' + k);
      Sh.P.forEach(function (p) { ok(Number.isInteger(p[0] * k) && Number.isInteger(p[1] * k), 'grid points at k = ' + k); });
    });
    ok(G6.convex(Sh.P), bid + ' drawing shape convex');
    // ---- the plan: at least one scale fits, at least one doesn't; the pieces fit inside ----
    var fitN = J.b.scales.filter(function (q) { return G6.fits(J, q); }).length;
    ok(fitN >= 1 && fitN < J.b.scales.length, bid + ' some scales fit and some don’t: ' + fitN);
    J.b.items.forEach(function (it) { J.b.scales.forEach(function (q) { if (G6.fits(J, q)) ok(it.L / q <= J.L / q && it.W / q <= J.W / q && it.L / q >= 0.5, 'piece fits ' + it.name); }); });
    var st = G6.placeState(c, J, sc); ok(!st.bad && st.d >= 1, bid + ' auto placement valid: ' + st.bad + ' ' + st.d);
    // ---- the site ----
    ok(Z.S.H >= 10 && Z.S.H <= 30 && Z.M.P >= 5 && Z.M.P <= 12, bid + ' heights sensible: ' + Z.S.H + ' ' + Z.M.P);
    ok(G6.cardHtml(c).indexOf('pj-u6-card') > 0 && G6.cardHtml(c).indexOf('1 : ' + Number((sc * 100).toFixed(2))) > 0, bid + ' card shows the scale');

    // ---- targeted hints ----
    if (s % 4 === 0) {
      var sim = Lg.vers[Lg.simL], strL = 'ABC'[Lg.order.indexOf('stretch')], leanL = 'ABC'[Lg.order.indexOf('lean')], t0 = types[0];
      tryHint(1, c, 'rat.' + Lg.simL + '.' + t0, (O.by[t0] / sim.by[t0]).toFixed(2), /upside down/, 'ratio upside down');
      tryHint(1, c, 'rat.' + Lg.simL + '.' + t0, (sim.by[t0] - O.by[t0]).toFixed(1), /difference/, 'ratio as a difference');
      tryHint(1, c, 'ver.' + strL, 'sim', /every/, 'stretched called similar');
      tryHint(1, c, 'ver.' + leanL, 'sim', /angles/, 'lean called similar');
      tryHint(1, c, 'ver.' + Lg.simL, 'size', /different sizes/, 'size is not a reason');
      tryHint(1, c, 'ang.' + leanL, 'yes', /different/, 'lean angles said to match');
      var rr = Lg.vers[Lg.simL].ratio[t0]; c.set('rat.' + Lg.simL + '.' + t0, String(Math.round(rr * 10) / 10)); ok(res(1, c, 'rat.' + Lg.simL + '.' + t0).ok, 'a ratio to one decimal is fine'); def.checkpoints[1].solve(c);
      // scale factor
      tryHint(2, c, 'k', J.L * 100 / J.mL, /upside down/, 'k upside down');
      tryHint(2, c, 'k', J.mL / J.L, /units/, 'k without changing m to cm');
      tryHint(2, c, 'k', '1/' + Math.round(1 / J.k), /OK/, 'k as a fraction');
      tryHint(2, c, 'k', '1:' + Math.round(1 / J.k), /OK/, 'k as a ratio');
      tryHint(2, c, 'mW', (J.W * J.k).toFixed(4), /metres/, 'model width left in metres');
      tryHint(2, c, 'mW', (J.W * 100 / J.k).toFixed(1), /divided/, 'model width divided by k');
      tryHint(2, c, 'rF', (J.mF * J.k).toFixed(5), /multiplied/, 'back to real multiplied by k');
      tryHint(2, c, 'rF', String(J.b.feat.real * 100), /cm to m|÷ 100/, 'back to real left in cm');
      tryHint(2, c, 'kind', 'enl', /reduction/, 'model called an enlargement');
      tryHint(2, c, 'Lcm', String(J.L * 10), /100/, 'm to cm × 10');
      // the drawing
      var k = Number(c.get('dk')), mk = function (f, off) { return JSON.stringify(Sh.P.map(function (p) { return [1 + p[0] * f + (off ? off(p) : 0), 1 + p[1] * f]; })); }, keep = c.get('draw');
      c.set('draw', mk(1 / k)); ok(/upside down/.test(hintOf(3, c, 'draw')), 'drawing at 1/k: ' + hintOf(3, c, 'draw'));
      c.set('draw', mk(1)); ok(/same size/.test(hintOf(3, c, 'draw')), 'drawing at k = 1: ' + hintOf(3, c, 'draw'));
      c.set('draw', mk(3)); ok(/scale factor is 3/.test(hintOf(3, c, 'draw')), 'drawing at the wrong k: ' + hintOf(3, c, 'draw'));
      var add = 2, Pa = Sh.P.map(function (p) { return [1 + p[0] + (p[0] > 0 ? add : 0) * (p[0] / Sh.w > 0.99 ? 1 : 0), 1 + p[1] + (p[1] / Sh.h > 0.99 ? add : 0)]; });
      c.set('draw', JSON.stringify(Pa)); var ha = hintOf(3, c, 'draw'); ok(/added|Check side/.test(ha), 'drawing with squares added: ' + ha);
      var Q = JSON.parse(keep); Q[2] = [Q[2][0] + 1, Q[2][1]]; c.set('draw', JSON.stringify(Q)); ok(/Check side/.test(hintOf(3, c, 'draw')), 'one corner off names the side: ' + hintOf(3, c, 'draw'));
      Q = JSON.parse(keep); c.set('draw', JSON.stringify(Q.slice(2).concat(Q.slice(0, 2)))); ok(res(3, c, 'draw').ok, 'starting at another corner is fine');
      c.set('draw', JSON.stringify(Q.slice().reverse())); ok(res(3, c, 'draw').ok, 'going round the other way is fine');
      var mx = Math.max.apply(null, Q.map(function (q) { return q[0]; })); c.set('draw', JSON.stringify(Q.map(function (q) { return [mx + 1 - q[0], q[1]]; })));
      var hf = hintOf(3, c, 'draw'); ok(/flipped/.test(hf) || res(3, c, 'draw').ok, 'a mirror image: ' + hf);
      c.set('draw', JSON.stringify(Q.slice(0, 2))); ok(/corners/.test(hintOf(3, c, 'draw')), 'too few corners'); c.set('draw', keep); ok(ev(3, c).ok, 'drawing restored');
      tryHint(3, c, 'dA', Sh.ang[Sh.D.star] * k, /not/, 'angle multiplied by k');
      if (Sh.w * k !== Sh.w + k) tryHint(3, c, 'dW', Sh.w + k, /added/, 'width: added k');
      // the plan
      var sN = sc * 100;
      tryHint(4, c, 'pN', String(sc), /same units/, 'ratio without changing units');
      tryHint(4, c, 'pN', '1:' + sN, /OK/, 'ratio typed as 1:N');
      tryHint(4, c, 'pL', (J.L * sc).toFixed(3), /multiplied/, 'plan length multiplied');
      tryHint(4, c, 'pL', (J.L / sN).toFixed(4), /Units/, 'plan length: metres ÷ N');
      var stt = G6.placeState(c, J, sc);
      tryHint(4, c, 'rd', (stt.d * sN).toFixed(1), /cm/, 'real distance left in cm');
      tryHint(4, c, 'rd', (stt.d / sc).toFixed(2), /divided/, 'real distance divided');
      var badS = J.b.scales.filter(function (q) { return !G6.fits(J, q); })[0], keepS = c.get('pscale');
      c.set('pscale', String(badS)); ok(/doesn’t fit/.test(hintOf(4, c, 'pscale')), 'a scale that doesn’t fit: ' + hintOf(4, c, 'pscale')); c.set('pscale', keepS);
      var pl = c.get('place'); c.set('place', JSON.stringify({ a: JSON.parse(pl).a })); ok(!ev(4, c).ok && /Drag both/.test(ev(4, c).results.filter(function (r) { return r.msg && !r.ok; })[0].hint), 'one piece missing'); c.set('place', pl);
      var o2 = JSON.parse(pl); o2.b = o2.a.slice(); c.set('place', JSON.stringify(o2)); ok(/overlap|1 cm|Keep/.test(ev(4, c).results.filter(function (r) { return r.msg && !r.ok; })[0].hint), 'pieces on top of each other'); c.set('place', pl);
      o2 = JSON.parse(pl); o2.a = [-5, 1]; c.set('place', JSON.stringify(o2)); ok(/inside|Keep/.test(ev(4, c).results.filter(function (r) { return r.msg && !r.ok; })[0].hint), 'piece off the plan'); c.set('place', pl);
      // own plan distance carries into the real distance
      c.set('pd', String(stt.d + 1)); c.set('rd', String((stt.d + 1) * sc)); ok(!res(4, c, 'pd').ok && res(4, c, 'rd').ok, 'real distance follows the student’s own plan reading'); def.checkpoints[4].solve(c);
      // the site
      var S0 = Z.S, M0 = Z.M;
      tryHint(5, c, 'tree', (S0.S * S0.sp / S0.p).toFixed(2), /on top/, 'tree: mixed up which side goes on top');
      tryHint(5, c, 'tree', (S0.S + S0.p - S0.sp).toFixed(2), /added/, 'tree: additive');
      tryHint(5, c, 'pole', (M0.F * M0.d2 / M0.d1).toFixed(2), /eye height/, 'mirror: full height');
      tryHint(5, c, 'pole', (M0.d2 / M0.d1).toFixed(2), /eye height/, 'mirror: no eye height');
      tryHint(5, c, 'pole', (M0.e * M0.d1 / M0.d2).toFixed(2), /on top/, 'mirror: upside down');
      tryHint(5, c, 'pole', (M0.e * M0.d2 / M0.d1 + M0.e).toFixed(2), /add/, 'mirror: added eye height');
      tryHint(5, c, 'sSet', 'flip', /same order/, 'proportion flipped');
      tryHint(5, c, 'sWhy', 'any', /Not all/, 'all right triangles');
      tryHint(5, c, 'tPlan', (Z.T / sN).toFixed(4), /Units/, 'tree on plan: units');
      tryHint(5, c, 'tPlan', String(Z.T * sc), /multiplied/, 'tree on plan: multiplied');
      // a different scale in checkpoint 5 changes the tree's plan distance
      var other = J.b.scales.filter(function (q) { return G6.fits(J, q) && q !== sc; })[0];
      if (other) { c.set('pscale', String(other)); ok(!res(5, c, 'tPlan').ok, 'a new plan scale means a new tree distance'); def.checkpoints[4].solve(c); ok(res(4, c, 'pscale').ok, 'cp5 redone'); def.checkpoints[5].solve(c); ok(ev(5, c).ok, 'cp6 redone'); }
      // the model tree follows the student's own tree and k
      var t2 = S0.H + 0.5; c.set('tree', String(t2)); c.set('mTree', String(t2 * 100 * J.k)); ok(res(6, c, 'mTree').ok, 'model tree follows the student’s own tree height');
      tryHint(6, c, 'mTree', (t2 * J.k).toFixed(4), /metres/, 'model tree in metres');
      def.checkpoints[5].solve(c); def.checkpoints[6].solve(c);
      // changing the build reopens checkpoint 2
      var keepB = c.get('build'); c.set('build', bid === 'tiny' ? 'skate' : 'tiny'); var st2 = PJ.statuses(def, P); ok(st2[0] === 'done' && st2.indexOf('open') >= 1 && st2.indexOf('open') <= 2, 'a new build reopens checkpoint 2 or 3: ' + st2.join(',')); c.set('build', keepB);
      def.checkpoints.forEach(function (cp) { cp.solve(c); }); ok(PJ.statuses(def, P).every(function (q) { return q === 'done'; }), 'all done again');
    }
    ok(PJ.suggest(def, P).ind, 'suggestion');
  }
});
function r1(x) { return Math.round(x * 10) / 10; }
ok(Object.keys(seen.logo).length === 9, 'all 9 logo originals: ' + Object.keys(seen.logo).length);
ok(Object.keys(seen.order).length === 6, 'all 6 orders of the versions: ' + Object.keys(seen.order));
ok(Object.keys(seen.draw).length === 6, 'all 6 drawing shapes');
ok(Object.keys(seen.shad).length >= 7 && Object.keys(seen.mirr).length >= 5, 'many shadow and mirror set-ups');
// typed numbers
[['36', 36], ['36 cm', 36], ['2.5 m', 2.5], ['1/25', 0.04], ['1:25', 0.04], ['×1.5', 1.5], ['0,5', 0.5], ['abc', NaN], ['', NaN]].forEach(function (t) { var v = G6.pn(t[0]); ok(isNaN(t[1]) ? isNaN(v) : Math.abs(v - t[1]) < 1e-9, 'parse ' + t[0] + ' → ' + v); });
[['1:200', 200], ['1 : 50', 50], ['200', 200], ['1/40', 40]].forEach(function (t) { ok(G6.pN(t[0]) === t[1], 'ratio ' + t[0] + ' → ' + G6.pN(t[0])); });
// the flex keeps the sides and changes the angles
var H0 = G6.logoPts('house', { w: 6, h: 4, r: 5 }), F0 = G6.flex(H0, 12);
ok(F0 && G6.sides(F0).every(function (x, j) { return close(x, G6.sides(H0)[j], 1e-9); }) && !close(G6.angles(F0)[1], G6.angles(H0)[1], 1), 'flex keeps sides, changes angles');
console.log((fails ? 'FAILED ' + fails : 'ok') + ' — ' + checks + ' checks');
process.exit(fails ? 1 : 0);
