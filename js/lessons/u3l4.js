/* Math 10-3 · Unit 3 · Lesson 4 — Converting Length Within SI and Within Imperial (M1 SI parts · M2 imperial parts · M3 length problems)
 * Assignment 4 (u3_l04.tex, Questions 1–18) and the Lesson 4 Extra Practice (u3_ep04.tex, A 1–4, B 5–11, C 12–14).
 * Every part is a generator: the same kind of conversion as the booklet item (a 3-step or 5-step jump on the staircase, a
 * tiny answer like 0.006 m, decimal feet that need rounding, a sum that needs regrouping, a subtraction that needs a
 * borrow, a cut count that rounds down and a board count that rounds up…) with new numbers around the booklet's (the
 * lesson's worked-example numbers are left out). Calculator allowed. Facts as the booklet gives them: each SI step ×/÷ 10;
 * 12 in = 1 ft, 3 ft = 1 yd, 36 in = 1 yd, 5280 ft = 1 mi, 1760 yd = 1 mi.
 * Answers: numbers ("35 000", "35,000" and "35000" all work; a unit typed after the number is ignored); decimal feet to
 * the nearest hundredth (too many decimals gets a nudge, rounding the wrong way is wrong with a hint); money to the cent.
 * Feet-and-inches answers are two boxes (ft, in), the inches as a mixed number where fractions occur; the right length
 * with 12 in or more, decimal feet in the feet box, or the whole length in the inches box gets a nudge (no try used).
 * Recognised wrong values each get their own hint: multiplying instead of dividing (or the reverse), one step too few or
 * too many on the staircase, 10 in to a foot, 12 instead of 36 for yards to inches, 1760 instead of 5280, reading the
 * decimal part of a foot as inches (5.6 ft → 5′6″), truncating instead of rounding the inches, not carrying the foot,
 * trading or borrowing 10 in, subtracting the smaller inches from the larger, forgetting the extra inch from the
 * fractions, rounding a piece count up or a board count down, joining leftovers, leaving a length in the wrong unit.
 * Conversions: "<, > or =" → a table of choices; "what mistake did she make / is Leo right / will they fit / is it
 * enough for one more piece" → multiple choice whose options are reasons (one right), with the numbers as boxes; "list
 * from shortest to tallest" → the ordering input; two-answer items (pieces and leftover, boards and cost, ft, yd and mi)
 * → labelled boxes. Needs HW.u3tape from u3l3.js (loaded first). Levels: LIM BEG EMG PRG ADV MAS. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, T3 = HW.u3tape;
  if (!T3 || !T3.ftinPart) throw new Error('u3l4.js needs HW.u3tape from u3l3.js (load u3l3.js first)');
  var q = T3.q, rd = T3.rd, same = T3.same, nS = T3.nS, N = T3.N, Np = T3.Np, decs = T3.decs, D = T3.D, Dp = T3.Dp, find = T3.find, cap = T3.cap, br = T3.br, gcd = T3.gcd,
    num = T3.num, fld = T3.fld, prep = T3.prep, mix = T3.mix, frT = T3.frT, inT = T3.inT, inU = T3.inU, inPl = T3.inPl, ftin = T3.ftin, ftinT = T3.ftinT, inChk = T3.inChk, inPart = T3.inPart,
    ftinChk = T3.ftinChk, ftinFields = T3.ftinFields, ftinKey = T3.ftinKey, ftinPart = T3.ftinPart, multi = T3.multi, cleanS = T3.cleanS, NAMES = T3.NAMES, table = T3.table;
  function pick(r, a) { return r.pick(a); }
  function fN(x) { return HW.fmt(nS(x), true); }                       // plain text with a thin space for 10 000+
  function sx(x) { return Math.round(x * 16); }                         // inches → sixteenths

  /* ================= SI: the staircase ================= */
  var SI = { km: 3, hm: 2, dam: 1, m: 0, dm: -1, cm: -2, mm: -3 };
  function shift(v, e) { return e >= 0 ? q(v * Math.pow(10, e)) : q(v / Math.pow(10, -e)); }
  function siPart(v, from, to, o) {
    o = o || {};
    var e = SI[from] - SI[to], n = Math.abs(e), f = Math.pow(10, n), ans = shift(v, e), down = e > 0;
    var bad = [[shift(v, -e), 'u3l4-si-dir', down ? to + ' is a <b>smaller</b> unit than ' + from + ', so the number must get <b>bigger</b>: multiply.' : to + ' is a <b>bigger</b> unit than ' + from + ', so the number must get <b>smaller</b>: divide.'],
      [shift(ans, 1), 'u3l4-si-steps', 'Count the steps on the staircase: ' + from + ' to ' + to + ' is ' + n + ' step' + (n === 1 ? '' : 's') + ', so ' + (down ? '×' : '÷') + ' ' + fN(f) + '.'],
      [shift(ans, -1), 'u3l4-si-steps', 'Count the steps on the staircase: ' + from + ' to ' + to + ' is ' + n + ' step' + (n === 1 ? '' : 's') + ', so ' + (down ? '×' : '÷') + ' ' + fN(f) + '.'],
      n >= 2 ? [shift(ans, 2), 'u3l4-si-steps', 'Count every step, even hm, dam and dm: ' + from + ' to ' + to + ' is ' + n + ' steps.'] : null,
      n >= 2 ? [shift(ans, -2), 'u3l4-si-steps', 'Count every step, even hm, dam and dm: ' + from + ' to ' + to + ' is ' + n + ' steps.'] : null];
    return num(o.prompt || (o.lab ? o.lab + ' ' : '') + N(v) + ' ' + from + ' to ' + to, ans, { after: to, bad: bad,
      sol: (down ? 'Down ' : 'Up ') + n + ' step' + (n === 1 ? '' : 's') + ': ' + t(N(v) + (down ? '\\times ' : '\\div ') + N(f) + '=' + N(ans)) + ' ' + to,
      hints: ['Is ' + to + ' bigger or smaller than ' + from + '? Smaller unit → bigger number (multiply).', 'Count the steps from ' + from + ' to ' + to + ': each step is ×10 or ÷10.'], text: o.text || from + ' to ' + to });
  }
  function siCmp(v, u) { return shift(v, SI[u]); }      // in metres

  /* ================= imperial: in, ft, yd, mi ================= */
  var IMP = { 'in': 1, ft: 12, yd: 36, mi: 63360 };
  var WFAC = { 'in-ft': [[10, 'u3l4-ten', '1 ft = <b>12</b> in, not 10.']], 'in-yd': [[12, 'u3l4-yd12', '1 yd = 36 in (3 ft × 12 in), not 12.'], [3, 'u3l4-yd3', '1 yd = 3 <b>ft</b> = 36 in. You are changing inches.']], 'ft-yd': [[12, 'u3l4-wrong-fact', '1 yd = <b>3</b> ft.']], 'ft-mi': [[1760, 'u3l4-1760', '1760 is the number of <b>yards</b> in a mile. 1 mi = 5280 ft.']], 'yd-mi': [[5280, 'u3l4-5280', '5280 is the number of <b>feet</b> in a mile. 1 mi = 1760 yd.']] };
  function impPart(v, from, to, o) {
    o = o || {};
    var big = IMP[from] > IMP[to], f = big ? IMP[from] / IMP[to] : IMP[to] / IMP[from], ans = big ? q(v * f) : q(v / f), key = [from, to].sort(function (a, b) { return IMP[a] - IMP[b]; }).join('-');
    var bad = [[big ? v / f : v * f, 'u3l4-imp-dir', big ? 'You are changing to a <b>smaller</b> unit, so the number gets bigger: multiply by ' + fN(f) + '.' : 'You are changing to a <b>bigger</b> unit, so the number gets smaller: divide by ' + fN(f) + '.']];
    (WFAC[key] || []).forEach(function (w) { bad.push([big ? v * w[0] : v / w[0], w[1], w[2]]); });
    return num(o.prompt || (o.lab ? o.lab + ' ' : '') + N(v) + ' ' + from + ' to ' + to, ans, { after: to, bad: bad,
      sol: (big ? 'To a smaller unit: multiply. ' : 'To a bigger unit: divide. ') + t(N(v) + (big ? '\\times ' : '\\div ') + N(f) + '=' + N(ans)) + ' ' + to + (key === 'in-yd' && big ? ' (or ' + t(N(v) + '\\times 3\\times 12') + ')' : ''),
      hints: ['12 in = 1 ft, 3 ft = 1 yd, 36 in = 1 yd, 5280 ft = 1 mi, 1760 yd = 1 mi.', 'Bigger unit → smaller unit: multiply. Smaller → bigger: divide.'], text: o.text || from + ' to ' + to });
  }

  /* ================= feet and inches (sixteenths) ================= */
  function rawT(F, I) { return F + "'\\," + inT(I) + "''"; }        // feet and (maybe 12+) inches, I in sixteenths
  function fr(k) { var g = gcd(k, 16) || 16; return frT(k / g, 16 / g); }
  function den(k) { return 16 / (gcd(k, 16) || 16); }
  function fracSum(ks) {      // fractions (sixteenths, < 16 each) added, with a common denominator line
    ks = ks.filter(function (k) { return k; }); if (ks.length < 2) return null;
    var L = ks.reduce(function (m, k) { var d = den(k); return m * d / gcd(m, d); }, 1), s = ks.reduce(function (a, b) { return a + b; }, 0);
    var same1 = ks.every(function (k) { return den(k) === L; });
    return t(ks.map(fr).join('+') + (same1 ? '' : '=' + ks.map(function (k) { return frT(k * L / 16, L); }).join('+')) + '=' + (s % 16 ? (Math.floor(s / 16) ? Math.floor(s / 16) : '') + frT(s % 16 * L / 16, L) + (gcd(s % 16 * L / 16, L) > 1 ? '=' + inT(s) : '') : inT(s)));
  }
  function addSol(list) {
    var F = 0, I = 0, tot = 0, lines = [];
    list.forEach(function (S) { var a = ftin(S); F += a[0]; I += a[1]; tot += S; });
    var fs = fracSum(list.map(function (S) { return ftin(S)[1] % 16; })); if (fs) lines.push('Fractions: ' + fs);
    lines.push(t(list.map(ftinT).join('+') + '=' + rawT(F, I)));
    if (I >= 192) { lines.push(t(inT(I) + "''=" + ftinT(I))); lines.push(t('=' + ftinT(tot))); }
    return br(lines);
  }
  function subSolF(A, B) {
    var a = ftin(A), b = ftin(B), lines = [];
    if (a[1] < b[1]) { lines.push('Borrow 1 ft: ' + t(ftinT(A) + '=' + rawT(a[0] - 1, a[1] + 192))); lines.push(t(rawT(a[0] - 1, a[1] + 192) + '-' + ftinT(B) + '=' + ftinT(A - B))); }
    else lines.push(t(ftinT(A) + '-' + ftinT(B) + '=' + ftinT(A - B)));
    if ((a[1] % 16 || b[1] % 16) && (a[1] < b[1] ? a[1] + 192 : a[1]) % 16 < b[1] % 16) lines.splice(lines.length - 1, 0, 'Inches: ' + t(inT(a[1] < b[1] ? a[1] + 192 : a[1]) + '-' + inT(b[1]) + '=' + inT((a[1] < b[1] ? a[1] + 192 : a[1]) - b[1])) + ' (borrow 1 in as ' + t('\\frac{' + den(b[1] % 16) + '}{' + den(b[1] % 16) + '}') + ')');
    return br(lines);
  }
  function mulSol(k, A) {
    var a = ftin(A), lines = [t(k + '\\times ' + ftinT(A) + '=' + rawT(k * a[0], k * a[1]))];
    if (k * a[1] >= 192) { lines.push(t(inT(k * a[1]) + "''=" + ftinT(k * a[1]))); lines.push(t('=' + ftinT(k * A))); }
    return br(lines);
  }
  function addBad(list) {
    var tot = list.reduce(function (s, x) { return s + x; }, 0), I = list.reduce(function (s, x) { return s + ftin(x)[1]; }, 0), out = [];
    if (I >= 192) { out.push([tot - 192, 'u3l4-no-carry', 'You took 12 in away from the inches. Now add <b>1 ft</b> to the feet.']); out.push([tot + 32, 'u3l4-trade10', 'Trade <b>12</b> in for 1 ft (not 10).']); }
    var fsum = list.reduce(function (s, x) { return s + ftin(x)[1] % 16; }, 0);
    if (fsum >= 16) out.push([tot - 16, 'u3l4-frac-carry', 'The fractions add up to more than 1 in. Add the extra inch to the inches.']);
    return out;
  }
  function subBadF(A, B) {
    var a = ftin(A), b = ftin(B), out = [];
    if (a[1] < b[1]) { out.push([A - B - 32, 'u3l4-borrow10', 'When you borrow 1 ft, it becomes <b>12</b> in, not 10.']); out.push([(a[0] - b[0]) * 192 + (b[1] - a[1]), 'u3l4-small-from-big', 'You can’t take ' + t(inT(b[1]) + "''") + ' away from ' + t(inT(a[1]) + "''") + ' by subtracting the other way. Borrow 1 ft = 12 in first.']); out.push([A - B + 192, 'u3l4-borrow-ft', 'You borrowed 1 ft, so the feet go down by 1.']); }
    return out;
  }
  function ftinSel(prompt, S, o) { o = o || {}; return ftinPart(prompt, S, { frac: o.frac, bad: o.bad, round: o.round, sol: o.sol, hints: o.hints, text: o.text, label: o.label }); }

  /* decimal feet */
  function decFtPart(prompt, F, I, o) {      // F' I'' (whole inches) → decimal feet to the nearest hundredth
    o = o || {}; var v = F + I / 12;
    return num(prompt, v, { dp: 2, after: 'ft', nr: o.nr, bad: [[F + I / 10, 'u3l4-dec-in', I + ' inches is ' + t(I + '\\div 12') + ' of a foot, not 0.' + I + ' ft. Divide the inches by 12.'], [F + I / 100, 'u3l4-dec-in', 'Divide the inches by 12 to get the part of a foot.'], [F * 12 + I, 'u3l4-in-only', 'That’s the length in <b>inches</b>. For decimal feet, divide the inches by 12 and add to the feet.'], [I / 12, 'u3l4-no-feet', 'Add the ' + F + ' ft too.'], [F + 12 / I, 'u3l4-div-way', 'Divide the inches by 12 (' + t(I + '\\div 12') + '), not 12 by the inches.']],
      sol: t(F + '+' + I + '\\div 12=' + F + '+' + nS(rd(I / 12, 4)) + (same(v, rd(v, 2)) ? '=' + nS(v) : '=' + nS(rd(v, 4)) + '\\ldots\\approx ' + nS(rd(v, 2), 2))) + ' ft', hints: ['Inches ÷ 12 gives the part of a foot.', 'Then add the whole feet.'], text: o.text || 'to decimal ft' });
  }
  function fromDecFt(prompt, x, o) {         // decimal feet → feet and inches (to the nearest inch)
    o = o || {}; var F = Math.floor(x + 1e-9), dI = q((x - F) * 12), I = Math.round(dI), S = (F * 12 + I) * 16, digit = Math.round((x - F) * 10);
    var bad = [[(F * 12 + digit) * 16, 'u3l4-dec-in', 'The ' + nS(q(x - F)) + ' is part of a <b>foot</b>, not inches. Multiply it by 12: ' + t(nS(q(x - F)) + '\\times 12=' + nS(dI)) + ' in.'],
      [(F * 12 + Math.round((x - F) * 100)) * 16, 'u3l4-dec-in', 'The decimal part is a part of a foot, not inches. Multiply it by 12.'],
      dI !== I ? [(F * 12 + (I === Math.floor(dI) ? I + 1 : Math.floor(dI))) * 16, 'u3t-round-dir', 'Round ' + nS(dI) + ' in to the nearest inch: look at the tenths digit — 5 or more rounds up.'] : null,
      [(F * 12 + Math.round(12 / (x - F))) * 16, 'u3l4-div-way', 'Multiply the decimal part by 12; don’t divide.']];
    return ftinPart(prompt, S, { round: dI !== I, bad: bad.filter(Boolean), sol: t(nS(q(x - F)) + '\\times 12=' + nS(dI) + (dI !== I ? '\\approx ' + I : '')) + ' in, so ' + (dI !== I ? 'about ' : '') + t(ftinT(S)) + '.', hints: ['The whole number is the feet.', 'Multiply the decimal part by 12 to get the inches' + (dI !== I ? ', then round to the nearest inch.' : '.')], text: o.text || 'from decimal ft' });
  }
  function toFtIn(prompt, X, o) {            // whole inches → feet and inches
    o = o || {}; var F = Math.floor(X / 12), I = X - 12 * F, dec = q(X / 12), dd = (nS(dec).split('.')[1] || '');
    var bad = [dd ? [(F * 12 + Number(dd.slice(0, 2))) * 16, 'u3l4-dec-in', t(X + '\\div 12=' + nS(rd(dec, 4))) + ': the decimal part is a part of a foot, not inches. Find the inches left: ' + t(X + '-' + F + '\\times 12') + '.'] : null,
      [(F * 12 + Math.round((dec - F) * 10)) * 16, 'u3l4-dec-in', 'The decimal part of ' + t(X + '\\div 12') + ' is not the inches. Inches left = ' + t(X + '-' + F + '\\times 12') + '.']].filter(Boolean);
    return ftinPart(prompt, X * 16, { bad: bad, sol: t(X + '\\div 12=' + (same(dec, rd(dec, 2)) ? nS(dec) : nS(rd(dec, 2)) + '\\ldots')) + ', so ' + F + ' ft; ' + t(X + '-' + F + '\\times 12=' + X + '-' + 12 * F + '=' + I) + ', so ' + t(ftinT(X * 16)) + '.', hints: ['Divide by 12: the whole number is the feet.', 'Inches left = inches − feet × 12.'], text: o.text || 'to ft and in' });
  }
  function toIn(prompt, F, I16, o) {         // F' I'' → inches (I16 in sixteenths)
    o = o || {}; var S = F * 192 + I16;
    return inPart(prompt, S, { bad: [[F * 160 + I16, 'u3t-ten', '1 ft = <b>12</b> in, not 10.'], [F * 16 + I16, 'u3l4-not-x12', 'Change the feet to inches first: ' + t(F + '\\times 12') + '.'], [F * 192, 'u3l4-no-extra', 'Add the extra ' + t(inT(I16)) + ' in too.']],
      sol: t(F + '\\times 12+' + inT(I16) + '=' + 12 * F + '+' + inT(I16) + '=' + inT(S)) + ' in', hints: ['Feet × 12, then add the inches.'], text: o.text || 'to inches' });
  }
  function hx(S) { return t(ftinT(S)); }
  function andList(a) { return a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]; }

  HW.addCodes({
    'u3l4-si-dir': 'Multiplied instead of dividing (or the reverse) on the SI staircase', 'u3l4-si-steps': 'Counted the wrong number of steps (wrong power of 10)', 'u3l4-imp-dir': 'Multiplied instead of dividing (or the reverse), imperial',
    'u3l4-ten': 'Used 10 in in a foot', 'u3l4-yd12': 'Used 12 in in a yard', 'u3l4-yd3': 'Used 3 (feet) for yards to inches', 'u3l4-1760': 'Used 1760 for feet in a mile', 'u3l4-5280': 'Used 5280 for yards in a mile', 'u3l4-wrong-fact': 'Wrong imperial fact',
    'u3l4-dec-in': 'Read the decimal part of a foot as inches', 'u3l4-in-only': 'Gave inches instead of feet', 'u3l4-no-feet': 'Left out the whole feet', 'u3l4-div-way': 'Divided the wrong way', 'u3l4-not-x12': 'Didn’t multiply the feet by 12', 'u3l4-no-extra': 'Left out the extra inches',
    'u3l4-no-carry': 'Didn’t carry the foot', 'u3l4-trade10': 'Traded 10 in for a foot', 'u3l4-frac-carry': 'Lost the inch from adding the fractions', 'u3l4-borrow10': 'Borrowed 10 in instead of 12', 'u3l4-small-from-big': 'Subtracted the smaller inches from the larger', 'u3l4-borrow-ft': 'Didn’t take 1 from the feet after borrowing',
    'u3l4-mult-feet': 'Multiplied only the feet', 'u3l4-round-up': 'Rounded a piece count up', 'u3l4-round-down': 'Rounded a board count down', 'u3l4-join': 'Joined leftover pieces', 'u3l4-no-convert': 'Didn’t change to the same unit',
    'u3l4-unit': 'Answer in the wrong unit', 'u3l4-one-wall': 'Left out one of the walls', 'u3l4-one-day': 'Used one day instead of the week', 'u3l4-exact': 'Didn’t round a count', 'u3l4-added': 'Added instead of subtracting', 'u3l4-kerf': 'Left out the saw cuts', 'u3l4-one': 'Used one piece/item instead of all', 'u3l4-cuts': 'Counted the wrong number of saw cuts'
  });
  HW.addPartial({ 'u3l4-si-steps': 'b', 'u3l4-ten': 'b', 'u3l4-yd12': 'b', 'u3l4-no-carry': 's', 'u3l4-trade10': 'b', 'u3l4-frac-carry': 's', 'u3l4-borrow10': 'b', 'u3l4-borrow-ft': 's', 'u3l4-round-up': 'b', 'u3l4-round-down': 'b', 'u3l4-join': 'b', 'u3l4-kerf': 'b', 'u3l4-cuts': 's', 'u3l4-dec-in': 'b', 'u3l4-unit': 'b' });

  /* comparisons: [v1, u1, v2, u2] */
  function cmpGrid(prompt, rows4) {
    var rows = [], want = {}, sol = [];
    rows4.forEach(function (c, i) {
      var a = siCmp(c[0], c[1]), b = siCmp(c[2], c[3]), rel = same(a, b) ? 'eq' : a < b ? 'lt' : 'gt', small = SI[c[1]] < SI[c[3]] ? c[1] : c[3];
      var conv = c[1] === small ? [c[2], c[3]] : [c[0], c[1]], cv = shift(conv[0], SI[conv[1]] - SI[small]);
      rows.push({ id: 'r' + i, html: '(' + 'abcd'.charAt(i) + ') ' + N(c[0]) + ' ' + c[1] + ' &nbsp;☐&nbsp; ' + N(c[2]) + ' ' + c[3] });
      want['r' + i] = rel;
      c.conv = N(conv[0]) + ' ' + conv[1] + ' = ' + N(cv) + ' ' + small;
      sol.push('(' + 'abcd'.charAt(i) + ') ' + c.conv + ', so ' + N(c[0]) + ' ' + c[1] + ' ' + { lt: '&lt;', gt: '&gt;', eq: '=' }[rel] + ' ' + N(c[2]) + ' ' + c[3]);
    });
    return P.grid(prompt, rows, [{ id: 'lt', html: t('<') }, { id: 'gt', html: t('>') }, { id: 'eq', html: t('=') }], want,
      { rowHead: 'Compare', why: function (row) { var c = rows4[+row.slice(1)]; return { code: 'u3l4-no-convert', hint: '(' + 'abcd'.charAt(+row.slice(1)) + ') Change to the same unit first: ' + c.conv + '.' }; } },
      sol.join('<br>'), ['Change one length so both use the same unit, then compare.'], 'compare SI');
  }
  function cmpRows(r) {
    return find(function () {
      var mk = [
        function () { var c = r.pick([35, 45, 55, 62, 48, 70]), m = r.pick([0.4, 0.5, 0.6, 0.7]); return [c, 'cm', m, 'm']; },
        function () { var k = r.pick([1.8, 2.3, 3.05, 4.6, 0.75]), m = r.chance(0.5) ? shift(k, 3) : shift(k, 3) + r.pick([-200, 300, -50]); return r.chance(0.5) ? [m, 'm', k, 'km'] : [k, 'km', m, 'm']; },
        function () { var mm = r.pick([60, 80, 95, 40, 120]), cm = r.pick([5, 7, 9, 11, 6]); return [mm, 'mm', cm, 'cm']; },
        function () { var k = r.pick([0.09, 0.05, 0.12, 0.3]), cm = r.pick([900, 500, 1200, 3000, 4000, 600]); return [k, 'km', cm, 'cm']; }];
      return mk.map(function (f) { return f(); });
    }, function (v) { var rel = v.map(function (c) { var a = siCmp(c[0], c[1]), b = siCmp(c[2], c[3]); return same(a, b) ? 0 : a < b ? 1 : 2; }); var u = {}; rel.forEach(function (x) { u[x] = 1; }); return Object.keys(u).length === 3 && rel.indexOf(0) >= 0 && !(v[0][0] === 45 && v[0][2] === 0.5 && v[3][0] === 0.09 && v[3][2] === 900); }, [[45, 'cm', 0.5, 'm'], [2300, 'm', 2.3, 'km'], [80, 'mm', 7, 'cm'], [0.09, 'km', 900, 'cm']]);
  }
  /* order heights: [{name, html, inches}] */
  function heightsOrder(r, prompt) {
    var v = find(function () {
      var nm = r.sample(NAMES, 4), a = r.int(2, 10), b = r.int(60, 70), d = r.int(1, 9), c = 60 + 1.2 * d, e = r.int(2, 10) + 0.5;
      return [{ name: nm[0], html: t("5'\\," + a + "''"), v: 60 + a, wrongV: 60 + a, how: "5′" + a + "″ = 5 × 12 + " + a + ' = ' + (60 + a) + ' in' }, { name: nm[1], html: b + ' in', v: b, wrongV: b, how: b + ' in' },
        { name: nm[2], html: '5.' + d + ' ft', v: q(c), wrongV: 60 + d, how: '5.' + d + ' × 12 = ' + nS(q(c)) + ' in' }, { name: nm[3], html: t("5'\\," + Math.floor(e) + "\\tfrac{1}{2}''"), v: 60 + e, wrongV: 60 + e, how: '5 × 12 + ' + Math.floor(e) + '½ = ' + (60 + Math.floor(e)) + '½ in' }];
    }, function (p) {
      var vs = p.map(function (x) { return x.v; }).sort(function (a, b) { return a - b; });
      for (var i = 1; i < 4; i++) if (vs[i] - vs[i - 1] < 0.4) return false;
      var o1 = p.slice().sort(function (a, b) { return a.v - b.v; }).map(function (x) { return x.name; }).join(), o2 = p.slice().sort(function (a, b) { return a.wrongV - b.wrongV; }).map(function (x) { return x.name; }).join();
      return o1 !== o2 && p.every(function (x) { return x.v >= 60 && x.v < 72; }) && !(p[0].v === 66 && p[1].v === 67);
    }, null) || [{ name: 'Amara', html: t("5'\\,7''"), v: 67, how: '5 × 12 + 7 = 67 in' }, { name: 'Kai', html: '65 in', v: 65, how: '65 in' }, { name: 'Noor', html: '5.6 ft', v: 67.2, how: '5.6 × 12 = 67.2 in' }, { name: 'Wes', html: t("5'\\,6\\tfrac{1}{2}''"), v: 66.5, how: '5 × 12 + 6½ = 66½ in' }];
    var srt = v.slice().sort(function (a, b) { return a.v - b.v; });
    return { stem: prompt.replace('{list}', andList(v.map(function (x) { return x.name + ' is ' + x.html; }))), part: function (rr) {
      return P.order(rr, 'List them from shortest to tallest.', srt.map(function (x) { return { id: x.name, html: x.name }; }), { first: 'shortest', last: 'tallest', why: function (a, b) { var A = v.filter(function (x) { return x.name === a; })[0], B = v.filter(function (x) { return x.name === b; })[0]; return 'Change both to inches: ' + A.name + ' ' + A.how + ', ' + B.name + ' ' + B.how + '.'; } },
        'Change all to inches: ' + v.map(function (x) { return x.name + ' ' + x.how; }).join('; ') + '<br>Shortest to tallest: ' + srt.map(function (x) { return x.name; }).join(', ') + '.', ['Change every height to inches. Careful: 5.' + 'x ft is not 5 ft x in.'], 'order heights'); } };
  }

  /* ================= the lesson ================= */
  HW.defineLesson({
    id: 'u3l4', unit: 3, num: '4', title: 'Converting Length Within SI and Within Imperial', outcome: 'M1',
    blurb: 'The SI staircase; 12, 3, 36, 5280 and 1760 for imperial units; feet and inches, decimal feet; adding and subtracting feet and inches; cutting and fitting.',
    questions: [
      { num: '1', outcome: 'M1', stem: 'Convert each length.', parts: [
        { id: '1a', level: 'BEG', make: function (r) { return siPart(pick(r, [3.6, 2.8, 5.4, 1.9, 7.25, 0.85]), 'm', 'cm', { lab: '(a)' }); } },
        { id: '1b', level: 'BEG', make: function (r) { return siPart(pick(r, [72, 64, 93, 128, 56, 7]), 'mm', 'cm', { lab: '(b)' }); } },
        { id: '1c', level: 'BEG', make: function (r) { return siPart(pick(r, [5.08, 3.4, 1.25, 0.6, 7.05, 2.3]), 'km', 'm', { lab: '(c)' }); } },
        { id: '1d', level: 'BEG', make: function (r) { return siPart(pick(r, [940, 385, 72, 1250, 508, 2075]), 'cm', 'm', { lab: '(d)' }); } },
        { id: '1e', level: 'BEG', make: function (r) { return siPart(pick(r, [1.25, 0.8, 2.4, 3.05, 0.35, 1.6]), 'm', 'mm', { lab: '(e)' }); } },
        { id: '1f', level: 'BEG', make: function (r) { return siPart(pick(r, [8500, 3200, 950, 14000, 650, 4750]), 'm', 'km', { lab: '(f)' }); } },
        { id: '1g', level: 'BEG', make: function (r) { return siPart(pick(r, [6, 8, 35, 120, 4, 72]), 'mm', 'm', { lab: '(g)' }); } },
        { id: '1h', level: 'BEG', make: function (r) { return siPart(pick(r, [0.35, 0.2, 1.5, 0.08, 2.4, 0.65]), 'km', 'cm', { lab: '(h)' }); } }] },
      { num: '2', outcome: 'M1', stem: '', parts: [
        { id: '2', level: 'EMG', make: function (r) { return cmpGrid('Choose ' + t('<') + ', ' + t('>') + ' or ' + t('=') + ' for each box.', cmpRows(r)); } }] },
      { num: '3', outcome: 'M1', stem: function (sh) { return sh.who + ' wrote: &nbsp; ' + t(N(sh.v) + '\\text{ ' + sh.from + '}=' + N(sh.wrongV) + '\\text{ ' + sh.to + '}'); },
        shared: function (r) { var c = r.pick([['m', 'cm'], ['m', 'mm'], ['km', 'm']]), v = r.pick([2.5, 3.2, 1.8, 4.6, 0.75, 6.4]), e = SI[c[0]] - SI[c[1]]; return { who: r.pick(['Kayla', 'Hana', 'Priya', 'Leah']), v: v, from: c[0], to: c[1], e: e, wrongV: shift(v, -e), ans: shift(v, e) }; }, parts: [
        { id: '3a', level: 'EMG', make: function (r, sh) { var f = fN(Math.pow(10, sh.e));
          return P.mc(r, '(a) What mistake did she make?', [{ html: 'She divided by ' + f + ' (moved the point left). ' + cap(sh.to) + ' is a smaller unit, so the number must get bigger: multiply by ' + f + '.', right: true },
            { html: 'She multiplied by ' + f + ' when she should have divided.', why: 'She did divide: ' + t(N(sh.v) + '\\div ' + N(Math.pow(10, sh.e)) + '=' + N(sh.wrongV)) + '. Changing to a smaller unit needs a bigger number.', code: 'flip' },
            { html: 'She used the wrong number of steps: it should be ÷ ' + fN(Math.pow(10, sh.e + 1)) + '.', why: 'Dividing by any number makes it smaller. ' + cap(sh.to) + ' is a smaller unit, so the number should get <b>bigger</b>.', code: 'steps' },
            { html: 'Nothing — her answer is right.', why: 'Check with a picture: ' + N(sh.v) + ' ' + sh.from + ' is a lot of ' + sh.to + ', not a tiny fraction of one.', code: 'none' }],
            cap(sh.to) + ' is smaller than ' + sh.from + ', so the number must get bigger. She divided by ' + f + ' instead of multiplying.', ['Is ' + sh.to + ' a bigger or smaller unit than ' + sh.from + '? Should the number get bigger or smaller?'], 'Kayla mistake'); } },
        { id: '3b', level: 'EMG', make: function (r, sh) { return siPart(sh.v, sh.from, sh.to, { prompt: '(b) What is the correct answer? ' + N(sh.v) + ' ' + sh.from + ' =', text: 'Kayla fix' }); } }] },
      { num: '4', outcome: 'M3', stem: function (sh) { return 'A florist has ' + (sh.R === 25 ? 'a' : 'a') + ' ' + sh.R + ' m roll of ribbon. She uses ' + sh.p + ' cm of ribbon on each bouquet.'; },
        shared: function (r) { return find(function () { return { R: r.pick([20, 25, 30, 15, 12, 18]), p: r.pick([35, 40, 45, 60, 70, 55, 65, 75]) }; }, function (v) { return (v.R * 100) % v.p !== 0 && !(v.R === 25 && v.p === 40); }, { R: 20, p: 45 }); }, parts: [
        { id: '4a', level: 'EMG', make: function (r, sh) { var L = sh.R * 100, n = Math.floor(L / sh.p);
          return num('(a) How many bouquets can she make with the roll?', n, { after: 'bouquets', bad: [[n + 1, 'u3l4-round-up', 'Round <b>down</b>: the last bit of ribbon is too short for a whole bouquet.'], [L / sh.p, 'u3l4-exact', 'You can only make whole bouquets. Round down.', 'form'], [sh.R / sh.p, 'u3l4-no-convert', 'Change the roll to centimetres first: ' + t(sh.R + '\\times 100=' + L) + ' cm.'], [sh.R * 10 / sh.p, 'u3l4-no-convert', '1 m = <b>100</b> cm.']],
            sol: t(sh.R + '\\text{ m}=' + L + '\\text{ cm}') + '; ' + t(L + '\\div ' + sh.p + '=' + nS(rd(L / sh.p, 2)) + (same(L / sh.p, rd(L / sh.p, 2)) ? '' : '\\ldots')) + ', so ' + n + ' bouquets (round down).', hints: ['Change the roll to cm.', 'Divide, then round down.'], text: 'bouquets' }); } },
        { id: '4b', level: 'EMG', make: function (r, sh) { var L = sh.R * 100, n = Math.floor(L / sh.p), lf = L - n * sh.p;
          return num('(b) How much ribbon is left over?', lf, { after: 'cm', bad: [[lf / 100, 'u3l4-unit', 'That’s in metres. The box asks for centimetres.'], [sh.p - lf, 'u3l4-added', 'Leftover = roll − ribbon used: ' + t(L + '-' + n + '\\times ' + sh.p) + '.'], [(n + 1) * sh.p - L, 'u3l4-round-up', 'She makes ' + n + ' bouquets, not ' + (n + 1) + '.']],
            sol: t(L + '-' + n + '\\times ' + sh.p + '=' + L + '-' + n * sh.p + '=' + lf) + ' cm', hints: ['Leftover = whole roll − (bouquets × ribbon per bouquet).'], text: 'ribbon left' }); } }] },
      { num: '5', outcome: 'M3', stem: function (sh) { return 'A hiking trail in Kananaskis has three parts: ' + N(sh.a) + ' km, ' + sh.b + ' m and ' + N(sh.c) + ' km.'; },
        shared: function (r) { return find(function () { var a = r.int(12, 25) / 10, b = r.pick([650, 850, 750, 920, 480, 550]), c = r.int(150, 300) / 100, h = r.int(15, 35) / 10; return { a: a, b: b, c: c, T: q(a + b / 1000 + c), h: h }; }, function (v) { return v.h < v.T - 0.3 && !(v.a === 1.6 && v.b === 850 && v.c === 2.35); }, { a: 1.4, b: 750, c: 2.25, T: 4.4, h: 2.8 }); }, parts: [
        { id: '5a', level: 'EMG', make: function (r, sh) {
          return fld('(a) How long is the whole trail, in km and in m?', [{ label: 'In km:', name: 'km', v: sh.T, after: 'km', o: { bad: [[sh.a + sh.b + sh.c, 'u3l4-no-convert', 'Change ' + sh.b + ' m to km first (÷ 1000).'], [sh.a + sh.b / 100 + sh.c, 'u3l4-si-steps', 'm to km is 3 steps: ÷ 1000.'], [sh.T * 1000, 'u3l4-unit', 'That’s in metres — it goes in the other box.']] } },
            { label: 'In m:', name: 'm', v: q(sh.T * 1000), after: 'm', o: { bad: [[sh.T, 'u3l4-unit', 'That’s in km. Multiply by 1000 for metres.'], [q(sh.T * 100), 'u3l4-si-steps', 'km to m is 3 steps: × 1000.']] } }],
            t(sh.b + '\\text{ m}=' + nS(sh.b / 1000) + '\\text{ km}') + '<br>' + t(N(sh.a) + '+' + nS(sh.b / 1000) + '+' + N(sh.c) + '=' + N(sh.T)) + ' km = ' + fN(q(sh.T * 1000)) + ' m', ['Change everything to the same unit first.'], 'trail total', { swap: false });
        } },
        { id: '5b', level: 'PRG', make: function (r, sh) { var left = q((sh.T - sh.h) * 1000), who = r.pick(['Hailey', 'Brooke', 'Sofia', 'Jaya']);
          return num('(b) ' + who + ' has hiked ' + N(sh.h) + ' km so far. How many metres are left?', left, { after: 'm', bad: [[q(sh.T - sh.h), 'u3l4-unit', 'That’s in km. The question asks for metres: × 1000.'], [q(sh.T * 1000 - sh.h), 'u3l4-no-convert', 'Change ' + N(sh.h) + ' km to metres before you subtract.'], [q(sh.T * 1000 + sh.h * 1000), 'u3l4-added', 'Subtract what she has hiked.']],
            sol: t(N(sh.T) + '-' + N(sh.h) + '=' + N(q(sh.T - sh.h))) + ' km = ' + fN(left) + ' m', hints: ['Trail length − distance hiked.', 'Then change km to m.'], text: 'metres left' }); } }] },
      { num: '6', outcome: 'M2', stem: 'Convert each length.', parts: [
        { id: '6a', level: 'BEG', make: function (r) { return impPart(pick(r, [7, 11, 6, 14, 8, 13]), 'ft', 'in', { lab: '(a)' }); } },
        { id: '6b', level: 'BEG', make: function (r) { return impPart(pick(r, [54, 42, 30, 78, 90, 102]), 'in', 'ft', { lab: '(b)' }); } },
        { id: '6c', level: 'BEG', make: function (r) { return impPart(pick(r, [24, 21, 18, 27, 33, 45]), 'ft', 'yd', { lab: '(c)' }); } },
        { id: '6d', level: 'BEG', make: function (r) { return impPart(pick(r, [2.5, 3, 1.5, 4, 5.5, 3.5]), 'yd', 'in', { lab: '(d)' }); } },
        { id: '6e', level: 'BEG', make: function (r) { return impPart(pick(r, [3, 4, 1.5, 2.5, 5]), 'mi', 'ft', { lab: '(e)' }); } },
        { id: '6f', level: 'BEG', make: function (r) { return impPart(pick(r, [3520, 880, 5280, 7040, 2640]), 'yd', 'mi', { lab: '(f)' }); } }] },
      { num: '7', outcome: 'M3', stem: function (sh) { return 'The walking path around a park is ' + fN(sh.L) + ' ft long.'; },
        shared: function (r) { var v = r.pick([[880, 3, 2], [880, 6, 1], [1320, 2, 2], [1320, 4, 2], [1760, 6, 2], [1056, 5, 3], [2640, 3, 1], [2640, 2, 2], [1320, 6, 1]]); return { L: v[0], n: v[1], m: v[2], who: r.pick(['Sam', 'Kai', 'Noor', 'Theo']) }; }, parts: [
        { id: '7a', level: 'EMG', make: function (r, sh) { var ft = sh.L * sh.n;
          return fld('(a) ' + sh.who + ' walks ' + sh.n + ' laps. How far is that in feet, in yards and in miles?', [{ label: 'Feet:', name: 'ft', v: ft, after: 'ft', o: { bad: [[sh.L + sh.n, 'u3l4-added', 'Multiply the lap length by the number of laps.']] } },
            { label: 'Yards:', name: 'yd', v: ft / 3, after: 'yd', o: { bad: [[ft * 3, 'u3l4-imp-dir', 'Yards are bigger than feet: divide by 3.'], [ft / 12, 'u3l4-wrong-fact', '1 yd = <b>3</b> ft.']] } },
            { label: 'Miles:', name: 'mi', v: ft / 5280, after: 'mi', o: { bad: [[ft / 1760, 'u3l4-1760', '1760 is the number of yards in a mile. Divide the <b>feet</b> by 5280.'], [ft * 5280, 'u3l4-imp-dir', 'Miles are bigger than feet: divide by 5280.']] } }],
            t(sh.n + '\\times ' + N(sh.L) + '=' + N(ft)) + ' ft; ' + t(N(ft) + '\\div 3=' + N(ft / 3)) + ' yd; ' + t(N(ft) + '\\div 5280=' + nS(ft / 5280)) + ' mi', ['Find the feet first, then divide by 3 for yards and by 5280 for miles.'], 'laps ft yd mi', { swap: false }); } },
        { id: '7b', level: 'PRG', make: function (r, sh) { var ft = sh.m * 5280, n = ft / sh.L;
          return num('(b) How many laps must ' + sh.who + ' walk to go ' + sh.m + ' mi?', n, { after: 'laps', bad: [[sh.m * 1760 / sh.L, 'u3l4-1760', '1 mi = 5280 <b>ft</b> (1760 is yards).'], [sh.L / ft, 'u3l4-div-way', 'Divide the distance by the lap length: ' + t(N(ft) + '\\div ' + N(sh.L)) + '.'], [sh.m * sh.L / 5280, 'u3l4-no-convert', 'Change ' + sh.m + ' mi to feet first: × 5280.']],
            sol: t(sh.m + '\\text{ mi}=' + sh.m + '\\times 5280=' + N(ft)) + ' ft; ' + t(N(ft) + '\\div ' + N(sh.L) + '=' + n) + ' laps', hints: ['Change the miles to feet.', 'Divide by the length of one lap.'], text: 'laps for miles' }); } }] },
      { num: '8', outcome: 'M2', stem: 'Convert each length.', parts: [
        { id: '8a', level: 'BEG', make: function (r) { var v = find(function () { return [r.int(4, 7), r.int(1, 11)]; }, function (v) { return !(v[0] === 6 && v[1] === 2) && !(v[0] === 5 && v[1] === 7); }, [5, 4]); return toIn('(a) ' + t(v[0] + "'\\," + v[1] + "''") + ' to inches', v[0], v[1] * 16, { text: 'ft in to in a' }); } },
        { id: '8b', level: 'BEG', make: function (r) { var v = [r.int(9, 13), r.int(5, 11)]; return toIn('(b) ' + t(v[0] + "'\\," + v[1] + "''") + ' to inches', v[0], v[1] * 16, { text: 'ft in to in b' }); } },
        { id: '8c', level: 'BEG', make: function (r) { var v = find(function () { return [r.int(3, 6), r.int(1, 11) * 16 + r.pick([4, 8, 12])]; }, function (v) { return !(v[0] === 5 && v[1] === 168); }, [4, 40]); return toIn('(c) ' + t(v[0] + "'\\," + inT(v[1]) + "''") + ' to inches', v[0], v[1], { text: 'ft in to in c' }); } },
        { id: '8d', level: 'BEG', make: function (r) { var X = find(function () { return r.int(25, 47); }, function (x) { return x % 12 && x !== 45; }, 39); return toFtIn('(d) ' + X + ' in to feet and inches', X); } },
        { id: '8e', level: 'BEG', make: function (r) { var X = find(function () { return r.int(61, 95); }, function (x) { return x % 12 && [62, 66, 67, 74, 70].indexOf(x) < 0; }, 87); return toFtIn('(e) ' + X + ' in to feet and inches', X); } },
        { id: '8f', level: 'BEG', make: function (r) { var X = find(function () { return r.int(150, 230); }, function (x) { return x % 12 && x !== 130; }, 200); return toFtIn('(f) ' + X + ' in to feet and inches', X); } }] },
      { num: '9', outcome: 'M2', stem: 'Convert. Round decimal feet to the nearest hundredth and inches to the nearest inch.', parts: [
        { id: '9a', level: 'EMG', make: function (r) { var v = find(function () { return [r.int(2, 12), r.pick([6, 9, 3])]; }, function (v) { return !(v[0] === 8 && v[1] === 6) && !(v[0] === 6 && v[1] === 9) && !(v[0] === 5 && v[1] === 6); }, [9, 6]); return decFtPart('(a) ' + t(v[0] + "'\\," + v[1] + "''") + ' to decimal feet', v[0], v[1]); } },
        { id: '9b', level: 'EMG', make: function (r) { var v = find(function () { return [r.int(2, 12), r.pick([9, 3, 6])]; }, function (v) { return !(v[0] === 8 && v[1] === 6) && !(v[0] === 6 && v[1] === 9) && !(v[0] === 4 && v[1] === 3); }, [4, 9]); return decFtPart('(b) ' + t(v[0] + "'\\," + v[1] + "''") + ' to decimal feet', v[0], v[1]); } },
        { id: '9c', level: 'EMG', make: function (r) { var v = find(function () { return [r.int(2, 9), r.pick([4, 8, 2, 10, 1, 5, 7, 11])]; }, function (v) { return !(v[0] === 3 && v[1] === 4); }, [2, 4]); return decFtPart('(c) ' + t(v[0] + "'\\," + v[1] + "''") + ' to decimal feet', v[0], v[1]); } },
        { id: '9d', level: 'EMG', make: function (r) { var x = find(function () { return r.int(5, 14) + r.pick([0.25, 0.75]); }, function (x) { return [7.25, 4.25, 9.75].indexOf(x) < 0; }, 12.25); return fromDecFt('(d) ' + nS(x) + ' ft to feet and inches', x); } },
        { id: '9e', level: 'EMG', make: function (r) { var x = r.int(3, 12) + 0.5; return fromDecFt('(e) ' + nS(x) + ' ft to feet and inches', x); } },
        { id: '9f', level: 'EMG', make: function (r) { var x = find(function () { return q(r.int(2, 9) + r.pick([0.2, 0.3, 0.4, 0.6, 0.7, 0.8, 0.9])); }, function (x) { return [5.6, 7.3].indexOf(x) < 0; }, 2.8); return fromDecFt('(f) ' + nS(x) + ' ft to feet and inches', x); } },
        { id: '9g', level: 'EMG', make: function (r) {
          var v = find(function () { return [r.int(2, 8), r.pick([3, 4, 6, 7, 8, 9])]; }, function (v) { return !(v[0] === 5 && v[1] === 6) && !(v[0] === 7 && v[1] === 3); }, [3, 4]), x = q(v[0] + v[1] / 10), dI = q(v[1] / 10 * 12), I = Math.round(dI);
          var who = r.pick(['Leo', 'Wes', 'Arjun', 'Cody']), Ft = v[0] + Math.floor(I / 12), In = I % 12;
          return P.mc(r, '(g) ' + who + ' says that ' + nS(x) + ' ft is the same as ' + t(v[0] + "'\\," + v[1] + "''") + '. Is he right?', [
            { html: 'No. The 0.' + v[1] + ' is a part of a foot: ' + t('0.' + v[1] + '\\times 12=' + nS(dI)) + ' in, so ' + nS(x) + ' ft ' + (dI === I ? '=' : '≈') + ' ' + t(Ft + "'\\," + In + "''") + '.', right: true },
            { html: 'Yes. The digits after the point are the inches.', why: 'The 0.' + v[1] + ' means ' + v[1] + ' tenths of a <b>foot</b>, and a foot is 12 in, not 10.', code: 'yes' },
            { html: 'No. ' + nS(x) + ' ft is ' + t(v[0] + "'\\," + v[1] * 10 + "''") + '.', why: 'Inches must be less than 12. Multiply the decimal part by 12.', code: 'ten' },
            { html: 'No. ' + t('0.' + v[1] + '\\div 12') + ' is the inches, so ' + nS(x) + ' ft ≈ ' + t(v[0] + "'\\,0''") + '.', why: 'To change part of a foot to inches, <b>multiply</b> by 12.', code: 'div' }],
            'No. ' + t('0.' + v[1] + '\\times 12=' + nS(dI) + (dI === I ? '' : '\\approx ' + I)) + ' in, so ' + nS(x) + ' ft ' + (dI === I ? 'is' : 'is about') + ' ' + t(Ft + "'\\," + In + "''") + '. (' + t(v[0] + "'\\," + v[1] + "''") + ' is about ' + nS(rd(v[0] + v[1] / 12, 2)) + ' ft.)', ['Multiply the decimal part by 12 to get inches.'], 'decimal feet myth');
        } }] },
      { num: '10', outcome: 'M2', shared: function (r) { return heightsOrder(r, 'Four friends compare their heights: {list}.'); }, stem: function (sh) { return sh.stem; }, parts: [
        { id: '10', level: 'PRG', make: function (r, sh) { return sh.part(r); } }] },
      { num: '11', outcome: 'M2', stem: 'Find each answer in feet and inches, with fewer than 12 inches.', parts: [
        { id: '11a', level: 'EMG', make: function (r) { var v = find(function () { return [r.int(2, 6) * 192 + r.int(5, 11) * 16, r.int(2, 7) * 192 + r.int(4, 11) * 16]; }, function (v) { return ftin(v[0])[1] + ftin(v[1])[1] >= 192 + 16 && [[4, 7, 3, 10], [5, 9, 2, 8]].every(function (e) { return !(v[0] === e[0] * 192 + e[1] * 16 && v[1] === e[2] * 192 + e[3] * 16); }); }, [3 * 192 + 128, 6 * 192 + 112]);
          return ftinSel('(a) ' + hx(v[0]) + ' + ' + hx(v[1]), v[0] + v[1], { bad: addBad(v), sol: addSol(v), hints: ['Add feet to feet and inches to inches.', 'If there are 12 in or more, trade 12 in for 1 ft.'], text: 'add ft in' }); } },
        { id: '11b', level: 'EMG', make: function (r) { var v = find(function () { return [r.int(8, 13) * 192 + r.int(0, 5) * 16, r.int(2, 6) * 192 + r.int(6, 11) * 16]; }, function (v) { return ftin(v[0])[1] < ftin(v[1])[1] && [[9, 3, 5, 8], [11, 2, 6, 7]].every(function (e) { return !(v[0] === e[0] * 192 + e[1] * 16 && v[1] === e[2] * 192 + e[3] * 16); }); }, [12 * 192 + 32, 4 * 192 + 144]);
          return ftinSel('(b) ' + hx(v[0]) + ' − ' + hx(v[1]), v[0] - v[1], { bad: subBadF(v[0], v[1]), sol: subSolF(v[0], v[1]), hints: ['There aren’t enough inches on top: borrow 1 ft = 12 in.'], text: 'sub ft in' }); } },
        { id: '11c', level: 'EMG', make: function (r) { var v = find(function () { return [r.int(3, 5), r.int(1, 3) * 192 + r.int(4, 11) * 16]; }, function (v) { return v[0] * ftin(v[1])[1] >= 192 && !(v[0] === 3 && v[1] === 2 * 192 + 144); }, [4, 192 + 160]), k = v[0], A = v[1], a = ftin(A);
          return ftinSel('(c) ' + t(k + '\\times ' + ftinT(A)), k * A, { bad: [[k * a[0] * 192 + a[1], 'u3l4-mult-feet', 'Multiply the inches by ' + k + ' too.'], [k * A + 32 * Math.floor(k * a[1] / 192), 'u3l4-trade10', 'Trade <b>12</b> in for each foot, not 10.'], [k * A - 192 * Math.floor(k * a[1] / 192), 'u3l4-no-carry', 'You took the 12s out of the inches — now add that many feet.']], sol: mulSol(k, A), hints: ['Multiply the feet and the inches by ' + k + '.', 'Then trade each 12 in for 1 ft.'], text: 'mult ft in' }); } },
        { id: '11d', level: 'PRG', make: function (r) { var v = find(function () { return [r.int(3, 7) * 192 + r.int(4, 9) * 16 + r.pick([4, 8, 12]), r.int(2, 5) * 192 + r.int(4, 9) * 16 + r.pick([8, 12, 4])]; }, function (v) { return (ftin(v[0])[1] % 16) + (ftin(v[1])[1] % 16) >= 16 && ftin(v[0])[1] + ftin(v[1])[1] >= 192 && !(v[0] === 6 * 192 + 72 && v[1] === 2 * 192 + 156); }, [5 * 192 + 108, 3 * 192 + 120]);
          return ftinSel('(d) ' + hx(v[0]) + ' + ' + hx(v[1]), v[0] + v[1], { frac: true, bad: addBad(v), sol: addSol(v), hints: ['Add the fractions first (use a common bottom number).', 'Then add the inches and the feet, and regroup 12 in as 1 ft.'], text: 'add ft in frac' }); } },
        { id: '11e', level: 'PRG', make: function (r) { var v = find(function () { return [r.int(6, 12) * 192, r.int(2, 4) * 192 + r.int(1, 10) * 16 + r.pick([8, 4, 12])]; }, function (v) { return !(v[0] === 8 * 192 && v[1] === 3 * 192 + 88); }, [8 * 192, 2 * 192 + 56]);
          var A = v[0], B = v[1], b = ftin(B);
          return ftinSel('(e) ' + t(A / 192 + "'") + ' − ' + hx(B), A - B, { frac: true, bad: [[(A / 192 - b[0]) * 192 + b[1], 'u3l4-small-from-big', 'There are 0 inches on top. Borrow 1 ft: ' + t(A / 192 + "'=" + (A / 192 - 1) + "'\\,12''") + ', then subtract.'], [A - B - 32, 'u3l4-borrow10', '1 ft = <b>12</b> in, not 10.'], [A - B + 192, 'u3l4-borrow-ft', 'You borrowed 1 ft, so the feet go down by 1.']],
            sol: t(A / 192 + "'=" + (A / 192 - 1) + "'\\,12''") + '<br>' + t((A / 192 - 1) + "'\\,12''-" + ftinT(B) + '=' + ftinT(A - B)), hints: ['Write ' + t(A / 192 + "'") + ' as ' + t((A / 192 - 1) + "'\\,12''") + ' first.'], text: 'whole ft minus' }); } }] },
      { num: '12', outcome: 'M3', shared: function (r) {
          return find(function () { var w = [2 * 192 + r.int(3, 9) * 16, 192 + r.int(6, 11) * 16, r.pick([3 * 192, 2 * 192 + r.int(1, 4) * 16, 3 * 192 + r.int(1, 3) * 16])], S = w[0] + w[1] + w[2], gap = r.int(3, 11) * 16; return { w: w, S: S, W: S + gap, gap: gap, who: r.pick(['Marco', 'Faisal', 'Devon', 'Omar']) }; },
            function (v) { var I = v.w.reduce(function (s, x) { return s + ftin(x)[1]; }, 0); return I >= 192 && !(v.w[0] === 2 * 192 + 96 && v.w[1] === 192 + 144); }, { w: [2 * 192 + 80, 192 + 160, 3 * 192], S: 7 * 192 + 48, W: 7 * 192 + 160, gap: 112, who: 'Faisal' }); },
        stem: function (sh) { return sh.who + ' is putting three kitchen cabinets side by side along a wall that is ' + hx(sh.W) + ' long. The cabinets are ' + andList(sh.w.map(hx)) + ' wide.'; }, parts: [
        { id: '12a', level: 'PRG', make: function (r, sh) { return ftinSel('(a) How wide are the three cabinets together?', sh.S, { bad: addBad(sh.w), sol: addSol(sh.w), hints: ['Add feet to feet and inches to inches, then regroup.'], text: 'cabinets total' }); } },
        { id: '12b', level: 'EMG', make: function (r, sh) { return P.mc(r, '(b) Will they fit along the wall?', [{ html: 'Yes — together they are shorter than the wall.', right: true }, { html: 'No — together they are longer than the wall.', why: 'Compare ' + hx(sh.S) + ' with ' + hx(sh.W) + ': compare the feet, then the inches.', code: 'no' }, { html: 'No — the inches add up to more than 12.', why: 'That only means you regroup 12 in as 1 ft. Compare the regrouped total with the wall.', code: 'inches' }],
          'Total ' + hx(sh.S) + ' is less than ' + hx(sh.W) + ', so they fit.', ['Use your total from (a) and compare it with the wall.'], 'cabinets fit', true); } },
        { id: '12c', level: 'PRG', make: function (r, sh) { return ftinSel('(c) How much space is left?', sh.gap, { bad: subBadF(sh.W, sh.S), sol: subSolF(sh.W, sh.S), hints: ['Space left = wall − total width.'], text: 'cabinets space' }); } }] },
      { num: '13', outcome: 'M3', shared: function (r) {
          return find(function () { var L = r.pick([8, 10, 12, 16]), p = r.pick([30, 32, 36, 40, 42, 45, 50, 27]), per = Math.floor(12 * L / p), lf = 12 * L - per * p, n = r.int(12, 24), c = r.pick([9.97, 12.47, 14.97, 18.99, 22.49]); return { L: L, p: p, per: per, lf: lf, n: n, c: c, B: Math.ceil(n / per), who: r.pick(['Dana', 'Kayla', 'Gwen', 'Elena']) }; },
            function (v) { return v.per >= 2 && v.lf > 0 && v.lf % 6 === 0 && v.n % v.per !== 0 && Math.ceil(v.n * v.p / (12 * v.L)) !== v.B && !(v.L === 8 && v.p === 30) && !(v.L === 12 && v.p === 40 && v.n === 20); }, { L: 10, p: 36, per: 3, lf: 12, n: 17, c: 12.47, B: 6, who: 'Gwen' }); },
        stem: function (sh) { return sh.who + ' is building a bench from deck boards. The boards are ' + sh.L + ' ft long and cost ' + Dp(sh.c) + ' each. She needs ' + sh.n + ' pieces that are each ' + sh.p + ' in long.'; }, parts: [
        { id: '13a', level: 'PRG', make: function (r, sh) { var Lin = 12 * sh.L;
          return fld('(a) How many ' + sh.p + ' in pieces can she cut from one board? How much is left over, in feet?', [{ label: 'Pieces:', name: 'pieces', v: sh.per, after: 'pieces', o: { bad: [[sh.per + 1, 'u3l4-round-up', 'Round <b>down</b>: the leftover is too short to be a piece.'], [Lin / sh.p, 'u3l4-exact', 'Only whole pieces count. Round down.', 'form'], [sh.L / sh.p, 'u3l4-no-convert', 'Change the board to inches first: ' + t(sh.L + '\\times 12') + '.']] } },
            { label: 'Left over:', name: 'leftover', v: sh.lf / 12, after: 'ft', o: { bad: [[sh.lf, 'u3l4-unit', 'That’s in inches. Change it to feet: ÷ 12.'], [sh.lf / 10, 'u3l4-ten', '1 ft = 12 in.']] } }],
            t(sh.L + '\\text{ ft}=' + Lin + '\\text{ in}') + '; ' + t(Lin + '\\div ' + sh.p + '=' + nS(rd(Lin / sh.p, 2)) + (same(Lin / sh.p, rd(Lin / sh.p, 2)) ? '' : '\\ldots')) + ', so ' + sh.per + ' pieces (round down)<br>Leftover: ' + t(Lin + '-' + sh.per + '\\times ' + sh.p + '=' + sh.lf) + ' in = ' + nS(sh.lf / 12) + ' ft',
            ['Change the board length to inches.', 'Divide and round down; the leftover is board − pieces × length.'], 'pieces leftover', { swap: false }); } },
        { id: '13b', level: 'PRG', make: function (r, sh) { var join = Math.ceil(sh.n * sh.p / (12 * sh.L));
          return fld('(b) How many boards must she buy? What will they cost?', [{ label: 'Boards:', name: 'boards', v: sh.B, after: 'boards', o: { bad: [[sh.B - 1, 'u3l4-round-down', 'Round <b>up</b>: she needs enough boards for all ' + sh.n + ' pieces.'], [sh.n / sh.per, 'u3l4-exact', 'You can only buy whole boards. Round up.', 'form'], [join, 'u3l4-join', 'The leftover bits can’t be joined into pieces. Each board gives only ' + sh.per + ' pieces: ' + t(sh.n + '\\div ' + sh.per) + '.']] } },
            { label: 'Cost:', name: 'cost', v: q(sh.B * sh.c), o: { money: true, bad: [[(sh.B - 1) * sh.c, 'u3l4-round-down', 'Use the number of boards rounded <b>up</b>.'], [join * sh.c, 'u3l4-join', 'Each board gives only ' + sh.per + ' pieces.'], [sh.n * sh.c, 'u3l4-one', 'Multiply the price by the number of <b>boards</b>, not pieces.']] } }],
            t(sh.n + '\\div ' + sh.per + '=' + nS(rd(sh.n / sh.per, 2)) + (same(sh.n / sh.per, rd(sh.n / sh.per, 2)) ? '' : '\\ldots')) + ', so ' + sh.B + ' boards (round up)<br>' + t(sh.B + '\\times ' + D(sh.c) + '=' + D(sh.B * sh.c)), ['Pieces needed ÷ pieces per board, rounded up.', 'Then boards × price.'], 'boards cost', { swap: false }); } }] },
      { num: '14', outcome: 'M3', shared: function (r) {
          return find(function () { var k = r.int(2, 5), len = r.int(1, 3) * 12 + r.int(1, 11), T = k * len, Y = Math.ceil(T / 36), lf = 36 * Y - T; return { k: k, len: len, T: T, Y: Y, lf: lf, who: r.pick(['Grace', 'Noor', 'Aisha', 'Leah']) }; },
            function (v) { return (v.T * 100) % 36 === 0 && v.T % 36 !== 0 && !(v.k === 3 && v.len === 27); }, { k: 3, len: 30, T: 90, Y: 3, lf: 18, who: 'Noor' }); },
        stem: function (sh) { return sh.who + ' needs ' + sh.k + ' pieces of ribbon, each ' + hx(sh.len * 16) + ' long. The store sells ribbon only in whole yards.'; }, parts: [
        { id: '14a', level: 'PRG', make: function (r, sh) { var one = sh.len;
          return fld('(a) How much ribbon does she need, in inches and in yards?', [{ label: 'Inches:', name: 'in', v: sh.T, after: 'in', o: { bad: [[one, 'u3l4-one', 'That’s one piece. She needs ' + sh.k + '.'], [sh.k * (Math.floor(one / 12) * 10 + one % 12), 'u3t-ten', '1 ft = 12 in.']] } },
            { label: 'Yards:', name: 'yd', v: sh.T / 36, after: 'yd', o: { bad: [[sh.T / 12, 'u3l4-yd12', 'That’s in feet. 1 yd = 36 in.'], [sh.T / 3, 'u3l4-yd3', '1 yd = 3 ft = 36 in. Divide the inches by 36.']] } }],
            hx(one * 16) + ' = ' + t(Math.floor(one / 12) + '\\times 12+' + one % 12 + '=' + one) + ' in; ' + t(sh.k + '\\times ' + one + '=' + sh.T) + ' in; ' + t(sh.T + '\\div 36=' + nS(sh.T / 36)) + ' yd', ['Change one piece to inches, then multiply.', '1 yd = 36 in.'], 'ribbon needed', { swap: false }); } },
        { id: '14bi', sub: 'b i', level: 'PRG', make: function (r, sh) {
          return fld('(b) How many yards must she buy? How much will be left over, in inches?', [{ label: 'Buy:', name: 'yards', v: sh.Y, after: 'yd', o: { bad: [[sh.Y - 1, 'u3l4-round-down', 'Round <b>up</b>: ' + (sh.Y - 1) + ' yd is not enough.'], [sh.T / 36, 'u3l4-exact', 'The store sells only whole yards. Round up.', 'form']] } },
            { label: 'Left over:', name: 'leftover', v: sh.lf, after: 'in', o: { bad: [[sh.lf / 12, 'u3l4-unit', 'Give the leftover in inches.'], [36 * (sh.Y - 1) - sh.T, 'u3l4-round-down', 'Use the yards she buys.'], [sh.T - 36 * (sh.Y - 1), 'u3l4-added', 'Leftover = ribbon bought (in inches) − ribbon needed.']] } }],
            'Round up: ' + sh.Y + ' yd = ' + t(sh.Y + '\\times 36=' + 36 * sh.Y) + ' in<br>Leftover: ' + t(36 * sh.Y + '-' + sh.T + '=' + sh.lf) + ' in', ['Round the yards up.', 'Change the yards to inches and subtract what she needs.'], 'yards buy', { swap: false }); } },
        { id: '14bii', sub: 'b ii', level: 'EMG', make: function (r, sh) { var yes = sh.lf >= sh.len;
          return P.mc(r, '(b) Is the leftover enough for one more piece?', [{ html: yes ? 'Yes — the leftover (' + sh.lf + ' in) is at least as long as one piece (' + sh.len + ' in).' : 'No — the leftover (' + sh.lf + ' in) is shorter than one piece (' + sh.len + ' in).', right: true },
            { html: yes ? 'No — the leftover (' + sh.lf + ' in) is shorter than one piece (' + sh.len + ' in).' : 'Yes — the leftover (' + sh.lf + ' in) is at least as long as one piece (' + sh.len + ' in).', why: 'Compare ' + sh.lf + ' in with ' + sh.len + ' in.', code: 'flip' }],
            'One piece is ' + sh.len + ' in; the leftover is ' + sh.lf + ' in. ' + (yes ? 'Yes, it is enough' + (sh.lf === sh.len ? ' — exactly' : '') + '.' : 'No, it is not enough.'), ['Change one piece to inches and compare it with the leftover.'], 'one more piece', true); } }] },
      { num: '15', outcome: 'M1', stem: '', parts: [
        { id: '15', level: 'BEG', make: function (r) { var v = r.pick([4.5, 3.2, 6.8, 2.75, 1.6, 7.4]), opts = [[v * 10, 'That multiplies by 10. 1 km = <b>1000</b> m.'], [v * 100, 'That multiplies by 100. 1 km = <b>1000</b> m.'], [v * 1000, null], [v * 10000, 'That multiplies by 10 000. 1 km = 1000 m.']];
          return P.mc(r, 'How many metres are in ' + N(v) + ' km?', opts.map(function (o, i) { return { html: fN(q(o[0])) + ' m', right: i === 2, why: o[1], code: 'x' + i }; }), t(N(v) + '\\times 1000=' + N(q(v * 1000))) + ' m', ['1 km = 1000 m.'], 'km to m MC', true); } }] },
      { num: '16', outcome: 'M2', stem: '', parts: [
        { id: '16', level: 'EMG', make: function (r) { var X = find(function () { return r.int(50, 95); }, function (x) { var F = Math.floor(x / 12); return x % 12 && Math.floor(x / 10) !== F && x % 10 < 12 && x !== 76 && String(F) + '.' + (x % 12) !== String(rd(x / 12, 1)); }, 87), F = Math.floor(X / 12), I = X % 12;
          return P.mc(r, 'Which length is the same as ' + X + ' in?', [{ html: t(F + "'\\," + I + "''"), right: true }, { html: F + '.' + I + ' ft', why: t(X + '\\div 12=' + nS(rd(X / 12, 2)) + '\\ldots') + ' ft — the inches are not the digits after the point.', code: 'dec' }, { html: t(Math.floor(X / 10) + "'\\," + X % 10 + "''"), why: 'That just splits the digits. Divide by 12: there are 12 in in a foot.', code: 'digits' }, { html: fN(X * 12) + ' ft', why: 'Feet are bigger than inches, so divide by 12.', code: 'x12' }],
            t(X + '\\div 12=' + nS(rd(X / 12, 2)) + '\\ldots') + ', so ' + F + ' ft; ' + t(X + '-' + 12 * F + '=' + I) + ' in: ' + t(F + "'\\," + I + "''"), ['Divide by 12 for the feet; the inches left over are the rest.'], 'in to ft in MC'); } }] },
      { num: '17', outcome: 'M2', stem: '', parts: [
        { id: '17', level: 'EMG', make: function (r) { var v = find(function () { return [r.int(3, 8), r.int(5, 11), r.int(1, 4), r.int(4, 11)]; }, function (v) { return v[1] + v[3] >= 13 && !(v[0] === 7 && v[1] === 9 && v[2] === 2 && v[3] === 6); }, [6, 8, 3, 7]), F = v[0] + v[2], I = v[1] + v[3];
          return P.mc(r, t(v[0] + "'\\," + v[1] + "''+" + v[2] + "'\\," + v[3] + "''") + ' equals', [{ html: t((F + 1) + "'\\," + (I - 12) + "''"), right: true }, { html: t(F + "'\\," + (I - 12) + "''"), why: 'You took 12 in away, so add 1 ft to the feet.', code: 'u3l4-no-carry' }, { html: F + '.' + I + ' ft', why: 'Feet and inches are not a decimal: ' + t(F + "'\\," + I + "''") + ' has to be regrouped (12 in = 1 ft).', code: 'dec' }, { html: (F + 1) + '.' + (I - 12) + ' ft', why: t((F + 1) + "'\\," + (I - 12) + "''") + ' is not ' + (F + 1) + '.' + (I - 12) + ' ft: ' + (I - 12) + ' in is ' + t((I - 12) + '\\div 12') + ' of a foot.', code: 'dec2' }],
            t(F + "'\\," + I + "''") + '; ' + t(I + "''=1'\\," + (I - 12) + "''") + ', so ' + t((F + 1) + "'\\," + (I - 12) + "''") + '.', ['Add feet to feet and inches to inches, then regroup.'], 'add MC'); } }] },
      { num: '18', outcome: 'M2', stem: '', parts: [
        { id: '18', level: 'EMG', make: function (r) { var v = find(function () { return [r.int(2, 9), r.pick([3, 6, 9, 4, 8, 1, 2, 10])]; }, function (v) { return !(v[0] === 5 && v[1] === 3); }, [4, 9]); return decFtPart('A shelf is ' + t(v[0] + "'\\," + v[1] + "''") + ' long. Its length in decimal feet, to the nearest hundredth, is ________ ft.', v[0], v[1], { nr: true, text: 'NR decimal ft' }); } }] }],
    extra: [
      { num: '1', section: 'A. Skills', outcome: 'M1', stem: 'Convert each length.', parts: [
        { id: 'e1a', level: 'BEG', make: function (r) { return siPart(pick(r, [7.3, 6.5, 2.05, 8.4, 1.75]), 'm', 'cm', { lab: '(a)' }); } },
        { id: 'e1b', level: 'BEG', make: function (r) { return siPart(pick(r, [465, 320, 1080, 95, 735]), 'cm', 'm', { lab: '(b)' }); } },
        { id: 'e1c', level: 'BEG', make: function (r) { return siPart(pick(r, [3.9, 0.45, 12.6, 4.08, 1.5]), 'km', 'm', { lab: '(c)' }); } },
        { id: 'e1d', level: 'BEG', make: function (r) { return siPart(pick(r, [28, 15, 92, 7, 134]), 'mm', 'cm', { lab: '(d)' }); } },
        { id: 'e1e', level: 'BEG', make: function (r) { return siPart(pick(r, [0.4, 1.2, 0.05, 2.75, 0.9]), 'm', 'mm', { lab: '(e)' }); } },
        { id: 'e1f', level: 'BEG', make: function (r) { return siPart(pick(r, [2600000, 4300000, 750000, 1800000]), 'mm', 'km', { lab: '(f)' }); } }] },
      { num: '2', outcome: 'M2', stem: 'Convert each length.', parts: [
        { id: 'e2a', level: 'BEG', make: function (r) { return impPart(pick(r, [11, 9, 15, 4, 12]), 'ft', 'in', { lab: '(a)' }); } },
        { id: 'e2b', level: 'BEG', make: function (r) { return impPart(pick(r, [30, 18, 42, 114, 150]), 'in', 'ft', { lab: '(b)' }); } },
        { id: 'e2c', level: 'BEG', make: function (r) { return impPart(pick(r, [7, 12, 5, 2.5, 20]), 'yd', 'ft', { lab: '(c)' }); } },
        { id: 'e2d', level: 'BEG', make: function (r) { return impPart(pick(r, [4, 3, 2.5, 6, 1.5]), 'mi', 'yd', { lab: '(d)' }); } },
        { id: 'e2e', level: 'BEG', make: function (r) { return impPart(pick(r, [108, 72, 144, 54, 90]), 'in', 'yd', { lab: '(e)' }); } },
        { id: 'e2f', level: 'BEG', make: function (r) { return impPart(pick(r, [13200, 10560, 2640, 15840, 7920]), 'ft', 'mi', { lab: '(f)' }); } }] },
      { num: '3', outcome: 'M2', stem: 'Convert each length.', parts: [
        { id: 'e3a', level: 'EMG', make: function (r) { var v = [r.int(3, 8), r.int(1, 11)]; return toIn('(a) ' + t(v[0] + "'\\," + v[1] + "''") + ' to inches', v[0], v[1] * 16, { text: 'e3a' }); } },
        { id: 'e3b', level: 'EMG', make: function (r) { var X = find(function () { return r.int(80, 120); }, function (x) { return x % 12; }, 92); return toFtIn('(b) ' + X + ' in to feet and inches', X, { text: 'e3b' }); } },
        { id: 'e3c', level: 'EMG', make: function (r) { var X = find(function () { return r.int(37, 59); }, function (x) { return x % 12 && x !== 45; }, 50); return toFtIn('(c) ' + X + ' in to feet and inches', X, { text: 'e3c' }); } },
        { id: 'e3d', level: 'EMG', make: function (r) { var v = [r.int(3, 14), r.pick([3, 6, 9])]; return decFtPart('(d) ' + t(v[0] + "'\\," + v[1] + "''") + ' to decimal feet', v[0], v[1], { text: 'e3d' }); } },
        { id: 'e3e', level: 'EMG', make: function (r) { var x = r.int(2, 9) + 0.5; return fromDecFt('(e) ' + nS(x) + ' ft to feet and inches', x, { text: 'e3e' }); } },
        { id: 'e3f', level: 'EMG', make: function (r) { var v = [r.int(1, 8), r.pick([8, 4, 2, 10, 5, 7])]; return decFtPart('(f) ' + t(v[0] + "'\\," + v[1] + "''") + ' to decimal feet (nearest hundredth)', v[0], v[1], { text: 'e3f' }); } }] },
      { num: '4', outcome: 'M2', stem: 'Find each answer in feet and inches, with fewer than 12 inches.', parts: [
        { id: 'e4a', level: 'EMG', make: function (r) { var v = find(function () { return [r.int(1, 5) * 192 + r.int(6, 11) * 16, r.int(2, 6) * 192 + r.int(3, 11) * 16]; }, function (v) { return ftin(v[0])[1] + ftin(v[1])[1] >= 208; }, [2 * 192 + 176, 4 * 192 + 80]); return ftinSel('(a) ' + hx(v[0]) + ' + ' + hx(v[1]), v[0] + v[1], { bad: addBad(v), sol: addSol(v), hints: ['Add feet to feet and inches to inches, then regroup 12 in as 1 ft.'], text: 'e4a' }); } },
        { id: 'e4b', level: 'EMG', make: function (r) { var v = find(function () { return [r.int(7, 12) * 192 + r.int(0, 4) * 16, r.int(2, 5) * 192 + r.int(5, 11) * 16]; }, function (v) { return ftin(v[0])[1] < ftin(v[1])[1]; }, [10 * 192 + 16, 3 * 192 + 112]); return ftinSel('(b) ' + hx(v[0]) + ' − ' + hx(v[1]), v[0] - v[1], { bad: subBadF(v[0], v[1]), sol: subSolF(v[0], v[1]), hints: ['Borrow 1 ft = 12 in when there aren’t enough inches on top.'], text: 'e4b' }); } },
        { id: 'e4c', level: 'EMG', make: function (r) { var v = find(function () { return [r.int(2, 4), r.int(2, 4) * 192 + r.int(4, 11) * 16]; }, function (v) { return v[0] * ftin(v[1])[1] >= 192; }, [3, 3 * 192 + 80]), k = v[0], A = v[1], a = ftin(A);
          return ftinSel('(c) ' + t(k + '\\times ' + ftinT(A)), k * A, { bad: [[k * a[0] * 192 + a[1], 'u3l4-mult-feet', 'Multiply the inches by ' + k + ' too.'], [k * A + 32 * Math.floor(k * a[1] / 192), 'u3l4-trade10', 'Trade <b>12</b> in for each foot, not 10.'], [k * A - 192 * Math.floor(k * a[1] / 192), 'u3l4-no-carry', 'You took the 12s out of the inches — now add that many feet.']], sol: mulSol(k, A), hints: ['Multiply the feet and the inches, then regroup.'], text: 'e4c' }); } }] },
      { num: '5', section: 'B. Applying', outcome: 'M1', stem: '', parts: [
        { id: 'e5', level: 'EMG', make: function (r) { var w = r.pick([1.85, 1.2, 0.95, 2.15, 1.45]), d = r.pick([2032, 2134, 1981, 2440]);
          return fld('A tape measure shows a window is ' + N(w) + ' m wide. Write the width in cm and in mm. A door is ' + fN(d) + ' mm tall. Write its height in m.', [
            { label: 'Window:', name: 'window in cm', v: shift(w, 2), after: 'cm', o: { bad: [[shift(w, 3), 'u3l4-si-steps', 'm to cm is 2 steps: × 100.'], [shift(w, -2), 'u3l4-si-dir', 'cm is smaller, so multiply.']] } },
            { label: 'Window:', name: 'window in mm', v: shift(w, 3), after: 'mm', o: { bad: [[shift(w, 2), 'u3l4-si-steps', 'm to mm is 3 steps: × 1000.'], [shift(w, 1), 'u3l4-si-steps', 'm to mm is 3 steps: × 1000.']] } },
            { label: 'Door:', name: 'door in m', v: shift(d, -3), after: 'm', o: { bad: [[shift(d, -2), 'u3l4-si-steps', 'mm to m is 3 steps: ÷ 1000.'], [shift(d, 3), 'u3l4-si-dir', 'Metres are bigger, so divide.']] } }],
            t(N(w) + '\\times 100=' + N(shift(w, 2))) + ' cm; ' + t(N(w) + '\\times 1000=' + N(shift(w, 3))) + ' mm<br>' + t(N(d) + '\\div 1000=' + N(shift(d, -3))) + ' m', ['m → cm: × 100; m → mm: × 1000; mm → m: ÷ 1000.'], 'window door', { swap: false }); } }] },
      { num: '6', outcome: 'M3', stem: function (sh) { return 'Each school day ' + sh.who + ' bikes ' + N(sh.a) + ' km from home to school, then ' + sh.b + ' m from school to her job, then ' + N(sh.c) + ' km from her job back home.'; },
        shared: function (r) { return find(function () { return { a: r.int(15, 35) / 10, b: r.pick([650, 450, 850, 720, 380]), c: r.int(20, 40) / 10, who: r.pick(['Zoe', 'Kayla', 'Sofia', 'Hana']), days: r.pick([5, 5, 4]) }; }, function (v) { return !(v.a === 2.4 && v.b === 650 && v.c === 2.9); }, { a: 2.1, b: 450, c: 3.2, who: 'Zoe', days: 5 }); }, parts: [
        { id: 'e6a', level: 'EMG', make: function (r, sh) { var T = q(sh.a + sh.b / 1000 + sh.c); return num('(a) How far does she bike each day, in km?', T, { after: 'km', bad: [[sh.a + sh.b + sh.c, 'u3l4-no-convert', 'Change ' + sh.b + ' m to km first (÷ 1000).'], [sh.a + sh.b / 100 + sh.c, 'u3l4-si-steps', 'm to km is ÷ 1000.'], [T * 1000, 'u3l4-unit', 'Give the answer in km.']], sol: t(sh.b + '\\text{ m}=' + nS(sh.b / 1000) + '\\text{ km}') + '; ' + t(N(sh.a) + '+' + nS(sh.b / 1000) + '+' + N(sh.c) + '=' + N(T)) + ' km', hints: ['Change the metres to km, then add.'], text: 'bike day' }); } },
        { id: 'e6b', level: 'EMG', make: function (r, sh) { var T = q(sh.a + sh.b / 1000 + sh.c); return num('(b) How far does she bike in a ' + sh.days + '-day week?', q(T * sh.days), { after: 'km', bad: [[T, 'u3l4-one-day', 'That’s one day. Multiply by ' + sh.days + '.'], [T * 7, 'u3l4-one-day', 'She bikes on ' + sh.days + ' school days, not 7.']], sol: t(sh.days + '\\times ' + N(T) + '=' + N(q(T * sh.days))) + ' km', hints: ['Multiply one day by the number of days.'], text: 'bike week' }); } }] },
      { num: '7', outcome: 'M3', stem: '', parts: [
        { id: 'e7', level: 'PRG', make: function (r) { var v = find(function () { return [r.int(10, 16) * 192 + r.int(3, 10) * 16, r.int(3, 5) * 192 + r.int(5, 11) * 16]; }, function (v) { return 2 * ftin(v[0])[1] + ftin(v[1])[1] >= 192 && !(v[0] === 14 * 192 + 112 && v[1] === 3 * 192 + 160); }, [12 * 192 + 128, 4 * 192 + 144]), list = [v[0], v[0], v[1]];
          return ftinSel('A hallway has two long walls that are each ' + hx(v[0]) + ' and an end wall that is ' + hx(v[1]) + '. How much baseboard trim does it need?', v[0] * 2 + v[1], { bad: addBad(list).concat([[v[0] + v[1], 'u3l4-one-wall', 'There are <b>two</b> long walls.']]), sol: addSol(list), hints: ['Add all three walls: two long walls and the end wall.', 'Regroup 12 in as 1 ft.'], text: 'hallway trim' }); } }] },
      { num: '8', outcome: 'M2', stem: '', parts: [
        { id: 'e8', level: 'EMG', make: function (r) { var x = find(function () { return q(r.int(8, 15) + r.pick([0.6, 0.4, 0.3, 0.8, 0.9, 0.2])); }, function (x) { return x !== 11.6 && [5.6, 7.3].indexOf(x) < 0; }, 11.6); return fromDecFt('A laser measure shows that a room is ' + nS(x) + ' ft long. Write the length in feet and inches, to the nearest inch.', x, { text: 'laser' }); } }] },
      { num: '9', outcome: 'M3', stem: '', parts: [
        { id: 'e9', level: 'PRG', make: function (r) { var v = find(function () { var L = r.pick([58, 60, 62, 63]), nw = 4 * 192 + r.int(4, 11) * 16 + r.pick([8, 4, 12]); return [L, nw]; }, function (v) { return v[0] * 16 - v[1] >= 16 && v[0] * 16 - v[1] <= 112 && !(v[0] === 60 && v[1] === 4 * 192 + 136); }, [62, 4 * 192 + 156]), L = v[0], nw = v[1], cut = L * 16 - nw, who = r.pick(['Ty', 'Malik', 'Cody', 'Liam']);
          return inPart('A new hockey stick is ' + L + ' in long. ' + who + ' cuts it so it is ' + hx(nw) + ' long. How much did he cut off?', cut, { bad: [[L * 16 - (4 * 160 + (nw - 4 * 192)), 'u3t-ten', '1 ft = 12 in: ' + hx(nw) + ' = 48 + ' + t(inT(nw - 768)) + ' in.'], [L * 16 - (nw - 768), 'u3l4-not-x12', 'Change ' + hx(nw) + ' to inches first: 4 × 12 + ' + t(inT(nw - 768)) + '.']],
            sol: hx(nw) + ' = ' + t('48+' + inT(nw - 768) + '=' + inT(nw)) + ' in<br>' + t(L + '-' + inT(nw) + '=' + inT(cut)) + ' in', hints: ['Change the new length to inches.', 'Subtract it from ' + L + ' in.'], text: 'stick cut' }); } }] },
      { num: '10', outcome: 'M2', stem: '', parts: [
        { id: 'e10', level: 'BEG', make: function (r) { var v = r.pick([2.5, 1.5, 3.5, 4, 0.5]), opts = [[v * 12, 'That uses 12 (inches in a <b>foot</b>). 1 yd = 36 in.'], [v * 36, null], [v * 3, 'That uses 3 (feet in a yard). The question asks for inches: 1 yd = 36 in.'], [v / 36, 'Inches are smaller than yards, so multiply.']];
          return P.mc(r, 'How many inches are in ' + nS(v) + ' yd?', opts.map(function (o, i) { return { html: nS(rd(o[0], 2)) + ' in', right: i === 1, why: o[1], code: 'o' + i }; }), '1 yd = 36 in, so ' + t(nS(v) + '\\times 36=' + nS(v * 36)) + ' in.', ['1 yd = 3 ft = 36 in.'], 'yd to in MC', true); } }] },
      { num: '11', outcome: 'M2', stem: '', parts: [
        { id: 'e11', level: 'BEG', make: function (r) { var y = r.pick([33, 25, 40, 55, 60, 35]); return num('A roll of duct tape holds ' + y + ' yd of tape. The length of the tape in feet is ________ ft.', 3 * y, { nr: true, bad: [[y / 3, 'u3l4-imp-dir', 'Feet are smaller than yards: multiply by 3.'], [36 * y, 'u3l4-yd12', 'That’s inches. 1 yd = <b>3</b> ft.'], [12 * y, 'u3l4-wrong-fact', '1 yd = 3 ft.']], sol: t(y + '\\times 3=' + 3 * y) + ' ft', hints: ['1 yd = 3 ft.'], text: 'NR duct tape' }); } }] },
      { num: '12', section: 'C. Stretch', outcome: 'M3', stem: '', parts: [
        { id: 'e12', level: 'MAS', make: function (r) {
          var v = find(function () { var L = r.pick([8, 10]), n = L === 8 ? r.pick([3, 4]) : r.pick([4, 5]), p = Math.floor(L * 192 / n / 16) * 16 - r.pick([4, 2, 8, 6, 3]); return { L: L, n: n, p: p }; }, function (v) { var used = v.n * v.p + (v.n - 1) * 2; return used <= v.L * 192 && v.L * 192 - used >= 2 && !(v.L === 8 && v.n === 4 && v.p === 380); }, { L: 10, n: 5, p: 378 });
          var Lin = v.L * 192, cuts = v.n - 1, used = v.n * v.p + cuts * 2, lf = Lin - used;
          var flds = [{ label: 'Length needed:', after: 'in', name: 'Length needed', mode: 'math', keys: 'u3mixed', placeholder: T3.PH }, { label: 'Left over:', after: 'in', name: 'Left over', mode: 'math', keys: 'u3mixed', placeholder: T3.PH }];
          var p = P.fields('A cabinet maker cuts ' + (v.L === 8 ? 'an' : 'a') + ' ' + v.L + ' ft board into pieces that are each ' + t(inT(v.p) + "''") + ' long. Each saw cut turns ' + t("\\tfrac{1}{8}''") + ' of wood into sawdust. Can she get ' + v.n + ' pieces from one board? Find the length the ' + v.n + ' pieces and the ' + cuts + ' saw cuts need, and how much is left over.', flds,
            [inChk(used, { bad: [[v.n * v.p, 'u3l4-kerf', 'Add the sawdust: ' + cuts + ' cuts × ' + t('\\frac{1}{8}') + ' in.'], [v.n * v.p + v.n * 2, 'u3l4-cuts', v.n + ' pieces need only ' + cuts + ' cuts (the last piece is what is left).']] }), inChk(lf, { bad: [[Lin - v.n * v.p, 'u3l4-kerf', 'Take away the sawdust from the cuts too.'], [Lin - v.n * v.p - v.n * 2, 'u3l4-cuts', v.n + ' pieces need ' + cuts + ' cuts.'], [v.n * v.p + cuts * 2 - Lin + 2 * Lin, 'u3l4-added', 'Leftover = board − length needed.']] })],
            [inT(used), inT(lf)], 'Needed ' + t(inU(used)) + ' &nbsp; Left over ' + t(inU(lf)),
            v.L + ' ft = ' + t(v.L + '\\times 12=' + 12 * v.L) + ' in. ' + v.n + ' pieces need ' + cuts + ' cuts (the last piece is what is left).<br>' + t(v.n + '\\times ' + inT(v.p) + '=' + inT(v.n * v.p)) + ' in; ' + t(cuts + '\\times\\frac{1}{8}=' + inT(cuts * 2)) + ' in; total ' + t(inU(used)) + '<br>Yes, ' + t(inU(used)) + ' is less than ' + 12 * v.L + ' in. Leftover: ' + t(12 * v.L + '-' + inT(used) + '=' + inT(lf)) + ' in.',
            ['Change the board to inches.', 'Pieces × length, plus the cuts × ' + t('\\frac{1}{8}') + ' in.'], 'kerf');
          p.bad = [[inT(v.n * v.p), inT(Lin - v.n * v.p)]]; return p;
        } }] },
      { num: '13', outcome: 'M3', stem: function (sh) { return 'On a staircase, each step rises ' + t(inT(sh.rise) + "''") + '.'; },
        shared: function (r) { return find(function () { var rise = r.int(6, 7) * 16 + r.pick([4, 8, 12]), n = r.int(11, 16), H = r.int(7, 9) * 192 + r.int(1, 11) * 16, mx = 7 * 16 + r.pick([8, 12]); return { rise: rise, n: n, H: H, mx: mx }; }, function (v) { return (v.n * v.rise) % 192 !== 0 && !(v.rise === 116 && v.n === 13) && !(v.H === 8 * 192 + 144 && v.mx === 120); }, { rise: 108, n: 14, H: 8 * 192 + 96, mx: 124 }); }, parts: [
        { id: 'e13a', level: 'ADV', make: function (r, sh) { var T = sh.n * sh.rise;
          return ftinSel('(a) A staircase has ' + sh.n + ' rises. How high does it climb, in feet and inches?', T, { frac: true, bad: [[sh.n * Math.floor(sh.rise / 16) * 16, 'u3l4-no-extra', 'Multiply the fraction part too: ' + t(sh.n + '\\times ' + inT(sh.rise)) + '.'], [T + 32 * Math.floor(T / 192), 'u3t-ten', 'There are 12 in in a foot, not 10.']],
            sol: t(sh.n + '\\times ' + inT(sh.rise) + '=' + sh.n + '\\times ' + nS(sh.rise / 16) + '=' + nS(T / 16)) + ' in<br>' + t(nS(T / 16) + '-' + Math.floor(T / 192) + '\\times 12=' + inT(T % 192)) + ', so ' + hx(T), hints: ['Multiply the rise by the number of rises (decimals help: ' + t(inT(sh.rise) + '=' + nS(sh.rise / 16)) + ').', 'Change the inches to feet and inches.'], text: 'stair climb' }); } },
        { id: 'e13b', level: 'MAS', make: function (r, sh) { var Hin = sh.H / 16, m = sh.mx / 16, n = Math.ceil(Hin / m - 1e-9);
          return num('(b) Another staircase must climb ' + hx(sh.H) + ', and each rise can be at most ' + t(inT(sh.mx) + "''") + '. What is the fewest number of rises it can have?', n, { after: 'rises', bad: [[Math.floor(Hin / m + 1e-9), 'u3l4-round-down', 'With ' + Math.floor(Hin / m + 1e-9) + ' rises, each rise would be more than ' + t(inT(sh.mx) + "''") + '. Round <b>up</b>.'], [Hin / m, 'u3l4-exact', 'The number of rises must be a whole number. Round up.', 'form'], [(Math.floor(sh.H / 192) * 10 + (sh.H % 192) / 16) / m, 'u3t-ten', '1 ft = 12 in.']],
            sol: hx(sh.H) + ' = ' + t(Math.floor(sh.H / 192) + '\\times 12+' + (sh.H % 192) / 16 + '=' + Hin) + ' in<br>' + t(Hin + '\\div ' + nS(m) + '=' + (same(Hin / m, rd(Hin / m, 2)) ? nS(Hin / m) : nS(rd(Hin / m, 2)) + '\\ldots')) + (Number.isInteger(q(Hin / m)) ? '' : ', round up') + '<br>It needs at least ' + n + ' rises.', hints: ['Change the height to inches.', 'Divide by the biggest rise allowed, then round up.'], text: 'fewest rises' }); } }] },
      { num: '14', outcome: 'M3', stem: '', parts: [
        { id: 'e14', level: 'ADV', make: function (r) { var v = find(function () { return [r.pick([1.5, 2.5, 0.75, 3, 1.25, 2]), r.pick([4, 5, 6, 8])]; }, function (v) { return Number.isInteger(q(v[0] * 5280 / v[1])) && !(v[0] === 2.5 && v[1] === 5); }, [1.5, 6]), ft = q(v[0] * 5280), n = ft / v[1];
          return num('A town is building ' + nS(v[0]) + ' mi of new sidewalk. Each concrete slab is ' + v[1] + ' ft long. How many slabs long is the new sidewalk? Use unit factors.', n, { after: 'slabs', bad: [[v[0] * 1760 / v[1], 'u3l4-1760', '1 mi = 5280 <b>ft</b> (1760 is yards).'], [ft * v[1], 'u3l4-div-way', 'Divide the length by the length of one slab.'], [v[0] / v[1], 'u3l4-no-convert', 'Change the miles to feet first.'], [ft, 'u3l4-unit', 'That’s the length in feet. Now divide by ' + v[1] + ' ft per slab.']],
            sol: t(nS(v[0]) + '\\text{ mi}\\times\\dfrac{5280\\text{ ft}}{1\\text{ mi}}=' + N(ft) + '\\text{ ft}') + '<br>' + t(N(ft) + '\\div ' + v[1] + '=' + N(n)) + ' slabs', hints: ['Change the miles to feet with the unit factor 5280 ft / 1 mi.', 'Divide by the length of one slab.'], text: 'sidewalk slabs' }); } }] }]
  });
})(window);
