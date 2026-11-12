/* Math 10-3 · Unit 2 · Lesson 6 — Extra Earnings: Tips, Bonuses and Shift Premiums (N2)
 * Assignment 6 (u2_l06.tex, Questions 1–18) and the Lesson 6 Extra Practice (u2_ep06.tex, Questions 1–16).
 * NEEDS js/lessons/u1l7.js (HW.pctKit) and js/lessons/u2l5.js (HW.u2earn) loaded first.
 * Every part is a generator: the same kind of bill, tip rate, tip pool, tip-out, bonus (lump sum, percent, per item,
 * by price level), shift premium (dollars per hour after a set time, or a percent more), danger and isolation pay,
 * and the same Alberta overtime rule (over 8 h in a day or over 44 h in a week, whichever is more; 1.5 × the base
 * wage), with new numbers around the booklet's (the booklet's own numbers are among the possible values; the lesson's
 * worked-example numbers are left out). Calculator allowed. Money to the cent (rounding nudges as in Unit 1); tip
 * percents to the nearest tenth; numerical-response answers to the nearest dollar where the booklet says so.
 * Recognised mistakes get their own hint: the tip given for the total (or the total for the tip), 15% as 1.5 or 0.015,
 * the pool shared equally instead of by hours, a tip-out left out, the premium paid on every hour of the shift or added
 * only once, the percent premium given as the new rate (or the other way), the hours left out, overtime paid at the
 * base wage, the weekly rule used when the daily rule gives more (and the other way), multiplying instead of dividing
 * when working backwards, a sofa at a level's edge put in the wrong level, and so on.
 * Conversions: the tip table → one table row per bill (estimate box accepts any sensible estimate); the tip pool
 * table, the timesheet and the pay summary → the table input (given cells shown, blanks as boxes; the pay summary's
 * "Work" column becomes Hours and Rate boxes); "which bonus / which choice, and by how much" → a box for the choice
 * and a box for the amount; "advantage and disadvantage" → a table sorting four statements; "what mistake",
 * "why", "give a reason" → multiple choice of reasons.
 * Outcome N2. Levels: LIM BEG EMG PRG ADV MAS (MAS: Question 13(b) and Extra 14). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, P = K.P, PK = HW.pctKit, U = HW.u2earn;
  if (!PK || !PK.money) throw new Error('u2l6 needs HW.pctKit: load js/lessons/u1l7.js before js/lessons/u2l6.js');
  if (!U || !U.pctPart) throw new Error('u2l6 needs HW.u2earn: load js/lessons/u2l5.js before js/lessons/u2l6.js');
  var r2 = PK.r2, rnd = PK.rnd, dS = PK.dS, m$ = PK.m$, near = PK.near, pctOf = PK.pctOf, find = PK.find;
  var MM = U.MM, MW = U.MW, eqMM = U.eqMM, pctT = U.pctT, decT = U.decT, mulT = U.mulT, nearM = U.nearM, sol = U.sol, tbl = U.tbl, dl = U.dl, badOf = U.badOf, mp = U.mp, choiceChk = U.choiceChk;

  function hT(h) { return t(dS(h) + '\\text{ h}'); }
  function rateT(x) { return MM(x) + '\\text{/h}'; }
  /* clock time from hours after midnight: 15.5 → "3:30 p.m." (24 and up wrap to the next morning) */
  function clock(h) { h = ((h % 24) + 24) % 24; var H = Math.floor(h + 1e-9), mi = Math.round((h - H) * 60), ap = H >= 12 ? 'p.m.' : 'a.m.', h12 = H % 12 === 0 ? 12 : H % 12; return h12 + ':' + (mi < 10 ? '0' : '') + mi + ' ' + ap; }
  function clockT(h) { return '\\text{' + clock(h) + '}'; }
  /* a numeric (non-money) part */
  function numPart(prompt, exact, dp, diag, sl, hints, text, inp) { var p = PK.part(prompt, PK.num(exact, dp, diag), dS(dp == null ? exact : rnd(exact, dp)), dS(dp == null ? exact : rnd(exact, dp)), sl, hints, text, inp); return p; }
  /* which choice, and by how much: A, B = { name, re }, win = 'A' | 'B' */
  function whichBy(prompt, A, B, win, d, moreDiag, sl, hints, text, ph) {
    var W = win === 'A' ? A : B, L = win === 'A' ? B : A;
    var p = PK.fields(prompt, [{ label: 'Choose', mode: 'text', placeholder: ph, name: 'Which one' }, { label: 'Better by', before: '$', name: 'How much better' }],
      [choiceChk([{ re: W.re, right: true }, { re: L.re, code: 'u2e-wrong-choice', hint: 'Work out what each choice pays, then compare.' }], 'Type <b>' + ph.split(' or ').join('</b> or <b>') + '</b>.'), PK.money(d, dl(moreDiag || []))],
      [W.key, m$(d)], W.name + ', by ' + t(MM(d)), sl, hints, text);
    p.bad = [[L.key, m$(d)]];
    return p;
  }
  /* an estimate of p% of A: any value within 20% (or 10 cents) */
  function estChk(p, A) {
    var g = pctOf(p, A), tol = Math.max(0.1, 0.2 * g);
    return function (resp) {
      var a = PK.readV(resp); if (!a.ok) return form(a.code === 'empty' ? 'empty' : 'notnumber', a.code === 'empty' ? 'Type your estimate first.' : 'Enter a single number.');
      if (Math.abs(a.v - g) <= tol) return ok();
      if (Math.abs(a.v - A / 10) <= Math.max(0.1, 0.1 * A / 10)) return wrong('u2f-est-10', 'That’s about ' + t('10\\%') + '. For ' + t(pctT(p)) + ', add half of the ' + t('10\\%') + ' amount.');
      if (Math.abs(a.v - A * 0.2) <= 0.1 * A * 0.2) return wrong('u2f-est-10', 'That’s about ' + t('20\\%') + '. ' + t(pctT(p)) + ' is ' + t('10\\%') + ' plus half of ' + t('10\\%') + '.');
      return wrong('u2e-est', 'Round the bill, find ' + t('10\\%') + ' (decimal point 1 place left), then add half of that.');
    };
  }
  function tipChk(p, A) { // p% tip of a bill A: the PK.ofMistakes list plus "gave the total"
    return PK.money(pctOf(p, A), dl(U.ofList(p, A, { more: [[A + pctOf(p, A), 'u2f-total', 'That’s the bill plus the tip. The tip is only the ' + t(pctT(p)) + '.']] }).filter(function (x) { return x[1] !== 'pct-added'; })));
  }
  /* wage pay + tips */
  function wageTipsList(h, w, tips, o) {
    o = o || {}; var wp = h * w;
    return [[wp, 'u2f-no-tips', 'That’s only the wage pay. Add the tips.'], [tips, 'u2f-tips-only', 'That’s the tips. Add the wage pay (hours × wage).'], [w + tips, 'u2e-no-hours', 'Multiply the wage by the hours first: ' + t(h + '\\times ' + MM(w)) + '.']].concat(o.more || []);
  }
  /* a pool shared by hours: fill-in table */
  function poolTable(prompt, names, hrs, pool, o) {
    o = o || {}; var H = hrs.reduce(function (s, x) { return s + x; }, 0), u = pool / H, n = names.length;
    var cols = names.map(function (x) { return '\\text{' + x + '}'; }).concat(['\\textbf{Total}']), rows = ['\\textbf{Hours}', '\\textbf{Share}'];
    var cells = [hrs.map(function (x) { return dS(x); }).concat([null]), names.map(function () { return null; }).concat([null])];
    var blanks = [{ where: 'cell', i: 0, j: n, name: 'Total hours', chk: PK.num(H, null, function (v) { return near(v, n) ? { code: 'u2f-count', hint: 'Add everyone’s <b>hours</b>, not the number of people.' } : null; }) }];
    hrs.forEach(function (h, j) {
      blanks.push({ where: 'cell', i: 1, j: j, name: names[j] + '’s share', chk: PK.money(h * u, dl([[pool / n, 'u2f-equal', 'The pool is shared <b>by hours</b>, not equally. Find the share for 1 hour first: ' + t(MM(pool) + '\\div ' + dS(H)) + '.'], [u, 'u2f-per-hour', 'That’s the share for 1 hour. Multiply by ' + names[j] + '’s hours.'], [pool / h, 'u2f-pool-ratio', 'Divide the pool by the <b>total</b> hours, then multiply by ' + names[j] + '’s hours.'], [h * pool / n, 'u2f-equal', 'Find the share for 1 hour: pool ÷ total hours.']])) });
    });
    blanks.push({ where: 'cell', i: 1, j: n, name: 'Total share', chk: PK.money(pool, dl([[H, 'u2f-count', 'This box is the total of the shares, in dollars.']])) });
    var keyCells = [hrs.map(function (x) { return dS(x); }).concat([dS(H)]), hrs.map(function (h) { return m$(h * u); }).concat([m$(pool)])];
    return PK.tablePart(prompt, { rows: rows, cols: cols, cells: cells, corner: '\\textbf{' + (o.corner || 'Worker') + '}', keys: 'pctkit-money', help: 'Tap a box, then type the number (no $ needed).' }, PK.tableChk(blanks), { rows: rows, cols: cols, cells: keyCells },
      sol(['Step 1: ' + t(hrs.map(dS).join('+') + '=' + dS(H)) + ' h', 'Step 2: ' + t(MM(pool) + '\\div ' + dS(H) + '=' + MM(u)) + ' for each hour', 'Step 3: ' + hrs.map(function (h, j) { return names[j] + ' ' + t(dS(h) + '\\times ' + MM(u) + '=' + MM(h * u)); }).join('; '), 'Step 4: ' + t(hrs.map(function (h) { return MM(h * u); }).join('+') + '=' + MM(pool)) + ' ✓']),
      ['Add the hours first. Then the share for 1 hour = pool ÷ total hours.', 'Each share = their hours × the share for 1 hour.'], o.text || 'pool table');
  }
  var DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  HW.addCodes({
    'u2f-est-10': 'Tip estimate: used 10% or 20%', 'u2f-total': 'Gave the bill plus the tip', 'u2f-no-tips': 'Left out the tips', 'u2f-tips-only': 'Gave only the tips', 'u2f-count': 'Counted people instead of hours',
    'u2f-equal': 'Shared the pool equally instead of by hours', 'u2f-per-hour': 'Gave the share for 1 hour', 'u2f-pool-ratio': 'Pool share worked the wrong way', 'u2f-tipout-one': 'Left out one tip-out', 'u2f-tipout-kept': 'Gave the tip-outs instead of what she keeps',
    'u2f-edge': 'Price level: put a sofa at the edge in the wrong level', 'u2f-bonus-count': 'Per-item bonus: counted sofas, not bonuses', 'u2f-prem-all': 'Premium paid on every hour', 'u2f-prem-once': 'Premium added only once',
    'u2f-no-prem': 'Left out the premium', 'u2f-prem-only': 'Gave only the premium', 'u2f-prem-hours': 'Premium hours counted wrong', 'u2f-hours-worked': 'Hours worked counted wrong', 'u2f-extra-only': 'Gave only the extra per hour',
    'u2f-rate-diff': 'Gave the difference per hour, not for the shift', 'u2f-danger-all': 'Danger pay on every hour', 'u2f-ot-none': 'Overtime: left out', 'u2f-ot-weekly': 'Overtime: used the weekly rule when the daily rule gives more',
    'u2f-ot-daily': 'Overtime: used the daily rule when the weekly rule gives more', 'u2f-ot-both': 'Overtime: added the daily and weekly hours', 'u2f-ot-base': 'Overtime paid at the base wage', 'u2f-ot-double': 'Overtime paid at double time',
    'u2f-reg-all': 'Regular hours: did not take off the overtime hours', 'u2f-no-share': 'Left out the tip share', 'u2f-back-wage': 'Working backwards: did not take off the wage pay', 'u2f-km': 'Per-kilometre pay worked wrong', 'u2f-hours': 'Total hours worked wrong'
  });
  HW.addPartial({
    'u2f-est-10': 'n', 'u2f-total': 's', 'u2f-no-tips': 's', 'u2f-tips-only': 's', 'u2f-count': 'n', 'u2f-equal': 'n', 'u2f-per-hour': 's', 'u2f-pool-ratio': 'n', 'u2f-tipout-one': 'b', 'u2f-tipout-kept': 's',
    'u2f-edge': 's', 'u2f-bonus-count': 'n', 'u2f-prem-all': 'b', 'u2f-prem-once': 'b', 'u2f-no-prem': 's', 'u2f-prem-only': 's', 'u2f-prem-hours': 'b', 'u2f-hours-worked': 'b', 'u2f-extra-only': 's', 'u2f-rate-diff': 'b',
    'u2f-danger-all': 'b', 'u2f-ot-none': 'b', 'u2f-ot-weekly': 'b', 'u2f-ot-daily': 'b', 'u2f-ot-both': 'b', 'u2f-ot-base': 'b', 'u2f-ot-double': 'b', 'u2f-reg-all': 'b', 'u2f-no-share': 's', 'u2f-back-wage': 'n', 'u2f-km': 'b', 'u2f-hours': 'b'
  });

  /* lesson worked examples (left out): bill 64.80; $9 on $52; Noor $15.50/h, 6 h, $1240, 16%; Mateo $86.40 at 12%;
   * pool $612 (8, 6, 5, 5 h); bar $825, 30%, 3 bartenders; Kyle $46 800 at 4%; Erin 12/7/4 plans; Rosa $750 vs 3% of
   * $28 600; Sana $21.60 + $2.50 after 6 p.m.; wildfire $24 + 30%; camp $5850, $650 vs 10%; Diego $19, 46 h, $1.50 */

  /* Q1: one row of the tip table */
  function tipRow(bill) {
    var cols = ['\\text{Estimate of 15\\%}', '\\text{10\\% tip}', '\\text{15\\% tip}', '\\text{20\\% tip}'], Rd = bill >= 100 ? Math.round(bill / 10) * 10 : Math.round(bill), est = Rd * 0.15;
    var blanks = [{ where: 'cell', i: 0, j: 0, name: 'Estimate', chk: estChk(15, bill) }, { where: 'cell', i: 0, j: 1, name: '10% tip', chk: tipChk(10, bill) }, { where: 'cell', i: 0, j: 2, name: '15% tip', chk: tipChk(15, bill) }, { where: 'cell', i: 0, j: 3, name: '20% tip', chk: tipChk(20, bill) }];
    return PK.tablePart('Fill in this row of the table. Estimate the ' + t('15\\%') + ' tip in your head first.', { rows: [MM(bill)], cols: cols, cells: [[null, null, null, null]], corner: '\\text{Bill}', keys: 'pctkit-money', help: 'Tap a box, then type the amount (no $ needed). Any sensible estimate is fine.' },
      PK.tableChk(blanks), { rows: [MM(bill)], cols: cols, cells: [[m$(est), m$(pctOf(10, bill)), m$(pctOf(15, bill)), m$(pctOf(20, bill))]] },
      sol(['Estimate: ' + (near(Rd, bill) ? '' : t(MM(bill) + '\\approx ' + MW(Rd)) + '; ') + t('10\\%') + ' is ' + t(MM(Rd / 10)) + ', half of that is ' + t(MM(Rd / 20)) + ', so about ' + t(MM(est)) + '.',
        '10%: ' + t(MM(bill) + '\\times 0.10' + eqMM(pctOf(10, bill))), '15%: ' + t(MM(bill) + '\\times 0.15' + eqMM(pctOf(15, bill))), '20%: ' + t(MM(bill) + '\\times 0.20' + eqMM(pctOf(20, bill)))]),
      ['Estimate: ' + t('10\\%') + ' (decimal point 1 place left) plus half of that.', 'Tip = bill × rate as a decimal (' + t('0.10') + ', ' + t('0.15') + ', ' + t('0.20') + '). Round to the cent.'], 'tip row ' + bill);
  }
  function tipPctPart(tip, bill, prompt, text, nr) {
    var P0 = tip / bill * 100, ans = rnd(P0, 1), exact = near(P0, ans), q = tip / bill, qT = near(q, rnd(q, 4)) ? dS(rnd(q, 4)) : dS(rnd(q, 5)) + '\\ldots';
    var aT = exact ? pctT(ans) : ans.toFixed(1) + '\\%';
    var p = PK.part(prompt, U.rateChk(tip, bill, 1, { partName: 'tip', wholeName: 'bill', nr: nr }), exact ? dS(ans) : ans.toFixed(1), aT, sol([t(MM(tip) + '\\div ' + MM(bill) + '=' + qT), t(qT + '\\times 100' + (exact ? '=' : '\\approx ') + aT)]),
      ['Tip percent = tip ÷ bill × 100.', 'Round to the nearest tenth (1 decimal place).'], text, nr ? { nr: true } : { after: '%' });
    p.bad = [dS(rnd(bill / tip, 1)), dS(rnd(q, 3))].filter(function (x) { return !near(Number(x), ans); });
    return p;
  }
  /* Q9: a timesheet with a premium after a set time */
  function shifts(r, T) {
    return find(function () {
      var days = r.sample([0, 1, 2, 3, 4, 5, 6], 4).sort(), out = days.map(function (d) { var L = r.pick([8, 8, 8, 6, 7, 7.5]), s = r.int(14, 2 * Math.min(23.5 - L, T + 1)) / 2; s = Math.max(7, s); return { day: DAYS[d], s: s, e: s + L, L: L, pr: Math.max(0, s + L - Math.max(s, T)) }; });
      return out;
    }, function (o) { return o.every(function (x) { return x.e <= 23.5; }) && o.some(function (x) { return x.pr === 0; }) && o.some(function (x) { return x.pr % 1 !== 0; }) && o.filter(function (x) { return x.pr > 0; }).length >= 2 && o.some(function (x) { return x.e === T; }); }, null);
  }
  function timesheetPart(sh) {
    var rows = sh.days.map(function (x) { return '\\text{' + x.day + '}'; }).concat(['\\textbf{Total}']), cols = ['\\text{Start}', '\\text{End}', '\\text{Hours worked}', '\\text{Hours after ' + clock(sh.T) + '}'];
    var cells = sh.days.map(function (x) { return [clockT(x.s), clockT(x.e), null, null]; }).concat([['', '', null, null]]), blanks = [];
    sh.days.forEach(function (x, i) {
      blanks.push({ where: 'cell', i: i, j: 2, name: x.day + ' hours', chk: PK.num(x.L, null, function (v) { return near(Math.abs(v - x.L), 1) ? { code: 'u2f-hours-worked', hint: 'Count again from ' + clock(x.s) + ' to ' + clock(x.e) + '. Count the hours, not the clock numbers.' } : near(v, 24 - x.L) || near(v, x.L + 12) || near(v, Math.abs(12 - x.L)) ? { code: 'u2f-hours-worked', hint: 'Watch the a.m. / p.m. Count the hours from ' + clock(x.s) + ' to ' + clock(x.e) + '.' } : null; }) });
      blanks.push({ where: 'cell', i: i, j: 3, name: x.day + ' hours after ' + clock(sh.T), chk: PK.num(x.pr, null, function (v) { return x.pr !== x.L && near(v, x.L) ? { code: 'u2f-prem-hours', hint: 'Only the hours <b>after ' + clock(sh.T) + '</b> count here: from ' + clock(Math.max(x.s, sh.T)) + ' to ' + clock(x.e) + '.' } : x.pr === 0 && v > 0 ? { code: 'u2f-prem-hours', hint: 'This shift ends at ' + clock(x.e) + ', so no hours are after ' + clock(sh.T) + '' } : near(Math.abs(v - x.pr), 0.5) || near(Math.abs(v - x.pr), 1) ? { code: 'u2f-prem-hours', hint: 'Count from ' + clock(Math.max(x.s, sh.T)) + ' to ' + clock(x.e) + ' again (a half hour is 0.5).' } : null; }) });
    });
    var n = sh.days.length;
    blanks.push({ where: 'cell', i: n, j: 2, name: 'Total hours', chk: PK.num(sh.H, null) }); blanks.push({ where: 'cell', i: n, j: 3, name: 'Total hours after ' + clock(sh.T), chk: PK.num(sh.PH, null) });
    var keyCells = sh.days.map(function (x) { return [clockT(x.s), clockT(x.e), dS(x.L), dS(x.pr)]; }).concat([['', '', dS(sh.H), dS(sh.PH)]]);
    return PK.tablePart('Complete the timesheet.', { rows: rows, cols: cols, cells: cells, corner: '\\textbf{Day}', keys: 'pctkit-money', help: 'Tap a box, then type the hours (a half hour is .5).' }, PK.tableChk(blanks), { rows: rows, cols: cols, cells: keyCells },
      sol(sh.days.map(function (x) { return x.day + ': ' + clock(x.s) + ' to ' + clock(x.e) + ' is ' + hT(x.L) + '; after ' + clock(sh.T) + ': ' + hT(x.pr); }).concat(['Totals: ' + hT(sh.H) + ' worked, ' + hT(sh.PH) + ' after ' + clock(sh.T)])),
      ['Count the hours from the start to the end of each shift.', 'For the last column, count only from ' + clock(sh.T) + ' (or the start, if later) to the end. A half hour is 0.5.'], 'timesheet');
  }
  function premGrossPart(prompt, H, w, PH, pi, o) {
    o = o || {}; var reg = H * w, pr = PH * pi, g = reg + pr;
    var list = [[H * (w + pi), 'u2f-prem-all', 'The premium is paid only on the ' + hT(PH) + (o.when || '') + ', not on every hour.'], [reg, 'u2f-no-prem', 'That’s the regular pay. Add the premium: ' + t(dS(PH) + '\\times ' + MM(pi)) + '.'], [pr, 'u2f-prem-only', 'That’s only the premium pay. Add the regular pay: ' + t(dS(H) + '\\times ' + MM(w)) + '.'],
      [reg + pi, 'u2f-prem-once', 'The premium is ' + t(MM(pi)) + ' for <b>each</b> premium hour: ' + t(dS(PH) + '\\times ' + MM(pi)) + '.'], [(H - PH) * w + PH * pi, 'u2f-prem-hours', 'The premium hours are paid the wage <b>plus</b> the premium. Pay all ' + hT(H) + ' at the wage, then add the premium.'], [w + pi, 'u2e-no-hours', 'Multiply by the hours.']].concat(o.more || []);
    var p = mp(prompt, g, dl(list), sol((o.pre || []).concat(['regular pay ' + t('=' + dS(H) + '\\times ' + MM(w) + eqMM(reg)), 'premium pay ' + t('=' + dS(PH) + '\\times ' + MM(pi) + eqMM(pr)), 'gross pay ' + t('=' + MM(reg) + '+' + MM(pr) + '=' + MM(g))])),
      o.hints || ['Regular pay = all the hours × the wage.', 'Premium pay = premium hours × the premium. Add them.'], o.text || 'premium gross');
    p.bad = badOf(list, g);
    return p;
  }
  /* Q13: the pay summary table (hours, rate, amount) */
  function summaryPart(sh) {
    var w = sh.w, ot = sh.OT, reg = sh.H - ot, otR = 1.5 * w, A1 = reg * w, A2 = ot * otR, A3 = sh.n * sh.pi, G = A1 + A2 + A3 + sh.TS;
    var rows = ['\\text{Regular pay}', '\\text{Overtime pay}', '\\text{Late-night premium}', '\\text{Tip pool share}', '\\textbf{Gross pay}'], cols = ['\\text{Hours}', '\\text{Rate (\\$/h)}', '\\text{Amount (\\$)}'];
    var cells = [[null, null, null], [null, null, null], [null, null, null], ['', '', m$(sh.TS)], ['', '', null]];
    var blanks = [
      { where: 'cell', i: 0, j: 0, name: 'Regular hours', chk: PK.num(reg, null, function (v) { return near(v, sh.H) ? { code: 'u2f-reg-all', hint: 'Take the overtime hours off: ' + t(dS(sh.H) + '-' + dS(ot)) + '.' } : null; }) },
      { where: 'cell', i: 0, j: 1, name: 'Regular rate', chk: PK.money(w, dl([[otR, 'u2f-ot-base', 'Regular hours are paid the base wage.']])) },
      { where: 'cell', i: 0, j: 2, name: 'Regular pay', chk: PK.money(A1, dl([[sh.H * w, 'u2f-reg-all', 'Use the regular hours only (' + t(dS(reg)) + ').']])) },
      { where: 'cell', i: 1, j: 0, name: 'Overtime hours', chk: PK.num(ot, null) },
      { where: 'cell', i: 1, j: 1, name: 'Overtime rate', chk: PK.money(otR, dl([[w, 'u2f-ot-base', 'Overtime is time-and-a-half: ' + t('1.5\\times ' + MM(w)) + '.'], [2 * w, 'u2f-ot-double', 'Alberta overtime is ' + t('1.5') + ' times the wage, not ' + t('2') + ' times.'], [w + 1.5, 'u2f-ot-base', 'Multiply by ' + t('1.5') + ', don’t add ' + t('1.50') + '.'], [w + sh.pi, 'u2f-ot-base', 'The premium is its own line. Overtime rate = ' + t('1.5\\times ' + MM(w)) + '.']])) },
      { where: 'cell', i: 1, j: 2, name: 'Overtime pay', chk: PK.money(A2, dl([[ot * w, 'u2f-ot-base', 'Use the overtime rate, ' + t(MM(otR)) + '.']])) },
      { where: 'cell', i: 2, j: 0, name: 'Premium hours', chk: PK.num(sh.n, null, function (v) { return near(v, sh.H) ? { code: 'u2f-prem-all', hint: 'Only ' + t(sh.n) + ' of her hours were late-night hours.' } : null; }) },
      { where: 'cell', i: 2, j: 1, name: 'Premium rate', chk: PK.money(sh.pi) },
      { where: 'cell', i: 2, j: 2, name: 'Premium pay', chk: PK.money(A3, dl([[sh.H * sh.pi, 'u2f-prem-all', 'Only the ' + t(sh.n) + ' late-night hours get the premium.']])) },
      { where: 'cell', i: 4, j: 2, name: 'Gross pay', chk: PK.money(G, dl([[A1 + A2 + A3, 'u2f-no-share', 'Add the tip pool share too.'], [G - A3, 'u2f-no-prem', 'Add the late-night premium too.'], [G - A2, 'u2f-ot-none', 'Add the overtime pay too.']])) }];
    var keyCells = [[dS(reg), m$(w), m$(A1)], [dS(ot), m$(otR), m$(A2)], [dS(sh.n), m$(sh.pi), m$(A3)], ['', '', m$(sh.TS)], ['', '', m$(G)]];
    return PK.tablePart('Complete her pay summary.', { rows: rows, cols: cols, cells: cells, corner: '\\textbf{Type of pay}', keys: 'pctkit-money', help: 'Tap a box, then type the number (no $ needed).' }, PK.tableChk(blanks), { rows: rows, cols: cols, cells: keyCells },
      sol(['regular: ' + t(dS(reg) + '\\times ' + MM(w) + '=' + MM(A1)), 'overtime rate ' + t('=1.5\\times ' + MM(w) + '=' + MM(otR)) + '; ' + t(dS(ot) + '\\times ' + MM(otR) + '=' + MM(A2)), 'premium: ' + t(dS(sh.n) + '\\times ' + MM(sh.pi) + '=' + MM(A3)),
        'gross ' + t('=' + MM(A1) + '+' + MM(A2) + '+' + MM(A3) + '+' + MM(sh.TS) + '=' + MM(G))]),
      ['Regular hours = total − overtime hours (from (a)). Overtime rate = ' + t('1.5\\times') + ' the wage.', 'Amount = hours × rate. Gross pay = all the amounts added, with the tip share.'], 'pay summary');
  }
  function zoeShared(r) {
    return find(function () {
      var weekly = r.chance(0.3), Lg = r.pick([10, 9, 11]), k = weekly ? 5 : r.pick([4, 3]), H = Lg + 8 * k, daily = Lg - 8, wk = Math.max(0, H - 44);
      return { name: r.pick(['Zoe', 'Brooke', 'Talia', 'Amira']), town: r.pick(['Canmore', 'Banff', 'Jasper', 'Drumheller']), w: r.pick([15.5, 16, 15.75, 16.25, 15.25]), Lg: Lg, k: k, H: H, daily: daily, wk: wk, OT: Math.max(daily, wk), pi: r.pick([1.25, 1.5, 1, 1.75]), n: r.pick([15, 12, 10, 16, 14]), TS: rnd(r.int(25000, 45000) / 100, 2), day: r.pick(['Saturday', 'Friday', 'Sunday']) };
    }, function (s) { return !(s.w === 19) && s.n <= s.H; }, null);
  }

  HW.defineLesson({
    id: 'u2l6', unit: 2, num: '6', title: 'Extra Earnings: Tips, Bonuses and Shift Premiums', outcome: 'N2',
    blurb: 'Tips and tip percents, tip pools and tip-outs, bonuses, shift premiums, danger and isolation pay, and total gross pay.',
    questions: [
      { num: '1', stem: 'Find each tip. Estimate the 15% tip in your head first.', parts: [
        { id: '1a', level: 'BEG', make: function (r) { return tipRow(r.pick([30, 40, 50, 60, 80, 20, 70, 90])); } },
        { id: '1b', level: 'BEG', make: function (r) { return tipRow(find(function () { return r.int(250, 900) / 10; }, function (x) { return !near(x, 64.8) && Math.round(x * 10) % 10 !== 0; }, 48.6)); } },
        { id: '1c', level: 'EMG', make: function (r) { return tipRow(find(function () { return r.int(1010, 1890) / 10; }, function (x) { return Math.round(x * 10) % 10 !== 0; }, 112.8)); } }] },
      { num: '2', stem: 'What percent tip did each customer leave? Round to the nearest tenth of a percent.', parts: [
        { id: '2a', level: 'BEG', make: function (r) { var v = find(function () { return [r.pick([40, 20, 50, 80, 60, 30]), r.pick([17.5, 12.5, 15, 22.5, 18, 16])]; }, function (v) { var tp = pctOf(v[1], v[0]); return near(tp, r2(tp)); }, [40, 17.5]), tip = pctOf(v[1], v[0]); return tipPctPart(tip, v[0], t(MM(tip)) + ' on a ' + t(MM(v[0])) + ' bill', 'tip% exact'); } },
        { id: '2b', level: 'EMG', make: function (r) { var v = find(function () { return [r.pick([5, 6, 4, 8, 7]), r.int(25, 60) + r.pick([0.25, 0.75, 0.45, 0.85])]; }, function (v) { var P0 = v[0] / v[1] * 100; return !near(P0, rnd(P0, 1)) && P0 > 9 && P0 < 25 && !(v[0] === 9); }, [5, 36.25]); return tipPctPart(v[0], v[1], t(MM(v[0])) + ' on a ' + t(MM(v[1])) + ' bill', 'tip% b'); } },
        { id: '2c', level: 'EMG', make: function (r) { var v = find(function () { return [r.pick([3.5, 2.5, 4, 3, 4.5]), r.int(1500, 3500) / 100]; }, function (v) { var P0 = v[0] / v[1] * 100; return !near(P0, rnd(P0, 1)) && P0 > 9 && P0 < 25; }, [3.5, 23.8]); return tipPctPart(v[0], v[1], t(MM(v[0])) + ' on a ' + t(MM(v[1])) + ' ' + r.pick(['taxi ride', 'pizza delivery', 'haircut']), 'tip% c'); } }] },
      { num: '3', stem: function (sh) { return sh.name + ' is a server in ' + sh.town + '. He earns ' + t(rateT(sh.w)) + '. On ' + sh.day + ' he worked ' + hT(sh.h) + '. His bills totalled ' + t(MM(sh.B)) + ', and his tips were ' + t(pctT(sh.p)) + ' of the bills.'; },
        shared: function (r) { return find(function () { return { name: r.pick(['Tyson', 'Cole', 'Jesse', 'Wyatt']), town: r.pick(['Medicine Hat', 'Lethbridge', 'Red Deer', 'Brooks']), day: r.pick(['Saturday', 'Friday', 'Sunday']), w: r.pick([15, 15.25, 15.5, 16, 15.75]), h: r.pick([7, 5, 8, 6]), B: r.int(80, 150) * 10, p: r.pick([17, 15, 18, 16, 14]) }; }, function (s) { return !(s.w === 15.5 && s.h === 6) && !(s.p === 16 && s.B === 1240); }, { name: 'Tyson', town: 'Medicine Hat', day: 'Saturday', w: 15, h: 7, B: 1080, p: 17 }); },
        parts: [
          { id: '3a', level: 'EMG', make: function (r, sh) {
            var wp = sh.h * sh.w, tips = pctOf(sh.p, sh.B), g = wp + tips, list = wageTipsList(sh.h, sh.w, tips, { more: [[wp + sh.p * sh.B, 'pct-no-div', 'Change ' + t(pctT(sh.p)) + ' to a decimal for the tips: ' + t(decT(sh.p)) + '.'], [wp + sh.B, 'u2e-added-sales', 'Add the <b>tips</b>, not the whole bills. The bills belong to the restaurant.'], [wp + sh.B + tips, 'u2e-added-sales', 'The bills are not his pay. Add only the tips.']] });
            var p = mp('Find his gross pay for ' + sh.day + '.', g, dl(list), sol(['wage pay ' + t('=' + sh.h + '\\times ' + MM(sh.w) + '=' + MM(wp)), 'tips ' + t('=' + MM(sh.B) + '\\times ' + decT(sh.p) + eqMM(tips)), 'gross pay ' + t('=' + MM(wp) + '+' + MM(tips) + '=' + MM(g))]), ['Wage pay = hours × wage. Tips = bills × tip rate.', 'Gross pay = wage pay + tips.'], 'server gross');
            p.bad = badOf(list, g); return p;
          } },
          { id: '3b', level: 'BEG', make: function (r) {
            return U.advGrid(r, 'Is each statement about a job where a large part of the pay is <b>tips</b> an advantage or a disadvantage for the worker?',
              ['With good service and busy shifts, you can earn much more than your wage.', 'You are paid more right away when you do a great job.', 'A busy weekend can bring in a lot of extra money.'],
              ['Tips are not steady, so a slow week means less money.', 'It is hard to budget when you don’t know what you’ll earn.', 'Rude or cheap customers can mean you earn very little extra.'], 'how much money the worker gets and how steady it is', 'tips adv/dis');
          } }] },
      { num: '4', stem: '', parts: [
        { id: '4a', level: 'EMG', make: function (r) {
          var v = find(function () { return { h: r.pick([33, 30, 35, 28, 36, 32]), w: r.pick([16.5, 15.75, 16, 17.25, 15.5]), tips: r.int(30, 60) * 5 + r.pick([0, 0.5, 0.75]) }; }, function () { return true; }, { h: 33, w: 16.5, tips: 198 }), wp = v.h * v.w, E = wp + v.tips;
          var list = [[wp, 'u2f-tips-only', 'That’s her wage pay. The tips are what is left: ' + t(MM(E) + '-' + MM(wp)) + '.'], [E - v.w, 'u2e-no-hours', 'Take off her wage pay for all ' + hT(v.h) + ': ' + t(v.h + '\\times ' + MM(v.w)) + '.'], [E + wp, 'u2f-tips-only', 'Subtract the wage pay from what she earned, don’t add.']];
          var p = mp('A hairstylist earned ' + t(MM(E)) + ' last week. She worked ' + hT(v.h) + ' at ' + t(rateT(v.w)) + ', and the rest was tips. How much did she earn in tips?', v.tips, dl(list),
            sol(['wage pay ' + t('=' + v.h + '\\times ' + MM(v.w) + '=' + MM(wp)), 'tips ' + t('=' + MM(E) + '-' + MM(wp) + '=' + MM(v.tips)), 'She earned ' + t(MM(v.tips)) + ' in tips.']), ['Find her wage pay first.', 'Tips = what she earned − wage pay.'], 'stylist tips');
          p.bad = badOf(list, v.tips); return p;
        } },
        { id: '4b', level: 'PRG', make: function (r) {
          var v = find(function () { return { p: r.pick([15, 12, 18, 20, 16]), B: r.int(50, 130) * 10 + r.pick([0, 4, 6, 2]) }; }, function (v) { return !(v.p === 12 && near(v.B, 720)) && near(pctOf(v.p, v.B), r2(pctOf(v.p, v.B))); }, { p: 15, B: 874 }), tip = pctOf(v.p, v.B), list = U.backList(tip, v.p, { whole: 'total of the bills' });
          var p = mp('A bartender’s tips one night were ' + t(MM(tip)) + '. That was ' + t(pctT(v.p)) + ' of the bills he served. What was the total of the bills?', v.B, dl(list),
            sol(['bills ' + t('=' + MM(tip) + '\\div ' + decT(v.p) + '=' + MM(v.B)), 'Check: ' + t(MM(v.B) + '\\times ' + decT(v.p) + '=' + MM(tip)) + ' ✓']), ['Bills = tips ÷ tip rate (as a decimal).', 'Check: the bills × the rate should give ' + t(MM(tip)) + '.'], 'bartender backwards');
          p.bad = badOf(list, v.B); return p;
        } }] },
      { num: '5', stem: '', parts: [{ id: '5', level: 'PRG', make: function (r) {
        var v = find(function () { return { hrs: [r.int(4, 10), r.int(4, 10), r.int(4, 10), r.int(4, 10)], u: r.pick([18, 16.5, 15, 17.5, 21, 19.5, 14.5]), names: r.pick([['Ana', 'Ben', 'Chloe', 'Dev'], ['Jas', 'Kai', 'Lia', 'Max'], ['Rosa', 'Theo', 'Uma', 'Vic']]), where: r.pick(['pizza place', 'burger joint', 'sushi bar', 'coffee shop']) }; },
          function (v) { var H = v.hrs.reduce(function (s, x) { return s + x; }, 0); return H !== 24 && v.hrs.some(function (x, i) { return v.hrs.indexOf(x) !== i; }) === false; }, { hrs: [7, 5, 6, 9], u: 18, names: ['Ana', 'Ben', 'Chloe', 'Dev'], where: 'pizza place' });
        var H = v.hrs.reduce(function (s, x) { return s + x; }, 0), pool = H * v.u;
        return poolTable('Four workers at a ' + v.where + ' share a tip pool of ' + t(MM(pool)) + ' by the hours they worked. Complete the table.', v.names, v.hrs, pool, { text: 'pool by hours' });
      } }] },
      { num: '6', stem: function (sh) { return sh.name + ' made ' + t(MM(sh.T)) + ' in tips on ' + sh.day + '. She tips out ' + t(pctT(sh.k)) + ' to the kitchen and ' + t(pctT(sh.b)) + ' to the busser.'; },
        shared: function (r) { return { name: r.pick(['Hannah', 'Brooke', 'Talia', 'Amira']), day: r.pick(['Friday', 'Saturday', 'Sunday']), T: r.int(45, 95) * 4, k: r.pick([20, 15, 25, 10]), b: r.pick([5, 3, 4, 2]) }; },
        parts: [
          { id: '6a', level: 'BEG', make: function (r, sh) {
            var K1 = pctOf(sh.k, sh.T), B1 = pctOf(sh.b, sh.T);
            var p = PK.fields('How much does each get?', [{ label: 'Kitchen', before: '$', name: 'Kitchen' }, { label: 'Busser', before: '$', name: 'Busser' }], [PK.money(K1, dl(U.ofList(sh.k, sh.T, { addOn: false }), function (x) { return nearM(x, B1) ? { code: 'amt-swap', hint: 'That’s the busser’s ' + t(pctT(sh.b)) + '. The kitchen gets ' + t(pctT(sh.k)) + '.' } : null; })), PK.money(B1, dl(U.ofList(sh.b, sh.T, { addOn: false }), function (x) { return nearM(x, K1) ? { code: 'amt-swap', hint: 'That’s the kitchen’s ' + t(pctT(sh.k)) + '. The busser gets ' + t(pctT(sh.b)) + '.' } : null; }))], [m$(K1), m$(B1)],
              'kitchen ' + t(MM(K1)) + ', busser ' + t(MM(B1)), sol(['kitchen ' + t('=' + MM(sh.T) + '\\times ' + decT(sh.k) + eqMM(K1)), 'busser ' + t('=' + MM(sh.T) + '\\times ' + decT(sh.b) + eqMM(B1))]), ['Each tip-out = tips × its rate (as a decimal).'], 'tip-outs');
            p.bad = [[m$(B1), m$(K1)]]; return p;
          } },
          { id: '6b', level: 'EMG', make: function (r, sh) {
            var K1 = pctOf(sh.k, sh.T), B1 = pctOf(sh.b, sh.T), keep = sh.T - r2(K1) - r2(B1);
            var list = [[sh.T - K1, 'u2f-tipout-one', 'Take off the busser’s ' + t(pctT(sh.b)) + ' too.'], [sh.T - B1, 'u2f-tipout-one', 'Take off the kitchen’s ' + t(pctT(sh.k)) + ' too.'], [K1 + B1, 'u2f-tipout-kept', 'That’s what she gives away. Subtract it from her tips.'], [sh.T - sh.k - sh.b, 'u2f-tipout-kept', 'Subtract the tip-outs in dollars, not the percents.']];
            var p = mp('How much does ' + sh.name + ' keep?', keep, dl(list), sol([t(MM(sh.T) + '-' + MM(K1) + '-' + MM(B1) + '=' + MM(keep)) + ' (or ' + t(MM(sh.T) + '\\times ' + decT(100 - sh.k - sh.b) + eqMM(sh.T * (100 - sh.k - sh.b) / 100)) + ').', 'She keeps ' + t(MM(keep)) + '.']), ['Subtract both tip-outs from her tips.'], 'keeps');
            p.check = PK.either(p.check, PK.money(sh.T * (100 - sh.k - sh.b) / 100)); p.bad = badOf(list, keep); return p;
          } }] },
      { num: '7', stem: '', parts: [
        { id: '7a', level: 'BEG', make: function (r) { var v = find(function () { return [r.int(220, 320) * 200, r.pick([2.5, 3.5, 1.5, 4.5, 3])]; }, function (v) { return !(v[0] === 46800); }, [52400, 2.5]); return U.pctPart(v[1], v[0], 'An office worker earns ' + t(MW(v[0])) + ' a year. Her bonus is ' + t(pctT(v[1])) + ' of her salary. Find her bonus.', { word: 'bonus', of: 'salary', text: 'salary bonus' }); } },
        { id: '7b', level: 'PRG', make: function (r) {
          var v = find(function () { return { L: r.pick([1200, 1000, 1500, 800]), p: r.pick([2, 1.5, 3, 2.5]), S: r.int(80, 180) * 500 }; }, function (v) { var b = pctOf(v.p, v.S); return Math.abs(b - v.L) >= 20 && Math.abs(b - v.L) <= 600; }, { L: 1200, p: 2, S: 68500 });
          var b = pctOf(v.p, v.S), pctWin = b > v.L, d = Math.abs(b - v.L);
          return whichBy('A salesperson can choose a bonus of ' + t(MW(v.L)) + ', or ' + t(pctT(v.p)) + ' of his sales for the year. His sales were ' + t(MW(v.S)) + '. Which should he choose, and by how much is it better?',
            { name: 'the ' + pctT(v.p) + ' bonus', key: dS(v.p) + '%', re: /%|percent/ }, { name: 'the ' + MW(v.L) + ' bonus', key: String(v.L), re: new RegExp('lump|flat|' + v.L + '|' + String(v.L).replace(/(\d)(\d{3})$/, '$1,$2')) }, pctWin ? 'A' : 'B', d,
            [[b, 'u2f-total', 'That’s the ' + t(pctT(v.p)) + ' bonus. Find the difference from ' + t(MW(v.L)) + '.'], [pctOf(v.p * 10, v.S) - v.L, 'pct-one-place', t(pctT(v.p) + '=' + decT(v.p)) + ' — 2 places left.']],
            sol([t(MW(v.S) + '\\times ' + decT(v.p) + eqMM(b)), t((pctWin ? MM(b) + '-' + MM(v.L) : MM(v.L) + '-' + MM(b)) + '=' + MM(d)), 'He should choose the ' + (pctWin ? t(pctT(v.p)) : t(MW(v.L))) + ' bonus; it is ' + t(MM(d)) + ' more.']),
            ['Find the ' + t(pctT(v.p)) + ' bonus in dollars first.', 'Compare it with ' + t(MW(v.L)) + ' and subtract.'], 'bonus choice', v.p + '% or ' + v.L);
        } }] },
      { num: '8', stem: '', parts: [{ id: '8', level: 'EMG', make: function (r) {
        var bs = r.pick([[10, 25, 40], [8, 20, 35], [12, 25, 50], [15, 30, 45]]), who = r.pick(['Lucas', 'Cole', 'Jesse', 'Wyatt']);
        var prices = find(function () {
          var lo = [r.int(5, 9) * 100 - 1, r.int(5, 9) * 100 + 49], mid = [1999, r.int(10, 19) * 100 + r.pick([49, 99, 50])], hi = [r.int(20, 34) * 100 + r.pick([99, 49, 0])];
          if (r.chance(0.5)) mid.push(r.chance(0.5) ? 1000 : r.int(11, 18) * 100 - 1); else hi.push(r.chance(0.5) ? 2000 : r.int(21, 32) * 100 - 1);
          var all = r.shuffle(lo.slice(0, r.int(1, 2)).concat(mid, hi));
          return all.length === 6 ? all : null;
        }, function (a) { return a.filter(function (x, i) { return a.indexOf(x) !== i; }).length === 0; }, [899, 1450, 2299, 1999, 750, 3100]);
        var tier = function (x) { return x < 1000 ? 0 : x < 2000 ? 1 : 2; }, cnt = [0, 0, 0]; prices.forEach(function (x) { cnt[tier(x)]++; });
        var B = cnt[0] * bs[0] + cnt[1] * bs[1] + cnt[2] * bs[2];
        var edge = 0; prices.forEach(function (x) { if (x === 1999) edge += bs[2] - bs[1]; });
        var list = [[B + edge, 'u2f-edge', t('\\$1999') + ' is <b>under</b> ' + t('\\$2000') + ', so it is in the ' + t('\\$1000') + ' to ' + t('\\$1999') + ' level.'], [6 * bs[1], 'u2f-bonus-count', 'Sort each sofa into its level first. Each level has its own bonus.'], [bs[0] + bs[1] + bs[2], 'u2f-bonus-count', 'Count how many sofas are in each level, then multiply by that level’s bonus.'], [cnt[0] + cnt[1] + cnt[2], 'u2f-bonus-count', 'That’s the number of sofas. Find the bonus for each one.']];
        if (prices.indexOf(2000) >= 0) list.push([B - (bs[2] - bs[1]), 'u2f-edge', t('\\$2000') + ' is in the “' + t('\\$2000') + ' or more” level.']);
        if (prices.indexOf(1000) >= 0) list.push([B - (bs[1] - bs[0]), 'u2f-edge', t('\\$1000') + ' is in the “' + t('\\$1000') + ' to ' + t('\\$1999') + '” level, not under ' + t('\\$1000') + '.']);
        var grp = function (k) { return prices.filter(function (x) { return tier(x) === k; }).map(function (x) { return t('\\$' + x); }).join(' and '); };
        var p = mp('A furniture store pays a bonus for each sofa sold: ' + t('\\$' + bs[0]) + ' for a sofa under ' + t('\\$1000') + ', ' + t('\\$' + bs[1]) + ' for a sofa from ' + t('\\$1000') + ' to ' + t('\\$1999') + ', and ' + t('\\$' + bs[2]) + ' for a sofa ' + t('\\$2000') + ' or more. This week ' + who + ' sold sofas for ' + prices.slice(0, -1).map(function (x) { return t('\\$' + x); }).join(', ') + ' and ' + t('\\$' + prices[5]) + '. Find his bonus.', B, dl(list),
          sol(['Under ' + t('\\$1000') + ': ' + grp(0) + ', so ' + t(cnt[0] + '\\times \\$' + bs[0] + '=\\$' + cnt[0] * bs[0]), t('\\$1000') + ' to ' + t('\\$1999') + ': ' + grp(1) + ', so ' + t(cnt[1] + '\\times \\$' + bs[1] + '=\\$' + cnt[1] * bs[1]), t('\\$2000') + ' or more: ' + grp(2) + ', so ' + t(cnt[2] + '\\times \\$' + bs[2] + '=\\$' + cnt[2] * bs[2]), 'bonus ' + t('=\\$' + cnt[0] * bs[0] + '+\\$' + cnt[1] * bs[1] + '+\\$' + cnt[2] * bs[2] + '=' + MM(B))]),
          ['Sort the sofas into the three price levels. Watch the edges: ' + t('\\$1999') + ' is under ' + t('\\$2000') + '.', 'Bonus = (number in each level × that level’s bonus), added up.'], 'sofa bonus');
        p.bad = badOf(list, B); return p;
      } }] },
      { num: '9', stem: function (sh) { return sh.name + ' works at a ' + sh.where + ' in ' + sh.town + '. He earns ' + t(rateT(sh.w)) + ', plus a premium of ' + t(rateT(sh.pi)) + ' for every hour after ' + clock(sh.T) + ' His breaks are paid.'; },
        shared: function (r) {
          return find(function () { var T = r.pick([19, 18, 20]), d = shifts(r, T); if (!d) return null; var H = d.reduce(function (s, x) { return s + x.L; }, 0), PH = d.reduce(function (s, x) { return s + x.pr; }, 0); return { name: r.pick(['Kofi', 'Cole', 'Jesse', 'Wyatt']), where: r.pick(['gas station', 'grocery store', 'hardware store']), town: r.pick(['Okotoks', 'Airdrie', 'Cochrane', 'High River']), w: r.pick([16.25, 15.75, 16.5, 17, 15.5]), pi: r.pick([1.5, 1.25, 2, 1.75]), T: T, days: d, H: H, PH: PH }; },
            function (s) { return s && !(s.T === 18 && s.pi === 2.5); }, null) || { name: 'Kofi', where: 'gas station', town: 'Okotoks', w: 16.25, pi: 1.5, T: 19, H: 30, PH: 9.5, days: [{ day: 'Monday', s: 15, e: 23, L: 8, pr: 4 }, { day: 'Wednesday', s: 11, e: 19, L: 8, pr: 0 }, { day: 'Thursday', s: 16, e: 22, L: 6, pr: 3 }, { day: 'Saturday', s: 13.5, e: 21.5, L: 8, pr: 2.5 }] };
        },
        parts: [
          { id: '9a', level: 'EMG', make: function (r, sh) { return timesheetPart(sh); } },
          { id: '9b', level: 'PRG', make: function (r, sh) { return premGrossPart('Find his gross pay for the week.', sh.H, sh.w, sh.PH, sh.pi, { when: ' after ' + clock(sh.T), pre: ['No day is over 8 h and the week is under 44 h, so there is no overtime.'], hints: ['Regular pay = total hours (from the timesheet) × the wage.', 'Premium pay = hours after ' + clock(sh.T) + ' × ' + t(MM(sh.pi)) + '. Add them.'], text: 'Kofi gross' }); } }] },
      { num: '10', stem: function (sh) { return 'A warehouse pays night-shift workers ' + t(pctT(sh.p)) + ' more per hour. The day wage is ' + t(rateT(sh.w)) + '.'; },
        shared: function (r) { return { w: r.pick([19.75, 18.5, 20.25, 17.8, 21.4, 18.9]), p: r.pick([12, 10, 15, 8]) }; },
        parts: [
          { id: '10a', level: 'BEG', make: function (r, sh) {
            var R = sh.w * (1 + sh.p / 100), list = [[pctOf(sh.p, sh.w), 'u2f-extra-only', 'That’s only the extra per hour. Add it to the day wage (or multiply by ' + t(mulT(sh.p)) + ').'], [sh.w + sh.p, 'u2e-added-sales', 'You added ' + t(sh.p) + ' dollars. ' + t(pctT(sh.p)) + ' more means ' + t(MM(sh.w) + '\\times ' + mulT(sh.p)) + '.'], [sh.w * (1 + sh.p / 10), 'pct-one-place', t(pctT(sh.p) + '=' + decT(sh.p)) + ', so multiply by ' + t(mulT(sh.p)) + '.'], [sh.w + sh.p / 100, 'u2e-added-sales', 'Multiply by ' + t(mulT(sh.p)) + ', don’t add ' + t(decT(sh.p)) + '.']];
            var p = mp('What is the night-shift hourly rate?', R, dl(list), sol([t(MM(sh.w) + '\\times ' + mulT(sh.p) + eqMM(R)) + '/h']), ['A percent more: multiply by ' + t('1+') + ' the rate as a decimal.'], 'night rate', { after: '/h' });
            p.bad = badOf(list, R); return p;
          } },
          { id: '10b', level: 'EMG', make: function (r, sh) {
            var R = r2(sh.w * (1 + sh.p / 100)), N = 8 * R, D = 8 * sh.w, d = N - D;
            var p = PK.fields('How much does a worker earn for an 8-hour night shift? How much more is that than an 8-hour day shift?', [{ label: 'Night shift', before: '$', name: 'Night shift pay' }, { label: 'More than a day shift by', before: '$', name: 'How much more' }],
              [PK.either(PK.money(N, dl([[R, 'u2e-no-hours', 'That’s the rate for 1 hour. Multiply by 8.'], [D, 'u2f-no-prem', 'That’s a day shift. Use the night rate from (a).']])), PK.money(8 * sh.w * (1 + sh.p / 100))),
                PK.either(PK.money(d, dl([[R - sh.w, 'u2f-rate-diff', 'That’s the difference for 1 hour. Find it for the whole 8-hour shift.'], [D, 'u2f-total', 'That’s a day shift’s pay. Subtract it from the night shift’s pay.']])), PK.money(8 * sh.w * sh.p / 100))],
              [m$(N), m$(d)], 'night ' + t(MM(N)) + ', ' + t(MM(d)) + ' more', sol(['night: ' + t('8\\times ' + MM(R) + '=' + MM(N)) + '; day: ' + t('8\\times ' + MM(sh.w) + '=' + MM(D)), t(MM(N) + '-' + MM(D) + '=' + MM(d)) + ' more']), ['Night pay = 8 × the night rate from (a).', 'Find a day shift’s pay, then subtract.'], 'night vs day');
            p.bad = [[m$(R), m$(d)], [m$(N), m$(R - sh.w)]]; return p;
          } }] },
      { num: '11', stem: '', parts: [
        { id: '11a', level: 'PRG', make: function (r) {
          var v = find(function () { return { w: r.pick([46.8, 44.6, 48.2, 42.4, 45.6]), p: r.pick([15, 10, 20, 12]), h1: r.pick([12, 10, 8, 15, 14]), h2: r.pick([28, 30, 24, 26]) }; }, function () { return true; }, { w: 46.8, p: 15, h1: 12, h2: 28 });
          var R = r2(v.w * (1 + v.p / 100)), A = v.h1 * R, B = v.h2 * v.w, G = A + B, Gx = v.h1 * v.w * (1 + v.p / 100) + B;
          var list = [[(v.h1 + v.h2) * R, 'u2f-danger-all', 'The danger pay is only for the ' + hT(v.h1) + ' on live lines. The other ' + hT(v.h2) + ' are at ' + t(MM(v.w)) + '.'], [(v.h1 + v.h2) * v.w, 'u2f-no-prem', 'Add the danger pay: the ' + hT(v.h1) + ' on live lines are paid ' + t(pctT(v.p)) + ' more.'], [A, 'u2f-prem-only', 'Add the pay for the other ' + hT(v.h2) + '.'], [B, 'u2f-no-prem', 'Add the live-line pay too.'], [v.h1 * pctOf(v.p, v.w) + B, 'u2f-extra-only', 'The live-line hours get the wage <b>and</b> the ' + t(pctT(v.p)) + ': rate ' + t('=' + MM(v.w) + '\\times ' + mulT(v.p)) + '.']];
          var p = mp('A power line worker earns ' + t(rateT(v.w)) + '. For work on live lines he gets danger pay of ' + t(pctT(v.p)) + ' more per hour. Last week he worked ' + hT(v.h1) + ' on live lines and ' + t(v.h2) + ' other hours. Find his gross pay.', G, dl(list),
            sol(['live-line rate ' + t('=' + MM(v.w) + '\\times ' + mulT(v.p) + eqMM(v.w * (1 + v.p / 100))) + '/h', t(v.h1 + '\\times ' + MM(R) + '=' + MM(A)), t(v.h2 + '\\times ' + MM(v.w) + '=' + MM(B)), 'gross ' + t('=' + MM(A) + '+' + MM(B) + '=' + MM(G))]), ['Find the live-line rate first (a percent more: × ' + t(mulT(v.p)) + ').', 'Pay each kind of hour at its own rate, then add.'], 'danger pay');
          p.check = PK.either(p.check, PK.money(Gx)); p.bad = badOf(list, G); return p;
        } },
        { id: '11b', level: 'PRG', make: function (r) {
          var v = find(function () { return { R: r.pick([4480, 4200, 5040, 3920, 4760]), N: r.pick([14, 10, 7, 21]), d: r.pick([45, 40, 50, 35, 30]), p: r.pick([8, 10, 6, 5, 12]), who: r.pick(['lab worker', 'camp cook', 'first-aid attendant']) }; }, function (v) { var a = v.N * v.d, b = pctOf(v.p, v.R); return Math.abs(a - b) >= 15 && Math.abs(a - b) <= 500; }, { R: 4480, N: 14, d: 45, p: 8, who: 'lab worker' });
          var a = v.N * v.d, b = pctOf(v.p, v.R), dayWin = a > b, D = Math.abs(a - b);
          return whichBy('A ' + v.who + ' at a remote camp earns ' + t(MW(v.R)) + ' for a ' + v.N + '-day rotation. She can choose isolation pay of ' + t(MW(v.d)) + ' per day, or ' + t(pctT(v.p)) + ' of her pay. Which pays more for one rotation, and by how much?',
            { name: 'the ' + MW(v.d) + ' per day', key: 'per day', re: new RegExp('day|daily|^\\$?\\s?' + v.d + '$') }, { name: 'the ' + pctT(v.p), key: v.p + '%', re: /%|percent/ }, dayWin ? 'A' : 'B', D,
            [[v.d, 'u2e-no-hours', 'Find the per-day pay for all ' + v.N + ' days: ' + t(v.N + '\\times ' + MW(v.d)) + '.'], [Math.abs(v.d - b), 'u2e-no-hours', 'The per-day pay is for each of the ' + v.N + ' days.'], [a, 'u2f-total', 'That’s the per-day choice. Find the difference.'], [b, 'u2f-total', 'That’s the ' + t(pctT(v.p)) + ' choice. Find the difference.']],
            sol(['per day: ' + t(v.N + '\\times ' + MW(v.d) + '=' + MM(a)), t(pctT(v.p)) + ': ' + t(MW(v.R) + '\\times ' + decT(v.p) + eqMM(b)), t((dayWin ? MM(a) + '-' + MM(b) : MM(b) + '-' + MM(a)) + '=' + MM(D)), 'The ' + (dayWin ? t(MW(v.d)) + ' per day' : t(pctT(v.p))) + ' choice pays ' + t(MM(D)) + ' more.']),
            ['Find what each choice pays for the whole rotation.', 'Then subtract.'], 'isolation choice', 'per day or ' + v.p + '%');
        } }] },
      { num: '12', stem: function (sh) { return sh.name + ' worked ' + hT(sh.H) + ' at ' + t(rateT(sh.w)) + '. He gets a night premium of ' + t(rateT(sh.pi)) + ', and ' + sh.n + ' of his hours were at night. Here is how his friend worked out his pay:<div style="display:inline-block;margin:6px 0 4px 18px;padding:6px 12px;border:1.5px solid #9aa3ad;border-radius:6px">' + t(MM(sh.w) + '+' + MM(sh.pi) + '=' + MM(sh.w + sh.pi)) + '<br>' + t(sh.H + '\\times ' + MM(sh.w + sh.pi) + '=' + MM(sh.H * (sh.w + sh.pi))) + '</div>'; },
        shared: function (r) { return { name: r.pick(['Marco', 'Cole', 'Jesse', 'Wyatt']), H: r.pick([40, 36, 38, 32, 35]), w: r.pick([17, 16.5, 18, 17.5, 16.25]), pi: r.pick([2, 1.5, 2.5, 1.75]), n: r.pick([12, 10, 16, 8, 14]) }; },
        parts: [
          { id: '12a', level: 'BEG', make: function (r, sh) {
            return P.mc(r, 'What mistake did his friend make?', [
              { html: 'He added the ' + t(MM(sh.pi)) + ' premium to all ' + sh.H + ' hours. Only the ' + sh.n + ' night hours get the premium.', right: true },
              { html: 'He should have multiplied the wage by ' + t('1.5') + ' for the night hours.', why: 'Night hours are not overtime. They get the ' + t(MM(sh.pi)) + ' premium, not time-and-a-half.', code: 'ot' },
              { html: 'He should have subtracted the premium from the wage.', why: 'A premium is <b>extra</b> pay, so it is added, but only for the night hours.', code: 'sub' },
              { html: 'There is no mistake.', why: 'Read the question again: only ' + sh.n + ' of the ' + sh.H + ' hours were at night.', code: 'none' }],
              'He added the ' + t(MM(sh.pi)) + ' premium to all ' + sh.H + ' hours. Only the ' + sh.n + ' night hours get the premium.', ['How many of the hours were night hours?'], 'friend mistake');
          } },
          { id: '12b', level: 'EMG', make: function (r, sh) { return premGrossPart('Find ' + sh.name + '’s correct gross pay.', sh.H, sh.w, sh.n, sh.pi, { when: ' at night', text: 'Marco gross' }); } }] },
      { num: '13', stem: function (sh) { return sh.name + ' is a bartender at a pub in ' + sh.town + '. She earns ' + t(rateT(sh.w)) + '. This week she worked ' + hT(sh.Lg) + ' on ' + sh.day + ' and ' + hT(8) + ' on each of ' + ['', '', '', 'three', 'four', 'five'][sh.k] + ' other days. She gets a late-night premium of ' + t(rateT(sh.pi)) + ', and ' + sh.n + ' of her hours were late-night hours. Her share of the tip pool was ' + t(MM(sh.TS)) + '.'; },
        shared: function (r) { return zoeShared(r) || { name: 'Zoe', town: 'Canmore', w: 15.5, Lg: 10, k: 4, H: 42, daily: 2, wk: 0, OT: 2, pi: 1.25, n: 15, TS: 389.4, day: 'Saturday' }; },
        parts: [
          { id: '13a', level: 'ADV', make: function (r, sh) {
            var list = [[0, 'u2f-ot-none', sh.daily > 0 ? 'Check the daily rule: on ' + sh.day + ' she worked ' + hT(sh.Lg) + ', which is over 8.' : 'Check both rules again.'], [sh.daily + sh.wk, 'u2f-ot-both', 'Don’t add the two rules. Use whichever gives <b>more</b> hours.']];
            if (sh.wk > sh.daily) list.push([sh.daily, 'u2f-ot-daily', 'Check the weekly rule too: ' + hT(sh.H) + ' is over 44, so ' + t(sh.H + '-44=' + sh.wk) + ' h by the week. Use the bigger one.']);
            if (sh.daily > sh.wk && sh.wk > 0) list.push([sh.wk, 'u2f-ot-weekly', 'The daily rule gives more: ' + t(sh.Lg + '-8=' + sh.daily) + ' h. Use the bigger one.']);
            list.push([sh.H - 44, 'u2f-ot-weekly', sh.H < 44 ? 'The week is not over 44 h, so the weekly rule gives 0 h. Check the daily rule.' : 'Check the daily rule too, and use the bigger one.']);
            list.push([sh.H, 'u2f-hours', 'That’s all her hours. Overtime is only the hours over 8 in a day or over 44 in the week.']);
            var dg = function (v) { for (var i = 0; i < list.length; i++) if (near(v, list[i][0]) && !near(v, sh.OT)) return { code: list[i][1], hint: list[i][2] }; return null; };
            var p = numPart('How many hours of overtime did she work? (Alberta: over 8 in a day or over 44 in a week, whichever is more.)', sh.OT, null, dg,
              sol(['total ' + t('=' + sh.Lg + '+' + sh.k + '\\times 8=' + sh.H) + ' h.', 'Daily: ' + t(sh.Lg + '-8=' + sh.daily) + ' h.', 'Weekly: ' + (sh.H > 44 ? t(sh.H + '-44=' + sh.wk) + ' h.' : t(sh.H)) + (sh.H > 44 ? '' : ' is not over 44, so 0 h.'), 'Use the bigger one: ' + hT(sh.OT) + ' of overtime, and ' + t(sh.H + '-' + sh.OT + '=' + (sh.H - sh.OT)) + ' regular hours.']),
              ['Find the overtime both ways: by the day (over 8) and by the week (over 44).', 'Use whichever gives more hours.'], 'OT hours', { after: 'h' });
            p.bad = list.map(function (x) { return dS(x[0]); }).filter(function (x, i, a) { return !near(Number(x), sh.OT) && a.indexOf(x) === i && Number(x) >= 0; });
            return p;
          } },
          { id: '13b', level: 'MAS', make: function (r, sh) { return summaryPart(sh); } }] },
      { num: '14', stem: '', parts: [{ id: '14', level: 'ADV', make: function (r) {
        var v = find(function () { return { h: r.pick([6, 5, 4, 7, 8]), u: r.pick([16.25, 15.5, 18.75, 14.25, 17.5, 13.75]), Ht: r.int(20, 40), name: r.pick(['Kai', 'Cole', 'Jesse', 'Wyatt']), day: r.pick(['Sunday', 'Saturday', 'Friday']) }; }, function (v) { return v.Ht > v.h * 2; }, { h: 6, u: 16.25, Ht: 26, name: 'Kai', day: 'Sunday' });
        var share = v.h * v.u, pool = v.Ht * v.u;
        var dg = function (x) {
          if (near(x, rnd(pool / share, 2)) || near(x, rnd(pool / share, 1))) return { code: 'u2f-pool-ratio', hint: 'That compares the pool with his share. Find the share for 1 hour first: ' + t(MM(share) + '\\div ' + v.h) + '.' };
          if (nearM(x, v.u)) return { code: 'u2f-per-hour', hint: 'That’s the share for 1 hour. Now divide the whole pool by it.' };
          if (nearM(x, pool / v.h)) return { code: 'u2f-pool-ratio', hint: 'Find the share for 1 hour (his share ÷ his hours), then divide the pool by it.' };
          if (near(x, v.Ht - v.h)) return { code: 'u2f-hours', hint: 'That leaves out ' + v.name + '’s own hours. The pool is for everyone’s hours, his too.' };
          return null;
        };
        var p = numPart(v.name + ' worked ' + hT(v.h) + ' on ' + v.day + '. His restaurant shares the tip pool by hours, and his share was ' + t(MM(share)) + '. The whole pool was ' + t(MM(pool)) + '. How many hours did all the staff work in total?', v.Ht, null, dg,
          sol(['share for 1 hour ' + t('=' + MM(share) + '\\div ' + v.h + '=' + MM(v.u)), 'total hours ' + t('=' + MM(pool) + '\\div ' + MM(v.u) + '=' + v.Ht) + ' h', 'Check: ' + t(v.Ht + '\\times ' + MM(v.u) + '=' + MM(pool)) + ' ✓. The staff worked ' + hT(v.Ht) + ' in total.']),
          ['Find the share for 1 hour from ' + v.name + '’s share and hours.', 'Total hours = the whole pool ÷ the share for 1 hour.'], 'pool backwards', { after: 'h' });
        p.bad = [dS(rnd(pool / share, 2)), dS(v.u), dS(v.Ht - v.h)].filter(function (x) { return !near(Number(x), v.Ht); });
        return p;
      } }] },
      { num: '15', stem: '', parts: [{ id: '15', level: 'BEG', make: function (r) {
        var B = r.pick([60, 40, 80, 50, 70, 30, 90]), tip = pctOf(15, B);
        return P.mc(r, 'A ' + t('15\\%') + ' tip on a ' + t(MM(B)) + ' bill is', [
          { html: t(MM(tip / 10)), why: 'That uses ' + t('0.015') + '. ' + t('15\\%=0.15') + '.', code: 'small' }, { html: t(MM(B / 10)), why: 'That’s only ' + t('10\\%') + '. Add half of it to get ' + t('15\\%') + '.', code: 'ten' },
          { html: t(MM(tip)), right: true }, { html: t(MM(B + tip)), why: 'That’s the bill plus the tip. The tip is only the ' + t('15\\%') + '.', code: 'total' }],
          t(MM(B) + '\\times 0.15=' + MM(tip)) + '.', ['Tip = bill × 0.15.'], 'MC tip', true);
      } }] },
      { num: '16', stem: '', parts: [{ id: '16', level: 'EMG', make: function (r) {
        var v = find(function () { return { w: r.pick([18, 17, 16, 19, 20]), pi: r.pick([2, 1.5, 3, 2.5]), n: r.pick([3, 2, 4, 5]), T: r.pick([20, 21, 19]), name: r.pick(['Ali', 'Cole', 'Jesse', 'Wyatt']) }; }, function (v) { var o = [8 * v.w + v.pi, 8 * v.w + v.n * v.pi, 8 * (v.w + v.pi), 8 * v.w + v.n * (v.w + v.pi)]; return o.every(function (x, i) { return o.indexOf(x) === i; }); }, { w: 18, pi: 2, n: 3, T: 20, name: 'Ali' });
        var base = 8 * v.w, opts = [{ v: base + v.pi, why: 'That adds the ' + t(MM(v.pi)) + ' only once. It is for <b>each</b> of the ' + v.n + ' hours.', code: 'once' }, { v: base + v.n * v.pi, right: true }, { v: 8 * (v.w + v.pi), why: 'That pays the premium on all 8 hours. Only ' + v.n + ' hours are after ' + clock(v.T), code: 'all' }, { v: base + v.n * (v.w + v.pi), why: 'The ' + v.n + ' late hours are already in the 8 hours. Add only the premium: ' + t(v.n + '\\times ' + MM(v.pi)) + '.', code: 'twice' }].sort(function (a, b) { return a.v - b.v; });
        return P.mc(r, v.name + ' earns ' + t(rateT(v.w)) + ' and gets a ' + t(rateT(v.pi)) + ' premium for hours after ' + clock(v.T) + ' He works an 8-hour shift, and ' + v.n + ' of the hours are after ' + clock(v.T) + ' His pay for the shift is', opts.map(function (o) { return { html: t(MM(o.v)), right: o.right, why: o.why, code: o.code }; }),
          t('8\\times ' + MM(v.w) + '=' + MM(base)) + '; ' + t(v.n + '\\times ' + MM(v.pi) + '=' + MM(v.n * v.pi)) + '; ' + t(MM(base) + '+' + MM(v.n * v.pi) + '=' + MM(base + v.n * v.pi)) + '.', ['Pay all 8 hours at the wage, then add the premium for the late hours.'], 'MC premium', true);
      } }] },
      { num: '17', stem: '', parts: [{ id: '17', level: 'EMG', make: function (r) {
        var v = find(function () { return [r.int(200, 300) * 200 + r.pick([0, 100]), r.pick([3.5, 2.5, 4.5, 1.5])]; }, function (v) { return !(v[0] === 46800); }, [48200, 3.5]), b = pctOf(v[1], v[0]), want = Math.round(b), who = r.pick(['carpenter', 'welder', 'plumber', 'electrician']);
        var list = U.ofList(v[1], v[0], { addOn: false });
        var dg = function (x) { for (var i = 0; i < list.length; i++) if (Math.abs(x - list[i][0]) < 0.5 + 1e-9) return { code: list[i][1], hint: list[i][2] }; return null; };
        var p = PK.part('<b>Numerical response.</b> A ' + who + ' earns ' + t(MW(v[0])) + ' a year. His bonus is ' + t(pctT(v[1])) + ' of his salary. His bonus, to the nearest dollar, is ' + t('\\$') + '________.', PK.num(b, 0, dg, { nr: true }), String(want), String(want), sol([t(MW(v[0]) + '\\times ' + decT(v[1]) + eqMM(b)) + (near(b, want) ? '' : ' ≈ ' + t('\\$' + want))]), ['Bonus = salary × rate (as a decimal).'], 'NR bonus', { nr: true });
        p.bad = list.map(function (x) { return String(Math.round(x[0])); }).filter(function (s, i, a) { return Number(s) !== want && a.indexOf(s) === i && s.length <= 4; });
        return p;
      } }] },
      { num: '18', stem: '', parts: [{ id: '18', level: 'EMG', make: function (r) {
        var v = find(function () { return [r.pick([11.5, 9.5, 12.5, 8.5, 10.5, 13.5]), r.int(50, 90) + r.pick([0, 0.5, 0.25])]; }, function (v) { var P0 = v[0] / v[1] * 100; return !near(P0, rnd(P0, 1)) && P0 > 10 && P0 < 25 && !(v[0] === 9); }, [11.5, 68]);
        return tipPctPart(v[0], v[1], '<b>Numerical response.</b> A customer leaves a ' + t(MM(v[0])) + ' tip on a ' + t(MM(v[1])) + ' bill. The tip percent, to the nearest tenth of a percent, is ________%.', 'NR tip %', true);
      } }] }
    ],
    extra: [
      { num: '1', section: 'A. Skills', stem: 'Find each tip.', parts: [
        { id: 'e1a', level: 'BEG', make: function (r) { var B = r.pick([56, 44, 64, 36, 72, 48]); return U.pctPart(15, B, t('15\\%') + ' of a ' + t(MM(B)) + ' bill', { word: 'tip', of: 'bill', addOn: true, text: 'e1a' }); } },
        { id: 'e1b', level: 'BEG', make: function (r) { var B = r.int(60, 120) + r.pick([0.5, 0.25, 0.75]), p = r.pick([18, 12, 16]); return U.pctPart(p, B, t(pctT(p)) + ' of a ' + t(MM(B)) + ' bill', { word: 'tip', of: 'bill', text: 'e1b' }); } },
        { id: 'e1c', level: 'BEG', make: function (r) { var B = r.int(2000, 5000) / 100; return U.pctPart(20, B, t('20\\%') + ' of a ' + t(MM(B)) + ' bill', { word: 'tip', of: 'bill', text: 'e1c' }); } }] },
      { num: '2', stem: 'What percent tip is it? Round to the nearest tenth of a percent if needed.', parts: [
        { id: 'e2a', level: 'BEG', make: function (r) { var v = find(function () { return [r.pick([75, 50, 25, 60, 80, 40]), r.pick([16, 12, 18, 14, 20])]; }, function (v) { return near(pctOf(v[1], v[0]), r2(pctOf(v[1], v[0]))); }, [75, 16]), tip = pctOf(v[1], v[0]); return tipPctPart(tip, v[0], t(MM(tip)) + ' on a ' + t(MM(v[0])) + ' bill', 'e2a'); } },
        { id: 'e2b', level: 'EMG', make: function (r) { var v = find(function () { return [r.pick([4.5, 3.5, 5.5, 6.5]), r.int(2500, 4500) / 100]; }, function (v) { var P0 = v[0] / v[1] * 100; return !near(P0, rnd(P0, 1)) && P0 > 9 && P0 < 25; }, [4.5, 31.2]); return tipPctPart(v[0], v[1], t(MM(v[0])) + ' on a ' + t(MM(v[1])) + ' bill', 'e2b'); } }] },
      { num: '3', stem: '', parts: [{ id: 'e3', level: 'BEG', make: function (r) {
        var n = r.pick([7, 6, 5, 8, 9]), each = r.int(60, 120) + r.pick([0.5, 0, 0.25, 0.75]), pool = n * each, words = ['', '', '', '', '', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
        var list = [[pool * n, 'u2e-back-mult', 'Share the pool: <b>divide</b> by the number of servers.'], [pool - n, 'u2e-back-mult', 'Divide the pool by ' + n + '.']];
        var p = mp(words[n] + ' servers share a tip pool of ' + t(MM(pool)) + ' equally. How much does each server get?', each, dl(list), t(MM(pool) + '\\div ' + n + '=' + MM(each)) + ' each', ['Share equally: pool ÷ number of servers.'], 'equal pool');
        p.bad = badOf(list, each); return p;
      } }] },
      { num: '4', stem: '', parts: [
        { id: 'e4a', level: 'BEG', make: function (r) { var S = r.int(280, 520) * 125, p = r.pick([6, 5, 4, 7, 3]); return U.pctPart(p, S, 'A ' + r.pick(['dental assistant', 'medical office clerk', 'bank teller']) + ' earns ' + t(MW(S)) + ' a year and gets a ' + t(pctT(p)) + ' bonus. Find the bonus.', { word: 'bonus', of: 'salary', text: 'e4a' }); } },
        { id: 'e4b', level: 'LIM', make: function (r) {
          var each = r.pick([12, 10, 15, 8, 20]), n = r.int(14, 35), b = n * each, what = r.pick([['gym', 'membership', 'memberships'], ['phone store', 'phone plan', 'phone plans'], ['electronics store', 'warranty', 'warranties'], ['bank', 'credit card', 'credit cards']]);
          var p = mp('A ' + what[0] + ' pays its staff ' + t('\\$' + each) + ' for each ' + what[1] + ' they sell. ' + r.pick(['Jas', 'Amira', 'Talia']) + ' sold ' + n + ' ' + what[2] + '. Find her bonus.', b, dl([[n + each, 'u2e-back-mult', 'Multiply the number sold by the bonus for each one.']]), t(n + '\\times \\$' + each + '=' + MM(b)), ['Per-item bonus = number of items × bonus per item.'], 'per item');
          p.bad = [m$(n + each)]; return p;
        } }] },
      { num: '5', stem: '', parts: [
        { id: 'e5a', level: 'BEG', make: function (r) {
          var pi = r.pick([2.4, 1.8, 2.25, 1.6, 3.1]), n = r.int(10, 24), a = n * pi;
          var p = mp('A worker gets a shift premium of ' + t(rateT(pi)) + '. She worked ' + n + ' premium hours. How much premium pay did she earn?', a, dl([[n + pi, 'u2e-back-mult', 'Multiply the hours by the premium per hour.']]), t(n + '\\times ' + MM(pi) + '=' + MM(a)), ['Premium pay = premium hours × premium per hour.'], 'premium pay');
          p.bad = [m$(n + pi)]; return p;
        } },
        { id: 'e5b', level: 'BEG', make: function (r) {
          var w = r.pick([17.6, 18.4, 19.2, 16.8, 20.4]), p = r.pick([15, 10, 20, 12]), R = w * (1 + p / 100), who = r.pick(['nurse', 'health-care aide', 'lab technician']);
          var list = [[pctOf(p, w), 'u2f-extra-only', 'That’s only the extra. Multiply the wage by ' + t(mulT(p)) + '.'], [w + p, 'u2e-added-sales', t(pctT(p)) + ' more means × ' + t(mulT(p)) + ', not + ' + t(p) + ' dollars.'], [w * (1 + p / 10), 'pct-one-place', t(pctT(p) + '=' + decT(p)) + '.']];
          var q = mp('A ' + who + '’s base wage is ' + t(rateT(w)) + '. A weekend shift pays ' + t(pctT(p)) + ' more per hour. What is the weekend rate?', R, dl(list), t(MM(w) + '\\times ' + mulT(p) + eqMM(R)) + '/h', ['A percent more: multiply by ' + t(mulT(p)) + '.'], 'weekend rate', { after: '/h' });
          q.bad = badOf(list, R); return q;
        } }] },
      { num: '6', section: 'B. Applying', stem: function (sh) { return sh.name + ' delivers groceries in ' + sh.city + '. He is paid ' + t(rateT(sh.w)) + '. On ' + sh.day + ' he worked ' + hT(sh.h) + ' and made ' + sh.n + ' deliveries. His tips averaged ' + t(MM(sh.t)) + ' per delivery.'; },
        shared: function (r) { return { name: r.pick(['Owen', 'Cole', 'Jesse', 'Wyatt']), city: r.pick(['Calgary', 'Edmonton', 'Airdrie']), day: r.pick(['Sunday', 'Saturday']), w: r.pick([15, 15.5, 16, 15.25]), h: r.pick([5, 4, 6, 7]), n: r.int(10, 22), t: r.pick([4.25, 3.75, 5.5, 4.5, 3.25]) }; },
        parts: [
          { id: 'e6a', level: 'EMG', make: function (r, sh) {
            var wp = sh.h * sh.w, tips = sh.n * sh.t, g = wp + tips, list = wageTipsList(sh.h, sh.w, tips, { more: [[wp + sh.t, 'u2f-no-tips', 'The tips are ' + t(MM(sh.t)) + ' for <b>each</b> of the ' + sh.n + ' deliveries.'], [sh.h * (sh.w + sh.t), 'u2f-no-tips', 'The tips are per delivery, not per hour: ' + t(sh.n + '\\times ' + MM(sh.t)) + '.']] });
            var p = mp('Find his gross pay for ' + sh.day + '.', g, dl(list), sol(['wage pay ' + t('=' + sh.h + '\\times ' + MM(sh.w) + '=' + MM(wp)), 'tips ' + t('=' + sh.n + '\\times ' + MM(sh.t) + '=' + MM(tips)), 'gross ' + t('=' + MM(wp) + '+' + MM(tips) + '=' + MM(g))]), ['Wage pay = hours × wage. Tips = deliveries × average tip.', 'Add them.'], 'delivery gross');
            p.bad = badOf(list, g); return p;
          } },
          { id: 'e6b', level: 'EMG', make: function (r, sh) {
            var g = sh.h * sh.w + sh.n * sh.t, ph = g / sh.h, list = [[g / sh.n, 'u2f-pool-ratio', 'Divide by the <b>hours</b> (' + sh.h + '), not the deliveries.'], [sh.w + sh.t, 'u2f-no-tips', 'Use his whole gross pay from (a), divided by the hours.'], [g, 'u2e-no-hours', 'That’s his pay for the day. Divide by the ' + sh.h + ' hours.']];
            var p = mp('How much did he earn per hour, with tips?', ph, dl(list), t(MM(g) + '\\div ' + sh.h + eqMM(ph)) + ' per hour', ['Per hour = gross pay ÷ hours.'], 'per hour', { after: '/h' });
            p.bad = badOf(list, ph); return p;
          } }] },
      { num: '7', stem: '', parts: [{ id: 'e7', level: 'PRG', make: function (r) {
        var v = find(function () { var hrs = [r.int(14, 20) / 2, r.int(12, 18) / 2, r.int(10, 16) / 2], d = r.pick([10, 20, 15]), Pl = r.int(16, 40) * 50; return { hrs: hrs, d: d, P: Pl, left: Pl * (100 - d) / 100 }; },
          function (v) { var H = v.hrs[0] + v.hrs[1] + v.hrs[2], u = v.left / H; return near(u * 100, Math.round(u * 100)) && v.hrs.some(function (x) { return x % 1 !== 0; }) && v.hrs[0] !== v.hrs[1] && v.hrs[1] !== v.hrs[2]; }, { hrs: [9, 7.5, 6.5], d: 10, P: 1150, left: 1035 });
        var names = r.pick([['Lina', 'Rob', 'Kim'], ['Ava', 'Jon', 'Mo'], ['Priya', 'Sam', 'Tess']]), H = v.hrs[0] + v.hrs[1] + v.hrs[2], u = v.left / H, dish = pctOf(v.d, v.P);
        var rows = ['\\text{Dishwashers (' + v.d + '\\%)}', '\\text{Left for the servers}'].concat(names.map(function (n) { return '\\text{' + n + '}'; })), cols = ['\\text{Hours}', '\\text{Amount (\\$)}'];
        var cells = [['', null], ['', null]].concat(v.hrs.map(function (h) { return [dS(h), null]; }));
        var blanks = [{ where: 'cell', i: 0, j: 1, name: 'Dishwashers', chk: PK.money(dish, dl(U.ofList(v.d, v.P, { addOn: false }))) }, { where: 'cell', i: 1, j: 1, name: 'Left for the servers', chk: PK.money(v.left, dl([[dish, 'u2f-tipout-kept', 'That’s the dishwashers’ part. Subtract it from the pool.'], [v.P, 'u2f-tipout-one', 'Take the dishwashers’ ' + t(pctT(v.d)) + ' off first.']])) }];
        v.hrs.forEach(function (h, j) { blanks.push({ where: 'cell', i: 2 + j, j: 1, name: names[j], chk: PK.money(h * u, dl([[v.left / 3, 'u2f-equal', 'Share by <b>hours</b>: find the share for 1 hour first (' + t(MM(v.left) + '\\div ' + dS(H)) + ').'], [h * v.P / H, 'u2f-tipout-one', 'Share only what is left after the dishwashers, ' + t(MM(v.left)) + '.'], [u, 'u2f-per-hour', 'That’s the share for 1 hour. Multiply by ' + names[j] + '’s hours.']])) }); });
        var keyCells = [['', m$(dish)], ['', m$(v.left)]].concat(v.hrs.map(function (h) { return [dS(h), m$(h * u)]; }));
        return PK.tablePart('A brunch restaurant collects ' + t(MM(v.P)) + ' in tips on Sunday. First, ' + t(pctT(v.d)) + ' goes to the dishwashers. The rest is shared by the three servers by the hours they worked. How much does each server get?', { rows: rows, cols: cols, cells: cells, corner: '\\text{Tip pool}', keys: 'pctkit-money', help: 'Tap a box, then type the amount (no $ needed).' }, PK.tableChk(blanks), { rows: rows, cols: cols, cells: keyCells },
          sol(['dishwashers ' + t('=' + MM(v.P) + '\\times ' + decT(v.d) + '=' + MM(dish)) + '; left ' + t('=' + MM(v.P) + '-' + MM(dish) + '=' + MM(v.left)), 'total hours ' + t('=' + v.hrs.map(dS).join('+') + '=' + dS(H)) + ' h; share for 1 hour ' + t('=' + MM(v.left) + '\\div ' + dS(H) + '=' + MM(u)), names.map(function (n, j) { return n + ' ' + t(dS(v.hrs[j]) + '\\times ' + MM(u) + '=' + MM(v.hrs[j] * u)); }).join('; '), 'Check: ' + t(v.hrs.map(function (h) { return MM(h * u); }).join('+') + '=' + MM(v.left)) + ' ✓']),
          ['Take the dishwashers’ part off first.', 'Share the rest by hours: (what is left ÷ total hours) × each server’s hours.'], 'brunch pool');
      } }] },
      { num: '8', stem: '', parts: [{ id: 'e8', level: 'PRG', make: function (r) {
        var v = find(function () { return { w: r.pick([17.25, 16.75, 18.5, 17.8, 16.4]), pi: r.pick([2, 1.75, 2.25, 1.5]), s: r.pick([19, 20, 18, 21]), k: r.pick([4, 5, 3]) }; }, function () { return true; }, { w: 17.25, pi: 2, s: 19, k: 4 });
        var pr = v.s + 8 - 23, H = v.k * 8, PH = v.k * pr;
        return premGrossPart('A security guard earns ' + t(rateT(v.w)) + '. He gets a night premium of ' + t(rateT(v.pi)) + ' for hours between 11:00 p.m. and 7:00 a.m. He works ' + clock(v.s) + ' to ' + clock(v.s + 8) + ', ' + ['', '', '', 'three', 'four', 'five'][v.k] + ' nights a week (paid breaks). Find his gross pay for the week.', H, v.w, PH, v.pi,
          { when: ' between 11:00 p.m. and 7:00 a.m.', pre: ['Each shift: ' + clock(v.s) + ' to ' + clock(v.s + 8) + ' is ' + hT(8) + '; 11:00 p.m. to ' + clock(v.s + 8) + ' is ' + hT(pr) + ' of premium.', 'regular hours ' + t('=' + v.k + '\\times 8=' + H) + '; premium hours ' + t('=' + v.k + '\\times ' + pr + '=' + PH)],
            more: [[H * v.w + pr * v.pi, 'u2f-prem-hours', 'He gets the premium every night: ' + t(v.k + '\\times ' + pr) + ' premium hours.'], [H * v.w + v.k * 8 * v.pi, 'u2f-prem-all', 'Only the hours after 11:00 p.m. get the premium (' + hT(pr) + ' a night).'], [8 * v.w + pr * v.pi, 'u2e-no-hours', 'That’s one night. He works ' + v.k + ' nights.']],
            hints: ['For one shift, count the hours after 11:00 p.m. Then multiply by the number of nights.', 'Regular pay = all hours × wage. Premium = premium hours × ' + t(MM(v.pi)) + '.'], text: 'guard' });
      } }] },
      { num: '9', stem: '', parts: [{ id: 'e9', level: 'PRG', make: function (r) {
        var v = find(function () { return { L: r.pick([350, 300, 400, 250, 500]), p: r.pick([1.5, 1, 2, 1.25]), S: r.int(180, 320) * 120 }; }, function (v) { var b = pctOf(v.p, v.S); return Math.abs(b - v.L) >= 10 && Math.abs(b - v.L) <= 200 && !(v.L === 750); }, { L: 350, p: 1.5, S: 24960 });
        var b = pctOf(v.p, v.S), pctWin = b > v.L, d = Math.abs(b - v.L);
        return whichBy('A hotel front-desk clerk can choose a holiday bonus of ' + t(MW(v.L)) + ', or ' + t(pctT(v.p)) + ' of her pay for the year. She earned ' + t(MW(v.S)) + ' this year. Which bonus is better, and by how much?',
          { name: 'the ' + pctT(v.p) + ' bonus', key: dS(v.p) + '%', re: /%|percent/ }, { name: 'the ' + MW(v.L) + ' bonus', key: String(v.L), re: new RegExp('lump|flat|^\\$?\\s?' + v.L + '(\\.00)?$') }, pctWin ? 'A' : 'B', d,
          [[b, 'u2f-total', 'That’s the ' + t(pctT(v.p)) + ' bonus. Find the difference.'], [pctOf(v.p * 10, v.S) - v.L, 'pct-one-place', t(pctT(v.p) + '=' + decT(v.p)) + '.']],
          sol([t(MW(v.S) + '\\times ' + decT(v.p) + eqMM(b)), t((pctWin ? MM(b) + '-' + MM(v.L) : MM(v.L) + '-' + MM(b)) + '=' + MM(d)), 'The ' + (pctWin ? t(pctT(v.p)) : t(MW(v.L))) + ' bonus is better, by ' + t(MM(d)) + '.']), ['Find the percent bonus in dollars.', 'Compare and subtract.'], 'holiday bonus', v.p + '% or ' + v.L);
      } }] },
      { num: '10', stem: '', parts: [{ id: 'e10', level: 'PRG', make: function (r) {
        var v = find(function () { return { p: r.pick([18, 15, 20, 12]), C: r.int(60, 160) * 10 + r.pick([0, 50]) }; }, function (v) { return near(pctOf(v.p, v.C), r2(pctOf(v.p, v.C))); }, { p: 18, C: 1150 }), tip = pctOf(v.p, v.C), list = U.backList(tip, v.p, { whole: 'total he charged' });
        var p = mp('A ' + r.pick(['barber', 'hairstylist', 'tattoo artist']) + '’s tips last week were ' + t(MM(tip)) + '. The tips are ' + t(pctT(v.p)) + ' of what he charges, on average. How much did he charge his customers in total?', v.C, dl(list),
          sol([t(MM(tip) + '\\div ' + decT(v.p) + '=' + MM(v.C)), 'Check: ' + t(MM(v.C) + '\\times ' + decT(v.p) + '=' + MM(tip)) + ' ✓']), ['Total charged = tips ÷ tip rate (as a decimal).'], 'barber backwards');
        p.bad = badOf(list, v.C); return p;
      } }] },
      { num: '11', stem: '', parts: [{ id: 'e11', level: 'BEG', make: function (r) {
        var w = r.pick([38, 36, 42, 40, 35]), p = r.pick([20, 15, 25, 10]), R = w * (1 + p / 100);
        return P.mc(r, 'A drilling rig worker earns ' + t(rateT(w)) + ', plus isolation pay of ' + t(pctT(p)) + ' more per hour. His hourly rate with isolation pay is', [
          { html: t(MM(pctOf(p, w))), why: 'That’s only the extra. Add it to the wage (or multiply by ' + t(mulT(p)) + ').', code: 'extra' }, { html: t(MM(w + p / 100)), why: 'That adds ' + t(p) + ' cents. ' + t(pctT(p)) + ' of ' + t(MM(w)) + ' is ' + t(MM(pctOf(p, w))) + '.', code: 'cents' },
          { html: t(MM(R)), right: true }, { html: t(MM(w + p)), why: 'That adds ' + t(p) + ' dollars. Multiply by ' + t(mulT(p)) + ' instead.', code: 'dollars' }],
          t(MM(w) + '\\times ' + mulT(p) + '=' + MM(R)) + '.', ['A percent more: multiply by ' + t(mulT(p)) + '.'], 'MC isolation', true);
      } }] },
      { num: '12', stem: '', parts: [{ id: 'e12', level: 'EMG', make: function (r) {
        var v = find(function () { return { w: r.pick([15, 15.5, 16, 15.25]), h: r.pick([6, 5, 7, 8]), p: r.pick([15, 18, 12, 16]), B: r.int(60, 110) * 10 }; }, function (v) { return !(v.w === 15.5 && v.h === 6) && !(v.p === 16 && v.B === 1240); }, { w: 15, h: 6, p: 15, B: 860 });
        var wp = v.h * v.w, tips = pctOf(v.p, v.B), g = wp + tips, want = Math.round(g), list = wageTipsList(v.h, v.w, tips, { more: [[wp + v.B, 'u2e-added-sales', 'Add the tips, not the bills.']] }).filter(function (x) { return Math.abs(x[0] - g) >= 0.5; });
        var dg = function (x) { for (var i = 0; i < list.length; i++) if (Math.abs(x - list[i][0]) < 0.5 + 1e-9) return { code: list[i][1], hint: list[i][2] }; return null; };
        var p = PK.part('<b>Numerical response.</b> A server earns ' + t(rateT(v.w)) + ' for a ' + v.h + '-hour shift. Her tips are ' + t(pctT(v.p)) + ' of her ' + t(MM(v.B)) + ' in bills. Her gross pay for the shift, to the nearest dollar, is ' + t('\\$') + '________.', PK.num(g, 0, dg, { nr: true }), String(want), String(want),
          sol([t(v.h + '\\times ' + MM(v.w) + '=' + MM(wp)) + '; ' + t(MM(v.B) + '\\times ' + decT(v.p) + eqMM(tips)) + '; ' + t(MM(wp) + '+' + MM(tips) + '=' + MM(g)) + (near(g, want) ? '' : ' ≈ ' + t('\\$' + want))]), ['Wage pay + tips.'], 'NR server', { nr: true });
        p.bad = list.map(function (x) { return String(Math.round(x[0])); }).filter(function (s, i, a) { return Number(s) !== want && a.indexOf(s) === i && s.length <= 4; });
        return p;
      } }] },
      { num: '13', section: 'C. Stretch', stem: '', parts: [{ id: 'e13', level: 'ADV', make: function (r) {
        var v = find(function () { return { w: r.pick([28.4, 27.6, 29.2, 26.8, 30.1]), H: r.pick([46, 47, 45, 48]), pi: r.pick([1.8, 1.5, 2, 1.65]), n: r.pick([15, 12, 10, 14]), name: r.pick(['Kendra', 'Amira', 'Talia', 'Brooke']), city: r.pick(['Calgary', 'Edmonton']) }; }, function () { return true; }, { w: 28.4, H: 46, pi: 1.8, n: 15, name: 'Kendra', city: 'Calgary' });
        var ot = v.H - 44, A1 = 44 * v.w, otR = 1.5 * v.w, A2 = ot * otR, A3 = v.n * v.pi, G = A1 + A2 + A3;
        var list = [[v.H * v.w + A3, 'u2f-ot-none', 'She worked over 44 h, so ' + t(v.H + '-44=' + ot) + ' h are overtime at ' + t('1.5\\times') + ' the wage.'], [A1 + ot * v.w * 2 + A3, 'u2f-ot-double', 'Overtime is ' + t('1.5') + ' times the wage, not double.'], [A1 + A2, 'u2f-no-prem', 'Add the split-shift premium: ' + t(v.n + '\\times ' + MM(v.pi)) + '.'], [A1 + A2 + v.H * v.pi, 'u2f-prem-all', 'Only ' + v.n + ' hours were split-shift hours.'], [v.H * v.w + A2 + A3, 'u2f-reg-all', 'Regular hours are only 44. The other ' + ot + ' are overtime.']];
        var p = mp(v.name + ' drives a city bus in ' + v.city + '. She earns ' + t(rateT(v.w)) + '. This week she worked ' + hT(v.H) + ', never more than 8 hours in a day. She gets a split-shift premium of ' + t(rateT(v.pi)) + ', and ' + v.n + ' of her hours were split-shift hours. Find her gross pay.', G, dl(list),
          sol(['overtime ' + t('=' + v.H + '-44=' + ot) + ' h (weekly rule); regular ' + t('=44') + ' h', 'regular pay ' + t('=44\\times ' + MM(v.w) + '=' + MM(A1)) + '; overtime pay ' + t('=' + ot + '\\times 1.5\\times ' + MM(v.w) + '=' + ot + '\\times ' + MM(otR) + '=' + MM(A2)), 'premium ' + t('=' + v.n + '\\times ' + MM(v.pi) + '=' + MM(A3)), 'gross ' + t('=' + MM(A1) + '+' + MM(A2) + '+' + MM(A3) + '=' + MM(G))]),
          ['No day is over 8 h, so use the weekly rule: hours over 44 are overtime.', 'Regular pay + overtime pay (1.5 × wage) + premium pay.'], 'bus driver');
        p.bad = badOf(list, G); return p;
      } }] },
      { num: '14', stem: '', parts: [{ id: 'e14', level: 'MAS', make: function (r) {
        var v = find(function () { return { w: r.pick([15, 15.5, 16, 15.25]), h: r.pick([30, 25, 28, 32, 24]), p: r.pick([15, 12, 18, 20]), B: r.int(20, 45) * 100, name: r.pick(['Jordan', 'Cole', 'Jesse', 'Wyatt']) }; }, function (v) { var G = v.h * v.w + pctOf(v.p, v.B); return G % 10 === 0; }, { w: 15, h: 30, p: 15, B: 3000, name: 'Jordan' });
        var wp = v.h * v.w, G = wp + pctOf(v.p, v.B), need = G - wp;
        var list = [[G / (v.p / 100), 'u2f-back-wage', 'Take off his wage pay first: the tips only need to make up ' + t(MM(G) + '-' + MM(wp)) + '.'], [need, 'u2f-tips-only', 'That’s the tips he needs. His tips are ' + t(pctT(v.p)) + ' of his bills, so bills ' + t('=' + MM(need) + '\\div ' + decT(v.p)) + '.']].concat(U.backList(need, v.p, { whole: 'bills' }));
        var p = mp(v.name + ' is a server. He earns ' + t(rateT(v.w)) + ' and works ' + v.h + ' hours a week. He wants his gross pay to be ' + t(MW(G)) + ' this week. His tips are ' + t(pctT(v.p)) + ' of his bills. What must his bills total?', v.B, dl(list),
          sol(['wage pay ' + t('=' + v.h + '\\times ' + MM(v.w) + '=' + MM(wp)), 'tips needed ' + t('=' + MM(G) + '-' + MM(wp) + '=' + MM(need)), 'bills ' + t('=' + MM(need) + '\\div ' + decT(v.p) + '=' + MM(v.B)) + '. His bills must total ' + t(MM(v.B)) + '.']), ['Find his wage pay. How much must the tips add?', 'Bills = tips needed ÷ tip rate (as a decimal).'], 'bills needed');
        p.bad = badOf(list, v.B); return p;
      } }] },
      { num: '15', stem: function (sh) { return sh.name + ' sells farm equipment in rural Alberta and drives her own truck. She is paid ' + t(MM(sh.k)) + ' for each kilometre she drives, plus ' + t(pctT(sh.p)) + ' commission on her sales. Last month she drove ' + t(sh.km + '\\text{ km}') + ' and sold ' + t(MW(sh.S)) + ' of equipment.'; },
        shared: function (r) { return { name: r.pick(['Simone', 'Amira', 'Talia', 'Brooke']), k: r.pick([0.55, 0.5, 0.6, 0.48, 0.62]), km: r.int(120, 240) * 10, p: r.pick([6, 5, 4, 7]), S: r.int(40, 90) * 500 }; },
        parts: [
          { id: 'e15a', level: 'PRG', make: function (r, sh) {
            var dr = sh.km * sh.k, c = pctOf(sh.p, sh.S), g = dr + c, list = [[dr, 'u2e-no-comm', 'Add her commission too.'], [c, 'u2e-comm-only', 'Add the driving money: ' + t(sh.km + '\\times ' + MM(sh.k)) + '.'], [sh.km + c, 'u2f-km', 'Multiply the kilometres by ' + t(MM(sh.k)) + ' first.'], [sh.km / sh.k + c, 'u2f-km', 'Multiply the kilometres by ' + t(MM(sh.k)) + ', don’t divide.'], [dr + sh.p * sh.S, 'pct-no-div', t(pctT(sh.p) + '=' + decT(sh.p)) + '.']];
            var p = mp('Find her pay for the month.', g, dl(list), sol(['driving ' + t('=' + sh.km + '\\times ' + MM(sh.k) + eqMM(dr)), 'commission ' + t('=' + MW(sh.S) + '\\times ' + decT(sh.p) + eqMM(c)), 'total ' + t('=' + MM(dr) + '+' + MM(c) + '=' + MM(g))]), ['Driving money = km × ' + t(MM(sh.k)) + '. Commission = sales × ' + t(decT(sh.p)) + '.', 'Add them.'], 'km + commission');
            p.bad = badOf(list, g); return p;
          } },
          { id: 'e15b', level: 'BEG', make: function (r) {
            return P.mc(r, 'Why is the money per kilometre not all extra money for her?', [
              { html: 'She pays for the fuel, repairs and wear on her own truck. The money per km mostly covers those costs.', right: true },
              { html: 'The company takes it back at the end of the year.', why: 'It is hers to keep, but she has to spend it on her truck’s costs.', code: 'back' },
              { html: 'Money per kilometre is taxed at ' + t('100\\%') + '.', why: 'It isn’t taxed away. Think about what driving her own truck costs her.', code: 'tax' },
              { html: 'She only gets it if she makes a sale.', why: 'She is paid for every kilometre. Think about what driving her own truck costs her.', code: 'sale' }],
              'She pays for the fuel, repairs and wear on her own truck. The money per km mostly covers those costs.', ['What does it cost her to drive her own truck?'], 'km money');
          } }] },
      { num: '16', stem: function (sh) { return '<b>Job A</b> at a diner pays ' + t(rateT(sh.a)) + ', and the tips average ' + t(MM(sh.ta)) + ' per hour. <b>Job B</b> at an office pays ' + t(rateT(sh.b)) + ' with no tips. Both jobs are ' + sh.H + ' hours a week.'; },
        shared: function (r) { return find(function () { return { a: r.pick([16, 15.5, 15, 16.5]), ta: r.pick([9.5, 8, 7.25, 10, 8.75]), b: r.pick([22.5, 21, 23.75, 20.5, 22]), H: r.pick([30, 25, 35, 20]) }; }, function (v) { return v.a + v.ta - v.b >= 0.5; }, { a: 16, ta: 9.5, b: 22.5, H: 30 }); },
        parts: [
          { id: 'e16a', level: 'PRG', make: function (r, sh) {
            var A = sh.H * (sh.a + sh.ta), B = sh.H * sh.b, d = A - B;
            var p = PK.fields('Which job pays more in a typical week, and by how much?', [{ label: 'Job (A or B)', mode: 'text', placeholder: 'A or B', name: 'Which job' }, { label: 'More by', before: '$', name: 'How much more' }],
              [choiceChk(U.letterOpts('A', 'B', 'Add the tips to Job A’s wage: ' + t(MM(sh.a) + '+' + MM(sh.ta)) + ' per hour.'), 'Type <b>A</b> or <b>B</b>.'), PK.money(d, dl([[sh.a + sh.ta - sh.b, 'u2f-rate-diff', 'That’s the difference for 1 hour. Find it for all ' + sh.H + ' hours.'], [B - sh.H * sh.a, 'u2f-no-tips', 'Include Job A’s tips.'], [A, 'u2f-total', 'That’s Job A’s pay. Subtract Job B’s pay.']]))],
              ['A', m$(d)], 'Job A, by ' + t(MM(d)), sol(['A: ' + t(sh.H + '\\times (' + MM(sh.a) + '+' + MM(sh.ta) + ')=' + sh.H + '\\times ' + MM(sh.a + sh.ta) + '=' + MM(A)), 'B: ' + t(sh.H + '\\times ' + MM(sh.b) + '=' + MM(B)), 'Job A pays ' + t(MM(d)) + ' more in a typical week.']),
              ['For Job A, add the wage and the tips per hour.', 'Multiply each by the hours, then subtract.'], 'diner vs office');
            p.bad = [['B', m$(d)], ['A', m$(sh.a + sh.ta - sh.b)]]; return p;
          } },
          { id: 'e16b', level: 'BEG', make: function (r) {
            return P.mc(r, 'Which is a good reason someone might still choose Job B?', [
              { html: 'Job B’s pay is the same every week; tips at Job A can drop in slow weeks, so B is easier to budget.', right: true },
              { html: 'Job B pays more every week.', why: 'In a typical week Job A pays more (with tips).', code: 'more' },
              { html: 'Tips are not part of gross pay.', why: 'Tips <b>are</b> part of gross pay.', code: 'gross' },
              { html: 'Job A has no tips on weekends.', why: 'Nothing says that, and weekends are often the busiest for tips.', code: 'weekend' }],
              'Sample: Job B’s pay is the same every week; tips at Job A can drop in slow weeks, so B is easier to budget.', ['Think about how steady each job’s pay is.'], 'why B');
          } }] }
    ]
  });
})(window);
