/* Math 10-3 · Unit 4 · Lesson 3 — Temperature: Celsius and Fahrenheit (M2)
 * Assignment 3 (u4_l03.tex, Questions 1–18) and the Lesson 3 Extra Practice (u4_ep03.tex, A 1–5, B 6–11, C 12–14).
 * Every part is a generator: the same kind of temperature as the booklet item (a whole-number answer, a negative reading,
 * an oven temperature, an answer that needs rounding…) with new numbers around the booklet's (the lesson's worked-example
 * numbers are left out). Calculator allowed. Constants as the booklet gives them: F = 1.8 × C + 32, C = (F − 32) ÷ 1.8,
 * quick estimates F ≈ 2C + 30 and C ≈ (F − 30) ÷ 2, and a change of 1 Celsius degree = 1.8 Fahrenheit degrees.
 * Answers: temperatures to the nearest tenth unless the booklet says otherwise ("−6.7", "−6.7 °C" and the exact value
 * are right; −6.67 gets a "round to the nearest tenth" nudge that uses no try; rounding the wrong way is wrong with a hint).
 * Recognised wrong values each get their own hint: forgetting the +32, adding 32 before multiplying, the wrong formula,
 * leaving out the brackets (F − 32 ÷ 1.8), the quick estimate given as the exact answer, dropping a negative sign,
 * adding or subtracting 32 for a temperature CHANGE, subtracting the two readings across different scales.
 * Conversions: the referents table → labelled boxes; "write °C or °F" → a table of choices (°C / °F per row);
 * "use the estimate to show it can't be right", "what did he do wrong", "is the estimate good enough", "is it in range",
 * "which is colder and by how much" → multiple choice of reasons (with the evidence as a number part where it matters);
 * calculator keys → multiple choice of key sequences; "put in order" → the ordering input; fill-in tables → labelled
 * boxes with the given cells shown in the prompt.
 * Outcome M2 throughout (temperature conversion is the imperial ↔ SI outcome). Levels: LIM BEG EMG PRG ADV MAS.
 *
 * Shared kit (for Unit 4 Lesson 4, u4l4.js, which is loaded after this file): HW.u4kit — number/money checkers with
 * rounding nudges and per-value hints (num, fld), key caps, small formatting helpers. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;

  /* ================= HW.u4kit: numbers, checkers, part builders ================= */
  function q(x) { return Math.round(x * 1e9) / 1e9; }
  function rd(x, dp) { return K.roundTo(x, dp); }
  function trunc(x, dp) { var f = Math.pow(10, dp); return Math.trunc(x * f + (x >= 0 ? 1e-9 : -1e-9)) / f; }   // toward zero
  function same(a, b) { return Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(b)); }
  function nS(x, dp) { x = q(x); return dp != null ? x.toFixed(dp) : String(x); }
  function N(x, dp) { var s = nS(x, dp); return Math.abs(x) >= 10000 ? HW.fmt(s) : s; }            // TeX
  function Np(x, dp) { var s = nS(x, dp); return (Math.abs(x) >= 10000 ? HW.fmt(s, true) : s).replace(/^-/, '−'); }   // plain text
  function decs(x) { var s = nS(x); return (s.split('.')[1] || '').length; }
  function D(x) { return '\\$' + rd(x, 2).toFixed(2); }
  function Dp(x) { return '$' + rd(x, 2).toFixed(2); }
  function find(gen, test, fallback) { for (var i = 0; i < 400; i++) { var v = gen(); if (v && test(v)) return v; } return fallback; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function kc(s) { return '<span style="display:inline-block;min-width:1.5em;text-align:center;padding:0 5px;margin:0 2px;border:1px solid #6b7686;border-bottom-width:3px;border-radius:5px;background:#f4f6f9;color:#1d2633;font-weight:700;font-size:.9em;line-height:1.45;white-space:nowrap">' + s + '</span>'; }
  function keys(list) { return '<span style="white-space:nowrap">' + list.map(function (x) { return /^[−-]?[\d.]+$/.test(x) ? x : kc(x); }).join(' ') + '</span>'; }
  var TD = 'border:1px solid #c9b79c;padding:3px 10px;text-align:center';
  function table(head, rows) {
    return '<table style="border-collapse:collapse;margin:4px 0">' + (head ? '<tr>' + head.map(function (h) { return '<th style="' + TD + '">' + h + '</th>'; }).join('') + '</tr>' : '') +
      rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td style="' + TD + '">' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>';
  }

  function readNum(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\\$/g, '$').replace(/\\text\{([^}]*)\}/g, '$1').replace(/[−–]/g, '-').replace(/\s+/g, ' ').trim();
    s = s.replace(/^\$\s*/, '').replace(/\s*\$$/, '').trim();
    if (!s) return { code: 'empty' };
    var unit = null, m = /^(-?[\d.,]*\d\.?)\s*([a-zA-Z%°º²³\/¢][\s\S]*)$/.exec(s);
    if (m) { unit = m[2]; s = m[1]; }
    if (/^-?\d+,\d{1,2}$/.test(s)) return { code: 'comma' };
    var p = HW.parse.number(s); if (!p.ok) return { code: 'notnumber' };
    return { v: p.value, dec: (s.replace(/,/g, '').split('.')[1] || '').length, unit: unit };
  }
  function near(v, w, dec) {
    if (!isFinite(w)) return false;
    if (same(v, w)) return true;
    if (dec > 4 || (dec === 0 && Math.abs(w) < 20)) return false;
    var r1 = rd(w, dec), r2 = trunc(w, dec);
    return (r1 !== 0 && same(v, r1)) || (dec > 0 && r2 !== 0 && same(v, r2));
  }
  function slip(a) {
    if (a.code === 'empty') return form('empty', 'Type your answer first.');
    if (a.code === 'comma') return form('u4-comma', 'Use a decimal <b>point</b>, not a comma (for example 12.5).');
    return form('notnumber', 'Type a single number (the unit is already written beside the box).');
  }
  function badHit(bad, v, dec) {
    for (var i = 0; bad && i < bad.length; i++) { var b = bad[i]; if (near(v, b[0], dec)) return b[3] === 'form' ? form(b[1], b[2]) : wrong(b[1], b[2]); }
    return null;
  }
  function placeOf(o) { return o.money ? 'cent' : o.dp === 0 ? 'whole number' : o.dp === 1 ? 'tenth' : o.dp === 2 ? 'hundredth' : 'thousandth'; }
  /* a number. ans = the rounded answer; o: money, dp, exact, bad [[value, code, hint, 'form'?]], alt (other right values),
     within [lo, hi] (any value in the range is right), int (a whole number is required) */
  function numChk(ans, o) {
    o = o || {};
    var dp = o.money ? 2 : o.dp, exact = o.exact != null ? o.exact : ans, place = placeOf(o);
    return function (resp) {
      var a = readNum(resp); if (a.code) return slip(a);
      var v = a.v, h;
      if (o.within && v >= o.within[0] - 1e-9 && v <= o.within[1] + 1e-9) return ok();
      if (same(v, ans)) return ok();
      for (var i = 0; o.alt && i < o.alt.length; i++) if (same(v, o.alt[i])) return ok();
      if (dp != null && a.dec > dp && same(rd(v, dp), ans)) return form('round', 'Right — now round to the nearest ' + place + '.');
      if (dp != null && a.dec < dp && !same(rd(ans, a.dec), ans) && Math.abs(v - ans) < Math.pow(10, -a.dec) - 1e-9) return form('places', o.money ? 'Give the amount to the cent (two decimal places), like $12.50.' : 'Round to the nearest ' + place + '.');
      if ((h = badHit(o.bad, v, a.dec))) return h;
      if (dp != null && !same(exact, ans) && a.dec <= dp && Math.abs(Math.abs(v - ans) - Math.pow(10, -dp)) < 1e-9 && same(v, trunc(exact, dp)))
        return wrong('u4-round-dir', 'Check your rounding: look at the digit after the ' + place + (o.money ? 's (the third decimal place)' : 's') + '. 5 or more rounds up; 4 or less rounds down.');
      return wrong('value', null);
    };
  }
  function cleanBad(bad, ans, dp, alt, within) {
    var seen = [];
    return (bad || []).filter(function (b) {
      if (!b || !isFinite(b[0]) || same(b[0], ans) || (dp != null && same(rd(b[0], dp), ans)) || (alt || []).some(function (x) { return same(x, b[0]) || (dp != null && same(rd(b[0], dp), x)); })) return false;
      if (within && b[0] >= within[0] - 0.5 && b[0] <= within[1] + 0.5) return false;
      if (seen.some(function (x) { return same(x, b[0]); })) return false; seen.push(b[0]); return true;
    });
  }
  function keyOf(ans, o) { o = o || {}; return o.money ? rd(ans, 2).toFixed(2) : o.dp != null && decs(ans) > o.dp ? rd(ans, o.dp).toFixed(o.dp) : nS(ans); }
  /* exact value v; o: money, dp (round to), bad, alt, within, before, after, ans (TeX answer), sol, hints, text, nr */
  function prep(v, o) {
    o = o || {}; var dp = o.money ? 2 : o.dp, ans = dp != null ? rd(v, dp) : q(v);
    var bad = cleanBad(o.bad, ans, dp, o.alt, o.within);
    return { ans: ans, bad: bad, check: numChk(ans, { money: o.money, dp: o.dp, exact: v, bad: bad, alt: o.alt, within: o.within }), key: o.key || keyOf(ans, o) };
  }
  function num(prompt, v, o) {
    o = o || {}; var c = prep(v, o);
    var p = { prompt: prompt, input: { type: 'number', before: o.money ? '$' : o.before, after: o.after, nr: !!o.nr },
      check: c.check, key: c.key, answer: t(o.ans || ((o.money ? '\\$' : '') + N(Number(c.key), o.money ? 2 : decs(Number(c.key)) > 0 ? decs(Number(c.key)) : null) + (o.afterTex || (o.after ? '\\text{ ' + o.after + '}' : '')))),
      solution: o.sol, hints: o.hints || [], text: o.text };
    if (o.nr) p.input.before = null;
    p.bad = c.bad.filter(function (b) { return b[3] !== 'form'; }).map(function (b) { return nS(b[0]); });
    p.good = o.money ? ['$' + c.key] : [];
    return p;
  }
  /* several boxes. rows: [{label, name, v, o: {dp, money, bad, alt, within}, before, after, ansTxt}]; o.swap: give the
     "other box" hint between rows (default for 2 rows) */
  function fld(prompt, rows, sol, hints, text, o) {
    o = o || {};
    var swap = o.swap != null ? o.swap : rows.length === 2;
    var preps = rows.map(function (rw, i) {
      var ro = Object.assign({}, rw.o || {}), others = [];
      if (swap && !ro.within) rows.forEach(function (x, j) { if (j !== i && !(x.o || {}).within) others.push([x.v, 'u4-other-box', 'That’s the answer for the other box (' + (x.name || x.label) + '). Check which box is which.']); });
      ro.bad = (ro.bad || []).concat(others);
      return prep(rw.v, ro);
    });
    var keysA = preps.map(function (c) { return c.key; });
    var ansH = o.answer || rows.map(function (rw, i) { return rw.label + ' ' + (rw.ansTxt || ((rw.o || {}).money ? '$' : '') + Np(Number(keysA[i])) + (rw.after ? ' ' + rw.after : '')); }).join(' &nbsp; ');
    var p = P.fields(prompt, rows.map(function (rw) { return { label: rw.label, before: rw.before || ((rw.o || {}).money ? '$' : undefined), after: rw.after, name: rw.name || rw.label.replace(/:$/, '') }; }),
      preps.map(function (c) { return c.check; }), keysA, ansH, sol, hints, text);
    if (rows.length === 2 && !same(preps[0].ans, preps[1].ans) && !(rows[0].o || {}).within && !(rows[1].o || {}).within) p.bad = [[keysA[1], keysA[0]]];
    return p;
  }
  function mc(r, prompt, opts, sol, hints, text, keepOrder) { return P.mc(r, prompt, opts, sol, hints, text, keepOrder); }

  HW.u4kit = { q: q, rd: rd, trunc: trunc, same: same, nS: nS, N: N, Np: Np, decs: decs, D: D, Dp: Dp, find: find, cap: cap, kc: kc, keys: keys, TD: TD, table: table,
    readNum: readNum, near: near, slip: slip, numChk: numChk, cleanBad: cleanBad, keyOf: keyOf, prep: prep, num: num, fld: fld, mc: mc };

  /* ================= temperatures ================= */
  function toF(C) { return q(1.8 * C + 32); }
  function toC(F) { return (F - 32) / 1.8; }
  function par(x) { return x < 0 ? '(' + nS(x) + ')' : nS(x); }
  function dC(x, dp) { return Np(x, dp) + '&nbsp;°C'; }
  function dF(x, dp) { return Np(x, dp) + '&nbsp;°F'; }
  function r1(x) { return rd(x, 1); }
  function cS(c, dp) { dp = dp == null ? 1 : dp; return same(c, rd(c, dp)) ? '=' + nS(rd(c, dp)) : '\\approx ' + nS(rd(c, dp), dp); }
  /* worked lines */
  function cfWork(C) { return t('F=1.8\\times ' + par(C) + '+32') + '<br>' + t('F=' + nS(q(1.8 * C)) + '+32=' + nS(toF(C))) + ' °F'; }
  function cfLine(C) { return t('1.8\\times ' + par(C) + '+32=' + nS(q(1.8 * C)) + '+32=' + nS(toF(C))) + ' °F'; }
  function fcWork(F, dp) { var c = toC(F); return t('C=(' + nS(F) + '-32)\\div 1.8') + '<br>' + t('C=' + nS(q(F - 32)) + '\\div 1.8' + cS(c, dp)) + ' °C'; }
  function fcLine(F, dp) { var c = toC(F); return t('(' + nS(F) + '-32)\\div 1.8=' + nS(q(F - 32)) + '\\div 1.8' + cS(c, dp)) + ' °C'; }

  /* wrong values for °C → °F */
  function cfBad(C) {
    return [[1.8 * C, 'u4l3-no-32', 'You multiplied by 1.8 — now <b>add 32</b> (water freezes at 32 °F, not 0).'],
      [(C + 32) * 1.8, 'u4l3-order', 'Multiply by 1.8 <b>first</b>, then add 32: ' + t('1.8\\times ' + par(C) + '+32') + '.'],
      [toC(C), 'u4l3-wrong-formula', 'That’s the °F → °C formula. To change °C to °F, multiply by 1.8, then add 32.'],
      [2 * C + 30, 'u4l3-estimate', 'That’s the quick estimate (double, then add 30). Use the exact formula ' + t('F=1.8\\times C+32') + '.'],
      [1.8 * C - 32, 'u4l3-minus32', 'Add 32, don’t subtract it: ' + t('1.8\\times ' + par(C) + '+32') + '.'],
      [C + 32, 'u4l3-no-mult', 'Multiply by 1.8 first, then add 32.'],
      C < 0 ? [toF(-C), 'u4l3-sign', 'Keep the negative sign: ' + Np(C) + ' °C is below zero. Use the ' + kc('(−)') + ' key: 1.8 ' + kc('×') + ' ' + kc('(−)') + ' ' + Np(-C) + ' ' + kc('+') + ' 32.'] : null,
      toF(C) < 0 ? [-toF(C), 'u4l3-sign', 'Below −17.8 °C the Fahrenheit reading is below zero too, so the answer is negative.'] : null,
      C < 0 ? [-toF(-C), 'u4l3-sign', 'Only the ' + Np(C) + ' is negative: 1.8 × (' + Np(C) + ') = ' + Np(1.8 * C) + ', then add 32.'] : null];
  }
  /* wrong values for °F → °C */
  function fcBad(F) {
    return [[F - 32 / 1.8, 'u4l3-brackets', 'Without brackets the calculator divides first. Subtract 32 <b>first</b>: ' + kc('(') + ' ' + Np(F) + ' ' + kc('−') + ' 32 ' + kc(')') + ' ' + kc('÷') + ' 1.8.'],
      [F - 32, 'u4l3-no-div', 'You subtracted 32 — now <b>divide by 1.8</b>.'],
      [F / 1.8 - 32, 'u4l3-order', 'Subtract 32 <b>first</b>, then divide by 1.8.'],
      [(F - 32) * 1.8, 'u4l3-times', 'Divide by 1.8, don’t multiply. (Celsius degrees are bigger, so there are fewer of them.)'],
      [toF(F), 'u4l3-wrong-formula', 'That’s the °C → °F formula. To change °F to °C, subtract 32, then divide by 1.8.'],
      [(F - 30) / 2, 'u4l3-estimate', 'That’s the quick estimate. Use the exact formula ' + t('C=(F-32)\\div 1.8') + '.'],
      [(F + 32) / 1.8, 'u4l3-plus32', 'Subtract 32, don’t add it: ' + t('(' + nS(F) + '-32)\\div 1.8') + '.'],
      [F / 1.8, 'u4l3-no-32', 'Subtract 32 first, then divide by 1.8.'],
      F < 32 ? [-toC(F), 'u4l3-sign', 'Below 32 °F is below 0 °C, so the answer is negative.'] : null,
      F < 0 ? [toC(-F), 'u4l3-sign', 'Keep the negative sign: the reading is ' + Np(F) + ' °F. ' + t('(' + nS(F) + '-32)\\div 1.8') + '.'] : null,
      F < 0 ? [-toC(-F), 'u4l3-sign', 'Start with ' + t(nS(F) + '-32=' + nS(F - 32)) + ' (going further below zero), then divide by 1.8.'] : null];
  }
  function cfPart(prompt, C, o) {
    o = o || {};
    return num(prompt, toF(C), { after: '°F', afterTex: '^\\circ\\text{F}', bad: cfBad(C).concat(o.bad || []), sol: o.sol || cfWork(C), hints: o.hints || ['F = 1.8 × C + 32: multiply by 1.8, then add 32.'].concat(C < 0 ? ['Use the ' + kc('(−)') + ' key for a temperature below zero.'] : []), text: o.text || 'C to F ' + C });
  }
  function fcPart(prompt, F, o) {
    o = o || {}; var dp = o.dp == null ? 1 : o.dp;
    return num(prompt, toC(F), { dp: dp, after: '°C', afterTex: '^\\circ\\text{C}', nr: o.nr, bad: fcBad(F).concat(o.bad || []), alt: o.alt, sol: o.sol || fcWork(F, dp), hints: o.hints || ['C = (F − 32) ÷ 1.8: subtract 32 first, then divide by 1.8.', 'Use brackets on the calculator: ' + keys(['(', Np(F), '−', '32', ')', '÷', '1.8', 'ENTER']) + '.'], text: o.text || 'F to C ' + F });
  }
  /* exclusions: the lesson's worked-example numbers */
  var EX_C = [25, 37, -15, 230, 22.5, -30, 21, -8, 10, -20, 0, 28, 7, -21, -25, 4, 100, 200, 20, 30, -40];
  var EX_F = [86, 100, 0, -13, 425, 59, 375, 165, 54, 450, -15, 38, 80, 98.6, 212, 32, -40];
  function okC(c) { return EX_C.indexOf(c) < 0; }
  function okF(f) { return EX_F.indexOf(f) < 0; }
  function pickC(r, arr) { return r.pick(arr.filter(okC)); }
  function pickF(r, arr) { return r.pick(arr.filter(okF)); }

  HW.addCodes({
    'u4l3-no-32': 'Left out the 32', 'u4l3-order': 'Did the two steps in the wrong order', 'u4l3-wrong-formula': 'Used the formula for the other direction', 'u4l3-estimate': 'Gave the quick estimate, not the exact value',
    'u4l3-minus32': 'Subtracted 32 instead of adding', 'u4l3-plus32': 'Added 32 instead of subtracting', 'u4l3-no-mult': 'Forgot to multiply by 1.8', 'u4l3-no-div': 'Forgot to divide by 1.8', 'u4l3-times': 'Multiplied by 1.8 instead of dividing',
    'u4l3-sign': 'Dropped a negative sign', 'u4l3-brackets': 'Left out the brackets: F − 32 ÷ 1.8', 'u4l3-change32': 'Added/subtracted 32 for a temperature change', 'u4l3-change-div': 'Divided instead of multiplying for a change',
    'u4l3-change-mult': 'Multiplied instead of dividing for a change', 'u4l3-no-change': 'Did not change the size of the change to the other scale', 'u4l3-neg-sub': 'Subtracted the numbers without the negative sign',
    'u4l3-mixed-scales': 'Compared a °F number with a °C number', 'u4l3-wrong-way': 'Chose the wrong one (colder/hotter, in/out of range)', 'u4l3-round-early': 'Rounded before subtracting', 'u4l3-swap': 'Answers in each other’s boxes',
    'u4-other-box': 'Answers in each other’s boxes', 'u4-neg': 'Gave a negative distance', 'u4l3-round-down': 'Rounded down below the rule', 'u4l3-whole': 'Did not give a whole-degree reading', 'u4l3-per-degree': 'Gave the error per degree, not per 5 degrees', 'u4-round-dir': 'Rounded the wrong way', 'u4-comma': 'Decimal comma', 'u4l3-unit': 'Chose the wrong scale for a temperature'
  });
  HW.addPartial({
    'u4l3-no-32': 'b', 'u4l3-order': 'n', 'u4l3-wrong-formula': 'n', 'u4l3-estimate': 'b', 'u4l3-minus32': 'b', 'u4l3-plus32': 'b', 'u4l3-no-mult': 'n', 'u4l3-no-div': 'b', 'u4l3-times': 'n',
    'u4l3-sign': 'b', 'u4l3-brackets': 'b', 'u4l3-change32': 'b', 'u4l3-change-div': 'n', 'u4l3-change-mult': 'n', 'u4l3-no-change': 'b', 'u4l3-neg-sub': 'b', 'u4l3-mixed-scales': 'n', 'u4l3-round-early': 's',
    'u4-round-dir': 's'
  });

  /* ================= part builders ================= */
  /* a temperature CHANGE in °C → °F (o.sol, o.prompt) */
  function chgCF(prompt, dc, o) {
    o = o || {};
    return num(prompt, q(1.8 * dc), { after: 'Fahrenheit degrees', bad: [[1.8 * dc + 32, 'u4l3-change32', 'This is a <b>change</b>, not a thermometer reading: only multiply by 1.8. Don’t add 32.'], [dc / 1.8, 'u4l3-change-div', 'A Celsius degree is bigger than a Fahrenheit degree, so the change in °F is a bigger number: multiply by 1.8.'], [dc + 32, 'u4l3-change32', 'For a change, don’t add 32: just multiply by 1.8.'], [dc, 'u4l3-no-change', 'That’s the change in <b>Celsius</b> degrees. Multiply by 1.8 to get Fahrenheit degrees.'], [2 * dc, 'u4l3-estimate', 'Use the exact factor 1.8, not 2.']].concat(o.bad || []),
      sol: o.sol || t('1.8\\times ' + nS(dc) + '=' + nS(q(1.8 * dc))) + ' Fahrenheit degrees<br>(No +32: this is a change.)', hints: ['Change in °F = 1.8 × change in °C.', 'Don’t add 32: that is only for thermometer readings.'], text: o.text || 'change C to F' });
  }
  function chgFC(prompt, df, o) {
    o = o || {};
    return num(prompt, df / 1.8, { dp: 1, after: 'Celsius degrees', bad: [[(df - 32) / 1.8, 'u4l3-change32', 'This is a <b>change</b>, not a thermometer reading: don’t subtract 32. Only divide by 1.8.'], [df * 1.8, 'u4l3-change-mult', 'A Celsius degree is bigger, so the change in °C is a smaller number: divide by 1.8.'], [df - 32, 'u4l3-change32', 'For a change, don’t subtract 32: just divide by 1.8.'], [df, 'u4l3-no-change', 'That’s the change in <b>Fahrenheit</b> degrees. Divide by 1.8 to get Celsius degrees.'], [df / 2, 'u4l3-estimate', 'Use the exact factor 1.8, not 2.']].concat(o.bad || []),
      sol: o.sol || t(nS(df) + '\\div 1.8' + cS(df / 1.8)) + ' Celsius degrees<br>(No −32: this is a change.)', hints: ['Change in °C = change in °F ÷ 1.8.', 'Don’t subtract 32: that is only for thermometer readings.'], text: o.text || 'change F to C' });
  }
  /* which is colder/hotter, and by how many Celsius degrees: c = the °C reading, f = the °F reading */
  function compareMC(r, prompt, c, f, hotter, o) {
    o = o || {};
    var fc = toC(f), d = r1(Math.abs(c - fc)), cWins = hotter ? c > fc : c < fc, word = hotter ? 'hotter' : 'colder';
    var A = { c: dC(c), f: dF(f) }, raw = q(Math.abs(c - f));
    var opts = [
      { html: '<b>' + (cWins ? A.c : A.f) + '</b> is ' + word + ', by about ' + Np(d) + ' Celsius degrees.', right: true },
      { html: '<b>' + (cWins ? A.f : A.c) + '</b> is ' + word + ', by about ' + Np(d) + ' Celsius degrees.', why: 'Change ' + A.f + ' to °C first: ' + fcLine(f) + '. Then compare it with ' + A.c + (c < 0 || fc < 0 ? ' (on the number line, lower is colder).' : '.'), code: 'u4l3-wrong-way' },
      { html: '<b>' + (c > f === hotter ? A.c : A.f) + '</b> is ' + word + ', by ' + Np(raw) + ' degrees.', why: 'You can’t compare a °C number with a °F number. Change ' + A.f + ' to °C first.', code: 'u4l3-mixed-scales' },
      { html: 'They are exactly the same temperature.', why: 'They are close, but not the same. Change ' + A.f + ' to °C and subtract.', code: 'same' }];
    if (same(raw, d)) opts.splice(2, 1);
    return mc(r, prompt, opts, (o.pre || '') + 'Change ' + A.f + ' to °C:<br>' + fcLine(f) + '<br>' + (cWins ? A.c : A.f) + ' is ' + word + ', by about ' + t(nS(r1(Math.max(c, fc))) + '-' + par(r1(Math.min(c, fc))) + '\\approx ' + nS(d)) + ' Celsius degrees.', ['Change the °F temperature to °C first.', 'On a thermometer, lower numbers are colder (−26 is colder than −25).'], o.text || 'compare');
  }
  /* yes/no decision MC: yes = the right decision is "yes"; why texts */
  function yesNo(r, prompt, yes, yesHtml, noHtml, sol, hints, text, extra) {
    var opts = [{ html: yesHtml, right: yes, why: yes ? null : 'Compare your °C (or °F) value with the rule again.', code: 'said-yes' }, { html: noHtml, right: !yes, why: !yes ? null : 'Compare your °C (or °F) value with the rule again.', code: 'said-no' }].concat(extra || []);
    return mc(r, prompt, opts, sol, hints, text, true);
  }

  /* the quick-estimate "good enough?" item: dir 'CF' or 'FC'; kind 'weather' | 'oven' | 'coat' */
  function estFields(prompt, dir, x, text) {
    if (dir === 'CF') {
      var e = 2 * x + 30, ex = toF(x);
      return fld(prompt, [{ label: 'Estimate:', name: 'Estimate', v: e, after: '°F', o: { bad: [[ex, 'u4l3-swap', 'That’s the exact value. The estimate is double, then add 30.']] } },
        { label: 'Exact:', name: 'Exact', v: ex, after: '°F', o: { bad: cfBad(x) } }],
        'Estimate: ' + t('2\\times ' + par(x) + '+30=' + nS(e)) + ' °F<br>Exact: ' + cfLine(x), ['Estimate: double, then add 30.', 'Exact: 1.8 × C + 32.'], text, { swap: false });
    }
    var e2 = (x - 30) / 2, c = toC(x);
    return fld(prompt, [{ label: 'Estimate:', name: 'Estimate', v: e2, after: '°C', o: { dp: 1, bad: [[c, 'u4l3-swap', 'That’s the exact value. The estimate is subtract 30, then halve.']] } },
      { label: 'Exact:', name: 'Exact', v: c, after: '°C', o: { dp: 1, bad: fcBad(x) } }],
      'Estimate: ' + t('(' + nS(x) + '-30)\\div 2=' + nS(q(x - 30)) + '\\div 2=' + nS(e2)) + ' °C<br>Exact: ' + fcLine(x), ['Estimate: subtract 30, then halve.', 'Exact: (F − 32) ÷ 1.8, to the nearest tenth.'], text, { swap: false });
  }
  function goodEnoughMC(r, prompt, dir, x, kind, text) {
    var est = dir === 'CF' ? 2 * x + 30 : (x - 30) / 2, ex = dir === 'CF' ? toF(x) : r1(toC(x)), off = r1(Math.abs(est - ex)), u = dir === 'CF' ? '°F' : '°C', good = off <= 5;
    var opts;
    if (kind === 'oven') opts = [
      { html: '<b>No.</b> The estimate is ' + Np(off) + ' degrees too ' + (est > ex ? 'hot' : 'cool') + ', so the food could ' + (est > ex ? 'burn' : 'cook too slowly') + '. Use the formula for ovens.', right: !good },
      { html: '<b>Yes.</b> It is only ' + Np(off) + ' degrees off, and an oven is just a guide.', why: Np(off) + ' degrees is a lot for baking. The estimate is far off for hot temperatures.', code: 'est-ok-oven' },
      { html: '<b>Yes.</b> The quick estimate is always within a few degrees.', why: 'It is close for everyday weather, but far off for very hot temperatures like an oven.', code: 'est-always' }];
    else opts = [
      { html: '<b>Yes.</b> The estimate is only ' + Np(off) + ' degree' + (off === 1 ? '' : 's') + ' off, which is fine for ' + (kind === 'coat' ? 'deciding what to wear' : 'weather') + '.', right: good },
      { html: '<b>No.</b> An estimate is never good enough; always use the exact formula.', why: 'For everyday weather the estimate is very close — good enough to decide what to wear.', code: 'est-never' },
      { html: '<b>No.</b> The estimate is more than 10 degrees off.', why: 'Compare the estimate and the exact value: they are only ' + Np(off) + ' degrees apart.', code: 'est-far' }];
    if (kind === 'coat') opts.push({ html: '<b>Yes</b>, and it is warm enough to go without a jacket.', why: 'About ' + Np(Math.round(ex)) + ' °C is cold. Most people want a warm coat.', code: 'warm' });
    return mc(r, prompt, opts, 'Estimate ' + Np(est) + ' ' + u + ', exact ' + Np(ex) + ' ' + u + ': ' + Np(off) + ' degree' + (off === 1 ? '' : 's') + ' apart.<br>' + (good ? 'Yes, good enough' + (kind === 'coat' ? ': about ' + Np(Math.round(ex)) + ' °C is cold, so wear a warm coat.' : ' for weather.') : 'No: that is too far off for an oven. Use the formula.'), ['How far apart are the estimate and the exact value?', 'A few degrees doesn’t matter for weather; it does for cooking.'], text);
  }

  /* ---- Extra C13: one temperature where the °F number is double / k more than the °C number ---- */
  var SPECIAL = [{ kind: 'double', C: 160, lo: [100, 120, 150], hi: [180, 200] }, { kind: 'more', k: 40, C: 10, lo: [0, 5], hi: [15, 20, 30] }, { kind: 'more', k: 48, C: 20, lo: [5, 10, 15], hi: [30, 40] }, { kind: 'more', k: 72, C: 50, lo: [30, 40, 45], hi: [60, 70] }];

  /* ================= lesson ================= */
  HW.defineLesson({
    id: 'u4l3', unit: 4, num: '3', title: 'Temperature: Celsius and Fahrenheit', outcome: 'M2',
    blurb: 'Referents, converting °C ↔ °F with the formulas, quick estimates in your head, and comparing temperatures and temperature changes.',
    questions: [
      { num: '1', stem: 'Complete the table of referents (temperatures to remember).', parts: [
        { id: '1', level: 'LIM', make: function (r) {
          var R = [['(a) Water freezes', 0, 32], ['(b) Water boils', 100, 212], ['(c) Normal body temperature', 37, 98.6], ['(d) A comfortable room (about)', 21, 70]];
          var rows = [];
          R.forEach(function (x, i) {
            var room = i === 3;
            rows.push({ label: x[0] + ':', name: x[0].slice(4) + ' °C', v: x[1], after: '°C', ansTxt: (room ? 'about 21 (20 to 22)' : Np(x[1])) + ' °C', o: room ? { within: [20, 22] } : { bad: [[x[2], 'u4l3-unit', 'That’s the <b>Fahrenheit</b> number. Which number goes with °C?']] } });
            rows.push({ label: x[0] + ':', name: x[0].slice(4) + ' °F', v: x[2], after: '°F', ansTxt: (room ? 'about 70 (68 to 72)' : Np(x[2])) + ' °F', o: room ? { within: [68, 72] } : { bad: [[x[1], 'u4l3-unit', 'That’s the <b>Celsius</b> number. Which number goes with °F?']] } });
          });
          var p = fld('Fill in the °C and °F temperature for each referent.', rows, 'Water freezes: 0 °C = 32 °F<br>Water boils: 100 °C = 212 °F<br>Normal body temperature: 37 °C = 98.6 °F<br>A comfortable room: about 21 °C = about 70 °F (20 to 22 °C, 68 to 72 °F)',
            ['From freezing to boiling is 100 Celsius degrees or 180 Fahrenheit degrees.', 'Water freezes at 32 °F, not 0 °F.'], 'referents', { swap: false, answer: 'Freezes 0 °C = 32 °F; boils 100 °C = 212 °F; body 37 °C = 98.6 °F; room about 21 °C = about 70 °F' });
          return p;
        } }] },
      { num: '2', stem: 'Each temperature is missing its unit. Choose °C or °F so that it makes sense.', parts: [
        { id: '2', level: 'BEG', make: function (r) {
          var CC = [['A hot bath', '40'], ['A fresh cup of coffee', '70'], ['A glass of ice water', '2'], ['A hot summer afternoon in Calgary', '30'], ['A cake baking in the oven', '180'], ['A pot of boiling soup', '100'], ['A child with a normal temperature', '37'], ['A cozy bedroom', '20'], ['A hot tub', '39'], ['A cup of hot tea', '75'], ['A warm summer evening', '22']];
          var FF = [['A summer afternoon in Las Vegas', '105'], ['A comfortable living room', '70'], ['An oven roasting potatoes', '400'], ['A sunny beach day in Florida', '88'], ['A nice spring day', '65'], ['A healthy person’s body temperature', '98.6'], ['A hot day in Texas', '95'], ['A cozy house in winter', '68'], ['An oven baking cookies', '350'], ['A cool fall day', '50']];
          var nc = r.int(1, 3), pick = r.shuffle(r.sample(CC, nc).map(function (x) { return x.concat('C'); }).concat(r.sample(FF, 4 - nc).map(function (x) { return x.concat('F'); })));
          var rows = pick.map(function (x, i) { return { id: 'r' + i, html: '(' + 'abcd'.charAt(i) + ') ' + x[0] + ': ' + x[1].replace('-', '−') + ' ___', label: x[0] }; });
          var want = {}; pick.forEach(function (x, i) { want['r' + i] = x[2]; });
          var other = function (x) { var n = Number(x[1]); return x[2] === 'C' ? Np(n) + ' °F is only about ' + Np(Math.round(toC(n))) + ' °C' : Np(n) + ' °C would be about ' + Np(Math.round(toF(n))) + ' °F'; };
          var why = function (row) { var i = Number(row.slice(1)), x = pick[i]; return { code: 'u4l3-unit', hint: '(' + 'abcd'.charAt(i) + ') ' + x[0] + ': ' + other(x) + ' — does that make sense? Try the other scale.' }; };
          return P.grid('Choose °C or °F for each temperature.', rows, [{ id: 'C', html: '°C', label: '°C' }, { id: 'F', html: '°F', label: '°F' }], want, { rowHead: 'Temperature', why: why },
            pick.map(function (x, i) { return '(' + 'abcd'.charAt(i) + ') ' + x[0] + ': ' + Np(Number(x[1])) + ' °' + x[2] + ' (' + other(x) + ')'; }).join('<br>'),
            ['Use the referents: water freezes at 0 °C = 32 °F and boils at 100 °C = 212 °F; a room is about 21 °C = 70 °F.'], 'C or F');
        } }] },
      { num: '3', stem: 'Change each temperature to degrees Fahrenheit.', parts: [
        { id: '3a', level: 'BEG', make: function (r) { var C = pickC(r, [20, 30, 40, 50, 60]); return cfPart(dC(C), C); } },
        { id: '3b', level: 'BEG', make: function (r) { var C = pickC(r, [1, 2, 3, 5, 6, 8, 9]); return cfPart(dC(C), C); } },
        { id: '3c', level: 'EMG', make: function (r) { var C = pickC(r, [-5, -10, -12, -16, -2, -6]); return cfPart(dC(C), C); } },
        { id: '3d', level: 'EMG', make: function (r) { var C = pickC(r, [12.5, 15.5, 17.5, 18.5, 23.5, 26.5, 31.5]); return cfPart(dC(C), C); } },
        { id: '3e', level: 'BEG', make: function (r) { var C = pickC(r, [150, 160, 175, 190, 220, 240, 260]); return cfPart(dC(C), C); } },
        { id: '3f', level: 'EMG', make: function (r) { var C = pickC(r, [-35, -45, -50, -32, -28, -24]); return cfPart(dC(C), C); } }] },
      { num: '4', stem: 'Change each temperature to degrees Celsius. Round to the nearest tenth of a degree.', parts: [
        { id: '4a', level: 'BEG', make: function (r) { var F = pickF(r, [68, 95, 104, 113, 122]); return fcPart(dF(F), F); } },
        { id: '4b', level: 'BEG', make: function (r) { var F = pickF(r, [41, 50, 68]); return fcPart(dF(F), F); } },
        { id: '4c', level: 'EMG', make: function (r) { var F = pickF(r, [300, 325, 350, 400, 475, 500]); return fcPart(dF(F), F); } },
        { id: '4d', level: 'EMG', make: function (r) { var F = pickF(r, [10, 15, 18, 20, 25, 28]); return fcPart(dF(F), F); } },
        { id: '4e', level: 'PRG', make: function (r) { var F = pickF(r, [-4, -22, -31, -10, -18, -25, -5]); return fcPart(dF(F), F); } },
        { id: '4f', level: 'EMG', make: function (r) { var F = pickF(r, [60, 64, 72, 75, 79, 82, 88]); return fcPart(dF(F), F); } }] },
      { num: '5', stem: function (sh) { return 'Noah changes ' + dF(sh.F) + ' to °C. He types ' + keys([String(sh.F), '−', '32', '÷', '1.8', 'ENTER']) + ' and gets ' + Np(sh.w) + '.'; },
        shared: function (r) { var F = pickF(r, [77, 68, 95, 104, 82, 90, 72, 113]); return { F: F, w: r1(F - 32 / 1.8), e: (F - 30) / 2, c: toC(F) }; },
        parts: [
          { id: '5a', level: 'EMG', make: function (r, sh) {
            return mc(r, 'Which quick estimate shows that his answer cannot be right?', [
              { html: t('(' + sh.F + '-30)\\div 2=' + nS(sh.e)) + ', so the answer should be about ' + Np(Math.round(sh.e)) + ' °C, not ' + Np(sh.w) + '.', right: true },
              { html: t('2\\times ' + sh.F + '+30=' + (2 * sh.F + 30)) + ', so the answer should be much bigger than ' + Np(sh.w) + '.', why: 'That’s the estimate for going from °C to °F. To go from °F to °C, subtract 30 and halve.', code: 'u4l3-wrong-formula' },
              { html: Np(sh.w) + ' is less than ' + sh.F + ', so it is about right.', why: 'Being smaller doesn’t make it right. Estimate: subtract 30, then halve.', code: 'smaller' },
              { html: t('(' + sh.F + '-30)\\div 2=' + nS(sh.e)) + ', which is close to ' + Np(sh.w) + ', so his answer is fine.', why: Np(sh.e) + ' is <b>not</b> close to ' + Np(sh.w) + '. His answer is far too big.', code: 'close' }],
              'Estimate: ' + t('(' + sh.F + '-30)\\div 2=' + nS(q(sh.F - 30)) + '\\div 2=' + nS(sh.e)) + '<br>The answer should be about ' + Np(Math.round(sh.e)) + ' °C, not ' + Np(sh.w) + '.', ['Quick estimate: C ≈ (F − 30) ÷ 2.'], 'Noah estimate');
          } },
          { id: '5bi', sub: 'b i', level: 'EMG', make: function (r, sh) {
            return mc(r, 'What did Noah do wrong?', [
              { html: 'He left out the brackets, so the calculator did ' + t('32\\div 1.8') + ' first.', right: true },
              { html: 'He should have multiplied by 1.8 instead of dividing.', why: 'Dividing by 1.8 is right for °F → °C. The problem is the order the calculator did the steps in.', code: 'u4l3-times' },
              { html: 'He should have added 32 instead of subtracting it.', why: 'Subtracting 32 is right for °F → °C. The problem is what the calculator did first.', code: 'u4l3-plus32' },
              { html: 'He should have divided first, then subtracted 32.', why: 'That is what his calculator did! Subtract 32 first (use brackets), then divide.', code: 'u4l3-order' }],
              'Order of operations: the calculator divides before it subtracts, so it did ' + t(sh.F + '-(32\\div 1.8)') + '.<br>Use brackets: ' + keys(['(', String(sh.F), '−', '32', ')', '÷', '1.8', 'ENTER']) + '.', ['Which does the calculator do first: − or ÷?'], 'Noah mistake');
          } },
          { id: '5bii', sub: 'b ii', level: 'EMG', make: function (r, sh) { return fcPart('Find the correct answer, to the nearest tenth.', sh.F, { bad: [[sh.w, 'u4l3-brackets', 'That’s Noah’s answer. Use brackets so the calculator subtracts first.']] }); } }] },
      { num: '6', stem: function (sh) { return sh.ctx[0] + ' should be between ' + dC(sh.lo) + ' and ' + dC(sh.hi) + '. ' + sh.ctx[1] + ' has a thermometer from the US that shows only °F.'; },
        shared: function (r) { var c = r.pick([['The water in a tropical fish tank', 'Mei', [24, 27]], ['The water in a tropical fish tank', 'Mei', [25, 28]], ['The water in a hot tub', 'Owen', [36, 39]], ['A warm spot for bread dough to rise', 'Priya', [24, 29]], ['A fridge', 'Dan', [1, 3]], ['A room for growing mushrooms', 'Sam', [16, 18]]]); return { ctx: [c[0], c[1]], lo: c[2][0], hi: c[2][1] }; },
        parts: [
          { id: '6', level: 'EMG', make: function (r, sh) {
            return fld('Between which two °F readings should it be?', [{ label: 'Lowest:', name: 'Lowest', v: toF(sh.lo), after: '°F', o: { bad: cfBad(sh.lo) } }, { label: 'Highest:', name: 'Highest', v: toF(sh.hi), after: '°F', o: { bad: cfBad(sh.hi) } }],
              cfLine(sh.lo) + '<br>' + cfLine(sh.hi) + '<br>It should be between ' + dF(toF(sh.lo)) + ' and ' + dF(toF(sh.hi)) + '.', ['Change each end of the range: F = 1.8 × C + 32.'], 'range C to F');
          } }] },
      { num: '7', stem: function (sh) { return 'On a summer road trip through ' + sh.where + ', a bank sign reads ' + dF(sh.F) + '.'; },
        shared: function (r) { return find(function () { var F = r.int(92, 112), c = toC(F), H = Math.round(c) + r.pick([-6, -5, -4, -3, 3, 4, 5]); return { where: r.pick(['Utah', 'Nevada', 'Arizona', 'Montana']), F: F, c: c, H: H }; }, function (s) { return okF(s.F) && Math.abs(r1(s.c) - s.H) >= 1.5 && s.H >= 28; }, { where: 'Utah', F: 104, c: 40, H: 35 }); },
        parts: [
          { id: '7a', level: 'EMG', make: function (r, sh) { return fcPart('What is this temperature in °C? Round to the nearest tenth.', sh.F); } },
          { id: '7b', level: 'EMG', make: function (r, sh) {
            var cc = r1(sh.c), hot = cc > sh.H, d = r1(Math.abs(cc - sh.H)), raw = Math.abs(sh.F - sh.H);
            return mc(r, 'Is it hotter or colder than a ' + dC(sh.H) + ' day in Medicine Hat? By how many Celsius degrees?', [
              { html: (hot ? 'Hotter' : 'Colder') + ', by ' + Np(d) + ' Celsius degrees.', right: true },
              { html: (hot ? 'Colder' : 'Hotter') + ', by ' + Np(d) + ' Celsius degrees.', why: 'Compare ' + dC(cc) + ' with ' + dC(sh.H) + ': which number is bigger?', code: 'u4l3-wrong-way' },
              { html: 'Hotter, by ' + Np(raw) + ' degrees.', why: 'You can’t subtract a °C number from a °F number. Use your answer to (a).', code: 'u4l3-mixed-scales' },
              { html: 'About the same: both are hot summer days.', why: 'Find the difference: your answer to (a) minus ' + sh.H + '.', code: 'same' }],
              'From (a): ' + fcLine(sh.F) + '<br>' + (hot ? 'Hotter' : 'Colder') + ', by ' + t(nS(Math.max(cc, sh.H)) + '-' + nS(Math.min(cc, sh.H)) + '=' + nS(d)) + ' Celsius degrees.', ['Use your °C answer from (a) and subtract.'], 'Utah compare');
          } }] },
      { num: '8', stem: function (sh) { return 'Marco runs the ice plant at an arena in Red Deer. The manual for the US-made equipment says to keep the ice surface between ' + dF(sh.f1) + ' and ' + dF(sh.f2) + '. His display shows the ice is at ' + dC(sh.c) + '.'; },
        shared: function (r) { return find(function () { var f1 = r.int(18, 24), f2 = f1 + r.pick([3, 4, 5]), lo = toC(f1), hi = toC(f2), c = r.int(-9, -1); return { f1: f1, f2: f2, lo: lo, hi: hi, c: c, inR: c >= lo && c <= hi }; }, function (s) { return Math.abs(s.c - s.lo) > 0.25 && Math.abs(s.c - s.hi) > 0.25 && !(s.f1 === 22 && s.f2 === 26 && s.c === -4) && (s.inR || Math.min(Math.abs(s.c - s.lo), Math.abs(s.c - s.hi)) < 2.5); }, { f1: 20, f2: 24, lo: toC(20), hi: toC(24), c: -5, inR: true }); },
        parts: [
          { id: '8a', level: 'ADV', make: function (r, sh) {
            return fld('Write the range in °C, to the nearest tenth.', [{ label: 'From:', name: 'Low end', v: sh.lo, after: '°C', o: { dp: 1, bad: fcBad(sh.f1) } }, { label: 'To:', name: 'High end', v: sh.hi, after: '°C', o: { dp: 1, bad: fcBad(sh.f2) } }],
              fcLine(sh.f1) + '<br>' + fcLine(sh.f2) + '<br>The range is ' + dC(r1(sh.lo)) + ' to ' + dC(r1(sh.hi)) + '.', ['Change each end: C = (F − 32) ÷ 1.8.', 'Both ends are below freezing, so both answers are negative.'], 'ice range');
          } },
          { id: '8b', level: 'PRG', make: function (r, sh) {
            var lo = r1(sh.lo), hi = r1(sh.hi), cf = toF(sh.c);
            return yesNo(r, 'Is the ice in the right range?', sh.inR,
              '<b>Yes.</b> ' + Np(sh.c) + ' is between ' + Np(lo) + ' and ' + Np(hi) + '.', '<b>No.</b> ' + Np(sh.c) + ' is ' + (sh.c > hi ? 'warmer than ' + Np(hi) : 'colder than ' + Np(lo)) + ', outside the range.',
              'The range is ' + dC(lo) + ' to ' + dC(hi) + '. ' + Np(sh.c) + (sh.inR ? ' is between them, so <b>yes</b>, the ice is in range.' : ' is not between them, so <b>no</b>.') + '<br>(Or: ' + cfLine(sh.c) + ', which is ' + (sh.inR ? '' : 'not ') + 'between ' + sh.f1 + ' and ' + sh.f2 + '.)',
              ['Use your range from (a). On the number line, −5.6 is lower than −3.3.'], 'ice decision',
              [{ html: '<b>No.</b> ' + Np(sh.c) + ' is not between ' + sh.f1 + ' and ' + sh.f2 + '.', why: 'The display is in °C and the manual is in °F. Compare in the same scale.', code: 'u4l3-mixed-scales', right: false }]);
          } }] },
      { num: '9', stem: 'Use the quick estimate first. Then find the exact answer. Is the estimate good enough?', parts: [
        { id: '9ai', sub: 'a i', level: 'EMG', make: function (r, sh) { return estFields('(a) Tell a friend in Texas that it is ' + dC(sh.a) + ' in Calgary. Give the estimate and the exact value in °F.', 'CF', sh.a, 'est weather'); } },
        { id: '9aii', sub: 'a ii', level: 'EMG', make: function (r, sh) { return goodEnoughMC(r, '(a) It is ' + dC(sh.a) + ' in Calgary. Is the quick estimate good enough to tell your friend about the weather?', 'CF', sh.a, 'weather', 'est ok weather'); } },
        { id: '9bi', sub: 'b i', level: 'EMG', make: function (r, sh) { return estFields('(b) Tell a friend in Ohio to set her oven to ' + dC(sh.b) + ' for your pizza recipe. Give the estimate and the exact value in °F.', 'CF', sh.b, 'est oven'); } },
        { id: '9bii', sub: 'b ii', level: 'EMG', make: function (r, sh) { return goodEnoughMC(r, '(b) The oven should be at ' + dC(sh.b) + '. Is the quick estimate good enough for the oven?', 'CF', sh.b, 'oven', 'est ok oven'); } },
        { id: '9ci', sub: 'c i', level: 'PRG', make: function (r, sh) { return estFields('(c) A website says it is ' + dF(sh.c) + ' in ' + sh.city + '. Give the estimate and the exact value in °C (exact to the nearest tenth).', 'FC', sh.c, 'est coat'); } },
        { id: '9cii', sub: 'c ii', level: 'EMG', make: function (r, sh) { return goodEnoughMC(r, '(c) It is ' + dF(sh.c) + ' in ' + sh.city + '. Is the quick estimate good enough to decide whether to wear a winter coat?', 'FC', sh.c, 'coat', 'est ok coat'); } }],
        shared: function (r) { return { a: pickC(r, [15, 18, 22, 24, 26, 27, 23]), b: pickC(r, [210, 220, 240, 250, 260]), c: pickF(r, [36, 38, 40, 42, 44, 46]), city: r.pick(['Chicago', 'Boston', 'Denver', 'New York']) }; } },
      { num: '10', stem: 'Which temperature is hotter? By how many Celsius degrees?', shared: function (r) {
          var a = find(function () { var c = r.int(36, 41), f = Math.round(toF(c)) + r.pick([-2, -1, 1, 2]); return { c: c, f: f }; }, function (s) { var d = Math.abs(s.c - toC(s.f)); return d >= 0.15 && d <= 1.5 && okF(s.f) && !(s.c === 37); }, { c: 38, f: 100 });
          var b = find(function () { var c = -r.int(12, 28), f = Math.round(toF(c)) + r.pick([-2, -1, 1, 2]); return { c: c, f: f }; }, function (s) { var d = Math.abs(s.c - toC(s.f)); return d >= 0.25 && d <= 1.5 && okF(s.f) && okC(s.c); }, { c: -20, f: -5 });
          return { a: a, b: b }; },
        parts: [
          { id: '10a', level: 'PRG', make: function (r, sh) { return compareMC(r, '(a) ' + dC(sh.a.c) + ' or ' + dF(sh.a.f) + '?', sh.a.c, sh.a.f, true, { text: 'hotter a' }); } },
          { id: '10b', level: 'PRG', make: function (r, sh) { return compareMC(r, '(b) ' + dC(sh.b.c) + ' or ' + dF(sh.b.f) + '?', sh.b.c, sh.b.f, true, { text: 'hotter b' }); } }] },
      { num: '11', stem: function (sh) { return 'A chest freezer should be at ' + dC(-18) + ' or colder. The freezer at a corner store has a thermometer from the US that reads ' + dF(sh.f) + '.'; },
        shared: function (r) { return { f: r.pick([-8, -5, -4, -2, 2, 5, 8, 10, 3, -6]) }; },
        parts: [
          { id: '11a', level: 'EMG', make: function (r, sh) { return fcPart('Change the reading to °C, to the nearest tenth.', sh.f); } },
          { id: '11b', level: 'EMG', make: function (r, sh) {
            var c = r1(toC(sh.f)), yes = c <= -18, d = r1(Math.abs(c + 18));
            return yesNo(r, 'Is the freezer cold enough?', yes, '<b>Yes.</b> ' + Np(c) + ' °C is colder than −18 °C.', '<b>No.</b> ' + Np(c) + ' °C is warmer than −18 °C, by ' + Np(d) + ' Celsius degrees.',
              fcLine(sh.f) + '<br>' + Np(c) + (yes ? ' is lower than −18, so <b>yes</b>, it is cold enough.' : ' is higher (warmer) than −18, so <b>no</b>, it is not cold enough. It is ' + Np(d) + ' Celsius degrees too warm.'),
              ['On the number line, colder means lower: −20 is colder than −18, −15 is warmer.'], 'freezer ok',
              [{ html: 'You can’t tell: the thermometer is in °F and the rule is in °C.', why: 'You can tell: change the reading to °C first, then compare.', code: 'u4l3-mixed-scales', right: false }]);
          } }] },
      { num: '12', stem: function (sh) { return 'Overnight in ' + sh.where + ', the temperature falls from ' + dC(sh.hi) + ' to ' + dC(sh.lo) + '.'; },
        shared: function (r) { return find(function () { return { where: r.pick(['Banff', 'Jasper', 'Canmore', 'Grande Prairie']), hi: r.int(1, 8), lo: -r.int(5, 15) }; }, function (s) { return (s.hi - s.lo) % 5 === 0 || r.chance(0.5); }, { where: 'Banff', hi: 3, lo: -12 }); },
        parts: [
          { id: '12a', level: 'EMG', make: function (r, sh) { var d = sh.hi - sh.lo; return num('By how many Celsius degrees did it fall?', d, { after: 'Celsius degrees', bad: [[sh.hi + sh.lo, 'u4l3-neg-sub', 'Count down to 0, then past it: ' + sh.hi + ' degrees down to 0, and ' + (-sh.lo) + ' more down to ' + Np(sh.lo) + '.'], [Math.abs(sh.hi + sh.lo), 'u4l3-neg-sub', 'Count down to 0, then past it: ' + sh.hi + ' + ' + (-sh.lo) + '.']], sol: t(sh.hi + '-(' + sh.lo + ')=' + sh.hi + '+' + (-sh.lo) + '=' + d) + '<br>It fell ' + d + ' Celsius degrees.', hints: ['Higher − lower. Subtracting a negative is adding.'], text: 'fall C' }); } },
          { id: '12b', level: 'EMG', make: function (r, sh) { var d = sh.hi - sh.lo; return chgCF('By how many Fahrenheit degrees did it fall?', d, { bad: [[1.8 * Math.abs(sh.hi + sh.lo), 'u4l3-neg-sub', 'First find the fall in °C: ' + sh.hi + ' − (' + sh.lo + ') = ' + d + '.']] }); } },
          { id: '12c', level: 'PRG', make: function (r, sh) {
            return fld('Check (b): change both temperatures to °F.', [{ label: 'Evening:', name: 'Evening', v: toF(sh.hi), after: '°F', o: { bad: cfBad(sh.hi) } }, { label: 'Morning:', name: 'Morning', v: toF(sh.lo), after: '°F', o: { bad: cfBad(sh.lo) } }],
              cfLine(sh.hi) + '<br>' + cfLine(sh.lo) + '<br>' + t(nS(toF(sh.hi)) + '-' + par(toF(sh.lo)) + '=' + nS(q(toF(sh.hi) - toF(sh.lo)))) + ' ✓ (the same as (b))', ['F = 1.8 × C + 32 for each reading.'], 'check both F');
          } }] },
      { num: '13', stem: function (sh) { return 'A US weather report says the temperature rose ' + sh.df + ' Fahrenheit degrees in ' + sh.h + ' hours. Kayla says, “' + t('(' + sh.df + '-32)\\div 1.8\\approx ' + nS(r1((sh.df - 32) / 1.8))) + ', so it rose about ' + Np(r1((sh.df - 32) / 1.8)) + ' Celsius degrees.”'; },
        shared: function (r) { return { df: r.pick([18, 27, 45, 54, 36, 63]), h: r.int(2, 6) }; },
        parts: [
          { id: '13a', level: 'EMG', make: function (r, sh) {
            return mc(r, 'What mistake did Kayla make?', [
              { html: 'She treated a <b>change</b> like a thermometer reading. For a change, don’t subtract 32; only divide by 1.8.', right: true },
              { html: 'She should have multiplied by 1.8 instead of dividing.', why: 'Going from °F to °C, dividing by 1.8 is right. The mistake is the −32.', code: 'u4l3-change-mult' },
              { html: 'She should have added 32 instead of subtracting it.', why: 'A change uses no 32 at all — neither + nor −.', code: 'u4l3-change32' },
              { html: 'She forgot the brackets.', why: 'Her brackets are fine. Think about whether 32 belongs in a change.', code: 'u4l3-brackets' }],
              'She treated a change like a thermometer reading. The 32 is about where the scales start; a change doesn’t depend on that. Only divide by 1.8.', ['Is ' + sh.df + ' Fahrenheit degrees a reading or a change?'], 'Kayla mistake');
          } },
          { id: '13b', level: 'EMG', make: function (r, sh) { return chgFC('How many Celsius degrees did the temperature rise?', sh.df, { bad: [[(sh.df - 32) / 1.8, 'u4l3-change32', 'That’s Kayla’s answer. For a change, don’t subtract 32.']] }); } }] },
      { num: '14', stem: function (sh) { return 'On the same winter day it is ' + dC(sh.c) + ' in Calgary and ' + dF(sh.f) + ' in ' + sh.city + '.'; },
        shared: function (r) { return find(function () { var c = -r.int(8, 24), f = Math.round(toF(c)) + r.pick([-3, -2, -1, 1, 2, 3]); return { c: c, f: f, city: r.pick(['Fargo, North Dakota', 'Great Falls, Montana', 'Duluth, Minnesota', 'Bismarck, North Dakota']) }; }, function (s) { var d = Math.abs(s.c - toC(s.f)); return d >= 0.3 && d <= 1.7 && okC(s.c) && okF(s.f) && !(s.c === -12 && s.f === 12); }, { c: -14, f: 9, city: 'Fargo, North Dakota' }); },
        parts: [
          { id: '14a', level: 'PRG', make: function (r, sh) {
            var fc = toC(sh.f), calColder = sh.c < fc;
            return mc(r, 'Which city is colder?', [
              { html: '<b>' + (calColder ? 'Calgary' : sh.city.split(',')[0]) + '</b>: in °C, ' + (calColder ? Np(sh.c) + ' is lower than ' + Np(r1(fc)) : Np(r1(fc)) + ' is lower than ' + Np(sh.c)) + '.', right: true },
              { html: '<b>' + (calColder ? sh.city.split(',')[0] : 'Calgary') + '</b>: in °C, ' + (calColder ? Np(r1(fc)) + ' is lower than ' + Np(sh.c) : Np(sh.c) + ' is lower than ' + Np(r1(fc))) + '.', why: 'Check the number line: the more negative number is colder.', code: 'u4l3-wrong-way' },
              (sh.c < sh.f) !== calColder ? { html: '<b>' + (sh.c < sh.f ? 'Calgary' : sh.city.split(',')[0]) + '</b>: ' + Np(Math.min(sh.c, sh.f)) + ' is a lower number than ' + Np(Math.max(sh.c, sh.f)) + '.', why: 'You can’t compare a °C number with a °F number. Change ' + dF(sh.f) + ' to °C first.', code: 'u4l3-mixed-scales' }
                : { html: 'They are the same temperature.', why: 'They are close, but not the same. Change ' + dF(sh.f) + ' to °C and compare.', code: 'same' }],
              fcLine(sh.f) + '<br>' + (calColder ? Np(sh.c) + ' is lower than ' + Np(r1(fc)) + ', so Calgary is colder.' : Np(r1(fc)) + ' is lower than ' + Np(sh.c) + ', so ' + sh.city.split(',')[0] + ' is colder.'), ['Change the °F temperature to °C, then compare.'], 'colder city');
          } },
          { id: '14b', level: 'MAS', make: function (r, sh) {
            var fc = toC(sh.f), dcx = Math.abs(sh.c - fc), dfx = Math.abs(sh.f - toF(sh.c)), alt = r1(Math.abs(sh.c - r1(fc)));
            return fld('By how many Celsius degrees, and by how many Fahrenheit degrees, is it colder? (Nearest tenth.)', [
              { label: 'Celsius degrees:', name: 'Celsius degrees', v: dcx, o: { dp: 1, alt: [alt], bad: [[Math.abs(sh.c - sh.f), 'u4l3-mixed-scales', 'Change ' + dF(sh.f) + ' to °C before you subtract.'], [1.8 * dcx, 'u4l3-change-mult', 'That’s the difference in <b>Fahrenheit</b> degrees.']] } },
              { label: 'Fahrenheit degrees:', name: 'Fahrenheit degrees', v: dfx, o: { dp: 1, alt: [r1(1.8 * alt), r1(1.8 * r1(dcx))], bad: [[dfx + 32, 'u4l3-change32', 'A difference is a change: no +32.'], [dcx, 'u4l3-no-change', 'That’s the difference in Celsius degrees.']] } }],
              'In °C: ' + fcLine(sh.f) + '; ' + t(nS(r1(Math.max(sh.c, fc))) + '-' + par(r1(Math.min(sh.c, fc))) + '\\approx ' + nS(r1(dcx))) + ' Celsius degrees<br>In °F: Calgary is ' + cfLine(sh.c) + '; ' + t(nS(Math.max(sh.f, toF(sh.c))) + '-' + par(Math.min(sh.f, toF(sh.c))) + '=' + nS(q(dfx))) + ' Fahrenheit degrees<br>(Check: ' + t('1.8\\times ' + nS(rd(dcx, 2)) + '\\approx ' + nS(r1(1.8 * dcx))) + '.)',
              ['Celsius: change ' + dF(sh.f) + ' to °C and subtract.', 'Fahrenheit: change Calgary’s temperature to °F and subtract (or multiply the Celsius difference by 1.8).'], 'colder by', { swap: false });
          } }] },
      { num: '15', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '15', level: 'BEG', make: function (r) {
          var C = pickC(r, [15, 30, 35, 40, 45, 12, 18, 24]);
          var opts = [{ v: toF(C), right: true }, { v: r1(toC(C)), why: 'That uses the °F → °C formula, (C − 32) ÷ 1.8.', code: 'u4l3-wrong-formula' }, { v: q(1.8 * C), why: 'You multiplied by 1.8 but forgot to add 32.', code: 'u4l3-no-32' }, { v: r1((C + 32) * 1.8), why: 'That adds 32 first. Multiply by 1.8 first, then add 32.', code: 'u4l3-order' }];
          return mc(r, 'What is ' + dC(C) + ' in degrees Fahrenheit?', opts.map(function (o) { return { html: dF(o.v), right: !!o.right, why: o.why, code: o.code }; }), cfLine(C), ['F = 1.8 × C + 32.'], 'MC C to F');
        } }] },
      { num: '16', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '16', level: 'EMG', make: function (r) {
          var F = pickF(r, [41, 50, 68, 95, 104, 113, 77, 122]), s = String(F), c = toC(F);
          return mc(r, 'Which key sequence changes ' + dF(F) + ' to °C correctly?', [
            { html: keys(['(', s, '−', '32', ')', '÷', '1.8', 'ENTER']), right: true },
            { html: keys([s, '−', '32', '÷', '1.8', 'ENTER']), why: 'Without brackets the calculator divides first and shows ' + Np(r1(F - 32 / 1.8)) + '.', code: 'u4l3-brackets' },
            { html: keys([s, '÷', '1.8', '−', '32', 'ENTER']), why: 'That divides first, then subtracts, and shows ' + Np(rd(F / 1.8 - 32, 2)) + '. Subtract 32 first.', code: 'u4l3-order' },
            { html: keys(['(', s, '−', '32', ')', '×', '1.8', 'ENTER']), why: 'That multiplies by 1.8 (and shows ' + Np(r1((F - 32) * 1.8)) + '). Divide by 1.8.', code: 'u4l3-times' }],
            'Subtract 32 first (brackets), then divide: ' + t('(' + s + '-32)\\div 1.8=' + nS(F - 32) + '\\div 1.8=' + nS(r1(c))) + ' °C.', ['The calculator does ÷ before −, unless there are brackets.'], 'MC keys');
        } }] },
      { num: '17', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '17', level: 'BEG', make: function (r) {
          var d = r.pick([5, 10, 15, 20, 25, 30]);
          var opts = [{ v: q(1.8 * d), right: true }, { v: toF(d), why: 'That uses the reading formula (1.8 × C + 32). For a change, don’t add 32.', code: 'u4l3-change32' }, { v: d + 32, why: 'For a change, multiply by 1.8 — no 32.', code: 'u4l3-change32' }, { v: r1(d / 1.8), why: 'A change in °F is a bigger number than the change in °C. Multiply by 1.8.', code: 'u4l3-change-div' }];
          return mc(r, 'During a chinook, the temperature rises by ' + d + ' Celsius degrees. By how many Fahrenheit degrees does it rise?', opts.map(function (o) { return { html: Np(o.v), right: !!o.right, why: o.why, code: o.code }; }), t('1.8\\times ' + d + '=' + nS(q(1.8 * d))) + ' Fahrenheit degrees (no +32 for a change).', ['Change in °F = 1.8 × change in °C.'], 'MC change');
        } }] },
      { num: '18', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '18', level: 'EMG', make: function (r) {
          var c = r.pick([['A US deep-fryer manual says to heat the oil to', 350], ['A US deep-fryer manual says to heat the oil to', 360], ['A US deep-fryer manual says to heat the oil to', 365], ['A candy recipe from Ohio says to boil the syrup to', 235], ['A US maple-syrup guide says the syrup is ready at', 219], ['A US smoker manual says to keep the smoker at', 225]]);
          return fcPart(c[0] + ' ' + dF(c[1]) + '. This temperature in degrees Celsius, to the nearest degree, is ________ °C.', c[1], { dp: 0, nr: true, text: 'NR F to C' });
        } }] }
    ],
    extra: [
      { num: '1', section: 'A. Skills', stem: 'Change each temperature to degrees Fahrenheit.', parts: [
        { id: 'e1a', level: 'BEG', make: function (r) { var C = pickC(r, [40, 45, 35, 60, 50]); return cfPart(dC(C), C); } },
        { id: 'e1b', level: 'EMG', make: function (r) { var C = pickC(r, [-5, -2, -3, -6, -7, -4]); return cfPart(dC(C), C); } },
        { id: 'e1c', level: 'BEG', make: function (r) { var C = pickC(r, [12, 14, 16, 8, 6, 11]); return cfPart(dC(C), C); } },
        { id: 'e1d', level: 'BEG', make: function (r) { var C = pickC(r, [250, 270, 275, 300, 160, 180]); return cfPart(dC(C), C); } }] },
      { num: '2', stem: 'Change each temperature to degrees Celsius. Round to the nearest tenth of a degree.', parts: [
        { id: 'e2a', level: 'BEG', make: function (r) { var F = pickF(r, [50, 41, 68, 77]); return fcPart(dF(F), F); } },
        { id: 'e2b', level: 'BEG', make: function (r) { var F = pickF(r, [113, 122, 131, 140, 104]); return fcPart(dF(F), F); } },
        { id: 'e2c', level: 'EMG', make: function (r) { var F = pickF(r, [5, 14, -4, 23]); return fcPart(dF(F), F); } },
        { id: 'e2d', level: 'EMG', make: function (r) { var F = pickF(r, [300, 325, 340, 360, 410, 390]); return fcPart(dF(F), F); } }] },
      { num: '3', stem: 'Put these temperatures in order from coldest to hottest.', parts: [
        { id: 'e3', level: 'PRG', make: function (r) {
          var v = find(function () { var cs = r.sample([10, 0, 5, -5, 15, -10, 8, 3, -3], 2), fs = r.sample([40, 20, 50, 30, 10, 25, 45, 35, 14], 2); var all = cs.map(function (c) { return { id: 'c' + c, s: 'C', n: c, val: c }; }).concat(fs.map(function (f) { return { id: 'f' + f, s: 'F', n: f, val: toC(f) }; })); return all; },
            function (all) { var vals = all.map(function (x) { return x.val; }).sort(function (a, b) { return a - b; }); for (var i = 1; i < vals.length; i++) if (vals[i] - vals[i - 1] < 1.5) return false;
              var trap = all.some(function (x) { return x.s === 'F' && all.some(function (y) { return y.s === 'C' && x.n > y.n && x.val < y.val; }); }); return trap && !(all.map(function (x) { return x.id; }).sort().join() === 'c0,c10,f20,f40'); },
            [{ id: 'c10', s: 'C', n: 10, val: 10 }, { id: 'f40', s: 'F', n: 40, val: toC(40) }, { id: 'c0', s: 'C', n: 0, val: 0 }, { id: 'f20', s: 'F', n: 20, val: toC(20) }]);
          var sorted = v.slice().sort(function (a, b) { return a.val - b.val; });
          var lab = function (x) { return x.s === 'C' ? dC(x.n) : dF(x.n); };
          return P.order(r, 'Tap them in order, coldest first.', sorted.map(function (x) { return { id: x.id, html: lab(x) }; }), { first: 'coldest', last: 'hottest', why: function (a, b) { return 'Change the °F ones to °C first, then compare. Check the order of ' + lab(v.filter(function (x) { return x.id === a; })[0]) + ' and ' + lab(v.filter(function (x) { return x.id === b; })[0]) + '.'; } },
            'Change the °F ones to °C: ' + v.filter(function (x) { return x.s === 'F'; }).map(function (x) { return fcLine(x.n); }).join('; ') + '<br>Coldest to hottest: ' + sorted.map(lab).join(', '), ['Change the °F temperatures to °C first.'], 'order temps');
        } }] },
      { num: '4', stem: 'Use the quick estimate. Then find the exact answer and say how far off the estimate is.', parts: [
        { id: 'e4a', level: 'EMG', make: function (r) {
          var C = pickC(r, [15, 5, 25, 35, 12, 16, 18]), e = 2 * C + 30, x = toF(C), off = q(Math.abs(e - x));
          return fld('(a) ' + dC(C) + ' in °F', [{ label: 'Estimate:', name: 'Estimate', v: e, after: '°F', o: { bad: [[x, 'u4l3-swap', 'That’s the exact value. Estimate: double, then add 30.']] } }, { label: 'Exact:', name: 'Exact', v: x, after: '°F', o: { bad: cfBad(C) } }, { label: 'How far off:', name: 'How far off', v: off, after: 'degrees', o: { bad: [[-off, 'u4-neg', 'Give the distance as a positive number (bigger − smaller).']] } }],
            'Estimate: ' + t('2\\times ' + C + '+30=' + e) + ' °F<br>Exact: ' + cfLine(C) + '<br>' + Np(off) + ' degree' + (off === 1 ? '' : 's') + ' off', ['Estimate: double, then add 30.', 'Exact: 1.8 × C + 32.', 'How far off = bigger − smaller.'], 'est off CF', { swap: false });
        } },
        { id: 'e4b', level: 'PRG', make: function (r) {
          var F = pickF(r, [70, 64, 76, 60, 66, 84]), e = (F - 30) / 2, x = toC(F), off = Math.abs(e - x);
          return fld('(b) ' + dF(F) + ' in °C (exact and how far off to the nearest tenth)', [{ label: 'Estimate:', name: 'Estimate', v: e, after: '°C', o: { dp: 1, bad: [[x, 'u4l3-swap', 'That’s the exact value. Estimate: subtract 30, then halve.']] } }, { label: 'Exact:', name: 'Exact', v: x, after: '°C', o: { dp: 1, bad: fcBad(F) } }, { label: 'How far off:', name: 'How far off', v: off, after: 'degrees', o: { dp: 1, alt: [r1(Math.abs(e - r1(x)))] } }],
            'Estimate: ' + t('(' + F + '-30)\\div 2=' + nS(e)) + ' °C<br>Exact: ' + fcLine(F) + '<br>About ' + Np(r1(off)) + ' degrees off', ['Estimate: subtract 30, then halve.', 'Exact: (F − 32) ÷ 1.8.'], 'est off FC', { swap: false });
        } }] },
      { num: '5', stem: 'Change each temperature <b>change</b> to the other scale.', parts: [
        { id: 'e5a', level: 'BEG', make: function (r) { var d = r.pick([15, 20, 25, 30, 12, 8]); return chgCF('(a) The temperature drops ' + d + ' Celsius degrees. How many Fahrenheit degrees is that?', d); } },
        { id: 'e5b', level: 'EMG', make: function (r) { var d = r.pick([45, 27, 36, 54, 18, 63]); return chgFC('(b) The temperature rises ' + d + ' Fahrenheit degrees. How many Celsius degrees is that?', d); } }] },
      { num: '6', section: 'B. Applying', stem: function (sh) { return 'The forecast for ' + sh.city + ' says: high ' + dF(sh.hi) + ', low ' + dF(sh.lo) + '.'; },
        shared: function (r) { return find(function () { var hi = r.int(98, 115), lo = hi - 9 * r.int(2, 4); return { city: r.pick(['Phoenix, Arizona', 'Las Vegas, Nevada', 'El Paso, Texas', 'Palm Springs, California']), hi: hi, lo: lo }; }, function (s) { return okF(s.hi) && okF(s.lo); }, { city: 'Phoenix, Arizona', hi: 108, lo: 81 }); },
        parts: [
          { id: 'e6a', level: 'EMG', make: function (r, sh) { return fld('(a) Change the high and the low to °C, to the nearest degree.', [{ label: 'High:', name: 'High', v: toC(sh.hi), after: '°C', o: { dp: 0, bad: fcBad(sh.hi) } }, { label: 'Low:', name: 'Low', v: toC(sh.lo), after: '°C', o: { dp: 0, bad: fcBad(sh.lo) } }], 'High: ' + fcLine(sh.hi, 0) + '<br>Low: ' + fcLine(sh.lo, 0), ['C = (F − 32) ÷ 1.8, then round to the nearest degree.'], 'Phoenix C'); } },
          { id: 'e6b', level: 'PRG', make: function (r, sh) { var df = sh.hi - sh.lo; return chgFC('(b) By how many Celsius degrees does the temperature change from the low to the high?', df, { alt: [Math.round(toC(sh.hi)) - Math.round(toC(sh.lo))], bad: [[df, 'u4l3-no-change', 'That’s the change in <b>Fahrenheit</b> degrees (' + sh.hi + ' − ' + sh.lo + '). Divide by 1.8.']], sol: 'From the change: ' + t(sh.hi + '-' + sh.lo + '=' + df) + ' Fahrenheit degrees, and ' + t(df + '\\div 1.8=' + nS(df / 1.8)) + ' Celsius degrees.<br>Or from (a): ' + t(Math.round(toC(sh.hi)) + '-' + Math.round(toC(sh.lo)) + '=' + (Math.round(toC(sh.hi)) - Math.round(toC(sh.lo)))) + '.' }); } }] },
      { num: '7', stem: function (sh) { return sh.who + ' works in a ' + sh.ctx[0] + '. The health inspector says ' + sh.ctx[1] + ' must be at least ' + dC(sh.rule) + '. The US-made gauge reads ' + dF(sh.g) + '.'; },
        shared: function (r) { var c = r.pick([['restaurant kitchen', 'the final rinse in the dishwasher', 82], ['restaurant kitchen', 'the water in the sanitizing sink', 77], ['small dairy', 'milk in the pasteurizer', 72], ['school cafeteria', 'soup on the hot-holding table', 63]]), low = Math.ceil(toF(c[2]) - 1e-9); return { who: r.pick(['Ines', 'Marcus', 'Leila', 'Jordan']), ctx: c, rule: c[2], low: low, g: low + r.pick([-3, -2, -1, -2, 1, 2, 3]) }; },
        parts: [
          { id: 'e7a', sub: 'a i', level: 'EMG', make: function (r, sh) { return fcPart('(a) Change the gauge reading to °C, to the nearest tenth.', sh.g); } },
          { id: 'e7b', sub: 'a ii', level: 'EMG', make: function (r, sh) {
            var c = r1(toC(sh.g)), yes = toC(sh.g) >= sh.rule;
            return yesNo(r, '(a) Is it hot enough?', yes, '<b>Yes.</b> ' + dC(c) + ' is at least ' + dC(sh.rule) + '.', '<b>No.</b> ' + dC(c) + ' is below ' + dC(sh.rule) + '.', fcLine(sh.g) + '<br>' + (yes ? 'Yes: ' + Np(c) + ' is at least ' + sh.rule + '.' : 'No: ' + Np(c) + ' is below ' + sh.rule + '.'), ['Compare your °C value with ' + dC(sh.rule) + '.'], 'hot enough',
              [{ html: '<b>Yes.</b> ' + sh.g + ' is more than ' + sh.rule + '.', why: sh.g + ' is in °F. Compare in the same scale.', code: 'u4l3-mixed-scales', right: false }]);
          } },
          { id: 'e7c', sub: 'b', level: 'MAS', make: function (r, sh) {
            var ex = toF(sh.rule);
            return num('(b) The gauge shows whole degrees. What is the lowest gauge reading that passes?', sh.low, { after: '°F', bad: [[Math.floor(ex), 'u4l3-round-down', Np(Math.floor(ex)) + ' °F is a little <b>below</b> ' + Np(ex) + ' °F, so it doesn’t pass. Go up to the next whole degree.'], [ex, 'u4l3-whole', 'The gauge only shows whole degrees. Which whole number is the lowest one at or above ' + Np(ex) + '?', 'form'], [r1(toC(sh.rule)), 'u4l3-wrong-formula', 'Change ' + dC(sh.rule) + ' to °F: 1.8 × C + 32.']],
              sol: cfLine(sh.rule) + '<br>' + (same(ex, sh.low) ? 'The lowest passing reading is ' + dF(sh.low) + '.' : Np(Math.floor(ex)) + ' °F is too low, so the lowest passing reading is ' + dF(sh.low) + '.'), hints: ['Change ' + dC(sh.rule) + ' to °F.', 'The gauge shows whole degrees: round <b>up</b> so it still passes.'], text: 'lowest pass' });
          } }] },
      { num: '8', stem: function (sh) { return 'A seed packet from a US company says ' + sh.p[0] + ' seeds sprout best between ' + dF(sh.p[1]) + ' and ' + dF(sh.p[2]) + '.'; },
        shared: function (r) { var p = r.pick([['tomato', 65, 85], ['pepper', 70, 90], ['lettuce', 45, 75], ['cucumber', 70, 95], ['pumpkin', 70, 90]]), lo = toC(p[1]), hi = toC(p[2]); return { p: p, lo: lo, hi: hi, g: r.chance(0.7) ? r.int(Math.ceil(lo + 0.5), Math.floor(hi - 0.5)) : r.pick([Math.floor(lo) - r.int(1, 3), Math.ceil(hi) + r.int(1, 3)]), town: r.pick(['Brooks', 'Taber', 'Lacombe', 'Olds']) }; },
        parts: [
          { id: 'e8a', level: 'EMG', make: function (r, sh) { return fld('(a) Write this range in °C, to the nearest tenth.', [{ label: 'From:', name: 'Low end', v: sh.lo, after: '°C', o: { dp: 1, bad: fcBad(sh.p[1]) } }, { label: 'To:', name: 'High end', v: sh.hi, after: '°C', o: { dp: 1, bad: fcBad(sh.p[2]) } }], fcLine(sh.p[1]) + '<br>' + fcLine(sh.p[2]), ['C = (F − 32) ÷ 1.8 for each end.'], 'seed range'); } },
          { id: 'e8b', level: 'EMG', make: function (r, sh) { var inR = sh.g >= sh.lo && sh.g <= sh.hi; return yesNo(r, '(b) A greenhouse in ' + sh.town + ' is kept at ' + dC(sh.g) + '. Is that in the range?', inR, '<b>Yes.</b> ' + sh.g + ' is between ' + Np(r1(sh.lo)) + ' and ' + Np(r1(sh.hi)) + '.', '<b>No.</b> ' + sh.g + ' is ' + (sh.g < sh.lo ? 'below ' + Np(r1(sh.lo)) : 'above ' + Np(r1(sh.hi))) + '.', 'The range is ' + dC(r1(sh.lo)) + ' to ' + dC(r1(sh.hi)) + '. ' + sh.g + (inR ? ' is in the range.' : ' is not in the range.'), ['Use your range from (a).'], 'greenhouse', [{ html: '<b>No.</b> ' + sh.g + ' is not between ' + sh.p[1] + ' and ' + sh.p[2] + '.', why: 'The greenhouse is in °C and the packet is in °F. Use your °C range from (a).', code: 'u4l3-mixed-scales', right: false }]); } }] },
      { num: '9', stem: '', parts: [
        { id: 'e9', level: 'PRG', make: function (r) { var v = find(function () { var c = -r.int(22, 34), f = Math.round(toF(c)) + r.pick([-3, -2, 2, 3]); return { c: c, f: f }; }, function (s) { var d = Math.abs(s.c - toC(s.f)); return d >= 0.5 && d <= 1.8 && okC(s.c) && okF(s.f); }, { c: -30, f: -20 }); return compareMC(r, 'Which is colder: ' + dC(v.c) + ' or ' + dF(v.f) + '? By how many Celsius degrees?', v.c, v.f, false, { text: 'colder' }); } }] },
      { num: '10', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: 'e10', level: 'BEG', make: function (r) {
          var C = pickC(r, [160, 175, 190, 210, 220, 240, 180]);
          var opts = [{ v: toF(C), right: true }, { v: 2 * C + 30, why: 'That’s the quick estimate (2C + 30), too far off for baking.', code: 'u4l3-estimate' }, { v: r1(toC(C)), why: 'That uses the °F → °C formula.', code: 'u4l3-wrong-formula' }, { v: q(1.8 * C), why: 'You forgot to add 32.', code: 'u4l3-no-32' }];
          return mc(r, 'A recipe says to bake at ' + dC(C) + '. Ben’s friend in the US needs the temperature in °F. What is it?', opts.map(function (o) { return { html: dF(o.v), right: !!o.right, why: o.why, code: o.code }; }), cfLine(C), ['F = 1.8 × C + 32.'], 'MC bake');
        } }] },
      { num: '11', stem: '<i>(Numerical Response)</i>', parts: [
        { id: 'e11', level: 'EMG', make: function (r) {
          var v = find(function () { var a = -r.int(4, 16), b = r.int(5, 20); return { a: a, b: b, d: b - a, town: r.pick(['Lethbridge', 'Pincher Creek', 'Calgary', 'Medicine Hat']) }; }, function (s) { return s.d % 5 === 0 && !(s.a === -21 && s.b === 7) && !(s.a === -8 && s.b === 17); }, { a: -6, b: 14, d: 20, town: 'Lethbridge' });
          return chgCF('During a chinook, the temperature in ' + v.town + ' rises from ' + dC(v.a) + ' to ' + dC(v.b) + '. The rise in Fahrenheit degrees is ________.', v.d, { bad: [[1.8 * Math.abs(v.a + v.b), 'u4l3-neg-sub', 'First find the rise in °C: ' + v.b + ' − (' + v.a + ') = ' + v.d + '.'], [v.d, 'u4l3-no-change', 'That’s the rise in Celsius degrees. Multiply by 1.8.']], sol: 'Rise in °C: ' + t(v.b + '-(' + v.a + ')=' + v.d) + '<br>In °F: ' + t('1.8\\times ' + v.d + '=' + nS(q(1.8 * v.d))) + ' Fahrenheit degrees', text: 'NR chinook' });
        } }] },
      { num: '12', section: 'C. Stretch', stem: function (sh) { return 'Jake changed ' + dF(sh.f) + ' to °C. Here is his work: ' + t('C=(' + (-sh.f) + '-32)\\div 1.8=' + (-sh.f - 32) + '\\div 1.8\\approx ' + nS(r1((-sh.f - 32) / 1.8))) + ' °C'; },
        shared: function (r) { return { f: pickF(r, [-5, -8, -10, -12, -4, -14, -6]) }; },
        parts: [
          { id: 'e12ai', sub: 'a i', level: 'EMG', make: function (r, sh) {
            return mc(r, 'What is his mistake?', [
              { html: 'He dropped the negative sign: the reading is ' + Np(sh.f) + ', not ' + (-sh.f) + '.', right: true },
              { html: 'He should have added 32.', why: 'Subtracting 32 is right for °F → °C. Look at the number he started with.', code: 'u4l3-plus32' },
              { html: 'He should have multiplied by 1.8.', why: 'Dividing by 1.8 is right. Look at the number he started with.', code: 'u4l3-times' },
              { html: 'There is no mistake.', why: 'Compare the number in his brackets with the reading, ' + Np(sh.f) + ' °F.', code: 'none' }],
              'He dropped the negative sign on ' + Np(sh.f) + '.', ['Look at the first number in his brackets.'], 'Jake mistake');
          } },
          { id: 'e12aii', sub: 'a ii', level: 'PRG', make: function (r, sh) { return fcPart('Correct his work: what is ' + dF(sh.f) + ' in °C, to the nearest tenth?', sh.f, { bad: [[(-sh.f - 32) / 1.8, 'u4l3-sign', 'That’s Jake’s answer. Start with ' + Np(sh.f) + ', not ' + (-sh.f) + '.']] }); } },
          { id: 'e12b', sub: 'b', level: 'EMG', make: function (r, sh) {
            var e = (sh.f - 30) / 2, j = r1((-sh.f - 32) / 1.8);
            return mc(r, 'How could a quick estimate have warned him?', [
              { html: t('(' + sh.f + '-30)\\div 2=' + nS(e)) + ', so the answer should be about ' + Np(e) + ' °C, not ' + Np(j) + '.', right: true },
              { html: t('2\\times (' + sh.f + ')+30=' + (2 * sh.f + 30)) + ', so the answer should be about ' + Np(2 * sh.f + 30) + ' °C.', why: 'That’s the estimate for °C → °F. For °F → °C, subtract 30, then halve.', code: 'u4l3-wrong-formula' },
              { html: 'An estimate can’t help with negative temperatures.', why: 'It can: subtract 30, then halve, keeping the sign.', code: 'neg' },
              { html: t('(' + (-sh.f) + '-30)\\div 2=' + nS((-sh.f - 30) / 2)) + ', so his answer is about right.', why: 'That estimate makes the same mistake (it drops the negative sign).', code: 'u4l3-sign' }],
              'Estimate: ' + t('(' + sh.f + '-30)\\div 2=' + nS(q(sh.f - 30)) + '\\div 2=' + nS(e)) + '. The answer should be about ' + Np(e) + ' °C, not ' + Np(j) + ' °C.', ['C ≈ (F − 30) ÷ 2. Keep the negative sign.'], 'Jake estimate');
          } }] },
      { num: '13', stem: function (sh) { return sh.s.kind === 'double' ? 'At one temperature, the °F number is exactly <b>double</b> the °C number.' : 'At one temperature, the °F number is exactly <b>' + sh.s.k + ' more</b> than the °C number.'; },
        shared: function (r) { var s = r.pick(SPECIAL), nl = r.chance(0.5) ? 2 : 1; return { s: s, tr: r.sample(s.lo, Math.min(nl, s.lo.length)).concat(r.sample(s.hi, 3 - Math.min(nl, s.lo.length))).sort(function (a, b) { return a - b; }) }; },
        parts: [
          { id: 'e13a', level: 'EMG', make: function (r, sh) {
            var s = sh.s, col = s.kind === 'double' ? 'Double the °C' : '°C + ' + s.k;
            var rows = sh.tr.map(function (c) { return [Np(c), '<b>?</b>', Np(s.kind === 'double' ? 2 * c : c + s.k)]; });
            return fld('Complete the °F column of the table (use ' + t('1.8C+32') + ').' + table(['°C', '°F (1.8C + 32)', col], rows), sh.tr.map(function (c) { return { label: Np(c) + ' °C:', name: Np(c) + ' °C', v: toF(c), after: '°F', o: { bad: cfBad(c) } }; }),
              sh.tr.map(function (c) { return cfLine(c); }).join('<br>'), ['F = 1.8 × C + 32 for each row.'], 'trial table', { swap: false });
          } },
          { id: 'e13b', level: 'MAS', make: function (r, sh) {
            var s = sh.s;
            return fld('Use the table to find the temperature. (Try values between the rows where the °F column passes the last column.)', [{ label: 'The temperature is', name: '°C', v: s.C, after: '°C =' }, { label: '', name: '°F', v: toF(s.C), after: '°F' }],
              (s.kind === 'double' ? 'At 150 the °F is a little more than double; at 200 it is less, so the answer is between. Try ' + s.C + ': ' + t('1.8\\times ' + s.C + '+32=' + toF(s.C) + '=2\\times ' + s.C) : 'Try ' + s.C + ': ' + t('1.8\\times ' + s.C + '+32=' + toF(s.C)) + ', and ' + t(s.C + '+' + s.k + '=' + (s.C + s.k))) + ' ✓<br>The temperature is ' + dC(s.C) + ' = ' + dF(toF(s.C)) + '.',
              ['Compare the °F column with the last column: where does it go from bigger to smaller?', 'Try a value in between and check.'], 'special temp', { swap: false, answer: dC(s.C) + ' = ' + dF(toF(s.C)) });
          } }] },
      { num: '14', stem: function (sh) { return 'The quick estimate ' + t('2C+30') + ' and the exact ' + t('1.8C+32') + ' give different answers.' + table(['°C'].concat(sh.cs.map(function (c) { return Np(c); })), [['Estimate'].concat(sh.cs.map(function (c) { return Np(2 * c + 30); })), ['Exact'].concat(sh.cs.map(function () { return '?'; })), ['How far off'].concat(sh.cs.map(function () { return '?'; }))]); },
        shared: function (r) { var st = r.pick([-10, -5, 0]); return { cs: [0, 1, 2, 3, 4, 5].map(function (i) { return st + 5 * i; }), w: r.pick([1, 2, 2]) }; },
        parts: [
          { id: 'e14a', level: 'PRG', make: function (r, sh) {
            return fld('(a) Complete the table: the exact °F and how far off the estimate is.', sh.cs.map(function (c) { return { label: Np(c) + ' °C — exact:', name: Np(c) + ' °C exact', v: toF(c), after: '°F', o: { bad: cfBad(c) } }; }).concat(sh.cs.map(function (c) { var off = q(Math.abs(2 * c + 30 - toF(c))); return { label: Np(c) + ' °C — off by:', name: Np(c) + ' °C off by', v: off, after: '°F', o: {} }; })),
              sh.cs.map(function (c) { var e = 2 * c + 30, x = toF(c); return Np(c) + ' °C: exact ' + cfLine(c) + '; off by ' + Np(q(Math.abs(e - x))); }).join('<br>'), ['Exact: 1.8 × C + 32.', 'How far off = bigger − smaller.'], 'estimate table', { swap: false });
          } },
          { id: 'e14b', level: 'MAS', make: function (r, sh) {
            var within = sh.cs.filter(function (c) { return Math.abs(0.2 * c - 2) <= sh.w + 1e-9; }), lo = within[0], hi = within[within.length - 1];
            return fld('(b) For which Celsius temperatures in the table is the estimate within ' + sh.w + ' °F of the exact answer? What happens to the error for every 5 Celsius degrees you move away from 10 °C?', [
              { label: 'Within ' + sh.w + ' °F from', name: 'From', v: lo, after: '°C' }, { label: 'to', name: 'To', v: hi, after: '°C' }, { label: 'The error grows by', name: 'Error growth', v: 1, after: '°F for every 5 Celsius degrees', o: { bad: [[0.2, 'u4l3-per-degree', 'That’s the growth for <b>1</b> Celsius degree. The question asks about 5.'], [2, 'u4l3-per-degree', 'Look at the “how far off” row: how much does it change from one column to the next?']] } }],
              'From ' + dC(lo) + ' to ' + dC(hi) + ' (off by ' + sh.w + ' or less).<br>The error grows by 1 °F for every 5 Celsius degrees away from 10 °C: the estimate adds 2 per degree and the exact adds 1.8, so it gains 0.2 per degree, and ' + t('5\\times 0.2=1') + '.',
              ['Use the “how far off” row from (a).', 'Compare neighbouring columns of the “how far off” row.'], 'estimate pattern', { swap: false });
          } }] }
    ]
  });
})(window);
