/* Math 10-3 · Unit 3 · Lesson 3 — The Imperial System and Reading a Tape Measure (M2; reading a ruler or tape: M3)
 * Assignment 3 (u3_l03.tex, Questions 1–19) and the Lesson 3 Extra Practice (u3_ep03.tex, A 1–5, B 6–12, C 13–15).
 * Every part is a generator: the same kind of length as the booklet item (an arrow on an odd sixteenth, an object that
 * does not start at 0, a reading just past a foot tag, a set of sockets in sixteenths, a "bigger numbers" trap…) with new
 * numbers around the booklet's (the lesson's worked-example readings are left out). Calculator allowed.
 * Rulers and tape measures are drawn here (SVG): sixteenth lines hang from the top edge with the booklet's line lengths,
 * a tape is yellow with red numbers every 16 in and a black foot tag (1F, 2F…) after every 12 in.
 * Answers: lengths in inches are mixed numbers typed with the fraction keypad ("2 3/8", "2\frac{3}{8}", a trailing "in"
 * or ″ is ignored). An unsimplified fraction (2 6/16), an improper fraction (19/8) or the right value as a decimal
 * (2.375) gets a nudge that uses no try. Feet-and-inches answers are two boxes (ft, in); the right length with 12 in or
 * more, decimal feet in the feet box, or the whole length in the inches box gets a nudge. Recognised wrong readings each
 * get a hint: counting the lines as eighths, the next whole inch instead of the last one passed, counting back from the
 * next inch, one line off, a decimal read as tenths, reading an object that starts at 1 in from 0, the next foot tag,
 * 10 in to a foot ("41" read as 4 ft 1 in), the nearest eighth given as a sixteenth, the farther line.
 * Conversions: fill-in-the-blank facts → labelled boxes; "which is longer" → choose one; "write in symbols / words" and
 * "circle the most reasonable length" → multiple choice; the best-unit table → a table of choices; "draw an arrow at each
 * length" → a ruler with seven lettered arrows (five right ones, two at the eighths/sixteenths mix-up) and a table to
 * match each length to its arrow; the nearest-1/16 / nearest-1/8 table and the tape table → labelled boxes; "put in
 * order" → the ordering input; "what did he do wrong / explain / give two places" → multiple choice of reasons.
 *
 * Shared kit for later Unit 3 lessons: HW.u3tape — sixteenths of an inch (s = 16 × inches, a whole number) with TeX
 * (inT, ftinT), a mixed-number reader (readMix), the inches checker and part (inChk, inPart), the feet-and-inches
 * two-box checker and part (ftinChk, ftinPart), grouped boxes (multi), the ruler / tape drawing (ruler), the
 * typical-misreading list (rulerBad), and number/money checkers with rounding nudges (num, fld). Keypad: 'u3mixed'.
 * Levels: LIM BEG EMG PRG ADV MAS. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;

  /* ================= keypad: digits, fraction, mixed number ================= */
  var W = HW.widgets;
  if (W && W.KEYSETS && !W.KEYSETS.u3mixed) {
    var dk = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
    W.KEYSETS.u3mixed = [[dk(7), dk(8), dk(9), { label: '<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#@}{#?}', plain: '/', title: 'Fraction: type the top number first' }, { label: '⌫', fn: 'del', title: 'Delete' }],
      [dk(4), dk(5), dk(6), { label: 'n<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#?}{#?}', plain: ' ', title: 'Mixed number: type the whole number first' }, { label: 'clear', fn: 'clear' }],
      [dk(1), dk(2), dk(3), { label: '◀', fn: 'left', title: 'Move left' }, { label: '▶', fn: 'right', title: 'Move right (to the next box)' }], [dk(0), { label: '.', tex: '.', plain: '.' }, { label: 'Check ↵', fn: 'enter', wide: true }]];
    W.KEYHELP = W.KEYHELP || {};
    W.KEYHELP.u3mixed = ['Mixed number: type the whole inches, press <b>n<sup>a</sup>⁄<sub>b</sub></b>, then the top and bottom of the fraction. A fraction alone: type the top, press <b><sup>a</sup>⁄<sub>b</sub></b>, then the bottom. Press <b>▶</b> to move on.',
      'Type a mixed number as <code>2 3/8</code> (a space between the whole number and the fraction) and a fraction as <code>3/8</code>.'];
  }

  /* ================= HW.u3tape ================= */
  var T3 = HW.u3tape = HW.u3tape || {};
  var PH = 'e.g. 2 3/8';
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var x = a % b; a = b; b = x; } return a; }
  function q(x) { return Math.round(x * 1e9) / 1e9; }
  function rd(x, dp) { return K.roundTo(x, dp); }
  function trunc(x, dp) { var f = Math.pow(10, dp); return Math.trunc(x * f + (x >= 0 ? 1e-9 : -1e-9)) / f; }
  function same(a, b) { return Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(b)); }
  function nS(x, dp) { x = q(x); return dp != null ? x.toFixed(dp) : String(x); }
  function N(x, dp) { var s = nS(x, dp); return Math.abs(x) >= 10000 ? HW.fmt(s) : s; }
  function Np(x, dp) { var s = nS(x, dp); return (Math.abs(x) >= 10000 ? HW.fmt(s, true) : s).replace(/^-/, '−'); }
  function decs(x) { var s = nS(x); return (s.split('.')[1] || '').length; }
  function D(x) { return '\\$' + rd(x, 2).toFixed(2); }
  function Dp(x) { return '$' + rd(x, 2).toFixed(2); }
  function find(gen, test, fb) { for (var i = 0; i < 600; i++) { var v = gen(); if (v && test(v)) return v; } return fb; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function br(a) { return a.filter(Boolean).join('<br>'); }
  var TD = 'border:1px solid #c9b79c;padding:3px 10px;text-align:center';
  function table(head, rows) {
    return '<table style="border-collapse:collapse;margin:4px 0">' + (head ? '<tr>' + head.map(function (h) { return '<th style="' + TD + '">' + h + '</th>'; }).join('') + '</tr>' : '') +
      rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td style="' + TD + '">' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>';
  }
  function kc(s) { return '<span style="display:inline-block;min-width:1.5em;text-align:center;padding:0 5px;margin:0 2px;border:1px solid #6b7686;border-bottom-width:3px;border-radius:5px;background:#f4f6f9;color:#1d2633;font-weight:700;font-size:.9em;line-height:1.45;white-space:nowrap">' + s + '</span>'; }
  var NAMES = ['Amara', 'Kai', 'Malik', 'Noor', 'Priya', 'Mateo', 'Kayla', 'Liam', 'Hana', 'Devon', 'Theo', 'Aisha', 'Sofia', 'Omar', 'Tyler', 'Jaya', 'Wes', 'Leah', 'Arjun', 'Brooke', 'Cody', 'Elena', 'Faisal', 'Gwen'];

  /* ---- numbers (the same checkers as Unit 4's kit, with u3t- codes) ---- */
  function readNum(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\\$/g, '$').replace(/\\(?:text|mathrm)\{([^}]*)\}/g, '$1').replace(/\\[,;:! ]|~/g, ' ').replace(/[−–]/g, '-').replace(/\s+/g, ' ').trim();
    s = s.replace(/^\$\s*/, '').replace(/\s*\$$/, '').trim();
    if (!s) return { code: 'empty' };
    var unit = null, m = /^(-?[\d.,\s]*\d\.?)\s*([a-zA-Z%°'"′″\/¢][\s\S]*)$/.exec(s);
    if (m) { unit = m[2]; s = m[1].trim(); }
    if (/^-?\d+,\d{1,2}$/.test(s)) return { code: 'comma' };
    var p = HW.parse.number(s); if (!p.ok) return { code: 'notnumber' };
    return { v: p.value, dec: (s.replace(/[,\s]/g, '').split('.')[1] || '').length, unit: unit, len: s.replace(/[,\s-]/g, '').length };
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
    if (a.code === 'comma') return form('u3t-comma', 'Use a decimal <b>point</b>, not a comma (for example 12.5).');
    return form('notnumber', 'Type a single number (the unit is already written beside the box).');
  }
  function badHit(bad, v, dec) {
    for (var i = 0; bad && i < bad.length; i++) { var b = bad[i]; if (near(v, b[0], dec)) return b[3] === 'form' ? form(b[1], b[2]) : wrong(b[1], b[2]); }
    return null;
  }
  function placeOf(o) { return o.money ? 'cent' : o.dp === 0 ? 'whole number' : o.dp === 1 ? 'tenth' : o.dp === 2 ? 'hundredth' : 'thousandth'; }
  function numChk(ans, o) {
    o = o || {};
    var dp = o.money ? 2 : o.dp, exact = o.exact != null ? o.exact : ans, place = placeOf(o);
    return function (resp) {
      var a = readNum(resp); if (a.code) return slip(a);
      var v = a.v, h;
      if (o.nr && a.len > 4) return dp != null && same(rd(v, dp), ans) ? form('round', 'Right — now round to the nearest ' + place + '.') : form('nr-long', 'Numerical response answers fit in 4 boxes (digits and a decimal point only).');
      if (same(v, ans)) return ok();
      for (var i = 0; o.alt && i < o.alt.length; i++) if (same(v, o.alt[i])) return ok();
      if (dp != null && a.dec > dp && same(rd(v, dp), ans)) return form('round', 'Right — now round to the nearest ' + place + '.');
      if (dp != null && a.dec < dp && !same(rd(ans, a.dec), ans) && Math.abs(v - ans) < Math.pow(10, -a.dec) - 1e-9) return form('places', o.money ? 'Give the amount to the cent (two decimal places), like $12.50.' : 'Round to the nearest ' + place + '.');
      if ((h = badHit(o.bad, v, a.dec))) return h;
      if (dp != null && !same(exact, ans) && a.dec <= dp && Math.abs(Math.abs(v - ans) - Math.pow(10, -dp)) < 1e-9 && same(v, trunc(exact, dp)))
        return wrong('u3t-round-dir', 'Check your rounding: look at the digit after the ' + place + (o.money ? 's (the third decimal place)' : 's') + '. 5 or more rounds up; 4 or less rounds down.');
      return wrong('value', o.miss || null);
    };
  }
  function cleanBad(bad, ans, dp, alt) {
    var seen = [];
    return (bad || []).filter(function (b) {
      if (!b || !isFinite(b[0]) || same(b[0], ans) || (dp != null && same(rd(b[0], dp), ans)) || (alt || []).some(function (x) { return same(x, b[0]); })) return false;
      if (seen.some(function (x) { return same(x, b[0]); })) return false; seen.push(b[0]); return true;
    });
  }
  function keyOf(ans, o) { o = o || {}; return o.money ? rd(ans, 2).toFixed(2) : o.dp != null && decs(ans) > o.dp ? rd(ans, o.dp).toFixed(o.dp) : nS(ans); }
  function prep(v, o) {
    o = o || {}; var dp = o.money ? 2 : o.dp, ans = dp != null ? rd(v, dp) : q(v);
    var bad = cleanBad(o.bad, ans, dp, o.alt);
    return { ans: ans, bad: bad, check: numChk(ans, { money: o.money, dp: o.dp, exact: v, bad: bad, alt: o.alt, nr: o.nr, miss: o.miss }), key: o.key || keyOf(ans, o) };
  }
  /* a number part. o: money, dp, bad [[value, code, hint, 'form'?]], alt, before, after, ans (TeX), sol, hints, text, nr */
  function num(prompt, v, o) {
    o = o || {}; var c = prep(v, o);
    var p = { prompt: prompt, input: { type: 'number', before: o.nr ? undefined : o.money ? '$' : o.before, after: o.nr ? undefined : o.after, nr: !!o.nr },
      check: c.check, key: c.key, answer: t(o.ans || ((o.money ? '\\$' : '') + N(Number(c.key), o.money ? 2 : decs(Number(c.key)) > 0 ? decs(Number(c.key)) : null) + (o.after ? '\\text{ ' + o.after + '}' : ''))),
      solution: o.sol, hints: o.hints || [], text: o.text };
    p.bad = c.bad.filter(function (b) { return b[3] !== 'form'; }).map(function (b) { return nS(b[0]); });
    p.good = o.money ? ['$' + c.key] : [];
    return p;
  }
  /* several number boxes. rows: [{label, name, v, o: {dp, money, bad, alt}, after}] */
  function fld(prompt, rows, sol, hints, text, o) {
    o = o || {};
    var swap = o.swap != null ? o.swap : rows.length === 2;
    var preps = rows.map(function (rw, i) {
      var ro = Object.assign({}, rw.o || {}), others = [];
      if (swap) rows.forEach(function (x, j) { if (j !== i) others.push([x.v, 'u3t-other-box', 'That’s the answer for the other box (' + (x.name || x.label) + '). Check which box is which.']); });
      ro.bad = (ro.bad || []).concat(others);
      return prep(rw.v, ro);
    });
    var keysA = preps.map(function (c) { return c.key; });
    var ansH = o.answer || rows.map(function (rw, i) { return rw.label + ' ' + ((rw.o || {}).money ? '$' : '') + Np(Number(keysA[i])) + (rw.after ? ' ' + rw.after : ''); }).join(' &nbsp; ');
    var p = P.fields(prompt, rows.map(function (rw) { return { label: rw.label, before: (rw.o || {}).money ? '$' : undefined, after: rw.after, name: rw.name || rw.label.replace(/:$/, '') }; }),
      preps.map(function (c) { return c.check; }), keysA, ansH, sol, hints, text);
    if (rows.length === 2 && !same(preps[0].ans, preps[1].ans)) p.bad = [[keysA[1], keysA[0]]];
    return p;
  }

  /* ---- sixteenths of an inch: s = 16 × (length in inches), a whole number ---- */
  function mix(s) { var w = Math.floor(s / 16 + 1e-9), r = s - 16 * w, g = gcd(r, 16) || 16; return { w: w, n: r / g, d: 16 / g, r: r }; }
  function frT(n, d) { return '\\frac{' + n + '}{' + d + '}'; }
  function inT(s) { var m = mix(s); if (!m.n) return String(m.w); return (m.w ? m.w : '') + frT(m.n, m.d); }       // 2\frac{3}{8}
  function inU(s) { return inT(s) + '\\text{ in}'; }
  function inPl(s) { var m = mix(s); if (!m.n) return String(m.w); return (m.w ? m.w + ' ' : '') + m.n + '/' + m.d; }   // "2 3/8"
  function ftin(s) { var f = Math.floor(s / 192 + 1e-9); return [f, s - 192 * f]; }
  function ftinT(s) { var a = ftin(s); return a[0] + "'\\," + (a[1] > 0 && a[1] < 16 ? '0' : '') + inT(a[1]) + "''"; }                                   // 2'\,1\frac{5}{8}''
  function frac16(k) { var g = gcd(k, 16) || 16; return [k / g, 16 / g]; }

  /* a typed length in inches: "2 3/8", "2\frac{3}{8}", "2\frac38", "19/8", "2.375", "2" (a trailing in, ″ or '' is ignored) */
  function readMix(resp) {
    var s = String(resp == null ? '' : resp);
    s = s.replace(/\\(?:text|mathrm)\{([^{}]*)\}/g, '$1').replace(/\\[dt]frac/g, '\\frac').replace(/\\left|\\right/g, '').replace(/\\[,;:! ]|~/g, ' ').replace(/\\prime/g, "'").replace(/[″”]/g, '"').replace(/[−–]/g, '-').replace(/\s+/g, ' ').trim();
    s = s.replace(/\s*(?:''|"|\^\{?''\}?|\^\{?\\?prime\\?prime\}?|in\.?|inch(?:es)?)\s*$/i, '').trim();
    if (!s) return { res: form('empty', 'Type your answer first.') };
    if (/^\d+,\d+$/.test(s)) return { res: form('u3t-comma', 'Use a decimal point, or better, a fraction of an inch (like 2 3/8).') };
    var F = '(?:\\{\\s*(\\d+)\\s*\\}|(\\d))', m;
    if ((m = new RegExp('^(\\d+)\\s*\\\\frac\\s*' + F + '\\s*' + F + '$').exec(s))) return mk(+m[1], +(m[2] || m[3]), +(m[4] || m[5]), 'mixed');
    if ((m = new RegExp('^\\\\frac\\s*' + F + '\\s*' + F + '$').exec(s))) return mk(0, +(m[1] || m[2]), +(m[3] || m[4]), 'frac');
    if ((m = /^(\d+)\s*[ -]\s*(\d+)\s*\/\s*(\d+)$/.exec(s))) return mk(+m[1], +m[2], +m[3], 'mixed');
    if ((m = /^(\d+)\s*\/\s*(\d+)$/.exec(s))) return mk(0, +m[1], +m[2], 'frac');
    if ((m = /^(\d+)$/.exec(s))) return { v: +m[1], kind: 'int', w: +m[1], n: 0, d: 1, raw: s };
    if ((m = /^(\d*)\.(\d+)$/.exec(s))) return { v: Number((m[1] || '0') + '.' + m[2]), kind: 'dec', w: +(m[1] || 0), digits: m[2], raw: s };
    if (/^-/.test(s)) return { res: form('u3t-neg', 'A length can’t be negative. Check your subtraction.') };
    return { res: form('notnumber', 'Type a length like <code>2 3/8</code>: the whole inches, then the fraction.') };
    function mk(w, n, d, kind) { if (!d) return { res: form('notnumber', 'The bottom of a fraction can’t be 0.') }; return { v: w + n / d, kind: kind, w: w, n: n, d: d, raw: s }; }
  }
  function lowNudge(a) {
    if (a.kind === 'mixed' && a.n >= a.d) return form('u3t-mixed-improper', 'In a mixed number the fraction part must be less than 1 — take another whole inch out of it.');
    if ((a.kind === 'mixed' || a.kind === 'frac') && a.n && gcd(a.n, a.d) > 1) return form('u3t-lowest', 'Right length — now write the fraction in simplest form: divide the top and bottom of ' + t(frT(a.n, a.d)) + ' by ' + t(gcd(a.n, a.d)) + '.');
    return null;
  }
  /* inches checker. S = target in sixteenths. o: bad [[s16, code, hint, 'form'?]], improperOk, decOk, miss, tenths (k: the
     number of sixteenths read, for the "decimal read as tenths" hint) */
  function inChk(S, o) {
    o = o || {}; var T = S / 16, m0 = mix(S);
    return function (resp) {
      var a = readMix(resp); if (a.res) return a.res;
      var v = a.v, i;
      if (Math.abs(v - T) < 1e-9) {
        if (a.kind === 'dec') return Number.isInteger(T) || o.decOk ? ok() : form('u3t-decimal', 'Right value — now write it with a fraction of an inch, the way a ruler reads (for example 5 1/4, not 5.25).');
        var h = lowNudge(a); if (h) return h;
        if (a.kind === 'frac' && a.n > a.d && !o.improperOk) return form('u3t-want-mixed', 'Right value — now write it as a <b>mixed number</b>: whole inches and a fraction less than 1.');
        return ok();
      }
      for (i = 0; o.bad && i < o.bad.length; i++) if (Math.abs(v * 16 - o.bad[i][0]) < 1e-6) return o.bad[i][3] === 'form' ? form(o.bad[i][1], o.bad[i][2]) : wrong(o.bad[i][1], o.bad[i][2]);
      if (a.kind === 'dec' && o.tenths && a.w === m0.w && a.digits === String(m0.r)) return wrong('u3t-tenths', 'An inch on this ruler is split into <b>sixteenths</b>, not tenths. Write the fraction: the number of small spaces over 16, then simplify.');
      if (a.kind === 'dec' && Math.abs(v - T) < 0.01) return form('u3t-dec-close', 'That decimal is close, but give the exact length with a fraction of an inch.');
      if (a.kind === 'mixed' && a.n >= a.d) return form('u3t-mixed-improper', 'In a mixed number the fraction part must be less than 1.');
      return wrong('value', o.miss || null);
    };
  }
  function badTex(list) { return (list || []).filter(function (b) { return b[3] !== 'form' && b[0] >= 0 && Number.isInteger(b[0]); }).map(function (b) { return inT(b[0]); }); }
  function cleanS(bad, S) { var seen = [S]; return (bad || []).filter(function (b) { if (!b || !isFinite(b[0]) || b[0] < 0 || seen.indexOf(b[0]) >= 0) return false; seen.push(b[0]); return true; }); }
  /* an inches part. o: bad, before, after (default 'in'), sol, hints, text, improperOk, tenths, miss */
  function inPart(prompt, S, o) {
    o = o || {}; var bad = cleanS(o.bad, S);
    var p = { prompt: prompt, input: { type: 'math', keys: 'u3mixed', placeholder: PH, before: o.before, after: o.after === undefined ? 'in' : o.after },
      check: inChk(S, { bad: bad, improperOk: o.improperOk, tenths: o.tenths, miss: o.miss }), key: inT(S), answer: t(o.after === '' ? inT(S) : inU(S)), solution: o.sol, hints: o.hints || [], text: o.text };
    p.bad = badTex(bad); p.good = [inPl(S)].concat(S % 16 === 0 ? [] : [inT(S) + '\\text{ in}']);
    return p;
  }
  /* feet and inches: resp [feet, inches]. S in sixteenths. o: bad [[s16, code, hint]], round (to the nearest inch), miss */
  function ftinChk(S, o) {
    o = o || {}; var T = S / 16;
    return function (resp) {
      resp = resp || [];
      var fs = String(resp[0] == null ? '' : resp[0]).replace(/'|′|\\prime|ft\.?|feet|foot/g, '').trim(), is = String(resp[1] == null ? '' : resp[1]).trim();
      if (!fs && !is) return form('empty', 'Type the feet and the inches.');
      var fa = fs ? readMix(fs) : { v: 0, kind: 'int' }, ia = is ? readMix(is) : { v: 0, kind: 'int' };
      if (fa.res) return { v: fa.res.v, code: fa.res.code, hint: '<b>Feet:</b> ' + fa.res.hint };
      if (ia.res) return { v: ia.res.v, code: ia.res.code, hint: '<b>Inches:</b> ' + ia.res.hint };
      var F = fa.v, I = ia.v, tot = F * 12 + I, i;
      if (!Number.isInteger(F)) {
        if (!is && Math.abs(F * 12 - T) < 1e-9) return form('u3t-dec-ft', 'That’s the length in <b>decimal feet</b>. Write it in feet <b>and</b> inches: the whole number is the feet, and the decimal part × 12 gives the inches.');
        return form('u3t-ft-whole', 'The feet box takes a whole number of feet. Put the rest in the inches box.');
      }
      if (!fs && Math.abs(I - T) < 1e-9 && T >= 12) return form('u3t-all-in', 'Right length in inches — now write it in feet and inches: how many 12s are in it?');
      if (Math.abs(tot - T) < 1e-9) {
        if (I >= 12 - 1e-9) return form('u3t-trade', 'Right length — now trade 12 in for 1 ft (the inches must be less than 12).');
        if (ia.kind === 'dec' && !Number.isInteger(I)) return form('u3t-decimal', 'Right length — now write the inches with a fraction (for example 3 1/4, not 3.25).');
        var h = lowNudge(ia); if (h) return { v: h.v, code: h.code, hint: '<b>Inches:</b> ' + h.hint };
        if (ia.kind === 'frac' && ia.n > ia.d) return form('u3t-want-mixed', '<b>Inches:</b> write the inches as a mixed number (whole inches and a fraction less than 1).');
        return ok();
      }
      if (o.round && !Number.isInteger(I) && Math.abs(F * 12 + rd(I, 0) - T) < 1e-9) return form('round', 'Right — now round the inches to the nearest inch.');
      if (!is && F === Math.floor(T / 12 + 1e-9) && !Number.isInteger(q(T / 12))) return form('u3t-blank-in', 'Fill in the inches box too.');
      for (i = 0; o.bad && i < o.bad.length; i++) if (Math.abs(tot * 16 - o.bad[i][0]) < 1e-6) return o.bad[i][3] === 'form' ? form(o.bad[i][1], o.bad[i][2]) : wrong(o.bad[i][1], o.bad[i][2]);
      if (F > 0 && I < 12 && Math.abs(F * 10 + I - T) < 1e-9) return wrong('u3t-ten', 'There are <b>12</b> inches in a foot, not 10.');
      return wrong('value', o.miss || null);
    };
  }
  /* a feet-and-inches part (two boxes). o: frac (fraction keypad for the inches), bad, round, sol, hints, text, label */
  function ftinFields(o) {
    o = o || {};
    return [{ label: o.label || '', after: 'ft', name: o.name ? o.name + ' (feet)' : 'Feet' }, { label: '', after: 'in', name: o.name ? o.name + ' (inches)' : 'Inches', mode: o.frac ? 'math' : undefined, keys: o.frac ? 'u3mixed' : undefined, placeholder: o.frac ? PH : undefined }];
  }
  function ftinKey(S) { var a = ftin(S); return [String(a[0]), inT(a[1])]; }
  function ftinPart(prompt, S, o) {
    o = o || {}; var bad = cleanS(o.bad, S);
    var p = { prompt: prompt, input: { type: 'fields', fields: ftinFields(o) }, check: ftinChk(S, { bad: bad, round: o.round, miss: o.miss }), key: ftinKey(S), answer: t(ftinT(S)), solution: o.sol, hints: o.hints || ['Write the length as feet and inches, with less than 12 in.'], text: o.text };
    p.bad = bad.filter(function (b) { return b[3] !== 'form' && Number.isInteger(b[0]) && b[0] >= 0; }).map(function (b) { return ftinKey(b[0]); });
    var a = ftin(S); p.good = a[1] === 0 ? [[String(a[0]), '']] : [];
    return p;
  }
  /* several groups of boxes checked together. groups: [{n (boxes), chk, name}] */
  function multi(groups) {
    return function (resp) {
      resp = resp || []; var at = 0, firstForm = null, firstWrong = null;
      groups.forEach(function (g) {
        var part = resp.slice(at, at + g.n); at += g.n;
        var r = g.chk(g.n === 1 ? (part[0] == null ? '' : part[0]) : part);
        if (r.v === 'correct') return;
        var out = { v: r.v, code: r.code, hint: (g.name ? '<b>' + g.name + ':</b> ' : '') + (r.hint || 'Check this one again.') };
        if (r.v === 'form') { if (!firstForm) firstForm = out; } else if (!firstWrong) firstWrong = out;
      });
      return firstWrong || firstForm || ok();
    };
  }
  /* typical misreadings of a reading S on a ruler marked in sixteenths */
  function rulerBad(S) {
    var w = Math.floor(S / 16), k = S % 16, out = [];
    if (k > 0 && k < 8) out.push([w * 16 + 2 * k, 'u3t-eighths', 'Each small space on this ruler is ' + t('\\frac{1}{16}') + ' in, not ' + t('\\frac{1}{8}') + ' in. Count the sixteenths, then simplify.']);
    if (k > 0 && k % 2 === 0) out.push([w * 16 + k / 2, 'u3t-halved', 'Count every small space (each is ' + t('\\frac{1}{16}') + ' in), then write the fraction over 16 and simplify.']);
    if (k > 0) out.push([(w + 1) * 16 + k, 'u3t-next-inch', 'The whole inches are the <b>last</b> number you passed (on the left of the arrow), not the next one.']);
    if (k > 0 && k !== 8) out.push([w * 16 + 16 - k, 'u3t-from-right', 'Count the small spaces from the whole inch on the <b>left</b> of the arrow, not back from the next inch.']);
    if (k > 0 && w > 0) out.push([(w - 1) * 16 + k, 'u3t-prev-inch', 'Check the whole inches: the last number the arrow passed is ' + w + '.']);
    [k - 1, k + 1].forEach(function (j) { if (j > 0 && j < 16) out.push([w * 16 + j, 'u3t-off-one', 'Close — you are one line off. Count the small spaces again, starting after the whole-inch line.']); });
    return out;
  }
  function readSol(S) {
    var w = Math.floor(S / 16), k = S % 16, f = frac16(k);
    if (!k) return 'It is right on the ' + w + ' in line: ' + t(w + '\\text{ in}') + '.';
    return (w ? 'The last number passed is ' + w + '. ' : 'It is before the 1 in line. ') + 'The arrow is ' + k + ' small space' + (k === 1 ? '' : 's') + ' past it: ' + t(frT(k, 16) + (f[1] !== 16 ? '=' + frT(f[0], f[1]) : '')) + ', so ' + t(inU(S)) + '.';
  }

  /* ---- the ruler / tape drawing ----
   * o: a, b (whole inches shown), ppi (pixels per inch), tape (yellow, red numbers every 16, foot tags), marks [{x (inches), label, color}],
   *    objs [{x1, x2, label, level}] (bars above the ruler) */
  function ruler(o) {
    var a = o.a, b = o.b, ppi = o.ppi || (b - a <= 1 ? 440 : b - a <= 2 ? 250 : 92), Hh = 58, tape = !!o.tape, hook = tape && a === 0;
    var levels = (o.objs || []).reduce(function (m, ob) { return Math.max(m, (ob.level || 0) + 1); }, 0);
    var top = 6 + Math.max(o.marks && o.marks.length ? 40 : 0, levels ? 8 + levels * 28 : 0), padL = 16 + (hook ? 6 : 0), padR = 16;
    var Wd = Math.round(padL + (b - a) * ppi + padR), Ht = top + Hh + 6;
    function X(x) { return padL + (x - a) * ppi; }
    var s = '<svg viewBox="0 0 ' + Wd + ' ' + Ht + '" width="' + Wd + '" style="display:block;max-width:100%;height:auto;margin:6px 0" role="img" aria-label="' + (tape ? 'Tape measure' : 'Ruler') + ' from ' + a + ' to ' + b + ' inches">';
    var x0 = X(a) - (hook ? 0 : 9), x1 = X(b) + 9;
    if (hook) s += '<rect x="' + (X(0) - 6) + '" y="' + (top - 4) + '" width="6" height="' + (Hh + 8) + '" fill="#9aa1a9" stroke="#1d2633" stroke-width="1.2"/>';
    s += '<rect x="' + x0.toFixed(1) + '" y="' + top + '" width="' + (x1 - x0).toFixed(1) + '" height="' + Hh + '" fill="' + (tape ? '#fbe7a1' : '#ffffff') + '" stroke="#1d2633" stroke-width="1.6"/>';
    for (var k = Math.round(a * 16); k <= Math.round(b * 16); k++) {
      var len = k % 16 === 0 ? 36 : k % 8 === 0 ? 28 : k % 4 === 0 ? 21 : k % 2 === 0 ? 15 : 9, sw = k % 16 === 0 ? 1.7 : k % 8 === 0 ? 1.4 : k % 4 === 0 ? 1.2 : 1;
      var xx = X(k / 16).toFixed(1);
      s += '<line x1="' + xx + '" y1="' + top + '" x2="' + xx + '" y2="' + (top + len) + '" stroke="#1d2633" stroke-width="' + sw + '"/>';
    }
    for (var i = Math.ceil(a); i <= b; i++) {
      var xi = X(i), lab = String(i), red = tape && i > 0 && i % 16 === 0, tw = 8.5 * lab.length + 4;
      if (red) s += '<rect x="' + (xi - tw / 2).toFixed(1) + '" y="' + (top + 38) + '" width="' + tw.toFixed(1) + '" height="16" rx="2" fill="#b3261e"/>';
      s += '<text x="' + xi.toFixed(1) + '" y="' + (top + 51) + '" font-size="14" font-weight="700" text-anchor="middle" fill="' + (red ? '#ffffff' : '#1d2633') + '" font-family="sans-serif">' + lab + '</text>';
      if (tape && i > 0 && i % 12 === 0) { var ft = (i / 12) + 'F', fw = 7 * ft.length + 5; s += '<rect x="' + (xi + tw / 2 + 2).toFixed(1) + '" y="' + (top + 40) + '" width="' + fw + '" height="13" fill="#1d2633"/><text x="' + (xi + tw / 2 + 2 + fw / 2).toFixed(1) + '" y="' + (top + 50.5) + '" font-size="10" font-weight="700" text-anchor="middle" fill="#ffffff" font-family="sans-serif">' + ft + '</text>'; }
    }
    (o.objs || []).slice().sort(function (p, r) { return (r.level || 0) - (p.level || 0); }).forEach(function (ob) {
      var y = top - 8 - ((ob.level || 0) + 1) * 28 + 6, xa = X(ob.x1), xb = X(ob.x2);
      s += '<line x1="' + xa.toFixed(1) + '" y1="' + (y + 22) + '" x2="' + xa.toFixed(1) + '" y2="' + top + '" stroke="#6b7686" stroke-dasharray="3 2"/><line x1="' + xb.toFixed(1) + '" y1="' + (y + 22) + '" x2="' + xb.toFixed(1) + '" y2="' + top + '" stroke="#6b7686" stroke-dasharray="3 2"/>';
      s += '<rect x="' + xa.toFixed(1) + '" y="' + y + '" width="' + (xb - xa).toFixed(1) + '" height="22" rx="3" fill="#dfe3e8" stroke="#1d2633" stroke-width="1.2"/>';
      s += '<text x="' + ((xa + xb) / 2).toFixed(1) + '" y="' + (y + 15.5) + '" font-size="12.5" text-anchor="middle" fill="#1d2633" font-family="sans-serif">' + ob.label + '</text>';
    });
    (o.marks || []).forEach(function (mk) {
      var xm = X(mk.x).toFixed(1), c = mk.color || '#1d2633';
      s += '<line x1="' + xm + '" y1="' + (top - 26) + '" x2="' + xm + '" y2="' + (top - 7) + '" stroke="' + c + '" stroke-width="1.8"/><path d="M' + xm + ' ' + (top - 1) + ' l-4.5 -8 h9 z" fill="' + c + '"/>';
      s += '<text x="' + xm + '" y="' + (top - 30) + '" font-size="13.5" font-weight="700" text-anchor="middle" fill="' + c + '" font-family="sans-serif">' + mk.label + '</text>';
    });
    return s + '</svg>';
  }

  Object.assign(T3, { PH: PH, gcd: gcd, q: q, rd: rd, trunc: trunc, same: same, nS: nS, N: N, Np: Np, decs: decs, D: D, Dp: Dp, find: find, cap: cap, br: br, TD: TD, table: table, kc: kc, NAMES: NAMES,
    readNum: readNum, near: near, slip: slip, numChk: numChk, cleanBad: cleanBad, prep: prep, num: num, fld: fld,
    mix: mix, frT: frT, inT: inT, inU: inU, inPl: inPl, ftin: ftin, ftinT: ftinT, frac16: frac16, readMix: readMix, lowNudge: lowNudge, inChk: inChk, inPart: inPart,
    ftinChk: ftinChk, ftinFields: ftinFields, ftinKey: ftinKey, ftinPart: ftinPart, multi: multi, rulerBad: rulerBad, readSol: readSol, ruler: ruler, cleanS: cleanS, badTex: badTex });

  HW.addCodes({
    'u3t-eighths': 'Read sixteenths as eighths', 'u3t-halved': 'Miscounted the sixteenths (halved)', 'u3t-next-inch': 'Used the next whole inch', 'u3t-from-right': 'Counted back from the next inch',
    'u3t-prev-inch': 'Wrong whole inch', 'u3t-off-one': 'One line off', 'u3t-tenths': 'Read the ruler as tenths (decimal)', 'u3t-lowest': 'Fraction not in simplest form', 'u3t-want-mixed': 'Improper fraction instead of a mixed number',
    'u3t-mixed-improper': 'Mixed number with a fraction part of 1 or more', 'u3t-decimal': 'Decimal instead of a fraction of an inch', 'u3t-dec-close': 'Rounded decimal instead of an exact fraction',
    'u3t-ten': 'Used 10 in in a foot', 'u3t-trade': '12 in or more not traded for a foot', 'u3t-dec-ft': 'Decimal feet instead of feet and inches', 'u3t-all-in': 'Inches only instead of feet and inches',
    'u3t-ft-whole': 'Fraction in the feet box', 'u3t-blank-in': 'Inches box left blank', 'u3t-other-box': 'Answers in each other’s boxes', 'u3t-round-dir': 'Rounded the wrong way', 'u3t-comma': 'Decimal comma', 'u3t-neg': 'Negative length',
    'u3l3-next-tag': 'Used the next foot tag', 'u3l3-from-zero': 'Read the end mark without taking away the start', 'u3l3-other-line': 'Chose the farther line', 'u3l3-sixteenth-for-eighth': 'Gave the nearest 1/16 for the nearest 1/8',
    'u3l3-eighth-for-sixteenth': 'Gave the nearest 1/8 for the nearest 1/16', 'u3l3-added': 'Added instead of subtracting', 'u3l3-whole-only': 'Subtracted only the whole inches', 'u3l3-across': 'Subtracted the tops and bottoms straight across',
    'u3l3-wrong-fact': 'Wrong imperial fact', 'u3l3-not-16': 'Fraction part not changed to sixteenths', 'u3l3-no-whole': 'Left out the whole inches', 'u3l3-foot-tags': 'Used the foot tags (12s) instead of the red 16s',
    'u3l3-halves': 'Halved the whole number and the fraction wrong', 'u3l3-half': 'Divided only the top or only the bottom', 'u3l3-unit': 'Chose an unsuitable unit', 'u3l3-match': 'Matched a length to the wrong arrow', 'u3l3-line': 'Named the wrong kind of ruler line', 'u3l3-off': 'Counted the red numbers wrong', 'u3l3-doubled': 'Doubled instead of halving', 'u3l3-borrow': 'Subtracted the fractions the wrong way round'
  });
  HW.addPartial({ 'u3t-off-one': 's', 'u3t-eighths': 'b', 'u3t-next-inch': 'b', 'u3t-from-right': 'b', 'u3t-ten': 'b', 'u3l3-next-tag': 'b', 'u3l3-other-line': 's', 'u3l3-from-zero': 'b', 'u3l3-across': 'b', 'u3l3-whole-only': 'b' });

  /* ================= lesson helpers ================= */
  var EX_READ = [12, 26, 37, 56, 71, 82, 38, 84, 74];            // the lesson's example readings (sixteenths), left out
  var LET = 'ABCDEFGHIJ';
  function kOf(r, ty) { return ty === '16' ? r.pick([1, 3, 5, 7, 9, 11, 13, 15]) : ty === '8' ? r.pick([2, 6, 10, 14]) : ty === '4' ? r.pick([4, 12]) : 8; }
  /* one arrow per inch, starting at inch a */
  function perInch(r, a, n, types, excl) {
    return find(function () { var ty = r.shuffle(types).slice(0, n); return ty.map(function (x, i) { return (a + i) * 16 + kOf(r, x); }); },
      function (v) { return v.every(function (s) { return (excl || []).indexOf(s) < 0; }); }, null) || [10, 20, 35, 62, 72, 89].slice(0, n);
  }
  /* six arrows inside one inch (sixteenths 1..15), at least 2 apart */
  function inOneInch(r, n) {
    return find(function () { return r.sample([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], n).sort(function (x, y) { return x - y; }); }, function (v) {
      for (var i = 1; i < v.length; i++) if (v[i] - v[i - 1] < 2) return false;
      var odd = v.filter(function (k) { return k % 2; }).length, ei = v.filter(function (k) { return k % 4 === 2; }).length, qu = v.filter(function (k) { return k % 4 === 0; }).length;
      return odd >= 2 && odd <= 3 && ei >= 1 && qu >= 1 && v.join() !== '2,5,8,11,14,15';
    }, [2, 5, 8, 11, 14, 15]);
  }
  function arrowsPart(prompt, list, o) {
    o = o || {};
    var fields = list.map(function (S, i) { return { label: LET.charAt(i + (o.off || 0)), after: 'in', name: LET.charAt(i + (o.off || 0)), mode: 'math', keys: 'u3mixed', placeholder: PH }; });
    var checks = list.map(function (S) { return inChk(S, { bad: cleanS(rulerBad(S), S), tenths: true }); });
    var p = P.fields(prompt, fields, checks, list.map(inT), list.map(function (S, i) { return LET.charAt(i + (o.off || 0)) + ' ' + t(o.unitless ? inT(S) : inU(S)); }).join(' &nbsp; '),
      list.map(function (S, i) { return '<b>' + LET.charAt(i + (o.off || 0)) + '</b>: ' + (o.unitless ? (S % 16 === 0 ? '' : S % 16 + ' spaces: ' + t(frT(S % 16, 16) + (frac16(S % 16)[1] !== 16 ? '=' + inT(S) : ''))) : readSol(S)); }).join('<br>'),
      o.hints || ['Find the last whole inch the arrow passed.', 'Count the small spaces (each is ' + t('\\frac{1}{16}') + ' in), then simplify the fraction.'], o.text);
    p.bad = [list.map(function (S) { var b = rulerBad(S)[0]; return b ? inT(b[0]) : '99'; })];
    return p;
  }
  function frIn(k) { var f = frac16(k); return f[1] === 1 ? String(f[0]) : frT(f[0], f[1]); }       // a size in sixteenths, simplified (k < 16)
  function sizeT(k) { return frIn(k) + "''"; }
  /* the ''which is longer?'' choice */
  function longerMC(r, a, b, bigger, sol, why) {
    return P.mc(r, 'Which is longer: <b>' + a + '</b> or <b>' + b + '</b>?', [{ html: a, right: bigger === 0, why: bigger === 0 ? null : why, code: 'u3l3-wrong-fact' }, { html: b, right: bigger === 1, why: bigger === 1 ? null : why, code: 'u3l3-wrong-fact' },
      { html: 'They are the same length.', right: false, why: why, code: 'same' }], sol, ['Change the bigger unit using the facts: 1 ft = 12 in, 1 yd = 36 in, 1 mi = 5280 ft = 1760 yd.'], 'which longer', true);
  }
  /* reasonable-length items: [what, value (TeX), right unit, hint for each wrong unit] */
  var REASON = [
    ['the height of an adult', '5\\tfrac{1}{2}', 'ft'], ['the height of a basketball hoop', '10', 'ft'], ['a 5 km run', '3', 'mi'], ['the length of a canoe', '16', 'ft'],
    ['the width of a laptop screen', '13', 'in'], ['the length of a school bus', '40', 'ft'], ['the drive from Calgary to Edmonton', '180', 'mi'], ['the length of a bed', '6\\tfrac{1}{2}', 'ft'],
    ['a phone screen, corner to corner', '6', 'in'], ['the length of a bowling lane', '60', 'ft'], ['the length of a US football field', '100', 'yd'], ['the length of a pool in a US hotel', '25', 'yd'],
    ['the length of a dinner fork', '7', 'in'], ['the height of a fridge', '6', 'ft'], ['a 10 km bike ride', '6', 'mi'], ['the length of a golf hole', '400', 'yd']];
  var UNIT_WORD = { 'in': 'in', ft: 'ft', yd: 'yd', mi: 'mi' };
  function reasonMC(r, it, lab) {
    var why = { 'in': 'That’s only about ' + it[1].replace(/\\tfrac\{1\}\{2\}/, '½') + ' thumb widths — far too short.', ft: 'Picture ' + it[1].replace(/\\tfrac\{1\}\{2\}/, '½') + ' school rulers end to end. Is that right for ' + it[0] + '?', yd: 'A yard is about one long step. ' + it[1].replace(/\\tfrac\{1\}\{2\}/, '½') + ' long steps doesn’t fit ' + it[0] + '.', mi: 'A mile is about a 20-minute walk — far too long for ' + it[0] + '.' };
    return P.mc(r, lab + ' ' + cap(it[0]) + ': which length is the most reasonable?', ['in', 'ft', 'yd', 'mi'].map(function (u) { return { html: t(it[1] + '\\text{ ' + u + '}'), right: u === it[2], why: u === it[2] ? null : why[u], code: 'unit-' + u }; }),
      t(it[1] + '\\text{ ' + UNIT_WORD[it[2]] + '}') + ' is the most reasonable for ' + it[0] + '.', ['Use the referents: an inch is a thumb width, a foot is a school ruler, a yard is one long step, a mile is about a 20-minute walk.'], 'reasonable ' + it[0], true);
  }
  /* best unit items */
  var UNITS = { 'in': ['the thickness of a textbook', 'the size of a TV screen', 'the width of a smartphone', 'the length of a bolt', 'the width of a picture frame'],
    ft: ['the length of a pickup truck', 'the length of a living room', 'the height of a garage door', 'the length of a canoe', 'the height of a ladder'],
    yd: ['the length of a US football field', 'the length of a golf hole', 'the fabric for a set of curtains', 'the length of a CFL field'],
    mi: ['the distance driven in an hour on a US highway', 'the distance between two US cities', 'the length of a marathon', 'a long bike ride in Montana'] };
  var UCOLS = [{ id: 'in', html: 'inch' }, { id: 'ft', html: 'foot' }, { id: 'yd', html: 'yard' }, { id: 'mi', html: 'mile' }];
  var UWHY = { 'in': 'small things you hold in your hand or measure across', ft: 'rooms, vehicles, heights of doors and people', yd: 'sports fields, golf and fabric', mi: 'long distances you drive' };
  function unitsGrid(r, prompt) {
    var pick = find(function () { var cs = r.shuffle(['in', 'in', 'ft', 'ft', 'yd', 'mi']); var used = {}; return cs.map(function (c) { var opts = UNITS[c].filter(function (x) { return !used[x]; }); var w = r.pick(opts); used[w] = 1; return [w, c]; }); }, function () { return true; }, null);
    var rows = pick.map(function (p, i) { return { id: 'r' + i, html: cap(p[0]) }; }), want = {}; pick.forEach(function (p, i) { want['r' + i] = p[1]; });
    return P.grid(prompt, rows, UCOLS, want, { rowHead: 'Length', why: function (row) { var p = pick[+row.slice(1)], c = p[1]; return { code: 'u3l3-unit', hint: cap(p[0]) + ': use the ' + UCOLS.filter(function (x) { return x.id === c; })[0].html + ' — it fits ' + UWHY[c] + '. Check that row again.' }; } },
      pick.map(function (p) { return cap(p[0]) + ': <b>' + UCOLS.filter(function (x) { return x.id === p[1]; })[0].html + '</b>'; }).join('<br>'), ['Inches for small things, feet for rooms and vehicles, yards for sports fields, miles for long drives.'], 'best unit');
  }
  /* symbols / words */
  function symMC(r, ft, inS, lab) {
    var inc = inT(inS), right = (ft ? ft + "'\\," : '') + inc + "''";
    var opts = [{ html: t(right), right: true }];
    if (ft) {
      opts.push({ html: t(ft + "''\\," + inc + "'"), why: 'The single mark ' + t("'") + ' means <b>feet</b> and the double mark ' + t("''") + ' means <b>inches</b>.', code: 'marks' });
      opts.push({ html: t(ft + '.' + mix(inS).w + "'"), why: 'Feet and inches are not written with a decimal point: ' + (inS % 16 ? t(inc) : inc) + ' inches is not a decimal part of a foot.', code: 'decimal' });
      opts.push({ html: t(String(ft) + String(inc).replace(/\\frac\{(\d+)\}\{(\d+)\}/, '\\frac{$1}{$2}') + "''"), why: 'That puts the digits together as inches only. Write the feet with ' + t("'") + ' and the inches with ' + t("''") + '.', code: 'digits' });
    } else {
      opts.push({ html: t(inc + "'"), why: 'One mark ' + t("'") + ' means feet. Inches use two marks: ' + t("''") + '.', code: 'marks' });
      opts.push({ html: t(Math.floor(inS / 192 + 1) + "'\\," + (inS / 16 - 12 * Math.floor(inS / 192 + 1) < 0 ? inc : inc) + "''"), why: 'There are no whole feet in less than 12 inches.', code: 'feet' });
      opts.push({ html: t('0.' + inc + "'"), why: 'Inches are not a decimal part of a foot. Just write the inches with ' + t("''") + '.', code: 'decimal' });
    }
    return P.mc(r, lab, opts, 'Feet use one mark ' + t("'") + ' and inches use two marks ' + t("''") + ': ' + t(right) + '.', ['One mark means feet; two marks mean inches.'], 'symbols');
  }
  var FRW = { '1/2': 'one-half', '1/4': 'one-quarter', '3/4': 'three-quarters', '1/8': 'one-eighth', '3/8': 'three-eighths', '5/8': 'five-eighths', '7/8': 'seven-eighths' };
  function inWords(inS) { var m = mix(inS); var fr = m.n ? FRW[m.n + '/' + m.d] : ''; if (!m.w) return fr + ' of an inch'; return m.w + (fr ? ' and ' + fr : '') + ' inch' + (m.w === 1 && !fr ? '' : 'es'); }
  function wordsMC(r, ft, inS, lab) {
    var sym = (ft ? ft + "'" + (inS != null ? '\\,' : '') : '') + (inS != null ? inT(inS) + "''" : '');
    var right, opts;
    if (ft && inS == null) { right = ft + ' feet'; opts = [right, ft + ' inches', ft + ' yards', '1 foot ' + (ft % 10) + ' inches']; }
    else if (!ft) { right = inWords(inS); var m = mix(inS); opts = [right, right.replace('of an inch', 'of a foot'), m.n + ' feet ' + m.d + ' inches', right.replace('of an inch', 'of a yard')]; }
    else { right = ft + ' feet ' + inWords(inS); opts = [right, ft + ' inches ' + inWords(inS).replace(/inch(es)?/, 'feet'), ft + '.' + mix(inS).w + ' feet', String(ft) + mix(inS).w + ' inches']; }
    var why = { 0: null, 1: 'Check the marks: one mark ' + t("'") + ' means feet; two marks ' + t("''") + ' mean inches.', 2: 'Read the marks: ' + t("'") + ' is feet and ' + t("''") + ' is inches.', 3: 'Read each part with its own mark: ' + t("'") + ' is feet and ' + t("''") + ' is inches.' };
    return P.mc(r, lab + ' Write ' + t(sym) + ' in words.', opts.map(function (h, i) { return { html: h, right: i === 0, why: why[i], code: 'w' + i }; }), t(sym) + ' is ' + right + '.', ['One mark ' + t("'") + ' means feet; two marks ' + t("''") + ' mean inches.'], 'words');
  }
  /* the nearest 1/16 and 1/8 table. w: the inch shown; pts: [{lab, k (nearest sixteenth line, odd), d (offset in sixteenths)}] */
  function nearestPart(w, pts, prompt) {
    var fields = [], checks = [], keys = [], ans = [], sols = [];
    pts.forEach(function (p) {
      var s16 = w * 16 + p.k, s8 = w * 16 + p.k + (p.d > 0 ? 1 : -1), other8 = w * 16 + p.k + (p.d > 0 ? -1 : 1), far16 = w * 16 + p.k + (p.d > 0 ? 1 : -1);
      fields.push({ label: p.lab + ', nearest ' + t('\\tfrac{1}{16}') + ':', after: 'in', name: p.lab + ' (nearest 1/16)', mode: 'math', keys: 'u3mixed', placeholder: PH }, { label: p.lab + ', nearest ' + t('\\tfrac{1}{8}') + ':', after: 'in', name: p.lab + ' (nearest 1/8)', mode: 'math', keys: 'u3mixed', placeholder: PH });
      checks.push(inChk(s16, { bad: cleanS([[s8, 'u3l3-eighth-for-sixteenth', 'For the nearest ' + t('\\tfrac{1}{16}') + ', use <b>all</b> the lines, the shortest ones too. Which line is closest to the arrow?'], [w * 16 + p.k - (p.d > 0 ? 1 : -1), 'u3l3-other-line', 'That line is farther away. Use the line closest to the arrow.']].concat(rulerBad(s16).filter(function (b) { return b[1] !== 'u3t-off-one'; })), s16) }),
        inChk(s8, { bad: cleanS([[s16, 'u3l3-sixteenth-for-eighth', 'That’s to the nearest ' + t('\\tfrac{1}{16}') + '. For the nearest ' + t('\\tfrac{1}{8}') + ', skip the shortest lines and use the closest of the longer lines.'], [other8, 'u3l3-other-line', 'Of the two longer lines on each side of the arrow, that one is farther away. Use the closer one.']], s8) }));
      keys.push(inT(s16), inT(s8)); ans.push(p.lab + ': ' + t(inU(s16)) + ' and ' + t(inU(s8)));
      sols.push('<b>' + p.lab + '</b>: the closest line is the ' + p.k + (p.k === 1 ? 'st' : p.k === 3 ? 'rd' : p.k === 2 ? 'nd' : 'th') + ' sixteenth past ' + w + ', so ' + t(inU(s16)) + '. Skipping the shortest lines, it is between ' + t(inT(Math.min(s8, other8))) + ' and ' + t(inT(Math.max(s8, other8))) + ' and closer to ' + t(inU(s8)) + '.');
    });
    var p = P.fields(prompt, fields, checks, keys, ans.join('<br>'), sols.join('<br>'), ['Nearest ' + t('\\tfrac{1}{16}') + ': use every line and pick the closest one.', 'Nearest ' + t('\\tfrac{1}{8}') + ': skip the shortest lines, then pick the closest.'], 'nearest 16 8');
    p.bad = [keys.map(function (k, i) { return i % 2 ? keys[i - 1] : keys[i + 1]; })];
    return p;
  }
  function nearPts(r, labs, forceWhole) {
    return find(function () {
      var dA = r.pick([-1, 1]) * r.pick([0.24, 0.28, 0.32]), dB = r.pick([-1, 1]) * r.pick([0.24, 0.28, 0.32]);
      var kA = r.pick([1, 3, 5, 7]), kB = r.pick([9, 11, 13, 15]);
      if (forceWhole) { kB = 15; dB = r.pick([0.2, 0.24, 0.28]); }
      return [{ lab: labs[0], k: kA, d: dA }, { lab: labs[1], k: kB, d: dB }];
    }, function (v) { return v[1].k - v[0].k >= 4 && !(v[0].k === 1 && v[0].d < 0); }, [{ lab: labs[0], k: 3, d: -0.28 }, { lab: labs[1], k: 11, d: 0.24 }]);
  }
  /* a tape reading: inches box + feet-and-inches boxes */
  function tapeRead(prompt, S, F, o) {
    o = o || {};
    var tag = F / 12, before = S < F * 16, ftBad = cleanS([[S + 192, 'u3l3-next-tag', before ? 'This arrow is <b>before</b> the ' + tag + 'F tag, so it is ' + (tag - 1) + ' ft and some inches.' : 'Use the last foot tag the arrow passed.'], [S - 192, 'u3l3-next-tag', 'Use the last foot tag the arrow passed (' + (before ? tag - 1 : tag) + 'F).']].concat(rulerBad(S).filter(function (b) { return b[1] !== 'u3t-off-one'; })), S);
    var inBad = cleanS(rulerBad(S), S);
    var ft = ftin(S), fields = [{ label: 'Inches:', after: 'in', name: 'Inches', mode: 'math', keys: 'u3mixed', placeholder: PH }].concat(ftinFields({ frac: true, label: 'Feet and inches:', name: 'Feet and inches' }));
    var chk = multi([{ n: 1, chk: inChk(S, { bad: inBad, tenths: true }), name: 'Inches' }, { n: 2, chk: ftinChk(S, { bad: ftBad }), name: 'Feet and inches' }]);
    var since = (before ? tag - 1 : tag), sinceIn = since * 12;
    var sol = br([readSol(S), since ? (before ? 'It is before the ' + tag + 'F tag, so it is past ' + since + 'F (' + sinceIn + ' in): ' : 'It is past the ' + tag + 'F tag (' + sinceIn + ' in): ') + t(inT(S) + '-' + sinceIn + '=' + inT(S - since * 192)) + ', so ' + t(ftinT(S)) + '.' : 'It is less than 1 ft.']);
    return { prompt: prompt, input: { type: 'fields', fields: fields }, check: chk, key: [inT(S)].concat(ftinKey(S)), answer: t(inU(S) + '=' + ftinT(S)), solution: sol,
      hints: ['Read the inches like a ruler: the last number passed, then the sixteenths.', 'For feet and inches: the feet are the last foot tag passed; the inches are how far past it.'], text: o.text || 'tape reading', bad: [[inT(S)].concat(ftinKey(S + 192))], good: ft[1] < 16 ? [[inT(S), String(ft[0]), '0 ' + inPl(ft[1])]] : [] };
  }
  function tapeArrows(r, s, F, n0) {   // A, B before the tag F, C just past it
    return find(function () {
      var A = (s + r.int(0, 1)) * 16 + kOf(r, r.pick(['2', '4'])), B = r.int(Math.floor(A / 16) + 1, F - 1) * 16 + kOf(r, '8'), C = F * 16 + kOf(r, '16');
      return [A, B, C];
    }, function (v) { return v[0] < v[1] && v[1] < F * 16 && v[1] - v[0] >= 16 && v[0] > s * 16 && EX_READ.indexOf(v[0]) < 0; }, [(s + 1) * 16 + 8, (F - 2) * 16 + 14, F * 16 + 5]);
  }
  /* order fractions of an inch (sizes in sixteenths) */
  function orderSizes(r, ks, prompt, first, last) {
    var items = ks.slice().sort(function (a, b) { return a - b; }).map(function (k) { return { id: 'k' + k, tex: sizeT(k) }; });
    if (first === 'largest') items.reverse();
    return P.order(r, prompt, items, { first: first, last: last, why: function (a, b) { var x = +a.slice(1), y = +b.slice(1); return 'Change both to sixteenths: ' + t(sizeT(x) + '=\\frac{' + x + '}{16}') + ' and ' + t(sizeT(y) + '=\\frac{' + y + '}{16}') + '.'; } },
      'In sixteenths: ' + t(ks.map(function (k) { return frIn(k) + (frac16(k)[1] === 16 ? '' : '=\\frac{' + k + '}{16}'); }).join(',\\ ')) + '<br>Order: ' + t(items.map(function (x) { return x.tex; }).join(',\\ ')),
      ['Change every size to sixteenths (multiply the top and bottom), then compare the tops.'], 'order sizes');
  }
  function nextSizeMC(r, ks, at, dir, prompt, who) {   // dir +1: next size up; -1: next size down
    var srt = ks.slice().sort(function (a, b) { return a - b; }), i = srt.indexOf(at), ansK = srt[i + dir];
    var opts = [{ html: t(sizeT(ansK)), right: true }], used = [ansK];
    var cand = [[srt[i - dir], dir > 0 ? 'That one is smaller than the ' + t(sizeT(at)) + '. You need the next size <b>up</b>.' : 'That one is bigger than the ' + t(sizeT(at)) + '. You need the next size <b>down</b>.'],
      [srt[i + 2 * dir], 'That skips a size. Put the sizes in order (in sixteenths) and take the very next one.'], [srt[i + 3 * dir], 'That skips sizes. Change them to sixteenths and take the very next one.'], [srt[i - 2 * dir], 'Put the sizes in order in sixteenths first.']];
    cand.forEach(function (c) { if (opts.length < 4 && c[0] != null && used.indexOf(c[0]) < 0) { used.push(c[0]); opts.push({ html: t(sizeT(c[0])), why: c[1], code: 'size' + c[0] }); } });
    srt.forEach(function (k) { if (opts.length < 4 && used.indexOf(k) < 0) { used.push(k); opts.push({ html: t(sizeT(k)), why: 'Put the sizes in order in sixteenths, then take the very next one.', code: 'size' + k }); } });
    return P.mc(r, prompt, opts, t(sizeT(at) + '=\\frac{' + at + '}{16}') + '. The next size ' + (dir > 0 ? 'up' : 'down') + ' is ' + t('\\frac{' + ansK + '}{16}=' + sizeT(ansK)) + '.', ['Use your order from (a).'], 'next size');
  }
  /* subtract two marks: b − a (sixteenths), with the booklet-style lines */
  function subSol(a, b) {
    var ma = mix(a), mb = mix(b), L = 1;
    [ma.d, mb.d].forEach(function (d) { if (d > 1) L = L * d / gcd(L, d); });
    var ta = ma.n * L / ma.d, tb = mb.n * L / mb.d, lines = [], dS = b - a;
    function m(w, n) { return (w ? w : '') + (n ? frT(n, L) : (w ? '' : '0')); }
    if (L > 1 && (ma.d !== L || mb.d !== L)) lines.push(t(inT(b) + '-' + inT(a) + '=' + m(mb.w, tb) + '-' + m(ma.w, ta)));
    if (tb < ta) lines.push('Borrow 1 in: ' + t(m(mb.w, tb) + '=' + (mb.w - 1 ? mb.w - 1 : '') + frT(tb + L, L)));
    lines.push(t((tb < ta ? (mb.w - 1 ? mb.w - 1 : '') + frT(tb + L, L) : m(mb.w, tb)) + '-' + m(ma.w, ta) + '=' + (Math.floor(dS / 16) || '') + (dS % 16 ? frT(dS % 16 * L / 16, L) : '') + (dS % 16 && gcd(dS % 16 * L / 16, L) > 1 ? '=' + inT(dS) : '') + '\\text{ in}'));
    return lines.join('<br>');
  }
  function subBad(a, b) {
    var ma = mix(a), mb = mix(b), out = [[a + b, 'u3l3-added', 'Find the length <b>between</b> the marks: subtract the smaller mark from the larger one.'], [(mb.w - ma.w) * 16, 'u3l3-whole-only', 'Subtract the fraction parts too, not just the whole inches.']];
    if (ma.d !== mb.d && mb.d > ma.d && mb.n > ma.n) { var fn = mb.n - ma.n, fd = mb.d - ma.d; if (fd > 0 && fn < fd && 16 % fd === 0) out.push([(mb.w - ma.w) * 16 + fn * 16 / fd, 'u3l3-across', 'You can’t subtract the tops and the bottoms straight across. Write both fractions with the same bottom first.']); }
    if (mix(b).r < mix(a).r) out.push([(mb.w - ma.w) * 16 + (mix(a).r - mix(b).r), 'u3l3-borrow', 'The top fraction is smaller, so you can’t take ' + t(frT(ma.n, ma.d)) + ' away from ' + t(frT(mb.n, mb.d)) + '. Borrow 1 in (' + t('\\frac{16}{16}') + ') first.']);
    return out;
  }
  function heightT(S) { return ftinT(S); }
  function andList(a) { return a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]; }

  /* ================= the lesson ================= */
  HW.defineLesson({
    id: 'u3l3', unit: 3, num: '3', title: 'The Imperial System and Reading a Tape Measure', outcome: 'M2',
    blurb: 'Inches, feet, yards and miles; reading a ruler or tape measure to the nearest sixteenth of an inch; feet and inches.',
    questions: [
      { num: '1', outcome: 'M2', stem: '', parts: [
        { id: '1ae', sub: 'a–e', level: 'BEG', make: function (r) {
          var facts = [['1 ft', 'in', 12], ['1 yd', 'ft', 3], ['1 yd', 'in', 36], ['1 mi', 'ft', 5280], ['1 mi', 'yd', 1760]];
          var wrongs = { 12: [[10, 'u3l3-wrong-fact', 'Imperial units don’t go by tens: 1 ft = 12 in.'], [3, 'u3l3-wrong-fact', '3 is the number of feet in a yard.']], 3: [[12, 'u3l3-wrong-fact', '12 is the number of inches in a foot.'], [36, 'u3l3-wrong-fact', '36 is the number of inches in a yard.']], 36: [[12, 'u3l3-wrong-fact', '1 yd = 3 ft, and each foot is 12 in: 3 × 12.'], [3, 'u3l3-wrong-fact', 'That’s feet. How many inches are in 3 ft?']], 5280: [[1760, 'u3l3-wrong-fact', '1760 is the number of <b>yards</b> in a mile.'], [5000, 'u3l3-wrong-fact', 'A mile is a little more than 5000 ft: 5280 ft.']], 1760: [[5280, 'u3l3-wrong-fact', '5280 is the number of <b>feet</b> in a mile.'], [1000, 'u3l3-wrong-fact', 'Imperial units don’t go by thousands: 1 mi = 1760 yd.']] };
          return fld('Fill in the blanks.', facts.map(function (f, i) { return { label: '(' + 'abcde'.charAt(i) + ') ' + f[0] + ' =', name: '(' + 'abcde'.charAt(i) + ')', v: f[2], after: f[1], o: { bad: wrongs[f[2]] } }; }),
            '1 ft = 12 in &nbsp; 1 yd = 3 ft &nbsp; 1 yd = 36 in (3 × 12) &nbsp; 1 mi = 5280 ft &nbsp; 1 mi = 1760 yd', ['1 ft = 12 in and 1 yd = 3 ft.', 'A mile is 5280 ft, or 1760 yd.'], 'imperial facts', { swap: false });
        } },
        { id: '1f', sub: 'f', level: 'BEG', make: function (r) { var n = r.pick([13, 14, 15, 16, 18, 9, 11]), bigger = n > 12 ? 1 : 0; return longerMC(r, '1 ft', n + ' in', bigger, '1 ft = 12 in, which is ' + (bigger ? 'less' : 'more') + ' than ' + n + ' in. ' + (bigger ? n + ' in' : '1 ft') + ' is longer.', 'Change the foot to inches: 1 ft = 12 in. Compare 12 in with ' + n + ' in.'); } },
        { id: '1g', sub: 'g', level: 'BEG', make: function (r) { var n = r.pick([30, 32, 34, 38, 40, 42, 45]), bigger = n > 36 ? 1 : 0; return longerMC(r, '1 yd', n + ' in', bigger, '1 yd = 36 in, which is ' + (bigger ? 'less' : 'more') + ' than ' + n + ' in. ' + (bigger ? n + ' in' : '1 yd') + ' is longer.', 'Change the yard to inches: 1 yd = 3 × 12 = 36 in.'); } },
        { id: '1h', sub: 'h', level: 'BEG', make: function (r) { var v = r.pick([['ft', 5000], ['ft', 5500], ['ft', 4800], ['ft', 6000], ['yd', 1500], ['yd', 1800], ['yd', 1700]]), m = v[0] === 'ft' ? 5280 : 1760, bigger = v[1] > m ? 1 : 0; return longerMC(r, '1 mi', HW.fmt(String(v[1]), true) + ' ' + v[0], bigger, '1 mi = ' + m + ' ' + v[0] + ', which is ' + (bigger ? 'less' : 'more') + ' than ' + v[1] + ' ' + v[0] + '. ' + (bigger ? v[1] + ' ' + v[0] : '1 mi') + ' is longer.', '1 mi = 5280 ft = 1760 yd. Compare ' + m + ' ' + v[0] + ' with ' + v[1] + ' ' + v[0] + '.'); } }] },
      { num: '2', outcome: 'M2', stem: 'Write each length with symbols or in words.', parts: [
        { id: '2a', level: 'BEG', make: function (r) { var f = r.int(3, 8), i = r.pick([2, 3, 4, 5, 7, 8, 9, 10, 11]); return symMC(r, f, i * 16, '(a) Write ' + f + ' feet ' + i + ' inches using the symbols ' + t("'") + ' and ' + t("''") + '.'); } },
        { id: '2b', level: 'BEG', make: function (r) { var i = r.pick([5, 7, 8, 9, 10, 11]); return symMC(r, 0, i * 16, '(b) Write ' + i + ' inches using a symbol.'); } },
        { id: '2c', level: 'BEG', make: function (r) { var f = r.int(4, 7), S = r.int(1, 10) * 16 + r.pick([4, 8, 12]); return symMC(r, f, S, '(c) Write ' + f + ' feet ' + inWords(S) + ' using the symbols.'); } },
        { id: '2d', level: 'BEG', make: function (r) { return wordsMC(r, r.pick([6, 8, 9, 10, 12, 14, 16]), null, '(d)'); } },
        { id: '2e', level: 'BEG', make: function (r) { return wordsMC(r, r.int(4, 6), r.pick([2, 3, 4, 7, 9, 11]) * 16, '(e)'); } },
        { id: '2f', level: 'BEG', make: function (r) { return wordsMC(r, 0, r.pick([4, 12, 8, 2, 6, 10, 14]), '(f)'); } }] },
      { num: '3', outcome: 'M2', stem: 'Units and referents.', shared: function (r) { return { items: r.sample(REASON, 3) }; }, parts: [
        { id: '3a', level: 'BEG', make: function (r) { return unitsGrid(r, '(a) Choose the best unit (inch, foot, yard or mile) for each.'); } },
        { id: '3bi', sub: 'b i', level: 'BEG', make: function (r, sh) { return reasonMC(r, sh.items[0], '(b)(i)'); } },
        { id: '3bii', sub: 'b ii', level: 'BEG', make: function (r, sh) { return reasonMC(r, sh.items[1], '(b)(ii)'); } },
        { id: '3biii', sub: 'b iii', level: 'BEG', make: function (r, sh) { return reasonMC(r, sh.items[2], '(b)(iii)'); } }] },
      { num: '4', outcome: 'M2', stem: '', parts: [
        { id: '4af', sub: 'a–f', level: 'BEG', make: function (r) {
          var pool = [[2, 16], [4, 16], [6, 16], [8, 16], [10, 16], [12, 16], [14, 16], [2, 8], [4, 8], [6, 8], [2, 4]];
          var pk = find(function () { return r.sample(pool, 6); }, function (v) { return v.filter(function (x) { return x[1] === 16; }).length >= 4 && v.some(function (x) { return x[1] !== 16; }); }, pool.slice(0, 6)).sort(function (a, b) { return a[1] - b[1] || a[0] - b[0]; }).reverse();
          var fields = pk.map(function (f, i) { return { label: '(' + 'abcdef'.charAt(i) + ') ' + t('\\dfrac{' + f[0] + '}{' + f[1] + '}') + ' =', name: '(' + 'abcdef'.charAt(i) + ')', mode: 'math', keys: 'u3mixed', placeholder: PH }; });
          var checks = pk.map(function (f) { var g = gcd(f[0], f[1]); return inChk(f[0] / f[1] * 16, { bad: [[f[0] / f[1] * 8, 'u3l3-half', 'Divide the top <b>and</b> the bottom by the same number.'], [f[0] / f[1] * 32, 'u3l3-half', 'Divide the top <b>and</b> the bottom by the same number.']] }); });
          var p = P.fields('Write each in simplest form.', fields, checks, pk.map(function (f) { var g = gcd(f[0], f[1]); return frT(f[0] / g, f[1] / g); }), pk.map(function (f, i) { var g = gcd(f[0], f[1]); return '(' + 'abcdef'.charAt(i) + ') ' + t(frT(f[0] / g, f[1] / g)); }).join(' &nbsp; '),
            pk.map(function (f) { var g = gcd(f[0], f[1]); return t('\\frac{' + f[0] + '}{' + f[1] + '}=\\frac{' + f[0] + '\\div ' + g + '}{' + f[1] + '\\div ' + g + '}=' + frT(f[0] / g, f[1] / g)); }).join('<br>'), ['Divide the top and bottom by the same number. Keep going until you can’t.'], 'simplest form');
          p.bad = [pk.map(function (f) { return frT(f[0], f[1]); })];
          return p;
        } },
        { id: '4g', sub: 'g', level: 'BEG', make: function (r) {
          var k = r.pick([3, 5, 7, 11, 13, 15]);
          return P.mc(r, '(g) Why can ' + t('\\dfrac{' + k + '}{16}') + ' not be simplified?', [
            { html: k + ' is odd, so the only number that divides both ' + k + ' and 16 is 1.', right: true },
            { html: 'Because 16 is too big to divide.', why: '16 can be divided by 2, 4 and 8. The question is whether ' + k + ' can be divided by them too.', code: 'big' },
            { html: 'Because ' + k + ' is a prime number.', why: (k === 15 ? '15 is not prime (3 × 5), and still ' : 'Being prime is not the reason: 2 is prime, and ') + t('\\frac{2}{16}') + ' simplifies. What matters is that ' + k + ' is <b>odd</b>, and 16 only has the factors 2, 4, 8 and 16.', code: 'prime' },
            { html: 'It can: ' + t('\\frac{' + k + '}{16}=\\frac{' + (k + 1) / 2 + '}{8}') + '.', why: 'Dividing the top by 2 doesn’t give ' + ((k + 1) / 2) + '. Since ' + k + ' is odd, it can’t be halved.', code: 'can' }],
            k + ' is odd. 16 only has the factors 1, 2, 4, 8 and 16, and none of 2, 4, 8 or 16 goes into an odd number, so the only common factor is 1.', ['What numbers divide 16? Does any of them (besides 1) divide ' + k + '?'], 'why odd');
        } }] },
      { num: '5', outcome: 'M3', stem: 'This is one inch, made bigger. Write the fraction at each arrow in simplest form.', parts: [
        { id: '5', level: 'EMG', make: function (r) { var ks = inOneInch(r, 6); return arrowsPart(ruler({ a: 0, b: 1, marks: ks.map(function (k, i) { return { x: k / 16, label: LET.charAt(i) }; }) }), ks, { unitless: false, text: 'one inch arrows' }); } }] },
      { num: '6', outcome: 'M3', stem: 'Read the length at each arrow.', parts: [
        { id: '6', level: 'EMG', make: function (r) { var ss = perInch(r, 0, 6, ['16', '16', '8', '8', '4', '2'], EX_READ.concat([10, 20, 35, 62, 72, 89])); return arrowsPart(ruler({ a: 0, b: 6, marks: ss.map(function (s, i) { return { x: s / 16, label: LET.charAt(i) }; }) }), ss, { text: 'ruler arrows' }); } }] },
      { num: '7', outcome: 'M3', stem: '', parts: [
        { id: '7', level: 'EMG', make: function (r) {
          var v = find(function () {
            var ty = r.shuffle(['8', '4', '16', '16', r.pick(['2', '8'])]), tg = ty.map(function (x, i) { var k = kOf(r, x); if (x === '16' && i === ty.indexOf('16')) k = r.pick([3, 5, 7]); return (i + 1) * 16 + k; });
            var dis = [], iE = ty.indexOf('8'), i16 = ty.indexOf('16');
            if (iE >= 0) dis.push({ x: (iE + 1) * 16 + (tg[iE] % 16) / 2, row: iE });
            dis.push({ x: (i16 + 1) * 16 + 2 * (tg[i16] % 16), row: i16 });
            return { tg: tg, dis: dis };
          }, function (v) { var all = v.tg.concat(v.dis.map(function (d) { return d.x; })).sort(function (a, b) { return a - b; }); for (var i = 1; i < all.length; i++) if (all[i] - all[i - 1] < 3) return false; return all[all.length - 1] <= 94 && v.tg.join() !== '22,44,49,69,88'; }, null)
            || { tg: [22, 44, 53, 69, 88], dis: [{ x: 27, row: 0 }, { x: 74, row: 2 }] };
          var arrows = v.tg.map(function (x, i) { return { x: x, row: i, right: true }; }).concat(v.dis.map(function (d) { return { x: d.x, row: d.row, right: false }; })).sort(function (a, b) { return a.x - b.x; });
          arrows.forEach(function (a, i) { a.lab = LET.charAt(i); });
          var rowsN = 'PQRST', rows = v.tg.map(function (x, i) { return { id: 'r' + i, html: rowsN.charAt(i) + ' &nbsp; ' + t(inU(x)) }; }), want = {};
          v.tg.forEach(function (x, i) { want['r' + i] = arrows.filter(function (a) { return a.x === x; })[0].lab; });
          var cols = arrows.map(function (a) { return { id: a.lab, html: a.lab }; });
          return P.grid('Seven arrows are drawn on this ruler. Match each length to its arrow.' + ruler({ a: 0, b: 6, marks: arrows.map(function (a) { return { x: a.x / 16, label: a.lab }; }) }), rows, cols, want,
            { rowHead: 'Length', why: function (row, given) { var i = +row.slice(1), x = v.tg[i], ar = arrows.filter(function (a) { return a.lab === given; })[0], k = x % 16;
              if (ar && !ar.right && ar.row === i) return { code: ar.x % 16 > k ? 'u3t-eighths' : 'u3t-halved', hint: rowsN.charAt(i) + ' is ' + t(inU(x)) + ' = ' + t(Math.floor(x / 16) + '\\frac{' + k + '}{16}') + ': count <b>' + k + '</b> small spaces (sixteenths) past ' + Math.floor(x / 16) + '.' };
              return { code: 'u3l3-match', hint: rowsN.charAt(i) + ' (' + t(inU(x)) + '): find the ' + Math.floor(x / 16) + ' in line, then change the fraction to sixteenths and count that many small spaces.' }; } },
            v.tg.map(function (x, i) { return rowsN.charAt(i) + ' ' + t(inU(x)) + ': ' + t(inT(x % 16) + (x % 16 && frac16(x % 16)[1] !== 16 ? '=\\frac{' + x % 16 + '}{16}' : '')) + ', so ' + (x % 16) + ' spaces past ' + Math.floor(x / 16) + ' — arrow <b>' + want['r' + i] + '</b>'; }).join('<br>'),
            ['Change each fraction to sixteenths: that is how many small spaces past the whole inch.'], 'match arrows');
        } }] },
      { num: '8', outcome: 'M3', stem: 'How long is each object?', shared: function (r) {
          return find(function () {
            var a = r.int(2, 3) * 16 + kOf(r, '8'), b = r.int(4, 5) * 16 + kOf(r, '16'), cs = 16, ce = cs + r.int(1, 2) * 16 + r.pick([4, 8, 12]), ds = ce + r.pick([4, 8, 12]), de = ds + r.int(1, 2) * 16 + r.pick([2, 6, 10]);
            return { a: a, b: b, cs: cs, ce: ce, ds: ds, de: de };
          }, function (v) { return v.b - v.a >= 16 && (v.de % 16) >= (v.ds % 16) && v.ds % 16 !== 0 && mix(v.de).d === 8 && v.de <= 94 && v.de - v.ds >= 20 && [38, 84].indexOf(v.a) < 0 && !(v.a === 46 && v.b === 67) && !(v.ce === 52 && v.ds === 56 && v.de === 94); }, { a: 42, b: 75, cs: 16, ce: 60, ds: 52, de: 90 });
        }, parts: [
        { id: '8ab', sub: 'a–b', level: 'EMG', make: function (r, sh) {
          var pic = ruler({ a: 0, b: 6, objs: [{ x1: 0, x2: sh.b / 16, label: '(b) a bolt', level: 1 }, { x1: 0, x2: sh.a / 16, label: '(a) a USB stick', level: 0 }] });
          var p = P.fields(pic, [{ label: '(a) USB stick:', after: 'in', name: '(a)', mode: 'math', keys: 'u3mixed', placeholder: PH }, { label: '(b) bolt:', after: 'in', name: '(b)', mode: 'math', keys: 'u3mixed', placeholder: PH }],
            [inChk(sh.a, { bad: cleanS(rulerBad(sh.a).concat([[sh.b, 'u3t-other-box', 'That’s the bolt. Box (a) is the USB stick.']]), sh.a), tenths: true }), inChk(sh.b, { bad: cleanS(rulerBad(sh.b).concat([[sh.a, 'u3t-other-box', 'That’s the USB stick. Box (b) is the bolt.']]), sh.b), tenths: true })],
            [inT(sh.a), inT(sh.b)], '(a) ' + t(inU(sh.a)) + ' &nbsp; (b) ' + t(inU(sh.b)), '(a) ' + readSol(sh.a) + '<br>(b) ' + readSol(sh.b), ['Both start at the 0 line, so read where each one ends.'], 'objects from 0');
          p.bad = [[inT(sh.b), inT(sh.a)]]; return p;
        } },
        { id: '8cd', sub: 'c–d', level: 'PRG', make: function (r, sh) {
          var pic = ruler({ a: 0, b: 6, objs: [{ x1: sh.cs / 16, x2: sh.ce / 16, label: '(c) a nail', level: 0 }, { x1: sh.ds / 16, x2: sh.de / 16, label: '(d) a tag', level: 0 }] });
          var c = sh.ce - sh.cs, d = sh.de - sh.ds;
          var p = P.fields(pic, [{ label: '(c) nail:', after: 'in', name: '(c)', mode: 'math', keys: 'u3mixed', placeholder: PH }, { label: '(d) tag:', after: 'in', name: '(d)', mode: 'math', keys: 'u3mixed', placeholder: PH }],
            [inChk(c, { bad: [[sh.ce, 'u3l3-from-zero', 'The nail starts at the ' + sh.cs / 16 + ' in line, not at 0. Take away the starting mark.']] }), inChk(d, { bad: [[sh.de, 'u3l3-from-zero', 'The tag starts at ' + t(inU(sh.ds)) + ', not at 0. Take away the starting mark.']].concat(subBad(sh.ds, sh.de)) })],
            [inT(c), inT(d)], '(c) ' + t(inU(c)) + ' &nbsp; (d) ' + t(inU(d)), '(c) The nail goes from ' + t(inU(sh.cs)) + ' to ' + t(inU(sh.ce)) + ':<br>' + subSol(sh.cs, sh.ce) + '<br>(d) The tag goes from ' + t(inU(sh.ds)) + ' to ' + t(inU(sh.de)) + ':<br>' + subSol(sh.ds, sh.de),
            ['These don’t start at 0. Read where each one starts and ends.', 'Length = end − start.'], 'objects not from 0');
          p.bad = [[inT(sh.ce), inT(sh.de)]]; return p;
        } }] },
      { num: '9', outcome: 'M3', stem: function (sh) { return 'This is the part of a ruler from ' + sh.w + ' in to ' + (sh.w + 1) + ' in, made bigger. Measure each arrow to the nearest ' + t('\\tfrac{1}{16}') + ' in and to the nearest ' + t('\\tfrac{1}{8}') + ' in.'; },
        shared: function (r) { return { w: r.pick([1, 3, 4, 5]), pts: nearPts(r, ['R', 'S']) }; }, parts: [
        { id: '9', level: 'PRG', make: function (r, sh) { return nearestPart(sh.w, sh.pts, ruler({ a: sh.w, b: sh.w + 1, ppi: 420, marks: sh.pts.map(function (p) { return { x: sh.w + (p.k + p.d) / 16, label: p.lab }; }) })); } }] },
      { num: '10', outcome: 'M3', stem: function (sh) { return 'Read each arrow on this part of a tape measure. Write it in inches, then in feet and inches.' + ruler({ a: sh.s, b: sh.s + 6, tape: true, marks: sh.ar.map(function (x, i) { return { x: x / 16, label: 'ABC'.charAt(i) }; }) }); },
        shared: function (r) { var F = r.pick([24, 36, 48]), s = F - r.pick([4, 5]); if (s === 22) s = 19; return { F: F, s: s, ar: tapeArrows(r, s, F) }; }, parts: [
        { id: '10A', sub: 'A', level: 'EMG', make: function (r, sh) { return tapeRead('Arrow <b>A</b>', sh.ar[0], sh.F, { text: 'tape A' }); } },
        { id: '10B', sub: 'B', level: 'EMG', make: function (r, sh) { return tapeRead('Arrow <b>B</b>', sh.ar[1], sh.F, { text: 'tape B' }); } },
        { id: '10C', sub: 'C', level: 'PRG', make: function (r, sh) { return tapeRead('Arrow <b>C</b>', sh.ar[2], sh.F, { text: 'tape C' }); } }] },
      { num: '11', outcome: 'M2', stem: function (sh) { return 'A socket set has these sizes: ' + r_ks(sh.ks) + '.'; },
        shared: function (r) { var j = r.int(2, 8), ks = [0, 1, 2, 3, 4, 5].map(function (i) { return j + i; }); return { ks: r.shuffle(ks), at: ks[r.int(1, 3)], who: r.pick(NAMES) }; }, parts: [
        { id: '11a', level: 'EMG', make: function (r, sh) { return orderSizes(r, sh.ks, '(a) Put them in order from smallest to largest.', 'smallest', 'largest'); } },
        { id: '11b', level: 'EMG', make: function (r, sh) { return nextSizeMC(r, sh.ks, sh.at, 1, '(b) The ' + t(sizeT(sh.at)) + ' socket is too small for a nut. Which socket should ' + sh.who + ' try next?'); } }] },
      { num: '12', outcome: 'M2', stem: function (sh) { return 'Four players on a basketball team are ' + andList(sh.p.map(function (x) { return x.name + ' ' + t(heightT(x.S)); })) + '.'; },
        shared: function (r) {
          return find(function () {
            var nm = r.sample(NAMES, 4), hi = r.sample([0, 4, 8, 12, 16, 20, 24, 32], 2), lo = [r.pick([8, 9]) * 16 + r.pick([0, 8, 12]), 11 * 16 + r.pick([0, 0, 4, 8])];
            var p = [{ name: nm[0], S: 6 * 192 + hi[0] }, { name: nm[1], S: 6 * 192 + hi[1] }, { name: nm[2], S: 5 * 192 + lo[0] }, { name: nm[3], S: 5 * 192 + lo[1] }];
            return { p: r.shuffle(p) };
          }, function (v) { var d = v.p.map(function (x) { return Math.abs(x.S - 6 * 192); }).sort(function (a, b) { return a - b; }); return d[1] - d[0] >= 4; }, { p: [{ name: 'Amara', S: 5 * 192 + 136 }, { name: 'Kai', S: 6 * 192 + 16 }, { name: 'Noor', S: 5 * 192 + 176 }, { name: 'Wes', S: 6 * 192 + 12 }] });
        }, parts: [
        { id: '12a', level: 'EMG', make: function (r, sh) { var srt = sh.p.slice().sort(function (a, b) { return b.S - a.S; });
          return P.order(r, '(a) Order them from tallest to shortest.', srt.map(function (x) { return { id: x.name, html: x.name + ' ' + t(heightT(x.S)) }; }), { first: 'tallest', last: 'shortest', why: function () { return 'Compare the feet first. Only when the feet are the same, compare the inches.'; } },
            'Compare the feet first, then the inches.<br>6 ft: ' + srt.filter(function (x) { return x.S >= 1152; }).map(function (x) { return x.name + ' (' + t(inT(x.S - 1152)) + ' in)'; }).join(' &gt; ') + '<br>5 ft: ' + srt.filter(function (x) { return x.S < 1152; }).map(function (x) { return x.name + ' (' + t(inT(x.S - 960)) + ' in)'; }).join(' &gt; ') + '<br>' + srt.map(function (x) { return x.name; }).join(', ') + '.',
            ['Anyone who is 6 ft and something is taller than anyone who is 5 ft and something.'], 'order heights'); } },
        { id: '12b', level: 'PRG', make: function (r, sh) {
          var d = sh.p.map(function (x) { return x.S - 1152; }), best = 0; d.forEach(function (x, i) { if (Math.abs(x) < Math.abs(d[best])) best = i; });
          function desc(i) { var x = d[i]; return x >= 0 ? t(inT(x)) + ' in over 6 ft' : t(inT(-x)) + ' in under 6 ft'; }
          return P.mc(r, '(b) Who is closest to 6 ft tall?', sh.p.map(function (x, i) { return { html: x.name, right: i === best, why: i === best ? null : x.name + ' is ' + desc(i) + '. Find how far each player is from 6 ft (over or under).', code: 'p' + i }; }),
            sh.p.map(function (x, i) { return x.name + ': ' + desc(i); }).join('<br>') + '<br><b>' + sh.p[best].name + '</b> is closest to 6 ft.', ['For each player, how many inches over or under 6 ft? (5 ft 11 in is 1 in under.)'], 'closest 6 ft');
        } }] },
      { num: '13', outcome: 'M3', stem: function (sh) { return sh.who + ' is reading a ruler marked in sixteenths. The arrow is on the ' + sh.k + 'th line past the ' + sh.w + '. He says the length is ' + t(sh.w + '\\frac{' + sh.k + '}{8}') + ' in.'; },
        shared: function (r) { return { who: r.pick(['Jayden', 'Malik', 'Theo', 'Cody', 'Omar']), w: r.int(1, 5), k: r.pick([4, 6, 10, 12, 14]) }; }, parts: [
        { id: '13a', level: 'EMG', make: function (r, sh) {
          return P.mc(r, '(a) What did he do wrong?', [
            { html: 'Each line on this ruler is ' + t('\\frac{1}{16}') + ' in, but he counted the lines as eighths.', right: true },
            { html: 'He should have counted the lines back from ' + (sh.w + 1) + '.', why: 'Counting from the whole inch on the left (' + sh.w + ') is right. The problem is the size of each space.', code: 'from-right' },
            { html: 'He should have written ' + t(sh.k + '\\frac{' + sh.w + '}{8}') + '.', why: 'The whole inches (' + sh.w + ') come first. The problem is the bottom of the fraction.', code: 'swap' },
            { html: 'Nothing: ' + t(sh.w + '\\frac{' + sh.k + '}{8}') + ' in is right.', why: 'The ruler is marked in <b>sixteenths</b>, so ' + sh.k + ' lines is ' + t('\\frac{' + sh.k + '}{16}') + ', not ' + t('\\frac{' + sh.k + '}{8}') + '.', code: 'nothing' }],
            'Each line on this ruler is ' + t('\\frac{1}{16}') + ' in, not ' + t('\\frac{1}{8}') + ' in. ' + sh.k + ' lines past ' + sh.w + ' is ' + t(sh.w + '\\frac{' + sh.k + '}{16}') + ' in.', ['How big is each space on a ruler marked in sixteenths?'], 'Jayden mistake');
        } },
        { id: '13b', level: 'EMG', make: function (r, sh) { var S = sh.w * 16 + sh.k; return inPart('(b) What is the right length?', S, { bad: [[sh.w * 16 + 2 * sh.k, 'u3t-eighths', 'That’s his answer. Each line is ' + t('\\frac{1}{16}') + ' in, so ' + sh.k + ' lines is ' + t('\\frac{' + sh.k + '}{16}') + '. Then simplify.']],
          sol: sh.k + ' lines past ' + sh.w + ' is ' + t(sh.w + '\\frac{' + sh.k + '}{16}') + ' in.<br>In simplest form, ' + t('\\frac{' + sh.k + '}{16}=' + frIn(sh.k)) + ', so the length is ' + t(inU(S)) + '.' + (sh.k * 2 < 16 ? ' (' + t(sh.w + '\\frac{' + sh.k + '}{8}=' + inT(sh.w * 16 + 2 * sh.k)) + ' in is much longer.)' : ''), hints: ['Write ' + sh.k + ' sixteenths, then simplify.'], text: 'right length' }); } }] },
      { num: '14', outcome: 'M3', stem: '', parts: [
        { id: '14', level: 'PRG', make: function (r) {
          var v = find(function () { var a = r.int(10, 20) * 16 + r.pick([4, 12, 8]), b = a + r.int(5, 9) * 16 + r.pick([2, 6, 10]); return [a, b]; }, function (v) { return v[1] % 16 >= v[0] % 16 && mix(v[1]).d === 8 && mix(v[0]).d <= 4 && !(v[0] === 244 && v[1] === 362); }, [212, 330]);
          var a = v[0], b = v[1], L = b - a, nm = r.pick(['Rosa', 'Hana', 'Brooke', 'Elena', 'Gwen']);
          return inPart(nm + ' is cutting baseboard. She hooks her tape on the end of a long strip and makes two pencil marks, at ' + t(inU(a)) + ' and at ' + t(inU(b)) + '. How long is the piece between the marks?', L,
            { bad: subBad(a, b), sol: subSol(a, b) + '<br>Check: ' + t(inT(a) + '+' + inT(L) + '=' + inT(b)) + ' ✓<br>The piece is ' + t(inU(L)) + ' long.', hints: ['Length between the marks = bigger mark − smaller mark.', 'Write both fractions with the same bottom number first.'], text: 'between marks' });
        } }] },
      { num: '15', outcome: 'M2', stem: 'Canada uses SI units.', parts: [
        { id: '15a', level: 'BEG', make: function (r) {
          var good = r.sample(['lumber (a “2 by 4”)', 'sheets of plywood (4 ft by 8 ft)', 'people’s heights', 'TV screens', 'tire and wheel sizes', 'plumbing pipe', 'a CFL football field'], 2), si = ['highway speed signs in Canada', 'gas sold by the litre', 'a 100 m race', 'the distance to the next town on a Canadian road sign', 'the weather forecast'];
          var bad = r.sample(si, 3);
          return P.mc(r, '(a) Which gives two places where Canadians still use imperial lengths?', [{ html: cap(good[0]) + ' and ' + good[1], right: true },
            { html: cap(bad[0]) + ' and ' + good[0], why: cap(bad[0]) + ' use' + (/signs|forecast/.test(bad[0]) ? '' : 's') + ' SI units in Canada.', code: 'si1' },
            { html: cap(bad[1]) + ' and ' + bad[2], why: 'Both of those use SI units in Canada.', code: 'si2' },
            { html: cap(good[1]) + ' and ' + bad[1], why: cap(bad[1]) + ' use' + (/signs|forecast/.test(bad[1]) ? '' : 's') + ' SI units in Canada.', code: 'si3' }],
            'For example: lumber and plywood (a 2 by 4, 4 ft by 8 ft sheets), people’s heights, TV screens, wheels, plumbing pipe, CFL fields.', ['Think of building supplies, heights, screens, wheels and football.'], 'imperial places');
        } },
        { id: '15b', level: 'BEG', make: function (r) {
          return P.mc(r, '(b) Why should someone who wants to work in a trade know how to read an imperial tape measure?', [
            { html: 'Carpenters, plumbers and many other trades measure in feet and inches, and many tools and plans use imperial sizes.', right: true },
            { html: 'Imperial measurements are always more exact than SI measurements.', why: 'Neither system is more exact; a millimetre is even smaller than a sixteenth of an inch. The reason is what the job uses.', code: 'exact' },
            { html: 'Canadian law says that trades must use imperial units.', why: 'Canada’s official system is SI. Trades use imperial because of the materials, tools and plans.', code: 'law' },
            { html: 'SI tape measures can’t measure long lengths.', why: 'SI tapes measure long lengths just fine. Think about what the materials and plans on a job site use.', code: 'long' }],
            'Builders, carpenters, plumbers and many other trades measure in feet and inches; lumber, plywood, pipe and many tools come in imperial sizes.', ['What units are used for lumber, plywood and pipe?'], 'why trades');
        } }] },
      { num: '16', outcome: 'M2', stem: '', parts: [
        { id: '16', level: 'EMG', make: function (r) {
          var w = r.int(2, 6), km = r.pick([12, 14, 8]), ks = [km, km - 1, km - 2, km === 8 ? 5 : km - 5];
          var opts = ks.map(function (k, i) { return { html: t(w + frIn(k) + '\\text{ in}'), right: i === 0, why: i === 0 ? null : i === 1 ? 'It has the biggest numbers, but change all to sixteenths: ' + t(frIn(k) + '=\\frac{' + k + '}{16}') + ' and ' + t(frIn(km) + '=\\frac{' + km + '}{16}') + '.' : 'Change all four fractions to sixteenths, then compare the tops.', code: 'k' + k }; });
          return P.mc(r, 'Which length is the longest?', opts, 'In sixteenths: ' + ks.map(function (k) { return t(w + '\\frac{' + k + '}{16}'); }).join(', ') + '.<br>' + t(w + frIn(km) + '\\text{ in}') + ' is the longest. (' + t(w + frIn(km - 1)) + ' has the biggest numbers but is not the longest.)', ['Change every fraction to sixteenths.'], 'longest');
        } }] },
      { num: '17', outcome: 'M3', stem: '', parts: [
        { id: '17', level: 'EMG', make: function (r) {
          var v = find(function () { var m = r.int(2, 5), rr = r.int(1, 9) * 16 + r.pick([4, 8, 12, 2, 6]); return { m: m, rr: rr }; }, function (v) { var X = v.m * 192 + v.rr, tens = Math.floor(X / 160), units = Math.floor(X / 16) % 10; if (!(v.rr / 16 + 2 * v.m < 11.5 && units < 12 && tens !== v.m && !(v.m === 3 && v.rr === 84))) return false; var os = [v.m * 192 + v.rr, tens * 192 + units * 16 + X % 16, v.m * 192 + v.rr + 32 * v.m, (v.m + 1) * 192 + v.rr].map(String); return os.filter(function (x, i) { return os.indexOf(x) === i; }).length === 4; }, { m: 2, rr: 100 });
          var X = v.m * 192 + v.rr, fr = X % 16, tens = Math.floor(X / 160), units = Math.floor(X / 16) % 10;
          var opts = [{ html: t(ftinT(X)), right: true }, { html: t(tens + "'\\," + inT(units * 16 + fr) + "''"), why: 'That reads the digits of ' + Math.floor(X / 16) + ' as feet and inches. A foot is 12 in, so find how far past the ' + v.m + 'F tag it is.', code: 'digits' },
            { html: t(v.m + "'\\," + inT(X - v.m * 160) + "''"), why: 'That takes away 10 in for each foot. A foot is <b>12</b> in: the ' + v.m + 'F tag is at ' + 12 * v.m + ' in.', code: 'u3t-ten' },
            { html: t((v.m + 1) + "'\\," + inT(v.rr) + "''"), why: 'The reading is past the ' + v.m + 'F tag, not the ' + (v.m + 1) + 'F tag, so it is ' + v.m + ' ft and some inches.', code: 'u3l3-next-tag' }];
          return P.mc(r, 'A tape measure shows ' + t(inU(X)) + '. The ' + v.m + 'F tag is at ' + 12 * v.m + ' in. In feet and inches, this length is', opts,
            t(inT(X) + '-' + 12 * v.m + '=' + inT(v.rr)) + ', so it is ' + t(inT(v.rr)) + ' in past ' + v.m + 'F: ' + t(ftinT(X)) + '.', ['How far past the ' + v.m + 'F tag (' + 12 * v.m + ' in) is it?'], 'tape to ft in');
        } }] },
      { num: '18', outcome: 'M3', stem: '', parts: [
        { id: '18', level: 'EMG', make: function (r) {
          var v = find(function () { return r.int(1, 3) * 16 + r.pick([4, 12, 8, 6, 10, 2, 14]); }, function (s) { return s !== 28 || true; }, 44), m = mix(v);
          return num('How many sixteenths of an inch are in ' + t(inU(v)) + '?', v, { nr: true, bad: [[m.w * 16 + m.n, 'u3l3-not-16', 'Change the fraction part to sixteenths too: ' + t(frT(m.n, m.d) + '=\\frac{' + (v % 16) + '}{16}') + '.'], [v % 16, 'u3l3-no-whole', 'Don’t forget the whole inches: each inch is ' + t('\\frac{16}{16}') + '.'], [m.w * 10 + v % 16, 'u3l3-not-16', 'One inch is 16 sixteenths, not 10.']],
            sol: m.w + ' in ' + t('=\\frac{' + m.w * 16 + '}{16}') + ' and ' + t(frT(m.n, m.d) + '=\\frac{' + (v % 16) + '}{16}') + ', so ' + t(inT(v) + '=\\frac{' + v + '}{16}') + ': ' + v + ' sixteenths.', hints: ['One inch is 16 sixteenths.', 'Change the fraction part to sixteenths, then add.'], text: 'NR sixteenths' });
        } }] },
      { num: '19', outcome: 'M3', stem: '', parts: [
        { id: '19', level: 'BEG', make: function (r) {
          var n = r.pick([3, 4, 6, 7, 8, 9, 5]), w = ['', 'first', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th'][n];
          return num('The red numbers on a tape measure mark wall studs every 16 in: 16, 32, … What is the ' + w + ' red number?', 16 * n, { nr: true, bad: [[12 * n, 'u3l3-foot-tags', 'That counts by 12 (the foot tags). The red numbers go up by <b>16</b>.'], [16 * (n - 1), 'u3l3-off', 'The first red number is 16, so the ' + w + ' one is ' + n + ' × 16.'], [16 + n, 'u3l3-off', 'Multiply: the ' + w + ' red number is ' + n + ' × 16.']],
            sol: t(n + '\\times 16=' + 16 * n) + '. (' + [1, 2, 3, 4, 5, 6, 7, 8, 9].slice(0, n).map(function (i) { return 16 * i; }).join(', ') + '.)', hints: ['Count by 16s.'], text: 'NR red number' });
        } }] }],
    extra: [
      { num: '1', section: 'A. Skills', outcome: 'M2', stem: '', parts: [
        { id: 'A1', level: 'BEG', make: function (r) {
          var all = [['12 ___ = 1 ft', 'in'], ['3 ft = 1 ___', 'yd'], ['36 ___ = 1 yd', 'in'], ['5280 ___ = 1 mi', 'ft'], ['1760 yd = 1 ___', 'mi'], ['1 yd = 3 ___', 'ft'], ['1 mi = 1760 ___', 'yd'], ['1 ft = 12 ___', 'in'], ['36 in = 1 ___', 'yd'], ['5280 ft = 1 ___', 'mi']];
          var pk = find(function () { return r.sample(all, 5); }, function (v) { var u = {}; v.forEach(function (x) { u[x[1]] = 1; }); return Object.keys(u).length >= 4; }, all.slice(0, 5));
          var rows = pk.map(function (x, i) { return { id: 'r' + i, html: x[0] }; }), want = {}; pk.forEach(function (x, i) { want['r' + i] = x[1]; });
          return P.grid('Fill in the missing unit.', rows, [{ id: 'in', html: 'in' }, { id: 'ft', html: 'ft' }, { id: 'yd', html: 'yd' }, { id: 'mi', html: 'mi' }], want,
            { rowHead: 'Fact', why: function () { return { code: 'u3l3-wrong-fact', hint: 'Use the facts: 12 in = 1 ft, 3 ft = 1 yd, 36 in = 1 yd, 5280 ft = 1760 yd = 1 mi.' }; } }, pk.map(function (x) { return x[0].replace('___', '<b>' + x[1] + '</b>'); }).join('<br>'), ['12 in = 1 ft, 3 ft = 1 yd, 36 in = 1 yd, 5280 ft = 1 mi, 1760 yd = 1 mi.'], 'missing unit');
        } }] },
      { num: '2', outcome: 'M2', stem: 'Fractions of an inch.', parts: [
        { id: 'A2a', level: 'BEG', make: function (r) {
          var ks = r.sample([2, 4, 6, 10, 12, 14], 4);
          var p = P.fields('(a) Write in simplest form.', ks.map(function (k, i) { return { label: t('\\dfrac{' + k + '}{16}') + ' =', name: k + '/16', mode: 'math', keys: 'u3mixed', placeholder: PH }; }), ks.map(function (k) { return inChk(k, {}); }), ks.map(frIn), ks.map(function (k) { return t('\\frac{' + k + '}{16}=' + frIn(k)); }).join(' &nbsp; '),
            ks.map(function (k) { var g = gcd(k, 16); return t('\\frac{' + k + '}{16}=\\frac{' + k + '\\div ' + g + '}{16\\div ' + g + '}=' + frIn(k)); }).join('<br>'), ['Divide the top and bottom by the same number until you can’t any more.'], 'simplest A2');
          p.bad = [ks.map(function (k) { return '\\frac{' + k + '}{16}'; })]; return p;
        } },
        { id: 'A2b', level: 'BEG', make: function (r) {
          var pk = r.shuffle([r.pick([2, 6, 10, 14]), r.pick([4, 12]), r.pick([3, 5, 7, 9, 11, 13]), 8]).slice(0, r.pick([3, 4]));
          var nm = function (k) { return k % 2 ? 's' : k % 4 ? 'e' : k % 8 ? 'q' : 'h'; };
          var rows = pk.map(function (k, i) { return { id: 'r' + i, html: t(frIn(k)) }; }), want = {}; pk.forEach(function (k, i) { want['r' + i] = nm(k); });
          return P.grid('(b) What kind of line is it on a ruler?', rows, [{ id: 'h', html: 'half' }, { id: 'q', html: 'quarter' }, { id: 'e', html: 'eighth' }, { id: 's', html: 'sixteenth' }], want,
            { rowHead: 'Fraction', why: function (row) { var k = pk[+row.slice(1)]; return { code: 'u3l3-line', hint: t(frIn(k)) + ' in simplest form has ' + frac16(k)[1] + ' on the bottom, so it is a' + ({ h: ' half', q: ' quarter', e: 'n eighth', s: ' sixteenth' })[nm(k)] + ' line.' }; } },
            pk.map(function (k) { return t(frIn(k)) + ': ' + ({ h: 'half', q: 'quarter', e: 'eighth', s: 'sixteenth' })[nm(k)] + ' line'; }).join('<br>'), ['Look at the bottom number in simplest form: 2 → half, 4 → quarter, 8 → eighth, 16 → sixteenth.'], 'line kind');
        } }] },
      { num: '3', outcome: 'M3', stem: 'This is one inch, made bigger. Write the fraction at each arrow in simplest form.', parts: [
        { id: 'A3', level: 'EMG', make: function (r) { var ks = inOneInch(r, 6); return arrowsPart(ruler({ a: 0, b: 1, marks: ks.map(function (k, i) { return { x: k / 16, label: LET.charAt(i) }; }) }), ks, { text: 'one inch A3' }); } }] },
      { num: '4', outcome: 'M3', stem: 'Read the length at each arrow.', parts: [
        { id: 'A4', level: 'EMG', make: function (r) { var ss = perInch(r, 0, 6, ['16', '16', '8', '4', '2', '8'], EX_READ.concat([14, 24, 37, 60, 66, 91])); return arrowsPart(ruler({ a: 0, b: 6, marks: ss.map(function (s, i) { return { x: s / 16, label: LET.charAt(i) }; }) }), ss, { text: 'ruler A4' }); } }] },
      { num: '5', outcome: 'M2', stem: 'Write each length with symbols or in words.', parts: [
        { id: 'A5a', level: 'BEG', make: function (r) { var f = r.int(5, 9), i = r.pick([1, 2, 4, 6, 8, 10]); return symMC(r, f, i * 16, '(a) Write ' + f + ' feet ' + i + ' inch' + (i === 1 ? '' : 'es') + ' using the symbols ' + t("'") + ' and ' + t("''") + '.'); } },
        { id: 'A5b', level: 'BEG', make: function (r) { var f = r.int(4, 6), S = r.int(1, 9) * 16 + r.pick([4, 8, 12]); return symMC(r, f, S, '(b) Write ' + f + ' feet ' + inWords(S) + ' using the symbols.'); } },
        { id: 'A5c', level: 'BEG', make: function (r) { return wordsMC(r, r.pick([7, 11, 12, 15, 20]), null, '(c)'); } },
        { id: 'A5d', level: 'BEG', make: function (r) { return wordsMC(r, r.int(3, 7), r.int(1, 10) * 16 + r.pick([4, 8, 12]), '(d)'); } }] },
      { num: '6', section: 'B. Applying', outcome: 'M3', stem: 'How long is each object?', shared: function (r) {
          return find(function () { var a = r.int(2, 3) * 16 + kOf(r, '16'), bs = r.int(3, 4) * 16 + r.pick([4, 8, 12]), L = r.chance(0.7) ? r.int(1, 2) * 16 : r.int(1, 2) * 16 + r.pick([4, 8]); return { a: a, bs: bs, be: bs + L }; },
            function (v) { return v.bs - v.a >= 4 && v.be <= 94 && !(v.a === 53 && v.bs === 60); }, { a: 51, bs: 56, be: 88 }); }, parts: [
        { id: 'B6', level: 'PRG', make: function (r, sh) {
          var pic = ruler({ a: 0, b: 6, objs: [{ x1: 0, x2: sh.a / 16, label: '(a) a nail', level: 0 }, { x1: sh.bs / 16, x2: sh.be / 16, label: '(b) a hinge', level: 0 }] }), L = sh.be - sh.bs;
          var p = P.fields(pic, [{ label: '(a) nail:', after: 'in', name: '(a)', mode: 'math', keys: 'u3mixed', placeholder: PH }, { label: '(b) hinge:', after: 'in', name: '(b)', mode: 'math', keys: 'u3mixed', placeholder: PH }],
            [inChk(sh.a, { bad: cleanS(rulerBad(sh.a), sh.a), tenths: true }), inChk(L, { bad: [[sh.be, 'u3l3-from-zero', 'The hinge starts at ' + t(inU(sh.bs)) + ', not at 0. Take away the starting mark.']].concat(subBad(sh.bs, sh.be)) })],
            [inT(sh.a), inT(L)], '(a) ' + t(inU(sh.a)) + ' &nbsp; (b) ' + t(inU(L)), '(a) ' + readSol(sh.a) + '<br>(b) From ' + t(inU(sh.bs)) + ' to ' + t(inU(sh.be)) + ':<br>' + subSol(sh.bs, sh.be), ['(b) doesn’t start at 0: length = end − start.'], 'B6 objects');
          p.bad = [[inT(sh.be), inT(sh.a)]]; return p;
        } }] },
      { num: '7', outcome: 'M3', stem: function (sh) { return 'Read each arrow on this part of a tape measure. Write it in inches, then in feet and inches if it is 12 in or more.' + ruler({ a: sh.s, b: sh.s + 6, tape: true, marks: sh.ar.map(function (x, i) { return { x: x / 16, label: 'ABC'.charAt(i) }; }) }); },
        shared: function (r) { var s = r.pick([9, 10]); return find(function () { return { s: s, ar: [11 * 16 + kOf(r, r.pick(['2', '4', '8'])), r.int(12, 13) * 16 + kOf(r, r.pick(['8', '16'])), r.int(14, s + 5) * 16 + kOf(r, r.pick(['4', '8', '16']))] }; }, function (v) { return v.ar[2] - v.ar[1] >= 20 && v.ar[2] <= (s + 6) * 16 - 4 && !(v.ar[0] === 184 && v.ar[1] === 210); }, { s: 10, ar: [180, 197, 236] }); }, parts: [
        { id: 'B7A', sub: 'A', level: 'EMG', make: function (r, sh) { var S = sh.ar[0]; return inPart('Arrow <b>A</b> (less than 12 in, so inches only)', S, { bad: rulerBad(S), tenths: true, sol: readSol(S) + ' It is less than 1 ft.', hints: ['Read it like a ruler: the last number passed, then the sixteenths.'], text: 'B7 A' }); } },
        { id: 'B7B', sub: 'B', level: 'PRG', make: function (r, sh) { return tapeRead('Arrow <b>B</b>', sh.ar[1], 12, { text: 'B7 B' }); } },
        { id: 'B7C', sub: 'C', level: 'PRG', make: function (r, sh) { return tapeRead('Arrow <b>C</b>', sh.ar[2], 12, { text: 'B7 C' }); } }] },
      { num: '8', outcome: 'M3', stem: function (sh) { return 'This is the part of a ruler from ' + sh.w + ' in to ' + (sh.w + 1) + ' in, made bigger. Measure each arrow to the nearest ' + t('\\tfrac{1}{16}') + ' in and to the nearest ' + t('\\tfrac{1}{8}') + ' in.'; },
        shared: function (r) { return { w: r.pick([1, 2, 3, 5]), pts: nearPts(r, ['G', 'H'], true) }; }, parts: [
        { id: 'B8', level: 'PRG', make: function (r, sh) { return nearestPart(sh.w, sh.pts, ruler({ a: sh.w, b: sh.w + 1, ppi: 420, marks: sh.pts.map(function (p) { return { x: sh.w + (p.k + p.d) / 16, label: p.lab }; }) })); } }] },
      { num: '9', outcome: 'M2', stem: function (sh) { return 'A carpenter’s drill bits are ' + r_ks(sh.ks) + '.'; },
        shared: function (r) { var j = r.int(2, 7), ks = [0, 1, 2, 3, 4].map(function (i) { return j + i; }); return { ks: r.shuffle(ks), at: ks[r.int(1, 4)] }; }, parts: [
        { id: 'B9a', level: 'EMG', make: function (r, sh) { return orderSizes(r, sh.ks, '(a) Put them in order from smallest to largest.', 'smallest', 'largest'); } },
        { id: 'B9b', level: 'EMG', make: function (r, sh) { return nextSizeMC(r, sh.ks, sh.at, -1, '(b) Before putting in a ' + t(sizeT(sh.at)) + ' screw, she drills a hole one size smaller than the screw. Which bit does she use?'); } }] },
      { num: '10', outcome: 'M3', shared: function (r) {
          return find(function () { var door = r.pick([[7, 0], [6, 8], [7, 6], [8, 0]]), D0 = door[0] * 192 + door[1] * 16, fits = r.chance(0.75), gap = r.pick([4, 8, 12, 16, 20, 24, 28, 6, 10]); return { door: D0, van: fits ? D0 - gap : D0 + gap, fits: fits, gap: gap, who: r.pick(['Lucas', 'Arjun', 'Faisal', 'Wes', 'Kenzie']) }; },
            function (v) { return v.van % 192 !== 0 && !(v.door === 1344 && v.van === 1320); }, { door: 1344, van: 1316, fits: true, gap: 28, who: 'Arjun' }); },
        stem: function (sh) { return 'A garage door opening is ' + t(ftinT(sh.door)) + ' high. ' + sh.who + '’s van with a roof rack is ' + t(ftinT(sh.van)) + ' high.'; }, parts: [
        { id: 'B10a', level: 'EMG', make: function (r, sh) {
          return P.mc(r, '(a) Will the van fit through the door?', [{ html: sh.fits ? 'Yes — the van is shorter than the opening.' : 'No — the van is taller than the opening.', right: true },
            { html: sh.fits ? 'No — the van is taller than the opening.' : 'Yes — the van is shorter than the opening.', why: 'Compare the feet first, then the inches: the door is ' + t(ftinT(sh.door)) + ' and the van is ' + t(ftinT(sh.van)) + '.', code: 'fit' },
            { html: 'You can’t tell, because the two heights use different numbers of feet.', why: 'You can compare them: change both to inches past the same number of feet.', code: 'cant' }],
            'Door ' + t(ftinT(sh.door)) + ', van ' + t(ftinT(sh.van)) + ': the van is ' + (sh.fits ? 'shorter, so it fits.' : 'taller, so it does not fit.'), ['Compare the feet first, then the inches.'], 'van fits', true);
        } },
        { id: 'B10b', level: 'PRG', make: function (r, sh) {
          var hi = Math.max(sh.door, sh.van), lo = Math.min(sh.door, sh.van), base = Math.floor(lo / 192) * 192;
          return inPart(sh.fits ? '(b) How much room is there to spare?' : '(b) By how much is the van too tall?', sh.gap, { bad: [[(hi % 192) + (lo % 192), 'u3l3-added', 'Subtract the two heights; don’t add them.'], [Math.abs((hi % 192) - (lo % 192)), 'u3l3-across', 'The two heights have different numbers of feet. Write both as inches past ' + base / 192 + ' ft first.']],
            sol: 'Both are at least ' + base / 192 + ' ft. Past ' + base / 192 + ' ft: ' + t(ftinT(hi)) + ' is ' + t(inT(hi - base)) + ' in and ' + t(ftinT(lo)) + ' is ' + t(inT(lo - base)) + ' in.<br>' + t(inT(hi - base) + '-' + inT(lo - base) + '=' + inT(sh.gap)) + ' in.<br>' + (sh.fits ? 'The van fits with ' + t(inU(sh.gap)) + ' to spare.' : 'The van is ' + t(inU(sh.gap)) + ' too tall.'),
            hints: ['Write both heights as inches past the same number of feet.', 'Then subtract.'], text: 'van gap' });
        } }] },
      { num: '11', outcome: 'M3', stem: '', parts: [
        { id: 'B11', level: 'BEG', make: function (r) {
          var w = r.int(1, 5), k = r.pick([3, 5, 7]), opts = [[w * 16 + k, true, null], [w * 16 + 2 * k, false, 'Each line on this ruler is ' + t('\\frac{1}{16}') + ' in, not ' + t('\\frac{1}{8}') + ' in.'], [k * 16 + w, false, 'The whole inches come first: the arrow is past the ' + w + '.'], [w * 16 + 8, false, 'Count the lines: ' + k + ' sixteenths is not a half.']];
          return P.mc(r, 'On a ruler marked in sixteenths, an arrow is on the ' + k + 'th line past the ' + w + '. The length is', opts.map(function (o, i) { return { html: t(inU(o[0])), right: o[1], why: o[2], code: 'o' + i }; }),
            'Each line is ' + t('\\frac{1}{16}') + ' in, so ' + k + ' lines past ' + w + ' is ' + t(inU(w * 16 + k)) + '.', ['How big is each space on a ruler marked in sixteenths?'], 'line count MC', true);
        } }] },
      { num: '12', outcome: 'M3', stem: '', parts: [
        { id: 'B12', level: 'EMG', make: function (r) {
          var a = r.int(1, 4), d = r.pick([20, 24, 28, 36, 40, 18, 22]), b = a * 16 + d;
          return num('How many ' + t('\\tfrac{1}{16}') + ' in spaces are there from the ' + a + ' in line to the ' + t(inU(b)) + ' line?', d, { nr: true, bad: [[b, 'u3l3-from-zero', 'Start counting at the ' + a + ' in line, not at 0.'], [Math.floor(d / 16) * 16 + mix(d).n, 'u3l3-not-16', 'Change the fraction part to sixteenths.']],
            sol: 'From ' + a + ' to ' + t(inT(b)) + ' is ' + t(inU(d)) + '. ' + t(inT(d) + '=\\frac{' + d + '}{16}') + ', so ' + d + ' spaces.', hints: ['How long is it from ' + a + ' in to ' + t(inU(b)) + '?', 'Change that length to sixteenths.'], text: 'NR spaces' });
        } }] },
      { num: '13', section: 'C. Stretch', outcome: 'M3', stem: '', parts: [
        { id: 'C13', level: 'MAS', make: function (r) {
          var W = find(function () { return r.int(3, 9) * 16 + r.pick([4, 12, 2, 6, 10, 14]); }, function (s) { return s !== 92 && (Math.floor(s / 16) % 2 === 1); }, 76), H = W / 2, nm = r.pick(['Maya', 'Leah', 'Noor', 'Jaya']);
          var w = Math.floor(W / 16), fr = W % 16;
          return inPart(nm + ' wants to drill a hole in the centre of a shelf that is ' + t(inU(W)) + ' wide. How far from the edge should she mark the centre?', H, { improperOk: false,
            bad: [[Math.floor(w / 2) * 16 + fr / 2, 'u3l3-halves', 'Half of ' + w + ' is not ' + Math.floor(w / 2) + ': it is ' + t(Math.floor(w / 2) + '\\frac{1}{2}') + '. Change the whole length to sixteenths first, then halve it.'], [W * 2, 'u3l3-doubled', 'The centre is <b>half</b> the width: divide by 2.'], [Math.floor(w / 2) * 16 + fr, 'u3l3-halves', 'Halve the fraction part too.']],
            sol: 'Half of ' + t(inT(W)) + ': ' + t(inT(W) + '=\\frac{' + W + '}{16}') + ', ' + t('\\frac{' + W + '}{16}\\div 2=\\frac{' + H + '}{16}=' + inT(H)) + ' in.<br>Check: ' + t(inT(H) + '+' + inT(H) + '=' + inT(W)) + ' ✓<br>She marks the centre ' + t(inU(H)) + ' from the edge.',
            hints: ['The centre is half the width.', 'Change the width to sixteenths, divide by 2, then write it as a mixed number.'], text: 'centre' });
        } }] },
      { num: '14', outcome: 'M3', stem: '', parts: [
        { id: 'C14', level: 'MAS', make: function (r) {
          var v = find(function () { var a = r.int(20, 30) * 16 + r.pick([3, 5, 7, 9, 11, 13]), b = (Math.floor(a / 16) + r.int(5, 9)) * 16 + r.pick([4, 8, 12]); return [a, b]; }, function (v) { return v[1] - v[0] > 64 && !(v[0] === 451 && v[1] === 568); }, [453, 584]);
          var a = v[0], b = v[1], L = b - a, nm = r.pick(['Owen', 'Cody', 'Malik', 'Tyler']);
          return inPart(nm + ' hooks his tape on the end of a pipe and marks it at ' + t(inU(a)) + ' and at ' + t(inU(b)) + '. How long is the piece between the marks?', L,
            { bad: subBad(a, b), sol: subSol(a, b) + '<br>Check: ' + t(inT(a) + '+' + inT(L) + '=' + inT(b)) + ' ✓<br>The piece is ' + t(inU(L)) + ' long.', hints: ['Length = bigger mark − smaller mark.', 'Write both fractions in sixteenths. If the top fraction is smaller, borrow 1 in = ' + t('\\frac{16}{16}') + '.'], text: 'pipe piece' });
        } }] },
      { num: '15', outcome: 'M3', stem: '', parts: [
        { id: 'C15', level: 'PRG', make: function (r) {
          var nm = r.pick(['Kira', 'Elena', 'Gwen', 'Brooke']);
          return P.mc(r, nm + ' notices that the hook on her new tape measure wiggles. She thinks the tape is broken. Why is the hook loose on purpose?', [
            { html: 'It slides by its own thickness, so the reading is right both when you hook it over an edge and when you push it against a wall.', right: true },
            { html: 'So the tape can be pulled out farther without breaking.', why: 'The hook doesn’t change how far the tape pulls out. Think about where the measurement starts when you hook it and when you push it.', code: 'farther' },
            { html: 'It is only loose on cheap tapes; a good tape has a tight hook.', why: 'Good tapes are made with a loose hook on purpose. It moves by exactly its thickness.', code: 'cheap' },
            { html: 'So you can read the tape in centimetres as well as inches.', why: 'The hook has nothing to do with the units. Compare hooking it over an edge with pushing it against a wall.', code: 'units' }],
            'The hook slides by its own thickness. Hooked over an edge, it pulls out so the measurement starts at the inside of the hook. Pushed against a wall, it slides in so the measurement starts at the outside. Both readings are right, so the tape is not broken.', ['What happens to the hook when you pull the tape over an edge, and when you push it against a wall?'], 'tape hook');
        } }] }]
  });
  function r_ks(ks) { return ks.map(function (k) { return t(sizeT(k)); }).join(', '); }
})(window);
