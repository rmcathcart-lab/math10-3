/* Math 10-3 · Unit 3 · Lesson 7 — Rearranging Formulas: Finding a Missing Side (A1; M3 for the plain perimeter parts)
 * Assignment 7 (u3_l07.tex, Questions 1–17) and the Lesson 7 Extra Practice (u3_ep07.tex: A Skills 1–5, B Applying 6–12,
 * C Stretch 13–15). Every part is a generator: the same formula, units and difficulty as the booklet item (a decimal
 * side, a quarter-inch mixed number, a radius from a circumference, a three-sided fence…), new numbers around the
 * booklet's (the booklet's own numbers can come up; the lesson's worked-example numbers are left out). Calculator allowed.
 * Answers: typed numbers (a unit typed after the number is ignored); rounding as the booklet asks (too many decimals or
 * too few gets a nudge, rounding the wrong way is wrong with a hint; π = 3.14 instead of the π key gets a nudge when it
 * changes the rounded answer); answers the booklet leaves exact must be exact. Quarter-inch answers with the mixed-number
 * keypad: a mixed number in simplest form or the exact decimal (3¾ or 3.75); an improper or unsimplified fraction gets a
 * nudge (no try used). Recognised wrong values each get their own hint: multiplying instead of dividing (× π, × 4),
 * dividing by π instead of 2π (the diameter instead of the radius), C ÷ 2 × π typed without brackets, subtracting one
 * length instead of two, forgetting Step 2 (both widths, not one), half the perimeter given as the width, only one of the
 * two known sides taken away, the barn wall fenced, money × price instead of ÷, the radius doubled after rounding, …
 * Conversions: "what undoes each operation" and the "fill in the blanks" rearranging → a matching grid (one choice per
 * row); "rearrange to find the letter shown" → multiple choice of formulas, one part per letter; the fill-in tables
 * (garden plots, circles) → the table input with the given cells shown and the blanks as boxes (the "Work" column is in
 * the worked solution); "check her answer, explain the mistake and find the correct value" → a number (the check), a
 * multiple choice of explanations, and the correct value; "correct or not correct" → multiple choice whose options give
 * the check; "explain why P = 6w" → multiple choice of explanations; numerical-response items → NR boxes.
 *
 * Shared kit for Lesson 3.8 (u3l8.js): HW.u3formula (number reader that ignores typed units, a rounding-aware checker
 * with targeted wrong values, number / multi-box / mixed-number / round-up / estimate / table part builders, quarter-inch
 * mixed numbers, key caps, small SVG helpers). Load this file BEFORE u3l8.js. Uses HW.pctKit (u1l7.js).
 * Outcome A1 (M3 for Q11(a) and Q12(a): a perimeter or a length of fence, no rearranging).
 * Levels: LIM BEG EMG PRG ADV MAS (MAS: Extra 13(b), Extra 14(b)). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, PK = HW.pctKit;
  if (!PK) throw new Error('u3l7.js needs HW.pctKit from js/lessons/u1l7.js');

  /* ======================= the Unit 3 formula kit (HW.u3formula) ======================= */
  var UF = HW.u3formula = HW.u3formula || {};
  function q(x) { return Math.round(x * 1e9) / 1e9; }
  function rd(x, dp) { return K.roundTo(x, dp); }
  function trunc(x, d) { var f = Math.pow(10, d); return Math.floor(x * f + 1e-9) / f; }
  function near(a, b, e) { return Math.abs(a - b) <= (e == null ? 1e-9 * Math.max(1, Math.abs(a), Math.abs(b)) : e); }
  function nS(x, dp) { x = q(x); return dp != null ? x.toFixed(dp) : String(x); }
  function decs(x) { return (nS(x).split('.')[1] || '').length; }
  function N(x, dp) { var s = nS(x, dp); return Math.abs(x) >= 10000 ? HW.fmt(s) : s; }                        // TeX: 24\,000
  function Np(x, dp) { var s = nS(x, dp); return Math.abs(x) >= 10000 ? HW.fmt(s, true).replace(/ /g, ' ') : s; }  // text: 24 000
  function raw(x, k) { var s = +x.toFixed(k == null ? 3 : k); return N(s) + (near(x, s) ? '' : '\\ldots'); }
  function eqR(x, dp) { return dp == null || near(x, rd(x, dp)) ? '=' + N(dp == null ? q(x) : rd(x, dp)) : '=' + raw(x, dp + 2) + '\\approx ' + N(rd(x, dp), dp); }
  function uT(s) { s = String(s || '').replace(/^ +/, ''); if (!s) return ''; return ('\\text{' + (s.charAt(0) === '/' ? '' : ' ') + s + '}').replace(/²/g, '}^2\\text{').replace(/\\text\{\}/g, ''); }
  function br(a) { return (Array.isArray(a) ? a : [a]).filter(Boolean).join('<br>'); }
  function find(gen, test, fb) { for (var i = 0; i < 800; i++) { var v = gen(); if (v && test(v)) return v; } if (fb === undefined) throw new Error('u3formula: no numbers found'); return fb; }
  function pickR(r, lo, hi, step) { step = step || 1; return q(lo + step * r.int(0, Math.round((hi - lo) / step))); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function M(x) { return '\\$' + rd(x, 2).toFixed(2); }
  function Mp(x) { return '$' + rd(x, 2).toFixed(2); }
  function placeWord(dp, money) { return money ? 'the nearest cent' : dp === 0 ? 'the nearest whole number' : dp === 1 ? 'the nearest tenth' : dp === 2 ? 'the nearest hundredth' : dp + ' decimal places'; }
  var NAMES = ['Amara', 'Kai', 'Malik', 'Noor', 'Jordan', 'Priya', 'Mateo', 'Kayla', 'Liam', 'Hana', 'Devon', 'Rosa', 'Theo', 'Aisha', 'Ben', 'Maya', 'Dani', 'Kenji', 'Sofia', 'Omar', 'Tyler', 'Jaya'];
  /* exact fractions (for quarter-inch answers) */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var x = a % b; a = b; b = x; } return a; }
  function R(p, d) { if (d < 0) { p = -p; d = -d; } var g = gcd(p, d) || 1; return [p / g, d / g]; }
  function fr(x, den) { return R(Math.round(x * (den || 4)), den || 4); }                   // 3.75 → [15, 4]
  function mixT(f, tf) { var w = Math.floor(f[0] / f[1]), n = f[0] - w * f[1], fs = tf ? '\\tfrac' : '\\frac'; return f[1] === 1 ? String(f[0]) : (w ? w : '') + fs + '{' + n + '}{' + f[1] + '}'; }
  function frT(f) { return f[1] === 1 ? String(f[0]) : '\\frac{' + f[0] + '}{' + f[1] + '}'; }
  /* a length that may be a quarter-inch mixed number: TeX (5\tfrac{1}{4}) or plain decimal */
  function L(x) { var w = Math.floor(x + 1e-9), f = q(x - w); if (near(f, 0)) return N(x); var g = [[0.25, '\\tfrac{1}{4}'], [0.5, '\\tfrac{1}{2}'], [0.75, '\\tfrac{3}{4}']].filter(function (p) { return near(f, p[0]); })[0]; return g ? (w ? w : '') + g[1] : N(x); }
  function Lu(x) { var w = Math.floor(x + 1e-9), f = q(x - w), g = { 0.25: '¼', 0.5: '½', 0.75: '¾' }[f]; return g ? (w ? w : '') + g : Np(x); }   // plain text (SVG labels)
  Object.assign(UF, { q: q, rd: rd, trunc: trunc, near: near, nS: nS, decs: decs, N: N, Np: Np, raw: raw, eqR: eqR, uT: uT, br: br, find: find, pickR: pickR, cap: cap, M: M, Mp: Mp,
    placeWord: placeWord, NAMES: NAMES, gcd: gcd, R: R, fr: fr, mixT: mixT, frT: frT, L: L, Lu: Lu });

  /* ---- keypad: fractions and mixed numbers, with a decimal point ---- */
  var W = HW.widgets;
  if (W && W.KEYSETS && !W.KEYSETS.u3mixed) {
    var dk = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
    W.KEYSETS.u3mixed = [[dk(7), dk(8), dk(9), { label: '<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#@}{#?}', plain: '/', title: 'Fraction: type the top number first' }, { label: '⌫', fn: 'del', title: 'Delete' }],
      [dk(4), dk(5), dk(6), { label: 'n<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#?}{#?}', plain: ' ', title: 'Mixed number: type the whole number first' }, { label: 'clear', fn: 'clear' }],
      [dk(1), dk(2), dk(3), { label: '◀', fn: 'left', title: 'Move left' }, { label: '▶', fn: 'right', title: 'Move right (to the next box)' }], [dk(0), { label: '.', tex: '.', plain: '.' }, { label: 'Check ↵', fn: 'enter', wide: true }]];
    W.KEYHELP = W.KEYHELP || {};
    W.KEYHELP.u3mixed = ['Mixed number: type the whole number, press <b>n<sup>a</sup>⁄<sub>b</sub></b>, then the top and bottom numbers (press <b>▶</b> to move on). A decimal (like 3.75) is fine too.',
      'Type a mixed number as <code>3 3/4</code> (a space between the whole number and the fraction), or a decimal like <code>3.75</code>.'];
  }

  /* ---- reading a typed number: strips $, \text{…} and a unit after the number ("252 cm²", "15.3 ft", "18 in") ---- */
  function readNum(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\placeholder(\[[^\]]*\])?\{[^}]*\}/g, '').replace(/\\(?:text|mathrm)\{([^{}]*)\}/g, '$1');
    s = s.replace(/\\\$|\$/g, '').replace(/\\[,;: !]|~| | /g, ' ').replace(/\^\{?2\}?/g, '²').trim();
    var unit = '', um = /^(-?[\d.,\s]*\d\.?)\s*([a-zA-Z\/³²°%'"][\s\S]*)$/.exec(s);
    if (um) { s = um[1].trim(); unit = um[2]; }
    if (/^-?\d*,\d{1,2}$/.test(s.replace(/\s/g, ''))) return { res: form('u3k-comma', 'Use a decimal point (not a comma), like 12.5.') };
    var p = HW.parse.number(s);
    if (!p.ok) return { res: p.code === 'empty' ? form('empty', 'Type your answer first.') : form('notnumber', 'Type a single number (the unit is already written beside the box).') };
    var pl = HW.parse.plain(s).replace(/[\s,]/g, ''), d = (pl.split('.')[1] || '').length;
    return { v: p.value, d: d, unit: unit, len: pl.replace(/^-/, '').length };
  }
  UF.readNum = readNum;

  /* ---- one number. o: { dp (rounding place; null = exact), money, exact (unrounded value), exactOk, alts (other right
   *   values), bad [[value, code, hint, 'form'?]], nr (numerical response, 4 characters), miss (hint for any other value) } ---- */
  UF.chk = function (ans, o) {
    o = o || {};
    var dp = o.money ? 2 : o.dp, exact = o.exact != null ? o.exact : ans, want = dp == null ? q(ans) : rd(ans, dp), step = dp == null ? 0 : Math.pow(10, -dp);
    var acc = [want].concat((o.alts || []).map(function (a) { return dp == null ? q(a) : rd(a, dp); }));
    if (o.exactOk) acc.push(q(exact));
    function tl(y) { return dp == null ? 1e-7 * Math.max(1, Math.abs(y)) : step / 20; }
    function isAcc(v) { return acc.some(function (y) { return Math.abs(v - y) <= tl(y); }); }
    var seen = [], bad = (o.bad || []).filter(function (b) {
      if (!b || !isFinite(b[0]) || isAcc(b[0]) || (dp != null && isAcc(rd(b[0], dp)))) return false;
      if (seen.some(function (x) { return near(x, b[0]); })) return false; seen.push(b[0]); return true;
    });
    function mBad(v, d, b) {
      return Math.abs(v - b) <= 1e-6 * Math.max(1, Math.abs(b)) || (d >= 1 && d <= 6 && (near(v, rd(b, d)) || near(v, trunc(b, d)))) ||
        (d === 0 && (dp === 0 || Math.abs(b - Math.round(b)) < 1e-6) && near(v, rd(b, 0)));
    }
    var place = placeWord(dp, o.money);
    var f = function (resp) {
      var a = readNum(resp); if (a.res) return a.res;
      var v = a.v, d = a.d, i;
      if (isAcc(v)) {
        if (o.nr && a.len > 4) return form('nr-long', 'Numerical response answers fit in 4 boxes (digits and a decimal point only).');
        return ok();
      }
      if (dp != null && d > dp && isAcc(rd(v, dp))) return form('round', 'Right — now round to ' + place + '.');
      if (dp != null && d < dp && acc.some(function (y) { return near(v, rd(y, d)) || near(v, trunc(y, d)); }))
        return form('places', o.money ? 'Give the amount to the cent (2 decimal places), like $12.50.' : 'Round to ' + place + ' (' + dp + ' decimal place' + (dp === 1 ? '' : 's') + ').');
      for (i = 0; i < bad.length; i++) if (mBad(v, d, bad[i][0])) return bad[i][3] === 'form' ? form(bad[i][1], bad[i][2]) : wrong(bad[i][1], bad[i][2]);
      if (dp == null && d < decs(want) && (near(v, rd(want, d)) || near(v, trunc(want, d)))) return form('u3k-exact', 'Close, but don’t round this answer: give the exact value (' + decs(want) + ' decimal place' + (decs(want) === 1 ? '' : 's') + ').');
      if (dp != null && d === dp && !near(exact, want) && near(Math.abs(v - want), step, step / 20) && Math.abs(v - exact) < step)
        return wrong('u3k-round-dir', 'Check your rounding: look at the next digit. 5 or more rounds up; 4 or less rounds down.');
      if (o.nr && a.len > 4) return form('nr-long', 'Numerical response answers fit in 4 boxes (digits and a decimal point only).');
      return wrong('value', o.miss || null);
    };
    f.bad = bad; f.key = o.exactOk && decs(exact) <= 4 ? nS(exact) : dp != null ? want.toFixed(dp) : nS(want); f.keyDp = o.exactOk ? null : dp;
    return f;
  };
  /* an estimate: anything within tol (default 12%) of the friendly value; bad = [[value, code, hint]] for the far-off mistakes */
  UF.estChk = function (est, o) {
    o = o || {}; var tol = o.tol || 0.12, bad = (o.bad || []).filter(function (b) { return b && isFinite(b[0]) && Math.abs(b[0] - est) > tol * est; });
    var f = function (resp) {
      var a = readNum(resp); if (a.res) return a.res;
      if (Math.abs(a.v - est) <= tol * Math.abs(est)) return ok();
      for (var i = 0; i < bad.length; i++) if (Math.abs(a.v - bad[i][0]) <= tol * Math.abs(bad[i][0])) return wrong(bad[i][1], bad[i][2]);
      return wrong('u3k-est', o.miss || 'An estimate should be close to the real answer. Use a friendly number and do the same operation.');
    };
    f.bad = bad; return f;
  };
  /* a whole number rounded UP from x (boxes, cans, tiles). o: { unit ('boxes'), bad [[value, code, hint]] } */
  UF.upChk = function (x, o) {
    o = o || {}; var up = Math.ceil(x - 1e-9), unit = o.unit || 'of them';
    var f = function (resp) {
      var a = readNum(resp); if (a.res) return a.res;
      var v = a.v;
      if (near(v, up)) return ok();
      for (var i = 0; o.bad && i < o.bad.length; i++) if (!near(o.bad[i][0], up) && (near(v, o.bad[i][0]) || near(v, rd(o.bad[i][0], a.d)))) return wrong(o.bad[i][1], o.bad[i][2]);
      if (!near(x, up) && near(v, up - 1)) return wrong('u3k-round-down', t(N(up - 1)) + ' ' + unit + ' would not be quite enough. You need <b>at least</b> ' + t(raw(x, 2)) + ', so round <b>up</b> to the next whole number.');
      if (a.d > 0 && Math.abs(v - x) < 0.06) return form('u3k-whole', 'Right division — now give a whole number of ' + unit + '. You can’t buy part of one, so round <b>up</b>.');
      return wrong('value', o.miss || null);
    };
    f.key = String(up); return f;
  };

  /* ---- a mixed number (or the exact decimal). f = [p, q] in lowest terms. o: { bad [[value, code, hint]], decOk (default true), miss } ---- */
  UF.mixChk = function (f, o) {
    o = o || {}; var T = f[0] / f[1], decOk = o.decOk !== false;
    function badHit(v) { for (var i = 0; o.bad && i < o.bad.length; i++) { var b = o.bad[i]; if (isFinite(b[0]) && !near(b[0], T) && (near(v, b[0], 1e-6) || Math.abs(v - b[0]) < 0.006)) return wrong(b[1], b[2]); } return null; }
    return function (resp) {
      var s = String(resp == null ? '' : resp).replace(/\\placeholder(\[[^\]]*\])?\{[^}]*\}/g, '').replace(/\\text\{\s*([^{}]*)\}/g, ' $1 ').replace(/\\[,;: !]|~/g, ' ').trim();
      s = s.replace(/\s*(in|ft|cm|m|yd|mm)\s*(\^\{?2\}?|²)?\s*\.?\s*$/, '').trim();
      if (!s) return form('empty', 'Type your answer first.');
      var h, pn = HW.parse.number(s);
      if (pn.ok) {
        var v = pn.value;
        if (near(v, T)) return decOk || f[1] === 1 ? ok() : form('u3k-want-mixed', 'Right value — now write it as a mixed number.');
        if (/^\s*\d+,\d{1,2}\s*$/.test(s)) return form('u3k-comma', 'Use a decimal point (not a comma), like 3.75.');
        if ((h = badHit(v))) return h;
        if (Math.abs(v - T) < 0.051 && decs(v) < decs(T)) return form('u3k-exact', 'Close — but this answer is exact. Give it as a mixed number (like ' + t(mixT(f, true)) + ') or the full decimal.');
        return wrong('value', o.miss || null);
      }
      var a = PK.readFrac(s);
      if (!a || !isFinite(a.v)) return form('notnumber', 'Type a mixed number like 3 3/4 (or a decimal like 3.75).');
      if (near(a.v, T, 1e-9)) {
        if (a.mixed) {
          if (a.n != null && a.n >= a.d) return form('u3k-mixed-improper', 'In a mixed number the fraction part must be less than 1 — take another whole out of it.');
          if (a.n != null && gcd(a.n, a.d) > 1) return form('lowest', 'Right value — now simplify the fraction part (divide its top and bottom by ' + t(gcd(a.n, a.d)) + ').');
          return ok();
        }
        if (a.pf) {
          if (gcd(a.pf[0], a.pf[1]) > 1) return form('lowest', 'Right value — now write the fraction in simplest form (divide the top and bottom by ' + t(gcd(a.pf[0], a.pf[1])) + ').');
          if (a.pf[0] > a.pf[1] && a.pf[1] !== 1) return form('u3k-want-mixed', 'Right value — now write it as a <b>mixed number</b>: ' + t(frT(a.pf) + '=' + mixT(a.pf)) + '.');
        }
        return ok();
      }
      if ((h = badHit(a.v))) return h;
      return wrong('value', o.miss || null);
    };
  };

  /* ---- part builders ---- */
  /* a number part. o: dp, money, exact, exactOk, alts, bad, before, after (unit beside the box, e.g. 'cm²'), sol, hints, text, nr */
  UF.num = function (prompt, ans, o) {
    o = o || {}; ans = q(ans);
    var chk = UF.chk(ans, o), key = chk.key;
    var p = { prompt: prompt, input: { type: 'number', before: o.money ? '$' : o.before, after: o.after, nr: !!o.nr }, check: chk, key: key,
      answer: t((o.money ? '\\$' : '') + N(Number(key), chk.keyDp) + uT(o.after)), solution: br(o.sol), hints: o.hints || [], text: o.text };
    if (o.outcome) p.outcome = o.outcome;
    p.bad = chk.bad.filter(function (b) { return b[3] !== 'form'; }).map(function (b) { return nS(rd(b[0], 6)); });
    p.good = o.nr ? [] : [key + (o.after ? ' ' + o.after : '')].concat(o.money ? ['$' + key] : []);
    return p;
  };
  /* a mixed-number part. f = [p, q]; o: { after, before, bad, sol, hints, text, decOk } */
  UF.mixPart = function (prompt, f, o) {
    o = o || {}; f = R(f[0], f[1]);
    var key = mixT(f), T = f[0] / f[1];
    var p = { prompt: prompt, input: { type: 'math', keys: 'u3mixed', before: o.before, after: o.after, placeholder: 'e.g. 3 3/4 or 3.75' }, check: UF.mixChk(f, o), key: key,
      answer: t(mixT(f, true) + (decs(T) <= 3 && f[1] !== 1 ? '=' + N(T) : '') + uT(o.after)), solution: br(o.sol), hints: o.hints || [], text: o.text };
    p.bad = (o.bad || []).filter(function (b) { return isFinite(b[0]) && Math.abs(b[0] - T) > 0.01; }).map(function (b) { return nS(rd(b[0], 4)); });
    p.good = [f[1] === 1 ? String(f[0]) : Math.floor(T) + ' ' + (f[0] % f[1]) + '/' + f[1]].concat(o.decOk !== false && decs(T) <= 4 ? [nS(T)] : []);
    return p;
  };
  /* a round-up part */
  UF.upPart = function (prompt, x, o) {
    o = o || {}; var chk = UF.upChk(x, o);
    var p = { prompt: prompt, input: { type: 'number', after: o.after }, check: chk, key: chk.key, answer: t(chk.key + uT(o.after)), solution: br(o.sol), hints: o.hints || [], text: o.text };
    p.bad = [String(Math.ceil(x - 1e-9) - 1)].filter(function () { return !near(x, Math.ceil(x - 1e-9)); });
    return p;
  };
  /* several boxes. rows: [{ label, name, ans, dp, money, exact, exactOk, alts, bad, before, after,
   *   est: { tol, bad, miss } (an estimate box), mix: [p, q] (a mixed-number box), up: x (round up), unit (for up) }] */
  UF.fields = function (prompt, rows, sol, hints, text) {
    var chks = rows.map(function (rw, i) {
      if (rw.est) return UF.estChk(rw.ans, rw.est);
      if (rw.mix) return UF.mixChk(R(rw.mix[0], rw.mix[1]), { bad: rw.bad });
      if (rw.up != null) return UF.upChk(rw.up, { unit: rw.unit, bad: rw.bad });
      var others = rows.filter(function (x, j) { return j !== i && !x.est && !x.mix && x.up == null && !near(q(x.ans), q(rw.ans)); }).map(function (x) { return [x.ans, 'amt-swap', 'That’s the answer for another box (' + (x.name || x.label.replace(/:$/, '')) + '). Check which box is which.']; });
      return UF.chk(q(rw.ans), { dp: rw.dp, money: rw.money, exact: rw.exact, exactOk: rw.exactOk, alts: rw.alts, bad: (rw.bad || []).concat(others) });
    });
    var keys = rows.map(function (rw, i) { return rw.est ? nS(rd(rw.ans, 1)) : rw.mix ? mixT(R(rw.mix[0], rw.mix[1])) : rw.up != null ? chks[i].key : chks[i].key; });
    var ans = rows.map(function (rw, i) {
      var v = rw.mix ? mixT(R(rw.mix[0], rw.mix[1]), true) : rw.up != null ? keys[i] : (rw.money ? '\\$' : '') + N(Number(keys[i]), chks[i].keyDp);
      return rw.label + ' ' + (rw.est ? 'about ' : '') + t(v + uT(rw.after));
    }).join(' &nbsp; ');
    var p = P.fields(prompt, rows.map(function (rw) { var fd = { label: rw.label, before: rw.money ? '$' : rw.before, after: rw.after, name: rw.name || rw.label.replace(/:$/, '') }; if (rw.mix) { fd.mode = 'math'; fd.keys = 'u3mixed'; fd.placeholder = 'e.g. 3 3/4'; } return fd; }), chks, keys, ans, br(sol), hints, text);
    var b0 = []; rows.forEach(function (rw, i) { var bb = (chks[i].bad || []).filter(function (b) { return b[3] !== 'form'; })[0]; if (bb && !rw.mix) { var arr = keys.slice(); arr[i] = nS(rd(bb[0], 6)); b0.push(arr); } });
    p.bad = b0.slice(0, 3);
    return p;
  };
  /* a fill-in table (the areabox input): cols (TeX heads), rows (TeX labels), cells (TeX given, null = a box),
   * blanks [{ i, j, name, chk, key }], keyCells (TeX of every cell for the answer) */
  UF.table = function (prompt, I, blanks, keyCells, sol, hints, text) {
    return PK.tablePart(prompt, { rows: I.rows, cols: I.cols, cells: I.cells, corner: I.corner || '\\text{ }', keys: I.keys || 'pctkit-money', help: I.help || 'Tap a box, then type the number (the units are in the table).' },
      PK.tableChk(blanks.map(function (b) { return { where: 'cell', i: b.i, j: b.j, name: b.name, chk: b.chk }; })), { rows: I.rows, cols: I.cols, cells: keyCells }, br(sol), hints, text);
  };
  UF.mc = function (r, prompt, opts, sol, hints, text, keepOrder) { return P.mc(r, prompt, opts, br(sol), hints, text, keepOrder); };

  /* ---- calculator key caps ---- */
  function kc(s) { return '<span style="display:inline-block;min-width:1.5em;text-align:center;padding:0 5px;margin:0 2px;border:1px solid #6b7686;border-bottom-width:3px;border-radius:5px;background:#f4f6f9;color:#1d2633;font-weight:700;font-size:.9em;line-height:1.45;white-space:nowrap">' + s + '</span>'; }
  function keys(list) { return '<span style="white-space:nowrap">' + list.map(function (x) { return /^[−-]?[\d.]+$/.test(x) ? x : kc(x); }).join(' ') + '</span>'; }
  UF.kc = kc; UF.keys = keys;

  /* ---- small SVG helpers (plain-text labels) ---- */
  var INK = '#2b3340', SHADE = '#dbe7f3';
  function f1(x) { return (+x).toFixed(1); }
  function svg(Wd, Ht, body, label, maxW) { return '<svg class="fig-svg" viewBox="0 0 ' + f1(Wd) + ' ' + f1(Ht) + '" width="100%" style="max-width:' + (maxW || Math.round(Wd)) + 'px" role="img" aria-label="' + (label || 'diagram') + '">' + body + '</svg>'; }
  function poly(pts, fill, o) { o = o || {}; return '<polygon points="' + pts.map(function (p) { return f1(p[0]) + ',' + f1(p[1]); }).join(' ') + '" fill="' + (fill || 'none') + '" stroke="' + (o.stroke || INK) + '" stroke-width="' + (o.w || 1.8) + '"' + (o.dash ? ' stroke-dasharray="' + o.dash + '"' : '') + '/>'; }
  function ln(a, b, o) { o = o || {}; return '<line x1="' + f1(a[0]) + '" y1="' + f1(a[1]) + '" x2="' + f1(b[0]) + '" y2="' + f1(b[1]) + '" stroke="' + (o.stroke || INK) + '" stroke-width="' + (o.w || 1.4) + '"' + (o.dash ? ' stroke-dasharray="' + o.dash + '"' : '') + '/>'; }
  function tx(x, y, s, anc, o) { o = o || {}; return '<text x="' + f1(x) + '" y="' + f1(y) + '" font-size="' + (o.size || 14) + '" text-anchor="' + (anc || 'middle') + '" fill="' + (o.fill || INK) + '"' + (o.italic ? ' font-style="italic"' : '') + (o.bold ? ' font-weight="700"' : '') + '>' + s + '</text>'; }
  /* a right-angle mark at corner c, with the two sides going toward directions u and v (unit vectors) */
  function sqMark(c, u, v, s) { s = s || 9; var a = [c[0] + u[0] * s, c[1] + u[1] * s], b = [c[0] + (u[0] + v[0]) * s, c[1] + (u[1] + v[1]) * s], d = [c[0] + v[0] * s, c[1] + v[1] * s]; return '<polyline points="' + [a, b, d].map(function (p) { return f1(p[0]) + ',' + f1(p[1]); }).join(' ') + '" fill="none" stroke="' + INK + '" stroke-width="1.1"/>'; }
  Object.assign(UF, { INK: INK, SHADE: SHADE, svg: svg, poly: poly, ln: ln, tx: tx, sqMark: sqMark });

  /* ======================= Lesson 7 helpers ======================= */
  var A1 = 'A1', M3 = 'M3';
  var PI = Math.PI;
  function piBad(x, dp, f314) {            // 3.14 instead of the π key, only when it changes the rounded answer
    return [[f314, 'u3k-pi314', 'Use the ' + t('\\pi') + ' key on your calculator: 3.14 is a little off, and it changes the rounded answer.', 'form']];
  }
  /* d = C ÷ π (to dp places) */
  function diamBad(C, dp) {
    return [[C * PI, 'u3l7-times-pi', 'To undo “× π”, <b>divide</b> by π. A diameter is about a third of the circumference, not bigger.'],
      [C / (2 * PI), 'u3l7-radius', 'That’s the <b>radius</b> (C ÷ 2π). The diameter is C ÷ π.'], [C / 2, 'u3l7-half', 'Divide by π (about 3.14), not by 2.'],
      [C / 3, 'u3l7-by3', 'C ÷ 3 is only an estimate. Use the π key: d = C ÷ π.']].concat(piBad(C / PI, dp, C / 3.14));
  }
  function radBad(C, dp) {
    return [[C / 2 * PI, 'u3l7-no-brackets', 'Your calculator multiplied by π. Use brackets: C ' + kc('÷') + ' ' + kc('(') + ' 2 ' + kc('×') + ' ' + kc('π') + ' ' + kc(')') + ', or divide twice: C ÷ 2 ÷ π.'],
      [C / PI, 'u3l7-diam', 'That’s the <b>diameter</b> (C ÷ π). The radius is half of it: r = C ÷ (2π).'], [C / 2, 'u3l7-half', 'Divide by 2π (about 6.28), not just by 2.'],
      [C * 2 * PI, 'u3l7-times-pi', 'To undo “× 2π”, <b>divide</b> by 2π.'], [C / 6, 'u3l7-by3', 'C ÷ 6 is only an estimate. Use the π key: r = C ÷ (2π).']].concat(piBad(C / 2 / PI, dp, C / 6.28));
  }
  function dSol(C, dp, u) { return [t('d=C\\div\\pi'), t('d=' + N(C) + '\\div\\pi' + eqR(C / PI, dp) + uT(u))]; }
  function rSol(C, dp, u) { return [t('r=C\\div(2\\pi)'), t('r=' + N(C) + '\\div(2\\times\\pi)' + eqR(C / 2 / PI, dp) + uT(u))]; }
  /* rectangle: missing width from P and l (or l from P and w). other = the given side's letter */
  function rectBad(Pm, s, g, mix) {        // s = the given side, g = the letter of the given side; mix: show quarter-inch mixed numbers
    var N = mix ? L : UF.N, w = (Pm - 2 * s) / 2, ot = g === 'l' ? 'width' : 'length';
    return [[Pm - 2 * s, 'u3l7-no-step2', t(N(Pm) + '-2(' + N(s) + ')=' + N(Pm - 2 * s)) + ' is <b>both</b> ' + ot + 's together. Step 2: divide by 2.'],
      [Pm - s, 'u3l7-one-side', 'There are <b>two</b> ' + (g === 'l' ? 'lengths' : 'widths') + ' in the perimeter. Subtract ' + t('2' + g + '=2\\times ' + N(s) + '=' + N(2 * s)) + ', not ' + t(N(s)) + '.'],
      [(Pm - s) / 2, 'u3l7-one-side', 'Subtract <b>two</b> ' + (g === 'l' ? 'lengths' : 'widths') + ' (' + t('2\\times ' + N(s) + '=' + N(2 * s)) + '), then divide by 2.'],
      [Pm / 2, 'u3l7-half-p', 'Half the perimeter is one length <b>plus</b> one width. Take away the ' + (g === 'l' ? 'length' : 'width') + ' too.'],
      [Pm / 2 - 2 * s, 'u3l7-half-two', 'If you halve the perimeter first, take away only <b>one</b> ' + (g === 'l' ? 'length' : 'width') + ': ' + t(N(Pm) + '\\div 2-' + N(s)) + '.'],
      [Pm / 4, 'u3l7-square', 'This is a rectangle, not a square. Use ' + t((g === 'l' ? 'w=(P-2l)' : 'l=(P-2w)') + '\\div 2') + '.'],
      [(Pm + 2 * s) / 2, 'u3l7-added', 'To undo “+ 2' + g + '”, <b>subtract</b> 2' + g + '.']].filter(function (b) { return !near(b[0], w) && b[0] > 0; });
  }
  function rectSol(Pm, s, g, u, sub) {
    var o = g === 'l' ? 'w' : 'l', w = (Pm - 2 * s) / 2;
    if (sub) return [t('P=2l+2w'), t(N(Pm) + '=2' + (g === 'l' ? '(' + N(s) + ')+2w' : 'l+2(' + N(s) + ')')), t(N(Pm) + '=' + (g === 'l' ? N(2 * s) + '+2w' : '2l+' + N(2 * s))),
      t(N(Pm) + '-' + N(2 * s) + '=2' + o) + ' (subtract ' + N(2 * s) + ' from both sides)', t(N(Pm - 2 * s) + '=2' + o), t(o + '=' + N(Pm - 2 * s) + '\\div 2=' + N(w) + uT(u)),
      'Check: ' + t('2(' + N(g === 'l' ? s : w) + ')+2(' + N(g === 'l' ? w : s) + ')=' + N(Pm)) + ' ✓'];
    return [t(o + '=(P-2' + g + ')\\div 2'), t(o + '=(' + N(Pm) + '-2\\times ' + N(s) + ')\\div 2'), t(o + '=(' + N(Pm) + '-' + N(2 * s) + ')\\div 2=' + N(Pm - 2 * s) + '\\div 2=' + N(w) + uT(u)),
      'Check: ' + t('2(' + N(s) + ')+2(' + N(w) + ')=' + N(2 * s) + '+' + N(2 * w) + '=' + N(Pm)) + ' ✓'];
  }
  /* the same with quarter-inch mixed numbers */
  function rectSolMix(Pm, s, g, u) {
    var o = g === 'l' ? 'w' : 'l', w = (Pm - 2 * s) / 2;
    return [t(o + '=(P-2' + g + ')\\div 2'), t('2\\times ' + L(s) + '=' + L(2 * s)), t(o + '=(' + L(Pm) + '-' + L(2 * s) + ')\\div 2=' + L(Pm - 2 * s) + '\\div 2=' + L(w) + uT(u)),
      'Check: ' + t('2(' + L(s) + ')+2(' + L(w) + ')=' + L(2 * s) + '+' + L(2 * w) + '=' + L(Pm)) + ' ✓'];
  }
  function areaBad(A, s, g) {
    return [[A * s, 'u3l7-times', 'To undo “× ' + g + '”, <b>divide</b> by it: the missing side is ' + t('A\\div ' + g) + '.'], [A - s, 'u3l7-subtract', 'In ' + t('A=lw') + ' the sides are <b>multiplied</b>, so divide: ' + t(N(A) + '\\div ' + N(s)) + '.'],
      [s / A, 'u3l7-upside', 'Divide the <b>area</b> by the side you know (area on top).'], [A / 2, 'u3l7-half', 'Divide the area by the side you know (' + N(s) + '), not by 2.'], [A / 2 - s, 'u3l7-perim', 'This is area, not perimeter: divide the area by the side you know.']];
  }
  function mcF(r, prompt, opts, sol, hints, text) { return P.mc(r, prompt, opts.map(function (o) { return { html: t(o[0]), right: !!o[1], why: o[2], code: o[3] }; }), br(sol), hints, text); }

  HW.addCodes({
    'u3k-comma': 'Decimal comma', 'u3k-exact': 'Rounded an exact answer', 'u3k-round-dir': 'Rounded the wrong way', 'u3k-pi314': 'Used 3.14 instead of the π key', 'u3k-est': 'Estimate too far off',
    'u3k-want-mixed': 'Improper fraction instead of a mixed number', 'u3k-mixed-improper': 'Fraction part of a mixed number not less than 1', 'u3k-round-down': 'Rounded down when you need at least', 'u3k-whole': 'Didn’t round to a whole number',
    'u3l7-times-pi': 'Multiplied by π instead of dividing', 'u3l7-radius': 'Gave the radius instead of the diameter', 'u3l7-diam': 'Gave the diameter instead of the radius', 'u3l7-half': 'Divided by 2 instead of π / 2π',
    'u3l7-by3': 'Used the estimate (÷ 3) as the answer', 'u3l7-no-brackets': 'C ÷ 2 × π (no brackets)', 'u3l7-no-step2': 'Forgot Step 2 (both sides, not one)', 'u3l7-one-side': 'Subtracted one length instead of two',
    'u3l7-half-p': 'Gave half the perimeter', 'u3l7-half-two': 'Halved the perimeter, then took away two sides', 'u3l7-square': 'Treated a rectangle as a square', 'u3l7-added': 'Added instead of subtracting',
    'u3l7-times': 'Multiplied instead of dividing', 'u3l7-subtract': 'Subtracted instead of dividing', 'u3l7-upside': 'Divided the wrong way', 'u3l7-perim': 'Used a perimeter formula for area',
    'u3l7-sum': 'Added the sides instead of taking them away', 'u3l7-one-known': 'Took away only one of the known sides', 'u3l7-x4': 'Multiplied by 4 instead of dividing', 'u3l7-minus4': 'Subtracted 4 instead of dividing',
    'u3l7-early-round': 'Rounded too early', 'u3l7-money': 'Multiplied money by the price', 'u3l7-barn': 'Fenced the barn side too', 'u3l7-check-half': 'Added one length and one width only',
    'u3l7-opp': 'Chose the same operation instead of the opposite', 'u3l7-step': 'Wrong step when rearranging', 'u3l7-formula': 'Chose the wrong rearranged formula', 'u3l7-not-pi': 'Used the radius formula for the diameter'
  });
  HW.addPartial({ 'u3l7-no-step2': 'b', 'u3l7-one-side': 'b', 'u3l7-radius': 'b', 'u3l7-diam': 'b', 'u3l7-no-brackets': 's', 'u3l7-early-round': 's', 'u3l7-half-p': 'b', 'u3l7-one-known': 'b', 'u3l7-barn': 'b', 'u3l7-check-half': 'b' });

  /* ---- generators shared by the assignment and the extra practice ---- */
  function squarePart(Pm, u, o) {
    o = o || {}; var s = Pm / 4;
    return UF.num(o.prompt || t('P=4s') + '; ' + t('P=' + N(Pm) + uT(u)) + '. Find ' + t('s') + '.', s, { after: u, bad: [[Pm * 4, 'u3l7-x4', 'To undo “× 4”, <b>divide</b> by 4. One side is shorter than the perimeter.'], [Pm - 4, 'u3l7-minus4', t('4s') + ' means 4 <b>times</b> s. Undo it by dividing by 4.'], [Pm / 2, 'u3l7-half', 'A square has <b>four</b> equal sides: divide by 4.']],
      sol: [t(N(Pm) + '=4s'), 's is multiplied by 4, so divide both sides by 4.', t('s=' + N(Pm) + '\\div 4=' + N(s) + uT(u)), 'Check: ' + t('4\\times ' + N(s) + '=' + N(Pm)) + ' ✓'],
      hints: ['Substitute ' + t('P=' + N(Pm)) + ', then undo the “× 4”.'], text: o.text || 'P=4s' });
  }
  function triPart(Pm, a, b, u, o) {
    o = o || {}; var c = Pm - a - b;
    return UF.num(o.prompt || t('P=a+b+c') + '; ' + t('P=' + N(Pm) + uT(u)) + ', ' + t('a=' + N(a) + uT(u)) + ', ' + t('b=' + N(b) + uT(u)) + '. Find ' + t('c') + '.', c, { after: u,
      bad: [[Pm - a, 'u3l7-one-known', 'Take away <b>both</b> known sides: ' + t(N(Pm) + '-' + N(a) + '-' + N(b)) + '.'], [Pm - b, 'u3l7-one-known', 'Take away <b>both</b> known sides: ' + t(N(Pm) + '-' + N(a) + '-' + N(b)) + '.'],
        [a + b, 'u3l7-sum', t(N(a) + '+' + N(b) + '=' + N(a + b)) + ' is the two sides you know. Subtract it from the perimeter.'], [Pm + a + b, 'u3l7-added', 'To undo “+”, <b>subtract</b>.'], [Pm / 3, 'u3l7-half', 'The sides are not all equal. Subtract the two sides you know.']],
      sol: [t(N(Pm) + '=' + N(a) + '+' + N(b) + '+c=' + N(a + b) + '+c'), 'Subtract ' + N(a + b) + ' from both sides.', t('c=' + N(Pm) + '-' + N(a + b) + '=' + N(c) + uT(u)), 'Check: ' + t(N(a) + '+' + N(b) + '+' + N(c) + '=' + N(Pm)) + ' ✓'],
      hints: ['Add the two sides you know, then subtract from the perimeter.'], text: o.text || 'P=a+b+c' });
  }
  function areaSidePart(A, s, g, u, o) {
    o = o || {}; var x = A / s, other = g === 'l' ? 'w' : 'l';
    return UF.num(o.prompt || t('A=lw') + '; ' + t('A=' + N(A) + uT(u + '²')) + ', ' + t(g + '=' + N(s) + uT(u)) + '. Find ' + t(other) + '.', x, { after: u, bad: areaBad(A, s, g),
      sol: [t(other + '=A\\div ' + g), t(other + '=' + N(A) + '\\div ' + N(s) + '=' + N(x) + uT(u)), 'Check: ' + t(N(s) + '\\times ' + N(x) + '=' + N(A)) + ' ✓'].concat(o.solEnd || []),
      hints: o.hints || ['The sides are multiplied, so divide the area by the side you know.'], text: o.text || 'A=lw' });
  }
  function diamPart(prompt, C, dp, u, o) {
    o = o || {};
    return UF.num(prompt, rd(C / PI, dp), { dp: dp, exact: C / PI, after: u, nr: o.nr, bad: diamBad(C, dp),
      sol: (o.est ? ['Estimate: ' + t(N(C) + '\\div 3\\approx ' + N(Math.round(C / 3))) + ', so a bit less than that.'] : []).concat(dSol(C, dp, u)).concat(['Check: ' + t('\\pi\\times ' + N(rd(C / PI, dp), dp) + '\\approx ' + N(rd(PI * rd(C / PI, dp), 1))) + ' ✓']),
      hints: ['To undo “× π”, divide by π: ' + t('d=C\\div\\pi') + '.', 'Round to ' + placeWord(dp) + '.'], text: o.text || 'diameter' });
  }
  function radPart(prompt, C, dp, u, o) {
    o = o || {};
    return UF.num(prompt, rd(C / 2 / PI, dp), { dp: dp, exact: C / 2 / PI, after: u, nr: o.nr, bad: radBad(C, dp),
      sol: rSol(C, dp, u).concat(['Check: ' + t('2\\times\\pi\\times ' + N(rd(C / 2 / PI, dp), dp) + '\\approx ' + N(rd(2 * PI * rd(C / 2 / PI, dp), 1))) + ' ✓']),
      hints: ['To undo “× 2π”, divide by 2π. Use brackets on the calculator: C ' + kc('÷') + ' ' + kc('(') + ' 2 ' + kc('×') + ' ' + kc('π') + ' ' + kc(')') + '.', 'Round to ' + placeWord(dp) + '.'], text: o.text || 'radius' });
  }
  /* a rectangle side from the perimeter (decimal answer) */
  function rectPart(prompt, Pm, s, g, u, o) {
    o = o || {}; var x = (Pm - 2 * s) / 2;
    return UF.num(prompt, x, { after: u, nr: o.nr, dp: o.dp, bad: rectBad(Pm, s, g), sol: rectSol(Pm, s, g, u, o.sub).concat(o.solEnd || []),
      hints: o.hints || (o.sub ? ['Substitute the numbers into ' + t('P=2l+2w') + '.', 'Undo the “+” first (subtract), then undo the “× 2” (divide by 2).'] : ['Use ' + t((g === 'l' ? 'w=(P-2l)' : 'l=(P-2w)') + '\\div 2') + '.', 'Subtract <b>two</b> ' + (g === 'l' ? 'lengths' : 'widths') + ' first, then divide by 2.']), text: o.text || 'rectangle side' });
  }
  /* the same, answer a quarter mixed number */
  function rectMixPart(prompt, Pm, s, g, u, o) {
    o = o || {}; var x = (Pm - 2 * s) / 2;
    return UF.mixPart(prompt, fr(x, 4), { after: u, bad: rectBad(Pm, s, g, true), sol: rectSolMix(Pm, s, g, u).concat(o.solEnd || []),
      hints: o.hints || ['Use ' + t((g === 'l' ? 'w=(P-2l)' : 'l=(P-2w)') + '\\div 2') + '.', 'Double the ' + (g === 'l' ? 'length' : 'width') + ' first: ' + t('2\\times ' + L(s)) + '. Half of ' + t(L(Pm - 2 * s)) + ' is the answer.'], text: o.text || 'rectangle side mixed' });
  }
  /* "rearrange to find …" multiple choice: forms = [[tex, right, why, code]] */
  function rearr(r, lhsTex, letter, forms, sol, hints, text) {
    return mcF(r, t(lhsTex) + ', so ' + t(letter + '=') + ' …', forms, sol, hints || ['Undo what the formula does to ' + t(letter) + ': the opposite of × is ÷, the opposite of + is −.'], text);
  }
  var RE = {
    d: function (r) { return rearr(r, 'C=\\pi d', 'd', [['C\\div\\pi', 1], ['C\\times\\pi', 0, 'd is <b>multiplied</b> by π, so divide by π.', 'u3l7-times-pi'], ['\\pi\\div C', 0, 'Upside down: C goes on top (C ÷ π).', 'u3l7-upside'], ['C-\\pi', 0, 'πd means π <b>times</b> d. Undo it by dividing.', 'u3l7-subtract']], [t('C=\\pi d') + ': d is multiplied by π.', 'Divide both sides by π: ' + t('d=C\\div\\pi')], null, 'd=C/pi'); },
    lw: function (r, g) { var o = g === 'l' ? 'w' : 'l'; return rearr(r, 'A=lw', g, [['A\\div ' + o, 1], ['A\\times ' + o, 0, g + ' is <b>multiplied</b> by ' + o + ', so divide by ' + o + '.', 'u3l7-times'], ['A\\div ' + g, 0, 'That would find ' + o + '. To find ' + g + ', divide by the <b>other</b> side, ' + o + '.', 'u3l7-formula'], ['A-' + o, 0, t('lw') + ' means l <b>times</b> w. Undo it by dividing.', 'u3l7-subtract']], [t('A=lw') + ': ' + g + ' is multiplied by ' + o + '.', 'Divide both sides by ' + o + ': ' + t(g + '=A\\div ' + o)], null, 'A=lw ' + g); },
    s: function (r) { return rearr(r, 'P=4s', 's', [['P\\div 4', 1], ['4P', 0, 's is <b>multiplied</b> by 4, so divide by 4.', 'u3l7-x4'], ['P-4', 0, t('4s') + ' means 4 <b>times</b> s. Undo it by dividing.', 'u3l7-minus4'], ['4\\div P', 0, 'Upside down: P goes on top.', 'u3l7-upside']], [t('P=4s') + ': s is multiplied by 4.', 'Divide both sides by 4: ' + t('s=P\\div 4')], null, 's=P/4'); },
    r: function (r) { return rearr(r, 'C=2\\pi r', 'r', [['C\\div(2\\pi)', 1], ['C\\div 2\\times\\pi', 0, 'That divides by 2 and then <b>multiplies</b> by π. Divide by all of 2π: ' + t('C\\div(2\\pi)') + '.', 'u3l7-no-brackets'], ['C\\times 2\\pi', 0, 'r is <b>multiplied</b> by 2π, so divide by 2π.', 'u3l7-times-pi'], ['C\\div\\pi', 0, 'That finds the <b>diameter</b>. The radius is C ÷ (2π).', 'u3l7-diam']], [t('C=2\\pi r') + ': r is multiplied by 2π.', 'Divide both sides by 2π: ' + t('r=C\\div(2\\pi)')], null, 'r=C/2pi'); },
    rd: function (r) { return rearr(r, 'd=2r', 'r', [['d\\div 2', 1], ['2d', 0, 'r is <b>multiplied</b> by 2, so divide by 2. The radius is half the diameter.', 'u3l7-times'], ['d-2', 0, t('2r') + ' means 2 <b>times</b> r. Undo it by dividing.', 'u3l7-subtract'], ['2\\div d', 0, 'Upside down: d goes on top.', 'u3l7-upside']], [t('d=2r') + ': r is multiplied by 2.', 'Divide both sides by 2: ' + t('r=d\\div 2')], null, 'r=d/2'); },
    c: function (r) { return rearr(r, 'P=a+b+c', 'c', [['P-a-b', 1], ['P-a+b', 0, 'Take away <b>both</b> a and b: ' + t('P-a-b') + '.', 'u3l7-one-known'], ['P+a+b', 0, 'To undo “+ a + b”, <b>subtract</b> them.', 'u3l7-added'], ['(P-a-b)\\div 3', 0, 'After you take away a and b, what is left is c. There’s nothing to divide.', 'u3l7-formula']], [t('P=a+b+c'), 'Subtract a and b from both sides: ' + t('c=P-a-b')], null, 'c=P-a-b'); },
    rect: function (r, g, prompt) {
      var o = g === 'l' ? 'w' : 'l';
      return mcF(r, prompt || t('P=2l+2w') + ', so ' + t(o + '=') + ' …', [['(P-2' + g + ')\\div 2', 1], ['P-2' + g, 0, 'That is <b>both</b> ' + (o === 'w' ? 'widths' : 'lengths') + ' together. Step 2: divide by 2.', 'u3l7-no-step2'],
        ['P\\div 2-2' + g, 0, 'Half the perimeter is one length plus one width, so take away only <b>one</b> ' + g + '.', 'u3l7-half-two'], ['(P+2' + g + ')\\div 2', 0, 'To undo “+ 2' + g + '”, <b>subtract</b> 2' + g + '.', 'u3l7-added']],
        [t('P=2l+2w'), 'Step 1: subtract ' + t('2' + g) + ' from both sides: ' + t('P-2' + g + '=2' + o), 'Step 2: divide both sides by 2: ' + t(o + '=(P-2' + g + ')\\div 2')], ['Undo the + or − first, then the × or ÷.'], 'rect ' + o);
    }
  };

  /* ---- pictures ---- */
  function barnPen() {
    var b = UF.ln([30, 34], [210, 34], { w: 1 }), wall = '<rect x="22" y="14" width="196" height="20" fill="#c9cfd6" stroke="' + INK + '" stroke-width="1"/>' + tx(120, 29, 'barn wall', 'middle', { size: 12 });
    var fence = '<polyline points="40,34 40,120 200,120 200,34" fill="none" stroke="' + INK + '" stroke-width="3"/>';
    return svg(240, 146, wall + b + fence + tx(120, 138, 'l', 'middle', { italic: true }) + tx(32, 82, 'w', 'end', { italic: true }) + tx(208, 82, 'w', 'start', { italic: true }), 'a pen against a barn wall: one length and two widths are fenced', 240);
  }
  function trackPic() {
    var body = '<path d="M 70 30 L 190 30 A 40 40 0 0 1 190 110 L 70 110 A 40 40 0 0 1 70 30 Z" fill="' + SHADE + '" stroke="' + INK + '" stroke-width="2"/>' + ln([190, 30], [190, 110], { dash: '5 4' }) + tx(130, 128, 'l', 'middle', { italic: true }) + tx(198, 75, 'd', 'start', { italic: true });
    return svg(250, 138, body, 'a track: two straight sides of length l and two half circles of diameter d', 250);
  }

  /* ======================= the lesson ======================= */
  HW.defineLesson({
    id: 'u3l7', unit: 3, num: '7', title: 'Rearranging Formulas: Finding a Missing Side', outcome: A1,
    blurb: 'Using perimeter, circumference and area formulas backwards to find a missing side, diameter or radius, and checking by substituting back.',
    questions: [
      { num: '1', stem: '', parts: [{ id: '1', level: 'BEG', make: function (r) {
        var n = r.pick([3, 4, 5, 6, 8, 9, 12]), m = r.pick([2, 3, 5]);
        var rows = [r.chance(0.6) ? { id: 'a', html: '(a) add ' + n, w: 'sub' } : { id: 'a', html: '(a) subtract ' + n, w: 'add' },
          r.chance(0.6) ? { id: 'b', html: '(b) multiply by ' + t('\\pi'), w: 'div' } : { id: 'b', html: '(b) multiply by ' + t('2\\pi'), w: 'div' },
          { id: 'c', html: '(c) divide by ' + m, w: 'mul' }, r.pick([{ id: 'd', html: '(d) add ' + t('2l'), w: 'sub' }, { id: 'd', html: '(d) add ' + t('2w'), w: 'sub' }, { id: 'd', html: '(d) multiply by 4', w: 'div' }])];
        var cols = [{ id: 'add', html: 'add' }, { id: 'sub', html: 'subtract' }, { id: 'mul', html: 'multiply by' }, { id: 'div', html: 'divide by' }], want = {};
        rows.forEach(function (x) { want[x.id] = x.w; });
        var nm = { add: 'add', sub: 'subtract', mul: 'multiply by', div: 'divide by' };
        return P.grid('What undoes each operation? Choose the opposite operation (it uses the same number or letter).', rows.map(function (x) { return { id: x.id, html: x.html }; }), cols, want,
          { why: function (row, got) { var x = rows.filter(function (y) { return y.id === row; })[0], same = /^\(.\) (add|subtract|multiply|divide)/.exec(x.html.replace(/<[^>]*>/g, '')); return { code: 'u3l7-opp', hint: 'Row ' + x.id + ': ' + (same && nm[got] && nm[got].indexOf(same[1]) === 0 ? 'that does the same thing again. Choose the <b>opposite</b>.' : 'add ↔ subtract, multiply ↔ divide.') }; }, colHead: 'undo by' },
          rows.map(function (x) { return x.html.replace(/^\((.)\) /, '($1) ') + ' → ' + nm[x.w] + ' ' + x.html.replace(/^\(.\) (add|subtract|multiply by|divide by) /, ''); }).join('<br>'), ['Opposites: add ↔ subtract, multiply ↔ divide.'], 'undo ops');
      } }] },
      { num: '2', stem: 'Substitute, then undo to find the missing value. Check your answer.', parts: [
        { id: '2a', level: 'BEG', make: function (r) { var Pm = find(function () { return r.int(15, 45) * 2; }, function (x) { return x !== 46 && x % 4 !== 0; }); return squarePart(Pm, 'cm'); } },
        { id: '2b', level: 'BEG', make: function (r) { var v = find(function () { var a = r.int(5, 12), b = r.int(6, 14), c = r.int(4, 14); return [a, b, c]; }, function (v) { return v[0] !== v[1] && v[2] !== v[0] && v[2] !== v[1]; }); return triPart(v[0] + v[1] + v[2], v[0], v[1], 'in'); } },
        { id: '2c', level: 'BEG', make: function (r) { var v = find(function () { return [r.int(5, 12), r.int(3, 9)]; }, function (v) { return v[1] < v[0] && !(v[0] === 12 && v[1] === 11); }); return areaSidePart(v[0] * v[1], v[0], 'l', 'm'); } },
        { id: '2d', level: 'EMG', make: function (r) { var C = find(function () { return rd(PI * r.int(6, 25), 1); }, function (C) { return [94.2, 188].indexOf(C) < 0; }); return diamPart(t('C=\\pi d') + '; ' + t('C=' + N(C) + uT('cm')) + '. Find ' + t('d') + ' to the nearest tenth.', C, 1, 'cm'); } }] },
      { num: '3', stem: 'Rearrange each formula to find the letter shown.', parts: [
        { id: '3a', level: 'BEG', make: function (r) { return RE.d(r); } },
        { id: '3b', level: 'BEG', make: function (r) { return RE.lw(r, r.pick(['l', 'w'])); } },
        { id: '3c', level: 'BEG', make: function (r) { return RE.s(r); } },
        { id: '3d', level: 'EMG', make: function (r) { return RE.r(r); } },
        { id: '3e', level: 'BEG', make: function (r) { return RE.rd(r); } }] },
      { num: '4', stem: '', parts: [{ id: '4', level: 'EMG', make: function (r) {
        var C = find(function () { return r.int(190, 320); }, function (C) { return C !== 188 && Math.abs(C / PI - Math.round(C / PI)) > 0.08; }), thing = r.pick(['A hula hoop', 'A round trampoline', 'A tractor tire', 'A round hot tub']);
        var d = rd(C / PI, 0), E = C / 3;
        return UF.fields(thing + ' has a circumference of ' + C + ' cm. Estimate its diameter. Then find the diameter to the nearest centimetre.', [
          { label: 'Estimate:', name: 'Estimate', ans: E, after: 'cm', est: { tol: 0.12, bad: [[C * 3, 'u3l7-times-pi', 'A diameter is about a <b>third</b> of the circumference: divide by 3.']], miss: 'π is a little more than 3, so the diameter is a bit less than ' + t(N(C) + '\\div 3') + '.' } },
          { label: 'Diameter:', name: 'Diameter', ans: d, dp: 0, exact: C / PI, after: 'cm', bad: diamBad(C, 0) }],
          ['Estimate: ' + t(N(C) + '\\div 3\\approx ' + Math.round(E)) + ', so a bit less than ' + Math.round(E) + ' cm.'].concat(dSol(C, 0, 'cm')).concat(['Check: ' + t('\\pi\\times ' + d + '\\approx ' + N(rd(PI * d, 1))) + ' ✓']),
          ['π is a little more than 3: divide by 3 for an estimate.', t('d=C\\div\\pi') + '. Round to the nearest centimetre.'], 'hoop');
      } }] },
      { num: '5', stem: function (sh) { return 'A round ' + sh.what + ' has a circumference of ' + N(sh.C) + ' ft.'; },
        shared: function (r) { return { what: r.pick(['steel fire pit ring', 'garden pond', 'gazebo floor', 'patio table']), C: find(function () { return pickR(r, 9, 22, 0.5); }, function (C) { return Math.abs((C / 2 / PI * 10) % 1 - 0.5) > 0.06 && Math.abs((C / PI * 10) % 1 - 0.5) > 0.06; }) }; },
        parts: [
          { id: '5a', level: 'EMG', make: function (r, sh) { return radPart('Find its radius, to the nearest tenth of a foot.', sh.C, 1, 'ft'); } },
          { id: '5b', level: 'EMG', make: function (r, sh) { var rr = rd(sh.C / 2 / PI, 1), p = diamPart('Find its diameter, to the nearest tenth of a foot.', sh.C, 1, 'ft');
            if (!near(2 * rr, rd(sh.C / PI, 1))) { p.check = UF.chk(rd(sh.C / PI, 1), { dp: 1, exact: sh.C / PI, bad: [[2 * rr, 'u3l7-early-round', 'Close! You doubled the <b>rounded</b> radius. Use ' + t('d=C\\div\\pi') + ' (or double the unrounded radius), then round.', 'form']].concat(diamBad(sh.C, 1)) }); }
            p.solution += '<br>(About twice the radius ✓)'; return p; } }] },
      { num: '6', stem: '', parts: [
        { id: '6a', level: 'BEG', make: function (r) { var v = find(function () { return [r.pick([8, 9, 10, 12]), r.pick([2, 3, 4])]; }, function (v) { return true; }); return areaSidePart(v[0] * v[1], v[0], 'l', 'ft', { prompt: '(a) A rectangular sheet of ' + r.pick(['drywall', 'plywood', 'OSB board']) + ' covers ' + (v[0] * v[1]) + ' ft². It is ' + v[0] + ' ft long. How wide is it?', solEnd: ['It is ' + v[1] + ' ft wide.'] }); } },
        { id: '6b', level: 'EMG', make: function (r) {
          var v = find(function () { var w = r.pick([2.4, 2.5, 2.75]), st = w === 2.4 ? 0.05 : 0.04, l = pickR(r, 5.2, 6.4, st); return [l, w, q(l * w)]; }, function (v) { return decs(v[2]) <= 2 && decs(v[0]) === 2 && !(v[2] === 22.5); });
          return areaSidePart(v[2], v[1], 'w', 'm', { prompt: '(b) A rectangular parking stall has an area of ' + N(v[2]) + ' m². It is ' + N(v[1]) + ' m wide. How long is it?', solEnd: ['It is ' + N(v[0]) + ' m long.'] }); } }] },
      { num: '7', stem: '', parts: [{ id: '7', level: 'EMG', make: function (r) {
        var g = r.chance(0.6) ? 'l' : 'w', o = g === 'l' ? 'w' : 'l', T = function (s) { return t(s); };
        var rows = [{ id: 's1', html: 'Step 1: Subtract ___ from both sides.' }, { id: 's2', html: T('P-2' + g + '=') + ' ___' }, { id: 's3', html: 'Step 2: Divide both sides by ___.' }, { id: 's4', html: T(o + '=') + ' ___' }];
        var cols = [{ id: 'g2', html: T('2' + g) }, { id: 'o2', html: T('2' + o) }, { id: 'g1', html: T(g) }, { id: 'two', html: T('2') }, { id: 'f', html: T('(P-2' + g + ')\\div 2') }, { id: 'pm', html: T('P-2' + g) }];
        var why = { s1: 'Both ' + (g === 'l' ? 'lengths' : 'widths') + ' are added on: subtract ' + t('2' + g) + '.', s2: 'What is left after taking away ' + t('2' + g) + ' is the two ' + (o === 'w' ? 'widths' : 'lengths') + ': ' + t('2' + o) + '.', s3: t('2' + o) + ' means 2 times ' + t(o) + ', so divide by 2.', s4: t('P-2' + g) + ' is both ' + (o === 'w' ? 'widths' : 'lengths') + '. Divide it by 2: ' + t('(P-2' + g + ')\\div 2') + '.' };
        return P.grid('Fill in the blanks to rearrange ' + t('P=2l+2w') + ' to find ' + t(o) + '. Choose what goes in each blank.', rows, cols, { s1: 'g2', s2: 'o2', s3: 'two', s4: 'f' },
          { why: function (row) { return { code: 'u3l7-step', hint: why[row] }; } },
          br(['Step 1: Subtract ' + t('2' + g) + ' from both sides: ' + t('P-2' + g + '=2' + o), 'Step 2: Divide both sides by 2: ' + t(o + '=(P-2' + g + ')\\div 2')]), ['Undo the + first (subtract), then undo the × (divide).'], 'fill blanks ' + o);
      } }] },
      { num: '8', stem: '', parts: [{ id: '8', level: 'EMG', make: function (r) {
        var v = find(function () { return [r.int(9, 20), r.int(4, 12)]; }, function (v) { return v[1] < v[0] && 2 * (v[0] + v[1]) !== 36; }), who = r.pick(['Hiro', 'Kenji', 'Aisha', 'Mateo']), Pm = 2 * (v[0] + v[1]);
        return rectPart(who + ' has ' + Pm + ' m of fencing for a rectangular garden. The garden will be ' + v[1] + ' m wide. How long will it be? Solve by substituting first, then check.', Pm, v[1], 'w', 'm', { sub: true, solEnd: ['The garden will be ' + v[0] + ' m long.'] });
      } }] },
      { num: '9', stem: 'A landscaper puts edging around rectangular garden plots. Use ' + t('w=(P-2l)\\div 2') + ' to complete the table.', parts: [
        { id: '9abc', sub: 'a–c', level: 'EMG', make: function (r) {
          var a = find(function () { return [r.int(9, 15), r.int(4, 8)]; }, function (v) { return v[1] < v[0] && !(v[0] === 11 && v[1] === 7); });
          var b = find(function () { return [pickR(r, 5.5, 9.5, 1), pickR(r, 2, 6, 1)]; }, function (v) { return v[1] < v[0]; });
          var c = find(function () { return [r.int(4, 9) * 5, r.int(2, 6) * 5]; }, function (v) { return v[1] < v[0]; });
          var rws = [[2 * (a[0] + a[1]), a[0], 'm'], [2 * (b[0] + b[1]), b[0], 'm'], [2 * (c[0] + c[1]), c[0], 'cm']];
          var blanks = rws.map(function (x, i) { var w = (x[0] - 2 * x[1]) / 2; return { i: i, j: 2, name: '(' + 'abc'.charAt(i) + ') width', chk: UF.chk(w, { bad: rectBad(x[0], x[1], 'l') }) }; });
          return UF.table('Find the width of each plot. (Type the number only; the units are in the table.)', { rows: ['(a)', '(b)', '(c)'].map(function (s) { return '\\text{' + s + '}'; }), cols: ['\\text{Edging }(P)', '\\text{Length }(l)', '\\text{Width }(w)'],
            cells: rws.map(function (x) { return [N(x[0]) + uT(x[2]), N(x[1]) + uT(x[2]), null]; }) }, blanks,
            rws.map(function (x) { return [N(x[0]) + uT(x[2]), N(x[1]) + uT(x[2]), N((x[0] - 2 * x[1]) / 2) + uT(x[2])]; }),
            rws.map(function (x, i) { return '(' + 'abc'.charAt(i) + ') ' + t('(' + N(x[0]) + '-' + N(2 * x[1]) + ')\\div 2=' + N(x[0] - 2 * x[1]) + '\\div 2=' + N((x[0] - 2 * x[1]) / 2) + uT(x[2])); }),
            ['Subtract two lengths from the edging, then divide by 2.'], 'plots table');
        } },
        { id: '9d', sub: 'd', level: 'PRG', make: function (r) {
          var v = find(function () { var l = r.int(4, 7) + r.pick([0.25, 0.75]), Pm = r.int(15, 24); return [Pm, l, (Pm - 2 * l) / 2]; }, function (v) { return v[2] > 1.5 && v[2] < v[1] && !(v[0] === 15 && v[1] === 2.75) && !near(v[2] % 1, 0); });
          return rectMixPart('(d) The edging is ' + v[0] + ' ft and the length is ' + t(L(v[1])) + ' ft. Find the width.', v[0], v[1], 'l', 'ft');
        } }] },
      { num: '10', stem: '', parts: [{ id: '10', level: 'PRG', make: function (r) {
        var v = find(function () { var l = r.int(60, 84) + 0.5, w = r.int(45, 70) + 0.5; return [2 * (l + w), l, w]; }, function (v) { return v[2] < v[1] - 4; }), who = r.pick(['Rosa', 'Hana', 'Sofia', 'Maya']);
        return rectMixPart(who + ' is sewing binding (a fabric strip) all the way around the edge of a rectangular quilt. She has exactly ' + v[0] + ' in of binding. The quilt is ' + t(L(v[1])) + ' in long. How wide can it be?', v[0], v[1], 'l', 'in', { solEnd: ['The quilt can be ' + t(L(v[2])) + ' in wide.'] });
      } }] },
      { num: '11', stem: function (sh) { return 'A rectangular ' + sh.what + ' has a perimeter of ' + sh.P + ' ft and is ' + sh.l + ' ft long. Here is ' + sh.who + '’s work:<br>' + t(sh.P + '=2(' + sh.l + ')+2w') + ', so ' + t(sh.P + '-' + sh.l + '=2w') + ', ' + t((sh.P - sh.l) + '=2w') + ', ' + t('w=' + N(sh.ww) + uT('ft')) + '.'; },
        shared: function (r) { var v = find(function () { return [r.int(7, 13) * 2, r.int(5, 14)]; }, function (v) { return v[1] < v[0] - 2; }); var Pm = 2 * (v[0] + v[1]); return { what: r.pick(['dance floor', 'deck', 'skating rink', 'stage']), who: r.pick(['Ella', 'Jordan', 'Kayla', 'Omar']), P: Pm, l: v[0], w: v[1], ww: (Pm - v[0]) / 2 }; },
        parts: [
          { id: '11a', level: 'BEG', outcome: M3, make: function (r, sh) { var chk = 2 * sh.l + 2 * sh.ww;
            return UF.num('Check ' + sh.who + '’s answer by substituting back: what perimeter do ' + t('l=' + sh.l) + ' and ' + t('w=' + N(sh.ww)) + ' give?', chk, { after: 'ft', bad: [[sh.l + sh.ww, 'u3l7-check-half', 'Go all the way around: two lengths <b>and</b> two widths, ' + t('2(' + sh.l + ')+2(' + N(sh.ww) + ')') + '.'], [2 * sh.l + sh.ww, 'u3l7-check-half', 'There are <b>two</b> widths: ' + t('2(' + N(sh.ww) + ')') + '.'], [sh.l + 2 * sh.ww, 'u3l7-check-half', 'There are <b>two</b> lengths: ' + t('2(' + sh.l + ')') + '.']],
              sol: [t('P=2l+2w=2(' + sh.l + ')+2(' + N(sh.ww) + ')=' + 2 * sh.l + '+' + N(2 * sh.ww) + '=' + N(chk)), 'That is not ' + sh.P + ' ft, so the answer is wrong. ✗'], hints: ['Put both numbers back into ' + t('P=2l+2w') + '.'], text: 'check back' }); } },
          { id: '11b', level: 'EMG', make: function (r, sh) {
            return P.mc(r, 'What mistake did ' + sh.who + ' make?', [
              { html: 'She subtracted ' + t(sh.l) + ' (one length) instead of ' + t('2(' + sh.l + ')=' + 2 * sh.l) + ' (two lengths).', right: true },
              { html: 'She forgot to divide by 2.', why: 'She did divide by 2 (' + t((sh.P - sh.l) + '\\div 2') + '). Look at how much she subtracted.', code: 'u3l7-no-step2' },
              { html: 'She should have added ' + t(sh.l) + ' instead of subtracting.', why: 'To undo “+ 2l” you do subtract. The problem is how much she subtracted.', code: 'u3l7-added' },
              { html: 'There is no mistake: ' + N(sh.ww) + ' ft is right.', why: 'Substitute back: ' + t('2(' + sh.l + ')+2(' + N(sh.ww) + ')=' + N(2 * sh.l + 2 * sh.ww)) + ', not ' + sh.P + '.', code: 'fine' }],
              br(['The perimeter has <b>two</b> lengths: ' + t('2(' + sh.l + ')=' + 2 * sh.l) + '.', 'She subtracted only ' + sh.l + '.']), ['Look at the second step of her work. How many lengths are in ' + t('2(' + sh.l + ')') + '?'], 'Ella mistake'); } },
          { id: '11c', level: 'EMG', make: function (r, sh) { var p = rectPart('Find the correct width.', sh.P, sh.l, 'l', 'ft', { sub: true }); return p; } }] },
      { num: '12', stem: function (sh) { return sh.who + ' is building a rectangular goat pen against the side of a barn. The barn wall is one length, so the fence goes on only three sides: one length and two widths.' + barnPen(); },
        shared: function (r) { return find(function () { var pr = r.pick([12.5, 14.75, 15.5, 16.25, 18, 13.75]), F = r.int(28, 56), l = r.int(12, 24); return { who: r.pick(['Owen', 'Liam', 'Theo', 'Malik']), pr: pr, F: F, S: q(F * pr), l: l, w: (F - l) / 2 }; }, function (s) { return (s.F - s.l) % 2 === 0 && s.w >= 5 && s.w <= s.l; }); },
        parts: [
          { id: '12a', level: 'BEG', outcome: M3, make: function (r, sh) { return UF.num('(a) Fence costs ' + Mp(sh.pr) + ' per metre. ' + sh.who + ' spends ' + Mp(sh.S) + '. How many metres of fence does he buy?', sh.F, { after: 'm',
            bad: [[sh.pr / sh.S, 'u3l7-upside', 'Divide the <b>money</b> by the price per metre.'], [sh.S * sh.pr, 'u3l7-money', 'Each metre costs ' + Mp(sh.pr) + ', so <b>divide</b> the money he spends by ' + Mp(sh.pr) + '.']],
            sol: ['metres of fence = money ÷ price per metre', t(M(sh.S) + '\\div ' + M(sh.pr) + '=' + sh.F + uT('m'))], hints: ['How many times does ' + Mp(sh.pr) + ' go into ' + Mp(sh.S) + '?'], text: 'fence metres' }); } },
          { id: '12b', level: 'PRG', make: function (r, sh) {
            return mcF(r, '(b) The fence length is ' + t('F=l+2w') + '. Rearrange it to find ' + t('w') + '.', [['w=(F-l)\\div 2', 1], ['w=F-l\\div 2', 0, 'Without brackets only ' + t('l') + ' is divided by 2. Subtract first, then divide all of ' + t('F-l') + ' by 2: use brackets.', 'u3l7-no-brackets'],
              ['w=(F-2l)\\div 2', 0, 'Only <b>one</b> length is fenced (the barn is the other). Subtract ' + t('l') + ', not ' + t('2l') + '.', 'u3l7-barn'], ['w=F-l', 0, t('F-l') + ' is <b>both</b> widths. Step 2: divide by 2.', 'u3l7-no-step2']],
              ['Subtract ' + t('l') + ' from both sides: ' + t('F-l=2w'), 'Divide both sides by 2: ' + t('w=(F-l)\\div 2')], ['Undo the “+ l” first, then the “× 2”.'], 'F=l+2w');
          } },
          { id: '12c', level: 'PRG', make: function (r, sh) { return UF.num('(c) The pen will be ' + sh.l + ' m long. How wide will it be? (Use the fence from (a).)', sh.w, { after: 'm',
            bad: [[(sh.F - 2 * sh.l) / 2, 'u3l7-barn', 'Only <b>one</b> length is fenced (the barn wall is the other one). Use ' + t('w=(F-l)\\div 2') + '.'], [sh.F - sh.l, 'u3l7-no-step2', t(sh.F + '-' + sh.l + '=' + (sh.F - sh.l)) + ' is <b>both</b> widths. Divide by 2.'], [sh.F / 2 - sh.l, 'u3l7-half-two', 'Use ' + t('w=(F-l)\\div 2') + ': subtract first, then divide.'], [(sh.F + sh.l) / 2, 'u3l7-added', 'Subtract the length, don’t add it.']],
            sol: [t('w=(F-l)\\div 2=(' + sh.F + '-' + sh.l + ')\\div 2=' + (sh.F - sh.l) + '\\div 2=' + N(sh.w) + uT('m')), 'Check: ' + t(sh.l + '+2(' + N(sh.w) + ')=' + sh.F) + ' m ✓', 'The pen will be ' + N(sh.w) + ' m wide.'], hints: ['Use your formula from (b) with ' + t('F=' + sh.F) + ' and ' + t('l=' + sh.l) + '.'], text: 'pen width' }); } }] },
      { num: '13', stem: function (sh) { return sh.who + ' has a ' + N(sh.R) + ' m roll of flexible edging for a flower bed. She wants to use all of it.'; },
        shared: function (r) { return { who: r.pick(['Ana', 'Priya', 'Noor', 'Jaya']), R: find(function () { return pickR(r, 6.2, 12.6, 0.1); }, function (R) { return decs(R) === 1 && decs(R / 4) === 3 && Math.abs((R / PI * 10) % 1 - 0.5) > 0.05; }) }; },
        parts: [
          { id: '13a', level: 'EMG', make: function (r, sh) { return diamPart('(a) If the bed is a circle, what is its diameter, to the nearest tenth of a metre?', sh.R, 1, 'm'); } },
          { id: '13b', level: 'EMG', make: function (r, sh) { var s = sh.R / 4; return UF.num('(b) If the bed is a square, how long is each side, to the nearest hundredth of a metre?', rd(s, 2), { dp: 2, exact: s, after: 'm',
            bad: [[sh.R / 2, 'u3l7-half', 'A square has <b>four</b> equal sides: divide by 4.'], [sh.R * 4, 'u3l7-x4', 'To undo “× 4”, divide by 4.'], [sh.R / PI, 'u3l7-diam', 'That’s the circle. For a square, ' + t('s=P\\div 4') + '.']],
            sol: [t('s=P\\div 4=' + N(sh.R) + '\\div 4' + eqR(s, 2) + uT('m'))], hints: [t('s=P\\div 4') + '. Round to the nearest hundredth.'], text: 'square side' }); } }] },
      { num: '14', stem: '', parts: [{ id: '14', level: 'EMG', make: function (r) { var g = r.chance(0.7) ? 'l' : 'w'; return RE.rect(r, g, 'Which is ' + t('P=2l+2w') + ' rearranged to find ' + t(g === 'l' ? 'w' : 'l') + '?'); } }] },
      { num: '15', stem: '', parts: [{ id: '15', level: 'EMG', make: function (r) {
        var d = r.pick([3.5, 4, 4.5, 5, 5.5, 6, 7, 8]), C = rd(PI * d, 2), thing = r.pick(['round swimming pool', 'round fountain', 'round sandbox']);
        var opts = [[rd(C * PI, 1), 0, 'That multiplies by π. To undo “× π”, divide: ' + t('d=C\\div\\pi') + '.', 'u3l7-times-pi'], [rd(C / 2 / PI, 1), 0, 'That divides by 2π, which gives the <b>radius</b>.', 'u3l7-radius'], [rd(C / PI, 1), 1], [rd(C / 2, 1), 0, 'Divide by π (about 3.14), not by 2.', 'u3l7-half']];
        return P.mc(r, 'A ' + thing + ' has a circumference of ' + C.toFixed(2) + ' m. Its diameter is about', opts.map(function (o) { return { html: o[0].toFixed(1) + ' m', right: !!o[1], why: o[2], code: o[3] }; }),
          br([t('d=C\\div\\pi=' + C.toFixed(2) + '\\div\\pi\\approx ' + rd(C / PI, 2).toFixed(2)) + ' m']), ['A diameter is a bit less than a third of the circumference.'], 'pool MC');
      } }] },
      { num: '16', stem: '', parts: [{ id: '16', level: 'EMG', make: function (r) {
        var v = find(function () { var l = r.int(8, 13) + r.pick([0.25, 0.75]), w = r.int(4, 8) + r.pick([0, 0.25, 0.5, 0.75]); return [2 * (l + w), l, w]; }, function (v) { return v[2] < v[1] - 1 && decs(v[2]) === 2 && Number.isInteger(v[0]) && v[0] !== 36; });
        return rectPart('<b>Numerical response.</b> A rectangular ' + r.pick(['sign', 'window', 'garden bed']) + ' has a perimeter of ' + v[0] + ' ft. It is ' + N(v[1]) + ' ft long. Its width, in feet, is ___.', v[0], v[1], 'l', 'ft', { nr: true });
      } }] },
      { num: '17', stem: '', parts: [{ id: '17', level: 'EMG', make: function (r) {
        var C = find(function () { return pickR(r, 50, 120, 0.1); }, function (C) { return Math.abs((C / 2 / PI * 10) % 1 - 0.5) > 0.06 && C !== 113 && rd(C / 2 / PI, 1) < 100; });
        return radPart('<b>Numerical response.</b> A round ' + r.pick(['clock face', 'mirror', 'serving tray']) + ' has a circumference of ' + N(C) + ' cm. Its radius, to the nearest tenth of a centimetre, is ___ cm.', C, 1, 'cm', { nr: true });
      } }] }
    ],
    extra: [
      { num: '1', section: 'A. Skills', stem: 'Substitute, then undo to find the missing value.', parts: [
        { id: 'e1a', level: 'BEG', make: function (r) { var Pm = find(function () { return r.int(9, 30); }, function (x) { return x % 4 !== 0 && x % 2 === 1; }); return squarePart(Pm, 'ft'); } },
        { id: 'e1b', level: 'BEG', make: function (r) { var v = find(function () { return [r.int(8, 15), r.int(4, 9)]; }, function (v) { return v[1] < v[0]; }); return areaSidePart(v[0] * v[1], v[1], 'w', 'cm'); } },
        { id: 'e1c', level: 'EMG', make: function (r) { var C = find(function () { return r.int(30, 80); }, function (C) { return Math.abs((C / PI * 10) % 1 - 0.5) > 0.06; }); return diamPart(t('C=\\pi d') + '; ' + t('C=' + C + uT('in')) + '. Find ' + t('d') + ' to the nearest tenth.', C, 1, 'in'); } },
        { id: 'e1d', level: 'BEG', make: function (r) { var v = find(function () { return [r.int(8, 18), r.int(10, 20), r.int(6, 18)]; }, function (v) { return v[0] !== v[1]; }); return triPart(v[0] + v[1] + v[2], v[0], v[1], 'm'); } }] },
      { num: '2', stem: 'Rearrange each formula to find the letter shown.', parts: [
        { id: 'e2a', level: 'BEG', make: function (r) { return RE.lw(r, 'w'); } },
        { id: 'e2b', level: 'EMG', make: function (r) { return RE.c(r); } },
        { id: 'e2c', level: 'EMG', make: function (r) { return RE.r(r); } },
        { id: 'e2d', level: 'EMG', make: function (r) { return RE.rect(r, 'w'); } }] },
      { num: '3', stem: 'Find the missing side of each rectangle.', parts: [
        { id: 'e3a', level: 'EMG', make: function (r) { var v = find(function () { return [r.int(7, 14), r.int(3, 8)]; }, function (v) { return v[1] < v[0]; }), Pm = 2 * (v[0] + v[1]); return rectPart(t('P=' + Pm + uT('cm')) + ', ' + t('l=' + v[0] + uT('cm')) + '. Find ' + t('w') + '.', Pm, v[0], 'l', 'cm'); } },
        { id: 'e3b', level: 'EMG', make: function (r) { var v = find(function () { return [pickR(r, 4, 7.5, 0.1), pickR(r, 2.1, 3.9, 0.1)]; }, function (v) { return v[1] < v[0] - 0.5 && decs(v[0]) <= 1; }), Pm = q(2 * (v[0] + v[1])); return rectPart(t('P=' + N(Pm) + uT('m')) + ', ' + t('w=' + N(v[1]) + uT('m')) + '. Find ' + t('l') + '.', Pm, v[1], 'w', 'm'); } },
        { id: 'e3c', level: 'PRG', make: function (r) { var v = find(function () { var l = r.int(9, 15) + r.pick([0.25, 0.75]), w = r.int(6, 12) + r.pick([0, 0.25]); return [2 * (l + w), l, w]; }, function (v) { return v[2] < v[1] && !near(v[0] % 1, 0); }); return rectMixPart(t('P=' + L(v[0]) + uT('in')) + ', ' + t('l=' + L(v[1]) + uT('in')) + '. Find ' + t('w') + '.', v[0], v[1], 'l', 'in'); } }] },
      { num: '4', stem: '', parts: [{ id: 'e4', level: 'EMG', make: function (r) {
        var Cs = [rd(PI * r.pick([12, 14, 16, 18, 22, 24]), 1), find(function () { return pickR(r, 2.5, 8.9, 0.1); }, function (C) { return Math.abs((C / PI * 10) % 1 - 0.5) > 0.06 && Math.abs((C / 2 / PI * 10) % 1 - 0.5) > 0.06; })], us = ['cm', 'm'];
        var blanks = [], keyC = [], sol = [];
        Cs.forEach(function (C, i) {
          var d = C / PI, rr = d / 2, rAlt = rd(rd(d, 1) / 2, 1);
          blanks.push({ i: i, j: 1, name: '(' + 'ab'.charAt(i) + ') diameter', chk: UF.chk(rd(d, 1), { dp: 1, exact: d, bad: diamBad(C, 1) }) });
          blanks.push({ i: i, j: 2, name: '(' + 'ab'.charAt(i) + ') radius', chk: UF.chk(rd(rr, 1), { dp: 1, exact: rr, alts: [rAlt], bad: radBad(C, 1).filter(function (b) { return !near(b[0], C / PI); }).concat([[d, 'u3l7-diam', 'That’s the diameter. The radius is half of it: ' + t('d\\div 2') + '.'], [d * 2, 'u3l7-times', 'The radius is <b>half</b> the diameter: divide by 2.']]) }) });
          keyC.push([N(C) + uT(us[i]), N(rd(d, 1), 1) + uT(us[i]), N(rd(rr, 1), 1) + uT(us[i])]);
          sol.push('(' + 'ab'.charAt(i) + ') ' + t(N(C) + '\\div\\pi' + eqR(d, 1)) + '; ' + t(raw(d, 2) + '\\div 2' + eqR(rr, 1)));
        });
        return UF.table('Complete the table for each circle. Round to the nearest tenth.', { rows: ['\\text{(a)}', '\\text{(b)}'], cols: ['\\text{Circumference}', '\\text{Diameter }(C\\div\\pi)', '\\text{Radius }(d\\div 2)'], cells: Cs.map(function (C, i) { return [N(C) + uT(us[i]), null, null]; }) },
          blanks, keyC, sol, ['Diameter = circumference ÷ π.', 'Radius = diameter ÷ 2.'], 'circle table');
      } }] },
      { num: '5', stem: 'Substitute back to check each answer.', parts: [
        { id: 'e5a', level: 'EMG', make: function (r) {
          var v = find(function () { return [r.int(10, 18), r.int(5, 12)]; }, function (v) { return v[1] < v[0]; }), Pm = 2 * (v[0] + v[1]), good = r.chance(0.5), claim = good ? v[1] : r.pick([v[1] + 1, v[1] - 1, (Pm - v[0]) / 2]), who = r.pick(['Lee', 'Sam', 'Ravi']);
          var back = 2 * v[0] + 2 * claim;
          return P.mc(r, '(a) A rectangle has ' + t('P=' + Pm + uT('m')) + ' and ' + t('l=' + v[0] + uT('m')) + '. ' + who + ' says ' + t('w=' + N(claim) + uT('m')) + '. Is ' + who + ' correct?', [
            { html: 'Correct: ' + t('2(' + v[0] + ')+2(' + N(claim) + ')=' + N(back)) + (good ? ' ✓' : ''), right: good, why: good ? null : 'Work it out: ' + t('2(' + v[0] + ')+2(' + N(claim) + ')=' + N(back)) + ', not ' + Pm + '.', code: 'said-correct' },
            { html: 'Not correct: ' + t('2(' + v[0] + ')+2(' + N(claim) + ')=' + N(back)) + '. The width is ' + t(N(v[1]) + uT('m')) + '.', right: !good, why: good ? 'Work it out: ' + t('2(' + v[0] + ')+2(' + N(claim) + ')=' + N(back)) + ', which is the perimeter. So the width is right.' : null, code: 'said-not' },
            { html: 'Not correct: the width is ' + t(N(Pm - 2 * v[0]) + uT('m')) + '.', right: false, why: t(N(Pm - 2 * v[0])) + ' is both widths together.', code: 'u3l7-no-step2' }],
            br(['Substitute: ' + t('2(' + v[0] + ')+2(' + N(claim) + ')=' + N(back)) + '.', good ? 'That is the perimeter, so ' + who + ' is correct.' : 'That is not ' + Pm + ', so ' + who + ' is not correct. ' + t('w=(' + Pm + '-' + 2 * v[0] + ')\\div 2=' + N(v[1]) + uT('m'))]), ['Put the answer back into ' + t('P=2l+2w') + '. Do you get the perimeter?'], 'Lee check');
        } },
        { id: 'e5b', level: 'EMG', make: function (r) {
          var C = find(function () { return r.int(25, 70); }, function (C) { return Math.abs((C / PI * 10) % 1 - 0.5) > 0.06; }), dd = rd(C / PI, 1), good = r.chance(0.4), claim = good ? dd : Math.round(C / 3.3), who = r.pick(['Jo', 'Mia', 'Dani']);
          if (!good && near(claim, dd)) claim = dd - 1;
          var back = rd(PI * claim, 1);
          return P.mc(r, '(b) A circle has ' + t('C=' + C + uT('cm')) + '. ' + who + ' says ' + t('d=' + N(claim) + uT('cm')) + '. Is ' + who + ' correct?', [
            { html: 'Correct: ' + t('\\pi\\times ' + N(claim) + '\\approx ' + N(back)) + (good ? ', which is about ' + C + ' ✓' : ''), right: good, why: good ? null : t('\\pi\\times ' + N(claim) + '\\approx ' + N(back)) + ', not ' + C + '.', code: 'said-correct' },
            { html: 'Not correct: ' + t('\\pi\\times ' + N(claim) + '\\approx ' + N(back)) + '. The diameter is about ' + t(N(dd) + uT('cm')) + '.', right: !good, why: good ? t('\\pi\\times ' + N(claim) + '\\approx ' + N(back)) + ', which rounds to ' + C + '. So it is correct.' : null, code: 'said-not' },
            { html: 'Not correct: the diameter is ' + t(N(rd(C * PI, 1)) + uT('cm')) + '.', right: false, why: 'A diameter can’t be longer than the distance around. Divide by π.', code: 'u3l7-times-pi' }],
            br(['Substitute: ' + t('\\pi\\times ' + N(claim) + '\\approx ' + N(back)) + '.', good ? 'That rounds to ' + C + ', so ' + who + ' is correct.' : 'That is not ' + C + '. ' + t('d=' + C + '\\div\\pi' + eqR(C / PI, 1) + uT('cm'))]), ['Multiply π by the diameter. Do you get the circumference?'], 'Jo check');
        } }] },
      { num: '6', section: 'B. Applying', stem: '', parts: [{ id: 'e6', level: 'EMG', make: function (r) {
        var C = find(function () { return pickR(r, 8.5, 16.5, 0.1); }, function (C) { return Math.abs((C / PI * 10) % 1 - 0.5) > 0.06 && decs(C) === 1; });
        return diamPart('A round trampoline has a safety pad all the way around its edge. The pad is ' + N(C) + ' m long. Find the diameter of the trampoline, to the nearest tenth of a metre.', C, 1, 'm');
      } }] },
      { num: '7', stem: '', parts: [{ id: 'e7', level: 'EMG', make: function (r) { var l = r.pick([180, 185, 190, 195, 200, 210]), w = r.int(16, 20) * 5, Pm = 2 * (l + w); return rectPart('The boards around a rectangular hockey rink have a total length of ' + Pm + ' ft. The rink is ' + l + ' ft long. How wide is it?', Pm, l, 'l', 'ft', { solEnd: ['The rink is ' + w + ' ft wide.'] }); } }] },
      { num: '8', stem: '', parts: [{ id: 'e8', level: 'PRG', make: function (r) {
        var v = find(function () { var w = r.int(30, 50) + 0.5, h = r.int(28, 48) + r.pick([0, 0, 0.5]); return [2 * (w + h), w, h]; }, function (v) { return Number.isInteger(v[0]) && v[0] !== 167; });
        return rectMixPart('A carpenter used ' + v[0] + ' in of trim all the way around a rectangular window. The window is ' + t(L(v[1])) + ' in wide. How tall is it?', v[0], v[1], 'w', 'in', { solEnd: ['The window is ' + t(L(v[2])) + ' in tall.'] });
      } }] },
      { num: '9', stem: function (sh) { return 'A rectangular rug covers ' + N(sh.A) + ' m² of floor. It is ' + N(sh.l) + ' m long.'; },
        shared: function (r) { return find(function () { var l = pickR(r, 2, 3.2, 0.1), w = pickR(r, 1.2, 2.4, 0.1), H = r.pick([1.5, 2]); return { l: l, w: w, A: q(l * w), H: H }; }, function (s) { return s.w < s.l - 0.3 && Math.abs(s.w - s.H) >= 0.1 && decs(s.A) === 2 && s.A !== 7.5; }); },
        parts: [
          { id: 'e9a', level: 'EMG', make: function (r, sh) { return areaSidePart(sh.A, sh.l, 'l', 'm', { prompt: '(a) How wide is the rug?' }); } },
          { id: 'e9b', level: 'BEG', make: function (r, sh) { var fits = sh.w < sh.H;
            return P.mc(r, '(b) Will it fit (across its width) in a hallway that is ' + N(sh.H) + ' m wide?', [
              { html: '<b>Yes.</b> ' + N(sh.w) + ' m is less than ' + N(sh.H) + ' m.', right: fits, why: fits ? null : 'Compare your width from (a) with ' + N(sh.H) + ' m: ' + N(sh.w) + ' is more.', code: 'yes' },
              { html: '<b>No.</b> ' + N(sh.w) + ' m is more than ' + N(sh.H) + ' m.', right: !fits, why: fits ? 'Compare your width from (a) with ' + N(sh.H) + ' m: ' + N(sh.w) + ' is less.' : null, code: 'no' },
              { html: '<b>No.</b> The area, ' + N(sh.A) + ' m², is more than ' + N(sh.H) + ' m.', right: false, why: 'Compare a <b>length</b> with a length: the rug’s width with the hallway’s width.', code: 'area' }],
              br(['The rug is ' + N(sh.w) + ' m wide. ' + (fits ? 'That is less than ' + N(sh.H) + ' m, so yes, it fits.' : 'That is more than ' + N(sh.H) + ' m, so no, it does not fit.')]), ['Compare the width you found in (a) with the hallway.'], 'rug fit'); } }] },
      { num: '10', stem: '', parts: [{ id: 'e10', level: 'PRG', make: function (r) {
        var s = find(function () { var pr = r.pick([3.5, 4.25, 4.5, 5.75, 3.25]), l = r.int(8, 16), w = r.int(5, 12); return { pr: pr, l: l, w: w, Pm: 2 * (l + w) }; }, function (s) { return s.w < s.l && s.l !== 7; }), who = r.pick(['Kaya', 'Aisha', 'Sofia', 'Kenji']);
        var S = q(s.Pm * s.pr);
        return UF.fields(who + ' is putting LED strip lights all the way around the railing of a rectangular deck. The lights cost ' + Mp(s.pr) + ' per foot, and ' + (who === 'Kenji' ? 'he' : 'she') + ' spends ' + Mp(S) + '. The deck is ' + s.l + ' ft long. How wide is it?', [
          { label: 'Feet of lights (the perimeter):', name: 'Perimeter', ans: s.Pm, after: 'ft', bad: [[s.pr / S, 'u3l7-upside', 'Divide the <b>money</b> by the price per foot.'], [S * s.pr, 'u3l7-money', 'Divide the money by the price per foot.']] },
          { label: 'Width of the deck:', name: 'Width', ans: s.w, after: 'ft', bad: rectBad(s.Pm, s.l, 'l').concat([[(S - 2 * s.l) / 2, 'u3l7-money', 'First change the money to feet of lights: ' + t(M(S) + '\\div ' + M(s.pr)) + '. That is the perimeter.']]) }],
          ['feet of lights = ' + t(M(S) + '\\div ' + M(s.pr) + '=' + s.Pm) + ' ft (this is the perimeter)', t('w=(' + s.Pm + '-2\\times ' + s.l + ')\\div 2=' + (s.Pm - 2 * s.l) + '\\div 2=' + s.w + uT('ft')), 'Check: ' + t('2(' + s.l + ')+2(' + s.w + ')=' + s.Pm) + ' ft ✓'],
          ['Money ÷ price per foot = feet of lights (the perimeter).', 'Then use ' + t('w=(P-2l)\\div 2') + '.'], 'LED deck');
      } }] },
      { num: '11', stem: '', parts: [{ id: 'e11', level: 'EMG', make: function (r) {
        var C = find(function () { return r.int(20, 60); }, function (C) { return C !== 113; }), rr = C / 2 / PI, who = r.pick(['Ravi', 'Noor', 'Tyler']);
        var o = [[keys([String(C), '÷', '2', '×', 'π', 'ENTER']), 0, 'This divides by 2 and then <b>multiplies</b> by π (it gives ' + N(rd(C / 2 * PI, 1)) + '). Use brackets around 2 × π.', 'u3l7-no-brackets'],
          [keys([String(C), '÷', '(', '2', '×', 'π', ')', 'ENTER']), 1], [keys([String(C), '×', '2', '÷', 'π', 'ENTER']), 0, 'This multiplies by 2 (it gives ' + N(rd(C * 2 / PI, 1)) + '). The radius is C ÷ (2π).', 'u3l7-times'],
          [keys(['2', '×', 'π', '÷', String(C), 'ENTER']), 0, 'This divides the wrong way (it gives ' + N(rd(2 * PI / C, 2)) + '). C goes first.', 'u3l7-upside']];
        return P.mc(r, who + ' wants the radius of a circle with a circumference of ' + C + ' cm. Which calculator keys are correct?', o.map(function (x) { return { html: x[0], right: !!x[1], why: x[2], code: x[3] }; }),
          br([t('r=C\\div(2\\pi)=' + C + '\\div 6.283\\ldots' + eqR(rr, 2) + uT('cm')), 'The brackets make the calculator multiply 2 × π first.']), ['The radius is C ÷ (2π). Which keys divide by all of 2π?'], 'radius keys');
      } }] },
      { num: '12', stem: '', parts: [{ id: 'e12', level: 'EMG', make: function (r) {
        var v = find(function () { var h = pickR(r, 0.85, 1.35, 0.05), w = pickR(r, 1.2, 2.2, 0.05); return [q(2 * (h + w)), h, w]; }, function (v) { return decs(v[0]) <= 1 && decs(v[2]) === 2 && v[2] > v[1] + 0.1 && v[0] !== 5.2; });
        return rectPart('<b>Numerical response.</b> A rectangular bulletin board has ' + N(v[0]) + ' m of border trim all the way around it. It is ' + N(v[1]) + ' m tall. Its width, to the nearest hundredth of a metre, is ___ m.', v[0], v[1], 'w', 'm', { nr: true, dp: 2 });
      } }] },
      { num: '13', section: 'C. Stretch', stem: function () { return 'A school track is two straight sides joined by two half circles. Its perimeter is ' + t('P=2l+\\pi d') + ', where ' + t('l') + ' is one straight side and ' + t('d') + ' is the diameter of the half circles.' + trackPic(); },
        parts: [
          { id: 'e13a', level: 'ADV', make: function (r) {
            return mcF(r, '(a) Rearrange the formula to find ' + t('l') + '.', [['l=(P-\\pi d)\\div 2', 1], ['l=P-\\pi d\\div 2', 0, 'Without brackets only ' + t('\\pi d') + ' is divided by 2. Subtract first, then divide all of ' + t('P-\\pi d') + ' by 2.', 'u3l7-no-brackets'],
              ['l=(P+\\pi d)\\div 2', 0, 'To undo “+ πd”, <b>subtract</b> πd.', 'u3l7-added'], ['l=P\\div 2-\\pi d', 0, 'If you halve P first, you must halve πd too. Subtract first, then divide by 2.', 'u3l7-half-two']],
              ['Subtract ' + t('\\pi d') + ': ' + t('P-\\pi d=2l'), 'Divide by 2: ' + t('l=(P-\\pi d)\\div 2')], ['Undo the + first, then the × 2.'], 'track rearrange');
          } },
          { id: 'e13b', level: 'MAS', make: function (r) {
            var v = find(function () { var Pt = r.pick([200, 250, 300, 400, 400]); return [Pt, r.int(Math.round(0.13 * Pt), Math.round(0.2 * Pt))]; }, function (v) { var l = (v[0] - PI * v[1]) / 2; return l > 20 && Math.abs((l * 10) % 1 - 0.5) > 0.06; }), l = (v[0] - PI * v[1]) / 2;
            return UF.num('(b) The track is ' + v[0] + ' m around and ' + t('d=' + v[1] + uT('m')) + '. How long is each straight side, to the nearest tenth of a metre?', rd(l, 1), { dp: 1, exact: l, after: 'm',
              bad: [[v[0] - PI * v[1], 'u3l7-no-step2', 'That is <b>both</b> straight sides together. Divide by 2.'], [v[0] - PI * v[1] / 2, 'u3l7-no-brackets', 'Subtract all of ' + t('\\pi d') + ' first, then divide by 2 (use brackets).'], [(v[0] - 2 * PI * v[1]) / 2, 'u3l7-radius', 'The two half circles together make <b>one</b> circle: ' + t('\\pi d') + ', not ' + t('2\\pi d') + '.'], [(v[0] - PI * v[1] / 2) / 2, 'u3l7-radius', 'Use the diameter in ' + t('\\pi d') + ' (not the radius).'], [v[0] / 2 - PI * v[1], 'u3l7-half-two', 'Use ' + t('l=(P-\\pi d)\\div 2') + ': subtract first, then divide.'], [(v[0] - 3.14 * v[1]) / 2, 'u3k-pi314', 'Use the ' + t('\\pi') + ' key: 3.14 changes the rounded answer.', 'form']],
              sol: [t('l=(P-\\pi d)\\div 2'), t('\\pi\\times ' + v[1] + '=' + raw(PI * v[1], 2)), t('l=(' + v[0] + '-' + raw(PI * v[1], 2) + ')\\div 2=' + raw(v[0] - PI * v[1], 2) + '\\div 2' + eqR(l, 1) + uT('m'))],
              hints: ['Use your formula from (a): ' + t('l=(P-\\pi d)\\div 2') + '.', 'Work out ' + t('\\pi d') + ' first.'], text: 'track straight' });
          } }] },
      { num: '14', stem: function (sh) { return sh.who + ' has ' + sh.P + ' m of fencing for a rectangular garden. She wants the length to be ' + (sh.k === 2 ? 'twice' : 'three times') + ' the width.'; },
        shared: function (r) { var k = r.chance(0.6) ? 2 : 3; return find(function () { var w = pickR(r, 2.5, 8, 0.5); return { k: k, w: w, l: k * w, P: 2 * (k + 1) * w, who: r.pick(['Thandi', 'Kayla', 'Hana', 'Rosa']) }; }, function (s) { return Number.isInteger(s.P); }); },
        parts: [
          { id: 'e14a', level: 'ADV', make: function (r, sh) { var k = sh.k, n = 2 * k + 2;
            return P.mc(r, '(a) Why is the perimeter ' + t(n + 'w') + '?', [
              { html: 'Replace ' + t('l') + ' with ' + t(k + 'w') + ': ' + t('P=2(' + k + 'w)+2w=' + 2 * k + 'w+2w=' + n + 'w') + '.', right: true },
              { html: 'Because the garden has ' + n + ' sides, and each one is ' + t('w') + ' long.', why: 'A rectangle has 4 sides. Replace ' + t('l') + ' with ' + t(k + 'w') + ' in ' + t('P=2l+2w') + '.', code: 'sides' },
              { html: t('P=' + k + 'w+2w+2=' + n + 'w') + '.', why: 'Check the algebra: ' + t('2(' + k + 'w)') + ' is ' + t(2 * k + 'w') + '.', code: 'algebra' },
              { html: 'Because ' + t(sh.P + '\\div ' + n + '=' + N(sh.w)) + '.', why: 'That uses the answer. Show why it works for <b>any</b> width: replace ' + t('l') + ' with ' + t(k + 'w') + '.', code: 'circular' }],
              br([t('P=2l+2w') + ' and ' + t('l=' + k + 'w') + '.', t('P=2(' + k + 'w)+2w=' + 2 * k + 'w+2w=' + n + 'w')]), ['Replace l with ' + t(k + 'w') + ' in ' + t('P=2l+2w') + '.'], 'why ' + n + 'w'); } },
          { id: 'e14b', level: 'MAS', make: function (r, sh) { var n = 2 * sh.k + 2;
            return UF.fields('(b) Find the width and the length.', [
              { label: 'Width:', name: 'Width', ans: sh.w, after: 'm', bad: [[sh.P / 4, 'u3l7-square', 'The garden is not a square. Use ' + t('P=' + n + 'w') + ': divide by ' + n + '.'], [sh.P / 2, 'u3l7-half-p', 'Use ' + t('P=' + n + 'w') + ': divide by ' + n + '.'], [sh.P / (sh.k + 1), 'u3l7-no-step2', 'Use ' + t('P=' + n + 'w') + ': there are ' + n + ' widths in the perimeter.'], [sh.P / n * sh.k, 'amt-swap', 'That’s the length. The width is the smaller side.']] },
              { label: 'Length:', name: 'Length', ans: sh.l, after: 'm', bad: [[sh.P / 4 * sh.k, 'u3l7-square', 'Find the width first (' + t('P\\div ' + n) + '), then multiply by ' + sh.k + '.'], [sh.P / (sh.k + 1), 'u3l7-no-step2', 'The length is ' + sh.k + ' times the width.']] }],
              [t(sh.P + '=' + n + 'w') + '; ' + t('w=' + sh.P + '\\div ' + n + '=' + N(sh.w) + uT('m')), t('l=' + sh.k + '\\times ' + N(sh.w) + '=' + N(sh.l) + uT('m')), 'Check: ' + t('2(' + N(sh.l) + ')+2(' + N(sh.w) + ')=' + N(2 * sh.l) + '+' + N(2 * sh.w) + '=' + sh.P) + ' ✓'],
              ['Use ' + t('P=' + n + 'w') + ' to find the width.', 'The length is ' + sh.k + ' times the width.'], 'Thandi');
          } }] },
      { num: '15', stem: '', parts: [{ id: 'e15', level: 'ADV', make: function (r) {
        var v = find(function () { var a = r.int(78, 110), g = r.int(12, 26); return [a, a + g]; }, function (v) { var d1 = v[0] / PI, d2 = v[1] / PI; return !(v[0] === 94 && v[1] === 113) && Math.abs(((d2 - d1) * 10) % 1 - 0.5) > 0.06; });
        var y = r.pick([[2021, 2025], [2022, 2026], [2020, 2025]]), d1 = v[0] / PI, d2 = v[1] / PI, g = d2 - d1, alt = rd(rd(d2, 1) - rd(d1, 1), 1), tree = r.pick(['poplar', 'spruce', 'maple', 'birch']);
        return UF.num('An arborist measures the circumference of the same ' + tree + ' tree every few years. In ' + y[0] + ' it was ' + v[0] + ' cm. In ' + y[1] + ' it was ' + v[1] + ' cm. By about how much did the tree’s diameter grow? Round to the nearest tenth of a centimetre.', rd(g, 1), { dp: 1, exact: g, alts: [alt], after: 'cm',
          bad: [[v[1] - v[0], 'u3l7-circ', 'That is how much the <b>circumference</b> grew. Change it to a diameter: divide by π.'], [(v[1] - v[0]) * PI, 'u3l7-times-pi', 'To undo “× π”, divide by π.'], [(v[1] - v[0]) / 2 / PI, 'u3l7-radius', 'That is how much the <b>radius</b> grew. The diameter is C ÷ π.'], [d2, 'u3l7-one-year', 'That is the diameter in ' + y[1] + '. Subtract the diameter in ' + y[0] + '.']],
          sol: [y[0] + ': ' + t('d=' + v[0] + '\\div\\pi' + eqR(d1, 2) + uT('cm')), y[1] + ': ' + t('d=' + v[1] + '\\div\\pi' + eqR(d2, 2) + uT('cm')), 'growth ' + t('=' + raw(d2, 2) + '-' + raw(d1, 2) + eqR(g, 1) + uT('cm')), '(Or in one step: ' + t('(' + v[1] + '-' + v[0] + ')\\div\\pi=' + (v[1] - v[0]) + '\\div\\pi\\approx ' + N(rd(g, 1), 1)) + ' cm.)' + (near(alt, rd(g, 1)) ? '' : ' Rounding each diameter first gives ' + N(alt, 1) + ' cm, which is also fine.')],
          hints: ['Find the diameter for each year (C ÷ π), then subtract.'], text: 'tree growth' });
      } }] }
    ]
  });
  HW.addCodes({ 'u3l7-circ': 'Gave the growth in circumference, not diameter', 'u3l7-one-year': 'Gave one year’s diameter, not the growth', 'amt-swap': 'Answers in each other’s boxes' });
})(window);
