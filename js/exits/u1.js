/* Math 10-3 · Unit 1 (Unit Pricing and Currency Exchange) — exit slips for Lessons 1–10 (u1l1x … u1l10x), written in
 * test mode. Calculator allowed (as in every Math 10-3 lesson). Each slip is 4 short questions on the lesson's core skill —
 * usually Beginning, Progressing, Progressing, Mastery — about 5–8 minutes, with new numbers for every student.
 * Lessons 1, 2 and 7 are refreshers (outcome REV: their slips are written like the others but never count toward a
 * level); Lessons 3–6 and 8–10 are N1.
 *   1.1 round to the cent (a 9 that carries, the double-rounding trap) · estimate a bill · change from a bill ·
 *       split a bill so it is covered (round up)
 *   1.2 simplest form · a missing numerator · a fraction of an amount · a fraction of what is left
 *   1.3 a ratio from a group (part-to-part or part-to-whole) · a ratio with decimal terms · scaling a mix ·
 *       a 3-term share worked backwards to the total
 *   1.4 solve a proportion · a map scale · a medicine dose · bags of seed (area, proportion, round up)
 *   1.5 a unit rate · L/100 km · a rate used to predict, with a unit change · two vehicles' gas for one trip
 *   1.6 a unit price · two sizes: unit prices, then the best buy with a non-price reason · the cheapest way to buy
 *       with a multi-buy deal
 *   1.7 percent to decimal · percent of an amount · what percent · a survey with a percent and a fraction
 *   1.8 retail from markup · markup percent · total with PST + GST or HST · backwards from a total with GST to the cost
 *   1.9 sale price · percent decrease · sale price then tax · two promotions for a number of items
 *   1.10 a foreign price to CAD · a bank board: CAD into foreign cash (selling rate), selling it back (buying rate) ·
 *       the bank or the airport kiosk (rate + fee)
 * Multiple choice is used only for the best-buy reason (Progressing). Shared helpers and the u1t- codes come from the
 * Unit 1 test (HW.u1assess, js/lessons/u1test.js, which loads first); several N1 slips use the test's own generators
 * (retail, markup %, tax, sale, percent decrease, sale + tax, L/100 km) with new numbers. Codes only the slips use are
 * u1x-, with labels and partial-credit decisions below. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var A = HW.u1assess;
  if (!A) throw new Error('js/exits/u1.js needs HW.u1assess from js/lessons/u1test.js: load it first');
  var rd = A.rd, r2 = A.r2, q = A.q, near = A.near, nS = A.nS, N = A.N, c2 = A.c2, Mt = A.Mt, MM = A.MM, raw5 = A.raw5, toM = A.toM, toN = A.toN, find = A.find, br = A.br, uT = A.uT, cap = A.cap, pickR = A.pickR;
  var dec = A.dec, mult = A.mult, pay = A.pay, sz = A.sz, person = A.person, people = A.people, amtPart = A.amtPart, amtChk = A.amtChk, upChk = A.upChk, upField = A.upField, fieldsPart = A.fieldsPart, whichAmtPart = A.whichAmtPart, reasonMC = A.reasonMC, table = A.table, RX = A.RX;

  HW.addCodes({
    'u1x-double-round': 'Rounded in two steps (to 3 places, then to the cent)', 'u1x-not-est': 'Gave the exact total instead of an estimate', 'u1x-gave-total': 'Gave the total instead of the change',
    'u1x-one-each': 'Counted one of each item', 'u1x-split-short': 'Rounded down: the bill is not covered', 'u1x-split-times': 'Multiplied the bill instead of dividing',
    'u1x-add-same': 'Equivalent fraction: added instead of multiplying', 'u1x-div-only': 'Fraction of an amount: divided only', 'u1x-frac-flip': 'Fraction of an amount: used the fraction upside down',
    'u1x-of-total': 'Took the second fraction of the whole amount, not of what was left', 'u1x-gave-spent': 'Gave the amount spent instead of what is left',
    'u1x-add-ratio': 'Ratio: added instead of scaling', 'u1x-flip-ratio': 'Ratio: scaled the wrong term', 'u1x-share-times': 'Multiplied the share by the total parts without dividing by its term',
    'u1x-share-nparts': 'Multiplied the share by the number of people', 'u1x-share-largest': 'Gave the largest share instead of the total',
    'u1x-prop-row': 'Proportion: multiplied the wrong pair', 'u1x-prop-add': 'Proportion: added instead of scaling', 'u1x-scale-div': 'Map scale: divided instead of multiplying',
    'u1x-dose-flip': 'Dose: proportion the wrong way round', 'u1x-seed-kg': 'Gave the kilograms of seed instead of the bags', 'u1x-area-perim': 'Used the perimeter instead of the area',
    'u1x-rate-noconv': 'Did not change minutes to seconds (or hours to minutes)', 'u1x-one-veh': 'Gave one vehicle’s cost instead of the difference', 'u1x-diff-litres': 'Gave the difference in litres instead of dollars',
    'u1x-all-single': 'Bought every item at the single price', 'u1x-not-cheapest': 'Did not find the cheapest combination', 'u1x-pack-rate': 'Paid the deal price for part of a pack',
    'u1x-pct-whole': 'Percent used as a whole number (forgot ÷ 100)', 'u1x-pct-10': 'Percent moved one place only (÷ 10)', 'u1x-pct-total': 'Gave the amount plus the percent',
    'u1x-pct-flip': 'What percent: divided the wrong way', 'u1x-survey-pct': 'Gave the percent instead of the number of students', 'u1x-survey-other': 'Gave another group’s number',
    'u1x-mk-sub': 'Undid the markup by subtracting the percent', 'u1x-free-wrong': 'Buy 2, get 1 free worked as a third off every item', 'u1x-kiosk-nofee': 'Left out the kiosk fee',
    'u1x-kiosk-total': 'Gave a total instead of the difference', 'u1x-gave-loss': 'Gave the loss on the exchange instead of the amount received'
  });
  HW.addPartial({
    'u1x-double-round': 's', 'u1x-not-est': 'n', 'u1x-gave-total': 'b', 'u1x-one-each': 'b', 'u1x-split-short': 'b', 'u1x-split-times': 'n', 'u1x-add-same': 'n', 'u1x-div-only': 'b', 'u1x-frac-flip': 'n',
    'u1x-of-total': 'b', 'u1x-gave-spent': 'b', 'u1x-add-ratio': 'n', 'u1x-flip-ratio': 'n', 'u1x-share-times': 'b', 'u1x-share-nparts': 'n', 'u1x-share-largest': 'b', 'u1x-prop-row': 'n', 'u1x-prop-add': 'n',
    'u1x-scale-div': 'n', 'u1x-dose-flip': 'n', 'u1x-seed-kg': 'b', 'u1x-area-perim': 'n', 'u1x-rate-noconv': 'b', 'u1x-one-veh': 'b', 'u1x-diff-litres': 'b', 'u1x-all-single': 'b', 'u1x-not-cheapest': 'b',
    'u1x-pack-rate': 'b', 'u1x-pct-whole': 'n', 'u1x-pct-10': 'b', 'u1x-pct-total': 's', 'u1x-pct-flip': 'n', 'u1x-survey-pct': 'b', 'u1x-survey-other': 'n', 'u1x-mk-sub': 'b', 'u1x-free-wrong': 'b',
    'u1x-kiosk-nofee': 'b', 'u1x-kiosk-total': 'b', 'u1x-gave-loss': 'b'
  });
  function Q(num, outcome, level, make, text) { return { num: String(num), outcome: outcome, text: text, parts: [{ id: String(num), outcome: outcome, level: level, make: make }] }; }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var x = a % b; a = b; b = x; } return a; }

  /* =====================================================================================================
   * 1.1 Money sense (REV)
   * ===================================================================================================== */
  function l1q1(r) {
    var kind = r.pick(['plain', 'carry', 'double', 'plain', 'double']);
    var x = find(function () {
      var W = r.int(2, 89), c = kind === 'carry' ? 99 * 100 + r.int(50, 99) : kind === 'double' ? r.int(1, 98) * 100 + 40 + r.int(5, 9) : r.int(100, 9899);
      return q(W + c / 10000);
    }, function (x) { var f = Math.round(x * 10000) % 100; return kind !== 'plain' || (f !== 50 && f % 10 !== 0); });
    var ans = rd(x, 2), ctx = r.pick(['Splitting a pizza bill, a calculator shows', 'A calculator shows the cost of 3.6 m of rope as', 'Working out a share of a gas bill, a calculator shows', 'A calculator shows the price of 1.85 kg of grapes as']);
    var dbl = rd(rd(x, 3), 2), diag = !near(dbl, ans) ? [{ v: dbl, code: 'u1x-double-round', hint: 'Round in one step: look only at the <b>third</b> decimal digit (the one after the cents).' }] : [];
    return amtPart(ctx + ' ' + t(N(x)) + '. What is that amount rounded to the nearest cent?', x, { diag: diag,
      sol: br(['Look at the third decimal digit: ' + t(N(x)) + ' → the digit after the cents is ' + t(String(Math.floor(x * 1000 + 1e-7) % 10)) + '.', (Math.floor(x * 1000 + 1e-7) % 10 >= 5 ? '5 or more: round the cents up' : '4 or less: keep the cents') + ': ' + MM(ans) + '.']),
      hints: ['Money is rounded to 2 decimal places (the cent).', 'Look at the third decimal digit only: 5 or more rounds up.'], text: 'round to the cent' });
  }
  var BILLS = [['a box of cereal', 3.49, 6.99], ['a jug of milk', 4.29, 6.49], ['a bag of apples', 4.49, 7.99], ['a loaf of bread', 2.79, 4.29], ['a block of cheese', 6.49, 10.99], ['a pack of chicken', 9.49, 15.99], ['a bag of carrots', 1.89, 3.49], ['a dozen eggs', 3.99, 5.49]];
  function l1q2(r) {
    var its = r.sample(BILLS, 3).map(function (b, i) { return { n: b[0], k: i === 0 ? r.int(2, 4) : 1, p: q(r.int(Math.round(b[1] * 100), Math.round(b[2] * 100)) / 100) }; });
    its.forEach(function (x) { x.p = q(Math.floor(x.p) + r.pick([0.29, 0.49, 0.79, 0.89, 0.99, 0.19])); });
    var exact = its.reduce(function (s, x) { return s + x.k * x.p; }, 0), est = its.reduce(function (s, x) { return s + x.k * Math.round(x.p); }, 0);
    var noK = est - its[0].k * Math.round(its[0].p) + Math.round(its[0].p), up5 = its.reduce(function (s0, x) { return s0 + x.k * Math.ceil(x.p / 5) * 5; }, 0), dbl = est + its[0].k * Math.round(its[0].p);
    var opts = [{ v: est, right: true }, { v: noK, why: 'You buy ' + its[0].k + ' of the ' + its[0].n + ': multiply its rounded price by ' + its[0].k + '.' },
      { v: up5 === est || up5 === noK ? est + 12 : up5, why: 'Round each price to the <b>nearest dollar</b>, not up to the next 5 dollars.' }, { v: dbl === noK || dbl === est ? est + 7 : dbl, why: 'Count the ' + its[0].n + ' only ' + its[0].k + ' times.' }];
    var seen = {}; opts = opts.filter(function (o) { if (seen[o.v]) return false; seen[o.v] = 1; return true; });
    for (var e0 = 1; opts.length < 4; e0++) { var ev = est + (e0 % 2 ? 1 : -1) * (5 + 2 * e0); if (ev > 0 && !seen[ev]) { seen[ev] = 1; opts.push({ v: ev, why: 'Round each price to the nearest dollar, multiply, and add.' }); } }
    return A.numMC(r, 'Which is the best estimate of this grocery bill, worked <b>in your head</b> by rounding each price to the nearest dollar?<br>' + its.map(function (x) { return (x.k > 1 ? x.k + ' × ' : '') + x.n + ' at ' + MM(x.p); }).join('<br>'), opts, function (v) { return 'about ' + t('\\$' + v); },
      br(its.map(function (x) { return (x.k > 1 ? x.k + ' × ' : '') + t(Mt(x.p) + '\\approx\\$' + Math.round(x.p)) + (x.k > 1 ? ': ' + t(x.k + '\\times ' + Math.round(x.p) + '=' + x.k * Math.round(x.p)) : ''); }).concat(['Estimate: about ' + t('\\$' + est) + '. (Exact: ' + MM(exact) + '.)'])),
      ['Round each price to the nearest dollar first.', 'Multiply for the item you buy more than one of, then add.'], 'estimate a bill');
  }
  function l1q3(r) {
    var its = r.sample(BILLS, 2), k1 = r.int(2, 4), k2 = r.int(2, 3), p1 = q(Math.floor(its[0][1]) + r.pick([0.29, 0.49, 0.79, 0.99])), p2 = q(Math.floor(its[1][1]) + r.pick([0.19, 0.39, 0.69, 0.89]));
    var tot = k1 * p1 + k2 * p2, bill = tot < 20 ? 20 : tot < 50 ? 50 : 100, ch = bill - tot;
    return amtPart('You buy ' + k1 + ' × ' + its[0][0] + ' at ' + MM(p1) + ' each and ' + k2 + ' × ' + its[1][0] + ' at ' + MM(p2) + ' each. You pay with a ' + t('\\$' + bill) + ' bill. How much change should you get?', ch, {
      diag: [{ v: tot, code: 'u1x-gave-total', hint: 'That’s the total. Subtract it from the ' + t('\\$' + bill) + '.' }, { v: bill - p1 - p2, code: 'u1x-one-each', hint: 'You buy ' + k1 + ' and ' + k2 + ' of them: multiply each price by how many first.' }, { v: bill - (k1 * p1 + p2), code: 'u1x-one-each', hint: 'Multiply the second price by ' + k2 + ' too.' }],
      sol: br(['Total: ' + t(k1 + '\\times ' + Mt(p1) + '+' + k2 + '\\times ' + Mt(p2) + '=' + Mt(tot)) + ' (the calculator does × before +)', 'Change: ' + t('\\$' + bill + '.00-' + Mt(tot) + '=' + Mt(ch))]),
      hints: ['Find the total first: quantity × price for each item, then add.', 'Change = what you pay with − the total.'], text: 'change from a bill' });
  }
  function l1q4(r) {
    var n = r.pick([3, 4, 6, 3, 7]);
    var X = find(function () { return q(r.int(4000, 18000) / 100); }, function (X) { var c = Math.round(X * 100), m = c % n; return m !== 0 && m / n < 0.5; });
    var ex = X / n, up = Math.ceil(Math.round(X * 100) / n) / 100, ctx = r.pick(['friends split a restaurant bill of', 'roommates split an internet bill of', 'cousins split the cost of a birthday cake and decorations,', 'teammates split a gas bill for a tournament trip of']);
    return amtPart(t(n) + ' ' + ctx + ' ' + MM(X) + ' evenly. Each person pays the same amount, to the cent, and together they must pay <b>at least</b> the whole bill. How much should each person pay?', up, { exact: ex,
      diag: [{ v: Math.floor(ex * 100 + 1e-9) / 100, code: 'u1x-split-short', hint: 'Check: ' + t(n + '\\times ' + Mt(Math.floor(ex * 100 + 1e-9) / 100) + '=' + Mt(n * Math.floor(ex * 100 + 1e-9) / 100)) + ', which is less than the bill. Round <b>up</b> to the next cent.' }, { v: X * n, code: 'u1x-split-times', hint: 'Split means share: divide the bill by ' + t(n) + '.' }],
      sol: br([t(Mt(X) + '\\div ' + n + '=' + raw5(ex)), 'Rounding to ' + MM(r2(ex)) + ' would give ' + t(n + '\\times ' + Mt(r2(ex)) + '=' + Mt(n * r2(ex))) + ': not enough.', 'Round up: each pays ' + MM(up) + ' (' + t(n + '\\times ' + Mt(up) + '=' + Mt(n * up)) + ').']),
      hints: ['Divide the bill by the number of people.', 'Check: does the rounded share × ' + n + ' cover the bill? If not, round up.'], text: 'split a bill (round up)' });
  }
  HW.defineExit({ lesson: 'u1l1', outcome: 'REV', calc: true, blurb: 'Money sense: rounding to the cent, estimating a bill, making change, and splitting a bill so it is covered.',
    questions: [Q(1, 'REV', 'BEG', l1q1, 'Round to the cent'), Q(2, 'REV', 'PRG', l1q2, 'Estimate a bill'), Q(3, 'REV', 'PRG', l1q3, 'Change from a bill'), Q(4, 'REV', 'MAS', l1q4, 'Split a bill (round up)')] });

  /* =====================================================================================================
   * 1.2 Fractions (REV)
   * ===================================================================================================== */
  function l2q1(r) {
    var v = find(function () { var a = r.int(1, 9), b = r.int(2, 12), k = r.int(2, 9); return [a, b, k]; }, function (v) { return v[0] < v[1] && gcd(v[0], v[1]) === 1 && v[1] * v[2] <= 60 && v[2] * v[1] !== 24 * 1; });
    var a = v[0], b = v[1], k = v[2], A0 = a * k, B0 = b * k, ctx = r.pick([function () { return t(A0) + ' of the ' + t(B0) + ' students in a class take the bus. What fraction of the class takes the bus? Write it in simplest form.'; },
      function () { return 'A team won ' + t(A0) + ' of its ' + t(B0) + ' games. What fraction of its games did it win? Write it in simplest form.'; }, function () { return 'Write ' + t('\\dfrac{' + A0 + '}{' + B0 + '}') + ' in simplest form.'; }]);
    return P.fraction(ctx(), [a, b], { diag: function (val) { if (near(val, b / a)) return { code: 'flip', hint: 'The part goes on top: ' + t(A0) + ' out of ' + t(B0) + '.' }; return null; } },
      br([t('\\dfrac{' + A0 + '}{' + B0 + '}') + ': the greatest common factor of ' + t(A0) + ' and ' + t(B0) + ' is ' + t(k) + '.', 'Divide the top and bottom by ' + t(k) + ': ' + t('\\dfrac{' + A0 + '\\div ' + k + '}{' + B0 + '\\div ' + k + '}=\\dfrac{' + a + '}{' + b + '}')]),
      ['Find the greatest number that divides into both the top and the bottom.', 'Divide both by it.'], 'simplest form');
  }
  function l2q2(r) {
    var v = find(function () { var a = r.int(1, 8), b = r.int(3, 12), k = r.int(3, 9); return [a, b, k]; }, function (v) { return v[0] < v[1] && gcd(v[0], v[1]) === 1; });
    var a = v[0], b = v[1], k = v[2], n = b * k, x = a * k;
    return amtPart('Find the missing number: ' + t('\\dfrac{' + a + '}{' + b + '}=\\dfrac{x}{' + n + '}'), x, { dp: 0, plain: true, before: t('x='),
      diag: [{ v: a + (n - b), code: 'u1x-add-same', hint: 'Adding the same number to the top and bottom changes the fraction. What do you <b>multiply</b> ' + t(b) + ' by to get ' + t(n) + '?' }, { v: n / a, code: 'u1x-frac-flip', hint: 'The bottom went from ' + t(b) + ' to ' + t(n) + ': that is × ' + t(k) + '. Do the same to the top.' }],
      sol: br([t(b + '\\times ' + k + '=' + n) + ', so multiply the top by ' + t(k) + ' too.', t('x=' + a + '\\times ' + k + '=' + x)]), hints: ['What times ' + b + ' gives ' + n + '?', 'Multiply the top by the same number.'], text: 'missing numerator' });
  }
  function l2q3(r) {
    var f = r.pick([[3, 8], [2, 5], [3, 4], [5, 6], [2, 3], [7, 10], [5, 8], [3, 5]]), a = f[0], b = f[1], X = b * r.int(4, 30) * r.pick([1, 1, 2]), x = X * a / b, p = person(r);
    var ctx = r.pick([p.n + ' earned ' + MM(X) + ' at a part-time job and put ' + t('\\dfrac{' + a + '}{' + b + '}') + ' of it into savings. How much did ' + p.he + ' save?', 'A store’s sign says “' + t('\\dfrac{' + a + '}{' + b + '}') + ' off!” on a ' + MM(X) + ' jacket. How many dollars off is that?']);
    return amtPart(ctx, x, { diag: [{ v: X / b, code: 'u1x-div-only', hint: 'That’s ' + t('\\dfrac{1}{' + b + '}') + '. You need ' + t(a) + ' of those parts: multiply by ' + t(a) + '.' }, { v: X * b / a, code: 'u1x-frac-flip', hint: 'Multiply by the fraction ' + t('\\dfrac{' + a + '}{' + b + '}') + ': divide by ' + t(b) + ', then multiply by ' + t(a) + '.' }, { v: X / a, code: 'u1x-frac-flip', hint: 'Divide by the bottom (' + t(b) + '), then multiply by the top (' + t(a) + ').' }],
      sol: br([t('\\dfrac{' + a + '}{' + b + '}\\text{ of }' + Mt(X) + '=' + Mt(X) + '\\div ' + b + '\\times ' + a), t('=' + Mt(X / b) + '\\times ' + a + '=' + Mt(x))]), hints: ['“Of” means multiply.', 'Divide by the bottom, then multiply by the top.'], text: 'fraction of an amount' });
  }
  function l2q4(r) {
    var f1 = r.pick([[1, 4], [1, 5], [1, 3], [2, 5], [3, 10]]), f2 = r.pick([[2, 3], [1, 2], [3, 4], [1, 3], [3, 5]]), p = person(r);
    var L = f1[1] * f2[1] / gcd(f1[1], f2[1]) * f1[1], X = L * r.int(Math.ceil(60 / L), Math.ceil(400 / L)), s1 = X * f1[0] / f1[1], rest = X - s1, s2 = rest * f2[0] / f2[1], left = rest - s2;
    var frT = function (f) { return t('\\dfrac{' + f[0] + '}{' + f[1] + '}'); };
    return amtPart(p.n + ' gets ' + MM(X) + ' for ' + p.his + ' birthday. ' + cap(p.he) + ' saves ' + frT(f1) + ' of it. Then ' + p.he + ' spends ' + frT(f2) + ' of <b>what is left</b> on a concert ticket. How much money does ' + p.he + ' have left to spend?', left, {
      diag: [{ v: X - s1 - X * f2[0] / f2[1], code: 'u1x-of-total', hint: 'The ' + frT(f2) + ' is of what is <b>left</b> after saving (' + MM(rest) + '), not of the whole ' + MM(X) + '.' }, { v: s2, code: 'u1x-gave-spent', hint: 'That’s the cost of the ticket. Subtract it from what was left.' }, { v: rest, code: 'u1x-gave-spent', hint: 'That’s what was left after saving. Now take off the ticket.' }],
      sol: br(['Saved: ' + frT(f1) + ' of ' + t(Mt(X) + '=' + Mt(s1)) + '; left: ' + t(Mt(X) + '-' + Mt(s1) + '=' + Mt(rest)), 'Ticket: ' + frT(f2) + ' of ' + t(Mt(rest) + '=' + Mt(s2)), 'Left to spend: ' + t(Mt(rest) + '-' + Mt(s2) + '=' + Mt(left))]),
      hints: ['First find what is left after saving.', 'Then take the second fraction of <b>that</b> amount.'], text: 'fraction of what is left' });
  }
  HW.defineExit({ lesson: 'u1l2', outcome: 'REV', calc: true, blurb: 'Fractions: simplest form, equivalent fractions, a fraction of an amount, and a fraction of what is left.',
    questions: [Q(1, 'REV', 'BEG', l2q1, 'Simplest form'), Q(2, 'REV', 'PRG', l2q2, 'Missing numerator'), Q(3, 'REV', 'PRG', l2q3, 'Fraction of an amount'), Q(4, 'REV', 'MAS', l2q4, 'Fraction of what is left')] });

  /* =====================================================================================================
   * 1.3 Ratios (N1)
   * ===================================================================================================== */
  var GROUPS = [{ g: 'A hockey team', a: 'forwards', b: 'defence players', all: 'the whole team', A: [8, 14], B: [4, 9] }, { g: 'A class', a: 'girls', b: 'boys', all: 'the whole class', A: [8, 18], B: [8, 18] },
    { g: 'A parking lot', a: 'trucks', b: 'cars', all: 'all the vehicles', A: [6, 30], B: [10, 40] }, { g: 'A bag of marbles', a: 'blue marbles', b: 'red marbles', all: 'all the marbles', A: [6, 24], B: [6, 24] }];
  function l3q1(r) {
    var X = RX(), c = r.pick(GROUPS), v = find(function () { return [r.int(c.A[0], c.A[1]), r.int(c.B[0], c.B[1])]; }, function (v) { return v[0] !== v[1] && gcd(v[0], v[0] + v[1]) > 1 && gcd(v[0], v[1]) > 1; });
    var a = v[0], b = v[1], T = a + b, pw = r.chance(0.5), want = X.simp(pw ? [a, T] : [b, a]);
    var askT = pw ? c.a + ' to ' + c.all : c.b + ' to ' + c.a;
    var wrongs = pw ? [{ r: [a, b], code: 'u1l3-not-whole', hint: 'Compare with ' + c.all + ': ' + t(a + '+' + b + '=' + T) + '.' }] : [{ r: [b, T], code: 'u1l3-whole-wrong', hint: 'This ratio compares two parts: ' + c.b + ' to ' + c.a + '.' }];
    return X.ratioPart(c.g + ' has ' + t(a) + ' ' + c.a + ' and ' + t(b) + ' ' + c.b + '. Write the ratio of <b>' + askT + '</b> in simplest form.', want, { orig: pw ? [a, T] : [b, a], wrongs: wrongs,
      sol: br([pw ? cap(c.all.replace(/^the |^all the /, '')) + ': ' + t(a + '+' + b + '=' + T) + '. Ratio: ' + t(a + ':' + T) : 'Ratio: ' + t(b + ':' + a)].concat(X.simpLines(pw ? [a, T] : [b, a]))),
      hints: ['The first thing named goes first.', pw ? 'For the whole group, add both parts.' : 'Divide both terms by their greatest common factor.'], text: 'ratio from a group' });
  }
  function l3q2(r) {
    var X = RX(), c = r.pick([['A pancake recipe uses', 'cups of milk', 'cups of flour', 'milk to flour'], ['A garden bed uses', 'bags of compost', 'bags of soil', 'compost to soil'], ['A cleaner is made from', 'L of vinegar', 'L of water', 'vinegar to water'], ['A concrete mix uses', 'pails of cement', 'pails of sand', 'cement to sand']]);
    var v = find(function () { var p = r.int(1, 6), qq = r.int(1, 7), s = r.pick([0.5, 1.5, 2.5, 0.3, 0.6, 1.2, 0.4, 0.75, 1.25]); return [q(p * s), q(qq * s), p, qq]; },
      function (v) { return v[2] !== v[3] && gcd(v[2], v[3]) === 1 && (!X.isInt(v[0]) || !X.isInt(v[1])) && X.decPl(v[0]) <= 2 && X.decPl(v[1]) <= 2 && !(v[0] === 2.5 && v[1] === 4); });
    return X.ratioPart(c[0] + ' ' + t(N(v[0])) + ' ' + c[1] + ' and ' + t(N(v[1])) + ' ' + c[2] + '. Write the ratio of ' + c[3] + ' in simplest form, using whole numbers.', [v[2], v[3]], { orig: [v[0], v[1]],
      sol: br(X.simpLines([v[0], v[1]])), hints: ['Multiply both terms by 10 (or 100) to make them whole numbers.', 'Then divide both by their greatest common factor.'], text: 'ratio with decimal terms' });
  }
  function l3q3(r) {
    var c = r.pick([['A paint colour is mixed from blue and white paint in the ratio', 'blue', 'white', 'L'], ['A lemonade is made from concentrate and water in the ratio', 'concentrate', 'water', 'cups'], ['A potting mix uses peat and sand in the ratio', 'peat', 'sand', 'L']]);
    var v = find(function () { var a = r.int(1, 5), b = r.int(2, 9), W = pickR(r, [4, 30, 0.5]); return [a, b, W, a * W / b]; }, function (v) { return v[0] < v[1] && gcd(v[0], v[1]) === 1 && v[2] % v[1] !== 0 && near(v[3] * 100, Math.round(v[3] * 100), 1e-7) && !(v[0] === 3 && v[1] === 8); });
    var a = v[0], b = v[1], W = v[2], x = v[3];
    return amtPart(c[0] + ' ' + t(a + ':' + b) + '. How many ' + c[3] + ' of ' + c[1] + ' go with ' + t(N(W)) + ' ' + c[3] + ' of ' + c[2] + '?', x, { dp: 2, plain: true, after: c[3],
      diag: [{ v: a + (W - b), code: 'u1x-add-ratio', hint: 'Adding the same amount doesn’t keep the ratio. Scale: ' + t(N(W) + '\\div ' + b + '=' + N(W / b)) + ', so multiply ' + t(a) + ' by that.' }, { v: W * b / a, code: 'u1x-flip-ratio', hint: 'In ' + t(a + ':' + b) + ', the ' + c[1] + ' is the ' + t(a) + '. There is less ' + c[1] + ' than ' + c[2] + '.' }, { v: W / b, code: 'u1x-flip-ratio', hint: 'That’s one part. The ' + c[1] + ' is ' + t(a) + ' parts.' }],
      sol: br([t('\\dfrac{' + c[1] + '}{' + c[2] + '}:\\ \\dfrac{' + a + '}{' + b + '}=\\dfrac{x}{' + N(W) + '}'), 'Scale factor: ' + t(N(W) + '\\div ' + b + '=' + N(rd(W / b, 4))), t('x=' + a + '\\times ' + N(rd(W / b, 4)) + '=' + N(x)) + ' ' + c[3] + ' of ' + c[1]]),
      hints: ['How many times bigger than ' + b + ' is ' + N(W) + '?', 'Multiply the ' + c[1] + ' term by the same number.'], text: 'scale a mix' });
  }
  function l3q4(r) {
    var ns = people(r, 3), v = find(function () { var a = [r.int(1, 6), r.int(1, 6), r.int(1, 6)], pp = r.pick([15, 20, 24, 25, 30, 36, 40, 45, 50, 60, 75]); return { a: a, pp: pp }; }, function (v) { var a = v.a; return a[0] !== a[1] && a[1] !== a[2] && a[0] !== a[2]; });
    var a = v.a, pp = v.pp, s = a[0] + a[1] + a[2], mn = Math.min.apply(null, a), mx = Math.max.apply(null, a), who = ns[a.indexOf(mn)], X = mn * pp, T = s * pp;
    return amtPart(ns[0].n + ', ' + ns[1].n + ' and ' + ns[2].n + ' share the money from a summer business in the ratio ' + t(a.join(':')) + '. ' + who.n + ' gets the smallest share, ' + MM(X) + '. How much money did they make in all?', T, {
      diag: [{ v: X * s, code: 'u1x-share-times', hint: who.n + '’s ' + MM(X) + ' is ' + t(mn) + ' parts, not 1 part. One part is ' + t(Mt(X) + '\\div ' + mn + '=' + Mt(pp)) + '.' }, { v: X * 3, code: 'u1x-share-nparts', hint: 'The shares are not equal. Find one part first: ' + t(Mt(X) + '\\div ' + mn) + '.' }, { v: pp * mx, code: 'u1x-share-largest', hint: 'That’s the largest share. The total is all ' + t(s) + ' parts.' }],
      sol: br([who.n + ' has ' + t(mn) + ' parts: one part is ' + t(Mt(X) + '\\div ' + mn + '=' + Mt(pp)), 'Total parts: ' + t(a.join('+') + '=' + s), 'Total: ' + t(s + '\\times ' + Mt(pp) + '=' + Mt(T))]),
      hints: ['How many parts is the smallest share? Find the value of one part.', 'Multiply one part by the total number of parts.'], text: 'share backwards to the total' });
  }
  HW.defineExit({ lesson: 'u1l3', outcome: 'N1', calc: true, blurb: 'Ratios: from a group, with decimal terms, scaling a mix, and a share worked back to the total.',
    questions: [Q(1, 'N1', 'BEG', l3q1, 'Ratio from a group'), Q(2, 'N1', 'PRG', l3q2, 'Ratio with decimal terms'), Q(3, 'N1', 'PRG', l3q3, 'Scale a mix'), Q(4, 'N1', 'MAS', l3q4, 'Share backwards to the total')] });

  /* =====================================================================================================
   * 1.4 Proportions (N1)
   * ===================================================================================================== */
  function l4q1(r) {
    var v = find(function () { var p = r.int(2, 12), qq = r.int(2, 15), k = r.pick([1.5, 2, 2.5, 3, 4, 0.5, 1.25, 5]); return [p, qq, k]; }, function (v) { return v[0] !== v[1] && !(v[0] === 6 && v[1] === 15) && !(v[0] === 10 && v[1] === 15); });
    var p = v[0], qq = v[1], k = v[2], vals = [p, q(p * k), qq, q(qq * k)], pos = r.int(0, 3), row = pos < 2 ? 0 : 1, col = pos % 2;
    var sp = (1 - row) * 2 + col, cp = row * 2 + (1 - col), pt = (1 - row) * 2 + (1 - col), xv = vals[sp] * vals[cp] / vals[pt];
    var cell = function (i) { return i === pos ? 'x' : N(vals[i]); }, tex = '\\dfrac{' + cell(0) + '}{' + cell(2) + '}=\\dfrac{' + cell(1) + '}{' + cell(3) + '}';
    var prod = vals[sp] * vals[cp];
    return amtPart('Solve the proportion: ' + t(tex), xv, { dp: 2, plain: true, before: t('x='),
      diag: [{ v: vals[pt] * vals[sp] / vals[cp], code: 'u1x-prop-row', hint: 'Multiply along the <b>diagonals</b>, then divide by the number on x’s diagonal, ' + t(N(vals[pt])) + '.' }, { v: vals[pt] * vals[cp] / vals[sp], code: 'u1x-prop-row', hint: 'Multiply along the <b>diagonals</b>, then divide by the number on x’s diagonal, ' + t(N(vals[pt])) + '.' },
        { v: prod, code: 'u1x-prop-row', hint: 'You multiplied along the diagonal. Now divide by ' + t(N(vals[pt])) + ', the number on x’s diagonal.' }, { v: vals[sp] + vals[cp] - vals[pt], code: 'u1x-prop-add', hint: 'Only multiply or divide: adding the same amount does not make an equal ratio.' }],
      sol: br(['Cross-multiply: ' + t(N(vals[pt]) + 'x=' + N(vals[sp]) + '\\times ' + N(vals[cp]) + '=' + N(prod)), t('x=' + N(prod) + '\\div ' + N(vals[pt]) + '=' + N(xv))]),
      hints: ['Multiply along the diagonals to get an equation.', 'Divide by the number that is on the same diagonal as x.'], text: 'solve a proportion' });
  }
  function l4q2(r) {
    var sc = find(function () { var a0 = r.pick([2, 4, 5]), b0 = a0 === 2 ? r.pick([15, 25, 35, 45]) : a0 === 4 ? r.pick([25, 50, 75, 30]) : r.pick([40, 60, 80, 120]), d0 = pickR(r, [2.5, 18.5, 0.5]); return [a0, b0, d0, d0 / a0 * b0]; }, function (v) { return near(v[3] * 100, Math.round(v[3] * 100), 1e-7) && v[2] % v[0] !== 0; });
    var a = sc[0], b = sc[1], d = sc[2], x = sc[3];
    var pl = r.pick([['Calgary', 'Drumheller'], ['Red Deer', 'Edmonton'], ['Lethbridge', 'Medicine Hat'], ['Banff', 'Golden'], ['Airdrie', 'Olds']]);
    return amtPart('A road map has a scale of ' + t(a + '\\text{ cm}:' + b + '\\text{ km}') + '. On the map, ' + pl[0] + ' and ' + pl[1] + ' are ' + t(N(d)) + ' cm apart. About how far apart are they really, in kilometres?', x, { dp: 2, plain: true, after: 'km',
      diag: [{ v: d * b, code: 'u1x-scale-div', hint: 'The scale is ' + t(a + '\\text{ cm}') + ' for ' + t(b + '\\text{ km}') + ', not 1 cm. Set up ' + t('\\dfrac{' + a + '}{' + b + '}=\\dfrac{' + N(d) + '}{x}') + '.' }, { v: d / b * a, code: 'u1x-scale-div', hint: 'Map cm on top, real km on the bottom: ' + t('\\dfrac{' + a + '}{' + b + '}=\\dfrac{' + N(d) + '}{x}') + '.' }, { v: d * a / b, code: 'u1x-scale-div', hint: 'More cm on the map means <b>more</b> km. Cross-multiply ' + t('\\dfrac{' + a + '}{' + b + '}=\\dfrac{' + N(d) + '}{x}') + '.' }],
      sol: br([t('\\dfrac{\\text{map (cm)}}{\\text{real (km)}}:\\ \\dfrac{' + a + '}{' + b + '}=\\dfrac{' + N(d) + '}{x}'), t(a + 'x=' + b + '\\times ' + N(d) + '=' + N(b * d)), t('x=' + N(b * d) + '\\div ' + a + '=' + N(x)) + ' km']),
      hints: ['Write map cm over real km on both sides.', 'Cross-multiply and divide.'], text: 'map scale' });
  }
  function l4q3(r) {
    var an = r.pick([['dog', 'kg'], ['cat', 'kg'], ['calf', 'kg'], ['goat', 'kg']]);
    var v = find(function () { var dose = r.pick([1.5, 2, 2.5, 0.5, 1, 3]), per = r.pick([5, 10, 4, 20]), m = pickR(r, [3, an[0] === 'calf' ? 90 : 45, 0.5]); return [dose, per, m, dose * m / per]; }, function (v) { return v[2] % v[1] !== 0 && v[2] > v[1] && near(v[3] * 100, Math.round(v[3] * 100), 1e-7) && v[3] < 40; });
    var dose = v[0], per = v[1], m = v[2], x = v[3];
    return amtPart('A vet’s medicine label says: give ' + t(N(dose)) + ' mL for every ' + t(per) + ' kg of body mass. How many millilitres should a ' + t(N(m)) + ' kg ' + an[0] + ' get?', x, { dp: 2, plain: true, after: 'mL',
      diag: [{ v: per * m / dose, code: 'u1x-dose-flip', hint: 'Put mL on top in both fractions: ' + t('\\dfrac{' + N(dose) + '}{' + per + '}=\\dfrac{x}{' + N(m) + '}') + '.' }, { v: dose * per / m, code: 'u1x-dose-flip', hint: 'A heavier animal gets <b>more</b> medicine.' }, { v: dose * m, code: 'u1x-prop-row', hint: 'The ' + t(N(dose)) + ' mL is for ' + t(per) + ' kg, not for 1 kg: divide by ' + t(per) + ' too.' }],
      sol: br([t('\\dfrac{' + N(dose) + '\\text{ mL}}{' + per + '\\text{ kg}}=\\dfrac{x}{' + N(m) + '\\text{ kg}}'), t(per + 'x=' + N(dose) + '\\times ' + N(m) + '=' + N(dose * m)), t('x=' + N(dose * m) + '\\div ' + per + '=' + N(x)) + ' mL']),
      hints: ['Set up mL over kg on both sides.', 'Cross-multiply, then divide.'], text: 'medicine dose' });
  }
  function l4q4(r) {
    var c = r.pick([{ w: 'Grass seed', cov: [1, 1.5, 2], area: [40, 50, 60, 80], bag: [2, 2.5, 5], u: 'kg', what: 'lawn' }, { w: 'Lawn fertilizer', cov: [2, 2.5, 3], area: [50, 100], bag: [5, 10, 4], u: 'kg', what: 'yard' }]);
    var s = find(function () { var cv = r.pick(c.cov), ar = r.pick(c.area), L = pickR(r, [6, 20, 0.5]), W = pickR(r, [4, 15, 0.5]), bag = r.pick(c.bag); var A0 = L * W, need = cv * A0 / ar, n = need / bag; return { cv: cv, ar: ar, L: L, W: W, bag: bag, A0: A0, need: need, n: n }; },
      function (s) { return s.L > s.W && Math.abs(s.n - Math.round(s.n)) > 0.1 && s.n > 1.2 && s.n < 9 && near(s.need * 100, Math.round(s.need * 100), 1e-6); });
    var bags = Math.ceil(s.n - 1e-9), per = 2 * (s.L + s.W);
    var check = A.amtChk(bags, { dp: 0, plain: true, diag: [{ v: Math.floor(s.n), code: 'u1t-round-down', hint: t(Math.floor(s.n)) + ' bags hold only ' + t(N(Math.floor(s.n) * s.bag)) + ' kg, not enough. Round <b>up</b>.' }, { v: s.need, code: 'u1x-seed-kg', hint: 'That’s the kilograms needed. How many ' + t(N(s.bag)) + ' kg bags is that?' },
      { v: Math.ceil(s.cv * per / s.ar / s.bag - 1e-9), code: 'u1x-area-perim', hint: 'Use the <b>area</b> of the ' + c.what + ' (length × width), not the perimeter.' }] });
    var key = String(bags);
    return { prompt: c.w + ': ' + t(N(s.cv)) + ' kg covers ' + t(s.ar) + ' m². A ' + c.what + ' is a rectangle ' + t(N(s.L)) + ' m by ' + t(N(s.W)) + ' m. ' + c.w + ' is sold in ' + t(N(s.bag)) + ' kg bags. How many bags do you need?', input: { type: 'number', after: 'bags' }, check: check, key: key, answer: t(key) + ' bags',
      solution: br(['Area: ' + t(N(s.L) + '\\times ' + N(s.W) + '=' + N(s.A0)) + ' m²', t('\\dfrac{' + N(s.cv) + '}{' + s.ar + '}=\\dfrac{x}{' + N(s.A0) + '}') + ', so ' + t('x=' + N(s.cv) + '\\times ' + N(s.A0) + '\\div ' + s.ar + '=' + N(s.need)) + ' kg', 'Bags: ' + t(N(s.need) + '\\div ' + N(s.bag) + toN(s.n, 2)) + ', so buy ' + t(bags) + ' bags (round up).']),
      hints: ['Find the area first (length × width).', 'Use a proportion for the kilograms, then round the number of bags up.'], text: 'bags of seed', bad: [String(Math.floor(s.n)), String(Math.ceil(s.cv * per / s.ar / s.bag - 1e-9))].filter(function (b) { return b !== key; }) };
  }
  HW.defineExit({ lesson: 'u1l4', outcome: 'N1', calc: true, blurb: 'Proportions: solving one, a map scale, a medicine dose, and how many bags to buy.',
    questions: [Q(1, 'N1', 'BEG', l4q1, 'Solve a proportion'), Q(2, 'N1', 'PRG', l4q2, 'Map scale'), Q(3, 'N1', 'PRG', l4q3, 'Medicine dose'), Q(4, 'N1', 'MAS', l4q4, 'Bags to buy (area, proportion, round up)')] });

  /* =====================================================================================================
   * 1.5 Rates (N1)
   * ===================================================================================================== */
  function l5q1(r) {
    if (r.chance(0.5)) {
      var g = r.pick([['apples', 2.49, 4.99], ['ground beef', 8.8, 13.2], ['bananas', 1.49, 1.99], ['cheddar cheese', 16, 24], ['grapes', 4.4, 8.8]]);
      var kv = find(function () { var kg0 = r.pick([1.5, 2, 2.5, 3, 4, 0.8, 1.2]), up0 = q(r.int(Math.round(g[1] * 100), Math.round(g[2] * 100)) / 100); return [kg0, up0]; }, function (v) { return near(v[0] * v[1] * 100, Math.round(v[0] * v[1] * 100), 1e-7); });
      var kg = kv[0], ex = kv[1], Pr = q(kg * ex);
      return amtPart(t(N(kg)) + ' kg of ' + g[0] + ' cost ' + MM(Pr) + '. What is the price per kilogram?', ex, { after: '/kg', diag: [{ v: kg / Pr, code: 'u1t-flip', hint: 'Price per kg = price ÷ kg (dollars on top).' }, { v: Pr * kg, code: 'u1t-times', hint: 'Per kg means divide by the number of kilograms.' }],
        sol: t(Mt(Pr) + '\\div ' + N(kg) + toM(ex)) + ' per kg', hints: ['Price per kg = price ÷ kilograms.'], text: 'price per kg' });
    }
    var m = r.pick([['A printer', 'pages', 'minute', 'min', [12, 40], [3, 8]], ['A bakery machine', 'buns', 'minute', 'min', [15, 45], [4, 9]], ['A fast typist', 'words', 'minute', 'min', [45, 80], [3, 6]]]), rate = r.int(m[4][0], m[4][1]), tm = r.int(m[5][0], m[5][1]), n = rate * tm;
    return amtPart(m[0] + ' makes ' + t(n) + ' ' + m[1] + ' in ' + t(tm) + ' ' + m[3] + '. What is the unit rate in ' + m[1] + ' per ' + m[2] + '?', rate, { dp: 2, plain: true, after: m[1] + '/' + m[3], diag: [{ v: tm / n, code: 'u1t-flip', hint: m[1] + ' per ' + m[2] + ': divide the ' + m[1] + ' by the minutes.' }, { v: n * tm, code: 'u1t-times', hint: 'Per minute means divide by the minutes.' }],
      sol: t(n + '\\div ' + tm + '=' + rate) + ' ' + m[1] + ' per ' + m[2], hints: ['Unit rate = amount ÷ time.'], text: 'unit rate' });
  }
  function l5q3(r) {
    var c = r.pick([{ w: 'A bottling machine fills', it: 'bottles', t1: 's', T: 'min', f: 60 }, { w: 'A conveyor belt moves', it: 'boxes', t1: 's', T: 'min', f: 60 }, { w: 'A tap fills', it: 'litres', t1: 'min', T: 'h', f: 60 }]);
    var v = find(function () { var rate = r.pick([0.4, 0.5, 0.6, 0.75, 1.2, 1.5, 2.5, 0.8]), tt = r.pick([15, 20, 30, 40, 45, 25]), T = r.pick([2, 3, 4, 5, 6, 1.5, 2.5]); return [rate, tt, T, rate * tt]; }, function (v) { return near(v[3], Math.round(v[3]), 1e-9) && (c.it === 'litres' || near(v[0] * v[2] * c.f, Math.round(v[0] * v[2] * c.f), 1e-9)); });
    var rate = v[0], tt = v[1], T = v[2], n = v[3], ans = rate * T * c.f;
    return amtPart(c.w + ' ' + t(N(n)) + ' ' + c.it + ' in ' + t(tt) + ' ' + c.t1 + '. At this rate, how many ' + c.it + ' does it fill in ' + t(N(T)) + ' ' + c.T + '?', ans, { dp: 2, plain: true, after: c.it,
      diag: [{ v: rate * T, code: 'u1x-rate-noconv', hint: 'The rate is per ' + c.t1 + ', but the time is in ' + c.T + ': ' + t(N(T) + '\\text{ ' + c.T + '}=' + N(T * c.f) + '\\text{ ' + c.t1 + '}') + '.' }, { v: tt / n * T * c.f, code: 'u1t-flip', hint: 'Unit rate: ' + c.it + ' ÷ ' + c.t1 + ' = ' + t(N(n) + '\\div ' + tt) + '.' }, { v: n * T, code: 'u1x-rate-noconv', hint: 'The ' + t(N(n)) + ' ' + c.it + ' take ' + t(tt) + ' ' + c.t1 + ', not 1 ' + c.T + '.' }],
      sol: br(['Unit rate: ' + t(N(n) + '\\div ' + tt + '=' + N(rate)) + ' ' + c.it + ' per ' + c.t1, 'Time: ' + t(N(T) + '\\text{ ' + c.T + '}=' + N(T * c.f) + '\\text{ ' + c.t1 + '}'), t(N(rate) + '\\times ' + N(T * c.f) + '=' + N(ans)) + ' ' + c.it]),
      hints: ['Find the unit rate (per ' + c.t1 + ').', 'Change the time to ' + c.t1 + ' before you multiply.'], text: 'predict with a rate (unit change)' });
  }
  function l5q4(r) {
    var tr = r.pick([['from Calgary to Edmonton', 300], ['from Lethbridge to Banff', 315], ['from Red Deer to Jasper', 420], ['from Calgary to Regina', 760], ['from Edmonton to Fort McMurray', 435], ['from Medicine Hat to Calgary and back', 590]]);
    var e1 = pickR(r, [5.8, 8.4, 0.1]), e2 = q(e1 + pickR(r, [2.5, 7.5, 0.1])), g = pickR(r, [1.29, 1.59, 0.01]), d = tr[1], c1 = e1 * d / 100 * g, c2v = e2 * d / 100 * g, diff = c2v - c1;
    var v1 = r.pick(['a small car', 'a hybrid car', 'a hatchback']), v2 = r.pick(['a pickup truck', 'an SUV', 'a cargo van']);
    return amtPart('Gas costs ' + MM(g) + '/L. ' + cap(v1) + ' uses ' + t(N(e1)) + ' L/100 km and ' + v2 + ' uses ' + t(N(e2)) + ' L/100 km. How much more does the gas cost in ' + v2 + ' for a ' + t(d) + ' km trip ' + tr[0] + '?', diff, { alts: [r2(c2v) - r2(c1)],
      diag: [{ v: c2v, code: 'u1x-one-veh', hint: 'That’s the cost for ' + v2 + ' alone. Find both costs and subtract.' }, { v: (e2 - e1) * d / 100, code: 'u1x-diff-litres', hint: 'That’s the difference in litres. Multiply by the price per litre.' }, { v: (e2 - e1) * d * g, code: 'u1t-fuel-no100', hint: 'The L/100 km is for every 100 km: the trip is ' + t(N(d / 100)) + ' hundreds of km.' }],
      sol: br([cap(v1) + ': ' + t(N(d / 100) + '\\times ' + N(e1) + '=' + N(rd(e1 * d / 100, 3))) + ' L; ' + t(N(rd(e1 * d / 100, 3)) + '\\times ' + c2(g) + toM(c1)), cap(v2) + ': ' + t(N(d / 100) + '\\times ' + N(e2) + '=' + N(rd(e2 * d / 100, 3))) + ' L; ' + t(N(rd(e2 * d / 100, 3)) + '\\times ' + c2(g) + toM(c2v)), 'More: ' + t(Mt(c2v) + '-' + Mt(c1) + '=' + Mt(r2(c2v) - r2(c1)))]),
      hints: ['Litres for the trip = (km ÷ 100) × L/100 km.', 'Find the cost for each vehicle, then subtract.'], text: 'two vehicles, one trip' });
  }
  HW.defineExit({ lesson: 'u1l5', outcome: 'N1', calc: true, blurb: 'Rates: a unit rate, fuel economy in L/100 km, predicting with a rate, and comparing two vehicles on a trip.',
    questions: [Q(1, 'N1', 'BEG', l5q1, 'Unit rate'), Q(2, 'N1', 'PRG', function (r) { return A.fuelEconPart(r); }, 'Fuel economy in L/100 km'), Q(3, 'N1', 'PRG', l5q3, 'Predict with a rate (unit change)'), Q(4, 'N1', 'MAS', l5q4, 'Two vehicles, one trip')] });

  /* =====================================================================================================
   * 1.6 Unit price (N1)
   * ===================================================================================================== */
  function l6q1(r) {
    var c = r.pick([{ n: 'A 12-pack of granola bars', k: 12, per: 'bar', p: [4.49, 7.99] }, { n: 'A 4 L jug of milk', k: 4, per: 'litre', p: [5.49, 6.99] }, { n: 'A 24-pack of water bottles', k: 24, per: 'bottle', p: [3.99, 6.99] }, { n: 'A dozen eggs', k: 12, per: 'egg', p: [3.99, 6.29] }, { n: 'A 6-pack of yogurt cups', k: 6, per: 'cup', p: [3.49, 5.99] }]);
    var Pr = q(r.int(Math.round(c.p[0] * 100), Math.round(c.p[1] * 100)) / 100), ex = Pr / c.k;
    var p = { prompt: c.n + ' costs ' + MM(Pr) + '. What is the unit price, per ' + c.per + '? (Round to the nearest tenth of a cent, or to the cent.)', input: { type: 'number', before: '$', after: '/' + c.per },
      check: upChk(ex, [{ v: c.k / Pr, code: 'u1t-flip', hint: 'Unit price = price ÷ number of items (dollars on top).' }, { v: Pr * c.k, code: 'u1t-times', hint: 'Per ' + c.per + ' means divide by ' + t(c.k) + '.' }]), key: rd(ex, 3).toFixed(3),
      answer: t('\\$' + rd(ex, 3).toFixed(3)) + ' per ' + c.per + ' (' + t(Mt(ex)) + ' to the cent)', solution: t(Mt(Pr) + '\\div ' + c.k + (near(ex, rd(ex, 3), 1e-9) ? '=' : '=' + raw5(ex) + '\\approx') + '\\$' + rd(ex, 3).toFixed(3)) + ' per ' + c.per,
      hints: ['Unit price = price ÷ quantity.'], text: 'unit price per item', good: [rd(ex, 2).toFixed(2)], bad: [rd(c.k / Pr, 3).toFixed(3)] };
    return p;
  }
  var TWO = [{ n: 'Peanut butter', u: 'g', S: [[500, 750], [1000, 1500, 2000]], c: [70, 110], small: 'jar', reason: 'a small jar is used up before the oil separates, and it fits in a small cupboard' },
    { n: 'Coffee', u: 'g', S: [[300, 340, 400], [907, 925, 1360]], c: [180, 260], small: 'bag', reason: 'coffee goes stale once the bag is open, and a small bag is finished while it is fresh' },
    { n: 'Hand soap', u: 'mL', S: [[250, 354], [1000, 1180, 2000]], c: [40, 90], small: 'bottle', reason: 'a small bottle with a pump fits on a bathroom counter, and you can try a new scent first' },
    { n: 'Salad greens', u: 'g', S: [[142, 150, 200], [312, 454, 500]], c: [130, 220], small: 'box', reason: 'greens spoil in a few days, and a person living alone may not eat a big box in time' }];
  function twoShared(r) {
    var c = r.pick(TWO);
    var v = find(function () { var s = [r.pick(c.S[0]), r.pick(c.S[1])], big = r.chance(0.7), u = r.int(c.c[0], c.c[1]) / 100, us = big ? [u + r.int(6, 25) / 100, u] : [u, u + r.int(4, 14) / 100];
      return { s: s, pr: s.map(function (x, i) { return q(Math.max(1, Math.round(x / 100 * us[i] * 2) / 2) - 0.01); }) }; }, function (v) { var a = v.s.map(function (x, i) { return v.pr[i] / x * 100; }); return Math.abs(a[0] - a[1]) >= 0.03; });
    v.up = v.s.map(function (x, i) { return v.pr[i] / x * 100; }); v.b = v.up[0] < v.up[1] ? 0 : 1;
    return { c: c, v: v };
  }
  function twoName(c, x) { return sz(x, c.u, c.u === 'g' ? 'kg' : 'L'); }
  function twoStem(s) { var c = s.c, v = s.v; return c.n + ' comes in two sizes.' + table(['Size', twoName(c, v.s[0]), twoName(c, v.s[1])], [['Price', MM(v.pr[0]), MM(v.pr[1])]]); }
  function twoUP(r, s) {
    var c = s.c, v = s.v, specs = v.s.map(function (x, i) { var sp = upField(twoName(c, x) + ':', v.up[i], { after: '/100 ' + c.u, bad: [{ v: x / v.pr[i], code: 'u1t-flip', hint: 'Price ÷ quantity: dollars on top.' }, { v: v.pr[i] / x, code: 'u1t-per-g', hint: 'That’s per 1 ' + c.u + '. Multiply by 100.' }, x >= 1000 ? { v: v.pr[i] / (x / 1000), code: 'u1t-per-kg', hint: 'Change ' + twoName(c, x) + ' to ' + HW.fmt(String(x)) + ' ' + c.u + ' first.' } : null].filter(Boolean) }); sp.name = twoName(c, x); return sp; });
    var p = fieldsPart('Find the unit price of each size, per 100 ' + c.u + '. (Keep 3 decimal places to compare.)', specs, br(v.s.map(function (x, i) { return (x >= 1000 ? twoName(c, x) + ' = ' + HW.fmt(String(x)) + ' ' + c.u + ': ' : '') + t(c2(v.pr[i]) + '\\div ' + HW.fmt(String(x)) + '\\times 100' + (near(v.up[i], rd(v.up[i], 3), 1e-9) ? '=' : '\\approx') + '\\$' + rd(v.up[i], 3).toFixed(3)); })),
      ['Unit price per 100 ' + c.u + ' = price ÷ ' + c.u + ' × 100.', 'Change kg to g (or L to mL) first.'], 'two unit prices');
    p.bad = [specs.map(function (sp, i) { return rd(v.s[i] / v.pr[i], 3).toFixed(3); })];
    return p;
  }
  function twoMC(r, s) {
    var c = s.c, v = s.v, best = twoName(c, v.s[v.b]), other = twoName(c, v.s[1 - v.b]), small = twoName(c, v.s[0]);
    var reason = v.b === 1 ? 'Someone might still buy the ' + small + ' ' + c.small + ' because ' + c.reason + '.' : 'Here the bigger ' + c.small + ' is <b>not</b> the better buy.';
    var right = 'The <b>' + best + '</b> ' + c.small + ' is the better buy: it costs less per 100 ' + c.u + '. ' + reason;
    var w = [['The <b>' + other + '</b> ' + c.small + ' is the better buy: it costs less per 100 ' + c.u + '.', 'Compare your unit prices: the ' + other + ' ' + c.small + ' costs <b>more</b> per 100 ' + c.u + '.'],
      v.b === 1 ? ['The <b>' + small + '</b> ' + c.small + ' is the better buy, because it has the lower price.', 'It costs less today, but you get less. The better buy has the lower <b>unit</b> price.'] : ['The <b>' + other + '</b> ' + c.small + ' is the better buy, because bigger sizes always cost less per 100 ' + c.u + '.', 'Not always: here the smaller ' + c.small + ' has the lower unit price.'],
      ['The <b>' + best + '</b> ' + c.small + ' is the better buy: it costs less per 100 ' + c.u + '. Someone might still buy the ' + other + ' ' + c.small + ' because it costs more per 100 ' + c.u + '.', 'Costing more per 100 ' + c.u + ' is not a reason to buy it. A reason that is not about price is about spoiling, storing, carrying or trying a product.']];
    return reasonMC(r, 'Which statement is correct?', right, w, 'Lower unit price: the ' + best + ' ' + c.small + ' (' + t('\\$' + rd(v.up[v.b], 3).toFixed(3)) + ' per 100 ' + c.u + ').' + (v.b === 1 ? '<br>A reason that is not about price: ' + c.reason + '.' : ''),
      ['The better buy has the lower <b>unit</b> price.', 'A reason “not about price” is about spoiling, storing, carrying or trying a product.'], 'better buy + reason');
  }
  function l6q4(r) {
    var c = r.pick([['yogurt cups', 'cup', 6, [0.99, 1.49]], ['cans of soup', 'can', 4, [1.49, 2.29]], ['bottles of sports drink', 'bottle', 6, [1.79, 2.49]], ['bagels', 'bagel', 6, [0.89, 1.29]], ['cans of cat food', 'can', 12, [0.89, 1.39]]]);
    var s = find(function () { var one = q(r.int(Math.round(c[3][0] * 100), Math.round(c[3][1] * 100)) / 100), k = c[2], pk = q(Math.round(one * k * (1 - r.int(10, 25) / 100)) + r.pick([-0.01, 0.49, -0.51])), need = k + r.int(1, k - 1); return { one: one, k: k, pk: pk, need: need }; },
      function (s) { var a = s.need * s.one, b = s.pk + (s.need - s.k) * s.one, c2v = 2 * s.pk; return s.pk > 1 && s.pk < s.k * s.one - 0.3 && Math.abs(b - c2v) > 0.2 && Math.abs(a - Math.min(b, c2v)) > 0.3; });
    var one = s.one, k = s.k, pk = s.pk, need = s.need, all1 = need * one, mix = pk + (need - k) * one, two = 2 * pk, best = Math.min(all1, mix, two);
    var diag = [{ v: all1, code: 'u1x-all-single', hint: 'The ' + k + '-pack deal is cheaper per ' + c[1] + '. Use it for as many as you can.' }, { v: need * pk / k, code: 'u1x-pack-rate', hint: 'You can’t buy part of a pack at the deal price: a pack is ' + k + ' ' + c[0] + '.' }];
    diag.push(best === mix ? { v: two, code: 'u1x-not-cheapest', hint: 'Two packs give more ' + c[0] + ' than you need. Compare with one pack plus single ' + c[0] + '.' } : { v: mix, code: 'u1x-not-cheapest', hint: 'Compare with buying two packs: sometimes the extra ' + c[0] + ' are worth it.' });
    return amtPart(cap(c[0]) + ' cost ' + MM(one) + ' each, or ' + t(k) + ' for ' + MM(pk) + '. You need ' + t(need) + ' ' + c[0] + '. What is the <b>least</b> you can pay (before tax)?', best, { diag: diag,
      sol: br(['All single: ' + t(need + '\\times ' + Mt(one) + '=' + Mt(all1)), 'One pack + ' + (need - k) + ' single: ' + t(Mt(pk) + '+' + (need - k) + '\\times ' + Mt(one) + '=' + Mt(mix)), 'Two packs (' + 2 * k + ' ' + c[0] + '): ' + t('2\\times ' + Mt(pk) + '=' + Mt(two)), 'The least is ' + MM(best) + '.']),
      hints: ['List the ways to buy at least ' + need + ' ' + c[0] + '.', 'Work out the cost of each way and pick the lowest.'], text: 'cheapest way with a multi-buy' });
  }
  HW.defineExit({ lesson: 'u1l6', outcome: 'N1', calc: true, blurb: 'Unit price: one unit price, comparing two sizes (and a reason that is not about price), and the cheapest way to buy with a multi-buy deal.',
    questions: [Q(1, 'N1', 'BEG', l6q1, 'Unit price per item'), { num: '2', outcome: 'N1', text: 'Two sizes: unit prices, then the better buy and a reason', shared: twoShared, stem: twoStem, parts: [{ id: '2a', outcome: 'N1', level: 'PRG', make: twoUP }, { id: '2b', outcome: 'N1', level: 'PRG', make: twoMC }] },
      Q(3, 'N1', 'MAS', l6q4, 'Cheapest way with a multi-buy')] });

  /* =====================================================================================================
   * 1.7 Percents (REV)
   * ===================================================================================================== */
  function l7q1(r) {
    var kind = r.int(0, 4), p = kind === 0 ? q(r.int(11, 99) / 10) : kind === 1 ? q(r.int(1, 9) / 10) : kind === 2 ? r.int(101, 250) : kind === 3 ? q(r.int(1, 9) + 0.25 * r.int(1, 3)) : q(r.int(10, 39) + 0.5), d0 = q(p / 100);
    return amtPart('Write ' + t(N(p) + '\\%') + ' as a decimal.', d0, { dp: 6, plain: true, word: 'the exact decimal (don’t round)',
      diag: [{ v: p / 10, code: 'u1x-pct-10', hint: 'Divide by <b>100</b>: move the decimal point two places to the left.' }, { v: p, code: 'u1x-pct-whole', hint: 'Percent means “out of 100”: divide by 100.' }, { v: p / 1000, code: 'u1x-pct-10', hint: 'Move the decimal point exactly <b>two</b> places to the left.' }],
      sol: t(N(p) + '\\%=' + N(p) + '\\div 100=' + N(d0)), hints: ['Percent means per hundred: divide by 100.', 'Move the decimal point two places to the left.'], text: 'percent to decimal' });
  }
  function l7q2(r) {
    var c = r.pick([['a 15% tip on a restaurant bill of', 15], ['the 5% GST on', 5], ['a 20% tip on a haircut that costs', 20], ['12.5% of', 12.5], ['a 7% PST on', 7], ['an 18% tip on a bill of', 18]]), Am = q(r.int(1500, 18000) / 100), x = c[1] * Am / 100;
    return amtPart('Find ' + c[0].replace(/(\d+(\.\d+)?)%/, function (m0, n0) { return t(n0 + '\\%'); }) + ' ' + MM(Am) + '.', x, {
      diag: [{ v: c[1] * Am, code: 'u1x-pct-whole', hint: 'Change the percent to a decimal first: ' + t(N(c[1]) + '\\%=' + N(c[1] / 100)) + '.' }, { v: c[1] * Am / 10, code: 'u1x-pct-10', hint: t(N(c[1]) + '\\%=' + N(c[1] / 100)) + ': move the decimal point <b>two</b> places.' }, { v: Am * (1 + c[1] / 100), code: 'u1x-pct-total', hint: 'The question asks for the ' + t(N(c[1]) + '\\%') + ' only, not the total.' }],
      sol: t(N(c[1]) + '\\%\\text{ of }' + Mt(Am) + '=' + N(c[1] / 100) + '\\times ' + c2(Am) + toM(x)), hints: ['Change the percent to a decimal, then multiply.'], text: 'percent of an amount' });
  }
  function l7q3(r) {
    var c = r.pick([['On a quiz, Malik got', 'out of', 'What percent did he get?', [20, 50]], ['A team won', 'of its', 'games. What percent of its games did it win?', [12, 40]], ['In a class,', 'of the', 'students take the bus. What percent take the bus?', [24, 32]]]);
    var v = find(function () { var W = r.int(c[3][0], c[3][1]), pt = r.int(Math.ceil(W * 0.35), W - 1); return [pt, W]; }, function (v) { return true; }), pt = v[0], W = v[1], pc = pt / W * 100;
    var prompt = c[0] === 'On a quiz, Malik got' ? 'On a quiz, Malik got ' + t(pt) + ' out of ' + t(W) + '. What percent did he get, to the nearest tenth?' : c[0] === 'A team won' ? 'A team won ' + t(pt) + ' of its ' + t(W) + ' games. What percent of its games did it win, to the nearest tenth?' : 'In a class, ' + t(pt) + ' of the ' + t(W) + ' students take the bus. What percent take the bus, to the nearest tenth?';
    return amtPart(prompt, pc, { dp: 1, pct: true, diag: [{ v: W / pt * 100, code: 'u1x-pct-flip', hint: 'Part ÷ whole: ' + t(pt + '\\div ' + W) + ', then × 100.' }, { v: pt / 100 * W, code: 'u1x-pct-flip', hint: 'Divide the part by the whole: ' + t(pt + '\\div ' + W) + '.' }],
      sol: t(pt + '\\div ' + W + '\\times 100' + toN(pc, 1) + '\\%'), hints: ['Percent = part ÷ whole × 100.'], text: 'what percent' });
  }
  function l7q4(r) {
    var sv = find(function () { return { N0: r.pick([240, 320, 400, 480, 560, 600, 360, 720, 800]), pw: r.pick([15, 20, 25, 30, 35, 40, 12.5]), f: r.pick([[2, 5], [1, 4], [1, 3], [3, 10], [3, 8], [1, 5], [2, 3]]) }; },
      function (s) { return near(s.N0 * s.pw / 100, Math.round(s.N0 * s.pw / 100)) && s.N0 % s.f[1] === 0 && s.pw / 100 + s.f[0] / s.f[1] < 0.9; });
    var N0 = sv.N0, pw = sv.pw, f = sv.f;
    var wk = N0 * pw / 100, bus = N0 * f[0] / f[1], drv = N0 - wk - bus, frT = t('\\dfrac{' + f[0] + '}{' + f[1] + '}');
    return amtPart('A school surveyed its ' + t(N0) + ' students about how they get to school. ' + t(N(pw) + '\\%') + ' walk, ' + frT + ' take the bus, and the rest get a ride in a car. How many students get a ride in a car?', drv, { dp: 0, plain: true, after: 'students',
      diag: [{ v: 100 - pw - f[0] / f[1] * 100, code: 'u1x-survey-pct', hint: 'That’s the percent who get a ride. The question asks for the number of students: find that percent of ' + t(N0) + '.' }, { v: wk, code: 'u1x-survey-other', hint: 'That’s the number who walk.' }, { v: bus, code: 'u1x-survey-other', hint: 'That’s the number who take the bus.' }, { v: N0 - wk, code: 'u1x-of-total', hint: 'Take away the bus riders too.' }],
      sol: br(['Walk: ' + t(N(pw / 100) + '\\times ' + N0 + '=' + N(wk)), 'Bus: ' + frT + ' of ' + t(N0 + '=' + N(bus)), 'Car: ' + t(N0 + '-' + N(wk) + '-' + N(bus) + '=' + N(drv)) + ' students']),
      hints: ['Find the number who walk and the number who take the bus.', 'The rest is everyone minus those two groups.'], text: 'survey: percent and fraction' });
  }
  HW.defineExit({ lesson: 'u1l7', outcome: 'REV', calc: true, blurb: 'Percents: as decimals, a percent of an amount, what percent one number is of another, and a survey with a percent and a fraction.',
    questions: [Q(1, 'REV', 'BEG', l7q1, 'Percent to decimal'), Q(2, 'REV', 'PRG', l7q2, 'Percent of an amount'), Q(3, 'REV', 'PRG', l7q3, 'What percent'), Q(4, 'REV', 'MAS', l7q4, 'Survey: percent and fraction')] });

  /* =====================================================================================================
   * 1.8 Markup and sales tax (N1)
   * ===================================================================================================== */
  function l8q4(r) {
    var m = r.pick([40, 50, 60, 75, 25, 80, 100]), g = r.pick(['a lamp', 'a pair of snowshoes', 'a toolbox', 'a gaming chair', 'a pair of rain boots', 'a set of pots']);
    var C = find(function () { return 4 * r.int(5, 40); }, function (c) { return near(c * (1 + m / 100) * 1.05 * 100, Math.round(c * (1 + m / 100) * 1.05 * 100), 1e-6); }), Rt = q(C * (1 + m / 100)), T = q(Rt * 1.05);
    return amtPart('A store marks ' + g + ' up ' + t(m + '\\%') + '. A customer in Alberta pays ' + MM(T) + ', including ' + t('5\\%') + ' GST. What did the store pay for it (the cost)?', C, {
      diag: [{ v: T * (1 - m / 100), code: 'u1t-forward', hint: 'Work backwards: undo the GST (÷ 1.05), then undo the markup (÷ ' + mult(m) + ').' }, { v: T / (1 + m / 100), code: 'u1t-back-notax', hint: 'Take the GST out first: ' + t(Mt(T) + '\\div 1.05') + ' is the retail price.' },
        { v: Rt * (1 - m / 100), code: 'u1x-mk-sub', hint: 'The markup was ' + t(m + '\\%') + ' of the <b>cost</b>, so the retail price is ' + t(100 + m + '\\%') + ' of the cost: divide by ' + t(mult(m)) + '.' }, { v: Rt, code: 'u1t-back-nodisc', hint: 'That’s the retail price. Now undo the markup.' }, { v: T * 0.95 / (1 + m / 100), code: 'u1t-tax-back-mult', hint: 'To take out 5% GST, divide by 1.05.' }],
      sol: br(['Undo the GST: ' + t(Mt(T) + '\\div 1.05=' + Mt(Rt)) + ' (the retail price).', 'Retail is ' + t(100 + m + '\\%') + ' of the cost: ' + t(Mt(Rt) + '\\div ' + mult(m) + '=' + Mt(C)), 'Check: ' + t(Mt(C) + '\\times ' + mult(m) + '\\times 1.05=' + Mt(T)) + ' ✓']),
      hints: ['Undo the last step first: the GST was added last.', 'A ' + m + '% markup means retail = cost × ' + mult(m) + '.'], text: 'backwards to the cost' });
  }
  HW.defineExit({ lesson: 'u1l8', outcome: 'N1', calc: true, blurb: 'Markup and tax: a retail price, the markup percent, the total with tax, and working back from a total to the cost.',
    questions: [Q(1, 'N1', 'BEG', function (r) { return A.retailPart(r); }, 'Retail price from a markup'), Q(2, 'N1', 'PRG', function (r) { return A.markupPctPart(r); }, 'Markup percent'), Q(3, 'N1', 'PRG', function (r) { return A.taxTotalPart(r); }, 'Total with PST + GST or HST'), Q(4, 'N1', 'MAS', l8q4, 'Backwards from a total with GST to the cost')] });

  /* =====================================================================================================
   * 1.9 Discounts (N1)
   * ===================================================================================================== */
  function l9q4(r) {
    var it = r.pick([['T-shirts', 'T-shirt', [18, 32]], ['pairs of socks', 'pair', [8, 15]], ['phone cases', 'case', [15, 28]], ['packs of hockey tape', 'pack', [4, 9]], ['bags of chips', 'bag', [3, 6]]]);
    var s = find(function () { var X = q(r.int(it[2][0], it[2][1]) + r.pick([0, 0.99, 0.5])), p = r.pick([20, 25, 30, 35, 40]), n = r.pick([4, 5, 7, 8, 6, 4, 5]); var a = (n - Math.floor(n / 3)) * X, b = n * X * (1 - p / 100); return { X: X, p: p, n: n, a: a, b: b }; }, function (s) { return Math.abs(r2(s.a) - r2(s.b)) >= 1; });
    var X = s.X, p = s.p, n = s.n, a = r2(s.a), b = r2(s.b), diff = r2(Math.abs(a - b)), Acheap = a < b, free = Math.floor(n / 3);
    return whichAmtPart(cap(it[0]) + ' cost ' + MM(X) + ' each. A store offers two promotions, and you may use only one.<br><b>Promotion A:</b> Buy 2, get the 3rd free. &nbsp; <b>Promotion B:</b> ' + t(p + '\\%') + ' off everything.<br>You want ' + t(n) + ' ' + it[0] + '. Which promotion is cheaper, and by how much?', { amt: diff, alts: [Math.abs(s.a - s.b)],
      whichLabel: 'Cheaper (A or B):', ph: 'A or B', right: [Acheap ? 'a' : 'b'], wrongs: [Acheap ? 'b' : 'a'], rightKey: 'Promotion ' + (Acheap ? 'A' : 'B'), wrongKey: 'Promotion ' + (Acheap ? 'B' : 'A'),
      why: 'Find the cost with each promotion, then compare.', nudge: 'type A or B.',
      diag: [{ v: Math.abs(n * X * 2 / 3 - b), code: 'u1x-free-wrong', hint: 'With “buy 2, get the 3rd free”, you get one free ' + it[1] + ' for every 3 you take: ' + (free ? t(free) + ' free here' : 'none free with only ' + n) + '. It is not a third off every ' + it[1] + '.' }, { v: Math.min(a, b), code: 'u1t-gave-total', hint: 'That’s the cheaper cost. Subtract to find how much cheaper.' }],
      sol: br(['A: ' + (free ? t(free) + ' free, so you pay for ' + t(n - free) + ': ' : 'no free ' + it[1] + ' with only ' + n + ': ') + t((n - free) + '\\times ' + Mt(X) + '=' + Mt(a)), 'B: ' + t(n + '\\times ' + Mt(X) + '\\times ' + pay(p) + toM(s.b)), t(Mt(Math.max(a, b)) + '-' + Mt(Math.min(a, b)) + '=' + Mt(diff)), '<b>Promotion ' + (Acheap ? 'A' : 'B') + '</b> is cheaper by ' + MM(diff) + '.']),
      hints: ['A: how many of the ' + n + ' are free? Pay for the rest.', 'B: take ' + p + '% off the cost of all ' + n + '.'], text: 'two promotions' });
  }
  HW.defineExit({ lesson: 'u1l9', outcome: 'N1', calc: true, blurb: 'Discounts: a sale price, the percent decrease, a sale price with tax, and choosing between two promotions.',
    questions: [Q(1, 'N1', 'BEG', function (r) { return A.salePart(r); }, 'Sale price'), Q(2, 'N1', 'PRG', function (r) { return A.pctDecPart(r); }, 'Percent decrease'), Q(3, 'N1', 'PRG', function (r) { return A.saleTaxPart(r); }, 'Sale price, then tax'), Q(4, 'N1', 'MAS', l9q4, 'Two promotions')] });

  /* =====================================================================================================
   * 1.10 Currency exchange (N1)
   * ===================================================================================================== */
  function l10q1(r) {
    var c = r.pick([{ k: 'EUR', R: [1.52, 1.58], w: 'In Paris, a museum ticket costs', a: [17, 29], u: 'euros', s: function (x) { return t(N(x)) + ' euros'; } }, { k: 'GBP', R: [1.80, 1.86], w: 'In London, a football-match ticket costs', a: [35, 85], u: 'pounds', s: function (x) { return t(N(x)) + ' pounds'; } },
      { k: 'USD', R: [1.36, 1.40], w: 'In Seattle, a hotel room costs', a: [129, 249], u: 'USD', s: function (x) { return MM(x) + ' USD'; } }]);
    var R = q(r.int(Math.round(c.R[0] * 100), Math.round(c.R[1] * 100)) / 100), x = q(r.int(c.a[0], c.a[1]) + r.pick([0, 0.5, 0.99, 0])), C = x * R;
    return amtPart(c.w + ' ' + c.s(x) + '. The exchange rate is ' + t('1\\text{ ' + c.k + '}=' + R + '\\text{ CAD}') + '. What is the cost in Canadian dollars?', C, { after: 'CAD',
      diag: [{ v: x / R, code: 'u1t-divided', hint: 'The rate starts with ' + c.k + ', the currency you have: <b>multiply</b>. The Canadian number should be bigger.' }],
      sol: 'The rate starts with ' + c.k + ' (the currency you have): multiply.<br>' + t(N(x) + '\\times ' + R + toM(C)) + ' CAD', hints: ['1 ' + c.k + ' = ' + R + ' CAD: each one costs $' + R + ' Canadian.'], text: c.k + ' to CAD' });
  }
  function bShared(r) { var B = r.pick(A.BOARDS), f = r.pick(['EUR', 'GBP', 'USD', 'MXN']); return { B: B, f: f, list: f === 'USD' ? ['USD', 'EUR'] : ['USD', f] }; }
  function bStem(s) { return 'A bank in Edmonton shows these rates, in Canadian dollars for 1 unit of each currency.' + A.boardHtml(s.B, s.list); }
  function rS(x) { return x < 1 ? x.toFixed(3) : x.toFixed(2); }
  function l10q2(r, s) {
    var f = s.f, C = A.CUR[f], B = s.B[f], p = person(r), Y = f === 'MXN' ? pickR(r, [200, 600, 50]) : pickR(r, [300, 1200, 50]), x = Y / B[1], dp = f === 'MXN' ? 0 : 2;
    var trip = { EUR: 'a trip to Spain', GBP: 'a trip to Scotland', USD: 'a trip to Las Vegas', MXN: 'a trip to Puerto Vallarta' }[f];
    return amtPart(p.n + ' changes ' + MM(Y) + ' CAD into ' + C.pl + ' at this bank for ' + trip + '. How many ' + C.pl + ' does ' + p.he + ' get?' + (dp === 0 ? ' (Round down to a whole peso.)' : f !== 'USD' ? ' (Round to 2 decimal places.)' : ''), dp === 0 ? Math.floor(x + 1e-9) : x, { dp: dp, plain: f !== 'USD', after: f, diag2: null,
      diag: (dp === 0 && Math.round(x) !== Math.floor(x + 1e-9) ? [{ v: Math.round(x), code: 'u1t-round-dir', hint: 'The bank gives whole pesos only: round <b>down</b>.' }] : []).concat([{ v: Y / B[0], code: 'u1t-buy-rate', hint: 'The bank is <b>selling</b> ' + C.pl + ' to ' + p.him + ': use the “We sell” rate, ' + t(rS(B[1])) + '.' }, { v: Y * B[1], code: 'u1t-multiplied', hint: 'The rate starts with ' + f + ', the currency ' + p.he + ' <b>wants</b>: divide.' }, { v: Y * B[0], code: 'u1t-multiplied', hint: 'Divide by the selling rate.' }]),
      sol: br(['The bank sells ' + C.pl + ' at ' + t(rS(B[1])) + '. Canadian to ' + f + ': divide.', t(N(Y) + '\\div ' + rS(B[1]) + (f === 'USD' ? toM(x) : dp ? toN(x, 2) : '=' + raw5(x))) + (dp ? '' : ', so ' + t(N(Math.floor(x + 1e-9)))) + ' ' + C.pl]), hints: ['Buying foreign cash: the bank <b>sells</b> it to you.', '1 ' + f + ' = ' + rS(B[1]) + ' CAD starts with the currency you want, so divide.'], text: 'CAD into ' + f });
  }
  function l10q3(r, s) {
    var f = s.f, C = A.CUR[f], B = s.B[f], p = person(r), n = f === 'MXN' ? pickR(r, [300, 1500, 50]) : f === 'USD' ? pickR(r, [40, 180, 5]) : pickR(r, [20, 120, 5]), x = n * B[0];
    return amtPart(p.n + ' comes home from a trip with ' + C.w(n) + ' and sells them back to this bank. How much does ' + p.he + ' get in Canadian dollars?', x, { after: 'CAD',
      diag: [{ v: n * B[1], code: 'u1t-sell-rate', hint: 'The bank is <b>buying</b> the ' + C.pl + ' back: use the “We buy” rate, ' + t(rS(B[0])) + '.' }, { v: n / B[0], code: 'u1t-divided', hint: 'The rate is CAD for 1 ' + f + ': multiply.' }, { v: n * (B[1] - B[0]), code: 'u1x-gave-loss', hint: 'That’s what ' + p.he + ' loses on the exchange. The question asks what ' + p.he + ' gets.' }],
      sol: br(['The bank buys ' + C.pl + ' at ' + t(rS(B[0])) + '.', t(N(n) + '\\times ' + rS(B[0]) + toM(x)) + ' CAD']), hints: ['Selling foreign cash back: the bank <b>buys</b> it from you.', 'Multiply by the buying rate.'], text: 'sell ' + f + ' back' });
  }
  function l10q4(r) {
    var cur = r.pick([{ k: 'EUR', w: 'euros', b: [1.56, 1.62], n: [150, 600, 50], trip: 'a trip to Portugal' }, { k: 'USD', w: 'US dollars', b: [1.40, 1.44], n: [200, 900, 50], trip: 'a trip to Florida' }, { k: 'GBP', w: 'British pounds', b: [1.81, 1.86], n: [100, 450, 50], trip: 'a trip to Ireland' }]);
    var s = find(function () { var bank = q(r.int(Math.round(cur.b[0] * 100), Math.round(cur.b[1] * 100)) / 100), kiosk = q(bank - r.int(1, 4) / 100), fee = q(r.int(5, 14) + 0.95), n = pickR(r, cur.n); return { bank: bank, kiosk: kiosk, fee: fee, n: n, cb: n * bank, ck: n * kiosk + fee }; },
      function (s) { return Math.abs(r2(s.cb) - r2(s.ck)) >= 0.5; });
    var bankCheap = s.cb < s.ck, diff = r2(Math.abs(s.cb - s.ck)), p = person(r);
    return whichAmtPart(p.n + ' needs ' + t(N(s.n)) + ' ' + cur.w + ' for ' + cur.trip + '.<br><b>Bank:</b> ' + t('1\\text{ ' + cur.k + '}=' + s.bank.toFixed(2) + '\\text{ CAD}') + ', no fee.<br><b>Airport kiosk:</b> ' + t('1\\text{ ' + cur.k + '}=' + s.kiosk.toFixed(2) + '\\text{ CAD}') + ', plus a ' + MM(s.fee) + ' fee.<br>Which is cheaper, and by how much?', { amt: diff,
      whichLabel: 'Cheaper (bank or kiosk):', ph: 'bank or kiosk', right: bankCheap ? ['bank'] : ['kiosk', 'airport'], wrongs: bankCheap ? ['kiosk', 'airport'] : ['bank'], rightKey: bankCheap ? 'bank' : 'kiosk', wrongKey: bankCheap ? 'kiosk' : 'bank',
      why: 'Find the total cost at each place (include the fee), then compare.', nudge: 'type bank or kiosk.',
      diag: [{ v: Math.abs(s.cb - s.n * s.kiosk), code: 'u1x-kiosk-nofee', hint: 'Add the ' + MM(s.fee) + ' fee to the kiosk’s cost.' }, { v: Math.min(s.cb, s.ck), code: 'u1x-kiosk-total', hint: 'That’s the cheaper total. Subtract the two totals.' }],
      sol: br(['Bank: ' + t(N(s.n) + '\\times ' + s.bank.toFixed(2) + toM(s.cb)), 'Kiosk: ' + t(N(s.n) + '\\times ' + s.kiosk.toFixed(2) + '+' + Mt(s.fee) + toM(s.ck)), t(Mt(Math.max(s.cb, s.ck)) + '-' + Mt(Math.min(s.cb, s.ck)) + '=' + Mt(diff)), 'The <b>' + (bankCheap ? 'bank' : 'kiosk') + '</b> is cheaper by ' + MM(diff) + '.']),
      hints: ['Cost = number of ' + cur.w + ' × rate (+ the fee at the kiosk).', 'Compare the two totals and subtract.'], text: 'bank or kiosk' });
  }
  HW.defineExit({ lesson: 'u1l10', outcome: 'N1', calc: true, blurb: 'Currency exchange: a foreign price in CAD, buying and selling foreign cash at a bank, and the bank or the airport kiosk.',
    questions: [Q(1, 'N1', 'BEG', l10q1, 'Foreign price to CAD'), { num: '2', outcome: 'N1', text: 'Bank board: CAD into foreign cash, and selling it back', shared: bShared, stem: bStem, parts: [{ id: '2a', outcome: 'N1', level: 'PRG', make: l10q2 }, { id: '2b', outcome: 'N1', level: 'PRG', make: l10q3 }] },
      Q(3, 'N1', 'MAS', l10q4, 'Bank or airport kiosk')] });
})(window);
