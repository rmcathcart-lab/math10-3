/* Math 10-3 · Unit 4 · Lesson 5 — Converting Mass Between SI and Imperial (M2; SI-only parts M1)
 * Assignment 5 (u4_l05.tex, Questions 1–17) and the Lesson 5 Extra Practice (u4_ep05.tex, A 1–5, B 6–12, C 13–14).
 * Every part is a generator: the same situation and difficulty as the booklet item, new numbers around the booklet's
 * (the lesson's worked-example numbers are left out). Calculator allowed. Conversion facts exactly as the booklet:
 * 1 lb ≈ 0.454 kg (454 g), 1 kg ≈ 2.2 lb, 1 oz ≈ 28.35 g, 1 ton ≈ 0.907 t, 1 lb = 16 oz, 1 ton = 2000 lb.
 * Answers: numbers to the place the booklet asks for (a unit typed after the number is fine; too many decimals gets a
 * nudge; rounding the wrong way is wrong with a hint). Where the other fact gives a different rounded answer
 * (25 ÷ 2.2 instead of 25 × 0.454) that answer is accepted too. Money to the cent ("$12.49", "12.49", "12.490").
 * Pounds-and-ounces answers are two boxes (lb, oz). Recognised mistakes get their own hint: the wrong fact (× 0.454
 * for kg → lb), dividing instead of multiplying, the 30 g estimate for an exact answer, ounces read as tenths of a
 * pound (5 lb 8 oz = 5.8 lb), the decimal part of the pounds written as ounces, converting a price the same way as a
 * mass, rounding a count the wrong way, forgetting to subtract the driver / packing, tons and tonnes mixed up.
 * Conversions: "circle the heavier mass, show how you know" → multiple choice whose options pair a mass with a reason
 * (one right; a right mass with a wrong reason is wrong); "estimate in your head, show your thinking" → multiple
 * choice of lines of thinking; "find and fix the mistake" → a multiple choice for the mistake + a number for the fix;
 * the price tables → the table in the prompt and one labelled box per blank cell; "which store / is it over the
 * limit / can it cross" → a number for the evidence + a multiple choice for the decision.
 *
 * Shared kit for later lessons: HW.u4mass (number formatting, a number reader/checker with rounding nudges, number
 * parts, labelled boxes, a pounds-and-ounces checker, an HTML table). u4l6.js and u4l7.js use it, so this file must
 * load BEFORE them. Levels: LIM BEG EMG PRG ADV MAS. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;

  /* ================= the Unit 4 number kit (HW.u4mass) ================= */
  var U = HW.u4mass = {};
  function q(x) { return Math.round(x * 1e9) / 1e9; }
  function rd(x, dp) { return K.roundTo(q(x), dp); }
  function trunc(x, dp) { var f = Math.pow(10, dp); return Math.floor(q(x) * f + 1e-9) / f; }
  function same(a, b) { return Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(b)); }
  function nS(x, dp) { return dp != null ? rd(x, dp).toFixed(dp) : String(q(x)); }
  function N(x, dp) { var s = nS(x, dp); return Math.abs(x) >= 10000 ? HW.fmt(s) : s; }            // TeX number
  function Np(x, dp) { var s = nS(x, dp); return Math.abs(x) >= 10000 ? HW.fmt(s, true) : s; }      // plain-text number
  function D(x) { return '\\$' + N(rd(x, 2), 2); }                                                 // TeX money
  function Dp(x) { return '$' + Np(rd(x, 2), 2); }                                                 // plain money
  function a3(x) { var r = rd(x, 3); return same(r, x) ? '=' + N(r) : '\\approx ' + N(r); }        // "= 1.362" or "≈ 3.348"
  function uT(u) { return '\\text{ ' + String(u).replace(/³/g, '}^3\\text{').replace(/²/g, '}^2\\text{') + '}'; }   // a unit after a number, in TeX
  function find(gen, test, fallback) { for (var i = 0; i < 400; i++) { var v = gen(); if (v && test(v)) return v; } return fallback; }
  function steps(a) { return a.filter(Boolean).join('<br>'); }
  function place(dp, money) { return money ? 'cent' : dp === 0 ? 'whole number' : dp === 1 ? 'tenth' : dp === 2 ? 'hundredth' : dp === 3 ? 'thousandth' : 'place asked'; }
  function frac(x) { return q(x - Math.floor(q(x))); }
  function far(x, dp, gap) { var f = Math.pow(10, dp), y = q(x * f); return Math.abs(y - Math.floor(y) - 0.5) > (gap || 0.03); } // not near a rounding tie
  var TD = 'border:1px solid #c9b79c;padding:3px 10px;text-align:center';
  function tbl(head, rows) {
    return '<table style="border-collapse:collapse;margin:4px 0">' + (head ? '<tr>' + head.map(function (h) { return '<th style="' + TD + '">' + h + '</th>'; }).join('') + '</tr>' : '') +
      rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td style="' + TD + '">' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>';
  }

  function readNum(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\\$/g, '$').replace(/\\text\{([^}]*)\}/g, '$1').replace(/\\[,;: ]|~/g, ' ').replace(/\s+/g, ' ').trim();
    s = s.replace(/^\$\s*/, '').replace(/\s*\$$/, '').trim();
    if (!s) return { code: 'empty' };
    var unit = null, m = /^(-?[\d., ]*\d\.?)\s*([a-zA-Z%°²³\/¢][\s\S]*)$/.exec(s);
    if (m) { unit = m[2]; s = m[1]; }
    if (/^-?\d+,\d{1,2}$/.test(s.trim())) return { code: 'comma' };
    var p = HW.parse.number(s); if (!p.ok) return { code: 'notnumber' };
    return { v: p.value, dec: (s.replace(/[, ]/g, '').split('.')[1] || '').length, unit: unit, len: s.replace(/\s/g, '').length };
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
    if (a.code === 'comma') return form('u4m-comma', 'Use a decimal <b>point</b>, not a comma (for example 12.5).');
    return form('notnumber', 'Type a single number (the unit is already written beside the box).');
  }
  /* o: dp (rounding place; null = exact), money, exact (unrounded value, for the rounding-direction hint), bad
   * [[value, code, hint, 'form'?]], alt (other right values), tol (|v − exact| ≤ tol is right: "about" answers),
   * count ('up' | 'down': a whole number of loads / bags), nr (numerical response: 4 characters) */
  function numChk(ans, o) {
    o = o || {};
    var dp = o.money ? 2 : o.dp, exact = o.exact != null ? o.exact : ans, pl = place(dp, o.money);
    return function (resp) {
      var a = readNum(resp); if (a.code) return slip(a);
      var v = a.v, i;
      if (o.nr && a.len > 4) return form('nr-long', 'Numerical response answers fit in 4 boxes (digits and a decimal point only).');
      if (same(v, ans)) return ok();
      for (i = 0; o.alt && i < o.alt.length; i++) if (same(v, o.alt[i])) return ok();
      if (o.tol != null && Math.abs(v - exact) <= o.tol + 1e-9 && (dp == null || a.dec <= dp)) return ok();
      if (o.count && a.dec > 0) return form('u4m-count-dec', 'You can only have a whole number here. Round ' + (o.count === 'up' ? '<b>up</b> (you need enough to do the whole job).' : '<b>down</b> (you must stay under the limit).'));
      if (dp != null && a.dec > dp && (same(rd(v, dp), ans) || (o.alt || []).some(function (x) { return same(rd(v, dp), x); }))) return form('round', 'Right — now round to the nearest ' + pl + '.');
      for (i = 0; o.bad && i < o.bad.length; i++) { var b = o.bad[i]; if (near(v, b[0], a.dec)) return b[3] === 'form' ? form(b[1], b[2]) : wrong(b[1], b[2]); }
      if (dp != null && a.dec < dp && Math.abs(v - ans) < Math.pow(10, -a.dec) - 1e-9) return form('places', o.money ? 'Give the amount to the cent (two decimal places).' : 'Round to the nearest ' + pl + ' (' + dp + ' decimal place' + (dp > 1 ? 's' : '') + ').');
      if (dp != null && !same(exact, ans) && a.dec <= dp && Math.abs(Math.abs(v - ans) - Math.pow(10, -dp)) < 1e-9 && (same(v, trunc(exact, dp)) || same(v, trunc(exact, dp) + Math.pow(10, -dp))))
        return wrong('u4m-round-dir', 'Check your rounding: look at the digit after the ' + pl + (o.money ? 's (the third decimal place)' : 's') + '. 5 or more rounds up; 4 or less rounds down.');
      return wrong('value', null);
    };
  }
  function cleanBad(bad, ans, dp, alt) {
    var seen = [];
    return (bad || []).filter(function (b) {
      if (!b || !isFinite(b[0]) || same(b[0], ans) || (dp != null && same(rd(b[0], dp), ans)) || (alt || []).some(function (x) { return same(x, b[0]) || (dp != null && same(rd(b[0], dp), x)); })) return false;
      if (seen.some(function (x) { return same(x, b[0]); })) return false; seen.push(b[0]); return true;
    });
  }
  function altList(ans, alt, dp) { var out = []; (alt || []).forEach(function (x) { var y = dp != null ? rd(x, dp) : q(x); if (!same(y, ans) && !out.some(function (z) { return same(z, y); })) out.push(y); }); return out; }
  /* a number part. o: dp, money, exact, bad, alt (unrounded or rounded), tol, count, nr, before, after, ans (TeX), sol, hints, text */
  function num(prompt, ans, o) {
    o = o || {};
    var dp = o.money ? 2 : o.dp, A = dp != null ? rd(ans, dp) : q(ans), alt = altList(A, o.alt, dp), key = dp != null ? A.toFixed(dp) : nS(A), bad = cleanBad(o.bad, A, dp, alt);
    if (o.count === 'up' || o.count === 'down') bad.push([o.count === 'up' ? A - 1 : A + 1, 'u4m-count-dir', o.count === 'up' ? 'That isn’t quite enough. When you need enough to do the <b>whole job</b>, round <b>up</b>.' : 'That would go <b>over</b> the limit. When you must stay under a limit, round <b>down</b>.']);
    if (o.tol != null) bad = bad.filter(function (b) { return Math.abs(b[0] - (o.exact != null ? o.exact : ans)) > o.tol + 1e-9; });
    var p = { prompt: prompt, input: { type: 'number', before: o.money ? '$' : o.before, after: o.after, nr: !!o.nr },
      check: numChk(A, { money: o.money, dp: o.dp, exact: o.exact != null ? o.exact : ans, bad: bad, alt: alt, tol: o.tol, count: o.count, nr: o.nr }),
      key: key, answer: t(o.ans || ((o.money ? D(A) : N(A, dp)) + (o.after ? uT(o.after) : ''))), solution: o.sol, hints: o.hints || [], text: o.text };
    p.bad = bad.filter(function (b) { return b[3] !== 'form'; }).map(function (b) { return nS(b[0]); });
    p.good = (o.money && !o.nr ? ['$' + key, key + '0'] : o.nr ? [] : o.after ? [key + ' ' + o.after] : []).concat(alt.map(function (x) { return dp != null ? x.toFixed(dp) : nS(x); }));
    return p;
  }
  /* several labelled boxes. rows: [{label, name, ans, dp, money, exact, bad, alt, tol, count, after, before}] */
  function boxes(prompt, rows, sol, hints, text) {
    var keys = [], ck = rows.map(function (rw, i) {
      var dp = rw.money ? 2 : rw.dp, A = dp != null ? rd(rw.ans, dp) : q(rw.ans), alt = altList(A, rw.alt, dp);
      var other = rows.length >= 2 ? rows.filter(function (x, j) { return j !== i; }).map(function (x) { return [x.ans, 'u4m-other-box', 'That’s the answer for another box (' + (x.name || x.label) + '). Check which box is which.']; }) : [];
      var bad = cleanBad((rw.bad || []).concat(other), A, dp, alt);
      if (rw.count) bad.push([rw.count === 'up' ? A - 1 : A + 1, 'u4m-count-dir', rw.count === 'up' ? 'Not quite enough — round <b>up</b> so you have enough.' : 'That goes over the limit — round <b>down</b>.']);
      keys.push(dp != null ? A.toFixed(dp) : nS(A)); rw._A = A; rw._dp = dp;
      return numChk(A, { money: rw.money, dp: rw.dp, exact: rw.exact != null ? rw.exact : rw.ans, bad: bad, alt: alt, tol: rw.tol, count: rw.count });
    });
    var p = P.fields(prompt, rows.map(function (rw) { return { label: rw.label, before: rw.money ? '$' : rw.before, after: rw.after, name: rw.name || String(rw.label).replace(/:$/, '') }; }), ck, keys,
      rows.map(function (rw) { return rw.label + ' ' + t((rw.money ? D(rw._A) : N(rw._A, rw._dp)) + (rw.after ? uT(rw.after) : '')); }).join(' &nbsp; '), sol, hints, text);
    if (rows.length === 2 && keys[0] !== keys[1]) p.bad = [[keys[1], keys[0]]];
    return p;
  }
  /* pounds and ounces in two boxes. o.alt: [[lb, oz]] also right; o.bad: [[lb, oz, code, hint]]; o.decLb (the decimal pounds, for the hints) */
  function lbozChk(lb, oz, o) {
    o = o || {};
    return function (resp) {
      resp = resp || [];
      var A = readNum(resp[0]), B = readNum(resp[1]);
      if (A.code === 'empty' && B.code === 'empty') return form('empty', 'Type the pounds and the ounces.');
      if (A.code) return form(A.code === 'empty' ? 'empty' : 'notnumber', '<b>lb:</b> ' + (A.code === 'empty' ? 'Type the pounds.' : 'Type a whole number of pounds.'));
      if (B.code === 'empty' && A.dec > 0) return form('u4m-oz-split', 'Split it into whole pounds and ounces: keep the whole pounds, and change the decimal part to ounces (× 16).');
      if (B.code) return form(B.code === 'empty' ? 'empty' : 'notnumber', '<b>oz:</b> ' + (B.code === 'empty' ? 'Type the ounces (0 if there are none).' : 'Type a whole number of ounces.'));
      var a = A.v, b = B.v, i;
      if ((same(a, lb) && same(b, oz)) || (o.alt || []).some(function (x) { return same(a, x[0]) && same(b, x[1]); })) return ok();
      if (A.dec > 0) return form('u4m-oz-split', '<b>lb:</b> write a whole number of pounds. The part after the decimal point goes into ounces (× 16).');
      if (B.dec > 0 && same(a, lb) && same(rd(b, 0), oz)) return form('round', '<b>oz:</b> right — now round to the nearest ounce.');
      if (o.decLb != null) { var d = frac(o.decLb), s = nS(rd(d, 2)).replace(/^0\./, ''); if (same(a, lb) && (same(b, Number(s)) || same(b, Number(s.charAt(0))))) return wrong('u4m-oz-dec', '<b>oz:</b> ' + nS(rd(d, 2)) + ' lb is not ' + b + ' oz. A pound has 16 oz, so multiply: ' + t(nS(rd(d, 2)) + '\\times 16') + '.'); }
      if (b >= 16) return wrong('u4m-oz16', '<b>oz:</b> 16 oz make 1 lb, so the ounces must be less than 16. Change 16 oz into 1 more pound.');
      for (i = 0; o.bad && i < o.bad.length; i++) { var w = o.bad[i]; if (same(a, w[0]) && same(b, w[1])) return wrong(w[2], w[3]); }
      if (same(a, lb)) return wrong('value', '<b>oz:</b> the pounds are right. Check the ounces' + (o.decLb != null ? ' (the decimal part of the pounds × 16, rounded to the nearest ounce).' : '.'));
      if (same(b, oz)) return wrong('value', '<b>lb:</b> the ounces are right. Check the pounds.');
      return wrong('value', null);
    };
  }
  function lboz(prompt, lb, oz, o) {
    o = o || {};
    return { prompt: prompt, input: { type: 'fields', fields: [{ label: '', after: 'lb', name: 'lb' }, { label: '', after: 'oz', name: 'oz' }] }, check: lbozChk(lb, oz, o),
      key: [String(lb), String(oz)], answer: t(lb + '\\text{ lb }' + oz + '\\text{ oz}'), solution: o.sol, hints: o.hints || [], text: o.text,
      bad: (o.bad || []).concat([[lb, oz + 1]]).filter(function (w) { return !(w[0] === lb && w[1] === oz) && !(o.alt || []).some(function (x) { return x[0] === w[0] && x[1] === w[1]; }); }).map(function (w) { return [String(w[0]), String(w[1])]; }) };
  }
  U.q = q; U.rd = rd; U.trunc = trunc; U.same = same; U.nS = nS; U.N = N; U.Np = Np; U.D = D; U.Dp = Dp; U.a3 = a3; U.find = find; U.steps = steps; U.frac = frac; U.far = far;
  U.tbl = tbl; U.uT = uT; U.readNum = readNum; U.numChk = numChk; U.num = num; U.boxes = boxes; U.lboz = lboz; U.lbozChk = lbozChk; U.place = place;

  /* ================= mass conversions ================= */
  var LB = 0.454, KG = 2.2, OZ = 28.35, TON = 0.907;
  /* which fact, which way: [factor, multiply?, from, to, plain-language direction] */
  var CV = {
    'lb-kg': { f: LB, mul: true, from: 'lb', to: 'kg', alt: function (x) { return x / KG; } },
    'kg-lb': { f: KG, mul: true, from: 'kg', to: 'lb', alt: function (x) { return x / LB; } },
    'oz-g': { f: OZ, mul: true, from: 'oz', to: 'g' },
    'g-oz': { f: OZ, mul: false, from: 'g', to: 'oz' },
    'ton-t': { f: TON, mul: true, from: 'tons', to: 't' },
    't-ton': { f: TON, mul: false, from: 't', to: 'tons' }
  };
  function cv(kind, x) { var c = CV[kind]; return c.mul ? x * c.f : x / c.f; }
  function cvTex(kind, x) { var c = CV[kind], v = cv(kind, x); return N(x) + (c.mul ? '\\times ' : '\\div ') + c.f + a3(v); }
  function cvBad(kind, x) {
    var B = {
      'lb-kg': [[x * KG, 'u4m-wrong-fact', 'A pound is <b>less</b> than half a kilogram, so the number of kilograms is smaller. Multiply by 0.454 (1 lb ≈ 0.454 kg).'], [x / LB, 'u4m-div-mult', 'You divided by 0.454. A pound is less than a kilogram, so the answer must be smaller: multiply by 0.454.']],
      'kg-lb': [[x * LB, 'u4m-wrong-fact', 'A kilogram is <b>more</b> than 2 pounds, so the number of pounds is bigger. Multiply by 2.2 (1 kg ≈ 2.2 lb).'], [x / KG, 'u4m-div-mult', 'You divided by 2.2. There are more pounds than kilograms, so multiply by 2.2.']],
      'oz-g': [[x / OZ, 'u4m-div-mult', 'A gram is tiny, so a mass in grams is a much <b>bigger</b> number. Multiply by 28.35.'], [x * 30, 'u4m-est30', '30 g per ounce is the quick estimate. For the answer, multiply by 28.35.'], [x * 16, 'u4m-wrong-fact', '16 is the number of ounces in a <b>pound</b>. Use 1 oz ≈ 28.35 g.']],
      'g-oz': [[x * OZ, 'u4m-div-mult', 'An ounce is much bigger than a gram, so the number of ounces is <b>smaller</b>. Divide by 28.35.'], [x / 30, 'u4m-est30', '30 g per ounce is only the quick estimate. Divide by 28.35.']],
      'ton-t': [[x / TON, 'u4m-div-mult', 'A ton is a bit <b>less</b> than a tonne, so the number of tonnes is a bit smaller. Multiply by 0.907.'], [x, 'u4m-ton-tonne', 'A ton (2000 lb) and a tonne (1000 kg) are not the same. Multiply by 0.907.']],
      't-ton': [[x * TON, 'u4m-div-mult', 'A tonne is a bit <b>more</b> than a ton, so the number of tons is a bit bigger. Divide by 0.907.'], [x, 'u4m-ton-tonne', 'A tonne (1000 kg) and a ton (2000 lb) are not the same. Divide by 0.907.']]
    };
    return B[kind];
  }
  var CVH = { 'lb-kg': '1 lb ≈ 0.454 kg: multiply by 0.454.', 'kg-lb': '1 kg ≈ 2.2 lb: multiply by 2.2.', 'oz-g': '1 oz ≈ 28.35 g: multiply by 28.35.', 'g-oz': '1 oz ≈ 28.35 g, so grams ÷ 28.35 = ounces.', 'ton-t': '1 ton ≈ 0.907 t: multiply by 0.907.', 't-ton': '1 ton ≈ 0.907 t, so tonnes ÷ 0.907 = tons.' };
  /* a convert part: x in kind[0] to kind[1], rounded to dp */
  function cvPart(prompt, kind, x, dp, o) {
    o = o || {}; var c = CV[kind], v = cv(kind, x), A = rd(v, dp);
    return num(prompt, v, { dp: dp, exact: v, after: c.to, alt: c.alt && o.alt !== false ? [c.alt(x)] : [], bad: cvBad(kind, x).concat(o.bad || []),
      sol: steps([t(N(x) + '\\text{ ' + c.from + '}\\times ' + (c.mul ? '\\dfrac{' + c.f + '\\text{ ' + c.to + '}}{1\\text{ ' + c.from + '}}' : '\\dfrac{1\\text{ ' + c.to + '}}{' + c.f + '\\text{ ' + c.from + '}}')), t(cvTex(kind, x)),
        same(A, v) ? null : 'Round to the nearest ' + place(dp) + ': ' + t(N(A, dp) + '\\text{ ' + c.to + '}'), o.check]), hints: o.hints || [CVH[kind], 'Check: should the number get bigger or smaller?'], text: o.text || kind });
  }
  /* "which is heavier?" multiple choice. X is changed to Y's unit. s: {X, Y (texts), yv (Y's number), unit (Y's unit),
   * line (TeX work for X in Y's unit), val, wline, wval, wwhy, wcode (a wrong-fact line), xn, yn (bare numbers shown)} */
  function heavier(r, s, sol) {
    var xH = s.val > s.yv, H = xH ? s.X : s.Y, L = xH ? s.Y : s.X;
    function cmp(v) { return v > s.yv ? 'more than ' + s.Y : 'less than ' + s.Y; }
    var opts = [{ html: '<b>' + H + '</b> is heavier: ' + t(s.line) + ' ' + s.unit + ', ' + cmp(s.val) + '.', right: true }];
    if (Math.abs(s.wval - s.yv) > 1e-9) opts.push({ html: '<b>' + (s.wval > s.yv ? s.X : s.Y) + '</b> is heavier: ' + t(s.wline) + ' ' + s.unit + ', ' + cmp(s.wval) + '.', why: s.wwhy, code: s.wcode });
    if (s.xn !== s.yn) { var big = s.xn > s.yn ? s.X : s.Y; opts.push({ html: '<b>' + big + '</b> is heavier: ' + Math.max(s.xn, s.yn) + ' is more than ' + Math.min(s.xn, s.yn) + '.', why: 'The units are different, so you can’t compare the bare numbers. Change one mass into the other unit first.', code: 'u4m-bare' }); }
    else opts.push({ html: 'They have the same mass: both are ' + s.xn + '.', why: 'The units are different (' + s.X + ' and ' + s.Y + '), so the same number doesn’t mean the same mass. Change one into the other unit.', code: 'u4m-bare' });
    if (s.extra) opts.push(s.extra);
    else opts.push({ html: 'They have about the same mass, so neither is heavier.', why: 'Change ' + s.X + ' to ' + s.unit + ' and compare: one is clearly heavier.', code: 'u4m-same' });
    return P.mc(r, 'Which is heavier: <b>' + s.X + '</b> or <b>' + s.Y + '</b>? Choose the answer with the right reason.', opts,
      sol || (t(s.line) + ' ' + s.unit + ', which is ' + cmp(s.val) + '.<br><b>' + H + '</b> is heavier than ' + L + '.'), ['Change ' + s.X + ' into ' + s.unit + ' using a conversion fact, then compare.'], 'heavier');
  }
  /* pair builders */
  function pKgLb(r, excl) { // m kg or k lb
    var v = find(function () { var m = r.pick([1, 2, 3, 4, 5, 6]), k = Math.round(2.2 * m) + r.pick([-2, -1, 1, 2]); return [m, k]; }, function (v) { return v[1] > 0 && Math.abs(v[1] - 2.2 * v[0]) >= 0.3 && !(excl || []).some(function (e) { return e[0] === v[0] && e[1] === v[1]; }); }, [1, 2]);
    var m = v[0], k = v[1];
    return { X: m + ' kg', Y: k + ' lb', yv: k, unit: 'lb', xn: m, yn: k, line: m + '\\text{ kg}\\approx ' + m + '\\times 2.2=' + N(q(m * 2.2)), val: m * 2.2, wline: m + '\\text{ kg}\\approx ' + m + '\\times 0.454=' + N(q(m * 0.454)), wval: m * 0.454, wcode: 'u4m-wrong-fact', wwhy: '0.454 is the lb → kg fact. To change kilograms to pounds, multiply by 2.2 (a kilogram is more than 2 pounds).' };
  }
  function pLbKg(r) { // a lb or b kg
    var v = find(function () { var a = r.pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 12]), b = q(Math.round(0.454 * a * 2) / 2 + r.pick([-0.5, 0, 0.5])); return [a, b]; }, function (v) { return v[1] > 0 && Math.abs(v[1] - 0.454 * v[0]) >= 0.06; }, [3, 1.5]);
    var a = v[0], b = v[1];
    return { X: a + ' lb', Y: N(b) + ' kg', yv: b, unit: 'kg', xn: a, yn: b, line: a + '\\text{ lb}\\approx ' + a + '\\times 0.454=' + N(q(a * 0.454)), val: a * 0.454, wline: a + '\\text{ lb}\\approx ' + a + '\\times 2.2=' + N(q(a * 2.2)), wval: a * 2.2, wcode: 'u4m-wrong-fact', wwhy: '2.2 is the kg → lb fact. A pound is less than half a kilogram: multiply by 0.454.' };
  }
  function pOzG(r, excl) { // n g or k oz  (X = k oz changed to g)
    var v = find(function () { var k = r.pick([1, 1, 2, 3, 4, 5, 10]), n = Math.round(28.35 * k / 5) * 5 + r.pick([-10, -5, 5, 10]) * (k > 3 ? 2 : 1); return [k, n]; }, function (v) { return v[1] > 0 && Math.abs(v[1] - 28.35 * v[0]) >= 1.5 && !(excl || []).some(function (e) { return e[0] === v[0] && e[1] === v[1]; }); }, [1, 30]);
    var k = v[0], n = v[1];
    var s = { X: k + ' oz', Y: n + ' g', yv: n, unit: 'g', xn: k, yn: n, line: k + '\\text{ oz}\\approx ' + k + '\\times 28.35=' + N(q(k * 28.35)), val: k * 28.35 };
    if ((30 * k > n) !== (28.35 * k > n)) { s.wline = k + '\\text{ oz}\\approx ' + k + '\\times 30=' + 30 * k; s.wval = 30 * k; s.wcode = 'u4m-est30'; s.wwhy = '30 g per ounce is only a quick estimate, and it is a little high. Here it gives the wrong answer: use 28.35 g.'; }
    else { s.wline = k + '\\text{ oz}\\approx ' + k + '\\times 16=' + 16 * k; s.wval = 16 * k; s.wcode = 'u4m-wrong-fact'; s.wwhy = '16 is the number of ounces in a pound, not grams in an ounce. Use 1 oz ≈ 28.35 g.'; }
    return s;
  }
  function pTonT(r, excl) { // n tons or m t
    var v = find(function () { var n = r.pick([2, 3, 5, 8, 10, 12, 15, 20, 25]), m = r.pick([n, n, n - 1, n - 2]); return [n, m]; }, function (v) { return v[1] > 0 && Math.abs(0.907 * v[0] - v[1]) >= 0.05 && !(excl || []).some(function (e) { return e[0] === v[0] && e[1] === v[1]; }); }, [10, 10]);
    var n = v[0], m = v[1];
    return { X: n + ' tons', Y: m + ' t', yv: m, unit: 't', xn: n, yn: m, line: n + '\\text{ tons}\\approx ' + n + '\\times 0.907=' + N(q(n * 0.907)), val: n * 0.907, wline: n + '\\text{ tons}\\approx ' + n + '\\div 0.907' + a3(n / 0.907), wval: n / 0.907, wcode: 'u4m-div-mult', wwhy: 'To change tons to tonnes, multiply by 0.907. A ton is a bit less than a tonne.',
      extra: m === n ? { html: '<b>' + n + ' tons</b> is heavier: a ton is 2000 lb and a tonne is only 1000 kg.', why: '2000 lb is about 907 kg, which is <b>less</b> than 1000 kg. A ton is a bit lighter than a tonne.', code: 'u4m-ton-tonne' } : null };
  }
  function pGLb(r) { // n g or k lb  (X = k lb changed to g)
    var v = find(function () { var k = r.pick([1, 1, 2, 3, 5]), n = Math.round(454 * k / 25) * 25 + r.pick([-50, -25, 25, 50]); return [k, n]; }, function (v) { return Math.abs(v[1] - 454 * v[0]) >= 8 && v[1] > 0; }, [1, 500]);
    var k = v[0], n = v[1];
    return { X: k + ' lb', Y: N(n) + ' g', yv: n, unit: 'g', xn: k, yn: n, line: k + '\\text{ lb}\\approx ' + k + '\\times 454=' + N(454 * k), val: 454 * k, wline: k + '\\text{ lb}\\approx ' + k + '\\times 0.454=' + N(q(0.454 * k)), wval: 0.454 * k, wcode: 'u4m-not-conv', wwhy: '0.454 changes pounds to <b>kilograms</b>. In grams, 1 lb ≈ 454 g.' };
  }
  function pLbOzKg(r) { // a lb b oz or c kg
    var v = find(function () { var c = r.pick([1, 1.5, 2, 2.5, 3]), tot = Math.round(35.2 * c) + r.pick([-4, -3, -2, 2, 3, 4]); return [Math.floor(tot / 16), tot % 16, c]; }, function (v) { return v[1] >= 2 && v[1] <= 14 && v[1] !== 8 && v[1] !== 10 && Math.abs((v[0] + v[1] / 16) * 0.454 - v[2]) >= 0.02; }, [2, 4, 1]);
    var a = v[0], b = v[1], c = v[2], L = a + b / 16;
    return { X: a + ' lb ' + b + ' oz', Y: N(c) + ' kg', yv: c, unit: 'kg', xn: a, yn: c, line: a + '\\text{ lb }' + b + '\\text{ oz}=' + N(q(L)) + '\\text{ lb}\\approx ' + N(q(L)) + '\\times 0.454' + a3(L * 0.454), val: L * 0.454,
      wline: a + '\\text{ lb }' + b + '\\text{ oz}=' + a + '.' + b + '\\text{ lb}\\approx ' + a + '.' + b + '\\times 0.454' + a3((a + b / 10) * 0.454), wval: (a + b / 10) * 0.454, wcode: 'u4m-oz10', wwhy: 'A pound has 16 oz, not 10, so ' + b + ' oz is ' + t(b + '\\div 16=' + N(q(b / 16))) + ' lb, not 0.' + b + ' lb.' };
  }
  function pTLb(r) { // n t or k lb (X = n t changed to lb)
    var v = find(function () { var n = r.pick([1, 1, 2, 3]), k = Math.round(2200 * n / 100) * 100 + r.pick([-300, -200, -100, 100, 200]); return [n, k]; }, function (v) { return Math.abs(v[1] - 2200 * v[0]) >= 50; }, [1, 2000]);
    var n = v[0], k = v[1];
    return { X: n + ' t', Y: N(k) + ' lb', yv: k, unit: 'lb', xn: n, yn: k, line: n + '\\text{ t}=' + N(1000 * n) + '\\text{ kg}\\approx ' + N(1000 * n) + '\\times 2.2=' + N(2200 * n), val: 2200 * n, wline: n + '\\text{ t}\\approx ' + n + '\\times 2000=' + N(2000 * n), wval: 2000 * n, wcode: 'u4m-ton-tonne', wwhy: '2000 lb is a <b>ton</b>. A tonne is 1000 kg ≈ 2200 lb.' };
  }

  /* estimate in your head: kind 'kg-lb' | 'lb-kg' | 'oz-g' */
  function estMC(r, prompt, kind, x) {
    var o, sol;
    if (kind === 'kg-lb') {
      var d = 2 * x, a = q(d + d / 10);
      o = [{ html: 'Double: ' + t(x + '\\times 2=' + d) + '. Add 10%: ' + t(d + '+' + N(d / 10) + '=' + N(a)) + '. About ' + N(a) + ' lb.', right: true },
        { html: 'Halve: ' + t(x + '\\div 2=' + N(x / 2)) + '. Take away 10%: about ' + N(q(x / 2 - x / 20)) + ' lb.', why: 'Halving is for pounds → kilograms. A kilogram is more than 2 pounds, so the number of pounds is <b>bigger</b>.', code: 'u4m-wrong-fact' },
        { html: 'Double: ' + t(x + '\\times 2=' + d) + '. About ' + d + ' lb.', why: 'Close, but a kilogram is a bit <b>more</b> than 2 lb: add 10% of ' + d + '.', code: 'u4m-est-part' },
        { html: 'Add 10%: ' + t(x + '+' + N(x / 10) + '=' + N(q(x * 1.1))) + '. About ' + N(q(x * 1.1)) + ' lb.', why: 'Double first (a kilogram is about 2 lb), then add 10% of that.', code: 'u4m-est-part' }];
      sol = 'Double: ' + t(x + '\\times 2=' + d) + '<br>Add 10%: ' + t(d + '+' + N(d / 10) + '=' + N(a)) + '<br>About ' + N(a) + ' lb.';
    } else if (kind === 'lb-kg') {
      var h = q(x / 2), b = q(h - h / 10);
      o = [{ html: 'Halve: ' + t(x + '\\div 2=' + N(h)) + '. Take away 10%: ' + t(N(h) + '-' + N(q(h / 10)) + '=' + N(b)) + '. About ' + N(b) + ' kg.', right: true },
        { html: 'Double: ' + t(x + '\\times 2=' + 2 * x) + '. Add 10%: about ' + N(q(2.2 * x)) + ' kg.', why: 'Doubling is for kilograms → pounds. A pound is less than half a kilogram, so the number of kg is <b>smaller</b>.', code: 'u4m-wrong-fact' },
        { html: 'Halve: ' + t(x + '\\div 2=' + N(h)) + '. About ' + N(h) + ' kg.', why: 'Close, but a pound is a bit <b>less</b> than half a kilogram: take away 10% of ' + N(h) + '.', code: 'u4m-est-part' },
        { html: 'Take away 10%: ' + t(x + '-' + N(x / 10) + '=' + N(q(x * 0.9))) + '. About ' + N(q(x * 0.9)) + ' kg.', why: 'Halve first (a pound is about half a kilogram), then take away 10% of that.', code: 'u4m-est-part' }];
      sol = 'Halve: ' + t(x + '\\div 2=' + N(h)) + '<br>Take away 10%: ' + t(N(h) + '-' + N(q(h / 10)) + '=' + N(b)) + '<br>About ' + N(b) + ' kg.';
    } else {
      o = [{ html: 'About 30 g for each ounce: ' + t(x + '\\times 30=' + 30 * x) + '. About ' + 30 * x + ' g.', right: true },
        { html: 'About 16 g for each ounce: ' + t(x + '\\times 16=' + 16 * x) + '. About ' + 16 * x + ' g.', why: '16 is the number of ounces in a pound. An ounce is about 30 g.', code: 'u4m-wrong-fact' },
        { html: 'About 3 g for each ounce: ' + t(x + '\\times 3=' + 3 * x) + '. About ' + 3 * x + ' g.', why: 'An ounce is about the mass of a slice of bread, about <b>30</b> g.', code: 'u4m-est-place' },
        { html: 'Divide by 30: ' + t(x + '\\div 30\\approx ' + N(rd(x / 30, 2))) + '. About ' + N(rd(x / 30, 2)) + ' g.', why: 'A gram is tiny, so there are many more grams than ounces: multiply by 30.', code: 'u4m-div-mult' }];
      sol = 'About 30 g per ounce: ' + t(x + '\\times 30=' + 30 * x) + '<br>About ' + 30 * x + ' g (a little high: 1 oz is a bit less than 30 g).';
    }
    return P.mc(r, prompt, o, sol, [kind === 'kg-lb' ? 'kg → lb: double it, then add 10% of that.' : kind === 'lb-kg' ? 'lb → kg: halve it, then take away 10% of that.' : 'oz → g: about 30 g for each ounce.'], 'estimate ' + kind);
  }
  /* a lb b oz → kg (to dp) by the pounds route; the ounces route is accepted too */
  function lbOzToKg(prompt, a, b, dp, o) {
    o = o || {}; var L = a + b / 16, v = L * LB, oz = 16 * a + b, v2 = oz * OZ / 1000;
    return num(prompt, v, { dp: dp, exact: v, after: 'kg', alt: [v2, (a + b / 16) / KG], nr: o.nr,
      bad: [[(a + b / 10) * LB, 'u4m-oz10', 'There are 16 oz in a pound, not 10: ' + b + ' oz is ' + t(b + '\\div 16=' + N(q(b / 16))) + ' lb, so ' + a + ' lb ' + b + ' oz is ' + N(q(L)) + ' lb.'], [a * LB, 'u4m-drop-oz', 'Don’t forget the ' + b + ' oz: change it to pounds (' + t(b + '\\div 16') + ') and add it on.'], [L * KG, 'u4m-wrong-fact', 'To change pounds to kilograms multiply by 0.454 (the number gets smaller).'], [oz * OZ, 'u4m-g-kg', 'That’s the mass in <b>grams</b>. Divide by 1000 for kilograms.'], [oz * LB, 'u4m-wrong-fact', 'You multiplied the <b>ounces</b> by 0.454. Either change to pounds first, or use 1 oz ≈ 28.35 g.']],
      sol: steps([t(b + '\\text{ oz}=' + b + '\\div 16=' + N(q(b / 16)) + '\\text{ lb}') + ', so ' + N(q(L)) + ' lb', t(N(q(L)) + '\\times 0.454' + a3(v)) + ' kg', 'To the nearest ' + place(dp) + ': ' + t(N(rd(v, dp), dp) + '\\text{ kg}'), '(Or: ' + t(a + '\\times 16+' + b + '=' + oz) + ' oz, ' + t(oz + '\\times 28.35=' + N(q(oz * OZ))) + ' g ' + t('\\approx ' + N(rd(v2, dp), dp)) + ' kg.)']),
      hints: ['Change the ounces to pounds first: ounces ÷ 16.', 'Then multiply the pounds by 0.454.'], text: o.text || 'lb oz to kg' });
  }
  /* m kg → lb and oz (nearest ounce) */
  function kgToLbOz(m) {
    var L = m * KG, lb = Math.floor(q(L)), oz = Math.round(q(frac(L) * 16)); if (oz === 16) { lb++; oz = 0; }
    var L2 = m / LB, lb2 = Math.floor(q(L2)), oz2 = Math.round(q(frac(L2) * 16)); if (oz2 === 16) { lb2++; oz2 = 0; }
    return { L: L, lb: lb, oz: oz, alt: lb2 !== lb || oz2 !== oz ? [[lb2, oz2]] : [] };
  }
  function kgLbOzOk(m) { var L = q(m * KG), f = frac(L) * 16; return Math.abs(f - Math.floor(f) - 0.5) > 0.06 && f < 15.5 && frac(L) > 0.04; }
  function kgToLbOzPart(prompt, m, o) {
    o = o || {}; var k = kgToLbOz(m), d = frac(k.L), dS = nS(rd(d, 3));
    return lboz(prompt, k.lb, k.oz, { alt: k.alt, decLb: k.L, bad: [[Math.floor(q(m * LB)), Math.round(frac(m * LB) * 16) % 16, 'u4m-wrong-fact', 'To change kilograms to pounds multiply by 2.2: there are more pounds than kilograms.']],
      sol: steps([t(N(m) + '\\times 2.2=' + N(q(k.L))) + ' lb, which is ' + Math.floor(q(k.L)) + ' lb plus ' + dS + ' lb', t(dS + '\\times 16' + a3(d * 16) + (same(d * 16, Math.round(q(d * 16))) ? '' : '\\approx ' + Math.round(q(d * 16)))) + ' oz', 'About ' + k.lb + ' lb ' + k.oz + ' oz.']),
      hints: ['Multiply by 2.2 to get pounds.', 'Keep the whole pounds. Change the decimal part to ounces: × 16, then round to the nearest ounce.'], text: o.text || 'kg to lb oz' });
  }
  /* price per lb ↔ per kg */
  function priceKg(prompt, perLb, o) { o = o || {}; var v = perLb * KG; return num(prompt, v, { money: true, exact: v, after: o.after === undefined ? 'per kg' : o.after, alt: o.alt ? [perLb / LB] : [], bad: [[perLb / KG, 'u4m-price-way', 'A kilogram is <b>more</b> meat than a pound, so it costs <b>more</b>: multiply the price per lb by 2.2.'], [perLb * LB, 'u4m-price-way', 'Converting a <b>price</b> goes the opposite way to a mass: price per kg = price per lb × 2.2.'], [perLb * 2, 'u4m-est-part', 'A kilogram is about 2.2 lb, not 2 lb: multiply by 2.2.']], sol: t(D(perLb) + '\\times 2.2=' + N(q(v))) + (same(rd(v, 2), v) ? '' : t('\\approx ' + D(v))) + ' per kg', hints: o.hints || ['1 kg ≈ 2.2 lb, so 1 kg costs about 2.2 times as much as 1 lb.'], text: o.text || 'per kg' }); }
  function priceLb(prompt, perKg, o) { o = o || {}; var v = perKg / KG; return num(prompt, v, { money: true, exact: v, after: o.after === undefined ? 'per lb' : o.after, bad: [[perKg * KG, 'u4m-price-way', 'A pound is <b>less</b> meat than a kilogram, so it costs <b>less</b>: divide the price per kg by 2.2.'], [perKg * LB, 'u4m-price-way', 'Use price per lb = price per kg ÷ 2.2.'], [perKg / 2, 'u4m-est-part', 'A kilogram is about 2.2 lb, not 2 lb: divide by 2.2.']], sol: t(D(perKg) + '\\div 2.2' + (same(rd(v, 2), v) ? '=' + D(v) : '=' + N(rd(v, 5)) + '\\ldots\\approx ' + D(v))) + ' per lb', hints: o.hints || ['A pound costs less than a kilogram: price per lb = price per kg ÷ 2.2.'], text: o.text || 'per lb' }); }
  U.LB = LB; U.KG = KG; U.OZ = OZ; U.TON = TON; U.cv = cv; U.cvTex = cvTex; U.cvPart = cvPart; U.heavier = heavier; U.estMC = estMC; U.lbOzToKg = lbOzToKg; U.kgToLbOzPart = kgToLbOzPart; U.kgLbOzOk = kgLbOzOk; U.priceKg = priceKg; U.priceLb = priceLb;
  U.pairs = { kgLb: pKgLb, lbKg: pLbKg, ozG: pOzG, tonT: pTonT, gLb: pGLb, lbOzKg: pLbOzKg, tLb: pTLb };

  HW.addCodes({
    'u4m-wrong-fact': 'Used the wrong conversion fact', 'u4m-div-mult': 'Divided instead of multiplying (or the reverse)', 'u4m-est30': 'Used the 30 g estimate instead of 28.35 g', 'u4m-oz10': 'Read ounces as tenths of a pound',
    'u4m-oz-dec': 'Wrote the decimal part of the pounds as ounces', 'u4m-oz16': 'Ounces 16 or more', 'u4m-oz-split': 'Didn’t split into pounds and ounces', 'u4m-drop-oz': 'Left out the ounces', 'u4m-g-kg': 'Grams not changed to kilograms',
    'u4m-ton-tonne': 'Mixed up tons and tonnes', 'u4m-price-way': 'Converted a price the wrong way', 'u4m-count-dir': 'Rounded a count the wrong way', 'u4m-count-dec': 'Gave a decimal for a count', 'u4m-no-sub': 'Didn’t subtract the other mass first',
    'u4m-early': 'Rounded too early', 'u4m-not-conv': 'Didn’t change to the same unit', 'u4m-one': 'Gave the amount for one, not all', 'u4m-other-box': 'Answers in each other’s boxes', 'u4m-round-dir': 'Rounded the wrong way', 'u4m-comma': 'Decimal comma',
    'u4m-bare': 'Compared the bare numbers (different units)', 'u4m-same': 'Said the masses are the same', 'u4m-est-part': 'Did only part of the estimate', 'u4m-est-place': 'Estimate off by a power of ten', 'u4m-total': 'Gave a total instead of the difference', 'u4m-other-store': 'Used the other store’s price', 'u4m-added': 'Added instead of subtracting'
  });
  HW.addPartial({ 'u4m-wrong-fact': 'n', 'u4m-div-mult': 'n', 'u4m-est30': 's', 'u4m-oz10': 'b', 'u4m-oz-dec': 'b', 'u4m-drop-oz': 'b', 'u4m-g-kg': 's', 'u4m-ton-tonne': 'n', 'u4m-price-way': 'n', 'u4m-count-dir': 'b', 'u4m-no-sub': 'b', 'u4m-early': 's', 'u4m-not-conv': 'b', 'u4m-one': 'b', 'u4m-round-dir': 's', 'u4m-est-part': 'b', 'u4m-total': 'b', 'u4m-added': 'n' });

  /* shared shapes for repeated booklet questions */
  var MEATS = ['ground beef', 'chicken breasts', 'pork chops', 'stewing beef', 'chicken thighs', 'pork loin roast', 'lean ground turkey'];
  var PRODUCE = ['bananas', 'gala apples', 'red grapes', 'carrots', 'old cheddar', 'tomatoes', 'pears', 'onions'];
  function convQ(num0, idp, rows, stem) { // rows: [[kind, x(r), dp, level]]
    return { num: num0, stem: stem || 'Convert. Round to the nearest tenth.', parts: rows.map(function (rw, i) {
      return { id: idp + String.fromCharCode(97 + i), level: rw[3], make: function (r) { var x = rw[1](r); return cvPart(x + ' ' + CV[rw[0]].from + ' to ' + CV[rw[0]].to, rw[0], x, rw[2] == null ? 1 : rw[2]); } };
    }) };
  }
  function pickX(r, list, excl) { return find(function () { return r.pick(list); }, function (x) { return (excl || []).indexOf(x) < 0; }, list[0]); }
  /* parcel price table: [[limit g, price]] */
  function rowOf(tab, g) { for (var i = 0; i < tab.length; i++) if (g <= tab[i][0] + 1e-9) return i; return tab.length - 1; }

  /* ================= lesson ================= */
  HW.defineLesson({
    id: 'u4l5', unit: 4, num: '5', title: 'Converting Mass Between SI and Imperial', outcome: 'M2',
    blurb: 'Pounds and ounces to kilograms and grams (and back), quick estimates, baggage and shipping limits, loads, and prices per pound or per kilogram.',
    questions: [
      { num: '1', stem: 'Which mass is heavier in each pair? Use the conversion facts.', parts: [
        { id: '1a', level: 'BEG', make: function (r) { return heavier(r, pKgLb(r, [[1, 1], [2, 4]])); } },
        { id: '1b', level: 'EMG', make: function (r) { return heavier(r, find(function () { return pLbKg(r); }, function (s) { return !(s.xn === 4 && s.yn === 2); }, pLbKg(r))); } },
        { id: '1c', level: 'BEG', make: function (r) { return heavier(r, pOzG(r, [[1, 25], [8, 250]])); } },
        { id: '1d', level: 'BEG', make: function (r) { return heavier(r, pTonT(r, [[1, 1]])); } },
        { id: '1e', level: 'EMG', make: function (r) { return heavier(r, pGLb(r)); } },
        { id: '1f', level: 'EMG', make: function (r) { return heavier(r, pLbOzKg(r)); } }] },
      { num: '2', stem: 'Estimate in your head. Which thinking is right?', parts: [
        { id: '2a', level: 'BEG', make: function (r) { var x = pickX(r, [15, 25, 35, 40, 45, 50], [30, 20]); return estMC(r, 'A ' + x + ' kg dog. About how many pounds?', 'kg-lb', x); } },
        { id: '2b', level: 'BEG', make: function (r) { var x = pickX(r, [140, 150, 170, 180, 190, 200, 220], [160, 120]); return estMC(r, 'A ' + x + ' lb man. About how many kilograms?', 'lb-kg', x); } },
        { id: '2c', level: 'BEG', make: function (r) { var x = r.pick([4, 8, 10, 20, 30]); return estMC(r, 'A ' + x + ' lb bag of potatoes. About how many kilograms?', 'lb-kg', x); } },
        { id: '2d', level: 'BEG', make: function (r) { var x = pickX(r, [2, 3, 4, 7, 8, 9], [5, 6]); return estMC(r, x + ' oz of cheese. About how many grams?', 'oz-g', x); } }] },
      convQ('3', '3', [['lb-kg', function (r) { return pickX(r, [12, 14, 15, 18, 22, 35, 42], [25]); }, 1, 'BEG'], ['kg-lb', function (r) { return pickX(r, [35, 45, 52, 57, 64, 75, 83], [68]); }, 1, 'BEG'], ['oz-g', function (r) { return pickX(r, [3, 4, 7, 8, 9, 14, 16], [12, 6, 5]); }, 1, 'BEG'],
        ['g-oz', function (r) { return pickX(r, [250, 300, 450, 750, 800, 1000], [500]); }, 1, 'EMG'], ['ton-t', function (r) { return pickX(r, [1.5, 2.5, 4, 6, 7.5, 12], [3]); }, 1, 'EMG'], ['t-ton', function (r) { return pickX(r, [2, 5, 8, 12, 15, 20], [4.5]); }, 1, 'EMG']]),
      { num: '4', stem: 'Find and fix each mistake.',
        shared: function (r) { var m = pickX(r, [15, 25, 30, 40, 45, 60], [20]), z = find(function () { return [r.int(2, 8), r.pick([2, 4, 6, 8])]; }, function (z) { return rd((z[0] + z[1] / 10) * LB, 1) !== rd((z[0] + z[1] / 16) * LB, 1); }, [5, 8]); return { m: m, a: z[0], b: z[1] }; },
        parts: [
          { id: '4ai', sub: 'a i', level: 'EMG', make: function (r, sh) { var w = rd(sh.m * LB, 1);
            return P.mc(r, 'Mateo changed ' + sh.m + ' kg to pounds like this: ' + t(sh.m + '\\times 0.454=' + N(w)) + ' lb. How does an estimate show his answer can’t be right?', [
              { html: 'A kilogram is more than 2 pounds, so ' + sh.m + ' kg is about ' + N(q(sh.m * 2.2)) + ' lb. ' + N(w) + ' lb is far too small: he used the lb → kg fact.', right: true },
              { html: 'A kilogram is less than a pound, so ' + N(w) + ' lb is too big.', why: 'A kilogram is <b>more</b> than a pound (about 2.2 lb).', code: 'u4m-wrong-fact' },
              { html: 'He should have rounded to the nearest whole pound.', why: 'Rounding can’t fix an answer that is less than half of what it should be. Estimate: double ' + sh.m + ' and add 10%.', code: 'round' },
              { html: 'Nothing is wrong: 0.454 is the fact for kilograms to pounds.', why: '1 lb ≈ 0.454 kg is the fact for pounds to kilograms. For kilograms to pounds, use 2.2.', code: 'fine' }],
              'Estimate: ' + t(sh.m + '\\times 2=' + 2 * sh.m) + ', plus 10% is about ' + N(q(sh.m * 2.2)) + ' lb.<br>' + N(w) + ' lb is much less than that. A kilogram is bigger than a pound, so there must be <b>more</b> pounds than kilograms. He used the lb → kg fact.', ['Estimate: kg → lb, double it and add 10%.'], 'Mateo why');
          } },
          { id: '4aii', sub: 'a ii', level: 'EMG', make: function (r, sh) { return cvPart('Find the correct mass of ' + sh.m + ' kg in pounds.', 'kg-lb', sh.m, 1); } },
          { id: '4bi', sub: 'b i', level: 'EMG', make: function (r, sh) { var L = sh.a + sh.b / 16;
            return P.mc(r, 'Zoe wrote: “' + sh.a + ' lb ' + sh.b + ' oz = ' + sh.a + '.' + sh.b + ' lb = ' + sh.a + '.' + sh.b + ' × 0.454 = ' + N(rd((sh.a + sh.b / 10) * LB, 1)) + ' kg.” What is her mistake?', [
              { html: sh.b + ' oz is ' + t(sh.b + '\\div 16=' + N(q(sh.b / 16))) + ' lb, not 0.' + sh.b + ' lb: a pound has 16 oz, not 10.', right: true },
              { html: 'She should have multiplied by 2.2 instead of 0.454.', why: 'Multiplying by 0.454 is right for lb → kg. Look at how she changed the ounces.', code: 'u4m-wrong-fact' },
              { html: 'She should have divided by 0.454 instead of multiplying.', why: 'Pounds → kilograms: multiply by 0.454 (the number gets smaller). Look at the ounces.', code: 'u4m-div-mult' },
              { html: 'She rounded too early.', why: 'Her rounding is fine. Look at how she wrote ' + sh.b + ' oz as part of a pound.', code: 'u4m-early' }],
              'There are 16 oz in a pound, so ' + t(sh.b + '\\text{ oz}=' + sh.b + '\\div 16=' + N(q(sh.b / 16))) + ' lb, and ' + sh.a + ' lb ' + sh.b + ' oz ' + t('=' + N(q(L))) + ' lb, not ' + sh.a + '.' + sh.b + ' lb.', ['How many ounces are in a pound?'], 'Zoe why');
          } },
          { id: '4bii', sub: 'b ii', level: 'EMG', make: function (r, sh) { return lbOzToKg('Find the correct mass of ' + sh.a + ' lb ' + sh.b + ' oz in kilograms, to the nearest tenth.', sh.a, sh.b, 1); } }] },
      { num: '5', stem: '', parts: [
        { id: '5a', level: 'EMG', make: function (r) { var v = find(function () { return [r.int(5, 9), r.int(1, 15)]; }, function (v) { return !(v[0] === 7 && v[1] === 6) && v[1] !== 8 && far((v[0] + v[1] / 16) * LB, 2, 0.08); }, [8, 2]); var nm = r.pick(['Leo', 'Mira', 'Noah', 'Ava', 'Kai']);
          return lbOzToKg('Baby ' + nm + ' was born at ' + v[0] + ' lb ' + v[1] + ' oz. Find the baby’s mass in kilograms, to the nearest hundredth.', v[0], v[1], 2); } },
        { id: '5b', level: 'BEG', make: function (r) { var m = q(r.int(520, 980) / 10); return cvPart('At the clinic, a patient’s chart says ' + N(m) + ' kg. She only knows her weight in pounds. What is it, to the nearest tenth?', 'kg-lb', m, 1); } },
        { id: '5c', level: 'PRG', make: function (r) { var m = find(function () { return q(r.int(15, 55) / 10); }, function (m) { return m !== 9 && kgLbOzOk(m); }, 3.6); return kgToLbOzPart('A beef roast is ' + N(m) + ' kg. Find its mass in pounds and ounces, to the nearest ounce.', m); } }] },
      { num: '6', stem: function (sh) { return 'The Nguyen family is flying to Vancouver. Each checked bag may be up to ' + sh.lim + ' kg. At home their bags weigh ' + sh.b.join(' lb, ').replace(/, (\d+)$/, ' and $1') + ' lb.'; },
        shared: function (r) { var lim = r.pick([23, 23, 20, 32]), L = lim * KG, over = r.int(Math.ceil(L / LB + 0.01), Math.ceil(L / LB) + 3); var b = find(function () { return [r.int(Math.floor(L) - 9, Math.floor(L) - 1), r.int(Math.floor(L) - 9, Math.floor(L) - 1)]; }, function (b) { return b[0] !== b[1]; }, [Math.floor(L) - 3, Math.floor(L) - 6]); var k = r.int(0, 2); b.splice(k, 0, over); return { lim: lim, b: b, k: k }; },
        parts: [
          { id: '6ai', sub: 'a i', level: 'EMG', make: function (r, sh) { return boxes('Find the mass of each bag in kilograms, to the nearest tenth.', sh.b.map(function (x) { return { label: x + ' lb bag:', name: x + ' lb bag', ans: x * LB, dp: 1, after: 'kg', alt: [x / KG], bad: cvBad('lb-kg', x) }; }), sh.b.map(function (x) { return x + ' lb: ' + t(x + '\\times 0.454' + a3(x * LB) + '\\approx ' + N(rd(x * LB, 1), 1)) + ' kg'; }).join('<br>'), ['1 lb ≈ 0.454 kg: multiply each mass by 0.454.'], 'bags kg'); } },
          { id: '6aii', sub: 'a ii', level: 'EMG', make: function (r, sh) { return P.mc(r, 'Which bag is over the ' + sh.lim + ' kg limit?', sh.b.map(function (x, i) { return { html: 'The ' + x + ' lb bag', right: i === sh.k, why: i === sh.k ? null : x + ' lb is about ' + N(rd(x * LB, 1), 1) + ' kg, which is under ' + sh.lim + ' kg.', code: 'bag' + i }; }).concat([{ html: 'None of them', why: 'Change each bag to kilograms and compare with ' + sh.lim + ' kg.', code: 'none' }]),
            'The ' + sh.b[sh.k] + ' lb bag: ' + t(sh.b[sh.k] + '\\times 0.454' + a3(sh.b[sh.k] * LB)) + ' kg, more than ' + sh.lim + ' kg.', ['Use your answers from (a i).'], 'which bag', true); } },
          { id: '6b', sub: 'b', level: 'EMG', make: function (r, sh) { return cvPart('Change the ' + sh.lim + ' kg limit to pounds, to the nearest tenth. Does it agree with part (a)?', 'kg-lb', sh.lim, 1); } }] },
      { num: '7', stem: function (sh) { return 'Arjun sells hoodies online. Each hoodie has a mass of ' + sh.a + ' lb ' + sh.b + ' oz. The post office’s prices are below.' + tbl(['Mass of parcel', 'Price'], sh.tab.map(function (rw, i) { return [(i ? 'over ' + (sh.tab[i - 1][0] >= 1000 ? sh.tab[i - 1][0] / 1000 + ' kg' : sh.tab[i - 1][0] + ' g') + ', ' : '') + 'up to ' + (rw[0] >= 1000 ? rw[0] / 1000 + ' kg' : rw[0] + ' g'), Dp(rw[1])]; })); },
        shared: function (r) { var tab = [[500, 8.25], [1000, 11.6], [2000, 15.9], [5000, 22.35]];
          return find(function () { var oz = r.int(18, 27), m1 = r.pick([100, 110, 120, 130, 140, 150]), m2 = r.pick([250, 280, 300, 320, 350]); var g = oz * OZ, s1 = g + m1, s2 = 2 * g + m2; return { a: 1, b: oz - 16, oz: oz, g: g, m1: m1, m2: m2, s1: s1, s2: s2, tab: tab }; },
            function (s) { return s.s1 > 520 && s.s1 < 980 && s.s2 > 1020 && s.s2 < 1980 && !(s.b === 5 && s.m1 === 120); }, { a: 1, b: 4, oz: 20, g: 567, m1: 110, m2: 280, s1: 677, s2: 1414, tab: tab }); },
        parts: [
          { id: '7ai', sub: 'a i', level: 'PRG', make: function (r, sh) { return num('One hoodie goes in a mailer with a mass of ' + sh.m1 + ' g. What is the mass of the parcel in grams?', sh.s1, { dp: 2, after: 'g', alt: [rd(sh.s1, 1), Math.round(sh.s1), (sh.a + sh.b / 16) * 454 + sh.m1], tol: 0.6,
            bad: [[sh.g, 'u4m-no-sub', 'That’s the hoodie alone. Add the ' + sh.m1 + ' g mailer.'], [(sh.a + sh.b / 10) * 454 + sh.m1, 'u4m-oz10', sh.a + ' lb ' + sh.b + ' oz is not ' + sh.a + '.' + sh.b + ' lb (16 oz in a pound). Change it to ounces: ' + t('16+' + sh.b + '=' + sh.oz) + ' oz.'], [sh.oz * 30 + sh.m1, 'u4m-est30', 'Use 1 oz ≈ 28.35 g, not the 30 g estimate.']],
            sol: steps([t(sh.a + '\\text{ lb }' + sh.b + '\\text{ oz}=16+' + sh.b + '=' + sh.oz + '\\text{ oz}'), t(sh.oz + '\\times 28.35=' + N(q(sh.g))) + ' g', 'Parcel: ' + t(N(q(sh.g)) + '+' + sh.m1 + '=' + N(q(sh.s1))) + ' g']), hints: ['Change the hoodie to ounces (1 lb = 16 oz), then to grams (× 28.35).', 'Add the mailer.'], text: 'parcel g' }); } },
          { id: '7aii', sub: 'a ii', level: 'EMG', make: function (r, sh) { var k = rowOf(sh.tab, sh.s1); return P.mc(r, 'Use your mass from (a i). What does it cost to ship the one hoodie?', sh.tab.map(function (rw, i) { return { html: Dp(rw[1]), right: i === k, why: i === k ? null : 'Find the row that the parcel’s mass fits in. Remember 1 kg = 1000 g.', code: 'row' + i }; }), Np(rd(sh.s1, 0)) + ' g is over 500 g but not over 1 kg (1000 g), so the price is ' + Dp(sh.tab[k][1]) + '.', ['1 kg = 1000 g.'], 'price 1', true); } },
          { id: '7bi', sub: 'b i', level: 'PRG', make: function (r, sh) { var k = rowOf(sh.tab, sh.s2); return P.mc(r, 'Two hoodies for the same customer go in one box with a mass of ' + sh.m2 + ' g. What does it cost to ship?', sh.tab.map(function (rw, i) { return { html: Dp(rw[1]), right: i === k, why: i === k ? null : i === rowOf(sh.tab, sh.g * 2) ? 'Don’t forget the ' + sh.m2 + ' g box.' : 'Find the mass first: 2 hoodies plus the box, in grams.', code: 'row' + i }; }), t('2\\times ' + N(q(sh.g)) + '+' + sh.m2 + '=' + N(q(sh.s2))) + ' g ' + t('\\approx ' + N(rd(sh.s2 / 1000, 2))) + ' kg, in the 1 kg to 2 kg row: ' + Dp(sh.tab[k][1]) + '.', ['Mass = 2 hoodies + the box.'], 'price 2', true); } },
          { id: '7bii', sub: 'b ii', level: 'PRG', make: function (r, sh) { var p1 = sh.tab[rowOf(sh.tab, sh.s1)][1], p2 = sh.tab[rowOf(sh.tab, sh.s2)][1], ans = q(2 * p1 - p2);
            return num('How much does Arjun save by sending the two hoodies in one box instead of two separate mailers?', ans, { money: true, bad: [[2 * p1, 'u4m-total', 'That’s what two mailers cost. Subtract the price of the one box.'], [p2 - p1, 'u4m-one', 'Two separate mailers means paying ' + Dp(p1) + ' <b>twice</b>.']], sol: steps(['Two mailers: ' + t('2\\times ' + D(p1) + '=' + D(2 * p1)), 'One box: ' + t(D(p2)), 'He saves ' + t(D(2 * p1) + '-' + D(p2) + '=' + D(ans)) + '.']), hints: ['Two mailers cost 2 × the price from (a ii).'], text: 'save' }); } }] },
      { num: '8', stem: function (sh) { return sh.nm + '’s pickup truck can carry a load of up to ' + Np(sh.L) + ' lb, including the driver. ' + sh.nm + ' has a mass of ' + sh.d + ' kg. Bags of ' + sh.what + ' are ' + sh.bag + ' kg each.'; },
        shared: function (r) { return find(function () { return { nm: r.pick(['Dylan', 'Priya', 'Mason', 'Leah']), L: r.pick([1500, 1600, 1800, 2000]), d: r.int(14, 20) * 5, bag: r.pick([20, 25, 30, 40]), what: r.pick(['concrete mix', 'sand', 'gravel']) }; }, function (s) { var n = (s.L - s.d * KG) / (s.bag * KG); return n - Math.floor(n) > 0.1 && n - Math.floor(n) < 0.9 && !(s.L === 1800 && s.d === 90 && s.bag === 30); }, { nm: 'Dylan', L: 1600, d: 80, bag: 25, what: 'sand' }); },
        parts: [
          { id: '8a', level: 'EMG', make: function (r, sh) { return boxes('Change ' + sh.nm + '’s mass and the mass of one bag to pounds.', [{ label: sh.nm + ':', name: sh.nm, ans: sh.d * KG, dp: 1, after: 'lb', bad: cvBad('kg-lb', sh.d), alt: [sh.d / LB] }, { label: 'One bag:', name: 'One bag', ans: sh.bag * KG, dp: 1, after: 'lb', bad: cvBad('kg-lb', sh.bag), alt: [sh.bag / LB] }], sh.nm + ': ' + t(sh.d + '\\times 2.2=' + N(q(sh.d * KG))) + ' lb<br>One bag: ' + t(sh.bag + '\\times 2.2=' + N(q(sh.bag * KG))) + ' lb', ['1 kg ≈ 2.2 lb.'], 'driver bag lb'); } },
          { id: '8b', level: 'ADV', make: function (r, sh) { var D0 = q(sh.d * KG), B = q(sh.bag * KG), room = q(sh.L - D0), n = Math.floor(room / B);
            return num('What is the greatest number of bags ' + sh.nm + ' can carry in one trip?', n, { dp: 0, count: 'down', after: 'bags', bad: [[Math.floor(sh.L / B), 'u4m-no-sub', 'The ' + Np(sh.L) + ' lb includes the driver. Subtract ' + sh.nm + '’s ' + N(D0) + ' lb first.'], [Math.floor((sh.L - sh.d) / sh.bag), 'u4m-not-conv', 'The limit is in pounds, so change ' + sh.nm + ' and the bags to pounds first.'], ], alt: [Math.floor((sh.L * LB - sh.d) / sh.bag), Math.floor((sh.L / KG - sh.d) / sh.bag)],
              sol: steps(['Room for bags: ' + t(N(sh.L) + '-' + N(D0) + '=' + N(room)) + ' lb', t(N(room) + '\\div ' + N(B) + '=' + N(rd(room / B, 2)) + '\\ldots') + ', round <b>down</b>: ' + n + ' bags', '(Check: ' + t(n + '\\times ' + N(B) + '+' + N(D0) + '=' + N(q(n * B + D0))) + ' lb, under ' + Np(sh.L) + ' lb.)']), hints: ['Subtract the driver from the limit first.', 'Divide by the mass of one bag, then round down.'], text: 'max bags' }); } }] },
      { num: '9', stem: function (sh) { return 'Complete the table. Round to the nearest cent.' + tbl(['Item', 'Price per lb', 'Price per kg'], sh.rows.map(function (rw, i) { return ['(' + String.fromCharCode(97 + i) + ') ' + rw.name, rw.toKg ? Dp(rw.p) : '?', rw.toKg ? '?' : Dp(rw.p)]; })); },
        shared: function (r) { var names = r.shuffle(MEATS.concat(PRODUCE)).slice(0, 4), order = r.shuffle([true, true, false, false]);
          return { rows: names.map(function (nm, i) { var meat = MEATS.indexOf(nm) >= 0, toKg = order[i], p;
            if (toKg) p = find(function () { return (meat ? r.int(299, 899) : r.int(59, 399)) / 100; }, function (x) { return [5.49, 4.99, 1.79, 1.15, 6.5].indexOf(x) < 0 && far(x * KG, 2, 0.05); }, 3.29);
            else p = find(function () { return (meat ? r.int(650, 1990) : r.int(130, 880)) / 100; }, function (x) { return [14.3, 2.53, 1.52, 8.8].indexOf(x) < 0 && far(x / KG, 2, 0.06); }, 9.9);
            return { name: nm, toKg: toKg, p: p }; }) }; },
        parts: [
          { id: '9', level: 'EMG', make: function (r, sh) { return boxes('Fill in the missing price for each item.', sh.rows.map(function (rw, i) { var v = rw.toKg ? rw.p * KG : rw.p / KG; return { label: '(' + String.fromCharCode(97 + i) + ') ' + rw.name + (rw.toKg ? ', per kg:' : ', per lb:'), name: rw.name, ans: v, money: true, exact: v, after: rw.toKg ? 'per kg' : 'per lb', bad: rw.toKg ? [[rw.p / KG, 'u4m-price-way', 'A kilogram costs <b>more</b> than a pound: multiply the price per lb by 2.2.'], [rw.p * LB, 'u4m-price-way', 'A price converts the opposite way to a mass: price per kg = price per lb × 2.2.']] : [[rw.p * KG, 'u4m-price-way', 'A pound costs <b>less</b> than a kilogram: divide the price per kg by 2.2.'], [rw.p * LB, 'u4m-price-way', 'Use price per lb = price per kg ÷ 2.2.']] }; }),
            sh.rows.map(function (rw, i) { var v = rw.toKg ? rw.p * KG : rw.p / KG; return '(' + String.fromCharCode(97 + i) + ') ' + t(D(rw.p) + (rw.toKg ? '\\times ' : '\\div ') + '2.2' + (same(rd(v, 2), v) ? '=' : '=' + N(rd(v, 4)) + '\\ldots\\approx ') + D(v)) + (rw.toKg ? ' per kg' : ' per lb'); }).join('<br>'), ['Price per kg = price per lb × 2.2.', 'Price per lb = price per kg ÷ 2.2.'], 'price table'); } }] },
      { num: '10', stem: function (sh) { return cap(sh.what) + ' costs ' + Dp(sh.a) + '/lb at Store A and ' + Dp(sh.b) + '/kg at Store B.'; },
        shared: function (r) { return find(function () { var a = r.int(899, 1599) / 100, b = q(rd(a * KG, 2) + r.pick([-1, 1]) * r.int(30, 150) / 100); return { what: r.pick(['salmon fillets', 'pork tenderloin', 'chicken wings', 'halibut']), a: a, b: b, w: r.pick([1.5, 2, 2.5, 0.75, 1.25]) }; }, function (s) { return !(s.a === 12.99 && s.b === 27.5) && !(s.a === 9.99); }, { what: 'salmon fillets', a: 12.49, b: 26.5, w: 2 }); },
        parts: [
          { id: '10ai', sub: 'a i', level: 'EMG', make: function (r, sh) { return priceKg('Change Store A’s price to a price per kilogram.', sh.a); } },
          { id: '10aii', sub: 'a ii', level: 'EMG', make: function (r, sh) { var A = rd(sh.a * KG, 2), aB = A < sh.b; return P.mc(r, 'Which store has the better price?', [
            { html: '<b>Store ' + (aB ? 'A' : 'B') + '</b>: ' + Dp(Math.min(A, sh.b)) + ' per kg is less than ' + Dp(Math.max(A, sh.b)) + ' per kg.', right: true },
            { html: '<b>Store ' + (aB ? 'B' : 'A') + '</b>: ' + Dp(Math.max(A, sh.b)) + ' per kg gives more for the money.', why: 'A higher price per kg means you pay <b>more</b> for the same amount.', code: 'higher' },
            { html: '<b>Store A</b>: ' + Dp(sh.a) + ' is a smaller number than ' + Dp(sh.b) + '.', why: 'Those prices are for different amounts (a pound and a kilogram). Compare both per kg.', code: 'u4m-bare' },
            { html: 'They cost about the same.', why: 'Change Store A’s price to a price per kg and compare: they differ by ' + Dp(Math.abs(A - sh.b)) + ' per kg.', code: 'u4m-same' }],
            'Store A per kg: ' + t(D(sh.a) + '\\times 2.2\\approx ' + D(A)) + '<br>Store B: ' + t(D(sh.b)) + ' per kg<br><b>Store ' + (aB ? 'A' : 'B') + '</b> has the better price (by ' + Dp(Math.abs(A - sh.b)) + ' per kg).', ['Compare both prices per kilogram.'], 'better store'); } },
          { id: '10b', sub: 'b', level: 'EMG', make: function (r, sh) { var A = sh.a * KG, aB = rd(A, 2) < sh.b, per = aB ? A : sh.b, ans = sh.w * per;
            return num('Rami buys ' + N(sh.w) + ' kg at the better store. How much does he pay?', ans, { money: true, exact: ans, alt: aB ? [sh.w * rd(A, 2), sh.w / LB * sh.a] : [], bad: [[sh.w * (aB ? sh.b : A), 'u4m-other-store', 'That’s the price at the other store. Use the better store from (a).'], [sh.w * sh.a, 'u4m-not-conv', 'He buys ' + N(sh.w) + ' <b>kg</b>, so use the price per kg.']],
              sol: t(N(sh.w) + '\\times ' + D(per) + (same(rd(ans, 2), ans) ? '=' : '\\approx ') + D(ans)), hints: ['Multiply the kilograms by the better price per kg.'], text: 'Rami pays' }); } }] },
      { num: '11', stem: '', parts: [{ id: '11', level: 'PRG', make: function (r) { var v = find(function () { return { c: r.int(129, 299) / 100, w: r.pick([1.5, 2, 2.5, 3, 0.75, 1.25]), nm: r.pick(['Hana', 'Owen', 'Sofia', 'Eli']), what: r.pick(['sliced turkey', 'black forest ham', 'roast beef', 'salami']) }; }, function (v) { return !(v.c === 1.89 && v.w === 2.5); }, { c: 1.79, w: 2, nm: 'Hana', what: 'sliced turkey' });
        var kg = v.w * LB, g = kg * 1000, h = g / 100, ans = h * v.c;
        return num('The ' + v.what + ' at the deli costs ' + Dp(v.c) + ' per 100 g. ' + v.nm + ' asks for ' + N(v.w) + ' lb. How much will it cost? (Hint: change to grams first.)', ans, { money: true, exact: ans, alt: [v.w / KG * 10 * v.c],
          bad: [[v.w * v.c, 'u4m-not-conv', 'The price is per 100 g, so change ' + N(v.w) + ' lb to grams first.'], [kg * v.c, 'u4m-not-conv', 'That uses kilograms. Change to grams (× 1000), then count the hundreds (÷ 100).'], [g * v.c, 'u4m-not-conv', 'The price is per <b>100</b> g: divide the grams by 100 first.'], [v.w * KG * 10 * v.c, 'u4m-wrong-fact', 'To change pounds to kilograms multiply by 0.454, not 2.2.']],
          sol: steps([t(N(v.w) + '\\times 0.454=' + N(q(kg))) + ' kg = ' + N(q(g)) + ' g = ' + N(q(h)) + ' hundreds', t(N(q(h)) + '\\times ' + D(v.c) + (same(rd(ans, 2), ans) ? '=' : '=' + N(rd(ans, 4)) + '\\approx ') + D(ans)), 'It will cost ' + t(D(ans)) + '.']), hints: ['1 lb ≈ 454 g.', 'How many 100 g are in that many grams?'], text: 'deli' }); } }] },
      { num: '12', stem: '', parts: [{ id: '12', level: 'ADV', make: function (r) { var v = find(function () { return { oz: r.pick([8, 10, 12, 16, 20, 24]), bag: r.pick([200, 250, 320, 340, 400]), lb: r.pick([1, 1.5, 2, 2.5, 3]), box: r.pick([450, 500, 700, 900]) }; }, function (v) { var c = v.oz * OZ / v.bag, m = v.lb * 454 / v.box; return c % 1 > 0.04 && c % 1 < 0.9 && m % 1 > 0.04 && m % 1 < 0.95 && c < 4 && m < 4 && !(v.oz === 12 && v.bag === 320 && v.lb === 1.5 && v.box === 900); }, { oz: 16, bag: 250, lb: 2, box: 500 });
        var cg = v.oz * OZ, mg = v.lb * 454, nc = Math.ceil(cg / v.bag), nm = Math.ceil(mg / v.box), who = r.pick(['Liam', 'Ana', 'Jayden', 'Rosa']);
        return boxes(who + ' is making a big batch of macaroni and cheese from an American recipe. It needs ' + v.oz + ' oz of shredded cheese and ' + N(v.lb) + ' lb of macaroni. In the store, cheese comes in ' + v.bag + ' g bags and macaroni in ' + v.box + ' g boxes. How many bags and boxes must ' + who + ' buy?', [
          { label: 'Bags of cheese:', name: 'Bags of cheese', ans: nc, dp: 0, count: 'up', bad: [[Math.floor(cg / v.bag), 'u4m-count-dir', 'That’s not quite enough cheese. Round <b>up</b>.'], [Math.ceil(v.oz * 30 / v.bag) === nc ? -99 : Math.ceil(v.oz * 30 / v.bag), 'u4m-est30', 'Use 28.35 g per ounce, not the 30 g estimate.']] },
          { label: 'Boxes of macaroni:', name: 'Boxes of macaroni', ans: nm, dp: 0, count: 'up', bad: [[Math.floor(mg / v.box), 'u4m-count-dir', 'That’s not quite enough macaroni. Round <b>up</b>.'], [Math.ceil(v.lb * KG * 1000 / v.box), 'u4m-wrong-fact', 'Pounds to grams: 1 lb ≈ 454 g (× 0.454 kg), not × 2.2.']] }],
          steps(['Cheese: ' + t(v.oz + '\\times 28.35=' + N(q(cg))) + ' g. ' + t(N(q(cg)) + '\\div ' + v.bag + '\\approx ' + N(rd(cg / v.bag, 2))) + ', so ' + nc + ' bag' + (nc > 1 ? 's' : '') + '.', 'Macaroni: ' + t(N(v.lb) + '\\times 0.454=' + N(q(mg / 1000))) + ' kg = ' + N(q(mg)) + ' g. ' + t(N(q(mg)) + '\\div ' + v.box + '\\approx ' + N(rd(mg / v.box, 2))) + ', so ' + nm + ' box' + (nm > 1 ? 'es' : '') + '.']), ['Change each amount to grams.', 'Round up: you need enough for the recipe.'], 'mac and cheese'); } }] },
      { num: '13', stem: function (sh) { return sh.nm + ' loads a ' + sh.bar + ' kg bar with two ' + sh.p1 + ' lb plates and two ' + sh.p2 + ' lb plates.'; },
        shared: function (r) { return find(function () { return { nm: r.pick(['Ella', 'Marcus', 'Tia', 'Jordan']), bar: r.pick([20, 20, 15]), p1: r.pick([45, 35, 25]), p2: r.pick([10, 5, 25]), goal: r.pick([60, 70, 80, 90, 100]) }; }, function (s) { var tl = s.bar * KG + 2 * s.p1 + 2 * s.p2; return s.p1 > s.p2 && s.goal * KG - tl > 5 && !(s.bar === 20 && s.p1 === 45 && s.p2 === 10 && s.goal === 80); }, { nm: 'Ella', bar: 20, p1: 35, p2: 10, goal: 70 }); },
        parts: [
          { id: '13a', level: 'EMG', make: function (r, sh) { var bl = q(sh.bar * KG), pl = 2 * sh.p1 + 2 * sh.p2, tl = q(bl + pl); return num('Find the total mass ' + sh.nm + ' is lifting, in pounds.', tl, { dp: 1, after: 'lb', alt: [sh.bar / LB + pl], bad: [[sh.bar + pl, 'u4m-not-conv', 'The bar is in <b>kilograms</b>: change it to pounds (× 2.2) before adding.'], [bl + sh.p1 + sh.p2, 'u4m-one', 'There are <b>two</b> of each plate.'], [sh.bar * LB + pl, 'u4m-wrong-fact', 'kg → lb: multiply by 2.2.']], sol: steps(['Bar: ' + t(sh.bar + '\\times 2.2=' + N(bl)) + ' lb', 'Plates: ' + t('2\\times ' + sh.p1 + '+2\\times ' + sh.p2 + '=' + pl) + ' lb', 'Total: ' + t(N(bl) + '+' + pl + '=' + N(tl)) + ' lb']), hints: ['Change the bar to pounds, then add all the plates (two of each).'], text: 'total lb' }); } },
          { id: '13b', level: 'PRG', make: function (r, sh) { var pl = 2 * sh.p1 + 2 * sh.p2, tk = sh.bar + pl * LB; return num('Find the total mass in kilograms, to the nearest tenth.', tk, { dp: 1, after: 'kg', alt: [(sh.bar * KG + pl) * LB, sh.bar + pl / KG], bad: [[sh.bar + pl, 'u4m-not-conv', 'The plates are in <b>pounds</b>: change them to kilograms (× 0.454) before adding.'], [sh.bar + pl * KG, 'u4m-wrong-fact', 'lb → kg: multiply by 0.454.']], sol: steps(['Plates: ' + t(pl + '\\times 0.454=' + N(q(pl * LB))) + ' kg', 'Total: ' + t(sh.bar + '+' + N(q(pl * LB)) + '=' + N(q(tk)) + '\\approx ' + N(rd(tk, 1), 1)) + ' kg']), hints: ['Change the plates to kilograms, then add the bar.'], text: 'total kg' }); } },
          { id: '13c', level: 'MAS', make: function (r, sh) { var tl = sh.bar * KG + 2 * sh.p1 + 2 * sh.p2, G = sh.goal * KG, ans = q(G - tl), tk = sh.bar + (2 * sh.p1 + 2 * sh.p2) * LB;
            return num(sh.nm + '’s goal is to lift ' + sh.goal + ' kg. About how many more pounds of plates does ' + (sh.nm === 'Marcus' || sh.nm === 'Jordan' ? 'he' : 'she') + ' need? (Nearest tenth.)', ans, { dp: 1, after: 'lb', tol: 0.6, alt: [(sh.goal - tk) * KG, (sh.goal - tk) / LB],
              bad: [[sh.goal - tk, 'u4m-not-conv', 'That’s the difference in <b>kilograms</b>. The question asks for pounds: change ' + sh.goal + ' kg to pounds first.'], [G, 'u4m-no-sub', 'That’s the goal in pounds. Subtract what is on the bar now.'], [sh.goal * LB - tl, 'u4m-wrong-fact', 'kg → lb: multiply by 2.2.']],
              sol: steps([t(sh.goal + '\\text{ kg}=' + sh.goal + '\\times 2.2=' + N(q(G))) + ' lb', t(N(q(G)) + '-' + N(q(tl)) + '=' + N(ans)) + ' lb', 'About ' + N(rd(ans, 1)) + ' lb more.']), hints: ['Change the goal to pounds.', 'Subtract the total from (a).'], text: 'more lb' }); } }] },
      { num: '14', stem: '', parts: [{ id: '14', level: 'BEG', make: function (r) { var m = pickX(r, [3, 4, 6, 7, 8, 9, 12, 15, 25], [5]);
        return P.mc(r, 'A mass of ' + m + ' kg is about', [{ html: N(q(m * 2.2)) + ' lb', right: true }, { html: N(rd(m * LB, 2)) + ' lb', why: 'That multiplies by 0.454, the lb → kg fact. A kilogram is more than 2 lb.', code: 'u4m-wrong-fact' }, { html: 2 * m + ' lb', why: 'Close: double it, then add 10% of that.', code: 'u4m-est-part' }, { html: N(m / 2) + ' lb', why: 'Halving is the lb → kg rule. There are more pounds than kilograms.', code: 'u4m-div-mult' }],
          t(m + '\\times 2.2=' + N(q(m * 2.2))) + ' lb', ['1 kg ≈ 2.2 lb.'], 'kg about'); } }] },
      { num: '15', stem: '', parts: [{ id: '15', level: 'EMG', make: function (r) { var p = find(function () { return r.int(22, 66) * 0.2; }, function (p) { p = q(p); return !same(p, 4.4) && !same(p * 2.2, p + 2.2 + 0); }, 4.6); p = q(p);
        return P.mc(r, cap(r.pick(['pork chops', 'chicken legs', 'stewing beef'])) + ' are on sale for ' + Dp(p) + '/lb. The price per kilogram is', [{ html: Dp(p * KG), right: true }, { html: Dp(p / KG), why: 'A kilogram is more meat than a pound, so it costs more: multiply by 2.2.', code: 'u4m-price-way' }, { html: Dp(2 * p), why: 'A kilogram is about 2.2 lb, not 2 lb.', code: 'u4m-est-part' }, { html: Dp(p + 2.2), why: 'Multiply by 2.2; don’t add it.', code: 'u4m-added' }],
          t(D(p) + '\\times 2.2=' + D(p * KG)) + ' per kg', ['Price per kg = price per lb × 2.2.'], 'price per kg'); } }] },
      { num: '16', stem: '', parts: [{ id: '16', level: 'PRG', make: function (r) {
        var o = find(function () { var T = r.pick([1, 2, 3]), a = { h: T + ' kg', g: 1000 * T }, b = { h: N(q(Math.round(2.2 * T * 2) / 2 + r.pick([-0.5, 0, 0.5]))) + ' lb' }; b.g = Number(b.h.split(' ')[0]) * 454; var oz = Math.round(35.27 * T) + r.int(-3, 3), c = { h: oz + ' oz', g: oz * OZ }, gg = 1000 * T + r.pick([-75, -50, 25, 50, 75]), d = { h: N(gg) + ' g', g: gg }; return [a, b, c, d]; },
          function (o) { var gs = o.map(function (x) { return x.g; }).sort(function (x, y) { return y - x; }); return gs[0] - gs[1] >= 10 && o.every(function (x) { return Math.abs(x.g - o[0].g) / o[0].g < 0.06; }); }, [{ h: '2 kg', g: 2000 }, { h: '4.5 lb', g: 2043 }, { h: '70 oz', g: 1984.5 }, { h: '1950 g', g: 1950 }]);
        var mx = o.reduce(function (b, x, i) { return x.g > o[b].g ? i : b; }, 0);
        return P.mc(r, 'Which mass is the greatest?', o.map(function (x, i) { return { html: x.h, right: i === mx, why: i === mx ? null : 'Change all four to grams and compare. ' + x.h + ' is about ' + N(rd(x.g, 1)) + ' g.', code: 'm' + i }; }),
          'In grams: ' + o.map(function (x) { return / g$/.test(x.h) ? x.h : x.h + ' ≈ ' + N(rd(x.g, 1)) + ' g'; }).join('; ') + '.<br>The greatest is <b>' + o[mx].h + '</b>.', ['Change every mass to grams (1 lb ≈ 454 g, 1 oz ≈ 28.35 g, 1 kg = 1000 g).'], 'greatest', true); } }] },
      { num: '17', stem: '', parts: [{ id: '17', level: 'EMG', make: function (r) { var v = find(function () { return [r.int(1, 6), r.pick([2, 4, 6, 10, 12, 14])]; }, function (v) { return far((v[0] + v[1] / 16) * LB, 2, 0.1) && !(v[0] === 3 && v[1] === 12); }, [2, 12]);
        return lbOzToKg('<b>Numerical response.</b> A bag of ' + r.pick(['flour', 'sugar', 'rice']) + ' has a mass of ' + v[0] + ' lb ' + v[1] + ' oz. Its mass in kilograms, to the nearest hundredth, is ___ kg.', v[0], v[1], 2, { nr: true }); } }] }
    ],
    extra: [
      { num: '1', section: 'A. Skills', stem: 'Which mass is heavier in each pair?', parts: [
        { id: 'x1a', level: 'BEG', make: function (r) { return heavier(r, pKgLb(r, [[1, 1], [2, 4]])); } },
        { id: 'x1b', level: 'BEG', make: function (r) { return heavier(r, pOzG(r, [[1, 25], [8, 250]])); } },
        { id: 'x1c', level: 'EMG', make: function (r) { return heavier(r, pTLb(r)); } },
        { id: 'x1d', level: 'EMG', make: function (r) { return heavier(r, pLbKg(r)); } }] },
      { num: '2', stem: 'Estimate in your head. Which thinking is right?', parts: [
        { id: 'x2a', level: 'BEG', make: function (r) { var x = pickX(r, [10, 15, 25, 35, 45], [20, 30]); return estMC(r, 'A ' + x + ' kg bag of dog food, in pounds.', 'kg-lb', x); } },
        { id: 'x2b', level: 'BEG', make: function (r) { var x = pickX(r, [80, 90, 100, 110, 130], [120, 160]); return estMC(r, 'A ' + x + ' lb teenager, in kilograms.', 'lb-kg', x); } },
        { id: 'x2c', level: 'BEG', make: function (r) { var x = pickX(r, [2, 3, 4, 7], [5, 6]); return estMC(r, 'A ' + x + ' oz granola bar, in grams.', 'oz-g', x); } }] },
      convQ('3', 'x3', [['lb-kg', function (r) { return pickX(r, [16, 24, 32, 38, 44], [25]); }, 1, 'BEG'], ['kg-lb', function (r) { return pickX(r, [12, 18, 27, 34], [68]); }, 1, 'BEG'], ['oz-g', function (r) { return pickX(r, [3, 5, 7, 11], [12]); }, 1, 'BEG'], ['ton-t', function (r) { return pickX(r, [4, 6, 9, 14], [3]); }, 1, 'BEG']]),
      { num: '4', stem: '', parts: [
        { id: 'x4a', level: 'EMG', make: function (r) { var v = find(function () { return [r.int(3, 14), r.pick([2, 3, 5, 6, 9, 10, 11, 13])]; }, function (v) { return far((v[0] + v[1] / 16) * LB, 2, 0.08); }, [5, 10]); return lbOzToKg('A turkey has a mass of ' + v[0] + ' lb ' + v[1] + ' oz. Find its mass in kilograms, to the nearest hundredth.', v[0], v[1], 2); } },
        { id: 'x4b', level: 'PRG', make: function (r) { var m = find(function () { return q(r.int(8, 40) / 4); }, function (m) { return m !== 9 && kgLbOzOk(m); }, 2.5); return kgToLbOzPart('A ' + N(m) + ' kg bag of rice. Find its mass in pounds and ounces, to the nearest ounce.', m); } }] },
      { num: '5', stem: 'Change each price. Round to the nearest cent.', parts: [
        { id: 'x5a', level: 'EMG', make: function (r) { var p = find(function () { return r.int(399, 899) / 100; }, function (p) { return [5.49].indexOf(p) < 0; }, 6.99); return priceKg(cap(r.pick(['pork side ribs', 'beef brisket', 'chicken drumsticks'])) + ' at ' + Dp(p) + '/lb, to a price per kilogram.', p); } },
        { id: 'x5b', level: 'EMG', make: function (r) { var p = find(function () { return r.int(880, 2200) / 100; }, function (p) { return far(p / KG, 2, 0.06) && p !== 14.3; }, 17.6); return priceLb(cap(r.pick(['lean ground turkey', 'stewing beef', 'pork shoulder'])) + ' at ' + Dp(p) + '/kg, to a price per pound.', p); } }] },
      { num: '6', section: 'B. Applying', stem: function (sh) { return 'A sign at a small bridge says “Maximum ' + sh.L + ' t”. A loaded ' + sh.what + ' has a mass of ' + sh.n + ' tons.'; },
        shared: function (r) { return find(function () { var L = r.pick([8, 10, 12, 15]); return { L: L, n: L + r.pick([-1, 1, 2, 3]), what: r.pick(['gravel truck', 'cattle truck', 'fuel truck']) }; }, function (s) { return Math.abs(s.n * TON - s.L) >= 0.1 && !(s.L === 12 && s.n === 14); }, { L: 10, n: 11 }); },
        parts: [
          { id: 'x6a', level: 'EMG', make: function (r, sh) { return cvPart('Find the truck’s mass in tonnes, to the nearest tenth.', 'ton-t', sh.n, 1); } },
          { id: 'x6b', level: 'EMG', make: function (r, sh) { var m = sh.n * TON, yes = m < sh.L; return P.mc(r, 'Can it cross the bridge?', [{ html: (yes ? '<b>Yes</b>: ' : '<b>No</b>: ') + sh.n + ' tons ≈ ' + N(rd(m, 1), 1) + ' t, ' + (yes ? 'less' : 'more') + ' than ' + sh.L + ' t.', right: true },
            { html: (yes ? '<b>No</b>: ' + sh.n + ' is more than ' + sh.L + '.' : '<b>Yes</b>: a ton is lighter than a tonne, so it is always fine.'), why: yes ? 'Tons and tonnes are different units. Compare in tonnes.' : 'A ton is a bit lighter, but ' + sh.n + ' tons is still about ' + N(rd(m, 1), 1) + ' t.', code: 'u4m-bare' },
            { html: (yes ? '<b>No</b>: ' : '<b>Yes</b>: ') + sh.n + ' tons ≈ ' + N(rd(sh.n / TON, 1), 1) + ' t.', why: 'Tons to tonnes: multiply by 0.907 (a ton is a bit less than a tonne).', code: 'u4m-div-mult' }],
            t(sh.n + '\\times 0.907=' + N(q(m))) + ' t. ' + (yes ? 'That is less than ' + sh.L + ' t, so it <b>can</b> cross.' : 'That is more than ' + sh.L + ' t, so it <b>cannot</b> cross.'), ['Use your answer from (a).'], 'bridge'); } }] },
      { num: '7', stem: function (sh) { return sh.nm + '’s ' + sh.what + ' weighs ' + sh.lb + ' lb on her scale. The airline’s limit for a checked bag is 23 kg.'; },
        shared: function (r) { return find(function () { return { nm: r.pick(['Kiara', 'Maya', 'Zara']), what: r.pick(['hockey bag', 'suitcase', 'duffel bag']), lb: r.int(32, 47) }; }, function (s) { return s.lb !== 41 && rd(23 - s.lb * LB, 1) === rd(23 - rd(s.lb * LB, 1), 1); }, { nm: 'Kiara', what: 'hockey bag', lb: 40 }); },
        parts: [
          { id: 'x7a', level: 'EMG', make: function (r, sh) { return cvPart('Find the mass of the bag in kilograms, to the nearest tenth. (Is it under the limit?)', 'lb-kg', sh.lb, 1); } },
          { id: 'x7b', level: 'EMG', make: function (r, sh) { var m = sh.lb * LB, ans = 23 - m; return num('About how many more kilograms could she pack in it? (Nearest tenth.)', ans, { dp: 1, after: 'kg', alt: [23 - rd(m, 1), 23 - sh.lb / KG], bad: [[m, 'u4m-no-sub', 'That’s the bag’s mass. Subtract it from 23 kg.'], [50.6 - sh.lb, 'u4m-not-conv', 'That’s in pounds. The question asks for kilograms.']], sol: t('23-' + N(q(m)) + '=' + N(q(ans)) + '\\approx ' + N(rd(ans, 1), 1)) + ' kg more', hints: ['Limit − mass of the bag.'], text: 'room left' }); } }] },
      { num: '8', stem: '', parts: [{ id: 'x8', level: 'EMG', make: function (r) { var v = find(function () { return { oz: r.pick([4, 6, 8, 10, 12, 16]), bar: r.pick([100, 100, 90, 150]) }; }, function (v) { var x = v.oz * OZ / v.bar; return x % 1 > 0.05 && x % 1 < 0.95 && x < 6; }, { oz: 8, bar: 100 }); var g = v.oz * OZ, n = Math.ceil(g / v.bar);
        return num('A brownie recipe from a US website needs ' + v.oz + ' oz of dark chocolate. The chocolate at Sofia’s store comes in ' + v.bar + ' g bars. How many bars must she buy?', n, { dp: 0, count: 'up', after: 'bars', bad: [[Math.ceil(v.oz * 30 / v.bar) === n ? -99 : Math.ceil(v.oz * 30 / v.bar), 'u4m-est30', 'Use 1 oz ≈ 28.35 g, not the 30 g estimate.']], sol: steps([t(v.oz + '\\times 28.35=' + N(q(g))) + ' g', t(N(q(g)) + '\\div ' + v.bar + '\\approx ' + N(rd(g / v.bar, 2))) + '. ' + (n - 1) + ' bars are only ' + (n - 1) * v.bar + ' g, so she must buy ' + n + ' bars.']), hints: ['Change the ounces to grams.', 'Round up: she needs enough chocolate.'], text: 'bars' }); } }] },
      { num: '9', stem: function (sh) { return cap(sh.what) + ' cost ' + Dp(sh.a) + '/lb at one store and ' + Dp(sh.b) + '/kg at another.'; },
        shared: function (r) { return find(function () { var a = r.int(149, 399) / 100; return { what: r.pick(['red grapes', 'cherries', 'green beans', 'peaches']), a: a, b: q(rd(a * KG, 2) + r.pick([-1, 1]) * r.int(12, 60) / 100) }; }, function (s) { return !(s.a === 2.49 && s.b === 5.29); }, { what: 'red grapes', a: 2.29, b: 5.29 }); },
        parts: [
          { id: 'x9a', level: 'EMG', make: function (r, sh) { return priceKg('Change the first store’s price to a price per kilogram.', sh.a); } },
          { id: 'x9b', level: 'EMG', make: function (r, sh) { var A = rd(sh.a * KG, 2), first = A < sh.b; return P.mc(r, 'Which store has the better price?', [{ html: 'The store selling them at ' + (first ? Dp(sh.a) + '/lb' : Dp(sh.b) + '/kg') + ': ' + Dp(Math.min(A, sh.b)) + ' per kg is less than ' + Dp(Math.max(A, sh.b)) + ' per kg.', right: true },
            { html: 'The store selling them at ' + (first ? Dp(sh.b) + '/kg' : Dp(sh.a) + '/lb') + ': it costs ' + Dp(Math.max(A, sh.b)) + ' per kg.', why: 'The <b>lower</b> price per kg is the better price.', code: 'higher' },
            { html: 'The store selling them at ' + Dp(sh.a) + '/lb: ' + Dp(sh.a) + ' is a smaller number than ' + Dp(sh.b) + '.', why: 'One price is per pound and the other per kilogram. Compare both per kg.', code: 'u4m-bare' }].filter(function (o, i, arr) { return i < 2 || o.html !== arr[0].html; }),
            t(D(sh.a) + '\\times 2.2\\approx ' + D(A)) + ' per kg, ' + (first ? 'less' : 'more') + ' than ' + Dp(sh.b) + ' per kg.<br>The store selling them at ' + (first ? Dp(sh.a) + '/lb' : Dp(sh.b) + '/kg') + ' has the better price.', ['Compare both prices per kg.'], 'grapes'); } }] },
      { num: '10', stem: '', parts: [{ id: 'x10', level: 'PRG', make: function (r) { var v = find(function () { return { b: r.int(60, 100), k: r.int(15, 30) * 10 }; }, function (v) { var x = v.k / (v.b * LB); return x % 1 > 0.12 && x % 1 < 0.88 && !(v.b === 85 && v.k === 230); }, { b: 80, k: 200 }); var bk = v.b * LB, x = v.k / bk;
        return num('A calf was born at ' + v.b + ' lb. Six months later it has a mass of ' + v.k + ' kg. About how many times as heavy is it now? (Round to the nearest whole number.)', x, { dp: 0, after: 'times', alt: [v.k / (v.b / KG)], bad: [[v.k / v.b, 'u4m-not-conv', 'The two masses are in different units. Change ' + v.b + ' lb to kilograms first.'], [v.k / (v.b * KG), 'u4m-wrong-fact', 'lb → kg: multiply by 0.454.']],
          sol: steps(['At birth: ' + t(v.b + '\\times 0.454=' + N(q(bk))) + ' kg', t(v.k + '\\div ' + N(q(bk)) + '=' + N(rd(x, 2)) + '\\ldots') + '. It is about ' + Math.round(x) + ' times as heavy now.']), hints: ['Change the birth mass to kilograms.', 'How many times? Divide the new mass by the old mass.'], text: 'times heavier' }); } }] },
      { num: '11', stem: '', parts: [{ id: 'x11', level: 'BEG', make: function (r) { var g = r.pick([200, 250, 300, 340, 400, 500]), what = r.pick(['package of butter', 'block of cheese', 'bag of coffee']);
        return P.mc(r, 'A ' + g + ' g ' + what + ' has a mass of about', [{ html: N(rd(g / OZ, 1)) + ' oz', right: true }, { html: N(rd(g * OZ, 1)) + ' oz', why: 'An ounce is much bigger than a gram, so the number of ounces is smaller: divide by 28.35.', code: 'u4m-div-mult' }, { html: N(rd(g * 0.0022, 2)) + ' oz', why: 'That changes grams to <b>pounds</b> (÷ 1000 × 2.2). The question asks for ounces.', code: 'u4m-wrong-fact' }, { html: N(rd(g * LB, 1)) + ' oz', why: '0.454 is for pounds → kilograms. Use 1 oz ≈ 28.35 g.', code: 'u4m-wrong-fact' }],
          t(g + '\\div 28.35\\approx ' + N(rd(g / OZ, 1))) + ' oz', ['1 oz ≈ 28.35 g.'], 'butter oz'); } }] },
      { num: '12', stem: '', parts: [{ id: 'x12', level: 'EMG', make: function (r) { var v = find(function () { return { c: r.int(99, 219) / 100, n: r.pick([1, 1, 2]) }; }, function (v) { return v.n * 4.54 * v.c < 9.995 && far(v.n * 4.54 * v.c, 2, 0.05) && !(v.c === 1.65 && v.n === 1); }, { c: 1.49, n: 1 }); var h = v.n * 4.54, ans = h * v.c, what = r.pick(['cashews', 'almonds', 'trail mix', 'pecans']);
        return num('<b>Numerical response.</b> Bulk ' + what + ' cost ' + Dp(v.c) + ' per 100 g. The cost of ' + v.n + ' lb of ' + what + ', to the nearest cent, is $___.', ans, { money: true, exact: ans, nr: true, bad: [[v.n * v.c, 'u4m-not-conv', 'The price is per 100 g. Change ' + v.n + ' lb to grams first (1 lb ≈ 454 g).'], [v.n * LB * v.c, 'u4m-not-conv', 'Change to grams (454 g per lb), then count the hundreds.']],
          sol: steps([v.n + ' lb ≈ ' + t(N(q(v.n * 454))) + ' g = ' + N(q(h)) + ' hundreds', t(N(q(h)) + '\\times ' + D(v.c) + '=' + N(rd(ans, 4)) + '\\approx ' + D(ans))]), hints: ['1 lb ≈ 454 g.', 'How many 100 g are in that?'], text: 'bulk nuts' }); } }] },
      { num: '13', section: 'C. Stretch', stem: function (sh) { return 'A small business needs to ship a ' + sh.W + ' kg pallet. A US courier quotes ' + Dp(sh.a) + ' per pound. A Canadian courier quotes ' + Dp(sh.b) + ' per kilogram. Use 1 kg ≈ 2.2 lb.'; },
        shared: function (r) { return find(function () { var W = r.pick([80, 90, 110, 120, 150, 180, 200]), a = r.int(60, 110) / 100; return { W: W, a: a, b: q(rd(a * KG, 2) + r.pick([-1, 1]) * r.int(4, 20) / 100) }; }, function (s) { return !(s.W === 120 && s.a === 0.85); }, { W: 150, a: 0.8, b: 1.85 }); },
        parts: [
          { id: 'x13a', level: 'ADV', make: function (r, sh) { var us = sh.W * KG * sh.a, ca = sh.W * sh.b; return boxes('Find the cost with each courier.', [{ label: 'US courier:', name: 'US courier', ans: us, money: true, bad: [[sh.W * sh.a, 'u4m-not-conv', 'The US price is per <b>pound</b>: change ' + sh.W + ' kg to pounds first.'], [sh.W * LB * sh.a, 'u4m-wrong-fact', 'kg → lb: multiply by 2.2.']] }, { label: 'Canadian courier:', name: 'Canadian courier', ans: ca, money: true }],
            'US: ' + t(sh.W + '\\times 2.2=' + N(q(sh.W * KG))) + ' lb; ' + t(N(q(sh.W * KG)) + '\\times ' + D(sh.a) + '=' + D(us)) + '<br>Canadian: ' + t(sh.W + '\\times ' + D(sh.b) + '=' + D(ca)), ['Change the mass to pounds for the US price.'], 'couriers'); } },
          { id: 'x13b', level: 'PRG', make: function (r, sh) { var us = rd(sh.W * KG * sh.a, 2), ca = rd(sh.W * sh.b, 2), usC = us < ca;
            return P.mc(r, 'Which courier is cheaper?', [{ html: 'The <b>' + (usC ? 'US' : 'Canadian') + '</b> courier: ' + Dp(Math.min(us, ca)) + ' is less than ' + Dp(Math.max(us, ca)) + '.', right: true },
              { html: 'The <b>' + (usC ? 'Canadian' : 'US') + '</b> courier: its total is ' + Dp(Math.max(us, ca)) + '.', why: 'The cheaper courier is the one with the <b>smaller</b> total.', code: 'higher' },
              { html: 'The <b>US</b> courier: ' + Dp(sh.a) + ' is less than ' + Dp(sh.b) + '.', why: 'One price is per pound and the other per kilogram, so compare the totals for the whole pallet.', code: 'u4m-bare' }],
              'US: ' + t(D(us)) + '; Canadian: ' + t(D(ca)) + '. The <b>' + (usC ? 'US' : 'Canadian') + '</b> courier is cheaper.', ['Compare the two totals from (a).'], 'cheaper courier'); } },
          { id: 'x13c', level: 'MAS', make: function (r, sh) { var us = rd(sh.W * KG * sh.a, 2), ca = rd(sh.W * sh.b, 2), d = Math.abs(us - ca), cheaper = us < ca ? 'US' : 'Canadian';
            return num('By how much is the cheaper courier cheaper?', d, { money: true, bad: [[Math.abs(sh.a * KG - sh.b), 'u4m-one', 'That’s the difference per kilogram. Find the difference in the <b>total</b> costs.'], [Math.abs(sh.W * sh.a - ca), 'u4m-not-conv', 'Change ' + sh.W + ' kg to pounds before using the US price.']], sol: steps(['US: ' + t(D(us)) + '; Canadian: ' + t(D(ca)), 'The ' + cheaper + ' courier is cheaper, by ' + t(D(Math.max(us, ca)) + '-' + D(Math.min(us, ca)) + '=' + D(d)) + '.']), hints: ['Use your two costs from (a).', 'Subtract the smaller from the bigger.'], text: 'courier diff' }); } }] },
      { num: '14', stem: function (sh) { return 'Owen changes ' + sh.m + ' kg to pounds two ways: with 1 kg ≈ 2.2 lb, and by dividing by 0.454 (because 1 lb ≈ 0.454 kg).'; },
        shared: function (r) { return { m: r.pick([50, 80, 100, 150, 200, 250]) }; },
        parts: [
          { id: 'x14a', level: 'EMG', make: function (r, sh) { return boxes('Find both answers, to the nearest hundredth.', [{ label: '× 2.2:', name: '× 2.2', ans: sh.m * KG, dp: 2, after: 'lb' }, { label: '÷ 0.454:', name: '÷ 0.454', ans: sh.m / LB, dp: 2, after: 'lb', bad: [[sh.m * LB, 'u4m-div-mult', 'Divide by 0.454; don’t multiply.']] }], t(sh.m + '\\times 2.2=' + N(q(sh.m * KG), 2)) + ' lb<br>' + t(sh.m + '\\div 0.454=' + N(rd(sh.m / LB, 4)) + '\\ldots\\approx ' + N(rd(sh.m / LB, 2), 2)) + ' lb', ['Do each on your calculator.'], 'two ways'); } },
          { id: 'x14b', level: 'PRG', make: function (r) { return P.mc(r, 'Why are the answers different? Does the difference matter for an airline bag limit of 23 kg?', [
            { html: 'Both facts are rounded (1 kg is really about 2.2046 lb), so they give slightly different answers. For 23 kg the two answers (50.6 lb and about 50.66 lb) differ by less than 0.1 lb, so it doesn’t matter.', right: true },
            { html: 'One of the facts is wrong, so only one answer can be right.', why: 'Both facts are fine: they are just rounded in different ways.', code: 'fact-wrong' },
            { html: 'Dividing always gives a bigger answer than multiplying, so the ÷ 0.454 answer is the right one.', why: 'Neither is “the right one”: both use rounded facts.', code: 'divide' },
            { html: 'Both facts are rounded, and for a 23 kg bag the difference is big enough that the bag could be refused.', why: 'Work it out: ' + t('23\\times 2.2=50.6') + ' and ' + t('23\\div 0.454\\approx 50.66') + '. That’s less than 0.1 lb apart.', code: 'matters' }],
            'Both facts are rounded (1 kg ≈ 2.2046 lb), so they give slightly different answers.<br>For 23 kg: ' + t('23\\times 2.2=50.6') + ' lb and ' + t('23\\div 0.454\\approx 50.66') + ' lb. The difference is under 0.1 lb, so it does not matter for packing a bag.', ['Try both ways with 23 kg.'], 'why differ'); } }] }
    ]
  });
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  U.cap = cap; U.MEATS = MEATS; U.PRODUCE = PRODUCE; U.pickX = pickX; U.convQ = convQ; U.cvBad = cvBad; U.CV = CV;
})(window);
