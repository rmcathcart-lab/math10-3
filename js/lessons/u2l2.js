/* Math 10-3 · Unit 2 · Lesson 2 — Wages and Salaries: Gross Pay and Pay Periods (N2)
 * Assignment 2 (u2_l02.tex, Questions 1–18) and the Lesson 2 Extra Practice (u2_ep02.tex: A Skills 1–4, B Applying 5–10,
 * C Stretch 11–13). Every part is a generator: the same situation and difficulty as the booklet item with new numbers
 * around the booklet's (the booklet's own numbers are among the possible values; the lesson's worked-example numbers are
 * left out). Calculator allowed. Alberta rules as the booklet gives them (as of 2026): minimum wage $15.00/h; students
 * under 18 may be paid $13.00/h for the first 28 h in a week while school is in session; pay periods weekly 52, biweekly 26,
 * semi-monthly 24, monthly 12; a full-time 40-hour week is 2080 h a year.
 * Answers: money to the cent ("$894.00", "894", "894.000" all right; a rounding slip gets a nudge that doesn't use a try,
 * rounding the wrong way is wrong with a hint); hours as decimals; salaries with or without the thousands space/comma.
 * Recognised wrong values each get their own hint: minutes read as decimals (6 h 45 min × as 6.45), the minutes left out,
 * dividing or adding instead of multiplying, pay ÷ hours done the wrong way, the wrong number of pay periods (26 for
 * semi-monthly, 24 for biweekly, 12 × 2), the hourly equivalent without brackets (÷ 40 × 52) or over 40 h only,
 * 52 weeks when fewer are worked, one day instead of the week, the unpaid break not taken off (or taken off as 0.3 h),
 * the $13.00 student rate used in the summer or past 28 h, a raise added as dollars instead of a percent.
 * Conversions: "fill in the blank from the box" → a choice table (one word per sentence); "name a job that pays a wage /
 * a salary" → sort jobs into wage or salary; gross-pay, timesheet, minimum-wage and pay-period tables → the table input
 * (given cells shown, blanks as boxes); "legal?" → a yes/no choice table; "which earns the most / which pays more" →
 * multiple choice; "explain his mistake" → multiple choice of explanations, then the corrected amount; "which would you
 * advise / give a reason" → multiple choice of advice where exactly one option is backed by correct facts.
 *
 * Shared kit for later Unit 2 lessons: HW.u2pay (time part from u2l1.js, pay part added here; see "HW.u2pay: pay" below).
 * Needs u1l7.js (HW.pctKit) and u2l1.js loaded first. Outcome N2. Levels: LIM BEG EMG PRG ADV MAS. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, PK = HW.pctKit, U = HW.u2pay;
  if (!PK || !U || !U.hmChk) throw new Error('u2l2.js needs HW.pctKit (u1l7.js) and HW.u2pay (u2l1.js)');
  var rnd = PK.rnd, r2 = PK.r2, dS = PK.dS, near = PK.near, find = PK.find, M = PK.M, m$ = PK.m$, D$ = PK.money$;
  var hm = U.hm, hmS = U.hmS, c12 = U.c12, c24 = U.c24, pad = U.pad, combo = U.combo, fieldsPart = U.fieldsPart;

  /* ================= HW.u2pay: pay =================
   *   MIN_WAGE 15, STUDENT_WAGE 13, STUDENT_HOURS 28;  PERIODS [['weekly', 52], ['biweekly', 26], ['semi-monthly', 24], ['monthly', 12]]
   *   minWage(under18, school) -> 13 | 15 (the rate for the first 28 h);  legalPay(hours, under18, school) -> least legal gross pay
   *   S$(x) "$63 960" (plain, narrow no-break space; cents only if not whole);  SM(x) LaTeX "\$63\,960.00" (always cents)
   *   grossBad(min, wage) -> typical wrong gross pays [[value, code, hint]] for `min` minutes at `wage`
   *   periodBad(amount, n, dir 'div'|'mul') -> the same amount with the other pay-period counts (and 12 × 2)
   *   hourlyEqBad(salary, hpw) -> ÷ hpw × 52 (no brackets), ÷ hpw, ÷ 52 (weekly pay), ÷ 12 ÷ hpw
   *   diagList(list) -> diag(v) for PK checkers;  moneyPart(prompt, exact, bad, sol, hints, text, inp) (sets .bad for tests)
   *   moneyChk(exact, bad) -> a PK.money checker with the bad list;  numChk(exact, dp, bad)
   *   grossTable(prompt, rows) rows: [{ label, min, wage }] -> table part (hours as a decimal, gross pay)
   *   paidTable(prompt, rows, mode) rows: [{ day, in, out, brk }] -> table part (hours paid as decimals) */
  U.MIN_WAGE = 15; U.STUDENT_WAGE = 13; U.STUDENT_HOURS = 28;
  U.PERIODS = [['weekly', 52], ['biweekly', 26], ['semi-monthly', 24], ['monthly', 12]];
  var PER = { weekly: 52, biweekly: 26, 'semi-monthly': 24, monthly: 12 };
  function minWage(under18, school) { return under18 && school ? U.STUDENT_WAGE : U.MIN_WAGE; }
  function legalPay(h, under18, school) { if (!(under18 && school)) return h * U.MIN_WAGE; return Math.min(h, U.STUDENT_HOURS) * U.STUDENT_WAGE + Math.max(0, h - U.STUDENT_HOURS) * U.MIN_WAGE; }
  function S$(x) { var whole = near(x, Math.round(x)); return '$' + HW.fmt(whole ? String(Math.round(x)) : m$(x), true).replace(/ /g, ' '); }
  function SM(x) { return '\\$' + HW.fmt(m$(x)); }
  function diagList(list) { return function (v) { for (var i = 0; i < list.length; i++) { var x = list[i][0]; if (near(v, x) || near(v, r2(x))) return { code: list[i][1], hint: list[i][2] }; } return null; }; }
  function cleanBad(list, exact) {
    var seen = [];
    return (list || []).filter(function (b) {
      if (!b || !isFinite(b[0]) || b[0] <= 0 || near(r2(b[0]), r2(exact)) || Math.abs(b[0] - exact) < 0.006) return false;
      if (seen.some(function (x) { return Math.abs(x - b[0]) < 0.006; })) return false; seen.push(b[0]); return true;
    });
  }
  function moneyChk(exact, bad) { var l = cleanBad(bad, exact), c = PK.money(exact, diagList(l)); c.list = l; return c; }
  function numChk(exact, dp, bad, o) { var l = cleanBad(bad, exact); if (dp === 0) l = cleanBad(l.map(function (b) { return [Math.round(b[0]), b[1], b[2]]; }), exact).filter(function (b) { return b[0] !== Math.round(exact); }); var c = PK.num(exact, dp, diagList(l), o); c.list = l; return c; }
  function moneyPart(prompt, exact, bad, sol, hints, text, inp) {
    var chk = moneyChk(exact, bad), p = PK.part(prompt, chk, m$(exact), M(exact), sol, hints, text, Object.assign({ before: '$' }, inp || {}));
    p.answer = t(SM(exact) + (inp && inp.after ? '\\text{' + inp.after + '}' : ''));
    p.bad = chk.list.map(function (b) { return m$(b[0]); }); p.good = ['$' + m$(exact)];
    return p;
  }
  function grossBad(min, w) {
    var h = Math.floor(min / 60), m = min % 60, out = [];
    if (m) {
      out.push([(h + m / 100) * w, 'u2-dot-min', m + ' min is not 0.' + pad(m) + ' h. Change the minutes to part of an hour first (minutes ÷ 60).']);
      out.push([h * w, 'u2l2-no-min', 'Include the ' + m + ' min too: change ' + hmS(min) + ' to decimal hours first.']);
      out.push([min * w, 'u2-total-min', 'That multiplies the <b>minutes</b> by the hourly wage. Change the time to hours first.']);
    }
    out.push([w / (min / 60), 'u2l2-divided', 'Gross pay = hours × hourly wage. Multiply, don’t divide.']);
    out.push([min / 60 + w, 'u2l2-added', 'Multiply the hours by the hourly wage (don’t add them).']);
    return out;
  }
  function periodBad(x, n, dir) {
    var out = [];
    U.PERIODS.forEach(function (p) { if (p[1] === n) return; var v = dir === 'div' ? x / p[1] : x * p[1];
      out.push([v, 'u2l2-periods', 'That uses ' + p[1] + ' pay periods (' + p[0] + '). ' + cap(name(n)) + ' is ' + n + ' cheques a year.']); });
    if (n === 26) out.push([dir === 'div' ? x / 12 / 2 : x * 12 * 2, 'u2l2-periods', 'Biweekly is every 2 weeks: 26 cheques a year, not 2 a month (that would be 24, semi-monthly).']);
    if (n === 24) out.push([dir === 'div' ? x / 12 : x * 12, 'u2l2-periods', 'Semi-monthly is <b>twice</b> a month: 24 cheques a year.']);
    return out;
  }
  function name(n) { return { 52: 'weekly', 26: 'biweekly', 24: 'semi-monthly', 12: 'monthly' }[n]; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function hourlyEqBad(S, hpw) {
    return [[S / hpw * 52, 'u2l2-brackets', 'Divide by the hours in a <b>year</b>: ' + t(hpw + '\\times 52') + ' first (use brackets on the calculator).'],
      [S / hpw, 'u2l2-per-week-hours', 'Divide by the hours in a whole year (' + t(hpw + '\\times 52') + '), not by the hours in one week.'],
      [S / 52, 'u2l2-weekly', 'That’s the pay for one week. Divide by the hours in a year (' + t(hpw + '\\times 52') + ').'],
      [S / 12 / hpw, 'u2l2-month', 'A year has 52 weeks: divide by ' + t(hpw + '\\times 52') + '.'], [S / 2080, 'u2l2-2080', 'This job is ' + dS(hpw) + ' h a week, not 40 h. Use ' + t(hpw + '\\times 52') + '.']];
  }
  U.minWage = minWage; U.legalPay = legalPay; U.S$ = S$; U.SM = SM; U.diagList = diagList; U.cleanBad = cleanBad; U.moneyChk = moneyChk; U.numChk = numChk; U.moneyPart = moneyPart;
  U.grossBad = grossBad; U.periodBad = periodBad; U.hourlyEqBad = hourlyEqBad; U.periodName = name;

  /* a gross-pay table: rows [{ label, min, wage }] */
  function grossTable(prompt, rows) {
    var cols = ['\\text{Time worked}', '\\text{Hourly wage}', '\\text{Hours as a decimal}', '\\text{Gross pay}'], Rr = rows.map(function (x) { return '\\text{' + x.label + '}'; }), blanks = [], keyC = [];
    rows.forEach(function (x, i) {
      var g = x.min / 60 * x.wage;
      blanks.push({ where: 'cell', i: i, j: 2, name: x.label + ' hours', chk: U.decChk(x.min / 60, { min: x.min }) });
      blanks.push({ where: 'cell', i: i, j: 3, name: x.label + ' gross pay', chk: moneyChk(g, grossBad(x.min, x.wage)) });
      keyC.push(['\\text{' + hmS(x.min) + '}', M(x.wage), dS(x.min / 60), m$(g)]);
    });
    var cells = rows.map(function (x) { return ['\\text{' + hmS(x.min) + '}', M(x.wage), null, null]; });
    var s = rows.map(function (x) { var g = x.min / 60 * x.wage; return x.label + ' ' + (x.min % 60 ? hmS(x.min) + ' = ' + dS(x.min / 60) + ' h; ' : '') + t(dS(x.min / 60) + '\\times ' + M(x.wage) + PK.eqM(g)); });
    return PK.tablePart(prompt, { rows: Rr, cols: cols, cells: cells, corner: '\\text{ }', keys: 'pctkit-money', help: 'Tap a box, then type the number (no $ needed). Money to the cent.' },
      PK.tableChk(blanks), { rows: Rr, cols: cols, cells: keyC }, s.join('<br>'), ['Change the minutes to part of an hour: minutes ÷ 60 (30 min = 0.5 h).', 'Gross pay = hours × hourly wage. Round to the cent.'], 'gross table');
  }
  /* a timesheet with "hours paid" in decimal hours: rows [{ day, in, out, brk }] */
  function paidTable(prompt, rows, mode) {
    var f = mode === '24' ? U.c24T : U.c12T, cols = ['\\text{Start}', '\\text{End}', '\\text{Unpaid break}', '\\text{Hours paid}'], Rr = rows.map(function (x) { return '\\text{' + x.day + '}'; }), blanks = [], keyC = [];
    rows.forEach(function (x, i) {
      var len = x.out - x.in, paid = (len - x.brk) / 60, L = hm(len);
      var bad = [[len / 60, 'u2-break', 'Take off the unpaid break (' + x.brk + ' min = ' + dS(x.brk / 60) + ' h).'], [L[0] + L[1] / 100 - x.brk / 60, 'u2-dot-min', 'Change the time from start to end to decimal hours first: ' + L[1] + ' min is ' + dS(L[1] / 60) + ' h.'],
        [len / 60 - x.brk / 100, 'u2l2-break-dec', 'A ' + x.brk + ' min break is ' + dS(x.brk / 60) + ' h, not ' + dS(x.brk / 100) + ' h.'], [L[0] + L[1] / 100, 'u2-dot-min', 'Minutes are not hundredths of an hour. Change them to part of an hour (÷ 60).']];
      if (!x.brk) bad = bad.slice(1, 2).concat([[L[0] + L[1] / 100, 'u2-dot-min', 'Minutes are not hundredths of an hour. Change them to part of an hour (÷ 60).']]);
      blanks.push({ where: 'cell', i: i, j: 3, name: x.day, chk: U.decChk(paid, { bad: bad }) });
      keyC.push([f(x.in), f(x.out), x.brk ? '\\text{' + x.brk + ' min}' : '\\text{none}', dS(paid)]);
    });
    var cells = rows.map(function (x) { return [f(x.in), f(x.out), x.brk ? '\\text{' + x.brk + ' min}' : '\\text{none}', null]; });
    var s = rows.map(function (x) { var len = x.out - x.in; return x.day + ': ' + (mode === '24' ? c24(x.in) + ' to ' + c24(x.out) : c12(x.in) + ' to ' + c12(x.out)) + ' is ' + hmS(len) + ' = ' + dS(len / 60) + ' h' + (x.brk ? '; ' + t(dS(len / 60) + '-' + dS(x.brk / 60) + '=' + dS((len - x.brk) / 60)) + ' h' : ''); });
    return PK.tablePart(prompt, { rows: Rr, cols: cols, cells: cells, corner: '\\text{Day}', keys: 'pctkit-money', help: 'Tap a box, then type the hours paid as a decimal, e.g. 7.5.' },
      PK.tableChk(blanks), { rows: Rr, cols: cols, cells: keyC }, s.join('<br>'), ['Find the time from start to end, change it to decimal hours, then take off the unpaid break (30 min = 0.5 h).'], 'paid table');
  }
  U.grossTable = grossTable; U.paidTable = paidTable;

  HW.addCodes({
    'u2l2-no-min': 'Left out the minutes', 'u2l2-divided': 'Divided instead of multiplying', 'u2l2-added': 'Added instead of multiplying', 'u2l2-wrong-way': 'Divided the wrong way (hours ÷ pay)',
    'u2l2-multiplied': 'Multiplied instead of dividing', 'u2l2-periods': 'Used the wrong number of pay periods', 'u2l2-brackets': 'Hourly equivalent: ÷ hours × 52 (no brackets)',
    'u2l2-per-week-hours': 'Hourly equivalent: divided by the weekly hours only', 'u2l2-weekly': 'Gave the weekly pay', 'u2l2-month': 'Used 12 months with weekly hours', 'u2l2-2080': 'Used 2080 h for a job that isn’t 40 h a week',
    'u2l2-52wk': 'Used 52 weeks when fewer are worked', 'u2l2-one-day': 'Gave one day’s pay instead of the week', 'u2l2-break-dec': 'Took the break off as 0.30 h', 'u2l2-student-summer': 'Used the $13.00 student rate in the summer',
    'u2l2-student-28': 'Paid $13.00 past 28 h', 'u2l2-adult': 'Used $15.00 where the $13.00 student rate applies', 'u2l2-raise-dollars': 'Added the percent as dollars', 'u2l2-raise-only': 'Gave the raise, not the new wage',
    'u2l2-new-weekly': 'Gave the new weekly pay, not the increase', 'u2l2-paola-time': 'Subtracted clock times like decimals', 'u2l2-paola-break': 'Didn’t take off the unpaid lunch', 'u2l2-hours': 'Gave the hours, not the pay',
    'u2l2-short': 'Gave the pay instead of the shortfall', 'u2l2-cheque-x2': 'Average month = 2 cheques', 'u2l2-per-hour': 'Compared the wrong amounts'
  });
  HW.addPartial({ 'u2l2-no-min': 'b', 'u2l2-divided': 'n', 'u2l2-added': 'n', 'u2l2-wrong-way': 'n', 'u2l2-multiplied': 'n', 'u2l2-periods': 'b', 'u2l2-brackets': 'b', 'u2l2-per-week-hours': 'b', 'u2l2-weekly': 'b',
    'u2l2-month': 'b', 'u2l2-2080': 'b', 'u2l2-52wk': 'b', 'u2l2-one-day': 'b', 'u2l2-break-dec': 'b', 'u2l2-student-summer': 'b', 'u2l2-student-28': 'b', 'u2l2-adult': 'b', 'u2l2-raise-dollars': 'n', 'u2l2-raise-only': 's',
    'u2l2-new-weekly': 's', 'u2l2-paola-time': 'n', 'u2l2-paola-break': 'b', 'u2l2-hours': 'n', 'u2l2-short': 's', 'u2l2-cheque-x2': 'b' });

  /* ================= Lesson 2 helpers ================= */
  function sol(a) { return a.filter(Boolean).join('<br>'); }
  function wageC(r, lo, hi, step) { return rnd(r.int(Math.round(lo / step), Math.round(hi / step)) * step, 2); }   // a wage on a step (0.05, 0.10, 0.25)
  var TD = 'border:1px solid #c9b79c;padding:3px 9px;text-align:center';
  function htable(head, rows) { return '<table style="border-collapse:collapse;margin:4px 0"><tr>' + head.map(function (h) { return '<th style="' + TD + '">' + h + '</th>'; }).join('') + '</tr>' + rows.map(function (rw) { return '<tr>' + rw.map(function (c) { return '<td style="' + TD + '">' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>'; }
  function grossSol(min, w) { var g = min / 60 * w; return (min % 60 ? hmS(min) + ' = ' + dS(min / 60) + ' h<br>' : '') + 'gross pay ' + t('=' + dS(min / 60) + '\\times ' + M(w) + PK.eqM(g)); }
  function grossPart(prompt, min, w, o) {
    o = o || {}; var g = min / 60 * w;
    return moneyPart(prompt, g, grossBad(min, w).concat(o.bad || []), o.sol || grossSol(min, w), o.hints || ['Write the hours as a decimal (minutes ÷ 60).', 'Gross pay = hours × hourly wage. Round to the cent.'], o.text || 'gross pay');
  }
  function wagePart(prompt, pay, h, o) {
    o = o || {}; var w = pay / h;
    return moneyPart(prompt, w, [[h / pay, 'u2l2-wrong-way', 'Divide the <b>pay</b> by the hours (money ÷ hours).'], [pay * h, 'u2l2-multiplied', 'To find the pay for <b>one</b> hour, divide the pay by the hours.']].concat(o.bad || []),
      o.sol || sol(['hourly wage ' + t('=' + M(pay) + '\\div ' + dS(h) + PK.eqM(w)), 'Check: ' + t(dS(h) + '\\times ' + M(r2(w)) + '=' + M(r2(w) * h))]), ['Hourly wage = gross pay ÷ hours worked.', 'Check by multiplying: hours × wage = pay.'], o.text || 'hourly wage', { after: '/h' });
  }
  function MCopts(list) { var seen = [], out = []; list.forEach(function (o) { var k = o.html.replace(/<[^>]+>/g, ''); if (seen.indexOf(k) >= 0 || (out.length >= 4 && !o.right)) return; seen.push(k); out.push(o); }); return out; }

  var WAGE_JOBS = ['cashier', 'cook', 'server', 'warehouse worker', 'lifeguard', 'construction labourer', 'apprentice in a trade'];
  var SAL_JOBS = ['teacher', 'office manager', 'accountant', 'engineer', 'store manager', 'police officer'];
  var SCHOOL_MONTHS = ['March', 'November', 'October', 'February', 'May', 'April'], SUMMER = ['July', 'August'];

  /* ================= lesson ================= */
  HW.defineLesson({
    id: 'u2l2', unit: 2, num: '2', title: 'Wages and Salaries: Gross Pay and Pay Periods', outcome: 'N2',
    blurb: 'Gross pay from an hourly wage and a timesheet, finding the hourly wage, Alberta’s minimum wage, salaries and pay periods, the hourly equivalent of a salary, and comparing job offers.',
    questions: [
      { num: '1', stem: 'Choose the word from the box that fits each blank.<br><span style="display:inline-block;border:1px solid #9aa3ad;padding:2px 8px;margin-top:3px">wage &nbsp; salary &nbsp; gross pay &nbsp; net pay &nbsp; biweekly &nbsp; semi-monthly &nbsp; minimum wage</span>', parts: [
        { id: '1af', sub: 'a–f', level: 'BEG', make: function (r) {
          var S = [['wage', r.pick(['Pay of a set amount for each hour worked is a ____.', 'Being paid a set amount for every hour you work means you earn a ____.'])],
            ['salary', r.pick(['A set amount paid for a whole year is a ____.', 'A yearly amount, split into equal paycheques, is a ____.'])],
            ['gross', r.pick(['Everything you earn before deductions is your ____.', 'Your pay before anything is taken off is your ____.'])],
            ['biweekly', r.pick(['Being paid every two weeks, 26 times a year, is being paid ____.', 'Getting 26 paycheques a year, one every two weeks, is being paid ____.'])],
            ['semi', r.pick(['Being paid twice a month, 24 times a year, is being paid ____.', 'Getting 24 paycheques a year, two each month, is being paid ____.'])],
            ['min', r.pick(['The lowest hourly wage an employer may legally pay is the ____.', 'In Alberta, the ____ for most workers is $15.00/h.'])]];
          var cols = r.shuffle([{ id: 'wage', html: 'wage' }, { id: 'salary', html: 'salary' }, { id: 'gross', html: 'gross pay' }, { id: 'net', html: 'net pay' }, { id: 'biweekly', html: 'biweekly' }, { id: 'semi', html: 'semi-monthly' }, { id: 'min', html: 'minimum wage' }]);
          var want = {}, rows = S.map(function (s, i) { want['r' + i] = s[0]; return { id: 'r' + i, html: '(' + 'abcdef'.charAt(i) + ') ' + s[1], label: 'Sentence ' + 'abcdef'.charAt(i) }; });
          var WHY = { wage: 'A <b>wage</b> is paid for each hour; a <b>salary</b> is a set amount for the whole year.', salary: 'A <b>wage</b> is paid for each hour; a <b>salary</b> is a set amount for the whole year.',
            gross: '<b>Gross pay</b> is before deductions; <b>net pay</b> is what you take home after them.', biweekly: '<b>Biweekly</b> = every 2 weeks (26 a year). <b>Semi-monthly</b> = twice a month (24 a year).',
            semi: '<b>Biweekly</b> = every 2 weeks (26 a year). <b>Semi-monthly</b> = twice a month (24 a year).', min: 'The lowest legal hourly wage is the <b>minimum wage</b>.' };
          var colH = {}; cols.forEach(function (c) { colH[c.id] = c.html; });
          return P.grid('Choose one word for each sentence.', rows, cols, want, { rowHead: 'Sentence', why: function (row) { var w = want[row]; return { code: 'u2l2-vocab', hint: '(' + 'abcdef'.charAt(+row.slice(1)) + ') ' + WHY[w] }; } },
            rows.map(function (rw) { return rw.html.replace('____', '<b>' + colH[want[rw.id]] + '</b>'); }).join('<br>'), ['Net pay is the one word you don’t need.'], 'vocab');
        } },
        { id: '1g', level: 'BEG', make: function (r) {
          var jobs = r.shuffle(r.sample(WAGE_JOBS, 3).map(function (j) { return [j, 'w']; }).concat(r.sample(SAL_JOBS, 3).map(function (j) { return [j, 's']; })));
          var want = {}, rows = jobs.map(function (j, i) { want['j' + i] = j[1]; return { id: 'j' + i, html: j[0], label: j[0] }; });
          return P.grid('(g) Which jobs often pay a wage, and which often pay a salary?', rows, [{ id: 'w', html: 'Wage' }, { id: 's', html: 'Salary' }], want, { rowHead: 'Job', why: function (row) { var j = jobs[+row.slice(1)]; return { code: 'u2l2-vocab', hint: j[0] + ': ' + (j[1] === 'w' ? 'usually paid by the hour (a wage).' : 'usually paid a set amount for the year (a salary).') }; } },
            'Wage: ' + jobs.filter(function (j) { return j[1] === 'w'; }).map(function (j) { return j[0]; }).join(', ') + '<br>Salary: ' + jobs.filter(function (j) { return j[1] === 's'; }).map(function (j) { return j[0]; }).join(', '), ['Jobs paid by the hour often have shifts that change week to week.'], 'wage or salary');
        } }] },
      { num: '2', stem: 'Find the gross pay. Round to the nearest cent.', parts: [
        { id: '2ab', sub: 'a–b', level: 'BEG', make: function (r) {
          var a = { label: '(a)', min: r.int(4, 9) * 60, wage: r.pick([15, 15.5, 16, 16.25, 17, 17.5]) }, b = find(function () { return { label: '(b)', min: r.int(3, 8) * 60, wage: wageC(r, 16, 21, 0.1) }; }, function (x) { return !(x.min === 360 && x.wage === 16.4) && x.min !== a.min; }, { label: '(b)', min: 300, wage: 18.4 });
          return grossTable('Complete the table.', [a, b]); } },
        { id: '2ce', sub: 'c–e', level: 'EMG', make: function (r) {
          var rows = r.shuffle([30, 45, 15]).map(function (m, i) { return find(function () { return { label: '(' + 'cde'.charAt(i) + ')', min: r.int(3, 8) * 60 + m, wage: wageC(r, 15.5, 23, 0.05) }; }, function (x) { return !(x.min === 465 && x.wage === 23.85) && !(x.min === 405 && x.wage === 16) && !near(x.min / 60 * x.wage * 100, Math.round(x.min / 60 * x.wage * 100)) === (i === 2); }, { label: '(' + 'cde'.charAt(i) + ')', min: 390 + 15 * i, wage: 16.7 }); });
          return grossTable('Complete the table.', rows); } }] },
      { num: '3', stem: function (sh) { return sh.who + ' is an apprentice ' + sh.trade + '. She earns ' + D$(sh.w) + '/h and works ' + dS(sh.h) + ' hours a day, ' + sh.days + '.'; },
        shared: function (r) { var d = r.pick([['Monday to Friday', 5], ['Monday to Thursday', 4]]); return find(function () { return { who: r.pick(['Kalani', 'Jess', 'Amira', 'Sofie']), trade: r.pick(['plumber', 'electrician', 'carpenter', 'pipefitter']), w: wageC(r, 20.1, 26.9, 0.05), h: r.pick([8, 8, 7.5, 7]), days: d[0], n: d[1] }; }, function (s) { return Math.abs(s.w - Math.round(s.w)) >= 0.1 && s.w !== 23.85; }, { who: 'Kalani', trade: 'plumber', w: 22.35, h: 8, days: 'Monday to Friday', n: 5 }); },
        parts: [
          { id: '3a', level: 'BEG', make: function (r, sh) { var H = sh.h * sh.n, R = Math.round(sh.w), E = Math.round(H) * R;
            return P.mc(r, 'Estimate her weekly gross pay.', MCopts([
              { html: 'About ' + t(Math.round(H) + '\\times \\$' + R + '=\\$' + E), right: true },
              { html: 'About ' + t(dS(sh.h) + '\\times \\$' + R + '=\\$' + Math.round(sh.h * R)), why: 'That is one day. She works ' + sh.n + ' days, so ' + dS(H) + ' h in the week.', code: 'u2l2-one-day' },
              { html: 'About ' + t(Math.round(H) + '+\\$' + R + '=\\$' + (Math.round(H) + R)), why: 'Multiply the hours by the hourly wage.', code: 'u2l2-added' },
              { html: 'About ' + t(Math.round(H) + '\\times \\$' + R + '\\times 52=\\$' + HW.fmt(E * 52)), why: 'That would be a whole year. The question asks for one week.', code: 'u2l2-52wk' }]),
              'hours ' + t('=' + sh.n + '\\times ' + dS(sh.h) + '=' + dS(H)) + ' h. Estimate: ' + t(Math.round(H) + '\\times \\$' + R + '=\\$' + E), ['Round the hours and the wage to easy numbers, then multiply.'], 'estimate'); } },
          { id: '3b', level: 'BEG', make: function (r, sh) { var H = sh.h * sh.n, g = H * sh.w;
            return moneyPart('Calculate her weekly gross pay.', g, [[sh.h * sh.w, 'u2l2-one-day', 'That is one day’s pay. Multiply by the ' + sh.n + ' days.'], [H * sh.w * 52, 'u2l2-52wk', 'That is a year’s pay. Find one week.']].concat(grossBad(H * 60, sh.w)),
              sol(['hours ' + t('=' + sh.n + '\\times ' + dS(sh.h) + '=' + dS(H)) + ' h', 'gross pay ' + t('=' + dS(H) + '\\times ' + M(sh.w) + PK.eqM(g)), sh.who + ' earns ' + t(M(g)) + ' a week.']), ['Find the hours for the week first.', 'Gross pay = hours × hourly wage.'], 'weekly gross'); } }] },
      { num: '4', stem: function (sh) { return sh.who + ' is a landscaper in ' + sh.town + '. He earns ' + D$(sh.w) + '/h. Last week he worked ' + sh.d.map(function (x, i) { return hmS(x) + ' on ' + ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][i]; }).join(', ').replace(/, ([^,]*)$/, ' and $1') + '.'; },
        shared: function (r) { return find(function () { var d = r.shuffle([450, 480, 375, 465, 270, 345, 495, 390, 435, 420]).slice(0, 5); return { who: r.pick(['Lucas', 'Mateo', 'Noah', 'Jamal']), town: r.pick(['Okotoks', 'Airdrie', 'Strathmore', 'Chestermere']), w: wageC(r, 16.5, 21.5, 0.1), d: d, H: d.reduce(function (a, b) { return a + b; }, 0) }; }, function (s) { return s.H % 60 !== 0; }, { who: 'Lucas', town: 'Okotoks', w: 18.9, d: [450, 480, 375, 465, 270], H: 2040 }); },
        parts: [
          { id: '4', level: 'PRG', make: function (r, sh) { var H = sh.H / 60, g = H * sh.w, dot = sh.d.reduce(function (a, x) { var q = hm(x); return a + q[0] + q[1] / 100; }, 0);
            var hc = numChk(H, 2, [[dot, 'u2-dot-min', 'Change each time to decimal hours first: 30 min = 0.5 h, 15 min = 0.25 h, 45 min = 0.75 h.'], [sh.H, 'u2-total-min', 'That is minutes. Give the total in hours.']]);
            var gc = moneyChk(g, [[dot * sh.w, 'u2-dot-min', 'The hours are wrong: change each time to decimal hours first (45 min = 0.75 h, not 0.45 h).']].concat(grossBad(sh.H, sh.w)));
            var p = fieldsPart('What was his gross pay? (Find the total hours first.)', [{ label: 'Total hours:', after: 'h', name: 'Total hours' }, { label: 'Gross pay:', before: '$', name: 'Gross pay' }],
              combo([{ name: 'Total hours', at: 0, chk: hc }, { name: 'Gross pay', at: 1, chk: gc }]), [dS(H), m$(g)], dS(H) + ' h; ' + t(M(g)),
              sol(['hours: ' + t(sh.d.map(function (x) { return dS(x / 60); }).join('+') + '=' + dS(H)) + ' h', 'gross pay ' + t('=' + dS(H) + '\\times ' + M(sh.w) + PK.eqM(g)), sh.who + ' earned ' + t(M(g)) + '.']),
              ['Change each day to decimal hours (30 min = 0.5 h, 15 min = 0.25 h, 45 min = 0.75 h), then add.', 'Gross pay = total hours × hourly wage.'], 'landscaper');
            p.bad = [[dS(rnd(dot, 2)), m$(dot * sh.w)]]; return p; } }] },
      { num: '5', stem: function (sh) { return sh.who + ' is a hospital porter in ' + sh.town + '. Her hospital uses the 24-hour clock. She earns ' + D$(sh.w) + '/h.'; },
        shared: function (r) {
          var days = ['Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday'];
          var rows = find(function () { return days.map(function (d, i) { var st = i < 2 ? r.pick([360, 390, 420]) : i === 2 ? r.pick([720, 780, 810]) : i === 3 ? r.pick([840, 900]) : r.pick([480, 540, 600]);
            var len = i === 4 ? r.pick([240, 270, 285, 300]) : r.int(25, 34) * 15; return { day: d, in: st, out: st + len, brk: len > 300 ? 30 : 0 }; }); },
            function (rw) { var tot = rw.reduce(function (a, x) { return a + x.out - x.in - x.brk; }, 0); return tot % 60 !== 0 && rw.every(function (x) { return x.out < 1440; }) && rw.some(function (x) { return (x.out - x.in) % 60; }); }, null)
            || [{ day: 'Monday', in: 420, out: 930, brk: 30 }, { day: 'Tuesday', in: 420, out: 930, brk: 30 }, { day: 'Thursday', in: 780, out: 1155, brk: 30 }, { day: 'Friday', in: 900, out: 1380, brk: 30 }, { day: 'Saturday', in: 540, out: 810, brk: 0 }];
          return { who: r.pick(['Grace', 'Dana', 'Precious', 'Hannah']), town: r.pick(['Medicine Hat', 'Lethbridge', 'Red Deer', 'Grande Prairie']), w: wageC(r, 18.5, 22.5, 0.1), rows: rows, H: rows.reduce(function (a, x) { return a + x.out - x.in - x.brk; }, 0) / 60 }; },
        parts: [
          { id: '5a', level: 'EMG', make: function (r, sh) { return paidTable('Complete her timesheet: the hours paid each day.', sh.rows, '24'); } },
          { id: '5b', level: 'PRG', make: function (r, sh) { var g = sh.H * sh.w, noBrk = sh.rows.reduce(function (a, x) { return a + x.out - x.in; }, 0) / 60;
            var hc = numChk(sh.H, 2, [[noBrk, 'u2-break', 'Use the hours <b>paid</b> (after the unpaid breaks).']]), gc = moneyChk(g, [[noBrk * sh.w, 'u2-break', 'Use the hours paid, after the unpaid breaks.']].concat(grossBad(Math.round(sh.H * 60), sh.w)));
            return fieldsPart('Find her total hours and her gross pay for the week.' + htable(['Day', 'Start', 'End', 'Unpaid break'], sh.rows.map(function (x) { return [x.day, c24(x.in), c24(x.out), x.brk ? x.brk + ' min' : 'none']; })),
              [{ label: 'Total hours:', after: 'h', name: 'Total hours' }, { label: 'Gross pay:', before: '$', name: 'Gross pay' }], combo([{ name: 'Total hours', at: 0, chk: hc }, { name: 'Gross pay', at: 1, chk: gc }]), [dS(sh.H), m$(g)], dS(sh.H) + ' h; ' + t(M(g)),
              sol(['total ' + t('=' + sh.rows.map(function (x) { return dS((x.out - x.in - x.brk) / 60); }).join('+') + '=' + dS(sh.H)) + ' h', 'gross pay ' + t('=' + dS(sh.H) + '\\times ' + M(sh.w) + PK.eqM(g)) + '. ' + sh.who + ' earned ' + t(M(g)) + '.']),
              ['Add the hours paid from (a).', 'Gross pay = total hours × hourly wage.'], 'porter gross'); } }] },
      { num: '6', stem: 'Find the hourly wage. Check each answer by multiplying.', parts: [
        { id: '6a', level: 'BEG', make: function (r) { var h = r.int(20, 38), w = r.pick([15, 15.5, 16, 17, 18, 19.5, 20]); return wagePart(D$(h * w) + ' for ' + h + ' hours', h * w, h); } },
        { id: '6b', level: 'BEG', make: function (r) { var v = find(function () { return [r.int(12, 30), wageC(r, 15.1, 22.9, 0.1)]; }, function (v) { return !(v[0] === 25.5 && v[1] === 17.5) && Math.abs(v[1] * 10 - Math.round(v[1])  * 10) > 0.5; }, [19, 19.2]); return wagePart(D$(v[0] * v[1]) + ' for ' + v[0] + ' hours', rnd(v[0] * v[1], 2), v[0]); } },
        { id: '6c', level: 'EMG', make: function (r) { var v = find(function () { return [r.int(24, 40), wageC(r, 15.25, 23.75, 0.25)]; }, function (v) { return v[1] % 0.5 !== 0; }, [36, 18.25]); return wagePart(D$(v[0] * v[1]) + ' for ' + v[0] + ' hours', rnd(v[0] * v[1], 2), v[0]); } }] },
      { num: '7', stem: function (sh) { return 'Is each worker in Alberta paid at least minimum wage? (Most workers: $15.00/h. Students under 18: $13.00/h for the first 28 h in a week while school is in session.)' + htable(['Worker', 'Pay'], sh.W.map(function (x) { return [x.label, D$(x.pay) + ' for ' + x.h + ' h']; })); },
        shared: function (r) {
          var a = { name: r.pick(['Aiden', 'Marco', 'Liam']), age: r.int(19, 30) }, st = { name: r.pick(['Mia', 'Zara', 'Ella']), age: r.int(15, 17) }, d = { name: r.pick(['Omar', 'Wei', 'Gabriel']), age: r.int(35, 55) };
          var aw = r.pick([13.5, 14, 14.25, 14.5, 14.75]), sw = r.pick([13.25, 13.5, 13.75, 14, 14.5]), dw = r.pick([15.5, 16, 16.5, 17, 18]);
          var ah = r.int(24, 36), sh1 = r.int(14, 26), sh2 = r.int(25, 32), dh = r.int(30, 40), mo1 = r.pick(SCHOOL_MONTHS), mo2 = r.pick(SUMMER);
          var W = [{ label: '(a) ' + a.name + ', ' + a.age, w: aw, h: ah, min: 15 }, { label: '(b) ' + st.name + ', ' + st.age + ', in ' + mo1, w: sw, h: sh1, min: 13, student: true }, { label: '(c) ' + st.name + ', in ' + mo2, w: sw, h: sh2, min: 15, summer: true }, { label: '(d) ' + d.name + ', ' + d.age, w: dw, h: dh, min: 15 }];
          W.forEach(function (x) { x.pay = rnd(x.w * x.h, 2); x.legal = x.w >= x.min; });
          return { W: W };
        },
        parts: [
          { id: '7tab', sub: 'a–d', level: 'PRG', make: function (r, sh) {
            var cols = ['\\text{Hourly wage}', '\\text{Minimum}'], Rr = sh.W.map(function (x) { return '\\text{' + x.label.replace(/,/g, '{,}') + '}'; }), blanks = [], keyC = [];
            sh.W.forEach(function (x, i) {
              blanks.push({ where: 'cell', i: i, j: 0, name: x.label.slice(0, 3) + ' hourly wage', chk: moneyChk(x.w, [[x.h / x.pay, 'u2l2-wrong-way', 'Divide the pay by the hours.'], [x.pay * x.h, 'u2l2-multiplied', 'Divide the pay by the hours.']]) });
              blanks.push({ where: 'cell', i: i, j: 1, name: x.label.slice(0, 3) + ' minimum', chk: moneyChk(x.min, x.student ? [[15, 'u2l2-adult', 'This student is under 18, school is in session, and she works less than 28 h, so the minimum is $13.00/h.']] : x.summer ? [[13, 'u2l2-student-summer', 'In the summer (no school), students must be paid at least $15.00/h.']] : [[13, 'u2l2-student-summer', 'The $13.00 rate is only for students under 18 while school is in session.']]) });
              keyC.push([m$(x.w), m$(x.min)]);
            });
            return PK.tablePart('Find each hourly wage and the minimum wage that applies.', { rows: Rr, cols: cols, cells: sh.W.map(function () { return [null, null]; }), corner: '\\text{Worker}', keys: 'pctkit-money', help: 'Tap a box, then type the amount per hour (no $ needed).' },
              PK.tableChk(blanks), { rows: Rr, cols: cols, cells: keyC },
              sh.W.map(function (x) { return x.label.slice(0, 3) + ' ' + t(M(x.pay) + '\\div ' + x.h + '=' + M(x.w)) + ' per hour; minimum ' + t(M(x.min)) + (x.student ? ' (under 18, school is in, under 28 h)' : x.summer ? ' (summer: no student rate)' : ''); }).join('<br>'),
              ['Hourly wage = pay ÷ hours.', 'The $13.00 student rate is only for under-18 students while school is in session (first 28 h). Summer: $15.00.'], 'min wage table'); } },
          { id: '7legal', sub: 'legal?', level: 'EMG', make: function (r, sh) {
            var want = {}, rows = sh.W.map(function (x, i) { want['w' + i] = x.legal ? 'y' : 'n'; return { id: 'w' + i, html: x.label + ': ' + D$(x.w) + '/h (minimum ' + D$(x.min) + ')', label: x.label.slice(0, 3) }; });
            return P.grid('Is each worker paid at least the minimum wage?', rows, [{ id: 'y', html: 'Yes' }, { id: 'n', html: 'No' }], want, { rowHead: 'Worker', why: function (row) { var x = sh.W[+row.slice(1)]; return { code: 'u2l2-compare', hint: x.label.slice(0, 3) + ' ' + D$(x.w) + (x.legal ? ' ≥ ' : ' < ') + D$(x.min) + '.' }; } },
              sh.W.map(function (x) { return x.label.slice(0, 3) + ' ' + D$(x.w) + (x.legal ? ' ≥ ' : ' < ') + D$(x.min) + ': ' + (x.legal ? 'yes' : 'no'); }).join('<br>'), ['Compare each hourly wage with the minimum that applies to that worker.'], 'legal'); } }] },
      { num: '8', stem: function (sh) { return sh.who + ' is a payroll clerk with a salary of ' + S$(sh.S) + ' a year.'; },
        shared: function (r) { return { who: r.pick(['Kofi', 'Ines', 'Brandon', 'Lena']), S: 312 * find(function () { return r.int(130, 250); }, function (k) { return k !== 175; }, 205) }; },
        parts: [
          { id: '8', level: 'EMG', make: function (r, sh) {
            var cols = U.PERIODS.map(function (p) { return '\\text{' + p[0] + '}'; }), blanks = U.PERIODS.map(function (p, j) { return { where: 'cell', i: 0, j: j, name: cap(p[0]), chk: moneyChk(sh.S / p[1], periodBad(sh.S, p[1], 'div')) }; });
            return PK.tablePart('Complete the table: the pay per cheque.', { rows: ['\\text{Pay per cheque}'], cols: cols, cells: [[null, null, null, null]], corner: '\\text{Paid}', keys: 'pctkit-money', help: 'Tap a box, then type the amount (no $ needed).' },
              PK.tableChk(blanks), { rows: ['\\text{Pay per cheque}'], cols: cols, cells: [U.PERIODS.map(function (p) { return m$(sh.S / p[1]); })] },
              U.PERIODS.map(function (p) { return p[0] + ': ' + t(HW.fmt(sh.S) + '\\div ' + p[1] + '=' + SM(sh.S / p[1]).replace('\\$', '')); }).join('<br>'), ['Pay per cheque = yearly salary ÷ number of pay periods.', 'weekly 52, biweekly 26, semi-monthly 24, monthly 12'], 'cheque table'); } }] },
      { num: '9', stem: 'Find each person’s yearly salary.', shared: function (r) {
          return find(function () { var a = { who: 'Dana', n: 24, c: r.int(1700, 2200) + r.pick([0, 0.5, 0.25]) }, b = { who: 'Felix', n: 52, c: wageC(r, 780, 1000, 0.1) }, c = { who: 'Gwen', n: 12, c: r.int(70, 85) * 50 };
            [a, b, c].forEach(function (x) { x.y = x.c * x.n; }); return { P: [a, b, c] }; }, function (s) { var y = s.P.map(function (x) { return x.y; }).sort(function (a, b) { return b - a; }); return y[0] - y[1] >= 300 && y[0] - y[2] < 6000 && !s.P.some(function (x) { return x.n === 26 && x.c === 1925.5; }); },
            { P: [{ who: 'Dana', n: 24, c: 1987.5, y: 47700 }, { who: 'Felix', n: 52, c: 865.4, y: 45000.8 }, { who: 'Gwen', n: 12, c: 3850, y: 46200 }] }); },
        parts: [0, 1, 2].map(function (k) { return { id: '9' + 'abc'.charAt(k), level: 'BEG', make: function (r, sh) { var x = sh.P[k];
          return moneyPart(x.who + ' is paid ' + D$(x.c) + ' ' + name(x.n) + '.', x.y, periodBad(x.c, x.n, 'mul').concat([[x.c / x.n, 'u2l2-divided', 'To find the yearly salary, <b>multiply</b> the cheque by the number of pay periods.']]),
            t(M(x.c) + '\\times ' + x.n + '=' + SM(x.y)), [cap(name(x.n)) + ' is ' + x.n + ' cheques a year.', 'Yearly salary = pay per cheque × number of pay periods.'], 'yearly ' + name(x.n)); } }; }).concat([
          { id: '9d', sub: 'who', level: 'EMG', make: function (r, sh) { var best = sh.P.slice().sort(function (a, b) { return b.y - a.y; })[0], bigC = sh.P.slice().sort(function (a, b) { return b.c - a.c; })[0];
            return P.mc(r, 'Who earns the most in a year?', sh.P.map(function (x) { return { html: x.who + ' (' + S$(x.y) + ' a year)', right: x === best, why: x === best ? null : 'Compare the <b>yearly</b> salaries: ' + best.who + '’s is the biggest.' + (x === bigC ? ' A bigger cheque doesn’t mean more in a year — it depends on how many cheques.' : ''), code: x === bigC ? 'u2l2-per-hour' : 'u2l2-compare' }; }).concat([{ html: 'They all earn the same.', why: 'Work out each yearly salary and compare.', code: 'u2l2-compare' }]),
              sh.P.map(function (x) { return x.who + ': ' + t(M(x.c) + '\\times ' + x.n + '=' + SM(x.y)); }).join('<br>') + '<br>' + best.who + ' earns the most: ' + S$(best.y) + ' a year.', ['Use your answers to (a), (b) and (c).'], 'who most'); } }]) },
      { num: '10', stem: '', parts: [
        { id: '10a', level: 'EMG', make: function (r) { var v = find(function () { return [r.pick([35, 36, 37.5, 38, 40, 32]), wageC(r, 18, 28, 0.25)]; }, function (v) { return !(v[0] === 40 && v[1] === 22.5) && near(v[0] * 52 * v[1], Math.round(v[0] * 52 * v[1])); }, [38, 22.5]), S = v[0] * 52 * v[1];
          var who = r.pick([['Jordan', 'a youth worker'], ['Priya', 'a community support worker'], ['Sam', 'a lab assistant']]);
          return moneyPart(who[0] + ' is ' + who[1] + ' with a salary of ' + S$(S) + ' a year. ' + (who[0] === 'Priya' ? 'She' : 'He') + ' works ' + dS(v[0]) + ' hours a week. What is the hourly equivalent of the salary?', v[1], hourlyEqBad(S, v[0]),
            sol(['hours a year ' + t('=' + dS(v[0]) + '\\times 52=' + HW.fmt(dS(v[0] * 52))), t(SM(S) + '\\div ' + HW.fmt(dS(v[0] * 52)) + '=' + M(v[1])), 'The salary works out to ' + t(M(v[1])) + '/h.']), ['Hourly equivalent = yearly salary ÷ (hours per week × 52).', 'On the calculator, put brackets around the hours × 52.'], 'hourly equivalent', { after: '/h' }); } },
        { id: '10b', level: 'EMG', make: function (r) { var w = wageC(r, 15.5, 19.9, 0.1), h = r.int(20, 30), wk = r.int(44, 50), y = w * h * wk;
          var who = r.pick(['Tess', 'Mira', 'Jade']);
          return moneyPart(who + ' works at a hair salon for ' + D$(w) + '/h, ' + h + ' hours a week. She works ' + wk + ' weeks a year (she takes ' + (52 - wk) + ' weeks off, unpaid). What is her yearly gross pay?', y,
            [[w * h * 52, 'u2l2-52wk', 'She only works ' + wk + ' weeks, not 52.'], [w * h, 'u2l2-weekly', 'That is one week. Multiply by the ' + wk + ' weeks she works.'], [w * h * (52 - wk), 'u2l2-52wk', 'Use the weeks she <b>works</b> (' + wk + '), not the weeks off.']],
            t(M(w) + '\\times ' + h + '\\times ' + wk + '=' + SM(y)) + '<br>' + who + ' earns ' + t(SM(y)) + ' a year.', ['Yearly pay = hourly wage × hours per week × weeks worked.'], 'yearly from wage'); } }] },
      { num: '11', stem: function (sh) { return sh.who + ' is offered two jobs at a distribution centre. <b>Offer A</b> pays ' + D$(sh.wA) + '/h for ' + sh.hA + ' hours a week. <b>Offer B</b> pays a salary of ' + S$(sh.S) + ' a year for ' + sh.hB + ' hours a week.'; },
        shared: function (r) { return find(function () { var wA = wageC(r, 17, 22, 0.1), hA = r.pick([28, 30, 32]), hB = hA + r.pick([5, 6, 8]), wkB = r.int(Math.ceil(wA * hA / 10) + 2, Math.floor(wA * hB / 10)) * 10; return { who: r.pick(['Malik', 'Kenji', 'Dario']), wA: wA, hA: hA, hB: hB, wkB: wkB, S: wkB * 52, wkA: wA * hA, perB: wkB / hB }; },
          function (s) { return s.wkB > s.wkA + 10 && s.perB < s.wA - 0.2 && !near(s.perB, r2(s.perB)); }, { who: 'Malik', wA: 19.6, hA: 30, hB: 35, wkB: 650, S: 33800, wkA: 588, perB: 650 / 35 }); },
        parts: [
          { id: '11a', level: 'EMG', make: function (r, sh) {
            var ca = moneyChk(sh.wkA, grossBad(sh.hA * 60, sh.wA)), cb = moneyChk(sh.wkB, [[sh.S / 26, 'u2l2-periods', 'A week is 1/52 of a year: divide by 52.'], [sh.S / 12, 'u2l2-periods', 'That is one month. Divide by 52 for one week.'], [sh.S / sh.hB, 'u2l2-per-week-hours', 'Divide the salary by the 52 weeks in a year.']]);
            return fieldsPart('Find the weekly gross pay for each offer.', [{ label: 'Offer A:', before: '$', after: 'a week', name: 'Offer A' }, { label: 'Offer B:', before: '$', after: 'a week', name: 'Offer B' }], combo([{ name: 'Offer A', at: 0, chk: ca }, { name: 'Offer B', at: 1, chk: cb }]),
              [m$(sh.wkA), m$(sh.wkB)], 'A: ' + t(M(sh.wkA)) + '; B: ' + t(M(sh.wkB)), sol(['A: ' + t(sh.hA + '\\times ' + M(sh.wA) + '=' + M(sh.wkA)), 'B: ' + t(SM(sh.S) + '\\div 52=' + M(sh.wkB))]), ['Offer A: hours × wage. Offer B: yearly salary ÷ 52 weeks.'], 'offers weekly'); } },
          { id: '11b', level: 'PRG', make: function (r, sh) { return moneyPart('Find the pay per hour for Offer B, to the nearest cent.', sh.perB, [[sh.hB / sh.wkB, 'u2l2-wrong-way', 'Divide the weekly pay by the hours.'], [sh.S / sh.hB, 'u2l2-per-week-hours', 'Use the weekly pay (salary ÷ 52), then divide by ' + sh.hB + ' h.'], [sh.S / 2080, 'u2l2-2080', 'Offer B is ' + sh.hB + ' h a week, not 40 h.'], [sh.wkB / sh.hA, 'u2l2-per-hour', 'Offer B is ' + sh.hB + ' hours a week, not ' + sh.hA + '.']],
            sol([t(M(sh.wkB) + '\\div ' + sh.hB + PK.eqM(sh.perB)) + '/h', 'Offer A pays more per hour (' + D$(sh.wA) + ').']), ['Pay per hour = weekly pay ÷ hours per week.'], 'offer B hourly', { after: '/h' }); } },
          { id: '11c', level: 'EMG', make: function (r, sh) { var d = r2(sh.wkB - sh.wkA);
            return P.mc(r, 'Which advice to ' + sh.who + ' is backed up by correct facts?', [
              { html: 'Take Offer B: it pays ' + D$(d) + ' more each week, and a salary is the same every cheque.', right: true },
              { html: 'Take Offer B: it pays more for each hour he works.', why: 'Check (b): Offer B works out to only ' + D$(sh.perB) + '/h, less than ' + D$(sh.wA) + '/h.', code: 'u2l2-per-hour' },
              { html: 'Take Offer A: it pays more each week.', why: 'Check (a): Offer B pays more each week.', code: 'u2l2-per-hour' },
              { html: 'Take Offer B: with a salary, every extra hour is paid.', why: 'With a salary, extra hours usually mean <b>no</b> extra pay.', code: 'u2l2-vocab' }],
              'Offer B pays ' + D$(sh.wkB) + ' − ' + D$(sh.wkA) + ' = ' + D$(d) + ' more each week, and the pay is steady. (Offer A is also reasonable: it pays more per hour, and ' + (sh.hB - sh.hA) + ' fewer hours a week leaves time for school or a second job.)', ['Check each statement against your answers to (a) and (b).'], 'advice'); } }] },
      { num: '12', stem: function (sh) { return sh.who + '’s salary is ' + S$(sh.S) + ' a year and he is paid biweekly. He says, “I get two cheques a month, so each cheque is ' + t(SM(sh.S).replace('.00', '') + '\\div 12\\div 2=' + M(sh.S / 24)) + '.”'; },
        shared: function (r) { return { who: r.pick(['Ravi', 'Tyler', 'Andre']), S: 26 * find(function () { return r.int(1400, 2300) + r.pick([0, 50]); }, function (c) { return !near((c * 26 / 24) * 100, Math.round(c * 26 / 24 * 100)); }, 1600) }; },
        parts: [
          { id: '12a', level: 'EMG', make: function (r, sh) {
            return P.mc(r, 'What is his mistake?', [
              { html: 'Biweekly means every two weeks: 26 cheques a year, not 24. (Twice a month is semi-monthly.)', right: true },
              { html: 'He should divide by 52, because there are 52 weeks in a year.', why: '52 cheques would be weekly. Biweekly is every <b>two</b> weeks.', code: 'u2l2-periods' },
              { html: 'He should divide by 12 only, because he is paid once a month.', why: 'Biweekly is every two weeks, not once a month.', code: 'u2l2-periods' },
              { html: 'There is no mistake: two cheques a month is biweekly.', why: 'Two cheques a month is <b>semi-monthly</b> (24 a year). Biweekly gives 26.', code: 'u2l2-periods' }],
              'Biweekly means every two weeks, which is 26 cheques a year, not 24. (Twice a month is semi-monthly.)', ['How many two-week periods are in 52 weeks?'], 'biweekly mistake'); } },
          { id: '12b', level: 'EMG', make: function (r, sh) { return moneyPart('Find the correct amount of each cheque.', sh.S / 26, periodBad(sh.S, 26, 'div'), t(SM(sh.S) + '\\div 26=' + SM(sh.S / 26)) + '. Each cheque is ' + t(SM(sh.S / 26)) + '.', ['Biweekly: 26 cheques a year.'], 'biweekly cheque'); } }] },
      { num: '13', stem: function (sh) { return sh.who + ' works at a pet store for ' + D$(sh.w) + '/h, ' + sh.h + ' hours a week. Her manager gives her a choice: a raise to ' + D$(sh.w2) + '/h for the same hours, <b>or</b> ' + sh.k + ' more hours a week at ' + D$(sh.w) + '/h.'; },
        shared: function (r) { return find(function () { var w = wageC(r, 15, 18, 0.25), h = r.int(18, 28), k = r.int(2, 5), w2 = rnd(w + r.int(3, 7) * 0.25, 2); return { who: r.pick(['Nadia', 'Leila', 'Brooke']), w: w, h: h, k: k, w2: w2, A: h * w2, B: (h + k) * w }; }, function (s) { return Math.abs(s.A - s.B) >= 3; }, { who: 'Nadia', w: 16.5, h: 24, k: 3, w2: 17.75, A: 426, B: 445.5 }); },
        parts: [
          { id: '13ai', sub: 'a i', level: 'EMG', make: function (r, sh) {
            var ca = moneyChk(sh.A, [[sh.h * (sh.w2 - sh.w), 'u2l2-raise-only', 'That is only the extra money. Find her whole weekly pay at the new wage.'], [(sh.h + sh.k) * sh.w2, 'u2l2-compare', 'The raise is for the <b>same</b> hours (' + sh.h + ').']]),
              cb = moneyChk(sh.B, [[sh.k * sh.w, 'u2l2-raise-only', 'That is just the extra hours. Find her whole weekly pay: ' + (sh.h + sh.k) + ' hours.'], [sh.h * sh.w, 'u2l2-compare', 'Add the ' + sh.k + ' extra hours.']]);
            return fieldsPart('Find her weekly pay with each choice.', [{ label: 'With the raise:', before: '$', name: 'Raise' }, { label: 'With more hours:', before: '$', name: 'More hours' }], combo([{ name: 'With the raise', at: 0, chk: ca }, { name: 'With more hours', at: 1, chk: cb }]),
              [m$(sh.A), m$(sh.B)], 'raise: ' + t(M(sh.A)) + '; more hours: ' + t(M(sh.B)), sol(['raise: ' + t(sh.h + '\\times ' + M(sh.w2) + '=' + M(sh.A)), 'more hours: ' + t((sh.h + sh.k) + '\\times ' + M(sh.w) + '=' + M(sh.B))]), ['Raise: same hours × new wage. More hours: (' + sh.h + ' + ' + sh.k + ') × old wage.'], 'raise or hours'); } },
          { id: '13aii', sub: 'a ii', level: 'EMG', make: function (r, sh) { var d = r2(Math.abs(sh.A - sh.B)), best = sh.B > sh.A ? 'More hours' : 'The raise', other = best === 'More hours' ? 'The raise' : 'More hours', perH = r2(sh.w2 - sh.w);
            return P.mc(r, 'Which choice gives her more weekly pay, and by how much?', MCopts([
              { html: best + ', by ' + D$(d) + ' a week', right: true }, { html: other + ', by ' + D$(d) + ' a week', why: 'Compare the two weekly amounts from (a i): which is bigger?', code: 'u2l2-compare' },
              { html: 'The raise, by ' + D$(perH) + ' a week', why: D$(perH) + ' is the raise for <b>one</b> hour. Compare the weekly pay of each choice.', code: 'u2l2-raise-only' },
              { html: 'They give the same weekly pay.', why: 'Compare the two weekly amounts from (a i).', code: 'u2l2-compare' }]),
              'raise: ' + D$(sh.A) + '; more hours: ' + D$(sh.B) + '<br>' + best + ' gives ' + t(M(Math.max(sh.A, sh.B)) + '-' + M(Math.min(sh.A, sh.B)) + '=' + M(d)) + ' more a week.', ['Use your two amounts from (a i).'], 'which choice'); } },
          { id: '13b', level: 'EMG', make: function (r, sh) {
            return P.mc(r, 'Which is a good reason ' + sh.who + ' might still choose the raise?', [
              { html: 'She keeps more free time, and the higher wage is paid on every hour she works from now on.', right: true },
              { html: 'The raise always gives more money each week.', why: 'Not always — compare the weekly amounts in (a).', code: 'u2l2-reason' },
              { html: 'With a raise she no longer needs a timesheet.', why: 'She is still paid by the hour, so she still needs a timesheet.', code: 'u2l2-reason' },
              { html: 'A raise turns her wage into a salary.', why: 'A higher hourly rate is still a wage.', code: 'u2l2-vocab' }],
              'For example: she keeps more free time (no extra hours), and the higher wage is paid on every hour from now on (including any extra shifts later).', ['Think about time, not just this week’s pay.'], 'raise reason'); } }] },
      { num: '14', stem: function (sh) { return sh.a + ' and ' + sh.b + ' both earn a salary of ' + S$(sh.S) + ' a year. ' + sh.a + ' is paid biweekly. ' + sh.b + ' is paid semi-monthly.'; },
        shared: function (r) { return { a: r.pick(['Leah', 'Rana', 'Ivy']), b: r.pick(['Sam', 'Marcus', 'Theo']), S: 26 * find(function () { return r.int(1600, 2600) + r.pick([0, 50]); }, function (c) { return c !== 2200; }, 2100) }; },
        parts: [
          { id: '14a', level: 'EMG', make: function (r, sh) {
            var ca = moneyChk(sh.S / 26, periodBad(sh.S, 26, 'div')), cb = moneyChk(sh.S / 24, periodBad(sh.S, 24, 'div'));
            return fieldsPart('Find the amount of each person’s paycheque.', [{ label: sh.a + ':', before: '$', name: sh.a }, { label: sh.b + ':', before: '$', name: sh.b }], combo([{ name: sh.a, at: 0, chk: ca }, { name: sh.b, at: 1, chk: cb }]),
              [m$(sh.S / 26), m$(sh.S / 24)], sh.a + ': ' + t(SM(sh.S / 26)) + '; ' + sh.b + ': ' + t(SM(sh.S / 24)), sol([sh.a + ': ' + t(SM(sh.S) + '\\div 26' + PK.eqM(sh.S / 26)), sh.b + ': ' + t(SM(sh.S) + '\\div 24' + PK.eqM(sh.S / 24))]), ['Biweekly: 26 cheques. Semi-monthly: 24 cheques.'], 'two cheques'); } },
          { id: '14b', level: 'EMG', make: function (r, sh) {
            return P.mc(r, 'Who earns more in a year? Why are ' + sh.a + '’s cheques smaller?', [
              { html: 'They earn the same, ' + S$(sh.S) + '. ' + sh.a + ' gets 26 cheques and ' + sh.b + ' gets 24, so the same salary is split into more pieces for ' + sh.a + '.', right: true },
              { html: sh.b + ' earns more, because each of his cheques is bigger.', why: 'Multiply each cheque by the number of cheques: both come to ' + S$(sh.S) + '.', code: 'u2l2-per-hour' },
              { html: sh.a + ' earns more, because she gets more cheques.', why: 'More cheques, but each one is smaller. Both earn ' + S$(sh.S) + '.', code: 'u2l2-compare' },
              { html: sh.a + ' earns less, because biweekly means fewer cheques than semi-monthly.', why: 'Biweekly is 26 cheques, semi-monthly is 24 — and both total ' + S$(sh.S) + '.', code: 'u2l2-periods' }],
              'They earn the same salary. ' + sh.a + ' gets 26 cheques and ' + sh.b + ' gets 24, so ' + sh.a + '’s salary is split into more, smaller pieces.', ['Both earn the same salary. What changes is how it is split up.'], 'same salary'); } }] },
      { num: '15', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '15', level: 'EMG', make: function (r) { var h = r.pick([40, 40, 35, 37.5]), w = wageC(r, 18, 26, 0.5), S = w * h * 52;
          return P.mc(r, 'A salary of ' + S$(S) + ' a year for a ' + dS(h) + '-hour week works out to an hourly equivalent of', MCopts([{ html: D$(w), right: true }, { html: D$(S / 52), why: 'That is the weekly pay. Divide by ' + t(dS(h) + '\\times 52') + ' hours.', code: 'u2l2-weekly' },
            { html: D$(S / h), why: 'Divide by the hours in a <b>year</b>: ' + t(dS(h) + '\\times 52') + '.', code: 'u2l2-per-week-hours' }, { html: D$(S / 12 / h), why: 'A year is 52 weeks, not 12 months of ' + dS(h) + ' h.', code: 'u2l2-month' }]),
            t(SM(S) + '\\div (' + dS(h) + '\\times 52)=' + SM(S) + '\\div ' + HW.fmt(dS(h * 52)) + '=' + M(w)), ['Hourly equivalent = salary ÷ (hours per week × 52).'], 'MC hourly eq'); } }] },
      { num: '16', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '16', level: 'BEG', make: function (r) { var v = find(function () { return [r.int(5, 8), r.pick([30, 30, 15, 45]), r.pick([15, 16, 17, 18, 20, 16.5])]; }, function (v) { return !(v[0] === 6 && v[1] === 45 && v[2] === 16); }, [7, 30, 16]), h = v[0], m = v[1], w = v[2], min = h * 60 + m;
          return P.mc(r, 'The gross pay for ' + h + ' h ' + m + ' min of work at ' + D$(w) + '/h is', MCopts([{ html: D$(min / 60 * w), right: true }, { html: D$((h + m / 100) * w), why: h + ' h ' + m + ' min is not ' + h + '.' + m + ' h. Change ' + m + ' min to part of an hour.', code: 'u2-dot-min' },
            { html: D$(h * w), why: 'That leaves out the ' + m + ' min.', code: 'u2l2-no-min' }, { html: D$((h + 1) * w), why: 'That is ' + (h + 1) + ' full hours.', code: 'u2-count-hours' }]),
            h + ' h ' + m + ' min = ' + dS(min / 60) + ' h; ' + t(dS(min / 60) + '\\times ' + M(w) + '=' + M(min / 60 * w)), ['Change the minutes to part of an hour first.'], 'MC gross'); } }] },
      { num: '17', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '17', level: 'EMG', make: function (r) { var c = find(function () { return r.int(1500, 2900); }, function (c) { return c !== 1625; }, 2125), S = c * 24;
          var chk = numChk(c, 0, periodBad(S, 24, 'div'), { nr: true });
          var p = PK.part('A salary of ' + S$(S) + ' a year is paid semi-monthly. Each paycheque is $____.', chk, String(c), String(c), t(SM(S) + '\\div 24=' + SM(c)), ['Semi-monthly: 24 cheques a year.'], 'NR semi', { nr: true });
          p.bad = chk.list.map(function (b) { return String(Math.round(b[0])); }).filter(function (s) { return s.length <= 4 && s !== String(c); }); return p; } }] },
      { num: '18', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '18', level: 'EMG', make: function (r) { var v = find(function () { return [r.int(4, 8), r.pick([15, 45]), wageC(r, 16, 22, 0.1)]; }, function (v) { var g = (v[0] + v[1] / 60) * v[2]; return Math.abs(g - Math.round(g)) > 0.08 && Math.abs(g - Math.floor(g) - 0.5) > 0.05; }, [6, 15, 18.4]), min = v[0] * 60 + v[1], g = min / 60 * v[2];
          var who = r.pick(['Hamid', 'Yusuf', 'Carlos']);
          var chk = numChk(g, 0, grossBad(min, v[2]), { nr: true });
          var p = PK.part(who + ' works ' + hmS(min) + ' at ' + D$(v[2]) + '/h. His gross pay, to the nearest dollar, is $____.', chk, String(Math.round(g)), String(Math.round(g)), sol([hmS(min) + ' = ' + dS(min / 60) + ' h', t(dS(min / 60) + '\\times ' + M(v[2]) + '=\\$' + dS(rnd(g, 4)) + '\\approx\\$' + Math.round(g))]), ['Change the time to decimal hours, multiply by the wage, then round to the nearest dollar.'], 'NR gross', { nr: true });
          p.bad = chk.list.map(function (b) { return String(Math.round(b[0])); }).filter(function (s) { return s.length <= 4 && s !== String(Math.round(g)); }); return p; } }] }
    ],
    extra: [
      { num: '1', section: 'A. Skills', stem: 'Find the gross pay.', parts: [
        { id: 'e1a', level: 'BEG', make: function (r) { var h = r.int(4, 9), w = r.pick([15.5, 16.5, 15.75, 17.25, 18.5]); return grossPart(h + ' h at ' + D$(w) + '/h', h * 60, w); } },
        { id: 'e1b', level: 'BEG', make: function (r) { var h = r.int(3, 7), w = r.pick([20, 18, 16, 24, 22]), m = r.pick([15, 45, 30]); return grossPart(h + ' h ' + m + ' min at ' + D$(w) + '/h', h * 60 + m, w); } },
        { id: 'e1c', level: 'EMG', make: function (r) { var x = r.pick([7.75, 6.25, 5.5, 8.75, 4.75]), w = wageC(r, 16, 21, 0.1); return grossPart(dS(x) + ' h at ' + D$(w) + '/h', Math.round(x * 60), w, { sol: 'gross pay ' + t('=' + dS(x) + '\\times ' + M(w) + PK.eqM(x * w)) }); } }] },
      { num: '2', stem: 'Find the hourly wage.', parts: [
        { id: 'e2a', level: 'BEG', make: function (r) { var h = r.int(16, 32), w = r.pick([15.75, 16.25, 15.5, 17.25, 16.75]); return wagePart(D$(h * w) + ' for ' + h + ' hours', h * w, h); } },
        { id: 'e2b', level: 'EMG', make: function (r) { var v = find(function () { return [r.int(20, 36) + 0.5, wageC(r, 16, 22, 0.2)]; }, function (v) { return !(v[0] === 25.5 && v[1] === 17.5); }, [32.5, 18.8]); return wagePart(D$(v[0] * v[1]) + ' for ' + dS(v[0]) + ' hours', rnd(v[0] * v[1], 2), v[0]); } }] },
      { num: '3', stem: '', parts: [
        { id: 'e3', level: 'EMG', make: function (r) { var S = 52 * find(function () { return r.int(780, 1300) + r.pick([0, 10, 20]) * 0 + r.pick([0, 50]) * 0; }, function (k) { return !near(k * 52 / 24 * 100, Math.round(k * 52 / 24 * 100)) || (k * 52) % 24 !== 0; }, 950);
          var cols = U.PERIODS.map(function (p) { return '\\text{' + p[0] + '}'; }), blanks = U.PERIODS.map(function (p, j) { return { where: 'cell', i: 0, j: j, name: cap(p[0]), chk: moneyChk(S / p[1], periodBad(S, p[1], 'div')) }; });
          return PK.tablePart('A salary is ' + S$(S) + ' a year. Find the pay per cheque for each pay period. Round to the nearest cent.', { rows: ['\\text{Pay per cheque}'], cols: cols, cells: [[null, null, null, null]], corner: '\\text{Paid}', keys: 'pctkit-money', help: 'Tap a box, then type the amount (no $ needed).' },
            PK.tableChk(blanks), { rows: ['\\text{Pay per cheque}'], cols: cols, cells: [U.PERIODS.map(function (p) { return m$(S / p[1]); })] },
            U.PERIODS.map(function (p) { return p[0] + ': ' + t(HW.fmt(S) + '\\div ' + p[1] + PK.eqM(S / p[1]).replace(/\\\$/g, '\\$')); }).join('<br>'), ['Pay per cheque = yearly salary ÷ number of pay periods. Round to the cent.'], 'cheque table r'); } }] },
      { num: '4', stem: 'Find the yearly salary.', parts: [
        { id: 'e4a', level: 'BEG', make: function (r) { var c = find(function () { return r.int(1600, 2400) + r.pick([0, 25, 50, 75]); }, function (c) { return c !== 1925.5; }, 2075); return moneyPart(D$(c) + ' paid biweekly', c * 26, periodBad(c, 26, 'mul'), t(M(c) + '\\times 26=' + SM(c * 26)), ['Biweekly: 26 cheques a year.'], 'yearly biweekly'); } },
        { id: 'e4b', level: 'BEG', make: function (r) { var c = r.int(60, 90) * 50 + r.pick([0, 25]); return moneyPart(D$(c) + ' paid monthly', c * 12, periodBad(c, 12, 'mul'), t(M(c) + '\\times 12=' + SM(c * 12)), ['Monthly: 12 cheques a year.'], 'yearly monthly'); } }] },
      { num: '5', section: 'B. Applying', stem: '', parts: [
        { id: 'e5', level: 'PRG', make: function (r) {
          var v = find(function () { var f = [clockMin(16, 0), clockMin(16, 0) + r.pick([240, 270, 285, 300])], s = [clockMin(r.int(8, 9), 0), 0], u = [clockMin(r.int(10, 11), 0), 0]; s[1] = s[0] + r.pick([480, 510, 525]); u[1] = u[0] + r.pick([240, 270, 300]); return [f, s, u]; }, function (v) { return true; }, null);
          var w = wageC(r, 15.5, 18, 0.1), who = r.pick(['Ethan', 'Kyle', 'Raj']), town = r.pick(['Airdrie', 'Cochrane', 'Leduc']);
          var hrs = [(v[0][1] - v[0][0]) / 60, (v[1][1] - v[1][0] - 30) / 60, (v[2][1] - v[2][0]) / 60], H = hrs[0] + hrs[1] + hrs[2], g = H * w, noB = H + 0.5;
          var hc = numChk(H, 2, [[noB, 'u2-break', 'Take off the 30-minute unpaid break on Saturday.']]), gc = moneyChk(g, [[noB * w, 'u2-break', 'Take off the 30-minute unpaid break on Saturday.']].concat(grossBad(Math.round(H * 60), w)));
          return fieldsPart(who + ' works at a car wash in ' + town + ' for ' + D$(w) + '/h. One weekend he works Friday ' + c12(v[0][0]) + ' to ' + c12(v[0][1]) + ', Saturday ' + c12(v[1][0]) + ' to ' + c12(v[1][1]) + ' with a 30-minute unpaid break, and Sunday ' + c12(v[2][0]) + ' to ' + c12(v[2][1]) + '. What is his gross pay?',
            [{ label: 'Total hours:', after: 'h', name: 'Total hours' }, { label: 'Gross pay:', before: '$', name: 'Gross pay' }], combo([{ name: 'Total hours', at: 0, chk: hc }, { name: 'Gross pay', at: 1, chk: gc }]), [dS(H), m$(g)], dS(H) + ' h; ' + t(M(g)),
            sol(['Fri: ' + dS(hrs[0]) + ' h; Sat: ' + t(dS(hrs[1] + 0.5) + '-0.5=' + dS(hrs[1])) + ' h; Sun: ' + dS(hrs[2]) + ' h; total ' + t('=' + dS(H)) + ' h', 'gross pay ' + t('=' + dS(H) + '\\times ' + M(w) + PK.eqM(g))]), ['Find the hours each day (take off the unpaid break), add them, then multiply by the wage.'], 'car wash'); } }] },
      { num: '6', stem: function (sh) { return sh.who + ' is ' + sh.age + '. In ' + sh.mo + ' she worked ' + sh.h + ' hours at ' + sh.where + ' and was paid ' + D$(sh.pay) + '.'; },
        shared: function (r) { var w = r.pick([13, 13.5, 14, 14.25, 14.5]), h = r.int(20, 30); return { who: r.pick(['Chloe', 'Maya', 'Hana']), age: r.int(15, 17), mo: r.pick(SUMMER), where: r.pick(['an ice cream shop', 'a garden centre', 'a summer camp']), w: w, h: h, pay: w * h }; },
        parts: [
          { id: 'e6ai', sub: 'a i', level: 'EMG', make: function (r, sh) { return wagePart('What was her hourly wage?', sh.pay, sh.h); } },
          { id: 'e6aii', sub: 'a ii', level: 'EMG', make: function (r, sh) {
            return P.mc(r, 'Was she paid at least Alberta’s minimum wage?', [
              { html: 'No: in the summer the minimum is ' + D$(15) + '/h, and she was paid ' + D$(sh.w) + '/h.', right: true },
              { html: 'Yes: she is under 18, so the minimum is ' + D$(13) + '/h.', why: 'The ' + D$(13) + ' student rate is only while school is in session. ' + sh.mo + ' is summer.', code: 'u2l2-student-summer' },
              { html: 'Yes: she worked under 28 hours.', why: 'The 28-hour rule is part of the student rate, which doesn’t apply in the summer.', code: 'u2l2-student-summer' },
              { html: 'No: students must always be paid more than adults.', why: 'That isn’t a rule. In the summer students get the same ' + D$(15) + ' minimum as everyone else.', code: 'u2l2-reason' }],
              t(M(sh.pay) + '\\div ' + sh.h + '=' + M(sh.w)) + '/h. In the summer the minimum is ' + D$(15) + '/h, so no.', ['Is school in session in ' + sh.mo + '?'], 'Chloe legal'); } },
          { id: 'e6b', level: 'PRG', make: function (r, sh) { var least = sh.h * 15, short = least - sh.pay;
            var ca = moneyChk(least, [[sh.h * 13, 'u2l2-student-summer', 'In the summer the student rate doesn’t apply: use ' + D$(15) + '/h.']]), cb = moneyChk(short, [[least, 'u2l2-short', 'That is what she should have been paid. How much <b>less</b> did she get?'], [sh.h * 13 - sh.pay, 'u2l2-student-summer', 'Use the ' + D$(15) + ' summer minimum.'], [15 - sh.w, 'u2l2-per-hour', 'That is the shortfall for <b>one</b> hour. Multiply by ' + sh.h + ' h (or subtract the totals).']]);
            return fieldsPart('What is the least she should have been paid? How much is she short?', [{ label: 'Least pay:', before: '$', name: 'Least pay' }, { label: 'Short by:', before: '$', name: 'Short by' }], combo([{ name: 'Least pay', at: 0, chk: ca }, { name: 'Short by', at: 1, chk: cb }]),
              [m$(least), m$(short)], t(M(least)) + '; short ' + t(M(short)), sol([t(sh.h + '\\times ' + M(15) + '=' + M(least)), t(M(least) + '-' + M(sh.pay) + '=' + M(short)) + ' short']), ['Least pay = hours × the minimum wage that applies.', 'Short by = least pay − what she was paid.'], 'Chloe short'); } }] },
      { num: '7', stem: '', parts: [
        { id: 'e7', level: 'EMG', make: function (r) { var v = find(function () { return [r.pick([35, 37.5, 36, 32, 30]), wageC(r, 18, 26, 0.5)]; }, function (v) { return !(v[0] === 40 && v[1] === 22.5); }, [35, 22]), S = v[0] * 52 * v[1];
          return moneyPart('An office assistant earns a salary of ' + S$(S) + ' a year for ' + dS(v[0]) + ' hours a week. What is the hourly equivalent?', v[1], hourlyEqBad(S, v[0]),
            t(dS(v[0]) + '\\times 52=' + HW.fmt(dS(v[0] * 52))) + ' h a year; ' + t(SM(S) + '\\div ' + HW.fmt(dS(v[0] * 52)) + '=' + M(v[1])) + '/h', ['Hourly equivalent = salary ÷ (hours per week × 52).'], 'hourly eq', { after: '/h' }); } }] },
      { num: '8', stem: function (sh) { return '<b>Job A</b> pays ' + D$(sh.wA) + '/h for ' + sh.hA + ' hours a week. <b>Job B</b> pays a salary of ' + S$(sh.S) + ' a year for ' + sh.hB + ' hours a week.'; },
        shared: function (r) { return find(function () { var wA = wageC(r, 20, 27, 0.5), hA = r.pick([32, 35, 36]), hB = 40, perB = wageC(r, 19, 25, 0.25), wkB = perB * hB; return { wA: wA, hA: hA, hB: hB, perB: perB, wkB: wkB, S: wkB * 52, wkA: wA * hA }; }, function (s) { return s.wkB > s.wkA + 5 && s.perB < s.wA; }, { wA: 24.5, hA: 36, hB: 40, perB: 23, wkB: 920, S: 47840, wkA: 882 }); },
        parts: [
          { id: 'e8ai', sub: 'a i', level: 'EMG', make: function (r, sh) {
            var ca = moneyChk(sh.wkA, grossBad(sh.hA * 60, sh.wA)), cb = moneyChk(sh.wkB, [[sh.S / 12, 'u2l2-periods', 'That is a month. Divide by 52 for a week.'], [sh.S / 26, 'u2l2-periods', 'That is two weeks. Divide by 52.']]);
            return fieldsPart('Find the weekly pay for each job.', [{ label: 'Job A:', before: '$', after: 'a week', name: 'Job A' }, { label: 'Job B:', before: '$', after: 'a week', name: 'Job B' }], combo([{ name: 'Job A', at: 0, chk: ca }, { name: 'Job B', at: 1, chk: cb }]),
              [m$(sh.wkA), m$(sh.wkB)], 'A: ' + t(M(sh.wkA)) + '; B: ' + t(M(sh.wkB)), sol(['A: ' + t(sh.hA + '\\times ' + M(sh.wA) + '=' + M(sh.wkA)), 'B: ' + t(SM(sh.S) + '\\div 52=' + M(sh.wkB))]), ['A: hours × wage. B: salary ÷ 52.'], 'jobs weekly'); } },
          { id: 'e8aii', sub: 'a ii', level: 'EMG', make: function (r, sh) { return P.mc(r, 'Which job pays more per week?', [{ html: 'Job B, by ' + D$(sh.wkB - sh.wkA), right: true }, { html: 'Job A, by ' + D$(sh.wkB - sh.wkA), why: 'Compare the weekly amounts from (a i).', code: 'u2l2-compare' }, { html: 'Job A, because its hourly wage is higher', why: 'A higher wage for fewer hours can still mean less each week. Compare the weekly pay.', code: 'u2l2-per-hour' }, { html: 'They pay the same each week', why: 'Compare the weekly amounts from (a i).', code: 'u2l2-compare' }],
            'A: ' + D$(sh.wkA) + '; B: ' + D$(sh.wkB) + '. Job B pays ' + D$(sh.wkB - sh.wkA) + ' more a week.', ['Use (a i).'], 'more per week'); } },
          { id: 'e8bi', sub: 'b i', level: 'EMG', make: function (r, sh) { return moneyPart('What does Job B pay per hour?', sh.perB, [[sh.wkB / sh.hA, 'u2l2-per-hour', 'Job B is ' + sh.hB + ' hours a week.'], [sh.S / sh.hB, 'u2l2-per-week-hours', 'Use the weekly pay (salary ÷ 52), then divide by the hours.']].concat(hourlyEqBad(sh.S, sh.hB)), t(M(sh.wkB) + '\\div ' + sh.hB + '=' + M(sh.perB)) + '/h', ['Pay per hour = weekly pay ÷ hours per week.'], 'B per hour', { after: '/h' }); } },
          { id: 'e8bii', sub: 'b ii', level: 'EMG', make: function (r, sh) { return P.mc(r, 'Which job pays more per hour?', [{ html: 'Job A (' + D$(sh.wA) + '/h vs ' + D$(sh.perB) + '/h)', right: true }, { html: 'Job B, because it pays more each week', why: 'Job B pays more per week only because it has more hours. Compare the pay for <b>one</b> hour.', code: 'u2l2-per-hour' }, { html: 'They pay the same per hour', why: 'Compare ' + D$(sh.wA) + '/h with your answer to (b i).', code: 'u2l2-compare' }],
            'B: ' + t(M(sh.wkB) + '\\div ' + sh.hB + '=' + M(sh.perB)) + '/h, which is less than ' + D$(sh.wA) + '/h. Job A pays more per hour.', ['Compare the hourly amounts.'], 'more per hour'); } }] },
      { num: '9', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: 'e9', level: 'BEG', make: function (r) { var c = r.int(15, 28) * 100; return P.mc(r, 'A worker is paid ' + D$(c) + ' semi-monthly. Her yearly salary is', [{ html: S$(c * 24), right: true }, { html: S$(c * 12), why: 'Semi-monthly is <b>twice</b> a month: 24 cheques.', code: 'u2l2-periods' }, { html: S$(c * 26), why: '26 cheques is biweekly. Semi-monthly is 24.', code: 'u2l2-periods' }, { html: S$(c * 52), why: '52 cheques is weekly. Semi-monthly is 24.', code: 'u2l2-periods' }],
          t(M(c) + '\\times 24=' + SM(c * 24)), ['Semi-monthly: 24 cheques a year.'], 'MC semi'); } }] },
      { num: '10', stem: '<i>(Numerical Response)</i>', parts: [
        { id: 'e10', level: 'EMG', make: function (r) { var c = r.int(600, 1100), S = c * 52; var chk = numChk(c, 0, periodBad(S, 52, 'div'), { nr: true });
          var p = PK.part('A salary of ' + S$(S) + ' a year is paid weekly. Each paycheque is $____.', chk, String(c), String(c), t(SM(S) + '\\div 52=' + SM(c)), ['Weekly: 52 cheques a year.'], 'NR weekly', { nr: true });
          p.bad = chk.list.map(function (b) { return String(Math.round(b[0])); }).filter(function (s) { return s.length <= 4 && s !== String(c); }); return p; } }] },
      { num: '11', section: 'C. Stretch', stem: '', parts: [
        { id: 'e11', level: 'MAS', make: function (r) {
          var v = find(function () { var a = clockMin(r.int(8, 10), r.int(7, 11) * 5), b = clockMin(r.int(14, 16), r.int(1, 6) * 5); return [a, b]; }, function (v) { return v[1] % 60 < v[0] % 60 && (v[1] - v[0] - 30) % 15 === 0 && !(v[0] === 585 && v[1] === 915); }, [585, 915]);
          var w = wageC(r, 15.5, 18.5, 0.1), who = r.pick(['Paola', 'Sienna', 'Ruth']), A = hm(v[0]), B = hm(v[1]), dA = A[0] + A[1] / 100, dB = (B[0] - 12) + B[1] / 100, herH = rnd(dA - dB, 2);
          // like the booklet: she subtracts the 12-hour clock times like decimals (9.45 − 3.15 = 6.3)
          var len = v[1] - v[0], H = (len - 30) / 60, g = H * w;
          return moneyPart(who + ' worked from ' + c12(v[0]) + ' to ' + c12(v[1]) + ' with a 30-minute unpaid lunch. She earns ' + D$(w) + '/h. She wrote:<br><i>“' + A[0] + ':' + pad(A[1]) + ' to ' + (B[0] - 12) + ':' + pad(B[1]) + ' is ' + t(A[0] + '.' + pad(A[1]) + '-' + (B[0] - 12) + '.' + pad(B[1]) + '=' + dS(herH)) + ' h, so my pay is ' + t(dS(herH) + '\\times ' + M(w) + '=' + M(herH * w)) + '.”</i><br>Find her two mistakes and the correct gross pay.', g,
            [[herH * w, 'u2l2-paola-time', 'That’s her answer. Two things are wrong: the clock times were subtracted like decimals, and the lunch wasn’t taken off.'], [len / 60 * w, 'u2l2-paola-break', 'The time is right now — but take off the 30-minute unpaid lunch.'], [(herH - 0.5) * w, 'u2l2-paola-time', 'The lunch is taken off, but ' + dS(herH) + ' h is still wrong: you can’t subtract clock times like decimals. Count up from ' + c12(v[0])], [(herH - 0.3) * w, 'u2l2-paola-time', 'Count up from the start time to find the time worked; 30 min is 0.5 h.']],
            sol(['Mistake 1: you can’t subtract clock times like decimals (an hour has 60 minutes, not 100). ' + c12(v[0]) + ' to ' + c12(v[1]) + ' is ' + hmS(len) + ' = ' + dS(len / 60) + ' h.', 'Mistake 2: she didn’t take off the unpaid lunch: ' + t(dS(len / 60) + '-0.5=' + dS(H)) + ' h.', 'gross pay ' + t('=' + dS(H) + '\\times ' + M(w) + PK.eqM(g))]),
            ['Count up from the start to the end time (an hour has 60 minutes).', 'Take off the unpaid lunch, then multiply by the wage.'], 'Paola');
        } }] },
      { num: '12', stem: '', parts: [
        { id: 'e12', level: 'MAS', make: function (r) { var v = find(function () { return [wageC(r, 16, 22, 0.5), r.pick([3, 4, 5, 2.5]), r.int(25, 35)]; }, function (v) { return near(v[0] * (1 + v[1] / 100) * 100, Math.round(v[0] * (1 + v[1] / 100) * 100)); }, [18.5, 4, 30]), w = v[0], p = v[1], h = v[2], nw = r2(w * (1 + p / 100)), more = r2(h * nw - h * w);
          var who = r.pick(['Owen', 'Tariq', 'Ben']);
          var ca = moneyChk(nw, [[w + p, 'u2l2-raise-dollars', 'A ' + dS(p) + '% raise is not $' + dS(p) + '. Find ' + dS(p) + '% of ' + D$(w) + ': ' + t(M(w) + '\\times ' + dS(p / 100)) + '.'], [w * p / 100, 'u2l2-raise-only', 'That is the raise. Add it to the old wage (or multiply by ' + dS(1 + p / 100) + ').'], [w * (1 + p / 10), 'pct-one-place', dS(p) + '% = ' + dS(p / 100) + ', so multiply by ' + dS(1 + p / 100) + '.'], [w * p, 'pct-no-div', 'Change ' + dS(p) + '% to a decimal first.']]);
          var cb = moneyChk(more, [[h * nw, 'u2l2-new-weekly', 'That is his new weekly pay. How much <b>more</b> is it than before?'], [nw - w, 'u2l2-raise-only', 'That is the extra for one hour. He works ' + h + ' hours a week.'], [h * p, 'u2l2-raise-dollars', 'Use the new wage in dollars.']]);
          return fieldsPart(who + ' earns ' + D$(w) + '/h and works ' + h + ' hours a week. He gets a ' + dS(p) + '% raise. What is his new hourly wage, and how much more does he earn each week?', [{ label: 'New wage:', before: '$', after: '/h', name: 'New wage' }, { label: 'More each week:', before: '$', name: 'More each week' }],
            combo([{ name: 'New wage', at: 0, chk: ca }, { name: 'More each week', at: 1, chk: cb }]), [m$(nw), m$(more)], t(M(nw)) + '/h; ' + t(M(more)) + ' more a week',
            sol(['new wage ' + t('=' + M(w) + '\\times ' + dS(1 + p / 100) + '=' + M(nw)) + '/h', 'old weekly pay ' + t('=' + h + '\\times ' + M(w) + '=' + M(h * w)) + '; new ' + t('=' + h + '\\times ' + M(nw) + '=' + M(h * nw)), 'He earns ' + t(M(h * nw) + '-' + M(h * w) + '=' + M(more)) + ' more each week.']),
            ['A ' + dS(p) + '% raise: multiply the wage by ' + dS(1 + p / 100) + '.', 'Find the weekly pay before and after, then subtract.'], 'raise'); } }] },
      { num: '13', stem: function (sh) { return sh.who + '’s salary is ' + S$(sh.S) + ' a year, paid biweekly. She says, “I get two cheques a month, so I earn 2 × my cheque each month.”'; },
        shared: function (r) { return { who: r.pick(['Kim', 'Alana', 'Rosa']), S: 26 * find(function () { return r.int(15, 28) * 100; }, function (c) { return c * 26 % 12 !== 0; }, 2000) }; },
        parts: [
          { id: 'e13a', level: 'ADV', make: function (r, sh) { var c = sh.S / 26, mo = sh.S / 12;
            var ca = moneyChk(c, periodBad(sh.S, 26, 'div')), cb = moneyChk(mo, [[2 * c, 'u2l2-cheque-x2', 'That is two cheques. Her <b>average</b> month is her yearly salary ÷ 12.'], [sh.S / 24, 'u2l2-periods', 'Average per month = yearly salary ÷ 12.']]);
            return fieldsPart('Find her biweekly cheque and her average pay per month.', [{ label: 'Cheque:', before: '$', name: 'Cheque' }, { label: 'Average month:', before: '$', name: 'Average month' }], combo([{ name: 'Cheque', at: 0, chk: ca }, { name: 'Average month', at: 1, chk: cb }]),
              [m$(c), m$(mo)], t(SM(c)) + '; ' + t(SM(mo)), sol(['cheque ' + t('=' + SM(sh.S) + '\\div 26=' + SM(c)), 'average month ' + t('=' + SM(sh.S) + '\\div 12' + PK.eqM(mo).replace(/\\\$(\d{4,})/g, function (m0, d) { return '\\$' + HW.fmt(d); }))]), ['Biweekly: 26 cheques a year. Average month: yearly salary ÷ 12.'], 'Kim cheque'); } },
          { id: 'e13b', level: 'EMG', make: function (r, sh) { var c = sh.S / 26;
            return P.mc(r, 'Why is her average monthly pay more than ' + t('2\\times ' + SM(c)) + '?', [
              { html: t('2\\times ' + SM(c)) + ' each month only covers 24 cheques. She gets 26, so in two months of the year she gets three cheques.', right: true },
              { html: 'Because biweekly cheques get bigger near the end of the year.', why: 'Every biweekly cheque is the same amount.', code: 'u2l2-reason' },
              { html: 'Because a month has exactly 4 weeks.', why: 'Most months have a bit more than 4 weeks — that is why some months have 3 cheques.', code: 'u2l2-reason' },
              { html: 'It isn’t more: her average month is exactly 2 cheques.', why: 'Check (a): salary ÷ 12 is more than 2 cheques.', code: 'u2l2-cheque-x2' }],
              t('2\\times ' + SM(c) + '\\times 12') + ' covers only 24 cheques. She gets 26, so two months of the year have three cheques. Those extra cheques raise the average.', ['How many cheques does 2 a month give in a year? How many does she really get?'], 'Kim why'); } }] }
    ]
  });
  function clockMin(h, m) { return h * 60 + m; }
  HW.addCodes({ 'u2l2-vocab': 'Mixed up the pay words', 'u2l2-compare': 'Compared the wrong way', 'u2l2-reason': 'Reason with a wrong fact' });
})(window);
