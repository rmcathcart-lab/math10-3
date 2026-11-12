/* Math 10-3 · Unit 3 · Lesson 5 — Converting Length Between SI and Imperial (M1 for SI → imperial, M2 for imperial → SI,
 * M3 for length problems; tagged per part)
 * Assignment 5 (u3_l05.tex, Questions 1–18) and the Lesson 5 Extra Practice (u3_ep05.tex, A 1–5, B 6–12, C 13–15).
 * Every part is a generator: the same units, kind of numbers and difficulty as the booklet item, new numbers around the
 * booklet's (the lesson's worked-example numbers are left out). Calculator allowed.
 * Facts exactly as the booklet gives them: 1 in = 2.54 cm = 25.4 mm, 1 ft = 30.48 cm, 1 yd = 0.9144 m, 1 m ≈ 3.28 ft,
 * 1 mi ≈ 1.609 km, 1 km ≈ 0.621 mi. (km → mi by ÷ 1.609 and m → ft by ÷ 0.3048 are accepted too.)
 * Answers: typed numbers (a unit typed after the number is ignored; "3 1/2" is read as 3.5); rounding as the booklet asks
 * (too many decimals → nudge, too few → nudge, rounding the wrong way → wrong with a hint); heights in feet and inches →
 * two boxes (inches must be under 12: nudge); nearest-sixteenth answers → a mixed number on the fraction keypad
 * (unsimplified → nudge, improper → nudge, a decimal → nudge). Recognised wrong values each get their own hint:
 * dividing instead of multiplying (or the reverse), the 2.5 / 30 / 1.6 estimate instead of the exact fact, the wrong fact
 * (2.54 for feet, 0.621 for miles → km, 25.4 for cm), 5′ 4″ read as 5.4 ft, inches not changed, cm not changed to m,
 * the decimal part of the feet taken as inches, the decimal part not × 16, rounding the sixteenths down, not rounding
 * fabric up to the next ¼ yd, one sponsor instead of all, the tax left out, comparing the shelf numbers, and so on.
 * Conversions: "which is longer? how I know" (table) → one multiple choice per row whose options pair a length with its
 * evidence; "estimate in your head" → a number box that takes any sensible estimate; the height table → one part per row
 * (two boxes for feet and inches); "without a calculator, how can you tell…", "is she right?", "will it fit?", "who is
 * taller?", "which store?", "over or under?", "which pipe is wider?", "why is 29 7/8 safer?" → multiple choice (the
 * choice with its reason), followed by a number part for the evidence where the booklet asks "by how much".
 *
 * Shared kit for later Unit 3 lessons: HW.u3l5kit (u3l6.js uses it, so this file must load BEFORE u3l6.js): the
 * booklet's length facts, a number reader that ignores typed units and reads "3 1/2", a rounding-aware checker with
 * targeted wrong values, number / multi-box / estimate / conversion part builders, feet-and-inches two-box answers, a
 * mixed-number (fraction keypad) checker, a small SVG figure drawer (lines, arcs, labels, right angles, ticks, dimension
 * arrows) and multiple choice. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, ex = HW.ex;

  /* ======================= the Unit 3 length kit (HW.u3l5kit) ======================= */
  var C = HW.u3l5kit = HW.u3l5kit || {};

  /* a fraction keypad with a second key for mixed numbers (same keys as Math 15 u1l2; only added if no lesson has one) */
  var W = HW.widgets;
  if (W && W.KEYSETS && !W.KEYSETS.mixed) {
    var dk = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
    W.KEYSETS.mixed = [
      [dk(7), dk(8), dk(9), { label: '<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#@}{#?}', plain: '/', title: 'Fraction: type the top number first' }, { label: '⌫', fn: 'del', title: 'Delete' }],
      [dk(4), dk(5), dk(6), { label: 'n<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#?}{#?}', plain: ' ', title: 'Mixed number: type the whole number first' }, { label: 'clear', fn: 'clear' }],
      [dk(1), dk(2), dk(3), { label: '−', tex: '-', plain: '-' }, { label: '◀', fn: 'left', title: 'Move left' }, { label: '▶', fn: 'right', title: 'Move right (to the next box)' }],
      [dk(0), { label: '.', tex: '.', plain: '.' }, { label: 'Check ↵', fn: 'enter', wide: true }]];
    W.KEYHELP = W.KEYHELP || {};
    W.KEYHELP.mixed = ['Mixed number: type the whole number, press <b>n<sup>a</sup>⁄<sub>b</sub></b>, then type the top and bottom numbers. Fraction: type the top number, press <b><sup>a</sup>⁄<sub>b</sub></b>, then the bottom number. Press <b>▶</b> to move to the next box.',
      'Type a mixed number as <code>2 3/4</code> (a space between the whole number and the fraction) and a fraction as <code>3/4</code>.'];
  }

  /* the booklet's facts. key 'from>to': [factor, multiply?] */
  C.FX = {
    'in>cm': [2.54, true], 'cm>in': [2.54, false], 'in>mm': [25.4, true], 'mm>in': [25.4, false], 'ft>cm': [30.48, true], 'cm>ft': [30.48, false],
    'ft>m': [0.3048, true], 'm>ft': [3.28, true], 'yd>m': [0.9144, true], 'm>yd': [0.9144, false], 'yd>cm': [91.44, true], 'mi>km': [1.609, true], 'km>mi': [0.621, true], 'm>in': [39.37, true]
  };
  var UNAME = { in: 'inches', cm: 'centimetres', mm: 'millimetres', ft: 'feet', m: 'metres', yd: 'yards', mi: 'miles', km: 'kilometres' };
  C.UNAME = UNAME;

  function q(x) { return Math.round(x * 1e9) / 1e9; }
  function rd(x, dp) { return K.roundTo(x, dp); }
  function trunc(x, d) { var f = Math.pow(10, d); return Math.floor(x * f + 1e-9) / f; }
  function near(a, b, e) { return Math.abs(a - b) <= (e == null ? 1e-9 * Math.max(1, Math.abs(a), Math.abs(b)) : e); }
  function nS(x, dp) { x = q(x); return dp != null ? x.toFixed(dp) : String(x); }
  function decs(x) { return (nS(x).split('.')[1] || '').length; }
  function N(x, dp) { var s = nS(x, dp); return Math.abs(x) >= 10000 ? HW.fmt(s) : s; }                       // TeX: 64\,000
  function Np(x, dp) { var s = nS(x, dp); return Math.abs(x) >= 10000 ? HW.fmt(s, true) : s; }               // text: 64 000
  function raw(x, k) { var s = +x.toFixed(k == null ? 3 : k); return N(s) + (near(x, s, 1e-9) ? '' : '\\ldots'); }
  function eqR(x, dp) { return dp == null || near(x, rd(x, dp), 1e-9) ? '=' + N(dp == null ? q(x) : rd(x, dp), dp) : '=' + raw(x, Math.max(dp + 2, 3)) + '\\approx ' + N(rd(x, dp), dp); }
  function uT(s) { s = String(s || '').replace(/^ +/, ''); if (!s) return ''; return ('\\text{' + (s.charAt(0) === '/' ? '' : ' ') + s + '}').replace(/²/g, '}^2\\text{').replace(/\\text\{\}/g, ''); }
  function br(a) { return (Array.isArray(a) ? a : [a]).filter(Boolean).join('<br>'); }
  function find(gen, test, fb) { for (var i = 0; i < 800; i++) { var v = gen(); if (v && test(v)) return v; } if (fb === undefined) throw new Error('u3l5kit: no numbers found'); return fb; }
  function pickR(r, lo, hi, step) { step = step || 1; return q(lo + step * r.int(0, Math.round((hi - lo) / step))); }
  function roundUp(v, step) { return q(Math.ceil(q(v / step) - 1e-9) * step); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function placeWord(dp, money) { return money ? 'the nearest cent' : dp === 0 ? 'the nearest whole number' : dp === 1 ? 'the nearest tenth' : dp === 2 ? 'the nearest hundredth' : dp === 3 ? 'the nearest thousandth' : dp + ' decimal places'; }
  function M(x) { return '\\$' + rd(x, 2).toFixed(2); }
  function Mp(x) { return '$' + rd(x, 2).toFixed(2); }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var x = a % b; a = b; b = x; } return a; }
  function R(p, d) { if (d < 0) { p = -p; d = -d; } var g = gcd(p, d) || 1; return [p / g, d / g]; }
  /* a fraction of an inch: [p, d] → TeX mixed number (2\frac{9}{16}), dfrac for prompts */
  function mT(a, big) { var p = a[0], d = a[1], fr = big ? '\\dfrac' : '\\frac'; if (d === 1) return String(p); var w = Math.floor(p / d), n = p % d; return (w ? w : '') + (n ? fr + '{' + n + '}{' + d + '}' : ''); }
  function mTxt(a) { var p = a[0], d = a[1]; if (d === 1) return String(p); var w = Math.floor(p / d), n = p % d; return (w ? w + ' ' : '') + n + '/' + d; }
  var NAMES = ['Amara', 'Kai', 'Malik', 'Noor', 'Jordan', 'Priya', 'Mateo', 'Kayla', 'Liam', 'Hana', 'Rosa', 'Theo', 'Aisha', 'Ben', 'Maya', 'Dani', 'Sofia', 'Omar', 'Jaya', 'Eli', 'Zara', 'Nico'];
  /* feet and inches: total inches → text / TeX */
  function FI(i) { i = q(i); var f = Math.floor(i / 12 + 1e-9), n = q(i - 12 * f); return f + ' ft ' + Np(n) + ' in'; }
  function FIt(i) { i = q(i); var f = Math.floor(i / 12 + 1e-9), n = q(i - 12 * f); return f + '\\text{ ft }' + N(n) + '\\text{ in}'; }
  function FP(i) { i = q(i); var f = Math.floor(i / 12 + 1e-9), n = q(i - 12 * f); return f + '′ ' + Np(n) + '″'; }
  function FPt(i) { i = q(i); var f = Math.floor(i / 12 + 1e-9), n = q(i - 12 * f); return f + "'\\," + N(n) + "''"; }
  Object.assign(C, { q: q, rd: rd, trunc: trunc, near: near, nS: nS, decs: decs, N: N, Np: Np, raw: raw, eqR: eqR, uT: uT, br: br, find: find, pickR: pickR, roundUp: roundUp, cap: cap,
    placeWord: placeWord, M: M, Mp: Mp, gcd: gcd, R: R, mT: mT, mTxt: mTxt, NAMES: NAMES, FI: FI, FIt: FIt, FP: FP, FPt: FPt });

  /* ---- reading a typed number: strips $, \text{…}, a unit after the number ("35.6 cm"), reads "3 1/2" and "3/4" ---- */
  function readNum(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\(?:text|mathrm)\{([^{}]*)\}/g, '$1');
    s = s.replace(/\\\$|\$/g, '').replace(/\\[,;: !]|~| | /g, ' ').replace(/\\[dt]?frac\{?(\d+)\}?\{(\d+)\}/g, '$1/$2').replace(/\\[dt]?frac(\d)(\d)/g, '$1/$2').trim();
    var fm = /^(\d+)?\s*(\d+)\s*\/\s*(\d+)\s*([a-zA-Z'"].*)?$/.exec(s);
    if (fm && +fm[3] > 0) { var v0 = (fm[1] ? +fm[1] : 0) + fm[2] / fm[3]; return { v: q(v0), d: 9, unit: fm[4] || '', len: s.length, frac: true }; }
    var unit = '', um = /^(-?[\d.,\s]*\d\.?)\s*([a-zA-Z\/³²^°%'"][\s\S]*)$/.exec(s);
    if (um) { s = um[1].trim(); unit = um[2]; }
    if (/^-?\d*,\d{1,2}$/.test(s.replace(/\s/g, ''))) return { res: form('u3len-comma', 'Use a decimal point (not a comma), like 12.5.') };
    var p = HW.parse.number(s);
    if (!p.ok) return { res: p.code === 'empty' ? form('empty', 'Type your answer first.') : form('notnumber', 'Type a single number (the unit is already written beside the box).') };
    var pl = HW.parse.plain(s).replace(/[\s,]/g, ''), d = (pl.split('.')[1] || '').length;
    return { v: p.value, d: d, unit: unit, len: pl.replace(/^-/, '').length };
  }
  C.readNum = readNum;

  /* ---- one number. o: { dp (rounding place; null = exact), money, exact (unrounded value, for the rounding-direction hint),
   *   exactOk (the unrounded value is right too), alts (other right values, rounded to dp), bad [[value, code, hint, 'form'?]],
   *   nr (numerical response, 4 characters), miss (hint for any other value) } ---- */
  C.chk = function (ans, o) {
    o = o || {};
    var dp = o.money ? 2 : o.dp, exact = o.exact != null ? o.exact : ans, want = dp == null ? q(ans) : rd(ans, dp), step = dp == null ? 0 : Math.pow(10, -dp);
    var acc = [want].concat((o.alts || []).map(function (a) { return dp == null ? q(a) : rd(a, dp); }));
    if (o.exactOk) acc.push(q(exact));
    function tl(y) { return dp == null ? 1e-7 * Math.max(1, Math.abs(y)) : step / 20; }
    function isAcc(v) { return acc.some(function (y) { return Math.abs(v - y) <= tl(y); }); }
    var seen = [], bad = (o.bad || []).filter(function (b) {
      if (!b || !isFinite(b[0]) || isAcc(b[0]) || (dp != null && isAcc(rd(b[0], dp)))) return false;
      if (seen.some(function (x) { return near(x, b[0], 1e-9); })) return false; seen.push(b[0]); return true;
    });
    function mBad(v, d, b) {
      return Math.abs(v - b) <= 1e-6 * Math.max(1, Math.abs(b)) || (d >= 1 && d <= 6 && (near(v, rd(b, d)) || near(v, trunc(b, d)))) ||
        (d === 0 && (dp === 0 || Math.abs(b - Math.round(b)) < 1e-6) && near(v, rd(b, 0)));
    }
    var place = placeWord(dp, o.money);
    var f = function (resp) {
      var a = readNum(resp); if (a.res) return a.res;
      var v = a.v, d = a.d, i;
      if (isAcc(v)) { if (o.nr && a.len > 4) return form('nr-long', 'Numerical response answers fit in 4 boxes (digits and a decimal point only).'); return ok(); }
      if (dp != null && d > dp && d < 9 && isAcc(rd(v, dp))) return form('round', 'Right — now round to ' + place + '.');
      if (dp != null && d < dp && acc.some(function (y) { return near(v, rd(y, d)) || near(v, trunc(y, d)); }))
        return form('places', o.money ? 'Give the amount to the cent (2 decimal places), like $12.50.' : 'Round to ' + place + ' (' + dp + ' decimal place' + (dp === 1 ? '' : 's') + ').');
      for (i = 0; i < bad.length; i++) if (mBad(v, d, bad[i][0])) return bad[i][3] === 'form' ? form(bad[i][1], bad[i][2]) : wrong(bad[i][1], bad[i][2]);
      if (dp == null && d < decs(want) && (near(v, rd(want, d)) || near(v, trunc(want, d)))) return form('u3len-exact', 'Close, but don’t round this answer: give the exact value (' + decs(want) + ' decimal place' + (decs(want) === 1 ? '' : 's') + ').');
      if (dp != null && d === dp && !near(exact, want, 1e-9) && near(Math.abs(v - want), step, step / 20) && Math.abs(v - exact) < step)
        return wrong('u3len-round-dir', 'Check your rounding: look at the next digit. 5 or more rounds up; 4 or less rounds down.');
      if (o.nr && a.len > 4) return form('nr-long', 'Numerical response answers fit in 4 boxes (digits and a decimal point only).');
      return wrong('value', o.miss || null);
    };
    f.bad = bad; f.key = o.exactOk && decs(exact) <= 4 ? nS(exact) : dp != null ? want.toFixed(dp) : nS(want); f.keyDp = o.exactOk ? null : dp;
    return f;
  };
  /* an estimate: anything from lo to hi is fine; bad = [[value, code, hint]] for the far-off mistakes (within 12% of them) */
  C.estChk = function (lo, hi, o) {
    o = o || {}; var bad = (o.bad || []).filter(function (b) { return b && isFinite(b[0]) && (b[0] < lo * 0.9 || b[0] > hi * 1.1); });
    var f = function (resp) {
      var a = readNum(resp); if (a.res) return a.res;
      if (a.v >= lo - 1e-9 && a.v <= hi + 1e-9) return ok();
      for (var i = 0; i < bad.length; i++) if (Math.abs(a.v - bad[i][0]) <= 0.12 * Math.abs(bad[i][0])) return wrong(bad[i][1], bad[i][2]);
      return wrong('u3len-est', o.miss || 'An estimate should be close to the real length. Use the quick estimate in the box above the question.');
    };
    f.bad = bad; return f;
  };

  /* ---- a number part. o: dp, money, exact, exactOk, alts, bad, before, after (unit beside the box), sol, hints, text, nr ---- */
  C.num = function (prompt, ans, o) {
    o = o || {}; ans = q(ans);
    var chk = C.chk(ans, o), key = chk.key;
    var p = { prompt: prompt, input: { type: 'number', before: o.money ? '$' : o.before, after: o.after, nr: !!o.nr }, check: chk, key: key,
      answer: t((o.money ? '\\$' : '') + N(Number(key), chk.keyDp) + uT(o.after)), solution: br(o.sol), hints: o.hints || [], text: o.text };
    p.bad = chk.bad.filter(function (b) { return b[3] !== 'form'; }).map(function (b) { return nS(rd(b[0], 6)); });
    p.good = o.nr ? [] : [key + (o.after ? ' ' + o.after : '')].concat(o.money ? ['$' + key] : []);
    return p;
  };
  /* ---- an estimate part: any value in [lo, hi] ---- */
  C.est = function (prompt, lo, hi, show, o) {
    o = o || {}; var chk = C.estChk(lo, hi, o);
    var p = { prompt: prompt, input: { type: 'number', before: o.before || 'about', after: o.after }, check: chk, key: nS(show), answer: t('\\text{about }' + N(show) + uT(o.after)) + (o.range === false ? '' : ' (anything from ' + Np(lo) + ' to ' + Np(hi) + ' is a fair estimate)'),
      solution: br(o.sol), hints: o.hints || [], text: o.text };
    p.bad = chk.bad.map(function (b) { return nS(rd(b[0], 6)); });
    return p;
  };
  /* ---- several boxes. rows: [{ label, name, ans, dp, money, exact, exactOk, alts, bad, before, after }] ---- */
  C.fields = function (prompt, rows, sol, hints, text) {
    var chks = rows.map(function (rw, i) {
      var others = rows.filter(function (x, j) { return j !== i && !near(q(x.ans), q(rw.ans), 1e-9); }).map(function (x) { return [x.ans, 'u3len-swap', 'That’s the answer for another box (' + (x.name || x.label.replace(/:$/, '')) + '). Check which box is which.']; });
      return C.chk(q(rw.ans), { dp: rw.dp, money: rw.money, exact: rw.exact, exactOk: rw.exactOk, alts: rw.alts, bad: (rw.bad || []).concat(others) });
    });
    var keys = rows.map(function (rw, i) { return chks[i].key; });
    var ans = rows.map(function (rw, i) { return rw.label + ' ' + t((rw.money ? '\\$' : '') + N(Number(keys[i]), chks[i].keyDp) + uT(rw.after)); }).join(' &nbsp; ');
    var p = P.fields(prompt, rows.map(function (rw) { return { label: rw.label, before: rw.money ? '$' : rw.before, after: rw.after, name: rw.name || rw.label.replace(/:$/, '') }; }), chks, keys, ans, br(sol), hints, text);
    var b0 = []; rows.forEach(function (rw, i) { var bb = chks[i].bad.filter(function (b) { return b[3] !== 'form'; })[0]; if (bb) { var arr = keys.slice(); arr[i] = nS(rd(bb[0], 6)); b0.push(arr); } });
    p.bad = b0.slice(0, 3);
    return p;
  };
  /* ---- multiple choice: opts [{ html, right, why, code }] ---- */
  C.mc = function (r, prompt, opts, sol, hints, text, keep) { return P.mc(r, prompt, opts, br(sol), hints || [], text, keep); };

  /* ---- unit factor TeX: 9 in × (2.54 cm / 1 in) ---- */
  function factorT(key) { var fx = C.FX[key], u = key.split('>'); return fx[1] ? '\\dfrac{' + N(fx[0]) + uT(u[1]) + '}{1' + uT(u[0]) + '}' : '\\dfrac{1' + uT(u[1]) + '}{' + N(fx[0]) + uT(u[0]) + '}'; }
  C.factorT = factorT;
  function convVal(x, key) { var fx = C.FX[key]; return q(fx[1] ? x * fx[0] : x / fx[0]); }
  C.convVal = convVal;
  /* the usual mistakes for one conversion */
  function convBad(x, key) {
    var fx = C.FX[key], f = fx[0], u = key.split('>'), from = u[0], to = u[1], b = [];
    var way = fx[1] ? 'You divided. ' + cap(UNAME[from]) + ' are ' + (f > 1 ? 'longer' : 'shorter') + ' than ' + UNAME[to] + ', so the number should get ' + (f > 1 ? 'bigger' : 'smaller') + ': multiply by ' + Np(f) + '.'
      : 'You multiplied. ' + cap(UNAME[from]) + ' are shorter than ' + UNAME[to] + ', so it takes <b>fewer</b> ' + UNAME[to] + ': divide by ' + Np(f) + '.';
    b.push([fx[1] ? x / f : x * f, 'u3len-wrong-way', way]);
    var est = { 'in>cm': 2.5, 'cm>in': 2.5, 'ft>cm': 30, 'cm>ft': 30, 'mi>km': 1.6, 'km>mi': 0.6, 'in>mm': 25, 'm>ft': 3 }[key];
    if (est) b.push([fx[1] ? x * est : x / est, 'u3len-estimate', 'That’s the quick estimate. For the answer, use the exact fact: ' + factLine(key) + '.']);
    var mix = {
      'in>cm': [[x * 25.4, 'u3len-mm-fact', '25.4 gives <b>millimetres</b>. For centimetres, multiply by 2.54.'], [x * 30.48, 'u3len-ft-fact', '30.48 is the fact for <b>feet</b>. For inches, use 1 in = 2.54 cm.']],
      'cm>in': [[x / 30.48, 'u3len-ft-fact', 'Dividing by 30.48 gives <b>feet</b>. For inches, divide by 2.54.'], [x / 25.4, 'u3len-mm-fact', 'The length is in centimetres, so divide by 2.54 (25.4 is for millimetres).']],
      'in>mm': [[x * 2.54, 'u3len-cm-not-mm', 'That’s in <b>centimetres</b>. For millimetres, multiply by 25.4 (1 in = 25.4 mm).']],
      'ft>cm': [[x * 2.54, 'u3len-in-fact', '2.54 is the fact for <b>inches</b>. For feet, use 1 ft = 30.48 cm.'], [x * 12, 'u3len-in-only', 'That’s the length in <b>inches</b>. Change to centimetres: 1 ft = 30.48 cm.'], [x * 0.3048, 'u3len-m-not-cm', 'That’s in <b>metres</b>. For centimetres, multiply by 30.48.']],
      'ft>m': [[x * 30.48, 'u3len-cm-not-m', 'That’s in <b>centimetres</b>. Divide by 100 to get metres.'], [x * 0.9144, 'u3len-yd-fact', '0.9144 is the fact for <b>yards</b>. 1 ft = 30.48 cm = 0.3048 m.'], [x * 3.28, 'u3len-wrong-way', 'A foot is shorter than a metre, so the number of metres is <b>smaller</b>: multiply by 0.3048 (or divide by 3.28).']],
      'm>ft': [[x * 39.37, 'u3len-in-not-ft', 'That’s in <b>inches</b>. For feet, use 1 m ≈ 3.28 ft.'], [x * 0.3048, 'u3len-wrong-way', 'A metre is longer than a foot, so there are <b>more</b> feet: multiply by 3.28.']],
      'm>yd': [[x * 3.28, 'u3len-ft-not-yd', 'That’s in <b>feet</b>. For yards, divide by 0.9144 (1 yd = 0.9144 m).'], [x / 3.28, 'u3len-ft-not-yd', 'For yards, divide by 0.9144 (1 yd = 0.9144 m).']],
      'yd>m': [[x * 3.28, 'u3len-ft-fact', 'Use the yard fact: 1 yd = 0.9144 m.'], [x * 0.3048, 'u3len-ft-fact', '0.3048 is the fact for <b>feet</b>. 1 yd = 0.9144 m.']],
      'mi>km': [[x * 0.621, 'u3len-km-mi-fact', '0.621 changes <b>km to miles</b>. For miles to km, multiply by 1.609.'], [x * 1609, 'u3len-m-not-km', 'That’s in <b>metres</b>. 1 mi ≈ 1.609 km.']],
      'km>mi': [[x / 0.621, 'u3len-wrong-way', 'A kilometre is shorter than a mile, so there are <b>fewer</b> miles: multiply by 0.621.']]
    }[key] || [];
    return b.concat(mix);
  }
  C.convBad = convBad;
  function factLine(key) { var u = key.split('>'), f = C.FX[key][0]; var m = { 'in>cm': '1 in = 2.54 cm', 'cm>in': '1 in = 2.54 cm', 'in>mm': '1 in = 25.4 mm', 'mm>in': '1 in = 25.4 mm', 'ft>cm': '1 ft = 30.48 cm', 'cm>ft': '1 ft = 30.48 cm', 'ft>m': '1 ft = 0.3048 m', 'm>ft': '1 m ≈ 3.28 ft', 'yd>m': '1 yd = 0.9144 m', 'm>yd': '1 yd = 0.9144 m', 'yd>cm': '1 yd = 91.44 cm', 'mi>km': '1 mi ≈ 1.609 km', 'km>mi': '1 km ≈ 0.621 mi', 'm>in': '1 m ≈ 39.37 in' }; return m[key] || ('1 ' + u[0] + ' = ' + f + ' ' + u[1]); }
  C.factLine = factLine;
  /* other right ways (km → mi by ÷ 1.609, m → ft by ÷ 0.3048) */
  function convAlts(x, key) { return key === 'km>mi' ? [x / 1.609] : key === 'm>ft' ? [x / 0.3048] : key === 'ft>m' ? [x / 3.28] : []; }
  C.convAlts = convAlts;
  /* the unit-factor line: 14 in × 2.54 cm / 1 in = 35.56 ≈ 35.6 cm */
  function convSol(x, key, dp) { var v = convVal(x, key), u = key.split('>'); return t(N(x) + uT(u[0]) + '\\times ' + factorT(key) + eqR(v, dp) + uT(u[1])); }
  C.convSol = convSol;
  /* ---- a conversion part: x (from) → to. o: dp, bad, sol (extra lines), hints, text, prompt units ---- */
  C.conv = function (prompt, x, key, dp, o) {
    o = o || {}; var v = convVal(x, key), u = key.split('>'), fx = C.FX[key];
    return C.num(prompt, v, { dp: dp, exact: v, exactOk: o.exactOk, after: u[1], alts: convAlts(x, key), bad: convBad(x, key).concat(o.bad || []),
      sol: [convSol(x, key, dp)].concat(o.sol || []),
      hints: o.hints || ['Use ' + factLine(key) + '. Put the unit you have (' + u[0] + ') on the bottom of the unit factor.', fx[1] ? 'The ' + UNAME[u[1]] + ' number should be ' + (fx[0] > 1 ? 'bigger' : 'smaller') + ' than ' + N(x) + '.' : 'The ' + UNAME[u[1]] + ' number should be smaller than ' + N(x) + '.'], text: o.text || key });
  };

  /* ---- feet and inches: two boxes. total = inches. bad [[totalInches, code, hint]] ---- */
  function ftInChk(total, bad) {
    total = q(total);
    var F0 = Math.floor(total / 12 + 1e-9), I0 = q(total - 12 * F0);
    return function (resp) {
      resp = resp || [];
      var a = String(resp[0] == null ? '' : resp[0]).trim(), b = String(resp[1] == null ? '' : resp[1]).trim();
      if (!a && !b) return form('empty', 'Type the feet and the inches.');
      var pa = a ? readNum(a) : { v: 0, d: 0 }, pb = b ? readNum(b) : { v: 0, d: 0 };
      if (pa.res) return pa.res; if (pb.res) return pb.res;
      var Fv = pa.v, Iv = pb.v, T = q(Fv * 12 + Iv);
      if (!b && !Number.isInteger(Fv) && near(Fv * 12, total, 0.06)) return form('u3len-decimal-ft', 'That’s the length in decimal feet. Write it in feet <b>and</b> inches: take out the whole feet, and the inches left over go in the second box.');
      if (!a && near(Iv, total) && total >= 12) return form('u3len-all-in', 'Right length in inches — now write it in feet and inches (take out as many 12s as you can).');
      if (!Number.isInteger(Fv)) {
        var dpart = q(Fv - Math.floor(Fv));
        if (Math.floor(Fv) === F0 && near(dpart * 12, I0, 0.6)) return form('u3len-decimal-ft', 'The feet box takes whole feet. The decimal part of a foot is not inches: × 12 to change it to inches.');
        return form('u3len-ft-whole', 'The feet box takes a whole number of feet; put the rest in the inches box.');
      }
      if (Fv < 0 || Iv < 0) return form('u3len-neg', 'A length can’t be negative. Check your subtraction.');
      if (near(T, total)) {
        if (Iv >= 12 - 1e-9) return form('u3len-trade', 'Right length — now trade 12 in for 1 ft (the inches must be less than 12).');
        return ok();
      }
      if (!b && near(Fv, F0) && I0 > 0) return form('u3len-blank-in', 'Fill in the inches box too (type 0 if there are no inches left over).');
      if (Iv < 12 && Fv < 12 && near(Iv * 12 + Fv, total) && !near(Fv, Iv)) return wrong('u3len-ft-in-swap', 'The feet and the inches are in each other’s boxes.');
      for (var i = 0; bad && i < bad.length; i++) if (bad[i] && near(T, bad[i][0], 1e-6)) return wrong(bad[i][1], bad[i][2]);
      var dec = q(total / 12 - F0);
      if (dec > 0 && near(Fv, F0) && (near(Iv, rd(dec * 10, 0)) || near(Iv, rd(dec * 100, 0)) || near(Iv, trunc(dec * 100, 0)))) return wrong('u3len-dec-in', 'The decimal part of a foot is <b>not</b> inches (there are 12 inches in a foot, not 10 or 100). Multiply the decimal part by 12, or subtract: ' + t(N(total) + '-' + F0 + '\\times 12=' + N(I0)) + ' in.');
      return wrong('value', null);
    };
  }
  C.ftInChk = ftInChk;
  /* a feet-and-inches answer part (total in inches). o: bad, sol, hints, text, label */
  C.ftIn = function (prompt, total, o) {
    o = o || {}; total = q(total);
    var bad = (o.bad || []).filter(function (b) { return b && isFinite(b[0]) && b[0] >= 0 && !near(b[0], total); });
    var F0 = Math.floor(total / 12 + 1e-9), I0 = q(total - 12 * F0);
    var p = { prompt: prompt, input: { type: 'fields', fields: [{ label: o.label || '', after: 'ft', name: 'Feet' }, { label: '', after: 'in', name: 'Inches' }] },
      check: ftInChk(total, bad), key: [String(F0), nS(I0)], answer: t(FIt(total)), solution: br(o.sol), hints: o.hints || ['Write the answer as feet and inches, with less than 12 in.'], text: o.text };
    p.bad = bad.slice(0, 3).map(function (b) { var f = Math.floor(b[0] / 12 + 1e-9); return [String(f), nS(q(b[0] - 12 * f))]; }).filter(function (k) { return Number(k[1]) < 12; });
    p.good = I0 === 0 ? [[String(F0), '']] : [];
    return p;
  };

  /* ---- a mixed number (fraction keypad). T = [p, d] (an exact fraction). o: { decOk (an equal decimal is fine),
   *   bad [[value, code, hint]], near [[lo, hi, code, hint, 'form'?]] (a range of values), lowest (default true) } ---- */
  function readF(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\text\{\s*in\.?\s*\}|\\text\{\s*inches\s*\}|\s*in\.?\s*$/g, ''), m = /^\s*([-−])?\s*(\d+)\s+(\d+)\s*\/\s*(\d+)\s*$/.exec(s);
    if (m) s = (m[1] ? '-' : '') + m[2] + '\\frac{' + m[3] + '}{' + m[4] + '}';
    return K.read(s);
  }
  function mixedParts(ast) {
    var a = ast; while (a.t === 'paren') a = a.a;
    if (a.t !== 'mul' || !a.imp || a.a.t !== 'num' || a.a.dec || a.b.t !== 'div' || !a.b.frac) return null;
    var n = a.b.a, d = a.b.b; if (n.t !== 'num' || d.t !== 'num' || n.dec || d.dec || !d.v) return null;
    return { w: a.a.v, n: n.v, d: d.v };
  }
  C.mixChk = function (T, o) {
    o = o || {}; var Tv = T[0] / T[1], lowest = o.lowest !== false;
    function other(v, isDec) {
      var i;
      for (i = 0; o.bad && i < o.bad.length; i++) if (o.bad[i] && near(v, o.bad[i][0], 1e-6)) return o.bad[i][3] === 'form' ? form(o.bad[i][1], o.bad[i][2]) : wrong(o.bad[i][1], o.bad[i][2]);
      for (i = 0; o.near && i < o.near.length; i++) { var z = o.near[i]; if (v >= z[0] - 1e-9 && v <= z[1] + 1e-9) return z[4] === 'form' ? form(z[2], z[3]) : wrong(z[2], z[3]); }
      if (isDec && Math.abs(v - Tv) < 0.04) return form('u3len-frac-wanted', 'Close — but give the answer as a mixed number (a whole number and a fraction of an inch), not a decimal.');
      return wrong('value', o.miss || null);
    }
    var f = function (resp) {
      var a = readF(resp); if (a.res) return a.res;
      var mp = mixedParts(a.ast);
      if (mp) {
        var mv = mp.w + mp.n / mp.d;
        if (mp.n >= mp.d) return near(mv, Tv, 1e-9) ? form('u3len-mixed-improper', 'In a mixed number the fraction part must be less than 1 — take another whole out of it.') : other(mv);
        if (near(mv, Tv, 1e-9)) { if (lowest && gcd(mp.n, mp.d) > 1) return form('u3len-lowest', 'Right — now simplify the fraction part (divide its top and bottom by ' + gcd(mp.n, mp.d) + ').'); return ok(); }
        return other(mv);
      }
      var pf = ex.plainFraction(a.ast), sh = ex.shape(a.ast), v = a.val;
      if (near(v, Tv, 1e-9)) {
        if (sh.decimals && !pf) return o.decOk ? ok() : form('u3len-frac-wanted', 'Right value — now write it as a mixed number (a whole number and a fraction), like the marks on a tape measure.');
        if (!pf) return form('simplify', 'That has the right value, but work it out to a single mixed number.');
        if (pf[1] !== 1 && Math.abs(pf[0]) > pf[1]) return form('u3len-want-mixed', 'Right value — now write it as a <b>mixed number</b>: ' + t(mT(R(pf[0], pf[1]))) + '.');
        if (lowest && gcd(pf[0], pf[1]) > 1) return form('u3len-lowest', 'Right — now simplify the fraction (divide its top and bottom by ' + gcd(pf[0], pf[1]) + ').');
        return ok();
      }
      return other(v, sh.decimals && !pf);
    };
    f.key = mT(T);
    return f;
  };
  /* a mixed-number part. o: decOk, bad, near, after (unit), sol, hints, text */
  C.mix = function (prompt, T, o) {
    o = o || {}; T = R(T[0], T[1]);
    var chk = C.mixChk(T, o);
    var p = { prompt: prompt, input: { type: 'math', keys: 'mixed', after: o.after, placeholder: 'e.g. 2 3/4' }, check: chk, key: chk.key, answer: t(mT(T) + uT(o.after)), solution: br(o.sol), hints: o.hints || [], text: o.text };
    p.bad = (o.bad || []).filter(function (b) { return b && b[3] !== 'form' && !near(b[0], T[0] / T[1], 1e-9); }).slice(0, 3).map(function (b) { return nS(rd(b[0], 6)); });
    p.good = [mTxt(T)].concat(o.decOk && decs(T[0] / T[1]) <= 4 ? [nS(T[0] / T[1])] : []);
    return p;
  };

  /* ---- a small SVG figure drawer. items in math units (y up); scaled to fit width (px).
   *   { t: 'path', d: [['M', x, y], ['L', x, y], ['A', cx, cy, r, a0, a1]], close, dash, fill, w }  (arc angles in degrees, counter-clockwise)
   *   { t: 'line', a, b, dash, w, color }  { t: 'circle', c, r, dash, fill }  { t: 'dot', at }
   *   { t: 'text', at, s, anchor, dx, dy, size, color }  { t: 'lab', a, b, s, out: [x, y] (a point inside; the label goes the other way) or n: [nx, ny] (the outward direction), gap }
   *   { t: 'ra', at, u, v } (a right-angle mark at 'at' along unit directions u, v)  { t: 'tick', a, b, n }  { t: 'dim', a, b, s, off: [dx, dy] (math units) }
   * opt: { width, height (max px), pad, aria, fill } ---- */
  var INK = '#2b3340', SOFT = '#f5ecdf', DIM = '#6a7182';
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  C.svg = function (items, opt) {
    opt = opt || {};
    var pts = [];
    function addArc(cx, cy, r, a0, a1, out) { var n = Math.max(8, Math.ceil(Math.abs(a1 - a0) / 6)); for (var i = 0; i <= n; i++) { var a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); } }
    function pathPts(d) { var out = []; d.forEach(function (c) { if (c[0] === 'M' || c[0] === 'L') out.push([c[1], c[2]]); else if (c[0] === 'A') addArc(c[1], c[2], c[3], c[4], c[5], out); }); return out; }
    items.forEach(function (it) {
      if (it.t === 'path') pts = pts.concat(pathPts(it.d));
      else if (it.t === 'line' || it.t === 'dim' || it.t === 'lab' || it.t === 'tick') { pts.push(it.a, it.b); if (it.t === 'dim' && it.off) { pts.push([it.a[0] + it.off[0], it.a[1] + it.off[1]], [it.b[0] + it.off[0], it.b[1] + it.off[1]]); } }
      else if (it.t === 'circle') { pts.push([it.c[0] - it.r, it.c[1] - it.r], [it.c[0] + it.r, it.c[1] + it.r]); }
      else if (it.t === 'dot' || it.t === 'text') pts.push(it.at);
    });
    var xs = pts.map(function (p) { return p[0]; }), ys = pts.map(function (p) { return p[1]; });
    var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
    var maxW = opt.width || 300, pad = opt.pad == null ? 44 : opt.pad, maxH = opt.height || 220;
    var sx = Math.max(x1 - x0, 1e-6), sy = Math.max(y1 - y0, 1e-6), sc = Math.min((maxW - 2 * pad) / sx, (maxH - 2 * pad) / sy);
    var Wd = sx * sc + 2 * pad, Ht = sy * sc + 2 * pad;
    function X(x) { return pad + (x - x0) * sc; } function Y(y) { return pad + (y1 - y) * sc; }
    function P2(p) { return [X(p[0]), Y(p[1])]; }
    function f1(v) { return v.toFixed(1); }
    var bx0 = 0, by0 = 0, bx1 = 0, by1 = 0;
    function grow(x, y, s, o) { var w = String(s).length * (o.size || 14) * 0.56, a = o.anchor || 'middle', l = a === 'start' ? x : a === 'end' ? x - w : x - w / 2; bx0 = Math.min(bx0, l - 4); bx1 = Math.max(bx1, l + w + 4); by0 = Math.min(by0, y - 10); by1 = Math.max(by1, y + 10); }
    function txt(x, y, s, o) { o = o || {}; grow(x, y, s, o); return '<text x="' + f1(x) + '" y="' + f1(y) + '" font-size="' + (o.size || 14) + '" text-anchor="' + (o.anchor || 'middle') + '" dominant-baseline="central" fill="' + (o.color || INK) + '"' + (/^[a-z]$/.test(String(s)) ? ' font-style="italic"' : '') + ' paint-order="stroke" stroke="#fff" stroke-width="3" stroke-linejoin="round">' + esc(s) + '</text>'; }
    var g = '', labs = '';
    items.forEach(function (it) {
      var dash = it.dash ? ' stroke-dasharray="6 4"' : '';
      if (it.t === 'path') {
        var pp = []; var segs = '';
        it.d.forEach(function (c) { var sub = []; if (c[0] === 'A') addArc(c[1], c[2], c[3], c[4], c[5], sub); else sub = [[c[1], c[2]]]; sub.forEach(function (p, k) { var q2 = P2(p); segs += (c[0] === 'M' && k === 0 ? 'M' : 'L') + f1(q2[0]) + ' ' + f1(q2[1]) + ' '; }); pp = pp.concat(sub); });
        g += '<path d="' + segs + (it.close ? 'Z' : '') + '" fill="' + (it.fill || (it.close && opt.fill !== false ? SOFT : 'none')) + '" stroke="' + (it.color || INK) + '" stroke-width="' + (it.w || 2.2) + '" stroke-linejoin="round" stroke-linecap="round"' + dash + '/>';
      } else if (it.t === 'line') { var a = P2(it.a), b = P2(it.b); g += '<line x1="' + f1(a[0]) + '" y1="' + f1(a[1]) + '" x2="' + f1(b[0]) + '" y2="' + f1(b[1]) + '" stroke="' + (it.color || (it.dash ? DIM : INK)) + '" stroke-width="' + (it.w || (it.dash ? 1.5 : 2.2)) + '" stroke-linecap="round"' + dash + '/>'; }
      else if (it.t === 'circle') { var c = P2(it.c); g += '<circle cx="' + f1(c[0]) + '" cy="' + f1(c[1]) + '" r="' + f1(it.r * sc) + '" fill="' + (it.fill || (opt.fill !== false ? SOFT : 'none')) + '" stroke="' + INK + '" stroke-width="2.2"' + dash + '/>'; }
      else if (it.t === 'dot') { var d0 = P2(it.at); g += '<circle cx="' + f1(d0[0]) + '" cy="' + f1(d0[1]) + '" r="3" fill="' + INK + '"/>'; }
      else if (it.t === 'text') { var tp = P2(it.at); labs += txt(tp[0] + (it.dx || 0), tp[1] + (it.dy || 0), it.s, { anchor: it.anchor, size: it.size, color: it.color }); }
      else if (it.t === 'lab') {
        var A = P2(it.a), B = P2(it.b), m = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], L = Math.hypot(B[0] - A[0], B[1] - A[1]) || 1, n = [-(B[1] - A[1]) / L, (B[0] - A[0]) / L];
        if (it.n) n = [it.n[0], -it.n[1]];
        else if (it.out) { var o2 = P2(it.out); if ((m[0] - o2[0]) * n[0] + (m[1] - o2[1]) * n[1] < 0) n = [-n[0], -n[1]]; }
        var gap = it.gap || 12, anc = n[0] > 0.4 ? 'start' : n[0] < -0.4 ? 'end' : 'middle';
        labs += txt(m[0] + n[0] * gap, m[1] + n[1] * (gap + 1), it.s, { anchor: anc, size: it.size, color: it.color });
      } else if (it.t === 'ra') {
        var cc = P2(it.at), k = 10, u = [it.u[0], -it.u[1]], v = [it.v[0], -it.v[1]];
        g += '<polyline points="' + [cc[0] + u[0] * k, cc[1] + u[1] * k, cc[0] + (u[0] + v[0]) * k, cc[1] + (u[1] + v[1]) * k, cc[0] + v[0] * k, cc[1] + v[1] * k].map(f1).join(' ') + '" fill="none" stroke="' + INK + '" stroke-width="1.3"/>';
      } else if (it.t === 'tick') {
        var TA = P2(it.a), TB = P2(it.b), tm = [(TA[0] + TB[0]) / 2, (TA[1] + TB[1]) / 2], TL = Math.hypot(TB[0] - TA[0], TB[1] - TA[1]) || 1, tu = [(TB[0] - TA[0]) / TL, (TB[1] - TA[1]) / TL], tn = [-tu[1], tu[0]], nn = it.n || 1;
        for (var j = 0; j < nn; j++) { var off = (j - (nn - 1) / 2) * 5, base = [tm[0] + tu[0] * off, tm[1] + tu[1] * off]; g += '<line x1="' + f1(base[0] - tn[0] * 6) + '" y1="' + f1(base[1] - tn[1] * 6) + '" x2="' + f1(base[0] + tn[0] * 6) + '" y2="' + f1(base[1] + tn[1] * 6) + '" stroke="' + INK + '" stroke-width="1.5"/>'; }
      } else if (it.t === 'dim') {
        var oa = it.off || [0, 0], DA = P2([it.a[0] + oa[0], it.a[1] + oa[1]]), DB = P2([it.b[0] + oa[0], it.b[1] + oa[1]]), DL = Math.hypot(DB[0] - DA[0], DB[1] - DA[1]) || 1, du = [(DB[0] - DA[0]) / DL, (DB[1] - DA[1]) / DL], dn = [-du[1], du[0]];
        var head = function (p, s) { return '<polygon points="' + [p[0], p[1], p[0] + s * du[0] * 8 + dn[0] * 4, p[1] + s * du[1] * 8 + dn[1] * 4, p[0] + s * du[0] * 8 - dn[0] * 4, p[1] + s * du[1] * 8 - dn[1] * 4].map(f1).join(' ') + '" fill="' + DIM + '"/>'; };
        g += '<line x1="' + f1(DA[0]) + '" y1="' + f1(DA[1]) + '" x2="' + f1(DB[0]) + '" y2="' + f1(DB[1]) + '" stroke="' + DIM + '" stroke-width="1.3"/>' + head(DA, 1) + head(DB, -1);
        if (it.s) { var dm = [(DA[0] + DB[0]) / 2, (DA[1] + DB[1]) / 2], side = it.side || 1, anc2 = Math.abs(du[0]) > 0.7 ? 'middle' : side > 0 ? 'start' : 'end'; labs += txt(dm[0] + (Math.abs(du[0]) > 0.7 ? 0 : side * 7), dm[1] + (Math.abs(du[0]) > 0.7 ? -side * 11 : 0), it.s, { anchor: anc2 }); }
      }
    });
    bx0 = Math.min(bx0, 0); by0 = Math.min(by0, 0); bx1 = Math.max(bx1, Wd); by1 = Math.max(by1, Ht);
    var VW = bx1 - bx0, VH = by1 - by0;
    return '<svg class="fig-svg" viewBox="' + bx0.toFixed(0) + ' ' + by0.toFixed(0) + ' ' + VW.toFixed(0) + ' ' + VH.toFixed(0) + '" width="100%" style="max-width:' + VW.toFixed(0) + 'px;display:block;margin:6px 0" role="img" aria-label="' + esc(opt.aria || 'diagram') + '">' + g + labs + '</svg>';
  };
  C.TD = 'border:1px solid #c9b79c;padding:3px 10px;text-align:center';
  C.table = function (head, rows) { var TD = C.TD; return '<table style="border-collapse:collapse;margin:4px 0">' + (head ? '<tr>' + head.map(function (h) { return '<th style="' + TD + '">' + h + '</th>'; }).join('') + '</tr>' : '') + rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td style="' + TD + '">' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>'; };

  HW.addCodes({
    'u3len-comma': 'Decimal comma', 'u3len-wrong-way': 'Multiplied instead of dividing (or the reverse)', 'u3len-estimate': 'Used the quick estimate instead of the exact fact', 'u3len-mm-fact': 'Used 25.4 (mm) for cm', 'u3len-cm-not-mm': 'Gave cm instead of mm',
    'u3len-ft-fact': 'Used the foot fact for another unit', 'u3len-in-fact': 'Used 2.54 (the inch fact) for feet', 'u3len-in-only': 'Changed feet to inches only', 'u3len-m-not-cm': 'Gave metres instead of cm', 'u3len-cm-not-m': 'Didn’t change cm to m (÷ 100)',
    'u3len-yd-fact': 'Used the yard fact for feet', 'u3len-in-not-ft': 'Gave inches instead of feet', 'u3len-ft-not-yd': 'Used feet instead of yards', 'u3len-km-mi-fact': 'Used 0.621 for miles → km', 'u3len-m-not-km': 'Gave metres instead of km',
    'u3len-round-dir': 'Rounded the wrong way', 'u3len-exact': 'Rounded an exact answer', 'u3len-est': 'Estimate too far off', 'u3len-swap': 'Answers in each other’s boxes', 'u3len-decimal-ft': 'Decimal feet instead of feet and inches', 'u3len-all-in': 'Left the answer in inches',
    'u3len-ft-whole': 'Decimal in the feet box', 'u3len-neg': 'Negative length', 'u3len-trade': 'Inches not regrouped (12 or more)', 'u3len-blank-in': 'Inches box left blank', 'u3len-ft-in-swap': 'Feet and inches swapped', 'u3len-dec-in': 'Took the decimal part of a foot as inches',
    'u3len-frac-wanted': 'Decimal instead of a fraction of an inch', 'u3len-mixed-improper': 'Mixed number with an improper fraction part', 'u3len-lowest': 'Fraction not simplified', 'u3len-want-mixed': 'Improper fraction instead of a mixed number'
  });
  HW.addPartial({ 'u3len-wrong-way': 'n', 'u3len-estimate': 's', 'u3len-mm-fact': 'b', 'u3len-cm-not-mm': 'b', 'u3len-ft-fact': 'b', 'u3len-in-fact': 'b', 'u3len-in-only': 'b', 'u3len-m-not-cm': 'b', 'u3len-cm-not-m': 's', 'u3len-yd-fact': 'b', 'u3len-in-not-ft': 'b', 'u3len-ft-not-yd': 'b', 'u3len-km-mi-fact': 'b', 'u3len-m-not-km': 's', 'u3len-round-dir': 's', 'u3len-dec-in': 'b', 'u3len-ft-in-swap': 's' });

  /* ======================= Lesson 5 ======================= */
  var num = C.num, fields = C.fields, conv = C.conv, mc = C.mc;
  function inT(i) { return N(i) + uT('in'); }
  /* a height in ft-in → inches */
  function hIn(f, i) { return f * 12 + i; }
  function not(list) { return function (v) { return list.indexOf(v) < 0; }; }

  HW.addCodes({
    'u3l5-same-num': 'Thought the same number means the same length', 'u3l5-bigger-num': 'Compared the numbers, not the lengths', 'u3l5-bigger-unit': 'Compared the units, not the lengths', 'u3l5-bad-evidence': 'Right choice, wrong working',
    'u3l5-dot-ft': 'Read feet and inches as a decimal (5′ 4″ = 5.4 ft)', 'u3l5-total-in': 'Gave the total inches, not cm', 'u3l5-in-not-conv': 'Didn’t convert the inches', 'u3l5-ten-in': 'Used 10 in a foot', 'u3l5-no-254': 'Didn’t divide by 2.54 first',
    'u3l5-frac-digits': 'Read the fraction as decimal digits (3/8 → 3.8)', 'u3l5-frac-only': 'Converted only the fraction part', 'u3l5-whole-only': 'Converted only the whole number', 'u3l5-not16': 'Didn’t multiply the decimal part by 16', 'u3l5-chop16': 'Rounded the sixteenths down (chopped)',
    'u3l5-sum': 'Added instead of subtracting', 'u3l5-in-diff': 'Difference in inches, not cm', 'u3l5-one-sponsor': 'Money from one sponsor only', 'u3l5-miles-pledge': 'Used miles for a per-km pledge', 'u3l5-no-round-up': 'Didn’t round the fabric up', 'u3l5-round-down': 'Rounded the fabric down',
    'u3l5-whole-yd': 'Rounded up to a whole yard', 'u3l5-no-tax': 'Left out the GST', 'u3l5-tax-only': 'Gave the GST, not the total', 'u3l5-exact-yd': 'Cost of the exact yards (not the amount bought)', 'u3l5-m-as-yd': 'Used the metres as yards',
    'u3l5-no-ft': 'Didn’t change feet to metres', 'u3l5-unrounded': 'Used the unrounded answer', 'u3l5-cm-m': 'Mixed up cm and m', 'u3l5-mm-diff': 'Difference not in mm', 'u3l5-ft-m': 'Compared feet with metres'
  });
  HW.addPartial({ 'u3l5-dot-ft': 'b', 'u3l5-total-in': 'b', 'u3l5-in-not-conv': 'b', 'u3l5-ten-in': 'b', 'u3l5-frac-digits': 'b', 'u3l5-frac-only': 'b', 'u3l5-whole-only': 'b', 'u3l5-not16': 'b', 'u3l5-chop16': 's', 'u3l5-one-sponsor': 'b', 'u3l5-no-round-up': 's', 'u3l5-round-down': 's', 'u3l5-no-tax': 'b', 'u3l5-exact-yd': 's' });

  /* ---- "which is longer?" (Q1, A1): imperial amount (ai ui) against SI amount (bs us); fact key ui>us ---- */
  function longerMC(r, prompt, ai, ui, bs, us, o) {
    o = o || {};
    var key = ui + '>' + us, f = C.FX[key][0], v = q(ai * f), aLong = v > bs, aTxt = Np(ai) + ' ' + ui, bTxt = Np(bs) + ' ' + us;
    var work = ai === 1 ? factLine(key).replace('≈', '=') : t(N(ai) + '\\times ' + N(f) + '=' + N(v) + uT(us));
    var evid = work + ', ' + (aLong ? 'more' : 'less') + ' than ' + bTxt;
    var longer = aLong ? aTxt : bTxt, shorter = aLong ? bTxt : aTxt;
    var opts = [{ html: '<b>' + longer + '</b>: ' + evid + '.', right: true }];
    if (ai === bs) opts.push({ html: '<b>Neither</b>: the numbers are the same, so the lengths are the same.', why: 'The units are different, so the lengths are different. ' + factLine(key) + '.', code: 'u3l5-same-num' });
    else if (Math.abs(v - bs) / bs < 0.06) opts.push({ html: '<b>Neither</b>: they are the same length.', why: 'They are close, but not the same: ' + work + '.', code: 'u3l5-same-num' });
    var shNum = aLong ? bs : ai, loNum = aLong ? ai : bs;
    if (shNum > loNum) opts.push({ html: '<b>' + shorter + '</b>: ' + Np(shNum) + ' is a bigger number than ' + Np(loNum) + '.', why: 'Compare the <b>lengths</b>, not just the numbers: change ' + aTxt + ' to ' + us + ' first (' + factLine(key) + ').', code: 'u3l5-bigger-num' });
    else {
      var WORD = { in: 'an inch', ft: 'a foot', yd: 'a yard', mi: 'a mile', cm: 'a centimetre', m: 'a metre', km: 'a kilometre', mm: 'a millimetre' }, SIZE = { mm: 0.1, cm: 1, in: 2.54, ft: 30.48, yd: 91.44, m: 100, km: 100000, mi: 160900 };
      var su = aLong ? us : ui, lu = aLong ? ui : us, isTrue = SIZE[su] > SIZE[lu];
      opts.push({ html: '<b>' + shorter + '</b>: ' + WORD[su] + ' is longer than ' + WORD[lu] + '.', why: isTrue ? 'The size of one unit isn’t enough — there are different numbers of them. Change ' + aTxt + ' to ' + us + ': ' + work + '.' : cap(WORD[su]) + ' is <b>shorter</b> than ' + WORD[lu] + ': ' + factLine(key) + '.', code: 'u3l5-bigger-unit' });
    }
    if (ai !== 1) { var wv = q(ai / f), wl = wv > bs; opts.push({ html: '<b>' + (wl ? aTxt : bTxt) + '</b>: ' + t(N(ai) + '\\div ' + N(f) + '\\approx ' + N(rd(wv, 2)) + uT(us)) + ', ' + (wl ? 'more' : 'less') + ' than ' + bTxt + '.', why: (wl === aLong ? 'Right length, but check the working: ' : 'Check the working: ') + 'to change ' + UNAME[ui] + ' to ' + UNAME[us] + ', <b>multiply</b> by ' + Np(f) + '.', code: 'u3l5-bad-evidence' }); }
    return mc(r, prompt, opts, [work, (aLong ? aTxt : bTxt) + ' is longer.'], ['Change the imperial length to ' + UNAME[us] + ' (' + factLine(key) + '), then compare.'], o.text || 'longer ' + key);
  }
  /* the booklet's kinds of pairs */
  var LONGER = {
    sameUnits: function (r) { var k = r.pick([1, 2, 3, 4, 5, 10]), w = r.pick([['ft', 'm'], ['ft', 'm'], ['in', 'cm'], ['yd', 'm']]); if (w[0] === 'in' && k === 1) k = 4; if (w[0] === 'yd' && k === 1) k = 3; return { ai: k, ui: w[0], bs: k, us: w[1] }; },
    inCm: function (r, ex) { return find(function () { var n = r.int(2, 12), v = n * 2.54, c = r.chance(0.5) ? Math.floor(v) : Math.ceil(v); if (c === Math.round(v) && r.chance(0.3)) c = Math.round(v) + (r.chance(0.5) ? 1 : -1); return { ai: n, ui: 'in', bs: c, us: 'cm' }; }, function (p) { return Math.abs(p.ai * 2.54 - p.bs) >= 0.15 && !(p.ai === 10 && p.bs === 25) && (ex || []).indexOf(p.ai + '/' + p.bs) < 0; }); },
    miKm: function (r, ex) { return find(function () { var n = r.pick([2, 3, 4, 5, 6, 8, 10]), v = n * 1.609, c = r.chance(0.5) ? Math.floor(v) : Math.ceil(v); return { ai: n, ui: 'mi', bs: c, us: 'km' }; }, function (p) { return Math.abs(p.ai * 1.609 - p.bs) >= 0.15 && (ex || []).indexOf(p.ai + '/' + p.bs) < 0; }); },
    yardsM: function (r) { return { ai: r.pick([10, 20, 100, 200, 400, 1000]), ui: 'yd', bs: 0, us: 'm', same: true }; },
    near: function (r, ex) { return find(function () { return r.pick([{ ai: 1, ui: 'ft', bs: 30, us: 'cm' }, { ai: 1, ui: 'ft', bs: 31, us: 'cm' }, { ai: 1, ui: 'yd', bs: 90, us: 'cm' }, { ai: 1, ui: 'yd', bs: 92, us: 'cm' }, { ai: 1, ui: 'in', bs: 2.5, us: 'cm' }, { ai: 1, ui: 'in', bs: 26, us: 'mm' }, { ai: 1, ui: 'mi', bs: 1.6, us: 'km' }, { ai: 1, ui: 'ft', bs: 0.3, us: 'm' }, { ai: 1, ui: 'ft', bs: 0.31, us: 'm' }, { ai: 1, ui: 'yd', bs: 0.9, us: 'm' }, { ai: 1, ui: 'yd', bs: 0.92, us: 'm' }, { ai: 3, ui: 'ft', bs: 1, us: 'm' }]); }, function (p) { return (ex || []).indexOf(p.ui + p.bs) < 0; }); }
  };
  LONGER.yardsM = function (r) { var k = r.pick([10, 20, 100, 200, 400, 1000]); return { ai: k, ui: 'yd', bs: k, us: 'm' }; };
  function longerPart(kind, id, level, outcome, ex, sub) {
    return { id: id, level: level, outcome: outcome, sub: sub, make: function (r) {
      var p = LONGER[kind](r, ex), aTxt = Np(p.ai) + ' ' + p.ui, bTxt = Np(p.bs) + ' ' + p.us, first = r.chance(0.5);
      return longerMC(r, '(' + id.replace(/^\D*\d+/, '') + ') ' + (first ? aTxt + ' or ' + bTxt : bTxt + ' or ' + aTxt), p.ai, p.ui, p.bs, p.us);
    } };
  }

  /* ---- estimates in your head (Q2, A2) ---- */
  var EST = {
    'cm>in': { f: 1 / 2.54, e: 0.4, how: function (x) { return [t(N(x) + '\\div 2.5=' + N(q(x / 2.5))) + ' (or ' + t(N(x) + '\\times 4=' + N(4 * x)) + ', ' + t('\\div 10') + ')']; }, words: '÷ 2.5 (or × 4, then ÷ 10)', wrongT: '\\times 2.5' },
    'in>cm': { f: 2.54, e: 2.5, how: function (x) { return ['Double: ' + t(N(x) + '\\times 2=' + N(2 * x)), 'Add half of ' + N(x) + ': ' + t(N(2 * x) + '+' + N(x / 2) + '=' + N(2.5 * x))]; }, words: '× 2.5 (double it, then add half)', wrongT: '\\div 2.5' },
    'ft>cm': { f: 30.48, e: 30, how: function (x) { return ['1 ft ≈ 30 cm', t(N(x) + '\\times 30=' + N(30 * x))]; }, words: '1 ft ≈ 30 cm', wrongT: '\\div 30' },
    'mi>km': { f: 1.609, e: 1.6, how: function (x) { return ['Add six tenths: ' + t(N(x) + '+' + N(q(0.6 * x)) + '=' + N(q(1.6 * x)))]; }, words: '× 1.6 (add six tenths)', wrongT: '\\div 1.6' },
    'km>mi': { f: 0.621, e: 0.6, how: function (x) { return ['Six tenths: ' + t(N(x) + '\\times 0.6=' + N(q(0.6 * x)))]; }, words: '× 0.6 (six tenths)', wrongT: '\\div 0.6' }
  };
  function estPart(r, prompt, x, key) {
    var E = EST[key], u = key.split('>'), e = q(x * E.e), wayV = q(x / E.e), mul = E.e > 1;
    var opts = [{ html: E.how(x).join(', ') + ': about <b>' + Np(e) + ' ' + u[1] + '</b>', right: true },
      { html: t(N(x) + E.wrongT + '=' + N(rd(wayV, 1))) + ': about <b>' + Np(rd(wayV, 1)) + ' ' + u[1] + '</b>', why: 'Should the number get bigger or smaller? ' + (mul ? cap(UNAME[u[1]]) + ' are shorter, so it takes <b>more</b> of them.' : cap(UNAME[u[1]]) + ' are longer, so it takes <b>fewer</b> of them.'), code: 'u3len-wrong-way' },
      { html: 'The same number: about <b>' + Np(x) + ' ' + u[1] + '</b>', why: 'Changing the unit changes the number. Use ' + E.words + '.', code: 'u3l5-same-num' }];
    var oth = { 'cm>in': [x / 30, 'Dividing by 30 gives <b>feet</b>. For inches, ÷ 2.5.'], 'in>cm': [x * 30, '30 cm is about one <b>foot</b>. For inches, × 2.5.'], 'ft>cm': [x * 12, '× 12 gives <b>inches</b>. 1 ft ≈ 30 cm.'], 'mi>km': [x * 0.6, '× 0.6 changes km to miles. For miles to km, × 1.6.'], 'km>mi': [x * 1.6, '× 1.6 changes miles to km. For km to miles, × 0.6.'] }[key];
    if (oth && !near(rd(oth[0], 1), e) && !near(rd(oth[0], 1), rd(wayV, 1))) opts.push({ html: t(N(x) + (key === 'cm>in' ? '\\div 30' : key === 'in>cm' ? '\\times 30' : key === 'ft>cm' ? '\\times 12' : key === 'mi>km' ? '\\times 0.6' : '\\times 1.6') + '=' + N(rd(oth[0], 1))) + ': about <b>' + Np(rd(oth[0], 1)) + ' ' + u[1] + '</b>', why: oth[1], code: 'u3len-ft-fact' });
    return mc(r, prompt + ' Which is the best estimate?', opts, E.how(x).concat(['About ' + Np(e) + ' ' + u[1] + '.' + (key === 'km>mi' ? ' (A little low: 1 km is a bit more than 0.6 mi.)' : '')]), ['Quick estimate: ' + E.words + '.'], 'estimate ' + key);
  }
  function estGen(id, level, outcome, key, list, sub) {
    return { id: id, level: level, outcome: outcome, sub: sub, make: function (r) { var c = r.pick(list); return estPart(r, '(' + id.replace(/^\D*\d+/, '') + ') ' + c[1].replace('#', Np(c[0])) + ', in ' + UNAME[key.split('>')[1]] + '.', c[0], key); } };
  }

  /* ---- a straight conversion part (Q3, A3) ---- */
  /* the other right ways must round to the same answer (otherwise leave that number out) */
  function agree(x, key, dp) { var v = rd(convVal(x, key), dp); return convAlts(x, key).every(function (a) { return near(rd(a, dp), v); }); }
  function convGen(id, level, outcome, key, pool, dp, sub) {
    return { id: id, level: level, outcome: outcome, sub: sub, make: function (r) { var x = r.pick(pool.filter(function (x) { return agree(x, key, dp); })), u = key.split('>'); return conv('(' + id.replace(/^\D*\d+/, '') + ') ' + Np(x) + ' ' + u[0] + ' to ' + u[1], x, key, dp); } };
  }

  /* ---- a fraction of an inch → mm or cm (Q6, A4). fr = [whole, top, bottom] ---- */
  function fracConv(prompt, fr, to, dp, o) {
    o = o || {}; var w = fr[0], n = fr[1], d = fr[2], dec = q(w + n / d), key = 'in>' + to, f = C.FX[key][0], v = q(dec * f);
    var frT = mT([w * d + n, d], true), bad = convBad(dec, key);
    bad.push([Number(w + '.' + n + d) * f, 'u3l5-frac-digits', t(frT) + ' is not ' + w + '.' + n + d + '. Change the fraction to a decimal by dividing: ' + t(n + '\\div ' + d + '=' + N(q(n / d))) + '.']);
    bad.push([Number((w ? w + '.' : '0.') + n) * f, 'u3l5-frac-digits', 'Change the fraction to a decimal by dividing the top by the bottom: ' + t(n + '\\div ' + d + '=' + N(q(n / d))) + '.']);
    if (w) { bad.push([q(n / d) * f, 'u3l5-frac-only', 'Don’t forget the whole inches: ' + t(frT + '=' + N(dec)) + ' in.']); bad.push([w * f, 'u3l5-whole-only', 'Include the fraction too: ' + t(frT + '=' + N(dec)) + ' in.']); bad.push([w * f + n / d, 'u3l5-frac-only', 'Convert the whole length, fraction included: ' + t(N(dec) + '\\times ' + N(f)) + '.']); }
    return num(prompt, v, { dp: dp, exact: v, after: to, bad: bad, sol: [t(frT + '=' + (w ? w + '+' : '') + n + '\\div ' + d + '=' + N(dec)) + ' in', t(N(dec) + '\\times ' + N(f) + eqR(v, dp) + uT(to))].concat(o.sol || []),
      hints: ['Change the fraction to a decimal first (top ÷ bottom).', 'Then use ' + factLine(key) + '.'], text: o.text || 'fraction ' + key });
  }
  function fracGen(id, level, outcome, to, pool, dp, sub) {
    return { id: id, level: level, outcome: outcome, sub: sub, make: function (r) { var c = r.pick(pool), fr = c[0]; return fracConv('(' + id.replace(/^\D*\d+/, '') + ') ' + c[1].replace('#', t(mT([fr[0] * fr[2] + fr[1], fr[2]], true) + uT('in'))) + ', in ' + UNAME[to] + ' (nearest tenth)', fr, to, dp); } };
  }

  /* ---- metric length → inches to the nearest 1/16 (Q7, C14) ---- */
  function sixteenths(cm) { var inch = cm / 2.54, w = Math.floor(inch), s = Math.round((inch - w) * 16); if (s === 16) { w++; s = 0; } return { inch: inch, w: w, s: s, T: R(w * 16 + s, 16) }; }
  function sixPart(prompt, cm, o) {
    o = o || {}; var z = sixteenths(cm), dp = q(z.inch - Math.floor(z.inch)), x16 = dp * 16, T = z.T;
    var bad = [[(z.w * 16 + z.s - 1) / 16, 'u3l5-chop16', 'Round the decimal part × 16 to the <b>nearest</b> whole number: ' + t(N(rd(x16, 2)) + '\\approx ' + z.s) + ' sixteenths.'],
      [(z.w * 16 + z.s + 1) / 16, 'u3len-round-dir', 'Check the rounding of the sixteenths: ' + t(N(rd(dp, 3)) + '\\times 16=' + N(rd(x16, 2)) + '\\approx ' + z.s) + '.'],
      [cm * 2.54, 'u3len-wrong-way', 'A centimetre is shorter than an inch, so there are <b>fewer</b> inches: divide by 2.54.']];
    var dd = String(rd(dp, 3)).split('.')[1] || '';
    if (dd.length >= 2) bad.push([z.w + Number(dd.slice(0, 2)) / 16, 'u3l5-not16', 'The decimal part isn’t sixteenths yet. Multiply it by 16: ' + t(N(rd(dp, 3)) + '\\times 16=' + N(rd(x16, 2))) + ', then round.']);
    return C.mix(prompt, T, { after: 'in', bad: bad.filter(function (b) { return b[0] > 0; }), near: [[z.inch - 0.002, z.inch + 0.002, 'u3len-frac-wanted', 'That’s the length in decimal inches. Now change the decimal part to sixteenths: multiply it by 16 and round.', 'form']],
      sol: [t(N(cm) + '\\div 2.54=' + N(rd(z.inch, 4)) + '\\ldots') + ' in', 'Decimal part: ' + t(N(rd(dp, 4)) + '\\times 16=' + N(rd(x16, 2)) + '\\approx ' + z.s), t(N(cm) + uT('cm') + '\\approx ' + z.w + '\\tfrac{' + z.s + '}{16}' + (gcd(z.s, 16) > 1 ? '=' + mT(T) : '') + uT('in'))].concat(o.sol || []),
      hints: ['Divide by 2.54 to get inches.', 'Multiply the decimal part by 16, round to a whole number, write it over 16 and simplify.'], text: o.text || 'nearest 1/16' });
  }
  function sixPool(test) { var out = []; for (var c = 40; c <= 800; c += 5) { var cm = c / 10, z = sixteenths(cm), x16 = (z.inch - Math.floor(z.inch)) * 16; if (z.s > 0 && Math.abs(x16 - Math.floor(x16) - 0.5) > 0.12 && test(z, cm)) out.push(cm); } return out; }
  var SIX_ODD = sixPool(function (z, cm) { return z.s % 2 === 1 && [45, 76].indexOf(cm) < 0 && (cm * 2) % 1 === 0; }), SIX_EVEN = sixPool(function (z, cm) { return z.s % 2 === 0 && [45, 76].indexOf(cm) < 0 && (cm * 2) % 1 === 0; });

  /* ---- a height in feet and inches → cm (Q8, Q18, A5) ---- */
  function hBad(f, i) {
    var T = hIn(f, i), b = [[Number(f + '.' + i) * 30.48, 'u3l5-dot-ft', FP(T) + ' is <b>not</b> ' + f + '.' + i + ' ft: there are 12 inches in a foot, not 10. Change it to inches first: ' + t(f + '\\times 12+' + i + '=' + T) + ' in.'],
      [T, 'u3l5-total-in', 'That’s the height in <b>inches</b>. Now multiply by 2.54 to get centimetres.'], [T / 2.54, 'u3len-wrong-way', 'Inches → centimetres: <b>multiply</b> by 2.54 (the number of cm is bigger).'],
      [f * 30.48 + i, 'u3l5-in-not-conv', 'You changed the feet, but the ' + i + ' in must be changed too (' + t(i + '\\times 2.54') + '). Easier: change the whole height to inches first.'], [(f * 10 + i) * 2.54, 'u3l5-ten-in', 'There are 12 inches in a foot, not 10: ' + t(f + '\\times 12+' + i + '=' + T) + ' in.'], [T * 2.5, 'u3len-estimate', 'Use the exact fact 1 in = 2.54 cm (2.5 is only for estimates).']];
    return b;
  }
  function hSol(f, i, dp) { var T = hIn(f, i), v = T * 2.54; return [t(f + '\\times 12+' + i + '=' + T) + ' in', t(T + '\\times 2.54' + eqR(v, dp) + uT('cm'))]; }
  function heightPart(prompt, f, i, o) {
    o = o || {}; var v = hIn(f, i) * 2.54;
    return num(prompt, v, { dp: 0, exact: v, after: 'cm', nr: o.nr, bad: hBad(f, i), sol: hSol(f, i, 0), hints: ['Change the height to inches: feet × 12 + inches.', 'Then multiply by 2.54 and round to the nearest centimetre.'], text: o.text || 'height to cm' });
  }
  /* a height in cm → feet and inches (nearest inch) */
  function cmToFtIn(prompt, cm, o) {
    o = o || {}; var inch = cm / 2.54, T = Math.round(inch), F0 = Math.floor(T / 12), I0 = T - 12 * F0;
    var bad = [[Math.round(cm / 12), 'u3l5-no-254', 'Change centimetres to <b>inches</b> first (÷ 2.54), then take out the 12s.'], [Math.round(cm * 2.54), 'u3len-wrong-way', 'Centimetres → inches: <b>divide</b> by 2.54.'], [Math.floor(cm / 30.48) * 12 + Math.round((cm / 30.48 - Math.floor(cm / 30.48)) * 100), 'u3len-dec-in', t(N(cm) + '\\div 30.48=' + N(rd(cm / 30.48, 2))) + ' ft, but the decimal part of a foot is <b>not</b> inches. Change to inches instead: ÷ 2.54.'], [Math.floor(cm / 30.48) * 12 + Math.round((cm / 30.48 - Math.floor(cm / 30.48)) * 10), 'u3len-dec-in', 'The decimal part of a foot is <b>not</b> inches. Change centimetres to inches (÷ 2.54), then take out the 12s.']];
    return C.ftIn(prompt, T, { bad: bad, sol: [t(N(cm) + '\\div 2.54=' + N(rd(inch, 2)) + '\\ldots\\approx ' + T) + ' in', 'How many 12s? ' + t(F0 + '\\times 12=' + 12 * F0) + ', ' + t(T + '-' + 12 * F0 + '=' + I0), t(N(cm) + uT('cm') + '\\approx ' + FPt(T))].concat(o.sol || []),
      hints: ['Divide by 2.54 to get inches, and round to the nearest inch.', 'Take out as many 12s as you can: they are the feet. The rest is the inches.'], text: o.text || 'cm to ft-in' });
  }
  function htPool(lo, hi, ex) { var out = []; for (var T = lo; T <= hi; T++) { var v = T * 2.54; if (Math.abs(v - Math.floor(v) - 0.5) > 0.06 && ex.indexOf(T) < 0) out.push(T); } return out; }
  function cmPool(lo, hi, ex) { var out = []; for (var c = lo; c <= hi; c++) { var v = c / 2.54; if (Math.abs(v - Math.floor(v) - 0.5) > 0.06 && ex.indexOf(c) < 0) out.push(c); } return out; }
  var EX_H = [70, 62, 42, 80];                     // worked examples: 5′10″, 5′2″, 3′6″, 6′8″

  HW.defineLesson({
    id: 'u3l5', unit: 3, num: '5', title: 'Converting Length Between SI and Imperial', outcome: 'M2',
    blurb: 'Changing inches, feet, yards and miles to centimetres, metres and kilometres (and back), estimating in your head, heights, speeds and price per metre.',
    questions: [
      { num: '1', stem: 'Which length is longer? Choose the answer with the right reason.', parts: [
        longerPart('sameUnits', '1a', 'BEG', 'M2'), longerPart('inCm', '1b', 'BEG', 'M2'), longerPart('miKm', '1c', 'EMG', 'M2'), longerPart('yardsM', '1d', 'BEG', 'M2'), longerPart('near', '1e', 'EMG', 'M2', ['ft25'])] },
      { num: '2', stem: 'Estimate in your head.', parts: [
        estGen('2a', 'BEG', 'M1', 'cm>in', [[20, 'A # cm pencil case'], [40, 'A # cm shoebox'], [70, 'A # cm shelf'], [80, 'An # cm desk'], [30, 'A # cm ruler'], [120, 'A # cm table']]),
        estGen('2b', 'BEG', 'M2', 'ft>cm', [[7, 'A # ft couch'], [4, 'A # ft bookcase'], [5, 'A # ft kayak paddle'], [8, 'An # ft sheet of plywood'], [3, 'A # ft table'], [12, 'A # ft trailer']]),
        estGen('2c', 'BEG', 'M2', 'mi>km', [[20, '# mi'], [30, '# mi'], [40, '# mi'], [10, '# mi'], [25, '# mi'], [15, '# mi']]),
        estGen('2d', 'BEG', 'M1', 'km>mi', [[200, '# km'], [150, '# km'], [400, '# km'], [500, '# km'], [250, '# km'], [80, '# km']])] },
      { num: '3', stem: 'Convert. Use a unit factor. Round to the nearest tenth.', parts: [
        convGen('3a', 'BEG', 'M2', 'in>cm', [11, 13, 14, 15, 16, 17, 19, 21], 1), convGen('3b', 'EMG', 'M1', 'cm>in', [35, 55, 65, 75, 85, 95, 110], 1),
        convGen('3c', 'BEG', 'M2', 'ft>cm', [4, 5, 7, 8, 9, 11, 14], 1), convGen('3d', 'EMG', 'M1', 'm>yd', [100, 200, 400, 800, 1500, 300], 1),
        convGen('3e', 'BEG', 'M2', 'mi>km', [2.5, 3.5, 4.5, 6.2, 7.5, 8.5], 1), convGen('3f', 'EMG', 'M1', 'km>mi', [21.1, 42.2, 10, 15, 25, 12.5], 1)] },
      { num: '4', stem: function (sh) { return sh.who + ' changed ' + sh.n + ' in to centimetres. His work was ' + t(sh.n + '\\div 2.54\\approx ' + N(rd(sh.n / 2.54, 1))) + ' cm.'; },
        shared: function (r) { return { who: r.pick(['Kenji', 'Malik', 'Theo', 'Omar', 'Nico']), n: r.pick([14, 16, 18, 20, 22, 24, 26, 30]) }; },
        parts: [
          { id: '4a', level: 'EMG', outcome: 'M2', make: function (r, sh) {
            return mc(r, '(a) Without a calculator, how can you tell his answer is wrong?', [
              { html: 'A centimetre is <b>shorter</b> than an inch, so it takes <b>more</b> centimetres: the answer should be bigger than ' + sh.n + ' (about ' + t(sh.n + '\\times 2.5=' + N(2.5 * sh.n)) + ').', right: true },
              { html: 'An inch is shorter than a centimetre, so the answer should be smaller than ' + sh.n + ', but not that small.', why: 'An inch (about the width of your thumb) is <b>longer</b> than a centimetre.', code: 'u3l5-bigger-unit' },
              { html: 'He should have rounded to the nearest whole number.', why: 'Rounding can’t fix the size of the answer. Should the number of centimetres be bigger or smaller than ' + sh.n + '?', code: 'round' },
              { html: 'You can’t tell without a calculator.', why: 'You can: ask whether the number should get bigger or smaller. A centimetre is shorter than an inch.', code: 'cant' }],
              ['A centimetre is shorter than an inch, so the number of centimetres must be <b>bigger</b> than ' + sh.n + ' (about ' + t(sh.n + '\\times 2.5=' + N(2.5 * sh.n)) + ').'], ['Should the number of centimetres be bigger or smaller than the number of inches?'], 'Kenji how can you tell');
          } },
          { id: '4b', level: 'BEG', outcome: 'M2', make: function (r, sh) { var v = q(sh.n * 2.54); return num('(b) What should he have done? Find the correct answer.', v, { dp: null, alts: [rd(v, 1)], after: 'cm', bad: [[sh.n / 2.54, 'u3len-wrong-way', 'That’s his answer. Inches → centimetres: <b>multiply</b> by 2.54.'], [sh.n * 2.5, 'u3len-estimate', 'That’s the estimate. Multiply by the exact fact, 2.54.'], [sh.n * 25.4, 'u3len-mm-fact', 'That’s millimetres. Multiply by 2.54 for centimetres.']], sol: ['Multiply: ' + t(sh.n + '\\times 2.54=' + N(v)) + ' cm.'], hints: ['1 in = 2.54 cm. Should you multiply or divide?'], text: 'Kenji correct' }); } }] },
      { num: '5', stem: function (sh) { return sh.who + ' says that ' + Np(sh.m) + ' m is about ' + Np(sh.ft) + ' ft. Check by converting ' + Np(sh.ft) + ' ft back to metres (use 1 ft = 30.48 cm).'; },
        shared: function (r) { return find(function () { var m = r.pick([150, 200, 250, 300, 400, 500, 600, 750]), good = r.chance(0.65), ft = good ? Math.round(m * 3.28 / 10) * 10 : Math.round(m * r.pick([3, 3.5]) / 10) * 10; return { who: r.pick(['Ava', 'Noor', 'Priya', 'Sofia', 'Zara']), m: m, ft: ft, back: ft * 0.3048 }; }, function (s) { var e = Math.abs(s.back - s.m); return e < 2.5 || e > 15; }); },
        parts: [
          { id: '5a', level: 'EMG', outcome: 'M2', make: function (r, sh) { var cm = q(sh.ft * 30.48), v = cm / 100; return num('(a) What is ' + Np(sh.ft) + ' ft in metres, to the nearest tenth?', v, { dp: 1, exact: v, after: 'm', alts: [sh.ft / 3.28], bad: [[cm, 'u3len-cm-not-m', 'That’s in <b>centimetres</b>. Divide by 100 to get metres.'], [sh.ft * 3.28, 'u3len-wrong-way', 'A foot is shorter than a metre, so there are <b>fewer</b> metres: ' + t(N(sh.ft) + '\\times 30.48') + ' cm, then ÷ 100.'], [sh.ft / 30.48, 'u3len-wrong-way', 'Feet → centimetres: <b>multiply</b> by 30.48, then divide by 100.'], [sh.ft * 2.54 / 100, 'u3len-in-fact', '2.54 is for inches. 1 ft = 30.48 cm.']],
            sol: [t(N(sh.ft) + '\\times 30.48=' + N(cm)) + ' cm', t(N(cm) + '\\div 100' + eqR(v, 1) + uT('m'))], hints: ['Multiply by 30.48 to get centimetres, then divide by 100 to get metres.'], text: 'Ava back to m' }); } },
          { id: '5b', level: 'EMG', outcome: 'M2', make: function (r, sh) { var v = rd(sh.back, 1), okC = Math.abs(sh.back - sh.m) < 2.5;
            return mc(r, '(b) Is ' + sh.who + ' right?', [
              { html: '<b>Yes</b>: ' + Np(sh.ft) + ' ft is about ' + Np(v) + ' m, very close to ' + Np(sh.m) + ' m.', right: okC, why: Np(sh.ft) + ' ft is about ' + Np(v) + ' m. Is that close to ' + Np(sh.m) + ' m?', code: 'said-yes' },
              { html: '<b>No</b>: ' + Np(sh.ft) + ' ft is about ' + Np(v) + ' m, which is not close to ' + Np(sh.m) + ' m.', right: !okC, why: 'Compare: ' + Np(v) + ' m and ' + Np(sh.m) + ' m are very close (less than a metre or two apart).', code: 'said-no' },
              { html: '<b>No</b>: ' + Np(sh.ft) + ' and ' + Np(sh.m) + ' are different numbers, so the lengths are different.', why: 'Different units give different numbers for the same length. Convert, then compare.', code: 'u3l5-same-num' }],
              [t(N(sh.ft) + '\\times 30.48=' + N(q(sh.ft * 30.48))) + ' cm = ' + Np(rd(sh.back, 3)) + ' m ≈ ' + Np(v) + ' m', okC ? 'Yes: ' + Np(sh.ft) + ' ft is very close to ' + Np(sh.m) + ' m.' : 'No: ' + Np(sh.ft) + ' ft is about ' + Np(v) + ' m, not ' + Np(sh.m) + ' m. (' + Np(sh.m) + ' m is about ' + Np(Math.round(sh.m * 3.28)) + ' ft.)'], null, 'Ava right');
          } }] },
      { num: '6', stem: 'Change each fraction to a decimal first, then convert.', parts: [
        fracGen('6a', 'BEG', 'M2', 'mm', [[[0, 3, 8], 'A # wrench'], [[0, 5, 8], 'A # wrench'], [[0, 7, 16], 'A # socket'], [[0, 9, 16], 'A # socket'], [[0, 3, 4], 'A # wrench'], [[0, 7, 8], 'A # drill bit'], [[0, 1, 2], 'A # wrench']], 1),
        fracGen('6b', 'EMG', 'M2', 'cm', [[[5, 1, 2], 'A board # wide'], [[7, 1, 4], 'A board # wide'], [[9, 1, 4], 'A board # wide'], [[11, 1, 4], 'A board # wide'], [[3, 1, 4], 'A trim board # wide']], 1),
        fracGen('6c', 'EMG', 'M2', 'cm', [[[6, 1, 4], 'A phone # tall'], [[5, 7, 8], 'A phone # tall'], [[6, 1, 8], 'A phone # tall'], [[9, 3, 4], 'A tablet # tall'], [[8, 1, 2], 'A notepad # tall'], [[10, 3, 4], 'A book # tall']], 1)] },
      { num: '7', stem: 'Change each metric length to inches, to the nearest ' + t('\\tfrac{1}{16}') + ' in. Simplify the fraction.', parts: [
        { id: '7a', level: 'EMG', outcome: 'M1', make: function (r) { var cm = r.pick(SIX_ODD.filter(function (c) { return c < 12; })); return sixPart('(a) ' + Np(cm) + ' cm', cm); } },
        { id: '7b', level: 'PRG', outcome: 'M1', make: function (r) { var cm = r.pick(SIX_EVEN.filter(function (c) { return c >= 8 && c <= 25; })); return sixPart('(b) ' + Np(cm) + ' cm', cm); } },
        { id: '7c', level: 'PRG', outcome: 'M1', make: function (r) { var cm = r.pick(SIX_ODD.filter(function (c) { return c >= 25 && c <= 60 && c % 1 === 0; })); return sixPart('(c) ' + Np(cm) + ' cm', cm); } }] },
      { num: '8', stem: 'Complete the table. Round to the nearest centimetre or the nearest inch.', parts: [
        { id: '8a', level: 'BEG', outcome: 'M2', make: function (r) { var T = r.pick(htPool(59, 67, EX_H)); return heightPart('(a) ' + t(FPt(T)) + ' in centimetres', Math.floor(T / 12), T % 12); } },
        { id: '8b', level: 'BEG', outcome: 'M2', make: function (r) { var T = r.pick(htPool(68, 76, EX_H.concat([72]))); return heightPart('(b) ' + t(FPt(T)) + ' in centimetres', Math.floor(T / 12), T % 12); } },
        { id: '8c', level: 'EMG', outcome: 'M1', make: function (r) { var c = r.pick(cmPool(148, 165, [168, 162])); return cmToFtIn('(c) ' + c + ' cm in feet and inches', c); } },
        { id: '8d', level: 'EMG', outcome: 'M1', make: function (r) { var c = r.pick(cmPool(170, 195, [168, 175])); return cmToFtIn('(d) ' + c + ' cm in feet and inches', c); } }] },
      { num: '9', stem: function (sh) { return 'On a basketball team roster, ' + sh.a + ' is listed at ' + t(FPt(sh.T)) + ' and ' + sh.b + ' at ' + sh.cm + ' cm.'; },
        shared: function (r) { var nm = r.sample(['Jalen', 'Tomas', 'Marcus', 'Andre', 'Kofi', 'Mateo', 'Luka', 'Devin'], 2); return find(function () { var T = r.int(74, 83), cm = r.int(186, 214); return { a: nm[0], b: nm[1], T: T, cm: cm, d: q(T * 2.54 - cm) }; }, function (s) { return Math.abs(s.d) >= 1.2 && Math.abs(s.d) <= 14 && s.T !== 80 && s.T !== 73; }); },
        parts: [
          { id: '9a', level: 'EMG', outcome: 'M3', make: function (r, sh) { var cmA = q(sh.T * 2.54), aT = sh.d > 0;
            return mc(r, '(a) Who is taller?', [{ html: '<b>' + sh.a + '</b>', right: aT, why: sh.a + ' is ' + t(N(cmA)) + ' cm tall. Compare with ' + sh.cm + ' cm.', code: 'pick-a' }, { html: '<b>' + sh.b + '</b>', right: !aT, why: 'Change ' + sh.a + '’s height to centimetres first: ' + t(sh.T + '\\times 2.54=' + N(cmA)) + ' cm.', code: 'pick-b' }, { html: 'They are the same height.', why: 'Change ' + sh.a + '’s height to centimetres and compare.', code: 'same' }],
              [sh.a + ': ' + t(Math.floor(sh.T / 12) + '\\times 12+' + sh.T % 12 + '=' + sh.T) + ' in; ' + t(sh.T + '\\times 2.54=' + N(cmA)) + ' cm', (aT ? sh.a : sh.b) + ' is taller.'], ['Change the height in feet and inches to centimetres, then compare.'], 'who taller'); } },
          { id: '9b', level: 'PRG', outcome: 'M3', make: function (r, sh) { var cmA = q(sh.T * 2.54), d = Math.abs(sh.d), ftDot = Number(Math.floor(sh.T / 12) + '.' + sh.T % 12) * 30.48;
            return num('(b) By how many centimetres is ' + (sh.d > 0 ? sh.a : sh.b) + ' taller? Round to the nearest tenth.', d, { dp: 1, exact: d, after: 'cm', bad: [[cmA + sh.cm, 'u3l5-sum', 'To find how much taller, <b>subtract</b> the two heights.'], [Math.abs(sh.T - sh.cm / 2.54), 'u3l5-in-diff', 'That difference is in <b>inches</b>. Find both heights in centimetres, then subtract.'], [Math.abs(ftDot - sh.cm), 'u3l5-dot-ft', t(FPt(sh.T)) + ' is not ' + Math.floor(sh.T / 12) + '.' + sh.T % 12 + ' ft. Change it to inches first: ' + t(Math.floor(sh.T / 12) + '\\times 12+' + sh.T % 12 + '=' + sh.T) + '.'], [Math.abs(sh.T - sh.cm), 'u3l5-in-not-conv', 'Change ' + sh.T + ' in to centimetres before you subtract.']],
              sol: [sh.a + ': ' + t(sh.T + '\\times 2.54=' + N(cmA)) + ' cm', t((sh.d > 0 ? N(cmA) + '-' + sh.cm : sh.cm + '-' + N(cmA)) + eqR(d, 1)), (sh.d > 0 ? sh.a : sh.b) + ' is taller, by about ' + Np(rd(d, 1)) + ' cm.'], hints: ['Find both heights in centimetres, then subtract.'], text: 'how much taller' }); } }] },
      { num: '10', stem: function (sh) { return 'A ' + sh.place + ' has a sign: “Clearance ' + t(FPt(sh.T)) + '”. A ' + sh.veh + ' is ' + Np(sh.h) + ' m tall.'; },
        shared: function (r) { return find(function () { var T = r.pick([84, 90, 96, 102, 108, 114, 120, 126, 132]), fits = r.chance(0.65), cmC = T * 2.54, h = rd((cmC + (fits ? -r.int(4, 25) : r.int(2, 12))) / 100, 2), w = r.pick([['drive-through', 'delivery truck'], ['parking garage', 'camper van'], ['car wash', 'pickup truck with a rack'], ['bridge underpass', 'moving truck']]); return { T: T, h: h, cmC: cmC, place: w[0], veh: w[1], room: q(cmC - h * 100) }; }, function (s) { return Math.abs(s.room) >= 1 && (s.h * 100) % 1 === 0 && s.T !== 80 && Math.abs(Math.abs(s.room * 10) % 1 - 0.5) > 0.05; }); },
        parts: [
          { id: '10a', level: 'EMG', outcome: 'M3', make: function (r, sh) { var fits = sh.room > 0;
            return mc(r, '(a) Will it fit under the sign?', [{ html: '<b>Yes</b>: the clearance is ' + Np(rd(sh.cmC, 2)) + ' cm and the ' + sh.veh + ' is ' + Np(sh.h * 100) + ' cm.', right: fits, why: 'Compare in the same unit: the clearance is ' + Np(rd(sh.cmC, 2)) + ' cm and the ' + sh.veh + ' is ' + Np(sh.h * 100) + ' cm.', code: 'said-yes' },
              { html: '<b>No</b>: the ' + sh.veh + ' is ' + Np(sh.h * 100) + ' cm, but the clearance is only ' + Np(rd(sh.cmC, 2)) + ' cm.', right: !fits, why: 'Compare in the same unit: ' + Np(rd(sh.cmC, 2)) + ' cm of clearance and a ' + Np(sh.h * 100) + ' cm ' + sh.veh + '.', code: 'said-no' },
              { html: '<b>' + (Math.floor(sh.T / 12) > sh.h ? 'Yes' : 'No') + '</b>: ' + Math.floor(sh.T / 12) + ' is ' + (Math.floor(sh.T / 12) > sh.h ? 'more' : 'less') + ' than ' + Np(sh.h) + '.', right: false, why: 'Feet and metres are different units. Change both heights to centimetres before you compare.', code: 'u3l5-ft-m' }],
              ['Clearance: ' + t(Math.floor(sh.T / 12) + '\\times 12+' + sh.T % 12 + '=' + sh.T) + ' in; ' + t(sh.T + '\\times 2.54=' + N(rd(sh.cmC, 2))) + ' cm', 'The ' + sh.veh + ': ' + t(N(sh.h) + '\\times 100=' + N(rd(sh.h * 100, 0))) + ' cm', fits ? 'Yes, it fits.' : 'No, it is too tall.'], ['Change both heights to centimetres.'], 'fit');
          } },
          { id: '10b', level: 'PRG', outcome: 'M3', make: function (r, sh) { var fits = sh.room > 0, d = Math.abs(sh.room);
            return num(fits ? '(b) How much room is there above it, in centimetres (nearest tenth)?' : '(b) How much too tall is it, in centimetres (nearest tenth)?', d, { dp: 1, exact: d, after: 'cm', bad: [[Math.abs(sh.T * 2.54 / 100 - sh.h), 'u3l5-cm-m', 'That’s in <b>metres</b>. Give the answer in centimetres (× 100).'], [Math.abs(sh.T - sh.h * 100 / 2.54), 'u3l5-in-diff', 'That’s in <b>inches</b>. Find both heights in centimetres, then subtract.'], [Math.abs(Math.floor(sh.T / 12) * 30.48 - sh.h * 100), 'u3l5-in-not-conv', 'Include the ' + sh.T % 12 + ' in of the clearance too.'], [sh.cmC + sh.h * 100, 'u3l5-sum', 'Subtract the two heights.']].filter(function (b) { return sh.T % 12 || b[1] !== 'u3l5-in-not-conv'; }),
              sol: [fits ? t(N(rd(sh.cmC, 2)) + '-' + N(rd(sh.h * 100, 0)) + eqR(d, 1)) : t(N(rd(sh.h * 100, 0)) + '-' + N(rd(sh.cmC, 2)) + eqR(d, 1)), fits ? 'It fits, with about ' + rd(d, 1).toFixed(1) + ' cm to spare.' : 'It is about ' + rd(d, 1).toFixed(1) + ' cm too tall.'],
              hints: ['Find both heights in centimetres, then subtract.'], text: 'room' }); } }] },
      { num: '11', stem: 'Round to the nearest whole number.', shared: function (r) { return find(function () { var L = r.pick([60, 65, 70, 75]), v = r.pick([90, 95, 100, 105, 110, 115, 120, 125, 130]), kmh = L * 1.609; return { L: L, v: v, kmh: kmh, st: r.pick(['Idaho', 'Montana', 'Washington', 'Oregon', 'Utah']) }; }, function (s) { return Math.abs(s.kmh - s.v) >= 2 && Math.abs(s.kmh - s.v) <= 20 && Math.abs(Math.abs(s.kmh - s.v) % 1 - 0.5) > 0.05; }); },
        parts: [
          { id: '11a', level: 'BEG', outcome: 'M2', make: function (r, sh) { return conv('(a) The speed limit on a highway in ' + sh.st + ' is ' + sh.L + ' mph. What is that in km/h?', sh.L, 'mi>km', 0, { text: 'mph to km/h' }); } },
          { id: '11bi', sub: 'b i', level: 'EMG', outcome: 'M3', make: function (r, sh) { var over = sh.v > sh.kmh;
            return mc(r, '(b) A Canadian driver is going ' + sh.v + ' km/h on that highway. Is she over or under the limit?', [{ html: '<b>Over</b> the limit', right: over, why: 'The limit is about ' + Math.round(sh.kmh) + ' km/h. Is ' + sh.v + ' km/h more or less than that?', code: 'said-over' }, { html: '<b>Under</b> the limit', right: !over, why: 'The limit is about ' + Math.round(sh.kmh) + ' km/h (your answer to (a)). ' + sh.v + ' km/h is more than that.', code: 'said-under' }],
              ['Limit: about ' + Math.round(sh.kmh) + ' km/h. She is going ' + sh.v + ' km/h, so she is ' + (over ? 'over' : 'under') + ' the limit.'], ['Compare her speed with your answer to (a).'], 'over under', true); } },
          { id: '11bii', sub: 'b ii', level: 'EMG', outcome: 'M3', make: function (r, sh) { var d = Math.abs(sh.kmh - sh.v);
            return num('(b) By how much (in km/h)?', d, { dp: 0, exact: d, alts: [Math.abs(Math.round(sh.kmh) - sh.v)], after: 'km/h', bad: [[Math.abs(sh.v - sh.L), 'u3l5-ft-m', 'Don’t subtract mph from km/h. Use the limit in km/h from (a).'], [Math.abs(sh.v * 0.621 - sh.L), 'u3l5-in-diff', 'That difference is in mph. Give it in km/h: compare ' + sh.v + ' km/h with the limit in km/h.']],
              sol: [sh.kmh > sh.v ? t(N(rd(sh.kmh, 3)) + '-' + sh.v + '\\approx ' + Math.round(d)) : t(sh.v + '-' + N(rd(sh.kmh, 3)) + '\\approx ' + Math.round(d)), 'About ' + Math.round(d) + ' km/h ' + (sh.v > sh.kmh ? 'over' : 'under') + ' the limit.'], hints: ['Subtract her speed and the limit, both in km/h.'], text: 'by how much' }); } },
          { id: '11c', level: 'BEG', outcome: 'M1', make: function (r) { var v = r.pick([40, 50, 60, 70, 80, 90, 110].filter(function (x) { return agree(x, 'km>mi', 0); })); return conv('(c) A visitor from Texas sees a ' + v + ' km/h sign in Calgary. What is that in mph?', v, 'km>mi', 0, { text: 'km/h to mph' }); } }] },
      { num: '12', stem: function (sh) { return sh.who + '’s running app shows that she ran ' + Np(sh.mi) + ' mi in a fun run. Her ' + ['', '', 'two', 'three', 'four'][sh.k] + ' sponsors each pledged ' + Mp(sh.p) + ' per kilometre.'; },
        shared: function (r) { return find(function () { return { who: r.pick(['Ella', 'Maya', 'Hana', 'Aisha', 'Rosa']), mi: r.pick([3.1, 3.5, 3.8, 4.2, 4.6, 5.2, 6.2]), k: r.int(2, 4), p: r.pick([1.5, 2, 2.5, 3, 4, 5]) }; }, function (s) { var v = s.mi * 1.609 * 10; return Math.abs(v - Math.floor(v) - 0.5) > 0.05; }); },
        parts: [
          { id: '12a', level: 'BEG', outcome: 'M2', make: function (r, sh) { return conv('(a) How far did she run, in kilometres, to the nearest tenth?', sh.mi, 'mi>km', 1, { text: 'run km' }); } },
          { id: '12b', level: 'EMG', outcome: 'M3', make: function (r, sh) { var km = rd(sh.mi * 1.609, 1), one = q(km * sh.p), tot = q(one * sh.k), raw2 = sh.mi * 1.609 * sh.p * sh.k;
            return num('(b) Using your answer to (a), how much money did she raise?', tot, { money: true, alts: [raw2], after: '', bad: [[one, 'u3l5-one-sponsor', 'That’s the money from <b>one</b> sponsor. She has ' + sh.k + ' sponsors.'], [sh.mi * sh.p * sh.k, 'u3l5-miles-pledge', 'The pledge is per <b>kilometre</b>: use the distance in km from (a).'], [sh.mi * sh.p, 'u3l5-miles-pledge', 'Use the distance in km, and include all ' + sh.k + ' sponsors.']],
              sol: ['One sponsor: ' + t(N(km) + '\\times ' + M(sh.p) + '=' + M(one)), cap(['', '', 'two', 'three', 'four'][sh.k]) + ' sponsors: ' + t(sh.k + '\\times ' + M(one) + '=' + M(tot))], hints: ['Distance in km × the pledge per km = money from one sponsor.', 'Then multiply by the number of sponsors.'], text: 'money raised' }); } }] },
      { num: '13', stem: function (sh) { return 'A hardware store sells rope for ' + Mp(sh.p) + ' per foot. A marine store sells the same rope for ' + Mp(sh.m) + ' per metre.'; },
        shared: function (r) { return find(function () { var p = r.int(79, 199) / 100, pm = p / 0.3048, m = rd(pm + (r.chance(0.5) ? 1 : -1) * r.int(6, 40) / 100, 2); return { p: p, pm: pm, m: m }; }, function (s) { return Math.abs(rd(s.pm, 2) - s.m) >= 0.05 && near(rd(s.p * 3.28, 2), rd(s.pm, 2)) && Math.abs(s.pm * 100 % 1 - 0.5) > 0.03 && s.p !== 1.29; }); },
        parts: [
          { id: '13a', level: 'EMG', outcome: 'M2', make: function (r, sh) { return num('(a) Find the hardware store’s price per metre.', sh.pm, { money: true, exact: sh.pm, alts: [sh.p * 3.28], after: '/m', bad: [[sh.p * 0.3048, 'u3len-wrong-way', 'A metre is longer than a foot, so a metre costs <b>more</b>: divide by 0.3048 (1 ft = 0.3048 m).'], [sh.p / 30.48, 'u3len-cm-not-m', '1 ft = 30.48 cm = 0.3048 m. Divide by 0.3048 to get the price per metre.'], [sh.p * 30.48, 'u3len-cm-not-m', '1 ft = 0.3048 m. Divide the price by 0.3048.'], [sh.p / 0.9144, 'u3len-yd-fact', '0.9144 is for yards. 1 ft = 0.3048 m.']],
            sol: ['1 ft = 30.48 cm = 0.3048 m', t(M(sh.p) + '\\div 0.3048=' + raw(sh.pm, 3) + '\\approx ' + M(sh.pm)) + ' per m'], hints: ['Price per metre = price ÷ length in metres. One foot is 0.3048 m.'], text: 'rope per m' }); } },
          { id: '13b', level: 'EMG', outcome: 'M3', make: function (r, sh) { var hw = rd(sh.pm, 2) < sh.m;
            return mc(r, '(b) Which store has the lower price per metre?', [{ html: '<b>The hardware store</b>: ' + Mp(sh.pm) + ' per m is less than ' + Mp(sh.m) + ' per m.', right: hw, why: 'Compare the prices per metre: ' + Mp(sh.pm) + ' and ' + Mp(sh.m) + '.', code: 'pick-hw' }, { html: '<b>The marine store</b>: ' + Mp(sh.m) + ' per m is less than ' + Mp(sh.pm) + ' per m.', right: !hw, why: 'Compare the prices per metre: ' + Mp(sh.pm) + ' and ' + Mp(sh.m) + '.', code: 'pick-marine' }, { html: '<b>The hardware store</b>: ' + Mp(sh.p) + ' is less than ' + Mp(sh.m) + '.', why: Mp(sh.p) + ' buys only one <b>foot</b>. Compare the price for the same length (one metre).', code: 'u3l5-ft-m' }],
              ['Hardware store: ' + Mp(sh.pm) + ' per m; marine store: ' + Mp(sh.m) + ' per m', 'The ' + (hw ? 'hardware' : 'marine') + ' store is lower, by about ' + Mp(Math.abs(rd(sh.pm, 2) - sh.m)) + ' per metre.'], ['Use your price per metre from (a).'], 'rope cheaper'); } }] },
      { num: '14', stem: function (sh) { return sh.who + ' is sewing a costume for the school play. The pattern says she needs ' + Np(sh.m) + ' m of fabric. The store sells the fabric for ' + Mp(sh.p) + ' per yard, cut in steps of ' + t('\\tfrac{1}{4}') + ' yd.'; },
        shared: function (r) { return find(function () { var m = r.pick([1.4, 1.8, 2.2, 2.7, 2.9, 3.2, 3.6, 4.1, 4.5]), p = r.pick([8.98, 9.48, 10.96, 11.98, 12.76, 13.48, 9.96]), yd = m / 0.9144; return { who: r.pick(['Nadia', 'Kayla', 'Priya', 'Jaya', 'Maya']), m: m, p: p, yd: yd, buy: roundUp(yd, 0.25) }; }, function (s) { return s.buy - s.yd > 0.002 && near(rd(s.buy * s.p, 2), q(s.buy * s.p)) && Math.abs(q(s.buy * s.p * 1.05) * 100 % 1 - 0.5) > 0.03; }); },
        parts: [
          { id: '14a', level: 'PRG', outcome: 'M3', make: function (r, sh) { var near4 = Math.round(sh.yd * 4) / 4, bad = [[sh.yd, 'u3l5-no-round-up', 'The store cuts in steps of ¼ yd (…, 2, 2.25, 2.5, 2.75, …). Round <b>up</b> to the next step so there is enough.'], [sh.m, 'u3l5-m-as-yd', 'That’s the length in metres. Change it to yards: divide by 0.9144.'], [roundUp(sh.m * 0.9144, 0.25), 'u3len-wrong-way', 'A yard is shorter than a metre, so it takes <b>more</b> yards: divide by 0.9144.']];
            if (!near(near4, sh.buy)) bad.push([near4, 'u3l5-round-down', 'Rounding to the <b>nearest</b> ¼ yd gives too little fabric here. Round <b>up</b> when you need enough.']);
            if (!near(Math.ceil(sh.yd), sh.buy)) bad.push([Math.ceil(sh.yd), 'u3l5-whole-yd', 'The fabric is cut in steps of ¼ yd, so you don’t need a whole extra yard. Round up to the next ¼ yd.']);
            return num('(a) How many yards must she buy?', sh.buy, { dp: null, after: 'yd', bad: bad, sol: [t(N(sh.m) + '\\div 0.9144=' + raw(sh.yd, 4)) + ' yd', 'Round <b>up</b> to the next ' + t('\\tfrac{1}{4}') + ' yd: ' + t(N(sh.buy)) + ' yd'], hints: ['Change metres to yards: divide by 0.9144.', 'Round <b>up</b> to the next ¼ yd (.25, .5, .75 or a whole number).'], text: 'yards to buy' }); } },
          { id: '14b', level: 'ADV', outcome: 'M3', make: function (r, sh) { var pre = q(sh.buy * sh.p), tot = q(pre * 1.05);
            return num('(b) What is the cost, including 5% GST?', tot, { money: true, exact: tot, bad: [[pre, 'u3l5-no-tax', 'Add the 5% GST: multiply by 1.05.'], [pre * 0.05, 'u3l5-tax-only', 'That’s only the GST. Add it to the price (or multiply by 1.05).'], [sh.yd * sh.p * 1.05, 'u3l5-exact-yd', 'Use the amount she must <b>buy</b> (rounded up to the next ¼ yd), not the exact yards.'], [sh.m * sh.p * 1.05, 'u3l5-m-as-yd', 'The price is per <b>yard</b>: use the yards from (a).'], [sh.buy * sh.p * 1.5, 'u3l5-tax-only', '5% = 0.05, so multiply by 1.05 (not 1.5).']],
              sol: [t(N(sh.buy) + '\\times ' + M(sh.p) + '=' + M(pre)), t(M(pre) + '\\times 1.05=' + raw(tot, 4) + '\\approx ' + M(tot))], hints: ['Cost = yards bought × price per yard.', 'With 5% GST: multiply by 1.05.'], text: 'fabric cost GST' }); } }] },
      { num: '15', stem: function (sh) { return sh.c[2] + ' used to be ' + sh.c[0] + ' yd. Now they are ' + sh.c[1] + ' m.'; },
        shared: function (r) { return { c: r.pick([[440, 400, 'Some school tracks (once around)'], [25, 25, 'Some swimming pools (one length)'], [220, 200, 'Some sprint races'], [880, 800, 'Some middle-distance races'], [100, 100, 'Some sprint races']]), b: r.pick([[1, 1500, 'A “metric mile” race is 1500 m'], [1, 1600, 'Some schools run a 1600 m race instead of the mile'], [2, 3000, 'A 3000 m race is run instead of the 2 mi race'], [2, 3200, 'Some schools run a 3200 m race instead of the 2 mi race'], [3, 5000, 'A 5000 m race (5 km) is often compared with a 3 mi race'], [6, 10000, 'A 10 000 m race (10 km) is often compared with a 6 mi race']]) }; },
        parts: [
          { id: '15ai', sub: 'a i', level: 'EMG', outcome: 'M3', make: function (r, sh) { var v = q(sh.c[0] * 0.9144), yl = v > sh.c[1];
            return mc(r, '(a) Which is longer?', [{ html: '<b>The ' + sh.c[0] + ' yd</b> distance', right: yl, why: t(sh.c[0] + '\\times 0.9144=' + N(v)) + ' m. Compare with ' + sh.c[1] + ' m.', code: 'pick-yd' }, { html: '<b>The ' + sh.c[1] + ' m</b> distance', right: !yl, why: 'Change ' + sh.c[0] + ' yd to metres: ' + t(sh.c[0] + '\\times 0.9144=' + N(v)) + ' m.', code: 'pick-m' }, { html: 'They are the same', why: 'A yard is not a metre: 1 yd = 0.9144 m.', code: 'same' }],
              [t(sh.c[0] + '\\times 0.9144=' + N(v)) + ' m', 'The ' + (yl ? sh.c[0] + ' yd' : sh.c[1] + ' m') + ' distance is longer.'], ['Change the yards to metres (1 yd = 0.9144 m).'], 'track longer'); } },
          { id: '15aii', sub: 'a ii', level: 'PRG', outcome: 'M3', make: function (r, sh) { var v = q(sh.c[0] * 0.9144), d = Math.abs(v - sh.c[1]);
            return num('(a) By how many metres is it longer? Round to the nearest tenth.', d, { dp: 1, exact: d, after: 'm', bad: [[Math.abs(sh.c[0] / 0.9144 - sh.c[1]), 'u3len-wrong-way', 'Yards → metres: <b>multiply</b> by 0.9144.'], [Math.abs(sh.c[0] - sh.c[1]), 'u3l5-ft-m', 'Yards and metres are different units. Change ' + sh.c[0] + ' yd to metres first.'], [v + sh.c[1], 'u3l5-sum', 'Subtract to find how much longer.'], [Math.abs(sh.c[0] * 3.28 - sh.c[1]), 'u3len-ft-fact', 'Use 1 yd = 0.9144 m.']],
              sol: [t(sh.c[0] + '\\times 0.9144=' + N(v)) + ' m', t((v > sh.c[1] ? N(v) + '-' + sh.c[1] : sh.c[1] + '-' + N(v)) + eqR(d, 1)) + ' m'], hints: ['Change the yards to metres, then subtract.'], text: 'track how much longer' }); } },
          { id: '15b', level: 'PRG', outcome: 'M3', make: function (r, sh) { var b = sh.b, mi = b[0] * 1609, d = Math.abs(mi - b[1]), miL = mi > b[1];
            return num('(b) ' + b[2] + '. Using 1 mi ≈ 1.609 km, how many metres longer is the ' + (miL ? (b[0] === 1 ? 'mile' : b[0] + ' mi race') : Np(b[1]) + ' m race') + '?', d, { dp: null, alts: [], after: 'm', bad: [[Math.abs(b[0] * 1.609 - b[1]), 'u3l5-cm-m', '1.609 km is ' + t('1.609\\times 1000=1609') + ' m. Change to metres before you subtract.'], [Math.abs(b[0] * 1000 - b[1]), 'u3l5-ft-m', 'A mile is not 1000 m: 1 mi ≈ 1.609 km = 1609 m.'], [Math.abs(b[0] * 5280 - b[1]), 'u3l5-ft-m', '5280 is the number of <b>feet</b> in a mile. 1 mi ≈ 1609 m.'], [mi + b[1], 'u3l5-sum', 'Subtract to find how much longer.']],
              sol: [b[0] === 1 ? t('1\\text{ mi}\\approx 1.609\\text{ km}=1609\\text{ m}') : t(b[0] + '\\text{ mi}\\approx ' + b[0] + '\\times 1.609=' + N(q(b[0] * 1.609)) + uT('km') + '=' + N(mi) + uT('m')), t((miL ? N(mi) + '-' + N(b[1]) : N(b[1]) + '-' + N(mi)) + '=' + N(d)) + ' m longer'], hints: ['1 mi ≈ 1.609 km. Change it to metres (× 1000).', 'Then subtract.'], text: 'mile vs metric' }); } }] },
      { num: '16', parts: [{ id: '16', level: 'BEG', outcome: 'M2', make: function (r) { var v = r.pick([45, 50, 60, 65, 70, 75]), k = Math.round(v * 1.609), w1 = Math.round(v / 1.609), w2 = Math.round(v * 2.54);
        return mc(r, 'A car is going ' + v + ' mph. About how fast is that in km/h?', [{ html: k + ' km/h', right: true }, { html: w1 + ' km/h', why: 'A mile is longer than a kilometre, so the number of km/h is <b>bigger</b>: multiply by 1.609.', code: 'u3len-wrong-way' }, { html: v + ' km/h', why: 'mph and km/h are different units. Multiply by 1.609.', code: 'u3l5-same-num' }, { html: w2 + ' km/h', why: '2.54 is the fact for inches. For miles, use 1 mi ≈ 1.609 km.', code: 'u3len-in-fact' }],
          [t(v + '\\times 1.609=' + N(q(v * 1.609)) + '\\approx ' + k) + ' km/h'], ['1 mi ≈ 1.609 km, and “per hour” does not change.'], 'mph MC'); } }] },
      { num: '17', parts: [{ id: '17', level: 'PRG', outcome: 'M3', make: function (r) {
        var s = find(function () { var B = r.int(170, 230); var mv = rd((B + r.int(-7, 7)) / 100, 1), fi = Math.round((B + r.int(-7, 7)) / 2.54), yv = rd((B + r.int(-7, 7)) / 91.44, 1), iv = Math.round((B + r.int(-7, 7)) / 2.54) + r.pick([0, 1, -1]);
          var L = [{ h: Np(mv) + ' m', cm: q(mv * 100), w: t(N(mv) + '\\times 100=' + N(q(mv * 100))) + ' cm' }, { h: t(FPt(fi)), cm: q(fi * 2.54), w: t(Math.floor(fi / 12) + '\\times 12+' + fi % 12 + '=' + fi) + ' in; ' + t(fi + '\\times 2.54=' + N(q(fi * 2.54))) + ' cm' }, { h: Np(yv) + ' yd', cm: q(yv * 91.44), w: t(N(yv) + '\\times 91.44=' + N(q(yv * 91.44))) + ' cm' }, { h: iv + ' in', cm: q(iv * 2.54), w: t(iv + '\\times 2.54=' + N(q(iv * 2.54))) + ' cm' }];
          return { L: L, fi: fi, iv: iv }; }, function (s) { var c = s.L.map(function (x) { return x.cm; }).sort(function (a, b) { return b - a; }); return c[0] - c[1] >= 1.5 && c[1] - c[2] >= 0.5 && c[2] - c[3] >= 0.5 && s.fi !== 80 && s.fi % 12 !== 0 && s.fi !== s.iv; });
        var mx = 0; s.L.forEach(function (x, i) { if (x.cm > s.L[mx].cm) mx = i; });
        var big = s.L.map(function (x, i) { return i; }).sort(function (a, b) { return Number(String(s.L[b].h).replace(/[^\d.]/g, '')) - Number(String(s.L[a].h).replace(/[^\d.]/g, '')); });
        return mc(r, 'Which length is the <b>longest</b>?', s.L.map(function (x, i) { return { html: x.h, right: i === mx, why: i === 3 && i !== mx ? 'It has the biggest number, but inches are short. Change every length to centimetres and compare.' : 'Change every length to centimetres, then compare: this one is ' + Np(rd(x.cm, 2)) + ' cm.', code: 'pick' + i }; }), ['In centimetres:'].concat(s.L.map(function (x) { return x.h + ': ' + x.w; })).concat([s.L[mx].h + ' is the longest.']), ['Change every length to the same unit (centimetres), then compare.'], 'longest', true); } }] },
      { num: '18', parts: [{ id: '18', level: 'EMG', outcome: 'M2', make: function (r) { var T = r.pick(htPool(60, 75, EX_H.concat([64, 73]))), who = r.pick(['Kayla', 'Liam', 'Hana', 'Omar', 'Theo', 'Zara']);
        var p = heightPart(who + ' is ' + Math.floor(T / 12) + ' ft ' + T % 12 + ' in tall. Her height in centimetres, to the nearest centimetre, is ____ cm.'.replace('Her', who === 'Liam' || who === 'Omar' || who === 'Theo' ? 'His' : 'Her'), Math.floor(T / 12), T % 12, { nr: true, text: 'NR height' }); return p; } }] }
    ],
    extra: [
      { num: '1', section: 'A. Skills', stem: 'Which length is longer? Choose the answer with the right reason.', parts: [
        longerPart('inCm', 'e1a', 'BEG', 'M2', null, 'a'), longerPart('near', 'e1b', 'EMG', 'M2', null, 'b'), longerPart('miKm', 'e1c', 'EMG', 'M2', null, 'c'), longerPart('near', 'e1d', 'EMG', 'M2', null, 'd')] },
      { num: '2', stem: 'Estimate in your head.', parts: [
        estGen('e2a', 'BEG', 'M2', 'in>cm', [[40, 'A # in desk'], [20, 'A # in monitor'], [30, 'A # in suitcase'], [32, 'A # in TV'], [60, 'A # in shelf'], [24, 'A # in cutting board']], 'a'),
        estGen('e2b', 'BEG', 'M2', 'mi>km', [[10, 'A # mi bike ride'], [20, 'A # mi bike ride'], [15, 'A # mi hike'], [30, 'A # mi drive'], [25, 'A # mi bike ride']], 'b'),
        estGen('e2c', 'BEG', 'M1', 'cm>in', [[90, 'A # cm doorway'], [70, 'A # cm window'], [40, 'A # cm shelf'], [80, 'An # cm doorway'], [100, 'A # cm table']], 'c')] },
      { num: '3', stem: 'Convert. Round to the nearest tenth.', parts: [
        convGen('e3a', 'BEG', 'M2', 'in>cm', [24, 30, 32, 36, 42], 1, 'a'), convGen('e3b', 'EMG', 'M1', 'cm>in', [100, 120, 140, 150, 180], 1, 'b'), convGen('e3c', 'EMG', 'M2', 'ft>m', [12, 15, 18, 20, 25], 1, 'c'),
        convGen('e3d', 'EMG', 'M1', 'm>ft', [1.5, 2.5, 3.5, 4.2, 6], 1, 'd'), convGen('e3e', 'BEG', 'M2', 'mi>km', [6, 8, 9, 12, 15], 1, 'e'), convGen('e3f', 'EMG', 'M1', 'km>mi', [150, 250, 350, 400, 600], 1, 'f')] },
      { num: '4', stem: 'Change to millimetres, to the nearest tenth.', parts: [
        { id: 'e4a', sub: 'a', level: 'BEG', outcome: 'M2', make: function (r) { var fr = r.pick([[0, 1, 4], [0, 1, 8], [0, 3, 16], [0, 1, 2], [0, 11, 16]]); return fracConv('(a) ' + t(mT([fr[1], fr[2]], true) + uT('in')), fr, 'mm', 1); } },
        { id: 'e4b', sub: 'b', level: 'EMG', outcome: 'M2', make: function (r) { var fr = r.pick([[2, 5, 8], [1, 3, 8], [1, 7, 8], [3, 1, 4], [2, 3, 16]]); return fracConv('(b) ' + t(mT([fr[0] * fr[2] + fr[1], fr[2]], true) + uT('in')), fr, 'mm', 1); } }] },
      { num: '5', parts: [
        { id: 'e5a', sub: 'a', level: 'BEG', outcome: 'M2', make: function (r) { var T = r.pick(htPool(65, 74, EX_H)); return heightPart('(a) Change ' + t(FPt(T)) + ' to centimetres, to the nearest centimetre.', Math.floor(T / 12), T % 12); } },
        { id: 'e5b', sub: 'b', level: 'EMG', outcome: 'M1', make: function (r) { var c = r.pick(cmPool(160, 190, [168])); return cmToFtIn('(b) Change ' + c + ' cm to feet and inches, to the nearest inch.', c); } }] },
      { num: '6', section: 'B. Applying', stem: function (sh) { return 'A plumber has an old copper pipe that is ' + t(mT([sh.fr[0], sh.fr[1]], true) + uT('in')) + ' across. The new pipe is ' + sh.mm + ' mm across.'; },
        shared: function (r) { return find(function () { var fr = r.pick([[3, 4], [1, 2], [5, 8], [3, 8], [1, 1]]), v = fr[0] / fr[1] * 25.4, mm = r.chance(0.5) ? Math.floor(v) : Math.ceil(v); return { fr: fr, v: v, mm: mm }; }, function (s) { return Math.abs(s.v - s.mm) > 0.2; }); },
        parts: [
          { id: 'e6a', sub: 'a', level: 'EMG', outcome: 'M2', make: function (r, sh) { var oldW = sh.v > sh.mm, frT = t(mT([sh.fr[0], sh.fr[1]]) + uT('in'));
            return mc(r, '(a) Which pipe is wider?', [{ html: '<b>The old pipe</b> (' + frT + ')', right: oldW, why: frT + ' = ' + Np(rd(sh.v, 3)) + ' mm. Compare with ' + sh.mm + ' mm.', code: 'pick-old' }, { html: '<b>The new pipe</b> (' + sh.mm + ' mm)', right: !oldW, why: 'Change the old pipe to millimetres: ' + t(N(q(sh.fr[0] / sh.fr[1])) + '\\times 25.4=' + N(rd(sh.v, 3))) + ' mm.', code: 'pick-new' }, { html: 'They are the same width.', why: 'Close, but not the same: change ' + frT + ' to millimetres (× 25.4).', code: 'same' }],
              [t(N(q(sh.fr[0] / sh.fr[1])) + '\\times 25.4=' + N(rd(sh.v, 3))) + ' mm', 'The ' + (oldW ? 'old' : 'new') + ' pipe is wider.'], ['Change the inch width to millimetres (1 in = 25.4 mm).'], 'pipe wider'); } },
          { id: 'e6b', sub: 'b', level: 'EMG', outcome: 'M2', make: function (r, sh) { var d = Math.abs(q(sh.v) - sh.mm);
            return num('(b) By how many millimetres?', d, { dp: null, alts: [rd(d, 1)], after: 'mm', bad: [[Math.abs(sh.fr[0] / sh.fr[1] * 2.54 - sh.mm), 'u3len-cm-not-mm', 'Change to <b>millimetres</b>: 1 in = 25.4 mm.'], [Math.abs(sh.fr[0] / sh.fr[1] * 2.54 * 10 - sh.mm) === d ? NaN : Math.abs(sh.fr[0] / sh.fr[1] - sh.mm), 'u3l5-mm-diff', 'Change the inch width to millimetres before you subtract.']],
              sol: [t(N(q(sh.fr[0] / sh.fr[1])) + '\\times 25.4=' + N(q(sh.v))) + ' mm', t((sh.v > sh.mm ? N(q(sh.v)) + '-' + sh.mm : sh.mm + '-' + N(q(sh.v))) + '=' + N(d)) + ' mm'], hints: ['Change the old pipe to mm, then subtract.'], text: 'pipe difference' }); } }] },
      { num: '7', parts: [{ id: 'e7', level: 'EMG', outcome: 'M2', make: function (r) { var L = r.pick([30, 40, 44, 48, 50, 60]), Wd = r.pick([20, 24, 26, 28, 32]), a = q(L * 0.3048), b = q(Wd * 0.3048);
        return fields('A family builds a backyard skating rink that is ' + L + ' ft by ' + Wd + ' ft. Find the length and width in metres, to the nearest tenth.', [
          { label: 'Length:', name: 'Length', ans: a, dp: 1, exact: a, alts: [L / 3.28], after: 'm', bad: [[L * 30.48, 'u3len-cm-not-m', 'That’s in centimetres. Divide by 100.'], [L / 0.3048, 'u3len-wrong-way', 'A foot is shorter than a metre: multiply by 0.3048.'], [L * 3.28, 'u3len-wrong-way', 'A foot is shorter than a metre, so there are fewer metres: multiply by 0.3048.']] },
          { label: 'Width:', name: 'Width', ans: b, dp: 1, exact: b, alts: [Wd / 3.28], after: 'm', bad: [[Wd * 30.48, 'u3len-cm-not-m', 'That’s in centimetres. Divide by 100.'], [Wd / 0.3048, 'u3len-wrong-way', 'Multiply by 0.3048.'], [Wd * 3.28, 'u3len-wrong-way', 'Multiply by 0.3048.']] }],
          [t(L + '\\times 0.3048' + eqR(a, 1)) + ' m', t(Wd + '\\times 0.3048' + eqR(b, 1)) + ' m', 'The rink is about ' + Np(rd(a, 1)) + ' m by ' + Np(rd(b, 1)) + ' m.'], ['1 ft = 30.48 cm = 0.3048 m.'], 'rink'); } }] },
      { num: '8', stem: 'Round to the nearest whole number.', parts: [
        { id: 'e8a', sub: 'a', level: 'BEG', outcome: 'M2', make: function (r) { var w = r.pick([['Arizona', 75], ['Nevada', 70], ['Texas', 75], ['Wyoming', 65], ['Oregon', 60]]); return conv('(a) The speed limit on a highway in ' + w[0] + ' is ' + w[1] + ' mph. What is that in km/h?', w[1], 'mi>km', 0); } },
        { id: 'e8b', sub: 'b', level: 'BEG', outcome: 'M1', make: function (r) { var w = r.pick([['school zone in Lethbridge', 30], ['street in Airdrie', 40], ['road in Banff', 60], ['highway near Red Deer', 110], ['street in Cochrane', 50]]); return conv('(b) The limit on a ' + w[0] + ' is ' + w[1] + ' km/h. What is that in mph?', w[1], 'km>mi', 0); } }] },
      { num: '9', stem: function (sh) { return sh.who + ' drives a truck from Calgary to ' + sh.to + '. The first part, from Calgary to the border at Coutts, is about ' + sh.k + ' km. From the border to ' + sh.to + ' is about ' + sh.m + ' mi. His odometer shows km.'; },
        shared: function (r) { return find(function () { var w = r.pick([['Great Falls, Montana', 115, 125], ['Helena, Montana', 200, 215], ['Shelby, Montana', 30, 40], ['Missoula, Montana', 280, 295]]); return { who: r.pick(['Jamal', 'Malik', 'Ben', 'Eli', 'Theo']), to: w[0], k: r.int(282, 298), m: r.int(w[1], w[2]), odo: r.int(41000, 189000) }; }, function (s) { var v = s.m * 1.609; return Math.abs(v - Math.floor(v) - 0.5) > 0.06 && Math.round(v) + s.k === Math.round(v + s.k); }); },
        parts: [
          { id: 'e9a', sub: 'a', level: 'EMG', outcome: 'M3', make: function (r, sh) { var k2 = sh.m * 1.609, tot = sh.k + Math.round(k2);
            return num('(a) What is the total distance in kilometres, to the nearest kilometre?', tot, { dp: 0, exact: sh.k + k2, after: 'km', bad: [[sh.k + sh.m, 'u3l5-ft-m', 'You can’t add kilometres and miles. Change ' + sh.m + ' mi to km first (× 1.609).'], [sh.k + sh.m * 0.621, 'u3len-km-mi-fact', '0.621 changes km to miles. For miles to km, multiply by 1.609.'], [Math.round(k2), 'u3l5-one-sponsor', 'That’s only the part from the border. Add the ' + sh.k + ' km from Calgary.'], [(sh.k + sh.m * 1.609) * 0.621, 'u3len-km-mi-fact', 'The total should be in kilometres.']],
              sol: [t(sh.m + '\\times 1.609=' + N(q(k2)) + '\\approx ' + Math.round(k2)) + ' km', t(sh.k + '+' + Math.round(k2) + '=' + tot) + ' km'], hints: ['Change the miles to kilometres, then add.'], text: 'trip total' }); } },
          { id: 'e9b', sub: 'b', level: 'EMG', outcome: 'M3', make: function (r, sh) { var tot = sh.k + Math.round(sh.m * 1.609), v = sh.odo + tot;
            return num('(b) The odometer read ' + Np(sh.odo) + ' km in Calgary. What should it read in ' + sh.to.split(',')[0] + '?', v, { dp: 0, after: 'km', bad: [[sh.odo + sh.k + sh.m, 'u3l5-ft-m', 'Use the total distance in kilometres from (a).'], [sh.odo + sh.k, 'u3l5-one-sponsor', 'Add the whole trip (your answer to (a)), not just the first part.'], [sh.odo - tot, 'u3l5-sum', 'The odometer goes <b>up</b>: add the distance.']],
              sol: [t(N(sh.odo) + '+' + tot + '=' + N(v)) + ' km'], hints: ['Add the distance from (a) to the starting reading.'], text: 'odometer' }); } }] },
      { num: '10', stem: function (sh) { return 'LED strip lights come in a ' + Np(sh.ft) + ' ft roll for ' + Mp(sh.P1) + ' or a ' + sh.m + ' m roll for ' + Mp(sh.P2) + '.'; },
        shared: function (r) { return find(function () { var w = r.pick([[16.4, 5], [32.8, 10], [9.8, 3], [16.4, 10], [32.8, 5]]), P1 = r.pick([9.99, 12.99, 14.99, 19.99, 24.99]), P2 = r.pick([12.49, 15.49, 17.99, 22.99, 29.99, 34.99]); var m1 = q(w[0] * 0.3048); return { ft: w[0], m: w[1], P1: P1, P2: P2, m1: m1, u1: P1 / m1, u2: P2 / w[1] }; }, function (s) { return Math.abs(s.u1 - s.u2) >= 0.08 && Math.abs(s.u1 - s.u2) / Math.min(s.u1, s.u2) <= 0.35 && near(rd(s.u1, 2), rd(s.P1 / (s.ft / 3.28), 2)) && Math.abs(s.u1 * 100 % 1 - 0.5) > 0.03 && Math.abs(s.u2 * 100 % 1 - 0.5) > 0.03; }); },
        parts: [
          { id: 'e10a', sub: 'a', level: 'PRG', outcome: 'M3', make: function (r, sh) {
            return fields('(a) Find the price per metre of each roll, to the cent.', [
              { label: Np(sh.ft) + ' ft roll:', name: Np(sh.ft) + ' ft roll', ans: sh.u1, money: true, exact: sh.u1, after: '/m', bad: [[sh.P1 / sh.ft, 'u3l5-no-ft', 'That’s the price per <b>foot</b>. Change ' + Np(sh.ft) + ' ft to metres first (× 0.3048).'], [sh.P1 * sh.m1, 'u3len-wrong-way', 'Price per metre = price ÷ metres.']] },
              { label: sh.m + ' m roll:', name: sh.m + ' m roll', ans: sh.u2, money: true, exact: sh.u2, after: '/m', bad: [[sh.m / sh.P2, 'u3len-wrong-way', 'Divide the <b>price</b> by the metres.']] }],
              [Np(sh.ft) + ' ft: ' + t(N(sh.ft) + '\\times 0.3048=' + N(sh.m1)) + ' m; ' + t(M(sh.P1) + '\\div ' + N(sh.m1) + '\\approx ' + M(sh.u1)) + ' per m', sh.m + ' m: ' + t(M(sh.P2) + '\\div ' + sh.m + '\\approx ' + M(sh.u2)) + ' per m'], ['Change the feet to metres (1 ft = 0.3048 m).', 'Price per metre = price ÷ metres.'], 'LED per m'); } },
          { id: 'e10b', sub: 'b', level: 'EMG', outcome: 'M3', make: function (r, sh) { var a = rd(sh.u1, 2) < rd(sh.u2, 2);
            return mc(r, '(b) Which is the better buy?', [{ html: '<b>The ' + Np(sh.ft) + ' ft roll</b>: its price per metre is lower.', right: a, why: 'Compare the prices per metre: ' + Mp(sh.u1) + ' and ' + Mp(sh.u2) + '.', code: 'pick-ft' }, { html: '<b>The ' + sh.m + ' m roll</b>: its price per metre is lower.', right: !a, why: 'Compare the prices per metre: ' + Mp(sh.u1) + ' and ' + Mp(sh.u2) + '.', code: 'pick-m' }, { html: '<b>The ' + (sh.P1 < sh.P2 ? Np(sh.ft) + ' ft' : sh.m + ' m') + ' roll</b>: its shelf price is lower.', why: 'The rolls are different lengths, so compare the price for the same length (one metre).', code: 'shelf' }],
              [Np(sh.ft) + ' ft roll: ' + Mp(sh.u1) + ' per m; ' + sh.m + ' m roll: ' + Mp(sh.u2) + ' per m', 'The ' + (a ? Np(sh.ft) + ' ft' : sh.m + ' m') + ' roll is the better buy.'], ['The lower price per metre is the better buy.'], 'LED better'); } }] },
      { num: '11', parts: [{ id: 'e11', level: 'BEG', outcome: 'M2', make: function (r) { var k = r.pick(['mi', 'yd', 'ft']);
        if (k === 'mi') return mc(r, 'One mile is about', [{ html: '1609 m', right: true }, { html: '1.609 m', why: '1 mi ≈ 1.609 <b>km</b>. Change km to m: × 1000.', code: 'u3l5-cm-m' }, { html: '621 m', why: '0.621 is the number of miles in a kilometre. 1 mi ≈ 1.609 km = 1609 m.', code: 'u3len-km-mi-fact' }, { html: '5280 m', why: '5280 is the number of <b>feet</b> in a mile.', code: 'u3l5-ft-m' }], ['1 mi ≈ 1.609 km = ' + t('1.609\\times 1000=1609') + ' m'], ['1 mi ≈ 1.609 km.'], 'one mile');
        if (k === 'yd') return mc(r, 'One yard is about', [{ html: '91.44 cm', right: true }, { html: '0.9144 cm', why: '1 yd = 0.9144 <b>m</b>. Change m to cm: × 100.', code: 'u3l5-cm-m' }, { html: '36 cm', why: '36 is the number of <b>inches</b> in a yard.', code: 'u3l5-ft-m' }, { html: '109.4 cm', why: 'A yard is a bit <b>less</b> than a metre (100 cm).', code: 'u3len-wrong-way' }], ['1 yd = 0.9144 m = ' + t('0.9144\\times 100=91.44') + ' cm'], ['1 yd = 0.9144 m.'], 'one yard');
        return mc(r, 'One foot is about', [{ html: '30.48 cm', right: true }, { html: '0.3048 cm', why: '1 ft = 0.3048 <b>m</b> = 30.48 cm.', code: 'u3l5-cm-m' }, { html: '12 cm', why: '12 is the number of <b>inches</b> in a foot.', code: 'u3l5-ft-m' }, { html: '3.28 cm', why: '3.28 is the number of feet in a metre.', code: 'u3len-wrong-way' }], ['1 ft = 12 in = ' + t('12\\times 2.54=30.48') + ' cm'], ['1 ft = 12 in, and 1 in = 2.54 cm.'], 'one foot'); } }] },
      { num: '12', parts: [{ id: 'e12', level: 'EMG', outcome: 'M2', make: function (r) { var w = r.pick([[48, 'A roll of ribbon'], [36, 'A roll of ribbon'], [60, 'A piece of rope'], [72, 'A garden hose'], [54, 'A strip of trim'], [42, 'A length of chain']]), v = w[0] * 2.54;
        return num(w[1] + ' is ' + w[0] + ' in long. Its length in centimetres, to the nearest centimetre, is ____ cm.', v, { dp: 0, exact: v, after: 'cm', nr: true, bad: convBad(w[0], 'in>cm'), sol: [t(w[0] + '\\times 2.54' + eqR(v, 0)) + ' cm'], hints: ['1 in = 2.54 cm.'], text: 'NR ribbon' }); } }] },
      { num: '13', section: 'C. Stretch', parts: [{ id: 'e13', level: 'MAS', outcome: 'M3', make: function (r) { var d = r.pick([100, 200, 400]), tt = d === 100 ? pickR(r, 11.2, 13.8, 0.1) : d === 200 ? pickR(r, 23.5, 28.5, 0.1) : pickR(r, 52, 64, 0.5), yd = q(d * 0.9144), v = yd * tt / d;
        return num('A sprinter runs ' + d + ' m in ' + N(tt, 1) + ' s. At the same speed, how long would she take to run ' + d + ' yd, to the nearest hundredth of a second?', v, { dp: 2, exact: v, after: 's', bad: [[tt * d / yd, 'u3len-wrong-way', d + ' yd is <b>shorter</b> than ' + d + ' m, so it takes <b>less</b> time.'], [tt, 'u3l5-same-num', d + ' yd is shorter than ' + d + ' m: change it to metres (× 0.9144) and use a proportion.'], [tt * 0.9144 * 0.9144, 'u3len-yd-fact', 'Multiply by 0.9144 only once.']],
          sol: [t(d + '\\text{ yd}=' + d + '\\times 0.9144=' + N(yd) + '\\text{ m}'), t('\\dfrac{' + N(tt, 1) + '\\text{ s}}{' + d + '\\text{ m}}=\\dfrac{x}{' + N(yd) + '\\text{ m}}'), t('x=' + N(yd) + '\\times ' + N(tt, 1) + '\\div ' + d + eqR(v, 2)) + ' s'], hints: ['Change the yards to metres.', 'Set up a proportion: time ÷ distance is the same for both.'], text: 'sprinter' }); } }] },
      { num: '14', stem: function (sh) { return 'A metric cabinet has an inside width of ' + sh.cm + ' cm. ' + sh.who + ' will cut a shelf to fit, using an inch tape.'; },
        shared: function (r) { var pool = []; for (var c = 40; c <= 95; c++) { var z = sixteenths(c), x16 = (z.inch - Math.floor(z.inch)) * 16, fr = x16 - Math.floor(x16); if (fr > 0.55 && fr < 0.95 && z.s >= 2 && z.s <= 15 && c !== 45) pool.push(c); } var cm = r.pick(pool), z = sixteenths(cm); return { cm: cm, z: z, who: r.pick(['Liam', 'Kai', 'Malik', 'Ben', 'Nico']), safe: R(z.w * 16 + z.s - 1, 16), up: z.T }; },
        parts: [
          { id: 'e14ai', sub: 'a i', level: 'EMG', outcome: 'M1', make: function (r, sh) { var v = sh.cm / 2.54; return num('(a) Change ' + sh.cm + ' cm to inches, to three decimal places.', v, { dp: 3, exact: v, after: 'in', bad: [[sh.cm * 2.54, 'u3len-wrong-way', 'Centimetres → inches: <b>divide</b> by 2.54.'], [sh.cm / 25.4, 'u3len-mm-fact', 'The width is in centimetres, so divide by 2.54.']], sol: [t(sh.cm + '\\div 2.54=' + N(rd(v, 5)) + '\\ldots\\approx ' + N(rd(v, 3), 3)) + ' in'], hints: ['Divide by 2.54.'], text: 'cabinet decimal in' }); } },
          { id: 'e14aii', sub: 'a ii', level: 'PRG', outcome: 'M1', make: function (r, sh) { return sixPart('(a) Now give it to the nearest ' + t('\\tfrac{1}{16}') + ' in.', sh.cm, { text: 'cabinet sixteenths' }); } },
          { id: 'e14bi', sub: 'b i', level: 'PRG', outcome: 'M2', make: function (r, sh) { var dec = sh.up[0] / sh.up[1], v = dec * 2.54;
            return num('(b) Convert your answer to (a), ' + t(mT(sh.up) + uT('in')) + ', back to centimetres, to the nearest hundredth.', v, { dp: 2, exact: v, after: 'cm', bad: [[dec / 2.54, 'u3len-wrong-way', 'Inches → centimetres: <b>multiply</b> by 2.54.'], [sh.z.inch * 2.54, 'u3l5-unrounded', 'Convert the rounded length, ' + t(mT(sh.up)) + ' in, not the exact one.']], sol: [t(mT(sh.up) + '=' + N(q(dec))) + ' in', t(N(q(dec)) + '\\times 2.54' + eqR(v, 2)) + ' cm'], hints: ['Change the fraction to a decimal, then multiply by 2.54.'], text: 'cabinet back to cm' }); } },
          { id: 'e14bii', sub: 'b ii', level: 'PRG', outcome: 'M3', make: function (r, sh) { var upCm = sh.up[0] / sh.up[1] * 2.54, sfCm = sh.safe[0] / sh.safe[1] * 2.54;
            return mc(r, '(b) Why would ' + t(mT(sh.safe) + uT('in')) + ' be a safer length to cut?', [
              { html: t(mT(sh.up)) + ' in is ' + Np(rd(upCm, 2)) + ' cm, a little <b>more</b> than ' + sh.cm + ' cm, so that shelf would not fit. ' + t(mT(sh.safe)) + ' in is ' + Np(rd(sfCm, 2)) + ' cm, just under ' + sh.cm + ' cm, so it fits.', right: true },
              { html: t(mT(sh.safe)) + ' in is easier to find on a tape measure.', why: 'Both marks are on the tape. Think about whether each shelf would fit inside ' + sh.cm + ' cm.', code: 'easier' },
              { html: t(mT(sh.up)) + ' in would be too short, so the shelf would wobble.', why: 'Check (b): ' + t(mT(sh.up)) + ' in is ' + Np(rd(upCm, 2)) + ' cm, which is <b>more</b> than ' + sh.cm + ' cm.', code: 'short' },
              { html: 'It isn’t safer: the nearest ' + t('\\tfrac{1}{16}') + ' in is always the best length to cut.', why: 'Rounding to the nearest 1/16 in rounded <b>up</b> here, so that shelf would be a little too wide.', code: 'nearest' }],
              [t(mT(sh.up)) + ' in = ' + Np(rd(upCm, 2)) + ' cm: more than ' + sh.cm + ' cm, so the shelf would not fit.', t(mT(sh.safe) + '=' + N(q(sh.safe[0] / sh.safe[1]))) + ' in = ' + Np(rd(sfCm, 2)) + ' cm: just under ' + sh.cm + ' cm, so it fits.'], ['Would each shelf be wider or narrower than the cabinet?'], 'safer length'); } }] },
      { num: '15', stem: function (sh) { return sh.who + ' runs at a pace of ' + N(sh.p) + ' minutes per kilometre.'; },
        shared: function (r) { return find(function () { var p = pickR(r, 4.5, 7.5, 0.5), f = r.pick([7, 8, 9, 10, 11, 12]); return { who: r.pick(['Zoe', 'Hana', 'Maya', 'Aisha', 'Sofia']), p: p, f: f, v: p * 1.609 }; }, function (s) { return Math.abs(s.v - s.f) >= 0.2 && Math.abs(s.v - s.f) <= 1.5 && Math.abs(s.v * 10 % 1 - 0.5) > 0.05; }); },
        parts: [
          { id: 'e15a', sub: 'a', level: 'MAS', outcome: 'M3', make: function (r, sh) { return num('(a) What is her pace in minutes per mile, to the nearest tenth?', sh.v, { dp: 1, exact: sh.v, after: 'min/mi', bad: [[sh.p / 1.609, 'u3len-wrong-way', 'A mile is <b>longer</b> than a kilometre, so it takes <b>more</b> minutes: multiply by 1.609.'], [sh.p * 0.621, 'u3len-km-mi-fact', 'One mile ≈ 1.609 km, so one mile takes 1.609 times as long: × 1.609.']], sol: ['1 mi ≈ 1.609 km, so one mile takes ' + t('1.609\\times ' + N(sh.p) + eqR(sh.v, 1)) + ' min'], hints: ['How many kilometres are in a mile? Each kilometre takes ' + N(sh.p) + ' minutes.'], text: 'pace per mile' }); } },
          { id: 'e15b', sub: 'b', level: 'EMG', outcome: 'M3', make: function (r, sh) { var fast = sh.v < sh.f, v = rd(sh.v, 1), who = sh.who;
            return mc(r, '(b) Is she faster or slower than a friend who runs a ' + sh.f + '-minute mile?', [{ html: '<b>Faster</b>: she takes less time per mile (' + v + ' min vs ' + sh.f + ' min).', right: fast, why: 'Less time for the same distance is faster. Compare ' + v + ' min and ' + sh.f + ' min.', code: 'said-faster' }, { html: '<b>Slower</b>: she takes more time per mile (' + v + ' min vs ' + sh.f + ' min).', right: !fast, why: 'Compare ' + v + ' min and ' + sh.f + ' min per mile.', code: 'said-slower' }, { html: '<b>' + (sh.p < sh.f ? 'Faster' : 'Slower') + '</b>: ' + N(sh.p) + ' is ' + (sh.p < sh.f ? 'less' : 'more') + ' than ' + sh.f + '.', right: false, why: N(sh.p) + ' min is per <b>kilometre</b>. Compare the time per mile from (a).', code: 'u3l5-ft-m' }],
              [who + ': about ' + v + ' min per mile; friend: ' + sh.f + ' min per mile.', 'Less time per mile is faster, so ' + who + ' is ' + (fast ? 'faster' : 'slower') + '.'], ['Less time for the same distance means faster.'], 'faster slower'); } }] }
    ]
  });
})(window);
