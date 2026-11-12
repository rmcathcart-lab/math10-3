/* Math 10-3 · Unit 1 · Lesson 10 — Currency Exchange: Converting, and Buy vs Sell Rates (N1)
 * Assignment 10 (u1_l10.tex, Questions 1–18) and the Lesson 10 Extra Practice (u1_ep10.tex, Questions 1–14).
 * Every part is a generator: the exchange rates, bank boards and rate tables are exactly the booklet's; the amounts,
 * items, fees and people change (the booklet's own amounts are among the possible values; the lesson's worked-example
 * amounts are left out). Calculator allowed. Boards and rate tables are shown as tables in the question.
 * Money is to the cent ("$12.49", "12.49", "12.490" all accepted; yen to the whole yen); an unrounded answer or one short
 * of the cent gets a nudge (no try used); rounding the wrong way is wrong, with a hint. Where the booklet rounds in the
 * middle of a calculation (USD bought, then changed back) both that answer and the one rounded only at the end are accepted.
 * Recognised mistakes each get their own hint: multiplying when you should divide (and the other way), using the other
 * rate of the pair (0.725 for 1.38), the buying rate instead of the selling rate (and the other way), forgetting the fee
 * or the commission, adding the fee as a percent, forgetting shipping or GST, an estimate that wasn't converted.
 * Conversions: "which is worth more / more or fewer / which rate and why / what went wrong" → multiple choice (the
 * reasons are the options), with a number box for the amount; fill-in tables (rate table, estimate table, cheapest-place
 * table) → a table of boxes, or labelled boxes under the table shown in the question. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;

  var W = HW.widgets;
  if (W && W.KEYSETS && !W.KEYSETS.u1l10num) {
    var dk = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
    W.KEYSETS.u1l10num = [[dk(7), dk(8), dk(9), { label: '⌫', fn: 'del', title: 'Delete' }],
      [dk(4), dk(5), dk(6), { label: 'clear', fn: 'clear' }],
      [dk(1), dk(2), dk(3), { label: '◀', fn: 'left', title: 'Move left' }, { label: '▶', fn: 'right', title: 'Move right' }],
      [dk(0), { label: '.', tex: '.', plain: '.' }, { label: 'Check ↵', fn: 'enter', wide: true }]];
  }

  /* ================= numbers and money ================= */
  function rd(x, dp) { var f = Math.pow(10, dp); return Math.round(x * f + (x >= 0 ? 1e-6 : -1e-6)) / f; }
  function r2(x) { return rd(x, 2); }
  function near(a, b, e) { return Math.abs(a - b) < (e == null ? 0.0005 : e); }
  function grp(s, sep) { var neg = s.charAt(0) === '-'; if (neg) s = s.slice(1); var p = s.split('.'), i = p[0], out = ''; if (i.length < 5) return (neg ? '-' : '') + s; while (i.length > 3) { out = sep + i.slice(-3) + out; i = i.slice(0, -3); } return (neg ? '-' : '') + i + out + (p.length > 1 ? '.' + p[1] : ''); }
  function N(x) { return grp(String(+Number(x).toFixed(6)), '\\,'); }       // a number in TeX, no trailing zeros
  function c2(x) { return grp(r2(x).toFixed(2), '\\,'); }                    // money digits in TeX
  var DOLLAR = { CAD: 1, USD: 1 };
  /* an amount of a currency, in text and in TeX: "$350.00 CAD", "38.40 EUR", "1250 JPY", "900 MXN" */
  function fmtAmt(x, cur, sep) { if (cur === 'JPY') return grp(String(Math.round(x)), sep); if (!DOLLAR[cur] && near(x, Math.round(x), 1e-7)) return grp(String(Math.round(x)), sep); return grp(r2(x).toFixed(2), sep); }
  function A(x, cur) { return (DOLLAR[cur] ? '$' : '') + fmtAmt(x, cur, '&#8239;') + ' ' + cur; }
  function At(x, cur) { return (DOLLAR[cur] ? '\\$' : '') + fmtAmt(x, cur, '\\,') + '\\text{ ' + cur + '}'; }
  function M(x) { return '$' + grp(r2(x).toFixed(2), '&#8239;'); }
  function Mt(x) { return '\\$' + grp(r2(x).toFixed(2), '\\,'); }
  function dpOf(cur) { return cur === 'JPY' ? 0 : 2; }
  function to(x, dp) { dp = dp == null ? 2 : dp; return near(x, rd(x, dp), 1e-7) ? '=' + (dp ? c2(x) : N(Math.round(x))) : '=' + N(+x.toFixed(4)) + (near(x, +x.toFixed(4), 1e-9) ? '' : '\\ldots') + '\\to ' + (dp ? c2(x) : N(Math.round(x))); }
  function rateT(a, rate, b) { return '1\\text{ ' + a + '}=' + N(rate) + '\\text{ ' + b + '}'; }

  function readNum(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\(?:text|mathrm)\{([^{}]*)\}/g, '$1');
    var info = { pct: /%/.test(s) };
    s = s.replace(/\\\$|\$/g, '').replace(/\\%|%/g, '').replace(/\\[,;: ]|~/g, ' ').trim();
    s = s.replace(/\s*(dollars?|percent|CAD|USD|EUR|GBP|MXN|JPY|yen|euros?|pounds?|pesos?)\.?$/i, '').trim();
    if (/^\d+,\d{1,2}$/.test(s)) return { res: form('u1l10-comma', 'Use a decimal point (not a comma) for the cents, like 12.49.') };
    var p = HW.parse.number(s);
    if (!p.ok) return { res: p.code === 'empty' ? form('empty', 'Type your answer first.') : /[a-zA-Z]/.test(s) ? form('units', 'Just type the number — leave out the words.') : form('notnumber', 'Enter a single number.') };
    var pl = HW.parse.plain(s).replace(/[\s,]/g, ''), d = (pl.split('.')[1] || '').length;
    return { v: p.value, d: d, pct: info.pct };
  }
  /* an amount rounded to dp places (2: the cent, 0: whole yen / nearest dollar). o.alts, o.diag [{v, code, hint}], o.exact, o.word */
  function amtChk(ans, o) {
    o = o || {};
    var dp = o.dp == null ? 2 : o.dp, word = o.word || (dp === 2 ? 'the cent (2 decimal places)' : 'the nearest whole number'), tol = dp === 2 ? 0.0005 : 0.005;
    var acc = [rd(ans, dp)].concat((o.alts || []).map(function (a) { return rd(a, dp); }));
    var isAcc = function (x) { return acc.some(function (y) { return near(x, y, tol); }); };
    var dg = (o.diag || []).filter(function (m) { return m && m.v != null && isFinite(m.v) && !isAcc(rd(m.v, dp)); });
    return function (resp) {
      var a = readNum(resp); if (a.res) return a.res;
      var v = a.v, d = a.d;
      if (isAcc(v)) return ok();
      if (d > dp && isAcc(rd(v, dp))) return form('round', 'Right — now round it to ' + word + '.');
      for (var i = 0; i < dg.length; i++) { var m = dg[i]; if (near(v, m.v, tol) || near(v, rd(m.v, dp), tol) || (d > dp && near(rd(v, dp), rd(m.v, dp), tol)) || (dp === 2 && near(v, rd(m.v, 1), 1e-6))) return wrong(m.code, m.hint); }
      if (dp === 2 && d < 2 && acc.some(function (y) { var f = Math.pow(10, d); return near(v, Math.floor(y * f + 1e-7) / f) || near(v, Math.round(y * f + 1e-7) / f); })) return form('u1l10-to-cent', 'Give money to the cent (2 decimal places), like $12.49.');
      if (o.exact != null && d <= dp && near(Math.abs(v - acc[0]), Math.pow(10, -dp), tol) && (v - o.exact) * (acc[0] - o.exact) < 0) return wrong('u1l10-round-dir', 'Check your rounding: look at the next digit of ' + t(N(+o.exact.toFixed(4))) + '. If it is 5 or more, round up; otherwise round down.');
      return wrong('value', o.miss || null);
    };
  }
  function pctChk(x, o) {
    o = o || {}; var dp = o.dp, want = K.roundTo(x, dp);
    return function (resp) {
      var a = readNum(resp); if (a.res) return a.res;
      var v = a.v, d = a.d;
      if (near(v, want, 1e-6)) return ok();
      if (d > dp && near(K.roundTo(v, dp), want, 1e-6) && Math.abs(v - x) < Math.pow(10, -d) + 1e-9) return form('round', 'Right — now round it to the nearest tenth of a percent.');
      if (v > 0 && v < 1 && near(K.roundTo(v * 100, dp), want, 1e-6)) return form('u1l10-as-percent', 'That’s the answer as a decimal. Multiply by 100 to write it as a percent.');
      var dg = o.diag || [];
      for (var i = 0; i < dg.length; i++) { var m = dg[i]; if (!near(K.roundTo(m.v, dp), want, 1e-6) && (near(v, m.v, 0.006) || near(v, K.roundTo(m.v, dp), 1e-6))) return wrong(m.code, m.hint); }
      if (d <= dp && near(Math.abs(v - want), Math.pow(10, -dp), 1e-6) && (v - x) * (want - x) < 0) return wrong('u1l10-round-dir', 'Check your rounding: look at the hundredths digit. If it is 5 or more, round up.');
      return wrong('value', null);
    };
  }
  function vals(list, dp) { return list.filter(function (m) { return m && m.v != null && isFinite(m.v); }).map(function (m) { return rd(m.v, dp).toFixed(dp); }); }
  function fld(label, before, after) { return { label: label, before: before, after: after }; }
  function fieldsPart(prompt, specs, sol, hints, text) {
    return P.fields(prompt, specs.map(function (s) { return fld(s.label, s.before, s.after); }), specs.map(function (s) { return s.chk; }), specs.map(function (s) { return String(s.key); }),
      specs.map(function (s) { return s.label + ': ' + s.show; }).join('<br>'), sol, hints, text);
  }
  /* an amount answer. o.cur: the currency of the answer (sets the $ in front / the code after and the rounding) */
  function amtPart(prompt, ans, o, sol, hints, text) {
    o = o || {};
    var cur = o.cur || 'CAD', dp = o.dp != null ? o.dp : dpOf(cur), key = rd(ans, dp).toFixed(dp);
    if (o.dp == null && cur === 'JPY') o.word = 'the whole yen (yen have no cents)';
    o.dp = dp;
    var p = { prompt: prompt, input: { type: 'number', before: o.nr ? undefined : DOLLAR[cur] ? '$' : undefined, after: o.nr ? undefined : cur, nr: !!o.nr }, check: amtChk(ans, o), key: key, answer: t(o.nr ? key : At(rd(ans, dp), cur)), solution: sol, hints: hints || [], text: text };
    p.bad = vals(o.diag || [], dp).filter(function (s) { return !near(Number(s), rd(ans, dp), 1e-6) && !(o.alts || []).some(function (a) { return near(Number(s), rd(a, dp), 1e-6); }); });
    return p;
  }
  function reasonMC(r, prompt, right, wrongs, sol, hints, text) {
    var opts = [{ html: right, right: true }].concat(wrongs.map(function (w) { return { html: w[0], why: w[1] }; }));
    return P.mc(r, prompt, opts, sol, hints || [], text);
  }
  function twoMC(r, prompt, a, b, aRight, why, sol, hints, text) { // a two-way choice: one try
    var p = P.mc(r, prompt, [{ html: a, right: aRight, why: aRight ? null : why }, { html: b, right: !aRight, why: aRight ? why : null }], sol, hints || [], text, true);
    p.tries = 1; p.input.columns = 2; return p;
  }
  /* a board or rate table (HTML) */
  function table(head, rows, title) {
    var th = 'style="border:1px solid currentColor;padding:4px 12px;text-align:center"', thl = 'style="border:1px solid currentColor;padding:4px 12px;text-align:left"';
    return '<table style="border-collapse:collapse;margin:8px 0;font-size:0.95em">' + (title ? '<tr><th colspan="' + head.length + '" ' + th + '>' + title + '</th></tr>' : '') +
      '<tr>' + head.map(function (h, i) { return '<th ' + (i ? th : thl) + '>' + h + '</th>'; }).join('') + '</tr>' +
      rows.map(function (r) { return '<tr>' + r.map(function (c, i) { return '<td ' + (i ? th : thl) + '>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>';
  }

  /* ---------- converting: amount (have) × or ÷ rate → want ---------- */
  var MULT_RULE = 'Write the rate as 1 [one currency] = … . If it starts with the currency you <b>have</b>, multiply; if it starts with the currency you <b>want</b>, divide.';
  function wrongOpHint(op, have, want, startsWith) {
    return op === 'mul' ? 'You divided. The rate starts with ' + startsWith + ', the currency you have, so <b>multiply</b>.' + bigger(have, want)
      : 'You multiplied. The rate starts with ' + startsWith + ', the currency you <b>want</b>, so <b>divide</b>.' + bigger(have, want);
  }
  var WORTH = { GBP: 1.82, EUR: 1.55, USD: 1.38, CAD: 1, MXN: 0.075, JPY: 0.0093 };
  function bigger(have, want) { // a "bigger or smaller?" check
    if (WORTH[have] == null || WORTH[want] == null) return '';
    return WORTH[have] > WORTH[want] ? ' Check: 1 ' + have + ' is worth more than 1 ' + want + ', so your answer should be a <b>bigger</b> number than you started with.' : ' Check: 1 ' + have + ' is worth less than 1 ' + want + ', so your answer should be a <b>smaller</b> number than you started with.';
  }
  /* o: { rate, op, have, want, start (currency the rate starts with), other: [{rate, label}] other rates that could be misused, why, alts, extraDiag } */
  function conv(prompt, amount, o, text) {
    var x = o.op === 'mul' ? amount * o.rate : amount / o.rate, dp = o.dp != null ? o.dp : dpOf(o.want);
    var diag = [{ v: o.op === 'mul' ? amount / o.rate : amount * o.rate, code: o.op === 'mul' ? 'u1l10-divided' : 'u1l10-multiplied', hint: wrongOpHint(o.op, o.have, o.want, o.start) }];
    (o.other || []).forEach(function (q) { diag.push({ v: amount * q.rate, code: 'u1l10-other-rate', hint: q.hint }); diag.push({ v: amount / q.rate, code: 'u1l10-other-rate', hint: q.hint }); });
    diag.push({ v: amount, code: 'u1l10-no-convert', hint: 'That’s the amount you started with. Use the rate to change it into ' + o.want + '.' });
    diag = diag.concat(o.extraDiag || []);
    var sol = (o.why ? o.why + '<br>' : '') + t(N(amount) + (o.op === 'mul' ? '\\times ' : '\\div ') + N(o.rate) + to(x, dp)) + '<br>' + (o.result ? o.result(rd(x, dp)) : 'That is ' + t(At(rd(x, dp), o.want)) + '.');
    return amtPart(prompt, x, { cur: o.want, dp: o.dp, nr: o.nr, word: o.word, exact: x, alts: o.alts, diag: diag }, sol, o.hints || ['Which currency does the rate start with?', MULT_RULE], text);
  }
  /* the two USD/CAD rates are each other's flips (almost): using the wrong one */
  var USE_138 = 'That uses the other rate. You have USD, so use the rate that starts with USD: ' + t(rateT('USD', 1.38, 'CAD')) + '.';
  var USE_725 = 'That uses the other rate. You have CAD, so use the rate that starts with CAD: ' + t(rateT('CAD', 0.725, 'USD')) + '.';

  HW.addCodes({
    'u1l10-comma': 'Comma instead of a decimal point', 'u1l10-to-cent': 'Not given to the cent', 'u1l10-round-dir': 'Rounded the wrong way', 'u1l10-as-percent': 'Gave the decimal instead of the percent',
    'u1l10-divided': 'Divided instead of multiplying by the rate', 'u1l10-multiplied': 'Multiplied instead of dividing by the rate', 'u1l10-other-rate': 'Used the wrong rate (other direction / other currency)',
    'u1l10-no-convert': 'Didn’t convert', 'u1l10-wrong-column': 'Used the wrong column of the rate table', 'u1l10-est-none': 'Estimate not converted', 'u1l10-est-div': 'Estimate made by dividing', 'u1l10-est': 'Estimate too far off',
    'u1l10-buy-rate': 'Used the buying rate instead of the selling rate', 'u1l10-sell-rate': 'Used the selling rate instead of the buying rate', 'u1l10-no-fee': 'Left out the fee or commission',
    'u1l10-fee-pct': 'Treated the fee/commission wrongly (added the percent as dollars)', 'u1l10-no-ship': 'Left out shipping', 'u1l10-no-card-fee': 'Left out the card’s foreign transaction fee',
    'u1l10-no-gst': 'Left out GST', 'u1l10-gave-total': 'Gave a total instead of the difference', 'u1l10-loss-wrong': 'Loss: compared the wrong amounts', 'u1l10-budget': 'Compared with the wrong amount',
    'u1l10-pct-of-back': 'Percent lost out of the amount got back', 'u1l10-dollars': 'Gave the dollar amount instead of the percent', 'u1l10-rounded-up': 'Rounded up when the price must not go over',
    'u1l10-forward': 'Worked forwards instead of backwards', 'u1l10-one-step': 'Undid only one step', 'u1l10-skip-cad': 'Skipped the change to CAD'
  });
  HW.addPartial({
    'u1l10-round-dir': 's', 'u1l10-divided': 'n', 'u1l10-multiplied': 'n', 'u1l10-other-rate': 'b', 'u1l10-no-convert': 'n', 'u1l10-wrong-column': 'b', 'u1l10-est-none': 'n', 'u1l10-est-div': 'n', 'u1l10-est': 'n',
    'u1l10-buy-rate': 'b', 'u1l10-sell-rate': 'b', 'u1l10-no-fee': 'b', 'u1l10-fee-pct': 'b', 'u1l10-no-ship': 'b', 'u1l10-no-card-fee': 's', 'u1l10-no-gst': 'b', 'u1l10-gave-total': 'b',
    'u1l10-loss-wrong': 'b', 'u1l10-budget': 'b', 'u1l10-pct-of-back': 's', 'u1l10-dollars': 'b', 'u1l10-rounded-up': 's', 'u1l10-forward': 'n', 'u1l10-one-step': 'b', 'u1l10-skip-cad': 'n'
  });

  /* ================= generators ================= */
  function find(gen, test, fallback) { for (var i = 0; i < 400; i++) { var v = gen(); if (v && test(v)) return v; } return fallback; }
  var NAMES = ['Kai', 'Marcus', 'Amira', 'Devon', 'Ella', 'Ravi', 'Noor', 'Leon', 'Ben', 'Jordan', 'Maya', 'Tess', 'Aisha', 'Jun', 'Liam', 'Rosa', 'Aiden', 'Hana', 'Theo', 'Isla'];
  /* the bank boards and rate tables, exactly as in the booklet */
  var BOARD9 = { USD: [1.33, 1.43], EUR: [1.49, 1.61], MXN: [0.069, 0.081] };
  var BOARD9_HTML = table(['Currency', 'We buy', 'We sell'], [['USD', '1.33', '1.43'], ['EUR', '1.49', '1.61'], ['MXN', '0.069', '0.081']], 'Bank board (CAD for 1 unit)');
  var EP7_HTML = table(['Currency', 'We buy', 'We sell'], [['USD', '1.35', '1.41'], ['GBP', '1.77', '1.87']], 'Bank board (CAD for 1 unit)');
  var RT6 = { USD: [1.36, 0.735], EUR: [1.52, 0.658], MXN: [0.078, 12.8], JPY: [0.0091, 110] };
  var RT6_HTML = table(['Currency', '1 unit = ___ CAD', '1 CAD = ___ units'], [['USD', '1.36', '0.735'], ['EUR', '1.52', '0.658'], ['MXN', '0.078', '12.8'], ['JPY', '0.0091', '110']]);

  /* Q1(b): a scaled-up rate table */
  function scaleTable(r) {
    var amts = [1, r.pick([2, 3, 4, 5]), r.pick([10, 20, 6, 8]), r.pick([40, 30, 60, 25, 50, 80]), r.pick([100, 200, 500, 300])];
    if (amts[2] === amts[1]) amts[2] = 10;
    var cad = amts.map(function (a) { return r2(a * 1.55); });
    var chk = amts.map(function (a, j) { return amtChk(a * 1.55, { diag: [{ v: a / 1.55, code: 'u1l10-divided', hint: 'You divided. Each euro is worth ' + M(1.55) + ', so multiply: ' + t(a + '\\times 1.55') + '.' }, { v: a + 1.55, code: 'u1l10-multiplied', hint: 'Scale the rate up: multiply the number of euros by ' + t('1.55') + ' (don’t add).' }, { v: a, code: 'u1l10-no-convert', hint: 'Change the euros into CAD: multiply by ' + t('1.55') + '.' }] }); });
    var cols = amts.map(String), rows = ['\\text{CAD (\\$)}'];
    var p = { prompt: 'Complete the table: change each number of euros into Canadian dollars.',
      input: { type: 'areabox', rows: rows, cols: cols, cells: [amts.map(function () { return null; })], keys: 'u1l10num', corner: '\\text{EUR}', help: 'Tap a box and type the amount in Canadian dollars.' },
      check: function (resp) {
        resp = resp || {}; var row = (resp.cells || [])[0] || [], firstForm = null, firstWrong = null, good = 0;
        for (var j = 0; j < amts.length; j++) { var rr = chk[j](row[j] == null ? '' : row[j]); if (rr.v === 'correct') { good++; continue; } var where = 'Under <b>' + amts[j] + ' EUR</b>: ';
          if (rr.v === 'form') { if (!firstForm) firstForm = rr.code === 'empty' ? form('empty', 'Fill in every box in the table.') : form(rr.code, where + rr.hint); } else if (!firstWrong) firstWrong = wrong(rr.code, where + (rr.hint || 'Check this box.') + ' (' + '#' + ' of ' + amts.length + ' right.)'); }
        if (firstWrong) { firstWrong.hint = firstWrong.hint.replace('#', String(good)); return firstWrong; }
        return firstForm || ok();
      },
      key: { rows: rows, cols: cols, cells: [cad.map(function (c) { return c.toFixed(2); })] },
      answer: table(['EUR'].concat(cols), [['CAD'].concat(cad.map(M))]), text: 'scale table ' + amts.join(','),
      solution: 'Each euro is ' + M(1.55) + ', so multiply the euros by ' + t('1.55') + ':<br>' + amts.map(function (a, j) { return t(a + '\\times 1.55=' + Mt(cad[j])); }).join('<br>'),
      hints: ['1 EUR = $1.55 CAD. For 10 EUR, it is 10 times as much.', 'Multiply each number of euros by 1.55.'] };
    p.bad = [{ rows: rows, cols: cols, cells: [amts.map(function (a) { return r2(a / 1.55).toFixed(2); })] }];
    p.good = [{ rows: rows, cols: cols, cells: [cad.map(function (c) { return '\\$' + String(+c.toFixed(2)); })] }];
    return p;
  }

  /* Q8 / EP6: estimate (add about a third) and exact */
  function estChk(price) {
    var lo = price * 1.25 - 1.5, hi = price * 1.5 + 1.5;
    return function (resp) {
      var a = readNum(resp); if (a.res) return a.res;
      var v = a.v;
      if (v >= lo && v <= hi) return ok();
      if (Math.abs(v - price) <= Math.max(1.5, price * 0.05)) return wrong('u1l10-est-none', 'That’s about the US price. A US dollar is worth more than a Canadian dollar, so add about a third.');
      if (Math.abs(v - price / 1.38) <= Math.max(2, price * 0.06)) return wrong('u1l10-est-div', 'The CAD price must be <b>bigger</b> than the US price. Find about a third of the price and add it on.');
      return wrong('u1l10-est', 'Round the US price to a friendly number, find about a third of it, and add it on.');
    };
  }
  function estimateOf(price) { var f = price < 20 ? Math.round(price) : Math.round(price / 3) * 3; if (price >= 20 && Math.abs(f - price) > 2) f = Math.round(price); var th = Math.round(f / 3); return { f: f, th: th, e: f + th }; }
  function estSol(price) { var e = estimateOf(price); return (near(e.f, price, 1e-9) ? '' : t(N(price) + '\\approx ' + e.f) + '; ') + 'a third of ' + e.f + ' is about ' + e.th + '; ' + t(e.f + '+' + e.th + (near(e.f / 3, e.th, 1e-9) ? '=' : '\\approx ') + e.e) + ', about ' + M(e.e).replace('.00', '') + ' CAD.'; }
  function exactSpec(price, label) {
    var x = price * 1.38;
    return { label: label || 'Exact', before: '$', after: 'CAD', chk: amtChk(x, { exact: x, diag: [{ v: price / 1.38, code: 'u1l10-divided', hint: 'You divided. The rate starts with USD, the currency of the price, so multiply by 1.38. (The CAD number must be bigger.)' }, { v: price * 0.725, code: 'u1l10-other-rate', hint: USE_138 }, { v: price, code: 'u1l10-no-convert', hint: 'Change the US price into CAD: multiply by 1.38.' }] }), key: r2(x).toFixed(2), show: t(Mt(x)) };
  }

  /* there and back: CAD → foreign (selling rate, divide) → CAD (buying rate) */
  function thereBack(cad, sell, buy) { var f = r2(cad / sell), back = r2(f * buy), backU = cad / sell * buy; return { f: f, fx: cad / sell, back: back, back2: r2(backU), loss: r2(cad - back), loss2: r2(cad - r2(backU)) }; }

  HW.defineLesson({
    id: 'u1l10', unit: 1, num: '10', title: 'Currency Exchange: Converting, and Buy vs Sell Rates', outcome: 'N1',
    blurb: 'Changing Canadian dollars into other money and back, estimating foreign prices in your head, and why the bank’s two rates cost you money.',
    questions: [
      { num: '1', stem: 'Use ' + t(rateT('EUR', 1.55, 'CAD')) + '.', parts: [
        { id: '1a', level: 'LIM', make: function (r) {
          return P.mc(r, 'Which is worth more, one euro or one Canadian dollar?', [{ html: 'One euro', right: true }, { html: 'One Canadian dollar', why: 'One euro costs ' + M(1.55) + ' in Canadian money — more than one Canadian dollar.' }, { html: 'They are worth the same.', why: 'The number after the equals sign is 1.55, not 1.' }],
            t(rateT('EUR', 1.55, 'CAD')) + ': one euro costs ' + M(1.55) + ' CAD, so <b>one euro</b> is worth more.', ['If the number after the equals sign is bigger than 1, one unit of the first currency is worth more.'], 'worth more EUR', true);
        } },
        { id: '1b', level: 'BEG', make: function (r) { return scaleTable(r); } }] },
      { num: '2', stem: 'The rate is ' + t(rateT('CAD', 0.725, 'USD')) + '. Change each amount into US dollars.', parts: ['a', 'b', 'c'].map(function (L, i) {
        return { id: '2' + L, level: 'BEG', make: function (r) {
          var amt = [r.int(3, 16) * 4, r.int(30, 120) * 4, r.int(20, 40) * 50][i];
          if (amt === 340 || amt === 1400) amt += 40;
          return conv(A(amt, 'CAD'), amt, { rate: 0.725, op: 'mul', have: 'CAD', want: 'USD', start: 'CAD', other: [{ rate: 1.38, hint: USE_725 }], why: 'The rate starts with CAD, the currency you have, so multiply.' }, 'CAD→USD ' + amt);
        } };
      }) },
      { num: '3', stem: 'The rate is ' + t(rateT('USD', 1.38, 'CAD')) + '. Find each US price in Canadian dollars.', parts: ['a', 'b', 'c'].map(function (L, i) {
        return { id: '3' + L, level: 'BEG', make: function (r) {
          var it = [r.pick([['A movie ticket', 12, 18], ['A burger and fries', 10, 16], ['A day pass at a ski hill', 60, 95], ['A team jersey', 70, 120]]), r.pick([['A pizza slice', 3, 9], ['A coffee and a muffin', 5, 9], ['A phone cable', 8, 14], ['A hot dog combo', 6, 11]]), r.pick([['A used snowmobile', 18, 45], ['A used quad', 25, 60], ['A used boat motor', 12, 30], ['A used dirt bike', 20, 40]])][i];
          var amt = i === 0 ? r.int(it[1], it[2]) : i === 1 ? r.int(it[1], it[2]) + r.pick([0.79, 0.49, 0.99, 0.29, 0.69]) : r.int(it[1], it[2]) * 100;
          if (amt === 24 || amt === 45 || amt === 164) amt += 1;
          return conv(it[0] + ', ' + A(amt, 'USD'), amt, { rate: 1.38, op: 'mul', have: 'USD', want: 'CAD', start: 'USD', other: [{ rate: 0.725, hint: USE_138 }], why: 'The rate starts with USD, the currency of the price, so multiply.' }, 'USD→CAD ' + amt);
        } };
      }) },
      { num: '4', stem: function (s) { return s.who + ' changes ' + A(s.amt, 'CAD') + ' into two different currencies.'; },
        shared: function (r) { return { who: r.pick(NAMES), amt: r.pick([100, 100, 200, 50, 80, 300]) }; }, parts: [
          { id: '4ai', sub: 'a i', level: 'BEG', make: function (r, s) { return twoMC(r, 'The rate is ' + t(rateT('CAD', 0.549, 'GBP')) + '. Will ' + s.who + ' get more or fewer than ' + s.amt + ' pounds?', '<b>More</b> than ' + s.amt + ' pounds', '<b>Fewer</b> than ' + s.amt + ' pounds', false, 'Each Canadian dollar buys only 0.549 of a pound — less than 1.', 'Fewer, because 0.549 is less than 1: each dollar buys less than one pound.', ['Is the number after the equals sign bigger or smaller than 1?'], 'more/fewer GBP'); } },
          { id: '4aii', sub: 'a ii', level: 'BEG', make: function (r, s) { return conv('How many pounds does ' + s.who + ' get for ' + A(s.amt, 'CAD') + '? (' + t(rateT('CAD', 0.549, 'GBP')) + ')', s.amt, { rate: 0.549, op: 'mul', have: 'CAD', want: 'GBP', start: 'CAD', why: 'The rate starts with CAD, the currency ' + s.who + ' has, so multiply.' }, 'CAD→GBP'); } },
          { id: '4bi', sub: 'b i', level: 'BEG', make: function (r, s) { return twoMC(r, 'The rate is ' + t(rateT('CAD', 13.3, 'MXN')) + '. Will ' + s.who + ' get more or fewer than ' + s.amt + ' pesos?', '<b>More</b> than ' + s.amt + ' pesos', '<b>Fewer</b> than ' + s.amt + ' pesos', true, 'Each Canadian dollar buys 13.3 pesos — more than 1.', 'More, because 13.3 is more than 1: each dollar buys 13.3 pesos.', ['Is the number after the equals sign bigger or smaller than 1?'], 'more/fewer MXN'); } },
          { id: '4bii', sub: 'b ii', level: 'BEG', make: function (r, s) { return conv('How many pesos does ' + s.who + ' get for ' + A(s.amt, 'CAD') + '? (' + t(rateT('CAD', 13.3, 'MXN')) + ')', s.amt, { rate: 13.3, op: 'mul', have: 'CAD', want: 'MXN', start: 'CAD', why: 'The rate starts with CAD, so multiply.' }, 'CAD→MXN'); } },
          { id: '4c', level: 'EMG', make: function (r) { return twoMC(r, 'Complete: If 1 CAD equals a number <b>less than 1</b> of a currency, then that currency is worth ______ than a Canadian dollar.', '<b>more</b>', '<b>less</b>', true, 'Think of the pound: 1 CAD = 0.549 GBP, so a dollar buys only about half a pound. Is a pound worth more or less than a dollar?', 'If one Canadian dollar buys less than one unit, each unit must be worth <b>more</b> than a dollar (like the pound: a dollar buys only about half a pound).', ['Think about the pound in part (a).'], 'less than 1 means'); } }] },
      { num: '5', stem: 'Only one rate is posted in each part. Decide whether to multiply or divide.', parts: [
        { id: '5a', level: 'EMG', make: function (r) { var amt = r.int(10, 60) * 10; return conv('The rate is ' + t(rateT('GBP', 1.82, 'CAD')) + '. How many pounds do you get for ' + A(amt, 'CAD') + '?', amt, { rate: 1.82, op: 'div', have: 'CAD', want: 'GBP', start: 'GBP', why: 'You have CAD and want GBP. The rate starts with GBP, so divide.' }, 'CAD→GBP div ' + amt); } },
        { id: '5b', level: 'BEG', make: function (r) { var it = r.pick(['A scarf in Edinburgh', 'A football shirt in Manchester', 'A bus tour in London', 'A wool sweater in Wales']), amt = r.int(8, 45) + r.pick([0, 0.5, 0.99, 0.75]); if (amt === 46.5) amt = 44.5; return conv('The same rate (' + t(rateT('GBP', 1.82, 'CAD')) + '). ' + it + ' costs ' + A(amt, 'GBP') + '. What is that in CAD?', amt, { rate: 1.82, op: 'mul', have: 'GBP', want: 'CAD', start: 'GBP', why: 'You have GBP and the rate starts with GBP, so multiply.' }, 'GBP→CAD ' + amt); } },
        { id: '5c', level: 'EMG', make: function (r) { var it = r.pick(['A tour in Cancún', 'A snorkel trip in Cozumel', 'A cooking class in Oaxaca', 'A boat ride in Puerto Vallarta']), amt = r.int(4, 20) * 100 + r.pick([0, 50]); return conv('The rate is ' + t(rateT('CAD', 13.3, 'MXN')) + '. ' + it + ' costs ' + A(amt, 'MXN') + '. What is that in CAD?', amt, { rate: 13.3, op: 'div', have: 'MXN', want: 'CAD', start: 'CAD', why: 'You have MXN and want CAD. The rate starts with CAD, so divide.' }, 'MXN→CAD div ' + amt); } }] },
      { num: '6', stem: 'Use this rate table to convert each amount.' + RT6_HTML, parts: [
        { id: '6a', level: 'EMG', make: function (r) { var amt = r.int(10, 60) * 5; if (amt === 250) amt = 255; return conv(A(amt, 'CAD') + ' into pesos', amt, { rate: 12.8, op: 'mul', have: 'CAD', want: 'MXN', start: 'CAD', other: [{ rate: 0.078, hint: 'That’s the “1 unit = ___ CAD” column. You have CAD, so use the “1 CAD = ___ units” column: 1 CAD = 12.8 MXN.' }], why: 'You have CAD: use ' + t(rateT('CAD', 12.8, 'MXN')) + '.' }, 'table CAD→MXN'); } },
        { id: '6b', level: 'EMG', make: function (r) { var amt = r.int(10, 90) * 100; if (amt === 1800) amt = 2800; return conv(A(amt, 'JPY') + ' into CAD', amt, { rate: 0.0091, op: 'mul', have: 'JPY', want: 'CAD', start: 'JPY', other: [{ rate: 110, hint: 'That’s the “1 CAD = ___ units” column. You have yen, so use the “1 unit = ___ CAD” column: 1 JPY = 0.0091 CAD.' }], why: 'You have JPY: use ' + t(rateT('JPY', 0.0091, 'CAD')) + '.' }, 'table JPY→CAD'); } },
        { id: '6c', level: 'BEG', make: function (r) { var amt = r.int(10, 90) * 10; if (amt === 250) amt = 260; return conv(A(amt, 'CAD') + ' into yen', amt, { rate: 110, op: 'mul', have: 'CAD', want: 'JPY', start: 'CAD', other: [{ rate: 0.0091, hint: 'That’s the “1 unit = ___ CAD” column. You have CAD, so use 1 CAD = 110 JPY.' }], why: 'You have CAD: use ' + t(rateT('CAD', 110, 'JPY')) + '.' }, 'table CAD→JPY'); } },
        { id: '6d', level: 'BEG', make: function (r) { var amt = r.int(20, 150) + r.pick([0, 0.5, 0.25, 0.8]); return conv(A(amt, 'EUR') + ' into CAD', amt, { rate: 1.52, op: 'mul', have: 'EUR', want: 'CAD', start: 'EUR', other: [{ rate: 0.658, hint: 'That’s the “1 CAD = ___ units” column. You have euros, so use 1 EUR = 1.52 CAD.' }], why: 'You have EUR: use ' + t(rateT('EUR', 1.52, 'CAD')) + '.' }, 'table EUR→CAD'); } },
        { id: '6e', level: 'BEG', make: function (r) { var amt = r.int(15, 80) + r.pick([0.95, 0.99, 0.5]); return conv(A(amt, 'USD') + ' into CAD', amt, { rate: 1.36, op: 'mul', have: 'USD', want: 'CAD', start: 'USD', other: [{ rate: 0.735, hint: 'That’s the “1 CAD = ___ units” column. You have USD, so use 1 USD = 1.36 CAD.' }], why: 'You have USD: use ' + t(rateT('USD', 1.36, 'CAD')) + '.' }, 'table USD→CAD'); } }] },
      { num: '7', stem: function (s) { return s.who + ' is ' + s.job + '. ' + s.his + ' shop orders ' + s.tool + ' from a US supplier for ' + A(s.usd, 'USD') + '. The rate is ' + t(rateT('USD', 1.38, 'CAD')) + '.'; },
        shared: function (r) {
          var c = r.pick([['a millwright apprentice', 'a torque wrench', 150, 220], ['a welding apprentice', 'a welding helmet', 180, 300], ['an electrician apprentice', 'a multimeter', 120, 260], ['a carpentry apprentice', 'a cordless nail gun', 200, 340]]), who = r.pick([['Marcus', 'His'], ['Hana', 'Her'], ['Theo', 'His'], ['Isla', 'Her']]);
          var usd = r.int(c[2], c[3]) + r.pick([0.5, 0, 0.95, 0.75]), cad = r2(usd * 1.38), budget = Math.round((cad + r.pick([-1, 1]) * r.int(3, 15)) / 10) * 10;
          if (near(budget, cad, 0.5)) budget += 10;
          return { who: who[0], his: who[1], job: c[0], tool: c[1], usd: usd, cad: cad, budget: budget };
        }, parts: [
          { id: '7a', level: 'BEG', make: function (r, s) { return conv('What does the ' + s.tool.replace(/^an? /, '') + ' cost in Canadian dollars?', s.usd, { rate: 1.38, op: 'mul', have: 'USD', want: 'CAD', start: 'USD', other: [{ rate: 0.725, hint: USE_138 }] }, 'tool USD→CAD'); } },
          { id: '7bi', sub: 'b i', level: 'EMG', make: function (r, s) { var under = s.cad <= s.budget; return twoMC(r, 'The boss set a budget of ' + A(s.budget, 'CAD') + ' for the ' + s.tool.replace(/^an? /, '') + '. Is it under budget?', '<b>Yes</b>, under budget', '<b>No</b>, over budget', under, 'Compare the cost in CAD (part (a)) with the budget.', 'It costs ' + t(Mt(s.cad)) + ' CAD and the budget is ' + t(Mt(s.budget)) + ', so it is ' + (under ? 'under' : 'over') + ' budget.', ['Compare the CAD cost from part (a) with the budget.'], 'budget'); } },
          { id: '7bii', sub: 'b ii', level: 'EMG', make: function (r, s) { var d = r2(Math.abs(s.cad - s.budget)), over = s.cad > s.budget; return amtPart('By how much is it ' + (over ? 'over' : 'under') + ' budget?', d, { diag: [{ v: Math.abs(s.usd - s.budget), code: 'u1l10-budget', hint: 'Compare the cost in <b>CAD</b> with the budget, not the US price.' }, { v: Math.abs(s.usd / 1.38 - s.budget), code: 'u1l10-divided', hint: 'Find the CAD cost by multiplying by 1.38, then compare with the budget.' }] }, 'Cost: ' + t(c2(s.usd) + '\\times 1.38' + to(s.usd * 1.38)) + '<br>' + t(c2(Math.max(s.cad, s.budget)) + '-' + c2(Math.min(s.cad, s.budget)) + '=' + Mt(d)) + ': ' + (over ? 'over' : 'under') + ' budget by ' + t(Mt(d)) + '.', ['Subtract the smaller amount from the bigger one.'], 'budget diff'); } }] },
      { num: '8', stem: 'The rate is ' + t(rateT('USD', 1.38, 'CAD')) + '.', shared: function (r) {
          var p = [r.int(8, 20) * 3, r.int(20, 40) * 3, r.int(4, 10) * 30, r.int(6, 19) + 0.99]; if (p[1] === 120) p[1] = 117; if (p[0] === 24) p[0] = 27;
          var it = [r.pick(['T-shirt', 'Ball cap', 'Water bottle', 'Phone case']), r.pick(['Jeans', 'Hoodie', 'Hiking pants', 'Board game']), r.pick(['Concert ticket', 'Hockey game ticket', 'Theme park pass', 'Car rental for a day']), r.pick(['Phone charger', 'Pair of socks', 'Snack box', 'Sunscreen'])];
          return { p: p, it: it, jw: r.pick(['Jordan', 'Kayla', 'Ethan', 'Priya']), jp: r.pick([70, 60, 80, 50, 90, 75, 85]) };
        }, parts: [
          { id: '8ad', sub: 'a–d', level: 'EMG', make: function (r, s) {
            var rows = s.p.map(function (x, i) { return '\\text{(' + 'abcd'.charAt(i) + ') ' + s.it[i] + ', \\$' + x.toFixed(2) + ' USD}'; }), cols = ['\\text{Estimate (CAD)}', '\\text{Exact (CAD)}'];
            var chks = s.p.map(function (x) { return [estChk(x), exactSpec(x).chk]; });
            var keyC = s.p.map(function (x) { return [String(estimateOf(x).e), r2(x * 1.38).toFixed(2)]; });
            var p = { prompt: 'Estimate each price in CAD in your head (add about a third), then find the exact price with your calculator.',
              input: { type: 'areabox', rows: rows, cols: cols, cells: s.p.map(function () { return [null, null]; }), keys: 'u1l10num', corner: '\\text{Item}', help: 'Estimate first (no calculator), then type the exact price in CAD.' },
              check: function (resp) {
                resp = resp || {}; var M2 = resp.cells || [], firstForm = null, firstWrong = null, good = 0;
                for (var i = 0; i < s.p.length; i++) for (var j = 0; j < 2; j++) { var raw = (M2[i] || [])[j], rr = chks[i][j](raw == null ? '' : raw); if (rr.v === 'correct') { good++; continue; } var where = '(' + 'abcd'.charAt(i) + ') ' + (j ? 'exact' : 'estimate') + ': ';
                  if (rr.v === 'form') { if (!firstForm) firstForm = rr.code === 'empty' ? form('empty', 'Fill in every box in the table.') : form(rr.code, where + rr.hint); } else if (!firstWrong) firstWrong = { v: 'wrong', code: rr.code, hint: where + (rr.hint || 'Check this box.') }; }
                if (firstWrong) { firstWrong.hint += ' (' + good + ' of 8 boxes right.)'; return firstWrong; }
                return firstForm || ok();
              },
              key: { rows: rows, cols: cols, cells: keyC }, text: 'estimate table',
              answer: table(['Item', 'Estimate (CAD)', 'Exact (CAD)'], s.p.map(function (x, i) { return ['(' + 'abcd'.charAt(i) + ') ' + s.it[i] + ', ' + A(x, 'USD'), 'about $' + keyC[i][0], M(x * 1.38)]; })),
              solution: s.p.map(function (x, i) { return '(' + 'abcd'.charAt(i) + ') Estimate: ' + estSol(x) + ' Exact: ' + t(c2(x) + '\\times 1.38' + to(x * 1.38)) + '.'; }).join('<br>'),
              hints: ['Estimate: a third of the US price, added on. (Or × 1.4 in your head.)', 'Exact: US price × 1.38, rounded to the cent.'] };
            p.bad = [{ rows: rows, cols: cols, cells: s.p.map(function (x) { return [String(Math.round(x)), r2(x / 1.38).toFixed(2)]; }) }];
            p.good = [{ rows: rows, cols: cols, cells: s.p.map(function (x) { return [String(Math.round(x * 1.4)), r2(x * 1.38).toFixed(2)]; }) }];
            return p;
          } },
          { id: '8e', level: 'BEG', make: function (r) {
            return reasonMC(r, 'Which is a good reason to estimate prices in your head when you shop in the US?', 'You know right away whether you can afford something and whether it is cheaper than at home, without a calculator.',
              [['The price tags in the US are already in Canadian dollars.', 'They aren’t: US prices are in US dollars, and a US dollar costs more than a Canadian dollar.'], ['An estimate is always exactly right, so you never need a calculator.', 'An estimate is close, not exact. Its use is a quick check.'], ['A US dollar is worth less than a Canadian dollar, so things are cheaper.', 'A US dollar is worth <b>more</b> (1 USD = 1.38 CAD), so the CAD price is bigger.']],
              'Estimating tells you quickly whether you can afford something and whether it is a deal compared with home. It also catches calculator mistakes.', ['Think about budgets and catching mistakes.'], 'why estimate');
          } },
          { id: '8fi', sub: 'f i', level: 'EMG', make: function (r, s) {
            var claim = Math.round(s.jp / 1.38), e = estimateOf(s.jp);
            return reasonMC(r, s.jw + ' says, “' + A(s.jp, 'USD') + ' is about $' + claim + ' CAD.” Estimate to check. What did ' + s.jw + ' do?', s.jw + ' divided by 1.38. The CAD price must be <b>bigger</b> than the US price (about $' + e.e + '), so multiply.',
              [[s.jw + ' is right: $' + claim + ' is a good estimate.', 'Estimate: ' + e.f + ' plus about a third (' + e.th + ') is about ' + e.e + '. Is ' + claim + ' close?'], [s.jw + ' forgot to round.', 'Rounding isn’t the problem: $' + claim + ' is far from the estimate of about $' + e.e + '.'], [s.jw + ' used the buying rate instead of the selling rate.', 'There’s only one rate here, 1.38. Look at whether ' + s.jw + '’s answer is bigger or smaller than the US price.']],
              'Estimate: ' + estSol(s.jp) + ' So $' + claim + ' is far too small. ' + s.jw + ' divided: ' + t(s.jp + '\\div 1.38\\approx ' + N(+(s.jp / 1.38).toFixed(2))) + '.', ['Estimate: add about a third to the US price.'], 'what went wrong');
          } },
          { id: '8fii', sub: 'f ii', level: 'BEG', make: function (r, s) { return conv('What is the right price in CAD for ' + A(s.jp, 'USD') + '?', s.jp, { rate: 1.38, op: 'mul', have: 'USD', want: 'CAD', start: 'USD', other: [{ rate: 0.725, hint: USE_138 }] }, 'right price'); } }] },
      { num: '9', stem: 'Use this bank’s board (CAD for 1 unit).' + BOARD9_HTML, shared: function (r) { return { who: r.pick([['Amira', 'her', 'Her brother'], ['Owen', 'him', 'His sister'], ['Rosa', 'her', 'Her cousin'], ['Theo', 'him', 'His friend']]), place: r.pick(['Spain', 'Italy', 'France', 'Portugal', 'Greece']), mx: r.pick(['Puerto Vallarta', 'Cancún', 'Mexico City', 'Oaxaca']) }; }, parts: [
        { id: '9a', level: 'EMG', make: function (r, s) {
          return reasonMC(r, s.who[0] + ' is buying euros for a trip to ' + s.place + '. Which rate does the bank use?', 'The <b>selling</b> rate (1.61), because the bank is <b>selling</b> euros to ' + s.who[1] + '.',
            [['The <b>buying</b> rate (1.49), because ' + s.who[0] + ' is buying euros.', 'The rates are written from the <b>bank’s</b> point of view. Is the bank buying euros or selling them?'], ['The buying rate (1.49), because it is lower and banks give you the best deal.', 'The bank uses the rate that is better for the <b>bank</b>. It is selling euros, so it charges the higher rate.'], ['Either one — the bank lets you choose.', 'The bank decides: selling rate when it sells foreign cash, buying rate when it buys it back.']],
            'The board is from the bank’s point of view. The bank is <b>selling</b> euros to ' + s.who[1] + ', so it uses the selling rate, ' + t(rateT('EUR', 1.61, 'CAD')) + ' (the higher one).', ['The board is written from the bank’s point of view.'], 'which rate');
        } },
        { id: '9b', level: 'EMG', make: function (r, s) { var amt = r.int(10, 60) * 10 + r.pick([0, 0, 5]); if (amt === 250) amt = 350; return conv('How much does ' + s.who[0] + ' pay in CAD for ' + A(amt, 'EUR') + '?', amt, { rate: 1.61, op: 'mul', have: 'EUR', want: 'CAD', start: 'EUR', extraDiag: [{ v: amt * 1.49, code: 'u1l10-buy-rate', hint: 'The bank is <b>selling</b> euros, so use the selling rate, 1.61.' }, { v: amt / 1.49, code: 'u1l10-buy-rate', hint: 'Use the selling rate, 1.61, and multiply: the rate starts with EUR.' }], why: 'Selling rate: ' + t(rateT('EUR', 1.61, 'CAD')) + '. The rate starts with EUR, so multiply.' }, 'buy EUR'); } },
        { id: '9c', level: 'EMG', make: function (r, s) { var amt = r.int(10, 90) * 500; return conv(s.who[2] + ' buys ' + A(amt, 'MXN') + ' for a trip to ' + s.mx + '. How much does that cost in CAD?', amt, { rate: 0.081, op: 'mul', have: 'MXN', want: 'CAD', start: 'MXN', extraDiag: [{ v: amt * 0.069, code: 'u1l10-buy-rate', hint: 'The bank is <b>selling</b> pesos, so use the selling rate, 0.081.' }], why: 'Selling rate: ' + t(rateT('MXN', 0.081, 'CAD')) + '.' }, 'buy MXN'); } }] },
      { num: '10', stem: function (s) { return 'Use the board from Question 9.' + BOARD9_HTML + 'After a trip to Mexico, ' + s.who + ' has ' + A(s.mxn, 'MXN') + ' left over.'; },
        shared: function (r) { var m = r.int(6, 40) * 100; if (m === 1800) m = 1900; return { who: r.pick(['Devon', 'Mia', 'Carlos', 'Jade']), mxn: m }; }, parts: [
          { id: '10a', level: 'EMG', make: function (r, s) { return conv('The pesos are sold back to the bank. How much CAD does ' + s.who + ' get?', s.mxn, { rate: 0.069, op: 'mul', have: 'MXN', want: 'CAD', start: 'MXN', extraDiag: [{ v: s.mxn * 0.081, code: 'u1l10-sell-rate', hint: 'The bank is <b>buying</b> the pesos back, so use the buying rate, 0.069 (the lower one).' }], why: 'The bank buys: ' + t(rateT('MXN', 0.069, 'CAD')) + '.' }, 'sell back MXN'); } },
          { id: '10b', level: 'PRG', make: function (r, s) {
            var cost = r2(s.mxn * 0.081), back = r2(s.mxn * 0.069), loss = r2(cost - back);
            return amtPart('Those pesos cost ' + t(N(s.mxn) + '\\times 0.081') + ' before the trip. How much money did ' + s.who + ' lose by changing them back?', loss, { diag: [{ v: cost, code: 'u1l10-gave-total', hint: 'That’s what the pesos cost. Subtract what ' + s.who + ' got back.' }, { v: back, code: 'u1l10-gave-total', hint: 'That’s what ' + s.who + ' got back. Find what they cost, then subtract.' }, { v: s.mxn * (0.081 - 0.069) * 100, code: 'u1l10-loss-wrong', hint: 'Check the decimal point: the rates are in dollars, not cents.' }] },
              'Cost: ' + t(N(s.mxn) + '\\times 0.081=' + c2(cost)) + '<br>Got back: ' + t(N(s.mxn) + '\\times 0.069=' + c2(back)) + '<br>Loss: ' + t(c2(cost) + '-' + c2(back) + '=' + Mt(loss)), ['Cost before the trip − amount got back.'], 'loss MXN');
          } }] },
      { num: '11', stem: function (s) { return 'Use the board from Question 9.' + BOARD9_HTML + s.who + ' changes ' + A(s.cad, 'CAD') + ' into US dollars. ' + s.why + ', so that same day ' + s.she + ' changes all the US dollars back.'; },
        shared: function (r) { var who = r.pick([['Ella', 'she'], ['Raj', 'he'], ['Sophie', 'she'], ['Marco', 'he']]), cad = r.int(4, 30) * 100; if (cad === 500) cad = 600; var s = thereBack(cad, 1.43, 1.33); s.who = who[0]; s.she = who[1]; s.cad = cad; s.why = r.pick(['Her trip is cancelled', 'The trip is cancelled', 'The trip is called off']).replace('Her trip', who[1] === 'she' ? 'Her trip' : 'His trip'); return s; }, parts: [
          { id: '11a', level: 'PRG', make: function (r, s) { return conv('How many US dollars does ' + s.who + ' get?', s.cad, { rate: 1.43, op: 'div', have: 'CAD', want: 'USD', start: 'USD', extraDiag: [{ v: s.cad / 1.33, code: 'u1l10-buy-rate', hint: 'The bank is <b>selling</b> US dollars to ' + s.who + ', so use the selling rate, 1.43.' }, { v: s.cad * 1.33, code: 'u1l10-buy-rate', hint: 'Use the selling rate (1.43) and divide: the rate starts with USD, the currency ' + s.who + ' wants.' }], why: 'The bank sells USD: selling rate, ' + t(rateT('USD', 1.43, 'CAD')) + '. The rate starts with USD, the currency ' + s.who + ' wants, so divide.' }, 'there'); } },
          { id: '11b', level: 'PRG', make: function (r, s) { return amtPart('How many Canadian dollars does ' + s.who + ' get back?', s.back, { alts: [s.back2], exact: s.f * 1.33, diag: [{ v: s.f * 1.43, code: 'u1l10-sell-rate', hint: 'The bank is <b>buying</b> the US dollars back, so use the buying rate, 1.33.' }, { v: s.f / 1.33, code: 'u1l10-divided', hint: 'The bank buys USD at 1.33 CAD each, so multiply the US dollars by 1.33.' }, { v: s.cad, code: 'u1l10-loss-wrong', hint: 'The bank’s two rates are different, so ' + s.who + ' does not get it all back. Use the buying rate, 1.33.' }] },
            'Buying rate: ' + t(c2(s.f) + '\\times 1.33' + to(s.f * 1.33)) + '<br>' + s.who + ' gets back ' + t(Mt(s.back)) + ' CAD.', ['The bank buys the US dollars back: use the buying rate.', 'Multiply the US dollars from part (a) by the buying rate.'], 'back'); } },
          { id: '11c', level: 'PRG', make: function (r, s) { return amtPart('How much did ' + s.who + ' lose?', s.loss, { alts: [s.loss2], diag: [{ v: s.cad - s.f, code: 'u1l10-loss-wrong', hint: 'You can’t subtract US dollars from Canadian dollars. Compare the CAD at the start with the CAD back.' }, { v: s.back, code: 'u1l10-gave-total', hint: 'That’s the amount back. Subtract it from ' + M(s.cad) + '.' }] }, t(c2(s.cad) + '-' + c2(s.back) + '=' + Mt(s.loss)), ['CAD at the start − CAD back.'], 'loss'); } },
          { id: '11d', level: 'BEG', make: function (r, s) {
            return reasonMC(r, 'Why is the bank’s buying rate lower than its selling rate?', 'The bank makes its money on the difference: it sells foreign cash for more than it pays to buy it back.',
              [['The exchange rate went down during the day.', 'It all happened the same day at the same board. The two rates are always different.'], ['The buying rate includes GST.', 'There’s no GST on changing money. Think about how the bank makes money.'], ['US dollars are worth less after they leave the bank.', 'A US dollar is worth the same. Think about how the bank makes money.']],
              'The gap between the two rates is how the bank makes money: it sells high and buys low.', ['How does the bank make money from changing money?'], 'why two rates');
          } }] },
      { num: '12', stem: function (s) { return s.who + ' needs ' + A(s.usd, 'USD') + ' in cash.' + table(['Place', 'Rate and fee', 'Total (CAD)'], [['Bank', '1 USD = 1.43 CAD, no fee', '?'], ['Kiosk', '1 USD = 1.40 CAD, plus ' + M(s.fee) + ' fee', '?'], ['Online order', '1 USD = 1.38 CAD, plus ' + s.com + '% commission', '?']]); },
        shared: function (r) {
          return find(function () { var usd = r.int(6, 20) * 50, fee = r.pick([14.95, 9.95, 12.95]), com = r.pick([3, 4, 3]); var T = [r2(usd * 1.43), r2(usd * 1.4 + fee), r2(r2(usd * 1.38) * (100 + com) / 100)]; return { who: r.pick(['Ravi', 'Kim', 'Jesse', 'Nadia']), usd: usd, fee: fee, com: com, T: T }; },
            function (s) { var a = s.T.slice().sort(function (x, y) { return x - y; }); return a[1] - a[0] >= 0.5 && a[2] - a[1] >= 0.5 && s.usd !== 250; }, { who: 'Ravi', usd: 400, fee: 14.95, com: 3, T: [572, 574.95, 568.56] });
        }, parts: [
          { id: '12tot', sub: 'table', level: 'PRG', make: function (r, s) {
            var b = s.usd * 1.38, sol = 'Bank: ' + t(s.usd + '\\times 1.43=' + Mt(s.T[0])) + '<br>Kiosk: ' + t(s.usd + '\\times 1.40=' + c2(s.usd * 1.4)) + '; ' + t(c2(s.usd * 1.4) + '+' + c2(s.fee) + '=' + Mt(s.T[1])) + '<br>Online: ' + t(s.usd + '\\times 1.38=' + c2(b)) + '; ' + t(c2(b) + '\\times ' + (1 + s.com / 100).toFixed(2) + to(r2(b) * (100 + s.com) / 100)) + '';
            var p = fieldsPart('Complete the <b>Total (CAD)</b> column of the table.', [
              { label: 'Bank', before: '$', chk: amtChk(s.T[0], { diag: [{ v: s.usd / 1.43, code: 'u1l10-divided', hint: 'He wants USD and the rate starts with USD, so multiply: ' + t(s.usd + '\\times 1.43') + '.' }] }), key: s.T[0].toFixed(2), show: t(Mt(s.T[0])) },
              { label: 'Kiosk', before: '$', chk: amtChk(s.T[1], { diag: [{ v: s.usd * 1.4, code: 'u1l10-no-fee', hint: 'Add the ' + M(s.fee) + ' fee.' }, { v: s.usd * 1.4 * (100 + s.fee) / 100, code: 'u1l10-fee-pct', hint: 'The ' + M(s.fee) + ' fee is a flat amount in dollars — add it, don’t treat it as a percent.' }] }), key: s.T[1].toFixed(2), show: t(Mt(s.T[1])) },
              { label: 'Online order', before: '$', chk: amtChk(s.T[2], { alts: [b * (100 + s.com) / 100], diag: [{ v: b, code: 'u1l10-no-fee', hint: 'Add the ' + s.com + '% commission: multiply by ' + (1 + s.com / 100).toFixed(2) + '.' }, { v: b + s.com, code: 'u1l10-fee-pct', hint: 'A ' + s.com + '% commission is not $' + s.com + '. Multiply by ' + (1 + s.com / 100).toFixed(2) + '.' }, { v: b * s.com / 100, code: 'u1l10-gave-total', hint: 'That’s just the commission. Add it to the cost (or multiply by ' + (1 + s.com / 100).toFixed(2) + ').' }] }), key: s.T[2].toFixed(2), show: t(Mt(s.T[2])) }],
              sol, ['Multiply the US dollars by each rate.', 'Then add the flat fee, or multiply by 1 + the commission rate.'], 'cheapest table');
            p.bad = [[r2(s.usd * 1.43).toFixed(2), r2(s.usd * 1.4).toFixed(2), r2(b).toFixed(2)]];
            return p;
          } },
          { id: '12where', sub: 'where', level: 'EMG', make: function (r, s) {
            var names = ['the bank', 'the kiosk', 'the online order'], best = s.T.indexOf(Math.min.apply(null, s.T));
            var p = P.mc(r, 'Where should ' + s.who + ' buy the US dollars?', names.map(function (n, i) { return { html: sentence(n), right: i === best, why: i === best ? null : 'Compare the three <b>totals</b> (with the fees), not just the rates.' }; }),
              'Totals: bank ' + M(s.T[0]) + ', kiosk ' + M(s.T[1]) + ', online ' + M(s.T[2]) + '. The cheapest is ' + names[best] + '.', ['Find the total for each place, fee included.'], 'where cheapest', true);
            return p;
          } },
          { id: '12save', sub: 'save', level: 'PRG', make: function (r, s) {
            var hi = Math.max.apply(null, s.T), lo = Math.min.apply(null, s.T), mid = s.T.filter(function (x) { return x !== hi && x !== lo; })[0], d = r2(hi - lo);
            return amtPart('How much does ' + s.who + ' save at the cheapest place, compared with the most expensive choice?', d, { alts: [], diag: [{ v: mid - lo, code: 'u1l10-loss-wrong', hint: 'Compare with the <b>most expensive</b> of the three totals.' }, { v: hi - mid, code: 'u1l10-loss-wrong', hint: 'Compare the <b>cheapest</b> total with the most expensive.' }, { v: lo, code: 'u1l10-gave-total', hint: 'That’s the cheapest total. Subtract it from the most expensive total.' }] },
              'Most expensive ' + M(hi) + ', cheapest ' + M(lo) + ': ' + t(c2(hi) + '-' + c2(lo) + '=' + Mt(d)), ['Most expensive total − cheapest total.'], 'saves');
          } }] },
      { num: '13', stem: function (s) { return s.who + ' wants new ' + s.item + '. A US website sells them for ' + A(s.us, 'USD') + ' plus ' + A(s.ship, 'USD') + ' shipping. ' + s.her + ' credit card uses ' + t(rateT('USD', 1.38, 'CAD')) + ' and adds a 2.5% foreign transaction fee. A Calgary store sells the same ' + s.item + ' for ' + M(s.store) + ' plus 5% GST. (Ignore any charges at the border.)'; },
        shared: function (r) {
          return find(function () {
            var c = r.pick([['skates', 120, 170, 18, 26], ['ski goggles', 60, 110, 10, 18], ['basketball shoes', 90, 150, 14, 24], ['hiking boots', 110, 180, 16, 28], ['headphones', 80, 140, 12, 20]]), who = r.pick([['Noor', 'Her'], ['Tyrell', 'His'], ['Grace', 'Her'], ['Omar', 'His']]);
            var us = r.int(c[1], c[2]) + r.pick([0, 0.99, 0.5]), ship = r.int(c[3], c[4]) + r.pick([0, 0.5, 0.95]), cadU = r2((us + ship) * 1.38), on = r2(cadU * 1.025), on2 = r2((us + ship) * 1.38 * 1.025);
            var store = Math.round(on / 1.05 + r.pick([-1, 1]) * r.int(6, 30)) - 0.01, st = r2(store * 1.05);
            return { who: who[0], her: who[1], item: c[0], us: us, ship: ship, cadU: cadU, on: on, on2: on2, store: store, st: st };
          }, function (s) { return Math.abs(s.on - s.st) >= 1 && Math.abs(s.on2 - s.st) >= 1 && !(s.us === 52 && s.ship === 11.5); }, { who: 'Noor', her: 'Her', item: 'skates', us: 139, ship: 22, cadU: 222.18, on: 227.73, on2: 227.73, store: 199.99, st: 209.99 });
        }, parts: [
          { id: '13a', level: 'PRG', make: function (r, s) {
            var u = s.us + s.ship;
            return amtPart('Find the total cost of buying online, in CAD.', s.on, { alts: [s.on2], exact: s.cadU * 1.025, diag: [{ v: s.us * 1.38 * 1.025, code: 'u1l10-no-ship', hint: 'Add the ' + A(s.ship, 'USD') + ' shipping to the price first.' }, { v: u * 1.38, code: 'u1l10-no-card-fee', hint: 'Add the card’s 2.5% fee: multiply by 1.025.' }, { v: u / 1.38 * 1.025, code: 'u1l10-divided', hint: 'You divided. The rate starts with USD, so multiply by 1.38.' }, { v: u * 1.38 + 2.5, code: 'u1l10-fee-pct', hint: 'A 2.5% fee is not $2.50. Multiply by 1.025.' }, { v: u * 1.38 * 1.025 * 1.05, code: 'u1l10-no-gst', hint: 'The question says to ignore charges at the border — no GST on the online order here.' }] },
              'US total: ' + t(c2(s.us) + '+' + c2(s.ship) + '=' + c2(u)) + ' USD<br>In CAD: ' + t(c2(u) + '\\times 1.38' + to(u * 1.38)) + '<br>Add the 2.5% fee: ' + t(c2(s.cadU) + '\\times 1.025' + to(s.cadU * 1.025)) + '<br>Online total: ' + t(Mt(s.on)) + ' CAD', ['Add the shipping to the price, in USD.', 'Change to CAD (× 1.38), then add the 2.5% fee (× 1.025).'], 'online total');
          } },
          { id: '13b', level: 'EMG', make: function (r, s) { return amtPart('Find the total cost at the Calgary store.', s.st, { exact: s.store * 1.05, diag: [{ v: s.store, code: 'u1l10-no-gst', hint: 'Add the 5% GST: multiply by 1.05.' }, { v: s.store * 0.05, code: 'u1l10-gave-total', hint: 'That’s just the GST. Add it to the price.' }, { v: s.store + 5, code: 'u1l10-fee-pct', hint: '5% GST is not $5. Multiply by 1.05.' }] }, t(c2(s.store) + '\\times 1.05' + to(s.store * 1.05)) + '<br>Store: ' + t(Mt(s.st)), ['Multiply the store price by 1.05.'], 'store total'); } },
          { id: '13ci', sub: 'c i', level: 'EMG', make: function (r, s) { var st = s.st < s.on; return twoMC(r, 'Which is cheaper?', 'The <b>Calgary store</b>', 'The <b>US website</b>', st, 'Compare the two totals from parts (a) and (b).', 'Online ' + M(s.on) + ', store ' + M(s.st) + ': the ' + (st ? 'Calgary store' : 'US website') + ' is cheaper.', ['Compare the totals from parts (a) and (b).'], 'cheaper where'); } },
          { id: '13cii', sub: 'c ii', level: 'EMG', make: function (r, s) { var d = r2(Math.abs(s.on - s.st)); return amtPart('By how much?', d, { alts: [r2(Math.abs(s.on2 - s.st))], diag: [{ v: Math.abs((s.us + s.ship) * 1.38 - s.store), code: 'u1l10-no-card-fee', hint: 'Compare the full totals: with the card fee online and with GST at the store.' }, { v: Math.abs(s.us * 1.38 - s.store), code: 'u1l10-no-ship', hint: 'Compare the full totals from parts (a) and (b).' }] }, t(c2(Math.max(s.on, s.st)) + '-' + c2(Math.min(s.on, s.st)) + '=' + Mt(d)), ['Subtract the smaller total from the bigger one.'], 'cheaper by'); } },
          { id: '13d', level: 'BEG', make: function (r, s) {
            return reasonMC(r, 'Which is a good reason, other than price, to buy the ' + s.item + ' at the local store?', 'You can try them on to check the fit, take them home today, and return them easily.',
              [['The local store’s price is in Canadian dollars, so it is always cheaper.', 'That’s about price, and it isn’t always true. Think about fit, waiting and returns.'], ['Online stores never ship to Canada.', 'This one does (there’s a shipping charge). Think about fit, waiting and returns.'], ['The GST is lower at a local store.', 'That’s about price. Think about fit, waiting and returns.']],
              'Possible reasons: you can try them on; you get them right away; returns (and service, like skate sharpening) are easier.', ['Think about fit, waiting for shipping, and returns.'], 'reason local');
          } }] },
      { num: '14', stem: '<i>(Multiple Choice)</i>', parts: [{ id: '14', level: 'BEG', make: function (r) {
        var amt = r.pick([40, 50, 60, 70, 80, 90, 120, 150, 35, 75]);
        return P.mc(r, 'You want to change ' + A(amt, 'USD') + ' into Canadian dollars. The rate is ' + t(rateT('USD', 1.38, 'CAD')) + '. Which calculation is correct?', [
          { html: t(amt + '\\div 1.38'), why: 'Dividing gives a CAD number smaller than the US price. The rate starts with USD, the currency you have, so multiply.' },
          { html: t(amt + '\\times 1.38'), right: true },
          { html: t(amt + '+1.38'), why: 'Don’t add the rate. A rate is “per 1 unit”, so multiply.' },
          { html: t(amt + '\\times 0.725'), why: '0.725 is the CAD-to-USD rate. You have USD, so use 1 USD = 1.38 CAD.' }],
          'The rate starts with USD, the currency you have, so multiply: ' + t(amt + '\\times 1.38=' + Mt(amt * 1.38)) + ' CAD.', ['Which currency does the rate start with? Which do you have?'], 'MC which calc', true);
      } }] },
      { num: '15', stem: '<i>(Multiple Choice)</i>', parts: [{ id: '15', level: 'EMG', make: function (r) {
        var c = r.pick([[89, 120, 65, 90, 150], [59, 80, 43, 60, 100], [119, 160, 86, 120, 200], [29, 40, 21, 30, 50], [149, 200, 108, 150, 250], [74, 100, 54, 75, 125], [44, 60, 32, 45, 75]]), it = r.pick(['jacket', 'pair of boots', 'backpack', 'video game', 'hoodie']);
        var opts = [{ v: c[2], why: 'That’s what you get by dividing. The CAD price must be <b>bigger</b> than the US price.' }, { v: c[3], why: 'That’s about the US price — it hasn’t been converted. Add about a third.' }, { v: c[1], right: true }, { v: c[4], why: 'That’s far too much: it adds much more than a third.' }].sort(function (a, b) { return a.v - b.v; });
        return P.mc(r, 'The rate is ' + t(rateT('USD', 1.38, 'CAD')) + '. The best estimate of the cost of a ' + A(c[0], 'USD') + ' ' + it + ' in CAD is', opts.map(function (o) { return { html: t('\\$' + o.v), right: !!o.right, why: o.why }; }),
          'Round ' + c[0] + ' to ' + (c[0] + 1) + '; a third of ' + (c[0] + 1) + ' is about ' + Math.round((c[0] + 1) / 3) + '; ' + t((c[0] + 1) + '+' + Math.round((c[0] + 1) / 3) + '\\approx ' + c[1]) + '. (Exact: ' + t(Mt(c[0] * 1.38)) + '.)', ['Add about a third of the US price.'], 'MC estimate', true);
      } }] },
      { num: '16', stem: '<i>(Multiple Choice)</i>', parts: [{ id: '16', level: 'EMG', make: function (r) {
        var amt = r.pick([250, 200, 300, 150, 400, 120, 180]), who = r.pick(['Leon', 'Ava', 'Sam', 'Zoe']);
        var cand = [{ v: amt * 1.33, right: true }, { v: amt * 1.43, why: 'That uses the <b>selling</b> rate. The bank is <b>buying</b> ' + who + '’s US dollars, so use the lower rate.' }, { v: amt / 1.33, why: 'The rate starts with USD, the currency ' + who + ' has, so multiply.' }, { v: amt / 1.43, why: 'Use the buying rate and multiply: the rate starts with USD.' }];
        return P.mc(r, 'A bank buys US dollars at 1.33 and sells them at 1.43 (CAD for 1 USD). ' + who + ' sells ' + A(amt, 'USD') + ' back to the bank after a trip. ' + who + ' gets', cand.map(function (c) { return { html: t(Mt(c.v)), right: !!c.right, why: c.why }; }),
          'The bank <b>buys</b> the USD, so use the lower rate: ' + t(c2(amt) + '\\times 1.33=' + Mt(amt * 1.33)) + '.', ['Is the bank buying or selling the US dollars?'], 'MC buy back', true);
      } }] },
      { num: '17', stem: '<i>(Numerical Response)</i>', parts: [{ id: '17', level: 'EMG', make: function (r) {
        var v = find(function () { return r.int(5, 40) * 50 + r.pick([0, 20, 30]); }, function (m) { var x = m * 0.075, f = x - Math.floor(x); return Math.abs(f - 0.5) > 0.02 && x < 9999; }, 1450);
        var it = r.pick(['A hammock', 'A hand-woven rug', 'A silver bracelet', 'A pottery bowl', 'A leather bag']);
        return conv(it + ' at a market in Mexico costs ' + A(v, 'MXN') + '. The rate is ' + t(rateT('MXN', 0.075, 'CAD')) + '. To the nearest dollar, the cost in CAD is ________.', v, { rate: 0.075, op: 'mul', have: 'MXN', want: 'CAD', start: 'MXN', dp: 0, nr: true, word: 'the nearest dollar', result: function (x) { return 'which rounds to ' + t('\\$' + x) + '.'; } }, 'NR MXN');
      } }] },
      { num: '18', stem: '<i>(Numerical Response)</i>', parts: [{ id: '18', level: 'ADV', make: function (r) {
        var v = find(function () { var cad = r.int(3, 20) * 100 + r.pick([0, 50]); var s = thereBack(cad, 1.43, 1.33); s.cad = cad; return s; }, function (s) { var a = Math.abs(s.loss - Math.round(s.loss) - 0.5) > 0.03, b = Math.round(s.loss) === Math.round(s.loss2); return a && b; }, null) || (function () { var s = thereBack(600, 1.43, 1.33); s.cad = 600; return s; })();
        var who = r.pick(['Ben', 'Jade', 'Arjun', 'Lucy']), ans = Math.round(v.loss);
        return amtPart('A bank sells US dollars at 1.43 and buys them at 1.33 (CAD for 1 USD). ' + who + ' changes ' + A(v.cad, 'CAD') + ' into US dollars and then changes it all back on the same day. To the nearest dollar, ' + who + ' loses $________.', ans,
          { dp: 0, nr: true, word: 'the nearest dollar', diag: [{ v: v.cad * (1.43 - 1.33), code: 'u1l10-loss-wrong', hint: 'You can’t just multiply by the gap between the rates. Change to USD first (÷ 1.43), then back (× 1.33), then subtract.' }, { v: v.cad - v.cad / 1.43, code: 'u1l10-loss-wrong', hint: 'That subtracts US dollars from Canadian dollars. Change the US dollars back to CAD first (× 1.33).' }, { v: v.cad * 1.43 / 1.33 - v.cad, code: 'u1l10-multiplied', hint: 'To get USD, divide by 1.43 (the rate starts with USD). Then multiply by 1.33 to change back.' }] },
          t(c2(v.cad) + '\\div 1.43' + to(v.fx)) + ' USD<br>' + t(c2(v.f) + '\\times 1.33' + to(v.f * 1.33)) + ' CAD<br>Loss: ' + t(c2(v.cad) + '-' + c2(v.back) + '=' + N(v.loss)) + ', which rounds to ' + t('\\$' + ans) + '.', ['Change to USD with the selling rate (divide), then back with the buying rate (multiply).', 'Loss = CAD at the start − CAD back.'], 'NR there and back');
      } }] }
    ],
    extra: [
      { num: '1', section: 'A. Skills', stem: 'The rate is ' + t(rateT('CAD', 0.725, 'USD')) + '. Change each amount into US dollars.', parts: ['a', 'b'].map(function (L, i) {
        return { id: 'e1' + L, level: 'BEG', make: function (r) { var amt = i ? r.int(50, 150) * 4 : r.int(5, 25) * 4; if (amt === 20) amt = 24; return conv(A(amt, 'CAD'), amt, { rate: 0.725, op: 'mul', have: 'CAD', want: 'USD', start: 'CAD', other: [{ rate: 1.38, hint: USE_725 }] }, 'e CAD→USD'); } };
      }) },
      { num: '2', stem: 'The rate is ' + t(rateT('USD', 1.38, 'CAD')) + '. Find each price in CAD.', parts: ['a', 'b'].map(function (L, i) {
        return { id: 'e2' + L, level: 'BEG', make: function (r) { var c = i ? r.pick([['A tablet', 300, 900], ['A gaming headset', 100, 250], ['A guitar', 250, 700]]) : r.pick([['A coffee', 3, 6], ['A smoothie', 5, 9], ['A bag of chips', 2, 5]]); var amt = i ? r.int(c[1] / 25, c[2] / 25) * 25 : r.int(c[1], c[2]) + r.pick([0.5, 0.25, 0.75, 0.95]); return conv(c[0] + ', ' + A(amt, 'USD'), amt, { rate: 1.38, op: 'mul', have: 'USD', want: 'CAD', start: 'USD', other: [{ rate: 0.725, hint: USE_138 }] }, 'e USD→CAD'); } };
      }) },
      { num: '3', stem: 'The only rate posted is ' + t(rateT('EUR', 1.55, 'CAD')) + '.', parts: [
        { id: 'e3a', level: 'EMG', make: function (r) { var amt = r.int(10, 60) * 10; if (amt === 450) amt = 440; return conv('How many euros do you get for ' + A(amt, 'CAD') + '?', amt, { rate: 1.55, op: 'div', have: 'CAD', want: 'EUR', start: 'EUR', why: 'The rate starts with EUR, the currency you want, so divide.' }, 'e CAD→EUR'); } },
        { id: 'e3b', level: 'BEG', make: function (r) { var it = r.pick(['A museum ticket', 'A gelato and a coffee', 'A bike rental', 'A city bus pass']), amt = r.int(6, 40) + r.pick([0.8, 0.5, 0, 0.9]); if (near(amt, 38.4)) amt = 36.4; return conv(it + ' costs ' + A(amt, 'EUR') + '. What is that in CAD?', amt, { rate: 1.55, op: 'mul', have: 'EUR', want: 'CAD', start: 'EUR', why: 'The rate starts with EUR, the currency of the price, so multiply.' }, 'e EUR→CAD'); } }] },
      { num: '4', stem: 'Use these rates: &nbsp;' + t(rateT('CAD', 108, 'JPY')) + ', &nbsp;' + t(rateT('JPY', 0.0093, 'CAD')) + ', &nbsp;' + t(rateT('CAD', 13.3, 'MXN')) + ', &nbsp;' + t(rateT('MXN', 0.075, 'CAD')) + '.', parts: [
        { id: 'e4a', level: 'BEG', make: function (r) { var amt = r.int(10, 90) + r.pick([0, 5]); if (amt === 250) amt = 45; return conv(A(amt, 'CAD') + ' into yen', amt, { rate: 108, op: 'mul', have: 'CAD', want: 'JPY', start: 'CAD', other: [{ rate: 0.0093, hint: 'You have CAD, so use the rate that starts with CAD: 1 CAD = 108 JPY.' }] }, 'e CAD→JPY'); } },
        { id: 'e4b', level: 'EMG', make: function (r) { var amt = r.int(3, 30) * 1000; return conv(A(amt, 'JPY') + ' into CAD', amt, { rate: 0.0093, op: 'mul', have: 'JPY', want: 'CAD', start: 'JPY', other: [{ rate: 108, hint: 'You have yen, so use the rate that starts with JPY: 1 JPY = 0.0093 CAD.' }] }, 'e JPY→CAD'); } },
        { id: 'e4c', level: 'EMG', make: function (r) { var amt = r.int(4, 30) * 50; if (amt === 1800) amt = 1850; return conv(A(amt, 'MXN') + ' into CAD', amt, { rate: 0.075, op: 'mul', have: 'MXN', want: 'CAD', start: 'MXN', other: [{ rate: 13.3, hint: 'You have pesos, so use the rate that starts with MXN: 1 MXN = 0.075 CAD.' }] }, 'e MXN→CAD'); } },
        { id: 'e4d', level: 'BEG', make: function (r) { var amt = r.int(20, 150) + r.pick([0, 0, 0.5]); return conv(A(amt, 'CAD') + ' into pesos', amt, { rate: 13.3, op: 'mul', have: 'CAD', want: 'MXN', start: 'CAD', other: [{ rate: 0.075, hint: 'You have CAD, so use the rate that starts with CAD: 1 CAD = 13.3 MXN.' }] }, 'e CAD→MXN'); } }] },
      { num: '5', stem: 'The rate is ' + t(rateT('CAD', 0.549, 'GBP')) + '.', parts: [
        { id: 'e5a', level: 'BEG', make: function (r) {
          return reasonMC(r, 'Is one British pound worth more or less than one Canadian dollar? How do you know?', '<b>More</b>: one Canadian dollar buys only about half a pound, so a pound is worth more.',
            [['<b>Less</b>: 0.549 is less than 1.', 'One <b>dollar</b> buys 0.549 of a pound — less than a whole pound. So which is worth more?'], ['<b>More</b>: 0.549 is a small number, so pounds are cheap.', 'The conclusion is right, but the reason isn’t: a dollar buys only about half a pound, so a pound costs about 2 dollars.'], ['They are worth the same.', 'The rate isn’t 1. One dollar buys only 0.549 of a pound.']],
            'More. One Canadian dollar buys only about half a pound, so a pound is worth more (about ' + t('1\\div 0.549\\approx 1.82') + ' dollars).', ['How much of a pound does one dollar buy?'], 'GBP worth');
        } },
        { id: 'e5b', level: 'BEG', make: function (r) { var amt = r.int(4, 40) * 10 + r.pick([0, 5]); return conv('How many pounds do you get for ' + A(amt, 'CAD') + '?', amt, { rate: 0.549, op: 'mul', have: 'CAD', want: 'GBP', start: 'CAD' }, 'e CAD→GBP'); } }] },
      { num: '6', section: 'B. Applying', stem: 'The rate is ' + t(rateT('USD', 1.38, 'CAD')) + '. Estimate each price in CAD in your head, then find the exact price.', parts: ['a', 'b'].map(function (L, i) {
        return { id: 'e6' + L, level: 'EMG', make: function (r) {
          var c = i ? r.pick([['Two nights in a motel', 50, 90, 3], ['A pair of skis', 40, 80, 3], ['A concert ticket', 30, 60, 3]]) : r.pick([['A phone case', 6, 12, 3], ['A ball cap', 6, 11, 3], ['A paperback book', 5, 9, 3]]);
          var price = r.int(c[1], c[2]) * c[3]; if (price === 24) price = 27;
          var ex = exactSpec(price, 'Exact');
          var p = fieldsPart(c[0] + ', ' + A(price, 'USD'), [{ label: 'Estimate', before: 'about $', after: 'CAD', chk: estChk(price), key: String(estimateOf(price).e), show: 'about $' + estimateOf(price).e }, ex],
            'Estimate: ' + estSol(price) + '<br>Exact: ' + t(c2(price) + '\\times 1.38' + to(price * 1.38)) + ' CAD.', ['Estimate: add about a third of the US price.', 'Exact: multiply by 1.38.'], 'e estimate');
          p.bad = [[String(price), r2(price / 1.38).toFixed(2)]];
          return p;
        } };
      }) },
      { num: '7', stem: 'Use this bank board (CAD for 1 unit).' + EP7_HTML, shared: function (r) { return { who: r.pick([['Rosa', 'her'], ['Callum', 'him'], ['Fiona', 'her'], ['Ewan', 'him']]), place: r.pick(['Scotland', 'London', 'Wales', 'Northern Ireland']), buy: r.int(8, 40) * 10, left: r.int(2, 9) * 5 }; }, parts: [
        { id: 'e7a', level: 'EMG', make: function (r, s) { return conv(s.who[0] + ' is going to ' + s.place + '. How much does ' + A(s.buy, 'GBP') + ' in cash cost ' + s.who[1] + ' in CAD?', s.buy, { rate: 1.87, op: 'mul', have: 'GBP', want: 'CAD', start: 'GBP', extraDiag: [{ v: s.buy * 1.77, code: 'u1l10-buy-rate', hint: 'The bank is <b>selling</b> pounds, so use the selling rate, 1.87.' }], why: 'The bank sells pounds: selling rate, ' + t(rateT('GBP', 1.87, 'CAD')) + '.' }, 'e buy GBP'); } },
        { id: 'e7b', level: 'PRG', make: function (r, s) {
          var get = r2(s.left * 1.77), cost = r2(s.left * 1.87), loss = r2(cost - get);
          var p = fieldsPart(s.who[0] + ' comes home with ' + A(s.left, 'GBP') + ' and sells them back. How much CAD does ' + s.who[0] + ' get, and how much was lost on those ' + s.left + ' pounds?', [
            { label: 'Gets', before: '$', after: 'CAD', chk: amtChk(get, { diag: [{ v: s.left * 1.87, code: 'u1l10-sell-rate', hint: 'The bank is <b>buying</b> the pounds back, so use the buying rate, 1.77.' }, { v: s.left / 1.77, code: 'u1l10-divided', hint: 'The rate starts with GBP, the currency ' + s.who[0] + ' has, so multiply.' }] }), key: get.toFixed(2), show: t(Mt(get)) },
            { label: 'Lost', before: '$', chk: amtChk(loss, { diag: [{ v: cost, code: 'u1l10-gave-total', hint: 'That’s what the pounds cost. Subtract what ' + s.who[0] + ' got back.' }, { v: s.left * 0.1 * 100, code: 'u1l10-loss-wrong', hint: 'Check the decimal point.' }] }), key: loss.toFixed(2), show: t(Mt(loss)) }],
            'The bank buys: ' + t(s.left + '\\times 1.77=' + Mt(get)) + '<br>They cost ' + t(s.left + '\\times 1.87=' + Mt(cost)) + '. Loss: ' + t(c2(cost) + '-' + c2(get) + '=' + Mt(loss)), ['Selling back: the bank buys, so use the buying rate.', 'Loss = what they cost − what you get back.'], 'e sell back GBP');
          p.bad = [[cost.toFixed(2), get.toFixed(2)]];
          return p;
        } }] },
      { num: '8', stem: function (s) { return 'Use the board in Question 7.' + EP7_HTML + s.who + ' needs ' + A(s.usd, 'USD') + '. The bank charges no fee. A currency kiosk uses ' + t(rateT('USD', 1.38, 'CAD')) + ' but charges a ' + s.com + '% commission.'; },
        shared: function (r) { return find(function () { var usd = r.int(4, 16) * 50, com = r.pick([4, 3, 5]), bank = r2(usd * 1.41), kiosk = r2(r2(usd * 1.38) * (100 + com) / 100); return { who: r.pick(['Liam', 'Ana', 'Kofi', 'Beth']), usd: usd, com: com, bank: bank, kiosk: kiosk, k2: r2(usd * 1.38 * (100 + com) / 100) }; }, function (s) { return Math.abs(s.bank - s.kiosk) >= 0.5; }, { who: 'Liam', usd: 250, com: 4, bank: 352.5, kiosk: 358.8, k2: 358.8 }); }, parts: [
          { id: 'e8i', sub: 'i', level: 'EMG', make: function (r, s) { var b = s.bank < s.kiosk; return twoMC(r, 'Which is cheaper?', 'The <b>bank</b>', 'The <b>kiosk</b>', b, 'Find both totals: bank ' + t(s.usd + '\\times 1.41') + '; kiosk ' + t(s.usd + '\\times 1.38') + ', then add the ' + s.com + '% commission.', 'Bank: ' + t(s.usd + '\\times 1.41=' + Mt(s.bank)) + '. Kiosk: ' + t(s.usd + '\\times 1.38=' + c2(s.usd * 1.38)) + ', ' + t(c2(s.usd * 1.38) + '\\times ' + (1 + s.com / 100).toFixed(2) + '=' + Mt(s.kiosk)) + '. The ' + (b ? 'bank' : 'kiosk') + ' is cheaper' + (b ? ', even though the kiosk’s rate looks better.' : '.'), ['Compare totals, commission included.'], 'e bank vs kiosk'); } },
          { id: 'e8ii', sub: 'ii', level: 'PRG', make: function (r, s) { var d = r2(Math.abs(s.bank - s.kiosk)); return amtPart('By how much?', d, { alts: [r2(Math.abs(s.bank - s.k2))], diag: [{ v: Math.abs(s.bank - s.usd * 1.38), code: 'u1l10-no-fee', hint: 'Include the kiosk’s ' + s.com + '% commission.' }, { v: Math.abs(s.bank - s.usd * 1.38 - s.com), code: 'u1l10-fee-pct', hint: 'A ' + s.com + '% commission is not $' + s.com + '. Multiply by ' + (1 + s.com / 100).toFixed(2) + '.' }] }, t(c2(Math.max(s.bank, s.kiosk)) + '-' + c2(Math.min(s.bank, s.kiosk)) + '=' + Mt(d)), ['Bank total and kiosk total (with commission), then subtract.'], 'e cheaper by'); } }] },
      { num: '9', stem: function (s) { return s.who + ' finds ' + s.item + ' on a US website for ' + A(s.us, 'USD') + ' plus ' + A(s.ship, 'USD') + ' shipping. ' + s.his + ' card uses ' + t(rateT('USD', 1.38, 'CAD')) + ' and adds a 2.5% fee. A Calgary store sells the same ' + s.item + ' for ' + M(s.store) + ' plus 5% GST. (Ignore any charges at the border.)'; },
        shared: function (r) { return find(function () { var c = r.pick([['earbuds', 18, 35, 5, 10], ['a phone stand', 12, 25, 4, 8], ['a fitness band', 30, 55, 6, 12], ['a backpack', 35, 60, 8, 14]]), who = r.pick([['Aiden', 'His'], ['Mila', 'Her'], ['Sami', 'His'], ['Leah', 'Her']]); var us = r.int(c[1], c[2]) + 0.99, ship = r.int(c[3], c[4]) + r.pick([0, 0.5]), on = r2((us + ship) * 1.38 * 1.025), on2 = r2(r2((us + ship) * 1.38) * 1.025), store = Math.round(on / 1.05 + r.pick([-1, 1]) * r.int(2, 9)) - 0.01, st = r2(store * 1.05); return { who: who[0], his: who[1], item: c[0], us: us, ship: ship, on: on, on2: on2, store: store, st: st }; }, function (s) { return Math.abs(s.on - s.st) >= 0.5 && Math.abs(s.on2 - s.st) >= 0.5; }, { who: 'Aiden', his: 'His', item: 'earbuds', us: 24.99, ship: 8, on: 46.66, on2: 46.66, store: 39.99, st: 41.99 }); }, parts: [
          { id: 'e9i', sub: 'i', level: 'PRG', make: function (r, s) {
            var u = s.us + s.ship;
            var p = fieldsPart('Find both totals in CAD.', [
              { label: 'Online', before: '$', chk: amtChk(s.on, { alts: [s.on2], diag: [{ v: s.us * 1.38 * 1.025, code: 'u1l10-no-ship', hint: 'Add the shipping to the price first.' }, { v: u * 1.38, code: 'u1l10-no-card-fee', hint: 'Add the 2.5% card fee: × 1.025.' }, { v: u / 1.38 * 1.025, code: 'u1l10-divided', hint: 'Multiply by 1.38: the rate starts with USD.' }] }), key: s.on.toFixed(2), show: t(Mt(s.on)) },
              { label: 'Calgary store', before: '$', chk: amtChk(s.st, { diag: [{ v: s.store, code: 'u1l10-no-gst', hint: 'Add the 5% GST: × 1.05.' }] }), key: s.st.toFixed(2), show: t(Mt(s.st)) }],
              'Online: ' + t(c2(s.us) + '+' + c2(s.ship) + '=' + c2(u)) + ' USD; ' + t(c2(u) + '\\times 1.38\\times 1.025' + to(u * 1.38 * 1.025)) + ' CAD<br>Store: ' + t(c2(s.store) + '\\times 1.05' + to(s.store * 1.05)), ['Online: (price + shipping) × 1.38 × 1.025.', 'Store: price × 1.05.'], 'e online vs store');
            p.bad = [[r2(u * 1.38).toFixed(2), s.store.toFixed(2)]];
            return p;
          } },
          { id: 'e9ii', sub: 'ii', level: 'EMG', make: function (r, s) { var st = s.st < s.on; return twoMC(r, 'Which is cheaper?', 'The <b>Calgary store</b>', 'The <b>US website</b>', st, 'Compare the two totals from part (i).', 'Online ' + M(s.on) + ', store ' + M(s.st) + ': the ' + (st ? 'Calgary store' : 'US website') + ' is cheaper.', ['Compare the totals.'], 'e cheaper where'); } },
          { id: 'e9iii', sub: 'iii', level: 'EMG', make: function (r, s) { var d = r2(Math.abs(s.on - s.st)); return amtPart('By how much?', d, { alts: [r2(Math.abs(s.on2 - s.st))], diag: [{ v: Math.abs((s.us + s.ship) * 1.38 - s.store), code: 'u1l10-no-card-fee', hint: 'Compare the full totals: with the card fee online and with GST at the store.' }] }, t(c2(Math.max(s.on, s.st)) + '-' + c2(Math.min(s.on, s.st)) + '=' + Mt(d)), ['Subtract the smaller total from the bigger one.'], 'e by how much'); } }] },
      { num: '10', stem: '<i>(Multiple Choice)</i>', parts: [{ id: 'e10', level: 'EMG', make: function (r) {
        var v = find(function () { return r.int(15, 90) * 20 + r.pick([0, 10]); }, function (m) { var a = m * 13.3, b = m / 13.3, c = m / 10, d = m / 133; return [a, b, c, d].every(function (x, i, arr) { return arr.filter(function (y) { return Math.abs(y - x) < 0.5; }).length === 1; }); }, 520);
        var it = r.pick(['A blanket at a market in Oaxaca', 'A sombrero in Mexico City', 'A painted mask in Puebla', 'A hammock in Mérida']);
        var cand = [{ v: v * 13.3, why: 'Multiplying gives far too many dollars. The rate starts with CAD, the currency you want, so divide.' }, { v: v / 13.3, right: true }, { v: v / 10, why: 'Divide by 13.3, not 10.' }, { v: v / 133, why: 'Check the decimal point: divide by 13.3.' }];
        return P.mc(r, it + ' costs ' + A(v, 'MXN') + '. The only rate posted is ' + t(rateT('CAD', 13.3, 'MXN')) + '. The cost in CAD is', cand.map(function (c) { return { html: t(Mt(c.v)), right: !!c.right, why: c.why }; }),
          'The rate starts with CAD, the currency you want, so divide: ' + t(v + '\\div 13.3' + to(v / 13.3)) + '.', ['Which currency does the rate start with?'], 'e MC MXN', true);
      } }] },
      { num: '11', stem: '<i>(Numerical Response)</i>', parts: [{ id: 'e11', level: 'EMG', make: function (r) {
        var v = find(function () { return r.int(20, 120) * 10 + r.pick([0, 5]); }, function (m) { var x = m / 1.6, f = x - Math.floor(x); return Math.abs(f - 0.5) > 0.02 && x < 9999; }, 850);
        var who = r.pick(['Jun', 'Lea', 'Dev', 'Maria']);
        return conv('A bank sells euros at ' + t(rateT('EUR', 1.60, 'CAD').replace('1.6', '1.60')) + '. ' + who + ' changes ' + A(v, 'CAD') + ' into euros. To the nearest euro, ' + who + ' gets ________ EUR.', v, { rate: 1.6, op: 'div', have: 'CAD', want: 'EUR', start: 'EUR', dp: 0, nr: true, word: 'the nearest euro', why: 'The rate starts with EUR, the currency ' + who + ' wants, so divide.', result: function (x) { return 'which rounds to ' + t(x + '\\text{ EUR}') + '.'; } }, 'e NR EUR');
      } }] },
      { num: '12', section: 'C. Stretch', stem: '', parts: [{ id: 'e12', level: 'ADV', make: function (r) {
        var usd = r.int(4, 30) * 25, who = r.pick(['Tess', 'Mason', 'Gabi', 'Quinn']), cad = r2(usd * 1.38), x = cad * 13.3;
        return amtPart(who + ' is in Texas with ' + A(usd, 'USD') + ' and is flying on to Mexico. Use ' + t(rateT('USD', 1.38, 'CAD')) + ' and ' + t(rateT('CAD', 13.3, 'MXN')) + ' to find how many pesos the US dollars are worth. (Hint: change to CAD first.)', x,
          { cur: 'MXN', alts: [usd * 1.38 * 13.3], diag: [{ v: usd * 13.3, code: 'u1l10-skip-cad', hint: 'The 13.3 rate is for <b>Canadian</b> dollars. Change the US dollars to CAD first (× 1.38).' }, { v: usd / 1.38 * 13.3, code: 'u1l10-divided', hint: 'To change USD to CAD, multiply by 1.38 (the rate starts with USD).' }, { v: cad, code: 'u1l10-one-step', hint: 'That’s the amount in CAD. Now change it to pesos (× 13.3).' }, { v: usd * 1.38 / 13.3, code: 'u1l10-divided', hint: 'The rate 1 CAD = 13.3 MXN starts with CAD, the currency you have now, so multiply.' }] },
          t(c2(usd) + '\\times 1.38=' + c2(cad)) + ' CAD<br>' + t(c2(cad) + '\\times 13.3' + to(x)) + '<br>The US dollars are worth about ' + t(At(x, 'MXN')) + '.', ['Change USD to CAD first.', 'Then change CAD to MXN.'], 'e USD→CAD→MXN');
      } }] },
      { num: '13', stem: '', parts: [{ id: 'e13', level: 'MAS', make: function (r) {
        var s = find(function () { var price = r.int(60, 200) + r.pick([0.99, 0.49, 0.95]), T = r2(price * 1.05), q = T / 1.025 / 1.38, c = Math.floor(q * 100 + 1e-9) / 100; while (r2(r2(c + 0.01) * 1.38 * 1.025) <= T) c = r2(c + 0.01); while (c > 0 && r2(c * 1.38 * 1.025) > T) c = r2(c - 0.01); return { price: price, T: T, q: q, c: c }; },
          function (s) { return near(s.c, Math.floor(s.q * 100 + 1e-9) / 100) && !near(s.price, 129.99); }, null) || { price: 119.99, T: 125.99, q: 125.99 / 1.025 / 1.38, c: 89.07 };
        var who = r.pick(['Aisha', 'Brody', 'Keira', 'Nico']), it = r.pick(['jacket', 'pair of boots', 'hockey stick', 'sleeping bag']);
        var up = r2(s.c + 0.01);
        var chk = function (resp) {
          var a = readNum(resp); if (a.res) return a.res;
          var v = a.v;
          if (near(v, s.c)) return ok();
          if (a.d > 2 && near(Math.floor(v * 100 + 1e-7) / 100, s.c)) return form('round', 'Right — now give it to the cent. (Round <b>down</b>: one cent more would go over.)');
          if (near(v, up) && r2(up * 1.38 * 1.025) > s.T) return wrong('u1l10-rounded-up', 'Close! But ' + t(Mt(up)) + ' USD would cost ' + t(Mt(up * 1.38 * 1.025)) + ' CAD — more than the store. Round <b>down</b> here: the price can’t go over.');
          if (near(v, r2(s.price / 1.025 / 1.38)) || near(v, Math.floor(s.price / 1.025 / 1.38 * 100) / 100)) return wrong('u1l10-no-gst', 'Work backwards from the store’s total <b>with GST</b>: ' + t(c2(s.price) + '\\times 1.05') + '.');
          if (near(v, r2(s.T / 1.38)) || near(v, r2(s.T / 1.025))) return wrong('u1l10-one-step', 'Undo <b>both</b> steps: the card fee (÷ 1.025) and the rate (÷ 1.38).');
          if (near(v, r2(s.T * 1.38 * 1.025)) || near(v, r2(s.T * 1.38))) return wrong('u1l10-forward', 'That works forwards. You know the CAD total and want the US price, so work backwards: divide.');
          if (near(v, s.T)) return wrong('u1l10-no-convert', 'That’s the Calgary total in CAD. Change it back to a US price: ÷ 1.025, then ÷ 1.38.');
          return wrong('value', null);
        };
        return { prompt: 'A ' + it + ' costs ' + M(s.price) + ' plus 5% GST in Calgary. Its US online price includes free shipping. ' + who + '’s card uses ' + t(rateT('USD', 1.38, 'CAD')) + ' and adds a 2.5% fee. What is the highest US price (round down to the cent) that would still cost no more than the Calgary store?',
          input: { type: 'number', before: '$', after: 'USD' }, check: chk, key: s.c.toFixed(2), answer: t(At(s.c, 'USD')), text: 'e highest US price',
          solution: 'Calgary total: ' + t(c2(s.price) + '\\times 1.05' + to(s.price * 1.05)) + '<br>Work backwards: undo the fee, then undo the rate: ' + t(c2(s.T) + '\\div 1.025\\div 1.38=' + N(+s.q.toFixed(4)) + '\\ldots') + '<br>Round <b>down</b> (the price can’t go over): ' + t(At(s.c, 'USD')) + ' or less.<br>Check: ' + t(c2(s.c) + '\\times 1.38\\times 1.025=' + N(+(s.c * 1.38 * 1.025).toFixed(4)) + '\\to ' + Mt(s.c * 1.38 * 1.025)) + ', not more than ' + t(Mt(s.T)) + '.',
          hints: ['Find the Calgary total with GST first.', 'Work backwards: divide by 1.025, then by 1.38. Round down to the cent.'], bad: [r2(s.T / 1.38).toFixed(2), r2(s.T).toFixed(2)] };
      } }] },
      { num: '14', stem: '', parts: [{ id: 'e14', level: 'MAS', make: function (r) {
        var cad = r.pick([1000, 500, 2000, 800, 1500, 1200, 600]), s = thereBack(cad, 1.41, 1.35), x = s.loss / cad * 100, x2 = s.loss2 / cad * 100;
        var ok1 = Math.abs(K.roundTo(x, 1) - K.roundTo(x2, 1)) < 1e-9;
        var p = { prompt: 'A bank buys US dollars at 1.35 and sells them at 1.41 (CAD for 1 USD). You change ' + A(cad, 'CAD') + ' into US dollars and change it all back the same day. What percent of your money do you lose? Round to the nearest tenth of a percent.',
          input: { type: 'number', after: '%' },
          check: (function () { var a = pctChk(x, { dp: 1, diag: [{ v: s.loss, code: 'u1l10-dollars', hint: 'That’s the dollars lost. Divide by the ' + M(cad) + ' you started with and multiply by 100.' }, { v: s.loss / s.back * 100, code: 'u1l10-pct-of-back', hint: 'The percent lost is out of the money you <b>started</b> with, ' + M(cad) + '.' }, { v: (1.41 - 1.35) * 100, code: 'u1l10-loss-wrong', hint: 'Change the money there (÷ 1.41) and back (× 1.35), then compare with what you started with.' }] }), b = ok1 ? null : pctChk(x2, { dp: 1 }); return function (resp) { var ra = a(resp); if (ra.v === 'correct' || !b) return ra; var rb = b(resp); return rb.v === 'correct' ? rb : ra; }; })(),
          key: K.roundTo(x, 1).toFixed(1), answer: t(K.roundTo(x, 1).toFixed(1) + '\\%'), text: 'e percent lost',
          solution: t(c2(cad) + '\\div 1.41' + to(s.fx)) + ' USD; ' + t(c2(s.f) + '\\times 1.35' + to(s.f * 1.35)) + ' CAD<br>Loss: ' + t(c2(cad) + '-' + c2(s.back) + '=' + c2(s.loss)) + '<br>Percent lost: ' + t('\\dfrac{' + c2(s.loss) + '}{' + c2(cad) + '}\\times 100=' + N(+x.toFixed(4)) + '\\approx ' + K.roundTo(x, 1).toFixed(1) + '\\%') + '.',
          hints: ['Change the CAD to USD with the selling rate, then back with the buying rate.', 'Percent lost = dollars lost ÷ dollars you started with × 100.'], bad: [s.loss.toFixed(2)] };
        return p;
      } }] }
    ]
  });
  function sentence(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
})(window);
