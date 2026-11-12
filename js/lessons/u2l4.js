/* Math 10-3 · Unit 2 · Lesson 4 — Piecework and Contracts (N2)
 * Assignment 4 (u2_l04.tex, Questions 1–17) and the Lesson 4 Extra Practice (u2_ep04.tex, A 1–4, B 5–11, C 12–14).
 * NEEDS js/lessons/u1l7.js (HW.pctKit: money / percent checkers, fill-in tables) and js/lessons/u2l3.js (HW.u2ot: money,
 * number and labelled-box builders with recognised-mistake lists, word-answer boxes) loaded first.
 * Every part is a generator: the same kind of piece rate (cents per tree or word, dollars per item), the same contract
 * (materials, helpers, the contractor's hours, a percent profit, a percent price cut) and the same steps as the booklet
 * item, with new numbers (the booklet's own numbers are among the possible values; the lesson's worked-example numbers
 * are left out). Calculator allowed. Money to the cent ("$12.49", "12.49", "12.490"; 12.4 or 12.488 for 12.49 get a
 * nudge, no try used; rounding the wrong way is wrong with a hint); hours and percents to one decimal place where the
 * booklet says so; "how many pieces to earn at least…" must be rounded UP to a whole number.
 * Recognised mistakes get their own hint: dividing instead of multiplying (or the other way), adding the rate and the
 * number of pieces, the decimal point in the wrong place, pay ÷ hours turned upside down, pieces per hour given for
 * pay per hour, rounding the number of pieces down, the contract price divided by the hours without taking off the
 * materials or the helpers, one helper instead of two, the helper's hours added to the contractor's, the profit percent
 * added as dollars, the percent drop in earnings taken to be the same as the percent cut in price…
 * Conversions: "how is each worker paid?" → a tap grid (one row per worker, one column per way of being paid); the
 * piecework pay table → the table input (given cells shown, blanks as boxes); "which way pays more, and by how much?"
 * → a word box (hourly / contract) + a money box; "explain", "what could she write in her contract?", "which would you
 * choose?", the finish-the-sentence items and "how does an estimate show it is wrong?" → multiple choice whose options
 * are reasons (one right); "is it at least minimum wage?" → true / false; Question 14(c) → a percent box (c i) and a
 * reason multiple choice (c ii).
 * Outcome N2. Levels: LIM BEG EMG PRG ADV MAS (MAS: Question 14(c i) and Extra 13(c)). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, PK = HW.pctKit, U = HW.u2ot;
  if (!PK || !PK.money) throw new Error('u2l4 needs HW.pctKit: load js/lessons/u1l7.js before js/lessons/u2l4.js');
  if (!U || !U.fPart) throw new Error('u2l4 needs HW.u2ot: load js/lessons/u2l3.js before js/lessons/u2l4.js');
  var r2 = PK.r2, rnd = PK.rnd, dS = PK.dS, m$ = PK.m$, M = PK.M, near = PK.near, find = PK.find, eqM = PK.eqM;
  var q = U.q, sum = U.sum, mT = U.mT, sol = U.sol, cents = U.cents, person = U.person, people = U.people, mPart = U.mPart, nPart = U.nPart, fPart = U.fPart, clean = U.clean;

  /* ================= helpers ================= */
  function N(x) { var s0 = dS(q(x)); return Math.abs(x) >= 10000 ? HW.fmt(s0) : s0; }     // 1875 (as the booklet); 13\,400 in LaTeX
  function bigM(x) { var s0 = m$(x); return x >= 10000 ? HW.fmt(s0) : s0; }              // 15\,000.00 (LaTeX, no $)
  function an(n) { var s = String(n); return /^8/.test(s) || /^1[18]$/.test(s) || /^1[18]\d\d$/.test(s) ? 'an' : 'a'; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function MIN() { return 15; }                                                           // Alberta minimum wage (2026)
  /* pay = rate × pieces: the usual mistakes */
  function pieceList(n, rate) {
    return [[q(n / rate), 'u2l4-divided', 'Multiply the number of pieces by the piece rate; don’t divide.'], [q(rate / n), 'u2l4-divided', 'Multiply: pieces × rate.'],
      [q(n + rate), 'u2l4-added', 'Multiply the number of pieces by the rate; don’t add them.'], [q(n * rate * 10), 'u2l4-decimal', 'Check the decimal point. Estimate: about ' + N(n) + ' at ' + t(M(rate)) + ' each.'], [q(n * rate / 10), 'u2l4-decimal', 'Check the decimal point. Estimate first.']];
  }
  function piecePart(prompt, n, rate, text) {
    var pay = q(n * rate);
    return mPart(prompt, pay, pieceList(n, rate), t(N(n) + '\\times ' + M(rate) + eqM(pay)), ['Piecework pay = piece rate × number of pieces.'], text || 'piece pay');
  }
  /* effective hourly rate = pay ÷ hours */
  function effList(pay, h, n) {
    var L = [[q(h / pay), 'u2l4-rate-flip', 'Divide the pay by the hours: pay ÷ hours.'], [q(pay * h), 'u2l4-mult', 'Divide the pay by the hours; don’t multiply.']];
    if (n) { L.push([q(n / h), 'u2l4-pieces-per-h', 'That’s the number of pieces per hour. Divide the <b>pay</b> by the hours.']); L.push([q(pay / n), 'u2l4-per-piece', 'That’s the pay per piece. Divide the pay by the <b>hours</b>.']); }
    return L;
  }
  /* "how many pieces to earn at least $goal": round UP */
  function upChk(goal, rate) {
    var x = goal / rate, n = Math.ceil(x - 1e-9), f = Math.floor(x + 1e-9);
    return function (resp) {
      var a = PK.readV(resp);
      if (!a.ok) return form(a.code === 'empty' ? 'empty' : 'notnumber', a.code === 'empty' ? 'Type your answer first.' : 'Enter a single number.');
      if (near(a.v, n)) return a.unit ? form('units', 'Leave the unit out — just type the number.') : ok();
      if (near(a.v, f)) return wrong('u2l4-round-down', t(N(f)) + ' pieces pay ' + t(M(f * rate)) + ', which is less than ' + t(M(goal)) + '. Round <b>up</b>.');
      if (a.v > f - 1 && a.v < n + 1 && !near(a.v, Math.round(a.v))) return wrong('u2l4-part-piece', 'You can’t be paid for part of a piece. Round to a whole number, and round <b>up</b> so the pay reaches ' + t(M(goal)) + '.');
      if (near(a.v, r2(goal * rate)) || near(a.v, goal * rate)) return wrong('u2l4-mult', 'To find the number of pieces, divide the pay by the piece rate.');
      if (near(a.v, Math.round(rate / goal * 1e6) / 1e6)) return wrong('u2l4-divided', 'Divide the pay by the rate (pay ÷ rate), not the rate by the pay.');
      return wrong('value', null);
    };
  }
  function upPart(prompt, goal, rate, what, text) {
    var x = goal / rate, n = Math.ceil(x - 1e-9), f = Math.floor(x + 1e-9);
    var p = { prompt: prompt, input: { type: 'number', after: what }, check: upChk(goal, rate), key: String(n), answer: t(N(n)) + ' ' + what, solution: sol([t(M(goal) + '\\div ' + M(rate) + '=' + dS(rnd(x, 2)) + '\\ldots'), 'Round up: ' + t(N(n)) + ' ' + what, 'Check: ' + t(N(n) + '\\times ' + M(rate) + '=' + M(n * rate)) + ' ✓ &nbsp;(' + t(N(f) + '\\times ' + M(rate) + '=' + M(f * rate)) + ' is short.)']),
      hints: ['pieces = pay ÷ rate.', 'You can’t be paid for part of a piece, and rounding down leaves you short. Round up.'], text: text || 'round up' };
    p.bad = [String(f), dS(rnd(x, 2))];
    return p;
  }
  /* contractor's earnings / effective rate mistakes */
  function earnList(P, mat, help) {
    var L = [[q(P - mat), 'u2l4-no-helper', 'Take off the helper’s wages too.'], [q(P - help), 'u2l4-no-materials', 'Take off the materials too.'], [q(P - mat + help), 'u2l4-added-cost', 'The helper’s wages are a cost: subtract them.'], [q(P + mat + help), 'u2l4-added-cost', 'Subtract the costs from the contract price.']];
    if (!help) L = [[q(P + mat), 'u2l4-added-cost', 'Subtract the materials from the contract price.'], [P, 'u2l4-no-materials', 'The materials come out of the contract price. Subtract them.']];
    return L;
  }
  function rateList(P, mat, help, H, hh) {
    var E = q(P - mat - help), L = [[q(P / H), 'u2l4-no-costs', 'Subtract all the costs <b>before</b> you divide by the hours. The contract price is not all ' + 'the contractor’s.'], [q((P - mat) / H), 'u2l4-no-helper', 'Take off the helper’s wages too, then divide.'], [q((P - help) / H), 'u2l4-no-materials', 'Take off the materials too, then divide.'], [E, 'u2l4-earn-not-rate', 'That’s the earnings for the whole job. Divide by the hours.'], [q(H / E), 'u2l4-rate-flip', 'Divide the earnings by the hours, not the hours by the earnings.'], [q((P + mat) / H), 'u2l4-added-cost', 'Subtract the materials; don’t add them.']];
    if (hh) L.push([q(E / (H + hh)), 'u2l4-helper-hours', 'Use only the contractor’s own hours (' + dS(H) + ' h). The helper’s hours are already paid for.']);
    return L;
  }

  HW.u2piece = { pieceList: pieceList, piecePart: piecePart, effList: effList, upChk: upChk, upPart: upPart, earnList: earnList, rateList: rateList, N: N };

  HW.addCodes({
    'u2l4-divided': 'Divided instead of multiplying (or the wrong way round)', 'u2l4-added': 'Added the rate and the number of pieces', 'u2l4-decimal': 'Decimal point in the wrong place', 'u2l4-rate-flip': 'Divided hours ÷ pay',
    'u2l4-mult': 'Multiplied instead of dividing', 'u2l4-pieces-per-h': 'Gave pieces per hour, not pay per hour', 'u2l4-per-piece': 'Gave pay per piece, not pay per hour', 'u2l4-round-down': 'Rounded the number of pieces down',
    'u2l4-part-piece': 'Left part of a piece (not a whole number)', 'u2l4-no-helper': 'Didn’t subtract the helpers’ wages', 'u2l4-no-materials': 'Didn’t subtract the materials', 'u2l4-added-cost': 'Added a cost instead of subtracting',
    'u2l4-no-costs': 'Divided the contract price by the hours without taking off the costs', 'u2l4-earn-not-rate': 'Gave the earnings, not the hourly rate', 'u2l4-helper-hours': 'Added the helper’s hours to the contractor’s',
    'u2l4-one-helper': 'Paid one helper instead of all of them', 'u2l4-no-own': 'Bid left out the contractor’s own pay', 'u2l4-no-hours': 'Helper’s wage not multiplied by the hours', 'u2l4-round-bid': 'Bid rounded the wrong way',
    'u2l4-pct-dollars': 'Added the percent number as dollars', 'u2l4-pct-no-div': 'Percent not changed to a decimal', 'u2l4-profit-only': 'Gave the profit instead of the bid', 'u2l4-bid-for-profit': 'Gave the bid instead of the profit',
    'u2l4-old-cost': 'Used the old costs', 'u2l4-extra-cost': 'Gave the extra cost, not the new profit', 'u2l4-minwage-total': 'Gave the minimum pay, not the amount added', 'u2l4-gap-per-hour': 'Gave the gap per hour, not for all the hours',
    'u2l4-diff-total': 'Gave one of the amounts instead of the difference', 'u2l4-wrong-way': 'Picked the way that pays less', 'u2l4-same-pct': 'Assumed earnings drop by the same percent as the price',
    'u2l4-div-new': 'Percent change: divided by the new amount', 'u2l4-dollars': 'Gave dollars instead of a percent', 'u2l4-ratio': 'Gave new ÷ old instead of the percent change', 'u2l4-cut-dollars': 'Price cut worked wrong',
    'u2l4-div-costs': 'Percent: divided by the costs instead of the money taken in', 'u2l4-costs-pct': 'Gave the costs as a percent, not the profit', 'u2l4-camp-once': 'Camp fee taken off once, not for each day', 'u2l4-one-day': 'Used one day instead of all the days',
    'u2l4-no-fee': 'Didn’t take off the camp fee', 'u2l4-only-own': 'Lowest price: left out the costs', 'u2l4-no-pieces': 'Left out the number of pieces', 'u2l4-one-size': 'Left out one kind of piece', 'u2l4-all-one-rate': 'Used one rate for every kind of piece'
  });
  HW.addPartial({
    'u2l4-divided': 'n', 'u2l4-added': 'n', 'u2l4-decimal': 'b', 'u2l4-rate-flip': 'n', 'u2l4-mult': 'n', 'u2l4-pieces-per-h': 'n', 'u2l4-per-piece': 'n', 'u2l4-round-down': 's', 'u2l4-part-piece': 's',
    'u2l4-no-helper': 'b', 'u2l4-no-materials': 'b', 'u2l4-added-cost': 'n', 'u2l4-no-costs': 'n', 'u2l4-earn-not-rate': 's', 'u2l4-helper-hours': 'b', 'u2l4-one-helper': 'b', 'u2l4-no-own': 'b', 'u2l4-no-hours': 'b',
    'u2l4-round-bid': 's', 'u2l4-pct-dollars': 'n', 'u2l4-pct-no-div': 'b', 'u2l4-profit-only': 's', 'u2l4-bid-for-profit': 's', 'u2l4-old-cost': 'b', 'u2l4-extra-cost': 'b', 'u2l4-minwage-total': 's', 'u2l4-gap-per-hour': 'b',
    'u2l4-diff-total': 's', 'u2l4-wrong-way': 'n', 'u2l4-same-pct': 'n', 'u2l4-div-new': 'b', 'u2l4-dollars': 'b', 'u2l4-ratio': 'b', 'u2l4-cut-dollars': 'b', 'u2l4-div-costs': 'b', 'u2l4-costs-pct': 'b',
    'u2l4-camp-once': 'b', 'u2l4-one-day': 'b', 'u2l4-no-fee': 'b', 'u2l4-only-own': 'b', 'u2l4-no-pieces': 'b', 'u2l4-one-size': 's', 'u2l4-all-one-rate': 'n'
  });

  /* ================= Lesson 4 generators ================= */
  /* Question 1: how is each worker paid? */
  var PAY = {
    contract: [function (r) { return 'a roofer who agrees to re-shingle a house for ' + t(M(r.int(70, 120) * 100)); }, function (r) { return 'a web designer who builds a website for ' + t(M(r.int(8, 25) * 100)); }, function () { return 'a painter who paints a whole house for one set price'; },
      function (r) { return 'a landscaper paid ' + t(M(r.int(20, 45) * 100)) + ' to build a patio'; }, function (r) { return 'a plumber who agrees to redo a bathroom for ' + t(M(r.int(40, 90) * 100)); }],
    hourly: [function () { return 'a grocery store cashier'; }, function () { return 'a line cook at a diner'; }, function () { return 'a lifeguard at a city pool'; }, function () { return 'a gas station attendant'; }, function () { return 'a labourer paid ' + t('\\$18.00') + ' for each hour worked'; }],
    piece: [function (r) { return 'a worker paid ' + t(M(r.pick([0.04, 0.05, 0.06, 0.07]))) + ' for each flyer delivered'; }, function () { return 'a cherry picker paid by the bucket'; }, function () { return 'a tree planter paid for each seedling planted'; }, function () { return 'a sewing worker paid for each bag sewn'; }, function (r) { return 'a writer paid ' + t(M(r.pick([0.1, 0.15, 0.2, 0.08]))) + ' per word'; }],
    salary: [function () { return 'a school principal'; }, function (r) { return 'a nurse paid ' + t(M(r.int(80, 98) * 1000)) + ' a year'; }, function () { return 'an office manager'; }, function () { return 'a high school teacher'; }, function (r) { return 'a bank manager paid ' + t(M(r.int(70, 110) * 1000)) + ' per year'; }]
  };
  var PAYCOL = [{ id: 'hourly', html: 'hourly wage' }, { id: 'salary', html: 'salary' }, { id: 'piece', html: 'piecework' }, { id: 'contract', html: 'contract' }];
  var PAYWHY = { hourly: 'paid for each hour worked: an <b>hourly wage</b>.', salary: 'paid a set amount per year: a <b>salary</b>.', piece: 'paid for each piece or task finished: <b>piecework</b>.', contract: 'paid one set price for the whole job: a <b>contract</b>.' };
  function payGrid(r) {
    var used = {}, rows = [], want = {};
    var kinds = r.shuffle(['contract', 'hourly', 'piece', 'salary'].concat(r.sample(['contract', 'piece', 'hourly', 'salary', 'contract', 'piece'], 2)));
    kinds.forEach(function (k, i) {
      var pool = PAY[k], j = find(function () { return r.int(0, pool.length - 1); }, function (x) { return !used[k + x]; }, 0); used[k + j] = 1;
      var id = String.fromCharCode(97 + i); rows.push({ id: id, html: '(' + id + ') ' + pool[j](r) }); want[id] = k;
    });
    var byId = {}; rows.forEach(function (x) { byId[x.id] = x; });
    return K.P.grid('How is each worker most likely paid? Tap one box in each row.', rows, PAYCOL, want, {
      rowHead: 'Worker', why: function (id, got, w) { return { code: 'u2l4-pay-kind', hint: 'Check (' + id + '): this worker is ' + PAYWHY[w] }; } },
      rows.map(function (x) { return x.html + ': <b>' + PAYCOL.filter(function (c) { return c.id === want[x.id]; })[0].html + '</b>'; }).join('<br>'),
      ['Hourly wage: for each hour. Salary: a set amount per year. Piecework: for each piece or task. Contract: one set price for a whole job.'], 'pay kinds');
  }
  HW.addCodes({ 'u2l4-pay-kind': 'Way of being paid: wrong kind' });
  HW.addPartial({ 'u2l4-pay-kind': 's' });
  /* Question 3: a piecework pay table */
  var REPAIRS = [['Fix a flat tire', 10, 15, 1], ['Tune-up', 40, 60, 5], ['Adjust brakes', 15, 25, 1], ['Replace a chain', 20, 30, 5], ['True a wheel', 15, 25, 5], ['Install a bike rack', 25, 35, 5]];
  function repairTable(r) {
    var it = [REPAIRS[0]].concat(r.sample(REPAIRS.slice(1), 2)).map(function (x) { return { name: x[0], rate: x[1] + x[3] * r.int(0, Math.floor((x[2] - x[1]) / x[3])), n: r.int(2, 10) }; });
    var pays = it.map(function (x) { return q(x.rate * x.n); }), tot = sum(pays), rows = it.map(function (x) { return '\\text{' + x.name + '}'; }).concat(['\\textbf{Total for Saturday}']), cols = ['\\text{Rate}', '\\text{Number}', '\\text{Pay}'];
    var blanks = it.map(function (x, i) { return { where: 'cell', i: i, j: 2, name: x.name, chk: U.money(pays[i], [[x.rate, 'u2l4-no-pieces', 'Multiply the rate by the number of repairs: ' + t(M(x.rate) + '\\times ' + x.n) + '.'], [q(x.rate + x.n), 'u2l4-added', 'Multiply the rate by the number; don’t add.']]) }; });
    blanks.push({ where: 'cell', i: 3, j: 2, name: 'Total', chk: U.money(tot, [[sum(it.map(function (x) { return x.rate; })), 'u2l4-no-pieces', 'Add the <b>Pay</b> column.']]) });
    return PK.tablePart('Ravi works at a bike shop on Saturdays and is paid for each repair he finishes. Complete the table.', { rows: rows, cols: cols, cells: it.map(function (x) { return [M(x.rate), String(x.n), null]; }).concat([['', '', null]]), corner: '\\text{Repair}', keys: 'pctkit-money', help: 'Tap a box, then type the amount (no $ needed).' },
      PK.tableChk(blanks), { rows: rows, cols: cols, cells: it.map(function (x, i) { return [M(x.rate), String(x.n), m$(pays[i])]; }).concat([['', '', m$(tot)]]) },
      sol(it.map(function (x, i) { return t(M(x.rate) + '\\times ' + x.n + '=' + M(pays[i])); }).concat(['total ' + t('=' + pays.map(function (p) { return M(p); }).join('+') + '=' + M(tot))])), ['Pay = rate × number of repairs.', 'Total = the sum of the Pay column.'], 'bike table');
  }
  /* pay and effective hourly rate boxes */
  function payRateRows(n, rate, h) {
    var pay = q(n * rate), e = q(pay / h);
    return [{ label: 'Pay:', name: 'Pay', kind: 'money', ans: pay, list: pieceList(n, rate) }, { label: 'Per hour:', name: 'Effective hourly rate', kind: 'money', after: '/h', ans: e, list: effList(pay, h, n) }];
  }
  function payRateSol(n, rate, h) { var pay = q(n * rate); return ['Pay: ' + t(n + '\\times ' + M(rate) + '=' + M(pay)), 'Per hour: ' + t(M(pay) + '\\div ' + dS(h) + eqM(pay / h))]; }
  /* "which way pays more, and by how much?" */
  function wayRows(hourly, contract) {
    var more = contract > hourly ? 'contract' : 'hourly';
    return [{ label: 'Pays more:', name: 'Which way', kind: 'text', placeholder: 'hourly or contract', key: more, show: more === 'contract' ? 'the contract' : 'hourly', nudge: 'Type hourly or contract.',
      opts: [{ words: ['contract', 'contractprice', 'thecontract'], right: more === 'contract', code: 'u2l4-wrong-way', hint: 'Compare: hourly ' + t(M(hourly)) + ', contract (after materials) ' + t(M(contract)) + '.' }, { words: ['hourly', 'hour', 'hourlywage', 'hourlyrate', 'perhour', 'wage'], right: more === 'hourly', code: 'u2l4-wrong-way', hint: 'Compare: hourly ' + t(M(hourly)) + ', contract (after materials) ' + t(M(contract)) + '.' }] },
      { label: 'by', name: 'How much', kind: 'money', ans: q(Math.abs(hourly - contract)), list: [[hourly, 'u2l4-diff-total', 'That’s the hourly pay. Subtract to find the difference.'], [contract, 'u2l4-diff-total', 'That’s the contract earnings. Subtract to find the difference.']] }];
  }
  function breakEven(prompt, earn, w, C, m, text) {
    var x = earn / w;
    return nPart(prompt, x, 1, [[q(C / w), 'u2l4-no-materials', 'Use what the contract really pays after the materials: ' + t(M(C) + '-' + M(m)) + '.'], [q(w / earn), 'u2l4-rate-flip', 'hours = pay ÷ hourly rate.'], [q((C + m) / w), 'u2l4-added-cost', 'Subtract the materials from the contract price.'], [q(earn * w), 'u2l4-mult', 'Divide the pay by the hourly rate.']],
      sol(['hours ' + t('=') + ' pay ' + t('\\div') + ' rate', t(M(earn) + '\\div ' + M(w) + '=' + dS(rnd(x, 4)) + (near(x, rnd(x, 4)) ? '' : '\\ldots') + '\\approx ' + rnd(x, 1).toFixed(1)) + ' hours', 'If the job takes less time, the contract is better; if it takes more, the hourly rate is better.']),
      ['The two pay the same when hourly rate × hours = what the contract pays after materials.', 'hours = (contract − materials) ÷ hourly rate. Round to one decimal place.'], text || 'break-even');
  }

  HW.defineLesson({
    id: 'u2l4', unit: 2, num: '4', title: 'Piecework and Contracts', outcome: 'N2',
    blurb: 'Piecework pay, effective hourly rate and minimum wage, working backwards with piece rates, contractors’ earnings, bids, and comparing ways to be paid.',
    questions: [
      { num: '1', stem: '', parts: [{ id: '1', level: 'BEG', make: function (r) { return payGrid(r); } }] },
      { num: '2', stem: 'Find each worker’s pay.', parts: [
        { id: '2a', level: 'LIM', make: function (r) { var p = person(r), it = r.pick([['solders', 'circuit boards'], ['assembles', 'lamp kits'], ['sews', 'dog collars'], ['packs', 'gift boxes']]), n = r.int(24, 48), rate = cents(r, 2.25, 3.75, 25); return piecePart(p.n + ' ' + it[0] + ' ' + n + ' ' + it[1] + ' at ' + t(M(rate)) + ' each.', n, rate, 'pieces each'); } },
        { id: '2b', level: 'BEG', make: function (r) { var v = find(function () { return [25 * r.int(60, 96), cents(r, 0.14, 0.22, 1)]; }, function (v) { return !(v[0] === 2350 && near(v[1], 0.16)); }, [1875, 0.17]), p = person(r); return piecePart(p.n + ' plants ' + N(v[0]) + ' trees at ' + t(M(v[1])) + ' per tree.', v[0], v[1], 'trees'); } },
        { id: '2c', level: 'LIM', make: function (r) { var p = person(r), it = r.pick([['lugs of cherries', 'lug'], ['buckets of apples', 'bucket'], ['crates of peaches', 'crate']]), n = r.int(10, 20), rate = cents(r, 5.5, 7.5, 25); return piecePart(p.n + ' picks ' + n + ' ' + it[0] + ' at ' + t(M(rate)) + ' per ' + it[1] + '.', n, rate, 'picker'); } },
        { id: '2d', level: 'BEG', make: function (r) { var p = person(r), n = 50 * r.int(12, 24), rate = cents(r, 0.1, 0.2, 1); return piecePart(p.n + ' writes ' + an(n) + ' ' + n + '-word article at ' + t(M(rate)) + ' per word.', n, rate, 'words'); } }] },
      { num: '3', stem: '', parts: [{ id: '3', level: 'BEG', make: function (r) { return repairTable(r); } }] },
      { num: '4', stem: function (sh) { return sh.p.n + ' sews tote bags for a craft company. ' + sh.p.He + ' is paid ' + t(M(sh.rate)) + ' for each bag.'; },
        shared: function (r) { return find(function () { var rate = cents(r, 6.25, 8.5, 25), h = r.pick([7.5, 8, 7]), n1 = r.int(14, 30), n2 = r.int(8, 18); return { p: person(r), rate: rate, h: h, n1: n1, n2: n2 }; },
          function (s) { var e1 = s.n1 * s.rate / s.h, e2 = s.n2 * s.rate / s.h; return e1 >= 17 && e1 <= 26 && e2 >= 10 && e2 <= 14.5; }, { p: person(r), rate: 7.25, h: 7.5, n1: 22, n2: 14 }); },
        parts: [
          { id: '4a', level: 'EMG', make: function (r, sh) { return fPart('On Monday ' + sh.p.he + ' sews ' + sh.n1 + ' bags in ' + dS(sh.h) + ' hours. Find ' + sh.p.his + ' pay and ' + sh.p.his + ' effective hourly rate.', payRateRows(sh.n1, sh.rate, sh.h), sol(payRateSol(sh.n1, sh.rate, sh.h)), ['Pay = rate × bags.', 'Effective hourly rate = pay ÷ hours.'], 'Sofia Mon'); } },
          { id: '4b', level: 'EMG', make: function (r, sh) { return fPart('On Tuesday ' + sh.p.his + ' machine breaks for part of the day, and ' + sh.p.he + ' sews only ' + sh.n2 + ' bags in ' + dS(sh.h) + ' hours. Find ' + sh.p.his + ' pay and ' + sh.p.his + ' effective hourly rate.', payRateRows(sh.n2, sh.rate, sh.h), sol(payRateSol(sh.n2, sh.rate, sh.h)), ['Pay = rate × bags.', 'Effective hourly rate = pay ÷ hours.'], 'Sofia Tue'); } },
          { id: '4c', level: 'PRG', make: function (r, sh) { var pay = q(sh.n2 * sh.rate), mn = q(sh.h * MIN()), add = q(mn - pay);
            return mPart('Alberta’s minimum wage is ' + t('\\$15.00') + ' per hour. How much must the company add to ' + sh.p.n + '’s Tuesday pay?', add, [[mn, 'u2l4-minwage-total', 'That’s the minimum pay for ' + dS(sh.h) + ' hours. Subtract what ' + sh.p.he + ' earned, ' + t(M(pay)) + '.'], [q(MIN() - pay / sh.h), 'u2l4-gap-per-hour', 'That’s the gap for one hour. The company tops up all ' + dS(sh.h) + ' hours: minimum pay − ' + sh.p.his + ' pay.'], [q(MIN() - r2(pay / sh.h)), 'u2l4-gap-per-hour', 'That’s the gap for one hour. Find the minimum pay for ' + dS(sh.h) + ' hours, then subtract.'], [pay, 'u2l4-minwage-total', 'That’s ' + sh.p.his + ' pay. Subtract it from the minimum pay.']],
              sol(['Minimum: ' + t(dS(sh.h) + '\\times \\$15.00=' + M(mn)), 'The company adds ' + t(M(mn) + '-' + M(pay) + '=' + M(add)) + '.']), ['Find the minimum pay for the hours worked.', 'Subtract what ' + sh.p.he + ' earned.'], 'top-up'); } }] },
      { num: '5', stem: 'Work backwards. Check each answer by multiplying.', parts: [
        { id: '5a', level: 'EMG', make: function (r) { var v = find(function () { return [r.int(20, 50), cents(r, 3, 6.5, 25)]; }, function (v) { return !(v[0] === 30 && near(v[1], 12.75)); }, [38, 4.5]), p = person(r), it = r.pick([['put together', 'gift baskets', 'basket'], ['build', 'birdhouses', 'birdhouse'], ['decorate', 'cupcake trays', 'tray'], ['frame', 'pictures', 'picture']]), pay = q(v[0] * v[1]);
          return mPart(p.n + ' is paid ' + t(M(pay)) + ' to ' + it[0] + ' ' + v[0] + ' ' + it[1] + '. What is ' + p.he + ' paid per ' + it[2] + '?', v[1], [[q(v[0] / pay), 'u2l4-divided', 'rate = pay ÷ pieces (the pay goes first).'], [q(pay * v[0]), 'u2l4-mult', 'Divide the pay by the number of ' + it[1] + '.']], sol([t(M(pay) + '\\div ' + v[0] + '=' + M(v[1])) + ' per ' + it[2], 'Check: ' + t(v[0] + '\\times ' + M(v[1]) + '=' + M(pay)) + ' ✓']), ['rate = pay ÷ pieces.'], 'back rate'); } },
        { id: '5b', level: 'EMG', make: function (r) { var v = find(function () { return [cents(r, 0.25, 0.95, 5), r.int(40, 200)]; }, function () { return true; }, [0.85, 80]), p = person(r), pay = q(v[0] * v[1]), it = r.pick([['does data entry', 'form', 'forms'], ['folds programs', 'program', 'programs'], ['labels jars', 'jar', 'jars']]);
          return nPart(p.n + ' ' + it[0] + ' for ' + t(M(v[0])) + ' per ' + it[1] + '. ' + p.He + ' earned ' + t(M(pay)) + '. How many ' + it[2] + ' did ' + p.he + ' do?', v[1], null, [[q(pay * v[0]), 'u2l4-mult', 'pieces = pay ÷ rate.'], [q(v[0] / pay), 'u2l4-divided', 'Divide the pay by the rate, not the rate by the pay.']], sol([t(M(pay) + '\\div ' + M(v[0]) + '=' + v[1]) + ' ' + it[2], 'Check: ' + t(v[1] + '\\times ' + M(v[0]) + '=' + M(pay)) + ' ✓']), ['pieces = pay ÷ rate.'], 'back pieces', { after: it[2] }); } },
        { id: '5c', level: 'PRG', make: function (r) { var v = find(function () { return [cents(r, 0.15, 0.25, 1), 50 * r.int(4, 10)]; }, function (v) { return !near(v[1] / v[0], Math.round(v[1] / v[0])); }, [0.22, 400]), p = person(r);
          return upPart(p.n + ' plants trees for ' + t(M(v[0])) + ' per tree. How many trees must ' + p.he + ' plant to earn at least ' + t(M(v[1])) + ' in a day?', v[1], v[0], 'trees', 'trees up'); } }] },
      { num: '6', stem: function (sh) { return 'A moving company pays its packers ' + t(M(sh.p)) + ' for each box they pack. It charges customers ' + t(M(sh.c)) + ' for each box packed. A packer packs ' + sh.n + ' boxes for one customer.'; },
        shared: function (r) { return { p: cents(r, 3.25, 4.5, 25), c: cents(r, 8.5, 11, 50), n: r.int(50, 120) }; },
        parts: [
          { id: '6a', level: 'BEG', make: function (r, sh) { return piecePart('How much does the packer earn?', sh.n, sh.p, 'packer'); } },
          { id: '6b', level: 'BEG', make: function (r, sh) { return piecePart('How much does the company charge the customer for packing?', sh.n, sh.c, 'charge'); } },
          { id: '6c', level: 'EMG', make: function (r, sh) { var a = q(sh.n * sh.p), b = q(sh.n * sh.c), d = q(b - a);
            return mPart('How much is left for the company’s other costs and profit?', d, [[q(sh.c - sh.p), 'u2l4-no-pieces', 'That’s what is left on one box. Multiply by the ' + sh.n + ' boxes (or subtract the two totals).'], [q(a + b), 'u2l4-added-cost', 'Subtract what the packer earns from what the company charges.'], [b, 'u2l4-diff-total', 'That’s what the company charges. Subtract the packer’s pay.'], [a, 'u2l4-diff-total', 'That’s the packer’s pay. Subtract it from what the company charges.']],
              t(M(b) + '-' + M(a) + '=' + M(d)), ['Left = what the company charges − what it pays the packer.'], 'moving left'); } }] },
      { num: '7', stem: function (sh) { return sh.p.n + ' is a ' + (sh.p.he === 'she' ? 'handywoman' : 'handyman') + '. ' + sh.p.He + ' agrees to build a backyard deck for ' + t(M(sh.P)) + '. The lumber and screws cost ' + t(M(sh.m)) + '. ' + sh.p.He + ' hires a helper for ' + sh.h + ' hours at ' + t(M(sh.w)) + ' per hour. ' + sh.p.n + ' works ' + sh.H + ' hours on the deck himself.'.replace('himself', sh.p.he === 'she' ? 'herself' : 'himself'); },
        shared: function (r) { return find(function () { var P = 100 * r.int(38, 62); return { p: person(r), P: P, m: q(Math.round(P * (0.35 + r.int(0, 15) / 100)) + r.int(1, 9) / 10), h: r.int(10, 20), w: r.int(19, 24), H: r.int(24, 40) }; }, function (s) { var E = s.P - s.m - s.h * s.w; return E > 800 && E / s.H > 30 && s.m % 1 !== 0; }, { p: person(r), P: 4800, m: 2135.6, h: 16, w: 22, H: 30 }); },
        parts: [
          { id: '7a', level: 'BEG', make: function (r, sh) { var hp = sh.h * sh.w; return mPart('How much does ' + sh.p.n + ' pay ' + sh.p.his + ' helper?', hp, [[sh.w, 'u2l4-no-hours', 'Multiply the hourly wage by the ' + sh.h + ' hours.'], [q(sh.h + sh.w), 'u2l4-added', 'Multiply the hours by the wage.']], t(sh.h + '\\times ' + M(sh.w) + '=' + M(hp)), ['Helper’s wages = hours × hourly wage.'], 'helper'); } },
          { id: '7b', level: 'EMG', make: function (r, sh) { var hp = sh.h * sh.w, E = q(sh.P - sh.m - hp); return mPart('How much does ' + sh.p.n + ' earn for ' + sh.p.him + 'self?', E, earnList(sh.P, sh.m, hp).concat([[q(sh.P - sh.m - sh.w), 'u2l4-no-hours', 'The helper’s wages are ' + t(sh.h + '\\times ' + M(sh.w)) + '.']]), t(M(sh.P) + '-' + M(sh.m) + '-' + M(hp) + '=' + M(E)), ['Earnings = contract price − materials − helper’s wages.'], 'deck earn'); } },
          { id: '7c', level: 'PRG', make: function (r, sh) { var hp = sh.h * sh.w, E = q(sh.P - sh.m - hp), e = q(E / sh.H); return mPart('What is ' + sh.p.n + '’s effective hourly rate?', e, rateList(sh.P, sh.m, hp, sh.H, sh.h), sol(['earnings ' + t('=' + M(E)), t(M(E) + '\\div ' + sh.H + eqM(e)) + ' per hour']), ['Effective hourly rate = earnings ÷ the hours ' + sh.p.he + ' worked.', 'Subtract all the costs first.'], 'deck rate', { after: '/h' }); } }] },
      { num: '8', stem: function (sh) { return sh.p.n + ' is a web designer. ' + sh.p.He + ' agrees to build a website for a ' + sh.biz + ' for ' + t(M(sh.P)) + '. ' + sh.p.He + ' has no material costs.'; },
        shared: function (r) { return { p: person(r), P: 100 * r.int(12, 24), H1: r.int(20, 30), H2: 0, biz: r.pick(['bakery', 'hair salon', 'garage', 'dance studio']), d: r.int(10, 20) }; },
        parts: [
          { id: '8a', level: 'BEG', make: function (r, sh) { var e = q(sh.P / sh.H1); return mPart(sh.p.He + ' plans for the job to take ' + sh.H1 + ' hours. What would ' + sh.p.his + ' effective hourly rate be?', e, effList(sh.P, sh.H1), t(M(sh.P) + '\\div ' + sh.H1 + eqM(e)) + ' per hour', ['Effective hourly rate = pay ÷ hours.'], 'web plan', { after: '/h' }); } },
          { id: '8b', level: 'BEG', make: function (r, sh) { var H2 = sh.H1 + sh.d, e = q(sh.P / H2); return mPart('The ' + sh.biz + ' keeps asking for changes, and the job takes ' + H2 + ' hours. What is ' + sh.p.his + ' effective hourly rate now?', e, effList(sh.P, H2).concat([[q(sh.P / sh.H1), 'u2l4-old-cost', 'Use the new number of hours, ' + H2 + '.']]), t(M(sh.P) + '\\div ' + H2 + eqM(e)) + ' per hour', ['Same pay, more hours: pay ÷ the new hours.'], 'web long', { after: '/h' }); } },
          { id: '8c', level: 'BEG', make: function (r, sh) {
            return K.P.mc(r, 'What could ' + sh.p.n + ' write in ' + sh.p.his + ' next contract to protect ' + sh.p.him + 'self?', [
              { html: 'List exactly what the price includes, and charge extra (for example, per hour) for changes after that.', right: true },
              { html: 'Promise to make as many changes as the customer wants for the same price.', why: 'That is what made the job take longer. It doesn’t protect ' + sh.p.him + '.', code: 'promise' },
              { html: 'Lower the price so the customer is happy.', why: 'A lower price means even less per hour.', code: 'lower' },
              { html: 'Be paid only after the customer has no more changes.', why: 'That lets the job go on and on, and ' + sh.p.he + ' waits longer to be paid.', code: 'wait' }],
              'For example: list exactly what the price includes, and charge extra for changes after that.', ['What made the job take longer?'], 'protect contract'); } }] },
      { num: '9', stem: function (sh) { return sh.p.n + ' is bidding on a job to build a ' + sh.what + '. The materials cost ' + t(M(sh.M)) + '. ' + sh.p.He + ' will hire 2 helpers for ' + sh.h + ' hours each at ' + t(M(sh.w)) + ' per hour. ' + sh.p.He + ' wants to earn ' + t(M(sh.E)) + ' for ' + sh.p.him + 'self.'; },
        shared: function (r) { return find(function () { return { p: person(r), M: 5 * r.int(240, 400), h: r.int(6, 12), w: r.int(19, 23), E: 50 * r.int(10, 18), what: r.pick(['wooden fence', 'shed', 'garden wall', 'set of stairs']) }; }, function (s) { var b = s.M + 2 * s.h * s.w + s.E; return b % 50 !== 0 && b % 50 >= 5; }, { p: person(r), M: 1640, h: 9, w: 21, E: 700, what: 'wooden fence' }); },
        parts: [
          { id: '9a', level: 'EMG', make: function (r, sh) { var hp = 2 * sh.h * sh.w, B = sh.M + hp + sh.E;
            return mPart('What price should ' + sh.p.he + ' bid?', B, [[sh.M + sh.h * sh.w + sh.E, 'u2l4-one-helper', 'There are 2 helpers: ' + t('2\\times ' + sh.h + '\\times ' + M(sh.w)) + '.'], [sh.M + hp, 'u2l4-no-own', 'Add the ' + t(M(sh.E)) + ' ' + sh.p.he + ' wants to earn.'], [hp + sh.E, 'u2l4-no-materials', 'Add the materials too.'], [sh.M + sh.E, 'u2l4-no-helper', 'Add the helpers’ wages too.'], [sh.M + 2 * sh.w + sh.E, 'u2l4-no-hours', 'Each helper works ' + sh.h + ' hours: ' + t('2\\times ' + sh.h + '\\times ' + M(sh.w)) + '.']],
              sol(['Helpers: ' + t('2\\times ' + sh.h + '\\times ' + M(sh.w) + '=' + M(hp)), 'Bid: ' + t(M(sh.M) + '+' + M(hp) + '+' + M(sh.E) + '=' + M(B))]), ['Bid = materials + helpers’ wages + what ' + sh.p.he + ' wants to earn.', 'Helpers’ wages = number of helpers × hours × wage.'], 'fence bid'); } },
          { id: '9b', level: 'PRG', make: function (r, sh) { var hp = 2 * sh.h * sh.w, B = sh.M + hp + sh.E, up = Math.ceil(B / 50) * 50, dn = Math.floor(B / 50) * 50, earn = sh.E + (up - B);
            return fPart(sh.p.He + ' rounds ' + sh.p.his + ' bid up to the next ' + t('\\$50.00') + '. What does ' + sh.p.he + ' bid? How much will ' + sh.p.he + ' earn then?', [
              { label: 'Bid:', name: 'Bid', kind: 'money', ans: up, list: [[dn, 'u2l4-round-bid', 'Round <b>up</b> to the next ' + t('\\$50') + '.'], [B + 50, 'u2l4-round-bid', 'Round up to the next multiple of ' + t('\\$50') + ' (a price ending in 00 or 50).']] },
              { label: 'She earns:'.replace('She', cap(sh.p.he)), name: 'Earns', kind: 'money', ans: earn, list: [[sh.E, 'u2l4-old-cost', 'The extra ' + t(M(up - B)) + ' from rounding is hers too.'.replace('hers', sh.p.he === 'she' ? 'hers' : 'his')], [up - B, 'u2l4-diff-total', 'That’s only the extra. Add it to the ' + t(M(sh.E)) + '.'], [up - sh.M, 'u2l4-no-helper', 'Take off the helpers’ wages too.']] }],
              sol([sh.p.He + ' bids ' + t(M(up)) + '.', sh.p.He + ' earns ' + t(M(sh.E) + '+' + M(up - B) + '=' + M(earn)) + ' (or ' + t(M(up) + '-' + M(sh.M) + '-' + M(hp)) + ').']), ['The next $50 above the bid (a price ending in 00 or 50).', 'Earnings = bid − materials − helpers.'], 'round bid'); } }] },
      { num: '10', stem: function (sh) { return sh.p.n + ' bids on a contract to clear snow from a strip mall parking lot for the winter. ' + sh.p.He + ' expects to pay ' + t(M(sh.a)) + ' for fuel and salt, and ' + t(M(sh.b)) + ' for a helper. ' + sh.p.He + ' adds ' + sh.pc + '% to ' + sh.p.his + ' costs for ' + sh.p.his + ' profit.'; },
        shared: function (r) { return find(function () { var a = 10 * r.int(180, 300), b = 10 * r.int(90, 150), pc = r.pick([25, 20, 30, 15, 25]); return { p: person(r), a: a, b: b, pc: pc, a2: a + 10 * r.int(30, 90) }; }, function (s) { var C = s.a + s.b, B = C * (1 + s.pc / 100); return near(B, r2(B)) && B - (s.a2 + s.b) > 50; }, { p: person(r), a: 2350, b: 1230, pc: 25, a2: 3100 }); },
        parts: [
          { id: '10a', level: 'BEG', make: function (r, sh) { var C = sh.a + sh.b; return mPart('What are ' + sh.p.his + ' total costs?', C, [[sh.a - sh.b, 'u2l4-added-cost', 'Add the two costs.']], t(M(sh.a) + '+' + M(sh.b) + '=' + M(C)), ['Add the costs.'], 'snow costs'); } },
          { id: '10b', level: 'EMG', make: function (r, sh) { var C = sh.a + sh.b, B = q(C * (1 + sh.pc / 100));
            return mPart('What is ' + sh.p.his + ' bid?', B, [[C + sh.pc, 'u2l4-pct-dollars', 'Add ' + sh.pc + '% of the costs, not ' + sh.pc + ' dollars: ' + t(M(C) + '\\times ' + dS(1 + sh.pc / 100)) + '.'], [q(C * sh.pc / 100), 'u2l4-profit-only', 'That’s the profit. The bid is the costs plus the profit.'], [q(C * sh.pc), 'u2l4-pct-no-div', 'Change ' + sh.pc + '% to a decimal first.'], [q(C * (1 + sh.pc / 10)), 'u2l4-pct-no-div', sh.pc + '% is ' + t(dS(sh.pc / 100)) + ', so multiply by ' + t(dS(1 + sh.pc / 100)) + '.'], [q(C * (1 - sh.pc / 100)), 'u2l4-cut-dollars', 'Add the profit; don’t take it off.']],
              t(M(C) + '\\times ' + dS(1 + sh.pc / 100) + '=' + M(B)), ['bid = costs × (1 + profit rate).'], 'snow bid'); } },
          { id: '10c', level: 'BEG', make: function (r, sh) { var C = sh.a + sh.b, B = q(C * (1 + sh.pc / 100)), pr = q(B - C); return mPart('How much profit will ' + sh.p.he + ' make if ' + sh.p.his + ' costs are what ' + sh.p.he + ' expects?', pr, [[B, 'u2l4-bid-for-profit', 'That’s the bid. Subtract the costs.'], [sh.pc, 'u2l4-dollars', 'The profit is ' + sh.pc + '% of the costs, in dollars.']], t(M(B) + '-' + M(C) + '=' + M(pr)), ['Profit = bid − costs.'], 'snow profit'); } },
          { id: '10d', level: 'PRG', make: function (r, sh) { var C = sh.a + sh.b, B = q(C * (1 + sh.pc / 100)), C2 = sh.a2 + sh.b, pr = q(B - C2);
            return mPart('It is a very snowy winter, and the fuel and salt cost ' + t(M(sh.a2)) + ' instead. How much profit does ' + sh.p.he + ' make now?', pr, [[q(B - sh.a2), 'u2l4-no-helper', 'The helper still costs ' + t(M(sh.b)) + '. Subtract both costs.'], [q(B - C), 'u2l4-old-cost', 'That’s the profit with the old costs. Use the new fuel and salt cost.'], [sh.a2 - sh.a, 'u2l4-extra-cost', 'That’s the extra cost. Find the new total cost and subtract it from the bid.'], [q(C2 * (1 + sh.pc / 100) - C2), 'u2l4-old-cost', 'The bid is already set at ' + t(M(B)) + '. It doesn’t change.']],
              sol(['Costs: ' + t(M(sh.a2) + '+' + M(sh.b) + '=' + M(C2)), 'Profit: ' + t(M(B) + '-' + M(C2) + '=' + M(pr))]), ['The bid stays the same. Find the new costs.', 'Profit = bid − costs.'], 'snow new'); } }] },
      { num: '11', stem: function (sh) { return 'A tile setter can tile a bathroom at ' + t(M(sh.w)) + ' per hour, or for a contract price of ' + t(M(sh.C)) + '. With the contract, she pays ' + t(M(sh.m)) + ' for the grout and glue.'; },
        shared: function (r) { return find(function () { return { w: r.int(28, 38), C: 50 * r.int(22, 30), m: 5 * r.int(16, 30), H: r.int(25, 45) }; }, function (s) { var x = (s.C - s.m) / s.w; return Math.abs(s.H * s.w - (s.C - s.m)) >= 20 && !near(x, Math.round(x)) && Math.abs(x * 10 - Math.floor(x * 10) - 0.5) > 0.01; }, { w: 32, C: 1250, m: 110, H: 30 }); },
        parts: [
          { id: '11a', level: 'PRG', make: function (r, sh) { var hr = sh.H * sh.w, ce = sh.C - sh.m;
            return fPart('If the job takes ' + sh.H + ' hours, which way pays more, and by how much?', wayRows(hr, ce).map(function (x) { if (x.kind === 'money') x.list.push([sh.C - hr, 'u2l4-no-materials', 'With the contract she pays ' + t(M(sh.m)) + ' for materials. Subtract it first.'], [Math.abs(sh.C - hr), 'u2l4-no-materials', 'Take the materials off the contract price first.']); return x; }),
              sol(['Hourly: ' + t(sh.H + '\\times ' + M(sh.w) + '=' + M(hr)), 'Contract: ' + t(M(sh.C) + '-' + M(sh.m) + '=' + M(ce)), (ce > hr ? 'The contract' : 'The hourly rate') + ' pays more, by ' + t(M(Math.abs(ce - hr))) + '.']), ['Hourly pay = hours × rate. Contract earnings = price − materials.', 'Then subtract.'], 'tile which'); } },
          { id: '11b', level: 'PRG', make: function (r, sh) { return breakEven('For about how many hours do the two ways pay the same? Round to one decimal place.', sh.C - sh.m, sh.w, sh.C, sh.m, 'tile even'); } },
          { id: '11c', level: 'EMG', make: function (r, sh) { var x = rnd((sh.C - sh.m) / sh.w, 1).toFixed(1);
            return K.P.mc(r, 'The tile setter is new to this kind of tile and is not sure how long it will take. Which way is the safer choice, and why?', [
              { html: 'Hourly: she is paid for every hour, even if the job takes longer than ' + x + ' hours.', right: true },
              { html: 'The contract: it always pays more.', why: 'Only if she finishes in less than about ' + x + ' hours. A beginner may be slower.', code: 'always' },
              { html: 'The contract: the materials are free.', why: 'With the contract she pays for the materials.', code: 'free' },
              { html: 'Hourly: she has to buy the materials.', why: 'With the hourly rate she does not pay for the materials.', code: 'mat' }],
              'For example: the hourly rate, because she is paid for every hour even if the job takes longer than ' + x + ' hours. (The contract only wins if she is fast.)', ['What happens to each way of being paid if the job takes longer?'], 'tile choose'); } }] },
      { num: '12', stem: 'Finish each sentence.', parts: [
        { id: '12a', level: 'LIM', make: function (r) { return K.P.mc(r, 'One <b>advantage</b> of piecework for the worker is', [
            { html: 'fast, skilled workers earn more money.', right: true }, { html: 'the pay stays the same on slow or rainy days.', why: 'With piecework, slow days pay <b>less</b>. That’s true of an hourly wage.', code: 'hourly' },
            { html: 'the worker gets overtime pay for long days.', why: 'Overtime is for hourly workers.', code: 'ot' }, { html: 'the customer knows the full price before the job starts.', why: 'That’s about a contract, and it helps the customer, not the worker.', code: 'contract' }],
            'Fast workers earn more money (and can see their pay grow as they work).', ['With piecework, what makes the pay go up?'], 'piece adv'); } },
        { id: '12b', level: 'LIM', make: function (r) { return K.P.mc(r, 'One <b>disadvantage</b> of piecework for the worker is', [
            { html: 'the pay drops on slow days (bad weather, a broken machine, learning a new job), and rushing can cause mistakes or injuries.', right: true }, { html: 'working faster does not earn more money.', why: 'With piecework, working faster <b>does</b> earn more. That’s a disadvantage of an hourly wage.', code: 'hourly' },
            { html: 'the worker must buy all the materials and pay the helpers.', why: 'That’s a disadvantage of contract work.', code: 'contract' }, { html: 'fast workers can earn a lot.', why: 'That’s an advantage.', code: 'adv' }],
            'Pay drops on slow or rainy days, and rushing can lead to mistakes or injuries.', ['What happens to piecework pay on a bad day?'], 'piece dis'); } },
        { id: '12c', level: 'BEG', make: function (r) { return K.P.mc(r, 'One <b>advantage</b> of a contract for the <b>customer</b> is', [
            { html: 'they know the full price before the job starts, even if the job takes longer than planned.', right: true }, { html: 'they pay less if the job goes quickly.', why: 'The contract price is set before the job. It doesn’t go down if the job is quick.', code: 'quick' },
            { html: 'they pay for each hour the contractor works.', why: 'That’s an hourly rate, not a contract.', code: 'hourly' }, { html: 'the contractor gets paid vacation and benefits.', why: 'Contractors usually get no paid vacation or benefits, and that’s about the contractor, not the customer.', code: 'benefits' }],
            'They know the full price before the job starts, even if the job takes longer than planned.', ['Think about the price: when is it set?'], 'contract adv'); } },
        { id: '12d', level: 'BEG', make: function (r) { return K.P.mc(r, 'One <b>disadvantage</b> of contract work for the <b>contractor</b> is', [
            { html: 'if the job takes longer or the materials cost more, the contractor earns less (and gets no paid vacation or benefits).', right: true }, { html: 'the contractor is paid for every hour, even slow ones.', why: 'That’s an hourly wage, and it is an advantage.', code: 'hourly' },
            { html: 'the contractor can choose which jobs to take.', why: 'That’s an advantage of being your own boss.', code: 'adv' }, { html: 'the customer doesn’t know the price until the job is done.', why: 'With a contract the price is set before the job starts.', code: 'price' }],
            'If the job takes longer or materials cost more, the contractor earns less (and gets no paid vacation or benefits).', ['What if the job takes longer than planned?'], 'contract dis'); } }] },
      { num: '13', stem: function (sh) { return sh.p.n + ' did a renovation contract for ' + t(M(sh.P)) + '. Materials cost ' + t(M(sh.m)) + '. ' + sh.p.He + ' worked ' + sh.H + ' hours. Here is ' + sh.p.his + ' work:<table class="vtab"><tr><td>' + t(M(sh.P) + '\\div ' + sh.H + '=' + M(sh.P / sh.H)) + ' &nbsp; “I made ' + t(M(sh.P / sh.H)) + ' an hour!”</td></tr></table>'; },
        shared: function (r) { return find(function () { return { p: person(r), P: 100 * r.int(24, 40), m: 10 * r.int(50, 120), H: r.pick([30, 32, 35, 36, 40, 45, 48]) }; }, function (s) { return near(s.P / s.H, r2(s.P / s.H)); }, { p: person(r), P: 3200, m: 860, H: 40 }); },
        parts: [
          { id: '13a', level: 'EMG', make: function (r, sh) { return K.P.mc(r, 'What mistake did ' + sh.p.n + ' make?', [
              { html: sh.p.He + ' did not subtract the ' + t(M(sh.m)) + ' for materials. That money was not ' + sh.p.his + ' to keep.', right: true },
              { html: sh.p.He + ' should have multiplied by ' + sh.H + ' instead of dividing.', why: 'Dividing by the hours is right. Something else is missing.', code: 'mult' },
              { html: sh.p.He + ' should have added the materials to the price.', why: 'The materials are a cost. They come out of the price.', code: 'add' },
              { html: sh.p.He + ' made no mistake.', why: 'Who paid for the materials?', code: 'none' }], 'The contract price is not all ' + sh.p.his + '. Subtract the materials first.', ['Is all of the contract price ' + sh.p.his + ' to keep?'], 'Marco wrong'); } },
          { id: '13b', level: 'EMG', make: function (r, sh) { var E = sh.P - sh.m, e = q(E / sh.H); return mPart('Find ' + sh.p.his + ' real effective hourly rate.', e, rateList(sh.P, sh.m, 0, sh.H), sol(['Earnings: ' + t(M(sh.P) + '-' + M(sh.m) + '=' + M(E)), 'Per hour: ' + t(M(E) + '\\div ' + sh.H + eqM(e))]), ['Subtract the materials, then divide by the hours.'], 'Marco rate', { after: '/h' }); } }] },
      { num: '14', stem: function (sh) { return sh.p.n + ' bids ' + t(M(sh.B)) + ' to finish a basement bathroom. ' + sh.p.His + ' materials will cost ' + t(M(sh.M)) + ', and ' + sh.p.he + ' will pay a helper for ' + sh.h + ' hours at ' + t(M(sh.w)) + ' per hour. ' + sh.p.n + ' expects to work ' + sh.H + ' hours ' + sh.p.him + 'self.'; },
        shared: function (r) { return find(function () { return { p: person(r), B: 100 * r.int(50, 70), M: 50 * r.int(50, 70), h: r.int(24, 36), w: r.int(21, 25), H: r.int(40, 50), d: r.pick([10, 10, 10, 5, 15, 8]) }; }, function (s) { var E = s.B - s.M - s.h * s.w, E2 = s.B * (1 - s.d / 100) - s.M - s.h * s.w; return E >= 1500 && E <= 3200 && E2 > 400 && near(s.B * (1 - s.d / 100), r2(s.B * (1 - s.d / 100))); }, { p: person(r), B: 6400, M: 3150, h: 32, w: 23, H: 45, d: 10 }); },
        parts: [
          { id: '14a', level: 'PRG', make: function (r, sh) { var hp = sh.h * sh.w, E = sh.B - sh.M - hp, e = q(E / sh.H);
            return fPart('What will ' + sh.p.n + ' earn, and what is ' + sh.p.his + ' effective hourly rate? Round to the nearest cent.', [{ label: 'Earnings:', name: 'Earnings', kind: 'money', ans: E, list: earnList(sh.B, sh.M, hp) }, { label: 'Per hour:', name: 'Effective hourly rate', kind: 'money', after: '/h', ans: e, list: rateList(sh.B, sh.M, hp, sh.H, sh.h) }],
              sol(['Helper: ' + t(sh.h + '\\times ' + M(sh.w) + '=' + M(hp)), 'Earnings: ' + t(M(sh.B) + '-' + M(sh.M) + '-' + M(hp) + '=' + M(E)), 'Per hour: ' + t(M(E) + '\\div ' + sh.H + eqM(e))]), ['Earnings = bid − materials − helper.', 'Effective hourly rate = earnings ÷ ' + sh.p.his + ' own hours.'], 'Owen earn'); } },
          { id: '14b', level: 'ADV', make: function (r, sh) { var hp = sh.h * sh.w, B2 = q(sh.B * (1 - sh.d / 100)), E2 = q(B2 - sh.M - hp), e2 = q(E2 / sh.H), E = sh.B - sh.M - hp;
            return fPart('The customer says another contractor will do it for ' + sh.d + '% less. If ' + sh.p.n + ' lowers ' + sh.p.his + ' price by ' + sh.d + '%, what is ' + sh.p.his + ' new price, ' + sh.p.his + ' earnings and ' + sh.p.his + ' effective hourly rate?', [
              { label: 'New price:', name: 'New price', kind: 'money', ans: B2, list: [[q(sh.B * sh.d / 100), 'u2l4-cut-dollars', 'That’s the amount taken off. Subtract it from ' + t(M(sh.B)) + ' (or multiply by ' + t(dS(1 - sh.d / 100)) + ').'], [sh.B - sh.d, 'u2l4-pct-dollars', 'Take off ' + sh.d + '% of the price, not ' + sh.d + ' dollars.'], [q(sh.B * (1 + sh.d / 100)), 'u2l4-cut-dollars', 'The price goes <b>down</b> by ' + sh.d + '%.']] },
              { label: 'Earnings:', name: 'Earnings', kind: 'money', ans: E2, list: earnList(B2, sh.M, hp).concat([[q(E * (1 - sh.d / 100)), 'u2l4-same-pct', 'Take ' + sh.d + '% off the <b>price</b>, then subtract the costs. The costs don’t go down.']]) },
              { label: 'Per hour:', name: 'Effective hourly rate', kind: 'money', after: '/h', ans: e2, list: rateList(B2, sh.M, hp, sh.H, sh.h).concat([[q(E / sh.H), 'u2l4-old-cost', 'Use the new earnings.']]) }],
              sol(['New price: ' + t(M(sh.B) + '\\times ' + dS(1 - sh.d / 100) + '=' + M(B2)), 'Earnings: ' + t(M(B2) + '-' + M(sh.M) + '-' + M(hp) + '=' + M(E2)), 'Per hour: ' + t(M(E2) + '\\div ' + sh.H + eqM(e2))]), ['New price = old price × (1 − ' + dS(sh.d / 100) + ').', 'The materials and the helper cost the same.'], 'Owen cut'); } },
          { id: '14c', sub: 'c i', level: 'MAS', make: function (r, sh) { var hp = sh.h * sh.w, E = sh.B - sh.M - hp, B2 = q(sh.B * (1 - sh.d / 100)), E2 = q(B2 - sh.M - hp), drop = q(E - E2), P = drop / E * 100, ans = rnd(P, 1);
            var p = { prompt: 'The price dropped by ' + sh.d + '%. By what percent did ' + sh.p.n + '’s earnings drop? Round to one decimal place.', input: { type: 'number', after: '%' },
              check: PK.pct(P, 1, U.dg(clean([[sh.d, 'u2l4-same-pct', 'Not ' + sh.d + '%: find the drop in earnings in dollars, then divide by the old earnings.'], [drop / E2 * 100, 'u2l4-div-new', 'Divide by the <b>old</b> earnings, ' + t(M(E)) + '.'], [drop, 'u2l4-dollars', 'That’s the drop in dollars. Divide by the old earnings and multiply by 100.'], [E2 / E * 100, 'u2l4-ratio', 'That compares the new earnings with the old. Use the drop: ' + t(M(E) + '-' + M(E2)) + '.'], [drop / sh.B * 100, 'u2l4-div-new', 'Divide by the old <b>earnings</b>, not by the price.']], P, 1), 1)),
              key: ans.toFixed(1), answer: t(ans.toFixed(1) + '\\%'), solution: sol(['Drop: ' + t(M(E) + '-' + M(E2) + '=' + M(drop)), t(M(drop) + '\\div ' + M(E) + '\\times 100=' + dS(rnd(P, 3)) + '\\ldots\\approx ' + ans.toFixed(1) + '\\%')]), hints: ['Find the drop in earnings in dollars.', 'Percent drop = drop ÷ old earnings × 100.'], text: 'Owen pct' };
            p.bad = [String(sh.d), dS(rnd(drop / E2 * 100, 1))]; return p; } },
          { id: '14d', sub: 'c ii', level: 'PRG', make: function (r, sh) { var hp = sh.h * sh.w, cut = q(sh.B * sh.d / 100);
            return K.P.mc(r, 'Why did ' + sh.p.his + ' earnings drop by more than ' + sh.d + '%?', [
              { html: 'The materials and the helper cost the same, so the whole ' + t(M(cut)) + ' cut comes out of ' + sh.p.his + ' own earnings, which are only part of the price.', right: true },
              { html: 'The materials cost more when the price drops.', why: 'The materials cost the same, ' + t(M(sh.M)) + '.', code: 'mat' },
              { html: sh.p.He + ' has to work more hours.', why: sh.p.He + ' still works ' + sh.H + ' hours.', code: 'hours' },
              { html: 'The helper is paid ' + sh.d + '% more.', why: 'The helper is paid the same, ' + t(M(hp)) + '.', code: 'helper' }],
              'The costs stay the same, so the whole cut comes out of ' + sh.p.his + ' earnings. ' + t(M(cut)) + ' is a bigger part of the earnings than of the price.', ['Which amounts did not change?'], 'Owen why'); } }] },
      { num: '15', stem: '', parts: [{ id: '15', level: 'LIM', make: function (r) {
        var v = find(function () { return { p: person(r), rate: cents(r, 2.5, 4.5, 10), n: r.int(25, 60), it: r.pick(['apron', 'tea towel', 'pillowcase', 'tote bag']) }; }, function (s) { var a = [s.n / s.rate, s.n + s.rate, s.n * s.rate, s.n * s.rate * 10].map(r2); return a.every(function (x, i) { return a.indexOf(x) === i; }); }, { p: person(r), rate: 3.2, n: 45, it: 'apron' });
        var pay = q(v.n * v.rate);
        return K.P.mc(r, v.p.n + ' sews ' + v.it + 's and is paid ' + t(M(v.rate)) + ' per ' + v.it + '. How much does ' + v.p.he + ' earn for sewing ' + v.n + ' ' + v.it + 's?', [
          { html: t(M(v.n / v.rate)), why: 'That divides. Multiply the number of ' + v.it + 's by the rate.', code: 'div' }, { html: t(M(v.n + v.rate)), why: 'That adds. Multiply the number of ' + v.it + 's by the rate.', code: 'add' },
          { html: t(M(pay)), right: true }, { html: t(M(pay * 10)), why: 'Check the decimal point. Estimate: about ' + Math.round(v.n / 10) * 10 + ' at about ' + t(M(Math.round(v.rate))) + '.', code: 'dec' }],
          t(v.n + '\\times ' + M(v.rate) + '=' + M(pay)) + '.', ['Pay = rate × pieces.'], 'MC Ella', true);
      } }] },
      { num: '16', stem: '', parts: [{ id: '16', level: 'EMG', make: function (r) {
        var v = find(function () { var H = r.int(16, 30), e = r.int(25, 45), m = 10 * r.int(10, 30); return { H: H, e: e, m: m, P: e * H + m }; }, function (s) { var a = [s.m / s.H, s.e, s.P / s.H, (s.P + s.m) / s.H]; return a.every(function (x) { return near(x, r2(x)); }) && !(s.P === 900 && s.m === 180); }, { H: 24, e: 30, m: 180, P: 900 });
        return K.P.mc(r, 'A contractor does a job for ' + t(M(v.P)) + '. The materials cost ' + t(M(v.m)) + '. The contractor works ' + v.H + ' hours. What is the contractor’s effective hourly rate?', [
          { html: t(M(v.m / v.H)), why: 'That’s only the materials divided by the hours. Use the earnings: price − materials.', code: 'mat' }, { html: t(M(v.e)), right: true },
          { html: t(M(v.P / v.H)), why: 'Subtract the materials first: the contract price is not all the contractor’s.', code: 'nosub' }, { html: t(M((v.P + v.m) / v.H)), why: 'Subtract the materials; don’t add them.', code: 'add' }],
          t('(' + M(v.P) + '-' + M(v.m) + ')\\div ' + v.H + '=' + M(v.P - v.m) + '\\div ' + v.H + '=' + M(v.e)) + '.', ['Earnings = price − materials. Then divide by the hours.'], 'MC contractor', true);
      } }] },
      { num: '17', stem: '', parts: [{ id: '17', level: 'EMG', make: function (r) {
        var v = find(function () { return [cents(r, 0.15, 0.22, 1), 50 * r.int(20, 60)]; }, function (v) { return near(v[0] * v[1], r2(v[0] * v[1])); }, [0.18, 2050]), pay = q(v[0] * v[1]);
        return nPart('<b>Numerical response.</b> A tree planter is paid ' + t(M(v[0])) + ' per tree. The number of trees she must plant to earn ' + t(M(pay)) + ' is ________.', v[1], null, [[q(pay * v[0]), 'u2l4-mult', 'pieces = pay ÷ rate.'], [q(v[0] / pay), 'u2l4-divided', 'Divide the pay by the rate.']],
          sol([t(M(pay) + '\\div ' + M(v[0]) + '=' + v[1]) + ' trees', 'Check: ' + t(v[1] + '\\times ' + M(v[0]) + '=' + M(pay)) + ' ✓']), ['pieces = pay ÷ rate.'], 'NR trees', { nr: true });
      } }] }
    ],
    extra: [
      { num: '1', section: 'A. Skills', stem: 'Find each worker’s pay.', parts: [
        { id: 'e1a', level: 'LIM', make: function (r) { var n = 40 * r.int(30, 50), rate = cents(r, 0.15, 0.22, 1); return piecePart(N(n) + ' trees at ' + t(M(rate)) + ' per tree', n, rate, 'trees'); } },
        { id: 'e1b', level: 'BEG', make: function (r) { var n = r.int(30, 60), rate = cents(r, 2.15, 2.95, 5), it = r.pick(['bracelets', 'key chains', 'candles']); return piecePart(n + ' ' + it + ' at ' + t(M(rate)) + ' each', n, rate, it); } },
        { id: 'e1c', level: 'LIM', make: function (r) { var n = r.int(30, 50), rate = cents(r, 1.45, 1.95, 5); return piecePart(n + ' boxes of apples packed at ' + t(M(rate)) + ' per box', n, rate, 'apples'); } },
        { id: 'e1d', level: 'BEG', make: function (r) { var n = 100 * r.int(8, 20), rate = cents(r, 0.02, 0.05, 1); return piecePart(N(n) + ' words proofread at ' + t(M(rate)) + ' per word', n, rate, 'proofread'); } }] },
      { num: '2', stem: '', parts: [{ id: 'e2', level: 'BEG', make: function (r) {
        var p = person(r), R = [r.int(20, 24), r.int(28, 32), r.int(36, 40)], C = [r.int(3, 7), r.int(2, 6), r.int(2, 5)], pays = R.map(function (x, i) { return x * C[i]; }), tot = sum(pays);
        return mPart(p.n + ' works at a dog grooming shop and is paid for each dog ' + p.he + ' grooms: ' + t(M(R[0])) + ' for a small dog, ' + t(M(R[1])) + ' for a medium dog and ' + t(M(R[2])) + ' for a large dog. On Friday ' + p.he + ' grooms ' + C[0] + ' small, ' + C[1] + ' medium and ' + C[2] + ' large dogs. How much does ' + p.he + ' earn?', tot,
          [[sum(R) * sum(C), 'u2l4-all-one-rate', 'Find the pay for each size on its own (rate × number), then add.'], [pays[0] + pays[1], 'u2l4-one-size', 'Add the large dogs too.'], [pays[1] + pays[2], 'u2l4-one-size', 'Add the small dogs too.'], [pays[0] + pays[2], 'u2l4-one-size', 'Add the medium dogs too.'], [sum(R), 'u2l4-no-pieces', 'Multiply each rate by the number of dogs.'], [R[1] * sum(C), 'u2l4-all-one-rate', 'Each size has its own rate.']],
          sol([t(C[0] + '\\times ' + M(R[0]) + '=' + M(pays[0])) + '; ' + t(C[1] + '\\times ' + M(R[1]) + '=' + M(pays[1])) + '; ' + t(C[2] + '\\times ' + M(R[2]) + '=' + M(pays[2])), 'Total: ' + t(M(pays[0]) + '+' + M(pays[1]) + '+' + M(pays[2]) + '=' + M(tot))]), ['Pay for each size = rate × number of dogs.', 'Then add.'], 'grooming');
      } }] },
      { num: '3', stem: 'Work backwards.', parts: [
        { id: 'e3a', level: 'EMG', make: function (r) { var n = r.int(25, 50), rate = cents(r, 2.5, 4.5, 25), pay = q(n * rate), p = person(r); return mPart('A baker is paid ' + t(M(pay)) + ' to decorate ' + n + ' cupcake trays. What is she paid per tray?', rate, [[q(n / pay), 'u2l4-divided', 'rate = pay ÷ pieces.'], [q(pay * n), 'u2l4-mult', 'Divide the pay by the number of trays.']], t(M(pay) + '\\div ' + n + '=' + M(rate)) + ' per tray', ['rate = pay ÷ pieces.'], 'e3a'); } },
        { id: 'e3b', level: 'EMG', make: function (r) { var rate = cents(r, 0.12, 0.25, 1), n = 50 * r.int(4, 10), pay = q(n * rate), p = person(r); return nPart(p.n + ' delivers flyers for ' + t(M(rate)) + ' each. ' + p.He + ' earned ' + t(M(pay)) + '. How many flyers did ' + p.he + ' deliver?', n, null, [[q(pay * rate), 'u2l4-mult', 'pieces = pay ÷ rate.'], [q(rate / pay), 'u2l4-divided', 'Divide the pay by the rate.']], t(M(pay) + '\\div ' + M(rate) + '=' + n) + ' flyers', ['pieces = pay ÷ rate.'], 'e3b', { after: 'flyers' }); } },
        { id: 'e3c', level: 'PRG', make: function (r) { var v = find(function () { return [cents(r, 0.16, 0.24, 1), 50 * r.int(4, 10)]; }, function (v) { return !near(v[1] / v[0], Math.round(v[1] / v[0])); }, [0.21, 250]); return upPart('A planter earns ' + t(M(v[0])) + ' per tree. How many trees must she plant to earn at least ' + t(M(v[1])) + '?', v[1], v[0], 'trees', 'e3c'); } }] },
      { num: '4', stem: '', parts: [{ id: 'e4', level: 'EMG', make: function (r) {
        var P = 50 * r.int(30, 50), m = q(r.int(4000, 8000) / 10), H = r.int(10, 18), E = q(P - m), e = q(E / H);
        return fPart('A plumber agrees to replace a water heater for ' + t(M(P)) + '. The water heater and parts cost ' + t(M(m)) + '. The job takes him ' + H + ' hours. How much does he earn, and what is his effective hourly rate?', [{ label: 'Earnings:', name: 'Earnings', kind: 'money', ans: E, list: earnList(P, m, 0) }, { label: 'Per hour:', name: 'Effective hourly rate', kind: 'money', after: '/h', ans: e, list: rateList(P, m, 0, H) }],
          sol(['Earnings: ' + t(M(P) + '-' + M(m) + '=' + M(E)), 'Per hour: ' + t(M(E) + '\\div ' + H + eqM(e))]), ['Earnings = price − parts.', 'Per hour = earnings ÷ hours.'], 'plumber');
      } }] },
      { num: '5', section: 'B. Applying', stem: function (sh) { return sh.p.n + ' assembles bikes at a sporting goods store and is paid ' + t(M(sh.rate)) + ' for each bike.'; },
        shared: function (r) { return find(function () { return { p: person(r), rate: cents(r, 10.5, 13, 50), h: r.pick([8, 8, 7.5]), n1: r.int(9, 13), n2: r.int(6, 10) }; }, function (s) { var e1 = s.n1 * s.rate / s.h, e2 = s.n2 * s.rate / s.h; return e1 >= 15.1 && e1 <= 18 && e2 < 14.6 && e2 > 10; }, { p: person(r), rate: 11.5, h: 8, n1: 11, n2: 9 }); },
        parts: [
          { id: 'e5a', sub: 'a i', level: 'EMG', make: function (r, sh) { var pay = q(sh.n1 * sh.rate), e = q(pay / sh.h); return mPart('On Saturday ' + sh.p.he + ' assembles ' + sh.n1 + ' bikes in ' + dS(sh.h) + ' hours. What is ' + sh.p.his + ' effective hourly rate?', e, effList(pay, sh.h, sh.n1).concat([[pay, 'u2l4-earn-not-rate', 'That’s the pay for the day. Divide it by the hours.']]), sol([t(sh.n1 + '\\times ' + M(sh.rate) + '=' + M(pay)), t(M(pay) + '\\div ' + dS(sh.h) + eqM(e)) + ' per hour']), ['Pay first (rate × bikes), then ÷ hours.'], 'bikes rate', { after: '/h' }); } },
          { id: 'e5b', sub: 'a ii', level: 'BEG', make: function (r, sh) { var e = q(sh.n1 * sh.rate / sh.h); return K.P.tf(r, 'True or false: on Saturday, ' + sh.p.n + '’s effective hourly rate is at least the ' + t('\\$15.00') + ' minimum wage.', true, 'Compare ' + t(M(e)) + ' with ' + t('\\$15.00') + '.', t(M(e)) + ' is more than ' + t('\\$15.00') + ', so it is true.', ['Compare the effective hourly rate with $15.00.'], 'bikes min'); } },
          { id: 'e5c', sub: 'b', level: 'PRG', make: function (r, sh) { var pay = q(sh.n2 * sh.rate), mn = q(sh.h * MIN()), add = q(mn - pay);
            return mPart('On Sunday ' + sh.p.he + ' assembles only ' + sh.n2 + ' bikes in ' + dS(sh.h) + ' hours. How much must the store add to reach minimum wage?', add, [[mn, 'u2l4-minwage-total', 'That’s the minimum pay. Subtract what ' + sh.p.he + ' earned.'], [q(MIN() - pay / sh.h), 'u2l4-gap-per-hour', 'That’s the gap for one hour. Find the minimum pay for all ' + dS(sh.h) + ' hours, then subtract.'], [q(MIN() - r2(pay / sh.h)), 'u2l4-gap-per-hour', 'That’s the gap for one hour. Multiply by the hours (or subtract the totals).'], [pay, 'u2l4-minwage-total', 'That’s what ' + sh.p.he + ' earned. Subtract it from the minimum.']],
              sol([t(sh.n2 + '\\times ' + M(sh.rate) + '=' + M(pay)) + '; minimum: ' + t(dS(sh.h) + '\\times \\$15.00=' + M(mn)), 'The store adds ' + t(M(mn) + '-' + M(pay) + '=' + M(add)) + '.']), ['Minimum pay = hours × $15.00.', 'Then subtract what ' + sh.p.he + ' earned.'], 'bikes top-up'); } }] },
      { num: '6', stem: '', parts: [{ id: 'e6', level: 'EMG', make: function (r) {
        var p = person(r), S = 5 * r.int(200, 300), h = r.int(10, 16), w = r.int(19, 22), E = 50 * r.int(10, 16), hp = h * w, B = S + hp + E;
        return mPart(p.n + ' is bidding to re-shingle a garage roof. Shingles and nails cost ' + t(M(S)) + '. ' + p.He + ' will pay a helper for ' + h + ' hours at ' + t(M(w)) + ' per hour. ' + p.He + ' wants to earn ' + t(M(E)) + ' for ' + p.him + 'self. What should ' + p.he + ' bid?', B,
          [[S + hp, 'u2l4-no-own', 'Add what ' + p.he + ' wants to earn.'], [hp + E, 'u2l4-no-materials', 'Add the shingles and nails too.'], [S + E, 'u2l4-no-helper', 'Add the helper’s wages too.'], [S + w + E, 'u2l4-no-hours', 'Helper: ' + t(h + '\\times ' + M(w)) + '.']],
          sol(['Helper: ' + t(h + '\\times ' + M(w) + '=' + M(hp)), 'Bid: ' + t(M(S) + '+' + M(hp) + '+' + M(E) + '=' + M(B))]), ['Bid = materials + helper + what ' + p.he + ' wants to earn.'], 'roof bid');
      } }] },
      { num: '7', stem: '', parts: [{ id: 'e7', level: 'EMG', make: function (r) {
        var p = cents(r, 5.5, 7.5, 50), c = r.int(15, 22), n = r.int(25, 45), a = q(n * p), b = q(n * c), d = q(b - a);
        return fPart('A bakery pays a cake decorator ' + t(M(p)) + ' for each cake she decorates. The bakery charges customers ' + t(M(c)) + ' for decorating a cake. In one week she decorates ' + n + ' cakes. How much does the decorator earn, and how much is left for the bakery?', [
          { label: 'Decorator earns:', name: 'Decorator', kind: 'money', ans: a, list: pieceList(n, p) },
          { label: 'Left for the bakery:', name: 'Left for the bakery', kind: 'money', ans: d, list: [[b, 'u2l4-diff-total', 'That’s what the bakery charges. Subtract the decorator’s pay.'], [q(c - p), 'u2l4-no-pieces', 'That’s what is left on one cake. Multiply by ' + n + '.']] }],
          sol(['Decorator: ' + t(n + '\\times ' + M(p) + '=' + M(a)) + '; bakery charges ' + t(n + '\\times ' + M(c) + '=' + M(b)), 'Left for the bakery: ' + t(M(b) + '-' + M(a) + '=' + M(d))]), ['Decorator: rate × cakes.', 'Left = what the bakery charges − the decorator’s pay.'], 'cakes');
      } }] },
      { num: '8', stem: function (sh) { return 'A painter can paint a house at ' + t(M(sh.w)) + ' per hour, or for a contract price of ' + t(M(sh.C)) + '. With the contract, she pays ' + t(M(sh.m)) + ' for paint.'; },
        shared: function (r) { return find(function () { return { w: r.int(25, 32), C: 50 * r.int(36, 52), m: 10 * r.int(25, 40), H: r.int(45, 65) }; }, function (s) { var x = (s.C - s.m) / s.w; return Math.abs(s.H * s.w - (s.C - s.m)) >= 20 && !near(x, Math.round(x)) && Math.abs(x * 10 - Math.floor(x * 10) - 0.5) > 0.01; }, { w: 28, C: 2100, m: 340, H: 55 }); },
        parts: [
          { id: 'e8a', level: 'PRG', make: function (r, sh) { var hr = sh.H * sh.w, ce = sh.C - sh.m; return fPart('If the job takes ' + sh.H + ' hours, which way pays more, and by how much?', wayRows(hr, ce).map(function (x) { if (x.kind === 'money') x.list.push([Math.abs(sh.C - hr), 'u2l4-no-materials', 'Take the paint off the contract price first.']); return x; }),
              sol(['Hourly: ' + t(sh.H + '\\times ' + M(sh.w) + '=' + M(hr)) + '; contract: ' + t(M(sh.C) + '-' + M(sh.m) + '=' + M(ce)), (ce > hr ? 'The contract' : 'The hourly rate') + ' pays more, by ' + t(M(Math.abs(ce - hr))) + '.']), ['Hourly pay = hours × rate. Contract earnings = price − paint.'], 'painter which'); } },
          { id: 'e8b', level: 'PRG', make: function (r, sh) { return breakEven('For about how many hours do the two ways pay the same? Round to one decimal place.', sh.C - sh.m, sh.w, sh.C, sh.m, 'painter even'); } }] },
      { num: '9', stem: function (sh) { return sh.p.n + ' plants ' + N(sh.n) + ' trees at ' + t(M(sh.rate)) + ' per tree. Here is ' + sh.p.his + ' work:<table class="vtab"><tr><td>' + t(N(sh.n) + '\\div ' + dS(sh.rate) + '=\\$' + bigM(sh.n / sh.rate)) + '</td></tr></table>'; },
        shared: function (r) { return find(function () { return { p: person(r), n: 100 * r.int(18, 28), rate: cents(r, 0.14, 0.19, 1) }; }, function (s) { return !(s.n === 2350); }, { p: person(r), n: 2400, rate: 0.16 }); },
        parts: [
          { id: 'e9a', level: 'EMG', make: function (r, sh) { var nE = Math.round(sh.n / 1000) * 1000, rE = Math.round(sh.rate * 10) / 10, est = nE * rE, wrongV = bigM(sh.n / sh.rate);
            return K.P.mc(r, 'How does an estimate show this is wrong?', [
              { html: 'About ' + N(nE) + ' trees at about ' + Math.round(rE * 100) + '¢ is about ' + t(M(est)) + ', not ' + t('\\$' + wrongV) + '. ' + sh.p.He + ' divided instead of multiplying.', right: true },
              { html: 'An estimate can’t show it is wrong; the work is right.', why: 'Estimate: about ' + N(nE) + ' trees at about ' + Math.round(rE * 100) + '¢ each. Is that near ' + t('\\$' + wrongV) + '?', code: 'right' },
              { html: 'About ' + N(nE) + ' trees at about ' + Math.round(rE * 100) + '¢ is about ' + t(M(est)) + ', so ' + sh.p.he + ' should have added: ' + t(N(sh.n) + '+' + dS(sh.rate)) + '.', why: 'Adding the rate to the trees makes no sense. Pay = trees × rate.', code: 'add' },
              { html: 'The estimate is about ' + t(M(est * 10)) + ', so the answer is a bit too big.', why: 'Check the estimate: ' + N(nE) + t('\\times ' + dS(rE)) + '.', code: 'est10' }],
              sol(['About ' + N(nE) + ' trees at about ' + Math.round(rE * 100) + '¢ is about ' + t(M(est)) + ', not ' + t('\\$' + wrongV) + '. ' + sh.p.He + ' divided instead of multiplying.']), ['Round the trees and the rate, then multiply in your head.'], 'Leo estimate'); } },
          { id: 'e9b', level: 'BEG', make: function (r, sh) { return piecePart('What is the correct pay?', sh.n, sh.rate, 'Leo pay'); } }] },
      { num: '10', stem: '', parts: [{ id: 'e10', level: 'BEG', make: function (r) {
        var v = find(function () { return { p: person(r), M: 50 * r.int(6, 12), h: r.int(8, 12), w: r.int(18, 22), E: 50 * r.int(8, 12) }; }, function (s) { var a = [s.M + s.h * s.w, s.h * s.w + s.E, s.M + s.w + s.E, s.M + s.h * s.w + s.E]; return a.every(function (x, i) { return a.indexOf(x) === i; }); }, { p: person(r), M: 450, h: 10, w: 20, E: 500 });
        var hp = v.h * v.w, B = v.M + hp + v.E;
        return K.P.mc(r, v.p.n + ' bids on a job. The materials cost ' + t(M(v.M)) + '. ' + v.p.He + ' will pay a helper for ' + v.h + ' hours at ' + t(M(v.w)) + ' per hour. ' + v.p.He + ' wants to earn ' + t(M(v.E)) + ' for ' + v.p.him + 'self. What should ' + v.p.he + ' bid?', [
          { html: t(M(v.M + hp)), why: 'That leaves out ' + v.p.his + ' own pay.', code: 'own' }, { html: t(M(hp + v.E)), why: 'That leaves out the materials.', code: 'mat' },
          { html: t(M(v.M + v.w + v.E)), why: 'The helper costs ' + t(v.h + '\\times ' + M(v.w)) + ', not ' + t(M(v.w)) + '.', code: 'hours' }, { html: t(M(B)), right: true }],
          t(M(v.M) + '+' + v.h + '\\times ' + M(v.w) + '+' + M(v.E) + '=' + M(v.M) + '+' + M(hp) + '+' + M(v.E) + '=' + M(B)) + '.', ['Bid = materials + helper + own pay.'], 'MC Kai', true);
      } }] },
      { num: '11', stem: '', parts: [{ id: 'e11', level: 'BEG', make: function (r) {
        var rate = cents(r, 1.25, 2.25, 25), n = r.int(40, 90), pay = q(n * rate);
        return nPart('<b>Numerical response.</b> A sewing worker is paid ' + t(M(rate)) + ' for each pillowcase. She earned ' + t(M(pay)) + '. The number of pillowcases she sewed is ________.', n, null, [[q(pay * rate), 'u2l4-mult', 'pieces = pay ÷ rate.'], [q(rate / pay), 'u2l4-divided', 'Divide the pay by the rate.']],
          sol([t(M(pay) + '\\div ' + M(rate) + '=' + n) + ' pillowcases', 'Check: ' + t(n + '\\times ' + M(rate) + '=' + M(pay)) + ' ✓']), ['pieces = pay ÷ rate.'], 'NR pillowcases', { nr: true });
      } }] },
      { num: '12', section: 'C. Stretch', stem: function (sh) { return 'A small landscaping company finished four contracts this summer, worth ' + sh.c.slice(0, 3).map(function (x) { return t(M(x)); }).join(', ') + ' and ' + t(M(sh.c[3])) + '. Its materials, wages and other costs added up to ' + t('\\$' + HW.fmt(sh.cost.toFixed(2))) + '.'; },
        shared: function (r) { return find(function () { var c = [0, 0, 0, 0].map(function () { return 25 * r.int(80, 280); }), T = sum(c); return { c: c, cost: 100 * Math.round(T * r.pick([0.7, 0.72, 0.74, 0.76, 0.78]) / 100) }; }, function (s) { var T = sum(s.c), P = (T - s.cost) / T * 100; return !near(P, rnd(P, 1)) && s.cost < T; }, { c: [3850, 5200, 2475, 6100], cost: 13400 }); },
        parts: [
          { id: 'e12a', level: 'EMG', make: function (r, sh) { var T = sum(sh.c), P = q(T - sh.cost); return mPart('What was the company’s total profit?', P, [[T, 'u2l4-bid-for-profit', 'That’s the money from the contracts. Subtract the costs.']], sol(['Total: ' + t(sh.c.map(function (x) { return dS(x); }).join('+') + '=\\$' + HW.fmt(T.toFixed(2))), 'Profit: ' + t('\\$' + HW.fmt(T.toFixed(2)) + '-\\$' + HW.fmt(sh.cost.toFixed(2)) + '=' + M(P))]), ['Add the four contracts, then subtract the costs.'], 'landscape profit'); } },
          { id: 'e12b', level: 'PRG', make: function (r, sh) { var T = sum(sh.c), P = T - sh.cost, pc = P / T * 100, ans = rnd(pc, 1);
            var p = { prompt: 'What percent of the money from the contracts was profit? Round to one decimal place.', input: { type: 'number', after: '%' },
              check: PK.pct(pc, 1, U.dg(clean([[P / sh.cost * 100, 'u2l4-div-costs', 'Divide the profit by the money from the contracts (' + t('\\$' + HW.fmt(T.toFixed(2))) + '), not by the costs.'], [sh.cost / T * 100, 'u2l4-costs-pct', 'That’s the costs as a percent. Use the profit.'], [P, 'u2l4-dollars', 'That’s the profit in dollars. Divide by the money from the contracts, then × 100.']], pc, 1), 1)),
              key: ans.toFixed(1), answer: t(ans.toFixed(1) + '\\%'), solution: t(HW.fmt(dS(P)) + '\\div ' + HW.fmt(dS(T)) + '\\times 100=' + dS(rnd(pc, 3)) + '\\ldots\\approx ' + ans.toFixed(1) + '\\%'), hints: ['Percent = profit ÷ total from the contracts × 100.'], text: 'landscape pct' };
            p.bad = [dS(rnd(P / sh.cost * 100, 1))]; return p; } }] },
      { num: '13', stem: function (sh) { return 'A contractor bids ' + t(M(sh.B)) + ' to install kitchen cabinets. His costs (cabinets, hardware and a helper) are ' + t(M(sh.C)) + '. He expects to work ' + sh.H + ' hours.'; },
        shared: function (r) { return find(function () { var B = 100 * r.int(70, 95); return { B: B, C: 10 * Math.round(B * (0.62 + r.int(0, 10) / 100) / 10), H: r.pick([40, 42, 44, 45, 48, 50, 52, 56]), d: r.pick([8, 5, 10, 12, 8]), T: 5 * r.int(8, 10) }; },
          function (s) { var E = s.B - s.C, B2 = s.B * (1 - s.d / 100), E2 = B2 - s.C, low = s.C + s.H * s.T; return E > 1500 && E2 > 600 && near(B2, r2(B2)) && low < s.B && low > B2 && near(E / s.H, r2(E / s.H)); }, { B: 8500, C: 5920, H: 48, d: 8, T: 45 }); },
        parts: [
          { id: 'e13a', level: 'EMG', make: function (r, sh) { var E = sh.B - sh.C, e = q(E / sh.H); return mPart('What is his effective hourly rate?', e, [[q(sh.B / sh.H), 'u2l4-no-costs', 'Subtract the costs first.'], [E, 'u2l4-earn-not-rate', 'That’s his earnings. Divide by the hours.']], sol([t(M(sh.B) + '-' + M(sh.C) + '=' + M(E)) + '; ' + t(M(E) + '\\div ' + sh.H + eqM(e)) + ' per hour']), ['(price − costs) ÷ hours.'], 'cab rate', { after: '/h' }); } },
          { id: 'e13b', level: 'ADV', make: function (r, sh) { var B2 = q(sh.B * (1 - sh.d / 100)), E2 = q(B2 - sh.C), e2 = q(E2 / sh.H), E = sh.B - sh.C;
            return mPart('The customer asks for ' + sh.d + '% off. What is his effective hourly rate at the lower price? Round to the nearest cent.', e2, [[q(E * (1 - sh.d / 100) / sh.H), 'u2l4-same-pct', 'Take ' + sh.d + '% off the <b>price</b>, then subtract the costs. The costs don’t go down.'], [q(B2 / sh.H), 'u2l4-no-costs', 'Subtract the costs from the new price first.'], [q((sh.B - sh.d - sh.C) / sh.H), 'u2l4-pct-dollars', 'Take ' + sh.d + '% of the price off, not ' + sh.d + ' dollars.'], [q(E / sh.H), 'u2l4-old-cost', 'Use the lower price.'], [E2, 'u2l4-earn-not-rate', 'That’s his earnings. Divide by the hours.']],
              sol(['Price: ' + t(M(sh.B) + '\\times ' + dS(1 - sh.d / 100) + '=' + M(B2)) + '; earnings: ' + t(M(B2) + '-' + M(sh.C) + '=' + M(E2)), 'Per hour: ' + t(M(E2) + '\\div ' + sh.H + eqM(e2))]), ['New price = price × (1 − ' + dS(sh.d / 100) + ').', 'Then (new price − costs) ÷ hours.'], 'cab cut', { after: '/h' }); } },
          { id: 'e13c', level: 'MAS', make: function (r, sh) { var own = sh.H * sh.T, low = sh.C + own;
            return mPart('He wants to earn at least ' + t(M(sh.T)) + ' per hour. What is the lowest price he should accept?', low, [[own, 'u2l4-only-own', 'That’s only his own pay. The price must also cover the costs, ' + t(M(sh.C)) + '.'], [sh.C + sh.T, 'u2l4-no-hours', 'He needs ' + t(M(sh.T)) + ' for <b>each</b> of the ' + sh.H + ' hours.'], [q(sh.B - own), 'u2l4-added-cost', 'Start from the costs and add the pay he needs.'], [q(own - sh.C), 'u2l4-added-cost', 'Add the costs to his pay.']],
              sol(['He needs ' + t(sh.H + '\\times ' + M(sh.T) + '=' + M(own)) + ' for himself.', 'Lowest price: ' + t(M(sh.C) + '+' + M(own) + '=' + M(low))]), ['How much does he need for himself for ' + sh.H + ' hours?', 'The price must cover that and the costs.'], 'cab lowest'); } }] },
      { num: '14', stem: '', parts: [{ id: 'e14', level: 'ADV', make: function (r) {
        var v = { p: person(r), rate: cents(r, 0.15, 0.2, 1), n: 100 * r.int(16, 22), d: r.int(5, 7), h: r.pick([9, 10, 10, 11]), fee: 5 * r.int(4, 6) };
        var pay = q(v.d * v.n * v.rate), fees = v.d * v.fee, keep = q(pay - fees), hrs = v.d * v.h, e = q(keep / hrs);
        return fPart('Tree planters often live in a camp and pay a camp fee for food. ' + v.p.n + ' plants for ' + t(M(v.rate)) + ' per tree. In ' + v.d + ' days ' + v.p.he + ' plants ' + N(v.n) + ' trees each day, working ' + v.h + ' hours a day. ' + v.p.His + ' camp fee is ' + t(M(v.fee)) + ' per day. What does ' + v.p.he + ' keep after the camp fee, and what does that work out to per hour?', [
          { label: 'Keeps:', name: 'Keeps', kind: 'money', ans: keep, list: [[q(pay - v.fee), 'u2l4-camp-once', 'The fee is ' + t(M(v.fee)) + ' for <b>each</b> of the ' + v.d + ' days.'], [pay, 'u2l4-no-fee', 'Take off the camp fees.'], [q(v.n * v.rate - v.fee), 'u2l4-one-day', 'That’s one day. ' + v.p.He + ' planted for ' + v.d + ' days.']] },
          { label: 'Per hour:', name: 'Per hour', kind: 'money', after: '/h', ans: e, list: [[q(keep / v.h), 'u2l4-one-day', 'Divide by all the hours: ' + t(v.d + '\\times ' + v.h) + '.'], [q(pay / hrs), 'u2l4-no-fee', 'Use what ' + v.p.he + ' keeps after the camp fees.'], [q((pay - v.fee) / hrs), 'u2l4-camp-once', 'The fee is taken off for every day.']] }],
          sol(['Pay: ' + t(v.d + '\\times ' + N(v.n) + '\\times ' + M(v.rate) + '=' + M(pay)) + '; camp fee: ' + t(v.d + '\\times ' + M(v.fee) + '=' + M(fees)), v.p.He + ' keeps ' + t(M(pay) + '-' + M(fees) + '=' + M(keep)) + '.', 'Hours: ' + t(v.d + '\\times ' + v.h + '=' + hrs) + '; per hour: ' + t(M(keep) + '\\div ' + hrs + eqM(e))]),
          ['Pay for all the days, minus the camp fee for all the days.', 'Divide by all the hours worked.'], 'Mira camp');
      } }] }
    ]
  });
})(window);
