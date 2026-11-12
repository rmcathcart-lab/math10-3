/* Math 10-3 · Unit 1 · Lesson 11 — Unit 1 Review (N1, with REV parts)
 * Assignment 11 (u1_l11.tex: Part A Written Response 1–14, Part B Multiple Choice 15–22, Part C Numerical Response 23–26)
 * and the Lesson 11 Extra Practice = Practice Test 2 (u1_ep11.tex: A Skills 1–5, B Applying 6–16, C Stretch 17–19).
 * Every part is a generator: the same kind of item and the same steps as the booklet question, new numbers around the
 * booklet's (the booklet's own numbers are among the possible values; the lesson's worked-example numbers — 36:48,
 * 90 cm : 1.5 m, $250 in 6:4, 3:8 with 20 cups, 54 L / 600 km, the coffee sizes, the $420 bike, the $149 coat, the $90
 * runners, $300 / $40 / $45 USD, 3000 pesos, and the one-page examples x/6 = 10/15, $40 → $50, 25% + 10% off, 36 L /
 * 450 km, $3.49 for 750 g, 15% of $42, $50 USD — are left out). Bank boards and exchange rates are exactly the booklet's.
 * Calculator allowed. Money answers to the cent ("$12.49", "12.49", "12.490" are accepted; an unrounded answer or one
 * short of the cent gets a nudge, no try used; rounding the wrong way is wrong with a hint). Where the booklet keeps the
 * unrounded sale price (519.992 × 1.05) both that total and the one from the rounded sale price are accepted. Unit
 * prices being compared may be given to 2, 3 or 4 decimals (any correct rounding).
 * Recognised mistakes each get their own hint: dividing the wrong way (quantity ÷ price, hours ÷ pay), units not changed
 * (min/h, mL/L, g/kg, L to mL in the fuel mix), percent not changed to a decimal, 5% as 0.5, the tax given for the total,
 * tax on the regular price or the cost, the two provincial taxes multiplied, the discount given for the sale price,
 * percent change divided by the new price, stacked discounts added, the buying rate for the selling rate (and back),
 * multiplying instead of dividing by an exchange rate, shipping or sales tax left out, rounding a bag count down, …
 * Conversions: "explain / is it a deal / why does he get less / give a reason not about price" → multiple choice whose
 * options are reasons (one right); "which is cheaper, and by how much" → a word box (A or B, US or Calgary) + a money
 * box; "complete the table" (detergent price per load, the receipt) → the table input (given cells shown, blanks as
 * boxes); "which is the best buy" after a table → multiple choice; "estimate in your head" → an estimate box (any
 * sensible estimate is accepted); numerical response → the 4-character NR box. Booklet parts that ask two things are
 * split into lettered sub-parts (6(a i), 6(a ii), 14(c i), 14(c ii), Extra 8(a i), 8(a ii)).
 * Outcome N1, except the parts that only test a refresher skill (REV: 3(c) the tip, Extra 4(c) 12.5% of an amount).
 * Uses HW.u1ratio (js/lessons/u1l3.js) and HW.pctKit (js/lessons/u1l7.js); they are looked up when a question is made.
 * Levels: LIM BEG EMG PRG ADV MAS (MAS: 14(c i), Extra 17(b), Extra 18). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  /* the kits are looked up when a question is made (not when this file loads), so the load order of the lesson files
   * doesn't matter (the tests load them alphabetically: u1l11 before u1l3 and u1l7) */
  function kit(name) { var k = HW[name]; if (!k) throw new Error('js/lessons/u1l11.js needs HW.' + name + ' from ' + (name === 'u1ratio' ? 'js/lessons/u1l3.js' : 'js/lessons/u1l7.js')); return k; }
  var X = {}, PK = {};
  ['gcd', 'simp', 'rT', 'isInt', 'decPl', 'inList', 'toWhole', 'ratioPart', 'simpLines', 'numPart', 'same'].forEach(function (f) { X[f] = function () { var k = kit('u1ratio'); return k[f].apply(k, arguments); }; });
  ['pctOf', 'ofPart', 'tablePart', 'tableChk'].forEach(function (f) { PK[f] = function () { var k = kit('pctKit'); return k[f].apply(k, arguments); }; });
  var gcd = X.gcd, simp = X.simp, rT = X.rT, isInt = X.isInt, decPl = X.decPl, inList = X.inList, pctOf = PK.pctOf;

  /* ================= numbers and money ================= */
  function rd(x, dp) { return K.roundTo(x, dp); }
  function r2(x) { return rd(x, 2); }
  function q(x) { return Math.round(x * 1e9) / 1e9; }
  function near(a, b, e) { return Math.abs(a - b) < (e == null ? 1e-6 : e); }
  function nS(x) { return String(q(x)); }                                   // 22.5 -> "22.5"
  function N(x) { return HW.fmt(nS(x)); }                                   // a number in TeX
  function c2(x) { return HW.fmt(r2(x).toFixed(2)); }                       // money digits in TeX
  function Mt(x) { return '\\$' + c2(x); }                                  // money in TeX
  function MM(x) { return t(Mt(x)); }                                       // money in a sentence
  function dec(p) { return nS(p / 100); }                                   // 35 -> 0.35
  function pay(p) { return nS(1 - p / 100); }                               // 35 -> 0.65
  function mult(p) { var s = nS(1 + p / 100); return /\.\d$/.test(s) ? s + '0' : /^\d+$/.test(s) ? s + '.00' : s; } // 5 -> 1.05, 40 -> 1.40
  function raw5(x) { var s = +x.toFixed(5); return HW.fmt(String(s)) + (near(x, s, 1e-9) ? '' : '\\ldots'); }
  function toM(x) { return near(x, r2(x), 1e-7) ? '=\\$' + c2(x) : '=' + raw5(x) + '\\approx\\$' + c2(x); }
  function toN(x, dp) { return near(x, rd(x, dp), 1e-7) ? '=' + N(rd(x, dp)) : '=' + raw5(x) + '\\approx ' + HW.fmt(rd(x, dp).toFixed(dp)); }
  function find(gen, test, fb) { for (var i = 0; i < 600; i++) { var v = gen(); if (v && test(v)) return v; } return fb; }
  function br(a) { return a.filter(Boolean).join('<br>'); }
  function uT(s) { return s === '%' ? '\\%' : '\\text{' + (s.charAt(0) === '/' ? '' : ' ') + s + '}'; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function sz(x, small, big) { return x < 1000 ? x + ' ' + small : nS(x / 1000) + ' ' + big; }
  var NAMES = [['Amara', 'f'], ['Kai', 'm'], ['Malik', 'm'], ['Noor', 'f'], ['Jordan', 'm'], ['Priya', 'f'], ['Mateo', 'm'], ['Kayla', 'f'], ['Liam', 'm'], ['Hana', 'f'],
    ['Devon', 'm'], ['Rosa', 'f'], ['Theo', 'm'], ['Aisha', 'f'], ['Ben', 'm'], ['Maya', 'f'], ['Dani', 'f'], ['Kenji', 'm'], ['Sofia', 'f'], ['Omar', 'm']];
  function person(r, not) { var p = find(function () { return r.pick(NAMES); }, function (x) { return !not || x[0] !== not; }, NAMES[0]); return { n: p[0], he: p[1] === 'f' ? 'she' : 'he', his: p[1] === 'f' ? 'her' : 'his' }; }
  var AB = ['Red Deer', 'Calgary', 'Edmonton', 'Lethbridge', 'Airdrie', 'Medicine Hat', 'Okotoks', 'Cochrane', 'Grande Prairie'];

  /* ================= reading and checking a number ================= */
  function readNum(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\(?:text|mathrm)\{([^{}]*)\}/g, '$1');
    var pct = /%/.test(s);
    s = s.replace(/\\\$|\$/g, '').replace(/\\%|%/g, '').replace(/\\[,;: ]|~/g, ' ').replace(/¢/g, ' ').trim();
    var um = /^(-?[\d.,\s]*\d\.?)\s*([a-zA-Z\/³²^][\s\S]*)$/.exec(s); if (um) s = um[1].trim();
    if (/^\d{1,3}(,\d{3})+(\.\d*)?$/.test(s.replace(/\s/g, ''))) s = s.replace(/,/g, '');
    if (/^-?\d*,\d{1,2}$/.test(s.replace(/\s/g, ''))) return { res: form('u1l11-comma', 'Use a decimal point (not a comma), like 12.49.') };
    var p = HW.parse.number(s);
    if (!p.ok) return { res: p.code === 'empty' ? form('empty', 'Type your answer first.') : form('notnumber', 'Enter a single number.') };
    var pl = HW.parse.plain(s).replace(/[\s,]/g, ''), d = (pl.split('.')[1] || '').length;
    return { v: p.value, d: d, pct: pct, len: pl.replace(/^-/, '').length };
  }
  /* an answer rounded to dp places (2: the cent). o: { dp, exact, alts (other right values), diag [{v, code, hint}],
   * pct (a percent), nr (numerical response: 4 characters), word (the rounding place in words), miss (hint for any other wrong value) } */
  function amtChk(ans, o) {
    o = o || {};
    var dp = o.dp == null ? 2 : o.dp, money = dp === 2 && !o.pct && !o.plain, step = Math.pow(10, -dp), tol = step / 20;
    var word = o.word || (money ? 'the cent (2 decimal places)' : dp === 1 ? 'the nearest tenth (1 decimal place)' : dp === 0 ? 'the nearest whole number' : dp + ' decimal places');
    var exact = o.exact != null ? o.exact : ans;
    var acc = [rd(ans, dp)].concat((o.alts || []).map(function (a) { return rd(a, dp); }));
    var isAcc = function (x) { return acc.some(function (y) { return near(x, y, tol); }); };
    var dg = (o.diag || []).filter(function (m) { return m && m.v != null && isFinite(m.v) && !isAcc(rd(m.v, dp)); });
    return function (resp) {
      var a = readNum(resp); if (a.res) return a.res;
      var v = a.v, d = a.d;
      if (o.nr && a.len > 4) {
        if (isAcc(rd(v, dp))) return form('round', 'Right — now round it to ' + word + '. (Numerical response: up to 4 characters.)');
        return form('nr-long', 'Numerical response answers fit in 4 boxes (digits and a decimal point only).');
      }
      if (isAcc(v)) { if (money && a.pct) return form('u1l11-pct-sign', 'This answer is an amount of money, not a percent. Leave the % sign out.'); return ok(); }
      if (d > dp && isAcc(rd(v, dp))) return form('round', 'Right — now round it to ' + word + '.');
      if (o.pct && v > 0 && v < 1.5 && isAcc(rd(v * 100, dp))) return form('u1l11-as-pct', 'That’s the answer as a decimal. Multiply by 100 to write it as a percent.');
      for (var i = 0; i < dg.length; i++) {
        var m = dg[i];
        if (near(v, m.v, tol) || near(v, rd(m.v, dp), tol) || (d > dp && near(rd(v, dp), rd(m.v, dp), tol))) return wrong(m.code, m.hint);
        if (dp >= 2 && d === dp - 1 && near(v, rd(m.v, d), 1e-9) && !acc.some(function (y) { return near(rd(y, d), v, 1e-9); })) return wrong(m.code, m.hint);
      }
      if (dp >= 1 && d < dp && acc.some(function (y) { var f = Math.pow(10, d); return near(v, Math.floor(y * f + 1e-7) / f, 1e-9) || near(v, Math.round(y * f + 1e-7) / f, 1e-9); }))
        return form('u1l11-places', money ? 'Give money to the cent (2 decimal places), like $12.49.' : 'Round to ' + word + '.');
      if (d <= dp && near(Math.abs(v - acc[0]), step, tol) && (v - exact) * (acc[0] - exact) < 0 && Math.abs(v - exact) < step)
        return wrong('u1l11-round-dir', 'Check your rounding: look at the next digit. If it is 5 or more, round up; if it is 4 or less, leave the digit as it is.');
      return wrong('value', o.miss || null);
    };
  }
  /* a unit price used for comparing: right when it is the exact value correctly rounded to 2, 3 or 4 decimals */
  function upChk(exact, bad) {
    bad = (bad || []).filter(function (b) { return b && isFinite(b.v) && ![2, 3, 4].some(function (d) { return near(rd(b.v, d), rd(exact, d), 1e-9); }); });
    return function (resp) {
      var a = readNum(resp); if (a.res) return a.res;
      var v = a.v, d = a.d, f = Math.pow(10, d);
      if (near(v, exact, 1e-9) || (d >= 2 && d <= 4 && near(v, rd(exact, d), 1e-9)) || (d > 4 && Math.abs(v - exact) < 6e-5)) return ok();
      for (var i = 0; i < bad.length; i++) {
        var b = bad[i];
        if (near(v, b.v, 1e-9) || (d >= 1 && d <= 4 && (near(v, rd(b.v, d), 1e-9) || near(v, Math.floor(b.v * f + 1e-9) / f, 1e-9))) || (d > 4 && Math.abs(v - b.v) < 6e-5)) return wrong(b.code, b.hint);
      }
      if (d < 2 && Math.abs(v - exact) < Math.pow(10, -d)) return form('u1l11-keep-dec', 'Keep more decimals: give the unit price to the cent or, better for comparing, to a tenth of a cent (3 decimal places).');
      if (d >= 2 && d <= 4 && near(v, Math.floor(exact * f + 1e-9) / f, 1e-9) && !near(rd(exact, d), Math.floor(exact * f + 1e-9) / f, 1e-9))
        return wrong('u1l11-round-dir', 'Check your rounding: look at the next digit. 5 or more rounds up; 4 or less rounds down.');
      return wrong('value', null);
    };
  }
  /* a word answer (A or B, US or Calgary): the first 3 letters are enough */
  var STOP = { the: 1, promotion: 1, promo: 1, store: 1, buy: 1, buying: 1, 'in': 1, at: 1, from: 1, option: 1, is: 1, cheaper: 1 };
  function whichChk(right, wrongs, why, nudge) {
    function words(x) { return String(x == null ? '' : x).toLowerCase().replace(/\\text\{([^}]*)\}/g, '$1').replace(/[.,'’!:;()]/g, ' ').split(/\s+/).filter(function (w) { return w && !STOP[w]; }); }
    function hit1(s, list) { return list.some(function (tok) { return s === tok || (s.length >= 3 && tok.length >= 3 && (tok.indexOf(s) === 0 || s.indexOf(tok) === 0)); }); }
    function hit(ws, list) { return hit1(ws.join(''), list) || ws.some(function (w) { return hit1(w, list); }); }
    return function (resp) {
      var ws = words(resp);
      if (!ws.length) return form('empty', 'Type your answer first.');
      var a = hit(ws, right), b = hit(ws, wrongs);
      if (a && b) return form('u1l11-which-type', 'Type just one choice. ' + nudge);
      if (a) return ok();
      if (b) return wrong('u1l11-which', why);
      return form('u1l11-which-type', nudge);
    };
  }

  /* ================= part builders ================= */
  function amtPart(prompt, ans, o) {
    o = o || {};
    var dp = o.dp == null ? 2 : o.dp, isMoney = dp === 2 && !o.pct && !o.plain, key = isMoney ? rd(ans, dp).toFixed(dp) : nS(rd(ans, dp));
    var before = o.nr ? undefined : o.before !== undefined ? o.before : isMoney ? '$' : undefined;
    var after = o.nr ? undefined : o.after !== undefined ? o.after : o.pct ? '%' : undefined;
    var ansT = o.ansTex || ((isMoney && !o.nr ? '\\$' : '') + HW.fmt(key) + (o.ansUnit ? uT(o.ansUnit) : after ? uT(after) : ''));
    var p = { prompt: prompt, input: { type: 'number', before: before, after: after, nr: !!o.nr }, check: amtChk(ans, o), key: key, answer: t(ansT), solution: o.sol, hints: o.hints || [], text: o.text };
    var acc = [rd(ans, dp)].concat((o.alts || []).map(function (a) { return rd(a, dp); }));
    p.bad = (o.diag || []).filter(function (m) { return m && isFinite(m.v) && !acc.some(function (y) { return near(rd(m.v, dp), y, 1e-7); }); }).map(function (m) { return isMoney ? rd(m.v, dp).toFixed(dp) : nS(rd(m.v, dp)); });
    if (isMoney && !o.nr) p.good = ['$' + key, key + '0'];
    return p;
  }
  function upPart(prompt, exact, o) {
    o = o || {};
    var p = { prompt: prompt, input: { type: 'number', before: '$', after: o.after }, check: upChk(exact, o.bad), key: rd(exact, 3).toFixed(3),
      answer: t('\\$' + rd(exact, 3).toFixed(3) + (o.after ? uT(o.after) : '')) + (near(exact, r2(exact), 1e-9) ? '' : ' (or ' + t(Mt(exact)) + ' to the cent)'), solution: o.sol, hints: o.hints || [], text: o.text };
    p.good = [rd(exact, 2).toFixed(2), '$' + rd(exact, 4).toFixed(4)];
    p.bad = (o.bad || []).filter(function (b) { return isFinite(b.v) && Math.abs(b.v - exact) > 0.001; }).map(function (b) { return rd(b.v, 3).toFixed(3); });
    return p;
  }
  /* fields: specs [{label, name, before, after, mode, ph, chk, key, show}] */
  function fieldsPart(prompt, specs, sol, hints, text) {
    return P.fields(prompt, specs.map(function (s) { return { label: s.label, name: s.name || s.label.replace(/:$/, ''), before: s.before, after: s.after, mode: s.mode, placeholder: s.ph, wide: s.mode === 'text' }; }),
      specs.map(function (s) { return s.chk; }), specs.map(function (s) { return String(s.key); }), specs.map(function (s) { return s.label + ' ' + s.show; }).join('<br>'), sol, hints, text);
  }
  function mfld(label, ans, o) { o = o || {}; return { label: label, name: o.name, before: '$', after: o.after, chk: amtChk(ans, o), key: r2(ans).toFixed(2), show: t(Mt(ans)) }; }
  function wfld(label, ph, rightKey, right, wrongs, why, nudge, name) { return { label: label, name: name, mode: 'text', ph: ph, chk: whichChk(right, wrongs, why, nudge), key: rightKey, show: '<b>' + rightKey + '</b>' }; }
  function reasonMC(r, prompt, right, wrongs, sol, hints, text) {
    return P.mc(r, prompt, [{ html: right, right: true }].concat(wrongs.map(function (w) { return { html: w[0], why: w[1] }; })), sol, hints || [], text);
  }
  /* a board or rate table (HTML) */
  function table(head, rows, title) {
    var th = 'style="border:1px solid currentColor;padding:4px 12px;text-align:center"', thl = 'style="border:1px solid currentColor;padding:4px 12px;text-align:left"';
    return '<table style="border-collapse:collapse;margin:8px 0;font-size:0.95em">' + (title ? '<tr><th colspan="' + head.length + '" ' + th + '>' + title + '</th></tr>' : '') +
      '<tr>' + head.map(function (h, i) { return '<th ' + (i ? th : thl) + '>' + h + '</th>'; }).join('') + '</tr>' +
      rows.map(function (rw) { return '<tr>' + rw.map(function (c, i) { return '<td ' + (i ? th : thl) + '>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>';
  }

  /* ================= ratios (uses the ratio kit) ================= */
  function simpPart(a, o) {
    o = o || {};
    var w = X.toWhole(a);
    return X.ratioPart(o.prompt || t(rT(a)), simp(a), { orig: a, wrongs: o.wrongs, sol: br((o.pre || []).concat(X.simpLines(a))),
      hints: o.hints || (w.f > 1 ? ['Multiply both terms by ' + t(w.f) + ' to make them whole numbers.', 'Then divide both by their greatest common factor.'] : ['Find the greatest common factor of ' + t(N(w.a[0])) + ' and ' + t(N(w.a[1])) + '.', 'Divide both terms by it.']),
      text: o.text || 'simplify ' + a.join(':') });
  }
  var EX_RAT = [[36, 48], [12, 18], [6, 4], [45, 120], [90, 150]];
  function genPair(r, lo, hi, gs, test) {
    return find(function () { var p = r.int(lo, hi), qq = r.int(lo, hi), g = r.pick(gs); return [p * g, qq * g, p, qq]; },
      function (v) { return v[2] !== v[3] && gcd(v[2], v[3]) === 1 && !inList([v[0], v[1]], EX_RAT) && (!test || test(v)); }, [12, 20, 3, 5]);
  }
  function genDec(r, test) {
    return find(function () { var p = r.int(1, 6), qq = r.int(1, 6), s = r.pick([0.5, 1.5, 2.5, 0.3, 0.6, 1.2, 0.4, 0.8, 0.7, 1.5]); return [q(p * s), q(qq * s), p, qq]; },
      function (v) { return v[2] !== v[3] && gcd(v[2], v[3]) === 1 && (!isInt(v[0]) || !isInt(v[1])) && decPl(v[0]) <= 1 && decPl(v[1]) <= 1 && (!test || test(v)); }, [1.5, 4.5, 1, 3]);
  }
  var UNITS = {
    min_h: { s: 'min', b: 'h', f: 60, bad: 100, sN: 'minutes', Ys: [1, 1, 2, 3], Xs: [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 75, 80, 90, 100] },
    cm_m: { s: 'cm', b: 'm', f: 100, bad: 1000, sN: 'centimetres', Ys: [1, 2, 1.5, 3], Xs: [20, 25, 30, 40, 45, 60, 75, 80, 90] },
    g_kg: { s: 'g', b: 'kg', f: 1000, bad: 100, sN: 'grams', Ys: [1, 2, 1.5], Xs: [100, 150, 200, 250, 300, 400, 500, 600, 750] },
    mL_L: { s: 'mL', b: 'L', f: 1000, bad: 100, sN: 'millilitres', Ys: [1, 2, 1.5], Xs: [100, 200, 250, 300, 400, 500, 750] } };
  var EX_UNIT = [[45, 2], [90, 1.5]];
  function unitRatio(r, keys) {
    var U = UNITS[r.pick(keys)];
    var v = find(function () { return [r.pick(U.Xs), r.pick(U.Ys)]; }, function (v) {
      var S = q(v[1] * U.f); if (v[0] >= S || !isInt(S) || inList(v, EX_UNIT)) return false;
      var s = simp([v[0], S]); return s[0] <= 20 && s[1] <= 25 && gcd(v[0], S) > 1;
    }, [U.Xs[0], U.Ys[0]]);
    var Xv = v[0], Y = v[1], S = q(Y * U.f);
    var wrongs = [{ r: [Xv, Y], code: 'u1l3-no-convert', hint: 'Change both amounts to the <b>same unit</b> first: ' + t(N(Y) + uT(U.b) + '=' + N(S) + uT(U.s)) + '.' },
      { r: [Xv, q(Y * U.bad)], code: 'u1l3-wrong-factor', hint: 'Check the conversion: ' + t('1' + uT(U.b) + '=' + U.f + uT(U.s)) + '.' }];
    return simpPart([Xv, S], { prompt: t(N(Xv) + uT(U.s) + ':' + N(Y) + uT(U.b)), wrongs: wrongs, pre: ['Same unit: ' + t(N(Y) + uT(U.b) + '=' + N(S) + uT(U.s)) + ', so the ratio is ' + t(N(Xv) + ':' + N(S)) + '.'],
      hints: ['Change ' + t(N(Y) + uT(U.b)) + ' to ' + U.sN + ': ' + t('1' + uT(U.b) + '=' + U.f + uT(U.s)) + '.', 'Then drop the units and simplify.'], text: 'units ' + Xv + U.s + ':' + Y + U.b });
  }

  /* ================= proportions =================
   * M = [[top left, top right], [bottom left, bottom right]] (fractions a/b = c/d); null = x */
  function where(M) { for (var r0 = 0; r0 < 2; r0++) for (var s = 0; s < 2; s++) if (M[r0][s] == null) return [r0, s]; return null; }
  function propTex(M, frm) {
    var e = function (r0, s) { return M[r0][s] == null ? 'x' : N(M[r0][s]); };
    return frm === 'colon' ? e(0, 0) + ':' + e(1, 0) + '=' + e(0, 1) + ':' + e(1, 1) : '\\dfrac{' + e(0, 0) + '}{' + e(1, 0) + '}=\\dfrac{' + e(0, 1) + '}{' + e(1, 1) + '}';
  }
  function propPart(M, frm, text) {
    var w = where(M), rx = w[0], sx = w[1], p = M[1 - rx][1 - sx], qv = M[rx][1 - sx], s2 = M[1 - rx][sx], x = q(qv * s2 / p), prod = q(qv * s2);
    var W = [], seen = [x];
    var add = function (v, code, hint) { if (!(v > 0) || !isFinite(v) || seen.some(function (y) { return near(y, v); })) return; seen.push(q(v)); W.push({ v: q(v), code: code, hint: hint }); };
    add(M[1 - rx][0] * M[1 - rx][1] / qv, 'u1l4-same-row', 'Multiply along the <b>diagonals</b> (top-left with bottom-right, bottom-left with top-right). Don’t multiply the two ' + (rx === 0 ? 'bottoms' : 'tops') + ' together.');
    add(p * qv / s2, 'u1l4-wrong-divide', 'After you cross-multiply, divide by the number that is <b>on x’s diagonal</b>: ' + t(N(p)) + '.');
    add(p * s2 / qv, 'u1l4-wrong-divide', 'After you cross-multiply, divide by the number that is <b>on x’s diagonal</b>: ' + t(N(p)) + '.');
    add(qv + s2 - p, 'u1l4-added', 'Only multiply or divide. Adding the same amount to both terms does <b>not</b> make an equal ratio.');
    add(prod, 'u1l4-wrong-divide', 'You multiplied along the diagonal. Now divide by ' + t(N(p)) + ' to find x.');
    var k = s2 / p, L = [];
    if (frm === 'colon') L.push('As fractions: ' + t(propTex(M, 'frac')));
    if (isInt(k) && k > 1) L.push(t(N(p) + '\\times ' + N(k) + '=' + N(s2)) + ', so ' + t('x=' + N(qv) + '\\times ' + N(k) + '=' + N(x)));
    else if (isInt(q(1 / k)) && 1 / k > 1) L.push(t(N(p) + '\\div ' + N(q(1 / k)) + '=' + N(s2)) + ', so ' + t('x=' + N(qv) + '\\div ' + N(q(1 / k)) + '=' + N(x)));
    else L.push('Cross-multiply: ' + t(N(p) + 'x=' + N(qv) + '\\times ' + N(s2) + '=' + N(prod)), t('x=' + N(prod) + '\\div ' + N(p) + '=' + N(x)));
    var part = X.numPart(t(propTex(M, frm)), x, { wrongs: W, before: t('x='), sol: br(L), text: text,
      hints: ['Multiply along the diagonals to write an equation (or look for a scale factor).', 'Divide by the number that is with x.'] });
    return part;
  }

  /* ================= MC builders for numbers ================= */
  function distinct(vals, tol) { for (var i = 0; i < vals.length; i++) for (var j = i + 1; j < vals.length; j++) if (Math.abs(vals[i] - vals[j]) < (tol || 0.005)) return false; return vals.every(function (v) { return isFinite(v) && v > 0; }); }

  HW.addCodes({
    'u1l11-comma': 'Comma instead of a decimal point', 'u1l11-places': 'Not rounded to the place asked', 'u1l11-round-dir': 'Rounded the wrong way', 'u1l11-keep-dec': 'Unit price rounded too much to compare',
    'u1l11-pct-sign': 'Money written with a % sign', 'u1l11-as-pct': 'Gave the decimal instead of the percent', 'u1l11-which': 'Picked the wrong option', 'u1l11-which-type': 'Unclear choice typed',
    'u1l11-flip': 'Divided the wrong way', 'u1l11-times': 'Multiplied instead of dividing', 'u1l11-no-convert': 'Did not change the units', 'u1l11-tax-only': 'Gave the tax instead of the total',
    'u1l11-five-half': '5% used as 0.5', 'u1l11-pct-dollars': 'Used the percent as dollars', 'u1l11-no-tax': 'Left out the tax', 'u1l11-tax-original': 'Tax on the regular price or the cost',
    'u1l11-gave-discount': 'Gave the discount instead of the sale price', 'u1l11-gave-sale': 'Gave the sale price instead of the discount', 'u1l11-added-pct': 'Added the percent instead of taking it off',
    'u1l11-div-new': 'Percent: divided by the new (or retail) price', 'u1l11-ratio-pct': 'Percent: new ÷ old × 100 (no subtraction)', 'u1l11-no-x100': 'Forgot × 100', 'u1l11-one-item': 'Answer for one item',
    'u1l11-regular': 'Gave the regular cost instead of the savings', 'u1l11-deal-cost': 'Gave the deal cost instead of the savings', 'u1l11-per-item': 'Gave the savings on one item',
    'u1l11-buy-rate': 'Used the buying rate instead of the selling rate', 'u1l11-sell-rate': 'Used the selling rate instead of the buying rate', 'u1l11-divided': 'Divided by the rate instead of multiplying',
    'u1l11-multiplied': 'Multiplied by the rate instead of dividing', 'u1l11-no-ship': 'Left out shipping', 'u1l11-no-ustax': 'Left out the US sales tax', 'u1l11-gst-us': 'Used GST on the US price',
    'u1l11-compound': 'Multiplied the two tax rates instead of adding them', 'u1l11-gave-total': 'Gave a total instead of the difference', 'u1l11-est': 'Estimate too far off', 'u1l11-est-none': 'Estimate not converted',
    'u1l11-est-div': 'Estimate made by dividing', 'u1l11-hours': 'Used the total pay instead of the hourly rate', 'u1l11-cents': 'Gave dollars instead of cents', 'u1l11-tip-total': 'Tip worked on the total with tax',
    'u1l11-forward': 'Worked forwards instead of backwards', 'u1l11-round-down': 'Rounded a count to buy down', 'u1l11-per-part': 'Gave one part instead of the share', 'u1l11-term-div': 'Divided the total by one term',
    'u1l11-equal': 'Split equally instead of in the ratio', 'u1l11-whole-mix': 'Used the whole mix', 'u1l11-coupon-first': 'Took the coupon off before the percent', 'u1l11-coupon-after-tax': 'Took the coupon off after the tax',
    'u1l11-no-coupon': 'Left out the coupon', 'u1l11-no-free': 'Paid for the free item', 'u1l11-free-wrong': 'Took a free item that the deal doesn’t give', 'u1l11-loss-whole': 'Loss worked on all the pesos bought',
    'u1l11-paid': 'Gave what was paid instead of the loss', 'u1l11-one-tire': 'Worked with one tire only', 'u1l11-no-ship-est': 'Estimate left out shipping or tax'
  });
  HW.addPartial({
    'u1l11-round-dir': 's', 'u1l11-flip': 'n', 'u1l11-times': 'n', 'u1l11-no-convert': 'n', 'u1l11-tax-only': 's', 'u1l11-five-half': 'b', 'u1l11-pct-dollars': 'n', 'u1l11-no-tax': 'b', 'u1l11-tax-original': 'b',
    'u1l11-gave-discount': 's', 'u1l11-gave-sale': 's', 'u1l11-added-pct': 'n', 'u1l11-div-new': 'b', 'u1l11-ratio-pct': 'b', 'u1l11-no-x100': 's', 'u1l11-one-item': 'b', 'u1l11-regular': 'b', 'u1l11-deal-cost': 'b',
    'u1l11-per-item': 'b', 'u1l11-buy-rate': 'b', 'u1l11-sell-rate': 'b', 'u1l11-divided': 'n', 'u1l11-multiplied': 'n', 'u1l11-no-ship': 'b', 'u1l11-no-ustax': 'b', 'u1l11-gst-us': 'b', 'u1l11-compound': 's',
    'u1l11-gave-total': 'b', 'u1l11-est': 'n', 'u1l11-est-none': 'n', 'u1l11-est-div': 'n', 'u1l11-hours': 'n', 'u1l11-cents': 's', 'u1l11-tip-total': 's', 'u1l11-forward': 'n', 'u1l11-round-down': 's',
    'u1l11-per-part': 'b', 'u1l11-term-div': 'n', 'u1l11-equal': 'n', 'u1l11-whole-mix': 'n', 'u1l11-coupon-first': 's', 'u1l11-coupon-after-tax': 's', 'u1l11-no-coupon': 'b', 'u1l11-no-free': 'b', 'u1l11-free-wrong': 'b',
    'u1l11-loss-whole': 'b', 'u1l11-paid': 'b', 'u1l11-one-tire': 'b', 'u1l11-no-ship-est': 'b', 'u1l11-which': 'n'
  });

  /* ================= shared helpers for the money questions ================= */
  var GST_DIAG = function (P) { return [{ v: P * 0.05, code: 'u1l11-tax-only', hint: 'That’s the GST alone. Add it to the price (or multiply by ' + t('1.05') + ').' }, { v: P * 1.5, code: 'u1l11-five-half', hint: t('5\\%=0.05') + ', not ' + t('0.5') + '. Multiply by ' + t('1.05') + '.' }, { v: P + 5, code: 'u1l11-pct-dollars', hint: t('5\\%') + ' is not ' + t('\\$5') + '. Multiply by ' + t('1.05') + '.' }, { v: P * 0.95, code: 'u1l11-added-pct', hint: 'Tax is <b>added</b>: multiply by ' + t('1.05') + ', not ' + t('0.95') + '.' }]; };
  /* an estimate (US price → CAD in your head): anything from about 1.3 to 1.45 times the US total */
  function estChk(T, o) {
    var lo = T * 1.3 - 2, hi = T * 1.45 + 2;
    return function (resp) {
      var a = readNum(resp); if (a.res) return a.res;
      var v = a.v;
      if (v >= lo && v <= hi) return ok();
      if (Math.abs(v - T) <= 0.04 * T + 1) return wrong('u1l11-est-none', 'That’s still in US dollars. Change it to Canadian dollars: each US dollar is about ' + t('\\$1.40') + ' CAD.');
      if (Math.abs(v - T / 1.38) <= 0.08 * T / 1.38 + 1) return wrong('u1l11-est-div', 'You divided. 1 USD = 1.38 CAD starts with the currency you have, so <b>multiply</b> (a Canadian price is bigger).');
      if (o && o.part && Math.abs(v - o.part * 1.38) <= 0.06 * o.part * 1.38) return wrong('u1l11-no-ship-est', o.partHint);
      return wrong('u1l11-est', 'Round the US total to a friendly number, then multiply by about 1.4 (or add about a third).');
    };
  }

  /* ---- Q6 / Extra 8 / Q18: three sizes with one best buy ---- */
  function threeSizes(r, S, ulo, uhi, bestPick, fb) {
    return find(function () {
      var s = S.map(function (a) { return r.pick(a); }), b = r.pick(bestPick), u = r.int(ulo, uhi) / 100;
      var us = s.map(function (x, i) { return i === b ? u : u + r.int(5, 16) / 100; });
      var pr = s.map(function (x, i) { return q(Math.max(1, Math.round(x / 100 * us[i] * 2) / 2) - 0.01); });
      return { s: s, pr: pr, up: pr.map(function (p, i) { return p / s[i] * 100; }), b: b };
    }, function (v) {
      var a = v.up.map(function (x) { return rd(x, 3); }), b = v.b, o1 = a[(b + 1) % 3], o2 = a[(b + 2) % 3];
      return o1 - a[b] >= 0.02 && o2 - a[b] >= 0.02 && Math.abs(o1 - o2) >= 0.01 && (b === 2 || v.s[2] > v.s[1]);
    }, fb);
  }

  /* ---- Q9: the receipt ---- */
  var HW_ITEMS = [['Box of deck screws', 5, 8], ['Tube of caulking', 6, 9], ['Drill bit set', 18, 33], ['Roll of masking tape', 4, 7], ['Pack of sandpaper', 5, 9], ['Paint brush', 7, 13],
    ['Box of nails', 4, 8], ['Utility knife', 8, 14], ['Tape measure', 12, 23], ['Pair of work gloves', 9, 17]];
  function receiptPart(r) {
    var city = r.pick(['Airdrie', 'Okotoks', 'Cochrane', 'Red Deer', 'Camrose', 'Brooks']);
    var items = r.sample(HW_ITEMS, 3).map(function (it, i) { return { name: it[0], qn: i < 2 ? r.int(2, 4) : 1, p: q(r.int(it[1], it[2]) + r.pick([0.29, 0.49, 0.79, 0.99])) }; });
    if (r.chance(0.4)) { var sw = items[1]; items[1] = items[2]; items[2] = sw; }
    var amts = items.map(function (x) { return r2(x.qn * x.p); }), sub = r2(amts[0] + amts[1] + amts[2]), gst = pctOf(5, sub), tot = r2(sub + r2(gst));
    var rows = items.map(function (x) { return '\\text{' + x.name + '}'; }).concat(['\\text{Subtotal}', '\\text{GST (5\\%)}', '\\textbf{Total}']);
    var cols = ['\\text{Quantity}', '\\text{Price each}', '\\text{Amount}'];
    var cells = items.map(function (x) { return [String(x.qn), Mt(x.p), null]; }).concat([['', '', null], ['', '', null], ['', '', null]]);
    var priceSum = r2(items[0].p + items[1].p + items[2].p);
    var blanks = items.map(function (x, i) {
      return { where: 'cell', i: i, j: 2, name: x.name, chk: amtChk(amts[i], { diag: x.qn > 1 ? [{ v: x.p, code: 'u1l11-one-item', hint: 'The quantity is ' + t(x.qn) + ': multiply ' + t(x.qn + '\\times ' + Mt(x.p)) + '.' }, { v: x.qn + x.p, code: 'u1l11-one-item', hint: 'Multiply the quantity by the price each (don’t add).' }] : [] }) };
    });
    blanks.push({ where: 'cell', i: 3, j: 2, name: 'Subtotal', chk: amtChk(sub, { diag: [{ v: priceSum, code: 'u1l11-one-item', hint: 'Add the <b>Amount</b> column (quantity × price each), not the prices.' }] }) });
    blanks.push({ where: 'cell', i: 4, j: 2, name: 'GST', chk: amtChk(gst, { exact: gst, diag: [{ v: sub * 0.5, code: 'u1l11-five-half', hint: t('5\\%=0.05') + ', not ' + t('0.5') + '.' }, { v: sub * 1.05, code: 'u1l11-tax-only', hint: 'That’s the total. The GST line is just the tax: subtotal × 0.05.' }] }) });
    blanks.push({ where: 'cell', i: 5, j: 2, name: 'Total', chk: amtChk(tot, { alts: [sub * 1.05], diag: [{ v: sub, code: 'u1l11-no-tax', hint: 'Add the GST to the subtotal.' }] }) });
    var keyCells = items.map(function (x, i) { return [String(x.qn), Mt(x.p), amts[i].toFixed(2)]; }).concat([['', '', sub.toFixed(2)], ['', '', r2(gst).toFixed(2)], ['', '', tot.toFixed(2)]]);
    var est = items.reduce(function (s, x) { return s + x.qn * Math.round(x.p); }, 0);
    var p = PK.tablePart('Complete this receipt from a hardware store in ' + city + '.', { rows: rows, cols: cols, cells: cells, corner: '\\text{Item}', keys: 'pctkit-money', help: 'Tap a box, then type the amount (no $ needed).' },
      PK.tableChk(blanks), { rows: rows, cols: cols, cells: keyCells },
      br([items.filter(function (x) { return x.qn > 1; }).map(function (x) { return t(x.qn + '\\times ' + c2(x.p) + '=' + c2(x.qn * x.p)); }).join('; '),
        'Subtotal: ' + t(amts.map(c2).join('+') + '=' + Mt(sub)),
        'GST: ' + t(c2(sub) + '\\times 0.05' + toM(gst)) + '; total: ' + t(c2(sub) + '+' + c2(gst) + '=' + Mt(tot)),
        'Estimate check: about ' + t('\\$' + est) + ', so ' + t(Mt(sub)) + ' is reasonable.']),
      ['Amount = quantity × price each. Subtotal = the sum of the amounts.', 'GST = subtotal × 0.05 (round to the cent). Total = subtotal + GST.'], 'receipt');
    p.bad = [{ rows: rows, cols: cols, cells: items.map(function (x) { return [String(x.qn), Mt(x.p), x.p.toFixed(2)]; }).concat([['', '', priceSum.toFixed(2)], ['', '', r2(priceSum * 0.05).toFixed(2)], ['', '', r2(priceSum * 1.05).toFixed(2)]]) }];
    return p;
  }

  /* ---- Q13 / Extra 11: bank boards (exactly the booklet's) ---- */
  var BOARD13 = { USD: [1.33, 1.43], EUR: [1.47, 1.57], GBP: [1.71, 1.83] };
  var CURN = { USD: ['US dollar', 'US dollars'], EUR: ['euro', 'euros'], GBP: ['British pound', 'British pounds'], MXN: ['Mexican peso', 'Mexican pesos'] };
  var TRIP = { USD: ['Florida', 'Arizona', 'New York', 'Hawaii', 'California'], EUR: ['Italy', 'France', 'Spain', 'Germany', 'Greece'], GBP: ['England', 'Scotland', 'Wales'] };
  var BOARD13_HTML = table(['Currency', 'We buy', 'We sell'], [['US dollar (USD)', '1.33', '1.43'], ['Euro (EUR)', '1.47', '1.57'], ['British pound (GBP)', '1.71', '1.83']], 'In Canadian dollars for 1 unit');
  var BOARD_EP11_HTML = table(['Currency', 'We buy', 'We sell'], [['US dollar (USD)', '1.34', '1.42'], ['Mexican peso (MXN)', '0.072', '0.081']], 'In Canadian dollars for 1 unit');
  function fAmt(x, cur) { return cur === 'USD' ? '$' + HW.fmt(nS(x), true) + ' USD' : HW.fmt(nS(x), true) + ' ' + CURN[cur][1]; }

  HW.defineLesson({
    id: 'u1l11', unit: 1, num: '11', title: 'Unit 1 Review', outcome: 'N1',
    blurb: 'A practice unit test: ratios, proportions, rates, unit price and best buys, markup, tax and discounts, and currency exchange — written response, multiple choice and numerical response.',
    questions: [
      /* ===================== Part A: Written Response ===================== */
      { num: '1', section: 'Part A: Written Response', stem: 'Write each ratio in simplest form.', parts: [
        { id: '1a', level: 'BEG', make: function (r) { var v = genPair(r, 2, 9, [3, 4, 5, 6], function (v) { return v[0] <= 60 && v[1] <= 60; }); return simpPart([v[0], v[1]]); } },
        { id: '1b', level: 'BEG', make: function (r) {
          var v = genPair(r, 1, 7, [4, 5, 6, 7, 8, 9], function (v) { return v[2] < v[3] && v[2] <= 2 && v[1] <= 72; });
          return simpPart([v[0], v[1]], { prompt: t(v[0]) + ' to ' + t(v[1]), text: 'words ' + v[0] + ' to ' + v[1], hints: ['“' + v[0] + ' to ' + v[1] + '” is the ratio ' + t(v[0] + ':' + v[1]) + '.', 'Divide both terms by their greatest common factor.'] });
        } },
        { id: '1c', level: 'EMG', make: function (r) { return unitRatio(r, ['min_h', 'min_h', 'cm_m']); } },
        { id: '1d', level: 'EMG', make: function (r) { var v = genDec(r, function (v) { return v[0] < v[1]; }); return simpPart([v[0], v[1]]); } }] },
      { num: '2', stem: 'Find each unit price.', parts: [
        { id: '2a', level: 'BEG', make: function (r) {
          var c = r.pick([{ what: 'A 4 L jug of milk', n: 4, lo: 5, hi: 6 }, { what: 'A 2 L carton of orange juice', n: 2, lo: 3, hi: 5 }, { what: 'A 4 L jug of windshield washer fluid', n: 4, lo: 4, hi: 7 }, { what: 'A 3 L bag of chocolate milk', n: 3, lo: 4, hi: 6 }]);
          var Pr = q(r.int(c.lo, c.hi) + r.pick([0.29, 0.49, 0.79, 0.99])), x = Pr / c.n;
          return upPart(c.what + ' for ' + MM(Pr) + ' (price per litre)', x, { after: '/L', bad: [{ v: c.n / Pr, code: 'u1l11-flip', hint: 'Unit price = price ÷ quantity: ' + t(c2(Pr) + '\\div ' + c.n) + '. (You divided the litres by the price.)' }, { v: Pr * c.n, code: 'u1l11-times', hint: 'Divide the price by the number of litres (don’t multiply).' }],
            sol: t(c2(Pr) + '\\div ' + c.n + '=' + raw5(x)) + ', about ' + t('\\$' + rd(x, 3).toFixed(3) + '\\text{/L}') + ' (' + t(Mt(x) + '\\text{/L}') + ' to the cent)', hints: ['Unit price = price ÷ quantity.'], text: 'per L ' + Pr + '/' + c.n });
        } },
        { id: '2b', level: 'BEG', make: function (r) {
          var c = r.pick([{ what: 'A dozen eggs', n: 12, per: 'egg', lo: 25, hi: 49 }, { what: 'A pack of 6 yogurt cups', n: 6, per: 'cup', lo: 55, hi: 95 }, { what: 'A pack of 8 hot dog buns', n: 8, per: 'bun', lo: 30, hi: 55 }, { what: 'A box of 10 granola bars', n: 10, per: 'bar', lo: 40, hi: 69 }]);
          var cents = r.int(c.lo, c.hi), Pr = q(c.n * cents / 100), x = cents / 100;
          return amtPart(c.what + ' for ' + MM(Pr) + ' (price per ' + c.per + ')', x, { after: 'per ' + c.per, diag: [{ v: c.n / Pr, code: 'u1l11-flip', hint: 'Unit price = price ÷ quantity: ' + t(c2(Pr) + '\\div ' + c.n) + '.' }, { v: Pr * c.n, code: 'u1l11-times', hint: 'Divide the price by the number of items (don’t multiply).' }],
            sol: t(c2(Pr) + '\\div ' + c.n + '=' + Mt(x)) + ' per ' + c.per, hints: ['There are ' + c.n + ' in the pack. Unit price = price ÷ quantity.'], text: 'per item ' + Pr + '/' + c.n });
        } }] },
      { num: '3', stem: function (s) { return 'A restaurant bill in ' + s.city + ' is ' + MM(s.B) + ' before tax.'; },
        shared: function (r) { return { city: r.pick(AB), B: find(function () { return r.int(500, 1800) * 5 / 100; }, function (b) { return !near(b, 42); }, 46.8), tip: r.pick([15, 15, 18, 20]) }; }, parts: [
        { id: '3a', level: 'BEG', make: function (r, s) { return PK.ofPart(5, s.B, { money: true, prompt: 'Find the 5% GST.', text: 'GST ' + s.B }); } },
        { id: '3b', level: 'BEG', make: function (r, s) {
          var g = pctOf(5, s.B), T = r2(s.B + r2(g));
          return amtPart('Find the total with GST.', T, { alts: [s.B * 1.05], diag: GST_DIAG(s.B).concat([{ v: s.B * (1 + s.tip / 100), code: 'u1l11-tax-only', hint: 'This total has the GST only (no tip). Add ' + t('5\\%') + '.' }]),
            sol: 'GST: ' + t(c2(s.B) + '\\times 0.05' + toM(g)) + '<br>Total: ' + t(c2(s.B) + '+' + c2(g) + '=' + Mt(T)) + ' (or ' + t(c2(s.B) + '\\times 1.05') + ')', hints: ['Total = bill + GST.', 'Or multiply the bill by 1.05.'], text: 'total ' + s.B });
        } },
        { id: '3c', level: 'BEG', outcome: 'REV', make: function (r, s) {
          var B5 = s.B * 1.05;
          return PK.ofPart(s.tip, s.B, { money: true, prompt: 'Find a ' + s.tip + '% tip on the ' + MM(s.B) + '.', text: 'tip ' + s.tip + ' ' + s.B,
            extraDiag: function (v) { return near(v, r2(B5 * s.tip / 100), 0.006) && !near(r2(B5 * s.tip / 100), r2(s.B * s.tip / 100), 0.001) ? { code: 'u1l11-tip-total', hint: 'Work the tip on the ' + MM(s.B) + ' (before tax), as the question says.' } : null; } });
        } }] },
      { num: '4', stem: 'Solve each proportion.', parts: [
        { id: '4a', level: 'BEG', make: function (r) {
          var v = find(function () { var d1 = r.int(3, 9), x = r.int(2, d1 + 3), k = r.int(2, 5); return [x, d1, x * k, d1 * k]; }, function (v) { return v[0] !== v[1] && v[2] <= 60 && v[3] <= 60; }, [3, 5, 12, 20]);
          return propPart([[null, v[2]], [v[1], v[3]]], 'frac', 'prop a ' + v.join(','));
        } },
        { id: '4b', level: 'EMG', make: function (r) {
          var v = find(function () { return [r.pick([2, 4, 6, 8]), r.int(3, 11), r.int(5, 15)]; }, function (v) { var x = v[1] * v[2] / v[0]; return gcd(v[0], v[1]) === 1 && v[2] !== v[0] && !isInt(x) && decPl(x) === 1 && x < 60; }, [4, 9, 10]);
          return propPart([[v[0], v[2]], [v[1], null]], 'frac', 'prop b ' + v.join(','));
        } },
        { id: '4c', level: 'EMG', make: function (r) {
          var v = find(function () { return [r.int(2, 9), r.int(2, 5), r.int(3, 15)]; }, function (v) { return v[0] !== v[2] && v[0] * v[1] <= 45 && v[2] * v[1] <= 60 && gcd(v[0], v[2]) < Math.min(v[0], v[2]); }, [7, 3, 12]);
          return propPart([[v[0], v[0] * v[1]], [null, v[2] * v[1]]], 'colon', 'prop c ' + v.join(','));
        } }] },
      { num: '5', stem: function (s) { return s.p.n + ' earns ' + MM(s.E) + ' for ' + s.h + ' hours of work at ' + s.job + '.'; },
        shared: function (r) { var w = r.int(61, 79) / 4, h = r.int(6, 14); return { p: person(r), w: w, h: h, E: r2(w * h), H: r.int(28, 40), job: r.pick(['a garden centre', 'a grocery store', 'a movie theatre', 'a car wash', 'a hardware store']) }; }, parts: [
        { id: '5a', level: 'BEG', make: function (r, s) {
          return amtPart('What is ' + s.p.his + ' hourly rate of pay?', s.w, { after: 'per hour', diag: [{ v: s.h / s.E, code: 'u1l11-flip', hint: 'Divide the pay by the hours: ' + t(c2(s.E) + '\\div ' + s.h) + '.' }, { v: s.E * s.h, code: 'u1l11-times', hint: 'A rate “per hour” means divide by the hours, not multiply.' }],
            sol: t(c2(s.E) + '\\div ' + s.h + '=' + Mt(s.w)) + ' per hour', hints: ['Unit rate = pay ÷ hours.'], text: 'wage ' + s.E + '/' + s.h });
        } },
        { id: '5b', level: 'EMG', make: function (r, s) {
          var pay2 = r2(s.H * s.w);
          return amtPart('How much would ' + s.p.he + ' earn in a ' + s.H + '-hour week?', pay2, { diag: [{ v: s.E * s.H, code: 'u1l11-hours', hint: 'Multiply the <b>hourly rate</b> (part a) by ' + s.H + ' hours, not the ' + MM(s.E) + '.' }, { v: s.E + s.H, code: 'u1l11-hours', hint: 'Multiply the hourly rate by the hours.' }, { v: s.E / s.H, code: 'u1l11-hours', hint: 'Find the hourly rate first (part a), then multiply by ' + s.H + '.' }],
            sol: 'Hourly rate: ' + t(Mt(s.w)) + '<br>' + t(s.H + '\\times ' + c2(s.w) + '=' + Mt(pay2)), hints: ['Use the hourly rate from part (a).', 'Pay = hours × hourly rate.'], text: 'week ' + s.H });
        } },
        { id: '5c', level: 'EMG', make: function (r, s) {
          var v = find(function () { return [r.int(30, 80) * 10, r.int(13, 25) / 2]; }, function (v) { var L = v[0] * v[1] / 100; return decPl(L) <= 1 && !(v[0] === 600 && v[1] === 9) && !(v[0] === 450 && v[1] === 8); }, [560, 8.5]);
          var D = v[0], e = v[1], L = q(D * e / 100), veh = r.pick(['SUV', 'truck', 'minivan', 'car']);
          return amtPart(cap(s.p.his) + ' family’s ' + veh + ' used ' + t(N(L)) + ' L of gas to drive ' + t(N(D)) + ' km. What is its fuel economy in L/100 km?', e, { dp: 1, plain: true, after: 'L/100 km',
            diag: [{ v: D / L * 100, code: 'u1l11-flip', hint: 'L/100 km = litres ÷ km × 100 (litres on top).' }, { v: L / D, code: 'u1l11-no-x100', hint: 'That’s litres per 1 km. Multiply by 100 for litres per 100 km.' }, { v: D / L, code: 'u1l11-flip', hint: 'That’s km per litre. Fuel economy here is litres per 100 km: litres ÷ km × 100.' }],
            sol: t(N(L) + '\\div ' + N(D) + '\\times 100=' + N(e)) + ' L/100 km', hints: ['L/100 km = litres ÷ km × 100.'], text: 'fuel ' + L + '/' + D });
        } }] },
      { num: '6', stem: function (s) { return s.c.intro + ' ' + s.n.map(function (n, j) { return n + ' ' + s.c.units + ' for ' + MM(s.pr[j]); }).join(', ').replace(/, ([^,]*)$/, ' and $1') + '.'; },
        shared: function (r) {
          var c = r.pick([{ intro: 'Laundry detergent comes in three sizes. The number of loads is printed on each jug.', item: 'jug', unit: 'load', units: 'loads' }, { intro: 'Dishwasher pods come in three box sizes.', item: 'box', unit: 'pod', units: 'pods' }]);
          var v = find(function () {
            var n = [r.pick([20, 24, 28, 32]), r.pick([48, 52, 60, 64]), r.pick([80, 90, 96, 100])], u2 = r.int(24, 32) / 100, u1 = u2 + r.int(3, 7) / 100, u3 = u2 + r.int(15, 40) / 1000;
            var pr = [u1, u2, u3].map(function (u, i) { return q(Math.max(2, Math.round(n[i] * u)) - r.pick([0.01, 0.03, 0.51])); });
            return { n: n, pr: pr, up: pr.map(function (p, i) { return p / n[i]; }) };
          }, function (v) { var a = v.up.map(function (x) { return rd(x, 3); }); return a[1] < a[2] - 0.008 && a[2] < a[0] - 0.008; }, { n: [24, 52, 80], pr: [7.99, 14.97, 24.99], up: [7.99 / 24, 14.97 / 52, 24.99 / 80] });
          v.c = c; return v;
        }, parts: [
        { id: '6ai', sub: 'a i', level: 'EMG', make: function (r, s) {
          var cols = s.n.map(function (n) { return '\\text{' + n + ' ' + s.c.units + '}'; }), rows = ['\\text{Price}', '\\text{Price per ' + s.c.unit + '}'];
          var blanks = s.n.map(function (n, j) { return { where: 'cell', i: 1, j: j, name: n + ' ' + s.c.units, chk: upChk(s.up[j], [{ v: n / s.pr[j], code: 'u1l11-flip', hint: 'Price per ' + s.c.unit + ' = price ÷ number of ' + s.c.units + ': ' + t(c2(s.pr[j]) + '\\div ' + n) + '.' }, { v: s.pr[j] * n, code: 'u1l11-times', hint: 'Divide the price by the number of ' + s.c.units + '.' }]) }; });
          var p = PK.tablePart('Complete the table: find the price per ' + s.c.unit + ' for each ' + s.c.item + ' (to a tenth of a cent).', { rows: rows, cols: cols, cells: [s.pr.map(Mt), [null, null, null]], corner: '\\text{' + cap(s.c.item) + '}', keys: 'pctkit-money', help: 'Tap a box, then type the price per ' + s.c.unit + ' (no $ needed), e.g. 0.333.' },
            PK.tableChk(blanks), { rows: rows, cols: cols, cells: [s.pr.map(Mt), s.up.map(function (x) { return rd(x, 3).toFixed(3); })] },
            br(s.n.map(function (n, j) { return t(c2(s.pr[j]) + '\\div ' + n + '=' + raw5(s.up[j]) + '\\approx\\$' + rd(s.up[j], 3).toFixed(3)); })),
            ['Price per ' + s.c.unit + ' = price ÷ number of ' + s.c.units + '.', 'Keep 3 decimals so you can compare.'], 'per load table');
          p.bad = [{ rows: rows, cols: cols, cells: [s.pr.map(Mt), s.n.map(function (n, j) { return rd(n / s.pr[j], 3).toFixed(3); })] }];
          return p;
        } },
        { id: '6aii', sub: 'a ii', level: 'BEG', make: function (r, s) {
          var nm = function (j) { return 'the ' + s.n[j] + '-' + s.c.unit + ' ' + s.c.item; }, u = function (j) { return t('\\$' + rd(s.up[j], 3).toFixed(3)); };
          return P.mc(r, 'Which ' + s.c.item + ' is the best buy?', [{ html: cap(nm(1)), right: true },
            { html: cap(nm(0)), why: 'It has the lowest price, but the <b>highest</b> price per ' + s.c.unit + ' (' + u(0) + '). Compare the unit prices.' },
            { html: cap(nm(2)), why: 'The biggest ' + s.c.item + ' isn’t always the best buy: its price per ' + s.c.unit + ' is ' + u(2) + '. Compare the unit prices.' }],
            'The best buy has the lowest price per ' + s.c.unit + ': ' + nm(1) + ' at ' + u(1) + ' (the others: ' + u(0) + ' and ' + u(2) + ').', ['Use the price per ' + s.c.unit + ' from part (a).'], 'best jug');
        } },
        { id: '6b', sub: 'b', level: 'EMG', make: function (r, s) {
          var u = function (j) { return t('\\$' + rd(s.up[j], 3).toFixed(3)); };
          return reasonMC(r, 'Is the biggest ' + s.c.item + ' always the best buy? Use the table.', 'No. The ' + s.n[2] + '-' + s.c.unit + ' ' + s.c.item + ' costs more per ' + s.c.unit + ' (' + u(2) + ') than the ' + s.n[1] + '-' + s.c.unit + ' ' + s.c.item + ' (' + u(1) + '). Always check the unit price.',
            [['Yes. A bigger ' + s.c.item + ' always costs less per ' + s.c.unit + '.', 'Look at the table: is the ' + s.n[2] + '-' + s.c.unit + ' ' + s.c.item + ' the cheapest per ' + s.c.unit + '?'],
              ['Yes. The ' + s.n[2] + '-' + s.c.unit + ' ' + s.c.item + ' has the most ' + s.c.units + ', so it is the best buy.', 'More ' + s.c.units + ' doesn’t make it the best buy. Compare the price per ' + s.c.unit + '.'],
              ['No. The ' + s.n[0] + '-' + s.c.unit + ' ' + s.c.item + ' is the best buy because it costs the least.', 'It has the lowest total price, but the highest price per ' + s.c.unit + '.']],
            'No. The ' + s.n[2] + '-' + s.c.unit + ' ' + s.c.item + ' (' + u(2) + ' per ' + s.c.unit + ') costs more per ' + s.c.unit + ' than the ' + s.n[1] + '-' + s.c.unit + ' ' + s.c.item + ' (' + u(1) + '). Always check the unit price.', ['Compare the biggest ' + s.c.item + '’s price per ' + s.c.unit + ' with the others.'], 'biggest always');
        } },
        { id: '6c', sub: 'c', level: 'BEG', make: function (r, s) {
          return reasonMC(r, 'Which is a good reason that is <b>not</b> about price for buying the ' + s.n[0] + '-' + s.c.unit + ' ' + s.c.item + '?', 'It is smaller and lighter, so it is easier to carry and to store in a small apartment.',
            [['It has the lowest price per ' + s.c.unit + '.', 'That’s about price — and it isn’t true (look at the table). Think about carrying, storing or trying the brand.'],
              ['A small ' + s.c.item + ' is always the best buy.', 'Not true, and it is about price. Think about carrying, storing or trying the brand.'],
              ['It cleans more ' + s.c.units + ' than the others.', 'It has the fewest ' + s.c.units + '. Think about carrying, storing or trying the brand.']],
            'Possible reasons: it is lighter and easier to carry and store; you want to try the brand first; you have less money to spend today.', ['A reason that is not about price: think about size, carrying, storing, or trying it first.'], 'reason small');
        } }] },
      { num: '7', stem: function (s) { return cap(s.it[0]) + ' are ' + MM(s.e) + ' each, or ' + s.k + ' for ' + MM(s.D) + '.'; },
        shared: function (r) {
          var it = r.pick([['cans of soup', 'can'], ['cans of tuna', 'can'], ['bottles of sports drink', 'bottle'], ['boxes of pasta', 'box'], ['jars of salsa', 'jar']]);
          return find(function () { var e = r.pick([1.49, 1.59, 1.69, 1.79, 1.89, 1.99, 2.19, 2.29, 2.49]), k = r.pick([3, 4, 4, 5]), D = r.int(3, 11); return { it: it, e: e, k: k, D: D, c: D / k, m: k * r.pick([2, 2, 3]) }; },
            function (v) { return isInt(v.c * 100) && v.c <= v.e - 0.15 && v.c >= v.e - 0.6; }, { it: it, e: 1.79, k: 4, D: 6, c: 1.5, m: 8 });
        }, parts: [
        { id: '7a', level: 'BEG', make: function (r, s) {
          return amtPart('What is the price of one ' + s.it[1] + ' with the deal?', s.c, { diag: [{ v: s.k / s.D, code: 'u1l11-flip', hint: 'Divide the price by the number of ' + s.it[0].split(' ')[0] + ': ' + t(c2(s.D) + '\\div ' + s.k) + '.' }, { v: s.e - s.c, code: 'u1l11-per-item', hint: 'That’s how much you save on one. The question asks for the deal price of one.' }, { v: s.D * s.k, code: 'u1l11-times', hint: 'Divide the deal price by ' + s.k + '.' }],
            sol: t(c2(s.D) + '\\div ' + s.k + '=' + Mt(s.c)), hints: ['Deal price ÷ number in the deal.'], text: 'deal one ' + s.D + '/' + s.k });
        } },
        { id: '7b', level: 'EMG', make: function (r, s) {
          var reg = r2(s.m * s.e), dl = r2(s.m / s.k * s.D), sv = r2(reg - dl);
          return amtPart('How much do you save on ' + s.m + ' ' + s.it[0].split(' ')[0] + ' by using the deal?', sv, { diag: [{ v: reg, code: 'u1l11-regular', hint: 'That’s the regular cost. Subtract the deal cost from it.' }, { v: dl, code: 'u1l11-deal-cost', hint: 'That’s the deal cost. Savings = regular cost − deal cost.' }, { v: s.e - s.c, code: 'u1l11-per-item', hint: 'That’s the saving on one. Find it for all ' + s.m + '.' }, { v: reg - s.D, code: 'u1l11-deal-cost', hint: s.m + ' is ' + (s.m / s.k) + ' deals of ' + s.k + ', so the deal cost is ' + t((s.m / s.k) + '\\times ' + c2(s.D)) + '.' }],
            sol: 'Regular: ' + t(s.m + '\\times ' + c2(s.e) + '=' + Mt(reg)) + '<br>Deal: ' + t((s.m / s.k) + '\\times ' + c2(s.D) + '=' + Mt(dl)) + '<br>Saving: ' + t(c2(reg) + '-' + c2(dl) + '=' + Mt(sv)), hints: ['Find the regular cost and the deal cost of ' + s.m + '.', 'Savings = regular − deal.'], text: 'deal save ' + s.m });
        } }] },
      { num: '8', stem: function (s) { return 'An electronics store pays ' + MM(s.C) + ' for ' + s.it + ' and sells ' + (s.pl ? 'them' : 'it') + ' for ' + MM(s.S) + '.'; },
        shared: function (r) {
          var it = r.pick([['a pair of headphones', 1], ['a gaming headset', 0], ['a phone charger', 0], ['a Bluetooth speaker', 0], ['a pair of earbuds', 1]]);
          return find(function () { var C = r.int(18, 45) * 2, m = r.int(35, 80) / 100; return { it: it[0], pl: it[1], C: C, S: q(Math.ceil(C * (1 + m)) - 0.01) }; }, function (v) { return v.C !== 32 && v.C !== 20 && v.S > v.C * 1.3 && v.S < v.C * 1.85; }, { it: 'a pair of headphones', pl: 1, C: 64, S: 99.99 });
        }, parts: [
        { id: '8a', level: 'BEG', make: function (r, s) {
          var mk = r2(s.S - s.C);
          return amtPart('What is the markup in dollars?', mk, { diag: [{ v: s.S + s.C, code: 'value', hint: 'Markup = selling price − cost (subtract).' }],
            sol: t(c2(s.S) + '-' + c2(s.C) + '=' + Mt(mk)), hints: ['Markup = selling (retail) price − cost.'], text: 'markup $' });
        } },
        { id: '8b', level: 'EMG', make: function (r, s) {
          var mk = q(s.S - s.C), x = mk / s.C * 100;
          return amtPart('What is the markup percent, to the nearest tenth of a percent?', x, { dp: 1, pct: true, exact: x, word: 'the nearest tenth of a percent',
            diag: [{ v: mk / s.S * 100, code: 'u1l11-div-new', hint: 'Markup percent is out of the <b>cost</b>: divide by ' + MM(s.C) + ', not the selling price.' }, { v: s.S / s.C * 100, code: 'u1l11-ratio-pct', hint: 'Use the markup (' + MM(mk) + '), not the selling price: markup ÷ cost × 100.' }, { v: mk, code: 'u1l11-pct-dollars', hint: 'That’s the markup in dollars. Divide by the cost and multiply by 100.' }],
            sol: 'Markup: ' + t(Mt(mk)) + '<br>' + t(c2(mk) + '\\div ' + c2(s.C) + '\\times 100' + toN(x, 1) + '\\%'), hints: ['Markup % = markup ÷ cost × 100.'], text: 'markup %' });
        } },
        { id: '8c', level: 'BEG', make: function (r, s) {
          var T = s.S * 1.05;
          return amtPart('What does a customer in Alberta pay, with 5% GST?', T, { exact: T, diag: GST_DIAG(s.S).concat([{ v: s.C * 1.05, code: 'u1l11-tax-original', hint: 'The customer pays tax on the <b>selling</b> price, ' + MM(s.S) + ', not on the store’s cost.' }]),
            sol: t(c2(s.S) + '\\times 1.05' + toM(T)), hints: ['Total with GST = price × 1.05.'], text: 'GST headphones' });
        } }] },
      { num: '9', stem: '', parts: [{ id: '9', level: 'EMG', make: function (r) { return receiptPart(r); } }] },
      { num: '10', stem: function (s) { return 'A ' + s.it + ' regularly sells for ' + MM(s.R) + '. It is on sale for ' + s.d + '% off.'; },
        shared: function (r) {
          var R = q(r.int(30, 120) * 10 - 0.01), d = r.pick([15, 20, 20, 25, 30, 10]);
          return { it: r.pick(['TV', 'laptop', 'gaming console', 'fridge', 'mountain bike']), R: R, d: d, Sx: Math.round(R * 100) * (100 - d) / 10000, pv: r.pick([{ n: 'British Columbia', w: '5% GST and 7% PST, 12% in all', rate: 12 }, { n: 'British Columbia', w: '5% GST and 7% PST, 12% in all', rate: 12 }, { n: 'Saskatchewan', w: '5% GST and 6% PST, 11% in all', rate: 11 }, { n: 'Manitoba', w: '5% GST and 7% PST, 12% in all', rate: 12 }]) };
        }, parts: [
        { id: '10a', level: 'BEG', make: function (r, s) {
          return amtPart('What is the sale price?', s.Sx, { exact: s.Sx, diag: [{ v: s.R * s.d / 100, code: 'u1l11-gave-discount', hint: 'That’s the discount. Take it off the regular price (or multiply by ' + t(pay(s.d)) + ').' }, { v: s.R - s.d, code: 'u1l11-pct-dollars', hint: s.d + '% off is not ' + t('\\$' + s.d) + ' off. Multiply by ' + t(pay(s.d)) + '.' }, { v: s.R * (1 + s.d / 100), code: 'u1l11-added-pct', hint: 'A sale makes the price go <b>down</b>: multiply by ' + t(pay(s.d)) + '.' }],
            sol: 'You pay ' + (100 - s.d) + '%: ' + t(c2(s.R) + '\\times ' + pay(s.d) + toM(s.Sx)), hints: ['Sale price = regular price × (1 − rate).'], text: 'TV sale' });
        } },
        { id: '10b', level: 'EMG', make: function (r, s) {
          var T = s.Sx * 1.05;
          return amtPart('What is the total with GST in Alberta?', T, { exact: T, alts: [r2(s.Sx) * 1.05], diag: [{ v: s.R * 1.05, code: 'u1l11-tax-original', hint: 'Tax goes on the <b>sale</b> price, not the regular price.' }, { v: s.Sx * 0.05, code: 'u1l11-tax-only', hint: 'That’s the GST alone. Multiply the sale price by 1.05.' }, { v: s.Sx * 1.5, code: 'u1l11-five-half', hint: t('5\\%=0.05') + ': multiply by ' + t('1.05') + '.' }],
            sol: t(raw5(s.Sx).replace('\\ldots', '') + '\\times 1.05' + toM(T)), hints: ['Tax goes on the sale price.', 'Multiply the sale price by 1.05.'], text: 'TV AB' });
        } },
        { id: '10c', level: 'EMG', make: function (r, s) {
          var m = 1 + s.pv.rate / 100, T = s.Sx * m;
          return amtPart('What is the total in ' + s.pv.n + ' (' + s.pv.w + ')?', T, { exact: T, alts: [r2(s.Sx) * m], diag: [{ v: s.R * m, code: 'u1l11-tax-original', hint: 'Tax goes on the <b>sale</b> price, not the regular price.' }, { v: s.Sx * 1.05 * (1 + (s.pv.rate - 5) / 100), code: 'u1l11-compound', hint: 'Both taxes are on the sale price, so add the rates: ' + s.pv.rate + '%, and multiply by ' + t(mult(s.pv.rate)) + '.' }, { v: s.Sx * s.pv.rate / 100, code: 'u1l11-tax-only', hint: 'That’s the tax alone. Multiply by ' + t(mult(s.pv.rate)) + '.' }, { v: s.Sx * 1.05, code: 'u1l11-no-tax', hint: 'That’s the Alberta total. In ' + s.pv.n + ' the tax is ' + s.pv.rate + '%.' }],
            sol: t(raw5(s.Sx).replace('\\ldots', '') + '\\times ' + mult(s.pv.rate) + toM(T)), hints: [s.pv.rate + '% tax: multiply the sale price by ' + mult(s.pv.rate) + '.'], text: 'TV prov' });
        } },
        { id: '10d', level: 'PRG', make: function (r, s) {
          var m = 1 + s.pv.rate / 100, A = r2(s.Sx * 1.05), B = r2(s.Sx * m), d = r2(B - A), S2 = r2(s.Sx);
          return amtPart('How much more does the ' + s.it + ' cost in ' + s.pv.n + ' than in Alberta?', d, { alts: [r2(S2 * m) - r2(S2 * 1.05), s.Sx * (s.pv.rate - 5) / 100, S2 * (s.pv.rate - 5) / 100],
            diag: [{ v: B, code: 'u1l11-gave-total', hint: 'That’s the ' + s.pv.n + ' total. Subtract the Alberta total from it.' }, { v: A, code: 'u1l11-gave-total', hint: 'That’s the Alberta total. Find the difference between the two totals.' }, { v: s.R * (s.pv.rate - 5) / 100, code: 'u1l11-tax-original', hint: 'Both taxes are on the <b>sale</b> price.' }, { v: s.Sx * s.pv.rate / 100, code: 'u1l11-gave-total', hint: 'That’s all the ' + s.pv.n + ' tax. Compare the two totals (or find the extra ' + (s.pv.rate - 5) + '%).' }],
            sol: t(Mt(B) + '-' + Mt(A) + '=' + Mt(d)), hints: ['Subtract the Alberta total (b) from the ' + s.pv.n + ' total (c).'], text: 'TV diff' });
        } }] },
      { num: '11', stem: function (s) { return 'A ' + s.it + ' usually sells for ' + MM(s.O) + '. One week the store raises the price to ' + MM(s.R) + '. The next week it advertises the ' + s.it + ' at “' + s.d + '% off!”'; },
        shared: function (r) {
          var c = r.pick([{ u: 25, d: 20, k: 'same' }, { u: 25, d: 20, k: 'same' }, { u: 25, d: 20, k: 'same' }, { u: 50, d: 20, k: 'more' }, { u: 50, d: 25, k: 'more' }, { u: 20, d: 25, k: 'less' }, { u: 10, d: 20, k: 'less' }]);
          var O = r.pick([32, 36, 44, 48, 56, 60, 64, 72, 80]), R = O * (1 + c.u / 100);
          return { it: r.pick(['blender', 'kettle', 'toaster', 'coffee maker', 'air fryer', 'hair dryer']), O: O, R: q(R), u: c.u, d: c.d, k: c.k, S: q(R * (1 - c.d / 100)) };
        }, parts: [
        { id: '11a', level: 'EMG', make: function (r, s) {
          var ch = q(s.R - s.O);
          return amtPart('What is the percent increase from ' + MM(s.O) + ' to ' + MM(s.R) + '?', s.u, { dp: 1, pct: true, word: 'the nearest tenth of a percent',
            diag: [{ v: ch / s.R * 100, code: 'u1l11-div-new', hint: 'Divide by the <b>original</b> (old) price, ' + MM(s.O) + ', not the new price.' }, { v: s.R / s.O * 100, code: 'u1l11-ratio-pct', hint: 'Use the <b>change</b> (' + MM(ch) + '): change ÷ original × 100.' }, { v: ch, code: 'u1l11-pct-dollars', hint: 'That’s the increase in dollars. Divide it by the original price and multiply by 100.' }],
            sol: 'Increase: ' + t(c2(s.R) + '-' + c2(s.O) + '=' + Mt(ch)) + '<br>' + t(c2(ch) + '\\div ' + c2(s.O) + '\\times 100=' + s.u + '\\%'), hints: ['Percent increase = change ÷ original × 100.'], text: 'blender inc' });
        } },
        { id: '11b', level: 'BEG', make: function (r, s) {
          return amtPart('What is the “sale” price?', s.S, { diag: [{ v: s.R * s.d / 100, code: 'u1l11-gave-discount', hint: 'That’s the discount. Take it off ' + MM(s.R) + '.' }, { v: s.O * (1 - s.d / 100), code: 'u1l11-tax-original', hint: 'The ' + s.d + '% comes off the <b>raised</b> price, ' + MM(s.R) + ', the price the store advertised from.' }, { v: s.R - s.d, code: 'u1l11-pct-dollars', hint: s.d + '% off is not ' + t('\\$' + s.d) + ' off. Multiply by ' + t(pay(s.d)) + '.' }],
            sol: t(c2(s.R) + '\\times ' + pay(s.d) + '=' + Mt(s.S)), hints: ['The ' + s.d + '% comes off the raised price.', 'Multiply by ' + pay(s.d) + '.'], text: 'blender sale' });
        } },
        { id: '11c', level: 'EMG', make: function (r, s) {
          var diff = r2(Math.abs(s.O - s.S));
          var opts = [
            { k: 'same', html: 'No. The sale price is the same as the usual ' + MM(s.O) + '. The store raised the price first, so “' + s.d + '% off” saves nothing.' },
            { k: 'more', html: 'No. The sale price is <b>more</b> than the usual ' + MM(s.O) + ', so you pay more than before.' },
            { k: 'less', html: 'Only a little. It is ' + (s.k === 'less' ? MM(diff) : 'a few dollars') + ' below the usual price — much less than ' + s.d + '% off the usual price.' },
            { k: 'yes', html: 'Yes. It is ' + s.d + '% off, so you save ' + s.d + '% of the usual price.' }];
          var why = 'Compare the sale price, ' + MM(s.S) + ', with the <b>usual</b> price, ' + MM(s.O) + '.';
          return P.mc(r, 'Is the sale really a deal?', opts.map(function (o) { return { html: o.html, right: o.k === s.k, why: o.k === s.k ? null : why }; }),
            'Sale price ' + MM(s.S) + ' vs. the usual ' + MM(s.O) + ': ' + (s.k === 'same' ? 'the same. The store raised the price first, so the sale saves nothing.' : s.k === 'more' ? 'the sale price is ' + MM(diff) + ' <b>more</b>. The raise was bigger than the discount.' : 'only ' + MM(diff) + ' less, not ' + s.d + '% of the usual price.'),
            ['Compare the sale price with the usual price, not the raised price.'], 'blender deal', true);
        } }] },
      { num: '12', stem: function (s) { return s.what + ' cost ' + MM(s.p) + ' each. A store offers two promotions, and you may use only one.<br><b>Promotion A</b>: ' + s.A + '. &nbsp; <b>Promotion B</b>: ' + s.x + '% off everything.'; },
        shared: function (r) {
          var n = r.pick([3, 3, 4]), x = n === 3 ? r.pick([20, 25, 30]) : r.pick([15, 20]);
          return { what: r.pick(['T-shirts', 'Hoodies', 'Ball caps', 'Water bottles', 'Phone cases']), p: r.pick([16, 18, 20, 22, 24, 25, 28, 30, 32]), n: n, x: x, A: n === 3 ? 'Buy 2, get the 3rd free' : 'Buy 3, get the 4th free' };
        }, parts: [12, 13].map(function (num, i) {
          return { id: '12' + 'ab'.charAt(i), level: 'EMG', make: function (r, s) {
            var k = s.n - i, A = (i === 0 ? s.n - 1 : k) * s.p, B = q(k * s.p * (1 - s.x / 100)), cheapA = A < B, nm = /^T-/.test(s.what) ? s.what : s.what.toLowerCase();
            var specs = [mfld('Promotion A costs', A, { name: 'Promotion A', diag: i === 0 ? [{ v: k * s.p, code: 'u1l11-no-free', hint: 'With ' + s.n + ' ' + nm + ', one is free: you pay for ' + (s.n - 1) + '.' }] : [{ v: (k - 1) * s.p, code: 'u1l11-free-wrong', hint: 'You need ' + s.n + ' ' + nm + ' to get one free. With only ' + k + ', you pay for all ' + k + '.' }] }),
              mfld('Promotion B costs', B, { name: 'Promotion B', diag: [{ v: k * s.p * s.x / 100, code: 'u1l11-gave-discount', hint: 'That’s the discount. You pay ' + (100 - s.x) + '%: multiply by ' + t(pay(s.x)) + '.' }, { v: k * s.p - s.x, code: 'u1l11-pct-dollars', hint: s.x + '% off is not ' + t('\\$' + s.x) + ' off.' }, { v: s.p * (1 - s.x / 100), code: 'u1l11-one-item', hint: 'That’s for one. Find the cost of ' + k + '.' }] }),
              wfld('Cheaper promotion:', 'A or B', cheapA ? 'A' : 'B', [cheapA ? 'a' : 'b'], [cheapA ? 'b' : 'a'], 'Compare your two costs: the cheaper one is the lower cost.', 'Type A or B.', 'Which is cheaper')];
            return fieldsPart('Which promotion is cheaper if you want ' + (i ? '<b>only</b> ' : '') + k + ' ' + nm + '? Show both costs.', specs,
              'A: ' + (i === 0 ? 'you pay for ' + (s.n - 1) + ': ' + t((s.n - 1) + '\\times ' + c2(s.p) + '=' + Mt(A)) : 'no free one with only ' + k + ': ' + t(k + '\\times ' + c2(s.p) + '=' + Mt(A))) + '<br>B: ' + t(k + '\\times ' + c2(s.p) + '\\times ' + pay(s.x) + '=' + Mt(B)) + '<br>Promotion ' + (cheapA ? 'A' : 'B') + ' is cheaper for ' + k + '.',
              ['Promotion A: how many do you actually pay for?', 'Promotion B: multiply the full cost by ' + pay(s.x) + '.'], 'promo ' + k);
          } };
        }).concat([{ id: '12c', level: 'BEG', make: function (r, s) {
          return reasonMC(r, 'What does this tell you about choosing a promotion?', 'The better promotion depends on how many you really need. A “free” item only saves money if you would have bought it anyway.',
            [['A “free” item always makes Promotion A the better deal.', 'Look at part (b): with only ' + (s.n - 1) + ', Promotion A gives nothing free.'], ['A percent off is always better than a free item.', 'Look at part (a): for ' + s.n + ' items, Promotion A was cheaper.'], ['The two promotions always cost the same.', 'Look at your costs in parts (a) and (b).']],
            'The better promotion depends on how many you really need. “Free” items only save money if you would have bought them anyway.', ['Compare the answers to (a) and (b).'], 'promo lesson');
        } }]) },
      { num: '13', stem: 'A bank shows these rates, in Canadian dollars for 1 unit of each currency.' + BOARD13_HTML,
        shared: function (r) {
          var cur = r.pick(['EUR', 'EUR', 'USD', 'GBP']), others = ['USD', 'EUR', 'GBP'].filter(function (c) { return c !== cur; });
          var p = person(r), sib = r.pick(['sister', 'brother', 'cousin']);
          return { cur: cur, cur2: r.pick(others), p: p, sib: sib, place: r.pick(TRIP[cur]), F: find(function () { return r.int(3, 12) * 50; }, function (f) { return !(cur === 'USD' && f === 300); }, 250),
            G: find(function () { return r.int(3, 16) * 5; }, function (g) { return !(cur === 'USD' && g === 40); }, 35), C: r.int(6, 20) * 50 };
        }, parts: [
        { id: '13a', level: 'BEG', make: function (r, s) {
          var b = BOARD13[s.cur], x = s.F * b[1];
          return amtPart(s.p.n + ' buys ' + fAmt(s.F, s.cur) + ' in cash for a trip to ' + s.place + '. How much does it cost ' + (s.p.he === 'she' ? 'her' : 'him') + ' in Canadian dollars?', x, { after: 'CAD',
            diag: [{ v: s.F * b[0], code: 'u1l11-buy-rate', hint: 'When <b>you buy</b> foreign cash, the bank is <b>selling</b> it: use the “We sell” rate, ' + t(N(b[1])) + '.' }, { v: s.F / b[1], code: 'u1l11-divided', hint: 'The rate is CAD for 1 ' + CURN[s.cur][0] + ', so multiply the number of ' + CURN[s.cur][1] + ' by it.' }],
            sol: 'The bank sells ' + CURN[s.cur][1] + ' at ' + t(N(b[1])) + '.<br>' + t(N(s.F) + '\\times ' + N(b[1]) + toM(x)) + ' CAD', hints: ['You are buying, so the bank is selling: use “We sell”.', 'Multiply the amount by the rate.'], text: 'buy ' + s.cur });
        } },
        { id: '13b', level: 'BEG', make: function (r, s) {
          var b = BOARD13[s.cur], x = s.G * b[0];
          return amtPart(cap(s.p.he) + ' comes home with ' + fAmt(s.G, s.cur) + ' and sells them back to the bank. How much does ' + s.p.he + ' get?', x, { after: 'CAD',
            diag: [{ v: s.G * b[1], code: 'u1l11-sell-rate', hint: 'When <b>you sell</b> back, the bank is <b>buying</b>: use the “We buy” rate, ' + t(N(b[0])) + '.' }, { v: s.G / b[0], code: 'u1l11-divided', hint: 'Multiply the number of ' + CURN[s.cur][1] + ' by the rate.' }],
            sol: 'The bank buys ' + CURN[s.cur][1] + ' at ' + t(N(b[0])) + '.<br>' + t(N(s.G) + '\\times ' + N(b[0]) + toM(x)) + ' CAD', hints: ['You are selling, so the bank is buying: use “We buy”.'], text: 'sell back ' + s.cur });
        } },
        { id: '13c', level: 'EMG', make: function (r, s) {
          var b = BOARD13[s.cur], df = q(b[1] - b[0]), cn = CURN[s.cur][0];
          return reasonMC(r, 'Why does ' + s.p.n + ' get back less for each ' + cn + ' than ' + s.p.he + ' paid?', 'The bank sells at a higher rate than it buys. The difference (' + MM(df) + ' a ' + cn + ') is how the bank makes money on the exchange.',
            [['The ' + cn + ' lost value while ' + s.p.he + ' was away.', 'The rates on this board didn’t change. Look at the two columns.'], ['The bank charges GST when you sell money back.', 'There is no GST on changing money. Look at the two columns of the board.'], ['The bank made a mistake: it should pay the “We sell” rate.', 'No — when you sell back, the bank is buying. Why are the two rates different?']],
            'The bank sells ' + CURN[s.cur][1] + ' at ' + t(N(b[1])) + ' and buys them back at ' + t(N(b[0])) + '. The difference, ' + MM(df) + ' a ' + cn + ', is how the bank makes money.', ['Compare the “We buy” and “We sell” rates.'], 'why less');
        } },
        { id: '13d', level: 'ADV', make: function (r, s) {
          var b = BOARD13[s.cur2], x = s.C / b[1], u = s.cur2 === 'USD';
          return amtPart(cap(s.p.his) + ' ' + s.sib + ' changes ' + MM(s.C) + ' CAD into ' + CURN[s.cur2][1] + ' at this bank. How many ' + CURN[s.cur2][1] + ' does ' + (s.sib === 'brother' ? 'he' : s.sib === 'sister' ? 'she' : 'the cousin') + ' get?', x,
            { before: u ? '$' : '', after: u ? 'USD' : CURN[s.cur2][1].replace('British ', ''), ansTex: (u ? '\\$' : '') + c2(x) + '\\text{ ' + (u ? 'USD' : CURN[s.cur2][1]) + '}',
              diag: [{ v: s.C * b[1], code: 'u1l11-multiplied', hint: 'You have Canadian dollars and the rate is CAD for 1 ' + CURN[s.cur2][0] + ', so <b>divide</b>. (One ' + CURN[s.cur2][0] + ' is worth more than a dollar, so you get fewer of them.)' }, { v: s.C / b[0], code: 'u1l11-buy-rate', hint: 'The bank is <b>selling</b> ' + CURN[s.cur2][1] + ' to the ' + s.sib + ': use the “We sell” rate, ' + t(N(b[1])) + '.' }, { v: s.C * b[0], code: 'u1l11-multiplied', hint: 'Use the selling rate ' + t(N(b[1])) + ', and divide.' }],
              sol: 'Buying ' + CURN[s.cur2][1] + ', so use the selling rate ' + t(N(b[1])) + '. Canadian to ' + CURN[s.cur2][1] + ': divide.<br>' + t(N(s.C) + '\\div ' + N(b[1]) + toN(x, 2)) + ' ' + CURN[s.cur2][1], hints: ['Which rate does the bank use when it sells you foreign money?', 'The rate is CAD for 1 unit and you have CAD, so divide.'], text: 'CAD to ' + s.cur2 });
        } }] },
      { num: '14', stem: function (s) { return 'A ' + s.it + ' costs ' + MM(s.U) + ' USD on a US website, plus ' + MM(s.sh) + ' USD shipping (assume no duty or other fees). The same ' + s.it + ' costs ' + MM(s.K) + ' plus 5% GST in a Calgary store. Use ' + t('1\\text{ USD}=1.38\\text{ CAD}') + '.'; },
        shared: function (r) {
          var wantUS = r.chance(0.4);
          return find(function () { var U = r.int(70, 160), sh = r.pick([12, 15, 18, 20, 25]), K = q(r.int(100, 260) - 0.01); return { it: r.pick(['pair of boots', 'winter jacket', 'pair of hockey skates', 'backpack', 'pair of runners']), U: U, sh: sh, K: K, T: U + sh, US: (U + sh) * 1.38, CA: K * 1.05 }; },
            function (v) { var d = r2(v.US) - r2(v.CA); return (wantUS ? d < -2 : d > 2) && Math.abs(d) <= 25; }, { it: 'pair of boots', U: 119, sh: 18, K: 169.99, T: 137, US: 137 * 1.38, CA: 169.99 * 1.05 });
        }, parts: [
        { id: '14a', level: 'EMG', make: function (r, s) {
          var lo = Math.ceil(s.T * 1.3 - 2), hi = Math.floor(s.T * 1.45 + 2), key = Math.min(hi, Math.max(lo, Math.round(s.T / 10) * 14));
          var p = { prompt: 'Estimate the US total in Canadian dollars in your head.', input: { type: 'fields', fields: [{ label: 'Estimate:', name: 'Estimate', before: 'about $', after: 'CAD' }] }, check: K.fields([estChk(s.T, { part: s.U, partHint: 'Add the shipping first: the US total is ' + t(s.U + '+' + s.sh + '=' + s.T) + ' USD.' })], { labels: [''] }), key: [String(key)],
            answer: 'about ' + t('\\$' + key) + ' (any estimate from ' + t('\\$' + lo) + ' to ' + t('\\$' + hi) + ' is fine)', solution: 'US total: ' + t(s.U + '+' + s.sh + '=' + s.T) + ', about ' + t(Math.round(s.T / 10) * 10) + '.<br>' + t(Math.round(s.T / 10) * 10 + '\\times 1.4=' + N(Math.round(s.T / 10) * 14)) + '. About ' + t('\\$' + Math.round(s.T / 10) * 14) + '.',
            hints: ['Add the shipping, then round the US total.', 'Each US dollar is about $1.40 CAD: multiply by about 1.4 (or add about a third).'], text: 'boots estimate' };
          p.bad = [[String(s.T)], [String(Math.round(s.T / 1.38))]];
          return p;
        } },
        { id: '14b', level: 'PRG', make: function (r, s) {
          return fieldsPart('Find the exact cost of each choice in Canadian dollars.', [
            mfld('US website (CAD):', s.US, { name: 'US website', diag: [{ v: s.U * 1.38, code: 'u1l11-no-ship', hint: 'Add the ' + MM(s.sh) + ' shipping before you convert.' }, { v: s.T / 1.38, code: 'u1l11-divided', hint: '1 USD = 1.38 CAD starts with USD, the currency you have: multiply.' }, { v: s.T, code: 'u1l11-no-convert', hint: 'Change the US total to Canadian dollars: multiply by 1.38.' }, { v: s.T * 1.38 * 1.05, code: 'u1l11-gst-us', hint: 'The question says no duty or other fees on the US order: just change the US total to CAD.' }] }),
            mfld('Calgary store (with GST):', s.CA, { name: 'Calgary store', exact: s.CA, diag: [{ v: s.K, code: 'u1l11-no-tax', hint: 'Add the 5% GST: multiply by 1.05.' }, { v: s.K * 0.05, code: 'u1l11-tax-only', hint: 'That’s the GST alone. Multiply the price by 1.05.' }] })],
            'US: ' + t(s.U + '+' + s.sh + '=' + s.T) + ' USD; ' + t(s.T + '\\times 1.38' + toM(s.US)) + ' CAD<br>Calgary: ' + t(c2(s.K) + '\\times 1.05' + toM(s.CA)), ['US: add the shipping, then multiply by 1.38.', 'Calgary: multiply by 1.05 for the GST.'], 'boots exact');
        } },
        { id: '14ci', sub: 'c i', level: 'MAS', make: function (r, s) {
          var a = r2(s.US), b = r2(s.CA), us = a < b, d = r2(Math.abs(a - b));
          return fieldsPart('Which is cheaper, and by how much?', [
            wfld('Cheaper:', 'US or Calgary', us ? 'US website' : 'Calgary', us ? ['us', 'usa', 'website', 'web', 'online', 'internet', 'american', 'unitedstates'] : ['calgary', 'local', 'canada', 'alberta'], us ? ['calgary', 'local', 'canada', 'alberta'] : ['us', 'usa', 'website', 'web', 'online', 'internet', 'american', 'unitedstates'], 'Compare the two costs in Canadian dollars from part (b).', 'Type US or Calgary.', 'Which is cheaper'),
            mfld('by', d, { name: 'How much cheaper', alts: [Math.abs(s.US - s.CA)], diag: [{ v: Math.abs(s.US - s.K), code: 'u1l11-no-tax', hint: 'Use the Calgary price <b>with GST</b>.' }, { v: Math.abs(s.T - s.K * 1.05), code: 'u1l11-no-convert', hint: 'Compare both in Canadian dollars: change the US total first.' }, { v: Math.abs(s.U * 1.38 - s.CA), code: 'u1l11-no-ship', hint: 'Include the shipping in the US cost.' }, { v: a + b, code: 'u1l11-gave-total', hint: 'Subtract the two costs (don’t add).' }] })],
            'US website: ' + t(Mt(a)) + '; Calgary: ' + t(Mt(b)) + '.<br>' + (us ? 'The US website' : 'Calgary') + ' is cheaper by ' + t(Mt(Math.max(a, b)) + '-' + Mt(Math.min(a, b)) + '=' + Mt(d)) + '.', ['Use both costs in Canadian dollars from part (b).', 'The difference = the bigger cost − the smaller cost.'], 'boots compare');
        } },
        { id: '14cii', sub: 'c ii', level: 'BEG', make: function (r, s) {
          return reasonMC(r, 'Which is a good reason, other than price, to buy the ' + s.it + ' in Calgary?', 'You can try it on, return it easily, and take it home today.',
            [['The Calgary price includes GST, so it is always cheaper.', 'That’s about price (and not always true). Think about trying it on, returns, or waiting for shipping.'], ['US websites never deliver to Canada.', 'They often do — the question has a shipping cost. Think about trying it on, returns, or waiting.'], ['The exchange rate is always the same.', 'That’s not a reason to buy in Calgary. Think about trying it on, returns, or waiting.']],
            'Reasons other than price: you can try it on, return it easily, and take it home today (no waiting for shipping).', ['Think about what is easier in a store than online.'], 'reason Calgary');
        } }] },

      /* ===================== Part B: Multiple Choice ===================== */
      { num: '15', section: 'Part B: Multiple Choice', stem: '', parts: [{ id: '15', level: 'BEG', make: function (r) {
        var v = find(function () { var p = r.int(2, 6), qq = r.int(2, 7), g = r.int(3, 8); return [p * g, qq * g, p, qq]; }, function (v) {
          if (v[2] >= v[3] || gcd(v[2], v[3]) !== 1 || inList([v[0], v[1]], [[36, 48]])) return false;
          var k1 = 2, k2 = v[0] - v[2] * 2; if (k2 <= k1 || v[0] - k2 <= 0) return false;
          var C = [v[0] - k1, v[1] - k1], D = [v[0] - k2, v[1] - k2];
          return !X.same(C, [v[2], v[3]]) && !X.same(D, [v[2], v[3]]) && !X.same(C, D) && !X.same(C, [v[3], v[2]]) && !X.same(D, [v[3], v[2]]);
        }, [12, 18, 2, 3]);
        var a = v[0], b = v[1], k2 = a - v[2] * 2, sub = 'Subtracting the same number from both terms does not keep the ratio. Divide both terms by the same number.';
        return P.mc(r, 'Which ratio is equivalent to ' + t(a + ':' + b) + '?', [{ html: t(v[2] + ':' + v[3]), right: true }, { html: t(v[3] + ':' + v[2]), why: 'That ratio is reversed: the first term must stay first.' }, { html: t((a - 2) + ':' + (b - 2)), why: sub }, { html: t((a - k2) + ':' + (b - k2)), why: sub }],
          'Divide both terms by ' + t(a / v[2]) + ': ' + t(a + ':' + b + '=' + v[2] + ':' + v[3]) + '.', ['Divide both terms by the same number.'], 'equiv ratio');
      } }] },
      { num: '16', stem: '', parts: [{ id: '16', level: 'BEG', make: function (r) {
        var v = find(function () { return [r.int(30, 95), r.pick([1.5, 2.5, 3.5, 2.5])]; }, function (v) { var x = v[0] / v[1]; return decPl(q(x)) <= 1 && distinct([x, v[0] / Math.floor(v[1]), v[0] * v[1], v[0] + v[1]], 0.05) && !isInt(x); }, [54, 2.5]);
        var D = v[0], T = v[1], x = q(D / T), who = r.pick([['A cyclist', 'Her'], ['A cyclist', 'His'], ['An in-line skater', 'Her'], ['A cyclist', 'Her']]);
        return P.mc(r, who[0] + ' rides ' + t(D) + ' km in ' + t(N(T)) + ' h. ' + who[1] + ' average speed is', [{ html: t(N(x) + '\\text{ km/h}'), right: true },
          { html: t(N(q(D / Math.floor(T))) + '\\text{ km/h}'), why: 'Divide by all ' + t(N(T)) + ' hours, not just ' + t(Math.floor(T)) + '.' }, { html: t(N(q(D * T)) + '\\text{ km/h}'), why: 'Speed is distance ÷ time — divide, don’t multiply.' }, { html: t(N(q(D + T)) + '\\text{ km/h}'), why: 'Speed is distance ÷ time.' }],
          t(D + '\\div ' + N(T) + '=' + N(x)) + ' km/h', ['Speed = distance ÷ time.'], 'speed');
      } }] },
      { num: '17', stem: '', parts: [{ id: '17', level: 'EMG', make: function (r) {
        var v = find(function () { return [r.pick([50, 40, 25]), r.pick([1.5, 2, 2.5, 3, 4, 5, 0.5])]; }, function (v) { return distinct([v[1] * 1000 / v[0], 1000 / v[0], v[1] * v[0], v[1] / v[0]], 0.001); }, [50, 2.5]);
        var R = v[0], G = v[1], x = q(G * 1000 / R);
        return P.mc(r, 'A chainsaw uses a ' + R + ':1 mix of gas to oil. How much oil goes with ' + t(N(G)) + ' L of gas?', [{ html: t(N(x) + '\\text{ mL}'), right: true },
          { html: t(N(q(1000 / R)) + '\\text{ mL}'), why: 'That’s the oil for 1 L. You have ' + N(G) + ' L of gas.' }, { html: t(N(q(G * R)) + '\\text{ mL}'), why: R + ':1 means ' + R + ' times as much gas as oil: divide the gas by ' + R + '.' }, { html: t(N(q(G / R)) + '\\text{ mL}'), why: 'Change the litres to millilitres first (' + t('1\\text{ L}=1000\\text{ mL}') + ').' }],
          t(N(G) + '\\text{ L}=' + N(G * 1000) + '\\text{ mL}') + '; ' + t(N(G * 1000) + '\\div ' + R + '=' + N(x)) + ' mL', ['Change L to mL first.', 'There is ' + R + ' times as much gas as oil.'], 'chainsaw');
      } }] },
      { num: '18', stem: '', parts: [{ id: '18', level: 'EMG', make: function (r) {
        var pr = r.pick([['Cereal', 'box'], ['Granola', 'bag'], ['Rice', 'bag'], ['Pasta', 'bag']]);
        var v = threeSizes(r, [[350, 400, 450, 500], [650, 700, 750, 800], [1000, 1100, 1200, 1300]], 80, 120, [1, 1, 0, 2], { s: [450, 750, 1200], pr: [4.99, 7.49, 12.99], up: [4.99 / 4.5, 7.49 / 7.5, 12.99 / 12], b: 1 });
        var nm = function (j) { return 'the ' + sz(v.s[j], 'g', 'kg') + ' ' + pr[1]; }, u = function (j) { return t('\\$' + rd(v.up[j], 3).toFixed(3)); };
        var opts = [0, 1, 2].map(function (j) { return { html: nm(j), right: j === v.b, why: j === v.b ? null : j === 2 ? 'The biggest ' + pr[1] + ' isn’t always the best buy. Find the price per 100 g of each.' : 'Find the price per 100 g of each size (change kg to g).' }; });
        opts.push({ html: 'all three: they cost the same per 100 g', why: 'Work out the price per 100 g of each size: they are different.' });
        return P.mc(r, pr[0] + ' comes in ' + v.s.map(function (x, j) { return sz(x, 'g', 'kg') + ' for ' + MM(v.pr[j]); }).join(', ').replace(/, ([^,]*)$/, ' and $1') + '. The best buy is', opts,
          'Per 100 g: ' + v.s.map(function (x, j) { return t(c2(v.pr[j]) + '\\div ' + N(x / 100) + '=' + '\\$' + rd(v.up[j], 3).toFixed(3)); }).join(', ') + '. ' + cap(nm(v.b)) + ' is lowest.', ['Price per 100 g = price ÷ grams × 100.', 'Change kg to g first.'], 'cereal');
      } }] },
      { num: '19', stem: '', parts: [{ id: '19', level: 'BEG', make: function (r) {
        var v = find(function () { return [r.pick([40, 50, 60, 80, 120, 160, 200, 240]), r.pick([20, 25, 40, 30, 10, 15])]; }, function (v) {
          var Nn = v[0] * (1 - v[1] / 100); if (!isInt(Nn)) return false; var dd = v[0] - Nn; return distinct([v[1], dd, rd(dd / Nn * 100, 1), Nn / v[0] * 100], 0.05) && dd < 100;
        }, [80, 25]);
        var O = v[0], w = v[1], Nn = O * (1 - w / 100), dd = O - Nn, it = r.pick(['jacket', 'pair of skates', 'backpack', 'video game', 'lamp']);
        return P.mc(r, 'The price of a ' + it + ' drops from ' + MM(O) + ' to ' + MM(Nn) + '. The percent decrease is', [{ html: t(w + '\\%'), right: true }, { html: t(N(dd) + '\\%'), why: 'That’s the drop in dollars. Divide it by the original price and multiply by 100.' },
          { html: t(N(rd(dd / Nn * 100, 1)) + '\\%'), why: 'Divide by the <b>original</b> price, ' + MM(O) + ', not the new price.' }, { html: t(N(q(Nn / O * 100)) + '\\%'), why: 'That’s the new price as a percent of the old. The decrease is 100% minus that.' }],
          t(N(dd) + '\\div ' + N(O) + '\\times 100=' + w + '\\%'), ['Percent decrease = change ÷ original × 100.'], 'pct decrease');
      } }] },
      { num: '20', stem: '', parts: [{ id: '20', level: 'PRG', make: function (r) {
        var v = find(function () { return [r.pick([20, 30, 40, 50, 25]), r.pick([10, 20, 25, 15])]; }, function (v) { var payp = (100 - v[0]) * (100 - v[1]) / 100; return !(v[0] === 25 && v[1] === 10) && distinct([v[0] + v[1], payp, 100 - payp, v[0] * v[1] / 100], 0.05); }, [30, 20]);
        var a = v[0], b = v[1], payp = q((100 - a) * (100 - b) / 100), right = q(100 - payp);
        return P.mc(r, 'A store takes ' + a + '% off, then an extra ' + b + '% off the sale price. This is the same as a single discount of', [{ html: t(N(right) + '\\%'), right: true },
          { html: t((a + b) + '\\%'), why: 'Two discounts in a row are not added: the second one comes off the new, lower price.' }, { html: t(N(payp) + '\\%'), why: 'That’s the part of the price you <b>pay</b>. The discount is 100% minus that.' }, { html: t(N(q(a * b / 100)) + '\\%'), why: 'Multiply the parts you <b>pay</b>: ' + t(pay(a) + '\\times ' + pay(b)) + '.' }],
          'You pay ' + t(pay(a) + '\\times ' + pay(b) + '=' + nS(payp / 100)) + ' of the price, so the discount is ' + t('1-' + nS(payp / 100) + '=' + nS(right / 100) + '=' + N(right) + '\\%') + '.', ['Find the part you pay after each discount and multiply.'], 'stacked');
      } }] },
      { num: '21', stem: '', parts: [{ id: '21', level: 'BEG', make: function (r) {
        var b = r.pick([['US dollar', 'US dollars', 1.34, 1.42, 'USD'], ['US dollar', 'US dollars', 1.33, 1.43, 'USD'], ['euro', 'euros', 1.47, 1.57, 'EUR']]), sellBack = r.chance(0.35);
        var A1 = { html: 'You pay ' + MM(b[3]) + ' CAD for each ' + b[0] + ' you buy.', right: true };
        var opts = sellBack ? [
          { html: 'You pay ' + MM(b[2]) + ' CAD for each ' + b[0] + ' you buy.', why: 'When you buy, the bank is selling: you pay the higher “We sell” rate, ' + MM(b[3]) + '.' },
          { html: 'The bank pays you ' + MM(b[3]) + ' CAD for each ' + b[0] + ' you sell back.', why: 'When you sell back, the bank is buying: it pays the lower “We buy” rate.' },
          { html: 'The bank pays you ' + MM(b[2]) + ' CAD for each ' + b[0] + ' you sell back.', right: true },
          { html: 'Changing CAD to ' + b[1] + ' and back again makes you money.', why: 'You buy at the higher rate and sell back at the lower one, so you lose the difference.' }] : [
          A1,
          { html: 'You pay ' + MM(b[2]) + ' CAD for each ' + b[0] + ' you buy.', why: 'When you buy, the bank is selling: you pay the higher “We sell” rate.' },
          { html: 'The bank pays you ' + MM(b[3]) + ' CAD for each ' + b[0] + ' you sell back.', why: 'When you sell back, the bank is buying: it pays the lower “We buy” rate.' },
          { html: 'Changing CAD to ' + b[1] + ' and back again makes you money.', why: 'You buy at the higher rate and sell back at the lower one, so you lose the difference.' }];
        return P.mc(r, 'A bank’s board shows ' + b[0] + ': We buy ' + t(N(b[2])) + ', We sell ' + t(N(b[3])) + '. Which statement is true?', opts,
          sellBack ? 'When you sell ' + b[1] + ' back, the bank is <b>buying</b>: it pays its lower rate, ' + MM(b[2]) + '. (It sells to you at ' + MM(b[3]) + '.)' : 'The bank <b>sells</b> you ' + b[1] + ' at its higher rate, ' + MM(b[3]) + '. (It buys them back at ' + MM(b[2]) + '.)',
          ['“We sell” is the rate when you buy; “We buy” is the rate when you sell back.'], 'board');
      } }] },
      { num: '22', stem: '', parts: [{ id: '22', level: 'EMG', make: function (r) {
        var c = r.pick([['USD', 0.72, 'shirt'], ['USD', 0.73, 'hat'], ['EUR', 0.66, 'scarf'], ['EUR', 0.64, 'bag']]);
        var Pr = find(function () { return r.int(4, 24) * 5; }, function (p) { return distinct([p / c[1], p * c[1], p + c[1], p * (2 - c[1])], 0.5); }, 45), x = Pr / c[1];
        var amt = c[0] === 'USD' ? MM(Pr) + ' USD' : t(c2(Pr)) + ' EUR';
        return P.mc(r, 'The exchange rate is ' + t('1\\text{ CAD}=' + N(c[1]) + '\\text{ ' + c[0] + '}') + '. A ' + amt + ' ' + c[2] + ' costs about how much in Canadian dollars?', [{ html: MM(x), right: true },
          { html: MM(Pr * c[1]), why: 'The rate starts with CAD, the currency you <b>want</b>, so divide. (A Canadian price should be more than the ' + c[0] + ' price.)' }, { html: MM(Pr + c[1]), why: 'Don’t add the rate. Divide by it.' }, { html: MM(Pr * (2 - c[1])), why: 'Use the rate as given: divide by ' + t(N(c[1])) + '.' }],
          'Foreign to Canadian with this rate: divide. ' + t(Pr + '\\div ' + N(c[1]) + toM(x)) + '. Check: a Canadian price should be more than the ' + c[0] + ' price.', ['Does the rate start with the currency you have or the one you want?'], 'CAD rate');
      } }] },

      /* ===================== Part C: Numerical Response ===================== */
      { num: '23', section: 'Part C: Numerical Response', stem: '', parts: [{ id: '23', level: 'EMG', make: function (r) {
        var c = r.pick([['cookie recipe', 'cookies', 'cups of flour'], ['muffin recipe', 'muffins', 'cups of flour'], ['pancake recipe', 'pancakes', 'cups of milk']]);
        var v = find(function () { return [r.pick([2, 3, 4, 1.5, 2.5]), r.pick([24, 30, 36, 48, 18, 20, 12]), r.int(2, 16) * 6]; }, function (v) { var x = v[0] * v[2] / v[1]; return v[2] !== v[1] && decPl(q(x)) <= 1 && x < 100 && x > v[0] * 0.4 && !(v[0] === 3 && v[1] === 8); }, [3, 24, 60]);
        var f = v[0], n = v[1], m = v[2], x = q(f * m / n);
        return amtPart('<b>Numerical response.</b> A ' + c[0] + ' uses ' + t(N(f)) + ' ' + c[2] + ' for ' + t(n) + ' ' + c[1] + '. The number of ' + c[2] + ' needed for ' + t(m) + ' ' + c[1] + ' is ________.', x, { dp: 1, plain: true, nr: true,
          diag: [{ v: f * n / m, code: 'u1l4-wrong-divide', hint: 'Set it up with matching units in matching places: ' + t('\\dfrac{' + N(f) + '}{' + n + '}=\\dfrac{x}{' + m + '}') + '.' }, { v: f * m, code: 'u1l4-wrong-divide', hint: 'After you cross-multiply, divide by ' + t(n) + '.' }, { v: f + m - n, code: 'u1l4-added', hint: 'Scale by multiplying, not by adding.' }],
          sol: t('\\dfrac{' + N(f) + '}{' + n + '}=\\dfrac{x}{' + m + '}') + ': ' + t(n + 'x=' + N(f * m)) + ', so ' + t('x=' + N(x)), hints: ['Write a proportion: ' + c[2] + ' over ' + c[1] + ' on both sides.'], text: 'NR recipe' });
      } }] },
      { num: '24', stem: '', parts: [{ id: '24', level: 'PRG', make: function (r) {
        var v = find(function () { return [r.int(25, 50) * 20, q(r.int(3, 9) + r.pick([0.29, 0.49, 0.79, 0.99]))]; }, function (v) { var u = v[1] / v[0] * 100; return u >= 0.5 && u < 0.995 && !(v[0] === 750 && v[1] === 3.49); }, [680, 5.29]);
        var g = v[0], Pr = v[1], x = Pr / g * 10000, it = r.pick(['jar of peanut butter', 'bag of rice', 'box of crackers', 'jar of jam', 'bag of flour']);
        return amtPart('<b>Numerical response.</b> A ' + g + ' g ' + it + ' costs ' + MM(Pr) + '. Its unit price, in <b>cents</b> per 100 g, to the nearest tenth of a cent, is ________ cents.', x, { dp: 1, plain: true, nr: true, exact: x,
          diag: [{ v: Pr / g * 100, code: 'u1l11-cents', hint: 'That’s the price in <b>dollars</b> per 100 g. Change it to cents: multiply by 100.' }, { v: g / Pr, code: 'u1l11-flip', hint: 'Unit price = price ÷ grams (× 100 for 100 g).' }, { v: Pr / g * 1000, code: 'u1l11-no-x100', hint: 'Dollars per 100 g = price ÷ grams × 100; then × 100 again for cents.' }],
          sol: t(c2(Pr) + '\\div ' + g + '\\times 100=' + raw5(Pr / g * 100)) + ' dollars, which is ' + t(raw5(x)) + ' cents, so about ' + t(rd(x, 1).toFixed(1)) + ' cents per 100 g', hints: ['Price per 100 g = price ÷ grams × 100 (in dollars).', 'Then change dollars to cents (× 100).'], text: 'NR cents' });
      } }] },
      { num: '25', stem: '', parts: [{ id: '25', level: 'EMG', make: function (r) { return nrMarkup(r, 'phone case', [36, 49.5]); } }] },
      { num: '26', stem: '', parts: [{ id: '26', level: 'EMG', make: function (r) {
        var c = r.pick([['EUR', 0.66, 'euros'], ['EUR', 0.66, 'euros'], ['USD', 0.72, 'US dollars'], ['GBP', 0.57, 'British pounds']]), A = r.int(4, 24) * 50, x = A * c[1], who = person(r).n;
        return amtPart('<b>Numerical response.</b> The exchange rate is ' + t('1\\text{ CAD}=' + N(c[1]) + '\\text{ ' + c[0] + '}') + '. The number of ' + c[2] + ' ' + who + ' gets for ' + MM(A) + ' CAD, to the nearest ' + (c[0] === 'GBP' ? 'pound' : c[0] === 'USD' ? 'dollar' : 'euro') + ', is ________.', x, { dp: 0, plain: true, nr: true, exact: x,
          diag: [{ v: A / c[1], code: 'u1l11-divided', hint: 'The rate starts with CAD, the currency you <b>have</b>, so multiply. (You get fewer ' + c[2] + ' than dollars.)' }],
          sol: 'Canadian to ' + c[2] + ' with this rate: multiply. ' + t(A + '\\times ' + N(c[1]) + toN(x, 0)) + ' ' + c[2], hints: ['The rate starts with CAD, the currency you have: multiply.'], text: 'NR exchange' });
      } }] }],

    /* ===================== Extra Practice: Practice Test 2 ===================== */
    extra: [
      { num: '1', section: 'A. Skills', stem: 'Write each ratio in simplest form.', parts: [
        { id: 'e1a', level: 'BEG', make: function (r) { var v = genPair(r, 2, 7, [6, 7, 8, 9], function (v) { return v[0] <= 72 && v[1] <= 72; }); return simpPart([v[0], v[1]]); } },
        { id: 'e1b', level: 'EMG', make: function (r) { return unitRatio(r, ['mL_L', 'mL_L', 'g_kg']); } },
        { id: 'e1c', level: 'EMG', make: function (r) { var v = genDec(r, function (v) { return v[0] > v[1]; }); return simpPart([v[0], v[1]]); } }] },
      { num: '2', stem: 'Solve each proportion.', parts: [
        { id: 'e2a', level: 'BEG', make: function (r) {
          var v = find(function () { var d1 = r.int(6, 12), x = r.int(2, d1 + 2), k = r.int(2, 4); return [x, d1, x * k, d1 * k]; }, function (v) { return v[0] !== v[1] && v[2] <= 60 && v[3] <= 60; }, [5, 8, 15, 24]);
          return propPart([[null, v[2]], [v[1], v[3]]], 'frac', 'e prop a ' + v.join(','));
        } },
        { id: 'e2b', level: 'EMG', make: function (r) {
          var v = find(function () { return [r.int(3, 12), r.int(2, 9), r.int(7, 30)]; }, function (v) { var x = v[0] * v[2] / v[1]; return isInt(x) && x < 60 && !isInt(v[0] / v[1]) && !isInt(v[1] / v[0]) && v[2] % v[1] !== 0; }, [6, 4, 14]);
          return propPart([[v[0], v[1]], [null, v[2]]], 'frac', 'e prop b ' + v.join(','));
        } },
        { id: 'e2c', level: 'EMG', make: function (r) {
          var v = find(function () { return [r.pick([1.5, 2.5, 3.5, 0.5, 1.2, 4.5]), r.pick([2, 4, 5, 8, 3]), r.pick([6, 10, 12, 15, 20])]; }, function (v) { var x = v[0] * v[2] / v[1]; return decPl(q(x)) <= 2 && !isInt(x) && v[2] !== v[1] && x < 60; }, [2.5, 4, 10]);
          return propPart([[v[0], null], [v[1], v[2]]], 'colon', 'e prop c ' + v.join(','));
        } }] },
      { num: '3', stem: 'Find each unit rate.', parts: [
        { id: 'e3a', level: 'BEG', make: function (r) {
          var c = r.pick([['babysitting', 'h'], ['dog walking', 'h'], ['snow shovelling', 'h']]), w = r.int(24, 32) / 2, h = r.int(3, 9), E = w * h;
          return amtPart(MM(E) + ' for ' + h + ' hours of ' + c[0] + ' ($/h)', w, { after: '/h', diag: [{ v: h / E, code: 'u1l11-flip', hint: 'Dollars per hour: divide the dollars by the hours.' }, { v: E * h, code: 'u1l11-times', hint: 'Divide the pay by the hours.' }], sol: t(c2(E) + '\\div ' + h + '=' + Mt(w)) + '/h', hints: ['Divide by the second amount (the hours).'], text: 'e wage' });
        } },
        { id: 'e3b', level: 'BEG', make: function (r) {
          var v = find(function () { return [r.int(60, 110), r.int(2, 6)]; }, function (v) { return !(v[0] === 80 && v[1] === 3) && v[0] % 10 !== 0; }, [91, 5]), D = v[0] * v[1];
          return amtPart(t(N(D)) + ' km in ' + v[1] + ' h (km/h)', v[0], { dp: 0, plain: true, after: 'km/h', diag: [{ v: v[1] / D, code: 'u1l11-flip', hint: 'km per hour: divide the km by the hours.' }, { v: D * v[1], code: 'u1l11-times', hint: 'Divide the distance by the time.' }], sol: t(N(D) + '\\div ' + v[1] + '=' + v[0]) + ' km/h', hints: ['Speed = distance ÷ time.'], text: 'e speed' });
        } },
        { id: 'e3c', level: 'EMG', make: function (r) {
          var v = find(function () { return [r.int(30, 80) * 10, r.int(12, 24) / 2]; }, function (v) { var L = v[0] * v[1] / 100; return isInt(L) && !(v[0] === 450 && v[1] === 8) && !(v[0] === 600 && v[1] === 9); }, [480, 7.5]);
          var D = v[0], e = v[1], L = q(D * e / 100);
          return amtPart(t(N(L)) + ' L of gas for ' + t(N(D)) + ' km (L/100 km)', e, { dp: 1, plain: true, after: 'L/100 km', diag: [{ v: D / L * 100, code: 'u1l11-flip', hint: 'L/100 km = litres ÷ km × 100.' }, { v: L / D, code: 'u1l11-no-x100', hint: 'That’s litres per 1 km. Multiply by 100.' }, { v: D / L, code: 'u1l11-flip', hint: 'That’s km per litre. You want litres per 100 km.' }], sol: t(N(L) + '\\div ' + N(D) + '\\times 100=' + N(e)) + ' L/100 km', hints: ['L/100 km = litres ÷ km × 100.'], text: 'e fuel' });
        } }] },
      { num: '4', stem: '', parts: [
        { id: 'e4a', level: 'BEG', make: function (r) { var A = r.int(80, 600) * 20 / 100; return PK.ofPart(5, A, { money: true, prompt: 'Find the 5% GST on ' + MM(A) + '.', text: 'e GST' }); } },
        { id: 'e4b', level: 'BEG', make: function (r) {
          var v = find(function () { return [r.int(12, 60) * 2, r.pick([20, 25, 30, 40, 15])]; }, function (v) { return !(v[0] === 60 && v[1] === 25) && isInt(v[0] * v[1]) && v[0] * v[1] % 100 !== 0; }, [54, 25]);
          var Pr = v[0], d = v[1], ds = Pr * d / 100, sale = Pr - ds, it = r.pick(['sweater', 'pair of jeans', 'hoodie', 'backpack', 'pair of boots']);
          return fieldsPart('A ' + MM(Pr) + ' ' + it + ' is ' + d + '% off. Find the discount and the sale price.', [
            mfld('Discount:', ds, { name: 'Discount', diag: [{ v: sale, code: 'u1l11-gave-sale', hint: 'That’s the sale price. The discount is the amount taken off: ' + t(Pr + '\\times ' + dec(d)) + '.' }, { v: d, code: 'u1l11-pct-dollars', hint: d + '% off is not ' + t('\\$' + d) + '. Multiply the price by ' + t(dec(d)) + '.' }, { v: Pr * d, code: 'u1l11-no-x100', hint: 'Change ' + d + '% to a decimal first: ' + t(dec(d)) + '.' }] }),
            mfld('Sale price:', sale, { name: 'Sale price', diag: [{ v: ds, code: 'u1l11-gave-discount', hint: 'That’s the discount. Subtract it from the price.' }, { v: Pr - d, code: 'u1l11-pct-dollars', hint: d + '% off is not ' + t('\\$' + d) + ' off.' }, { v: Pr + ds, code: 'u1l11-added-pct', hint: 'A discount is taken <b>off</b>: subtract.' }] })],
            'Discount: ' + t(Pr + '\\times ' + dec(d) + '=' + Mt(ds)) + '<br>Sale price: ' + t(Pr + '-' + c2(ds) + '=' + Mt(sale)), ['Discount = price × rate.', 'Sale price = price − discount.'], 'e discount');
        } },
        { id: 'e4c', level: 'BEG', outcome: 'REV', make: function (r) {
          var v = find(function () { return [r.pick([12.5, 7.5, 2.5, 17.5, 37.5, 62.5]), r.int(3, 30) * 40]; }, function (v) { return !(v[0] === 15 && v[1] === 42); }, [12.5, 240]);
          return PK.ofPart(v[0], v[1], { money: true, prompt: 'Find ' + N(v[0]) + '% of ' + MM(v[1]) + '.', text: 'e pct of' });
        } }] },
      { num: '5', stem: 'Use ' + t('1\\text{ USD}=1.38\\text{ CAD}') + '.', parts: [
        { id: 'e5a', level: 'BEG', make: function (r) {
          var A = find(function () { return r.int(5, 50) * 5; }, function (a) { return a !== 50 && a !== 45; }, 75), x = A * 1.38;
          return amtPart('Change ' + MM(A) + ' USD to Canadian dollars.', x, { after: 'CAD', diag: [{ v: A / 1.38, code: 'u1l11-divided', hint: 'The rate starts with USD, the currency you <b>have</b>: multiply.' }, { v: A, code: 'u1l11-no-convert', hint: 'Use the rate: multiply by 1.38.' }], sol: 'Starts with USD (you have it): multiply.<br>' + t(A + '\\times 1.38' + toM(x)) + ' CAD', hints: ['If the rate starts with the currency you have, multiply.'], text: 'e USD-CAD' });
        } },
        { id: 'e5b', level: 'EMG', make: function (r) {
          var k = r.int(4, 30) * 10 + r.pick([0, 0, 5]), C = q(k * 1.38);
          return amtPart('Change ' + MM(C) + ' CAD to US dollars.', k, { before: '$', after: 'USD', diag: [{ v: C * 1.38, code: 'u1l11-multiplied', hint: 'The rate starts with USD, the currency you <b>want</b>: divide. (You get fewer US dollars.)' }, { v: C, code: 'u1l11-no-convert', hint: 'Use the rate: divide by 1.38.' }], sol: 'Starts with USD (you want it): divide.<br>' + t(c2(C) + '\\div 1.38=' + Mt(k)) + ' USD', hints: ['If the rate starts with the currency you want, divide.'], text: 'e CAD-USD' });
        } }] },
      { num: '6', section: 'B. Applying', stem: '', parts: [{ id: 'e6', level: 'EMG', make: function (r) {
        var R = find(function () { return [r.int(3, 8), r.int(3, 8), r.int(3, 8)]; }, function (v) { return v[0] !== v[1] && v[1] !== v[2] && v[0] !== v[2] && gcd(gcd(v[0], v[1]), v[2]) === 1; }, [5, 4, 6]);
        var n = R[0] + R[1] + R[2], k = r.pick([100, 110, 120, 125, 130, 140, 150, 90]), T = n * k;
        var nm = r.sample(['Ava', 'Jun', 'Leo', 'Rosa', 'Kian', 'Mia', 'Omar', 'Tess'], 3);
        var specs = R.map(function (p, i) { return mfld(nm[i] + ' pays', p * k, { name: nm[i], diag: [{ v: T / p, code: 'u1l11-term-div', hint: 'Don’t divide by ' + p + '. First add the terms: ' + t(R.join('+') + '=' + n) + ' parts, then one part = ' + t(Mt(T) + '\\div ' + n) + '.' }, { v: k, code: 'u1l11-per-part', hint: 'That’s one part. ' + nm[i] + ' pays ' + p + ' parts.' }, { v: T / 3, code: 'u1l11-equal', hint: 'They split the rent in the ratio ' + t(R.join(':')) + ', not equally.' }] }); });
        return fieldsPart('Three roommates share a ' + MM(T) + ' monthly rent in the ratio ' + t(R.join(':')) + ' (' + nm.join(' : ') + '), based on the size of their bedrooms. How much does each person pay?', specs,
          t(R.join('+') + '=' + n) + ' parts; one part: ' + t(Mt(T) + '\\div ' + n + '=' + Mt(k)) + '<br>' + R.map(function (p, i) { return nm[i] + ': ' + t(p + '\\times ' + c2(k) + '=' + Mt(p * k)); }).join(', ') + '<br>Check: ' + t(R.map(function (p) { return c2(p * k); }).join('+') + '=' + c2(T)) + ' ✓',
          ['Add the terms to get the number of parts.', 'One part = total ÷ number of parts. Then multiply.'], 'e rent');
      } }] },
      { num: '7', stem: '', parts: [{ id: 'e7', level: 'EMG', make: function (r) {
        var v = find(function () { return [r.pick([[4, 6], [5, 7], [8, 10], [10, 15], [3, 5], [6, 8]]), r.int(8, 40)]; }, function (v) { var L = v[0][1] * v[1] / v[0][0]; return v[1] > v[0][0] && decPl(q(L)) <= 1 && v[1] !== v[0][1]; }, [[10, 15], 24]);
        var w = v[0][0], h = v[0][1], s = v[1], L = q(h * s / w);
        return X.numPart('A ' + w + ' cm by ' + h + ' cm photo is enlarged so that the short side is ' + s + ' cm. How long is the long side?', L, { after: 'cm', unit: 'cm',
          wrongs: [{ v: h + (s - w), code: 'u1l4-added', hint: 'An enlargement multiplies both sides by the same number — it doesn’t add the same amount.' }, { v: q(w * s / h), code: 'u1l4-wrong-divide', hint: 'Match the sides: ' + t('\\dfrac{' + w + '}{' + h + '}=\\dfrac{' + s + '}{x}') + ' (short over long on both sides).' }, { v: s * h, code: 'u1l4-wrong-divide', hint: 'After you cross-multiply, divide by ' + w + '.' }],
          sol: t('\\dfrac{' + w + '}{' + h + '}=\\dfrac{' + s + '}{x}') + ': ' + t(w + 'x=' + N(h * s)) + ', so ' + t('x=' + N(L)) + '. The long side is ' + N(L) + ' cm.', hints: ['Write a proportion: short side over long side, for both photos.'], text: 'e photo' });
      } }] },
      { num: '8', stem: function (s) { return 'Shampoo comes in three sizes: ' + s.s.map(function (x, j) { return sz(x, 'mL', 'L') + ' for ' + MM(s.pr[j]); }).join(', ').replace(/, ([^,]*)$/, ' and $1') + '.'; },
        shared: function (r) { return threeSizes(r, [[300, 350, 400, 450], [600, 700, 750, 800], [1000, 1000, 1200, 1500]], 100, 140, [1, 1, 0, 2], { s: [400, 750, 1000], pr: [5.49, 8.99, 13.49], up: [5.49 / 4, 8.99 / 7.5, 13.49 / 10], b: 1 }); }, parts: [
        { id: 'e8ai', sub: 'a i', level: 'EMG', make: function (r, s) {
          var specs = s.s.map(function (x, j) {
            var bad = [{ v: x / s.pr[j] * 100, code: 'u1l11-flip', hint: 'Price per 100 mL = price ÷ mL × 100.' }, { v: s.pr[j] / x, code: 'u1l11-no-x100', hint: 'That’s the price per 1 mL. Multiply by 100.' }];
            if (x >= 1000) bad.push({ v: s.pr[j] / (x / 1000) * 100, code: 'u1l11-no-convert', hint: 'Change ' + sz(x, 'mL', 'L') + ' to ' + x + ' mL first.' });
            return { label: sz(x, 'mL', 'L') + ':', name: sz(x, 'mL', 'L'), before: '$', after: 'per 100 mL', chk: upChk(s.up[j], bad), key: rd(s.up[j], 3).toFixed(3), show: t('\\$' + rd(s.up[j], 3).toFixed(3)) };
          });
          return fieldsPart('Find the price per 100 mL of each size (to a tenth of a cent).', specs, br(s.s.map(function (x, j) { return t(c2(s.pr[j]) + '\\div ' + x + '\\times 100=' + raw5(s.up[j]) + '\\approx\\$' + rd(s.up[j], 3).toFixed(3)); })),
            ['Price per 100 mL = price ÷ mL × 100.', 'Change litres to millilitres first.'], 'e shampoo');
        } },
        { id: 'e8aii', sub: 'a ii', level: 'BEG', make: function (r, s) {
          var u = function (j) { return t('\\$' + rd(s.up[j], 3).toFixed(3)); };
          return P.mc(r, 'Which size is the best buy?', [0, 1, 2].map(function (j) { return { html: 'The ' + sz(s.s[j], 'mL', 'L') + ' bottle', right: j === s.b, why: j === s.b ? null : 'Its price per 100 mL is ' + u(j) + '. Compare all three unit prices.' }; }),
            'The ' + sz(s.s[s.b], 'mL', 'L') + ' bottle has the lowest price per 100 mL (' + u(s.b) + ').', ['Use your prices per 100 mL.'], 'e shampoo best');
        } },
        { id: 'e8b', sub: 'b', level: 'BEG', make: function (r, s) {
          return reasonMC(r, 'Which is a good reason that is <b>not</b> about price for buying the ' + sz(s.s[0], 'mL', 'L') + ' bottle?', 'It is small enough for a gym bag or a trip, or you want to try the shampoo before buying a big bottle.',
            [['It has the lowest price per 100 mL.', 'That’s about price. Think about size, travel or trying it first.'], ['Small bottles always last longer.', 'Not true. Think about size, travel or trying it first.'], ['It is always the best buy.', 'That’s about price, and it isn’t always true.']],
            'Possible reasons: it fits in a gym bag or a suitcase; you want to try it first; you have less money to spend today.', ['Think about size, carrying or trying it first.'], 'e shampoo reason');
        } }] },
      { num: '9', stem: function (s) { return 'A Calgary store pays ' + MM(s.W) + ' for a shipment of ' + s.n + ' ' + s.it + '.'; },
        shared: function (r) { var n = r.pick([8, 10, 12, 15, 20, 24]), one = r.int(30, 80) + r.pick([0, 0, 0.5]); return { n: n, one: one, W: n * one, m: r.pick([40, 50, 55, 60, 65, 75]), it: r.pick(['jackets', 'pairs of boots', 'hoodies', 'helmets']) }; }, parts: [
        { id: 'e9a', level: 'BEG', make: function (r, s) { return amtPart('What is the wholesale cost of one?', s.one, { diag: [{ v: s.n / s.W, code: 'u1l11-flip', hint: 'Divide the total cost by the number of items.' }, { v: s.W * s.n, code: 'u1l11-times', hint: 'Divide the total by ' + s.n + '.' }], sol: t(c2(s.W) + '\\div ' + s.n + '=' + Mt(s.one)), hints: ['Cost of one = total ÷ number of items.'], text: 'e wholesale' }); } },
        { id: 'e9b', level: 'EMG', make: function (r, s) { var R = s.one * (1 + s.m / 100); return amtPart('The store marks each one up ' + s.m + '%. What is the retail price?', R, { exact: R, diag: [{ v: s.one * s.m / 100, code: 'u1l11-gave-discount', hint: 'That’s the markup. Add it to the cost (or multiply by ' + t(mult(s.m)) + ').' }, { v: s.W * (1 + s.m / 100), code: 'u1l11-one-item', hint: 'Mark up the cost of <b>one</b> (part a).' }, { v: s.one + s.m, code: 'u1l11-pct-dollars', hint: s.m + '% is not ' + t('\\$' + s.m) + '.' }], sol: t(c2(s.one) + '\\times ' + mult(s.m) + toM(R)), hints: ['Retail = cost × (1 + rate).'], text: 'e retail' }); } },
        { id: 'e9c', level: 'EMG', make: function (r, s) { var R = r2(s.one * (1 + s.m / 100)), T = R * 1.05; return amtPart('What does a customer pay with 5% GST?', T, { exact: T, alts: [s.one * (1 + s.m / 100) * 1.05], diag: GST_DIAG(R).concat([{ v: s.one * 1.05, code: 'u1l11-tax-original', hint: 'Tax goes on the <b>retail</b> price, not the store’s cost.' }]), sol: t(c2(R) + '\\times 1.05' + toM(T)), hints: ['Total = retail × 1.05.'], text: 'e GST' }); } },
        { id: 'e9d', level: 'EMG', make: function (r, s) { var R = r2(s.one * (1 + s.m / 100)), T = R * 1.13; return amtPart('What would the same item cost in Ontario (13% HST)?', T, { exact: T, alts: [s.one * (1 + s.m / 100) * 1.13], diag: [{ v: R * 1.05, code: 'u1l11-no-tax', hint: 'That’s the Alberta price. Ontario’s HST is 13%: multiply by 1.13.' }, { v: R * 0.13, code: 'u1l11-tax-only', hint: 'That’s the HST alone. Multiply the retail price by 1.13.' }, { v: R * 1.3, code: 'u1l11-five-half', hint: t('13\\%=0.13') + ': multiply by 1.13.' }, { v: s.one * 1.13, code: 'u1l11-tax-original', hint: 'Tax goes on the retail price.' }], sol: t(c2(R) + '\\times 1.13' + toM(T)), hints: ['Total = retail × 1.13.'], text: 'e HST' }); } }] },
      { num: '10', stem: '', parts: [{ id: 'e10', level: 'ADV', make: function (r) {
        var p = r.int(110, 260) + r.pick([0, 0, 0.99]), d = r.pick([10, 15, 20]), c = r.pick([25, 30, 40, 50]), who = person(r), n = 4;
        var full = q(n * p), sale = full * (1 - d / 100), af = sale - c, T = af * 1.05;
        return amtPart(who.n + ' buys ' + n + ' winter tires at ' + MM(p) + ' each. The shop gives ' + d + '% off, and then ' + who.he + ' uses a coupon for ' + MM(c) + ' off. GST is added last. What is ' + who.his + ' total?', T,
          { exact: T, alts: [(r2(sale) - c) * 1.05], diag: [{ v: (full - c) * (1 - d / 100) * 1.05, code: 'u1l11-coupon-first', hint: 'Take the ' + d + '% off first, <b>then</b> the coupon.' }, { v: af, code: 'u1l11-no-tax', hint: 'Add the GST last: multiply by 1.05.' }, { v: sale * 1.05, code: 'u1l11-no-coupon', hint: 'Don’t forget the ' + MM(c) + ' coupon (after the ' + d + '% off).' }, { v: sale * 1.05 - c, code: 'u1l11-coupon-after-tax', hint: 'The coupon comes off <b>before</b> the GST is added.' }, { v: (p * (1 - d / 100) - c) * 1.05, code: 'u1l11-one-tire', hint: 'Start with the cost of all ' + n + ' tires.' }, { v: (full - full * d / 100 - c), code: 'u1l11-no-tax', hint: 'Add the GST last.' }],
            sol: 'Before discounts: ' + t(n + '\\times ' + c2(p) + '=' + Mt(full)) + '<br>' + d + '% off: ' + t(c2(full) + '\\times ' + pay(d) + toM(sale)) + '; coupon: ' + t(c2(sale) + '-' + c2(c) + '=' + Mt(r2(sale) - c)) + '<br>With GST: ' + t(c2(r2(sale) - c) + '\\times 1.05' + toM((r2(sale) - c) * 1.05)) + '. ' + who.n + ' pays ' + MM((r2(sale) - c) * 1.05) + '.',
            hints: ['Work in the order given: all 4 tires, then the % off, then the coupon, then GST.'], text: 'e tires' });
      } }] },
      { num: '11', stem: function (s) { return 'A bank shows these rates, in Canadian dollars for 1 unit of each currency.' + BOARD_EP11_HTML; },
        shared: function (r) { return { p: person(r), P: find(function () { return r.int(4, 16) * 500; }, function (x) { return x !== 3000; }, 4000), Q: r.int(4, 24) * 50, place: r.pick(['Puerto Vallarta', 'Cancun', 'Mexico City', 'Los Cabos', 'Mazatlán']) }; }, parts: [
        { id: 'e11a', level: 'BEG', make: function (r, s) { var x = s.P * 0.081; return amtPart(s.p.n + ' buys ' + HW.fmt(s.P, true) + ' Mexican pesos before a trip to ' + s.place + '. How much does ' + s.p.he + ' pay in Canadian dollars?', x, { after: 'CAD', diag: [{ v: s.P * 0.072, code: 'u1l11-buy-rate', hint: 'When you buy pesos the bank is selling: use “We sell”, 0.081.' }, { v: s.P / 0.081, code: 'u1l11-divided', hint: 'Multiply the pesos by the rate (CAD for 1 peso).' }], sol: 'The bank sells pesos at 0.081: ' + t(N(s.P) + '\\times 0.081' + toM(x)) + ' CAD', hints: ['Buying pesos: use the bank’s selling rate.'], text: 'e pesos buy' }); } },
        { id: 'e11b', level: 'BEG', make: function (r, s) { var x = s.Q * 0.072; return amtPart(cap(s.p.he) + ' brings home ' + s.Q + ' pesos and sells them back. How much does ' + s.p.he + ' get?', x, { after: 'CAD', diag: [{ v: s.Q * 0.081, code: 'u1l11-sell-rate', hint: 'Selling back: the bank is buying, so use “We buy”, 0.072.' }, { v: s.Q / 0.072, code: 'u1l11-divided', hint: 'Multiply the pesos by the rate.' }], sol: 'The bank buys pesos at 0.072: ' + t(s.Q + '\\times 0.072' + toM(x)) + ' CAD', hints: ['Selling back: use the bank’s buying rate.'], text: 'e pesos sell' }); } },
        { id: 'e11c', level: 'PRG', make: function (r, s) { var paid = s.Q * 0.081, got = s.Q * 0.072, L = paid - got; return amtPart('How much money did ' + s.p.he + ' lose on those ' + s.Q + ' pesos by changing them there and back?', L, { alts: [r2(paid) - r2(got)], diag: [{ v: paid, code: 'u1l11-paid', hint: 'That’s what ' + s.p.he + ' paid for them. Subtract what ' + s.p.he + ' got back.' }, { v: s.P * 0.009, code: 'u1l11-loss-whole', hint: 'Only the ' + s.Q + ' pesos were changed back. Work with those.' }, { v: got, code: 'u1l11-paid', hint: 'That’s what ' + s.p.he + ' got back. Loss = paid − got back.' }], sol: 'Paid: ' + t(s.Q + '\\times 0.081' + toM(paid)) + '<br>Loss: ' + t(c2(paid) + '-' + c2(got) + '=' + Mt(L)), hints: ['What did those ' + s.Q + ' pesos cost at the selling rate?', 'Loss = cost − what you got back.'], text: 'e pesos loss' }); } }] },
      { num: '12', stem: '', parts: [{ id: 'e12', level: 'BEG', make: function (r) {
        var v = find(function () { return [r.pick([20, 25, 40, 50, 60, 80, 16]), r.pick([20, 25, 10, 50, 15])]; }, function (v) { var Nn = v[0] * (1 + v[1] / 100), dd = Nn - v[0]; return isInt(Nn * 4) && distinct([v[1], dd, rd(dd / Nn * 100, 1), rd(v[0] / Nn * 100, 1)], 0.05); }, [25, 20]);
        var O = v[0], w = v[1], Nn = q(O * (1 + w / 100)), dd = q(Nn - O), it = r.pick(['movie ticket', 'concert ticket', 'day pass at the ski hill', 'gym pass']);
        return P.mc(r, 'The price of a ' + it + ' goes from ' + MM(O) + ' to ' + MM(Nn) + '. The percent increase is', [{ html: t(w + '\\%'), right: true }, { html: t(N(dd) + '\\%'), why: 'That’s the increase in dollars. Divide it by the original price and multiply by 100.' },
          { html: t(N(rd(dd / Nn * 100, 1)) + '\\%'), why: 'Divide by the <b>original</b> price, ' + MM(O) + ', not the new price.' }, { html: t(N(rd(O / Nn * 100, 1)) + '\\%'), why: 'Use the change: change ÷ original × 100.' }],
          t(N(dd) + '\\div ' + N(O) + '\\times 100=' + w + '\\%'), ['Percent increase = change ÷ original × 100.'], 'e increase');
      } }] },
      { num: '13', stem: '', parts: [{ id: 'e13', level: 'EMG', make: function (r) {
        var k = r.pick([15, 20, 25, 30, 35, 40, 45, 60, 75]), Y = 108 * k, it = r.pick(['meal', 'train ticket', 'T-shirt', 'museum ticket']);
        return P.mc(r, 'In Japan, ' + t('1\\text{ CAD}=108\\text{ JPY}') + '. A ' + it + ' costs ' + t(HW.fmt(Y)) + ' yen. In Canadian dollars, that is', [{ html: MM(k), right: true }, { html: t('\\$' + HW.fmt(String(Y * 108)) + '.00'), why: 'The rate starts with CAD, the currency you <b>want</b>, so divide.' },
          { html: MM(k / 10), why: 'Check your division: ' + t(HW.fmt(Y) + '\\div 108') + '.' }, { html: MM(Y / 100), why: 'A yen is not a cent. Divide by 108.' }],
          'The rate starts with CAD, the currency you want, so divide: ' + t(HW.fmt(Y) + '\\div 108=' + Mt(k)) + '.', ['Does the rate start with the currency you have or want?'], 'e yen');
      } }] },
      { num: '14', stem: '', parts: [{ id: 'e14', level: 'EMG', make: function (r) {
        var Pr = r.pick([30, 40, 50, 60, 36, 44]), cLow = r.chance(0.65), d = cLow ? r.pick([Pr / 2 + 5, Pr / 2 + 10, Pr / 2 + 15].filter(function (x) { return x < Pr && x % 5 === 0; }).concat([Pr / 2 + 5])) : r.pick([10, 15, Pr / 2 - 5].filter(function (x) { return x < Pr / 2 && x > 0; }));
        var it = r.pick(['Jeans', 'Hoodies', 'Running shoes']), A = 1.5 * Pr, C = 2 * Pr - d;
        return P.mc(r, it + ' are ' + MM(Pr) + ' a pair. Which promotion gives the lowest price for 2 pairs?', [
          { html: 'Buy one, get the second half price', why: 'Work out all three: A is ' + t(c2(Pr) + '+' + c2(Pr / 2)) + '.' },
          { html: '25% off each pair', why: 'Work out all three: B is ' + t(c2(2 * Pr) + '\\times 0.75') + '.' },
          { html: MM(d) + ' off when you buy 2 pairs', right: cLow, why: cLow ? null : 'C is ' + t(c2(2 * Pr) + '-' + c2(d) + '=' + Mt(C)) + ' — compare it with A and B.' },
          { html: 'A and B tie for the lowest price', right: !cLow, why: cLow ? 'A and B do tie, but C is lower: ' + t(Mt(C)) + '.' : null }],
          'A: ' + t(c2(Pr) + '+' + c2(Pr / 2) + '=' + Mt(A)) + '; B: ' + t(c2(2 * Pr) + '\\times 0.75=' + Mt(A)) + '; C: ' + t(c2(2 * Pr) + '-' + c2(d) + '=' + Mt(C)) + '. ' + (cLow ? 'C is lowest (A and B tie, but higher).' : 'A and B tie for the lowest price.'), ['Find the cost of 2 pairs with each promotion.'], 'e jeans', true);
      } }] },
      { num: '15', stem: '', parts: [{ id: 'e15', level: 'EMG', make: function (r) {
        var v = find(function () { return [r.int(55, 125) / 10, r.int(15, 45) * 10 + r.pick([0, 5])]; }, function (v) { var x = v[0] * v[1] / 100; return x < 100 && !isInt(x * 10); }, [6.4, 285]);
        var e = v[0], D = v[1], x = e * D / 100;
        return amtPart('<b>Numerical response.</b> A car uses ' + t(N(e)) + ' L/100 km. The fuel needed for a ' + D + ' km trip, in litres to the nearest tenth, is ________.', x, { dp: 1, plain: true, nr: true, exact: x,
          diag: [{ v: D / e, code: 'u1l11-flip', hint: 'Fuel = (km ÷ 100) × L/100 km: ' + t(N(D / 100) + '\\times ' + N(e)) + '.' }, { v: e * D, code: 'u1l11-no-x100', hint: D + ' km is ' + N(D / 100) + ' hundreds of km. Divide by 100.' }, { v: D / e * 100, code: 'u1l11-flip', hint: 'Multiply the hundreds of km by ' + N(e) + '.' }],
          sol: D + ' km is ' + N(D / 100) + ' hundreds of km: ' + t(N(e) + '\\times ' + N(D / 100) + toN(x, 1)) + ' L', hints: ['How many hundreds of km is the trip?', 'Multiply by the litres per 100 km.'], text: 'e NR fuel' });
      } }] },
      { num: '16', stem: '', parts: [{ id: 'e16', level: 'EMG', make: function (r) { return nrMarkup(r, 'phone charger', [16, 26]); } }] },
      { num: '17', section: 'C. Stretch', stem: function (s) { return 'In ' + s.city + ', a ' + s.it + ' costs ' + MM(s.U) + ' USD plus ' + N(s.tax) + '% sales tax. In Calgary, the same ' + s.it + ' costs ' + MM(s.K) + ' plus 5% GST. Use ' + t('1\\text{ USD}=1.38\\text{ CAD}') + '.'; },
        shared: function (r) {
          var c = r.pick([['Seattle', 10], ['Spokane', 9], ['Bellingham', 9], ['Seattle', 10]]), wantUS = r.chance(0.4);
          return find(function () { var U = r.int(60, 140), K = q(r.int(80, 200) - 0.01), USD = U * (1 + c[1] / 100); return { city: c[0], tax: c[1], it: r.pick(['jacket', 'pair of boots', 'hoodie', 'backpack']), U: U, K: K, USD: USD, SEA: r2(USD) * 1.38, CA: K * 1.05 }; },
            function (v) { var d = r2(v.SEA) - r2(v.CA); return (wantUS ? d < -0.5 : d > 0.5) && Math.abs(d) <= 12; }, { city: 'Seattle', tax: 10, it: 'jacket', U: 84, K: 119.99, USD: 92.4, SEA: 92.4 * 1.38, CA: 119.99 * 1.05 });
        }, parts: [
        { id: 'e17a', level: 'EMG', make: function (r, s) {
          var lo = Math.ceil(s.USD * 1.3 - 2), hi = Math.floor(s.USD * 1.45 + 2), Ur = Math.round(s.U * (1 + s.tax / 100)), key = Math.min(hi, Math.max(lo, Math.round(Ur * 1.4)));
          var p = { prompt: 'Estimate the ' + s.city + ' cost in Canadian dollars in your head.', input: { type: 'fields', fields: [{ label: 'Estimate:', name: 'Estimate', before: 'about $', after: 'CAD' }] }, check: K.fields([estChk(s.USD, { part: s.U, partHint: 'Add the ' + N(s.tax) + '% sales tax first (about ' + t('\\$' + Math.round(s.U * s.tax / 100)) + ').' })], { labels: [''] }), key: [String(key)],
            answer: 'about ' + t('\\$' + key) + ' (any estimate from ' + t('\\$' + lo) + ' to ' + t('\\$' + hi) + ' is fine)', solution: 'With tax: about ' + t(s.U + '+' + Math.round(s.U * s.tax / 100) + '=\\$' + Ur) + ' USD.<br>' + t(Ur + '\\times 1.4\\approx\\$' + Math.round(Ur * 1.4)) + ' CAD (adding a third gives about ' + t('\\$' + Math.round(Ur * 4 / 3)) + ').',
            hints: ['Add the sales tax (about ' + N(s.tax) + '%), then round.', 'Multiply by about 1.4 (or add about a third).'], text: 'e Seattle estimate' };
          p.bad = [[String(Math.round(s.USD))], [String(Math.round(s.USD / 1.38))]];
          return p;
        } },
        { id: 'e17b', level: 'MAS', make: function (r, s) {
          var a = r2(s.SEA), b = r2(s.CA), us = a < b, d = r2(Math.abs(a - b)), exactSea = s.USD * 1.38, cityL = s.city.toLowerCase();
          var specs = [
            mfld(s.city + ' (CAD):', a, { name: s.city, alts: [exactSea], diag: [{ v: s.U * 1.38, code: 'u1l11-no-ustax', hint: 'Add the ' + N(s.tax) + '% sales tax in US dollars first: ' + t(s.U + '\\times ' + mult(s.tax)) + '.' }, { v: s.USD, code: 'u1l11-no-convert', hint: 'That’s the US price with tax. Change it to CAD: multiply by 1.38.' }, { v: s.USD / 1.38, code: 'u1l11-divided', hint: 'You have USD and the rate starts with USD: multiply.' }, { v: s.U * 1.05 * 1.38, code: 'u1l11-gst-us', hint: 'In ' + s.city + ' the sales tax is ' + N(s.tax) + '%, not GST.' }] }),
            mfld('Calgary (with GST):', b, { name: 'Calgary', exact: s.CA, diag: [{ v: s.K, code: 'u1l11-no-tax', hint: 'Add the 5% GST: multiply by 1.05.' }, { v: s.K * 0.05, code: 'u1l11-tax-only', hint: 'That’s the GST alone.' }] }),
            wfld('Cheaper in:', 'city', us ? s.city : 'Calgary', us ? [cityL, 'us', 'usa'] : ['calgary', 'canada', 'alberta'], us ? ['calgary', 'canada', 'alberta'] : [cityL, 'us', 'usa'], 'Compare the two costs in Canadian dollars.', 'Type ' + s.city + ' or Calgary.', 'Which is cheaper'),
            mfld('by', d, { name: 'How much cheaper', alts: [Math.abs(exactSea - s.CA)], diag: [{ v: Math.abs(s.U * 1.38 - b), code: 'u1l11-no-ustax', hint: 'Use the ' + s.city + ' cost with its sales tax.' }, { v: Math.abs(a - s.K), code: 'u1l11-no-tax', hint: 'Use the Calgary cost with GST.' }, { v: Math.abs(s.USD - s.CA), code: 'u1l11-no-convert', hint: 'Change the ' + s.city + ' cost to CAD before you compare.' }, { v: a + b, code: 'u1l11-gave-total', hint: 'Subtract the two costs.' }] })];
          return fieldsPart('Find both costs exactly in Canadian dollars. Which is cheaper, and by how much?', specs,
            s.city + ': ' + t(s.U + '\\times ' + mult(s.tax) + '=' + Mt(s.USD)) + ' USD; ' + t(c2(s.USD) + '\\times 1.38' + toM(s.SEA)) + ' CAD<br>Calgary: ' + t(c2(s.K) + '\\times 1.05' + toM(s.CA)) + '<br>' + (us ? s.city : 'Calgary') + ' is cheaper by ' + t(Mt(Math.max(a, b)) + '-' + Mt(Math.min(a, b)) + '=' + Mt(d)) + '.',
            [s.city + ': add the sales tax in USD, then change to CAD.', 'Calgary: multiply by 1.05. Then subtract.'], 'e Seattle exact');
        } },
        { id: 'e17c', level: 'BEG', make: function (r, s) {
          return reasonMC(r, 'The prices are very close. Which is one other thing that could help you decide?', 'Returns are easier at home, and you don’t have to carry it while travelling. A bank’s selling rate or a card fee could also make the US price higher.',
            [['The Calgary price has GST, so it is always more.', 'Not always — and that’s the price you already compared. Think about returns, carrying it, or card fees.'], ['US prices are always lower.', 'Not true. Think about returns, carrying it, or card fees.'], ['The exchange rate never changes.', 'Rates change every day. Think about returns, carrying it, or card fees.']],
            'Other things: returns are easier at home; you don’t have to carry it on the trip; the bank’s selling rate or a card fee could make the US price higher.', ['Think about returns, travelling, and fees.'], 'e Seattle reason');
        } }] },
      { num: '18', stem: '', parts: [{ id: 'e18', level: 'MAS', make: function (r) {
        var v = find(function () { return [r.int(8, 30) * 5, r.pick([20, 25, 30, 40, 15])]; }, function (v) { return isInt(v[0] * (100 - v[1])); }, [90, 30]);
        var R = v[0], p = v[1], S = q(R * (1 - p / 100)), it = r.pick(['backpack', 'pair of skates', 'jacket', 'tent', 'sleeping bag']);
        return amtPart('After ' + p + '% off, a ' + it + '’s sale price is ' + MM(S) + '. What was the regular price? (Hint: what percent of the regular price is ' + MM(S) + '?)', R,
          { diag: [{ v: S * (1 + p / 100), code: 'u1l11-forward', hint: 'Adding ' + p + '% back doesn’t work: the ' + p + '% was of the <b>regular</b> price, not the sale price. ' + MM(S) + ' is ' + (100 - p) + '% of the regular price.' }, { v: S + p, code: 'u1l11-pct-dollars', hint: p + '% is not ' + t('\\$' + p) + '.' }, { v: S / (p / 100), code: 'u1l11-forward', hint: MM(S) + ' is the part you <b>pay</b>: ' + (100 - p) + '% of the regular price. Divide by ' + t(pay(p)) + '.' }, { v: S * (1 - p / 100), code: 'u1l11-forward', hint: 'That takes ' + p + '% off again. Work backwards: divide by ' + t(pay(p)) + '.' }],
            sol: p + '% off means you pay ' + (100 - p) + '% of the regular price. So ' + (100 - p) + '% is ' + MM(S) + '.<br>' + (isInt((100 - p) / 10) ? '10% is ' + t(c2(S) + '\\div ' + ((100 - p) / 10) + '=' + Mt(S / ((100 - p) / 10))) + ', so 100% is ' + t(c2(S / ((100 - p) / 10)) + '\\times 10=' + Mt(R)) : t(c2(S) + '\\div ' + pay(p) + '=' + Mt(R))) + '.<br>Check: ' + t(c2(R) + '\\times ' + pay(p) + '=' + c2(S)) + '. The regular price was ' + MM(R) + '.',
            hints: ['After ' + p + '% off, you pay ' + (100 - p) + '% of the regular price.', 'Regular price = sale price ÷ ' + pay(p) + '.'], text: 'e backwards' });
      } }] },
      { num: '19', stem: function (s) { return 'Concrete is mixed from cement, sand and gravel in the ratio ' + t(s.R.join(':')) + '. A crew needs ' + t(N(s.V) + '\\text{ m}^3') + ' of mix for a ' + s.job + '.'; },
        shared: function (r) { var R = r.pick([[1, 2, 3], [1, 2, 3], [1, 2, 4], [1, 3, 3], [1, 2, 5]]), n = R[0] + R[1] + R[2], u = r.pick([0.2, 0.25, 0.3, 0.4, 0.5, 0.15, 0.35]); return { R: R, n: n, u: u, V: q(n * u), bag: r.pick([0.03, 0.025, 0.04, 0.02]), job: r.pick(['shed pad', 'patio', 'sidewalk', 'garage step']) }; }, parts: [
        { id: 'e19a', level: 'PRG', make: function (r, s) {
          var lab = ['Cement', 'Sand', 'Gravel'], m3 = t('\\text{m}^3');
          var specs = s.R.map(function (p, i) { var x = q(p * s.u); return { label: lab[i] + ':', name: lab[i], after: m3, chk: amtChk(x, { dp: 3, plain: true, word: 'three decimal places', diag: [{ v: s.V / p, code: 'u1l11-term-div', hint: 'First add the terms: ' + t(s.R.join('+') + '=' + s.n) + ' parts. One part = ' + t(N(s.V) + '\\div ' + s.n) + '.' }, { v: s.V / 3, code: 'u1l11-equal', hint: 'The mix is ' + t(s.R.join(':')) + ', not equal amounts.' }, { v: p === 1 ? -1 : s.u, code: 'u1l11-per-part', hint: 'That’s one part. ' + lab[i] + ' is ' + p + ' parts.' }] }), key: nS(x), show: t(N(x) + '\\text{ m}^3') }; });
          return fieldsPart('How much of each material do they need?', specs, t(s.R.join('+') + '=' + s.n) + ' parts; one part: ' + t(N(s.V) + '\\div ' + s.n + '=' + N(s.u) + '\\text{ m}^3') + '<br>' + s.R.map(function (p, i) { return lab[i] + ' ' + t(N(q(p * s.u)) + '\\text{ m}^3'); }).join(', '),
            ['Add the terms to get the number of parts.', 'One part = total ÷ parts. Multiply by each term.'], 'e concrete');
        } },
        { id: 'e19b', level: 'ADV', make: function (r, s) {
          var ce = q(s.R[0] * s.u), ex = ce / s.bag, n = Math.ceil(ex - 1e-9);
          return amtPart('A bag of cement holds ' + t(N(s.bag) + '\\text{ m}^3') + '. How many bags do they need?', n, { dp: 0, plain: true, after: 'bags', word: 'a whole number of bags (round up: you can’t buy part of a bag)',
            diag: [{ v: Math.floor(ex + 1e-9), code: 'u1l11-round-down', hint: 'They need enough cement, so round <b>up</b> to the next whole bag.' }, { v: ce * s.bag, code: 'u1l11-times', hint: 'Divide the cement by the size of one bag.' }, { v: Math.ceil(s.V / s.bag - 1e-9), code: 'u1l11-whole-mix', hint: 'The bags are cement only: use the cement amount from part (a).' }],
            sol: t(N(ce) + '\\div ' + N(s.bag) + '=' + (isInt(q(ex)) ? N(q(ex)) : raw5(ex))) + (isInt(q(ex)) ? '' : ', so round up') + ': ' + n + ' bags', hints: ['Bags = cement ÷ size of one bag.', 'Round up if it isn’t a whole number.'], text: 'e bags' });
        } }] }]
  });

  /* NR markup percent (Q25, Extra 16): cost C, selling price S, to the nearest tenth of a percent */
  function nrMarkup(r, item, ex) {
    var v = find(function () { var C = r.int(4, 20) * 4, m = r.pick([12.5, 37.5, 62.5, 87.5, 25, 35, 45, 55, 32.5, 42.5]); return [C, q(C * (1 + m / 100)), m]; },
      function (v) { return isInt(v[1] * 100) && !(v[0] === 32 && near(v[1], 56)) && !(v[0] === 20) && rd(v[2], 1) < 100; }, [ex[0], ex[1], (ex[1] - ex[0]) / ex[0] * 100]);
    var C = v[0], S = v[1], mk = q(S - C), x = mk / C * 100, it = r.pick([item, item, 'water bottle', 'ball cap', 'phone stand']);
    return amtPart('<b>Numerical response.</b> A shop buys a ' + it + ' for ' + MM(C) + ' and sells it for ' + MM(S) + '. The markup percent, to the nearest tenth, is ________ %.', x, { dp: 1, pct: true, nr: true, exact: x,
      diag: [{ v: mk / S * 100, code: 'u1l11-div-new', hint: 'Markup percent is out of the <b>cost</b>, ' + MM(C) + '.' }, { v: S / C * 100, code: 'u1l11-ratio-pct', hint: 'Use the markup (' + MM(mk) + '): markup ÷ cost × 100.' }, { v: mk, code: 'u1l11-pct-dollars', hint: 'That’s the markup in dollars. Divide by the cost and multiply by 100.' }],
      sol: 'Markup: ' + t(c2(S) + '-' + c2(C) + '=' + Mt(mk)) + '; ' + t(c2(mk) + '\\div ' + N(C) + '\\times 100' + toN(x, 1) + '\\%'), hints: ['Markup % = markup ÷ cost × 100.'], text: 'NR markup' });
  }
})(window);
