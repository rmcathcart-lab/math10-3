/* Math 10-3 · Unit 1 · Lesson 5 — Rates and Unit Rates (N1)
 * Assignment 5 (u1_l05.tex, Questions 1–18) and the Lesson 5 Extra Practice (u1_ep05.tex, A 1–4, B 5–11, C 12–14).
 * Every part is a generator: the same situation and difficulty as the booklet item with new numbers around the booklet's
 * (the lesson's worked-example numbers are left out). Calculator allowed.
 * Answers: one number in a box with the unit written beside it (a typed unit or "$" is fine); money to the cent
 * ("$12.49", "12.49", "12.490" all accepted; too many decimals or too few gets a nudge, the wrong rounding direction
 * is wrong with a hint). Recognised wrong values each get their own hint: dividing the wrong way, multiplying instead
 * of dividing, forgetting to change hours to minutes (or km to m), the one-way trip instead of the round trip,
 * forgetting ×100 / ÷100 in L/100 km, using the shift pay instead of the hourly wage, rounding down whole tins.
 * Conversions: rate or ratio → a table with one choice per row; "write as a fraction and with a slash" → tap the two
 * correct ways; "which is better / explain" → multiple choice whose options are reasons; "who pays more because ___" →
 * one multiple choice (job + reason); two hourly wages → two labelled boxes. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;

  /* ================= numbers and money ================= */
  function q(x) { return Math.round(x * 1e9) / 1e9; }                    // clean float noise
  function rd(x, dp) { return K.roundTo(x, dp); }
  function trunc(x, dp) { var f = Math.pow(10, dp); return Math.floor(x * f + 1e-9) / f; }
  function same(a, b) { return Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(b)); }
  function nS(x, dp) { x = q(x); return dp != null ? x.toFixed(dp) : String(x); }   // plain digits
  function N(x, dp) { var s = nS(x, dp); return Math.abs(x) >= 10000 ? HW.fmt(s) : s; } // TeX (thin space from 10 000)
  function D(x) { return '\\$' + q(x).toFixed(2); }                       // TeX money
  function Dp(x) { return '$' + q(x).toFixed(2); }                       // plain money
  function u(s) { return '\\text{' + (s.charAt(0) === '/' ? '' : ' ') + s + '}'; } // TeX unit
  function Dg(x) { return Number.isInteger(q(x)) ? '$' + q(x) : Dp(x); }  // a given amount: $78, $136.50
  function an(n) { var s = String(n); return /^8/.test(s) || /^1[18]$/.test(s) || /^1[18]\d\d$/.test(s) ? 'an' : 'a'; }
  function decs(x) { var s = nS(x); return (s.split('.')[1] || '').length; }
  function find(gen, test, fallback) { for (var i = 0; i < 400; i++) { var v = gen(); if (v && test(v)) return v; } return fallback; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function steps(a) { return a.filter(Boolean).join('<br>'); }

  /* read a typed number: "$" and a unit after the number are allowed; a decimal comma is a format slip */
  function readNum(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\\$/g, '$').replace(/\\text\{([^}]*)\}/g, '$1').replace(/\s+/g, ' ').trim();
    s = s.replace(/^\$\s*/, '').replace(/\s*\$$/, '').trim();
    if (!s) return { code: 'empty' };
    var unit = null, m = /^(-?[\d.,]*\d\.?)\s*([a-zA-Z%°²³\/][\s\S]*)$/.exec(s);
    if (m) { unit = m[2]; s = m[1]; }
    if (/^-?\d+,\d{1,2}$/.test(s)) return { code: 'comma' };
    var p = HW.parse.number(s); if (!p.ok) return { code: 'notnumber' };
    return { v: p.value, dec: (s.replace(/,/g, '').split('.')[1] || '').length, unit: unit };
  }
  function near(v, w, dec) {
    if (!isFinite(w)) return false;
    if (same(v, w)) return true;
    if (dec > 4 || (dec === 0 && Math.abs(w) < 20)) return false;   // a whole number only matches a rounded value when it is big
    var r1 = rd(w, dec), r2 = trunc(w, dec);
    return (r1 !== 0 && same(v, r1)) || (dec > 0 && r2 !== 0 && same(v, r2));
  }
  /* o.dp (rounded answer), o.money (dp 2), o.exact (unrounded value), o.bad [[value, code, hint, 'form'?]], o.alt [values also right],
     o.whole (a count that must be a whole number: o.wholeMsg) */
  function numChk(ans, o) {
    o = o || {};
    var dp = o.money ? 2 : o.dp, exact = o.exact != null ? o.exact : ans;
    var place = o.money ? 'cent' : dp === 1 ? 'tenth' : dp === 0 ? 'whole number' : 'hundredth';
    return function (resp) {
      var a = readNum(resp);
      if (a.code === 'empty') return form('empty', 'Type your answer first.');
      if (a.code === 'comma') return form('u1l5-comma', 'Use a decimal <b>point</b>, not a comma (for example 12.49).');
      if (a.code) return form('notnumber', 'Type a single number (the unit is already written beside the box).');
      var v = a.v, i;
      if (same(v, ans)) return ok();
      for (i = 0; o.alt && i < o.alt.length; i++) if (same(v, o.alt[i])) return ok();
      if (o.whole && !Number.isInteger(v) && near(v, exact, a.dec)) return form('u1l5-whole', o.wholeMsg || 'You can only buy whole ones. How many do you need?');
      if (dp != null && a.dec > dp && same(rd(v, dp), ans)) return form('round', 'Right — now round to the nearest ' + place + '.');
      for (i = 0; o.bad && i < o.bad.length; i++) { var b = o.bad[i]; if (near(v, b[0], a.dec)) return b[3] === 'form' ? form(b[1], b[2]) : wrong(b[1], b[2]); }
      if (dp != null && a.dec < dp && Math.abs(v - ans) < Math.pow(10, -a.dec) - 1e-9) return form('places', o.money ? 'Give the amount to the cent (two decimal places), like ' + Dp(ans >= 1 ? 12.5 : 0.5) + '.' : 'Round to the nearest ' + place + ' (' + dp + ' decimal place' + (dp === 1 ? '' : 's') + ').');
      if (dp != null && !same(exact, ans) && a.dec <= dp && Math.abs(Math.abs(v - ans) - Math.pow(10, -dp)) < 1e-9 && (same(v, trunc(exact, dp)) || same(v, trunc(exact, dp) + Math.pow(10, -dp))))
        return wrong('u1l5-round-dir', 'Check your rounding: look at the digit after the ' + place + (o.money ? 's (the third decimal place)' : 's') + '. 5 or more rounds up; 4 or less rounds down.');
      return wrong('value', null);
    };
  }
  /* a number part. o: money, dp, exact, bad, alt, whole, wholeMsg, before, after, ans (TeX of the answer), sol, hints, text */
  function num(prompt, ans, o) {
    o = o || {}; ans = q(ans);
    var dp = o.money ? 2 : o.dp, key = dp != null ? ans.toFixed(dp) : nS(ans);
    var bad = (o.bad || []).filter(function (b) { return b && isFinite(b[0]) && !same(b[0], ans) && !(dp != null && same(rd(b[0], dp), ans)) && !(o.alt || []).some(function (x) { return same(x, b[0]); }); });
    var seen = []; bad = bad.filter(function (b) { if (seen.some(function (x) { return same(x, b[0]); })) return false; seen.push(b[0]); return true; });
    var p = { prompt: prompt, input: { type: 'number', before: o.money ? '$' : o.before, after: o.after },
      check: numChk(ans, { money: o.money, dp: o.dp, exact: o.exact, bad: bad, alt: o.alt, whole: o.whole, wholeMsg: o.wholeMsg }),
      key: key, answer: t(o.ans || ((o.money ? '\\$' + key : N(ans, dp)) + (o.after ? u(o.after) : ''))), solution: o.sol, hints: o.hints || [], text: o.text };
    p.bad = bad.filter(function (b) { return b[3] !== 'form'; }).map(function (b) { return nS(b[0]); });
    p.good = o.money ? ['$' + key, key + '0'] : [];
    return p;
  }
  function wrongWay(top, bot) { return 'You divided the wrong way. The unit after “per” goes on the <b>bottom</b>: ' + top + ' per ' + bot + ' means ' + top + ' ÷ ' + bot + '.'; }

  HW.addCodes({
    'u1l5-wrong-way': 'Divided the wrong way (bottom ÷ top)', 'u1l5-multiplied': 'Multiplied instead of dividing', 'u1l5-divided': 'Divided instead of multiplying',
    'u1l5-no-convert': 'Forgot to change the units (h ↔ min, km ↔ m)', 'u1l5-half-convert': 'Did only one of the two unit changes', 'u1l5-shift-pay': 'Used the total pay instead of the hourly wage',
    'u1l5-groups': 'Gave the number of groups instead of the amount', 'u1l5-per100': 'Forgot the rate is per 100 g', 'u1l5-round-down': 'Rounded down a count that must cover everything',
    'u1l5-one-way': 'Used the one-way distance (not the round trip)', 'u1l5-no100': 'Forgot ×100 or ÷100 in L/100 km', 'u1l5-km-per-L': 'Found km per litre instead of L/100 km',
    'u1l5-round-dir': 'Rounded the wrong way', 'u1l5-not-diff': 'Didn’t subtract (gave one amount, not the difference)', 'u1l5-total-diff': 'Compared total pay instead of hourly wages',
    'u1l5-added': 'Added the two numbers', 'u1l5-wrong-mult': 'Multiplied by the wrong number', 'u1l5-cents': 'Gave cents instead of dollars', 'u1l5-comma': 'Decimal comma',
    'u1l5-whole': 'Decimal number of whole items', 'u1l5-other-box': 'The other job’s wage', 'u1l5-one-cost': 'Gave one of the two costs', 'u1l5-litres-only': 'Gave litres instead of dollars',
    'u1l5-per-min': 'Gave the rate per minute (not per hour)', 'u1l5-per-one': 'Stopped at the rate for one unit', 'u1l5-rate-ratio': 'Mixed up rate and ratio', 'u1l5-rate-form': 'A wrong way to write a rate'
  });
  HW.addPartial({
    'u1l5-wrong-way': 'n', 'u1l5-multiplied': 'n', 'u1l5-divided': 'n', 'u1l5-no-convert': 'b', 'u1l5-half-convert': 'b', 'u1l5-shift-pay': 'b', 'u1l5-groups': 's', 'u1l5-per100': 'b',
    'u1l5-round-down': 'b', 'u1l5-one-way': 'b', 'u1l5-no100': 'b', 'u1l5-km-per-L': 'n', 'u1l5-round-dir': 's', 'u1l5-not-diff': 'b', 'u1l5-total-diff': 'n', 'u1l5-added': 'n',
    'u1l5-wrong-mult': 'n', 'u1l5-other-box': 'n', 'u1l5-one-cost': 'b', 'u1l5-litres-only': 'b', 'u1l5-per-min': 'b', 'u1l5-per-one': 'b'
  });

  /* ================= rate or ratio ================= */
  var RATES = [
    function (r) { var h = r.int(2, 6), s = r.int(12, 19) * 5; return { html: (s * h) + ' km in ' + h + ' h', why: 'kilometres and hours are different units' }; },
    function (r) { var n = r.pick([2, 4]), p = n * r.pick([1.89, 2.15, 2.29, 2.45, 2.60]); return { html: Dp(p) + ' for ' + n + ' L of milk', why: 'dollars and litres are different units' }; },
    function (r) { var b = r.int(2, 4), s = b * r.int(18, 28) + r.int(0, 1); return { html: s + ' students for ' + b + ' buses', why: 'students and buses are different units' }; },
    function (r) { var m = r.int(3, 9), w = m * r.int(35, 70); return { html: w + ' words in ' + m + ' min', why: 'words and minutes are different units' }; },
    function (r) { var g = r.int(2, 6), s = r.int(g + 1, 12); return { html: s + ' goals in ' + g + ' games', why: 'goals and games are different units' }; },
    function (r) { var p = r.int(3, 8), v = p * r.pick([125, 150, 200, 250]); return { html: v + ' mL of juice for ' + p + ' people', why: 'millilitres and people are different units' }; },
    function (r) { var s = r.pick([10, 15, 20, 30]), b = Math.round(s * r.int(60, 100) / 60); return { html: b + ' heartbeats in ' + s + ' s', why: 'heartbeats and seconds are different units' }; },
    function (r) { var k = r.pick([2, 3, 4, 5]), p = q(k * r.pick([2.49, 2.99, 3.25, 3.80, 4.15])); return { html: Dp(p) + ' for ' + k + ' kg of apples', why: 'dollars and kilograms are different units' }; },
    function (r) { var m = r.pick([2, 4, 5, 6]), pg = m * r.int(15, 32); return { html: pg + ' pages printed in ' + m + ' min', why: 'pages and minutes are different units' }; }
  ];
  var RATIOS = [
    function (r) { var a = r.int(2, 9) * 5, b = r.int(2, 9) * 5; if (a === b) b += 10; return { html: a + ' cm to ' + b + ' cm', why: 'both lengths are in centimetres' }; },
    function (r) { var a = r.int(2, 5), b = r.int(2, 4); if (a === b) a++; return { html: a + ' cups of flour to ' + b + ' cups of sugar', why: 'both amounts are in cups' }; },
    function (r) { var w = r.int(4, 12), l = r.int(2, 10); if (w === 9 && l === 6) l = 7; return { html: w + ' wins to ' + l + ' losses', why: 'both amounts are numbers of games' }; },
    function (r) { var a = r.int(3, 9), b = r.int(3, 9); if (a === b) b++; return { html: a + ' red marbles to ' + b + ' blue marbles', why: 'both amounts are numbers of marbles' }; },
    function (r) { var a = r.pick([50, 75, 100, 150]), b = r.pick([250, 300, 400, 500]); return { html: a + ' mL of syrup to ' + b + ' mL of water', why: 'both amounts are in millilitres' }; },
    function (r) { var a = r.int(10, 16), b = r.int(10, 16); if (a === b) b++; return { html: a + ' boys to ' + b + ' girls in a class', why: 'both amounts are numbers of students' }; },
    function (r) { var a = r.int(2, 6) * 10, b = r.int(3, 8) * 10; if (a === b) b += 10; return { html: a + ' kg of sand to ' + b + ' kg of gravel', why: 'both amounts are in kilograms' }; },
    function (r) { var a = r.int(2, 6) * 5, b = r.int(2, 8) * 5; if (a === b) b += 5; return { html: a + ' min of running to ' + b + ' min of walking', why: 'both amounts are in minutes' }; },
    function (r) { var a = r.int(3, 12) * 10, b = r.int(2, 9) * 10; if (a === b) b += 10; return { html: '$' + a + ' saved to $' + b + ' spent', why: 'both amounts are in dollars' }; }
  ];
  function rateRatioPart(r, n) {
    var nRate = r.int(Math.max(1, Math.floor(n / 2) - 1), Math.ceil(n / 2) + (n > 4 ? 1 : 0)), items = [];
    r.sample(RATES.map(function (f, i) { return i; }), nRate).forEach(function (i) { var s = RATES[i](r); s.kind = 'rate'; items.push(s); });
    r.sample(RATIOS.map(function (f, i) { return i; }), n - nRate).forEach(function (i) { var s = RATIOS[i](r); s.kind = 'ratio'; items.push(s); });
    items = r.shuffle(items);
    var rows = items.map(function (s, i) { return { id: 'r' + i, html: '(' + 'abcdef'.charAt(i) + ') ' + s.html, label: s.html }; }), want = {};
    items.forEach(function (s, i) { want['r' + i] = s.kind; });
    var p = P.grid('Decide whether each statement is a <b>rate</b> or a <b>ratio</b>.', rows,
      [{ id: 'rate', html: 'Rate' }, { id: 'ratio', html: 'Ratio' }], want,
      { rowHead: 'Statement', why: function (id) { var s = items[+id.slice(1)]; return { code: 'u1l5-rate-ratio', hint: '“' + s.html + '”: ' + s.why + ', so it is a <b>' + s.kind + '</b>.' }; } },
      steps(items.map(function (s, i) { return '(' + 'abcdef'.charAt(i) + ') <b>' + s.kind + '</b>: ' + s.why + '.'; })),
      ['A <b>rate</b> compares quantities with <b>different</b> units. A <b>ratio</b> compares quantities with the <b>same</b> unit.', 'Look at the unit of each amount: are they the same kind of thing?'], 'rate or ratio');
    return p;
  }

  /* ================= writing a rate (tap the two correct ways) ================= */
  function writeRatePart(r, a, ua, b, ub, sol) {
    // a, b: numbers as TeX strings; ua, ub: unit TeX (money: ua = '$')
    var A = ua === '$' ? '\\$' + a : a + u(ua), B = ub === '$' ? '\\$' + b : b + u(ub);
    var Asw = ua === '$' ? '\\$' + b : b + u(ua), Bsw = ub === '$' ? '\\$' + a : a + u(ub);
    var opts = [
      { value: 'frac', html: t('\\dfrac{' + A + '}{' + B + '}'), right: true },
      { value: 'slash', html: t(A + '\\text{/}' + B), right: true },
      { value: 'nounit', html: t('\\dfrac{' + a + '}{' + b + '}'), why: t('\\dfrac{' + a + '}{' + b + '}') + ' has no units. A rate must always keep its units.' },
      { value: 'swap', html: t('\\dfrac{' + Asw + '}{' + Bsw + '}'), why: 'In ' + t('\\dfrac{' + Asw + '}{' + Bsw + '}') + ' the numbers have the wrong units. Each number keeps its own unit: ' + t(A) + ' and ' + t(B) + '.' },
      { value: 'colon', html: t(a + ':' + b), why: t(a + ':' + b) + ' is ratio form, and it has lost the units. A rate keeps its units.' }];
    var shown = r.shuffle(opts), want = ['frac', 'slash'];
    return { prompt: 'Tap <b>both</b> correct ways to write this rate.', input: { type: 'select', options: shown.map(function (o) { return { value: o.value, html: o.html }; }), help: 'Tap the two correct ways. Tap again to unselect.' },
      check: K.selectSet(want, function (extra, missing) {
        if (extra.length) { var o = opts.filter(function (x) { return x.value === extra[0]; })[0]; return { code: 'u1l5-rate-form', hint: o.why }; }
        return { code: 'u1l5-rate-form', hint: 'There are <b>two</b> correct ways: as a fraction and with a slash. Find the other one.' };
      }), key: want, answer: t('\\dfrac{' + A + '}{' + B + '}') + ' and ' + t(A + '\\text{/}' + B),
      solution: sol || t('\\dfrac{' + A + '}{' + B + '}') + ' or ' + t(A + '\\text{/}' + B) + '. Both keep the units.',
      hints: ['A rate keeps its units on both numbers.', 'You can write it as a fraction or with a slash (“per”).'], text: 'write rate ' + a + '/' + b, tries: 3 };
  }

  /* ================= unit rate ================= */
  /* top, bot: amounts; uT, uB: unit words (uT '$' for money); o: money, dp, after, words for hints */
  function unitRatePart(prompt, top, uT, bot, uB, o) {
    o = o || {};
    var ans = q(top / bot), money = uT === '$', after = o.after || (money ? '/' + uB : uT + '/' + uB);
    var topS = money ? D(top) : N(top), botS = N(bot);
    return num(prompt, ans, { money: money && decs(ans) <= 2 && !o.dp, dp: o.dp, exact: top / bot, after: after,
      ans: (money ? D(ans) : N(ans)) + u(money ? '/' + uB : uT + '/' + uB),
      bad: [[bot / top, 'u1l5-wrong-way', wrongWay(o.topWord || (money ? 'dollars' : uT), o.botWord || uB)], [top * bot, 'u1l5-multiplied', 'To find the amount for <b>one</b> ' + (o.one || uB) + ', divide: ' + t((money ? q(top).toFixed(2) : N(top)) + '\\div ' + botS) + '.']],
      sol: t((money ? q(top).toFixed(2) : N(top)) + '\\div ' + botS + '=' + (money ? q(ans).toFixed(2) : N(ans))) + '<br>The unit rate is ' + t((money ? D(ans) : N(ans)) + u(money ? '/' + uB : uT + '/' + uB)) + '.',
      hints: ['Unit rate = first quantity ÷ second quantity.', 'Divide ' + t(money ? topS : topS + u(uT)) + ' by ' + t(botS + u(uB)) + '.'], text: 'unit rate ' + top + '/' + bot });
  }

  /* ================= heart rate ================= */
  function heartPart(r, prompt, s, beats) {
    var k = 60 / s, ans = beats * k;
    return num(prompt, ans, { after: 'beats/min',
      bad: [[beats * s, 'u1l5-wrong-mult', 'Multiply by the number of ' + s + '-second groups in a minute: ' + t('60\\div ' + s + '=' + k) + ', not by ' + t(s) + '.'], [beats * 60, 'u1l5-wrong-mult', 'The beats were counted in ' + t(s) + ' s, not in 1 s. ' + t('60\\div ' + s + '=' + k) + ', so multiply by ' + t(k) + '.'], [beats / s, 'u1l5-per-one', 'That’s beats per <b>second</b>. Multiply by ' + t('60') + ' to get beats per minute.']],
      sol: '60 s is ' + t(k + '\\times ' + s) + ' s, so multiply by ' + t(k) + ':<br>' + t(beats + '\\times ' + k + '=' + ans) + '<br>The heart rate is ' + t(ans + u('beats/min')) + '.',
      hints: ['How many ' + s + '-second groups are in 60 s?', 'Multiply the beats by that number.'], text: 'heart ' + beats + '/' + s });
  }

  /* ================= converting speeds ================= */
  function kmhToMmin(prompt, s, o) {
    o = o || {}; var m = s * 1000, ans = q(m / 60);
    return num(prompt, ans, { after: 'm/min',
      bad: [[m, 'u1l5-half-convert', 'You changed km to m (' + t('\\times 1000') + '). Now change “per hour” to “per minute”: ' + t('\\div 60') + '.'], [s / 60, 'u1l5-half-convert', 'You changed per hour to per minute (' + t('\\div 60') + '), but not km to m. Multiply by ' + t('1000') + ' too.'], [s * 60, 'u1l5-no-convert', 'There are fewer metres in one minute than in one hour, so divide by ' + t('60') + ' (and change km to m: ' + t('\\times 1000') + ').'], [m * 60, 'u1l5-no-convert', 'One minute is shorter than one hour, so <b>divide</b> by ' + t('60') + '.'], [s * 60 / 1000, 'u1l5-no-convert', 'Change km to m by multiplying by ' + t('1000') + ', then divide by ' + t('60') + '.']],
      sol: t(N(s) + '\\text{ km}=' + N(s) + '\\times 1000=' + N(m) + '\\text{ m}') + ', so ' + N(m) + ' m in 60 min<br>' + t(N(m) + '\\div 60=' + N(ans)) + '<br>' + (o.who || 'The speed is') + ' ' + t(N(ans) + u('m/min')) + '.',
      hints: ['First change km to m: ' + t('\\times 1000') + '.', 'Then change per hour to per minute: ' + t('\\div 60') + '.'], text: 'km/h to m/min ' + s });
  }
  function mminToKmh(prompt, v, o) {
    o = o || {}; var m = v * 60, ans = q(m / 1000);
    return num(prompt, ans, { after: 'km/h',
      bad: [[m, 'u1l5-half-convert', 'That’s ' + N(m) + ' <b>metres</b> per hour. Change m to km: ' + t('\\div 1000') + '.'], [v / 1000, 'u1l5-half-convert', 'That’s km per <b>minute</b>. There are 60 min in an hour, so multiply by ' + t('60') + ' too.'], [v / 60, 'u1l5-no-convert', 'An hour is longer than a minute, so you go farther in an hour: multiply by ' + t('60') + ', then change m to km (' + t('\\div 1000') + ').'], [v * 1000 / 60, 'u1l5-no-convert', 'You did the km/h → m/min steps. Here go the other way: ' + t('\\times 60') + ' (per minute to per hour), then ' + t('\\div 1000') + ' (m to km).']],
      sol: 'In 1 h (60 min): ' + t(N(v) + '\\times 60=' + N(m)) + ' m<br>' + t(N(m) + '\\text{ m}=' + N(m) + '\\div 1000=' + N(ans) + '\\text{ km}') + '<br>' + (o.who || 'The speed is') + ' ' + t(N(ans) + u('km/h')) + '.',
      hints: ['First change per minute to per hour: ' + t('\\times 60') + '.', 'Then change m to km: ' + t('\\div 1000') + '.'], text: 'm/min to km/h ' + v });
  }
  function wagePerMin(prompt, w) {
    var ans = q(w / 60);
    return num(prompt, ans, { money: true, after: '/min',
      bad: [[w * 60, 'u1l5-no-convert', 'You earn less in one minute than in one hour, so <b>divide</b> by ' + t('60') + '.'], [ans * 100, 'u1l5-cents', 'That’s the answer in <b>cents</b>. Write it in dollars: ' + t(N(ans * 100) + '\\text{ cents}=' + D(ans)) + '.', 'form'], [w / 100, 'u1l5-wrong-mult', 'There are 60 minutes in an hour, so divide by ' + t('60') + ' (not 100).']],
      sol: t('1\\text{ h}=60\\text{ min}') + '<br>' + t(q(w).toFixed(2) + '\\div 60=' + ans.toFixed(2)) + '<br>That is ' + t(D(ans) + u('/min')) + ' (' + Math.round(ans * 100) + ' cents).',
      hints: ['1 h = 60 min.', 'Divide the hourly wage by ' + t('60') + '.'], text: '$/h to $/min ' + w });
  }

  /* ================= fuel ================= */
  function fuelConsPart(prompt, L, km, o) {
    o = o || {}; var ans = q(L / km * 100), d1 = Number.isInteger(ans) ? 1 : decs(ans);
    return num(prompt, ans, { after: 'L/100 km', ans: ans.toFixed(Math.max(1, d1)) + u('L/100 km'),
      bad: [[L / km, 'u1l5-no100', 'That’s litres per <b>1 km</b>. Multiply by ' + t('100') + ' to get litres per 100 km.'], [km / L, 'u1l5-km-per-L', 'That’s kilometres per litre. Fuel consumption is <b>litres</b> ÷ kilometres × 100.'], [km / L * 100, 'u1l5-wrong-way', 'Divide the <b>litres</b> by the kilometres: ' + t(N(L) + '\\div ' + N(km) + '\\times 100') + '.'], [L * km / 100, 'u1l5-multiplied', 'Divide the litres by the kilometres, then multiply by ' + t('100') + '.']],
      sol: t(N(L) + '\\div ' + N(km) + '\\times 100=' + ans.toFixed(Math.max(1, d1))) + '<br>' + (o.who || 'It uses') + ' ' + t(ans.toFixed(Math.max(1, d1)) + u('L/100 km')) + '.',
      hints: ['Fuel consumption = litres ÷ km × 100.', 'Calculator: ' + N(L) + ' ÷ ' + N(km) + ' × 100 =.'], text: 'L/100km ' + L + '/' + km });
  }
  function fuelNeedPart(prompt, rate, km, o) {
    o = o || {}; var exact = rate * km / 100, ans = o.dp != null ? rd(exact, o.dp) : q(exact);
    return num(prompt, ans, { dp: o.dp, exact: exact, after: 'L',
      bad: [[rate * km, 'u1l5-no100', 'The rate is per <b>100</b> km, so divide by ' + t('100') + ': ' + t(N(rate) + '\\times ' + N(km) + '\\div 100') + '.'], [km / rate, 'u1l5-wrong-way', 'Multiply the rate by the distance, then divide by ' + t('100') + ': ' + t(N(rate) + '\\times ' + N(km) + '\\div 100') + '.'], [rate / km * 100, 'u1l5-wrong-way', 'That’s how you find L/100 km. Here you know the rate: fuel needed = rate × km ÷ 100.']].concat(o.bad || []),
      sol: (o.pre || '') + t(N(rate) + '\\times ' + N(km) + '\\div 100=' + N(q(exact))) + (o.dp != null && !same(exact, ans) ? '<br>To the nearest tenth: ' + t(N(ans, o.dp) + u('L')) : '') + '<br>' + (o.who || 'It needs') + ' ' + t(N(ans, o.dp) + u('L')) + ' of gas.',
      hints: ['Fuel needed = fuel consumption × km ÷ 100.'].concat(o.hints || []), text: 'fuel need ' + rate + '×' + km });
  }

  /* ================= lesson ================= */
  HW.defineLesson({
    id: 'u1l5', unit: 1, num: '5', title: 'Rates and Unit Rates', outcome: 'N1',
    blurb: 'Rates and ratios, unit rates, predicting with a rate, fuel use in L/100 km, and comparing and converting rates.',
    questions: [
      { num: '1', stem: '', parts: [
        { id: '1', level: 'LIM', make: function (r) { return rateRatioPart(r, 6); } }] },
      { num: '2', stem: 'Write each as a rate, as a fraction and with a slash. Include the units.', parts: [
        { id: '2a', level: 'LIM', make: function (r) {
          var v = find(function () { var h = r.int(3, 8), w = r.pick([12, 13, 14, 15, 16, 17, 18]); return { h: h, p: h * w }; }, function (v) { return !(v.p === 45 && v.h === 3); }, { h: 6, p: 96 });
          var who = r.pick(['Rosa', 'Mia', 'Jayden', 'Amir']), job = r.pick(['babysitting', 'mowing lawns', 'shovelling walks']);
          var p = writeRatePart(r, String(v.p), '$', String(v.h), 'h');
          p.prompt = who + ' earns $' + v.p + ' for ' + v.h + ' h of ' + job + '. ' + p.prompt; return p; } },
        { id: '2b', level: 'LIM', make: function (r) {
          var L = r.int(5, 30), h = r.int(2, 5); if (L % h === 0) L++;
          var p = writeRatePart(r, String(L), 'L', String(h), 'h');
          p.prompt = 'A leaky tap drips ' + L + ' L of water every ' + h + ' h. ' + p.prompt; return p; } },
        { id: '2c', level: 'LIM', make: function (r) {
          var m = r.int(3, 12), c = r.int(800, 4500) / 100;
          var p = writeRatePart(r, c.toFixed(2), '$', String(m), 'months');
          p.prompt = 'A savings account earned $' + c.toFixed(2) + ' interest in ' + m + ' months. ' + p.prompt; return p; } },
        { id: '2d', level: 'BEG', make: function (r) {
          var k = r.pick([2, 3, 4, 5, 10, 25]);
          var p = writeRatePart(r, String(k), 'km', '1', 'cm', t('\\dfrac{' + k + '\\text{ km}}{1\\text{ cm}}') + ' or ' + t(k + '\\text{ km/cm}') + '. The kilometres go on top because the rate tells you how many km each centimetre stands for.');
          p.prompt = 'On a trail map, 1 cm stands for ' + k + ' km. ' + p.prompt + ' (Put the kilometres on top.)'; return p; } }] },
      { num: '3', stem: 'Find each unit rate. The unit is written beside the box.', parts: [
        { id: '3a', level: 'BEG', make: function (r) { var v = find(function () { return [r.int(2, 6), r.int(8, 19) * 5]; }, function (v) { return !(v[0] === 3 && v[1] === 18); }, [3, 70]); return unitRatePart(v[1] * v[0] + ' km in ' + v[0] + ' h', v[1] * v[0], 'km', v[0], 'h', { topWord: 'kilometres', botWord: 'hour', one: 'hour' }); } },
        { id: '3b', level: 'BEG', make: function (r) { var v = find(function () { return [r.int(3, 8), r.int(56, 96) * 25]; }, function (v) { return !(v[0] === 8 && v[1] === 1665) && !(v[0] === 3 && v[1] === 1500); }, [4, 1950]); var tot = v[0] * v[1] / 100; return unitRatePart(Dg(tot) + ' for ' + v[0] + ' h of work', tot, '$', v[0], 'h', { topWord: 'dollars', botWord: 'hour', one: 'hour' }); } },
        { id: '3c', level: 'BEG', make: function (r) { var v = find(function () { return [r.int(3, 9), r.int(35, 80)]; }, function (v) { return !(v[0] === 6 && v[1] === 65); }, [5, 69]); return unitRatePart(v[0] * v[1] + ' words in ' + v[0] + ' min', v[0] * v[1], 'words', v[0], 'min', { topWord: 'words', botWord: 'minute', one: 'minute' }); } },
        { id: '3d', level: 'EMG', make: function (r) { var d = r.int(5, 12), k = r.pick([0.2, 0.25, 0.3, 0.35, 0.4, 0.45]), tot = q(d * k); return unitRatePart(N(tot) + ' kg of dog food in ' + d + ' days', tot, 'kg', d, 'day', { topWord: 'kilograms', botWord: 'day', one: 'day' }); } },
        { id: '3e', level: 'EMG', make: function (r) { var m = r.int(4, 12), k = r.pick([0.15, 0.2, 0.25, 0.3, 0.35]), tot = q(m * k); return unitRatePart(N(tot) + ' km in ' + m + ' min', tot, 'km', m, 'min', { topWord: 'kilometres', botWord: 'minute', one: 'minute' }); } },
        { id: '3f', level: 'EMG', make: function (r) { var v = find(function () { return [r.pick([0.5, 1.5, 2.5, 3.5]), r.int(6, 24) * 2]; }, function (v) { return !(v[0] === 1.5 && v[1] === 16) && Number.isInteger(v[0] * v[1]); }, [2.5, 36]); return unitRatePart(N(v[0] * v[1]) + ' L of water in ' + v[0] + ' min', q(v[0] * v[1]), 'L', v[0], 'min', { topWord: 'litres', botWord: 'minute', one: 'minute' }); } }] },
      { num: '4', stem: function (sh) { return 'Sofia earns ' + Dg(sh.pay) + ' for ' + sh.h + ' h of work at a coffee shop.'; },
        shared: function (r) { return find(function () { var w = r.int(62, 88) * 25 / 100, h = r.int(5, 9); return { w: w, h: h, pay: q(w * h), m: r.int(20, 40), k: r.int(12, 30) }; }, function (s) { return s.m !== s.k && s.m !== s.h && s.k !== s.h && !(s.w === 16.5 && s.h === 15); }, { w: 19.5, h: 7, pay: 136.5, m: 32, k: 24 }); },
        parts: [
          { id: '4a', level: 'BEG', make: function (r, sh) { return num('What is her hourly wage?', sh.w, { money: true, after: '/h', bad: [[sh.h / sh.pay, 'u1l5-wrong-way', wrongWay('dollars', 'hour')], [sh.pay * sh.h, 'u1l5-multiplied', 'To find the pay for <b>one</b> hour, divide the pay by the hours.']], sol: t(q(sh.pay).toFixed(2) + '\\div ' + sh.h + '=' + sh.w.toFixed(2)) + '<br>Her wage is ' + t(D(sh.w) + u('/h')) + '.', hints: ['Wage = pay ÷ hours.'], text: 'wage' }); } },
          { id: '4b', level: 'EMG', make: function (r, sh) { var ans = q(sh.w * sh.m); return num('How much will she earn in a month when she works ' + sh.m + ' h?', ans, { money: true, bad: [[sh.pay * sh.m, 'u1l5-shift-pay', Dp(sh.pay) + ' is her pay for ' + sh.h + ' h, not for 1 h. Use her hourly wage.'], [sh.m / sh.w, 'u1l5-divided', 'To find the pay for many hours, <b>multiply</b> the hourly wage by the hours.'], [sh.w + sh.m, 'u1l5-added', 'Multiply the hourly wage by the number of hours.']], sol: 'Wage from (a): ' + t(D(sh.w) + u('/h')) + '<br>' + t(sh.w.toFixed(2) + '\\times ' + sh.m + '=' + ans.toFixed(2)) + '<br>She will earn ' + t(D(ans)) + '.', hints: ['Use her hourly wage from (a).', 'Amount = unit rate × number of hours.'], text: 'month pay' }); } },
          { id: '4c', level: 'PRG', make: function (r, sh) { var T = q(sh.w * sh.k); return num('How many hours must she work to earn ' + Dp(T) + '?', sh.k, { after: 'h', bad: [[T * sh.w, 'u1l5-multiplied', 'This asks for the number of <b>hours</b>, so divide the money by the hourly wage.'], [T / sh.pay, 'u1l5-shift-pay', 'That’s the number of ' + sh.h + '-hour shifts. Divide by the <b>hourly</b> wage to get hours.'], [sh.w / T, 'u1l5-wrong-way', 'Divide the money she wants by her hourly wage: ' + t(T.toFixed(2) + '\\div ' + sh.w.toFixed(2)) + '.']], sol: 'Number of hours = amount ÷ unit rate<br>' + t(T.toFixed(2) + '\\div ' + sh.w.toFixed(2) + '=' + sh.k) + '<br>She must work ' + t(sh.k + u('h')) + '. (Check: ' + t(sh.w.toFixed(2) + '\\times ' + sh.k + '=' + T.toFixed(2)) + '.)', hints: ['This asks for hours: divide the money by the hourly wage.'], text: 'hours needed' }); } }] },
      { num: '5', stem: function (sh) { return 'Marcus types ' + sh.s + ' words/min.'; },
        shared: function (r) { return find(function () { return { s: r.int(40, 75), m: r.int(8, 20), k: r.int(15, 35) }; }, function (s) { return s.s !== 48 && s.m !== s.k; }, { s: 55, m: 12, k: 26 }); },
        parts: [
          { id: '5a', level: 'BEG', make: function (r, sh) { var ans = sh.s * sh.m; return num('How many words can he type in ' + sh.m + ' min?', ans, { after: 'words', bad: [[sh.s / sh.m, 'u1l5-divided', 'He types ' + sh.s + ' words <b>every</b> minute, so multiply by the number of minutes.'], [sh.s + sh.m, 'u1l5-added', 'Multiply the words per minute by the minutes.']], sol: t(sh.s + '\\times ' + sh.m + '=' + ans) + '<br>He can type ' + t(ans + u('words')) + '.', hints: ['Amount = unit rate × number of minutes.'], text: 'words in min' }); } },
          { id: '5b', level: 'EMG', make: function (r, sh) { var W = sh.s * sh.k; return num('How long will it take him to type ' + an(W) + ' ' + W + '-word report?', sh.k, { after: 'min', bad: [[W * sh.s, 'u1l5-multiplied', 'This asks for the number of <b>minutes</b>, so divide the words by the words per minute.'], [sh.s / W, 'u1l5-wrong-way', 'Divide the words in the report by his words per minute: ' + t(W + '\\div ' + sh.s) + '.']], sol: 'This asks for the number of minutes, so divide:<br>' + t(W + '\\div ' + sh.s + '=' + sh.k) + '<br>It will take him ' + t(sh.k + u('min')) + '. (Check: ' + t(sh.s + '\\times ' + sh.k + '=' + W) + '.)', hints: ['Number of minutes = words ÷ words per minute.'], text: 'time for report' }); } }] },
      { num: '6', stem: function (sh) { return 'Shaved ham costs ' + Dp(sh.c) + ' per 100 g at a deli in Airdrie.'; },
        shared: function (r) { return find(function () { return { c: q((r.int(12, 34) * 10 + r.pick([8, 9, 5])) / 100), g: r.pick([200, 300, 400, 500, 600, 700, 800]), k: r.int(2, 9) }; }, function (s) { return !(Math.abs(s.c - 2.38) < 1e-9) && s.g / 100 !== s.k; }, { c: 1.98, g: 300, k: 5 }); },
        parts: [
          { id: '6a', level: 'EMG', make: function (r, sh) { var n = sh.g / 100, ans = q(n * sh.c); return num('How much do ' + sh.g + ' g cost?', ans, { money: true, bad: [[sh.g * sh.c, 'u1l5-per100', 'The price is for <b>100 g</b>, not 1 g. ' + t(sh.g + '\\div 100=' + n) + ', so ' + sh.g + ' g is ' + n + ' groups of 100 g.'], [sh.c / n, 'u1l5-divided', sh.g + ' g is ' + n + ' groups of 100 g, so <b>multiply</b> the price by ' + t(n) + '.'], [sh.g * sh.c / 1000, 'u1l5-per100', 'Divide the grams by <b>100</b> (the price is per 100 g), not 1000.']], sol: t(sh.g + '\\div 100=' + n) + ', so ' + sh.g + ' g is ' + n + ' groups of 100 g.<br>' + t(n + '\\times ' + sh.c.toFixed(2) + '=' + ans.toFixed(2)) + '<br>' + sh.g + ' g cost ' + t(D(ans)) + '.', hints: ['How many groups of 100 g are in ' + sh.g + ' g?', 'Multiply that by the price per 100 g.'], text: 'ham cost' }); } },
          { id: '6b', level: 'PRG', make: function (r, sh) { var X = q(sh.k * sh.c), ans = 100 * sh.k; return num('Hana spends ' + Dp(X) + ' on ham. How many grams does she get?', ans, { after: 'g', bad: [[sh.k, 'u1l5-groups', 'That’s ' + sh.k + ' groups of 100 g. How many <b>grams</b> is that?', 'form'], [X * sh.c, 'u1l5-multiplied', 'Divide the money by the price per 100 g to find how many groups of 100 g she gets.'], [sh.k * 1000, 'u1l5-wrong-mult', 'Each group is 100 g, so multiply the groups by ' + t('100') + '.'], [X / sh.c / 100, 'u1l5-wrong-mult', 'Each group is 100 g, so <b>multiply</b> the number of groups by ' + t('100') + '.']], sol: t(X.toFixed(2) + '\\div ' + sh.c.toFixed(2) + '=' + sh.k) + ' groups of 100 g<br>' + t(sh.k + '\\times 100=' + ans) + '<br>She gets ' + t(ans + u('g')) + ' of ham.', hints: ['Divide the money by the price per 100 g.', 'That tells you the number of 100 g groups. Change it to grams.'], text: 'ham grams' }); } }] },
      { num: '7', stem: function (sh) { return 'A landscaper mixes ' + sh.mL + ' mL of liquid fertilizer into ' + sh.L + ' L of water.'; },
        shared: function (r) { return find(function () { var rr = r.int(10, 25), L = r.int(2, 5); return { rr: rr, L: L, mL: rr * L, T: r.int(8, 20) }; }, function (s) { return s.T !== s.L; }, { rr: 15, L: 3, mL: 45, T: 12 }); },
        parts: [
          { id: '7a', level: 'BEG', make: function (r, sh) { return num('How many millilitres of fertilizer is that per litre of water?', sh.rr, { after: 'mL/L', bad: [[sh.L / sh.mL, 'u1l5-wrong-way', wrongWay('millilitres', 'litre')], [sh.mL * sh.L, 'u1l5-multiplied', 'To find the amount for <b>one</b> litre, divide the millilitres by the litres.']], sol: t(sh.mL + '\\div ' + sh.L + '=' + sh.rr) + '<br>That is ' + t(sh.rr + u('mL/L')) + '.', hints: ['mL per L means mL ÷ L.'], text: 'mL per L' }); } },
          { id: '7b', level: 'EMG', make: function (r, sh) { var ans = sh.rr * sh.T; return num('How much fertilizer does she need for ' + an(sh.T) + ' ' + sh.T + ' L sprayer tank?', ans, { after: 'mL', bad: [[sh.mL * sh.T, 'u1l5-wrong-mult', sh.mL + ' mL is for ' + sh.L + ' L of water. Use the amount for <b>1 L</b> from (a).'], [sh.T / sh.rr, 'u1l5-divided', 'Multiply the mL per litre by the litres in the tank.'], [sh.rr + sh.T, 'u1l5-added', 'Multiply the mL per litre by the litres in the tank.']], sol: 'From (a): ' + t(sh.rr + u('mL/L')) + '<br>' + t(sh.rr + '\\times ' + sh.T + '=' + ans) + '<br>She needs ' + t(ans + u('mL')) + ' of fertilizer.', hints: ['Use the rate per litre from (a).', 'Multiply by the litres in the tank.'], text: 'fertilizer for tank' }); } }] },
      { num: '8', stem: '', parts: [
        { id: '8', level: 'PRG', make: function (r) {
          var ctx = r.pick([['A machine in a bakery makes', 'cookies'], ['A machine at a candy factory wraps', 'candy bars'], ['A printer at a print shop prints', 'flyers'], ['A machine at a dairy fills', 'yogurt cups']]);
          var v = find(function () { return { rr: r.int(8, 20), m: r.pick([6, 8, 10, 12, 15, 20]), H: r.int(4, 8) }; }, function (v) { return !(v.rr === 6 && v.m === 45); }, { rr: 14, m: 12, H: 6 });
          var c = v.rr * v.m, mins = v.H * 60, ans = v.rr * mins;
          return num(ctx[0] + ' ' + c + ' ' + ctx[1] + ' in ' + v.m + ' min. How many ' + ctx[1] + ' can it make in ' + an(v.H) + ' ' + v.H + '-hour shift?', ans, { after: ctx[1],
            bad: [[v.rr * v.H, 'u1l5-no-convert', 'The rate is per <b>minute</b> but the shift is in <b>hours</b>. Change ' + v.H + ' h to minutes first (' + t('1\\text{ h}=60\\text{ min}') + ').'], [c * v.H, 'u1l5-no-convert', c + ' ' + ctx[1] + ' take ' + v.m + ' min, not 1 h. Find the rate per minute, and change the shift to minutes.'], [c * mins, 'u1l5-wrong-mult', c + ' ' + ctx[1] + ' is for ' + v.m + ' min. Find the unit rate (per 1 min) first: ' + t(c + '\\div ' + v.m) + '.']],
            sol: 'Unit rate: ' + t(c + '\\div ' + v.m + '=' + v.rr) + ' ' + ctx[1] + '/min<br>' + t(v.H + '\\text{ h}=' + v.H + '\\times 60=' + mins + '\\text{ min}') + '<br>' + t(v.rr + '\\times ' + mins + '=' + N(ans)) + '<br>It can make ' + t(N(ans)) + ' ' + ctx[1] + ' in one shift.',
            hints: ['Find the unit rate per minute.', 'Change the shift from hours to minutes before you multiply.'], text: 'shift output' });
        } }] },
      { num: '9', stem: function (sh) { return 'One 1 L tin of deck stain covers ' + sh.c + ' m². Owen’s deck has an area of ' + sh.A + ' m².'; },
        shared: function (r) { return find(function () { var c = r.pick([7, 8, 9, 10, 12]), A = r.int(30, 80); return { c: c, A: A, n: Math.ceil(A / c), P: r.pick([19.99, 22.49, 24.99, 27.99, 29.99]) }; }, function (s) { return s.A % s.c !== 0 && s.A / s.c - Math.floor(s.A / s.c) > 0.12 && s.A / s.c - Math.floor(s.A / s.c) < 0.88 && !(s.c === 35); }, { c: 9, A: 52, n: 6, P: 24.99 }); },
        parts: [
          { id: '9a', level: 'EMG', make: function (r, sh) { var x = sh.A / sh.c, lo = Math.floor(x); return num('How many tins should he buy?', sh.n, { after: 'tins', exact: x, whole: true, wholeMsg: t(sh.A + '\\div ' + sh.c + '=' + nS(rd(x, 2)) + '\\ldots') + ' tins. He can only buy whole tins. How many must he buy so the whole deck is covered?',
            bad: [[lo, 'u1l5-round-down', lo + ' tins cover only ' + t(lo + '\\times ' + sh.c + '=' + lo * sh.c) + ' m², which is less than ' + sh.A + ' m². Round <b>up</b>.'], [sh.A * sh.c, 'u1l5-multiplied', 'Divide the area by the area one tin covers.']],
            sol: t(sh.A + '\\div ' + sh.c + '=' + nS(rd(x, 2)) + '\\ldots') + ' tins<br>' + lo + ' tins cover only ' + t(lo + '\\times ' + sh.c + '=' + lo * sh.c) + ' m², which is not enough.<br>Round up: he should buy ' + t(sh.n) + ' tins.', hints: ['Divide the deck area by the area one tin covers.', 'You must buy whole tins, and the whole deck must be covered.'], text: 'tins' }); } },
          { id: '9b', level: 'EMG', make: function (r, sh) { var ans = q(sh.n * sh.P), x = sh.A / sh.c; return num('Each tin costs ' + Dp(sh.P) + '. What will the tins cost (before tax)?', ans, { money: true, bad: [[x * sh.P, 'u1l5-whole', 'You can’t buy part of a tin. Use the whole number of tins from (a).'], [Math.floor(x) * sh.P, 'u1l5-round-down', Math.floor(x) + ' tins aren’t enough to cover the deck. Use your answer to (a).']], sol: 'From (a): ' + sh.n + ' tins<br>' + t(sh.n + '\\times ' + sh.P.toFixed(2) + '=' + ans.toFixed(2)) + '<br>The tins cost ' + t(D(ans)) + ' before tax.', hints: ['Multiply the number of tins from (a) by the price of one tin.'], text: 'tin cost' }); } }] },
      { num: '10', stem: 'Find the fuel consumption of each vehicle in L/100 km.',
        shared: function (r) {
          var V = [['A car', 'car', 6, 8], ['A work truck', 'work truck', 11, 14], ['A minivan', 'minivan', 8, 10], ['A hatchback', 'hatchback', 5, 7], ['An SUV', 'SUV', 9, 12], ['A pickup truck', 'pickup truck', 11, 15]];
          return find(function () {
            var pair = r.sample(V, 2);
            var v = pair.map(function (x) { var rate = r.int(x[2] * 2, x[3] * 2) / 2, km = r.int(30, 65) * 10; return { a: x[0], n: x[1], rate: rate, km: km, L: q(rate * km / 100) }; });
            return { v: v };
          }, function (s) { var a = s.v[0], b = s.v[1]; return Math.abs(a.rate - b.rate) >= 1 && a.rate !== 10 && b.rate !== 10 && decs(a.L) <= 1 && decs(b.L) <= 1 && a.km !== b.km && !(a.L === 37.8 && a.km === 540); }, { v: [{ a: 'A car', n: 'car', rate: 7, km: 540, L: 37.8 }, { a: 'A work truck', n: 'work truck', rate: 12, km: 570, L: 68.4 }] });
        },
        parts: [
          { id: '10a', level: 'EMG', make: function (r, sh) { var v = sh.v[0]; return fuelConsPart(v.a + ' used ' + N(v.L) + ' L of gas to drive ' + v.km + ' km.', v.L, v.km, { who: 'The ' + v.n + ' uses' }); } },
          { id: '10b', level: 'EMG', make: function (r, sh) { var v = sh.v[1]; return fuelConsPart(v.a + ' used ' + N(v.L) + ' L of gas to drive ' + v.km + ' km.', v.L, v.km, { who: 'The ' + v.n + ' uses' }); } },
          { id: '10c', level: 'EMG', make: function (r, sh) {
            var lo = sh.v[0].rate < sh.v[1].rate ? sh.v[0] : sh.v[1], hi = lo === sh.v[0] ? sh.v[1] : sh.v[0], fewL = sh.v[0].L < sh.v[1].L ? sh.v[0] : sh.v[1], far = sh.v[0].km > sh.v[1].km ? sh.v[0] : sh.v[1];
            var f = function (x) { return x.toFixed(1); };
            return P.mc(r, 'Which vehicle uses less fuel? Use your answers to (a) and (b).', [
              { html: 'The ' + lo.n + ', because its L/100 km is <b>lower</b>.', right: true },
              { html: 'The ' + hi.n + ', because its L/100 km is <b>higher</b>.', why: 'L/100 km is the litres burned for every 100 km. A <b>higher</b> number means <b>more</b> fuel, so lower is better.', code: 'higher' },
              { html: 'The ' + fewL.n + ', because it used fewer litres in total.', why: 'The two vehicles drove different distances, so their total litres can’t be compared fairly. Compare the L/100 km.', code: 'total' },
              { html: 'The ' + far.n + ', because it drove farther on its gas.', why: 'Distance alone doesn’t tell you. Compare the litres used for the <b>same</b> distance: L/100 km.', code: 'far' }],
              'The ' + lo.n + ', because ' + f(lo.rate) + ' L/100 km is lower than ' + f(hi.rate) + ' L/100 km. For fuel consumption, lower is better.', ['Use your answers to (a) and (b).', 'A lower L/100 km means less fuel for every 100 km.'], 'less fuel');
          } }] },
      { num: '11', stem: function (sh) { return 'Grace is driving from Calgary to ' + sh.city + ' and back. It is about ' + sh.d + ' km each way. Her car uses ' + N(sh.rate) + ' L/100 km and gas costs ' + Dp(sh.p) + '/L.'; },
        shared: function (r) {
          var C = [['Edmonton', 300], ['Lethbridge', 210], ['Red Deer', 150], ['Medicine Hat', 300], ['Drumheller', 140], ['Golden', 260], ['Waterton', 270], ['Revelstoke', 410]];
          return find(function () { var c = r.pick(C), rate = r.int(13, 20) / 2, need = q(rate * 2 * c[1] / 100), yes = r.chance(0.5), T = yes ? Math.ceil(need) + r.int(1, 8) : Math.floor(need) - r.int(1, 6); return { city: c[0], d: c[1], rate: rate, p: r.int(125, 159) / 100, need: need, T: T }; },
            function (s) { return s.need >= 20 && s.need <= 75 && s.T >= 40 && s.T <= 80 && !(s.d === 130 && s.rate === 7.4); }, { city: 'Edmonton', d: 300, rate: 8.5, p: 1.39, need: 51, T: 50 });
        },
        parts: [
          { id: '11a', level: 'EMG', make: function (r, sh) { return fuelNeedPart('How many litres of gas will she need for the round trip?', sh.rate, 2 * sh.d, { who: 'She needs', pre: 'Round trip ' + t('=2\\times ' + sh.d + '=' + 2 * sh.d) + ' km<br>', bad: [[sh.rate * sh.d / 100, 'u1l5-one-way', 'That’s for one way. A round trip is there <b>and back</b>: ' + t('2\\times ' + sh.d) + ' km.']], hints: ['A round trip is there and back.'] }); } },
          { id: '11b', level: 'PRG', make: function (r, sh) { var ex = sh.need * sh.p, ans = rd(ex, 2); return num('How much will the gas cost?', ans, { money: true, exact: ex, bad: [[sh.rate * sh.d / 100 * sh.p, 'u1l5-one-way', 'That’s the cost for one way. Use the litres for the whole round trip.'], [sh.need / sh.p, 'u1l5-divided', 'Each litre costs ' + Dp(sh.p) + ', so <b>multiply</b> the litres by the price.'], [sh.need, 'u1l5-litres-only', 'That’s the litres. Multiply by the price per litre to get the cost.']], sol: 'From (a): ' + N(sh.need) + ' L<br>' + t(N(sh.need) + '\\times ' + sh.p.toFixed(2) + '=' + (same(ex, ans) ? ans.toFixed(2) : N(q(ex)))) + '<br>' + (same(ex, ans) ? 'The' : 'Round to the cent at the end: the') + ' gas will cost ' + t(D(ans)) + '.', hints: ['Cost = litres × price per litre.', 'Round to the cent at the end.'], text: 'gas cost' }); } },
          { id: '11c', level: 'PRG', make: function (r, sh) {
            var yes = sh.T >= sh.need, half = q(sh.need / 2);
            return P.mc(r, 'Her gas tank holds ' + sh.T + ' L. Can she make the round trip on one full tank?', [
              { html: 'Yes, because the tank holds more than she needs for the round trip.', right: yes, why: yes ? null : 'Compare carefully: she needs ' + N(sh.need) + ' L, and ' + sh.T + ' L is <b>less</b> than that.', code: 'yes' },
              { html: 'No, because she needs more gas for the round trip than the tank holds.', right: !yes, why: !yes ? null : 'Compare carefully: she needs ' + N(sh.need) + ' L, and the tank holds ' + sh.T + ' L, which is <b>more</b>.', code: 'no' },
              { html: 'Yes, because she only needs half of that gas for each way.', why: 'On one tank means she can’t fill up in ' + sh.city + '. Compare the <b>whole</b> round trip (' + N(sh.need) + ' L) with the tank.', code: 'half' }],
              (yes ? '<b>Yes.</b> She needs ' + N(sh.need) + ' L, which is less than the ' + sh.T + ' L the tank holds.' : '<b>No.</b> She needs ' + N(sh.need) + ' L, which is more than ' + sh.T + ' L, so she must stop for gas.'), ['Compare your answer to (a) with the size of the tank.'], 'one tank', true);
            void half;
          } }] },
      { num: '12', stem: function (sh) { return 'Kayla has two job offers. The ' + sh.j[0] + ' pays ' + Dg(sh.pay[0]) + ' for ' + an(sh.h[0]) + ' ' + sh.h[0] + '-hour shift. The ' + sh.j[1] + ' pays ' + Dg(sh.pay[1]) + ' for ' + an(sh.h[1]) + ' ' + sh.h[1] + '-hour shift.'; },
        shared: function (r) {
          var J = ['grocery store', 'movie theatre', 'coffee shop', 'hardware store', 'car wash', 'garden centre', 'pizza place'];
          return find(function () { var j = r.sample(J, 2), w = [r.int(64, 84) * 25 / 100, 0], h = [r.int(6, 9), r.int(4, 6)]; w[1] = q(w[0] + (r.chance(0.7) ? 1 : -1) * r.pick([0.25, 0.35, 0.5, 0.75, 1, 1.25])); return { j: j, w: w, h: h, pay: [q(w[0] * h[0]), q(w[1] * h[1])], W: r.int(15, 30) }; },
            function (s) { return s.h[0] !== s.h[1] && decs(s.pay[0]) <= 2 && decs(s.pay[1]) <= 2 && s.w[1] > 14 && Math.abs(s.w[0] - s.w[1]) > 0.01; }, { j: ['grocery store', 'movie theatre'], w: [18.9, 19.25], h: [8, 5], pay: [151.2, 96.25], W: 20 });
        },
        parts: [
          { id: '12a', level: 'EMG', make: function (r, sh) {
            var ck = [0, 1].map(function (i) { return numChk(sh.w[i], { money: true, bad: [[sh.h[i] / sh.pay[i], 'u1l5-wrong-way', wrongWay('dollars', 'hour')], [sh.w[1 - i], 'u1l5-other-box', 'That’s the ' + sh.j[1 - i] + '’s wage. Check which box is which.'], [sh.pay[i] * sh.h[i], 'u1l5-multiplied', 'Divide the shift pay by the hours.']] }); });
            var p = P.fields('Find the hourly wage for each job.', [{ label: cap(sh.j[0]) + ':', before: '$', after: '/h', name: cap(sh.j[0]) }, { label: cap(sh.j[1]) + ':', before: '$', after: '/h', name: cap(sh.j[1]) }], ck,
              [sh.w[0].toFixed(2), sh.w[1].toFixed(2)], cap(sh.j[0]) + ': ' + t(D(sh.w[0]) + u('/h')) + ' &nbsp; ' + cap(sh.j[1]) + ': ' + t(D(sh.w[1]) + u('/h')),
              [0, 1].map(function (i) { return cap(sh.j[i]) + ': ' + t(sh.pay[i].toFixed(2) + '\\div ' + sh.h[i] + '=' + sh.w[i].toFixed(2)) + ' → ' + t(D(sh.w[i]) + u('/h')); }).join('<br>'),
              ['Wage = shift pay ÷ hours in the shift.'], 'two wages');
            p.bad = [[String(sh.w[1].toFixed(2)), String(sh.w[0].toFixed(2))]];
            return p;
          } },
          { id: '12b', level: 'EMG', make: function (r, sh) {
            var b = sh.w[0] > sh.w[1] ? 0 : 1, o = 1 - b, bigPay = sh.pay[0] > sh.pay[1] ? 0 : 1, longer = sh.h[0] > sh.h[1] ? 0 : 1;
            var opts = [{ html: 'The <b>' + sh.j[b] + '</b> pays more because its hourly wage is higher.', right: true, code: 'right' },
              { html: 'The <b>' + sh.j[bigPay] + '</b> pays more because it pays more for one shift (' + Dg(sh.pay[bigPay]) + ').', why: 'The shifts are different lengths, so the shift pay can’t be compared. Compare the pay for <b>one hour</b>.', code: 'u1l5-total-diff' },
              { html: 'The <b>' + sh.j[longer] + '</b> pays more because its shift is longer.', why: 'A longer shift doesn’t mean better pay. Compare the hourly wages from (a).', code: 'longer' },
              { html: 'The <b>' + sh.j[o] + '</b> pays more because its hourly wage is lower.', why: 'A <b>higher</b> hourly wage pays more. Check your answers to (a).', code: 'lower' }];
            return P.mc(r, 'Which job pays more? Use your answers to (a) and choose the correct sentence.', opts, 'Compare the hourly wages from (a): ' + Dp(sh.w[b]) + '/h is more than ' + Dp(sh.w[o]) + '/h, so the <b>' + sh.j[b] + '</b> pays more.', ['Compare the hourly wages, not the shift pay.'], 'better job');
          } },
          { id: '12c', level: 'PRG', make: function (r, sh) { var b = sh.w[0] > sh.w[1] ? 0 : 1, d = q(Math.abs(sh.w[0] - sh.w[1])), ans = q(d * sh.W); return num('How much more would Kayla earn at the better-paying job in ' + an(sh.W) + ' ' + sh.W + '-hour week?', ans, { money: true, bad: [[sh.w[b] * sh.W, 'u1l5-not-diff', 'That’s her total pay at the ' + sh.j[b] + '. The question asks how much <b>more</b> — find the difference.'], [d, 'u1l5-not-diff', 'That’s how much more per <b>hour</b>. Multiply by the ' + sh.W + ' hours in the week.'], [Math.abs(sh.pay[0] - sh.pay[1]), 'u1l5-total-diff', 'Use the hourly wages, not the shift pay.'], [Math.abs(sh.pay[0] - sh.pay[1]) * sh.W, 'u1l5-total-diff', 'Use the difference in the <b>hourly</b> wages, not the shift pay.']], sol: t(sh.w[b].toFixed(2) + '-' + sh.w[1 - b].toFixed(2) + '=' + d.toFixed(2)) + ' more per hour<br>' + t(d.toFixed(2) + '\\times ' + sh.W + '=' + ans.toFixed(2)) + '<br>She would earn ' + t(D(ans)) + ' more.', hints: ['How much more does the better job pay for one hour?', 'Multiply by the hours in the week.'], text: 'more per week' }); } }] },
      { num: '13', stem: 'Convert each rate.', parts: [
        { id: '13a', level: 'PRG', make: function (r) { var s = r.pick([1.8, 2.4, 3, 3.6, 4.2, 5.4, 6, 6.6, 7.2, 7.8, 8.4, 9.6]); return kmhToMmin(N(s) + ' km/h to m/min', s); } },
        { id: '13b', level: 'PRG', make: function (r) { var v = r.pick([25, 50, 75, 100, 125, 150, 200, 250, 300, 350]); return mminToKmh(v + ' m/min to km/h', v); } },
        { id: '13c', level: 'EMG', make: function (r) { var w = r.pick([15, 15.6, 16.2, 16.8, 17.4, 18, 19.2, 19.8, 20.4, 21, 21.6, 22.2, 22.8, 24]); return wagePerMin(Dp(w) + '/h to dollars per minute', w); } }] },
      { num: '14', stem: function (sh) { return 'Ella says her car uses ' + N(sh.k) + ' L of gas per kilometre.'; },
        shared: function (r) { return { k: q(r.int(11, 25) * 0.005) }; },
        parts: [
          { id: '14a', level: 'EMG', make: function (r, sh) { var ans = q(sh.k * 100); return num('Write her car’s fuel consumption in L/100 km.', ans, { after: 'L/100 km', bad: [[sh.k / 100, 'u1l5-no100', 'In 100 km the car uses 100 times as much gas as in 1 km, so <b>multiply</b> by ' + t('100') + '.'], [sh.k * 10, 'u1l5-wrong-mult', 'Multiply by ' + t('100') + ' (100 km), not 10.'], [sh.k * 1000, 'u1l5-wrong-mult', 'Multiply by ' + t('100') + ' (100 km), not 1000.']], sol: 'In 100 km it uses 100 times as much:<br>' + t(N(sh.k) + '\\times 100=' + N(ans)) + '<br>Her car uses ' + t(N(ans) + u('L/100 km')) + '.', hints: ['How much gas for 100 km if it uses ' + N(sh.k) + ' L for 1 km?'], text: 'per km to per 100' }); } },
          { id: '14b', level: 'EMG', make: function (r, sh) {
            return P.mc(r, 'Why is fuel consumption given per 100 km instead of per 1 km?', [
              { html: 'The amount for 1 km is a tiny decimal that is hard to read and compare. Per 100 km gives friendlier numbers like ' + N(q(sh.k * 100)) + '.', right: true },
              { html: 'Cars can only measure gas after driving 100 km.', why: 'The gas used in 1 km can be worked out — it’s just a tiny decimal like ' + N(sh.k) + ' L.', code: 'measure' },
              { html: 'Using 100 km makes the car use less gas.', why: 'The unit doesn’t change how much gas the car burns — it only changes how the number looks.', code: 'less' },
              { html: 'Gas is sold in 100 L amounts.', why: 'Gas is sold by the litre. The 100 is about the <b>distance</b>.', code: 'sold' }],
              'The amount for 1 km is a tiny decimal (' + N(sh.k) + ' L) that is hard to read and compare. Per 100 km gives a friendlier number (' + N(q(sh.k * 100)) + ' L).', ['Look at the number in (a) and the number Ella gave. Which is easier to read?'], 'why per 100');
          } }] },
      { num: '15', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '15', level: 'EMG', make: function (r) {
          var v = find(function () { var w = r.int(15, 22), h1 = r.int(6, 10), h2 = r.int(11, 20); return { w: w, h1: h1, h2: h2, pay: w * h1 }; }, function (v) { var vals = [v.w * v.h2, v.pay + v.h2, v.pay * v.h2, rd(v.h1 / v.pay * v.h2, 2)]; return v.h2 !== v.h1 && vals.every(function (x, i) { return vals.indexOf(x) === i; }); }, { w: 19, h1: 9, h2: 14, pay: 171 });
          var right = v.w * v.h2, wa = rd(v.h1 / v.pay * v.h2, 2), add = v.pay + v.h2, mul = v.pay * v.h2;
          return P.mc(r, 'Ana earns ' + Dg(v.pay) + ' for ' + v.h1 + ' h of work. At the same rate, how much will she earn for ' + v.h2 + ' h?', [
            { html: Dp(right), right: true },
            { html: Dp(wa), why: 'That divides the wrong way (' + t(v.h1 + '\\div ' + v.pay) + '). Her wage is dollars ÷ hours.', code: 'u1l5-wrong-way' },
            { html: Dp(add), why: 'Adding the hours to the dollars doesn’t make sense. Find her hourly wage first.', code: 'u1l5-added' },
            { html: Dp(mul), why: Dp(v.pay) + ' is for ' + v.h1 + ' h, not for 1 h. Find the unit rate first.', code: 'u1l5-wrong-mult' }],
            'Unit rate: ' + t(v.pay + '\\div ' + v.h1 + '=' + v.w) + ', so ' + t(D(v.w) + u('/h')) + '<br>' + t(v.w + '\\times ' + v.h2 + '=' + right) + '<br>She will earn ' + t(D(right)) + '.', ['Find her hourly wage first.'], 'MC wage');
        } }] },
      { num: '16', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '16', level: 'EMG', make: function (r) {
          var s = r.pick([3.6, 5.4, 6, 6.6, 7.2, 7.8, 8.4, 9, 9.6, 10.2, 12]), right = q(s * 1000 / 60);
          return P.mc(r, 'A speed of ' + N(s) + ' km/h is the same as', [
            { html: N(q(s / 60)) + ' m/min', why: 'That changes per hour to per minute but forgets to change km to m (' + t('\\times 1000') + ').', code: 'u1l5-half-convert' },
            { html: N(right) + ' m/min', right: true },
            { html: N(q(s * 60)) + ' m/min', why: 'Per minute is <b>less</b> than per hour, so divide by 60 — and change km to m first.', code: 'u1l5-no-convert' },
            { html: N(s * 1000) + ' m/min', why: 'That changes km to m but forgets to divide by 60 to get per minute.', code: 'u1l5-half-convert' }],
            t(N(s) + '\\times 1000=' + N(s * 1000)) + ' m in 60 min<br>' + t(N(s * 1000) + '\\div 60=' + N(right)) + '<br>' + t(N(s) + u('km/h') + '=' + N(right) + u('m/min')), ['Change km to m (× 1000), then per hour to per minute (÷ 60).'], 'MC speed');
        } }] },
      { num: '17', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '17', level: 'BEG', make: function (r) {
          var v = find(function () { var s = r.pick([15, 15, 20]); return { s: s, b: s === 15 ? r.int(15, 30) : r.int(20, 38) }; }, function (v) { return !(v.s === 15 && v.b === 18) && !(v.s === 20 && v.b === 37); }, { s: 15, b: 21 });
          var p = heartPart(r, 'A nurse counts a patient’s pulse and gets ' + v.b + ' beats in ' + v.s + ' s. The patient’s heart rate, in beats per minute, is ________.', v.s, v.b);
          p.input.nr = true; p.input.after = null; return p;
        } }] },
      { num: '18', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '18', level: 'EMG', make: function (r) {
          var v = find(function () { return { rate: q(r.int(50, 99) / 10), km: r.int(15, 60) * 10, any: r.chance(0.2) }; }, function (v) { var x = q(v.rate * v.km / 100); return x < 100 && v.rate !== 7.4 && (v.any || !same(rd(x, 1), x)); }, { rate: 6.8, km: 350 });
          var rate = q(v.rate), p = fuelNeedPart('A car uses ' + N(rate) + ' L/100 km. The amount of gas it needs for ' + an(v.km) + ' ' + v.km + ' km trip, to the nearest tenth of a litre, is ________ L.', rate, v.km, { dp: 1, who: 'It needs' });
          p.input.nr = true; p.input.after = null; return p;
        } }] }
    ],
    extra: [
      { num: '1', section: 'A. Skills', stem: '', parts: [
        { id: 'e1', level: 'LIM', make: function (r) { return rateRatioPart(r, 4); } }] },
      { num: '2', stem: 'Find each unit rate. The unit is written beside the box.', parts: [
        { id: 'e2a', level: 'BEG', make: function (r) { var v = find(function () { return [r.int(3, 6), r.int(11, 20) * 5]; }, function (v) { return !(v[0] === 3 && v[1] === 18); }, [5, 65]); return unitRatePart(v[1] * v[0] + ' km in ' + v[0] + ' h', v[1] * v[0], 'km', v[0], 'h', { topWord: 'kilometres', botWord: 'hour', one: 'hour' }); } },
        { id: 'e2b', level: 'BEG', make: function (r) { var v = [r.int(4, 8), r.int(15, 22)]; return unitRatePart(Dg(v[0] * v[1]) + ' for ' + v[0] + ' h of work', v[0] * v[1], '$', v[0], 'h', { topWord: 'dollars', botWord: 'hour', one: 'hour' }); } },
        { id: 'e2c', level: 'BEG', make: function (r) { var v = find(function () { return [r.pick([3, 4, 5, 6, 8]), r.int(40, 75)]; }, function (v) { return !(v[0] === 6 && v[1] === 65) && !(v[0] === 7 && v[1] === 72); }, [4, 66]); return unitRatePart(v[0] * v[1] + ' words in ' + v[0] + ' min', v[0] * v[1], 'words', v[0], 'min', { topWord: 'words', botWord: 'minute', one: 'minute' }); } },
        { id: 'e2d', level: 'EMG', make: function (r) { var v = find(function () { return [r.pick([1.5, 2.5, 0.5]), r.pick([2.4, 3.2, 3.6, 4.4, 4.8, 5.6, 6.4, 7.2])]; }, function (v) { return decs(q(v[0] * v[1])) <= 2 && !(v[0] === 1.5 && v[1] === 16); }, [2.5, 3.6]); return unitRatePart(N(q(v[0] * v[1])) + ' L in ' + v[0] + ' min', q(v[0] * v[1]), 'L', v[0], 'min', { topWord: 'litres', botWord: 'minute', one: 'minute' }); } }] },
      { num: '3', stem: 'Find each heart rate in beats per minute.', parts: [
        { id: 'e3a', level: 'BEG', make: function (r) { var b = r.int(14, 28); if (b === 18) b = 16; return heartPart(r, b + ' beats in 15 s', 15, b); } },
        { id: 'e3b', level: 'BEG', make: function (r) { var b = r.int(20, 40); if (b === 37) b = 30; return heartPart(r, b + ' beats in 20 s', 20, b); } }] },
      { num: '4', stem: 'Convert each rate.', parts: [
        { id: 'e4a', level: 'PRG', make: function (r) { var s = r.pick([2.4, 3, 3.6, 5.4, 6, 7.2, 8.4, 9.6, 10.8]); return kmhToMmin(N(s) + ' km/h to m/min', s); } },
        { id: 'e4b', level: 'PRG', make: function (r) { var v = r.pick([25, 50, 75, 100, 150, 200, 250]); return mminToKmh(v + ' m/min to km/h', v); } }] },
      { num: '5', section: 'B. Applying', stem: function (sh) { return 'Noor earns ' + Dp(sh.w) + '/h at a grocery store.'; },
        shared: function (r) { return find(function () { return { w: r.int(60, 84) * 25 / 100, h: r.int(4, 8), k: r.int(20, 40) }; }, function (s) { return s.w !== 16.5; }, { w: 17.75, h: 6, k: 40 }); },
        parts: [
          { id: 'e5a', level: 'BEG', make: function (r, sh) { var ans = q(sh.w * sh.h); return num('How much does she earn in ' + an(sh.h) + ' ' + sh.h + '-hour shift?', ans, { money: true, bad: [[sh.w / sh.h, 'u1l5-divided', 'She earns ' + Dp(sh.w) + ' for <b>each</b> hour, so multiply by the hours.'], [sh.w + sh.h, 'u1l5-added', 'Multiply the hourly wage by the hours.']], sol: t(sh.w.toFixed(2) + '\\times ' + sh.h + '=' + ans.toFixed(2)) + '<br>She earns ' + t(D(ans)) + '.', hints: ['Amount = hourly wage × hours.'], text: 'shift pay' }); } },
          { id: 'e5b', level: 'EMG', make: function (r, sh) { var T = q(sh.w * sh.k); return num('How many hours must she work to earn ' + Dp(T) + '?', sh.k, { after: 'h', bad: [[T * sh.w, 'u1l5-multiplied', 'This asks for hours: divide the money by the hourly wage.'], [sh.w / T, 'u1l5-wrong-way', 'Divide the money by the hourly wage: ' + t(T.toFixed(2) + '\\div ' + sh.w.toFixed(2)) + '.']], sol: t(T.toFixed(2) + '\\div ' + sh.w.toFixed(2) + '=' + sh.k) + '<br>She must work ' + t(sh.k + u('h')) + '.', hints: ['Number of hours = money ÷ hourly wage.'], text: 'hours for amount' }); } }] },
      { num: '6', stem: '', parts: [
        { id: 'e6', level: 'EMG', make: function (r) {
          var v = find(function () { return { rr: r.int(12, 30), m: r.pick([3, 4, 5, 6]), k: r.int(15, 40) }; }, function (v) { return v.k !== v.m; }, { rr: 21, m: 4, k: 25 });
          var c = v.rr * v.m, W = v.rr * v.k;
          return num('The school printer prints ' + c + ' pages in ' + v.m + ' min. How long will it take to print ' + W + ' pages?', v.k, { after: 'min', bad: [[W / c, 'u1l5-groups', 'That’s the number of ' + v.m + '-minute groups. How many <b>minutes</b> is that?', 'form'], [W * v.rr, 'u1l5-multiplied', 'This asks for minutes: divide the pages by the pages per minute.'], [W / v.m, 'u1l5-wrong-mult', 'Find the unit rate first: ' + t(c + '\\div ' + v.m) + ' pages/min. Then divide the pages by it.']], sol: 'Unit rate: ' + t(c + '\\div ' + v.m + '=' + v.rr) + ' pages/min<br>' + t(W + '\\div ' + v.rr + '=' + v.k) + '<br>It will take ' + t(v.k + u('min')) + '.', hints: ['Find the pages per minute.', 'Then divide the pages to print by it.'], text: 'print time' });
        } }] },
      { num: '7', stem: '', parts: [
        { id: 'e7', level: 'PRG', make: function (r) {
          var v = find(function () { var N0 = r.pick([100, 150, 200, 250, 300, 400]), W = r.pick([0.5, 0.6, 0.8, 1.2, 1.5, 2]), k = r.pick([1.5, 2.5, 2.8, 3, 3.5, 4, 4.5, 6]); return { N0: N0, W: W, B: q(W * k), k: k }; }, function (v) { return Number.isInteger(q(v.N0 * v.k)) && v.B <= 8 && decs(v.B) <= 1 && !(v.N0 === 250 && v.W === 1.5 && v.B === 4.2 && false); }, { N0: 250, W: 1.5, B: 4.2, k: 2.8 });
          var ans = q(v.N0 * v.k);
          return num('A hardware store weighs screws instead of counting them. ' + v.N0 + ' screws weigh ' + N(v.W) + ' kg. A customer’s bag of the same screws weighs ' + N(v.B) + ' kg. How many screws are in the bag?', ans, { after: 'screws',
            bad: [[v.N0 * v.B, 'u1l5-wrong-mult', v.N0 + ' screws weigh ' + N(v.W) + ' kg, not 1 kg. Find the screws per kilogram first.'], [v.N0 / v.W, 'u1l5-per-one', 'That’s the screws in <b>1 kg</b>. Multiply by the ' + N(v.B) + ' kg in the bag.'], [v.B / v.W, 'u1l5-groups', 'That’s how many ' + N(v.W) + ' kg groups are in the bag. Each group has ' + v.N0 + ' screws.', 'form'], [v.N0 * v.W / v.B, 'u1l5-wrong-way', 'Put the same units in the same places: screws on top, kg on the bottom, in both fractions.']],
            sol: t('\\dfrac{' + v.N0 + '\\text{ screws}}{' + N(v.W) + '\\text{ kg}}=\\dfrac{x\\text{ screws}}{' + N(v.B) + '\\text{ kg}}') + '<br>' + t(N(v.W) + 'x=' + v.N0 + '\\times ' + N(v.B) + '=' + N(q(v.N0 * v.B))) + '<br>' + t('x=' + N(q(v.N0 * v.B)) + '\\div ' + N(v.W) + '=' + N(ans)) + '<br>There are ' + t(N(ans)) + ' screws in the bag.',
            hints: ['Find the screws per kilogram, or set up a proportion.', 'Keep screws on top and kg on the bottom.'], text: 'screws' });
        } }] },
      { num: '8', stem: function (sh) { return 'Ravi’s car used ' + N(sh.L) + ' L of gas to drive ' + sh.km + ' km.'; },
        shared: function (r) { return find(function () { var rate = r.int(12, 20) / 2, km = r.int(30, 70) * 10; return { rate: rate, km: km, L: q(rate * km / 100), D: r.int(20, 60) * 10, p: r.int(125, 159) / 100 }; }, function (s) { return s.rate !== 10 && decs(s.L) <= 1 && s.D !== s.km && decs(q(s.rate * s.D / 100)) <= 2 && !(s.L === 55.2 && s.km === 480); }, { rate: 7, km: 630, L: 44.1, D: 450, p: 1.36 }); },
        parts: [
          { id: 'e8a', level: 'EMG', make: function (r, sh) { return fuelConsPart('What is its fuel consumption in L/100 km?', sh.L, sh.km, { who: 'Ravi’s car uses' }); } },
          { id: 'e8b', level: 'PRG', make: function (r, sh) { var need = q(sh.rate * sh.D / 100), ex = need * sh.p, ans = rd(ex, 2); return num('He plans ' + an(sh.D) + ' ' + sh.D + ' km trip. Gas costs ' + Dp(sh.p) + '/L. How much will the gas cost?', ans, { money: true, exact: ex, bad: [[sh.L * sh.p, 'u1l5-wrong-mult', N(sh.L) + ' L was for the ' + sh.km + ' km drive. Find the litres for the ' + sh.D + ' km trip first.'], [need, 'u1l5-litres-only', 'That’s the litres for the trip. Multiply by the price per litre.'], [sh.rate * sh.D * sh.p, 'u1l5-no100', 'The rate is per <b>100 km</b>: divide by ' + t('100') + ' when you find the litres.']], sol: 'From (a): ' + N(sh.rate) + ' L/100 km<br>' + t(N(sh.rate) + '\\times ' + sh.D + '\\div 100=' + N(need)) + ' L<br>' + t(N(need) + '\\times ' + sh.p.toFixed(2) + '=' + N(q(ex))) + '<br>The gas will cost ' + t(D(ans)) + '.', hints: ['First find the litres for the trip: rate × km ÷ 100.', 'Then multiply by the price per litre.'], text: 'trip gas cost' }); } }] },
      { num: '9', stem: function (sh) { return 'Emma types ' + sh.w[0] + ' words in ' + N(sh.m[0]) + ' min. Jake types ' + sh.w[1] + ' words in ' + N(sh.m[1]) + ' min.'; },
        shared: function (r) { var trap = r.chance(0.75); return find(function () { var a = r.int(45, 75), d = r.pick([-4, -3, -2, 2, 3, 4]), m = r.chance(0.5) ? [r.int(4, 8), r.pick([5.5, 6.5, 7.5, 8.5])] : [r.pick([5.5, 6.5, 7.5]), r.int(4, 8)]; var s = [a, a + d]; return { s: s, m: m, w: [q(s[0] * m[0]), q(s[1] * m[1])] }; }, function (v) { return Number.isInteger(v.w[0]) && Number.isInteger(v.w[1]) && v.w[0] !== v.w[1] && v.w[0] !== 504 && v.w[1] !== 620 && ((v.w[0] > v.w[1]) !== (v.s[0] > v.s[1])) === trap; }, { s: [56, 54], m: [6, 7.5], w: [336, 405] }); },
        parts: [
          { id: 'e9a', level: 'EMG', make: function (r, sh) {
            var ck = [0, 1].map(function (i) { return numChk(sh.s[i], { bad: [[sh.m[i] / sh.w[i], 'u1l5-wrong-way', wrongWay('words', 'minute')], [sh.s[1 - i], 'u1l5-other-box', 'That’s the other person’s speed. Check which box is which.']] }); });
            var p = P.fields('Find each typing speed.', [{ label: 'Emma:', after: 'words/min', name: 'Emma' }, { label: 'Jake:', after: 'words/min', name: 'Jake' }], ck, [String(sh.s[0]), String(sh.s[1])],
              'Emma ' + t(sh.s[0] + u('words/min')) + ', Jake ' + t(sh.s[1] + u('words/min')), 'Emma: ' + t(sh.w[0] + '\\div ' + N(sh.m[0]) + '=' + sh.s[0]) + ' words/min<br>Jake: ' + t(sh.w[1] + '\\div ' + N(sh.m[1]) + '=' + sh.s[1]) + ' words/min', ['Words per minute = words ÷ minutes.'], 'typing speeds');
            p.bad = [[String(sh.s[1]), String(sh.s[0])]];
            return p;
          } },
          { id: 'e9b', level: 'EMG', make: function (r, sh) {
            var f = sh.s[0] > sh.s[1] ? 0 : 1, nm = ['Emma', 'Jake'], d = Math.abs(sh.s[0] - sh.s[1]), mw = sh.w[0] > sh.w[1] ? 0 : 1, dw = Math.abs(sh.w[0] - sh.w[1]);
            return P.mc(r, 'Who types faster, and by how much?', [
              { html: nm[f] + ', by ' + d + ' words/min', right: true },
              { html: nm[1 - f] + ', by ' + d + ' words/min', why: 'Compare the speeds from (a): the higher words/min is faster.', code: 'slower' },
              { html: nm[mw] + ', by ' + dw + ' words', why: 'They typed for different times, so total words can’t be compared. Compare words per minute.', code: 'u1l5-total-diff' },
              { html: nm[f] + ', by ' + (d * 2) + ' words/min', why: 'Subtract the two speeds from (a).', code: 'diff' }],
              nm[0] + ': ' + sh.s[0] + ' words/min. ' + nm[1] + ': ' + sh.s[1] + ' words/min.<br>' + nm[f] + ' types faster, by ' + t(sh.s[f] + '-' + sh.s[1 - f] + '=' + d) + ' words/min.', ['Use the unit rates from (a).'], 'who faster');
          } }] },
      { num: '10', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: 'e10', level: 'EMG', make: function (r) {
          var v = find(function () { return { rate: r.int(5, 12), km: r.int(6, 30) * 25 }; }, function (v) { var a = v.rate / v.km * 100, c = v.km / v.rate; return decs(q(v.rate * v.km / 100)) <= 2 && decs(q(a)) <= 2 && decs(q(c)) <= 2 && !same(a, c); }, { rate: 8, km: 250 });
          var right = q(v.rate * v.km / 100);
          return P.mc(r, 'A car uses ' + v.rate + ' L/100 km. How much gas does it need to drive ' + v.km + ' km?', [
            { html: N(q(v.rate / v.km * 100)) + ' L', why: 'That divides the rate by the distance. Fuel needed = rate × km ÷ 100.', code: 'u1l5-wrong-way' },
            { html: N(right) + ' L', right: true },
            { html: N(q(v.km / v.rate)) + ' L', why: 'That divides the distance by the rate. Fuel needed = rate × km ÷ 100.', code: 'u1l5-wrong-way' },
            { html: N(v.rate * v.km) + ' L', why: 'The rate is per <b>100</b> km, so divide by 100.', code: 'u1l5-no100' }],
            t(v.rate + '\\times ' + v.km + '\\div 100=' + N(right)) + ' L', ['Fuel needed = fuel consumption × km ÷ 100.'], 'MC fuel');
        } }] },
      { num: '11', stem: '<i>(Numerical Response)</i>', parts: [
        { id: 'e11', level: 'EMG', make: function (r) {
          var v = find(function () { return { rate: r.pick([1.5, 2.5, 3.5, 4.5, 5.5, 6.5]), h: r.int(8, 30) }; }, function (v) { return String(q(v.rate * v.h)).length <= 5; }, { rate: 4.5, h: 26 });
          var Lw = q(v.rate * v.h), p = num('A drip line waters a garden at ' + N(v.rate) + ' L/h. The number of hours it takes to deliver ' + N(Lw) + ' L of water is ________.', v.h, { bad: [[Lw * v.rate, 'u1l5-multiplied', 'This asks for hours: divide the litres by the litres per hour.'], [v.rate / Lw, 'u1l5-wrong-way', 'Divide the litres by the litres per hour: ' + t(N(Lw) + '\\div ' + N(v.rate)) + '.']], sol: t(N(Lw) + '\\div ' + N(v.rate) + '=' + v.h) + '<br>It takes ' + t(v.h + u('h')) + '.', hints: ['Number of hours = litres ÷ litres per hour.'], text: 'NR drip' });
          p.input.nr = true; return p;
        } }] },
      { num: '12', section: 'C. Stretch', stem: '', parts: [
        { id: 'e12', level: 'ADV', make: function (r) {
          var s = r.pick([72, 90, 108, 126, 144, 162, 180]), ans = q(s / 3.6), ctx = r.pick([['A slapshot sends a hockey puck at', 'The puck travels'], ['A fastball leaves a pitcher’s hand at', 'The ball travels'], ['A badminton smash sends the birdie at', 'The birdie travels']]);
          return num(ctx[0] + ' ' + s + ' km/h. How many metres per second is that? (Hint: ' + t('1\\text{ h}=60\\times 60=3600\\text{ s}') + '.)', ans, { after: 'm/s',
            bad: [[s * 1000 / 60, 'u1l5-half-convert', 'That’s metres per <b>minute</b>. Divide by 60 again to get per second (or divide by 3600 in one step).'], [s * 1000, 'u1l5-half-convert', 'That’s metres per hour. An hour has 3600 s, so divide by ' + t('3600') + '.'], [s / 3600, 'u1l5-half-convert', 'That’s km per second. Change km to m too: ' + t('\\times 1000') + '.'], [s / 60, 'u1l5-no-convert', 'Change km to m (' + t('\\times 1000') + ') and per hour to per second (' + t('\\div 3600') + ').']],
            sol: t(s + '\\times 1000=' + N(s * 1000)) + ' m in 3600 s<br>' + t(N(s * 1000) + '\\div 3600=' + N(ans)) + '<br>' + ctx[1] + ' ' + t(N(ans) + u('m/s')) + '.', hints: ['Change km to m: × 1000.', 'Change per hour to per second: ÷ 3600.'], text: 'km/h to m/s' });
        } }] },
      { num: '13', stem: '', parts: [
        { id: 'e13', level: 'MAS', make: function (r) {
          var v = find(function () { return { D: r.int(6, 20) * 100, r1: r.int(11, 16) / 2, r2: r.int(20, 28) / 2, p: r.int(129, 159) / 100 }; }, function (v) { return v.r2 - v.r1 >= 3; }, { D: 1200, r1: 6.5, r2: 11.5, p: 1.45 });
          var L1 = q(v.r1 * v.D / 100), L2 = q(v.r2 * v.D / 100), c1 = rd(L1 * v.p, 2), c2 = rd(L2 * v.p, 2), ex = (L2 - L1) * v.p, ans = q(c2 - c1);
          var alt = same(rd(ex, 2), ans) ? [] : [rd(ex, 2)];
          return num('The Nguyen family is planning ' + an(v.D) + ' ' + N(v.D) + ' km summer road trip. Their car uses ' + N(v.r1) + ' L/100 km and their truck uses ' + N(v.r2) + ' L/100 km. Gas costs ' + Dp(v.p) + '/L. How much more would the gas cost if they took the truck?', ans, { money: true, exact: ex, alt: alt,
            bad: [[c2, 'u1l5-one-cost', 'That’s the cost with the truck. Find the cost with the car too, then subtract.'], [c1, 'u1l5-one-cost', 'That’s the cost with the car. Find the cost with the truck too, then subtract.'], [L2 - L1, 'u1l5-litres-only', 'That’s how many more <b>litres</b>. Multiply by the price per litre.'], [(v.r2 - v.r1) * v.D * v.p, 'u1l5-no100', 'The rates are per <b>100 km</b>: divide by ' + t('100') + ' when you find the litres.'], [(v.r2 - v.r1) * v.p, 'u1l5-litres-only', 'That’s the extra cost for 100 km. The trip is ' + N(v.D) + ' km.'], [c1 + c2, 'u1l5-added', 'Subtract the two costs to find how much <b>more</b>.']],
            sol: 'Car: ' + t(N(v.r1) + '\\times ' + N(v.D) + '\\div 100=' + N(L1)) + ' L; ' + t(N(L1) + '\\times ' + v.p.toFixed(2) + '=' + D(c1)) + '<br>Truck: ' + t(N(v.r2) + '\\times ' + N(v.D) + '\\div 100=' + N(L2)) + ' L; ' + t(N(L2) + '\\times ' + v.p.toFixed(2) + '=' + D(c2)) + '<br>' + t(c2.toFixed(2) + '-' + c1.toFixed(2) + '=' + ans.toFixed(2)) + '<br>The truck would cost ' + t(D(ans)) + ' more.',
            hints: ['Find the litres and the cost for each vehicle.', 'Then subtract the two costs.'], text: 'car vs truck' });
        } }] },
      { num: '14', stem: function (sh) { return 'Kai runs ' + N(sh.K) + ' km in ' + sh.M + ' min. Zoe runs at ' + sh.Z.toFixed(1) + ' km/h.'; },
        shared: function (r) { return find(function () { var K = r.pick([5, 8, 10, 12, 15]), M = r.int(Math.ceil(K * 60 / 15), Math.floor(K * 60 / 9)), sp = K / M * 60, Z = rd(sp + (r.chance(0.5) ? 1 : -1) * r.int(3, 10) / 10, 1); return { K: K, M: M, sp: sp, k: rd(sp, 1), Z: Z }; }, function (s) { return Math.abs(s.k - s.Z) >= 0.25 && !same(s.sp, s.k) && s.Z > 6; }, { K: 10, M: 52, sp: 600 / 52, k: 11.5, Z: 11.2 }); },
        parts: [
          { id: 'e14a', level: 'MAS', make: function (r, sh) { return num('What is Kai’s speed in km/h, to the nearest tenth?', sh.k, { dp: 1, exact: sh.sp, after: 'km/h',
            bad: [[sh.K / sh.M, 'u1l5-per-min', 'That’s km per <b>minute</b>. There are 60 min in an hour, so multiply by ' + t('60') + '.'], [sh.M / sh.K, 'u1l5-wrong-way', 'Divide the <b>kilometres</b> by the minutes (km per minute), then change to per hour.'], [sh.K / sh.M * 100, 'u1l5-wrong-mult', 'An hour is 60 min, so multiply the km per minute by ' + t('60') + ', not 100.']],
            sol: t(N(sh.K) + '\\div ' + sh.M + '=' + nS(rd(sh.K / sh.M, 4)) + '\\ldots') + ' km/min<br>' + t(nS(rd(sh.K / sh.M, 4)) + '\\ldots\\times 60=' + nS(rd(sh.sp, 3)) + '\\ldots') + '<br>Kai runs about ' + t(sh.k.toFixed(1) + u('km/h')) + '.', hints: ['Find Kai’s km per minute first.', 'An hour has 60 minutes: multiply by 60. Round at the end.'], text: 'Kai speed' }); } },
          { id: 'e14b', level: 'PRG', make: function (r, sh) {
            var kai = sh.k > sh.Z;
            return P.mc(r, 'Who is faster? Use your answer to (a).', [
              { html: 'Kai, because his speed in km/h is more than ' + sh.Z.toFixed(1) + ' km/h.', right: kai, why: kai ? null : 'Check your answer to (a): is it more or less than ' + sh.Z.toFixed(1) + ' km/h?', code: 'kai' },
              { html: 'Zoe, because her ' + sh.Z.toFixed(1) + ' km/h is more than Kai’s speed in km/h.', right: !kai, why: !kai ? null : 'Check your answer to (a): is it more or less than ' + sh.Z.toFixed(1) + ' km/h?', code: 'zoe' },
              { html: 'Kai, because ' + sh.M + ' is bigger than ' + sh.Z.toFixed(1) + '.', why: sh.M + ' is minutes and ' + sh.Z.toFixed(1) + ' is km/h. Change Kai’s run to km/h before you compare.', code: 'units' }],
              'Kai: about ' + sh.k.toFixed(1) + ' km/h (from (a)). Zoe: ' + sh.Z.toFixed(1) + ' km/h.<br>' + (kai ? '<b>Kai</b> is faster.' : '<b>Zoe</b> is faster.'), ['Compare the two speeds in the same units (km/h).'], 'who faster', true);
          } }] }
    ]
  });
})(window);
