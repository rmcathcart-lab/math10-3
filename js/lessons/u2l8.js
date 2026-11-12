/* Math 10-3 · Unit 2 · Lesson 8 — Working Backwards: How Many Hours Do I Need? (A1 for rearranging; N2 otherwise)
 * Assignment 8 (u2_l08.tex, Questions 1–18) and the Lesson 8 Extra Practice (u2_ep08.tex, Questions 1–15).
 * NEEDS js/lessons/u1l7.js (HW.pctKit) and js/lessons/u2l7.js (HW.u2pay) loaded first.
 * Every part is a generator: the same kind of wage, target pay, shift length, overtime, commission plan or deduction
 * rate as the booklet item, with new numbers (the booklet's own numbers can come up; the lesson's worked-example numbers
 * are left out). Calculator allowed. Money to the cent with the rounding nudges of HW.pctKit; hours and sales as numbers
 * ("32", "32 h" gets a "leave the unit out" nudge).
 * "Whole hours / shifts / trees / packages" answers: the next whole number up is right; rounding down is wrong with a
 * hint that shows the money is a little short; an unrounded answer (17.69) gets a nudge (no try used). A wage "rounded up
 * to the cent" works the same way. Rounding the net pay per hour too early, when it changes the answer, gets its own hint.
 * Recognised mistakes: rate ÷ pay (upside down), multiplying instead of dividing, the percent not changed to a decimal
 * (÷ 8 instead of ÷ 0.08), forgetting to take off the salary or add the quota, overtime hours at the regular rate, the
 * regular pay left out, gross pay used where net pay is needed, the deduction rate used instead of the part kept, the
 * GST left out, the first level of a graduated commission left out, the materials left out of a contract, …
 * Conversions: the formula column of the table and the fill-in formulas → a matching grid (which formula); "explain his
 * mistake" and "which offer should she take, and why" → multiple choice of reasons; the pay table → the fill-in table.
 *
 * Shared kit for Lesson 2.9: HW.u2back (whole-number "round up" checker and part, hours / rate / sales parts, net pay per
 * hour). Load this file before u2l9.js.
 * Outcomes: A1 (rearranging: hours = pay ÷ rate, rate = pay ÷ hours, sales = commission ÷ rate) and N2 (overtime,
 * deductions, piecework and the other pay steps), tagged per part. Levels: LIM BEG EMG PRG ADV MAS (MAS: Q12(b) and Extra 13 (A1);
 * Extra 14(a) and Extra 15(b) (N2)). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, PK = HW.pctKit, U = HW.u2pay;
  if (!PK || !U) throw new Error('u2l8 needs HW.pctKit (u1l7.js) and HW.u2pay (u2l7.js) loaded first');
  var r2 = PK.r2, rnd = PK.rnd, dS = PK.dS, m$ = PK.m$, near = PK.near, pctOf = PK.pctOf, find = PK.find, M = U.M, eqM = U.eqM, dec = U.dec, dec2 = U.dec2, sol = U.sol;
  function cents(x) { return Math.round(x * 100) / 100; }
  function step(r, lo, hi, st) { return rnd(lo + st * r.int(0, Math.round((hi - lo) / st)), 2); }
  function nT(x) { var s = dS(rnd(x, 6)); return near(x, rnd(x, 6)) && s.replace(/^\d*\.?/, '').length <= 6 ? s : x.toFixed(4) + '\\ldots'; }   // 41.935…
  function bigN(x) { var s = dS(x), p = s.split('.'); return (p[0].length > 4 ? p[0].replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : p[0]) + (p[1] ? '.' + p[1] : ''); }
  var A1 = 'A1', N2 = 'N2';

  /* ================= the working-backwards kit (HW.u2back) ================= */
  var B = HW.u2back = HW.u2back || {};
  /* a whole number, rounded UP from x. o: { unit ('hours'), each (money for one unit, for the shortfall hint), target, what ('earn'), diag(v) } */
  B.upChk = function (x, o) {
    o = o || {}; var up = Math.ceil(x - 1e-9), dn = up - 1, unit = o.unit || 'hours';
    return function (resp) {
      var a = PK.readV(resp);
      if (!a.ok) return form(a.code === 'empty' ? 'empty' : 'notnumber', a.code === 'empty' ? 'Type your answer first.' : 'Enter a single whole number.');
      var v = a.v;
      if (near(v, up)) return a.unit ? form('units', 'Leave the unit out — just type the number.') : ok();
      var h = o.diag && o.diag(v); if (h) return wrong(h.code, h.hint);
      if (!near(x, up) && near(v, dn)) return wrong('u2l8-round-down', (o.each != null ? t(dn) + ' ' + unit + ' gives only ' + t(M(dn * o.each)) + (o.target != null ? ', which is less than ' + t(M(o.target)) : '') + '. ' : '') + 'When you need <b>at least</b> an amount, round <b>up</b> to the next whole number.');
      if (Math.abs(v - x) < 0.01 || (a.dec > 0 && Math.abs(v - x) < 0.06)) return form('u2l8-whole', 'Right division — now give a whole number of ' + unit + '. You need <b>at least</b> the amount, so round <b>up</b>.');
      return wrong('value', null);
    };
  };
  B.upPart = function (prompt, x, o, solLines, hints, text) {
    o = o || {}; var up = Math.ceil(x - 1e-9);
    var p = PK.part(prompt, B.upChk(x, o), String(up), String(up) + (o.unitTex ? '\\text{ ' + o.unitTex + '}' : ''), sol(solLines), hints, text, { after: o.after || o.unit || 'hours' });
    p.bad = [String(up - 1), dS(rnd(x, 2))].filter(function (s) { return !near(Number(s), up); });
    return p;
  };
  /* a money amount rounded UP to the cent */
  B.upMoney = function (x, diag) {
    var up = Math.ceil(x * 100 - 1e-7) / 100, nearC = r2(x), base = PK.money(up, diag);
    return function (resp) { var a = PK.readV(resp); if (a.ok && !near(nearC, up) && near(a.v, nearC) && a.dec <= 2) return wrong('u2l8-cent-down', 'That rounds to the nearest cent, but it is a little short. You need <b>at least</b> the amount, so round <b>up</b> to the next cent.'); return base(resp); };
  };
  /* hours = pay ÷ rate (exact) */
  B.hoursChk = function (pay, rate, o) {
    o = o || {}; var h = pay / rate;
    return PK.num(h, o.dp == null ? null : o.dp, function (v) {
      var x = o.diag && o.diag(v); if (x) return x;
      if (near(v, rnd(rate / pay, 4)) || near(v, rnd(rate / pay, 2)) || near(v, rnd(rate / pay, 3))) return { code: 'u2l8-flip', hint: 'You divided the rate by the pay. Divide the <b>pay</b> by the <b>rate</b>: ' + t(M(pay) + '\\div ' + M(rate)) + '. (Estimate first: is it about ' + t(Math.round(pay / rate)) + '?)' };
      if (near(v, cents(pay * rate)) || near(v, pay * rate)) return { code: 'u2l8-mult', hint: 'Multiplying makes it bigger. hours ' + t('=') + ' pay ' + t('\\div') + ' rate.' };
      if (near(v, cents(pay - rate))) return { code: 'u2l8-subtract', hint: 'hours ' + t('=') + ' pay ' + t('\\div') + ' rate — divide, don’t subtract.' };
      return null;
    }, o.nr ? { nr: true } : null);
  };
  /* rate = pay ÷ hours (money) */
  B.rateChk = function (pay, hrs, o) {
    o = o || {};
    return PK.money(pay / hrs, function (v) {
      var x = o.diag && o.diag(v); if (x) return x;
      if (near(v, rnd(hrs / pay, 2)) || near(v, rnd(hrs / pay, 4))) return { code: 'u2l8-flip', hint: 'Divide the <b>pay</b> by the <b>hours</b>: ' + t(M(pay) + '\\div ' + dS(hrs)) + '.' };
      if (near(v, cents(pay * hrs))) return { code: 'u2l8-mult', hint: 'rate ' + t('=') + ' pay ' + t('\\div') + ' hours.' };
      return null;
    });
  };
  /* sales = commission ÷ rate (money, may be big) */
  B.salesDiag = function (c, p, o) {
    o = o || {};
    return function (v) {
      var x = o.diag && o.diag(v); if (x) return x;
      if (near(v, cents(c / p))) return { code: 'u2l8-no-dec', hint: 'Change ' + t(dS(p) + '\\%') + ' to a decimal first: ' + t(dS(p) + '\\%=' + dec(p)) + '. Sales needed are always much bigger than the commission.' };
      if (near(v, cents(c * p / 100))) return { code: 'u2l8-mult', hint: 'Multiplying by the rate makes it smaller. sales ' + t('=') + ' commission ' + t('\\div') + ' rate: ' + t(M(c) + '\\div ' + dec(p)) + '.' };
      if (near(v, cents(c * p))) return { code: 'u2l8-mult', hint: 'sales ' + t('=') + ' commission ' + t('\\div') + ' rate (as a decimal): ' + t(M(c) + '\\div ' + dec(p)) + '.' };
      if (near(v, cents(c / (p / 1000)))) return { code: 'u2l8-dec-place', hint: t(dS(p) + '\\%') + ' is ' + t(dec(p)) + ', not ' + t(dS(p / 1000)) + '.' };
      if (near(v, cents(c / (p / 10)))) return { code: 'u2l8-dec-place', hint: t(dS(p) + '\\%') + ' is ' + t(dec(p)) + ', not ' + t(dS(p / 10)) + '.' };
      return null;
    };
  };
  /* net pay for one hour = wage × (1 − total rate) */
  B.keep = function (rates) { return rnd(100 - rates.reduce(function (s, x) { return s + x; }, 0), 4); };
  B.nphChk = function (w, keepPct, dedPct) {
    return PK.money(w * keepPct / 100, function (v) {
      if (near(v, r2(w * dedPct / 100))) return { code: 'u2l8-ded-part', hint: 'That’s the part taken off. Net per hour ' + t('=') + ' wage ' + t('\\times (1-' + dec(dedPct) + ')=') + ' wage ' + t('\\times ' + dec(keepPct)) + '.' };
      if (near(v, r2(w - dedPct)) || near(v, r2(w - dedPct / 100))) return { code: 'u2l8-sub-pct', hint: 'Take off ' + t(dS(dedPct) + '\\%') + ' of the wage, not ' + t(dS(dedPct)) + ' dollars: wage ' + t('\\times ' + dec(keepPct)) + '.' };
      if (near(v, w)) return { code: 'u2l8-no-ded', hint: 'Take the deductions off: wage ' + t('\\times ' + dec(keepPct)) + '.' };
      return null;
    });
  };
  /* "need to take home N at wage w keeping k %": diag for the hours */
  B.netHoursDiag = function (N, w, k, o) {
    o = o || {}; var nph = w * k / 100;
    return function (v) {
      if (near(v, Math.ceil(N / w - 1e-9)) || near(v, rnd(N / w, 2))) return { code: 'u2l8-gross-hours', hint: 'That uses the whole wage. You take home only ' + t(dS(k) + '\\%') + ' of it: divide by the <b>net</b> pay for one hour.' };
      if (near(v, Math.ceil(N / (w * (100 - k) / 100) - 1e-9)) || near(v, rnd(N / (w * (100 - k) / 100), 2))) return { code: 'u2l8-ded-part', hint: 'Divide by what you <b>keep</b> each hour (wage ' + t('\\times ' + dec(k)) + '), not by the part taken off.' };
      if (o.price != null && (near(v, Math.ceil(o.price / nph - 1e-9)))) return { code: 'u2l8-no-gst', hint: 'Use the price <b>with GST</b> (price ' + t('\\times 1.05') + ').' };
      if (near(v, Math.ceil(N / r2(nph) - 1e-9)) && !near(Math.ceil(N / r2(nph) - 1e-9), Math.ceil(N / nph - 1e-9))) return { code: 'u2l8-early-round', hint: 'You rounded the net pay per hour too early. Use all its decimals (or do it in one line).' };
      return null;
    };
  };
  HW.addCodes({
    'u2l8-round-down': 'Rounded down when at least an amount is needed', 'u2l8-whole': 'Gave an unrounded number where whole units are asked', 'u2l8-cent-down': 'Rounded to the nearest cent instead of up',
    'u2l8-flip': 'Divided the wrong way (rate ÷ pay)', 'u2l8-mult': 'Multiplied instead of dividing', 'u2l8-subtract': 'Subtracted instead of dividing', 'u2l8-no-dec': 'Percent not changed to a decimal (÷ 8 for ÷ 0.08)',
    'u2l8-dec-place': 'Percent → decimal: wrong place', 'u2l8-ded-part': 'Used the deduction part instead of the part kept', 'u2l8-sub-pct': 'Subtracted the percent number from the wage', 'u2l8-no-ded': 'Left out the deductions',
    'u2l8-gross-hours': 'Used gross pay where net pay is needed', 'u2l8-no-gst': 'Left out the GST', 'u2l8-early-round': 'Rounded the net pay per hour too early', 'u2l8-no-salary': 'Did not take off the salary first',
    'u2l8-no-quota': 'Left out the quota', 'u2l8-no-first': 'Graduated commission: left out the first level', 'u2l8-ot-reg': 'Overtime hours at the regular rate', 'u2l8-no-reg': 'Left out the regular pay',
    'u2l8-total-hours': 'Gave the total hours, not the overtime hours', 'u2l8-paid-hours': 'Wage: did not count overtime as 1.5 (or 2) paid hours', 'u2l8-materials': 'Left out the materials', 'u2l8-per-trees': 'Piecework: divided the wrong way',
    'u2l8-shifts-hours': 'Gave hours instead of shifts', 'u2l8-weeks': 'Weeks: wrong rounding or division', 'u2l8-no-dues': 'Left out the union dues', 'u2l8-tip-only': 'Used only the wage or only the tips'
  });
  HW.addPartial({
    'u2l8-round-down': 's', 'u2l8-cent-down': 's', 'u2l8-flip': 'n', 'u2l8-mult': 'n', 'u2l8-subtract': 'n', 'u2l8-no-dec': 'b', 'u2l8-dec-place': 'b', 'u2l8-ded-part': 'b', 'u2l8-sub-pct': 'n', 'u2l8-no-ded': 'b',
    'u2l8-gross-hours': 'b', 'u2l8-no-gst': 's', 'u2l8-early-round': 's', 'u2l8-no-salary': 'b', 'u2l8-no-quota': 'b', 'u2l8-no-first': 'b', 'u2l8-ot-reg': 'b', 'u2l8-no-reg': 'b', 'u2l8-total-hours': 's',
    'u2l8-paid-hours': 'b', 'u2l8-materials': 'b', 'u2l8-per-trees': 'n', 'u2l8-shifts-hours': 's', 'u2l8-weeks': 's', 'u2l8-no-dues': 's', 'u2l8-tip-only': 'b'
  });

  /* ================= Lesson 8 generators ================= */
  function hoursPart(prompt, pay, rate, o) {
    o = o || {}; var h = pay / rate;
    var p = PK.part(prompt, B.hoursChk(pay, rate, o), dS(rnd(h, 6)), dS(rnd(h, 6)), sol(['hours ' + t('=') + ' pay ' + t('\\div') + ' rate', 'hours ' + t('=' + M(pay) + '\\div ' + M(rate) + '=' + dS(rnd(h, 6))), 'Check: ' + t(M(rate) + '\\times ' + dS(rnd(h, 6)) + '=' + M(pay)) + ' ✓'].concat(o.end ? [o.end] : [])), o.hints || ['hours = pay ÷ rate.', 'Estimate first, then check: rate × hours should give the pay.'], o.text || 'hours', o.nr ? { nr: true } : { after: 'hours' });
    p.bad = [dS(rnd(rate / pay, 4)), dS(cents(pay * rate))];
    return p;
  }
  function ratePart(prompt, pay, hrs, o) {
    o = o || {}; var w = pay / hrs;
    var p = PK.part(prompt, B.rateChk(pay, hrs, o), m$(w), M(w), sol((o.pre || []).concat(['rate ' + t('=') + ' pay ' + t('\\div') + ' hours', 'rate ' + t('=' + M(pay) + '\\div ' + dS(hrs) + eqM(w)) + ' an hour', 'Check: ' + t(M(w) + '\\times ' + dS(hrs) + '=' + M(w * hrs)) + ' ✓'].concat(o.end ? [o.end] : []))), o.hints || ['rate = pay ÷ hours.'], o.text || 'rate', { before: '$', after: '/h' });
    p.bad = [m$(hrs / pay), m$(pay * hrs)];
    return p;
  }
  function salesPart(prompt, c, p, o) {
    o = o || {}; var s = c / (p / 100), base = o.base || 0, tot = base + s, pre = o.pre || [];
    var dg = B.salesDiag(c, p, o);
    var pp = PK.part(prompt, PK.money(tot, dg), m$(tot), '' + M(tot), sol(pre.concat([(dS(p) + '\\%') === '' ? '' : t(dS(p) + '\\%=' + dec(p)), (o.salesWord || 'sales') + ' ' + t('=' + M(c) + '\\div ' + dec(p) + '=' + M(s)), o.after2 || '', 'Check: ' + (o.check || t(dec(p) + '\\times ' + M(s) + '=' + M(c))) + ' ✓'].filter(Boolean))), o.hints || ['sales = commission ÷ rate (as a decimal).', 'The sales are much bigger than the commission.'], o.text || 'sales', { before: '$' });
    pp.bad = [m$(c / p + base), m$(c * p / 100 + base)];
    return pp;
  }
  B.hoursPart = hoursPart; B.ratePart = ratePart; B.salesPart = salesPart; B.step = step; B.nT = nT; B.bigN = bigN;

  /* Q1: the table */
  function q1shared(r) {
    return find(function () {
      var a = [step(r, 14.5, 18, 0.25), r.int(16, 30)], b = [r.pick([15, 16, 17, 18, 20]), r.int(20, 38)], c = [step(r, 16.5, 20.5, 0.25), r.int(24, 36)], d = [step(r, 20, 24.8, 0.2), r.int(20, 36)], e = [step(r, 17, 22, 0.5), r.pick([37.5, 35, 32.5, 22.5])];
      return [a, b, c, d, e].map(function (x) { return { w: x[0], h: x[1], pay: cents(x[0] * x[1]) }; });
    }, function (s) { return !s.some(function (x) { return (near(x.w, 16.25) && x.h === 32) || (near(x.w, 17.5) && near(x.h, 25.5)); }); }, [{ w: 15, h: 20, pay: 300 }, { w: 16, h: 30, pay: 480 }, { w: 18.25, h: 30, pay: 547.5 }, { w: 22.4, h: 28, pay: 627.2 }, { w: 19.5, h: 37.5, pay: 731.25 }]);
  }
  var FIND = ['pay', 'h', 'w', 'h', 'w'], FORM = { pay: 'pay = rate × hours', h: 'hours = pay ÷ rate', w: 'rate = pay ÷ hours' };
  function q1table(sh) {
    var rows = ['(a)', '(b)', '(c)', '(d)', '(e)'].map(function (x) { return '\\text{' + x + '}'; }), cols = ['\\text{Rate (\\$/h)}', '\\text{Hours}', '\\text{Pay}'];
    var cells = [], keyC = [], blanks = [];
    sh.forEach(function (x, i) {
      var f = FIND[i], c = [M(x.w), dS(x.h), M(x.pay)], k = c.slice();
      var j = f === 'w' ? 0 : f === 'h' ? 1 : 2;
      k[j] = f === 'h' ? dS(x.h) : m$(f === 'w' ? x.w : x.pay); c[j] = null;
      blanks.push({ where: 'cell', i: i, j: j, name: '(' + 'abcde'[i] + ')', chk: f === 'pay' ? PK.money(x.pay, function (v) { if (near(v, cents(x.w + x.h))) return { code: 'u2l7-add-hr', hint: 'pay ' + t('=') + ' rate ' + t('\\times') + ' hours.' }; return null; }) : f === 'h' ? B.hoursChk(x.pay, x.w) : B.rateChk(x.pay, x.h) });
      cells.push(c); keyC.push(k);
    });
    var s = sh.map(function (x, i) { var f = FIND[i]; return '(' + 'abcde'[i] + ') ' + (f === 'pay' ? t(M(x.w) + '\\times ' + dS(x.h) + '=' + M(x.pay)) : f === 'h' ? t(M(x.pay) + '\\div ' + M(x.w) + '=' + dS(x.h)) : t(M(x.pay) + '\\div ' + dS(x.h) + '=' + M(x.w))) + ' &nbsp; (' + FORM[f] + ')'; });
    return PK.tablePart('Complete the table.', { rows: rows, cols: cols, cells: cells, corner: '\\text{Row}', keys: 'pctkit-money', help: 'Tap a box, then type the number (no $ needed).' }, PK.tableChk(blanks), { rows: rows, cols: cols, cells: keyC }, sol(s),
      ['pay = rate × hours; hours = pay ÷ rate; rate = pay ÷ hours.', 'Check each row: rate × hours should give the pay.'], 'Q1 table');
  }
  function q1formula(r, sh) {
    var rows = sh.map(function (x, i) { return { id: 'abcde'[i], html: '(' + 'abcde'[i] + ') find the ' + (FIND[i] === 'pay' ? 'pay' : FIND[i] === 'h' ? 'hours' : 'rate') }; }), want = {};
    sh.forEach(function (x, i) { want['abcde'[i]] = FIND[i]; });
    var cols = [{ id: 'pay', html: 'pay = rate × hours' }, { id: 'h', html: 'hours = pay ÷ rate' }, { id: 'w', html: 'rate = pay ÷ hours' }];
    return P.grid('Which formula did you use in each row of the table?', rows, cols, want, { why: function () { return { code: 'u2l8-formula', hint: 'Cover the one you want to find in the formula triangle: pay on top, rate and hours below.' }; } },
      rows.map(function (rw) { return rw.html + ': ' + FORM[want[rw.id]]; }).join('<br>'), ['Put the thing you want to find by itself on one side.'], 'Q1 formulas');
  }
  /* Q6 Noor */
  function noorShared(r) { return find(function () { var h = r.int(20, 27), w = step(r, 15.5, 18.5, 0.5), T = step(r, 450, 600, 25), up = r.pick([1, 1.5, 2, 1.25]); return { h: h, w: w, T: T, up: up, name: r.pick(['Noor', 'Amira', 'Lana', 'Sara']), store: r.pick(['pet store', 'garden centre', 'bike shop', 'bakery']) }; }, function (s) { var a = s.T / s.w, b = s.T / (s.w + s.up), c = s.T / s.h; return s.h * s.w < s.T && !near(a, Math.round(a)) && !near(b, Math.round(b)) && Math.ceil(a - 1e-9) !== Math.ceil(b - 1e-9) && !near(c * 100, Math.round(c * 100)) && r2(c) < Math.ceil(c * 100 - 1e-7) / 100; }, { h: 24, w: 17, T: 500, up: 1.5, name: 'Noor', store: 'pet store' }); }
  /* Q12 Zoe */
  function zoeShared(r) { return find(function () { var a = r.pick([6, 7, 8, 9]), b = r.pick([2, 3, 4]), S = r.pick([1200, 1500, 1800, 1000, 1600]); return { a: a, b: b, S: S, be: S / ((a - b) / 100), name: r.pick(['Zoe', 'Kira', 'Tess', 'Abby']), what: r.pick(['solar panels', 'hot tubs', 'furniture', 'windows']) }; }, function (s) { return s.a - s.b >= 3 && s.be % 2500 === 0 && s.be >= 20000 && s.be <= 60000; }, { a: 7, b: 3, S: 1500, be: 37500, name: 'Zoe', what: 'solar panels' }); }
  function zoeLow(sh) { return sh.be - (sh.be >= 30000 ? 10000 : 7500); }
  function zoeHigh(sh) { return sh.be + (sh.be >= 30000 ? 12500 : 10000); }
  /* Q14 Harper */
  function harperShared(r) { return find(function () { return { w: step(r, 18, 24, 0.5), tx: r.pick([12, 13, 14, 15, 16]), goal: step(r, 3000, 5000, 250), wk: r.pick([15, 20, 25]), name: r.pick(['Harper', 'Quinn', 'Rowan', 'Avery']), what: r.pick(['a used truck', 'a used car', 'tools for her apprenticeship', 'a trip']) }; }, function (s) { var k = B.keep([5.95, 1.64, s.tx]), nph = s.w * k / 100, h = s.goal / nph; return !near(h, Math.round(h)) && !(near(s.w, 18.5) && s.tx === 15); }, { w: 21, tx: 15, goal: 4500, wk: 20, name: 'Harper', what: 'a used truck' }); }
  /* Extra 14 Cole */
  function coleShared(r) { return find(function () { return { w: step(r, 17, 23, 0.5), d: r.pick([20, 25, 22, 18]), u: r.pick([15, 20, 12.5, 18]), N: r.pick([900, 1000, 1100, 1200, 800]), name: r.pick(['Cole', 'Wyatt', 'Grant', 'Reid']) }; }, function (s) { var G = (s.N + s.u) / (1 - s.d / 100); return near(G, cents(G)) && !near(G / s.w, Math.round(G / s.w)); }, { w: 19, d: 20, u: 15, N: 1000, name: 'Cole' }); }
  /* Extra 15 Liv */
  function livShared(r) { return find(function () { return { N: r.pick([2400, 2000, 1800, 2800, 3200]), wk: r.pick([8, 10, 6, 8]), w: step(r, 15.5, 19, 0.25), d: r.pick([18, 20, 21, 22, 24]), name: r.pick(['Liv', 'Elsa', 'Maren', 'Ingrid']) }; }, function (s) { var per = s.N / s.wk, h = per / (s.w * (100 - s.d) / 100), f = h - Math.floor(h); return near(per, cents(per)) && f > 0.003 && f < 0.12; }, { N: 2400, wk: 8, w: 17.25, d: 21, name: 'Liv' }); }

  HW.addCodes({ 'u2l8-formula': 'Picked the wrong formula' });
  HW.addPartial({ 'u2l8-formula': 's' });

  HW.defineLesson({
    id: 'u2l8', unit: 2, num: '8', title: 'Working Backwards: How Many Hours Do I Need?', outcome: 'A1',
    blurb: 'Rearrange the pay formula to find the hours, the wage or the sales you need; round hours up; overtime, commission and net pay targets.',
    questions: [
      { num: '1', stem: '', shared: function (r) { return q1shared(r); }, parts: [
        { id: '1', sub: 'table', level: 'BEG', make: function (r, sh) { return q1table(sh); } },
        { id: '1f', sub: 'formulas', level: 'BEG', make: function (r, sh) { return q1formula(r, sh); } }] },
      { num: '2', stem: 'Rearrange each formula.', parts: [
        { id: '2a', level: 'BEG', make: function (r) {
          var cols = r.shuffle([{ id: 'pr', html: 'pay ÷ rate' }, { id: 'ph', html: 'pay ÷ hours' }, { id: 'rp', html: 'rate ÷ pay' }, { id: 'px', html: 'pay × rate' }]);
          return P.grid('pay = rate × hours, so…', [{ id: 'h', html: 'hours =' }, { id: 'w', html: 'rate =' }], cols, { h: 'pr', w: 'ph' }, { why: function (row, got) { return { code: 'u2l8-formula', hint: got === 'rp' ? 'That’s upside down: the pay goes on top.' : got === 'px' ? 'To undo “× rate”, divide by the rate.' : 'To find one of the two numbers that are multiplied, divide the pay by the other one.' }; } },
            'hours ' + t('=') + ' pay ' + t('\\div') + ' rate, and rate ' + t('=') + ' pay ' + t('\\div') + ' hours.', ['Check with numbers: $80 at $16/h for 5 h. 80 ÷ 16 = 5 ✓'], 'rearrange pay');
        } },
        { id: '2b', level: 'BEG', make: function (r) {
          return P.mc(r, 'commission = rate × sales, so sales =', [{ html: 'commission ÷ rate', right: true }, { html: 'rate ÷ commission', why: 'That’s upside down: the commission goes on top.', code: 'flip' }, { html: 'commission × rate', why: 'To undo “× rate”, divide by the rate.', code: 'mult' }, { html: 'commission − rate', why: 'Undo multiplying by dividing.', code: 'sub' }],
            'sales ' + t('=') + ' commission ' + t('\\div') + ' rate. (Check: ' + t('\\$1200\\div 0.08=\\$15\\,000') + ', and ' + t('0.08\\times\\$15\\,000=\\$1200') + ' ✓)', ['Divide both sides by the rate.'], 'rearrange commission');
        } }] },
      { num: '3', stem: function (sh) { return sh.name + ' is 16 and works part-time at a ' + sh.job + ' during the school year. She earns ' + t('\\$13.00') + ' an hour (the Alberta student rate, as of 2026; rates can change).'; },
        shared: function (r) { return { name: r.pick(['Ella', 'Maya', 'Chloe', 'Ruby']), job: r.pick(['bakery', 'grocery store', 'movie theatre', 'garden centre']) }; },
        parts: [
          { id: '3a', level: 'BEG', make: function (r) { var h = r.int(10, 24); return hoursPart('How many hours must she work to earn ' + t(M(13 * h)) + '?', 13 * h, 13, { text: 'student hours' }); } },
          { id: '3b', level: 'EMG', make: function (r) { var T = find(function () { return step(r, 200, 320, 5); }, function (x) { return x % 13 !== 0 && !near(x, 234); }, 230), x = T / 13, up = Math.ceil(x); return B.upPart('How many whole hours must she work to earn at least ' + t(M(T)) + '?', x, { each: 13, target: T }, [t(M(T) + '\\div \\$13.00=' + nT(x) + '\\;\\to\\;' + up) + ' hours (round up)', 'Check: ' + t(up + '\\times \\$13.00=' + M(13 * up)) + ' ✓ (' + t(up - 1) + ' h gives only ' + t(M(13 * (up - 1))) + ')'], ['hours = pay ÷ rate.', 'You need at least the amount, so round up.'], 'student at least'); } }] },
      { num: '4', stem: function (sh) { return sh.name + ' earns ' + t(M(sh.w)) + ' an hour and wants to earn ' + t(M(sh.T)) + '. Here is his work:<div style="margin:6px 0 6px 16px">hours ' + t('=' + dS(sh.w) + '\\div ' + dS(sh.T) + '=' + dS(rnd(sh.w / sh.T, 4))) + ', so I need ' + t(dS(rnd(sh.w / sh.T, 4))) + ' hours.</div>'; },
        shared: function (r) { return find(function () { var w = r.pick([15, 16, 17, 18, 20, 15.5, 16.5]), h = r.int(18, 32); return { w: w, h: h, T: w * h, name: r.pick(['Jordan', 'Evan', 'Malik', 'Finn']) }; }, function (s) { return !(s.w === 16.25) && near(s.T, cents(s.T)); }, { w: 16, h: 25, T: 400, name: 'Jordan' }); },
        parts: [
          { id: '4a', level: 'BEG', make: function (r, sh) { var mins = rnd(sh.w / sh.T * 60, 1); return P.mc(r, 'What is his mistake?', [
            { html: 'He divided the rate by the pay. It should be pay ÷ rate. (' + t(dS(rnd(sh.w / sh.T, 4))) + ' h is about ' + t(dS(mins)) + ' minutes, which can’t earn ' + t(M(sh.T)) + '.)', right: true },
            { html: 'He should have multiplied: ' + t(dS(sh.w) + '\\times ' + dS(sh.T)) + '.', why: 'That would be thousands of hours. Divide the pay by the rate.', code: 'mult' },
            { html: 'He forgot to round up to 1 hour.', why: 'Rounding won’t fix it: the division is the wrong way round.', code: 'round' },
            { html: 'There is no mistake.', why: 'Check: ' + t(M(sh.w) + '\\times ' + dS(rnd(sh.w / sh.T, 4))) + ' is only a few cents, not ' + t(M(sh.T)) + '.', code: 'none' }],
            'He divided the rate by the pay. It should be pay ' + t('\\div') + ' rate.', ['Does the answer make sense? Estimate first.'], 'Jordan mistake'); } },
          { id: '4b', level: 'BEG', make: function (r, sh) { return hoursPart('Find the correct answer.', sh.T, sh.w, { text: 'Jordan hours' }); } }] },
      { num: '5', stem: function (sh) { return sh.name + ' works ' + sh.s + '-hour shifts at a coffee shop for ' + t(M(sh.w)) + ' an hour. She wants to earn at least ' + t(M(sh.T)) + ' (gross) for a ' + sh.what + '.'; },
        shared: function (r) { return find(function () { return { s: r.pick([4, 5, 6]), w: step(r, 15.25, 17.5, 0.25), T: step(r, 700, 1300, 50), name: r.pick(['Amara', 'Bella', 'Nadia', 'Iris']), what: r.pick(['school trip', 'band trip', 'new laptop']) }; }, function (s) { var x = s.T / s.w, hu = Math.ceil(x - 1e-9); return !near(x, hu) && hu % s.s !== 0 && Math.ceil(hu / s.s) > (hu / s.s) + 0.05; }, { s: 5, w: 15.75, T: 1000, name: 'Amara', what: 'school trip' }); },
        parts: [
          { id: '5a', level: 'EMG', make: function (r, sh) { var x = sh.T / sh.w, up = Math.ceil(x - 1e-9); return B.upPart('How many whole hours must she work?', x, { each: sh.w, target: sh.T }, [t(M(sh.T) + '\\div ' + M(sh.w) + '=' + nT(x) + '\\;\\to\\;' + up) + ' hours'], ['hours = pay ÷ rate. Round up.'], 'Amara hours'); } },
          { id: '5b', level: 'EMG', make: function (r, sh) { var hu = Math.ceil(sh.T / sh.w - 1e-9), x = hu / sh.s, up = Math.ceil(x - 1e-9); var p = B.upPart('How many shifts is that?', x, { unit: 'shifts', each: sh.s * sh.w, target: sh.T, diag: function (v) { if (near(v, hu)) return { code: 'u2l8-shifts-hours', hint: 'That’s the hours. Each shift is ' + t(sh.s) + ' hours: divide.' }; return null; } },
            [t(hu + '\\div ' + sh.s + '=' + dS(rnd(x, 4)) + '\\;\\to\\;' + up) + ' shifts (she can’t work part of a shift)', 'Check: ' + t(up + '\\times ' + sh.s + '=' + up * sh.s) + ' h; ' + t(up * sh.s + '\\times ' + M(sh.w) + '=' + M(up * sh.s * sh.w)) + ', at least ' + t(M(sh.T)) + ' ✓ (' + t(up - 1) + ' shifts give only ' + t(M((up - 1) * sh.s * sh.w)) + ')'], ['Shifts = hours ÷ hours per shift. Round up.'], 'Amara shifts'); p.input.after = 'shifts'; return p; } }] },
      { num: '6', stem: function (sh) { return '<b>What if?</b> ' + sh.name + ' works ' + t(sh.h) + ' hours a week at a ' + sh.store + ' for ' + t(M(sh.w)) + ' an hour.'; },
        shared: function (r) { return noorShared(r); },
        parts: [
          { id: '6a', level: 'BEG', outcome: N2, make: function (r, sh) { var g = cents(sh.h * sh.w); return PK.moneyPart('What is her gross pay for a week?', g, null, t(sh.h + '\\times ' + M(sh.w) + '=' + M(g)), ['pay = rate × hours.'], 'Noor gross'); } },
          { id: '6b', level: 'EMG', make: function (r, sh) { var x = sh.T / sh.w, up = Math.ceil(x); return B.upPart(sh.name + ' wants to earn ' + t(M(sh.T)) + ' a week. How many whole hours a week must she work?', x, { each: sh.w, target: sh.T }, [t(M(sh.T) + '\\div ' + M(sh.w) + '=' + nT(x) + '\\;\\to\\;' + up) + ' hours', 'Check: ' + t(up + '\\times ' + M(sh.w) + '=' + M(up * sh.w)) + ' ✓'], ['hours = pay ÷ rate, rounded up.'], 'Noor hours'); } },
          { id: '6c', level: 'EMG', make: function (r, sh) { var w2 = sh.w + sh.up, x = sh.T / w2, up = Math.ceil(x); return B.upPart('What if she gets a raise to ' + t(M(w2)) + ' an hour? Now how many hours does she need for ' + t(M(sh.T)) + '?', x, { each: w2, target: sh.T, diag: function (v) { if (near(v, Math.ceil(sh.T / sh.w))) return { code: 'u2l8-old-rate', hint: 'Use her <b>new</b> rate, ' + t(M(w2)) + '.' }; return null; } }, [t(M(sh.T) + '\\div ' + M(w2) + '=' + nT(x) + '\\;\\to\\;' + up) + ' hours', 'Check: ' + t(up + '\\times ' + M(w2) + '=' + M(up * w2)) + ' ✓; ' + t(up - 1) + ' h gives ' + t(M((up - 1) * w2))], ['Same formula, new rate.'], 'Noor raise'); } },
          { id: '6d', level: 'PRG', make: function (r, sh) { var x = sh.T / sh.h, up = Math.ceil(x * 100 - 1e-7) / 100, dn = r2(x); var p = PK.part('What hourly wage would give her ' + t(M(sh.T)) + ' for her usual ' + t(sh.h) + ' hours? Round <b>up</b> to the cent.', B.upMoney(x, function (v) { if (near(v, rnd(sh.h / sh.T, 2)) || near(v, rnd(sh.h / sh.T, 4))) return { code: 'u2l8-flip', hint: 'rate ' + t('=') + ' pay ' + t('\\div') + ' hours.' }; return null; }), m$(up), M(up),
            sol(['rate ' + t('=' + M(sh.T) + '\\div ' + sh.h + '=\\$' + nT(x) + '\\;\\to\\;' + M(up)), '(' + t(M(dn)) + ' gives only ' + t(sh.h + '\\times ' + M(dn) + '=' + M(sh.h * dn)) + '; ' + t(M(up)) + ' gives ' + t(M(sh.h * up)) + '.)']), ['rate = pay ÷ hours.', 'Round up so the pay is at least the target.'], 'Noor wage', { before: '$', after: '/h' }); p.bad = [m$(dn)]; return p; } }] },
      { num: '7', stem: function (sh) { return 'A tree planter in northern Alberta is paid ' + t(M(sh.p)) + ' for each tree she plants.'; },
        shared: function (r) { return { p: r.pick([0.14, 0.15, 0.16, 0.17, 0.18, 0.19, 0.2]) }; },
        parts: [
          { id: '7a', level: 'BEG', make: function (r, sh) { var n = step(r, 1500, 2600, 50), T = cents(n * sh.p); var p = PK.part('How many trees must she plant to earn ' + t(M(T)) + ' in a day?', PK.num(n, null, function (v) { if (near(v, cents(T * sh.p))) return { code: 'u2l8-mult', hint: 'trees ' + t('=') + ' pay ' + t('\\div') + ' pay per tree.' }; if (near(v, rnd(sh.p / T, 6)) || near(v, rnd(sh.p / T, 4))) return { code: 'u2l8-flip', hint: 'Divide the pay by the pay per tree.' }; return null; }), String(n), String(n), 'trees ' + t('=') + ' pay ' + t('\\div') + ' rate per tree ' + t('=' + M(T) + '\\div ' + M(sh.p) + '=' + n) + ' trees', ['Like hours = pay ÷ rate, but the rate is per tree.'], 'trees', { after: 'trees' }); p.bad = [m$(T * sh.p)]; return p; } },
          { id: '7b', level: 'EMG', outcome: N2, make: function (r, sh) { var n = step(r, 1100, 1900, 50), h = r.pick([7, 8, 7.5, 9, 8.5]), pay = cents(n * sh.p), ph = pay / h; return PK.fields('One rainy day she plants ' + t(n) + ' trees in ' + t(dS(h)) + ' hours. What is her pay for the day, and what does that work out to per hour?', [{ label: 'Pay for the day', before: '$', name: 'Pay' }, { label: 'Per hour', before: '$', name: 'Per hour' }], [PK.money(pay), PK.money(ph, function (v) { if (near(v, rnd(h / pay, 2))) return { code: 'u2l8-flip', hint: 'Divide the pay by the hours.' }; if (near(v, cents(n / h))) return { code: 'u2l8-per-trees', hint: 'That’s trees per hour. Use the <b>pay</b> for the day ÷ hours.' }; return null; })], [m$(pay), m$(ph)], t(M(pay)) + ', about ' + t(M(ph)) + ' an hour', 'pay ' + t('=' + n + '\\times ' + M(sh.p) + '=' + M(pay)) + '<br>per hour ' + t('=' + M(pay) + '\\div ' + dS(h) + eqM(ph)), ['Pay = trees × pay per tree.', 'Per hour = pay ÷ hours.'], 'tree pay'); } }] },
      { num: '8', stem: '', parts: [{ id: '8', level: 'PRG', outcome: N2, make: function (r) {
        var v = find(function () { return { w: step(r, 17, 25, 0.5), h: r.int(2, 8), name: r.pick(['Bryn', 'Cody', 'Shane', 'Tory']), job: r.pick(['a sawmill', 'a warehouse', 'a meat plant', 'a print shop']) }; }, function (s) { return !(s.w === 20 && s.h === 5); }, { w: 19, h: 6, name: 'Bryn', job: 'a sawmill' });
        var reg = 40 * v.w, otR = v.w * 1.5, T = reg + v.h * otR;
        var p = PK.part(v.name + ' works 8 hours a day, Monday to Friday, at ' + v.job + ' for ' + t(M(v.w)) + ' an hour. Extra hours added to a shift are overtime at time-and-a-half. How many overtime hours does ' + v.name + ' need to earn ' + t(M(T)) + ' this week?', PK.num(v.h, null, function (x) {
          if (near(x, rnd((T - reg) / v.w, 2))) return { code: 'u2l8-ot-reg', hint: 'Overtime hours are paid at time and a half: divide by ' + t(M(v.w) + '\\times 1.5=' + M(otR)) + '.' };
          if (near(x, rnd(T / otR, 2)) || near(x, rnd(T / otR, 4))) return { code: 'u2l8-no-reg', hint: 'He already earns ' + t(M(reg)) + ' for his 40 regular hours. Take that off first.' };
          if (near(x, 40 + v.h)) return { code: 'u2l8-total-hours', hint: 'That’s his total hours. How many of them are <b>overtime</b>?' };
          if (near(x, rnd(T / v.w, 2))) return { code: 'u2l8-ot-reg', hint: 'Find the regular pay first, then the extra needed, then divide by the overtime rate.' };
          return null;
        }), String(v.h), String(v.h), sol(['regular pay ' + t('=40\\times ' + M(v.w) + '=' + M(reg)) + '; extra needed ' + t('=' + M(T) + '-' + M(reg) + '=' + M(T - reg)), 'overtime rate ' + t('=1.5\\times ' + M(v.w) + '=' + M(otR)) + '; overtime hours ' + t('=' + M(T - reg) + '\\div ' + M(otR) + '=' + v.h), 'Check: ' + t(M(reg) + '+' + v.h + '\\times ' + M(otR) + '=' + M(T)) + ' ✓']),
          ['Step 1: pay for the 40 regular hours. Step 2: extra needed.', 'Step 3: overtime rate = 1.5 × wage. Step 4: extra ÷ overtime rate.'], 'OT hours', { after: 'hours' });
        p.bad = [dS(rnd((T - reg) / v.w, 2)), String(40 + v.h)];
        return p;
      } }] },
      { num: '9', stem: 'Find each hourly wage from the pay stub information.', parts: [
        { id: '9a', level: 'PRG', outcome: N2, make: function (r) { var v = find(function () { return { w: step(r, 18, 26, 0.5), ot: r.pick([2, 4, 6, 8, 3, 5]) }; }, function (s) { return !(s.w === 21 && s.ot === 6) && near(s.w * 1.5 * s.ot, cents(s.w * 1.5 * s.ot)); }, { w: 22.5, ot: 4 }); var ph = 40 + 1.5 * v.ot, G = cents(v.w * ph); return ratePart('40 regular hours and ' + v.ot + ' overtime hours at time-and-a-half; gross pay ' + t(M(G)), G, ph, { diag: function (x) { if (near(x, rnd(G / (40 + v.ot), 2))) return { code: 'u2l8-paid-hours', hint: 'Each overtime hour is paid like 1.5 regular hours. Paid hours ' + t('=40+1.5\\times ' + v.ot + '=' + dS(ph)) + '.' }; return null; }, pre: ['paid hours ' + t('=40+1.5\\times ' + v.ot + '=' + dS(ph))], text: 'wage OT' }); } },
        { id: '9b', level: 'PRG', outcome: N2, make: function (r) { var v = { w: step(r, 18, 25, 0.5), reg: r.pick([24, 28, 32, 36, 30]), hol: r.pick([8, 8, 7.5, 6]) }, ph = v.reg + 2 * v.hol, G = cents(v.w * ph); var p = ratePart(t(v.reg) + ' regular hours and ' + t(dS(v.hol)) + ' hours on a statutory holiday, which her employer pays at double time; gross pay ' + t(M(G)), G, ph, { diag: function (x) { if (near(x, rnd(G / (v.reg + v.hol), 2))) return { code: 'u2l8-paid-hours', hint: 'A double-time hour is paid like 2 hours. Paid hours ' + t('=' + v.reg + '+2\\times ' + dS(v.hol) + '=' + dS(ph)) + '.' }; if (near(x, rnd(G / (v.reg + 1.5 * v.hol), 2))) return { code: 'u2l8-paid-hours', hint: 'Double time counts as 2 hours, not 1.5.' }; return null; }, pre: ['paid hours ' + t('=' + v.reg + '+2\\times ' + dS(v.hol) + '=' + dS(ph))], text: 'wage DT' }); p.bad.push(m$(G / (v.reg + v.hol))); return p; } }] },
      { num: '10', stem: '', parts: [
        { id: '10a', level: 'BEG', make: function (r) { var v = find(function () { return { p: r.pick([5, 4, 6, 3, 2.5]), c: step(r, 900, 2400, 50), who: r.pick(['A real estate assistant', 'A car salesperson', 'A furniture salesperson']) }; }, function (s) { return !(s.p === 8 && s.c === 1200) && near(s.c / (s.p / 100), Math.round(s.c / (s.p / 100))); }, { p: 5, c: 1750, who: 'A real estate assistant' }); return salesPart(v.who + ' earns ' + t(dS(v.p) + '\\%') + ' commission. How much must she sell to earn ' + t(M(v.c)) + ' in commission?', v.c, v.p, { text: 'sales' }); } },
        { id: '10b', level: 'EMG', make: function (r) { var v = find(function () { return { S: step(r, 1800, 2600, 100), p: r.pick([2, 3, 4, 5]), c: step(r, 600, 1500, 100), who: r.pick(['A car stereo installer', 'A phone store clerk', 'An appliance salesperson']) }; }, function (s) { return !(s.S === 1800 && s.p === 4 && s.c === 1200) && near(s.c / (s.p / 100), Math.round(s.c / (s.p / 100))); }, { S: 2200, p: 3, c: 1200, who: 'A car stereo installer' }); var T = v.S + v.c;
          return salesPart(v.who + ' earns ' + t(M(v.S)) + ' a month plus ' + t(v.p + '\\%') + ' commission on his sales. How much must he sell to earn ' + t(M(T)) + ' this month?', v.c, v.p, { pre: ['commission needed ' + t('=' + M(T) + '-' + M(v.S) + '=' + M(v.c))], check: t(M(v.S) + '+' + dec2(v.p) + '\\times ' + M(v.c / (v.p / 100)) + '=' + M(T)), diag: function (x) { if (near(x, cents(T / (v.p / 100)))) return { code: 'u2l8-no-salary', hint: 'His salary pays ' + t(M(v.S)) + ' of it. Commission needed ' + t('=' + M(T) + '-' + M(v.S)) + ' first.' }; if (near(x, cents(v.S / (v.p / 100)))) return { code: 'u2l8-no-salary', hint: 'Divide the <b>commission needed</b> (target − salary) by the rate, not the salary.' }; return null; }, text: 'salary + commission' }); } }] },
      { num: '11', stem: '', parts: [{ id: '11', level: 'PRG', make: function (r) {
        var v = find(function () { return { B: step(r, 400, 650, 50), p: r.pick([4, 5, 6, 8, 10]), Q: step(r, 5000, 10000, 1000), c: step(r, 150, 450, 50), name: r.pick(['Mateo', 'Diego', 'Rafael', 'Luis']) }; }, function (s) { return near(s.c / (s.p / 100), Math.round(s.c / (s.p / 100))); }, { B: 500, p: 6, Q: 8000, c: 300, name: 'Mateo' });
        var T = v.B + v.c, over = v.c / (v.p / 100), tot = v.Q + over;
        return salesPart(v.name + ' works at a sporting goods store. He earns ' + t(M(v.B)) + ' a week plus ' + t(v.p + '\\%') + ' commission on his sales <b>over</b> a quota of ' + t(M(v.Q)) + '. How much must he sell in total to earn ' + t(M(T)) + ' this week?', v.c, v.p, { base: v.Q, salesWord: 'sales over the quota', pre: ['commission needed ' + t('=' + M(T) + '-' + M(v.B) + '=' + M(v.c))], after2: 'total sales ' + t('=' + M(v.Q) + '+' + M(over) + '=' + M(tot)),
          check: t(M(v.B) + '+' + dec2(v.p) + '\\times(' + M(tot) + '-' + M(v.Q) + ')=' + M(T)), diag: function (x) { if (near(x, over)) return { code: 'u2l8-no-quota', hint: 'That’s the sales <b>over</b> the quota. Add the quota to get his total sales.' }; if (near(x, v.Q + T / (v.p / 100)) || near(x, T / (v.p / 100))) return { code: 'u2l8-no-salary', hint: 'Take off his ' + t(M(v.B)) + ' base pay first: commission needed ' + t('=' + M(T) + '-' + M(v.B)) + '.' }; return null; }, text: 'quota' });
      } }] },
      { num: '12', stem: function (sh) { return sh.name + ' has two job offers selling ' + sh.what + '. <b>Offer A:</b> ' + t(sh.a + '\\%') + ' commission only. <b>Offer B:</b> ' + t(M(sh.S)) + ' a month plus ' + t(sh.b + '\\%') + ' commission.'; },
        shared: function (r) { return zoeShared(r); },
        parts: [
          { id: '12a', level: 'BEG', outcome: N2, make: function (r, sh) {
            var lo = zoeLow(sh), hi = zoeHigh(sh), A = function (s) { return s * sh.a / 100; }, Bf = function (s) { return sh.S + s * sh.b / 100; };
            var rows = ['\\$' + bigN(lo), '\\$' + bigN(hi)], cols = ['\\text{Offer A pay}', '\\text{Offer B pay}'], blanks = [];
            [lo, hi].forEach(function (s, i) { blanks.push({ where: 'cell', i: i, j: 0, name: 'Offer A, \\$' + s, chk: PK.money(A(s)) }); blanks.push({ where: 'cell', i: i, j: 1, name: 'Offer B, $' + s, chk: PK.money(Bf(s), function (v) { if (near(v, s * sh.b / 100)) return { code: 'u2l8-no-salary', hint: 'Add the ' + t(M(sh.S)) + ' salary.' }; return null; }) }); });
            blanks.forEach(function (b) { b.name = b.name.replace('\\$', '$'); });
            return PK.tablePart('Complete the table.', { rows: rows, cols: cols, cells: [[null, null], [null, null]], corner: '\\text{Monthly sales}', keys: 'pctkit-money', help: 'Tap a box, then type the pay (no $ needed).' }, PK.tableChk(blanks), { rows: rows, cols: cols, cells: [[m$(A(lo)), m$(Bf(lo))], [m$(A(hi)), m$(Bf(hi))]] },
              sol(['A: ' + t(dec2(sh.a) + '\\times ' + bigN(lo) + '=' + M(A(lo))) + ', ' + t(dec2(sh.a) + '\\times ' + bigN(hi) + '=' + M(A(hi))), 'B: ' + t(M(sh.S) + '+' + dec2(sh.b) + '\\times ' + bigN(lo) + '=' + M(Bf(lo))) + ', ' + t(M(sh.S) + '+' + dec2(sh.b) + '\\times ' + bigN(hi) + '=' + M(Bf(hi)))]), ['Offer A = rate × sales. Offer B = salary + rate × sales.'], 'offers table');
          } },
          { id: '12b', level: 'MAS', make: function (r, sh) { var d = sh.a - sh.b; return salesPart('Offer A pays ' + t(d + '\\%') + ' more commission than Offer B. Offer B has a ' + t(M(sh.S)) + ' salary. At what sales do the two offers pay the same? (Hint: ' + t(d + '\\%') + ' of the sales must make up the ' + t(M(sh.S)) + '.)', sh.S, d, { check: 'A: ' + t(dec2(sh.a) + '\\times \\$' + bigN(sh.be) + '=' + M(sh.be * sh.a / 100)) + '; B: ' + t(M(sh.S) + '+' + dec2(sh.b) + '\\times \\$' + bigN(sh.be) + '=' + M(sh.S + sh.be * sh.b / 100)), diag: function (x) { if (near(x, sh.S / (sh.a / 100))) return { code: 'u2l8-break-even', hint: 'Use the <b>difference</b> in the rates, ' + t(sh.a + '\\%-' + sh.b + '\\%=' + d + '\\%') + '.' }; if (near(x, sh.S / (sh.b / 100))) return { code: 'u2l8-break-even', hint: 'Use the difference in the rates, ' + t(d + '\\%') + '.' }; return null; }, text: 'break even' }); } },
          { id: '12c', level: 'EMG', outcome: N2, make: function (r, sh) {
            var X = r.chance(0.5) ? sh.be + 7500 : sh.be - 7500, A = X * sh.a / 100, Bp = sh.S + X * sh.b / 100, aWins = A > Bp;
            return P.mc(r, sh.name + ' expects to sell about ' + t('\\$' + bigN(X)) + ' a month. Which offer should she take?', [
              { html: 'Offer A: at ' + t('\\$' + bigN(X)) + ' it pays ' + t(M(A)) + ' and Offer B pays ' + t(M(Bp)) + '.', right: aWins, why: aWins ? null : 'Work out both: A ' + t(M(A)) + ', B ' + t(M(Bp)) + '. Below ' + t('\\$' + bigN(sh.be)) + ', Offer B pays more.', code: 'A' },
              { html: 'Offer B: at ' + t('\\$' + bigN(X)) + ' it pays ' + t(M(Bp)) + ' and Offer A pays ' + t(M(A)) + '.', right: !aWins, why: aWins ? 'Work out both: A ' + t(M(A)) + ', B ' + t(M(Bp)) + '. Above ' + t('\\$' + bigN(sh.be)) + ', Offer A pays more.' : null, code: 'B' },
              { html: 'Offer A, because ' + t(sh.a + '\\%') + ' is a bigger rate.', why: 'A bigger rate is not always more pay: Offer B has a salary too. Work out both at ' + t('\\$' + bigN(X)) + '.', code: 'rate' },
              { html: 'They pay the same at any sales.', why: 'They pay the same only at ' + t('\\$' + bigN(sh.be)) + ' (from (b)).', code: 'same' }],
              'At ' + t('\\$' + bigN(X)) + ': A ' + t(M(A)) + ', B ' + t(M(Bp)) + '. ' + (aWins ? 'Above' : 'Below') + ' ' + t('\\$' + bigN(sh.be)) + ' Offer ' + (aWins ? 'A' : 'B') + ' pays more, so she should take Offer ' + (aWins ? 'A' : 'B') + '.' + (aWins ? ' (Someone new to sales, or worried about slow months, might still pick B: its salary is paid even with no sales.)' : ' (Someone who expects to sell much more, or wants the higher rate, might pick A.)'), ['Use the break-even sales from (b).'], 'which offer', true);
          } }] },
      { num: '13', stem: '', parts: [{ id: '13', level: 'PRG', outcome: N2, make: function (r) {
        var v = find(function () { return { w: step(r, 15, 20, 0.5), d: r.pick([15, 18, 20, 22, 25, 16]), h: r.int(30, 45), name: r.pick(['Jaylen', 'Marcus', 'Devon', 'Andre']) }; }, function (s) { var N = s.h * s.w * (100 - s.d) / 100; return near(N, cents(N)) && !(s.w === 16 && s.d === 20); }, { w: 17.5, d: 18, h: 40, name: 'Jaylen' });
        var k = 100 - v.d, nph = v.w * k / 100, N = cents(v.h * nph);
        var p = PK.part(v.name + ' earns ' + t(M(v.w)) + ' an hour. His deductions take ' + t(v.d + '\\%') + ' of his gross pay. How many hours must he work to take home ' + t(M(N)) + '?', PK.num(v.h, null, B.netHoursDiag(N, v.w, k)), String(v.h), String(v.h),
          sol(['net per hour ' + t('=' + M(v.w) + '\\times (1-' + dec2(v.d) + ')=' + M(v.w) + '\\times ' + dec2(k) + eqM(nph)), 'hours ' + t('=' + M(N) + '\\div ' + M(nph) + '=' + v.h), 'Check: ' + t(v.h + '\\times ' + M(v.w) + '=' + M(v.h * v.w)) + '; ' + t(M(v.h * v.w) + '\\times ' + dec2(k) + '=' + M(N)) + ' ✓']), ['Find what he takes home for one hour first.', 'Then hours = take-home needed ÷ net per hour.'], 'net hours', { after: 'hours' });
        p.bad = [dS(rnd(N / v.w, 2))];
        return p;
      } }] },
      { num: '14', stem: function (sh) { return sh.name + ' earns ' + t(M(sh.w)) + ' an hour as an apprentice electrician. Her deductions are CPP ' + t('5.95\\%') + ', EI ' + t('1.64\\%') + ' and income tax ' + t(sh.tx + '\\%') + '. She wants to save ' + t(M(sh.goal)) + ' for ' + sh.what + '.'; },
        shared: function (r) { return harperShared(r); },
        parts: [
          { id: '14a', level: 'BEG', outcome: N2, make: function (r, sh) { var d = rnd(5.95 + 1.64 + sh.tx, 2), k = rnd(100 - d, 2); return PK.fields('What is her total deduction rate? What percent of her pay does she keep?', [{ label: 'Total deduction rate', after: '%', name: 'Total deduction rate' }, { label: 'She keeps', after: '%', name: 'Percent kept' }], [PK.pct(d, null, function (v) { if (near(v, rnd(5.95 + 1.64, 2))) return { code: 'u2l8-no-tax', hint: 'Add the income tax rate too.' }; return null; }), PK.pct(k, null, function (v) { if (near(v, d)) return { code: 'u2l7-other-pct', hint: 'That’s the part taken off. She keeps ' + t('100\\%-' + dS(d) + '\\%') + '.' }; return null; })], [dS(d), dS(k)], t(dS(d) + '\\%') + ' and ' + t(dS(k) + '\\%'), t('5.95\\%+1.64\\%+' + sh.tx + '\\%=' + dS(d) + '\\%') + '; she keeps ' + t('100\\%-' + dS(d) + '\\%=' + dS(k) + '\\%'), ['Add the three percents.', 'The two percents add to 100%.'], 'Harper rates'); } },
          { id: '14b', level: 'EMG', outcome: N2, make: function (r, sh) { var k = B.keep([5.95, 1.64, sh.tx]), nph = sh.w * k / 100; return PK.moneyPart('Find her net pay for one hour.', nph, null, t(M(sh.w) + '\\times ' + dS(k / 100) + eqM(nph)), ['Net per hour = wage × the part kept (as a decimal).'], 'Harper nph'); } },
          { id: '14c', level: 'ADV', outcome: N2, make: function (r, sh) { var k = B.keep([5.95, 1.64, sh.tx]), nph = sh.w * k / 100, x = sh.goal / nph, up = Math.ceil(x); return B.upPart('How many whole hours must she work to save ' + t(M(sh.goal)) + ' (if she saves all her net pay)?', x, { diag: B.netHoursDiag(sh.goal, sh.w, k) }, [t(M(sh.goal) + '\\div ' + nT(nph) + '=' + nT(x) + '\\;\\to\\;' + up) + ' hours', 'Check: ' + t(up + '\\times ' + M(sh.w) + '\\times ' + dS(k / 100) + eqM(up * nph)) + ', enough ✓'], ['Divide by the net pay for one hour (keep all its decimals).', 'Round up.'], 'Harper hours'); } },
          { id: '14d', level: 'EMG', outcome: N2, make: function (r, sh) { var k = B.keep([5.95, 1.64, sh.tx]), hu = Math.ceil(sh.goal / (sh.w * k / 100)), x = hu / sh.wk, up = Math.ceil(x - 1e-9); var p = B.upPart('She works ' + t(sh.wk) + ' hours a week. How many weeks will it take?', x, { unit: 'weeks', diag: function (v) { if (near(v, rnd(sh.wk / hu, 2))) return { code: 'u2l8-weeks', hint: 'weeks ' + t('=') + ' hours ÷ hours per week.' }; return null; } }, [t(hu + '\\div ' + sh.wk + '=' + dS(rnd(x, 4)) + (near(x, up) ? '' : '\\;\\to\\;' + up)) + ' weeks'], ['weeks = hours needed ÷ hours a week. Round up.'], 'Harper weeks'); p.input.after = 'weeks'; return p; } }] },
      { num: '15', stem: '', parts: [{ id: '15', level: 'BEG', make: function (r) {
        var v = find(function () { return { p: r.pick([4, 5, 2, 8]), c: r.pick([1000, 800, 600, 1200, 2000]) }; }, function (s) { return !(s.p === 8 && s.c === 1200); }, { p: 4, c: 1000 }), s = v.c / (v.p / 100);
        return P.mc(r, 'A salesperson earns ' + t(v.p + '\\%') + ' commission. To earn ' + t(M(v.c)) + ' in commission, she must sell', [
          { html: t(M(v.c * v.p / 100)), why: 'That multiplies by the rate. Sales ' + t('=') + ' commission ' + t('\\div') + ' rate.', code: 'mult' }, { html: t(M(v.c * v.p)), why: 'That multiplies by ' + t(v.p) + '.', code: 'p' },
          { html: t('' + M(s)), right: true }, { html: t('' + M(v.c / (v.p / 1000))), why: t(v.p + '\\%') + ' is ' + t(dec2(v.p)) + ', not ' + t(dS(v.p / 1000)) + '.', code: 'dec' }],
          t(M(v.c) + '\\div ' + dec2(v.p) + '=' + M(s)) + '.', ['Sales = commission ÷ rate.'], 'MC sales', true);
      } }] },
      { num: '16', stem: '', parts: [{ id: '16', level: 'BEG', make: function (r) {
        var v = find(function () { return { w: step(r, 15, 17.5, 0.25), T: step(r, 250, 400, 25), name: r.pick(['Tariq', 'Sami', 'Aiden', 'Rory']) }; }, function (s) { var x = s.T / s.w; return x - Math.floor(x) > 0.1 && x - Math.floor(x) < 0.5; }, { w: 15.5, T: 300, name: 'Tariq' });
        var x = v.T / v.w, up = Math.ceil(x);
        return P.mc(r, v.name + ' earns ' + t(M(v.w)) + ' an hour. The number of whole hours he must work to earn at least ' + t(M(v.T)) + ' is', [
          { html: t(up - 1), why: 'Rounding down: ' + t(up - 1) + ' h is only ' + t(M((up - 1) * v.w)) + '.', code: 'down' }, { html: t(dS(rnd(x, 2))), why: 'That is not a whole number of hours. Round up.', code: 'dec' },
          { html: t(up), right: true }, { html: t(dS(cents(v.T * v.w))), why: 'That multiplies instead of dividing.', code: 'mult' }],
          t(M(v.T) + '\\div ' + M(v.w) + '=' + nT(x)) + ', rounded up to ' + t(up) + ' (' + t(up + '\\times ' + M(v.w) + '=' + M(up * v.w)) + ').', ['hours = pay ÷ rate, then round up.'], 'MC whole hours', true);
      } }] },
      { num: '17', stem: '', parts: [{ id: '17', level: 'BEG', make: function (r) {
        var v = find(function () { return { w: step(r, 16, 20, 0.1), h: rnd(r.int(50, 79) / 2, 1), name: r.pick(['Keira', 'Lexi', 'Paige', 'Jenna']) }; }, function (s) { return s.h % 1 !== 0 && near(s.w * s.h, cents(s.w * s.h)); }, { w: 18.4, h: 32.5, name: 'Keira' });
        var G = cents(v.w * v.h);
        return hoursPart('<b>Numerical response.</b> ' + v.name + ' earns ' + t(M(v.w)) + ' an hour. Her gross pay last week was ' + t(M(G)) + '. The number of hours she worked, to the nearest tenth, is ________.', G, v.w, { nr: true, dp: 1, text: 'NR hours' });
      } }] },
      { num: '18', stem: '', parts: [{ id: '18', level: 'EMG', make: function (r) {
        var v = find(function () { return { B: step(r, 300, 500, 50), p: r.pick([4, 5, 8, 10, 2.5]), c: step(r, 100, 400, 50), name: r.pick(['Luis', 'Omar', 'Ty', 'Ben']) }; }, function (s) { var sl = s.c / (s.p / 100); return near(sl, Math.round(sl)) && sl <= 9999; }, { B: 400, p: 5, c: 250, name: 'Luis' });
        var T = v.B + v.c, s = v.c / (v.p / 100);
        var p = PK.part('<b>Numerical response.</b> ' + v.name + ' earns ' + t(M(v.B)) + ' a week plus ' + t(dS(v.p) + '\\%') + ' commission on all his sales. To earn ' + t(M(T)) + ' in one week, his sales must be ' + t('\\$') + '________.', PK.num(s, null, B.salesDiag(v.c, v.p, { diag: function (x) { if (near(x, T / (v.p / 100))) return { code: 'u2l8-no-salary', hint: 'Take off his ' + t(M(v.B)) + ' first: commission needed ' + t('=' + M(T) + '-' + M(v.B)) + '.' }; return null; } }), { nr: true }), String(s), String(s), 'commission needed ' + t('=' + M(T) + '-' + M(v.B) + '=' + M(v.c)) + '; sales ' + t('=' + M(v.c) + '\\div ' + dec(v.p) + '=\\$' + s), ['Commission needed = target − base pay.', 'Sales = commission ÷ rate.'], 'NR sales', { nr: true });
        p.bad = [String(T / (v.p / 100)).slice(0, 4)];
        return p;
      } }] }
    ],
    extra: [
      { num: '1', section: 'A. Skills', stem: 'Find the missing value. Write the formula you use.', parts: [
        { id: 'e1a', level: 'BEG', outcome: N2, make: function (r) { var w = step(r, 14.5, 17.5, 0.25), h = r.int(16, 32), g = cents(w * h); return PK.moneyPart(t(M(w)) + ' an hour for ' + t(h) + ' hours; find the pay', g, null, 'pay ' + t('=') + ' rate ' + t('\\times') + ' hours ' + t('=' + dS(w) + '\\times ' + h + '=' + M(g)), ['pay = rate × hours.'], 'e1a'); } },
        { id: 'e1b', level: 'BEG', make: function (r) { var w = step(r, 15.5, 17.5, 0.5), h = r.int(24, 38); return hoursPart('pay ' + t(M(w * h)) + ' at ' + t(M(w)) + ' an hour; find the hours', cents(w * h), w, { text: 'e1b' }); } },
        { id: 'e1c', level: 'BEG', make: function (r) { var w = step(r, 16.5, 20, 0.25), h = r.int(28, 38); return ratePart('pay ' + t(M(w * h)) + ' for ' + t(h) + ' hours; find the rate', cents(w * h), h, { text: 'e1c' }); } },
        { id: 'e1d', level: 'BEG', make: function (r) { var w = r.pick([20, 22, 23, 24, 25, 21]), h = r.int(40, 56); return hoursPart('pay ' + t(M(w * h)) + ' at ' + t(M(w)) + ' an hour; find the hours', w * h, w, { text: 'e1d' }); } }] },
      { num: '2', stem: '', shared: function (r) { return find(function () { return { w: step(r, 14.5, 18, 0.25), h: r.int(28, 40), name: r.pick(['Sam', 'Nico', 'Eli', 'Raj']), job: r.pick(['a hardware store', 'a car wash', 'a pizza place']) }; }, function (s) { return !near(s.w, 15) && near(s.w * s.h, cents(s.w * s.h)); }, { w: 17, h: 36, name: 'Sam', job: 'a hardware store' }); }, parts: [
        { id: 'e2a', level: 'BEG', make: function (r, sh) { return ratePart(sh.name + ' earned ' + t(M(sh.w * sh.h)) + ' for ' + t(sh.h) + ' hours of work at ' + sh.job + '. What is his hourly wage?', cents(sh.w * sh.h), sh.h, { text: 'Sam wage' }); } },
        { id: 'e2b', level: 'BEG', outcome: N2, make: function (r, sh) { var d = rnd(sh.w - 15, 2), yes = d >= 0; return P.mc(r, 'Is it at least the Alberta minimum wage of ' + t('\\$15.00') + ' an hour (as of 2026)?', [
          { html: '<b>Yes</b>, it is ' + t(M(Math.abs(d))) + ' an hour more than minimum wage.', right: yes, why: yes ? null : t(M(sh.w)) + ' is less than ' + t('\\$15.00') + '.', code: 'yes' },
          { html: '<b>No</b>, it is ' + t(M(Math.abs(d))) + ' an hour less than minimum wage.', right: !yes, why: yes ? t(M(sh.w)) + ' is more than ' + t('\\$15.00') + '.' : null, code: 'no' }],
          'rate ' + t('=' + M(sh.w)) + '. ' + (yes ? 'Yes: ' + t(M(sh.w) + '-\\$15.00=' + M(d)) + ' more.' : 'No: ' + t('\\$15.00-' + M(sh.w) + '=' + M(-d)) + ' less (that is against the rules for an adult worker).'), ['Compare with $15.00.'], 'min wage', true); } }].map(function (x) { if (x.id === 'e2b') { var mk = x.make; x.make = function (r, sh) { var q = mk(r, sh); q.tries = 1; q.input.columns = 2; return q; }; } return x; }) },
      { num: '3', stem: '', parts: [{ id: 'e3', level: 'EMG', make: function (r) { var v = find(function () { return { w: r.pick([15, 15.5, 16, 14]), T: step(r, 220, 320, 5), name: r.pick(['Gabe', 'Hank', 'Ike', 'Jude']) }; }, function (s) { return !near(s.T / s.w, Math.round(s.T / s.w)) && s.w >= 15; }, { w: 15, T: 260, name: 'Gabe' }); var x = v.T / v.w, up = Math.ceil(x); return B.upPart(v.name + ' earns ' + t(M(v.w)) + ' an hour. How many whole hours must he work to earn at least ' + t(M(v.T)) + '?', x, { each: v.w, target: v.T }, [t(M(v.T) + '\\div ' + M(v.w) + '=' + nT(x) + '\\;\\to\\;' + up) + ' hours', 'Check: ' + t(up + '\\times ' + M(v.w) + '=' + M(up * v.w)) + ' ✓ (' + t(up - 1) + ' h gives only ' + t(M((up - 1) * v.w)) + ')'], ['hours = pay ÷ rate. Round up.'], 'Gabe'); } }] },
      { num: '4', stem: 'How much must each person sell?', parts: [
        { id: 'e4a', level: 'BEG', make: function (r) { var v = find(function () { return { p: r.pick([5, 4, 6, 10]), c: step(r, 500, 1200, 50) }; }, function (s) { return near(s.c / (s.p / 100), Math.round(s.c / (s.p / 100))); }, { p: 5, c: 750 }); return salesPart(t(v.p + '\\%') + ' commission; wants ' + t(M(v.c)) + ' in commission', v.c, v.p, { text: 'e4a' }); } },
        { id: 'e4b', level: 'EMG', make: function (r) { var v = find(function () { return { p: r.pick([2.5, 3.5, 1.5, 4.5]), c: step(r, 300, 900, 10) }; }, function (s) { return near(s.c / (s.p / 100), Math.round(s.c / (s.p / 100))); }, { p: 2.5, c: 400 }); return salesPart(t(v.p + '\\%') + ' commission; wants ' + t(M(v.c)) + ' in commission', v.c, v.p, { text: 'e4b' }); } }] },
      { num: '5', stem: function (sh) { return sh.name + ' earns ' + t(M(sh.w)) + ' an hour. Her deductions take ' + t(sh.d + '\\%') + ' of her gross pay.'; },
        shared: function (r) { return find(function () { return { w: r.pick([20, 18, 24, 16, 22]), d: r.pick([25, 20, 15, 30]), name: r.pick(['Rosa', 'Lucia', 'Pia', 'Vera']) }; }, function (s) { var n = s.w * (100 - s.d) / 100; return near(n, cents(n)) && !(s.w === 16 && s.d === 20); }, { w: 20, d: 25, name: 'Rosa' }); },
        parts: [
          { id: 'e5a', level: 'BEG', outcome: N2, make: function (r, sh) { var k = 100 - sh.d, n = sh.w * k / 100; return PK.part('What is her net pay for one hour?', B.nphChk(sh.w, k, sh.d), m$(n), M(n), t(M(sh.w) + '\\times (1-' + dec2(sh.d) + ')=' + M(sh.w) + '\\times ' + dec2(k) + '=' + M(n)), ['Net per hour = wage × the part kept.'], 'e5a', { before: '$' }); } },
          { id: 'e5b', level: 'BEG', outcome: N2, make: function (r, sh) { var k = 100 - sh.d, n = sh.w * k / 100, h = r.int(20, 40), N = cents(h * n); var p = PK.part('How many hours must she work to take home ' + t(M(N)) + '?', PK.num(h, null, B.netHoursDiag(N, sh.w, k)), String(h), String(h), t(M(N) + '\\div ' + M(n) + '=' + h) + ' hours', ['hours = take-home ÷ net per hour.'], 'e5b', { after: 'hours' }); p.bad = [dS(rnd(N / sh.w, 2))]; return p; } }] },
      { num: '6', section: 'B. Applying', stem: '', parts: [{ id: 'e6', level: 'EMG', make: function (r) {
        var v = find(function () { return { w: r.pick([15, 15.5, 16]), tip: step(r, 7, 12, 0.5), h: r.int(30, 55), name: r.pick(['Mia', 'Jade', 'Skye', 'Lark']), city: r.pick(['Canmore', 'Banff', 'Jasper', 'Calgary']) }; }, function () { return true; }, { w: 15, tip: 9.5, h: 50, name: 'Mia', city: 'Canmore' });
        var per = v.w + v.tip, T = cents(per * v.h);
        var p = PK.part(v.name + ' is a server at a restaurant in ' + v.city + '. She earns ' + t(M(v.w)) + ' an hour, and her tips average ' + t(M(v.tip)) + ' an hour. About how many hours must she work to earn ' + t(M(T)) + ' in wages and tips?', PK.num(v.h, null, function (x) { if (near(x, rnd(T / v.w, 2)) || near(x, Math.ceil(T / v.w)) || near(x, rnd(T / v.tip, 2)) || near(x, Math.ceil(T / v.tip))) return { code: 'u2l8-tip-only', hint: 'She earns wages <b>and</b> tips each hour: ' + t(M(v.w) + '+' + M(v.tip) + '=' + M(per)) + ' an hour.' }; return null; }), String(v.h), String(v.h),
          sol(['earnings per hour ' + t('=' + M(v.w) + '+' + M(v.tip) + '=' + M(per)), 'hours ' + t('=' + M(T) + '\\div ' + M(per) + '=' + v.h), 'Check: wages ' + t(v.h + '\\times ' + M(v.w) + '=' + M(v.h * v.w)) + '; tips ' + t(v.h + '\\times ' + M(v.tip) + '=' + M(v.h * v.tip)) + '; total ' + t(M(T)) + ' ✓']), ['Add the wage and the tips per hour first.'], 'tips hours', { after: 'hours' });
        p.bad = [dS(rnd(T / v.w, 2))];
        return p;
      } }] },
      { num: '7', stem: '', parts: [{ id: 'e7', level: 'PRG', make: function (r) {
        var v = find(function () { return { P: step(r, 1800, 3200, 50), m: step(r, 450, 900, 25), w: r.pick([30, 35, 40, 45, 50]), job: r.pick(['finish a basement', 'drywall a garage', 'tape and mud a renovation']) }; }, function (s) { var h = (s.P - s.m) / s.w; return near(h, Math.round(h)); }, { P: 2400, m: 650, w: 35, job: 'finish a basement' });
        var left = v.P - v.m, h = left / v.w;
        var p = PK.part('A drywall contractor agrees to ' + v.job + ' for ' + t(M(v.P)) + '. He pays ' + t(M(v.m)) + ' for materials out of that price. He wants to earn at least ' + t(M(v.w)) + ' an hour for his time. What is the most hours he can spend on the job?', PK.num(h, null, function (x) { if (near(x, rnd(v.P / v.w, 2)) || near(x, Math.floor(v.P / v.w))) return { code: 'u2l8-materials', hint: 'He pays for the materials out of the price. Only ' + t(M(v.P) + '-' + M(v.m)) + ' is left for his time.' }; if (near(x, rnd(v.w / left, 4))) return { code: 'u2l8-flip', hint: 'hours ' + t('=') + ' pay ÷ rate.' }; return null; }), String(h), String(h),
          sol(['left for his time ' + t('=' + M(v.P) + '-' + M(v.m) + '=' + M(left)), 'hours ' + t('=' + M(left) + '\\div ' + M(v.w) + '=' + h) + ' hours at most', '(If the job takes longer, he earns less than ' + t(M(v.w)) + ' an hour.)']), ['Take the materials off the price first.', 'Then hours = pay for his time ÷ hourly rate.'], 'contractor hours', { after: 'hours' });
        p.bad = [dS(rnd(v.P / v.w, 2))];
        return p;
      } }] },
      { num: '8', stem: '', parts: [{ id: 'e8', level: 'PRG', outcome: N2, make: function (r) {
        var v = find(function () { return { w: step(r, 20, 28, 1), h: r.int(2, 8), name: r.pick(['Lucas', 'Kyle', 'Brett', 'Dane']), job: r.pick(['a welder’s helper', 'a pipefitter’s helper', 'a millwright’s helper']) }; }, function (s) { return !(s.w === 20 && s.h === 5); }, { w: 24, h: 6, name: 'Lucas', job: 'a welder’s helper' });
        var reg = 40 * v.w, otR = v.w * 1.5, T = reg + v.h * otR;
        var p = PK.part(v.name + ' works 8 hours a day, Monday to Friday, as ' + v.job + ' for ' + t(M(v.w)) + ' an hour. Extra hours added to a shift are overtime at time-and-a-half. How many overtime hours does he need to earn ' + t(M(T)) + ' this week?', PK.num(v.h, null, function (x) { if (near(x, rnd((T - reg) / v.w, 2))) return { code: 'u2l8-ot-reg', hint: 'Divide by the overtime rate, ' + t(M(otR)) + '.' }; if (near(x, rnd(T / otR, 2))) return { code: 'u2l8-no-reg', hint: 'Take off the ' + t(M(reg)) + ' regular pay first.' }; if (near(x, 40 + v.h)) return { code: 'u2l8-total-hours', hint: 'How many of those are overtime?' }; return null; }), String(v.h), String(v.h),
          sol(['regular pay ' + t('=40\\times ' + M(v.w) + '=' + M(reg)) + '; extra needed ' + t('=' + M(T - reg)), 'overtime rate ' + t('=' + M(otR)) + '; overtime hours ' + t('=' + M(T - reg) + '\\div ' + M(otR) + '=' + v.h), 'Check: ' + t(M(reg) + '+' + v.h + '\\times ' + M(otR) + '=' + M(T)) + ' ✓']), ['Regular pay first; the rest comes from overtime at 1.5 × wage.'], 'e8', { after: 'hours' });
        p.bad = [dS(rnd((T - reg) / v.w, 2))];
        return p;
      } }] },
      { num: '9', stem: '', parts: [{ id: 'e9', level: 'EMG', make: function (r) { var v = find(function () { return { p: step(r, 1.45, 2.25, 0.05), T: step(r, 200, 320, 10) }; }, function (s) { var x = s.T / s.p; return !near(x, Math.round(x)); }, { p: 1.85, T: 250 }); var x = v.T / v.p, up = Math.ceil(x); var p = B.upPart('A courier is paid ' + t(M(v.p)) + ' for each package she delivers. How many packages must she deliver to earn at least ' + t(M(v.T)) + ' in a day?', x, { unit: 'packages', each: v.p, target: v.T }, [t(M(v.T) + '\\div ' + M(v.p) + '=' + nT(x) + '\\;\\to\\;' + up) + ' packages', 'Check: ' + t(up + '\\times ' + M(v.p) + '=' + M(up * v.p)) + ' ✓ (' + t(up - 1) + ' packages give only ' + t(M((up - 1) * v.p)) + ')'], ['packages = pay ÷ pay per package. Round up.'], 'courier'); p.input.after = 'packages'; return p; } }] },
      { num: '10', stem: function (sh) { return sh.name + ' earns ' + t(M(sh.w)) + ' an hour. His deductions are CPP ' + t('5.95\\%') + ', EI ' + t('1.64\\%') + ' and income tax ' + t(sh.tx + '\\%') + '. He wants ' + sh.what + ' that costs ' + t(M(sh.P)) + ' in ' + sh.city + '.'; },
        shared: function (r) { return find(function () { return { w: step(r, 15, 18, 0.5), tx: r.pick([8, 9, 10, 11]), P: r.int(25, 60) * 10 - 0.01, name: r.pick(['Owen', 'Noah', 'Ty', 'Max']), what: r.pick(['a game controller', 'a pair of skates', 'a phone', 'a bike helmet and lock']), city: r.pick(['Lethbridge', 'Red Deer', 'Calgary', 'Edmonton']) }; }, function (s) { var k = B.keep([5.95, 1.64, s.tx]), x = r2(s.P * 1.05) / (s.w * k / 100); return !near(x, Math.round(x)) && Math.ceil(x) !== Math.ceil(s.P / (s.w * k / 100)); }, { w: 15, tx: 10, P: 349.99, name: 'Owen', what: 'a game controller', city: 'Lethbridge' }); },
        parts: [
          { id: 'e10a', level: 'BEG', outcome: N2, make: function (r, sh) { var T = sh.P * 1.05; return PK.moneyPart('What is the price with ' + t('5\\%') + ' GST?', T, function (v) { if (near(v, r2(sh.P * 0.05))) return { code: 'u1l8-tax-only', hint: 'That’s the GST. Add it to the price.' }; if (near(v, r2(sh.P * 1.5))) return { code: 'u1l8-five-as-half', hint: t('5\\%=0.05') + ', so multiply by ' + t('1.05') + '.' }; return null; }, t(M(sh.P) + '\\times 1.05' + eqM(T)), ['Alberta: price × 1.05.'], 'GST price'); } },
          { id: 'e10b', level: 'EMG', outcome: N2, make: function (r, sh) { var d = rnd(5.95 + 1.64 + sh.tx, 2), k = B.keep([5.95, 1.64, sh.tx]), n = sh.w * k / 100; return PK.part('Find ' + sh.name + '’s net pay for one hour.', B.nphChk(sh.w, k, d), m$(n), M(n), 'deductions ' + t('=5.95\\%+1.64\\%+' + sh.tx + '\\%=' + dS(d) + '\\%') + '; keeps ' + t(dS(k) + '\\%') + '<br>net per hour ' + t('=' + M(sh.w) + '\\times ' + dS(k / 100) + eqM(n)), ['Add the deduction rates, then take them from 100%.'], 'Owen nph', { before: '$' }); } },
          { id: 'e10c', level: 'PRG', outcome: N2, make: function (r, sh) { var k = B.keep([5.95, 1.64, sh.tx]), n = sh.w * k / 100, T = r2(sh.P * 1.05), x = T / n, up = Math.ceil(x); return B.upPart('How many whole hours must he work to buy it?', x, { diag: B.netHoursDiag(T, sh.w, k, { price: sh.P }) }, [t(M(T) + '\\div ' + nT(n) + '=' + nT(x) + '\\;\\to\\;' + up) + ' hours', 'Check: ' + t(up + '\\times ' + M(sh.w) + '\\times ' + dS(k / 100) + eqM(up * n)) + ', enough ✓'], ['Price with GST ÷ net pay per hour. Round up.'], 'Owen hours'); } }] },
      { num: '11', stem: '', parts: [{ id: 'e11', level: 'EMG', make: function (r) {
        var v = find(function () { return { S: r.pick([1200, 1000, 1500, 1400]), p: r.pick([5, 4, 2, 8]), c: r.pick([800, 600, 1000, 400]), name: r.pick(['Kim', 'Jo', 'Lee', 'Sky']) }; }, function (s) { return true; }, { S: 1200, p: 5, c: 800, name: 'Kim' }), T = v.S + v.c, s = v.c / (v.p / 100);
        return P.mc(r, v.name + ' earns a salary of ' + t(M(v.S)) + ' a month plus ' + t(v.p + '\\%') + ' commission on her sales. To earn ' + t(M(T)) + ' this month, her sales must be', [
          { html: t('\\$' + bigN(T / (v.p / 100))), why: 'That forgets the salary: take ' + t(M(v.S)) + ' off first.', code: 'nosal' }, { html: t('\\$' + bigN(s)), right: true },
          { html: t('\\$' + bigN(v.S / (v.p / 100))), why: 'That divides the salary by the rate. Divide the <b>commission needed</b>.', code: 'sal' }, { html: t('\\$' + bigN(v.c * v.p)), why: 'That multiplies by ' + t(v.p) + '.', code: 'mult' }],
          'commission needed ' + t('=' + M(T) + '-' + M(v.S) + '=' + M(v.c)) + '; ' + t(M(v.c) + '\\div ' + dec2(v.p) + '=\\$' + bigN(s)) + '.', ['Commission needed = target − salary.'], 'MC Kim', true);
      } }] },
      { num: '12', stem: '', parts: [{ id: 'e12', level: 'EMG', outcome: N2, make: function (r) {
        var v = find(function () { return { w: step(r, 15, 19, 0.2), d: r.pick([20, 25, 15]), h: rnd(r.int(60, 89) / 2, 1), name: r.pick(['Nadia', 'Rhea', 'Tia', 'Una']) }; }, function (s) { var N = s.w * (100 - s.d) / 100 * s.h; return s.h % 1 !== 0 && near(N, cents(N)) && near(s.w * (100 - s.d) / 100, cents(s.w * (100 - s.d) / 100)); }, { w: 16.8, d: 20, h: 37.5, name: 'Nadia' });
        var k = 100 - v.d, n = v.w * k / 100, N = cents(n * v.h);
        var p = PK.part('<b>Numerical response.</b> ' + v.name + ' earns ' + t(M(v.w)) + ' an hour. Her deductions take ' + t(v.d + '\\%') + ' of her gross pay. The number of hours she must work to take home ' + t(M(N)) + ', to the nearest tenth, is ________.', PK.num(v.h, 1, B.netHoursDiag(N, v.w, k), { nr: true }), dS(v.h), dS(v.h), 'net per hour ' + t('=' + M(v.w) + '\\times ' + dec2(k) + '=' + M(n)) + '; hours ' + t('=' + M(N) + '\\div ' + M(n) + '=' + dS(v.h)), ['Net per hour first.'], 'NR net hours', { nr: true });
        p.bad = [dS(rnd(N / v.w, 1))];
        return p;
      } }] },
      { num: '13', section: 'C. Stretch', stem: '', parts: [{ id: 'e13', level: 'MAS', make: function (r) {
        var v = find(function () { return { L: r.pick([10000, 15000, 20000, 12000]), p1: r.pick([3, 4, 2]), p2: r.pick([5, 6, 7, 8]), c: step(r, 1200, 2600, 100), what: r.pick(['furniture', 'hot tub', 'piano', 'boat']) }; }, function (s) { var first = s.L * s.p1 / 100, rest = (s.c - first) / (s.p2 / 100); return s.c > first + 200 && near(rest, Math.round(rest)) && !(s.L === 10000 && s.p1 === 3 && s.p2 === 5 && s.c === 1000); }, { L: 15000, p1: 4, p2: 7, c: 2000, what: 'furniture' });
        var first = v.L * v.p1 / 100, need = v.c - first, rest = need / (v.p2 / 100), tot = v.L + rest;
        var p = PK.part('A ' + v.what + ' salesperson earns ' + t(v.p1 + '\\%') + ' commission on the first ' + t('\\$' + bigN(v.L)) + ' of her sales in a month and ' + t(v.p2 + '\\%') + ' on sales over ' + t('\\$' + bigN(v.L)) + '. How much must she sell to earn ' + t(M(v.c)) + ' in commission?', PK.money(tot, function (x) {
          if (near(x, rest)) return { code: 'u2l8-no-quota', hint: 'That’s the sales <b>over</b> ' + t('\\$' + bigN(v.L)) + '. Add the first ' + t('\\$' + bigN(v.L)) + ' too.' };
          if (near(x, v.c / (v.p2 / 100)) || near(x, v.c / (v.p1 / 100))) return { code: 'u2l8-no-first', hint: 'The first level pays ' + t(dec2(v.p1) + '\\times \\$' + bigN(v.L) + '=' + M(first)) + '. Only the rest is earned at ' + t(v.p2 + '\\%') + '.' };
          if (near(x, v.L + v.c / (v.p2 / 100))) return { code: 'u2l8-no-first', hint: 'Take off what the first level pays (' + t(M(first)) + ') before dividing by ' + t(dec2(v.p2)) + '.' };
          return null; }), m$(tot), '' + M(tot),
          sol(['first level: ' + t(dec2(v.p1) + '\\times \\$' + bigN(v.L) + '=' + M(first)) + '; still needed ' + t('=' + M(v.c) + '-' + M(first) + '=' + M(need)), 'sales over ' + t('\\$' + bigN(v.L)) + ' ' + t('=' + M(need) + '\\div ' + dec2(v.p2) + '=\\$' + bigN(rest)) + '; total ' + t('=\\$' + bigN(v.L) + '+\\$' + bigN(rest) + '=\\$' + bigN(tot)), 'Check: ' + t(M(first) + '+' + dec2(v.p2) + '\\times \\$' + bigN(rest) + '=' + M(v.c)) + ' ✓']), ['Use up the first level, then find the sales needed at the next rate.'], 'graduated', { before: '$' });
        p.bad = [m$(rest), m$(v.c / (v.p2 / 100))];
        return p;
      } }] },
      { num: '14', stem: function (sh) { return sh.name + ' earns ' + t(M(sh.w)) + ' an hour. On each pay cheque, ' + t(sh.d + '\\%') + ' of his gross pay is taken for CPP, EI and income tax, and then ' + t(M(sh.u)) + ' is taken for union dues. He wants a net pay of at least ' + t(M(sh.N)) + ' on his next cheque.'; },
        shared: function (r) { return coleShared(r); },
        parts: [
          { id: 'e14a', level: 'MAS', outcome: N2, make: function (r, sh) { var k = 100 - sh.d, G = (sh.N + sh.u) / (k / 100); var p = PK.moneyPart('What gross pay does he need? (Hint: the net pay plus the union dues is ' + t(k + '\\%') + ' of the gross pay.)', G, function (v) {
            if (near(v, r2(sh.N / (k / 100)))) return { code: 'u2l8-no-dues', hint: 'Add the union dues first: ' + t(M(sh.N) + '+' + M(sh.u)) + ' is ' + t(k + '\\%') + ' of the gross.' };
            if (near(v, r2(sh.N * (1 + sh.d / 100) + sh.u)) || near(v, r2((sh.N + sh.u) * (1 + sh.d / 100)))) return { code: 'u2l8-mult', hint: 'Adding ' + t(sh.d + '\\%') + ' doesn’t undo taking ' + t(sh.d + '\\%') + ' off. Divide by ' + t(dec2(k)) + '.' };
            if (near(v, r2(sh.N / (k / 100) + sh.u))) return { code: 'u2l8-no-dues', hint: 'The dues come off <b>after</b> the ' + t(sh.d + '\\%') + ': add them to the net pay first, then divide by ' + t(dec2(k)) + '.' };
            return null; }, sol([t(M(sh.N) + '+' + M(sh.u) + '=' + M(sh.N + sh.u)) + ' is ' + t(k + '\\%') + ' of the gross.', 'gross ' + t('=' + M(sh.N + sh.u) + '\\div ' + dec2(k) + '=' + M(G))]), ['Net + dues = 80% of the gross (or the % he keeps).', 'Undo “× 0.80” by dividing.'], 'Cole gross'); p.bad = [m$(sh.N / (k / 100))]; return p; } },
          { id: 'e14b', level: 'ADV', outcome: N2, make: function (r, sh) { var k = 100 - sh.d, G = (sh.N + sh.u) / (k / 100), x = G / sh.w, up = Math.ceil(x), g2 = up * sh.w; return B.upPart('How many whole hours must he work in the pay period?', x, { each: null }, [t(M(G) + '\\div ' + M(sh.w) + '=' + nT(x) + '\\;\\to\\;' + up) + ' hours', 'Check: ' + t(up + '\\times ' + M(sh.w) + '=' + M(g2)) + '; ' + t(M(g2) + '\\times ' + dec2(k) + '=' + M(g2 * k / 100)) + '; ' + t(M(g2 * k / 100) + '-' + M(sh.u) + '=' + M(g2 * k / 100 - sh.u)) + ' ✓'], ['hours = gross needed ÷ wage. Round up.'], 'Cole hours'); } }] },
      { num: '15', stem: function (sh) { return sh.name + ' needs to take home ' + t(M(sh.N)) + ' over ' + t(sh.wk) + ' weeks this summer for a tuition deposit. She earns ' + t(M(sh.w)) + ' an hour, and her deductions take ' + t(sh.d + '\\%') + ' of her gross pay.'; },
        shared: function (r) { return livShared(r); },
        parts: [
          { id: 'e15a', level: 'ADV', outcome: N2, make: function (r, sh) { var per = sh.N / sh.wk, k = 100 - sh.d, n = sh.w * k / 100, x = per / n, up = Math.ceil(x); return B.upPart('How many whole hours a week must she work?', x, { diag: function (v) { if (near(v, Math.ceil(sh.N / n))) return { code: 'u2l8-weeks', hint: 'That’s for all ' + t(sh.wk) + ' weeks. Find what she needs <b>each week</b> first.' }; return B.netHoursDiag(per, sh.w, k)(v); } },
            ['net needed each week ' + t('=' + M(sh.N) + '\\div ' + sh.wk + '=' + M(per)), 'net per hour ' + t('=' + M(sh.w) + '\\times ' + dec2(k) + eqM(n)) + '; hours ' + t('=' + M(per) + '\\div ' + nT(n) + '=' + nT(x) + '\\;\\to\\;' + up) + ' hours a week'], ['Net needed each week first.', 'Then ÷ net per hour, and round up.'], 'Liv hours'); } },
          { id: 'e15b', level: 'MAS', outcome: N2, make: function (r, sh) { var per = sh.N / sh.wk, k = 100 - sh.d, n = sh.w * k / 100, up = Math.ceil(per / n), dn = up - 1, got = dn * n, short = r2(per - r2(got));
            var p = PK.fields('Explain why ' + dn + ' hours a week is not quite enough: how much does she take home in a week with ' + dn + ' hours, and how much short is that each week?', [{ label: 'Take-home, ' + dn + ' h', before: '$', name: 'Take-home with ' + dn + ' h' }, { label: 'Short each week by', before: '$', name: 'Short by' }], [PK.money(got, function (v) { if (near(v, r2(dn * sh.w))) return { code: 'u2l8-gross-hours', hint: 'That’s the gross pay. Take home ' + t(k + '\\%') + ' of it.' }; return null; }), PK.either(PK.money(short), PK.money(per - got))], [m$(got), m$(short)], t(M(got)) + ', short by ' + t(M(short)),
              sol([t(dn + '\\times ' + M(sh.w) + '\\times ' + dec2(k) + eqM(got)) + ' a week', t(M(per) + '-' + M(got) + '=' + M(short)) + ' short each week (about ' + t(Math.round((per - got) * 100)) + ' cents). With ' + up + ' h: ' + t(M(up * n)) + ', enough.']), ['Take-home = hours × wage × the part kept.', 'Compare with what she needs each week.'], 'Liv short');
            p.bad = [[m$(dn * sh.w), m$(short)]];
            return p; } }] }
    ]
  });
  HW.addCodes({ 'u2l8-old-rate': 'Used the old rate after a raise', 'u2l8-break-even': 'Break-even: used one rate, not the difference', 'u2l8-no-tax': 'Left the income tax out of the total rate' });
  HW.addPartial({ 'u2l8-old-rate': 'b', 'u2l8-break-even': 'b', 'u2l8-no-tax': 's' });
})(window);
