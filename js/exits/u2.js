/* Math 10-3 · Unit 2 (Earning an Income) — exit slips for Lessons 1–8 (u2l1x … u2l8x), written in test mode. Calculator
 * allowed (as in every Math 10-3 lesson). Each slip is 4 short questions on the lesson's core skill — Beginning,
 * Progressing, Progressing, Mastery — about 5–8 minutes, with new numbers for every student. Constants as the booklet
 * gives them: Alberta minimum wage $15.00/h (under 18, school in session: $13.00/h for the first 28 h a week); overtime
 * over 8 h a day or 44 h a week, whichever is more, at 1.5 × the wage; example rates CPP 5.95%, EI 1.64%, income tax as given.
 * Lesson 1 is a refresher (outcome REV: its slip is written like the others but never counts toward a level); Lessons 2–7
 * are N2; Lesson 8 (rearranging the pay formulas) is A1.
 *   2.1 minutes to decimal hours · decimal hours to h and min · elapsed time across noon (h and min) · a 24-hour
 *       timesheet with unpaid breaks → hours worked
 *   2.2 gross pay for h and min · the pay for one pay period · a student's week at the lowest legal wage (28 h at
 *       $13.00, the rest at $15.00; summer: all at $15.00) · a percent raise: the new wage and how much more a week
 *   2.3 a time-and-a-half or double-time rate · gross pay with overtime hours (a three-decimal overtime rate) ·
 *       Alberta 8/44: the overtime hours for a week · a biweekly pay where each week's overtime is counted on its own
 *   2.4 piecework pay · the effective hourly rate of piecework · a contractor's effective hourly rate · the percent drop
 *       in a contractor's earnings when the bid is cut
 *   2.5 straight commission · salary plus commission · over a quota, or graduated · which plan pays more at a given
 *       sales (base + commission against a graduated commission), and by how much
 *   2.6 a tip · pooled tips shared by hours · a shift premium on the night hours · total gross pay (overtime, a premium
 *       and a bonus)
 *   2.7 one deduction · net pay · the percent of gross pay taken home · the income tax saved by before-tax deductions
 *   2.8 hours (or the rate) from the pay · whole hours for a gross target (round up) · the sales for a graduated
 *       commission target · the whole overtime hours to reach a weekly target (round up)
 * Multiple choice is not used. Shared helpers and the u2t- codes come from the Unit 2 test (HW.u2assess,
 * js/lessons/u2test.js, which loads first); several slips use the test's own generators (gross pay for h and min, pay
 * periods, overtime rate, 8/44 hours, piecework, contract, commission, quota / graduated, tip, pooled tips, deduction,
 * hours and rate) with new numbers. Codes only the slips use are u2x-, with labels and partial-credit decisions below. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var A = HW.u2assess;
  if (!A) throw new Error('js/exits/u2.js needs HW.u2assess from js/lessons/u2test.js: load it first');
  var rd = A.rd, r2 = A.r2, q = A.q, near = A.near, nS = A.nS, N = A.N, c2 = A.c2, Mt = A.Mt, MM = A.MM, MH = A.MH, raw5 = A.raw5, toM = A.toM, toN = A.toN, find = A.find, br = A.br, cap = A.cap, pickR = A.pickR;
  var dec = A.dec, pctT = A.pctT, hmT = A.hmT, clock = A.clock, person = A.person, people = A.people, amtPart = A.amtPart, amtChk = A.amtChk, upPart = A.upPart, mfld = A.mfld, fieldsPart = A.fieldsPart, whichAmtPart = A.whichAmtPart, table = A.table, pctDiag = A.pctDiag, readNum = A.readNum;
  var MINW = A.MINW, STUW = A.STUW, STUH = A.STUH, CPP = A.CPP, EI = A.EI, DAYS = A.DAYS;

  HW.addCodes({
    'u2x-min-dec': 'Minutes written as a decimal (40 min as 0.40 h)', 'u2x-no-whole': 'Left out the whole hours', 'u2x-mins': 'Gave the time in minutes',
    'u2x-dec-as-min': 'Read the decimal digits as minutes (5.3 h as 5 h 30 min)', 'u2x-regroup': 'Did not trade 60 min for 1 h', 'u2x-dec-sub': 'Subtracted clock times like decimals (100 min in an hour)',
    'u2x-hour-off': 'Elapsed time off by an hour (counting up)', 'u2x-break': 'Unpaid break not taken off', 'u2x-stu-all13': 'Paid every hour at the student wage (past 28 h)',
    'u2x-stu-all15': 'Paid the full minimum wage on the first 28 h', 'u2x-stu-summer': 'Used the student wage in the summer', 'u2x-stu-28only': 'Paid only the first 28 h',
    'u2x-raise-dollars': 'Raise added as dollars instead of a percent', 'u2x-raise-total': 'Gave the new weekly pay instead of the difference', 'u2x-raise-hourly': 'Gave the raise per hour instead of per week',
    'u2x-early-round': 'Rounded the overtime rate before multiplying', 'u2x-two-weeks': 'Counted the two weeks’ overtime together', 'u2x-one-week': 'Gave one week’s pay instead of both',
    'u2x-pieces-hr': 'Gave the pieces per hour instead of the pay per hour', 'u2x-gave-pay': 'Gave the pay instead of the pay per hour', 'u2x-same-pct': 'Took the earnings drop to be the same percent as the price cut',
    'u2x-gave-drop': 'Gave the drop in dollars instead of the percent', 'u2x-div-new': 'Percent drop: divided by the new earnings', 'u2x-pct-base': 'Took the percent of the base pay',
    'u2x-plan-total': 'Gave a plan’s pay instead of the difference', 'u2x-grad-all': 'Graduated plan: higher rate on all the sales', 'u2x-prem-all': 'Premium paid on every hour',
    'u2x-prem-once': 'Premium added only once', 'u2x-no-prem': 'Left out the premium', 'u2x-no-bonus': 'Left out the bonus', 'u2x-only-tax': 'Took off only the income tax',
    'u2x-left-out': 'Left a deduction out', 'u2x-ded-pct': 'Gave the deductions percent instead of the take-home percent', 'u2x-gave-tax': 'Gave the income tax instead of the saving',
    'u2x-gave-pretax': 'Gave the before-tax deductions instead of the tax saved', 'u2x-grad-noadd': 'Did not add the first level back to the sales', 'u2x-grad-low': 'Lower rate on all the sales',
    'u2x-ot-reg': 'Overtime hours at the regular rate', 'u2x-gave-net': 'Gave the net pay instead of the percent', 'u2x-no-reg': 'Did not take off the regular pay first'
  });
  HW.addPartial({
    'u2x-min-dec': 'b', 'u2x-no-whole': 'b', 'u2x-mins': 'n', 'u2x-dec-as-min': 'n', 'u2x-regroup': 's', 'u2x-dec-sub': 'n', 'u2x-hour-off': 'b', 'u2x-break': 'b', 'u2x-stu-all13': 'b', 'u2x-stu-all15': 'b',
    'u2x-stu-summer': 'b', 'u2x-stu-28only': 'b', 'u2x-raise-dollars': 'n', 'u2x-raise-total': 'b', 'u2x-raise-hourly': 'b', 'u2x-early-round': 's', 'u2x-two-weeks': 'b', 'u2x-one-week': 'b',
    'u2x-pieces-hr': 'n', 'u2x-gave-pay': 'b', 'u2x-same-pct': 'n', 'u2x-gave-drop': 'b', 'u2x-div-new': 'b', 'u2x-pct-base': 'n', 'u2x-plan-total': 'b', 'u2x-grad-all': 'b', 'u2x-prem-all': 'b',
    'u2x-prem-once': 'b', 'u2x-no-prem': 'b', 'u2x-no-bonus': 'b', 'u2x-only-tax': 'b', 'u2x-left-out': 'b', 'u2x-ded-pct': 'b', 'u2x-gave-tax': 'b', 'u2x-gave-pretax': 'b', 'u2x-grad-noadd': 'b',
    'u2x-grad-low': 'n', 'u2x-ot-reg': 'b', 'u2x-no-reg': 'n', 'u2x-gave-net': 'b'
  });
  function Q(num, outcome, level, make, text) { return { num: String(num), outcome: outcome, text: text, parts: [{ id: String(num), outcome: outcome, level: level, make: make }] }; }
  function QS(num, outcome, level, shared, stem, make, text) { return { num: String(num), outcome: outcome, text: text, shared: shared, stem: stem, parts: [{ id: String(num), outcome: outcome, level: level, make: make }] }; }
  /* a time in hours and minutes, typed in two boxes. diag [{h, m, code, hint}]; 75 min (the right total, not regrouped) gets a nudge */
  function hmPart(prompt, mins, o) {
    o = o || {};
    var H = Math.floor(mins / 60), M = mins % 60, dg = (o.diag || []).filter(function (d) { return d && !(d.h === H && d.m === M); });
    var check = function (resp) {
      resp = resp || [];
      var a = readNum(resp[0]), b = readNum(resp[1]);
      if (a.res || b.res) return form('empty', 'Fill in both boxes: hours and minutes (type 0 if there are none).');
      var h = a.v, m = b.v;
      if (!near(h, Math.round(h)) || !near(m, Math.round(m))) return form('u2x-whole', 'Give whole hours and whole minutes (like 5 h 18 min).');
      if (near(h, H) && near(m, M)) return ok();
      for (var i = 0; i < dg.length; i++) if (near(h, dg[i].h) && near(m, dg[i].m)) return wrong(dg[i].code, dg[i].hint);
      if (m >= 60 && near(h * 60 + m, mins)) return form('u2x-regroup', 'Right amount — now trade 60 min for 1 h, so the minutes are less than 60.');
      return wrong('value', o.miss || null);
    };
    return { prompt: prompt, input: { type: 'fields', fields: [{ label: 'Hours:', name: 'Hours', after: 'h' }, { label: 'Minutes:', name: 'Minutes', after: 'min' }] }, check: check, key: [String(H), String(M)],
      answer: t(hmT(mins)), solution: o.sol, hints: o.hints || [], text: o.text, bad: dg.map(function (d) { return [String(d.h), String(d.m)]; }).concat([[String(H), String(M + 1)]]) };
  }
  HW.addCodes({ 'u2x-whole': 'Not whole hours and minutes' });

  /* =====================================================================================================
   * 2.1 Time math (REV)
   * ===================================================================================================== */
  function l1q1(r) {
    var h = r.int(2, 9), m = r.pick([20, 40, 50, 10, 35, 25, 55, 5, 45, 15]), x = h + m / 60;
    return amtPart('Change ' + t(h + '\\text{ h }' + m + '\\text{ min}') + ' to decimal hours. Round to 2 decimal places if needed.', x, { dp: 2, plain: true, after: 'h',
      diag: [{ v: h + m / 100, code: 'u2x-min-dec', hint: 'The digits after the decimal point are not minutes. Divide the minutes by 60: ' + t(m + '\\div 60') + '.' }, { v: m / 60, code: 'u2x-no-whole', hint: 'Add the ' + t(h) + ' whole hours too.' },
        { v: 60 * h + m, code: 'u2x-mins', hint: 'That’s the time in minutes. The question asks for hours.' }, { v: h + 60 / m, code: 'u2t-flip', hint: 'Divide the minutes by 60 (not 60 by the minutes).' }],
      sol: br([t(m + '\\div 60' + toN(m / 60, 2)), 'so ' + t(h + '\\text{ h }' + m + '\\text{ min}' + toN(x, 2) + '\\text{ h}')]), hints: ['Minutes ÷ 60 gives part of an hour.', 'Then add the whole hours.'], text: 'min to decimal h' });
  }
  function l1q2(r) {
    var h = r.int(2, 9), f = r.pick([0.1, 0.2, 0.3, 0.4, 0.6, 0.7, 0.8, 0.9, 0.15, 0.35, 0.45, 0.65, 0.85, 0.05]), x = q(h + f), m = Math.round(f * 60), dig = Math.round(f * 100);
    var diag = [{ h: h, m: dig, code: 'u2x-dec-as-min', hint: 'The decimal part is part of an <b>hour</b>, not minutes: ' + t(nS(f) + '\\times 60=' + m) + ' min.' }];
    if (dig < 10) diag.push({ h: h, m: dig * 10, code: 'u2x-dec-as-min', hint: 'Multiply only the decimal part by 60: ' + t(nS(f) + '\\times 60=' + m) + '.' });
    return hmPart('Change ' + t(nS(x) + '\\text{ h}') + ' to hours and minutes.', 60 * h + m, { diag: diag,
      sol: br(['Multiply only the decimal part by 60: ' + t(nS(f) + '\\times 60=' + m) + ' min', 'so ' + t(nS(x) + '\\text{ h}=' + h + '\\text{ h }' + m + '\\text{ min}')]), hints: ['Keep the whole hours.', 'Decimal part × 60 = minutes.'], text: 'decimal h to h and min' });
  }
  function l1q3(r) {
    var v = find(function () { var st = 60 * r.int(6, 11) + 5 * r.int(1, 11), en = 60 * r.int(13, 18) + 5 * r.int(0, 11); return { st: st, en: en }; }, function (v) { return v.st % 60 > v.en % 60 && v.en % 60 !== 0; });
    var mins = v.en - v.st, H = Math.floor(mins / 60), M = mins % 60, p = person(r);
    var D = Math.round(((Math.floor(v.en / 60) + (v.en % 60) / 100) - (Math.floor(v.st / 60) + (v.st % 60) / 100)) * 100), dh = Math.floor(D / 100), dm = D % 100;
    var diag = [{ h: dh, m: dm, code: 'u2x-dec-sub', hint: 'An hour has 60 minutes, not 100. Count up: to the next full hour, then the whole hours, then the minutes left.' }, { h: H + 1, m: M, code: 'u2x-hour-off', hint: 'Count up again: first to the next <b>full</b> hour, then the whole hours.' }, { h: H - 1, m: M, code: 'u2x-hour-off', hint: 'Count up again: first to the next full hour, then the whole hours, then the minutes.' }];
    var nx = Math.ceil(v.st / 60) * 60;
    return hmPart(p.n + '’s shift starts at ' + clock(v.st) + ' and ends at ' + clock(v.en) + '. How long is the shift, in hours and minutes?', mins, { diag: diag,
      sol: br(['Count up: ' + clock(v.st) + ' to ' + clock(nx) + ' is ' + t(hmT(nx - v.st)) + '; to ' + clock(Math.floor(v.en / 60) * 60) + ' is ' + t(hmT(Math.floor(v.en / 60) * 60 - nx)) + ' more; to ' + clock(v.en) + ' is ' + t(hmT(v.en % 60)) + ' more.', 'In all: ' + t(hmT(mins))]),
      hints: ['Jump to the next full hour first.', 'Then jump the whole hours, then the minutes left. Add the jumps.'], text: 'elapsed time across noon' });
  }
  function l1q4(r) {
    var p = person(r), rows = A.sheetShifts(r, r.pick([2, 3])), H = rows.reduce(function (s, x) { return s + x.h; }, 0);
    var noBrk = rows.reduce(function (s, x) { return s + x.len / 60; }, 0), asDec = rows.reduce(function (s, x) { var w = x.len - x.brk; return s + Math.floor(w / 60) + (w % 60) / 100; }, 0);
    return amtPart(p.n + '’s timesheet uses the 24-hour clock.' + A.sheetTable(rows, true) + 'How many hours did ' + p.he + ' work in all? Give the answer in decimal hours.', H, { dp: 2, plain: true, after: 'h',
      diag: [{ v: noBrk, code: 'u2x-break', hint: 'Take each unpaid break off that day’s time.' }, { v: asDec, code: 'u2x-min-dec', hint: 'Write the minutes as part of an hour (30 min = 0.5 h, 45 min = 0.75 h), not as 0.30 or 0.45.' }],
      sol: br(A.sheetLines(rows).concat(['Total: ' + t(rows.map(function (x) { return nS(x.h); }).join('+') + '=' + nS(H)) + ' h'])),
      hints: ['After 12:00, subtract 12 to read the 24-hour clock (15:30 is 3:30 p.m.).', 'Each day: time from start to end, minus the unpaid break. Then add.'], text: 'timesheet hours (24-h clock)' });
  }
  HW.defineExit({ lesson: 'u2l1', outcome: 'REV', calc: true, blurb: 'Time math: minutes as decimal hours, decimal hours as hours and minutes, elapsed time, and the hours on a timesheet.',
    questions: [Q(1, 'REV', 'BEG', l1q1, 'Minutes to decimal hours'), Q(2, 'REV', 'PRG', l1q2, 'Decimal hours to h and min'), Q(3, 'REV', 'PRG', l1q3, 'Elapsed time across noon'), Q(4, 'REV', 'MAS', l1q4, 'Timesheet hours with breaks (24-h clock)')] });

  /* =====================================================================================================
   * 2.2 Wages and salaries (N2)
   * ===================================================================================================== */
  var MONTHS_SCHOOL = ['October', 'November', 'February', 'March', 'April', 'May'], MONTHS_SUMMER = ['July', 'August'];
  function l2q3(r) {
    var p = person(r), age = r.pick([16, 17, 15]), kind = r.pick(['over', 'over', 'over', 'under', 'summer']), mo = kind === 'summer' ? r.pick(MONTHS_SUMMER) : r.pick(MONTHS_SCHOOL);
    var H = kind === 'over' ? r.int(29, 38) : kind === 'under' ? r.int(14, 27) : r.int(22, 38), G = kind === 'summer' ? H * MINW : Math.min(H, STUH) * STUW + Math.max(0, H - STUH) * MINW;
    var diag = kind === 'summer' ? [{ v: H * STUW, code: 'u2x-stu-summer', hint: 'In the summer (no school), every hour must be paid at least ' + MH(MINW) + '.' }, { v: Math.min(H, STUH) * STUW + Math.max(0, H - STUH) * MINW, code: 'u2x-stu-summer', hint: 'The ' + MH(STUW) + ' student wage is only while school is in session. ' + mo + ' is summer.' }]
      : [{ v: H * MINW, code: 'u2x-stu-all15', hint: 'In ' + mo + ', school is in session and ' + p.n + ' is under 18: the first 28 h can be paid at ' + MH(STUW) + '.' }];
    if (kind === 'over') diag.push({ v: H * STUW, code: 'u2x-stu-all13', hint: 'Only the <b>first 28 h</b> can be paid at ' + MH(STUW) + '. The other ' + (H - STUH) + ' h must be paid at least ' + MH(MINW) + '.' }, { v: STUH * STUW, code: 'u2x-stu-28only', hint: 'Pay the hours past 28 too, at ' + MH(MINW) + '.' });
    return amtPart(p.n + ' is ' + age + ' and works at a ' + r.pick(['sporting goods store', 'bakery', 'garden centre', 'grocery store', 'pizza place']) + '. ' + cap(p.his) + ' employer pays the lowest wage Alberta’s rules allow. In one week in ' + mo + ', ' + p.he + ' works ' + t(H) + ' hours. What is ' + p.his + ' gross pay?', G, { diag: diag,
      sol: kind === 'summer' ? br([mo + ' is summer: all hours at least ' + MH(MINW) + '.', t(H + '\\times ' + Mt(MINW) + '=' + Mt(G))]) : kind === 'under' ? br(['School is in and ' + p.he + ' is under 18, with no more than 28 h: ' + MH(STUW) + '.', t(H + '\\times ' + Mt(STUW) + '=' + Mt(G))])
        : br(['First 28 h at ' + MH(STUW) + ': ' + t('28\\times ' + Mt(STUW) + '=' + Mt(STUH * STUW)), 'The other ' + t(H - STUH) + ' h at ' + MH(MINW) + ': ' + t((H - STUH) + '\\times ' + Mt(MINW) + '=' + Mt((H - STUH) * MINW)), 'Gross: ' + t(Mt(STUH * STUW) + '+' + Mt((H - STUH) * MINW) + '=' + Mt(G))]),
      hints: ['Students under 18 can be paid $13.00/h for the first 28 h a week, but only while school is in session.', 'Hours past 28, and all summer hours, are at least $15.00/h.'], text: 'student minimum wage week' });
  }
  function l2q4(r) {
    var p = person(r), v = find(function () { return { w: pickR(r, [15.5, 24, 0.25]), pc: r.pick([2, 3, 4, 5, 2.5, 3.5, 6]), h: r.pick([30, 35, 37.5, 40, 25, 32]) }; }, function (v) { return true; });
    var nw = v.w * (1 + v.pc / 100), more = r2(nw) * v.h - v.w * v.h, more2 = (nw - v.w) * v.h;
    var specs = [mfld('New hourly wage:', nw, { name: 'New wage', after: '/h', diag: [{ v: v.w + v.pc, code: 'u2x-raise-dollars', hint: 'A ' + t(pctT(v.pc)) + ' raise is not ' + t(Mt(v.pc)) + ' more: find ' + t(pctT(v.pc)) + ' of ' + MM(v.w) + '.' }, { v: v.w * v.pc / 100, code: 'u2x-raise-hourly', hint: 'That’s the raise. Add it to the old wage.' }] }),
      mfld('More each week:', more2, { name: 'More each week', alts: [more], diag: [{ v: nw * v.h, code: 'u2x-raise-total', hint: 'That’s the new weekly pay. Subtract the old weekly pay.' }, { v: nw - v.w, code: 'u2x-raise-hourly', hint: 'That’s the raise for one hour. Multiply by the ' + t(nS(v.h)) + ' hours a week.' }, { v: v.pc * v.h, code: 'u2x-raise-dollars', hint: 'Find the raise in dollars first: ' + t(Mt(v.w) + '\\times ' + dec(v.pc)) + '.' }] })];
    return fieldsPart(p.n + ' earns ' + MH(v.w) + ' and works ' + t(nS(v.h)) + ' hours a week. ' + cap(p.he) + ' gets a ' + t(pctT(v.pc)) + ' raise. What is ' + p.his + ' new hourly wage, and how much more does ' + p.he + ' earn each week?', specs,
      br(['Raise: ' + t(Mt(v.w) + '\\times ' + dec(v.pc) + toM(v.w * v.pc / 100)) + '; new wage ' + t(Mt(v.w) + '\\times ' + nS(1 + v.pc / 100) + toM(nw)) + '/h', 'More each week: ' + t(nS(v.h) + '\\times ' + Mt(v.w * v.pc / 100) + toM(more2)) + ' (or new weekly pay − old weekly pay)']),
      ['Raise per hour = old wage × the percent (as a decimal).', 'More each week = raise per hour × hours a week.'], 'percent raise');
  }
  HW.defineExit({ lesson: 'u2l2', outcome: 'N2', calc: true, blurb: 'Wages and salaries: gross pay for hours and minutes, the pay for a pay period, a student’s minimum-wage week, and a percent raise.',
    questions: [Q(1, 'N2', 'BEG', function (r) { return A.grossHMPart(r); }, 'Gross pay for h and min'), Q(2, 'N2', 'PRG', function (r) { return A.periodPart(r); }, 'Pay per pay period'), Q(3, 'N2', 'PRG', l2q3, 'Student minimum-wage week'), Q(4, 'N2', 'MAS', l2q4, 'A percent raise: new wage and more each week')] });

  /* =====================================================================================================
   * 2.3 Overtime (N2)
   * ===================================================================================================== */
  function l3q2(r) {
    var p = person(r), v = find(function () { return { w: pickR(r, [16.15, 27.95, 0.05]), k: r.pick([2.5, 3.5, 4, 5.5, 6.5, 7, 3, 1.5]) }; }, function (v) { return !near(v.w * 1.5 * 100, Math.round(v.w * 150), 1e-6) || r.chance(0.3); });
    var w = v.w, k = v.k, O = 1.5 * w, G = 40 * w + k * O, Gr = 40 * w + k * r2(O);
    var diag = [{ v: (40 + k) * w, code: 'u2t-ot-none', hint: 'Pay the ' + t(nS(k)) + ' overtime hours at time and a half: ' + t(Mt(w) + '\\times 1.5') + '.' }, { v: (40 + k) * O, code: 'u2t-ot-all', hint: 'Only the overtime hours get time and a half; the 40 regular hours are at ' + MH(w) + '.' },
      { v: 40 * w + k * (w + 1.5), code: 'u2t-add15', hint: 'Time and a half is 1.5 <b>times</b> the wage, not ' + t('\\$1.50') + ' more.' }, { v: k * O, code: 'u2t-no-base', hint: 'That’s the overtime pay. Add the pay for the 40 regular hours.' }];
    if (!near(r2(Gr), r2(G))) diag.push({ v: Gr, code: 'u2x-early-round', hint: 'Don’t round the overtime rate (' + t(raw5(O)) + ') before you multiply: do the overtime pay in one line, ' + t(nS(k) + '\\times 1.5\\times ' + Mt(w)) + '.' });
    return amtPart(p.n + ' earns ' + MH(w) + '. This week ' + p.he + ' works ' + t(40) + ' regular hours and ' + t(nS(k)) + ' overtime hours at time and a half. What is ' + p.his + ' gross pay?', G, { diag: diag,
      sol: br(['Regular: ' + t('40\\times ' + Mt(w) + '=' + Mt(40 * w)), 'Overtime: ' + t(nS(k) + '\\times 1.5\\times ' + Mt(w) + toM(k * O)) + (near(O, r2(O)) ? '' : ' (the overtime rate ' + t(raw5(O)) + ' is not rounded)'), 'Gross: ' + t(Mt(40 * w) + '+' + Mt(k * O) + toM(G))]),
      hints: ['Overtime pay = overtime hours × 1.5 × wage. Don’t round the overtime rate first.', 'Gross = regular pay + overtime pay.'], text: 'gross with overtime hours' });
  }
  function l3q4(r) {
    var p = person(r), v = find(function () { return { w: pickR(r, [16, 24, 0.5]), a: r.int(45, 52), b: r.int(36, 43) }; }, function (v) { return v.a - 44 !== Math.max(0, v.a + v.b - 88); });
    var w = v.w, a = v.a, b = v.b, oa = a - 44, boss = Math.max(0, a + b - 88), G = A.otGross(w, a + b, oa), Gb = A.otGross(w, a + b, boss);
    return amtPart(p.n + ' is paid every two weeks (biweekly) at ' + MH(w) + '. In week 1 ' + p.he + ' worked ' + t(a) + ' hours. In week 2 ' + p.he + ' worked ' + t(b) + ' hours. No day was longer than 8 hours. In Alberta, weekly overtime (over 44 h) is counted for each week on its own, at time and a half. What is ' + p.his + ' gross pay for the two weeks?', G, {
      diag: [{ v: Gb, code: 'u2x-two-weeks', hint: 'Don’t add the two weeks first. Count the hours over 44 in <b>each</b> week on its own: week 1 has ' + t(a + '-44=' + oa) + ' h.' }, { v: (a + b) * w, code: 'u2t-ot-none', hint: 'Week 1 has ' + t(oa) + ' h over 44: pay them at ' + t(Mt(w) + '\\times 1.5') + '.' },
        { v: A.otGross(w, a, oa), code: 'u2x-one-week', hint: 'That’s week 1. Add week 2’s pay too.' }, { v: (a + b) * w + oa * 1.5 * w, code: 'u2t-ot-reg-all', hint: 'Regular hours = total − overtime hours. Don’t pay the overtime hours twice.' }],
      sol: br(['Week 1: ' + t(a + '-44=' + oa) + ' h of overtime; week 2: ' + t(b) + ' h is not over 44, so 0 h.', 'Regular hours: ' + t('44+' + b + '=' + (44 + b)) + '; ' + t((44 + b) + '\\times ' + Mt(w) + '=' + Mt((44 + b) * w)), 'Overtime: ' + t(oa + '\\times ' + Mt(1.5 * w) + toM(oa * 1.5 * w)), 'Gross: ' + t(Mt((44 + b) * w) + '+' + Mt(oa * 1.5 * w) + toM(G)) + (boss !== oa ? ' (Adding the weeks first would give only ' + t(boss) + ' h of overtime.)' : '')]),
      hints: ['Count the overtime in each week on its own: hours over 44.', 'Gross = regular hours × wage + overtime hours × 1.5 × wage.'], text: 'biweekly: overtime week by week' });
  }
  HW.defineExit({ lesson: 'u2l3', outcome: 'N2', calc: true, blurb: 'Overtime: time-and-a-half and double-time rates, gross pay with overtime, the Alberta 8/44 rule, and overtime counted week by week on a biweekly pay.',
    questions: [Q(1, 'N2', 'BEG', function (r) { return A.otRatePart(r); }, 'Overtime rate'), Q(2, 'N2', 'PRG', l3q2, 'Gross pay with overtime hours'), QS(3, 'N2', 'PRG', A.otShared, A.otStem, A.otHoursPart, 'Alberta 8/44: overtime hours'), Q(4, 'N2', 'MAS', l3q4, 'Biweekly: overtime week by week')] });

  /* =====================================================================================================
   * 2.4 Piecework and contracts (N2)
   * ===================================================================================================== */
  function l4q2(r) {
    var c = r.pick([['delivers flyers for', 'flyer', 'flyers', [6, 12], [1100, 1900, 25], [6, 9]], ['plants trees for', 'tree', 'trees', [12, 22], [1300, 2600, 50], [8, 11]], ['picks apples for', 'bin', 'bins', null, [8, 16, 1], [7, 9]]]), p = person(r);
    var v = find(function () { var rate = c[3] ? r.int(c[3][0], c[3][1]) / 100 : pickR(r, [18, 26, 0.5]), n = pickR(r, c[4]), h = pickR(r, [c[5][0], c[5][1], 0.5]); return { rate: rate, n: n, h: h, pay: n * rate }; }, function (v) { var e = v.pay / v.h; return e > 11 && e < 30; });
    var e = v.pay / v.h;
    return amtPart(p.n + ' ' + c[0] + ' ' + MM(v.rate) + ' a ' + c[1] + '. On Saturday ' + p.he + ' does ' + t(N(v.n)) + ' ' + c[2] + ' in ' + t(nS(v.h)) + ' h. What does ' + p.he + ' earn per hour (the effective hourly rate)?', e, { after: '/h',
      diag: [{ v: v.n / v.h, code: 'u2x-pieces-hr', hint: 'That’s ' + c[2] + ' per hour. Find the pay first (' + c[2] + ' × rate), then divide by the hours.' }, { v: v.pay, code: 'u2x-gave-pay', hint: 'That’s the pay for the day. Divide by the ' + t(nS(v.h)) + ' hours.' }, { v: v.h / v.pay, code: 'u2t-flip', hint: 'Pay per hour = pay ÷ hours.' }],
      sol: br(['Pay: ' + t(N(v.n) + '\\times ' + Mt(v.rate) + toM(v.pay)), 'Per hour: ' + t(Mt(v.pay) + '\\div ' + nS(v.h) + toM(e)) + (r2(e) >= MINW ? ' (at least the ' + MH(MINW) + ' minimum wage)' : ' (less than the ' + MH(MINW) + ' minimum wage: the employer must add the difference)')]),
      hints: ['Find the pay: number of pieces × rate.', 'Effective hourly rate = pay ÷ hours.'], text: 'piecework per hour' });
  }
  function l4q4(r) {
    var p = person(r), job = r.pick(['to paint a garage', 'to build a fence', 'to tile a kitchen', 'to landscape a yard']);
    var v = find(function () { var B = pickR(r, [1800, 4800, 100]), M = pickR(r, [300, 1100, 10]), hw = pickR(r, [16, 20, 0.5]), hh = r.int(10, 24), d = r.pick([5, 10, 8, 12, 15]); return { B: B, M: M, hw: hw, hh: hh, d: d, E: B - M - hw * hh }; }, function (v) { return v.E > 500 && v.E < v.B * 0.7; });
    var cut = v.B * v.d / 100, E2 = v.E - cut, pc = cut / v.E * 100;
    return amtPart(p.n + ' plans to bid ' + MM(v.B) + ' ' + job + '. Materials cost ' + MM(v.M) + ', and a helper earns ' + MH(v.hw) + ' for ' + t(v.hh) + ' h. To win the job, ' + p.he + ' cuts the bid by ' + t(pctT(v.d)) + '. The materials and the helper cost the same. By what percent do ' + p.his + ' own earnings drop? (Round to the nearest tenth.)', pc, { dp: 1, pct: true,
      diag: [{ v: v.d, code: 'u2x-same-pct', hint: 'The costs don’t go down, so ' + p.his + ' earnings drop by <b>more</b> than ' + t(pctT(v.d)) + '. Find the earnings before and after.' }, { v: cut, code: 'u2x-gave-drop', hint: 'That’s the drop in dollars. Divide it by the earnings <b>before</b> the cut and multiply by 100.' },
        { v: cut / E2 * 100, code: 'u2x-div-new', hint: 'Divide the drop by the <b>original</b> earnings (before the cut).' }, { v: E2 / v.E * 100, code: 'u2x-div-new', hint: 'That’s the new earnings as a percent of the old. Find the drop first: old − new.' }],
      sol: br(['Helper: ' + t(v.hh + '\\times ' + Mt(v.hw) + '=' + Mt(v.hw * v.hh)) + '; earnings before: ' + t(Mt(v.B) + '-' + Mt(v.M) + '-' + Mt(v.hw * v.hh) + '=' + Mt(v.E)), 'Cut: ' + t(Mt(v.B) + '\\times ' + dec(v.d) + '=' + Mt(cut)) + '; earnings after: ' + t(Mt(v.E) + '-' + Mt(cut) + '=' + Mt(E2)), 'Percent drop: ' + t(c2(cut) + '\\div ' + c2(v.E) + '\\times 100' + toN(pc, 1) + '\\%')]),
      hints: ['Earnings = bid − materials − helper. Find them before and after the cut.', 'Percent drop = drop ÷ earnings before × 100.'], text: 'contract: percent drop in earnings' });
  }
  HW.defineExit({ lesson: 'u2l4', outcome: 'N2', calc: true, blurb: 'Piecework and contracts: piecework pay, the effective hourly rate, a contractor’s hourly rate, and how a price cut changes a contractor’s earnings.',
    questions: [Q(1, 'N2', 'BEG', function (r) { return A.piecePart(r); }, 'Piecework pay'), Q(2, 'N2', 'PRG', l4q2, 'Effective hourly rate of piecework'), Q(3, 'N2', 'PRG', function (r) { return A.contractPart(r); }, 'Contract: effective hourly rate'), Q(4, 'N2', 'MAS', l4q4, 'Price cut: percent drop in earnings')] });

  /* =====================================================================================================
   * 2.5 Commission (N2)
   * ===================================================================================================== */
  function l5q2(r) {
    var p = person(r), per = r.pick(['a week', 'a month']), wk = per === 'a week', b = wk ? pickR(r, [300, 750, 25]) : pickR(r, [1200, 2400, 50]), pc = r.pick([2, 3, 4, 5, 6, 2.5, 7.5, 8]), S = wk ? pickR(r, [2500, 12000, 25]) : pickR(r, [9000, 42000, 25]), C = S * pc / 100, G = b + C;
    return amtPart(p.n + ' earns ' + MM(b) + ' ' + per + ' plus ' + t(pctT(pc)) + ' commission on all ' + p.his + ' sales. This ' + per.slice(2) + ' ' + p.his + ' sales are ' + MM(S) + '. What does ' + p.he + ' earn?', G, {
      diag: [{ v: b * (1 + pc / 100), code: 'u2x-pct-base', hint: 'The commission is a percent of the <b>sales</b>, not of the base pay.' }, { v: C, code: 'u2t-no-base', hint: 'That’s the commission. Add the ' + MM(b) + ' base pay.' }, { v: b + S * pc, code: 'u2t-pct-whole', hint: 'Change ' + t(pctT(pc)) + ' to a decimal: ' + t(dec(pc)) + '.' }, { v: b + S * pc / 10, code: 'u2t-pct-10', hint: t(pctT(pc) + '=' + dec(pc)) + ': two places left.' }],
      sol: br(['Commission: ' + t(Mt(S) + '\\times ' + dec(pc) + toM(C)), 'Total: ' + t(Mt(b) + '+' + Mt(C) + toM(G))]), hints: ['Find the commission first: sales × rate.', 'Then add the base pay.'], text: 'salary plus commission' });
  }
  function l5q4(r) {
    var p = person(r), v = find(function () {
      var b = pickR(r, [800, 2000, 100]), a = r.pick([2, 3, 4, 5]), p1 = r.pick([3, 4, 5, 6]), p2 = p1 + r.pick([2, 3, 4]), L = r.pick([10000, 20000, 25000]), S = pickR(r, [L + 5000, L * 4, 500]);
      var A0 = b + S * a / 100, B0 = L * p1 / 100 + (S - L) * p2 / 100; return { b: b, a: a, p1: p1, p2: p2, L: L, S: S, A0: A0, B0: B0 };
    }, function (v) { return Math.abs(v.A0 - v.B0) >= 40 && Math.abs(v.A0 - v.B0) <= 1500 && v.p2 > v.a; });
    var aMore = v.A0 > v.B0, d = Math.abs(v.A0 - v.B0), Ball = v.S * v.p2 / 100;
    return whichAmtPart(p.n + ' is choosing between two pay plans for a sales job.<br><b>Plan A:</b> ' + MM(v.b) + ' a month plus ' + t(pctT(v.a)) + ' of all sales.<br><b>Plan B:</b> no base pay; ' + t(pctT(v.p1)) + ' on the first ' + MM(v.L) + ' of sales and ' + t(pctT(v.p2)) + ' on the rest.<br>' + cap(p.he) + ' expects sales of ' + MM(v.S) + ' a month. Which plan pays more, and by how much?', { amt: d,
      whichLabel: 'Pays more (A or B):', whichName: 'Pays more', ph: 'A or B', right: [aMore ? 'a' : 'b'], wrongs: [aMore ? 'b' : 'a'], rightKey: 'Plan ' + (aMore ? 'A' : 'B'), wrongKey: 'Plan ' + (aMore ? 'B' : 'A'), why: 'Find the pay with each plan, then compare.', nudge: 'type A or B.',
      diag: [{ v: Math.abs(v.A0 - Ball), code: 'u2x-grad-all', hint: 'In Plan B, the ' + t(pctT(v.p2)) + ' is only on the sales above ' + MM(v.L) + '.' }, { v: Math.max(v.A0, v.B0), code: 'u2x-plan-total', hint: 'That’s one plan’s pay. Subtract to find how much more.' }, { v: Math.abs(v.S * v.a / 100 - v.B0), code: 'u2t-no-base', hint: 'Plan A also pays the ' + MM(v.b) + ' base.' }],
      sol: br(['Plan A: ' + t(Mt(v.b) + '+' + Mt(v.S) + '\\times ' + dec(v.a) + '=' + Mt(v.A0)), 'Plan B: ' + t(Mt(v.L) + '\\times ' + dec(v.p1) + '+' + Mt(v.S - v.L) + '\\times ' + dec(v.p2) + '=' + Mt(v.L * v.p1 / 100) + '+' + Mt((v.S - v.L) * v.p2 / 100) + '=' + Mt(v.B0)), '<b>Plan ' + (aMore ? 'A' : 'B') + '</b> pays ' + t(Mt(Math.max(v.A0, v.B0)) + '-' + Mt(Math.min(v.A0, v.B0)) + '=' + Mt(d)) + ' more.']),
      hints: ['Plan A: base + rate × sales.', 'Plan B: the first ' + N(v.L) + ' at one rate, the rest at the other. Then compare.'], text: 'two pay plans at given sales' });
  }
  HW.defineExit({ lesson: 'u2l5', outcome: 'N2', calc: true, blurb: 'Commission: straight commission, base pay plus commission, quotas and graduated rates, and comparing two pay plans.',
    questions: [Q(1, 'N2', 'BEG', function (r) { return A.commPart(r); }, 'Straight commission'), Q(2, 'N2', 'PRG', l5q2, 'Base pay plus commission'), Q(3, 'N2', 'PRG', function (r) { return A.tierCommPart(r); }, 'Over a quota, or graduated'), Q(4, 'N2', 'MAS', l5q4, 'Which pay plan pays more, and by how much')] });

  /* =====================================================================================================
   * 2.6 Tips, bonuses and shift premiums (N2)
   * ===================================================================================================== */
  var PREMJOBS = ['security guard', 'care aide', 'warehouse worker', 'gas station attendant', 'hotel night clerk'];
  function l6q3(r) {
    var p = person(r), job = r.pick(PREMJOBS), v = find(function () { return { w: pickR(r, [16, 23, 0.25]), pr: pickR(r, [1, 3, 0.25]), h: r.int(30, 40), n: r.int(8, 24) }; }, function (v) { return v.n < v.h; });
    var G = v.h * v.w + v.n * v.pr;
    return amtPart(p.n + ' is a ' + job + ' who earns ' + MH(v.w) + ', plus a shift premium of ' + MH(v.pr) + ' for night hours. This week ' + p.he + ' works ' + t(v.h) + ' h, and ' + t(v.n) + ' of them are at night. What is ' + p.his + ' gross pay?', G, {
      diag: [{ v: v.h * (v.w + v.pr), code: 'u2x-prem-all', hint: 'The premium is only for the ' + t(v.n) + ' night hours, not the whole week.' }, { v: v.h * v.w + v.pr, code: 'u2x-prem-once', hint: 'The premium is per hour: ' + t(v.n + '\\times ' + Mt(v.pr)) + '.' }, { v: v.h * v.w, code: 'u2x-no-prem', hint: 'Add the night premium: ' + t(v.n + '\\times ' + Mt(v.pr)) + '.' }, { v: v.n * (v.w + v.pr), code: 'u2x-no-prem', hint: 'Pay all ' + t(v.h) + ' hours at the wage; the premium is extra on the night hours.' }],
      sol: br(['Wages: ' + t(v.h + '\\times ' + Mt(v.w) + '=' + Mt(v.h * v.w)), 'Premium: ' + t(v.n + '\\times ' + Mt(v.pr) + '=' + Mt(v.n * v.pr)), 'Gross: ' + t(Mt(v.h * v.w) + '+' + Mt(v.n * v.pr) + '=' + Mt(G))]),
      hints: ['Pay every hour at the wage.', 'Add the premium for the night hours only.'], text: 'shift premium' });
  }
  function l6q4(r) {
    var p = person(r), v = find(function () { return { w: pickR(r, [17, 25, 0.5]), k: r.pick([2, 3, 4, 5, 6]), pr: pickR(r, [1, 2.5, 0.25]), n: r.int(8, 20), per: r.chance(0.5), b: r.chance(0.5) ? pickR(r, [2, 5, 0.5]) : pickR(r, [50, 200, 25]), m: r.int(6, 20) }; }, function () { return true; });
    var reg = 40 * v.w, ot = v.k * 1.5 * v.w, prem = v.n * v.pr, bonus = v.per ? v.b * v.m : v.b, G = reg + ot + prem + bonus, perItem = v.per;
    var bonusTxt = perItem ? 'a bonus of ' + MM(v.b) + ' for each of the ' + v.m + ' service plans ' + p.he + ' sold' : 'a ' + MM(v.b) + ' bonus for perfect attendance';
    return amtPart(p.n + ' works at ' + r.pick(['a tire shop', 'an electronics store', 'a hardware store']) + ' for ' + MH(v.w) + '. This week ' + p.he + ' works ' + t(40) + ' regular hours and ' + t(v.k) + ' overtime hours at time and a half. ' + t(v.n) + ' of the hours are evening hours with a premium of ' + MH(v.pr) + '. ' + cap(p.he) + ' also gets ' + bonusTxt + '. What is ' + p.his + ' total gross pay?', G, {
      diag: [{ v: (40 + v.k) * v.w + prem + bonus, code: 'u2t-ot-none', hint: 'Pay the ' + v.k + ' overtime hours at ' + t(Mt(v.w) + '\\times 1.5') + '.' }, { v: reg + ot + prem, code: 'u2x-no-bonus', hint: 'Add the bonus too.' }, { v: reg + ot + bonus, code: 'u2x-no-prem', hint: 'Add the premium: ' + t(v.n + '\\times ' + Mt(v.pr)) + '.' },
        { v: reg + ot + (40 + v.k) * v.pr + bonus, code: 'u2x-prem-all', hint: 'The premium is only for the ' + t(v.n) + ' evening hours.' }, perItem ? { v: reg + ot + prem + v.b, code: 'u2x-no-bonus', hint: 'The bonus is ' + MM(v.b) + ' for <b>each</b> plan: ' + t(v.m + '\\times ' + Mt(v.b)) + '.' } : null],
      sol: br(['Regular: ' + t('40\\times ' + Mt(v.w) + '=' + Mt(reg)), 'Overtime: ' + t(v.k + '\\times 1.5\\times ' + Mt(v.w) + '=' + Mt(ot)), 'Premium: ' + t(v.n + '\\times ' + Mt(v.pr) + '=' + Mt(prem)), 'Bonus: ' + (perItem ? t(v.m + '\\times ' + Mt(v.b) + '=' + Mt(bonus)) : MM(bonus)), 'Gross: ' + t(Mt(reg) + '+' + Mt(ot) + '+' + Mt(prem) + '+' + Mt(bonus) + '=' + Mt(G))]),
      hints: ['Overtime is 1.5 × the base wage. The premium is the same extra amount on every premium hour.', 'Add the regular pay, overtime pay, premium and bonus.'], text: 'total gross pay' });
  }
  HW.defineExit({ lesson: 'u2l6', outcome: 'N2', calc: true, blurb: 'Extra earnings: a tip, pooled tips shared by hours, a shift premium, and total gross pay with overtime, a premium and a bonus.',
    questions: [Q(1, 'N2', 'BEG', function (r) { return A.extraPart(r, { kind: 'tip' }); }, 'A tip'), Q(2, 'N2', 'PRG', function (r) { return A.tipsPart(r); }, 'Pooled tips by hours'), Q(3, 'N2', 'PRG', l6q3, 'Shift premium'), Q(4, 'N2', 'MAS', l6q4, 'Total gross pay: overtime, premium and bonus')] });

  /* =====================================================================================================
   * 2.7 Deductions and net pay (N2)
   * ===================================================================================================== */
  var FIX7 = [['a health plan', 'health plan'], ['parking', 'parking'], ['a food bank donation', 'donation'], ['staff social club dues', 'club dues']];
  function l7q2(r) {
    var p = person(r), G = q(r.int(1100, 3600) / 2), tx = r.int(12, 18), fx = r.pick(FIX7), f = pickR(r, [5, 22, 0.25]), W = A.stubWork(G, tx, f);
    return amtPart(p.n + '’s gross pay is ' + MM(G) + '. ' + cap(p.his) + ' deductions are CPP ' + t('5.95\\%') + ', EI ' + t('1.64\\%') + ', income tax ' + t(tx + '\\%') + ' of gross pay, and ' + MM(f) + ' for ' + fx[0] + '. What is ' + p.his + ' net pay?', W.net, {
      diag: [{ v: G + W.tot, code: 'u2t-ded-added', hint: 'Deductions are taken <b>off</b>: net = gross − total deductions.' }, { v: G - W.x, code: 'u2x-only-tax', hint: 'Take off <b>all</b> the deductions, not only the income tax.' }, { v: G - (W.c + W.e + W.x), code: 'u2x-left-out', hint: 'Take off the ' + MM(f) + ' for ' + fx[1] + ' too.' },
        { v: W.tot, code: 'u2t-gave-ded', hint: 'That’s the total deductions. Subtract it from the gross pay.' }, { v: G - (W.c + W.x + f), code: 'u2x-left-out', hint: 'Take off EI too.' }],
      sol: br(['CPP ' + t(Mt(G) + '\\times 0.0595' + toM(G * 0.0595)) + '; EI ' + t(Mt(G) + '\\times 0.0164' + toM(G * 0.0164)) + '; tax ' + t(Mt(G) + '\\times ' + dec(tx) + toM(G * tx / 100)), 'Total: ' + t(Mt(W.c) + '+' + Mt(W.e) + '+' + Mt(W.x) + '+' + Mt(f) + '=' + Mt(W.tot)), 'Net: ' + t(Mt(G) + '-' + Mt(W.tot) + '=' + Mt(W.net))]),
      hints: ['Find each percent deduction (round each to the cent), then add every deduction.', 'Net pay = gross pay − total deductions.'], text: 'net pay' });
  }
  function l7q3(r) {
    var p = person(r), v = find(function () { var G = pickR(r, [600, 1600, 20]), d = r.int(18, 30) + r.pick([0, 0.5, 0.25]); return { G: G, D: r2(G * d / 100 + r.pick([0, 0.37, 1.12, -0.48])) }; }, function () { return true; });
    var G = v.G, D = v.D, net = r2(G - D), pc = net / G * 100;
    return amtPart(p.n + '’s gross pay is ' + MM(G) + ' and the total deductions are ' + MM(D) + '. What percent of ' + p.his + ' gross pay does ' + p.he + ' take home? (Round to the nearest tenth.)', pc, { dp: 1, pct: true,
      diag: [{ v: D / G * 100, code: 'u2x-ded-pct', hint: 'That’s the percent taken off. Take-home percent = net pay ÷ gross pay × 100.' }, { v: G / net * 100, code: 'u2t-flip', hint: 'Divide the net pay by the gross pay (part ÷ whole).' }, { v: net, code: 'u2x-gave-net', hint: 'That’s the net pay in dollars. Divide by the gross pay and multiply by 100.' }],
      sol: br(['Net: ' + t(Mt(G) + '-' + Mt(D) + '=' + Mt(net)), 'Take-home: ' + t(c2(net) + '\\div ' + c2(G) + '\\times 100' + toN(pc, 1) + '\\%')]), hints: ['Find the net pay first: gross − deductions.', 'Take-home percent = net ÷ gross × 100.'], text: 'take-home percent' });
  }
  function l7q4(r) {
    var p = person(r), v = find(function () { return { G: pickR(r, [900, 2400, 20]), u: r.pick([1, 1.5, 2, 1.25]), rr: r.pick([25, 40, 50, 75, 100]), tx: r.int(14, 20) }; }, function () { return true; });
    var du = r2(v.G * v.u / 100), pre = r2(du + v.rr), TI = r2(v.G - pre), x = r2(TI * v.tx / 100), xg = r2(v.G * v.tx / 100), sv = r2(xg - x);
    return amtPart(p.n + ' is an apprentice. ' + cap(p.his) + ' gross pay for two weeks is ' + MM(v.G) + '. ' + cap(p.his) + ' <b>before-tax</b> deductions are union dues of ' + t(pctT(v.u)) + ' of gross pay and ' + MM(v.rr) + ' into an RRSP. Income tax is ' + t(v.tx + '\\%') + ' of taxable income. How much less income tax does ' + p.he + ' pay because of the before-tax deductions?', sv, {
      diag: [{ v: x, code: 'u2x-gave-tax', hint: 'That’s the income tax ' + p.he + ' pays. Compare it with the tax on all of the gross pay.' }, { v: xg, code: 'u2x-gave-tax', hint: 'That’s the tax with no before-tax deductions. Subtract the tax ' + p.he + ' really pays.' }, { v: pre, code: 'u2x-gave-pretax', hint: 'That’s the before-tax deductions. The tax saved is ' + t(v.tx + '\\%') + ' of them.' }, { v: TI, code: 'u2x-gave-tax', hint: 'That’s the taxable income. Find the income tax on it, and on the gross pay, then subtract.' }],
      sol: br(['Before-tax: dues ' + t(Mt(v.G) + '\\times ' + dec(v.u) + toM(v.G * v.u / 100)) + ' + RRSP ' + MM(v.rr) + ' = ' + MM(pre), 'Taxable income: ' + t(Mt(v.G) + '-' + Mt(pre) + '=' + Mt(TI)) + '; tax ' + t(Mt(TI) + '\\times ' + dec(v.tx) + toM(TI * v.tx / 100)), 'Tax on all the gross pay: ' + t(Mt(v.G) + '\\times ' + dec(v.tx) + toM(v.G * v.tx / 100)), 'Saved: ' + t(Mt(xg) + '-' + Mt(x) + '=' + Mt(sv))]),
      hints: ['Taxable income = gross pay − before-tax deductions.', 'Find the tax on the taxable income and on the gross pay. The difference is the saving.'], text: 'tax saved by before-tax deductions' });
  }
  HW.defineExit({ lesson: 'u2l7', outcome: 'N2', calc: true, blurb: 'Deductions and net pay: one deduction, net pay, the percent taken home, and the tax saved by before-tax deductions.',
    questions: [Q(1, 'N2', 'BEG', function (r) { return A.dedPart(r); }, 'One deduction'), Q(2, 'N2', 'PRG', l7q2, 'Net pay'), Q(3, 'N2', 'PRG', l7q3, 'Take-home percent'), Q(4, 'N2', 'MAS', l7q4, 'Tax saved by before-tax deductions')] });

  /* =====================================================================================================
   * 2.8 Working backwards (A1)
   * ===================================================================================================== */
  function l8q2(r) {
    var p = person(r), it = r.pick(['a new phone', 'a used guitar', 'a bike', 'a school trip', 'winter tires']);
    var v = find(function () { return { w: pickR(r, [15.25, 19.75, 0.25]), goal: pickR(r, [400, 1100, 25]) }; }, function (v) { var x = v.goal / v.w, f = x - Math.floor(x); return f > 0.05 && f < 0.95; });
    var x = v.goal / v.w, up = Math.ceil(x);
    return upPart(p.n + ' earns ' + MH(v.w) + '. ' + cap(p.he) + ' wants to earn at least ' + MM(v.goal) + ' (before deductions) for ' + it + '. How many whole hours must ' + p.he + ' work?', x, {
      short: function (dn) { return t(dn + '\\times ' + Mt(v.w) + '=' + Mt(dn * v.w)) + ', less than ' + MM(v.goal); },
      diag: [{ v: Math.ceil(v.goal * v.w), code: 'u2t-times', hint: 'hours = pay ÷ rate. Divide.' }],
      sol: br(['hours = pay ÷ rate = ' + t(Mt(v.goal) + '\\div ' + Mt(v.w) + '=' + raw5(x)), 'Round up: ' + t(up) + ' h. Check: ' + t(up + '\\times ' + Mt(v.w) + '=' + Mt(up * v.w)) + ' ✓ (' + t((up - 1) + '\\times ' + Mt(v.w) + '=' + Mt((up - 1) * v.w)) + ' is not enough)']),
      hints: ['hours = pay ÷ rate.', 'To earn <b>at least</b> the amount, round the hours up.'], text: 'whole hours for a target' });
  }
  function l8q3(r) {
    var p = person(r), v = find(function () { var p1 = r.pick([2, 3, 4]), p2 = p1 + r.pick([1, 2, 3]), L = r.pick([10000, 20000, 25000]), C = pickR(r, [L * p1 / 100 + 200, L * p1 / 100 + 2400, 50]); return { p1: p1, p2: p2, L: L, C: C }; },
      function (v) { var x = (v.C - v.L * v.p1 / 100) / (v.p2 / 100); return near(x * 100, Math.round(x * 100), 1e-6); });
    var a = v.L * v.p1 / 100, rest = v.C - a, over = rest / (v.p2 / 100), S = v.L + over, what = r.pick(['hot tubs', 'furniture', 'cars', 'boats']);
    return amtPart(p.n + ' sells ' + what + '. ' + cap(p.he) + ' earns ' + t(pctT(v.p1)) + ' commission on the first ' + MM(v.L) + ' of sales in a month and ' + t(pctT(v.p2)) + ' on all sales over ' + MM(v.L) + '. How much must ' + p.he + ' sell to earn ' + MM(v.C) + ' in commission?', S, {
      diag: [{ v: v.C / (v.p2 / 100), code: 'u2x-grad-all', hint: 'Use up the first level first: ' + t(Mt(v.L) + '\\times ' + dec(v.p1) + '=' + Mt(a)) + '. Only the rest is earned at ' + t(pctT(v.p2)) + '.' }, { v: over, code: 'u2x-grad-noadd', hint: 'That’s the sales <b>over</b> ' + MM(v.L) + '. Add the first ' + MM(v.L) + ' back.' },
        { v: v.C / (v.p1 / 100), code: 'u2x-grad-low', hint: 'Only the first ' + MM(v.L) + ' is at ' + t(pctT(v.p1)) + '.' }, { v: v.L + rest / v.p2, code: 'u2t-div-pct', hint: 'Divide by the rate as a decimal: ' + t(pctT(v.p2) + '=' + dec(v.p2)) + '.' }],
      sol: br(['First level pays ' + t(Mt(v.L) + '\\times ' + dec(v.p1) + '=' + Mt(a)), 'Still needed: ' + t(Mt(v.C) + '-' + Mt(a) + '=' + Mt(rest)) + ' at ' + t(pctT(v.p2)), 'Sales over ' + MM(v.L) + ': ' + t(Mt(rest) + '\\div ' + dec(v.p2) + '=' + Mt(over)), 'Total sales: ' + t(Mt(v.L) + '+' + Mt(over) + '=' + Mt(S))]),
      hints: ['How much commission does the first level pay? How much is still needed?', 'sales over the level = commission still needed ÷ the higher rate. Then add the first level.'], text: 'graduated commission backwards' });
  }
  function l8q4(r) {
    var p = person(r), w = pickR(r, [16, 26, 0.5]), reg = 40 * w, s = find(function () { return pickR(r, [reg + 60, reg + 260, 5]); }, function (T) { var x = (T - reg) / (1.5 * w), f = x - Math.floor(x); return f > 0.08 && f < 0.92 && Math.ceil((T - reg) / w - 1e-9) !== Math.ceil(x); }), T = s;
    var x = (T - reg) / (1.5 * w), up = Math.ceil(x);
    return upPart(p.n + ' works 8 hours a day, Monday to Friday, at a warehouse and earns ' + MH(w) + '. Any extra hours added to a shift are overtime at time and a half. How many whole hours of overtime does ' + p.he + ' need to earn at least ' + MM(T) + ' this week?', x, {
      short: function (dn) { return t(Mt(reg) + '+' + dn + '\\times ' + Mt(1.5 * w) + '=' + Mt(reg + dn * 1.5 * w)) + ', less than ' + MM(T); },
      diag: [{ v: Math.ceil((T - reg) / w - 1e-9), code: 'u2x-ot-reg', hint: 'The extra hours are overtime: each pays ' + t(Mt(w) + '\\times 1.5=' + Mt(1.5 * w)) + '.' }, { v: Math.ceil(T / (1.5 * w) - 1e-9), code: 'u2x-no-reg', hint: 'The 40 regular hours already pay ' + MM(reg) + '. Find the extra pay needed first.' }],
      sol: br(['Regular pay: ' + t('40\\times ' + Mt(w) + '=' + Mt(reg)), 'Extra needed: ' + t(Mt(T) + '-' + Mt(reg) + '=' + Mt(T - reg)), 'Overtime rate: ' + t(Mt(w) + '\\times 1.5=' + Mt(1.5 * w)), 'overtime hours = ' + t(Mt(T - reg) + '\\div ' + Mt(1.5 * w) + '=' + raw5(x)) + ', so ' + t(up) + ' h (round up)', 'Check: ' + t(Mt(reg) + '+' + up + '\\times ' + Mt(1.5 * w) + '=' + Mt(reg + up * 1.5 * w)) + ' ✓']),
      hints: ['Find the regular pay for 40 h and the extra pay needed.', 'overtime hours = extra pay needed ÷ overtime rate. Round up.'], text: 'overtime hours needed' });
  }
  HW.defineExit({ lesson: 'u2l8', outcome: 'A1', calc: true, blurb: 'Working backwards: hours or the wage from the pay, whole hours for a target, sales for a graduated commission, and the overtime hours needed.',
    questions: [Q(1, 'A1', 'BEG', function (r) { return r.chance(0.5) ? A.hoursPart(r) : A.ratePart(r); }, 'Hours or rate from the pay'), Q(2, 'A1', 'PRG', l8q2, 'Whole hours for a target (round up)'), Q(3, 'A1', 'PRG', l8q3, 'Sales for a graduated commission target'), Q(4, 'A1', 'MAS', l8q4, 'Overtime hours needed (round up)')] });
})(window);
