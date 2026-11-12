/* Math 10-3 · Unit 3 · Lesson 11 — Surface Area of Cylinders, Pyramids and Cones (M4)
 * Assignment 11 (u3_l11.tex, Questions 1–17) and the Lesson 11 Extra Practice (u3_ep11.tex, A 1–5, B 6–12, C 13–15).
 * Every part is a generator: the same solid, the same pieces (closed, open at one end, side only, no base), the same
 * units and difficulty as the booklet item, new numbers around the booklet's (the lesson's worked-example numbers —
 * the 8 cm by 11 cm soup can, the 22½ in by 34½ in drum, the 18 in ottoman, the 0.6 m by 3.2 m columns, the 10/13/12 cm
 * pyramid, the 7 ft tent with 6½ ft walls, the 9/15/12 cm cone, the 5 cm waffle cone, the 6.4 m grain bin — are left out).
 * Calculator allowed (π key).
 * Answers: typed numbers; a unit typed after the number is ignored. Rounding as the booklet asks (nearest tenth / whole
 * number); too many decimals or too few gets a nudge (no try used); rounding the wrong way is wrong with a hint; exact
 * answers (pyramids) must be exact. π = 3.14 instead of the π key, and rounding the pieces before adding, get a nudge
 * when they change the rounded answer. Recognised wrong values each get their own hint: the diameter used as the radius,
 * one circle on a closed cylinder (or two on an open one), the side only, the circles added to a pipe or label, πrh for
 * the side, r × 2 for r², the volume πr²h, the height instead of the slant height (pyramid and cone), the cylinder's 2πrs
 * on a cone, a base added to a roof / hat / tent with no floor, the ½ left out of a triangle, one triangle instead of 4,
 * cm² to m² with 100, the bundles or cans not rounded up, the GST left out, and so on.
 * Conversions: "name the solid each net folds into" → multiple choice under a drawn net (SVG); the net of Q2 is drawn
 * with its labels; "will the label fit? explain" → multiple choice whose options are reasons (one right); "which can uses
 * less metal? show your work" → the two surface areas (boxes), then multiple choice; Tyler's mistake → multiple choice of
 * mistakes (his mistake varies: diameter as radius, one circle, or πrh), then the correct answer; the formula table
 * (Extra A1) → tap the formula for each piece; "which length is not needed" → multiple choice; Kai's claim → the two
 * surface areas, how many times as big, then multiple choice; numerical response → the 4-character NR box.
 *
 * Shared kit for Lesson 12 (u3l12.js): HW.u3sa (number reader and rounding-aware checker with targeted wrong values,
 * number / multi-box part builders, cylinder / cone / square-pyramid surface areas with booklet-style solution lines and
 * their usual mistakes, solid and net pictures). This file must load BEFORE u3l12.js.
 * Levels: LIM BEG EMG PRG ADV MAS (MAS: 12, Extra 13(b), Extra 15). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var PI = Math.PI;

  /* ======================= the Unit 3 surface-area kit (HW.u3sa) ======================= */
  var S = HW.u3sa = HW.u3sa || {};
  function q(x) { return Math.round(x * 1e9) / 1e9; }
  function rd(x, dp) { return K.roundTo(x, dp); }
  function trunc(x, d) { var f = Math.pow(10, d); return Math.floor(x * f + 1e-9) / f; }
  function near(a, b, e) { return Math.abs(a - b) <= (e == null ? 1e-9 * Math.max(1, Math.abs(a), Math.abs(b)) : e); }
  function nS(x, dp) { x = q(x); return dp != null ? x.toFixed(dp) : String(x); }
  function decs(x) { return (nS(x).split('.')[1] || '').length; }
  function N(x, dp) { var s = nS(x, dp); return Math.abs(x) >= 10000 ? HW.fmt(s) : s; }                        // TeX: 15\,079.6
  function Np(x, dp) { var s = nS(x, dp); return Math.abs(x) >= 10000 ? HW.fmt(s, true) : s; }                 // text: 15 079.6
  function raw(x, k) { var s = +x.toFixed(k == null ? 3 : k); return N(s) + (near(x, s, 1e-9) ? '' : '\\ldots'); }
  function rw(x) { return raw(x, Math.abs(x) < 10 ? 3 : 2); }
  function eqR(x, dp) { return dp == null || near(x, rd(x, dp), 1e-9) ? '=' + N(dp == null ? q(x) : rd(x, dp)) : '=' + raw(x, dp + 2) + '\\approx ' + N(rd(x, dp), dp); }
  function uT(s) { s = String(s || '').replace(/^ +/, ''); if (!s) return ''; return ('\\text{' + (s.charAt(0) === '/' ? '' : ' ') + s + '}').replace(/³/g, '}^3\\text{').replace(/²/g, '}^2\\text{').replace(/\\text\{\}/g, ''); }
  function br(a) { return (Array.isArray(a) ? a : [a]).filter(Boolean).join('<br>'); }
  function find(gen, test, fb) { for (var i = 0; i < 800; i++) { var v = gen(); if (v && test(v)) return v; } if (fb === undefined) throw new Error('u3sa: no numbers found'); return fb; }
  function pickR(r, lo, hi, step) { step = step || 1; return q(lo + step * r.int(0, Math.round((hi - lo) / step))); }
  function roundUp(v, step) { step = step || 1; return q(Math.ceil(q(v / step) - 1e-9) * step); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function placeWord(dp, money) { return money ? 'the nearest cent' : dp === 0 ? 'the nearest whole number' : dp === 1 ? 'the nearest tenth' : dp === 2 ? 'the nearest hundredth' : dp + ' decimal places'; }
  /* a mixed number of halves / quarters / eighths / sixteenths as TeX: 4.5 → 4\tfrac{1}{2} */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var x = a % b; a = b; b = x; } return a; }
  function mixT(x) {
    var w = Math.floor(x + 1e-9), f = q(x - w);
    if (near(f, 0, 1e-9)) return String(w);
    for (var d = 2; d <= 16; d++) { var n = Math.round(f * d); if (near(f, n / d, 1e-7)) { var g = gcd(n, d); return (w ? w : '') + '\\tfrac{' + n / g + '}{' + d / g + '}'; } }
    return N(x);
  }
  function M(x) { return '\\$' + rd(x, 2).toFixed(2); }
  function Mp(x) { return '$' + rd(x, 2).toFixed(2); }
  var NAMES = ['Amara', 'Kai', 'Malik', 'Noor', 'Jordan', 'Priya', 'Mateo', 'Kayla', 'Liam', 'Hana', 'Devon', 'Rosa', 'Theo', 'Aisha', 'Ben', 'Maya', 'Dani', 'Kenji', 'Sofia', 'Omar', 'Jaya', 'Ezra'];
  Object.assign(S, { rw: rw, q: q, rd: rd, trunc: trunc, near: near, nS: nS, decs: decs, N: N, Np: Np, raw: raw, eqR: eqR, uT: uT, br: br, find: find, pickR: pickR, roundUp: roundUp, cap: cap, mixT: mixT, M: M, Mp: Mp, NAMES: NAMES, placeWord: placeWord, gcd: gcd });

  /* ---- reading a typed number: strips $, \text{…} and a unit after the number ("252 cm²", "15.3 ft2") ---- */
  function readNum(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\(?:text|mathrm)\{([^{}]*)\}/g, '$1');
    s = s.replace(/\\\$|\$/g, '').replace(/\\[,;: !]|~| | /g, ' ').trim();
    var unit = '', um = /^(-?[\d.,\s]*\d\.?)\s*([a-zA-Z\/³²^°%'"][\s\S]*)$/.exec(s);
    if (um) { s = um[1].trim(); unit = um[2]; }
    if (/^-?\d*,\d{1,2}$/.test(s.replace(/\s/g, ''))) return { res: form('u3sa-comma', 'Use a decimal point (not a comma), like 12.5.') };
    var p = HW.parse.number(s);
    if (!p.ok) return { res: p.code === 'empty' ? form('empty', 'Type your answer first.') : form('notnumber', 'Type a single number (the unit is already written beside the box).') };
    var pl = HW.parse.plain(s).replace(/[\s,]/g, ''), d = (pl.split('.')[1] || '').length;
    return { v: p.value, d: d, unit: unit, len: pl.replace(/^-/, '').length };
  }
  S.readNum = readNum;

  /* ---- one number. o: { dp (rounding place; null = exact), money, exact (unrounded value, for the rounding-direction hint),
   *   exactOk (the unrounded value is right too), alts (other right values), bad [[value, code, hint, 'form'?]],
   *   nr (numerical response, 4 characters), miss (hint for any other value) } ---- */
  S.chk = function (ans, o) {
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
      if (isAcc(v)) {
        if (o.nr && a.len > 4) return form('nr-long', 'Numerical response answers fit in 4 boxes (digits and a decimal point only).');
        if (o.area && /³|\^\s*\(?\{?\s*3|[a-z]3$/.test(a.unit)) return form('u3sa-cube-unit', 'Right number, but area has a <b>squared</b> unit (like cm²), not a cubed unit. The unit is written beside the box.');
        return ok();
      }
      if (dp != null && d > dp && isAcc(rd(v, dp))) return form('round', 'Right — now round to ' + place + '.');
      if (dp != null && d < dp && acc.some(function (y) { return near(v, rd(y, d)) || near(v, trunc(y, d)); }))
        return form('places', o.money ? 'Give the amount to the cent (2 decimal places), like $12.50.' : 'Round to ' + place + ' (' + dp + ' decimal place' + (dp === 1 ? '' : 's') + ').');
      for (i = 0; i < bad.length; i++) if (mBad(v, d, bad[i][0])) return bad[i][3] === 'form' ? form(bad[i][1], bad[i][2]) : wrong(bad[i][1], bad[i][2]);
      if (dp == null && d < decs(want) && (near(v, rd(want, d)) || near(v, trunc(want, d)))) return form('u3sa-exact', 'Close, but don’t round this answer: give the exact value (' + decs(want) + ' decimal place' + (decs(want) === 1 ? '' : 's') + ').');
      if (dp != null && d === dp && !near(exact, want, 1e-9) && near(Math.abs(v - want), step, step / 20) && Math.abs(v - exact) < step)
        return wrong('u3sa-round-dir', 'Check your rounding: look at the next digit. 5 or more rounds up; 4 or less rounds down.');
      if (o.nr && a.len > 4) return form('nr-long', 'Numerical response answers fit in 4 boxes (digits and a decimal point only).');
      return wrong('value', o.miss || null);
    };
    f.bad = bad; f.key = o.exactOk && decs(exact) <= 4 ? nS(exact) : dp != null ? want.toFixed(dp) : nS(want); f.keyDp = o.exactOk ? null : dp;
    return f;
  };
  /* an estimate: anything within tol (default 12%) of the value */
  S.estChk = function (exact, o) {
    o = o || {}; var tol = o.tol || 0.12, bad = (o.bad || []).filter(function (b) { return b && isFinite(b[0]) && Math.abs(b[0] - exact) > tol * exact; });
    var f = function (resp) {
      var a = readNum(resp); if (a.res) return a.res;
      if (Math.abs(a.v - exact) <= tol * Math.abs(exact)) return ok();
      for (var i = 0; i < bad.length; i++) if (Math.abs(a.v - bad[i][0]) <= (bad[i][3] || tol) * Math.abs(bad[i][0])) return wrong(bad[i][1], bad[i][2]);
      return wrong('u3sa-est', o.miss || 'That estimate is too far off. Count again.');
    };
    f.bad = bad; return f;
  };

  /* ---- a number part. o: dp, money, exact, exactOk, alts, bad, before, after (unit beside the box, e.g. 'cm²'), sol, hints, text, nr, area ---- */
  S.num = function (prompt, ans, o) {
    o = o || {}; ans = q(ans);
    var chk = S.chk(ans, o), key = chk.key;
    var p = { prompt: prompt, input: { type: 'number', before: o.money ? '$' : o.before, after: o.after, nr: !!o.nr }, check: chk, key: key,
      answer: t((o.money ? '\\$' : '') + N(Number(key), chk.keyDp) + uT(o.after)), solution: br(o.sol), hints: o.hints || [], text: o.text };
    p.bad = chk.bad.filter(function (b) { return b[3] !== 'form'; }).map(function (b) { return nS(rd(b[0], 6)); });
    p.good = o.nr ? [] : [key + (o.after ? ' ' + o.after : '')].concat(o.money ? ['$' + key] : []);
    return p;
  };
  /* ---- several boxes. rows: [{ label, name, ans, dp, money, exact, exactOk, alts, bad, before, after, est ({ tol, bad, miss, dp }) }] ---- */
  S.fields = function (prompt, rows, sol, hints, text) {
    var chks = rows.map(function (rw, i) {
      if (rw.est) return S.estChk(rw.ans, rw.est);
      var others = rows.filter(function (x, j) { return j !== i && !x.est && !near(q(x.ans), q(rw.ans), 1e-9) && !(rw.dp != null && near(rd(x.ans, rw.dp), rd(rw.ans, rw.dp))); }).map(function (x) { return [x.ans, 'amt-swap', 'That’s the answer for another box (' + (x.name || x.label.replace(/:$/, '')) + '). Check which box is which.']; });
      return S.chk(q(rw.ans), { dp: rw.dp, money: rw.money, exact: rw.exact, exactOk: rw.exactOk, alts: rw.alts, bad: (rw.bad || []).concat(others), area: rw.area });
    });
    var keys = rows.map(function (rw, i) { return rw.est ? nS(rd(rw.ans, rw.est.dp == null ? 0 : rw.est.dp)) : chks[i].key; });
    var ans = rows.map(function (rw, i) { var dp = rw.est ? null : chks[i].keyDp; return rw.label + ' ' + (rw.est ? 'about ' : '') + t((rw.money ? '\\$' : '') + N(Number(keys[i]), dp) + uT(rw.after)); }).join(' &nbsp; ');
    var p = P.fields(prompt, rows.map(function (rw) { return { label: rw.label, before: rw.money ? '$' : rw.before, after: rw.after, name: rw.name || rw.label.replace(/:$/, '') }; }), chks, keys, ans, br(sol), hints, text);
    var b0 = []; rows.forEach(function (rw, i) { var bb = chks[i].bad.filter(function (b) { return b[3] !== 'form'; })[0]; if (bb) { var arr = keys.slice(); arr[i] = nS(rd(bb[0], 6)); b0.push(arr); } });
    p.bad = b0.slice(0, 3);
    return p;
  };

  /* ---- surface areas: { ans (exact), bad, sol (lines) } ----
   * cylinder with `ends` circles (2 closed, 1 open at one end, 0 side only). o: { d (the diameter was given), dp, u, endWord } */
  S.cyl = function (r, h, ends, o) {
    o = o || {}; var u = o.u || 'cm', dp = o.dp, circ = PI * r * r, side = 2 * PI * r * h, A = ends * circ + side, d = 2 * r, b = [];
    if (o.d) b.push([ends * PI * d * d + 2 * PI * d * h, 'u3sa-diam', 'Use the <b>radius</b>: halve the diameter first (' + t('r=' + N(d) + '\\div 2=' + N(r)) + ').']);
    if (ends === 2) { b.push([circ + side, 'u3sa-one-end', 'A closed cylinder has <b>two</b> circles (the top and the bottom): ' + t('2\\pi r^2') + '.']); b.push([side, 'u3sa-side-only', 'That’s only the curved side. A closed cylinder also has two circles: add ' + t('2\\pi r^2') + '.']); }
    if (ends === 1) { b.push([2 * circ + side, 'u3sa-extra-end', 'It is open at one end, so it has only <b>one</b> circle' + (o.endWord ? ' (' + o.endWord + ')' : '') + ': ' + t('\\pi r^2+2\\pi rh') + '.']); b.push([side, 'u3sa-side-only', 'Add the one circle' + (o.endWord ? ' (' + o.endWord + ')' : '') + ': ' + t('\\pi r^2') + '.']); }
    if (ends === 0) { b.push([2 * circ + side, 'u3sa-no-ends', 'It has <b>no ends</b>, so use only the curved side: ' + t('2\\pi rh') + '.']); b.push([circ + side, 'u3sa-no-ends', 'It has no ends: use only the curved side, ' + t('2\\pi rh') + '.']); }
    b.push([ends * circ + PI * r * h, 'u3sa-side-2', 'The side is ' + t('2\\pi rh') + ' (the rectangle is ' + t('2\\pi r') + ' long). Don’t forget the 2.']);
    if (ends) b.push([ends * PI * 2 * r + side, 'u3sa-r-times-2', t('r^2') + ' means ' + t('r\\times r') + ', not ' + t('r\\times 2') + '. Use the ' + t('x^2') + ' key.']);
    b.push([PI * r * r * h, 'u3sa-volume', 'That’s ' + t('\\pi r^2h') + ', the volume (the space inside). Surface area adds the pieces of the net: ' + (ends === 2 ? t('2\\pi r^2+2\\pi rh') : ends === 1 ? t('\\pi r^2+2\\pi rh') : t('2\\pi rh')) + '.']);
    b.push([ends * 3.14 * r * r + 2 * 3.14 * r * h, 'u3sa-pi314', 'Use the ' + t('\\pi') + ' key on your calculator: 3.14 is a little off, and it changes the rounded answer.', 'form']);
    if (dp != null && ends) b.push([rd(ends * circ, dp) + rd(side, dp), 'u3sa-early', 'Close! You rounded the pieces before adding. Keep all the decimals until the end, then round.', 'form']);
    var sol = [o.d ? t('r=' + N(d) + '\\div 2=' + N(r) + uT(u)) : ''];
    if (ends === 2) sol.push('Two circles: ' + t('2\\times\\pi\\times ' + N(r) + '^2=' + rw(2 * circ)));
    if (ends === 1) sol.push((o.endWord ? cap(o.endWord) : 'One circle') + ': ' + t('\\pi\\times ' + N(r) + '^2=' + rw(circ)));
    sol.push((ends ? 'Side: ' : 'Side only: ') + t('2\\times\\pi\\times ' + N(r) + '\\times ' + N(h) + (ends ? '=' + rw(side) : eqR(side, dp) + uT(u + '²'))));
    if (ends) sol.push(t('\\text{SA}=' + rw(ends * circ) + '+' + rw(side) + eqR(A, dp) + uT(u + '²')));
    return { ans: A, bad: b, sol: sol };
  };
  /* cone: base (true = closed). o: { d, hgt (the height, when it is shown), dp, u } */
  S.cone = function (r, s, base, o) {
    o = o || {}; var u = o.u || 'cm', dp = o.dp, B = PI * r * r, L = PI * r * s, A = (base ? B : 0) + L, d = 2 * r, b = [];
    if (o.d) b.push([(base ? PI * d * d : 0) + PI * d * s, 'u3sa-diam', 'Use the <b>radius</b>: halve the diameter first (' + t('r=' + N(d) + '\\div 2=' + N(r)) + ').']);
    if (base) b.push([L, 'u3sa-cone-no-base', 'That’s only the curved side. A closed cone also has its circle base: add ' + t('\\pi r^2') + '.']);
    else b.push([B + L, 'u3sa-cone-base', 'It has <b>no base</b>, so use only the curved side: ' + t('\\pi rs') + '.']);
    if (o.hgt) b.push([(base ? B : 0) + PI * r * o.hgt, 'u3sa-height', 'Use the <b>slant height</b> ' + t('s=' + N(s)) + ', not the height ' + N(o.hgt) + '. The slant height runs down the outside of the cone.']);
    b.push([(base ? B : 0) + 2 * PI * r * s, 'u3sa-cone-2', 'The curved side of a cone is ' + t('\\pi rs') + ' (no 2). ' + t('2\\pi rh') + ' is the side of a cylinder.']);
    if (base) b.push([B + PI * s, 'u3sa-cone-r', 'The curved side is ' + t('\\pi\\times r\\times s') + ': multiply by the radius too.']);
    b.push([(base ? 3.14 * r * r : 0) + 3.14 * r * s, 'u3sa-pi314', 'Use the ' + t('\\pi') + ' key on your calculator: 3.14 is a little off, and it changes the rounded answer.', 'form']);
    if (dp != null && base) b.push([rd(B, dp) + rd(L, dp), 'u3sa-early', 'Close! You rounded the pieces before adding. Keep all the decimals until the end, then round.', 'form']);
    var sol = [o.d ? t('r=' + N(d) + '\\div 2=' + N(r) + uT(u)) : ''];
    if (base) sol.push('Base: ' + t('\\pi\\times ' + N(r) + '^2=' + rw(B)), 'Side: ' + t('\\pi\\times ' + N(r) + '\\times ' + N(s) + '=' + rw(L)), t('\\text{SA}=' + rw(B) + '+' + rw(L) + eqR(A, dp) + uT(u + '²')));
    else sol.push('No base: side only, ' + t('\\pi rs'), t('\\pi\\times ' + N(r) + '\\times ' + N(s) + eqR(L, dp) + uT(u + '²')));
    if (o.hgt) sol.push('(The height, ' + N(o.hgt) + ' ' + u + ', is not used.)');
    return { ans: A, bad: b, sol: sol };
  };
  /* square pyramid: base (true = with the square base). o: { hgt, dp, u } */
  S.pyr = function (b0, s, base, o) {
    o = o || {}; var u = o.u || 'cm', dp = o.dp, Bs = b0 * b0, T = b0 * s / 2, A = (base ? Bs : 0) + 4 * T, Z = base ? Bs : 0, b = [];
    b.push([Z + 4 * b0 * s, 'u3sa-no-half', 'Each triangle is ' + t('\\tfrac{1}{2}\\times b\\times s') + '. Don’t forget the ' + t('\\tfrac{1}{2}') + '.']);
    b.push([Z + T, 'u3sa-one-tri', 'There are <b>4</b> triangles: multiply the area of one triangle by 4.']);
    b.push([Z + 2 * T, 'u3sa-one-tri', 'There are <b>4</b> triangles, not 2.']);
    if (base) b.push([4 * T, 'u3sa-pyr-no-base', 'Add the square base too: ' + t('b\\times b') + '.']);
    else b.push([Bs + 4 * T, 'u3sa-pyr-base', 'It has <b>no base</b> (no floor / bottom), so use only the 4 triangles.']);
    if (base) b.push([4 * b0 + 4 * T, 'u3sa-perim', 'The base is a square: its area is ' + t('b\\times b') + ', not ' + t('4\\times b') + '.']);
    if (o.hgt) { b.push([Z + 2 * b0 * o.hgt, 'u3sa-height', 'Use the <b>slant height</b> (' + N(s) + '), not the height (' + N(o.hgt) + '). The slant height is the height of each triangle face.']); b.push([Z + 4 * b0 * o.hgt, 'u3sa-height', 'Use the slant height ' + N(s) + ' (not the height), and ' + t('\\tfrac{1}{2}\\times b\\times s') + ' for each triangle.']); }
    var sol = [];
    if (base) sol.push('Base: ' + t(N(b0) + '\\times ' + N(b0) + '=' + N(Bs) + uT(u + '²')));
    sol.push('One triangle: ' + t('\\tfrac{1}{2}\\times ' + N(b0) + '\\times ' + N(s) + '=' + N(q(T)) + uT(u + '²')));
    sol.push('4 triangles: ' + t('4\\times ' + N(q(T)) + '=' + N(q(4 * T)) + uT(u + '²')));
    if (base) sol.push(t('\\text{SA}=' + N(Bs) + '+' + N(q(4 * T)) + eqR(A, dp) + uT(u + '²')));
    if (o.hgt) sol.push('(The height, ' + N(o.hgt) + ' ' + u + ', is not used.)');
    return { ans: A, bad: b, sol: sol };
  };
  /* a surface-area part from one of the above */
  S.saPart = function (prompt, res, o) {
    o = o || {};
    return S.num(prompt, res.ans, { dp: o.dp, exact: res.ans, after: o.u + '²', area: true, nr: o.nr, bad: res.bad.concat(o.bad || []), sol: (o.pre || []).concat(res.sol, o.post || []), hints: o.hints, text: o.text });
  };

  /* ---- pictures ---- */
  var INK = '#2b3340', FILL = '#f4faf9', FILL2 = '#e4efe9';
  function svgT(x, y, s, o) { o = o || {}; return '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" font-size="' + (o.size || 13) + '" text-anchor="' + (o.anchor || 'middle') + '" fill="' + (o.color || INK) + '"' + (o.italic ? ' font-style="italic"' : '') + '>' + s + '</text>'; }
  function svgL(a, b, o) { o = o || {}; return '<line x1="' + a[0].toFixed(1) + '" y1="' + a[1].toFixed(1) + '" x2="' + b[0].toFixed(1) + '" y2="' + b[1].toFixed(1) + '" stroke="' + INK + '" stroke-width="' + (o.w || 2) + '"' + (o.dash ? ' stroke-dasharray="5 4"' : '') + ' stroke-linecap="round"/>'; }
  function svgWrap(w, h, body, label, maxw) { return '<div style="margin:6px 0"><svg class="fig-svg" viewBox="0 0 ' + w + ' ' + h + '" width="100%" style="max-width:' + (maxw || w) + 'px" role="img" aria-label="' + label + '">' + body + '</svg></div>'; }
  S.svgT = svgT; S.svgL = svgL; S.svgWrap = svgWrap;
  S.solid = function (kind, opt) { return '<div style="margin:6px 0">' + HW.solid(kind, opt) + '</div>'; };
  /* net of a cylinder: rectangle (w by hh) with a circle above and below. lab: { len, h, r } */
  S.netCyl = function (lab, shape) {
    lab = lab || {}; shape = shape || {}; var w = shape.w || 170, hh = shape.h || 64, cr = shape.r || 26, x0 = 70, y0 = 12 + 2 * cr + 2, cx = x0 + w / 2;
    var g = '<rect x="' + x0 + '" y="' + y0 + '" width="' + w + '" height="' + hh + '" fill="' + FILL + '" stroke="' + INK + '" stroke-width="2"/>';
    g += '<circle cx="' + cx + '" cy="' + (y0 - cr) + '" r="' + cr + '" fill="' + FILL2 + '" stroke="' + INK + '" stroke-width="2"/>';
    g += '<circle cx="' + cx + '" cy="' + (y0 + hh + cr) + '" r="' + cr + '" fill="' + FILL2 + '" stroke="' + INK + '" stroke-width="2"/>';
    if (lab.r) g += '<circle cx="' + cx + '" cy="' + (y0 - cr) + '" r="2.4" fill="' + INK + '"/>' + svgL([cx, y0 - cr], [cx + cr, y0 - cr], { w: 1.4 }) + svgT(cx + cr + 6, y0 - cr + 4, lab.r, { anchor: 'start' });
    if (lab.len) g += svgT(cx, y0 + hh / 2 + 5, lab.len);
    if (lab.h) g += svgT(x0 - 6, y0 + hh / 2 + 5, lab.h, { anchor: 'end' });
    return svgWrap(x0 + w + 70, y0 + hh + 2 * cr + 12, g, 'net of a cylinder', 300);
  };
  /* net of a square pyramid: a square with a triangle on each side */
  S.netPyr = function (shape) {
    shape = shape || {}; var a = shape.b || 56, s = shape.s || 44, c = 20 + s + a / 2, h = a / 2;
    var tri = function (p) { return '<polygon points="' + p.map(function (x) { return x.join(','); }).join(' ') + '" fill="' + FILL + '" stroke="' + INK + '" stroke-width="2"/>'; };
    var g = tri([[c - h, c - h], [c + h, c - h], [c, c - h - s]]) + tri([[c - h, c + h], [c + h, c + h], [c, c + h + s]]) + tri([[c - h, c - h], [c - h, c + h], [c - h - s, c]]) + tri([[c + h, c - h], [c + h, c + h], [c + h + s, c]]);
    g += '<rect x="' + (c - h) + '" y="' + (c - h) + '" width="' + a + '" height="' + a + '" fill="' + FILL2 + '" stroke="' + INK + '" stroke-width="2"/>';
    return svgWrap(2 * c, 2 * c, g, 'net of a square pyramid', 200);
  };
  /* net of a cone: a fan (sector of radius s, angle 360·r/s) and a circle of radius r */
  S.netCone = function (shape) {
    shape = shape || {}; var R = shape.s || 90, rr = shape.r || 30, th = 360 * rr / R, cx = 110, ay = 10;
    var a1 = (270 - th / 2) * PI / 180, a2 = (270 + th / 2) * PI / 180;
    // apex at the top: angles measured with y down, so a point is (cx + R cos a, ay - R sin a)
    var p1 = [cx + R * Math.cos(a1), ay - R * Math.sin(a1)], p2 = [cx + R * Math.cos(a2), ay - R * Math.sin(a2)];
    var g = '<path d="M' + cx + ' ' + ay + ' L' + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1) + ' A' + R + ' ' + R + ' 0 ' + (th > 180 ? 1 : 0) + ' 0 ' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1) + ' Z" fill="' + FILL + '" stroke="' + INK + '" stroke-width="2"/>';
    g += '<circle cx="' + cx + '" cy="' + (ay + R + rr + 4) + '" r="' + rr + '" fill="' + FILL2 + '" stroke="' + INK + '" stroke-width="2"/>';
    return svgWrap(220, ay + R + 2 * rr + 12, g, 'net of a cone', 200);
  };
  /* a cylinder with a cone on top (a silo / crayon). lab: { r, h, s } */
  S.silo = function (lab) {
    lab = lab || {}; var cx = 90, rx = 40, ry = 12, top = 80, bot = 190, apex = [cx, 22];
    var g = '<path d="M' + (cx - rx) + ' ' + top + ' L' + apex.join(' ') + ' L' + (cx + rx) + ' ' + top + ' L' + (cx + rx) + ' ' + bot + ' A' + rx + ' ' + ry + ' 0 0 1 ' + (cx - rx) + ' ' + bot + ' Z" fill="' + FILL + '" stroke="none"/>';
    g += svgL([cx - rx, top], apex) + svgL(apex, [cx + rx, top]) + svgL([cx - rx, top], [cx - rx, bot]) + svgL([cx + rx, top], [cx + rx, bot]);
    g += '<path d="M' + (cx - rx) + ' ' + top + ' A' + rx + ' ' + ry + ' 0 0 0 ' + (cx + rx) + ' ' + top + '" fill="none" stroke="' + INK + '" stroke-width="1.6"/>';
    g += '<path d="M' + (cx - rx) + ' ' + bot + ' A' + rx + ' ' + ry + ' 0 0 0 ' + (cx + rx) + ' ' + bot + '" fill="none" stroke="' + INK + '" stroke-width="2"/>';
    g += '<path d="M' + (cx - rx) + ' ' + bot + ' A' + rx + ' ' + ry + ' 0 0 1 ' + (cx + rx) + ' ' + bot + '" fill="none" stroke="' + INK + '" stroke-width="1.4" stroke-dasharray="5 4"/>';
    if (lab.r) g += '<circle cx="' + cx + '" cy="' + bot + '" r="2.4" fill="' + INK + '"/>' + svgL([cx, bot], [cx + rx, bot], { w: 1.4 }) + svgT(cx + rx / 2, bot + ry + 14, lab.r);
    if (lab.h) g += svgT(cx + rx + 8, (top + bot) / 2 + 5, lab.h, { anchor: 'start' });
    if (lab.s) g += svgT((apex[0] + cx + rx) / 2 + 8, (apex[1] + top) / 2, lab.s, { anchor: 'start' });
    return svgWrap(200, bot + ry + 22, g, 'cylinder with a cone on top', 190);
  };
  S.TD = 'border:1px solid #c9b79c;padding:3px 10px;text-align:center';
  S.table = function (head, rows) { var TD = S.TD; return '<table style="border-collapse:collapse;margin:4px 0">' + (head ? '<tr>' + head.map(function (h) { return '<th style="' + TD + '">' + h + '</th>'; }).join('') + '</tr>' : '') + rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td style="' + TD + '">' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>'; };

  HW.addCodes({
    'u3sa-comma': 'Decimal comma', 'u3sa-cube-unit': 'Cubed unit for an area', 'u3sa-exact': 'Rounded an exact answer', 'u3sa-round-dir': 'Rounded the wrong way', 'u3sa-est': 'Estimate too far off',
    'u3sa-diam': 'Used the diameter as the radius', 'u3sa-one-end': 'Only one circle on a closed cylinder', 'u3sa-side-only': 'Only the curved side (left out the circles)', 'u3sa-extra-end': 'Two circles on a cylinder open at one end',
    'u3sa-no-ends': 'Added circles to a cylinder with no ends', 'u3sa-side-2': 'Side as πrh (forgot the 2)', 'u3sa-r-times-2': 'Took r × 2 instead of r²', 'u3sa-volume': 'Found the volume πr²h', 'u3sa-pi314': 'Used 3.14 instead of the π key', 'u3sa-early': 'Rounded the pieces before adding',
    'u3sa-cone-no-base': 'Left out the cone’s base', 'u3sa-cone-base': 'Added a base to an open cone', 'u3sa-height': 'Used the height instead of the slant height', 'u3sa-cone-2': 'Used 2πrs for a cone’s side', 'u3sa-cone-r': 'Left r out of πrs',
    'u3sa-no-half': 'Forgot the ½ in a triangle’s area', 'u3sa-one-tri': 'Counted fewer than 4 triangles', 'u3sa-pyr-no-base': 'Left out the pyramid’s base', 'u3sa-pyr-base': 'Added a base to a pyramid with no base', 'u3sa-perim': 'Used 4 × b for the square base'
  });
  HW.addPartial({
    'u3sa-diam': 'b', 'u3sa-one-end': 'b', 'u3sa-side-only': 'b', 'u3sa-extra-end': 'b', 'u3sa-no-ends': 'b', 'u3sa-side-2': 'b', 'u3sa-r-times-2': 'b', 'u3sa-round-dir': 's',
    'u3sa-cone-no-base': 'b', 'u3sa-cone-base': 'b', 'u3sa-height': 'b', 'u3sa-cone-2': 'b', 'u3sa-cone-r': 'b', 'u3sa-no-half': 'b', 'u3sa-one-tri': 'b', 'u3sa-pyr-no-base': 'b', 'u3sa-pyr-base': 'b', 'u3sa-perim': 'b', 'u3sa-volume': 'n'
  });

  /* ======================= Lesson 11 ======================= */
  var num = S.num, fields = S.fields, solid = S.solid, cyl = S.cyl, cone = S.cone, pyr = S.pyr, saPart = S.saPart;
  /* the lesson's worked examples (left out): cylinders [r, h], cones [r, s], pyramids [b, s] */
  var EX_CYL = [[4, 11], [11.25, 34.5], [9, 16.5], [0.3, 3.2], [3.2, 5.5]], EX_CONE = [[9, 15], [2.5, 12], [3.2, 3.6]], EX_PYR = [[10, 13], [7, 6.5]];
  function notEx(list, a, b) { return !list.some(function (e) { return near(e[0], a) && near(e[1], b); }); }
  /* square pyramids whose height, half the base and slant height fit (a right triangle): [half base, height, slant] */
  var TRIPLES = [[8, 6, 10], [6, 8, 10], [4, 3, 5], [3, 4, 5], [12, 5, 13], [9, 12, 15], [12, 9, 15], [12, 16, 20], [15, 8, 17]];
  /* cones: [radius, height, slant] */
  var CONE_TRIPLES = [[5, 12, 13], [3, 4, 5], [6, 8, 10], [8, 6, 10], [8, 15, 17], [12, 5, 13], [7, 24, 25]];

  HW.addCodes({
    'u3l11-net': 'Named the wrong solid for a net', 'u3l11-circ': 'Gave the circumference instead of the area', 'u3l11-diam-len': 'Used the diameter as the rectangle’s length', 'u3l11-no-2pi': 'Length as πr (forgot the 2)',
    'u3l11-add-lw': 'Added length and width instead of multiplying', 'u3l11-both-circles': 'Gave two circles for one', 'u3l11-no-round-up': 'Didn’t round up to whole bundles/cans', 'u3l11-round-down': 'Rounded down (not enough)',
    'u3l11-no-gst': 'Left out the GST', 'u3l11-gst-only': 'Gave only the GST', 'u3l11-m2-100': 'Changed cm² to m² with 100', 'u3l11-m2-way': 'Multiplied by 10 000 instead of dividing', 'u3l11-one-hat': 'Gave the area of one item, not all',
    'u3l11-top-circle': 'Counted the circle where the cone joins the cylinder', 'u3l11-no-bottom': 'Left out the flat bottom', 'u3l11-diff': 'Gave a total, not the difference', 'u3l11-rev-base': 'Didn’t subtract the base', 'u3l11-rev-tri': 'Gave the triangle area, not the slant height', 'u3l11-rev-half': 'Forgot the ½ working backwards',
    'u3l11-ratio-2': 'Said the surface area doubles', 'u3l11-ratio-8': 'Ratio 8 instead of 4', 'u3l11-ratio-flip': 'Divided the original by the new', 'u3l11-m2-cm': 'Left the area in cm²', 'u3l11-mult': 'Multiplied instead of dividing',
    'u3l11-no-cone': 'Left out the cone (used two circles)', 'u3l11-div': 'Divided instead of multiplying', 'u3l11-formula': 'Chose the wrong area formula for a piece', 'u3l11-in2-ft2': 'Changed in² to ft² with 12', 'u3l11-in2-way': 'Multiplied by 144 instead of dividing', 'u3l11-per-cap': 'Gave the area for one cap'
  });
  HW.addPartial({ 'u3l11-no-round-up': 'b', 'u3l11-round-down': 'b', 'u3l11-no-gst': 'b', 'u3l11-m2-100': 'b', 'u3l11-m2-way': 'n', 'u3l11-one-hat': 'b', 'u3l11-top-circle': 's', 'u3l11-no-bottom': 's', 'u3l11-rev-base': 'b', 'u3l11-rev-tri': 'b', 'u3l11-rev-half': 'b', 'u3l11-in2-ft2': 'b', 'u3l11-per-cap': 'b', 'u3l11-circ': 'n', 'u3l11-diam-len': 'b', 'u3l11-no-2pi': 'b' });

  /* ---- Q1: name the solid ---- */
  var NETS = {
    pyr: { name: 'square pyramid', pieces: '1 square and 4 triangles', pic: function (r) { var b = r.int(48, 62); return S.netPyr({ b: b, s: r.int(36, 50) }); } },
    cone: { name: 'cone', pieces: 'a fan shape and 1 circle', pic: function (r) { var R = r.int(80, 96); return S.netCone({ s: R, r: r.int(24, 34) }); } },
    cyl: { name: 'cylinder', pieces: '1 rectangle and 2 circles', pic: function (r) { return S.netCyl({}, { w: r.int(140, 190), h: r.int(46, 70), r: r.int(22, 30) }); } }
  };
  function netMC(r, k, letter) {
    var right = NETS[k], opts = ['pyr', 'cone', 'cyl'].map(function (j) {
      return j === k ? { html: cap(NETS[j].name), right: true } : { html: cap(NETS[j].name), why: 'A ' + NETS[j].name + '’s net is ' + NETS[j].pieces + '. This net is ' + right.pieces + '.', code: 'u3l11-net' };
    });
    opts.push({ html: 'Triangular prism', why: 'A triangular prism’s net has 3 rectangles and 2 triangles. This net is ' + right.pieces + '.', code: 'u3l11-net' });
    return P.mc(r, '(' + letter + ') Which solid does this net fold into?' + right.pic(r), opts,
      'The net is ' + right.pieces + ', so it folds into a <b>' + right.name + '</b>.', ['Count the pieces: what shape is the base, and what are the sides?'], 'net ' + k);
  }

  /* ---- Q4: will the label fit? ---- */
  function fitMC(r, sh) {
    var C = PI * sh.d, A = sh.L * sh.W, lab = C * sh.h;
    return P.mc(r, '(b) The printer wants to cut each label from a sheet that is ' + sh.L + ' cm long and ' + sh.W + ' cm wide. Will the label fit?', [
      { html: 'No. The label must be as long as the distance around the can, ' + t('\\pi\\times ' + N(sh.d) + '\\approx ' + N(rd(C, 1))) + ' cm, and that is longer than ' + sh.L + ' cm.', right: true },
      { html: 'Yes. The sheet’s area, ' + t(sh.L + '\\times ' + sh.W + '=' + A) + ' cm², is more than the label’s area.', why: 'The label is one piece that wraps all the way around, so the sheet must be at least as <b>long</b> as the circumference. Find ' + t('\\pi d') + '.', code: 'u3l11-fit-area' },
      { html: 'Yes. The can is only ' + N(sh.d) + ' cm across, and the sheet is ' + sh.L + ' cm long.', why: 'The label wraps <b>around</b> the can, so its length is the circumference (' + t('\\pi d') + '), not the diameter.', code: 'u3l11-fit-diam' },
      { html: 'No. The sheet is ' + sh.W + ' cm wide, which is wider than the can is tall.', why: 'A sheet that is too wide can be trimmed. Check the <b>length</b>: the label must go all the way around the can.', code: 'u3l11-fit-width' }],
      'The label is a rectangle as long as the circumference:<br>' + t('C=\\pi d=\\pi\\times ' + N(sh.d) + '=' + rw(C)) + ' cm<br>That is longer than the ' + sh.L + ' cm sheet, so the label will <b>not</b> fit (even though the sheet’s area is ' + A + ' cm² and the label is only about ' + N(rd(lab, 1)) + ' cm²).',
      ['How long must the label be to wrap once around the can?'], 'label fit');
  }

  /* ---- Q13: Tyler's mistake ---- */
  var TY = {
    diam: { what: 'He used the diameter as the radius.', fix: function (s) { return 'Tyler used the diameter, ' + s.d + ' cm, as the radius. The radius is ' + t(s.d + '\\div 2=' + s.d / 2) + ' cm.'; } },
    one: { what: 'He counted only one circle; a closed cylinder has two.', fix: function () { return 'Tyler counted only one circle (' + t('\\pi r^2') + '). A closed cylinder has a top <b>and</b> a bottom: ' + t('2\\pi r^2') + '.'; } },
    side: { what: 'He used ' + t('\\pi rh') + ' for the side; the side is ' + t('2\\pi rh') + '.', fix: function () { return 'Tyler found the side with ' + t('\\pi rh') + '. The side unrolls to a rectangle ' + t('2\\pi r') + ' long, so it is ' + t('2\\pi rh') + '.'; } }
  };
  function tylerWork(s) {
    var r = s.d / 2, a, b;
    if (s.type === 'diam') { a = 2 * PI * s.d * s.d; b = 2 * PI * s.d * s.h; return t('\\text{SA}=2\\times\\pi\\times ' + s.d + '^2+2\\times\\pi\\times ' + s.d + '\\times ' + s.h + '=' + rd(a, 2).toFixed(2) + '+' + rd(b, 2).toFixed(2) + '=' + rd(rd(a, 2) + rd(b, 2), 2).toFixed(2) + uT('cm²')); }
    if (s.type === 'one') { a = PI * r * r; b = 2 * PI * r * s.h; return t('r=' + N(r) + ';\\ \\text{SA}=\\pi\\times ' + N(r) + '^2+2\\times\\pi\\times ' + N(r) + '\\times ' + s.h + '=' + rd(a, 2).toFixed(2) + '+' + rd(b, 2).toFixed(2) + '=' + rd(rd(a, 2) + rd(b, 2), 2).toFixed(2) + uT('cm²')); }
    a = 2 * PI * r * r; b = PI * r * s.h; return t('r=' + N(r) + ';\\ \\text{SA}=2\\times\\pi\\times ' + N(r) + '^2+\\pi\\times ' + N(r) + '\\times ' + s.h + '=' + rd(a, 2).toFixed(2) + '+' + rd(b, 2).toFixed(2) + '=' + rd(rd(a, 2) + rd(b, 2), 2).toFixed(2) + uT('cm²'));
  }

  /* ---- an amount to buy (round up) ---- */
  function buyPart(prompt, need, per, o) {
    o = o || {}; var n = Math.ceil(q(need / per) - 1e-9), x = need / per;
    return num(prompt, n, { after: o.unit || 'bundles', bad: [[rd(x, 2), 'u3l11-no-round-up', 'You can only buy whole ' + (o.unit || 'bundles') + '. Round <b>up</b>, so there is enough.'], [rd(x, 1), 'u3l11-no-round-up', 'You can only buy whole ' + (o.unit || 'bundles') + '. Round <b>up</b>.'], [n - 1, 'u3l11-round-down', t(N(n - 1)) + ' ' + (o.unit || 'bundles') + ' would cover only ' + N(rd((n - 1) * per, 1)) + ' ' + o.u + '², which is not enough. Round <b>up</b>.'], [need * per, 'u3l11-mult', 'Divide the area by the area one ' + (o.one || 'bundle') + ' covers.']],
      sol: [t(N(rd(need, 2)) + '\\div ' + N(per) + '=' + rw(x)), 'Round <b>up</b>: ' + n + ' ' + (o.unit || 'bundles')], hints: ['Divide the area by the area one ' + (o.one || 'bundle') + ' covers, then round <b>up</b>.'], text: o.text || 'round up' });
  }
  function gstPart(prompt, n, price, o) {
    o = o || {}; var sub = q(n * price), tot = sub * 1.05;
    return num(prompt, rd(tot, 2), { money: true, exact: tot, bad: [[sub, 'u3l11-no-gst', 'Add the 5% GST: multiply by 1.05.'], [sub * 0.05, 'u3l11-gst-only', 'That’s only the GST. Add it to the price (or multiply by 1.05).'], [(n - 1) * price * 1.05, 'u3l11-round-down', 'Use the number of ' + (o.unit || 'bundles') + ' from (b), rounded up.'], [price * 1.05, 'u3l11-one-hat', 'Multiply by the number of ' + (o.unit || 'bundles') + ' first.']].concat(o.bad || []),
      sol: [t(n + '\\times ' + M(price) + '=' + M(sub)), t(M(sub) + '\\times 1.05=' + '\\$' + nS(rd(tot, 4)) + (near(tot, rd(tot, 2), 1e-9) ? '' : '\\approx ' + M(tot)))], hints: ['Cost = number × price. Then multiply by 1.05 for the GST.'], text: o.text || 'cost with GST' });
  }

  HW.defineLesson({
    id: 'u3l11', unit: 3, num: '11', title: 'Surface Area of Cylinders, Pyramids and Cones', outcome: 'M4',
    blurb: 'Nets of cylinders, square pyramids and cones; closed and open cylinders; slant height; roofs, cans, tents and grain bins.',
    questions: [
      { num: '1', stem: 'Name the solid that each net folds into.', shared: function (r) { return { order: r.shuffle(['pyr', 'cone', 'cyl']) }; }, parts: [
        { id: '1a', level: 'BEG', make: function (r, sh) { return netMC(r, sh.order[0], 'a'); } },
        { id: '1b', level: 'BEG', make: function (r, sh) { return netMC(r, sh.order[1], 'b'); } },
        { id: '1c', level: 'BEG', make: function (r, sh) { return netMC(r, sh.order[2], 'c'); } }] },
      { num: '2', stem: function (sh) { return 'A cylinder has a radius of ' + sh.r + ' cm and a height of ' + sh.h + ' cm. Here is its net. Round each answer to the nearest tenth.' + S.netCyl({ len: 'length = ?', h: sh.h + ' cm', r: sh.r + ' cm' }); },
        shared: function (r) { return find(function () { return { r: r.int(3, 8), h: r.int(8, 15) }; }, function (s) { return notEx(EX_CYL, s.r, s.h) && s.h > s.r; }); },
        parts: [
          { id: '2a', level: 'BEG', make: function (r, sh) { var L = 2 * PI * sh.r; return num('(a) Find the length of the rectangle.', L, { dp: 1, exact: L, after: 'cm', bad: [[PI * sh.r, 'u3l11-no-2pi', 'The length is the circumference: ' + t('2\\pi r') + ' (or ' + t('\\pi d') + '). Don’t forget the 2.'], [2 * sh.r, 'u3l11-diam-len', 'That’s the diameter. The rectangle wraps once <b>around</b> the circle, so its length is the circumference ' + t('2\\pi r') + '.'], [PI * sh.r * sh.r, 'u3l11-circ', 'That’s the area of a circle. The length is the distance around: ' + t('2\\pi r') + '.'], [2 * 3.14 * sh.r, 'u3sa-pi314', 'Use the ' + t('\\pi') + ' key: 3.14 changes the rounded answer.', 'form']],
            sol: ['The length is the circumference of the circle:', t('2\\times\\pi\\times ' + sh.r + eqR(L, 1) + uT('cm'))], hints: ['The rectangle wraps once around the can, so its length is the circumference: ' + t('2\\pi r') + '.'], text: 'net length' }); } },
          { id: '2b', level: 'BEG', make: function (r, sh) { var L = 2 * PI * sh.r, A = L * sh.h; return num('(b) Find the area of the rectangle.', A, { dp: 1, exact: A, after: 'cm²', area: true, bad: [[rd(L, 1) * sh.h, 'u3sa-early', 'Close! You used the rounded length. Keep all the decimals from (a) (use the unrounded value), then round at the end.', 'form'], [PI * sh.r * sh.h, 'u3sa-side-2', 'The length is ' + t('2\\pi r') + ', so the area is ' + t('2\\pi r\\times h') + '.'], [L + sh.h, 'u3l11-add-lw', 'Area of a rectangle = length <b>×</b> width.'], [2 * (L + sh.h), 'u3l11-add-lw', 'That’s the perimeter. Area = length × width.']],
            sol: ['Area = length × width', t(rw(L) + '\\times ' + sh.h + eqR(A, 1) + uT('cm²'))], hints: ['Area of the rectangle = length (from (a)) × height of the cylinder.'], text: 'net rectangle' }); } },
          { id: '2c', level: 'BEG', make: function (r, sh) { var A = PI * sh.r * sh.r; return num('(c) Find the area of one circle.', A, { dp: 1, exact: A, after: 'cm²', area: true, bad: [[2 * PI * sh.r, 'u3l11-circ', 'That’s the circumference (the distance around). Area of a circle = ' + t('\\pi r^2') + '.'], [PI * 2 * sh.r, 'u3sa-r-times-2', t('r^2') + ' means ' + t('r\\times r') + '. Use the ' + t('x^2') + ' key.'], [2 * A, 'u3l11-both-circles', 'That’s two circles. Find the area of <b>one</b> circle.'], [PI * 4 * sh.r * sh.r, 'u3sa-diam', 'Use the radius, ' + sh.r + ' cm, not the diameter.'], [3.14 * sh.r * sh.r, 'u3sa-pi314', 'Use the ' + t('\\pi') + ' key: 3.14 changes the rounded answer.', 'form']],
            sol: [t('\\pi\\times ' + sh.r + '^2' + eqR(A, 1) + uT('cm²'))], hints: ['Area of a circle = ' + t('\\pi r^2') + '.'], text: 'net circle' }); } },
          { id: '2d', level: 'EMG', make: function (r, sh) { var res = cyl(sh.r, sh.h, 2, { dp: 1 }); var side = 2 * PI * sh.r * sh.h, c = PI * sh.r * sh.r;
            return saPart('(d) Find the surface area of the cylinder.', res, { dp: 1, u: 'cm', bad: [[rd(side, 1) + 2 * rd(c, 1), 'u3sa-early', 'Close! You added the rounded answers. Keep all the decimals until the end, then round.', 'form']], hints: ['SA = the rectangle + 2 circles.'], text: 'net SA' }); } }] },
      { num: '3', stem: 'Find the surface area of each closed cylinder, to the nearest tenth.', parts: [
        { id: '3a', level: 'EMG', make: function (r) { var v = find(function () { return [r.int(2, 6), r.int(5, 12)]; }, function (v) { return notEx(EX_CYL, v[0], v[1]) && v[0] !== v[1]; }); return saPart('(a) radius ' + v[0] + ' m, height ' + v[1] + ' m', cyl(v[0], v[1], 2, { dp: 1, u: 'm' }), { dp: 1, u: 'm', hints: ['Closed cylinder: ' + t('\\text{SA}=2\\pi r^2+2\\pi rh') + '.', 'Find each part, then add. Round at the end.'], text: 'closed cyl r' }); } },
        { id: '3b', level: 'PRG', make: function (r) { var v = find(function () { return [r.int(3, 7) * 2, r.int(3, 8)]; }, function (v) { return notEx(EX_CYL, v[0] / 2, v[1]); }); return saPart('(b) diameter ' + v[0] + ' in, height ' + v[1] + ' in', cyl(v[0] / 2, v[1], 2, { d: true, dp: 1, u: 'in' }), { dp: 1, u: 'in', hints: ['Halve the diameter to get the radius.', t('\\text{SA}=2\\pi r^2+2\\pi rh') + '.'], text: 'closed cyl d' }); } },
        { id: '3c', level: 'EMG', make: function (r) { var v = find(function () { return [r.pick([1.2, 1.5, 2.5, 3.5, 0.8]), r.pick([1.5, 2.5, 3.5, 4.5, 2.25, 3.75])]; }, function (v) { return v[0] !== v[1]; }); return saPart('(c) radius ' + N(v[0]) + ' ft, height ' + t(mixT(v[1])) + ' ft', cyl(v[0], v[1], 2, { dp: 1, u: 'ft' }), { dp: 1, u: 'ft', pre: ['Change the height to a decimal: ' + t(mixT(v[1]) + '=' + N(v[1])) + ' ft'], hints: ['Change the mixed number to a decimal first: ' + t('2\\tfrac{1}{2}=2.5') + '.', t('\\text{SA}=2\\pi r^2+2\\pi rh') + '.'], text: 'closed cyl ft' }); } }] },
      { num: '4', stem: function (sh) { return 'A juice can has a diameter of ' + N(sh.d) + ' cm and a height of ' + sh.h + ' cm. The label covers the whole curved side.' + solid('cylinder', { d: N(sh.d) + ' cm', h: sh.h + ' cm', width: 170 }); },
        shared: function (r) { return find(function () { var d = pickR(r, 5.4, 7.6, 0.2), h = r.int(10, 14), C = PI * d, L = Math.floor(C) - r.int(0, 1), W = h + r.int(1, 3); return { d: d, h: h, L: L, W: W }; }, function (s) { return s.L < PI * s.d - 0.15 && s.L * s.W > PI * s.d * s.h + 5 && !(s.d === 8 && s.h === 11); }); },
        parts: [
          { id: '4a', level: 'PRG', make: function (r, sh) { return saPart('(a) Find the area of the label, to the nearest tenth.', cyl(sh.d / 2, sh.h, 0, { d: true, dp: 1 }), { dp: 1, u: 'cm', hints: ['The label is the curved side only: ' + t('2\\pi rh') + ' (or ' + t('\\pi d\\times h') + ').'], text: 'label area' }); } },
          { id: '4b', level: 'PRG', make: function (r, sh) { return fitMC(r, sh); } }] },
      { num: '5', stem: 'Find the surface area of each square pyramid.', parts: [
        { id: '5a', level: 'EMG', make: function (r) { var v = find(function () { var b = r.int(4, 9); return [b, b + r.int(2, 5)]; }, function (v) { return notEx(EX_PYR, v[0], v[1]); }); return saPart('(a) base edge ' + v[0] + ' cm, slant height ' + v[1] + ' cm', pyr(v[0], v[1], true), { u: 'cm', hints: ['SA = base + 4 triangles = ' + t('b^2+4\\times\\tfrac{1}{2}bs') + '.'], text: 'pyr cm' }); } },
        { id: '5b', level: 'EMG', make: function (r) { var v = [r.pick([1.5, 2, 2.5, 3, 3.5]), r.pick([3, 3.5, 4, 4.5, 5])]; return saPart('(b) base edge ' + N(v[0]) + ' m, slant height ' + N(v[1]) + ' m', pyr(v[0], v[1], true, { u: 'm' }), { u: 'm', hints: ['SA = base + 4 triangles = ' + t('b^2+4\\times\\tfrac{1}{2}bs') + '.'], text: 'pyr m' }); } },
        { id: '5c', level: 'PRG', make: function (r) { var tr = r.pick(TRIPLES.filter(function (x) { return x[2] <= 17; })), b = 2 * tr[0], h = tr[1], s = tr[2];
          return saPart('(c) Find the surface area of this square pyramid.' + solid('sqpyramid', { s: b + ' in', sl: s + ' in', h: h + ' in', width: 210 }), pyr(b, s, true, { hgt: h, u: 'in' }), { u: 'in', pre: ['Use the slant height ' + s + ' in, not the ' + h + ' in height.'], hints: ['Surface area uses the <b>slant height</b> (the height of each triangle face), not the height inside.'], text: 'pyr picture' }); } }] },
      { num: '6', stem: 'Find the surface area of each closed cone, to the nearest tenth.', parts: [
        { id: '6a', level: 'EMG', make: function (r) { var v = find(function () { var a = r.int(3, 6); return [a, a + r.int(2, 5)]; }, function (v) { return notEx(EX_CONE, v[0], v[1]); }); return saPart('(a) radius ' + v[0] + ' cm, slant height ' + v[1] + ' cm', cone(v[0], v[1], true, { dp: 1 }), { dp: 1, u: 'cm', hints: ['Closed cone: ' + t('\\text{SA}=\\pi r^2+\\pi rs') + '.'], text: 'cone r' }); } },
        { id: '6b', level: 'PRG', make: function (r) { var v = find(function () { var d = r.int(4, 8) * 2; return [d, d / 2 + r.int(2, 6)]; }, function (v) { return notEx(EX_CONE, v[0] / 2, v[1]); }); return saPart('(b) diameter ' + v[0] + ' ft, slant height ' + v[1] + ' ft', cone(v[0] / 2, v[1], true, { d: true, dp: 1, u: 'ft' }), { dp: 1, u: 'ft', hints: ['Halve the diameter to get the radius.', t('\\text{SA}=\\pi r^2+\\pi rs') + '.'], text: 'cone d' }); } },
        { id: '6c', level: 'EMG', make: function (r) { var v = [r.pick([0.4, 0.5, 0.6, 0.7, 0.8]), r.pick([1.1, 1.2, 1.3, 1.4, 1.5, 1.6])]; return saPart('(c) radius ' + N(v[0]) + ' m, slant height ' + N(v[1]) + ' m', cone(v[0], v[1], true, { dp: 1, u: 'm' }), { dp: 1, u: 'm', hints: [t('\\text{SA}=\\pi r^2+\\pi rs') + '.'], text: 'cone m' }); } }] },
      { num: '7', stem: function (sh) { return 'A paper party hat is a cone with no base. It is ' + sh.d + ' cm across the bottom and has a slant height of ' + sh.s + ' cm.' + solid('cone', { d: sh.d + ' cm', s: sh.s + ' cm', width: 160 }); },
        shared: function (r) { return { d: r.pick([14, 16, 18, 20]), s: r.int(17, 24), n: r.pick([20, 24, 25, 30, 32, 35]), who: r.pick(NAMES) }; },
        parts: [
          { id: '7a', level: 'PRG', make: function (r, sh) { return saPart('(a) How much paper is in one hat, to the nearest square centimetre?', cone(sh.d / 2, sh.s, false, { d: true, dp: 0 }), { dp: 0, u: 'cm', hints: ['A hat has no base: use only the curved side, ' + t('\\pi rs') + '.', 'Halve the diameter to get the radius.'], text: 'hat' }); } },
          { id: '7b', level: 'ADV', make: function (r, sh) { var one = PI * sh.d / 2 * sh.s, tot = one * sh.n, m2 = tot / 10000;
            return num('(b) ' + sh.who + ' is making ' + sh.n + ' hats for a party. How much paper is that, in m², to the nearest tenth? ' + t('(1\\text{ m}^2=10\\,000\\text{ cm}^2)'), m2, { dp: 1, exact: m2, after: 'm²', area: true,
              bad: [[tot / 100, 'u3l11-m2-100', '1 m = 100 cm, but 1 m² = 100 × 100 = 10 000 cm². Divide by 10 000.'], [tot, 'u3l11-m2-cm', 'That’s in cm². Change to m²: divide by 10 000.'], [one / 10000, 'u3l11-one-hat', 'That’s one hat. Multiply by ' + sh.n + ' first.'], [tot / 1000, 'u3l11-m2-100', '1 m² = 10 000 cm². Divide by 10 000.'], [(PI * (sh.d / 2) * (sh.d / 2) + one) * sh.n / 10000, 'u3sa-cone-base', 'The hats have no base: use only ' + t('\\pi rs') + '.']],
              sol: [t(rw(one) + '\\times ' + sh.n + '=' + raw(tot, 1) + uT('cm²')), t(raw(tot, 1) + '\\div 10\\,000' + eqR(m2, 1) + uT('m²'))], hints: ['Multiply the paper in one hat by ' + sh.n + '.', 'Big unit ← small unit: divide by 10 000 (1 m² = 10 000 cm²).'], text: 'hats m2' }); } }] },
      { num: '8', parts: [
        { id: '8', level: 'PRG', make: function (r) { var v = [r.int(12, 18) * 2, r.int(20, 32)];
          return saPart('A metal bucket has a bottom but no lid. It has a diameter of ' + v[0] + ' cm and a height of ' + v[1] + ' cm. How much metal is in the bucket, to the nearest square centimetre?' + solid('cylinder', { d: v[0] + ' cm', h: v[1] + ' cm', width: 160 }), cyl(v[0] / 2, v[1], 1, { d: true, dp: 0, endWord: 'the bottom' }), { dp: 0, u: 'cm', hints: ['Which pieces are there? 1 circle (the bottom) + the side.', 'Halve the diameter to get the radius.'], text: 'bucket' }); } }] },
      { num: '9', stem: function (sh) { return 'The roof of a square gazebo is a square pyramid. Each side of the base is ' + sh.b + ' ft and the slant height is ' + sh.s + ' ft. One bundle of shingles covers 33.3 ft² and costs ' + Mp(sh.p) + '.'; },
        shared: function (r) { return find(function () { return { b: r.pick([8, 10, 12, 14, 16]), s: r.int(6, 11), p: r.pick([34.97, 36.49, 38.97, 39.99, 42.49]) }; }, function (s) { var x = 2 * s.b * s.s / 33.3; return s.s >= s.b / 2 + 1 && x - Math.floor(x) > 0.08 && x - Math.floor(x) < 0.95; }); },
        parts: [
          { id: '9a', level: 'EMG', make: function (r, sh) { return saPart('(a) Find the area of the roof. (A roof has no base.)', pyr(sh.b, sh.s, false, { u: 'ft' }), { u: 'ft', hints: ['A roof has no base: use only the 4 triangles, each ' + t('\\tfrac{1}{2}\\times b\\times s') + '.'], text: 'roof' }); } },
          { id: '9b', level: 'PRG', make: function (r, sh) { return buyPart('(b) How many bundles are needed?', 2 * sh.b * sh.s, 33.3, { u: 'ft', text: 'bundles' }); } },
          { id: '9c', level: 'PRG', make: function (r, sh) { var n = Math.ceil(2 * sh.b * sh.s / 33.3 - 1e-9); return gstPart('(c) What do the bundles cost with 5% GST?', n, sh.p, { bad: [[2 * sh.b * sh.s / 33.3 * sh.p * 1.05, 'u3l11-no-round-up', 'Use the whole number of bundles from (b) (rounded up).']] }); } }] },
      { num: '10', stem: function (sh) { return 'A jewellery store has a glass display case shaped like a square pyramid. It sits on a table, so it has no bottom. The base edge is ' + sh.b + ' cm and the slant height is ' + sh.s + ' cm.'; },
        shared: function (r) { return find(function () { return { b: r.pick([30, 35, 40, 45, 50]), s: r.pick([40, 45, 50, 55, 60]), p: r.pick([75, 80, 85, 90, 95]) }; }, function (s) { return s.s > s.b; }); },
        parts: [
          { id: '10a', level: 'PRG', make: function (r, sh) { var res = pyr(sh.b, sh.s, false), A = res.ans;
            return fields('(a) Find the area of glass in cm², then in m². ' + t('(1\\text{ m}^2=10\\,000\\text{ cm}^2)'), [
              { label: 'Glass:', name: 'cm²', ans: A, after: 'cm²', bad: res.bad },
              { label: 'Glass:', name: 'm²', ans: A / 10000, after: 'm²', bad: [[A / 100, 'u3l11-m2-100', '1 m² = 100 × 100 = 10 000 cm². Divide by 10 000.'], [A * 10000, 'u3l11-m2-way', 'm² is the bigger unit, so the number gets smaller: divide by 10 000.'], [A / 1000, 'u3l11-m2-100', 'Divide by 10 000.']] }],
              res.sol.concat([t(N(A) + '\\div 10\\,000=' + N(A / 10000) + uT('m²'))]), ['No bottom: only the 4 triangles.', 'Then divide by 10 000 to change cm² to m².'], 'case glass'); } },
          { id: '10b', level: 'PRG', make: function (r, sh) { var m2 = 2 * sh.b * sh.s / 10000, c = m2 * sh.p;
            return num('(b) The glass costs ' + Mp(sh.p) + ' per m². Find the cost of the glass.', rd(c, 2), { money: true, exact: c, bad: [[2 * sh.b * sh.s * sh.p, 'u3l11-m2-cm', 'The price is per <b>m²</b>: use the area in m² from (a).'], [(sh.b * sh.b + 2 * sh.b * sh.s) / 10000 * sh.p, 'u3sa-pyr-base', 'The case has no bottom: use only the 4 triangles.'], [2 * sh.b * sh.s / 100 * sh.p, 'u3l11-m2-100', 'Change cm² to m² by dividing by 10 000, then multiply by the price.']],
              sol: [t(N(m2) + '\\times ' + M(sh.p) + '=' + M(c))], hints: ['Cost = area in m² × price per m².'], text: 'case cost' }); } }] },
      { num: '11', stem: function (sh) { return 'A company is choosing between two closed cans that hold the same amount of juice. Can A has a radius of ' + sh.rA + ' cm and a height of ' + N(sh.hA) + ' cm. Can B has a radius of ' + sh.rB + ' cm and a height of ' + N(sh.hB) + ' cm. Which can uses less metal?'; },
        shared: function (r) { return find(function () { var rA = r.int(3, 6), hA = r.pick([8, 9, 10, 12, 14, 15, 16]), rB = rA + r.pick([-1, 1, 2]); return { rA: rA, hA: hA, rB: rB, hB: q(rA * rA * hA / (rB * rB)) }; },
          function (s) { var a = 2 * PI * s.rA * (s.rA + s.hA), b = 2 * PI * s.rB * (s.rB + s.hB); s.A = a; s.B = b; return s.rB >= 2 && decs(s.hB) <= 2 && s.hB >= 3 && Math.abs(a - b) >= 1 && !(s.rA === 4 && s.hA === 10 && s.rB === 5); }); },
        parts: [
          { id: '11a', level: 'ADV', make: function (r, sh) { var a = cyl(sh.rA, sh.hA, 2, { dp: 1 }), b = cyl(sh.rB, sh.hB, 2, { dp: 1 });
            return fields('(a) Find the surface area of each can, to the nearest tenth.', [{ label: 'Can A:', name: 'Can A', ans: a.ans, dp: 1, exact: a.ans, after: 'cm²', bad: a.bad }, { label: 'Can B:', name: 'Can B', ans: b.ans, dp: 1, exact: b.ans, after: 'cm²', bad: b.bad }],
              ['Can A: ' + a.sol.filter(Boolean).slice(-1)[0], 'Can B: ' + b.sol.filter(Boolean).slice(-1)[0]].concat(['(Each: ' + t('2\\pi r^2+2\\pi rh') + '.)']), ['Closed can: ' + t('2\\pi r^2+2\\pi rh') + '. Do each can separately.'], 'two cans'); } },
          { id: '11b', level: 'PRG', make: function (r, sh) { var less = sh.A < sh.B ? 'A' : 'B', more = less === 'A' ? 'B' : 'A', tall = sh.hA > sh.hB ? 'A' : 'B', diff = Math.abs(sh.A - sh.B);
            return P.mc(r, '(b) Which can uses less metal?', [
              { html: 'Can ' + less + ': its surface area is smaller.', right: true },
              { html: 'Can ' + more + ': its surface area is smaller.', why: 'Compare the two surface areas from (a): the smaller one uses less metal.', code: 'u3l11-cans-more' },
              { html: 'Neither: they hold the same amount, so they use the same metal.', why: 'Holding the same amount (volume) does not mean the same surface area. Compare the surface areas.', code: 'u3l11-cans-same' },
              { html: 'Can ' + (tall === less ? more : tall) + ': ' + (tall === less ? 'a wider can always uses less metal.' : 'a taller can always uses less metal.'), why: 'There is no “always” rule here. Compare the surface areas you found.', code: 'u3l11-cans-rule' }],
              'Can A: about ' + N(rd(sh.A, 1)) + ' cm²; Can B: about ' + N(rd(sh.B, 1)) + ' cm².<br><b>Can ' + less + '</b> uses less metal (about ' + N(rd(diff, 1)) + ' cm² less per can).', ['Use your surface areas from (a).'], 'cans less'); } }] },
      { num: '12', parts: [
        { id: '12', level: 'MAS', make: function (r) { var v = find(function () { return { r: r.pick([0.2, 0.25, 0.3, 0.35, 0.4]), H: r.pick([1.5, 1.8, 2, 2.2, 2.5]), s: r.pick([0.4, 0.5, 0.6, 0.7]), what: r.pick(['crayon', 'pencil']) }; }, function (v) { return v.s > v.r + 0.1; });
          var B = PI * v.r * v.r, side = 2 * PI * v.r * v.H, L = PI * v.r * v.s, A = B + side + L;
          return num('A giant ' + v.what + ' for a school display is a cylinder with a cone on top. The cylinder has a radius of ' + N(v.r) + ' m and a height of ' + N(v.H) + ' m. The cone has a slant height of ' + N(v.s) + ' m. Every outside surface gets painted, including the flat bottom. Find the area to paint, to the nearest tenth.' + S.silo({ r: N(v.r) + ' m', h: N(v.H) + ' m', s: N(v.s) + ' m' }), A,
            { dp: 1, exact: A, after: 'm²', area: true, bad: [[A + B, 'u3l11-top-circle', 'There is no circle at the top of the cylinder: the cone sits on it, so that circle is hidden. Use the bottom, the side and the cone.'], [side + L, 'u3l11-no-bottom', 'The flat bottom gets painted too: add ' + t('\\pi r^2') + '.'], [B + side + 2 * PI * v.r * v.s, 'u3sa-cone-2', 'The side of a cone is ' + t('\\pi rs') + ' (no 2).'], [B + PI * v.r * v.H + L, 'u3sa-side-2', 'The side of the cylinder is ' + t('2\\pi rh') + '.'], [2 * B + side, 'u3l11-no-cone', 'Add the side of the cone (' + t('\\pi rs') + '), and use only the bottom circle.'], [rd(B, 1) + rd(side, 1) + rd(L, 1), 'u3sa-early', 'Close! You rounded the pieces before adding. Keep all the decimals until the end.', 'form']],
              sol: ['Pieces: the bottom circle, the side of the cylinder and the side of the cone (no circle at the top, where they join).', 'Bottom: ' + t('\\pi\\times ' + N(v.r) + '^2=' + raw(B, 3)), 'Cylinder side: ' + t('2\\times\\pi\\times ' + N(v.r) + '\\times ' + N(v.H) + '=' + raw(side, 3)), 'Cone: ' + t('\\pi\\times ' + N(v.r) + '\\times ' + N(v.s) + '=' + raw(L, 3)), t('\\text{Total}' + eqR(A, 1) + uT('m²'))],
              hints: ['List the pieces you can see: which circles are really on the outside?', 'Bottom ' + t('\\pi r^2') + ' + cylinder side ' + t('2\\pi rh') + ' + cone ' + t('\\pi rs') + '.'], text: 'crayon' }); } }] },
      { num: '13', stem: function (sh) { return 'Tyler found the surface area of a closed cylinder with a diameter of ' + sh.d + ' cm and a height of ' + sh.h + ' cm. His work:<br>' + tylerWork(sh); },
        shared: function (r) { return find(function () { return { d: r.int(3, 6) * 2, h: r.int(3, 9), type: r.pick(['diam', 'diam', 'one', 'side']) }; }, function (s) { return notEx(EX_CYL, s.d / 2, s.h) && s.d !== s.h; }); },
        parts: [
          { id: '13a', level: 'PRG', make: function (r, sh) { var opts = Object.keys(TY).map(function (k) { return k === sh.type ? { html: TY[k].what, right: true } : { html: TY[k].what, why: 'Check that part of his work again: ' + (k === 'diam' ? 'he did halve the diameter.' : k === 'one' ? 'look at how many circles he counted.' : 'look at his side.'), code: 'u3l11-ty-' + k }; });
            if (sh.type !== 'diam') opts[0] = { html: TY.diam.what, why: 'He did halve the diameter (' + t('r=' + N(sh.d / 2)) + '). Look at the circles and the side.', code: 'u3l11-ty-diam' };
            opts.push({ html: 'He made no mistake.', why: 'Work it out yourself: ' + t('2\\pi r^2+2\\pi rh') + ' with ' + t('r=' + N(sh.d / 2)) + ' does not give his answer.', code: 'u3l11-ty-none' });
            return P.mc(r, '(a) What mistake did Tyler make?', opts, TY[sh.type].fix(sh), ['Write the formula ' + t('\\text{SA}=2\\pi r^2+2\\pi rh') + ' and compare each piece with his work.'], 'Tyler mistake'); } },
          { id: '13b', level: 'PRG', make: function (r, sh) { return saPart('(b) Find the correct surface area, to the nearest tenth.', cyl(sh.d / 2, sh.h, 2, { d: true, dp: 1 }), { dp: 1, u: 'cm', hints: ['Halve the diameter, then use ' + t('2\\pi r^2+2\\pi rh') + '.'], text: 'Tyler fixed' }); } }] },
      { num: '14', parts: [
        { id: '14', level: 'EMG', make: function (r) { var v = find(function () { return [r.int(2, 6), r.int(6, 12)]; }, function (v) { var a = [2 * PI * v[0] * v[1], PI * v[0] * v[1], 2 * PI * v[0] * (v[0] + v[1]), PI * v[0] * v[0] * v[1]].map(function (x) { return rd(x, 1); }); return notEx(EX_CYL, v[0], v[1]) && a.every(function (x, i) { return a.every(function (y, j) { return i === j || Math.abs(x - y) > 2; }); }); });
          var rr = v[0], h = v[1], S0 = 2 * PI * rr * h;
          return P.mc(r, 'A cylinder has a radius of ' + rr + ' cm and a height of ' + h + ' cm. The area of its curved side, to the nearest tenth, is', [
            { html: N(rd(S0, 1), 1) + ' cm²', right: true },
            { html: N(rd(PI * rr * h, 1), 1) + ' cm²', why: 'The side is ' + t('2\\pi rh') + ': don’t forget the 2.', code: 'u3sa-side-2' },
            { html: N(rd(2 * PI * rr * (rr + h), 1), 1) + ' cm²', why: 'That’s the whole surface area (with both circles). The question asks only for the curved side.', code: 'u3sa-whole' },
            { html: N(rd(PI * rr * rr * h, 1), 1) + ' cm²', why: 'That’s ' + t('\\pi r^2h') + ', the volume. The curved side is ' + t('2\\pi rh') + '.', code: 'u3sa-volume' }],
            t('2\\times\\pi\\times ' + rr + '\\times ' + h + '=' + rw(S0) + '\\approx ' + N(rd(S0, 1), 1) + uT('cm²')), ['Curved side = ' + t('2\\pi rh') + '.'], 'MC side'); } }] },
      { num: '15', parts: [
        { id: '15', level: 'EMG', make: function (r) { var tr = r.pick(CONE_TRIPLES), rr = tr[0], h = tr[1], s = tr[2], A = PI * rr * (rr + s);
          return P.mc(r, 'A closed cone has a radius of ' + rr + ' cm, a height of ' + h + ' cm and a slant height of ' + s + ' cm. Its surface area, to the nearest tenth, is', [
            { html: N(rd(A, 1), 1) + ' cm²', right: true },
            { html: N(rd(PI * rr * s, 1), 1) + ' cm²', why: 'That’s only the curved side. A closed cone also has its base, ' + t('\\pi r^2') + '.', code: 'u3sa-cone-no-base' },
            { html: N(rd(PI * rr * (rr + h), 1), 1) + ' cm²', why: 'Use the <b>slant height</b> ' + s + ' cm, not the height ' + h + ' cm.', code: 'u3sa-height' },
            { html: N(rd(PI * 2 * rr * (2 * rr + s), 1), 1) + ' cm²', why: 'Use the radius ' + rr + ' cm, not the diameter.', code: 'u3sa-diam' }],
            t('\\pi\\times ' + rr + '^2+\\pi\\times ' + rr + '\\times ' + s + '=' + rw(PI * rr * rr) + '+' + rw(PI * rr * s) + '=' + rw(A)) + '<br>About ' + N(rd(A, 1), 1) + ' cm². The ' + h + ' cm height is not used.', ['Closed cone: ' + t('\\pi r^2+\\pi rs') + ', with the slant height.'], 'MC cone'); } }] },
      { num: '16', parts: [
        { id: '16', level: 'EMG', make: function (r) { var v = find(function () { var b = r.int(3, 9); return [b, b + r.int(2, 6)]; }, function (v) { return notEx(EX_PYR, v[0], v[1]); });
          return saPart('Numerical Response. A square pyramid has a base edge of ' + v[0] + ' m and a slant height of ' + v[1] + ' m. Its surface area is ____ m².', pyr(v[0], v[1], true, { u: 'm' }), { u: 'm', nr: true, hints: ['Base + 4 triangles.'], text: 'NR pyramid' }); } }] },
      { num: '17', parts: [
        { id: '17', level: 'EMG', make: function (r) { var v = find(function () { return [r.pick([1, 1.5, 2, 2.5]), r.pick([2, 2.5, 3, 3.5, 4, 4.5, 5, 6])]; }, function (v) { return v[0] !== v[1] && rd(2 * PI * v[0] * (v[0] + v[1]), 1) < 100; });
          return saPart('Numerical Response. A closed cylinder has a radius of ' + v[0] + ' ft and a height of ' + v[1] + ' ft. Its surface area, to the nearest tenth of a square foot, is ____ ft².', cyl(v[0], v[1], 2, { dp: 1, u: 'ft' }), { dp: 1, u: 'ft', nr: true, hints: [t('2\\pi r^2+2\\pi rh') + '.'], text: 'NR cylinder' }); } }] }
    ],
    extra: [
      { num: '1', section: 'A. Skills', parts: [
        { id: 'e1', level: 'BEG', make: function (r) {
          var rows = [{ id: 'a', html: '(a) one circle (the end of a cylinder or the base of a cone)' }, { id: 'b', html: '(b) the curved side of a cylinder' }, { id: 'c', html: '(c) one triangle face of a square pyramid' }, { id: 'd', html: '(d) the curved side of a cone' }];
          var cols = r.shuffle([{ id: 'c1', html: t('\\pi r^2') }, { id: 'c2', html: t('2\\pi rh') }, { id: 'c3', html: t('\\tfrac{1}{2}bs') }, { id: 'c4', html: t('\\pi rs') }, { id: 'c5', html: t('\\pi r^2h') }]);
          var want = { a: 'c1', b: 'c2', c: 'c3', d: 'c4' }, WHY = { a: 'A circle’s area is ' + t('\\pi r^2') + '.', b: 'The side of a cylinder unrolls to a rectangle ' + t('2\\pi r') + ' long and ' + t('h') + ' wide: ' + t('2\\pi rh') + '.', c: 'A triangle is ' + t('\\tfrac{1}{2}\\times\\text{base}\\times\\text{height}') + '; on a pyramid the height of a face is the slant height: ' + t('\\tfrac{1}{2}bs') + '.', d: 'The side of a cone flattens to a fan with area ' + t('\\pi rs') + '.' };
          return P.grid('Tap the area formula for each piece. (' + t('r') + ' = radius, ' + t('h') + ' = height, ' + t('b') + ' = base edge, ' + t('s') + ' = slant height)', rows, cols, want, { rowHead: 'Piece', colHead: 'Area formula', why: function (id) { return { code: 'u3l11-formula', hint: WHY[id] }; } },
            br(['(a) ' + t('\\pi r^2'), '(b) ' + t('2\\pi rh'), '(c) ' + t('\\tfrac{1}{2}bs'), '(d) ' + t('\\pi rs'), '(' + t('\\pi r^2h') + ' is the volume of a cylinder, not an area.)']), ['Think of the shape of each piece when it is laid flat.'], 'formula table'); } }] },
      { num: '2', stem: 'Find the surface area of each closed cylinder, to the nearest tenth.', parts: [
        { id: 'e2a', level: 'EMG', make: function (r) { var v = find(function () { return [r.int(4, 8), r.int(10, 18)]; }, function (v) { return notEx(EX_CYL, v[0], v[1]); }); return saPart('(a) radius ' + v[0] + ' cm, height ' + v[1] + ' cm', cyl(v[0], v[1], 2, { dp: 1 }), { dp: 1, u: 'cm', hints: [t('\\text{SA}=2\\pi r^2+2\\pi rh') + '.'], text: 'E closed cyl' }); } },
        { id: 'e2b', level: 'PRG', make: function (r) { var o = r.pick([['a hockey puck', 3, 1], ['a can of tuna', 3.5, 1.5], ['a round cookie tin', 8, 3], ['a can of paint', 6.5, 7.5], ['a round candle', 3, 4]]);
          return saPart('(b) ' + cap(o[0]) + ': diameter ' + N(o[1]) + ' in, height ' + N(o[2]) + ' in', cyl(o[1] / 2, o[2], 2, { d: true, dp: 1, u: 'in' }), { dp: 1, u: 'in', hints: ['Halve the diameter to get the radius.', t('\\text{SA}=2\\pi r^2+2\\pi rh') + '.'], text: 'E puck' }); } }] },
      { num: '3', stem: 'Find the surface area of each square pyramid.', parts: [
        { id: 'e3a', level: 'EMG', make: function (r) { var v = find(function () { var b = r.int(6, 12); return [b, b + r.int(1, 5)]; }, function (v) { return notEx(EX_PYR, v[0], v[1]); }); return saPart('(a) base edge ' + v[0] + ' cm, slant height ' + v[1] + ' cm', pyr(v[0], v[1], true), { u: 'cm', hints: ['Base + 4 triangles.'], text: 'E pyr' }); } },
        { id: 'e3b', level: 'EMG', make: function (r) { var v = find(function () { return [r.int(3, 6), r.int(4, 7) + 0.5]; }, function (v) { return notEx(EX_PYR, v[0], v[1]); }); return saPart('(b) base edge ' + v[0] + ' ft, slant height ' + t(mixT(v[1])) + ' ft', pyr(v[0], v[1], true, { u: 'ft' }), { u: 'ft', pre: [t(mixT(v[1]) + '=' + N(v[1]))], hints: ['Change ' + t(mixT(v[1])) + ' to a decimal first.', 'Base + 4 triangles.'], text: 'E pyr ft' }); } }] },
      { num: '4', stem: 'Find the surface area of each closed cone, to the nearest tenth.', parts: [
        { id: 'e4a', level: 'EMG', make: function (r) { var v = find(function () { var a = r.int(2, 5); return [a, a + r.int(2, 4)]; }, function (v) { return notEx(EX_CONE, v[0], v[1]); }); return saPart('(a) radius ' + v[0] + ' m, slant height ' + v[1] + ' m', cone(v[0], v[1], true, { dp: 1, u: 'm' }), { dp: 1, u: 'm', hints: [t('\\text{SA}=\\pi r^2+\\pi rs') + '.'], text: 'E cone' }); } },
        { id: 'e4b', level: 'PRG', make: function (r) { var v = find(function () { var d = r.int(3, 6) * 2; return [d, d / 2 + r.int(3, 6)]; }, function () { return true; }); return saPart('(b) diameter ' + v[0] + ' in, slant height ' + v[1] + ' in', cone(v[0] / 2, v[1], true, { d: true, dp: 1, u: 'in' }), { dp: 1, u: 'in', hints: ['Halve the diameter.', t('\\text{SA}=\\pi r^2+\\pi rs') + '.'], text: 'E cone d' }); } }] },
      { num: '5', stem: function (sh) { return 'Here is a square pyramid.' + solid('sqpyramid', { s: sh.b + ' m', sl: sh.s + ' m', h: sh.h + ' m', width: 210 }); },
        shared: function (r) { var tr = r.pick(TRIPLES.filter(function (x) { return !(x[0] === 5 && x[1] === 12); })); return { b: 2 * tr[0], h: tr[1], s: tr[2] }; },
        parts: [
          { id: 'e5a', level: 'PRG', make: function (r, sh) { return saPart('(a) Find its surface area.', pyr(sh.b, sh.s, true, { hgt: sh.h, u: 'm' }), { u: 'm', hints: ['Use the slant height for the triangles.'], text: 'E pyr picture' }); } },
          { id: 'e5b', level: 'EMG', make: function (r, sh) { return P.mc(r, '(b) Which length in the picture do you <b>not</b> need?', [
            { html: 'The height, ' + sh.h + ' m', right: true },
            { html: 'The slant height, ' + sh.s + ' m', why: 'The slant height is the height of each triangle face: you need it for ' + t('\\tfrac{1}{2}bs') + '.', code: 'u3sa-need-s' },
            { html: 'The base edge, ' + sh.b + ' m', why: 'You need the base edge for the square and for each triangle.', code: 'u3sa-need-b' },
            { html: 'You need all three.', why: 'Surface area uses the base edge and the slant height. The height inside the pyramid is not used.', code: 'u3sa-need-all' }],
            'Surface area uses the base edge and the <b>slant height</b>. The height, ' + sh.h + ' m, goes up the inside and is not needed.', ['Which length is on the outside of a face?'], 'not needed'); } }] },
      { num: '6', section: 'B. Applying', stem: function (sh) { return 'A round hay bale is a cylinder with a diameter of ' + N(sh.d) + ' m and a width (height) of ' + N(sh.w) + ' m. Net wrap covers only the curved side, not the two flat ends.'; },
        shared: function (r) { return { d: r.pick([1.2, 1.5, 1.6, 1.8]), w: r.pick([1, 1.2, 1.5]), n: r.pick([25, 30, 40, 45, 50, 60]) }; },
        parts: [
          { id: 'e6a', level: 'PRG', make: function (r, sh) { return saPart('(a) How much wrap covers one bale, to the nearest tenth?', cyl(sh.d / 2, sh.w, 0, { d: true, dp: 1, u: 'm' }), { dp: 1, u: 'm', hints: ['Side only: ' + t('2\\pi rh') + ' (or ' + t('\\pi d\\times h') + ').'], text: 'bale' }); } },
          { id: 'e6b', level: 'PRG', make: function (r, sh) { var one = PI * sh.d * sh.w, A = one * sh.n;
            return num('(b) How much wrap covers ' + sh.n + ' bales, to the nearest square metre?', A, { dp: 0, exact: A, after: 'm²', area: true, bad: [[rd(one, 1) * sh.n, 'u3sa-early', 'Close! You used the rounded answer from (a). Use the unrounded value, then round at the end.', 'form'], [one, 'u3l11-one-hat', 'That’s one bale. Multiply by ' + sh.n + '.'], [(one + 2 * PI * sh.d * sh.d / 4) * sh.n, 'u3sa-no-ends', 'The wrap covers only the curved side, not the ends.']],
              sol: [t(raw(one, 3) + '\\times ' + sh.n + eqR(A, 0) + uT('m²'))], hints: ['Multiply the wrap for one bale (unrounded) by ' + sh.n + '.'], text: 'bales' }); } }] },
      { num: '7', parts: [
        { id: 'e7', level: 'PRG', make: function (r) { var v = [r.pick([9.5, 10.5, 11.5, 12]), r.pick([24.5, 26, 27.5, 28.5])];
          return saPart('A traffic cone (without its square base) is a cone with no bottom. It is ' + t(mixT(v[0])) + ' in across at the bottom and has a slant height of ' + t(mixT(v[1])) + ' in. How much orange plastic is in the curved side, to the nearest square inch?', cone(v[0] / 2, v[1], false, { d: true, dp: 0, u: 'in' }), { dp: 0, u: 'in', pre: [t(mixT(v[0]) + '=' + N(v[0])) + ' in and ' + t(mixT(v[1]) + '=' + N(v[1])) + ' in'], hints: ['No bottom: side only, ' + t('\\pi rs') + '.', 'Halve the diameter to get the radius.'], text: 'traffic cone' }); } }] },
      { num: '8', parts: [
        { id: 'e8', level: 'PRG', make: function (r) { var v = [r.pick([12, 15, 18, 21, 24]), r.pick([4, 4.5, 3.5])];
          return saPart('A round above-ground pool has a diameter of ' + v[0] + ' ft and walls ' + N(v[1]) + ' ft high. The vinyl liner covers the floor and the inside of the walls (no top). How much vinyl is in the liner, to the nearest tenth?', cyl(v[0] / 2, v[1], 1, { d: true, dp: 1, u: 'ft', endWord: 'the floor' }), { dp: 1, u: 'ft', hints: ['1 circle (the floor) + the side.'], text: 'pool liner' }); } }] },
      { num: '9', stem: function (sh) { return 'A children’s play tent is a cone with no floor. It is ' + N(sh.d) + ' m across the bottom and has a slant height of ' + N(sh.s) + ' m.'; },
        shared: function (r) { return find(function () { return { d: r.pick([1.2, 1.4, 1.6, 1.8, 2]), s: r.pick([1.8, 2, 2.2, 2.4]), p: r.pick([7.5, 8.5, 9.25, 10.75, 6.95]) }; }, function (s) { return s.s > s.d / 2 + 0.5; }); },
        parts: [
          { id: 'e9a', level: 'PRG', make: function (r, sh) { return saPart('(a) How much canvas is in the tent, to the nearest tenth?', cone(sh.d / 2, sh.s, false, { d: true, dp: 1, u: 'm' }), { dp: 1, u: 'm', hints: ['No floor: side only, ' + t('\\pi rs') + '.'], text: 'play tent' }); } },
          { id: 'e9b', level: 'EMG', make: function (r, sh) { var A = PI * sh.d / 2 * sh.s, a1 = rd(A, 1), c = a1 * sh.p;
            return num('(b) Canvas costs ' + Mp(sh.p) + ' per m². Use your answer to (a) to find the cost of the canvas.', rd(c, 2), { money: true, exact: c, alts: [rd(A * sh.p, 2)], bad: [[sh.p / a1, 'u3l11-div', 'Multiply the area by the price per m².'], [(A + PI * sh.d * sh.d / 4) * sh.p, 'u3sa-cone-base', 'Use the canvas from (a) (no floor).']],
              sol: [t(N(a1) + '\\times ' + M(sh.p) + '=' + M(c))], hints: ['Cost = area × price per m².'], text: 'tent cost' }); } }] },
      { num: '10', stem: function (sh) { return 'Each fence post on a ranch has a small wooden cap shaped like a square pyramid. The base edge is ' + sh.b + ' in and the slant height is ' + sh.s + ' in. Only the 4 triangles get painted.'; },
        shared: function (r) { return find(function () { return { b: r.pick([4, 5, 6, 8]), s: r.int(3, 6), n: r.pick([12, 18, 24, 30, 36, 48]) }; }, function (s) { var x = 2 * s.b * s.s * s.n / 144; return decs(x) <= 2 && s.s > s.b / 2; }); },
        parts: [
          { id: 'e10a', level: 'EMG', make: function (r, sh) { return saPart('(a) Find the area to paint on one cap.', pyr(sh.b, sh.s, false, { u: 'in' }), { u: 'in', hints: ['Only the 4 triangles: ' + t('4\\times\\tfrac{1}{2}bs') + '.'], text: 'post cap' }); } },
          { id: 'e10b', level: 'PRG', make: function (r, sh) { var one = 2 * sh.b * sh.s, A = one * sh.n;
            return fields('(b) Find the area for ' + sh.n + ' caps, in in² and in ft². ' + t('(1\\text{ ft}^2=144\\text{ in}^2)'), [
              { label: 'Area:', name: 'in²', ans: A, after: 'in²', bad: [[one, 'u3l11-per-cap', 'That’s one cap. Multiply by ' + sh.n + '.'], [(one + sh.b * sh.b) * sh.n, 'u3sa-pyr-base', 'Only the 4 triangles get painted.']] },
              { label: 'Area:', name: 'ft²', ans: A / 144, after: 'ft²', bad: [[A / 12, 'u3l11-in2-ft2', '1 ft = 12 in, but 1 ft² = 12 × 12 = 144 in². Divide by 144.'], [A * 144, 'u3l11-in2-way', 'ft² is the bigger unit, so divide by 144.']] }],
              [t(sh.n + '\\times ' + one + '=' + N(A) + uT('in²')), t(N(A) + '\\div 144=' + N(q(A / 144)) + uT('ft²'))], ['Multiply one cap by ' + sh.n + ', then divide by 144 for ft².'], 'caps'); } }] },
      { num: '11', parts: [
        { id: 'e11', level: 'BEG', make: function (r) { var k = r.pick(['pipe', 'pail', 'can', 'funnel']), OBJ = { pipe: 'A section of drainpipe has no ends.', pail: 'A metal pail has a bottom but no lid.', can: 'A can of soup has a top and a bottom.', funnel: 'A kitchen funnel is a cone with no base.' };
          var F = [{ k: 'can', tx: '2\\pi r^2+2\\pi rh', why: 'That’s a closed cylinder (two circles + the side).' }, { k: 'pipe', tx: '2\\pi rh', why: 'That’s the curved side only, like a pipe.' }, { k: 'pail', tx: '\\pi r^2+2\\pi rh', why: 'That’s a cylinder with one end (one circle + the side).' }, { k: 'funnel', tx: '\\pi rs', why: 'That’s the curved side of a cone.' }];
          return P.mc(r, OBJ[k] + ' Which formula gives the area of metal in it?', F.map(function (f) { return f.k === k ? { html: t(f.tx), right: true } : { html: t(f.tx), why: f.why + ' Which pieces does this object have?', code: 'u3l11-pieces' }; }),
            F.filter(function (f) { return f.k === k; })[0].why.replace('That’s', 'It is') + ' So ' + t(F.filter(function (f) { return f.k === k; })[0].tx) + '.', ['Ask: which pieces are really there?'], 'which formula', true); } }] },
      { num: '12', parts: [
        { id: 'e12', level: 'EMG', make: function (r) { var v = find(function () { var a = r.int(3, 7); return [a, a + r.int(2, 6)]; }, function (v) { return notEx(EX_CONE, v[0], v[1]) && PI * v[0] * (v[0] + v[1]) < 9999; });
          return saPart('Numerical Response. A closed cone has a radius of ' + v[0] + ' cm and a slant height of ' + v[1] + ' cm. Its surface area, to the nearest square centimetre, is ____ cm².', cone(v[0], v[1], true, { dp: 0 }), { dp: 0, u: 'cm', nr: true, hints: [t('\\pi r^2+\\pi rs') + '.'], text: 'E NR cone' }); } }] },
      { num: '13', section: 'C. Stretch', stem: function (sh) { return 'A candle maker wraps each candle in foil, covering every face. A pyramid candle has a square base ' + sh.b + ' cm on each side and a slant height of ' + sh.s + ' cm. A cylinder candle has a diameter of ' + sh.b + ' cm and a height of ' + sh.s + ' cm.'; },
        shared: function (r) { return { b: r.pick([5, 6, 7, 8]), s: r.pick([7, 8, 9, 10, 12]), n: r.pick([150, 200, 250, 300]) }; },
        parts: [
          { id: 'e13ai', sub: 'a i', level: 'ADV', make: function (r, sh) { var p = pyr(sh.b, sh.s, true), c = cyl(sh.b / 2, sh.s, 2, { d: true, dp: 1 });
            return fields('(a) Find the foil for each candle (the cylinder to the nearest tenth).', [{ label: 'Pyramid:', name: 'Pyramid', ans: p.ans, after: 'cm²', bad: p.bad }, { label: 'Cylinder:', name: 'Cylinder', ans: c.ans, dp: 1, exact: c.ans, after: 'cm²', bad: c.bad }],
              ['Pyramid: ' + t(sh.b + '\\times ' + sh.b + '+4\\times\\tfrac{1}{2}\\times ' + sh.b + '\\times ' + sh.s + '=' + N(p.ans) + uT('cm²')), 'Cylinder (' + t('r=' + N(sh.b / 2)) + '): ' + t('2\\pi\\times ' + N(sh.b / 2) + '^2+2\\pi\\times ' + N(sh.b / 2) + '\\times ' + sh.s + '=' + rw(c.ans) + uT('cm²'))], ['Pyramid: base + 4 triangles. Cylinder: 2 circles + side.'], 'candles'); } },
          { id: 'e13aii', sub: 'a ii', level: 'PRG', make: function (r, sh) { var p = sh.b * sh.b + 2 * sh.b * sh.s, c = 2 * PI * sh.b / 2 * (sh.b / 2 + sh.s);
            return P.mc(r, '(a) Which candle needs less foil?', [{ html: 'The pyramid candle: its surface area is smaller.', right: true }, { html: 'The cylinder candle: its surface area is smaller.', why: 'Compare your two answers: the smaller surface area needs less foil.', code: 'u3l11-cand' }, { html: 'They need the same foil: the measurements are the same.', why: 'The same numbers give different shapes. Compare the surface areas.', code: 'u3l11-cand-same' }],
              'Pyramid: ' + N(p) + ' cm²; cylinder: about ' + N(rd(c, 1)) + ' cm². The <b>pyramid</b> candle needs less foil.', ['Use your answers to (a).'], 'less foil'); } },
          { id: 'e13b', sub: 'b', level: 'MAS', make: function (r, sh) { var p = sh.b * sh.b + 2 * sh.b * sh.s, c = 2 * PI * sh.b / 2 * (sh.b / 2 + sh.s), dd = c - p, tot = dd * sh.n, m2 = tot / 10000;
            return num('(b) How much foil is saved by wrapping ' + sh.n + ' pyramid candles instead of ' + sh.n + ' cylinder candles? Answer in m², to the nearest tenth.', m2, { dp: 1, exact: m2, after: 'm²', area: true,
              bad: [[c * sh.n / 10000, 'u3l11-diff', 'Find the <b>difference</b> for one candle first (cylinder − pyramid), then multiply.'], [p * sh.n / 10000, 'u3l11-diff', 'Saved = cylinder − pyramid. Subtract first.'], [tot / 100, 'u3l11-m2-100', '1 m² = 10 000 cm². Divide by 10 000.'], [tot, 'u3l11-m2-cm', 'That’s in cm². Divide by 10 000 to get m².'], [dd / 10000, 'u3l11-one-hat', 'Multiply the saving for one candle by ' + sh.n + '.']],
              sol: [t(rw(c) + '-' + N(p) + '=' + rw(dd) + uT('cm²')) + ' per candle', t(rw(dd) + '\\times ' + sh.n + '=' + raw(tot, 1) + uT('cm²')), t(raw(tot, 1) + '\\div 10\\,000' + eqR(m2, 1) + uT('m²')) + ' saved'], hints: ['Saving per candle = cylinder − pyramid.', 'Multiply by ' + sh.n + ', then divide by 10 000 for m².'], text: 'foil saved' }); } }] },
      { num: '14', stem: function (sh) { return 'Kai says, “If you double both the radius and the height of a closed cylinder, its surface area doubles.” Test his idea with ' + t('r=' + sh.r) + ' cm and ' + t('h=' + sh.h) + ' cm.'; },
        shared: function (r) { return find(function () { return { r: r.int(2, 5), h: r.int(3, 8) }; }, function (s) { return s.r !== s.h && !(s.r === 2 && s.h === 5); }); },
        parts: [
          { id: 'e14a', level: 'ADV', make: function (r, sh) { var a = cyl(sh.r, sh.h, 2, { dp: 1 }), b = cyl(2 * sh.r, 2 * sh.h, 2, { dp: 1 });
            return fields('(a) Find both surface areas, to the nearest tenth.', [{ label: 'r = ' + sh.r + ', h = ' + sh.h + ':', name: 'Original', ans: a.ans, dp: 1, exact: a.ans, after: 'cm²', bad: a.bad }, { label: 'r = ' + 2 * sh.r + ', h = ' + 2 * sh.h + ':', name: 'Doubled', ans: b.ans, dp: 1, exact: b.ans, after: 'cm²', bad: b.bad.concat([[2 * a.ans, 'u3l11-ratio-2', 'That’s just double the first one. Work it out with the new radius ' + 2 * sh.r + ' and height ' + 2 * sh.h + '.']]) }],
              ['r = ' + sh.r + ', h = ' + sh.h + ': ' + a.sol.slice(-1)[0], 'r = ' + 2 * sh.r + ', h = ' + 2 * sh.h + ': ' + b.sol.slice(-1)[0]], ['Use ' + t('2\\pi r^2+2\\pi rh') + ' twice: once with each radius and height.'], 'Kai SAs'); } },
          { id: 'e14b', level: 'ADV', make: function (r, sh) { var a = 2 * PI * sh.r * (sh.r + sh.h), b = 4 * a;
            var p = num('(b) Divide: new surface area ÷ original surface area. How many times as big is the new surface area?', 4, { alts: [], bad: [[2, 'u3l11-ratio-2', 'Divide your two answers from (a): the new one ÷ the original one.'], [8, 'u3l11-ratio-8', 'Divide your two answers from (a).'], [0.25, 'u3l11-ratio-flip', 'Divide the <b>new</b> surface area by the original one.']],
              sol: [t(rw(b) + '\\div ' + rw(a) + '=4')], hints: ['New SA ÷ original SA.'], text: 'Kai ratio' });
            var base = p.check; p.check = function (resp) { var x = readNum(resp); if (!x.res && Math.abs(x.v - 4) < 0.011) return ok(); return base(resp); }; p.good = ['4.0', '4.00']; return p; } },
          { id: 'e14c', level: 'PRG', make: function (r, sh) { return P.mc(r, '(c) Is Kai right?', [
            { html: 'No. The surface area becomes 4 times as big, not 2 times.', right: true },
            { html: 'Yes. The new surface area is 2 times as big.', why: 'Check (b): the new surface area is 4 times as big.', code: 'u3l11-kai-yes' },
            { html: 'No. The surface area becomes 8 times as big.', why: '8 times is what happens to the <b>volume</b>. Check (b).', code: 'u3l11-kai-8' },
            { html: 'You can’t tell without the volume.', why: 'You found both surface areas in (a). Compare them.', code: 'u3l11-kai-cant' }],
            'The new surface area is 4 times the original (each piece has two lengths multiplied, and each doubles: ' + t('2\\times 2=4') + '). Kai is not right.', ['Use your answer to (b).'], 'Kai right'); } }] },
      { num: '15', parts: [
        { id: 'e15', level: 'MAS', make: function (r) { var v = find(function () { var b = r.pick([4, 5, 6, 8, 10]), s = r.pick([3, 4, 5, 6, 7, 8, 9, 2.5, 3.5, 4.5]); return [b, s]; }, function (v) { return !(v[0] === 6 && v[1] === 5) && v[1] > v[0] / 2 + 0.5; });
          var b = v[0], s = v[1], A = b * b + 2 * b * s, four = A - b * b, one = four / 4;
          return num('A square pyramid has a surface area of ' + N(A) + ' cm². Its base edge is ' + b + ' cm. Find its slant height.', s, { after: 'cm',
            bad: [[A / (2 * b), 'u3l11-rev-base', 'First subtract the square base (' + t(b + '\\times ' + b) + ') to find the area of the 4 triangles.'], [one, 'u3l11-rev-tri', 'That’s the area of one triangle. Now solve ' + t('\\tfrac{1}{2}\\times ' + b + '\\times s=' + N(one)) + '.'], [four / (4 * b), 'u3l11-rev-half', 'Each triangle is ' + t('\\tfrac{1}{2}\\times b\\times s') + ': divide by ' + t('\\tfrac{1}{2}\\times ' + b + '=' + N(b / 2)) + ', not by ' + b + '.'], [four, 'u3l11-rev-tri', 'That’s the area of the 4 triangles. Divide to find the slant height.']],
            sol: ['Base: ' + t(b + '\\times ' + b + '=' + b * b + uT('cm²')) + ', so the 4 triangles are ' + t(N(A) + '-' + b * b + '=' + N(four) + uT('cm²')), 'One triangle: ' + t(N(four) + '\\div 4=' + N(one) + uT('cm²')), t('\\tfrac{1}{2}\\times ' + b + '\\times s=' + N(one)) + ', so ' + t(N(b / 2) + 's=' + N(one)) + ' and ' + t('s=' + N(s)) + ' cm', 'Check: ' + t(b * b + '+4\\times\\tfrac{1}{2}\\times ' + b + '\\times ' + N(s) + '=' + N(A)) + ' ✓'],
            hints: ['Work backwards: take away the base, then find one triangle.', 'One triangle = ' + t('\\tfrac{1}{2}\\times b\\times s') + '. Divide by ' + t('\\tfrac{1}{2}\\times b') + ' to find ' + t('s') + '.'], text: 'reverse slant' }); } }] }
    ]
  });
})(window);
